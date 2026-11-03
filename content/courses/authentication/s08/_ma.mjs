/**
 * _ma.mjs (Chương 8) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  provider: `// src/oidc/provider.js — LabFlow ID as an OpenID Connect provider (Chapter 8). Authorization-code flow + PKCE only
// (OAuth 2.1: implicit and plain-PKCE are gone). A one-time code is bound to the client, the exact redirect_uri and the
// PKCE challenge; the token endpoint trades it — with the matching verifier — for an access token and a signed ID token.
import { randomBytes, createHash } from 'node:crypto';
import { sign } from '../jwt/index.js';

const s256 = (v) => createHash('sha256').update(String(v ?? '')).digest('base64url');

export function oidcProvider({ issuer, keyring, activeKid, now = () => Date.now(), codeTtlMs = 60_000, idTokenTtlSec = 300 }) {
  const codes = new Map();                                   // code → one-time grant (process-local; Chapter 11 → Redis)

  return {
    // The discovery document a client reads once to learn every endpoint and the algorithms we support.
    discovery() {
      return {
        issuer,
        authorization_endpoint: \`\${issuer}/oauth/authorize\`,
        token_endpoint: \`\${issuer}/oauth/token\`,
        userinfo_endpoint: \`\${issuer}/oauth/userinfo\`,
        jwks_uri: \`\${issuer}/.well-known/jwks.json\`,
        response_types_supported: ['code'],                  // only code — implicit is dead (8.1)
        grant_types_supported: ['authorization_code'],
        id_token_signing_alg_values_supported: ['EdDSA'],
        code_challenge_methods_supported: ['S256'],          // PKCE required; 'plain' deliberately absent (OAuth 2.1)
        scopes_supported: ['openid', 'email', 'profile'],
        subject_types_supported: ['public'],
      };
    },

    // The user is already signed in to the provider (a Chapter 3 session). authorize() mints a one-time code bound to
    // this client, this redirect_uri and this PKCE challenge, and returns where to send the browser back.
    authorize(client, p, userId) {
      if (!client) return { error: 'invalid_client' };
      if (p.response_type !== 'code') return { error: 'unsupported_response_type' };
      if (!client.redirectUris.includes(p.redirect_uri)) return { error: 'invalid_redirect_uri' };  // EXACT match, never prefix (8.3)
      if (p.code_challenge_method !== 'S256' || !p.code_challenge) return { error: 'invalid_request' }; // PKCE mandatory
      const code = 'lfc_' + randomBytes(24).toString('base64url');
      codes.set(code, { clientId: client.clientId, userId, redirectUri: p.redirect_uri, codeChallenge: p.code_challenge, nonce: p.nonce, scope: p.scope ?? 'openid', exp: now() + codeTtlMs });
      const url = new URL(p.redirect_uri);
      url.searchParams.set('code', code);
      if (p.state != null) url.searchParams.set('state', p.state);        // echoed back unchanged — the client checks it (8.3)
      return { code, redirect: url.toString() };
    },

    // Exchange the code for tokens. Everything is re-checked: same client, same redirect_uri, not expired, single-use,
    // and the PKCE verifier must hash to the challenge the code was bound to.
    async token(client, p, findUser) {
      if (p.grant_type !== 'authorization_code') return { error: 'unsupported_grant_type' };
      const rec = codes.get(p.code);
      if (!rec || !client || rec.clientId !== client.clientId) return { error: 'invalid_grant' };
      codes.delete(p.code);                                              // single-use: a replayed code is already gone
      if (now() >= rec.exp) return { error: 'invalid_grant' };           // 60-second life
      if (rec.redirectUri !== p.redirect_uri) return { error: 'invalid_grant' };
      if (s256(p.code_verifier) !== rec.codeChallenge) return { error: 'invalid_grant' };  // the PKCE proof (8.2)
      const user = (await findUser(rec.userId)) ?? { email: '', name: '' };
      const t = Math.floor(now() / 1000);
      const id_token = sign({
        iss: issuer, sub: rec.userId, aud: client.clientId, iat: t, exp: t + idTokenTtlSec,
        ...(rec.nonce ? { nonce: rec.nonce } : {}), email: user.email, name: user.name,
      }, { key: keyring[activeKid], kid: activeKid });
      return { access_token: 'lfa_' + randomBytes(24).toString('base64url'), token_type: 'Bearer', expires_in: idTokenTtlSec, id_token, scope: rec.scope };
    },
  };
}`,
  client: `// src/oidc/client.js — LabFlow API as an OIDC client (relying party), Chapter 8. It starts a login (PKCE verifier +
// state + nonce), then verifies the ID token: the signature against the provider's JWKS, and the claims with the pure
// seven-check core (src/oidc/verify.js, lesson 8.4).
import { randomBytes, createHash } from 'node:crypto';
import { decodeJwt } from '../jwt/index.js';
import { verifyIdToken as checkClaims } from './verify.js';

const s256 = (v) => createHash('sha256').update(v).digest('base64url');

export function oidcClient({ clientId, redirectUri, issuer }) {
  return {
    begin(scope = 'openid email profile') {
      const codeVerifier = randomBytes(32).toString('base64url');
      const state = randomBytes(16).toString('base64url');
      const nonce = randomBytes(16).toString('base64url');
      const authUrl = \`\${issuer}/oauth/authorize?\` + new URLSearchParams({
        response_type: 'code', client_id: clientId, redirect_uri: redirectUri, scope,
        state, nonce, code_challenge: s256(codeVerifier), code_challenge_method: 'S256',
      });
      return { codeVerifier, state, nonce, authUrl };
    },
    // verifySig(token) ⇒ Promise<boolean> validates the signature against the provider's JWKS.
    async verifyIdToken(idToken, ctx, verifySig) {
      let payload;
      try { payload = decodeJwt(idToken).payload; } catch { return { error: 'malformed' }; }
      const signatureValid = await verifySig(idToken);
      const r = checkClaims(payload, { ...ctx, signatureValid });
      return r.ok ? { ok: true, sub: payload.sub, email: payload.email, name: payload.name } : r;
    },
  };
}`,
  verify: `// src/oidc/verify.js — the SEVEN checks a client runs on an ID token (lesson 8.4), as a pure function. The signature
// is checked separately (it needs the provider's JWKS) and the result passed in as \`signatureValid\`; everything else is
// a claim check. Accepting an ID token you did not fully check is how "sign in with…" turns into an auth bypass.
export function verifyIdToken(payload, { signatureValid, expectedIssuer, expectedAudience, nonce, now = Math.floor(Date.now() / 1000) }) {
  if (!payload || typeof payload !== 'object') return { error: 'malformed' };        // 1. it decoded to claims
  if (!signatureValid) return { error: 'bad_signature' };                            // 2. signed by the provider (JWKS)
  if (payload.iss !== expectedIssuer) return { error: 'bad_iss' };                   // 3. from the issuer we expect
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!aud.includes(expectedAudience)) return { error: 'bad_aud' };                  // 4. minted for US
  if (typeof payload.exp !== 'number' || payload.exp <= now) return { error: 'expired' };     // 5. not expired
  if (typeof payload.iat !== 'number' || payload.iat > now + 60) return { error: 'bad_iat' }; // 6. not future-dated
  if (nonce !== undefined && payload.nonce !== nonce) return { error: 'bad_nonce' }; // 7. our nonce (replay defence)
  return { ok: true, sub: payload.sub };
}`,
  store: `// src/oidc/store.js — registered OIDC clients (Chapter 8). redirect_uris is an exact allow-list, never a prefix match.
import { q } from '../db.js';
export const clientStore = {
  async get(clientId) {
    const r = (await q('SELECT * FROM oauth_clients WHERE client_id = $1', [clientId])).rows[0];
    return r ? { clientId: r.client_id, name: r.name, redirectUris: JSON.parse(r.redirect_uris) } : null;
  },
};`,
  sql006: `-- 006_oidc.sql — Chapter 8: LabFlow ID as an OIDC provider. Registered relying parties (clients). Authorization codes
-- are short-lived and single-use, so they live in memory (src/oidc/provider.js), not in a table.
CREATE TABLE oauth_clients (
  client_id     text PRIMARY KEY,
  name          text        NOT NULL,
  redirect_uris text        NOT NULL,              -- JSON array; redirect_uri is matched EXACTLY against this list (8.3)
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- The cross-course client: LabFlow API (the course's API Design project) signs users in via LabFlow ID.
INSERT INTO oauth_clients (client_id, name, redirect_uris) VALUES
  ('labflow-api', 'LabFlow API', '["http://localhost:4810/callback"]');`,
  server08: `// src/server.js — LabFlow ID v0.8 (end of Chapter 8). Chapter 8 makes LabFlow ID an OpenID Connect PROVIDER:
//   discovery, /oauth/authorize (code + PKCE, exact redirect_uri, state), /oauth/token (PKCE verify ⇒ access + ID token), JWKS.
// src/server.js — LabFlow ID v0.7 (end of Chapter 7). Chapter 6 added the account lifecycle; Chapter 7 adds a SECOND factor:
//   TOTP (RFC 6238, src/totp), single-use recovery codes, and passkeys (WebAuthn, src/webauthn over @simplewebauthn).
// src/server.js — LabFlow ID v0.5 (end of Chapter 5). Fixed so far:
//   hole 1 — argon2id in PostgreSQL, measured parameters, upgrade on login (Chapter 2);
//   hole 3 — CSPRNG session ids, only their SHA-256 stored (Chapter 1);
//   hole 4 — sessions end: idle 30 min, absolute 12 h, sign-out, sign-out-everywhere (lesson 3.1);
//   hole 5 — the session travels in a __Host- cookie JavaScript cannot read, never in a JSON body (3.2); CSRF checked (3.4).
// Chapter 4: LabFlow ID issues short-lived JWT access tokens (EdDSA, kid, 7 claims) and a public JWKS (lesson 4.x).
// Chapter 5: a long-lived REFRESH token, in a family, in a __Host- cookie; rotation + reuse detection + a devices page.
// New in Chapter 6 (closes the sign-up half of hole 2): the account lifecycle. A new account is UNVERIFIED until it proves
//   its email (one-time token, 30 min); password reset uses a one-time token (15 min) and revokes every session + family;
//   /forgot-password and /sign-up never reveal whether an email exists (same response, same work — lesson 6.4); changing
//   the email un-verifies it; deleting the account revokes everything. Still open: hole 6, unlimited guessing (Chapter 10).
import express from 'express';
import { users } from './users.js';
import { hashPassword, verifyPassword, checkNewPassword, loadBlocklist, pwnedCount, signIn } from './passwords/index.js';
import { sessionLayer, pgStore } from './sessions/index.js';
import { accessTokens, eddsa, newEd25519, ACCESS_TTL_SEC } from './jwt/index.js';
import { publicJwks } from './jwt/jwks.js';
import { refreshLayer, pgStore as refreshStore } from './refresh/index.js';
import { lifecycle, pgStore as lifecycleStore } from './lifecycle/index.js';
import { sendEmail } from './email/index.js';
import { normalizeEmail } from './email/normalize.js';
import { generateSecret, verifyTotp, otpauthURI } from './totp/index.js';
import { generateRecoveryCodes, consumeRecoveryCode, recoveryDigest } from './totp/recovery.js';
import { totpStore, recoveryStore, passkeyStore } from './mfa/store.js';
import { makeWebAuthn } from './webauthn/index.js';
import { oidcProvider } from './oidc/provider.js';
import { clientStore } from './oidc/store.js';
import { tokenDigest } from './crypto/index.js';
import { log, requestLog } from './log.js';

const BLOCKLIST = loadBlocklist();
const sessions = sessionLayer({ store: pgStore, touchEveryMs: Number(process.env.TOUCH_EVERY_MS ?? 60e3) });
const refresh = refreshLayer({ store: refreshStore, graceMs: Number(process.env.REFRESH_GRACE_MS ?? 10e3) });
const life = lifecycle({ store: lifecycleStore });

const ACTIVE_KID = process.env.JWT_KID ?? 'ed-2026-11';
const keyring = { [ACTIVE_KID]: eddsa(newEd25519()) };
const ISSUER = process.env.JWT_ISSUER ?? 'https://id.labflow.example';
const AUDIENCE = process.env.JWT_AUDIENCE ?? 'labflow-api';
const tokens = accessTokens({ keyring, activeKid: ACTIVE_KID, issuer: ISSUER, audience: AUDIENCE });

const RT_COOKIE = '__Host-lfid_rt';                               // the refresh token, HttpOnly, never read by JavaScript (4.5)
const RT_ATTRS = 'Path=/; HttpOnly; Secure; SameSite=Lax';
const setRefreshCookie = (res, token) => res.append('Set-Cookie', \`\${RT_COOKIE}=\${token}; \${RT_ATTRS}; Max-Age=\${30 * 24 * 3600}\`);
const clearRefreshCookie = (res) => res.append('Set-Cookie', \`\${RT_COOKIE}=; \${RT_ATTRS}; Max-Age=0\`);
function readCookie(header, name) {
  for (const part of String(header ?? '').split(';')) { const i = part.indexOf('='); if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim(); }
  return null;
}

const app = express();
app.use(requestLog);
app.use(express.json({ limit: '8kb' }));
app.use(sessions.load);   // req.session = the row, or null
app.use(sessions.csrf);   // POST/PUT/PATCH/DELETE must come from our own origin

const needSession = (req, res, next) => (req.session ? next() : res.status(401).json({ error: 'Not signed in' }));
const accessFor = (u) => tokens.issue(u.id, { role: u.role });

// lesson 6.1, 6.4: register. The email is normalised once (NFKC + lowercase) and the UNIQUE index — NOT a check-then-
// insert — decides uniqueness: we just INSERT and catch the duplicate (PG 23505). On a duplicate we do NOT say "taken";
// we hash anyway (same timing) and email "you already have an account", so sign-up cannot enumerate accounts.
app.post('/sign-up', async (req, res) => {
  const { email, password, name } = req.body ?? {};
  const problems = checkNewPassword(password, { email, blocklist: BLOCKLIST });
  if (!problems.length) {
    const seen = await pwnedCount(password);
    if (seen > 0) problems.push('BREACHED');
    if (seen === null) log.warn('pwned-passwords check unavailable; accepted without it');
  }
  if (problems.length) return res.status(422).json({ error: 'WEAK_PASSWORD', problems });
  const normEmail = normalizeEmail(email);
  if (!normEmail) return res.status(422).json({ error: 'BAD_EMAIL' });
  const passwordHash = await hashPassword(password);   // hash in BOTH outcomes, so timing never reveals whether the email is taken
  let user = null;
  try {
    user = await users.create({ email: normEmail, name: name ?? '', passwordHash });  // let the UNIQUE index be the check
  } catch (e) {
    if (e?.code !== '23505') throw e;                  // 23505 = unique_violation: the address already exists (the race-safe path)
  }
  if (user) {
    const { token } = await life.issueToken(user.id, 'verify_email');
    sendEmail({ to: normEmail, subject: 'Verify your LabFlow email',
      text: \`Welcome. Confirm this address within 30 minutes: https://id.labflow.example/verify?token=\${token}\` });
  } else {
    sendEmail({ to: normEmail, subject: 'You already have a LabFlow account',
      text: 'Someone tried to register with this address. If it was you, sign in or reset your password — there is nothing else to do.' });
  }
  res.status(202).json({ ok: true, message: 'Check your email to finish signing up.' });   // same response either way
});

// lesson 6.2: email verification. GET is SAFE — it only shows a confirm page, because scanners and prefetchers GET
// links and must not burn the one-time token. POST consumes it.
app.get('/verify-email', (req, res) => {
  const token = String(req.query.token ?? '');
  res.type('html').send(\`<!doctype html><title>Confirm your email</title>
    <form method="POST" action="/verify-email"><input type="hidden" name="token" value="\${token.replace(/[^A-Za-z0-9_-]/g, '')}">
    <button>Confirm my email</button></form>\`);   // GET consumes nothing; only this click (a POST) does
});
app.post('/verify-email', async (req, res) => {
  const r = await life.consumeToken('verify_email', req.body?.token);
  if (r.error) return res.status(400).json({ error: r.error });
  await users.markEmailVerified(r.userId);
  res.json({ ok: true, verified: true });
});

// lesson 6.3, 6.4: ask for a password reset. Same response AND same timing (the insert + email are not awaited).
app.post('/forgot-password', async (req, res) => {
  await life.requestPasswordReset(users, req.body?.email, { send: sendEmail });
  res.json({ ok: true, message: 'If an account exists for that address, a reset link is on its way.' });
});
// lesson 6.4 TEACHING FOIL (never ship): the same endpoint, but it AWAITS the token insert + email send — so a real
// account is measurably slower than a fake one, and the identical wording above no longer hides which emails exist.
app.post('/forgot-password-naive', async (req, res) => {
  await life.requestPasswordReset(users, req.body?.email, { send: sendEmail, sync: true });
  res.json({ ok: true, message: 'If an account exists for that address, a reset link is on its way.' });
});

// lesson 6.3: consume a reset token, set the new password, and end every session and refresh family (5.3).
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body ?? {};
  const r = await life.consumeToken('reset_password', token);
  if (r.error) return res.status(400).json({ error: r.error });
  const u = await users.findById(r.userId);
  const problems = checkNewPassword(newPassword, { email: u.email, blocklist: BLOCKLIST });
  if (problems.length) return res.status(422).json({ error: 'WEAK_PASSWORD', problems });
  await users.updateHash(u.id, await hashPassword(newPassword));
  await sessions.endAll(u.id);
  await refresh.revokeAll(u.id);
  res.json({ ok: true, message: 'Password reset. Sign in with your new password.' });
});

app.post('/sign-in', async (req, res) => {
  const { email, password } = req.body ?? {};
  const { user, error } = await signIn(users, email, password);
  if (error) return res.status(401).json({ error: 'Email or password is incorrect' });
  const common = BLOCKLIST.has(password.normalize('NFC').toLowerCase());
  if (common) await users.flagMustChange(user.id);
  await sessions.start(req, res, user.id);                         // the web session (Chapter 3), in its own cookie
  const { token } = await refresh.issue(user.id, { ip: req.ip ?? null, ua: req.headers['user-agent'] ?? null }); // a new family (device)
  setRefreshCookie(res, token);
  res.json({ ok: true, access_token: accessFor(user), token_type: 'Bearer', expires_in: ACCESS_TTL_SEC, mustChangePassword: user.mustChangePassword || common });
});

// lesson 5.1, 5.2: exchange the refresh token for a fresh access token, rotating the refresh token every time.
app.post('/refresh', async (req, res) => {
  const presented = readCookie(req.headers.cookie, RT_COOKIE);
  if (!presented) return res.status(401).json({ error: 'NO_REFRESH_TOKEN' });
  const r = await refresh.rotate(presented, { ip: req.ip ?? null, ua: req.headers['user-agent'] ?? null });
  if (r.error) {
    clearRefreshCookie(res);                                       // a bad refresh token is cleared, whatever the reason
    if (r.error === 'REUSE_DETECTED') log.warn({ familyId: r.familyId }, 'refresh token reuse — family revoked');
    return res.status(401).json({ error: r.error });
  }
  const u = await users.findById(r.row.userId);
  setRefreshCookie(res, r.token);                                  // the rotated refresh token
  res.json({ ok: true, access_token: accessFor(u), token_type: 'Bearer', expires_in: ACCESS_TTL_SEC, ...(r.raced ? { raced: true } : {}) });
});

app.get('/me', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId);
  res.json({ id: u.id, email: u.email, name: u.name, role: u.role });
});

// lesson 5.4: the devices page — one row per live family, with "this is you?" fields and a revoke button.
app.get('/me/devices', needSession, async (req, res) => {
  res.json({ devices: await refresh.listDevices(req.session.userId) });
});
app.post('/me/devices/revoke', needSession, async (req, res) => {
  const familyId = String(req.body?.familyId ?? '');
  const revoked = await refresh.revokeDevice(req.session.userId, familyId);
  res.json({ ok: true, revoked });
});

// lesson 4.x compatibility: also mint an access token from the session (web clients without a stored refresh token).
app.post('/token', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId);
  res.json({ access_token: accessFor(u), token_type: 'Bearer', expires_in: ACCESS_TTL_SEC, scope: AUDIENCE });
});

app.get('/.well-known/jwks.json', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.json(await publicJwks(keyring));
});

// lesson 6.5: change the email. The new address starts UN-verified (users.updateEmail clears it) and must be proven.
app.post('/me/email', needSession, async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  if (!email) return res.status(422).json({ error: 'BAD_EMAIL' });
  await users.updateEmail(req.session.userId, email);
  const { token } = await life.issueToken(req.session.userId, 'verify_email');
  sendEmail({ to: email, subject: 'Verify your new LabFlow email',
    text: \`Confirm your new address within 30 minutes: https://id.labflow.example/verify?token=\${token}\` });
  res.json({ ok: true, email, verificationSent: true });
});

// lesson 6.5: end the account. Re-authenticate, mark it deleted, and revoke every session and refresh family.
app.post('/me/delete', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId);
  if (!(await verifyPassword(u.passwordHash, String(req.body?.password ?? ''))).ok) return res.status(403).json({ error: 'REAUTH_FAILED' });
  await users.setStatus(u.id, 'deleted');
  await sessions.endAll(u.id);
  await refresh.revokeAll(u.id);
  await sessions.end(req, res);
  clearRefreshCookie(res);
  res.json({ ok: true, deleted: true });
});

// lesson 3.3 + 5.3: change the password, end every session AND revoke every refresh family, start fresh.
app.post('/me/password', needSession, async (req, res) => {
  const { current, next: pw } = req.body ?? {};
  const u = await users.findById(req.session.userId);
  if (!(await verifyPassword(u.passwordHash, String(current ?? ''))).ok) return res.status(403).json({ error: 'REAUTH_FAILED' });
  const problems = checkNewPassword(pw, { email: u.email, blocklist: BLOCKLIST });
  if (problems.length) return res.status(422).json({ error: 'WEAK_PASSWORD', problems });
  await users.updateHash(u.id, await hashPassword(pw));
  const endedSessions = await sessions.endAll(u.id);
  const revokedFamilies = await refresh.revokeAll(u.id);
  await sessions.start(req, res, u.id);
  const { token } = await refresh.issue(u.id, { ip: req.ip ?? null, ua: req.headers['user-agent'] ?? null });
  setRefreshCookie(res, token);
  res.json({ ok: true, signedOutSessions: endedSessions, revokedFamilies });
});

// lesson 5.3: sign-out ends this session and revokes this device's refresh family.
app.post('/sign-out', async (req, res) => {
  const presented = readCookie(req.headers.cookie, RT_COOKIE);
  if (presented) { const rec = await refreshStore.getByDigest(tokenDigest(presented)); if (rec) await refresh.revokeFamily(rec.familyId); }
  clearRefreshCookie(res);
  await sessions.end(req, res);
  res.json({ ok: true });
});
app.post('/sign-out-everywhere', needSession, async (req, res) => {
  const revokedFamilies = await refresh.revokeAll(req.session.userId);
  clearRefreshCookie(res);
  res.json({ ok: true, ended: await sessions.endAll(req.session.userId), revokedFamilies });
});

// ── Chapter 7: a second factor ─────────────────────────────────────────────────────────────────────────────────────
// lesson 7.3: enroll TOTP. begin ⇒ a secret + otpauth URI (unconfirmed); confirm ⇒ prove one code, then recovery codes.
app.post('/mfa/totp/begin', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId);
  const secret = generateSecret();
  await totpStore.put(u.id, secret);                                   // stored UNCONFIRMED until a code is proven
  res.json({ secret, otpauth: otpauthURI({ secret, label: u.email, issuer: 'LabFlow ID' }) });
});
app.post('/mfa/totp/confirm', needSession, async (req, res) => {
  const t = await totpStore.get(req.session.userId);
  if (!t) return res.status(400).json({ error: 'NO_ENROLLMENT' });
  if (!verifyTotp(t.secret, req.body?.code, { window: 1 }).ok) return res.status(401).json({ error: 'BAD_CODE' });
  await totpStore.confirm(req.session.userId);
  const { codes, digests } = generateRecoveryCodes(10);               // shown ONCE, stored as digests (lesson 7.3)
  await recoveryStore.replaceAll(req.session.userId, digests);
  res.json({ ok: true, enabled: true, recoveryCodes: codes });        // the only time the codes are returned
});
// lesson 7.1/7.3: the step-up check at login — a TOTP code, or a single-use recovery code when the phone is gone.
app.post('/mfa/totp/verify', needSession, async (req, res) => {
  const t = await totpStore.get(req.session.userId);
  if (!t?.confirmedAt) return res.status(400).json({ error: 'NOT_ENABLED' });
  if (req.body?.code && verifyTotp(t.secret, req.body.code, { window: 1 }).ok) return res.json({ ok: true, via: 'totp' });
  if (req.body?.recovery) {
    const live = await recoveryStore.liveDigests(req.session.userId);
    const r = consumeRecoveryCode(req.body.recovery, live.map((x) => x.digest));
    if (r.ok) { await recoveryStore.markUsed(live[r.index].id); return res.json({ ok: true, via: 'recovery', remaining: r.remaining.length }); }
  }
  res.status(401).json({ error: 'BAD_CODE' });
});

// lesson 7.4/7.5: passkeys. Two ceremonies; the RP ID + expected origin bind every assertion to this site.
const WA = makeWebAuthn({ rpID: process.env.RP_ID ?? 'localhost', origin: process.env.RP_ORIGIN ?? \`http://localhost:\${process.env.PORT ?? 4800}\` });
const waChallenges = new Map();                                        // userId → the challenge we just issued (demo: in memory)
app.post('/webauthn/register/options', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId);
  const existing = (await passkeyStore.listForUser(u.id)).map((k) => ({ id: k.id, transports: k.transports }));
  const options = await WA.registrationOptions(u, existing);
  waChallenges.set('reg:' + u.id, options.challenge);
  res.json(options);
});
app.post('/webauthn/register/verify', needSession, async (req, res) => {
  const v = await WA.verifyRegistration(req.body, waChallenges.get('reg:' + req.session.userId)).catch(() => ({ verified: false }));
  if (!v.verified) return res.status(400).json({ error: 'VERIFY_FAILED' });
  const c = v.registrationInfo.credential;
  await passkeyStore.add(req.session.userId, { id: c.id, publicKey: Buffer.from(c.publicKey).toString('base64'), counter: c.counter, transports: req.body?.response?.transports });
  res.json({ ok: true, registered: true });
});
app.post('/webauthn/auth/options', async (req, res) => {
  const u = await users.findByEmail(normalizeEmail(req.body?.email) ?? '');
  const keys = u ? await passkeyStore.listForUser(u.id) : [];
  const options = await WA.authenticationOptions(keys.map((k) => ({ id: k.id, transports: k.transports })));
  if (u) waChallenges.set('auth:' + u.id, options.challenge);
  res.json(options);                                                   // same shape whether or not the user exists (6.4)
});
app.post('/webauthn/auth/verify', async (req, res) => {
  const stored = await passkeyStore.getById(req.body?.id ?? '');
  if (!stored) return res.status(400).json({ error: 'UNKNOWN_CREDENTIAL' });
  const v = await WA.verifyAuthentication(req.body, waChallenges.get('auth:' + stored.userId),
    { id: stored.id, publicKey: new Uint8Array(Buffer.from(stored.publicKey, 'base64')), counter: stored.counter }).catch(() => ({ verified: false }));
  if (!v.verified) return res.status(401).json({ error: 'VERIFY_FAILED' });
  await passkeyStore.bumpCounter(stored.id, v.authenticationInfo.newCounter);   // clone detection (lesson 7.5)
  res.json({ ok: true, userId: stored.userId });
});

// ── Chapter 8: LabFlow ID is an OpenID Connect provider ─────────────────────────────────────────────────────────────
const oidc = oidcProvider({ issuer: ISSUER, keyring, activeKid: ACTIVE_KID });
app.get('/.well-known/openid-configuration', (req, res) => res.json(oidc.discovery()));   // lesson 8.1: discovery
// lesson 8.2: the authorization endpoint. The user must already be signed in here (a Chapter 3 session) — that session,
// not anything the client sends, is who the ID token will be about. We mint a one-time code and 302 back to the client.
app.get('/oauth/authorize', needSession, async (req, res) => {
  const client = await clientStore.get(String(req.query.client_id ?? ''));
  const r = oidc.authorize(client, req.query, req.session.userId);
  if (r.error) {                                                             // an invalid client/redirect must NOT redirect (open-redirect)
    if (client && r.error === 'invalid_redirect_uri') return res.status(400).json({ error: r.error });
    if (!client) return res.status(400).json({ error: r.error });
    return res.redirect(\`\${req.query.redirect_uri}?error=\${r.error}&state=\${encodeURIComponent(req.query.state ?? '')}\`);
  }
  res.redirect(r.redirect);
});
// lesson 8.2: the token endpoint. Server-to-server; trades the code + PKCE verifier for an access token + ID token.
app.post('/oauth/token', async (req, res) => {
  const client = await clientStore.get(String(req.body?.client_id ?? ''));
  const p = { ...(req.body ?? {}), grant_type: req.body?.grant_type ?? 'authorization_code' };
  const out = await oidc.token(client, p, (id) => users.findById(id));
  if (out.error) return res.status(400).json({ error: out.error });
  res.json(out);
});

app.use((err, req, res, next) => res.status(err.status ?? 500).json({ error: err.type ?? 'INTERNAL' }));

const port = Number(process.env.PORT ?? 4800);
app.listen(port, () => log.info(\`LabFlow ID v0.8 on http://localhost:\${port} (JWKS kid \${ACTIVE_KID})\`));`,
  grader8: `// scripts/cham-lab-8.mjs — grader of Lab 8 (LabFlow API's ID-token check). 6 checks, 10 points, pass = 7.
// Usage: node scripts/cham-lab-8.mjs <folder with index.js>
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const m = await import(pathToFileURL(path.resolve(process.argv[2] ?? 'lab8/my', 'index.js')).href);
const NOW = 1_700_000_000;
const good = { iss: 'https://id.labflow.example', aud: 'labflow-api', exp: NOW + 300, iat: NOW, nonce: 'n1', sub: 'usr_1' };
const ctx = { signatureValid: true, expectedIssuer: 'https://id.labflow.example', expectedAudience: 'labflow-api', nonce: 'n1', now: NOW };
const v = (p, c = {}) => m.verifyIdToken(p, { ...ctx, ...c });

const results = [];
const expect = (cond, why) => { if (!cond) throw Object.assign(new Error(why), { name: 'Expected' }); };
async function check(name, points, fn) { let why = ''; try { why = (await fn()) || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : \`threw \${e?.name}: \${String(e?.message).split('\\n')[0]}\`; } results.push({ name, points, ok: !why, why }); }

await check('T1 a valid token is accepted', 1.5, async () => { const r = v(good); expect(r.ok === true, 'a fully valid token must return { ok: true }'); expect(r.sub === 'usr_1', 'it should return the subject'); });
await check('T2 a bad signature is rejected (the critical one)', 2, async () => { expect(v(good, { signatureValid: false }).error === 'bad_signature', 'signatureValid:false must give bad_signature — a forged token must not be accepted'); });
await check('T3 the wrong issuer is rejected', 1.5, async () => { expect(v({ ...good, iss: 'https://evil.example' }).error === 'bad_iss', 'a token from another issuer must give bad_iss'); });
await check('T4 the wrong audience is rejected (string or array aud)', 2, async () => {
  expect(v({ ...good, aud: 'other-app' }).error === 'bad_aud', 'a token minted for another client must give bad_aud');
  expect(v({ ...good, aud: ['x', 'labflow-api'] }).ok === true, 'an array aud containing our id must be accepted');
});
await check('T5 expired and future-dated are rejected', 1.5, async () => {
  expect(v({ ...good, exp: NOW - 1 }).error === 'expired', 'an expired token must give expired');
  expect(v({ ...good, iat: NOW + 3600 }).error === 'bad_iat', 'a future-dated token must give bad_iat');
});
await check('T6 a wrong nonce is rejected; malformed never crashes', 1.5, async () => {
  expect(v({ ...good, nonce: 'n2' }).error === 'bad_nonce', 'a token whose nonce is not ours must give bad_nonce (replay)');
  expect(v(null).error === 'malformed', 'a null payload must give malformed, not a crash');
});

const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(\`Lab 8 — \${path.relative(process.cwd(), path.resolve(process.argv[2] ?? 'lab8/my', 'index.js'))}\`);
for (const r of results) console.log(\`\${r.ok ? '✓' : '✗'} \${r.name.padEnd(56)} \${r.ok ? r.points : 0}/\${r.points}\${r.ok ? '' : \`\\n    ↳ \${r.why}\`}\`);
console.log(\`TOTAL \${total}/10 — \${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}\`);
process.exit(total >= 7 ? 0 : 1);`,
  yeu8: `// lab8/yeu/index.js — a first attempt that "logs the user in": it checks the issuer and the expiry, which is enough for
// the happy path. But it never checks the signature (so a forged token is accepted), never checks the audience (so a
// token minted for another client works here), and never checks the nonce (so an old token can be replayed).
export function verifyIdToken(payload, { expectedIssuer, now = Math.floor(Date.now() / 1000) }) {
  if (!payload) return { error: 'malformed' };
  if (payload.iss !== expectedIssuer) return { error: 'bad_iss' };
  if (payload.exp <= now) return { error: 'expired' };
  return { ok: true, sub: payload.sub };   // BUG: no signature, no audience, no nonce check
}`,
};
export const OUT = {
  '81-oidc-flow': `$ node demo8/oidc-flow.mjs
1) Discovery — a client reads one document to learn every endpoint:
   authorization_endpoint https://id.labflow.example/oauth/authorize  token_endpoint https://id.labflow.example/oauth/token
   code_challenge_methods_supported ["S256"]  (S256 only — PKCE required, OAuth 2.1)

2) The full login (code + PKCE), driven like a browser:
   authorize → code lfc_Eg48341J…  state echoed unchanged ✓
   token → id_token verified: {"ok":true,"sub":"usr_1","email":"an@student.labflow.example"}

3) The parameters are not decoration — each stops an attack:
   PKCE: code + WRONG verifier → {"error":"invalid_grant"}  (a stolen code cannot be spent)
   nonce: id_token.nonce matches the client's nonce → replay of an old id_token ⇒ {"error":"bad_nonce"}
   aud: same token, expectedAudience 'other-app' ⇒ {"error":"bad_aud"}
   redirect_uri: an off-list redirect ⇒ HTTP 400 {"error":"invalid_redirect_uri"}  (no open redirect)

⇒ LabFlow ID is the provider, LabFlow API the client. The code is single-use and PKCE-bound; state, nonce,
  aud and an exact redirect_uri each close one attack; the client checks the ID token with all seven checks.`,
  'lab-bat-dau': `$ node scripts/cham-lab-8.mjs lab8/starter
Lab 8 — lab8/starter/index.js
✗ T1 a valid token is accepted                             0/1.5
    ↳ it should return the subject
✗ T2 a bad signature is rejected (the critical one)        0/2
    ↳ signatureValid:false must give bad_signature — a forged token must not be accepted
✗ T3 the wrong issuer is rejected                          0/1.5
    ↳ a token from another issuer must give bad_iss
✗ T4 the wrong audience is rejected (string or array aud)  0/2
    ↳ a token minted for another client must give bad_aud
✗ T5 expired and future-dated are rejected                 0/1.5
    ↳ an expired token must give expired
✗ T6 a wrong nonce is rejected; malformed never crashes    0/1.5
    ↳ a token whose nonce is not ours must give bad_nonce (replay)
TOTAL 0/10 — NOT YET (pass = 7)`,
  'lab-npm-test': `$ npm test 2>&1 | grep -v 'npm notice'

> labflow-id@0.5.0 test
> node --test --test-reporter=spec "test/**/*.test.js"

