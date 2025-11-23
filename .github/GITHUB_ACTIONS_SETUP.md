# GitHub Actions Setup for Vercel Deployment

This guide explains how to set up the GitHub Actions workflow for automatic deployment to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code must be in a GitHub repository
3. **Vercel Project**: Create a project on Vercel (can be done through the Vercel dashboard)

## Step 1: Get Vercel Credentials

### 1.1 Get Vercel Token
1. Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name (e.g., "GitHub Actions")
4. Set scope to "Full Account"
5. Copy the token (you won't see it again!)

### 1.2 Get Vercel Organization ID
1. Go to [Vercel Account Settings](https://vercel.com/account)
2. Copy your "Organization ID" (or "Team ID" if using a team)

### 1.3 Get Vercel Project ID
1. Go to your Vercel project
2. Click "Settings"
3. Scroll down to "Project ID"
4. Copy the Project ID

## Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add the following secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VERCEL_TOKEN` | Your Vercel authentication token | `abc123...` |
| `VERCEL_ORG_ID` | Your Vercel organization/team ID | `team_abc123...` |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | `prj_abc123...` |
| `VITE_API_URL` | Your backend API URL | `https://your-backend.railway.app` |

## Step 3: Enable GitHub Actions

The workflow file is already created at `.github/workflows/deploy.yml`. GitHub Actions will automatically detect it.

## Step 4: Test the Deployment

1. Make a change to your code
2. Commit and push to the `main` branch:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```
3. Go to your GitHub repository → "Actions" tab
4. You should see the workflow running
5. Once complete, your changes will be live on Vercel!

## Workflow Details

The workflow does the following:
1. **Triggers**: Runs on every push to `main` branch
2. **Checkout**: Gets your code from GitHub
3. **Setup Node.js**: Installs Node.js 18
4. **Install Dependencies**: Runs `npm ci` in the frontend directory
5. **Build**: Runs `npm run build` with environment variables
6. **Deploy**: Deploys to Vercel using the Vercel CLI

## Troubleshooting

### Workflow fails at "Install dependencies"
- Check that `package-lock.json` exists in the frontend directory
- Ensure all dependencies are properly listed in `package.json`

### Workflow fails at "Deploy to Vercel"
- Verify all three secrets are set correctly in GitHub
- Check that the Vercel token hasn't expired
- Ensure the project exists on Vercel

### Build succeeds but site doesn't update
- Check the Vercel dashboard for deployment logs
- Verify the `VITE_API_URL` environment variable is set correctly
- Clear browser cache and try again

## Manual Deployment (Alternative)

If you prefer not to use GitHub Actions, you can deploy manually:

```bash
cd frontend
npm install -g vercel
vercel --prod
```

## Environment Variables in Vercel

Don't forget to also set environment variables directly in Vercel:
1. Go to your Vercel project → Settings → Environment Variables
2. Add `VITE_API_URL` with your backend URL
3. Redeploy if needed

## Monitoring Deployments

- **GitHub Actions**: Check the "Actions" tab in your repository
- **Vercel Dashboard**: View deployment history and logs
- **Vercel CLI**: Run `vercel logs` to see recent logs

## Next Steps

After successful deployment:
1. Set up a custom domain in Vercel (optional)
2. Configure backend deployment (Railway, Render, etc.)
3. Update CORS settings in backend to allow your Vercel domain
4. Test the full application end-to-end
