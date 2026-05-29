import jsPDF from "jspdf";
import { formatFCFA } from "@/data/products";
import { SHIPPING_LABELS, type ShippingMethod } from "@/context/CartContext";
import { STATUS_LABELS, type OrderStatus } from "@/lib/orders";

const paymentLabel = (p: string | null) => {
  switch (p) {
    case "mtn": return "MTN Mobile Money";
    case "orange": return "Orange Money";
    case "cod": return "Paiement a la livraison";
    case "whatsapp": return "Paiement via WhatsApp";
    default: return p ?? "-";
  }
};

export type InvoiceOrder = {
  order_number: string;
  status: OrderStatus;
  created_at: string;
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
};

export type InvoiceItem = {
  product_name: string;
  options: { color?: string | null; length?: string | null; density?: string | null };
  unit_price: number;
  quantity: number;
  line_total: number;
};

// Strip diacritics + non-latin1 chars for built-in PDF fonts
const s = (v: string | number | null | undefined) =>
  String(v ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "");

export function generateInvoicePDF(order: InvoiceOrder, items: InvoiceItem[]) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 18;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(180, 140, 50);
  doc.text("Main d'or Beauty", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("Douala, Cameroun  -  WhatsApp : +237 693 88 14 51", margin, y + 5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(20);
  doc.text("RECU / FACTURE", pageW - margin, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`No ${s(order.order_number)}`, pageW - margin, y + 5, { align: "right" });
  doc.text(
    new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    pageW - margin, y + 10, { align: "right" }
  );
  doc.text(`Statut : ${s(STATUS_LABELS[order.status])}`, pageW - margin, y + 15, { align: "right" });

  y += 28;
  doc.setDrawColor(200);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Customer / Delivery block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text("Livraison", margin, y);
  doc.text("Paiement", pageW / 2 + 5, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60);

  const left = [
    s(order.customer_name),
    s(order.customer_whatsapp),
    s(order.city),
    s(order.address),
  ].filter(Boolean);
  const right = [
    `Mode : ${s(paymentLabel(order.payment_method))}`,
    `Livraison : ${s(order.shipping_method ? SHIPPING_LABELS[order.shipping_method] : "-")}`,
  ];
  const rowsCount = Math.max(left.length, right.length);
  for (let i = 0; i < rowsCount; i++) {
    if (left[i]) doc.text(left[i], margin, y + i * 5);
    if (right[i]) doc.text(right[i], pageW / 2 + 5, y + i * 5);
  }
  y += rowsCount * 5 + 6;

  if (order.note) {
    doc.setFont("helvetica", "italic");
    doc.text(`Note : ${s(order.note)}`, margin, y);
    y += 6;
  }

  // Items table
  y += 4;
  doc.setFillColor(245, 240, 225);
  doc.rect(margin, y - 5, pageW - margin * 2, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20);
  doc.text("Article", margin + 2, y);
  doc.text("Qte", pageW - margin - 55, y, { align: "right" });
  doc.text("PU", pageW - margin - 30, y, { align: "right" });
  doc.text("Total", pageW - margin - 2, y, { align: "right" });
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(40);

  items.forEach((it) => {
    if (y > 260) { doc.addPage(); y = 20; }
    const opts = [it.options?.color, it.options?.length, it.options?.density].filter(Boolean).join(" - ");
    const nameLines = doc.splitTextToSize(s(it.product_name), pageW - margin * 2 - 70);
    doc.text(nameLines, margin + 2, y);
    if (opts) {
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(s(opts), margin + 2, y + nameLines.length * 4.5);
      doc.setFontSize(10);
      doc.setTextColor(40);
    }
    doc.text(String(it.quantity), pageW - margin - 55, y, { align: "right" });
    doc.text(s(formatFCFA(it.unit_price)), pageW - margin - 30, y, { align: "right" });
    doc.text(s(formatFCFA(it.line_total)), pageW - margin - 2, y, { align: "right" });
    y += nameLines.length * 4.5 + (opts ? 5 : 3) + 4;
    doc.setDrawColor(230);
    doc.line(margin, y - 2, pageW - margin, y - 2);
  });

  // Totals
  if (y > 240) { doc.addPage(); y = 20; }
  y += 4;
  const totalsX = pageW - margin - 60;
  const valX = pageW - margin - 2;
  const row = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 12 : 10);
    doc.text(label, totalsX, y);
    doc.text(value, valX, y, { align: "right" });
    y += bold ? 8 : 6;
  };
  row("Sous-total", s(formatFCFA(order.subtotal)));
  if (order.discount > 0) row("Remise", `- ${s(formatFCFA(order.discount))}`);
  row("Livraison", order.shipping_cost === 0 ? "Gratuit" : s(formatFCFA(order.shipping_cost)));
  doc.setDrawColor(180, 140, 50);
  doc.line(totalsX, y - 2, valX, y - 2);
  y += 2;
  doc.setTextColor(180, 140, 50);
  row("TOTAL", s(formatFCFA(order.total)), true);
  doc.setTextColor(40);

  // Footer
  const footY = doc.internal.pageSize.getHeight() - 15;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(140);
  doc.text("Merci de votre confiance - Main d'or Beauty", pageW / 2, footY, { align: "center" });

  doc.save(`Facture-${s(order.order_number)}.pdf`);
}