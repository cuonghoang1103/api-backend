import { slugify, truncate, isSlug, SLUG_MAX } from '../labflow-slug.js';
const s: string = slugify('Phong Lab');
const t: string = truncate('hello world', 5);
const ok: boolean = isSlug('be-201');
const max: number = SLUG_MAX;
export { s, t, ok, max };
