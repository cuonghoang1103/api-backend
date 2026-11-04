/**
 * nfd-04-2 — Networking for Developers, bài 4.2 "Độ tin cậy: số thứ tự, ACK và truyền lại" (slug netdev-4-2-tin-cay).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c42-*.out.txt).
 */
import { lamDeck, sh, two, box, kw, bang, steps, seq, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-04-2', code: 'NFD 4.2', title: 'Reliability: sequence numbers, ACKs and retransmission', sub: 'Networking for Developers · Chapter 4' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 4 — TCP', bai: '4.2' }, [
  { cover: true, t: 'Reliability: sequence numbers,<br>ACKs and retransmission', sub: 'How TCP turns a lossy network<br>into an ordered, reliable stream', nhan: 'Chapter 4 · Lesson 4.2' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>How TCP cuts your stream into <b>segments</b> and numbers every byte</li>
<li>What a <b>sequence number</b> and an <b>ACK</b> really count — read off the wire</li>
<li><b>Retransmission</b>: what happens when a segment is lost, measured under 3% loss</li>
<li><b>Duplicate ACKs, fast retransmit and SACK</b> — recovering without waiting for a timeout</li>
<li><b>Head-of-line blocking</b>: why one lost packet can stall data that already arrived</li>
</ul>` },

  { t: 'A byte stream, cut into segments', giua: true, body: `
${seq('client', 'web', [
    { d: 'r', t: 'GET /big', s: 'seq 1:78' },
    { d: 'l', t: 'data', s: 'seq 1:2897 (2896 B)', c: '#e06d10' },
    { d: 'r', t: 'ACK', s: 'ack 2897' },
    { d: 'l', t: 'data', s: 'seq 2897:… ', c: '#e06d10' },
  ])}
${box('', 'Your code writes a stream; TCP breaks it into <b>segments</b> of at most one MSS (1448 bytes here). Every byte has a number. The receiver’s <b>ACK</b> names the next byte it expects — a running receipt for the stream.', 'lam')}` },

  { t: 'Sequence and ACK, on the wire', body: `
${term(ra('c42-seq', 'tcpdump', 1, { max: 8, cut: 118 }), { sm: true, title: 'nfi-client: downloading /big (absolute sequence numbers, -S)' })}
${steps([
    'The GET is <b>77 bytes</b>: seq goes <code class="i">…836 → …913</code> and the server acks <code class="i">…913</code>',
    'The server’s first data segment is <b>2896 bytes</b>: seq <code class="i">…390 → …286</code> — exactly the payload length',
    'A sequence number is a <b>byte counter</b>, not a packet counter',
  ])}` },

  { t: 'Cumulative ACK: one number covers everything before it', giua: true, body: `
${bang(['Receiver has', 'It ACKs', 'Meaning'], [
    ['bytes 1–2896', 'ack 2897', '“send byte 2897 next”'],
    ['bytes 1–2896, 4345–5792 (a gap!)', 'ack 2897', 'still 2897 — the gap blocks the count'],
    ['the gap filled', 'ack 5793', 'jumps forward past everything now contiguous'],
  ], { fs: 20 })}
${box('', 'TCP’s ACK is <b>cumulative</b>: it names the first byte still missing. A gap in the middle freezes the ACK number even though later data arrived — which is the seed of both fast retransmit and head-of-line blocking.', 'lam')}` },

  { t: 'Loss happens: TCP retransmits', body: `
${term(ra('c42-loss', 'iperf3', 1, { max: 8 }), { sm: true, title: '3% loss + 25 ms delay — the Retr column counts retransmitted segments' })}
${box('', 'iperf3’s <b>Retr</b> column is retransmissions. Under 3% loss some segments are resent, yet the transfer still completes correctly and keeps a high rate — TCP hides the loss from your application entirely. You only pay in throughput and latency, never in corruption.', 'xanh')}` },

  { t: 'Recovering fast: duplicate ACKs + SACK', body: `
${term(ra('c42-sack', 'tshark', 1, { max: 9, cut: 118 }), { sm: true, title: 'the same transfer, read by tshark' })}
${steps([
    'A lost segment makes every later segment trigger a <b>Dup ACK</b> (same ack number, repeated)',
    '<b>SLE/SRE</b> are SACK edges: “I also have bytes 111534–117326” — the holes named exactly',
    'Three dup ACKs ⇒ <b>Fast Retransmission</b>: resend at once, without waiting for the timeout',
  ])}` },

  { t: 'Two ways to notice loss', giua: true, body: `
${bang(['Signal', 'How fast', 'Cost'], [
    ['<b>RTO timeout</b>', 'slow — wait a full retransmit timer (≥ 200 ms)', 'the old, expensive way; collapses the window'],
    ['<b>3 duplicate ACKs → fast retransmit</b>', 'fast — about one RTT', 'resend only the missing segment'],
    ['<b>SACK</b> (RFC 2018)', 'fast + precise', 'resend exactly the holes, not everything after them'],
  ], { fs: 20 })}
${box('', 'Without SACK, a sender that sees a gap may resend everything after it. SACK (the <code class="i">sackOK</code> option in the handshake) lets the receiver list the ranges it already has, so only the true holes are resent.', 'lam')}` },

  { t: 'Head-of-line blocking at the TCP layer', giua: true, body: `
${seq('sender', 'receiver', [
    { d: 'r', t: 'seg 1 ✓', c: '#2f7d4f' },
    { d: 'r', t: 'seg 2 ✗ LOST', c: '#c0392b' },
    { d: 'r', t: 'seg 3 ✓ (held)', c: '#e08a1e' },
    { d: 'r', t: 'seg 4 ✓ (held)', c: '#e08a1e' },
  ])}
${box('', 'Segments 3 and 4 <b>arrived</b>, but TCP must deliver the stream <b>in order</b>, so the kernel holds them until the retransmit of segment 2 fills the gap. One lost packet stalls bytes that are already in memory — the limitation HTTP/2 hits and QUIC/HTTP/3 fix (Chapter 5 and 7).', 'do2')}` },

  { t: 'Where this lives in the computer', giua: true, body: `
${bang(['Piece', 'What it is'], [
    ['segmentation', 'the kernel splits your <code class="i">write()</code> into ≤ MSS segments; you never see it'],
    ['retransmit buffer', 'the sender keeps every unacked byte in RAM until it is acked — that is what gets resent'],
    ['reorder queue', 'the receiver’s kernel holds out-of-order segments until the gap is filled'],
    ['<code class="i">ss -ti</code> / <code class="i">nstat</code>', 'expose <code class="i">retrans</code>, <code class="i">reordering</code>, SACK counters per socket'],
  ], { fs: 20 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>TCP numbers <b>every byte</b>; the ACK names the next byte expected — a cumulative receipt</li>
<li>Lost segments are <b>retransmitted</b>; your application sees an ordered, correct stream regardless</li>
<li><b>Three duplicate ACKs → fast retransmit</b>; <b>SACK</b> names the exact holes so only they are resent</li>
<li><b>Head-of-line blocking</b>: data that arrived is held until an earlier gap is filled</li>
<li>Read it with <code class="i">tshark</code> (Retransmission / Dup ACK) and <code class="i">ss -ti</code> (retrans, reordering)</li>
</ul>
<p style="margin:0">${kw('segment', 'đoạn')} ${kw('sequence / ACK', 'số thứ tự / báo nhận')} ${kw('retransmission', 'truyền lại')} ${kw('SACK', 'báo nhận chọn lọc')} ${kw('head-of-line blocking', 'nghẽn đầu hàng')}</p>` },
]);
