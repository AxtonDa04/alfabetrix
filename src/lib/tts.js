let currentUtterance = null;
let cachedVoices = [];

const PREFERRED_VOICE_NAMES = [
  "google español",
  "microsoft dalia",
  "microsoft sabina",
  "microsoft helena",
  "paulina",
  "sabina",
  "dalia",
  "helena",
];

function getSpeechSynthesis() {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis || null;
}

function getStorageValue(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStorageValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors in private or restricted browsers.
  }
}

export function isChromeMobile() {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent || "";
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
  const isChrome = /Chrome|CriOS/i.test(ua) && !/Edg|OPR|SamsungBrowser/i.test(ua);

  return isMobile && isChrome;
}

function hasActiveUserGesture() {
  if (typeof navigator === "undefined") return false;
  return Boolean(navigator.userActivation?.isActive);
}

function loadVoices() {
  const synthesis = getSpeechSynthesis();
  if (!synthesis) return [];

  const voices = synthesis.getVoices();
  if (voices.length > 0) cachedVoices = voices;

  return cachedVoices;
}

function scoreSpanishVoice(voice) {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();
  let score = 0;

  if (lang === "es-mx") score += 40;
  else if (lang.startsWith("es")) score += 25;

  const preferredIndex = PREFERRED_VOICE_NAMES.findIndex((preferredName) =>
    name.includes(preferredName)
  );

  if (preferredIndex >= 0) score += 30 - preferredIndex;
  if (name.includes("google")) score += 8;
  if (name.includes("microsoft")) score += 8;

  return score;
}

function getBestSpanishVoice() {
  const voices = loadVoices();
  if (!voices.length) return null;

  return voices
    .filter((voice) => voice.lang.toLowerCase().startsWith("es"))
    .sort((a, b) => scoreSpanishVoice(b) - scoreSpanishVoice(a))[0] || null;
}

export function preloadVoices() {
  return loadVoices();
}

export function debugVoices() {
  if (!import.meta.env.DEV || !import.meta.env.VITE_TTS_DEBUG) return;

  const voices = loadVoices();
  console.table(
    voices.map((voice) => ({
      name: voice.name,
      lang: voice.lang,
    }))
  );
}

function applyVoiceSettings(utterance, volume) {
  utterance.lang = "es-MX";
  utterance.rate = 0.82;
  utterance.pitch = 1.08;
  utterance.volume = Math.max(0, Math.min(1, volume));

  const spanishVoice = getBestSpanishVoice();
  if (spanishVoice) utterance.voice = spanishVoice;
}

export function unlockVoice() {
  const synthesis = getSpeechSynthesis();
  if (!synthesis) return false;

  try {
    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance("Voz activada.");
    applyVoiceSettings(utterance, 0.2);
    currentUtterance = utterance;
    synthesis.speak(utterance);

    setStorageValue("alfabetrix_voice_unlocked", "1");
    setStorageValue("alfabetrix_voice_permission", "accepted");
    return true;
  } catch {
    return false;
  }
}

export function rejectVoicePermission() {
  setStorageValue("alfabetrix_voice_permission", "rejected");

  try {
    localStorage.removeItem("alfabetrix_voice_unlocked");
  } catch {
    // Ignore storage errors in private or restricted browsers.
  }
}

export function speak(text, onEnd) {
  const synthesis = getSpeechSynthesis();
  if (!synthesis || !text) return;

  if (isChromeMobile()) {
    const permission = getStorageValue("alfabetrix_voice_permission");
    const unlocked = getStorageValue("alfabetrix_voice_unlocked") === "1";

    if (permission === "rejected") return;
    if (!unlocked && !hasActiveUserGesture()) return;
  }

  synthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  const volume = parseInt(localStorage.getItem("alfabetrix_volume") || "80", 10);
  applyVoiceSettings(utterance, volume / 100);

  if (onEnd) utterance.onend = onEnd;
  currentUtterance = utterance;
  synthesis.speak(utterance);
}

export function stopSpeaking() {
  const synthesis = getSpeechSynthesis();
  if (synthesis) synthesis.cancel();
}

const synthesis = getSpeechSynthesis();
if (synthesis) {
  preloadVoices();
  synthesis.onvoiceschanged = () => {
    preloadVoices();
    debugVoices();
  };
}
