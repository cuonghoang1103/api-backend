/**
 * addr-split: đối chiếu với output thật của osgcalc.py addr/pagesize/loglen/seg/eat (lab/out/c164-bo-nho) và vài con
 * số sách giáo khoa (x86-64 4 mức, TLB reach).
 *   cd frontend && npx tsx --test src/components/os-lab/engine/addr.test.ts
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { eat, logicalBits, multiLevel, pageTableSize, parseAddr, segTranslate, splitVA, tlbReach } from './addr';

const OUT = fs.readFileSync(fileURLToPath(new URL('../../../../../content/courses/operating-systems-for-developers/lab/out/c164-bo-nho.out.txt', import.meta.url)), 'utf8');

describe('addr-split vs osgcalc.py (c164)', () => {
  it('addr bits=10,10,12 0x12345678 ⇒ 72 / 837 / 1656 (0x678)', () => {
    const r = splitVA(parseAddr('0x12345678')!, [10, 10, 12]);
    assert.deepEqual(r.fields.map((f) => f.value), [72, 837, 1656]);
    assert.deepEqual(r.fields.map((f) => f.bin), ['0001001000', '1101000101', '011001111000']);
    assert.match(OUT, /PT1 +10 bits +0001001000 += 72/); assert.match(OUT, /offset +12 bits +011001111000 += 1656 +\(0x678\)/);
    assert.equal(r.pageBytes, 4096); assert.equal(r.pages, BigInt(1048576));
  });
  it('addr bits=9,11,12 0x00C02ABC ⇒ 1 / 1026 / 2748 (0xabc)', () => {
    assert.deepEqual(splitVA(parseAddr('0x00C02ABC')!, [9, 11, 12]).fields.map((f) => f.value), [1, 1026, 2748]);
    assert.match(OUT, /PT2 +11 bits +10000000010 += 1026/);
  });
  it('0xABCDE123 (final exam, c168): 8/12/12 ⇒ 171 / 3294 / 291; 10/10/12 ⇒ 687 / 222 / 291', () => {
    const c168 = fs.readFileSync(fileURLToPath(new URL('../../../../../content/courses/operating-systems-for-developers/lab/out/c168-thi.out.txt', import.meta.url)), 'utf8');
    assert.deepEqual(splitVA(parseAddr('0xABCDE123')!, [8, 12, 12]).fields.map((f) => f.value), [171, 3294, 291]);
    assert.deepEqual(splitVA(parseAddr('0xABCDE123')!, [10, 10, 12]).fields.map((f) => f.value), [687, 222, 291]);
    for (const v of ['= 171', '= 3294', '= 687', '= 222', '= 291']) assert.ok(c168.includes(v), v);
  });
  it('pagesize 32 8192 4 ⇒ 13 offset bits, 2^19 pages, 2 MiB table', () => {
    const r = pageTableSize(32, 8192, 4);
    assert.equal(r.offBits, 13); assert.equal(r.vpnBits, 19); assert.equal(r.pages, BigInt(524288)); assert.equal(r.bytes, BigInt(2097152));
    assert.match(OUT, /pages = 2\^19 = 524,288; single-level table = 524,288 x 4 B = 2,097,152 B = 2 MiB/);
  });
  it('loglen 128 8192 ⇒ 7 + 13 = 20 bits', () => {
    assert.deepEqual(logicalBits(128, 8192), { page: 7, off: 13, total: 20 });
    assert.match(OUT, /logical address = 7 \+ 13 = 20 bits/);
  });
  it('segmentation: (2, 250) ⇒ 1150; (1, 130) ⇒ trap', () => {
    const T: Array<[number, number]> = [[2100, 500], [3800, 120], [900, 300], [5000, 750]];
    assert.deepEqual(segTranslate(T, 2, 250), { ok: true, phys: 1150, base: 900, limit: 300 });
    assert.equal(segTranslate(T, 1, 130).ok, false);
    assert.match(OUT, /physical = 900 \+ 250 = 1150/); assert.match(OUT, /130 >= 120 -> TRAP/);
  });
  it('EAT: 94 ns, 106 ns with 4 levels, 154 ns at 80 % hits', () => {
    assert.equal(eat(10, 80, 0.95).eat, 94);
    assert.ok(Math.abs(eat(10, 80, 0.95, 4).eat - 106) < 1e-9);
    assert.ok(Math.abs(eat(10, 80, 0.8, 4).eat - 154) < 1e-9);
    assert.equal(eat(10, 80, 0.95, 4).miss, 410);
    for (const v of ['94 ns', '106 ns', '154 ns']) assert.ok(OUT.includes(`= ${v}`), v);
  });
});

describe('beyond the exam', () => {
  it('x86-64 / arm64 4-level 48-bit: 9/9/9/9/12, 512 entries × 8 B = one 4 KiB page per table', () => {
    const r = splitVA(parseAddr('0x00007FFDE3A41F28')!, [9, 9, 9, 9, 12]);
    assert.equal(r.total, 48); assert.equal(r.fields.length, 5);
    assert.equal(r.fields[4].value, 0xF28);
    const ml = multiLevel([9, 9, 9, 9, 12], 8, [[BigInt(0x400000), BigInt(0x400000) + BigInt(4096) * BigInt(16)]]);
    assert.ok(ml.levels.every((l) => l.bytesEach === 4096));
    assert.deepEqual(ml.levels.map((l) => l.tables), [BigInt(1), BigInt(1), BigInt(1), BigInt(1)]);
    assert.equal(ml.bytes, BigInt(16384)); // 4 bảng × 4 KiB — một mức phẳng sẽ là 2^36 × 8 B = 512 GiB
    assert.equal(pageTableSize(48, 4096, 8).bytes, BigInt(549755813888));
  });
  it('two-level 32-bit: a process with 4 MiB of code at 0 and 1 stack page at the top needs 3 tables = 12 KiB, not 4 MiB', () => {
    const ml = multiLevel([10, 10, 12], 4, [[BigInt(0), BigInt(4) << BigInt(20)], [BigInt(0xFFFFF000), BigInt(0x100000000)]]);
    assert.deepEqual(ml.levels.map((l) => l.tables), [BigInt(1), BigInt(2)]);
    assert.equal(ml.bytes, BigInt(12288));
    assert.equal(pageTableSize(32, 4096, 4).bytes, BigInt(4194304));
  });
  it('TLB reach: 64 entries × 4 KiB = 256 KiB; × 2 MiB = 128 MiB', () => {
    assert.equal(tlbReach(64, 4096), 262144); assert.equal(tlbReach(64, 2 << 20), 128 << 20);
  });
});
