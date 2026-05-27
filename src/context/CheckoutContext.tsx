import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CustomerInfo = {
  fullName: string;
  whatsapp: string;
  email: string;
  city: string;
  address: string;
  note: string;
};

export type PaymentMethod = "mtn" | "orange" | "cod" | "whatsapp";

export type CheckoutState = {
  customer: CustomerInfo;
  payment: PaymentMethod;
  paymentNumber: string;
  orderNumber?: string;
};

const empty: CheckoutState = {
  customer: { fullName: "", whatsapp: "", email: "", city: "Yaoundé", address: "", note: "" },
  payment: "mtn",
  paymentNumber: "",
};

type Ctx = {
  state: CheckoutState;
  setCustomer: (c: Partial<CustomerInfo>) => void;
  setPayment: (p: PaymentMethod) => void;
  setPaymentNumber: (n: string) => void;
  setOrderNumber: (n: string) => void;
  reset: () => void;
};

const CheckoutCtx = createContext<Ctx | null>(null);
const KEY = "mdb_checkout_v1";

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CheckoutState>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setState({ ...empty, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state, hydrated]);

  const value = useMemo<Ctx>(() => ({
    state,
    setCustomer: (c) => setState(prev => ({ ...prev, customer: { ...prev.customer, ...c } })),
    setPayment: (p) => setState(prev => ({ ...prev, payment: p })),
    setPaymentNumber: (n) => setState(prev => ({ ...prev, paymentNumber: n })),
    setOrderNumber: (n) => setState(prev => ({ ...prev, orderNumber: n })),
    reset: () => { setState(empty); try { sessionStorage.removeItem(KEY); } catch {} },
  }), [state]);

  return <CheckoutCtx.Provider value={value}>{children}</CheckoutCtx.Provider>;
}

export function useCheckout() {
  const ctx = useContext(CheckoutCtx);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}

export function generateOrderNumber() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `MD-${new Date().getFullYear()}-${n}`;
}

export function formatWhatsapp(input: string) {
  // Keep digits and leading +
  let v = input.replace(/[^\d+]/g, "");
  if (!v.startsWith("+")) {
    if (v.startsWith("237")) v = "+" + v;
    else if (v.length > 0) v = "+237" + v.replace(/^0+/, "");
  }
  // +237 XXX XXX XXX
  const digits = v.replace(/[^\d]/g, "");
  if (digits.startsWith("237")) {
    const rest = digits.slice(3);
    const parts = [rest.slice(0, 3), rest.slice(3, 6), rest.slice(6, 9)].filter(Boolean);
    return "+237 " + parts.join(" ");
  }
  return v;
}

export function isValidWhatsapp(input: string) {
  const digits = input.replace(/[^\d]/g, "");
  return digits.startsWith("237") && digits.length === 12;
}