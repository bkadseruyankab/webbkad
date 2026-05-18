// Menu configuration and helper functions for the dynamic navbar system

export interface NavChild {
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

export interface NavMenuItem {
  id: string;
  label: string;
  slug: string;
  icon: string;
  order: number;
  active: boolean;
  isDynamic: boolean;
  externalUrl: string;
  openInNewTab: boolean;
  children: NavChild[];
}

// Slug generation helper — converts any string into a URL-safe slug
export function generateSlug(text: string): string {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ñ]/g, "n")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Icon name to Lucide component mapping
export const menuIconMap: Record<string, string> = {
  FileText: "FileText",
  House: "House",
  User: "User",
  Newspaper: "Newspaper",
  Shield: "Shield",
  Image: "Image",
  Users: "Users",
  Phone: "Phone",
  MessageSquare: "MessageSquare",
  BookOpen: "BookOpen",
  Video: "Video",
  BarChart3: "BarChart3",
  Settings: "Settings",
  Calendar: "Calendar",
  Camera: "Camera",
  Globe: "Globe",
  MapPin: "MapPin",
  Mail: "Mail",
  HelpCircle: "HelpCircle",
  Info: "Info",
  Landmark: "Landmark",
  Building2: "Building2",
  Briefcase: "Briefcase",
  ClipboardList: "ClipboardList",
  FileCheck: "FileCheck",
  FolderOpen: "FolderOpen",
};

export const menuIconOptions = Object.entries(menuIconMap).map(
  ([label, value]) => ({ label, value })
);

// Reserved slugs that are used by the built-in SPA pages and should not be used for dynamic pages
export const RESERVED_SLUGS = [
  "", "home", "login",
  "profil-sejarah", "profil-visi-misi", "profil-tugas-fungsi", "profil-struktur", "profil-pejabat",
  "berita", "informasi-publik",
  "publikasi-laporan", "publikasi-buletin", "publikasi-data-pokok", "publikasi-peraturan",
  "media-foto", "media-video", "media-infografis",
  "layanan", "kontak", "laporan", "laporan-dashboard",
  "api", "admin",
];

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase());
}
