/**
 * Khung thư chung CuongThai.com + 6 mẫu thư giao dịch (không DB, không gửi thật):
 *   npx tsx --test src/services/emailLayout.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { displayLink, plainText, renderSiteEmail, richText, SITE_LOGO_URL } from './emailLayout.js';
import {
  buildCourseReceiptEmail, buildCourseRefundEmail, buildOtpEmail, buildPasswordResetEmail, buildShopReceiptEmail, buildVerificationEmail,
} from './email.service.js';
import { buildDeletionRequestAdminEmail } from './accountDeletion.service.js';
import { buildAdminReviewEmail } from './notification.service.js';
import { buildReminderEmail } from './myLanguage.reminder.service.js';

const EVIL = '<img src=x onerror=alert(1)>&"\'';

describe('khung thư chung (emailLayout)', () => {
  it('escape MỌI dữ liệu: tiêu đề, lời chào, đoạn văn, bảng, trích dẫn, nút', () => {
    const { html, text } = renderSiteEmail({
      heading: `H ${EVIL}`, greeting: `Xin chào ${EVIL},`, preheader: EVIL,
      blocks: [
        { type: 'p', text: `**đậm** ${EVIL} \`code ${EVIL}\`` },
        { type: 'table', rows: [{ label: EVIL, value: EVIL }], total: { label: 'Tổng', value: EVIL } },
        { type: 'quote', text: EVIL, caption: EVIL },
        { type: 'callout', tone: 'warning', title: EVIL, text: EVIL },
        { type: 'list', items: [EVIL] },
        { type: 'code', code: EVIL },
        { type: 'button', label: EVIL, url: `https://x.y/"><script>` },
      ],
      reason: EVIL,
    });
    assert.ok(!html.includes('<img src=x'), 'không có thẻ img do người dùng chèn');
    assert.ok(!html.includes('<script>'));
    assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;&amp;&quot;&#39;'));
    assert.ok(html.includes('href="https://x.y/&quot;&gt;&lt;script&gt;"'));
    assert.ok(html.includes('<strong>đậm</strong>'), '**đậm** vẫn áp sau khi escape');
    // Bản chữ trơn giữ nguyên văn (không escape, không dấu **).
    assert.ok(text.includes(`đậm ${EVIL}`));
    assert.ok(!text.includes('**'));
  });

  it('nút chống đạn + dòng "Nút không bấm được?" (tắt được), logo tuyệt đối, dark mode, chân thư đủ', () => {
    const url = 'https://cuongthai.com/verify-email?token=AbCdEfGhIjKlMnOpQrStUvWxYz0123456789';
    const a = renderSiteEmail({ heading: 'H', blocks: [{ type: 'button', label: 'Bấm', url }], reason: 'Lý do R' });
    assert.ok(a.html.includes(`bgcolor="#6d3fd9"`), 'ô bảng có bgcolor (Outlook)');
    assert.ok(a.html.includes('Nút không bấm được? Mở liên kết:'));
    assert.equal((a.html.match(new RegExp(`href="${url.replace(/[?]/g, '\\?')}"`, 'g')) ?? []).length, 2, 'href đủ ở nút + dòng dự phòng');
    assert.ok(a.html.includes('>cuongthai.com/verify-email?token=AbCdEf…6789<'), 'chữ hiển thị gọn');
    assert.ok(a.html.includes(`src="${SITE_LOGO_URL}"`) && a.html.includes('alt="CuongThai.com"'));
    assert.ok(a.html.includes('prefers-color-scheme:dark') && a.html.includes('color-scheme'));
    assert.ok(a.html.includes('Lý do R') && a.html.includes('Liên hệ CuongThai.com') && a.html.includes(`© ${new Date().getFullYear()} CuongThai.com`));
    assert.ok(a.html.includes('max-width:560px'));
    assert.ok(a.text.includes(`Bấm:\n${url}`) && a.text.includes('Lý do R') && a.text.includes('/#contact'));
    const b = renderSiteEmail({ heading: 'H', blocks: [{ type: 'button', label: 'Bấm', url, fallback: false }], reason: 'R', signoff: null });
    assert.ok(!b.html.includes('Nút không bấm được'));
    assert.ok(!b.html.includes('Thân mến'));
  });

  it('richText / plainText / displayLink', () => {
    assert.equal(plainText('a **b** `c`'), 'a b c');
    assert.ok(richText('`x<y`').includes('x&lt;y</code>'));
    assert.equal(displayLink('https://a.com/x'), 'a.com/x');
  });
});

describe('mẫu thư giao dịch', () => {
  it('OTP: tiêu đề có mã, ô mã lớn, cảnh báo bảo mật khi đặt lại', () => {
    const v = buildOtpEmail({ fullName: 'Cường', otp: '123456', type: 'verify' });
    assert.equal(v.subject, 'Mã xác thực CuongThai.com: 123456');
    assert.ok(v.html.includes('>123456<') && v.html.includes('5 phút') && v.html.includes('Xin chào Cường,'));
    const r = buildOtpEmail({ otp: '654321', type: 'reset', ttlMinutes: 15 });
    assert.equal(r.subject, 'Mã đặt lại mật khẩu CuongThai.com: 654321');
    assert.ok(r.html.includes('Lưu ý bảo mật') && r.html.includes('15 phút') && r.html.includes('Xin chào,'));
    assert.ok(r.text.includes('654321') && r.text.includes('15 phút'));
  });

  it('link xác thực / đặt lại: giữ URL, escape tên', () => {
    const v = buildVerificationEmail({ fullName: EVIL, verifyUrl: 'https://cuongthai.com/verify-email?token=t1' });
    assert.equal(v.subject, 'Xác thực email tài khoản CuongThai.com');
    assert.ok(v.html.includes('href="https://cuongthai.com/verify-email?token=t1"') && v.html.includes('24 giờ'));
    assert.ok(!v.html.includes('<img src=x'));
    const p = buildPasswordResetEmail({ resetUrl: 'https://cuongthai.com/reset-password?token=t2' });
    assert.equal(p.subject, 'Đặt lại mật khẩu tài khoản CuongThai.com');
    assert.ok(p.text.includes('https://cuongthai.com/reset-password?token=t2') && p.html.includes('1 giờ'));
  });

  it('hoá đơn khoá học / shop / hoàn tiền: đủ trường, tiền VND, tiêu đề cụ thể', () => {
    const c = buildCourseReceiptEmail({ fullName: 'A', orderCode: 'CT-001', courseTitle: 'React <Pro>', courseSlug: 'react', amount: 499000, paidAt: new Date('2026-10-27T03:00:00Z') });
    assert.equal(c.subject, 'Xác nhận thanh toán khoá học React <Pro>');
    for (const s of ['CT-001', '499.000', 'React &lt;Pro&gt;', '/courses/react/learn', 'Vào học ngay']) assert.ok(c.html.includes(s), s);
    const s = buildShopReceiptEmail({ orderCode: 'SO-9', orderType: 'MIXED', items: [{ name: 'Áo <x>', quantity: 2, total: 300000 }], subtotal: 300000, shippingFee: 30000, total: 330000, paidAt: new Date(), shippingAddress: 'Hà Nội' });
    assert.equal(s.subject, 'Xác nhận đơn hàng SO-9 — CuongThai.com');
    for (const x of ['Áo &lt;x&gt; × 2', 'Phí giao hàng', '330.000', 'Sản phẩm số đã sẵn sàng', 'Hà Nội', '/my-orders']) assert.ok(s.html.includes(x), x);
    const r = buildCourseRefundEmail({ orderCode: 'CT-001', courseTitle: 'React', refundAmount: 100000, originalAmount: 499000, reason: 'Trùng đơn <b>', refundedAt: new Date() });
    assert.equal(r.subject, 'Hoàn tiền một phần khoá học React');
    assert.ok(r.html.includes('Trùng đơn &lt;b&gt;') && r.html.includes('3–7 ngày làm việc') && r.html.includes('100.000'));
  });

  it('thư quản trị: xoá tài khoản có link TUYỆT ĐỐI + 72 giờ; nội dung chờ duyệt; nhắc luyện tập', () => {
    const d = buildDeletionRequestAdminEmail({ username: 'khoa<1>', email: 'k@x.vn', reason: null, requestId: 7, createdAt: new Date('2026-10-27T00:00:00Z') });
    assert.equal(d.subject, 'Yêu cầu xoá tài khoản: khoa<1>');
    assert.match(d.html, /href="https?:\/\/[^"]+\/admin\/deletion-requests"/);
    assert.ok(d.html.includes('72 giờ') && d.html.includes('khoa&lt;1&gt;') && d.html.includes('(không ghi lý do)') && d.html.includes('#7'));
    const a = buildAdminReviewEmail({ kind: 'post', ref: 42, preview: 'xin chào', userId: 3 });
    assert.equal(a.subject, 'Có bài đăng mới chờ duyệt');
    assert.ok(a.html.includes('/admin/posts') && a.html.includes('xin chào'));
    const m = buildReminderEmail('Lan', 12, 'Tiếng Nhật', 'ja');
    assert.equal(m.subject, 'Giữ chuỗi 12 ngày luyện Tiếng Nhật nhé');
    assert.ok(m.html.includes('/language/ja/practice') && m.html.includes('Nhắc học hằng ngày'));
  });
});
