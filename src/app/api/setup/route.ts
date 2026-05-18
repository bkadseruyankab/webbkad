import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

// GET /api/setup — check if setup has been completed
export async function GET() {
  try {
    const setup = await db.setupState.findFirst();

    // Also check if any user exists (to handle existing databases)
    const userCount = await db.user.count();

    const isCompleted = setup?.completed || userCount > 0;

    return NextResponse.json({
      success: true,
      data: {
        completed: !!isCompleted,
        currentStep: setup?.currentStep || 0,
        hasExistingUsers: userCount > 0,
      },
    });
  } catch (error) {
    console.error("Error checking setup state:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengecek status setup" },
      { status: 500 }
    );
  }
}

// POST /api/setup — save setup data and complete setup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      adminName,
      adminEmail,
      adminPassword,
      appName,
      appShortName,
      appSubtitle,
      primaryColor,
      secondaryColor,
      darkColor,
      phone,
      email,
      address,
      selectedMenus,
      logoUrl,
      workHours,
      metaDescription,
      metaKeywords,
    } = body;

    // Validate required fields
    if (!adminName || !adminEmail || !adminPassword) {
      return NextResponse.json(
        { success: false, error: "Nama, email, dan password admin wajib diisi" },
        { status: 400 }
      );
    }

    if (!appName || !appShortName) {
      return NextResponse.json(
        { success: false, error: "Nama aplikasi dan singkatan wajib diisi" },
        { status: 400 }
      );
    }

    // Check if setup already completed
    const existing = await db.setupState.findFirst();
    if (existing?.completed) {
      return NextResponse.json(
        { success: false, error: "Setup sudah pernah dilakukan" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email: adminEmail } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email admin sudah terdaftar" },
        { status: 400 }
      );
    }

    // 1. Create admin user
    const hashedPassword = hashPassword(adminPassword);
    const admin = await db.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "superadmin",
        active: true,
      },
    });

    // 2. Update or create AppIdentity
    const identityData = {
      appName,
      appShortName,
      appSubtitle,
      primaryColor: primaryColor || "#0D6B3F",
      secondaryColor: secondaryColor || "#C5960C",
      darkColor: darkColor || "#064E2B",
      phone: phone || "",
      email: email || "",
      address: address || "",
      logoUrl: logoUrl || "",
      workHours: workHours || "Senin - Jumat, 08:00 - 16:00 WIB",
      metaDescription: metaDescription || `Website resmi ${appName}`,
      metaKeywords: metaKeywords || `${appShortName}, Keuangan Daerah, Aset Daerah`,
      footerDescription: `${appName}. Mewujudkan pengelolaan keuangan daerah yang transparan, akuntabel, dan berorientasi pada pelayanan publik.`,
      copyrightText: appName,
    };

    const existingIdentity = await db.appIdentity.findFirst();
    if (existingIdentity) {
      await db.appIdentity.update({
        where: { id: existingIdentity.id },
        data: identityData,
      });
    } else {
      await db.appIdentity.create({ data: identityData });
    }

    // 3. Create navbar menus from selected menus
    const menus: Array<{ label: string; slug: string; icon: string }> =
      typeof selectedMenus === "string" ? JSON.parse(selectedMenus) : selectedMenus || [];

    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i];

      // Create PageContent for each dynamic menu
      await db.pageContent.create({
        data: {
          slug: menu.slug,
          title: menu.label,
          description: `Halaman ${menu.label}`,
          content: `<h1>${menu.label}</h1><p>Selamat datang di halaman ${menu.label}. Konten halaman ini dapat diubah melalui panel admin.</p>`,
          metaTitle: `${menu.label} - ${appShortName}`,
          metaDescription: `Halaman ${menu.label} ${appName}`,
          published: true,
          order: i,
        },
      });

      // Create NavbarMenu
      await db.navbarMenu.create({
        data: {
          label: menu.label,
          slug: menu.slug,
          icon: menu.icon || "FileText",
          order: i,
          active: true,
          isDynamic: true,
        },
      });
    }

    // 4. Create default categories
    const defaultCategories = [
      { name: "Berita Utama", slug: "berita-utama", module: "berita", color: primaryColor || "#0D6B3F", order: 0 },
      { name: "Pengumuman", slug: "pengumuman", module: "berita", color: secondaryColor || "#C5960C", order: 1 },
      { name: "Laporan Keuangan", slug: "laporan-keuangan", module: "publikasi", color: primaryColor || "#0D6B3F", order: 0 },
      { name: "Peraturan", slug: "peraturan", module: "publikasi", color: secondaryColor || "#C5960C", order: 1 },
      { name: "Galeri Kegiatan", slug: "galeri-kegiatan", module: "galeri", color: primaryColor || "#0D6B3F", order: 0 },
      { name: "Umum", slug: "umum", module: "general", color: "#6B7280", order: 0 },
    ];

    for (const cat of defaultCategories) {
      await db.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      });
    }

    // 5. Save setup state as completed
    if (existing) {
      await db.setupState.update({
        where: { id: existing.id },
        data: {
          completed: true,
          currentStep: 4,
          adminName,
          adminEmail,
          adminPassword: "[REDACTED]",
          appName,
          appShortName,
          appSubtitle,
          primaryColor: primaryColor || "#0D6B3F",
          secondaryColor: secondaryColor || "#C5960C",
          darkColor: darkColor || "#064E2B",
          phone: phone || "",
          email: email || "",
          address: address || "",
          selectedMenus: typeof selectedMenus === "string" ? selectedMenus : JSON.stringify(selectedMenus),
          logoUrl: logoUrl || "",
          workHours: workHours || "Senin - Jumat, 08:00 - 16:00 WIB",
          metaDescription: metaDescription || "",
          metaKeywords: metaKeywords || "",
        },
      });
    } else {
      await db.setupState.create({
        data: {
          completed: true,
          currentStep: 4,
          adminName,
          adminEmail,
          adminPassword: "[REDACTED]",
          appName,
          appShortName,
          appSubtitle,
          primaryColor: primaryColor || "#0D6B3F",
          secondaryColor: secondaryColor || "#C5960C",
          darkColor: darkColor || "#064E2B",
          phone: phone || "",
          email: email || "",
          address: address || "",
          selectedMenus: typeof selectedMenus === "string" ? selectedMenus : JSON.stringify(selectedMenus),
          logoUrl: logoUrl || "",
          workHours: workHours || "Senin - Jumat, 08:00 - 16:00 WIB",
          metaDescription: metaDescription || "",
          metaKeywords: metaKeywords || "",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
        menuCount: menus.length,
      },
    });
  } catch (error) {
    console.error("Error saving setup:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data setup" },
      { status: 500 }
    );
  }
}

// DELETE /api/setup — reset setup state (for re-running the wizard)
export async function DELETE() {
  try {
    // Delete all SetupState records
    await db.setupState.deleteMany();

    return NextResponse.json({
      success: true,
      message: "Setup state telah direset",
    });
  } catch (error) {
    console.error("Error resetting setup state:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mereset setup state" },
      { status: 500 }
    );
  }
}
