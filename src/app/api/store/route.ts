import { NextResponse } from 'next/server';
import { getStorePayload } from '@/lib/data-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const payload = await getStorePayload();
    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal memuat data toko.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
