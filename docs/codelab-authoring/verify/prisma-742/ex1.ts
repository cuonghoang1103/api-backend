import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

// One allowlist, used by every public read. Adding a sensitive column to the
// schema later cannot leak through these queries.
const publicUser = { select: { id: true, email: true, name: true } };

async function main() {
  const raw = await prisma.user.findFirstOrThrow({ orderBy: { email: "asc" } });
  console.log("defaultKeys", Object.keys(raw).sort().join(", "));
  console.log("leaksHash", Object.keys(raw).includes("passwordHash"));

  const users = await prisma.user.findMany({ ...publicUser, orderBy: { email: "asc" } });
  console.log("safeKeys", Object.keys(users[0]).sort().join(", "));
  console.log("count", users.length);
  console.log("hashOnSafe", Object.keys(users[0]).includes("passwordHash"));
}

main().finally(() => prisma.$disconnect());