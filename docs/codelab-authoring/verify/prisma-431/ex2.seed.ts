import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main(){
await prisma.post.deleteMany(); await prisma.user.deleteMany();
}
main().finally(()=>prisma.$disconnect());