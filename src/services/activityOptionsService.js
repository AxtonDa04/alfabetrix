import { supabase } from "./supabaseClient";

export async function getActivityOptions(activityId) {
  const { data, error } = await supabase
    .from("activity_options")
    .select("*")
    .eq("activity_id", activityId)
    .order("order_index", { ascending: true });

  if (error) throw error;

  return data || [];
}
