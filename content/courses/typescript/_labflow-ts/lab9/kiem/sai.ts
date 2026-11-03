import { label } from '../rules.ts';
import type { ContentType } from '../content.ts';
export function s1(x) { return x; } // S1 TS7006 a parameter with no type (noImplicitAny)
export const s2 = (y) => y + 1; // S2 TS7006 an implicit-any arrow parameter
export function s3(xs: number[]) { const a = xs[0]; return a.toFixed(2); } // S3 TS18048 an unchecked array access
export function s4(u: { name?: string }) { return u.name.length; } // S4 TS18048 a possibly-undefined value (strictNullChecks)
export const s5: ContentType = 'CODE'; // S5 TS2322 the drifted literal 'CODE'
export const s6 = label('PODCAST'); // S6 TS2345 a value that is not a ContentType
export const s7 = label('CODE'); // S7 TS2345 the old enum value
export function s8(m: Record<string, number>) { const v = m['k']; return v + 1; } // S8 TS18048 an unchecked record lookup
