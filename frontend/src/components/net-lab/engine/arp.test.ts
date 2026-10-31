/**
 * arp: kịch bản bám đúng dòng tcpdump thật; trạng thái NUD theo giá trị mặc định của nhân.
 *   cd frontend && npx tsx --test src/components/net-lab/engine/arp.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ARP_LINES, MAC } from './capture';
import { BCAST, NEW_MAC, gatewayScript, lanScript, staleScript } from './arp';

const usTs = (l: string) => Number(l.slice(9, 15));

describe('lan', () => {
  const S = lanScript();
  it('uses the real lines 0..4 in order and ends with both caches filled', () => {
    assert.deepEqual([...new Set(S.flatMap((s) => s.lines))], [0, 1, 2, 3, 4]);
    const end = S.at(-1)!;
    assert.equal(end.hosts.find((h) => h.id === 'client')!.cache[0].mac, MAC.client2);
    assert.equal(end.hosts.find((h) => h.id === 'client')!.cache[0].state, 'REACHABLE');
    assert.deepEqual(end.fdb.map((x) => [x.mac, x.port]), [[MAC.client, 1], [MAC.client2, 2]]);
  });
  it('request is broadcast and flooded; reply and ping are unicast to one port', () => {
    const req = S.find((s) => s.frame?.kind === 'arp-req')!;
    assert.equal(req.frame!.dstMac, BCAST); assert.deepEqual(req.frame!.to, [2, 3]);
    assert.deepEqual(S.find((s) => s.frame?.kind === 'arp-rep')!.frame!.to, [1]);
    assert.deepEqual(S.find((s) => s.frame?.kind === 'icmp')!.frame!.to, [2]);
  });
  it('68 µs from the first request to the ping reply (real timestamps)', () => assert.equal(usTs(ARP_LINES[4]) - usTs(ARP_LINES[0]), 68));
  it('the doubled request line is marked as the bridge echo', () => assert.deepEqual(S.find((s) => s.echoLines)!.echoLines, [1]));
});

describe('gateway', () => {
  const S = gatewayScript();
  it('ARPs for the router, never for 10.10.2.10', () => {
    for (const k of S.flatMap((s) => s.lines)) if (/who-has/.test(ARP_LINES[k])) assert.doesNotMatch(ARP_LINES[k], /who-has 10\.10\.2\.10/);
    const icmp = S.find((s) => s.frame?.kind === 'icmp')!.frame!;
    assert.equal(icmp.dstMac, MAC.routerLan); assert.equal(icmp.ipDst, '10.10.2.10');
    assert.match(ARP_LINES[8], /02:00:0a:0a:01:0a > 02:00:0a:0a:01:fe.*10\.10\.1\.10 > 10\.10\.2\.10/);
  });
  it('the router later checks the client with a UNICAST request (real line 10)', () => {
    assert.match(ARP_LINES[10], /^\S+ 02:00:0a:0a:01:fe > 02:00:0a:0a:01:0a, .*who-has 10\.10\.1\.10/);
    assert.equal(S.find((s) => s.frame?.kind === 'probe')!.frame!.dstMac, MAC.client);
  });
});

describe('stale (kernel defaults, computed)', () => {
  it('without gratuitous ARP: REACHABLE → STALE → DELAY → PROBE×3 → FAILED → INCOMPLETE → REACHABLE(new MAC)', () => {
    const states = staleScript(false).map((s) => s.hosts.find((h) => h.id === 'client')!.cache[0].state);
    const dedup = states.filter((x, i) => x !== states[i - 1]);
    assert.deepEqual(dedup, ['REACHABLE', 'STALE', 'DELAY', 'PROBE', 'FAILED', 'INCOMPLETE', 'REACHABLE']);
    const S = staleScript(false);
    assert.equal(S.filter((s) => s.frame?.kind === 'probe').length, 3);
    assert.deepEqual(S.filter((s) => s.frame?.kind === 'probe').map((s) => s.t), [45, 46, 47]);
    assert.equal(S.at(-1)!.hosts.find((h) => h.id === 'client')!.cache[0].mac, NEW_MAC);
  });
  it('with gratuitous ARP: the entry switches to the new MAC at once, no ping is lost', () => {
    const S = staleScript(true);
    assert.ok(S.some((s) => s.frame?.kind === 'garp'));
    assert.ok(!S.some((s) => s.tone === 'bad'));
    assert.equal(S.at(-1)!.hosts.find((h) => h.id === 'client')!.cache[0].state, 'REACHABLE');
  });
});
