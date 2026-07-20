import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const q1 = await prisma.post.count({ where: { published: true, OR: [ { views: { gte: 150 } }, { title: { contains: "Redis" } } ] } });
  console.log("q1", q1);
  const q2 = await prisma.post.count({ where: { NOT: { published: true }, views: { lt: 25 } } });
  console.log("q2", q2);
  const q3 = await prisma.post.count({ where: { published: true, NOT: { title: { contains: "Prisma" } } } });
  console.log("q3", q3);
}

main().finally(() => prisma.$disconnect());