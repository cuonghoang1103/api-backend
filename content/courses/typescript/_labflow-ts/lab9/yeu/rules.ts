import type { ContentType } from './content.ts';
const MAP: Record<ContentType, string> = { VLOG: 'Vlog', BLOG: 'Blog', CODE_REVIEW: 'Review' };
export function label(type: ContentType): string {
  return MAP[type];
}
// No guard — without noUncheckedIndexedAccess, tags[0] is typed string, so this compiles (and crashes on []).
export function firstTag(tags: string[]): string {
  return tags[0].toUpperCase();
}
