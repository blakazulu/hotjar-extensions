// Track if we've already shown a notification for this page load
let notificationShown = false;
let notificationTimeout = null;

console.log('[Hotjar Blocker] Content script loaded');

// PRIORITY 1: Listen for messages from background script IMMEDIATELY (for real-time notifications)
browser.runtime.onMessage.addListener((message) => {
  console.log('[Hotjar Blocker] Received message:', message);
  if (message.action === 'hotjarBlocked' && !notificationShown) {
    console.log('[Hotjar Blocker] Showing notification from background message');
    showNotification(message.count);
    notificationShown = true;
  }
});

// PRIORITY 2: Check for blocked requests after page is stable (backup method)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => checkForBlocks(), 2000);
  });
} else {
  // Already loaded
  setTimeout(() => checkForBlocks(), 2000);
}

// PRIORITY 3: Periodic checks for the first 10 seconds (backup for slow-loading pages)
let checkCount = 0;
const checkInterval = setInterval(() => {
  checkCount++;
  if (checkCount > 5 || notificationShown) {
    clearInterval(checkInterval);
    return;
  }
  checkForBlocks();
}, 2000); // Check every 2 seconds

// Check if there are any blocked requests
function checkForBlocks() {
  if (notificationShown) return;

  browser.runtime.sendMessage({ action: 'getBlockedCount' }).then((response) => {
    if (response && response.count > 0 && !notificationShown) {
      console.log('[Hotjar Blocker] Found', response.count, 'blocked requests via polling');
      showNotification(response.count);
      notificationShown = true;
    }
  }).catch((error) => {
    console.log('[Hotjar Blocker] Error getting blocked count:', error);
  });
}

// Show beautiful notification
function showNotification(count) {
  // Remove any existing notification
  const existing = document.getElementById('hotjar-blocker-notification');
  if (existing) {
    existing.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'hotjar-blocker-notification';

  const content = document.createElement('div');
  content.className = 'hb-notification-content';

  const icon = document.createElement('div');
  icon.className = 'hb-icon';
  icon.textContent = '🛡️';

  const textDiv = document.createElement('div');
  textDiv.className = 'hb-text';

  const title = document.createElement('div');
  title.className = 'hb-title';
  title.textContent = 'Hotjar Blocked!';

  const subtitle = document.createElement('div');
  subtitle.className = 'hb-subtitle';
  subtitle.textContent = `${count} tracking ${count === 1 ? 'request' : 'requests'} blocked on this page`;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'hb-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '×';

  textDiv.appendChild(title);
  textDiv.appendChild(subtitle);

  content.appendChild(icon);
  content.appendChild(textDiv);
  content.appendChild(closeBtn);

  notification.appendChild(content);

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #hotjar-blocker-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      animation: hb-slideIn 0.3s ease-out;
    }

    @keyframes hb-slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes hb-slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }

    .hb-notification-content {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(102, 126, 234, 0.3);
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      max-width: 400px;
    }

    .hb-icon {
      font-size: 32px;
      line-height: 1;
      flex-shrink: 0;
    }

    .hb-text {
      flex: 1;
    }

    .hb-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .hb-subtitle {
      font-size: 13px;
      opacity: 0.95;
      font-weight: 400;
    }

    .hb-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      font-size: 24px;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      line-height: 1;
      transition: background 0.2s;
      flex-shrink: 0;
    }

    .hb-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .hb-notification-content.hb-closing {
      animation: hb-slideOut 0.3s ease-in forwards;
    }
  `;

  // Append to document
  document.head.appendChild(style);
  document.body.appendChild(notification);

  // Close button handler
  closeBtn.addEventListener('click', () => {
    hideNotification(notification);
  });

  // Auto-hide after 3 seconds
  notificationTimeout = setTimeout(() => {
    hideNotification(notification);
  }, 3000);
}

function hideNotification(notification) {
  if (!notification || !notification.parentElement) return;

  // Clear timeout if manually closed
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }

  // Add closing animation
  const content = notification.querySelector('.hb-notification-content');
  content.classList.add('hb-closing');

  // Remove after animation
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 300);
}

// Reset notification shown flag on page navigation
window.addEventListener('beforeunload', () => {
  notificationShown = false;
});
