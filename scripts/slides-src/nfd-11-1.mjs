/**
 * nfd-11-1 — Networking for Developers, bài 11.1 "tcpdump: bắt gói trên máy chủ không giao diện" (slug netdev-11-1-tcpdump). Bài MỞ CHƯƠNG 11.
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c111-*.out.txt) — bắt một curl, ghi .pcap, đọc lại bắt tay + GET + 200.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-11-1', code: 'NFD 11.1', title: 'tcpdump on a headless server', sub: 'Networking for Developers · Chapter 11' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 11 — Troubleshooting', bai: '11.1' }, [
  { cover: true, t: 'tcpdump: capture on a headless server', sub: 'See the actual packets where the problem is —<br>no GUI, filtered, saved for Wireshark', nhan: 'Chapter 11 · Lesson 11.1' },

  { t: 'What you will be able to do after Chapter 11', to: true, giua: true, body: `
<ul>
<li><b>Capture packets</b> on a server with no GUI (<code class="i">tcpdump</code>), with BPF filters, into a <code class="i">.pcap</code></li>
<li><b>Read a capture</b> in Wireshark/tshark: follow a TCP stream, spot a retransmit or a slow handshake</li>
<li><b>Measure the path</b>: <code class="i">curl -w</code> per-stage timing, <code class="i">ping</code>, <code class="i">mtr</code>, <code class="i">iperf3</code></li>
<li><b>Diagnose by layers</b>: DNS → routing → port → TLS → HTTP → app, one command each</li>
<li>Turn "it's slow / it's broken" into a <b>measurement</b> that names the layer</li>
</ul>` },

  { t: 'Why capture on the server itself', giua: true, body: `
${box('', 'The hardest bugs — a timeout, a reset, a handshake that stalls — are only visible <b>where they happen</b>: on the server, often inside a container, with no browser and no GUI. <code class="i">tcpdump</code> is the tool that lets you see the actual packets there, over SSH, and save them for later analysis.', 'lam')}
${steps([
    'Reproduce the problem on the box where it occurs (prod server, container)',
    'Capture the relevant packets with a <b>filter</b> (don’t drown in traffic)',
    'Save to a <code class="i">.pcap</code> and open it in Wireshark on your laptop',
  ])}` },

  { t: 'A capture on the lab', body: `
${term(ra('c111-tcpdump', 'tcpdump -r', 1, { cut: 92, max: 9 }), { sm: true, title: 'read back the .pcap: SYN, SYN-ACK, ACK, GET, 200, FIN' })}
${box('', 'We captured one <code class="i">curl</code> to the web server and read the <code class="i">.pcap</code> back. The whole conversation is there: the <b>handshake</b> (<code class="i">[S]</code>, <code class="i">[S.]</code>, <code class="i">[.]</code>), the <code class="i">GET / HTTP/1.1</code>, the <code class="i">200 OK</code>, and the close (<code class="i">[F.]</code>). Every byte of Chapters 4–7, now visible as packets.', 'xanh')}` },

  { t: 'BPF filters: catch only what matters', giua: true, body: `
${bang(['Filter', 'Captures'], [
    ['<code class="i">host 10.10.2.10</code>', 'only traffic to/from that host'],
    ['<code class="i">tcp port 80</code>', 'only TCP on port 80'],
    ['<code class="i">host X and port 443</code>', 'combine with and / or / not'],
    ['<code class="i">tcp[tcpflags] & tcp-syn != 0</code>', 'only SYN packets (handshakes)'],
  ], { fs: 18 })}
${box('', 'A busy server sends thousands of packets a second — an unfiltered capture is useless. A <b>BPF filter</b> (Berkeley Packet Filter) captures only the conversation you care about, so the <code class="i">.pcap</code> stays small and readable.', 'lam')}` },

  { t: 'Save now, analyse later', giua: true, body: `
${steps([
    '<code class="i">tcpdump -i eth0 -w cap.pcap "tcp port 80 and host X"</code> — write raw packets to a file',
    'Copy <code class="i">cap.pcap</code> off the server (<code class="i">scp</code>) and open it in <b>Wireshark</b> (next lesson)',
    'Read it back on the server with <code class="i">tcpdump -r cap.pcap</code> when there is no GUI',
  ])}
${box('', 'The <code class="i">-w</code>/<code class="i">-r</code> pair separates <b>capturing</b> (fast, on the server, minimal overhead) from <b>analysing</b> (rich, in Wireshark, on your machine). Capture tight, analyse later.', 'lam')}` },

  { t: 'Capturing inside a container', giua: true, body: `
${box('Key idea', 'A container has its <b>own</b> network namespace, so <code class="i">tcpdump</code> on the host may not see its traffic. Enter the container’s namespace first: <code class="i">nsenter -t &lt;pid&gt; -n tcpdump …</code> (or <code class="i">docker run --net container:&lt;name&gt;</code> a capture sidecar).', 'do2')}
${steps([
    'Find the container’s main PID (<code class="i">docker inspect</code>)',
    '<code class="i">nsenter -t PID -n tcpdump -i eth0 -w /tmp/cap.pcap …</code> captures <b>inside</b> it',
    'Needs <code class="i">NET_RAW</code> (and <code class="i">NET_ADMIN</code> for nsenter) — the lab grants them',
  ])}` },

  { t: 'What a capture tells you', giua: true, body: `
${bang(['You see…', 'It means'], [
    ['SYN with no SYN-ACK', 'nothing listening / firewall dropping — a port problem'],
    ['repeated SYN / retransmits', 'packet loss or an unreachable peer'],
    ['RST', 'the peer actively refused or reset'],
    ['a long gap before data', 'the slow hop is between those two packets'],
  ], { fs: 18 })}
${box('', 'The packets do not lie. A capture turns "the connection is weird" into a precise statement about which side sent what, and when — the raw material for the next lesson’s analysis.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>tcpdump</b> captures the actual packets on the server/container where a bug lives — no GUI needed</li>
<li>A <b>BPF filter</b> (<code class="i">host</code>, <code class="i">port</code>, <code class="i">tcp</code>) keeps the capture small and readable</li>
<li><code class="i">-w cap.pcap</code> saves; open it in <b>Wireshark</b> later, or <code class="i">-r</code> to read on the box</li>
<li>Inside a container, capture in its namespace (<code class="i">nsenter -t PID -n</code>)</li>
<li>The capture shows the handshake, the request, retransmits, resets — the raw truth to analyse next</li>
</ul>
<p style="margin:0">${kw('tcpdump', 'bắt gói')} ${kw('BPF filter', 'bộ lọc gói')} ${kw('.pcap', 'tệp bắt gói')} ${kw('nsenter', 'vào namespace')} ${kw('-w / -r', 'ghi / đọc')}</p>` },
]);
