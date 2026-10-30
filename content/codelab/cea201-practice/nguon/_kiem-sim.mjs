/** Kiểm bộ mô phỏng với ví dụ sách/slide: node content/codelab/cea201-practice/nguon/_kiem-sim.mjs */
import assert from 'node:assert/strict';
import * as S from './_sim.mjs';

// Amdahl: f = 0.8, s = 2 ⇒ 1.5385 ; f=0.9 s=∞ → 10
assert.ok(Math.abs(S.amdahl(0.8, 2) - 1 / (0.2 + 0.4)) < 1e-12);
assert.ok(Math.abs(S.amdahl(0.9, 1e12) - 10) < 1e-6);
// CPU time: 2e9 instr × CPI 1.5 / 3 GHz = 1 s
assert.equal(S.cpuTime(2e9, 1.5, 3e9), 1);
// Stallings Fig 4.x: 16M-word memory, cache 64 KB, 4 B block, direct: tag 8 index 14 offset 2 (24-bit address, 16K lines)
const g = S.cacheGeom(24, 4, 64 * 1024, 1);
assert.deepEqual([g.tagBits, g.indexBits, g.offsetBits, g.lines], [8, 14, 2, 16384]);
// 2-way, 16-bit... 32-bit addr 32 KB 64 B blocks 4-way ⇒ sets 128, off 6 idx 7 tag 19
const g2 = S.cacheGeom(32, 64, 32 * 1024, 4);
assert.deepEqual([g2.tagBits, g2.indexBits, g2.offsetBits, g2.sets], [19, 7, 6, 128]);
// Direct mapped 4 lines of 1 word: addresses 0 4 0 4 → thrash (block size 1): "0,4,0,4" all miss
assert.equal(S.cacheSim([0, 4, 0, 4], 1, 4, 1, 'LRU').misses, 4);
assert.equal(S.cacheSim([0, 4, 0, 4], 1, 4, 2, 'LRU').misses, 2); // 2-way ⇒ no thrash
// Hennessy&Patterson 5ª: blocos 0,8,0,6,8 en caché 4 bloques: directa 5 fallos, 2-way LRU 4 fallos, completa 3
const hp = [0, 8, 0, 6, 8];
assert.equal(S.cacheSim(hp, 1, 4, 1, 'LRU').misses, 5);
assert.equal(S.cacheSim(hp, 1, 4, 2, 'LRU').misses, 4);
assert.equal(S.cacheSim(hp, 1, 4, 4, 'LRU').misses, 3);
// Hamming(7,4) Wikipedia: 1011 -> 0110011
assert.equal(S.hammingEncode('1011'), '0110011');
assert.equal(S.hammingR(8), 4); assert.equal(S.hammingR(4), 3); assert.equal(S.hammingR(64), 7);
for (let p = 0; p < 12; p++) { const c = S.hammingEncode('10110010'); const w = c.split(''); w[p] = w[p] === '1' ? '0' : '1'; assert.equal(S.hammingSyndrome(w.join('')), p + 1); assert.equal(S.hammingDecode(w.join('')), '10110010'); }
// Stallings Ch5: 8-bit data 00111001 -> check bits ... (kiểm tính chất: syndrome 0)
assert.equal(S.hammingSyndrome(S.hammingEncode('00111001')), 0);
// Disk Stallings: seek 4 ms, 7200 rpm, 512 B sector, 500 sectors/track => Ta = 4+4.17+0.0083 ... (b/rN)
assert.ok(Math.abs(S.diskAccess(4, 7200, 512, 512 * 500) - (4 + 60000 / 7200 / 2 + 60000 / 7200 / 500)) < 1e-9);
assert.equal(S.raidUsable(5, 5), 4); assert.equal(S.raidUsable(10, 8), 4);
assert.equal(S.raidRecover([5, null, 9, 12]), 5 ^ 9 ^ 12);
// bù 2
assert.equal(S.toTwos(-5, 8), '11111011'); assert.equal(S.fromTwos('10000000'), -128);
assert.equal(S.addTwos(100, 50, 8).overflow, true); assert.equal(S.addTwos(-100, -28, 8).overflow, false);
assert.equal(S.addTwos(127, 1, 8).bits, '10000000');
// IEEE 754 : -118.625 = C2ED4000 (ví dụ kinh điển) ; 0.1 = 3DCCCCCD ; 1.0 = 3F800000
assert.equal(S.f32Fields(-118.625).hex, 'C2ED4000');
assert.equal(S.f32Fields(0.1).hex, '3DCCCCCD');
assert.equal(S.f32Fields(1).hex, '3F800000');
assert.equal(S.f32Value('C0A00000'), -5);
// pipeline kinh điển H&P: add r1,r2,r3 ; sub r4,r1,r5 : không chuyển tiếp 8 chu kỳ, có 6 ; lw r1 ; add r2,r1,r3 : có chuyển tiếp 7
const A = [{ op: 'alu', rd: 1, rs: 2, rt: 3 }, { op: 'alu', rd: 4, rs: 1, rt: 5 }];
assert.equal(S.pipeSim(A, false).cycles, 8); assert.equal(S.pipeSim(A, true).cycles, 6);
const B = [{ op: 'lw', rd: 1, rs: 2 }, { op: 'alu', rd: 3, rs: 1, rt: 4 }];
assert.equal(S.pipeSim(B, true).cycles, 7); assert.equal(S.pipeSim(B, false).cycles, 8);
// n lệnh độc lập: n + 4
assert.equal(S.pipeSim([{ op: 'alu', rd: 1, rs: 2, rt: 3 }, { op: 'alu', rd: 4, rs: 5, rt: 6 }, { op: 'alu', rd: 7, rs: 8, rt: 9 }], false).cycles, 7);
// dự đoán 2 bit: vòng lặp TTTN lặp lại — trạng thái đầu 0
assert.equal(S.predict2bit('TTTTNTTTTN', 0).mispredicts, 4);
// MESI: P0 R (E), P1 R (S,S), P1 W (I,M)
assert.deepEqual(S.mesi(2, [[0, 'R'], [1, 'R'], [1, 'W']]).states, ['EI', 'SS', 'IM']);
// MARIE — ví dụ slide: p2 (N=3) -> 6 ; p4 5×4 = 20 en 46 pasos ; suma por AddI = 45 en 40 pasos
const p2 = `ORG 100
Loop, Load N
Skipcond 800
Jump Done
Load Sum
Add N
Store Sum
Load N
Subt One
Store N
Jump Loop
Done, Load Sum
Output
Halt
N, Dec 3
Sum, Dec 0
One, Dec 1`;
assert.deepEqual(S.marieRun(p2).output, [6]);
const p4 = `ORG 100
Loop, Load Ctr
Skipcond 400
Jump Body
Jump Done
Body, Load Sum
Add X
Store Sum
Load Ctr
Subt One
Store Ctr
Jump Loop
Done, Load Sum
Output
Halt 000
X, Dec 5
Ctr, Dec 4
Sum, Dec 0
One, Dec 1`;
const r4 = S.marieRun(p4); assert.deepEqual(r4.output, [20]); assert.equal(r4.steps, 46);
const ps = `ORG 100
Load Addr
Store Next
Load Num
Subt One
Store Ctr
Loop, Load Sum
AddI Next
Store Sum
Load Next
Add One
Store Next
Load Ctr
Subt One
Store Ctr
Skipcond 000
Jump Loop
Load Sum
Output
Halt 000
Addr, Hex 119
Next, Hex 0
Num, Dec 3
Sum, Dec 0
Ctr, Hex 0
One, Dec 1
Dec 10
Dec 15
Dec 20`;
const rs = S.marieRun(ps); assert.deepEqual(rs.output, [45]); assert.equal(rs.steps, 40);
assert.equal(S.marieAssemble(ps)[0].word, '1113'); // Load Addr(113)
// hàm trang
const R = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1];
assert.equal(S.pageFaults('FIFO', R, 3), 15); assert.equal(S.pageFaults('LRU', R, 3), 12);
console.log('✓ _sim.mjs khớp ví dụ sách/slide');
assert.equal(S.pipeSim([...A, { op: 'alu', rd: 7, rs: 8, rt: 9 }], false).stalls, 2);
console.log('✓ stalls');
const tr = S.marieRun(p4).trace; assert.equal(tr.length, 46); assert.deepEqual([tr[0].op, tr[0].ac, tr[0].next], ['Load', 4, 0x101]);
assert.equal(tr[5].op, 'Store'); assert.equal(tr[4].ac, 5);
console.log('✓ trace');
assert.equal(S.marieAssemble('ORG 10\nOct 17')[0].word, '000F');
console.log('✓ oct');
