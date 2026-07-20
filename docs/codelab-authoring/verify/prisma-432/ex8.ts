import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  // Page 1: no cursor yet.
  let rows = await prisma.post.findMany({ orderBy: { id: "asc" }, take: 2 });
  console.log("page 1");
  for (const r of rows) console.log(r.title);
  let cursor = rows[rows.length - 1].id;

  // Pages 2 and 3: resume after the last id we saw.
  for (let page = 2; page <= 3; page++) {
    rows = await prisma.post.findMany({ orderBy: { id: "asc" }, take: 2, cursor: { id: cursor }, skip: 1 });
    console.log("page", page);
    for (const r of rows) console.log(r.title);
    cursor = rows[rows.length - 1].id;
  }
}

main().finally(() => prisma.$disconnect());