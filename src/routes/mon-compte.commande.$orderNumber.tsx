import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AccountSidebar } from "@/components/site/AccountSidebar";
import { STATUS_STEPS, STATUS_LABELS, STATUS_COLORS, type OrderStatus } from "@/lib/orders";
import { formatFCFA } from "@/data/products";
import { SHIPPING_LABELS, type ShippingMethod } from "@/context/CartContext";

export const Route = createFileRoute("/mon-compte/commande/$orderNumber")({
  head: () => ({ meta: [{ title: "Suivi de commande — Main d'or Beauty" }] }),
  component: OrderDetailPage,
});

type Order = {
  id: string;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  shipping_method: ShippingMethod | null;
  city: string | null;
  address: string | null;
  customer_name: string | null;
  customer_whatsapp: string | null;
  payment_method: string | null;
  note: string | null;
  timeline: { status: OrderStatus; at: string }[];
  created_at: string;
};

type Item = {
  id: string;
  product_name: string;
  product_image: string | null;
  options: { color?: string | null; length?: string | null; density?: string | null };
  unit_price: number;
  quantity: number;
  line_total: number;
};

const paymentLabel = (p: string | null) => {
  switch (p) {
    case "mtn": return "📱 MTN Mobile Money";
    case "orange": return "🟠 Orange Money";
    case "cod": return "💵 Paiement à la livraison";
    case "whatsapp": return "💬 Paiement via WhatsApp";
    default: return p ?? "—";
  }
};

function OrderDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { orderNumber } = useParams({ from: "/mon-compte/commande/$orderNumber" });
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/connexion", replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: o } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .eq("user_id", user.id)
        .maybeSingle();
      if (!o) { setNotFound(true); setLoading(false); return; }
      const { data: its } = await supabase
        .from("order_items")
        .select("id, product_name, product_image, options, unit_price, quantity, line_total")
        .eq("order_id", o.id);
      setOrder(o as unknown as Order);
      setItems((its ?? []) as unknown as Item[]);
      setLoading(false);
    })();
  }, [user, orderNumber]);

  if (authLoading || !user || loading) {
    return <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Chargement…</div>;
  }

  if (notFound || !order) {
    return (
      <section className="container mx-auto px-4 py-16 max-w-xl text-center">
        <h1 className="font-display text-2xl mb-3">Commande introuvable</h1>
        <p className="text-sm text-muted-foreground mb-6">Aucune commande {orderNumber} ne correspond à votre compte.</p>
        <Link to="/mon-compte/commandes" className="inline-block px-6 py-3 bg-gradient-gold text-secondary font-semibold rounded-sm">Mes commandes</Link>
      </section>
    );
  }

  const currentIdx = STATUS_STEPS.findIndex(s => s.key === order.status);
  const waMsg = encodeURIComponent(`Bonjour Main d'or Beauty, j'ai une question sur ma commande #${order.order_number}`);

  return (
    <section className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-6">
        <Link to="/mon-compte/commandes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4"/> Toutes mes commandes
        </Link>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <AccountSidebar />

        <div className="space-y-8">
          <header className="bg-card border border-border rounded-md p-6 shadow-soft">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Commande</p>
                <h1 className="font-display text-2xl">#{order.order_number}</h1>
                <p className="text-xs text-muted-foreground mt-1">Passée le {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
              <span className={`text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
            </div>
          </header>

          <div className="bg-card border border-border rounded-md p-6">
            <h2 className="font-display text-xl mb-6">Suivi</h2>
            <ol className="space-y-5">
              {STATUS_STEPS.map((s, i) => {
                const done = i < currentIdx || order.status === "delivered";
                const active = i === currentIdx && order.status !== "delivered";
                const event = order.timeline?.find(t => t.status === s.key);
                return (
                  <li key={s.key} className="flex gap-4">
                    <span className={`h-8 w-8 rounded-full inline-flex items-center justify-center text-xs font-semibold shrink-0 ${done ? "bg-gradient-gold text-secondary" : active ? "border-2 border-primary text-primary" : "bg-muted text-muted-foreground"}`}>
                      {done ? <CheckCircle2 className="h-4 w-4"/> : i + 1}
                    </span>
                    <div>
                      <p className={`font-display text-base ${!done && !active ? "text-muted-foreground" : ""}`}>{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                      {event && <p className="text-[11px] text-muted-foreground mt-0.5">{new Date(event.at).toLocaleString("fr-FR")}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="bg-card border border-border rounded-md p-6">
            <h2 className="font-display text-xl mb-4">Articles ({items.length})</h2>
            <ul className="divide-y divide-border">
              {items.map(it => (
                <li key={it.id} className="py-4 flex gap-4">
                  {it.product_image && <img src={it.product_image} alt={it.product_name} className="h-20 w-20 object-cover rounded-sm shrink-0"/>}
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-base">{it.product_name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {[it.options?.color, it.options?.length, it.options?.density].filter(Boolean).join(" · ") || "—"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Quantité : {it.quantity} · {formatFCFA(it.unit_price)} l'unité</p>
                  </div>
                  <span className="font-display text-base shrink-0" style={{color:"var(--gold-dark)"}}>{formatFCFA(it.line_total)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-border space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{formatFCFA(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-[#0a7c3a]"><span>Remise</span><span>− {formatFCFA(order.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Livraison ({order.shipping_method ? SHIPPING_LABELS[order.shipping_method] : "—"})</span><span>{order.shipping_cost === 0 ? "Gratuit" : formatFCFA(order.shipping_cost)}</span></div>
              <div className="flex items-baseline justify-between pt-2 border-t border-border">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Total</span>
                <span className="font-display text-2xl" style={{color:"var(--gold-dark)"}}>{formatFCFA(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-md p-6">
              <h3 className="font-display text-lg mb-3">Livraison</h3>
              <dl className="text-sm space-y-1.5">
                <Row label="Destinataire" value={order.customer_name ?? "—"}/>
                <Row label="WhatsApp" value={order.customer_whatsapp ?? "—"}/>
                <Row label="Ville" value={order.city ?? "—"}/>
                <Row label="Adresse" value={order.address ?? "—"}/>
              </dl>
            </div>
            <div className="bg-card border border-border rounded-md p-6">
              <h3 className="font-display text-lg mb-3">Paiement</h3>
              <dl className="text-sm space-y-1.5">
                <Row label="Mode" value={paymentLabel(order.payment_method)}/>
                {order.note && <Row label="Note" value={order.note}/>}
              </dl>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">Besoin d'aide ?</p>
            <a href={`https://wa.me/237693881451?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-sm hover:opacity-90 transition">
              <MessageCircle className="h-5 w-5"/> Contacter Main d'or Beauty
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
      <dt className="text-xs uppercase tracking-widest text-muted-foreground w-28 shrink-0">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}