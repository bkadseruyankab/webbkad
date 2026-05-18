import { db } from "../src/lib/db";

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed Hero Slides
  const existingHeroes = await db.heroSlide.count();
  if (existingHeroes === 0) {
    await db.heroSlide.createMany({
      data: [
        {
          title: "Mewujudkan Tata Kelola Keuangan Daerah yang Transparan",
          subtitle: "BKAD Kabupaten Seruyan berkomitmen mengelola keuangan dan aset daerah secara profesional, akuntabel, dan transparan untuk kemakmuran masyarakat.",
          image: "/images/hero-1.png",
          order: 1,
        },
        {
          title: "Pengelolaan Aset Daerah yang Optimal",
          subtitle: "Mengoptimalkan pemanfaatan aset daerah untuk mendukung pembangunan dan pelayanan publik di Kabupaten Seruyan.",
          image: "/images/hero-2.png",
          order: 2,
        },
        {
          title: "Bersama Membangun Seruyan yang Maju",
          subtitle: "Dengan pengelolaan keuangan yang baik, kita wujudkan pembangunan Kabupaten Seruyan yang berkelanjutan dan berkeadilan.",
          image: "/images/hero-3.png",
          order: 3,
        },
      ],
    });
    console.log("✓ Hero slides seeded");
  }

  // Seed News
  const existingNews = await db.news.count();
  if (existingNews === 0) {
    await db.news.createMany({
      data: [
        {
          title: "Seruyan Raih Opini WTP untuk Laporan Keuangan Tahun 2024",
          excerpt: "Kabupaten Seruyan kembali meraih opini Wajar Tanpa Pengecualian (WTP) atas Laporan Keuangan Pemerintah Daerah tahun 2024. Pencapaian ini menunjukkan komitmen dalam pengelolaan keuangan yang transparan.",
          date: "15 Januari 2025",
          category: "Keuangan",
          image: "/images/news-1.png",
          readTime: "5 menit",
          order: 1,
        },
        {
          title: "BKAD Seruyan Luncurkan Sistem E-Budgeting Terpadu",
          excerpt: "Badan Keuangan dan Aset Daerah meluncurkan sistem e-budgeting terpadu untuk meningkatkan efisiensi dan transparansi dalam proses perencanaan anggaran daerah.",
          date: "10 Januari 2025",
          category: "Teknologi",
          image: "/images/news-2.png",
          readTime: "4 menit",
          order: 2,
        },
        {
          title: "Sosialisasi PBB P2 di Kecamatan Seruyan Hilir",
          excerpt: "Tim BKAD melaksanakan sosialisasi Pajak Bumi dan Bangunan Perkotaan dan Perdesaan (PBB P2) di Kecamatan Seruyan Hilir untuk meningkatkan kesadaran masyarakat.",
          date: "8 Januari 2025",
          category: "Pajak",
          image: "/images/news-3.png",
          readTime: "3 menit",
          order: 3,
        },
        {
          title: "Inventarisasi Aset Daerah Tahap II Tahun 2025 Dimulai",
          excerpt: "BKAD Seruyan memulai tahap kedua inventarisasi aset daerah yang mencakup seluruh aset tetap dan aset lainnya di lingkungan Pemerintah Kabupaten Seruyan.",
          date: "5 Januari 2025",
          category: "Aset",
          image: "/images/news-4.png",
          readTime: "4 menit",
          order: 4,
        },
        {
          title: "Rapat Koordinasi APBD 2025 bersama DPRD Seruyan",
          excerpt: "Rapat koordinasi penyusunan APBD tahun 2025 telah dilaksanakan dengan membahas prioritas pembangunan dan alokasi anggaran yang tepat sasaran.",
          date: "3 Januari 2025",
          category: "Anggaran",
          image: "/images/news-5.png",
          readTime: "3 menit",
          order: 5,
        },
        {
          title: "Festival Budaya Seruyan Dukung PAD Daerah",
          excerpt: "Pemerintah Kabupaten Seruyan menggelar Festival Budaya yang diharapkan mampu meningkatkan Pendapatan Asli Daerah melalui sektor pariwisata.",
          date: "28 Desember 2024",
          category: "PAD",
          image: "/images/news-6.png",
          readTime: "5 menit",
          order: 6,
        },
      ],
    });
    console.log("✓ News seeded");
  }

  // Seed Agenda
  const existingAgenda = await db.agenda.count();
  if (existingAgenda === 0) {
    await db.agenda.createMany({
      data: [
        {
          title: "Rapat Koordinasi Penyusunan APBD Perubahan 2025",
          date: "20 Februari 2025",
          time: "09:00 - 12:00 WIB",
          location: "Ruang Rapat Utama BKAD",
          status: "upcoming",
        },
        {
          title: "Sosialisasi Permendagri No. 70 Tahun 2024",
          date: "25 Februari 2025",
          time: "08:00 - 16:00 WIB",
          location: "Aula Kantor Bupati",
          status: "upcoming",
        },
        {
          title: "Workshop Sistem Informasi Aset Daerah",
          date: "5 Maret 2025",
          time: "09:00 - 15:00 WIB",
          location: "Ruang Pelatihan BKAD",
          status: "upcoming",
        },
        {
          title: "Audit Kinerja oleh BPK Perwakilan Kalimantan Tengah",
          date: "10 Maret 2025",
          time: "08:00 - 17:00 WIB",
          location: "Kantor BKAD Seruyan",
          status: "upcoming",
        },
      ],
    });
    console.log("✓ Agenda seeded");
  }

  // Seed Gallery
  const existingGallery = await db.gallery.count();
  if (existingGallery === 0) {
    await db.gallery.createMany({
      data: [
        { image: "/images/hero-1.png", caption: "Kantor BKAD Kabupaten Seruyan", order: 1 },
        { image: "/images/layanan.png", caption: "Pelayanan Publik BKAD", order: 2 },
        { image: "/images/news-5.png", caption: "Rapat Koordinasi APBD 2025", order: 3 },
        { image: "/images/news-6.png", caption: "Festival Budaya Seruyan", order: 4 },
      ],
    });
    console.log("✓ Gallery seeded");
  }

  // Seed Stats
  const existingStats = await db.stat.count();
  if (existingStats === 0) {
    await db.stat.createMany({
      data: [
        { icon: "TrendingUp", value: "1,25", prefix: "Rp ", suffix: " T", label: "Anggaran Daerah 2024", color: "text-emerald-600", order: 1 },
        { icon: "Building2", value: "2.450", label: "Aset Daerah Terdaftar", color: "text-amber-600", order: 2 },
        { icon: "FileCheck", value: "98,5", suffix: "%", label: "Realisasi Pendapatan", color: "text-teal-600", order: 3 },
        { icon: "Coins", value: "156", prefix: "Rp ", suffix: " M", label: "PAD Terealisasi", color: "text-orange-600", order: 4 },
      ],
    });
    console.log("✓ Stats seeded");
  }

  // Seed Services
  const existingServices = await db.service.count();
  if (existingServices === 0) {
    await db.service.createMany({
      data: [
        { icon: "Landmark", title: "Pengelolaan APBD", description: "Perencanaan, pelaksanaan, dan pertanggungjawaban Anggaran Pendapatan dan Belanja Daerah Kabupaten Seruyan.", color: "text-emerald-600", bgColor: "bg-emerald-50", order: 1 },
        { icon: "Receipt", title: "Pengelolaan PAD", description: "Optimalisasi Pendapatan Asli Daerah melalui berbagai sumber pendapatan pajak dan retribusi.", color: "text-amber-600", bgColor: "bg-amber-50", order: 2 },
        { icon: "Building", title: "Pengelolaan Aset", description: "Inventarisasi, penilaian, dan pengelolaan aset milik daerah secara optimal dan akuntabel.", color: "text-teal-600", bgColor: "bg-teal-50", order: 3 },
        { icon: "Calculator", title: "PBB P2", description: "Pengelolaan Pajak Bumi dan Bangunan Perkotaan dan Perdesaan untuk pendapatan daerah.", color: "text-violet-600", bgColor: "bg-violet-50", order: 4 },
        { icon: "FileSpreadsheet", title: "Laporan Keuangan", description: "Penyusunan laporan keuangan daerah yang transparan dan akuntabel sesuai standar SAP.", color: "text-rose-600", bgColor: "bg-rose-50", order: 5 },
        { icon: "ClipboardList", title: "Perencanaan Anggaran", description: "Penyusunan rencana anggaran daerah yang terukur dan berorientasi pada hasil pembangunan.", color: "text-orange-600", bgColor: "bg-orange-50", order: 6 },
      ],
    });
    console.log("✓ Services seeded");
  }

  // Seed Financial Data
  const existingFinance = await db.financialData.count();
  if (existingFinance === 0) {
    await db.financialData.createMany({
      data: [
        { year: "2020", pendapatan: 850, belanja: 820, realisasi: 94.2 },
        { year: "2021", pendapatan: 920, belanja: 890, realisasi: 95.8 },
        { year: "2022", pendapatan: 1050, belanja: 1010, realisasi: 96.5 },
        { year: "2023", pendapatan: 1150, belanja: 1100, realisasi: 97.2 },
        { year: "2024", pendapatan: 1250, belanja: 1190, realisasi: 98.5 },
      ],
    });
    console.log("✓ Financial data seeded");
  }

  console.log("🎉 Seeding complete!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
