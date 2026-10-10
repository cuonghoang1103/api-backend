/**
 * UX-C — luật thuần: kẹt (time in status), baseline, WBS kéo-thả, tổng theo nhánh. Đáp án tính tay.
 *   npx tsx --test src/services/work/uxcRules.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { criticalPath } from './planning.service.js';
import {
  branchTotals, compareBaseline, computeStuck, enteredStatusAt, isReviewStatus, iterationTotals, planWbsMove, snapshotPlan, statusAges,
  stuckThreshold, type WbsNode,
} from './uxcRules.js';

const D = (iso: string) => new Date(iso);

describe('UX-C — kẹt (thời gian ở trạng thái hiện tại)', () => {
  const statuses = [
    { id: 1, name: 'To Do', category: 'TODO' },
    { id: 2, name: 'In Progress', category: 'IN_PROGRESS' },
    { id: 3, name: 'In Review', category: 'IN_PROGRESS' },
    { id: 4, name: 'Done', category: 'DONE' },
  ];
  const now = D('2026-10-11T00:00:00Z');

  it('nhận ra trạng thái review (cả tiếng Việt), không nhầm "Preview"/"Testing"', () => {
    assert.ok(isReviewStatus('In Review'));
    assert.ok(isReviewStatus('Code review'));
    assert.ok(isReviewStatus('QA'));
    assert.ok(isReviewStatus('Chờ duyệt'));
    assert.equal(isReviewStatus('Preview build'), false);
    assert.equal(isReviewStatus('In Progress'), false);
  });

  it('ngưỡng: review 2 ngày; đang làm = max(3, ⌈P85⌉)', () => {
    assert.deepEqual(stuckThreshold('In Review', 9), { days: 2, reason: 'REVIEW' });
    assert.deepEqual(stuckThreshold('In Progress', null), { days: 3, reason: 'IN_PROGRESS' });
    assert.deepEqual(stuckThreshold('In Progress', 2.1), { days: 3, reason: 'IN_PROGRESS' });
    assert.deepEqual(stuckThreshold('In Progress', 6.2), { days: 7, reason: 'IN_PROGRESS' });
  });

  it('ngày vào trạng thái = lần đổi CUỐI tới trạng thái hiện tại (vào–ra–vào lại tính từ lần sau)', () => {
    const issue = { id: 9, statusId: 2, createdAt: D('2026-10-01T00:00:00Z') };
    const ch = [
      { issueId: 9, from: '1', to: '2', at: D('2026-10-02T00:00:00Z') },
      { issueId: 9, from: '2', to: '3', at: D('2026-10-04T00:00:00Z') },
      { issueId: 9, from: '3', to: '2', at: D('2026-10-06T00:00:00Z') },
      { issueId: 7, from: '1', to: '2', at: D('2026-10-09T00:00:00Z') },
    ];
    assert.equal(enteredStatusAt(issue, ch).toISOString(), '2026-10-06T00:00:00.000Z');
    assert.equal(statusAges([issue], ch, now).get(9), 5);
    // Không có lịch sử ⇒ từ ngày tạo.
    assert.equal(enteredStatusAt({ id: 1, statusId: 2, createdAt: D('2026-10-01T00:00:00Z') }, []).toISOString(), '2026-10-01T00:00:00.000Z');
  });

  it('chỉ thẻ nhóm IN_PROGRESS; cờ Blocked luôn kẹt; sắp: Blocked → Review → lâu nhất', () => {
    const mk = (id: number, statusId: number, entered: string, flagged = false) => ({
      id, number: id, title: `T${id}`, statusId, assigneeId: id % 2 ? 5 : null, createdAt: D(entered), flaggedAt: flagged ? D('2026-10-10T00:00:00Z') : null,
    });
    const issues = [
      mk(1, 2, '2026-10-09T00:00:00Z'), // 2 ngày đang làm < 3 ⇒ không
      mk(2, 2, '2026-10-05T00:00:00Z'), // 6 ngày ≥ 3 ⇒ kẹt
      mk(3, 3, '2026-10-08T12:00:00Z'), // 2,5 ngày review ≥ 2 ⇒ kẹt
      mk(4, 3, '2026-10-10T00:00:00Z'), // 1 ngày review ⇒ không
      mk(5, 1, '2026-09-01T00:00:00Z'), // To Do lâu ⇒ không xét
      mk(6, 2, '2026-10-10T12:00:00Z', true), // vừa vào nhưng bị chặn ⇒ kẹt
    ];
    const r = computeStuck({ issues, statusChanges: [], statuses, now, p85: null });
    assert.deepEqual(r.map((x) => [x.number, x.reason, x.days]), [[6, 'BLOCKED', 0.5], [3, 'REVIEW', 2.5], [2, 'IN_PROGRESS', 6]]);
    // P85 = 6,4 ⇒ ngưỡng 7 ⇒ thẻ 2 (6 ngày) hết kẹt.
    const r2 = computeStuck({ issues, statusChanges: [], statuses, now, p85: 6.4 });
    assert.deepEqual(r2.map((x) => x.number), [6, 3]);
  });
});

describe('UX-C — baseline (C5)', () => {
  it('chụp chỉ thẻ có ngày', () => {
    const snap = snapshotPlan([
      { id: 1, number: 1, start: '2026-10-01', due: '2026-10-05' },
      { id: 2, number: 2, start: null, due: null },
      { id: 3, number: 3, start: null, due: '2026-10-09' },
    ]);
    assert.deepEqual(snap.map((x) => x.id), [1, 3]);
  });

  it('so: trễ/sớm/đúng/thêm/bỏ/gỡ lịch + tóm tắt', () => {
    const base = [
      { id: 1, number: 1, start: '2026-10-01', due: '2026-10-05' },
      { id: 2, number: 2, start: '2026-10-02', due: '2026-10-08' },
      { id: 3, number: 3, start: '2026-10-03', due: '2026-10-06' },
      { id: 4, number: 4, start: '2026-10-04', due: '2026-10-07' },
      { id: 5, number: 5, start: '2026-10-05', due: '2026-10-09' },
      { id: 7, number: 7, start: '2026-10-05', due: null },
    ];
    const cur = [
      { id: 1, number: 1, start: '2026-10-03', due: '2026-10-09' }, // +4 trễ
      { id: 2, number: 2, start: '2026-10-02', due: '2026-10-06' }, // −2 sớm
      { id: 3, number: 3, start: '2026-10-03', due: '2026-10-06' }, // 0
      { id: 4, number: 4, start: null, due: null }, // gỡ lịch
      // 5 đã xoá
      { id: 6, number: 6, start: '2026-10-10', due: '2026-10-12' }, // mới
      { id: 7, number: 7, start: '2026-10-06', due: null }, // gốc chỉ có start ⇒ so theo start: +1
    ];
    const { rows, summary } = compareBaseline(cur, base);
    const st = Object.fromEntries(rows.map((r) => [r.id, [r.state, r.slipDays]]));
    assert.deepEqual(st, {
      1: ['SLIPPED', 4], 2: ['AHEAD', -2], 3: ['ON_PLAN', 0], 4: ['UNSCHEDULED', null], 5: ['REMOVED', null], 6: ['ADDED', null], 7: ['SLIPPED', 1],
    });
    assert.deepEqual(summary, { slipped: 2, ahead: 1, onPlan: 1, added: 1, removed: 1, unscheduled: 1, maxSlip: 4, avgSlip: 0.8 });
    // Sắp: trễ nhiều nhất trước.
    assert.equal(rows[0].id, 1);
  });
});

describe('UX-C — WBS kéo-thả', () => {
  // E1 (epic) ⊃ S1, S2 (story) ; S1 ⊃ T1 (sub-task) ; E2 (epic) ⊃ S3 ; S4 không có epic.
  const nodes: WbsNode[] = [
    { id: 1, parentId: null, level: 1, rank: 'a' },
    { id: 2, parentId: null, level: 1, rank: 'b' },
    { id: 10, parentId: 1, level: 0, rank: 'c' },
    { id: 11, parentId: 1, level: 0, rank: 'e' },
    { id: 12, parentId: 2, level: 0, rank: 'g' },
    { id: 13, parentId: null, level: 0, rank: 'h' },
    { id: 100, parentId: 10, level: -1, rank: 'd' },
  ];

  it('đổi thứ tự trong cùng cha: đặt S2 trước S1 ⇒ (null, rank S1)', () => {
    assert.deepEqual(planWbsMove(nodes, { id: 11, parentId: 1, beforeId: 10 }), { parentId: 1, prevRank: null, nextRank: 'c', parentChanged: false });
  });
  it('đổi cha: S3 sang E1, sau S1 ⇒ giữa S1 và S2', () => {
    assert.deepEqual(planWbsMove(nodes, { id: 12, parentId: 1, afterId: 10 }), { parentId: 1, prevRank: 'c', nextRank: 'e', parentChanged: true });
  });
  it('không nói vị trí ⇒ cuối danh sách con', () => {
    assert.deepEqual(planWbsMove(nodes, { id: 13, parentId: 2 }), { parentId: 2, prevRank: 'g', nextRank: null, parentChanged: true });
  });
  it('nhô story ra gốc (bỏ epic) được; sub-task thì không', () => {
    assert.equal((planWbsMove(nodes, { id: 10, parentId: null }) as { parentId: null }).parentId, null);
    assert.deepEqual(planWbsMove(nodes, { id: 100, parentId: null }), { error: 'SUBTASK_NEEDS_PARENT' });
  });
  it('sai tầng / vòng / chính mình / epic có cha / hàng xóm lạ', () => {
    assert.deepEqual(planWbsMove(nodes, { id: 100, parentId: 1 }), { error: 'BAD_PARENT_LEVEL' }); // sub-task dưới epic
    assert.deepEqual(planWbsMove(nodes, { id: 10, parentId: 13 }), { error: 'BAD_PARENT_LEVEL' }); // story dưới story
    assert.deepEqual(planWbsMove(nodes, { id: 1, parentId: 2 }), { error: 'EPIC_NO_PARENT' });
    assert.deepEqual(planWbsMove(nodes, { id: 10, parentId: 10 }), { error: 'SELF' });
    assert.deepEqual(planWbsMove(nodes, { id: 10, parentId: 100 }), { error: 'CYCLE' });
    assert.deepEqual(planWbsMove(nodes, { id: 11, parentId: 1, beforeId: 12 }), { error: 'BAD_NEIGHBOR' });
    assert.deepEqual(planWbsMove(nodes, { id: 999, parentId: null }), { error: 'NOT_FOUND' });
  });
});

describe('UX-C — tổng theo nhánh + iteration (WBS)', () => {
  // 1.0 Epic (0,5) ⊃ 1.1 (2) ⊃ 1.1.1 (1) ; 1.2 (null) ; 2.0 (3)
  const rows = [
    { issueId: 1, depth: 0, plannedDays: 0.5, actualDays: 0, start: null, due: null, iteration: '' },
    { issueId: 2, depth: 1, plannedDays: 2, actualDays: 1.5, start: '2026-10-01', due: '2026-10-04', iteration: 'Iter1' },
    { issueId: 3, depth: 2, plannedDays: 1, actualDays: 0.25, start: '2026-10-02', due: '2026-10-09', iteration: 'Iter1' },
    { issueId: 4, depth: 1, plannedDays: null, actualDays: 2, start: null, due: '2026-09-28', iteration: 'Iter2' },
    { issueId: 5, depth: 0, plannedDays: 3, actualDays: 0, start: '2026-10-10', due: null, iteration: 'Iter10' },
  ];
  it('nhánh cộng dồn cả cây con + khoảng ngày bao con', () => {
    const t = branchTotals(rows);
    assert.deepEqual(t.get(1), { issueId: 1, planned: 3.5, actual: 3.75, start: '2026-09-28', end: '2026-10-09', leaves: 2 });
    assert.deepEqual(t.get(2), { issueId: 2, planned: 3, actual: 1.75, start: '2026-10-01', end: '2026-10-09', leaves: 1 });
    assert.deepEqual(t.get(3), { issueId: 3, planned: 1, actual: 0.25, start: '2026-10-02', end: '2026-10-09', leaves: 1 });
    assert.deepEqual(t.get(5), { issueId: 5, planned: 3, actual: 0, start: '2026-10-10', end: '2026-10-10', leaves: 1 });
    // Tổng các gốc = tổng effort riêng từng dòng (không đếm trùng).
    assert.equal(t.get(1)!.planned + t.get(5)!.planned, 6.5);
  });
  it('iteration sắp tự nhiên (Iter2 trước Iter10), "không iteration" cuối', () => {
    assert.deepEqual(iterationTotals(rows), [
      { iteration: 'Iter1', planned: 3, actual: 1.75, items: 2 },
      { iteration: 'Iter2', planned: 0, actual: 2, items: 0 },
      { iteration: 'Iter10', planned: 3, actual: 0, items: 1 },
      { iteration: '', planned: 0.5, actual: 0, items: 1 },
    ]);
  });
});

describe('UX-C — đường găng hiển thị (planning.criticalPath)', () => {
  it('chuỗi phụ thuộc dài nhất theo số ngày, bỏ thẻ đã xong, bỏ vòng', () => {
    const items = [
      { id: 1, start: '2026-10-01', due: '2026-10-03', done: false }, // 3 ngày
      { id: 2, start: '2026-10-04', due: '2026-10-10', done: false }, // 7
      { id: 3, start: '2026-10-04', due: '2026-10-05', done: false }, // 2
      { id: 4, start: '2026-10-11', due: '2026-10-12', done: false }, // 2
      { id: 5, start: '2026-10-01', due: '2026-10-30', done: true }, // xong ⇒ bỏ
    ];
    const deps = [{ from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 }, { from: 3, to: 4 }, { from: 5, to: 1 }, { from: 4, to: 1 }];
    // 4→1 tạo vòng 1→2→4→1 ⇒ cả chu trình bị bỏ khỏi Kahn ⇒ không có đường.
    assert.deepEqual(criticalPath(items, deps), { path: [], days: 0 });
    const acyclic = deps.filter((d) => !(d.from === 4 && d.to === 1));
    assert.deepEqual(criticalPath(items, acyclic), { path: [1, 2, 4], days: 12 });
  });
});
