import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const a = await prisma.post.findFirstOrThrow({ where: { title: "A" } });
  const del = await prisma.post.delete({ where: { id: a.id } });
  console.log("deleted", del.title);

  const m = await prisma.post.deleteMany({ where: { published: false } });
  console.log("removed", m.count);

  const m2 = await prisma.post.deleteMany({ where: { published: false } });
  console.log("removed", m2.count);

  console.log("remaining", await prisma.post.count());
}

main().finally(() => prisma.$disconnect());