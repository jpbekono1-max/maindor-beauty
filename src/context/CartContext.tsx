import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  color?: string;
  length?: string;
  density?: string;
};

export type ShippingMethod = "yaounde" | "autres" | "retrait";
export const SHIPPING_RATES: Record<ShippingMethod, number> = {
  yaounde: 2000,
  autres: 5000,
  retrait: 0,
};
export const SHIPPING_LABELS: Record<ShippingMethod, string> = {
  yaounde: "Livraison Yaoundé",
  autres: "Livraison hors Yaoundé",
  retrait: "Retrait en salon",
};

export type PromoCode = {
  code: string;
  label: string;
  amount: number; // computed discount in FCFA
};

type CartContextValue = {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  addItem: (item: Omit<CartItem, "id"> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  total: number;
  shipping: ShippingMethod;
  setShipping: (m: ShippingMethod) => void;
  shippingCost: number;
  promo: PromoCode | null;
  applyPromo: (code: string) => { ok: boolean; message: string };
  clearPromo: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mdb_cart_v1";
const SHIP_KEY = "mdb_ship_v1";
const PROMO_KEY = "mdb_promo_v1";

const buildId = (i: Pick<CartItem, "slug" | "color" | "length" | "density">) =>
  `${i.slug}::${i.color ?? ""}::${i.length ?? ""}::${i.density ?? ""}`;

function computePromo(code: string, items: CartItem[], subtotal: number): PromoCode | null {
  const c = code.trim().toUpperCase();
  if (!c) return null;
  if (c === "BIENVENUE10") {
    return { code: c, label: "-10% bienvenue", amount: Math.round(subtotal * 0.1) };
  }
  if (c === "MARIAGE2025") {
    const bridalSubtotal = items
      .filter(i => /bridal|mariage/i.test(i.slug) || /bridal|mariage/i.test(i.name))
      .reduce((s, i) => s + i.price * i.qty, 0);
    if (bridalSubtotal === 0) return null;
    return { code: c, label: "-15% mariage", amount: Math.round(bridalSubtotal * 0.15) };
  }
  if (c === "FORMATION50") {
    if (subtotal < 50000) return null;
    return { code: c, label: "-50 000 FCFA formation", amount: 50000 };
  }
  return null;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [shipping, setShipping] = useState<ShippingMethod>("yaounde");
  const [promoCodeStr, setPromoCodeStr] = useState<string>("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      const ship = localStorage.getItem(SHIP_KEY) as ShippingMethod | null;
      if (ship && ship in SHIPPING_RATES) setShipping(ship);
      const promo = localStorage.getItem(PROMO_KEY);
      if (promo) setPromoCodeStr(promo);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(SHIP_KEY, shipping); } catch {}
  }, [shipping, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(PROMO_KEY, promoCodeStr); } catch {}
  }, [promoCodeStr, hydrated]);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.qty * i.price, 0), [items]);
  const promo = useMemo(() => computePromo(promoCodeStr, items, subtotal), [promoCodeStr, items, subtotal]);
  const shippingCost = items.length === 0 ? 0 : SHIPPING_RATES[shipping];
  const total = Math.max(0, subtotal - (promo?.amount ?? 0)) + shippingCost;

  const value = useMemo<CartContextValue>(() => ({
    items,
    open,
    setOpen,
    addItem: (input) => {
      const id = input.id ?? buildId(input);
      setItems(prev => {
        const idx = prev.findIndex(p => p.id === id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + input.qty };
          return next;
        }
        return [...prev, { ...input, id }];
      });
      setOpen(true);
    },
    removeItem: (id) => setItems(prev => prev.filter(i => i.id !== id)),
    updateQty: (id, qty) => setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    clear: () => { setItems([]); setPromoCodeStr(""); },
    count: items.reduce((s, i) => s + i.qty, 0),
    subtotal,
    total,
    shipping,
    setShipping,
    shippingCost,
    promo,
    applyPromo: (code) => {
      const result = computePromo(code, items, subtotal);
      if (!result) {
        return { ok: false, message: "Code invalide ou expiré" };
      }
      setPromoCodeStr(result.code);
      return { ok: true, message: `Code "${result.code}" appliqué — ${result.label}` };
    },
    clearPromo: () => setPromoCodeStr(""),
  }), [items, open, subtotal, total, shipping, shippingCost, promo]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}