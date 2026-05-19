import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/navbar-menus/backfill
 *
 * Creates PageContent entries for any dynamic NavbarMenu items
 * (including children/sub-menus) that don't already have one.
 * This is a one-time migration endpoint.
 */
export async function POST() {
  try {
    const menus = await db.navbarMenu.findMany({
      where: { isDynamic: true },
      include: { parent: true },
    });

    let created = 0;
    let skipped = 0;

    for (const menu of menus) {
      const existing = await db.pageContent.findUnique({
        where: { slug: menu.slug },
      });

      if (existing) {
        skipped++;
        continue;
      }

      // Build title context
      let breadcrumbTitle = menu.label;
      if (menu.parentId && menu.parent) {
        breadcrumbTitle = `${menu.parent.label} — ${menu.label}`;
      }

      await db.pageContent.create({
        data: {
          slug: menu.slug,
          title: menu.label,
          description: `Halaman ${breadcrumbTitle} - Website resmi BKAD Kabupaten Seruyan`,
          content: `<h2>Selamat Datang di Halaman ${menu.label}</h2>\n<p>Halaman ini sedang dalam pengembangan. Konten akan segera ditambahkan oleh administrator.</p>\n<p>Silakan kembali lagi nanti atau hubungi kami untuk informasi lebih lanjut.</p>`,
          heroImage: "",
          image: "",
          metaTitle: `${breadcrumbTitle} - BKAD Kabupaten Seruyan`,
          metaDescription: `Halaman ${breadcrumbTitle} Badan Keuangan dan Aset Daerah Kabupaten Seruyan`,
          metaKeywords: `${menu.label}, BKAD, Seruyan, Keuangan Daerah`,
          published: true,
          order: menu.order,
        },
      });
      created++;
    }

    return NextResponse.json({
      success: true,
      message: `Backfill selesai: ${created} halaman dibuat, ${skipped} dilewati (sudah ada)`,
      created,
      skipped,
      total: menus.length,
    });
  } catch (error) {
    console.error("POST /api/navbar-menus/backfill error:", error);
    return NextResponse.json(
      { error: "Gagal menjalankan backfill" },
      { status: 500 }
    );
  }
}
