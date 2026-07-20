import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const RETRYABLE = new Set(["P2034", "P1001", "P1017"]);

let attemptsUsed = 0;
let retriedAtLeastOnce = false;

async function withRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    attemptsUsed += 1;
    try {
      return await fn();
    } catch (e) {
      const retryable = e instanceof Prisma.PrismaClientKnownRequestError && RETRYABLE.has(e.code);
      if (!retryable || attempt >= attempts - 1) throw e;
      retriedAtLeastOnce = true;
      // Exponential backoff with jitter: 50, 100, 200 ms plus a little noise so
      // many clients recovering from the same blip do not resynchronise.
      await sleep(50 * 2 ** attempt + Math.floor(Math.random() * 25));
    }
  }
}

function sumThenInsert(tag: string) {
  return prisma.$transaction(async (tx) => {
    const rows = await tx.account.findMany();
    const total = rows.reduce((n, r) => n + r.balance, 0);
    await sleep(120);
    await tx.account.create({ data: { owner: tag, balance: total } });
  }, { isolationLevel: "Serializable" });
}

async function main() {
  const results = await Promise.allSettled([
    withRetry(() => sumThenInsert("retry-a")),
    withRetry(() => sumThenInsert("retry-b")),
  ]);
  console.log("completed", results.filter((r) => r.status === "fulfilled").length);
  console.log("retried", retriedAtLeastOnce);
  console.log("accounts", await prisma.account.count());

  attemptsUsed = 0;
  try {
    await withRetry(() => prisma.user.create({ data: { email: "ann@x.io", name: "Clone", tenantId: 1 } }));
    console.log("duplicate none");
  } catch (e) {
    console.log("duplicate", e instanceof Prisma.PrismaClientKnownRequestError ? e.code : "other");
  }
  console.log("attemptsUsed", attemptsUsed);
}

main().finally(() => prisma.$disconnect());