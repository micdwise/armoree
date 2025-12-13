import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useTenant } from "../../lib/TenantContext";

/**
 * All queries in this file rely on the TenantContext.
 * Must be called within a component tree wrapped by <TenantProvider> and <AuthProvider>.
 * Tenant ID is set in AuthContext after login.
 */

export interface Ammunition {
  ammo_id: number;
  manufacturer: string;
  caliber_gauge: string;
  projectile_type: string;
  lot_number: string;
  quantity_on_hand: number;
  min_stock_level: number;
  storage_location_id?: number;
  location?: {
    location_name: string;
  };
}

export interface AmmunitionSummary {
  caliber: string;
  total_rounds: number;
}

export async function addAmmunition(newAmmunition: Partial<Ammunition>) {
  const { data, error } = await supabase
    .from("ammunition_inventory")
    .insert([newAmmunition])
    .select();
  if (error) throw error;
  return data as Ammunition[];
}

export async function deleteAmmunition(id: number) {
  const { error } = await supabase
    .from("ammunition_inventory")
    .delete()
    .eq("ammo_id", id);
  if (error) throw error;
}

export function useAmmunition() {
  const { tenantId } = useTenant();
  const [data, setData] = useState<Ammunition[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchAmmoData = useCallback(async () => {
    if (!tenantId) {
      setData([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setIsError(false);
    try {
      const { data, error } = await supabase
        .from("ammunition_inventory")
        .select("*, location:location(location_name)");
      if (error) throw error;
      setData((data || []) as Ammunition[]);
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchAmmoData();
  }, [fetchAmmoData]);

  return { data, isLoading, isError, refetch: fetchAmmoData };
}

export function useAmmunitionSummary() {
  const { tenantId } = useTenant();
  const [data, setData] = useState<AmmunitionSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchSummaryData = useCallback(async () => {
    if (!tenantId) {
      setData([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setIsError(false);
    try {
      const { data, error } = await supabase
        .from("ammunition_inventory")
        .select("caliber_gauge, quantity_on_hand");

      if (error) throw error;

      const summaryMap = new Map<string, number>();
      (data || []).forEach(
        (row: { caliber_gauge: string; quantity_on_hand: number }) => {
          const qty = Number(row.quantity_on_hand) || 0;
          summaryMap.set(
            row.caliber_gauge,
            (summaryMap.get(row.caliber_gauge) || 0) + qty
          );
        }
      );

      const summary: AmmunitionSummary[] = Array.from(summaryMap.entries()).map(
        ([caliber, total_rounds]) => ({ caliber, total_rounds })
      );
      setData(summary);
    } catch (error) {
      console.error("Failed to fetch ammunition summary:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchSummaryData();
  }, [fetchSummaryData]);

  return { data, isLoading, isError, refetch: fetchSummaryData };
}

// Sets the minimum stock level for all ammo rows matching a caliber/projectile type.
export async function setAmmoStockRequirement(
  caliber: string,
  projectileType: string,
  minStockLevel: number
) {
  if (minStockLevel < 0 || Number.isNaN(minStockLevel)) {
    throw new Error("minStockLevel must be zero or greater");
  }

  const { error } = await supabase
    .from("ammunition_inventory")
    .update({ min_stock_level: minStockLevel })
    .eq("caliber_gauge", caliber)
    .eq("projectile_type", projectileType);

  if (error) throw error;
}
