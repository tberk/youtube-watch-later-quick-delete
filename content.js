// Function to remove the video
async function removeVideo(row) {
  // 1. Click the "three dots" action menu button
  const menuButton = row.querySelector('#button.ytd-menu-renderer');
  if (!menuButton) return; // Safety check
  menuButton.click();

  // 2. Wait a moment for the popup menu to appear
  setTimeout(() => {
    const menuItems = document.querySelectorAll('ytd-menu-service-item-renderer');
    const removeBtn = Array.from(menuItems).find(item =>
      item.textContent.trim().toLowerCase().includes('remove from')
    );

    if (removeBtn) {
      removeBtn.click();
    }
  }, 100); // Increased slightly to 100ms to be safe
}

// Function to inject the button
function injectButtons() {
  // STRICT CHECK: Only run if we are strictly on the Watch Later playlist
  if (!window.location.href.includes('list=WL')) return;

  const videoRows = document.querySelectorAll('ytd-playlist-video-renderer:not(.quick-del-added)');

  videoRows.forEach(row => {
    row.classList.add('quick-del-added');

    const indexContainer = row.querySelector('#index-container');

    if (indexContainer) {
      const btn = document.createElement('button');
      btn.innerText = '✕';
      btn.className = 'quick-delete-btn';
      btn.title = 'Quick Remove';

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        removeVideo(row);
      });

      indexContainer.after(btn);
    }
  });
}

// Observe changes for infinite scrolling/dynamic loading
// We observe document.body to catch navigation changes (SPA) and new rows
const observer = new MutationObserver(() => {
  injectButtons();
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial run
injectButtons();
