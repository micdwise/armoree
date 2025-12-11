import { useEffect, useState, useCallback } from "react";
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

async function AddAmmunition(newAmmunition: Partial<Ammunition>) {
  const { data, error } = await supabase
    .from("ammunition_inventory")
    .insert([newAmmunition])
    .select();
  if (error) throw error;
  return data;
}

async function DeleteAmmunition(id: number) {
  const { error } = await supabase
    .from("ammunition_inventory")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

const GetAmmunition = () => {
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
      if (data) setData(data as unknown as Ammunition[]);
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
};

const GetAmmunitionSummary = () => {
  const [data, setData] = useState<AmmunitionSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchSummaryData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      // You might need a database function or view for summary if not doing client-side aggregation
      // For now, assuming raw fetching or adaptation needed.
      // Supabase doesn't support complex aggregation in simple client calls without views/RPC.
      // I will assume we fetch all and aggregate or use a view if it existed?
      // Since I don't have the DB definitions, I'll fetch ammunition and aggregate client side or just fetch the view if it exists.
      // Let's assume there is an rpc function or we do it client side.
      // Given complexity, I will just return empty or implementing client side calc if possible?
      // Let's try to fetch a view named 'ammunition_summary' if uncertain, or just fetch all and aggregate.
      // The original code hit '/ammunition/summary'.
      // I'll leave a TODO or try simple aggregation.

      // Simulating summary from raw data for now as safer bet
      const { data: ammo, error } = await supabase
        .from("ammunition_inventory")
        .select("caliber_gauge, quantity_on_hand");
      if (error) throw error;

      if (ammo) {
        const summaryMap = new Map<string, number>();
        ammo.forEach((a: any) => {
          const qty = Number(a.qty) || 0;
          summaryMap.set(a.caliber, (summaryMap.get(a.caliber) || 0) + qty);
        });
        const summary: AmmunitionSummary[] = Array.from(
          summaryMap.entries(),
        ).map(([caliber, total_rounds]) => ({
          caliber,
          total_rounds,
        }));
        setData(summary);
      }
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
};

export { GetAmmunition, AddAmmunition, DeleteAmmunition, GetAmmunitionSummary };
