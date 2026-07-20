import { PrismaClient, Prisma, Role } from './generated';
const prisma = new PrismaClient();

const xprisma = prisma.$extends({
  result: {
    user: {
      displayName: {
        needs: { name: true, role: true },
        compute(u) {
          return `${u.name} [${u.role}]`;
        },
      },
      isAdult: {
        needs: { age: true },
        compute(u) {
          return u.age !== null && u.age >= 18;
        },
      },
    },
  },
  model: {
    user: {
      async findStaff() {
        return xprisma.user.findMany({
          where: { role: { in: [Role.ADMIN, Role.EDITOR] } },
          orderBy: { name: "asc" },
        });
      },
    },
  },
});

async function main() {
  const users = await xprisma.user.findMany({ orderBy: { name: "asc" } });
  for (const u of users) console.log(u.displayName, u.isAdult);
  const staff = await xprisma.user.findStaff();
  console.log("staff", staff.map((s) => s.displayName).join(", "));
  const selected = await xprisma.user.findMany({ orderBy: { name: "asc" }, select: { displayName: true } });
  console.log("selected", selected.map((s) => s.displayName).join(", "));
}

main().finally(() => prisma.$disconnect());