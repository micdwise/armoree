# Deployment Guide for Cloudflare Pages + Workers

This guide will walk you through deploying your Armoree app to Cloudflare.

## Architecture

- **Frontend (Client)**: React SPA deployed to Cloudflare Pages
- **Backend (API)**: Cloudflare Workers for serverless API endpoints
- **Database**: Supabase PostgreSQL with edge-compatible connections
- **Auth**: Supabase Auth

## Prerequisites

1. Cloudflare account (free tier works)
2. Supabase project set up
3. Wrangler CLI installed: `npm install -g wrangler`
4. Git repository connected

## Step 1: Deploy Cloudflare Workers (API)

1. Navigate to the workers directory:
```bash
cd workers
npm install
```

2. Login to Cloudflare:
```bash
npx wrangler login
```

3. Set up secrets:
```bash
npx wrangler secret put SUPABASE_URL
# Paste your Supabase URL (e.g., https://xxxxx.supabase.co)

npx wrangler secret put SUPABASE_SERVICE_KEY
# Paste your Supabase service role key
```

4. Deploy the worker:
```bash
npm run deploy
```

5. Note the deployed URL (e.g., `https://armoree-api.your-username.workers.dev`)

## Step 2: Set Up Supabase Database

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create user_tenants table
CREATE TABLE IF NOT EXISTS public.user_tenants (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  schema_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create function to create tenant schemas
CREATE OR REPLACE FUNCTION create_tenant_schema(schema_name TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);
  EXECUTE format('SET search_path TO %I', schema_name);
  
  -- Add your table creation SQL here from database-supabase.sql
  -- For now, this creates the basic structure
  
  SET search_path TO public;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Step 3: Deploy to Cloudflare Pages

### Option A: Via Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** > **Create application** > **Pages**
3. Connect your GitHub repository
4. Configure build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `client`

5. Add environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `VITE_API_URL`: Your Workers API URL from Step 1

6. Click **Save and Deploy**

### Option B: Via Wrangler CLI

1. Navigate to the client directory:
```bash
cd client
```

2. Build the app:
```bash
npm run build
```

3. Deploy to Pages:
```bash
npx wrangler pages deploy dist --project-name=armoree
```

4. Set environment variables:
```bash
npx wrangler pages secret put VITE_SUPABASE_URL
npx wrangler pages secret put VITE_SUPABASE_ANON_KEY
npx wrangler pages secret put VITE_API_URL
```

## Step 4: Update API URL

After deployment, update your `.env.local` file in the client directory:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://armoree-api.your-username.workers.dev
```

## Step 5: Test Your Deployment

1. Visit your Cloudflare Pages URL
2. Try signing up with a new account
3. Verify the tenant is created in Supabase

## Troubleshooting

### CORS Errors
- Make sure your Workers API has CORS headers configured (already done in `workers/src/index.ts`)

### Database Connection Issues
- Verify your Supabase service key is correct
- Check that the `user_tenants` table exists
- Ensure the `create_tenant_schema` function is created

### Build Failures
- Check Node.js version (should be 20+)
- Verify all dependencies are installed
- Check build logs in Cloudflare Dashboard

## Local Development

To test the full stack locally:

1. **Run Workers locally**:
```bash
cd workers
npm run dev  # Runs on http://localhost:8787
```

2. **Run Client locally**:
```bash
cd client
VITE_API_URL=http://localhost:8787 npm run dev
```

## Cost Estimation

- **Cloudflare Pages**: Free for unlimited static requests
- **Cloudflare Workers**: Free tier includes 100,000 requests/day
- **Supabase**: Free tier includes 500MB database, 2GB bandwidth

This setup should be completely free for development and small production workloads!

## Next Steps

- Set up custom domain in Cloudflare Pages settings
- Configure authentication redirect URLs in Supabase
- Set up CI/CD for automatic deployments
- Add monitoring and error tracking
