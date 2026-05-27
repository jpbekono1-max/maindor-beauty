import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { CheckoutSteps } from "@/components/site/CheckoutSteps";
import { useCheckout, formatWhatsapp, isValidWhatsapp } from "@/context/CheckoutContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const cities = ["Yaoundé", "Douala", "Bafoussam", "Garoua", "Bamenda", "Autre"];

export const Route = createFileRoute("/commande/coordonnees")({
  component: CoordonneesPage,
  head: () => ({ meta: [{ title: "Coordonnées — Commande Main d'or Beauty" }] }),
});

function CoordonneesPage() {
  const navigate = useNavigate();
  const { state, setCustomer } = useCheckout();
  const { items } = useCart();
  const c = state.customer;

  useEffect(() => {
    if (items.length === 0) navigate({ to: "/panier", replace: true });
  }, [items.length, navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!c.fullName.trim()) return toast.error("Veuillez renseigner votre nom complet");
    if (!isValidWhatsapp(c.whatsapp)) return toast.error("Numéro WhatsApp invalide (format +237 XXX XXX XXX)");
    if (!c.city) return toast.error("Veuillez choisir une ville");
    if (!c.address.trim()) return toast.error("Veuillez indiquer votre adresse de livraison");
    navigate({ to: "/commande/paiement" });
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <CheckoutSteps current={1}/>
        <h1 className="font-display text-3xl md:text-4xl text-center mb-2">Vos coordonnées</h1>
        <p className="text-center text-sm text-muted-foreground mb-10">Nous utilisons ces informations uniquement pour préparer et livrer votre commande.</p>

        <form onSubmit={onSubmit} className="bg-card border border-border rounded-md p-6 md:p-8 space-y-5">
          <Field label="Nom complet *">
            <input required value={c.fullName} onChange={e => setCustomer({ fullName: e.target.value })} className={inputCls} placeholder="Marie Ngono"/>
          </Field>
          <Field label="Numéro WhatsApp *">
            <input
              required
              value={c.whatsapp}
              onChange={e => setCustomer({ whatsapp: formatWhatsapp(e.target.value) })}
              placeholder="+237 6XX XXX XXX"
              className={inputCls}
            />
          </Field>
          <Field label="Email (optionnel)">
            <input type="email" value={c.email} onChange={e => setCustomer({ email: e.target.value })} placeholder="vous@exemple.com" className={inputCls}/>
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Ville *">
              <select required value={c.city} onChange={e => setCustomer({ city: e.target.value })} className={inputCls}>
                {cities.map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Quartier / Adresse de livraison *">
              <input required value={c.address} onChange={e => setCustomer({ address: e.target.value })} placeholder="Bastos, rue 1.234" className={inputCls}/>
            </Field>
          </div>
          <Field label="Note pour la commande">
            <textarea
              rows={3}
              value={c.note}
              onChange={e => setCustomer({ note: e.target.value })}
              placeholder="Précisez ici toute demande spéciale (couleur exacte, longueur, personnalisation...)"
              className={inputCls}
            />
          </Field>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-border">
            <Link to="/panier" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4"/> Retour au panier
            </Link>
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-gold text-secondary font-semibold rounded-sm hover:shadow-luxe transition">
              Continuer <ArrowRight className="h-4 w-4"/>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

const inputCls = "w-full px-4 py-3 bg-background border border-border rounded-sm text-sm focus:outline-none focus:border-primary";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest mb-2" style={{color:"var(--gold-dark)"}}>{label}</span>
      {children}
    </label>
  );
}