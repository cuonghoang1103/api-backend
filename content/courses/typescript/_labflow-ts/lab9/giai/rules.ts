import type { ContentType } from './content.ts';

// The parameter is typed, and the lookups are complete / guarded.
const MAP: Record<ContentType, string> = { VLOG: 'Vlog', BLOG: 'Blog', CODE_REVIEW: 'Review' };
export function label(type: ContentType): string {
  return MAP[type];
}
export function firstTag(tags: string[]): string {
  const first = tags[0];
  return (first ?? '').toUpperCase();
}
