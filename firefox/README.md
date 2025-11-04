# Hotjar Blocker - Firefox Extension

## Installation

### Temporary Installation (for testing)
1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from this folder

### Permanent Installation
You need to sign the extension through Mozilla Add-ons or use Firefox Developer Edition/Nightly with signing disabled.

## How It Works

This extension uses Firefox's `webRequest` API with blocking to intercept and cancel all network requests to Hotjar domains (`*.hotjar.com` and `*.hotjar.io`) on any domains you add through the popup interface.

Firefox continues to support the powerful webRequestBlocking API in Manifest V3, unlike Chrome.

The background script tracks all blocked requests in real-time:
- Number of blocked requests per tab
- Request URLs and types (script, xmlhttprequest, etc.)
- Real-time badge counter on the extension icon
- Detailed console logging for debugging

## Usage

1. Click the extension icon in the toolbar
2. Enter domain names where you want to block Hotjar
3. Add/remove domains as needed
4. Your settings are automatically saved and synced

## Testing

1. Install the extension
2. Add a domain using the popup
3. Navigate to that domain
4. Open Firefox DevTools (F12) → Network tab
5. Look for blocked requests to Hotjar domains
6. Check the Browser Console (Ctrl+Shift+J) for "Blocked Hotjar request:" messages

## Features

- ✅ Real-time blocking status display
- ✅ On-page toast notification when Hotjar is blocked (3-second auto-dismiss with manual close option)
- ✅ Badge counter showing number of blocked requests
- ✅ Detailed list of blocked URLs with request types
- ✅ Dynamic domain management (add/remove domains)
- ✅ Protection status indicator (✅ Protected or ⚠️ Not Protected)
- ✅ Console logging for debugging
- ✅ Automatic domain syncing across devices

## Files

- `manifest.json` - Extension configuration with permissions and content scripts
- `background.js` - Background script with blocking, tracking, and notification logic
- `content.js` - Content script for displaying on-page toast notifications
- `popup.html` - Popup interface structure with status section
- `popup.css` - Popup styling with animations
- `popup.js` - Domain management and status display logic
- `icon*.png` - Extension icons
- `README.md` - This file
