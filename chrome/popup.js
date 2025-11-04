// Get DOM elements
const domainInput = document.getElementById('domainInput');
const addButton = document.getElementById('addButton');
const addCurrentButton = document.getElementById('addCurrentButton');
const domainsList = document.getElementById('domainsList');
const domainCount = document.getElementById('domainCount');

// Status elements
const statusIcon = document.getElementById('statusIcon');
const currentDomain = document.getElementById('currentDomain');
const statusMessage = document.getElementById('statusMessage');
const blockedCount = document.getElementById('blockedCount');
const countNumber = document.getElementById('countNumber');
const blockedListContainer = document.getElementById('blockedListContainer');
const toggleList = document.getElementById('toggleList');
const toggleIcon = document.getElementById('toggleIcon');
const blockedList = document.getElementById('blockedList');

// Load domains and status on popup open
document.addEventListener('DOMContentLoaded', () => {
  loadDomains();
  loadStatus();
});

// Toggle blocked list
toggleList.addEventListener('click', () => {
  const isHidden = blockedList.style.display === 'none';
  blockedList.style.display = isHidden ? 'block' : 'none';
  toggleIcon.classList.toggle('rotated', isHidden);
  // Update button text after icon
  const textNode = Array.from(toggleList.childNodes).find(node => node.nodeType === 3);
  if (textNode) {
    textNode.textContent = isHidden ? ' Hide' : ' Details';
  }
});

// Load and display current page status
async function loadStatus() {
  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url) {
      currentDomain.textContent = 'No active page';
      statusMessage.textContent = 'Open a webpage to see protection status';
      return;
    }

    // Parse domain from URL
    const url = new URL(tab.url);
    const domain = url.hostname.replace(/^www\./, '');

    currentDomain.textContent = domain;

    // Check if domain is protected
    const { domains = [] } = await chrome.storage.sync.get('domains');
    const isProtected = domains.some(d => domain.includes(d));

    if (isProtected) {
      statusIcon.textContent = '●';
      statusIcon.className = 'status-icon active';
      statusMessage.textContent = 'Protected - Hotjar blocked';
      statusMessage.className = 'status-text protected';

      // Get blocked requests for this tab
      chrome.runtime.sendMessage(
        { action: 'getBlockedRequests', tabId: tab.id },
        (response) => {
          if (response && response.blocked && response.blocked.length > 0) {
            displayBlockedRequests(response.blocked);
          }
        }
      );
    } else {
      statusIcon.textContent = '●';
      statusIcon.className = 'status-icon inactive';
      statusMessage.textContent = 'Not protected';
      statusMessage.className = 'status-text not-protected';
    }
  } catch (error) {
    console.error('Error loading status:', error);
    currentDomain.textContent = 'Error';
    statusMessage.textContent = 'Could not load status';
  }
}

// Display blocked requests
function displayBlockedRequests(blocked) {
  const count = blocked.length;

  if (count === 0) return;

  // Show count
  blockedCount.style.display = 'flex';
  countNumber.textContent = count;

  // Show list container
  blockedListContainer.style.display = 'block';

  // Populate list
  blockedList.innerHTML = blocked
    .slice().reverse() // Show most recent first
    .map(item => `
      <div class="blocked-item">
        <span class="blocked-url">${escapeHtml(item.url)}</span>
        <span class="blocked-type">${item.type}</span>
      </div>
    `)
    .join('');
}

// Add domain on button click
addButton.addEventListener('click', addDomain);

// Add domain on Enter key
domainInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addDomain();
  }
});

// Add current domain on button click
addCurrentButton.addEventListener('click', addCurrentDomain);

// Load and display domains
async function loadDomains() {
  const { domains = [] } = await chrome.storage.sync.get('domains');
  displayDomains(domains);
}

