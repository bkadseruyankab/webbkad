"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveFileUrl } from "@/lib/utils";

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  order: number;
  active: boolean;
}

interface HeroApiResponse {
  success: boolean;
  data: HeroSlide[];
}

const defaultSlide: HeroSlide = {
  id: 0,
  title: "Mewujudkan Tata Kelola Keuangan Daerah yang Transparan",
  subtitle:
    "BKAD Kabupaten Seruyan berkomitmen mengelola keuangan dan aset daerah secara profesional, akuntabel, dan transparan untuk kemakmuran masyarakat.",
  image: "/images/hero-1.png",
  order: 0,
  active: true,
};

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([defaultSlide]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const res = await fetch("/api/hero-slides");
        const json: HeroApiResponse = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const activeSlides = json.data
            .filter((s) => s.active)
            .sort((a, b) => a.order - b.order);
          if (activeSlides.length > 0) {
            setSlides(activeSlides);
          }
        }
      } catch {
        // Keep default slide on error
      } finally {
        setLoading(false);
      }
    }
    fetchSlides();
  }, []);

  const nextSlide = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setIsAnimating(true);
    }, 100);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
      setIsAnimating(true);
    }, 100);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section id="beranda" className="relative w-full overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: "21/9" }}>
        {/* Background Image */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            isAnimating ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={resolveFileUrl(slides[current].image)}
            alt={slides[current].title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-bkad-dark/80 via-bkad-dark/50 to-transparent" />
        </div>

        {/* Content */}
        <div
          className={`absolute inset-0 flex items-center transition-all duration-700 ${
            isAnimating
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <span className="inline-block bg-bkad-gold text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                BKAD KABUPATEN SERUYAN
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {slides[current].title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 leading-relaxed">
                {slides[current].subtitle}
              </p>

            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 md:w-12 md:h-12"
          aria-label="Slide sebelumnya"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 md:w-12 md:h-12"
          aria-label="Slide berikutnya"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(false);
                setTimeout(() => {
                  setCurrent(index);
                  setIsAnimating(true);
                }, 100);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current
                  ? "bg-bkad-gold w-8"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
