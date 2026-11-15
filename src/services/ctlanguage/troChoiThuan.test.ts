/**
 * Phần thuần của trò chơi — `npx tsx --test src/services/ctlanguage/troChoiThuan.test.ts`. Không CSDL, không mạng.
 */
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
  chuanMa, chuLoc, dauTuanVn, diemToiDa, GAME_CTL, kiemDiem, kiemThachDau, LoiTroChoi, sinhMa, tenHien,
} from './troChoiThuan.js';

const van = (them: Record<string, unknown> = {}) => ({
  game: 'canh-troi', cheDo: '60-giay', nn: 'zh', diem: 300, dung: 20, sai: 2, chang: 0, thoiGianMs: 60_000, maVan: 'van-abc12345', ...them,
});
const loi = (f: () => unknown, ma: string) => assert.throws(f, (e: unknown) => e instanceof LoiTroChoi && e.ma === ma);

test('kiemDiem: ván hợp lệ đi qua, khung lạ bị bỏ, khung hợp lệ giữ', () => {
  const d = kiemDiem(van({ khung: 'vang' }));
  assert.equal(d.diem, 300);
  assert.equal(d.khung, 'vang');
  assert.equal(kiemDiem(van({ khung: '<script>' })).khung, null);
});

test('kiemDiem: điểm vượt trần theo số câu đúng ⇒ chặn', () => {
  const l = GAME_CTL['canh-troi'];
  assert.equal(diemToiDa(l, 20, 0), 700);
  kiemDiem(van({ diem: 700 }));
  loi(() => kiemDiem(van({ diem: 701 })), 'CTL_TC_DIEM');
  // Vượt chặng: cộng thưởng chặng 20·(1+2+3).
  kiemDiem(van({ cheDo: 'vuot-chang', chang: 3, diem: 20 * 35 + 120, thoiGianMs: 90_000 }));
  loi(() => kiemDiem(van({ cheDo: 'vuot-chang', chang: 3, diem: 20 * 35 + 121, thoiGianMs: 90_000 })), 'CTL_TC_DIEM');
});

test('kiemDiem: Gấu Thư Pháp (viết tay) — trần 40 điểm/chữ, trần tốc độ viết thấp hơn game gõ', () => {
  const l = GAME_CTL['viet-tay'];
  assert.ok(l);
  assert.equal(diemToiDa(l, 10, 0), 400);
  kiemDiem(van({ game: 'viet-tay', dung: 10, diem: 400 }));
  loi(() => kiemDiem(van({ game: 'viet-tay', dung: 10, diem: 401 })), 'CTL_TC_DIEM');
  // 60 giây × 1,2 + 3 = 75 chữ là trần; 76 ⇒ quá nhanh (game gõ thì 20 chữ/60 s vẫn qua dễ).
  kiemDiem(van({ game: 'viet-tay', dung: 75, diem: 100 }));
  loi(() => kiemDiem(van({ game: 'viet-tay', dung: 76, diem: 100 })), 'CTL_TC_NHANH');
  kiemDiem(van({ game: 'viet-tay', cheDo: 'vuot-chang', chang: 2, dung: 9, diem: 9 * 40 + 60, thoiGianMs: 120_000 }));
  loi(() => kiemDiem(van({ game: 'viet-tay', cheDo: 'vuot-chang', chang: 2, dung: 9, diem: 9 * 40 + 61, thoiGianMs: 120_000 })), 'CTL_TC_DIEM');
});

test('kiemDiem: quá nhanh, ván 60 giây kéo dài, chặng trong ván tính giờ ⇒ chặn', () => {
  loi(() => kiemDiem(van({ dung: 200, diem: 100 })), 'CTL_TC_NHANH');
  loi(() => kiemDiem(van({ thoiGianMs: 90_000 })), 'CTL_TC_GIO');
  loi(() => kiemDiem(van({ chang: 2 })), 'CTL_TC_CHANG');
  loi(() => kiemDiem(van({ cheDo: 'vuot-chang', chang: 5, dung: 3, diem: 10, thoiGianMs: 30_000 })), 'CTL_TC_CHANG');
});

