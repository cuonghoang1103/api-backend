import { PrismaClient, Prisma } from './generated';

const prisma = new PrismaClient({ log: [{ emit: "event", level: "query" }] });

type QueryEvent = { query: string; params: string; duration: number };
const durations: number[] = [];
prisma.$on("query" as never, (e: QueryEvent) => { durations.push(e.duration); });
const flush = () => new Promise((r) => setTimeout(r, 200));
const SLOW_MS = 200;

async function main() {
  await prisma.user.count();
  await prisma.note.findMany({ take: 2 });
  // pg_sleep returns void, which the client cannot deserialise — cast it.
  await prisma.$queryRaw`SELECT pg_sleep(0.3)::text AS s`;
  await flush();

  const metrics = await prisma.$metrics.json();
  const queryCounter = metrics.counters.find((c) => c.key === "prisma_client_queries_total");
  console.log("hasQueryCounter", queryCounter !== undefined);
  console.log("queriesRan", (queryCounter?.value ?? 0) > 0);

  const busy = metrics.gauges.find((g) => g.key === "prisma_pool_connections_busy");
  console.log("hasPoolGauge", busy !== undefined);

  const slow = durations.filter((d) => d > SLOW_MS);
  console.log("slow", slow.length);
  console.log("slowest", Math.max(...durations) > SLOW_MS ? "ok" : "under");

  const text = await prisma.$metrics.prometheus();
  console.log("prometheus", text.includes("prisma_client_queries_total"));

  await prisma.$disconnect();
}

main();