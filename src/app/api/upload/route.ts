import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, verifyAdminRequest } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const BUCKET_NAME = 'product-images';

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin) {
      return NextResponse.json(
        { error: 'Sesi tidak valid. Silakan login kembali sebagai Admin.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File gambar tidak ditemukan.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Format file harus berupa gambar (JPG, PNG, WEBP).' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Ukuran gambar maksimal 5 MB.' },
        { status: 400 }
      );
    }

    // Pastikan bucket product-images tersedia dan bersifat public
    const { data: bucket } = await supabaseAdmin.storage.getBucket(BUCKET_NAME);
    if (!bucket) {
      await supabaseAdmin.storage.createBucket(BUCKET_NAME, { public: true });
    }

    const ext = (file.name.split('.').pop() || 'webp').toLowerCase().replace(/[^a-z0-9]/g, '');
    const safeName = `kwt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || 'webp'}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(safeName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(safeName);

    return NextResponse.json({
      url: publicUrlData.publicUrl,
      path: safeName,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal mengunggah gambar produk.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
