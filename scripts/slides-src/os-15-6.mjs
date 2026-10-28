/**
 * os-15-6 — khoá "Operating Systems for Developers", bài 15.6 "Benchmarking honestly" (29/10/2026).
 * Khuôn _pg-chung.mjs. Số đọc THẲNG từ lab/out/c156-bench.out.txt. Giảng: giang/os-15-6.mjs.
 */
import { lamDeck, box, cards } from './_pg-chung.mjs';
import { META, g, num, tiny, bars, svg, T, R, BL, GR, RD, OR, GY } from './os-15-chung.mjs';

export const deck = { key: 'os-15-6', code: 'OS 15.6', title: 'Benchmarking honestly', sub: 'Operating Systems · Chapter 15' };

const F = 'c156-bench';
const rounds = g(F, 'java Warm.java').split('\n').map((l) => l.match(/round\s+(\d+):\s+([\d.]+) ms/)).filter(Boolean).map((m) => +m[2]);
const st = (pre) => { const t = g(F, pre); const m = t.match(/best (\d+)\s+median (\d+)\s+mean (\d+) ± (\d+)\s+p90 (\d+)\s+worst (\d+)/); return { best: +m[1], med: +m[2], mean: +m[3], sd: +m[4], p90: +m[5], worst: +m[6] }; };
const quiet = st('for i in $(seq 30)'), noisy = st('taskset -c 3 stress-ng');
const lat = (pre, n = 1, which = 'intended') => {
  const t = g(F, pre, n); const re = which === 'intended' ? /intended start\s+p50\s+([\d.]+)\s+p95\s+([\d.]+)\s+p99\s+([\d.]+)/ : /actual send\s+p50\s+([\d.]+)\s+p95\s+([\d.]+)\s+p99\s+([\d.]+)/;
  const m = t.match(re); return m.slice(1).map(Number);
};
const closed = lat('node tai.js http://127.0.0.1:8090/ --closed 1');
const open1 = lat('node tai.js http://127.0.0.1:8090/ --rate 100 --duration 8 --conns 1'), open1send = lat('node tai.js http://127.0.0.1:8090/ --rate 100 --duration 8 --conns 1', 1, 'send');
const k6p99 = +num(F, 'k6 run', /p\(99\)=([\d.]+)ms/), k6p95 = +num(F, 'k6 run', /p\(95\)=([\d.]+)ms/);
const wrk99 = +num(F, 'wrk -t1 -c1', /99%\s+([\d.]+)ms/), wrk90 = +num(F, 'wrk -t1 -c1', /90%\s+([\d.]+)ms/);
const hey99 = +num(F, 'hey -z 8s -c 1', /99% in ([\d.]+) secs/) * 1000;

/* Biểu đồ các vòng làm nóng */
const warmChart = () => {
  const W = 1060, H = 230, L = 60, B = 36, max = Math.ceil(Math.max(...rounds) / 50) * 50;
  const bw = (W - L - 20) / rounds.length;
  let s = '';
  for (let v = 0; v <= max; v += 50) { const y = H - B - (v / max) * (H - B - 10); s += `<line x1="${L}" y1="${y}" x2="${W}" y2="${y}" stroke="#eee"/>` + T(L - 8, y + 5, v, 14, { a: 'end', f: '#777' }); }
  rounds.forEach((v, i) => {
    const h = (v / max) * (H - B - 10), x = L + i * bw + 8;
    s += R(x, H - B - h, bw - 16, h, (i === 0 ? RD : BL) + '55', i === 0 ? RD : BL, { rx: 3 }) + T(x + (bw - 16) / 2, H - B - h - 6, v, 14, { a: 'middle', w: 700 }) + T(x + (bw - 16) / 2, H - 12, `round ${i + 1}`, 13, { a: 'middle', f: '#666' });
  });
  s += T(L, 14, 'ms per round (300 reports)', 14, { f: '#666' });
  return svg(W, H, s);
};

