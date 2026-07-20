import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const ann = await prisma.user.findUniqueOrThrow({ where: { email: "ann@x.io" } });
  const bob = await prisma.user.findUniqueOrThrow({ where: { email: "bob@x.io" } });

  async function transfer(amount: number) {
    return prisma.$transaction(async (tx) => {
      const debit = await tx.user.updateMany({
        where: { id: ann.id, credits: { gte: amount } },
        data: { credits: { decrement: amount } },
      });
      if (debit.count === 0) throw new Error("insufficient funds");
      await tx.user.update({ where: { id: bob.id }, data: { credits: { increment: amount } } });
    });
  }

  await transfer(30);
  let a = await prisma.user.findUniqueOrThrow({ where: { id: ann.id } });
  let b = await prisma.user.findUniqueOrThrow({ where: { id: bob.id } });
  console.log("ann", a.credits, "bob", b.credits);

  try {
    await transfer(1000);
  } catch {
    a = await prisma.user.findUniqueOrThrow({ where: { id: ann.id } });
    b = await prisma.user.findUniqueOrThrow({ where: { id: bob.id } });
    console.log("blocked ann", a.credits, "bob", b.credits);
  }
}

main().finally(() => prisma.$disconnect());