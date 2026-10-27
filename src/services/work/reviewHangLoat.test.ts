/**
 * CT Work 27/10/2026 — CuongMini review hàng loạt / tự động: điều kiện THUẦN.
 *   npx tsx --test src/services/work/reviewHangLoat.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { autoBackOk, autoDoneOk, parseCardDecision } from './reviewHangLoatRules.js';
import { agentRouteAllowed } from './permissions.js';

const IDX = [{ filename: 'src/App.java', patch: '@@ -1,1 +1,2 @@\n a\n+b', shown: true }];
const yes = (c: string) => ({ criterion: c, met: 'yes', evidence: 'src/App.java:2' });

describe('kết luận một thẻ', () => {
  it('DONE nhưng còn MAJOR / tiêu chí "no" ⇒ BACK; rác ⇒ KEEP', () => {
    assert.equal(parseCardDecision({ decision: 'done', acceptance: [yes('a')], findings: [{ file: 'src/App.java', line: 2, severity: 'MAJOR', message: 'x' }] }, IDX).decision, 'BACK');
    assert.equal(parseCardDecision({ decision: 'DONE', acceptance: [{ criterion: 'b', met: 'no', evidence: 'thiếu' }] }, IDX).decision, 'BACK');
    assert.equal(parseCardDecision({ decision: 'SHIP IT' }, IDX).decision, 'KEEP');
    assert.equal(parseCardDecision(null, IDX).decision, 'KEEP');
    const ok = parseCardDecision({ decision: 'DONE', acceptance: [yes('a')], comment: 'Đạt vì…' }, IDX);
    assert.equal(ok.decision, 'DONE');
    assert.equal(ok.comment, 'Đạt vì…');
  });
});

describe('chế độ tự động — chỉ tự chuyển khi chắc chắn', () => {
  const done = parseCardDecision({ decision: 'DONE', acceptance: [yes('a'), yes('b')] }, IDX);
  it('đủ điều kiện: mọi tiêu chí yes có bằng chứng, không BLOCKER/MAJOR, PR đã merge (nếu có code)', () => {
    assert.equal(autoDoneOk(done, { hasCode: true, merged: true }), true);
    assert.equal(autoDoneOk(done, { hasCode: false, merged: false }), true, 'thẻ không có code (tài liệu) — tiêu chí đủ là đủ');
  });
  it('PR chưa merge / tiêu chí unknown / không có tiêu chí / có MAJOR ⇒ KHÔNG tự Done', () => {
    assert.equal(autoDoneOk(done, { hasCode: true, merged: false }), false);
    assert.equal(autoDoneOk(parseCardDecision({ decision: 'DONE', acceptance: [yes('a'), { criterion: 'b', met: 'yes' }] }, IDX), { hasCode: false, merged: false }), false, 'yes không bằng chứng ⇒ unknown');
    assert.equal(autoDoneOk(parseCardDecision({ decision: 'DONE', acceptance: [] }, IDX), { hasCode: false, merged: false }), false);
    assert.equal(autoDoneOk({ ...done, findings: [{ file: 'src/App.java', line: 2, severity: 'MAJOR', category: 'correctness', message: 'x', suggestion: null }] }, { hasCode: true, merged: true }), false);
  });
  it('tự trả về In Progress chỉ khi có lý do cụ thể', () => {
    assert.equal(autoBackOk(parseCardDecision({ decision: 'BACK', acceptance: [{ criterion: 'a', met: 'no', evidence: 'x' }] }, IDX)), true);
    assert.equal(autoBackOk(parseCardDecision({ decision: 'BACK', acceptance: [{ criterion: 'a', met: 'unknown' }] }, IDX)), false);
    assert.equal(autoBackOk(parseCardDecision({ decision: 'KEEP' }, IDX)), false);
  });
  it('agent không gọi được review hàng loạt / bật tự động / hoàn tác', () => {
    for (const [m, p] of [['POST', '/code/review/queue'], ['POST', '/code/review/queue/apply'], ['PUT', '/code/review/auto'], ['POST', '/code/review/auto/3/undo'], ['GET', '/code/review/auto']] as const) {
      assert.equal(agentRouteAllowed(m, p), false, `${m} ${p}`);
    }
  });
});
