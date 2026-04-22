const loader = document.getElementById("loader");
const chatContainer = document.getElementById("chat-container");

const chat = document.getElementById("chat");
const input = document.getElementById("question");
const sendBtn = document.getElementById("send");

let videoId = null;

// Extract video ID from URL
function getVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("v");
}

// Call backend to process video
async function processVideo() {
  videoId = getVideoId();

  try {
    await fetch("http://localhost:8089/process-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: window.location.href
      })
    });

    // Hide loader, show chat
    loader.style.display = "none";
    chatContainer.style.display = "flex";

  } catch (err) {
    loader.innerText = "Failed to process video ❌";
    console.error(err);
  }
}

// Chat function
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// Send question
sendBtn.onclick = async () => {
  const question = input.value.trim();
  if (!question) return;

  addMessage(question, "user");
  input.value = "";

  addMessage("Thinking...", "bot");

  const res = await fetch("http://localhost:8089/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: question,
      video_id: videoId
    })
  });

  const data = await res.json();

  // Replace last bot message
  chat.lastChild.textContent = data.answer;
};


input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

// Run on load
processVideo();