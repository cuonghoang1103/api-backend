/**
 * os-02-1 — khoá "Operating Systems for Developers", bài 2.1 "Slow is not a diagnosis: the USE method" (28/10/2026).
 * Khuôn _pg-chung.mjs (slide EN, dáng FU, logo CuongThai.com). Output đọc THẲNG từ lab/out/c21-triage.out.txt và
 * c21-nhin.out.txt (chạy thật trong ảnh os-lab) qua grab() — không chép tay. Nhúng vào bài bằng giang/os-02-1.mjs (walk()).
 */
import { lamDeck, sql, sh, two as two0, box, cards, steps } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-02-1', code: 'OS 2.1', title: 'Slow is not a diagnosis: the USE method', sub: 'Operating Systems · Chapter 2' };

const cut = (t, n) => t.split('\n').map((l) => (l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');
const g = (pre, n = 1, w = 200, f = 'c21-triage') => cut(grab(f, pre, n), w);
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 9}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"/>`;
const BL = '#336791', OR = '#e08a1e', BR = '#b85a2b', GR = '#2f7d4f', RD = '#c0392b';

/* Slide 3: khung sự cố 5 dòng — mũi tên đi xuống, ô "Measure" tô nổi */
const incident = () => {
  const rows = [
    ['Symptom', 'Deploy fails: "no space left on device"; DB routes → 500, homepage still 200', '#fff7ef', OR],
    ['Measure', 'df -h / → 39G 38G 0 100% · docker system df: images ≈ 19 GB, build cache ≈ 4.5 GB', '#eef4fa', BL],
    ['Cause', 'old images + build cache filled the disk Postgres lives on → WAL cannot be written', '#fff7ef', OR],
    ['Fix', 'docker system prune -af (never --volumes) → 100% → 71%; restart Postgres', '#f1f9f4', GR],
    ['Prevent', 'weekly cleanup by FREE SPACE, keep 3 deploy images, alert above 85%', '#f1f9f4', GR],
  ];
  let s = `<svg viewBox="0 0 1110 400" width="1110" height="400" font-family="Arial">`;
  s += `<defs><marker id="m21" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#888"/></marker></defs>`;
  rows.forEach(([k, v, f, c], i) => {
    const y = 6 + i * 79;
    s += R(10, y, 180, 60, c, c, { rx: 8 }) + T(100, y + 38, k, 22, { a: 'middle', w: 800, f: '#fff' });
    s += R(205, y, 895, 60, f, c, { rx: 8, sw: i === 1 ? 4 : 2 }) + T(225, y + 37, v, 19, { f: '#333' });
    if (i < 4) s += `<line x1="100" y1="${y + 62}" x2="100" y2="${y + 77}" stroke="#888" stroke-width="3" marker-end="url(#m21)"/>`;
  });
  return s + '</svg>';
};

/* Slide 12: một lõi nóng trong mười — trung bình che mất */
const cores = () => {
  const v = [0, 0, 100, 0, 100, 0, 0, 100, 0, 0];
  let s = `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial">`;
  v.forEach((p, i) => {
    const x = 20 + i * 76, h = p ? 150 : 4;
    s += R(x, 20, 60, 150, '#f3f3f3', '#ccc', { rx: 5, sw: 1.5 });
    s += R(x, 170 - h, 60, h, p ? RD + '55' : GR + '33', p ? RD : GR, { rx: 5, sw: 2 });
    s += T(x + 30, 196, 'cpu' + i, 15, { a: 'middle', f: '#555' });
  });
  s += R(800, 20, 290, 150, '#eef4fa', BL);
  s += T(945, 70, 'machine-wide average', 19, { a: 'middle', w: 700, f: BL });
  s += T(945, 122, '≈ 30% busy', 34, { a: 'middle', w: 800, f: BL });
  s += T(945, 156, '"looks half idle"', 18, { a: 'middle', f: '#555' });
  s += T(380, 222, 'illustration: three cores pinned by one 3-thread process — invisible in %Cpu(s)', 18, { a: 'middle', w: 700, f: RD });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 2 — Observing Linux', bai: '2.1',
}, [
  { cover: true, t: '"Slow" is not a diagnosis', sub: 'The USE method and the first five minutes<br>— ten commands on a box with two hidden culprits' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A five-row <b>incident format</b> that puts evidence before conclusions</li>
<li>The <b>USE method</b>: Utilization, Saturation, Errors for CPU, memory, disk, network</li>
<li><b>Ten commands</b> in a fixed order — run for real on a box we sabotaged</li>
<li>How to name a culprit with an <b>evidence line</b>, not "CPU high"</li>
<li>What a <b>container</b> sees wrongly: <code class="i">free</code> and the load average</li>
</ul>
${box('Measured, not claimed', 'Every output is a real run in the course lab: Ubuntu 26.04 in Docker Desktop, 10 CPUs, kernel 7.0.', 'lam')}` },

  { t: 'Every incident is written in five rows', giua: true, body: `
${incident()}
<p style="margin:0;font-size:21px;text-align:center"><b>Measure</b> comes before <b>Cause</b>: write down the evidence so the next person can check it.</p>` },

  { t: 'USE: three questions for each of four resources', giua: true, body: `
<table class="t" style="font-size:23px;line-height:2">
<tr><th style="width:13%">Resource</th><th>Utilization — how busy?</th><th>Saturation — is work queuing?</th><th>Errors</th></tr>
<tr><td><b>CPU</b></td><td><code class="i">mpstat</code>, <code class="i">pidstat</code></td><td>load vs <code class="i">nproc</code>, vmstat <code class="i">r</code></td><td>throttling (<code class="i">cpu.stat</code>)</td></tr>
<tr><td><b>Memory</b></td><td><code class="i">free -m</code> → <b>available</b></td><td>swapping: vmstat <code class="i">si/so</code></td><td>OOM kills, exit 137</td></tr>
<tr><td><b>Disk</b></td><td><code class="i">iostat -x</code>, <code class="i">df -h</code></td><td><code class="i">aqu-sz</code>, <code class="i">await</code>, vmstat <code class="i">b</code></td><td>I/O errors, "No space left"</td></tr>
<tr><td><b>Network</b></td><td><code class="i">sar -n DEV</code></td><td><code class="i">ss</code> Recv-Q / Send-Q</td><td>retransmits (<code class="i">sar -n ETCP</code>)</td></tr>
</table>
${box('Why a method', 'top opens on the CPU, so people stare at the CPU. The method makes you check all four — the real problem is often a full disk or a queue.', 'lam')}` },

  { t: 'Ten commands, always in this order', to: true, giua: true, body: `<div style="font-size:30px">` + two(
    steps(['<code class="i">uptime</code> — load, trend', '<code class="i">dmesg | tail</code> — kernel complaints', '<code class="i">vmstat 1 5</code> — everything in one line', '<code class="i">mpstat 1 1</code> — per CPU', '<code class="i">pidstat 1 1</code> — per process']),
    `<div class="steps">${['<code class="i">pidstat -d 1 1</code> — who writes', '<code class="i">iostat -dxz 1 2</code> — disk queue', '<code class="i">free -m</code> — memory', '<code class="i">sar -n DEV / TCP</code> — network', '<code class="i">top -b -n 1</code> — confirm'].map((t, i) => `<div><span class="n">${i + 6}</span><span>${t}</span></div>`).join('')}</div>`) + `</div>` + box('Gregg’s order', 'From the cheapest, widest view (load, kernel log) to the most specific (per-process, per-device). Each command takes one second.', 'lam') },

  { t: 'Steps 1–2: load is rising, the kernel is quiet', giua: true, body: `
${sh(g('uptime'))}
${sh(g('dmesg | tail'))}
${cards([
    ['4.17 · 1.84 · 1.25', 'Load averages over 1, 5, 15 minutes. Rising ⇒ the trouble started recently. Compare with the 10 CPUs.'],
    ['Only bridge chatter', 'No "Out of memory", no I/O error, no segfault — a whole family of causes ruled out in one second.'],
  ], 2)}` },

  { t: 'Step 3: vmstat already names two suspects', giua: true, body: `
${sh(g('vmstat 1 5'), { hl: [5, 6, 7, 8] })}
${cards([
    ['r 3–7, us 31–36%', 'Tasks waiting for a CPU, and about three of ten CPUs busy in user code.'],
    ['b 1–4, wa 14–28%', 'Tasks blocked on disk (state D) and CPUs idle waiting for it.'],
    ['bo: huge', 'Hundreds of thousands of KB written per second. Skip line 1: it is the average since boot.'],
  ])}` },

  { t: 'Steps 4–5: 300% CPU means three cores, one process', giua: true, body: `
${term(g('mpstat 1 1'))}
${term(g('pidstat 1 1').split('\n').slice(0, 7).join('\n'), { hl: [5] })}
${box('Over 100% is not a bug', '%CPU is counted per core: 300% = three cores busy at once — a multi-threaded process.', 'lam')}` },

  { t: 'Steps 6–7: a writer, and a disk that is queuing', giua: true, body: `
${term(g('pidstat -d'), { hl: [3] })}
${term(g('iostat -dxyz'), { hl: [3] })}
${cards([
    ['pidstat -d', 'names the writer: dd, 44 MB/s in that second.'],
    ['w_await 174.70 ms', 'each write waits that long — what the app feels.'],
    ['aqu-sz 27.15', '27 requests queued: saturation. iostat sees the whole device, pidstat one process.'],
  ])}` },

  { t: 'Steps 8–9: memory and network are ruled out', giua: true, body: `
${term(g('free -m'), { hl: [3] })}
${term(g('sar -n DEV'))}
${term(g('sar -n TCP,ETCP').split('\n').slice(0, 5).join('\n'))}
${cards([['Memory OK', '4.8 GB <b>available</b> — read that column, not free (lesson 2.3).'], ['Network OK', 'Zero packets per second, zero retransmits.']], 2)}` },

  { t: 'Step 10: top confirms both culprits', giua: true, body: `
${term(g('top -b -n 1'), { hl: [4, 9, 10] })}
${box('Read the header carefully', '<code>44.5 id</code> averaged over 10 CPUs — "half idle" — while node holds three cores and wa is 11.8%.', 'do2')}` },

  { t: 'The two culprits we planted', giua: true, body: term(g('ps -o pid,stat', 1, 112).replace(/^\$ ps .*$/m, (l) => l.slice(0, 60) + '…')) + two(
    term(g('grep -E').replace(/^\$ grep .*$/m, (l) => l.slice(0, 34) + '…')),
    sql(`// bao-cao.js — 3 threads that never stop
const spin = 'for (;;) { … }';
for (let i = 0; i < 2; i++)
  new Worker(spin, { eval: true });
for (;;) { … }          // main thread too

# sao-luu.sh — 200 MB at a time, O_DIRECT
while :; do dd if=/dev/zero of=/tmp/backup.bin \\
  bs=1M count=200 oflag=direct; done`, { lang: 'javascript', sm: true }), 'r37') +
    box('Evidence lines, not adjectives', '"pidstat: node 300%" · "iostat: aqu-sz 27, w_await 175 ms" — that is what goes into the incident channel.', 'xanh') },

  { t: 'The average hides three pinned cores', giua: true, body: `
${cores()}
${box('Always look per process and per core', '<code>pidstat</code> and <code>mpstat -P ALL</code>: a single-threaded API can be dead at 100% of one core while the machine "is 90% idle".', 'lam')}` },

  { t: 'Inside a container, free and load describe the host', giua: true, body: two(
    term(grab('c21-nhin', 'nproc', 2)), term(grab('c21-nhin', 'cat /proc/loadavg', 2))) + term(grab('c21-nhin', 'free -m', 2), { hl: [3, 5] }) + two(box('Container: --cpus 1 --memory 512m', 'Started with a 1-CPU quota and a 512 MB limit.', 'lam'), `<ul style="font-size:21px;margin:0">
<li><b>nproc</b> respects the quota: 1</li>
<li><b>free</b> shows the VM's 7.9 GB — the limit is <b>512 MB</b></li>
<li><b>load 2.43</b> belongs to the whole machine, not these 4 idle processes</li>
</ul>`, 'r37') + box('Read the cgroup instead', '<code>/sys/fs/cgroup/memory.current</code>, <code>memory.max</code>, <code>cpu.stat</code> — or <code>docker stats</code> from the host.', 'lam') },

  { t: 'Three mistakes that make incidents longer', to: true, giua: true, body: `
${cards([
    ['"The homepage loads, so the site is up"', '03/07/2026: the static homepage returned 200 while every database route returned 500. Check a route that uses each resource.'],
    ['Restarting before measuring', 'A restart takes the evidence with it: the runaway process, the queue, the open files, the last kernel lines. Two minutes of commands first.'],
    ['Trusting one number', '"Load 4" or "CPU 45% idle" means nothing alone: compare load with nproc, look per core and per process.'],
  ], 3)}
${box('Rule', 'Symptom → measure → cause → fix → prevent. Paste the output, then act.', 'do2')}` },

  { t: 'Cheat sheet — the first five minutes', giua: true, body: `
<table class="t" style="font-size:23px;line-height:1.9">
<tr><th style="width:40%">Run</th><th>Bad sign</th></tr>
<tr><td><code class="i">uptime</code></td><td>load ≫ cores, or rising fast</td></tr>
<tr><td><code class="i">dmesg | tail</code></td><td>Killed process · I/O error · segfault</td></tr>
<tr><td><code class="i">vmstat 1 5</code></td><td>b &gt; 0 with wa · si/so &gt; 0 · st &gt; 0</td></tr>
<tr><td><code class="i">mpstat 1 1</code> · <code class="i">pidstat 1 1</code></td><td>one process / one core at 100%</td></tr>
<tr><td><code class="i">pidstat -d</code> · <code class="i">iostat -dxz 1 2</code></td><td>await tens–hundreds of ms, aqu-sz &gt; 1</td></tr>
<tr><td><code class="i">free -m</code> · <code class="i">sar -n DEV/TCP</code> · <code class="i">top</code></td><td>available shrinking · retransmits · confirm</td></tr>
</table>` },
]);
