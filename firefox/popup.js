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
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

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
    const { domains = [] } = await browser.storage.sync.get('domains');
    const isProtected = domains.some(d => domain.includes(d));

    if (isProtected) {
      statusIcon.textContent = '●';
      statusIcon.className = 'status-icon active';
      statusMessage.textContent = 'Protected - Hotjar blocked';
      statusMessage.className = 'status-text protected';

      // Get blocked requests for this tab
      const response = await browser.runtime.sendMessage({
        action: 'getBlockedRequests',
        tabId: tab.id
      });

      if (response && response.blocked && response.blocked.length > 0) {
        displayBlockedRequests(response.blocked);
      }
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
  blockedList.textContent = ''; // Clear existing content
  blocked
    .slice().reverse() // Show most recent first
    .forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'blocked-item';

      const urlSpan = document.createElement('span');
      urlSpan.className = 'blocked-url';
      urlSpan.textContent = item.url;

      const typeSpan = document.createElement('span');
      typeSpan.className = 'blocked-type';
      typeSpan.textContent = item.type;

      itemDiv.appendChild(urlSpan);
      itemDiv.appendChild(typeSpan);
      blockedList.appendChild(itemDiv);
    });
}

// Load and display domains
async function loadDomains() {
  const { domains = [] } = await browser.storage.sync.get('domains');
  displayDomains(domains);
}

// Display domains in the list
function displayDomains(domains) {
  domainCount.textContent = domains.length;

  // Clear existing content
  domainsList.textContent = '';

  if (domains.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No domains added yet. Add one above!';
    domainsList.appendChild(emptyState);
    return;
  }

  domains.forEach(domain => {
    const domainItem = document.createElement('div');
    domainItem.className = 'domain-item';

    const domainName = document.createElement('span');
    domainName.className = 'domain-name';
    domainName.textContent = domain;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-remove';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => removeDomain(domain));

    domainItem.appendChild(domainName);
    domainItem.appendChild(removeBtn);
    domainsList.appendChild(domainItem);
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
  const { domains = [] } = await browser.storage.sync.get('domains');

  // Check if domain already exists
  if (domains.includes(domain)) {
    showError();
    domainInput.value = '';
    return;
  }

  // Add new domain
  domains.push(domain);
  await browser.storage.sync.set({ domains });

  // Notify background script to update rules
  browser.runtime.sendMessage({ action: 'updateDomains', domains });

  // Clear input and refresh display
  domainInput.value = '';
  displayDomains(domains);
  loadStatus(); // Refresh status
}

// Add current domain
async function addCurrentDomain() {
  try {
    // Get current tab
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

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
    const { domains = [] } = await browser.storage.sync.get('domains');

    // Check if domain already exists
    if (domains.includes(domain)) {
      showError();
      return;
    }

    // Add new domain
    domains.push(domain);
    await browser.storage.sync.set({ domains });

    // Notify background script to update rules
    browser.runtime.sendMessage({ action: 'updateDomains', domains });

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
  const { domains = [] } = await browser.storage.sync.get('domains');
  const updatedDomains = domains.filter((d) => d !== domain);

  await browser.storage.sync.set({ domains: updatedDomains });

  // Notify background script to update rules
  browser.runtime.sendMessage({ action: 'updateDomains', domains: updatedDomains });

  displayDomains(updatedDomains);
  loadStatus(); // Refresh status
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
