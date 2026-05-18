"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
} from "lucide-react";
import { usePageRouter } from "@/stores/usePageRouter";

interface DataPointApi {
  id: number;
  year: string;
  pendapatan: number;
  belanja: number;
  realisasi: number;
}

interface DataPoint {
  year: string;
  pendapatan: number;
  belanja: number;
  realisasi: number;
}

interface FinancialDataApiResponse {
  success: boolean;
  data: DataPointApi[];
}

const defaultFinancialData: DataPoint[] = [
  { year: "2020", pendapatan: 850, belanja: 820, realisasi: 94.2 },
  { year: "2021", pendapatan: 920, belanja: 890, realisasi: 95.8 },
  { year: "2022", pendapatan: 1050, belanja: 1010, realisasi: 96.5 },
  { year: "2023", pendapatan: 1150, belanja: 1100, realisasi: 97.2 },
  { year: "2024", pendapatan: 1250, belanja: 1190, realisasi: 98.5 },
];

const infographicCards = [
  {
    icon: BarChart3,
    title: "Realisasi APBD",
    value: "98,5%",
    description:
      "Tingkat realisasi APBD tahun 2024 menunjukkan peningkatan signifikan",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: TrendingUp,
    title: "Pertumbuhan PAD",
    value: "12,3%",
    description: "Pertumbuhan Pendapatan Asli Daerah dari tahun sebelumnya",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: PieChart,
    title: "Rasio Belanja",
    value: "45:55",
    description: "Rasio belanja operasi dan belanja modal yang sehat",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    icon: Activity,
    title: "Efisiensi Anggaran",
    value: "96,8%",
    description: "Tingkat efisiensi penggunaan anggaran belanja daerah",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
];

function SimpleBarChart({ data }: { data: DataPoint[] }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const maxPendapatan = Math.max(...data.map((d) => d.pendapatan));

  return (
    <div ref={ref} className="space-y-4">
      {/* Chart */}
      <div className="flex items-end justify-between gap-3 h-48 px-2">
        {data.map((item, index) => (
          <div
            key={item.year}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <div className="w-full flex gap-1 items-end h-40">
              <div
                className="flex-1 bg-bkad-green/80 rounded-t transition-all duration-1000 ease-out"
                style={{
                  height: isVisible
                    ? `${(item.pendapatan / maxPendapatan) * 100}%`
                    : "0%",
                  transitionDelay: `${index * 200}ms`,
                }}
              />
              <div
                className="flex-1 bg-bkad-gold/80 rounded-t transition-all duration-1000 ease-out"
                style={{
                  height: isVisible
                    ? `${(item.belanja / maxPendapatan) * 100}%`
                    : "0%",
                  transitionDelay: `${index * 200 + 100}ms`,
                }}
              />
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {item.year}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs">
        <span className="flex items-center">
          <span className="w-3 h-3 bg-bkad-green/80 rounded-sm mr-2" />
          Pendapatan (Miliar)
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-bkad-gold/80 rounded-sm mr-2" />
          Belanja (Miliar)
        </span>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 text-gray-500 font-medium">
                Tahun
              </th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">
                Pendapatan
              </th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">
                Belanja
              </th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">
                Realisasi
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.year} className="border-b border-gray-100">
                <td className="py-2 px-2 font-medium">{item.year}</td>
                <td className="text-right py-2 px-2">
                  Rp {item.pendapatan} M
                </td>
                <td className="text-right py-2 px-2">
                  Rp {item.belanja} M
                </td>
                <td className="text-right py-2 px-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.realisasi >= 95
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.realisasi}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function InfografisSection() {
  const [financialData, setFinancialData] = useState<DataPoint[]>(defaultFinancialData);
  const [loading, setLoading] = useState(true);
  const { navigate } = usePageRouter();

  useEffect(() => {
    async function fetchFinancialData() {
      try {
        const res = await fetch("/api/financial-data");
        const json: FinancialDataApiResponse = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const mapped: DataPoint[] = json.data.map((item) => ({
            year: item.year,
            pendapatan: item.pendapatan,
            belanja: item.belanja,
            realisasi: item.realisasi,
          }));
          setFinancialData(mapped);
        }
      } catch {
        // Keep default data on error
      } finally {
        setLoading(false);
      }
    }
    fetchFinancialData();
  }, []);

  return (
    <section
      id="infografis"
      className="py-16 bg-white relative overflow-hidden"
    >
      {/* Ornament */}
      <div className="absolute top-0 left-0 w-56 h-56 opacity-5 -translate-x-1/2 -translate-y-1/2">
        <svg viewBox="0 0 200 200" className="w-full h-full text-bkad-green">
          <circle cx="100" cy="100" r="80" fill="currentColor" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-left mb-12">
          <div className="inline-block bg-bkad-light text-bkad-green text-xs font-semibold px-3 py-1 rounded-full mb-3">
            INFOGRAFIS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Data Keuangan Daerah
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Visualisasi data dan informasi keuangan daerah Kabupaten Seruyan
            dalam format yang mudah dipahami
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              Tren Pendapatan & Belanja Daerah
            </h3>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="flex items-end justify-between gap-3 h-48 px-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex-1 flex gap-1 items-end h-40">
                      <div className="flex-1 bg-gray-200 rounded-t" style={{ height: `${Math.random() * 80 + 20}%` }} />
                      <div className="flex-1 bg-gray-200 rounded-t" style={{ height: `${Math.random() * 80 + 20}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <SimpleBarChart data={financialData} />
            )}
          </div>

          {/* Infographic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {infographicCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center mb-3`}
                >
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <p className="text-xs text-gray-400 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {card.value}
                </p>
                <p className="text-xs text-gray-500">{card.description}</p>
              </div>
            ))}

            {/* Featured Infographic Image */}
            <div
              className="sm:col-span-2 rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group"
              onClick={() => navigate("media-infografis")}
            >
              <div className="relative h-48">
                <img
                  src="/images/infografis-1.png"
                  alt="Infografis Keuangan Daerah"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bkad-dark/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold text-sm">
                    Infografis Laporan Keuangan 2024
                  </p>
                  <p className="text-white/70 text-xs">
                    Klik untuk melihat detail
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
