import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  console.log("sql-sensitive", await prisma.post.count({ where: { title: { contains: "SQL" } } }));
  console.log("sql-insensitive", await prisma.post.count({ where: { title: { contains: "sql", mode: "insensitive" } } }));
  const either = await prisma.post.findMany({ where: { OR: [ { title: { startsWith: "Prisma" } }, { title: { endsWith: "Notes" } } ] }, orderBy: { title: "asc" } });
  for (const p of either) console.log(p.title);
}

main().finally(() => prisma.$disconnect());