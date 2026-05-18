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
          content: `Kabupaten Seruyan kembali meraih opini Wajar Tanpa Pengecualian (WTP) atas Laporan Keuangan Pemerintah Daerah tahun 2024. Pencapaian ini menunjukkan komitmen dalam pengelolaan keuangan yang transparan dan akuntabel.

Pencapaian opini WTP ini merupakan hasil dari kerja keras seluruh perangkat daerah dalam menerapkan Standar Akuntansi Pemerintahan (SAP) dan sistem pengendalian intern yang memadai. BPK Republik Indonesia memberikan opini WTP setelah melakukan pemeriksaan menyeluruh terhadap laporan keuangan pemerintah daerah.

Kepala BKAD Kabupaten Seruyan menyampaikan bahwa pencapaian ini merupakan bukti komitmen seluruh aparatur dalam melaksanakan prinsip-prinsip tata kelola keuangan daerah yang baik. "Opini WTP bukan sekadar pencapaian, tetapi tanggung jawab kita kepada masyarakat untuk mengelola keuangan daerah secara transparan," ujarnya.

Dengan capaian ini, Kabupaten Seruyan telah memperoleh opini WTP secara berturut-turut selama 5 tahun terakhir, yang menunjukkan konsistensi dalam pengelolaan keuangan daerah.`,
          date: "15 Januari 2025",
          category: "Keuangan",
          image: "/images/news-1.png",
          readTime: "5 menit",
          order: 1,
        },
        {
          title: "BKAD Seruyan Luncurkan Sistem E-Budgeting Terpadu",
          excerpt: "Badan Keuangan dan Aset Daerah meluncurkan sistem e-budgeting terpadu untuk meningkatkan efisiensi dan transparansi dalam proses perencanaan anggaran daerah.",
          content: `Badan Keuangan dan Aset Daerah (BKAD) Kabupaten Seruyan resmi meluncurkan sistem e-budgeting terpadu yang akan digunakan dalam proses perencanaan dan penyusunan anggaran daerah mulai tahun anggaran 2025.

Sistem e-budgeting ini merupakan implementasi dari Peraturan Menteri Dalam Negeri tentang Penganggaran Daerah yang mewajibkan pemerintah daerah untuk mengunakan sistem elektronik dalam penyusunan APBD. Dengan sistem ini, seluruh proses perencanaan dan penganggaran dapat dilakukan secara digital, terintegrasi, dan transparan.

Beberapa keunggulan sistem e-budgeting yang diluncurkan antara lain: proses penyusunan anggaran lebih efisien, pengawasan realisasi anggaran lebih mudah, transparansi anggaran lebih terjamin, dan integrasi data antar perangkat daerah lebih baik.

BKAD telah melaksanakan pelatihan bagi seluruh perangkat daerah mengenai penggunaan sistem ini. Diharapkan dengan penerapan e-budgeting, kualitas penyusunan APBD Kabupaten Seruyan akan semakin meningkat.`,
          date: "10 Januari 2025",
          category: "Teknologi",
          image: "/images/news-2.png",
          readTime: "4 menit",
          order: 2,
        },
        {
          title: "Sosialisasi PBB P2 di Kecamatan Seruyan Hilir",
          excerpt: "Tim BKAD melaksanakan sosialisasi Pajak Bumi dan Bangunan Perkotaan dan Perdesaan (PBB P2) di Kecamatan Seruyan Hilir untuk meningkatkan kesadaran masyarakat.",
          content: `Tim Badan Keuangan dan Aset Daerah (BKAD) Kabupaten Seruyan melaksanakan kegiatan sosialisasi Pajak Bumi dan Bangunan Perkotaan dan Perdesaan (PBB P2) di Kecamatan Seruyan Hilir.

Kegiatan sosialisasi ini bertujuan untuk meningkatkan kesadaran dan pemahaman masyarakat mengenai kewajiban pembayaran PBB P2 serta manfaatnya bagi pembangunan daerah. Sebanyak 150 warga dari beberapa kelurahan dan desa mengikuti kegiatan ini.

Dalam sosialisasi tersebut, BKAD menjelaskan mekanisme penilaian PBB, prosedur pembayaran, serta sanksi bagi yang tidak memenuhi kewajiban perpajakannya. Selain itu, masyarakat juga diberikan kesempatan untuk mengajukan keberatan atas penilaian PBB yang dinilai tidak sesuai.

Kepala Bidang Pendapatan BKAD menyampaikan bahwa target penerimaan PBB P2 tahun 2025 meningkat 15% dibandingkan tahun sebelumnya, sehingga sosialisasi menjadi sangat penting untuk mencapai target tersebut.`,
          date: "8 Januari 2025",
          category: "Pajak",
          image: "/images/news-3.png",
          readTime: "3 menit",
          order: 3,
        },
        {
          title: "Inventarisasi Aset Daerah Tahap II Tahun 2025 Dimulai",
          excerpt: "BKAD Seruyan memulai tahap kedua inventarisasi aset daerah yang mencakup seluruh aset tetap dan aset lainnya di lingkungan Pemerintah Kabupaten Seruyan.",
          content: `Badan Keuangan dan Aset Daerah (BKAD) Kabupaten Seruyan memulai pelaksanaan inventarisasi aset daerah tahap kedua tahun 2025. Kegiatan ini merupakan lanjutan dari inventarisasi tahap pertama yang telah dilaksanakan pada semester pertama.

Inventarisasi tahap kedua ini mencakup seluruh aset tetap dan aset lainnya yang dimiliki oleh Pemerintah Kabupaten Seruyan, meliputi tanah, bangunan, kendaraan, peralatan, dan konstruksi dalam pengerjaan. Tim inventarisasi akan mendatangi seluruh unit kerja perangkat daerah untuk melakukan verifikasi fisik dan dokumentasi aset.

Kepala Bidang Pengelolaan Aset menyampaikan bahwa inventarisasi ini penting untuk memastikan seluruh aset daerah tercatat dengan baik dalam sistem informasi manajemen barang milik daerah. "Dengan inventarisasi yang akurat, kita dapat mengoptimalkan pemanfaatan aset daerah," ujarnya.

Hasil inventarisasi akan digunakan sebagai dasar untuk penyusunan laporan barang milik daerah dan evaluasi pemanfaatan aset.`,
          date: "5 Januari 2025",
          category: "Aset",
          image: "/images/news-4.png",
          readTime: "4 menit",
          order: 4,
        },
        {
          title: "Rapat Koordinasi APBD 2025 bersama DPRD Seruyan",
          excerpt: "Rapat koordinasi penyusunan APBD tahun 2025 telah dilaksanakan dengan membahas prioritas pembangunan dan alokasi anggaran yang tepat sasaran.",
          content: `Rapat koordinasi penyusunan Anggaran Pendapatan dan Belanja Daerah (APBD) tahun 2025 telah dilaksanakan oleh BKAD Kabupaten Seruyan bersama DPRD Kabupaten Seruyan.

Rapat ini membahas beberapa hal penting, antara lain: prioritas pembangunan daerah tahun 2025, alokasi anggaran untuk program prioritas, proyeksi pendapatan daerah, dan kebijakan anggaran yang efisien. Rapat juga membahas rencana pembiayaan dan proyeksi defisit anggaran.

Bupati Seruyan dalam sambutannya menekankan pentingnya pengalokasian anggaran yang tepat sasaran dan berorientasi pada hasil. "APBD harus menjadi instrumen untuk mewujudkan pembangunan yang berkeadilan dan berkelanjutan di seluruh kecamatan," ujarnya.

Hasil rapat koordinasi ini akan menjadi dasar penyusunan rancangan APBD yang akan dibahas lebih lanjut dalam musyawarah perencanaan pembangunan (musrenbang).`,
          date: "3 Januari 2025",
          category: "Anggaran",
          image: "/images/news-5.png",
          readTime: "3 menit",
          order: 5,
        },
        {
          title: "Festival Budaya Seruyan Dukung PAD Daerah",
          excerpt: "Pemerintah Kabupaten Seruyan menggelar Festival Budaya yang diharapkan mampu meningkatkan Pendapatan Asli Daerah melalui sektor pariwisata.",
          content: `Pemerintah Kabupaten Seruyan menggelar Festival Budaya Seruyan yang berlangsung selama tiga hari di kawasan wisata Kuala Pembuang. Festival ini diharapkan mampu meningkatkan Pendapatan Asli Daerah (PAD) melalui sektor pariwisata.

Festival ini menampilkan berbagai atraksi budaya, pameran kerajinan lokal, kuliner khas Seruyan, dan kompetisi seni budaya. Sebanyak 5.000 pengunjung dari dalam dan luar daerah hadir dalam acara ini.

Kepala BKAD menyampaikan bahwa kegiatan seperti Festival Budaya memiliki potensi besar untuk meningkatkan PAD melalui retribusi daerah dan pajak hotel serta restoran. "Kami terus berupaya mengoptimalkan seluruh sumber pendapatan daerah untuk mendukung pembangunan," ujarnya.

Dalam kesempatan tersebut, BKAD juga membuka stand pelayanan informasi perpajakan untuk mensosialisasikan kewajiban perpajakan kepada pelaku usaha di sektor pariwisata.`,
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
        {
          icon: "Landmark",
          title: "Pengelolaan APBD",
          description: "Perencanaan, pelaksanaan, dan pertanggungjawaban Anggaran Pendapatan dan Belanja Daerah Kabupaten Seruyan.",
          content: `Layanan Pengelolaan APBD merupakan salah satu tugas utama Badan Keuangan dan Aset Daerah (BKAD) Kabupaten Seruyan. Layanan ini mencakup seluruh proses perencanaan, pelaksanaan, dan pertanggungjawaban anggaran daerah.

**Proses Perencanaan**
BKAD menyusun rancangan APBD berdasarkan prioritas pembangunan yang telah ditetapkan dalam Rencana Pembangunan Jangka Menengah Daerah (RPJMD). Proses ini melibatkan seluruh perangkat daerah dan diselaraskan melalui musyawarah perencanaan pembangunan (musrenbang).

**Pelaksanaan Anggaran**
Setelah APBD ditetapkan, BKAD mengawal pelaksanaan anggaran agar sesuai dengan ketentuan peraturan perundang-undangan. BKAD melakukan monitoring dan evaluasi secara berkala terhadap realisasi anggaran setiap perangkat daerah.

**Pertanggungjawaban**
BKAD menyusun laporan keuangan pemerintah daerah yang meliputi Laporan Realisasi Anggaran, Neraca, Laporan Perubahan Saldo, Laporan Arus Kas, dan Catatan atas Laporan Keuangan sebagai bentuk pertanggungjawaban pengelolaan APBD.

**Persyaratan Layanan**
Untuk mengakses layanan terkait APBD, perangkat daerah dapat mengajukan permohonan melalui sistem e-budgeting atau datang langsung ke kantor BKAD pada jam kerja.`,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          order: 1,
        },
        {
          icon: "Receipt",
          title: "Pengelolaan PAD",
          description: "Optimalisasi Pendapatan Asli Daerah melalui berbagai sumber pendapatan pajak dan retribusi.",
          content: `Layanan Pengelolaan PAD bertujuan untuk mengoptimalkan seluruh sumber Pendapatan Asli Daerah Kabupaten Seruyan melalui pungutan pajak dan retribusi daerah.

**Sumber PAD**
PAD Kabupaten Seruyan berasal dari beberapa sumber utama:
1. Hasil pajak daerah (PBB P2, BPHTB, pajak restoran, pajak hotel, dll)
2. Hasil retribusi daerah (retribusi jasa umum, jasa usaha, perizinan)
3. Hasil pengelolaan kekayaan daerah
4. Lain-lain PAD yang sah

**Prosedur Pembayaran**
Masyarakat dapat melakukan pembayaran pajak dan retribusi daerah melalui:
- Kasir di kantor BKAD
- Bank persepsi yang telah ditunjuk
- Sistem pembayaran online (untuk jenis pajak tertentu)

**Informasi Lebih Lanjut**
Hubungi Bidang Pendapatan BKAD pada jam kerja: Senin-Jumat, 08:00-16:00 WIB`,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          order: 2,
        },
        {
          icon: "Building",
          title: "Pengelolaan Aset",
          description: "Inventarisasi, penilaian, dan pengelolaan aset milik daerah secara optimal dan akuntabel.",
          content: `Layanan Pengelolaan Aset Daerah mencakup kegiatan inventarisasi, penilaian, pengadministrasian, dan pengelolaan barang milik daerah di lingkungan Pemerintah Kabupaten Seruyan.

**Ruang Lingkup**
1. Inventarisasi dan pengkodean barang milik daerah
2. Penilaian aset daerah
3. Pencatatan dan pelaporan barang milik daerah
4. Pengamanan dan pemeliharaan aset
5. Penghapusan dan penjualan aset
6. Pemanfaatan aset daerah

**Prosedur Pengajuan**
Perangkat daerah yang memerlukan layanan terkait aset dapat mengajukan permohonan ke Bidang Pengelolaan Aset BKAD dengan melampirkan dokumen pendukung yang diperlukan.

**Layanan Online**
Sebagian layanan pengelolaan aset sudah dapat diakses melalui Sistem Informasi Manajemen Barang Milik Daerah (SIM BMD).`,
          color: "text-teal-600",
          bgColor: "bg-teal-50",
          order: 3,
        },
        {
          icon: "Calculator",
          title: "PBB P2",
          description: "Pengelolaan Pajak Bumi dan Bangunan Perkotaan dan Perdesaan untuk pendapatan daerah.",
          content: `Layanan PBB P2 (Pajak Bumi dan Bangunan Perkotaan dan Perdesaan) merupakan layanan yang diberikan BKAD dalam pengelolaan pajak atas bumi dan bangunan yang dimiliki, dikuasai, atau dimanfaatkan oleh orang pribadi atau badan.

**Jenis Layanan**
1. Penerbitan Surat Pemberitahuan Pajak Terutang (SPPT)
2. Penerimaan pembayaran PBB P2
3. Pengurangan atau pembebasan PBB P2
4. Penyelesaian keberatan atas penilaian PBB P2

**Cara Pembayaran**
- Kantor BKAD Seruyan
- Bank Persepsi
- Gerai pembayaran yang ditunjuk

**Pengurangan PBB**
Wajib pajak yang mengalami kerusakan bangunan atau bumi dapat mengajukan pengurangan PBB dengan melampirkan bukti pendukung.

**Informasi**
Hubungi Bidang Pendapatan BKAD untuk informasi lebih lanjut mengenai PBB P2.`,
          color: "text-violet-600",
          bgColor: "bg-violet-50",
          order: 4,
        },
        {
          icon: "FileSpreadsheet",
          title: "Laporan Keuangan",
          description: "Penyusunan laporan keuangan daerah yang transparan dan akuntabel sesuai standar SAP.",
          content: `Layanan Laporan Keuangan mencakup penyusunan, pengauditan, dan publikasi laporan keuangan pemerintah daerah Kabupaten Seruyan sesuai Standar Akuntansi Pemerintahan (SAP).

**Komponen Laporan Keuangan**
1. Laporan Realisasi Anggaran
2. Neraca
3. Laporan Perubahan Saldo
4. Laporan Arus Kas
5. Catatan atas Laporan Keuangan

**Jadwal Penyusunan**
- Triwulanan: Laporan keuangan triwulanan disusun setiap akhir kuartal
- Semesteran: Laporan keuangan semesteran disusun pada akhir semester
- Tahunan: Laporan keuangan tahunan disusun pada awal tahun berikutnya

**Akses Laporan**
Laporan keuangan pemerintah daerah dapat diakses oleh masyarakat melalui halaman Publikasi pada website ini atau datang langsung ke kantor BKAD.`,
          color: "text-rose-600",
          bgColor: "bg-rose-50",
          order: 5,
        },
        {
          icon: "ClipboardList",
          title: "Perencanaan Anggaran",
          description: "Penyusunan rencana anggaran daerah yang terukur dan berorientasi pada hasil pembangunan.",
          content: `Layanan Perencanaan Anggaran membantu perangkat daerah dalam menyusun rencana kerja dan anggaran yang terukur, berorientasi pada hasil, dan sesuai dengan prioritas pembangunan daerah.

**Proses Perencanaan**
1. Penyusunan Rencana Kerja Perangkat Daerah (RKPD)
2. Penyusunan Rencana Kerja dan Anggaran (RKA)
3. Musyawarah perencanaan pembangunan
4. Penetapan APBD

**Sistem E-Budgeting**
BKAD telah mengimplementasikan sistem e-budgeting untuk mempermudah proses perencanaan anggaran. Perangkat daerah dapat mengakses sistem ini melalui portal yang disediakan.

**Bantuan Teknis**
BKAD menyediakan bantuan teknis bagi perangkat daerah yang memerlukan panduan dalam menyusun rencana kerja dan anggaran. Hubungi Bidang Anggaran BKAD untuk informasi lebih lanjut.`,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          order: 6,
        },
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

  // Seed Laporan
  const existingLaporan = await db.laporan.count();
  if (existingLaporan === 0) {
    await db.laporan.createMany({
      data: [
        {
          name: "Budi Santoso",
          email: "budi.santoso@email.com",
          phone: "081234567890",
          subject: "Pertanyaan tentang Pembayaran PBB",
          message: "Selamat pagi, saya ingin bertanya tentang cara pembayaran PBB secara online. Apakah saat ini sudah tersedia fasilitas pembayaran PBB melalui internet? Terima kasih.",
          category: "pajak",
          status: "selesai",
        },
        {
          name: "Siti Aminah",
          email: "siti.aminah@email.com",
          phone: "082345678901",
          subject: "Pengaduan Pelayanan Publik",
          message: "Saya ingin mengadukan pelayanan di bagian informasi publik yang kurang responsif. Saat saya datang untuk mengurus surat keterangan, petugas tidak memberikan informasi yang jelas mengenai persyaratan yang diperlukan.",
          category: "pengaduan",
          status: "diproses",
        },
        {
          name: "Ahmad Ridwan",
          email: "ahmad.ridwan@email.com",
          phone: "083456789012",
          subject: "Permohonan Data Keuangan Daerah",
          message: "Dengan hormat, saya selaku peneliti dari Universitas Palangka Raya ingin memohon data keuangan daerah Kabupaten Seruyan tahun 2022-2024 untuk keperluan penelitian. Atas perhatian dan kerjasamanya saya ucapkan terima kasih.",
          category: "keuangan",
          status: "baru",
        },
        {
          name: "Dewi Lestari",
          email: "dewi.lestari@email.com",
          phone: "",
          subject: "Saran Penyempurnaan Website",
          message: "Saya ingin memberikan saran untuk penyempurnaan website BKAD. Sebaiknya ditambahkan fitur pencarian yang lebih baik dan halaman FAQ untuk pertanyaan yang sering diajukan. Terima kasih.",
          category: "pelayanan",
          status: "baru",
        },
      ],
    });
    console.log("✓ Laporan seeded");
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
