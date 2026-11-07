import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { ProductDTO } from "@/types";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number; // KSh, display only. The server re-checks prices at checkout.
  image: string | null;
  qty: number;
}

const STORAGE_KEY = "jnb-cart-v1";
const MAX_QTY = 99;

type Action =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; item: Omit<CartItem, "qty">; qty: number }
  | { type: "setQty"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" };

const clamp = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.floor(n)));

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "hydrate":
      return action.items;
    case "add": {
      const existing = state.find((i) => i.id === action.item.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.item.id ? { ...i, qty: clamp(i.qty + action.qty) } : i,
        );
      }
      return [...state, { ...action.item, qty: clamp(action.qty) }];
    }
    case "setQty":
      if (action.qty <= 0) return state.filter((i) => i.id !== action.id);
      return state.map((i) => (i.id === action.id ? { ...i, qty: clamp(action.qty) } : i));
    case "remove":
      return state.filter((i) => i.id !== action.id);
    case "clear":
      return [];
  }
}

function isCartItem(x: unknown): x is CartItem {
  if (typeof x !== "object" || x === null) return false;
  const i = x as Record<string, unknown>;
  return (
    typeof i.id === "string" &&
    typeof i.slug === "string" &&
    typeof i.name === "string" &&
    typeof i.brand === "string" &&
    typeof i.price === "number" &&
    typeof i.qty === "number" &&
    i.qty >= 1 &&
    (typeof i.image === "string" || i.image === null)
  );
}

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number; // total units
  subtotal: number; // KSh
  hydrated: boolean; // false until the saved cart has been read in the browser
  addItem: (product: ProductDTO, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [hydrated, setHydrated] = useState(false);

  // Read the saved cart once in the browser (not during server rendering),
  // and keep multiple tabs in sync.
  useEffect(() => {
    dispatch({ type: "hydrate", items: readStorage() });
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) dispatch({ type: "hydrate", items: readStorage() });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Save on every change, but only after the first read so we never wipe a saved cart.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or blocked: the cart still works for this visit */
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      hydrated,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.qty, 0),
      addItem: (product, qty = 1) => {
        const primary = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
        dispatch({
          type: "add",
          qty,
          item: {
            id: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: primary?.url ?? null,
          },
        });
      },
      setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
      removeItem: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [items, hydrated],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}