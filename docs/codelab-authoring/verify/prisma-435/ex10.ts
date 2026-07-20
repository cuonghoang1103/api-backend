import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

type Median = { median: number };
type Bucket = { bucket: string; count: number };

async function main() {
  const [totals, leaders, medianRows, buckets] = await prisma.$transaction([
    prisma.post.aggregate({
      where: { published: true },
      _count: true,
      _sum: { views: true },
      _avg: { views: true },
    }),
    prisma.post.groupBy({
      by: ["authorId"],
      where: { published: true },
      _sum: { views: true },
      having: { views: { _sum: { gte: 300 } } },
      orderBy: { _sum: { views: "desc" } },
    }),
    prisma.$queryRaw<Median[]>`
      SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY views)::float AS median
      FROM "Post" WHERE published = true`,
    prisma.$queryRaw<Bucket[]>`
      SELECT CASE WHEN views < 100 THEN 'low' ELSE 'high' END AS bucket,
             COUNT(*)::int AS count
      FROM "Post" WHERE published = true
      GROUP BY 1 ORDER BY 1`,
  ]);

  console.log("posts", totals._count);
  console.log("views", totals._sum.views);
  console.log("avg", (totals._avg.views ?? 0).toFixed(2));
  console.log("median", (medianRows[0].median ?? 0).toFixed(2));
  console.log("leaders", leaders.length);
  // With having, Prisma types the aggregate keys as optional — read them defensively.
  console.log("leaderSums", leaders.map((l) => l._sum?.views ?? 0).join(", "));
  console.log("buckets", buckets.map((b) => `${b.bucket}=${b.count}`).join(", "));
}

main().finally(() => prisma.$disconnect());