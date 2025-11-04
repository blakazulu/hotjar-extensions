// Track if we've already shown a notification for this page load
let notificationShown = false;
let notificationTimeout = null;

console.log('[Hotjar Blocker] Content script loaded');

// Check for blocked requests when page loads
setTimeout(() => {
  checkForBlocks();
}, 1000); // Wait 1 second after page load

// Also check periodically for the first 5 seconds
let checkCount = 0;
const checkInterval = setInterval(() => {
  checkCount++;
  if (checkCount > 5 || notificationShown) {
    clearInterval(checkInterval);
    return;
  }
  checkForBlocks();
}, 1000);

// Check if there are any blocked requests
function checkForBlocks() {
  if (notificationShown) return;

  chrome.runtime.sendMessage({ action: 'getBlockedCount' }, (response) => {
    if (chrome.runtime.lastError) {
      console.log('[Hotjar Blocker] Error getting blocked count:', chrome.runtime.lastError);
      return;
    }

    if (response && response.count > 0 && !notificationShown) {
      console.log('[Hotjar Blocker] Found', response.count, 'blocked requests');
      showNotification(response.count);
      notificationShown = true;
    }
  });
}

// Also listen for messages from background script (for immediate notifications)
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'hotjarBlocked' && !notificationShown) {
    console.log('[Hotjar Blocker] Received hotjarBlocked message');
    showNotification(message.count);
    notificationShown = true;
  }
});

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
  notification.innerHTML = `
    <div class="hb-notification-content">
      <div class="hb-icon">🛡️</div>
      <div class="hb-text">
        <div class="hb-title">Hotjar Blocked!</div>
        <div class="hb-subtitle">${count} tracking ${count === 1 ? 'request' : 'requests'} blocked on this page</div>
      </div>
      <button class="hb-close" aria-label="Close">&times;</button>
    </div>
  `;

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
  const closeBtn = notification.querySelector('.hb-close');
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
