/**
 * nfd-lab-11 — Networking for Developers, Lab 11 "Chẩn đoán một sự cố của LabFlow theo tầng" (slug netdev-11-5-lab-chan-doan).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c111..c114-*.out.txt).
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-lab-11', code: 'NFD LAB 11', title: 'Diagnosing a LabFlow incident by layers', sub: 'Networking for Developers · Chapter 11' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 11 — Troubleshooting', bai: 'Lab 11' }, [
  { cover: true, t: 'Lab 11 — Diagnosing a LabFlow incident by layers', sub: 'Capture, follow, measure, and walk the layers —<br>turn "it’s broken" into a named layer', nhan: 'Chapter 11 · Lab 11 · Course project part 11' },

  { t: 'The situation', giua: true, body: `
${box('', 'LabFlow has an incident: a request that is slow and flaky, and nobody can agree whether it is the network or the app. You settle it with evidence: capture the packets, read the stream, measure the path, and walk the layered checklist until one layer names itself.', 'lam')}
${steps([
    'Capture and read the actual packets (tcpdump → tshark)',
    'Measure where the time goes (curl -w, ping, mtr, iperf3)',
    'Walk DNS → routing → port → TLS → HTTP → app',
  ])}` },

  { t: 'The system', giua: true, body: `
${bang(['Piece', 'Address', 'Role'], [
    ['web (nginx)', '10.10.2.10:80', 'the service under investigation'],
    ['TLS endpoint', '10.10.2.10:8443', 'self-signed cert for the TLS layer'],
    ['api (Node)', '10.10.2.20:3000', 'the app layer (JSON) + iperf3 server'],
    ['router', '10.10.1.254', '20 ms netem delay for the path measurement'],
  ], { fs: 18 })}
${box('', 'Bring it up with <code class="i">bash lab/code/dung-output-ch11.sh</code>. Real <code class="i">tcpdump</code>, <code class="i">tshark</code>, <code class="i">mtr</code>, <code class="i">iperf3</code>, <code class="i">openssl</code> — the developer’s network toolbox on one host.', 'lam')}` },

  { t: 'Requirements', giua: true, body: `
${steps([
    '<b>R1 Capture</b>: tcpdump one request to <code class="i">.pcap</code>, read it back, identify the handshake + GET + 200 + FIN',
    '<b>R2 Analyse</b>: tshark the same pcap — filter to HTTP, and follow the TCP stream',
    '<b>R3 Measure</b>: curl -w stages, ping RTT/loss, mtr per-hop, iperf3 bandwidth; say which is latency vs bandwidth',
    '<b>R4 Diagnose</b>: walk DNS → routing → port → TLS → HTTP → app, one command each, and read each answer',
  ])}` },

  { t: 'Report template', giua: true, body: `
${steps([
    '<b>R1</b> — the capture read back, with the handshake/GET/200/FIN labelled',
    '<b>R2</b> — the HTTP summary and the followed stream',
    '<b>R3</b> — the curl -w stages, RTT/loss, slow hop, bandwidth; latency vs bandwidth',
    '<b>R4</b> — each layer’s command and answer; which layer a hypothetical failure would be',
  ])}
${box('', 'Paste the proof line for each: a captured packet, a followed stream, a timing, a port/cert result — not a description.', 'lam')}` },

  { t: 'Rubric — 10 points', giua: true, body: `
${bang(['Item', 'Pts', 'Full marks when'], [
    ['R1', '2.5', 'pcap captured + read back; handshake/GET/200/FIN identified'],
    ['R2', '2.5', 'HTTP filtered; one TCP stream followed'],
    ['R3', '2.5', 'curl -w / ping / mtr / iperf3 run; latency vs bandwidth stated'],
    ['R4', '2.5', 'all six layers checked with one command each, answers read'],
  ], { fs: 18 })}
${box('', 'Full marks is <b>evidence</b>, not opinion: a captured packet, a followed stream, a measured timing, a layer answer. Half marks for a right conclusion with no proof line — "it’s the app" without the pre-response gap, or "the network" without the retransmissions.', 'lam')}` },

  { t: 'Hints', giua: true, body: `
${steps([
    'R1: <code class="i">tcpdump -i eth0 -w /tmp/cap.pcap "tcp port 80 and host 10.10.2.10"</code> during a <code class="i">curl</code>; then <code class="i">tcpdump -r</code>',
    'R2: <code class="i">tshark -r /tmp/cap.pcap -Y http -T fields …</code>; <code class="i">-z follow,tcp,ascii,0</code>',
    'R3: <code class="i">curl -w</code> template; <code class="i">ping -c 3</code>; <code class="i">mtr --report</code>; <code class="i">iperf3 -c</code>',
    'R4: <code class="i">getent/dig</code> · <code class="i">ip route get</code> · <code class="i">nc -zv</code> · <code class="i">openssl s_client</code> · <code class="i">curl -I</code> · app JSON',
  ])}` },

  { t: 'Solution — the four checks', body: `
${term(ra('c111-tcpdump', 'tcpdump -r', 1, { cut: 86, max: 6 }), { sm: true, title: 'R1 — the handshake, GET, 200, FIN in the capture' })}
${term(ra('c112-tshark', 'tshark -r /tmp/cap.pcap -Y http', 1), { sm: true, title: 'R2 — HTTP: GET / and the 200' })}
${term(ra('c113-path', 'ping', 1), { sm: true, title: 'R3 — RTT ~20–40 ms, 0% loss (latency)' })}
${term(ra('c114-checklist', 'nc -zv', 1), { sm: true, title: 'R4 — port layer: 80 open, 81 refused' })}` },

  { t: 'What this lab proves', to: true, giua: true, body: `
<ul>
<li>You can <b>capture</b> packets on a headless host and read a <code class="i">.pcap</code> back</li>
<li>You can <b>follow a stream</b> and filter a capture to the HTTP that happened</li>
<li>You can <b>measure the path</b> and separate latency from bandwidth</li>
<li>You can <b>walk the layers</b> and name where a request would fail — the method that ends guessing</li>
</ul>
<p style="margin:0">${kw('tcpdump', 'bắt gói')} ${kw('tshark', 'phân tích')} ${kw('curl -w / mtr', 'đo đường')} ${kw('checklist', 'theo tầng')}</p>` },
]);
