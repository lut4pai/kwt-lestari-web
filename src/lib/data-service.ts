import { randomUUID } from 'crypto';
import { supabaseAdmin } from './supabase-admin';
import { DEFAULT_STORE_SETTINGS, INITIAL_PRODUCTS_SEED } from './constants';
import { normalizeWaNumber } from './utils';
import { Product, StorageSourceMode, StorePayload, StoreSettings } from '@/types';

const CLOUD_BUCKET = 'kwt-cloud-store';
const CLOUD_STATE_FILE = 'store-state-v1.json';

interface CloudFallbackState {
  products: Product[];
  settings: StoreSettings;
}

function normalizeProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id || randomUUID()),
    name: String(row.name || 'Produk KWT Lestari'),
    price: Number(row.price ?? 0),
    category: String(row.category || 'Keripik'),
    weight: row.weight ? String(row.weight) : '',
    description: row.description ? String(row.description) : '',
    image_url: row.image_url ? String(row.image_url) : '',
    is_available: row.is_available !== false,
    created_at: row.created_at ? String(row.created_at) : new Date().toISOString(),
  };
}

function normalizeSettings(row?: Record<string, unknown> | null): StoreSettings {
  if (!row) return { ...DEFAULT_STORE_SETTINGS };
  return {
    id: String(row.id || DEFAULT_STORE_SETTINGS.id),
    wa_number: normalizeWaNumber(String(row.wa_number || DEFAULT_STORE_SETTINGS.wa_number)),
    wa_greeting: String(row.wa_greeting ?? DEFAULT_STORE_SETTINGS.wa_greeting),
    updated_at: row.updated_at ? String(row.updated_at) : new Date().toISOString(),
  };
}

async function ensureBucket(bucketId: string, isPublic: boolean) {
  const { data } = await supabaseAdmin.storage.getBucket(bucketId);
  if (!data) {
    await supabaseAdmin.storage.createBucket(bucketId, { public: isPublic });
  }
}

async function readCloudFallback(): Promise<CloudFallbackState> {
  await ensureBucket(CLOUD_BUCKET, false);
  const { data, error } = await supabaseAdmin.storage
    .from(CLOUD_BUCKET)
    .download(CLOUD_STATE_FILE);

  if (error || !data) {
    const initial: CloudFallbackState = {
      products: [...INITIAL_PRODUCTS_SEED],
      settings: { ...DEFAULT_STORE_SETTINGS },
    };
    await writeCloudFallback(initial);
    return initial;
  }

  try {
    const text = await data.text();
    const parsed = JSON.parse(text) as Partial<CloudFallbackState>;
    return {
      products: Array.isArray(parsed.products)
        ? parsed.products.map((p) => normalizeProduct(p as unknown as Record<string, unknown>))
        : [...INITIAL_PRODUCTS_SEED],
      settings: normalizeSettings(parsed.settings as unknown as Record<string, unknown>),
    };
  } catch {
    return {
      products: [...INITIAL_PRODUCTS_SEED],
      settings: { ...DEFAULT_STORE_SETTINGS },
    };
  }
}

async function writeCloudFallback(state: CloudFallbackState): Promise<void> {
  await ensureBucket(CLOUD_BUCKET, false);
  const payload = Buffer.from(JSON.stringify(state, null, 2), 'utf-8');
  await supabaseAdmin.storage.from(CLOUD_BUCKET).upload(CLOUD_STATE_FILE, payload, {
    contentType: 'application/json',
    upsert: true,
  });
}

function isMissingTableError(err: { code?: string; message?: string } | null): boolean {
  if (!err) return false;
  return (
    err.code === 'PGRST205' ||
    err.code === '42P01' ||
    Boolean(err.message?.includes('Could not find the table'))
  );
}

function isMissingColumnError(err: { code?: string; message?: string } | null): boolean {
  if (!err) return false;
  return (
    err.code === 'PGRST204' ||
    err.code === '42703' ||
    Boolean(err.message?.includes('Could not find the') && err.message?.includes('column'))
  );
}

/**
 * Mengambil seluruh data katalog produk + pengaturan toko (PostgreSQL utama, fallback Cloud Storage)
 */
