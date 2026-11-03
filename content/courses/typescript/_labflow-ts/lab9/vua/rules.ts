import type { ContentType } from './content.ts';
const MAP: Record<ContentType, string> = { VLOG: 'Vlog', BLOG: 'Blog', CODE_REVIEW: 'Review' };
export function label(type: ContentType): string {
  return MAP[type];
}
export function firstTag(tags: string[]): string {
  const first = tags[0];
  return (first ?? '').toUpperCase();
}
