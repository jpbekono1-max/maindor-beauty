import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { Eye, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p5 from "@/assets/product-5.jpg";
import bridal from "@/assets/bridal.jpg";
import nails from "@/assets/nails.jpg";
import training from "@/assets/training.jpg";

export const Route = createFileRoute("/galerie")({
  component: GaleriePage,
  head: () => ({ meta: [
    { title: "Galerie — Main d'or Beauty" },
    { name: "description", content: "Découvrez nos réalisations : perruques, coiffure mariage, nail art, transformations et formations." },
  ]}),
});

const filters = ["Tout", "Perruques", "Coiffure Mariage", "Nail Art", "Avant/Après", "Formations", "Vidéos"] as const;
type Filter = typeof filters[number];

type GalleryItem = { src: string; cat: Filter; title: string; type?: "image" | "video"; video?: string; poster?: string };

const items: GalleryItem[] = [
  { src: p1, cat: "Perruques", title: "Lace Frontal Naturelle" },
  { src: bridal, cat: "Coiffure Mariage", title: "Chignon Bridal" },
  { src: nails, cat: "Nail Art", title: "Nail Art Doré" },
  { src: p3, cat: "Perruques", title: "Body Wave 26\"" },
  { src: training, cat: "Formations", title: "Session Lace Frontal" },
  { src: p5, cat: "Perruques", title: "Afro Kinky" },
  { src: bridal, cat: "Avant/Après", title: "Transformation Mariage" },
  { src: p2, cat: "Perruques", title: "Bob Wig" },
  { src: nails, cat: "Nail Art", title: "French Élégant" },
  { src: training, cat: "Formations", title: "Confection Perruques" },
  { src: bridal, cat: "Coiffure Mariage", title: "Couronne Pearls" },
  { src: p1, cat: "Avant/Après", title: "Pose Lace HD" },
  { src: p1, cat: "Vidéos", title: "Présentation Lace Frontal", type: "video", poster: p1, video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
  { src: p3, cat: "Vidéos", title: "Mouvement Body Wave", type: "video", poster: p3, video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
  { src: bridal, cat: "Vidéos", title: "Coulisses Mariage", type: "video", poster: bridal, video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
];

function GaleriePage() {
  const [f, setF] = useState<Filter>("Tout");
  const [lb, setLb] = useState<number | null>(null);
  const filtered = items.filter(i => f === "Tout" || i.cat === f);

  return (
    <>
      <PageHeader title="Galerie" subtitle="Une sélection de nos plus belles réalisations." breadcrumb={[{label:"Accueil", to:"/"},{label:"Galerie"}]}/>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filters.map(x => (
              <button key={x} onClick={() => setF(x)} className={`px-5 py-2 text-xs uppercase tracking-widest rounded-full transition ${f===x ? "bg-gradient-gold text-secondary" : "border border-border hover:border-primary"}`}>
                {x}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((it, i) => (
              <button key={i} onClick={() => setLb(i)} className="group relative overflow-hidden rounded-md break-inside-avoid">
                <img src={it.poster ?? it.src} alt={it.title} loading="lazy" className="w-full h-full object-cover aspect-[4/5] transition-transform duration-700 group-hover:scale-105"/>
                {it.type === "video" && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/85 text-secondary-foreground text-[10px] uppercase tracking-widest backdrop-blur">
                    <Play className="h-3 w-3 fill-current"/> Vidéo
                  </span>
                )}
                {it.type === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition">
                    <span className="h-14 w-14 rounded-full bg-gradient-gold inline-flex items-center justify-center shadow-luxe">
                      <Play className="h-6 w-6 text-secondary fill-current"/>
                    </span>
                  </span>
                )}
                <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/70 transition-colors flex flex-col items-center justify-center text-secondary-foreground opacity-0 group-hover:opacity-100">
                  {it.type !== "video" && <Eye className="h-7 w-7 text-primary mb-2"/>}
                  <p className="font-display text-lg">{it.title}</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-70">{it.cat}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
      {lb !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setLb(null)}>
          <button aria-label="Fermer" className="absolute top-6 right-6 text-white h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-white/10"><X/></button>
          <button aria-label="Précédent" onClick={(e) => { e.stopPropagation(); setLb((lb - 1 + filtered.length) % filtered.length); }} className="absolute left-6 text-white h-12 w-12 inline-flex items-center justify-center rounded-full hover:bg-white/10"><ChevronLeft/></button>
          {filtered[lb].type === "video" ? (
            <video
              key={filtered[lb].video}
              src={filtered[lb].video}
              poster={filtered[lb].poster}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] rounded-md bg-black"
            />
          ) : (
            <img src={filtered[lb].src} alt="" className="max-h-[85vh] max-w-[90vw] object-contain"/>
          )}
          <button aria-label="Suivant" onClick={(e) => { e.stopPropagation(); setLb((lb + 1) % filtered.length); }} className="absolute right-6 text-white h-12 w-12 inline-flex items-center justify-center rounded-full hover:bg-white/10"><ChevronRight/></button>
        </div>
      )}
    </>
  );
}