import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "@/api/base44Client";

import { MODULES } from "../lib/modules";
import { speak } from "../lib/tts";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Star, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function MyProgress() {
  const [progressMap, setProgressMap] = useState({});
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [allProgress, allRewards] = await Promise.all([
        db.entities.Progress.list(),
        db.entities.Reward.list(),
      ]);
      const map = {};
      allProgress.forEach(p => { map[p.module_id] = p; });
      setProgressMap(map);
      setRewards(allRewards);
      setLoading(false);

      const completed = allProgress.filter(p => p.completed).length;
      speak(`Ha completado ${completed} de 6 módulos. ¡Siga adelante!`);
    }
    load();
  }, []);

  const totalStars = Object.values(progressMap).reduce((sum, p) => sum + (p.stars || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige">
        <div className="w-10 h-10 border-4 border-guinda/30 border-t-guinda rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige p-6">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" asChild>
            <Link to="/menu"><ChevronLeft className="h-6 w-6" /></Link>
          </Button>
          <h1 className="text-2xl font-bold">Mi Progreso</h1>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 bg-card rounded-2xl p-5 border-2 border-border text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{totalStars}</p>
            <p className="text-sm text-muted-foreground">Estrellas</p>
          </div>
          <div className="flex-1 bg-card rounded-2xl p-5 border-2 border-border text-center">
            <Award className="h-8 w-8 text-guinda mx-auto mb-2" />
            <p className="text-2xl font-bold">{rewards.length}</p>
            <p className="text-sm text-muted-foreground">Insignias</p>
          </div>
        </div>

        <div className="space-y-4">
          {MODULES.map((mod, i) => {
            const prog = progressMap[mod.id];
            const pct = prog?.percentage || 0;
            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-4 border-2 border-border"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{mod.icon}</span>
                  <span className="font-bold flex-1">{mod.name}</span>
                  <span className="text-sm font-medium text-muted-foreground">{pct}%</span>
                </div>
                <Progress value={pct} className="h-3 rounded-full" />
                {prog && (
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Aciertos: {prog.correct_answers || 0}</span>
                    <span>Rondas: {prog.current_round || 0}</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" /> {prog.stars || 0}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}