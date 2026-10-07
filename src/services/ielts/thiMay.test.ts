/**
 * Phòng thi máy tính: làm tròn band Writing + chuẩn hoá JSON AI chấm —
 * `npx tsx --test src/services/ielts/thiMay.test.ts`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lamTronBand, bandVietTong, chuanKetQuaViet, docJsonCham } from './thiMay.service.js';
import { quyDoiBand } from './deThi.service.js';

test('làm tròn band kiểu IELTS: .25 lên .5, .75 lên nguyên', () => {
  assert.equal(lamTronBand(6.125), 6);
  assert.equal(lamTronBand(6.25), 6.5);
  assert.equal(lamTronBand(6.5), 6.5);
  assert.equal(lamTronBand(6.625), 6.5);
  assert.equal(lamTronBand(6.75), 7);
  assert.equal(lamTronBand(7), 7);
});

test('band Writing tổng: Task 2 nặng gấp đôi', () => {
  assert.equal(bandVietTong(6, 7), 6.5);  // 20/3 = 6.67 → 6.5
  assert.equal(bandVietTong(6, 7.5), 7);  // 21/3 = 7
  assert.equal(bandVietTong(null, 6.5), 6.5);
  assert.equal(bandVietTong(null, null), null);
});

test('bảng quy đổi điểm thô 40 câu (Listening/Reading Academic)', () => {
  const doc: [number, number][] = [[40, 9], [39, 9], [38, 8.5], [35, 8], [33, 7.5], [32, 7], [30, 7], [29, 6.5], [27, 6.5], [26, 6], [23, 6], [22, 5.5], [19, 5.5], [15, 5], [13, 4.5], [10, 4]];
  for (const [d, b] of doc) assert.equal(quyDoiBand(d, 40, 'doc'), b, `Reading ${d}/40`);
  const nghe: [number, number][] = [[40, 9], [37, 8.5], [35, 8], [34, 7.5], [32, 7.5], [31, 7], [30, 7], [29, 6.5], [26, 6.5], [25, 6], [23, 6], [22, 5.5], [18, 5.5], [17, 5], [16, 5]];
  for (const [d, b] of nghe) assert.equal(quyDoiBand(d, 40, 'nghe'), b, `Listening ${d}/40`);
});

test('chuẩn hoá kết quả AI: đủ 4 tiêu chí, kẹp band, tự tính band tổng', () => {
  const r = chuanKetQuaViet({
    tieuChi: [
      { ma: 'TR', band: 6.3, manh: 'a', sua: 'b' },
      { ma: 'CC', band: 7, manh: 'a', sua: 'b' },
      { ma: 'LR', band: 12, manh: 'a', sua: 'b' },
      { ma: 'GRA', band: 6, manh: 'a', sua: 'b' },
    ],
    loi: [{ goc: 'people is', sua: 'people are', vi: 'people số nhiều' }, { goc: '', sua: 'x' }],
    banVietLai: 'Text', nhanXet: 'Ok',
  }, 2);
  assert.deepEqual(r.tieuChi.map((t) => [t.ma, t.band]), [['TR', 6.5], ['CC', 7], ['LR', 9], ['GRA', 6]]);
  assert.equal(r.band, 7); // (6.5+7+9+6)/4 = 7.125 → 7
  assert.equal(r.loi.length, 1);
});

test('Task 1 dùng TA; model ghi "TR|TA" vẫn nhận', () => {
  const r = chuanKetQuaViet({ tieuChi: [{ ma: 'TR|TA', band: 6, manh: 'x', sua: 'y' }, { ma: 'CC', band: 6, manh: 'x' }, { ma: 'LR', band: 6, manh: 'x' }, { ma: 'GRA', band: 6, manh: 'x' }] }, 1);
  assert.equal(r.tieuChi[0].ma, 'TA');
  assert.equal(r.tieuChi[0].band, 6);
});

test('đọc JSON có dấu " chưa thoát khi model trích câu của học viên', () => {
  const raw = '```json\n{"tieuChi":[{"ma":"TR","band":6,"manh":"Có câu "In my opinion, both are important" rõ ràng.","sua":"Thiếu ví dụ"}],"loi":[{"goc":"academic knowledge give","sua":"academic knowledge gives","vi":"Chủ ngữ số ít"}],"banVietLai":"Para 1.\n\nPara 2.","nhanXet":"OK"}\n```';
  const j = docJsonCham(raw) as { tieuChi: { manh: string }[]; banVietLai: string };
  assert.equal(j.tieuChi[0].manh, 'Có câu "In my opinion, both are important" rõ ràng.');
  assert.match(j.banVietLai, /Para 1\.\s+Para 2\./);
});

test('JSON thiếu tiêu chí ⇒ ném lỗi (không bịa band 0)', () => {
  assert.throws(() => chuanKetQuaViet({ tieuChi: [{ ma: 'TR', band: 6, manh: 'x' }] }, 2));
});
