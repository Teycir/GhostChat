# PeerJS Server Options

GhostChat uses PeerJS for P2P signaling. By default, it uses the free public server at `0.peerjs.com` - no setup required!

## Default: Free Public Server (Recommended)

Out of the box, GhostChat uses `0.peerjs.com` - a free, public PeerJS signaling server. Just open the app and start chatting. No configuration needed.

**Pros:**
- Zero setup
- Works immediately
- Perfect for testing and personal use

**Cons:**
- Shared with all users (may be slow during peak times)
- No reliability guarantee

## Option: Self-Host Your Own Server

For better reliability and control, you can host your own PeerJS server on free platforms like Glitch or Replit.

### Quick Setup (Glitch)

1. Go to [glitch.com](https://glitch.com) and create a new project
2. In `package.json`, add:
   ```json
   "dependencies": { "peer": "latest" },
   "scripts": { "start": "peerjs --port 3000 --path /" }
   ```
3. Your server is live at `your-project.glitch.me`

### Configure GhostChat

1. Click "Settings" in GhostChat
2. Enter your server details:
   - Host: `your-project.glitch.me`
   - Port: `443`
   - Path: `/`
3. Save and reload

## Which Should I Use?

- **Testing/Personal Use**: Use default (0.peerjs.com)
- **Production/Reliability**: Self-host on Glitch/Replit

## Advanced: Deploy Your Own

For production apps, deploy your own PeerJS server. See [CUSTOM-SERVER.md](CUSTOM-SERVER.md) for detailed instructions on:
- Docker deployment
- AWS/DigitalOcean hosting
- Custom domain setup

## Troubleshooting

**"Failed to connect to PeerJS server"**
- Check your internet connection
- Try clearing Settings (use default server)
- Verify custom server is running

**"Connection timeout"**
- Public server may be overloaded
- Consider self-hosting for better reliability
- Check firewall settings
