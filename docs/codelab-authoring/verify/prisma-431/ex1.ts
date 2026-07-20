import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({ data: { email: "ann@x.io", name: "Ann" } });
  console.log("id", user.id);
  console.log("role", user.role, "credits", user.credits);

  const found = await prisma.user.findUnique({ where: { email: "ann@x.io" } });
  console.log("found", found!.email);
}

main().finally(() => prisma.$disconnect());