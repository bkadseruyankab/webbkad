"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, TrendingUp, FileCheck, Coins, type LucideIcon } from "lucide-react";

interface StatItemApi {
  id: number;
  icon: string;
  value: string;
  prefix?: string;
  suffix?: string;
  label: string;
  color: string;
  order: number;
  active: boolean;
}

interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  color: string;
}

interface StatsApiResponse {
  success: boolean;
  data: StatItemApi[];
}

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Building2,
  FileCheck,
  Coins,
};

const colorBgMap: Record<string, string> = {
  "text-emerald-600": "bg-emerald-50",
  "text-amber-600": "bg-amber-50",
  "text-teal-600": "bg-teal-50",
  "text-orange-600": "bg-orange-50",
};

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
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        const json: StatsApiResponse = await res.json();
        if (json.success && json.data) {
          const activeItems = json.data
            .filter((item) => item.active)
            .sort((a, b) => a.order - b.order)
            .map((item) => ({
              icon: iconMap[item.icon] || TrendingUp,
              value: item.value,
              label: item.label,
              prefix: item.prefix,
              suffix: item.suffix,
              color: item.color,
            }));
          if (activeItems.length > 0) {
            setStats(activeItems);
          }
        }
      } catch {
        // Keep empty state on error
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="relative -mt-16 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-5 md:p-6 border border-gray-100 animate-pulse"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-200 mb-3" />
                <div className="h-8 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
                  colorBgMap[stat.color] || "bg-gray-50"
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
