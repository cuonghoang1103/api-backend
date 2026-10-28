/**
 * os-15-4 — khoá "Operating Systems for Developers", bài 15.4 "Language profilers on one slow service" (29/10/2026).
 * Khuôn _pg-chung.mjs. Số đọc THẲNG từ lab/out/c154-prof.out.txt; flame graph = SVG thật lab/code/ch15/fg/java.svg, python.svg.
 * Giảng: giang/os-15-4.mjs.
 */
import { lamDeck, box, cards } from './_pg-chung.mjs';
import { META, g, num, tiny, code, fg, bars, SRC, dong, noCmt, BL, GR, RD, OR, PU } from './os-15-chung.mjs';

export const deck = { key: 'os-15-4', code: 'OS 15.4', title: 'Language profilers', sub: 'Operating Systems · Chapter 15' };

const F = 'c154-prof';
const p50 = (pre, n = 1) => +num(F, pre, /p50\s+([\d.]+)/, n);
const rps = (pre) => +num(F, pre, /= (\d+) req\/s/);
const nodeB = p50('node tai.js http://127.0.0.1:8081/report'), nodeF = p50('node tai.js http://127.0.0.1:8084/report');
const javaB = p50('C0=$(cpu $J); node tai.js http://127.0.0.1:8085/report'), javaN = p50('C0=$(cpu $J); node tai.js http://127.0.0.1:8086/report'), javaF = p50('node tai.js http://127.0.0.1:8087/report --closed 1 --duration 5');
const pyB = p50('C0=$(cpu $P)'), pyN = p50('NODELAY=1 python3 orders.py 8089', 2), pyF = p50('NODELAY=1 FIX=1', 2);
const javaCpu = +num(F, 'C0=$(cpu $J); node tai.js http://127.0.0.1:8085/report', /during those 5 s: (\d+) ms/);
const javaN_ok = +num(F, 'C0=$(cpu $J); node tai.js http://127.0.0.1:8085/report', /: (\d+) ok/);
const pyCpu = +num(F, 'C0=$(cpu $P)', /during those 5 s: (\d+) ms/), pyOk = +num(F, 'C0=$(cpu $P)', /: (\d+) ok/);
const javaPerReq = (javaCpu / javaN_ok).toFixed(1), pyPerReq = (pyCpu / pyOk).toFixed(1);


