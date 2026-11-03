import { NextRequest, NextResponse } from 'next/server';
import { createProductRecord, getStorePayload } from '@/lib/data-service';
import { verifyAdminRequest } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getStorePayload();
    return NextResponse.json({ products: payload.products, source: payload.source });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal mengambil daftar produk.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin) {
      return NextResponse.json(
        { error: 'Sesi tidak valid. Silakan login kembali sebagai Admin.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (!body?.name || String(body.name).trim().length === 0) {
      return NextResponse.json({ error: 'Nama produk wajib diisi.' }, { status: 400 });
    }
    if (body?.price === undefined || Number.isNaN(Number(body.price)) || Number(body.price) < 0) {
      return NextResponse.json({ error: 'Harga produk tidak valid.' }, { status: 400 });
    }

    const product = await createProductRecord({
      name: String(body.name),
      price: Number(body.price),
      category: body.category ? String(body.category) : 'Keripik',
      weight: body.weight ? String(body.weight) : '',
      description: body.description ? String(body.description) : '',
      image_url: body.image_url ? String(body.image_url) : '',
      is_available: body.is_available !== false,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menambahkan produk.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
