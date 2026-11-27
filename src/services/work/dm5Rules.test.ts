/**
 * dm5 G1 — phần thuần của cổng quy trình (dm5Rules.ts):  npx tsx --test src/services/work/dm5Rules.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  capacityOf, capacityVerdict, cleanCapacity, cleanMoscowCap, cleanRagRules, cleanReadyRequirements, cleanRetroActionCap, cleanWipGuards,
  doneCiFlagsOf, flatTailDays, moscowCapOf, moscowKeyOf, moscowShare, ragLevel, RAG_DEFAULTS, retroActionCapOf, statusWeights,
  weightedCompletion, worstLevel,
} from './dm5Rules.js';
import { hasRules, transitionRulesOf } from './studio.js';

describe('dm5 G1 — chuẩn hoá settings', () => {
  it('readyRequirements: id lạ bị lọc, trống ⇒ null, mockup một mình vẫn bật', () => {
    assert.equal(cleanReadyRequirements(null), null);
    assert.equal(cleanReadyRequirements({ fieldIds: [] }), null);
    assert.deepEqual(cleanReadyRequirements({ fieldIds: [3, 3, -1, 'x', 4], typeKeys: ['STORY', ' ', 1], toStatusIds: [] }), { fieldIds: [3, 4], typeKeys: ['STORY'], toStatusIds: null, requireMockupApproved: false });
    assert.deepEqual(cleanReadyRequirements({ requireMockupApproved: true }), { fieldIds: [], typeKeys: null, toStatusIds: null, requireMockupApproved: true });
  });
  it('doneCiFlags: requirePr chỉ có nghĩa khi requireCiGreen', () => {
    assert.deepEqual(doneCiFlagsOf({ doneRequirements: { requirePr: true } }), { requireCiGreen: false, requirePr: false });
    assert.deepEqual(doneCiFlagsOf({ doneRequirements: { requireCiGreen: true, requirePr: true } }), { requireCiGreen: true, requirePr: true });
    assert.deepEqual(doneCiFlagsOf(null), { requireCiGreen: false, requirePr: false });
  });
  it('wipGuards: bỏ luật thiếu cột / tự trỏ; limit < 1 ⇒ null', () => {
    assert.equal(cleanWipGuards('x'), null);
    assert.deepEqual(cleanWipGuards([{ whenColumn: 'Review', blocksColumn: 'review' }, { whenColumn: ' In Review ', blocksColumn: 'Doing', limit: 0 }, { whenColumn: 'A' }]),
      [{ whenColumn: 'In Review', blocksColumn: 'Doing', limit: null }]);
  });
  it('capacity: kẹp miền, caution ≤ warn; thiếu ⇒ mặc định 0.7 / 75 / 85', () => {
    assert.deepEqual(capacityOf({}), { focusFactor: 0.7, cautionPct: 75, warnPct: 85 });
    assert.deepEqual(cleanCapacity({ focusFactor: 3, warnPct: 60, cautionPct: 90 }), { focusFactor: 1, cautionPct: 60, warnPct: 60 });
    assert.deepEqual(cleanCapacity({ focusFactor: 0.01 }), { focusFactor: 0.1, cautionPct: 75, warnPct: 85 });
  });
  it('ragRules: ghi đè từng chiều, red ≥ amber; rỗng ⇒ null', () => {
    assert.equal(cleanRagRules({}), null);
    const r = cleanRagRules({ quality: { amber: 5, red: 2 } })!;
    assert.deepEqual(r.quality, { amber: 5, red: 5 });
    assert.deepEqual(r.schedule, RAG_DEFAULTS.schedule);
  });
  it('moscowCap / retroActionCap: 0 tắt, mặc định Must 60, retro không trần', () => {
    assert.equal(moscowCapOf({}), 60);
    assert.equal(moscowCapOf({ moscowCapPct: 0 }), null);
    assert.equal(moscowCapOf({ moscowCapPct: 150 }), 100);
    assert.equal(cleanMoscowCap(-3), 0);
    assert.equal(retroActionCapOf({}), null);
    assert.equal(retroActionCapOf({ retroActionCap: 2 }), 2);
    assert.equal(cleanRetroActionCap(0), null);
    assert.equal(cleanRetroActionCap(40), 10);
  });
});

describe('dm5 G1 — luật luồng chuyển (A6)', () => {
  it('requireComment + minHoursInFrom được giữ, sai kiểu bị bỏ, hasRules nhận ra', () => {
    assert.deepEqual(transitionRulesOf({ requireComment: { teamIds: [2, 2, 'x'] }, minHoursInFrom: 24 }), { requireComment: { teamIds: [2] }, minHoursInFrom: 24 });
    assert.deepEqual(transitionRulesOf({ requireComment: true }), { requireComment: { teamIds: [] } });
    assert.deepEqual(transitionRulesOf({ minHoursInFrom: -1, requireComment: 'yes' }), {});
    assert.equal(transitionRulesOf({ minHoursInFrom: 9999 }).minHoursInFrom, 720);
    assert.equal(hasRules({ minHoursInFrom: 2 }), true);
    assert.equal(hasRules({ requireComment: { teamIds: [] } }), true);
    assert.equal(hasRules({}), false);
  });
});

describe('dm5 G1 — số liệu', () => {
  it('capacityVerdict: % = ước lượng / (sức chứa × focus); ngưỡng cam/đỏ', () => {
    const s = { focusFactor: 0.5, cautionPct: 75, warnPct: 85 };
    assert.equal(capacityVerdict({ estimateHours: 12, capacityHours: 20, settings: s }).level, 'RED');
    assert.equal(capacityVerdict({ estimateHours: 8, capacityHours: 20, settings: s }).level, 'AMBER');
    assert.equal(capacityVerdict({ estimateHours: 5, capacityHours: 20, settings: s }).level, 'GREEN');
    const none = capacityVerdict({ estimateHours: 5, capacityHours: null, settings: s });
    assert.equal(none.level, null);
    assert.equal(none.pct, null);
  });
  it('RAG: ngưỡng ≥, tổng = tệ nhất', () => {
    assert.equal(ragLevel(null, { amber: 1, red: 2 }), 'GREEN');
    assert.equal(ragLevel(1, { amber: 1, red: 2 }), 'AMBER');
    assert.equal(ragLevel(2, { amber: 1, red: 2 }), 'RED');
    assert.equal(worstLevel(['GREEN', 'AMBER', 'GREEN']), 'AMBER');
    assert.equal(worstLevel([]), 'GREEN');
  });
  it('bậc trạng thái 0/20/50/75/100 + % hoàn thành có trọng số', () => {
    const wf = 1;
    const w = statusWeights([
      { id: 1, name: 'Backlog', category: 'TODO', position: 0, workflowId: wf },
      { id: 2, name: 'Selected', category: 'TODO', position: 1, workflowId: wf },
      { id: 3, name: 'In Progress', category: 'IN_PROGRESS', position: 2, workflowId: wf },
      { id: 4, name: 'In Review', category: 'IN_PROGRESS', position: 3, workflowId: wf },
      { id: 5, name: 'Done', category: 'DONE', position: 4, workflowId: wf },
      { id: 6, name: 'Open', category: 'TODO', position: 0, workflowId: 2 },
      { id: 7, name: 'Reopened', category: 'TODO', position: 1, workflowId: 2 },
    ]);
    assert.deepEqual([1, 2, 3, 4, 5, 6, 7].map((id) => w.get(id)), [0, 20, 50, 75, 100, 0, 0]);
    // 2 điểm ở Done (200) + 2 điểm ở Review (150) trên 4 điểm ⇒ 87.5%
    assert.equal(weightedCompletion([{ statusId: 5, weight: 2 }, { statusId: 4, weight: 2 }], w), 87.5);
    assert.equal(weightedCompletion([], w), null);
    // thiếu ước lượng ⇒ trọng số 1
    assert.equal(weightedCompletion([{ statusId: 5, weight: 0 }, { statusId: 1, weight: 0 }], w), 50);
  });
  it('burndown đi ngang: đếm ngày cuối liên tiếp không giảm', () => {
    assert.equal(flatTailDays([{ day: '2026-11-01', remaining: 10 }, { day: '2026-11-02', remaining: 8 }, { day: '2026-11-03', remaining: 8 }, { day: '2026-11-04', remaining: 8 }, { day: '2026-11-05', remaining: 9 }]), 3);
    assert.equal(flatTailDays([{ day: '2026-11-02', remaining: 8 }, { day: '2026-11-01', remaining: 10 }]), 0);
    assert.equal(flatTailDays([]), 0);
  });
  it('MoSCoW: nhận id/nhãn; Won\'t ngoài mẫu số', () => {
    const opts = [{ id: 'o1', label: 'Must' }, { id: 'o2', label: "Won't" }];
    assert.equal(moscowKeyOf('o1', opts), 'must');
    assert.equal(moscowKeyOf('Should'), 'should');
    assert.equal(moscowKeyOf('o2', opts), 'wont');
    assert.equal(moscowKeyOf(3), null);
    const s = moscowShare([{ key: 'must', effort: 6 }, { key: 'could', effort: 2 }, { key: 'wont', effort: 50 }, { key: null, effort: 0 }]);
    assert.equal(s.mustPct, 75);
    assert.equal(s.unclassified, 1);
  });
});
