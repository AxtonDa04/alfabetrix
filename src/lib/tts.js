let currentUtterance = null;

export function speak(text, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-MX";
  utterance.rate = 0.85;
  utterance.pitch = 1.0;
  
  const volume = parseInt(localStorage.getItem("alfabetrix_volume") || "80", 10);
  utterance.volume = volume / 100;

  const voices = window.speechSynthesis.getVoices();
  const spanishVoice = voices.find(v => v.lang.startsWith("es-MX")) || voices.find(v => v.lang.startsWith("es"));
  if (spanishVoice) utterance.voice = spanishVoice;

  if (onEnd) utterance.onend = onEnd;
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

// Pre-load voices
if (window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}