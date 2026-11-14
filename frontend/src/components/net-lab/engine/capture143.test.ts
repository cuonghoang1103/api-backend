/**
 * Mọi dòng "capture thật" của mô phỏng 14.3 (tunnel) phải còn NGUYÊN VĂN trong output của lab — chạy lại lab mà chữ đổi thì test đỏ,
 * sửa capture143.ts cho khớp.   npx tsx --test frontend/src/components/net-lab/engine/capture143.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import fs from 'node:fs';
import { ALL143 } from './capture143';
import { chosenPort, forwardScript, portScript, socksScript } from './tunnel';

const OUT = new URL('../../../../../content/courses/networking-for-developers/lab/out/', import.meta.url);
const lines = (f: string) => fs.readFileSync(new URL(`${f}.out.txt`, OUT), 'utf8').replace(/\r$/gm, '').split('\n');

describe('capture143 — quoted from the real lab output', () => {
  it('every quoted line exists verbatim in its output file', () => {
    const miss = ALL143.filter(([f, t]) => !lines(f).includes(t)).map(([f, t]) => `${f}: ${t}`);
    assert.deepEqual(miss, []);
  });
});

describe('tunnel engine — matches what the lab measured', () => {
  it('first value wins: Match after Host ⇒ 22 even at school; Match first ⇒ 993 at school, 22 at home', () => {
    assert.equal(chosenPort('school', 'last'), 22);
    assert.equal(chosenPort('school', 'first'), 993);
    assert.equal(chosenPort('home', 'first'), 22);
  });
  it('port 22 at school dies with the real timeout line; 993 logs in', () => {
    const bad = portScript('school', 'last');
    assert.equal(bad.at(-1)!.tone, 'bad');
    assert.ok(bad.at(-1)!.term.some((l) => l.real && l.t.includes('port 22: Connection timed out')));
    const ok = portScript('school', 'first');
    assert.ok(ok.at(-1)!.term.some((l) => l.real && l.t === 'vao duoc vps qua cong 993'));
  });
  it('-R on loopback is refused for the friend; -R 0.0.0.0 serves the demo; -L gets PONG', () => {
    assert.equal(forwardScript('R').at(-1)!.tone, 'bad');
    assert.ok(forwardScript('R0').at(-1)!.term.some((l) => l.real && l.t.startsWith('Do an nhom 3')));
    assert.ok(forwardScript('L').at(-1)!.term.some((l) => l.real && l.t === 'PONG'));
  });
  it('socks: direct is reset, socks5 leaks DNS, socks5h passes, the open SOCKS lets a stranger out of your VPS', () => {
    assert.equal(socksScript('direct').at(-1)!.tone, 'bad');
    assert.ok(socksScript('socks5').at(-1)!.term.some((l) => l.real && l.t.includes('(97)')));
    assert.equal(socksScript('socks5h').at(-1)!.tone, 'ok');
    assert.ok(socksScript('stranger').at(-1)!.term.some((l) => l.real && l.t.includes('198.18.0.30')));
  });
});
