/**
 * Xếp lớp sau test đầu vào (docs/ielts-lo-trinh-0-8.md mục 4.3) — bản WEB, phủ MỌI hàng của bảng + luật lệch
 * + làm tròn band tổng (mục 1.5). Chạy: npx tsx --test frontend/src/lib/ielts/xepLop.test.ts
 * (đặt ngoài thư mục [code] vì trình chạy test của node hiểu [ ] là glob)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xepLop, xepLopChiTiet, bandTong, lamTronBandTong } from '../../app/language/[code]/ielts/thi-may/xepLop';

const vt = (r: { tap: number; ngay: number }) => `${r.tap}/${r.ngay}`;

test('mục 1.5: 6.5 · 6.5 · 5.0 · 7.0 = 6.25 → 6.5; .75 → nguyên; .125 → .0; .625 → .5', () => {
  assert.equal(bandTong([6.5, 6.5, 5, 7]), 6.5);
  assert.equal(bandTong([7, 7, 7, 6]), 7);       // 6.75 → 7
  assert.equal(bandTong([6, 6, 6, 6.5]), 6);     // 6.125 → 6
  assert.equal(bandTong([6.5, 6.5, 6.5, 7]), 6.5); // 6.625 → 6.5
  assert.equal(lamTronBandTong(5.5), 5.5);
  assert.equal(bandTong([6, undefined, null]), 6);
  assert.equal(bandTong([]), null);
});

test('hàng 1 — sàng lọc < 10 ⇒ Tập 1 Ngày 1 dù band cao', () => {
  const r = xepLop({ sangLoc: 9, nghe: 35, doc: 35, viet: 8, noi: 8 });
  assert.equal(vt(r), '1/1');
  assert.ok(r.lyDo.length >= 2 && r.lyDo.length <= 3);
  assert.match(r.lyDo[1], /Sàng lọc 9\/30 dưới 10/);
  assert.deepEqual(r.duongOnKem, []);
});
test('hàng 1 — Overall < 3.5 ⇒ Tập 1 Ngày 1', () => {
  assert.equal(vt(xepLop({ sangLoc: 20, nghe: 9, doc: 5, viet: 3, noi: 3 })), '1/1'); // 3.5·2·3·3 = 2.875 → 3.0
});
test('hàng 1 — L và R đều < 8/40 ⇒ Tập 1 Ngày 1 (dù W/S khá)', () => {
  const r = xepLop({ sangLoc: 24, nghe: 7, doc: 7, viet: 6, noi: 6 });
  assert.equal(vt(r), '1/1');
  assert.match(r.lyDo[1], /đều dưới 8/);
  // Chỉ một trong hai dưới 8 thì KHÔNG rơi vào hàng này: 3·4·4·4 = 3.75 → 4.0, SL 24 ⇒ hàng 3.
  assert.equal(vt(xepLop({ sangLoc: 24, nghe: 7, doc: 10, viet: 4, noi: 4 })), '2/1');
});
test('hàng 2 — Overall 3.5–4.0 và sàng lọc < 20 ⇒ Tập 1 Ngày 7', () => {
  assert.equal(vt(xepLop({ sangLoc: 19, nghe: 11, doc: 10, viet: 4, noi: 4 })), '1/7');   // 4·4·4·4
  assert.equal(vt(xepLop({ sangLoc: 12, nghe: 8, doc: 8, viet: 3.5, noi: 3.5 })), '1/7'); // 3.5·3.5·3.5·3.5
});
test('hàng 3 — Overall 3.5–4.0 và sàng lọc ≥ 20 ⇒ Tập 2 Ngày 1', () => {
  assert.equal(vt(xepLop({ sangLoc: 20, nghe: 11, doc: 10, viet: 4, noi: 4 })), '2/1');
  assert.equal(vt(xepLop({ sangLoc: 30, nghe: 8, doc: 8, viet: 3.5, noi: 3.5 })), '2/1');
});
test('hàng 4 — Overall 4.5 ⇒ Tập 2 Ngày 13 (ghi chú kiểm tra N12)', () => {
  const r = xepLop({ sangLoc: 22, nghe: 13, doc: 13, viet: 4.5, noi: 4.5 });
  assert.equal(vt(r), '2/13');
  assert.match(r.lyDo[1], /Ngày 12/);
});
test('hàng 5 — Overall 5.0 ⇒ Tập 3 Ngày 1', () => {
  assert.equal(vt(xepLop({ sangLoc: 22, nghe: 16, doc: 15, viet: 5, noi: 5 })), '3/1');
});
test('hàng 6 — Overall 5.5 ⇒ Tập 3 Ngày 16', () => {
  assert.equal(vt(xepLop({ sangLoc: 22, nghe: 18, doc: 19, viet: 5.5, noi: 5.5 })), '3/16');
});
test('hàng 7 — Overall 6.0 ⇒ Tập 4 Ngày 1 (+ Đề 6)', () => {
  const r = xepLop({ sangLoc: 22, nghe: 23, doc: 23, viet: 6, noi: 6 });
  assert.equal(vt(r), '4/1');
  assert.match(r.lyDo[1], /Đề 6/);
});
test('hàng 8 — Overall 6.5 ⇒ Tập 4 Ngày 16', () => {
  assert.equal(vt(xepLop({ sangLoc: 22, nghe: 26, doc: 27, viet: 6.5, noi: 6.5 })), '4/16');
});
test('hàng 9 — Overall 7.0 ⇒ Tập 5 Ngày 1', () => {
  assert.equal(vt(xepLop({ sangLoc: 28, nghe: 30, doc: 30, viet: 7, noi: 7 })), '5/1');
});
test('hàng 10 — Overall 7.5 ⇒ Tập 5 Ngày 16', () => {
  assert.equal(vt(xepLop({ sangLoc: 28, nghe: 32, doc: 33, viet: 7.5, noi: 7.5 })), '5/16');
});
test('hàng 11 — Overall ≥ 8.0 ⇒ Tập 5 chỉ luyện đề (Ngày 8 = Đề 9)', () => {
  const r = xepLop({ sangLoc: 30, nghe: 36, doc: 36, viet: 8, noi: 8 });
  assert.equal(vt(r), '5/8');
  assert.match(r.lyDo[1], /chỉ luyện đề/);
  assert.equal(vt(xepLop({ sangLoc: 30, nghe: 40, doc: 40, viet: 9, noi: 9 })), '5/8');
});

test('luật lệch ≥ 1.0 ⇒ đường ôn kèm cùng kỹ năng của tập ngay dưới', () => {
  const k = xepLopChiTiet({ sangLoc: 24, nghe: 23, doc: 23, viet: 5, noi: 6 }); // 6·6·5·6 = 5.75 → 6.0
  assert.equal(k.overall, 6);
  assert.equal(vt(k), '4/1');
  assert.deepEqual(k.duongOnKem, ['Writing — bài Writing của Tập 3, 1 bài/ngày trước bài chính']);
  assert.equal(k.lyDo.length, 3);
  assert.match(k.lyDo[2], /Writing thấp hơn Overall/);
  // Hai kỹ năng lệch ⇒ hai đường.
  const h = xepLopChiTiet({ sangLoc: 24, nghe: 30, doc: 30, viet: 6, noi: 6 }); // 7·7·6·6 = 6.5
  assert.equal(h.overall, 6.5);
  assert.equal(h.duongOnKem.length, 0); // lệch 0.5 — chưa tới 1.0
  const g = xepLopChiTiet({ sangLoc: 24, nghe: 32, doc: 33, viet: 6.5, noi: 6.5 }); // 7.5·7.5·6.5·6.5 = 7.0
  assert.equal(g.overall, 7);
  assert.equal(g.duongOnKem.length, 0); // lệch 0.5
  const m = xepLopChiTiet({ sangLoc: 24, nghe: 35, doc: 35, viet: 6.5, noi: 7 }); // 8·8·6.5·7 = 7.375 → 7.5
  assert.equal(m.overall, 7.5);
  assert.equal(vt(m), '5/16');
  assert.deepEqual(m.duongOnKem.map((d) => d.split(' — ')[0]), ['Writing']); // 7.5 − 6.5 = 1.0 ⇒ ôn kèm Writing Tập 4
});

test('luật lệch ≥ 2.0 ⇒ xếp theo kỹ năng yếu nhất, không theo Overall', () => {
  const y = xepLopChiTiet({ sangLoc: 24, nghe: 26, doc: 27, viet: 4.5, noi: 7 }); // 6.5·6.5·4.5·7 = 6.125 → 6.0... kiểm bên dưới
  // 24.5 / 4 = 6.125 → 6.0; viet 4.5 lệch 1.5 ⇒ chưa phải ≥ 2.0 ⇒ theo Overall, có đường ôn kèm.
  assert.equal(y.overall, 6);
  assert.equal(y.theoKyNang, null);
  assert.equal(vt(y), '4/1');
  const z = xepLopChiTiet({ sangLoc: 24, nghe: 30, doc: 30, viet: 4.5, noi: 7 }); // 7·7·4.5·7 = 6.375 → 6.5; lệch 2.0
  assert.equal(z.overall, 6.5);
  assert.equal(z.theoKyNang, 'viet');
  assert.equal(vt(z), '2/13'); // mốc 4.5 ⇒ hàng 4
  assert.match(z.lyDo[1], /yếu nhất/);
  assert.deepEqual(z.duongOnKem, []); // kỹ năng làm mốc không tự thành đường ôn kèm
  // Mốc yếu nhất rơi vào hàng 2/3 thì vẫn xét sàng lọc.
  assert.equal(vt(xepLopChiTiet({ sangLoc: 15, nghe: 30, doc: 30, viet: 4, noi: 7 })), '1/7');  // 7·7·4·7 = 6.25 → 6.5; mốc 4.0, SL 15
  assert.equal(vt(xepLopChiTiet({ sangLoc: 25, nghe: 30, doc: 30, viet: 4, noi: 7 })), '2/1');
});

test('chưa đủ 4 kỹ năng vẫn xếp được (kỹ năng thiếu không tính vào Overall)', () => {
  assert.equal(vt(xepLop({ sangLoc: 24, nghe: 23, doc: 23 })), '4/1'); // 6·6 → 6.0
  const r = xepLop({ sangLoc: 24 });
  assert.equal(vt(r), '2/1');
  assert.match(r.lyDo[1], /TẠM/);
  assert.equal(vt(xepLop({ sangLoc: 12 })), '1/7');
});

test('đầu vào bẩn: số lẻ, âm, quá trần ⇒ kẹp', () => {
  // 9·9·9·0 = 6.75 → 7.0; Speaking 0 lệch 7.0 ⇒ xếp theo kỹ năng yếu nhất, mốc 0 < 3.5 ⇒ Tập 1 Ngày 1.
  const r = xepLopChiTiet({ sangLoc: 99, nghe: 99, doc: 99, viet: 12, noi: -1 });
  assert.equal(vt(r), '1/1');
  assert.equal(r.theoKyNang, 'noi');
  assert.deepEqual(r.band, { nghe: 9, doc: 9, viet: 9, noi: 0 });
});
