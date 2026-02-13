import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('Admin123456', 12);

  const users = [
    {
      email: 'direccion@erp.com',
      name: 'Direccion',
      role: Role.DIRECCION,
    },
    {
      email: 'admin@erp.com',
      name: 'Administrativo',
      role: Role.ADMINISTRATIVO,
    },
    {
      email: 'operador@erp.com',
      name: 'Operador',
      role: Role.OPERATIVO,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        isActive: true,
      },
      create: {
        email: user.email,
        name: user.name,
        passwordHash,
        role: user.role,
      },
    });

    console.log(`✔ Usuario ${user.email} listo con rol ${user.role}`);
  }

  console.log('\n🚀 Seed completado correctamente\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
