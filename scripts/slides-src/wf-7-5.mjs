/** Web Foundations · deck bài 7.5 — HTTPS và CORS. Output thật: _demo/_t7/https.sh (curl), _demo/_t7/chay.mjs (Chromium CORS). */
import { deckWf, js, term, con, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

const khoi = (key, ...n) => { const p = OUT[key].split(/\n+(?=> )/); return n.map((i) => p[i].trim()).join('\n\n'); };

export const deck = { key: 'wf-7-5', code: 'WF 7.5', title: 'HTTPS and CORS', sub: 'Web Foundations · Chapter 7' };

export const slides = deckWf({ chuong: 'Chapter 7 — Authentication & security', bai: '7.5' }, [
  { cover: true, t: 'HTTPS and CORS', sub: 'Protecting the wire, and deciding who may read your API' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Read a <b>TLS handshake</b> and a <b>certificate</b></li>
    <li>Handle a <b>certificate error</b> correctly</li>
    <li>Define an <b>origin</b></li>
    <li>Read and fix a <b>CORS error</b> on the server</li>
    <li>Explain why CORS does <b>not</b> protect your server</li></ul>` },

  { t: 'What HTTPS gives you', to: true, giua: true, body: tbl(['Property', 'Means'], [
      ['confidentiality', 'nobody on the path can read it'],
      ['integrity', 'nobody can change it unnoticed'],
      ['authentication', 'the certificate proves the domain owner'],
    ]) + two(box('Still visible', 'domain name, IPs, timing, sizes', 'info'), box('Not fixed by HTTPS', 'XSS, SQL injection, IDOR, weak passwords', 'bad')) },

  { t: 'The handshake in curl', giua: true, body: term('_t7/out/https-ok', null, { title: 'curl -sv https://example.com' }) },

  { t: 'Certificate errors stop everything', giua: true, body: term('_t7/out/https-bad', null, { title: 'badssl.com' }) + box('Never "fix" it with', '<code class="i">curl -k</code> · <code class="i">NODE_TLS_REJECT_UNAUTHORIZED=0</code> · <code class="i">rejectUnauthorized: false</code>', 'bad') },

  { t: 'Origins', to: true, giua: true, body: tbl(['Page', 'Request to', 'Same origin?'], [
      ['https://shop.example', 'https://shop.example/api', '✅'],
      ['https://shop.example', 'https://api.shop.example', '❌ host'],
      ['http://localhost:5173', 'http://localhost:3000', '❌ port'],
      ['https://shop.example', 'http://shop.example', '❌ scheme'],
    ]) + box('Same-origin policy', 'A page may SEND to another origin, but may not READ the answer unless that origin allows it (CORS).', 'info') },

  { t: 'Blocked — but the request arrived', giua: true, body: con(null, khoi('_t7/out/cors', 1, 2), { title: 'Chromium · page on 127.0.0.1 → API on localhost' }) + box('CORS is not access control', 'The server saw the GET and sent the data. curl ignores CORS. Protect the API with authentication.', 'bad') },

  { t: 'Preflight', giua: true, body: tbl(['OPTIONS answer header (allowed case)', 'Value'], [['Access-Control-Allow-Origin', '<page origin>'], ['Access-Control-Allow-Methods', 'GET, PUT, DELETE'], ['Access-Control-Allow-Headers', 'Content-Type'], ['Access-Control-Max-Age', '600']]) + con(null, khoi('_t7/out/cors', 4), { title: 'PUT with a JSON body' }) + box('No permission on OPTIONS', '⇒ the browser never sends the PUT.', 'info') },

  { t: 'Credentials need an exact origin', giua: true, body: con(null, khoi('_t7/out/cors', 5, 6), { title: "credentials: 'include'" }) + box('Never', 'echo any Origin back with Allow-Credentials: true. Use an allow-list + Vary: Origin.', 'bad') },

  { t: 'Summary & practice', to: true, giua: true, body: two(steps(['HTTPS everywhere, verification on', 'One origin via proxy when possible', 'Otherwise an allow-list on the API', 'Authentication protects the API']),
    box('Practice (35 min)', 'Read a real certificate; cause a CORS error from 127.0.0.1:5500; fix it on the server; try curl.<br><br><b>Done when</b>: OPTIONS 204 then PATCH 200 — and curl still works.', 'ok')) },
]);
