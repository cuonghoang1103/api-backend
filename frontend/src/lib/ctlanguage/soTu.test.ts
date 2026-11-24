/**
 * Sổ từ dùng chung với app iOS — khoá, id tạm, SM-2, dựng / áp bản ghi đúng khuôn máy chủ.
 * Chạy: npx tsx --test frontend/src/lib/ctlanguage/soTu.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chuanBanGhi } from '../../../../src/services/ctlanguage/soTuDongBoThuan';
import {
  GIOI_HAN_FREE, apKeo, banGhiNgay, banGhiSo, banGhiThe, chamThe, guongRong, idTam, khoaThe, khoaTu, moTaCham, nguonSoHtv,
  soNgayLienTiep, theHtvTheoKhoa, theMoi, themVaoSo, denHan, khoaNgay,
} from './soTu';

const LUC = new Date('2026-11-24T08:00:00.000Z');

test('khoá từ giống máy chủ + app: en chữ thường gộp khoảng trắng, ja/zh nguyên chữ', () => {
  assert.equal(khoaTu('en', '  Take   Off '), 'take off');
  assert.equal(khoaTu('ja', '勉強'), '勉強');
  assert.equal(khoaTu('zh', ' 你好 '), '你好');
});

test('id tạm khớp từng số với Swift (KhoHocTuVungCTL.idTam — đo bằng swift 24/11/2026)', () => {
  assert.equal(idTam('hello'), -835831723);
  assert.equal(idTam('take off'), -527461023);
  assert.equal(idTam('勉強'), -270343721);
  assert.equal(idTam('你好'), -319451238);
  assert.equal(idTam('café'), -356211068);
});

test('bản ghi web dựng ra đều qua bộ kiểm của máy chủ (không bị từ chối câm)', () => {
  const t = theMoi({ id: -835831723, chu: 'hello', doc: '/həˈləʊ/', nghiaVi: 'xin chào', thongDung: true }, 'en', 'ABC-123', LUC);
  const ds = [
    banGhiThe(t, LUC),
    banGhiSo({ id: 'ABC-123', ten: 'Học từ vựng', nn: 'en', taoLuc: LUC.toISOString(), nguon: nguonSoHtv('en') }, LUC),
    banGhiNgay(LUC),
  ];
  for (const r of ds) {
    const kq = chuanBanGhi(JSON.parse(JSON.stringify(r)), new Date('2026-11-24T09:00:00Z'));
    assert.ok('capNhat' in kq, `${r.loai} bị từ chối: ${JSON.stringify(kq)}`);
  }
  assert.equal(ds[0]!.khoa, 'en--835831723');
});

test('SM-2 rút gọn đúng như LichOn.cham của app', () => {
  const t0 = theMoi({ id: 1, chu: 'a' }, 'en', null, LUC);
  const q = chamThe(t0, 'quen', LUC);
  assert.equal(q.lanQuen, 1);
  assert.equal(Date.parse(q.denHan) - LUC.getTime(), 10 * 60_000);
  const n1 = chamThe(t0, 'nho', LUC);
  assert.equal(n1.khoangNgay, 1);
  const n2 = chamThe(n1, 'nho', LUC);
  assert.equal(n2.khoangNgay, 3);
  const n3 = chamThe(n2, 'nho', LUC);
  assert.equal(n3.khoangNgay, 7.5);
  const d1 = chamThe(t0, 'de', LUC);
  assert.equal(d1.lanDung, 2);
  assert.equal(d1.khoangNgay, 4.2); // 3 × 1,4
  const k1 = chamThe(t0, 'kho', LUC);
  assert.equal(k1.khoangNgay, 0.6);
  assert.equal(moTaCham(t0, 'quen', LUC), '10 phút');
  assert.equal(moTaCham(t0, 'nho', LUC), '1 ngày');
});

test('áp bản ghi kéo về: thẻ, sổ, bia mộ, ngày; sổ "Học từ vựng" theo khoá từ', () => {
  const so = { id: 'S1', ten: 'Học từ vựng', nn: 'en' as const, taoLuc: LUC.toISOString(), nguon: nguonSoHtv('en') };
  const t1 = theMoi({ id: 10, chu: 'Apple' }, 'en', 'S1', LUC);
  const t2 = theMoi({ id: 11, chu: 'pear' }, 'en', null, LUC);
  let g = apKeo(guongRong(), [banGhiSo(so, LUC), banGhiThe(t1, LUC), banGhiThe(t2, LUC), banGhiNgay(LUC)], '42');
  assert.equal(g.moc, '42');
  assert.equal(g.the.size, 2);
  const m = theHtvTheoKhoa(g, 'en');
  assert.deepEqual([...m.keys()], ['apple']);
  g = apKeo(g, [{ loai: 'the', khoa: khoaThe('en', 10), capNhat: LUC.toISOString(), xoa: true }]);
  assert.equal(g.the.size, 1);
  assert.ok(g.ngay.has(khoaNgay(LUC)));
  // Bản ghi lạ không làm hỏng gương.
  g = apKeo(g, [{ loai: 'the', khoa: 'en-99', capNhat: LUC.toISOString(), duLieu: { rac: 1 } }]);
  assert.equal(g.the.size, 1);
});

test('thêm vào sổ: thẻ có sẵn (cùng id hoặc cùng chữ) chỉ gắn sổ; bản miễn phí chặn ở 200 thẻ', () => {
  const t = theMoi({ id: 5, chu: 'dog' }, 'en', null, LUC);
  const g = apKeo(guongRong(), [banGhiThe(t, LUC)]);
  const kq = themVaoSo(g, [{ id: -1, chu: 'dog' }, { id: 6, chu: 'cat' }], 'en', 'S1', { laPro: false, bayGio: LUC });
  assert.equal(kq.moi, 1);
  assert.equal(kq.banGhi.length, 2);
  assert.deepEqual((kq.banGhi[0]!.duLieu as { so: string[] }).so, ['S1']);
  const day = apKeo(guongRong(), Array.from({ length: GIOI_HAN_FREE }, (_, i) => banGhiThe(theMoi({ id: 1000 + i, chu: `w${i}` }, 'en', null, LUC), LUC)));
  const chan = themVaoSo(day, [{ id: 1, chu: 'new' }], 'en', 'S1', { laPro: false, bayGio: LUC });
  assert.equal(chan.chan, true);
  assert.equal(themVaoSo(day, [{ id: 1, chu: 'new' }], 'en', 'S1', { laPro: true, bayGio: LUC }).moi, 1);
});

test('đến hạn + chuỗi ngày', () => {
  const a = theMoi({ id: 1, chu: 'a' }, 'en', null, LUC);
  const b = { ...a, muc: { id: 2, chu: 'b' }, denHan: new Date(LUC.getTime() + 86_400_000).toISOString() };
  assert.deepEqual(denHan([a, b], LUC).map((t) => t.muc.chu), ['a']);
  const hom = new Date(2026, 10, 24, 10);
  const ngay = new Set(['2026-11-24', '2026-11-23', '2026-11-21']);
  assert.equal(soNgayLienTiep(ngay, hom), 2);
  assert.equal(soNgayLienTiep(new Set(['2026-11-23']), hom), 1);
});
