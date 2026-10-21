import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chatTuDuongDan, goiDayCtw, pushKeyFor, pushPrefsFrom } from './goiDayCtw.js';

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
  assert.deepEqual(pushPrefsFrom(null), { assign: true, comment: true, mention: true, alert: true, approval: true, chatAll: true, git: true });
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
