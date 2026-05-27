import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight, Heart, MessageCircle } from "lucide-react";
import { useCart, SHIPPING_LABELS, SHIPPING_RATES, type ShippingMethod } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatFCFA } from "@/data/products";
import { toast } from "sonner";

export const Route = createFileRoute("/panier")({
  component: CartPage,
  head: () => ({ meta: [
    { title: "Mon Panier — Main d'or Beauty" },
    { name: "description", content: "Récapitulatif de votre commande sur Main d'or Beauty : perruques, soins et accessoires." },
  ]}),
});

function CartPage() {
  const { items, removeItem, updateQty, subtotal, total, shipping, setShipping, shippingCost, promo, applyPromo, clearPromo } = useCart();
  const { toggle: toggleWish } = useWishlist();
  const [promoInput, setPromoInput] = useState("");

  if (items.length === 0) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/40 mb-6"/>
          <h1 className="font-display text-3xl md:text-4xl">Votre panier est vide</h1>
          <p className="mt-3 text-muted-foreground">Explorez nos perruques, soins et accessoires pour démarrer votre commande.</p>
          <Link to="/boutique" className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gradient-gold text-secondary font-semibold rounded-sm hover:shadow-luxe transition">
            Découvrir la boutique <ArrowRight className="h-4 w-4"/>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl md:text-4xl mb-2">Mon panier</h1>
        <p className="text-sm text-muted-foreground mb-10">{items.length} article(s)</p>

        <div className="grid lg:grid-cols-[1fr_400px] gap-10">
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-card border border-border rounded-md p-4 flex gap-4">
                <Link to="/boutique/$slug" params={{ slug: item.slug }} className="shrink-0">
                  <img src={item.image} alt={item.name} className="h-28 w-28 sm:h-32 sm:w-32 object-cover rounded-sm bg-muted"/>
                </Link>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link to="/boutique/$slug" params={{ slug: item.slug }} className="font-display text-lg leading-tight hover:text-primary">{item.name}</Link>
                    <button onClick={() => { removeItem(item.id); toast.success("Produit retiré du panier"); }} aria-label="Supprimer" className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4"/>
                    </button>
                  </div>
                  {(item.color || item.length || item.density) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {[item.color && `Couleur : ${item.color}`, item.length && `Longueur : ${item.length}`, item.density && `Densité : ${item.density}`].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Prix unitaire : {formatFCFA(item.price)}</p>
                  <div className="mt-auto pt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center border border-border rounded-sm">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="h-9 w-9 inline-flex items-center justify-center hover:bg-muted"><Minus className="h-3 w-3"/></button>
                      <span className="w-10 text-center text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="h-9 w-9 inline-flex items-center justify-center hover:bg-muted"><Plus className="h-3 w-3"/></button>
                    </div>
                    <span className="font-display text-lg" style={{color:"var(--gold-dark)"}}>{formatFCFA(item.price * item.qty)}</span>
                  </div>
                  <button
                    onClick={() => { toggleWish(item.slug); removeItem(item.id); toast.success("Sauvegardé pour plus tard"); }}
                    className="mt-2 self-start text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-primary underline underline-offset-4"
                  >
                    <Heart className="h-3 w-3"/> Sauvegarder pour plus tard
                  </button>
                </div>
              </div>
            ))}
            <Link to="/boutique" className="inline-block text-sm text-muted-foreground hover:text-primary underline underline-offset-4">← Continuer mes achats</Link>
          </div>

          <aside className="lg:sticky lg:top-28 self-start">
            <div className="bg-card border border-border rounded-md p-6 space-y-5">
              <h2 className="font-display text-xl">Récapitulatif</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{formatFCFA(subtotal)}</span></div>
                {promo && (
                  <div className="flex justify-between text-[#0a7c3a]">
                    <span>Code {promo.code} <button onClick={() => { clearPromo(); toast.success("Code retiré"); }} className="ml-1 underline text-xs">retirer</button></span>
                    <span>− {formatFCFA(promo.amount)}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"var(--gold-dark)"}}>Livraison</label>
                <select
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value as ShippingMethod)}
                  className="w-full px-3 py-3 bg-background border border-border rounded-sm text-sm focus:outline-none focus:border-primary"
                >
                  <option value="yaounde">{SHIPPING_LABELS.yaounde} — {formatFCFA(SHIPPING_RATES.yaounde)}</option>
                  <option value="autres">{SHIPPING_LABELS.autres} — {formatFCFA(SHIPPING_RATES.autres)}</option>
                  <option value="retrait">{SHIPPING_LABELS.retrait} — Gratuit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{color:"var(--gold-dark)"}}>Code promo</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <input
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="BIENVENUE10"
                      className="w-full pl-9 pr-3 py-3 bg-background border border-border rounded-sm text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const r = applyPromo(promoInput);
                      if (r.ok) { toast.success(r.message); setPromoInput(""); }
                      else toast.error(r.message);
                    }}
                    className="px-4 py-3 border border-primary text-primary text-sm rounded-sm hover:bg-primary hover:text-secondary transition"
                  >Appliquer</button>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{shippingCost === 0 ? "Gratuit" : formatFCFA(shippingCost)}</span></div>
                <div className="flex items-baseline justify-between pt-2 border-t border-border">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Total</span>
                  <span className="font-display text-3xl" style={{color:"var(--gold-dark)"}}>{formatFCFA(total)}</span>
                </div>
              </div>

              <Link to="/commande/coordonnees" className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-gold text-secondary rounded-sm font-semibold hover:shadow-luxe transition">
                Passer la commande <ArrowRight className="h-4 w-4"/>
              </Link>
              <a href={`https://wa.me/237693881451?text=${encodeURIComponent("Bonjour Main d'or Beauty, je souhaite finaliser ma commande.")}`} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-sm hover:opacity-90 transition text-sm">
                <MessageCircle className="h-4 w-4"/> Commander via WhatsApp
              </a>

              <div className="pt-3 border-t border-border">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Paiements acceptés</p>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2 py-1 rounded-sm border border-border bg-background">📱 MTN Mobile Money</span>
                  <span className="px-2 py-1 rounded-sm border border-border bg-background">🟠 Orange Money</span>
                  <span className="px-2 py-1 rounded-sm border border-border bg-background">💵 Paiement à la livraison</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}