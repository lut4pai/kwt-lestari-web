import { NextRequest, NextResponse } from 'next/server';
import { deleteProductRecord, updateProductRecord } from '@/lib/data-service';
import { verifyAdminRequest } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin) {
      return NextResponse.json(
        { error: 'Sesi tidak valid. Silakan login kembali sebagai Admin.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const product = await updateProductRecord(params.id, {
      name: body.name,
      price: body.price !== undefined ? Number(body.price) : undefined,
      category: body.category,
      weight: body.weight,
      description: body.description,
      image_url: body.image_url,
      is_available: body.is_available,
    });

    return NextResponse.json({ product });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal memperbarui produk.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin) {
      return NextResponse.json(
        { error: 'Sesi tidak valid. Silakan login kembali sebagai Admin.' },
        { status: 401 }
      );
    }

    await deleteProductRecord(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus produk.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
