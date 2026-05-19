"use client";

import { useState, useEffect } from "react";
import { usePageRouter } from "@/stores/usePageRouter";
import { ChevronRight, Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Download, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveFileUrl } from "@/lib/utils";

interface NewsData {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
  images: string;
  readTime: string;
}

const categoryColors: Record<string, string> = {
  Keuangan: "bg-emerald-100 text-emerald-700",
  Teknologi: "bg-sky-100 text-sky-700",
  Pajak: "bg-amber-100 text-amber-700",
  Aset: "bg-violet-100 text-violet-700",
  Anggaran: "bg-rose-100 text-rose-700",
  PAD: "bg-orange-100 text-orange-700",
};

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

export default function NewsDetailPage({ id }: { id: string }) {
  const { goHome } = usePageRouter();
  const [news, setNews] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState<NewsData[]>([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(`/api/news/${id}`);
        const result = await res.json();
        if (result.success && result.data) {
          setNews(result.data);
          // Fetch related news
          const relatedRes = await fetch(`/api/news`);
          const relatedResult = await relatedRes.json();
          if (relatedResult.success && relatedResult.data) {
            const filtered = relatedResult.data
              .filter((n: NewsData) => n.id !== id && n.active)
              .sort((a: NewsData, b: NewsData) => a.order - b.order)
              .slice(0, 3);
            setRelatedNews(filtered);
          }
        }
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl mx-auto px-4">
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Berita tidak ditemukan</p>
        <Button onClick={goHome} variant="outline" className="border-bkad-green text-bkad-green">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a onClick={goHome} className="hover:text-bkad-green cursor-pointer">Beranda</a>
          <ChevronRight className="w-4 h-4" />
          <a onClick={() => usePageRouter.getState().navigate("berita")} className="hover:text-bkad-green cursor-pointer">Berita</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-bkad-green font-medium line-clamp-1">{news.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-64 md:h-96">
                {resolveFileUrl(news.image) ? (
                  <img
                    src={resolveFileUrl(news.image)!}
                    alt={news.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <Newspaper className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className={categoryColors[news.category] || "bg-gray-100 text-gray-700"}>
                    {news.category}
                  </Badge>
                  <span className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {news.date}
                  </span>
                  <span className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {news.readTime}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                  {news.title}
                </h1>

                {/* Content */}
                <div className="prose prose-gray max-w-none">
                  {news.content ? (
                    news.content.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-700 leading-relaxed mb-4">{news.excerpt}</p>
                  )}
                </div>

                {/* Image Gallery */}
                {(() => {
                  const images = parseImages(news.images);
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

                {/* Share */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 font-medium">Bagikan:</span>
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                      <Facebook className="w-4 h-4 mr-1" />
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" className="text-sky-500 border-sky-200 hover:bg-sky-50">
                      <Twitter className="w-4 h-4 mr-1" />
                      Twitter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 border-gray-200 hover:bg-gray-50"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Salin Link
                    </Button>
                  </div>
                </div>
              </div>
            </article>

            {/* Back Button */}
            <div className="mt-6">
              <Button
                onClick={() => usePageRouter.getState().navigate("berita")}
                variant="outline"
                className="border-bkad-green text-bkad-green hover:bg-bkad-green hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Berita
              </Button>
            </div>
          </div>

          {/* Sidebar - Related News */}
          <aside className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Berita Lainnya</h3>
              <div className="space-y-4">
                {relatedNews.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 cursor-pointer group"
                    onClick={() => usePageRouter.getState().navigateToDetail("news-detail", item.id)}
                  >
                    <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      {resolveFileUrl(item.image) ? (
                        <img
                          src={resolveFileUrl(item.image)!}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Newspaper className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-bkad-green transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                    </div>
                  </div>
                ))}
                {relatedNews.length === 0 && (
                  <p className="text-sm text-gray-400">Tidak ada berita terkait</p>
                )}
              </div>
            </div>

            <div className="bg-bkad-green/5 rounded-xl p-5 border border-bkad-green/10">
              <h3 className="font-bold text-gray-900 mb-2">Lapor!</h3>
              <p className="text-sm text-gray-600 mb-3">
                Punya pertanyaan atau laporan terkait keuangan daerah? Sampaikan kepada kami.
              </p>
              <Button
                onClick={() => usePageRouter.getState().navigate("laporan")}
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
