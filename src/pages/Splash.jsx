import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logoConalep from "@/assets/images/logo-conalep.png";

export default function Splash({ autoNavigate = true, onDone, minDuration = 3200 }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof onDone === "function") {
        onDone();
      }

      if (autoNavigate) {
        navigate("/create-profile", { replace: true });
      }
    }, minDuration);

    return () => clearTimeout(timer);
  }, [autoNavigate, minDuration, navigate, onDone]);

  const progressDuration = Math.max(1.8, minDuration / 1000 - 0.8);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#641034] px-7 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(255,255,255,0.18),transparent_28rem),radial-gradient(circle_at_78%_82%,rgba(141,170,145,0.24),transparent_26rem),linear-gradient(155deg,#7A0F3D_0%,#6A153D_46%,#2E5A43_100%)]" />
      <div className="absolute -left-20 top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-salvia/20 blur-3xl" />

      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm text-center"
      >
        <div className="mx-auto mb-8 w-fit rounded-[2rem] border border-white/20 bg-white/20 px-8 py-5 shadow-2xl backdrop-blur-md">
          <img src={logoConalep} alt="Logo CONALEP Ixtapaluca" className="mx-auto h-auto w-36" />
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-salvia" />
          <p className="mt-3 text-sm font-extrabold tracking-[0.24em] text-white/90">
            IXTAPALUCA
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.6, type: "spring" }}
          className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white/30 bg-white p-3 shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
        >
          <img
            src="/icon-192.png"
            alt="Icono ALFABETRIX"
            className="h-full w-full rounded-[1.45rem] object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="space-y-3"
        >
          <p className="text-xs font-black uppercase tracking-[0.28em] text-white/60">
            Proyecto Escolar Comunitario 2026
          </p>
          <h1 className="text-5xl font-black italic tracking-[-0.05em] drop-shadow-lg">
            Alfabetrix
          </h1>
          <p className="mx-auto max-w-xs text-base font-semibold leading-relaxed text-white/75">
            Aprende paso a paso, con calma y a tu ritmo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.4 }}
          className="mx-auto mt-9 flex w-full max-w-[14rem] items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-3 backdrop-blur"
        >
          <div className="h-3 w-3 animate-pulse rounded-full bg-salvia" />
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: progressDuration, ease: "easeInOut" }}
              className="h-full rounded-full bg-white"
            />
          </div>
        </motion.div>
      </motion.section>
    </main>
  );
}
