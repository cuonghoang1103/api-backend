import { PrismaClient, Prisma, Role } from './generated';
const prisma = new PrismaClient();

import type { User } from './generated';

function describe(u: User): string {
  return `${u.name} ${u.role} ${u.age === null ? "?" : u.age}`;
}

function isPrivileged(role: Role): boolean {
  return role === Role.ADMIN || role === Role.EDITOR;
}

async function main() {
  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
  for (const u of users) console.log(describe(u));
  console.log("admins", await prisma.user.count({ where: { role: Role.ADMIN } }));
  console.log("privileged", users.filter((u) => isPrivileged(u.role)).length);
}

main().finally(() => prisma.$disconnect());