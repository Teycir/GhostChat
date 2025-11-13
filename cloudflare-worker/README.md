# GhostChat Signaling Server (Cloudflare Workers)

Free, production-ready PeerJS signaling server on Cloudflare's global edge network.

## Deploy

```bash
cd cloudflare-worker
npm install
npx wrangler login
npx wrangler deploy
```

Your server will be live at: `https://ghostchat-signaling.YOUR-SUBDOMAIN.workers.dev`

## Configure GhostChat

Update `lib/peer-manager.ts`:

```typescript
function getPeerConfig() {
  return {
    host: 'ghostchat-signaling.YOUR-SUBDOMAIN.workers.dev',
    port: 443,
    path: '/',
    secure: true
  };
}
```

## Free Tier Limits

- 100,000 requests/day
- No cold starts
- Global edge network
- Free forever

Perfect for production use.
