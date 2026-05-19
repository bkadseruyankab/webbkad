import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/ad-bubbles/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bubble = await db.adBubble.findUnique({ where: { id } });
    if (!bubble) {
      return NextResponse.json({ error: "Iklan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: bubble });
  } catch (error) {
    console.error("GET /api/ad-bubbles/[id] error:", error);
    return NextResponse.json({ error: "Gagal mengambil data iklan" }, { status: 500 });
  }
}

// PUT /api/ad-bubbles/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await db.adBubble.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Iklan tidak ditemukan" }, { status: 404 });
    }

    const bubble = await db.adBubble.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        contentType: body.contentType ?? existing.contentType,
        mediaUrl: body.mediaUrl ?? existing.mediaUrl,
        textContent: body.textContent ?? existing.textContent,
        ctaLabel: body.ctaLabel ?? existing.ctaLabel,
        ctaUrl: body.ctaUrl ?? existing.ctaUrl,
        ctaTarget: body.ctaTarget ?? existing.ctaTarget,
        displayType: body.displayType ?? existing.displayType,
        displayMode: body.displayMode ?? existing.displayMode,
        position: body.position ?? existing.position,
        customOffsetX: body.customOffsetX ?? existing.customOffsetX,
        customOffsetY: body.customOffsetY ?? existing.customOffsetY,
        width: body.width ?? existing.width,
        height: body.height ?? existing.height,
        mobileWidth: body.mobileWidth ?? existing.mobileWidth,
        mobileHeight: body.mobileHeight ?? existing.mobileHeight,
        bgColor: body.bgColor ?? existing.bgColor,
        bgOpacity: body.bgOpacity ?? existing.bgOpacity,
        borderRadius: body.borderRadius ?? existing.borderRadius,
        shadowSize: body.shadowSize ?? existing.shadowSize,
        borderColor: body.borderColor ?? existing.borderColor,
        borderWidth: body.borderWidth ?? existing.borderWidth,
        animIn: body.animIn ?? existing.animIn,
        animOut: body.animOut ?? existing.animOut,
        animDuration: body.animDuration ?? existing.animDuration,
        showDelay: body.showDelay ?? existing.showDelay,
        autoHide: body.autoHide ?? existing.autoHide,
        showOnScroll: body.showOnScroll ?? existing.showOnScroll,
        exitIntent: body.exitIntent ?? existing.exitIntent,
        closeable: body.closeable ?? existing.closeable,
        minimizable: body.minimizable ?? existing.minimizable,
        draggable: body.draggable ?? existing.draggable,
        startDate: body.startDate ?? existing.startDate,
        endDate: body.endDate ?? existing.endDate,
        showHours: body.showHours ?? existing.showHours,
        targetDevice: body.targetDevice ?? existing.targetDevice,
        targetPages: body.targetPages ?? existing.targetPages,
        targetExclude: body.targetExclude ?? existing.targetExclude,
        zIndex: body.zIndex ?? existing.zIndex,
        order: body.order ?? existing.order,
        priority: body.priority ?? existing.priority,
        active: body.active ?? existing.active,
      },
    });

    return NextResponse.json({ success: true, data: bubble });
  } catch (error) {
    console.error("PUT /api/ad-bubbles/[id] error:", error);
    return NextResponse.json({ error: "Gagal memperbarui iklan" }, { status: 500 });
  }
}

// DELETE /api/ad-bubbles/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.adBubble.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Iklan berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/ad-bubbles/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus iklan" }, { status: 500 });
  }
}
