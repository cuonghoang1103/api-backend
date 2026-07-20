import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.account.create({ data: { owner: "slow", balance: 1 } });
      await sleep(600); // a third-party call, in the worst possible place
      await tx.account.update({ where: { owner: "main" }, data: { balance: 999 } });
    }, { timeout: 300 });
    console.log("timedOut none");
  } catch (e) {
    console.log("timedOut", e instanceof Prisma.PrismaClientKnownRequestError ? e.code : "other");
  }
  console.log("rolledBack", await prisma.account.count({ where: { owner: "slow" } }));

  // The same work, restructured: slow part first, transaction only for writes.
  await sleep(600);
  const amount = 50;
  await prisma.$transaction(async (tx) => {
    const acc = await tx.account.findUniqueOrThrow({ where: { owner: "main" } });
    await tx.account.update({ where: { id: acc.id }, data: { balance: acc.balance + amount } });
  }, { timeout: 2000 });
  console.log("fast ok");
  console.log("balance", (await prisma.account.findUniqueOrThrow({ where: { owner: "main" } })).balance);

  await prisma.$transaction(async (tx) => { await tx.account.count(); }, { maxWait: 50, timeout: 2000 });
  console.log("maxWait ok");
}

main().finally(() => prisma.$disconnect());