/**
 * npx tsx --test src/services/techTrends/hocFeed/lichHoc.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { THU_VIEN } from './thuVien.js';
import { chonBaiKeTiep, CUA_SO_AI, luotCuaKhung, soBaiMoiNgay, type DaDang } from './lichHoc.js';
import { dongDau, dungNoiDung, idTuNoiDung } from './dungBai.js';
import { dungSvg } from './veAnh.js';

/** Mô phỏng đăng liên tục; trả lịch sử (mới nhất trước). */
function moPhong(soBai: number): DaDang[] {
  const lichSu: DaDang[] = [];
  const t0 = Date.parse('2026-11-10T00:00:00Z');
  for (let i = 0; i < soBai; i++) {
    const luc = t0 + i * 8 * 3_600_000;
    const r = chonBaiKeTiep(THU_VIEN, lichSu, { bayGio: luc, khoaNgay: new Date(luc).toISOString().slice(0, 10), luot: i % 3 });
    if (!r) break;
    lichSu.unshift({ id: r.bai.id, nhom: r.bai.nhom, dinhDang: r.bai.dinhDang, mau: r.bai.anh.mau, luc });
  }
  return lichSu;
}

test('đăng hết thư viện mà KHÔNG lặp bài nào', () => {
  const ls = moPhong(THU_VIEN.length);
  assert.equal(ls.length, THU_VIEN.length);
  assert.equal(new Set(ls.map((h) => h.id)).size, THU_VIEN.length);
});

test('hai bài liền nhau không cùng mẫu ảnh; không 3 bài liền cùng định dạng', () => {
  const ls = [...moPhong(THU_VIEN.length)].reverse();
  let trungMau = 0;
  for (let i = 1; i < ls.length; i++) if (ls[i].mau === ls[i - 1].mau) trungMau++;
  // Luật là "mềm" (nới khi hết lựa chọn ở cuối thư viện) ⇒ cho phép rất ít.
  assert.ok(trungMau <= 2, `trùng mẫu ảnh liền nhau ${trungMau} lần`);
  for (let i = 2; i < ls.length - 3; i++) {
    assert.ok(!(ls[i].dinhDang === ls[i - 1].dinhDang && ls[i].dinhDang === ls[i - 2].dinhDang), `3 bài liền cùng ${ls[i].dinhDang} ở vị trí ${i}`);
  }
});

test('công cụ AI tối đa 1 bài trong mỗi cửa sổ', () => {
  const ls = [...moPhong(THU_VIEN.length)].reverse();
  for (let i = 0; i + CUA_SO_AI <= ls.length; i++) {
    const n = ls.slice(i, i + CUA_SO_AI).filter((h) => h.nhom === 'cong-cu-ai').length;
    assert.ok(n <= 1, `cửa sổ ${i} có ${n} bài AI`);
  }
});

test('10 bài đầu trải ít nhất 6 nhóm chủ đề và 6 định dạng', () => {
  const dau = [...moPhong(10)].reverse();
  assert.ok(new Set(dau.map((h) => h.nhom)).size >= 6, JSON.stringify(dau.map((h) => h.nhom)));
  assert.ok(new Set(dau.map((h) => h.dinhDang)).size >= 6, JSON.stringify(dau.map((h) => h.dinhDang)));
});

test('hết bài mới ⇒ chỉ đăng lại bài cũ hơn 120 ngày', () => {
  const ls = moPhong(THU_VIEN.length);
  const sau = chonBaiKeTiep(THU_VIEN, ls, { bayGio: ls[0].luc + 86_400_000, khoaNgay: 'x', luot: 0 });
  assert.equal(sau, null);
  const xaSau = chonBaiKeTiep(THU_VIEN, ls, { bayGio: ls[0].luc + 200 * 86_400_000, khoaNgay: 'x', luot: 0 });
  assert.ok(xaSau);
});

test('thân bài: tiêu đề là heading hợp lệ, dòng đầu duy nhất, có khối nguồn; đọc ngược được id', () => {
  const theoDongDau = new Map(THU_VIEN.map((b) => [dongDau(b), b.id]));
  assert.equal(theoDongDau.size, THU_VIEN.length, 'hai bài trùng dòng đầu');
  for (const b of THU_VIEN) {
    const c = dungNoiDung(b);
    const dong1 = c.split('\n')[0];
    assert.ok(dong1.length <= 80, `${b.id}: tiêu đề ${dong1.length} ký tự (>80 ⇒ feed không coi là tiêu đề)`);
    assert.ok(!/#hoc-/.test(c), 'không còn tag #hoc-<id>');
    assert.equal(idTuNoiDung(c, theoDongDau), b.id);
    assert.ok(c.includes('```nguon\n'));
    if (b.poll) {
      assert.ok(c.includes('```dapan\n'), `${b.id}: quiz thiếu đáp án ẩn`);
      assert.ok(!c.includes('```output\n'), `${b.id}: quiz để lộ output (= đáp án) ngoài khối ẩn`);
    }
    // Ảnh: mọi mẫu (trừ ảnh thật) dựng được SVG không rỗng.
    if (b.anh.mau !== 'anh') assert.ok(dungSvg(b.anh).length >= 1, `${b.id}: không dựng được ảnh`);
  }
});

test('khung giờ theo số bài/ngày', () => {
  assert.equal(soBaiMoiNgay(undefined), 3);
  assert.equal(soBaiMoiNgay('9'), 5);
  assert.equal(soBaiMoiNgay('abc'), 3);
  assert.equal(luotCuaKhung('07:00', 3), 0);
  assert.equal(luotCuaKhung('10:00', 3), -1);
  assert.equal(luotCuaKhung('22:00', 3), 2);
});
