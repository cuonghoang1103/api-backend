// demo12/diagnose.mjs — the first five minutes of "users cannot log in" (Chapter 12, 12.1). The fastest signal is the
// HTTP STATUS of the login endpoint on an unauthenticated curl: it tells you which layer is broken before you read a
// line of code. 401/403/404/500/200 each point somewhere different.
const MEANING = {
  200: ['the route works and is public — the problem is AFTER login (session, redirect, the client)', 'look at the client / the next request'],
  401: ['the route is MOUNTED and asking for credentials — auth is wired; a real login should now be tried', 'try a real credential; the pipe is intact'],
  403: ['authenticated but forbidden — an AUTHORIZATION problem (role/tenant), not authentication', 'check the authz gate (Chapter 9), not the password'],
  404: ['the route is NOT MOUNTED — almost always a STALE or partial build, not a code bug', 'redeploy a clean build; the route exists in source but not in the running image'],
  500: ['the server CRASHED handling it — a dependency (DB, Redis, a missing secret) or an unhandled error', 'read the server log and the startup banner (Chapter 11)'],
};
function firstCheck(status) { return MEANING[status] || ['an unexpected status — capture it and the response body', 'widen the net']; }

console.log('"Users cannot log in." First: curl the login route unauthenticated and read the status.\n');
console.log('  curl -s -o /dev/null -w "%{http_code}" https://id.labflow.example/api/v1/auth/login\n');
for (const s of [200, 401, 403, 404, 500]) {
  const [meaning, next] = firstCheck(s);
  console.log(`  ${s} → ${meaning}`);
  console.log(`        next: ${next}\n`);
}
console.log('⇒ The status narrows the problem to a layer in seconds: 404 = stale build, 500 = crashed dependency,');
console.log('  403 = authorization not authentication, 401 = the pipe is intact so try a real login. Measure before you guess.');
