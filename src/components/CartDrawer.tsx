'use client';

import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { buildWhatsAppCheckoutUrl, formatRupiah, formatWaDisplay } from '@/lib/utils';
import { ProductArtwork } from './ProductArtwork';

export function CartDrawer() {
  const {
    items,
    isOpen,
    totalItems,
    subtotal,
    settings,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerNote, setBuyerNote] = useState('');

  // Tutup dengan tombol Escape & kunci scroll layar belakang saat drawer terbuka
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    const checkoutUrl = buildWhatsAppCheckoutUrl({
      settings,
      items,
      buyerName,
      buyerAddress,
      buyerNote,
    });
    window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Keranjang Belanja KWT Lestari"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/50 backdrop-blur-[2px] transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 animate-slide-left">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 bg-cream-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-leaf-100 text-leaf-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900">
                  Keranjang Belanja
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-leaf-600 text-white">
                  {totalItems} item
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Pesanan langsung diteruskan ke WhatsApp Admin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Tutup Keranjang"
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-cream-100 border border-stone-200 flex items-center justify-center mb-4">
              <ShoppingBag className="w-9 h-9 text-stone-400 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-bold text-stone-800">
              Keranjang Belanja Masih Kosong
            </h3>
            <p className="mt-1.5 text-sm text-stone-500 max-w-xs leading-relaxed">
              Pilih olahan hasil tani segar dari ibu-ibu KWT Lestari seperti keripik pisang, singkong, atau sambal.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-leaf-600 hover:bg-leaf-700 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              Mulai Pilih Produk
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-2xl bg-cream-50/70 border border-stone-200/80 flex gap-3.5 items-start hover:border-leaf-300/80 transition-colors"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-stone-200/80 shrink-0 bg-white">
                    <ProductArtwork product={product} size="thumb" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {formatRupiah(product.price)}
                          {product.weight ? ` • ${product.weight}` : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        aria-label={`Hapus ${product.name}`}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      {/* Stepper Kuantitas */}
                      <div className="inline-flex items-center rounded-xl border border-stone-200 bg-white p-0.5 shadow-sm">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Kurangi jumlah"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 active:scale-95 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-stone-900">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label="Tambah jumlah"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-leaf-700 hover:bg-leaf-50 active:scale-95 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-leaf-800">
                        {formatRupiah(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Opsional: Info Pengiriman / Nama Pemesan */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowBuyerForm((v) => !v)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200/80 text-xs font-semibold text-stone-700 transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <UserRound className="w-3.5 h-3.5 text-leaf-600" />
                    Tambahkan Nama & Catatan Pengiriman (Opsional)
                  </span>
                  {showBuyerForm ? (
                    <ChevronUp className="w-4 h-4 text-stone-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-500" />
                  )}
                </button>

                {showBuyerForm && (
                  <div className="mt-2.5 p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Nama Pemesan
                      </label>
                      <input
                        type="text"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Contoh: Ibu Sari"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-leaf-500/30 focus:border-leaf-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Alamat / Desa Tujuan
                      </label>
                      <input
                        type="text"
                        value={buyerAddress}
                        onChange={(e) => setBuyerAddress(e.target.value)}
                        placeholder="Contoh: Jl. Poros Sumber Makmur RT 02"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-leaf-500/30 focus:border-leaf-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Catatan Pesanan
                      </label>
                      <input
                        type="text"
                        value={buyerNote}
                        onChange={(e) => setBuyerNote(e.target.value)}
                        placeholder="Contoh: Ambil langsung sore hari / kirim kurir"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-leaf-500/30 focus:border-leaf-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Checkout */}
            <div className="p-5 bg-cream-50 border-t border-stone-200 space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Total Barang</span>
                  <span>{totalItems} bungkus/item</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-stone-700">
                    Subtotal Pesanan
                  </span>
                  <span className="text-lg font-extrabold text-stone-900">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Tujuan pesanan:{' '}
                  <strong className="text-stone-700">
                    WhatsApp Admin ({formatWaDisplay(settings.wa_number)})
                  </strong>
                </p>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                className="w-full py-3.5 px-4 rounded-2xl bg-leaf-600 hover:bg-leaf-700 active:scale-[0.99] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5"
              >
                <MessageCircle className="w-5 h-5 fill-white/15" />
                <span>Checkout & Pesan via WhatsApp</span>
              </button>

              <div className="flex items-center justify-between pt-0.5">
                <button
                  type="button"
                  onClick={closeCart}
                  className="text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
                >
                  ← Tambah Produk Lain
                </button>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-medium text-red-600/80 hover:text-red-700 transition-colors"
                >
                  Kosongkan Keranjang
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
