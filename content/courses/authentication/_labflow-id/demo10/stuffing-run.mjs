// demo10/stuffing-run.mjs — a real credential-stuffing run against LabFlow ID, measured (Chapter 10, 10.1 + Lab 10).
// We replay a mixed traffic stream — an attacker spraying a breach dump across many accounts from a few IPs, plus
// real users (one of whom fat-fingers their own password) — and compare TWO defenses:
//   A) naive per-account lockout (5 strikes ⇒ lock): stops the attacker AND lets them lock every real user (a DoS);
//   B) src/defense/stuffing.js decide(): blocks the spray by IP/spread, never locks a single real account.
import { decide } from '../src/defense/stuffing.js';

const REAL = { 'an@labflow.example': 'corrected horse battery', 'binh@labflow.example': 'another real one' };
const BREACHED_HIT = { account: 'lan@labflow.example', password: 'P@ssw0rd123' };    // reused a breached password
// 10k attempts: 2/3 use breached-dump passwords (the stuffing signature), 1/3 are brute guesses.
const DUMP = Array.from({ length: 10000 }, (_, i) => ({ account: `u${i % 400}@labflow.example`, password: `leaked-${i}`, breached: i % 3 !== 0 }));
DUMP.splice(5000, 0, { ...BREACHED_HIT, breached: true });                            // the one that would succeed

const stream = [];
let ip = 0;
for (const a of DUMP) stream.push({ ...a, ip: `203.0.113.${ip++ % 3}`, real: false });   // attacker: 3 spraying IPs
stream.push({ account: 'an@labflow.example', password: 'corrected horse battery', breached: false, ip: '198.51.100.7', real: true });
for (let k = 0; k < 6; k++) stream.push({ account: 'binh@labflow.example', password: 'wrong-typo', breached: false, ip: '198.51.100.9', real: true });
stream.push({ account: 'binh@labflow.example', password: 'another real one', breached: false, ip: '198.51.100.9', real: true });
for (let i = stream.length - 8; i < stream.length; i++) { const j = 2000 + (i % 500); [stream[i], stream[j]] = [stream[j], stream[i]]; }

function run(mode) {
  const accountFails = new Map(), ipFails = new Map(), ipAccts = new Map(), locked = new Set();
  let attackerWins = 0, realBlocked = 0, challenged = 0, blocked = 0;
  const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);
  for (const r of stream) {
    const passwordCorrect = REAL[r.account] === r.password || (r.account === BREACHED_HIT.account && r.password === BREACHED_HIT.password);
    if (mode === 'naive') {
      if (locked.has(r.account)) { if (r.real) realBlocked++; continue; }
      if (passwordCorrect) { accountFails.set(r.account, 0); if (!r.real) attackerWins++; }
      else { const f = (accountFails.get(r.account) || 0) + 1; accountFails.set(r.account, f); if (f >= 5) locked.add(r.account); }
      continue;
    }
    // decide(): count this request's contribution to the IP signal FIRST (a request is a request, challenged or not),
    // so a spray escalates from 'challenge' to a hard 'block'; then decide allow / challenge / block.
    if (!r.real) { bump(ipFails, r.ip); if (!ipAccts.has(r.ip)) ipAccts.set(r.ip, new Set()); ipAccts.get(r.ip).add(r.account); }
    const sig = { accountFails: accountFails.get(r.account) || 0, ipFails: ipFails.get(r.ip) || 0,
      ipAccounts: (ipAccts.get(r.ip) || new Set()).size, breached: r.breached, solvedChallenge: r.real };
    const d = decide(sig);
    if (d === 'block') { blocked++; if (r.real) realBlocked++; continue; }
    if (d === 'challenge') { challenged++; if (!r.real) continue; }                   // attacker cannot solve
    if (passwordCorrect) { accountFails.set(r.account, 0); if (!r.real) attackerWins++; }
    else bump(accountFails, r.account);
  }
  return { attackerWins, realBlocked, challenged, blocked };
}

const naive = run('naive'), def = run('decide');
console.log(`Replaying ${stream.length} login attempts: a 10k-password spray (3 IPs, 2/3 breached) + real users, one mistyping 6×.\n`);
console.log('A) Naive per-account lockout (5 strikes ⇒ lock the account):');
console.log(`   attacker logins that succeeded : ${naive.attackerWins}   (the breached reuse got in before lockout)`);
console.log(`   REAL users locked out of their own account : ${naive.realBlocked}   ← the attacker DoS-locked them`);
console.log('\nB) decide() — defend the IP/spread, challenge the breached, never lock an account:');
console.log(`   attacker logins that succeeded : ${def.attackerWins}`);
console.log(`   REAL users locked out : ${def.realBlocked}   ← the mistyping user kept trying and got in`);
console.log(`   attacker requests challenged : ${def.challenged} · hard-blocked (IP spray) : ${def.blocked}`);
console.log('\n⇒ A lockout stops the spray but lets the attacker lock every real account on purpose (a DoS). decide()');
console.log('  challenges the breached-password spray, escalates a flooding IP to a hard block, and a real user who');
console.log('  mistypes is never locked out.');
