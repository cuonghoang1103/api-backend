import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

async function main() {
  const groups = await prisma.post.groupBy({
    by: ["authorId", "published"],
    _count: { _all: true, rating: true },
    _avg: { rating: true },
    orderBy: [{ authorId: "asc" }, { published: "asc" }],
  });
  for (const g of groups) {
    const avg = g._avg.rating === null ? "-" : g._avg.rating.toFixed(2);
    console.log(g.published, g._count._all, g._count.rating, avg);
  }
  console.log("groups", groups.length);

  const overall = await prisma.post.aggregate({
    _sum: { rating: true },
    _avg: { rating: true },
    _count: { _all: true },
  });
  const naive = (overall._sum.rating ?? 0) / overall._count._all;
  console.log("naive", naive.toFixed(2));
  console.log("correct", (overall._avg.rating ?? 0).toFixed(2));
}

main().finally(() => prisma.$disconnect());