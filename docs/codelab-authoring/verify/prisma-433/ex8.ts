import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { posts: { where: { published: true } }, comments: true } },
      posts: { orderBy: { views: "desc" }, take: 1, select: { title: true } },
    },
  });
  for (const u of users) {
    console.log(u.name, u._count.posts, u._count.comments, u.posts.length > 0 ? u.posts[0].title : "none");
  }
  const posts = await prisma.post.findMany({
    where: { comments: { some: {} } },
    orderBy: { title: "asc" },
    select: { title: true, _count: { select: { comments: true } } },
  });
  for (const p of posts) console.log(p.title, p._count.comments);
}

main().finally(() => prisma.$disconnect());