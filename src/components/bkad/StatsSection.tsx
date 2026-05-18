"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, TrendingUp, FileCheck, Coins } from "lucide-react";

interface StatItem {
  icon: React.ElementType;
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  color: string;
}

const stats: StatItem[] = [
  {
    icon: TrendingUp,
    value: "1.25",
    prefix: "Rp ",
    suffix: " T",
    label: "Anggaran Daerah 2024",
    color: "text-emerald-600",
  },
  {
    icon: Building2,
    value: "2.450",
    label: "Aset Daerah Terdaftar",
    color: "text-amber-600",
  },
  {
    icon: FileCheck,
    value: "98.5",
    suffix: "%",
    label: "Realisasi Pendapatan",
    color: "text-teal-600",
  },
  {
    icon: Coins,
    value: "156",
    suffix: " M",
    prefix: "Rp ",
    label: "PAD Terealisasi",
    color: "text-orange-600",
  },
];

function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
}: {
  target: string;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numTarget = parseFloat(target.replace(/,/g, ""));
          const duration = 2000;
          const start = Date.now();

          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = numTarget * eased;

            if (target.includes(",")) {
              const decimalPlaces = target.split(",")[1]?.length || 0;
              setCount(current.toFixed(decimalPlaces).replace(".", ","));
            } else {
              setCount(Math.floor(current).toLocaleString("id-ID"));
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold">
      <span className="text-sm font-normal">{prefix}</span>
      {count}
      <span className="text-sm font-normal">{suffix}</span>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="relative -mt-16 z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-5 md:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                  stat.color === "text-emerald-600"
                    ? "bg-emerald-50"
                    : stat.color === "text-amber-600"
                    ? "bg-amber-50"
                    : stat.color === "text-teal-600"
                    ? "bg-teal-50"
                    : "bg-orange-50"
                }`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <AnimatedCounter
                target={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
