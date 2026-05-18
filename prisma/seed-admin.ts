import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@bkad.seruyan.go.id' },
  });

  if (!existingAdmin) {
    const hashedPassword = createHash('sha256').update('admin123').digest('hex');
    await prisma.user.create({
      data: {
        name: 'Administrator',
        email: 'admin@bkad.seruyan.go.id',
        password: hashedPassword,
        role: 'superadmin',
      },
    });
    console.log('Default admin user created:');
    console.log('  Email: admin@bkad.seruyan.go.id');
    console.log('  Password: admin123');
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
