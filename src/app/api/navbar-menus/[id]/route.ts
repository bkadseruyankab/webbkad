import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/navbar-menus/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const menu = await db.navbarMenu.findUnique({
      where: { id },
      include: { children: { orderBy: { order: "asc" } } },
    });
    if (!menu) {
      return NextResponse.json({ error: "Menu tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ data: menu });
  } catch (error) {
    console.error("GET /api/navbar-menus/[id] error:", error);
    return NextResponse.json({ error: "Gagal mengambil data menu" }, { status: 500 });
  }
}

// PUT /api/navbar-menus/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { label, slug: rawSlug, parentId, icon, order, active, isDynamic, externalUrl, openInNewTab } = body;

    const existing = await db.navbarMenu.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Menu tidak ditemukan" }, { status: 404 });
    }

    // Auto-generate slug from label if changed and not provided
    let slug = rawSlug || existing.slug;
    if (!rawSlug && label && label !== existing.label) {
      slug = String(label)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }

    // Check for duplicate slug (excluding current)
    if (slug !== existing.slug) {
      const dup = await db.navbarMenu.findUnique({ where: { slug } });
      if (dup) {
        return NextResponse.json({ error: `Slug "${slug}" sudah digunakan` }, { status: 400 });
      }
    }

    const menu = await db.navbarMenu.update({
      where: { id },
      data: {
        label: label ?? existing.label,
        slug,
        parentId: parentId !== undefined ? (parentId || null) : existing.parentId,
        icon: icon ?? existing.icon,
        order: order ?? existing.order,
        active: active !== undefined ? active : existing.active,
        isDynamic: isDynamic !== undefined ? isDynamic : existing.isDynamic,
        externalUrl: externalUrl !== undefined ? externalUrl : existing.externalUrl,
        openInNewTab: openInNewTab !== undefined ? openInNewTab : existing.openInNewTab,
      },
      include: { children: true },
    });

    // If slug changed and isDynamic, also update the PageContent slug
    if (slug !== existing.slug && menu.isDynamic) {
      const pageContent = await db.pageContent.findUnique({ where: { slug: existing.slug } });
      if (pageContent) {
        await db.pageContent.update({
          where: { id: pageContent.id },
          data: { slug, title: label ?? pageContent.title },
        });
      }
    }

    return NextResponse.json({ data: menu });
  } catch (error) {
    console.error("PUT /api/navbar-menus/[id] error:", error);
    return NextResponse.json({ error: "Gagal memperbarui menu" }, { status: 500 });
  }
}

// DELETE /api/navbar-menus/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.navbarMenu.findUnique({
      where: { id },
      include: { children: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Menu tidak ditemukan" }, { status: 404 });
    }

    // Delete PageContent for children first
    if (existing.children.length > 0) {
      for (const child of existing.children) {
        if (child.isDynamic) {
          const childPage = await db.pageContent.findUnique({ where: { slug: child.slug } });
          if (childPage) {
            await db.pageContent.delete({ where: { id: childPage.id } });
          }
        }
      }
      // Delete child menu records
      await db.navbarMenu.deleteMany({
        where: { parentId: id },
      });
    }

    // Delete the menu
    await db.navbarMenu.delete({ where: { id } });

    // Delete the linked PageContent for this menu
    if (existing.isDynamic) {
      const pageContent = await db.pageContent.findUnique({ where: { slug: existing.slug } });
      if (pageContent) {
        await db.pageContent.delete({ where: { id: pageContent.id } });
      }
    }

    return NextResponse.json({ message: "Menu berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/navbar-menus/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus menu" }, { status: 500 });
  }
}
