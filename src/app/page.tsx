import React from 'react';
import Link from 'next/link';
import { HelpCircle, Leaf, MapPin, ShoppingBag } from 'lucide-react';
import { getStorePayload } from '@/lib/data-service';
import { KWT_INFO } from '@/lib/constants';
import { CatalogSection } from '@/components/CatalogSection';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const { products } = await getStorePayload();

  return (
    <div>
      {/* Hero Section (Disempurnakan dari Referensi Stitch) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-leaf-50/90 via-cream-50/70 to-white border-b border-stone-200/75">
        {/* Aksen lingkaran lembut di latar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-leaf-200/25 blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Kolom Teks Utama */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf-100/90 border border-leaf-200 text-leaf-800 text-xs font-bold tracking-wide">
                <Leaf className="w-3.5 h-3.5 text-leaf-600" />
                <span>100% Bahan Tani Lokal Berkualitas</span>
              </div>

              <h1 className="mt-5 text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-stone-900 tracking-tight leading-[1.12]">
                Hasil Tani Olahan Asli Desa.
                <span className="block text-leaf-700 mt-1">
                  Langsung dari pembuatnya.
                </span>
              </h1>

              <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-stone-600 leading-relaxed max-w-2xl">
                Dukung kemandirian pangan ibu-ibu{' '}
                <strong className="font-semibold text-stone-800">
                  {KWT_INFO.name} {KWT_INFO.village}
                </strong>
                . Setiap pembelian langsung terhubung ke WhatsApp pengurus untuk konfirmasi dan pengiriman cepat & aman.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#katalog"
                  className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-leaf-700 hover:bg-leaf-800 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Pilih Produk Sekarang</span>
                </a>

                <Link
                  href="/tentang-kami#cara-pemesanan"
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-cream-100 text-stone-800 border border-stone-200/90 text-xs sm:text-sm font-semibold shadow-sm transition-all"
                >
                  <HelpCircle className="w-4 h-4 text-stone-500" />
                  <span>Cara Pemesanan</span>
                </Link>
              </div>
            </div>

            {/* Kolom Emblem Resmi KWT Lestari */}
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <div className="w-full sm:max-w-xs bg-white/90 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border border-leaf-200/70 shadow-soft flex sm:flex-col items-center sm:text-center gap-4">
                <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-cream-50 border border-leaf-200/80 p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-kwt-lestari.png"
                    alt="Logo Resmi Kelompok Wanita Tani Lestari Desa Sumber Makmur"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-leaf-700 bg-leaf-50 px-2.5 py-0.5 rounded-full border border-leaf-200/60">
                    Unit Usaha Resmi
                  </span>
                  <h2 className="mt-1.5 text-sm sm:text-base font-extrabold text-stone-900">
                    {KWT_INFO.shortName} — {KWT_INFO.village}
                  </h2>
                  <p className="mt-1 text-xs text-stone-500 flex items-center sm:justify-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-leaf-600 shrink-0" />
                    <span className="truncate">
                      {KWT_INFO.subdistrict}, Kotim
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Katalog Produk (Real-time dari Supabase) */}
      <CatalogSection initialProducts={products} />
    </div>
  );
}
