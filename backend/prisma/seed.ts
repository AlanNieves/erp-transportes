import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@erp.com';

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log('Admin already exists');
    return;
  }

  const passwordHash = await bcrypt.hash('Admin123456', 12);

  await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'Administrador',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log('Admin creado');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
