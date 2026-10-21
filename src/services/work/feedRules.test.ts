/**
 * Bảng tin nhóm — luật THUẦN (không DB):
 *   npx tsx --test src/services/work/feedRules.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  attachmentMixError, canCommentOn, canDelete, canEditOwn, cleanBody, decodeCursor, encodeCursor, excerptOf, feedProjectAccess, feedWorkspaceAccess,
  firstWebLink, hashtagsIn, kindOf, mentionsIn, mimeFor, normalizePoll, notifyMention, notifyNewPost, pollClosed, postUrl, reactionMessage,
  reactionSummary, refsIn, safeMime, scopeKey, sizeLimit, validVote, visibleModerated, MB, NO_ACCESS, REACTION_KINDS,
} from './feedRules.js';

describe('quyền theo phạm vi', () => {
  it('không gian: mọi thành viên đọc + đăng; OWNER/ADMIN quản trị; khách cổng + agent không gì', () => {
    for (const role of ['OWNER', 'ADMIN'] as const) assert.deepEqual(feedWorkspaceAccess({ role, principal: 'HUMAN', portalOnly: false }), { read: true, post: true, moderate: true });
    for (const role of ['MEMBER', 'GUEST'] as const) assert.deepEqual(feedWorkspaceAccess({ role, principal: 'HUMAN', portalOnly: false }), { read: true, post: true, moderate: false });
    assert.deepEqual(feedWorkspaceAccess({ role: 'GUEST', principal: 'HUMAN', portalOnly: true }), NO_ACCESS, 'khách cổng');
    assert.deepEqual(feedWorkspaceAccess({ role: 'OWNER', principal: 'AGENT', portalOnly: false }), NO_ACCESS, 'agent, kể cả vai OWNER');
    assert.deepEqual(feedWorkspaceAccess({ role: null, principal: 'HUMAN', portalOnly: false }), NO_ACCESS, 'người ngoài');
  });
  it('dự án: ADMIN quản trị; MEMBER/TEACHER/VIEWER đọc + đăng; CLIENT (mọi kiểu) + agent không gì', () => {
    assert.deepEqual(feedProjectAccess({ role: 'ADMIN', principal: 'HUMAN' }), { read: true, post: true, moderate: true });
    for (const role of ['MEMBER', 'TEACHER', 'VIEWER'] as const) assert.deepEqual(feedProjectAccess({ role, principal: 'HUMAN' }), { read: true, post: true, moderate: false });
    assert.deepEqual(feedProjectAccess({ role: 'CLIENT', principal: 'HUMAN' }), NO_ACCESS);
    assert.deepEqual(feedProjectAccess({ role: 'ADMIN', principal: 'AGENT' }), NO_ACCESS);
    assert.deepEqual(feedProjectAccess({ role: null, principal: 'HUMAN' }), NO_ACCESS);
  });
  it('sửa: chỉ tác giả; xoá: tác giả hoặc quản trị; bình luận khi tắt: chỉ quản trị', () => {
    const member = { read: true, post: true, moderate: false };
    const admin = { read: true, post: true, moderate: true };
    assert.equal(canEditOwn(5, 5), true);
    assert.equal(canEditOwn(6, 5), false);
    assert.equal(canDelete(5, 5, member), true);
    assert.equal(canDelete(6, 5, member), false);
    assert.equal(canDelete(6, 5, admin), true);
    assert.equal(canDelete(5, 5, NO_ACCESS), false, 'mất quyền đọc thì cũng mất quyền xoá');
    assert.equal(canCommentOn(member, false), true);
    assert.equal(canCommentOn(member, true), false);
    assert.equal(canCommentOn(admin, true), true);
  });
  it('bài bị gỡ: chỉ tác giả + quản trị thấy', () => {
    const member = { read: true, post: true, moderate: false };
    assert.equal(visibleModerated(false, 1, 2, member), true);
    assert.equal(visibleModerated(true, 1, 2, member), false);
    assert.equal(visibleModerated(true, 2, 2, member), true);
    assert.equal(visibleModerated(true, 1, 2, { ...member, moderate: true }), true);
  });
  it('mức theo dõi: không dòng = ALL; MENTIONS chỉ @nhắc; OFF tắt cả @nhắc', () => {
    assert.equal(notifyNewPost(undefined), true);
    assert.equal(notifyNewPost('MENTIONS'), false);
    assert.equal(notifyMention('MENTIONS'), true);
    assert.equal(notifyMention('OFF'), false);
    assert.equal(notifyMention(null), true);
    assert.equal(scopeKey(4, null), 'w:4');
    assert.equal(scopeKey(4, 9), 'p:9');
  });
});

describe('con trỏ', () => {
  it('khứ hồi (createdAt, id); rác ⇒ null', () => {
    const d = new Date('2026-10-21T09:15:30.123Z');
    assert.deepEqual(decodeCursor(encodeCursor(d, 42)), { createdAt: d, id: 42 });
    for (const bad of ['', 'abc', Buffer.from('x_1').toString('base64url'), Buffer.from('2026-10-21T09:15:30.123Z_-3').toString('base64url'), null, undefined]) {
      assert.equal(decodeCursor(bad as string), null, String(bad));
    }
  });
});

describe('nội dung', () => {
  it('@nhắc: bỏ code, bỏ email, bỏ @here/@channel/@everyone', () => {
    assert.deepEqual(mentionsIn('Hi @An and @minh.tran, mail a@b.com `@Override` @here').sort(), ['an', 'minh.tran']);
  });
  it('#hashtag: có dấu, chữ thường, không trùng; bỏ số thuần, link, code', () => {
    assert.deepEqual(hashtagsIn('Sprint #Demo #demo #2 #Thứ_Sáu https://x.com/#anchor `#code` [link](https://a.b/#x) (#ok)'), ['demo', 'thứ_sáu', 'ok']);
    assert.deepEqual(hashtagsIn('a#b c&#39; #x'), [], '#x một ký tự, a#b dính chữ, entity HTML');
  });
  it('link: thẻ nội bộ + link web đầu tiên (thẻ OG)', () => {
    const refs = refsIn('See /work/acme/FP/issue/12 and FP-3, also https://react.dev/blog and https://x.dev', { projectKey: 'FP' });
    assert.deepEqual(refs.flatMap((r) => (r.t === 'web' ? [] : [`${r.key}-${r.n}`])).sort(), ['FP-12', 'FP-3']);
    assert.equal(firstWebLink(refs), 'https://react.dev/blog');
    assert.equal(firstWebLink(refsIn('no links here')), null);
  });
  it('cleanBody + excerpt', () => {
    assert.equal(cleanBody('  a  \r\n\r\n\r\n\r\n\r\nb  '), 'a\n\n\nb');
    assert.equal(excerptOf('**Bold** [link](https://x) `x`\n```js\ncode\n```'), 'Bold link x [code]');
    assert.equal(excerptOf('x'.repeat(200), 10).length, 10);
  });
});

describe('bình chọn', () => {
  const now = new Date('2026-10-21T00:00:00Z');
  it('2–6 lựa chọn, khác nhau, id a/b/…, closesAt tương lai ≤ 90 ngày', () => {
    const p = normalizePoll({ options: [' Thứ 5 ', 'Thứ 6'], multi: true, closesAt: '2026-10-25T00:00:00Z' }, now);
    assert.deepEqual(p, { options: [{ id: 'a', text: 'Thứ 5' }, { id: 'b', text: 'Thứ 6' }], multi: true, closesAt: '2026-10-25T00:00:00.000Z' });
    assert.equal(typeof normalizePoll({ options: ['x'] }, now), 'string');
    assert.equal(typeof normalizePoll({ options: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] }, now), 'string');
    assert.equal(typeof normalizePoll({ options: ['A', 'a'] }, now), 'string', 'trùng');
    assert.equal(typeof normalizePoll({ options: ['a', 'b'], closesAt: '2026-10-20T00:00:00Z' }, now), 'string', 'quá khứ');
    assert.equal(typeof normalizePoll({ options: ['a', 'b'], closesAt: '2027-03-01T00:00:00Z' }, now), 'string', '> 90 ngày');
    assert.equal(normalizePoll(null, now), null);
  });
  it('phiếu: id thuộc bình chọn; một lựa chọn trừ khi multi; rỗng = rút', () => {
    const single = { options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }], multi: false, closesAt: null };
    assert.deepEqual(validVote(single, ['a']), ['a']);
    assert.deepEqual(validVote(single, []), []);
    assert.equal(typeof validVote(single, ['a', 'b']), 'string');
    assert.equal(typeof validVote(single, ['z']), 'string');
    assert.deepEqual(validVote({ ...single, multi: true }, ['a', 'b', 'a']), ['a', 'b']);
    assert.equal(pollClosed({ ...single, closesAt: '2026-10-20T00:00:00Z' }, now), true);
    assert.equal(pollClosed(single, now), false);
  });
});

describe('tệp', () => {
  it('loại theo MIME/đuôi; SVG/HTML ⇒ octet-stream (không chạy được từ R2)', () => {
    assert.equal(kindOf('image/png'), 'IMAGE');
    assert.equal(kindOf('video/quicktime'), 'VIDEO');
    assert.equal(kindOf('application/octet-stream', 'clip.MP4'), 'VIDEO');
    assert.equal(kindOf('image/svg+xml', 'x.svg'), 'FILE');
    assert.equal(kindOf('application/pdf'), 'FILE');
    assert.equal(kindOf('image/heic', 'a.heic'), 'FILE', 'HEIC: iOS đổi JPEG trước khi gửi');
    assert.equal(safeMime('text/html; charset=utf-8'), 'application/octet-stream');
    assert.equal(safeMime(''), 'application/octet-stream');
    assert.equal(mimeFor('VIDEO', 'application/octet-stream', 'a.mov'), 'video/quicktime');
    assert.equal(mimeFor('FILE', 'application/pdf', 'a.pdf'), 'application/pdf');
  });
  it('trần dung lượng theo đường tải', () => {
    assert.equal(sizeLimit('IMAGE', 'direct'), 20 * MB);
    assert.equal(sizeLimit('VIDEO', 'direct'), 25 * MB);
    assert.equal(sizeLimit('VIDEO', 'presign'), 200 * MB);
    assert.equal(sizeLimit('FILE', 'presign'), 100 * MB);
  });
  it('≤ 10 ảnh/video + ≤ 5 tệp mỗi bài', () => {
    assert.equal(attachmentMixError(Array(10).fill('IMAGE')), null);
    assert.match(attachmentMixError([...Array(9).fill('IMAGE'), 'VIDEO', 'VIDEO']) ?? '', /10 photos/);
    assert.equal(attachmentMixError([...Array(10).fill('IMAGE'), ...Array(5).fill('FILE')]), null);
    assert.match(attachmentMixError(Array(6).fill('FILE')) ?? '', /5 files/);
  });
});

describe('cảm xúc + đường dẫn', () => {
  it('bộ cảm xúc cố định (web = iOS)', () => {
    assert.deepEqual([...REACTION_KINDS], ['like', 'love', 'haha', 'wow', 'sad', 'celebrate']);
  });
  it('tóm tắt: giảm dần theo số, hoà theo thứ tự bộ; bỏ loại lạ/0', () => {
    assert.deepEqual(reactionSummary([{ kind: 'sad', count: 2 }, { kind: 'like', count: 2 }, { kind: 'love', count: 5 }, { kind: 'zzz', count: 9 }, { kind: 'wow', count: 0 }]),
      [{ kind: 'love', count: 5 }, { kind: 'like', count: 2 }, { kind: 'sad', count: 2 }]);
  });
  it('câu gộp thông báo', () => {
    assert.equal(reactionMessage('An', 0, 'love'), 'An reacted ❤️ to your post');
    assert.equal(reactionMessage('An', 1, 'like'), 'An and 1 other reacted to your post');
    assert.equal(reactionMessage('An', 4, 'like'), 'An and 4 others reacted to your post');
  });
  it('đường dẫn sâu', () => {
    assert.equal(postUrl('acme', 12), '/work/acme/feed?post=12');
    assert.equal(postUrl('acme', 12, 88), '/work/acme/feed?post=12&comment=88');
  });
});
