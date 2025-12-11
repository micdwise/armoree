import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";

export interface Firearm {
  firearm_id: number;
  manufacturer: string;
  model: string;
  type: string;
  purchase_date: string;
  caliber: string;
  serial_number: string;
  asset_tag: string;
  current_status: string;
  next_due_date?: string;
}

async function AddFirearms(newFirearm: Partial<Firearm>) {
  const { data, error } = await supabase
    .from("firearm")
    .insert([newFirearm])
    .select();
  if (error) throw error;
  return data;
}

async function DeleteFirearm(id: number) {
  const { error } = await supabase
    .from("firearm")
    .delete()
    .eq("firearm_id", id);
  if (error) throw error;
}

const GetFirearms = () => {
  const [data, setData] = useState<Firearm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchFirearmData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const { data, error } = await supabase.from("firearm").select(`
        *,
        service_schedule (
          next_due_date
        )
      `);

      if (error) throw error;

      if (data) {
        // Flatten the data
        const flattenedData = data.map((item: any) => ({
          ...item,
          next_due_date: item.service_schedule?.next_due_date
        }));
        setData(flattenedData as Firearm[]);
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFirearmData();
  }, [fetchFirearmData]);

  return { data, isLoading, isError, refetch: fetchFirearmData };
};

const GetFirearm = (id: string | undefined) => {
  const [data, setData] = useState<Firearm | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

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
        setData(data as unknown as Firearm);
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
};

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

async function GetManufacturers() {
  const { data, error } = await supabase
    .from("reference_manufacturers")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data as Manufacturer[];
}

async function GetModels(manufacturerId: number) {
  const { data, error } = await supabase
    .from("reference_models")
    .select("*")
    .eq("manufacturer_id", manufacturerId)
    .order("name", { ascending: true });
  if (error) throw error;
  return data as Model[];
}

async function GetCalibers(modelId: number) {
  const { data, error } = await supabase
    .from("model_valid_calibers")
    .select(
      `
      caliber_id,
      reference_calibers (
        caliber_id,
        name
      )
    `,
    )
    .eq("model_id", modelId);

  if (error) throw error;
  // Flatten the result
  return data.map((item: any) => item.reference_calibers) as Caliber[];
}

export {
  GetFirearms,
  GetFirearm,
  AddFirearms,
  DeleteFirearm,
  GetManufacturers,
  GetModels,
  GetCalibers,
};
