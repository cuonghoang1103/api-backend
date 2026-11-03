// demo10/relay.mjs — an Adversary-in-the-Middle phishing relay, and the one factor it cannot relay (Chapter 10, 10.2).
// The attacker runs a reverse proxy on a look-alike domain (login.labflovv.example) that forwards every keystroke to
// the REAL LabFlow ID and forwards the real pages back — so the victim sees a genuine login and even a genuine TOTP
// prompt. Whatever the victim sends that is a REPLAYABLE SECRET (password, OTP code) the relay captures and replays,
// and it keeps the resulting session. A passkey assertion is NOT a replayable secret: WebAuthn signs over the ORIGIN
// the browser is on, and the real RP checks expectedOrigin — so an assertion produced on the phishing origin is
// rejected by the real server. This is "phishing-resistant" (Chapter 7), measured here.
const REAL_ORIGIN = 'https://id.labflow.example';
const PHISH_ORIGIN = 'https://login.labflovv.example';     // look-alike (rn/vv) the victim did not notice

// The real RP. A password/OTP check only looks at the secret's value (replayable). A passkey check also verifies the
// origin the assertion was signed over — the browser puts the TRUE origin in, and the RP demands its own.
function realServerAccepts(factor, presented) {
  if (factor === 'password') return presented.secret === 'corrected horse battery';
  if (factor === 'totp') return presented.code === '123456';                       // valid for this 30s step
  if (factor === 'passkey') return presented.signatureValid && presented.origin === REAL_ORIGIN;  // origin-bound
  return false;
}

// The victim's browser, sitting on the PHISHING origin, produces each factor. The browser stamps the real origin it is
// actually on into a passkey assertion — which, through the relay, is the phishing origin.
function victimBrowserProduces(factor) {
  if (factor === 'password') return { secret: 'corrected horse battery' };
  if (factor === 'totp') return { code: '123456' };
  if (factor === 'passkey') return { signatureValid: true, origin: PHISH_ORIGIN };  // signed over where the browser really is
  return {};
}

function relayAttack(factor) {
  const captured = victimBrowserProduces(factor);          // the relay captures what the victim sends
  const replayedToReal = captured;                          // and replays it verbatim to the real server
  const attackerGetsSession = realServerAccepts(factor, replayedToReal);
  return attackerGetsSession;
}

console.log(`AiTM relay: victim on ${PHISH_ORIGIN}, attacker replays to ${REAL_ORIGIN}\n`);
for (const f of ['password', 'totp', 'passkey']) {
  const stolen = relayAttack(f);
  const note = f === 'passkey'
    ? 'the assertion was signed over the phishing origin; the real RP demands its own origin ⇒ REJECTED'
    : 'a replayable secret: the relay captures it and replays it verbatim ⇒ session stolen';
  console.log(`  ${f.padEnd(9)} → attacker ${stolen ? 'STEALS the session' : 'gets NOTHING'}  (${note})`);
}
console.log('\n⇒ TLS and "look at the URL" do not stop a relay; the victim is on a real TLS connection to the attacker.');
console.log('  Only a factor bound to the ORIGIN — a passkey (WebAuthn, Chapter 7) — survives, because its signature');
console.log('  is over the phishing domain and the real server rejects it. That is what "phishing-resistant" means.');
