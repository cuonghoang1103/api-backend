import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main() {
  console.log("haspub", await prisma.user.count({ where: { posts: { some: { published: true } } } }));
  console.log("noposts", await prisma.user.count({ where: { posts: { none: {} } } }));
  console.log("allpub", await prisma.user.count({ where: { posts: { every: { published: true } } } }));
}

main().finally(() => prisma.$disconnect());