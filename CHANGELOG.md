# Changelog

## [0.6.0] - 2025-01-17

### Added - Privacy & Security Features
- **Self-Destructing Messages**: Timer dropdown (5s, 30s, 1m, 5m, Never) with countdown display
- **Message Deletion**: Delete button on each message, synced P2P deletion for both sides
- **Read Receipts**: Single checkmark (sent), double checkmark (read) on messages
- **Panic Button**: Red button in header + Ctrl+Shift+X keyboard shortcut to clear all messages
- **Sensitive Content Blur**: Auto-detect and blur passwords, SSN, credit cards, API keys, secrets
- **Connection Fingerprint**: 4-emoji hash displayed to verify no MITM attack
- **Clipboard Auto-Clear**: Copied messages auto-cleared from clipboard after 10 seconds
- **Metadata Stripping**: EXIF data removed from images via canvas re-encoding
- **Anti-Forensics Memory Overwrite**: Deleted messages overwritten with random data
- **Message Limit**: Dropdown to set max messages (10, 25, 50, 100) with auto-cleanup

### Changed
- **Message Interface**: Added id, read, expiresAt, createdAt, sensitive fields
- **Storage**: Implements memory overwrite on delete, limit enforcement, beforeunload cleanup
- **Copy Behavior**: Messages now use clipboard manager with auto-clear
- **Tooltips**: All tooltips use custom CSS (no native title attributes)
- **Panic Button**: Centered in header with bold styling

### Technical
- Created `lib/sensitive-content.ts` - Regex patterns for sensitive data detection
- Created `lib/connection-fingerprint.ts` - Deterministic emoji hash generator
- Created `lib/clipboard-manager.ts` - Auto-clearing clipboard utility
- Created `lib/metadata-stripper.ts` - Canvas-based EXIF removal
- Enhanced `lib/storage.ts` with overwriteMemory(), setMaxMessages(), createdAt tracking
- Added message protocol: delete, read, panic, message types
- Implemented expiry checking interval (1s) for self-destruct
- Added keyboard event listener for panic shortcut

---

## [0.5.0] - 2025-01-16

### Added
- **Quick Emoji Picker**: 15 one-click emoji buttons inline with message input
- **Markdown Formatting**: 16 formatting buttons (H1-H3, Bold, Italic, Underline, Strikethrough, Highlight, Code, Code Block, Link, Image, Superscript, Subscript, HR, Table)
- **Message Search**: Real-time search with yellow highlighting, sticky search bar, case-insensitive filtering
- **Connection Quality Indicator**: Live latency display with color-coded signal (green <100ms, yellow 100-300ms, orange >300ms)
- **Notification Sound**: 800Hz beep (0.15s) plays on message receive using Web Audio API
- **Cross-Browser Tooltips**: Custom CSS tooltips using data-title attribute (no double tooltips in Chromium)

