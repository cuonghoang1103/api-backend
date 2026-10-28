/**
 * os-04-5 — khoá "Operating Systems for Developers", bài 4.5 "Amdahl, Gustafson and how many threads" (29/10/2026).
 * Khuôn _pg-chung.mjs. Số đọc THẲNG từ lab/out/c45-amdahl.out.txt qua grab(). Giảng: giang/os-04-5.mjs.
 */
import { lamDeck, sql, box } from './_pg-chung.mjs';
import { META, grab, sweep, term, two, speedChart, hbars, T, R, BL, GR, RD, OR, PU, GY } from './os-04-chung.mjs';

export const deck = { key: 'os-04-5', code: 'OS 4.5', title: 'Amdahl, Gustafson and how many threads', sub: 'Operating Systems · Chapter 4' };

const F = 'c45-amdahl';
const g = (p, n = 1) => grab(F, p, n);
const s0 = sweep(F, './sweep.sh "./amdahl {k} 0"'), s10 = sweep(F, './sweep.sh "./amdahl {k} 10" 1 2 4 8 10\n'.trim()), s25 = sweep(F, './sweep.sh "./amdahl {k} 25"');
const pred = (p) => g(p).split('\n').map((l) => l.match(/^\s+(\d+)\s+([\d.]+)x\s+([\d.]+)x/)).filter(Boolean).map((m) => ({ k: +m[1], a: +m[2], gu: +m[3] }));
const p10 = pred('python3 predict.py 10'), p25 = pred('python3 predict.py 25');
const grow = g('for k in 1 2 4 8 10; do taskset').split('\n').map((l) => l.match(/T=(\d+)\s+serial=10% units=(\d+)\s+serial\s+(\d+) ms \+ parallel\s+(\d+) ms =\s+(\d+) ms/)).filter(Boolean)
  .map((m) => ({ k: +m[1], units: +m[2], ser: +m[3], par: +m[4], ms: +m[5] }));
const kf = (p) => g(p).split('\n').map((l) => l.match(/^\s+(\d+)\s+(\d+)\s+([\d.]+)x\s+([\d.]+)%/)).filter(Boolean).map((m) => ({ k: +m[1], s: +m[3], e: +m[4] }));
const kfA = kf('./sweep.sh "./amdahl {k} 10" 1 2 4 8 10 | python3'), kfP = kf('./sweep.sh "./primes queue {k} 20000000" 1 2 4 8 10 | python3');
const sizing = (p) => g(p).split('\n').map((l) => l.match(/pool\s+(\d+) threads:\s+(\d+) tasks\/s/)).filter(Boolean).map((m) => ({ n: +m[1], tps: +m[2] }));
const z0 = sizing('taskset -c 0-1 java Sizing.java 10 0'), z4 = sizing('taskset -c 0-1 java Sizing.java 10 40'), z49 = sizing('taskset -c 0-1 java Sizing.java 2 98');
const last = (a) => a[a.length - 1];
const lang = (() => {
  const t = grab(F, './best3.sh taskset -c 0 ./primes seq', 4);
  const pySeq = () => { const all = [...t.matchAll(/^seq\s+x1\s+N=2000000 primes=148933\s+(\d+) ms$/gm)]; return +all[all.length - 1][1]; }; // C in trước, Python in sau
  const v = (re) => { const m = t.match(re); if (!m) throw new Error('os-04-5: thiếu ' + re); return +m[1]; };
  return [
    { name: 'C (pthreads queue)', one: v(/^seq\s+x1 .*?(\d+) ms$/m), four: v(/^queue\s+x4 .*?(\d+) ms$/m) },
    { name: 'Java (pool)', one: v(/^threads x1 .*?warm\s+(\d+) ms$/m), four: v(/^pool\s+x4 .*?warm\s+(\d+) ms$/m) },
    { name: 'Node (worker_threads)', one: v(/^main x0 .*?(\d+) ms$/m), four: v(/^workers x4 .*?(\d+) ms$/m) },
    { name: 'Python threads', one: pySeq(), four: v(/^threads x4 .*?(\d+) ms$/m) },
    { name: 'Python processes', one: pySeq(), four: v(/^procs\s+x4 .*?(\d+) ms$/m) },
  ];
})();

