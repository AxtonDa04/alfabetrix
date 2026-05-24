import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { speak } from "../lib/tts";
import { RotateCcw } from "lucide-react";

const PAIRS = [
  { word: "MAMÁ", emoji: "👩" },
  { word: "PAPÁ", emoji: "👨" },
  { word: "MESA", emoji: "🪑" },
  { word: "SOL", emoji: "☀️" },
  { word: "LUNA", emoji: "🌙" },
  { word: "AGUA", emoji: "💧" },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryGame({ onFinish }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const selected = shuffle(PAIRS).slice(0, 4);
    const deck = shuffle([
      ...selected.map((p, i) => ({ id: `w${i}`, pairId: i, display: p.word, type: "word" })),
      ...selected.map((p, i) => ({ id: `e${i}`, pairId: i, display: p.emoji, type: "emoji" })),
    ]);
    setCards(deck);
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
  };

  useEffect(() => { initGame(); }, []);

  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.has(cards[index].pairId)) return;
    
    const card = cards[index];
    if (card.type === "word") speak(card.display);

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].pairId === cards[b].pairId) {
        speak("¡Muy bien! Encontró el par.");
        setMatched(prev => new Set([...prev, cards[a].pairId]));
        setFlipped([]);
        if (matched.size + 1 === 4) {
          setTimeout(() => {
            speak("¡Felicidades! Completó el juego de memoria.");
            if (onFinish) onFinish(moves + 1);
          }, 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="font-semibold">Movimientos: {moves}</p>
        <Button variant="outline" size="sm" className="gap-2 h-12 rounded-xl" onClick={initGame}>
          <RotateCcw className="h-4 w-4" /> Nuevo juego
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || matched.has(card.pairId);
          return (
            <motion.button
              key={card.id}
              className={`h-24 rounded-2xl border-2 font-bold text-xl flex items-center justify-center transition-colors ${
                isFlipped
                  ? matched.has(card.pairId)
                    ? "bg-verde/20 border-verde"
                    : "bg-card border-guinda"
                  : "bg-guinda/10 border-guinda/30 hover:bg-guinda/20"
              }`}
              onClick={() => handleFlip(i)}
              whileTap={{ scale: 0.95 }}
            >
              {isFlipped ? card.display : "?"}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}