"use client";

import { Phone, Mail, Clock, ChevronRight } from "lucide-react";
import { useAppIdentity, parseLinks } from "@/hooks/useAppIdentity";

export default function TopInfoBar() {
  const { resolved } = useAppIdentity();
  const links = parseLinks(resolved.topLinks);

  return (
    <div
      className="bg-bkad-dark text-white/80 text-xs"
      style={{ backgroundColor: resolved.darkColor }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between py-1.5 gap-1">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {resolved.phone}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {resolved.email}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {resolved.workHours}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {links.map((link, idx) => (
              <span key={idx} className="flex items-center gap-2">
                {idx > 0 && <span className="text-white/30">|</span>}
                <a
                  href={link.url || "#"}
                  className="hover:text-bkad-gold transition-colors flex items-center gap-0.5"
                >
                  {link.label}
                  <ChevronRight className="w-3 h-3" />
                </a>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
