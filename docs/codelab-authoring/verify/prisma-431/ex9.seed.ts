import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main(){
await prisma.post.deleteMany(); await prisma.user.deleteMany(); await prisma.user.create({ data: { email: "seed@x.io", credits: 0 } });
}
main().finally(()=>prisma.$disconnect());