import { slugify, truncate, isSlug, SLUG_MAX, nope } from '../labflow-slug.js'; // S7 TS2305 labflow-slug has no export 'nope'
export const s1 = slugify(42); // S1 TS2345 slugify takes a string, not a number
export const s2 = truncate('x'); // S2 TS2554 truncate needs the max argument
export const s3: number = slugify('x'); // S3 TS2322 slugify returns a string, not a number
export const s4 = isSlug('x').length; // S4 TS2339 isSlug returns boolean, which has no .length
export const s5 = SLUG_MAX.toUpperCase(); // S5 TS2339 SLUG_MAX is a number, which has no toUpperCase
export const s6 = truncate('x', '5'); // S6 TS2345 max is a number, not a string
export const s8: boolean = truncate('x', 5); // S8 TS2322 truncate returns a string, not a boolean
void nope;
