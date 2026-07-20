import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 3; i++) {
    const u = await prisma.user.upsert({
      where: { email: "ann@x.io" },
      create: { email: "ann@x.io", credits: 10 },
      update: { credits: { increment: 5 } },
    });
    console.log("credits", u.credits);
  }
}

main().finally(() => prisma.$disconnect());