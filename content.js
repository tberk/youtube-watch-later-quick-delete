// Function to remove the video
async function removeVideo(row) {
  // 1. Click the "three dots" action menu button
  const menuButton = row.querySelector('#button.ytd-menu-renderer');
  menuButton.click();

  // 2. Wait a moment for the popup menu to appear in the DOM
  // YouTube renders the menu at the end of <body>, not inside the row
  setTimeout(() => {
    const menuItems = document.querySelectorAll('ytd-menu-service-item-renderer');
    const removeBtn = Array.from(menuItems).find(item =>
      item.textContent.trim().toLowerCase().includes('remove from')
    );

    if (removeBtn) {
      removeBtn.click();
    }
  }, 50);
}

// Function to inject the button
function injectButtons() {
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

      // Insert between index and thumbnail
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
