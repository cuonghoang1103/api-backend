/**
 * Phòng quyền: đối chiếu với output thật lab/out/c96-quyen + c97-cap.
 *   cd frontend && npx tsx --test src/components/os-lab/engine/perm.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ask, baseWorld, modeStr, nodeAt, octal, withMode, type Ask, type World } from './perm';

const W0 = baseWorld();
const A = (q: Ask, w: World = W0) => ask(w, q);
const chmod = (w: World, p: string, m: number): World => ({ ...w, nodes: w.nodes.map((n) => (n.path === p ? withMode(n, m) : n)) });

describe('perm — mode strings', () => {
  it('ls -l letters for special bits', () => {
    assert.equal(modeStr(nodeAt(W0, '/tmp')!), 'drwxrwxrwt');
    assert.equal(modeStr(nodeAt(W0, '/srv/team')!), 'drwxrwsr-x');
    assert.equal(modeStr(nodeAt(W0, '/usr/local/bin/ids')!), '-rwsr-xr-x');
    assert.equal(modeStr(nodeAt(W0, '/tmp/own.txt')!), '----rwxrwx');
    assert.equal(modeStr(nodeAt(W0, '/srv/app/uploads/a.jpg')!), '-rw-r-----+');
    assert.equal(octal(0o2775), '2775');
  });
});

describe('perm — c96-quyen', () => {
  it('owner bits only: dev cannot read its own 077 file, bob can', () => {
    const d = A({ who: 'dev', op: 'read', path: '/tmp/own.txt' });
    assert.equal(d.ok, false); assert.equal(d.errno, 'EACCES'); assert.equal(d.shell.out, 'cat: /tmp/own.txt: Permission denied');
    assert.equal(d.checks.find((c) => c.decide && c.on === '/tmp/own.txt')!.rule, 'owner');
    const b = A({ who: 'bob', op: 'read', path: '/tmp/own.txt' });
    assert.equal(b.ok, true); assert.equal(b.shell.out, 'hello');
  });
  it('directory 744: ls shows ????, cat is refused; 711: ls refused, cat works', () => {
    const l = A({ who: 'dev', op: 'list', path: '/srv/box' });
    assert.equal(l.partial, true); assert.match(l.shell.out, /-\?{9} \? \? \? \?\s+\? q3\.txt/);
    assert.equal(A({ who: 'dev', op: 'read', path: '/srv/box/q3.txt' }).shell.out, 'cat: /srv/box/q3.txt: Permission denied');
    const w = chmod(W0, '/srv/box', 0o711);
    assert.equal(A({ who: 'dev', op: 'list', path: '/srv/box' }, w).shell.out, "ls: cannot open directory '/srv/box': Permission denied");
    assert.equal(A({ who: 'dev', op: 'read', path: '/srv/box/q3.txt' }, w).shell.out, 'report');
  });
  it('delete = write on the directory: own dir ok, someone else\'s 755 dir EACCES even for your own file', () => {
    assert.equal(A({ who: 'dev', op: 'delete', path: '/srv/devdir/owned-by-root' }).ok, true);
    const r = A({ who: 'dev', op: 'delete', path: '/srv/app/dev-notes.txt' });
    assert.equal(r.errno, 'EACCES'); assert.equal(r.shell.out, "rm: cannot remove '/srv/app/dev-notes.txt': Permission denied");
  });
  it('sticky /tmp: EPERM "Operation not permitted"; /srv/drop 777 without sticky: deleted', () => {
    const t = A({ who: 'dev', op: 'delete', path: '/tmp/bob-session' });
    assert.equal(t.errno, 'EPERM'); assert.equal(t.shell.out, "rm: cannot remove '/tmp/bob-session': Operation not permitted");
    assert.equal(A({ who: 'dev', op: 'delete', path: '/srv/drop/bob-session' }).ok, true);
    assert.equal(A({ who: 'bob', op: 'delete', path: '/tmp/bob-session' }).ok, true);
  });
  it('setgid dir 2775: new files belong to group team; umask 022 ⇒ 644, 077 ⇒ 600', () => {
    const c = A({ who: 'dev', op: 'create', path: '/srv/team' });
    assert.equal(c.created!.gid, 2000); assert.equal(c.shell.out, '-rw-r--r-- 1 dev team 0 new.txt');
    const c2 = A({ who: 'dev', op: 'create', path: '/srv/devdir' }, { ...W0, umask: 0o077 });
    assert.equal(octal(c2.created!.mode), '600'); assert.equal(c2.created!.gid, 1001);
  });
  it('setuid ids: dev alone is refused .env (600 root); through ids euid = 0 and open is OK', () => {
    assert.equal(A({ who: 'dev', op: 'read', path: '/srv/app/.env' }).ok, false);
    const s = A({ who: 'dev', op: 'read', path: '/srv/app/.env', via: '/usr/local/bin/ids' });
    assert.equal(s.euid, 0); assert.equal(s.ok, true); assert.match(s.shell.out, /real uid=1001 {2}effective uid=0\nopen \/srv\/app\/\.env: OK/);
    const noS = chmod(W0, '/usr/local/bin/ids', 0o755);
    assert.equal(A({ who: 'dev', op: 'read', path: '/srv/app/.env', via: '/usr/local/bin/ids' }, noS).shell.out, 'open /srv/app/.env: Permission denied');
  });
  it('root reads a 000 file (CAP_DAC_OVERRIDE) but cannot exec a 644 script', () => {
    const w = chmod(W0, '/srv/app/.env', 0);
    const r = A({ who: 'root', op: 'read', path: '/srv/app/.env' }, w);
    assert.equal(r.ok, true); assert.equal(r.shell.out, 'DB_PASSWORD=s3cret'); assert.equal(r.checks.filter((c) => c.decide && c.on === '/srv/app/.env').pop()!.rule, 'cap');
    const x = A({ who: 'root', op: 'exec', path: '/srv/app/deploy.sh' });
    assert.equal(x.ok, false); assert.equal(x.shell.out, "env: '/srv/app/deploy.sh': Permission denied");
  });
});

describe('perm — c97-cap (capabilities and ACL)', () => {
  it('root without CAP_DAC_OVERRIDE is refused like anyone', () => {
    const w = { ...W0, nodes: W0.nodes.map((n) => (n.path === '/srv/app/.env' ? { ...n, uid: 1001, gid: 1001 } : n)) };
    assert.equal(A({ who: 'root', op: 'read', path: '/srv/app/.env' }, w).ok, true);
    const d = A({ who: 'root', op: 'read', path: '/srv/app/.env', capsDrop: true }, w);
    assert.equal(d.ok, false); assert.equal(d.shell.out, 'cat: /srv/app/.env: Permission denied');
  });
  it('ACL: www-data reads a.jpg through user:www-data entries, cannot ls the folder', () => {
    assert.equal(A({ who: 'www-data', op: 'read', path: '/srv/app/uploads/a.jpg' }).shell.out, 'jpeg bytes');
    assert.equal(A({ who: 'www-data', op: 'list', path: '/srv/app/uploads' }).shell.out, "ls: cannot open directory '/srv/app/uploads': Permission denied");
    assert.equal(A({ who: 'bob', op: 'read', path: '/srv/app/uploads/a.jpg' }).ok, false);
  });
  it('the mask trap: chmod 600 a.jpg sets mask ---, so user:www-data:r-- is #effective:---', () => {
    const w = chmod(W0, '/srv/app/uploads/a.jpg', 0o600);
    assert.equal(nodeAt(w, '/srv/app/uploads/a.jpg')!.acl!.mask, 0);
    const r = A({ who: 'www-data', op: 'read', path: '/srv/app/uploads/a.jpg' }, w);
    assert.equal(r.ok, false); assert.match(r.checks.find((c) => c.rule === 'acl-user' && c.on.endsWith('a.jpg'))!.en, /#effective:---/);
  });
  it('a default ACL is copied onto new files', () => {
    const w = { ...W0, nodes: W0.nodes.map((n) => (n.path === '/srv/app/uploads' ? { ...n, defAcl: { users: [{ uid: 33, perm: 4 }], groups: [], groupObj: 0, mask: 4 } } : n)) };
    const c = A({ who: 'dev', op: 'create', path: '/srv/app/uploads' }, w);
    assert.deepEqual(c.created!.acl!.users, [{ uid: 33, perm: 4 }]); assert.equal(c.created!.acl!.mask, 4);
  });
});
