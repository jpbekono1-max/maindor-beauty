import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Crown, Sparkles, Scissors, Droplet, Palette, GraduationCap, Check, Award } from "lucide-react";
import bridal from "@/assets/bridal.jpg";
import nails from "@/assets/nails.jpg";
import training from "@/assets/training.jpg";
import p1 from "@/assets/product-1.jpg";
import p3 from "@/assets/product-3.jpg";
import p5 from "@/assets/product-5.jpg";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({ meta: [
    { title: "Nos Services — Main d'or Beauty" },
    { name: "description", content: "Perruques, coiffure mariage, confection sur mesure, soins, onglerie et formations professionnelles." },
  ]}),
});

const blocks = [
  {
    icon: Crown, color: "Perruques & Lace Frontal", title: "Perruques & Lace Frontal",
    desc: "Une sélection exclusive de perruques naturelles et lace frontal HD pour un rendu invisible.",
    duration: "1h30 à 3h", price: "À partir de 95 000 FCFA",
    bullets: ["Lace front 13x4 HD", "Lace full transparente", "Bob wig prêt-à-porter", "U-part & headband"],
    gallery: [p1, p3, p5, bridal],
    cta: "Prendre RDV", to: "/contact",
  },
  {
    icon: Sparkles, title: "Coiffure Mariage",
    desc: "Des forfaits pensés pour vous accompagner du jour J jusqu'à la cérémonie traditionnelle.",
    duration: "Demi-journée à journée complète", price: "À partir de 75 000 FCFA",
    bullets: ["Forfait Essentiel — 75 000 FCFA", "Forfait Prestige — 150 000 FCFA", "Forfait Luxe — 250 000 FCFA", "Essai + jour J + maquillage option"],
    gallery: [bridal, bridal, nails, bridal],
    cta: "Demander un devis", to: "/contact",
  },
  {
    icon: Scissors, title: "Confection de Perruques sur Mesure",
    desc: "Votre perruque, vos mensurations, vos envies. De la prise de mesures à la livraison.",
    duration: "Délai : 7 à 14 jours", price: "Sur devis",
    bullets: ["Étape 1 — Prise de mesures", "Étape 2 — Choix de la matière", "Étape 3 — Fabrication artisanale", "Étape 4 — Livraison & ajustement"],
    gallery: [p1, p3, p5, p1],
    cta: "Commander ma perruque", to: "/contact",
  },
  {
    icon: Droplet, title: "Traitement & Soin de Perruques",
    desc: "Redonnez vie à vos perruques avec nos soins professionnels.",
    duration: "1h à 2h30", price: "À partir de 8 000 FCFA",
    bullets: ["Hydratation profonde — 12 000 FCFA", "Coloration — 25 000 FCFA", "Brushing — 8 000 FCFA", "Démêlage & restauration — 18 000 FCFA"],
    gallery: [p1, p3, p5, p1],
    cta: "Déposer ma perruque", to: "/contact",
  },
  {
    icon: Palette, title: "Onglerie",
    desc: "Pose et nail art exécutés avec la précision Main d'or.",
    duration: "1h à 2h", price: "À partir de 5 000 FCFA",
    bullets: ["Pose gel — 8 000 FCFA", "Semi-permanent — 6 000 FCFA", "Nail art doré — 12 000 FCFA", "French & extensions — sur devis"],
    gallery: [nails, nails, nails, nails, nails, nails, nails, nails],
    cta: "Réserver", to: "/contact",
  },
  {
    icon: GraduationCap, title: "Formations Professionnelles",
    desc: "Devenez experte certifiée. Petits effectifs, matériel premium, suivi post-formation.",
    duration: "2 à 5 jours", price: "À partir de 35 000 FCFA",
    bullets: ["Pose de Lace Frontal — 2 jours · 35 000 FCFA", "Confection de Perruques — 5 jours · 80 000 FCFA", "Soins Capillaires — 3 jours · 45 000 FCFA", "Onglerie Complète — 4 jours · 60 000 FCFA"],
    gallery: [training, training, training, training],
    cta: "S'inscrire à une Formation", to: "/contact",
    badge: true,
  },
];

function ServicesPage() {
  return (
    <>
      <PageHeader title="Nos Services" subtitle="L'excellence capillaire et beauté, déclinée en six expertises." breadcrumb={[{label:"Accueil", to:"/"},{label:"Services"}]}/>
      <div className="container mx-auto px-4 py-20 space-y-28">
        {blocks.map((b, i) => (
          <section key={i} className={`grid gap-12 lg:grid-cols-2 items-center ${i%2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-full bg-gradient-gold flex items-center justify-center"><b.icon className="h-7 w-7 text-secondary"/></div>
                <span className="text-xs uppercase tracking-[0.4em]" style={{color:"var(--gold-dark)"}}>Service {String(i+1).padStart(2,"0")}</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl">{b.title}</h2>
              {b.badge && <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-primary/15 text-xs font-medium" style={{color:"var(--gold-dark)"}}><Award className="h-3.5 w-3.5"/> Certificat délivré</div>}
              <p className="mt-4 text-muted-foreground">{b.desc}</p>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <div><span className="text-muted-foreground">Durée :</span> <span className="font-medium">{b.duration}</span></div>
                <div><span className="text-muted-foreground">Tarif :</span> <span className="font-medium" style={{color:"var(--gold-dark)"}}>{b.price}</span></div>
              </div>
              <ul className="mt-6 space-y-2">
                {b.bullets.map(x => <li key={x} className="flex items-start gap-3 text-sm"><Check className="h-4 w-4 mt-0.5 text-primary shrink-0"/>{x}</li>)}
              </ul>
              <Link to={b.to} className="mt-8 inline-flex px-7 py-3 bg-gradient-gold text-secondary rounded-sm font-semibold tracking-wide hover:shadow-luxe transition">{b.cta}</Link>
            </div>
            <div className={`grid gap-3 ${b.gallery.length > 4 ? "grid-cols-4" : "grid-cols-2"}`}>
              {b.gallery.map((src, k) => (
                <div key={k} className="aspect-square overflow-hidden rounded-md shadow-soft">
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"/>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <section className="bg-gradient-noir text-secondary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <SectionTitle eyebrow="Prêt à commencer ?" title="Réservez votre expérience Main d'or"/>
          <Link to="/contact" className="mt-8 inline-flex px-8 py-4 bg-gradient-gold text-secondary rounded-sm font-semibold tracking-wide">Prendre rendez-vous</Link>
        </div>
      </section>
    </>
  );
}