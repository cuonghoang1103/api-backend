import { PrismaClient, Prisma } from './generated';

const prisma = new PrismaClient({ log: [{ emit: "event", level: "query" }] });
let count = 0;
prisma.$on("query" as never, () => { count += 1; });
const flush = () => new Promise((r) => setTimeout(r, 150));

async function main() {
  await flush();

  // 1. the N+1 shape: one query for parents, then one per parent
  count = 0;
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
  let loopPosts = 0;
  for (const u of users) {
    const posts = await prisma.post.findMany({ where: { authorId: u.id } });
    loopPosts += posts.length;
  }
  await flush();
  console.log("loop", count);

  // 2. include: one query per relation level
  count = 0;
  const withPosts = await prisma.user.findMany({ include: { posts: true } });
  const includePosts = withPosts.reduce((n, u) => n + u.posts.length, 0);
  await flush();
  console.log("include", count);

  // 3. manual batching: collect ids, one in query, group in memory
  count = 0;
  const ids = (await prisma.user.findMany({ select: { id: true } })).map((u) => u.id);
  const posts = await prisma.post.findMany({ where: { authorId: { in: ids } } });
  const byAuthor = new Map<number, number>();
  for (const p of posts) byAuthor.set(p.authorId, (byAuthor.get(p.authorId) ?? 0) + 1);
  await flush();
  const batchedCount = count;
  console.log("batched", batchedCount);

  console.log("sameData", loopPosts === includePosts && includePosts === posts.length);
  console.log("budget", batchedCount <= 2 ? "ok" : "over");

  await prisma.$disconnect();
}

main();