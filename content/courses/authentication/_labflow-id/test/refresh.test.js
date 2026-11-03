// test/refresh.test.js — Chapter 5's refresh-token layer, pinned by tests (npm test, no database).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { refreshLayer, memoryStore } from '../src/refresh/index.js';

const make = (over = {}) => { let t = Date.UTC(2026, 10, 3, 9, 0, 0); const clock = { get: () => t, set: (v) => (t = v), add: (ms) => (t += ms) };
  return { clock, rl: refreshLayer({ store: memoryStore(), now: () => clock.get(), graceMs: 10e3, ...over }) }; };

test('issue + rotate: a fresh token each time, same family', async () => {
  const { clock, rl } = make();
  const a = await rl.issue('usr_1');
  assert.match(a.token, /^lfid_rt_[A-Za-z0-9_-]{43}$/);
  clock.add(1000);
  const r1 = await rl.rotate(a.token);
  assert.ok(r1.token && r1.token !== a.token, 'rotation gives a new token');
  assert.equal(r1.row.familyId, a.row.familyId, 'same family');
});

test('reuse of a rotated token revokes the whole family', async () => {
  const { clock, rl } = make();
  const a = await rl.issue('usr_1');
  clock.add(1000); const r1 = await rl.rotate(a.token);
  clock.add(1000); const r2 = await rl.rotate(r1.token);
  clock.add(20000); // past the grace window
  const reuse = await rl.rotate(a.token); // the attacker replays the first, long-rotated token
  assert.equal(reuse.error, 'REUSE_DETECTED');
  const dead = await rl.rotate(r2.token); // even the legitimate current token is now dead
  assert.equal(dead.error, 'REVOKED');
});

test('the refresh race: the same token rotated twice within grace returns the same child', async () => {
  const { clock, rl } = make();
  const a = await rl.issue('usr_1');
  clock.add(1000);
  const x1 = await rl.rotate(a.token);
  const x2 = await rl.rotate(a.token); // a second tab, same cookie, within graceMs
  assert.equal(x1.token, x2.token, 'both get the same new token');
  assert.equal(x2.raced, true);
});

test('outside the grace window, the same second use is treated as theft', async () => {
  const { clock, rl } = make();
  const a = await rl.issue('usr_1');
  clock.add(1000); await rl.rotate(a.token);
  clock.add(11000); // 11 s later — past graceMs = 10 s
  const late = await rl.rotate(a.token);
  assert.equal(late.error, 'REUSE_DETECTED');
});

test('invalid, expired and revoked tokens are rejected without flagging theft', async () => {
  const { clock, rl } = make({ familyTtlMs: 5000 });
  assert.equal((await rl.rotate('lfid_rt_notarealtoken')).error, 'INVALID');
  const a = await rl.issue('usr_1');
  clock.add(6000); // past the 5 s family ttl
  assert.equal((await rl.rotate(a.token)).error, 'EXPIRED');
  const b = await rl.issue('usr_2');
  await rl.revokeFamily(b.row.familyId);
  assert.equal((await rl.rotate(b.token)).error, 'REVOKED');
});

test('device list and revocation', async () => {
  const { clock, rl } = make();
  await rl.issue('usr_1', { ua: 'laptop' });
  clock.add(1000); await rl.issue('usr_1', { ua: 'phone' });
  clock.add(1000); await rl.issue('usr_1', { ua: 'labpc' });
  let devices = await rl.listDevices('usr_1');
  assert.equal(devices.length, 3);
  await rl.revokeDevice('usr_1', devices[0].familyId);
  devices = await rl.listDevices('usr_1');
  assert.equal(devices.length, 2);
  await rl.revokeAll('usr_1');
  assert.equal((await rl.listDevices('usr_1')).length, 0);
});

test('a rotated family still appears as one device (not one per rotation)', async () => {
  const { clock, rl } = make();
  const a = await rl.issue('usr_1', { ua: 'laptop' });
  clock.add(1000); const r1 = await rl.rotate(a.token);
  clock.add(1000); await rl.rotate(r1.token);
  const devices = await rl.listDevices('usr_1');
  assert.equal(devices.length, 1, 'three tokens, one family, one device');
});
