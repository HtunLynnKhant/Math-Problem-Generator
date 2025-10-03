# Vercel Deployment Guide

This guide will help you deploy the AI Math Problem Generator to Vercel.

## Prerequisites

- A Vercel account (free tier is sufficient)
- GitHub/GitLab/Bitbucket repository with your code
- Supabase project set up with the required tables
- Google AI API key

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your repository
4. Vercel will automatically detect it as a Next.js project

### 3. Configure Environment Variables

In the Vercel dashboard, add these environment variables:

**Required Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_API_KEY=your_google_ai_api_key
```

**How to add them:**
1. In your Vercel project dashboard, go to "Settings"
2. Click "Environment Variables"
3. Add each variable with its corresponding value
4. Make sure to add them for all environments (Production, Preview, Development)

### 4. Deploy

1. Click "Deploy" in Vercel
2. Vercel will automatically build and deploy your application
3. The build process will use the `vercel-build` script from package.json

### 5. Verify Deployment

1. Once deployed, Vercel will provide you with a URL
2. Visit the URL to test your application
3. Try generating a math problem to ensure everything works

## Configuration Files

The project includes these Vercel-specific configuration files:

### `vercel.json`
- Configures the deployment settings
- Specifies Node.js runtime for API routes
- Maps environment variables

### `next.config.js`
- Optimizes the Next.js build for production
- Configures external packages for server components
- Enables performance optimizations

## Troubleshooting

### Common Issues

**Build Failures:**
- Check that all dependencies are listed in package.json
- Verify TypeScript compilation passes locally with `npm run build`

**Environment Variable Issues:**
- Ensure all required environment variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Verify Supabase URL and keys are correct

**API Route Errors:**
- Check Vercel function logs in the dashboard
- Ensure Google AI API key has proper permissions
- Verify Supabase connection and table schemas

**Database Connection Issues:**
- Confirm Supabase project is active
- Check that database tables exist (run database.sql)
- Verify Supabase URL and anon key are correct

### Vercel CLI (Optional)

You can also deploy using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Performance Optimization

The deployment is optimized with:
- **SWC Minification**: Faster builds and smaller bundles
- **React Strict Mode**: Better development experience
- **External Package Configuration**: Proper handling of server-side packages
- **Regional Deployment**: Deployed to `iad1` region for optimal performance

## Monitoring

After deployment, you can monitor your application:
- **Vercel Analytics**: Built-in performance monitoring
- **Function Logs**: View API route execution logs
- **Real-time Logs**: Monitor application in real-time

## Custom Domain (Optional)

To use a custom domain:
1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

## Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to your main/master branch
- **Preview**: When you create pull requests
- **Development**: When you push to other branches

This ensures your application is always up-to-date with your latest code changes.
