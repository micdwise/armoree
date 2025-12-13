import { registerTenant, ensurePublicTables } from './services/tenantService';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  ENVIRONMENT: string;
}

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // Route: POST /api/register-tenant
    if (url.pathname === '/api/register-tenant' && request.method === 'POST') {
      try {
        const body = await request.json() as { tenantName: string; userId: string; email?: string };
        const { tenantName, userId } = body;

        if (!tenantName || !userId) {
          return new Response(
            JSON.stringify({ error: 'Tenant name and User ID are required' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }

        const result = await registerTenant(tenantName, userId, env);

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      } catch (error: any) {
        console.error('Registration failed:', error);
        return new Response(
          JSON.stringify({ error: error.message || 'Internal server error' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }
    }

    // Route: GET / (health check)
    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(
        JSON.stringify({ status: 'ok', message: 'Armoree API Worker is running' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  },
};
