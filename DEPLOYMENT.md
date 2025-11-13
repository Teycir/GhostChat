# Deployment Guide

Deploy GhostChat to production in minutes.

## Quick Deploy (Recommended)

### Cloudflare Pages (Free, Best Performance)

1. **Build locally**:
```bash
npm run build
```

2. **Deploy**:
```bash
npx wrangler pages deploy out --project-name=ghostchat
```

3. **Or connect GitHub**:
- Go to [Cloudflare Pages](https://pages.cloudflare.com)
- Connect your GitHub repo
- Build command: `npm run build`
- Output directory: `out`
- Auto-deploys on push to master

**Benefits**:
- Free unlimited bandwidth
- Global CDN
- Auto HTTPS
- Zero cold starts

### GitHub Pages (Free, Simple)

1. **Install gh-pages**:
```bash
npm install -g gh-pages
```

2. **Deploy**:
```bash
npm run build
gh-pages -d out
```

3. **Access**: `https://yourusername.github.io/ghostchat`

## Alternative Hosts

### Netlify

1. Connect GitHub repo
2. Build: `npm run build`
3. Publish: `out`
4. Deploy

### Vercel

1. Import GitHub repo
2. Framework: Next.js
3. Output: Static
4. Deploy

### AWS S3 + CloudFront

```bash
npm run build
aws s3 sync out/ s3://your-bucket --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

## Custom Domain

### Cloudflare Pages

1. Go to Pages project settings
2. Add custom domain
3. Update DNS records (automatic)

### GitHub Pages

1. Add `CNAME` file to `public/` with your domain
2. Update DNS: `CNAME` record pointing to `yourusername.github.io`

## Environment Configuration

### Production Settings

Create `.env.production`:
```bash
NEXT_PUBLIC_SIGNALING_SERVER=your-server.workers.dev
```

### Custom Signaling Server

Deploy your own PeerJS server:

```bash
cd cloudflare-worker
npm install
npx wrangler login
npx wrangler deploy
```

Update `lib/peer-manager.ts`:
```typescript
host: 'your-signaling-server.workers.dev'
```

See [SIGNALING-SERVER.md](SIGNALING-SERVER.md) for details.

## CI/CD Pipeline

### GitHub Actions (Included)

Automatic deployment on push to master:

1. Add secrets to GitHub repo:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

2. Push to master:
```bash
git push origin master
```

3. Auto-deploys to Cloudflare Pages

### Manual Deployment

```bash
npm run build
# Upload /out directory to your host
```

## Security Headers

Headers are configured in:
- `next.config.js` (for dev server)
- `public/_headers` (for Cloudflare Pages)

Includes:
- Content Security Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: no-referrer

## Performance Optimization

### Already Optimized

- Static export (no server needed)
- Message compression (gzip)
- Bandwidth monitoring
- Connection pooling
- PWA caching

### CDN Configuration

Cloudflare Pages automatically provides:
- Global edge caching
- Brotli compression
- HTTP/3 support
- DDoS protection

## Monitoring

### Check Deployment

```bash
curl -I https://your-domain.com
# Should return 200 OK with security headers
```

### Test P2P Connection

1. Open in two browsers/devices
2. Create invite link
3. Connect and send message
4. Check browser console for errors

## Cost Estimates

| Host | Free Tier | Paid (if needed) |
|------|-----------|------------------|
| Cloudflare Pages | Unlimited | $0 |
| GitHub Pages | 100GB/month | $0 |
| Netlify | 100GB/month | $19/month |
| Vercel | 100GB/month | $20/month |
| AWS S3+CloudFront | 50GB/month | ~$5/month |

**Recommended**: Cloudflare Pages (free forever, best performance)

## Scaling

### Traffic Handling

Static site scales infinitely:
- No server to overload
- CDN handles all traffic
- P2P means no backend load

### Signaling Server

Free Cloudflare Workers tier:
- 100,000 requests/day
- Enough for ~10,000 daily users
- Upgrade to paid if needed ($5/month for 10M requests)

## Backup & Recovery

### Backup Strategy

```bash
# Backup source code
git push origin master

# Backup build
npm run build
tar -czf ghostchat-backup.tar.gz out/
```

### Disaster Recovery

1. Clone repo
2. Run `npm install && npm run build`
3. Deploy to new host
4. Update DNS

Recovery time: ~5 minutes

## Production Checklist

- [ ] Build succeeds locally
- [ ] Tests pass
- [ ] Security headers configured
- [ ] Custom domain set up (optional)
- [ ] HTTPS enabled
- [ ] Signaling server deployed
- [ ] CI/CD pipeline working
- [ ] Monitoring set up
- [ ] Backup strategy in place

## Troubleshooting Deployment

**Build fails**:
- Check Node.js version (18+)
- Run `npm install` again
- Clear `.next` cache

**Headers not working**:
- Check `public/_headers` file exists
- Verify host supports custom headers
- Test with `curl -I`

**P2P not connecting**:
- Check signaling server is running
- Verify TURN servers configured
- Test with Diagnostics tool

## Next Steps

- Monitor connection success rates
- Gather user feedback
- Iterate on improvements
- Scale signaling server if needed
