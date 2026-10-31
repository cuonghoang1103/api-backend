/**
 * bgp: bảng do engine lan truyền khớp `show ip bgp` THẬT ở mọi ảnh chụp (c25-isp, c25-dc, c25-isp-cuop, c25-isp-loc,
 * c25-isp-rut, c25-rogue-cuop); tiền tố dài nhất đưa 203.0.113.10 vào hố đen; RPKI khớp RIPEstat (c25-that).
 *   cd frontend && npx tsx --test src/components/net-lab/engine/bgp.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { BGP_SHOW, HIJACK_FIB, RIPE } from './capture2';
import { BASE, HIJACK, ROA_CT, converge, nextHopFor, pathText, rpki, sameAsCapture } from './bgp';

describe('propagation = show ip bgp', () => {
  const base = converge({ anns: BASE, filter: false });
  it('isp (c25-isp)', () => assert.ok(sameAsCapture(base.isp, BGP_SHOW.isp)));
  it('dc (c25-dc): 198.18.0.0/24 has path “64500 64511”, origin 64511, next hop 192.0.2.66', () => {
    assert.ok(sameAsCapture(base.dc, BGP_SHOW.dc));
    const r = base.dc.find((x) => x.network === '198.18.0.0/24')!;
    assert.equal(pathText(r), '64500 64511 i'); assert.equal(r.origin, 64511); assert.equal(r.nextHop, '192.0.2.66');
    assert.equal(r.metric, ''); assert.equal(base.dc.find((x) => x.network === '198.51.100.0/24')!.metric, '0');
  });
  const hj = converge({ anns: [...BASE, HIJACK], filter: false });
  it('hijack: isp (c25-isp-cuop) and rogue (c25-rogue-cuop) tables', () => {
    assert.ok(sameAsCapture(hj.isp, BGP_SHOW.ispHijack));
    assert.ok(sameAsCapture(hj.rogue, BGP_SHOW.rogueHijack));
  });
  it('hijack: 203.0.113.10 now goes via 192.0.2.66 (the /25 wins), filter brings back 192.0.2.3', () => {
    assert.equal(nextHopFor(hj.isp, 'isp', '203.0.113.10'), '192.0.2.66');
    assert.match(HIJACK_FIB[2], /via 192\.0\.2\.66/);
    assert.equal(nextHopFor(hj.isp, 'isp', '203.0.113.200'), '192.0.2.3', 'upper half of the /24 is untouched');
    const fx = converge({ anns: [...BASE, HIJACK], filter: true });
    assert.ok(sameAsCapture(fx.isp, BGP_SHOW.ispFiltered));
    assert.equal(nextHopFor(fx.isp, 'isp', '203.0.113.10'), '192.0.2.3');
  });
  it('withdraw: isp forgets 203.0.113.0/24 (c25-isp-rut) ⇒ no route to .10 nor the name server .53', () => {
    const w = converge({ anns: BASE.filter((a) => a.as !== 'dc'), filter: false });
    assert.ok(sameAsCapture(w.isp, BGP_SHOW.ispWithdrawn));
    assert.equal(nextHopFor(w.isp, 'isp', '203.0.113.10'), null);
    assert.equal(nextHopFor(w.isp, 'isp', '203.0.113.53'), null);
  });
});

describe('RPKI = RIPEstat', () => {
  const st = (l: string) => l.split(': ')[1];
  it('AS152992 /23 valid, AS64511 /23 invalid_asn, AS152992 /25 invalid_length', () => {
    assert.equal(rpki([ROA_CT], 152992, '160.187.0.0/23'), st(RIPE[2]));
    assert.equal(rpki([ROA_CT], 64511, '160.187.0.0/23'), st(RIPE[4]));
    assert.equal(rpki([ROA_CT], 152992, '160.187.1.0/25'), st(RIPE[5]));
    assert.equal(rpki([ROA_CT], 152992, '160.187.1.0/24'), 'valid');
    assert.equal(rpki([ROA_CT], 152992, '8.8.8.0/24'), 'unknown');
  });
});
