import { useEffect, useMemo, useState } from "react";
import { MODULES as LOCAL_MODULES } from "../lib/modules";
import { speak } from "../lib/tts";
import { getModules } from "@/services/modulesService";
import { getProgress } from "@/services/progressService";
import { getRewardCatalog, getRewards } from "@/services/rewardsService";
import { getStoredActiveProfileId } from "@/services/profileService";
import { Progress } from "@/components/ui/progress";
import { Star, Award, RefreshCw, CheckCircle2, Sparkles } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { motion } from "framer-motion";

function getModuleId(module) {
  const rawId = module?.id ?? module?.module_id ?? module?.moduleId;
  if (rawId === undefined || rawId === null || rawId === "") return null;
  return String(rawId);
}

function getProgressModuleId(progress) {
  const rawId = progress?.module_id ?? progress?.moduleId ?? progress?.id_module;
  if (rawId === undefined || rawId === null || rawId === "") return null;
  return String(rawId);
}

function normalizeModule(module, index = 0) {
  const id = getModuleId(module);

  return {
    ...module,
    id,
    module_key: module.module_key || module.moduleKey || module.key || id,
    name: module.name || module.title || `Módulo ${index + 1}`,
    icon: module.icon || "📘",
    sort_order: Number(module.sort_order ?? module.order_index ?? module.order ?? index + 1),
  };
}

function normalizeProgress(progress) {
  const moduleId = getProgressModuleId(progress);

  return {
    ...progress,
    module_id: moduleId,
    completed_activities: Number(progress.completed_activities ?? 0),
    correct_answers: Number(progress.correct_answers ?? 0),
    incorrect_answers: Number(progress.incorrect_answers ?? 0),
    total_responses: Number(progress.total_responses ?? 0),
    current_round: Number(progress.current_round ?? 0),
    stars: Number(progress.stars ?? 0),
    percentage: Number(progress.percentage ?? 0),
    completed:
      progress.completed === true ||
      progress.completed === 1 ||
      progress.completed === "1",
  };
}

function normalizeReward(reward) {
  return {
    ...reward,
    id: String(reward.id ?? reward.reward_id ?? reward.reward_key ?? crypto.randomUUID()),
    title: reward.title || reward.name || "Insignia",
    description: reward.description || "Recompensa desbloqueada.",
    icon: reward.icon || "🏅",
    module_name: reward.module_name || reward.moduleName || "",
    earned_at: reward.earned_at || reward.unlocked_at || reward.created_at || null,
    image_url: reward.image_url || reward.imageUrl || null,
  };
}

