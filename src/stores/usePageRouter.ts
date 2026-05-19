import { create } from "zustand";

export type PageKey =
  | "home"
  | "login"
  | "profil-sejarah"
  | "profil-visi-misi"
  | "profil-tugas-fungsi"
  | "profil-struktur"
  | "profil-pejabat"
  | "berita"
  | "informasi-publik"
  | "publikasi-laporan"
  | "publikasi-buletin"
  | "publikasi-data-pokok"
  | "publikasi-peraturan"
  | "media-foto"
  | "media-video"
  | "media-infografis"
  | "layanan"
  | "kontak"
  | "laporan"
  | "laporan-dashboard"
  | "news-detail"
  | "service-detail"
  | "agenda-detail"
  | "publication-detail"
  | "video-detail"
  | "ikm-dashboard"
  | "ikm-survey";

interface PageRouterState {
  currentPage: PageKey;
  detailId: string | null;
  navigate: (page: PageKey) => void;
  navigateToDetail: (page: PageKey, id: string) => void;
  goHome: () => void;
  _hydrateFromHash: () => void;
}

/**
 * Parse the current URL hash to restore navigation state.
 * Format: #page or #page/detailId
 */
function parseHash(): { page: PageKey; detailId: string | null } {
  if (typeof window === "undefined") return { page: "home", detailId: null };

  const hash = window.location.hash.slice(1); // Remove the leading #
  if (!hash) return { page: "home", detailId: null };

  const parts = hash.split("/");
  const page = parts[0] as PageKey;
  const detailId = parts[1] || null;

  return { page, detailId };
}

/** Update the URL hash without triggering a hashchange event */
function updateHash(page: PageKey, detailId: string | null) {
  if (typeof window === "undefined") return;

  const newHash = detailId ? `${page}/${detailId}` : page;
  // Use replaceState to avoid creating extra history entries for in-page navigation
  const newUrl = `${window.location.pathname}${window.location.search}#${newHash}`;
  window.history.replaceState(null, "", newUrl);
}

export const usePageRouter = create<PageRouterState>((set) => ({
  currentPage: "home",
  detailId: null,

  navigate: (page: PageKey) => {
    set({ currentPage: page, detailId: null });
    updateHash(page, null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  navigateToDetail: (page: PageKey, id: string) => {
    set({ currentPage: page, detailId: id });
    updateHash(page, id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  goHome: () => {
    set({ currentPage: "home", detailId: null });
    updateHash("home", null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  /**
   * Hydrate the router state from the URL hash.
   * Should be called once on mount in the root component.
   */
  _hydrateFromHash: () => {
    const { page, detailId } = parseHash();
    if (page !== "home" || detailId) {
      set({ currentPage: page, detailId });
    }
  },
}));

export const pageTitles: Record<PageKey, string> = {
  home: "Beranda",
  login: "Login",
  "profil-sejarah": "Sejarah",
  "profil-visi-misi": "Visi & Misi",
  "profil-tugas-fungsi": "Tugas & Fungsi",
  "profil-struktur": "Struktur Organisasi",
  "profil-pejabat": "Pejabat",
  berita: "Berita",
  "informasi-publik": "Informasi Publik",
  "publikasi-laporan": "Laporan Keuangan",
  "publikasi-buletin": "Buletin",
  "publikasi-data-pokok": "Data Pokok",
  "publikasi-peraturan": "Peraturan",
  "media-foto": "Foto",
  "media-video": "Video",
  "media-infografis": "Infografis",
  layanan: "Layanan Publik",
  kontak: "Kontak",
  laporan: "Laporan Masyarakat",
  "laporan-dashboard": "Dashboard Laporan",
  "news-detail": "Detail Berita",
  "service-detail": "Detail Layanan",
  "agenda-detail": "Detail Agenda",
  "publication-detail": "Detail Publikasi",
  "video-detail": "Detail Video",
  "ikm-dashboard": "Dashboard IKM",
  "ikm-survey": "Survei Kepuasan Masyarakat",
};
