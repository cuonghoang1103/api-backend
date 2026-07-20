import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.create({
    data: {
      title: "Indexing Deep Dive",
      published: true,
      views: 60,
      author: { connect: { email: "ann@x.io" } },
      categories: { connectOrCreate: [
        { where: { name: "Databases" }, create: { name: "Databases" } },
        { where: { name: "Performance" }, create: { name: "Performance" } },
      ]},
    },
    include: { author: true, categories: { orderBy: { name: "asc" } } },
  });
  console.log(post.title, post.author.name);
  console.log(post.categories.map((c) => c.name).join(", "));
  console.log("categories", await prisma.category.count());
}

main().finally(() => prisma.$disconnect());