'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CartItem, Product, StoreSettings } from '@/types';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants';
import { supabaseBrowser } from '@/lib/supabase-browser';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  settings: StoreSettings;
  toastMessage: string | null;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setSettingsState: (settings: StoreSettings) => void;
  syncCatalogProducts: (products: Product[]) => void;
}

const STORAGE_KEY = 'kwt_lestari_cart_v1';

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: StoreSettings;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>(
    initialSettings || DEFAULT_STORE_SETTINGS
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Muat keranjang dari localStorage saat pertama kali di-mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (entry) =>
                entry &&
                entry.product &&
                typeof entry.product.id === 'string' &&
                Number(entry.quantity) > 0
            )
          );
        }
      }
    } catch {
      // Abaikan apabila localStorage kosong/rusak
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Simpan keranjang ke localStorage setiap kali berubah
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Abaikan kuota penyimpanan penuh
    }
  }, [items, isHydrated]);

  // Sinkronkan pengaturan toko terbaru dari API & Realtime Supabase
  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data?.settings) {
          setSettings(data.settings);
        }
      }
    } catch {
      // Gunakan state terakhir bila offline sementara
    }
  }, []);

  useEffect(() => {
    refreshSettings();

    const channel = supabaseBrowser
      .channel('public-store-settings-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'store_settings' },
        () => {
          refreshSettings();
        }
      )
      .subscribe();

    const handleFocus = () => refreshSettings();
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      supabaseBrowser.removeChannel(channel);
    };
  }, [refreshSettings]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      if (!product.is_available) return;
      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.product.id === product.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            product,
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }
        return [...prev, { product, quantity }];
      });
      showToast(`"${product.name}" ditambahkan ke keranjang`);
    },
    [showToast]
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const setSettingsState = useCallback((nextSettings: StoreSettings) => {
    setSettings(nextSettings);
  }, []);

  const syncCatalogProducts = useCallback((latestProducts: Product[]) => {
    if (!latestProducts || latestProducts.length === 0) return;
    const map = new Map(latestProducts.map((p) => [p.id, p]));
    setItems((prev) =>
      prev
        .map((item) => {
          const fresh = map.get(item.product.id);
          if (!fresh) return item;
          return { ...item, product: fresh };
        })
        .filter((item) => item.product.is_available)
    );
  }, []);

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (acc, item) => acc + Number(item.product.price) * item.quantity,
        0
      ),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      totalItems,
      subtotal,
      settings,
      toastMessage,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      setSettingsState,
      syncCatalogProducts,
    }),
    [
      items,
      isOpen,
      totalItems,
      subtotal,
      settings,
      toastMessage,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      setSettingsState,
      syncCatalogProducts,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Notifikasi mengambang saat produk masuk keranjang */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 w-full max-w-sm">
          <div className="bg-stone-900/95 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center justify-between gap-3 backdrop-blur-md animate-fade-in">
            <span className="truncate">🌿 {toastMessage}</span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return ctx;
}
