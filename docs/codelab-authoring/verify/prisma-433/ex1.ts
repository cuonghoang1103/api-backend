import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
    include: { profile: true, posts: { select: { title: true }, orderBy: { title: "asc" } } },
  });
  for (const u of users) console.log(u.email, u.profile ? u.profile.bio : "none", u.posts.length);
  const post = await prisma.post.findUnique({
    where: { title: "Prisma Basics" },
    include: { author: { include: { profile: true } } },
  });
  if (post) console.log(post.title, post.author.name, post.author.profile ? post.author.profile.bio : "none");
}

main().finally(() => prisma.$disconnect());