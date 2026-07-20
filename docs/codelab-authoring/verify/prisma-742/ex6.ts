import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

const xprisma = prisma.$extends({
  query: {
    note: {
      async create({ args, query }) {
        return prisma.$transaction(async () => {
          const created = await query(args);
          await prisma.auditLog.create({ data: { model: "Note", action: "create", recordId: created.id } });
          return created;
        });
      },
      async update({ args, query }) {
        return prisma.$transaction(async () => {
          const updated = await query(args);
          await prisma.auditLog.create({ data: { model: "Note", action: "update", recordId: updated.id } });
          return updated;
        });
      },
      async delete({ args, query }) {
        return prisma.$transaction(async () => {
          const removed = await query(args);
          await prisma.auditLog.create({ data: { model: "Note", action: "delete", recordId: removed.id } });
          return removed;
        });
      },
    },
  },
});

async function main() {
  await xprisma.note.create({ data: { title: "N4", body: "fresh", tenantId: 1 } });
  await xprisma.note.update({ where: { title: "N1" }, data: { body: "edited" } });
  await xprisma.note.delete({ where: { title: "N2" } });

  const trail = await prisma.auditLog.findMany({ orderBy: { id: "asc" } });
  console.log("audits", trail.length);
  console.log("trail", trail.map((a) => `${a.model}:${a.action}`).join(", "));
  console.log("hasIds", trail.every((a) => a.recordId !== null));

  try {
    await xprisma.note.create({ data: { title: "N3", body: "duplicate title", tenantId: 1 } });
  } catch {
    // expected: the unique constraint rejects it
  }
  console.log("failedAudits", await prisma.auditLog.count());
  console.log("notes", await prisma.note.count());
}

main().finally(() => prisma.$disconnect());