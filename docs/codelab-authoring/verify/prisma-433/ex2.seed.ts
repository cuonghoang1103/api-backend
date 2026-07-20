import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main(){
await prisma.comment.deleteMany(); await prisma.post.deleteMany();
await prisma.profile.deleteMany(); await prisma.category.deleteMany(); await prisma.user.deleteMany();
}
main().finally(()=>prisma.$disconnect());