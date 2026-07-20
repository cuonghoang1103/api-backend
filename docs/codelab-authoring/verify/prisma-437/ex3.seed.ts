import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

async function main(){
await prisma.post.deleteMany(); await prisma.user.deleteMany(); await prisma.account.deleteMany();
const ann = await prisma.user.create({ data: { email: "ann@x.io", name: "Ann", tenantId: 1 } });
const bob = await prisma.user.create({ data: { email: "bob@x.io", name: "Bob", tenantId: 1 } });
const cy = await prisma.user.create({ data: { email: "cy@x.io", name: "Cy", tenantId: 2 } });
await prisma.post.createMany({ data: [
  { title: "P1", views: 10, tenantId: 1, authorId: ann.id },
  { title: "P2", views: 20, tenantId: 1, authorId: ann.id },
  { title: "P3", views: 30, tenantId: 1, authorId: bob.id },
  { title: "P4", views: 40, tenantId: 2, authorId: cy.id },
]});
await prisma.account.create({ data: { owner: "main", balance: 100 } });
}
main().finally(()=>prisma.$disconnect());