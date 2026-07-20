import { PrismaClient, Prisma, Role } from './generated';
const prisma = new PrismaClient();

function classify(e: unknown): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") {
      const target = e.meta && e.meta.target;
      const fields = Array.isArray(target) ? target.join(", ") : String(target);
      return `P2002 on ${fields}`;
    }
    if (e.code === "P2025") return "P2025";
    return `known ${e.code}`;
  }
  return "other";
}

async function main() {
  try {
    await prisma.user.create({ data: { email: "ann@x.io", name: "Clone" } });
  } catch (e) {
    console.log("dup", classify(e));
  }
  try {
    await prisma.user.update({ where: { email: "ghost@x.io" }, data: { name: "Ghost" } });
  } catch (e) {
    console.log("missing", classify(e));
  }
  console.log("safe", await prisma.user.findUnique({ where: { email: "ghost@x.io" } }));
  console.log("users", await prisma.user.count());
}

main().finally(() => prisma.$disconnect());