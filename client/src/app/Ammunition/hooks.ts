import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export interface Ammunition {
  ammo_id: number;
  manufacturer: string;
  caliber_gauge: string;
  lot_number: string;
  quantity_on_hand: number;
  min_stock_level: number;
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
  const [data, setData] = useState<Ammunition[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchAmmoData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const { data, error } = await supabase
        .from("ammunition_inventory")
        .select("*");
      if (error) throw error;
      setData((data || []) as Ammunition[]);
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAmmoData();
  }, [fetchAmmoData]);

  return { data, isLoading, isError, refetch: fetchAmmoData };
}

export function useAmmunitionSummary() {
  const [data, setData] = useState<AmmunitionSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchSummaryData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchSummaryData();
  }, [fetchSummaryData]);

  return { data, isLoading, isError, refetch: fetchSummaryData };
}
