import { Minus, Plus, ShoppingBag, Trash2, X, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatFCFA } from "@/data/products";
import { Link } from "@tanstack/react-router";

export function CartDrawer() {
  const { open, setOpen, items, removeItem, updateQty, total, count, clear } = useCart();

  if (!open) return null;

  const waLines = [
    `Bonjour Main d'or Beauty 👋`,
    `Je souhaite confirmer ma commande :`,
    ``,
    ...items.map((i, idx) => {
      const opts = [
        i.color ? `couleur ${i.color}` : null,
        i.length ? `longueur ${i.length}` : null,
        i.density ? `densité ${i.density}` : null,
      ].filter(Boolean).join(", ");
      return `${idx + 1}. ${i.name}${opts ? ` (${opts})` : ""} × ${i.qty} — ${formatFCFA(i.price * i.qty)}`;
    }),
    ``,
    `💰 Total : ${formatFCFA(total)}`,
    ``,
    `Merci de me confirmer disponibilité et livraison.`,
  ].join("\n");
  const waUrl = `https://wa.me/237693881451?text=${encodeURIComponent(waLines)}`;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/60 animate-fade-up" onClick={() => setOpen(false)} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" style={{color:"var(--gold-dark)"}}/>
            <span className="font-display text-xl">Panier</span>
            <span className="text-sm text-muted-foreground">({count})</span>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Fermer" className="h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-muted"><X className="h-5 w-5"/></button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/50"/>
            <p className="text-muted-foreground">Votre panier est vide.</p>
            <Link to="/boutique" onClick={() => setOpen(false)} className="px-5 py-3 bg-gradient-gold text-secondary font-semibold rounded-sm">Découvrir la boutique</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                  <Link to="/boutique/$slug" params={{ slug: item.slug }} onClick={() => setOpen(false)} className="shrink-0">
                    <img src={item.image} alt={item.name} className="h-20 w-20 object-cover rounded-md bg-muted"/>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link to="/boutique/$slug" params={{ slug: item.slug }} onClick={() => setOpen(false)} className="font-display text-base leading-tight line-clamp-2 hover:text-primary">{item.name}</Link>
                      <button onClick={() => removeItem(item.id)} aria-label="Supprimer" className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4"/></button>
                    </div>
                    {(item.color || item.length || item.density) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {[item.color, item.length, item.density].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-border rounded-sm">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="h-8 w-8 inline-flex items-center justify-center hover:bg-muted"><Minus className="h-3 w-3"/></button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="h-8 w-8 inline-flex items-center justify-center hover:bg-muted"><Plus className="h-3 w-3"/></button>
                      </div>
                      <span className="font-display text-base" style={{color:"var(--gold-dark)"}}>{formatFCFA(item.price * item.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-6 py-5 space-y-4 bg-muted/30">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Total</span>
                <span className="font-display text-2xl" style={{color:"var(--gold-dark)"}}>{formatFCFA(total)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Livraison calculée à la confirmation. Paiement à la livraison disponible à Yaoundé.</p>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white rounded-sm hover:opacity-90 transition font-semibold">
                <MessageCircle className="h-5 w-5"/> Confirmer via WhatsApp
              </a>
              <button onClick={clear} className="w-full text-xs text-muted-foreground hover:text-destructive underline underline-offset-4">Vider le panier</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}