import { Link, useLocation } from "@tanstack/react-router";
import { LogOut, User as UserIcon, ShoppingBag, Heart, Calendar, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "@tanstack/react-router";

export function AccountSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = [
    { icon: UserIcon, label: "Profil", to: "/mon-compte" as const, match: (p: string) => p === "/mon-compte" },
    { icon: ShoppingBag, label: "Mes commandes", to: "/mon-compte/commandes" as const, match: (p: string) => p.startsWith("/mon-compte/commande") },
    { icon: Heart, label: "Mes favoris", to: "/favoris" as const, match: (p: string) => p === "/favoris" },
  ];
  const soon = [
    { icon: Calendar, label: "Mes RDV" },
    { icon: GraduationCap, label: "Mes formations" },
  ];

  const handleLogout = async () => {
    await signOut();
    toast.success("Déconnecté");
    navigate({ to: "/" });
  };

  return (
    <aside className="space-y-1">
      {items.map((it, i) => {
        const active = it.match(pathname);
        return (
          <Link key={i} to={it.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition ${active ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"}`}>
            <it.icon className="h-4 w-4"/>{it.label}
          </Link>
        );
      })}
      {soon.map((it, i) => (
        <div key={`s-${i}`} className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm opacity-60 cursor-default">
          <it.icon className="h-4 w-4"/>{it.label}
          <span className="ml-auto text-[10px] uppercase">Bientôt</span>
        </div>
      ))}
      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm hover:bg-muted text-destructive">
        <LogOut className="h-4 w-4"/>Déconnexion
      </button>
    </aside>
  );
}