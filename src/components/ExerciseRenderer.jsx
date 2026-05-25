import { useState, useEffect } from "react";
import { Volume2, Eye, RotateCcw, HelpCircle, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speak } from "../lib/tts";
import LexBubble from "./LexBubble";
import { getRandomLexMessage } from "../lib/modules";
import { motion } from "framer-motion";

export default function ExerciseRenderer({ exercise, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setSelected(null);
    setShowHint(false);
    setFeedback(null);
    if (exercise?.audio_text) {
      const t = setTimeout(() => speak(exercise.audio_text), 500);
      return () => clearTimeout(t);
    }
  }, [exercise]);

  const handleSelect = (option) => {
    if (selected) return;
    setSelected(option);
    const isCorrect = option === exercise.correct;
    setFeedback(isCorrect ? "correct" : "incorrect");

    const msg = getRandomLexMessage(isCorrect ? "correct" : "incorrect");
    speak(msg);

    setTimeout(() => onAnswer(isCorrect, option), 1450);
  };

  if (!exercise) return null;

  return (
    <div className="space-y-5">
      <section className="alf-hero-card text-center">
        <div className="relative z-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-guinda/10 text-guinda">
            <HelpCircle className="h-7 w-7" />
          </div>

          {exercise.instruction && (
            <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-guinda/70">
              {exercise.instruction}
            </p>
          )}

          <p className="text-balance text-3xl font-black leading-tight tracking-[-0.04em] text-foreground">
            {exercise.question}
          </p>

          {exercise.image_url && (
            <img
              src={exercise.image_url}
              alt=""
              className="mx-auto mt-4 max-h-44 rounded-2xl object-contain"
            />
          )}

          <div className="mt-5 grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              className="h-12 rounded-[1.1rem] bg-white/80 text-xs font-black"
              onClick={() => speak(exercise.audio_text || exercise.question)}
            >
              <Volume2 className="mr-1 h-4 w-4 text-guinda" /> Oír
            </Button>

            <Button
              variant="outline"
              className="h-12 rounded-[1.1rem] bg-white/80 text-xs font-black"
              onClick={() => setShowHint(true)}
            >
              <Eye className="mr-1 h-4 w-4 text-verde" /> Pista
            </Button>

            <Button
              variant="outline"
              className="h-12 rounded-[1.1rem] bg-white/80 text-xs font-black"
              onClick={() => {
                setSelected(null);
                setFeedback(null);
                setShowHint(false);
              }}
            >
              <RotateCcw className="mr-1 h-4 w-4 text-blue-700" /> Repetir
            </Button>
          </div>
        </div>
      </section>

      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 rounded-[1.5rem] border border-verde/20 bg-verde/10 p-4"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-verde">
            <Lightbulb className="h-5 w-5" />
          </div>
          <p className="flex-1 text-base font-extrabold leading-relaxed text-verde">
            {exercise.hint || exercise.example_text || "Escuche con calma. Después toque la respuesta."}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {exercise.options.map((option, index) => {
          const isCurrent = selected === option;
          const isCorrectOption = option === exercise.correct;

          let btnClass =
            "relative min-h-24 overflow-hidden rounded-[1.55rem] border-2 px-4 py-5 text-2xl font-black shadow-sm transition-all ";

          if (isCurrent) {
            btnClass += isCorrectOption
              ? "bg-verde/10 border-verde text-verde"
              : "bg-destructive/10 border-destructive text-destructive";
          } else if (selected && isCorrectOption) {
            btnClass += "bg-verde/10 border-verde text-verde";
          } else {
            btnClass += "bg-white/95 border-border hover:border-guinda/40 hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.99]";
          }

          return (
            <motion.button
              key={`${option}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={btnClass}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
            >
              <span>{option}</span>

              {selected && isCorrectOption && (
                <CheckCircle2 className="absolute right-3 top-3 h-6 w-6 text-verde" />
              )}

              {isCurrent && !isCorrectOption && (
                <XCircle className="absolute right-3 top-3 h-6 w-6 text-destructive" />
              )}
            </motion.button>
          );
        })}
      </div>

      {feedback && (
        <LexBubble
          message={getRandomLexMessage(feedback)}
          autoSpeak={false}
        />
      )}
    </div>
  );
}
