/**
 * os-04-8 — khoá "Operating Systems for Developers", bài 4.8 "Mini project: a parallel log analyzer in Java and Node"
 * (29/10/2026). Khuôn _pg-chung.mjs. Số đọc THẲNG từ lab/out/c48-log.out.txt qua grab(). Giảng: giang/os-04-8.mjs.
 */
import { lamDeck, sql, box, flow } from './_pg-chung.mjs';
import { META, grab, sweep, term, two, speedChart, T, R, BL, GR, RD, OR, PU, GY } from './os-04-chung.mjs';

export const deck = { key: 'os-04-8', code: 'OS 4.8', title: 'Mini project: a parallel log analyzer', sub: 'Operating Systems · Chapter 4' };

const F = 'c48-log';
const g = (p, n = 1) => grab(F, p, n);
const jCold = sweep(F, './sweep.sh "java LogAnalyzer /data/access.log {k}" 1'), node = sweep(F, './sweep.sh "node loganalyzer.js'), jWarm = sweep(F, './sweep.sh "java LogAnalyzer /data/access.log {k} 3"');
const runs = g('java LogAnalyzer /data/access.log 8 3').split('\n').map((l) => l.match(/run (\d) of 3\s+(\d+) ms/)).filter(Boolean).map((m) => +m[2]);
const rss = (p) => { const m = g(p).match(/: ([\d.]+) s wall, ([\d.]+) s user, max RSS (\d+) KB/); return { wall: +m[1], user: +m[2], mb: Math.round(+m[3] / 1024) }; };
const r = { j4: rss('/usr/bin/time -f "java W=4'), n4: rss('/usr/bin/time -f "node W=4'), j1: rss('/usr/bin/time -f "java W=1'), n1: rss('/usr/bin/time -f "node W=1') };
const awk = g('time awk').match(/real\s+0m([\d.]+)s/)[1];
const last = (a) => a[a.length - 1];

/* Chia file theo byte, căn theo dòng */
const ranges = () => {
  let s = `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial">`;
  const x0 = 30, w = 1050, cuts = [0, 0.25, 0.5, 0.75, 1];
  s += R(x0, 60, w, 56, '#f7f7f7', '#999', { rx: 6 });
  for (let i = 0; i < 26; i++) { const x = x0 + 12 + i * 40.2; s += `<line x1="${x}" y1="66" x2="${x}" y2="110" stroke="#ccc" stroke-width="1"/>`; }
  [BL, OR, GR, PU].forEach((c, i) => {
    const a = x0 + cuts[i] * w, b = x0 + cuts[i + 1] * w;
    s += R(a + 3, 64, b - a - 6, 48, c + '22', c, { rx: 4, sw: 2 });
    s += T((a + b) / 2, 44, `worker ${i}: [${['0', 'S/4', 'S/2', '3S/4'][i]}, ${['S/4', 'S/2', '3S/4', 'S'][i]})`, 17, { a: 'middle', w: 800, f: c });
  });
  [0.25, 0.5, 0.75].forEach((p) => {
    const x = x0 + p * w;
    s += `<line x1="${x}" y1="52" x2="${x}" y2="128" stroke="${RD}" stroke-width="3" stroke-dasharray="5 4"/>`;
  });
  s += T(555, 160, 'a cut usually lands in the middle of a line (grey ticks = line breaks)', 18, { a: 'middle', f: '#555' });
  s += T(555, 192, 'rule: a worker owns every line that STARTS inside its range — skip the partial first line, finish the last one', 19, { a: 'middle', w: 800, f: RD });
  s += T(555, 222, 'every line is counted exactly once; no worker reads more than one extra line', 17, { a: 'middle', f: '#555' });
  return s + '</svg>';
};

