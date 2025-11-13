# GhostChat Quick Start

Get started with GhostChat in 2 minutes.

## For Users

### Step 1: Open GhostChat
Visit `https://ghostchat.app` (or your deployment URL)

### Step 2: Create Invite
1. Click "Start Chatting"
2. Click "Create Invite Link"
3. Click "Show QR Code" (optional, for mobile)

### Step 3: Share
- Copy the invite link and send to your friend
- Or have them scan the QR code

### Step 4: Chat
- Once connected, you'll see "✓ Connected"
- Type messages and press Enter
- Messages disappear when you close the tab

## For Developers

### Install
```bash
git clone https://github.com/yourusername/ghostchat.git
cd ghostchat
npm install
```

### Run Locally
```bash
npm run dev
# Open http://localhost:3000
```

### Deploy
```bash
npm run build
# Deploy /out directory to any static host
```

## Troubleshooting

**Connection failed?**
- Click "Diagnostics" to test your network
- Check firewall settings
- Try different network (mobile hotspot)

**QR code not working?**
- Ensure both devices on same network or internet
- Check camera permissions on mobile

**Messages not sending?**
- Wait for "✓ Connected" status
- Check rate limit (max 10 messages per 10 seconds)

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
- See [DEPLOYMENT.md](DEPLOYMENT.md) for hosting options
