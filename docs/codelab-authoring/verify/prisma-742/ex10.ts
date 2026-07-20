import { PrismaClient, Prisma } from './generated';

const APP_URL = "postgresql://app_user:app@localhost:55432/prisma_codelab";
const owner = new PrismaClient();

const DEFAULT_TAKE = 2;
const MAX_TAKE = 3;

const app = new PrismaClient({ datasources: { db: { url: APP_URL } } })
  .$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          const requested = args.take;
          args.take = requested === undefined || requested <= 0 ? DEFAULT_TAKE : Math.min(requested, MAX_TAKE);
          return query(args);
        },
      },
    },
    result: {
      note: {
        preview: {
          needs: { body: true },
          compute(n) {
            return `${n.body.slice(0, 8)}...`;
          },
        },
      },
    },
  });

// Tenant context is transaction-local so a pooled connection cannot carry it
// into the next request.
async function asTenant<T>(tenantId: number, fn: (tx: typeof app) => Promise<T>): Promise<T> {
  return app.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.tenant', ${String(tenantId)}, true)`;
    return fn(tx as unknown as typeof app);
  });
}

function toSafeError(e: unknown): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return "409 Already exists";
  return "500 Internal error";
}

async function main() {
  console.log("t1", (await asTenant(1, (tx) => tx.note.findMany())).length);
  console.log("t2", (await asTenant(2, (tx) => tx.note.findMany())).length);

  const first = await asTenant(1, (tx) => tx.note.findMany({ orderBy: { title: "asc" } }));
  console.log("preview", first[0].preview);

  console.log("clamped", (await asTenant(1, (tx) => tx.note.findMany({ take: 999999 }))).length);

  const raw = await asTenant(1, async (tx) => {
    const rows = await tx.$queryRaw<{ n: bigint }[]>`SELECT count(*) AS n FROM "Note"`;
    return Number(rows[0].n);
  });
  console.log("rawEscape", raw);

  console.log("crossTenant", (await asTenant(1, (tx) => tx.note.findMany({ where: { title: "N3" } }))).length);

  let deleteDenied = false;
  try {
    await asTenant(1, (tx) => tx.note.delete({ where: { title: "N1" } }));
  } catch (e) {
    deleteDenied = /permission denied/i.test(e instanceof Error ? e.message : "");
  }
  console.log("deleteDenied", deleteDenied);

  // One legitimate write, then a duplicate that must fail with a safe message.
  await asTenant(1, (tx) => tx.note.create({ data: { title: "N9", body: "written under policy", tenantId: 1 } }));
  await owner.auditLog.create({ data: { model: "Note", action: "create", recordId: null } });

  let safeError = "";
  try {
    await asTenant(1, (tx) => tx.note.create({ data: { title: "N9", body: "duplicate", tenantId: 1 } }));
  } catch (e) {
    safeError = toSafeError(e);
  }
  console.log("safeError", safeError);

  console.log("audit", await owner.auditLog.count());
  console.log("notes", await owner.note.count());

  await Promise.all([app.$disconnect(), owner.$disconnect()]);
}

main();