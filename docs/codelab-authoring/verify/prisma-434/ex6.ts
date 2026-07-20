import { PrismaClient, Prisma, Role } from './generated';
const prisma = new PrismaClient();

async function main() {
  const counts = await prisma.$queryRaw<{ name: string; posts: number }[]>`
    SELECT u.name, COUNT(p.id)::int AS posts
    FROM "User" u LEFT JOIN "Post" p ON p."authorId" = u.id
    GROUP BY u.name ORDER BY u.name ASC`;
  for (const c of counts) console.log(c.name, c.posts);

  const minViews = 100;
  const hot = await prisma.$queryRaw<{ title: string }[]>`
    SELECT title FROM "Post"
    WHERE published = true AND views >= ${minViews}
    ORDER BY views DESC`;
  for (const h of hot) console.log(h.title);

  const roles: Role[] = [Role.ADMIN, Role.EDITOR];
  const roleFilter = Prisma.sql`u.role::text IN (${Prisma.join(roles)})`;
  const staff = await prisma.$queryRaw<{ email: string }[]>`
    SELECT u.email FROM "User" u WHERE ${roleFilter} ORDER BY u.email ASC`;
  console.log("staff", staff.map((s) => s.email).join(", "));

  const term = "'; DROP TABLE users; --";
  const injected = await prisma.$queryRaw<{ title: string }[]>`
    SELECT title FROM "Post" WHERE title = ${term}`;
  console.log("injected", injected.length, await prisma.user.count());
}

main().finally(() => prisma.$disconnect());