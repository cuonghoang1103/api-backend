import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  console.log("noage", await prisma.user.count({ where: { age: null } }));
  const withAge = await prisma.user.findMany({ where: { age: { not: null } }, orderBy: { age: "asc" } });
  for (const u of withAge) console.log(u.name);
  console.log("adults", await prisma.user.count({ where: { age: { gte: 18 } } }));
}

main().finally(() => prisma.$disconnect());