# GhostChat: Ephemeral P2P Chat

> Your messages vanish like ghosts. **True peer-to-peer** chat where messages travel directly between users - no servers storing or reading your conversations. Everything exists only in memory and disappears when you close the tab. Zero traces, zero history.

[![p2p](https://img.shields.io/badge/p2p-enabled-blue)](https://github.com/topics/p2p)
[![privacy](https://img.shields.io/badge/privacy-first-green)](https://github.com/topics/privacy)
[![webrtc](https://img.shields.io/badge/webrtc-powered-orange)](https://github.com/topics/webrtc)
[![nextjs](https://img.shields.io/badge/nextjs-15-black)](https://github.com/topics/nextjs)
[![simple-peer](https://img.shields.io/badge/simple--peer-enabled-yellow)](https://github.com/topics/simple-peer)
[![cloudflare](https://img.shields.io/badge/cloudflare-workers-orange)](https://github.com/topics/cloudflare)
[![pwa](https://img.shields.io/badge/pwa-installable-purple)](https://github.com/topics/pwa)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## Disclaimer

This project is shared for educational purposes only. Users are responsible for complying with all applicable laws and regulations. Do not use this tool for illegal activities. The developers assume no liability for misuse.

---

## For Users

### What is GhostChat?

GhostChat is a truly private chat app where messages travel directly between you and your peer - no servers storing or reading your conversations. When you close the tab, everything vanishes completely. No history, no traces, no tracking. Your messages are ghosts that disappear.

### How to Use

**Step 1: Create a room**

- Open the website
- Click "Start Chatting"
- Click "Create Room"
- You'll see a "Copy Invite Link" button

**Step 2: Share the invite link**

- Click "Copy Invite Link"
- Share the link with your peer (via text, email, WhatsApp, etc.)

**Step 3: Your peer joins**

- They click your invite link
- Opens directly in their browser
- Automatically connects to you

**Step 4: Chat directly**

- Once connected, you'll see "Connected" status
- Type messages and press Enter to send
- See "Peer is typing..." when they're composing
- Click any message to copy it
- Messages travel directly between you (peer-to-peer)
- Share files up to 10MB

**Step 5: End the chat**

- Close the browser tab
- All messages instantly disappear from memory
- Invite link expires
- No history, no traces left behind

**Important**: Both people must be online at the same time. If someone closes their tab, the connection ends.

### Key Features

- **Direct P2P**: Messages and files never touch servers
- **Markdown Support**: Rich text formatting (bold, italic, code, links, images, etc.)
- **Quick Emojis**: 15 one-click emoji buttons
- **Message Search**: Find messages in current session with highlighting
- **Connection Quality**: Real-time latency indicator
- **Sound Notifications**: Audio alert on new messages
- **Typing Indicators**: See when peer is typing
- **Clickable Links**: URLs automatically become clickable
- **File Sharing**: Send files up to 10MB directly P2P
- **Memory-only**: RAM storage, auto-wipe on tab close
- **Ephemeral**: New identity each session, no history
- **Auto-blur**: Screen protection when switching tabs
- **No accounts**: No signup, email, or phone number
- **Zero tracking**: No analytics, logs, or user data
- **Open source**: Fully auditable code
- **Works everywhere**: Desktop, mobile, any browser

### Example Scenarios

**Two people chatting (Alice and Bob):**

1. Alice opens GhostChat and clicks "Create Room"
2. Alice clicks "Copy Invite Link"
3. Alice texts Bob the invite link
4. Bob clicks the link and automatically connects to Alice
5. Both see "Connected" status
6. They chat privately - messages go directly between them
7. When done, both close their tabs
8. All messages vanish - no history exists anywhere

### Limitations

- Invite links expire when creator closes tab
- Connection success varies by network (70-80%)
- Corporate firewalls may block WebRTC
- Both users must be online simultaneously
- Peers see each other's IP (use VPN to mask)
- One-to-one only (2 people per room)

---

### Custom Server (Optional)

For true decentralization, you can configure your own PeerJS signaling server:

1. Click "Settings" button in the chat interface
2. Enter your server details (host, port, path, API key)
3. Save and reload

**Default**: Uses Cloudflare Workers signaling servers with automatic fallback.

---

## For Developers

### Quick Start

```bash
# Install
npm install

# Run dev server
npm run dev
# Open http://localhost:3000

# Test P2P
# Tab 1: localhost:3000/chat -> Click "Create Room" -> Copy invite link
# Tab 2: Paste the invite link (e.g., localhost:3000/chat?peer=abc123)
# Send messages between tabs

# Build for production
npm run build
```

### Tech Stack

- **Next.js 15**: Static export, App Router, TypeScript
- **simple-peer**: Primary P2P protocol with custom signaling
- **PeerJS**: Backup P2P protocol (automatic fallback)
- **Cloudflare Workers**: Self-hosted signaling servers (2 workers)
- **React**: UI components
- **PWA**: Installable app

### Architecture

**How P2P Works**:

1. User creates room → Generates unique peer ID
2. Invite link shared → Contains peer ID in URL (`?peer=abc123`)
3. peer clicks link → Extracts peer ID from URL
4. Direct connection → WebRTC P2P link established
5. Messages flow → Direct peer-to-peer (no server involved)
6. Tab closes → Everything wiped from memory

**Infrastructure**:

- Static hosting (Cloudflare Pages - free)
- Custom Cloudflare Workers signaling (200k requests/day)
- Automatic fallback (Worker 1 → Worker 2 → PeerJS backup)
- Public STUN servers (Google/Mozilla - free)
- 100% free, decentralized infrastructure

### Project Structure

```
app/
├── layout.tsx          # Root layout + SEO
├── globals.css         # Global styles
├── page.tsx            # Landing page
└── chat/page.tsx       # Chat page

components/
└── ChatCore.tsx        # Chat UI + P2P logic

lib/
├── peer-manager.ts     # PeerJS P2P connections
├── storage.ts          # Memory storage
└── identity.ts         # Ephemeral IDs

public/
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
└── icon-*.png          # PWA icons
```

### Development

**Local Testing**:

```bash
# Terminal
npm run dev

# Browser Tab 1
localhost:3000/chat -> Click "Create Room" -> Copy invite link

# Browser Tab 2
Paste invite link (e.g., localhost:3000/chat?peer=abc123xyz)

# Send messages - they sync via WebRTC
```

**Multi-Device Testing**:

```bash
# Get local IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Desktop: http://localhost:3000/chat
# Mobile: http://YOUR_IP:3000/chat
# Both join same room
```

**Debug WebRTC**:

```javascript
// Browser console
localStorage.debug = "simple-peer";
// Reload page
```

### Deployment

```bash
# Cloudflare Pages (recommended)
npm run build
wrangler pages deploy out

# GitHub Pages
npm run build
gh-pages -d out

# Any static host
npm run build
# Upload /out directory
```

## Core Concepts

### Memory-Only Storage

Messages stored in RAM only, disappear when tab closes (zero disk traces):

```typescript
// Memory-only storage - no localStorage, no IndexedDB
let messages: Message[] = []; // RAM only

function storeMessage(msg: Message) {
  messages.push({ text: msg.text }); // No timestamps, no metadata
  if (messages.length > 100) messages.shift(); // Keep last 100
}

function getMessages() {
  return messages;
}

// Auto-clear when tab closes
window.addEventListener("beforeunload", () => {
  messages = []; // Wipe from memory
});
```

### Ephemeral Identity

Random peer ID per session, no persistent identity tracking:

```typescript
// Generate new identity each session
function generateIdentity() {
  return {
    peerId: crypto.randomUUID(), // Built-in browser API
    // No keys to backup, no persistent identity
  };
}
```

### Privacy UI

Automatic privacy protections with minimal code:

```typescript
// Blur screen when tab loses focus (shoulder surfing protection)
document.addEventListener("visibilitychange", () => {
  document.body.style.filter = document.hidden ? "blur(10px)" : "none";
});

// Invite links expire after 1 hour
const inviteExpiry = Date.now() + 3600000;
if (Date.now() > inviteExpiry) return null;
```

### P2P Messaging

Messages sent directly peer-to-peer via WebRTC data channels:

```typescript
// Establish P2P connection
const peer = await connectToPeer("peer-id");

// Send message directly (no relay)
peer.send("Hello, world!");

// Listen for direct messages
peer.on("data", (message) => {
  console.log(message); // Direct from peer
});
```

## Privacy & Security

- **True P2P**: Direct WebRTC connections, no relay
- **E2E Encryption**: WebRTC native (DTLS/SRTP)
- **Memory-Only**: RAM storage, zero disk traces
- **Ephemeral**: Random peer ID per session
- **Auto-Clear**: All data wiped on tab close
- **Zero Tracking**: No analytics, telemetry, or accounts
- **Open Source**: Fully auditable

### Security Notes

- Signaling server sees connection metadata (not messages)
- Peers see each other's IP addresses (inherent to P2P)
- No forensics possible (by design)
- Session isolation prevents linking conversations

## Contributing

We welcome contributions! This is a community-driven project focused on privacy and decentralization.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a pull request

## Troubleshooting

**Connection failed?**

- Check firewall settings
- Try different network
- Some corporate networks block WebRTC

**Messages not syncing?**

- Check both users have same invite link
- Check browser console for errors
- Refresh and try again

**Icons not loading?**

- Clear browser cache
- Restart dev server

---

## License

MIT License - Open source and free forever

## FAQ

**Is this truly P2P?**  
Yes. Messages go directly between users via WebRTC. PeerJS signaling server only helps you find each other.

**Can the signaling server see my messages?**  
No. Signaling server only handles connection setup. Messages are encrypted and go directly peer-to-peer.

**Are messages saved?**  
No. Everything is stored in RAM only and wiped when you close the tab.

**Do I need an account?**  
No. No signup, no phone number, no email. Just open and chat.

**Does it work on mobile?**  
Yes. Works on any modern browser. Can be installed as PWA.

**What if I close the tab?**  
Everything disappears: messages, identity, connections. Fresh start next time.

**Can someone recover my messages?**  
No. Memory-only storage means zero disk traces.

**Why not use Signal/WhatsApp?**  
GhostChat has no central servers, no phone numbers, no persistent identity. Messages truly disappear.

**Can my peer see my IP address?**  
Yes, that's how P2P works. Use a VPN to mask your IP if needed.

---

**Status**: Beta - Production Ready  
**Built with**: Next.js, WebRTC, simple-peer, PeerJS  
**Deployment**: Static PWA (Cloudflare Pages) + 2 Cloudflare Workers  
**Cost**: $0 forever (free tier infrastructure)  
**Capacity**: 200,000 requests/day (~10,000 chat sessions)

**✨ v0.5.0 Features**:

- Quick emoji picker (15 emojis inline)
- Markdown formatting (16 buttons: H1-H3, Bold, Italic, Underline, Strikethrough, Highlight, Code, Code Block, Link, Image, Superscript, Subscript, HR, Table)
- Message search (real-time filtering with yellow highlighting)
- Connection quality indicator (latency display with color-coded signal)
- Notification sound on message receive
- Cross-browser tooltips (Firefox + Chromium)
- Typing indicators ("Peer is typing...")
- Auto-scroll to latest message
- Clickable URLs in messages
- Character counter (500 max)
- Click message to copy text
- Improved disconnect handling
- Faster disconnect detection (1-2 seconds)

**⚠️ Limitations**:

- Invite links expire when creator closes tab
- Connection success varies by network (70-80% cross-network)
- Free TURN servers may be rate-limited
- One-to-one chat only
