"use client";

import { useState, useEffect } from "react";
import { usePageRouter, pageTitles } from "@/stores/usePageRouter";
import { ChevronRight, FileText, Download, Calendar, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Publication {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  coverImage: string;
  date: string;
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  "laporan-keuangan": { label: "Laporan Keuangan", color: "bg-emerald-100 text-emerald-700" },
  buletin: { label: "Buletin", color: "bg-amber-100 text-amber-700" },
  "data-pokok": { label: "Data Pokok", color: "bg-sky-100 text-sky-700" },
  peraturan: { label: "Peraturan", color: "bg-violet-100 text-violet-700" },
};

function resolveFileUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('/uploads/')) return `/api/files${url}`;
  return url;
}

export default function PublikasiPage({ category }: { category: string }) {
  const { currentPage, navigateToDetail } = usePageRouter();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/publications?category=${category}`);
        const result = await res.json();
        if (result.success) setPublications(result.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [category]);

  const filtered = publications.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const config = categoryConfig[category] || { label: category, color: "bg-gray-100 text-gray-700" };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <a onClick={() => usePageRouter.getState().goHome()} className="hover:text-bkad-green cursor-pointer">Beranda</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-400">Publikasi</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-bkad-green font-medium">{pageTitles[currentPage]}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{config.label}</h1>
                <p className="text-gray-600 text-sm mt-1">{filtered.length} dokumen ditemukan</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari publikasi..."
                  className="pl-9"
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-24 h-32 bg-gray-200 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-full" />
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada publikasi ditemukan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((pub) => (
                  <div
                    key={pub.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow group cursor-pointer"
                    onClick={() => navigateToDetail("publication-detail", pub.id)}
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={resolveFileUrl(pub.coverImage || "/images/infografis-1.png")}
                          alt={pub.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge className={`text-[10px] mb-2 ${config.color}`}>
                          {config.label}
                        </Badge>
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {pub.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                          {pub.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-xs text-gray-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            {pub.date}
                          </span>
                          {pub.fileUrl && (
                            <Button variant="outline" size="sm" className="text-bkad-green border-bkad-green/30 hover:bg-bkad-light">
                              <Download className="w-3.5 h-3.5 mr-1" />
                              Unduh
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Kategori Publikasi</h3>
              <nav className="space-y-1">
                {[
                  { key: "publikasi-laporan" as const, label: "Laporan Keuangan", cat: "laporan-keuangan" },
                  { key: "publikasi-buletin" as const, label: "Buletin", cat: "buletin" },
                  { key: "publikasi-data-pokok" as const, label: "Data Pokok", cat: "data-pokok" },
                  { key: "publikasi-peraturan" as const, label: "Peraturan", cat: "peraturan" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => usePageRouter.getState().navigate(item.key)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      currentPage === item.key
                        ? "bg-bkad-light text-bkad-green font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-bkad-green"
                    }`}
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
