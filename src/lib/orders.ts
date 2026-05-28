import { supabase } from "@/integrations/supabase/client";
import type { CartItem, ShippingMethod } from "@/context/CartContext";
import type { CustomerInfo, PaymentMethod } from "@/context/CheckoutContext";

export type OrderStatus = "received" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";

export const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: "received", label: "Commande reçue", desc: "Votre demande est enregistrée" },
  { key: "confirmed", label: "Commande confirmée", desc: "Notre équipe a validé votre commande" },
  { key: "preparing", label: "En préparation", desc: "Votre commande est en cours de préparation" },
  { key: "shipped", label: "Expédiée / En route", desc: "Votre commande a été remise au livreur" },
  { key: "delivered", label: "Livrée", desc: "Commande livrée avec succès" },
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  received: "Reçue",
  confirmed: "Confirmée",
  preparing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  received: "bg-muted text-foreground",
  confirmed: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  preparing: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  shipped: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  delivered: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  cancelled: "bg-destructive/10 text-destructive",
};

export function generateOrderNumber() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `MD-${new Date().getFullYear()}-${n}`;
}

export type CreateOrderInput = {
  userId: string;
  items: CartItem[];
  customer: CustomerInfo;
  payment: PaymentMethod;
  shipping: ShippingMethod;
  shippingCost: number;
  subtotal: number;
  discount: number;
  total: number;
};

export async function createOrder(input: CreateOrderInput): Promise<{ orderNumber: string; id: string }> {
  const orderNumber = generateOrderNumber();
  const now = new Date().toISOString();
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: input.userId,
      order_number: orderNumber,
      status: "received",
      subtotal: input.subtotal,
      shipping_cost: input.shippingCost,
      discount: input.discount,
      total: input.total,
      shipping_method: input.shipping,
      city: input.customer.city,
      address: input.customer.address,
      customer_name: input.customer.fullName,
      customer_whatsapp: input.customer.whatsapp,
      payment_method: input.payment,
      note: input.customer.note || null,
      timeline: [{ status: "received", at: now }],
    })
    .select("id, order_number")
    .single();
  if (error || !order) throw new Error(error?.message ?? "Erreur création commande");

  const itemsPayload = input.items.map(i => ({
    order_id: order.id,
    product_slug: i.slug,
    product_name: i.name,
    product_image: i.image,
    options: { color: i.color ?? null, length: i.length ?? null, density: i.density ?? null },
    unit_price: i.price,
    quantity: i.qty,
    line_total: i.price * i.qty,
  }));
  const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload);
  if (itemsErr) throw new Error(itemsErr.message);

  return { orderNumber: order.order_number, id: order.id };
}