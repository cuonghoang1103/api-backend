/**
 * os-17-4 — khoá "Operating Systems for Developers", bài 17.4 "Postmortem and interview story" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c173-chan-doan.out.txt qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-17-4.mjs.
 */
import { lamDeck, sh, box, steps, vsd, cards } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-17-4', code: 'OS 17.4', title: 'Write the postmortem and your interview story', sub: 'Operating Systems · Chapter 17 — Capstone' };

const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.38">`);
const bang = (cols, rows, fs = 20) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 17 — Capstone', bai: '17.4',
}, [
  { cover: true, t: 'Write the postmortem<br>and your interview story', sub: 'Blameless, measured, with the whole-course checklist' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A <b>blameless postmortem</b> template — and why each section exists</li>
<li>A worked postmortem for the full disk of 17.3, every claim sourced</li>
<li>Three kinds of action items: <b>prevent · detect · mitigate</b></li>
<li>The <b>whole course as one checklist</b> before production</li>
<li>Your interview story: <b>STAR</b>, two numbers, two minutes</li>
</ul>` },

  { t: 'Marks for a postmortem', giua: true, body: bang(['#', 'Criterion', 'Marks'], [
    ['P1', 'impact in numbers, not adjectives', '2'], ['P2', 'timeline from evidence, each line with its source', '2'],
    ['P3', 'root cause names the mechanism; contributing factors say why it was allowed', '2'], ['P4', 'no names, no "human error"', '1'],
    ['P5', 'action items with owner, date, type — one of each type', '2'], ['P6', 'interview story under 2 minutes, two numbers', '1'],
  ], 21) },

  { t: 'The template: seven sections', giua: true, body: bang(['Section', 'Answers', 'Typical mistake'], [
    ['Summary', 'what broke, for whom, how long', 'telling the investigation'], ['Impact', 'numbers: failures, duration, data', '"some users"'],
    ['Timeline', 'what was seen and done, when — with sources', 'times from memory'], ['Detection', 'how we found out; how we should have', 'skipped'],
    ['Root cause + factors', 'the mechanism, then why nothing stopped it', 'stopping at the first why'],
    ['Went well / badly', 'tools and habits to keep or fix', 'only the bad'], ['Action items', 'owner · date · prevent / detect / mitigate', '"be more careful"'],
  ], 19) },

  { t: 'Worked example: the evidence behind every line', giua: true, body: term(grab('c173-chan-doan', 'docker exec os-17-traffic curl -s worker:3002/', 4, { drop: /^# / }), 13) },

  { t: 'Summary, impact, root cause', giua: true, to: true, body: cards([
    ['Summary', 'Thousands of jobs failed with ENOSPC: the 64 MiB log disk was full of a deleted log.'],
    ['Impact', '8,701 jobs succeeded, several thousand failed; their results were not written.'],
    ['Root cause', 'The process kept appending to a file the rotation script had unlinked.'],
    ['Contributing factors', 'DEBUG hard-coded · home-made rotation never reviewed · no disk alert'],
  ], 2) },

  { t: 'Action items: prevent, detect, mitigate', giua: true, to: true, body: cards([
    ['Prevent', 'log level from the environment, default INFO'], ['Prevent', 'log to stdout; Docker rotates by size'],
    ['Detect', 'alert at 80 % disk and on deleted-but-open files'], ['Mitigate', 'runbook: <code class="i">: &gt; /proc/PID/fd/N</code> frees space without a restart'],
  ], 2) + box('', 'Each with an owner and a date. "Be more careful" is not an action item.', 'lam') },

  { t: 'Pitfall: "root cause: human error"', giua: true, to: true, body: vsd(
    '"An engineer forgot to set the log level to INFO."',
    'Ask the next why: why could one setting fill the disk, why did nothing alert, why was a deleted file still growing? Each answer is an action item.') },

  { t: 'The whole course as one checklist (1/2)', giua: true, body: bang(['Resource', 'Check before production', 'Lesson'], [
    ['Processes', 'PID 1 forwards SIGTERM, reaps; shutdown within the grace period', '1.5, 17.2'],
    ['CPU', 'runtime sees the CPU limit; pool sized for CPU vs waiting work', '3.4, 17.2'],
    ['Concurrency', 'shared state locked; one global lock order; lock timeouts', '5.1, 6.1'],
    ['Memory', 'heap below the container limit; every cache bounded; OOM alerts', '8.5, 17.3'],
    ['Disk', 'rotation by size; 80 % alert; no deleted-open files; inodes', '2.4'],
  ], 19) },

  { t: 'The whole course as one checklist (2/2)', giua: true, body: bang(['Resource', 'Check before production', 'Lesson'], [
    ['Durability', 'what must survive is fsynced; temp → fsync → rename', '9.3'],
    ['File descriptors', 'close on every path; know the limit; stable under load', '10.1, 17.3'],
    ['Network I/O', 'timeouts everywhere; backpressure; one write per response', '10.8'],
    ['Containers', 'non-root, read-only root, caps dropped, no docker.sock, limits set', '12.7, 13.4'],
  ], 20) + box('', 'Keep it as PRODUCTION-CHECKLIST.md in your own project, every line checked or explained.', 'xanh') },

  { t: 'Your interview story: STAR with two numbers', giua: true, to: true, body: steps([
    '<b>Situation</b> with a number: "transfers timed out after 3 s at 0 % CPU"',
    '<b>Task</b>: "find the cause without restarting"',
    '<b>Action</b> with the tool: "idle + stuck ⇒ jstack ⇒ deadlock"',
    '<b>Result</b> with a number: "lock order; 100/100 transfers, total kept"',
  ]) },

  { t: 'What to put on your CV', giua: true, to: true, body: `
<ul>
<li>A <b>Projects</b> section: one line per project (17.1–17.3, 17.5)</li>
<li>Each linked to a repository whose README starts with the test output</li>
<li>One <b>postmortem</b> in the 17.3 repository</li>
<li><b>PRODUCTION-CHECKLIST.md</b> in your own backend</li>
</ul>` },

  { t: 'Practice: a postmortem the team reads on Monday', giua: true, to: true, body: `
<ol>
<li>Pick one incident of 17.3; fill every section with sources</li>
<li>Remove names and "should have been careful"</li>
<li>Three action items: prevent, detect, mitigate — owner and date</li>
<li>Record your STAR story; time it</li>
</ol>` + box('Done when', 'every claim has a command or log line behind it; the story is under two minutes.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>An incident ends when the team has learned from it</li>
<li>Blameless = ask why the system allowed it</li>
<li>Every claim needs a source; impact needs numbers</li>
<li>Action items: prevent · detect · mitigate, with owners</li>
<li>The course fits in one checklist; stories fit in STAR</li>
</ul>` },
]);
