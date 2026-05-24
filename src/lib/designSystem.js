import {
  Home,
  BookOpen,
  BarChart3,
  Trophy,
  Gamepad2,
  HelpCircle,
  Settings,
  Star,
  Lock,
  CheckCircle2,
  Volume2,
  Bell,
  UserRound,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const brandColors = {
  guinda: "#7A0F3D",
  verde: "#1F6A43",
  beige: "#F7F4EE",
  arena: "#DCC9A9",
  salvia: "#8DAA91",
  azul: "#5C7FA3",
  tinta: "#3E3E3E",
  terracota: "#C97B63",
};

export const appIcons = {
  home: Home,
  learn: BookOpen,
  progress: BarChart3,
  rewards: Trophy,
  games: Gamepad2,
  help: HelpCircle,
  settings: Settings,
  star: Star,
  lock: Lock,
  completed: CheckCircle2,
  audio: Volume2,
  notifications: Bell,
  profile: UserRound,
  security: ShieldCheck,
  sparkles: Sparkles,
};

export const moduleTheme = {
  vocales: {
    icon: "A",
    tile: "bg-guinda/10 text-guinda",
    border: "border-guinda/25",
  },
  consonantes: {
    icon: "M",
    tile: "bg-verde/10 text-verde",
    border: "border-verde/25",
  },
  silabas: {
    icon: "MA",
    tile: "bg-guinda/10 text-guinda",
    border: "border-guinda/25",
  },
  palabras: {
    icon: "PAN",
    tile: "bg-verde/10 text-verde",
    border: "border-verde/25",
  },
  frases: {
    icon: "📖",
    tile: "bg-azul/10 text-blue-700",
    border: "border-blue-200",
  },
  comprension: {
    icon: "🧠",
    tile: "bg-terracota/10 text-terracota",
    border: "border-terracota/25",
  },
};
