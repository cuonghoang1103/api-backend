import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const matched = await prisma.post.findMany({ where: { title: { in: ["Intro to SQL", "Redis Notes", "Nonexistent"] } }, orderBy: { title: "asc" } });
  for (const p of matched) console.log(p.title);
  console.log("nonzero", await prisma.post.count({ where: { views: { not: 0 } } }));
  console.log("keep", await prisma.post.count({ where: { title: { notIn: ["Draft on Prisma", "SQL Advanced"] } } }));
}

main().finally(() => prisma.$disconnect());