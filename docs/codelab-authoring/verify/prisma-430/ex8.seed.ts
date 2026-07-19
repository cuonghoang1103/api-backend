import { PrismaClient } from './generated';
const prisma = new PrismaClient();
async function main(){
await prisma.comment.deleteMany(); await prisma.post.deleteMany(); await prisma.user.deleteMany();
const u = await prisma.user.create({ data: { email: "seed@x.io" } });
await prisma.post.createMany({ data: [
  { title: "Intro to SQL", published: true, authorId: u.id },
  { title: "Prisma Basics", published: true, authorId: u.id },
  { title: "Draft on Prisma", published: false, authorId: u.id },
  { title: "Redis Notes", published: true, authorId: u.id },
]});
}
main().finally(()=>prisma.$disconnect());