function formatDate(dateValue) {
  if (!dateValue) return "Fecha no disponible";

  const parsedDate = new Date(String(dateValue).replace(" ", "T"));

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return parsedDate.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MyProgress() {
  const [modules, setModules] = useState(() =>
    LOCAL_MODULES.map(normalizeModule).filter((module) => module.id)
  );
  const [progressMap, setProgressMap] = useState({});
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const profileId = useMemo(() => getStoredActiveProfileId(), []);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setLoadError(null);

        const [modulesRows, progressRows, rewardsRows, rewardCatalog] = await Promise.all([
          getModules(),
          profileId ? getProgress({ userProfileId: profileId }) : Promise.resolve([]),
          profileId ? getRewards(profileId).catch(() => []) : Promise.resolve([]),
          getRewardCatalog().catch(() => []),
        ]);

        const supabaseModules = modulesRows
          .map(normalizeModule)
          .filter((module) => module.id)
          .sort((a, b) => a.sort_order - b.sort_order);

        const allProgress = progressRows
          .map(normalizeProgress)
          .filter((progress) => progress.module_id);

        const catalogById = new Map(
          rewardCatalog.map((reward) => [String(reward.id), reward])
        );

        const allRewards = rewardsRows
          .map((reward) => ({
            ...(catalogById.get(String(reward.reward_id)) || {}),
            ...reward,
          }))
          .map(normalizeReward)
          .sort((a, b) => {
            const dateA = new Date(String(a.earned_at || "").replace(" ", "T"));
            const dateB = new Date(String(b.earned_at || "").replace(" ", "T"));
            return dateB.getTime() - dateA.getTime();
          });

        const map = {};
        allProgress.forEach((progress) => {
          map[progress.module_id] = progress;
        });

        if (!isMounted) return;

        if (supabaseModules.length > 0) {
          setModules(supabaseModules);
        }

        setProgressMap(map);
        setRewards(allRewards);
        setLoading(false);

        const completed = allProgress.filter((progress) => progress.completed)
          .length;
        const totalModules = supabaseModules.length || LOCAL_MODULES.length || 6;

        speak(
          `Ha completado ${completed} de ${totalModules} módulos. ¡Siga adelante!`
        );
      } catch (error) {
        console.error("Error cargando Mi Progreso:", error);

        if (!isMounted) return;

        setLoadError(error.message || "No se pudo cargar el progreso.");
        setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [profileId]);

  const totalStars = Object.values(progressMap).reduce(
    (sum, progress) => sum + (progress.stars || 0),
    0
  );

  const completedModules = Object.values(progressMap).filter(
    (progress) => progress.completed
  ).length;


  const overallPercentage = modules.length
    ? Math.round((completedModules / modules.length) * 100)
    : 0;

  const nextModule = modules.find((module) => !progressMap[module.id]?.completed);

  if (loading) {
    return (
      <div className="app-page flex items-center justify-center">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-guinda/25 border-t-guinda" />
      </div>
    );
  }

  return (
    <main className="alf-mobile-screen alf-safe-nav-space">
      <div className="app-container">
        <AppHeader
          title="Mi Progreso"
          subtitle="Avance guardado en Supabase"
        />

        {loadError && (
          <div className="rounded-[1.35rem] border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            <div className="flex items-start gap-2">
              <RefreshCw className="mt-0.5 h-4 w-4" />
              <div>
                <p className="font-black">No se pudo cargar desde Supabase.</p>
                <p>{loadError}</p>
              </div>
            </div>
          </div>
        )}

        <section className="alf-hero-card">
          <div className="relative p-6">
            <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-verde/12 blur-2xl" />
            <div className="relative">
              <p className="app-chip mb-3">Resumen general</p>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-black tracking-[-0.05em]">
                    {completedModules} / {modules.length}
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
                  <span>{overallPercentage}%</span>
                </div>
                <Progress value={overallPercentage} className="h-3 rounded-full bg-guinda/10" />
              </div>

              <div className="mt-5 rounded-[1.35rem] border border-border/70 bg-white/70 p-4">
                <p className="text-sm font-black text-guinda">
                  {nextModule ? "Siguiente paso" : "Ruta completada"}
                </p>
                <p className="mt-1 text-base font-extrabold">
                  {nextModule
                    ? `Practicar ${nextModule.name}`
                    : "Puede repetir cualquier módulo para reforzar el aprendizaje."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="alf-strong-card p-5 text-center">
            <Star className="mx-auto mb-2 h-9 w-9 text-yellow-500" />
            <p className="text-3xl font-black">{totalStars}</p>
            <p className="text-sm font-bold text-muted-foreground">Estrellas</p>
          </div>

          <div className="alf-strong-card p-5 text-center">
            <Award className="mx-auto mb-2 h-9 w-9 text-guinda" />
            <p className="text-3xl font-black">{rewards.length}</p>
            <p className="text-sm font-bold text-muted-foreground">Insignias</p>
          </div>
        </section>

        <section className="alf-strong-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="app-icon-tile bg-guinda/10 text-guinda">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black">Mis insignias</h2>
              <p className="text-sm font-semibold text-muted-foreground">
                Recompensas desbloqueadas por su avance.
              </p>
            </div>
          </div>

          {rewards.length > 0 ? (
            <div className="space-y-3">
              {rewards.map((reward, index) => (
                <motion.div
                  key={`${reward.id}-${reward.reward_key || index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="flex items-start gap-3 rounded-[1.45rem] border border-border/70 bg-white/70 p-4"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-guinda/10 text-3xl">
                    {reward.image_url ? (
                      <img
                        src={reward.image_url}
                        alt={reward.title}
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <span>{reward.icon}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start gap-2">
                      <h3 className="flex-1 text-lg font-black leading-tight">
                        {reward.title}
                      </h3>
                      {reward.module_name && (
                        <span className="rounded-full bg-guinda/10 px-2.5 py-1 text-[11px] font-black text-guinda">
                          {reward.module_name}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm font-semibold leading-relaxed text-muted-foreground">
                      {reward.description}
                    </p>

                    <p className="mt-2 text-xs font-bold text-muted-foreground">
                      Desbloqueada: {formatDate(reward.earned_at)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-border p-4 text-center">
              <p className="text-sm font-black">Todavía no hay insignias.</p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                Complete un módulo para desbloquear su primera recompensa.
              </p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          {modules.map((module, index) => {
            const progress = progressMap[module.id];
            const percentage = Math.max(
              0,
              Math.min(100, progress?.percentage || 0)
            );
            const completed = !!progress?.completed;

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="alf-glass-card p-4"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className={`app-icon-tile text-xl font-black ${completed ? "bg-verde/10 text-verde" : "bg-guinda/10 text-guinda"}`}>
                    {module.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-lg font-black">{module.name}</p>
                      {completed && <CheckCircle2 className="h-5 w-5 shrink-0 text-verde" />}
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">{percentage}% de avance</p>
                  </div>
                </div>

                <Progress value={percentage} className="h-3 rounded-full bg-guinda/10" />

                {progress ? (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-muted-foreground">
                    <span className="app-chip">Aciertos: {progress.correct_answers || 0}</span>
                    <span className="app-chip">Errores: {progress.incorrect_answers || 0}</span>
                    <span className="app-chip">Rondas: {progress.current_round || 0}</span>
                    <span className="app-chip">
                      <Star className="mr-1 h-3 w-3 text-yellow-500" />
                      {progress.stars || 0}
                    </span>
                  </div>
                ) : (
                  <p className="mt-3 text-sm font-semibold text-muted-foreground">
                    Sin avance registrado todavía.
                  </p>
                )}
              </motion.div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