// Display domains in the list
function displayDomains(domains) {
  domainCount.textContent = domains.length;

  if (domains.length === 0) {
    domainsList.innerHTML = '<p class="empty-state">No domains added yet. Add one above!</p>';
    return;
  }

  domainsList.innerHTML = domains
    .map(
      (domain) => `
      <div class="domain-item">
        <span class="domain-name">${escapeHtml(domain)}</span>
        <button class="btn-remove" data-domain="${escapeHtml(domain)}">Remove</button>
      </div>
    `
    )
    .join('');

  // Add event listeners to remove buttons
  document.querySelectorAll('.btn-remove').forEach((button) => {
    button.addEventListener('click', () => removeDomain(button.dataset.domain));
  });
}

// Add a new domain
async function addDomain() {
  let domain = domainInput.value.trim().toLowerCase();

  // Validate domain
  if (!domain) {
    showError();
    return;
  }

  // Remove protocol if present
  domain = domain.replace(/^https?:\/\//, '');
  // Remove trailing slash
  domain = domain.replace(/\/$/, '');
  // Remove www. prefix
  domain = domain.replace(/^www\./, '');

  // Basic domain validation
  if (!isValidDomain(domain)) {
    showError();
    return;
  }

  // Get current domains
  const { domains = [] } = await chrome.storage.sync.get('domains');

  // Check if domain already exists
  if (domains.includes(domain)) {
    showError();
    domainInput.value = '';
    return;
  }

  // Add new domain
  domains.push(domain);
  await chrome.storage.sync.set({ domains });

  // Update blocking rules
  await updateBlockingRules(domains);

  // Clear input and refresh display
  domainInput.value = '';
  displayDomains(domains);
}

// Add current domain
async function addCurrentDomain() {
  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url) {
      showError();
      return;
    }

    // Parse domain from URL
    const url = new URL(tab.url);
    let domain = url.hostname;

    // Remove www. prefix
    domain = domain.replace(/^www\./, '');

    // Validate domain
    if (!domain || !isValidDomain(domain)) {
      showError();
      return;
    }

    // Get current domains
    const { domains = [] } = await chrome.storage.sync.get('domains');

    // Check if domain already exists
    if (domains.includes(domain)) {
      showError();
      return;
    }

    // Add new domain
    domains.push(domain);
    await chrome.storage.sync.set({ domains });

    // Update blocking rules
    await updateBlockingRules(domains);

    // Refresh display
    displayDomains(domains);
    loadStatus(); // Refresh status to show protected
  } catch (error) {
    console.error('Error adding current domain:', error);
    showError();
  }
}

// Remove a domain
async function removeDomain(domain) {
  const { domains = [] } = await chrome.storage.sync.get('domains');
  const updatedDomains = domains.filter((d) => d !== domain);

  await chrome.storage.sync.set({ domains: updatedDomains });

  // Update blocking rules
  await updateBlockingRules(updatedDomains);

  displayDomains(updatedDomains);
}

// Update dynamic blocking rules
async function updateBlockingRules(domains) {
  // Get existing dynamic rules
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIdsToRemove = existingRules.map((rule) => rule.id);

  // Create new rules for each domain
  const newRules = [];
  domains.forEach((domain, index) => {
    // Rule for hotjar.com
    newRules.push({
      id: index * 2 + 1,
      priority: 1,
      action: { type: 'block' },
      condition: {
        urlFilter: '*://*.hotjar.com/*',
        initiatorDomains: [domain],
        resourceTypes: [
          'script',
          'xmlhttprequest',
          'image',
          'font',
          'stylesheet',
          'sub_frame',
          'websocket',
          'media',
          'other',
        ],
      },
    });

    // Rule for hotjar.io
    newRules.push({
      id: index * 2 + 2,
      priority: 1,
      action: { type: 'block' },
      condition: {
        urlFilter: '*://*.hotjar.io/*',
        initiatorDomains: [domain],
        resourceTypes: [
          'script',
          'xmlhttprequest',
          'image',
          'font',
          'stylesheet',
          'sub_frame',
          'websocket',
          'media',
          'other',
        ],
      },
    });
  });

  // Update rules
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ruleIdsToRemove,
    addRules: newRules,
  });
}

// Validate domain format
function isValidDomain(domain) {
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
  return domainRegex.test(domain);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show error animation
function showError() {
  domainInput.classList.add('error');
  setTimeout(() => {
    domainInput.classList.remove('error');
  }, 300);
}
