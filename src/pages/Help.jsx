import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, ChevronDown, PlayCircle, Hand, RefreshCw, CircleHelp } from "lucide-react";
import { speak } from "../lib/tts";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import AppHeader from "@/components/AppHeader";

const FAQS = [
  {
    q: "¿Cómo inicio una lección?",
    a: "Toque Aprender en el menú principal. Después elija un módulo disponible.",
  },
  {
    q: "¿Qué hago si no entiendo un ejercicio?",
    a: "Toque Escuchar para oír la instrucción otra vez. También puede tocar Pista.",
  },
  {
    q: "¿Cómo desbloqueo un módulo?",
    a: "Complete el módulo anterior con setenta por ciento o más. Así se abre el siguiente.",
  },
  {
    q: "¿Puedo repetir un módulo?",
    a: "Sí. Puede repetir cualquier módulo las veces que necesite.",
  },
  {
    q: "¿Cómo hago la letra más grande?",
    a: "Entre a Configuración y elija el tamaño de letra grande o muy grande.",
  },
  {
    q: "¿Qué son las estrellas?",
    a: "Las estrellas reconocen su avance. Tres estrellas indican un avance excelente.",
  },
];

const STEPS = [
  {
    icon: PlayCircle,
    title: "Escuche",
    text: "La app lee la instrucción en voz alta.",
  },
  {
    icon: Hand,
    title: "Toque",
    text: "Elija una respuesta grande y clara.",
  },
  {
    icon: RefreshCw,
    title: "Repita",
    text: "Puede volver a practicar con calma.",
  },
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <main className="app-page safe-bottom">
      <div className="app-container">
        <AppHeader
          title="Ayuda"
          subtitle="Guía rápida para usar ALFABETRIX"
        />

        <section className="app-card p-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-guinda/10 text-4xl">
            🧠
          </div>
          <h2 className="text-2xl font-black">Soy Lex, su guía</h2>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">
            Toque cualquier pregunta para leerla y use el botón de audio para escuchar la respuesta.
          </p>
          <Button
            className="app-secondary mt-5 w-full gap-2"
            variant="outline"
            onClick={() => speak("Bienvenido a la ayuda. Escuche con calma. Toque una pregunta para conocer la respuesta.")}
          >
            <Volume2 className="h-5 w-5 text-guinda" />
            Escuchar explicación
          </Button>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title} className="app-card-soft p-4 text-center">
              <step.icon className="mx-auto mb-2 h-7 w-7 text-guinda" />
              <p className="font-black">{step.title}</p>
              <p className="mt-1 text-xs font-semibold leading-snug text-muted-foreground">
                {step.text}
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-3">
          {FAQS.map((faq, i) => (
            <Collapsible
              key={i}
              open={openIndex === i}
              onOpenChange={(open) => setOpenIndex(open ? i : null)}
            >
              <CollapsibleTrigger asChild>
                <button className="app-card-soft flex w-full items-center gap-3 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-soft">
                  <CircleHelp className="h-5 w-5 shrink-0 text-guinda" />
                  <span className="flex-1 text-lg font-black leading-tight">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 pb-3">
                <div className="mt-2 flex items-start gap-3 rounded-[1.35rem] border border-border/70 bg-white/75 p-4">
                  <p className="flex-1 text-base font-semibold leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 shrink-0 rounded-2xl bg-guinda/10 hover:bg-guinda/20"
                    onClick={() => speak(faq.a)}
                    aria-label="Escuchar respuesta"
                  >
                    <Volume2 className="h-5 w-5 text-guinda" />
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </section>
      </div>
    </main>
  );
}
