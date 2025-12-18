# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your frontend code to GitHub

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push code to GitHub**:
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit - Weather App Frontend"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `frontend` directory as root

3. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (if deploying from monorepo) or `.` (if deploying frontend only)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variable**:
   - In Project Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://weatherapp-1-fua8.onrender.com`

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Add Environment Variable** (if not set in dashboard):
   ```bash
   vercel env add VITE_API_BASE_URL production
   ```
   Enter value: `https://weatherapp-1-fua8.onrender.com`

## Post-Deployment Steps

### 1. Update Backend CORS

After deployment, update your Render backend's `main.py` CORS settings with your actual Vercel URL:

```python
allow_origins=[
    "http://localhost:5173", 
    "https://*.vercel.app",
    "https://your-actual-app-name.vercel.app"  # Replace with your actual URL
]
```

Then redeploy your backend on Render.

### 2. Test Your Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Try querying: "What's the weather in London?"
3. Verify the response appears with animated weather cards

### 3. Custom Domain (Optional)

1. In Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update backend CORS to include your custom domain

## Troubleshooting

### CORS Errors

**Error**: "Access to fetch at ... has been blocked by CORS policy"

**Solution**:
1. Check that your Vercel URL is in backend's `allow_origins` list
2. Redeploy backend after updating CORS settings
3. Clear browser cache and try again

### API Connection Failed

**Error**: "Server is unreachable"

**Solution**:
1. Verify `VITE_API_BASE_URL` environment variable is set correctly
2. Check that backend is running: visit `https://weatherapp-1-fua8.onrender.com`
3. Ensure Render backend is not in sleep mode (free tier spins down after inactivity)

### Build Failures

**Error**: Build fails during `npm run build`

**Solution**:
1. Check Node.js version (Vercel uses Node 18+ by default)
2. Verify all dependencies in `package.json`
3. Test build locally: `npm run build`
4. Check Vercel build logs for specific errors

### Environment Variables Not Working

**Solution**:
1. Environment variables must be prefixed with `VITE_` to be exposed to client
2. Redeploy after adding/changing environment variables
3. Variables set in Vercel dashboard require redeployment to take effect

## Automatic Deployments

Once connected to GitHub:
- **Production**: Deploys automatically when you push to `main` branch
- **Preview**: Creates preview deployment for every PR and branch push
- Preview URLs follow pattern: `your-app-git-<branch>-<username>.vercel.app`

## Monitoring

- **Analytics**: Vercel Dashboard → Analytics tab
- **Logs**: Vercel Dashboard → Deployments → [Select Deployment] → Runtime Logs
- **Performance**: Check Core Web Vitals in Analytics

## Cost

- **Free Tier**: 100GB bandwidth, unlimited deployments, automatic HTTPS
- Perfect for this weather app
- See [vercel.com/pricing](https://vercel.com/pricing) for details

## Quick Reference

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node Version | 18.x (default) |
| Environment Variable | `VITE_API_BASE_URL` |

## Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Vite Docs: [vitejs.dev](https://vitejs.dev)
- Community: [vercel.com/community](https://vercel.com/community)