✔ newToken: prefix + 43 base64url chars, and checks its arguments (0.694667ms)
✔ tokenDigest is SHA-256 hex (0.29825ms)
✔ safeEqual: equal, different, different lengths, not strings (0.195625ms)
✔ signed value: round trip, tampering, expiry boundary (0.350042ms)
✔ signed value: key rotation and malformed input (0.173625ms)
✔ redact keeps only allowed keys, deeply (0.403958ms)
✔ issue + verify: round trip with the seven claims (1.456709ms)
✔ alg: none is rejected (algorithm comes from the key, not the header) (0.340416ms)
✔ HS/RS confusion is rejected (public key used as an HMAC secret) (0.909084ms)
✔ unknown or missing kid is rejected (0.200292ms)
✔ tampered payload is rejected (signature covers header.payload) (0.33625ms)
✔ claims: iss, aud, sub, exp, nbf, iat, jti each enforced (1.4025ms)
✔ exp boundary and clock skew (0.591833ms)
✔ revocation by jti (0.331083ms)
✔ key rotation: two live keys verify, a dropped key does not (0.521666ms)
✔ interop with jose (both directions) (6.784166ms)
✔ one-time token: issue and consume round trip (1.307542ms)
✔ single-use: a consumed token is rejected the second time (0.207375ms)
✔ purpose-bound: a reset token cannot verify an email, and vice versa (0.113708ms)
✔ expiry: a reset token is dead after 15 minutes, a verify token after 30 (0.424667ms)
✔ an unknown token is INVALID, never a crash (0.140125ms)
✔ requestPasswordReset emails only a real, active account (0.189666ms)
✔ requestPasswordReset does not email a deleted account (0.142083ms)
✔ verifyIdToken accepts a valid token and returns the subject (0.846667ms)
✔ verifyIdToken enforces all seven checks (0.101208ms)
✔ the provider binds the code to PKCE: the right verifier works, a wrong one does not (2.06275ms)
✔ hash is argon2id with the measured parameters and a fresh salt (149.789ms)
✔ NFC: precomposed and decomposed Vietnamese verify the same (153.875958ms)
✔ bcrypt verifies and asks for a rehash; a wrong password never does (204.445584ms)
✔ policy: length, blocklist, context — no composition rules (0.712583ms)
✔ signIn: one answer for both failures, upgrade on success (362.910667ms)
✔ issue + rotate: a fresh token each time, same family (1.141208ms)
✔ reuse of a rotated token revokes the whole family (0.399958ms)
✔ the refresh race: the same token rotated twice within grace returns the same child (0.189291ms)
✔ outside the grace window, the same second use is treated as theft (0.11825ms)
✔ invalid, expired and revoked tokens are rejected without flagging theft (0.201792ms)
✔ device list and revocation (0.237333ms)
✔ a rotated family still appears as one device (not one per rotation) (0.248625ms)
✔ cookie: __Host- prefix, HttpOnly, Secure, SameSite=Lax, Path=/ (1.036167ms)
✔ sign-in replaces a planted session (fixation) (0.337125ms)
✔ idle 30 min and absolute 12 h (0.841ms)
✔ csrf: cross-site and foreign Origin get 403; same-origin and non-browser clients pass (0.136667ms)
✔ HOTP matches the RFC 4226 test vectors (1.197625ms)
✔ TOTP matches the RFC 6238 test vectors (SHA-1, 8 digits) (0.339ms)
✔ verifyTotp accepts ±1 step of skew and rejects beyond (0.353791ms)
✔ recovery codes are single-use and stored only as digests (1.595709ms)
ℹ tests 46
ℹ suites 0
ℹ pass 46
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1022.52025`,
  'lab-tham-khao': `$ node scripts/cham-lab-8.mjs lab8/tham-khao
