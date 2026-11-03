'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Database,
  ExternalLink,
  ImagePlus,
  Loader2,
  LogOut,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Trash2,
  X,
} from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { ADMIN_CATEGORIES, KWT_INFO } from '@/lib/constants';
import {
  composeWhatsAppMessage,
  formatRupiah,
  formatWaDisplay,
  normalizeWaNumber,
} from '@/lib/utils';
import { Product, StorageSourceMode, StoreSettings } from '@/types';
import { ProductArtwork } from '@/components/ProductArtwork';
import { useCart } from '@/context/CartContext';

interface ProductFormState {
  name: string;
  price: string;
  category: string;
  weight: string;
  description: string;
  image_url: string;
  is_available: boolean;
}

const EMPTY_FORM: ProductFormState = {
  name: '',
  price: '',
  category: 'Keripik',
  weight: '120g',
  description: '',
  image_url: '',
  is_available: true,
};

/**
 * Kompresi gambar ringan berbasis Canvas sebelum diunggah ke Supabase Storage
 * agar hemat kuota & cepat pada jaringan ponsel desa.
 */
async function compressImageFile(file: File): Promise<File> {
  if (file.size <= 250 * 1024) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 1080;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width >= height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const cleanName = file.name.replace(/\.[^.]+$/, '') + '.webp';
          resolve(new File([blob], cleanName, { type: 'image/webp' }));
        },
        'image/webp',
        0.84
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { setSettingsState, syncCatalogProducts } = useCart();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [authChecking, setAuthChecking] = useState(true);

  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [sourceMode, setSourceMode] = useState<StorageSourceMode>('postgres');
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // State Pengaturan Toko
  const [waNumber, setWaNumber] = useState('');
  const [waGreeting, setWaGreeting] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  // State Modal Tambah / Edit Produk
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // State Modal Konfirmasi Hapus
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  // State Modal Panduan SQL PostgreSQL
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [copiedSqlHint, setCopiedSqlHint] = useState(false);

  // Feedback Banner / Toast Admin
  const [banner, setBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const notify = useCallback((type: 'success' | 'error', text: string) => {
    setBanner({ type, text });
  }, []);

  useEffect(() => {
    if (!banner) return;
    const timer = setTimeout(() => setBanner(null), 4000);
    return () => clearTimeout(timer);
  }, [banner]);

  // Proteksi Route `/admin` dengan Supabase Auth
  useEffect(() => {
    let mounted = true;

    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (!data.session) {
        router.replace('/admin/login');
        return;
      }
      setAccessToken(data.session.access_token);
      setAdminEmail(data.session.user.email || 'Admin KWT');
      setAuthChecking(false);
    });

    const { data: sub } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        if (!session) {
          router.replace('/admin/login');
        } else {
          setAccessToken(session.access_token);
          setAdminEmail(session.user.email || 'Admin KWT');
        }
      }
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  const loadDashboardData = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/store', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memuat data.');

      const loadedProducts: Product[] = data.products || [];
      const loadedSettings: StoreSettings = data.settings;

      setProducts(loadedProducts);
      setSourceMode(data.source || 'postgres');
      syncCatalogProducts(loadedProducts);

      if (loadedSettings) {
        setWaNumber(loadedSettings.wa_number);
        setWaGreeting(loadedSettings.wa_greeting);
        setSettingsState(loadedSettings);
      }
    } catch (err) {
      notify(
        'error',
        err instanceof Error ? err.message : 'Gagal memuat data dashboard.'
      );
    } finally {
      setLoadingData(false);
    }
  }, [notify, setSettingsState, syncCatalogProducts]);

  useEffect(() => {
    if (!authChecking && accessToken) {
      loadDashboardData();
    }
  }, [authChecking, accessToken, loadDashboardData]);

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut();
    router.replace('/admin/login');
  };

  // Buka Modal Tambah Produk
  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  // Buka Modal Edit Produk
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category || 'Keripik',
      weight: product.weight || '',
      description: product.description || '',
      image_url: product.image_url || '',
      is_available: product.is_available,
    });
    setIsModalOpen(true);
  };

  // Upload Foto Produk ke Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile || !accessToken) return;

    setUploadingImage(true);
    try {
      const compressed = await compressImageFile(rawFile);
      const fd = new FormData();
      fd.append('file', compressed);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengunggah foto.');

      setForm((prev) => ({ ...prev, image_url: data.url }));
      notify('success', 'Foto produk berhasil diunggah ke Supabase Storage.');
    } catch (err) {
      notify(
        'error',
        err instanceof Error ? err.message : 'Gagal mengunggah gambar.'
      );
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Simpan Produk Baru atau Perubahan Produk
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    const cleanName = form.name.trim();
    const numericPrice = Number(form.price.replace(/[^\d]/g, ''));

    if (!cleanName) {
      notify('error', 'Nama produk wajib diisi.');
      return;
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      notify('error', 'Masukkan harga produk yang valid (dalam Rupiah).');
      return;
    }

    setSavingProduct(true);
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      const method = editingProduct ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: cleanName,
          price: numericPrice,
          category: form.category,
          weight: form.weight.trim(),
          description: form.description.trim(),
          image_url: form.image_url.trim(),
          is_available: form.is_available,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan produk.');

      if (editingProduct) {
        setProducts((prev) => {
          const next = prev.map((p) =>
            p.id === editingProduct.id ? data.product : p
          );
          syncCatalogProducts(next);
          return next;
        });
        notify('success', `Produk "${data.product.name}" berhasil diperbarui.`);
      } else {
        setProducts((prev) => {
          const next = [data.product, ...prev];
          syncCatalogProducts(next);
          return next;
        });
        notify('success', `Produk "${data.product.name}" berhasil ditambahkan.`);
      }

      setIsModalOpen(false);
    } catch (err) {
      notify(
        'error',
        err instanceof Error ? err.message : 'Gagal menyimpan produk.'
      );
    } finally {
      setSavingProduct(false);
    }
  };

  // Saklar Cepat Status Tersedia / Habis langsung dari Tabel
  const handleQuickToggleAvailability = async (product: Product) => {
    if (!accessToken) return;
    const nextStatus = !product.is_available;

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, is_available: nextStatus } : p
      )
    );

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ is_available: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengubah status.');

      setProducts((prev) => {
        const updated = prev.map((p) =>
          p.id === product.id ? data.product : p
        );
        syncCatalogProducts(updated);
        return updated;
      });
      notify(
        'success',
        `Status "${product.name}" diubah menjadi ${
          nextStatus ? 'Tersedia' : 'Habis'
        }.`
      );
    } catch (err) {
      // Kembalikan state jika gagal
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, is_available: product.is_available } : p
        )
      );
      notify(
        'error',
        err instanceof Error ? err.message : 'Gagal mengubah ketersediaan.'
      );
    }
  };

  // Hapus Produk
  const handleConfirmDelete = async () => {
    if (!deletingProduct || !accessToken) return;
    setDeletingBusy(true);
    try {
      const res = await fetch(`/api/products/${deletingProduct.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus produk.');

      const removedName = deletingProduct.name;
      setProducts((prev) => {
        const next = prev.filter((p) => p.id !== deletingProduct.id);
        syncCatalogProducts(next);
        return next;
      });
      setDeletingProduct(null);
      notify('success', `Produk "${removedName}" telah dihapus dari katalog.`);
    } catch (err) {
      notify(
        'error',
        err instanceof Error ? err.message : 'Gagal menghapus produk.'
      );
    } finally {
      setDeletingBusy(false);
    }
  };

  // Simpan Pengaturan Toko (`store_settings`)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          wa_number: waNumber,
          wa_greeting: waGreeting,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan pengaturan.');

      setWaNumber(data.settings.wa_number);
      setWaGreeting(data.settings.wa_greeting);
      setSettingsState(data.settings);
      notify(
        'success',
        'Pengaturan nomor WhatsApp & teks pembuka berhasil diperbarui!'
      );
    } catch (err) {
      notify(
        'error',
        err instanceof Error ? err.message : 'Gagal menyimpan pengaturan.'
      );
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const availableCount = useMemo(
    () => products.filter((p) => p.is_available).length,
    [products]
  );

  const sampleWaPreview = useMemo(() => {
    const sampleProduct = products[0] || {
      id: 'sample',
      name: 'Keripik Pisang Sweet Caramel',
      price: 15000,
      category: 'Keripik',
      weight: '120g',
      image_url: '',
      is_available: true,
      created_at: '',
    };
    return composeWhatsAppMessage({
      settings: {
        id: 'preview',
        wa_number: normalizeWaNumber(waNumber),
        wa_greeting: waGreeting,
        updated_at: '',
      },
      items: [{ product: sampleProduct, quantity: 2 }],
      buyerName: 'Ibu Rahma',
      buyerAddress: 'Desa Sumber Makmur RT 03',
    });
  }, [products, waNumber, waGreeting]);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-leaf-600 animate-spin" />
        <p className="text-xs font-semibold text-stone-500">
          Memeriksa sesi pengurus KWT Lestari...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50/80 pb-16">
      {/* Header Khusus Dashboard Admin */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-cream-50 border border-leaf-200 p-0.5 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-kwt-lestari.png"
                alt="Logo KWT Lestari"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-stone-900 truncate">
                  Dashboard Admin {KWT_INFO.shortName}
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-leaf-100 text-leaf-800">
                  Pengurus
                </span>
              </div>
              <p className="text-[11px] text-stone-500 truncate">
                Login sebagai: {adminEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl border border-stone-200 bg-cream-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 transition-colors"
            >
              <span className="hidden sm:inline">Lihat Katalog</span>
              <ExternalLink className="w-3.5 h-3.5 text-leaf-700" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 text-xs font-bold text-red-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Notifikasi Sukses / Error */}
        {banner && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-sm animate-fade-in ${
              banner.type === 'success'
                ? 'bg-leaf-50 border-leaf-200 text-leaf-900'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
              {banner.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-leaf-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{banner.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setBanner(null)}
              className="p-1 rounded-lg hover:bg-black/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Info Status Sinkronisasi Tabel PostgreSQL */}
        {sourceMode === 'cloud_storage_fallback' && (
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong className="font-bold block">
                  Penyimpanan Awan Supabase Aktif (Menunggu Inisialisasi Tabel SQL)
                </strong>
                Semua perubahan produk & nomor WhatsApp sudah tersimpan aman di Supabase Cloud Anda. Untuk mengaktifkan tabel PostgreSQL murni (`products` & `store_settings`), jalankan file{' '}
                <code className="px-1.5 py-0.5 rounded bg-amber-100 font-mono">
                  supabase/schema.sql
                </code>{' '}
                di SQL Editor Supabase.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSqlGuide(true)}
              className="shrink-0 px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-colors"
            >
              Lihat Panduan SQL
            </button>
          </div>
        )}

        {/* 4 Kartu Ringkasan Data */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/85 shadow-card">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Total Produk
            </span>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-stone-900">
              {products.length}
            </p>
            <span className="mt-1 block text-xs text-stone-500">
              Terdaftar di etalase
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/85 shadow-card">
            <span className="text-[11px] font-bold uppercase tracking-wider text-leaf-700">
              Stok Tersedia
            </span>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-leaf-700">
              {availableCount}
            </p>
            <span className="mt-1 block text-xs text-stone-500">
              Siap dipesan pembeli
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/85 shadow-card">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Stok Habis
            </span>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-stone-700">
              {products.length - availableCount}
            </p>
            <span className="mt-1 block text-xs text-stone-500">
              Sementara ditutup
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/85 shadow-card">
            <span className="text-[11px] font-bold uppercase tracking-wider text-leaf-700">
              Nomor WA Tujuan
            </span>
            <p className="mt-1.5 text-sm sm:text-base font-extrabold text-stone-900 truncate">
              {formatWaDisplay(waNumber)}
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className="mt-1.5 text-xs font-bold text-leaf-700 hover:underline"
            >
              Ubah nomor →
            </button>
          </div>
        </div>

        {/* Navigasi Tab Admin */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div className="inline-flex rounded-2xl bg-stone-200/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-white text-leaf-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Manajemen Katalog ({products.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-white text-leaf-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan Toko & WhatsApp</span>
            </button>
          </div>

          <button
            type="button"
            onClick={loadDashboardData}
            disabled={loadingData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`}
            />
            <span>Muat Ulang Data</span>
          </button>
        </div>

        {/* TAB 1: MANAJEMEN KATALOG PRODUK (CRUD) */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-card overflow-hidden">
            {/* Toolbar Atas Tabel */}
            <div className="p-4 sm:p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama produk atau kategori..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-cream-50/40 focus:bg-white text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-leaf-500/25 focus:border-leaf-500"
                />
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-leaf-600 hover:bg-leaf-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Tambah Produk Baru</span>
              </button>
            </div>

            {/* Daftar Produk */}
            {loadingData ? (
              <div className="py-16 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 text-leaf-600 animate-spin" />
                <span className="text-xs text-stone-500">
                  Memuat daftar produk...
                </span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-16 px-6 text-center">
                <p className="text-sm font-bold text-stone-800">
                  Belum ada produk yang cocok
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  Klik tombol &ldquo;Tambah Produk Baru&rdquo; untuk menambahkan produk ke katalog.
                </p>
              </div>
            ) : (
              <>
                {/* Tabel Desktop */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-cream-50/80 border-b border-stone-200/80 text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                        <th className="py-3.5 px-6">Produk</th>
                        <th className="py-3.5 px-4">Kategori & Kemasan</th>
                        <th className="py-3.5 px-4">Harga Satuan</th>
                        <th className="py-3.5 px-4">Status Ketersediaan</th>
                        <th className="py-3.5 px-6 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-sm">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-cream-50/40 transition-colors"
                        >
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-200 shrink-0 bg-stone-50">
                                <ProductArtwork product={product} size="thumb" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-stone-900 truncate max-w-xs">
                                  {product.name}
                                </p>
                                {product.description && (
                                  <p className="text-xs text-stone-500 truncate max-w-xs">
                                    {product.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                              {product.category || 'Keripik'}
                            </span>
                            {product.weight && (
                              <span className="ml-2 text-xs text-stone-500">
                                {product.weight}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-extrabold text-stone-900">
                            {formatRupiah(product.price)}
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuickToggleAvailability(product)
                              }
                              title="Klik untuk mengubah status ketersediaan"
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                                product.is_available
                                  ? 'bg-leaf-50 border-leaf-200 text-leaf-800 hover:bg-leaf-100'
                                  : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  product.is_available
                                    ? 'bg-leaf-600'
                                    : 'bg-stone-400'
                                }`}
                              />
                              <span>
                                {product.is_available ? 'Tersedia' : 'Habis'}
                              </span>
                            </button>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(product)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5 text-leaf-700" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingProduct(product)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-100 text-xs font-bold text-red-700 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Daftar Kartu Responsif Mobile */}
                <div className="md:hidden divide-y divide-stone-100">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="p-4 flex gap-3.5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-stone-200 shrink-0 bg-stone-50">
                        <ProductArtwork product={product} size="thumb" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-stone-900 truncate">
                              {product.name}
                            </h3>
                            <p className="text-xs text-stone-500">
                              {product.category || 'Keripik'}
                              {product.weight ? ` • ${product.weight}` : ''}
                            </p>
                          </div>
                          <span className="text-sm font-extrabold text-leaf-800 shrink-0">
                            {formatRupiah(product.price)}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuickToggleAvailability(product)
                            }
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              product.is_available
                                ? 'bg-leaf-50 border-leaf-200 text-leaf-800'
                                : 'bg-stone-100 border-stone-200 text-stone-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                product.is_available
                                  ? 'bg-leaf-600'
                                  : 'bg-stone-400'
                              }`}
                            />
                            {product.is_available ? 'Tersedia' : 'Habis'}
                          </button>

                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(product)}
                              className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-stone-700"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingProduct(product)}
                              className="px-2.5 py-1.5 rounded-lg border border-red-200 text-xs font-bold text-red-600"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: PENGATURAN TOKO & WHATSAPP ROUTING */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleSaveSettings}
              className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 shadow-card p-6 sm:p-8 space-y-5"
            >
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-leaf-700">
                  KONFIGURASI GLOBAL TOKO
                </span>
                <h2 className="mt-1 text-xl font-extrabold text-stone-900">
                  Pengaturan Nomor & Pesan WhatsApp
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-stone-500 leading-relaxed">
                  Seluruh tombol checkout pembeli di website akan otomatis mengarah ke nomor WhatsApp pengurus di bawah ini secara real-time.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Nomor WhatsApp Tujuan (Format Internasional `628...`)
                </label>
                <input
                  type="tel"
                  required
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  placeholder="Contoh: 6281250007436"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-cream-50/40 focus:bg-white text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-leaf-500/25 focus:border-leaf-500"
                />
                <p className="mt-1.5 text-[11px] text-stone-500">
                  Tips: Jika Anda mengetik <code className="font-mono">0812...</code>, sistem otomatis mengubahnya menjadi{' '}
                  <code className="font-mono font-bold text-leaf-700">
                    {normalizeWaNumber(waNumber)}
                  </code>
                  .
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Template Teks Pembuka Pesanan
                </label>
                <textarea
                  rows={3}
                  required
                  value={waGreeting}
                  onChange={(e) => setWaGreeting(e.target.value)}
                  placeholder="Halo Admin KWT Lestari Desa Sumber Makmur, saya ingin memesan produk berikut:"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-cream-50/40 focus:bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-leaf-500/25 focus:border-leaf-500 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-leaf-700 hover:bg-leaf-800 disabled:opacity-60 text-white text-sm font-bold shadow-sm transition-all"
                >
                  {savingSettings ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Pengaturan Toko</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/${normalizeWaNumber(
                    waNumber
                  )}?text=${encodeURIComponent(sampleWaPreview)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-stone-200 bg-white hover:bg-cream-50 text-xs sm:text-sm font-semibold text-stone-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-leaf-600" />
                  <span>Tes Redirect WhatsApp</span>
                </a>
              </div>
            </form>

            {/* Pratinjau Pesan WhatsApp */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/90 shadow-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-leaf-700">
                  PRATINJAU PESAN PEMBELI
                </span>
                <span className="text-[11px] font-semibold text-stone-400">
                  wa.me/{normalizeWaNumber(waNumber)}
                </span>
              </div>

              <div className="rounded-2xl bg-[#ECF8EE] border border-leaf-200/80 p-4 text-xs text-stone-800 whitespace-pre-wrap font-sans leading-relaxed shadow-inner">
                {sampleWaPreview}
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed">
                Format di atas otomatis di-encode ke dalam URL WhatsApp ketika pembeli menekan tombol Checkout di Keranjang Belanja.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL TAMBAH / EDIT PRODUK */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-stone-950/55 backdrop-blur-[2px]"
            onClick={() => !savingProduct && setIsModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-8 animate-fade-in">
            <div className="px-6 py-4 bg-cream-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-stone-900">
                  {editingProduct ? 'Edit Data Produk' : 'Tambah Produk Baru'}
                </h2>
                <p className="text-xs text-stone-500">
                  Data otomatis tampil di katalog pembeli KWT Lestari
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-stone-500 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveProduct}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              {/* Upload Gambar Produk */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Foto Produk (Supabase Storage)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
                    <ProductArtwork
                      product={{
                        name: form.name || 'Produk',
                        category: form.category,
                        image_url: form.image_url,
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-leaf-50 hover:bg-leaf-100 border border-leaf-200 text-xs font-bold text-leaf-800 cursor-pointer transition-colors">
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Mengunggah foto...</span>
                        </>
                      ) : (
                        <>
                          <ImagePlus className="w-4 h-4" />
                          <span>Pilih & Upload Gambar</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>

                    {form.image_url && (
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, image_url: '' }))
                        }
                        className="block text-[11px] font-semibold text-red-600 hover:underline"
                      >
                        Hapus foto saat ini
                      </button>
                    )}
                    <p className="text-[11px] text-stone-400">
                      JPG, PNG, atau WEBP (otomatis dikompresi agar cepat dimuat).
                    </p>
                  </div>
                </div>
              </div>

              {/* Nama Produk */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Contoh: Keripik Pisang Sweet Caramel"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-leaf-500/25 focus:border-leaf-500"
                />
              </div>

              {/* Harga & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Harga Satuan (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    required
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="15000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-leaf-500/25 focus:border-leaf-500"
                  />
                  {form.price && Number(form.price) > 0 && (
                    <span className="mt-1 block text-[11px] font-semibold text-leaf-700">
                      Tampil: {formatRupiah(Number(form.price))}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Kategori Produk
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-leaf-500/25 focus:border-leaf-500"
                  >
                    {ADMIN_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Berat Kemasan & Status Ketersediaan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Berat / Ukuran Kemasan
                  </label>
                  <input
                    type="text"
                    value={form.weight}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, weight: e.target.value }))
                    }
                    placeholder="Contoh: 120g atau 150ml"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-leaf-500/25 focus:border-leaf-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Status Ketersediaan
                  </label>
                  <select
                    value={form.is_available ? 'available' : 'out'}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        is_available: e.target.value === 'available',
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-leaf-500/25 focus:border-leaf-500"
                  >
                    <option value="available">Tersedia (Aktif)</option>
                    <option value="out">Stok Habis</option>
                  </select>
                </div>
              </div>

              {/* Deskripsi Singkat */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Keterangan bahan baku, rasa, atau keunggulan produk..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-leaf-500/25 focus:border-leaf-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingProduct || uploadingImage}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-leaf-600 hover:bg-leaf-700 disabled:opacity-60 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
                >
                  {savingProduct ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>
                        {editingProduct ? 'Simpan Perubahan' : 'Simpan Produk'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS PRODUK */}
      {deletingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-stone-950/55 backdrop-blur-[2px]"
            onClick={() => !deletingBusy && setDeletingProduct(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl border border-stone-200 p-6 shadow-2xl text-center animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="mt-4 text-base font-extrabold text-stone-900">
              Hapus Produk Ini?
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-500 leading-relaxed">
              Produk <strong className="text-stone-800">{deletingProduct.name}</strong> akan dihapus permanen dari etalase katalog KWT Lestari.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={deletingBusy}
                onClick={() => setDeletingProduct(null)}
                className="py-2.5 px-4 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deletingBusy}
                onClick={handleConfirmDelete}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5"
              >
                {deletingBusy ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Ya, Hapus'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PANDUAN INISIALISASI TABEL POSTGRESQL */}
      {showSqlGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-stone-950/55 backdrop-blur-[2px]"
            onClick={() => setShowSqlGuide(false)}
          />
          <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl border border-stone-200 p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-stone-900">
                Cara Mengaktifkan Tabel PostgreSQL Supabase
              </h3>
              <button
                type="button"
                onClick={() => setShowSqlGuide(false)}
                className="p-1.5 rounded-xl text-stone-500 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              <li>
                Buka proyek Anda di{' '}
                <a
                  href="https://supabase.com/dashboard/project/izewbwgaesntptvakalk/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-leaf-700 underline"
                >
                  Supabase SQL Editor ↗
                </a>
              </li>
              <li>
                Salin seluruh isi file <code className="font-mono font-bold">supabase/schema.sql</code> pada folder proyek ini, tempel ke SQL Editor, lalu klik <strong>Run</strong>.
              </li>
              <li>
                Klik tombol <strong>Muat Ulang Data</strong> di Dashboard ini — seluruh produk yang sudah Anda kelola akan otomatis tersinkronisasi ke tabel PostgreSQL!
              </li>
            </ol>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    'https://supabase.com/dashboard/project/izewbwgaesntptvakalk/sql/new'
                  );
                  setCopiedSqlHint(true);
                  setTimeout(() => setCopiedSqlHint(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                {copiedSqlHint ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-leaf-600" />
                    <span>Link SQL Editor Disalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link SQL Editor</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowSqlGuide(false)}
                className="px-4 py-2 rounded-xl bg-leaf-600 text-white text-xs font-bold"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
