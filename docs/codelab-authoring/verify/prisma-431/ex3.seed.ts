import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main(){
await prisma.post.deleteMany(); await prisma.user.deleteMany(); await prisma.user.create({ data: { email: "ann@x.io", name: "Ann" } });
}
main().finally(()=>prisma.$disconnect());