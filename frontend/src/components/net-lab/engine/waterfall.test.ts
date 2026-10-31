/**
 * waterfall: curl -w là CỘNG DỒN; thời lượng từng chặng = hiệu hai mốc.
 *   cd frontend && npx tsx --test src/components/net-lab/engine/waterfall.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CURL } from './capture';
import { model, phasesFromCurl, slowStartRounds, total } from './waterfall';

const d = (w: Parameters<typeof phasesFromCurl>[0]) => phasesFromCurl(w).map((p) => p.dur);

describe('real curl -w numbers → phase durations', () => {
  it('cold run 1: DNS 3.73, TCP 36.16, TLS 16.65, wait 21.91, download 53.45 ms', () => {
    assert.deepEqual(d(CURL.cold[0]), [3.73, 36.16, 16.65, 21.91, 53.45]);
    assert.equal(total(phasesFromCurl(CURL.cold[0])), 131.9);
  });
  it('reused connection: connect = tls = 0 ⇒ 0-length phases, wait measured from DNS', () => {
    assert.deepEqual(d(CURL.warm), [0.02, 0, 0, 26.55, 51.11]);
  });
  it('far site: TCP 123 ms dominates', () => assert.equal(d(CURL.far)[1], 122.99));
});

describe('computed model', () => {
  it('cold at RTT 6 ms vs 150 ms (TLS 1.3, server 15 ms, 60 KB page)', () => {
    const c = { resolverRtt: 16, dnsCached: false, reuse: false, tls12: false, serverMs: 15, pageKB: 60 };
    assert.equal(slowStartRounds(60 * 1024), 3);
    assert.equal(total(model({ ...c, rtt: 6 })), 16 + 6 + 6 + 21 + 12);
    assert.equal(total(model({ ...c, rtt: 150 })), 16 + 150 + 150 + 165 + 300);
    assert.equal(total(model({ ...c, rtt: 150, reuse: true })), 165 + 300);
  });
});
