let sidebarVisible = true;
let sidebarInjected = false;

function injectSidebar() {
  if (sidebarInjected) return;

  // Sidebar
  const container = document.createElement("div");
  container.id = "yt-ai-sidebar";

  container.innerHTML = `
    <iframe src="${chrome.runtime.getURL("sidebar.html")}" 
      style="width:100%; height:100%; border:none;">
    </iframe>
  `;

  Object.assign(container.style, {
    position: "fixed",
    top: "0",
    right: "0",
    width: "350px",
    height: "100%",
    zIndex: "9999",
    background: "#0f0f0f",
    borderLeft: "1px solid #303030",
    transition: "transform 0.3s ease"
  });

  // Toggle Button
  const toggleBtn = document.createElement("div");
  toggleBtn.id = "yt-ai-toggle";
  toggleBtn.innerText = "🤖";

  Object.assign(toggleBtn.style, {
    position: "fixed",
    top: "10px",
    right: "350px",
    width: "40px",
    height: "40px",
    background: "#212121",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px 0 0 8px",
    cursor: "pointer",
    zIndex: "10000",
    border: "1px solid #303030"
  });

  toggleBtn.onclick = () => {
    sidebarVisible = !sidebarVisible;

    container.style.transform = sidebarVisible
      ? "translateX(0)"
      : "translateX(100%)";

    toggleBtn.style.right = sidebarVisible ? "350px" : "0px";
  };

  document.body.appendChild(container);
  document.body.appendChild(toggleBtn);

  sidebarInjected = true;
}

// Detect YouTube video page
setInterval(() => {
  if (window.location.href.includes("watch")) {
    injectSidebar();
  }
}, 2000);