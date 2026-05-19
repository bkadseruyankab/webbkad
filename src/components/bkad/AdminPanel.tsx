"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  Newspaper,
  Image as ImageIcon,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ChevronLeft,
  ToggleLeft,
  ToggleRight,
  Building2,
  TrendingUp,
  FileText,
  Users,
  BookOpen,
  Video,
  MessageSquare,
  Eye,
  RefreshCw,
  Tag,
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  HardDrive,
  Globe,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/bkad/ImageUpload";
import { MultiImageUpload, parseImages, serializeImages, type ImageItem } from "@/components/bkad/MultiImageUpload";
import { FileDownloadUpload, parseDownloadableFiles, serializeDownloadableFiles, type DownloadableFile } from "@/components/bkad/FileDownloadUpload";
import PengaturanIdentitasSection from "@/components/bkad/PengaturanIdentitasSection";
import { resolveFileUrl } from "@/lib/utils";
import { blobStore } from "@/lib/blob-store";
import { useAppIdentityStore } from "@/stores/useAppIdentityStore";
import { useSetupStore } from "@/stores/useSetupStore";

// ─── Types ───────────────────────────────────────────────────────────────────

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  images: string;
  order: number;
  active: boolean;
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  categoryId?: string;
  image: string;
  images: string;
  readTime: string;
  order: number;
  active: boolean;
}

interface AgendaItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: string;
  images: string;
}

interface GalleryItem {
  id: string;
  image: string;
  images: string;
  caption: string;
  order: number;
  active: boolean;
  categoryId?: string;
}

interface StatItem {
  id: string;
  icon: string;
  value: string;
  prefix: string;
  suffix: string;
  label: string;
  color: string;
  images: string;
  order: number;
  active: boolean;
}

interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  content: string;
  color: string;
  bgColor: string;
  images: string;
  order: number;
  active: boolean;
}

interface FinancialDataItem {
  id: string;
  year: string;
  pendapatan: number;
  belanja: number;
  realisasi: number;
  images: string;
}

interface PageContentItem {
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
}

interface OfficialItem {
  id: string;
  name: string;
  position: string;
  photo: string;
  images: string;
  nip: string;
  order: number;
  active: boolean;
}

interface PublicationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId?: string;
  fileUrl: string;
  coverImage: string;
  images: string;
  downloadableFiles: string;
  date: string;
  order: number;
  active: boolean;
}

interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  images: string;
  date: string;
  order: number;
  active: boolean;
}

interface InfographicItem {
  id: string;
  title: string;
  image: string;
  images: string;
  date: string;
  order: number;
  active: boolean;
}

interface LaporanItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: string;
  categoryId?: string;
  status: string;
  images: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  module: string;
  color: string;
  images: string;
  order: number;
  active: boolean;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NavbarMenuItem {
  id: string;
  label: string;
  slug: string;
  parentId: string | null;
  icon: string;
  order: number;
  active: boolean;
  isDynamic: boolean;
  externalUrl: string;
  openInNewTab: boolean;
  children: NavbarMenuItem[];
  createdAt: string;
  updatedAt: string;
}

type Section =
  | "dashboard"
  | "categories"
  | "navbar-menus"
  | "hero-slides"
  | "news"
  | "agenda"
  | "gallery"
  | "stats"
  | "services"
  | "financial-data"
  | "page-content"
  | "officials"
  | "publications"
  | "videos"
  | "infographics"
  | "laporan"
  | "users"
  | "app-identity";

// ─── Constants ───────────────────────────────────────────────────────────────

const iconOptions = [
  "TrendingUp",
  "Building2",
  "FileCheck",
  "Coins",
  "Landmark",
  "Receipt",
  "Building",
  "Calculator",
  "FileSpreadsheet",
  "ClipboardList",
];

const colorOptions = [
  { value: "text-emerald-600", label: "Hijau" },
  { value: "text-amber-600", label: "Emas" },
  { value: "text-teal-600", label: "Teal" },
  { value: "text-violet-600", label: "Violet" },
  { value: "text-rose-600", label: "Rose" },
  { value: "text-orange-600", label: "Oranye" },
  { value: "text-sky-600", label: "Biru Muda" },
];

const bgColorOptions = [
  { value: "bg-emerald-50", label: "Hijau Muda" },
  { value: "bg-amber-50", label: "Emas Muda" },
  { value: "bg-teal-50", label: "Teal Muda" },
  { value: "bg-violet-50", label: "Violet Muda" },
  { value: "bg-rose-50", label: "Rose Muda" },
  { value: "bg-orange-50", label: "Oranye Muda" },
  { value: "bg-sky-50", label: "Biru Muda" },
];

const categoryModuleOptions = [
  { value: "berita", label: "Berita" },
  { value: "publikasi", label: "Publikasi" },
  { value: "laporan", label: "Laporan" },
  { value: "galeri", label: "Galeri" },
  { value: "general", label: "Umum" },
];

const statusOptions = [
  { value: "upcoming", label: "Akan Datang" },
  { value: "ongoing", label: "Berlangsung" },
  { value: "completed", label: "Selesai" },
];

