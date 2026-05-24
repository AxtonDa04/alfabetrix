import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  BarChart3,
  Gamepad2,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Inicio",
    path: "/menu",
    icon: Home,
    match: ["/menu"],
  },
  {
    label: "Aprender",
    path: "/modules",
    icon: BookOpen,
    match: ["/modules"],
  },
  {
    label: "Progreso",
    path: "/progress",
    icon: BarChart3,
    match: ["/progress"],
  },
  {
    label: "Juegos",
    path: "/games",
    icon: Gamepad2,
    match: ["/games"],
  },
  {
    label: "Ajustes",
    path: "/settings",
    icon: Settings,
    match: ["/settings", "/help"],
  },
];

export default function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="alf-bottom-nav" aria-label="Navegación principal">
      <div className="alf-bottom-nav-grid">
        {NAV_ITEMS.map((item) => {
          const active = item.match.some((path) => location.pathname === path);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`alf-bottom-nav-item alf-focus-ring ${
                active ? "alf-bottom-nav-item-active" : ""
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
