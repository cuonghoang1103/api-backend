// Lesson 8.5 — reading and writing the blog through Prisma, with the SQL it really sends (log: query).
import { PrismaClient, Prisma } from './client/index.js';

const prisma = new PrismaClient({ log: [{ emit: 'event', level: 'query' }] });
let logging = false;
prisma.$on('query', (e) => { if (logging) console.log('  SQL:', e.query.replace(/`main`\./g, '').replace(/`/g, ''), e.params !== '[]' ? '  params ' + e.params : ''); });
const step = async (label, fn) => {
  console.log('> ' + label);
  logging = true;
  try {
    const r = await fn();
    logging = false;
    console.log('  result:', JSON.stringify(r));
  } catch (err) {
    logging = false;
    console.log('  threw:', err.constructor.name, err.code ?? '', '—', String(err.message).split('\n').filter(Boolean).pop());
  }
  console.log();
};

// seed, quietly
await prisma.comment.deleteMany(); await prisma.post.deleteMany(); await prisma.user.deleteMany();
await prisma.user.create({ data: { id: 1, name: 'Lan', email: 'lan@example.com', posts: { create: [{ id: 1, title: 'Hello World', views: 120, published: true }, { id: 2, title: 'Learning SQL', views: 45, published: true }] } } });
await prisma.user.create({ data: { id: 2, name: 'Minh', email: 'minh@example.com', posts: { create: [{ id: 4, title: 'Node.js Basics', views: 300, published: true }, { id: 3, title: 'Draft Post', views: 3 }] } } });
await prisma.comment.create({ data: { body: 'Very clear, thanks', postId: 4, userId: 1 } });

await step("prisma.post.findMany({ where: { published: true }, orderBy: { views: 'desc' }, take: 2, select: { title: true, views: true } })",
  () => prisma.post.findMany({ where: { published: true }, orderBy: { views: 'desc' }, take: 2, select: { title: true, views: true } }));
await step("prisma.user.findUnique({ where: { email: 'minh@example.com' }, include: { posts: { select: { title: true } } } })",
  () => prisma.user.findUnique({ where: { email: 'minh@example.com' }, include: { posts: { select: { title: true } } } }));
await step("prisma.post.create({ data: { title: 'My first post', author: { connect: { id: 1 } } } })",
  () => prisma.post.create({ data: { title: 'My first post', author: { connect: { id: 1 } } } }));
await step("prisma.user.create({ data: { name: 'Lan 2', email: 'lan@example.com' } })   — email already used",
  () => prisma.user.create({ data: { name: 'Lan 2', email: 'lan@example.com' } }));
await step("prisma.post.update({ where: { id: 999 }, data: { views: 1 } })   — no such row",
  () => prisma.post.update({ where: { id: 999 }, data: { views: 1 } }));

const search = "%' OR 1=1 --";
await step('prisma.$queryRaw`SELECT id, title FROM Post WHERE title LIKE ${search}`   — tagged template',
  () => prisma.$queryRaw`SELECT id, title FROM Post WHERE title LIKE ${search}`);
await step("prisma.$queryRawUnsafe(\"SELECT id, title FROM Post WHERE title LIKE '\" + search + \"'\")   — string gluing",
  () => prisma.$queryRawUnsafe("SELECT id, title FROM Post WHERE title LIKE '" + search + "'"));
await prisma.$disconnect();
