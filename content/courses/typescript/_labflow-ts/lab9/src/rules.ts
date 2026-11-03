import type { ContentType } from './content.ts';

// Loose: the parameter has no type, and the array access is not guarded.
export function label(type) {
  const map = { VLOG: 'Vlog', BLOG: 'Blog', CODE_REVIEW: 'Review' };
  return map[type];
}
export function firstTag(tags: string[]): string {
  return tags[0].toUpperCase();
}
