import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

function forTenant(tenantId: number) {
  return prisma.$extends({
    query: {
      post: {
        async findMany({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async count({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
      },
    },
    model: {
      post: {
        // A query handler injects the value but cannot NARROW the caller's
        // type, so writes get a model method whose signature omits tenantId.
        async createScoped(data: Omit<Prisma.PostUncheckedCreateInput, "tenantId">) {
          return prisma.post.create({ data: { ...data, tenantId } });
        },
      },
    },
  });
}

async function main() {
  const t1 = forTenant(1);
  const t2 = forTenant(2);

  console.log("t1", await t1.post.count());
  console.log("t2", await t2.post.count());

  const cy = await prisma.user.findUniqueOrThrow({ where: { email: "cy@x.io" } });
  const created = await t2.post.createScoped({ title: "P5", views: 0, authorId: cy.id });
  const stored = await prisma.post.findUniqueOrThrow({ where: { id: created.id } });
  console.log("createdTenant", stored.tenantId);

  const leaked = await t1.post.findFirst({ where: { title: "P4" } });
  console.log("leak", leaked === null ? "none" : leaked.title);

  console.log("total", await prisma.post.count());
}

main().finally(() => prisma.$disconnect());