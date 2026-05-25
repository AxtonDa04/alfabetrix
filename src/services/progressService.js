import { supabase } from "./supabaseClient";

export async function getProgress({ userProfileId = null, moduleId = null } = {}) {
  let query = supabase.from("module_progress").select("*");

  if (userProfileId) {
    query = query.eq("user_profile_id", userProfileId);
  }

  if (moduleId) {
    query = query.eq("module_id", moduleId);
  }

  const { data, error } = await query.order("updated_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function saveProgress(progressData) {
  const payload = {
    id: crypto.randomUUID(),
    current_round: 1,
    last_activity_at: new Date().toISOString(),
    completed_at: progressData.completed ? new Date().toISOString() : null,
    ...progressData,
  };

  const { data, error } = await supabase
    .from("module_progress")
    .upsert(payload, { onConflict: "user_profile_id,module_id" })
    .select()
    .single();

  if (error) throw error;

  return data;
}
