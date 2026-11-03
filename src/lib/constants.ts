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
