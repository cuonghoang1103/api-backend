/**
 * subnet: phép tính khớp TỪNG KÝ TỰ với cidr.py / chia.py thật (c21-dia-chi, c21-chia), quyết định cùng mạng khớp c21-sai-mask.
 *   cd frontend && npx tsx --test src/components/net-lab/engine/subnet.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CHIA_FAIL, CHIA_GIVEN, CHIA_SORTED, CIDR_RUNS, MASK16, MASK24 } from './capture2';
import { DEFAULT_NEEDS, GIVEN_ORDER, cidr, cidrLines, gapTotal, intToIp, onLink, vlsm, vlsmLines } from './subnet';

describe('cidr = cidr.py', () => {
  for (const [k, lines] of Object.entries(CIDR_RUNS)) {
    it(k, () => { const [a, p] = k.split('/'); assert.deepEqual(cidrLines(a, Number(p)), [...lines]); });
  }
  it('192.168.50.77/26 → .64, broadcast .127, 62 usable; /31 = 2 and /32 = 1 without broadcast', () => {
    const c = cidr('192.168.50.77', 26);
    assert.equal(intToIp(c.net), '192.168.50.64'); assert.equal(intToIp(c.bcast!), '192.168.50.127'); assert.equal(c.usable, 62);
    assert.equal(cidr('192.0.2.0', 31).usable, 2); assert.equal(cidr('192.0.2.0', 31).bcast, null);
    assert.equal(cidr('203.0.113.10', 32).usable, 1);
    assert.equal(cidr('10.0.0.1', 8).usable, 16777214);
  });
});

describe('same network?', () => {
  it('/24: 10.10.2.10 is NOT on-link ⇒ default gateway (real: via 10.10.1.254)', () => {
    assert.equal(onLink('10.10.1.11', 24, '10.10.2.10').onLink, false);
    assert.match(MASK24.get[0], /via 10\.10\.1\.254/);
  });
  it('/16 (typo): 10.10.2.10 looks on-link ⇒ ARP for it directly (real: who-has 10.10.2.10, FAILED)', () => {
    assert.equal(onLink('10.10.1.11', 16, '10.10.2.10').onLink, true);
    assert.doesNotMatch(MASK16.get[0], /via/);
    assert.ok(MASK16.arp.filter((l) => /who-has 10\.10\.2\.10/.test(l)).length === 6);
    assert.match(MASK16.neigh[0], /FAILED/);
  });
});

describe('vlsm = chia.py', () => {
  it('largest first', () => {
    const p = vlsm('10.20.0.0/22', DEFAULT_NEEDS, true);
    assert.deepEqual(vlsmLines(p), CHIA_SORTED.slice(1));
    assert.equal(gapTotal(p), 0);
  });
  it('as given ⇒ a 336-address gap', () => {
    const needs = GIVEN_ORDER.map((n) => DEFAULT_NEEDS.find((d) => d.name === n)!);
    const p = vlsm('10.20.0.0/22', needs, false);
    assert.deepEqual(vlsmLines(p), CHIA_GIVEN.slice(1));
    assert.equal(gapTotal(p), 336);
  });
  it('does not fit in a /24', () => assert.deepEqual(vlsmLines(vlsm('10.20.0.0/24', [{ name: 'iot', hosts: 300 }], true)), CHIA_FAIL.slice(1)));
});
