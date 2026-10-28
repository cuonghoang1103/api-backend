/**
 * os-17-1 — khoá "Operating Systems for Developers", bài 17.1 "Project 1: a mini shell in C" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c171-shell.out.txt qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-17-1.mjs.
 */
import { lamDeck, sh, box, steps, vsd, two, flow } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-17-1', code: 'OS 17.1', title: 'Project 1: a mini shell in C', sub: 'Operating Systems · Chapter 17 — Capstone' };

const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.38">`);
const bang = (cols, rows, fs = 20) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
const S = (pre, n = 1) => grab('c171-shell', pre, n, { drop: /^# / });

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 17 — Capstone', bai: '17.1',
}, [
  { cover: true, t: 'Project 1:<br>a mini shell in C', sub: 'Pipes, redirection, background jobs and signals — graded by a machine' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>How Chapter 17 works: <b>printable briefs</b>, tests, reference solutions</li>
<li>The brief for <code class="i">msh</code>: contract, marks, milestones</li>
<li>The acceptance tests: ctsh.c <b>0/10</b>, reference <b>10/10</b></li>
<li>A pipeline seen system call by system call</li>
<li>One missing <code class="i">close()</code>, two failing tests — and your CV line</li>
</ul>` },

  { t: 'Chapter 17: four projects and a stretch, all tested', giua: true, body: bang(['Project', 'Time', 'Proves', 'Test'], [
    ['17.1 Mini shell (C)', '3–4 days', 'processes, fds, pipes, signals', 'shell/test-shell.sh'],
    ['17.2 Thread-pool server', '3–4 days', 'threads, queues, timeouts, shutdown', 'server/test-server.sh'],
    ['17.3 Five planted incidents', '1–2 days', 'the course’s tools, under pressure', 'incident/check.sh'],
    ['17.4 Postmortem + story', '½ day', 'explaining without blame', 'template + rubric'],
    ['17.5 Stretch: container runtime', '2–3 days', 'namespaces, cgroups, caps', 'ctr/test-ctr.sh'],
  ], 19) + box('', 'Every brief: spec · milestones · acceptance tests · reference solution (10/10) · rubric · CV note.', 'lam') },

  { t: 'The contract the tests rely on', giua: true, body: bang(['Input', 'Must do'], [
    ['<code class="i">a | b | c</code>', 'one pipeline; <code class="i">$?</code> = status of the last stage'],
    ['<code class="i">&lt; &gt; &gt;&gt; 2&gt; 2&gt;&amp;1</code>', 'redirect stdin, stdout (truncate/append), stderr, merge'],
    ['<code class="i">cmd &amp;</code> · <code class="i">jobs</code>', '<code class="i">[n] PID</code>, <code class="i">[n] Running</code>, <code class="i">[n] Done (status)</code>'],
    ['unknown program', '<code class="i">msh: NAME: No such file or directory</code>, 127'],
    ['Ctrl-C (SIGINT)', 'kills the foreground job — never the shell'],
  ], 21) },

  { t: 'Six milestones, ten marks', giua: true, body: bang(['#', 'Milestone', 'Marks'], [
    ['M1', 'run programs, $?, 127, cd as a built-in', '2'], ['M2', 'redirection', '1.5'], ['M3', 'pipelines, 5 stages, yes | head, fds 0 1 2', '2'],
    ['M4', 'background jobs, jobs, Done, no zombie', '2'], ['M5', 'own process group; SIGINT kills the job, not the shell', '1.5'], ['M6', 'exit n; no fd leak after 200 pipes', '1'],
  ], 21) },

  { t: 'Four days, one lesson behind each', giua: true, to: true, body: steps([
    '<b>Day 1</b> M1 + M2: tokenizer, <code class="i">$?</code>, open + dup2 in the child (9.2)',
    '<b>Day 2</b> M3: pipe2(O_CLOEXEC); the parent closes every end (10.1)',
    '<b>Day 3</b> M4: job table; SIGCHLD flag; waitpid(WNOHANG) in the loop (1.4)',
    '<b>Day 4</b> M5 + M6: setpgid on both sides; ignore SIGINT; run the tests',
  ]) },

  { t: 'Start: ctsh.c from Chapter 1 scores 0/10', giua: true, body: term(S('shell/test-shell.sh /tmp/start').split('\n').slice(0, 17).join('\n'), 15) },

  { t: 'The reference solution: 221 lines, 10/10', giua: true, body: term(S('wc -l shell/msh.c', 2), 15) },

  { t: 'A pipeline, process by process', giua: true, body: term(S("for f in $(ls /tmp/tr.*"), 15, 1100) +
    box('', 'One pipe (3, 4). Both children join group 1923. dup3 wires the ends (glibc’s dup2 on arm64). The shell waits for both.', 'lam') },

  { t: 'Why setpgid is called twice', giua: true, to: true, body: flow([
    { t: 'fork()', s: 'parent and child', mau: '#336791' }, { t: 'setpgid', s: 'in the child', mau: '#e08a1e' },
    { t: 'setpgid', s: 'in the parent', mau: '#e08a1e' }, { t: 'kill(−pgid)', s: 'Ctrl-C reaches the job', mau: '#2f7d4f' },
  ], { fs: 20 }) + box('', 'Whichever process runs first, the group exists before any signal is sent to it — no race.', 'lam') },

  { t: 'One missing close(): two failing tests', giua: true, body: term(S("sed 's|if (pfd", 2), 16) +
    box('', 'wc waits for EOF, and EOF needs every write end closed — including the shell’s copy. 200 pipes ⇒ 200 leaked fds.', 'do2') },

  { t: 'Background jobs and the Done message', giua: true, body: term(S("printf 'sleep 0.2 &"), 22) +
    box('', 'SIGCHLD only sets a flag; the main loop reaps with waitpid(−1, WNOHANG) and prints Done — no zombie remains.', 'lam') },

  { t: 'Pitfall: "[killed by signal 2]" printed late', giua: true, to: true, body: vsd(
    'printf the message and fork the next command: stdout to a file is block-buffered, so it appears after the child’s output.',
    '<code class="i">setvbuf(stdout, NULL, _IOLBF, 0)</code> at start (or fflush before every fork) — the same buffer that printed twice in 1.2.') },

  { t: 'What to put on your CV', giua: true, to: true, body: box('One line', '"Wrote a Unix shell in C (220 lines): N-stage pipelines, I/O redirection, background job control with process groups and SIGCHLD reaping; verified with a 15-case automated acceptance suite (10/10)."', 'xanh') +
    box('Be ready to explain', 'why cd is a built-in · why the parent closes pipe ends · why setpgid twice · what 130 means', 'lam') },

  { t: 'Practice: the Dockerfile line that always "succeeds"', giua: true, to: true, body: `
<ol>
<li>Copy ctsh.c to <code class="i">ch17/mine/msh.c</code>; run the tests: 0/10</li>
<li>Implement M1 + M2; re-run until both pass</li>
<li>Two-stage pipe: <code class="i">false | true; echo $?</code> in msh and bash</li>
<li>Explain <code class="i">RUN make 2&gt;&amp;1 | tee log</code> and <code class="i">set -o pipefail</code></li>
</ol>` + box('Done when', 'M1 and M2 PASS on your code; your answer names "status of the last stage".', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>A shell = fork, exec, wait; redirection = dup2 in the child</li>
<li>A pipeline = N children, N−1 pipes; the parent closes every end</li>
<li>Jobs get their own process group; Ctrl-C ⇒ 130, the shell survives</li>
<li>SIGCHLD + WNOHANG in the loop ⇒ no zombies</li>
<li>Tests decide "done": 0/10 → 10/10, one bug ⇒ 9/10</li>
</ul>` },
]);
