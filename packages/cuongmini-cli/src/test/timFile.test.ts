import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { diemMo, duyetThuMuc, phuLucNhac, timMo, tokenNhac } from '../timFile';

const DS = ['src/app.ts', 'src/email.ts', 'src/utils/chuoi.ts', 'README.md', 'package.json', 'src/', 'src/utils/', 'docs/email-guide.md'];

test('tìm mờ: tên file trùng đầu đứng trước, chuỗi con trong đường, không khớp ⇒ -1', () => {
  assert.equal(timMo('email', DS)[0], 'src/email.ts');
  assert.deepEqual(timMo('sut', DS).slice(0, 1), ['src/utils/']);
  assert.equal(diemMo('xyz', 'src/app.ts'), -1);
  assert.ok(diemMo('app', 'src/app.ts') > diemMo('app', 'src/xaxpxp.ts'));
  assert.ok(timMo('chuoi', DS).includes('src/utils/chuoi.ts'));
});

test('tìm mờ: chưa gõ gì ⇒ mục cấp gốc, thư mục trước', () => {
  assert.deepEqual(timMo('', DS), ['src/', 'package.json', 'README.md']);
});

test('token @ trước con trỏ', () => {
  assert.deepEqual(tokenNhac('xem @src/ap'), { q: 'src/ap', dau: 4 });
  assert.deepEqual(tokenNhac('@'), { q: '', dau: 0 });
  assert.equal(tokenNhac('email@x'), null);
  assert.equal(tokenNhac('xem @a b'), null);
});

test('phụ lục nhắc model đọc file được @', () => {
  const ra = phuLucNhac('sửa @src/a.ts và @docs/', new Set());
  assert.match(ra, /- src\/a\.ts\n- docs\//);
  assert.equal(phuLucNhac('không nhắc gì'), 'không nhắc gì');
  assert.equal(phuLucNhac('xem @a.png', new Set(['a.png'])), 'xem @a.png');
});

test('duyệt thư mục bỏ node_modules/.git/dist', () => {
  const goc = mkdtempSync(path.join(tmpdir(), 'cm-tim-'));
  try {
    for (const d of ['src', 'node_modules/x', '.git', 'dist']) mkdirSync(path.join(goc, d), { recursive: true });
    writeFileSync(path.join(goc, 'src/a.ts'), '');
    writeFileSync(path.join(goc, 'node_modules/x/i.js'), '');
    writeFileSync(path.join(goc, 'dist/b.js'), '');
    writeFileSync(path.join(goc, 'goc.md'), '');
    assert.deepEqual(duyetThuMuc(goc).sort(), ['goc.md', 'src/a.ts']);
  } finally {
    rmSync(goc, { recursive: true, force: true });
  }
});
