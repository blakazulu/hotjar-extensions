# Hotjar Blocker - Chrome Extension

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select this folder (`chrome/`)

## How It Works

This extension uses Chrome's Manifest V3 `declarativeNetRequest` API with dynamic rules to block all network requests to Hotjar domains (`*.hotjar.com` and `*.hotjar.io`) on any domains you add through the popup interface.

A background service worker monitors all requests to Hotjar domains and tracks:
- Number of blocked requests per tab
- Request URLs and types (script, xmlhttprequest, etc.)
- Real-time badge counter on the extension icon

## Usage

1. Click the extension icon in the toolbar
2. Enter domain names where you want to block Hotjar
3. Add/remove domains as needed
4. Your settings are automatically saved and synced

## Testing

1. Install the extension
2. Add a domain using the popup
3. Navigate to that domain
4. Open Chrome DevTools (F12) → Network tab
5. Look for blocked/cancelled requests to Hotjar domains

## Features

- ✅ Real-time blocking status display
- ✅ On-page toast notification when Hotjar is blocked (3-second auto-dismiss with manual close option)
- ✅ Badge counter showing number of blocked requests
- ✅ Detailed list of blocked URLs with request types
- ✅ Dynamic domain management (add/remove domains)
- ✅ Protection status indicator (✅ Protected or ⚠️ Not Protected)
- ✅ Automatic domain syncing across devices

## Files

- `manifest.json` - Extension configuration with permissions and content scripts
- `background.js` - Service worker for tracking blocked requests and sending notifications
- `content.js` - Content script for displaying on-page toast notifications
- `popup.html` - Popup interface structure with status section
- `popup.css` - Popup styling with animations
- `popup.js` - Domain management and status display logic
- `icon*.png` - Extension icons
- `README.md` - This file
