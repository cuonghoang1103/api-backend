import { PrismaClient, Prisma } from './generated';
const prisma = new PrismaClient();

async function main(){
await prisma.post.deleteMany(); await prisma.user.deleteMany();
const ann = await prisma.user.create({ data: { email: "ann@x.io", name: "Ann" } });
const bob = await prisma.user.create({ data: { email: "bob@x.io", name: "Bob" } });
const cy = await prisma.user.create({ data: { email: "cy@x.io", name: "Cy" } });
await prisma.post.createMany({ data: [
  { title: "Intro to SQL",    published: true,  views: 100, rating: 4.0,  createdAt: new Date("2026-01-10T00:00:00Z"), authorId: ann.id },
  { title: "Prisma Basics",   published: true,  views: 250, rating: 5.0,  createdAt: new Date("2026-01-20T00:00:00Z"), authorId: ann.id },
  { title: "Draft on Prisma", published: false, views: 0,   rating: null, createdAt: new Date("2026-02-05T00:00:00Z"), authorId: ann.id },
  { title: "Indexing Tips",   published: true,  views: 130, rating: 3.0,  createdAt: new Date("2026-02-14T00:00:00Z"), authorId: ann.id },
  { title: "Redis Notes",     published: true,  views: 80,  rating: 4.0,  createdAt: new Date("2026-01-25T00:00:00Z"), authorId: bob.id },
  { title: "React Hooks",     published: true,  views: 150, rating: 2.0,  createdAt: new Date("2026-02-02T00:00:00Z"), authorId: bob.id },
  { title: "CSS Grid",        published: true,  views: 70,  rating: null, createdAt: new Date("2026-02-20T00:00:00Z"), authorId: bob.id },
  { title: "Cy Draft",        published: false, views: 20,  rating: 1.0,  createdAt: new Date("2026-02-25T00:00:00Z"), authorId: cy.id },
]});
}
main().finally(()=>prisma.$disconnect());