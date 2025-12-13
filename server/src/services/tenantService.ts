
import { Client } from 'pg';
import fs from 'node:fs';
import path from 'node:path';

export async function registerTenant(tenantName: string, userId: string) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        throw new Error('DATABASE_URL is not set');
    }

    // Sanitize tenantName to be safe for schema name
    // Format: tenant_<safe_name>_<timestamp>
    const safeName = tenantName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const schemaName = `tenant_${safeName}_${Date.now()}`;

    const client = new Client({ connectionString: dbUrl });

    try {
        await client.connect();

        console.log(`Creating schema: ${schemaName}`);
        await client.query(`CREATE SCHEMA "${schemaName}"`);

        // Read the SQL template
        // Assuming the server uses the 'database' folder at the root of the repo
        const sqlPath = path.resolve(__dirname, '../../../database/database-supabase.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Run the SQL within the new schema
        // We set search_path to the new schema so all tables are created there
        await client.query(`SET search_path TO "${schemaName}"`);
        await client.query(sqlContent);
        // Restore search_path
        await client.query('SET search_path TO "public"');

        // Link user to tenant
        await client.query(
            'INSERT INTO public.user_tenants (user_id, schema_name) VALUES ($1, $2)',
            [userId, schemaName]
        );

        return { success: true, schemaName, message: `Tenant ${tenantName} registered successfully` };
    } catch (error) {
        console.error('Error creating tenant:', error);
        throw error;
    } finally {
        await client.end();
    }
}

export async function ensurePublicTables() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return;
    const client = new Client({ connectionString: dbUrl });
    try {
        await client.connect();
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.user_tenants (
                id SERIAL PRIMARY KEY,
                user_id UUID NOT NULL,
                schema_name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(user_id)
            );
        `);
        console.log('Verified public.user_tenants table.');
    } catch (e) {
        console.error('Failed to init public tables:', e);
    } finally {
        await client.end();
    }
}
