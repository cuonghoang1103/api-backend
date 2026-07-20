import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main(){
await prisma.post.deleteMany(); await prisma.user.deleteMany();
const u = await prisma.user.create({ data: { email: "seed@x.io" } });
await prisma.post.createMany({ data: [ { title: "A", published: true, authorId: u.id }, { title: "B", published: false, authorId: u.id }, { title: "C", published: true, authorId: u.id } ] });
}
main().finally(()=>prisma.$disconnect());