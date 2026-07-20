import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

type Ranked = { title: string; name: string; views: number; rank: number };

async function main() {
  const ranked = await prisma.$queryRaw<Ranked[]>`
    SELECT p.title, u.name, p.views,
           ROW_NUMBER() OVER (PARTITION BY p."authorId" ORDER BY p.views DESC)::int AS rank
    FROM "Post" p JOIN "User" u ON u.id = p."authorId"
    ORDER BY u.name ASC, rank ASC`;
  for (const r of ranked) console.log(r.name, r.rank, r.title, r.views);

  const top2 = await prisma.$queryRaw<Ranked[]>`
    SELECT * FROM (
      SELECT p.title, u.name, p.views,
             ROW_NUMBER() OVER (PARTITION BY p."authorId" ORDER BY p.views DESC)::int AS rank
      FROM "Post" p JOIN "User" u ON u.id = p."authorId"
    ) t
    WHERE t.rank <= 2
    ORDER BY t.name ASC, t.rank ASC`;
  console.log("top2:", top2.map((r) => `${r.name} ${r.title}`).join(" | "));

  const running = await prisma.$queryRaw<{ total: number }[]>`
    SELECT SUM(p.views) OVER (ORDER BY p.id)::int AS total
    FROM "Post" p ORDER BY p.id`;
  console.log("running:", running.map((r) => r.total).join(", "));
}

main().finally(() => prisma.$disconnect());