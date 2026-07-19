import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({ data: { email: "ann@x.io", name: "Ann" } });
  await prisma.user.create({ data: { email: "bob@x.io" } });

  const users = await prisma.user.findMany({ orderBy: { email: "asc" } });
  console.log("count", users.length);
  for (const u of users) {
    console.log(u.email, u.role);
  }
}

main().finally(() => prisma.$disconnect());