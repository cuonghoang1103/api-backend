// test/oidc.test.js — the ID-token seven checks (pure) + the PKCE binding in the provider. No network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { verifyIdToken } from '../src/oidc/verify.js';
import { oidcProvider } from '../src/oidc/provider.js';
import { eddsa, newEd25519, decodeJwt } from '../src/jwt/index.js';

const NOW = 1_700_000_000;
const good = { iss: 'https://id.labflow.example', aud: 'labflow-api', exp: NOW + 300, iat: NOW, nonce: 'n1', sub: 'usr_1' };
const ctx = { signatureValid: true, expectedIssuer: 'https://id.labflow.example', expectedAudience: 'labflow-api', nonce: 'n1', now: NOW };

test('verifyIdToken accepts a valid token and returns the subject', () => {
  assert.deepEqual(verifyIdToken(good, ctx), { ok: true, sub: 'usr_1' });
});
test('verifyIdToken enforces all seven checks', () => {
  assert.equal(verifyIdToken(null, ctx).error, 'malformed');
  assert.equal(verifyIdToken(good, { ...ctx, signatureValid: false }).error, 'bad_signature');
  assert.equal(verifyIdToken({ ...good, iss: 'https://evil.example' }, ctx).error, 'bad_iss');
  assert.equal(verifyIdToken({ ...good, aud: 'other' }, ctx).error, 'bad_aud');
  assert.equal(verifyIdToken({ ...good, aud: ['x', 'labflow-api'] }, ctx).ok, true);
  assert.equal(verifyIdToken({ ...good, exp: NOW - 1 }, ctx).error, 'expired');
  assert.equal(verifyIdToken({ ...good, iat: NOW + 3600 }, ctx).error, 'bad_iat');
  assert.equal(verifyIdToken({ ...good, nonce: 'n2' }, ctx).error, 'bad_nonce');
});

test('the provider binds the code to PKCE: the right verifier works, a wrong one does not', async () => {
  const kid = 'ed-test';
  const prov = oidcProvider({ issuer: 'https://id.labflow.example', keyring: { [kid]: eddsa(newEd25519()) }, activeKid: kid });
  const client = { clientId: 'labflow-api', redirectUris: ['http://localhost:4810/callback'] };
  const verifier = randomBytes(32).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const findUser = async () => ({ email: 'an@x', name: 'An' });
  const a = prov.authorize(client, { response_type: 'code', redirect_uri: 'http://localhost:4810/callback', state: 's', nonce: 'n1', scope: 'openid', code_challenge: challenge, code_challenge_method: 'S256' }, 'usr_1');
  assert.ok(a.code);
  const wrong = await prov.token(client, { grant_type: 'authorization_code', code: a.code, redirect_uri: 'http://localhost:4810/callback', code_verifier: 'nope' }, findUser);
  assert.equal(wrong.error, 'invalid_grant');   // the code is now spent too
  const a2 = prov.authorize(client, { response_type: 'code', redirect_uri: 'http://localhost:4810/callback', state: 's', nonce: 'n1', scope: 'openid', code_challenge: challenge, code_challenge_method: 'S256' }, 'usr_1');
  const ok = await prov.token(client, { grant_type: 'authorization_code', code: a2.code, redirect_uri: 'http://localhost:4810/callback', code_verifier: verifier }, findUser);
  assert.ok(ok.id_token);
  assert.equal(decodeJwt(ok.id_token).payload.nonce, 'n1');
});
