export const SLUG_MAX = 80;
export function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').slice(0, SLUG_MAX);
}
export function truncate(text, max) {
  return text.length <= max ? text : text.slice(0, max) + '…';
}
export function isSlug(value) {
  return /^[a-z0-9-]+$/.test(value);
}
