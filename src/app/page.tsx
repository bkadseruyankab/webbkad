"use client";

import { useState, useCallback, useEffect } from "react";
import SiteHeader from "@/components/bkad/SiteHeader";
import TopInfoBar from "@/components/bkad/TopInfoBar";
import HeroSection from "@/components/bkad/HeroSection";
import StatsSection from "@/components/bkad/StatsSection";
import NewsSection from "@/components/bkad/NewsSection";
import ServicesSection from "@/components/bkad/ServicesSection";
import InfografisSection from "@/components/bkad/InfografisSection";
import AgendaGaleriSection from "@/components/bkad/AgendaGaleriSection";
import SiteFooter from "@/components/bkad/SiteFooter";
import AdBubbleRenderer from "@/components/bkad/AdBubbleRenderer";
import AdminPanel from "@/components/bkad/AdminPanel";
import SetupWizard from "@/components/bkad/SetupWizard";
import ProfilPage from "@/components/bkad/pages/ProfilPage";
import PejabatPage from "@/components/bkad/pages/PejabatPage";
import PublikasiPage from "@/components/bkad/pages/PublikasiPage";
import MediaPage from "@/components/bkad/pages/MediaPage";
import NewsDetailPage from "@/components/bkad/pages/NewsDetailPage";
import ServiceDetailPage from "@/components/bkad/pages/ServiceDetailPage";
import LaporanPage from "@/components/bkad/pages/LaporanPage";
import AgendaDetailPage from "@/components/bkad/pages/AgendaDetailPage";
import PublicationDetailPage from "@/components/bkad/pages/PublicationDetailPage";
import VideoDetailPage from "@/components/bkad/pages/VideoDetailPage";
import LaporanDashboardPage from "@/components/bkad/pages/LaporanDashboardPage";
import LoginPage from "@/components/bkad/pages/LoginPage";
import { Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageRouter, type PageKey } from "@/stores/usePageRouter";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAppIdentityStore } from "@/stores/useAppIdentityStore";
import { useSetupStore } from "@/stores/useSetupStore";

// Map quick-add section strings from SiteHeader to AdminPanel Section type
const quickAddSectionMap: Record<string, string> = {
  berita: "news",
  agenda: "agenda",
  galeri: "gallery",
  "hero-banner": "hero-slides",
  statistik: "stats",
  layanan: "services",
  "data-keuangan": "financial-data",
  "konten-halaman": "page-content",
  pejabat: "officials",
  publikasi: "publications",
  video: "videos",
  infografis: "infographics",
  kategori: "categories",
  "navbar-menus": "navbar-menus",
  "balon-iklan": "ad-bubbles",
};

