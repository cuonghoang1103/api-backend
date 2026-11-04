/**
 * nfd-04-5 — Networking for Developers, bài 4.5 "Keep-alive, pool kết nối và timeout trong code của bạn"
 * (slug netdev-4-5-keepalive-pool). Output = CHẠY THẬT đọc bằng ra() (lab/out/c45-*.out.txt).
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-04-5', code: 'NFD 4.5', title: 'Keep-alive, connection pools and timeouts in your code', sub: 'Networking for Developers · Chapter 4' };
const term = (t, o = {}) => sh(t, o);
const codejs = (t) => `<pre class="mono" style="font-size:19px;line-height:1.45;background:#1e2430;color:#e6edf3;border-radius:10px;padding:14px 18px;white-space:pre-wrap">${t}</pre>`;

export const slides = lamDeck({ chuong: 'Chapter 4 — TCP', bai: '4.5' }, [
  { cover: true, t: 'Keep-alive, connection pools<br>and timeouts in your code', sub: 'Where TCP meets the lines you actually write', nhan: 'Chapter 4 · Lesson 4.5' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why <b>keep-alive and pooling</b> are the single biggest latency win — and the fix for port exhaustion</li>
<li>How Node’s <code class="i">http.Agent</code> and Java’s HikariCP reuse connections</li>
<li>The two timeouts people confuse: <b>connect timeout</b> vs <b>read timeout</b></li>
<li><b>Nagle and TCP_NODELAY</b>: why two small writes can stall ~40 ms — measured</li>
<li><b>TCP keepalive</b>: catching connections that died silently behind a NAT or firewall</li>
</ul>` },

  { t: 'The cheapest handshake is the one you skip', body: `
${term(ra('c45-ka', 'curl', 1), { sm: true, title: 'two requests, one curl — the second reuses the connection' })}
${box('', '“<b>Re-using existing connection</b>” — no second handshake. In lesson 4.1 that dropped the request from 51 ms to 27 ms. Keep-alive is the default in HTTP/1.1; the job of your code is to actually <b>hold onto</b> the connection and reuse it.', 'xanh')}` },

  { t: 'Connection pools in your code', giua: true, body: `
${term(ra('c45-node', 'node agent', 1), { sm: true, title: 'Node http.Agent: four requests, connections counted by the server' })}
${box('', 'With <code class="i">keepAlive:false</code> the four requests open <b>four</b> TCP connections — four handshakes, four ports churned. With <code class="i">keepAlive:true</code> they share <b>one</b>. A pool is just this, kept warm across your whole app.', 'lam')}
${steps([
    'Four handshakes vs one: on a far link, three saved round trips',
    'Four ephemeral ports churned vs one: no TIME_WAIT pile-up (lesson 4.4)',
    'The mistake is a <b>new client per request</b> — it throws the pool away every time',
  ])}` },

  { t: 'What a pool looks like', giua: true, body: `
${two(codejs(`// Node.js — one shared keep-alive agent
import http from 'node:http';
const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 50,        // per host
  keepAliveMsecs: 15000,
});
http.get({ host, path, agent }, cb);`), codejs(`// Java — HikariCP (DB) / OkHttp (HTTP)
HikariConfig c = new HikariConfig();
c.setMaximumPoolSize(10);
c.setConnectionTimeout(3000); // ms
c.setMaxLifetime(1800000);
// OkHttp reuses connections by default
`))}
${box('', 'Every serious client has a pool: <code class="i">undici</code> in Node, HikariCP for JDBC, <code class="i">http.Client</code> in Go, connection pools in <code class="i">psycopg</code>/<code class="i">pgbouncer</code>. Create <b>one</b> and share it — a new client per request defeats the point.', 'lam')}` },

  { t: 'Two timeouts people confuse', giua: true, body: `
${bang(['Timeout', 'Covers', 'Fires when'], [
    ['<b>connect timeout</b>', 'the handshake (SYN → ACK)', 'the host is unreachable / SYN dropped (lesson 4.1)'],
    ['<b>read / request timeout</b>', 'waiting for the response after connecting', 'the server accepted but is slow or stuck'],
    ['<b>idle / pool timeout</b>', 'how long a pooled connection may sit unused', 'reclaim before a middlebox kills it'],
  ], { fs: 20 })}
${box('', 'A missing <b>connect timeout</b> is why a dead dependency hangs your request for the kernel’s ~2 minutes. A missing <b>read timeout</b> is why one slow backend ties up all your threads. Set both — short, explicit.', 'do2')}` },

  { t: 'Nagle and TCP_NODELAY', body: `
${term(ra('c45-nodelay', 'node nagle', 1), { sm: true, title: 'a request split into two small writes, over a 25 ms link' })}
${box('', 'With Nagle on (the default), the second small write is held until the first is acked, and the receiver’s delayed ACK waits ~40 ms — <b>57 ms per transaction</b>. <code class="i">setNoDelay(true)</code> turns Nagle off: <b>30 ms</b>. For small request/response protocols, set <code class="i">TCP_NODELAY</code>.', 'lam')}` },

  { t: 'Nagle × delayed-ACK: the classic 40 ms stall', giua: true, body: `
${steps([
    '<b>Nagle</b>: don’t send a small segment while earlier small data is still unacked — coalesce instead',
    '<b>Delayed ACK</b>: the receiver waits up to ~40 ms to piggyback its ACK on a reply',
    'Together, in a write-write-read pattern, each side waits for the other → a per-transaction stall',
    'Fix: <b>TCP_NODELAY</b> on latency-sensitive sockets (most RPC libraries set it by default)',
  ])}
${box('', 'You rarely toggle Nagle by hand — but you need to recognise the symptom: a protocol that is fast in bulk yet adds a fixed ~40 ms per round trip. That is almost always this interaction.', 'lam')}` },

  { t: 'Connections that died silently', body: `
${term(ra('c45-keepalive-opt', 'sysctl', 1), { sm: true, title: 'TCP keepalive defaults (seconds)' })}
${box('', 'A NAT or firewall drops its state for an <b>idle</b> connection (often 5–30 min) <b>without telling either end</b>. Both sides still think it is open; the next write hangs until a timeout. TCP keepalive probes detect it — but the default is <b>2 hours</b> (7200 s), far too long. Set it low (minutes) on long-lived connections, or send app-level pings.', 'do2')}` },

  { t: 'The timeouts to always set', giua: true, body: `
${bang(['On', 'Set', 'Why'], [
    ['every outbound client', 'connect + read timeout (seconds)', 'fail fast instead of hanging for 2 minutes'],
    ['the pool', 'max sockets, idle timeout, max lifetime', 'bound resource use; recycle before middleboxes kill'],
    ['long-lived sockets (WS, DB)', 'TCP keepalive (minutes) or app ping', 'notice silent NAT/firewall drops'],
    ['latency-sensitive RPC', 'TCP_NODELAY', 'avoid the Nagle × delayed-ACK stall'],
  ], { fs: 19 })}` },

  { t: 'Where this lives in the computer', giua: true, body: `
${bang(['Piece', 'What it is'], [
    ['the pool', 'your app’s data structure of open sockets (undici, HikariCP…) — not the kernel’s'],
    ['keep-alive', 'an HTTP-level agreement to not close after a response; TCP itself just stays ESTABLISHED'],
    ['TCP_NODELAY / SO_KEEPALIVE', 'per-socket options your code sets via the socket API'],
    ['connect/read timeout', 'enforced by your client library with a timer, not by TCP'],
  ], { fs: 20 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>Keep-alive + pooling</b> is the biggest latency win and the real fix for port exhaustion — share one pool</li>
<li>Node <code class="i">http.Agent({keepAlive:true})</code> / HikariCP reuse connections: four requests, one socket</li>
<li>Set a <b>connect timeout</b> and a <b>read timeout</b> — different failures, both must fail fast</li>
<li><b>Nagle × delayed-ACK</b> stalls small write-write-read by ~40 ms (57 → 30 ms here); use <code class="i">TCP_NODELAY</code></li>
<li>Long-lived connections die silently behind NAT/firewalls; the 2-hour keepalive default is too long</li>
</ul>
<p style="margin:0">${kw('keep-alive', 'giữ kết nối')} ${kw('connection pool', 'pool kết nối')} ${kw('connect timeout', 'hạn kết nối')} ${kw('TCP_NODELAY', 'tắt Nagle')} ${kw('TCP keepalive', 'dò sống')}</p>` },
]);
