"use client";

import { useState, useEffect } from "react";
import { usePageRouter, pageTitles } from "@/stores/usePageRouter";
import { ChevronRight, Image as ImageIcon, Play, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GalleryItem {
  id: string;
  image: string;
  caption: string;
}

interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  date: string;
}

interface InfographicItem {
  id: string;
  title: string;
  image: string;
  date: string;
}

function resolveFileUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('/uploads/')) return `/api/files${url}`;
  return url;
}

type MediaType = "foto" | "video" | "infografis";

export default function MediaPage({ type }: { type: MediaType }) {
  const { currentPage, navigateToDetail } = usePageRouter();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [infographics, setInfographics] = useState<InfographicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (type === "foto") {
          const res = await fetch("/api/gallery");
          const result = await res.json();
          if (result.success) setGallery(result.data || []);
        } else if (type === "video") {
          const res = await fetch("/api/videos");
          const result = await res.json();
          if (result.success) setVideos(result.data || []);
        } else {
          const res = await fetch("/api/infographics");
          const result = await res.json();
          if (result.success) setInfographics(result.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [type]);

  const pageTitle = type === "foto" ? "Galeri Foto" : type === "video" ? "Galeri Video" : "Infografis";

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <a onClick={() => usePageRouter.getState().goHome()} className="hover:text-bkad-green cursor-pointer">Beranda</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-400">Media</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-bkad-green font-medium">{pageTitles[currentPage]}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-gray-600 text-sm mt-1">
                {type === "foto"
                  ? `${gallery.length} foto dalam galeri`
                  : type === "video"
                  ? `${videos.length} video tersedia`
                  : `${infographics.length} infografis tersedia`}
              </p>
            </div>

            {loading ? (
              <div className={`grid gap-4 ${type === "video" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-xl animate-pulse" style={{ aspectRatio: type === "infografis" ? "1/1" : "4/3" }} />
                ))}
              </div>
            ) : (
              <>
                {/* Foto Grid */}
                {type === "foto" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {gallery.map((item) => (
                      <div
                        key={item.id}
                        className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm border border-gray-100"
                        style={{ aspectRatio: "4/3" }}
                        onClick={() => setSelectedImage(item.image)}
                      >
                        <img
                          src={resolveFileUrl(item.image)}
                          alt={item.caption}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="text-white text-xs font-medium">{item.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Video Grid */}
                {type === "video" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigateToDetail("video-detail", video.id)}
                      >
                        <div className="relative aspect-video bg-gray-100">
                          <img
                            src={resolveFileUrl(video.thumbnail || "/images/hero-1.png")}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 text-bkad-green ml-1" />
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{video.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">{video.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Infografis Grid */}
                {type === "infografis" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {infographics.map((infographic) => (
                      <div
                        key={infographic.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="relative aspect-square bg-gray-100">
                          <img
                            src={resolveFileUrl(infographic.image)}
                            alt={infographic.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{infographic.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">{infographic.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {(type === "foto" && gallery.length === 0) ||
                (type === "video" && videos.length === 0) ||
                (type === "infografis" && infographics.length === 0) ? (
                  <div className="text-center py-12">
                    {type === "foto" ? (
                      <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    ) : type === "video" ? (
                      <Play className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    ) : (
                      <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    )}
                    <p className="text-gray-500">Belum ada konten</p>
                  </div>
                ) : null}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Kategori Media</h3>
              <nav className="space-y-1">
                {[
                  { key: "media-foto" as const, label: "Foto", icon: ImageIcon },
                  { key: "media-video" as const, label: "Video", icon: Play },
                  { key: "media-infografis" as const, label: "Infografis", icon: BarChart3 },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => usePageRouter.getState().navigate(item.key)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      currentPage === item.key
                        ? "bg-bkad-light text-bkad-green font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-bkad-green"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[90] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={resolveFileUrl(selectedImage)}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
