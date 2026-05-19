import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await db.laporan.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Laporan tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Error fetching laporan:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data laporan" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const item = await db.laporan.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.subject !== undefined && { subject: body.subject }),
        ...(body.message !== undefined && { message: body.message }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.images !== undefined && { images: body.images }),
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Error updating laporan:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui laporan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.laporan.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Laporan berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting laporan:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus laporan" },
      { status: 500 }
    );
  }
}
