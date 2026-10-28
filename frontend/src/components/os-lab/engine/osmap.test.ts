/**
 * osmap: mọi dòng output Linux/macOS (và PowerShell đo trên Linux) phải có NGUYÊN VĂN trong tệp lab/out tương ứng;
 * Windows không đo được trong lab nên phải mang nhãn 'doc'.
 *   cd frontend && npx tsx --test src/components/os-lab/engine/osmap.test.ts
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { measuredCount, OS_CARDS, OS_KEYS } from './osmap';

const lab = (f: string) => fs.readFileSync(fileURLToPath(new URL(`../../../../../content/courses/operating-systems-for-developers/lab/out/${f}.out.txt`, import.meta.url)), 'utf8');

describe('osmap', () => {
  it('ids are unique and every card has all three systems', () => {
    assert.equal(new Set(OS_CARDS.map((c) => c.id)).size, OS_CARDS.length);
    for (const c of OS_CARDS) for (const k of OS_KEYS) assert.ok(c.os[k] && c.os[k].name && c.os[k].out, `${c.id}/${k}`);
  });
  it('every measured line is verbatim in its lab output file', () => {
    for (const c of OS_CARDS) for (const k of OS_KEYS) {
      const x = c.os[k];
      if (x.src === 'doc') continue;
      assert.ok(lab(x.src).split('\n').some((l) => l.includes(x.out)), `${c.id}/${k}: "${x.out}" not in ${x.src}`);
    }
  });
  it('Windows is never presented as measured, except PowerShell (which ran on Linux)', () => {
    for (const c of OS_CARDS) if (c.os.win.src !== 'doc') assert.equal(c.os.win.src, 'c147-pwsh', c.id);
    assert.ok(measuredCount() >= 25);
  });
  it('the numbers the chapter quotes: write 64 vs 4, page 4096 vs 16384, USR1 exit 138 vs 158', () => {
    const by = Object.fromEntries(OS_CARDS.map((c) => [c.id, c]));
    assert.match(by.syscall.os.linux.out, / 64$/); assert.match(by.syscall.os.mac.out, / 4$/);
    assert.equal(by.page.os.linux.out, '4096'); assert.match(by.page.os.mac.out, /16384/);
    assert.equal(by.signal.os.linux.out, 'exit=138'); assert.equal(by.signal.os.mac.out, 'exit=158');
  });
});
