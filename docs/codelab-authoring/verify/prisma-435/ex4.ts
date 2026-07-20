import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

function render(groups: { _count: number; _sum: { views: number | null } }[]): string {
  return groups.map((g) => `${g._count} ${g._sum.views}`).join(" | ");
}

async function main() {
  const a = await prisma.post.groupBy({
    by: ["authorId"], _count: true, _sum: { views: true }, orderBy: { authorId: "asc" },
  });
  console.log("a:", render(a));

  const b = await prisma.post.groupBy({
    by: ["authorId"], where: { published: true }, _count: true, _sum: { views: true }, orderBy: { authorId: "asc" },
  });
  console.log("b:", render(b));

  const c = await prisma.post.groupBy({
    by: ["authorId"], _count: true, _sum: { views: true },
    having: { views: { _sum: { gt: 100 } } }, orderBy: { authorId: "asc" },
  });
  console.log("c:", render(c));

  const d = await prisma.post.groupBy({
    by: ["authorId"], where: { published: true }, _count: true, _sum: { views: true },
    having: { authorId: { _count: { gt: 1 } } }, orderBy: { authorId: "asc" },
  });
  console.log("d:", render(d));
}

main().finally(() => prisma.$disconnect());