// The fix: import the ONE definition instead of keeping a copy. The rename now reaches the seed too.
import type { ContentType } from './types.ts';
import { insertPost } from './db.ts';

const posts: { title: string; type: ContentType }[] = [
  { title: 'Welcome to LabFlow', type: 'ARTICLE' },
  { title: 'Review: checkSlot()', type: 'CODE' },
  { title: 'Week 1 quiz', type: 'QUIZ' },
];

for (const p of posts) insertPost(p);
console.log('seeded', posts.length, 'posts');
