import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

const DEFAULT_TAKE = 2;
const MAX_TAKE = 3;

const safe = prisma.$extends({
  query: {
    $allModels: {
      async findMany({ args, query }) {
        const requested = args.take;
        // Missing, zero or negative -> default. Too large -> maximum.
        args.take = requested === undefined || requested <= 0
          ? DEFAULT_TAKE
          : Math.min(requested, MAX_TAKE);
        return query(args);
      },
    },
  },
});

async function main() {
  await prisma.note.createMany({ data: [
    { title: "N4", body: "four", tenantId: 1 },
    { title: "N5", body: "five", tenantId: 1 },
  ]});

  console.log("noTake", (await safe.note.findMany()).length);
  console.log("huge", (await safe.note.findMany({ take: 1000000 })).length);
  console.log("negative", (await safe.note.findMany({ take: -5 })).length);
  console.log("fine", (await safe.note.findMany({ take: 1 })).length);
  console.log("unclamped", (await prisma.note.findMany({ take: 1000000 })).length);
}

main().finally(() => prisma.$disconnect());