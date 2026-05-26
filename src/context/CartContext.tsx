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

type CartContextValue = {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  addItem: (item: Omit<CartItem, "id"> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mdb_cart_v1";

const buildId = (i: Pick<CartItem, "slug" | "color" | "length" | "density">) =>
  `${i.slug}::${i.color ?? ""}::${i.length ?? ""}::${i.density ?? ""}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

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
    clear: () => setItems([]),
    count: items.reduce((s, i) => s + i.qty, 0),
    total: items.reduce((s, i) => s + i.qty * i.price, 0),
  }), [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}