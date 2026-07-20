import { PrismaClient, Prisma } from './generated';

const APP = "codelab_singleton";
const URL = "postgresql://postgres:x@localhost:55432/prisma_codelab?application_name=" + APP;

// One client per process. The globalThis cache survives dev hot reloads,
// which would otherwise leak a new connection pool on every file save.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getClient(): PrismaClient {
  const client = globalForPrisma.prisma ?? new PrismaClient({ datasources: { db: { url: URL } } });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

async function connectionCount(client: PrismaClient): Promise<number> {
  const rows = await client.$queryRaw<{ n: bigint }[]>`
    SELECT count(*) AS n FROM pg_stat_activity WHERE application_name = ${APP}`;
  return Number(rows[0].n);
}

async function main() {
  const first = getClient();
  const second = getClient();
  console.log("same", first === second);

  // Nothing is connected yet — but ask through a SECOND client, because
  // querying through this one would itself open the connection.
  const probe = new PrismaClient();
  const before = await probe.$queryRaw<{ n: bigint }[]>`
    SELECT count(*) AS n FROM pg_stat_activity WHERE application_name = ${APP}`;
  console.log("connections", Number(before[0].n));

  console.log("users", await first.user.count());
  await first.$disconnect();
  console.log("afterDisconnect", await first.user.count());

  process.on("SIGTERM", () => { void first.$disconnect(); });
  console.log("hook", process.listenerCount("SIGTERM"));

  await probe.$disconnect();
  await first.$disconnect();
}

main();