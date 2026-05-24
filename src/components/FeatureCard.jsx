export default function FeatureCard({
  icon: Icon,
  emoji,
  title,
  description,
  color = "bg-guinda/10 text-guinda",
  onClick,
  disabled = false,
  badge = null,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`app-card-soft alf-card-hover alf-focus-ring flex w-full items-center gap-4 p-5 text-left ${
        disabled ? "opacity-55" : ""
      }`}
    >
      <div className={`app-icon-tile ${color}`}>
        {Icon ? <Icon className="h-7 w-7" /> : <span className="text-3xl">{emoji}</span>}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-lg font-black leading-tight">{title}</p>
          {badge && (
            <span className="rounded-full bg-guinda/10 px-2.5 py-1 text-[11px] font-black text-guinda">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-sm font-semibold leading-snug text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </button>
  );
}
