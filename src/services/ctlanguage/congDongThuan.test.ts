/**
 * Logic thuần của cộng đồng CT Language — `npx tsx --test src/services/ctlanguage/congDongThuan.test.ts` (không cần CSDL).
 */
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { diemNoiBat, diemXepHang, docKhoang, docLoai, huyHieu, locThe, theCuaNn, timNhac, trich, tuNgayXepHang } from './congDongThuan.js';

const gio = (h: number, bayGio: Date) => new Date(bayGio.getTime() - h * 3_600_000);

test('Nổi bật: tương tác kéo lên, tuổi kéo xuống, BTV cộng thêm', () => {
  const now = new Date('2026-11-14T12:00:00Z');
  const moiTrong = diemNoiBat({ soThich: 0, soTraLoi: 0, soXem: 0, btv: false, createdAt: gio(1, now) }, now);
  const moiHot = diemNoiBat({ soThich: 10, soTraLoi: 5, soXem: 100, btv: false, createdAt: gio(1, now) }, now);
  const cuHot = diemNoiBat({ soThich: 10, soTraLoi: 5, soXem: 100, btv: false, createdAt: gio(24 * 7, now) }, now);
  assert.ok(moiHot > moiTrong, 'nhiều tương tác hơn ⇒ cao hơn');
  assert.ok(moiHot > cuHot, 'cùng tương tác, mới hơn ⇒ cao hơn');
  assert.ok(diemNoiBat({ soThich: 0, soTraLoi: 0, soXem: 0, btv: true, createdAt: gio(1, now) }, now) > moiTrong, 'BTV chọn cộng điểm');
  // Lượt xem có trần 500 — cày xem không vượt được tương tác thật quá nhiều.
  const cayXem = diemNoiBat({ soThich: 0, soTraLoi: 0, soXem: 1_000_000, btv: false, createdAt: gio(1, now) }, now);
  const xem500 = diemNoiBat({ soThich: 0, soTraLoi: 0, soXem: 500, btv: false, createdAt: gio(1, now) }, now);
  assert.equal(cayXem, xem500);
  // Bài "tương lai" (đồng hồ lệch) không cho điểm vô hạn.
  assert.ok(Number.isFinite(diemNoiBat({ soThich: 1, soTraLoi: 0, soXem: 0, btv: false, createdAt: gio(-5, now) }, now)));
});

test('huy hiệu: Người mới / Hay giúp đỡ / Chuyên gia / Tích cực / Pro / BTV', () => {
  const co = (d: Parameters<typeof huyHieu>[0]) => huyHieu(d).map((h) => h.ma);
  assert.deepEqual(co({ soBai: 1, soTraLoi: 0, soHayNhat: 0, laPro: false, laAdmin: false }), ['nguoi-moi']);
  assert.deepEqual(co({ soBai: 2, soTraLoi: 5, soHayNhat: 3, laPro: true, laAdmin: false }), ['hay-giup', 'pro']);
  assert.deepEqual(co({ soBai: 2, soTraLoi: 30, soHayNhat: 20, laPro: false, laAdmin: false }), ['chuyen-gia', 'tich-cuc']);
  assert.deepEqual(co({ soBai: 0, soTraLoi: 0, soHayNhat: 0, laPro: true, laAdmin: true }), ['btv'], 'admin: BTV, không kèm Người mới/Pro');
  assert.deepEqual(co({ soBai: 3, soTraLoi: 1, soHayNhat: 0, laPro: false, laAdmin: false }), []);
});

test('điểm xếp hạng + khoảng', () => {
  assert.equal(diemXepHang({ traLoi: 3, duocThich: 4, hayNhat: 1 }), 3 * 2 + 4 + 10);
  assert.equal(docKhoang('thang'), 'thang');
  assert.equal(docKhoang('bừa'), 'tuan');
  const now = new Date('2026-11-14T00:00:00Z');
  assert.equal(tuNgayXepHang('tuan', now).toISOString(), '2026-11-07T00:00:00.000Z');
});

test('thẻ: danh sách trắng theo ngôn ngữ, bỏ trùng, tối đa 4', () => {
  assert.deepEqual(locThe('ja', ['N3', 'kanji', 'n3', 'hsk1', 'ngu-phap', 'tu-vung', 'phat-am']), ['n3', 'kanji', 'ngu-phap', 'tu-vung']);
  assert.deepEqual(locThe('zh', ['hsk6', 'ielts']), ['hsk6']);
  assert.deepEqual(locThe('en', 'ielts'), [], 'không phải mảng ⇒ rỗng');
  assert.ok(theCuaNn('en').some((t) => t.ma === 'ielts'));
  assert.ok(!theCuaNn('en').some((t) => t.ma === 'n5'));
  assert.equal(docLoai('tim-ban'), 'tim-ban');
  assert.equal(docLoai('quang-cao'), 'hoi');
});

test('@nhắc tên: bắt username, bỏ email, bỏ dấu chấm cuối, tối đa 5', () => {
  assert.deepEqual(timNhac('Cảm ơn @minh_anh. Hỏi thêm @Lan99 nhé'), ['minh_anh', 'lan99']);
  assert.deepEqual(timNhac('mail mình là ab@gmail.com'), []);
  assert.deepEqual(timNhac('@ab quá ngắn, @abc được'), ['abc']);
  assert.equal(timNhac('@u001 @u002 @u003 @u004 @u005 @u006').length, 5);
});

test('đoạn trích: cắt ở ranh giới từ, gộp khoảng trắng', () => {
  assert.equal(trich('a  b\n\nc'), 'a b c');
  const dai = 'từ '.repeat(200);
  const t = trich(dai, 50);
  assert.ok(t.length <= 51 && t.endsWith('…'));
  assert.ok(!t.includes('  '));
});
