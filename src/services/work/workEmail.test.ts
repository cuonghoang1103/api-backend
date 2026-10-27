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
import { buildInviteEmail, deliverWorkEmail, emailCoverUrl, renderWorkEmail, shortLink, validReplyTo, WORK_FROM_NAME, workFromAddress } from './workEmail.js';
import { sendWorkEmail } from './common.js';
import { buildDigestEmail, buildGitEmail, buildMyWorkReminderEmail, buildNotifyEmail, gitSubject, loadGitEmailInput, notifySubjectVi, type GitEmailInput } from './notifyEmail.js';
import { prisma } from '../../config/database.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const site = (config.frontendUrl || process.env.FRONTEND_URL || 'https://cuongthai.com').replace(/\/$/, '');
// Link hiển thị trong thư chỉ có host (vd "localhost:3000/work/…", trên CI "cuongthai.com/work/…") ⇒ gom về {HOST}/work
// để ảnh chụp không phụ thuộc .env của máy chạy (13/10/2026: snapshot chụp ở máy có FRONTEND_URL=localhost làm CI đỏ).
const host = site.replace(/^https?:\/\//, '');
const norm = (s: string) => s.split(site).join('{SITE}').split(`${host}/work`).join('{HOST}/work');
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

  it('khung chung (sendWorkEmail) giữ API cũ, From "CT Work · CuongThai.com", Reply-To hợp lệ mới gắn', async () => {
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
    assert.equal(withFromName('CuongHoangDev <noreply@cuongthai.com>', WORK_FROM_NAME), '"CT Work · CuongThai.com" <noreply@cuongthai.com>');
    // 27/10/2026: CT Work gửi từ ctwork@ (avatar riêng); WORK_FROM_EMAIL rỗng ⇒ về địa chỉ chung; giá trị hỏng ⇒ bỏ qua.
    assert.equal(workFromAddress({}), 'ctwork@cuongthai.com');
    assert.equal(workFromAddress({ WORK_FROM_EMAIL: '' }), undefined);
    assert.equal(workFromAddress({ WORK_FROM_EMAIL: 'x <y>' }), undefined);
    assert.equal(sent[0].fromAddress, workFromAddress());
    assert.equal(withFromName('noreply@cuongthai.com', 'A"\r\nBcc: x'), '"ABcc: x" <noreply@cuongthai.com>');
    assert.equal(validReplyTo('x@y'), false);
    const g = renderWorkEmail({ heading: 'H', lines: [{ rich: '**x** `y<z`' }], reason: 'R' });
    assert.ok(g.html.includes('<strong>x</strong>') && g.html.includes('y&lt;z</code>') && g.text.includes('x y<z'));
    assert.ok(g.html.includes('If you weren&#39;t expecting this email'));
  });
});

const push: GitEmailInput = {
  kind: 'PUSH', actor: 'Khoa Pham', provider: 'GITHUB', repo: 'cuonghoang1103/nha-tro', ref: 'nt-26-rental-dao', prNumber: null,
  title: 'NT-26: model + khung RentalDAO', commitCount: 7,
  commits: Array.from({ length: 7 }, (_, i) => ({ sha: `abcdef${i}0123456789`, message: i === 6 ? 'NT-26: model + khung RentalDAO\n\nchi tiết dài' : `commit <${i}>`, url: i === 0 ? null : `https://github.com/cuonghoang1103/nha-tro/commit/abcdef${i}` })),
  externalUrl: 'https://github.com/cuonghoang1103/nha-tro/compare/a...b',
  data: { forced: false, created: false },
  project: { key: 'NT', name: 'Nhà trọ SV', color: '#0ea5e9' },
  issues: [{ key: 'NT-26', title: 'RentalDAO' }],
  url: '/work/prj301/NT/code?tab=activity&event=9',
};

