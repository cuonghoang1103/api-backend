/**
 * Mọi dòng "capture thật" của mô phỏng 14.4 (vpn) phải còn NGUYÊN VĂN trong output của lab — chạy lại lab mà chữ đổi thì test đỏ, sửa
 * capture144.ts.   npx tsx --test frontend/src/components/net-lab/engine/capture144.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import fs from 'node:fs';
import { ALL144 } from './capture144';
import { killScript, routeScript, schoolScript } from './vpn';

const OUT = new URL('../../../../../content/courses/networking-for-developers/lab/out/', import.meta.url);
const lines = (f: string) => fs.readFileSync(new URL(`${f}.out.txt`, OUT), 'utf8').replace(/\r$/gm, '').split('\n');

describe('capture144 — quoted from the real lab output', () => {
  it('every quoted line exists verbatim in its output file', () => {
    const miss = ALL144.filter(([f, t]) => !lines(f).includes(t)).map(([f, t]) => `${f}: ${JSON.stringify(t)}`);
    assert.deepEqual(miss, []);
  });
});

describe('vpn engine — matches what the lab measured', () => {
  it('split: the site sees the ISP; full: the VPS', () => {
    assert.equal(routeScript('split').at(-1)!.ip, '198.18.0.40');
    assert.equal(routeScript('full').at(-1)!.ip, '198.18.0.30');
  });
  it('school: WireGuard dies on dropped UDP; OpenVPN 443 works; school DNS leaks, VPN DNS does not', () => {
    assert.equal(schoolScript('wg', 'vpn').at(-1)!.tone, 'bad');
    assert.ok(schoolScript('ovpn', 'school').some((s) => s.leak));
    assert.ok(!schoolScript('ovpn', 'vpn').some((s) => s.leak));
    assert.ok(schoolScript('mesh', 'vpn').every((s) => s.term.every((l) => !l.real)), 'mesh is not measured ⇒ every line computed');
  });
  it('kill: OpenVPN leaks with the school IP; wg-quick holds the packets', () => {
    assert.equal(killScript('ovpn').at(-1)!.ip, '198.18.0.1');
    assert.equal(killScript('wg').at(-1)!.tone, 'ok');
  });
});
