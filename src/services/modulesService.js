import { supabase } from "./supabaseClient";

export async function getModules() {
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("is_active", 1)
    .order("order_index", { ascending: true });

  if (error) throw error;

  return data || [];
}