Lab 8 — lab8/tham-khao/index.js
✓ T1 a valid token is accepted                             1.5/1.5
✓ T2 a bad signature is rejected (the critical one)        2/2
✓ T3 the wrong issuer is rejected                          1.5/1.5
✓ T4 the wrong audience is rejected (string or array aud)  2/2
✓ T5 expired and future-dated are rejected                 1.5/1.5
✓ T6 a wrong nonce is rejected; malformed never crashes    1.5/1.5
TOTAL 10/10 — PASS`,
  'lab-yeu': `$ node scripts/cham-lab-8.mjs lab8/yeu
Lab 8 — lab8/yeu/index.js
✓ T1 a valid token is accepted                             1.5/1.5
✗ T2 a bad signature is rejected (the critical one)        0/2
    ↳ signatureValid:false must give bad_signature — a forged token must not be accepted
✓ T3 the wrong issuer is rejected                          1.5/1.5
✗ T4 the wrong audience is rejected (string or array aud)  0/2
    ↳ a token minted for another client must give bad_aud
✗ T5 expired and future-dated are rejected                 0/1.5
    ↳ a future-dated token must give bad_iat
✗ T6 a wrong nonce is rejected; malformed never crashes    0/1.5
    ↳ a token whose nonce is not ours must give bad_nonce (replay)
TOTAL 3/10 — NOT YET (pass = 7)`,
};
