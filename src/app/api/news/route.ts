import { NextResponse } from "next/server";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
}

const newsData: NewsItem[] = [
  {
    id: 1,
    title: "Seruyan Raih Opini WTP untuk Laporan Keuangan Tahun 2024",
    excerpt:
      "Kabupaten Seruyan kembali meraih opini Wajar Tanpa Pengecualian (WTP) atas Laporan Keuangan Pemerintah Daerah tahun 2024. Pencapaian ini menunjukkan komitmen dalam pengelolaan keuangan yang transparan.",
    date: "15 Januari 2025",
    category: "Keuangan",
    image: "/images/news-1.png",
    readTime: "5 menit",
  },
  {
    id: 2,
    title: "BKAD Seruyan Luncurkan Sistem E-Budgeting Terpadu",
    excerpt:
      "Badan Keuangan dan Aset Daerah meluncurkan sistem e-budgeting terpadu untuk meningkatkan efisiensi dan transparansi dalam proses perencanaan anggaran daerah.",
    date: "10 Januari 2025",
    category: "Teknologi",
    image: "/images/news-2.png",
    readTime: "4 menit",
  },
  {
    id: 3,
    title: "Sosialisasi PBB P2 di Kecamatan Seruyan Hilir",
    excerpt:
      "Tim BKAD melaksanakan sosialisasi Pajak Bumi dan Bangunan Perkotaan dan Perdesaan (PBB P2) di Kecamatan Seruyan Hilir untuk meningkatkan kesadaran masyarakat.",
    date: "8 Januari 2025",
    category: "Pajak",
    image: "/images/news-3.png",
    readTime: "3 menit",
  },
  {
    id: 4,
    title: "Inventarisasi Aset Daerah Tahap II Tahun 2025 Dimulai",
    excerpt:
      "BKAD Seruyan memulai tahap kedua inventarisasi aset daerah yang mencakup seluruh aset tetap dan aset lainnya di lingkungan Pemerintah Kabupaten Seruyan.",
    date: "5 Januari 2025",
    category: "Aset",
    image: "/images/news-4.png",
    readTime: "4 menit",
  },
  {
    id: 5,
    title: "Rapat Koordinasi APBD 2025 bersama DPRD Seruyan",
    excerpt:
      "Rapat koordinasi penyusunan APBD tahun 2025 telah dilaksanakan dengan membahas prioritas pembangunan dan alokasi anggaran yang tepat sasaran.",
    date: "3 Januari 2025",
    category: "Anggaran",
    image: "/images/news-5.png",
    readTime: "3 menit",
  },
  {
    id: 6,
    title: "Festival Budaya Seruyan Dukung PAD Daerah",
    excerpt:
      "Pemerintah Kabupaten Seruyan menggelar Festival Budaya yang diharapkan mampu meningkatkan Pendapatan Asli Daerah melalui sektor pariwisata.",
    date: "28 Desember 2024",
    category: "PAD",
    image: "/images/news-6.png",
    readTime: "5 menit",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const limit = searchParams.get("limit");

  let filtered = newsData;

  if (category) {
    filtered = filtered.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (limit) {
    filtered = filtered.slice(0, parseInt(limit));
  }

  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
}
