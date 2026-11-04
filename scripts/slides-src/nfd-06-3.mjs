/**
 * nfd-06-3 — Networking for Developers, bài 6.3 "Chứng chỉ, chuỗi tin cậy và CA" (slug netdev-6-3-chung-chi).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c63-*.out.txt).
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-06-3', code: 'NFD 6.3', title: 'Certificates, chains and certificate authorities', sub: 'Networking for Developers · Chapter 6' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 6 — TLS', bai: '6.3' }, [
  { cover: true, t: 'Certificates, chains<br>and certificate authorities', sub: 'Leaf, intermediate, root — and the one<br>everyone forgets', nhan: 'Chapter 6 · Lesson 6.3' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>certificate</b> actually says, read from a real one</li>
<li>The <b>chain</b> of trust: leaf → intermediate → root, and who signs whom</li>
<li>How a certificate is <b>issued</b> — CSR, a CA signature, and <b>Let’s Encrypt / ACME</b></li>
<li>The <b>missing-intermediate</b> bug: works on Chrome, fails on an old Android — measured</li>
<li><b>Certificate Transparency</b>: every public certificate is logged</li>
</ul>` },

  { t: 'What a certificate says', body: `
${term(ra('c63-read', 'echo | openssl', 1), { sm: true, title: 'the leaf certificate for labflow.test' })}
${steps([
    '<b>subject</b>: who it is for (the site) · <b>issuer</b>: who signed it (the CA)',
    '<b>notBefore / notAfter</b>: the validity window — expiry is lesson 6.4',
    '<b>Subject Alternative Name (SAN)</b>: the exact hostnames it is valid for — the <code class="i">CN</code> alone is ignored now',
  ])}` },

  { t: 'A chain of trust', giua: true, body: `
${bang(['Certificate', 'Signed by', 'Where it lives'], [
    ['<b>leaf</b> (labflow.test)', 'the intermediate CA', 'sent by your server, every connection'],
    ['<b>intermediate</b> CA', 'the root CA', 'sent by your server too (the forgotten one)'],
    ['<b>root</b> CA', 'itself (self-signed)', 'pre-installed in the OS / browser trust store'],
  ], { fs: 20 })}
${box('', 'Your browser trusts a few hundred <b>roots</b> shipped with the OS. It does <b>not</b> ship your leaf or intermediate — so your server must send the leaf <b>and</b> the intermediate, and the browser walks up to a root it already trusts.', 'lam')}` },

  { t: 'Read the chain the server sent', body: `
${term(ra('c63-chain', 'echo | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -showcerts 2>/dev/null | grep -E', 1, { cut: 70 }), { sm: true, title: 's: subject, i: issuer — read top to bottom' })}
${box('', 'Two certificates: <b>0</b> is the leaf (subject labflow.test, issued by the Intermediate), <b>1</b> is the intermediate (subject Intermediate, issued by the Root). The root is <b>not</b> sent — it is already in the client’s trust store. That is a correctly configured chain.', 'xanh')}` },

  { t: 'How a certificate is issued', giua: true, body: `
${steps([
    'You make a <b>key pair</b> and a <b>CSR</b> (certificate signing request) with your public key + hostnames',
    'A <b>CA</b> checks you control the domain (ACME: it asks you to serve a token at a URL or a DNS record)',
    'The CA <b>signs</b> your CSR with its intermediate key → your leaf certificate',
    'You install the leaf <b>+ the intermediate</b> on your server',
  ])}
${box('Let’s Encrypt (2015/2016) + ACME', 'A free, automated CA: a client (certbot, Caddy, your load balancer) proves control, gets a 90-day certificate, and <b>renews automatically</b>. Short lifetimes + automation replaced the old yearly manual dance.', 'lam')}` },

  { t: 'The intermediate everyone forgets', giua: true, body: `
${term(ra('c63-missing', 'curl -sS --resolve labflow.test:8443:10.10.2.10 --cacert /tmp/root.crt https', 1, { boLenh: true }), { sm: true, title: 'server sends the leaf ONLY — no intermediate' })}
${box('', '<code class="i">unable to get local issuer certificate</code>: the client cannot bridge leaf → root without the intermediate.', 'do2')}
${steps([
    '<b>Chrome often still works</b>: it fetches the missing intermediate via the leaf’s AIA URL and caches it',
    '<b>curl, Java, old Android and your monitoring fail</b>: they do not do AIA fetching',
    '“Works in my browser, fails in CI / on mobile” is almost always a missing intermediate',
  ])}` },

  { t: 'Fix it, and why it is subtle', giua: true, body: `
${bang(['Symptom', 'Cause', 'Fix'], [
    ['curl: unable to get local issuer', 'server sent leaf only', 'serve <b>fullchain</b> (leaf + intermediate)'],
    ['works in Chrome, fails elsewhere', 'Chrome fetched the intermediate via AIA', 'do not rely on AIA — send the intermediate'],
    ['self-signed certificate in chain', 'a private root not in the trust store', 'add the root to the client, or use a public CA'],
  ], { fs: 20 })}
${box('', 'Rule: always serve the <b>full chain</b>. Test with a client that does <b>not</b> fetch intermediates (<code class="i">openssl</code>, <code class="i">curl</code>), not just a browser that hides the mistake.', 'lam')}` },

  { t: 'Certificate Transparency', giua: true, body: `
${box('Every public certificate is logged', 'Since ~2018 browsers require that a certificate appear in public, append-only <b>CT logs</b>. Anyone can watch — including you, for <b>your own domains</b>.', 'lam')}
${steps([
    'A rogue or mis-issued certificate for your domain becomes <b>visible</b> within hours',
    'Monitor <code class="i">crt.sh</code> or a CT-watch service for certificates naming your domains',
    'This is a safety net <b>on top of</b> the chain of trust, not a replacement for it',
  ])}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A certificate binds a <b>hostname (SAN)</b> to a public key, with a validity window, signed by a CA</li>
<li>Trust is a <b>chain</b>: leaf ← intermediate ← root; the root is in the OS store, the rest your server must send</li>
<li>Issuance: CSR → a CA verifies domain control → signs; <b>Let’s Encrypt + ACME</b> make it free and automatic</li>
<li>The <b>missing intermediate</b> works in Chrome (AIA) but fails in curl/Java/old Android — always serve the full chain</li>
<li><b>Certificate Transparency</b> logs every public certificate — watch yours for mis-issuance</li>
</ul>
<p style="margin:0">${kw('certificate', 'chứng chỉ')} ${kw('chain of trust', 'chuỗi tin cậy')} ${kw('CA', 'nhà cấp chứng chỉ')} ${kw('intermediate', 'trung gian')} ${kw('ACME / Let’s Encrypt', 'cấp tự động')}</p>` },
]);
