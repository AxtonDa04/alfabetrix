import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveProfile, getProfiles } from "@/services/profileService";
import { getModules } from "@/services/modulesService";
import { getProgress } from "@/services/progressService";
import { useAuth } from "@/lib/AuthContext";

import { speak } from "../lib/tts";
import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Trophy,
  Gamepad2,
  HelpCircle,
  Settings,
  ArrowRight,
  Star,
  Sparkles,
  Bell,
  CheckCircle2,
} from "lucide-react";

const MENU_ITEMS = [
  {
    id: "learn",
    label: "Aprender",
    icon: BookOpen,
    path: "/modules",
    color: "bg-verde/10 text-verde border-verde/20",
    desc: "Continuar sus lecciones",
  },
  {
    id: "progress",
    label: "Mi progreso",
    icon: BarChart3,
    path: "/progress",
    color: "bg-guinda/10 text-guinda border-guinda/20",
    desc: "Ver avance guardado",
  },
  {
    id: "rewards",
    label: "Mis logros",
    icon: Trophy,
    path: "/progress",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    desc: "Insignias y certificados",
  },
  {
    id: "games",
    label: "Juegos",
    icon: Gamepad2,
    path: "/games",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    desc: "Aprender jugando",
  },
  {
    id: "help",
    label: "Ayuda",
    icon: HelpCircle,
    path: "/help",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    desc: "Tutoriales y preguntas",
  },
  {
    id: "settings",
    label: "Configuración",
    icon: Settings,
    path: "/settings",
    color: "bg-white text-muted-foreground border-border",
    desc: "Letra, volumen y contraste",
  },
];

function normalizeProfile(profile) {
  const id =
    profile?.id ??
    profile?.user_profile_id ??
    profile?.profile_id ??
    profile?.userProfileId;

  if (!id) return null;

  return {
    ...profile,
    id,
    user_profile_id: profile.user_profile_id ?? id,
    name: profile.name || profile.full_name || profile.username || "Usuario",
    role: profile.role || "student",
  };
}

function normalizeProgress(progress) {
  return {
    ...progress,
    percentage: Number(progress.percentage || 0),
    stars: Number(progress.stars || 0),
    completed:
      progress.completed === 1 ||
      progress.completed === true ||
      progress.completed === "1",
  };
}

