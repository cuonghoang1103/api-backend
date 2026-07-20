import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const dbPosts = async () => (await prisma.post.findMany({
    where: { categories: { some: { name: "Databases" } } },
    orderBy: { title: "asc" },
    select: { title: true },
  })).map((p) => p.title).join(", ");
  console.log("before:", await dbPosts());
  await prisma.post.update({
    where: { title: "Prisma Basics" },
    data: { categories: { disconnect: [{ name: "ORM" }] } },
  });
  await prisma.post.update({
    where: { title: "Redis Notes" },
    data: { categories: { set: [{ name: "Frontend" }] } },
  });
  console.log("after:", await dbPosts());
  console.log("orm", await prisma.post.count({ where: { categories: { some: { name: "ORM" } } } }));
  console.log("categories", await prisma.category.count());
}

main().finally(() => prisma.$disconnect());