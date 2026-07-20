import { PrismaClient, Prisma } from './generated';

const APP = "codelab_pool";
const pooled = new PrismaClient({
  datasources: { db: { url: "postgresql://postgres:x@localhost:55432/prisma_codelab?connection_limit=2&application_name=" + APP } },
});
const observer = new PrismaClient();

async function connections(): Promise<number> {
  const rows = await observer.$queryRaw<{ n: bigint }[]>`
    SELECT count(*) AS n FROM pg_stat_activity WHERE application_name = ${APP}`;
  return Number(rows[0].n);
}

async function main() {
  // pg_sleep returns void, which the client cannot deserialise — cast it.
  const work = Array.from({ length: 6 }, () =>
    pooled.$queryRaw<{ s: string }[]>`SELECT pg_sleep(0.4)::text AS s`);

  // A PrismaPromise is LAZY: nothing is sent until it is awaited or chained.
  // Kick them all off first, otherwise the sample below measures an idle pool.
  const running = Promise.all(work);

  const sample = new Promise<number>((resolve) => {
    setTimeout(() => { void connections().then(resolve); }, 250);
  });

  const busy = await sample;
  const done = await running;
  console.log("busy", busy);
  console.log("completed", done.length);

  await pooled.$disconnect();
  await new Promise((r) => setTimeout(r, 200));
  console.log("idle", await connections());
  await observer.$disconnect();
}

main();