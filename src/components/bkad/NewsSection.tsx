"use client";

import { Calendar, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Seruyan Raih Opini WTP untuk Laporan Keuangan Tahun 2024",
    excerpt:
      "Kabupaten Seruyan kembali meraih opini Wajar Tanpa Pengecualian (WTP) atas Laporan Keuangan Pemerintah Daerah tahun 2024. Pencapaian ini menunjukkan komitmen dalam pengelolaan keuangan yang transparan.",
    date: "15 Januari 2025",
    category: "Keuangan",
    image: "/images/news-1.png",
    readTime: "5 menit",
  },
  {
    id: 2,
    title: "BKAD Seruyan Luncurkan Sistem E-Budgeting Terpadu",
    excerpt:
      "Badan Keuangan dan Aset Daerah meluncurkan sistem e-budgeting terpadu untuk meningkatkan efisiensi dan transparansi dalam proses perencanaan anggaran daerah.",
    date: "10 Januari 2025",
    category: "Teknologi",
    image: "/images/news-2.png",
    readTime: "4 menit",
  },
  {
    id: 3,
    title: "Sosialisasi PBB P2 di Kecamatan Seruyan Hilir",
    excerpt:
      "Tim BKAD melaksanakan sosialisasi Pajak Bumi dan Bangunan Perkotaan dan Perdesaan (PBB P2) di Kecamatan Seruyan Hilir untuk meningkatkan kesadaran masyarakat.",
    date: "8 Januari 2025",
    category: "Pajak",
    image: "/images/news-3.png",
    readTime: "3 menit",
  },
  {
    id: 4,
    title: "Inventarisasi Aset Daerah Tahap II Tahun 2025 Dimulai",
    excerpt:
      "BKAD Seruyan memulai tahap kedua inventarisasi aset daerah yang mencakup seluruh aset tetap dan aset lainnya di lingkungan Pemerintah Kabupaten Seruyan.",
    date: "5 Januari 2025",
    category: "Aset",
    image: "/images/news-4.png",
    readTime: "4 menit",
  },
  {
    id: 5,
    title: "Rapat Koordinasi APBD 2025 bersama DPRD Seruyan",
    excerpt:
      "Rapat koordinasi penyusunan APBD tahun 2025 telah dilaksanakan dengan membahas prioritas pembangunan dan alokasi anggaran yang tepat sasaran.",
    date: "3 Januari 2025",
    category: "Anggaran",
    image: "/images/news-5.png",
    readTime: "3 menit",
  },
  {
    id: 6,
    title: "Festival Budaya Seruyan Dukung PAD Daerah",
    excerpt:
      "Pemerintah Kabupaten Seruyan menggelar Festival Budaya yang diharapkan mampu meningkatkan Pendapatan Asli Daerah melalui sektor pariwisata.",
    date: "28 Desember 2024",
    category: "PAD",
    image: "/images/news-6.png",
    readTime: "5 menit",
  },
];

const categoryColors: Record<string, string> = {
  Keuangan: "bg-emerald-100 text-emerald-700",
  Teknologi: "bg-sky-100 text-sky-700",
  Pajak: "bg-amber-100 text-amber-700",
  Aset: "bg-violet-100 text-violet-700",
  Anggaran: "bg-rose-100 text-rose-700",
  PAD: "bg-orange-100 text-orange-700",
};

export default function NewsSection() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
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
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button className="bg-bkad-green hover:bg-bkad-dark text-white font-medium px-8 py-3 rounded-lg">
            Lihat Semua Berita
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
