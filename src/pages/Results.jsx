import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { speak } from "../lib/tts";
import { getRandomLexMessage } from "../lib/modules";
import LexBubble from "../components/LexBubble";
import { ArrowRight, RotateCcw, Home, BookOpen, CheckCircle2, Trophy, Star, BarChart3 } from "lucide-react";

function Stars({ count }) {
  return (
    <div className="flex justify-center gap-3">
      {[1, 2, 3].map((star) => (
        <motion.div
          key={star}
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: star * 0.12, type: "spring", stiffness: 260, damping: 14 }}
          className={`flex h-16 w-16 items-center justify-center rounded-[1.35rem] ${
            star <= count ? "bg-amber-50 text-yellow-500 shadow-soft" : "bg-muted text-muted-foreground/40"
          }`}
        >
          <Star className={`h-9 w-9 ${star <= count ? "fill-current" : ""}`} />
        </motion.div>
      ))}
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const moduleId = parseInt(params.get("moduleId") || "1", 10);
  const correct = parseInt(params.get("correct") || "0", 10);
  const total = parseInt(params.get("total") || "5", 10);
  const stars = parseInt(params.get("stars") || "0", 10);
  const percentage = parseInt(params.get("percentage") || "0", 10);

  const passedModule = percentage >= 70;
  const excellent = percentage >= 90;
  const hasNextModule = moduleId < 6;
  const nextModuleId = moduleId + 1;

  useEffect(() => {
    if (passedModule) {
      confetti({
        particleCount: excellent ? 80 : 52,
        spread: 72,
        origin: { y: 0.6 },
        scalar: excellent ? 0.85 : 0.72,
        colors: ["#7A0F3D", "#1F6A43", "#DCC9A9", "#F5D742"],
      });
    }

    const msg =
      excellent
        ? `Excelente trabajo. ${correct} de ${total} respuestas correctas. ${getRandomLexMessage("encouragement")}`
        : passedModule
        ? `Muy bien. ${correct} de ${total} respuestas correctas. ${getRandomLexMessage("encouragement")}`
        : `${correct} de ${total} respuestas correctas. ${getRandomLexMessage("incorrect")}`;

    speak(msg);
  }, [correct, excellent, passedModule, percentage, total]);

  const lexMessage =
    excellent
      ? "Completó este paso con mucha seguridad. Usted va muy bien."
      : passedModule
      ? "Buen trabajo. El siguiente paso ya está listo."
      : "Casi. Cada intento cuenta. Repitamos con calma.";

  const handlePrimaryAction = () => {
    if (passedModule && hasNextModule) {
      navigate(`/activity/${nextModuleId}`);
      return;
    }

    if (passedModule && !hasNextModule) {
      navigate("/progress");
      return;
    }

    navigate(`/activity/${moduleId}`);
  };

  const primaryLabel =
    passedModule && hasNextModule
      ? "Siguiente módulo"
      : passedModule && !hasNextModule
      ? "Ver mi progreso"
      : "Practicar otra vez";

  const PrimaryIcon = passedModule && hasNextModule ? BookOpen : ArrowRight;

  return (
    <main className="alf-mobile-screen flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center space-y-5">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="alf-hero-card text-center"
        >
          <div className="relative z-10">
            <div
              className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.8rem] ${
                passedModule ? "bg-verde/10 text-verde" : "bg-orange-50 text-orange-700"
              }`}
            >
              {passedModule ? <Trophy className="h-11 w-11" /> : <BarChart3 className="h-11 w-11" />}
            </div>

            <p className="app-chip mx-auto mb-3 w-fit">Resultado de práctica</p>

            <h1 className="text-4xl font-black tracking-[-0.06em] text-foreground">
              {excellent ? "¡Excelente!" : passedModule ? "¡Muy bien!" : "Sigamos practicando"}
            </h1>

            <p className="mt-2 text-base font-bold text-muted-foreground">
              {correct} de {total} respuestas correctas
            </p>

            <div className="mx-auto mt-6 flex h-36 w-36 items-center justify-center rounded-full bg-white shadow-[0_20px_55px_rgba(62,62,62,0.12)] ring-8 ring-guinda/10">
              <div className="alf-progress-ring scale-[1.35]" style={{ "--value": `${percentage}%` }}>
                <span>{percentage}%</span>
              </div>
            </div>

            <div className="mt-8">
              <Stars count={stars} />
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3">
              <div className="rounded-[1.3rem] bg-white/70 p-3">
                <p className="text-xl font-black">{percentage}%</p>
                <p className="text-xs font-bold text-muted-foreground">Puntaje</p>
              </div>
              <div className="rounded-[1.3rem] bg-white/70 p-3">
                <p className="text-xl font-black">+{stars}</p>
                <p className="text-xs font-bold text-muted-foreground">Estrellas</p>
              </div>
              <div className="rounded-[1.3rem] bg-white/70 p-3">
                <CheckCircle2 className="mx-auto h-6 w-6 text-verde" />
                <p className="text-xs font-bold text-muted-foreground">Avance</p>
              </div>
            </div>

            <Progress value={percentage} className="mt-5 h-3 rounded-full bg-guinda/10" />
          </div>
        </motion.section>

        <LexBubble message={lexMessage} />

        <div className="space-y-3">
          <Button
            onClick={handlePrimaryAction}
            className="alf-big-action h-16 justify-center gap-3 text-center"
          >
            <PrimaryIcon className="h-6 w-6" /> {primaryLabel}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/activity/${moduleId}`)}
              className="app-secondary gap-2"
            >
              <RotateCcw className="h-5 w-5" /> Repetir
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/menu")}
              className="app-secondary gap-2"
            >
              <Home className="h-5 w-5" /> Menú
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
