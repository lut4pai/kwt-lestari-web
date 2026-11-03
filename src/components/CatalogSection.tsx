'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  HeartHandshake,
  MessageSquareText,
  Plus,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Product } from '@/types';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { formatRupiah } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { ProductArtwork } from './ProductArtwork';

interface CatalogSectionProps {
  initialProducts: Product[];
}

export function CatalogSection({ initialProducts }: CatalogSectionProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { items, addItem, setSettingsState, syncCatalogProducts } = useCart();

  // Fungsi refresh data katalog real-time dari server
  const refreshStore = useCallback(async () => {
    try {
      const res = await fetch('/api/store', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.products)) {
        setProducts(data.products);
        syncCatalogProducts(data.products);
      }
      if (data.settings) {
        setSettingsState(data.settings);
      }
    } catch {
      // Gunakan data terakhir bila koneksi terputus sementara
    }
  }, [setSettingsState, syncCatalogProducts]);

  // Langganan Supabase Realtime + sinkronisasi saat tab aktif kembali
  useEffect(() => {
    const channel = supabaseBrowser
      .channel('public-products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          refreshStore();
        }
      )
      .subscribe();

    const onFocus = () => refreshStore();
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('focus', onFocus);
      supabaseBrowser.removeChannel(channel);
    };
  }, [refreshStore]);

  // Jumlah tiap item yang sudah ada di keranjang
  const cartQtyMap = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item) => map.set(item.product.id, item.quantity));
    return map;
  }, [items]);

  const categories = useMemo(() => {
    const dynamicCats = new Set<string>(PRODUCT_CATEGORIES);
    products.forEach((p) => {
      if (p.category?.trim()) dynamicCats.add(p.category.trim());
    });
    return Array.from(dynamicCats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === 'Semua' ||
        (product.category || 'Keripik').toLowerCase() ===
          selectedCategory.toLowerCase();
      const matchSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        (product.category || '').toLowerCase().includes(q) ||
        (product.description || '').toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <section id="katalog" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header Etalase + Pencarian */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-leaf-700 block">
            ETALASE OLAHAN TANI
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Daftar Produk Segar & Renyah
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-500">
            Stok diperbarui langsung dari dapur produksi ibu-ibu KWT Lestari Desa Sumber Makmur.
          </p>
        </div>

        {/* Input Pencarian */}
        <div className="relative w-full md:w-72 lg:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari keripik, sambal..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-leaf-500/25 focus:border-leaf-500 transition"
          />
        </div>
      </div>

      {/* Filter Kategori */}
      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                active
                  ? 'bg-leaf-600 text-white border-leaf-600 shadow-sm'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-leaf-300 hover:text-leaf-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid Produk Mobile-First: 2 Kolom Ponsel & 4 Kolom Desktop */}
      {filteredProducts.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-stone-300 bg-cream-50/70 px-6 py-14 text-center">
          <p className="text-base font-bold text-stone-800">
            Produk tidak ditemukan
          </p>
          <p className="mt-1 text-xs sm:text-sm text-stone-500">
            Coba kata kunci lain atau pilih kategori &ldquo;Semua&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Semua');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-leaf-600 hover:bg-leaf-700 text-white text-xs font-semibold transition-colors"
          >
            Tampilkan Semua Produk
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filteredProducts.map((product) => {
            const qtyInCart = cartQtyMap.get(product.id) || 0;
            const available = product.is_available;

            return (
              <article
                key={product.id}
                className={`group bg-white rounded-2xl border border-stone-200/85 overflow-hidden flex flex-col shadow-card hover:shadow-soft transition-all duration-300 ${
                  available
                    ? 'hover:border-leaf-300 hover:-translate-y-0.5'
                    : 'opacity-75'
                }`}
              >
                {/* Area Gambar Produk */}
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="relative aspect-[4/3.6] sm:aspect-[4/3.5] bg-stone-100 overflow-hidden cursor-pointer"
                >
                  <ProductArtwork product={product} size="card" />

                  {/* Badge Berat / Kategori Kiri Atas */}
                  {(product.weight || product.category) && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] sm:text-[11px] font-bold text-stone-700 shadow-sm border border-stone-200/60">
                      {product.weight || product.category}
                    </span>
                  )}

                  {/* Quick View Hint di Desktop */}
                  <button
                    type="button"
                    aria-label={`Detail ${product.name}`}
                    className="hidden sm:flex absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-stone-700 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-leaf-700"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Overlay apabila Stok Habis */}
                  {!available && (
                    <div className="absolute inset-0 bg-stone-900/45 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="px-3 py-1 rounded-full bg-stone-900/90 text-white text-xs font-bold tracking-wide">
                        Stok Habis
                      </span>
                    </div>
                  )}
                </div>

                {/* Body Kartu Produk */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-leaf-700 truncate">
                        KWT LESTARI
                      </span>
                      {product.category && (
                        <span className="text-[9px] sm:text-[10px] font-medium text-stone-400 truncate">
                          {product.category}
                        </span>
                      )}
                    </div>
                    <h3
                      onClick={() => setSelectedProduct(product)}
                      className="mt-1 text-xs sm:text-[15px] font-bold text-stone-900 leading-snug line-clamp-2 cursor-pointer group-hover:text-leaf-800 transition-colors min-h-[2.25rem] sm:min-h-[2.6rem]"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-3 pt-2.5 sm:pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div>
                      <span className="block text-[10px] text-stone-400 leading-none">
                        Harga
                      </span>
                      <span className="mt-0.5 block text-sm sm:text-base font-extrabold text-stone-900 tracking-tight">
                        {formatRupiah(product.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={!available}
                      onClick={() => addItem(product, 1)}
                      className={`inline-flex items-center justify-center gap-1 px-3 sm:px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                        available
                          ? 'bg-leaf-600 hover:bg-leaf-700 text-white shadow-sm'
                          : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      {available ? (
                        <>
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>
                            Pesan{qtyInCart > 0 ? ` (${qtyInCart})` : ''}
                          </span>
                        </>
                      ) : (
                        <span>Habis</span>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 3 Kartu Keunggulan Utama (Sesuai Referensi Stitch) */}
      <div className="mt-14 pt-10 border-t border-stone-200/80 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-card flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-leaf-50 border border-leaf-100 text-leaf-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Tanpa Pengawet Buatan
            </h3>
            <p className="mt-1 text-xs text-stone-500 leading-relaxed">
              Diproduksi higienis dengan bahan hasil panen segar dan resep alami warisan keluarga desa.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-card flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-leaf-50 border border-leaf-100 text-leaf-700 flex items-center justify-center shrink-0">
            <MessageSquareText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Order WhatsApp Fleksibel
            </h3>
            <p className="mt-1 text-xs text-stone-500 leading-relaxed">
              Format pesanan otomatis terkirim rapi ke WhatsApp pengurus, mudah konsultasi ongkir langsung.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-card flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-leaf-50 border border-leaf-100 text-leaf-700 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Pemberdayaan Ibu Tani
            </h3>
            <p className="mt-1 text-xs text-stone-500 leading-relaxed">
              100% hasil penjualan mendukung kemandirian ekonomi anggota KWT Lestari Desa Sumber Makmur.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Detail Produk Cepat */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-stone-950/55 backdrop-blur-[2px]"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 animate-fade-in">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Tutup detail produk"
              className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-md"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-[16/11] bg-stone-100 relative overflow-hidden">
              <ProductArtwork product={selectedProduct} size="modal" />
              {selectedProduct.weight && (
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/95 text-xs font-bold text-stone-800 shadow-sm">
                  Kemasan {selectedProduct.weight}
                </span>
              )}
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-leaf-700 uppercase tracking-wider">
                  <span>KWT LESTARI</span>
                  {selectedProduct.category && (
                    <>
                      <span>•</span>
                      <span>{selectedProduct.category}</span>
                    </>
                  )}
                </div>
                <h3 className="mt-1 text-xl font-extrabold text-stone-900">
                  {selectedProduct.name}
                </h3>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                  {selectedProduct.description?.trim() ||
                    'Produk olahan hasil tani segar karya ibu-ibu Kelompok Wanita Tani (KWT) Lestari Desa Sumber Makmur. Diproses secara higienis tanpa bahan pengawet buatan.'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-leaf-800 bg-leaf-50 border border-leaf-100 px-3.5 py-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-leaf-600 shrink-0" />
                <span>Diproduksi langsung oleh KWT Lestari Desa Sumber Makmur</span>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-stone-400 block">Harga Satuan</span>
                  <span className="text-xl font-extrabold text-stone-900">
                    {formatRupiah(selectedProduct.price)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={!selectedProduct.is_available}
                  onClick={() => {
                    addItem(selectedProduct, 1);
                    setSelectedProduct(null);
                  }}
                  className={`px-5 py-3 rounded-2xl text-sm font-bold inline-flex items-center gap-2 transition-all ${
                    selectedProduct.is_available
                      ? 'bg-leaf-600 hover:bg-leaf-700 text-white shadow-md'
                      : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {selectedProduct.is_available
                      ? 'Masukkan Keranjang'
                      : 'Stok Habis'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
