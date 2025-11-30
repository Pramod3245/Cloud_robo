# Free Deployment Guide

This guide will help you deploy the Cloud Robot Management System for free so anyone in the world can access it.

## Table of Contents
- [Option 1: Vercel (Frontend) + Render (Backend)](#option-1-vercel-frontend--render-backend) ⭐ **Recommended**
- [Option 2: Railway (Full Stack)](#option-2-railway-full-stack)
- [Option 3: GitHub Pages (Frontend Only)](#option-3-github-pages-frontend-only)

---

## Option 1: Vercel (Frontend) + Render (Backend) ⭐

This is the **recommended** approach as it provides the best performance and reliability for free.

### Step 1: Deploy Backend to Render

1. **Create a Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `Cloud_robo` repository

3. **Configure the Service**
   - **Name**: `cloud-robot-backend` (or any name you prefer)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables** (if needed)
   - Add any environment variables your app needs
   - Render automatically provides `PORT` variable

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (usually 2-5 minutes)
   - Note your backend URL: `https://cloud-robot-backend.onrender.com`

### Step 2: Deploy Frontend to Vercel

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your `Cloud_robo` repository

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**
   - Add the following environment variable:
     - `VITE_API_URL`: `https://cloud-robot-backend.onrender.com`

5. **Update vite.config.ts**
   - Before deploying, update your `vite.config.ts`:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "./src"),
       },
     },
     server: {
       proxy: {
         '/api': {
           target: process.env.VITE_API_URL || 'http://localhost:8000',
           changeOrigin: true,
         },
         '/socket.io': {
           target: process.env.VITE_API_URL || 'http://localhost:8000',
           changeOrigin: true,
           ws: true,
         },
       },
     },
   });
   ```

6. **Deploy**
   - Click "Deploy"
   - Your app will be live at: `https://your-project.vercel.app`

### Step 3: Update CORS Settings

Update `backend/main.py` to allow your Vercel domain:

```python
api.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-project.vercel.app",
        "http://localhost:5173",  # For local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Option 2: Railway (Full Stack)

Railway allows you to deploy both frontend and backend together.

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account

### Step 2: Deploy Backend

1. Click "New Project" → "Deploy from GitHub repo"
2. Select your `Cloud_robo` repository
3. Railway will detect it's a Python app
4. Add these settings:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click "Deploy"

### Step 3: Deploy Frontend

1. In the same project, click "New Service" → "GitHub Repo"
2. Select the same repository
3. Configure:
   - **Root Directory**: `./`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`
4. Add environment variable:
   - `VITE_API_URL`: Your backend Railway URL
5. Deploy

### Step 4: Configure Custom Domain (Optional)

- Railway provides a free `.railway.app` domain
- You can add a custom domain in the settings

---

## Option 3: GitHub Pages (Frontend Only)

**Note**: This option only deploys the frontend. You'll need to deploy the backend separately using Render or Railway.

### Step 1: Update vite.config.ts

Add base path for GitHub Pages:

```typescript
export default defineConfig({
  base: '/Cloud_robo/', // Replace with your repo name
  plugins: [react()],
  // ... rest of config
});
```

### Step 2: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Step 3: Enable GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages"
3. Source: Deploy from a branch
4. Branch: `gh-pages` / `root`
5. Save

### Step 4: Add Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Add `VITE_API_URL` with your backend URL

---

## Important Notes

### Free Tier Limitations

**Render**:
- Free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

**Vercel**:
- 100 GB bandwidth/month
- Unlimited deployments
- Serverless functions have 10-second timeout

**Railway**:
- $5 free credit/month
- No credit card required initially

### Performance Tips

1. **Keep Backend Alive** (Render):
   - Use a service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 5 minutes
   - This prevents it from spinning down

2. **Optimize Build**:
   - Minimize bundle size
   - Use code splitting
   - Optimize images

3. **Use CDN**:
   - Vercel automatically uses CDN
   - Improves global access speed

### Security Considerations

1. **Environment Variables**:
   - Never commit API keys or secrets
   - Use platform-specific environment variable settings

2. **CORS**:
   - Only allow specific origins in production
   - Don't use `allow_origins=["*"]` in production

3. **Rate Limiting**:
   - Consider adding rate limiting to your backend
   - Protect against abuse

---

## Troubleshooting

### Backend Not Connecting

1. Check CORS settings in `backend/main.py`
2. Verify environment variables are set correctly
3. Check backend logs in Render/Railway dashboard

### WebSocket Connection Failed

1. Ensure Socket.IO is properly configured
2. Check that proxy settings include `ws: true`
3. Verify backend URL is correct

### Build Failures

1. Check Node.js version (should be 18+)
2. Clear cache: `npm clean-install`
3. Check build logs for specific errors

---

## Your Live URLs

After deployment, you'll have:

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://cloud-robot-backend.onrender.com`
- **API Docs**: `https://cloud-robot-backend.onrender.com/docs`

Share these URLs with anyone in the world! 🌍

---

## Next Steps

1. Set up custom domain (optional)
2. Configure monitoring and analytics
3. Set up automated backups
4. Add SSL certificate (automatic on Vercel/Render)
5. Monitor usage and performance

For questions or issues, check the platform-specific documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
