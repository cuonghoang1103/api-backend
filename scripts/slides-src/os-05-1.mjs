/**
 * os-05-1 — khoá "Operating Systems for Developers", bài 5.1 "Race conditions you can reproduce" (28/10/2026).
 * Khuôn _pg-chung.mjs (slide EN, dáng FU, logo CuongThai.com). Output đọc THẲNG từ lab/out/c51-race.out.txt (chạy thật
 * trong ảnh os-lab) qua grab() của _ui.mjs — không chép tay. Nhúng vào bài bằng giang/os-05-1.mjs (walk()).
 */
import { lamDeck, sql, psql, sh, two as two0, box, cards, kw, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-05-1', code: 'OS 5.1', title: 'Race conditions you can reproduce', sub: 'Operating Systems · Chapter 5' };

const g = (pre, n = 1) => grab('c51-race', pre, n);
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const big = (t, o = {}) => sh(t, { ...o });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 9}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"/>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b';

/* Slide 6: hai làn T1/T2 + hàng "memory" — mất một lần tăng */
const timeline = () => {
  const cols = [['load → r = 5', ''], ['', 'load → r = 5'], ['add, store 6', ''], ['', 'add, store 6']];
  const mem = ['5', '5', '6', '6 (not 7!)'];
  const x0 = 170, cw = 228;
  let s = `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">`;
  s += T(20, 92, 'Thread 1', 22, { w: 800, f: BL }) + T(20, 182, 'Thread 2', 22, { w: 800, f: OR }) + T(20, 272, 'memory', 22, { w: 800, f: '#555' });
  cols.forEach(([a, b], i) => {
    const x = x0 + i * cw;
    s += T(x + cw / 2 - 4, 34, `step ${i + 1}`, 18, { a: 'middle', f: '#888' });
    if (a) s += R(x, 58, cw - 12, 52, BL + '18', BL) + T(x + (cw - 12) / 2, 91, a, 19, { a: 'middle', m: 1 });
    if (b) s += R(x, 148, cw - 12, 52, OR + '18', OR) + T(x + (cw - 12) / 2, 181, b, 19, { a: 'middle', m: 1 });
    const bad = i === 3;
    s += R(x, 238, cw - 12, 52, bad ? RD + '18' : '#f3f3f3', bad ? RD : '#999') + T(x + (cw - 12) / 2, 271, `counter = ${mem[i]}`, 19, { a: 'middle', w: bad ? 800 : 400, f: bad ? RD : '#333' });
  });
  s += T(555, 322, 'Two increments happened; memory went up by one — a lost update.', 20, { a: 'middle', f: RD, w: 700 });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 5 — Synchronization', bai: '5.1',
}, [
  { cover: true, t: 'Race conditions<br>you can reproduce', sub: 'counter++ in C, Java and Node —<br>4 million increments, 1.2 million counted' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Make a <b>race condition</b> happen on demand — in C, Java and Node</li>
<li>See the three machine instructions behind <code class="i">counter++</code> where updates are lost</li>
<li>Know the words: <b>race condition</b>, <b>data race</b>, <b>critical section</b></li>
<li>Understand why the bug <b>hides</b> on one core or with <code class="i">-O2</code></li>
</ul>
${box('Measured, not claimed', 'Every output is a real run in the course lab: Ubuntu 26.04 container, 10 cores (arm64), gcc 15, Java 21, Node 22.', 'lam')}` },

  { t: 'The experiment: four threads, one counter', giua: true, body: two(
    sql(`long counter = 0;        // shared by all threads

void *worker(void *arg) {
    for (long i = 0; i < iters; i++)
        counter++;       // no lock
    return NULL;
}
// main: start N threads, join them,
// print expected vs got`, { lang: 'c' }),
    `<ul style="font-size:22px">
<li>Threads share one address space (Chapter 3) — <code class="i">counter</code> is the <b>same bytes</b> for all of them</li>
<li>N threads × 1,000,000 increments ⇒ the answer must be <b>N million</b></li>
<li>Run it with 1, 2 and 4 threads</li>
</ul>`) },

  { t: 'One thread is exact; four threads lose about 70%', giua: true, body: `
${big(g('./race 1', 3))}
${box('Two bugs in one', 'The total is wrong <b>and</b> different every run — nondeterministic, so one passing test proves nothing.', 'do2')}` },

  { t: 'counter++ is three instructions, not one', giua: true, body: `
${big(g('objdump -d --no-show-raw-insn race '))}
${cards([
    ['ldr — load', 'Read <code class="i">counter</code> from memory into register x0.'],
    ['add — add', 'x1 = x0 + 1, in the register only.'],
    ['str — store', 'Write x1 back to memory. (adrp/add just compute the address.)'],
  ])}
<p style="margin:0;font-size:22px">Another thread can run between <b>ldr</b> and <b>str</b> — that is the whole bug.</p>` },

  { t: 'Interleave two threads and one increment vanishes', giua: true, body: timeline() },

  { t: 'Three words for the rest of the course', giua: true, to: true, body: `
${cards([
    ['Race condition', 'The result depends on the <b>timing</b> of threads — who ran first.'],
    ['Data race', 'Same memory, at the same time, at least one <b>write</b>, nothing ordering them. Undefined behaviour in C/C++.'],
    ['Critical section', 'The code that touches the shared data — here load–add–store. Fix = only <b>one thread inside</b> at a time.'],
  ])}
<p style="margin:0;font-size:21px">${kw('lost update', 'one write overwrites another')} ${kw('atomic', 'indivisible: never seen half-done')}</p>` },

  { t: 'Why it hid: one core makes the window rare', giua: true, body: `
${big(g('taskset -c 0'))}
<ul>
<li>On one core threads <b>take turns</b>; a switch happens only when a time slice ends (ms)</li>
<li>Landing exactly between <b>ldr</b> and <b>str</b> is very unlikely</li>
<li>Unlikely ≠ impossible: run long enough and updates are still lost</li>
<li>A single-core CI runner can hide this bug for months</li>
</ul>` },

  { t: 'Why it hid: -O2 collapsed the loop', giua: true, body: two(
    term(g('objdump -d --no-show-raw-insn race-O2').replace(" | awk '/<worker>:/,/ret/'", ' | awk …')),
    `<ul style="font-size:22px">
<li>3 runs at <code class="i">-O2</code>: <b>4,000,000</b> every time</li>
<li>gcc replaced a million increments with <b>one</b> ldr, <code class="i">add x0, x0, x1</code> (whole count), str</li>
<li>Allowed: the compiler may assume <b>no data race</b></li>
<li>Still racy — the window is just nanoseconds. Add a function call and it is back</li>
</ul>`) },

  { t: 'Java: count++ loses about a third', giua: true, body: two(
    sql(`static int count = 0;

Runnable job = () -> {
    for (int i = 0; i < 1_000_000; i++)
        count++;      // getfield/iadd/putfield
};
// start two threads, join, print`, { lang: 'java' }),
    `${term(g('java Race.java', 2))}
${box('Same three steps', '<code>count++</code> compiles to getfield / iadd / putfield, and the JIT turns that into load / add / store.', 'lam')}`) },

  { t: 'Node: worker_threads on a SharedArrayBuffer', giua: true, body: `
${sql(`const a = new Int32Array(new SharedArrayBuffer(4));   // memory REALLY shared by workers
for (let i = 0; i < 1_000_000; i++) a[0]++;           // in each of 4 worker_threads`, { lang: 'javascript' })}
${big(g('node race-sab.js plain', 2))}
<p style="margin:0;font-size:22px">Ordinary JS objects are <b>copied</b> to workers — only a SharedArrayBuffer is shared. Node’s other race (across an <code class="i">await</code>) is lesson 5.4.</p>` },

  { t: '“It passed on my machine” proves nothing', giua: true, body: vsd(
    `<ul style="font-size:21px"><li>Ran the test once — green</li><li>CI has one core — green</li><li>Release build at -O2 — green</li><li>Added a log line and it “fixed itself”</li></ul>`,
    `<ul style="font-size:21px"><li>Ask: is anything <b>shared</b> and <b>written</b>?</li><li>Make the critical section exclusive: <b>lock</b> (5.2) or <b>atomic</b> (5.3)</li><li>Or stop sharing: per-thread data, merge once</li><li>Reproduce with many threads + many iterations</li></ul>`,
    '✗ Not evidence', '✓ What actually fixes it') },

  { t: 'Cheat sheet — reproduce a race', giua: true, body: `
<table class="t" style="font-size:23px">
<tr><th style="width:44%">You want to…</th><th>Run</th></tr>
<tr><td>Count cores the lab sees</td><td><code class="i">nproc</code></td></tr>
<tr><td>Build the racy counter honestly</td><td><code class="i">gcc -O0 -pthread race.c -o race</code></td></tr>
<tr><td>Make it fail loudly</td><td><code class="i">./race 4 1000000</code> (several times)</td></tr>
<tr><td>See the three instructions</td><td><code class="i">objdump -d --no-show-raw-insn race</code></td></tr>
<tr><td>Watch it hide</td><td><code class="i">taskset -c 0 ./race 4 1000000</code></td></tr>
<tr><td>Same bug in Java / Node</td><td><code class="i">java Race.java</code> · <code class="i">node race-sab.js plain</code></td></tr>
</table>
${box('Next', 'Lesson 5.2 — mutex, spinlock and condition variables: fixing it, and what each fix costs.', 'lam')}` },
]);
