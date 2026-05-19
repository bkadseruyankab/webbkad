import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { resolveFileUrl, getDownloadUrl } from "@/lib/utils";
import {
  ChevronRight,
  Home,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PageContentData {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  heroImage: string;
  image: string;
  images: string;
  downloadableFiles: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface NavMenuItem {
  id: string;
  label: string;
  slug: string;
  icon: string;
  order: number;
  active: boolean;
  isDynamic: boolean;
  externalUrl: string;
  openInNewTab: boolean;
  children: { id: string; label: string; slug: string; icon: string; order: number; active: boolean; isDynamic: boolean; externalUrl: string; openInNewTab: boolean }[];
}

interface AppIdentityData {
  appName: string;
  appShortName: string;
  appSubtitle: string;
  logoUrl: string;
  logoText: string;
  primaryColor: string;
  secondaryColor: string;
  darkColor: string;
  phone: string;
  email: string;
  workHours: string;
  address: string;
  footerDescription: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  quickLinks: string;
  layananLinks: string;
  copyrightText: string;
}

// ─── Reserved slugs (handled by SPA) ─────────────────────────────────────────

const RESERVED_SLUGS = new Set([
  "api", "admin", "login",
  "profil-sejarah", "profil-visi-misi", "profil-tugas-fungsi",
  "profil-struktur", "profil-pejabat",
]);

// ─── Data Fetching ───────────────────────────────────────────────────────────

async function getPageData(slug: string): Promise<PageContentData | null> {
  try {
    const data = await db.pageContent.findUnique({ where: { slug } });
    if (!data || !data.published) return null;
    return data as unknown as PageContentData;
  } catch {
    return null;
  }
}

async function getNavMenus(): Promise<NavMenuItem[]> {
  try {
    const menus = await db.navbarMenu.findMany({
      where: { active: true, parentId: null },
      orderBy: { order: "asc" },
      include: {
        children: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
      },
    });
    return menus as unknown as NavMenuItem[];
  } catch {
    return [];
  }
}

async function getAppIdentity(): Promise<AppIdentityData | null> {
  try {
    const identity = await db.appIdentity.findFirst();
    return identity as unknown as AppIdentityData;
  } catch {
    return null;
  }
}

// ─── SEO Metadata ────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) return {};

  const page = await getPageData(slug);
  if (!page) return {};

  const title = page.metaTitle || `${page.title} - BKAD Kabupaten Seruyan`;
  const description = page.metaDescription || page.description || `Halaman ${page.title} Badan Keuangan dan Aset Daerah Kabupaten Seruyan`;
  const keywords = page.metaKeywords || `${page.title}, BKAD, Seruyan, Keuangan Daerah`;

  return {
    title,
    description,
    keywords: keywords.split(",").map((k) => k.trim()),
    openGraph: {
      title,
      description,
      type: "website",
      images: page.heroImage || page.image ? [{ url: page.heroImage || page.image }] : undefined,
    },
  };
}

// ─── Helper: parse "Label|url" format links ──────────────────────────────────

function parseLinks(raw: string): { label: string; url: string }[] {
  if (!raw) return [];
  return raw.split(",").filter(Boolean).map((item) => {
    const [label, url] = item.split("|");
    return { label: label?.trim() || "", url: url?.trim() || "#" };
  });
}

// ─── Helper: parse images JSON ────────────────────────────────────────────

function parseImages(jsonStr: string | null | undefined): { url: string; alt?: string; caption?: string }[] {
  if (!jsonStr) return [];
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

// ─── Helper: parse downloadable files JSON ────────────────────────────────

function parseDownloadableFiles(jsonStr: string | null | undefined): { url: string; name: string; originalName: string; mimeType: string; size: number }[] {
  if (!jsonStr) return [];
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Skip reserved slugs
  if (RESERVED_SLUGS.has(slug)) {
    notFound();
  }

  const [pageData, navMenus, identity] = await Promise.all([
    getPageData(slug),
    getNavMenus(),
    getAppIdentity(),
  ]);

  if (!pageData) {
    notFound();
  }

  const resolved = identity || {
    appName: "Badan Keuangan dan Aset Daerah",
    appShortName: "BKAD",
    appSubtitle: "Kabupaten Seruyan",
    logoUrl: "",
    logoText: "BK",
    primaryColor: "#0D6B3F",
    secondaryColor: "#C5960C",
    darkColor: "#064E2B",
    phone: "(0532) 882123",
    email: "bkad@seruyankab.go.id",
    workHours: "Senin - Jumat, 08:00 - 16:00 WIB",
    address: "Jl. Trans Kalimantan, Kuala Pembuang, Kab. Seruyan, Kalimantan Tengah 74211",
    footerDescription: "Badan Keuangan dan Aset Daerah Kabupaten Seruyan",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    quickLinks: "",
    layananLinks: "",
    copyrightText: "Badan Keuangan dan Aset Daerah Kabupaten Seruyan",
  };

  const quickLinks = parseLinks(resolved.quickLinks);
  const layananLinks = parseLinks(resolved.layananLinks);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ─── Top Header ─────────────────────────────────────────────── */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-3">
              {resolved.logoUrl ? (
                <img
                  src={resolveFileUrl(resolved.logoUrl)}
                  alt={resolved.appShortName}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover flex-shrink-0 border-2"
                  style={{ borderColor: resolved.primaryColor }}
                />
              ) : (
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: resolved.primaryColor }}
                >
                  <span className="text-white font-bold text-lg md:text-xl">
                    {resolved.logoText}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <h1 className="font-bold text-sm sm:text-base md:text-lg leading-tight" style={{ color: resolved.darkColor }}>
                  {resolved.appName}
                </h1>
                <p className="text-xs sm:text-sm font-semibold" style={{ color: resolved.primaryColor }}>
                  {resolved.appSubtitle}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Navigation Bar ──────────────────────────────────────────── */}
      <nav
        className="text-white shadow-lg sticky top-16 md:top-20 z-40"
        style={{ backgroundColor: resolved.primaryColor }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center overflow-x-auto py-1">
            {/* Home link */}
            <Link
              href="/"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              <Home className="w-4 h-4 mr-2" />
              Beranda
            </Link>

            {/* Dynamic menu items */}
            {navMenus.map((menu) => (
              <div key={menu.id} className="relative group">
                {menu.children && menu.children.length > 0 ? (
                  <>
                    <button
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                    >
                      <span>{menu.label}</span>
                      <ChevronRight className="w-3 h-3 ml-1 rotate-90 group-hover:rotate-0 transition-transform" />
                    </button>
                    <div className="absolute top-full left-0 w-56 bg-white shadow-lg border border-gray-200 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
                      <div className="py-2">
                        {menu.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.isDynamic ? `/${child.slug}` : (child.externalUrl || "#")}
                            target={child.openInNewTab ? "_blank" : undefined}
                            rel={child.openInNewTab ? "noopener noreferrer" : undefined}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={menu.isDynamic ? `/${menu.slug}` : (menu.externalUrl || "#")}
                    target={menu.openInNewTab ? "_blank" : undefined}
                    rel={menu.openInNewTab ? "noopener noreferrer" : undefined}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                  >
                    {menu.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section
        className="relative text-white py-16 md:py-24"
        style={{ backgroundColor: resolved.primaryColor }}
      >
        {/* Background overlay */}
        {pageData.heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${resolveFileUrl(pageData.heroImage)})` }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {pageData.title}
            </h1>
            {pageData.description && (
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                {pageData.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ─── Breadcrumb ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-gray-300" />
            <span className="text-gray-900 font-medium">{pageData.title}</span>
          </nav>
        </div>
      </div>

      {/* ─── Content Section ─────────────────────────────────────────── */}
      <main className="flex-1 py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Page image */}
            {pageData.image && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={resolveFileUrl(pageData.image)}
                  alt={pageData.title}
                  className="w-full h-auto object-cover max-h-96"
                />
              </div>
            )}

            {/* Content body */}
            <article
              className="prose prose-lg max-w-none bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />

            {/* Image Gallery */}
            {(() => {
              const images = parseImages(pageData.images);
              if (images.length === 0) return null;
              return (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Galeri Gambar</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, i) => (
                      <div key={i} className="group relative rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="aspect-video bg-gray-100">
                          <img
                            src={resolveFileUrl(img.url)}
                            alt={img.alt || img.caption || `Gambar ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {img.caption && (
                          <div className="p-2 bg-white">
                            <p className="text-xs text-gray-600 truncate">{img.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Downloadable Files */}
            {(() => {
              const files = parseDownloadableFiles(pageData.downloadableFiles);
              if (files.length === 0) return null;
              return (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">File Unduhan</h3>
                  <div className="flex flex-wrap gap-3">
                    {files.map((file, i) => (
                      <a
                        key={i}
                        href={getDownloadUrl(file.url)}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm border hover:shadow-md"
                        style={{
                          backgroundColor: resolved.primaryColor + "10",
                          color: resolved.primaryColor,
                          borderColor: resolved.primaryColor + "30",
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {file.name || file.originalName}
                        <span className="text-xs opacity-60 ml-1">({formatFileSize(file.size)})</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Last updated */}
            <div className="mt-6 text-right text-xs text-gray-400">
              Terakhir diperbarui:{" "}
              {pageData.updatedAt
                ? new Date(pageData.updatedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </div>
          </div>
        </div>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="text-white relative" style={{ backgroundColor: resolved.darkColor }}>
        <div className="absolute -top-1 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1440 60" className="w-full h-8 md:h-12 fill-gray-50">
            <path d="M0,0 C360,60 1080,0 1440,40 L1440,0 L0,0 Z" />
          </svg>
        </div>
        <div className="container mx-auto px-4 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* About */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                {resolved.logoUrl ? (
                  <img src={resolveFileUrl(resolved.logoUrl)} alt={resolved.appShortName} className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2" style={{ borderColor: resolved.primaryColor }} />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: resolved.primaryColor }}>
                    <span className="text-white font-bold text-sm">{resolved.logoText}</span>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-sm">{resolved.appShortName}</h3>
                  <p className="text-xs text-white/60">{resolved.appSubtitle}</p>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">{resolved.footerDescription}</p>
              <div className="flex space-x-3">
                {resolved.facebookUrl && <a href={resolved.facebookUrl} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-emerald-600 flex items-center justify-center transition-colors" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><Facebook className="w-4 h-4" /></a>}
                {resolved.instagramUrl && <a href={resolved.instagramUrl} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-emerald-600 flex items-center justify-center transition-colors" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><Instagram className="w-4 h-4" /></a>}
                {resolved.youtubeUrl && <a href={resolved.youtubeUrl} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-emerald-600 flex items-center justify-center transition-colors" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><Youtube className="w-4 h-4" /></a>}
              </div>
            </div>
            {/* Layanan */}
            <div>
              <h3 className="font-bold text-base mb-4">Layanan</h3>
              <ul className="space-y-2">
                {layananLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="text-white/70 text-sm hover:text-amber-400 transition-colors inline-flex items-center group">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600/50 mr-2 group-hover:bg-amber-400 transition-colors" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Tautan */}
            <div>
              <h3 className="font-bold text-base mb-4">Tautan Penting</h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="text-white/70 text-sm hover:text-amber-400 transition-colors inline-flex items-center group" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Kontak */}
            <div>
              <h3 className="font-bold text-base mb-4">Kontak</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" /><span className="text-white/70 text-sm">{resolved.address}</span></li>
                <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-amber-400 flex-shrink-0" /><span className="text-white/70 text-sm">{resolved.phone}</span></li>
                <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-amber-400 flex-shrink-0" /><span className="text-white/70 text-sm">{resolved.email}</span></li>
                <li className="flex items-center gap-3"><Clock className="w-4 h-4 text-amber-400 flex-shrink-0" /><span className="text-white/70 text-sm">{resolved.workHours}</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/50 text-xs text-center md:text-left">
                &copy; {new Date().getFullYear()} {resolved.copyrightText}. Hak Cipta Dilindungi Undang-Undang.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
