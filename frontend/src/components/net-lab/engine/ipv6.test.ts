/**
 * ipv6: viết gọn khớp ipaddress của Python (c24-dia-chi), EUI-64 khớp `ip -6 addr`, solicited-node khớp tcpdump (c24-ndp).
 *   cd frontend && npx tsx --test src/components/net-lab/engine/ipv6.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { V6_ADDR, V6_HAPPY, V6_NDP } from './capture2';
import { HE, bestRun, compress, compressView, count6, eui64, happyScript, parse6, solicitedNode, synGiveUpS } from './ipv6';

describe('compression (RFC 5952) = Python ipaddress', () => {
  it('2001:0db8:000a:0050:0000:0000:0000:0010 ⇄ 2001:db8:a:50::10', () => {
    const [full, short] = V6_ADDR[1].split(' -> ');
    assert.equal(compressView(full)!.result, short);
    assert.equal(compressView(short)!.full, full);
  });
  it('two equal zero runs ⇒ :: goes to the FIRST', () => {
    const v = compressView('2001:0db8:0000:0000:0001:0000:0000:0001')!;
    assert.equal(v.result, V6_ADDR[2]);
    assert.deepEqual(v.runs, [{ start: 2, len: 2 }, { start: 5, len: 2 }]);
    assert.deepEqual(v.best, { start: 2, len: 2 });
  });
  it('a single 0 group is never ::, invalid input is rejected', () => {
    assert.equal(compress(parse6('2001:db8:0:1:1:1:1:1')!), '2001:db8:0:1:1:1:1:1');
    assert.equal(bestRun(parse6('2001:db8:0:1:1:1:1:1')!), undefined);
    for (const bad of ['2001::db8::1', '2001:db8', '12345::', 'g::1']) assert.equal(parse6(bad), null, bad);
  });
  it('/64 holds 18446744073709551616 addresses', () => assert.equal(count6(64), V6_ADDR[3].split(' ')[2]));
});

describe('link-local + NDP', () => {
  it('EUI-64: 02:00:c0:a8:32:0a ⇒ fe80::c0ff:fea8:320a (real ip -6 addr)', () => {
    const e = eui64('02:00:c0:a8:32:0a');
    assert.equal(e.flipped, '00:00:c0:a8:32:0a');
    assert.equal(e.withFffe, '00:00:c0:ff:fe:a8:32:0a');
    assert.equal(e.linkLocal, 'fe80::c0ff:fea8:320a');
    assert.match(V6_ADDR[0], /fe80::c0ff:fea8:320a\/64/);
  });
  it('neighbour solicitation goes to ff02::1:ff00:11 (real tcpdump)', () => {
    assert.equal(solicitedNode('2001:db8:a:50::11'), 'ff02::1:ff00:11');
    assert.match(V6_NDP[0], /> ff02::1:ff00:11: ICMP6, neighbor solicitation/);
  });
});

describe('Happy Eyeballs numbers', () => {
  it('real timings are the captured ones; kernel SYN give-up ≈ 127 s (computed)', () => {
    assert.match(V6_HAPPY[3], new RegExp(`after ${(HE.curlConnect / 1000).toFixed(6)} s`));
    assert.match(V6_HAPPY[5], new RegExp(`after ${HE.nodeTotal} ms`));
    assert.match(V6_HAPPY[6], new RegExp(`after ${HE.noAuto} ms`));
    assert.match(V6_HAPPY[4], new RegExp(`after ${HE.curl6} milliseconds`));
    assert.equal(synGiveUpS(), 127);
  });
  it('broken ⇒ ends connected via IPv4; working ⇒ IPv6', () => {
    const b = happyScript(true);
    assert.equal(b.at(-1)!.family, '4'); assert.ok(b.at(-1)!.connected);
    assert.equal(happyScript(false).at(-1)!.family, '6');
  });
});
