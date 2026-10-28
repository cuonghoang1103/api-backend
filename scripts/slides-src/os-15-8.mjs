/**
 * os-15-8 — khoá "Operating Systems for Developers", bài 15.8 "A tuning story end to end" (29/10/2026).
 * Khuôn _pg-chung.mjs. Số đọc THẲNG từ lab/out/c158-story.out.txt. Giảng: giang/os-15-8.mjs.
 */
import { lamDeck, box, cards, flow } from './_pg-chung.mjs';
import { META, g, num, tiny, code, bars, SRC, dong, noCmt, BL, GR, RD, OR, PU } from './os-15-chung.mjs';

export const deck = { key: 'os-15-8', code: 'OS 15.8', title: 'A tuning story end to end', sub: 'Operating Systems · Chapter 15' };

const F = 'c158-story';
const p = (pre, n = 1) => { const m = g(F, pre, n).match(/intended start\s+p50\s+([\d.]+)\s+p95\s+([\d.]+)\s+p99\s+([\d.]+)/); return { p50: +m[1], p95: +m[2], p99: +m[3] }; };
const rps = (pre, n = 1) => +g(F, pre, n).match(/= (\d+) req\/s/)[1];
const fs_ = (pre, n = 1) => +g(F, pre, n).match(/"fsyncs":(\d+)/)[1];
const normal = p('node tai.js http://127.0.0.1:8080/checkout --rate 200'), sale = p('cat /tmp/sale.txt'), saleRps = rps('cat /tmp/sale.txt');
const A = p('UV_THREADPOOL_SIZE=64 LOG=sync', 2), B = p('LOG=async node checkout.js', 2), C = p('LOG=group node checkout.js', 2);
const C800 = p('node tai.js http://127.0.0.1:8080/checkout --rate 800'), Bf = fs_('LOG=async node checkout.js', 2), Cf = fs_('LOG=group node checkout.js', 2);
const C800f = fs_('node tai.js http://127.0.0.1:8080/checkout --rate 800') - Cf;
const lines = num(F, 'tail -2 /var/tmp/audit.log', /^(\d+)$/m);
const offPct = num(F, 'G=$(gpid $C)', /io_schedule\s+([\d.]+)%/), offUs = +num(F, 'G=$(gpid $C)', /^(\d+) us off-CPU/m);

