/**
 * CTW K-3 — luật phía client của kênh chat (ngữ cảnh báo tại chỗ, tiêu đề tab, @nhắc trong ô gõ, gộp tin):
 *   npx tsx --test frontend/src/lib/work-chat-rules.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as R from './work-chat-rules';

describe('K-3 báo tại chỗ', () => {
  const on = { alert: true, sound: true, desktop: true };
  it('không alert (tin của mình / tắt tiếng / chỉ khi @nhắc / giờ im lặng — máy chủ đã tính) ⇒ không gì cả', () => {
    assert.deepEqual(R.localAlert({ ...on, alert: false }, { viewingChannelId: null, focused: false, osAllowed: true }, 1), { toast: false, sound: false, os: false });
  });
  it('đang xem ĐÚNG kênh + cửa sổ focus ⇒ không âm, không toast', () => {
    assert.deepEqual(R.localAlert(on, { viewingChannelId: 1, focused: true, osAllowed: true }, 1), { toast: false, sound: false, os: false });
  });
  it('trang khác (cửa sổ focus) ⇒ toast + âm, không thông báo hệ thống', () => {
    assert.deepEqual(R.localAlert(on, { viewingChannelId: 2, focused: true, osAllowed: true }, 1), { toast: true, sound: true, os: false });
  });
  it('cửa sổ ở nền ⇒ âm + thông báo hệ thống (khi được phép)', () => {
    assert.deepEqual(R.localAlert(on, { viewingChannelId: 1, focused: false, osAllowed: true }, 1), { toast: false, sound: true, os: true });
    assert.equal(R.localAlert(on, { viewingChannelId: 1, focused: false, osAllowed: false }, 1).os, false);
  });
  it('tắt âm mà vẫn giữ badge/thông báo', () => {
    assert.deepEqual(R.localAlert({ ...on, sound: false }, { viewingChannelId: null, focused: false, osAllowed: true }, 1), { toast: false, sound: false, os: true });
  });
});

describe('K-3 tiêu đề tab', () => {
  it('(3) CT Work', () => {
    assert.equal(R.titleWithBadge('CT Work', 3), '(3) CT Work');
    assert.equal(R.titleWithBadge('(3) CT Work', 5), '(5) CT Work');
    assert.equal(R.titleWithBadge('(5) Board · CT Work', 0), 'Board · CT Work');
    assert.equal(R.titleWithBadge('CT Work', 250), '(99+) CT Work');
  });
});

describe('K-3 nhãn tắt tiếng', () => {
  const now = new Date(2026, 9, 10, 10, 0);
  it('hôm nay / ngày mai / tới khi bật lại / hết hạn', () => {
    assert.equal(R.muteLabel(new Date(2026, 9, 10, 10, 30).toISOString(), false, now), 'Muted until 10:30');
    assert.equal(R.muteLabel(new Date(2026, 9, 11, 8, 0).toISOString(), false, now), 'Muted until tomorrow 08:00');
    assert.equal(R.muteLabel('2999-12-31T00:00:00Z', true, now), 'Muted until you turn it back on');
    assert.equal(R.muteLabel(new Date(2026, 9, 10, 9, 0).toISOString(), false, now), null, 'đã hết hạn');
    assert.equal(R.muteLabel(null, false, now), null);
  });
});

describe('K-3 @nhắc trong ô gõ', () => {
  it('nhận "@li" trước con trỏ, bỏ email', () => {
    assert.deepEqual(R.mentionQuery('hi @li', 6), { start: 3, query: 'li' });
    assert.deepEqual(R.mentionQuery('@', 1), { start: 0, query: '' });
    assert.equal(R.mentionQuery('mail a@b', 8), null);
    assert.equal(R.mentionQuery('hi @li there', 12), null);
  });
  it('chèn @username + dấu cách, con trỏ sau đó', () => {
    const at = R.mentionQuery('hi @li and', 6)!;
    assert.deepEqual(R.applyMention('hi @li and', at, 'linh_2'), { text: 'hi @linh_2  and', caret: 11 });
  });
  it('tô @tên chỉ khi là người trong kênh', () => {
    assert.deepEqual(R.splitMentions('hey @Linh and @ghost, a@b.com', new Set(['linh'])), [
      { t: 'text', v: 'hey ' }, { t: 'mention', v: '@Linh' }, { t: 'text', v: ' and @ghost, a@b.com' },
    ]);
  });
});

describe('K-3 gộp tin + vạch "New messages"', () => {
  const t = (min: number) => new Date(2026, 9, 10, 10, min).toISOString();
  it('cùng người < 5 phút ⇒ gộp; tin hệ thống / người khác / quá 5 phút ⇒ không', () => {
    assert.equal(R.isContinuation({ authorId: 1, createdAt: t(0), kind: 'USER' }, { authorId: 1, createdAt: t(4), kind: 'USER' }), true);
    assert.equal(R.isContinuation({ authorId: 1, createdAt: t(0), kind: 'USER' }, { authorId: 1, createdAt: t(6), kind: 'USER' }), false);
    assert.equal(R.isContinuation({ authorId: 1, createdAt: t(0), kind: 'USER' }, { authorId: 2, createdAt: t(1), kind: 'USER' }), false);
    assert.equal(R.isContinuation({ authorId: 1, createdAt: t(0), kind: 'SYSTEM' }, { authorId: 1, createdAt: t(1), kind: 'USER' }), false);
    assert.equal(R.isContinuation(null, { authorId: 1, createdAt: t(1), kind: 'USER' }), false);
  });
  it('tin chưa đọc đầu tiên của NGƯỜI KHÁC', () => {
    const ms = [{ id: 5, authorId: 2 }, { id: 6, authorId: 1 }, { id: 7, authorId: 2 }];
    assert.equal(R.firstUnreadId(ms, 5, 1), 7);
    assert.equal(R.firstUnreadId(ms, 4, 1), 5);
    assert.equal(R.firstUnreadId(ms, 7, 1), null);
  });
  it('dòng "đang gõ"', () => {
    assert.equal(R.typingLine([]), null);
    assert.equal(R.typingLine(['An']), 'An is typing…');
    assert.equal(R.typingLine(['An', 'Bình']), 'An and Bình are typing…');
    assert.equal(R.typingLine(['An', 'Bình', 'Chi']), 'An and 2 others are typing…');
  });
  it('khoá chống gửi trùng hợp lệ với server (chữ/số/gạch, ≤ 64)', () => {
    const k = R.newClientKey();
    assert.match(k, /^[\w-]{3,64}$/);
    assert.notEqual(k, R.newClientKey());
  });
});
