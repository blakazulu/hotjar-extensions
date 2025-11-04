// Store domains in memory for quick access
let protectedDomains = [];

// Track blocked requests per tab
const blockedRequests = new Map(); // tabId -> array of blocked URLs
const notificationSent = new Map(); // tabId -> boolean (whether notification was sent)

// Load domains from storage on startup
browser.storage.sync.get('domains').then((result) => {
  protectedDomains = result.domains || [];
  console.log('[Hotjar Blocker] ✅ Extension loaded with protected domains:', protectedDomains);
  if (protectedDomains.length === 0) {
    console.log('[Hotjar Blocker] ⚠️ No domains protected yet. Add domains via the extension popup.');
  }
}).catch((error) => {
  console.error('[Hotjar Blocker] ❌ Error loading domains from storage:', error);
});

// Listen for messages from popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateDomains') {
    protectedDomains = message.domains || [];
    console.log('[Hotjar Blocker] 🔄 Domains updated:', protectedDomains);
  } else if (message.action === 'getBlockedRequests') {
    const tabId = message.tabId;
    const blocked = blockedRequests.get(tabId) || [];
    sendResponse({ blocked });
  } else if (message.action === 'getBlockedCount') {
    // Content script asking for blocked count
    const tabId = sender.tab?.id;
    if (tabId) {
      const blocked = blockedRequests.get(tabId) || [];
      console.log('[Hotjar Blocker] Sending blocked count to tab', tabId, ':', blocked.length);
      sendResponse({ count: blocked.length });
    } else {
      sendResponse({ count: 0 });
    }
  }
  return true; // Keep message channel open
});

// Clean up when tab is closed
browser.tabs.onRemoved.addListener((tabId) => {
  console.log('[Hotjar Blocker] Tab', tabId, 'closed, clearing data');
  blockedRequests.delete(tabId);
  notificationSent.delete(tabId);
});

// Clean up when tab navigates away
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only clear on actual navigation (status changes to loading with new URL)
  if (changeInfo.status === 'loading' && changeInfo.url) {
    console.log('[Hotjar Blocker] Tab', tabId, 'navigating to new URL, clearing data');
    blockedRequests.delete(tabId);
    notificationSent.delete(tabId);
    // Clear badge
    browser.action.setBadgeText({ text: '', tabId });
  }
});

// Update extension badge
function updateBadge(tabId, count) {
  console.log('[Hotjar Blocker] updateBadge called - tabId:', tabId, 'count:', count);
  if (count > 0) {
    browser.action.setBadgeText({ text: count.toString(), tabId })
      .then(() => console.log('[Hotjar Blocker] Badge text set successfully'))
      .catch(err => console.error('[Hotjar Blocker] Error setting badge text:', err));
    browser.action.setBadgeBackgroundColor({ color: '#ef4444', tabId })
      .catch(err => console.error('[Hotjar Blocker] Error setting badge color:', err));
  } else {
    browser.action.setBadgeText({ text: '', tabId })
      .catch(err => console.error('[Hotjar Blocker] Error clearing badge:', err));
  }
}

// Block Hotjar requests
browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Get the initiator URL - Firefox uses documentUrl
    const initiator = details.documentUrl || details.originUrl || '';
    const tabId = details.tabId;

    if (!initiator || tabId === -1) {
      return { cancel: false };
    }

    // Check if the request is from any of our protected domains
    const isProtectedDomain = protectedDomains.some((domain) => {
      return initiator.includes(domain);
    });

    if (isProtectedDomain) {
      const url = details.url.toLowerCase();

      // Block if URL contains hotjar domains
      if (url.includes('hotjar.com') || url.includes('hotjar.io')) {
        console.log('[Hotjar Blocker] ✅ BLOCKING Hotjar request from protected domain:', details.url);

        // Track blocked request
        if (!blockedRequests.has(tabId)) {
          blockedRequests.set(tabId, []);
        }

        const blocked = blockedRequests.get(tabId);
        const blockInfo = {
          url: details.url,
          type: details.type,
          timestamp: Date.now()
        };

        // Avoid duplicates (same URL within 1 second)
        const isDuplicate = blocked.some(
          b => b.url === details.url && (Date.now() - b.timestamp) < 1000
        );

        if (!isDuplicate) {
          blocked.push(blockInfo);

          // Keep only last 100 blocked requests per tab
          if (blocked.length > 100) {
            blocked.shift();
          }

          // Update badge with count
          console.log('[Hotjar Blocker] Updating badge for tab', tabId, 'with count:', blocked.length);
          updateBadge(tabId, blocked.length);

          // Send notification to content script on first block
          if (blocked.length === 1 && !notificationSent.get(tabId)) {
            notificationSent.set(tabId, true);
            console.log('[Hotjar Blocker] Sending notification to tab', tabId);
            browser.tabs.sendMessage(tabId, {
              action: 'hotjarBlocked',
              count: blocked.length
            }).catch((error) => {
              // This is normal - content script may not be loaded yet. It will poll for the count instead.
              console.log('[Hotjar Blocker] Content script not ready yet (expected), will use polling fallback');
            });
          }
        }

        return { cancel: true };
      }
    }

    return { cancel: false };
  },
  {
    urls: [
      "*://*.hotjar.com/*",
      "*://*.hotjar.io/*"
    ]
  },
  ["blocking"]
);

console.log('[Hotjar Blocker] 🛡️ Background script is active and ready');
