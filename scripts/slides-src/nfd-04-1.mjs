/**
 * nfd-04-1 — Networking for Developers, bài 4.1 "Bắt tay ba bước và đóng kết nối" (slug netdev-4-1-bat-tay).
 * Bài MỞ CHƯƠNG 4 (slide 2 = "Chương 4 trong một khung"). Output = CHẠY THẬT đọc bằng ra() (lab/out/c41-*.out.txt).
 */
import { lamDeck, sh, two, box, kw, bang, steps, seq, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-04-1', code: 'NFD 4.1', title: 'The three-way handshake and connection teardown', sub: 'Networking for Developers · Chapter 4' };
const C = { tcp: '#2f7d4f', ip: '#336791', red: '#c0392b' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 4 — TCP', bai: '4.1' }, [
  { cover: true, t: 'The three-way handshake<br>and connection teardown', sub: 'SYN, SYN-ACK, ACK — then FIN and RST,<br>read on the wire', nhan: 'Chapter 4 · Lesson 4.1' },

  { t: 'Chapter 4 at a glance — what you can do after it', to: true, giua: true, body: `
<ul>
<li><b>Read a whole TCP connection in a capture</b>: handshake, data, teardown, and tell SYN/FIN/RST apart</li>
<li><b>Explain why every new connection costs a round trip</b> — and measure it with <code class="i">curl -w</code></li>
<li><b>Follow reliability</b>: sequence numbers, ACKs, retransmission, SACK, and head-of-line blocking</li>
<li><b>See congestion control work</b>: slow start, the congestion window, Reno / CUBIC / BBR</li>
<li><b>Diagnose states</b>: TIME_WAIT, port exhaustion, the accept queue, keep-alive and pools in your code</li>
</ul>
${box('Why a developer needs this', 'TCP is under almost every request your code makes — HTTP, database drivers, Redis, gRPC. “The API is slow”, “connections drop at night”, “we run out of ports under load” are all read, not guessed, once you can see TCP.', 'lam')}` },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>three-way handshake</b> in a real capture, byte by byte</li>
<li>Why a <b>new connection</b> always costs one round trip — measured</li>
<li>How <b>keep-alive</b> makes the second request skip the handshake</li>
<li>Three ways a connection ends: <b>FIN</b> (polite), <b>RST</b> (refused), <b>no answer</b> (SYN retransmit)</li>
<li>Why <b>RTT is the floor</b> under every latency number you will ever chase</li>
</ul>` },

  { t: 'The three-way handshake', giua: true, body: `
${seq('client 10.10.1.10', 'web 10.10.2.10', [
    { d: 'r', t: 'SYN', s: 'seq=x', ms: '0.000' },
    { d: 'l', t: 'SYN, ACK', s: 'seq=y ack=x+1', ms: '½ RTT' },
    { d: 'r', t: 'ACK', s: 'ack=y+1', ms: '1 RTT' },
    { d: 'r', t: 'GET / HTTP/1.1', c: '#e06d10' },
    { d: 'l', t: 'HTTP/1.1 200 OK', c: '#e06d10' },
  ])}
${box('', 'Three packets settle the connection: each side tells the other its starting <b>sequence number</b> and acknowledges the other’s. Only after the third packet (the ACK) may data flow — so the first byte of your request waits <b>one full round trip</b>.', 'lam')}` },

  { t: 'Read it on the wire', body: `
${term(ra('c41-tay', 'tcpdump', 1, { max: 11, cut: 92 }), { sm: true, title: 'nfi: one curl, captured at the client (router adds 25 ms to replies)' })}
${steps([
    '<b>[S]</b> SYN out · <b>[S.]</b> SYN-ACK back (the 25 ms gap = the delayed reply) · <b>[.]</b> the ACK',
    '<b>[P.]</b> GET pushed · server <b>[.]</b> acks then <b>[P.]</b> sends the 200 OK',
    'Each <code class="i">ack</code> = “I have everything up to here, send the next byte”',
    'The last four — <b>[F.] [.] [F.] [.]</b> — are the four-way teardown',
  ])}` },

  { t: 'Every new connection costs a round trip', giua: true, body: `
${term(ra('c41-rtt', 'for i', 1, { max: 7 }), { sm: true, title: 'A. a fresh connection each time' })}
${box('', 'Each request pays <b>connect ≈ 26 ms</b> (the handshake’s delayed reply) before any data. <b>TTFB ≈ 55 ms</b> = handshake + one more round trip for the request itself.', 'lam')}
${steps([
    '<code class="i">time_connect</code> = when the TCP handshake finished — one round trip',
    '<code class="i">time_starttransfer</code> (TTFB) = when the first response byte arrived',
    'The gap between them is the request/response round trip; the handshake is pure overhead you pay <b>per connection</b>',
  ])}` },

  { t: 'Keep-alive skips the handshake', body: `
${term(ra('c41-rtt', 'curl -so /dev/null -w "keepalive', 1), { sm: true, title: 'B. three requests on ONE connection' })}
${box('', 'The first request pays the handshake (<b>51 ms</b>); the next two reuse the open connection and drop to <b>~27 ms</b> — one round trip, no handshake. This is why HTTP keep-alive, connection pools and <code class="i">Keep-Alive</code> headers matter (lesson 4.5).', 'xanh')}` },

  { t: 'Closing: the four-way teardown', body: `
${seq('client', 'web', [
    { d: 'r', t: 'FIN, ACK', s: 'I am done sending' },
    { d: 'l', t: 'ACK' },
    { d: 'l', t: 'FIN, ACK', s: 'so am I' },
    { d: 'r', t: 'ACK' },
  ])}
${box('', 'Each direction is closed on its own. The side that sends the first FIN waits in <b>TIME_WAIT</b> afterwards (lesson 4.4). A connection is full-duplex: one side can stop sending while the other keeps going.', 'lam')}` },

  { t: 'RST: nobody is listening on that port', giua: true, body: `
${term(ra('c41-reset', 'curl', 1, { max: 2 }), { sm: true, title: 'curl to a closed port: exit 7, instant' })}
${term(ra('c41-resetpcap', 'tcpdump', 1, { cut: 92 }), { sm: true, title: 'on the wire: SYN out, R (reset) straight back' })}
${box('', 'A closed port answers the SYN with <b>RST</b> at once — “Connection refused”, exit 7, milliseconds. No handshake ever completes, so there is <b>no TIME_WAIT</b>. Very different from a request that just hangs.', 'do2')}` },

  { t: 'No answer: SYN retransmit, then give up', giua: true, body: `
${term(ra('c41-synpcap', 'tcpdump', 1, { max: 10, cut: 92 }), { sm: true, title: 'SYN into a black hole (router drops everything to .99)' })}
${box('', 'Silently dropped SYNs are retransmitted — first ~1 s apart, then <b>doubling</b> (2 s, 4 s, 8 s…). After ~2 minutes <code class="i">curl</code> gives up with <b>exit 28</b> (timeout). A refused port fails in milliseconds; a black hole fails in minutes — the symptom names the cause, and it is why your code must set a connect timeout.', 'lam')}` },

  { t: 'RTT is the floor under everything', to: true, giua: true, body: `
${bang(['Ends', 'What you see', 'Cost'], [
    ['<b>FIN</b> teardown', 'polite close, both directions', 'normal; one side gets TIME_WAIT'],
    ['<b>RST</b>', '“Connection refused” instantly', 'port closed / app crashed — fast fail'],
    ['SYN, no answer', 'retransmit 1, 2, 4, 8 s… then timeout', 'firewall drop / dead host — slow fail'],
  ], { fs: 20 })}
${box('', 'You cannot make a request faster than the round trips it needs. A new TLS+HTTP connection is 2–3 RTTs before the first byte. On a 150 ms RTT link that is half a second you pay <b>before</b> any work — which is why pooling and fewer connections win.', 'lam')}` },

  { t: 'Where this lives in the computer', giua: true, body: `
${bang(['Piece', 'What it is'], [
    ['the handshake', 'done by the <b>kernel</b> when you call <code class="i">connect()</code> — your code is blocked until the ACK'],
    ['sequence / ack numbers', 'per-connection counters in the kernel’s socket struct, one per byte'],
    ['TIME_WAIT', 'kept by the kernel for ~60 s after the active close, so late packets cannot confuse a new connection'],
    ['<code class="i">ss -tan</code>', 'reads those socket structs — the states you will debug with in 4.4'],
  ], { fs: 20 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Three packets — <b>SYN, SYN-ACK, ACK</b> — open a connection; the first data byte waits one round trip</li>
<li><b>Keep-alive</b> reuses the connection: the second request dropped from 51 ms to ~27 ms in the lab</li>
<li>Connections close with <b>FIN</b> (both directions), or die with <b>RST</b> (refused) or SYN timeout (black hole)</li>
<li><b>RST fails in milliseconds, a black hole in minutes</b> — the symptom names the cause</li>
<li><b>RTT is the floor</b>: fewer connections and pooling beat any micro-optimisation</li>
</ul>
<p style="margin:0">${kw('handshake', 'bắt tay ba bước')} ${kw('SYN / ACK', 'đồng bộ / báo nhận')} ${kw('FIN', 'kết thúc')} ${kw('RST', 'đặt lại')} ${kw('RTT', 'thời gian khứ hồi')} ${kw('TIME_WAIT', 'chờ tàn')}</p>` },
]);
