import { db } from "../src/lib/db";

async function main() {
  const news = await db.news.findMany();
  for (const item of news) {
    if (!item.content) {
      await db.news.update({ where: { id: item.id }, data: { content: item.excerpt + "\n\nInformasi detail mengenai " + item.title.toLowerCase() + " akan segera tersedia. Untuk informasi lebih lanjut, silakan hubungi BKAD Kabupaten Seruyan melalui halaman kontak." } });
      console.log("Updated news: " + item.title);
    }
  }

  const services = await db.service.findMany();
  for (const item of services) {
    if (!item.content) {
      await db.service.update({ where: { id: item.id }, data: { content: item.description + "\n\nLayanan ini mencakup berbagai prosedur dan persyaratan yang perlu dipenuhi. Untuk informasi lebih detail mengenai prosedur, persyaratan, dan mekanisme layanan " + item.title.toLowerCase() + ", silakan hubungi BKAD Kabupaten Seruyan atau kunjungi kantor kami pada jam kerja." } });
      console.log("Updated service: " + item.title);
    }
  }

  const laporanCount = await db.laporan.count();
  if (laporanCount === 0) {
    await db.laporan.createMany({
      data: [
        { name: "Budi Santoso", email: "budi.santoso@email.com", phone: "081234567890", subject: "Pertanyaan tentang Pembayaran PBB", message: "Saya ingin bertanya tentang cara pembayaran PBB secara online.", category: "pajak", status: "selesai" },
        { name: "Siti Aminah", email: "siti.aminah@email.com", phone: "082345678901", subject: "Pengaduan Pelayanan Publik", message: "Saya ingin mengadukan pelayanan yang kurang responsif.", category: "pengaduan", status: "diproses" },
        { name: "Ahmad Ridwan", email: "ahmad.ridwan@email.com", phone: "083456789012", subject: "Permohonan Data Keuangan Daerah", message: "Saya ingin memohon data keuangan daerah untuk penelitian.", category: "keuangan", status: "baru" },
      ],
    });
    console.log("Laporan seeded");
  }

  console.log("All content updated!");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
