# GhostChat v1.0.0 - First Stable Release

**Live Demo:** https://ghost-chat.pages.dev

## What's New

### Production Ready
- Deployed on clean domain: `ghost-chat.pages.dev`
- Automated deployment via GitHub Actions
- One-click deployment with `npm run deploy`

### Enhanced Security Documentation
- Detailed MITM attack vector explanations
- Connection fingerprint verification guide
- Out-of-band verification best practices
- Security threat model and mitigations

### UI/UX Improvements
- Fixed search input styling to match theme
- Removed duplicate "Start Chatting" screen
- Added "How to Use" button with GitHub icon
- Subtle hover animations on buttons
- Transparent search bar showing shader background

### Developer Experience
- Complete CONTRIBUTING.md guidelines
- Automated Cloudflare Pages deployment
- Environment variable management (.env.local)
- Updated CHANGELOG with all recent changes

## Features

### Privacy & Security
- True P2P messaging via WebRTC
- Memory-only storage (no disk traces)
- Self-destructing messages (5s, 30s, 1m, 5m)
- Connection fingerprint verification
- Sensitive content auto-blur
- Metadata stripping from images
- Panic button (Ctrl+Shift+X)

### Messaging
- Real-time P2P chat
- Markdown formatting (16 buttons)
- Quick emoji picker (15 emojis)
- Message search with highlighting
- Read receipts
- Typing indicators
- File sharing (up to 10MB)

### Infrastructure
- $0 operating costs
- Cloudflare Workers signaling
- Automatic fallback system
- PWA support
- Zero tracking/analytics

## Installation

### For Users
Visit https://ghost-chat.pages.dev and click "Start Chatting"

### For Developers
```bash
git clone https://github.com/Teycir/GhostChat.git
cd GhostChat
npm install
npm run dev
```

## Security Notice

**CRITICAL:** Always verify the connection fingerprint out-of-band (phone call, video call, in-person) to prevent MITM attacks. See [Security Documentation](https://github.com/Teycir/GhostChat#security) for details.

## What's Changed
- Version bump to 1.0.0
- Production URL: ghost-chat.pages.dev
- Enhanced security documentation
- UI/UX polish
- Automated deployment
- Complete contribution guidelines

## Contributors
- @Teycir - Initial release

---

**Full Changelog**: https://github.com/Teycir/GhostChat/blob/master/CHANGELOG.md
