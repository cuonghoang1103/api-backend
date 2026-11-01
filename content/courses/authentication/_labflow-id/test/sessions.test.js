// test/sessions.test.js — Chapter 3: the session layer with an in-memory store and a fake clock (no database, no server).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sessionLayer, memoryStore } from '../src/sessions/index.js';
import { fakeReq, fakeRes, setValue } from '../demo3/fake-http.mjs';

const setup = () => { const c = { t: Date.UTC(2026, 10, 2) }; const store = memoryStore(); return { c, store, layer: sessionLayer({ store, now: () => c.t }) }; };
const signIn = async (layer, user, cookie) => { const res = fakeRes(); await layer.start(fakeReq(cookie), res, user); return { res, cookie: `__Host-lfid_ses=${setValue(res)}` }; };
const who = async (layer, cookie, method = 'GET', headers) => { const req = fakeReq(cookie, method, headers); const res = fakeRes(); await layer.load(req, res, () => {}); return req.session?.userId ?? null; };

test('cookie: __Host- prefix, HttpOnly, Secure, SameSite=Lax, Path=/', async () => {
  const { layer } = setup();
  const { res } = await signIn(layer, 'usr_1');
  assert.match(res.setCookies[0], /^__Host-lfid_ses=lfid_ses_[A-Za-z0-9_-]{43}; Path=\/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200$/);
});

test('sign-in replaces a planted session (fixation)', async () => {
  const { layer } = setup();
  const planted = await signIn(layer, 'usr_2');
  const an = await signIn(layer, 'usr_1', planted.cookie);
  assert.notEqual(an.cookie, planted.cookie);
  assert.equal(await who(layer, planted.cookie), null);
  assert.equal(await who(layer, an.cookie), 'usr_1');
});

test('idle 30 min and absolute 12 h', async () => {
  const { c, layer } = setup();
  const s = await signIn(layer, 'usr_1');
  c.t += 29 * 60e3; assert.equal(await who(layer, s.cookie), 'usr_1');
  c.t += 30 * 60e3; assert.equal(await who(layer, s.cookie), null);
  const t = await signIn(layer, 'usr_1'); const t0 = c.t;
  while (c.t + 20 * 60e3 < t0 + 12 * 3600e3) { c.t += 20 * 60e3; assert.equal(await who(layer, t.cookie), 'usr_1'); }
  c.t = t0 + 12 * 3600e3; assert.equal(await who(layer, t.cookie), null);
});

test('csrf: cross-site and foreign Origin get 403; same-origin and non-browser clients pass', () => {
  const { layer } = setup();
  const run = (headers) => { const res = fakeRes(); let passed = false; layer.csrf(fakeReq(null, 'POST', headers), res, () => { passed = true; }); return passed ? 'next' : res.code; };
  assert.equal(run({ 'sec-fetch-site': 'cross-site' }), 403);
  assert.equal(run({ 'sec-fetch-site': 'same-site' }), 403);
  assert.equal(run({ origin: 'http://127.0.0.1:4801' }), 403);
  assert.equal(run({ 'sec-fetch-site': 'same-origin' }), 'next');
  assert.equal(run({}), 'next');
});
