import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.post.findFirstOrThrow();
  for (let i = 0; i < 3; i++) {
    await prisma.post.update({ where: { id: p.id }, data: { views: { increment: 1 } } });
  }
  const afterViews = await prisma.post.findUniqueOrThrow({ where: { id: p.id } });
  console.log("views", afterViews.views);

  const u = await prisma.user.update({ where: { email: "seed@x.io" }, data: { credits: { decrement: 30 } } });
  console.log("credits", u.credits);

  await prisma.post.updateMany({ data: { views: { increment: 10 } } });
  const finalPost = await prisma.post.findUniqueOrThrow({ where: { id: p.id } });
  console.log("views", finalPost.views);
}

main().finally(() => prisma.$disconnect());