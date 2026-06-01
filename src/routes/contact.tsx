import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { MapPin, Phone, MessageCircle, Clock, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({ meta: [
    { title: "Contact — Main d'or Beauty" },
    { name: "description", content: "Contactez Main d'or Beauty à Yaoundé. WhatsApp, téléphone, formulaire et FAQ." },
  ]}),
});

const faqs = [
  { q: "Quels sont les délais de livraison ?", a: "Yaoundé : 24h à 48h. Autres villes du Cameroun : 2 à 5 jours ouvrés via partenaire logistique." },
  { q: "Comment entretenir ma perruque ?", a: "Lavage tous les 7 à 14 ports, sérum hydratant quotidien, peignage à la brosse douce et stockage sur tête mannequin." },
  { q: "Comment passer commande ?", a: "Directement sur la boutique en ligne, via WhatsApp au +237 693 881 451 ou en boutique à Yaoundé." },
  { q: "Quand sont les prochaines formations ?", a: "Pose lace frontal : 15 juin 2025. Confection perruques : 1er juillet 2025. Inscriptions ouvertes via le formulaire." },
  { q: "Quels modes de paiement acceptez-vous ?", a: "Mobile Money (MTN, Orange), espèces en boutique, virement bancaire et paiement à la livraison à Yaoundé." },
  { q: "Livrez-vous hors de Yaoundé ?", a: "Oui, dans toutes les grandes villes du Cameroun et à l'international sur demande." },
  { q: "Proposez-vous de la personnalisation sur mesure ?", a: "Absolument. Longueur, couleur, densité, cap construction — chaque perruque peut être faite à vos mesures." },
  { q: "Quelle est la durée d'une pose lace ?", a: "Entre 1h30 et 3h selon la complexité. Tenue moyenne : 2 à 4 semaines avec un bon entretien." },
];

function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHeader title="Contact" subtitle="Une question, un projet, un rendez-vous ? Nous sommes à votre écoute." breadcrumb={[{label:"Accueil", to:"/"},{label:"Contact"}]}/>

      <section className="py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-card border border-border rounded-md p-8 md:p-10 shadow-soft">
            <h2 className="font-display text-3xl">Envoyez-nous un message</h2>
            <p className="text-muted-foreground mt-2">Nous vous répondons sous 24h.</p>
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-8 grid gap-5 md:grid-cols-2">
              <Field label="Nom complet" name="nom" required/>
              <Field label="Email" name="email" type="email" required/>
              <Field label="Téléphone (WhatsApp)" name="tel" required/>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Objet</label>
                <select required className="h-12 px-4 bg-background border border-border rounded-sm focus:border-primary focus:outline-none">
                  <option>Commande</option><option>RDV</option><option>Formation</option><option>Renseignement</option><option>Autre</option>
                </select>
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea required rows={5} className="px-4 py-3 bg-background border border-border rounded-sm focus:border-primary focus:outline-none"/>
              </div>
              <button type="submit" className="md:col-span-2 inline-flex justify-center items-center px-8 py-4 bg-gradient-gold text-secondary rounded-sm font-semibold tracking-wide hover:shadow-luxe transition">
                {sent ? "Message envoyé ✓" : "Envoyer le message"}
              </button>
            </form>
          </div>

          <aside className="space-y-4">
            <Info icon={MapPin} title="Adresse" lines={["Yaoundé, Cameroun","Quartier Bastos"]}/>
            <Info icon={Phone} title="Téléphone" lines={["+237 693 881 451"]}/>
            <Info icon={MessageCircle} title="WhatsApp" lines={["+237 693 881 451"]} link="https://wa.me/237693881451"/>
            <Info icon={Clock} title="Horaires" lines={["Lun–Sam : 8h – 19h","Dim : sur RDV"]}/>
            <div className="rounded-md overflow-hidden border border-border bg-muted relative">
              <iframe
                title="Localisation Main d'or Beauty"
                src="https://www.google.com/maps?q=3.837661,11.5085659&z=17&output=embed"
                className="w-full aspect-video"
                loading="lazy"
                allowFullScreen
              />
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=3.837661,11.5085659"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center w-full gap-2 px-4 py-3 bg-gradient-gold text-secondary rounded-sm font-semibold tracking-wide hover:shadow-luxe transition text-sm"
              >
                <MapPin className="h-4 w-4"/> Obtenir l'itinéraire
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.4em]" style={{color:"var(--gold-dark)"}}>Questions Fréquentes</p>
            <h2 className="font-display text-3xl md:text-4xl mt-3">Tout savoir avant de réserver</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="bg-card border border-border rounded-md">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-medium pr-4">{f.q}</span>
                  <ChevronDown className={`h-5 w-5 transition-transform shrink-0 ${openFaq===i ? "rotate-180" : ""}`}/>
                </button>
                {openFaq === i && <div className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input id={name} name={name} type={type} required={required} className="h-12 px-4 bg-background border border-border rounded-sm focus:border-primary focus:outline-none"/>
    </div>
  );
}

function Info({ icon: Icon, title, lines, link }: { icon: any; title: string; lines: string[]; link?: string }) {
  const Wrap: any = link ? "a" : "div";
  return (
    <Wrap href={link} className="block bg-card border border-border rounded-md p-5 flex items-start gap-4 hover:border-primary transition">
      <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-gold flex items-center justify-center"><Icon className="h-5 w-5 text-secondary"/></div>
      <div>
        <p className="text-xs uppercase tracking-widest" style={{color:"var(--gold-dark)"}}>{title}</p>
        {lines.map(l => <p key={l} className="text-sm">{l}</p>)}
      </div>
    </Wrap>
  );
}