# Cloudflare Workers API

This directory contains the Cloudflare Workers API for Armoree.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment secrets:
```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_KEY
```

3. Run locally:
```bash
npm run dev
```

4. Deploy to Cloudflare:
```bash
npm run deploy
```

## Important Notes

### Database Setup Required

Before deploying, you need to create a Supabase function and table:

1. **Create the `user_tenants` table** in Supabase SQL Editor:
```sql
CREATE TABLE IF NOT EXISTS public.user_tenants (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  schema_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);
```

2. **Create the `create_tenant_schema` function** in Supabase:
```sql
CREATE OR REPLACE FUNCTION create_tenant_schema(schema_name TEXT)
RETURNS VOID AS $$
BEGIN
  -- Create the schema
  EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);
  
  -- Set search path to the new schema
  EXECUTE format('SET search_path TO %I', schema_name);
  
  -- Run your database-supabase.sql content here
  -- For now, this is a placeholder - you'll need to add the table creation SQL
  
  -- Reset search path
  SET search_path TO public;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Note:** The schema creation approach may need refinement based on Supabase's RLS and permissions model. Consider using Supabase's multi-tenancy patterns.

## Environment Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key (has admin permissions)
- `ENVIRONMENT`: "development" or "production"
