import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Award, Heart, Sparkles, ShieldCheck, Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import founderAsset from "@/assets/founder-martine.png.asset.json";
const founder = founderAsset.url;
import training from "@/assets/training.jpg";
import bridal from "@/assets/bridal.jpg";

export const Route = createFileRoute("/a-propos")({
  component: AboutPage,
  head: () => ({ meta: [
    { title: "À Propos — Main d'or Beauty" },
    { name: "description", content: "L'histoire de Main d'or Beauty : huit années d'excellence capillaire au cœur du Cameroun." },
  ]}),
});

const values = [
  { icon: Sparkles, title: "Qualité Premium", desc: "Nous sélectionnons les meilleures matières premières et perfectionnons chaque détail." },
  { icon: Heart, title: "Savoir-Faire Artisanal", desc: "Chaque perruque est confectionnée à la main, avec une attention quasi couture." },
  { icon: ShieldCheck, title: "Satisfaction Garantie", desc: "Notre engagement : votre confiance et votre éclat, à chaque rendez-vous." },
];

const team = [
  { name: "Ntono Bekono Martine Fissy", role: "Fondatrice & Directrice Artistique", specialty: "Confection sur mesure", img: founder },
  { name: "Linda Atangana", role: "Cheffe Coiffeuse Mariage", specialty: "Coiffure & maquillage bridal", img: bridal },
  { name: "Solange Ndjock", role: "Formatrice Senior", specialty: "Pose lace & confection", img: training },
];

const testimonials: { name: string; city: string; rating: number; text: string }[] = [
  { name: "Aminata Mballa", city: "Yaoundé", rating: 5, text: "Ma lace frontal est d'une finition incroyable, on dirait mes vrais cheveux. Service haut de gamme du début à la fin !" },
  { name: "Carole Mengue", city: "Douala", rating: 5, text: "J'ai fait ma coiffure de mariage chez Main d'or Beauty. Toutes mes invitées m'ont complimentée. Merci à toute l'équipe ❤️" },
  { name: "Sandra Owono", city: "Yaoundé", rating: 5, text: "Livraison rapide et perruque conforme aux photos. Je recommande à 1000% pour la qualité." },
  { name: "Estelle Fokou", city: "Bafoussam", rating: 4, text: "Très belle perruque, densité parfaite. Petit délai sur la livraison hors Yaoundé mais le résultat en valait la peine." },
  { name: "Jocelyne Biya", city: "Yaoundé", rating: 5, text: "Formation pose de lace au top ! Martine est pédagogue et exigeante. J'ai gagné en confiance pour mes clientes." },
  { name: "Murielle Kamga", city: "Douala", rating: 5, text: "Nail art impeccable et conseil personnalisé. L'expérience boutique est vraiment luxueuse." },
];

function initials(name: string) {
  return name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
}

function AboutPage() {
  return (
    <>
      <PageHeader title="À Propos" breadcrumb={[{label:"Accueil", to:"/"},{label:"À Propos"}]}/>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.4em]" style={{color:"var(--gold-dark)"}}>Notre Histoire</p>
            <h2 className="font-display text-4xl md:text-5xl mt-3">L'Histoire de <span className="text-gradient-gold italic">Main d'or</span> Beauty</h2>
            <span className="block mt-5 h-px w-16 bg-gradient-gold"/>
            <p className="mt-6 text-muted-foreground leading-relaxed">Née à Yaoundé en 2017 d'une passion pour les cheveux et l'élégance africaine, Main d'or Beauty est aujourd'hui une référence en perruques confectionnées, coiffure mariage et formations professionnelles au Cameroun.</p>
            <p className="mt-4 text-muted-foreground leading-relaxed">Notre mission : sublimer chaque femme à travers un savoir-faire artisanal exigeant, des matières premium et un accompagnement personnalisé.</p>
            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-8">
              <div><div className="font-display text-3xl text-gradient-gold">2017</div><div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Fondation</div></div>
              <div><div className="font-display text-3xl text-gradient-gold">8 ans</div><div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">D'expertise</div></div>
              <div><div className="font-display text-3xl text-gradient-gold">500+</div><div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Clientes</div></div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-gold opacity-20 blur-2xl"/>
            <img src={founder} alt="Fondatrice Main d'or Beauty" loading="lazy" className="relative w-full rounded-md shadow-luxe object-cover aspect-[4/5]"/>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="Nos Piliers" title="Trois valeurs fondatrices"/>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {values.map(v => (
              <div key={v.title} className="p-8 bg-card border border-border rounded-md text-center hover:shadow-luxe hover:-translate-y-1 transition">
                <div className="h-14 w-14 mx-auto rounded-full bg-gradient-gold flex items-center justify-center mb-5"><v.icon className="h-7 w-7 text-secondary"/></div>
                <h3 className="font-display text-xl">{v.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="L'Équipe" title="Les mains derrière la magie"/>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {team.map(m => (
              <div key={m.name} className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-md shadow-soft">
                  <img src={m.img} alt={m.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="font-display text-xl">{m.name}</h3>
                  <p className="text-xs uppercase tracking-widest mt-1" style={{color:"var(--gold-dark)"}}>{m.role}</p>
                  <p className="text-sm text-muted-foreground mt-2">{m.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-muted/40">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="Témoignages" title="Ce que disent nos clientes"/>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map(t => (
              <article key={t.name} className="relative p-7 bg-card border border-border rounded-md hover:shadow-luxe transition">
                <Quote className="absolute top-5 right-5 h-8 w-8 opacity-10" style={{color:"var(--gold-dark)"}}/>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-gold text-secondary font-display">{initials(t.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-display text-base leading-tight">{t.name}</p>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mt-0.5">{t.city}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-0.5" aria-label={`${t.rating} sur 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-current" : "opacity-30"}`} style={{color:"var(--gold-dark)"}}/>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-noir text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gradient-gold">Reconnaissance</p>
          <h2 className="font-display text-3xl md:text-4xl mt-3">Certifications & Distinctions</h2>
          <div className="mt-12 flex flex-wrap justify-center gap-10 opacity-80">
            {["Beauty Africa Awards 2023", "Best Bridal Studio Yaoundé 2022", "Certifiée Hair Pro Academy", "Partenaire HD Lace International"].map(x => (
              <div key={x} className="flex items-center gap-3 border border-primary/40 rounded-full px-5 py-3">
                <Award className="h-5 w-5 text-primary"/>
                <span className="text-sm">{x}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}