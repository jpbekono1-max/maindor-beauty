import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/connexion")({
  head: () => ({ meta: [{ title: "Connexion — Main d'or Beauty" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/mon-compte", replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error(error.includes("Invalid") ? "Email ou mot de passe incorrect" : error);
      return;
    }
    toast.success("Bienvenue !");
    navigate({ to: "/mon-compte" });
  };

  const handleGoogle = async () => {
    setLoading(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/mon-compte" });
    if (res?.error) {
      setLoading(false);
      toast.error("Connexion Google indisponible");
    }
  };

  return (
    <section className="container mx-auto max-w-md px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl">Connexion</h1>
        <p className="text-sm text-muted-foreground mt-2">Accédez à votre espace client</p>
      </div>
      <div className="bg-card border border-border rounded-md p-6 shadow-soft">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 border border-border rounded-sm py-2.5 text-sm font-medium hover:bg-muted transition disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
          Continuer avec Google
        </button>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border"/>OU<div className="h-px flex-1 bg-border"/></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full border border-input rounded-sm px-3 py-2 bg-background text-sm" />
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Mot de passe</label>
              <Link to="/mot-de-passe-oublie" className="text-xs text-primary hover:underline">Oublié ?</Link>
            </div>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full border border-input rounded-sm px-3 py-2 bg-background text-sm" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-gold text-secondary font-semibold py-2.5 rounded-sm text-sm disabled:opacity-60">
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Pas encore de compte ? <Link to="/inscription" className="text-primary font-medium hover:underline">Créer un compte</Link>
        </p>
      </div>
    </section>
  );
}