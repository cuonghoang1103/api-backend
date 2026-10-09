/**
 * CTW K-3 — luật THUẦN của kênh chat dự án (không DB):
 *   npx tsx --test src/services/work/chatRules.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as R from './chatRules.js';
import { agentRouteAllowed, clientPortalRouteAllowed } from './permissions.js';
import { isAllowedWhileLocked } from './editLock.service.js';

const A = (role: R.ChatActor['role'], workspaceRole: R.ChatActor['workspaceRole'] = 'MEMBER', principal: 'HUMAN' | 'AGENT' = 'HUMAN'): R.ChatActor => ({ role, workspaceRole, principal });
const PUB = { kind: 'PUBLIC' };
const PRIV = { kind: 'PRIVATE' };
const CLI = { kind: 'CLIENT' };

describe('K-3 quyền xem kênh (thành viên / viewer / teacher / client / guest / agent)', () => {
  const cases: Array<[string, R.ChatActor, { kind: string }, boolean, boolean]> = [
    ['ADMIN · public', A('ADMIN'), PUB, false, true],
    ['MEMBER · public', A('MEMBER'), PUB, false, true],
    ['VIEWER · public', A('VIEWER'), PUB, false, true],
    ['TEACHER (GUEST ws) · public', A('TEACHER', 'GUEST'), PUB, false, true],
    ['CLIENT · public ⇒ KHÔNG', A('CLIENT', 'GUEST'), PUB, false, false],
    ['CLIENT (MEMBER ws) · public ⇒ KHÔNG', A('CLIENT', 'MEMBER'), PUB, false, false],
    ['GUEST MEMBER-role · public ⇒ KHÔNG', A('MEMBER', 'GUEST'), PUB, false, false],
    ['CLIENT · client channel', A('CLIENT', 'GUEST'), CLI, false, true],
    ['GUEST · client channel', A('VIEWER', 'GUEST'), CLI, false, true],
    ['MEMBER · client channel', A('MEMBER'), CLI, false, true],
    ['MEMBER · private (không mời) ⇒ KHÔNG', A('MEMBER'), PRIV, false, false],
    ['ADMIN · private (không mời) ⇒ KHÔNG', A('ADMIN', 'OWNER'), PRIV, false, false],
    ['MEMBER · private (được mời)', A('MEMBER'), PRIV, true, true],
    ['CLIENT · private dù được mời ⇒ KHÔNG', A('CLIENT', 'GUEST'), PRIV, true, false],
    ['AGENT · public', A('MEMBER', 'MEMBER', 'AGENT'), PUB, false, true],
    ['AGENT · private không mời ⇒ KHÔNG', A('MEMBER', 'MEMBER', 'AGENT'), PRIV, false, false],
    ['không vào được dự án', A(null, null), PUB, false, false],
  ];
  for (const [name, actor, ch, member, want] of cases) {
    it(name, () => assert.equal(R.canViewChannel(actor, ch, member), want));
  }

  it('gửi tin = comment.create: VIEWER chỉ đọc; TEACHER/CLIENT gửi được ở kênh họ thấy; kênh lưu trữ ⇒ không ai gửi', () => {
    assert.equal(R.canPostInChannel(A('VIEWER'), PUB, false), false);
    assert.equal(R.canPostInChannel(A('TEACHER', 'GUEST'), PUB, false), true);
    assert.equal(R.canPostInChannel(A('CLIENT', 'GUEST'), CLI, false), true);
    assert.equal(R.canPostInChannel(A('MEMBER'), { kind: 'PUBLIC', archivedAt: new Date() }, false), false);
    assert.equal(R.canPostInChannel(A('MEMBER', 'MEMBER', 'AGENT'), PUB, false), true);
  });

  it('tạo/quản lý kênh: ADMIN/MEMBER người; kênh CLIENT chỉ ADMIN; agent/teacher/viewer/khách không', () => {
    assert.equal(R.canCreateChannel(A('MEMBER'), 'PUBLIC'), true);
    assert.equal(R.canCreateChannel(A('MEMBER'), 'CLIENT'), false);
    assert.equal(R.canCreateChannel(A('ADMIN'), 'CLIENT'), true);
    for (const a of [A('VIEWER'), A('TEACHER', 'GUEST'), A('CLIENT', 'GUEST'), A('ADMIN', 'MEMBER', 'AGENT')]) assert.equal(R.canCreateChannel(a, 'PUBLIC'), false);
    assert.equal(R.canManageChannel(A('MEMBER'), 7, { kind: 'PUBLIC', createdById: 7 }, false), true);
    assert.equal(R.canManageChannel(A('MEMBER'), 7, { kind: 'PUBLIC', createdById: 8 }, false), false);
    assert.equal(R.canManageChannel(A('ADMIN'), 7, { kind: 'PRIVATE', createdById: 8 }, false), false, 'ADMIN không quản lý kênh riêng mình không thấy');
    assert.equal(R.canModerate(A('ADMIN')), true);
    assert.equal(R.canModerate(A('ADMIN', 'MEMBER', 'AGENT')), false);
    assert.equal(R.canPin(A('MEMBER', 'MEMBER', 'AGENT'), PUB, false), false);
  });
});

describe('K-3 nội dung tin', () => {
  it('tên kênh', () => {
    assert.equal(R.channelSlug('Front-end Team!'), 'front-end-team');
    assert.equal(R.channelSlug('#Thiết kế CSDL'), 'thiet-ke-csdl');
    assert.equal(R.channelSlug('a'), null);
    assert.equal(R.channelSlug('x'.repeat(80))?.length, 40);
  });

  it('làm sạch: bỏ ký tự điều khiển, giữ xuống dòng, cắt trần 8000', () => {
    assert.equal(R.cleanBody('  hi\u0000\u0007 there\r\nline2  '), 'hi there\nline2');
    assert.equal(R.cleanBody('x'.repeat(9000)).length, 8000);
    assert.equal(R.cleanBody('<script>alert(1)</script>'), '<script>alert(1)</script>', 'giữ nguyên chữ — client KHÔNG vẽ HTML thô');
  });

  it('@nhắc: tên người, bỏ email / @channel / trong code', () => {
    assert.deepEqual(R.mentionNames('hi @Linh_2 and @dev.team, mail a@b.com'), ['linh_2', 'dev.team']);
    assert.deepEqual(R.mentionNames('@channel @here please'), []);
    assert.deepEqual(R.mentionNames('`@Override` and ```\n@Test\n``` but @real'), ['real']);
  });

  it('liên kết nội bộ ⇒ ref (thẻ / test / docs / họp, dạng KEY-n), link ngoài ⇒ chỉ tên miền + tiêu đề có sẵn', () => {
    const refs = R.extractRefs([
      'see https://cuongthai.com/work/lab-team/FP/issue/12 and /work/lab-team/FP/docs/3',
      'test /work/lab-team/FP/tests/40 meeting /work/lab-team/FP/meetings/2 jira /work/lab-team/FP/issues/FP-7',
      'also FP-99 and [Spec v2](https://docs.google.com/doc/abc) and https://evil.example.com/work/lab-team/FP/issue/1',
    ].join('\n'), { projectKey: 'FP' });
    assert.deepEqual(refs.flatMap((r) => (r.t === 'web' ? [] : [`${r.t}:${r.ws}:${r.key}:${r.n}`])), [
      'issue:lab-team:FP:12', 'doc:lab-team:FP:3', 'test:lab-team:FP:40', 'meeting:lab-team:FP:2', 'issue:lab-team:FP:7',
    ], 'trần 5 ref nội bộ — FP-99 trần bị cắt');
    const web = refs.filter((r): r is Extract<R.ChatRef, { t: 'web' }> => r.t === 'web');
    assert.deepEqual(web.map((w) => [w.domain, w.title]), [['docs.google.com', 'Spec v2'], ['evil.example.com', null]], 'host lạ KHÔNG thành thẻ nội bộ');
  });

  it('link [FP-3: tiêu đề](/work/ws/FP/issue/3) ⇒ MỘT thẻ xem trước (không lặp vì KEY-n trong tiêu đề)', () => {
    const r = R.extractRefs('[FP-3: Login](/work/lab/FP/issue/3)', { projectKey: 'FP' });
    assert.equal(r.length, 1);
  });

  it('KEY-n trần của chính dự án; không nhận ref trong code', () => {
    const r = R.extractRefs('fix FP-3 now, `FP-4` no', { projectKey: 'FP' });
    assert.deepEqual(r.map((x) => (x.t === 'web' ? x.url : x.n)), [3]);
  });

  it('emoji hợp lệ', () => {
    for (const e of ['👍', '❤️', '👍🏽', '👨‍💻', '🎉']) assert.equal(R.validEmoji(e), true, e);
    for (const e of ['a', '<b>', '', 'x'.repeat(20), '1']) assert.equal(R.validEmoji(e), false, e);
  });

  it('chữ thường cho thông báo', () => {
    assert.equal(R.plainText('**Bold** [link](https://x.y) `code`\n> quote'), 'Bold link code quote');
  });
});

describe('K-3 tắt tiếng · hết hạn tắt tiếng · chỉ khi được @nhắc', () => {
  const now = new Date('2026-10-10T03:00:00Z'); // 10:00 giờ VN

  it('mốc tắt tiếng theo lựa chọn', () => {
    assert.equal(R.muteUntilFor('30m', now)!.toISOString(), '2026-10-10T03:30:00.000Z');
    assert.equal(R.muteUntilFor('1h', now)!.toISOString(), '2026-10-10T04:00:00.000Z');
    assert.equal(R.muteUntilFor('8h', now)!.toISOString(), '2026-10-10T11:00:00.000Z');
    assert.equal(R.muteUntilFor('tomorrow', now)!.toISOString(), '2026-10-11T01:00:00.000Z', '08:00 sáng mai giờ VN');
    assert.equal(R.muteUntilFor('tomorrow', new Date('2026-10-09T20:00:00Z'))!.toISOString(), '2026-10-10T01:00:00.000Z', '03:00 VN ⇒ 08:00 sáng NAY');
    assert.equal(R.isMutedForever(R.muteUntilFor('forever', now)), true);
    assert.equal(R.muteUntilFor('off', now), null);
    assert.equal(R.muteUntilFor('custom', now, '2026-10-12T00:00:00Z')!.toISOString(), '2026-10-12T00:00:00.000Z');
    assert.throws(() => R.muteUntilFor('custom', now, '2026-10-09T00:00:00Z'), /future/);
    assert.throws(() => R.muteUntilFor('custom', now, '2028-01-01T00:00:00Z'), /at most a year/);
    assert.throws(() => R.muteUntilFor('custom', now, 'not a date'), /Pick a date/);
  });

  it('hết hạn tắt tiếng ⇒ tự bật lại', () => {
    const until = R.muteUntilFor('30m', now)!;
    assert.equal(R.isMuted(until, now), true);
    assert.equal(R.isMuted(until, new Date(now.getTime() + 31 * 60_000)), false);
    assert.equal(R.isMuted(null, now), false);
  });

  it('chế độ hiệu lực: kênh đè chung', () => {
    assert.equal(R.effectiveMode('DEFAULT', 'MENTIONS'), 'MENTIONS');
    assert.equal(R.effectiveMode('ALL', 'MENTIONS'), 'ALL');
    assert.equal(R.effectiveMode(null, null), 'ALL');
  });

  const base: R.AlertInput = { own: false, mention: false, mode: 'ALL', quiet: false, now };
  it('báo: tin của mình không bao giờ; thường thì có', () => {
    assert.equal(R.shouldAlert({ ...base, own: true, mention: true }), false);
    assert.equal(R.shouldAlert(base), true);
  });
  it('kênh tắt tiếng: chỉ báo khi được @nhắc; hết hạn thì báo lại', () => {
    const until = R.muteUntilFor('1h', now);
    assert.equal(R.shouldAlert({ ...base, channelMutedUntil: until }), false);
    assert.equal(R.shouldAlert({ ...base, channelMutedUntil: until, mention: true }), true);
    assert.equal(R.shouldAlert({ ...base, channelMutedUntil: until, now: new Date(now.getTime() + 2 * 3600_000) }), true);
  });
  it('tắt tiếng TOÀN BỘ / giờ im lặng: không báo gì kể cả @nhắc', () => {
    assert.equal(R.shouldAlert({ ...base, mention: true, globalMutedUntil: R.MUTE_FOREVER }), false);
    assert.equal(R.shouldAlert({ ...base, mention: true, quiet: true }), false);
  });
  it('chế độ "Chỉ khi được @nhắc"', () => {
    assert.equal(R.shouldAlert({ ...base, mode: 'MENTIONS' }), false);
    assert.equal(R.shouldAlert({ ...base, mode: 'MENTIONS', mention: true }), true);
  });
  it('badge: kênh tắt tiếng chỉ cộng tin nhắc mình', () => {
    assert.equal(R.badgeCount({ unread: 5, mentions: 1, channelMuted: false }), 5);
    assert.equal(R.badgeCount({ unread: 5, mentions: 1, channelMuted: true }), 1);
  });
  it('giờ im lặng vắt qua nửa đêm (giờ VN)', () => {
    assert.equal(R.inQuiet(22, 7, new Date('2026-10-09T17:30:00Z')), true); // 00:30 VN
    assert.equal(R.inQuiet(22, 7, now), false); // 10:00 VN
    assert.equal(R.inQuiet(null, 7, now), false);
  });
});

describe('K-3 chốt tuyến', () => {
  it('agent KHÔNG gọi REST /chat (đi qua registry); khách cổng gọi được /chat trừ "tạo thẻ"; khoá chỉnh sửa vẫn cho nhắn tin', () => {
    assert.equal(agentRouteAllowed('GET', '/chat/channels'), false);
    assert.equal(agentRouteAllowed('POST', '/chat/channels/3/messages'), false);
    assert.equal(clientPortalRouteAllowed('GET', '/chat/channels'), true);
    assert.equal(clientPortalRouteAllowed('POST', '/chat/channels/3/messages'), true);
    assert.equal(clientPortalRouteAllowed('POST', '/chat/channels/3/messages/9/issue'), false);
    assert.equal(isAllowedWhileLocked('/chat/channels/3/messages'), true);
    assert.equal(isAllowedWhileLocked('/chat/channels/3/messages/9/issue'), false);
  });
});
