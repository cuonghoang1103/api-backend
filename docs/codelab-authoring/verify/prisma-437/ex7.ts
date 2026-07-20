import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Read a set, derive a value from it, write a row back — the shape that is
// unsafe at Read Committed because neither transaction sees the other's insert.
function sumThenInsert(tag: string) {
  return prisma.$transaction(async (tx) => {
    const rows = await tx.account.findMany();
    const total = rows.reduce((n, r) => n + r.balance, 0);
    await sleep(120);
    await tx.account.create({ data: { owner: tag, balance: total } });
  }, { isolationLevel: "Serializable" });
}

async function main() {
  const results = await Promise.allSettled([sumThenInsert("snapshot-a"), sumThenInsert("snapshot-b")]);
  let conflicts = 0;
  let committed = 0;
  for (const r of results) {
    if (r.status === "fulfilled") committed += 1;
    else if (r.reason instanceof Prisma.PrismaClientKnownRequestError && r.reason.code === "P2034") conflicts += 1;
  }
  console.log("conflicts", conflicts);
  console.log("committed", committed);
  console.log("accounts", await prisma.account.count());

  // Where the new value depends only on the old value of ONE row, no
  // transaction is needed: the database does the arithmetic atomically.
  await Promise.all([
    prisma.account.update({ where: { owner: "main" }, data: { balance: { increment: 10 } } }),
    prisma.account.update({ where: { owner: "main" }, data: { balance: { increment: 10 } } }),
  ]);
  console.log("atomic", (await prisma.account.findUniqueOrThrow({ where: { owner: "main" } })).balance);
}

main().finally(() => prisma.$disconnect());