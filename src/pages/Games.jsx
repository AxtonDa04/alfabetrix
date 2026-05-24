import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { speak } from "../lib/tts";
import MemoryGame from "../components/MemoryGame";
import LexBubble from "../components/LexBubble";
import AppHeader from "@/components/AppHeader";

const GAMES = [
  { id: "memory", name: "Memoria", emoji: "🃏", desc: "Encuentre pares de imagen y palabra", available: true },
  { id: "sopa", name: "Sopa de Letras", emoji: "🔍", desc: "Busque palabras escondidas", available: false },
  { id: "ordena", name: "Ordena la Frase", emoji: "📝", desc: "Arrastre las palabras en orden", available: false },
  { id: "tiro", name: "Tiro al Blanco", emoji: "🎯", desc: "Dispare a la sílaba que escucha", available: false },
  { id: "ruleta", name: "Ruleta de Lectura", emoji: "🎡", desc: "Lea un párrafo y responda", available: false },
];

export default function Games() {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame === "memory") {
    return (
      <main className="app-page safe-bottom">
        <div className="app-container">
          <div className="app-header">
            <Button variant="ghost" size="icon" className="app-back" onClick={() => setActiveGame(null)}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="app-title">Memoria</h1>
              <p className="app-subtitle">Encuentre pares de palabra e imagen</p>
            </div>
          </div>
          <LexBubble message="Encuentre los pares tocando las cartas. Cada par tiene una palabra y su imagen." />
          <MemoryGame onFinish={(moves) => speak(`¡Terminó en ${moves} movimientos! Muy bien.`)} />
        </div>
      </main>
    );
  }

  return (
    <main className="app-page safe-bottom">
      <div className="app-container">
        <AppHeader title="Juegos" subtitle="Actividades ligeras de práctica" />

        <section className="space-y-3">
          {GAMES.map((game, index) => (
            <button
              key={game.id}
              disabled={!game.available}
              onClick={() => {
                speak(game.name);
                setActiveGame(game.id);
              }}
              className={`app-card-soft flex w-full items-center gap-4 p-5 text-left transition-all ${
                game.available
                  ? "hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.99]"
                  : "opacity-55"
              }`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-guinda/10 text-3xl">
                {game.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-black">{game.name}</p>
                <p className="text-sm font-semibold text-muted-foreground">{game.desc}</p>
                {!game.available && (
                  <p className="mt-1 text-xs font-black text-guinda">Próximamente</p>
                )}
              </div>
            </button>
          ))}
        </section>
      </div>
    </main>
  );
}
