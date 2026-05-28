import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle, Loader2 } from "lucide-react";
import { CheckoutSteps } from "@/components/site/CheckoutSteps";
import { useCheckout, type PaymentMethod } from "@/context/CheckoutContext";
import { useCart, SHIPPING_LABELS, SHIPPING_RATES, type ShippingMethod } from "@/context/CartContext";
import { formatFCFA } from "@/data/products";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/lib/orders";

export const Route = createFileRoute("/commande/paiement")({
  component: PaiementPage,
  head: () => ({ meta: [{ title: "Livraison & Paiement — Commande Main d'or Beauty" }] }),
});

const deliveryOptions: { key: ShippingMethod; icon: string; title: string; delay: string; note?: string }[] = [
  { key: "yaounde", icon: "🛵", title: "Livraison à domicile — Yaoundé", delay: "24–48h" },
  { key: "autres", icon: "🚚", title: "Livraison hors Yaoundé", delay: "3–5 jours", note: "Nous vous contactons via WhatsApp pour organiser l'envoi" },
  { key: "retrait", icon: "🏪", title: "Retrait en salon", delay: "Dès confirmation", note: "Salon Main d'or Beauty — Yaoundé. Adresse communiquée à la confirmation." },
];

const paymentOptions: { key: PaymentMethod; icon: string; title: string; description: string; instructions?: string; inputLabel?: string; warning?: string }[] = [
  { key: "mtn", icon: "📱", title: "MTN Mobile Money", description: "Paiement instantané sécurisé", instructions: "Vous recevrez un message de confirmation sur votre numéro MTN. Numéro marchand : XXX XXX XXX — Nom : Main d'or Beauty.", inputLabel: "Numéro MTN Mobile Money *" },
  { key: "orange", icon: "🟠", title: "Orange Money", description: "Composez #150# ou utilisez l'application", instructions: "Composez #150# ou utilisez l'application Orange Money. Numéro marchand : XXX XXX XXX.", inputLabel: "Numéro Orange Money *" },
  { key: "cod", icon: "💵", title: "Paiement à la livraison", description: "En espèces à la réception (Yaoundé uniquement)", warning: "Non disponible pour les commandes sur mesure ou hors Yaoundé." },
  { key: "whatsapp", icon: "💬", title: "Paiement via WhatsApp", description: "Organisons votre paiement par message", instructions: "Cliquez sur \"Confirmer la commande\" puis suivez les instructions WhatsApp." },
];

