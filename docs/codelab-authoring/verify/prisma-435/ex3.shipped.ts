import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

async function main() {
  const byAuthor = await prisma.post.groupBy({
    by: ["authorId"],
    _count: true,
    _sum: { views: true },
    _max: { views: true },
    orderBy: { authorId: "asc" },
  });
  for (const g of byAuthor) console.log(g.authorId, g._count, g._sum.views, g._max.views);

  const byStatus = await prisma.post.groupBy({
    by: ["published"],
    _count: true,
    _avg: { views: true },
    orderBy: { published: "asc" },
  });
  for (const g of byStatus) console.log(g.published, g._count, "avg", (g._avg.views ?? 0).toFixed(2));

  const ranked = await prisma.post.groupBy({
    by: ["authorId"],
    _sum: { views: true },
    orderBy: { _sum: { views: "desc" } },
  });
  console.log("top", ranked[0].authorId, ranked[0]._sum.views);
}

main().finally(() => prisma.$disconnect());