/**
 * UX-D — mẫu email CT Work + thư mời (không DB, không gửi thật):
 *   npx tsx --test src/services/work/workEmail.test.ts
 *   UPDATE_SNAPSHOTS=1 npx tsx --test src/services/work/workEmail.test.ts   # dựng lại ảnh chụp HTML sau khi cố ý đổi mẫu
 *
 * Snapshot HTML so với __snapshots__/*.html, sau khi thay gốc site (FRONTEND_URL khác nhau giữa máy) bằng {SITE}.
 */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { config } from '../../config/env.js';
import { emailService, withFromName } from '../email.service.js';
import { buildInviteEmail, deliverWorkEmail, emailCoverUrl, renderWorkEmail, shortLink, validReplyTo, WORK_FROM_NAME } from './workEmail.js';
import { sendWorkEmail } from './common.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const site = (config.frontendUrl || process.env.FRONTEND_URL || 'https://cuongthai.com').replace(/\/$/, '');
const norm = (s: string) => s.split(site).join('{SITE}');
function snapshot(name: string, html: string) {
  const file = path.join(here, '__snapshots__', name);
  if (process.env.UPDATE_SNAPSHOTS === '1' || !existsSync(file)) { writeFileSync(file, norm(html)); return; }
  assert.equal(norm(html), readFileSync(file, 'utf8'), `${name} khác snapshot — chạy lại với UPDATE_SNAPSHOTS=1 nếu cố ý đổi mẫu`);
}

const base = {
  to: 'sv.nguyen@fpt.edu.vn',
  inviter: { name: 'Hoàng Cường', avatarUrl: 'https://media.cuongthai.com/avatars/cuong.jpg' },
  workspace: 'SE1801 Nhóm 3',
  project: { name: 'Hệ thống đặt sân', coverUrl: 'preset:school-swp391', color: '#ea580c' },
  role: 'MEMBER',
  url: `${site}/work/invite/AbCdEfGhIjKlMnOpQrStUvWxYz0123456789`,
  expiresAt: new Date('2026-10-16T09:00:00Z'),
};