const laporanStatusOptions = [
  { value: "baru", label: "Baru" },
  { value: "diproses", label: "Diproses" },
  { value: "selesai", label: "Selesai" },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminPanel({ onClose, initialSection }: { onClose: () => void; initialSection?: Section }) {
  const [activeSection, setActiveSection] = useState<Section>(initialSection || "dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();

  // ─── Data States ──────────────────────────────────────────────────────────

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [financialData, setFinancialData] = useState<FinancialDataItem[]>([]);
  const [pageContents, setPageContents] = useState<PageContentItem[]>([]);
  const [officials, setOfficials] = useState<OfficialItem[]>([]);
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [infographics, setInfographics] = useState<InfographicItem[]>([]);
  const [laporan, setLaporan] = useState<LaporanItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [navbarMenus, setNavbarMenus] = useState<NavbarMenuItem[]>([]);

  // ─── Blob Store Status ────────────────────────────────────────────────────

  const [blobOnline, setBlobOnline] = useState(true);
  const [blobPendingCount, setBlobPendingCount] = useState(0);

  // ─── Upload Config ─────────────────────────────────────────────────────────

  const [uploadConfig, setUploadConfig] = useState<{
    config: {
      uploadDir: string;
      maxSizeMB: number;
      allowedTypes: string[];
      allowedExtensions: string[];
      blobTracking: boolean;
      compressQuality: number;
      maxImageWidth: number;
      maxImageHeight: number;
    };
    stats: {
      totalFiles: number;
      syncedFiles: number;
      unsyncedFiles: number;
      totalSizeBytes: number;
      totalSizeFormatted: string;
    };
  } | null>(null);

  const fetchUploadConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/upload');
      const result = await res.json();
      if (result.success && result.data) {
        setUploadConfig(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch upload config:', err);
    }
  }, []);

  // ─── Modal States ─────────────────────────────────────────────────────────

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<Record<string, unknown> | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // ─── Dynamic Category Options ─────────────────────────────────────────────

  const getCategoryOptionsForModule = useCallback(
    (moduleName: string): CategoryItem[] => {
      return categories.filter((c) => c.module === moduleName && c.active);
    },
    [categories],
  );

  // ─── Fetch Data ───────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    try {
      const [
        heroRes, newsRes, agendaRes, galleryRes, statsRes,
        servicesRes, financeRes, pcRes, offRes, pubRes,
        vidRes, infoRes, lapRes, catRes, usersRes, navMenuRes,
      ] = await Promise.all([
        fetch("/api/hero-slides?all=true"),
        fetch("/api/news?all=true"),
        fetch("/api/agenda"),
        fetch("/api/gallery?all=true"),
        fetch("/api/stats?all=true"),
        fetch("/api/services?all=true"),
        fetch("/api/financial-data"),
        fetch("/api/page-content"),
        fetch("/api/officials?all=true"),
        fetch("/api/publications?all=true"),
        fetch("/api/videos?all=true"),
        fetch("/api/infographics?all=true"),
        fetch("/api/laporan?all=true"),
        fetch("/api/categories"),
        fetch("/api/users"),
        fetch("/api/navbar-menus?all=true"),
      ]);

      const [
        heroData, newsData, agendaData, galleryData, statsData,
        servicesData, financeData, pcData, offData, pubData,
        vidData, infoData, lapData, catData, usersData, navMenuData,
      ] = await Promise.all([
        heroRes.json(), newsRes.json(), agendaRes.json(), galleryRes.json(),
        statsRes.json(), servicesRes.json(), financeRes.json(), pcRes.json(),
        offRes.json(), pubRes.json(), vidRes.json(), infoRes.json(),
        lapRes.json(), catRes.json(), usersRes.json(), navMenuRes.json(),
      ]);

      setHeroSlides(heroData.data || []);
      setNews(newsData.data || []);
      setAgenda(agendaData.data || []);
      setGallery(galleryData.data || []);
      setStats(statsData.data || []);
      setServices(servicesData.data || []);
      setFinancialData(financeData.data || []);
      setPageContents(pcData.data || []);
      setOfficials(offData.data || []);
      setPublications(pubData.data || []);
      setVideos(vidData.data || []);
      setInfographics(infoData.data || []);
      setLaporan(lapData.data || []);
      setCategories(catData.data || []);
      setUsers(usersData.data || []);
      setNavbarMenus(navMenuData.data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  }, []);

  // ─── Update Blob Store Status ────────────────────────────────────────────

  const updateBlobStatus = useCallback(async () => {
    try {
      setBlobOnline(blobStore.getOnlineStatus());
      const pending = await blobStore.getAllPending();
      setBlobPendingCount(pending.length);
    } catch {
      // BlobStore may not be available (SSR)
    }
  }, []);

  useEffect(() => {
    fetchData();
    updateBlobStatus();
    fetchUploadConfig();
    const interval = setInterval(updateBlobStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchData, updateBlobStatus, fetchUploadConfig]);

  // Update section when initialSection prop changes
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // ─── CRUD Handlers ────────────────────────────────────────────────────────

  const getApiBase = (section: Section): string => {
    const map: Record<Section, string> = {
      dashboard: "",
      categories: "/api/categories",
      "navbar-menus": "/api/navbar-menus",
      "hero-slides": "/api/hero-slides",
      news: "/api/news",
      agenda: "/api/agenda",
      gallery: "/api/gallery",
      stats: "/api/stats",
      services: "/api/services",
      "financial-data": "/api/financial-data",
      "page-content": "/api/page-content",
      officials: "/api/officials",
      publications: "/api/publications",
      videos: "/api/videos",
      infographics: "/api/infographics",
      laporan: "/api/laporan",
      users: "/api/users",
      "app-identity": "/api/app-identity",
    };
    return map[section];
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isEdit = !!editItem?.id;
      const url = isEdit
        ? `${getApiBase(activeSection)}/${editItem.id}`
        : getApiBase(activeSection);
      const method = isEdit ? "PUT" : "POST";

      // For categories, auto-generate slug from name if not provided
      const payload = { ...formData };
      if (activeSection === "categories" && !payload.slug && payload.name) {
        payload.slug = String(payload.name)
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      toast({
        title: "Berhasil",
        description: isEdit ? "Data berhasil diperbarui" : "Data berhasil ditambahkan",
      });
      setModalOpen(false);
      setEditItem(null);
      setFormData({});
      fetchData();
      // Refresh global identity store when app-identity is saved
      if (activeSection === "app-identity") {
        useAppIdentityStore.getState().fetchIdentity();
      }
      // Dispatch event to refresh navbar menus in SiteHeader
      if (activeSection === "navbar-menus") {
        window.dispatchEvent(new CustomEvent("refresh-nav-menus"));
      }
    } catch {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${getApiBase(activeSection)}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus data");

      toast({ title: "Berhasil", description: "Data berhasil dihapus" });
      setDeleteConfirm(null);
      fetchData();
      // Dispatch event to refresh navbar menus in SiteHeader
      if (activeSection === "navbar-menus") {
        window.dispatchEvent(new CustomEvent("refresh-nav-menus"));
      }
    } catch {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus data",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (item: Record<string, unknown>, section: Section) => {
    try {
      const res = await fetch(`${getApiBase(section)}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, active: !item.active }),
      });
      if (!res.ok) throw new Error("Gagal mengubah status");
      fetchData();
    } catch {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const getDefaultFormData = (section: Section): Record<string, unknown> => {
    const base: Record<string, unknown> = { order: 0 };
    const activeSections = [
      "hero-slides", "news", "gallery", "stats", "services",
      "officials", "publications", "videos", "infographics", "categories",
    ];
    if (activeSections.includes(section)) {
      base.active = true;
    }
    if (section === "categories") {
      base.module = "general";
      base.color = "#0D6B3F";
    }
    if (section === "navbar-menus") {
      base.active = true;
      base.isDynamic = true;
      base.icon = "FileText";
      base.openInNewTab = false;
      base.externalUrl = "";
    }
    if (section === "page-content") {
      base.published = true;
    }
    return base;
  };

  const openCreateModal = () => {
    setEditItem(null);
    setFormData(getDefaultFormData(activeSection));
    setModalOpen(true);
  };

  const openEditModal = (item: Record<string, unknown>) => {
    setEditItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const openDetailModal = (item: Record<string, unknown>) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  // ─── Detail Content Renderer ─────────────────────────────────────────────

  const renderDetailContent = () => {
    if (!detailItem) return null;
    const fields = Object.entries(detailItem).filter(
      ([key]) => !["id", "createdAt", "updatedAt"].includes(key),
    );
    return (
      <div className="space-y-3">
        {fields.map(([key, value]) => {
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (s) => s.toUpperCase());
          let displayValue = String(value ?? "-");
          if (typeof value === "boolean") {
            displayValue = value ? "Aktif" : "Nonaktif";
          } else if (key === "content" || key === "message") {
            return (
              <div key={key}>
                <label className="text-sm font-medium text-gray-500 block mb-1">{label}</label>
                <div className="bg-gray-50 rounded-lg p-3 text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {displayValue}
                </div>
              </div>
            );
          } else if (key === "active") {
            displayValue = value ? "Aktif" : "Nonaktif";
          } else if (key === "image" || key === "photo" || key === "thumbnail" || key === "coverImage" || key === "heroImage") {
            if (value) {
              const resolvedUrl = String(value).startsWith('/uploads/') ? `/api/files${String(value)}` : String(value);
              return (
                <div key={key}>
                  <label className="text-sm font-medium text-gray-500 block mb-1">{label}</label>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <img src={resolvedUrl} alt={label} className="max-h-40 object-contain rounded" />
                    <p className="text-xs text-gray-400 mt-1 break-all">{String(value)}</p>
                  </div>
                </div>
              );
            }
          }
          return (
            <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-1">
              <label className="text-sm font-medium text-gray-500 sm:w-36 flex-shrink-0">{label}</label>
              <span className="text-sm text-gray-900 break-all">{displayValue}</span>
            </div>
          );
        })}
        <div className="flex flex-col sm:flex-row sm:items-start gap-1 pt-2 border-t">
          <label className="text-sm font-medium text-gray-500 sm:w-36 flex-shrink-0">Dibuat</label>
          <span className="text-sm text-gray-600">
            {detailItem.createdAt ? new Date(String(detailItem.createdAt)).toLocaleString("id-ID") : "-"}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start gap-1">
          <label className="text-sm font-medium text-gray-500 sm:w-36 flex-shrink-0">Diperbarui</label>
          <span className="text-sm text-gray-600">
            {detailItem.updatedAt ? new Date(String(detailItem.updatedAt)).toLocaleString("id-ID") : "-"}
          </span>
        </div>
      </div>
    );
  };

  // ─── Sidebar Menu ─────────────────────────────────────────────────────────

  const menuItems: { key: Section; label: string; icon: React.ElementType; count: number }[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, count: 0 },
    { key: "categories", label: "Kategori", icon: Tag, count: categories.length },
    { key: "navbar-menus", label: "Menu Navbar", icon: Building2, count: navbarMenus.length },
    { key: "hero-slides", label: "Hero Banner", icon: ImageIcon, count: heroSlides.length },
    { key: "news", label: "Berita", icon: Newspaper, count: news.length },
    { key: "agenda", label: "Agenda", icon: Calendar, count: agenda.length },
    { key: "gallery", label: "Galeri", icon: ImageIcon, count: gallery.length },
    { key: "stats", label: "Statistik", icon: TrendingUp, count: stats.length },
    { key: "services", label: "Layanan", icon: Settings, count: services.length },
    { key: "financial-data", label: "Data Keuangan", icon: BarChart3, count: financialData.length },
    { key: "page-content", label: "Konten Halaman", icon: FileText, count: pageContents.length },
    { key: "officials", label: "Pejabat", icon: Users, count: officials.length },
    { key: "publications", label: "Publikasi", icon: BookOpen, count: publications.length },
    { key: "videos", label: "Video", icon: Video, count: videos.length },
    { key: "infographics", label: "Infografis", icon: BarChart3, count: infographics.length },
    { key: "laporan", label: "Laporan", icon: MessageSquare, count: laporan.length },
    { key: "users", label: "Pengguna", icon: Users, count: users.length },
    { key: "app-identity", label: "Identitas Aplikasi", icon: Globe, count: 0 },
  ];

  // ─── Render Form Fields ───────────────────────────────────────────────────

  const navbarMenuIconOptions = [
    { value: "FileText", label: "Dokumen" },
    { value: "House", label: "Beranda" },
    { value: "User", label: "Pengguna" },
    { value: "Newspaper", label: "Berita" },
    { value: "Shield", label: "Perlindungan" },
    { value: "Image", label: "Gambar" },
    { value: "Users", label: "Pengguna (Jamak)" },
    { value: "Phone", label: "Telepon" },
    { value: "MessageSquare", label: "Pesan" },
    { value: "BookOpen", label: "Buku" },
    { value: "Video", label: "Video" },
    { value: "BarChart3", label: "Grafik" },
    { value: "Globe", label: "Globe" },
    { value: "MapPin", label: "Lokasi" },
    { value: "Mail", label: "Surat" },
    { value: "Info", label: "Info" },
    { value: "Landmark", label: "Landmark" },
    { value: "Building2", label: "Gedung" },
    { value: "Briefcase", label: "Kerja" },
    { value: "ClipboardList", label: "Daftar" },
    { value: "FileCheck", label: "File Cek" },
    { value: "FolderOpen", label: "Folder" },
    { value: "HelpCircle", label: "Bantuan" },
  ];

  const renderFormFields = () => {
    switch (activeSection) {
      case "navbar-menus":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Label Menu</label>
              <Input
                value={String(formData.label || "")}
                onChange={(e) => {
                  const label = e.target.value;
                  const autoSlug = label.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
                  setFormData({ ...formData, label, slug: !editItem ? autoSlug : formData.slug });
                }}
                placeholder="Contoh: Galeri"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Slug (URL)</label>
              <Input
                value={String(formData.slug || "")}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Contoh: galeri (otomatis dari label)"
              />
              <p className="text-xs text-gray-400 mt-1">URL halaman: /{String(formData.slug || "slug")}</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Ikon</label>
              <Select
                value={String(formData.icon || "FileText")}
                onValueChange={(v) => setFormData({ ...formData, icon: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih ikon" />
                </SelectTrigger>
                <SelectContent>
                  {navbarMenuIconOptions.map((i) => (
                    <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Menu Induk (Sub-menu dari)</label>
              <Select
                value={String(formData.parentId || "none")}
                onValueChange={(v) => setFormData({ ...formData, parentId: v === "none" ? null : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tidak ada (menu utama)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada (menu utama)</SelectItem>
                  {navbarMenus.filter((m) => !m.parentId).map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={Number(formData.order) || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={formData.active ? "true" : "false"}
                  onValueChange={(v) => setFormData({ ...formData, active: v === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tipe Halaman</label>
                <Select
                  value={formData.isDynamic ? "dynamic" : "external"}
                  onValueChange={(v) => setFormData({ ...formData, isDynamic: v === "dynamic" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dynamic">Halaman Dinamis (Auto-buat halaman)</SelectItem>
                    <SelectItem value="external">Tautan Eksternal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Buka di Tab Baru</label>
                <Select
                  value={formData.openInNewTab ? "true" : "false"}
                  onValueChange={(v) => setFormData({ ...formData, openInNewTab: v === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Ya</SelectItem>
                    <SelectItem value="false">Tidak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {!formData.isDynamic && (
              <div>
                <label className="text-sm font-medium mb-1 block">URL Eksternal</label>
                <Input
                  value={String(formData.externalUrl || "")}
                  onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            )}
            {formData.isDynamic && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
                <p className="font-medium text-emerald-800 mb-1">✨ Halaman Otomatis</p>
                <p className="text-emerald-700">Saat menyimpan, sistem akan otomatis membuat:</p>
                <ul className="list-disc list-inside mt-1 text-emerald-600">
                  <li>Route halaman: <code className="bg-emerald-100 px-1 rounded">/{String(formData.slug || "slug")}</code></li>
                  <li>Halaman dengan Hero, Breadcrumb, Konten, Footer</li>
                  <li>SEO metadata otomatis</li>
                  <li>Link navbar otomatis muncul</li>
                  {formData.parentId && (
                    <li className="font-medium">Sub-menu juga mendapat halaman sendiri</li>
                  )}
                </ul>
                {formData.parentId && (
                  <p className="mt-2 text-emerald-700">
                    Sub-menu ini akan memiliki halaman dinamis sendiri yang dapat diakses langsung melalui URL.
                  </p>
                )}
              </div>
            )}
          </>
        );

      case "categories":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Nama Kategori</label>
              <Input
                value={String(formData.name || "")}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama kategori"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Slug</label>
              <Input
                value={String(formData.slug || "")}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Otomatis dari nama (boleh dikosongkan)"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Deskripsi</label>
              <Textarea
                value={String(formData.description || "")}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi kategori"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Modul</label>
                <Select
                  value={String(formData.module || "general")}
                  onValueChange={(v) => setFormData({ ...formData, module: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryModuleOptions.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Warna</label>
                <Input
                  type="color"
                  value={String(formData.color || "#0D6B3F")}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="h-9 cursor-pointer"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={Number(formData.order) || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={formData.active ? "true" : "false"}
                  onValueChange={(v) => setFormData({ ...formData, active: v === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <MultiImageUpload
              value={parseImages(String(formData.images || "[]"))}
              onChange={(images) => setFormData({ ...formData, images: serializeImages(images) })}
              label="Galeri Gambar Kategori"
            />
          </>
        );

      case "hero-slides":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul</label>
              <Input
                value={String(formData.title || "")}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul banner"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Subjudul</label>
              <Textarea
                value={String(formData.subtitle || "")}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Subjudul banner"
                rows={3}
              />
            </div>
            <ImageUpload
              value={String(formData.image || "")}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Gambar Banner"
            />
            <MultiImageUpload
              value={parseImages(String(formData.images || "[]"))}
              onChange={(images) => setFormData({ ...formData, images: serializeImages(images) })}
              label="Galeri Gambar Banner"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={Number(formData.order) || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={formData.active ? "true" : "false"}
                  onValueChange={(v) => setFormData({ ...formData, active: v === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );

      case "news": {
        const newsCatOptions = getCategoryOptionsForModule("berita");
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul</label>
              <Input
                value={String(formData.title || "")}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul berita"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Ringkasan</label>
              <Textarea
                value={String(formData.excerpt || "")}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Ringkasan berita"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Konten Lengkap</label>
              <Textarea
                value={String(formData.content || "")}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Konten berita lengkap"
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tanggal</label>
                <Input
                  value={String(formData.date || "")}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="15 Januari 2025"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Kategori</label>
                <Select
                  value={String(formData.categoryId || "")}
                  onValueChange={(v) => {
                    const cat = categories.find((c) => c.id === v);
                    setFormData({ ...formData, categoryId: v, category: cat?.name || "" });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {newsCatOptions.length > 0 ? (
                      newsCatOptions.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="_none" disabled>Tambahkan kategori di menu Kategori</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <ImageUpload
              value={String(formData.image || "")}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Gambar Berita"
            />
            <MultiImageUpload
              value={parseImages(String(formData.images || "[]"))}
              onChange={(images) => setFormData({ ...formData, images: serializeImages(images) })}
              label="Galeri Gambar Berita"
            />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Waktu Baca</label>
                <Input
                  value={String(formData.readTime || "")}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="5 menit"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={Number(formData.order) || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={formData.active ? "true" : "false"}
                  onValueChange={(v) => setFormData({ ...formData, active: v === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      }

      case "agenda":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul Kegiatan</label>
              <Input
                value={String(formData.title || "")}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul kegiatan"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Deskripsi</label>
              <Textarea
                value={String(formData.description || "")}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi kegiatan"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tanggal</label>
                <Input
                  value={String(formData.date || "")}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="20 Februari 2025"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Waktu</label>
                <Input
                  value={String(formData.time || "")}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="09:00 - 12:00 WIB"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Lokasi</label>
              <Input
                value={String(formData.location || "")}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ruang Rapat Utama BKAD"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select
                value={String(formData.status || "upcoming")}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <MultiImageUpload
              value={parseImages(String(formData.images || "[]"))}
              onChange={(images) => setFormData({ ...formData, images: serializeImages(images) })}
              label="Galeri Gambar Agenda"
            />
          </>
        );

      case "gallery": {
        const galleryCatOptions = getCategoryOptionsForModule("galeri");
        return (
          <>
            <ImageUpload
              value={String(formData.image || "")}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Gambar Galeri"
            />
            <MultiImageUpload
              value={parseImages(String(formData.images || "[]"))}
              onChange={(images) => setFormData({ ...formData, images: serializeImages(images) })}
              label="Galeri Gambar Tambahan"
            />
            <div>
              <label className="text-sm font-medium mb-1 block">Keterangan</label>
              <Input
                value={String(formData.caption || "")}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="Keterangan foto"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Kategori</label>
              <Select
                value={String(formData.categoryId || "")}
                onValueChange={(v) => setFormData({ ...formData, categoryId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {galleryCatOptions.length > 0 ? (
                    galleryCatOptions.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="_none" disabled>Tambahkan kategori di menu Kategori</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={Number(formData.order) || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={formData.active ? "true" : "false"}
                  onValueChange={(v) => setFormData({ ...formData, active: v === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      }

      case "stats":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Ikon</label>
              <Select
                value={String(formData.icon || "")}
                onValueChange={(v) => setFormData({ ...formData, icon: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih ikon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((i) => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Prefix</label>
                <Input
                  value={String(formData.prefix || "")}
                  onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                  placeholder="Rp "
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Nilai</label>
                <Input
                  value={String(formData.value || "")}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="1,25"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Suffix</label>
                <Input
                  value={String(formData.suffix || "")}
                  onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                  placeholder=" T"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Label</label>
              <Input
                value={String(formData.label || "")}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Anggaran Daerah 2024"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Warna</label>
                <Select
                  value={String(formData.color || "")}
                  onValueChange={(v) => setFormData({ ...formData, color: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih warna" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={Number(formData.order) || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={formData.active ? "true" : "false"}
                  onValueChange={(v) => setFormData({ ...formData, active: v === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <MultiImageUpload
              value={parseImages(String(formData.images || "[]"))}
              onChange={(images) => setFormData({ ...formData, images: serializeImages(images) })}
              label="Galeri Gambar Statistik"
            />
          </>
        );

      case "services":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Ikon</label>
              <Select
                value={String(formData.icon || "")}
                onValueChange={(v) => setFormData({ ...formData, icon: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih ikon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((i) => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul Layanan</label>
              <Input
                value={String(formData.title || "")}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Pengelolaan APBD"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Deskripsi</label>
              <Textarea
                value={String(formData.description || "")}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi layanan"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Konten Detail</label>
              <Textarea
                value={String(formData.content || "")}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Detail informasi layanan"
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Warna Ikon</label>
                <Select
                  value={String(formData.color || "")}
                  onValueChange={(v) => setFormData({ ...formData, color: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih warna" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Warna Background</label>
                <Select
                  value={String(formData.bgColor || "")}
                  onValueChange={(v) => setFormData({ ...formData, bgColor: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih warna" />
                  </SelectTrigger>
                  <SelectContent>
                    {bgColorOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={Number(formData.order) || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={formData.active ? "true" : "false"}
                  onValueChange={(v) => setFormData({ ...formData, active: v === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <MultiImageUpload
              value={parseImages(String(formData.images || "[]"))}
              onChange={(images) => setFormData({ ...formData, images: serializeImages(images) })}
              label="Galeri Gambar Layanan"
            />
          </>
        );

      case "financial-data":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Tahun</label>
              <Input
                value={String(formData.year || "")}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2024"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Pendapatan (M)</label>
                <Input
                  type="number"
                  value={Number(formData.pendapatan) || 0}
                  onChange={(e) => setFormData({ ...formData, pendapatan: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Belanja (M)</label>
                <Input
                  type="number"
                  value={Number(formData.belanja) || 0}
                  onChange={(e) => setFormData({ ...formData, belanja: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Realisasi (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={Number(formData.realisasi) || 0}
                  onChange={(e) => setFormData({ ...formData, realisasi: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <MultiImageUpload
              value={parseImages(String(formData.images || "[]"))}
              onChange={(images) => setFormData({ ...formData, images: serializeImages(images) })}
              label="Galeri Gambar Data Keuangan"
            />
          </>
        );

      case "page-content":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Slug</label>
              <Input
                value={String(formData.slug || "")}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="sejarah, visi-misi, tugas-fungsi, struktur-organisasi"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul</label>
              <Input
                value={String(formData.title || "")}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul halaman"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Konten</label>
              <Textarea
                value={String(formData.content || "")}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Konten halaman (mendukung HTML)"
                rows={8}
              />
            </div>
            <ImageUpload
              value={String(formData.image || "")}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Gambar Halaman"
            />
            <MultiImageUpload
              value={parseImages(String(formData.images || "[]"))}
              onChange={(images) => setFormData({ ...formData, images: serializeImages(images) })}
              label="Galeri Gambar Halaman"
            />
            <FileDownloadUpload
              value={parseDownloadableFiles(String(formData.downloadableFiles || "[]"))}
              onChange={(files) => setFormData({ ...formData, downloadableFiles: serializeDownloadableFiles(files) })}
              label="File Unduhan (Button Download)"
            />
            <div>
              <label className="text-sm font-medium mb-1 block">Deskripsi</label>
              <Textarea
                value={String(formData.description || "")}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi singkat halaman"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Meta Title</label>
                <Input
                  value={String(formData.metaTitle || "")}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="SEO title"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Meta Description</label>
                <Input
                  value={String(formData.metaDescription || "")}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="SEO description"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Dipublikasikan</label>
              <Select
                value={formData.published !== false ? "true" : "false"}
                onValueChange={(v) => setFormData({ ...formData, published: v === "true" })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ya</SelectItem>
                  <SelectItem value="false">Tidak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "officials":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Nama</label>
              <Input
                value={String(formData.name || "")}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama pejabat"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Jabatan</label>
              <Input
                value={String(formData.position || "")}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Kepala Badan"
              />
            </div>
            <ImageUpload
              value={String(formData.photo || "")}
              onChange={(url) => setFormData({ ...formData, photo: url })}
              label="Foto Pejabat"
            />
            <MultiImageUpload
              value={parseImages(String(formData.images || "[]"))}
              onChange={(images) => setFormData({ ...formData, images: serializeImages(images) })}
              label="Galeri Gambar Pejabat"
            />
            <div>
              <label className="text-sm font-medium mb-1 block">NIP</label>
              <Input
                value={String(formData.nip || "")}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                placeholder="197001011990011001"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={Number(formData.order) || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={formData.active ? "true" : "false"}
                  onValueChange={(v) => setFormData({ ...formData, active: v === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );

      case "publications": {
        const pubCatOptions = getCategoryOptionsForModule("publikasi");
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul</label>
              <Input
                value={String(formData.title || "")}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul publikasi"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Deskripsi</label>
              <Textarea
                value={String(formData.description || "")}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi publikasi"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Kategori</label>
              <Select
                value={String(formData.categoryId || "")}
                onValueChange={(v) => {
                  const cat = categories.find((c) => c.id === v);
                  setFormData({ ...formData, categoryId: v, category: cat?.name || "" });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {pubCatOptions.length > 0 ? (
                    pubCatOptions.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="_none" disabled>Tambahkan kategori di menu Kategori</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">URL File</label>
              <Input
                value={String(formData.fileUrl || "")}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="/files/laporan-2024.pdf"
              />
            </div>
            <ImageUpload
              value={String(formData.coverImage || "")}
              onChange={(url) => setFormData({ ...formData, coverImage: url })}
              label="Cover Gambar"
            />
            <MultiImageUpload
              value={parseImages(String(formData.images || "[]"))}
              onChange={(images) => setFormData({ ...formData, images: serializeImages(images) })}
              label="Galeri Gambar Publikasi"
            />
            <FileDownloadUpload
              value={parseDownloadableFiles(String(formData.downloadableFiles || "[]"))}
              onChange={(files) => setFormData({ ...formData, downloadableFiles: serializeDownloadableFiles(files) })}
              label="File Unduhan Publikasi"
            />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tanggal</label>
                <Input
                  value={String(formData.date || "")}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="15 Januari 2025"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={Number(formData.order) || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={formData.active ? "true" : "false"}
                  onValueChange={(v) => setFormData({ ...formData, active: v === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      }

      case "videos":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul</label>
              <Input
                value={String(formData.title || "")}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul video"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">URL Video</label>
              <Input
                value={String(formData.url || "")}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <ImageUpload
              value={String(formData.thumbnail || "")}
              onChange={(url) => setFormData({ ...formData, thumbnail: url })}
              label="Thumbnail Video"
            />
            <MultiImageUpload
              value={parseImages(String(formData.images || "[]"))}
              onChange={(images) => setFormData({ ...formData, images: serializeImages(images) })}
              label="Galeri Gambar Video"
            />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tanggal</label>
                <Input
                  value={String(formData.date || "")}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="15 Januari 2025"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={Number(formData.order) || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={formData.active ? "true" : "false"}
                  onValueChange={(v) => setFormData({ ...formData, active: v === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );

      case "infographics":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul</label>
              <Input
                value={String(formData.title || "")}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul infografis"
              />
            </div>
            <ImageUpload
              value={String(formData.image || "")}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Gambar Infografis"
            />
            <MultiImageUpload
              value={parseImages(String(formData.images || "[]"))}
              onChange={(images) => setFormData({ ...formData, images: serializeImages(images) })}
              label="Galeri Gambar Infografis"
            />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tanggal</label>
                <Input
                  value={String(formData.date || "")}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="15 Januari 2025"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={Number(formData.order) || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={formData.active ? "true" : "false"}
                  onValueChange={(v) => setFormData({ ...formData, active: v === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );

      case "laporan": {
        const lapCatOptions = getCategoryOptionsForModule("laporan");
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Nama Pelapor</label>
              <Input
                value={String(formData.name || "")}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama pelapor"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input
                  value={String(formData.email || "")}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@contoh.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Telepon</label>
                <Input
                  value={String(formData.phone || "")}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Subjek</label>
              <Input
                value={String(formData.subject || "")}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Subjek laporan"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Pesan</label>
              <Textarea
                value={String(formData.message || "")}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Isi laporan"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Kategori</label>
                <Select
                  value={String(formData.categoryId || "")}
                  onValueChange={(v) => {
                    const cat = categories.find((c) => c.id === v);
                    setFormData({ ...formData, categoryId: v, category: cat?.name || "" });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {lapCatOptions.length > 0 ? (
                      lapCatOptions.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="_none" disabled>Tambahkan kategori di menu Kategori</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={String(formData.status || "baru")}
                  onValueChange={(v) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {laporanStatusOptions.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <MultiImageUpload
              value={parseImages(String(formData.images || "[]"))}
              onChange={(images) => setFormData({ ...formData, images: serializeImages(images) })}
              label="Lampiran Gambar"
            />
          </>
        );
      }

      case "users":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Nama</label>
              <Input
                value={String(formData.name || "")}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama lengkap"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input
                type="email"
                value={String(formData.email || "")}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Password {editItem ? "(kosongkan jika tidak diubah)" : ""}
              </label>
              <Input
                type="password"
                value={String(formData.password || "")}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editItem ? "Kosongkan jika tidak diubah" : "Password"}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Peran</label>
              <Select
                value={String(formData.role || "admin")}
                onValueChange={(v) => setFormData({ ...formData, role: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ImageUpload
              value={String(formData.avatar || "")}
              onChange={(url) => setFormData({ ...formData, avatar: url })}
              label="Foto Profil"
            />
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select
                value={formData.active ? "true" : "false"}
                onValueChange={(v) => setFormData({ ...formData, active: v === "true" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Aktif</SelectItem>
                  <SelectItem value="false">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // ─── Helper: Category badge lookup ───────────────────────────────────────

  const getCategoryBadge = (categoryId?: string) => {
    if (!categoryId) return null;
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return null;
    return (
      <Badge
        className="text-[10px]"
        style={{ backgroundColor: cat.color + "20", color: cat.color, borderColor: cat.color + "40" }}
        variant="outline"
      >
        {cat.name}
      </Badge>
    );
  };

  // ─── Action Buttons Row ───────────────────────────────────────────────────

  const renderActionButtons = (item: Record<string, unknown>, section: Section, hasActive = true) => (
    <div className="flex items-center gap-1 flex-shrink-0">
      {hasActive && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => { e.stopPropagation(); handleToggleActive(item, section); }}
          title={item.active ? "Nonaktifkan" : "Aktifkan"}
        >
          {item.active ? (
            <ToggleRight className="w-5 h-5 text-bkad-green" />
          ) : (
            <ToggleLeft className="w-5 h-5 text-gray-400" />
          )}
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => { e.stopPropagation(); openDetailModal(item); }}
        title="Detail"
      >
        <Eye className="w-4 h-4 text-emerald-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
        title="Edit"
      >
        <Pencil className="w-4 h-4 text-amber-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(String(item.id)); }}
        title="Hapus"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </Button>
    </div>
  );

  // ─── Render Data Table ────────────────────────────────────────────────────

  const renderDataTable = () => {
    switch (activeSection) {
      case "app-identity":
        return <PengaturanIdentitasSection />;
      case "navbar-menus":
        return (
          <div className="space-y-3">
            {navbarMenus.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Building2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Belum ada menu navbar</p>
                <p className="text-xs mt-1">Tambahkan menu baru untuk membuat halaman otomatis</p>
              </div>
            )}
            {navbarMenus.map((menu) => (
              <div key={menu.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{menu.label}</h3>
                      <p className="text-xs text-gray-400">/{menu.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={menu.active ? "default" : "secondary"} className={menu.active ? "bg-emerald-100 text-emerald-700" : ""}>
                      {menu.active ? "Aktif" : "Nonaktif"}
                    </Badge>
                    {menu.isDynamic && (
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                        Dinamis
                      </Badge>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDetailModal(menu as unknown as Record<string, unknown>)}>
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    {menu.isDynamic && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <a href={`/${menu.slug}`} target="_blank" rel="noopener noreferrer" title="Lihat halaman">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(menu as unknown as Record<string, unknown>)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => setDeleteConfirm(menu.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                {/* Children (sub-menus) */}
                {menu.children && menu.children.length > 0 && (
                  <div className="ml-11 mt-2 space-y-2">
                    {menu.children.map((child) => (
                      <div key={child.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          <span className="text-sm text-gray-700">{child.label}</span>
                          <span className="text-xs text-gray-400">/{child.slug}</span>
                          {child.isDynamic && (
                            <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-200 bg-blue-50">
                              Dinamis
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {child.isDynamic && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                              <a href={`/${child.slug}`} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-3 h-3" />
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal(child as unknown as Record<string, unknown>)}>
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeleteConfirm(child.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case "categories":
        return (
          <div className="space-y-3">
            {categories.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Tag className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Belum ada kategori</p>
              </div>
            )}
            {categories.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${!item.active ? "opacity-50" : ""}`}
              >
                <div
                  className="w-4 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <Badge variant="outline" className="text-[10px]">
                      {categoryModuleOptions.find((m) => m.value === item.module)?.label || item.module}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{item.description || "Tanpa deskripsi"}</p>
                </div>
                {renderActionButtons(item, "categories")}
              </div>
            ))}
          </div>
        );

      case "hero-slides":
        return (
          <div className="space-y-3">
            {heroSlides.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${!item.active ? "opacity-50" : ""}`}
              >
                <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {resolveFileUrl(item.image) && <img src={resolveFileUrl(item.image)!} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                </div>
                <Badge variant="outline" className="text-xs">#{item.order}</Badge>
                {renderActionButtons(item, "hero-slides")}
              </div>
            ))}
          </div>
        );

      case "news":
        return (
          <div className="space-y-3">
            {news.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${!item.active ? "opacity-50" : ""}`}
              >
                <div className="w-20 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {resolveFileUrl(item.image) && <img src={resolveFileUrl(item.image)!} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {getCategoryBadge(item.categoryId) || (
                      <Badge className="text-[10px] bg-bkad-light text-bkad-green">{item.category}</Badge>
                    )}
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                </div>
                {renderActionButtons(item, "news")}
              </div>
            ))}
          </div>
        );

      case "agenda":
        return (
          <div className="space-y-3">
            {agenda.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4"
              >
                <div className="bg-bkad-green text-white rounded-lg w-14 h-14 flex flex-col items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{item.date}</span>
                    <Badge
                      variant="outline"
                      className={
                        item.status === "upcoming"
                          ? "text-amber-600 border-amber-300"
                          : item.status === "ongoing"
                            ? "text-emerald-600 border-emerald-300"
                            : "text-gray-500 border-gray-300"
                      }
                    >
                      {statusOptions.find((s) => s.value === item.status)?.label || item.status}
                    </Badge>
                  </div>
                </div>
                {renderActionButtons(item, "agenda", false)}
              </div>
            ))}
          </div>
        );

      case "gallery":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {gallery.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg border shadow-sm overflow-hidden ${!item.active ? "opacity-50" : ""}`}
              >
                <div className="aspect-video bg-gray-100">
                  {resolveFileUrl(item.image) && <img src={resolveFileUrl(item.image)!} alt={item.caption} className="w-full h-full object-cover" />}
                </div>
                <div className="p-2">
                  <p className="text-xs truncate">{item.caption || "Tanpa keterangan"}</p>
                  <div className="flex items-center justify-between mt-1">
                    {getCategoryBadge(item.categoryId)}
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openDetailModal(item)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEditModal(item)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setDeleteConfirm(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "stats":
        return (
          <div className="space-y-3">
            {stats.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${!item.active ? "opacity-50" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{item.prefix}{item.value}{item.suffix}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.label}</p>
                </div>
                <Badge variant="outline" className="text-xs">#{item.order}</Badge>
                {renderActionButtons(item, "stats")}
              </div>
            ))}
          </div>
        );

      case "services":
        return (
          <div className="space-y-3">
            {services.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${!item.active ? "opacity-50" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{item.description}</p>
                </div>
                {renderActionButtons(item, "services")}
              </div>
            ))}
          </div>
        );

      case "financial-data":
        return (
          <div className="space-y-3">
            {financialData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">Tahun {item.year}</h4>
                  <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    <span>Pendapatan: {item.pendapatan}M</span>
                    <span>Belanja: {item.belanja}M</span>
                    <span>Realisasi: {item.realisasi}%</span>
                  </div>
                </div>
                {renderActionButtons(item, "financial-data", false)}
              </div>
            ))}
          </div>
        );

      case "page-content":
        return (
          <div className="space-y-3">
            {pageContents.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {resolveFileUrl(item.image) && <img src={resolveFileUrl(item.image)!} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-gray-400">/{item.slug}</p>
                  {item.published === false && (
                    <span className="text-[10px] text-amber-600 font-medium">Draft</span>
                  )}
                </div>
                {renderActionButtons(item, "page-content", false)}
              </div>
            ))}
          </div>
        );

      case "officials":
        return (
          <div className="space-y-3">
            {officials.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${!item.active ? "opacity-50" : ""}`}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                  {resolveFileUrl(item.photo) && <img src={resolveFileUrl(item.photo)!} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{item.position}</p>
                </div>
                {renderActionButtons(item, "officials")}
              </div>
            ))}
          </div>
        );

      case "publications":
        return (
          <div className="space-y-3">
            {publications.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${!item.active ? "opacity-50" : ""}`}
              >
                <div className="w-14 h-18 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {resolveFileUrl(item.coverImage) && <img src={resolveFileUrl(item.coverImage)!} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {getCategoryBadge(item.categoryId) || (
                      <Badge className="text-[10px] bg-bkad-light text-bkad-green">{item.category}</Badge>
                    )}
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                </div>
                {renderActionButtons(item, "publications")}
              </div>
            ))}
          </div>
        );

      case "videos":
        return (
          <div className="space-y-3">
            {videos.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${!item.active ? "opacity-50" : ""}`}
              >
                <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                  {resolveFileUrl(item.thumbnail) && <img src={resolveFileUrl(item.thumbnail)!} alt="" className="w-full h-full object-cover" />}
                  <Video className="w-4 h-4 text-white absolute bottom-1 right-1 drop-shadow" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
                {renderActionButtons(item, "videos")}
              </div>
            ))}
          </div>
        );

      case "infographics":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {infographics.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg border shadow-sm overflow-hidden ${!item.active ? "opacity-50" : ""}`}
              >
                <div className="aspect-video bg-gray-100">
                  {resolveFileUrl(item.image) && <img src={resolveFileUrl(item.image)!} alt={item.title} className="w-full h-full object-cover" />}
                </div>
                <div className="p-2">
                  <p className="text-xs truncate font-medium">{item.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-400">{item.date}</span>
                    <div className="flex items-center gap-0.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal(item)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteConfirm(item.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "laporan":
        return (
          <div className="space-y-3">
            {laporan.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">{item.subject}</h4>
                    <Badge
                      variant="outline"
                      className={
                        item.status === "baru"
                          ? "text-amber-600 border-amber-300"
                          : item.status === "diproses"
                            ? "text-emerald-600 border-emerald-300"
                            : "text-gray-500 border-gray-300"
                      }
                    >
                      {laporanStatusOptions.find((s) => s.value === item.status)?.label || item.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {getCategoryBadge(item.categoryId) || (
                      <Badge className="text-[10px] bg-bkad-light text-bkad-green">{item.category}</Badge>
                    )}
                    <span className="text-xs text-gray-400">{item.name} &middot; {item.email || item.phone}</span>
                  </div>
                </div>
                {renderActionButtons(item, "laporan", false)}
              </div>
            ))}
          </div>
        );

      case "users":
        return (
          <div className="space-y-3">
            {users.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Belum ada pengguna</p>
              </div>
            )}
            {users.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${!item.active ? "opacity-50" : ""}`}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                  {resolveFileUrl(item.avatar) ? (
                    <img src={resolveFileUrl(item.avatar)!} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-bkad-light text-bkad-green font-bold text-sm">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{item.email}</span>
                    <Badge
                      variant="outline"
                      className={
                        item.role === "superadmin"
                          ? "text-bkad-gold border-bkad-gold/30 text-[10px]"
                          : item.role === "admin"
                          ? "text-bkad-green border-bkad-green/30 text-[10px]"
                          : "text-sky-600 border-sky-300 text-[10px]"
                      }
                    >
                      {item.role === "superadmin" ? "Super Admin" : item.role === "admin" ? "Admin" : "Editor"}
                    </Badge>
                  </div>
                </div>
                {renderActionButtons(item, "users")}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Render Dashboard ────────────────────────────────────────────────────

  const renderDashboard = () => {
    const totalItems =
      heroSlides.length + news.length + agenda.length + gallery.length +
      stats.length + services.length + financialData.length + pageContents.length +
      officials.length + publications.length + videos.length + infographics.length + laporan.length;

    const activeItems =
      heroSlides.filter((i) => i.active).length + news.filter((i) => i.active).length +
      gallery.filter((i) => i.active).length + stats.filter((i) => i.active).length +
      services.filter((i) => i.active).length + officials.filter((i) => i.active).length +
      publications.filter((i) => i.active).length + videos.filter((i) => i.active).length +
      infographics.filter((i) => i.active).length;

    const newLaporan = laporan.filter((l) => l.status === "baru").length;

    return (
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-bkad-light flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-bkad-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-bkad-green">{totalItems}</p>
                <p className="text-xs text-gray-500">Total Data</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <ToggleRight className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{activeItems}</p>
                <p className="text-xs text-gray-500">Data Aktif</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{newLaporan}</p>
                <p className="text-xs text-gray-500">Laporan Baru</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-bkad-light flex items-center justify-center">
                <Tag className="w-5 h-5 text-bkad-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-bkad-green">{categories.length}</p>
                <p className="text-xs text-gray-500">Kategori</p>
              </div>
            </div>
          </div>
        </div>

        {/* Blob Store & Upload Settings */}
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Blob Store &amp; Pengaturan Upload
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => { updateBlobStatus(); fetchUploadConfig(); }}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
          </div>
          {/* Connection Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
              {blobOnline ? (
                <Wifi className="w-5 h-5 text-emerald-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="text-sm font-medium">{blobOnline ? "Online" : "Offline"}</p>
                <p className="text-[10px] text-gray-400">Status Koneksi</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
              {blobPendingCount > 0 ? (
                <CloudOff className="w-5 h-5 text-amber-500" />
              ) : (
                <Cloud className="w-5 h-5 text-emerald-500" />
              )}
              <div>
                <p className="text-sm font-medium">{blobPendingCount} file</p>
                <p className="text-[10px] text-gray-400">Menunggu Sync</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
              <HardDrive className="w-5 h-5 text-bkad-green" />
              <div>
                <p className="text-sm font-medium">{uploadConfig?.stats?.totalFiles ?? 0} file</p>
                <p className="text-[10px] text-gray-400">Total di Server</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
              <Cloud className="w-5 h-5 text-bkad-gold" />
              <div>
                <p className="text-sm font-medium">{uploadConfig?.stats?.totalSizeFormatted ?? "0B"}</p>
                <p className="text-[10px] text-gray-400">Total Ukuran</p>
              </div>
            </div>
          </div>
          {/* Upload Configuration */}
          {uploadConfig?.config && (
            <div className="border-t pt-3 mt-1">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pengaturan Upload (.env)</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-gray-50">
                  <p className="text-gray-400">Direktori Upload</p>
                  <p className="font-medium text-gray-700 truncate">{uploadConfig.config.uploadDir}</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50">
                  <p className="text-gray-400">Ukuran Maks</p>
                  <p className="font-medium text-gray-700">{uploadConfig.config.maxSizeMB} MB</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50">
                  <p className="text-gray-400">Blob Tracking</p>
                  <p className="font-medium text-gray-700">{uploadConfig.config.blobTracking ? "Aktif" : "Nonaktif"}</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50">
                  <p className="text-gray-400">Kualitas Kompresi</p>
                  <p className="font-medium text-gray-700">{uploadConfig.config.compressQuality}%</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50">
                  <p className="text-gray-400">Max Lebar Gambar</p>
                  <p className="font-medium text-gray-700">{uploadConfig.config.maxImageWidth}px</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50">
                  <p className="text-gray-400">Max Tinggi Gambar</p>
                  <p className="font-medium text-gray-700">{uploadConfig.config.maxImageHeight}px</p>
                </div>
              </div>
              <div className="mt-2 p-2 rounded-lg bg-gray-50">
                <p className="text-gray-400 text-xs mb-1">Ekstensi File Diizinkan</p>
                <div className="flex flex-wrap gap-1">
                  {uploadConfig.config.allowedExtensions.map((ext: string) => (
                    <span key={ext} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {ext}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 italic">
                Ubah pengaturan di file <code className="bg-gray-100 px-1 rounded">.env</code> untuk mengkonfigurasi koneksi dan batasan upload. Restart server setelah mengubah.
              </p>
            </div>
          )}
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Akses Cepat</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {menuItems.filter((m) => m.key !== "dashboard").map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-bkad-light transition-colors text-center"
                >
                  <Icon className="w-5 h-5 text-bkad-green" />
                  <span className="text-[11px] text-gray-600 leading-tight">{item.label}</span>
                  {item.count > 0 && (
                    <span className="text-[10px] text-bkad-green font-medium">{item.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
          <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Zona Bahaya
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Tindakan berikut akan mengatur ulang konfigurasi awal aplikasi
          </p>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
            onClick={async () => {
              if (confirm("Apakah Anda yakin ingin mengatur ulang setup wizard? Ini akan menghapus status setup dan Anda akan diminta untuk menjalankan wizard lagi saat reload halaman.")) {
                try {
                  await fetch("/api/setup", { method: "DELETE" });
                  useSetupStore.getState().reset();
                  toast({ title: "Berhasil", description: "Setup wizard telah direset. Reload halaman untuk menjalankan wizard kembali." });
                } catch {
                  toast({ title: "Gagal", description: "Gagal mereset setup wizard", variant: "destructive" });
                }
              }
            }}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset Setup Wizard
          </Button>
        </div>
      </div>
    );
  };

  // ─── Section Title ────────────────────────────────────────────────────────

  const getSectionTitle = (section: Section): string => {
    const titles: Record<Section, string> = {
      dashboard: "Dashboard",
      categories: "Kategori",
      "hero-slides": "Hero Banner",
      news: "Berita",
      agenda: "Agenda",
      gallery: "Galeri",
      stats: "Statistik",
      services: "Layanan",
      "financial-data": "Data Keuangan",
      "page-content": "Konten Halaman",
      officials: "Pejabat",
      publications: "Publikasi",
      videos: "Video",
      infographics: "Infografis",
      laporan: "Laporan",
      users: "Pengguna",
    };
    return titles[section];
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-40 flex bg-gray-50">
      {/* ─── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        className={`${sidebarOpen ? "w-60" : "w-16"} bg-bkad-dark flex flex-col transition-all duration-300 flex-shrink-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-bkad-gold" />
              <span className="text-white font-bold text-sm">BKAD Admin</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/70 hover:text-white p-1 rounded transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  isActive
                    ? "bg-bkad-green text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="text-sm flex-1">{item.label}</span>
                    {item.count > 0 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-white/10 text-white/50"
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Close */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
          >
            <X className="w-4 h-4" />
            {sidebarOpen && "Tutup Admin"}
          </button>
        </div>
      </aside>

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
          <h1 className="text-lg font-bold text-bkad-dark">{getSectionTitle(activeSection)}</h1>
          <div className="flex items-center gap-2">
            {/* Blob status indicator */}
            <div className="flex items-center gap-1.5 mr-2">
              {blobOnline ? (
                <Wifi className="w-4 h-4 text-emerald-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              {blobPendingCount > 0 && (
                <Badge variant="outline" className="text-[10px] border-amber-400 text-amber-600">
                  {blobPendingCount} sync
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              className="gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            {activeSection !== "dashboard" && activeSection !== "app-identity" && (
              <Button
                size="sm"
                onClick={openCreateModal}
                className="gap-1 bg-bkad-green hover:bg-bkad-dark text-white"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah Data</span>
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeSection === "dashboard" ? (
            renderDashboard()
          ) : (
            renderDataTable()
          )}
        </div>
      </main>

      {/* ─── Create/Edit Modal (inline overlay, NOT Dialog) ───────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => { setModalOpen(false); setEditItem(null); setFormData({}); }}
          />
          {/* Modal Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-bkad-dark">
                {editItem ? "Edit Data" : "Tambah Data"} — {getSectionTitle(activeSection)}
              </h2>
              <button
                onClick={() => { setModalOpen(false); setEditItem(null); setFormData({}); }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {renderFormFields()}
            </div>
            {/* Footer */}
            <div className="p-6 border-t flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => { setModalOpen(false); setEditItem(null); setFormData({}); }}
              >
                Batal
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="gap-2 bg-bkad-green hover:bg-bkad-dark text-white"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Detail Modal (inline overlay) ────────────────────────────────── */}
      {detailOpen && detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => { setDetailOpen(false); setDetailItem(null); }}
          />
          {/* Modal Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-bkad-dark">Detail — {getSectionTitle(activeSection)}</h2>
              <button
                onClick={() => { setDetailOpen(false); setDetailItem(null); }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {renderDetailContent()}
            </div>
            {/* Footer */}
            <div className="p-6 border-t flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => { setDetailOpen(false); setDetailItem(null); }}
              >
                Tutup
              </Button>
              <Button
                onClick={() => {
                  setDetailOpen(false);
                  setDetailItem(null);
                  openEditModal(detailItem);
                }}
                className="gap-2 bg-bkad-green hover:bg-bkad-dark text-white"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation (inline overlay) ─────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          {/* Modal Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10">
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Data?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Data yang dihapus tidak dapat dikembalikan. Apakah Anda yakin?
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deleteConfirm)}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