export const slides = lamDeck(META('15.8'), [
  { cover: true, t: 'A tuning story, end to end', sub: 'Symptom → measure → hypothesis →<br>one change → verify → keep or revert' },

  { t: 'The loop this lesson follows', giua: true, body: `
${flow([
    { t: 'symptom', s: 'RED', mau: RD }, { t: 'measure', s: 'USE · off-CPU', mau: BL }, { t: 'hypothesis', s: 'one sentence', mau: PU },
    { t: 'one change', s: 'same load', mau: OR }, { t: 'verify', s: 'tail + promise', mau: GR }, { t: 'keep / revert', s: 'write it down', mau: '#777777' },
  ], { h: 130, fs: 17 })}
${box('The service', 'checkout.js answers “PAID” only after the order’s audit line is on disk. The lab gives it a disk budget of <b>300 write ops/s</b> (cgroup io.max) — a small cloud volume.', 'lam')}` },

  { t: 'Three ways to keep the same promise', body: `
${code(dong(SRC('checkout.js'), 40, 42), 'javascript', 14)}
${code(noCmt(dong(SRC('checkout.js'), 23, 33)), 'javascript', 14)}
${box('All three answer after the sync', '<b>sync</b>: fsyncSync on the event loop · <b>async</b>: the sync runs in the libuv pool · <b>group</b>: one write + one fdatasync for every order waiting, then answer them all.', '')}` },

  { t: `Symptom: ${normal.p99} ms normally, ${(sale.p99 / 1000).toFixed(1)} s on sale day`, giua: true, body: `
${bars([
    ['200 req/s — p99', normal.p99, GR, `${normal.p99} ms`],
    ['400 req/s — p50', sale.p50, RD, `${sale.p50.toLocaleString('en')} ms`],
    ['400 req/s — p99', sale.p99, RD, `${sale.p99.toLocaleString('en')} ms`],
  ], { label: 260, rowH: 52, log: true })}
${box('RED (open loop, lesson 15.6)', `Offered 400/s, served <b>${saleRps}/s</b>, 0 errors. Throughput stuck below the offered rate + exploding latency = a saturated resource. Which one?`, 'do2')}` },

  { t: 'USE: not CPU — the I/O budget is under pressure', body: tiny([
    g(F, 'python3 use.py 2'),
    g(F, 'pidstat -p $C'),
  ].join('\n'), 13) + box('Read it', 'Container CPU 2%, checkout 7–8% of one core: not CPU. The VM disk is busy 9%, yet <b>PSI io 16.7%</b>: work waits for the cgroup’s 300-IOPS budget.', 'lam') },

  { t: `Where the event loop’s time goes: ${(offUs / 1e6).toFixed(2)} s of 2 s off-CPU`, giua: true, body: `
${tiny([g(F, 'G=$(gpid $C)').split('\n').slice(0, 7).join('\n'), g(F, "sort -t' ' -k2 -nr off.folded")].join('\n'), 13)}
${box('Blocked in fsync', `${offPct}% of the main thread’s off-CPU time is io_schedule inside ext4_sync_file ← do_fsync: waiting for writeback. While it waits, no request is parsed or answered.`, '')}` },

  { t: `Hypothesis A: “more libuv threads” — p99 ${(A.p99 / 1000).toFixed(1)} s`, giua: true, body: `
${tiny(g(F, 'UV_THREADPOOL_SIZE=64 LOG=sync', 2), 16)}
${cards([
    ['Result', `p99 ${(sale.p99 / 1000).toFixed(1)} → ${(A.p99 / 1000).toFixed(1)} s: no improvement`],
    ['Why', 'fsyncSync runs on the event loop; the pool is never used by this code'],
    ['Decision', '<b>revert</b> — the change did not match the evidence'],
  ], 3)}` },

  { t: `Hypothesis B: async fsync — p99 ${(B.p99 / 1000).toFixed(2)} s`, giua: true, body: `
${tiny(g(F, 'LOG=async node checkout.js', 2), 16)}
${cards([
    ['Better', `the event loop is free: p99 ${(sale.p99 / 1000).toFixed(1)} → ${(B.p99 / 1000).toFixed(2)} s`],
    ['Not enough', `${Bf.toLocaleString('en')} syncs for 4 000 orders: one write op per order vs a 300/s budget`],
    ['The bottleneck moved', 'from the event loop to the disk budget — superseded by C'],
  ], 3)}` },

  { t: `Hypothesis C: group commit — p99 ${C.p99} ms`, giua: true, body: `
${tiny([g(F, 'LOG=group node checkout.js', 2), g(F, 'node tai.js http://127.0.0.1:8080/checkout --rate 800').split('\n').slice(0, 4).join('\n')].join('\n'), 15)}
${box('Change the cost per order', `400/s: all served, p99 ${C.p99} ms, ${Cf.toLocaleString('en')} syncs for 4 000 orders. 800/s: p99 ${C800.p99} ms, ${C800f.toLocaleString('en')} syncs for 8 000 — about 290 per second, right at the budget; batches grow with the load.`, 'xanh')}` },

  { t: 'p99 at 400 req/s, one change at a time', giua: true, body: `
${bars([
    ['baseline — fsyncSync', sale.p99, RD, `${sale.p99.toLocaleString('en')} ms`],
    ['A — 64 libuv threads', A.p99, RD, `${A.p99.toLocaleString('en')} ms · revert`],
    ['B — async fsync', B.p99, OR, `${B.p99.toLocaleString('en')} ms · superseded`],
    ['C — group commit', C.p99, GR, `${C.p99} ms · keep`],
  ], { label: 270, rowH: 50, log: true })}
<div class="cap" style="text-align:center">log scale · same open-loop load (tai.js --rate 400, 10 s) for every row</div>` },

  { t: 'Verify: the normal day, and the promise', giua: true, body: `
${tiny([(() => { const L = g(F, 'node tai.js http://127.0.0.1:8080/checkout --rate 800', 2).split('\n'); return L.slice(L.findIndex((l) => l.includes('--rate 200'))).join('\n'); })(), g(F, 'tail -2 /var/tmp/audit.log')].join('\n'), 16)}
${cards([
    ['Normal day still fine', `200 req/s with group commit: p99 8.6 ms vs ${normal.p99} ms before — same order, within noise`],
    ['Promise kept', `<b>${Number(lines).toLocaleString('en')} lines</b> for 13 600 orders (4 000 + 8 000 + 1 600): nothing answered was lost`],
  ], 2)}` },

  { t: 'Decide — and what we deliberately did not do', giua: true, body: `
<table class="t" style="font-size:18px">
<tr><th>change</th><th>evidence it addressed</th><th>p99 at 400 req/s</th><th>decision</th></tr>
<tr><td>baseline: fsyncSync per order</td><td>—</td><td>${sale.p99.toLocaleString('en')} ms, ${saleRps}/s served</td><td>—</td></tr>
<tr><td>A: UV_THREADPOOL_SIZE=64</td><td>none (pool unused)</td><td>${A.p99.toLocaleString('en')} ms</td><td><b>revert</b></td></tr>
<tr><td>B: async fsync per order</td><td>event loop blocked in fsync</td><td>${B.p99.toLocaleString('en')} ms</td><td>superseded</td></tr>
<tr><td>C: group commit</td><td>one write op per order &gt; 300/s</td><td><b>${C.p99} ms</b></td><td><b>keep</b></td></tr>
</table>
${box('Not tried, not measured', 'Dropping fsync (breaks the promise) · vm.dirty_* (an explicit fsync ignores them) · mount options that disable write barriers (trade correctness for speed).', 'do2')}` },

  { t: 'Write it up: a blameless postmortem', to: true, giua: true, body: cards([
    ['Symptom & impact', `p99 ${(sale.p99 / 1000).toFixed(1)} s at 400 req/s; ${saleRps}/s served`],
    ['Evidence', 'CPU 2% · PSI io 16.7% · event loop 88% off-CPU in fsync'],
    ['Hypotheses', 'A reverted · B superseded · C kept — each with numbers'],
    ['Fix & verification', `group commit: ${C.p99} ms at 400/s, ${C800.p99} ms at 800/s, 13 600/13 600 lines`],
    ['Follow-ups', 'alert on PSI io and on syncs/s near the budget'],
    ['Next', 'Chapter 17: an incident you did not plant'],
  ], 3) },
]);
