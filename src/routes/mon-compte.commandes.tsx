import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AccountSidebar } from "@/components/site/AccountSidebar";
import { STATUS_LABELS, STATUS_COLORS, type OrderStatus } from "@/lib/orders";
import { formatFCFA } from "@/data/products";

export const Route = createFileRoute("/mon-compte/commandes")({
  head: () => ({ meta: [{ title: "Mes commandes — Main d'or Beauty" }] }),
  component: OrdersPage,
});

type OrderRow = {
  id: string;
  order_number: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  item_count: number;
};

function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/connexion", replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("id, order_number, status, total, created_at, order_items(count)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) { setOrders([]); return; }
        setOrders((data ?? []).map((o: any) => ({
          id: o.id,
          order_number: o.order_number,
          status: o.status,
          total: o.total,
          created_at: o.created_at,
          item_count: o.order_items?.[0]?.count ?? 0,
        })));
      });
  }, [user]);

  if (authLoading || !user) {
    return <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Chargement…</div>;
  }

  return (
    <section className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl">Mes commandes</h1>
        <p className="text-sm text-muted-foreground mt-1">Retrouvez l'historique et le suivi de vos commandes.</p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <AccountSidebar />
        <div className="bg-card border border-border rounded-md p-6 shadow-soft">
          {orders === null ? (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
              <p className="font-display text-lg">Aucune commande pour le moment</p>
              <p className="text-sm text-muted-foreground mt-1 mb-6">Découvrez notre boutique pour passer votre première commande.</p>
              <Link to="/boutique" className="inline-block px-6 py-3 bg-gradient-gold text-secondary font-semibold rounded-sm">Voir la boutique</Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {orders.map(o => (
                <li key={o.id}>
                  <Link to="/mon-compte/commande/$orderNumber" params={{ orderNumber: o.order_number }} className="flex items-center justify-between gap-4 py-4 hover:bg-muted/40 -mx-3 px-3 rounded-sm transition">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-sm">#{o.order_number}</span>
                        <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(o.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · {o.item_count} article(s)</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-display text-base" style={{color:"var(--gold-dark)"}}>{formatFCFA(o.total)}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground"/>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}