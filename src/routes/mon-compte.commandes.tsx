import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, ChevronRight, Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AccountSidebar } from "@/components/site/AccountSidebar";
import { STATUS_LABELS, STATUS_COLORS, type OrderStatus } from "@/lib/orders";
import { formatFCFA } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortEnum = z.enum(["date-desc", "date-asc", "amount-desc", "amount-asc"]);

const searchSchema = z.object({
  sort: fallback(sortEnum, "date-desc").default("date-desc"),
  q: fallback(z.string(), "").default(""),
  status: fallback(z.string(), "all").default("all"),
  from: fallback(z.string(), "").default(""),
  to: fallback(z.string(), "").default(""),
  min: fallback(z.string(), "").default(""),
  max: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/mon-compte/commandes")({
  head: () => ({ meta: [{ title: "Mes commandes — Main d'or Beauty" }] }),
  validateSearch: zodValidator(searchSchema),
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

const ALL_STATUSES: OrderStatus[] = [
  "received",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
];

const SORT_OPTIONS = [
  { value: "date-desc", label: "Date (récent d'abord)" },
  { value: "date-asc", label: "Date (ancien d'abord)" },
  { value: "amount-desc", label: "Montant (élevé → bas)" },
  { value: "amount-asc", label: "Montant (bas → élevé)" },
];

function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const filterNavigate = useNavigate({ from: "/mon-compte/commandes" });
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { sort, q, status, from, to, min, max } = Route.useSearch();

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

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    const filtered = orders.filter((o) => {
      const matchesSearch =
        q.trim() === "" ||
        o.order_number.toLowerCase().includes(q.toLowerCase());
      const matchesStatus = status === "all" || o.status === status;
      const oDate = new Date(o.created_at);
      const matchesFrom = from === "" || oDate >= new Date(from);
      const matchesTo = to === "" || oDate <= new Date(to + "T23:59:59");
      const matchesMin = min === "" || o.total >= parseInt(min) * 100;
      const matchesMax = max === "" || o.total <= parseInt(max) * 100;
      return matchesSearch && matchesStatus && matchesFrom && matchesTo && matchesMin && matchesMax;
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "date-desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "amount-desc":
          return b.total - a.total;
        case "amount-asc":
          return a.total - b.total;
        default:
          return 0;
      }
    });
  }, [orders, q, status, from, to, min, max, sort]);

  const hasActiveFilters =
    status !== "all" ||
    from !== "" ||
    to !== "" ||
    min !== "" ||
    max !== "" ||
    q.trim() !== "";

  const clearFilters = () => {
    filterNavigate({
      search: (prev: z.infer<typeof searchSchema>) => ({
        ...prev,
        sort: "date-desc",
        q: "",
        status: "all",
        from: "",
        to: "",
        min: "",
        max: "",
      }),
    });
  };

  const updateSearch = (patch: Partial<z.infer<typeof searchSchema>>) => {
    filterNavigate({ search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, ...patch }) });
  };

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
        <div className="space-y-4">
          {/* Barre de recherche + tri */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher par n° de commande…"
                value={q}
                onChange={(e) => updateSearch({ q: e.target.value })}
                className="pl-9"
              />
              {q && (
                <button
                  onClick={() => updateSearch({ q: "" })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Select value={sort} onValueChange={(value) => updateSearch({ sort: value as z.infer<typeof sortEnum> })}>
              <SelectTrigger className="w-full sm:w-[220px] gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Trier par…" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className={`gap-2 ${showFilters ? "border-primary text-primary" : ""}`}
              onClick={() => setShowFilters((s) => !s)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtres
              {hasActiveFilters && (
                <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {(status !== "all" ? 1 : 0) +
                    (from !== "" || to !== "" ? 1 : 0) +
                    (min !== "" || max !== "" ? 1 : 0)}
                </span>
              )}
            </Button>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="bg-card border border-border rounded-md p-4 shadow-soft grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Statut</label>
                <Select value={status} onValueChange={(value) => updateSearch({ status: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {ALL_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Date (du)</label>
                <Input type="date" value={from} onChange={(e) => updateSearch({ from: e.target.value })} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Date (au)</label>
                <Input type="date" value={to} onChange={(e) => updateSearch({ to: e.target.value })} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Montant (FCFA)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    placeholder="Min"
                    value={min}
                    onChange={(e) => updateSearch({ min: e.target.value })}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Max"
                    value={max}
                    onChange={(e) => updateSearch({ max: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Résultats */}
          <div className="bg-card border border-border rounded-md p-6 shadow-soft">
            {orders === null ? (
              <p className="text-sm text-muted-foreground">Chargement…</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="font-display text-lg">Aucune commande pour le moment</p>
                <p className="text-sm text-muted-foreground mt-1 mb-6">Découvrez notre boutique pour passer votre première commande.</p>
                <Link to="/boutique" className="inline-block px-6 py-3 bg-gradient-gold text-secondary font-semibold rounded-sm">Voir la boutique</Link>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="font-display text-lg">Aucune commande ne correspond</p>
                <p className="text-sm text-muted-foreground mt-1 mb-6">Essayez de modifier vos critères de recherche.</p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-3">{filteredOrders.length} commande(s)</p>
                <ul className="divide-y divide-border">
                  {filteredOrders.map((o) => (
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
                          <span className="font-display text-base" style={{ color: "var(--gold-dark)" }}>{formatFCFA(o.total)}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
