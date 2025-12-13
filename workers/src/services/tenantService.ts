import { createClient } from '@supabase/supabase-js';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
}

export async function registerTenant(
  tenantName: string,
  userId: string,
  env: Env
) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Sanitize tenantName to be safe for schema name
  const safeName = tenantName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const schemaName = `tenant_${safeName}_${Date.now()}`;

  try {
    console.log(`Creating schema: ${schemaName}`);

    // Create the schema
    const { error: schemaError } = await supabase.rpc('create_tenant_schema', {
      schema_name: schemaName,
    });

    if (schemaError) {
      console.error('Schema creation error:', schemaError);
      throw new Error(`Failed to create schema: ${schemaError.message}`);
    }

    // Link user to tenant
    const { error: linkError } = await supabase
      .from('user_tenants')
      .insert({
        user_id: userId,
        schema_name: schemaName,
      });

    if (linkError) {
      console.error('User-tenant link error:', linkError);
      throw new Error(`Failed to link user to tenant: ${linkError.message}`);
    }

    return {
      success: true,
      schemaName,
      message: `Tenant ${tenantName} registered successfully`,
    };
  } catch (error) {
    console.error('Error creating tenant:', error);
    throw error;
  }
}

export async function ensurePublicTables(env: Env) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Check if user_tenants table exists, create if not
    const { error } = await supabase
      .from('user_tenants')
      .select('id')
      .limit(1);

    if (error && error.message.includes('does not exist')) {
      // Table doesn't exist, need to create it via SQL
      console.log('user_tenants table needs to be created in Supabase dashboard');
      // Note: You'll need to run this SQL in Supabase SQL Editor:
      // CREATE TABLE IF NOT EXISTS public.user_tenants (
      //   id SERIAL PRIMARY KEY,
      //   user_id UUID NOT NULL,
      //   schema_name VARCHAR(255) NOT NULL,
      //   created_at TIMESTAMP DEFAULT NOW(),
      //   UNIQUE(user_id)
      // );
    }

    console.log('Verified public.user_tenants table.');
  } catch (e) {
    console.error('Failed to verify public tables:', e);
  }
}