describe('UX-D email CT Work', () => {
  it('thư mời người mới: tiêu đề song ngữ đúng mẫu, đủ chi tiết, link gọn, không SVG', () => {
    const m = buildInviteEmail({ ...base, kind: 'INVITE' });
    assert.equal(m.subject, 'Hoàng Cường mời bạn tham gia SE1801 Nhóm 3 · Hệ thống đặt sân trên CT Work');
    for (const s of ['Chấp nhận lời mời', 'Thành viên (Member)', '16/10/2026', 'đúng email sv.nguyen@fpt.edu.vn', 'invited you to join', 'Oct 16, 2026',
      `${site}/images/work-covers/email/school-swp391.jpg`, `${site}/images/ct-work/ct-work-email-96.png?v=2`, 'cuong.jpg', 'color-scheme', 'prefers-color-scheme:dark',
      'Bạn nhận thư này vì Hoàng Cường', 'bỏ qua thư', 'cuongthai.com']) {
      assert.ok(m.html.includes(s), `thiếu "${s}"`);
    }
    assert.ok(!/<img[^>]+\.svg/i.test(m.html), 'không có ảnh SVG trong thư');
    assert.ok(m.html.includes('>work/invite/AbCdEf…6789<') || m.html.includes(`>${shortLink(base.url)}<`));
    assert.ok(m.html.includes(`href="${base.url}"`), 'href vẫn là link đủ');
    // Bản text đầy đủ: có link đủ, chi tiết, lý do nhận thư.
    for (const s of [base.url, 'Hạn lời mời (expires): 16/10/2026', 'Không gian (workspace): SE1801 Nhóm 3', 'Bạn nhận thư này vì']) assert.ok(m.text.includes(s), `text thiếu "${s}"`);
    assert.ok(!/[A-ZÀ-Ỹ]{6,}/.test(m.subject), 'tiêu đề không có từ IN HOA dài');
    snapshot('workEmail.invite.html', m.html);
  });

  it('người đã có tài khoản: "đã thêm bạn vào", không có hạn; khách cổng nói "client portal"', () => {
    const a = buildInviteEmail({ ...base, kind: 'ADDED', expiresAt: null });
    assert.equal(a.subject, 'Hoàng Cường đã thêm bạn vào SE1801 Nhóm 3 · Hệ thống đặt sân trên CT Work');
    assert.ok(a.html.includes('Mở không gian làm việc'));
    assert.ok(!a.html.includes('Hạn lời mời'));
    snapshot('workEmail.added.html', a.html);
    const c = buildInviteEmail({ ...base, kind: 'INVITE', portal: true, role: 'CLIENT' });
    assert.match(c.subject, /client portal/);
    assert.ok(c.html.includes('Khách hàng (Client)'));
  });

  it('escape HTML tên người dùng nhập; ảnh bìa: preset ⇒ JPEG, ảnh tải lên giữ, SVG/WebP/khác ⇒ dải màu', () => {
    const m = buildInviteEmail({ ...base, kind: 'INVITE', inviter: { name: '<script>x</script>', avatarUrl: null }, workspace: 'A & "B"' });
    assert.ok(!m.html.includes('<script>x'));
    assert.ok(m.html.includes('&lt;script&gt;'));
    assert.ok(m.html.includes('A &amp; &quot;B&quot;'));
    assert.equal(emailCoverUrl('preset:cute-cat'), `${site}/images/work-covers/email/cute-cat.jpg`);
    assert.equal(emailCoverUrl('https://media.x/work/branding/p1/cover-a.jpg'), 'https://media.x/work/branding/p1/cover-a.jpg');
    assert.equal(emailCoverUrl('https://x/y.svg'), null);
    assert.equal(emailCoverUrl('preset:nope'), null);
    const noCover = buildInviteEmail({ ...base, kind: 'INVITE', project: { name: 'P', coverUrl: null, color: '#16a34a' } });
    assert.ok(noCover.html.includes('background:#16a34a'));
  });

  it('khung chung (sendWorkEmail) giữ API cũ, From "CT Work · CuongThai", Reply-To hợp lệ mới gắn', async () => {
    const sent: any[] = [];
    const orig = emailService.send.bind(emailService);
    (emailService as any).send = async (m: any) => { sent.push(m); return { success: true }; };
    try {
      await sendWorkEmail({ to: 'a@b.co', subject: 'S', heading: 'H', lines: ['L1'], cta: { label: 'Open', url: 'https://cuongthai.com/work/x' } });
      await deliverWorkEmail({ to: 'a@b.co', subject: 'S', html: '<p>x</p>', text: 'x', replyTo: 'bot@agents.invalid' });
      await deliverWorkEmail({ to: 'a@b.co', subject: 'S', html: '<p>x</p>', text: 'x', replyTo: 'teacher@fe.edu.vn', refId: 'r1' });
    } finally { (emailService as any).send = orig; }
    assert.equal(sent[0].fromName, WORK_FROM_NAME);
    assert.ok(sent[0].html.includes('ct-work-email-96.png') && sent[0].html.includes('>Open<'));
    assert.ok(sent[0].text.includes('Open:\nhttps://cuongthai.com/work/x'));
    assert.equal(sent[1].replyTo, undefined);
    assert.equal(sent[2].replyTo, 'teacher@fe.edu.vn');
    assert.deepEqual(sent[2].headers, { 'X-Entity-Ref-ID': 'r1' });
    assert.equal(withFromName('CuongHoangDev <noreply@cuongthai.com>', WORK_FROM_NAME), '"CT Work · CuongThai" <noreply@cuongthai.com>');
    assert.equal(withFromName('noreply@cuongthai.com', 'A"\r\nBcc: x'), '"ABcc: x" <noreply@cuongthai.com>');
    assert.equal(validReplyTo('x@y'), false);
    const g = renderWorkEmail({ heading: 'H', lines: [], reason: 'R' });
    assert.ok(g.html.includes('If you weren&#39;t expecting this email'));
  });
});
