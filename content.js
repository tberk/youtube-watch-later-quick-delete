// Function to remove the video
async function removeVideo(row) {
  // 1. Click the "three dots" action menu button
  const menuButton = row.querySelector('#button.ytd-menu-renderer');
  if (!menuButton) return; // Safety check
  menuButton.click();

  // 2. Wait a moment for the popup menu to appear
  setTimeout(() => {
    // We select all menu items
    const menuItems = document.querySelectorAll('ytd-menu-service-item-renderer');

    // The start of the unique "Trash Can" SVG path data
    const TRASH_ICON_PATH_START = "M19 3h-4V2a1 1 0 00-1-1h-4a1 1 0 00-1 1v1H5";

    const removeBtn = Array.from(menuItems).find(item => {
      const path = item.querySelector('path');
      // Check if the item has an icon and if that icon matches our trash can
      return path && path.getAttribute('d').startsWith(TRASH_ICON_PATH_START);
    });

    if (removeBtn) {
      removeBtn.click();
    }
  }, 100);
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
const observer = new MutationObserver(() => {
  injectButtons();
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial run
injectButtons();
