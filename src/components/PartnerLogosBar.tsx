'use client';

import React from 'react';
import { PARTNER_LOGOS, KWT_INFO } from '@/lib/constants';

interface PartnerLogosBarProps {
  variant?: 'navbar-strip' | 'hero-banner' | 'about-grid' | 'footer-row' | 'compact';
}

export function PartnerLogosBar({ variant = 'hero-banner' }: PartnerLogosBarProps) {
  if (variant === 'navbar-strip') {
    return (
      <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-stone-200/90">
        {PARTNER_LOGOS.map((logo) => (
          <div
            key={logo.id}
            title={logo.name}
            className="h-7 flex items-center justify-center opacity-95 hover:opacity-100 hover:scale-105 transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.name}
              className={`${logo.isWide ? 'h-4 max-w-[68px]' : 'h-6 w-6'} object-contain`}
            />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {PARTNER_LOGOS.map((logo) => (
          <div
            key={logo.id}
            title={logo.name}
            className="h-8 sm:h-9 px-2 py-1 rounded-xl bg-cream-50/90 border border-stone-200/70 flex items-center justify-center shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.name}
              className={`${
                logo.isWide ? 'h-4 sm:h-5 max-w-[82px]' : 'h-6 sm:h-7 w-auto'
              } object-contain`}
            />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'footer-row') {
    return (
      <div className="py-6 border-b border-stone-100">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-stone-400 text-center sm:text-left mb-3.5">
          Didukung Oleh Program Pengabdian & Kolaborasi Perguruan Tinggi
        </p>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
          {PARTNER_LOGOS.map((logo) => (
            <div
              key={logo.id}
              title={logo.name}
              className="group h-11 sm:h-12 px-3.5 py-2 rounded-2xl bg-cream-50/80 hover:bg-white border border-stone-200/80 hover:border-leaf-300 flex items-center gap-2.5 shadow-sm transition-all"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.name}
                className={`${
                  logo.isWide ? 'h-5 sm:h-6 max-w-[96px]' : 'h-7 sm:h-8 w-auto'
                } object-contain`}
              />
              {!logo.isWide && (
                <span className="hidden xl:inline text-[11px] font-semibold text-stone-600 group-hover:text-stone-900">
                  {logo.shortLabel}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'about-grid') {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-soft p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-leaf-700">
              KOLABORASI & DUKUNGAN PROGRAM
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Sinergi Perguruan Tinggi & Pemberdayaan Desa
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              Pengembangan Sistem Informasi E-Commerce{' '}
              <strong className="text-stone-800">{KWT_INFO.name}</strong>{' '}
              merupakan wujud nyata kolaborasi program{' '}
              <strong className="text-leaf-800">
                Mahasiswa Berdampak Universitas Darwan Ali (UNDA) Tahun 2026
              </strong>{' '}
              yang didukung oleh Kemdiktisaintek RI, Diktisaintek Berdampak, dan BIMA.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {PARTNER_LOGOS.map((logo) => (
              <div
                key={logo.id}
                className="group rounded-2xl bg-cream-50/70 hover:bg-white border border-stone-200/80 hover:border-leaf-300 p-4 flex flex-col items-center text-center justify-between transition-all shadow-card hover:shadow-soft"
              >
                <div className="h-16 sm:h-20 w-full flex items-center justify-center p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className={`${
                      logo.isWide
                        ? 'max-h-11 sm:max-h-12 w-auto max-w-[130px]'
                        : 'max-h-14 sm:max-h-16 w-auto'
                    } object-contain group-hover:scale-105 transition-transform duration-300`}
                  />
                </div>
                <div className="mt-3 pt-2.5 border-t border-stone-200/60 w-full">
                  <p className="text-xs font-bold text-stone-900 leading-snug line-clamp-1">
                    {logo.shortLabel}
                  </p>
                  <p className="mt-0.5 text-[10px] text-stone-500 leading-tight line-clamp-2">
                    {logo.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: 'hero-banner'
  return (
    <div className="bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="text-center lg:text-left">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-leaf-700 block">
              DIDUKUNG & DIKEMBANGKAN BERSAMA
            </span>
            <p className="text-xs sm:text-sm font-semibold text-stone-700">
              Program Mahasiswa Berdampak Universitas Darwan Ali (UNDA) 2026 • Kemdiktisaintek RI
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
            {PARTNER_LOGOS.map((logo) => (
              <div
                key={logo.id}
                title={logo.name}
                className="h-11 sm:h-12 px-3 py-1.5 rounded-2xl bg-cream-50/90 hover:bg-leaf-50/50 border border-stone-200/80 hover:border-leaf-300 flex items-center justify-center shadow-sm transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  className={`${
                    logo.isWide
                      ? 'h-5 sm:h-6 max-w-[95px] sm:max-w-[110px]'
                      : 'h-7 sm:h-8 w-auto'
                  } object-contain`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
