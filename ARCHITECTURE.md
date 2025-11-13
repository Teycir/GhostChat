# GhostChat Architecture - How P2P Really Works

## Current Implementation (localStorage)

### ❌ Problem:
- localStorage only works for same-browser tabs
- Different devices can't discover each other
- Not true P2P across networks

### ✅ What It's Good For:
- Testing in Playwright (shared context)
- Demo with multiple tabs in same browser
- NOT production-ready for real users

## Real-World P2P Solution

### Option 1: PeerJS Room System (Recommended)
```typescript
// User 1
const peer = new Peer('room-coffee-chat-user1');
peer.on('connection', conn => { /* handle */ });

// User 2 connects directly
const conn = peer.connect('room-coffee-chat-user1');
```

**Problem**: User 2 needs to know User 1's exact peer ID.

### Option 2: Signaling Server (What We Need)
```
Alice                  Signaling Server              Bob
  |                           |                        |
  |--Join room "coffee"------>|                        |
  |<--Your ID: abc123---------|                        |
  |                           |<--Join room "coffee"---|
  |                           |---Your ID: xyz789----->|
  |                           |                        |
  |<--Peer xyz789 joined------|                        |
  |                           |---Peer abc123 joined-->|
  |                           |                        |
  |====== Direct WebRTC Connection Established =======|
  |                           |                        |
  |<========== Messages (P2P, no server) ============>|
```

### Option 3: QR Code / Link Sharing (Simplest)
```typescript
// Alice creates room
const myPeerId = peer.id; // "abc123"
const inviteLink = `ghostchat.app/join/${myPeerId}`;
// Alice shares link with Bob

// Bob opens link
const alicePeerId = getFromURL(); // "abc123"
peer.connect(alicePeerId); // Direct connection!
```

## What We Should Implement

### For Production:
1. **Remove localStorage peer discovery**
2. **Use PeerJS's built-in signaling** (free, works globally)
3. **Share peer IDs via:**
   - QR codes
   - Invite links
   - Or simple signaling server

### For Testing:
- Keep localStorage for Playwright tests
- Add flag: `USE_LOCALSTORAGE_FOR_TESTING`

## The IP Address "Issue"

### Not Actually an Issue:
- WebRTC **requires** peers to know each other's IPs
- That's how P2P works (direct connection)
- STUN servers help with NAT traversal
- If users want privacy: **use VPN**

### What Happens:
```
Alice (IP: 1.2.3.4)  <--WebRTC-->  Bob (IP: 5.6.7.8)
         |                              |
         └──────── Direct P2P ──────────┘
              (no server in middle)
```

This is **by design** - true P2P means peers see each other's IPs.
