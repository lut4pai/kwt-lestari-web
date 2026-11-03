import { CartItem, StoreSettings } from '@/types';

/**
 * Format angka menjadi mata uang Rupiah (contoh: Rp 15.000)
 */
export function formatRupiah(amount: number): string {
  const numeric = Number.isFinite(amount) ? Math.round(amount) : 0;
  return 'Rp ' + numeric.toLocaleString('id-ID');
}

/**
 * Normalisasi nomor WhatsApp ke format internasional tanpa tanda + (contoh: 628123456789)
 */
export function normalizeWaNumber(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (!digits) return '6281250007436';
  if (digits.startsWith('0')) {
    return '62' + digits.slice(1);
  }
  if (digits.startsWith('8')) {
    return '62' + digits;
  }
  return digits;
}

/**
 * Format tampilan nomor WhatsApp agar mudah dibaca (contoh: +62 812-5000-7436)
 */
export function formatWaDisplay(raw: string): string {
  const clean = normalizeWaNumber(raw);
  if (clean.startsWith('62') && clean.length >= 10) {
    const rest = clean.slice(2);
    const p1 = rest.slice(0, 3);
    const p2 = rest.slice(3, 7);
    const p3 = rest.slice(7);
    return `+62 ${p1}-${p2}${p3 ? '-' + p3 : ''}`;
  }
  return `+${clean}`;
}

export interface CheckoutOrderParams {
  settings: StoreSettings;
  items: CartItem[];
  buyerName?: string;
  buyerAddress?: string;
  buyerNote?: string;
}

/**
 * Menyusun pesan pesanan WhatsApp lengkap & terstruktur
 */
export function composeWhatsAppMessage({
  settings,
  items,
  buyerName,
  buyerAddress,
  buyerNote,
}: CheckoutOrderParams): string {
  const greeting =
    settings.wa_greeting?.trim() ||
    'Halo Admin KWT Lestari Desa Sumber Makmur, saya ingin memesan produk berikut:';

  const lines: string[] = [greeting, ''];
  lines.push('*DAFTAR PESANAN:*');

  let grandTotal = 0;
  items.forEach((item, index) => {
    const lineTotal = Number(item.product.price) * item.quantity;
    grandTotal += lineTotal;
    const weightInfo = item.product.weight ? ` (${item.product.weight})` : '';
    lines.push(
      `${index + 1}. *${item.product.name}*${weightInfo}\n   ${item.quantity} x ${formatRupiah(item.product.price)} = *${formatRupiah(lineTotal)}*`
    );
  });

  lines.push('');
  lines.push(`*Total Estimasi Produk: ${formatRupiah(grandTotal)}*`);
  lines.push('_(Belum termasuk ongkos kirim jika diantar)_');

  if (buyerName?.trim() || buyerAddress?.trim() || buyerNote?.trim()) {
    lines.push('');
    lines.push('*DATA PEMESAN:*');
    if (buyerName?.trim()) lines.push(`• Nama: ${buyerName.trim()}`);
    if (buyerAddress?.trim()) lines.push(`• Alamat/Tujuan: ${buyerAddress.trim()}`);
    if (buyerNote?.trim()) lines.push(`• Catatan: ${buyerNote.trim()}`);
  }

  lines.push('');
  lines.push('Mohon konfirmasi ketersediaan stok dan informasi pengirimannya. Terima kasih! 🙏🌿');

  return lines.join('\n');
}

/**
 * Menghasilkan URL redirect resmi wa.me dengan teks URL-encoded
 */
export function buildWhatsAppCheckoutUrl(params: CheckoutOrderParams): string {
  const targetNumber = normalizeWaNumber(params.settings.wa_number);
  const message = composeWhatsAppMessage(params);
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}
