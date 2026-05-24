import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getModules } from "@/services/modulesService";
import { getProfiles } from "@/services/profileService";
import { getProgress } from "@/services/progressService";

import { speak } from "../lib/tts";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, BookOpen, Star, ArrowRight, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import AppHeader from "@/components/AppHeader";

const MODULE_ICONS = {
  vocales: "A",
  consonantes: "M",
  silabas: "MA",
  palabras: "PAN",
  frases: "📖",
  comprension: "🧠",
};

const MODULE_COLORS = {
  vocales: "bg-guinda/10 text-guinda border-guinda/20",
  consonantes: "bg-verde/10 text-verde border-verde/20",
  silabas: "bg-guinda/10 text-guinda border-guinda/20",
  palabras: "bg-verde/10 text-verde border-verde/20",
  frases: "bg-blue-50 text-blue-700 border-blue-200",
  comprension: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function ModuleSelect() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const mysqlModules = await getModules();

        const formattedModules = mysqlModules.map((mod) => ({
          id: Number(mod.order_index),
          dbId: mod.id,
          key: mod.module_key,
          name: mod.name,
          description: mod.description,
          minimumScoreToUnlock: Number(mod.minimum_score_to_unlock || 70),
          icon: MODULE_ICONS[mod.module_key] || <BookOpen className="h-6 w-6" />,
          color: MODULE_COLORS[mod.module_key] || "bg-guinda/10 text-guinda border-guinda/20",
        }));

        setModules(formattedModules);

        const profiles = await getProfiles();

        if (profiles.length > 0) {
          const allProgress = await getProgress({
            userProfileId: profiles[0].id,
          });

          const map = {};

          allProgress.forEach((item) => {
            map[item.module_id] = {
              ...item,
              percentage: Number(item.percentage || 0),
              stars: Number(item.stars || 0),
              completed:
                item.completed === 1 ||
                item.completed === true ||
                item.completed === "1",
            };
          });

          setProgressMap(map);
        }

        speak("Elija el módulo que desea practicar.");
      } catch (error) {
        console.error("Error al cargar módulos o progreso desde MySQL:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const isUnlocked = (module) => {
    if (module.id === 1) return true;

    const previousModule = modules.find((item) => item.id === module.id - 1);
    if (!previousModule) return false;

    const previousProgress = progressMap[previousModule.dbId];

    return previousProgress && previousProgress.percentage >= module.minimumScoreToUnlock;
  };

  const completedCount = Object.values(progressMap).filter((item) => item.completed).length;
  const totalModules = modules.length || 6;
  const routePercentage = totalModules ? Math.round((completedCount / totalModules) * 100) : 0;

  if (loading) {
    return (
      <div className="alf-mobile-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-guinda/25 border-t-guinda" />
      </div>
    );
  }

  return (
    <main className="alf-mobile-screen alf-safe-nav-space">
      <div className="mx-auto w-full max-w-lg space-y-5">
        <AppHeader title="Módulos" subtitle="Ruta de alfabetización guiada" />

        <section className="alf-hero-card">
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-guinda/10 text-guinda">
              <Sparkles className="h-8 w-8" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="alf-small-label">Ruta de aprendizaje</p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">
                {completedCount} de {totalModules} módulos
              </h2>
              <div className="mt-3 flex items-center gap-3">
                <Progress value={routePercentage} className="h-3 flex-1 rounded-full bg-guinda/10" />
                <span className="text-sm font-black text-guinda">{routePercentage}%</span>
              </div>
            </div>
          </div>
        </section>

        <section className="alf-timeline space-y-4">
          {modules.map((mod, index) => {
            const unlocked = isUnlocked(mod);
            const prog = progressMap[mod.dbId];
            const pct = prog?.percentage || 0;
            const completed = prog?.completed;
            const stars = prog?.stars || 0;

            return (
              <motion.button
                key={mod.dbId}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
                disabled={!unlocked}
                onClick={() => {
                  speak(`Módulo ${mod.id}: ${mod.name}`);
                  navigate(`/activity/${mod.id}`);
                }}
                className={`relative z-10 flex w-full items-center gap-4 rounded-[1.75rem] border p-4 text-left shadow-soft transition-all ${
                  unlocked
                    ? "bg-white/95 border-border/80 hover:-translate-y-1 hover:shadow-lift active:scale-[0.98]"
                    : "bg-white/60 border-border/60 opacity-70"
                }`}
              >
                <div
                  className={`alf-timeline-dot ${
                    completed
                      ? "border-verde text-verde"
                      : unlocked
                      ? "border-guinda text-guinda"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 className="h-7 w-7" />
                  ) : unlocked ? (
                    mod.icon
                  ) : (
                    <Lock className="h-6 w-6" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="truncate text-base font-black">
                      Módulo {mod.id}: {mod.name}
                    </p>
                    {stars > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-black text-amber-700">
                        <Star className="h-3 w-3 fill-current" />
                        {stars}
                      </span>
                    )}
                  </div>

                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-muted-foreground">
                    {mod.description}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <Progress value={pct} className="h-2.5 flex-1 rounded-full bg-guinda/10" />
                    <span className="text-xs font-black text-muted-foreground">{pct}%</span>
                  </div>
                </div>

                {unlocked && <ArrowRight className="h-5 w-5 shrink-0 text-guinda" />}
              </motion.button>
            );
          })}
        </section>
      </div>
    </main>
  );
}
