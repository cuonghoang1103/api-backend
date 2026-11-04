/**
 * nfd-lab-6 — Networking for Developers, Lab chương 6 "Siết HTTPS của LabFlow" (slug netdev-6-5-lab-tls-labflow).
 * Đề + yêu cầu + thang điểm (không lộ lời giải). Khuôn _nfd-chung.mjs.
 */
import { lamDeck, box, cards, steps, bang, kw } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-lab-6', code: 'NFD LAB 6', title: 'Lab 6 — Hardening LabFlow’s HTTPS', sub: 'Networking for Developers · Chapter 6' };

export const slides = lamDeck({ chuong: 'Chapter 6 — Lab 6' }, [
  { cover: true, t: 'Lab 6 — Hardening<br>LabFlow’s HTTPS', sub: 'Prove the guarantees, read the chain, decrypt your own<br>traffic, and diagnose a certificate incident', nhan: 'Chapter 6 · Lab' },

  { t: 'The situation', to: true, giua: true, body: `
${cards([
    ['The audit', 'LabFlow needs to prove its HTTPS is <b>correctly configured</b>: real chain, strong TLS, verified.'],
    ['The incident', 'A partner integration fails with an SSL error; your browser opens the site fine. Find it.'],
    ['The debug', 'An API returns a wrong header over HTTPS — read the <b>decrypted</b> exchange without disabling TLS.'],
  ])}
${box('Deliverable', 'A one-page report: the three guarantees proven, a correct chain, a decrypted request, four diagnosed certificate errors, and a hardening recommendation. Part 6 of the course project.', 'do2')}
<p style="margin:0">Time: 2–3 hours · Tools: openssl s_client, tshark + SSLKEYLOGFILE, a mini CA, curl, nginx</p>` },

  { t: 'The system: a mini CA + nginx HTTPS', giua: true, body: `
${box('', `<pre class="mono" style="font-size:19px;line-height:1.5;white-space:pre-wrap">docker exec nfd-web bash /lab/k/code/ch06/setup-ca.sh    # root → intermediate → leaf + broken certs
docker exec nfd-web nginx -c /tmp/s.conf                 # HTTPS on :8443 (swap the cert to break it)
# certs: fullchain / leaf-only / expired / wrong-name / self-signed / not-yet-valid</pre>`, 'lam')}
<p style="margin:0;font-size:20px">Trust the lab root with <code class="i">--cacert /tmp/root.crt</code> · the broken certs reproduce real production failures</p>` },

  { t: 'Requirements', to: true, body: `
${steps([
    '<b>R1 Prove the guarantees</b> — openssl s_client: verify code 0, TLS 1.3, cipher; capture the SNI in cleartext',
    '<b>R2 The chain</b> — show the server sends leaf + intermediate (not the root); explain each link',
    '<b>R3 Decrypt your own TLS</b> — with SSLKEYLOGFILE, read the HTTP request/response inside the tunnel',
    '<b>R4 Diagnose four errors</b> — expired, wrong-name, self-signed, not-yet-valid: the exact message + fix',
    '<b>R5 The incident</b> — reproduce a missing intermediate; explain why the browser worked and curl did not',
    '<b>R6 Recommendation</b> — fullchain, auto-renew + alerting, Full (strict), CT monitoring',
  ])}` },

  { t: 'Report template', giua: true, body: `
${box('', `<pre class="mono" style="font-size:19px;line-height:1.5;white-space:pre-wrap">## R1 Guarantees    — verify 0, TLS 1.3, cipher; SNI cleartext (from capture)
## R2 Chain         — leaf (i: Intermediate), intermediate (i: Root), root not sent
## R3 Decrypt       — app-data encrypted vs GET/200 with the key log
## R4 Four errors   — message + code + fix for each
## R5 Incident      — error, why browser≠curl (AIA), the fix
## R6 Recommendation — fullchain, auto-renew+alert, Full (strict), CT watch</pre>`, 'lam')}` },

  { t: 'Rubric — 10 points', giua: true, body: `
${bang(['Item', 'Pts', 'Full marks when'], [
    ['R1', '1.5', 'the three guarantees shown from openssl; SNI cleartext in the capture'],
    ['R2', '1.5', 'two-cert chain read (s:/i:); root correctly absent; each link explained'],
    ['R3', '2', 'same bytes shown encrypted and decrypted to GET/200 via the key log'],
    ['R4', '2', 'all four exact messages with correct cause + fix'],
    ['R5', '2', 'missing-intermediate reproduced; AIA / browser-vs-curl difference explained'],
    ['R6', '1', 'a defensible hardening list, each item tied to something measured'],
  ], { fs: 18 })}` },

  { t: 'Hints by level', to: true, giua: true, body: `
${steps([
    'R1: <code class="i">openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -CAfile /tmp/root.crt</code>',
    'R3: <code class="i">SSLKEYLOGFILE=/tmp/keys.log curl …</code> then <code class="i">tshark -o tls.keylog_file:/tmp/keys.log -Y http.request</code>',
    'R4: reload nginx with each broken cert (expired / wrong / selfsigned / notyet) and <code class="i">curl -sS</code>',
    'R5: serve <code class="i">leaf.crt</code> only; curl with <code class="i">--cacert root.crt</code> fails, with the bundle works',
  ])}` },

  { t: 'Going further', to: true, giua: true, body: `
${cards([
    ['Automate', 'Script a checker: verify code 0, full chain present, ≥ 20 days to expiry — fail otherwise.'],
    ['mTLS', 'Turn on client-cert verification in nginx and watch a client with no cert be rejected at the handshake.'],
    ['Capstone', 'This HTTPS hop returns in the Chapter 13 whole-path project — keep your checker and chain.'],
  ])}` },

  { t: 'What this lab proves', to: true, giua: true, body: `
<ul>
<li>You can <b>prove the three TLS guarantees</b> from a single command, and read a handshake</li>
<li>You can <b>read and validate a certificate chain</b>, and decrypt your own HTTPS to debug it</li>
<li>You can <b>diagnose any common certificate error</b> from its exact message</li>
<li>You can <b>harden an HTTPS setup</b>: full chain, auto-renewal with alerts, verified origin, CT monitoring</li>
</ul>
<p style="margin:0">${kw('guarantees', 'bảo đảm')} ${kw('chain', 'chuỗi')} ${kw('key log', 'nhật ký khoá')} ${kw('diagnose', 'chẩn đoán')} ${kw('harden', 'siết an toàn')}</p>` },
]);
