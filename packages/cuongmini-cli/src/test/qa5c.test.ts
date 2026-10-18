/**
 * QA độc lập đợt 4+5 (18/10/2026, mục 5c của docs/cuongmini-doi-chieu-nang-luc.md) — mỗi test ứng với một lỗi đã
 * THẤY trên màn hình khi chạy bản dựng thật + lõi thật trong PTY với máy chủ giả.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import stringWidth from 'string-width';
import { datNgonNgu } from '../i18n';
import { LENH_CLI, moNgan, troGiupGon } from '../lenhMoTa';
import type { LenhGachCli } from '../lenhMoTa';

// Nạp động (đường trong biến) để `tsc` của gói CLI không kéo cả cây React của app qua lenhGach.ts — CLI dùng bí danh `ct-lenh`.
const DUONG_LENH_GACH = '../../../../desktop/src/renderer/features/chat/lenhGach';
const { LENH_AGENT } = await import(DUONG_LENH_GACH) as { LENH_AGENT: LenhGachCli[] };
const DS = [...LENH_AGENT.filter((l) => l.ten !== '/offline'), ...LENH_CLI];

test('/help gọn: mô tả không cụt giữa câu (QA: "/sprint  The running", "/quyen  View, add a prefix"), cột thẳng', () => {
  for (const n of ['en', 'vi'] as const) {
    datNgonNgu(n);
    const chu = troGiupGon(DS, []);
    assert.doesNotMatch(chu, /\/sprint +The running\n/);
    assert.doesNotMatch(chu, /\/quyen +(View, add a prefix|Xem, thêm tiền tố)\n/);
    // Mọi dòng lệnh: mô tả bắt đầu ở CÙNG một cột (kể cả /terminal-setup dài 15 ký tự).
    const cot = new Set(chu.split('\n').filter((d) => /^ {2}\/\S/.test(d)).map((d) => stringWidth(d.match(/^ {2}\/\S+ +/)![0])));
    assert.equal(cot.size, 1, `cột mô tả lệch: ${[...cot].join(',')}`);
    for (const l of DS) {
      const m = moNgan(l);
      assert.ok(m.length >= 6, `${l.ten}: "${m}"`);
      assert.doesNotMatch(m, /[(\-—,:]$/, `${l.ten}: "${m}"`);
    }
  }
  datNgonNgu('en');
  assert.equal(moNgan({ ten: '/sprint', mo: '' }), 'The running CT Work sprint');
  assert.match(troGiupGon(DS, []), /\/ctwork +CT Work: menu sprint · my work/);
  datNgonNgu('vi');
});

test('/mcp ở English: lỗi server do lõi viết tiếng Việt được dịch (QA: "✘ không chạy được …", "server đã thoát (mã 0)")', async () => {
  const { dichLoiMcp } = await import('../moTaHaiNgu');
  datNgonNgu('en');
  assert.equal(dichLoiMcp('không chạy được "/x/y": spawn /x/y ENOENT'), 'cannot start "/x/y": spawn /x/y ENOENT');
  assert.equal(dichLoiMcp('không khởi động xong trong 30s'), 'did not start within 30s');
  assert.equal(dichLoiMcp('server đã thoát (mã 0)'), 'server exited (code 0)');
  assert.equal(dichLoiMcp('đã tắt'), 'disabled');
  datNgonNgu('vi');
  assert.equal(dichLoiMcp('đã tắt'), 'đã tắt');
});

test('phím dồn trên thẻ ("\\r\\r", "1\\r") ⇒ lấy phím đầu (QA: Enter đúp trên thẻ duyệt "không ăn")', async () => {
  const { tachPhimDon } = await import('../banPhim');
  assert.deepEqual(tachPhimDon('\r\r', true), { input: '\r', enter: true });
  assert.deepEqual(tachPhimDon('1\r', true), { input: '1', enter: false });
  assert.equal(tachPhimDon('\r\r', false), null, 'không có thẻ ⇒ để ô nhập xử lý như cũ');
  assert.equal(tachPhimDon('ab\r', true), null);
  assert.equal(tachPhimDon('1', true), null);
});
