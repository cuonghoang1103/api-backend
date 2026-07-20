import { PrismaClient, Prisma, Role } from './generated';
const prisma = new PrismaClient();

async function main(){
await prisma.post.deleteMany(); await prisma.profile.deleteMany(); await prisma.user.deleteMany();
const ann = await prisma.user.create({ data: { email: "ann@x.io", name: "Ann", age: 30, role: "ADMIN", profile: { create: { bio: "Backend engineer" } } } });
const bob = await prisma.user.create({ data: { email: "bob@x.io", name: "Bob", age: 25, role: "EDITOR", profile: { create: { bio: "Frontend developer" } } } });
await prisma.user.create({ data: { email: "cy@x.io", name: "Cy" } });
await prisma.post.createMany({ data: [
  { title: "Intro to SQL",    published: true,  views: 100, authorId: ann.id },
  { title: "Prisma Basics",   published: true,  views: 250, authorId: ann.id },
  { title: "Draft on Prisma", published: false, views: 0,   authorId: ann.id },
  { title: "Redis Notes",     published: true,  views: 80,  authorId: bob.id },
  { title: "React Hooks",     published: true,  views: 150, authorId: bob.id },
]});
}
main().finally(()=>prisma.$disconnect());