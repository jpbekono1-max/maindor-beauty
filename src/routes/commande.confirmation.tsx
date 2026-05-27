import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2, MessageCircle, Smartphone, PackageSearch, Rocket } from "lucide-react";
import { CheckoutSteps } from "@/components/site/CheckoutSteps";
import { useCheckout } from "@/context/CheckoutContext";

export const Route = createFileRoute("/commande/confirmation")({
  component: ConfirmationPage,
  head: () => ({ meta: [{ title: "Commande confirmée — Main d'or Beauty" }] }),
});

function ConfirmationPage() {
  const navigate = useNavigate();
  const { state, reset } = useCheckout();

  useEffect(() => {
    if (!state.orderNumber) navigate({ to: "/boutique", replace: true });
  }, [state.orderNumber, navigate]);

  if (!state.orderNumber) return null;

  const firstName = state.customer.fullName.split(" ")[0] || "";
  const waQuestion = encodeURIComponent(`Bonjour Main d'or Beauty, j'ai passé la commande #${state.orderNumber} et j'ai une question...`);

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <CheckoutSteps current={3}/>

        <div className="text-center animate-fade-up">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-gold inline-flex items-center justify-center shadow-luxe mb-6">
            <CheckCircle2 className="h-12 w-12 text-secondary"/>
          </div>
          <h1 className="font-display text-3xl md:text-5xl">Commande reçue ! Merci {firstName}</h1>
          <p className="mt-4 text-muted-foreground">Votre commande a été enregistrée avec succès. Voici votre numéro :</p>
          <p className="mt-3 inline-block px-5 py-2 rounded-sm border border-primary text-primary font-mono text-lg tracking-widest">#{state.orderNumber}</p>
        </div>

        <div className="mt-10 bg-card border border-border rounded-md p-6 md:p-8 space-y-3 text-sm">
          <h2 className="font-display text-xl mb-2">Résumé de la commande</h2>
          <Row label="Nom" value={state.customer.fullName}/>
          <Row label="WhatsApp" value={state.customer.whatsapp}/>
          <Row label="Ville" value={state.customer.city}/>
          <Row label="Adresse" value={state.customer.address}/>
          <Row label="Mode de paiement" value={paymentLabel(state.payment)}/>
          {state.customer.note && <Row label="Note" value={state.customer.note}/>}
        </div>

        <div className="mt-10">
          <h2 className="font-display text-xl mb-5 text-center">Et maintenant ?</h2>
          <ol className="grid sm:grid-cols-3 gap-4">
            <Step icon={<Smartphone className="h-5 w-5"/>} title="Confirmation WhatsApp" text="Vous recevrez une confirmation WhatsApp dans les 15 minutes."/>
            <Step icon={<PackageSearch className="h-5 w-5"/>} title="Préparation" text="Notre équipe prépare votre commande avec soin."/>
            <Step icon={<Rocket className="h-5 w-5"/>} title="Livraison" text="Livraison selon le mode choisi."/>
          </ol>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/suivi-commande" onClick={() => reset()} className="px-6 py-4 bg-gradient-gold text-secondary font-semibold rounded-sm text-center hover:shadow-luxe transition">
            Suivre ma commande
          </Link>
          <Link to="/boutique" onClick={() => reset()} className="px-6 py-4 border border-primary text-primary rounded-sm text-center hover:bg-primary hover:text-secondary transition">
            Continuer mes achats
          </Link>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground mb-3">Une question ? Écrivez-nous directement</p>
          <a href={`https://wa.me/237693881451?text=${waQuestion}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-sm hover:opacity-90 transition">
            <MessageCircle className="h-5 w-5"/> Contacter Main d'or Beauty
          </a>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 border-b border-border last:border-0 pb-2 last:pb-0">
      <span className="text-xs uppercase tracking-widest text-muted-foreground w-40 shrink-0">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Step({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <li className="bg-card border border-border rounded-md p-5">
      <span className="h-10 w-10 rounded-full bg-gradient-gold text-secondary inline-flex items-center justify-center mb-3">{icon}</span>
      <p className="font-display text-base">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{text}</p>
    </li>
  );
}

function paymentLabel(p: string) {
  switch (p) {
    case "mtn": return "📱 MTN Mobile Money";
    case "orange": return "🟠 Orange Money";
    case "cod": return "💵 Paiement à la livraison";
    case "whatsapp": return "💬 Paiement via WhatsApp";
    default: return p;
  }
}