import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

type Bucket = { month: Date; count: number; sum: number };
const fmt = (b: Bucket) => `${b.month.toISOString().slice(0, 7)} ${b.count} ${b.sum}`;

async function main() {
  const buckets = await prisma.$queryRaw<Bucket[]>`
    SELECT date_trunc('month', "createdAt") AS month,
           COUNT(*)::int AS count,
           COALESCE(SUM(views), 0)::int AS sum
    FROM "Post"
    GROUP BY 1 ORDER BY 1 ASC`;
  for (const b of buckets) console.log(fmt(b));

  const minViews = 100;
  const hot = await prisma.$queryRaw<Bucket[]>`
    SELECT date_trunc('month', "createdAt") AS month,
           COUNT(*)::int AS count,
           COALESCE(SUM(views), 0)::int AS sum
    FROM "Post"
    WHERE views >= ${minViews}
    GROUP BY 1 ORDER BY 1 ASC`;
  console.log("hot:", hot.map(fmt).join(" | "));

  const totalFromBuckets = buckets.reduce((n, b) => n + b.count, 0);
  console.log("check", totalFromBuckets, await prisma.post.count());
}

main().finally(() => prisma.$disconnect());