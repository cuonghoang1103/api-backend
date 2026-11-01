// Smoke test after a deploy: a few cheap requests that prove the site is really up.
//   node smoke.mjs http://localhost:4173
const base = process.argv[2] ?? 'http://localhost:4173';
const checks = [
  ['/', 200, 'CT Shop'],
  ['/robots.txt', 200, 'User-agent'],
  ['/products/42', 200, 'CT Shop'],     // client-side route ⇒ needs the SPA fallback
];
let failed = 0;
for (const [p, status, text] of checks) {
  const res = await fetch(base + p);
  const body = await res.text();
  const ok = res.status === status && body.includes(text);
  if (!ok) failed++;
  console.log(ok ? 'ok  ' : 'FAIL', String(res.status).padEnd(4), p);
}
console.log(failed ? `${failed} check(s) failed` : 'all checks passed');
process.exit(failed ? 1 : 0);