### Changed
- **Markdown Parser**: Code and code blocks now display in green (#0f0) on dark background
- **Search Implementation**: Parses markdown before highlighting to avoid showing raw syntax
- **Audio Context**: Resets on each connection for reliability after reconnections

### Technical
- Created `lib/markdown.ts` with parseMarkdown() supporting 16 formats
- Created `lib/notification-sound.ts` with Web Audio API implementation
- Added WebRTC stats polling (2s interval) for RTT/latency measurement
- Implemented text wrapping function for markdown button insertions
- Added custom tooltip styles in globals.css with ::after and ::before pseudo-elements

---

## [0.4.1] - 2025-01-15

### Added
- **Typing Indicators**: Shows "Peer is typing..." when peer is composing a message
- **Auto-Scroll**: Messages automatically scroll to latest message
- **Link Auto-Detection**: URLs in messages become clickable links
- **Character Counter**: Shows character count (X/500) while typing
- **Copy Message**: Click any message to copy its text to clipboard

### Changed
- **Terminology**: Replaced "friend" with "peer" throughout the app for consistency
- **Disconnect Handling**: Improved peer disconnect detection and error messages
- **Error Messages**: More precise disconnect reasons (peer left vs network error)
- **Auto-Redirect**: Joiner tab redirects to home when peer disconnects
- **Simplified Errors**: Removed confusing troubleshooting tips from error dialogs

### Fixed
- **ICE Connection Detection**: Faster disconnect detection (1-2 seconds vs 1 minute)
- **Connection State**: Proper ICE connection state monitoring
- **Error Handler**: Removed retry/dismiss buttons for peer disconnect scenarios

### Technical
- Added typing event signaling via P2P channel
- Implemented ICE connection state change listeners
- Improved disconnect reason propagation through protocol layers
- Debounced typing events (300ms) to reduce network traffic

---

## [0.3.2] - 2025-01-XX

### Changed
- **Component Refactoring**: Split ChatCore into 6 focused components
  - ConnectionStatus: Connection state display
  - InviteSection: Invite link creation and QR code
  - MessageList: Message rendering
  - MessageInput: Input field and file upload
  - UploadProgress: File upload progress bar
  - DiagnosticsFooter: Live diagnostics display
- Improved code maintainability and testability
- Reduced ChatCore from 400+ lines to ~200 lines

### Technical
- Better separation of concerns
- Easier to test individual components
- More reusable component architecture

---

## [0.3.1] - 2025-01-XX

### Fixed
- **Critical Build Issue**: Added missing @types/simple-peer dependency
- **TypeScript Errors**: Fixed type inconsistencies in peer-simplepeer.ts
- **Unused Dependencies**: Removed unused signaling.ts file requiring gun module
- **E2E Tests**: Updated tests to match current UI (Create Room vs Create Invite Link)
- **Test Format**: Converted file-transfer.test.ts to proper Vitest format with assertions
- **Webpack Module Error**: Cleaned .next cache and reinstalled dependencies

### Changed
- Removed obsolete Settings and Diagnostics button tests from E2E suite
- Improved test reliability and maintainability

### Technical
- Build now succeeds without errors
- All unit tests pass with proper assertions
- E2E tests aligned with current UI state
- Development pipeline stabilized
- Clean dependency installation

---

## [0.4.0] - 2025-11-14

### Added
- **P2P File Transfer**: Send files up to 10MB directly peer-to-peer
- **Chunked Transfer**: Large files split into 64KB chunks for reliable transmission
- **Upload Progress**: Real-time progress bar showing chunk upload status
- **File Icons**: Document icon for PDFs/files, inline preview for images
- **File Support**: Images, PDFs, docs, text files
- **Test Suite**: Isolated file transfer tests for chunk/reassemble/display

### Fixed
- **Chunk Reassembly**: Fixed array initialization bug preventing file reassembly
- **Message Display**: Files now display with icons, separate from text messages
- **State Updates**: Fixed React state updates for file messages

### Changed
- **Send Button**: Removed send button, Enter key only for cleaner UX
- **Storage Interface**: Added file property to Message interface

### Technical
- Fixed `deserializeFileMessage` to use `.fill(null)` for proper array initialization
- Added upload progress state and UI component
- Separated file display logic from text messages
- Created `tests/file-transfer.test.ts` for isolated testing

---

## [0.3.0] - 2025-11-14

### Added
- **Custom Cloudflare Workers Signaling**: Replaced dependency on 0.peerjs.com with self-hosted Cloudflare Workers
- **Multi-Worker Pool**: Cascading fallback system with 2 Cloudflare Workers (200k requests/day capacity)
- **simple-peer Protocol**: New primary P2P protocol using simple-peer + Cloudflare Workers
- **Automatic Fallback**: Tries Worker 1 → Worker 2 → PeerJS (0.peerjs.com) automatically
- **Live Diagnostics Footer**: Real-time connection status, protocol, message count, and error display
- **Professional Copy Feedback**: Button changes to green "Copied!" instead of alert popup

### Changed
- **Protocol Architecture**: Isolated protocol implementations (peer-simplepeer.ts, peer-peerjs.ts)
- **Protocol Manager**: High-level manager handles primary/fallback logic transparently
- **UI Improvements**: Removed Settings button (obsolete), removed Diagnostics modal
- **Footer Diagnostics**: Always-visible status bar with live connection info

### Removed
- Settings modal (custom PeerJS server config - no longer needed)
- Diagnostics modal (replaced with live footer)
- Alert popups (replaced with inline feedback)

### Infrastructure
- Deployed 2 Cloudflare Workers on separate free accounts
- Worker 1: ghostchat-signaling.teycir.workers.dev
- Worker 2: ghostchat-signaling.teycitek.workers.dev
- Fallback: 0.peerjs.com (PeerJS public server)

### Technical
- Added `lib/peer-simplepeer.ts` - simple-peer implementation
- Added `lib/peer-peerjs.ts` - PeerJS implementation (backup)
- Added `lib/peer-protocol-manager.ts` - Protocol selection and fallback
- Added `lib/cloudflare-workers-pool.ts` - Worker pool management
- Updated `lib/peer-manager.ts` - Now uses protocol manager
- Comprehensive test suite for worker validation

### Capacity
- **200,000 requests/day** (2 workers × 100k each)
- **~10,000 chat sessions/day**
- **100% free infrastructure**
- **True decentralization**

---

## [0.2.0] - Previous Release

### Features
- PeerJS-based P2P chat
- Memory-only storage
- Ephemeral sessions
- QR code invite sharing
- PWA support
