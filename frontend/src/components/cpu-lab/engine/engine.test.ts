/**
 * Kiểm engine của CPU Lab ("Máy tính từ số 0") với đáp án ĐỘC LẬP: TextEncoder, Float32Array/Float64Array, phép tính
 * số nguyên của JS, và ví dụ cache trong sách (Patterson & Hennessy).
 *   npx tsx --test frontend/src/components/cpu-lab/engine/engine.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  arith, bin, bitwise, digitsFromSteps, divisionSteps, hex, negateSteps, parseNumber, placeValues, shift, toSigned, wrap,
  type Width,
} from './bits';
import {
  charsOf, decodeCp1252, exactDecimal, floatParts, fracToBinarySteps, mojibake, partsFromBits, utf8Bytes, utf8Decode, utf8Encode, bytesOfU32,
} from './encoding';
import { decoder, fullAdder, gate, halfAdder, mux, NAND_BUILD, registerTimeline, rippleAdd, fromBits, truthTable, type Bit } from './logic';
import { assemble, disasm, EXAMPLES, run, s16, instrIndex } from './marie';
import { amat, CACHE_PRESETS, simulate, split, type CacheCfg } from './cache';

const W: Width[] = [8, 16, 32];

describe('bits — two\'s complement & arithmetic', () => {
  it('toSigned matches Int8/Int16/Int32 arrays for many values', () => {
    const vals = [0, 1, 127, 128, 200, 255, 256, 32767, 32768, 65535, 2 ** 31 - 1, 2 ** 31, 2 ** 32 - 1, 123456789];
    for (const v of vals) {
      assert.equal(toSigned(wrap(v, 8), 8), new Int8Array([v])[0]);
      assert.equal(toSigned(wrap(v, 16), 16), new Int16Array([v])[0]);
      assert.equal(toSigned(wrap(v, 32), 32), new Int32Array([v])[0]);
    }
  });
  it('wrap(-1) is all ones', () => {
    assert.equal(bin(wrap(-1, 8), 8), '11111111');
    assert.equal(hex(wrap(-56, 8), 8), 'C8');
  });
  it('negate = invert + 1', () => {
    const n = negateSteps(5, 8);
    assert.equal(bin(n.inverted, 8), '11111010');
    assert.equal(toSigned(n.plusOne, 8), -5);
    assert.equal(negateSteps(128, 8).plusOne, 128); // −(−128) tràn về chính nó
  });
  it('add/sub flags agree with Int8/Uint8 arithmetic, exhaustive 8-bit', () => {
    for (let a = 0; a < 256; a += 3) for (let b = 0; b < 256; b += 5) {
      const r = arith(a, b, '+', 8);
      assert.equal(r.result, (a + b) & 255);
      assert.equal(r.carryOut, a + b > 255 ? 1 : 0);
      const sa = toSigned(a, 8), sb = toSigned(b, 8);
      assert.equal(r.signedOverflow, sa + sb > 127 || sa + sb < -128);
      const d = arith(a, b, '-', 8);
      assert.equal(d.result, (a - b) & 255);
      assert.equal(d.signedOverflow, sa - sb > 127 || sa - sb < -128);
      assert.equal(d.unsignedOverflow, a < b);
      assert.equal(d.carryOut, a >= b ? 1 : 0); // trừ: C = 1 nghĩa là không mượn
    }
  });
  it('127 + 1 overflows signed but not unsigned', () => {
    const r = arith(127, 1, '+', 8);
    assert.equal(r.signedOverflow, true);
    assert.equal(r.unsignedOverflow, false);
    assert.equal(toSigned(r.result, 8), -128);
  });
  it('shifts match JS operators on 32 bits', () => {
    const vals = [0x80000001, 0x12345678, 0xfffffff0, 1];
    for (const v of vals) for (let n = 0; n < 5; n++) {
      assert.equal(shift(v, n, 'shl', 32).value, (v << n) >>> 0);
      assert.equal(shift(v, n, 'shr', 32).value, v >>> n);
      assert.equal(shift(v, n, 'sar', 32).value, (v >> n) >>> 0);
      assert.equal(shift(v, n, 'rol', 32).value, n ? ((v << n) | (v >>> (32 - n))) >>> 0 : v);
    }
  });
  it('bitwise matches JS operators', () => {
    for (const w of W) {
      const a = wrap(0xdeadbeef, w), b = wrap(0x0f0f0f0f, w);
      assert.equal(bitwise(a, b, 'and', w), wrap((a & b) >>> 0, w));
      assert.equal(bitwise(a, b, 'or', w), wrap((a | b) >>> 0, w));
      assert.equal(bitwise(a, b, 'xor', w), wrap((a ^ b) >>> 0, w));
      assert.equal(bitwise(a, 0, 'not', w), wrap(~a >>> 0, w));
    }
  });
  it('repeated division and place values', () => {
    const st = divisionSteps(200, 2);
    assert.equal(digitsFromSteps(st), '11001000');
    assert.equal(digitsFromSteps(divisionSteps(200, 16)), 'C8');
    assert.equal(digitsFromSteps(divisionSteps(200, 8)), '310');
    assert.equal(placeValues('11001000', 2).reduce((s, t) => s + t.value, 0), 200);
    assert.equal(placeValues('C8', 16).reduce((s, t) => s + t.value, 0), 200);
  });
  it('parses user input in any base', () => {
    assert.equal(parseNumber('0xC8'), 200);
    assert.equal(parseNumber('0b1100_1000'), 200);
    assert.equal(parseNumber('0o310'), 200);
    assert.equal(parseNumber('-56'), -56);
    assert.equal(parseNumber('C8h'), 200);
    assert.equal(parseNumber('hello'), null);
  });
});

describe('encoding — UTF-8 against TextEncoder', () => {
  const samples = ['A', 'Hello', 'Việt Nam', 'ệ', 'Đường', '日本語', '€', '😀', 'tiếng Việt có dấu ẵ ỡ ự'];
  it('utf8Encode == TextEncoder for every code point of samples', () => {
    const te = new TextEncoder();
    for (const s of samples) assert.deepEqual(utf8Bytes(s), Array.from(te.encode(s)));
  });
  it('exhaustive code points sample', () => {
    const te = new TextEncoder();
    for (let cp = 0; cp < 0x110000; cp += cp < 0x3000 ? 1 : 97) {
      if (cp >= 0xd800 && cp <= 0xdfff) continue;
      assert.deepEqual(utf8Encode(cp), Array.from(te.encode(String.fromCodePoint(cp))));
    }
  });
  it('"ệ" (U+1EC7) is 3 bytes E1 BB 87', () => {
    const [c] = charsOf('ệ');
    assert.equal(c.uplus, 'U+1EC7');
    assert.deepEqual(c.utf8, [0xe1, 0xbb, 0x87]);
    assert.deepEqual(c.utf8Segs[0].map((s) => s.bits), ['1110', '0001']);
  });
  it('NFD splits ệ into e + 2 combining marks', () => {
    const d = charsOf('ệ'.normalize('NFD'));
    assert.equal(d.length, 3);
    assert.equal(d[0].ch, 'e');
    assert.ok(d[1].combining && d[2].combining);
  });
  it('mojibake: Việt read as Windows-1252', () => {
    assert.equal(mojibake('Việt'), 'Viá»‡t');
    assert.equal(decodeCp1252([0xc3, 0xa9]), 'Ã©'); // é
    const td = new TextDecoder('windows-1252');
    assert.equal(mojibake('Đường Việt Nam'), td.decode(new Uint8Array(utf8Bytes('Đường Việt Nam'))));
  });
  it('utf8Decode round-trips and flags broken bytes', () => {
    const s = 'Xin chào 😀';
    assert.equal(String.fromCodePoint(...utf8Decode(utf8Bytes(s))), s);
    assert.deepEqual(utf8Decode([0xe1, 0xbb]), [0xfffd, 0xfffd]);
  });
});

describe('IEEE-754 against Float32Array / Float64Array', () => {
  const vals = [0, -0, 1, -1, 0.1, 0.2, 0.3, 0.5, 1.5, -2.75, 3.14159, 1e-40, 1e-45, 3.4e38, 1e39, Infinity, -Infinity, NaN, 123456.789, 2 ** -126, 2 ** -149];
  it('float32 fields rebuild the same value as Float32Array', () => {
    for (const v of vals) {
      const p = floatParts(v, 'f32');
      const f = new Float32Array([v])[0];
      if (Number.isNaN(f)) { assert.equal(p.kind, 'nan'); continue; }
      assert.ok(Object.is(p.value, f), `${v}: ${p.value} vs ${f}`);
      // bit khớp với Uint32 nhìn qua cùng bộ nhớ
      const u = new Uint32Array(new Float32Array([v]).buffer)[0];
      assert.equal(p.bits, u.toString(2).padStart(32, '0'));
      if (p.kind === 'normal' || p.kind === 'subnormal' || p.kind === 'zero') assert.equal(Number(p.exact), f);
    }
  });
  it('float64 fields match Float64Array', () => {
    for (const v of vals) {
      const p = floatParts(v, 'f64');
      if (Number.isNaN(v)) { assert.equal(p.kind, 'nan'); continue; }
      assert.ok(Object.is(p.value, v));
      if (p.kind !== 'inf') assert.equal(Number(p.exact), v);
    }
  });
  it('exact stored values of 0.1', () => {
    assert.equal(floatParts(0.1, 'f32').exact, '0.100000001490116119384765625');
    assert.equal(floatParts(0.1, 'f64').exact, '0.1000000000000000055511151231257827021181583404541015625');
    const p = floatParts(0.1, 'f32');
    assert.equal(p.sign, 0); assert.equal(p.expRaw, 123); assert.equal(p.exp, -4); assert.equal(p.kind, 'normal');
  });
  it('0.1 + 0.2 != 0.3 explained by exact values', () => {
    const sum = floatParts(0.1 + 0.2, 'f64').exact, three = floatParts(0.3, 'f64').exact;
    assert.notEqual(sum, three);
    assert.equal(sum, '0.3000000000000000444089209850062616169452667236328125');
    assert.equal(three, '0.299999999999999988897769753748434595763683319091796875');
  });
  it('subnormal and special kinds', () => {
    assert.equal(floatParts(1e-45, 'f32').kind, 'subnormal');
    assert.equal(floatParts(1e39, 'f32').kind, 'inf');
    assert.equal(partsFromBits('0' + '1'.repeat(8) + '1'.padEnd(23, '0'), 'f32').kind, 'nan');
  });
  it('exactDecimal basics', () => {
    assert.equal(exactDecimal(BigInt(1), -1), '0.5');
    assert.equal(exactDecimal(BigInt(3), 2), '12');
  });
  it('0.1 in binary repeats 0011 forever', () => {
    const r = fracToBinarySteps('0.1', 30);
    assert.equal(r.steps.map((s) => s.bit).join(''), '00011');
    assert.equal(r.repeatsFrom, 1);
    assert.equal(fracToBinarySteps('0.625').steps.map((s) => s.bit).join(''), '101');
  });
  it('endianness', () => {
    assert.deepEqual(bytesOfU32(0x12345678, false), [0x12, 0x34, 0x56, 0x78]);
    const le = new Uint8Array(new Uint32Array([0x12345678]).buffer); // máy chạy test là little-endian (x86/ARM)
    assert.deepEqual(bytesOfU32(0x12345678, true), Array.from(le));
  });
});

describe('logic gates & adders', () => {
  it('truth tables', () => {
    assert.deepEqual(truthTable('XOR').map((r) => r[2]), [0, 1, 1, 0]);
    assert.deepEqual(truthTable('NAND').map((r) => r[2]), [1, 1, 1, 0]);
    assert.deepEqual(truthTable('NOT').map((r) => r[1]), [1, 0]);
  });
  it('everything from NAND equals the direct gate', () => {
    for (const a of [0, 1] as Bit[]) for (const b of [0, 1] as Bit[]) {
      assert.equal(NAND_BUILD.AND.f(a, b), gate('AND', a, b));
      assert.equal(NAND_BUILD.OR.f(a, b), gate('OR', a, b));
      assert.equal(NAND_BUILD.XOR.f(a, b), gate('XOR', a, b));
      assert.equal(NAND_BUILD.NOT.f(a, b), gate('NOT', a));
    }
  });
  it('half/full adder truth', () => {
    assert.deepEqual(halfAdder(1, 1), { a: 1, b: 1, s: 0, c: 1 });
    for (const a of [0, 1] as Bit[]) for (const b of [0, 1] as Bit[]) for (const c of [0, 1] as Bit[]) {
      const f = fullAdder(a, b, c);
      assert.equal(f.s + 2 * f.cout, a + b + c);
    }
  });
  it('ripple-carry adder = integer addition, carry settles one stage per step', () => {
    for (let a = 0; a < 256; a += 7) for (let b = 0; b < 256; b += 11) {
      const snaps = rippleAdd(a, b, 8);
      const last = snaps[snaps.length - 1];
      assert.equal(fromBits(last.sum) + (last.carry[8] ? 256 : 0), a + b);
      assert.equal(snaps.length, 9);
      assert.equal(snaps[3].sum.filter((x) => x !== null).length, 3);
    }
  });
  it('mux & decoder', () => {
    assert.equal(mux([0, 1, 0, 0], 1), 1);
    assert.deepEqual(decoder(2, 2), [0, 0, 1, 0]);
  });
  it('register only changes on a rising edge', () => {
    const t = registerTimeline([{ kind: 'd', value: 5 }, { kind: 'd', value: 9 }, { kind: 'tick' }, { kind: 'd', value: 3 }, { kind: 'tick' }]);
    assert.equal(t[2].q, 0); // D đổi 2 lần, Q vẫn 0
    assert.equal(t[3].q, 9); assert.ok(t[3].edge);
    assert.equal(t[5].q, 9); // D = 3 nhưng chưa có nhịp
    assert.equal(t[6].q, 3);
  });
});

describe('MARIE assembler', () => {
  it('assembles the textbook add program to known machine code', () => {
    const p = assemble(EXAMPLES.add.src);
    assert.ok(p.ok, JSON.stringify(p.errors));
    // Load X (X = 005) · Add Y · Store Z · Output · Halt
    assert.deepEqual(Array.from(p.mem.slice(0, 8)), [0x1005, 0x3006, 0x2007, 0x6000, 0x7000, 5, 7, 0]);
    assert.equal(p.symbols.X, 5);
    assert.equal(disasm(0x1005), 'Load 005');
  });
  it('ORG, HEX, negative DEC, aliases, ADR', () => {
    const p = assemble('ORG 100\nLoad A\nSUB B\nJMP 100\nHLT\nA, HEX 1F\nB, DEC -1\nP, ADR A');
    assert.ok(p.ok, JSON.stringify(p.errors));
    assert.equal(p.start, 0x100);
    assert.deepEqual(Array.from(p.mem.slice(0x100, 0x107)), [0x1104, 0x4105, 0x9100, 0x7000, 0x1f, 0xffff, 0x104]);
  });
  it('reports errors with line numbers', () => {
    const p = assemble('Load Nope\nFoo 3\nX, DEC 5\nX, DEC 6\nSkipcond zz\nAdd');
    assert.equal(p.ok, false);
    const lines = p.errors.map((e) => e.line).sort();
    assert.deepEqual(lines, [1, 2, 4, 5, 6]);
  });
});

describe('MARIE CPU semantics', () => {
  const exec = (src: string, inputs: number[] = []) => run(assemble(src), inputs);
  it('add → 12', () => {
    const r = exec(EXAMPLES.add.src);
    assert.equal(r.stop, 'halt');
    assert.deepEqual(r.snaps[r.snaps.length - 1].output, [12]);
    assert.equal(r.mems[r.mems.length - 1][7], 12);
    assert.equal(r.trace.length, 5);
  });
  it('sum 1..5 → 15 and instruction count', () => {
    const r = exec(EXAMPLES.sum.src);
    assert.deepEqual(r.snaps[r.snaps.length - 1].output, [15]);
    // 2 lệnh đầu + 5 vòng × 8 lệnh (vòng cuối Skipcond bỏ qua Jump: 7) + 3 lệnh cuối
    assert.equal(r.trace.length, 2 + 4 * 8 + 7 + 3);
  });
  it('multiply → 20, max → 9, io → 42', () => {
    assert.deepEqual(exec(EXAMPLES.mul.src).snaps.at(-1)!.output, [20]);
    assert.deepEqual(exec(EXAMPLES.max.src).snaps.at(-1)!.output, [9]);
    assert.deepEqual(exec(EXAMPLES.io.src, [12, 30]).snaps.at(-1)!.output, [42]);
  });
  it('io without input waits', () => {
    assert.equal(exec(EXAMPLES.io.src, [5]).stop, 'input');
  });
  it('16-bit overflow wraps like hardware', () => {
    const r = exec(EXAMPLES.io.src, [30000, 30000]);
    assert.equal(s16(r.snaps.at(-1)!.output[0]), 60000 - 65536);
  });
  it('self-modifying program: instruction read as data, then rewritten', () => {
    const p = assemble(EXAMPLES.selfmod.src);
    const r = run(p);
    const out = r.snaps.at(-1)!.output;
    assert.equal(out[0], p.mem[p.symbols.PATCH]); // in ra chính từ lệnh
    assert.equal(out[0] >> 12, 1); // mã lệnh Load
    assert.equal(out[1], 20);
    assert.equal(r.mems.at(-1)![p.symbols.PATCH], p.mem[p.symbols.PATCH] + 1);
  });
  it('fetch is always MAR←PC, IR←M[MAR], PC←PC+1', () => {
    const r = exec(EXAMPLES.add.src);
    assert.deepEqual(r.snaps.slice(1, 4).map((s) => s.rtn), ['MAR ← PC', 'IR ← M[MAR]', 'PC ← PC + 1']);
    assert.equal(r.snaps[4].phase, 'decode');
  });
  it('skipcond conditions', () => {
    const t = (ac: number, code: string) => {
      const r = exec(`Load V\nSkipcond ${code}\nJump No\nLoad Yes\nOutput\nHalt\nNo, Halt\nV, DEC ${ac}\nYes, DEC 1`);
      return r.snaps.at(-1)!.output.length === 1;
    };
    assert.equal(t(-3, '000'), true); assert.equal(t(3, '000'), false);
    assert.equal(t(0, '400'), true); assert.equal(t(1, '400'), false);
    assert.equal(t(2, '800'), true); assert.equal(t(0, '800'), false);
  });
  it('JnS / JumpI subroutine call and return', () => {
    const r = exec('JnS Sub\nLoad R\nOutput\nHalt\nSub, HEX 0\nLoad K\nStore R\nJumpI Sub\nK, DEC 77\nR, DEC 0');
    assert.deepEqual(r.snaps.at(-1)!.output, [77]);
  });
  it('endless loop stops at the limit; illegal opcode stops', () => {
    assert.equal(run(assemble('L, Jump L'), [], 50).stop, 'limit');
    assert.equal(run(assemble('HEX F000')).stop, 'illegal');
  });
  it('instruction index keeps one snapshot per instruction', () => {
    const r = exec(EXAMPLES.add.src);
    assert.equal(instrIndex(r.snaps).length, r.trace.length + 1);
  });
});

describe('cache against textbook traces', () => {
  const tb = CACHE_PRESETS.textbook;
  const misses = (cfg: CacheCfg, addrs: number[]) => simulate(addrs, cfg).at(-1)!.misses;
  it('P&H 0,8,0,6,8: direct 5 misses, 2-way LRU 4, fully assoc 3', () => {
    assert.equal(misses({ ...tb.cfg, ways: 1 }, tb.addrs), 5);
    assert.equal(misses({ ...tb.cfg, ways: 2 }, tb.addrs), 4);
    assert.equal(misses({ ...tb.cfg, ways: 4 }, tb.addrs), 3);
  });
  it('address split tag|index|offset', () => {
    const cfg: CacheCfg = { addrBits: 16, blockSize: 16, lines: 8, ways: 1, policy: 'lru' };
    const s = split(0x1234, cfg);
    assert.equal(s.offsetBits, 4); assert.equal(s.indexBits, 3); assert.equal(s.tagBits, 9);
    assert.equal(s.offset, 0x4); assert.equal(s.index, (0x1234 >> 4) & 7); assert.equal(s.tag, 0x1234 >> 7);
  });
  it('Stallings-style: 24-bit address, 4-byte blocks, 16K lines direct → tag 8, line 14, word 2', () => {
    const cfg: CacheCfg = { addrBits: 24, blockSize: 4, lines: 16384, ways: 1, policy: 'lru' };
    const s = split(0x16339c, cfg);
    assert.equal(s.tagBits, 8); assert.equal(s.indexBits, 14); assert.equal(s.offsetBits, 2);
    assert.equal(s.tag, 0x16); assert.equal(s.index, 0x0ce7); assert.equal(s.offset, 0);
  });
  it('presets behave as their notes say', () => {
    const seq = simulate(CACHE_PRESETS.sequential.addrs, CACHE_PRESETS.sequential.cfg).at(-1)!;
    assert.equal(seq.hits / (seq.hits + seq.misses), 0.75);
    const con = CACHE_PRESETS.conflict;
    assert.equal(simulate(con.addrs, con.cfg).at(-1)!.hits, 0);
    assert.equal(simulate(con.addrs, { ...con.cfg, ways: 2 }).at(-1)!.hits, 12);
    const mx = CACHE_PRESETS.matrix;
    assert.equal(simulate(mx.addrs, mx.cfg).at(-1)!.hits, 0);
    const rowOrder = Array.from({ length: 16 }, (_, k) => 0x400 + 4 * k);
    assert.equal(simulate(rowOrder, mx.cfg).at(-1)!.hits, 12);
    const lp = simulate(CACHE_PRESETS.loop.addrs, CACHE_PRESETS.loop.cfg).at(-1)!;
    assert.equal(lp.misses, 4);
  });
  it('FIFO vs LRU differ on 1,2,1,3,1 with 2 lines fully associative', () => {
    const cfg: CacheCfg = { addrBits: 8, blockSize: 1, lines: 2, ways: 2, policy: 'lru' };
    const tr = [1, 2, 1, 3, 1];
    assert.equal(misses(cfg, tr), 3);
    assert.equal(misses({ ...cfg, policy: 'fifo' }, tr), 4);
  });
  it('AMAT', () => {
    assert.equal(amat(9, 1, 1, 100), 11);
  });
});
