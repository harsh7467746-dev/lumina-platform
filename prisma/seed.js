const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123456', 12);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { passwordHash: hash, role: 'OWNER' },
    create: {
      username: 'admin',
      displayName: 'System Admin',
      email: 'admin@lumina.io',
      passwordHash: hash,
      role: 'OWNER',
      status: 'ONLINE',
    },
  });

  await prisma.user.upsert({
    where: { username: 'harsh' },
    update: { passwordHash: hash, role: 'OWNER' },
    create: {
      username: 'harsh',
      displayName: 'Harsh (Platform Owner)',
      email: 'harsh@lumina.io',
      passwordHash: hash,
      role: 'OWNER',
      status: 'ONLINE',
    },
  });

  console.log('[Lumina Seed] Admin accounts successfully prepared.');
}

main()
  .catch((e) => {
    console.error('[Lumina Seed] Warning:', e.message);
  })
  .finally(() => prisma.$disconnect());
