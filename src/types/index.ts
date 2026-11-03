export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  weight?: string;
  description?: string;
  image_url: string;
  is_available: boolean;
  created_at: string;
}

export interface StoreSettings {
  id: string;
  wa_number: string;
  wa_greeting: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type StorageSourceMode = 'postgres' | 'cloud_storage_fallback';

export interface StorePayload {
  products: Product[];
  settings: StoreSettings;
  source: StorageSourceMode;
}
