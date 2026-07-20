import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

type Row = { name: string; posts: number; sum: number };
const render = (rows: Row[]) => rows.map((r) => `${r.name} ${r.posts} ${r.sum}`).join(" | ");

async function main() {
  const groups = await prisma.post.groupBy({
    by: ["authorId"],
    where: { published: true },
    _count: true,
    _sum: { views: true },
    orderBy: { _sum: { views: "desc" } },
  });
  const users = await prisma.user.findMany({
    where: { id: { in: groups.map((g) => g.authorId) } },
    select: { id: true, name: true },
  });
  const nameById = new Map(users.map((u) => [u.id, u.name]));
  const clientRows: Row[] = groups.map((g) => ({
    name: nameById.get(g.authorId) ?? "unknown",
    posts: g._count,
    sum: g._sum.views ?? 0,
  }));
  console.log("a:", render(clientRows));

  const rawRows = await prisma.$queryRaw<Row[]>`
    SELECT u.name, COUNT(p.id)::int AS posts, COALESCE(SUM(p.views), 0)::int AS sum
    FROM "User" u JOIN "Post" p ON p."authorId" = u.id
    WHERE p.published = true
    GROUP BY u.id, u.name
    ORDER BY SUM(p.views) DESC`;
  console.log("b:", render(rawRows));

  console.log("match", render(clientRows) === render(rawRows));
}

main().finally(() => prisma.$disconnect());