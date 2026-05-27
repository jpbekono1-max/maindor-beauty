import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ShoppingBag, Heart } from "lucide-react";
import logo from "@/assets/logo.png";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatFCFA } from "@/data/products";

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/boutique", label: "Boutique" },
  { to: "/services", label: "Services" },
  { to: "/galerie", label: "Galerie" },
  { to: "/a-propos", label: "À Propos" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count, setOpen: setCartOpen, items, subtotal } = useCart();
  const { count: wishCount } = useWishlist();
  const [miniOpen, setMiniOpen] = useState(false);
  return (
    <>
      {/* Announcement marquee */}
      <div className="bg-secondary text-secondary-foreground overflow-hidden border-b border-gold/20">
        <div className="relative flex whitespace-nowrap py-2 text-xs">
          <div className="animate-marquee flex shrink-0 gap-12 pr-12">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex shrink-0 gap-12">
                <span>✨ Nouvelle collection de perruques disponible</span>
                <span>· Livraison partout au Cameroun</span>
                <span>· Formation Lace Frontal — Prochaine session : 15 Juin ✨</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-lg">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Main d'or Beauty" className="h-12 w-12 rounded-full bg-secondary object-cover" />
            <div className="hidden sm:block">
              <div className="font-display text-lg leading-none">Main d'or</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold-dark" style={{color:"var(--gold-dark)"}}>Beauty</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className="text-sm font-medium transition-colors hover:text-primary" activeProps={{ className: "text-primary" }} activeOptions={{ exact: l.to === "/" }}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/favoris" aria-label="Favoris" className="relative hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition">
              <Heart className="h-5 w-5" />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 inline-flex items-center justify-center rounded-full bg-secondary text-ivory text-[10px] font-bold" style={{backgroundColor:"var(--noir)", color:"var(--ivory)"}}>
                  {wishCount}
                </span>
              )}
            </Link>
            <div className="relative" onMouseEnter={() => setMiniOpen(true)} onMouseLeave={() => setMiniOpen(false)}>
              <button aria-label="Panier" onClick={() => setCartOpen(true)} className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition">
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 inline-flex items-center justify-center rounded-full bg-gradient-gold text-secondary text-[10px] font-bold">
                    {count}
                  </span>
                )}
              </button>
              {miniOpen && items.length > 0 && (
                <div className="hidden lg:block absolute right-0 top-full pt-2 z-50">
                  <div className="w-80 bg-card border border-border rounded-md shadow-luxe p-4">
                    <div className="max-h-64 overflow-y-auto space-y-3">
                      {items.slice(0, 4).map(i => (
                        <div key={i.id} className="flex gap-3">
                          <img src={i.image} alt={i.name} className="h-12 w-12 object-cover rounded-sm bg-muted shrink-0"/>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-display leading-tight line-clamp-1">{i.name}</p>
                            <p className="text-[11px] text-muted-foreground">× {i.qty} — {formatFCFA(i.price * i.qty)}</p>
                          </div>
                        </div>
                      ))}
                      {items.length > 4 && (
                        <p className="text-[11px] text-muted-foreground">+ {items.length - 4} autre(s) article(s)</p>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex items-baseline justify-between">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">Sous-total</span>
                      <span className="font-display text-lg" style={{color:"var(--gold-dark)"}}>{formatFCFA(subtotal)}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link to="/panier" className="text-center text-xs px-3 py-2 border border-primary text-primary rounded-sm hover:bg-primary hover:text-secondary transition">Voir le panier</Link>
                      <Link to="/commande/coordonnees" className="text-center text-xs px-3 py-2 bg-gradient-gold text-secondary font-semibold rounded-sm">Commander</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button aria-label="Menu" onClick={() => setOpen(true)} className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background shadow-2xl p-6 animate-fade-up">
            <div className="flex justify-between items-center mb-8">
              <span className="font-display text-xl">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Fermer" className="h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-muted"><X className="h-5 w-5"/></button>
            </div>
            <nav className="flex flex-col gap-1">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-3 px-2 border-b border-border text-base font-medium hover:text-primary">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}