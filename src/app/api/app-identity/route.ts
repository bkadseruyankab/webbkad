import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    let identity = await db.appIdentity.findFirst({ where: { isActive: true } });
    if (!identity) {
      // Create default identity if none exists
      identity = await db.appIdentity.create({ data: {} });
    }
    return NextResponse.json({ success: true, data: identity });
  } catch (error) {
    console.error("Error fetching app identity:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data identitas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Upsert: if there's an existing identity, update it; otherwise create
    const existing = await db.appIdentity.findFirst({ where: { isActive: true } });
    let identity;
    if (existing) {
      identity = await db.appIdentity.update({
        where: { id: existing.id },
        data: body,
      });
    } else {
      identity = await db.appIdentity.create({ data: body });
    }
    return NextResponse.json({ success: true, data: identity });
  } catch (error) {
    console.error("Error saving app identity:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan identitas" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID diperlukan" },
        { status: 400 }
      );
    }
    const identity = await db.appIdentity.update({
      where: { id },
      data,
    });
    return NextResponse.json({ success: true, data: identity });
  } catch (error) {
    console.error("Error updating app identity:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui identitas" },
      { status: 500 }
    );
  }
}
