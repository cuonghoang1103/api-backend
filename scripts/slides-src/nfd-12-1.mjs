/**
 * nfd-12-1 — Networking for Developers, bài 12.1 "Câu hỏi kinh điển và cách trả lời" (slug netdev-12-1-cau-hoi). Bài MỞ CHƯƠNG 12.
 * Output = CHẠY THẬT đọc bằng ra() — TÁI DÙNG output đã có (c113-path curl -w, c41-tay bắt tay, c45-ka keep-alive) làm BẰNG CHỨNG cho câu trả lời.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-12-1', code: 'NFD 12.1', title: 'Classic questions and how to answer them', sub: 'Networking for Developers · Chapter 12' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 12 — Interviews', bai: '12.1' }, [
  { cover: true, t: 'Classic questions and how to answer them', sub: 'The networking questions every interview asks —<br>answered with depth, and a measurement', nhan: 'Chapter 12 · Lesson 12.1' },

  { t: 'What Chapter 12 gives you', to: true, giua: true, body: `
<ul>
<li>The <b>classic questions</b> — URL → page, the handshake, TCP vs UDP, HTTP/1.1/2/3, TLS, DNS, CDN, LB</li>
<li>How to answer with <b>depth</b> — and back a claim with a <b>measurement</b>, not a definition</li>
<li><b>Scenario rounds</b>: diagnose from a symptom with the layered method (next lesson)</li>
<li><b>Certifications</b> worth knowing — and when a developer actually needs one</li>
<li>Turn everything you measured in this course into <b>interview answers that stand out</b></li>
</ul>` },

  { t: '"What happens when you type a URL and press Enter?"', giua: true, body: `
${steps([
    '<b>DNS</b> resolves the name to an IP (cache → resolver → root/TLD/authoritative)',
    '<b>TCP</b> 3-way handshake, then <b>TLS</b> handshake (for https)',
    '<b>HTTP</b> request → the server (maybe via CDN / load balancer) → response',
    'The browser <b>parses and renders</b>, fetching more resources (each a mini round of the above)',
  ])}
${box('', 'The best answer names the layers <b>in order</b> and knows which can be skipped (a warm DNS cache, a kept-alive connection, a CDN hit). You measured every one of these — so you can answer with numbers.', 'lam')}` },

  { t: 'Answer with a measurement', giua: true, body: `
${term(ra('c113-path', 'curl -s -o /dev/null -w "dns', 1), { sm: true, title: 'the same journey, timed: DNS, connect, TTFB, total' })}
${bang(['curl -w field', 'Is the time for', 'A big value blames'], [
    ['<code class="i">time_namelookup</code>', 'DNS resolution', 'DNS / resolver'],
    ['<code class="i">time_connect</code>', 'the TCP handshake', 'the network / distance'],
    ['<code class="i">time_starttransfer</code>', 'TTFB — server to first byte', 'the app / database'],
    ['<code class="i">time_total</code>', 'the whole request', '(the sum, + body download)'],
  ], { fs: 19 })}
${box('', 'A weak answer defines the stages; a <b>strong</b> one adds "and you can measure each" and names <code class="i">curl -w</code>. That one line separates someone who memorised a diagram from someone who has <b>used</b> it.', 'xanh')}` },

  { t: 'The 3-way handshake', body: `
${term(ra('c41-tay', 'tcpdump', 1, { max: 4, cut: 62 }), { sm: true, title: 'SYN → SYN-ACK → ACK, captured for real' })}
${bang(['Step', 'Carries', 'Establishes'], [
    ['<b>SYN</b>', 'client’s initial sequence number', 'client → server numbering'],
    ['<b>SYN-ACK</b>', 'server’s ISN + ack of client’s', 'server → client numbering'],
    ['<b>ACK</b>', 'ack of server’s ISN', 'both directions ready — data flows'],
  ], { fs: 20 })}
${box('', 'The depth answer: it establishes sequence numbers <b>both ways</b> so each side can detect loss and reorder — and it costs <b>one round trip before any request is sent</b>.', 'xanh')}
${steps([
    'That one RTT is why <b>keep-alive</b> (reuse the connection) and <b>HTTP/2</b> (one connection, many streams) matter',
    'For <code class="i">https</code> the TLS handshake adds more round trips on top — 1.3 cut it to ~1, resumption to ~0',
    'Bonus point to drop: "you pay the handshake once per connection, so the game is reusing connections"',
  ])}` },

  { t: 'TCP vs UDP', giua: true, body: `
${bang(['', 'TCP', 'UDP'], [
    ['Delivery', 'reliable, ordered, retransmits', 'best-effort, no guarantee'],
    ['Setup', '3-way handshake first', 'none — just send'],
    ['Use', 'web, APIs, anything that must arrive', 'DNS, video, games, QUIC'],
  ], { fs: 20 })}
${box('', 'The depth answer: "TCP gives reliability and order at the cost of a handshake and head-of-line blocking; UDP gives speed and control, so you build what you need on top — which is exactly what QUIC/HTTP/3 does."', 'lam')}` },

  { t: 'HTTP/1.1 vs 2 vs 3', giua: true, body: `
${bang(['Version', 'Key idea', 'Fixes'], [
    ['<b>1.1</b>', 'text, one request at a time per connection', 'keep-alive, but 6-connection limit'],
    ['<b>2</b>', 'multiplex many streams on one TCP connection', 'the 6-connection limit; still TCP HoL'],
    ['<b>3</b>', 'HTTP over QUIC (UDP)', 'TCP head-of-line blocking; faster setup'],
  ], { fs: 19 })}
${box('', 'The trap: "HTTP/2 is just faster." The real answer names <b>what each fixed</b> — multiplexing (2) removed the connection limit, QUIC (3) removed TCP head-of-line blocking and shaved the handshake. You read the frames yourself in Chapter 7.', 'lam')}` },

  { t: 'TLS and DNS, briefly', giua: true, body: `
${steps([
    '<b>TLS</b>: handshake agrees a cipher and a session key (ECDHE forward secrecy), the cert proves identity; 1.3 cut it to ~1 round trip',
    '<b>DNS</b>: recursive resolver walks root → TLD → authoritative, caches by TTL; a name can be Anycast to the nearest server',
    'Both are <b>latency</b> you can skip: TLS session resumption, a warm DNS cache, a CDN that terminates TLS nearby',
  ])}
${box('', 'Interviewers probe for whether you know these are <b>round trips</b> — and that the whole performance game is removing or shortening them.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Know the <b>URL → page</b> journey in order, and which layers can be skipped (cache, keep-alive, CDN)</li>
<li>Answer with a <b>measurement</b>: <code class="i">curl -w</code> stages, a captured handshake — not a memorised diagram</li>
<li><b>TCP vs UDP</b>: reliability + order vs speed + control (QUIC builds reliability on UDP)</li>
<li><b>HTTP/1.1 → 2 → 3</b>: name what each <b>fixed</b> (multiplexing, then TCP head-of-line via QUIC)</li>
<li>TLS and DNS are <b>round trips</b>; the performance game is removing or shortening them</li>
</ul>
<p style="margin:0">${kw('3-way handshake', 'bắt tay 3 bước')} ${kw('TCP vs UDP', 'tin cậy vs nhanh')} ${kw('HTTP/1.1/2/3', 'ghép kênh, QUIC')} ${kw('TTFB', 'byte đầu')} ${kw('round trip', 'vòng khứ hồi')}</p>` },
]);
