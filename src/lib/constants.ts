import { Product, StoreSettings } from '@/types';

export const KWT_INFO = {
  name: 'Kelompok Wanita Tani (KWT) Lestari',
  shortName: 'KWT Lestari',
  tagline: 'Olahan Tani Berdaya',
  village: 'Desa Sumber Makmur',
  subdistrict: 'Kec. Mentaya Hilir Utara',
  regency: 'Kabupaten Kotawaringin Timur',
  province: 'Kalimantan Tengah',
  postalCode: '74361',
  fullAddress:
    'Desa Sumber Makmur, Kec. Mentaya Hilir Utara, Kabupaten Kotawaringin Timur, Kalimantan Tengah 74361',
  operationalHours: 'Senin – Sabtu, 08.00 – 17.00 WIB',
  mapsEmbedUrl:
    'https://maps.google.com/maps?q=Sumber%20Makmur%2C%20Mentaya%20Hilir%20Utara%2C%20Kotawaringin%20Timur%2C%20Kalimantan%20Tengah%2074361&t=&z=13&ie=UTF8&iwloc=&output=embed',
  mapsDirectUrl:
    'https://www.google.com/maps/search/?api=1&query=Desa+Sumber+Makmur+Kec+Mentaya+Hilir+Utara+Kabupaten+Kotawaringin+Timur+Kalimantan+Tengah+74361',
};

export interface PartnerLogoItem {
  id: string;
  name: string;
  shortLabel: string;
  role: string;
  src: string;
  supabaseUrl: string;
  isWide?: boolean;
}

export const PARTNER_LOGOS: PartnerLogoItem[] = [
  {
    id: 'tut-wuri-handayani',
    name: 'Tut Wuri Handayani (Kemdiktisaintek RI)',
    shortLabel: 'Tut Wuri Handayani',
    role: 'Kementerian Pendidikan Tinggi, Sains, dan Teknologi',
    src: '/logos/tut-wuri-handayani.png',
    supabaseUrl:
      'https://izewbwgaesntptvakalk.supabase.co/storage/v1/object/public/product-images/logos/tut-wuri-handayani.png',
  },
  {
    id: 'diktisaintek-berdampak',
    name: 'Diktisaintek Berdampak',
    shortLabel: 'Diktisaintek Berdampak',
    role: 'Program Diktisaintek Berdampak bagi Masyarakat',
    src: '/logos/diktisaintek-berdampak.png',
    supabaseUrl:
      'https://izewbwgaesntptvakalk.supabase.co/storage/v1/object/public/product-images/logos/diktisaintek-berdampak.png',
  },
  {
    id: 'bima',
    name: 'BIMA (Basis Informasi Penelitian & Pengabdian kepada Masyarakat)',
    shortLabel: 'BIMA',
    role: 'Basis Informasi Penelitian & Pengabdian Masyarakat',
    src: '/logos/bima.png',
    supabaseUrl:
      'https://izewbwgaesntptvakalk.supabase.co/storage/v1/object/public/product-images/logos/bima.png',
    isWide: true,
  },
  {
    id: 'universitas-darwan-ali',
    name: 'Universitas Darwan Ali (UNDA)',
    shortLabel: 'Universitas Darwan Ali',
    role: 'Perguruan Tinggi Pelaksana — Kotawaringin Timur',
    src: '/logos/universitas-darwan-ali.png',
    supabaseUrl:
      'https://izewbwgaesntptvakalk.supabase.co/storage/v1/object/public/product-images/logos/universitas-darwan-ali.png',
  },
  {
    id: 'mahasiswa-berdampak-unda',
    name: 'Mahasiswa Berdampak Universitas Darwan Ali Tahun 2026',
    shortLabel: 'Mahasiswa Berdampak UNDA 2026',
    role: 'Tim Pelaksana Pemberdayaan Desa Sumber Makmur 2026',
    src: '/logos/mahasiswa-berdampak-unda.png',
    supabaseUrl:
      'https://izewbwgaesntptvakalk.supabase.co/storage/v1/object/public/product-images/logos/mahasiswa-berdampak-unda.png',
  },
  {
    id: 'mahasiswa-berdampak',
    name: 'Mahasiswa Berdampak',
    shortLabel: 'Mahasiswa Berdampak',
    role: 'Gerakan Kolaborasi Mahasiswa untuk Kemandirian Desa',
    src: '/logos/mahasiswa-berdampak.png',
    supabaseUrl:
      'https://izewbwgaesntptvakalk.supabase.co/storage/v1/object/public/product-images/logos/mahasiswa-berdampak.png',
    isWide: true,
  },
];

export const PRODUCT_CATEGORIES = [
  'Semua',
  'Keripik',
  'Sambal',
  'Bumbu & Rempah',
  'Olahan Lainnya',
] as const;

export const ADMIN_CATEGORIES = [
  'Keripik',
  'Sambal',
  'Bumbu & Rempah',
  'Olahan Lainnya',
] as const;

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  id: '00000000-0000-4000-8000-000000000001',
  wa_number: '6281250007436',
  wa_greeting:
    'Halo Admin KWT Lestari Desa Sumber Makmur, saya ingin memesan produk olahan tani berikut:',
  updated_at: new Date().toISOString(),
};

export const INITIAL_PRODUCTS_SEED: Product[] = [
  {
    id: '11111111-1111-4111-8111-111111111101',
    name: 'Keripik Pisang Sweet Caramel',
    price: 15000,
    category: 'Keripik',
    weight: '120g',
    description:
      'Olahan pisang kepok pilihan hasil kebun warga Desa Sumber Makmur dengan balutan karamel manis renyah tanpa pemanis buatan.',
    image_url: '',
    is_available: true,
    created_at: '2026-01-01T08:00:00.000Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111102',
    name: 'Keripik Singkong Original',
    price: 12000,
    category: 'Keripik',
    weight: '150g',
    description:
      'Irisan tipis singkong segar renyah dengan bumbu bawang putih dan garam rempah alami khas dapur KWT Lestari.',
    image_url: '',
    is_available: true,
    created_at: '2026-01-01T08:05:00.000Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111103',
    name: 'Keripik Pisang Cokelat',
    price: 15000,
    category: 'Keripik',
    weight: '120g',
    description:
      'Keripik pisang renyah berbalut bubuk cokelat lumer favorit keluarga, diproduksi higienis tanpa bahan pengawet.',
    image_url: '',
    is_available: true,
    created_at: '2026-01-01T08:10:00.000Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111104',
    name: 'Sambal Chili Oil',
    price: 25000,
    category: 'Sambal',
    weight: '150ml',
    description:
      'Minyak cabai aromatik dari cabai merah kering, bawang putih segar, dan rempah pilihan dengan sensasi pedas gurih.',
    image_url: '',
    is_available: true,
    created_at: '2026-01-01T08:15:00.000Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111105',
    name: 'Cabe Bubuk',
    price: 20000,
    category: 'Bumbu & Rempah',
    weight: '100g',
    description:
      '100% cabai rawit merah hasil panen petani lokal yang dikeringkan alami dan digiling halus tanpa campuran pewarna.',
    image_url: '',
    is_available: true,
    created_at: '2026-01-01T08:20:00.000Z',
  },
];
