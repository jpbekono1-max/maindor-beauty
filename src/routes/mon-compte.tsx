import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, User as UserIcon, ShoppingBag, Heart, Calendar, GraduationCap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/mon-compte")({
  head: () => ({ meta: [{ title: "Mon compte — Main d'or Beauty" }] }),
  component: AccountPage,
});

type Profile = {
  full_name: string | null;
  whatsapp: string | null;
  email: string | null;
  city: string | null;
  address: string | null;
};

function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({ full_name: "", whatsapp: "", email: "", city: "", address: "" });
  const [saving, setSaving] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/connexion", replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name,whatsapp,email,city,address").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) setProfile(data);
      setFetched(true);
    });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      user_id: user.id,
      full_name: profile.full_name,
      whatsapp: profile.whatsapp,
      email: profile.email ?? user.email,
      city: profile.city,
      address: profile.address,
    }, { onConflict: "user_id" });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profil enregistré !");
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Déconnecté");
    navigate({ to: "/" });
  };

  if (authLoading || !user) {
    return <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Chargement…</div>;
  }

  return (
    <section className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl">Mon espace</h1>
        <p className="text-sm text-muted-foreground mt-1">Bienvenue, {profile.full_name || user.email}</p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-1">
          {[
            { icon: UserIcon, label: "Profil", active: true },
            { icon: ShoppingBag, label: "Mes commandes", to: "/suivi-commande" as const },
            { icon: Heart, label: "Mes favoris", to: "/favoris" as const },
            { icon: Calendar, label: "Mes RDV", soon: true },
            { icon: GraduationCap, label: "Mes formations", soon: true },
          ].map((it, i) => {
            const cls = `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition ${it.active ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"}`;
            if (it.to) return <Link key={i} to={it.to} className={cls}><it.icon className="h-4 w-4"/>{it.label}</Link>;
            return (
              <div key={i} className={`${cls} ${it.soon ? "opacity-60 cursor-default" : ""}`}>
                <it.icon className="h-4 w-4"/>{it.label}
                {it.soon && <span className="ml-auto text-[10px] uppercase">Bientôt</span>}
              </div>
            );
          })}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm hover:bg-muted text-destructive">
            <LogOut className="h-4 w-4"/>Déconnexion
          </button>
        </aside>

        <div className="bg-card border border-border rounded-md p-6 shadow-soft">
          <h2 className="font-display text-xl mb-6">Mes informations</h2>
          {!fetched ? (
            <p className="text-sm text-muted-foreground">Chargement du profil…</p>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 max-w-lg">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Nom complet</label>
                <input value={profile.full_name ?? ""} onChange={e=>setProfile(p=>({...p, full_name:e.target.value}))} className="mt-1 w-full border border-input rounded-sm px-3 py-2 bg-background text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">WhatsApp</label>
                <input value={profile.whatsapp ?? ""} onChange={e=>setProfile(p=>({...p, whatsapp:e.target.value}))} placeholder="+237 6XX XXX XXX" className="mt-1 w-full border border-input rounded-sm px-3 py-2 bg-background text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                <input type="email" value={profile.email ?? user.email ?? ""} disabled className="mt-1 w-full border border-input rounded-sm px-3 py-2 bg-muted text-sm" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Ville</label>
                  <input value={profile.city ?? ""} onChange={e=>setProfile(p=>({...p, city:e.target.value}))} className="mt-1 w-full border border-input rounded-sm px-3 py-2 bg-background text-sm" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Adresse</label>
                  <input value={profile.address ?? ""} onChange={e=>setProfile(p=>({...p, address:e.target.value}))} className="mt-1 w-full border border-input rounded-sm px-3 py-2 bg-background text-sm" />
                </div>
              </div>
              <button type="submit" disabled={saving} className="bg-gradient-gold text-secondary font-semibold py-2.5 px-6 rounded-sm text-sm disabled:opacity-60">
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}