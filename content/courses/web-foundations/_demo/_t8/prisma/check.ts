// Lesson 8.5 — the generated client knows the schema, so TypeScript catches mistakes before the query runs.
import { PrismaClient } from './client';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({ where: { titel: 'Hello World' } });   // typo in a field name
  const first = posts[0];
  console.log(first.views.toUpperCase());                                           // views is a number
}
main();
