/**
 * Kiểm lịch ôn thẻ từ (SM-2 cải biên) + giãn cách Sổ lỗi — `npx tsx --test src/services/ielts/srs.test.ts`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chamThe, THE_MOI, daThuoc, ngayVN, cuoiNgayVN, chuoiNgay, luiNgay, henSoLoiMoi, lamLaiSoLoi, type TheSrs, type Diem } from './srs.js';

const NGAY = 86_400_000;
const now = new Date('2026-10-07T03:00:00.000Z'); // 10:00 giờ VN

test('thẻ mới: Khó 1 ngày < Nhớ 2 ngày < Dễ 4 ngày; Quên hẹn 1 phút', () => {
  const kho = chamThe(THE_MOI, 2, now), nho = chamThe(THE_MOI, 3, now), de = chamThe(THE_MOI, 4, now), quen = chamThe(THE_MOI, 1, now);
  assert.deepEqual([kho.khoang, nho.khoang, de.khoang], [1, 2, 4]);
  assert.equal(quen.khoang, 0);
  assert.equal(quen.hanLuc.getTime() - now.getTime(), 60_000);
  assert.equal(quen.quen, 0, 'thẻ chưa từng nhớ thì quên không tính là "lapse"');
  assert.equal(nho.hanLuc.getTime() - now.getTime(), 2 * NGAY);
});

test('ở MỌI trạng thái: Khó < Nhớ < Dễ (bấm dễ hơn không bao giờ hẹn sớm hơn)', () => {
  for (const ease of [1.3, 1.7, 2.5, 3]) {
    for (const lan of [0, 1, 2, 5]) {
      for (const khoang of [0, 1, 3, 10, 60]) {
        const t: TheSrs = { ease, khoang, lan, quen: 0 };
        const [a, b, c] = ([2, 3, 4] as Diem[]).map((d) => chamThe(t, d, now).khoang);
        assert.ok(a < b && b < c, `ease ${ease} lần ${lan} khoảng ${khoang}: ${a} ${b} ${c}`);
      }
    }
  }
});

test('chuỗi Nhớ liên tiếp giãn dần, có trần 365 ngày, ease trong [1.3, 3]', () => {
  let t: TheSrs = THE_MOI;
  const ds: number[] = [];
  for (let i = 0; i < 12; i++) { const r = chamThe(t, 3, now); ds.push(r.khoang); t = r; }
  for (let i = 1; i < ds.length; i++) assert.ok(ds[i] >= ds[i - 1]);
  assert.ok(ds.at(-1)! <= 365);
  let e: TheSrs = THE_MOI;
  for (let i = 0; i < 20; i++) e = chamThe(e, 2, now);
  assert.ok(e.ease >= 1.3);
  for (let i = 0; i < 20; i++) e = chamThe(e, 4, now);
  assert.ok(e.ease <= 3);
});

test('quên một thẻ đã thuộc: về 0, đếm 1 lần quên, giảm ease', () => {
  const t: TheSrs = { ease: 2.5, khoang: 20, lan: 4, quen: 0 };
  const r = chamThe(t, 1, now);
  assert.deepEqual([r.khoang, r.lan, r.quen, r.ease], [0, 0, 1, 2.3]);
  assert.equal(daThuoc(t), true);
  assert.equal(daThuoc(r), false);
});

test('ngày giờ VN: 23:30 UTC là sáng hôm sau ở VN; cuối ngày đúng 16:59:59.999 UTC', () => {
  assert.equal(ngayVN(new Date('2026-10-07T23:30:00Z')), '2026-10-08');
  assert.equal(ngayVN(new Date('2026-10-07T16:59:00Z')), '2026-10-07');
  assert.equal(cuoiNgayVN(now).toISOString(), '2026-10-07T16:59:59.999Z');
  assert.equal(luiNgay('2026-10-01', 1), '2026-09-30');
});

test('chuỗi ngày: hôm nay chưa học vẫn giữ chuỗi tới hôm qua; đứt thì dừng', () => {
  assert.equal(chuoiNgay(['2026-10-07', '2026-10-06', '2026-10-05', '2026-10-03'], '2026-10-07'), 3);
  assert.equal(chuoiNgay(['2026-10-06', '2026-10-05'], '2026-10-07'), 2);
  assert.equal(chuoiNgay(['2026-10-04'], '2026-10-07'), 0);
});

test('Sổ lỗi: sai → hẹn 2 ngày; đúng lần 1 → hẹn 7 ngày; đúng lần 2 → vững; sai lại → về đầu', () => {
  const m = henSoLoiMoi(now);
  assert.equal(m.buoc, 0);
  assert.equal(m.hanOn.getTime() - now.getTime(), 2 * NGAY);
  const a = lamLaiSoLoi(0, true, now);
  assert.equal(a.buoc, 1);
  assert.equal(a.hanOn.getTime() - now.getTime(), 7 * NGAY);
  const b = lamLaiSoLoi(1, true, now);
  assert.deepEqual([b.buoc, b.daXong], [2, true]);
  const c = lamLaiSoLoi(1, false, now);
  assert.deepEqual([c.buoc, c.daXong, c.saiThem], [0, false, true]);
  assert.equal(c.hanOn.getTime() - now.getTime(), 2 * NGAY);
});
