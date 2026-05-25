import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MessageCircle, ShoppingBag, Minus, Plus, Star } from "lucide-react";
import { catalog, formatFCFA, products } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/boutique/$slug")({
  component: ProductPage,
  loader: ({ params }) => {
    const product = catalog.find(p => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-32 text-center">
      <h1 className="font-display text-3xl">Produit introuvable</h1>
      <Link to="/boutique" className="mt-6 inline-block text-primary underline">Retour à la boutique</Link>
    </div>
  ),
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.product.name ?? "Produit"} — Main d'or Beauty` },
    { name: "description", content: loaderData?.product.description ?? "" },
  ]}),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [tab, setTab] = useState<"detail"|"care"|"ship">("detail");
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(product.colors?.[0]);
  const [length, setLength] = useState(product.lengths?.[0]);

  const wa = encodeURIComponent(`Bonjour Main d'or, je souhaite commander : ${product.name} (${formatFCFA(product.price)})${color ? ` — couleur : ${color}` : ""}${length ? ` — longueur : ${length}` : ""} × ${qty}`);

  return (
    <>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <nav className="text-xs text-muted-foreground mb-8 flex gap-2">
            <Link to="/" className="hover:text-primary">Accueil</Link><span>/</span>
            <Link to="/boutique" className="hover:text-primary">Boutique</Link><span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="aspect-[4/5] overflow-hidden rounded-md shadow-soft bg-muted">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover"/>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {Array.from({length:4}).map((_,i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-md border border-border hover:border-primary cursor-pointer">
                    <img src={product.image} alt="" className="h-full w-full object-cover"/>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {product.badge && <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-wider rounded-full bg-gradient-gold text-secondary font-semibold mb-4">{product.badge}</span>}
              <h1 className="font-display text-3xl md:text-4xl">{product.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex gap-0.5">
                  {Array.from({length:5}).map((_,i) => <Star key={i} className={`h-4 w-4 ${i < product.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}/>)}
                </div>
                <span className="text-xs text-muted-foreground">({product.rating}.0 · 24 avis)</span>
              </div>
              <div className="mt-6 flex items-baseline gap-3">
                {product.oldPrice && <span className="text-lg line-through text-muted-foreground">{formatFCFA(product.oldPrice)}</span>}
                <span className="font-display text-3xl" style={{color:"var(--gold-dark)"}}>{formatFCFA(product.price)}</span>
              </div>
              <p className="mt-4 text-muted-foreground">{product.longDescription}</p>

              <div className="mt-8 space-y-5">
                {product.colors && (
                  <Selector label="Couleur" value={color} setValue={setColor} options={product.colors}/>
                )}
                {product.lengths && (
                  <Selector label="Longueur" value={length} setValue={setLength} options={product.lengths}/>
                )}
                <div>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{color:"var(--gold-dark)"}}>Quantité</p>
                  <div className="inline-flex items-center border border-border rounded-sm">
                    <button onClick={() => setQty(Math.max(1, qty-1))} className="h-11 w-11 inline-flex items-center justify-center hover:bg-muted"><Minus className="h-4 w-4"/></button>
                    <span className="w-12 text-center">{qty}</span>
                    <button onClick={() => setQty(qty+1)} className="h-11 w-11 inline-flex items-center justify-center hover:bg-muted"><Plus className="h-4 w-4"/></button>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                <button className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-gold text-secondary font-semibold rounded-sm hover:shadow-luxe transition"><ShoppingBag className="h-4 w-4"/> Commander</button>
                <button className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-primary text-primary hover:bg-primary hover:text-secondary rounded-sm transition"><Heart className="h-4 w-4"/> Favoris</button>
              </div>
              <a href={`https://wa.me/237693881451?text=${wa}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex w-full items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white rounded-sm hover:opacity-90 transition">
                <MessageCircle className="h-5 w-5"/> Commander via WhatsApp
              </a>

              <div className="mt-10 border-t border-border pt-6">
                <div className="flex gap-6 text-xs uppercase tracking-widest border-b border-border">
                  {[["detail","Détails"],["care","Entretien"],["ship","Livraison"]].map(([k,l]) => (
                    <button key={k} onClick={() => setTab(k as any)} className={`pb-3 ${tab===k ? "border-b-2 border-primary" : "text-muted-foreground"}`} style={tab===k?{color:"var(--gold-dark)"}:undefined}>{l}</button>
                  ))}
                </div>
                <div className="pt-5 text-sm text-muted-foreground leading-relaxed">
                  {tab==="detail" && <p>{product.longDescription} Densité : 180%. Cap construction : élastique respirant. {product.stock}.</p>}
                  {tab==="care" && <p>Lavage tous les 7 à 14 ports avec shampooing sulfate-free. Hydratez les pointes avec sérum quotidien. Stockez sur tête mannequin.</p>}
                  {tab==="ship" && <p>Yaoundé : livraison 24–48h. Cameroun : 2 à 5 jours. Paiement à la livraison disponible à Yaoundé. Retour sous 7 jours.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl mb-10">Avis clientes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[{n:"Mireille N.",r:5,t:"Qualité au rendez-vous, je suis bluffée par la finesse de la lace."},{n:"Aïcha B.",r:5,t:"Livraison rapide et produit fidèle aux photos. Top !"}].map(r => (
              <div key={r.n} className="bg-card border border-border rounded-md p-6">
                <div className="flex gap-0.5 mb-3">{Array.from({length:r.r}).map((_,i)=><Star key={i} className="h-4 w-4 fill-primary text-primary"/>)}</div>
                <p className="text-sm">"{r.t}"</p>
                <p className="mt-3 text-xs uppercase tracking-widest" style={{color:"var(--gold-dark)"}}>{r.n}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl mb-10">Vous aimerez aussi</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.filter(p => p.slug !== product.slug).slice(0,4).map(p => <ProductCard key={p.slug} product={p}/>)}
          </div>
        </div>
      </section>
    </>
  );
}

function Selector({ label, value, setValue, options }: { label: string; value?: string; setValue: (v: string) => void; options: string[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest mb-2" style={{color:"var(--gold-dark)"}}>{label} : <span className="text-foreground normal-case font-normal tracking-normal">{value}</span></p>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o} onClick={() => setValue(o)} className={`px-4 py-2 text-xs border rounded-sm transition ${value===o ? "bg-gradient-gold text-secondary border-transparent" : "border-border hover:border-primary"}`}>{o}</button>
        ))}
      </div>
    </div>
  );
}