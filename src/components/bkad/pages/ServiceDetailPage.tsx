"use client";

import { useState, useEffect } from "react";
import { usePageRouter } from "@/stores/usePageRouter";
import { ChevronRight, ArrowLeft, Landmark, Receipt, Building, Calculator, FileSpreadsheet, ClipboardList, TrendingUp, FileCheck, Coins, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveFileUrl } from "@/lib/utils";

interface ServiceData {
  id: string;
  icon: string;
  title: string;
  description: string;
  content: string;
  color: string;
  bgColor: string;
  images: string;
  order: number;
  active: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  Landmark,
  Receipt,
  Building,
  Calculator,
  FileSpreadsheet,
  ClipboardList,
  TrendingUp,
  FileCheck,
  Coins,
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

export default function ServiceDetailPage({ id }: { id: string }) {
  const { goHome } = usePageRouter();
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedServices, setRelatedServices] = useState<ServiceData[]>([]);

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`/api/services/${id}`);
        const result = await res.json();
        if (result.success && result.data) {
          setService(result.data);
          // Fetch other services
          const allRes = await fetch(`/api/services`);
          const allResult = await allRes.json();
          if (allResult.success && allResult.data) {
            const filtered = allResult.data
              .filter((s: ServiceData) => s.id !== id && s.active)
              .sort((a: ServiceData, b: ServiceData) => a.order - b.order)
              .slice(0, 4);
            setRelatedServices(filtered);
          }
        }
      } catch (err) {
        console.error("Failed to fetch service:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Layanan tidak ditemukan</p>
        <Button onClick={goHome} variant="outline" className="border-bkad-green text-bkad-green">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  const IconComponent = iconMap[service.icon] || Landmark;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a onClick={goHome} className="hover:text-bkad-green cursor-pointer">Beranda</a>
          <ChevronRight className="w-4 h-4" />
          <a onClick={() => usePageRouter.getState().navigate("layanan")} className="hover:text-bkad-green cursor-pointer">Layanan</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-bkad-green font-medium">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              {/* Icon + Title */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-xl ${service.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className={`w-8 h-8 ${service.color}`} />
                </div>
                <div>
                  <Badge className="bg-bkad-light text-bkad-green text-xs mb-1">Layanan Publik</Badge>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{service.title}</h1>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-700 leading-relaxed font-medium">{service.description}</p>
              </div>

              {/* Full Content */}
              {service.content ? (
                <div className="prose prose-gray max-w-none">
                  {service.content.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">{service.description}</p>
                  <p className="text-gray-500 italic mt-4">Informasi detail layanan akan segera tersedia.</p>
                </div>
              )}

              {/* Image Gallery */}
              {(() => {
                const images = parseImages(service.images);
                if (images.length === 0) return null;
                return (
                  <div className="mt-6">
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

              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="bg-bkad-green/5 rounded-xl p-6 border border-bkad-green/10">
                  <h3 className="font-bold text-gray-900 mb-2">Butuh Bantuan?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Hubungi kami untuk informasi lebih lanjut tentang layanan {service.title.toLowerCase()}.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => usePageRouter.getState().navigate("kontak")}
                      className="bg-bkad-green hover:bg-bkad-dark text-white"
                    >
                      Hubungi Kami
                    </Button>
                    <Button
                      onClick={() => usePageRouter.getState().navigate("laporan")}
                      variant="outline"
                      className="border-bkad-green text-bkad-green hover:bg-bkad-green hover:text-white"
                    >
                      Buat Laporan
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-6">
              <Button
                onClick={() => usePageRouter.getState().navigate("layanan")}
                variant="outline"
                className="border-bkad-green text-bkad-green hover:bg-bkad-green hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Layanan
              </Button>
            </div>
          </div>

          {/* Sidebar - Other Services */}
          <aside className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Layanan Lainnya</h3>
              <div className="space-y-3">
                {relatedServices.map((item) => {
                  const ItemIcon = iconMap[item.icon] || Landmark;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors"
                      onClick={() => usePageRouter.getState().navigateToDetail("service-detail", item.id)}
                    >
                      <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <ItemIcon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-bkad-green transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
