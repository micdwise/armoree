import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export interface Firearm {
  firearm_id: number;
  manufacturer: string;
  model: string;
  type: string;
  acquisition_date: string;
  caliber_gauge: string;
  serial_number: string;
  asset_tag: string;
  current_status: string;
  next_due_date?: string;
}

export interface MaintenanceLog {
  log_id: number;
  firearm_id: number;
  date_performed: string;
  type: string;
  armorer_id: number;
  problem_reported: string;
  work_performed: string;
  personnel?: {
    first_name: string;
    last_name: string;
    badge_number: string;
  };
}

export interface Manufacturer {
  manufacturer_id: number;
  name: string;
}

export interface Model {
  model_id: number;
  manufacturer_id: number;
  name: string;
}

export interface Caliber {
  caliber_id: number;
  name: string;
}

export async function addFirearm(newFirearm: Partial<Firearm>) {
  const { data, error } = await supabase
    .from("firearm")
    .insert([newFirearm])
    .select();
  if (error) throw error;
  return data as Firearm[];
}

export async function deleteFirearm(id: number) {
  const { error } = await supabase
    .from("firearm")
    .delete()
    .eq("firearm_id", id);
  if (error) throw error;
}

export function useFirearms() {
  const [data, setData] = useState<Firearm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchFirearmData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const { data, error } = await supabase
        .from("firearm")
        .select(`*, service_schedule ( next_due_date )`);
      if (error) throw error;
      const flattened = (data || []).map((item: any) => ({
        ...item,
        next_due_date: item.service_schedule?.next_due_date,
      }));
      setData(flattened as Firearm[]);
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFirearmData();
  }, [fetchFirearmData]);

  return { data, isLoading, isError, refetch: fetchFirearmData };
}

export function useFirearm(id: string | undefined) {
  const [data, setData] = useState<Firearm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchFirearm = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("firearm")
          .select("*")
          .eq("firearm_id", id)
          .single();
        if (error) throw error;
        setData(data as Firearm);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFirearm();
  }, [id]);

  return { data, isLoading, isError };
}

export function useMaintenanceLogs(firearmId: string | undefined) {
  const [data, setData] = useState<MaintenanceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchLogs = useCallback(async () => {
    if (!firearmId) return;
    setIsLoading(true);
    setIsError(false);
    try {
      const { data, error } = await supabase
        .from("maintenance_log")
        .select(`*, personnel ( first_name, last_name, badge_number )`)
        .eq("firearm_id", firearmId)
        .order("date_performed", { ascending: false });
      if (error) throw error;
      setData((data || []) as MaintenanceLog[]);
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [firearmId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { data, isLoading, isError, refetch: fetchLogs };
}

export async function addMaintenanceLog(log: Partial<MaintenanceLog>) {
  const { data, error } = await supabase
    .from("maintenance_log")
    .insert([log])
    .select();
  if (error) throw error;
  return data as MaintenanceLog[];
}

export async function getManufacturers() {
  const { data, error } = await supabase
    .from("reference_manufacturers")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data || []) as Manufacturer[];
}

export async function getModels(manufacturerId: number) {
  const { data, error } = await supabase
    .from("reference_models")
    .select("*")
    .eq("manufacturer_id", manufacturerId)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data || []) as Model[];
}

export async function getCalibers(modelId: number) {
  const { data, error } = await supabase
    .from("model_valid_calibers")
    .select(`caliber_id, reference_calibers ( caliber_id, name )`)
    .eq("model_id", modelId);
  if (error) throw error;
  return (data || []).map((item: any) => item.reference_calibers) as Caliber[];
}
