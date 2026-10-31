/**
 * nfd-00-2 — Networking for Developers, bài 0.2 "Chuyện gì xảy ra khi bạn gõ một địa chỉ rồi Enter". Khuôn _nfd-chung.mjs.
 * Output = CHẠY THẬT: lab/out/c00-internet.out.txt (Internet thật, 31/10/2026), c00-url-lab.out.txt (trong lab).
 */
import { lamDeck, sh, two, box, steps, kw, bang, vsd, svg, T, R, C } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-00-2', code: 'NFD 0.2', title: 'What happens when you type a URL and press Enter', sub: 'Networking for Developers · Section 0' };

const term = (t, o = {}) => sh(t, o);

/* Thác thời gian vẽ đúng tỉ lệ. rows: [nhãn, [[tên, từ, tới, màu]…], tổng] (ms) */
const fall = (rows, max) => {
  const w = 1110, lab = 190, k = (w - lab - 110) / max, rh = 58;
  let s = '';
  rows.forEach(([name, ph, tot], i) => {
    const y = 8 + i * rh;
    s += T(0, y + 30, name, 18, { w: 800 });
    for (const [n, a, b, c] of ph) {
      const x = lab + a * k, ww = Math.max((b - a) * k, 3);
      s += R(x, y + 6, ww, 36, c + '33', c, { rx: 4, sw: 2 });
      if (ww > 56) s += T(x + ww / 2, y + 30, n, 15, { a: 'middle', w: 700, f: c });
    }
    s += T(lab + tot * k + 8, y + 30, `${tot.toFixed(1)} ms`, 16, { w: 700, f: '#333', m: 1 });
  });
  return svg(w, rows.length * rh + 14, s);
};
const P = (d, c, t, f, tot) => [['DNS', 0, d, C.link], ['TCP', d, c, C.ip], ['TLS', c, t, C.tcp], ['server', t, f, C.app], ['body', f, tot, C.br]];

