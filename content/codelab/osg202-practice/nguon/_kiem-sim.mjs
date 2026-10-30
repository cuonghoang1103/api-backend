/** Kiểm bộ mô phỏng với ví dụ sách giáo khoa: node content/codelab/osg202-practice/nguon/_kiem-sim.mjs */
import assert from 'node:assert/strict';
import * as S from './_sim.mjs';

// Tanenbaum Fig 3-?: chuỗi 20 tham chiếu, 3 khung: FIFO 15, LRU 12, OPT 9 (Silberschatz Fig 10.12-10.15)
const R = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1];
assert.equal(S.replace('FIFO', R, 3).faults, 15);
assert.equal(S.replace('LRU', R, 3).faults, 12);
assert.equal(S.replace('OPT', R, 3).faults, 9);
// Belady
const B = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
assert.equal(S.replace('FIFO', B, 3).faults, 9);
assert.equal(S.replace('FIFO', B, 4).faults, 10);
assert.equal(S.replace('LRU', B, 3).faults, 10);
assert.equal(S.replace('LRU', B, 4).faults, 8);
assert.equal(S.replace('OPT', B, 3).faults, 7);
// Silberschatz 5.3: P1 0/24, P2 0/3, P3 0/3: FCFS avg wait 17 ; SJF bài 5.3.2: P1 0/6 P2 0/8 P3 0/7 P4 0/3 avg 7
const f = S.schedule('FCFS', [{ id: 'P1', at: 0, bt: 24 }, { id: 'P2', at: 0, bt: 3 }, { id: 'P3', at: 0, bt: 3 }]);
assert.equal(f.avgWt, 17);
const sj = S.schedule('SJF', [{ id: 'P1', at: 0, bt: 6 }, { id: 'P2', at: 0, bt: 8 }, { id: 'P3', at: 0, bt: 7 }, { id: 'P4', at: 0, bt: 3 }]);
assert.equal(sj.avgWt, 7);
// SRTF Silberschatz 5.3.2: P1 0/8 P2 1/4 P3 2/9 P4 3/5 -> avg wait 6.5
const sr = S.schedule('SRTF', [{ id: 'P1', at: 0, bt: 8 }, { id: 'P2', at: 1, bt: 4 }, { id: 'P3', at: 2, bt: 9 }, { id: 'P4', at: 3, bt: 5 }]);
assert.equal(sr.avgWt, 6.5);
// nonpreemptive SJF cùng dữ liệu: avg 7.75
assert.equal(S.schedule('SJF', [{ id: 'P1', at: 0, bt: 8 }, { id: 'P2', at: 1, bt: 4 }, { id: 'P3', at: 2, bt: 9 }, { id: 'P4', at: 3, bt: 5 }]).avgWt, 7.75);
// RR q=4: P1 24, P2 3, P3 3 -> wait avg 5.66
assert.equal(S.schedule('RR', [{ id: 'P1', at: 0, bt: 24 }, { id: 'P2', at: 0, bt: 3 }, { id: 'P3', at: 0, bt: 3 }], 4).avgWt, 5.67);
// Priority Silberschatz 5.3.4: bt 10,1,2,1,5 pr 3,1,4,5,2 -> avg 8.2
const pr = S.schedule('PRIORITY', [[10, 3], [1, 1], [2, 4], [1, 5], [5, 2]].map(([bt, p], i) => ({ id: 'P' + (i + 1), at: 0, bt, pr: p })));
assert.equal(pr.avgWt, 8.2);
// Banker Silberschatz 8.6.3: 5 tiến trình, A B C = 10 5 7; Available 3 3 2 ; safe <P1,P3,P4,P0,P2>
const al = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]];
const mx = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const bk = S.banker([3, 3, 2], al, mx);
assert.deepEqual(bk.seq, [1, 3, 0, 2, 4]); assert.ok(bk.safe);   // quy ước quét từ 0 ⇒ P1,P3,P0,P2,P4 (cũng là một dãy an toàn)
assert.equal(S.banker_request([3, 3, 2], al, mx, 1, [1, 0, 2]), 'GRANT');
assert.equal(S.banker_request([2, 3, 0], al.map((r, i) => (i === 1 ? [3, 0, 2] : r)), mx, 4, [3, 3, 0]), 'WAIT');
const al2 = al.map((r, i) => (i === 1 ? [3, 0, 2] : r));
assert.equal(S.banker_request([2, 3, 0], al2, mx, 0, [0, 2, 0]), 'UNSAFE');
// Đĩa Silberschatz 10.4: 200 cyl, hàng đợi 98 183 37 122 14 124 65 67, đầu 53: FCFS 640, SSTF 236, SCAN(down) 236, LOOK(down) 208
const Q = [98, 183, 37, 122, 14, 124, 65, 67];
assert.equal(S.disk('FCFS', 53, Q, 'up', 199).total, 640);
assert.equal(S.disk('SSTF', 53, Q, 'up', 199).total, 236);
assert.equal(S.disk('SCAN', 53, Q, 'down', 199).total, 236);
assert.equal(S.disk('LOOK', 53, Q, 'down', 199).total, 208);
assert.equal(S.disk('CSCAN', 53, Q, 'up', 199).total, 382);
// phân vùng
assert.deepEqual(S.fit('first', [100, 500, 200, 300, 600], [212, 417, 112, 426]).place, [1, 4, 1, -1]);
assert.deepEqual(S.fit('best', [100, 500, 200, 300, 600], [212, 417, 112, 426]).place, [3, 1, 2, 4]);
assert.deepEqual(S.fit('worst', [100, 500, 200, 300, 600], [212, 417, 112, 426]).place, [4, 1, 4, -1]);
// fork
assert.equal(S.processCount([{ op: 'fork' }, { op: 'fork' }, { op: 'fork' }]), 8);
assert.equal(S.processCount([{ op: 'forkIf', who: 'child', then: [{ op: 'fork' }] }]), 3);
// race: 2 luồng x 1 lần: {1,2}
assert.deepEqual(S.raceOutcomes(2, 1), [1, 2]);
// Amdahl, util, eat
assert.ok(Math.abs(S.amdahl(0.9, 10) - 5.263) < 0.001);
assert.ok(Math.abs(S.cpuUtil(0.8, 4) - 0.5904) < 1e-9);
assert.equal(S.inodeMax(1024, 4, 12, 3), 12 * 1024 + 256 * 1024 + 256 * 256 * 1024 + 256 * 256 * 256 * 1024);
assert.equal(S.chmodOctal('rwxr-x---'), '750'); assert.equal(S.chmodOctal('-rw-r--r--'), '644');
assert.deepEqual(S.dining([[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]]).deadlock, true);
assert.equal(S.dining([[0, 1], [1, 2], [2, 3], [3, 4], [0, 4]]).deadlock, false);
assert.equal(S.firstBlock(2, 'PPP'), 2); assert.equal(S.firstBlock(2, 'PCPC'), -1); assert.equal(S.firstBlock(1, 'C'), 0);
assert.equal(S.threadsNeeded(0.9, 5), 9); assert.equal(S.threadsNeeded(0.9, 10), -1);
console.log('✓ _sim.mjs khớp ví dụ sách giáo khoa');
