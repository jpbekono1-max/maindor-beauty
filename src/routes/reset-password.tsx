import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Nouveau mot de passe — Main d'or Beauty" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("6 caractères minimum"); return; }
    if (password !== confirm) { toast.error("Les mots de passe ne correspondent pas"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Mot de passe mis à jour !");
    navigate({ to: "/mon-compte" });
  };

  return (
    <section className="container mx-auto max-w-md px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl">Nouveau mot de passe</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-md p-6 shadow-soft space-y-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Nouveau mot de passe</label>
          <input type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full border border-input rounded-sm px-3 py-2 bg-background text-sm" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Confirmer</label>
          <input type="password" required minLength={6} value={confirm} onChange={e=>setConfirm(e.target.value)} className="mt-1 w-full border border-input rounded-sm px-3 py-2 bg-background text-sm" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-gradient-gold text-secondary font-semibold py-2.5 rounded-sm text-sm disabled:opacity-60">
          {loading ? "Mise à jour…" : "Mettre à jour"}
        </button>
      </form>
    </section>
  );
}