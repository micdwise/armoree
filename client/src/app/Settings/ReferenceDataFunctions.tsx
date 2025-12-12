import { supabase } from "../../lib/supabase";
import { Manufacturer, Model, Caliber } from "../Firearms/hooks";

// Locations
export interface LocationRef {
  location_id: number;
  location_name: string;
  security_level: number;
}

// --- Manufacturers ---

export async function AddManufacturer(name: string) {
  const { data, error } = await supabase
    .from("reference_manufacturers")
    .insert([{ name }])
    .select()
    .single();
  if (error) throw error;
  return data as Manufacturer;
}

export async function UpdateManufacturer(id: number, name: string) {
  const { data, error } = await supabase
    .from("reference_manufacturers")
    .update({ name })
    .eq("manufacturer_id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Manufacturer;
}

export async function DeleteManufacturer(id: number) {
  const { error } = await supabase
    .from("reference_manufacturers")
    .delete()
    .eq("manufacturer_id", id);
  if (error) throw error;
}

// --- Calibers ---

export async function GetAllCalibers() {
  const { data, error } = await supabase
    .from("reference_calibers")
    .select("*")
    .order("name");
  if (error) throw error;
  return data as Caliber[];
}

export async function AddCaliber(name: string) {
  const { data, error } = await supabase
    .from("reference_calibers")
    .insert([{ name }])
    .select()
    .single();
  if (error) throw error;
  return data as Caliber;
}

export async function UpdateCaliber(id: number, name: string) {
  const { data, error } = await supabase
    .from("reference_calibers")
    .update({ name })
    .eq("caliber_id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Caliber;
}

export async function DeleteCaliber(id: number) {
  const { error } = await supabase
    .from("reference_calibers")
    .delete()
    .eq("caliber_id", id);
  if (error) throw error;
}

// --- Models ---

export async function AddModel(manufacturerId: number, name: string) {
  const { data, error } = await supabase
    .from("reference_models")
    .insert([{ manufacturer_id: manufacturerId, name }])
    .select()
    .single();
  if (error) throw error;
  return data as Model;
}

export async function UpdateModel(id: number, name: string) {
  const { data, error } = await supabase
    .from("reference_models")
    .update({ name })
    .eq("model_id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Model;
}

export async function DeleteModel(id: number) {
  const { error } = await supabase
    .from("reference_models")
    .delete()
    .eq("model_id", id);
  if (error) throw error;
}

// --- Locations ---

export async function GetAllLocations() {
  const { data, error } = await supabase
    .from("location")
    .select("location_id, location_name, security_level")
    .order("location_name");
  if (error) throw error;
  return data as LocationRef[];
}

export async function AddLocation(
  location_name: string,
  security_level: number
) {
  const { data, error } = await supabase
    .from("location")
    .insert([{ location_name, security_level }])
    .select()
    .single();
  if (error) throw error;
  return data as LocationRef;
}

export async function UpdateLocation(
  id: number,
  location_name: string,
  security_level: number
) {
  const { data, error } = await supabase
    .from("location")
    .update({ location_name, security_level })
    .eq("location_id", id)
    .select()
    .single();
  if (error) throw error;
  return data as LocationRef;
}

export async function DeleteLocation(id: number) {
  const { error } = await supabase
    .from("location")
    .delete()
    .eq("location_id", id);
  if (error) throw error;
}

// --- Model Calibers (Linking) ---

export async function GetModelCaliberIds(modelId: number) {
  const { data, error } = await supabase
    .from("model_valid_calibers")
    .select("caliber_id")
    .eq("model_id", modelId);

  if (error) throw error;
  return data.map((d) => d.caliber_id) as number[];
}

export async function UpdateModelCalibers(
  modelId: number,
  caliberIds: number[]
) {
  // This is a "sync" operation.
  // 1. Delete all existing for this model (simplest approach for small data)
  // 2. Insert new ones

  // Start transaction (supabase doesn't support explicit transactions in client perfectly without RPC,
  // but we can do it sequentially. If clear fail, user can retry. Ideally use RPC.)

  // Naive approach:

  const { error: deleteError } = await supabase
    .from("model_valid_calibers")
    .delete()
    .eq("model_id", modelId);

  if (deleteError) throw deleteError;

  if (caliberIds.length > 0) {
    const toInsert = caliberIds.map((cid) => ({
      model_id: modelId,
      caliber_id: cid,
    }));

    const { error: insertError } = await supabase
      .from("model_valid_calibers")
      .insert(toInsert);

    if (insertError) throw insertError;
  }
}
