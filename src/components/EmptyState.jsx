import { Button } from "@/components/ui/button";

export default function EmptyState({
  icon = "🧠",
  title = "Sin información",
  description = "Todavía no hay datos para mostrar.",
  actionLabel,
  onAction,
}) {
  return (
    <section className="app-card p-6 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-guinda/10 text-4xl">
        {icon}
      </div>
      <h2 className="text-2xl font-black">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-relaxed text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button className="app-primary mt-5 w-full" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </section>
  );
}
