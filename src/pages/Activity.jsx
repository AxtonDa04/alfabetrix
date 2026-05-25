import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { getActiveProfile, getProfiles } from "@/services/profileService";
import { getActivities } from "@/services/activitiesService";
import { getActivityOptions } from "@/services/activityOptionsService";
import { saveProgress } from "@/services/progressService";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";
import ExerciseRenderer from "../components/ExerciseRenderer";

const MAX_EXERCISES_PER_ROUND = 5;

const MODULE_ID_MAP = {
  1: "mod-vocales-001",
  2: "mod-consonantes-002",
  3: "mod-silabas-003",
  4: "mod-palabras-004",
  5: "mod-frases-005",
  6: "mod-comprension-006",
};

const MODULE_NAMES = {
  1: "Vocales",
  2: "Consonantes básicas",
  3: "Sílabas",
  4: "Palabras simples",
  5: "Frases cortas",
  6: "Comprensión básica",
};

function normalizeContentJson(value) {
  if (!value) return null;

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function calculateStars(percentage) {
  if (percentage >= 90) return 3;
  if (percentage >= 70) return 2;
  if (percentage > 0) return 1;
  return 0;
}

export default function Activity() {
  const { moduleId } = useParams();
  const modId = parseInt(moduleId, 10);
  const dbModuleId = MODULE_ID_MAP[modId];

  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingResult, setSavingResult] = useState(false);
  const [userName, setUserName] = useState("");
  const [userProfileId, setUserProfileId] = useState(null);

  const moduleName = MODULE_NAMES[modId] || "Módulo";
  const totalExercises = Math.min(exercises.length, MAX_EXERCISES_PER_ROUND);
  const currentExercise = exercises[currentIndex] || null;
  const progressValue =
    totalExercises > 0
      ? Math.min(100, Math.round(((currentIndex + 1) / totalExercises) * 100))
      : 0;

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        setLoading(true);
        setSavingResult(false);
        setExercises([]);
        setCurrentIndex(0);
        setResults([]);

        const profiles = await getProfiles();

        if (!isMounted) return;

        const activeProfile = getActiveProfile(profiles);

        if (activeProfile) {
          setUserName(activeProfile.name || "");
          setUserProfileId(activeProfile.id);
        }

        if (!dbModuleId) {
          console.error("Módulo no encontrado:", modId);
          setExercises([]);
          setLoading(false);
          return;
        }

        const mysqlActivities = await getActivities(dbModuleId);

        const limitedActivities = mysqlActivities.slice(0, MAX_EXERCISES_PER_ROUND);

        const adapted = await Promise.all(
          limitedActivities.map(async (activity) => {
            const optionsRows = await getActivityOptions(activity.id);
            const content = normalizeContentJson(activity.content_json);

            const options = optionsRows.map((option) => option.option_text);
            const correctOption = optionsRows.find(
              (option) =>
                option.is_correct === 1 ||
                option.is_correct === true ||
                option.is_correct === "1"
            );

            return {
              id: activity.id,
              type: activity.activity_type,
              question: activity.question,
              instruction: activity.instruction,
              options,
              correct: correctOption?.option_text || activity.correct_answer,
              audio_text: activity.audio_text,
              hint: activity.hint,
              example_text: activity.example_text,
              image_url: activity.image_url,
              content,
            };
          })
        );

        if (!isMounted) return;

        setExercises(adapted);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar ejercicios desde Supabase:", error);

        if (!isMounted) return;

        setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [modId, dbModuleId]);

  const handleAnswer = async (isCorrect) => {
    if (savingResult || totalExercises <= 0) return;

    const newResults = [...results, isCorrect];
    setResults(newResults);

    const roundFinished = newResults.length >= totalExercises;

    if (roundFinished) {
      const correct = newResults.filter(Boolean).length;
      const incorrect = newResults.length - correct;
      const pct = Math.round((correct / totalExercises) * 100);
      const stars = calculateStars(pct);
      const completed = pct >= 70;

      setSavingResult(true);

      try {
        if (userProfileId && dbModuleId) {
          await saveProgress({
            user_profile_id: userProfileId,
            module_id: dbModuleId,
            completed_activities: totalExercises,
            correct_answers: correct,
            incorrect_answers: incorrect,
            total_responses: totalExercises,
            stars,
            percentage: pct,
            completed,
            error_summary: {
              module_number: modId,
              user_name: userName,
              total_exercises: totalExercises,
              round_results: newResults,
            },
          });
        } else {
          console.warn("No se guardó progreso porque falta perfil o módulo.", {
            userProfileId,
            dbModuleId,
          });
        }
      } catch (error) {
        console.error("Error al guardar progreso en Supabase:", error);
      }

      const params = new URLSearchParams({
        moduleId: String(modId),
        correct: String(correct),
        total: String(totalExercises),
        stars: String(stars),
        percentage: String(pct),
      });

      navigate(`/results?${params.toString()}`);
      return;
    }

    setCurrentIndex(newResults.length);
  };

  if (loading) {
    return (
      <div className="app-page flex flex-col items-center justify-center gap-4">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-guinda/25 border-t-guinda" />
        <p className="app-subtitle">Preparando ejercicios...</p>
      </div>
    );
  }

  if (!exercises.length) {
    return (
      <div className="app-page flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-xl font-black">No hay ejercicios disponibles para este módulo.</p>
        <Button asChild className="app-primary px-8">
          <Link to="/modules">Volver a módulos</Link>
        </Button>
      </div>
    );
  }

  if (!currentExercise || savingResult) {
    return (
      <div className="app-page flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-guinda/25 border-t-guinda" />
        <p className="app-subtitle">
          Guardando avance y preparando resultados...
        </p>
      </div>
    );
  }

  return (
    <main className="alf-mobile-screen">
      <div className="app-container">
        <header className="app-header">
          <Button variant="ghost" size="icon" className="app-back" asChild>
            <Link to="/modules" aria-label="Regresar a módulos">
              <ChevronLeft className="h-6 w-6" />
            </Link>
          </Button>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-guinda/75">
              {moduleName}
            </p>
            <h1 className="text-2xl font-black tracking-[-0.03em]">
              Ejercicio {currentIndex + 1} de {totalExercises}
            </h1>
          </div>
        </header>

        <section className="alf-glass-card p-4">
          <div className="mb-2 flex items-center justify-between text-sm font-black text-muted-foreground">
            <span>Avance de la práctica</span>
            <span>{progressValue}%</span>
          </div>
          <Progress value={progressValue} className="h-3 rounded-full bg-guinda/10" />
        </section>

        <ExerciseRenderer
          exercise={currentExercise}
          onAnswer={handleAnswer}
        />
      </div>
    </main>
  );
}
