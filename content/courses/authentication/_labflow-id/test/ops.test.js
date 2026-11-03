import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeAudit } from '../src/ops/audit.js';
import { triage } from '../src/ops/triage.js';
import { rotate, canVerify } from '../src/ops/rotation.js';
import { allow } from '../src/ops/ratelimit.js';
import { loadConfig, redactedConfig } from '../src/secrets/load.js';
test('safeAudit keeps safe fields, drops secrets, tags severity', () => {
  const a = safeAudit({ ts: 1, actor: 'u', action: 'refresh_reuse_detected', outcome: 'x', ip: '1', token: 'LEAK', password: 'LEAK2' });
  assert.equal(a.actor, 'u'); assert.equal(a.severity, 'alert');
  assert.ok(!JSON.stringify(a).includes('LEAK'));
});
test('triage routes signals; unknown ⇒ investigate', () => {
  assert.equal(triage({ name: 'refresh_reuse_spike' }), 'page');
  assert.equal(triage({ name: 'failed_login_burst' }), 'auto');
  assert.equal(triage({ name: 'nope' }), 'investigate');
});
test('rotation keeps the old key live during overlap, drops it on retire', () => {
  let r = { active: 'k1', live: ['k1'] };
  r = rotate(r, 'activate', 'k2');
  assert.ok(canVerify(r, 'k1') && canVerify(r, 'k2'));
  assert.ok(!canVerify(rotate(r, 'retire'), 'k1'));
});
test('fixed-window rate limit blocks over the limit and resets next window', () => {
  const s = new Map();
  for (let i = 0; i < 5; i++) assert.equal(allow(s, 'k', { limit: 5, windowMs: 1000, now: 1000 }).ok, true);
  assert.equal(allow(s, 'k', { limit: 5, windowMs: 1000, now: 1000 }).ok, false);
  assert.equal(allow(s, 'k', { limit: 5, windowMs: 1000, now: 2000 }).ok, true);   // next window
});
test('loadConfig reports missing required secrets; redactedConfig hides values', () => {
  assert.deepEqual(loadConfig({ JWT_SIGNING_KEY: 'k' }).missing, ['DATABASE_URL', 'SESSION_SECRET']);
  assert.equal(redactedConfig({ DATABASE_URL: 'postgres://secret' }).DATABASE_URL, '[set]');
});
