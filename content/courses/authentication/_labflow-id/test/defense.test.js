import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decide } from '../src/defense/stuffing.js';
const base = { accountFails: 0, ipFails: 0, ipAccounts: 0, breached: false, solvedChallenge: false };
const sig = (o) => ({ ...base, ...o });
test('decide() blocks the spray by IP/spread and never locks a single account', () => {
  assert.equal(decide(sig({ ipFails: 100 })), 'block');
  assert.equal(decide(sig({ ipAccounts: 50 })), 'block');
  assert.equal(decide(sig({ breached: true })), 'challenge');
  assert.equal(decide(sig({ breached: true, solvedChallenge: true })), 'allow');
  assert.equal(decide(sig({ accountFails: 50 })), 'challenge');          // never 'block' on account alone
  assert.notEqual(decide(sig({ accountFails: 9999 })), 'block');
  assert.equal(decide(sig({})), 'allow');
  assert.equal(decide(sig({ ipFails: 100, solvedChallenge: true })), 'block');  // hard block survives a solved challenge
});
