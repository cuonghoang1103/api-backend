import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const hot = await prisma.post.findMany({ where: { published: true, views: { gt: 100 } }, orderBy: { views: "asc" }, select: { title: true } });
  for (const p of hot) console.log(p.title);
  const low = await prisma.post.count({ where: { views: { lte: 80 } } });
  console.log("lowviews", low);
}

main().finally(() => prisma.$disconnect());