test('kiemDiem: số âm/thập phân/game lạ/chế độ lạ/ngôn ngữ lạ/mã ván xấu ⇒ chặn', () => {
  loi(() => kiemDiem(van({ diem: -1 })), 'CTL_TC_SO');
  loi(() => kiemDiem(van({ dung: 2.5 })), 'CTL_TC_SO');
  loi(() => kiemDiem(van({ game: 'khong-co' })), 'CTL_TC_GAME');
  loi(() => kiemDiem(van({ cheDo: 'pk' })), 'CTL_TC_CHE_DO');
  loi(() => kiemDiem(van({ nn: 'fr' })), 'CTL_NN_SAI');
  loi(() => kiemDiem(van({ maVan: 'x' })), 'CTL_TC_MA_VAN');
  loi(() => kiemDiem(van({ maVan: 'a b c d e f g h' })), 'CTL_TC_MA_VAN');
});

test('kiemDiem: thách đấu bắt buộc có mã; chế độ khác không được kèm mã', () => {
  loi(() => kiemDiem(van({ cheDo: 'thach-dau' })), 'CTL_TC_THACH_DAU');
  assert.equal(kiemDiem(van({ cheDo: 'thach-dau', maThachDau: 'abc-234' })).maThachDau, 'ABC234');
  loi(() => kiemDiem(van({ maThachDau: 'ABC234' })), 'CTL_TC_THACH_DAU');
});

test('mã thách đấu: 6 ký tự, không có ký tự dễ nhầm; chuẩn hoá chữ thường + gạch', () => {
  for (let i = 0; i < 200; i++) {
    const m = sinhMa();
    assert.match(m, /^[A-HJKMNP-Z2-9]{6}$/);
    assert.equal(chuanMa(m.toLowerCase()), m);
  }
  loi(() => chuanMa('ABC0O1'), 'CTL_TC_MA');
  loi(() => chuanMa('ABC'), 'CTL_TC_MA');
});

test('kiemThachDau: cắt trần, bỏ trùng chữ, cần ≥ 4 từ, seed hợp lệ', () => {
  const de = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, chu: `chu${i % 5}`, doc: 'doc', nghia: `nghia ${i}`, hanViet: 'x'.repeat(200) }));
  const t = kiemThachDau({ game: 'canh-troi', nn: 'ja', cachHien: 'nghia', seed: 42, tenBo: 'Bộ thử', de });
  assert.equal(t.de.length, 5);            // chu0 lặp ⇒ bỏ
  assert.equal(t.de[0].hanViet!.length, 60);
  assert.equal(t.cachHien, 'nghia');
  assert.equal(kiemThachDau({ game: 'canh-troi', nn: 'ja', cachHien: 'la', seed: 1, de }).cachHien, 'chu-doc');
  loi(() => kiemThachDau({ game: 'canh-troi', nn: 'ja', seed: 0, de }), 'CTL_TC_SEED');
  loi(() => kiemThachDau({ game: 'canh-troi', nn: 'ja', seed: 9, de: de.slice(0, 3) }), 'CTL_TC_DE');
  assert.ok(chuLoc(t).includes('Bộ thử') && chuLoc(t).includes('nghia 1'));
});

test('đầu tuần VN: thứ Hai 00:00 giờ VN (= Chủ nhật 17:00 UTC)', () => {
  // 16/11/2026 là thứ Hai. 15/11 23:00 VN (16:00 UTC, Chủ nhật) vẫn thuộc tuần trước.
  assert.equal(dauTuanVn(new Date('2026-11-16T03:00:00Z')).toISOString(), '2026-11-15T17:00:00.000Z');
  assert.equal(dauTuanVn(new Date('2026-11-15T16:00:00Z')).toISOString(), '2026-11-08T17:00:00.000Z');
  assert.equal(dauTuanVn(new Date('2026-11-22T16:59:00Z')).toISOString(), '2026-11-15T17:00:00.000Z');
});

