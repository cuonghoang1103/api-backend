import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

async function main() {
  const filled = await prisma.post.updateMany({ where: { rating: null }, data: { rating: 3 } });
  console.log("filled", filled.count);

  const bumped = await prisma.$executeRaw`
    UPDATE "Post" SET views = ROUND(views * 1.1) WHERE published = true`;
  console.log("bumped", bumped);

  const total = await prisma.post.aggregate({ _sum: { views: true } });
  console.log("sum", total._sum.views);

  const incremented = await prisma.post.updateMany({
    where: { published: false },
    data: { views: { increment: 5 } },
  });
  console.log("incremented", incremented.count);
  const drafts = await prisma.post.findMany({
    where: { published: false }, orderBy: { title: "asc" }, select: { views: true },
  });
  console.log("drafts", drafts.map((d) => d.views).join(", "));
}

main().finally(() => prisma.$disconnect());