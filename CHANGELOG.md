# Changelog

All notable changes to GhostChat will be documented in this file.

## [Unreleased] - 2025-01-13

### Added
- Invite link system replacing room names for P2P connections
- "Create Invite Link" button with clear sharing instructions
- Connection status indicators (Connecting/Connected/Disconnected)
- Message queue system to buffer messages before connection
- Disconnect detection with red "✗ Disconnected" status
- Input field disabled until connection established
- White button styling throughout UI
- White message bubbles for sent messages
- Step-by-step footer instructions on pre-join screen
- Clipboard fallback for non-HTTPS contexts

### Changed
- Replaced Gun.js with PeerJS for simpler, more reliable P2P
- Fixed peer ID generation to comply with PeerJS validation
- Message input now white background when connected
- Connection status colors: green (connected), yellow (connecting), red (disconnected)
- Improved invite link display with instructions
- Footer instructions split into two lines for readability

### Fixed
- First message loss issue (messages now queued until connected)
- Invalid peer ID error (removed leading hyphens)
- Clipboard API unavailable on non-HTTPS contexts
- Input field accessibility when not connected

### Added (Previous)
- Initial project setup with Next.js 15
- Basic P2P chat functionality using WebRTC
- Gun.js signaling for peer discovery
- Memory-only storage (RAM-only, no disk writes)
- Ephemeral identity generation (random UUID per session)
- Auto-blur privacy feature when tab loses focus
- Invite link-based chat system (replaced room names)
- PWA manifest and service worker
- Landing page with ghost branding
- Join room interface with ghost icon
- Warning footer about room name collisions
- Unique room name enforcement in UI
- Multi-peer support (mesh network)
- Global CSS styling
- SEO meta tags and Open Graph support

### Features
- Direct P2P messaging via WebRTC data channels
- No message persistence (everything wiped on tab close)
- No user accounts or authentication
- Cross-platform support (desktop, mobile, any browser)
- Static export for easy deployment
- Zero server costs (Cloudflare Pages compatible)

### Security
- WebRTC native encryption (DTLS/SRTP)
- No message logging or tracking
- No analytics or telemetry
- Open source and auditable

### Documentation
- Comprehensive README with user and developer guides
- Usage guide (USAGE.md)
- Example scenarios for 2-person and group chats
- FAQ section
- Architecture documentation
- Deployment instructions

### Known Limitations
- Must keep tab open while chatting
- Both users must be online simultaneously
- IP addresses visible to peers (P2P nature)
- Room name collisions possible (users warned in UI)
- Some firewalls may block WebRTC connections

## [0.1.0] - Initial Development

### Project Goals
- True peer-to-peer chat with zero traces
- Maximum privacy (no servers, no storage, no history)
- Simple and intuitive user experience
- Free and open source forever
- Easy deployment (static PWA)

---

**Note**: This project is in pre-MVP development. Features and APIs may change.
