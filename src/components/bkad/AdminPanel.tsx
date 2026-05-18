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
  Search,
  Building2,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  Users,
  BookOpen,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// ─── Types ───────────────────────────────────────────────────────────────────

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  order: number;
  active: boolean;
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  order: number;
  active: boolean;
}

interface AgendaItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: string;
}

interface GalleryItem {
  id: string;
  image: string;
  caption: string;
  order: number;
  active: boolean;
}

interface StatItem {
  id: string;
  icon: string;
  value: string;
  prefix: string;
  suffix: string;
  label: string;
  color: string;
  order: number;
  active: boolean;
}

interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  order: number;
  active: boolean;
}

interface FinancialDataItem {
  id: string;
  year: string;
  pendapatan: number;
  belanja: number;
  realisasi: number;
}

interface PageContentItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  image: string;
}

interface OfficialItem {
  id: string;
  name: string;
  position: string;
  photo: string;
  nip: string;
  order: number;
  active: boolean;
}

interface PublicationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  coverImage: string;
  date: string;
  order: number;
  active: boolean;
}

interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  date: string;
  order: number;
  active: boolean;
}

interface InfographicItem {
  id: string;
  title: string;
  image: string;
  date: string;
  order: number;
  active: boolean;
}

type Section =
  | "dashboard"
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
  | "infographics";

// ─── Icon Map ────────────────────────────────────────────────────────────────

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

const categoryOptions = [
  "Keuangan",
  "Teknologi",
  "Pajak",
  "Aset",
  "Anggaran",
  "PAD",
];

const statusOptions = [
  { value: "upcoming", label: "Akan Datang" },
  { value: "ongoing", label: "Berlangsung" },
  { value: "completed", label: "Selesai" },
];

