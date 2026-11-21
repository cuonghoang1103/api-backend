// Milestone 14: after every deploy, hit the important routes and fail loudly if one is wrong.
// Run: node smoke.mjs https://your-app.example.com
const base = process.argv[2] || 'http://localhost:3471';
const checks = [
  ['GET', '/api/recipes', 200],
  ['GET', '/api/recipes/1', 200],
  ['GET', '/api/recipes/99999', 404],
  ['GET', '/api/health', 200],
];

let failed = 0;
for (const [method, path, expected] of checks) {
  const started = Date.now();
  let status;
  try {
    status = (await fetch(base + path, { method, signal: AbortSignal.timeout(5000) })).status;
  } catch (err) {
    status = 'no answer (' + err.name + ')';
  }
  const ok = status === expected;
  if (!ok) failed++;
  console.log((ok ? 'PASS' : 'FAIL') + '  ' + method + ' ' + path + '  -> ' + status + (ok ? '' : ' (expected ' + expected + ')') + (process.env.SHOW_MS ? '  ' + (Date.now() - started) + ' ms' : ''));
}
console.log(failed ? failed + ' check(s) failed' : 'all checks passed');
process.exit(failed ? 1 : 0);
