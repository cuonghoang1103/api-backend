/**
 * nfd-lab-5 — Networking for Developers, Lab chương 5 "UDP, QUIC và HTTP/3 của LabFlow" (slug netdev-5-4-lab-udp-quic).
 * Đề + yêu cầu + thang điểm (không lộ lời giải). Khuôn _nfd-chung.mjs.
 */
import { lamDeck, box, cards, steps, bang, kw } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-lab-5', code: 'NFD LAB 5', title: 'Lab 5 — UDP, QUIC and HTTP/3', sub: 'Networking for Developers · Chapter 5' };

export const slides = lamDeck({ chuong: 'Chapter 5 — Lab 5' }, [
  { cover: true, t: 'Lab 5 — UDP, QUIC<br>and HTTP/3 at LabFlow', sub: 'Measure best-effort UDP, prove the HTTP/3 server side,<br>and watch QUIC fall back when it is blocked', nhan: 'Chapter 5 · Lab' },

  { t: 'The situation', to: true, giua: true, body: `
${cards([
    ['The telemetry channel', 'LabFlow wants to stream live sensor updates. Should it be TCP or UDP? Prove the trade-off with loss.'],
    ['HTTP/3', 'Should LabFlow enable HTTP/3? Show the server side and the discovery, and whether it is safe.'],
    ['The office report', 'Users say the dashboard is slower from one office. Reproduce “QUIC blocked → silent TCP fallback”.'],
  ])}
${box('Deliverable', 'A one-page recommendation backed by lab evidence: a UDP-vs-TCP decision for telemetry, the two server-side signals of HTTP/3, and a reproduction of the blocked-UDP fallback — with how you would confirm it in production.', 'do2')}
<p style="margin:0">Part 5 of the course project · Time: 2 hours · Tools: socat, tcpdump, node dgram, nginx HTTP/3, iptables, curl</p>` },

  { t: 'The system: the base lab + HTTP/3 nginx', giua: true, body: `
${box('', `<pre class="mono" style="font-size:19px;line-height:1.5;white-space:pre-wrap">docker compose -f compose.yml -p nfd up -d          # client — router — web — api
docker exec -d nfd-web node /lab/k/code/ch05/udp-srv.mjs    # UDP echo on 9999
docker exec nfd-web nginx -c /lab/k/code/ch05/h3.conf       # TLS + HTTP/3 on 8443</pre>`, 'lam')}
<p style="margin:0;font-size:20px">UDP echo at <code class="i">10.10.2.10:9999</code> · HTTP/3 vhost on UDP+TCP <code class="i">8443</code> · real Internet via the <code class="i">internet</code> container</p>` },

  { t: 'Requirements', to: true, body: `
${steps([
    '<b>R1 Read a UDP exchange</b> — capture one echo and show there is no handshake (just datagrams)',
    '<b>R2 Best effort</b> — send 20 datagrams through 30% loss; report how many arrived and whether the sender knew',
    '<b>R3 The HTTP/3 server side</b> — show nginx listening on UDP <b>and</b> TCP 8443 (the HTTP/3 fingerprint)',
    '<b>R4 Discovery</b> — find the <code class="i">Alt-Svc: h3</code> header on the lab server and on a real site',
    '<b>R5 Blocked QUIC</b> — drop UDP 8443; prove the site still returns 200 over HTTP/2',
    '<b>R6 Recommendation</b> — a UDP-vs-TCP table for telemetry + an HTTP/3 go/no-go with evidence',
  ])}` },

  { t: 'Report template', giua: true, body: `
${box('', `<pre class="mono" style="font-size:19px;line-height:1.5;white-space:pre-wrap">## R1 UDP exchange      — labelled capture, no handshake
## R2 Best effort       — sent/received under loss, sender notified? (y/n)
## R3 HTTP/3 server      — ss -uln + ss -tln on 8443
## R4 Discovery         — Alt-Svc from lab + a real site
## R5 Blocked QUIC      — iptables rule, curl result (still 200?)
## R6 Recommendation     — telemetry: TCP or UDP + why; HTTP/3: on/off + why</pre>`, 'lam')}` },

  { t: 'Rubric — 10 points', giua: true, body: `
${bang(['Item', 'Pts', 'Full marks when'], [
    ['R1', '1.5', 'capture shows only UDP datagrams; the absence of SYN/ACK is named'],
    ['R2', '2', 'loss measured (e.g. 12/20); sender received no error — best-effort explained'],
    ['R3', '2', 'UDP and TCP listeners on 8443 both shown; UDP listener named as the HTTP/3 fingerprint'],
    ['R4', '1.5', 'Alt-Svc h3 found on the lab server and a real site; what a browser does with it'],
    ['R5', '2', 'UDP dropped, site still 200 over h2; silent fallback explained'],
    ['R6', '1', 'a defensible telemetry decision and HTTP/3 go/no-go, each with a reason from the lab'],
  ], { fs: 18 })}` },

  { t: 'Hints by level', to: true, giua: true, body: `
${steps([
    'R1: <code class="i">tcpdump -w /tmp/u.pcap udp port 9999</code> while <code class="i">socat - UDP:10.10.2.10:9999</code> runs',
    'R2: <code class="i">tc qdisc add dev eth0 root netem loss 30%</code> on the client, then <code class="i">node udp-send.mjs</code>',
    'R3: <code class="i">ss -ulnp</code> and <code class="i">ss -tlnp</code> for port 8443 on <code class="i">nfd-web</code>',
    'R4: <code class="i">curl -sk --http2 -D - https://localhost:8443/</code>; and from <code class="i">internet</code>: a real site',
    'R5: <code class="i">iptables -A INPUT -p udp --dport 8443 -j DROP</code>, then <code class="i">curl -sk --http2 -w "%{http_code}"</code>',
  ])}` },

  { t: 'Going further', to: true, giua: true, body: `
${cards([
    ['Telemetry v2', 'Add a sequence number to the UDP sender so the receiver can drop stale updates — the first step toward QUIC.'],
    ['Measure h3', 'From a browser, open a real HTTP/3 site and read the Protocol column; force fallback by blocking UDP on your own machine.'],
    ['Capstone', 'HTTP/3 and the UDP decision both return in the Chapter 13 whole-path project.'],
  ])}` },

  { t: 'What this lab proves', to: true, giua: true, body: `
<ul>
<li>You can <b>read a UDP exchange</b> and explain why it has no handshake and no retransmission</li>
<li>You can <b>measure best-effort loss</b> and argue when that is the right trade-off</li>
<li>You can <b>identify HTTP/3</b> from the server side (UDP listener + Alt-Svc) and reproduce its safe fallback</li>
<li>You can make a <b>transport recommendation</b> — TCP, UDP or QUIC — backed by evidence</li>
</ul>
<p style="margin:0">${kw('UDP', 'gói dữ liệu')} ${kw('best effort', 'nỗ lực tối đa')} ${kw('HTTP/3', 'HTTP thế hệ 3')} ${kw('Alt-Svc', 'dịch vụ thay thế')} ${kw('fallback', 'đường lùi')}</p>` },
]);
