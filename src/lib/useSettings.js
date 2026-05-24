import { useState, useEffect } from "react";

const DEFAULTS = { fontSize: "large", highContrast: false, volume: 80 };

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("alfabetrix_settings");
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
  });

  useEffect(() => {
    localStorage.setItem("alfabetrix_settings", JSON.stringify(settings));
    localStorage.setItem("alfabetrix_volume", String(settings.volume));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const fontClass = settings.fontSize === "extra-large" ? "text-2xl" : settings.fontSize === "large" ? "text-xl" : "text-lg";
  const contrastClass = settings.highContrast ? "high-contrast" : "";

  return { settings, updateSetting, fontClass, contrastClass };
}