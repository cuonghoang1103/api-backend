/**
 * Bản chép ở frontend/src/lib/sqlDesign/ phải khớp nguồn (nếu đỏ: node scripts/dong-bo-sql-design.mjs).
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { it } from 'node:test';
import { fileURLToPath } from 'node:url';

it('frontend/src/lib/sqlDesign khớp src/services/work/sqlDesign', () => {
  const script = fileURLToPath(new URL('../../../../scripts/dong-bo-sql-design.mjs', import.meta.url));
  assert.doesNotThrow(() => execFileSync(process.execPath, [script, '--kiem'], { stdio: 'pipe' }));
});
