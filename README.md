# GhostChat: Ephemeral P2P Chat

> Your messages vanish like ghosts. **True peer-to-peer** chat where messages travel directly between users - no servers storing or reading your conversations. Everything exists only in memory and disappears when you close the tab. Zero traces, zero history.

[![p2p](https://img.shields.io/badge/p2p-enabled-blue)](https://github.com/topics/p2p)
[![privacy](https://img.shields.io/badge/privacy-first-green)](https://github.com/topics/privacy)
[![webrtc](https://img.shields.io/badge/webrtc-powered-orange)](https://github.com/topics/webrtc)
[![nextjs](https://img.shields.io/badge/nextjs-15-black)](https://github.com/topics/nextjs)
[![pwa](https://img.shields.io/badge/pwa-installable-purple)](https://github.com/topics/pwa)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## For Users

### What is GhostChat?

GhostChat is a truly private chat app where messages travel directly between you and your friend - no servers storing or reading your conversations. When you close the tab, everything vanishes completely. No history, no traces, no tracking. Your messages are ghosts that disappear.

### How to Use

**Step 1: Create a room**
- Go to the website (e.g., `https://ghostchat.app`)
- Click "Start Chatting"
- Click "Create Room"
- You'll see a "Copy Invite Link" button

**Step 2: Share the invite link**
- Click "Copy Invite Link"
- Share the link with your friend (via text, email, WhatsApp, etc.)
- Example link: `https://ghostchat.app/chat?peer=abc123xyz`

**Step 3: Your friend joins**
- They click your invite link
- Opens directly in their browser
- Automatically connects to you
- No room names or codes needed!

**Step 4: Chat directly**
- Once connected, you'll see "Connected" status
- Type messages and press Enter or click Send
- Messages travel directly between you (peer-to-peer)
- No servers can read your messages

**Step 5: End the chat**
- Close the browser tab
- All messages instantly disappear from memory
- Invite link expires (can't be reused)
- No history, no traces left behind

**Important**: Both people must be online at the same time. If someone closes their tab, the connection ends.

### Key Features

- **Direct connections**: Messages never touch our servers
- **Memory-only**: No messages saved to disk
- **Ephemeral**: New identity each session
- **Auto-blur**: Screen blurs when you switch tabs
- **No accounts**: No signup, no phone number, no email
- **Works everywhere**: Desktop, mobile, any browser

### Privacy Guarantees

- **RAM-only storage**: Messages never touch your disk
- **Auto-wipe**: Everything erased when tab closes
- **No history**: Messages exist only during the session
- **No tracking**: Zero analytics, logs, or user data
- **No accounts**: No signup, email, or phone number
- **Open source**: Fully auditable code

### Example Scenarios

**Two people chatting (Alice and Bob):**

1. Alice opens GhostChat and clicks "Create Room"
2. Alice clicks "Copy Invite Link" and gets: `ghostchat.app/chat?peer=abc123`
3. Alice texts Bob: "Join me on GhostChat: [paste link]"
4. Bob clicks the link and automatically connects to Alice
5. Both see "Connected" status
6. They chat privately - messages go directly between them
7. When done, both close their tabs
8. All messages vanish - no history exists anywhere

**Multiple people (currently 1-to-1, group chat coming soon):**

Currently, GhostChat supports one-to-one conversations. Each invite link connects two people directly. For group chats, create multiple rooms or wait for the upcoming group chat feature!

### Limitations

- Must keep tab open while chatting
- Both people need to be online at the same time
- Your friend sees your IP address (use VPN to mask it)
- Some strict firewalls may block connections
- **Invite links expire**: Links only work while the creator's tab is open
- **One-to-one only**: Currently supports 2 people per room (group chat coming soon)

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
- **PeerJS**: Simple P2P connections with built-in signaling
- **React**: UI components
- **PWA**: Installable app

### Architecture

**How P2P Works**:

1. **User creates room** → PeerJS generates unique peer ID
2. **Invite link shared** → Contains peer ID in URL (`?peer=abc123`)
3. **Friend clicks link** → Extracts peer ID from URL
4. **Direct connection** → PeerJS establishes WebRTC P2P link
5. **Messages flow** → Direct peer-to-peer (no server involved)
6. **Tab closes** → Everything wiped from memory

**Key Components**:

```
lib/
├── peer-manager.ts # PeerJS P2P connections
├── storage.ts      # Memory-only storage
└── identity.ts     # Ephemeral identity (deprecated)

components/
└── ChatCore.tsx    # Main chat UI

app/
├── page.tsx        # Landing page
└── chat/page.tsx   # Chat interface
```

**Data Flow**:

- **Signaling**: PeerJS server (WebRTC offer/answer only)
- **Peer Discovery**: Invite links with peer IDs in URL
- **Messages**: Direct P2P via WebRTC data channels
- **Storage**: RAM only, no disk writes
- **Identity**: Random peer ID per session
- **Encryption**: WebRTC native (DTLS/SRTP)

**Infrastructure**:

- Static hosting (Cloudflare Pages - free)
- PeerJS cloud signaling (free tier available)
- Public STUN servers (Google/Mozilla - free)
- No backend servers needed

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
├── webrtc.ts           # WebRTC connections
├── signaling.ts        # Gun.js signaling
├── storage.ts          # Memory storage
├── identity.ts         # Ephemeral IDs
└── propagation.ts      # Share tracking

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
localStorage.debug = 'simple-peer'
// Reload page
```

### Deployment

**Cloudflare Pages**:
```bash
npm run build
wrangler pages deploy out
```

**GitHub Pages**:
```bash
npm run build
gh-pages -d out
```

**Any Static Host**:
```bash
npm run build
# Upload /out directory
```

## Development

### Prerequisites

- Node.js 18+
- Modern browser (Chrome/Firefox/Safari/Edge)
- Multiple browser tabs/windows (for local multi-peer testing)

### Installation

```bash
npm install
```

### Building

```bash
# Development build with HMR
npm run dev
# Open http://localhost:3000

# Production build (static export)
npm run build
# Generates /out directory with static files

# Preview production build locally
npx serve out
```

### Testing

```bash
# Multi-peer local testing
# 1. Start dev server: npm run dev
# 2. Open http://localhost:3000 in tab 1
# 3. Open http://localhost:3000 in tab 2 (or different browser)
# 4. Test message sync between tabs

# Mobile testing
# 1. Get local IP: ifconfig (Unix) or ipconfig (Windows)
# 2. Access from phone: http://YOUR_IP:3000
# 3. Test P2P between desktop and mobile

# Note: Local testing doesn't simulate real NAT scenarios
# Real-world testing requires deployment to different networks
```

### Deployment

```bash
# Cloudflare Pages (recommended - free unlimited)
npm run build
wrangler pages deploy out
# Or connect GitHub repo to Cloudflare Pages dashboard

# GitHub Pages (alternative)
npm run build
gh-pages -d out

# Tor Hidden Service (censorship-resistant backup)
npm run build
# 1. Copy out/ to server
# 2. Configure nginx to serve static files
# 3. Configure Tor hidden service
# 4. Access via .onion address

# Community self-hosting (Docker)
npm run build
docker build -t ghostchat .
docker run -p 80:80 ghostchat
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
window.addEventListener('beforeunload', () => {
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
document.addEventListener('visibilitychange', () => {
  document.body.style.filter = document.hidden ? 'blur(10px)' : 'none';
});

// Invite links expire after 1 hour
const inviteExpiry = Date.now() + 3600000;
if (Date.now() > inviteExpiry) return null;
```

### Propagation Tracking

Every invite, share, and referral is tracked locally. Users unlock features (badges, faster connections) by sharing:

```typescript
trackPropagation('invite'); // Increments local counter
// 5+ invites → unlock 'pro' features
```

### P2P Messaging

Messages sent directly peer-to-peer via WebRTC data channels:

```typescript
// Establish P2P connection
const peer = await connectToPeer('peer-id');

// Send message directly (no relay)
peer.send('Hello, world!');

// Listen for direct messages
peer.on('data', (message) => {
  console.log(message); // Direct from peer
});
```

### Invite Generation

One-tap invite creation with QR codes and Web Share API:

```typescript
// Generate invite with peer ID and signaling info
<PropagateInvite peerId="abc123" signalingServer="wss://gun-relay.com/gun" />

// Share via Web Share API (mobile-friendly)
await navigator.share({
  title: 'Join me on GhostChat',
  url: 'https://ghostchat.app/invite/abc123'
});
```

### PWA Installation

Prompt users to install PWA for better experience:

```typescript
// Detect if app is installable
window.addEventListener('beforeinstallprompt', (e) => {
  // Show custom install button
  showInstallPrompt(e);
});

// Track if installed
window.addEventListener('appinstalled', () => {
  trackPropagation('install');
});
```

## Privacy & Security

- **True P2P**: Messages sent directly between peers via WebRTC (no relay in path)
- **E2E Encryption**: WebRTC native DTLS/SRTP encryption
- **Signaling Privacy**: Gun relay only sees connection metadata, never messages
- **Memory-Only**: Messages stored in RAM only, zero disk traces
- **Ephemeral Identity**: Random peer ID per session, no persistent tracking
- **Auto-Clear**: All data wiped when tab closes
- **No Metadata**: No timestamps, no read receipts, no typing indicators
- **Privacy UI**: Auto-blur on inactive, invite expiry
- **Zero Tracking**: No analytics, no telemetry, no user accounts
- **Open Source**: Fully auditable codebase

### Security Considerations

- **Signaling Trust**: Gun relay sees who connects to whom (but not message content)
- **Metadata Leakage**: Connection timing/patterns visible during signaling phase
- **IP Exposure**: Peers learn each other's IP addresses (inherent to P2P)
- **Spam Risk**: Rate limiting on signaling phase prevents connection flooding
- **Memory-Only**: Messages exist only in RAM, wiped on tab close
- **No Forensics**: Zero disk traces, no recovery possible (by design)
- **Session Isolation**: New identity per session, can't link conversations

## Contributing

We welcome contributions! This is a community-driven project focused on privacy and decentralization.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a pull request

## Distribution Strategy

### Deployment

**Primary Distribution**: Web URL (PWA)
- Deploy to: `ghostchat.app` (or similar short domain)
- Hosting: **Cloudflare Pages** (free tier, unlimited ### Security

- **Encryption**: WebRTC native (DTLS/SRTP)
- **No persistence**: Messages in RAM only
- **Ephemeral**: New identity each session
- **Open source**: Fully auditable
- **No tracking**: Zero analytics or logs

### Troubleshooting

**Messages not syncing?**
- Check both users joined same room ID
- Check browser console for errors
- Try different room name

**Connection failed?**
- Check firewall settings
- Try different network
- Some corporate networks block WebRTC

**Icons not loading?**
- Clear browser cache
- Restart dev server

---

## License

MIT License - Open source and free forever

## FAQ

**Is this truly P2P?**  
Yes. Messages go directly between users via WebRTC. Gun.js relay only helps you find each other.

**Can the relay see my messages?**  
No. Relay only handles connection setup. Messages are encrypted and go directly peer-to-peer.

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

**Can my friend see my IP address?**  
Yes, that's how P2P works. Use a VPN to mask your IP if needed.

**Can multiple people join the same room?**  
Yes! Any number of people can join the same room name. Everyone in the room will be connected to each other (mesh network). All participants see all messages in real-time.

**What if two groups accidentally use the same room name?**  
All 4 people will be connected together in one big group chat. If Alice and Bob join room "meeting" at the same time Jack and Jessica also join room "meeting", all 4 will see each other's messages. To avoid this, use unique room names (e.g., "alice-bob-jan15" instead of generic names like "meeting" or "chat").

---

**Status**: Pre-MVP Development  
**Built with**: Next.js, WebRTC, Gun.js  
**Deployment**: Static PWA (Cloudflare Pages)  
**Cost**: $0 forever (no servers needed)
