/**
 * nfd-09-3 — Networking for Developers, bài 9.3 "Mở rộng kết nối sống lâu" (slug netdev-9-3-mo-rong-ws).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c93-*.out.txt) — trần fd, đếm kết nối, lịch nối lại có lùi dần.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-09-3', code: 'NFD 9.3', title: 'Scaling long-lived connections', sub: 'Networking for Developers · Chapter 9' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 9 — Real-time connections', bai: '9.3' }, [
  { cover: true, t: 'Scaling long-lived connections', sub: 'File descriptors, sticky sessions, reconnect with<br>backoff, and deploying without cutting everyone', nhan: 'Chapter 9 · Lesson 9.3' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li><b>Every connection is a file descriptor</b> — and there is a hard limit per process</li>
<li><b>Counting</b> the live connections on a server (<code class="i">ss</code>)</li>
<li><b>Sticky sessions</b>: a stateful socket is pinned to one server</li>
<li><b>Reconnect with backoff + jitter</b> — so a restart does not trigger a thundering herd</li>
<li><b>Deploying</b> without cutting everyone off — drain, and let clients reconnect</li>
</ul>` },

  { t: 'Every connection costs a file descriptor', body: `
${term(ra('c93-scale', 'ulimit', 1), { sm: true, title: 'the soft limit on open file descriptors for this process' })}
${box('', 'A short HTTP request opens a socket and closes it in milliseconds. A WebSocket/SSE connection stays <b>open for hours</b> — and each open socket is a <b>file descriptor</b>. A process has a hard cap (<code class="i">ulimit -n</code>); hit it and new connections fail with <i>too many open files</i>. 50k idle connections is a RAM and fd problem, not a CPU one.', 'lam')}` },

  { t: 'Count the live connections', giua: true, body: `
${term(ra('c93-scale', 'for i', 2), { sm: true, title: 'open 5 SSE connections, then count ESTABLISHED sockets to :5100' })}
${box('', 'Each client that stays connected is one socket in <code class="i">ESTABLISHED</code> and one fd on the server. This is the metric you watch when scaling real-time: not requests per second, but <b>concurrent open connections</b>.', 'lam')}
${box('Capacity', 'Plan it as <code class="i">fd limit × RAM per connection × processes</code>. 50k idle WebSockets is a <b>RAM + fd</b> problem, not a CPU one — the sockets cost memory just by existing. Graph and alert on concurrent connections, not req/s.', 'do2')}` },

  { t: 'Sticky sessions', giua: true, body: `
${box('Key idea', 'A long-lived connection carries <b>state</b> (who you are, which room). A load balancer must send every frame of that connection to the <b>same</b> server — a <b>sticky session</b> — or the server on the other end has no idea who you are.', 'do2')}
${steps([
    'L4 LBs are naturally sticky per connection (one TCP flow → one backend)',
    'Across <b>reconnects</b>, stickiness can break — the new socket may land elsewhere',
    'The durable fix: don’t keep room state only in one process — share it (Redis pub/sub) so any server can serve any client',
  ])}` },

  { t: 'Reconnect with backoff and jitter', body: `
${term(ra('c93-scale', 'node', 1, { max: 12 }), { sm: true, title: 'exponential backoff + jitter: 1s, 2s, 4s… capped, spread out' })}
${box('', 'When a server restarts, <b>all</b> its clients drop at once. If they all reconnect immediately, that is a <b>thundering herd</b> — 10k connections in one millisecond — which knocks the server over again. Back off exponentially (1s, 2s, 4s… to a cap) and add <b>jitter</b> so they do not all return on the same tick.', 'do2')}` },

  { t: 'Deploy without cutting everyone', giua: true, body: `
${steps([
    'A deploy restarts the process → every WebSocket/SSE drops at once',
    'Clients auto-reconnect (SSE for free; WebSocket with your backoff) to the new instance',
    'Make it graceful: <b>drain</b> (stop accepting new, let in-flight finish), roll instances one at a time, keep room state in Redis so reconnects resume',
  ])}
${box('', 'The goal is that a deploy is a <b>brief reconnect</b>, not an outage. Short-lived HTTP barely notices a restart; long-lived connections must be <b>designed</b> to survive one.', 'lam')}` },

  { t: 'The scaling checklist', giua: true, body: `
${bang(['Concern', 'What to do'], [
    ['File descriptors', 'raise <code class="i">ulimit -n</code>; plan fd × RAM per connection'],
    ['Routing', 'sticky per connection; share state so any server works'],
    ['Reconnect', 'exponential backoff + jitter; resume state on reconnect'],
    ['Fan-out', 'one event to many clients across servers → Redis pub/sub'],
    ['Deploys', 'drain + rolling restart; clients reconnect, not error'],
  ], { fs: 18 })}
${box('', 'Each row is a way a naive real-time service falls over at scale: it runs out of file descriptors, loses a user’s state on a reconnect, melts under a reconnect storm, cannot fan one event out across servers, or turns every deploy into a small outage. Design for all five from the start.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Every open connection is a <b>file descriptor</b>; there is a hard per-process limit (<code class="i">ulimit -n</code>)</li>
<li>Scale by <b>concurrent connections</b>, not requests/s: fd limits × RAM × processes</li>
<li>Long-lived connections carry state → <b>sticky sessions</b>, and share room state (Redis) so any server works</li>
<li>Reconnect with <b>exponential backoff + jitter</b> to avoid a thundering herd after a restart</li>
<li>Deploy by <b>draining</b> and rolling; a deploy should be a brief reconnect, not an outage</li>
</ul>
<p style="margin:0">${kw('file descriptor', 'trần fd')} ${kw('sticky session', 'ghim một server')} ${kw('backoff + jitter', 'lùi dần + nhiễu')} ${kw('thundering herd', 'bầy đàn nối lại')} ${kw('drain', 'rút êm')}</p>` },
]);
