import { supabase } from "./supabaseClient";

export async function getActivities(moduleId) {
  let query = supabase
    .from("activities")
    .select("*")
    .eq("is_active", true);

  if (moduleId) {
    query = query.eq("module_id", moduleId);
  }

  const { data, error } = await query.order("created_at", { ascending: true });

  if (error) throw error;

  return (data || []).map((activity) => ({
    ...activity,
    type: activity.activity_type,
    correct: activity.correct_answer,
    example_audio: activity.example_text,
  }));
}
