// A tiny stand-in for the database. Like a PostgreSQL enum column, it refuses values it does not know.
import type { ContentType } from './types.ts';

const ALLOWED: readonly ContentType[] = ['VLOG', 'ARTICLE', 'CODE_REVIEW', 'QUIZ'];

export function insertPost(post: { title: string; type: ContentType }): void {
  if (!ALLOWED.includes(post.type)) {
    throw new Error('invalid input value for enum "ContentType": "' + post.type + '"');
  }
  console.log('inserted', post.type, '-', post.title);
}
