import { supabase } from "./supabaseClient";

export async function getRewards(userProfileId = null) {
  const activeProfileId =
    localStorage.getItem("activeProfileId") ||
    localStorage.getItem("alfabetrix_profile_id");
  const profileId = userProfileId || activeProfileId;
  let query = supabase
    .from("user_rewards")
    .select("*");

  if (profileId) {
    query = query.eq("user_profile_id", profileId);
  }

  const [{ data: userRewards, error }, catalog] = await Promise.all([
    query.order("unlocked_at", { ascending: false }),
    getRewardCatalog(),
  ]);

  if (error) throw error;

  const catalogById = new Map(
    catalog.map((reward) => [String(reward.id), reward])
  );

  return (userRewards || []).map((reward) => ({
    ...(catalogById.get(String(reward.reward_id)) || {}),
    ...reward,
    id: reward.id,
    reward_id: reward.reward_id,
    type: catalogById.get(String(reward.reward_id))?.reward_type,
    title: catalogById.get(String(reward.reward_id))?.name,
    earned_at: reward.unlocked_at,
  }));
}

export async function getRewardCatalog() {
  const { data, error } = await supabase
    .from("reward_catalog")
    .select("*")
    .eq("is_active", 1)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || []).map((reward) => ({
    ...reward,
    type: reward.reward_type,
  }));
}
