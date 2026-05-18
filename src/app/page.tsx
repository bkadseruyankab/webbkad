"use client";

import SiteHeader from "@/components/bkad/SiteHeader";
import TopInfoBar from "@/components/bkad/TopInfoBar";
import HeroSection from "@/components/bkad/HeroSection";
import StatsSection from "@/components/bkad/StatsSection";
import NewsSection from "@/components/bkad/NewsSection";
import ServicesSection from "@/components/bkad/ServicesSection";
import InfografisSection from "@/components/bkad/InfografisSection";
import AgendaGaleriSection from "@/components/bkad/AgendaGaleriSection";
import SiteFooter from "@/components/bkad/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopInfoBar />
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <NewsSection />
        <ServicesSection />
        <InfografisSection />
        <AgendaGaleriSection />
      </main>
      <SiteFooter />
    </div>
  );
}
