# GhostChat Invite Link System

## ✅ Production-Ready P2P

### How It Works:

1. **Alice creates a room**:
   - Opens `ghostchat.app/chat`
   - Clicks "Create Room"
   - Gets peer ID: `abc123xyz`
   - Sees "Copy Invite Link" button

2. **Alice shares invite**:
   - Clicks "Copy Invite Link"
   - Gets: `ghostchat.app/chat?peer=abc123xyz`
   - Shares via text/email/WhatsApp with Bob

3. **Bob joins**:
   - Clicks Alice's link
   - Opens: `ghostchat.app/chat?peer=abc123xyz`
   - Automatically connects to Alice's peer ID
   - Direct P2P connection established!

4. **They chat**:
   - Messages go directly peer-to-peer
   - No server in the middle
   - Both see "Connected" status

## Why This Works:

### ✅ Different Devices:
- Alice: laptop (IP: 1.2.3.4)
- Bob: phone (IP: 5.6.7.8)
- PeerJS signaling server helps them find each other
- Then direct WebRTC connection

### ✅ Different Networks:
- Alice: home WiFi
- Bob: mobile data
- STUN servers handle NAT traversal
- Connection works across networks

### ✅ No localStorage Needed:
- Peer ID passed via URL
- No shared storage required
- Works for real users on different devices

## Technical Flow:

```
Alice                    PeerJS Server              Bob
  |                           |                       |
  |--Register peer abc123---->|                       |
  |<--Registered OK-----------|                       |
  |                           |                       |
  | (shares link)             |                       |
  |                           |                       |
  |                           |<--Connect to abc123---|
  |<--Bob wants to connect----|                       |
  |                           |                       |
  |====== WebRTC P2P Connection Established =========|
  |                           |                       |
  |<========== Messages (direct, no server) ========>|
```

## Security:

- Peer IDs are random (hard to guess)
- WebRTC encrypted (DTLS/SRTP)
- Messages never touch server
- Invite links expire when tab closes
- No message history

## Demo:

```bash
npm run dev

# Device 1 (or Tab 1):
1. Open http://localhost:3000/chat
2. Click "Create Room"
3. Click "Copy Invite Link"
4. Share the link

# Device 2 (or Tab 2):
1. Paste the invite link
2. Opens automatically
3. Connects to Device 1
4. Start chatting!
```

## vs. Old localStorage System:

| Feature | localStorage | Invite Links |
|---------|-------------|--------------|
| Same device tabs | ✅ Works | ✅ Works |
| Different devices | ❌ Broken | ✅ Works |
| Different networks | ❌ Broken | ✅ Works |
| Production ready | ❌ No | ✅ Yes |
| Testing | ✅ Easy | ⚠️ Need real URLs |
