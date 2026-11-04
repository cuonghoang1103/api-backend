/**
 * nfd-13-5 — Networking for Developers, bài 13.5 "Tổng kết và câu chuyện phỏng vấn" (slug netdev-13-5-tong-ket). Capstone — bài CUỐI khoá.
 * Ôn cả khoá + câu chuyện phỏng vấn + rubric hoàn thành. Tái dùng số đo capstone (c133) làm neo.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-13-5', code: 'NFD 13.5', title: 'Review and interview story', sub: 'Networking for Developers · Chapter 13' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 13 — Capstone', bai: '13.5' }, [
  { cover: true, t: 'Review and the interview story', sub: 'The whole course in one request path —<br>and how to tell it', nhan: 'Chapter 13 · Lesson 13.5 · Capstone' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li>The <b>whole course</b> seen as one request path — every chapter is a hop</li>
<li>The capstone <b>recapped</b>: built → measured → tuned → broke → reported</li>
<li>The <b>before/after story</b>, in the numbers you produced</li>
<li>The <b>interview story</b>: one paragraph that sounds like experience</li>
<li>The capstone <b>completion rubric</b>, and where to go next</li>
</ul>` },

  { t: 'The whole course, one path', giua: true, body: `
${bang(['Hop', 'Chapters', 'What you can now do'], [
    ['Name → IP', 'DNS (3)', 'trace resolution, read TTL/Anycast'],
    ['Connect', 'IP/TCP/UDP/QUIC (1,2,4,5)', 'read a handshake, subnets, congestion'],
    ['Secure', 'TLS (6)', 'read a chain, dates, the handshake'],
    ['Request', 'HTTP 1.1→3 (7)', 'read versions, headers, multiplexing'],
    ['Edge', 'CDN/cache, LB (8,10)', 'cache, gzip, balance, read 5xx'],
    ['Live', 'real-time (9), tools (11)', 'SSE/WS, capture, measure, diagnose'],
  ], { fs: 17 })}
${box('', 'A single request touches all of it — and you can now measure and reason about every hop. That is the course.', 'lam')}` },

  { t: 'The capstone, recapped', giua: true, body: `
${steps([
    '<b>Built</b> a real path: client → nginx edge → API (the shape of production)',
    '<b>Measured</b> a baseline: every hop, in numbers, before touching anything',
    '<b>Tuned</b> one knob at a time and proved each gain as a before/after',
    '<b>Broke</b> it on purpose and diagnosed each failure to a layer',
    '<b>Reported</b> it: a baseline table, a before/after table, an incident, a story',
  ])}
${box('', 'Five verbs — build, measure, tune, break, report — are exactly what a performance/SRE engineer does. You did them on a real stack, with real numbers.', 'xanh')}` },

  { t: 'The before/after, in numbers', body: `
${term(ra('c133-toiuu', 'echo "== compression', 3), { sm: true, title: 'the win you can quote: 67,092 B → 1,809 B' })}
${box('', 'These are <b>your</b> numbers: compression cut the response <b>37×</b>; the edge cache turned a <b>3.0 s</b> origin call into a <b>~0.3 ms</b> hit. An interviewer remembers "I measured a 37× smaller payload and collapsed a 3-second call to sub-millisecond" far longer than "I know about caching."', 'xanh')}` },

  { t: 'The interview story', giua: true, body: `
${box('One paragraph', '"I built a request path — client, nginx edge, an API — and measured it hop by hop with <code class="i">curl -w</code>. The download dominated, so I turned on gzip and cut a 67 KB response to 1.8 KB; a slow report endpoint dominated TTFB, so I cached it at the edge, turning a 3-second origin call into a sub-millisecond hit. Then I broke it on purpose: a slow upstream gave a 504, a dead one a 502, and I diagnosed each by layer with <code class="i">nc</code>, <code class="i">curl -I</code> and <code class="i">openssl</code>. I wrote it up and added a TTFB alert so it can’t surprise us again."', 'lam')}
${box('', 'Notice: every sentence has a <b>number</b> or a <b>tool</b>. That is what makes it sound like experience rather than study.', 'xanh')}` },

  { t: 'Capstone completion rubric', giua: true, body: `
${bang(['Criterion', 'Pts', 'Full marks when'], [
    ['Stack built', '2', 'a request reaches the API through the edge'],
    ['Baseline', '2', 'every hop measured, numbers recorded'],
    ['Optimise', '3', '≥2 before/after gains, one change each, measured'],
    ['Break & diagnose', '2', '≥2 failures induced, each diagnosed to a layer'],
    ['Report & story', '1', 'the tables + an incident + the one-paragraph story'],
  ], { fs: 18 })}
${box('', 'Full marks is <b>measurement</b>, not description: a number per optimisation, a layer per failure, a story made of both.', 'lam')}` },

  { t: 'Where to go next', giua: true, body: `
${bang(['Path', 'Build on this with'], [
    ['Backend / API', 'api-design, nginx, Node.js, databases'],
    ['DevOps / SRE', 'Docker, Linux & Bash, observability, CCNA (if infra)'],
    ['Security', 'network-security, TLS/PKI depth, web-security'],
    ['Real-time', 'socket.io, WebRTC, streaming at scale'],
  ], { fs: 19 })}
${box('', 'This course is the <b>spine</b> — the request path every one of those builds on. You will meet these layers again, and now you can measure them.', 'lam')}` },

  { t: 'Summary — you can now…', to: true, giua: true, body: `
<ul>
<li><b>Explain</b> the whole request path (DNS → TCP → TLS → HTTP → CDN/LB → real-time) and <b>measure</b> each hop</li>
<li><b>Tune</b> a real stack and prove each gain as a before/after (you cut a payload 37× and a call to sub-ms)</li>
<li><b>Break</b> a system on purpose and diagnose any failure to a layer with <code class="i">dig</code>/<code class="i">curl</code>/<code class="i">nc</code>/<code class="i">openssl</code>/<code class="i">tcpdump</code></li>
<li><b>Tell the story</b> in an interview with numbers and tools — like someone who has done it, because you have</li>
<li>Carry this <b>spine</b> into backend, DevOps/SRE, security and real-time work</li>
</ul>
<p style="margin:0">${kw('build→measure→tune→break→report', 'năm động từ')} ${kw('before/after', 'trước/sau')} ${kw('interview story', 'câu chuyện')} ${kw('the spine', 'xương sống')}</p>` },
]);
