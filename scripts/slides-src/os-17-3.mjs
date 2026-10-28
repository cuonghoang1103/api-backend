/**
 * os-17-3 — khoá "Operating Systems for Developers", bài 17.3 "Project 3: diagnose five planted incidents" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c173-*.out.txt qua grab() (chạy từ máy chủ, project compose os17).
 * Giảng: content/courses/operating-systems-for-developers/giang/os-17-3.mjs.
 */
import { lamDeck, sh, box, steps, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-17-3', code: 'OS 17.3', title: 'Project 3: diagnose five planted incidents', sub: 'Operating Systems · Chapter 17 — Capstone' };

const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.38">`);
const bang = (cols, rows, fs = 20) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
const D = (pre, n = 1) => grab('c173-chan-doan', pre, n, { drop: /^# / });

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 17 — Capstone', bai: '17.3',
}, [
  { cover: true, t: 'Project 3:<br>diagnose five planted incidents', sub: 'A Docker Compose shop under load, five OS-level bugs, a hidden answer key and a grader' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A five-service system under simulated traffic, with <b>one planted bug each</b></li>
<li>The rules: <b>OS evidence before source code</b></li>
<li>A grader: <code class="i">check.sh</code>, 2 marks per incident</li>
<li>Memory · file descriptors · disk · locks · I/O — found and fixed</li>
<li>Why "just restart it" destroys the evidence</li>
</ul>` },

  { t: 'The os17 stack', giua: true, body: bang(['Container', 'Lang', 'Does', 'Limit'], [
    ['os-17-shop', 'Node', 'product pages + cache', 'mem_limit 192m'], ['os-17-report', 'Node', 'report template', 'nofile 256'],
    ['os-17-worker', 'Python', 'background jobs, logs', 'tmpfs log disk 64 MiB'], ['os-17-billing', 'Java', 'wallet transfers, a lock each', 'pool of 16'],
    ['os-17-audit', 'Python', 'durable audit log', 'named volume'], ['os-17-traffic', 'bash', 'simulated users', '—'],
  ], 19) + box('Safety', 'tmpfs disk, capped memory, every container named os-17-* with label oslab=1; <code class="i">down -v</code> removes everything.', 'xanh') },

  { t: 'Rules and deliverable', giua: true, to: true, body: steps([
    '<b>Symptom</b> with a number',
    '<b>Evidence</b>: an OS command and its output — before reading the code',
    '<b>Root cause</b> in one sentence naming the mechanism',
    '<b>Fix</b> (diff) and <b>verification</b>: the check.sh line turns PASS',
    '<b>Prevention</b>: a limit, an alert or a test',
  ]) },

  { t: 'Start: the planted stack scores 0/10', giua: true, body: term(grab('c173-cham-loi', 'KEEP=1 ./check.sh'), 13) },

  { t: 'Step 0 — triage in two commands', giua: true, body: term(D('docker ps -a --filter label=com.docker.compose.project=os17', 2), 15) +
    box('', 'Up 10 s among Up 1 min ⇒ restarting. 126/192 MiB. 76 % CPU on background work. 39 threads at 0 % ⇒ waiting.', 'lam') },

  { t: 'Incident 1 — restarts: the kernel’s OOM kills', giua: true, body: term(D('docker inspect', 4), 13) +
    box('', 'OOMKilled=false describes the new process; docker events keeps oom + die 137. Cache keyed by a random ?t= ⇒ unbounded.', 'do2') },

  { t: 'Incident 2 — EMFILE: one fd leaked per request', giua: true, body: term(D('docker logs --tail 2 os-17-report', 2), 14) +
    box('', '255 of 256 fds open, 236 of them the same template — openSync without closeSync. Fix: read it once.', 'do2') },

  { t: 'Incident 3 — df 100 %, du 400 K', giua: true, body: term(D('docker exec os-17-traffic curl -s worker:3002/', 4), 13) +
    box('', 'Forgotten DEBUG logging + a rotation that deletes an open file ⇒ ENOSPC. Fix: INFO, WatchedFileHandler, keep one old file.', 'do2') },

  { t: 'Incident 4 — idle CPU, stuck requests: a deadlock', giua: true, body: term(D('docker exec os-17-billing', 1).split('\n').slice(0, 14).join('\n'), 15) +
    box('', 'transfer() locks source then destination; opposite transfers cross. Fix: lock wallets in id order.', 'do2') },

  { t: 'Incident 5 — one fsync per byte', giua: true, body: term(D("docker run --rm --label oslab=1 --name os-17-debug", 2), 14) +
    box('', 'A debug container in the PID namespace: 2,795 writes + 2,795 fsyncs in 4 s, and interleaved lines. Fix: one write + group commit.', 'do2') },

  { t: 'Finish: the reference fixes score 10/10', giua: true, body: term(grab('c173-cham-sua', './check.sh fixed', 2), 13) +
    box('', 'Same compose file and traffic, five source files changed: RSS 68 MiB, 19 fds, disk 1 %, 100/100 transfers, audit 0.7 ms.', 'xanh') },

  { t: 'Pitfall: "just restart it"', giua: true, to: true, body: vsd(
    'Restart the five services, watch them look healthy for a minute, close the tickets.',
    'Collect evidence first — docker events, /proc/PID/fd, df vs du, jstack, strace -c — then restart. After four OOM kills, inspect still said OOMKilled=false.') },

  { t: 'What to put on your CV', giua: true, to: true, body: box('One line', '"Diagnosed five concurrent production-style incidents in a Docker Compose system (OOM kills, fd exhaustion, deleted-but-open logs filling a disk, a Java deadlock, fsync-bound I/O) from OS-level evidence; fixed all five, verified by an automated health check (0/10 → 10/10)."', 'xanh') +
    box('Bring', 'one incident as a two-minute story, with the command that cracked it (17.4).', 'lam') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Triage by resource first: restarts, memory, CPU, idle threads</li>
<li>OOM ⇒ docker events · EMFILE ⇒ /proc/PID/fd · df≠du ⇒ deleted-open</li>
<li>Idle + stuck ⇒ jstack · slow I/O ⇒ strace -c from a debug container</li>
<li>Every fix keeps the service’s promise (the audit log stays durable)</li>
<li>Evidence before restart — always</li>
</ul>` },
]);
