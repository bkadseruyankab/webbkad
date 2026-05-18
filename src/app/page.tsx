"use client";

import { useState, useEffect, useCallback } from "react";
import SiteHeader from "@/components/bkad/SiteHeader";
import TopInfoBar from "@/components/bkad/TopInfoBar";
import HeroSection from "@/components/bkad/HeroSection";
import StatsSection from "@/components/bkad/StatsSection";
import NewsSection from "@/components/bkad/NewsSection";
import ServicesSection from "@/components/bkad/ServicesSection";
import InfografisSection from "@/components/bkad/InfografisSection";
import AgendaGaleriSection from "@/components/bkad/AgendaGaleriSection";
import SiteFooter from "@/components/bkad/SiteFooter";
import AdminPanel from "@/components/bkad/AdminPanel";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdminClose = useCallback(() => {
    setShowAdmin(false);
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Panel Overlay */}
      {showAdmin && <AdminPanel onClose={handleAdminClose} />}

      {/* Main Website */}
      <div style={{ display: showAdmin ? "none" : undefined }}>
        <TopInfoBar />
        <SiteHeader />
        <main className="flex-1">
          <HeroSection key={`hero-${refreshKey}`} />
          <StatsSection key={`stats-${refreshKey}`} />
          <NewsSection key={`news-${refreshKey}`} />
          <ServicesSection key={`services-${refreshKey}`} />
          <InfografisSection key={`infografis-${refreshKey}`} />
          <AgendaGaleriSection key={`agenda-${refreshKey}`} />
        </main>
        <SiteFooter />

        {/* Admin Toggle Button */}
        <Button
          onClick={() => setShowAdmin(true)}
          className="fixed bottom-6 right-6 z-50 bg-bkad-dark hover:bg-bkad-green text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all"
          size="icon"
          aria-label="Buka Panel Admin"
        >
          <Settings className="w-6 h-6 animate-spin hover:animate-none" style={{ animationDuration: "3s" }} />
        </Button>
      </div>
    </div>
  );
}
