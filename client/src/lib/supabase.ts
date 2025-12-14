import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "../env/env";

// Create a single Supabase client instance
export const supabase: SupabaseClient = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY
);

// Store the current tenant schema
let currentTenantSchema: string | null = null;

export const setTenantSchema = (schema: string | null) => {
  currentTenantSchema = schema;
  console.log("Set tenant schema:", schema);
};

export const getTenantSchema = (): string | null => {
  return currentTenantSchema;
};

// Helper to get a schema-scoped client for queries
export const getTenantSupabase = () => {
  if (!currentTenantSchema) {
    throw new Error("No tenant schema set. User may not be authenticated.");
  }
  return supabase.schema(currentTenantSchema);
};
