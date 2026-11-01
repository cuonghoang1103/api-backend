// test/passwords.test.js — Chapter 2: the password module, without a database (a fake store).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcrypt';
import { hashPassword, verifyPassword, describe, checkNewPassword, signIn, PARAMS } from '../src/passwords/index.js';

test('hash is argon2id with the measured parameters and a fresh salt', async () => {
  const a = await hashPassword('an-lab-2026'), b = await hashPassword('an-lab-2026');
  assert.deepEqual(describe(a), { scheme: 'argon2id', m: PARAMS.memoryCost, t: PARAMS.timeCost, p: PARAMS.parallelism });
  assert.notEqual(a, b);
});

test('NFC: precomposed and decomposed Vietnamese verify the same', async () => {
  const s = await hashPassword('Bình-thích-hoa-sen-2026'.normalize('NFC'));
  assert.equal((await verifyPassword(s, 'Bình-thích-hoa-sen-2026'.normalize('NFD'))).ok, true);
});

test('bcrypt verifies and asks for a rehash; a wrong password never does', async () => {
  const old = await bcrypt.hash('lan-lab-2026', 10);
  assert.deepEqual(await verifyPassword(old, 'lan-lab-2026'), { ok: true, rehash: true });
  assert.deepEqual(await verifyPassword(old, 'nope'), { ok: false, rehash: false });
});

test('policy: length, blocklist, context — no composition rules', () => {
  const blocklist = new Set(['123456']);
  assert.deepEqual(checkNewPassword('123456', { blocklist }), ['TOO_SHORT', 'COMMON']);
  assert.deepEqual(checkNewPassword('LabFlow2026!!!!!'), ['CONTEXT_WORD']);
  assert.deepEqual(checkNewPassword('hoa sen nở giữa đầm lầy tháng năm'), []);
});

test('signIn: one answer for both failures, upgrade on success', async () => {
  const rows = [{ id: 'usr_3', email: 'lan@labflow.example', passwordHash: await bcrypt.hash('lan-lab-2026', 10) }];
  const updates = [];
  const store = { findByEmail: async (e) => rows.find((r) => r.email === e) ?? null, updateHash: async (id, h) => updates.push(h) };
  assert.deepEqual(await signIn(store, 'nobody@labflow.example', 'x'), await signIn(store, 'lan@labflow.example', 'x'));
  assert.equal((await signIn(store, 'Lan@LabFlow.example', 'lan-lab-2026')).user.id, 'usr_3');
  assert.equal(describe(updates[0]).scheme, 'argon2id');
});
