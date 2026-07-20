import { PrismaClient, Prisma, Role } from './generated';
const prisma = new PrismaClient();

type Page<R> = { rows: R[]; total: number; page: number; pages: number };

async function paginate<R>(
  source: { findMany: (skip: number, take: number) => Promise<R[]>; count: () => Promise<number> },
  page: number,
  pageSize: number,
): Promise<Page<R>> {
  const [rows, total] = await Promise.all([
    source.findMany((page - 1) * pageSize, pageSize),
    source.count(),
  ]);
  return { rows, total, page, pages: Math.ceil(total / pageSize) };
}

async function main() {
  const postWhere = { published: true };
  const posts = await paginate(
    {
      findMany: (skip, take) => prisma.post.findMany({
        where: postWhere, orderBy: { views: "desc" }, select: { title: true }, skip, take,
      }),
      count: () => prisma.post.count({ where: postWhere }),
    },
    1,
    2,
  );
  for (const row of posts.rows) console.log(row.title);
  console.log("total", posts.total, "pages", posts.pages);

  const users = await paginate(
    {
      findMany: (skip, take) => prisma.user.findMany({
        orderBy: { name: "asc" }, include: { profile: true }, skip, take,
      }),
      count: () => prisma.user.count(),
    },
    2,
    2,
  );
  for (const row of users.rows) console.log(row.name, row.profile === null ? "-" : row.profile.bio);
  console.log("total", users.total, "pages", users.pages);
}

main().finally(() => prisma.$disconnect());