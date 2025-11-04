// Track blocked requests per tab
const blockedRequests = new Map(); // tabId -> array of blocked URLs
const notificationSent = new Map(); // tabId -> boolean (whether notification was sent)

// Listen for requests to Hotjar domains (they'll be blocked by declarativeNetRequest)
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const tabId = details.tabId;
    if (tabId === -1) return; // Skip requests not associated with a tab

    // Get the main frame URL for this tab
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError || !tab) return;

      const tabUrl = new URL(tab.url);
      const tabDomain = tabUrl.hostname.replace(/^www\./, '');

      // Check if this domain is in our protected list
      chrome.storage.sync.get('domains', (result) => {
        const domains = result.domains || [];
        const isProtected = domains.some(domain => tabDomain.includes(domain));

        if (isProtected) {
          // This request to Hotjar will be/was blocked by declarativeNetRequest
          console.log('[Hotjar Blocker] Detected Hotjar request on protected domain:', details.url);

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
              chrome.tabs.sendMessage(tabId, {
                action: 'hotjarBlocked',
                count: blocked.length
              }).catch(() => {
                // Ignore errors if content script isn't loaded yet
              });
            }
          }
        }
      });
    });
  },
  {
    urls: [
      "*://*.hotjar.com/*",
      "*://*.hotjar.io/*"
    ]
  }
);

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  blockedRequests.delete(tabId);
  notificationSent.delete(tabId);
});

// Clean up when tab navigates away
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    blockedRequests.delete(tabId);
    notificationSent.delete(tabId);
  }
});

// Update extension badge
function updateBadge(tabId, count) {
  if (count > 0) {
    chrome.action.setBadgeText({ text: count.toString(), tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#ef4444', tabId });
  } else {
    chrome.action.setBadgeText({ text: '', tabId });
  }
}

// Listen for popup requests for blocked data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getBlockedRequests') {
    const tabId = request.tabId;
    const blocked = blockedRequests.get(tabId) || [];
    sendResponse({ blocked });
  } else if (request.action === 'getBlockedCount') {
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
  return true; // Keep message channel open for async response
});

console.log('Hotjar Blocker background service worker started');
