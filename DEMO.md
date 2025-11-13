# GhostChat Demo - Verify It Works

## Quick Manual Test (2 minutes)

### Step 1: Start Server
```bash
npm run dev
```

### Step 2: Open Two Browser Windows
- Window 1: http://localhost:3000/chat
- Window 2: http://localhost:3000/chat

### Step 3: Join Same Room
- Both windows: Enter room name "demo123"
- Both windows: Click "Join Room"

### Step 4: Verify Connection
- Both windows should show: "Connected" (instead of "Waiting for peers...")
- Check browser console (F12) for logs:
  - `[PEER] My ID: ...`
  - `[PEER] Connecting to: ...`
  - `[PEER] Connected to: ...`

### Step 5: Send Messages
- Window 1: Type "Hello from Alice" → Send
- Window 2: Should see "Hello from Alice" appear
- Window 2: Type "Hi from Bob" → Send
- Window 1: Should see "Hi from Bob" appear

### Step 6: Verify Privacy
- Close one window
- Other window: Connection lost
- Reopen closed window: No message history (ephemeral!)

## What You'll See

**Console Logs:**
```
[PEER] My ID: demo123-abc123
[PEER] Connecting to: demo123-xyz789
[PEER] Connected to: demo123-xyz789
[CHAT] Connection established
[CHAT] Received message: Hello from Alice from: demo123-xyz789
```

**UI Changes:**
- Status changes from "Waiting for peers..." to "Connected"
- Send button becomes white (enabled)
- Messages appear in real-time
- Messages styled: blue (yours) vs gray (theirs)

## Proof It's P2P

1. **Check Network Tab (F12)**:
   - No HTTP requests for messages
   - Only WebRTC connections
   - Messages don't go through server

2. **Check localStorage**:
   - Open DevTools → Application → localStorage
   - See: `room-demo123: ["demo123-abc123", "demo123-xyz789"]`
   - This is just peer discovery, not messages!

3. **Check Memory**:
   - Messages only in RAM
   - Close tab → localStorage cleared
   - No IndexedDB, no cookies, no traces
