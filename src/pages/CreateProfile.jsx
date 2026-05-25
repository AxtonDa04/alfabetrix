import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveProfile, getProfiles, createProfile, deleteProfile } from "@/services/profileService";
import { useAuth } from "@/lib/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { speak } from "../lib/tts";
import LexBubble from "../components/LexBubble";
import { ArrowRight, UserRound, Plus, CheckCircle2, ShieldCheck, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const FORCE_PROFILE_SELECT_KEY = "alfabetrix_force_profile_select";

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

export default function CreateProfile() {
  const navigate = useNavigate();
  const { setLocalUser, user, logout } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function checkProfile() {
      try {
        const existingProfiles = await getProfiles();
        const normalizedProfiles = existingProfiles
          .map(normalizeProfile)
          .filter(Boolean);

        const forceProfileSelect =
          localStorage.getItem(FORCE_PROFILE_SELECT_KEY) === "1";

        setProfiles(normalizedProfiles);

        const activeProfile = getActiveProfile(normalizedProfiles);

        if (activeProfile && !forceProfileSelect) {
          setLocalUser(activeProfile);
          navigate("/menu", { replace: true });
          return;
        }

        if (normalizedProfiles.length === 0) {
          setShowNewProfileForm(true);
        }

        setLoading(false);

        speak(
          forceProfileSelect
            ? "Seleccione un usuario para continuar. También puede crear uno nuevo."
            : "Bienvenido a Alfabetrix. Escriba su nombre para comenzar."
        );
      } catch (error) {
        console.error("Error al consultar perfiles:", error);
        setShowNewProfileForm(true);
        setLoading(false);
      }
    }

    checkProfile();
  }, [navigate, setLocalUser]);

  const handleSelectProfile = (profile) => {
    const normalizedProfile = normalizeProfile(profile);
    if (!normalizedProfile) return;

    localStorage.removeItem(FORCE_PROFILE_SELECT_KEY);
    setLocalUser(normalizedProfile);
    speak(`Bienvenido de nuevo, ${normalizedProfile.name}. Continuemos con calma.`);
    navigate("/menu", { replace: true });
  };

  const handleDeleteProfile = async (event, profile) => {
    event.stopPropagation();

    const normalizedProfile = normalizeProfile(profile);
    if (!normalizedProfile) return;

    const confirmed = window.confirm(
      `¿Eliminar el perfil de ${normalizedProfile.name}?\n\nTambién se eliminarán sus avances, estrellas, insignias, intentos y configuración guardados en la base de datos. Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(normalizedProfile.id);

      await deleteProfile(normalizedProfile.id);

      const nextProfiles = profiles.filter((item) => item.id !== normalizedProfile.id);
      setProfiles(nextProfiles);

      if (user?.id === normalizedProfile.id || user?.user_profile_id === normalizedProfile.id) {
        logout(false);
      }

      if (nextProfiles.length === 0) {
        setShowNewProfileForm(true);
      }

      speak(`El perfil de ${normalizedProfile.name} fue eliminado.`);
    } catch (error) {
      console.error("Error al eliminar perfil:", error);
      window.alert(
        error?.message || "No se pudo eliminar el perfil. Revise la consola o la conexión con Supabase."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setSaving(true);

    try {
      const result = await createProfile({
        name: name.trim(),
        age: age ? parseInt(age) : null,
        onboarding_complete: true,
        font_size: "large",
        high_contrast: false,
        volume: 80,
      });

      const createdProfile = normalizeProfile({
        id: result?.data?.id,
        user_profile_id: result?.data?.id,
        name: name.trim(),
        age: age ? parseInt(age) : null,
        onboarding_complete: true,
      });

      if (createdProfile) {
        localStorage.removeItem(FORCE_PROFILE_SELECT_KEY);
        setLocalUser(createdProfile);
      }

      speak(`Mucho gusto, ${name.trim()}. Vamos a aprender paso a paso.`);
      setTimeout(() => navigate("/menu", { replace: true }), 900);
    } catch (error) {
      console.error("Error al crear perfil:", error);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="alf-mobile-screen flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-guinda/25 border-t-guinda" />
        <p className="app-subtitle">Preparando su experiencia...</p>
      </div>
    );
  }

  return (
    <main className="alf-mobile-screen flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center space-y-6">
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-[2.2rem] bg-white shadow-[0_22px_50px_rgba(62,62,62,0.14)] ring-1 ring-border/70"
          >
            <img
              src="/icon-192.png"
              alt="ALFABETRIX"
              className="h-20 w-20 rounded-[1.6rem] object-cover"
            />
          </motion.div>

          <p className="app-chip mx-auto mb-3 w-fit">
            {profiles.length > 0 ? "Elegir usuario" : "Primer acceso"}
          </p>
          <h1 className="text-4xl font-black tracking-[-0.06em]">
            {profiles.length > 0 ? "¿Quién va a practicar?" : "Vamos a empezar"}
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-sm font-bold leading-relaxed text-muted-foreground">
            {profiles.length > 0
              ? "Seleccione un perfil guardado, elimínelo o cree uno nuevo."
              : "Su avance se guardará en Supabase."}
          </p>
        </section>

        {profiles.length > 0 && !showNewProfileForm && (
          <section className="space-y-3">
            {profiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="alf-strong-card flex w-full items-center gap-3 p-4 text-left transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <button
                  type="button"
                  onClick={() => handleSelectProfile(profile)}
                  className="flex min-w-0 flex-1 items-center gap-4 text-left"
                >
                  <div className="alf-icon-bubble border-guinda/20 bg-guinda/10 text-guinda">
                    <UserRound className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-black">{profile.name}</p>
                    <p className="text-sm font-bold text-muted-foreground">
                      Continuar con este perfil
                    </p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-verde" />
                </button>

                <button
                  type="button"
                  onClick={(event) => handleDeleteProfile(event, profile)}
                  disabled={deletingId === profile.id}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive transition-all hover:bg-destructive/20 active:scale-95 disabled:opacity-50"
                  aria-label={`Eliminar perfil de ${profile.name}`}
                  title="Eliminar perfil"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </motion.div>
            ))}

            <Button
              variant="outline"
              onClick={() => setShowNewProfileForm(true)}
              className="app-secondary w-full gap-2"
            >
              <Plus className="h-5 w-5" />
              Crear nuevo usuario
            </Button>
          </section>
        )}

        {showNewProfileForm && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="alf-hero-card space-y-5"
          >
            <div className="relative z-10">
              <LexBubble message="¡Hola! Soy Lex, su guía. ¿Cómo se llama usted?" />

              <div className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-black">Su nombre</Label>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Escriba su nombre aquí"
                    className="h-16 rounded-[1.35rem] border-2 bg-white/90 px-5 text-lg font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-black">Su edad opcional</Label>
                  <Input
                    value={age}
                    onChange={(event) => setAge(event.target.value)}
                    placeholder="Ejemplo: 65"
                    type="number"
                    className="h-16 rounded-[1.35rem] border-2 bg-white/90 px-5 text-lg font-bold"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-[1.3rem] border border-verde/20 bg-verde/10 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-verde" />
                <p className="text-sm font-bold leading-relaxed text-verde">
                  Su perfil permite guardar avance, estrellas y módulos desbloqueados.
                </p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!name.trim() || saving}
                className="alf-big-action mt-5 h-16 justify-center gap-3"
              >
                {saving ? "Guardando..." : "Comenzar"} <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
          </motion.section>
        )}

        {profiles.length > 0 && showNewProfileForm && (
          <button
            type="button"
            onClick={() => setShowNewProfileForm(false)}
            className="text-center text-sm font-black text-guinda"
          >
            Volver a perfiles guardados
          </button>
        )}
      </div>
    </main>
  );
}
