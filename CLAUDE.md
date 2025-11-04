# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains browser extensions for Chrome and Firefox that block network calls to/from Hotjar on user-defined domains. The extension features a popup UI for dynamic domain management with real-time blocking status, badge counters, and detailed request tracking.

## Project Structure

```
chrome/           - Chrome extension (Manifest V3)
  ├── manifest.json
  ├── background.js      - Service worker for tracking blocked requests
  ├── content.js         - Content script for on-page notifications
  ├── popup.html/css/js  - User interface with status display
  └── icon*.png

firefox/          - Firefox extension (Manifest V3)
  ├── manifest.json
  ├── background.js      - WebRequest blocking + tracking logic
  ├── content.js         - Content script for on-page notifications
  ├── popup.html/css/js  - User interface with status display
  └── icon*.png

assets/           - Design assets
  └── store/      - Store listing images
```

## Extension Architecture

### Chrome Extension (Dynamic Rules + Tracking)
- **Manifest V3** with `declarativeNetRequest`, `webRequest`, `storage`, and `tabs` permissions
- Uses **dynamic rules** created at runtime based on user-added domains
- `background.js` service worker:
  - Monitors Hotjar requests via webRequest (non-blocking)
  - Tracks blocked requests per tab (Map: tabId -> blocked requests array)
  - Updates badge counter on extension icon
  - Cleans up data when tabs close or navigate
- `popup.js` manages domain list via `chrome.storage.sync` and displays blocking status
- Requires `<all_urls>` host permission for multi-domain support

### Firefox Extension (WebRequest Blocking + Tracking)
- **Manifest V3** with `webRequest`, `webRequestBlocking`, `storage` permissions
- `background.js`:
  - Loads domains from storage on startup
  - Blocks Hotjar requests in real-time via webRequest
  - Tracks blocked requests per tab with timestamps
  - Updates badge counter on extension icon
  - Console logs all blocked requests for debugging
- `popup.js` sends messages to background script when domains change and displays status
- Firefox maintains support for blocking webRequest (unlike Chrome)
- Requires `<all_urls>` host permission

## Key Implementation Notes

### Domain Management
- Domains stored in `browser.storage.sync` for cross-device sync
- Input validation: removes protocols, www prefix, trailing slashes
- Domains are case-insensitive
- Chrome: Updates dynamic declarativeNetRequest rules (2 rules per domain)
- Firefox: Updates in-memory array in background.js

### Blocking Logic
- Targets: `*.hotjar.com` and `*.hotjar.io`
- Blocks all resource types: scripts, XHR, WebSockets, images, fonts, etc.
- Only blocks when initiator/origin matches a user-added domain

### UI Design
- Modern gradient header (purple/blue)
- **Status section** (light blue gradient):
  - Current domain display
  - Protection status (✅ Protected / ⚠️ Not Protected)
  - Blocked request counter (large red number)
  - Collapsible blocked requests list with URLs and types
  - Toggle button to show/hide blocked requests
- Input field with validation and error shake animation
- Domain list with remove buttons and shield emojis
- Real-time domain counter
- Responsive 380px width popup
- Smooth animations for status updates

### Badge Counter
- Red badge on extension icon
- Shows number of blocked requests on current tab
- Updates in real-time as requests are blocked
- Clears when navigating to new page
- Per-tab tracking (each tab has independent counter)

### On-Page Notification
- **Content script** (`content.js`) injected on all pages
- Beautiful toast notification appears top-right when first Hotjar block detected
- Design:
  - Purple/blue gradient background matching extension theme
  - Shield emoji icon (🛡️)
  - "Hotjar Blocked!" title with count
  - Close button (X) with hover effect
  - Smooth slide-in/out animations
- Auto-dismisses after 3 seconds
- Manually dismissible via close button
- Only shows once per page load (tracked via `notificationShown` flag)
- Background script sends `hotjarBlocked` message on first block
- Notification avoids showing if content script not loaded yet (error handling)

## Testing

1. Load extension in browser (chrome://extensions or about:debugging)
2. Click extension icon to open popup
3. Add test domains (e.g., example.com)
4. Visit added domain
5. Check DevTools Network tab for blocked Hotjar requests
6. Verify domains persist after browser restart (storage.sync)
