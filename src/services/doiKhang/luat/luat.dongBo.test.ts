/**
 * Chặn lệch giữa nguồn luật (src/services/doiKhang/luat/) và bản chép ở frontend.
 * Lệch ⇒ chạy: node scripts/dong-bo-luat-doi-khang.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '../../../..');

test('bản chép luật ở frontend khớp nguồn', () => {
  const r = spawnSync(process.execPath, [join(GOC, 'scripts/dong-bo-luat-doi-khang.mjs'), '--kiem'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr || r.stdout);
});
