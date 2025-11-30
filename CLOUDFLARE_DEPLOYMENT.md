# Cloudflare Pages Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Cloud Robot Management System to Cloudflare Pages (frontend) and Render (backend).

## Prerequisites

- GitHub account with the Cloud_robo repository
- Cloudflare account (free tier available)
- Render account (free tier available)

## Part 1: Deploy Backend to Render

### Step 1: Create Render Account

1. Visit [render.com](https://render.com)
2. Click "Get Started" or "Sign Up"
3. Sign up using your GitHub account for easier integration

### Step 2: Create New Web Service

1. From the Render dashboard, click "New +" button
2. Select "Web Service"
3. Connect your GitHub account if not already connected
4. Select the `Cloud_robo` repository from the list

### Step 3: Configure Web Service

Use the following configuration settings:

**Basic Settings:**
- **Name**: `cloud-robot-backend` (or your preferred name)
- **Region**: Select the region closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`

**Build Settings:**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Instance Type:**
- Select "Free" tier

### Step 4: Environment Variables (Optional)

If you need to add environment variables:
1. Scroll to "Environment Variables" section
2. Click "Add Environment Variable"
3. Add any required variables (Render automatically provides `PORT`)

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically start building and deploying
3. Wait for deployment to complete (typically 2-5 minutes)
4. Note your backend URL: `https://cloud-robot-backend.onrender.com`

**Important**: The free tier spins down after 15 minutes of inactivity. The first request after spin-down may take 30-60 seconds.

## Part 2: Deploy Frontend to Cloudflare Pages

### Step 1: Create Cloudflare Account

1. Visit [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Access Cloudflare Pages

1. From the Cloudflare dashboard, click "Workers & Pages" in the left sidebar
2. Click "Create application"
3. Select the "Pages" tab
4. Click "Connect to Git"

### Step 3: Connect GitHub Repository

1. Click "Connect GitHub"
2. Authorize Cloudflare to access your GitHub account
3. Select the `Cloud_robo` repository
4. Click "Begin setup"

### Step 4: Configure Build Settings

Use the following configuration:

**Project Settings:**
- **Project name**: `cloud-robot-management` (or your preferred name)
- **Production branch**: `main`

**Build Settings:**
- **Framework preset**: None (or select "Vite" if available)
- **Build command**: `npm install && npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave empty or use root)

**Environment Variables:**
Click "Add variable" and add:
- **Variable name**: `VITE_API_URL`
- **Value**: `https://cloud-robot-backend.onrender.com` (your Render backend URL)

### Step 5: Deploy

1. Click "Save and Deploy"
2. Cloudflare will start building your project
3. Wait for deployment to complete (typically 2-3 minutes)
4. Your site will be available at: `https://cloud-robot-management.pages.dev`

## Part 3: Update Backend CORS Settings

After deployment, you need to update the backend to allow requests from your Cloudflare Pages domain.

### Step 1: Update main.py

Edit `backend/main.py` and update the CORS middleware:

```python
api.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://cloud-robot-management.pages.dev",  # Your Cloudflare Pages URL
        "http://localhost:5173",  # For local development
        "http://localhost:8080",  # Alternative local port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 2: Commit and Push Changes

```bash
git add backend/main.py
git commit -m "Update CORS for Cloudflare Pages deployment"
git push origin main
```

Render will automatically redeploy with the new CORS settings.

## Part 4: Verify Deployment

### Test Backend

1. Visit `https://cloud-robot-backend.onrender.com/docs`
2. You should see the FastAPI Swagger documentation
3. Test the `/api/status` endpoint

### Test Frontend

1. Visit your Cloudflare Pages URL
2. The dashboard should load
3. Check browser console for any errors
4. Verify WebSocket connection is established
5. Test teleoperation controls

## Troubleshooting

### Issue: Cloudflare Build Fails with Lockfile Error

**Solution**: This has been fixed by removing `bun.lockb`. If you encounter this again:
```bash
git rm bun.lockb
git commit -m "Remove bun lockfile"
git push origin main
```

### Issue: Backend Not Responding

**Possible Causes:**
1. Free tier has spun down (wait 30-60 seconds for first request)
2. CORS not configured correctly
3. Backend crashed (check Render logs)

**Solution:**
- Check Render dashboard logs
- Verify CORS settings include your Cloudflare Pages URL
- Use a service like UptimeRobot to keep backend alive

### Issue: WebSocket Connection Failed

**Possible Causes:**
1. Backend URL not set correctly
2. CORS blocking WebSocket connections
3. Proxy configuration issues

**Solution:**
- Verify `VITE_API_URL` environment variable in Cloudflare Pages
- Check browser console for specific error messages
- Ensure backend allows WebSocket connections

### Issue: 404 Errors on Page Refresh

**Solution**: Configure Cloudflare Pages redirects:

Create a `public/_redirects` file:
```
/*    /index.html   200
```

Or create `public/_headers` file:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
```

### Issue: Build Fails with "Module not found"

**Solution:**
1. Clear Cloudflare Pages cache and retry
2. Verify all dependencies are in `package.json`
3. Check that imports use correct paths

## Performance Optimization

### Keep Backend Alive

Use [UptimeRobot](https://uptimerobot.com) to ping your backend every 5 minutes:
1. Create free UptimeRobot account
2. Add new monitor with your backend URL
3. Set interval to 5 minutes

### Enable Cloudflare Caching

Cloudflare automatically caches static assets. To optimize:
1. Use appropriate cache headers
2. Minimize bundle size
3. Enable compression

### Optimize Build Time

In `package.json`, ensure production build is optimized:
```json
{
  "scripts": {
    "build": "vite build --mode production"
  }
}
```

## Custom Domain (Optional)

### Add Custom Domain to Cloudflare Pages

1. Go to your Pages project
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Follow the instructions to add your domain
5. Cloudflare will automatically provision SSL certificate

### Update Backend CORS

Add your custom domain to the CORS allowed origins:
```python
allow_origins=[
    "https://yourdomain.com",
    "https://cloud-robot-management.pages.dev",
    # ... other origins
]
```

## Monitoring and Analytics

### Cloudflare Web Analytics

1. Go to your Pages project
2. Click "Analytics" tab
3. Enable Web Analytics for visitor tracking

### Render Metrics

1. Go to your Render service
2. Click "Metrics" tab
3. Monitor CPU, memory, and request metrics

## Automatic Deployments

Both Cloudflare Pages and Render support automatic deployments:

- **Cloudflare Pages**: Automatically deploys on every push to `main` branch
- **Render**: Automatically redeploys backend on every push to `main` branch

To disable automatic deployments:
- **Cloudflare**: Project Settings → Builds & deployments → Pause deployments
- **Render**: Service Settings → Auto-Deploy → Disable

## Environment-Specific Builds

### Preview Deployments

Cloudflare Pages automatically creates preview deployments for pull requests:
1. Create a new branch
2. Make changes and push
3. Create pull request
4. Cloudflare creates preview URL

### Production vs Development

Set different environment variables for production:
- In Cloudflare Pages: Use production environment variables
- In local development: Use `.env.local` file

## Security Best Practices

1. **Never commit secrets**: Use environment variables for sensitive data
2. **Use HTTPS**: Both Cloudflare and Render provide free SSL
3. **Restrict CORS**: Only allow specific origins in production
4. **Rate limiting**: Consider adding rate limiting to backend
5. **Authentication**: Implement authentication for sensitive operations

## Cost Considerations

### Free Tier Limits

**Cloudflare Pages:**
- Unlimited requests
- 500 builds per month
- Unlimited bandwidth
- Unlimited sites

**Render:**
- 750 hours per month (enough for one service)
- Spins down after 15 minutes of inactivity
- 100 GB bandwidth per month

### Upgrading

If you need more resources:
- **Cloudflare Pages**: Remains free for most use cases
- **Render**: Paid plans start at $7/month for always-on service

## Next Steps

1. Set up custom domain
2. Configure monitoring and alerts
3. Implement analytics tracking
4. Add error tracking (e.g., Sentry)
5. Set up automated backups
6. Implement CI/CD pipeline improvements

## Support Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Render Documentation](https://render.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

## Deployment Checklist

Before going live, ensure:

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] WebSocket connection working
- [ ] All features tested in production
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] Monitoring set up
- [ ] Documentation updated

## Your Live URLs

After successful deployment:

- **Frontend**: `https://cloud-robot-management.pages.dev`
- **Backend**: `https://cloud-robot-backend.onrender.com`
- **API Documentation**: `https://cloud-robot-backend.onrender.com/docs`

Share these URLs to provide global access to your Cloud Robot Management System.
