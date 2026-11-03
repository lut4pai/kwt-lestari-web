'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  ShieldCheck,
  User,
} from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { KWT_INFO } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        router.replace('/admin');
      } else {
        setCheckingSession(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Mohon isi alamat email dan kata sandi pengurus.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabaseBrowser.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('invalid login')) {
          setErrorMsg('Email atau kata sandi tidak sesuai. Silakan periksa kembali.');
        } else {
          setErrorMsg(error.message);
        }
        setLoading(false);
        return;
      }

      router.replace('/admin');
    } catch {
      setErrorMsg('Terjadi gangguan jaringan. Silakan coba beberapa saat lagi.');
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-leaf-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-cream-50/80 py-10 sm:py-14 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        {/* Link Kembali ke Katalog */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-leaf-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Katalog Pembeli</span>
        </Link>

        {/* Kartu Login Utama (Disempurnakan dari Referensi Stitch) */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-soft p-6 sm:p-9">
          {/* Header Kartu */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-cream-50 border border-leaf-200 p-1.5 shadow-sm flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-kwt-lestari.png"
                alt="Logo KWT Lestari"
                className="w-full h-full object-contain"
              />
            </div>

            <span className="mt-4 text-[11px] font-extrabold uppercase tracking-widest text-leaf-700">
              PORTAL PENGURUS & ADMIN
            </span>
            <h1 className="mt-1 text-xl sm:text-2xl font-extrabold text-stone-900">
              Masuk ke Portal Pengurus
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-500 leading-relaxed max-w-xs">
              Kelola etalase produk olahan tani dan pengaturan pesanan WhatsApp{' '}
              {KWT_INFO.shortName}.
            </p>
          </div>

          {/* Pesan Error */}
          {errorMsg && (
            <div className="mt-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Login Supabase Auth */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold text-stone-700 mb-1.5"
              >
                Email Pengurus
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kwtlestari.id"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-cream-50/40 focus:bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/25 focus:border-leaf-500 transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-stone-700 mb-1.5"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-200 bg-cream-50/40 focus:bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/25 focus:border-leaf-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-0.5">
              <span>Sesi tersimpan otomatis</span>
              <span className="inline-flex items-center gap-1 text-leaf-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Koneksi Aman
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-leaf-700 hover:bg-leaf-800 disabled:opacity-60 text-white text-sm font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Kartu */}
          <div className="mt-7 pt-5 border-t border-stone-100 text-center">
            <p className="text-xs font-extrabold text-stone-800 tracking-wide">
              🌿 KWT LESTARI MANDIRI
            </p>
            <p className="mt-0.5 text-[11px] text-stone-500">
              Sistem Informasi Penjualan Olahan Tani {KWT_INFO.village}
            </p>
          </div>
        </div>

        {/* Link bawah kartu */}
        <p className="mt-6 text-center text-xs text-stone-500">
          Bukan pengurus KWT?{' '}
          <Link
            href="/"
            className="font-bold text-leaf-700 hover:text-leaf-800 underline underline-offset-2"
          >
            Lihat Produk Olahan Desa
          </Link>
        </p>
      </div>
    </div>
  );
}
