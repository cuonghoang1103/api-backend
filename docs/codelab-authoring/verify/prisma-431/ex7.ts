import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const first = await prisma.post.findFirst({ where: { published: true }, orderBy: { id: "desc" } });
  console.log("first", first!.title);

  const missing = await prisma.post.findUnique({ where: { id: 9999 } });
  console.log("missing is", missing === null ? "null" : "found");

  try {
    await prisma.post.findUniqueOrThrow({ where: { id: 9999 } });
    console.log("no throw");
  } catch {
    console.log("threw");
  }
}

main().finally(() => prisma.$disconnect());