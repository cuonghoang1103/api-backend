/** "Lệnh & code trong video" — bộ đọc `items` phía máy chủ (chặn chỗ model có thể bịa). npx tsx --test src/services/video/lenhVideo.test.ts */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { docMucLenh } from './lenhVideo.js';

test('docMucLenh: bỏ phần tử hỏng, sắp theo mốc, làm tròn 0,1 s', () => {
  const ra = docMucLenh([
    { t: 90.04, loai: 'lenh', lenh: 'git status', giai: 'Xem trạng thái.' },
    null, 'x', { t: -1, loai: 'lenh', lenh: 'ls', giai: 'a' }, { t: 5, loai: 'khac', giai: 'a' },
    { t: 12, loai: 'lenh', giai: 'thiếu lệnh' }, { t: 13, loai: 'ma', ma: 'x', giai: '' },
    { t: 10, loai: 'ma', ma: 'let a = 1;', giai: 'Khai báo.' },
  ]);
  assert.deepEqual(ra.map((m) => [m.t, m.loai]), [[10, 'ma'], [90, 'lenh']]);
  assert.deepEqual(docMucLenh('không phải mảng'), []);
});

test('docMucLenh: phần tách cờ PHẢI là chuỗi con nguyên văn của lệnh', () => {
  const [m] = docMucLenh([{
    t: 1, loai: 'lenh', lenh: 'wc -c < .git/refs/heads/main', giai: 'Đếm byte.',
    chiTiet: [{ phan: 'wc', nghia: 'đếm' }, { phan: '-c', nghia: 'byte' }, { phan: '--bytes', nghia: 'BỊA' }, { phan: '<', nghia: '' }],
  }]);
  assert.deepEqual(m!.chiTiet?.map((p) => p.phan), ['wc', '-c']);
});

test('docMucLenh: chú thích dòng ngoài khối code bị loại; output cắt 12 dòng', () => {
  const [ma, lenh] = docMucLenh([
    { t: 1, loai: 'ma', ma: 'a\nb\nc', giai: 'g', dong: [{ so: 0, giai: 'x' }, { so: 2, giai: 'dòng b' }, { so: 4, giai: 'x' }, { so: '3', giai: 'c' }] },
    { t: 2, loai: 'lenh', lenh: 'ls', giai: 'g', ra: Array.from({ length: 30 }, (_, i) => `f${i}`) },
  ]);
  assert.deepEqual(ma!.dong, [{ so: 2, giai: 'dòng b' }, { so: 3, giai: 'c' }]);
  assert.equal(lenh!.ra?.length, 12);
});