function PaiementPage() {
  const navigate = useNavigate();
  const { state, setPayment, setPaymentNumber, setOrderNumber } = useCheckout();
  const { items, subtotal, total, shipping, setShipping, shippingCost, promo, clear } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0) navigate({ to: "/panier", replace: true });
    if (!state.customer.fullName) navigate({ to: "/commande/coordonnees", replace: true });
  }, [items.length, state.customer.fullName, navigate]);

  const onConfirm = async () => {
    if (!user) {
      toast.error("Connectez-vous pour confirmer votre commande");
      navigate({ to: "/connexion" });
      return;
    }
    if (state.payment === "cod" && shipping !== "yaounde") {
      return toast.error("Paiement à la livraison disponible uniquement à Yaoundé");
    }
    if ((state.payment === "mtn" || state.payment === "orange") && !state.paymentNumber.trim()) {
      return toast.error("Veuillez saisir votre numéro de paiement");
    }
    setSubmitting(true);
    try {
      const { orderNumber } = await createOrder({
        userId: user.id,
        items,
        customer: state.customer,
        payment: state.payment,
        shipping,
        shippingCost,
        subtotal,
        discount: promo?.amount ?? 0,
        total,
      });
      setOrderNumber(orderNumber);
      if (state.payment === "whatsapp") {
        const lines = [
          `Bonjour Main d'or Beauty 👋`,
          `Commande ${orderNumber}`,
          ``,
          ...items.map((i, idx) => `${idx + 1}. ${i.name} × ${i.qty} — ${formatFCFA(i.price * i.qty)}`),
          ``,
          `Sous-total : ${formatFCFA(subtotal)}`,
          promo ? `Promo ${promo.code} : − ${formatFCFA(promo.amount)}` : null,
          `Livraison (${SHIPPING_LABELS[shipping]}) : ${shippingCost === 0 ? "Gratuit" : formatFCFA(shippingCost)}`,
          `Total : ${formatFCFA(total)}`,
          ``,
          `Nom : ${state.customer.fullName}`,
          `WhatsApp : ${state.customer.whatsapp}`,
          `Ville : ${state.customer.city}`,
          `Adresse : ${state.customer.address}`,
          state.customer.note ? `Note : ${state.customer.note}` : null,
        ].filter(Boolean).join("\n");
        window.open(`https://wa.me/237693881451?text=${encodeURIComponent(lines)}`, "_blank");
      }
      clear();
      toast.success("Commande passée avec succès !");
      navigate({ to: "/commande/confirmation" });
    } catch (e: any) {
      toast.error(e?.message ?? "Erreur lors de l'enregistrement de la commande");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPayment = paymentOptions.find(p => p.key === state.payment)!;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <CheckoutSteps current={2}/>
        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-2xl mb-5">Mode de livraison</h2>
              <div className="space-y-3">
                {deliveryOptions.map(opt => (
                  <label key={opt.key} className={`block cursor-pointer rounded-md border p-5 transition ${shipping === opt.key ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card hover:border-primary/50"}`}>
                    <div className="flex items-start gap-4">
                      <input type="radio" name="ship" checked={shipping === opt.key} onChange={() => setShipping(opt.key)} className="mt-1 accent-[color:var(--gold-dark)]"/>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-display text-lg">{opt.icon} {opt.title}</span>
                          <span className="font-display text-base" style={{color:"var(--gold-dark)"}}>{SHIPPING_RATES[opt.key] === 0 ? "Gratuit" : formatFCFA(SHIPPING_RATES[opt.key])}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Délai : {opt.delay}</p>
                        {opt.note && <p className="text-xs text-muted-foreground mt-1 italic">{opt.note}</p>}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl mb-5">Mode de paiement</h2>
              <div className="space-y-3">
                {paymentOptions.map(opt => (
                  <label key={opt.key} className={`block cursor-pointer rounded-md border p-5 transition ${state.payment === opt.key ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card hover:border-primary/50"}`}>
                    <div className="flex items-start gap-4">
                      <input type="radio" name="pay" checked={state.payment === opt.key} onChange={() => setPayment(opt.key)} className="mt-1 accent-[color:var(--gold-dark)]"/>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-3 flex-wrap">
                          <span className="font-display text-lg">{opt.icon} {opt.title}</span>
                          {opt.warning && <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-destructive/10 text-destructive">Restrictions</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
                        {state.payment === opt.key && opt.instructions && (
                          <p className="text-xs mt-3 p-3 bg-muted rounded-sm leading-relaxed">{opt.instructions}</p>
                        )}
                        {state.payment === opt.key && opt.warning && (
                          <p className="text-xs mt-3 p-3 bg-destructive/5 text-destructive rounded-sm">{opt.warning}</p>
                        )}
                        {state.payment === opt.key && opt.inputLabel && (
                          <div className="mt-3">
                            <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"var(--gold-dark)"}}>{opt.inputLabel}</label>
                            <input
                              value={state.paymentNumber}
                              onChange={e => setPaymentNumber(e.target.value)}
                              placeholder="+237 6XX XXX XXX"
                              className="w-full px-4 py-3 bg-background border border-border rounded-sm text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-border">
              <Link to="/commande/coordonnees" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4"/> Étape précédente
              </Link>
              <button onClick={onConfirm} disabled={submitting} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-gold text-secondary font-semibold rounded-sm hover:shadow-luxe transition disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin"/> Traitement...</> : <>{state.payment === "whatsapp" ? <><MessageCircle className="h-4 w-4"/> Confirmer via WhatsApp</> : "Confirmer la commande"}</>}
              </button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 self-start">
            <div className="bg-card border border-border rounded-md p-6 space-y-4">
              <h3 className="font-display text-xl">Récapitulatif</h3>
              <details className="text-sm" open>
                <summary className="cursor-pointer text-xs uppercase tracking-widest text-muted-foreground">{items.length} article(s)</summary>
                <ul className="mt-3 space-y-2">
                  {items.map(i => (
                    <li key={i.id} className="flex justify-between gap-2">
                      <span className="line-clamp-1">{i.name} × {i.qty}</span>
                      <span className="shrink-0">{formatFCFA(i.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>
              </details>
              <div className="space-y-2 text-sm border-t border-border pt-3">
                <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{formatFCFA(subtotal)}</span></div>
                {promo && <div className="flex justify-between text-[#0a7c3a]"><span>Code {promo.code}</span><span>− {formatFCFA(promo.amount)}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{shippingCost === 0 ? "Gratuit" : formatFCFA(shippingCost)}</span></div>
                <div className="flex items-baseline justify-between pt-2 border-t border-border">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Total</span>
                  <span className="font-display text-2xl" style={{color:"var(--gold-dark)"}}>{formatFCFA(total)}</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">Paiement sélectionné : {selectedPayment.icon} {selectedPayment.title}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}