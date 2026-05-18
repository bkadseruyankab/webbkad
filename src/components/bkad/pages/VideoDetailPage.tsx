"use client";

import { useState, useEffect } from "react";
import { usePageRouter } from "@/stores/usePageRouter";
import {
  ChevronRight,
  ArrowLeft,
  Calendar,
  Play,
  ExternalLink,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VideoData {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  images: string;
  date: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return null;
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

export default function VideoDetailPage({ id }: { id: string }) {
  const { goHome } = usePageRouter();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState<VideoData[]>([]);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch(`/api/videos/${id}`);
        const result = await res.json();
        if (result.success && result.data) {
          setVideo(result.data);
        }
        // Fetch related videos
        const relatedRes = await fetch("/api/videos");
        const relatedResult = await relatedRes.json();
        if (relatedResult.success && relatedResult.data) {
          const filtered = relatedResult.data
            .filter((v: VideoData) => v.id !== id)
            .slice(0, 5);
          setRelatedVideos(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch video:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchVideo();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // Loading skeleton state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-5xl mx-auto px-4">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded w-4" />
            <div className="h-4 bg-gray-200 rounded w-12" />
            <div className="h-4 bg-gray-200 rounded w-4" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content skeleton */}
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video bg-gray-200 rounded-xl" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-10 bg-gray-200 rounded w-40" />
            </div>
            {/* Sidebar skeleton */}
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found / error state
  if (!video) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Play className="w-16 h-16 text-gray-300" />
        <p className="text-gray-500 text-lg">Video tidak ditemukan</p>
        <Button
          onClick={() => usePageRouter.getState().navigate("media-video")}
          variant="outline"
          className="border-bkad-green text-bkad-green hover:bg-bkad-green hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Galeri Video
        </Button>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(video.url);
  const isYouTube = embedUrl !== null;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <a
            onClick={goHome}
            className="hover:text-bkad-green cursor-pointer transition-colors"
          >
            Beranda
          </a>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <a
            onClick={() =>
              usePageRouter.getState().navigate("media-video")
            }
            className="hover:text-bkad-green cursor-pointer transition-colors"
          >
            Media
          </a>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <a
            onClick={() =>
              usePageRouter.getState().navigate("media-video")
            }
            className="hover:text-bkad-green cursor-pointer transition-colors"
          >
            Video
          </a>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <span className="text-bkad-green font-medium line-clamp-1">
            {video.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Video Player */}
              <div className="relative aspect-video bg-black">
                {isYouTube ? (
                  <iframe
                    src={embedUrl}
                    title={video.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={video.url}
                    poster={video.thumbnail || "/images/hero-1.png"}
                    controls
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                  >
                    Browser Anda tidak mendukung pemutar video.
                  </video>
                )}
              </div>

              <div className="p-6 md:p-8">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className="bg-bkad-light text-bkad-green border-bkad-green/20">
                    Video
                  </Badge>
                  <span className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {video.date}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {video.title}
                </h1>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <Button
                    asChild
                    className="bg-bkad-green hover:bg-bkad-dark text-white"
                  >
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Tonton di {isYouTube ? "YouTube" : "Sumber"}
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    {shareCopied ? "Link Disalin!" : "Bagikan"}
                  </Button>
                </div>

                {/* Video info */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Informasi Video
                  </h3>
                  <div className="space-y-1.5 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-700">
                        Sumber:{" "}
                      </span>
                      {isYouTube ? "YouTube" : "Langsung"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">
                        Tanggal:{" "}
                      </span>
                      {video.date}
                    </p>
                    <p className="break-all">
                      <span className="font-medium text-gray-700">URL: </span>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bkad-green hover:underline"
                      >
                        {video.url}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Image Gallery */}
                {(() => {
                  const images = parseImages(video.images);
                  if (images.length === 0) return null;
                  return (
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Galeri Screenshot</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((img, i) => (
                          <div key={i} className="group relative rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="aspect-video bg-gray-100">
                              <img
                                src={img.url}
                                alt={img.alt || img.caption || `Screenshot ${i + 1}`}
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

                {/* Share section */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 font-medium">
                      Bagikan video ini:
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 border-gray-200 hover:bg-gray-50"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      {shareCopied ? "Disalin!" : "Salin Link"}
                    </Button>
                  </div>
                </div>
              </div>
            </article>

            {/* Back Button */}
            <div className="mt-6">
              <Button
                onClick={() =>
                  usePageRouter.getState().navigate("media-video")
                }
                variant="outline"
                className="border-bkad-green text-bkad-green hover:bg-bkad-green hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Galeri Video
              </Button>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <aside className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Video Lainnya</h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
                {relatedVideos.map((item) => {
                  const itemIsYouTube =
                    getYouTubeEmbedUrl(item.url) !== null;
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 cursor-pointer group"
                      onClick={() =>
                        usePageRouter
                          .getState()
                          .navigateToDetail("video-detail", item.id)
                      }
                    >
                      <div className="w-28 h-[4.2rem] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                        <img
                          src={item.thumbnail || "/images/hero-1.png"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                          <div className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="w-3 h-3 text-bkad-green ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-bkad-green transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">
                            {item.date}
                          </span>
                          {itemIsYouTube && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 border-red-200 text-red-500"
                            >
                              YouTube
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {relatedVideos.length === 0 && (
                  <p className="text-sm text-gray-400">
                    Tidak ada video lainnya
                  </p>
                )}
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-bkad-green/5 rounded-xl p-5 border border-bkad-green/10">
              <h3 className="font-bold text-gray-900 mb-2">Lapor!</h3>
              <p className="text-sm text-gray-600 mb-3">
                Punya pertanyaan atau laporan terkait keuangan daerah?
                Sampaikan kepada kami.
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

            {/* Media categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">
                Kategori Media
              </h3>
              <nav className="space-y-1">
                {[
                  { key: "media-foto" as const, label: "Galeri Foto" },
                  { key: "media-video" as const, label: "Galeri Video" },
                  { key: "media-infografis" as const, label: "Infografis" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() =>
                      usePageRouter.getState().navigate(item.key)
                    }
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors text-gray-600 hover:bg-bkad-light hover:text-bkad-green"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
