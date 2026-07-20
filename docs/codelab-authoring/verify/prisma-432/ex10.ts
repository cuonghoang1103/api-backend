import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const term = "s";
  const pageSize = 2;
  const where = { published: true, title: { contains: term, mode: "insensitive" as const } };
  const [rows, total] = await prisma.$transaction([
    prisma.post.findMany({ where, orderBy: { views: "desc" }, take: pageSize, skip: 0 }),
    prisma.post.count({ where }),
  ]);
  for (const r of rows) console.log(r.title);
  console.log("total", total);
  console.log("pages", Math.ceil(total / pageSize));
}

main().finally(() => prisma.$disconnect());