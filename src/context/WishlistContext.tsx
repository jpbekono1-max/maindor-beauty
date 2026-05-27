import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type WishlistContextValue = {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => boolean; // returns new state
  remove: (slug: string) => void;
  clear: () => void;
  count: number;
};

const Ctx = createContext<WishlistContextValue | null>(null);
const KEY = "mdb_wishlist_v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSlugs(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(KEY, JSON.stringify(slugs)); } catch {}
  }, [slugs, hydrated]);

  const value = useMemo<WishlistContextValue>(() => ({
    slugs,
    has: (slug) => slugs.includes(slug),
    toggle: (slug) => {
      let next = false;
      setSlugs(prev => {
        if (prev.includes(slug)) return prev.filter(s => s !== slug);
        next = true;
        return [...prev, slug];
      });
      return next;
    },
    remove: (slug) => setSlugs(prev => prev.filter(s => s !== slug)),
    clear: () => setSlugs([]),
    count: slugs.length,
  }), [slugs]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}