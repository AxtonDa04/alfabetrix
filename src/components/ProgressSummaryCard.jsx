import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

export default function ProgressSummaryCard({
  completed = 0,
  total = 6,
  percentage = 0,
  nextLabel = "Continuar aprendiendo",
}) {
  return (
    <section className="app-card overflow-hidden">
      <div className="relative p-6">
        <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-verde/12 blur-2xl" />

        <div className="relative">
          <p className="app-chip mb-3">Resumen general</p>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black tracking-[-0.05em]">
                {completed} / {total}
              </h2>
              <p className="mt-1 text-sm font-bold text-muted-foreground">
                Módulos completados
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-guinda/10 text-guinda">
              <Sparkles className="h-8 w-8" />
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-sm font-black text-muted-foreground">
              <span>Ruta completada</span>
              <span>{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3 rounded-full bg-guinda/12" />
          </div>

          <div className="mt-5 rounded-[1.35rem] border border-border/70 bg-white/70 p-4">
            <p className="text-sm font-black text-guinda">Siguiente paso</p>
            <p className="mt-1 text-base font-extrabold">{nextLabel}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
