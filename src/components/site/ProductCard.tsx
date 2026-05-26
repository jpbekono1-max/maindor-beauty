import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/data/products";
import { formatFCFA } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative bg-card rounded-md overflow-hidden border border-border hover:shadow-luxe transition-all duration-500">
      <Link to="/boutique/$slug" params={{ slug: product.slug }} className="block relative aspect-[4/5] overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"/>
        {product.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 text-[10px] uppercase tracking-wider rounded-full bg-gradient-gold text-secondary font-semibold">
            {product.badge}
          </span>
        )}
        <button aria-label="Favori" onClick={(e) => e.preventDefault()} className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/90 backdrop-blur inline-flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:text-primary">
          <Heart className="h-4 w-4"/>
        </button>
      </Link>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-0.5">
          {Array.from({length:5}).map((_,i) => <Star key={i} className={`h-3 w-3 ${i < product.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}/>)}
          <span className="ml-1 text-[10px] text-muted-foreground">({product.reviews})</span>
        </div>
        <h3 className="font-display text-lg leading-tight line-clamp-1">{product.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
        <div className="flex items-baseline justify-between pt-2">
          <div>
            {product.oldPrice && <span className="text-xs text-muted-foreground line-through mr-2">{formatFCFA(product.oldPrice)}</span>}
            <span className="font-display text-lg" style={{color:"var(--gold-dark)"}}>{formatFCFA(product.price)}</span>
          </div>
          <Link to="/boutique/$slug" params={{ slug: product.slug }} className="text-xs uppercase tracking-wider underline underline-offset-4 decoration-primary hover:text-primary">Voir</Link>
        </div>
      </div>
    </div>
  );
}