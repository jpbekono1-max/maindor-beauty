import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/mot-de-passe-oublie")({
  head: () => ({ meta: [{ title: "Mot de passe oublié — Main d'or Beauty" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) { toast.error(error); return; }
    setSent(true);
    toast.success("Email envoyé !");
  };

  return (
    <section className="container mx-auto max-w-md px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl">Mot de passe oublié</h1>
        <p className="text-sm text-muted-foreground mt-2">Recevez un lien pour le réinitialiser</p>
      </div>
      <div className="bg-card border border-border rounded-md p-6 shadow-soft">
        {sent ? (
          <div className="text-center space-y-3">
            <p className="text-sm">Un email a été envoyé à <strong>{email}</strong>.</p>
            <p className="text-xs text-muted-foreground">Pensez à vérifier vos spams.</p>
            <Link to="/connexion" className="inline-block mt-3 text-sm text-primary hover:underline">← Retour à la connexion</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full border border-input rounded-sm px-3 py-2 bg-background text-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-gold text-secondary font-semibold py-2.5 rounded-sm text-sm disabled:opacity-60">
              {loading ? "Envoi…" : "Envoyer le lien"}
            </button>
            <Link to="/connexion" className="block text-center text-sm text-muted-foreground hover:text-primary">← Retour à la connexion</Link>
          </form>
        )}
      </div>
    </section>
  );
}