"use client";

import {
  Landmark,
  Calculator,
  FileSpreadsheet,
  Building,
  Receipt,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceItem {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const services: ServiceItem[] = [
  {
    icon: Landmark,
    title: "Pengelolaan APBD",
    description:
      "Perencanaan, pelaksanaan, dan pertanggungjawaban Anggaran Pendapatan dan Belanja Daerah Kabupaten Seruyan.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: Receipt,
    title: "Pengelolaan PAD",
    description:
      "Optimalisasi Pendapatan Asli Daerah melalui berbagai sumber pendapatan pajak dan retribusi.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: Building,
    title: "Pengelolaan Aset",
    description:
      "Inventarisasi, penilaian, dan pengelolaan aset milik daerah secara optimal dan akuntabel.",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    icon: Calculator,
    title: "PBB P2",
    description:
      "Pengelolaan Pajak Bumi dan Bangunan Perkotaan dan Perdesaan untuk pendapatan daerah.",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    icon: FileSpreadsheet,
    title: "Laporan Keuangan",
    description:
      "Penyusunan laporan keuangan daerah yang transparan dan akuntabel sesuai standar SAP.",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
  {
    icon: ClipboardList,
    title: "Perencanaan Anggaran",
    description:
      "Penyusunan rencana anggaran daerah yang terukur dan berorientasi pada hasil pembangunan.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

export default function ServicesSection() {
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
