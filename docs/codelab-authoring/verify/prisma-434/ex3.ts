import { PrismaClient, Prisma, Role } from './generated';
const prisma = new PrismaClient();

type UserWithPosts = Prisma.UserGetPayload<{ include: { posts: true } }>;
type Slim = Prisma.UserGetPayload<{ select: { email: true; role: true } }>;

function summarise(u: UserWithPosts): string {
  const totalViews = u.posts.reduce((sum, p) => sum + p.views, 0);
  return `${u.name} ${u.posts.length} ${totalViews}`;
}

async function main() {
  const users = await prisma.user.findMany({ orderBy: { name: "asc" }, include: { posts: true } });
  for (const u of users) console.log(summarise(u));
  const slim: Slim[] = await prisma.user.findMany({ orderBy: { name: "asc" }, select: { email: true, role: true } });
  for (const s of slim) console.log(s.email, s.role);
}

main().finally(() => prisma.$disconnect());