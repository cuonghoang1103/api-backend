import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const u1 = await prisma.user.update({ where: { email: "ann@x.io" }, data: { name: "Annabelle", role: "ADMIN" } });
  console.log(u1.name, u1.role);

  const u2 = await prisma.user.update({ where: { email: "ann@x.io" }, data: { credits: 50 } });
  console.log("name kept", u2.name, "credits", u2.credits);
}

main().finally(() => prisma.$disconnect());