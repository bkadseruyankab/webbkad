"use client";

import { useState, useEffect } from "react";
import { usePageRouter } from "@/stores/usePageRouter";
import {
  ChevronRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AgendaData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: string; // "upcoming" | "ongoing" | "completed"
  images: string;
}

const statusConfig: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  upcoming: {
    label: "Akan Datang",
    badgeClass: "bg-sky-100 text-sky-700 border-sky-200",
    dotClass: "bg-sky-500",
  },
  ongoing: {
    label: "Berlangsung",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  completed: {
    label: "Selesai",
    badgeClass: "bg-gray-100 text-gray-600 border-gray-200",
    dotClass: "bg-gray-400",
  },
};

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

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

export default function AgendaDetailPage({ id }: { id: string }) {
  const { goHome } = usePageRouter();
  const [agenda, setAgenda] = useState<AgendaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedAgendas, setRelatedAgendas] = useState<AgendaData[]>([]);

  useEffect(() => {
    async function fetchAgenda() {
      try {
        const res = await fetch(`/api/agenda/${id}`);
        const result = await res.json();
        if (result.success && result.data) {
          setAgenda(result.data);

          // Fetch related agendas (upcoming & ongoing only)
          const relatedRes = await fetch(`/api/agenda`);
          const relatedResult = await relatedRes.json();
          if (relatedResult.success && relatedResult.data) {
            const filtered = relatedResult.data
              .filter(
                (a: AgendaData) =>
                  a.id !== id &&
                  (a.status === "upcoming" || a.status === "ongoing")
              )
              .slice(0, 5);
            setRelatedAgendas(filtered);
          }
        }
      } catch (err) {
        console.error("Failed to fetch agenda:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchAgenda();
  }, [id]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl mx-auto px-4">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    );
  }

  // Not found state
  if (!agenda) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg font-medium">
          Agenda tidak ditemukan
        </p>
        <p className="text-gray-400 text-sm">
          Agenda yang Anda cari tidak tersedia atau telah dihapus.
        </p>
        <Button
          onClick={goHome}
          variant="outline"
          className="border-bkad-green text-bkad-green"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  const statusInfo =
    statusConfig[agenda.status] || statusConfig.completed;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a
            onClick={goHome}
            className="hover:text-bkad-green cursor-pointer"
          >
            Beranda
          </a>
          <ChevronRight className="w-4 h-4" />
          <a
            onClick={() => usePageRouter.getState().navigate("home")}
            className="hover:text-bkad-green cursor-pointer"
          >
            Agenda
          </a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-bkad-green font-medium line-clamp-1">
            {agenda.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Status Header Bar */}
              <div className="bg-gradient-to-r from-bkad-green to-bkad-dark px-6 md:px-8 py-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`w-2 h-2 rounded-full ${statusInfo.dotClass} animate-pulse`}
                  />
                  <Badge className={`${statusInfo.badgeClass} border text-xs`}>
                    {statusInfo.label}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {agenda.title}
                </h1>
              </div>

              <div className="p-6 md:p-8">
                {/* Meta Information Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {/* Date */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-bkad-green/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-bkad-green" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                        Tanggal
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(agenda.date)}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-bkad-gold/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-bkad-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                        Waktu
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {agenda.time}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                        Lokasi
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {agenda.location}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                        Status
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {statusInfo.label}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-bkad-green" />
                    <h2 className="text-lg font-bold text-gray-900">
                      Deskripsi Agenda
                    </h2>
                  </div>
                  <div className="prose prose-gray max-w-none">
                    {agenda.description ? (
                      agenda.description.split("\n\n").map((paragraph, i) => (
                        <p
                          key={i}
                          className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line"
                        >
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">
                        Detail agenda akan segera tersedia.
                      </p>
                    )}
                  </div>
                </div>

                {/* Image Gallery */}
                {(() => {
                  const images = parseImages(agenda.images);
                  if (images.length === 0) return null;
                  return (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-bkad-green" />
                        <h2 className="text-lg font-bold text-gray-900">Galeri Dokumentasi</h2>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((img, i) => (
                          <div key={i} className="group relative rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="aspect-video bg-gray-100">
                              <img
                                src={img.url}
                                alt={img.alt || img.caption || `Dokumentasi ${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

                {/* CTA Section */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="bg-bkad-green/5 rounded-xl p-6 border border-bkad-green/10">
                    <h3 className="font-bold text-gray-900 mb-2">
                      Butuh Bantuan?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Hubungi kami untuk informasi lebih lanjut terkait agenda
                      kegiatan ini atau sampaikan pertanyaan Anda.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() =>
                          usePageRouter.getState().navigate("laporan")
                        }
                        className="bg-bkad-green hover:bg-bkad-dark text-white"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Buat Laporan
                      </Button>
                      <Button
                        onClick={() =>
                          usePageRouter.getState().navigate("kontak")
                        }
                        variant="outline"
                        className="border-bkad-green text-bkad-green hover:bg-bkad-green hover:text-white"
                      >
                        Hubungi Kami
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Back Button */}
            <div className="mt-6">
              <Button
                onClick={goHome}
                variant="outline"
                className="border-bkad-green text-bkad-green hover:bg-bkad-green hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </div>
          </div>

          {/* Sidebar - Related Agendas */}
          <aside className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">
                Agenda Lainnya
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {relatedAgendas.map((item) => {
                  const itemStatus =
                    statusConfig[item.status] || statusConfig.completed;
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors border border-gray-50 hover:border-gray-100"
                      onClick={() =>
                        usePageRouter
                          .getState()
                          .navigateToDetail("agenda-detail", item.id)
                      }
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${itemStatus.dotClass}`}
                        />
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider ${
                            item.status === "upcoming"
                              ? "text-sky-600"
                              : item.status === "ongoing"
                              ? "text-emerald-600"
                              : "text-gray-500"
                          }`}
                        >
                          {itemStatus.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-bkad-green transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {relatedAgendas.length === 0 && (
                  <p className="text-sm text-gray-400">
                    Tidak ada agenda terkait
                  </p>
                )}
              </div>
            </div>

            {/* Quick Report CTA */}
            <div className="bg-bkad-green/5 rounded-xl p-5 border border-bkad-green/10">
              <h3 className="font-bold text-gray-900 mb-2">Lapor!</h3>
              <p className="text-sm text-gray-600 mb-3">
                Punya pertanyaan atau laporan terkait keuangan daerah? Sampaikan
                kepada kami.
              </p>
              <Button
                onClick={() =>
                  usePageRouter.getState().navigate("laporan")
                }
                size="sm"
                className="bg-bkad-green hover:bg-bkad-dark text-white w-full"
              >
                Buat Laporan
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
