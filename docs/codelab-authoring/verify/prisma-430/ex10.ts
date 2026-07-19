import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "author@x.io",
      posts: {
        create: [
          { title: "First", comments: { create: { text: "Nice" } } },
          { title: "Second" },
        ],
      },
    },
  });

  const full = await prisma.user.findUnique({
    where: { id: user.id },
    include: { posts: { include: { comments: true } } },
  });

  console.log(full!.email);
  console.log("posts", full!.posts.length);
  console.log("comment", full!.posts[0].comments[0].text);
}

main().finally(() => prisma.$disconnect());