describe('27/10/2026 thư thông báo CT Work tiếng Việt', () => {
  it('Git — đẩy commit: tiêu đề Việt, tối đa 5 commit (sha mono + link), kho, nhánh, thẻ, 2 nút', () => {
    const m = buildGitEmail(push);
    assert.equal(m.subject, '[NT] Khoa Pham đẩy 7 commit lên nt-26-rental-dao: NT-26: model + khung RentalDAO');
    for (const s of ['Khoa Pham đã đẩy 7 commit mới', 'nt-26-rental-dao</code>', 'Nhà trọ SV', 'cuonghoang1103/nha-tro', '>abcdef2<', '>abcdef6<', 'commit &lt;2&gt;',
      'href="https://github.com/cuonghoang1103/nha-tro/commit/abcdef2"', '… và 2 commit trước đó', 'NT-26 · RentalDAO', 'Xem trong CT Work', 'Xem trên GitHub',
      'href="https://github.com/cuonghoang1103/nha-tro/compare/a...b"', 'pushed 7 commits to nt-26-rental-dao', 'Cài đặt thông báo', 'tắt riêng thông báo Git']) {
      assert.ok(m.html.includes(s), `thiếu "${s}"`);
    }
    assert.ok(!m.html.includes('abcdef1'), 'chỉ 5 commit mới nhất');
    assert.ok(!m.html.includes('<2>'), 'thông điệp commit được escape');
    assert.ok(!m.html.includes('Change how you get'), 'không còn câu tiếng Anh máy');
    assert.ok(m.text.includes('abcdef2 commit <2>') && m.text.includes('/work/prj301/NT/code?tab=activity&event=9'));
  });

  it('Git — PR mở / merge / nhờ review; GitLab dùng MR !n', () => {
    const pr = { ...push, kind: 'PR_OPENED', prNumber: 12, title: 'Thêm RentalDAO', commits: [], commitCount: 0, data: { headRef: 'nt-26', baseRef: 'main' } };
    assert.equal(gitSubject(pr), '[NT] Khoa Pham mở PR #12: Thêm RentalDAO');
    assert.ok(buildGitEmail(pr).html.includes('nt-26 → main'));
    assert.equal(gitSubject({ ...pr, kind: 'PR_MERGED' }), '[NT] Khoa Pham đã merge PR #12: Thêm RentalDAO');
    const rv = buildGitEmail({ ...pr, kind: 'REVIEW_REQUESTED' });
    assert.equal(rv.subject, '[NT] Khoa Pham nhờ bạn review PR #12: Thêm RentalDAO');
    assert.ok(rv.html.includes('được nhờ review PR #12'));
    assert.equal(gitSubject({ ...pr, provider: 'GITLAB' }), '[NT] Khoa Pham mở MR !12: Thêm RentalDAO');
    assert.ok(buildGitEmail({ ...pr, provider: 'GITLAB' }).html.includes('Xem trên GitLab'));
  });

  it('Git — nạp từ WorkGitEvent (prisma giả): commit JSON, compare link, thẻ liên quan', async () => {
    const ev = {
      kind: 'PUSH', provider: 'GITHUB', repo: 'o/r', ref: 'feat-x', prNumber: null, title: 'msg', commitCount: 2, url: 'https://github.com/o/r/commit/2',
      commits: [{ sha: '1111111aaaa', message: 'NT-3 first', url: 'https://github.com/o/r/commit/1' }, { sha: '2222222bbbb', message: 'second' }],
      data: { compare: 'https://github.com/o/r/compare/x...y', forced: true }, issueNumbers: [3, 3], projectId: 5, actorName: 'Git Name', actorLogin: 'gl',
      project: { key: 'NT', name: 'Nhà trọ', color: null },
    };
    const p = prisma as any;
    const keep = { g: Object.getOwnPropertyDescriptor(p, 'workGitEvent'), i: Object.getOwnPropertyDescriptor(p, 'workIssue') };
    Object.defineProperty(p, 'workGitEvent', { configurable: true, value: { findUnique: async () => ev } });
    Object.defineProperty(p, 'workIssue', { configurable: true, value: { findMany: async () => [{ number: 3, title: 'Đăng nhập' }] } });
    try {
      const g = await loadGitEmailInput(9, { actor: 'Khoa Pham', url: '/work/w/NT/code' });
      assert.ok(g);
      assert.equal(g!.actor, 'Khoa Pham');
      assert.equal(g!.externalUrl, 'https://github.com/o/r/compare/x...y');
      assert.deepEqual(g!.issues, [{ key: 'NT-3', title: 'Đăng nhập' }]);
      assert.equal(g!.commits[1].url, null);
      const m = buildGitEmail(g!);
      assert.ok(m.html.includes('force push') && m.html.includes('NT-3 · Đăng nhập'));
    } finally {
      if (keep.g) Object.defineProperty(p, 'workGitEvent', keep.g); else delete p.workGitEvent;
      if (keep.i) Object.defineProperty(p, 'workIssue', keep.i); else delete p.workIssue;
    }
  });

  it('giao việc / @nhắc / trả lời / cảnh báo: tiêu đề Việt + chi tiết thẻ + trích đoạn; không "undefined"', () => {
    const issue = { key: 'NT-24', title: 'Layout chung', projectName: 'Nhà trọ SV', projectColor: '#ea580c', type: 'Story', status: 'In Progress', priority: 2, dueDate: new Date('2026-10-30T00:00:00Z'), description: 'Header + footer' };
    const a = buildNotifyEmail({ type: 'WORK_ASSIGN', payload: { issueKey: 'NT-24', title: 'Layout chung', url: '/work/w/NT/issue/24' }, sender: { name: 'Hoàng Cường' }, issue });
    assert.equal(a.subject, 'NT-24 vừa được giao cho bạn: Layout chung');
    for (const s of ['Bạn được giao một việc mới', 'Hoàng Cường', 'đã giao việc cho bạn', 'Nhà trọ SV', 'In Progress', 'Cao', '30/10/2026', 'Header + footer', 'Mở trong CT Work', 'background:#ea580c', 'was assigned to you']) assert.ok(a.html.includes(s), s);
    const m = buildNotifyEmail({ type: 'WORK_MENTION', payload: { issueKey: 'NT-24', title: 'Layout chung', url: '/x', excerpt: '@bạn xem <giúp>' }, sender: { name: 'Khoa Pham' } });
    assert.equal(m.subject, 'Khoa Pham nhắc bạn trong NT-24: Layout chung');
    assert.ok(m.html.includes('@bạn xem &lt;giúp&gt;') && m.html.includes('Trả lời trong CT Work'));
    assert.equal(notifySubjectVi('WORK_COMMENT', { issueKey: 'NT-1', title: 'T', reply: true }, 'An'), 'An trả lời bình luận của bạn trong NT-1: T');
    assert.equal(notifySubjectVi('WORK_COMMENT', { issueKey: 'NT-1', title: 'T' }, 'An'), 'An bình luận trong NT-1: T');
    assert.equal(notifySubjectVi('WORK_ALERT', { message: 'Grades published: Sprint 1' }), 'Đã công bố điểm: Sprint 1'); // 28/10: alertVi dịch
    assert.equal(notifySubjectVi('WORK_ALERT', { issueKey: 'NT-2', message: 'Bị chặn' }), 'NT-2: Bị chặn');
    const al = buildNotifyEmail({ type: 'WORK_ALERT', payload: { message: 'Hết hạn' } });
    assert.ok(!al.html.includes('undefined') && !al.subject.includes('undefined'));
  });

  it('thư gộp + nhắc việc buổi sáng: tiếng Việt, mỗi mục có link', () => {
    const d = buildDigestEmail([{ subject: 'NT-1 vừa được giao cho bạn: A', url: '/work/w/NT/issue/1' }, { subject: 'B', url: null }]);
    assert.equal(d.subject, 'Bạn có 2 cập nhật mới trong CT Work');
    assert.ok(d.html.includes('Tóm tắt CT Work của bạn') && d.html.includes('/work/w/NT/issue/1"') && d.html.includes('Mở Việc của tôi'));
    const r = buildMyWorkReminderEmail([{ key: 'NT-1', title: 'A', bucket: 'overdue', dueDate: '2026-10-20', url: '/work/w/NT/issue/1' }, { key: 'NT-2', title: 'B', bucket: 'today', dueDate: '2026-10-27', url: '/work/w/NT/issue/2' }]);
    assert.equal(r.subject, 'CT Work: 2 việc cần chú ý hôm nay (1 quá hạn)');
    assert.ok(r.html.includes('Quá hạn từ 20/10/2026') && r.html.includes('Đến hạn hôm nay'));
  });
});
