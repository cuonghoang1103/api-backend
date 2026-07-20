import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  for (let page = 0; page < 3; page++) {
    const rows = await prisma.post.findMany({ orderBy: { views: "desc" }, skip: page * 2, take: 2 });
    console.log("page", page + 1);
    for (const r of rows) console.log(r.title);
  }
}

main().finally(() => prisma.$disconnect());