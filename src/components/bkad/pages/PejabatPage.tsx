"use client";

import { useState, useEffect } from "react";
import { usePageRouter, pageTitles } from "@/stores/usePageRouter";
import { ChevronRight, User, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { resolveFileUrl } from "@/lib/utils";

interface Official {
  id: string;
  name: string;
  position: string;
  photo: string;
  nip: string;
  order: number;
}

export default function PejabatPage() {
  const { currentPage } = usePageRouter();
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/officials");
        const result = await res.json();
        if (result.success) setOfficials(result.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <a onClick={() => usePageRouter.getState().goHome()} className="hover:text-bkad-green cursor-pointer">Beranda</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-400">Profil</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-bkad-green font-medium">{pageTitles[currentPage]}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Pejabat BKAD</h1>
              <p className="text-gray-600">Pejabat struktural di lingkungan Badan Keuangan dan Aset Daerah Kabupaten Seruyan</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {officials.map((official) => (
                  <div
                    key={official.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-bkad-light">
                        <img
                          src={resolveFileUrl(official.photo)}
                          alt={official.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{official.name}</h3>
                        <Badge className="bg-bkad-light text-bkad-green text-xs mt-1">
                          {official.position}
                        </Badge>
                        {official.nip && (
                          <p className="text-xs text-gray-400 mt-1">NIP: {official.nip}</p>
                        )}
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
          </aside>
        </div>
      </div>
    </div>
  );
}
