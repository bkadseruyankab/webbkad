"use client";

import { useState, useEffect } from "react";
import { usePageRouter } from "@/stores/usePageRouter";
import {
  ChevronRight,
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  BookOpen,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveFileUrl, getDownloadUrl } from "@/lib/utils";

interface PublicationData {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  coverImage: string;
  images: string;
  downloadableFiles: string;
  date: string;
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  "laporan-keuangan": {
    label: "Laporan Keuangan",
    color: "bg-emerald-100 text-emerald-700",
  },
  buletin: { label: "Buletin", color: "bg-amber-100 text-amber-700" },
  "data-pokok": { label: "Data Pokok", color: "bg-sky-100 text-sky-700" },
  peraturan: { label: "Peraturan", color: "bg-violet-100 text-violet-700" },
};

const categoryNavItems = [
  {
    key: "publikasi-laporan" as const,
    label: "Laporan Keuangan",
    cat: "laporan-keuangan",
  },
  { key: "publikasi-buletin" as const, label: "Buletin", cat: "buletin" },
  {
    key: "publikasi-data-pokok" as const,
    label: "Data Pokok",
    cat: "data-pokok",
  },
  {
    key: "publikasi-peraturan" as const,
    label: "Peraturan",
    cat: "peraturan",
  },
];

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

