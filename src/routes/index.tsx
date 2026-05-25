import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Crown, Scissors, Sparkles, Droplet, Palette, GraduationCap, Star, ChevronLeft, ChevronRight, Instagram } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import hero from "@/assets/hero.jpg";
import bridal from "@/assets/bridal.jpg";
import nails from "@/assets/nails.jpg";
import training from "@/assets/training.jpg";
import { SectionTitle } from "@/components/site/SectionTitle";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/data/products";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Main d'or Beauty — L'Art de Sublimer Votre Beauté" },
      { name: "description", content: "Perruques sur mesure, lace frontal, coiffure de mariage, onglerie et formations à Yaoundé." },
    ],
  }),
});

const services = [
  { icon: Crown, title: "Perruques & Lace Frontal", desc: "Sélection premium et lace HD invisible." },
  { icon: Sparkles, title: "Coiffure Mariage", desc: "Des forfaits sur-mesure pour votre jour J." },
  { icon: Scissors, title: "Confection sur Mesure", desc: "Votre perruque, vos mesures, votre style." },
  { icon: Droplet, title: "Traitement de Perruques", desc: "Hydratation, restauration, coloration." },
  { icon: Palette, title: "Onglerie", desc: "Gel, semi-permanent, nail art doré." },
  { icon: GraduationCap, title: "Formations Pro", desc: "Devenez experte certifiée du capillaire." },
];

const testimonials = [
  { name: "Mireille N.", city: "Yaoundé", text: "Ma perruque sur mesure est tout simplement parfaite. La qualité est exceptionnelle, je ne porte plus que ça !", rating: 5 },
  { name: "Aïcha B.", city: "Douala", text: "La formation lace frontal a transformé ma carrière. Pédagogie au top et matériel premium.", rating: 5 },
  { name: "Sandrine M.", city: "Bafoussam", text: "Pour mon mariage, l'équipe a été magique. Cheveux, ongles, tout était divin.", rating: 5 },
  { name: "Carole T.", city: "Yaoundé", text: "Le service client est aux petits soins. Livraison rapide et conseils personnalisés.", rating: 5 },
  { name: "Estelle K.", city: "Kribi", text: "J'adore mon nail art doré, vraiment fidèle à l'esprit Main d'or. À refaire !", rating: 5 },
];

function Hero() {
  return (
    <section className="relative min-h-[88vh] flex items-center text-secondary-foreground overflow-hidden">
      <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1080} fetchPriority="high"/>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>
      <div className="absolute inset-0 animate-shimmer opacity-30"/>
      <div className="container relative mx-auto px-4 py-20">
        <div className="max-w-2xl animate-fade-up">
          <p className="text-xs md:text-sm uppercase tracking-[0.5em] text-gradient-gold mb-6">Main d'or Beauty · Yaoundé</p>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05]">
            L'Art de <span className="text-gradient-gold italic">Sublimer</span> Votre Beauté
          </h1>
          <p className="mt-6 text-lg opacity-90 max-w-lg">Perruques · Coiffure · Onglerie · Formations — l'excellence capillaire et beauté au cœur du Cameroun.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/boutique" className="inline-flex items-center justify-center px-8 py-4 rounded-sm bg-gradient-gold text-secondary font-semibold tracking-wide hover:shadow-luxe transition-all">
              Découvrir la Boutique
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 rounded-sm border border-primary text-primary hover:bg-primary hover:text-secondary transition-all font-medium tracking-wide">
              Prendre RDV
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesQuick() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionTitle eyebrow="Notre Univers" title="Six expertises, une signature" />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div key={i} className="group relative p-8 bg-card border border-border rounded-md hover:border-primary transition-all hover:-translate-y-1 hover:shadow-luxe">
              <div className="h-14 w-14 rounded-full bg-gradient-gold flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <s.icon className="h-7 w-7 text-secondary"/>
              </div>
              <h3 className="font-display text-xl mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
              <Link to="/services" className="mt-4 inline-block text-xs uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100 transition" style={{color:"var(--gold-dark)"}}>Découvrir →</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BestSellers() {
  return (
    <section className="py-20 md:py-28 bg-muted/40">
      <div className="container mx-auto px-4">
        <SectionTitle eyebrow="Bestsellers" title="Nos Incontournables" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0,4).map(p => <ProductCard key={p.slug} product={p}/>)}
        </div>
        <div className="mt-12 text-center">
          <Link to="/boutique" className="inline-flex items-center px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-secondary transition rounded-sm text-sm uppercase tracking-widest">Voir toute la boutique</Link>
        </div>
      </div>
    </section>
  );
}

