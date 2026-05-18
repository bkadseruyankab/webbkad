import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/navbar-menus — list all menus (hierarchical)
export async function GET(req: NextRequest) {
  try {
    const all = req.nextUrl.searchParams.get("all") === "true";
    const menus = await db.navbarMenu.findMany({
      where: all ? undefined : { active: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      include: { children: { orderBy: { order: "asc" } } },
    });

    // Only return top-level menus (parentId === null)
    const topLevel = menus.filter((m) => !m.parentId);

    return NextResponse.json({ data: topLevel });
  } catch (error) {
    console.error("GET /api/navbar-menus error:", error);
    return NextResponse.json({ error: "Gagal mengambil data menu" }, { status: 500 });
  }
}

// POST /api/navbar-menus — create a new menu + auto-create PageContent
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { label, slug: rawSlug, parentId, icon, order, active, isDynamic, externalUrl, openInNewTab } = body;

    if (!label) {
      return NextResponse.json({ error: "Label wajib diisi" }, { status: 400 });
    }

    // Auto-generate slug from label if not provided
    const slug = rawSlug || String(label)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Check for duplicate slug
    const existing = await db.navbarMenu.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: `Slug "${slug}" sudah digunakan` }, { status: 400 });
    }

    // Create the menu
    const menu = await db.navbarMenu.create({
      data: {
        label,
        slug,
        parentId: parentId || null,
        icon: icon || "FileText",
        order: order ?? 0,
        active: active !== false,
        isDynamic: isDynamic !== false,
        externalUrl: externalUrl || "",
        openInNewTab: openInNewTab || false,
      },
      include: { children: true },
    });

    // If isDynamic, auto-create a PageContent entry
    if (menu.isDynamic && !parentId) {
      const existingPage = await db.pageContent.findUnique({ where: { slug } });
      if (!existingPage) {
        await db.pageContent.create({
          data: {
            slug,
            title: label,
            description: `Halaman ${label} - Website resmi BKAD Kabupaten Seruyan`,
            content: `<h2>Selamat Datang di Halaman ${label}</h2>\n<p>Halaman ini sedang dalam pengembangan. Konten akan segera ditambahkan oleh administrator.</p>\n<p>Silakan kembali lagi nanti atau hubungi kami untuk informasi lebih lanjut.</p>`,
            heroImage: "",
            image: "",
            metaTitle: `${label} - BKAD Kabupaten Seruyan`,
            metaDescription: `Halaman ${label} Badan Keuangan dan Aset Daerah Kabupaten Seruyan`,
            metaKeywords: `${label}, BKAD, Seruyan, Keuangan Daerah`,
            published: true,
            order: order ?? 0,
          },
        });
      }
    }

    return NextResponse.json({ data: menu }, { status: 201 });
  } catch (error) {
    console.error("POST /api/navbar-menus error:", error);
    return NextResponse.json({ error: "Gagal membuat menu" }, { status: 500 });
  }
}
