import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/suivi-commande")({
  component: SuiviPage,
  head: () => ({ meta: [
    { title: "Suivi de commande — Main d'or Beauty" },
    { name: "description", content: "Suivez l'état de votre commande Main d'or Beauty grâce à votre numéro de commande." },
  ]}),
});

function SuiviPage() {
  const [order, setOrder] = useState("");
  const [wa, setWa] = useState("");
  const [searched, setSearched] = useState(false);

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="font-display text-3xl md:text-4xl text-center">Suivi de ma commande</h1>
        <p className="text-center text-sm text-muted-foreground mt-3">Saisissez votre numéro de commande pour suivre son avancement.</p>

        <form onSubmit={(e) => { e.preventDefault(); setSearched(true); }} className="mt-10 bg-card border border-border rounded-md p-6 space-y-4">
          <label className="block">
            <span className="block text-xs uppercase tracking-widest mb-2" style={{color:"var(--gold-dark)"}}>Numéro de commande</span>
            <input value={order} onChange={e => setOrder(e.target.value.toUpperCase())} placeholder="MD-2025-0042" className="w-full px-4 py-3 bg-background border border-border rounded-sm text-sm focus:outline-none focus:border-primary"/>
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-widest mb-2" style={{color:"var(--gold-dark)"}}>Numéro WhatsApp utilisé</span>
            <input value={wa} onChange={e => setWa(e.target.value)} placeholder="+237 6XX XXX XXX" className="w-full px-4 py-3 bg-background border border-border rounded-sm text-sm focus:outline-none focus:border-primary"/>
          </label>
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-gold text-secondary font-semibold rounded-sm hover:shadow-luxe transition">
            <Search className="h-4 w-4"/> Rechercher ma commande
          </button>
        </form>

        {searched && (
          <div className="mt-10 bg-card border border-border rounded-md p-6">
            <p className="font-display text-lg mb-2">Commande #{order || "—"}</p>
            <ol className="mt-6 space-y-5">
              {[
                { label: "Commande reçue", desc: "Votre demande est enregistrée", done: true },
                { label: "Commande confirmée", desc: "Notre équipe a validé votre commande", done: true },
                { label: "En préparation", desc: "Votre commande est en cours de préparation", done: false, active: true },
                { label: "Expédiée / En route", desc: "Votre commande a été remise au livreur", done: false },
                { label: "Livrée", desc: "Commande livrée avec succès", done: false },
              ].map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className={`h-8 w-8 rounded-full inline-flex items-center justify-center text-xs font-semibold shrink-0 ${s.done ? "bg-gradient-gold text-secondary" : s.active ? "border-2 border-primary text-primary" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                  <div>
                    <p className={`font-display text-base ${!s.done && !s.active ? "text-muted-foreground" : ""}`}>{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground mb-3">Besoin d'aide avec votre commande ?</p>
          <a href={`https://wa.me/237693881451?text=${encodeURIComponent(`Bonjour, j'ai besoin d'aide avec ma commande #${order || ""}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-sm hover:opacity-90 transition">
            <MessageCircle className="h-5 w-5"/> Nous contacter sur WhatsApp
          </a>
        </div>

        <div className="mt-8 text-center">
          <Link to="/boutique" className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4">Retour à la boutique</Link>
        </div>
      </div>
    </section>
  );
}