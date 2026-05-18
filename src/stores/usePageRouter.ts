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
  | "kontak";

interface PageRouterState {
  currentPage: PageKey;
  navigate: (page: PageKey) => void;
  goHome: () => void;
}

export const usePageRouter = create<PageRouterState>((set) => ({
  currentPage: "home",
  navigate: (page: PageKey) => {
    set({ currentPage: page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
  goHome: () => {
    set({ currentPage: "home" });
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
};
