"use client";

import { useState, useEffect, useMemo } from "react";
import { usePageRouter, pageTitles } from "@/stores/usePageRouter";
import {
  ChevronRight,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

interface LaporanItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface FinancialDataItem {
  id: string;
  year: string;
  pendapatan: number;
  belanja: number;
  realisasi: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const categoryLabels: Record<string, string> = {
  umum: "Umum",
  keuangan: "Keuangan Daerah",
  aset: "Aset Daerah",
  pajak: "Pajak & Retribusi",
  anggaran: "Anggaran",
  pelayanan: "Pelayanan Publik",
  pengaduan: "Pengaduan",
};

const statusConfig: Record<
  string,
  { label: string; badgeClass: string; icon: React.ElementType }
> = {
  baru: {
    label: "Baru",
    badgeClass: "bg-sky-100 text-sky-700 border-sky-200",
    icon: AlertCircle,
  },
  diproses: {
    label: "Diproses",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  selesai: {
    label: "Selesai",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
};

const PIE_COLORS = ["#0ea5e9", "#f59e0b", "#10b981"];

const BAR_COLORS = [
  "#0D6B3F",
  "#0ea5e9",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#C5960C",
];

// ─── Custom Tooltip Components ───────────────────────────────────────────────

function CategoryTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3 text-sm">
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-bkad-green font-semibold">
        {payload[0].value} laporan
      </p>
    </div>
  );
}

function StatusTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3 text-sm">
      <p className="font-medium text-gray-900">{data.name}</p>
      <p className="font-semibold" style={{ color: data.payload.fill }}>
        {data.value} laporan
      </p>
    </div>
  );
}

function FinancialTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3 text-sm">
      <p className="font-medium text-gray-900 mb-1">Tahun {label}</p>
      {payload.map((entry: any, idx: number) => (
        <p key={idx} className="font-semibold" style={{ color: entry.color }}>
          {entry.name}: Rp {(entry.value / 1_000_000_000).toFixed(2)} M
        </p>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LaporanDashboardPage() {
  const { currentPage } = usePageRouter();
  const navigate = usePageRouter.getState().navigate;
  const goHome = usePageRouter.getState().goHome;

  const [laporanData, setLaporanData] = useState<LaporanItem[]>([]);
  const [financialData, setFinancialData] = useState<FinancialDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [financialLoading, setFinancialLoading] = useState(true);

  // ─── Data Fetching ───────────────────────────────────────────────────────

  useEffect(() => {
    async function fetchLaporan() {
      try {
        const res = await fetch("/api/laporan?all=true");
        const result = await res.json();
        if (result.success) setLaporanData(result.data || []);
      } catch (err) {
        console.error("Error fetching laporan:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLaporan();
  }, []);

  useEffect(() => {
    async function fetchFinancial() {
      try {
        const res = await fetch("/api/financial-data");
        const result = await res.json();
        if (result.success) setFinancialData(result.data || []);
      } catch (err) {
        console.error("Error fetching financial data:", err);
      } finally {
        setFinancialLoading(false);
      }
    }
    fetchFinancial();
  }, []);

  // ─── Derived Data ────────────────────────────────────────────────────────

  const totalLaporan = laporanData.length;
  const laporanBaru = laporanData.filter((l) => l.status === "baru").length;
  const laporanDiproses = laporanData.filter((l) => l.status === "diproses").length;
  const laporanSelesai = laporanData.filter((l) => l.status === "selesai").length;

  // Bar chart: count by category
  const categoryChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    laporanData.forEach((item) => {
      const key = item.category || "umum";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([key, count]) => ({
        category: categoryLabels[key] || key,
        jumlah: count,
      }))
      .sort((a, b) => b.jumlah - a.jumlah);
  }, [laporanData]);

  // Pie chart: distribution by status
  const statusChartData = useMemo(() => {
    const statusOrder = ["baru", "diproses", "selesai"];
    return statusOrder
      .map((status) => ({
        name: statusConfig[status]?.label || status,
        value: laporanData.filter((l) => l.status === status).length,
        status,
      }))
      .filter((d) => d.value > 0);
  }, [laporanData]);

  // Recent laporan (top 10)
  const recentLaporan = useMemo(() => {
    return [...laporanData]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10);
  }, [laporanData]);

  // Financial chart data
  const financialChartData = useMemo(() => {
    return [...financialData]
      .sort((a, b) => a.year.localeCompare(b.year))
      .map((item) => ({
        year: item.year,
        Pendapatan: item.pendapatan,
        Belanja: item.belanja,
        Realisasi: Math.round(item.realisasi * item.pendapatan) / 100,
      }));
  }, [financialData]);

  // ─── Formatting helpers ──────────────────────────────────────────────────

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // ─── Summary Cards Config ────────────────────────────────────────────────

  const summaryCards = [
    {
      title: "Total Laporan",
      value: totalLaporan,
      icon: FileText,
      iconBg: "bg-bkad-green/10",
      iconColor: "text-bkad-green",
      borderColor: "border-bkad-green/20",
    },
    {
      title: "Laporan Baru",
      value: laporanBaru,
      icon: AlertCircle,
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
      borderColor: "border-sky-200",
    },
    {
      title: "Sedang Diproses",
      value: laporanDiproses,
      icon: Clock,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
    },
    {
      title: "Selesai",
      value: laporanSelesai,
      icon: CheckCircle2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
    },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a
            onClick={goHome}
            className="hover:text-bkad-green cursor-pointer transition-colors"
          >
            Beranda
          </a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-bkad-green font-medium">
            {pageTitles[currentPage]}
          </span>
        </nav>

        {/* ── Page Header ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Dashboard Laporan
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Ringkasan dan analisis laporan masyarakat BKAD Kabupaten Seruyan
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("laporan")}
            className="border-bkad-green/30 text-bkad-green hover:bg-bkad-light"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Laporan
          </Button>
        </div>

        {/* ── Section 1: Summary Statistics Cards ────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.title}
                className={`border ${card.borderColor} shadow-sm hover:shadow-md transition-shadow`}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {card.title}
                      </p>
                      {loading ? (
                        <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
                      ) : (
                        <p className="text-3xl font-bold text-gray-900">
                          {card.value}
                        </p>
                      )}
                    </div>
                    <div
                      className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ── Section 2: Charts ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
          {/* Bar Chart - Laporan by Category */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-bkad-green" />
                Laporan per Kategori
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-2">
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-pulse space-y-3 w-full">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                        <div className="h-6 bg-gray-200 rounded flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : categoryChartData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <p>Belum ada data laporan</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={categoryChartData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 11 }}
                      angle={-20}
                      textAnchor="end"
                      height={70}
                      interval={0}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12 }}
                      width={35}
                    />
                    <Tooltip content={<CategoryTooltip />} />
                    <Bar
                      dataKey="jumlah"
                      fill="#0D6B3F"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={50}
                    >
                      {categoryChartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            BAR_COLORS[index % BAR_COLORS.length]
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Pie Chart - Distribution by Status */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-bkad-green" />
                Distribusi Status Laporan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-2">
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-gray-100 animate-pulse" />
                </div>
              ) : statusChartData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <p>Belum ada data laporan</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        labelLine={{ strokeDasharray: "3 3" }}
                      >
                        {statusChartData.map((entry, index) => {
                          const colorIndex =
                            entry.status === "baru"
                              ? 0
                              : entry.status === "diproses"
                              ? 1
                              : 2;
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={PIE_COLORS[colorIndex]}
                              stroke="white"
                              strokeWidth={2}
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip content={<StatusTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                    {statusChartData.map((entry, index) => {
                      const colorIndex =
                        entry.status === "baru"
                          ? 0
                          : entry.status === "diproses"
                          ? 1
                          : 2;
                      return (
                        <div
                          key={entry.status}
                          className="flex items-center gap-1.5 text-sm text-gray-600"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: PIE_COLORS[colorIndex],
                            }}
                          />
                          <span>
                            {entry.name} ({entry.value})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Section 3: Recent Laporan Table ────────────────────────────── */}
        <Card className="shadow-sm mb-8">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-bkad-green" />
                Laporan Terbaru
              </CardTitle>
              {!loading && laporanData.length > 10 && (
                <span className="text-xs text-gray-400">
                  Menampilkan 10 terbaru dari {totalLaporan} laporan
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-2">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center gap-4 p-3"
                  >
                    <div className="h-4 w-8 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded flex-1" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : recentLaporan.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Belum ada laporan yang masuk</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-3 text-gray-500 font-medium w-12">
                        No
                      </th>
                      <th className="text-left py-3 px-3 text-gray-500 font-medium">
                        Nama
                      </th>
                      <th className="text-left py-3 px-3 text-gray-500 font-medium">
                        Subjek
                      </th>
                      <th className="text-left py-3 px-3 text-gray-500 font-medium hidden md:table-cell">
                        Kategori
                      </th>
                      <th className="text-left py-3 px-3 text-gray-500 font-medium">
                        Status
                      </th>
                      <th className="text-left py-3 px-3 text-gray-500 font-medium hidden sm:table-cell">
                        Tanggal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLaporan.map((item, idx) => {
                      const config = statusConfig[item.status] || statusConfig.baru;
                      const StatusIcon = config.icon;
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-3 px-3 text-gray-400">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3 font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="py-3 px-3 text-gray-700 max-w-[200px] truncate">
                            {item.subject}
                          </td>
                          <td className="py-3 px-3 text-gray-600 hidden md:table-cell">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                              {categoryLabels[item.category] || item.category}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <Badge
                              variant="outline"
                              className={`text-xs ${config.badgeClass}`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-gray-500 text-xs hidden sm:table-cell">
                            {formatDate(item.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Section 4: Financial Data ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Financial Trend Chart */}
          <Card className="shadow-sm lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-bkad-green" />
                Tren Keuangan Daerah
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-2">
              {financialLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-pulse space-y-3 w-full">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                    ))}
                  </div>
                </div>
              ) : financialChartData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <p>Belum ada data keuangan</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={financialChartData}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(val: number) =>
                        `${(val / 1_000_000_000).toFixed(1)}M`
                      }
                      width={55}
                    />
                    <Tooltip content={<FinancialTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Pendapatan"
                      stroke="#0D6B3F"
                      strokeWidth={2.5}
                      dot={{ fill: "#0D6B3F", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Belanja"
                      stroke="#C5960C"
                      strokeWidth={2.5}
                      dot={{ fill: "#C5960C", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Realisasi"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "#0ea5e9", r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Financial Data Table */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-bkad-gold" />
                Data Keuangan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-2">
              {financialLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-gray-50 rounded-lg p-3"
                    >
                      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : financialData.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    Belum ada data keuangan
                  </p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {[...financialData]
                    .sort((a, b) => b.year.localeCompare(a.year))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-50 rounded-lg p-3 hover:bg-bkad-light/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900 text-sm">
                            Tahun {item.year}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] bg-bkad-green/5 text-bkad-green border-bkad-green/20"
                          >
                            {item.realisasi.toFixed(1)}% realisasi
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Pendapatan</span>
                            <span className="text-bkad-green font-medium">
                              {formatCurrency(item.pendapatan)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Belanja</span>
                            <span className="text-bkad-gold font-medium">
                              {formatCurrency(item.belanja)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
