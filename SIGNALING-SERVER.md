# Free PeerJS Signaling Server Options

GhostChat needs a signaling server for WebRTC connections. Here are solid, production-ready free options.

## Option 1: Cloudflare Workers (Recommended)

**Why**: Free tier includes 100k requests/day, global edge network, zero cold starts.

### Deploy PeerJS on Cloudflare Workers

```bash
cd cloudflare-worker
npm install
npx wrangler login
npx wrangler deploy
```

**Your server**: `https://ghostchat-signaling.YOUR-SUBDOMAIN.workers.dev`

**Update default in `lib/peer-manager.ts`**:
```typescript
host: 'ghostchat-signaling.YOUR-SUBDOMAIN.workers.dev'
```

## Option 2: Render.com (Easy Alternative)

**Why**: Free tier includes 750 hours/month, auto-deploy from GitHub, persistent.

### Deploy to Render

1. Create `package.json`:
```json
{
  "name": "ghostchat-signaling",
  "scripts": {
    "start": "peerjs --port $PORT --path /"
  },
  "dependencies": {
    "peer": "^1.0.0"
  }
}
```

2. Push to GitHub
3. Go to [render.com](https://render.com) → New Web Service
4. Connect your repo
5. Build command: `npm install`
6. Start command: `npm start`

**Your server**: `https://ghostchat-signaling.onrender.com`

## Option 3: Railway.app (Modern Alternative)

**Why**: $5 free credit/month, fast deploys, no sleep time.

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Add package.json (same as Render)

# Deploy
railway up
```

**Your server**: `https://ghostchat-signaling.up.railway.app`

## Comparison

| Platform | Free Tier | Cold Starts | Reliability | Setup Time |
|----------|-----------|-------------|-------------|------------|
| Cloudflare Workers | 100k req/day | None | Excellent | 5 min |
| Render.com | 750 hrs/month | Yes (~30s) | Good | 3 min |
| Railway.app | $5 credit/month | Minimal | Excellent | 5 min |

## Recommended: Cloudflare Workers

Best for production because:
- No cold starts (instant connections)
- Global edge network (low latency)
- 100k requests/day is plenty for small-medium apps
- Free forever tier

## Default Configuration

GhostChat is pre-configured to use:
```
host: ghostchat-signaling.teycir.workers.dev
```

Deploy your own and update the default host in `lib/peer-manager.ts`, or let users configure their own via Settings UI.
