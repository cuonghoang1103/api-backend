/**
 * nfd-10-3 — Networking for Developers, bài 10.3 "Reverse proxy, forward proxy và đường hầm" (slug netdev-10-3-reverse-forward).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c103-*.out.txt) — một tunnel socat cục bộ:7000 → web:80 qua router.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-10-3', code: 'NFD 10.3', title: 'Reverse proxy, forward proxy and tunnels', sub: 'Networking for Developers · Chapter 10' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 10 — Load balancing', bai: '10.3' }, [
  { cover: true, t: 'Reverse proxy, forward proxy and tunnels', sub: 'Who stands in front of whom —<br>and a pipe through a blocked boundary', nhan: 'Chapter 10 · Lesson 10.3' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li><b>Reverse proxy</b>: stands in front of your <b>servers</b> (nginx, the load balancer)</li>
<li><b>Forward proxy</b>: stands in front of the <b>clients</b> (corporate egress, filtering)</li>
<li>The one thing that distinguishes them: <b>which side</b> it fronts</li>
<li><b>Tunnels</b>: a pipe that carries a connection through a boundary — measured</li>
<li>The real outage: school network blocks port 22 → SSH served on <b>port 993</b></li>
</ul>` },

  { t: 'Reverse proxy: in front of the servers', giua: true, body: `
${box('', 'A <b>reverse proxy</b> sits in front of your backends and answers the client on their behalf. It is the whole of Chapters 7–10: nginx terminating TLS, load balancing, caching, adding <code class="i">X-Forwarded-For</code>. The client talks to the proxy and never knows how many servers are behind it.', 'lam')}
${steps([
    'Clients → <b>reverse proxy</b> → your backends',
    'Protects and fronts the <b>servers</b>: TLS, caching, load balancing, one public address',
    'Examples: nginx, HAProxy, Envoy, Cloudflare, every CDN',
  ])}` },

  { t: 'Forward proxy: in front of the clients', giua: true, body: `
${box('', 'A <b>forward proxy</b> sits in front of a group of <b>clients</b> and makes their outbound requests on their behalf. A company routes all employee traffic through one, to filter, log or cache it; the destination server sees the proxy, not the employee.', 'lam')}
${steps([
    'Your clients → <b>forward proxy</b> → the internet',
    'Fronts and controls the <b>clients</b>: egress filtering, logging, caching, anonymity',
    'Examples: a corporate proxy, Squid, a VPN gateway',
  ])}` },

  { t: 'Same machine, opposite jobs', giua: true, body: `
${bang(['', 'Reverse proxy', 'Forward proxy'], [
    ['Fronts', 'the <b>servers</b>', 'the <b>clients</b>'],
    ['Hides', 'how many backends / which one', 'who the real client is'],
    ['Configured by', 'the service owner', 'the client’s network'],
    ['You meet it as', 'nginx / CDN in front of your app', 'a corporate/egress proxy'],
  ], { fs: 19 })}
${box('', 'Both are "a proxy" — a middle box that makes a request on someone’s behalf. The only question is <b>which side</b> it fronts: the servers (reverse) or the clients (forward).', 'lam')}` },

  { t: 'A tunnel: a pipe through a boundary', body: `
${term(ra('c103-tunnel', 'socat', 3), { sm: true, title: 'socat opens local :7000, forwards to web:80 through the router' })}
${box('', 'A <b>tunnel</b> carries a connection from one point to another <b>through</b> something in between. Here <code class="i">socat</code> opens port 7000 on the client and forwards it to <code class="i">web:80</code>: a request to <code class="i">localhost:7000</code> comes out at the web server (HTTP 200, <code class="i">Server: nginx</code>), as if it were local. That is the essence of an SSH tunnel or a Cloudflare Tunnel.', 'xanh')}` },

  { t: 'The real outage: port 22 blocked', giua: true, body: `
${box('What happened', 'The school network only allowed outbound <b>80/443/587/993</b>. Port 22 was blocked, so <code class="i">ssh vps</code> (and the home machine tunnelling through it) died. The fix: run a second SSH listener on <b>port 993</b> (an allowed port) — a <code class="i">ssh993.service</code> beside the normal one.', 'do2')}
${steps([
    'A tunnel/SSH can ride any <b>allowed</b> port — the protocol is not tied to the port number',
    'Cloudflare Tunnel does the same without opening any inbound port at all (outbound-only)',
    'Lesson: when a port is blocked, carry the protocol over a port that is <b>open</b>',
  ])}` },

  { t: 'Where you meet each', giua: true, body: `
${bang(['Pattern', 'Where'], [
    ['Reverse proxy', 'nginx/CDN in front of your app (TLS, LB, cache) — Chapters 7–10'],
    ['Forward proxy', 'corporate egress, content filter, shared cache'],
    ['SSH tunnel', 'reach a service on a remote host through an encrypted pipe'],
    ['Cloudflare Tunnel', 'expose a local service with <b>no inbound port</b> (outbound-only)'],
  ], { fs: 18 })}
${box('', 'All four are the same move: put a box in the middle that forwards a connection. What changes is the direction and the boundary it crosses.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A <b>reverse proxy</b> fronts your <b>servers</b> (nginx/CDN: TLS, load balancing, caching) — one address for many backends</li>
<li>A <b>forward proxy</b> fronts the <b>clients</b> (corporate egress: filter, log, cache) — the destination sees the proxy</li>
<li>Same machine, opposite jobs — the only question is <b>which side</b> it fronts</li>
<li>A <b>tunnel</b> carries a connection through a boundary — a request to a local port emerges elsewhere (measured)</li>
<li>Real outage: port 22 blocked → SSH on port 993; a protocol can ride any <b>allowed</b> port</li>
</ul>
<p style="margin:0">${kw('reverse proxy', 'proxy ngược')} ${kw('forward proxy', 'proxy xuôi')} ${kw('tunnel', 'đường hầm')} ${kw('SSH tunnel', 'hầm SSH')} ${kw('Cloudflare Tunnel', 'hầm ra-ngoài')}</p>` },
]);
