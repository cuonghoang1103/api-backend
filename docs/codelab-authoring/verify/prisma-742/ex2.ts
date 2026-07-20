import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

const xprisma = prisma.$extends({
  result: {
    user: {
      maskedEmail: {
        needs: { email: true },
        compute(u) {
          const at = u.email.indexOf("@");
          return `${u.email.slice(0, 1)}***${u.email.slice(at)}`;
        },
      },
      safeLabel: {
        needs: { name: true, tenantId: true },
        compute(u) {
          return `${u.name} (t${u.tenantId})`;
        },
      },
    },
  },
});

async function main() {
  const users = await xprisma.user.findMany({ orderBy: { email: "asc" } });
  for (const u of users) console.log(u.maskedEmail, u.safeLabel);

  const selected = await xprisma.user.findMany({
    orderBy: { email: "asc" },
    select: { maskedEmail: true },
  });
  console.log("selected", selected.map((s) => s.maskedEmail).join(", "));
  console.log("rawGone", !Object.keys(selected[0]).includes("email"));
}

main().finally(() => prisma.$disconnect());