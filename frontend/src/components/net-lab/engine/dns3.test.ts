/**
 * dns3: logic của 5 mô phỏng Chương 3 phải khớp output thật của lab DNS (capture3.ts).
 *   cd frontend && npx tsx --test src/components/net-lab/engine/dns3.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ANY_DC, ANY_GEO, ANY_GEO_DC, ANY_GEO_SAI, ANY_HOME, ANY_THEO, DNS_NDOTS, DNS_TRACE, SEC_HONG, SEC_SUA2, TTL_NEG1, TTL_THEO, ZONE_APEX, ZONE_CHUNG, ZONE_DOT, ZONE_MXIP } from './capture3';
import {
  EDGE, RESOLVER_SOURCE, anycastSite, checkZone, fqdn, geoView, isAuthoritative, isReferral, negativeTtl, parseGoi, remainingTtl,
  resolverStatus, searchOrder, secondaryTransfers, staleAfterChange, stubTries, upstreamQueries, validate, worstCaseDelay, type Rec,
} from './dns3';

const sec = (hms: string) => { const [h, m, s] = hms.split(':').map(Number); return h * 3600 + m * 60 + s; };

describe('dns — the resolver capture', () => {
  const g = DNS_TRACE.slice(1).map((l) => parseGoi(l)!);
  it('parses every line', () => assert.ok(g.every(Boolean)));
  it('one question from the laptop ⇒ 9 questions to the Internet; the second one ⇒ none', () => {
    const second = g.findIndex((x, k) => k > 0 && x.from === '198.51.100.2');
    assert.equal(upstreamQueries(g.slice(0, second)), 9);
    assert.equal(upstreamQueries(g.slice(second)), 0);
  });
  it('root and TLD give referrals, LabFlow answers with aa', () => {
    assert.equal(g.filter(isReferral).length, 2);
    assert.ok(g.filter(isAuthoritative).some((x) => x.name === 'www.labflow.test'));
    assert.ok(g.some((x) => x.to === '192.0.2.10' && x.name === 'test'), 'QNAME minimisation: the root only saw "test"');
  });
  it('search + ndots:5 tries the search domain first — same order as on the wire', () => {
    const exists = (n: string) => n === 'api.labflow.test' || n === 'labflow.cdn.test';
    const tried = [
      ...stubTries('api', ['labflow.test'], 5, exists),
      ...stubTries('labflow.cdn.test', ['labflow.test'], 5, exists),
      ...stubTries('labflow.cdn.test.', ['labflow.test'], 5, exists),
    ];
    assert.deepEqual(tried, DNS_NDOTS.map((l) => l.trim().split(/\s+/).pop()));
    assert.deepEqual(searchOrder('db.internal', ['a', 'b'], 1), ['db.internal', 'db.internal.a', 'db.internal.b']);
  });
});

describe('zone', () => {
  const base: Rec[] = [
    { name: '@', type: 'SOA', data: 'ns1 hostmaster 1 3600 600 1209600 300' }, { name: '@', type: 'NS', data: 'ns1' },
    { name: '@', type: 'A', data: '203.0.113.10' }, { name: 'api', type: 'A', data: '203.0.113.10' },
    { name: '@', type: 'MX', data: '10 mail' }, { name: 'mail', type: 'A', data: '203.0.113.25' },
  ];
  it('relative and absolute names', () => {
    assert.equal(fqdn('www', 'labflow.test'), 'www.labflow.test.');
    assert.equal(fqdn('labflow.cdn.test.', 'labflow.test'), 'labflow.cdn.test.');
    assert.equal(fqdn('@', 'labflow.test.'), 'labflow.test.');
  });
  it('the four classic mistakes give the same verdicts as named-checkzone', () => {
    assert.deepEqual(checkZone(base, 'labflow.test'), { errors: [], warnings: [] });
    const apex = checkZone([...base.filter((r) => !(r.name === '@' && r.type === 'A')), { name: '@', type: 'CNAME', data: 'labflow.cdn.test.' }], 'labflow.test');
    assert.ok(apex.errors[0].endsWith('CNAME and other data') && ZONE_APEX.some((l) => l.endsWith('labflow.test: CNAME and other data')));
    const chung = checkZone([...base, { name: 'api', type: 'CNAME', data: 'labflow.test.' }], 'labflow.test');
    assert.ok(ZONE_CHUNG.some((l) => l.includes(chung.errors[0].replace(/\.: /, ': '))));
    const mxip = checkZone([...base.filter((r) => r.type !== 'MX'), { name: '@', type: 'MX', data: '10 203.0.113.25.' }], 'labflow.test');
    assert.ok(ZONE_MXIP.some((l) => l.includes(mxip.warnings[0])));
    const dot = checkZone([...base.filter((r) => r.type !== 'MX'), { name: '@', type: 'MX', data: '10 mail.labflow.test' }], 'labflow.test');
    assert.ok(ZONE_DOT.some((l) => l.includes(dot.warnings[0])), dot.warnings[0]);
  });
  it('a secondary copies only when the serial grows', () => {
    assert.equal(secondaryTransfers(2026110101, 2026110101), false);
    assert.equal(secondaryTransfers(2026110102, 2026110101), true);
  });
});

describe('ttl', () => {
  it('negative TTL = min(SOA TTL, minimum) — the 300 in the real NXDOMAIN answer', () => {
    assert.equal(negativeTtl(3600, 300), 300);
    assert.ok(/\t300\tIN\tSOA\t.* 300$/.test(TTL_NEG1.find((l) => l.includes('SOA'))!));
  });
  it('the wrong-order move: computed stale time matches the real timeline', () => {
    const t0 = sec(TTL_THEO[0].slice(0, 8)), change = sec('16:11:02');
    const firstNew = TTL_THEO.find((l) => l.endsWith('203.0.113.11'))!;
    const stale = staleAfterChange(t0, 120, change);
    assert.equal(stale, 104);
    assert.ok(sec(firstNew.slice(0, 8)) - change >= stale, 'the laptop saw .11 only after the old copy expired');
    assert.equal(worstCaseDelay(120, 0, 130, 10), 10, 'right order: change after the old TTL ⇒ only the new TTL');
    assert.equal(remainingTtl(120, t0, t0 + 15), 105);
  });
});

describe('anycast and GeoDNS', () => {
  it('home reaches pop1, the datacenter reaches pop2; withdrawing pop1 moves home to pop2', () => {
    assert.equal(anycastSite('home', { pop1: true, pop2: true }), 'pop1');
    assert.ok(ANY_HOME[0].includes('pop1.hn'));
    assert.equal(anycastSite('dc', { pop1: true, pop2: true }), 'pop2');
    assert.ok(ANY_DC[0].includes('pop2.sg'));
    assert.equal(anycastSite('home', { pop1: false, pop2: true }), 'pop2');
    assert.ok(ANY_THEO.at(-1)!.includes('pop2.sg') && ANY_THEO[0].includes('pop1.hn'));
  });
  it('GeoDNS chooses by the resolver’s address', () => {
    assert.equal(EDGE[geoView(RESOLVER_SOURCE.isp)], '203.0.113.10');
    assert.ok(ANY_GEO.includes('203.0.113.10'));
    assert.equal(EDGE[geoView(RESOLVER_SOURCE.pop2)], '203.0.113.11');
    assert.ok(ANY_GEO_DC.includes('203.0.113.11') && ANY_GEO_SAI.includes('203.0.113.11'));
  });
});

describe('dnssec', () => {
  it('bogus ⇒ SERVFAIL unless +cd; insecure and secure answer', () => {
    const exp = validate({ hasDs: true, dsMatches: true, sigValid: false });
    assert.equal(exp, 'bogus');
    assert.equal(resolverStatus(exp, false), 'SERVFAIL');
    assert.ok(SEC_HONG[0].includes('status: SERVFAIL') && SEC_HONG.some((l) => l.includes('EDE: 7')));
    assert.equal(resolverStatus(exp, true), 'NOERROR');
    assert.equal(validate({ hasDs: false, dsMatches: false, sigValid: false }), 'insecure');
    assert.equal(validate({ hasDs: true, dsMatches: true, sigValid: true }), 'secure');
    assert.ok(SEC_SUA2[0].includes('status: NOERROR'));
  });
});
