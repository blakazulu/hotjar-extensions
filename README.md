# Hotjar Blocker

Browser extensions for Chrome and Firefox that block all network calls to/from Hotjar on any domains you choose.

## Chrome Extension Installation

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle switch in the top-right corner)
4. Click **Load unpacked**
5. Browse to and select the `chrome` folder from this project
6. The extension is now installed and active

## Firefox Extension Installation

1. Open Firefox browser
2. Navigate to `about:debugging`
3. Click **This Firefox** in the left sidebar
4. Click **Load Temporary Add-on...**
5. Browse to the `firefox` folder and select the `manifest.json` file
6. The extension is now installed and active

**Note:** Firefox temporary add-ons are removed when you close Firefox. For permanent installation, you need to sign the extension through Mozilla Add-ons.

## Using the Extension

### Adding Domains
1. Click the extension icon in your browser toolbar
2. Enter a domain name (e.g., `example.com`) in the input field
3. Click **Add Domain** or press Enter
4. The extension will now block all Hotjar requests on that domain
5. You can add multiple domains and remove them at any time

### Viewing Blocking Status

**On-Page Notification:**
- When Hotjar is first blocked on a page, a beautiful toast notification appears in the top-right corner
- Shows number of requests blocked
- Automatically dismisses after 3 seconds
- Can be manually closed with the X button

**Extension Popup:**
1. Navigate to a protected domain
2. Click the extension icon
3. You'll see:
   - Current domain and protection status (✅ Protected or ⚠️ Not Protected)
   - Number of Hotjar requests blocked on this page
   - Red badge on the extension icon showing block count
   - Expandable list of all blocked URLs with request types
4. Click "Show blocked requests" to see detailed information about what was blocked

## Testing

1. Install the extension in your preferred browser
2. Add a domain using the popup interface
3. Navigate to the domain you added
4. Open Developer Tools (F12)
5. Go to the **Network** tab
6. Look for blocked/cancelled requests to Hotjar domains (`*.hotjar.com`, `*.hotjar.io`)

## Features

### Core Features
- ✅ **Dynamic Domain Management**: Add and remove domains on the fly
- ✅ **Real-Time Blocking Status**: See exactly what's being blocked when you click the extension icon
- ✅ **On-Page Notifications**: Beautiful toast notification appears when Hotjar is blocked (auto-dismisses after 3 seconds)
- ✅ **Visual Feedback**: Badge counter shows number of blocked requests
- ✅ **Detailed Request List**: View all blocked Hotjar URLs with request types
- ✅ **Simple UI**: Beautiful, intuitive popup interface with gradient design
- ✅ **Persistent Storage**: Your domains are saved and synced across devices
- ✅ **Zero Configuration**: No complex settings, just add domains
- ✅ **Privacy Focused**: Blocks all Hotjar tracking scripts, analytics, and session recordings

### What Gets Blocked
- 📜 JavaScript tracking scripts
- 🌐 XHR/Fetch API requests
- 🔌 WebSocket connections
- 🖼️ Images and fonts
- 📊 Analytics data
- 🎥 Session recording data
- 🗺️ Heatmap tracking

## How It Works

### Chrome Extension
- Uses **Manifest V3** declarativeNetRequest API with dynamic rules for blocking
- Background service worker monitors and tracks blocked Hotjar requests
- Displays badge counter and detailed blocking statistics
- Stores protected domains using chrome.storage.sync

### Firefox Extension
- Uses **webRequest API** with blocking capabilities (maintained in Manifest V3)
- Background script intercepts and blocks requests in real-time
- Tracks all blocked requests with full details
- Displays badge counter and comprehensive blocking statistics
- Stores protected domains using browser.storage.sync

### Privacy & Performance
- All blocking happens locally in your browser
- No data is sent to external servers
- Minimal performance impact
- Domains sync across your devices (if signed into browser)
- Badge and statistics update in real-time"# hotjar-extensions" 