/* Thông lượng theo cỡ pool, trục x log2 */
const tpChart = (series, opts = {}) => {
  const { w = 620, h = 400, max = 650 } = opts;
  const L = 70, B = 50, Tp = 14, Rt = 30, pw = w - L - Rt, ph = h - B - Tp, xs = [1, 2, 4, 8, 16, 32, 64, 128, 256];
  const X = (n) => L + (Math.log2(n) / 8) * pw, Y = (v) => Tp + ph - (v / max) * ph;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  xs.forEach((n) => { s += `<line x1="${X(n)}" y1="${Tp}" x2="${X(n)}" y2="${Tp + ph}" stroke="#eee"/>` + T(X(n), h - B + 22, n, 15, { a: 'middle', f: '#666' }); });
  for (let v = 0; v <= max; v += 100) s += `<line x1="${L}" y1="${Y(v)}" x2="${L + pw}" y2="${Y(v)}" stroke="#eee"/>` + T(L - 8, Y(v) + 5, v, 15, { a: 'end', f: '#666' });
  s += T(L + pw / 2, h - 6, 'threads in the pool (log scale) — 2 cores', 16, { a: 'middle', w: 700, f: '#555' });
  s += T(14, Tp + ph / 2, 'tasks/s', 15, { f: '#555', w: 700 });
  series.forEach((sr) => {
    s += `<polyline points="${sr.pts.map((p) => `${X(p.n)},${Y(p.tps)}`).join(' ')}" fill="none" stroke="${sr.color}" stroke-width="4"/>`;
    sr.pts.forEach((p) => { s += `<circle cx="${X(p.n)}" cy="${Y(p.tps)}" r="5" fill="${sr.color}"/>`; });
    s += `<line x1="${X(sr.formula)}" y1="${Tp}" x2="${X(sr.formula)}" y2="${Tp + ph}" stroke="${sr.color}" stroke-width="2" stroke-dasharray="5 5"/>`;
  });
  series.forEach((sr, i) => {
    if (i === 0) s += R(L + 6, Tp + 2, 250, 82, '#ffffff', '#dddddd', { rx: 6, sw: 1 });
    s += R(L + 14, Tp + 10 + i * 26, 20, 8, sr.color, sr.color, { rx: 2, sw: 0 }) + T(L + 42, Tp + 19 + i * 26, sr.name, 15, { w: 700, f: sr.color });
  });
  return s + '</svg>';
};

