# Troubleshooting Guide

Common issues and solutions for GhostChat.

## Connection Issues

### "Connection failed" or "Peer unavailable"

**Cause**: Your friend closed their tab or network issues.

**Solutions**:
1. Ask them to create a new invite link
2. Both refresh and try again
3. Run Diagnostics tool (click "Diagnostics" button)
4. Check both have internet connection

### "Establishing connection..." stuck

**Cause**: Firewall or NAT issues blocking WebRTC.

**Solutions**:
1. Try different network (mobile hotspot, home WiFi)
2. Disable VPN temporarily
3. Check corporate firewall settings
4. Use Settings to configure custom TURN server

### Connection drops frequently

**Cause**: Unstable network or mobile data.

**Solutions**:
1. Switch to WiFi (more stable than mobile data)
2. Keep tab in foreground (prevents sleep)
3. Check network quality in Diagnostics

## Browser Issues

### "Browser incompatible" error

**Cause**: Browser doesn't support WebRTC.

**Solutions**:
1. Use Chrome, Firefox, Safari, or Edge (latest versions)
2. Update your browser to latest version
3. Enable WebRTC in browser settings

### "HTTPS required" error

**Cause**: WebRTC requires secure connection.

**Solutions**:
1. Use `https://` URL (not `http://`)
2. Or use `localhost` for local testing
3. Deploy to HTTPS-enabled host (Cloudflare Pages, Netlify)

## Mobile Issues

### QR code not scanning

**Cause**: Camera permissions or poor lighting.

**Solutions**:
1. Grant camera permissions to browser
2. Improve lighting conditions
3. Manually copy/paste invite link instead

### Connection fails on mobile

**Cause**: Mobile networks often block WebRTC.

**Solutions**:
1. Switch to WiFi
2. Disable battery saver mode
3. Keep app in foreground
4. Check mobile data permissions

### Screen goes black on mobile

**Cause**: Phone sleep mode.

**Solutions**:
1. Keep screen active while chatting
2. Adjust screen timeout settings
3. GhostChat uses wake lock (if supported)

## Message Issues

### "Sending too fast" error

**Cause**: Rate limiting (10 messages per 10 seconds).

**Solutions**:
1. Wait a moment before sending
2. This prevents spam and abuse

### Message too long error

**Cause**: Messages limited to 10,000 characters.

**Solutions**:
1. Split long messages into smaller parts
2. This is a security measure

### Messages not appearing

**Cause**: Not connected yet.

**Solutions**:
1. Wait for "✓ Connected" status
2. Messages are queued until connection established
3. Check connection status indicator

## Network Diagnostics

### Run Built-in Diagnostics

1. Click "Diagnostics" button
2. Review test results:
   - ✓ Green: Working
   - ⚠️ Yellow: Warning
   - ✗ Red: Failed

### What Each Test Means

**WebRTC Support**: Browser compatibility
- Failed: Update browser or use different one

**STUN Connectivity**: Can reach signaling server
- Failed: Firewall blocking, try different network

**Network Quality**: Connection speed/stability
- Poor: Switch to better network (WiFi vs mobile)

## Advanced Issues

### Custom server not connecting

**Cause**: Server configuration incorrect.

**Solutions**:
1. Verify server URL in Settings
2. Check server is running (for self-hosted)
3. Clear Settings to use default server
4. See [SIGNALING-SERVER.md](SIGNALING-SERVER.md) for setup

### Session recovery not working

**Cause**: Session expired (1-hour limit).

**Solutions**:
1. Sessions expire after 1 hour (by design)
2. Create new invite link
3. This is a privacy feature

### Invite link expired

**Cause**: Creator closed their tab.

**Solutions**:
1. Ask them to create new invite link
2. Invite links expire when creator closes tab (by design)
3. This is a privacy feature

## Still Having Issues?

1. Check [STATUS.md](STATUS.md) for known limitations
2. Review [README.md](README.md) FAQ section
3. Open issue on GitHub with:
   - Browser and version
   - Network type (WiFi, mobile, corporate)
   - Diagnostics test results
   - Error messages

## Success Rates by Scenario

| Scenario | Expected Success Rate |
|----------|----------------------|
| Local network | 95%+ |
| Same ISP | 75-85% |
| Different ISPs | 60-70% |
| Corporate networks | 35-45% |
| Mobile networks | 40-50% |

Lower success rates are due to NAT/firewall limitations, not bugs. This is inherent to P2P WebRTC.
