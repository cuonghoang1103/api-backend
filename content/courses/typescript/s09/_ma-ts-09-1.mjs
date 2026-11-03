/**
 * _ma (bài 9.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "eraseArea": `interface Rect { w: number; h: number }
function area(r: Rect): number { return r.w * r.h; }
// The types are gone at run time — Node strips them and runs the JavaScript.
console.log(area({ w: 4, h: 3 }));`,
  "scopeContent": `// The source of truth: the enum value was renamed CODE -> CODE_REVIEW.
export type ContentType = 'VLOG' | 'BLOG' | 'CODE_REVIEW';`,
  "scopeSeed": `import type { ContentType } from '../src/content.ts';
// This still uses the OLD value 'CODE' — but it is outside the project, so tsc never looks.
export const rows: { type: ContentType }[] = [{ type: 'CODE' }];`,
  "scopeTsconfig": `{"extends":"../../../tsconfig.json","include":["src"]}`,
  "scopeTsconfigSeed": `{"extends":"../../../tsconfig.json","include":["src","seed"]}`,
  "prSeedStart": `import type { Role } from '../src/content.ts';
export const seed: { role: Role }[] = [{ role: 'VIEWER' }];`,
  "prSeedSol": `import type { Role } from '../src/content.ts';
export const seed: { role: Role }[] = [{ role: 'MEMBER' }];`,
};
export const OUT = {
  '11-erase': `$ node demo9/ts-09-1/erase/area.ts
12`,
  '12-scope': `$ node_modules/.bin/tsc -p demo9/ts-09-1/scope && echo '✓ tsc: 0 errors — seed/ is excluded, so the compiler never looked at it'
✓ tsc: 0 errors — seed/ is excluded, so the compiler never looked at it`,
  '13-scope-seed': `$ node_modules/.bin/tsc -p demo9/ts-09-1/scope/tsconfig.seed.json
demo9/ts-09-1/scope/seed/seed.ts(3,49): error TS2322: Type '"CODE"' is not assignable to type 'ContentType'.`,
  '14-pr-start': `$ node_modules/.bin/tsc -p demo9/ts-09-1/practice/start && echo '✓ 0 errors — but seed/ holds a dead value'
✓ 0 errors — but seed/ holds a dead value`,
  '15-pr-sol': `$ node_modules/.bin/tsc -p demo9/ts-09-1/practice/solution`,
};