export const slides = lamDeck({ ...META, bai: '4.8' }, [
  { cover: true, t: 'Mini project:<br>a parallel log analyzer', sub: 'The same tool in Java and in Node —<br>built, checked and measured side by side' },

  { t: 'What you will get from this project', to: true, giua: true, body: `
<ul>
<li>A real task: 2 million nginx-style log lines, <b>${g('node gen-log.js').match(/([\d.]+) MB/)[1]} MB</b></li>
<li>A design that needs <b>no lock</b>: byte ranges → partial results → merge</li>
<li>The one tricky part: <b>lines cut in half</b> at range boundaries</li>
<li>Java (thread pool) vs Node (worker_threads): same answer, different curves</li>
<li>Why cold Java stopped at 2× — and what the JIT has to do with Amdahl</li>
</ul>` },

  { t: 'The task: answer four questions about a day of traffic', giua: true, body: `
${term(g('head -3 /data/access.log'))}
<ul style="font-size:22px">
<li>How many requests, and how many of each <b>status</b> (200, 304, 404, 5xx)?</li>
<li>Which <b>5 paths</b> get the most requests?</li>
<li>Their <b>p95 latency</b> — the last field, request time in seconds</li>
<li>How many <b>MB</b> each path sent</li>
</ul>` },

  { t: 'The design: split the file, not the work queue', giua: true, body: `
${flow([{ t: 'file, S bytes', s: 'page cache', mau: GY }, { t: 'W byte ranges', s: 'one per worker', mau: BL }, { t: 'W partial results', s: 'no sharing, no locks', mau: GR }, { t: 'merge', s: 'main thread', mau: PU }], { h: 140 })}
<ul style="font-size:22px">
<li>Each worker reads <b>its own</b> range in 4 MiB blocks — memory stays flat however big the file</li>
<li>Each worker fills its own maps: status → count, path → {count, bytes, latency histogram}</li>
<li>p95 from a <b>histogram</b> (10 000 one-ms buckets): histograms add up; sorted lists do not</li>
</ul>` },

  { t: 'The tricky part: lines cut in half', giua: true, body: ranges() },

  { t: 'Java: a fixed pool, one Callable per range', giua: true, body: two(
    sql(`if (start > 0) {               // skip the partial line
  f.seek(start - 1);
  while (f.read() != '\\n') pos++;
}
while ((nl = chunk.indexOf('\\n', from)) >= 0) {
  if (pos >= end) return p;     // starts in next range
  p.add(chunk.substring(from, nl));
  pos += nl - from + 1; from = nl + 1;
}`, { lang: 'java', sm: true }),
    sql(`ExecutorService ex = Executors.newFixedThreadPool(w);
for (int i = 0; i < w; i++) {
  long s = size * i / w, e = size * (i + 1) / w;
  parts.add(ex.submit(() -> scan(file, s, e)));
}
Partial all = new Partial();
for (Future<Partial> f : parts)
  all.merge(f.get());           // REDUCE`, { lang: 'java', sm: true })) },

  { t: 'Node: worker_threads, results by message', giua: true, body: two(
    sql(`if (!isMainThread) {
  parentPort.postMessage(
    scan(workerData.file, workerData.start,
         workerData.end));
}`, { lang: 'javascript', sm: true }),
    sql(`for (let i = 0; i < W; i++) {
  const w = new Worker(__filename, { workerData: {
    file, start: Math.floor(size * i / W),
          end:   Math.floor(size * (i + 1) / W) } });
  w.on('message', (part) => {
    merge(all, part);           // REDUCE
    if (--left === 0) report(all);
  });
}`, { lang: 'javascript', sm: true })) },

  { t: 'First check: both give the same answer', giua: true, body: `
${term(g('java LogAnalyzer /data/access.log 4'))}
${term(g('diff <(java LogAnalyzer').replace(/^\$ .*$/m, '$ diff <(java … W=1) <(node … W=8)'))}` },

  { t: 'Speedup: Node scales, cold Java stalls at 2×', giua: true, body: two(
    speedChart([
      { name: 'Java, warm (3rd run)', color: GR, pts: jWarm },
      { name: 'Node worker_threads', color: BL, pts: node, dy: 18 },
      { name: 'Java, cold (fresh JVM)', color: RD, pts: jCold },
    ], { w: 620, h: 430 }),
    `<table class="t" style="font-size:19px">
<tr><th>cores</th><th>Java cold</th><th>Node</th><th>Java warm</th></tr>
${jCold.map((x, i) => `<tr><td>${x.k}</td><td>${x.ms} ms</td><td>${node[i].ms} ms</td><td><b>${jWarm[i].ms} ms</b></td></tr>`).join('')}
</table>
<p class="nho" style="margin:0">best of 3, taskset -c 0..k-1; awk counting statuses only: ${awk} s</p>`, 'r64') },

  { t: 'Why cold Java stalls: the JIT is the serial part', giua: true, body: two(
    term(g('java LogAnalyzer /data/access.log 8 3')),
    `<ul style="font-size:22px">
<li>Same JVM, same 8 threads, three runs: <b>${runs.join(' → ')} ms</b></li>
<li>Run 1 is mostly <b>interpreted</b> bytecode while the JIT compiles the hot loop — work that does not parallelise</li>
<li>Warm, the curve reaches <b>${last(jWarm).s}×</b>; cold, only ${last(jCold).s}×</li>
<li>Amdahl again: a one-shot CLI pays the warm-up every time; a long-running service pays it once</li>
</ul>`, 'r64') },

  { t: 'What it costs: memory and CPU time', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th>/usr/bin/time</th><th>wall</th><th>CPU (user)</th><th>max RSS</th></tr>
<tr><td>Java, 1 worker</td><td>${r.j1.wall} s</td><td>${r.j1.user} s</td><td>${r.j1.mb} MB</td></tr>
<tr><td>Java, 4 workers</td><td>${r.j4.wall} s</td><td>${r.j4.user} s</td><td><b>${r.j4.mb} MB</b></td></tr>
<tr><td>Node, 1 worker</td><td>${r.n1.wall} s</td><td>${r.n1.user} s</td><td>${r.n1.mb} MB</td></tr>
<tr><td>Node, 4 workers</td><td>${r.n4.wall} s</td><td>${r.n4.user} s</td><td><b>${r.n4.mb} MB</b></td></tr>
</table>
${box('Parallel is not free', `4 workers: wall time down, total CPU up (Java ${r.j1.user} → ${r.j4.user} s, Node ${r.n1.user} → ${r.n4.user} s), memory up. On a small shared VPS the extra CPU and RAM belong to the API you are trying to diagnose.`, 'do2')}` },

  { t: 'Java or Node for this job?', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th></th><th>Java (thread pool)</th><th>Node (worker_threads)</th></tr>
<tr><td>One run on 8–10 cores</td><td>~${jCold[3].ms} ms cold (JIT warm-up)</td><td>~${node[3].ms} ms</td></tr>
<tr><td>Repeated in a service</td><td><b>~${jWarm[3].ms} ms</b> once warm</td><td>~${node[3].ms} ms (new isolates each run)</td></tr>
<tr><td>Single worker</td><td>${jCold[0].ms} ms</td><td>${node[0].ms} ms</td></tr>
<tr><td>Memory, 4 workers</td><td>${r.j4.mb} MB</td><td>${r.n4.mb} MB</td></tr>
<tr><td>Sharing results</td><td>threads share the heap — return objects</td><td>each worker’s result is copied by postMessage</td></tr>
</table>
${box('The real answer', 'For a one-shot CLI either is fine. For a long-running service, warm Java won here; Node would need a reused worker pool (lesson 4.3) to stop paying start-up per run.', 'xanh')}` },

  { t: 'Your turn: extend it', to: true, giua: true, body: `
<ul>
<li>Add <b>top 5 client IPs</b> and <b>5xx per minute</b> — both must merge correctly</li>
<li>Prove correctness: W = 1, 3, 7 give <b>identical</b> output (odd counts move the cuts)</li>
<li>Port it to a third language — C with pthreads or Python with multiprocessing — and add its curve</li>
<li>Run it in a container with <code class="i">--cpus 2</code>: which worker count is best now?</li>
</ul>` },

  { t: 'Checklist — any parallel data job', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th style="width:5%">#</th><th>Check</th></tr>
<tr><td>1</td><td>Split by data (byte ranges, files, partitions), so workers share nothing</td></tr>
<tr><td>2</td><td>Define who owns a record at a boundary — and test with odd worker counts</td></tr>
<tr><td>3</td><td>Partial results that <b>merge</b>: counts, sums, histograms — not sorted lists or averages</td></tr>
<tr><td>4</td><td>Stream in blocks; memory must not grow with the file</td></tr>
<tr><td>5</td><td>Measure: same answer for every W, speedup curve, CPU and RSS — cold and warm</td></tr>
</table>` },
]);
