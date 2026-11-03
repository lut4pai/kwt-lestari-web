'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, MapPin } from 'lucide-react';
import { KWT_INFO } from '@/lib/constants';

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin') && pathname !== '/admin/login') {
    return null;
  }

  return (
    <footer className="bg-white border-t border-stone-200/90 mt-16 pb-20 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-stone-100">
          {/* Identitas & Logo */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cream-50 border border-leaf-200 p-0.5 flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-kwt-lestari.png"
                  alt="Logo KWT Lestari"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {KWT_INFO.name}
                </h3>
                <p className="text-xs font-medium text-leaf-700">
                  {KWT_INFO.village} • {KWT_INFO.regency}
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md">
              Etalase resmi pemasaran produk olahan hasil tani ibu-ibu Kelompok Wanita Tani Lestari. Sehat, higienis, tanpa pengawet buatan, langsung dari dapur desa.
            </p>
          </div>

          {/* Alamat Lengkap */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Lokasi Produksi & Sekretariat
            </h4>
            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-600 leading-relaxed">
              <MapPin className="w-4 h-4 text-leaf-600 shrink-0 mt-0.5" />
              <span>{KWT_INFO.fullAddress}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-stone-500">
              <Clock className="w-4 h-4 text-leaf-600 shrink-0" />
              <span>Pelayanan Pesanan: {KWT_INFO.operationalHours}</span>
            </div>
          </div>

          {/* Navigasi Cepat */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Tautan Halaman
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
              <li>
                <Link
                  href="/"
                  className="hover:text-leaf-700 transition-colors font-medium"
                >
                  Katalog Produk Olahan
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang-kami"
                  className="hover:text-leaf-700 transition-colors font-medium"
                >
                  Profil & Cara Pemesanan
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-leaf-700 transition-colors font-medium"
                >
                  Portal Pengurus KWT
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} {KWT_INFO.name} — {KWT_INFO.village}. Diberdayakan oleh Hasil Tani Desa.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/tentang-kami" className="hover:text-stone-800 transition-colors">
              Tentang Kami
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-stone-800 transition-colors">
              Portal Pengurus
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
