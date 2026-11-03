import { NextResponse } from 'next/server';
import { getStorePayload } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getStorePayload();
    return NextResponse.json({
      ok: true,
      source: payload.source,
      productsCount: payload.products.length,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