export const slides = lamDeck(META('15.6'), [
  { cover: true, t: 'Benchmarking honestly', sub: 'Warm-up, variance, percentiles,<br>coordinated omission — each one measured' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><b>Warm-up</b>: the first runs are a different program</li>
<li><b>Variance</b>: mean ± σ, and a ratio with its uncertainty</li>
<li><b>Best-of-N vs percentiles</b>: which question each one answers</li>
<li><b>Coordinated omission</b>: five load generators vs one stalling server</li>
<li>Choosing wrk, hey, k6 — and a report someone else can check</li>
</ul>` },

  { t: `Warm-up: round 1 ${rounds[0]} ms, then ${Math.min(...rounds.slice(1))}–${Math.max(...rounds.slice(1))} ms`, giua: true, body: `
${warmChart()}
${box('The JVM gets faster while it runs', 'Round 1 is interpreted, then C1/C2 compile the hot methods. V8 and PyPy do the same; even C warms caches and page tables. Run until stable, discard, then measure.', 'lam')}` },

  { t: 'Variance: hyperfine reports mean ± σ and a ratio ± error', giua: true, body: `
${tiny(g(F, 'hyperfine'), 16)}
${box('A difference smaller than the spread is not a result', '2 warm-up + 15 measured runs each; “2.65 ± 0.22 times faster” is the honest form of “2.65× faster”.', '')}` },

  { t: 'Best-of-N hides the noisy neighbour', giua: true, body: `
${bars([
    ['quiet — best', quiet.best, GR, `${quiet.best} ms`], ['noisy — best', noisy.best, GR, `${noisy.best} ms`],
    ['quiet — median', quiet.med, BL, `${quiet.med} ms`], ['noisy — median', noisy.med, BL, `${noisy.med} ms`],
    ['quiet — p90', quiet.p90, OR, `${quiet.p90} ms`], ['noisy — p90', noisy.p90, RD, `${noisy.p90} ms`],
  ], { label: 230, rowH: 40, max: noisy.p90 * 1.2 })}
${box('Which question?', 'Best-of-N: “how fast can the code go undisturbed?” (fine for comparing algorithms). Users meet the neighbours: report median AND tail.', 'lam')}` },

  { t: 'The test server: fast, but frozen 200 ms every second', giua: true, body: `
${svg(1060, 150, (() => {
    let s = T(20, 22, 'stall.js over 3 seconds', 16, { w: 700, f: '#555' });
    for (let k = 0; k < 3; k++) {
      const x0 = 40 + k * 340;
      s += R(x0, 40, 272, 40, GR + '55', GR, { rx: 3 }) + T(x0 + 136, 66, 'answers in ~0.1 ms', 15, { a: 'middle', w: 700 });
      s += R(x0 + 272, 40, 68, 40, RD + '66', RD, { rx: 3 }) + T(x0 + 306, 66, '200 ms', 14, { a: 'middle', w: 700, f: '#fff' });
    }
    s += T(530, 120, 'a user arriving at a random moment hits a freeze 20% of the time → p95 and p99 should be large', 16, { a: 'middle', f: RD, w: 700 });
    return s;
  })())}
${box('Five tools, one question', 'What is the p99 latency of this server? hey, tai.js closed, tai.js open (1 connection / unlimited), k6 constant-arrival-rate, wrk.', '')}` },

  { t: 'Closed loop: the client waits — and stops sending', giua: true, body: `
${tiny([g(F, 'hey -z 8s -c 1'), g(F, 'node tai.js http://127.0.0.1:8090/ --closed 1')].join('\n'), 16)}
${box('Coordinated omission', 'During each freeze the single client is itself waiting: it sends 1 request instead of ~1 500. The bad period is almost never sampled ⇒ p99 0.1–0.2 ms.', 'do2')}` },

  { t: 'Open loop: requests leave on schedule', giua: true, body: `
${tiny([g(F, 'node tai.js http://127.0.0.1:8090/ --rate 100 --duration 8 --conns 1'), g(F, 'k6 run', 2)].join('\n'), 14)}
${box('Same run, two clocks', `From the intended start: p99 <b>${open1[2]} ms</b>. From the actual send (socket assigned): p99 ${open1send[2]} ms — the queue in front of the socket is forgotten. k6 arrival-rate: p99 ${k6p99} ms.`, 'lam')}` },

  { t: `wrk corrects afterwards: p99 ${wrk99} ms`, giua: true, body: `
${tiny(g(F, 'wrk -t1 -c1'), 16)}
${cards([
    ['stats_correct() in wrk.c', 'expected interval = runtime ÷ requests per connection ≈ 65 µs; every latency > 2× that gets the “missing” samples added'],
    ['…for a different user', `rescues p99 (${wrk99} ms), but models a user sending ~15 000 req/s — so p90 = ${wrk90} ms describes that user, not yours`],
  ], 2)}` },

  { t: 'p99 of the same server, five tools', giua: true, body: `
${bars([
    ['hey -c 1 (closed)', hey99, GR, `${hey99} ms`],
    ['tai.js --closed 1', closed[2], GR, `${closed[2]} ms`],
    ['tai.js open, actual send', open1send[2], OR, `${open1send[2]} ms`],
    ['wrk (corrected)', wrk99, BL, `${wrk99} ms`],
    ['tai.js open, intended', open1[2], RD, `${open1[2]} ms`],
    ['k6 constant-arrival-rate', k6p99, RD, `${k6p99} ms`],
  ], { label: 300, rowH: 44, log: true })}
<div class="cap" style="text-align:center">log scale — a 1 000× disagreement about the same server</div>` },

  { t: 'Choosing a load generator', giua: true, body: `
<table class="t" style="font-size:18px">
<tr><th>tool</th><th>model</th><th>latency it reports</th><th>use it for</th></tr>
<tr><td>hey</td><td>closed (N workers)</td><td>from actual send — omits stalls</td><td>quick throughput checks</td></tr>
<tr><td>wrk</td><td>closed, Lua scripts</td><td>corrected afterwards</td><td>max throughput of an endpoint</td></tr>
<tr><td>k6</td><td>open (arrival-rate) or closed (VUs)</td><td>per request + dropped iterations</td><td>latency at a target rate, CI thresholds</td></tr>
<tr><td>wrk2</td><td>open, constant rate</td><td>from intended start</td><td>latency at a rate <i>(not run here)</i></td></tr>
<tr><td>tai.js</td><td>both</td><td>both, side by side</td><td>seeing coordinated omission</td></tr>
</table>
${box('Two different questions', 'Closed loop: “how many requests per second can it do?” Open loop: “how long do users wait at THIS rate?”', 'lam')}` },

  { t: 'A report someone else can check', to: true, giua: true, body: cards([
    ['Environment', 'machine, CPU limit, versions, what else was running'],
    ['Procedure', 'warm-up, duration, runs, open/closed, rate or concurrency, keep-alive'],
    ['Result', 'p50 · p95 · p99 · max · throughput · errors — with the spread across runs'],
    ['Comparison', 'same procedure, back to back; inside the spread = no difference'],
  ], 2) },

  { t: 'Takeaways', to: true, giua: true, body: `
<ul>
<li>Warm up, then measure; discard the first runs</li>
<li>Report <b>mean ± σ</b> and ratios with their uncertainty</li>
<li>Best-of-N for code; <b>median + tail</b> for users</li>
<li>Latency at a rate needs an <b>open loop</b> (k6 arrival-rate, wrk2)</li>
<li>Same server: p99 ${closed[2]} ms or ${open1[2]} ms — depending on the tool</li>
</ul>` },
]);
