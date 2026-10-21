/**
 * CuongMini trong CT Work (22/10/2026) — phần THUẦN: `npx tsx --test src/services/work/aiCuongMini22.test.ts`
 *   1. Chống spam lượt được tài trợ (phút / ngày / IP, 0 = tắt), gộp cấu hình admin.
 *   2. Link sâu do MÃ dựng: thẻ/Docs/họp/hàm 5.1/trang mục; link bịa (thẻ không có, dự án khác, trang lạ) bị bỏ; khối mã
 *      không bị đụng; link ngoài giữ nguyên.
 *   3. Dấu tệp đính kèm trong câu hỏi đã lưu (lưu ⇄ tách, lịch sử chỉ còn tên tệp), loại tệp nhận được.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

process.env.STORAGE_SANDBOX ??= '1';

const { BoDemDefault } = await import('../agent/defaultGioiHan.js');
const { kiemChongSpamThuan, gopGioiHanTaiTro, GIOI_HAN_TAI_TRO_MAC_DINH } = await import('./aiTaiTro.js');
const { lienKetHoaThuan, thuThapThamChieu, phanTichDuong } = await import('./aiLienKet.js');
const { ganDauTep, tachDauTep, noiDungChoLichSu, loaiTep } = await import('./aiTep.js');

describe('chống spam lượt được tài trợ', () => {
  const gh = { phutNguoi: 3, ngayNguoi: 5, ngayIp: 7 };
  it('quá nhanh (phút) ⇒ WORK_AI_TOO_FAST kèm số giây chờ; qua 60 s ⇒ hỏi tiếp được', () => {
    const bo = new BoDemDefault();
    const t0 = Date.UTC(2026, 9, 22, 3, 0, 0);
    for (let i = 0; i < 3; i++) { assert.equal(kiemChongSpamThuan(bo, gh, { userId: 1, ip: '1.1.1.1', now: t0 + i }).ok, true); bo.ghi(1, '1.1.1.1', t0 + i); }
    const kq = kiemChongSpamThuan(bo, gh, { userId: 1, ip: '1.1.1.1', now: t0 + 1000 });
    assert.equal(kq.ok, false);
    if (!kq.ok) { assert.equal(kq.ma, 'WORK_AI_TOO_FAST'); assert.ok(kq.thuLaiSauGiay >= 58 && kq.thuLaiSauGiay <= 60); assert.match(kq.cau, /câu\/phút/); }
    assert.equal(kiemChongSpamThuan(bo, gh, { userId: 1, ip: '1.1.1.1', now: t0 + 61_000 }).ok, true);
  });
  it('trần ngày theo người và theo IP (nhiều tài khoản một IP)', () => {
    const bo = new BoDemDefault();
    const t0 = Date.UTC(2026, 9, 22, 3, 0, 0);
    for (let i = 0; i < 5; i++) bo.ghi(1, '2.2.2.2', t0 + i * 120_000);
    const a = kiemChongSpamThuan(bo, gh, { userId: 1, ip: '9.9.9.9', now: t0 + 11 * 60_000 });
    assert.equal(a.ok, false); if (!a.ok) assert.equal(a.ma, 'WORK_AI_DAILY_CAP');
    bo.ghi(2, '2.2.2.2', t0 + 20 * 60_000); bo.ghi(3, '2.2.2.2', t0 + 21 * 60_000);
    const b = kiemChongSpamThuan(bo, gh, { userId: 4, ip: '2.2.2.2', now: t0 + 30 * 60_000 });
    assert.equal(b.ok, false); if (!b.ok) assert.equal(b.ma, 'WORK_AI_IP_CAP');
    assert.equal(kiemChongSpamThuan(bo, gh, { userId: 4, ip: '3.3.3.3', now: t0 + 30 * 60_000 }).ok, true);
  });
  it('0 = tắt; cấu hình admin hỏng ⇒ mặc định', () => {
    const bo = new BoDemDefault();
    const tat = { phutNguoi: 0, ngayNguoi: 0, ngayIp: 0 };
    for (let i = 0; i < 50; i++) bo.ghi(1, '1.1.1.1', 1_000 + i);
    assert.equal(kiemChongSpamThuan(bo, tat, { userId: 1, ip: '1.1.1.1', now: 2_000 }).ok, true);
    assert.deepEqual(gopGioiHanTaiTro({ phutNguoi: -1, ngayNguoi: 'x', ngayIp: 20 }), { ...GIOI_HAN_TAI_TRO_MAC_DINH, ngayIp: 20 });
  });
});

describe('link sâu do mã dựng', () => {
  const c = { slug: 'ws1', key: 'LFD' };
  const d = {
    issues: new Set([12, 75]),
    docs: new Map([[3, 'How to run [LFD]']]),
    meetings: new Map([[5, 'Sprint review']]),
    units: new Map([[41, 'AuthService.login']]),
  };
  it('mã thẻ trần + token ⇒ link thật; thẻ/trang không tồn tại ⇒ chữ thường', () => {
    const out = lienKetHoaThuan('Làm LFD-12 trước, rồi LFD-999. Đọc [[doc:3]] và [[doc:8]], xem [[meeting:5]], hàm [[unit:41]], [[page:board]], [[page:hack]].', c, d);
    assert.match(out, /\[LFD-12\]\(\/work\/ws1\/LFD\/issue\/12\)/);
    assert.ok(out.includes('LFD-999') && !out.includes('/issue/999'));
    assert.match(out, /\[Docs #3 — How to run LFD\]\(\/work\/ws1\/LFD\/docs\/3\)/);
    assert.ok(out.includes('Docs #8') && !out.includes('/docs/8'));
    assert.match(out, /\[Họp #5 — Sprint review\]\(\/work\/ws1\/LFD\/meetings\/5\)/);
    assert.match(out, /\[5\.1 · AuthService\.login\]\(\/work\/ws1\/LFD\/tests\?tab=unit&fn=41\)/);
    assert.match(out, /\[board\]\(\/work\/ws1\/LFD\/board\)/);
    assert.ok(!out.includes('/hack'));
  });
  it('link Markdown model tự viết: đúng ⇒ giữ; thẻ không có / dự án khác / trang lạ ⇒ bỏ link giữ chữ; link ngoài giữ', () => {
    const out = lienKetHoaThuan('[A](/work/ws1/LFD/issue/75) [B](/work/ws1/LFD/issue/76) [C](/work/khac/LFD/issue/12) [D](/work/ws1/LFD/admin/secret) [E](https://spring.io/guides)', c, d);
    assert.ok(out.includes('[A](/work/ws1/LFD/issue/75)'));
    assert.ok(out.includes(' B ') && !out.includes('issue/76'));
    assert.ok(!out.includes('/work/khac'));
    assert.ok(!out.includes('/admin/secret'));
    assert.ok(out.includes('[E](https://spring.io/guides)'));
  });
  it('không đụng khối mã; không link lại mã thẻ đã nằm trong link', () => {
    const src = 'Xem `LFD-12` và\n```\nLFD-75 trong code\n```\n[LFD-75](/work/ws1/LFD/issue/75)';
    const out = lienKetHoaThuan(src, c, d);
    assert.ok(out.includes('`LFD-12`'));
    assert.ok(out.includes('```\nLFD-75 trong code\n```'));
    assert.equal(out.match(/\/issue\/75/g)?.length, 1);
  });
  it('thu thập tham chiếu cần tra + phân tích đường', () => {
    const t = thuThapThamChieu('LFD-1 [[doc:2]] [x](/work/ws1/LFD/meetings/4) [[unit:9]] `LFD-77`', c);
    assert.deepEqual(t, { issues: [1], docs: [2], meetings: [4], units: [9] });
    assert.deepEqual(phanTichDuong('/work/ws1/LFD/tests?tab=unit&fn=41', c), { loai: 'unit', so: 41 });
    assert.equal(phanTichDuong('/work/ws2/LFD/issue/1', c), null);
  });
});

describe('dấu tệp đính kèm', () => {
  const f = [{ key: 'work/7/ai/u1/abc/a.png', name: 'màn hình.png', mime: 'image/png', size: 100, kind: 'image' as const }];
  it('lưu ⇄ tách; lịch sử chỉ còn tên tệp', () => {
    const s = ganDauTep('Lỗi này là gì?', f);
    assert.deepEqual(tachDauTep(s), { text: 'Lỗi này là gì?', files: f });
    assert.equal(noiDungChoLichSu(s), 'Lỗi này là gì?\n(attached: màn hình.png)');
    assert.deepEqual(tachDauTep('không có tệp'), { text: 'không có tệp', files: [] });
    assert.deepEqual(tachDauTep('x\n\n<ctw-tep>[hỏng</ctw-tep>').files, []);
  });
  it('loại tệp nhận được', () => {
    assert.equal(loaiTep('a.PNG', ''), 'image');
    assert.equal(loaiTep('a.pdf', 'application/pdf'), 'document');
    assert.equal(loaiTep('a.docx', ''), 'document');
    assert.equal(loaiTep('a.xlsx', ''), 'document');
    assert.equal(loaiTep('Main.java', ''), 'document');
    assert.equal(loaiTep('a.exe', 'application/octet-stream'), null);
  });
});
