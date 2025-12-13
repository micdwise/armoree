import { useTenant } from "../lib/TenantContext";

/**
 * Hook to get a tenant-scoped Supabase client.
 * Ensures the client is connected to the correct tenant schema.
 *
 * Must be called within a component tree wrapped by <TenantProvider> and <AuthProvider>.
 * Will throw if no tenant is found (user not authenticated or tenant not loaded).
 */
export function useTenantSupabase() {
  const { tenantId, supabase } = useTenant();

  if (!tenantId) {
    throw new Error(
      "No tenant found. User may not be authenticated or tenant context not loaded. " +
        "Ensure this hook is called within <TenantProvider> and after login."
    );
  }

  return supabase;
}
