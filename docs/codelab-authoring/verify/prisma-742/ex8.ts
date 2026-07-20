import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

type SafeError = { status: number; message: string };

const internalLog: string[] = [];

function toSafeError(e: unknown, correlationId: string): SafeError {
  // The full detail goes to the log, where operators can see it.
  internalLog.push(`[${correlationId}] ${e instanceof Error ? e.message : String(e)}`);

  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") return { status: 409, message: `Already exists [${correlationId}]` };
    if (e.code === "P2025") return { status: 404, message: `Not found [${correlationId}]` };
  }
  // Messages are built from constants — nothing from the request is echoed back.
  return { status: 500, message: `Internal error [${correlationId}]` };
}

async function main() {
  let rawMessage = "";
  let dup: SafeError = { status: 0, message: "" };
  try {
    await prisma.user.create({ data: { email: "ann@x.io", name: "Clone", passwordHash: "x", tenantId: 1 } });
  } catch (e) {
    rawMessage = e instanceof Error ? e.message : String(e);
    dup = toSafeError(e, "req-1");
  }
  console.log("dup", dup.status, dup.message);
  console.log("leaksEmail", dup.message.includes("ann@x.io"));
  console.log("rawLeaks", rawMessage.includes("email"));

  let missing: SafeError = { status: 0, message: "" };
  try {
    await prisma.user.update({ where: { email: "ghost@x.io" }, data: { name: "Ghost" } });
  } catch (e) {
    missing = toSafeError(e, "req-2");
  }
  console.log("missing", missing.status, missing.message);

  let other: SafeError = { status: 0, message: "" };
  try {
    throw new Error("connection string postgresql://user:secret@host/db failed");
  } catch (e) {
    other = toSafeError(e, "req-3");
  }
  console.log("other", other.status, other.message);
  console.log("logged", internalLog.length);
}

main().finally(() => prisma.$disconnect());