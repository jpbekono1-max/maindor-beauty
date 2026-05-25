export function SectionTitle({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && <p className="text-xs uppercase tracking-[0.4em] text-primary mb-3" style={{color:"var(--gold-dark)"}}>{eyebrow}</p>}
      <h2 className="font-display text-3xl md:text-5xl">{title}</h2>
      <div className={`mt-4 flex ${center ? "justify-center" : ""}`}>
        <span className="h-px w-16 bg-gradient-gold" />
      </div>
      {subtitle && <p className="mt-5 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}