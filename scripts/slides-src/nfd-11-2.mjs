/**
 * nfd-11-2 — Networking for Developers, bài 11.2 "Wireshark: theo một luồng, đọc một request chậm" (slug netdev-11-2-wireshark).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c112-*.out.txt) — tshark đọc cùng .pcap: lọc HTTP + theo luồng TCP.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-11-2', code: 'NFD 11.2', title: 'Wireshark: follow a stream, read a slow request', sub: 'Networking for Developers · Chapter 11' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 11 — Troubleshooting', bai: '11.2' }, [
  { cover: true, t: 'Wireshark: follow a stream, read a slow request', sub: 'Turn a .pcap into an answer —<br>the stream, the retransmit, the slow hop', nhan: 'Chapter 11 · Lesson 11.2' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li><b>tshark</b>: Wireshark on the command line, reading the <code class="i">.pcap</code> you captured</li>
<li><b>Filter to HTTP</b>: pull the method, URI and status out of the capture</li>
<li><b>Follow a TCP stream</b>: reassemble one conversation from scattered packets</li>
<li><b>Capture vs display filters</b>: narrow at capture time vs while reading</li>
<li><b>Read a slow request</b>: retransmits, zero window, RST, and where the time went</li>
</ul>` },

  { t: 'tshark = Wireshark on the CLI', giua: true, body: `
${box('', 'Wireshark is the GUI you open the <code class="i">.pcap</code> in on your laptop; <code class="i">tshark</code> is the same engine on the command line, for when you are on the server over SSH. Same dissectors, same filters, same follow-stream — just text output. Learn tshark and you can analyse a capture anywhere.', 'lam')}
${steps([
    'Capture with <code class="i">tcpdump -w</code> (last lesson)',
    'Analyse with <code class="i">tshark -r</code> on the box, or Wireshark on your laptop',
    'Same filter language and dissectors in both',
  ])}` },

  { t: 'Filter to HTTP', body: `
${term(ra('c112-tshark', 'tshark -r /tmp/cap.pcap -Y http', 1), { sm: true, title: '-Y http: pull method / URI / status from the capture' })}
${box('', 'A <b>display filter</b> (<code class="i">-Y http</code>) keeps only the HTTP packets, and <code class="i">-T fields -e ...</code> prints just the fields you ask for — here the request’s method and URI and the response’s status code. The capture becomes a two-line summary of the exchange.', 'xanh')}` },

  { t: 'Follow a TCP stream', body: `
${term(ra('c112-tshark', 'tshark -r /tmp/cap.pcap -q', 1, { max: 12 }), { sm: true, title: 'follow,tcp,0: reassemble one conversation' })}
${box('', '<b>Follow stream</b> reassembles one TCP conversation from its scattered packets into the bytes each side sent — here the raw <code class="i">GET / HTTP/1.1</code> request with its headers. This is the single most useful button in Wireshark: it turns packets back into the request/response you can read.', 'xanh')}` },

  { t: 'Capture filter vs display filter', giua: true, body: `
${bang(['', 'Capture filter', 'Display filter'], [
    ['When', 'at capture time (BPF)', 'while reading a .pcap'],
    ['Syntax', '<code class="i">tcp port 80</code>', '<code class="i">http</code>, <code class="i">tcp.analysis.retransmission</code>'],
    ['Effect', 'fewer packets saved', 'hide/show already-captured packets'],
  ], { fs: 19 })}
${box('', 'Capture filters (BPF, the last lesson) decide what ends up in the file — keep them broad enough not to miss the bug. Display filters (Wireshark/<code class="i">-Y</code>) slice the saved packets any way you like, as often as you like. Capture broad, display narrow.', 'lam')}` },

  { t: 'What to look for in a slow request', giua: true, body: `
${bang(['Signal', 'Means'], [
    ['<code class="i">tcp.analysis.retransmission</code>', 'a packet was lost and re-sent — loss on the path'],
    ['<code class="i">tcp.analysis.zero_window</code>', 'a receiver’s buffer is full — the app is not reading fast enough'],
    ['<code class="i">tcp.flags.reset==1</code>', 'someone reset the connection (refused, timeout, crash)'],
    ['a big gap before the response', 'the server (or a hop) was slow <b>there</b>'],
  ], { fs: 18 })}
${box('', 'These display filters jump straight to the pathology. "The request is slow" becomes "there are 40 retransmissions between client and the LB" or "the response sat for 3 s at the origin" — a specific, fixable statement.', 'lam')}` },

  { t: 'Reading a slow request — the method', giua: true, body: `
${steps([
    '<b>Follow the stream</b> to confirm the request/response are what you expect',
    'Look at the <b>timestamps</b>: where is the big gap? that hop owns the latency',
    'Check for <b>retransmissions</b> / <b>zero windows</b> / <b>RST</b> — loss, backpressure, or a reset',
  ])}
${box('', 'A capture answers "is it the network or the app?" directly: a gap with no retransmissions, right before the response, is the <b>server thinking</b> (app/DB slow); retransmissions and gaps scattered across the transfer are the <b>network</b> losing packets.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>tshark</b> is Wireshark on the CLI — same dissectors and filters, reading your <code class="i">.pcap</code> on the server</li>
<li><b>Filter to HTTP</b> (<code class="i">-Y http</code>) to pull method/URI/status; <b>follow a TCP stream</b> to read the whole conversation</li>
<li><b>Capture filters</b> (BPF) narrow at capture time; <b>display filters</b> slice the saved packets</li>
<li>Look for <b>retransmissions</b> (loss), <b>zero window</b> (backpressure), <b>RST</b> (reset), and the <b>big time gap</b></li>
<li>A gap before the response = server thinking; scattered retransmits = network losing packets</li>
</ul>
<p style="margin:0">${kw('tshark', 'Wireshark CLI')} ${kw('display filter', 'bộ lọc hiển thị')} ${kw('follow stream', 'theo luồng')} ${kw('retransmission', 'truyền lại')} ${kw('zero window', 'cửa sổ không')}</p>` },
]);
