"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  House,
  User,
  Newspaper,
  Shield,
  FileText,
  Image,
  Users,
  Phone,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePageRouter, type PageKey } from "@/stores/usePageRouter";

interface NavChild {
  label: string;
  page: PageKey;
}

interface NavItem {
  label: string;
  page: PageKey;
  icon: React.ElementType;
  children: NavChild[] | null;
}

const navItems: NavItem[] = [
  {
    label: "Beranda",
    page: "home",
    icon: House,
    children: null,
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
  },
  {
    label: "Berita",
    page: "home",
    icon: Newspaper,
    children: null,
  },
  {
    label: "Informasi Publik",
    page: "informasi-publik",
    icon: Shield,
    children: null,
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
  },
  {
    label: "Layanan",
    page: "layanan",
    icon: Users,
    children: null,
  },
  {
    label: "Laporan",
    page: "laporan",
    icon: MessageSquare,
    children: null,
  },
  {
    label: "Kontak",
    page: "kontak",
    icon: Phone,
    children: null,
  },
];

export default function SiteHeader() {
  const { navigate, goHome, currentPage } = usePageRouter();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

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
            {/* Logo & Title */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={goHome}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-bkad-green rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg md:text-xl">
                  BK
                </span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-bkad-dark font-bold text-sm sm:text-base md:text-lg leading-tight">
                  Badan Keuangan dan Aset Daerah
                </h1>
                <p className="text-bkad-green text-xs sm:text-sm font-semibold">
                  Kabupaten Seruyan
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
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
                  <div className="bg-bkad-green text-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-bold text-lg">BKAD</h2>
                        <p className="text-sm text-white/80">
                          Kabupaten Seruyan
                        </p>
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
                    {navItems.map((item) => (
                      <div key={item.label}>
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
                        {item.children && mobileDropdown === item.label && (
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
      <nav className="bg-bkad-green text-white shadow-lg sticky top-16 md:top-20 z-40 overflow-visible">
        <div className="container mx-auto px-4">
          <div className="hidden lg:flex items-center justify-center w-full">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() =>
                  item.children && setOpenDropdown(item.label)
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
                      openDropdown === item.label
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
            ))}
          </div>

          {/* Tablet Navigation */}
          <div className="hidden md:flex lg:hidden overflow-x-auto py-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.page)}
                className={`flex items-center px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors whitespace-nowrap ${
                  currentPage === item.page ? "bg-white/20" : ""
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
