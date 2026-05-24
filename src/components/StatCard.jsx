export default function StatCard({
  icon: Icon,
  emoji,
  label,
  value,
  helper,
  tone = "primary",
}) {
  const tones = {
    primary: "bg-guinda/10 text-guinda border-guinda/20",
    success: "bg-verde/10 text-verde border-verde/20",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-azul/10 text-blue-700 border-blue-200",
    neutral: "bg-white/75 text-foreground border-border/70",
  };

  return (
    <article className="app-card p-5 text-center">
      <div
        className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border ${
          tones[tone] || tones.primary
        }`}
      >
        {Icon ? <Icon className="h-7 w-7" /> : <span className="text-3xl">{emoji}</span>}
      </div>

      <p className="text-3xl font-black tracking-[-0.04em]">{value}</p>
      <p className="mt-1 text-sm font-black text-muted-foreground">{label}</p>

      {helper && (
        <p className="mt-2 text-xs font-semibold leading-snug text-muted-foreground">
          {helper}
        </p>
      )}
    </article>
  );
}
