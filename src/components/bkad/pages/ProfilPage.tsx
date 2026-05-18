"use client";

import { useState, useEffect } from "react";
import { usePageRouter, pageTitles } from "@/stores/usePageRouter";
import { ChevronRight, Clock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PageContentData {
  id: string;
  slug: string;
  title: string;
  content: string;
  image: string;
}

export default function ProfilPage({ slug }: { slug: string }) {
  const { currentPage } = usePageRouter();
  const [data, setData] = useState<PageContentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch(`/api/page-content/slug/${slug}`);
        const result = await res.json();
        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch page content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Konten tidak ditemukan</p>
      </div>
    );
  }

  const isStruktur = slug === "struktur-organisasi";

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <a onClick={() => usePageRouter.getState().goHome()} className="hover:text-bkad-green cursor-pointer">
            Beranda
          </a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-400">Profil</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-bkad-green font-medium">{pageTitles[currentPage]}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-bkad-green/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-bkad-green" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {data.title}
                </h1>
              </div>

              {/* Organizational Structure Image */}
              {isStruktur && data.image && (
                <div className="mb-8 rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={data.image}
                    alt="Struktur Organisasi"
                    className="w-full object-contain bg-white"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-gray max-w-none">
                {data.content.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Halaman Profil</h3>
              <nav className="space-y-1">
                {[
                  { key: "profil-sejarah" as const, label: "Sejarah" },
                  { key: "profil-visi-misi" as const, label: "Visi & Misi" },
                  { key: "profil-tugas-fungsi" as const, label: "Tugas & Fungsi" },
                  { key: "profil-struktur" as const, label: "Struktur Organisasi" },
                  { key: "profil-pejabat" as const, label: "Pejabat" },
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

            <div className="bg-bkad-green/5 rounded-xl p-5 border border-bkad-green/10">
              <h3 className="font-bold text-gray-900 mb-2">Informasi</h3>
              <p className="text-sm text-gray-600">
                Untuk informasi lebih lanjut tentang BKAD Kabupaten Seruyan,
                silakan hubungi kami melalui halaman kontak.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
