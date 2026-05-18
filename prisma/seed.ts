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

  // Seed PageContent
  const existingPageContent = await db.pageContent.count();
  if (existingPageContent === 0) {
    await db.pageContent.createMany({
      data: [
        {
          slug: "sejarah",
          title: "Sejarah BKAD Kabupaten Seruyan",
          content: `Badan Keuangan dan Aset Daerah (BKAD) Kabupaten Seruyan merupakan hasil peleburan dari Badan Pengelolaan Keuangan dan Aset Daerah (BPKAD) yang telah ada sebelumnya. Pembentukan BKAD didasarkan pada Peraturan Daerah Kabupaten Seruyan Nomor 5 Tahun 2016 tentang Pembentukan dan Susunan Perangkat Daerah Kabupaten Seruyan.

Sejarah panjang pengelolaan keuangan daerah di Kabupaten Seruyan dimulai sejak awal pembentukan kabupaten ini. Pada awalnya, fungsi pengelolaan keuangan dan aset daerah dilaksanakan oleh Bagian Keuangan pada Sekretariat Daerah. Seiring dengan meningkatnya kompleksitas pengelolaan keuangan daerah dan tuntutan good governance, pada tahun 2010 dibentuklah Badan Pengelolaan Keuangan dan Aset Daerah (BPKAD).

Pada tahun 2016, seiring dengan reformasi birokrasi dan penyederhanaan organisasi perangkat daerah, BPKAD dilebur menjadi Badan Keuangan dan Aset Daerah (BKAD) sebagaimana yang kita kenal sekarang. Peleburan ini bertujuan untuk meningkatkan efisiensi, efektivitas, dan koordinasi dalam pengelolaan keuangan dan aset daerah.

Sejak pembentukannya, BKAD Kabupaten Seruyan terus berkembang dan beradaptasi dengan perubahan regulasi serta tuntutan pengelolaan keuangan daerah yang semakin kompleks. Berbagai pencapaian telah diraih, termasuk perolehan opini Wajar Tanpa Pengecualian (WTP) secara berturut-turut atas Laporan Keuangan Pemerintah Daerah, yang menunjukkan komitmen dan kemampuan BKAD dalam mengelola keuangan daerah secara transparan dan akuntabel.

Hingga saat ini, BKAD Kabupaten Seruyan terus berinovasi dengan mengadopsi sistem informasi terpadu seperti e-budgeting dan e-reporting untuk mendukung tata kelola keuangan daerah yang lebih modern dan transparan.`,
        },
        {
          slug: "visi-misi",
          title: "Visi & Misi BKAD",
          content: `**Visi**

Terwujudnya Pengelolaan Keuangan dan Aset Daerah yang Profesional, Akuntabel, dan Transparan

**Misi**

1. Meningkatkan profesionalisme pengelolaan keuangan daerah melalui penerapan sistem dan prosedur yang sesuai dengan peraturan perundang-undangan serta standar akuntansi pemerintahan.

2. Mengoptimalkan pemanfaatan dan pendayagunaan aset daerah untuk mendukung percepatan pembangunan dan peningkatan pelayanan publik di Kabupaten Seruyan.

3. Meningkatkan kapasitas dan kompetensi sumber daya manusia di bidang pengelolaan keuangan dan aset daerah melalui pendidikan, pelatihan, dan pengembangan berkelanjutan.

4. Meningkatkan kualitas pelayanan publik dalam bidang pengelolaan keuangan dan aset daerah yang cepat, tepat, dan mudah diakses oleh masyarakat.

5. Mewujudkan transparansi dan akuntabilitas pengelolaan keuangan daerah melalui pelaporan yang tepat waktu, lengkap, dan dapat diakses oleh seluruh pemangku kepentingan.`,
        },
        {
          slug: "tugas-fungsi",
          title: "Tugas & Fungsi BKAD",
          content: `**Tugas**

Badan Keuangan dan Aset Daerah mempunyai tugas membantu Bupati dalam melaksanakan urusan pemerintahan daerah di bidang pengelolaan keuangan dan aset daerah.

**Fungsi**

1. Perumusan kebijakan teknis di bidang penyusunan Anggaran Pendapatan dan Belanja Daerah (APBD) serta pelaksanaan anggaran pendapatan dan belanja daerah.

2. Pengelolaan Pendapatan Asli Daerah (PAD), Dana Perimbangan, dan Lain-Lain Pendapatan Daerah yang Sah sesuai dengan ketentuan peraturan perundang-undangan.

3. Pelaksanaan inventarisasi, penilaian, dan pengadministrasian aset milik daerah serta penyelenggaraan tata usaha kebendaan daerah.

4. Pengelolaan Pajak Bumi dan Bangunan Perkotaan dan Perdesaan (PBB-P2), Bea Perolehan Hak atas Tanah dan Bangunan (BPHTB), serta pajak dan retribusi daerah lainnya.

5. Penyusunan laporan keuangan pemerintah daerah yang meliputi Laporan Realisasi Anggaran, Neraca, Laporan Perubahan Saldo, Laporan Arus Kas, dan Catatan atas Laporan Keuangan.

6. Pelaksanaan perencanaan dan penganggaran keuangan daerah serta evaluasi terhadap pelaksanaan rencana dan anggaran tersebut.

7. Pengelolaan barang milik daerah yang meliputi perencanaan kebutuhan, pengadaan, penggunaan, pemanfaatan, pengamanan, pemeliharaan, penghapusan, dan penatausahaan barang milik daerah.

8. Pelaksanaan tugas lain yang diberikan oleh Bupati sesuai dengan tugas dan fungsinya.`,
        },
        {
          slug: "struktur-organisasi",
          title: "Struktur Organisasi BKAD",
          content: `Badan Keuangan dan Aset Daerah (BKAD) Kabupaten Seruyan dipimpin oleh seorang Kepala Badan yang berada di bawah dan bertanggung jawab kepada Bupati melalui Sekretaris Daerah. Struktur organisasi BKAD terdiri dari:

**Kepala Badan**
Pimpinan tertinggi yang bertanggung jawab atas keseluruhan pelaksanaan tugas dan fungsi BKAD.

**Sekretariat**
Unit yang bertugas memberikan pelayanan administratif dan teknis kepada seluruh unit organisasi di lingkungan BKAD, meliputi tata usaha, kepegawaian, keuangan, dan perlengkapan.

**Bidang-Bidang**

1. **Bidang Anggaran** — Bertugas menyiapkan perumusan kebijakan teknis dan pelaksanaan di bidang penyusunan APBD, pelaksanaan anggaran, serta evaluasi kinerja keuangan daerah.

2. **Bidang Pendapatan** — Bertugas menyiapkan perumusan kebijakan teknis dan pelaksanaan di bidang pengelolaan PAD, Dana Perimbangan, PBB-P2, BPHTB, serta pajak dan retribusi daerah lainnya.

3. **Bidang Pengelolaan Aset** — Bertugas menyiapkan perumusan kebijakan teknis dan pelaksanaan di bidang inventarisasi, penilaian, pengadministrasian, dan pengelolaan barang milik daerah.

4. **Bidang Pengelolaan Keuangan** — Bertugas menyiapkan perumusan kebijakan teknis dan pelaksanaan di bidang perencanaan dan penganggaran, penatausahaan keuangan, serta penyusunan laporan keuangan pemerintah daerah.`,
          image: "/images/hero-1.png",
        },
      ],
    });
    console.log("✓ PageContent seeded");
  }

  // Seed Officials
  const existingOfficials = await db.official.count();
  if (existingOfficials === 0) {
    await db.official.createMany({
      data: [
        {
          name: "H. Sudarsono, S.Sos., M.Si",
          position: "Kepala Badan",
          photo: "/images/news-5.png",
          nip: "196805121990031005",
          order: 1,
        },
        {
          name: "Hj. Siti Nurhaliza, S.E., M.M",
          position: "Sekretaris Badan",
          photo: "/images/layanan.png",
          nip: "197203151995032001",
          order: 2,
        },
        {
          name: "Ahmad Fauzi, S.E",
          position: "Kepala Bidang Anggaran",
          photo: "/images/news-1.png",
          nip: "198001102005011002",
          order: 3,
        },
        {
          name: "Dewi Safitri, S.E., M.Si",
          position: "Kepala Bidang Pendapatan",
          photo: "/images/news-2.png",
          nip: "198205202006042003",
          order: 4,
        },
        {
          name: "Bambang Hartono, S.Sos",
          position: "Kepala Bidang Pengelolaan Aset",
          photo: "/images/news-3.png",
          nip: "197508151998031004",
          order: 5,
        },
        {
          name: "Ratna Kusuma, S.E",
          position: "Kepala Bidang Pengelolaan Keuangan",
          photo: "/images/news-4.png",
          nip: "198310252008012005",
          order: 6,
        },
      ],
    });
    console.log("✓ Officials seeded");
  }

  // Seed Publications
  const existingPublications = await db.publication.count();
  if (existingPublications === 0) {
    await db.publication.createMany({
      data: [
        {
          title: "APBD Kabupaten Seruyan Tahun 2024",
          description: "Anggaran Pendapatan dan Belanja Daerah Kabupaten Seruyan Tahun Anggaran 2024 yang telah ditetapkan melalui Peraturan Daerah.",
          category: "laporan-keuangan",
          coverImage: "/images/news-5.png",
          date: "15 Januari 2024",
          order: 1,
        },
        {
          title: "Laporan Penyelenggaraan Pemerintahan Daerah (LPPD) 2024",
          description: "Laporan Penyelenggaraan Pemerintahan Daerah Kabupaten Seruyan Tahun 2024 yang disampaikan kepada Gubernur Kalimantan Tengah.",
          category: "laporan-keuangan",
          coverImage: "/images/news-5.png",
          date: "20 Maret 2024",
          order: 2,
        },
        {
          title: "Laporan Kinerja Instansi Pemerintah (LKIP) 2024",
          description: "Laporan Kinerja Instansi Pemerintah Daerah Kabupaten Seruyan Tahun 2024 yang mencakup capaian sasaran dan indikator kinerja.",
          category: "laporan-keuangan",
          coverImage: "/images/news-5.png",
          date: "10 April 2024",
          order: 3,
        },
        {
          title: "Capaian Sistem Pemerintahan Berbasis Elektronik (CSPD) 2024",
          description: "Laporan Capaian Sistem Pemerintahan Berbasis Elektronik Kabupaten Seruyan Tahun 2024.",
          category: "laporan-keuangan",
          coverImage: "/images/news-5.png",
          date: "5 Mei 2024",
          order: 4,
        },
        {
          title: "Buletin Keuangan Daerah Q4 2024",
          description: "Buletin informasi keuangan daerah Kabupaten Seruyan untuk periode Oktober - Desember 2024.",
          category: "buletin",
          coverImage: "/images/news-5.png",
          date: "15 Januari 2025",
          order: 5,
        },
        {
          title: "Buletin Keuangan Daerah Q3 2024",
          description: "Buletin informasi keuangan daerah Kabupaten Seruyan untuk periode Juli - September 2024.",
          category: "buletin",
          coverImage: "/images/news-5.png",
          date: "10 Oktober 2024",
          order: 6,
        },
        {
          title: "Data Pokok Pemerintahan Kabupaten Seruyan 2024",
          description: "Data pokok pemerintahan Kabupaten Seruyan yang mencakup data kepegawaian, keuangan, dan perangkat daerah.",
          category: "data-pokok",
          coverImage: "/images/news-5.png",
          date: "28 Februari 2024",
          order: 7,
        },
        {
          title: "Statistik Keuangan Daerah Kabupaten Seruyan",
          description: "Publikasi statistik keuangan daerah yang menyajikan data dan informasi perkembangan keuangan daerah secara komprehensif.",
          category: "data-pokok",
          coverImage: "/images/news-5.png",
          date: "15 Juni 2024",
          order: 8,
        },
        {
          title: "Peraturan Daerah APBD Tahun 2024",
          description: "Peraturan Daerah Kabupaten Seruyan tentang Anggaran Pendapatan dan Belanja Daerah Tahun Anggaran 2024.",
          category: "peraturan",
          coverImage: "/images/news-5.png",
          date: "20 Januari 2024",
          order: 9,
        },
        {
          title: "Peraturan Gubernur tentang Pengelolaan Aset Daerah",
          description: "Peraturan Gubernur Kalimantan Tengah tentang Pedoman Pengelolaan Barang Milik Daerah di lingkungan Pemerintah Kabupaten/Kota.",
          category: "peraturan",
          coverImage: "/images/news-5.png",
          date: "12 Agustus 2024",
          order: 10,
        },
      ],
    });
    console.log("✓ Publications seeded");
  }

  // Seed Videos
  const existingVideos = await db.video.count();
  if (existingVideos === 0) {
    await db.video.createMany({
      data: [
        {
          title: "Sosialisasi E-Budgeting BKAD Kabupaten Seruyan",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnail: "/images/news-1.png",
          date: "15 November 2024",
          order: 1,
        },
        {
          title: "Inventarisasi Aset Daerah Tahap II Tahun 2024",
          url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
          thumbnail: "/images/news-3.png",
          date: "8 September 2024",
          order: 2,
        },
        {
          title: "Workshop Penyusunan APBD 2025 BKAD Seruyan",
          url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
          thumbnail: "/images/news-5.png",
          date: "20 Desember 2024",
          order: 3,
        },
      ],
    });
    console.log("✓ Videos seeded");
  }

  // Seed Infographics
  const existingInfographics = await db.infographic.count();
  if (existingInfographics === 0) {
    await db.infographic.createMany({
      data: [
        {
          title: "Realisasi Pendapatan Daerah Kabupaten Seruyan 2024",
          image: "/images/hero-1.png",
          date: "15 Januari 2025",
          order: 1,
        },
        {
          title: "Komposisi APBD Kabupaten Seruyan 2024",
          image: "/images/hero-2.png",
          date: "20 Februari 2024",
          order: 2,
        },
        {
          title: "Perkembangan PAD Kabupaten Seruyan 2020-2024",
          image: "/images/news-2.png",
          date: "10 Maret 2024",
          order: 3,
        },
        {
          title: "Distribusi Aset Daerah Kabupaten Seruyan 2024",
          image: "/images/news-4.png",
          date: "5 April 2024",
          order: 4,
        },
      ],
    });
    console.log("✓ Infographics seeded");
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
