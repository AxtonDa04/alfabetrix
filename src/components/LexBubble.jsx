import { useEffect } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speak } from "../lib/tts";

export default function LexBubble({ message, autoSpeak = true, title = "Lex dice:" }) {
  useEffect(() => {
    if (autoSpeak && message) {
      const timer = setTimeout(() => speak(message), 300);
      return () => clearTimeout(timer);
    }
  }, [message, autoSpeak]);

  if (!message) return null;

  return (
    <section className="app-card-soft p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-guinda/10 text-3xl ring-1 ring-guinda/10">
          🧠
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-1 text-sm font-black uppercase tracking-[0.12em] text-guinda">
            {title}
          </p>
          <p className="text-[1.05rem] leading-relaxed text-foreground">
            {message}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 shrink-0 rounded-2xl bg-white/60 hover:bg-white"
          onClick={() => speak(message)}
          aria-label="Escuchar mensaje"
        >
          <Volume2 className="h-6 w-6 text-guinda" />
        </Button>
      </div>
    </section>
  );
}
