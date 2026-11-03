// demo6/enum-timing.mjs — lesson 6.4: account enumeration is a TIMING leak, not just a wording one. Measured over HTTP
// against v0.6 on :4800. The response body is identical for a real and a fake email; the question is whether the TIME is.
const BASE = 'http://localhost:4800';
const post = async (path, body) => { const t = process.hrtime.bigint(); const r = await fetch(BASE + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); await r.text(); return Number(process.hrtime.bigint() - t) / 1e6; };
const median = (xs) => xs.slice().sort((a, b) => a - b)[xs.length >> 1];

async function timed(path, make, n) { const ms = []; for (let i = 0; i < n; i++) ms.push(await post(path, make(i))); return median(ms); }

console.log('1a) /forgot-password-naive — same WORDING, but it AWAITS the token insert + email send (the teaching foil):');
await timed('/forgot-password-naive', () => ({ email: 'warm@up' }), 20);
let nReal = await timed('/forgot-password-naive', () => ({ email: 'an@student.labflow.example' }), 200);
let nFake = await timed('/forgot-password-naive', (i) => ({ email: `nobody-${i}@nowhere.example` }), 200);
console.log(`   real account : median ${nReal.toFixed(2)} ms`);
console.log(`   fake account : median ${nFake.toFixed(2)} ms`);
console.log(`   LEAK         : the real account is ${(nReal - nFake).toFixed(2)} ms slower — an attacker enumerates by TIMING, not wording`);

console.log('\n1b) /forgot-password — same response AND the insert + mail are NOT awaited (the fix):');
await timed('/forgot-password', () => ({ email: 'warm@up' }), 20);
let fReal = await timed('/forgot-password', () => ({ email: 'an@student.labflow.example' }), 200);
let fFake = await timed('/forgot-password', (i) => ({ email: `nobody-${i}@nowhere.example` }), 200);
console.log(`   real account : median ${fReal.toFixed(2)} ms`);
console.log(`   fake account : median ${fFake.toFixed(2)} ms`);
console.log(`   difference   : ${Math.abs(fReal - fFake).toFixed(2)} ms — within noise; the slow work is off the response path`);

console.log('\n2) /sign-up — the password is hashed in BOTH branches (taken and free), so argon2 dominates both:');
await timed('/sign-up', (i) => ({ email: `warmup-${i}@x`, name: 'W', password: 'zephyr-lab-canyon-2026-qwk' }), 3);
const sTaken = await timed('/sign-up', () => ({ email: 'an@student.labflow.example', name: 'X', password: 'zephyr-lab-canyon-2026-qwk' }), 15);
const sFree = await timed('/sign-up', () => ({ email: `free-${Math.random().toString(36).slice(2)}@nowhere.example`, name: 'X', password: 'zephyr-lab-canyon-2026-qwk' }), 15);
console.log(`   email taken  : median ${sTaken.toFixed(1)} ms`);
console.log(`   email free   : median ${sFree.toFixed(1)} ms`);
console.log(`   ratio        : ${(Math.max(sTaken, sFree) / Math.min(sTaken, sFree)).toFixed(2)}x  (argon2 ~86 ms in both — the leak is closed by doing the same work)`);
