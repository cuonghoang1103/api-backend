/** scripts/lenh-video.lib.mjs — node --test scripts/lenh-video.lib.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bocJson, chiaLo, ghepGiai, khoaMuc, noiDungLo, vanTayLenh, vietJsonLenh } from './lenh-video.lib.mjs';

const lenh = { t: 76.8, loai: 'lenh', tenCanh: 'Chứng minh: 41 byte', nhac: 'an@MacBook-Air du-an %', lenh: 'wc -c < .git/refs/heads/feature/login', ra: ['      41'], loi: ['Đếm byte: bốn mươi mốt.'] };
const ma = { t: 10, loai: 'ma', ma: 'let a = 1;\n\nconsole.log(a);', loi: [] };

test('khoaMuc ổn định theo NỘI DUNG (không theo mốc/cảnh)', () => {
  assert.equal(khoaMuc(lenh), khoaMuc({ ...lenh, t: 999, tenCanh: 'khác', loi: [] }));
  assert.notEqual(khoaMuc(lenh), khoaMuc({ ...lenh, ra: ['42'] }));
});

test('ghepGiai: loại phần-cờ bịa, giữ lệnh/output NGUYÊN VĂN của bộ trích', () => {
  const g = ghepGiai(lenh, { giai: 'Đếm byte.', chiTiet: [{ phan: 'wc', nghia: 'đếm' }, { phan: '-c', nghia: 'byte' }, { phan: '--bytes', nghia: 'bịa' }], ketQua: 'In 41.' });
  assert.equal(g.bo.chiTiet, 1);
  assert.deepEqual(g.muc.chiTiet.map((p) => p.phan), ['wc', '-c']);
  assert.equal(g.muc.lenh, lenh.lenh);
  assert.deepEqual(g.muc.ra, lenh.ra);
  assert.equal(g.muc.canh, 'Chứng minh: 41 byte');
  assert.equal(ghepGiai(lenh, { bo: true }), null);
  assert.equal(ghepGiai(lenh, { giai: '' }), null);
});

test('ghepGiai: chú thích dòng trống / ngoài khối bị loại', () => {
  const g = ghepGiai(ma, { giai: 'In a.', ngon: 'JS', dong: [{ so: 1, giai: 'khai báo' }, { so: 2, giai: 'dòng trống' }, { so: 9, giai: 'x' }] });
  assert.deepEqual(g.muc.dong, [{ so: 1, giai: 'khai báo' }]);
  assert.equal(g.muc.ngon, 'js');
  assert.equal(g.bo.dong, 2);
});

test('noiDungLo đánh số dòng code + mốc mm:ss; chiaLo tách lô', () => {
  const s = noiDungLo({ tenBai: '3.1 Nhánh', khoa: 'git' }, [lenh, ma]);
  assert.match(s, /#0 \[lenh\] lúc 1:16/);
  assert.match(s, /  3\| console\.log\(a\);/);
  assert.equal(chiaLo(Array.from({ length: 40 }, () => lenh)).length, 3);
});

test('bocJson chịu được rào ```json', () => {
  assert.deepEqual(bocJson('```json\n{"muc":[{"i":0}]}\n```'), { muc: [{ i: 0 }] });
  assert.equal(bocJson('không có'), null);
});

test('vietJsonLenh tất định + vân tay đổi khi đổi mục', () => {
  const tep = { courseSlug: 'git', sinhBoi: 'x', lessons: { b: { track: 'VI', videoUrl: 'u', items: [{ t: 1 }] }, a: { track: 'VI', videoUrl: 'v', items: [] } } };
  const s = vietJsonLenh(tep);
  assert.equal(s, vietJsonLenh(JSON.parse(s)));
  assert.ok(s.indexOf('"a"') < s.indexOf('"b"'));
  assert.notEqual(vanTayLenh('u', [{ t: 1 }]), vanTayLenh('u', [{ t: 2 }]));
});