function parseDownloadableFiles(jsonStr: string | null | undefined): { url: string; name: string; originalName: string; mimeType: string; size: number }[] {
  if (!jsonStr) return [];
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function PublicationDetailPage({ id }: { id: string }) {
  const { goHome } = usePageRouter();
  const [publication, setPublication] = useState<PublicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPublications, setRelatedPublications] = useState<
    PublicationData[]
  >([]);

  useEffect(() => {
    async function fetchPublication() {
      try {
        const res = await fetch(`/api/publications/${id}`);
        const result = await res.json();
        if (result.success && result.data) {
          const pub = result.data;
          setPublication(pub);

          // Fetch related publications by category
          if (pub.category) {
            const relatedRes = await fetch(
              `/api/publications?category=${pub.category}`
            );
            const relatedResult = await relatedRes.json();
            if (relatedResult.success && relatedResult.data) {
              const filtered = relatedResult.data
                .filter((p: PublicationData) => p.id !== id)
                .slice(0, 5);
              setRelatedPublications(filtered);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch publication:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPublication();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl mx-auto px-4">
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-80 bg-gray-200 rounded-xl" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-10 bg-gray-200 rounded w-40" />
        </div>
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <FileText className="w-16 h-16 text-gray-300" />
        <p className="text-gray-500 text-lg">Publikasi tidak ditemukan</p>
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

  const config =
    categoryConfig[publication.category] || {
      label: publication.category,
      color: "bg-gray-100 text-gray-700",
    };

  const categoryPageKey = categoryNavItems.find(
    (item) => item.cat === publication.category
  )?.key;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <a
            onClick={goHome}
            className="hover:text-bkad-green cursor-pointer"
          >
            Beranda
          </a>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <a
            onClick={() => {
              if (categoryPageKey) {
                usePageRouter.getState().navigate(categoryPageKey);
              } else {
                usePageRouter.getState().navigate("publikasi-laporan");
              }
            }}
            className="hover:text-bkad-green cursor-pointer"
          >
            Publikasi
          </a>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <span className="text-bkad-green font-medium line-clamp-1">
            {publication.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Cover Image */}
              <div className="relative h-64 md:h-[420px] bg-gray-100">
                {resolveFileUrl(publication.coverImage) ? (
                  <img
                    src={resolveFileUrl(publication.coverImage)!}
                    alt={publication.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <BookOpen className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {/* Category badge on image */}
                <div className="absolute top-4 left-4">
                  <Badge className={`${config.color} text-xs font-medium`}>
                    {config.label}
                  </Badge>
                </div>
              </div>

              <div className="p-6 md:p-8">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {publication.date}
                  </span>
                  <span className="flex items-center text-sm text-gray-400">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {config.label}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {publication.title}
                </h1>

                {/* Description */}
                <div className="prose prose-gray max-w-none mb-6">
                  {publication.description ? (
                    publication.description.split("\n\n").map((paragraph, i) => (
                      <p
                        key={i}
                        className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line"
                      >
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">
                      Deskripsi publikasi belum tersedia.
                    </p>
                  )}
                </div>

                {/* File Info & Download */}
                {publication.fileUrl && (
                  <div className="mt-6 p-4 bg-bkad-green/5 rounded-xl border border-bkad-green/10">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-bkad-green/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-bkad-green" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Dokumen Publikasi
                          </p>
                          <p className="text-xs text-gray-500">
                            Klik tombol untuk mengunduh dokumen
                          </p>
                        </div>
                      </div>
                      <Button
                        asChild
                        className="bg-bkad-green hover:bg-bkad-dark text-white"
                      >
                        <a
                          href={resolveFileUrl(publication.fileUrl) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Unduh Dokumen
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Image Gallery */}
                {(() => {
                  const images = parseImages(publication.images);
                  if (images.length === 0) return null;
                  return (
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Galeri Gambar</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((img, i) => {
                          const resolvedImgUrl = resolveFileUrl(img.url);
                          return (
                          <div key={i} className="group relative rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="aspect-video bg-gray-100">
                              {resolvedImgUrl && <img
                                src={resolvedImgUrl}
                                alt={img.alt || img.caption || `Gambar ${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />}
                            </div>
                            {img.caption && (
                              <div className="p-2 bg-white">
                                <p className="text-xs text-gray-600 truncate">{img.caption}</p>
                              </div>
                            )}
                          </div>
                        );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Downloadable Files */}
                {(() => {
                  const files = parseDownloadableFiles(publication.downloadableFiles);
                  if (files.length === 0) return null;
                  return (
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">File Unduhan</h3>
                      <div className="flex flex-wrap gap-3">
                        {files.map((file, i) => (
                          <a
                            key={i}
                            href={getDownloadUrl(file.url)}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm border hover:shadow-md bg-bkad-green/10 text-bkad-green border-bkad-green/30 hover:bg-bkad-green/20"
                          >
                            <Download className="w-4 h-4" />
                            {file.name || file.originalName}
                            <span className="text-xs opacity-60 ml-1">({formatFileSize(file.size)})</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* View count / additional info */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    Dilihat
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Diterbitkan {publication.date}
                  </span>
                </div>
              </div>
            </article>

            {/* Back Button */}
            <div className="mt-6">
              <Button
                onClick={() => {
                  if (categoryPageKey) {
                    usePageRouter.getState().navigate(categoryPageKey);
                  } else {
                    usePageRouter.getState().navigate("publikasi-laporan");
                  }
                }}
                variant="outline"
                className="border-bkad-green text-bkad-green hover:bg-bkad-green hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke {config.label}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Category Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">
                Kategori Publikasi
              </h3>
              <nav className="space-y-1">
                {categoryNavItems.map((item) => {
                  const isActive = publication.category === item.cat;
                  return (
                    <button
                      key={item.key}
                      onClick={() =>
                        usePageRouter.getState().navigate(item.key)
                      }
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-bkad-light text-bkad-green font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-bkad-green"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Related Publications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">
                Publikasi Terkait
              </h3>
              <div className="space-y-4">
                {relatedPublications.map((item) => {
                  const itemConfig =
                    categoryConfig[item.category] || {
                      label: item.category,
                      color: "bg-gray-100 text-gray-700",
                    };
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 cursor-pointer group"
                      onClick={() =>
                        usePageRouter
                          .getState()
                          .navigateToDetail("publication-detail", item.id)
                      }
                    >
                      <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        {resolveFileUrl(item.coverImage) ? (
                          <img
                            src={resolveFileUrl(item.coverImage)!}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <FileText className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge
                          className={`text-[9px] mb-1 ${itemConfig.color}`}
                        >
                          {itemConfig.label}
                        </Badge>
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-bkad-green transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {relatedPublications.length === 0 && (
                  <p className="text-sm text-gray-400">
                    Tidak ada publikasi terkait
                  </p>
                )}
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-bkad-green/5 rounded-xl p-5 border border-bkad-green/10">
              <h3 className="font-bold text-gray-900 mb-2">
                Butuh Dokumen Lain?
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Jika Anda membutuhkan dokumen publikasi lainnya, jangan ragu
                untuk menghubungi kami.
              </p>
              <Button
                onClick={() => usePageRouter.getState().navigate("kontak")}
                size="sm"
                className="bg-bkad-green hover:bg-bkad-dark text-white w-full"
              >
                Hubungi Kami
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
