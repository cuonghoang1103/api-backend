import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const sorted = await prisma.post.findMany({ orderBy: [{ published: "desc" }, { views: "desc" }] });
  for (const p of sorted) console.log(p.published, p.title);

  const perAuthor = await prisma.post.findMany({ distinct: ["authorId"], orderBy: [{ authorId: "asc" }, { views: "desc" }], include: { author: true } });
  for (const p of perAuthor) console.log(p.author.name, p.title);
}

main().finally(() => prisma.$disconnect());