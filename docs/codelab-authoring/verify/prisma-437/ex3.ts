import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

const xprisma = prisma.$extends({
  query: {
    user: {
      // A delete becomes a timestamped update. The row never leaves the table.
      async delete({ args }) {
        return prisma.user.update({ where: args.where, data: { deletedAt: new Date() } });
      },
    },
    $allModels: {
      async findMany({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findFirst({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
    },
  },
});

async function main() {
  await xprisma.user.delete({ where: { email: "bob@x.io" } });

  console.log("rowsInTable", await prisma.user.count());
  console.log("visible", (await xprisma.user.findMany()).length);
  console.log("marked", await prisma.user.count({ where: { deletedAt: { not: null } } }));
  console.log("tenant1", (await xprisma.user.findMany({ where: { tenantId: 1 } })).length);
  console.log("admin", (await prisma.user.findMany()).length);
}

main().finally(() => prisma.$disconnect());