export default function MainMenu() {
  const navigate = useNavigate();
  const { user, setLocalUser } = useAuth();

  const [userName, setUserName] = useState(user?.name || "");
  const [loading, setLoading] = useState(!user);
  const [stats, setStats] = useState({
    completed: 0,
    total: 6,
    percentage: 0,
    stars: 0,
    nextModule: "Vocales",
  });

  useEffect(() => {
    async function loadProfileAndStats() {
      try {
        let profile = user?.id ? normalizeProfile(user) : null;

        if (!profile) {
          const profiles = await getProfiles();

          if (profiles.length === 0) {
            navigate("/create-profile");
            return;
          }

          profile = normalizeProfile(getActiveProfile(profiles));

          if (!profile) {
            navigate("/create-profile");
            return;
          }

          setLocalUser(profile);
        }

        setUserName(profile.name || "Usuario");

        const [modules, progress] = await Promise.all([
          getModules().catch(() => []),
          getProgress({ userProfileId: profile.id }).catch(() => []),
        ]);

        const normalizedProgress = progress.map(normalizeProgress);
        const completed = normalizedProgress.filter((item) => item.completed).length;
        const stars = normalizedProgress.reduce((sum, item) => sum + (item.stars || 0), 0);
        const total = modules.length || 6;
        const percentage = total ? Math.round((completed / total) * 100) : 0;

        const progressMap = {};
        normalizedProgress.forEach((item) => {
          progressMap[item.module_id] = item;
        });

        const nextModule =
          modules.find((module) => !progressMap[module.id]?.completed)?.name ||
          "repasar lo aprendido";

        setStats({
          completed,
          total,
          percentage,
          stars,
          nextModule,
        });

        speak(`Hola ${profile.name || "Usuario"}. ¿Qué le gustaría hacer hoy?`);
      } catch (error) {
        console.error("Error al cargar menú:", error);
        navigate("/create-profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfileAndStats();
  }, [navigate, setLocalUser, user]);

  const ringStyle = useMemo(
    () => ({ "--value": `${stats.percentage}%` }),
    [stats.percentage]
  );

  if (loading) {
    return (
      <div className="alf-mobile-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-guinda/25 border-t-guinda" />
      </div>
    );
  }

  return (
    <main className="alf-mobile-screen alf-safe-nav-space">
      <div className="mx-auto w-full max-w-lg space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="alf-hero-card"
        >
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.8rem] bg-white shadow-soft ring-1 ring-border/70">
                  <img
                    src="/icon-192.png"
                    alt="ALFABETRIX"
                    className="h-16 w-16 rounded-[1.25rem] object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <p className="alf-small-label">Bienvenido</p>
                  <h1 className="alf-heading-xl mt-1">¡Hola, {userName}!</h1>
                  <p className="alf-muted mt-2">Tu ruta de aprendizaje está lista.</p>
                </div>
              </div>

              <button
                type="button"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-guinda shadow-sm ring-1 ring-border/70"
                onClick={() => speak(`Hola ${userName}. Tu avance actual es ${stats.percentage} por ciento.`)}
                aria-label="Escuchar resumen"
              >
                <Bell className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-[1fr_auto] items-center gap-5 rounded-[1.55rem] border border-border/70 bg-white/70 p-4">
              <div>
                <p className="text-sm font-black text-guinda">Avance general</p>
                <p className="mt-1 text-2xl font-black tracking-[-0.04em]">
                  {stats.completed} / {stats.total}
                </p>
                <p className="mt-1 text-sm font-bold text-muted-foreground">
                  módulos completados
                </p>
              </div>

              <div className="alf-progress-ring" style={ringStyle}>
                <span>{stats.percentage}%</span>
              </div>
            </div>

            <button
              onClick={() => {
                speak("Continuar aprendiendo");
                navigate("/modules");
              }}
              className="alf-big-action mt-5"
            >
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/75">
                  Siguiente paso
                </p>
                <p className="text-lg font-black">Practicar {stats.nextModule}</p>
              </div>
              <ArrowRight className="h-7 w-7" />
            </button>
          </div>
        </motion.section>

        <section className="grid grid-cols-3 gap-3">
          <div className="alf-glass-card p-4 text-center">
            <Star className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
            <p className="text-2xl font-black">{stats.stars}</p>
            <p className="text-xs font-black text-muted-foreground">Estrellas</p>
          </div>
          <div className="alf-glass-card p-4 text-center">
            <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-verde" />
            <p className="text-2xl font-black">{stats.completed}</p>
            <p className="text-xs font-black text-muted-foreground">Módulos</p>
          </div>
          <div className="alf-glass-card p-4 text-center">
            <Sparkles className="mx-auto mb-2 h-6 w-6 text-guinda" />
            <p className="text-2xl font-black">{stats.percentage}%</p>
            <p className="text-xs font-black text-muted-foreground">Ruta</p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          {MENU_ITEMS.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => {
                speak(item.label);
                navigate(item.path);
              }}
              className="alf-strong-card min-h-[9.6rem] p-4 text-left transition-all hover:-translate-y-1 hover:shadow-lift active:scale-[0.98]"
            >
              <div className={`alf-icon-bubble mb-4 border ${item.color}`}>
                <item.icon className="h-7 w-7" />
              </div>
              <p className="text-lg font-black leading-tight">{item.label}</p>
              <p className="mt-1 text-sm font-bold leading-snug text-muted-foreground">
                {item.desc}
              </p>
            </motion.button>
          ))}
        </section>
      </div>
    </main>
  );
}
