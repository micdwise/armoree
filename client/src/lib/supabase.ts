
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../env/env';

export let supabase: SupabaseClient = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

export const switchClient = (schema: string | null) => {
    if (schema) {
        console.log('Switching to schema client:', schema);
        supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
            db: { schema }
        });
    } else {
        console.log('Switching to public client');
        supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
    }
};