const publicationCategoryOptions = [
  { value: "laporan-keuangan", label: "Laporan Keuangan" },
  { value: "buletin", label: "Buletin" },
  { value: "data-pokok", label: "Data Pokok" },
  { value: "peraturan", label: "Peraturan" },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
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

  // ─── Modal States ─────────────────────────────────────────────────────────

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ─── Fetch Data ───────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    try {
      const [heroRes, newsRes, agendaRes, galleryRes, statsRes, servicesRes, financeRes, pcRes, offRes, pubRes, vidRes, infoRes] =
        await Promise.all([
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
        ]);

      const [heroData, newsData, agendaData, galleryData, statsData, servicesData, financeData, pcData, offData, pubData, vidData, infoData] =
        await Promise.all([
          heroRes.json(),
          newsRes.json(),
          agendaRes.json(),
          galleryRes.json(),
          statsRes.json(),
          servicesRes.json(),
          financeRes.json(),
          pcRes.json(),
          offRes.json(),
          pubRes.json(),
          vidRes.json(),
          infoRes.json(),
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
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── CRUD Handlers ────────────────────────────────────────────────────────

  const getApiBase = (section: Section) => {
    const map: Record<Section, string> = {
      dashboard: "",
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

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    } catch (err) {
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
    } catch (err) {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus data",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (item: any, section: Section) => {
    try {
      const res = await fetch(`${getApiBase(section)}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, active: !item.active }),
      });
      if (!res.ok) throw new Error("Gagal mengubah status");
      fetchData();
    } catch (err) {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const openCreateModal = () => {
    setEditItem(null);
    setFormData({});
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  // ─── Sidebar Menu ─────────────────────────────────────────────────────────

  const menuItems: { key: Section; label: string; icon: React.ElementType; count: number }[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, count: 0 },
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
  ];

  // ─── Render Form Fields ───────────────────────────────────────────────────

  const renderFormFields = () => {
    switch (activeSection) {
      case "hero-slides":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul</label>
              <Input
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul banner"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Subjudul</label>
              <Textarea
                value={formData.subtitle || ""}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Subjudul banner"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">URL Gambar</label>
              <Input
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/images/hero-1.png"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={formData.order || 0}
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

      case "news":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul</label>
              <Input
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul berita"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Ringkasan</label>
              <Textarea
                value={formData.excerpt || ""}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Ringkasan berita"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tanggal</label>
                <Input
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="15 Januari 2025"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Kategori</label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">URL Gambar</label>
                <Input
                  value={formData.image || ""}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/news-1.png"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Waktu Baca</label>
                <Input
                  value={formData.readTime || ""}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="5 menit"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={formData.order || 0}
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

      case "agenda":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul Kegiatan</label>
              <Input
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul kegiatan"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tanggal</label>
                <Input
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="20 Februari 2025"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Waktu</label>
                <Input
                  value={formData.time || ""}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="09:00 - 12:00 WIB"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Lokasi</label>
              <Input
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ruang Rapat Utama BKAD"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select
                value={formData.status || "upcoming"}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "gallery":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">URL Gambar</label>
              <Input
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/images/hero-1.png"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Keterangan</label>
              <Input
                value={formData.caption || ""}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="Keterangan foto"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={formData.order || 0}
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

      case "stats":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Ikon</label>
              <Select
                value={formData.icon || ""}
                onValueChange={(v) => setFormData({ ...formData, icon: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih ikon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Prefix</label>
                <Input
                  value={formData.prefix || ""}
                  onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                  placeholder="Rp "
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Nilai</label>
                <Input
                  value={formData.value || ""}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="1,25"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Suffix</label>
                <Input
                  value={formData.suffix || ""}
                  onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                  placeholder=" T"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Label</label>
              <Input
                value={formData.label || ""}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Anggaran Daerah 2024"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Warna</label>
                <Select
                  value={formData.color || ""}
                  onValueChange={(v) => setFormData({ ...formData, color: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih warna" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        <span className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${c.value.replace("text-", "bg-")}`} />
                          {c.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={formData.order || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </>
        );

      case "services":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Ikon</label>
              <Select
                value={formData.icon || ""}
                onValueChange={(v) => setFormData({ ...formData, icon: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih ikon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul Layanan</label>
              <Input
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Pengelolaan APBD"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Deskripsi</label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi layanan"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Warna Ikon</label>
                <Select
                  value={formData.color || ""}
                  onValueChange={(v) => setFormData({ ...formData, color: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih warna" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Warna Background</label>
                <Select
                  value={formData.bgColor || ""}
                  onValueChange={(v) => setFormData({ ...formData, bgColor: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih warna" />
                  </SelectTrigger>
                  <SelectContent>
                    {bgColorOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
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
                  value={formData.order || 0}
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

      case "financial-data":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Tahun</label>
              <Input
                value={formData.year || ""}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2024"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Pendapatan (M)</label>
                <Input
                  type="number"
                  value={formData.pendapatan || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, pendapatan: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Belanja (M)</label>
                <Input
                  type="number"
                  value={formData.belanja || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, belanja: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Realisasi (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.realisasi || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, realisasi: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </>
        );

      case "page-content":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Slug</label>
              <Input
                value={formData.slug || ""}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="sejarah, visi-misi, tugas-fungsi, struktur-organisasi"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul</label>
              <Input
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul halaman"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Konten</label>
              <Textarea
                value={formData.content || ""}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Konten halaman (mendukung HTML)"
                rows={8}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">URL Gambar</label>
              <Input
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/images/sejarah.png"
              />
            </div>
          </>
        );

      case "officials":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Nama</label>
              <Input
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama pejabat"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Jabatan</label>
              <Input
                value={formData.position || ""}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Kepala Badan"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">URL Foto</label>
              <Input
                value={formData.photo || ""}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                placeholder="/images/officials/photo.png"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">NIP</label>
              <Input
                value={formData.nip || ""}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                placeholder="197001011990011001"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={formData.order || 0}
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

      case "publications":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul</label>
              <Input
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul publikasi"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Deskripsi</label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi publikasi"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Kategori</label>
              <Select
                value={formData.category || ""}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {publicationCategoryOptions.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">URL File</label>
              <Input
                value={formData.fileUrl || ""}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="/files/laporan-2024.pdf"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">URL Cover</label>
              <Input
                value={formData.coverImage || ""}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="/images/covers/laporan-2024.png"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tanggal</label>
                <Input
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="15 Januari 2025"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={formData.order || 0}
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

      case "videos":
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul</label>
              <Input
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul video"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">URL Video</label>
              <Input
                value={formData.url || ""}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">URL Thumbnail</label>
              <Input
                value={formData.thumbnail || ""}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="/images/video-thumb.png"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tanggal</label>
                <Input
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="15 Januari 2025"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={formData.order || 0}
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
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul infografis"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">URL Gambar</label>
              <Input
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/images/infografis-1.png"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tanggal</label>
                <Input
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="15 Januari 2025"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Urutan</label>
                <Input
                  type="number"
                  value={formData.order || 0}
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

      default:
        return null;
    }
  };

  // ─── Render Data Table ────────────────────────────────────────────────────

  const renderDataTable = () => {
    switch (activeSection) {
      case "hero-slides":
        return (
          <div className="space-y-3">
            {heroSlides.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${
                  !item.active ? "opacity-50" : ""
                }`}
              >
                <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline" className="text-xs">
                    #{item.order}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleActive(item, "hero-slides")}
                  >
                    {item.active ? (
                      <ToggleRight className="w-5 h-5 text-bkad-green" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditModal(item)}
                  >
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDeleteConfirm(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
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
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${
                  !item.active ? "opacity-50" : ""
                }`}
              >
                <div className="w-20 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="text-[10px] bg-bkad-light text-bkad-green">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleActive(item, "news")}
                  >
                    {item.active ? (
                      <ToggleRight className="w-5 h-5 text-bkad-green" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditModal(item)}
                  >
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDeleteConfirm(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
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
                  <span className="text-sm font-bold">
                    {item.date.split(" ")[0]}
                  </span>
                  <span className="text-[10px]">
                    {item.date.split(" ")[1]?.substring(0, 3)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={`text-[10px] ${
                        item.status === "upcoming"
                          ? "bg-sky-100 text-sky-700"
                          : item.status === "ongoing"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status === "upcoming"
                        ? "Akan Datang"
                        : item.status === "ongoing"
                        ? "Berlangsung"
                        : "Selesai"}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {item.time} · {item.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditModal(item)}
                  >
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDeleteConfirm(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );

      case "gallery":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg border shadow-sm overflow-hidden ${
                  !item.active ? "opacity-50" : ""
                }`}
              >
                <div className="aspect-video bg-gray-100">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{item.caption}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-[10px]">
                      #{item.order}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleToggleActive(item, "gallery")}
                      >
                        {item.active ? (
                          <ToggleRight className="w-4 h-4 text-bkad-green" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEditModal(item)}
                      >
                        <Pencil className="w-3.5 h-3.5 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setDeleteConfirm(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
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
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${
                  !item.active ? "opacity-50" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{item.icon === "TrendingUp" ? "📈" : item.icon === "Building2" ? "🏛️" : item.icon === "FileCheck" ? "✅" : "💰"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">
                    {item.prefix}
                    {item.value}
                    {item.suffix}
                  </h4>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleActive(item, "stats")}
                  >
                    {item.active ? (
                      <ToggleRight className="w-5 h-5 text-bkad-green" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditModal(item)}
                  >
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDeleteConfirm(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
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
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${
                  !item.active ? "opacity-50" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center flex-shrink-0`}
                >
                  <span className={`font-bold text-sm ${item.color}`}>
                    {item.title.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleActive(item, "services")}
                  >
                    {item.active ? (
                      <ToggleRight className="w-5 h-5 text-bkad-green" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditModal(item)}
                  >
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDeleteConfirm(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
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
                <div className="w-14 h-14 rounded-lg bg-bkad-light flex items-center justify-center flex-shrink-0">
                  <span className="text-bkad-green font-bold text-sm">
                    {item.year}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Pendapatan</p>
                      <p className="font-medium">Rp {item.pendapatan} M</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Belanja</p>
                      <p className="font-medium">Rp {item.belanja} M</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Realisasi</p>
                      <Badge
                        className={`text-xs ${
                          item.realisasi >= 95
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.realisasi}%
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditModal(item)}
                  >
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDeleteConfirm(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
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
                <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="text-[10px] bg-gray-100 text-gray-600 font-mono">
                      {item.slug}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1">{item.content}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditModal(item)}
                  >
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDeleteConfirm(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
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
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${
                  !item.active ? "opacity-50" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.photo ? (
                    <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="text-[10px] bg-bkad-light text-bkad-green">
                      {item.position}
                    </Badge>
                    {item.nip && (
                      <span className="text-xs text-gray-400">NIP: {item.nip}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline" className="text-xs">
                    #{item.order}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleActive(item, "officials")}
                  >
                    {item.active ? (
                      <ToggleRight className="w-5 h-5 text-bkad-green" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditModal(item)}
                  >
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDeleteConfirm(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
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
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${
                  !item.active ? "opacity-50" : ""
                }`}
              >
                <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {item.coverImage ? (
                    <img src={item.coverImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="text-[10px] bg-amber-50 text-amber-700">
                      {publicationCategoryOptions.find(c => c.value === item.category)?.label || item.category}
                    </Badge>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleActive(item, "publications")}
                  >
                    {item.active ? (
                      <ToggleRight className="w-5 h-5 text-bkad-green" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditModal(item)}
                  >
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDeleteConfirm(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
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
                className={`bg-white rounded-lg p-4 border shadow-sm flex items-center gap-4 ${
                  !item.active ? "opacity-50" : ""
                }`}
              >
                <div className="w-24 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400 truncate max-w-[200px]">{item.url}</span>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleActive(item, "videos")}
                  >
                    {item.active ? (
                      <ToggleRight className="w-5 h-5 text-bkad-green" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditModal(item)}
                  >
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDeleteConfirm(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );

      case "infographics":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {infographics.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg border shadow-sm overflow-hidden ${
                  !item.active ? "opacity-50" : ""
                }`}
              >
                <div className="aspect-[3/4] bg-gray-100">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BarChart3 className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{item.date}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleToggleActive(item, "infographics")}
                      >
                        {item.active ? (
                          <ToggleRight className="w-4 h-4 text-bkad-green" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEditModal(item)}
                      >
                        <Pencil className="w-3.5 h-3.5 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setDeleteConfirm(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Dashboard ────────────────────────────────────────────────────────────

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Hero Banner", count: heroSlides.length, icon: "🖼️", color: "bg-emerald-50" },
          { label: "Berita", count: news.length, icon: "📰", color: "bg-amber-50" },
          { label: "Agenda", count: agenda.length, icon: "📅", color: "bg-teal-50" },
          { label: "Galeri", count: gallery.length, icon: "📸", color: "bg-violet-50" },
          { label: "Statistik", count: stats.length, icon: "📊", color: "bg-rose-50" },
          { label: "Layanan", count: services.length, icon: "⚙️", color: "bg-orange-50" },
          { label: "Data Keuangan", count: financialData.length, icon: "💰", color: "bg-sky-50" },
          { label: "Konten Halaman", count: pageContents.length, icon: "📄", color: "bg-cyan-50" },
          { label: "Pejabat", count: officials.length, icon: "👤", color: "bg-indigo-50" },
          { label: "Publikasi", count: publications.length, icon: "📕", color: "bg-fuchsia-50" },
          { label: "Video", count: videos.length, icon: "🎬", color: "bg-red-50" },
          { label: "Infografis", count: infographics.length, icon: "📈", color: "bg-lime-50" },
          {
            label: "Total Item Aktif",
            count:
              heroSlides.filter((h) => h.active).length +
              news.filter((n) => n.active).length +
              gallery.filter((g) => g.active).length +
              stats.filter((s) => s.active).length +
              services.filter((s) => s.active).length +
              officials.filter((o) => o.active).length +
              publications.filter((p) => p.active).length +
              videos.filter((v) => v.active).length +
              infographics.filter((i) => i.active).length,
            icon: "✅",
            color: "bg-emerald-50",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`${card.color} rounded-xl p-4 border border-gray-100`}
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{card.count}</p>
            <p className="text-xs text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Main Render ──────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-bkad-dark text-white flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h2 className="font-bold text-sm">Panel Admin</h2>
              <p className="text-[10px] text-white/60">BKAD Seruyan</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 h-8 w-8"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform ${
                !sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors ${
                activeSection === item.key
                  ? "bg-white/15 text-white font-medium"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && (
                <span className="ml-3 flex-1 text-left">{item.label}</span>
              )}
              {sidebarOpen && item.count > 0 && (
                <Badge className="bg-white/20 text-white text-[10px] h-5 min-w-[20px] flex items-center justify-center">
                  {item.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full text-white/70 hover:text-white hover:bg-white/10 text-sm justify-start"
            onClick={onClose}
          >
            <ChevronLeft className="w-4 h-4 mr-2 rotate-180" />
            {sidebarOpen && "Kembali ke Website"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {menuItems.find((m) => m.key === activeSection)?.label ||
                "Dashboard"}
            </h1>
            <p className="text-xs text-gray-500">
              Kelola data {menuItems.find((m) => m.key === activeSection)?.label?.toLowerCase() || "website"}
            </p>
          </div>
          {activeSection !== "dashboard" && (
            <Button
              onClick={openCreateModal}
              className="bg-bkad-green hover:bg-bkad-dark text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Data
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeSection === "dashboard" ? renderDashboard() : renderDataTable()}
        </div>
      </main>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editItem ? "Edit Data" : "Tambah Data Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">{renderFormFields()}</div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setModalOpen(false);
                setEditItem(null);
                setFormData({});
              }}
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-bkad-green hover:bg-bkad-dark text-white"
            >
              {saving ? (
                "Menyimpan..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak
            dapat dibatalkan.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
