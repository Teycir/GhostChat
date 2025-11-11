# PrivyPeer: Decentralized Self-Propagating Privacy Chat

A free, open-source browser extension for P2P private chatting with viral sharing mechanics. Built with privacy, decentralization, and zero ongoing fees at its core.

## Overview

**PrivyPeer** is a privacy-first P2P chat extension that turns users into propagators through organic growth mechanics. No central servers, no data breaches, no surveillance—just end-to-end encrypted chats that spread naturally through one-tap invites, gamified referrals, and auto-discovery.

### Key Features

- **Viral DNA**: Every feature incentivizes sharing—post-chat prompts, QR invites, NOSTR posts
- **Privacy Core**: Fully decentralized with E2E encryption, no servers, tracker blocking
- **Network Effects**: P2P swarms grow via Libp2p discovery with share-based rewards
- **Offline-First**: Local-first data with peer-pinned backups

### Target Users

Privacy enthusiasts seeking secure alternatives to Discord/Signal without central control. Initial seeding via Reddit/HN communities.

## Technology Stack

Lightweight TypeScript setup prioritizing autonomy and minimal dependencies:

- **Core**: TypeScript + Vite (fast builds, no framework lock-in)
- **P2P Layers**:
  - Gun.js - Decentralized database for real-time sync
  - Libp2p - Peer discovery and swarming
  - WebRTC - Direct P2P connections
  - NOSTR - Community discovery and viral spread
- **Encryption**: Gun SEA (E2E with local-only keys)
- **UI**: React + Chrome Extension APIs
- **Testing**: Docker + docker-compose for multi-peer simulations

## Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build extension
npm run build

# Docker testing (multi-peer)
docker-compose up
```

## Project Structure

```
privypeer/
├── src/
│   ├── components/          # React components
│   │   ├── ShareHub.tsx     # Invites and badges UI
│   │   ├── ChatCore.tsx     # Messaging interface
│   │   └── PropagateInvite.tsx # Invite generator
│   ├── lib/                 # Core logic
│   │   ├── gun.ts           # Gun.js setup
│   │   ├── libp2p.ts        # Peer discovery
│   │   ├── nostr.ts         # NOSTR integration
│   │   ├── propagation.ts   # Tracking and rewards
│   │   └── webrtc.ts        # P2P connections
│   ├── background/          # Extension background scripts
│   └── content/             # Content scripts
├── public/
│   ├── manifest.json        # Chrome extension config
│   └── assets/              # Icons and badges
├── vite.config.ts
├── tsconfig.json
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## Roadmap

### Phase 1: Setup and Core Architecture (3-5 days)
- Repo skeleton, TS/Vite config, extension manifest
- Local build and Docker single-peer chat

### Phase 2: P2P Core and Encryption (5-7 days)
- Gun.js sync, Libp2p discovery, E2E messaging
- Multi-peer Docker testing (5+ nodes)

### Phase 3: Propagation Features (5-7 days)
- Invites, badges, NOSTR shares, UI hub
- Viral growth simulation (1:2 share ratio target)

### Phase 4: Polish and Deploy (1-2 weeks)
- UI refinements, privacy dashboard
- Chrome Store submission and sideload guides

**Target**: MVP by Week 4

## Architecture

**Flow**: User installs → ShareHub prompts invite → Unlocks chat → Messages sync via Gun/Libp2p → Shares propagate rewards

All data is local-first with peer-to-peer synchronization. No central servers or tracking.

## Development

### Prerequisites

- Node.js 18+
- Docker (for multi-peer testing)
- Chrome/Chromium browser

### Installation

```bash
npm install
```

### Building

```bash
# Development build with HMR
npm run dev

# Production build
npm run build

# Load extension in Chrome
# 1. Navigate to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the `dist` folder
```

### Testing

```bash
# Single peer
docker build -t privypeer .
docker run -p 8080:8080 privypeer

# Multi-peer simulation
docker-compose up --scale peer=5
```

## Core Concepts

### Propagation Tracking

Every invite, share, and referral is tracked locally. Users unlock features (badges, faster connections) by sharing:

```typescript
trackPropagation('invite'); // Increments local counter
// 5+ invites → unlock 'pro' features
```

### P2P Messaging

Messages sync via Gun.js with automatic peer discovery through Libp2p:

```typescript
sendMessage('room-id', 'Hello, world!');
listenMessages('room-id', (data) => console.log(data));
```

### Invite Generation

One-tap invite creation with QR codes and clipboard sharing:

```typescript
<PropagateInvite room="my-room" />
```

## Privacy & Security

- **E2E Encryption**: All messages encrypted with Gun SEA
- **No Central Servers**: Pure P2P architecture
- **Local-First**: Data stored locally, synced peer-to-peer
- **Zero Tracking**: No analytics, no telemetry
- **Open Source**: Fully auditable codebase

## Contributing

We welcome contributions! This is a community-driven project focused on privacy and decentralization.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a pull request

## Growth Strategy

- **Seed**: Reddit/HN communities (target: 10K+ initial users)
- **Viral Loop**: 1:2 share ratio goal (each user invites 2+)
- **Organic Growth**: 100K+ users through network effects
- **Mitigation**: Sideload guides for Chrome policy risks, share caps to avoid spam perception

## Inspiration

- Signal's invite system
- BeReal's social loops
- Briar's P2P resilience

## License

Open source (license TBD - suggest MIT or GPL)

## Roadmap Beyond MVP

- IPFS attachments
- Voice/video calls
- Mobile support
- Advanced privacy dashboard
- Community moderation tools

---

**Status**: Pre-MVP Development  
**Target Launch**: Week 4  
**Community**: [Coming Soon]
