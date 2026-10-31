/**
 * nfd-lab-1 — Networking for Developers, Lab chương 1 "Giải phẫu một request của LabFlow" (slug netdev-1-6-lab-giai-phau-request).
 * Đề + yêu cầu + thang điểm (không lộ lời giải). Khuôn _nfd-chung.mjs.
 */
import { lamDeck, two, box, cards, steps, bang, topo, kw } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-lab-1', code: 'NFD LAB 1', title: 'Lab 1 — Dissect one request of LabFlow', sub: 'Networking for Developers · Chapter 1' };

export const slides = lamDeck({ chuong: 'Chapter 1 — Lab 1' }, [
  { cover: true, t: 'Lab 1 — Dissect one request<br>of LabFlow', sub: 'Every machine, every header, every connection<br>of one GET — then break it and fix it', nhan: 'Chapter 1 · Lab' },

  { t: 'The situation', to: true, giua: true, body: `
${box('Monday stand-up', 'A teammate on the LabFlow project says: “Our router rewrites the client’s IP address, that’s why the API sees 10.10.2.10.” Another adds: “And nginx keeps one connection to the API open, so it’s fast.” Your lead asks you to <b>prove or disprove both claims with captures</b>, and write a one-page report.', '')}
<ul>
<li>Part 1 of the course project: a <b>request-path map</b> of mini LabFlow you will extend in every chapter</li>
<li>Time: 90–120 minutes · Tools: ip, ss, tcpdump, tshark, curl, nc</li>
</ul>` },

  { t: 'The system you will dissect', giua: true, body: `${topo({ hl: ['client', 'router', 'web', 'api'] })}
<p style="margin:0;font-size:20px">One request: <code class="i">curl http://10.10.2.10/api/lab1</code> from <b>client</b> → router → nginx on <b>web</b> → Node on <b>api</b>.</p>` },

  { t: 'Requirements', to: true, body: `
${steps([
    '<b>R1 Map</b> — for all five machines: IP, MAC, network, listening sockets, router forwarding on/off',
    '<b>R2 Layers</b> — capture the request on the client; show the 4 headers and their byte sizes',
    '<b>R3 Hop</b> — capture the same request on the web side; list what changed and what did not',
    '<b>R4 ARP</b> — with empty caches, which ARP requests happen, and who answers each',
    '<b>R5 Second connection</b> — find nginx → API; which IP/port does the API see, and why',
    '<b>R6 Break &amp; fix</b> — make <code class="i">/hong/</code> return 200 by starting a service on port 4999 — wrong first, then right',
  ])}` },

  { t: 'Rubric — 10 points', giua: true, body: `
${bang(['Req.', 'Points', 'Full marks when…'], [
    ['R1', '1.5', 'table complete and correct for 5 machines, with the command used'],
    ['R2', '2', 'sizes 14/20/32/83 shown from a capture, each header named, hex offsets given'],
    ['R3', '2', 'MACs + TTL + checksum changed, IPs + ports + payload unchanged — with both captures'],
    ['R4', '1.5', 'request(s) for the next hop only, broadcast vs unicast reply explained'],
    ['R5', '1.5', 'the nginx → API connection captured; X-Forwarded-For and the HTTP version explained'],
    ['R6', '1.5', '502 reproduced with 127.0.0.1, fixed with 0.0.0.0, proved with ss and curl'],
  ], { fs: 20 })}
<p class="nho" style="margin:0">−1 for any claim without evidence (a command and its output). Report: one page, Markdown.</p>` },

  { t: 'How to work', to: true, giua: true, body: `
${cards([
    ['Capture first, think later', 'Start tcpdump with <code class="i">-w</code> before the request; wait 2 s; stop with Ctrl-C (SIGINT).'],
    ['One claim, one proof', 'Every sentence in the report points to an output you pasted.'],
    ['Hints by level', 'Open hint 1 only after 10 minutes stuck; hint 2 after 20. The solution is last.'],
  ])}` },

  { t: 'Going further', to: true, giua: true, body: `
<ul>
<li>Make nginx keep connections to the API open (HTTP/1.1 + keep-alive upstream) and prove it with <code class="i">seenFrom</code> and ss</li>
<li>Write <code class="i">dissect(hex)</code> in JavaScript that prints the report of R2 from raw bytes — Code Lab, lab module</li>
<li>Capture on the router itself: which interface sees which MAC pair?</li>
</ul>
<p style="margin:0">${kw('evidence', 'bằng chứng')} ${kw('request path', 'đường đi của request')} ${kw('upstream', 'máy chủ phía sau proxy')}</p>` },
]);
void two;
