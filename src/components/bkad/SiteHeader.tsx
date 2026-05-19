"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Plus,
  House,
  User,
  Newspaper,
  Shield,
  FileText,
  Image,
  Users,
  Phone,
  MessageSquare,
  CalendarDays,
  Camera,
  LayoutDashboard,
  BarChart3,
  CreditCard,
  FileCode,
  UserCheck,
  BookOpen,
  Video,
  PieChart,
  Tag,
  Globe,
  MapPin,
  Mail,
  HelpCircle,
  Info,
  Landmark,
  Building2,
  Briefcase,
  ClipboardList,
  FileCheck,
  FolderOpen,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { usePageRouter, type PageKey } from "@/stores/usePageRouter";
import { useAppIdentity } from "@/hooks/useAppIdentity";
import { resolveFileUrl } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Icon resolver                                                             */
/* -------------------------------------------------------------------------- */

const iconComponentMap: Record<string, React.ElementType> = {
  FileText, House, User, Newspaper, Shield, Image, Users, Phone,
  MessageSquare, CalendarDays, Camera, LayoutDashboard, BarChart3,
  CreditCard, FileCode, UserCheck, BookOpen, Video, PieChart, Tag,
  Globe, MapPin, Mail, HelpCircle, Info, Landmark, Building2,
  Briefcase, ClipboardList, FileCheck, FolderOpen, Settings,
};

function resolveIcon(iconName: string): React.ElementType {
  return iconComponentMap[iconName] || FileText;
}

/* -------------------------------------------------------------------------- */
/*  Types for dynamic menus                                                   */
/* -------------------------------------------------------------------------- */

interface DynamicNavChild {
  id: string;
  label: string;
  slug: string;
  icon: string;
  order: number;
  active: boolean;
  isDynamic: boolean;
  externalUrl: string;
  openInNewTab: boolean;
}

interface DynamicNavItem {
  id: string;
  label: string;
  slug: string;
  icon: string;
  order: number;
  active: boolean;
  isDynamic: boolean;
  externalUrl: string;
  openInNewTab: boolean;
  children: DynamicNavChild[];
}

/* -------------------------------------------------------------------------- */
/*  Quick-Add module list                                                     */
/* -------------------------------------------------------------------------- */

interface QuickAddModule {
  label: string;
  section: string;
  icon: React.ElementType;
}

const quickAddModules: QuickAddModule[] = [
  { label: "Berita", section: "berita", icon: Newspaper },
  { label: "Agenda", section: "agenda", icon: CalendarDays },
  { label: "Galeri", section: "galeri", icon: Camera },
  { label: "Hero Banner", section: "hero-banner", icon: LayoutDashboard },
  { label: "Statistik", section: "statistik", icon: BarChart3 },
  { label: "Layanan", section: "layanan", icon: Users },
  { label: "Data Keuangan", section: "data-keuangan", icon: CreditCard },
  { label: "Konten Halaman", section: "konten-halaman", icon: FileCode },
  { label: "Pejabat", section: "pejabat", icon: UserCheck },
  { label: "Publikasi", section: "publikasi", icon: BookOpen },
  { label: "Video", section: "video", icon: Video },
  { label: "Infografis", section: "infografis", icon: PieChart },
  { label: "Kategori", section: "kategori", icon: Tag },
  { label: "Menu Navbar", section: "navbar-menus", icon: Menu },
];

/* -------------------------------------------------------------------------- */
/*  Static navigation items (built-in SPA pages)                              */
/* -------------------------------------------------------------------------- */

interface NavChild {
  label: string;
  page: PageKey;
}

interface NavItem {
  label: string;
  page: PageKey;
  icon: React.ElementType;
  children: NavChild[] | null;
  isStatic?: boolean;
}

