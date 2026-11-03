// demo7/totp-rfc.mjs — LabFlow ID's hand-written TOTP, checked against the RFC 6238 Appendix B test vectors and otplib.
import { totp, verifyTotp, generateSecret, base32Encode } from '../src/totp/index.js';
import { authenticator } from 'otplib';

const rfcSecret = base32Encode(Buffer.from('12345678901234567890'));   // the RFC's ASCII secret, base32-encoded
const vectors = [[59, '94287082'], [1111111109, '07081804'], [1111111111, '14050471'], [1234567890, '89005924'], [2000000000, '69279037'], [20000000000, '65353130']];
console.log('RFC 6238 Appendix B (SHA-1, 8 digits) — our totp() vs the published vector:');
let all = true;
for (const [t, want] of vectors) { const got = totp(rfcSecret, { time: t, digits: 8 }); all &&= got === want; console.log(`  t=${String(t).padStart(11)}  ours ${got}  ${got === want ? '✓ matches RFC' : '✗ want ' + want}`); }
console.log(`  ⇒ all six RFC vectors: ${all ? 'PASS' : 'FAIL'}`);

console.log('\nSame secret, 6 digits — our totp() vs otplib at three fixed times:');
const s = generateSecret();
for (const t of [1700000000, 1700000030, 1700000060]) { const ours = totp(s, { time: t }); authenticator.options = { epoch: t * 1000 }; const lib = authenticator.generate(s); console.log(`  t=${t}  ours ${ours}  otplib ${lib}  ${ours === lib ? '✓' : '✗'}`); }

console.log('\nClock skew — a code from the previous 30s window is still accepted with window=1:');
const now = 1700000055;
for (const w of [-1, 0, 1, 2]) { const code = totp(s, { time: now + w * 30 }); const v = verifyTotp(s, code, { time: now, window: 1 }); console.log(`  code from step ${w >= 0 ? '+' : ''}${w}  → accepted=${v.ok}${v.ok ? ` (offset ${v.offset})` : ' (outside ±1 window)'}`); }
