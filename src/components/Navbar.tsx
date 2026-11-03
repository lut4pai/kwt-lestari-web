'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Info,
  MapPin,
  Menu,
  ShieldCheck,
  ShoppingCart,
  Store,
  X,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { KWT_INFO } from '@/lib/constants';
import { formatRupiah } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, subtotal, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminRoute = pathname?.startsWith('/admin');
  if (isAdminRoute && pathname !== '/admin/login') {
    // Halaman Dashboard Admin memiliki header khusus tersendiri
    return null;
  }

  const navItems = [
    {
      href: '/',
      label: 'Katalog Produk',
      icon: Store,
      active: pathname === '/',
    },
    {
      href: '/tentang-kami',
      label: 'Tentang Kami',
      icon: Info,
      active: pathname === '/tentang-kami',
    },
    {
      href: '/admin',
      label: 'Portal Admin',
      icon: ShieldCheck,
      active: pathname?.startsWith('/admin'),
    },
  ];

  return (
    <>
      {/* Top Bar Resmi KWT Lestari */}
      <div className="bg-stone-900 text-stone-200 text-[11px] sm:text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-leaf-400 shrink-0 animate-pulse" />
            <p className="truncate">
              <strong className="font-semibold text-white">
                Katalog Resmi {KWT_INFO.name}
              </strong>{' '}
              <span className="hidden sm:inline text-stone-400">
                | Produk Olahan Alami Khas {KWT_INFO.village}
              </span>
            </p>
          </div>
          <a
            href={KWT_INFO.mapsDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 text-stone-300 hover:text-leaf-300 transition-colors shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-leaf-400" />
            <span>Kotawaringin Timur, Kalimantan Tengah</span>
          </a>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-3">
          {/* Brand Logo KWT Lestari */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group min-w-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-cream-50 border border-leaf-200/80 p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:border-leaf-500 transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-kwt-lestari.png"
                alt="Logo KWT Lestari Desa Sumber Makmur"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <span className="block text-sm sm:text-base font-bold text-stone-900 tracking-tight leading-tight truncate">
                {KWT_INFO.shortName}
              </span>
              <span className="block text-[11px] sm:text-xs text-stone-500 leading-tight truncate">
                {KWT_INFO.village}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    item.active
                      ? 'text-leaf-700 bg-leaf-50/90 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      item.active ? 'text-leaf-600' : 'text-stone-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.active && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-leaf-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Cart Button + Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCart}
              aria-label="Buka Keranjang Belanja"
              className="relative inline-flex items-center gap-2.5 pl-3 pr-3.5 sm:px-4 py-2 rounded-full bg-cream-100 hover:bg-leaf-50 border border-stone-200/90 hover:border-leaf-300 text-stone-800 transition-all active:scale-95"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-stone-700" />
                <span
                  className={`-top-2 -right-2.5 absolute min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center transition-transform ${
                    totalItems > 0
                      ? 'bg-leaf-600 text-white scale-100 shadow-sm'
                      : 'bg-stone-300 text-stone-700 scale-95'
                  }`}
                >
                  {totalItems}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-semibold ml-1">
                Keranjang
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Menu Navigasi"
              className="md:hidden p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-leaf-50 text-leaf-700 font-semibold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      item.active ? 'text-leaf-600' : 'text-stone-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-stone-100 flex items-center gap-2 px-3 text-xs text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-leaf-600 shrink-0" />
              <span className="line-clamp-1">{KWT_INFO.fullAddress}</span>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Cart Bar khusus Mobile saat ada isi keranjang */}
      {!pathname?.startsWith('/admin') && totalItems > 0 && (
        <div className="sm:hidden fixed bottom-3 inset-x-3 z-30">
          <button
            type="button"
            onClick={openCart}
            className="w-full bg-leaf-700 hover:bg-leaf-800 text-white rounded-2xl px-4 py-3 shadow-xl border border-leaf-500/30 flex items-center justify-between gap-3 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-7 h-7 rounded-xl bg-white/15 font-bold text-xs flex items-center justify-center shrink-0">
                {totalItems}
              </span>
              <div className="text-left min-w-0">
                <p className="text-xs font-semibold leading-tight truncate">
                  {totalItems} Barang di Keranjang
                </p>
                <p className="text-[11px] text-leaf-100 leading-tight">
                  Siap pesan via WhatsApp
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-bold block">
                {formatRupiah(subtotal)}
              </span>
              <span className="text-[10px] text-leaf-100 underline">
                Buka Keranjang →
              </span>
            </div>
          </button>
        </div>
      )}
    </>
  );
}