const staticNavItems: NavItem[] = [
  {
    label: "Beranda",
    page: "home",
    icon: House,
    children: null,
    isStatic: true,
  },
  {
    label: "Profil",
    page: "profil-sejarah",
    icon: User,
    children: [
      { label: "Sejarah", page: "profil-sejarah" },
      { label: "Visi & Misi", page: "profil-visi-misi" },
      { label: "Tugas & Fungsi", page: "profil-tugas-fungsi" },
      { label: "Struktur Organisasi", page: "profil-struktur" },
      { label: "Pejabat", page: "profil-pejabat" },
    ],
    isStatic: true,
  },
  {
    label: "Berita",
    page: "berita",
    icon: Newspaper,
    children: null,
    isStatic: true,
  },
  {
    label: "Informasi Publik",
    page: "informasi-publik",
    icon: Shield,
    children: null,
    isStatic: true,
  },
  {
    label: "Publikasi",
    page: "publikasi-laporan",
    icon: FileText,
    children: [
      { label: "Laporan Keuangan", page: "publikasi-laporan" },
      { label: "Buletin", page: "publikasi-buletin" },
      { label: "Data Pokok", page: "publikasi-data-pokok" },
      { label: "Peraturan", page: "publikasi-peraturan" },
    ],
    isStatic: true,
  },
  {
    label: "Media",
    page: "media-foto",
    icon: Image,
    children: [
      { label: "Foto", page: "media-foto" },
      { label: "Video", page: "media-video" },
      { label: "Infografis", page: "media-infografis" },
    ],
    isStatic: true,
  },
  {
    label: "Layanan",
    page: "layanan",
    icon: Users,
    children: null,
    isStatic: true,
  },
  {
    label: "Laporan",
    page: "laporan",
    icon: MessageSquare,
    children: [
      { label: "Buat Laporan", page: "laporan" },
      { label: "Dashboard Laporan", page: "laporan-dashboard" },
    ],
    isStatic: true,
  },
  {
    label: "Kontak",
    page: "kontak",
    icon: Phone,
    children: null,
    isStatic: true,
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

interface SiteHeaderProps {
  onQuickAdd?: (section: string) => void;
}

export default function SiteHeader({ onQuickAdd }: SiteHeaderProps) {
  const { navigate, goHome, currentPage } = usePageRouter();
  const { resolved } = useAppIdentity();

  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dynamicMenus, setDynamicMenus] = useState<DynamicNavItem[]>([]);

  // Fetch dynamic menus from API
  useEffect(() => {
    let cancelled = false;
    const doFetch = async () => {
      try {
        const res = await fetch("/api/navbar-menus");
        const data = await res.json();
        if (data.data && !cancelled) {
          setDynamicMenus(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic menus:", err);
      }
    };
    doFetch();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (page: PageKey) => {
    navigate(page);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  // Refresh menus function (exposed via event)
  useEffect(() => {
    const handleRefresh = async () => {
      try {
        const res = await fetch("/api/navbar-menus");
        const data = await res.json();
        if (data.data) {
          setDynamicMenus(data.data);
        }
      } catch (err) {
        console.error("Failed to refresh dynamic menus:", err);
      }
    };
    window.addEventListener("refresh-nav-menus", handleRefresh);
    return () => window.removeEventListener("refresh-nav-menus", handleRefresh);
  }, []);

  // Combined nav items: static + dynamic
  const allNavItems = [...staticNavItems];

  // Add dynamic menus after static ones
  // For dynamic menus, we store the full DynamicNavItem reference so the
  // rendering code can generate proper <Link> elements instead of SPA navigation.
  for (const dm of dynamicMenus) {
    const IconComp = resolveIcon(dm.icon);
    allNavItems.push({
      label: dm.label,
      page: "home" as PageKey,
      icon: IconComp,
      children:
        dm.children && dm.children.length > 0
          ? dm.children.map((child) => ({
              label: child.label,
              page: (child.isDynamic ? "home" : child.slug) as PageKey,
            }))
          : null,
      isStatic: false,
    });
  }

  return (
    <>
      {/* Top Header */}
      <header
        className={`bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo & Title — dynamic identity */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={goHome}
            >
              {resolveFileUrl(resolved.logoUrl) ? (
                <img
                  src={resolveFileUrl(resolved.logoUrl)!}
                  alt={resolved.appShortName || 'Logo'}
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
                <h1 className="text-bkad-dark font-bold text-sm sm:text-base md:text-lg leading-tight">
                  {resolved.appName}
                </h1>
                <p
                  className="text-xs sm:text-sm font-semibold"
                  style={{ color: resolved.primaryColor }}
                >
                  {resolved.appSubtitle}
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Quick-Add Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-bkad-dark hover:bg-bkad-green/10 hover:text-bkad-green"
                    aria-label="Quick Add"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 max-h-96 overflow-y-auto"
                >
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Plus
                      className="w-4 h-4"
                      style={{ color: resolved.primaryColor }}
                    />
                    <span>Tambah Cepat</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {quickAddModules.map((mod) => (
                    <DropdownMenuItem
                      key={mod.section}
                      onClick={() => onQuickAdd?.(mod.section)}
                      className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm hover:bg-bkad-light hover:text-bkad-green transition-colors"
                    >
                      <mod.icon
                        className="w-4 h-4"
                        style={{ color: resolved.primaryColor }}
                      />
                      <span>{mod.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-bkad-dark hover:bg-bkad-green/10 hover:text-bkad-green"
                aria-label="Cari"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-bkad-dark hover:bg-bkad-green/10"
                aria-label="Cari"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-bkad-dark hover:bg-bkad-green/10"
                    aria-label="Menu"
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                  <div
                    className="text-white p-4"
                    style={{ backgroundColor: resolved.primaryColor }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {resolveFileUrl(resolved.logoUrl) ? (
                          <img
                            src={resolveFileUrl(resolved.logoUrl)!}
                            alt={resolved.appShortName || 'Logo'}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white/30"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white/20"
                          >
                            <span className="text-white font-bold text-sm">
                              {resolved.logoText}
                            </span>
                          </div>
                        )}
                        <div>
                          <h2 className="font-bold text-lg">
                            {resolved.appShortName || resolved.logoText}
                          </h2>
                          <p className="text-sm text-white/80">
                            {resolved.appSubtitle}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-white hover:bg-white/10"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <nav className="overflow-y-auto max-h-[calc(100vh-100px)]">
                    {allNavItems.map((item, idx) => (
                      <div key={`${item.label}-${idx}`}>
                        {item.isStatic ? (
                          // Static SPA menu item
                          <button
                            className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-bkad-light hover:text-bkad-green transition-colors"
                            onClick={() => {
                              if (item.children) {
                                setMobileDropdown(
                                  mobileDropdown === item.label
                                    ? null
                                    : item.label
                                );
                              } else {
                                handleNavClick(item.page);
                              }
                            }}
                          >
                            <span className="flex items-center">
                              <item.icon className="w-4 h-4 mr-3" />
                              {item.label}
                            </span>
                            {item.children && (
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  mobileDropdown === item.label
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            )}
                          </button>
                        ) : (
                          // Dynamic menu item - renders as Link to /[slug]
                          <Link
                            href={`/${dynamicMenus.find(dm => dm.label === item.label)?.slug || item.label.toLowerCase()}`}
                            className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-bkad-light hover:text-bkad-green transition-colors"
                            onClick={() => {
                              if (item.children) {
                                setMobileDropdown(
                                  mobileDropdown === item.label
                                    ? null
                                    : item.label
                                );
                              } else {
                                setMobileMenuOpen(false);
                              }
                            }}
                          >
                            <span className="flex items-center">
                              <item.icon className="w-4 h-4 mr-3" />
                              {item.label}
                            </span>
                            {item.children && (
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  mobileDropdown === item.label
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            )}
                          </Link>
                        )}
                        {/* Children for static items */}
                        {item.isStatic && item.children && mobileDropdown === item.label && (
                          <div className="bg-gray-50">
                            {item.children.map((child) => (
                              <button
                                key={child.label}
                                className="block w-full text-left px-8 py-2.5 text-sm text-gray-600 hover:bg-bkad-light hover:text-bkad-green transition-colors"
                                onClick={() => handleNavClick(child.page)}
                              >
                                {child.label}
                              </button>
                            ))}
                          </div>
                        )}
                        {/* Children for dynamic items - use Link to /[slug] */}
                        {!item.isStatic && item.children && mobileDropdown === item.label && (
                          <div className="bg-gray-50">
                            {(() => {
                              const dm = dynamicMenus.find(m => m.label === item.label);
                              if (!dm) return null;
                              return dm.children.map((child) => (
                                <Link
                                  key={child.id}
                                  href={child.isDynamic ? `/${child.slug}` : (child.externalUrl || "#")}
                                  target={child.openInNewTab ? "_blank" : undefined}
                                  rel={child.openInNewTab ? "noopener noreferrer" : undefined}
                                  className="block w-full text-left px-8 py-2.5 text-sm text-gray-600 hover:bg-bkad-light hover:text-bkad-green transition-colors"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {child.label}
                                </Link>
                              ));
                            })()}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-gray-200 bg-white py-3 px-4 animate-slide-up">
            <div className="container mx-auto">
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari informasi..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-bkad-green focus:ring-1 focus:ring-bkad-green outline-none text-sm"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Navigation Bar */}
      <nav
        className="text-white shadow-lg sticky top-16 md:top-20 z-40 overflow-visible"
        style={{ backgroundColor: resolved.primaryColor }}
      >
        <div className="container mx-auto px-4">
          <div className="hidden lg:flex items-center justify-center w-full">
            {allNavItems.map((item, idx) => {
              const dynamicSlug = dynamicMenus.find(dm => dm.label === item.label)?.slug;

              if (!item.isStatic && dynamicSlug) {
                // Dynamic menu item - renders as Link to /[slug]
                const dm = dynamicMenus.find(m => m.slug === dynamicSlug);
                if (dm && dm.children && dm.children.length > 0) {
                  return (
                    <div
                      key={`dyn-${idx}`}
                      className="relative group"
                      onMouseEnter={() => setOpenDropdown(`dyn-${idx}`)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <Link
                        href={`/${dynamicSlug}`}
                        className="flex items-center px-3 xl:px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200 whitespace-nowrap group"
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        <span>{item.label}</span>
                        <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform duration-200" />
                      </Link>
                      <div
                        className={`absolute top-full left-0 w-56 bg-white shadow-lg border border-gray-200 rounded-md transition-all duration-200 z-50 ${
                          openDropdown === `dyn-${idx}`
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible -translate-y-2"
                        }`}
                      >
                        <div className="py-2">
                          {dm.children.map((child) => (
                            <Link
                              key={child.id}
                              href={child.isDynamic ? `/${child.slug}` : (child.externalUrl || "#")}
                              target={child.openInNewTab ? "_blank" : undefined}
                              rel={child.openInNewTab ? "noopener noreferrer" : undefined}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-bkad-light hover:text-bkad-green transition-colors duration-150 text-gray-700"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={`dyn-${idx}`}
                    href={`/${dynamicSlug}`}
                    className="flex items-center px-3 xl:px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200 whitespace-nowrap"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    <span>{item.label}</span>
                  </Link>
                );
              }

              // Static SPA menu item
              return (
                <div
                  key={`static-${idx}`}
                  className="relative group"
                  onMouseEnter={() =>
                    item.children && setOpenDropdown(`static-${idx}`)
                  }
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    onClick={() => handleNavClick(item.page)}
                    className={`flex items-center px-3 xl:px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200 whitespace-nowrap group ${
                      !item.children && currentPage === item.page
                        ? "bg-white/20"
                        : ""
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    <span>{item.label}</span>
                    {item.children && (
                      <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform duration-200" />
                    )}
                  </button>
                  {item.children && (
                    <div
                      className={`absolute top-full left-0 w-56 bg-white shadow-lg border border-gray-200 rounded-md transition-all duration-200 z-50 ${
                        openDropdown === `static-${idx}`
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      }`}
                    >
                      <div className="py-2">
                        {item.children.map((child) => (
                          <button
                            key={child.label}
                            onClick={() => handleNavClick(child.page)}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-bkad-light hover:text-bkad-green transition-colors duration-150 ${
                              currentPage === child.page
                                ? "bg-bkad-light text-bkad-green font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tablet Navigation */}
          <div className="hidden md:flex lg:hidden overflow-x-auto py-1">
            {allNavItems.map((item, idx) => {
              const dynamicSlug = dynamicMenus.find(dm => dm.label === item.label)?.slug;

              if (!item.isStatic && dynamicSlug) {
                return (
                  <Link
                    key={`tab-dyn-${idx}`}
                    href={`/${dynamicSlug}`}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                );
              }

              return (
                <button
                  key={`tab-static-${idx}`}
                  onClick={() => handleNavClick(item.page)}
                  className={`flex items-center px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors whitespace-nowrap ${
                    currentPage === item.page ? "bg-white/20" : ""
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
