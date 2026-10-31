/**
 * capture2: mọi dòng "thật" của Chương 2 phải có mặt NGUYÊN VĂN trong file .out.txt nguồn (bỏ khoảng trắng cuối dòng).
 *   cd frontend && npx tsx --test src/components/net-lab/engine/capture2.test.ts
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { CAPTURES } from './capture2';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '../../../../../content/courses/networking-for-developers/lab/out');

describe('capture2 — verbatim lab lines', () => {
  const cache = new Map<string, Set<string>>();
  const linesOf = (src: string) => {
    if (!cache.has(src)) cache.set(src, new Set(readFileSync(join(OUT, `${src}.out.txt`), 'utf8').split('\n').map((l) => l.replace(/\s+$/, ''))));
    return cache.get(src)!;
  };
  it('every line exists in its source file', () => {
    const missing: string[] = [];
    for (const c of CAPTURES) for (const l of c.lines) if (!linesOf(c.src).has(l)) missing.push(`${c.src}: ${JSON.stringify(l)}`);
    assert.deepEqual(missing, []);
    assert.ok(CAPTURES.length > 60);
  });
});
