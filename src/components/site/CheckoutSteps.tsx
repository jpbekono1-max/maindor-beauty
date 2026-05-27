import { Check } from "lucide-react";

const steps = [
  { n: 1, label: "Coordonnées" },
  { n: 2, label: "Livraison & Paiement" },
  { n: 3, label: "Confirmation" },
];

export function CheckoutSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4 mb-12 flex-wrap">
      {steps.map((s, i) => {
        const done = s.n < current;
        const active = s.n === current;
        return (
          <li key={s.n} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`h-9 w-9 rounded-full inline-flex items-center justify-center text-sm font-semibold transition ${
                  done ? "bg-gradient-gold text-secondary" :
                  active ? "bg-secondary text-ivory" : "bg-muted text-muted-foreground"
                }`}
                style={active ? { backgroundColor: "var(--noir)", color: "var(--ivory)" } : undefined}
              >
                {done ? <Check className="h-4 w-4"/> : s.n}
              </span>
              <span className={`hidden sm:inline text-xs uppercase tracking-widest ${active || done ? "" : "text-muted-foreground"}`} style={active ? {color:"var(--gold-dark)"} : undefined}>{s.label}</span>
            </div>
            {i < steps.length - 1 && <span className="hidden sm:block w-8 sm:w-12 h-px bg-border"/>}
          </li>
        );
      })}
    </ol>
  );
}