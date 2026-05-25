import { supabase } from "./supabaseClient";

function normalizeEndpoint(endpoint) {
  return endpoint.replace(/^\/+/, "").replace(/index\.php$/, "");
}

function getSearchParams(endpoint) {
  const [, search = ""] = endpoint.split("?");
  return new URLSearchParams(search);
}

function parseBody(options) {
  if (!options.body) return {};
  if (typeof options.body === "string") return JSON.parse(options.body);
  return options.body;
}

function withResponse(data) {
  return { success: true, data: data || [] };
}

function toDbFlag(value, defaultValue = false) {
  return value ?? defaultValue ? 1 : 0;
}

async function createProfile(body) {
  const profilePayload = {
    id: crypto.randomUUID(),
    name: body.name,
    age: body.age ?? null,
    onboarding_complete: toDbFlag(body.onboarding_complete, true),
  };

  if (body.photo_url) profilePayload.photo_url = body.photo_url;
  if (body.current_level) profilePayload.current_level = body.current_level;
  if (body.total_stars !== undefined) profilePayload.total_stars = body.total_stars;

  const result = await supabase
    .from("user_profiles")
    .insert(profilePayload)
    .select()
    .single();

  if (result.error) return result;

  const { error: settingsError } = await supabase.from("user_settings").insert({
    user_profile_id: result.data.id,
    font_size: body.font_size || "large",
    high_contrast: toDbFlag(body.high_contrast, false),
    volume: body.volume ?? 80,
    voice_enabled: toDbFlag(body.voice_enabled, true),
    music_enabled: toDbFlag(body.music_enabled, false),
    navigation_voice: toDbFlag(body.navigation_voice, true),
    reduced_motion: toDbFlag(body.reduced_motion, false),
  });

  if (settingsError) {
    console.warn("No se pudo crear user_settings inicial:", settingsError);
  }

  return result;
}

export async function request(endpoint, options = {}) {
  try {
    const normalizedEndpoint = normalizeEndpoint(endpoint);
    const params = getSearchParams(normalizedEndpoint);
    const method = (options.method || "GET").toUpperCase();
    let result;

    if (normalizedEndpoint.startsWith("profiles")) {
      if (method === "POST") {
        result = await createProfile(parseBody(options));
      } else if (method === "DELETE") {
        result = await supabase
          .from("user_profiles")
          .delete()
          .eq("id", params.get("id"))
          .select();
      } else {
        result = await supabase
          .from("user_profiles")
          .select("*")
          .order("created_at", { ascending: true });
      }
    } else if (normalizedEndpoint.startsWith("modules")) {
      result = await supabase
        .from("modules")
        .select("*")
        .eq("is_active", 1)
        .order("order_index", { ascending: true });
    } else if (normalizedEndpoint.startsWith("activities")) {
      let query = supabase
        .from("activities")
        .select("*")
        .eq("is_active", 1);

      if (params.get("module_id")) {
        query = query.eq("module_id", params.get("module_id"));
      }

      result = await query.order("created_at", { ascending: true });

      if (!result.error) {
        result.data = (result.data || []).map((activity) => ({
          ...activity,
          type: activity.activity_type,
          correct: activity.correct_answer,
          example_audio: activity.example_text,
        }));
      }
    } else if (normalizedEndpoint.startsWith("activity-options")) {
      result = await supabase
        .from("activity_options")
        .select("*")
        .eq("activity_id", params.get("activity_id"))
        .order("order_index", { ascending: true });
    } else if (normalizedEndpoint.startsWith("progress")) {
      if (method === "POST") {
        const body = parseBody(options);
        result = await supabase
          .from("module_progress")
          .upsert(
            {
              id: crypto.randomUUID(),
              current_round: 1,
              last_activity_at: new Date().toISOString(),
              completed_at: body.completed ? new Date().toISOString() : null,
              ...body,
              completed: toDbFlag(body.completed, false),
            },
            { onConflict: "user_profile_id,module_id" }
          )
          .select()
          .single();
      } else {
        let query = supabase.from("module_progress").select("*");

        if (params.get("user_profile_id")) {
          query = query.eq("user_profile_id", params.get("user_profile_id"));
        }

        if (params.get("module_id")) {
          query = query.eq("module_id", params.get("module_id"));
        }

        result = await query.order("updated_at", { ascending: false });
      }
    } else if (normalizedEndpoint.startsWith("rewards")) {
      const activeProfileId = localStorage.getItem("activeProfileId");
      const profileId = params.get("user_profile_id") || activeProfileId;
      let query = supabase
        .from("user_rewards")
        .select("*");

      if (profileId) {
        query = query.eq("user_profile_id", profileId);
      }

      const [rewardsResult, catalogResult] = await Promise.all([
        query.order("unlocked_at", { ascending: false }),
        supabase.from("reward_catalog").select("*").eq("is_active", 1),
      ]);

      if (rewardsResult.error) throw rewardsResult.error;
      if (catalogResult.error) throw catalogResult.error;

      const catalogById = new Map(
        (catalogResult.data || []).map((reward) => [String(reward.id), reward])
      );

      const rewards = (rewardsResult.data || []).map((reward) => ({
        ...(catalogById.get(String(reward.reward_id)) || {}),
        ...reward,
        id: reward.id,
        reward_id: reward.reward_id,
        type: catalogById.get(String(reward.reward_id))?.reward_type,
        title: catalogById.get(String(reward.reward_id))?.name,
        earned_at: reward.unlocked_at,
      }));

      return withResponse(rewards);
    } else {
      throw new Error(`Endpoint no soportado en Supabase: ${endpoint}`);
    }

    if (result.error) throw result.error;

    return withResponse(result.data);
  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
}

export default {
	
	request,

  getModules() {
    return request("/modules/");
  },

  getActivities(moduleId=null){

    let url="/activities/";

    if(moduleId){
      url+=`?module_id=${moduleId}`;
    }

    return request(url);

  }

};
