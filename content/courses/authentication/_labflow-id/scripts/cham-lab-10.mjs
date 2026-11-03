// scripts/cham-lab-10.mjs — grader of Lab 10 (credential-stuffing defense). 6 checks, 10 points, pass = 7.
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const m = await import(pathToFileURL(path.resolve(process.argv[2] ?? 'lab10/my', 'index.js')).href);
const decide = m.decide;
const base = { accountFails: 0, ipFails: 0, ipAccounts: 0, breached: false, solvedChallenge: false };
const sig = (o) => ({ ...base, ...o });
const results = [];
const expect = (c, why) => { if (!c) throw Object.assign(new Error(why), { name: 'Expected' }); };
function check(name, points, fn) { let why = ''; try { why = fn() || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : `threw ${e?.name}: ${String(e?.message).split('\n')[0]}`; } results.push({ name, points, ok: !why, why }); }

check('T1 a flooding IP is blocked', 2, () => {
  expect(decide(sig({ ipFails: 100 })) === 'block', 'ipFails ≥ 100 must block (a human never fails 100×)');
  expect(decide(sig({ ipFails: 250 })) === 'block', 'a worse flood must still block');
});
check('T2 a spraying IP (many accounts) is blocked', 2, () => {
  expect(decide(sig({ ipAccounts: 50 })) === 'block', 'one IP touching 50 distinct accounts is spraying ⇒ block');
  expect(decide(sig({ ipAccounts: 200 })) === 'block', 'more spread must still block');
});
check('T3 a breached password is challenged (not allowed, not blocked)', 1.5, () => {
  expect(decide(sig({ breached: true })) === 'challenge', 'a breached password with no solved challenge ⇒ challenge');
  expect(decide(sig({ breached: true, solvedChallenge: true })) === 'allow', 'a solved challenge clears the breached soft signal ⇒ allow');
});
check('T4 a real user who mistypes is CHALLENGED, never blocked', 2, () => {
  expect(decide(sig({ accountFails: 10 })) === 'challenge', 'many account fails ⇒ challenge (prove human), NOT block');
  expect(decide(sig({ accountFails: 999 })) !== 'block', 'a single account must NEVER be hard-blocked by its own fail count (that is the attacker\'s DoS)');
});
check('T5 a clean login is allowed', 1, () => {
  expect(decide(sig({})) === 'allow', 'a clean signal must allow the password check to proceed');
  expect(decide(sig({ accountFails: 1, ipFails: 2 })) === 'allow', 'a couple of fails is normal ⇒ allow');
});
check('T6 a solved challenge clears soft signals but NOT the hard IP block', 1.5, () => {
  expect(decide(sig({ ipFails: 20, solvedChallenge: true })) === 'allow', 'a solved challenge clears a soft IP signal');
  expect(decide(sig({ accountFails: 10, solvedChallenge: true })) === 'allow', 'a solved challenge clears the account signal');
  expect(decide(sig({ ipFails: 100, solvedChallenge: true })) === 'block', 'a solved challenge must NOT clear a hard IP flood (solver farms pass CAPTCHAs)');
});

const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(`Lab 10 — ${path.relative(process.cwd(), path.resolve(process.argv[2] ?? 'lab10/my', 'index.js'))}`);
for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name.padEnd(62)} ${r.ok ? r.points : 0}/${r.points}${r.ok ? '' : `\n    ↳ ${r.why}`}`);
console.log(`TOTAL ${total}/10 — ${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}`);
process.exit(total >= 7 ? 0 : 1);
