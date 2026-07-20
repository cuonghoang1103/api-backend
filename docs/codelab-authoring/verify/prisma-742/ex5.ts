import { PrismaClient, Prisma } from './generated';

const APP_URL = "postgresql://app_user:app@localhost:55432/prisma_codelab";
const app = new PrismaClient({ datasources: { db: { url: APP_URL } } });
const owner = new PrismaClient();

// The tenant context is transaction-local, so it cannot leak to the next
// request that borrows the same pooled connection.
async function asTenant<T>(tenantId: number, fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  return app.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.tenant', ${String(tenantId)}, true)`;
    return fn(tx);
  });
}

async function main() {
  const t1 = await asTenant(1, (tx) => tx.note.findMany({ orderBy: { title: "asc" } }));
  console.log("t1", t1.map((n) => n.title).join(", "));

  const t2 = await asTenant(2, (tx) => tx.note.findMany({ orderBy: { title: "asc" } }));
  console.log("t2", t2.map((n) => n.title).join(", "));

  const rawCount = await asTenant(1, async (tx) => {
    const rows = await tx.$queryRaw<{ n: bigint }[]>`SELECT count(*) AS n FROM "Note"`;
    return Number(rows[0].n);
  });
  console.log("rawCount", rawCount);

  console.log("noContext", await app.note.count());
  console.log("ownerSees", await owner.note.count());

  await Promise.all([app.$disconnect(), owner.$disconnect()]);
}

main();