"use client";

import { useState, useEffect } from "react";
import {
  Landmark,
  Calculator,
  FileSpreadsheet,
  Building,
  Receipt,
  ClipboardList,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceItemApi {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  order: number;
  active: boolean;
}

interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface ServicesApiResponse {
  success: boolean;
  data: ServiceItemApi[];
}

const iconMap: Record<string, LucideIcon> = {
  Landmark,
  Receipt,
  Building,
  Calculator,
  FileSpreadsheet,
  ClipboardList,
};

export default function ServicesSection() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        const json: ServicesApiResponse = await res.json();
        if (json.success && json.data) {
          const activeItems = json.data
            .filter((item) => item.active)
            .sort((a, b) => a.order - b.order)
            .map((item) => ({
              icon: iconMap[item.icon] || Landmark,
              title: item.title,
              description: item.description,
              color: item.color,
              bgColor: item.bgColor,
            }));
          if (activeItems.length > 0) {
            setServices(activeItems);
          }
        }
      } catch {
        // Keep empty state on error
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <section
      id="layanan"
      className="py-16 bg-gradient-to-b from-bkad-light to-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <pattern
            id="services-pattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="currentColor" />
          </pattern>
          <rect
            width="100%"
            height="100%"
            fill="url(#services-pattern)"
            className="text-bkad-green"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-left mb-12">
          <div className="inline-block bg-bkad-green/10 text-bkad-green text-xs font-semibold px-3 py-1 rounded-full mb-3">
            LAYANAN
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Layanan Publik
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Berbagai layanan yang disediakan oleh BKAD Kabupaten Seruyan untuk
            masyarakat dalam pengelolaan keuangan dan aset daerah
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="w-14 h-14 rounded-xl bg-gray-200 mb-4" />
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >
                <div
                  className={`w-14 h-14 rounded-xl ${service.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className={`w-7 h-7 ${service.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center text-bkad-green text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Selengkapnya
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center mt-10">
          <Button
            variant="outline"
            className="border-bkad-green text-bkad-green hover:bg-bkad-green hover:text-white font-medium px-8 py-3 rounded-lg"
          >
            Semua Layanan
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
