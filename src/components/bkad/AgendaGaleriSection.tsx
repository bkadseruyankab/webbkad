"use client";

import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface AgendaItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "ongoing" | "completed";
}

const agendaItems: AgendaItem[] = [
  {
    id: 1,
    title: "Rapat Koordinasi Penyusunan APBD Perubahan 2025",
    date: "20 Februari 2025",
    time: "09:00 - 12:00 WIB",
    location: "Ruang Rapat Utama BKAD",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Sosialisasi Permendagri No. 70 Tahun 2024",
    date: "25 Februari 2025",
    time: "08:00 - 16:00 WIB",
    location: "Aula Kantor Bupati",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Workshop Sistem Informasi Aset Daerah",
    date: "5 Maret 2025",
    time: "09:00 - 15:00 WIB",
    location: "Ruang Pelatihan BKAD",
    status: "upcoming",
  },
  {
    id: 4,
    title: "Audit Kinerja oleh BPK Perwakilan Kalimantan Tengah",
    date: "10 Maret 2025",
    time: "08:00 - 17:00 WIB",
    location: "Kantor BKAD Seruyan",
    status: "upcoming",
  },
];

const galleryItems = [
  { id: 1, image: "/images/hero-1.png", caption: "Kantor BKAD Kabupaten Seruyan" },
  { id: 2, image: "/images/layanan.png", caption: "Pelayanan Publik BKAD" },
  { id: 3, image: "/images/news-5.png", caption: "Rapat Koordinasi APBD 2025" },
  { id: 4, image: "/images/news-6.png", caption: "Festival Budaya Seruyan" },
];

const statusConfig = {
  upcoming: { label: "Akan Datang", class: "bg-sky-100 text-sky-700" },
  ongoing: { label: "Berlangsung", class: "bg-emerald-100 text-emerald-700" },
  completed: { label: "Selesai", class: "bg-gray-100 text-gray-600" },
};

export default function AgendaGaleriSection() {
  return (
    <section className="py-16 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-left mb-12">
          <div className="inline-block bg-bkad-green/10 text-bkad-green text-xs font-semibold px-3 py-1 rounded-full mb-3">
            AGENDA & GALERI
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Agenda & Galeri Kegiatan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Jadwal kegiatan dan dokumentasi pelaksanaan program BKAD Kabupaten
            Seruyan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agenda */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-bkad-green" />
              Agenda Kegiatan
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {agendaItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-bkad-green text-white rounded-lg w-12 h-12 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium">
                        {item.date.split(" ")[0]}
                      </span>
                      <span className="text-[10px] leading-tight">
                        {item.date.split(" ")[1]?.substring(0, 3)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={`text-[10px] ${
                            statusConfig[item.status].class
                          }`}
                        >
                          {statusConfig[item.status].label}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                        {item.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.time}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {item.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="border-bkad-green text-bkad-green hover:bg-bkad-green hover:text-white"
              >
                Lihat Semua Agenda
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Galeri */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
              <Image
                src="/images/infografis-1.png"
                alt=""
                width={20}
                height={20}
                className="hidden"
              />
              <svg
                className="w-5 h-5 mr-2 text-bkad-green"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              Galeri Kegiatan
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="relative rounded-xl overflow-hidden group cursor-pointer"
                  style={{ aspectRatio: "4/3" }}
                >
                  <Image
                    src={item.image}
                    alt={item.caption}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-medium">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="border-bkad-green text-bkad-green hover:bg-bkad-green hover:text-white"
              >
                Lihat Semua Galeri
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
