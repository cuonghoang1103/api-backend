import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

async function main() {
  console.log("rows", await prisma.post.count());
  const c = await prisma.post.count({ select: { _all: true, rating: true } });
  console.log("all", c._all);
  console.log("rated", c.rating);
  console.log("unrated", c._all - c.rating);
  console.log("published", await prisma.post.count({ where: { published: true } }));
  const authors = await prisma.post.groupBy({ by: ["authorId"] });
  console.log("authors", authors.length);
  console.log("nullRating", await prisma.post.count({ where: { rating: null } }));
}

main().finally(() => prisma.$disconnect());