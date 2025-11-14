# Changelog

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
