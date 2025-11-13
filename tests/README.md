# GhostChat Test Suite

## Test Coverage

### Unit Tests (7 tests)
- `storage.test.ts` - Memory-only storage, 100-message limit
- `identity.test.ts` - UUID generation
- `ChatCore.test.tsx` - React component rendering

### Integration Tests (2 tests)
- `p2p.test.ts` - Mock P2P connections

### E2E Tests (2 tests)
- `chat.spec.ts` - Landing page, navigation, room joining
- `p2p-chat.spec.ts` - UI waiting state (1 passing), P2P messaging (1 skipped)

## Known Issues

### P2P Test Limitation

The automated P2P messaging test is currently unreliable due to Gun.js relay infrastructure:
- Public Gun.js relays are frequently offline
- Gun.js has hardcoded fallback relays that fail
- Local relay works but requires manual setup

**Manual P2P Testing (Recommended):**
1. Start dev server: `npm run dev`
2. Start Gun relay: `node gun-relay.js`
3. Open two browser windows: `http://localhost:3000/chat`
4. Both enter same room name (e.g., "test123")
5. Verify "Connected" status appears
6. Send messages and verify they sync

## Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# E2E tests
npm run test:e2e

# Specific test file
npm run test:e2e -- chat.spec.ts
```
