import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isChromeMobile, rejectVoicePermission, unlockVoice } from "@/lib/tts";

const VOICE_PERMISSION_KEY = "alfabetrix_voice_permission";

function shouldRequestVoicePermission() {
  if (typeof window === "undefined") return false;
  if (!isChromeMobile()) return false;

  try {
    return !localStorage.getItem(VOICE_PERMISSION_KEY);
  } catch {
    return true;
  }
}

export default function VoicePermissionModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(shouldRequestVoicePermission());
  }, []);

  const handleAccept = () => {
    unlockVoice();
    setVisible(false);
  };

  const handleReject = () => {
    rejectVoicePermission();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 px-5 py-8">
      <section className="w-full max-w-sm rounded-[2rem] border border-white/70 bg-[#FFF8EC] p-6 text-center shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-guinda/10 text-guinda">
          <Volume2 className="h-8 w-8" />
        </div>

        <h2 className="text-2xl font-black tracking-[-0.04em] text-guinda">
          Activar voz de apoyo
        </h2>

        <p className="mt-3 text-base font-semibold leading-relaxed text-foreground">
          Para que ALFABETRIX pueda leer instrucciones y actividades en voz alta,
          toque Aceptar. Esto ayuda a escuchar cada paso con calma.
        </p>

        <p className="mt-3 text-sm font-bold text-muted-foreground">
          Puede continuar sin voz si lo prefiere.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-13 rounded-[1.2rem] border-border bg-white/80 text-base font-black text-muted-foreground hover:bg-white"
            onClick={handleReject}
          >
            Rechazar
          </Button>

          <Button
            type="button"
            className="h-13 rounded-[1.2rem] bg-guinda text-base font-black text-white shadow-soft hover:bg-guinda/90"
            onClick={handleAccept}
          >
            Aceptar
          </Button>
        </div>
      </section>
    </div>
  );
}
