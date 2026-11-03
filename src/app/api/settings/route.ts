import { NextRequest, NextResponse } from 'next/server';
import { getStorePayload, updateStoreSettingsRecord } from '@/lib/data-service';
import { verifyAdminRequest } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getStorePayload();
    return NextResponse.json({ settings: payload.settings, source: payload.source });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal memuat pengaturan toko.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin) {
      return NextResponse.json(
        { error: 'Sesi tidak valid. Silakan login kembali sebagai Admin.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const rawWa = String(body?.wa_number || '').trim();
    if (!rawWa || rawWa.replace(/\D/g, '').length < 9) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp tujuan tidak valid (minimal 9 digit).' },
        { status: 400 }
      );
    }

    const settings = await updateStoreSettingsRecord({
      wa_number: rawWa,
      wa_greeting: String(body?.wa_greeting || '').trim(),
    });

    return NextResponse.json({ settings });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan pengaturan toko.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
