/**
 * CT Work đợt 7a — luật thuần OKR / poker / retro / timer (không DB):
 *   npx tsx --test src/services/work/agileRules.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  cardPoints, cardView, cycleElapsed, krProgress, linkedProgress, objectiveProgress, objectiveScore, okrStatus, pokerDistribution, retroLocked,
  scoreBand, suggestedScore, suggestFromPeers, timerElapsedSec, timerMinutes, timerOverdue, validCard, validColumn, votesLeft, weekStartVN,
} from './agileRules.js';

describe('OKR — tiến độ', () => {
  it('KR số: tính theo start → target, kẹp 0..1, chiều giảm vẫn đúng', () => {
    assert.equal(krProgress('NUMBER', 0, 10, 5), 0.5);
    assert.equal(krProgress('NUMBER', 0, 10, 15), 1);
    assert.equal(krProgress('NUMBER', 0, 10, -3), 0);
    assert.equal(krProgress('NUMBER', 800, 200, 500), 0.5); // thời gian phản hồi giảm 800 → 200ms
    assert.equal(krProgress('PERCENT', 20, 80, 50), 0.5);
    assert.equal(krProgress('NUMBER', 5, 5, 5), 1);
    assert.equal(krProgress('NUMBER', 5, 5, 4), 0);
  });
  it('KR boolean: 1 = xong, 0 = chưa', () => {
    assert.equal(krProgress('BOOLEAN', 0, 1, 1), 1);
    assert.equal(krProgress('BOOLEAN', 0, 1, 0), 0);
  });
  it('tiến độ từ thẻ liên kết: khử trùng, theo số thẻ hoặc điểm; không có điểm ⇒ lùi về đếm thẻ', () => {
    const issues = [{ id: 1, done: true, points: 3 }, { id: 2, done: false, points: 5 }, { id: 1, done: true, points: 3 }, { id: 3, done: true, points: 2 }];
    assert.deepEqual(linkedProgress('ISSUES', issues), { progress: 0.667, done: 2, total: 3, unit: 'issues' });
    assert.deepEqual(linkedProgress('POINTS', issues), { progress: 0.5, done: 5, total: 10, unit: 'points' });
    assert.deepEqual(linkedProgress('POINTS', [{ id: 1, done: true, points: null }, { id: 2, done: false, points: null }]), { progress: 0.5, done: 1, total: 2, unit: 'issues' });
    assert.equal(linkedProgress('ISSUES', []).progress, 0);
  });
  it('objective = trung bình KR', () => {
    assert.equal(objectiveProgress([1, 0.5, 0]), 0.5);
    assert.equal(objectiveProgress([]), 0);
  });
  it('trạng thái theo nhịp thời gian + độ tự tin thấp kéo xuống AT_RISK', () => {
    assert.equal(okrStatus(0.5, 0.5, null), 'ON_TRACK');
    assert.equal(okrStatus(0.3, 0.5, null), 'AT_RISK');
    assert.equal(okrStatus(0.1, 0.5, null), 'OFF_TRACK');
    assert.equal(okrStatus(0.6, 0.5, 2), 'AT_RISK');
    assert.equal(okrStatus(1, 0.5, 2), 'DONE');
    assert.equal(okrStatus(0, 0, null), 'NOT_STARTED');
    assert.equal(okrStatus(0.2, 0.9, null, true), 'SCORED');
  });
  it('phần thời gian đã trôi tính trọn ngày cuối', () => {
    const s = new Date('2026-10-01T00:00:00Z');
    const e = new Date('2026-10-10T00:00:00Z'); // 10 ngày
    assert.equal(cycleElapsed(s, e, new Date('2026-09-01T00:00:00Z')), 0);
    assert.equal(cycleElapsed(s, e, new Date('2026-10-06T00:00:00Z')), 0.5);
    assert.equal(cycleElapsed(s, e, new Date('2026-12-01T00:00:00Z')), 1);
  });
});

describe('OKR — chấm điểm', () => {
  it('điểm gợi ý = tiến độ làm tròn 0.1; objective = trung bình KR đã chấm', () => {
    assert.equal(suggestedScore(0.66), 0.7);
    assert.equal(suggestedScore(1.4), 1);
    assert.equal(objectiveScore([0.7, 0.4, null]), 0.55);
    assert.equal(objectiveScore([null]), null);
  });
  it('dải màu kiểu Google: <0.4 đỏ, 0.4–0.6 vàng, ≥0.7 xanh', () => {
    assert.equal(scoreBand(0.3), 'RED');
    assert.equal(scoreBand(0.5), 'YELLOW');
    assert.equal(scoreBand(0.7), 'GREEN');
  });
  it('tuần check-in = thứ Hai theo giờ VN', () => {
    assert.equal(weekStartVN(new Date('2026-10-11T10:00:00Z')), '2026-10-05'); // CN 17:00 VN
    assert.equal(weekStartVN(new Date('2026-10-11T18:00:00Z')), '2026-10-12'); // T2 01:00 VN
  });
});

describe('Planning poker', () => {
  it('bộ bài + điểm của lá', () => {
    assert.ok(validCard('FIBONACCI', '13'));
    assert.ok(!validCard('FIBONACCI', '4'));
    assert.ok(validCard('TSHIRT', 'XL'));
    assert.equal(cardPoints('FIBONACCI', '8'), 8);
    assert.equal(cardPoints('FIBONACCI', '?'), null);
    assert.equal(cardPoints('TSHIRT', 'L'), 5);
  });
  it('phân bố: đếm theo thứ tự bộ bài, trung bình/trung vị, đồng thuận, thấp/cao, gợi ý chốt', () => {
    const d = pokerDistribution('FIBONACCI', ['5', '3', '8', '5', '?']);
    assert.deepEqual(d.counts, [{ value: '3', count: 1 }, { value: '5', count: 2 }, { value: '8', count: 1 }, { value: '?', count: 1 }]);
    assert.equal(d.voters, 5);
    assert.equal(d.numeric, 4);
    assert.equal(d.average, 5.3);
    assert.equal(d.median, 5);
    assert.equal(d.consensus, false);
    assert.equal(d.mode, '5');
    assert.equal(d.low, '3');
    assert.equal(d.high, '8');
    assert.equal(d.suggested, '5');
    assert.equal(pokerDistribution('FIBONACCI', ['3', '3']).consensus, true);
    assert.equal(pokerDistribution('FIBONACCI', ['3']).consensus, false);
    // trung vị 4 (3,5) ⇒ hoà 3 và 5 ⇒ chọn lá LỚN hơn (thận trọng)
    assert.equal(pokerDistribution('FIBONACCI', ['3', '5']).suggested, '5');
  });
  it('gợi ý từ thẻ tương tự — chỉ khi đủ giống, bám lá trong bộ bài', () => {
    const peers = [
      { key: 'P-1', title: 'Login page with Google OAuth', points: 5, typeKey: 'STORY' },
      { key: 'P-2', title: 'Login page validation errors', points: 3, typeKey: 'STORY' },
      { key: 'P-3', title: 'Export report to Excel', points: 8, typeKey: 'STORY' },
    ];
    const r = suggestFromPeers('FIBONACCI', { title: 'Login page with Facebook OAuth', typeKey: 'STORY' }, peers);
    assert.equal(r.basis[0].key, 'P-1');
    assert.ok(r.basis.every((b) => b.key !== 'P-3'));
    assert.equal(r.suggested, '5');
    assert.equal(suggestFromPeers('FIBONACCI', { title: 'Completely unrelated topic', typeKey: 'BUG' }, peers).suggested, null);
    assert.equal(suggestFromPeers('TSHIRT', { title: 'Login page with Facebook OAuth', typeKey: 'STORY' }, peers).suggested, 'L');
  });
});

describe('Retro', () => {
  const card = { id: 1, column: 'START', body: 'Pair more', authorId: 7, groupId: null, position: 0, createdAt: new Date('2026-10-11T00:00:00Z') };
  it('ẩn danh: không có tác giả, không có thời điểm, chỉ cờ mine của người xem', () => {
    const other = cardView(card, { viewerId: 9, anonymous: true, author: { username: 'an' }, votes: 3, myVotes: 1 });
    assert.equal(other.author, null);
    assert.equal(other.mine, false);
    assert.ok(!('createdAt' in other));
    assert.ok(!JSON.stringify(other).includes('"authorId"'));
    assert.ok(!JSON.stringify(other).includes('an'));
    assert.equal(cardView(card, { viewerId: 7, anonymous: true, author: null, votes: 0, myVotes: 0 }).mine, true);
  });
  it('có tên: kèm tác giả', () => {
    const v = cardView(card, { viewerId: 9, anonymous: false, author: { username: 'an' }, votes: 0, myVotes: 0 });
    assert.deepEqual(v.author, { username: 'an' });
  });
  it('khoá theo hạn hoặc khoá tay', () => {
    const now = new Date('2026-10-11T10:00:00Z');
    assert.equal(retroLocked({ lockAt: null, lockedAt: null }, now), false);
    assert.equal(retroLocked({ lockAt: new Date('2026-10-11T09:00:00Z'), lockedAt: null }, now), true);
    assert.equal(retroLocked({ lockAt: new Date('2026-10-12T09:00:00Z'), lockedAt: null }, now), false);
    assert.equal(retroLocked({ lockAt: null, lockedAt: now }, now), true);
  });
  it('cột theo mẫu + chấm vote còn lại', () => {
    assert.ok(validColumn('FOUR_L', 'LONGED_FOR'));
    assert.ok(!validColumn('SSC', 'MAD'));
    assert.equal(votesLeft(5, 3), 2);
    assert.equal(votesLeft(5, 9), 0);
  });
});

describe('Timer', () => {
  it('giây đã chạy cộng phần đang chạy; tạm dừng thì đứng yên', () => {
    const now = new Date('2026-10-11T10:00:00Z');
    assert.equal(timerElapsedSec({ accumulatedSec: 60, runningSince: new Date('2026-10-11T09:59:00Z') }, now), 120);
    assert.equal(timerElapsedSec({ accumulatedSec: 60, runningSince: null }, now), 60);
  });
  it('làm tròn phút; < 30 giây ⇒ 0; trần 24h có cờ', () => {
    assert.deepEqual(timerMinutes(29), { minutes: 0, capped: false });
    assert.deepEqual(timerMinutes(90), { minutes: 2, capped: false });
    assert.deepEqual(timerMinutes(30 * 3600), { minutes: 1440, capped: true });
  });
  it('nhắc khi quá ngưỡng (0 = tắt)', () => {
    assert.equal(timerOverdue(4 * 3600, 240), true);
    assert.equal(timerOverdue(3 * 3600, 240), false);
    assert.equal(timerOverdue(99 * 3600, 0), false);
  });
});
