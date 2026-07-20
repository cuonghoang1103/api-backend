import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const u = await prisma.user.findUniqueOrThrow({ where: { email: "seed@x.io" } });
  const results = await prisma.$transaction([
    prisma.post.create({ data: { title: "P", authorId: u.id } }),
    prisma.user.update({ where: { id: u.id }, data: { credits: { increment: 5 } } }),
    prisma.user.update({ where: { id: u.id }, data: { credits: { increment: 5 } } }),
  ]);
  console.log("post", results[0].title, "credits", results[2].credits);

  try {
    await prisma.$transaction([
      prisma.user.update({ where: { id: u.id }, data: { credits: { increment: 100 } } }),
      prisma.user.create({ data: { email: "seed@x.io" } }),
    ]);
  } catch {
    const after = await prisma.user.findUniqueOrThrow({ where: { id: u.id } });
    console.log("rolled back credits", after.credits);
  }
}

main().finally(() => prisma.$disconnect());