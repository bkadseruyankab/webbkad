"use client";

import { useState, useEffect } from "react";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePageRouter } from "@/stores/usePageRouter";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  order: number;
  active: boolean;
}

interface NewsApiResponse {
  success: boolean;
  data: NewsItem[];
}

const categoryColors: Record<string, string> = {
  Keuangan: "bg-emerald-100 text-emerald-700",
  Teknologi: "bg-sky-100 text-sky-700",
  Pajak: "bg-amber-100 text-amber-700",
  Aset: "bg-violet-100 text-violet-700",
  Anggaran: "bg-rose-100 text-rose-700",
  PAD: "bg-orange-100 text-orange-700",
};

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigateToDetail, navigate } = usePageRouter();

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        const json: NewsApiResponse = await res.json();
        if (json.success && json.data) {
          const activeItems = json.data
            .filter((item) => item.active)
            .sort((a, b) => a.order - b.order);
          if (activeItems.length > 0) {
            setNewsItems(activeItems);
          }
        }
      } catch {
        // Keep empty state on error
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <section id="berita" className="py-16 bg-white relative overflow-hidden">
      {/* Decorative ornaments */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
        <svg viewBox="0 0 200 200" className="w-full h-full text-bkad-green">
          <circle cx="100" cy="100" r="80" fill="currentColor" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-left mb-12">
          <div className="inline-block bg-bkad-light text-bkad-green text-xs font-semibold px-3 py-1 rounded-full mb-3">
            BERITA
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Berita Terkini
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Informasi terbaru seputar kebijakan keuangan, pengelolaan aset, dan
            kegiatan Badan Keuangan dan Aset Daerah Kabupaten Seruyan
          </p>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
                onClick={() => navigateToDetail("news-detail", item.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge
                    className={`absolute top-3 left-3 text-xs font-medium ${
                      categoryColors[item.category] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.category}
                  </Badge>
                </div>
                <div className="p-5">
                  <div className="flex items-center text-xs text-gray-400 mb-2 space-x-3">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-bkad-green transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {item.excerpt}
                  </p>
                  <div className="mt-3 flex items-center text-bkad-green text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Baca selengkapnya
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button
            onClick={() => navigate("berita")}
            className="bg-bkad-green hover:bg-bkad-dark text-white font-medium px-8 py-3 rounded-lg"
          >
            Lihat Semua Berita
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
