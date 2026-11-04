/**
 * nfd-07-5 — Networking for Developers, bài 7.5 "Proxy trên đường đi: X-Forwarded-For, Host và IP thật"
 * (slug netdev-7-5-proxy-header). Output = CHẠY THẬT đọc bằng ra() (lab/out/c75-*.out.txt).
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-07-5', code: 'NFD 7.5', title: 'Proxies in the path: X-Forwarded-For and the real client IP', sub: 'Networking for Developers · Chapter 7' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 7 — HTTP 1.1→3', bai: '7.5' }, [
  { cover: true, t: 'Proxies in the path:<br>X-Forwarded-For and the real client IP', sub: 'Who is the client, when three proxies<br>stand between you and them?', nhan: 'Chapter 7 · Lesson 7.5' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why your app sees the <b>proxy’s</b> IP, not the user’s — measured</li>
<li><b>X-Forwarded-For</b>: how the real client IP is carried, and how it <b>chains</b></li>
<li><b>CF-Connecting-IP</b> and <code class="i">trust proxy</code>: trusting the right hop</li>
<li>The <b>Host</b> header through a proxy, and why it matters</li>
<li>A real outage: a rate limiter that banned everyone by reading the wrong IP</li>
</ul>` },

  { t: 'Your app sees the proxy, not the user', body: `
${term(ra('c75-xff', 'curl', 1, { max: 8 }), { sm: true, title: 'client → nginx → api' })}
${box('', '<b>seenFrom</b> = the proxy’s IP (nginx, 10.10.2.10) — the TCP connection to the app came from the proxy, not the user. The <b>real</b> client IP (10.10.1.10) survives only because nginx put it in <b>X-Forwarded-For</b>. Without that header, your app has no idea who the user is.', 'lam')}` },

  { t: 'The chain: Cloudflare → nginx → app', giua: true, body: `
${bang(['Hop', 'TCP source it sees', 'Adds / keeps'], [
    ['<b>Cloudflare</b>', 'the user', 'sets <code class="i">CF-Connecting-IP</code> = user; starts XFF'],
    ['<b>nginx</b>', 'Cloudflare', 'appends Cloudflare’s IP to XFF'],
    ['<b>your app</b>', 'nginx', 'reads XFF to recover the user'],
  ], { fs: 20 })}
${box('', 'Each hop only sees the <b>previous</b> hop as its TCP peer. The user’s IP is <b>data</b> passed along in a header — it is only as trustworthy as the proxy that set it.', 'lam')}` },

  { t: 'X-Forwarded-For chains', body: `
${term(ra('c75-chain', 'curl', 1, { max: 8 }), { sm: true, title: 'client → proxy1 → proxy2 → app' })}
${box('', 'Through <b>two</b> proxies, <code class="i">forwardedFor</code> is a <b>list</b>: <b>10.10.1.10, 10.10.2.10</b> = “client, then proxy1”. Each proxy <b>appends</b> the address it saw. The leftmost entry is the original client — <b>if every hop is honest</b>.', 'lam')}` },

  { t: 'Trust the right hop — or get spoofed', giua: true, body: `
${box('The danger', 'A client can <b>send its own</b> <code class="i">X-Forwarded-For</code>. If your app blindly reads the <b>leftmost</b> value, an attacker spoofs any IP — bypassing IP allow-lists and poisoning rate limits.', 'do2')}
${steps([
    'Only trust XFF entries added by <b>proxies you control</b>',
    'Count from the <b>right</b>: skip your known proxies, the next is the real client',
    'In Express: <code class="i">app.set("trust proxy", n)</code> (the number of trusted hops) — not <code class="i">true</code> blindly',
    'Behind Cloudflare, prefer <code class="i">CF-Connecting-IP</code> (set by Cloudflare, not the client)',
  ])}` },

  { t: 'The outage: a rate limiter banned everyone', giua: true, body: `
${box('What happened', 'A rate limiter keyed on <code class="i">X-Forwarded-For</code> read the <b>wrong</b> entry — the proxy’s IP, shared by <b>all</b> users. One busy user tripped the limit and <b>everyone behind the proxy got 429</b>.', 'do2')}
${box('The fix', 'Configure <code class="i">trust proxy</code> correctly so the limiter keys on the <b>real client IP</b>, and test it from behind the actual proxy chain — not just against the origin, where the IPs look fine.', 'xanh')}` },

  { t: 'Host: which site, through the proxy', giua: true, body: `
${steps([
    'The <b>Host</b> header (lesson 7.1) tells the final server which virtual host you want',
    'A proxy must <b>forward the original Host</b> (or set <code class="i">X-Forwarded-Host</code>) — otherwise redirects and links break',
    'An app building absolute URLs from <code class="i">Host</code> must trust the forwarded host, not the proxy’s own',
  ])}
${box('', 'Same theme as the IP: behind a proxy, the “real” Host, scheme (<code class="i">X-Forwarded-Proto</code>) and IP all travel in headers you must trust deliberately.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Your app sees the <b>proxy’s</b> TCP IP; the real client IP survives only in <b>X-Forwarded-For</b></li>
<li>XFF <b>chains</b>: each proxy appends; the list reads <b>client, proxy1, proxy2…</b> from the left</li>
<li>Clients can <b>spoof</b> XFF — trust only entries added by <b>proxies you control</b> (Express <code class="i">trust proxy</code> = hop count)</li>
<li>Behind Cloudflare use <b>CF-Connecting-IP</b>; forward the original <b>Host</b> / <code class="i">X-Forwarded-Proto</code> too</li>
<li>A rate limiter on the <b>wrong</b> IP bans everyone behind a proxy — a real 429 outage; test behind the real chain</li>
</ul>
<p style="margin:0">${kw('X-Forwarded-For', 'IP chuyển tiếp')} ${kw('CF-Connecting-IP', 'IP thật của CF')} ${kw('trust proxy', 'tin proxy')} ${kw('Host', 'tên máy chủ')} ${kw('spoofing', 'giả mạo')}</p>` },
]);
