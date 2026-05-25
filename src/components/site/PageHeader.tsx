import { Link } from "@tanstack/react-router";

export function PageHeader({ title, subtitle, breadcrumb }: { title: string; subtitle?: string; breadcrumb: { label: string; to?: string }[] }) {
  return (
    <section className="relative bg-gradient-noir text-secondary-foreground overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-gradient-gold" />
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />
      <div className="container relative mx-auto px-4 py-20 md:py-28 text-center">
        <nav className="flex justify-center gap-2 text-xs opacity-80 mb-4">
          {breadcrumb.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              {b.to ? <Link to={b.to} className="hover:text-primary">{b.label}</Link> : <span className="text-primary">{b.label}</span>}
              {i < breadcrumb.length - 1 && <span>/</span>}
            </span>
          ))}
        </nav>
        <h1 className="font-display text-4xl md:text-6xl text-gradient-gold">{title}</h1>
        {subtitle && <p className="mt-4 max-w-xl mx-auto opacity-80">{subtitle}</p>}
      </div>
    </section>
  );
}