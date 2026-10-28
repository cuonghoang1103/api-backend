/**
 * Namespace: đối chiếu với lab/out/c121-ns, c121-host, c127-host.
 *   cd frontend && npx tsx --test src/components/os-lab/engine/ns.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { NS_SCRIPTS, POD_DEFAULT, allOff, dockerDefault, host, inodeRows, inside, podView } from './ns';

describe('nslayers — one process, two views (c121)', () => {
  it('pid ns: PID 1 inside, NSpid "71743 1" from the host', () => {
    const on = dockerDefault();
    assert.equal(inside(on).pid, 1); assert.equal(host(on).nspid, 'NSpid:\t71743\t1');
    assert.equal(inside(allOff()).pid, 71743); assert.equal(host(allOff()).nspid, 'NSpid:\t71743');
    assert.ok(host(on).ps.some((l) => l.startsWith('71743 71719 sleep 600')));
  });
  it('without a mount ns for /proc, ps fails: "fatal library error, lookup self"', () => {
    assert.deepEqual(inside({ ...allOff(), pid: true }).ps, ['fatal library error, lookup self']);
  });
  it('uts/net/ipc/cgroup change exactly what the lab showed', () => {
    const on = dockerDefault();
    assert.equal(inside(on).hostname, 'web');
    assert.match(inside(on).ifaces.join('\n'), /eth0@if1110\s+UP\s+172\.17\.0\.5\/16/);
    assert.equal(inside(on).cgroup, '0::/');
    assert.equal(inside(on).ipcs, '(no message queues)');
  });
  it('Docker default: 7 namespaces differ from the VM, user is the SAME inode 4026531837', () => {
    const rows = inodeRows(dockerDefault());
    assert.equal(rows.filter((r) => !r.same).length, 7);
    const u = rows.find((r) => r.kind === 'user')!;
    assert.equal(u.same, true); assert.equal(u.inside, 4026531837);
    assert.equal(rows.find((r) => r.kind === 'pid')!.inside, 4026533378);
    assert.equal(inside(dockerDefault()).uidMap.trim().split(/\s+/).join(' '), '0 0 4294967295');
  });
  it('user ns: "0 1001 1", touch /etc denied; remap "0 100000 65536"', () => {
    const v = inside({ ...allOff(), user: true }, 'rootless');
    assert.equal(v.uidMap.trim().split(/\s+/).join(' '), '0 1001 1');
    assert.match(v.touchEtc, /Permission denied/);
    assert.equal(inside({ ...allOff(), user: true }, 'remap').uidMap.trim().split(/\s+/).join(' '), '0 100000 65536');
  });
  it('the unshare script reproduces the traps', () => {
    const t = NS_SCRIPTS.unshare.flatMap((s) => s.term ?? []).join('\n');
    assert.match(t, /sh: 1: Cannot fork/); assert.match(t, /fatal library error, lookup self/); assert.match(t, /curl exit 6/);
  });
  it('the docker script ends at the Docker default set', () => {
    assert.deepEqual(NS_SCRIPTS.docker[NS_SCRIPTS.docker.length - 1].on, dockerDefault());
    assert.deepEqual(NS_SCRIPTS.docker[0].on, allOff());
  });
});

describe('nslayers — pod (c127-host)', () => {
  it('shared net: sidecar reaches 127.0.0.1:8000, both binding 8000 ⇒ EADDRINUSE, IP survives app restart', () => {
    const v = podView(POD_DEFAULT);
    assert.equal(v.curl.ok, true); assert.match(v.curl.out, /<!DOCTYPE HTML>/);
    assert.match(v.bothListen.out, /EADDRINUSE/);
    assert.match(v.ipAfterRestart, /10\.244\.1\.17 → 10\.244\.1\.17/);
    assert.equal(podView({ ...POD_DEFAULT, net: false }).curl.ok, false);
  });
  it('shared pid: ps in the app shows pause as PID 1 and python as 7', () => {
    const ps = podView({ ...POD_DEFAULT, pid: true }).ps.join('\n');
    assert.match(ps, /^\s+1 \/pause/m); assert.match(ps, /^\s+7 python3 -m http\.server 8000/m);
  });
});
