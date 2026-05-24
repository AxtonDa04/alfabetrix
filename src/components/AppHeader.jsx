import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppHeader({
  title,
  subtitle,
  backTo = "/menu",
  right = null,
  eyebrow = null,
}) {
  return (
    <header className="app-header">
      <Button variant="ghost" size="icon" className="app-back alf-focus-ring" asChild>
        <Link to={backTo} aria-label="Regresar">
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </Button>

      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="mb-0.5 text-xs font-black uppercase tracking-[0.16em] text-guinda/70">
            {eyebrow}
          </p>
        )}
        <h1 className="app-title">{title}</h1>
        {subtitle && <p className="app-subtitle">{subtitle}</p>}
      </div>

      {right}
    </header>
  );
}
