import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const counts = async () => [await prisma.comment.count(), await prisma.post.count(), await prisma.user.count()];
  let [c, p] = await counts();
  console.log("start", c, p);
  await prisma.post.update({
    where: { title: "Intro to SQL" },
    data: { comments: { deleteMany: { body: "Thanks" } } },
  });
  [c] = await counts();
  console.log("afterNested", c);
  await prisma.post.delete({ where: { title: "Intro to SQL" } });
  [c, p] = await counts();
  console.log("afterCascade", c, p);
  await prisma.user.delete({ where: { email: "bob@x.io" } });
  const [c2, p2, u2] = await counts();
  console.log("afterUser", c2, p2, u2);
}

main().finally(() => prisma.$disconnect());