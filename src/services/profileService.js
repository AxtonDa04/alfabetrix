import { supabase } from "./supabaseClient";

function safeJsonParse(value) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function toDbFlag(value, defaultValue = false) {
  return value ?? defaultValue ? 1 : 0;
}

export function getStoredActiveProfileId() {
  const directId =
    localStorage.getItem("activeProfileId") ||
    localStorage.getItem("alfabetrix_profile_id");

  if (directId) return String(directId);

  const profile = safeJsonParse(localStorage.getItem("alfabetrix_profile"));
  const profileId =
    profile?.id ??
    profile?.user_profile_id ??
    profile?.profile_id ??
    profile?.userProfileId;

  return profileId ? String(profileId) : null;
}

export function getActiveProfile(profiles = []) {
  const activeProfileId = getStoredActiveProfileId();

  if (!activeProfileId) return null;

  return profiles.find((profile) => String(profile.id) === activeProfileId) || null;
}

export async function getProfiles() {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data || [];
}

export async function createProfile(profileData) {
  const profilePayload = {
    id: crypto.randomUUID(),
    name: profileData.name,
    age: profileData.age ?? null,
    onboarding_complete: toDbFlag(profileData.onboarding_complete, true),
  };

  if (profileData.photo_url) {
    profilePayload.photo_url = profileData.photo_url;
  }

  if (profileData.current_level) {
    profilePayload.current_level = profileData.current_level;
  }

  if (profileData.total_stars !== undefined) {
    profilePayload.total_stars = profileData.total_stars;
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .insert(profilePayload)
    .select()
    .single();

  if (error) throw error;

  const settingsPayload = {
    user_profile_id: data.id,
    font_size: profileData.font_size || "large",
    high_contrast: toDbFlag(profileData.high_contrast, false),
    volume: profileData.volume ?? 80,
    voice_enabled: toDbFlag(profileData.voice_enabled, true),
    music_enabled: toDbFlag(profileData.music_enabled, false),
    navigation_voice: toDbFlag(profileData.navigation_voice, true),
    reduced_motion: toDbFlag(profileData.reduced_motion, false),
  };

  const { error: settingsError } = await supabase
    .from("user_settings")
    .insert(settingsPayload);

  if (settingsError) {
    console.warn("No se pudo crear user_settings inicial:", settingsError);
  }

  return { success: true, data };
}

export async function getProfileSettings(userProfileId) {
  if (!userProfileId) return null;

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_profile_id", userProfileId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function saveProfileSettings(userProfileId, settings) {
  if (!userProfileId) return null;

  const payload = {
    user_profile_id: userProfileId,
    font_size: settings.font_size,
    high_contrast: toDbFlag(settings.high_contrast, false),
    volume: settings.volume,
    voice_enabled: toDbFlag(settings.voice_enabled, true),
    music_enabled: toDbFlag(settings.music_enabled, false),
    navigation_voice: toDbFlag(settings.navigation_voice, true),
    reduced_motion: toDbFlag(settings.reduced_motion, false),
    updated_at: new Date().toISOString(),
  };

  const { data: updatedRows, error: updateError } = await supabase
    .from("user_settings")
    .update(payload)
    .eq("user_profile_id", userProfileId)
    .select();

  if (updateError) throw updateError;

  if (updatedRows?.length) return updatedRows[0];

  const { data, error } = await supabase
    .from("user_settings")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteProfile(profileId) {
  if (!profileId) {
    throw new Error("No se recibió el ID del perfil a eliminar.");
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .delete()
    .eq("id", profileId)
    .select();

  if (error) throw error;

  return { success: true, data: data || [] };
}
