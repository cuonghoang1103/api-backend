/**
 * OverlayFS + build cache: đối chiếu với lab/out/c123-overlay + c123-host.
 *   cd frontend && npx tsx --test src/components/os-lab/engine/overlay.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { OS_LAB_LAYERS, OV_SCRIPTS, buildPlan, dockerDiff, lowerdirCount, merged, resolve, runOv, upperMB } from './overlay';

const run = (k: string) => runOv(OV_SCRIPTS[k]);

describe('overlay — merged view', () => {
  it('leftmost lowerdir wins: app.conf is port=8080; ls merged = big.db etc os-release server.js', () => {
    const S = run('layers')[1];
    assert.equal(resolve(S, 'etc/app.conf')!.e.data, 'port=8080\n');
    assert.deepEqual(merged(S).filter((m) => !m.path.includes('/')).map((m) => m.path), ['big.db', 'etc', 'os-release', 'server.js']);
    assert.deepEqual(merged(S).filter((m) => m.path.startsWith('etc/')).map((m) => m.path), ['etc/app.conf', 'etc/legacy.conf']);
  });
  it('copy-up: new file goes to upper; modifying app.conf copies it up; lower layers untouched', () => {
    const st = run('copyup');
    assert.ok(st[2].upper.files['access.log']);
    const S = st[3];
    assert.equal(resolve(S, 'etc/app.conf')!.e.data, 'port=8080\nworkers=4\n');
    assert.equal(S.lowers[0].files['etc/app.conf'].data, 'port=8080\n'); assert.equal(S.lowers[1].files['etc/app.conf'].data, 'port=80\n');
  });
  it('copy-up of 200 MB: 0.93 s, upper 1 → 201 MB; second write 1 ms', () => {
    const st = run('copyup');
    assert.equal(upperMB(st[3]), 1);
    assert.equal(st[4].last.sec, 0.93); assert.equal(upperMB(st[4]), 201);
    assert.equal(st[5].last.sec, 0.001);
  });
  it('whiteout: rm legacy.conf ⇒ char 0,0 in upper, base keeps it, merged hides it', () => {
    const st = run('whiteout');
    const S = st[2];
    assert.equal(S.upper.files['etc/legacy.conf'].kind, 'whiteout');
    assert.ok(S.lowers[1].files['etc/legacy.conf']);
    assert.equal(resolve(S, 'etc/legacy.conf'), null);
    assert.match(S.term.join('\n'), /c--------- 2 root root 0, 0/);
  });
  it('opaque: rm -rf etc && mkdir etc hides everything below; xattr opaque="y"', () => {
    const st = run('opaque');
    const S = st[3];
    assert.equal(S.upper.files.etc.opaque, true);
    assert.deepEqual(merged(S).filter((m) => m.path.startsWith('etc/')), []);
    assert.match(S.term.join('\n'), /trusted\.overlay\.opaque="y"/);
  });
  it('docker diff lists upper: A/C/D', () => {
    const S = run('copyup').at(-1)!;
    assert.deepEqual(dockerDiff(S), ['A /access.log', 'C /big.db', 'C /etc', 'C /etc/app.conf']);
    assert.deepEqual(dockerDiff(run('whiteout').at(-1)!), ['C /etc', 'D /etc/legacy.conf']);
  });
});

describe('overlay — images and build cache (c123-host)', () => {
  it('os-lab: 13 image layers + 1 init = 14 lowerdirs; alpine 1 + 1 = 2', () => {
    assert.equal(lowerdirCount(OS_LAB_LAYERS), 14); assert.equal(lowerdirCount(1), 2);
  });
  it('change server.js ⇒ only step 5 (0.1 s); change package.json ⇒ steps 3–5 (3.1 s + 0.1 s)', () => {
    assert.ok(buildPlan('good', 'none').steps.every((s) => s.cached));
    const sv = buildPlan('good', 'server');
    assert.deepEqual(sv.steps.filter((s) => !s.cached).map((s) => s.n), [5]); assert.equal(sv.total, 0.1);
    const pk = buildPlan('good', 'package');
    assert.deepEqual(pk.steps.filter((s) => !s.cached).map((s) => s.n), [3, 4, 5]); assert.equal(pk.total, 3.2);
  });
  it('COPY . . before npm ci: any source change re-runs npm ci', () => {
    const b = buildPlan('bad', 'server');
    assert.deepEqual(b.steps.filter((s) => !s.cached).map((s) => s.n), [3, 4]); assert.ok(b.total >= 3.1);
  });
});
