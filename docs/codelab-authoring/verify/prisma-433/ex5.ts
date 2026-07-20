import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  const names = (rows: { name: string }[]) => rows.map((r) => r.name).join(", ");
  const some = await prisma.user.findMany({
    where: { posts: { some: { published: true, views: { gte: 150 } } } },
    orderBy: { name: "asc" },
  });
  console.log("some:", names(some));
  const every = await prisma.user.findMany({
    where: { posts: { every: { published: true } } },
    orderBy: { name: "asc" },
  });
  console.log("every:", names(every));
  const none = await prisma.user.findMany({
    where: { posts: { none: {} } },
    orderBy: { name: "asc" },
  });
  console.log("none:", names(none));
  const withBio = await prisma.user.findMany({
    where: { profile: { is: { bio: { contains: "engineer", mode: "insensitive" } } } },
    orderBy: { name: "asc" },
  });
  console.log("is:", names(withBio));
  console.log("noProfile", await prisma.user.count({ where: { profile: { is: null } } }));
}

main().finally(() => prisma.$disconnect());