import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main(){
await prisma.post.deleteMany(); await prisma.user.deleteMany();
await prisma.user.createMany({ data: [ { email: "ann@x.io", credits: 100 }, { email: "bob@x.io", credits: 20 } ] });
}
main().finally(()=>prisma.$disconnect());