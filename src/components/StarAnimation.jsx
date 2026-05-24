import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function StarAnimation({ count = 0, total = 3 }) {
  return (
    <div className="flex gap-4 justify-center py-4">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={i < count ? { scale: 1, rotate: 0 } : { scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.3, duration: 0.5, type: "spring" }}
        >
          <Star
            className={`h-14 w-14 ${i < count ? "text-yellow-500 fill-yellow-400" : "text-muted-foreground/30"}`}
          />
        </motion.div>
      ))}
    </div>
  );
}