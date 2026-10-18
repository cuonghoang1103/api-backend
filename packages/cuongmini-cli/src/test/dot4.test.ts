/**
 * ĐỢT 4 (18/10/2026) — CLI: cảnh báo "đang chạy dở — hãy dừng trước khi đổi chế độ" lạc chỗ sau khi duyệt thẻ,
 * ESC[3J khi đổi cỡ (iTerm2 hỏi "clear scrollback"), viền phải banner lệch (ký tự độ rộng mập mờ), gõ thêm giữa lượt.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { quyetDoiCheDo } from '../cheDo';
import { locXoaScrollback, xoaSach, XOA_KHUNG } from '../toanManHinh';
import { veManMoDau } from '../veBang';
import { KhoChat } from '../kho';
import { datNgonNgu } from '../i18n';
import { doRong } from '../mau';
import { luaChonDuyet } from '../ui/thanhPhan';

test('đổi chế độ GIỮA lượt ⇒ HOÃN (không gọi lõi để ăn lỗi); phím thừa ngay sau khi duyệt thẻ ⇒ bỏ qua', () => {
  const t = 1_000_000;
  assert.equal(quyetDoiCheDo({ dangChay: false, vuaDuyetMs: null, bayGio: t }), 'ngay');
  assert.equal(quyetDoiCheDo({ dangChay: true, vuaDuyetMs: null, bayGio: t }), 'hoan');
  assert.equal(quyetDoiCheDo({ dangChay: true, vuaDuyetMs: t - 100, bayGio: t }), 'boQua', 'shift+tab dính ngay sau khi duyệt ⇒ không đổi chế độ');
  assert.equal(quyetDoiCheDo({ dangChay: false, vuaDuyetMs: t - 5000, bayGio: t }), 'ngay');
  // Thẻ lệnh có "luôn cho phép" ⇒ shift+tab (thói quen Claude Code) chọn đúng lựa chọn đó.
  const lc = luaChonDuyet({ id: 'x', loai: 'xinPhepLenh', lenh: 'npm test', phanLoai: { muc: 'thuong', lyDo: [], choNho: true } } as never);
  assert.ok(lc.some((x) => x.q === 'choPhepCaFile'));
  const mcp = luaChonDuyet({ id: 'y', loai: 'xinPhepMcp', server: 'ctwork', tool: 'sprint_current' } as never);
  assert.deepEqual(mcp.map((x) => x.q), ['choPhep', 'tuChoi'], 'thẻ MCP không có "luôn" ⇒ shift+tab chỉ di chuyển');
});

test('chế độ in nối tiếp: Ink tự xoá màn (ESC[2J ESC[3J ESC[H) ⇒ BỎ ESC[3J; chỉ người dùng chủ động xoá (ctrl+l, /clear) mới qua', () => {
  const ink = '\x1b[2J\x1b[3J\x1b[H';
  assert.equal(locXoaScrollback(ink), '\x1b[2J\x1b[H');
  assert.ok(!XOA_KHUNG.includes('\x1b[3J'), 'đổi cỡ dùng XOA_KHUNG — không ESC[3J');
  const chu = xoaSach();
  assert.equal(locXoaScrollback(chu), chu, 'xoaSach() mở khoá đúng MỘT lần');
  assert.equal(locXoaScrollback(ink), '\x1b[2J\x1b[H');
  assert.equal(locXoaScrollback('abc'), 'abc');
});

test('banner: không ký tự độ rộng mập mờ ("·", "…", "⎇") trong khung có viền phải — viền phải thẳng cột', () => {
  for (const nn of ['vi', 'en'] as const) {
    datNgonNgu(nn);
    const ra = veManMoDau({ phienBan: '0.5.0', ten: 'Cường', thuMuc: `/Users/a/${'x'.repeat(120)}/du-an`, nhanh: 'feature/dai', banMoi: null, lenhCai: '', ngoaiTuyen: false,
      model: 'Sonnet 5', muc: 'Vừa', cheDo: { ten: 'Hỏi trước', icon: '●', mau: '#4ade80' } }, ['LOGO'], 100).map((d) => d.replace(/\x1b\[[0-9;]*m/g, ''));
    const rong = new Set(ra.map((d) => doRong(d)));
    assert.equal(rong.size, 1, `${nn}: mọi dòng cùng bề rộng: ${[...rong].join(',')}`);
    for (const d of ra.slice(1, -1)) assert.doesNotMatch(d, /[·…⎇]/, `${nn}: ${d}`);
    assert.ok(ra.some((d) => d.includes('git:feature/dai')));
  }
  datNgonNgu('vi');
});

test('gõ thêm khi đang chạy: tin chèn hiện "↳", sự kiện daChen báo đã vào lượt (vi/en)', () => {
  for (const nn of ['vi', 'en'] as const) {
    datNgonNgu(nn);
    const k = new KhoChat(true);
    k.batDauLuot('việc A', 0, 'việc A');
    k.themChen('dùng pnpm');
    const nguoi = k.S.bang.filter((m) => m.loai === 'nguoi');
    assert.equal((nguoi.at(-1) as { text: string }).text, '↳ dùng pnpm');
    assert.equal(k.S.dangChay, true, 'chèn KHÔNG mở lượt mới');
    k.xuLy({ loai: 'daChen', text: 'dùng pnpm', cach: 'tool' });
    assert.match(JSON.stringify(k.S.bang.at(-1)), nn === 'vi' ? /Đã chèn tin của bạn vào lượt đang chạy/ : /inserted into the running turn/);
  }
  datNgonNgu('vi');
});
