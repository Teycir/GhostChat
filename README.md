# PrivyPeer: Decentralized P2P Privacy Chat

A free, open-source Progressive Web App for true peer-to-peer private chatting with viral sharing mechanics. No servers, no tracking, just direct encrypted connections between users.

## Overview

**PrivyPeer** is a privacy-first P2P chat PWA that spreads organically through sharing mechanics. Using WebRTC for direct peer connections and Gun.js for signaling, it provides end-to-end encrypted chats that work on any device with a browser.

### Key Features

- **True P2P**: Direct WebRTC connections, messages never touch servers
- **Viral Mechanics**: Share-to-unlock features, QR invites, referral tracking
- **Privacy Core**: E2E encryption, memory-only storage, zero tracking, ephemeral identities
- **Cross-Platform**: Works on desktop, mobile, and tablets (any modern browser)
- **Installable**: PWA can be installed like a native app
- **Memory-Only**: Messages stored in RAM only, disappear when tab closes (zero disk traces)

### Target Users

Privacy enthusiasts seeking secure alternatives to centralized chat apps. Initial seeding via Reddit/HN communities.

### Why PWA Over Extension?

- **WebRTC Native Support**: No service worker sleep issues killing connections
- **Mobile Support**: Works on phones and tablets (critical for viral growth)
- **Instant Updates**: Deploy changes immediately, no store approval
- **Lower Friction**: Share URL vs "install extension" (better for viral mechanics)
- **Cross-Browser**: Works on Chrome, Firefox, Safari, Edge
- **PWA Install**: Can still be "installed" to home screen/desktop

### Honest Limitations

- **Tab Dependency**: Must keep tab/app open for active connections
- **Bootstrap Dependency**: Requires Gun relay peers for initial discovery
- **NAT Traversal**: Direct connections may fail behind strict firewalls (uses free STUN servers)
- **Cold Start**: Early users need public discovery rooms until network grows

## Technology Stack

Minimal TypeScript setup optimized for PWA deployment:

- **Core**: TypeScript + Vite (fast builds, optimized PWA bundling)
- **P2P Layers**:
  - **WebRTC**: Direct peer-to-peer connections for real-time messaging
  - **Gun.js**: Signaling and peer discovery (bootstrap only)
  - **simple-peer**: WebRTC wrapper for easier connection management
- **Encryption**: Gun SEA for identity + native WebRTC DTLS/SRTP
- **NAT Traversal**: Free STUN servers (Google/Mozilla) + optional TURN fallback
- **UI**: React + PWA APIs (service worker, manifest, notifications)
- **Storage**: Memory-only (RAM) with auto-clear on close
- **Testing**: Local multi-tab testing with real WebRTC connections

