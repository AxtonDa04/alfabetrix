export default function PageSection({ title, subtitle, right, children }) {
  return (
    <section className="space-y-3">
      {(title || subtitle || right) && (
        <div className="flex items-end justify-between gap-3">
          <div>
            {title && <h2 className="alf-section-title">{title}</h2>}
            {subtitle && <p className="alf-section-subtitle">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}
