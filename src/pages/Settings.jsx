import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Type, Sun, Volume2, LogOut } from "lucide-react";
import { useSettings } from "../lib/useSettings";
import { useAuth } from "@/lib/AuthContext";
import { speak } from "../lib/tts";
import AppHeader from "@/components/AppHeader";

const FORCE_PROFILE_SELECT_KEY = "alfabetrix_force_profile_select";

const PROFILE_KEYS_TO_REMOVE = [
  "alfabetrix_profile",
  "alfabetrixProfile",
  "currentProfile",
  "selectedProfile",
  "userProfile",
  "profile",
  "alfabetrix_profile_id",
  "profile_id",
  "profileId",
  "user_profile_id",
  "userProfileId",
  "selectedProfileId",
];

function clearLocalProfile() {
  PROFILE_KEYS_TO_REMOVE.forEach((key) => localStorage.removeItem(key));
  sessionStorage.clear();
}

export default function Settings() {
  const { settings, updateSetting } = useSettings();
  const { logout } = useAuth();

  const handleLogout = () => {
    const confirmed = window.confirm(
      "¿Desea cerrar esta sesión y volver a elegir usuario? Su progreso guardado en Supabase no se eliminará."
    );

    if (!confirmed) return;

    try {
      clearLocalProfile();
      localStorage.setItem(FORCE_PROFILE_SELECT_KEY, "1");
      logout(false);
      speak("Sesión cerrada. Ahora puede elegir otro usuario.");
    } catch (error) {
      console.error("Error cerrando sesión local:", error);
    } finally {
      window.location.replace("/");
    }
  };

  return (
    <main className="app-page safe-bottom">
      <div className="app-container">
        <AppHeader
          title="Configuración"
          subtitle="Ajustes de accesibilidad y voz"
        />

        <section className="app-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="app-icon-tile bg-guinda/10 text-guinda">
              <Type className="h-6 w-6" />
            </div>
            <div>
              <Label className="text-lg font-black">Tamaño de letra</Label>
              <p className="text-sm font-semibold text-muted-foreground">
                Elija cómo desea ver los textos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "normal", label: "Normal", size: "text-base" },
              { value: "large", label: "Grande", size: "text-xl" },
              { value: "extra-large", label: "Muy grande", size: "text-2xl" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  updateSetting("fontSize", opt.value);
                  speak(`Tamaño de letra ${opt.label}.`);
                }}
                className={`rounded-[1.25rem] border p-4 text-center transition-all ${
                  settings.fontSize === opt.value
                    ? "border-guinda bg-guinda/10 shadow-soft"
                    : "border-border/80 bg-white/70 hover:bg-white"
                }`}
              >
                <span className={`font-black ${opt.size}`}>Aa</span>
                <p className="mt-1 text-xs font-bold text-muted-foreground">
                  {opt.label}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="app-card p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="app-icon-tile bg-terracota/10 text-terracota">
                <Sun className="h-6 w-6" />
              </div>
              <div>
                <Label className="text-lg font-black">Alto contraste</Label>
                <p className="text-sm font-semibold text-muted-foreground">
                  Colores más fuertes y fáciles de ver.
                </p>
              </div>
            </div>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(v) => {
                updateSetting("highContrast", v);
                speak(v ? "Alto contraste activado." : "Alto contraste desactivado.");
              }}
            />
          </div>
        </section>

        <section className="app-card p-5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="app-icon-tile bg-verde/10 text-verde">
              <Volume2 className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <Label className="text-lg font-black">Volumen de voz</Label>
              <p className="text-sm font-semibold text-muted-foreground">
                Ajuste la lectura en voz alta.
              </p>
            </div>
            <span className="text-xl font-black text-guinda">
              {settings.volume}%
            </span>
          </div>

          <Slider
            value={[settings.volume]}
            onValueChange={([v]) => updateSetting("volume", v)}
            onValueCommit={() => speak("Así suena el volumen de la voz.")}
            max={100}
            step={10}
            className="py-2"
          />
        </section>

        <section className="app-card border-destructive/20 bg-white/70 p-5">
          <div className="flex items-start gap-3">
            <div className="app-icon-tile bg-destructive/10 text-destructive">
              <LogOut className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-black">Cerrar sesión</h2>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                Sale del usuario actual en este dispositivo. No elimina el avance
                guardado en Supabase.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="mt-5 h-14 w-full rounded-[1.35rem] border-destructive/40 bg-white/70 text-base font-black text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión / cambiar usuario
          </Button>
        </section>
      </div>
    </main>
  );
}