export const slides = lamDeck(META('15.4'), [
  { cover: true, t: 'Language profilers', sub: 'One slow service in Node, Java and Python —<br>profiled, fixed and measured again' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Node: <b>--cpu-prof</b> and <b>--prof</b> — and what inlining does to them</li>
<li>Java: <b>JFR</b> (always on) and <b>async-profiler</b> (attach, flame graph)</li>
<li>Python: <b>cProfile</b> (deterministic) and <b>py-spy</b> (sampling, no restart)</li>
<li>The 40 ms that <b>no CPU profiler</b> could see — and how we found it</li>
<li>One table: before and after, three runtimes</li>
</ul>` },

  { t: 'One service, three languages, the same O(n²) loop', body: `
${['JavaScript — orders.js', code(noCmt(dong(SRC('orders.js'), 12, 13)), 'javascript', 15), 'Java — Orders.java', code(noCmt(dong(SRC('Orders.java'), 17, 18)), 'java', 15), 'Python — orders.py', code(noCmt(dong(SRC('orders.py'), 12, 15)), 'python', 15)]
    .map((x, i) => (i % 2 === 0 ? `<div class="tcap" style="margin:0">${x}</div>` : x)).join('')}
${box('GET /report', '4 000 orders → distinct customers by <b>linear search</b> ≈ 4 000 × 1 250 string comparisons per request. <code>FIX=1</code> switches to a Set — O(n). Measured with tai.js, 1 connection, 5 s, after warm-up.', '')}
` },

  { t: 'Node --cpu-prof: the hot function is not where you expect', body: `
${tiny([g(F, 'node tai.js http://127.0.0.1:8081/report'), g(F, 'node cpuprofile.js')].join('\n'), 15)}
${box('Inlined', 'uniqueCustomers has 0.7% self time — TurboFan inlined it into report (83.2%), and the built-in includes is charged to its caller. Per-line ticks: <b>line 24, 91.3%</b>.', '')}` },

  { t: 'Node --prof: 94% of ticks inside the node binary', giua: true, body: `
${tiny(g(F, 'node --prof-process'), 17)}
${cards([
    ['Bottom-up', 'the tick lands in a built-in (Array.prototype.includes lives in the node binary) — read upwards to find who called it: report'],
    ['The fix: one line', `new Set(list.map(…)) → p50 <b>${nodeB} → ${nodeF} ms</b>, ${rps('node tai.js http://127.0.0.1:8081/report')} → ${rps('node tai.js http://127.0.0.1:8084/report').toLocaleString('en')} req/s`],
  ], 2)}` },

  { t: 'Java: async-profiler and JFR agree on indexOfRange', body: tiny([
    g(F, 'asprof -d 4'),
    g(F, 'jcmd $J JFR.dump'),
  ].join('\n'), 14) },

  { t: 'Orders.java under async-profiler', body: `${fg('java', { h: 360, win: ['java/util/ArrayList.indexOfRange', 'java/lang/Thread.run'] })}
<div class="cap" style="text-align:center">asprof -e cpu -o collapsed | flamegraph.pl — the band from Thread.run up to indexOfRange (full SVG: lab/code/ch15/fg/java.svg).</div>
${box('Read upwards', 'ServerImpl$Exchange.run → Orders.report → uniqueCustomers → ArrayList.contains → indexOf → <b>indexOfRange</b>: the linear search.', 'lam')}` },

  { t: 'The 40 ms gap: latency vs CPU per request', giua: true, body: `
${bars([
    ['Java latency (p50)', javaB, RD, `${javaB} ms`],
    ['Java CPU per request', +javaPerReq, GR, `${javaPerReq} ms = ${javaCpu} ms ÷ ${javaN_ok}`],
    ['Python latency (p50)', pyB, RD, `${pyB} ms`],
    ['Python CPU per request', +pyPerReq, GR, `${pyPerReq} ms = ${pyCpu} ms ÷ ${pyOk}`],
  ], { label: 290, rowH: 46, max: pyB * 1.35 })}
${box('Off-CPU, invisible to every CPU profiler', 'Hypothesis: headers and body are two writes → Nagle holds the second → the client delays its ACK up to 40 ms (lesson 11.3). Test by changing ONE thing: TCP_NODELAY.', 'do2')}` },

  { t: 'Test the hypothesis: TCP_NODELAY', giua: true, body: `
${tiny([g(F, 'C0=$(cpu $J); node tai.js http://127.0.0.1:8086/report'), g(F, 'NODELAY=1 python3 orders.py 8089', 2)].join('\n'), 16)}
${cards([
    ['Java -Dsun.net.httpserver.nodelay=true', `p50 ${javaB} → <b>${javaN} ms</b>; CPU per request now ≈ latency`],
    ['Python disable_nagle_algorithm', `p50 ${pyB} → <b>${pyN} ms</b>; equal to its CPU cost`],
  ], 2)}` },

  { t: 'Python: cProfile counts every call', giua: true, body: `
${tiny(g(F, 'python3 -c "import cProfile'), 16)}
${box('Deterministic', '<b>unique_customers</b>: 1.020 of 1.118 s (91%). cProfile hooks every call and return — exact counts (390 603 calls), real overhead. Good for a batch or a test, not for production.', '')}` },

  { t: 'Python: py-spy on the live service — no restart', body: `
${tiny([g(F, 'py-spy dump'), g(F, 'py-spy record').split('\n').slice(0, 7).join('\n')].join('\n'), 14)}
${fg('python', { h: 200 })}` },

  { t: 'Three runtimes, before and after', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th>p50 latency, 1 connection</th><th>baseline</th><th>CPU per request</th><th>+ TCP_NODELAY</th><th>+ Set (O(n))</th></tr>
<tr><td>Node (noDelay already on)</td><td>${nodeB} ms</td><td>—</td><td>—</td><td><b>${nodeF} ms</b></td></tr>
<tr><td>Java (JDK HttpServer)</td><td>${javaB} ms</td><td>${javaPerReq} ms</td><td>${javaN} ms</td><td><b>${javaF} ms</b></td></tr>
<tr><td>Python (http.server)</td><td>${pyB} ms</td><td>${pyPerReq} ms</td><td>${pyN} ms</td><td><b>${pyF} ms</b></td></tr>
</table>
${box('Two lessons', 'Every runtime’s profiler found the same hot path in its own words. And in two of three runtimes most of the latency was off-CPU — check CPU per request ≈ latency before you trust a CPU profile.', 'xanh')}` },

  { t: 'Takeaways', to: true, giua: true, body: `
<ul>
<li>Learn <b>your runtime’s</b> profiler: names, lines, inlining</li>
<li>A function at 0.7% self can be the whole problem — read callers and lines</li>
<li>JFR on in production; async-profiler / py-spy attach without restart</li>
<li><b>CPU per request ≠ latency</b> ⇒ look off-CPU (here: Nagle, 40 ms)</li>
<li>Fix one thing at a time, re-measure with the same load</li>
</ul>` },
]);
