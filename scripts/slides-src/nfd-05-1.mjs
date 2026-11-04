/**
 * nfd-05-1 — Networking for Developers, bài 5.1 "UDP: gửi rồi quên" (slug netdev-5-1-udp). Bài MỞ CHƯƠNG 5.
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c51-*.out.txt).
 */
import { lamDeck, sh, two, box, kw, bang, steps, seq, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-05-1', code: 'NFD 5.1', title: 'UDP: fire and forget', sub: 'Networking for Developers · Chapter 5' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 5 — UDP and QUIC', bai: '5.1' }, [
  { cover: true, t: 'UDP: fire and forget', sub: 'No handshake, no ordering, no retransmission —<br>and why that is sometimes exactly right', nhan: 'Chapter 5 · Lesson 5.1' },

  { t: 'Chapter 5 at a glance — what you can do after it', to: true, giua: true, body: `
<ul>
<li><b>Read a UDP exchange</b> and explain why it has no handshake, ordering or retransmission</li>
<li>Say <b>when UDP is the right choice</b>: DNS, VoIP, games, live video — and what the app must do itself</li>
<li>Explain <b>QUIC</b>: a reliable, multiplexed transport rebuilt on UDP, with TLS 1.3 built in</li>
<li>Show <b>HTTP/3 discovery</b> (Alt-Svc) and the real server side — UDP 443 listening</li>
<li>Diagnose <b>when QUIC is blocked</b> and the browser falls back to TCP</li>
</ul>
${box('Why a developer needs this', 'DNS, real-time media and QUIC/HTTP-3 all ride UDP. Knowing what UDP does <em>not</em> give you — and what QUIC adds back — is how you choose a transport and debug “HTTP/3 works at home but not at the office”.', 'lam')}` },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>deal</b>: what UDP gives you (almost nothing) and what that buys (speed, control)</li>
<li><b>Fire and forget</b>: a UDP exchange on the wire — no handshake, just datagrams</li>
<li><b>Loss just happens</b>: 20 datagrams through 30% loss, measured</li>
<li><b>No connection state</b>: a UDP socket is always UNCONN, never TIME_WAIT</li>
<li>Where UDP wins, and the work your app must do that TCP would have done for you</li>
</ul>` },

  { t: 'UDP vs TCP: the deal', giua: true, body: `
${bang(['', 'TCP', 'UDP'], [
    ['Handshake', '3 packets before data', '<b>none</b> — send immediately'],
    ['Delivery', 'reliable (retransmit)', '<b>best effort</b> — lost is lost'],
    ['Ordering', 'in-order stream', '<b>none</b> — datagrams, any order'],
    ['Connection state', 'ESTAB, TIME_WAIT…', '<b>none</b> — just a socket'],
    ['Overhead', 'higher, but hands-off', '<b>tiny</b> — but you do the work'],
  ], { fs: 20 })}
${box('', 'UDP is the thinnest possible wrapper over IP: a source/destination port, a length, a checksum, and your bytes. Everything TCP does for you, UDP leaves to your application — which is the point when you want control or speed.', 'lam')}` },

  { t: 'Fire and forget', giua: true, body: `
${two(term(ra('c51-echo', 'printf', 1), { sm: true, title: 'send one datagram, get one back' }), term(ra('c51-wire', 'tcpdump', 1), { sm: true, title: 'on the wire: just UDP datagrams' }))}
${box('', 'No <b>[S]</b>, <b>[S.]</b>, <b>[.]</b> — no handshake at all. The first packet carries your data; the reply is a separate datagram.', 'xanh')}
${steps([
    'A TCP request was <b>10 packets</b> (lesson 4.1): 3 to open, data, 4 to close',
    'This UDP exchange is <b>2 useful datagrams</b>: question, answer',
    'Zero round trips of setup — one reason DNS and games chose UDP',
  ])}` },

  { t: 'Loss just happens — nobody retransmits', giua: true, body: `
${term(ra('c51-loss', 'node udp-send', 1), { sm: true, title: '20 datagrams through 30% packet loss' })}
${box('', 'The client sent 20; the server received <b>12</b>. The eight lost datagrams are simply <b>gone</b> — no ACK, no retransmit, and the sender never finds out.', 'do2')}
${steps([
    'Need them back? <b>Your application</b> must notice the gap and ask again',
    'Do not need them? UDP saved you the cost of recovering data you would discard',
    'TCP would have retransmitted all eight — useful for a file, useless for a voice packet',
  ])}` },

  { t: 'No connection, no state to leak', body: `
${term(ra('c51-noconn', 'ss -ulnp', 1), { sm: true, title: 'the UDP server socket: UNCONN' })}
${box('', 'A UDP socket is <b>UNCONN</b> — it exists the moment you <code class="i">bind()</code>, with no handshake and no per-peer state in the kernel. There is <b>no TIME_WAIT</b>, no accept queue, no port exhaustion from churn. One socket can talk to thousands of peers.', 'lam')}` },

  { t: 'Where UDP wins', giua: true, body: `
${bang(['Use', 'Why UDP', 'What the app adds'], [
    ['<b>DNS</b>', 'one tiny question, one answer — a handshake would double the cost', 'retry, switch to TCP if truncated'],
    ['<b>VoIP / video calls</b>', 'a late packet is useless — skip it, keep talking', 'jitter buffer, loss concealment'],
    ['<b>Games</b>', 'only the latest position matters', 'sequence numbers, interpolation'],
    ['<b>Live video</b>', 'drop a frame rather than stall', 'FEC, adaptive bitrate'],
  ], { fs: 19 })}
${box('', 'The pattern: when <b>fresh-but-lossy beats complete-but-late</b>, UDP wins. TCP’s reliability becomes a liability — a retransmitted voice packet arrives after the moment it was for.', 'lam')}` },

  { t: 'The app does the work TCP would', giua: true, body: `
${steps([
    'Need some packets back? Add your own <b>sequence numbers + ACKs</b> (this is half of what QUIC is — lesson 5.2)',
    'Need ordering? <b>Number</b> them and reorder in the app',
    'Need to not flood the network? Add your own <b>pacing / congestion control</b>',
    'Need a “connection”? Track peers in your app — the kernel will not',
  ])}
${box('', 'Rebuilding reliability on UDP by hand is exactly the trap QUIC exists to solve once and for all. Use raw UDP when you genuinely want best-effort; reach for QUIC when you want TCP’s guarantees without TCP’s limits.', 'lam')}` },

  { t: 'Where this lives in the computer', giua: true, body: `
${bang(['Piece', 'What it is'], [
    ['the socket', '<code class="i">SOCK_DGRAM</code>; <code class="i">sendto()</code>/<code class="i">recvfrom()</code> move one datagram each, no stream'],
    ['no connection', 'the kernel keeps no per-peer state; <code class="i">ss -u</code> shows only UNCONN sockets'],
    ['the header', '8 bytes: src port, dst port, length, checksum — then your payload'],
    ['loss', 'a dropped datagram is not tracked anywhere; detection is the app’s job'],
  ], { fs: 20 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>UDP is the thinnest wrapper over IP: ports, length, checksum — <b>no handshake, ordering, or retransmission</b></li>
<li>On the wire it is just <b>datagrams</b>; 20 sent through 30% loss, <b>12 arrived</b>, and the sender never knew</li>
<li>A UDP socket is always <b>UNCONN</b> — no TIME_WAIT, no port exhaustion, one socket to many peers</li>
<li>UDP wins when <b>fresh-but-lossy beats complete-but-late</b>: DNS, VoIP, games, live video</li>
<li>Anything TCP did for you, your app must do — which is why <b>QUIC</b> exists (lesson 5.2)</li>
</ul>
<p style="margin:0">${kw('UDP', 'giao thức gói dữ liệu')} ${kw('datagram', 'gói dữ liệu')} ${kw('best effort', 'nỗ lực tối đa')} ${kw('connectionless', 'không kết nối')} ${kw('fire and forget', 'gửi rồi quên')}</p>` },
]);
