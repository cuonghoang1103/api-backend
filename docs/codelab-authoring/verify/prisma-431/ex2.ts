import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const a = await prisma.user.createMany({ data: [{ email: "ann@x.io" }, { email: "bob@x.io" }, { email: "cy@x.io" }] });
  console.log("created", a.count);

  const b = await prisma.user.createMany({ data: [{ email: "ann@x.io" }, { email: "di@x.io" }], skipDuplicates: true });
  console.log("created", b.count);

  console.log("total", await prisma.user.count());
}

main().finally(() => prisma.$disconnect());