// demo8/oidc-flow.mjs — the full OpenID Connect login: LabFlow API (a client on :4810) signs a user in via LabFlow ID
// (the provider on :4800), authorization-code flow + PKCE. No browser: the "user" is a cookie jar already signed in to
// the provider; the script follows the redirects a browser would. Then: discovery, the 7 ID-token checks, and the
// attacks the parameters stop (wrong PKCE verifier, tampered state).
import express from 'express';
import { importJWK, compactVerify } from 'jose';
import { oidcClient } from '../src/oidc/client.js';

const PROVIDER = 'http://localhost:4800';      // where LabFlow ID is reachable on the network
const ISSUER_ID = 'https://id.labflow.example'; // its logical issuer (the `iss` claim), from JWT_ISSUER
const CLIENT_PORT = 4810;
const REDIRECT = `http://localhost:${CLIENT_PORT}/callback`;
const client = oidcClient({ clientId: 'labflow-api', redirectUri: REDIRECT, issuer: PROVIDER });

// A signature-only verifier over the provider's JWKS (lesson 4.4 / 8.4) — the client checks iss/aud/exp/nonce itself.
const jwks = await (await fetch(`${PROVIDER}/.well-known/jwks.json`)).json();
const byKid = new Map(jwks.keys.map((k) => [k.kid, k]));
const verifySig = async (token) => {
  try { const h = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString()); await compactVerify(token, await importJWK(byKid.get(h.kid), 'EdDSA')); return true; } catch { return false; }
};

// The client app: /login starts the flow, /callback finishes it. A real RP; here driven by fetch.
const sessions = new Map();
const app = express();
app.get('/login', (req, res) => { const f = client.begin(); sessions.set(f.state, f); res.redirect(f.authUrl); });
app.get('/callback', async (req, res) => {
  const f = sessions.get(req.query.state);
  if (!f) return res.status(400).json({ error: 'unknown_state' });                 // the client checks state it issued (8.3)
  const tok = await (await fetch(`${PROVIDER}/oauth/token`, { method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ grant_type: 'authorization_code', client_id: 'labflow-api', code: req.query.code, redirect_uri: REDIRECT, code_verifier: f.codeVerifier }) })).json();
  if (tok.error) return res.status(400).json({ error: tok.error });
  const v = await client.verifyIdToken(tok.id_token, { expectedIssuer: ISSUER_ID, expectedAudience: 'labflow-api', nonce: f.nonce }, verifySig);
  res.json({ idTokenChecks: v, id_token_claims: JSON.parse(Buffer.from(tok.id_token.split('.')[1], 'base64url')) });
});
const server = app.listen(CLIENT_PORT);

// A provider session for An (the "user" who is logged in at LabFlow ID in their browser).
const login = await fetch(`${PROVIDER}/sign-in`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'an@student.labflow.example', password: 'an-lab-2026' }) });
const cookie = (login.headers.getSetCookie?.() ?? []).filter((c) => c.startsWith('__Host-lfid_ses')).map((c) => c.split(';')[0]).join('; ');

async function userFollows(authUrl, verifier) {
  const a = await fetch(authUrl, { headers: { cookie }, redirect: 'manual' });     // the browser GETs /oauth/authorize with the provider cookie
  const back = a.headers.get('location');                                          // 302 back to the client with ?code&state
  const u = new URL(back);
  return { code: u.searchParams.get('code'), state: u.searchParams.get('state'), back };
}

console.log('1) Discovery — a client reads one document to learn every endpoint:');
const disc = await (await fetch(`${PROVIDER}/.well-known/openid-configuration`)).json();
console.log(`   authorization_endpoint ${disc.authorization_endpoint.replace(PROVIDER, '')}  token_endpoint ${disc.token_endpoint.replace(PROVIDER, '')}`);
console.log(`   code_challenge_methods_supported ${JSON.stringify(disc.code_challenge_methods_supported)}  (S256 only — PKCE required, OAuth 2.1)`);

console.log('\n2) The full login (code + PKCE), driven like a browser:');
const flow = client.begin();
const { code, state } = await userFollows(flow.authUrl);
console.log(`   authorize → code ${code.slice(0, 12)}…  state echoed ${state === new URL(flow.authUrl).searchParams.get('state') ? 'unchanged ✓' : 'CHANGED ✗'}`);
const tok = await (await fetch(`${PROVIDER}/oauth/token`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ grant_type: 'authorization_code', client_id: 'labflow-api', code, redirect_uri: REDIRECT, code_verifier: flow.codeVerifier }) })).json();
const v = await client.verifyIdToken(tok.id_token, { expectedIssuer: ISSUER_ID, expectedAudience: 'labflow-api', nonce: flow.nonce }, verifySig);
console.log(`   token → id_token verified: ${JSON.stringify(v.ok ? { ok: true, sub: v.sub, email: v.email } : v)}`);

console.log('\n3) The parameters are not decoration — each stops an attack:');
// PKCE: a stolen code without the verifier is useless.
const f2 = client.begin();
const r2 = await userFollows(f2.authUrl);
const bad = await (await fetch(`${PROVIDER}/oauth/token`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ grant_type: 'authorization_code', client_id: 'labflow-api', code: r2.code, redirect_uri: REDIRECT, code_verifier: 'wrong-verifier-the-attacker-guessed' }) })).json();
console.log(`   PKCE: code + WRONG verifier → ${JSON.stringify(bad)}  (a stolen code cannot be spent)`);
// nonce: present in the ID token, so a replayed token from another login is caught.
console.log(`   nonce: id_token.nonce matches the client's nonce → replay of an old id_token ⇒ ${JSON.stringify((await client.verifyIdToken(tok.id_token, { expectedIssuer: ISSUER_ID, expectedAudience: 'labflow-api', nonce: 'a-different-nonce' }, verifySig)))}`);
// aud: a token minted for another client is rejected.
console.log(`   aud: same token, expectedAudience 'other-app' ⇒ ${JSON.stringify((await client.verifyIdToken(tok.id_token, { expectedIssuer: ISSUER_ID, expectedAudience: 'other-app', nonce: flow.nonce }, verifySig)))}`);
// redirect_uri: the provider rejects one not on the exact allow-list.
const evil = await fetch(`${PROVIDER}/oauth/authorize?response_type=code&client_id=labflow-api&redirect_uri=${encodeURIComponent('http://evil.example/callback')}&scope=openid&state=x&nonce=n&code_challenge=abc&code_challenge_method=S256`, { headers: { cookie }, redirect: 'manual' });
console.log(`   redirect_uri: an off-list redirect ⇒ HTTP ${evil.status} ${JSON.stringify(await evil.json().catch(() => ({})))}  (no open redirect)`);

server.close();
console.log('\n⇒ LabFlow ID is the provider, LabFlow API the client. The code is single-use and PKCE-bound; state, nonce,');
console.log('  aud and an exact redirect_uri each close one attack; the client checks the ID token with all seven checks.');
