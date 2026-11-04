/**
 * nfd-06-4 — Networking for Developers, bài 6.4 "Chẩn đoán lỗi TLS" (slug netdev-6-4-loi-tls).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c64-*.out.txt).
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-06-4', code: 'NFD 6.4', title: 'Diagnosing TLS errors', sub: 'Networking for Developers · Chapter 6' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 6 — TLS', bai: '6.4' }, [
  { cover: true, t: 'Diagnosing TLS errors', sub: 'Each failure has one unmistakable message —<br>read it, don’t guess', nhan: 'Chapter 6 · Lesson 6.4' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The four TLS errors you will actually meet, each with its exact message</li>
<li>A <b>symptom → cause → fix</b> table you can keep</li>
<li>Why “it works on one machine but not another” is usually <b>time or trust store</b></li>
<li><b>Cloudflare Full vs Full (strict)</b>: what “encrypted but not verified” means</li>
<li><b>mTLS</b> in one minute: when the client also presents a certificate</li>
</ul>` },

  { t: 'Expired, and not yet valid', giua: true, body: `
${term(ra('c64-expired', 'curl', 1, { boLenh: true }), { sm: true, title: 'notAfter in the past' })}
${term(ra('c64-notyet', 'curl', 1, { boLenh: true }), { sm: true, title: 'notBefore in the future (or your clock is wrong)' })}
${box('', '<b>certificate has expired (10)</b>: renewal failed — the number-one HTTPS outage. <b>certificate is not yet valid (9)</b>: the cert is fine, but <b>your machine’s clock is wrong</b>. Same check, two causes — the fix is different.', 'do2')}` },

  { t: 'Wrong name, and self-signed', giua: true, body: `
${term(ra('c64-name', 'curl', 1, { boLenh: true }), { sm: true, title: 'cert is for other.test, you asked labflow.test' })}
${term(ra('c64-selfsigned', 'curl', 1, { boLenh: true }), { sm: true, title: 'no CA — signed by itself' })}
${box('', '<b>no alternative certificate subject name matches</b>: the SAN does not include the host you requested (wrong vhost, wrong cert, a bare IP). <b>self-signed certificate (18)</b>: it chains to no trusted root — a dev cert in production, or a proxy intercepting you.', 'do2')}` },

  { t: 'The diagnosis table', giua: true, body: `
${bang(['curl says', 'Cause', 'Fix'], [
    ['certificate has expired (10)', 'renewal failed', 'renew now; fix auto-renew + alerting'],
    ['not yet valid (9)', '<b>client clock is wrong</b>', 'fix the machine’s time (NTP)'],
    ['subject name does not match', 'SAN missing the host', 'issue a cert with the right SAN / fix the vhost'],
    ['self-signed certificate (18)', 'no trusted root in the chain', 'use a real CA; or trust the root deliberately'],
    ['unable to get local issuer (20)', 'missing intermediate (6.3)', 'serve the full chain'],
  ], { fs: 18 })}
${box('', 'The exact message <b>is</b> the diagnosis. Read the <code class="i">curl: (NN)</code> number and the text before touching anything.', 'lam')}` },

  { t: '“Works here, fails there”', giua: true, body: `
${steps([
    'Fails on <b>one machine</b> only → its <b>clock</b> is wrong (not-yet-valid / expired on a skewed clock)',
    'Fails for <b>old devices / Java / curl</b> but not Chrome → <b>missing intermediate</b> (6.3)',
    'Fails after adding a <b>corporate proxy / antivirus</b> → it re-signs TLS with its own root (self-signed to you)',
    'Fails only in <b>one country / network</b> → interception or a blocked CA',
  ])}
${box('', 'TLS verification depends on three things that differ per machine: the <b>clock</b>, the <b>trust store</b>, and any <b>middlebox</b> on the path. Check those before blaming the server.', 'lam')}` },

  { t: 'Cloudflare Full vs Full (strict)', giua: true, body: `
${bang(['Mode', 'Cloudflare → origin', 'Risk'], [
    ['<b>Flexible</b>', 'HTTP (not encrypted!)', 'origin traffic in cleartext — avoid'],
    ['<b>Full</b>', 'HTTPS, cert <b>not verified</b>', 'encrypted, but a MITM to the origin is possible'],
    ['<b>Full (strict)</b>', 'HTTPS, cert <b>verified</b>', 'the correct setting'],
  ], { fs: 20 })}
${box('', '“The padlock is green” only covers browser→Cloudflare. The <b>Cloudflare→origin</b> hop is separate: <b>Full (strict)</b> is the only mode that both encrypts <em>and</em> verifies. “Full” accepts a self-signed origin cert — encrypted theatre.', 'do2')}` },

  { t: 'mTLS in one minute', giua: true, body: `
${box('Normal TLS', 'The <b>server</b> proves its identity with a certificate; the client stays anonymous (you log in with a password instead).', 'lam')}
${box('Mutual TLS (mTLS)', 'The <b>client also</b> presents a certificate, so the server cryptographically knows who is calling. Used for <b>service-to-service</b> auth, zero-trust networks, and some APIs. A client with no/invalid cert is rejected at the TLS layer, before any request.', 'xanh')}` },

  { t: 'Where this lives in the computer', giua: true, body: `
${bang(['Piece', 'What it is'], [
    ['the clock', 'the OS time; drives notBefore/notAfter checks — keep NTP working'],
    ['the trust store', 'the OS/browser list of trusted roots; differs by platform and age'],
    ['the error code', 'from the TLS library (OpenSSL verify codes 9, 10, 18, 20…), surfaced by curl'],
    ['a middlebox', 'a proxy/AV that re-signs TLS with its own root — looks self-signed to you'],
  ], { fs: 20 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Each TLS failure has one exact message: <b>expired (10)</b>, <b>not yet valid (9)</b>, <b>name mismatch</b>, <b>self-signed (18)</b>, <b>missing intermediate (20)</b></li>
<li><b>Not yet valid</b> usually means the <b>client clock is wrong</b>, not the certificate</li>
<li>“Works here, fails there” = clock, trust store, or a middlebox — check those three</li>
<li><b>Cloudflare Full (strict)</b> is the only mode that encrypts <em>and</em> verifies the origin</li>
<li><b>mTLS</b> adds a client certificate for service-to-service authentication</li>
</ul>
<p style="margin:0">${kw('expired', 'hết hạn')} ${kw('name mismatch', 'sai tên')} ${kw('self-signed', 'tự ký')} ${kw('Full (strict)', 'mã hoá + kiểm')} ${kw('mTLS', 'TLS hai chiều')}</p>` },
]);