function PageRouter() {
  const { currentPage, detailId } = usePageRouter();

  // Home page sections
  if (currentPage === "home") {
    return (
      <>
        <HeroSection />
        <StatsSection />
        <NewsSection />
        <ServicesSection />
        <InfografisSection />
        <AgendaGaleriSection />
      </>
    );
  }

  // Login page
  if (currentPage === "login") return <LoginPage />;

  // Profil pages
  if (currentPage === "profil-sejarah") return <ProfilPage slug="sejarah" />;
  if (currentPage === "profil-visi-misi") return <ProfilPage slug="visi-misi" />;
  if (currentPage === "profil-tugas-fungsi") return <ProfilPage slug="tugas-fungsi" />;
  if (currentPage === "profil-struktur") return <ProfilPage slug="struktur-organisasi" />;
  if (currentPage === "profil-pejabat") return <PejabatPage />;

  // News detail page
  if (currentPage === "news-detail" && detailId) {
    return <NewsDetailPage id={detailId} />;
  }

  // Service detail page
  if (currentPage === "service-detail" && detailId) {
    return <ServiceDetailPage id={detailId} />;
  }

  // Agenda detail page
  if (currentPage === "agenda-detail" && detailId) {
    return <AgendaDetailPage id={detailId} />;
  }

  // Publication detail page
  if (currentPage === "publication-detail" && detailId) {
    return <PublicationDetailPage id={detailId} />;
  }

  // Video detail page
  if (currentPage === "video-detail" && detailId) {
    return <VideoDetailPage id={detailId} />;
  }

  // Berita - all news
  if (currentPage === "berita") {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <NewsSection />
        </div>
      </div>
    );
  }

  // Informasi Publik
  if (currentPage === "informasi-publik") {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Informasi Publik</h1>
          <p className="text-gray-600 mb-8">Keterbukaan informasi publik sesuai UU No. 14 Tahun 2008</p>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <p className="text-gray-700 leading-relaxed">
              Badan Keuangan dan Aset Daerah Kabupaten Seruyan berkomitmen untuk mengimplementasikan keterbukaan informasi publik sesuai dengan ketentuan Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik. Masyarakat berhak memperoleh informasi mengenai pengelolaan keuangan dan aset daerah.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Publikasi pages
  if (currentPage === "publikasi-laporan") return <PublikasiPage category="laporan-keuangan" />;
  if (currentPage === "publikasi-buletin") return <PublikasiPage category="buletin" />;
  if (currentPage === "publikasi-data-pokok") return <PublikasiPage category="data-pokok" />;
  if (currentPage === "publikasi-peraturan") return <PublikasiPage category="peraturan" />;

  // Media pages
  if (currentPage === "media-foto") return <MediaPage type="foto" />;
  if (currentPage === "media-video") return <MediaPage type="video" />;
  if (currentPage === "media-infografis") return <MediaPage type="infografis" />;

  // Layanan
  if (currentPage === "layanan") {
    return (
      <div className="py-12">
        <ServicesSection />
      </div>
    );
  }

  // Laporan
  if (currentPage === "laporan") {
    return <LaporanPage />;
  }

  // Laporan Dashboard
  if (currentPage === "laporan-dashboard") {
    return <LaporanDashboardPage />;
  }

  // Kontak
  if (currentPage === "kontak") {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Hubungi Kami</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-4">Informasi Kontak</h2>
              <div className="space-y-4 text-gray-600">
                <p><strong>Alamat:</strong> Jl. Trans Kalimantan, Kuala Pembuang, Kab. Seruyan, Kalimantan Tengah 74211</p>
                <p><strong>Telepon:</strong> (0532) 882123</p>
                <p><strong>Email:</strong> bkad@seruyankab.go.id</p>
                <p><strong>Jam Kerja:</strong> Senin - Jumat, 08:00 - 16:00 WIB</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-4">Kirim Pesan</h2>
              <div className="space-y-3">
                <input type="text" placeholder="Nama Lengkap" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-bkad-green focus:ring-1 focus:ring-bkad-green outline-none text-sm" />
                <input type="email" placeholder="Email" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-bkad-green focus:ring-1 focus:ring-bkad-green outline-none text-sm" />
                <textarea placeholder="Pesan" rows={4} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-bkad-green focus:ring-1 focus:ring-bkad-green outline-none text-sm" />
                <Button className="bg-bkad-green hover:bg-bkad-dark text-white w-full">Kirim Pesan</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("bkad_admin_open") === "true";
    }
    return false;
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [adminSection, setAdminSection] = useState<string | undefined>(undefined);
  const { isAuthenticated, user, verify, logout } = useAuthStore();
  const { currentPage, navigate } = usePageRouter();
  const { completed: setupCompleted, checked: setupChecked, checkSetupStatus } = useSetupStore();

  // Initialize auth state, check setup status, and restore navigation from URL hash on mount
  useEffect(() => {
    verify();
    checkSetupStatus();
    usePageRouter.getState()._hydrateFromHash();
  }, [verify, checkSetupStatus]);

  // Persist admin panel open state to sessionStorage
  useEffect(() => {
    if (showAdmin) {
      sessionStorage.setItem("bkad_admin_open", "true");
    } else {
      sessionStorage.removeItem("bkad_admin_open");
    }
  }, [showAdmin]);

  const handleAdminClose = useCallback(() => {
    setShowAdmin(false);
    setAdminSection(undefined);
    setRefreshKey((prev) => prev + 1);
    // Refresh global identity store in case admin changed logo/colors/etc.
    useAppIdentityStore.getState().fetchIdentity();
  }, []);

  const handleQuickAdd = useCallback((section: string) => {
    const mappedSection = quickAddSectionMap[section] || section;
    setAdminSection(mappedSection);
    setShowAdmin(true);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setShowAdmin(false);
  }, [logout]);

  // Show setup wizard if setup is not completed
  if (setupChecked && !setupCompleted) {
    return <SetupWizard />;
  }

  // Login page renders standalone (no header/footer)
  const isLoginPage = currentPage === "login";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Panel Overlay */}
      {showAdmin && isAuthenticated && (
        <AdminPanel onClose={handleAdminClose} initialSection={adminSection as any} />
      )}

      {/* Login page - standalone without header/footer */}
      {isLoginPage ? (
        <main className="flex-1">
          <LoginPage />
        </main>
      ) : (
        /* Main Website */
        <div style={{ display: showAdmin ? "none" : undefined }}>
          <TopInfoBar />
          <SiteHeader onQuickAdd={isAuthenticated ? handleQuickAdd : undefined} />
          <main className="flex-1" key={refreshKey}>
            <PageRouter />
          </main>
          <SiteFooter />

          {/* Ad Bubble Renderer */}
          <AdBubbleRenderer currentPage="home" />

          {/* Admin Toggle Button */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            {isAuthenticated && (
              <>
                <Button
                  onClick={() => setShowAdmin(true)}
                  className="bg-bkad-dark hover:bg-bkad-green text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all"
                  size="icon"
                  aria-label="Buka Panel Admin"
                >
                  <Settings
                    className="w-6 h-6"
                  />
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="bg-white/90 backdrop-blur-sm border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-300 rounded-full w-14 h-14 shadow-lg transition-all"
                  size="icon"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            )}
            {!isAuthenticated && (
              <Button
                onClick={() => navigate("login")}
                className="bg-bkad-dark hover:bg-bkad-green text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all"
                size="icon"
                aria-label="Login Admin"
              >
                <User className="w-6 h-6" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
