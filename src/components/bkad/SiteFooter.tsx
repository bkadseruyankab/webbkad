"use client";

import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

const quickLinks = [
  { label: "Kementerian Dalam Negeri", url: "https://kemendagri.go.id" },
  { label: "Pemerintah Kabupaten Seruyan", url: "#" },
  { label: "DPRD Kabupaten Seruyan", url: "#" },
  { label: "BPK Perwakilan Kalteng", url: "#" },
  { label: "DJPK Kemenkeu", url: "#" },
  { label: "SIPD Kabupaten Seruyan", url: "#" },
];

const layananLinks = [
  { label: "Pengelolaan APBD", url: "#" },
  { label: "Pengelolaan PAD", url: "#" },
  { label: "Pengelolaan Aset", url: "#" },
  { label: "PBB P2", url: "#" },
  { label: "Laporan Keuangan", url: "#" },
  { label: "Perencanaan Anggaran", url: "#" },
];

export default function SiteFooter() {
  return (
    <footer
      id="kontak"
      className="bg-bkad-dark text-white relative"
    >
      {/* Top Wave */}
      <div className="absolute -top-1 left-0 right-0 overflow-hidden">
        <svg viewBox="0 0 1440 60" className="w-full h-8 md:h-12 fill-gray-50">
          <path d="M0,0 C360,60 1080,0 1440,40 L1440,0 L0,0 Z" />
        </svg>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-bkad-green rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">BK</span>
              </div>
              <div>
                <h3 className="font-bold text-sm">BKAD</h3>
                <p className="text-xs text-white/60">Kabupaten Seruyan</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Badan Keuangan dan Aset Daerah Kabupaten Seruyan, Kalimantan
              Tengah. Mewujudkan pengelolaan keuangan daerah yang transparan,
              akuntabel, dan berorientasi pada pelayanan publik.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-bkad-green flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-bkad-green flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-bkad-green flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="font-bold text-base mb-4">Layanan</h3>
            <ul className="space-y-2">
              {layananLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-white/70 text-sm hover:text-bkad-gold transition-colors inline-flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-bkad-green/50 mr-2 group-hover:bg-bkad-gold transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tautan */}
          <div>
            <h3 className="font-bold text-base mb-4">Tautan Penting</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-white/70 text-sm hover:text-bkad-gold transition-colors inline-flex items-center group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3 h-3 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="font-bold text-base mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-bkad-gold flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  Jl. Trans Kalimantan, Kuala Pembuang, Kab. Seruyan, Kalimantan
                  Tengah 74211
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-bkad-gold flex-shrink-0" />
                <span className="text-white/70 text-sm">
                  (0532) 882123
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-bkad-gold flex-shrink-0" />
                <span className="text-white/70 text-sm">
                  bkad@seruyankab.go.id
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-bkad-gold flex-shrink-0" />
                <span className="text-white/70 text-sm">
                  Senin - Jumat, 08:00 - 16:00 WIB
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-xs text-center md:text-left">
              © {new Date().getFullYear()} Badan Keuangan dan Aset Daerah
              Kabupaten Seruyan. Hak Cipta Dilindungi Undang-Undang.
            </p>
            <div className="flex items-center gap-4 text-xs text-white/50">
              <a href="#" className="hover:text-bkad-gold transition-colors">
                Kebijakan Privasi
              </a>
              <span>|</span>
              <a href="#" className="hover:text-bkad-gold transition-colors">
                Syarat & Ketentuan
              </a>
              <span>|</span>
              <a href="#" className="hover:text-bkad-gold transition-colors">
                Peta Situs
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
