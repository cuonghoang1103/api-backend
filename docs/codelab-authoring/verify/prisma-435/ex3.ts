import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

async function main() {
  const byAuthor = await prisma.post.groupBy({ by: ["authorId"], _count: true, _sum: { views: true }, _max: { views: true }, orderBy: { authorId: "asc" } });
  console.log(byAuthor.map((g) => `${g._count} ${g._sum.views} ${g._max.views}`).join(" | "));
  const byStatus = await prisma.post.groupBy({ by: ["published"], _count: true, _avg: { views: true }, orderBy: { published: "asc" } });
  console.log(byStatus.map((g) => `${g.published} ${g._count} ${(g._avg.views ?? 0).toFixed(2)}`).join(" | "));
  const ranked = await prisma.post.groupBy({ by: ["authorId"], _sum: { views: true }, orderBy: { _sum: { views: "desc" } } });
  console.log("top", ranked[0]._sum.views);
}

main().finally(() => prisma.$disconnect());