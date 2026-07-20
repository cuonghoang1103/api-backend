import { PrismaClient, Prisma } from './generated';

const base = new PrismaClient({ log: [{ emit: "event", level: "query" }] });
let queries = 0;
base.$on("query" as never, () => { queries += 1; });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const RETRYABLE = new Set(["P2034", "P1001", "P1017"]);

async function withRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await fn();
    } catch (e) {
      const retryable = e instanceof Prisma.PrismaClientKnownRequestError && RETRYABLE.has(e.code);
      if (!retryable || attempt >= attempts - 1) throw e;
      await sleep(50 * 2 ** attempt + Math.floor(Math.random() * 25));
    }
  }
}

// Process-wide rules: soft delete plus a computed field.
const core = base
  .$extends({
    query: {
      post: {
        async delete({ args }) {
          return base.post.update({ where: args.where, data: { deletedAt: new Date() } });
        },
        async findMany({ args, query }) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
      },
    },
  })
  .$extends({
    result: {
      post: {
        label: {
          needs: { title: true, views: true },
          compute(p) {
            return `${p.title} (${p.views})`;
          },
        },
      },
    },
  });

// Per-request rule, layered on top of the process-wide ones.
function forTenant(tenantId: number) {
  return core.$extends({
    query: {
      post: {
        async findMany({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
      },
    },
    model: {
      post: {
        // Behaviour comes from the query component; the narrowed signature
        // that lets callers omit tenantId has to come from a model method.
        async createScoped(data: Omit<Prisma.PostUncheckedCreateInput, "tenantId">) {
          return core.post.create({ data: { ...data, tenantId } });
        },
      },
    },
  });
}

async function health(): Promise<boolean> {
  const rows = await base.$queryRaw<{ ok: number }[]>`SELECT 1 AS ok`;
  return rows[0].ok === 1;
}

async function main() {
  const db = forTenant(1);

  console.log("visible", (await db.post.findMany()).length);

  await db.post.delete({ where: { title: "P1" } });
  console.log("afterDelete", (await db.post.findMany()).length);
  console.log("stillStored", await base.post.count({ where: { title: "P1" } }));

  const first = (await db.post.findMany({ orderBy: { title: "asc" } }))[0];
  console.log("label", first.label);

  const ann = await base.user.findUniqueOrThrow({ where: { email: "ann@x.io" } });
  await withRetry(() => base.$transaction(async () => {
    await db.post.createScoped({ title: "P6", views: 60, authorId: ann.id });
  }, { isolationLevel: "Serializable" }));
  console.log("created ok");

  await sleep(200);
  console.log("budgetOk", queries < 40);
  console.log("health", await health());

  await base.$disconnect();
}

main();