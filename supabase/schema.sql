-- ============================================================================
-- SKEMA DATABASE SUPABASE POSTGRESQL — KWT LESTARI DESA SUMBER MAKMUR
-- Jalankan seluruh isi file ini pada menu "SQL Editor" di Dashboard Supabase.
-- ============================================================================

-- Aktifkan ekstensi UUID jika belum aktif
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. TABEL PRODUK (`products`)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL DEFAULT 'Keripik',
  weight TEXT DEFAULT '120g',
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pastikan kolom tambahan tersedia bila tabel dibuat versi minimal sebelumnya
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Keripik';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight TEXT DEFAULT '120g';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- ----------------------------------------------------------------------------
-- 2. TABEL PENGATURAN TOKO (`store_settings`) — 1 Baris Konfigurasi Global
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wa_number TEXT NOT NULL DEFAULT '6281250007436',
  wa_greeting TEXT NOT NULL DEFAULT 'Halo Admin KWT Lestari Desa Sumber Makmur, saya ingin memesan produk olahan tani berikut:',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Kebijakan Baca Publik (Pembeli dapat melihat katalog & nomor WA tujuan)
DROP POLICY IF EXISTS "Public can read products" ON public.products;
CREATE POLICY "Public can read products"
  ON public.products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can read store_settings" ON public.store_settings;
CREATE POLICY "Public can read store_settings"
  ON public.store_settings FOR SELECT
  USING (true);

-- Kebijakan Tulis Admin Terautentikasi (Supabase Auth)
DROP POLICY IF EXISTS "Authenticated admin can insert products" ON public.products;
CREATE POLICY "Authenticated admin can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admin can update products" ON public.products;
CREATE POLICY "Authenticated admin can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admin can delete products" ON public.products;
CREATE POLICY "Authenticated admin can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated admin can insert store_settings" ON public.store_settings;
CREATE POLICY "Authenticated admin can insert store_settings"
  ON public.store_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admin can update store_settings" ON public.store_settings;
CREATE POLICY "Authenticated admin can update store_settings"
  ON public.store_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 4. SUPABASE STORAGE BUCKET & POLICIES (`product-images`)
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read access for product-images" ON storage.objects;
CREATE POLICY "Public read access for product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated upload for product-images" ON storage.objects;
CREATE POLICY "Authenticated upload for product-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated update for product-images" ON storage.objects;
CREATE POLICY "Authenticated update for product-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated delete for product-images" ON storage.objects;
CREATE POLICY "Authenticated delete for product-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- ----------------------------------------------------------------------------
-- 5. AKTIFKAN REALTIME SUBSCRIPTION
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'store_settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 6. SEED DATA AWAL (Hanya dimasukkan apabila tabel masih kosong)
-- ----------------------------------------------------------------------------
INSERT INTO public.store_settings (wa_number, wa_greeting)
SELECT
  '6281250007436',
  'Halo Admin KWT Lestari Desa Sumber Makmur, saya ingin memesan produk olahan tani berikut:'
WHERE NOT EXISTS (SELECT 1 FROM public.store_settings);

INSERT INTO public.products (name, price, category, weight, description, image_url, is_available)
SELECT * FROM (VALUES
  (
    'Keripik Pisang Sweet Caramel',
    15000,
    'Keripik',
    '120g',
    'Olahan pisang kepok pilihan hasil kebun warga Desa Sumber Makmur dengan balutan karamel manis renyah tanpa pemanis buatan.',
    '',
    TRUE
  ),
  (
    'Keripik Singkong Original',
    12000,
    'Keripik',
    '150g',
    'Irisan tipis singkong segar renyah dengan bumbu bawang dan garam rempah alami khas dapur KWT Lestari.',
    '',
    TRUE
  ),
  (
    'Keripik Pisang Cokelat',
    15000,
    'Keripik',
    '120g',
    'Keripik pisang renyah berbalut bubuk cokelat lumer favorit keluarga, diproduksi higienis tanpa bahan pengawet.',
    '',
    TRUE
  ),
  (
    'Sambal Chili Oil',
    25000,
    'Sambal',
    '150ml',
    'Minyak cabai aromatik dari cabai merah kering, bawang putih segar, dan rempah pilihan dengan sensasi pedas gurih.',
    '',
    TRUE
  ),
  (
    'Cabe Bubuk Murni',
    20000,
    'Bumbu & Rempah',
    '100g',
    '100% cabai rawit merah hasil panen petani lokal yang dikeringkan alami dan digiling halus tanpa campuran pewarna.',
    '',
    TRUE
  )
) AS seed(name, price, category, weight, description, image_url, is_available)
WHERE NOT EXISTS (SELECT 1 FROM public.products);
