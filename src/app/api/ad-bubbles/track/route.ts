import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/ad-bubbles/track — track impression or click
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, type } = body; // type: "impression" or "click"

    if (!id || !type) {
      return NextResponse.json({ error: "id dan type wajib diisi" }, { status: 400 });
    }

    const bubble = await db.adBubble.findUnique({ where: { id } });
    if (!bubble) {
      return NextResponse.json({ error: "Iklan tidak ditemukan" }, { status: 404 });
    }

    if (type === "impression") {
      await db.adBubble.update({
        where: { id },
        data: { impressions: { increment: 1 } },
      });
    } else if (type === "click") {
      await db.adBubble.update({
        where: { id },
        data: { clicks: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/ad-bubbles/track error:", error);
    return NextResponse.json({ error: "Gagal mencatat statistik" }, { status: 500 });
  }
}