export async function getStorePayload(): Promise<StorePayload> {
  const productsRes = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (isMissingTableError(productsRes.error)) {
    const fallback = await readCloudFallback();
    return {
      products: fallback.products,
      settings: fallback.settings,
      source: 'cloud_storage_fallback',
    };
  }

  let products = (productsRes.data || []).map((row) =>
    normalizeProduct(row as Record<string, unknown>)
  );

  // Jika tabel PostgreSQL baru saja dibuat tetapi masih kosong, sinkronkan data awal otomatis
  if (products.length === 0 && !productsRes.error) {
    const seedSource = await readCloudFallback();
    for (const item of seedSource.products) {
      const fullInsert = await supabaseAdmin.from('products').insert({
        name: item.name,
        price: item.price,
        category: item.category || 'Keripik',
        weight: item.weight || '',
        description: item.description || '',
        image_url: item.image_url || '',
        is_available: item.is_available,
      });
      if (isMissingColumnError(fullInsert.error)) {
        await supabaseAdmin.from('products').insert({
          name: item.name,
          price: item.price,
          image_url: item.image_url || '',
          is_available: item.is_available,
        });
      }
    }
    const reRead = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    products = (reRead.data || []).map((row) =>
      normalizeProduct(row as Record<string, unknown>)
    );
  }

  let settings: StoreSettings = { ...DEFAULT_STORE_SETTINGS };
  let source: StorageSourceMode = 'postgres';

  const settingsRes = await supabaseAdmin
    .from('store_settings')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1);

  if (isMissingTableError(settingsRes.error)) {
    const fallback = await readCloudFallback();
    settings = fallback.settings;
    source = 'cloud_storage_fallback';
  } else if (settingsRes.data && settingsRes.data.length > 0) {
    settings = normalizeSettings(settingsRes.data[0] as Record<string, unknown>);
  } else {
    const fallback = await readCloudFallback();
    const inserted = await supabaseAdmin
      .from('store_settings')
      .insert({
        wa_number: normalizeWaNumber(fallback.settings.wa_number),
        wa_greeting: fallback.settings.wa_greeting,
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();
    if (inserted.data) {
      settings = normalizeSettings(inserted.data as Record<string, unknown>);
    }
  }

  return { products, settings, source };
}

export interface UpsertProductInput {
  name: string;
  price: number;
  category?: string;
  weight?: string;
  description?: string;
  image_url?: string;
  is_available?: boolean;
}

export async function createProductRecord(input: UpsertProductInput): Promise<Product> {
  const cleanPayload = {
    name: input.name.trim(),
    price: Math.max(0, Number(input.price) || 0),
    category: (input.category || 'Keripik').trim(),
    weight: (input.weight || '').trim(),
    description: (input.description || '').trim(),
    image_url: (input.image_url || '').trim(),
    is_available: input.is_available !== false,
  };

  const res = await supabaseAdmin
    .from('products')
    .insert(cleanPayload)
    .select('*')
    .single();

  if (!res.error && res.data) {
    return normalizeProduct(res.data as Record<string, unknown>);
  }

  if (isMissingColumnError(res.error)) {
    const minRes = await supabaseAdmin
      .from('products')
      .insert({
        name: cleanPayload.name,
        price: cleanPayload.price,
        image_url: cleanPayload.image_url,
        is_available: cleanPayload.is_available,
      })
      .select('*')
      .single();
    if (minRes.data) {
      return normalizeProduct({
        ...(minRes.data as Record<string, unknown>),
        category: cleanPayload.category,
        weight: cleanPayload.weight,
        description: cleanPayload.description,
      });
    }
  }

  if (isMissingTableError(res.error)) {
    const state = await readCloudFallback();
    const created: Product = {
      id: randomUUID(),
      ...cleanPayload,
      created_at: new Date().toISOString(),
    };
    state.products = [created, ...state.products];
    await writeCloudFallback(state);
    return created;
  }

  throw new Error(res.error?.message || 'Gagal menambahkan produk.');
}

export async function updateProductRecord(
  id: string,
  input: Partial<UpsertProductInput>
): Promise<Product> {
  const fullUpdate: Record<string, unknown> = {};
  if (input.name !== undefined) fullUpdate.name = input.name.trim();
  if (input.price !== undefined) fullUpdate.price = Math.max(0, Number(input.price) || 0);
  if (input.category !== undefined) fullUpdate.category = input.category.trim();
  if (input.weight !== undefined) fullUpdate.weight = input.weight.trim();
  if (input.description !== undefined) fullUpdate.description = input.description.trim();
  if (input.image_url !== undefined) fullUpdate.image_url = input.image_url.trim();
  if (input.is_available !== undefined) fullUpdate.is_available = Boolean(input.is_available);

  const res = await supabaseAdmin
    .from('products')
    .update(fullUpdate)
    .eq('id', id)
    .select('*')
    .single();

  if (!res.error && res.data) {
    return normalizeProduct(res.data as Record<string, unknown>);
  }

  if (isMissingColumnError(res.error)) {
    const minUpdate: Record<string, unknown> = {};
    if (fullUpdate.name !== undefined) minUpdate.name = fullUpdate.name;
    if (fullUpdate.price !== undefined) minUpdate.price = fullUpdate.price;
    if (fullUpdate.image_url !== undefined) minUpdate.image_url = fullUpdate.image_url;
    if (fullUpdate.is_available !== undefined) minUpdate.is_available = fullUpdate.is_available;

    const minRes = await supabaseAdmin
      .from('products')
      .update(minUpdate)
      .eq('id', id)
      .select('*')
      .single();

    if (minRes.data) {
      return normalizeProduct({
        ...(minRes.data as Record<string, unknown>),
        category: fullUpdate.category ?? 'Keripik',
        weight: fullUpdate.weight ?? '',
        description: fullUpdate.description ?? '',
      });
    }
  }

  if (isMissingTableError(res.error)) {
    const state = await readCloudFallback();
    const idx = state.products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Produk tidak ditemukan.');
    const updated: Product = {
      ...state.products[idx],
      ...(fullUpdate as Partial<Product>),
    };
    state.products[idx] = updated;
    await writeCloudFallback(state);
    return updated;
  }

  throw new Error(res.error?.message || 'Gagal memperbarui produk.');
}

export async function deleteProductRecord(id: string): Promise<void> {
  const res = await supabaseAdmin.from('products').delete().eq('id', id);

  if (!res.error) return;

  if (isMissingTableError(res.error)) {
    const state = await readCloudFallback();
    state.products = state.products.filter((p) => p.id !== id);
    await writeCloudFallback(state);
    return;
  }

  throw new Error(res.error?.message || 'Gagal menghapus produk.');
}

export async function updateStoreSettingsRecord(input: {
  wa_number: string;
  wa_greeting: string;
}): Promise<StoreSettings> {
  const normalizedNumber = normalizeWaNumber(input.wa_number);
  const greeting = input.wa_greeting.trim();
  const now = new Date().toISOString();

  const existing = await supabaseAdmin
    .from('store_settings')
    .select('*')
    .limit(1);

  if (isMissingTableError(existing.error)) {
    const state = await readCloudFallback();
    state.settings = {
      ...state.settings,
      wa_number: normalizedNumber,
      wa_greeting: greeting,
      updated_at: now,
    };
    await writeCloudFallback(state);
    return state.settings;
  }

  if (existing.data && existing.data.length > 0) {
    const targetId = String((existing.data[0] as Record<string, unknown>).id);
    const updated = await supabaseAdmin
      .from('store_settings')
      .update({
        wa_number: normalizedNumber,
        wa_greeting: greeting,
        updated_at: now,
      })
      .eq('id', targetId)
      .select('*')
      .single();

    if (updated.error) {
      throw new Error(updated.error.message);
    }
    return normalizeSettings(updated.data as Record<string, unknown>);
  }

  const inserted = await supabaseAdmin
    .from('store_settings')
    .insert({
      wa_number: normalizedNumber,
      wa_greeting: greeting,
      updated_at: now,
    })
    .select('*')
    .single();

  if (inserted.error) {
    throw new Error(inserted.error.message);
  }
  return normalizeSettings(inserted.data as Record<string, unknown>);
}
