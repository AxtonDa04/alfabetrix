import { useState, useEffect } from "react";
import {
  getProfileSettings,
  getStoredActiveProfileId,
  saveProfileSettings,
} from "@/services/profileService";

const DEFAULTS = {
  fontSize: "large",
  highContrast: false,
  volume: 80,
  voiceEnabled: true,
  musicEnabled: false,
  navigationVoice: true,
  reducedMotion: false,
};

function parseSavedSettings() {
  try {
    const saved = localStorage.getItem("alfabetrix_settings");
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function toLocalSettings(settings) {
  if (!settings) return DEFAULTS;

  return {
    fontSize: settings.font_size || DEFAULTS.fontSize,
    highContrast: settings.high_contrast ?? DEFAULTS.highContrast,
    volume: settings.volume ?? DEFAULTS.volume,
    voiceEnabled: settings.voice_enabled ?? DEFAULTS.voiceEnabled,
    musicEnabled: settings.music_enabled ?? DEFAULTS.musicEnabled,
    navigationVoice: settings.navigation_voice ?? DEFAULTS.navigationVoice,
    reducedMotion: settings.reduced_motion ?? DEFAULTS.reducedMotion,
  };
}

function toRemoteSettings(settings) {
  return {
    font_size: settings.fontSize,
    high_contrast: settings.highContrast,
    volume: settings.volume,
    voice_enabled: settings.voiceEnabled,
    music_enabled: settings.musicEnabled,
    navigation_voice: settings.navigationVoice,
    reduced_motion: settings.reducedMotion,
  };
}

export function useSettings() {
  const [settings, setSettings] = useState(parseSavedSettings);

  useEffect(() => {
    let isMounted = true;

    async function loadRemoteSettings() {
      try {
        const profileId = getStoredActiveProfileId();
        const remoteSettings = await getProfileSettings(profileId);

        if (!isMounted || !remoteSettings) return;

        setSettings((current) => ({
          ...current,
          ...toLocalSettings(remoteSettings),
        }));
      } catch (error) {
        console.warn("No se pudo cargar user_settings:", error);
      }
    }

    loadRemoteSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("alfabetrix_settings", JSON.stringify(settings));
    localStorage.setItem("alfabetrix_volume", String(settings.volume));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => {
      const nextSettings = { ...prev, [key]: value };
      const profileId = getStoredActiveProfileId();

      saveProfileSettings(profileId, toRemoteSettings(nextSettings)).catch((error) => {
        console.warn("No se pudo guardar user_settings:", error);
      });

      return nextSettings;
    });
  };

  const fontClass = settings.fontSize === "extra-large" ? "text-2xl" : settings.fontSize === "large" ? "text-xl" : "text-lg";
  const contrastClass = settings.highContrast ? "high-contrast" : "";

  return { settings, updateSetting, fontClass, contrastClass };
}
