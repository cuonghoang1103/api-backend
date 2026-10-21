import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AM_THANH, chatTuDuongDan, CTW_CATEGORY, goiDayCtw, pushKeyFor, pushPrefsFrom } from './goiDayCtw.js';

test('bình luận / @nhắc trên thẻ ⇒ CTW_REPLY, thread theo mã thẻ', () => {
  const g = goiDayCtw('WORK_COMMENT', { issueKey: 'NW-12', url: '/work/acme/NW/issue/12?comment=5' });
  assert.equal(g.category, 'CTW_REPLY');
  assert.equal(g.threadId, 'ctw-NW-12');
  assert.deepEqual(g.them, {});
  assert.equal(goiDayCtw('WORK_MENTION', { issueKey: 'NW-1', url: '/work/a/NW/issue/1' }).category, 'CTW_REPLY');
});

test('tin chat (@nhắc / trả lời) ⇒ CTW_REPLY, thread theo kênh', () => {
  const g = goiDayCtw('WORK_MENTION', { chat: true, issueKey: '#general', url: '/work/acme/NW/chat?c=7&m=99&t=90' });
  assert.equal(g.category, 'CTW_REPLY');
  assert.equal(g.threadId, 'ctw-NW-chat-7');
  assert.deepEqual(chatTuDuongDan('/work/x/KEY/chat?c=3'), { projectKey: 'KEY', channelId: 3 });
  assert.equal(chatTuDuongDan('/work/x/KEY/issue/3'), null);
});

test('phê duyệt: CTW_APPROVAL CHỈ khi người nhận đang phải duyệt; approvalId luôn ở cấp ngoài', () => {
  const p = { issueKey: 'NW-3', approvalId: 41, url: '/work/a/NW/approvals?approval=41' };
  const cho = goiDayCtw('WORK_ALERT', p, { dangChoDuyet: true });
  assert.equal(cho.category, 'CTW_APPROVAL');
  assert.deepEqual(cho.them, { approvalId: 41 });
  const khong = goiDayCtw('WORK_ALERT', p, { dangChoDuyet: false });
  assert.equal(khong.category, 'CTW_DEFAULT');
  assert.deepEqual(khong.them, { approvalId: 41 });
});

test('nhắc họp có meetingUrl ⇒ CTW_MEETING + meetingUrl', () => {
  const g = goiDayCtw('WORK_ALERT', { issueKey: 'NW · M-4', meetingUrl: 'https://meet.google.com/abc', url: '/work/a/NW/meetings/4', reminder: true });
  assert.equal(g.category, 'CTW_MEETING');
  assert.equal(g.them.meetingUrl, 'https://meet.google.com/abc');
  assert.equal(g.threadId, 'ctw-NW·M-4');
});

test('còn lại ⇒ CTW_DEFAULT; bình luận không url ⇒ DEFAULT (không trả lời được)', () => {
  assert.equal(goiDayCtw('WORK_ASSIGN', { issueKey: 'NW-1', url: '/work/a/NW/issue/1' }).category, 'CTW_DEFAULT');
  assert.equal(goiDayCtw('WORK_COMMENT', { issueKey: 'NW-1' }).category, 'CTW_DEFAULT');
  assert.equal(goiDayCtw('WORK_INVITE', { url: '/work/a' }).threadId, 'ctw-WORK_INVITE');
});

test('công tắc đẩy: thiếu khoá = bật; loại ⇒ khoá', () => {
  assert.deepEqual(pushPrefsFrom(null), { assign: true, comment: true, mention: true, alert: true, approval: true, chatAll: true, git: true, feed: true });
  assert.equal(pushPrefsFrom({ chatAll: false }).chatAll, false);
  assert.equal(pushKeyFor('WORK_ALERT', { approvalId: 2 }), 'approval');
  assert.equal(pushKeyFor('WORK_ALERT', {}), 'alert');
  assert.equal(pushKeyFor('WORK_INVITE', {}), null);
});

test('âm thanh: app CT Work ⇒ ctwork.caf (một hằng), app chính ⇒ default', async () => {
  const { AM_THANH_CTWORK, amThanhChoTopic } = await import('./goiDayCtw.js');
  assert.equal(AM_THANH_CTWORK, 'ctwork.caf');
  assert.equal(amThanhChoTopic('com.cuongthai.ctwork'), 'ctwork.caf');
  assert.equal(amThanhChoTopic('com.cuongthai.app'), 'default');
});

