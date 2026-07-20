import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

async function main() {
  const stats = await prisma.post.aggregate({
    where: { published: true },
    _count: true,
    _sum: { views: true },
    _avg: { views: true },
    _min: { views: true },
    _max: { views: true },
  });
  console.log("count", stats._count);
  console.log("sum", stats._sum.views);
  console.log("avg", (stats._avg.views ?? 0).toFixed(2));
  console.log("min", stats._min.views);
  console.log("max", stats._max.views);
  const all = await prisma.post.aggregate({ _sum: { views: true } });
  console.log("allSum", all._sum.views);
}

main().finally(() => prisma.$disconnect());