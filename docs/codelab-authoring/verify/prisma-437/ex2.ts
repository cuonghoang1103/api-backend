import { PrismaClient, Prisma } from './generated';

const prisma = new PrismaClient({ log: [{ emit: "event", level: "query" }] });

type QueryEvent = { query: string; params: string; duration: number };
let count = 0;
let last: QueryEvent | null = null;
prisma.$on("query" as never, (e: QueryEvent) => {
  count += 1;
  last = e;
});

const flush = () => new Promise((r) => setTimeout(r, 150));

async function main() {
  await flush();

  count = 0;
  await prisma.user.findMany();
  await flush();
  console.log("plain", count);

  count = 0;
  await prisma.user.findMany({ include: { posts: true } });
  await flush();
  console.log("include", count);

  count = 0;
  await prisma.post.findMany({ where: { views: { gt: 15 } } });
  await flush();
  const seen: QueryEvent | null = last;
  console.log("hasDuration", seen !== null && typeof seen.duration === "number");
  console.log("hasParams", seen !== null && seen.params.length > 0 && !seen.query.includes("15"));
  console.log("slow", seen !== null && seen.duration > 5000 ? 1 : 0);

  await prisma.$disconnect();
}

main();