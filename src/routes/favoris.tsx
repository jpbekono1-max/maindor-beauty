import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { catalog, formatFCFA } from "@/data/products";
import { toast } from "sonner";

export const Route = createFileRoute("/favoris")({
  component: FavorisPage,
  head: () => ({ meta: [
    { title: "Mes Favoris — Main d'or Beauty" },
    { name: "description", content: "Retrouvez vos produits favoris : perruques, lace frontals, soins et accessoires." },
  ]}),
});

function FavorisPage() {
  const { slugs, remove } = useWishlist();
  const { addItem } = useCart();
  const favorites = catalog.filter(p => slugs.includes(p.slug));

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl md:text-4xl">Mes favoris</h1>
        <p className="mt-2 text-sm text-muted-foreground mb-10">{favorites.length} produit(s) sauvegardé(s)</p>

        {favorites.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-16">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground/40 mb-6"/>
            <h2 className="font-display text-2xl">Aucun favori pour le moment</h2>
            <p className="mt-3 text-muted-foreground">Cliquez sur le cœur d'un produit pour le sauvegarder ici.</p>
            <Link to="/boutique" className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gradient-gold text-secondary font-semibold rounded-sm hover:shadow-luxe transition">
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map(p => (
              <div key={p.slug} className="bg-card border border-border rounded-md overflow-hidden">
                <Link to="/boutique/$slug" params={{ slug: p.slug }} className="block aspect-[4/5] overflow-hidden bg-muted">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover hover:scale-105 transition duration-700"/>
                </Link>
                <div className="p-4 space-y-3">
                  <h3 className="font-display text-lg line-clamp-1">{p.name}</h3>
                  <p className="font-display text-base" style={{color:"var(--gold-dark)"}}>{formatFCFA(p.price)}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { addItem({ slug: p.slug, name: p.name, image: p.image, price: p.price, qty: 1 }); toast.success("Ajouté au panier !"); }}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-gradient-gold text-secondary text-xs font-semibold rounded-sm"
                    >
                      <ShoppingBag className="h-3 w-3"/> Panier
                    </button>
                    <button
                      onClick={() => { remove(p.slug); toast.success("Retiré des favoris"); }}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 border border-border text-xs rounded-sm hover:bg-muted"
                    >
                      <Heart className="h-3 w-3 fill-current text-primary"/> Retirer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}