test('tên hiện: tên bị bộ lọc chặn hoặc trống ⇒ "Người học #id"', () => {
  assert.equal(tenHien('Lan', 7, () => false), 'Lan');
  assert.equal(tenHien('xấu', 7, () => true), 'Người học #7');
  assert.equal(tenHien('  ', 9, () => false), 'Người học #9');
});

test('game Câu Chữ + Bếp Gấu: có luật, trần điểm theo câu, trần tốc độ riêng', () => {
  const cc = GAME_CTL['cau-chu'], bg = GAME_CTL['bep-gau'];
  assert.ok(cc && bg);
  assert.equal(diemToiDa(cc, 10, 0), 400);
  kiemDiem(van({ game: 'cau-chu', dung: 10, diem: 400, thoiGianMs: 30_000 }));
  loi(() => kiemDiem(van({ game: 'cau-chu', dung: 10, diem: 401, thoiGianMs: 30_000 })), 'CTL_TC_DIEM');
  // Câu cá: 2 con/giây là trần (60 s ⇒ ≤ 123 con).
  loi(() => kiemDiem(van({ game: 'cau-chu', dung: 124, diem: 0, thoiGianMs: 60_000 })), 'CTL_TC_NHANH');
  // Bếp: kéo món nhanh hơn ⇒ trần 3 món/giây; vượt chặng cộng thưởng chặng.
  kiemDiem(van({ game: 'bep-gau', dung: 150, diem: 150 * 35, thoiGianMs: 60_000 }));
  kiemDiem(van({ game: 'bep-gau', cheDo: 'vuot-chang', chang: 2, dung: 12, diem: 12 * 35 + 60, thoiGianMs: 80_000 }));
  loi(() => kiemDiem(van({ game: 'bep-gau', cheDo: 'vuot-chang', chang: 2, dung: 12, diem: 12 * 35 + 61, thoiGianMs: 80_000 })), 'CTL_TC_DIEM');
  assert.equal(kiemThachDau({ game: 'bep-gau', nn: 'en', seed: 7, de: ['a', 'b', 'c', 'd'].map((c, i) => ({ id: i, chu: c, nghia: 'x' })) }).game, 'bep-gau');
});

test('game Chạy Ghép Câu: 30 điểm/mảnh, trần 2 mảnh/giây, đề thách đấu là câu ngắn (≤ 40 ký tự)', () => {
  const l = GAME_CTL['chay-ghep-cau'];
  assert.ok(l);
  assert.equal(diemToiDa(l, 10, 0), 300);
  kiemDiem(van({ game: 'chay-ghep-cau', dung: 10, diem: 300, thoiGianMs: 30_000 }));
  loi(() => kiemDiem(van({ game: 'chay-ghep-cau', dung: 10, diem: 301, thoiGianMs: 30_000 })), 'CTL_TC_DIEM');
  // 60 s ⇒ ≤ 123 mảnh.
  kiemDiem(van({ game: 'chay-ghep-cau', dung: 123, diem: 0, thoiGianMs: 60_000 }));
  loi(() => kiemDiem(van({ game: 'chay-ghep-cau', dung: 124, diem: 0, thoiGianMs: 60_000 })), 'CTL_TC_NHANH');
  kiemDiem(van({ game: 'chay-ghep-cau', cheDo: 'vuot-chang', chang: 3, dung: 30, diem: 30 * 30 + 120, thoiGianMs: 120_000 }));
  loi(() => kiemDiem(van({ game: 'chay-ghep-cau', cheDo: 'vuot-chang', chang: 3, dung: 30, diem: 30 * 30 + 121, thoiGianMs: 120_000 })), 'CTL_TC_DIEM');
  // Đề là câu (dữ liệu giả): giữ nguyên câu ≤ 40 ký tự, nghĩa ≤ 60.
  const cau = ['I like green tea.', 'She reads a book.', 'We walk to school.', 'They play in the park.'];
  const t = kiemThachDau({ game: 'chay-ghep-cau', nn: 'en', cachHien: 'nghia', seed: 5, de: cau.map((c, i) => ({ id: -i - 1, chu: c, nghia: `câu thử ${i}` })) });
  assert.deepEqual(t.de.map((m) => m.chu), cau);
});
