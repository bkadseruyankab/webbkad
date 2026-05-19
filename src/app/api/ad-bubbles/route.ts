import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/ad-bubbles — list all ad bubbles
export async function GET(req: NextRequest) {
  try {
    const all = req.nextUrl.searchParams.get("all") === "true";
    const activeOnly = !all;

    const bubbles = await db.adBubble.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: [{ priority: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    // If activeOnly, also filter by schedule
    let filtered = bubbles;
    if (activeOnly) {
      const now = new Date();
      filtered = bubbles.filter((b) => {
        // Check start date
        if (b.startDate) {
          const start = new Date(b.startDate);
          if (now < start) return false;
        }
        // Check end date
        if (b.endDate) {
          const end = new Date(b.endDate);
          if (now > end) return false;
        }
        // Check show hours
        if (b.showHours) {
          try {
            const hours = JSON.parse(b.showHours);
            if (hours.start && hours.end) {
              const nowMinutes = now.getHours() * 60 + now.getMinutes();
              const [sh, sm] = hours.start.split(":").map(Number);
              const [eh, em] = hours.end.split(":").map(Number);
              const startMinutes = sh * 60 + sm;
              const endMinutes = eh * 60 + em;
              if (nowMinutes < startMinutes || nowMinutes > endMinutes) return false;
            }
          } catch { /* ignore invalid JSON */ }
        }
        return true;
      });
    }

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("GET /api/ad-bubbles error:", error);
    return NextResponse.json({ error: "Gagal mengambil data iklan" }, { status: 500 });
  }
}

// POST /api/ad-bubbles — create a new ad bubble
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const bubble = await db.adBubble.create({
      data: {
        title: body.title || "Iklan Baru",
        description: body.description || "",
        contentType: body.contentType || "image",
        mediaUrl: body.mediaUrl || "",
        textContent: body.textContent || "",
        ctaLabel: body.ctaLabel || "",
        ctaUrl: body.ctaUrl || "",
        ctaTarget: body.ctaTarget || "_blank",
        displayType: body.displayType || "floating-bubble",
        displayMode: body.displayMode || "rounded-bubble",
        position: body.position || "bottom-right",
        customOffsetX: body.customOffsetX ?? 0,
        customOffsetY: body.customOffsetY ?? 0,
        width: body.width ?? 300,
        height: body.height ?? 250,
        mobileWidth: body.mobileWidth ?? 200,
        mobileHeight: body.mobileHeight ?? 180,
        bgColor: body.bgColor || "#ffffff",
        bgOpacity: body.bgOpacity ?? 1.0,
        borderRadius: body.borderRadius ?? 16,
        shadowSize: body.shadowSize || "md",
        borderColor: body.borderColor || "#e5e7eb",
        borderWidth: body.borderWidth ?? 0,
        animIn: body.animIn || "fade",
        animOut: body.animOut || "fade",
        animDuration: body.animDuration ?? 500,
        showDelay: body.showDelay ?? 0,
        autoHide: body.autoHide ?? 0,
        showOnScroll: body.showOnScroll ?? 0,
        exitIntent: body.exitIntent || false,
        closeable: body.closeable !== false,
        minimizable: body.minimizable || false,
        draggable: body.draggable !== false,
        startDate: body.startDate || "",
        endDate: body.endDate || "",
        showHours: body.showHours || "",
        targetDevice: body.targetDevice || "all",
        targetPages: body.targetPages || "[]",
        targetExclude: body.targetExclude || "[]",
        zIndex: body.zIndex ?? 9999,
        order: body.order ?? 0,
        priority: body.priority ?? 0,
        active: body.active !== false,
      },
    });

    return NextResponse.json({ success: true, data: bubble }, { status: 201 });
  } catch (error) {
    console.error("POST /api/ad-bubbles error:", error);
    return NextResponse.json({ error: "Gagal membuat iklan" }, { status: 500 });
  }
}
