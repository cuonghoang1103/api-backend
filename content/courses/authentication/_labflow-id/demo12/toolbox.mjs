// demo12/toolbox.mjs — the toolbox: answer the question yourself (Chapter 12, 12.3). You do not need the backend team
// to tell you what is in a token or whether a cookie is set right — decode and read it. Pure, no libraries.
const b64urlJson = (seg) => JSON.parse(Buffer.from(seg.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
function decodeJwt(token) { const [h, p] = token.split('.'); return { header: b64urlJson(h), payload: b64urlJson(p) }; }
function tokenState(payload, nowSec) {
  if (payload.exp && nowSec >= payload.exp) return `EXPIRED ${nowSec - payload.exp}s ago — this is why it is 401`;
  if (payload.nbf && nowSec < payload.nbf) return 'NOT YET VALID (nbf in the future) — clock skew?';
  return `valid for ${payload.exp - nowSec}s more`;
}
function cookieFlags(setCookie) {
  const low = setCookie.toLowerCase();
  return { httpOnly: low.includes('httponly'), secure: low.includes('secure'), sameSite: (setCookie.match(/samesite=(\w+)/i) || [])[1] || 'none', hostPrefix: setCookie.startsWith('__Host-') };
}

// 1. Decode a JWT without any library (header + payload are just base64url JSON).
const tok = 'eyJhbGciOiJFZERTQSIsImtpZCI6ImsyIn0.eyJzdWIiOiJ1c3JfMSIsImlzcyI6Imh0dHBzOi8vaWQubGFiZmxvdy5leGFtcGxlIiwiZXhwIjoxNzAwMDAwOTAwLCJpYXQiOjE3MDAwMDAwMDB9.SIG';
const { header, payload } = decodeJwt(tok);
console.log('1. Decode the token by hand:');
console.log(`   header : ${JSON.stringify(header)}`);
console.log(`   payload: ${JSON.stringify(payload)}`);
console.log(`   state  : ${tokenState(payload, 1700000950)}   ← answers "why 401?" without asking anyone\n`);

// 2. Read a Set-Cookie header and check the session flags.
const sc = '__Host-lfid_ses=abc; Path=/; HttpOnly; Secure; SameSite=Lax';
console.log('2. Check the session cookie flags:');
console.log(`   ${sc}`);
console.log(`   ⇒ ${JSON.stringify(cookieFlags(sc))}   ← all four hardened (Chapter 3)\n`);

console.log('⇒ A JWT is base64url JSON you can read in two lines; a cookie is a header you can inspect. Decode first,');
console.log('  ask second — the answer to "why is it 401?" is almost always visible in the token or the cookie itself.');
