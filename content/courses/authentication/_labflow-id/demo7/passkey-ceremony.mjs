// demo7/passkey-ceremony.mjs — a REAL passkey, created and used by a real Chromium (Playwright virtual authenticator),
// verified by LabFlow ID's src/webauthn over @simplewebauthn/server (lessons 7.4, 7.5). Then the phishing test: the same
// real assertion, re-verified with a different expectedOrigin, FAILS — the one line that kills phishing.
import express from 'express';
import { chromium } from 'playwright';
import { makeWebAuthn } from '../src/webauthn/index.js';

const PORT = 4811;
const RP_ID = 'localhost';
const ORIGIN = `http://localhost:${PORT}`;
const wa = makeWebAuthn({ rpID: RP_ID, origin: ORIGIN });
const db = { challenge: null, credential: null, lastAuth: null };
const user = { id: 'usr_1', email: 'an@student.labflow.example' };

const app = express();
app.use(express.json());
app.get('/', (_req, res) => res.type('html').send(PAGE));
app.post('/reg/options', async (_req, res) => { const o = await wa.registrationOptions(user); db.challenge = o.challenge; res.json(o); });
app.post('/reg/verify', async (req, res) => {
  const v = await wa.verifyRegistration(req.body, db.challenge);
  if (v.verified) db.credential = { id: v.registrationInfo.credential.id, publicKey: Buffer.from(v.registrationInfo.credential.publicKey).toString('base64'), counter: v.registrationInfo.credential.counter };
  res.json({ verified: v.verified });
});
app.post('/auth/options', async (_req, res) => { const o = await wa.authenticationOptions([{ id: db.credential.id }]); db.challenge = o.challenge; res.json(o); });
app.post('/auth/verify', async (req, res) => { db.lastAuth = req.body; const v = await wa.verifyAuthentication(req.body, db.challenge, { id: db.credential.id, publicKey: new Uint8Array(Buffer.from(db.credential.publicKey, 'base64')), counter: db.credential.counter }); res.json({ verified: v.verified }); });

const PAGE = `<!doctype html><title>passkey</title><script>
const b64uToBuf = (s) => Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(s.length/4)*4,'=')), c=>c.charCodeAt(0)).buffer;
const bufToB64u = (b) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\\+/g,'-').replace(/\\//g,'_').replace(/=+$/,'');
const post = (u,b) => fetch(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b||{})}).then(r=>r.json());
async function register() {
  const o = await post('/reg/options');
  o.challenge = b64uToBuf(o.challenge); o.user.id = b64uToBuf(o.user.id);
  if (o.excludeCredentials) o.excludeCredentials.forEach(c=>c.id=b64uToBuf(c.id));
  const cred = await navigator.credentials.create({ publicKey: o });
  const r = cred.response;
  return post('/reg/verify', { id: cred.id, rawId: bufToB64u(cred.rawId), type: cred.type, clientExtensionResults: cred.getClientExtensionResults(),
    response: { clientDataJSON: bufToB64u(r.clientDataJSON), attestationObject: bufToB64u(r.attestationObject), transports: r.getTransports?r.getTransports():[] } });
}
async function authenticate() {
  const o = await post('/auth/options');
  o.challenge = b64uToBuf(o.challenge);
  if (o.allowCredentials) o.allowCredentials.forEach(c=>c.id=b64uToBuf(c.id));
  const cred = await navigator.credentials.get({ publicKey: o });
  const r = cred.response;
  return post('/auth/verify', { id: cred.id, rawId: bufToB64u(cred.rawId), type: cred.type, clientExtensionResults: cred.getClientExtensionResults(),
    response: { clientDataJSON: bufToB64u(r.clientDataJSON), authenticatorData: bufToB64u(r.authenticatorData), signature: bufToB64u(r.signature), userHandle: r.userHandle?bufToB64u(r.userHandle):null } });
}
window.register = register; window.authenticate = authenticate;
</script>`;

const server = app.listen(PORT);
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send('WebAuthn.enable');
await cdp.send('WebAuthn.addVirtualAuthenticator', { options: { protocol: 'ctap2', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true } });
await page.goto(ORIGIN);

console.log('A real Chromium with a virtual authenticator runs the two ceremonies against LabFlow ID:');
const reg = await page.evaluate('register()');
console.log(`  1. register  — navigator.credentials.create → server verifyRegistration: verified=${reg.verified}`);
console.log(`     stored credential id ${db.credential.id.slice(0, 16)}… (public key ${db.credential.publicKey.length} b64 chars, counter ${db.credential.counter})`);
const auth = await page.evaluate('authenticate()');
console.log(`  2. authenticate — navigator.credentials.get → server verifyAuthentication: verified=${auth.verified}`);

console.log('\nThe one line that kills phishing — re-verify the SAME real assertion with a phishing origin/RP ID:');
const good = await wa.verifyAuthentication(db.lastAuth, db.challenge, { id: db.credential.id, publicKey: new Uint8Array(Buffer.from(db.credential.publicKey, 'base64')), counter: db.credential.counter }).then(v => v.verified).catch(() => false);
const evil = await wa.verifyAuthentication(db.lastAuth, db.challenge, { id: db.credential.id, publicKey: new Uint8Array(Buffer.from(db.credential.publicKey, 'base64')), counter: db.credential.counter }, { origin: 'https://evil.example', rpID: 'evil.example' }).then(v => v.verified).catch(() => false);
console.log(`  expectedOrigin = ${ORIGIN}  → verified=${good}`);
console.log(`  expectedOrigin = https://evil.example  → verified=${evil}   (the authenticator signed over the real origin; the signature cannot match a lie)`);

await browser.close();
server.close();
console.log(`\n⇒ a passkey is bound to ${RP_ID}. A phishing page on another origin gets a signature the real server rejects — nothing to steal and replay.`);
