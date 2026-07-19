import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const published = await prisma.post.findMany({
    where: { published: true },
    select: { title: true, published: true },
    orderBy: { title: "asc" },
  });
  for (const p of published) {
    console.log(p.title);
  }

  const prismaCount = await prisma.post.count({
    where: { title: { contains: "Prisma" } },
  });
  console.log("prisma-count", prismaCount);
}

main().finally(() => prisma.$disconnect());