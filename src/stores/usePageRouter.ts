import { create } from "zustand";

export type PageKey =
  | "home"
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
  | "video-detail";

interface PageRouterState {
  currentPage: PageKey;
  detailId: string | null;
  navigate: (page: PageKey) => void;
  navigateToDetail: (page: PageKey, id: string) => void;
  goHome: () => void;
}

export const usePageRouter = create<PageRouterState>((set) => ({
  currentPage: "home",
  detailId: null,
  navigate: (page: PageKey) => {
    set({ currentPage: page, detailId: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
  navigateToDetail: (page: PageKey, id: string) => {
    set({ currentPage: page, detailId: id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
  goHome: () => {
    set({ currentPage: "home", detailId: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
}));

export const pageTitles: Record<PageKey, string> = {
  home: "Beranda",
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
};
