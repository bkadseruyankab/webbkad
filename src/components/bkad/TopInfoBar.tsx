"use client";

import { Phone, Mail, Clock, ChevronRight } from "lucide-react";

export default function TopInfoBar() {
  return (
    <div className="bg-bkad-dark text-white/80 text-xs">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between py-1.5 gap-1">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              (0532) 882123
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              bkad@seruyankab.go.id
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Senin - Jumat, 08:00 - 16:00 WIB
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="hover:text-bkad-gold transition-colors flex items-center gap-0.5"
            >
              PPID
              <ChevronRight className="w-3 h-3" />
            </a>
            <span className="text-white/30">|</span>
            <a
              href="#"
              className="hover:text-bkad-gold transition-colors flex items-center gap-0.5"
            >
              SIPD
              <ChevronRight className="w-3 h-3" />
            </a>
            <span className="text-white/30">|</span>
            <a
              href="#"
              className="hover:text-bkad-gold transition-colors flex items-center gap-0.5"
            >
              Lapor!
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