export const slides = lamDeck({ ...META, bai: '4.5' }, [
  { cover: true, t: 'When parallel helps —<br>and when it cannot', sub: 'Amdahl’s law, Gustafson’s law, Karp–Flatt,<br>how many threads — and four languages side by side' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A program with a <b>known</b> serial part — measured against <b>Amdahl’s law</b></li>
<li><b>Gustafson’s law</b>: grow the problem with the cores instead</li>
<li><b>Karp–Flatt</b>: read the serial fraction off your own measurements</li>
<li>How many threads? The formula <b>N<sub>cpu</sub> × (1 + W/C)</b>, checked on a real pool</li>
<li>The prime count in C, Java, Node and Python — one table</li>
</ul>` },

  { t: 'A program with a known serial part', giua: true, body: two(
    sql(`/* 4 000 units, ~0.78 ms of CPU each */

/* SERIAL%: one thread only */
for (long i = 0; i < ser; i++)
  unit();

/* the rest: T threads pull from a queue */
total_par = par;
for (i = 0; i < t; i++)
  pthread_create(&th[i], 0, worker, 0);
for (i = 0; i < t; i++)
  pthread_join(th[i], 0);`, { lang: 'c', sm: true }),
    `${term(g('./amdahl 1 10'))}
${box('Every real program has this shape', 'Read the input, parse the config, start the threads, merge the results: some part runs on one core no matter how many you have.', 'lam')}`, 'r46') },

  { t: 'Amdahl’s law: the serial part sets a ceiling', giua: true, body: two(
    speedChart([
      { name: '0% serial', color: GR, pts: s0 },
      { name: '10% serial', color: OR, pts: s10, dy: 18 },
      { name: '25% serial', color: RD, pts: s25 },
    ], { w: 620, h: 430, amdahl: [10, 25] }),
    `<div class="o info" style="font-size:26px;text-align:center"><b>S(n) = 1 / (s + (1 − s) / n)</b></div>
<ul style="font-size:21px">
<li>s = serial fraction, n = cores</li>
<li>n → ∞: S → 1/s — <b>10× max</b> at 10% serial, <b>4× max</b> at 25%</li>
<li>Dotted lines = the formula; dots = measured</li>
</ul>`, 'r64') },

  { t: 'Measured vs predicted', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th>cores</th><th>0% measured</th><th>10% measured</th><th>10% Amdahl</th><th>25% measured</th><th>25% Amdahl</th></tr>
${s10.map((r, i) => `<tr><td>${r.k}</td><td>${s0[i].s}×</td><td><b>${r.s}×</b></td><td>${p10[i].a}×</td><td><b>${s25[i].s}×</b></td><td>${p25[i].a}×</td></tr>`).join('')}
</table>
${box('Read it', `At 25% serial the formula is almost exact. At 10% the measurement falls a little below it on many cores: Amdahl assumes the parallel part scales perfectly, and here it does not quite (0% serial reached ${last(s0).s}× on 10, not 10×).`, 'lam')}` },

  { t: 'Gustafson’s law: give more cores more work', giua: true, body: two(
    `<table class="t" style="font-size:21px">
<tr><th>T</th><th>units of work</th><th>serial</th><th>parallel</th><th>total</th></tr>
${grow.map((r) => `<tr><td>${r.k}</td><td>${r.units.toLocaleString('en')}</td><td>${r.ser} ms</td><td>${r.par} ms</td><td><b>${r.ms} ms</b></td></tr>`).join('')}
</table>`,
    `<div class="o info" style="font-size:24px;text-align:center"><b>S(n) = s + (1 − s) · n</b></div>
<ul style="font-size:21px">
<li>10 cores did <b>${(last(grow).units / grow[0].units).toFixed(1)}×</b> the work in ${(last(grow).ms / grow[0].ms).toFixed(2)}× the time</li>
<li>Scaled speedup ≈ <b>${((last(grow).units / grow[0].units) / (last(grow).ms / grow[0].ms)).toFixed(1)}×</b> (formula: ${p10[p10.length - 1].gu}×)</li>
<li>Amdahl: same job, faster. Gustafson: same time, bigger job</li>
</ul>`, 'r64') },

  { t: 'Karp–Flatt: the serial fraction from your own numbers', giua: true, body: two(
    `<div class="o info" style="font-size:24px;text-align:center"><b>e = (1/S − 1/n) / (1 − 1/n)</b></div>
${term(g('./sweep.sh "./amdahl {k} 10" 1 2 4 8 10 | python3').split('\n').slice(1, 6).join('\n'))}`,
    `${term(g('./sweep.sh "./primes queue {k} 20000000" 1 2 4 8 10 | python3').split('\n').slice(1, 6).join('\n'))}
<ul style="font-size:21px">
<li>amdahl 10%: e ≈ <b>${Math.min(...kfA.map((r) => r.e))}–${Math.max(...kfA.map((r) => r.e))}%</b> — it found the 10% we built in</li>
<li>primes queue: e ≈ <b>${Math.min(...kfP.map((r) => r.e))}–${Math.max(...kfP.map((r) => r.e))}%</b> — almost no serial part</li>
<li>e growing with n = an overhead that grows with threads</li>
</ul>`) },

  { t: 'How many threads? It depends on the waiting', giua: true, body: two(
    tpChart([
      { name: 'W/C = 0 (pure CPU) → 2', color: RD, pts: z0, formula: 2 },
      { name: 'W/C = 4 → 10', color: OR, pts: z4, formula: 10 },
      { name: 'W/C = 49 → 100', color: GR, pts: z49, formula: 100 },
    ]),
    `<div class="o info" style="font-size:24px;text-align:center"><b>N = N<sub>cpu</sub> × (1 + W / C)</b></div>
<ul style="font-size:20px">
<li>C = CPU time per task, W = waiting time (Goetz, <i>Java Concurrency in Practice</i>)</li>
<li>2 cores, pure CPU: 2 threads already give ${z0[1].tps} tasks/s; more add nothing</li>
<li>W/C = 4: the knee is near the formula’s 10; the plateau (${last(z4).tps}/s) from ~16</li>
<li>W/C = 49: ${z49.find((r) => r.n === 100).tps}/s at 100 threads, less at 200</li>
</ul>`, 'r64') },

  { t: 'The same prime count in four languages', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th>primes below 2 000 000</th><th>1 core</th><th>4 cores</th><th>speedup</th><th>vs C on 1 core</th></tr>
${lang.map((r) => `<tr><td>${r.name}</td><td>${r.one.toLocaleString('en')} ms</td><td><b>${r.four.toLocaleString('en')} ms</b></td><td>${(r.one / r.four).toFixed(2)}×</td><td>${(r.one / lang[0].one).toFixed(1)}×</td></tr>`).join('')}
</table>
${box('Two different questions', 'Speedup is about the parallel design; the last column is about the language. Python processes scale well (×' + (lang[4].one / lang[4].four).toFixed(1) + ') — from a start ~' + (lang[4].one / lang[0].one).toFixed(0) + '× slower than C.', 'lam')}` },

  { t: 'Write it yourself: Karp–Flatt on your own program', giua: true, body: two(
    sql(`# pts = [(cores, ms), ...] from sweep.sh
t1 = pts[0][1]
for n, ms in pts[1:]:
    s = t1 / ms                    # speedup
    e = (1/s - 1/n) / (1 - 1/n)    # Karp–Flatt
print('ceiling 1/e =', 1 / e)
for n in (16, 32, 64):             # Amdahl
    print(n, 1 / (e + (1 - e) / n))`, { lang: 'python', sm: true }),
    `${term(g('./sweep.sh "./amdahl {k} 10" 1 2 4 8 10 | python3').split('\n').slice(6).join('\n').replace('  ⇒  ', '\n  ⇒ '))}
${box('Use it before you buy', 'Measure on 3–4 core counts, feed the table in, and you know the ceiling of this program — here 8.6×, whatever the hardware.', 'xanh')}`, 'r46') },

  { t: 'Cheat sheet — will more cores help?', giua: true, body: `
<table class="t" style="font-size:24px">
<tr><th style="width:38%">Question</th><th>Answer with</th></tr>
<tr><td>How much faster can this get?</td><td>Amdahl: 1 / (s + (1−s)/n); ceiling 1/s</td></tr>
<tr><td>What is my serial fraction?</td><td>sweep 1…n cores, Karp–Flatt e = (1/S − 1/n)/(1 − 1/n)</td></tr>
<tr><td>Will a bigger machine handle a bigger job?</td><td>Gustafson: s + (1−s)·n</td></tr>
<tr><td>How many threads?</td><td>N<sub>cpu</sub> × (1 + W/C), then <b>measure</b> around it</td></tr>
<tr><td>Is it worth parallelising at all?</td><td>Profile first; a faster language or algorithm may beat 10 cores</td></tr>
</table>` },
]);