### Post-MVP Additions
- Libp2p for DHT-based discovery (remove Gun.js dependency)
- NOSTR for decentralized signaling
- Community TURN servers for strict NAT
- Browser extension wrapper (optional, for background persistence)

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy (Netlify/Vercel/GitHub Pages)
npm run deploy
```

## Project Structure

```
privypeer/
├── src/
│   ├── components/          # React components
│   │   ├── ChatCore.tsx     # Messaging interface
│   │   ├── InviteHub.tsx    # Invite generation UI
│   │   ├── DiscoveryRoom.tsx # Public room for cold start
│   │   └── InstallPrompt.tsx # PWA install banner
│   ├── lib/                 # Core logic
│   │   ├── webrtc.ts        # WebRTC peer connection management
│   │   ├── signaling.ts     # Gun.js signaling for peer discovery
│   │   ├── crypto.ts        # E2E encryption (Gun SEA + WebRTC)
│   │   ├── identity.ts      # Key management and backup
│   │   ├── propagation.ts   # Share tracking and rewards
│   │   ├── storage.ts       # localStorage with auto-cleanup
│   │   └── rateLimit.ts     # Spam prevention
│   ├── workers/             # Service worker
│   │   └── sw.ts            # PWA service worker (caching only)
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── sw.js                # Compiled service worker
│   └── assets/              # Icons (192x192, 512x512)
├── vite.config.ts           # Vite + PWA plugin config
├── tsconfig.json
└── package.json
```

## Roadmap

### Phase 1: Foundation (Week 1)
- Vite + React + PWA manifest
- Gun.js setup with community relay peers
- Basic chat UI (local only, no P2P yet)
- Ephemeral identity generation (random per session)
- Memory-only message storage
- Privacy UI (blur on inactive, auto-clear)
- PWA install prompt

### Phase 2: P2P Core (Weeks 2-3)
- WebRTC peer connection setup with simple-peer
- Gun.js signaling for offer/answer exchange
- STUN server integration for NAT traversal
- Direct P2P messaging over WebRTC data channels
- Multi-tab testing (2-3 real peers with direct connections)
- Rate limiting and spam prevention

### Phase 3: Viral Features (Week 4-5)
- Invite link generation with QR codes
- Local propagation tracking (share counter)
- Public discovery room for cold start
- Basic badge system (5+ shares unlock)
- Web Share API integration
- PWA notifications for new messages

### Phase 4: Polish & Deploy (Week 6)
- UI refinements and error handling
- Key backup/recovery flow
- Deploy to Netlify/Vercel
- Custom domain setup
- Mobile testing and optimization

**Realistic Target**: Functional MVP by Week 6-8

## Architecture

**True P2P Model**: Direct WebRTC connections with Gun.js for signaling only.

**Flow**: 
1. User visits URL → PWA loads → Generates identity keypair (local only)
2. Connects to Gun relay for signaling (temporary, bootstrap only)
3. Joins public discovery room OR uses invite link
4. Exchanges WebRTC offer/answer via Gun signaling
5. Establishes direct P2P connection via WebRTC data channel
6. Messages flow peer-to-peer (no relay involvement after connection)
7. Share tracking unlocks features locally
8. Optional: Install PWA to home screen/desktop

**Data Flow**:
- **Signaling Phase**: Gun relay used only for WebRTC offer/answer/ICE exchange
- **Messaging Phase**: Direct P2P via WebRTC data channels (E2E encrypted)
- **Identity**: Random peer ID per session (no persistent identity)
- **Message Storage**: Memory-only (RAM), auto-cleared when tab closes
- **Peer Discovery**: Gun relay for initial handshake, then direct connections
- **NAT Traversal**: STUN servers reveal public IP, TURN fallback if needed

**Infrastructure Needs**:
- Static hosting (Netlify/Vercel/GitHub Pages - free tier)
- Community-run Gun relay peers (signaling only, minimal bandwidth)
- Public STUN servers (Google/Mozilla free tier)
- Optional TURN servers for ~15-20% of users behind symmetric NAT

**Why This Works**:
- Gun.js handles the hard part (signaling/discovery) without seeing messages
- WebRTC provides true P2P connections with native encryption
- After connection, peers communicate directly (no relay in message path)
- Memory-only storage leaves zero disk traces
- Ephemeral identities prevent cross-session tracking
- PWA works on all devices, increasing viral potential
- Static hosting = zero server costs

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
# Open http://localhost:5173

# Production build
npm run build

# Preview production build locally
npm run preview
```

### Testing

```bash
# Multi-peer local testing
# 1. Start dev server: npm run dev
# 2. Open http://localhost:5173 in tab 1
# 3. Open http://localhost:5173 in tab 2 (or different browser)
# 4. Test message sync between tabs

# Mobile testing
# 1. Get local IP: ifconfig (Unix) or ipconfig (Windows)
# 2. Access from phone: http://YOUR_IP:5173
# 3. Test P2P between desktop and mobile

# Note: Local testing doesn't simulate real NAT scenarios
# Real-world testing requires deployment to different networks
```

### Deployment

