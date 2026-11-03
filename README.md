# Sistem Informasi E-Commerce KWT Lestari — Desa Sumber Makmur

Platform etalase digital *Mobile-First* untuk memasarkan produk olahan hasil tani karya ibu-ibu **Kelompok Wanita Tani (KWT) Lestari Desa Sumber Makmur**, Kec. Mentaya Hilir Utara, Kabupaten Kotawaringin Timur, Kalimantan Tengah 74361.

Seluruh pesanan pembeli diakumulasi dalam **Keranjang Belanja Lokal (*Cart Drawer*)** dan di-*routing* secara dinamis menjadi pesan pesanan siap kirim ke nomor **WhatsApp Admin**.

---

## Tech Stack
- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS (Mobile-First, 2 kolom ponsel & 4 kolom desktop)
- **Database, Auth & Storage**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage, Supabase Realtime)
- **Deployment**: Siap deploy ke Vercel (`vercel.json` + Cron Keep-Alive)

---

## Cara Menjalankan di Komputer Lokal

### Opsi 1: Klik 2x `Jalankan_Website.bat` (Windows)
Klik dua kali file `Jalankan_Website.bat` untuk menyalakan server lokal dan membuka `http://localhost:3000` secara otomatis.

### Opsi 2: Melalui Terminal
```bash
npm install
npm run dev
```
Lalu buka:
- **Katalog Pembeli**: `http://localhost:3000`
- **Tentang Kami & Cara Pemesanan**: `http://localhost:3000/tentang-kami`
- **Login Admin**: `http://localhost:3000/admin/login`
- **Dashboard Pengurus**: `http://localhost:3000/admin`

---

## Akun Login Admin (Supabase Auth)

Akun pengurus telah dikonfigurasi dan terverifikasi pada proyek Supabase Anda:
- **Email**: `admin@kwtlestari.id`
- **Kata Sandi**: `AdminKWT2026!`

*(Anda dapat menambahkan akun pengurus lain atau mengganti kata sandi kapan saja melalui menu **Authentication -> Users** di Dashboard Supabase).*

---

## Inisialisasi Tabel PostgreSQL Supabase (`supabase/schema.sql`)

Bucket penyimpanan foto (`product-images`) dan akun autentikasi Admin sudah aktif secara otomatis. Untuk mengaktifkan tabel PostgreSQL `products` dan `store_settings` beserta kebijakan RLS & *Realtime*:

1. Buka [Supabase SQL Editor](https://supabase.com/dashboard/project/izewbwgaesntptvakalk/sql/new).
2. Salin seluruh isi file [`supabase/schema.sql`](./supabase/schema.sql), tempel ke editor, lalu klik **Run**.

---

## Deploy ke Vercel

1. Unggah repositori ini ke GitHub/GitLab.
2. Impor proyek ke [Vercel](https://vercel.com/new).
3. Tambahkan Environment Variables berikut pada pengaturan proyek Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Klik **Deploy**.