test('tin nhắn riêng: cùng không gian CT Work ⇒ kênh ctwork, không ⇒ chinh', async () => {
  const { kenhDayTinNhan } = await import('./goiDayCtw.js');
  assert.equal(kenhDayTinNhan(true), 'ctwork');
  assert.equal(kenhDayTinNhan(false), 'chinh');
});

test('âm theo loại: giao thẻ / nhắc tên / bình luận / hạn / xong / CuongMini / duyệt / chat', async () => {
  const { amThanhCtw, AM_THANH, goiDayCtw, amThanhChoTopic } = await import('./goiDayCtw.js');
  assert.equal(amThanhCtw('WORK_ASSIGN', {}), AM_THANH.giaoThe);
  assert.equal(amThanhCtw('WORK_MENTION', {}), AM_THANH.nhacTen);
  assert.equal(amThanhCtw('WORK_COMMENT', {}), AM_THANH.tinNhan);
  assert.equal(amThanhCtw('WORK_ALERT', { message: 'is due tomorrow' }), AM_THANH.hanChot);
  assert.equal(amThanhCtw('WORK_ALERT', { message: 'Quá hạn 1 ngày' }), AM_THANH.hanChot);
  assert.equal(amThanhCtw('WORK_ALERT', { meetingUrl: 'https://meet.x/1' }), AM_THANH.hanChot);
  assert.equal(amThanhCtw('WORK_ALERT', { message: 'PR #42 merged' }), AM_THANH.xong);
  assert.equal(amThanhCtw('WORK_ALERT', { message: 'Đã duyệt yêu cầu' }), AM_THANH.xong);
  assert.equal(amThanhCtw('WORK_ALERT', { message: 'CuongMini finished the draft' }), AM_THANH.cuongMini);
  assert.equal(amThanhCtw('WORK_ALERT', { approvalId: 3, message: 'approved' }), AM_THANH.macDinh);
  assert.equal(amThanhCtw('WORK_ALERT', { url: '/work/ws/KEY/chat?c=12&m=3' }), AM_THANH.tinNhan);
  assert.equal(amThanhCtw('WORK_ALERT', { message: 'needs your attention' }), AM_THANH.macDinh);
  assert.equal(amThanhCtw('WORK_INVITE', {}), AM_THANH.macDinh);
  assert.equal(goiDayCtw('WORK_ASSIGN', { issueKey: 'A-1' }).amThanh, 'giao-the.caf');
  assert.equal(amThanhChoTopic('com.cuongthai.ctwork', 'xong.caf'), 'xong.caf');
  assert.equal(amThanhChoTopic('com.cuongthai.app', 'xong.caf'), 'default');
});

test('Bảng tin (21/10/2026): thread theo bài, feedPostId/feedCommentId ở cấp ngoài, âm theo loại, công tắc `feed`', () => {
  const feed = { postId: 12, commentId: 88, workspaceId: 1, projectId: 3, event: 'comment' };
  const c = goiDayCtw('WORK_COMMENT', { issueKey: 'FP', url: '/work/acme/feed?post=12&comment=88', feed, excerpt: 'done by Friday' });
  assert.equal(c.threadId, 'ctw-feed-12');
  assert.equal(c.category, CTW_CATEGORY.reply);
  assert.deepEqual(c.them, { feedPostId: 12, feedCommentId: 88 });
  assert.equal(c.amThanh, AM_THANH.tinNhan);
  assert.equal(goiDayCtw('WORK_MENTION', { url: '/work/acme/feed?post=12', feed: { postId: 12 } }).amThanh, AM_THANH.nhacTen);
  // Bài mới: chữ trích có "deadline"/"done" vẫn là âm mặc định (không đoán theo chữ).
  const a = goiDayCtw('WORK_ALERT', { issueKey: 'Acme', message: 'An posted in Acme', excerpt: 'deadline done', url: '/work/acme/feed?post=5', feed: { postId: 5, event: 'post' } });
  assert.equal(a.amThanh, AM_THANH.macDinh);
  assert.equal(a.category, CTW_CATEGORY.thuong);
  assert.deepEqual(a.them, { feedPostId: 5 });
  assert.equal(pushKeyFor('WORK_ALERT', { feed: { postId: 5 } }), 'feed');
  assert.equal(pushKeyFor('WORK_MENTION', { feed: { postId: 5 } }), 'mention');
  assert.equal(pushKeyFor('WORK_ALERT', {}), 'alert');
});

