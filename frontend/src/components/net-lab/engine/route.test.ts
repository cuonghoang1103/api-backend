/**
 * route: LPM + `ip route get` khớp output thật (c22-*), walk() tái tạo TTL của tshark (c22-trace) và vòng lặp (c22-vong).
 *   cd frontend && npx tsx --test src/components/net-lab/engine/route.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ROUTE_GET, TRACE_TSHARK, VONG_PING, VONG_TRACE } from './capture2';
import { SERVER, loopScript, lookup, realGet, replyTtl, traceScript, walk, type RouterId } from './route';

describe('longest-prefix match = ip route get', () => {
  for (const [k, line] of Object.entries(ROUTE_GET)) {
    it(k, () => {
      const [r, dst] = k.split('|');
      const forgotten = r.endsWith('+32');
      const router = r.replace('+32', '') as RouterId;
      assert.equal(lookup(router, dst, forgotten).get, line);
      assert.equal(realGet(router, dst, forgotten), line);
    });
  }
  it('dc: with the forgotten /32 BOTH lines match and the /32 wins over the /24', () => {
    const L = lookup('dc', SERVER, true);
    assert.deepEqual(L.checks.filter((c) => c.match).map((c) => c.route.len).sort((a, b) => a - b), [24, 32]);
    assert.equal(L.winner!.len, 32);
  });
  it('isp has no default route: 8.8.8.8 matches nothing', () => assert.equal(lookup('isp', '8.8.8.8').checks.filter((c) => c.match).length, 0));
  it('laptop: 203.0.113.10 only matches the default route /0', () => assert.equal(lookup('laptop', SERVER).winner!.len, 0));
});

describe('walk the real tables', () => {
  it('probes with TTL 1, 2, 3 die at homegw, isp, dc; TTL 4 reaches the server with TTL 61', () => {
    assert.equal(walk(SERVER, 1).at, 'homegw');
    assert.equal(walk(SERVER, 2).at, 'isp');
    assert.equal(walk(SERVER, 3).at, 'dc');
    const w = walk(SERVER, 4);
    assert.equal(w.outcome, 'delivered');
    assert.equal(w.hops.at(-1)!.ttlIn, 1);
    assert.equal(walk(SERVER, 64).hops.at(-1)!.ttlIn, 61);
  });
  it('reply TTLs 64/63/62/61 = tshark', () => {
    const ttls = TRACE_TSHARK.filter((_, i) => i % 2 === 1).map((l) => Number(l.split('\t')[2]));
    assert.deepEqual(ttls, [1, 2, 3, 4].map(replyTtl));
    assert.deepEqual(TRACE_TSHARK.filter((_, i) => i % 2 === 0).map((l) => Number(l.split('\t')[2])), [1, 2, 3, 4]);
  });
  it('forgotten /32 ⇒ TTL runs out at isp (real: From 198.51.100.1 Time to live exceeded), hops alternate', () => {
    const w = walk(SERVER, 64, true);
    assert.equal(w.outcome, 'expired'); assert.equal(w.at, 'isp'); assert.equal(w.replyFrom, '198.51.100.1');
    assert.match(VONG_PING[1], /^From 198\.51\.100\.1 .*Time to live exceeded/);
    const seq = [3, 4, 5, 6, 7, 8, 9].map((k) => walk(SERVER, k, true).replyFrom);
    assert.deepEqual(seq, VONG_TRACE.slice(3).map((l) => l.trim().split(/\s+/)[1]));
  });
  it('scripts', () => {
    assert.equal(traceScript(false).filter((s) => s.phase === 'reply').length, 3);
    assert.equal(traceScript(true).filter((s) => s.phase === 'star').length, 1);
    assert.equal(loopScript(true).at(-1)!.phase, 'ok');
  });
});