export const slides = lamDeck({ chuong: 'Section 0 — The URL journey', bai: '0.2' }, [
  { cover: true, t: 'What happens when you type<br>a URL and press Enter', sub: 'Seven stages, each with a name and a time —<br>measured on cuongthai.com', nhan: 'Section 0 · Lesson 0.2' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The seven stages of a page load, and <b>which machine</b> does each one</li>
<li>Reading <code class="i">curl -v</code>: one line per stage</li>
<li>Timing every stage with <code class="i">curl -w</code> — and the <b>cumulative</b> trap</li>
<li>Why distance (round trips) dominates, and why a reused connection is nearly free</li>
<li>A map from each stage to the chapter that teaches it</li>
</ul>` },

  { t: 'Seven stages of one page load', giua: true, to: true, body: `
${steps([
    '<b>Parse the URL</b> — scheme https, host cuongthai.com, port 443, path /',
    '<b>DNS</b> — turn the name into an address (Chapter 3)',
    '<b>TCP</b> — open a reliable connection: three packets (Chapter 4)',
    '<b>TLS</b> — agree on keys, check the certificate (Chapter 7)',
    '<b>HTTP request</b> — <code class="i">GET / HTTP/2</code> plus headers (Chapter 8)',
    '<b>Server work</b> — nginx → API → database, then the response starts',
    '<b>Download & render</b> — the HTML asks for CSS, JS, images: many more requests',
  ])}` },

  { t: 'Who does each stage — and where in the computer', giua: true, body: `
${bang(['Stage', 'Which machine', 'Where in that machine'], [
    ['Parse URL, HTTP', 'your laptop', 'the browser or curl process (user space, on a CPU core)'],
    ['DNS', 'laptop → resolver (home router, ISP or 1.1.1.1)', 'a cache in the OS, then a question over UDP'],
    ['TCP', 'laptop ⇄ server', 'the <b>kernel</b> of both machines; packets leave through the network chip'],
    ['TLS', 'laptop ⇄ server', 'a crypto library inside the app (OpenSSL, BoringSSL) — CPU work'],
    ['Server work', 'server (and its database)', 'nginx and the API processes; disk and RAM of the database'],
    ['Render', 'your laptop', 'the browser’s layout and JavaScript engines'],
  ], { fs: 19 })}` },

  { t: 'curl -v narrates the stages', giua: true, body: `
${term(`$ curl -sv -o /dev/null https://cuongthai.com/ 2>&1 | grep -E '…'
* Host cuongthai.com:443 was resolved.
* IPv4: 160.187.1.208
*   Trying 160.187.1.208:443...
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / x25519 / id-ecPublicKey
* ALPN: server accepted h2
> GET / HTTP/2
> Host: cuongthai.com
< HTTP/2 200
< server: nginx/1.27.5`, { title: 'terminal — net-lab, real Internet' })}
<p style="margin:0;font-size:20px">${kw('resolved', 'DNS xong')} ${kw('Trying', 'TCP đang kết nối')} ${kw('TLS handshake', 'bắt tay mã hoá')} ${kw('&gt; / &lt;', 'gửi đi / nhận về')}</p>` },

  { t: 'curl -w times every stage — but the numbers add up', giua: true, body: `
${term(`$ curl -s -o /dev/null https://cuongthai.com/ -w \\
  'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\\n'
dns=0.003260 connect=0.011939 tls=0.026036 ttfb=0.069547 total=0.102738`, { sm: true })}
${vsd('<p style="margin:0;font-size:20px">“TLS took 26 ms, the server took 70 ms.”</p><p class="nho" style="margin:4px 0 0">Every value is a moment since the start, not a duration.</p>',
    '<p style="margin:0;font-size:20px">TCP = 11.9 − 3.3 = <b>8.7 ms</b> · TLS = 26.0 − 11.9 = <b>14.1 ms</b> · server = 69.5 − 26.0 = <b>43.5 ms</b> · body = 33.2 ms</p>',
    '✗ Reading them as durations', '✓ Subtract the previous stage')}` },

  { t: 'Drawn to scale: one request to cuongthai.com', giua: true, body: `
${fall([['cold request', P(3.26, 11.94, 26.04, 69.55, 102.74), 102.74]], 110)}
${two(box('Compare with one round trip', '<b>ping</b> to the same server: 6.9–9.8 ms. TCP took 8.7 ms ≈ <b>one round trip</b>; TLS 1.3 took 14.1 ms ≈ one round trip plus the crypto work.', 'lam'),
    box('So where did the time go?', 'Mostly <b>server work</b> (43.5 ms: nginx → Next.js renders the page) and <b>download</b> (33.2 ms for 130 KB). The network setup was 26 ms.', ''))}` },

  { t: 'A reused connection skips three stages', giua: true, body: `
${term(`$ curl -s -o /dev/null -o /dev/null -w 'url=%{url} dns=… connect=… tls=… ttfb=… total=…\\n' \\
    https://cuongthai.com/ https://cuongthai.com/about
url=https://cuongthai.com/ dns=0.002108 connect=0.008297 tls=0.020146 ttfb=0.041292 total=0.085199
url=https://cuongthai.com/about dns=0.000000 connect=0.000000 tls=0.000000 ttfb=0.046141 total=0.206101`, { sm: true })}
${box('Why browsers and HTTP clients keep connections open', 'The second request rode the <b>same TCP + TLS connection</b>: DNS, TCP and TLS cost <b>zero</b>. This is keep-alive and connection pooling — the cheapest speed-up in web development (Chapters 4, 8, 13).', 'xanh')}` },

  { t: 'Distance changes everything', giua: true, body: `
${fall([
    ['lab (same PC)', [['TCP', 0, 0.37, C.ip], ['server', 0.37, 1.61, C.app]], 1.64],
    ['cuongthai.com', P(3.26, 11.94, 26.04, 69.55, 102.74), 102.74],
    ['example.com', P(45.94, 73.07, 132.29, 186.30, 186.43), 186.43],
  ], 200)}
<p style="margin:0;font-size:20px">The lab answers in under 2 ms; a server in Vietnam in ~100 ms; a server far away spends <b>59 ms on TLS alone</b> — because each round trip is longer. Faster CPUs do not fix distance.</p>` },

  { t: 'A simple model you can do in your head', to: true, giua: true, body: `
${box('time to first byte ≈', '<b>DNS</b> (0 if cached) + <b>1 RTT</b> (TCP) + <b>1 RTT</b> (TLS 1.3) + <b>1 RTT + server time</b> (the request)', 'lam')}
${bang(['Where the user is', 'RTT', 'Setup before the first byte'], [
    ['same city as the server', '≈ 8 ms', '≈ 3 × 8 = 24 ms + server'],
    ['Hanoi → Singapore', '≈ 40 ms (typical)', '≈ 120 ms + server'],
    ['Hanoi → US west coast', '≈ 180 ms (typical)', '≈ 540 ms + server'],
  ], { fs: 21 })}
<p class="nho" style="margin:0">Rows 2–3: typical round-trip times, for illustration — measure your own with ping. Chapters 5 and 8 cut the number of round trips (TLS resumption, HTTP/3, CDN).</p>` },

  { t: 'A browser does this dozens of times per page', to: true, giua: true, body: `
<ul>
<li>The HTML lists CSS, JavaScript, fonts, images — each one is <b>another request</b></li>
<li>Most go to the <b>same host</b>, so they reuse the open connection (and with HTTP/2 share it at the same time)</li>
<li>Others go to a CDN or API host: a <b>new</b> DNS + TCP + TLS each time</li>
<li>Open DevTools → Network → <b>Timing</b>: the same stages as curl, per request</li>
</ul>` },

  { t: 'Every stage has a chapter', giua: true, body: `
${bang(['Stage', 'Learn it in', 'Typical bug'], [
    ['DNS', 'Chapter 3', 'moved server, old address cached'],
    ['TCP', 'Chapter 4', 'no keep-alive: a new handshake for every API call'],
    ['TLS', 'Chapter 7', 'missing intermediate certificate'],
    ['HTTP', 'Chapters 8–9', 'cache headers wrong; WebSocket dropped'],
    ['Server behind a proxy', 'Chapter 10', '502 / 504'],
    ['The whole path', 'Chapters 11, 13', '“slow only sometimes”'],
  ], { fs: 21 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>One page load = parse → DNS → TCP → TLS → request → server work → download, then many more requests</li>
<li><code class="i">curl -v</code> narrates the stages; <code class="i">curl -w</code> times them — <b>cumulatively</b>, so subtract</li>
<li>TCP and TLS 1.3 each cost about <b>one round trip</b>; distance multiplies them</li>
<li>A reused connection makes DNS + TCP + TLS free — keep connections open</li>
<li>Next: Chapter 1 — what is inside one of those packets</li>
</ul>` },
]);
