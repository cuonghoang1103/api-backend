// test/lifecycle.test.js — Chapter 6's one-time tokens and the enumeration-safe reset request (npm test, no database).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lifecycle, memoryStore } from '../src/lifecycle/index.js';

const make = () => { let t = Date.UTC(2026, 10, 3, 9, 0, 0); const clock = { get: () => t, set: (v) => (t = v), add: (ms) => (t += ms) };
  return { clock, life: lifecycle({ store: memoryStore(), now: () => clock.get() }) }; };

test('one-time token: issue and consume round trip', async () => {
  const { clock, life } = make();
  const v = await life.issueToken('usr_1', 'verify_email');
  assert.match(v.token, /^lfid_verify_[A-Za-z0-9_-]{43}$/);
  assert.deepEqual(await life.consumeToken('verify_email', v.token, { at: clock.get() + 1000 }), { userId: 'usr_1' });
});

test('single-use: a consumed token is rejected the second time', async () => {
  const { clock, life } = make();
  const v = await life.issueToken('usr_1', 'verify_email');
  await life.consumeToken('verify_email', v.token, { at: clock.get() + 1000 });
  assert.deepEqual(await life.consumeToken('verify_email', v.token, { at: clock.get() + 2000 }), { error: 'USED' });
});

test('purpose-bound: a reset token cannot verify an email, and vice versa', async () => {
  const { clock, life } = make();
  const r = await life.issueToken('usr_2', 'reset_password');
  assert.deepEqual(await life.consumeToken('verify_email', r.token, { at: clock.get() + 1000 }), { error: 'INVALID' });
  assert.deepEqual(await life.consumeToken('reset_password', r.token, { at: clock.get() + 1000 }), { userId: 'usr_2' });
});

test('expiry: a reset token is dead after 15 minutes, a verify token after 30', async () => {
  const { clock, life } = make();
  const r = await life.issueToken('usr_1', 'reset_password');
  assert.deepEqual(await life.consumeToken('reset_password', r.token, { at: clock.get() + 16 * 60e3 }), { error: 'EXPIRED' });
  const v = await life.issueToken('usr_1', 'verify_email');
  assert.equal((await life.consumeToken('verify_email', v.token, { at: clock.get() + 29 * 60e3 })).userId, 'usr_1');
  const v2 = await life.issueToken('usr_1', 'verify_email');
  assert.deepEqual(await life.consumeToken('verify_email', v2.token, { at: clock.get() + 31 * 60e3 }), { error: 'EXPIRED' });
});

test('an unknown token is INVALID, never a crash', async () => {
  const { life } = make();
  assert.deepEqual(await life.consumeToken('reset_password', 'lfid_reset_nope'), { error: 'INVALID' });
  assert.deepEqual(await life.consumeToken('verify_email', undefined), { error: 'INVALID' });
});

test('requestPasswordReset emails only a real, active account', async () => {
  const { life } = make();
  const sent = [];
  const users = { findByEmail: async (e) => (e === 'an@x' ? { id: 'usr_1', email: 'an@x', status: 'active' } : null) };
  await life.requestPasswordReset(users, 'an@x', { send: (m) => sent.push(m), sync: true });
  await life.requestPasswordReset(users, 'nobody@x', { send: (m) => sent.push(m), sync: true });
  assert.equal(sent.length, 1, 'only the real account gets a mail');
  assert.equal(sent[0].to, 'an@x');
  assert.match(sent[0].text, /token=lfid_reset_/);
});

test('requestPasswordReset does not email a deleted account', async () => {
  const { life } = make();
  const sent = [];
  const users = { findByEmail: async () => ({ id: 'usr_9', email: 'gone@x', status: 'deleted' }) };
  await life.requestPasswordReset(users, 'gone@x', { send: (m) => sent.push(m), sync: true });
  assert.equal(sent.length, 0);
});
