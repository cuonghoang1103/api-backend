import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main(){
await prisma.post.deleteMany(); await prisma.user.deleteMany();
const u = await prisma.user.create({ data: { email: "seed@x.io", credits: 100 } });
await prisma.post.create({ data: { title: "P", authorId: u.id, views: 0 } });
}
main().finally(()=>prisma.$disconnect());