import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { catalog } from "@/data/products";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";

export const Route = createFileRoute("/boutique/")({
  component: BoutiquePage,
  head: () => ({ meta: [
    { title: "Boutique — Main d'or Beauty" },
    { name: "description", content: "Perruques naturelles, lace frontal, accessoires, soins et onglerie. Livraison partout au Cameroun." },
  ]}),
});

const categories = ["Tout", "Perruques Naturelles", "Perruques Synthétiques", "Lace Frontal", "Accessoires", "Soins", "Onglerie"];
const textures = ["Lisse", "Bouclé", "Frisé", "Afro", "Body Wave"];
const PER_PAGE = 9;

function BoutiquePage() {
  const [cat, setCat] = useState("Tout");
  const [tex, setTex] = useState<string | null>(null);
  const [max, setMax] = useState(500000);
  const [sort, setSort] = useState("new");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const list = useMemo(() => {
    let l = [...catalog];
    if (cat !== "Tout") l = l.filter(p => p.category === cat);
    if (tex) l = l.filter(p => p.texture === tex);
    l = l.filter(p => p.price <= max);
    if (sort === "asc") l.sort((a,b) => a.price - b.price);
    if (sort === "desc") l.sort((a,b) => b.price - a.price);
    if (sort === "best") l.sort((a,b) => b.reviews - a.reviews);
    return l;
  }, [cat, tex, max, sort]);

  useEffect(() => { setPage(1); }, [cat, tex, max, sort]);

  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = list.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const FiltersBody = (
    <div className="space-y-8">
      <FilterGroup title="Catégorie">
        <div className="space-y-2">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`block w-full text-left text-sm py-1.5 ${cat===c ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`} style={cat===c?{color:"var(--gold-dark)"}:undefined}>
              {c}
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Texture">
        <div className="flex flex-wrap gap-2">
          {textures.map(t => (
            <button key={t} onClick={() => setTex(tex===t ? null : t)} className={`px-3 py-1.5 text-xs rounded-full border transition ${tex===t ? "bg-gradient-gold text-secondary border-transparent" : "border-border hover:border-primary"}`}>{t}</button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title={`Prix max : ${max.toLocaleString("fr-FR")} FCFA`}>
        <input type="range" min={5000} max={500000} step={5000} value={max} onChange={e => setMax(+e.target.value)} className="w-full accent-[oklch(0.74_0.13_82)]"/>
      </FilterGroup>
    </div>
  );

  return (
    <>
      <PageHeader title="Boutique" subtitle="Notre sélection signature, livrée partout au Cameroun." breadcrumb={[{label:"Accueil",to:"/"},{label:"Boutique"}]}/>
      <section className="py-16">
        <div className="container mx-auto px-4 grid lg:grid-cols-[260px_1fr] gap-10">
          <aside className="hidden lg:block sticky top-32 self-start">{FiltersBody}</aside>
          <div>
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <p className="text-sm text-muted-foreground">{list.length} produits</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setOpen(true)} className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border border-border rounded-sm text-sm"><SlidersHorizontal className="h-4 w-4"/> Filtres</button>
                <select value={sort} onChange={e => setSort(e.target.value)} className="h-10 px-3 bg-background border border-border rounded-sm text-sm">
                  <option value="new">Nouveautés</option>
                  <option value="asc">Prix croissant</option>
                  <option value="desc">Prix décroissant</option>
                  <option value="best">Meilleures ventes</option>
                </select>
              </div>
            </div>
            {paginated.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                Aucun produit ne correspond à vos filtres.
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {paginated.map(p => <ProductCard key={p.slug} product={p}/>)}
                </div>
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-10 w-10 inline-flex items-center justify-center rounded-sm border border-border disabled:opacity-30 hover:border-primary transition"
                      aria-label="Page précédente"
                    >
                      <ChevronLeft className="h-4 w-4"/>
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const n = i + 1;
                      const active = n === currentPage;
                      return (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`h-10 min-w-10 px-3 inline-flex items-center justify-center rounded-sm text-sm transition ${active ? "bg-gradient-gold text-secondary font-semibold" : "border border-border hover:border-primary"}`}
                        >
                          {n}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="h-10 w-10 inline-flex items-center justify-center rounded-sm border border-border disabled:opacity-30 hover:border-primary transition"
                      aria-label="Page suivante"
                    >
                      <ChevronRight className="h-4 w-4"/>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)}/>
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="font-display text-xl">Filtres</span>
              <button onClick={() => setOpen(false)} className="h-10 w-10 rounded-full hover:bg-muted inline-flex items-center justify-center"><X className="h-5 w-5"/></button>
            </div>
            {FiltersBody}
          </div>
        </div>
      )}
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.3em] mb-4" style={{color:"var(--gold-dark)"}}>{title}</h3>
      {children}
    </div>
  );
}