import { NextResponse } from "next/server";

const statsData = {
  anggaranDaerah: {
    value: "1.25",
    prefix: "Rp ",
    suffix: " T",
    label: "Anggaran Daerah 2024",
    trend: "+8.7%",
  },
  asetDaerah: {
    value: "2.450",
    label: "Aset Daerah Terdaftar",
    trend: "+12.3%",
  },
  realisasiPendapatan: {
    value: "98.5",
    suffix: "%",
    label: "Realisasi Pendapatan",
    trend: "+1.3%",
  },
  padTerealisasi: {
    value: "156",
    suffix: " M",
    prefix: "Rp ",
    label: "PAD Terealisasi",
    trend: "+15.2%",
  },
  financialData: [
    { year: "2020", pendapatan: 850, belanja: 820, realisasi: 94.2 },
    { year: "2021", pendapatan: 920, belanja: 890, realisasi: 95.8 },
    { year: "2022", pendapatan: 1050, belanja: 1010, realisasi: 96.5 },
    { year: "2023", pendapatan: 1150, belanja: 1100, realisasi: 97.2 },
    { year: "2024", pendapatan: 1250, belanja: 1190, realisasi: 98.5 },
  ],
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: statsData,
  });
}