function BeforeAfter({ caption, duration }: { caption: string; duration: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md shadow-soft select-none">
        <img src={bridal} alt="Avant" className="absolute inset-0 h-full w-full object-cover" loading="lazy"/>
        <div className="absolute inset-0 overflow-hidden" style={{clipPath:`inset(0 0 0 ${pos}%)`}}>
          <img src={nails} alt="Après" className="h-full w-full object-cover" loading="lazy"/>
        </div>
        <div className="absolute inset-y-0 bg-primary w-0.5" style={{left:`${pos}%`}}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-gradient-gold shadow-luxe flex items-center justify-center"><ChevronLeft className="h-4 w-4 text-secondary"/><ChevronRight className="h-4 w-4 text-secondary"/></div>
        </div>
        <input type="range" min={0} max={100} value={pos} onChange={e => setPos(+e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"/>
        <span className="absolute top-3 left-3 bg-secondary/80 text-secondary-foreground text-xs px-2 py-1 rounded">Avant</span>
        <span className="absolute top-3 right-3 bg-gradient-gold text-secondary text-xs px-2 py-1 rounded">Après</span>
      </div>
      <div className="text-center">
        <p className="font-display text-lg">{caption}</p>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{duration}</p>
      </div>
    </div>
  );
}

function BeforeAfterSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionTitle eyebrow="Transformations" title="Avant / Après" subtitle="Faites glisser pour révéler la magie."/>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          <BeforeAfter caption="Pose Lace Frontal" duration="2h30"/>
          <BeforeAfter caption="Coiffure Mariage" duration="3h"/>
          <BeforeAfter caption="Nail Art Signature" duration="1h45"/>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    timer.current = window.setInterval(() => setI(x => (x+1) % testimonials.length), 5000);
    return () => window.clearInterval(timer.current);
  }, []);
  const t = testimonials[i];
  return (
    <section className="py-20 md:py-28 bg-gradient-noir text-secondary-foreground" onMouseEnter={() => window.clearInterval(timer.current)} onMouseLeave={() => { timer.current = window.setInterval(() => setI(x => (x+1) % testimonials.length), 5000); }}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-gradient-gold mb-3">Témoignages</p>
          <h2 className="font-display text-3xl md:text-5xl">Elles nous font confiance</h2>
        </div>
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({length: t.rating}).map((_,k) => <Star key={k} className="h-5 w-5 fill-primary text-primary"/>)}
          </div>
          <p className="font-display text-2xl md:text-3xl italic leading-relaxed">"{t.text}"</p>
          <div className="mt-8">
            <p className="font-semibold text-gradient-gold">{t.name}</p>
            <p className="text-xs uppercase tracking-wider opacity-70">{t.city}</p>
          </div>
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_,k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Témoignage ${k+1}`} className={`h-1.5 transition-all rounded-full ${k===i ? "w-10 bg-primary" : "w-6 bg-white/20"}`}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Counter({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0; const dur = 1500; const t0 = performance.now();
        const tick = (t: number) => { const p = Math.min(1, (t-t0)/dur); setN(Math.floor(start + (value-start)*p)); if (p<1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick); io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, [value]);
  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl text-gradient-gold">{n}{suffix}</div>
      <div className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
    </div>
  );
}

function Stats() {
  return (
    <section className="py-20 border-y border-border">
      <div className="container mx-auto px-4 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <Counter value={500} suffix="+" label="Clientes Satisfaites"/>
        <Counter value={8} label="Ans d'Expérience"/>
        <Counter value={200} suffix="+" label="Perruques Confectionnées"/>
        <Counter value={15} label="Formations Dispensées"/>
      </div>
    </section>
  );
}

function InstagramFeed() {
  const imgs = [bridal, nails, training, bridal, nails, training];
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionTitle eyebrow="@maindorbeauty" title="Suivez-nous sur Instagram" />
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {imgs.map((src, i) => (
            <a href="#" key={i} className="relative aspect-square group overflow-hidden">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"/>
              <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/60 transition-colors flex items-center justify-center">
                <Instagram className="h-7 w-7 text-primary opacity-0 group-hover:opacity-100 transition"/>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="#" className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-secondary rounded-sm text-sm uppercase tracking-widest transition"><Instagram className="h-4 w-4"/> @maindorbeauty</a>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <>
      <Hero/>
      <ServicesQuick/>
      <BestSellers/>
      <BeforeAfterSection/>
      <Testimonials/>
      <Stats/>
      <InstagramFeed/>
    </>
  );
}