```bash
# GitHub Pages (recommended - truly free)
npm run build
gh-pages -d dist

# Cloudflare Pages (alternative to GitHub Pages)
npm run build
wrangler pages publish dist

# Tor Hidden Service (censorship-resistant backup)
npm run build
# 1. Copy dist/ to server
# 2. Configure nginx to serve static files
# 3. Configure Tor hidden service
# 4. Access via .onion address

# Community self-hosting (Docker)
npm run build
docker build -t privypeer .
docker run -p 80:80 privypeer
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
  title: 'Join me on PrivyPeer',
  url: 'https://privypeer.app/invite/abc123'
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
- Deploy to: `privypeer.app` (or similar short domain)
- Hosting: **GitHub Pages** (truly unlimited, free forever)
- CDN: Cloudflare (free tier, unlimited bandwidth)
- Updates: Instant (no app store approval)

**Why GitHub Pages + Cloudflare?**
- GitHub Pages: Unlimited bandwidth, free custom domains, 100% uptime SLA
- Cloudflare: Free CDN, DDoS protection, global edge network
- Zero cost at any scale (even millions of users)
- No bandwidth limits, no function invocation limits
- Static files only = perfect for PWA

**Primary Hosting** (Free, Fast, Scalable):

- **GitHub Pages + Cloudflare**:
  - GitHub Pages: Unlimited bandwidth, free forever
  - Cloudflare: Free CDN, DDoS protection, global edge
  - Deploy: `gh-pages -d dist`
  - Custom domain: `privypeer.app` via Cloudflare DNS
  - Cost: $0 at any scale (even millions of users)
  - Limitation: Can be taken down by GitHub/DMCA

**Censorship-Resistant Backup** (If Primary Goes Down):

- **Tor Hidden Service**:
  - Deploy: nginx + Tor on any server
  - Access: `xxxxxxxxxxxxx.onion`
  - Cost: $0 (self-host or free VPS)
  - Can't be censored, blocked, or traced
  - Community can run multiple mirrors

**Why This Works**:
- Primary (GitHub + Cloudflare): Fast, free, 99.9% uptime
- Backup (Tor): Unstoppable, anonymous, censorship-proof
- Open source: Community can always re-host
- Static PWA: Easy to deploy anywhere

### Viral Distribution Mechanics

**1. Share-to-Unlock**
```typescript
// Progressive feature unlocks
0 shares → Basic chat only
1 share → Custom themes
3 shares → Voice messages  
5 shares → Group chats
10 shares → Priority connections
```

**2. Invite Links**
- Short URLs: `privypeer.app/i/x7k2` (easy to share)
- QR codes: Instant mobile sharing
- Deep links: Open directly in PWA if installed
- Expiry: 24 hours (creates urgency)

**3. Web Share API**
```typescript
// One-tap sharing on mobile
await navigator.share({
  title: 'Chat with me privately',
  text: 'Join me on PrivyPeer - truly private P2P chat',
  url: 'https://privypeer.app/i/x7k2'
});
```

**4. Post-Chat Prompts**
- After 10 messages: "Enjoying the chat? Invite a friend!"
- After 1 hour: "Share PrivyPeer to unlock group chats"
- Non-intrusive, value-driven prompts

### Growth Strategy

**Phase 1: Seed (Week 1-2)** - Target: 100 users
- Reddit: r/privacy, r/selfhosted, r/opensource
- Hacker News: Show HN post
- Product Hunt: Launch day
- Twitter/X: Privacy tech community

**Phase 2: Early Adopters (Week 3-8)** - Target: 1K users
- Word of mouth from seed users
- Share-to-unlock drives 1:0.5 ratio (50 shares per 100 users)
- Public discovery room for cold start
- Community-run Gun relays

**Phase 3: Viral Growth (Month 3-6)** - Target: 10K+ users
- Network effects kick in
- Mobile sharing (PWA on phones)
- Organic social media mentions
- Privacy news coverage

**Realistic Projections**:
- Week 1: 100 users (manual seeding)
- Month 1: 500 users (1:0.5 share ratio)
- Month 3: 2K users (compounding)
- Month 6: 10K users (viral threshold)

### Marketing Angles

**Privacy-First Messaging**:
- "Messages disappear when you close the tab"
- "No servers, no tracking, no data breaches"
- "True P2P - your messages never touch our servers"
- "Ephemeral by design - like real conversations"

**Comparison Positioning**:
- vs Signal: "No phone numbers, no central servers"
- vs WhatsApp: "No Meta, no data collection"
- vs Telegram: "True P2P, not client-server"
- vs Discord: "No permanent history, maximum privacy"

**Target Communities**:
- Privacy enthusiasts (Reddit, HN)
- Crypto/Web3 users (decentralization appeal)
- Activists/journalists (censorship resistance)
- Tech early adopters (novel P2P tech)

### Distribution Channels

**Owned**:
- Website: `privypeer.app`
- GitHub: Open source repo
- Documentation: Comprehensive guides

**Earned**:
- Reddit posts (organic discussions)
- HN front page (Show HN)
- Tech blogs (privacy-focused)
- YouTube reviews (tech channels)

**Viral**:
- Invite links (primary growth driver)
- Web Share API (mobile sharing)
- QR codes (in-person sharing)
- Social proof ("1K+ users chatting privately")

### Risk Mitigation

**Technical Risks**:
- Gun relay downtime → Deploy backup relays
- NAT traversal failures → TURN server fallback
- Hosting costs → GitHub Pages + Cloudflare = free forever
- Bandwidth limits → None (GitHub Pages + Cloudflare have no limits)
- Censorship → Tor backup + community mirrors (unstoppable)
- Takedown requests → Open source = community can always re-host

**Growth Risks**:
- Slow adoption → Aggressive share-to-unlock
- Spam perception → Rate limit shares (max 5/day)
- Cold start problem → Public discovery room

**Legal/Policy Risks**:
- No app stores → No rejection risk
- No user data → No GDPR concerns
- Open source → Community can fork

### Success Metrics

**Week 1-4**:
- 100+ active users
- 50+ shares generated
- 10+ community relay hosts

**Month 3-6**:
- 1K+ daily active users
- 0.5+ share ratio sustained
- 100+ concurrent P2P connections
- Featured on privacy blogs

**Month 6-12**:
- 10K+ total users
- Self-sustaining viral growth
- Community-driven development
- Multiple language support

## Inspiration

- Signal's invite system
- BeReal's social loops
- Briar's P2P resilience

## Known Limitations

- **Tab Dependency**: Must keep tab/app open for active connections (PWA helps with persistence)
- **NAT Traversal**: ~15-20% of users behind symmetric NAT need TURN servers (costs money at scale)
- **Signaling Dependency**: Requires Gun relay for initial peer discovery (but not for messaging)
- **Connection Limits**: Browser limits ~256 simultaneous WebRTC connections per tab
- **IP Exposure**: Peers see each other's IP addresses (true P2P tradeoff)
- **Battery Impact**: Active P2P connections may drain mobile battery faster

## License

MIT License (open source, permissive)

## Roadmap Beyond MVP

- Voice/video calls (WebRTC already supports it)
- File sharing via WebRTC data channels
- Group chats (mesh network)
- Desktop app wrapper (Electron/Tauri)
- Browser extension wrapper (optional background persistence)
- Advanced privacy dashboard
- Community moderation tools

---

**Status**: Pre-MVP Development  
**Realistic Timeline**: 6-8 weeks to functional MVP  
**Deployment**: GitHub Pages + Cloudflare (primary) + Tor (backup)  
**Distribution**: Web URL (PWA) - no app stores needed  
**Growth Model**: Viral sharing with 1:0.5 ratio target  
**Censorship Resistance**: Decentralized hosting, unstoppable  
**Community**: [Coming Soon]

## FAQ

**Q: Is this truly P2P?**  
A: Yes. After initial signaling via Gun relay, messages flow directly peer-to-peer via WebRTC. The relay never sees message content.

**Q: What if all Gun relays go down?**  
A: Existing connections stay active (direct P2P). New connections can't be established until relays return. Community can host their own relays.

**Q: Can the relay see my messages?**  
A: No. Relay only handles WebRTC signaling (offer/answer exchange). Messages go directly between peers over encrypted WebRTC channels.

**Q: How do I backup my identity?**  
A: You don't. Identity is ephemeral (new per session) for maximum privacy. No persistent identity to backup or lose.

**Q: Why not use Signal/Matrix instead?**  
A: PrivyPeer has no central authority, no phone numbers, and viral sharing mechanics built-in.

**Q: Does it work on mobile?**  
A: Yes! PWA works on all modern mobile browsers. Install to home screen for app-like experience.

**Q: Do I need to keep the tab open?**  
A: Yes, for active connections. Installing as PWA helps with persistence. Future extension wrapper will add background support.

**Q: How much does it cost to run?**  
A: Zero. GitHub Pages + Cloudflare are free forever (no bandwidth limits), STUN servers are free, Gun relays are community-run.

**Q: What if GitHub Pages goes down?**  
A: Tor backup is always available. Static PWA can also be hosted on Cloudflare Pages, any web server, or community mirrors. Open source = unstoppable.

**Q: Can PrivyPeer be censored or taken down?**  
A: Primary site (GitHub Pages) can be taken down. But Tor backup is censorship-proof, and community can re-host anywhere. Static PWA = easy to mirror.

**Q: How much does it cost to run?**  
A: GitHub Pages + Cloudflare = $0 forever. Tor backup = $0 (community-run). No costs at any scale.

**Q: Are messages stored permanently?**  
A: No. Messages are stored in RAM only and disappear when you close the tab. Zero disk traces.

**Q: Can I export my message history?**  
A: Yes, you can export current session messages. But they're gone when you close the tab - by design for maximum privacy.

**Q: What happens when I close the tab?**  
A: Everything is wiped: messages, identity, connections. Fresh start next time. True ephemeral chat.

**Q: Can someone recover my messages from my device?**  
A: No. Memory-only storage means zero disk traces. Nothing to recover.
