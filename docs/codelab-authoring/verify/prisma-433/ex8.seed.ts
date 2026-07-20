import { PrismaClient } from './generated';
const prisma = new PrismaClient();

async function main(){
await prisma.comment.deleteMany(); await prisma.post.deleteMany();
await prisma.profile.deleteMany(); await prisma.category.deleteMany(); await prisma.user.deleteMany();
const ann = await prisma.user.create({ data: { email: "ann@x.io", name: "Ann", profile: { create: { bio: "Backend engineer" } } } });
const bob = await prisma.user.create({ data: { email: "bob@x.io", name: "Bob", profile: { create: { bio: "Frontend developer" } } } });
const cy = await prisma.user.create({ data: { email: "cy@x.io", name: "Cy" } });
const db = await prisma.category.create({ data: { name: "Databases" } });
const orm = await prisma.category.create({ data: { name: "ORM" } });
const fe = await prisma.category.create({ data: { name: "Frontend" } });
const intro = await prisma.post.create({ data: { title: "Intro to SQL", published: true, views: 100, authorId: ann.id, categories: { connect: [{ id: db.id }] } } });
const basics = await prisma.post.create({ data: { title: "Prisma Basics", published: true, views: 250, authorId: ann.id, categories: { connect: [{ id: db.id }, { id: orm.id }] } } });
await prisma.post.create({ data: { title: "Draft on Prisma", published: false, views: 0, authorId: ann.id } });
await prisma.post.create({ data: { title: "Redis Notes", published: true, views: 80, authorId: bob.id, categories: { connect: [{ id: db.id }] } } });
const hooks = await prisma.post.create({ data: { title: "React Hooks", published: true, views: 150, authorId: bob.id, categories: { connect: [{ id: fe.id }] } } });
await prisma.comment.createMany({ data: [
  { body: "Great intro", postId: intro.id, authorId: bob.id },
  { body: "Thanks", postId: intro.id, authorId: cy.id },
  { body: "Helpful", postId: basics.id, authorId: bob.id },
  { body: "Nice", postId: hooks.id, authorId: ann.id },
]});
}
main().finally(()=>prisma.$disconnect());