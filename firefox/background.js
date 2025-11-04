// Store domains in memory for quick access
let protectedDomains = [];

// Track blocked requests per tab
const blockedRequests = new Map(); // tabId -> array of blocked URLs
const notificationSent = new Map(); // tabId -> boolean (whether notification was sent)

// Load domains from storage on startup
browser.storage.sync.get('domains').then((result) => {
  protectedDomains = result.domains || [];
  console.log('Hotjar Blocker loaded with domains:', protectedDomains);
});

// Listen for messages from popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateDomains') {
    protectedDomains = message.domains || [];
    console.log('Domains updated:', protectedDomains);
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
  blockedRequests.delete(tabId);
  notificationSent.delete(tabId);
});

// Clean up when tab navigates away
browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    blockedRequests.delete(tabId);
    notificationSent.delete(tabId);
    // Clear badge
    browser.browserAction.setBadgeText({ text: '', tabId });
  }
});

// Update extension badge
function updateBadge(tabId, count) {
  if (count > 0) {
    browser.browserAction.setBadgeText({ text: count.toString(), tabId });
    browser.browserAction.setBadgeBackgroundColor({ color: '#ef4444', tabId });
  } else {
    browser.browserAction.setBadgeText({ text: '', tabId });
  }
}

// Block Hotjar requests
browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Get the initiator URL
    const initiator = details.originUrl || details.documentUrl;
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
        console.log('Blocked Hotjar request from protected domain:', details.url);

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
          updateBadge(tabId, blocked.length);

          // Send notification to content script on first block
          if (blocked.length === 1 && !notificationSent.get(tabId)) {
            notificationSent.set(tabId, true);
            browser.tabs.sendMessage(tabId, {
              action: 'hotjarBlocked',
              count: blocked.length
            }).catch(() => {
              // Ignore errors if content script isn't loaded yet
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

console.log('Hotjar Blocker is active');
