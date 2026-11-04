/**
 * nfd-10-4 — Networking for Developers, bài 10.4 "Đọc đúng 502, 503, 504 và 524" (slug netdev-10-4-ma-loi-gateway).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c104-*.out.txt) — 502 (upstream chết) + 504 (upstream chậm). Sự cố thật cuongthai 06/07.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-10-4', code: 'NFD 10.4', title: 'Reading 502, 503, 504 and 524', sub: 'Networking for Developers · Chapter 10' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 10 — Load balancing', bai: '10.4' }, [
  { cover: true, t: 'Reading 502, 503, 504 and 524', sub: 'Which layer emits which — and what each<br>says about the backend', nhan: 'Chapter 10 · Lesson 10.4' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li>These codes come from the <b>proxy/edge</b>, describing the <b>backend</b> — not from your app</li>
<li><b>502</b> broken reply · <b>503</b> no healthy backend · <b>504</b> too slow · <b>524</b> Cloudflare timeout</li>
<li>Both <b>502 and 504 measured</b> on the lab</li>
<li>The real outage: a backend restart loop → <b>502 for 7 minutes</b>, and how it was recovered</li>
<li>A diagnosis flow: <code class="i">curl</code> each hop to find which layer is unhappy</li>
</ul>` },

  { t: 'The four codes', giua: true, body: `
${bang(['Code', 'Means', 'Emitted by'], [
    ['<b>502</b> Bad Gateway', 'reached the backend, got a broken/empty reply', 'proxy / edge'],
    ['<b>503</b> Service Unavailable', 'no healthy backend to send to', 'proxy / LB'],
    ['<b>504</b> Gateway Timeout', 'backend did not answer within the read timeout', 'proxy / edge'],
    ['<b>524</b>', 'Cloudflare-specific 504: origin silent past ~100 s', 'Cloudflare'],
  ], { fs: 18 })}
${box('Key idea', 'All four come from <b>in front of</b> your app, describing the backend’s state — broken (502), missing (503), too slow (504/524). A 5xx your <b>app</b> returns is different: that is <code class="i">500</code>, your code throwing.', 'lam')}` },

  { t: '502 and 504 on the lab', giua: true, body: `
${term(ra('c104-codes', 'curl', 2), { sm: true, title: 'dead upstream → 502 ; slow backend vs 1 s timeout → 504' })}
${bang(['Lab condition', 'Code', 'Backend state'], [
    ['<code class="i">:8082</code> → a port no one listens on', '<b>502</b>', 'cannot connect / broken reply'],
    ['<code class="i">/slow</code> 3 s vs 1 s read timeout', '<b>504</b>', 'up, but too slow'],
  ], { fs: 20 })}
${box('', 'Same proxy, two different backend problems, two different codes. The code you get already tells you <b>which</b> problem you have — before you open a single backend log.', 'do2')}` },

  { t: '502 Bad Gateway', giua: true, body: `
${box('', 'The proxy reached a backend but the reply was <b>broken</b>: the backend crashed mid-response, closed the connection, returned garbage, or was not listening at all. 502 means <b>"I found your backend and it misbehaved."</b>', 'lam')}
${steps([
    'Backend process crashed / is restarting / not listening on the expected port',
    'Backend returned a malformed response or closed early',
    'First check: is the backend actually up and listening? (<code class="i">curl</code> it directly)',
  ])}` },

  { t: '504 vs 503 vs 524', giua: true, body: `
${bang(['Code', 'The backend is…', 'Fix direction'], [
    ['<b>504</b>', 'up but <b>too slow</b> (exceeds read timeout)', 'speed it up, or 202+poll (Ch8)'],
    ['<b>503</b>', '<b>missing</b> — none healthy / overloaded', 'add capacity, fix health checks'],
    ['<b>524</b>', 'silent past Cloudflare’s ~100 s', 'move long work off the request (Ch8)'],
  ], { fs: 19 })}
${box('', 'Reading the right code tells you <b>where</b> to look: 502 → backend broke, 503 → backend absent, 504/524 → backend slow. You met 524 and the 100 s edge timeout in Chapter 8.', 'lam')}` },

  { t: 'The real outage (cuongthai, 6 Jul 2026)', giua: true, body: `
${box('What happened', 'A deploy hit a backend <b>recreate race</b>: the container kept restarting and exiting with <code class="i">Exited(137)</code> (OOM-killed), with orphan containers around. With no healthy backend, nginx returned <b>502 for seven minutes</b>.', 'do2')}
${steps([
    'Symptom: steady 502 — the proxy was fine, it had <b>no backend</b> to reach',
    'Recovery: <code class="i">docker start cuonghoangdev_backend</code> to bring a healthy container back up',
    'Lesson that followed: deploys became a <b>script you run</b>, not a side effect of a push (no recreate race)',
  ])}` },

  { t: 'Diagnose: which layer is unhappy?', giua: true, body: `
${steps([
    'Ask the <b>backend directly</b> (bypass the proxy): is it up and fast? → rules 502/504 in or out',
    'Ask <b>through the proxy</b>: same path, compare — the code tells you broken / missing / slow',
    'Read the <b>code</b>, not the page: 502 ≠ 503 ≠ 504 point at different causes',
  ])}
${box('', 'A 5xx is never "the site is down" in the abstract. It is a specific sentence from a specific layer about the backend. <code class="i">curl</code> the hops and let the code name the problem.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>502/503/504</b> come from the <b>proxy/edge</b> about the <b>backend</b> (broken / missing / too slow); <b>524</b> is Cloudflare’s</li>
<li>Lab: a dead upstream → <b>502</b>; a slow backend vs a 1 s timeout → <b>504</b></li>
<li>A <b>500</b> is your app throwing; a <b>502</b> is the proxy reporting on a bad backend — different layers</li>
<li>Real outage: a backend restart loop (<code class="i">Exited(137)</code>) → <b>502 for 7 min</b>; recovered by starting a healthy container</li>
<li>Diagnose by <b>reading the code</b> and <code class="i">curl</code>-ing each hop — it names which layer, and the backend’s state</li>
</ul>
<p style="margin:0">${kw('502', 'upstream hỏng')} ${kw('503', 'không backend khoẻ')} ${kw('504', 'upstream chậm')} ${kw('524', 'timeout Cloudflare')} ${kw('500', 'app tự ném')}</p>` },
]);
