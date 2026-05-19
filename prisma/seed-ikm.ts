import { db } from '../src/lib/db';

async function main() {
  // Create IKM Units
  const units = [
    {
      name: 'Sekretariat',
      code: 'SEKRETARIAT',
      description: 'Unit sekretariat BKAD Kabupaten Seruyan',
      headName: 'Dr. H. Ahmad Fauzi, M.Si',
      address: 'Jl. Trans Kalimantan, Kuala Pembuang',
      phone: '(0532) 882123',
      email: 'sekretariat@bkad.seruyankab.go.id',
      active: true,
      order: 1,
    },
    {
      name: 'Bidang Pendapatan',
      code: 'BID-PENDAPATAN',
      description: 'Bidang pengelolaan pendapatan daerah',
      headName: 'Ir. Siti Rahmawati, MM',
      address: 'Jl. Trans Kalimantan, Kuala Pembuang',
      phone: '(0532) 882124',
      email: 'pendapatan@bkad.seruyankab.go.id',
      active: true,
      order: 2,
    },
    {
      name: 'Bidang Belanja',
      code: 'BID-BELANJA',
      description: 'Bidang pengelolaan belanja daerah',
      headName: 'H. Muhammad Rizki, SE',
      address: 'Jl. Trans Kalimantan, Kuala Pembuang',
      phone: '(0532) 882125',
      email: 'belanja@bkad.seruyankab.go.id',
      active: true,
      order: 3,
    },
    {
      name: 'Bidang Aset',
      code: 'BID-ASET',
      description: 'Bidang pengelolaan aset daerah',
      headName: 'Dra. Nurul Hidayah, M.AP',
      address: 'Jl. Trans Kalimantan, Kuala Pembuang',
      phone: '(0532) 882126',
      email: 'aset@bkad.seruyankab.go.id',
      active: true,
      order: 4,
    },
    {
      name: 'Bidang Perbendaharaan',
      code: 'BID-PERBENDAHARAAN',
      description: 'Bidang perbendaharaan dan keuangan daerah',
      headName: 'Andi Pratama, SE., M.Ak',
      address: 'Jl. Trans Kalimantan, Kuala Pembuang',
      phone: '(0532) 882127',
      email: 'bendahara@bkad.seruyankab.go.id',
      active: true,
      order: 5,
    },
    {
      name: 'Layanan Perizinan',
      code: 'LAYANAN-PERIZINAN',
      description: 'Unit layanan perizinan dan administrasi',
      headName: 'Rina Wulandari, S.AP',
      address: 'Jl. Trans Kalimantan, Kuala Pembuang',
      phone: '(0532) 882128',
      email: 'perizinan@bkad.seruyankab.go.id',
      active: true,
      order: 6,
    },
  ];

  for (const unit of units) {
    await db.ikmUnit.upsert({
      where: { code: unit.code },
      update: unit,
      create: unit,
    });
  }

  // Create Active Survey Period
  const now = new Date();
  const year = now.getFullYear();
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  await db.ikmSurveyPeriod.upsert({
    where: { id: 'ikm-period-active-2025' },
    update: {
      title: `Survei Kepuasan Masyarakat Semester 1 Tahun ${year}`,
      period: `S1-${year}`,
      startDate,
      endDate,
      active: true,
      description: `Periode survei kepuasan masyarakat semester 1 tahun ${year} sesuai Permenpan-RB No. 14 Tahun 2017`,
    },
    create: {
      id: 'ikm-period-active-2025',
      title: `Survei Kepuasan Masyarakat Semester 1 Tahun ${year}`,
      period: `S1-${year}`,
      startDate,
      endDate,
      active: true,
      description: `Periode survei kepuasan masyarakat semester 1 tahun ${year} sesuai Permenpan-RB No. 14 Tahun 2017`,
    },
  });

  console.log('✅ IKM seed data created successfully');
  console.log(`  - ${units.length} units created`);
  console.log(`  - 1 active survey period created`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
