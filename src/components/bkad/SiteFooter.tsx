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
import { useAppIdentity, parseLinks } from "@/hooks/useAppIdentity";
import { resolveFileUrl } from "@/lib/utils";

export default function SiteFooter() {
  const { resolved } = useAppIdentity();

  const quickLinks = parseLinks(resolved.quickLinks);
  const layananLinks = parseLinks(resolved.layananLinks);

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
              {resolveFileUrl(resolved.logoUrl) ? (
                <img
                  src={resolveFileUrl(resolved.logoUrl)!}
                  alt={resolved.appShortName || 'Logo'}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2"
                  style={{ borderColor: resolved.primaryColor }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: resolved.primaryColor }}>
                  <span className="text-white font-bold text-sm">{resolved.logoText}</span>
                </div>
              )}
              <div>
                <h3 className="font-bold text-sm">{resolved.appShortName}</h3>
                <p className="text-xs text-white/60">{resolved.appSubtitle}</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              {resolved.footerDescription}
            </p>
            <div className="flex space-x-3">
              {resolved.facebookUrl && (
                <a
                  href={resolved.facebookUrl}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-bkad-green flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {resolved.instagramUrl && (
                <a
                  href={resolved.instagramUrl}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-bkad-green flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {resolved.youtubeUrl && (
                <a
                  href={resolved.youtubeUrl}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-bkad-green flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
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
                  {resolved.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-bkad-gold flex-shrink-0" />
                <span className="text-white/70 text-sm">
                  {resolved.phone}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-bkad-gold flex-shrink-0" />
                <span className="text-white/70 text-sm">
                  {resolved.email}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-bkad-gold flex-shrink-0" />
                <span className="text-white/70 text-sm">
                  {resolved.workHours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-xs text-center md:text-left">
              © {new Date().getFullYear()} {resolved.copyrightText}. Hak Cipta Dilindungi Undang-Undang.
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
