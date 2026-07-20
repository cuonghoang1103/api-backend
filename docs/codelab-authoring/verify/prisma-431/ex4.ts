import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const a = await prisma.post.updateMany({ where: { published: false }, data: { published: true } });
  console.log("published", a.count);

  const b = await prisma.post.updateMany({ where: { published: false }, data: { published: true } });
  console.log("published", b.count);

  const c = await prisma.post.updateMany({ where: { title: "does-not-exist" }, data: { published: true } });
  console.log("none", c.count);
}

main().finally(() => prisma.$disconnect());