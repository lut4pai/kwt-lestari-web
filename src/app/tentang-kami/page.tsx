import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  HeartHandshake,
  Leaf,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Sprout,
} from 'lucide-react';
import { KWT_INFO } from '@/lib/constants';
import { getStorePayload } from '@/lib/data-service';
import { formatWaDisplay, normalizeWaNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TentangKamiPage() {
  const { settings } = await getStorePayload();
  const cleanWa = normalizeWaNumber(settings.wa_number);
  const directChatUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    'Halo Pengurus KWT Lestari Desa Sumber Makmur, saya ingin bertanya mengenai produk olahan tani.'
  )}`;

  return (
    <div className="bg-cream-50/60">
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-stone-700 hover:text-leaf-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Katalog</span>
          </Link>
          <span>•</span>
          <span className="uppercase tracking-widest text-leaf-700">
            PROFIL & FILOSOFI GERAKAN
          </span>
        </div>
      </div>

      {/* SECTION 1: HERO PROFIL KWT LESTARI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Teks Kiri */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf-100/90 border border-leaf-200 text-leaf-800 text-xs font-bold">
              <Sprout className="w-3.5 h-3.5 text-leaf-600" />
              <span>Kelompok Wanita Tani • {KWT_INFO.village}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-stone-900 tracking-tight leading-[1.15]">
              Pemberdayaan Ibu Tani,{' '}
              <span className="text-leaf-700">Kemandirian Pangan Desa.</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              <strong className="font-semibold text-stone-900">
                {KWT_INFO.name}
              </strong>{' '}
              adalah wadah kolaborasi ibu-ibu warga{' '}
              <strong className="font-semibold text-stone-800">
                {KWT_INFO.village}, {KWT_INFO.subdistrict}, {KWT_INFO.regency}
              </strong>{' '}
              yang mengolah hasil panen pekarangan dan kebun lokal menjadi camilan serta bumbu dapur bernilai tambah tinggi — sehat, renyah, dan{' '}
              <strong className="font-semibold text-leaf-800">
                100% bebas bahan pengawet sintetis
              </strong>
              .
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/#katalog"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-leaf-700 hover:bg-leaf-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Jelajahi Produk Olahan</span>
              </Link>
              <a
                href={directChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-cream-100 text-stone-800 border border-stone-200 text-xs sm:text-sm font-semibold shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 text-leaf-600" />
                <span>Hubungi Pengurus Langsung</span>
              </a>
            </div>

            {/* 3 Stat Highlights */}
            <div className="pt-3 grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200/80 shadow-card">
                <span className="block text-lg sm:text-2xl font-extrabold text-leaf-700">
                  100%
                </span>
                <span className="mt-0.5 block text-[11px] sm:text-xs font-medium text-stone-600">
                  Bahan Hasil Kebun Lokal
                </span>
              </div>
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200/80 shadow-card">
                <span className="block text-lg sm:text-2xl font-extrabold text-leaf-700">
                  0%
                </span>
                <span className="mt-0.5 block text-[11px] sm:text-xs font-medium text-stone-600">
                  Pengawet & Pewarna Kimia
                </span>
              </div>
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200/80 shadow-card">
                <span className="block text-lg sm:text-2xl font-extrabold text-leaf-700">
                  Asli
                </span>
                <span className="mt-0.5 block text-[11px] sm:text-xs font-medium text-stone-600">
                  Karya Ibu Tani Desa
                </span>
              </div>
            </div>
          </div>

          {/* Kartu Visual Kanan */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-leaf-900 via-leaf-800 to-earth-900 p-6 sm:p-8 text-white shadow-xl border border-leaf-700/40">
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-leaf-400/15 blur-2xl" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-cream-50 p-2.5 shadow-lg border-4 border-leaf-300/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-kwt-lestari.png"
                    alt="Logo KWT Lestari Desa Sumber Makmur"
                    className="w-full h-full object-contain"
                  />
                </div>

                <span className="mt-5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-bold tracking-wider uppercase text-leaf-100">
                  Identitas Resmi Kelompok
                </span>
                <h2 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight">
                  KWT Lestari Desa Sumber Makmur
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-leaf-100/90 leading-relaxed">
                  &ldquo;Dari pekarangan desa kami olah dengan sepenuh hati, menghadirkan cita rasa alami Kalimantan Tengah langsung ke meja keluarga Anda.&rdquo;
                </p>

                <div className="mt-5 w-full rounded-2xl bg-stone-950/35 backdrop-blur-md border border-white/10 p-4 text-left">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-leaf-300 shrink-0 mt-0.5" />
                    <p className="text-xs text-stone-100 leading-relaxed">
                      {KWT_INFO.fullAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FILOSOFI & KOMITMEN (3 PILAR + 2 CERITA DAPUR) */}
      <section className="bg-white border-y border-stone-200/80 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-leaf-700">
              FILOSOFI & KOMITMEN
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Standar Kualitas KWT Lestari
            </h2>
            <p className="mt-2 text-sm text-stone-600 leading-relaxed">
              Kami menolak jalan pintas industri instan. Setiap bungkus keripik, sambal, dan bumbu bubuk melewati seleksi bahan segar hasil kebun warga tanpa tambahan pengawet kimia.
            </p>
          </div>

          {/* 3 Pilar Utama */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-3xl bg-cream-50/80 border border-stone-200/85 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-leaf-700">
                  PILAR 01
                </span>
                <h3 className="mt-2 text-lg font-extrabold text-stone-900">
                  Bahan Baku Segar dari Kebun Warga
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Pemanfaatan pisang, singkong, dan cabai segar hasil panen pekarangan warga Desa Sumber Makmur menjaga cita rasa asli sekaligus menyerap hasil panen petani lokal.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-200/70 flex items-center gap-2 text-xs font-semibold text-leaf-800">
                <Leaf className="w-4 h-4 text-leaf-600" />
                <span>Panen Segar Terpilih</span>
              </div>
            </div>

            <div className="rounded-3xl bg-cream-50/80 border border-stone-200/85 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-leaf-700">
                  PILAR 02
                </span>
                <h3 className="mt-2 text-lg font-extrabold text-stone-900">
                  Resep Asli & Bebas Pengawet
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Formulasi bumbu tradisional rumahan yang diolah secara higienis. Tanpa bahan pengawet buatan, tanpa pewarna tekstil, dan menggunakan minyak goreng baru berkualitas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-200/70 flex items-center gap-2 text-xs font-semibold text-leaf-800">
                <ShieldCheck className="w-4 h-4 text-leaf-600" />
                <span>Aman Dikonsumsi Keluarga</span>
              </div>
            </div>

            <div className="rounded-3xl bg-cream-50/80 border border-stone-200/85 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-leaf-700">
                  PILAR 03
                </span>
                <h3 className="mt-2 text-lg font-extrabold text-stone-900">
                  100% Memberdayakan Ekonomi Desa
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Setiap rupiah pembelian Anda kembali langsung untuk kas operasional kelompok, permodalan bibit kebun, dan kesejahteraan keluarga ibu-ibu tani.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-200/70 flex items-center gap-2 text-xs font-semibold text-leaf-800">
                <HeartHandshake className="w-4 h-4 text-leaf-600" />
                <span>Ekonomi Gotong Royong</span>
              </div>
            </div>
          </div>

          {/* 2 Kartu Proses Produksi */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-3xl border border-stone-200/85 bg-gradient-to-br from-leaf-50/60 to-white p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-leaf-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-stone-900">
                  Pengolahan Dapur Bersama yang Higienis
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Setiap batch produksi dikerjakan secara terjadwal dengan peralatan bersih dan kemasan rapat agar kerenyahan keripik maupun aroma sambal tetap terjaga optimal hingga sampai ke tangan pembeli.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-stone-200/85 bg-gradient-to-br from-cream-100/70 to-white p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-earth-800 text-cream-50 flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-stone-900">
                  Produksi Segar Setiap Pekan (Fresh Made)
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Karena tidak memakai pengawet buatan, stok produk KWT Lestari diproduksi dalam jumlah terukur setiap pekan sehingga pembeli selalu mendapatkan stok baru yang segar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PANDUAN 3 LANGKAH PEMESANAN VIA WHATSAPP */}
      <section
        id="cara-pemesanan"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16"
      >
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-leaf-700">
            CARA PEMESANAN MUDAH
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Panduan 3 Langkah Pesan via WhatsApp
          </h2>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed">
            Tidak perlu registrasi akun atau bingung metode pembayaran. Pesanan Anda dirangkum otomatis dan terhubung langsung ke WhatsApp pengurus KWT Lestari.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Langkah 1 */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/85 shadow-card relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-leaf-50 border border-leaf-200/70 text-leaf-700 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-2xl font-extrabold text-stone-200">
                  01
                </span>
              </div>
              <span className="mt-4 block text-[11px] font-extrabold uppercase tracking-wider text-leaf-700">
                LANGKAH 1
              </span>
              <h3 className="mt-1 text-base sm:text-lg font-extrabold text-stone-900">
                Pilih Produk di Katalog
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                Telusuri etalase produk olahan tani seperti Keripik Pisang, Keripik Singkong, Sambal Chili Oil, atau Cabe Bubuk, lalu tekan tombol{' '}
                <strong className="text-leaf-700">+ Pesan</strong>.
              </p>
            </div>
            <Link
              href="/#katalog"
              className="mt-5 pt-3 border-t border-stone-100 inline-flex items-center gap-1.5 text-xs font-bold text-leaf-700 hover:text-leaf-800"
            >
              <span>Buka Katalog Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Langkah 2 */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/85 shadow-card relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-leaf-50 border border-leaf-200/70 text-leaf-700 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <span className="text-2xl font-extrabold text-stone-200">
                  02
                </span>
              </div>
              <span className="mt-4 block text-[11px] font-extrabold uppercase tracking-wider text-leaf-700">
                LANGKAH 2
              </span>
              <h3 className="mt-1 text-base sm:text-lg font-extrabold text-stone-900">
                Atur Jumlah di Keranjang
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                Klik tombol <strong className="text-stone-800">Keranjang</strong> di bagian atas layar. Tambah atau kurangi kuantitas produk sesuai keinginan, dan subtotal harga dihitung otomatis.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-100 text-xs font-semibold text-stone-500">
              Kalkulasi subtotal otomatis & akurat
            </div>
          </div>

          {/* Langkah 3 */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/85 shadow-card relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-leaf-600 text-white flex items-center justify-center shadow-sm">
                  <Send className="w-5 h-5" />
                </div>
                <span className="text-2xl font-extrabold text-stone-200">
                  03
                </span>
              </div>
              <span className="mt-4 block text-[11px] font-extrabold uppercase tracking-wider text-leaf-700">
                LANGKAH 3
              </span>
              <h3 className="mt-1 text-base sm:text-lg font-extrabold text-stone-900">
                Kirim Pesanan ke WhatsApp
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                Tekan tombol{' '}
                <strong className="text-leaf-700">
                  Checkout & Pesan via WhatsApp
                </strong>
                . Anda langsung diarahkan ke chat WhatsApp Admin dengan rincian pesanan lengkap siap kirim!
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-100 text-xs font-semibold text-leaf-700">
              Langsung terhubung dengan pengurus KWT
            </div>
          </div>
        </div>

        {/* Contoh Format Pesan Otomatis (Sesuai Referensi Stitch) */}
        <div className="mt-6 rounded-3xl bg-white border border-leaf-200/80 p-5 sm:p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-leaf-50 text-leaf-700 flex items-center justify-center shrink-0 mt-0.5">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block">
                Contoh Format Pesan Otomatis WhatsApp:
              </span>
              <p className="mt-1 text-xs text-stone-600 font-mono bg-cream-50 px-3 py-2 rounded-xl border border-stone-200/70 leading-relaxed">
                &ldquo;Halo Admin KWT Lestari Desa Sumber Makmur, saya ingin memesan: 1. Keripik Pisang Sweet Caramel (2 x Rp 15.000 = Rp 30.000), 2. Sambal Chili Oil (1 x Rp 25.000 = Rp 25.000). Total Estimasi: Rp 55.000&rdquo;
              </p>
            </div>
          </div>
          <Link
            href="/#katalog"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-leaf-600 hover:bg-leaf-700 text-white text-xs font-bold transition-colors"
          >
            <span>Mulai Pilih Produk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* SECTION 4: LOKASI & KONTAK PENGURUS (ALAMAT RESMI KOTAWARINGIN TIMUR) */}
      <section className="bg-white border-t border-stone-200/80 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Informasi Alamat & Kontak */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-leaf-700">
                  LOKASI & KONTAK PENGURUS
                </span>
                <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                  Dapur Produksi & Sekretariat KWT Lestari
                </h2>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                  Silakan hubungi pengurus untuk pemesanan eceran, pesanan acara/hajatan desa, maupun pengambilan langsung di lokasi produksi kami.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl bg-cream-50/90 border border-stone-200/80 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-leaf-100 text-leaf-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                      ALAMAT LENGKAP
                    </span>
                    <p className="mt-0.5 text-sm font-bold text-stone-900">
                      {KWT_INFO.village}, {KWT_INFO.subdistrict}
                    </p>
                    <p className="text-xs sm:text-sm text-stone-600 mt-0.5 leading-relaxed">
                      {KWT_INFO.fullAddress}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cream-50/90 border border-stone-200/80 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-leaf-100 text-leaf-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                      JAM LAYANAN PESANAN
                    </span>
                    <p className="mt-0.5 text-sm font-bold text-stone-900">
                      {KWT_INFO.operationalHours}
                    </p>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Pesan di luar jam kerja tetap diterima dan dibalas pada jam operasional berikutnya.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cream-50/90 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-leaf-600 text-white flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                        WHATSAPP ADMIN PEMESANAN
                      </span>
                      <p className="mt-0.5 text-sm font-bold text-stone-900">
                        {formatWaDisplay(settings.wa_number)}
                      </p>
                    </div>
                  </div>
                  <a
                    href={directChatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-leaf-600 hover:bg-leaf-700 text-white text-xs font-bold transition-colors shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat Sekarang</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Peta Lokasi Google Maps */}
            <div className="lg:col-span-6 space-y-3">
              <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-soft bg-stone-100 aspect-[16/11]">
                <iframe
                  title="Peta Lokasi KWT Lestari Desa Sumber Makmur"
                  src={KWT_INFO.mapsEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-4 rounded-2xl bg-cream-50 border border-stone-200/80 flex items-center justify-between gap-3">
                <div className="text-xs text-stone-600">
                  <strong className="text-stone-900 block">
                    Titik Lokasi Wilayah Desa Sumber Makmur
                  </strong>
                  Kec. Mentaya Hilir Utara, Kab. Kotawaringin Timur, Kalimantan Tengah 74361
                </div>
                <a
                  href={KWT_INFO.mapsDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs font-bold text-leaf-700 shrink-0 transition-colors"
                >
                  <span>Buka Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
