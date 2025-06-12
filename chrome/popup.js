document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("clipButton");
  btn.addEventListener("click", async () => {
    // Query the active tab in the current window
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      console.error("No active tab found.");
      return;
    }

    // Send a simple message to the content script
    chrome.tabs.sendMessage(tab.id, "clipCoupons");
  });
});
