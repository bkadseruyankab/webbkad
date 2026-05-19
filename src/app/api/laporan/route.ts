import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const all = url.searchParams.get("all");
    const category = url.searchParams.get("category");
    const status = url.searchParams.get("status");

    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;

    const items = await db.laporan.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // By default only return non-sensitive info for public
    if (!all) {
      return NextResponse.json({
        success: true,
        data: items.map((item) => ({
          id: item.id,
          name: item.name,
          subject: item.subject,
          category: item.category,
          status: item.status,
          createdAt: item.createdAt,
        })),
      });
    }

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Error fetching laporan:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data laporan" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message, category, images } = body;

    if (!name || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Nama, subjek, dan pesan wajib diisi" },
        { status: 400 }
      );
    }

    const item = await db.laporan.create({
      data: {
        name,
        email: email || "",
        phone: phone || "",
        subject,
        message,
        category: category || "umum",
        images: images ?? '[]',
        status: "baru",
      },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Error creating laporan:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat laporan" },
      { status: 500 }
    );
  }
}
