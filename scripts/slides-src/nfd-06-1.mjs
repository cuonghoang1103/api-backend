/**
 * nfd-06-1 — Networking for Developers, bài 6.1 "TLS bảo đảm điều gì, lịch sử SSL→TLS 1.3" (slug netdev-6-1-tls-la-gi).
 * Bài MỞ CHƯƠNG 6. Output = CHẠY THẬT đọc bằng ra() (lab/out/c61-*.out.txt).
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-06-1', code: 'NFD 6.1', title: 'What TLS guarantees, from SSL to TLS 1.3', sub: 'Networking for Developers · Chapter 6' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 6 — TLS', bai: '6.1' }, [
  { cover: true, t: 'What TLS guarantees,<br>from SSL to TLS 1.3', sub: 'The S in HTTPS, seen from the inside', nhan: 'Chapter 6 · Lesson 6.1' },

  { t: 'Chapter 6 at a glance — what you can do after it', to: true, giua: true, body: `
<ul>
<li>Say exactly what TLS <b>guarantees</b> — confidentiality, integrity, authentication — and what it does not</li>
<li>Read a <b>TLS 1.3 handshake</b> on the wire: ClientHello, SNI, ALPN, and what is encrypted</li>
<li>Decrypt your own TLS with <b>SSLKEYLOGFILE</b> and see the HTTP inside</li>
<li>Read a <b>certificate</b> and follow its <b>chain</b> (leaf → intermediate → root)</li>
<li><b>Diagnose</b> expired, wrong-name, self-signed and not-yet-valid certificate errors</li>
</ul>
${box('Why a developer needs this', 'Every HTTPS call, every <code class="i">git push</code>, every webhook is TLS. “Certificate expired”, “works on Chrome, fails on Android”, “SSL handshake failed” are routine — and each has a precise cause you can read.', 'lam')}` },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The three things TLS <b>guarantees</b>, and the one it famously does not (availability)</li>
<li>A one-line proof of all three, read from <code class="i">openssl s_client</code></li>
<li>Why only <b>SNI and the hellos</b> are cleartext on the wire — the rest is encrypted</li>
<li>The history: <b>SSL → TLS 1.0 → TLS 1.3</b>, and what Heartbleed taught</li>
<li>Where TLS sits: between TCP and HTTP, doing one job</li>
</ul>` },

  { t: 'What TLS guarantees', giua: true, body: `
${bang(['Guarantee', 'Means', 'Broken by'], [
    ['<b>Confidentiality</b>', 'nobody on the path can read your data', 'no encryption (plain HTTP)'],
    ['<b>Integrity</b>', 'nobody can change it without you noticing', 'a tampered response'],
    ['<b>Authentication</b>', 'you are talking to the real server, not an impostor', 'a wrong / untrusted certificate'],
  ], { fs: 20 })}
${box('', 'TLS does <b>not</b> give you availability (a DDoS still takes you down), and it does not hide <b>which site</b> you visit — the server name (SNI) travels in cleartext. It secures the <em>channel</em>, not everything about it.', 'lam')}` },

  { t: 'All three, in one command', body: `
${term(ra('c61-version', 'echo | openssl', 1), { sm: true, title: 'nfi-client → the lab HTTPS server' })}
${steps([
    '<b>Authentication</b>: <code class="i">Verify return code: 0 (ok)</code> — the certificate chains to a trusted root',
    '<b>Confidentiality + integrity</b>: <code class="i">TLSv1.3</code> + <code class="i">Cipher</code> — the agreed encryption',
    '<b>ALPN h2</b>: both sides agreed to speak HTTP/2 inside the tunnel (lesson 7.2)',
  ])}` },

  { t: 'On the wire: only the hellos are cleartext', giua: true, body: `
${term(ra('c61-wire', 'tshark', 1), { sm: true, title: 'a TLS 1.3 handshake, captured' })}
${box('', 'ClientHello (type 1) and ServerHello (type 2) are cleartext; so is the <b>SNI</b> — anyone capturing sees <code class="i">labflow.test</code>. From the ServerHello on, <b>everything is encrypted</b>: the certificate, Finished, and all HTTP.', 'lam')}
${steps([
    'A network operator can see the <b>SNI + destination IP</b> → which site you visited',
    'They cannot see the <b>request or response body</b> → the actual data',
    'This is how networks block sites “even over HTTPS”, and why ECH (encrypted SNI) exists',
  ])}` },

  { t: 'A short history, and one scar', to: true, giua: true, body: `
${bang(['Version', 'Year', 'Note'], [
    ['SSL 2.0 / 3.0', '1995–1996', 'Netscape’s originals — both now broken, disabled'],
    ['TLS 1.0 / 1.1', '1999 / 2006', 'deprecated 2021 — do not use'],
    ['TLS 1.2', '2008', 'still common; configurable, easy to misconfigure'],
    ['<b>TLS 1.3</b>', '<b>2018 (RFC 8446)</b>', 'fewer round trips, only strong ciphers, simpler'],
  ], { fs: 19 })}
${box('Heartbleed (2014)', 'A bug in <b>OpenSSL</b> (not in TLS itself) leaked server memory — including private keys — to anyone who asked. The lesson: TLS the protocol can be sound while an <b>implementation</b> is not; keep your TLS library patched.', 'do2')}` },

  { t: 'Where TLS sits', giua: true, body: `
${bang(['Layer', 'Does'], [
    ['HTTP', 'your request/response — <b>handed to TLS as plaintext</b>'],
    ['<b>TLS</b>', 'encrypts, authenticates, checks integrity — then hands bytes to TCP'],
    ['TCP', 'reliable, ordered delivery of those (encrypted) bytes'],
    ['IP', 'routing'],
  ], { fs: 21 })}
${box('', 'TLS is a <b>layer</b>: HTTP does not know it is encrypted, TCP does not know what it carries. That clean split is why the same TLS secures HTTP, email (SMTP/IMAP), databases and more.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>TLS guarantees <b>confidentiality, integrity and authentication</b> — not availability, and not which site you visit (SNI is cleartext)</li>
<li>One <code class="i">openssl s_client</code> proves all three: <code class="i">Verify return code: 0</code>, <code class="i">TLSv1.3</code>, a cipher</li>
<li>On the wire, only <b>ClientHello/ServerHello + SNI</b> are cleartext; the certificate and all HTTP are encrypted</li>
<li><b>SSL → TLS 1.3 (2018)</b>; Heartbleed was an OpenSSL bug, not a TLS flaw — patch your library</li>
<li>TLS is a layer between TCP and HTTP: it secures the channel for HTTP, email, databases and more</li>
</ul>
<p style="margin:0">${kw('TLS', 'bảo mật tầng vận chuyển')} ${kw('confidentiality', 'bí mật')} ${kw('integrity', 'toàn vẹn')} ${kw('authentication', 'xác thực')} ${kw('SNI', 'tên máy chủ')}</p>` },
]);
