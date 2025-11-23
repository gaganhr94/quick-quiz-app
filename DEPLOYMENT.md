# Deployment Guide

This guide explains how to deploy the Quick Quiz App to production.

## Architecture

The application consists of two parts:
- **Frontend**: React/TypeScript application (can be deployed to Vercel)
- **Backend**: Go application (needs separate deployment)

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Repository pushed to GitHub

### Steps

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Set Environment Variables**

   In Vercel project settings, add:
   ```
   VITE_API_URL=<your-backend-url>
   ```

4. **Update API calls in frontend**

   Replace `http://localhost:8080` with `process.env.VITE_API_URL` in:
   - `src/pages/CreateQuizPage.tsx`
   - `src/pages/LoginPage.tsx`
   - `src/pages/RegisterPage.tsx`
   - `src/pages/HostQuizPage.tsx`

## Backend Deployment Options

### Option 1: Railway (Recommended)

1. **Create Railway account** at [railway.app](https://railway.app)

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Set root directory to `backend`

3. **Configure**
   - Railway will auto-detect Go
   - Set environment variables:
     ```
     JWT_SECRET=<your-secret-key>
     PORT=8080
     ```

4. **Get deployment URL**
   - Copy the Railway-provided URL
   - Use this as `VITE_API_URL` in Vercel

### Option 2: Render

1. **Create account** at [render.com](https://render.com)

2. **New Web Service**
   - Connect GitHub repository
   - Root Directory: `backend`
   - Build Command: `go build -o server cmd/server/main.go`
   - Start Command: `./server`

3. **Environment Variables**
   ```
   JWT_SECRET=<your-secret-key>
   PORT=8080
   ```

### Option 3: Fly.io

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Deploy**
   ```bash
   cd backend
   fly launch
   fly deploy
   ```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com
```

### Backend
```
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=8080
DATABASE_PATH=./quiz.db
```

## GitHub Actions CI/CD (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

### Required GitHub Secrets
- `VERCEL_TOKEN`: Get from Vercel account settings
- `VERCEL_ORG_ID`: Found in Vercel project settings
- `VERCEL_PROJECT_ID`: Found in Vercel project settings

## Post-Deployment

1. **Test the application**
   - Register a new user
   - Create a quiz
   - Host and join a quiz

2. **Update CORS settings in backend**

   In `backend/cmd/server/main.go`, update allowed origins:
   ```go
   c.Writer.Header().Set("Access-Control-Allow-Origin", "https://your-vercel-app.vercel.app")
   ```

3. **Set up custom domain** (optional)
   - In Vercel: Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

## Troubleshooting

### WebSocket Connection Issues
- Ensure backend supports WSS (WebSocket Secure) for HTTPS frontend
- Update WebSocket URL in frontend to use `wss://` instead of `ws://`

### CORS Errors
- Verify backend CORS settings allow your frontend domain
- Check that all API endpoints have proper CORS headers

### Database Issues
- Ensure SQLite database persists between deployments
- Consider using a volume/persistent storage on your backend platform

## Monitoring

- **Vercel**: Built-in analytics and logs
- **Backend**: Use platform-specific logging (Railway, Render, Fly.io all provide logs)

## Cost Estimates

- **Vercel**: Free tier (sufficient for most use cases)
- **Railway**: $5/month with free trial credits
- **Render**: Free tier available (with limitations)
- **Fly.io**: Free tier with resource limits

## Support

For issues, check:
1. Vercel deployment logs
2. Backend platform logs
3. Browser console for frontend errors
4. Network tab for API call failures
