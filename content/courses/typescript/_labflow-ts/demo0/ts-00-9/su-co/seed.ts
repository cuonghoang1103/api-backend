// The seed script kept its OWN copy of the union — typed by hand months before the rename.
import { insertPost } from './db.ts';

type ContentType = 'VLOG' | 'ARTICLE' | 'CODE' | 'QUIZ';

const posts: { title: string; type: ContentType }[] = [
  { title: 'Welcome to LabFlow', type: 'ARTICLE' },
  { title: 'Review: checkSlot()', type: 'CODE' },
  { title: 'Week 1 quiz', type: 'QUIZ' },
];

for (const p of posts) insertPost(p);
console.log('seeded', posts.length, 'posts');
