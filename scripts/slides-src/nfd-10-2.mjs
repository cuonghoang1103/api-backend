/**
 * nfd-10-2 — Networking for Developers, bài 10.2 "Thuật toán chia và kiểm tra sức khoẻ" (slug netdev-10-2-thuat-toan).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c102-*.out.txt) — consistent hash (sticky theo user) + health failover (giết be2).
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-10-2', code: 'NFD 10.2', title: 'Algorithms and health checks', sub: 'Networking for Developers · Chapter 10' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 10 — Load balancing', bai: '10.2' }, [
  { cover: true, t: 'Algorithms and health checks', sub: 'How the LB picks a backend —<br>and how it stops using a sick one', nhan: 'Chapter 10 · Lesson 10.2' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li><b>The algorithms</b>: round robin, least connections, consistent hashing, weighted</li>
<li><b>Consistent hashing</b>: the same user always lands on the same backend (sticky)</li>
<li><b>Health checks</b>: active (the LB probes) vs passive (the LB notices failures)</li>
<li><b>Failover</b>: a killed backend is removed from the pool — measured</li>
<li><b>Connection draining</b>: taking a backend out <b>gracefully</b>, without dropping requests</li>
</ul>` },

  { t: 'The algorithms', giua: true, body: `
${bang(['Algorithm', 'Sends the request to…'], [
    ['<b>Round robin</b>', 'the next backend in turn — simple, even, the default'],
    ['<b>Least connections</b>', 'the backend with the fewest active connections — good for uneven/long requests'],
    ['<b>Consistent hashing</b>', 'a backend chosen by hashing a key (user/IP/URL) — same key → same backend'],
    ['<b>Weighted</b>', 'proportionally more to bigger backends (weight=3 gets 3× the traffic)'],
  ], { fs: 18 })}
${box('', '<b>IP hash</b> and <b>least-time</b> are variants. Round robin is the default; reach for the others when requests are uneven (least conn) or must stick (consistent hash).', 'lam')}` },

  { t: 'Consistent hashing: same user, same backend', body: `
${term(ra('c102-hash', 'for i', 2), { sm: true, title: 'hash $arg_user: alice always → one backend, bob → another' })}
${box('', '<code class="i">hash $arg_user consistent</code>: every request for <b>alice</b> hashes to the same backend; every request for <b>bob</b> to its own. Useful when a backend caches per-user data. "Consistent" means that adding/removing one backend only remaps a <b>small fraction</b> of keys, not all of them.', 'xanh')}` },

  { t: 'Health checks: active vs passive', giua: true, body: `
${bang(['Kind', 'How it works'], [
    ['<b>Passive</b>', 'the LB watches real traffic; after N failures (<code class="i">max_fails</code>) it marks a backend down for a while'],
    ['<b>Active</b>', 'the LB periodically probes a <code class="i">/health</code> endpoint, independent of user traffic'],
  ], { fs: 20 })}
${box('', 'Passive is free (nginx open-source default) but only notices a backend is sick <b>after</b> a user hits it. Active catches a sick backend <b>before</b> a user does, at the cost of probe traffic. A good <code class="i">/health</code> checks the backend’s own dependencies (DB, cache), not just "the process is up."', 'lam')}` },

  { t: 'Failover: a dead backend leaves the pool', body: `
${term(ra('c102-health-before', 'for i', 1), { sm: true, title: 'before: be1, be2, be3 all serve' })}
${term(ra('c102-health-after', 'for i', 1), { sm: true, title: 'after killing be2: only be1 and be3 serve' })}
${box('', 'Kill <b>be2</b> and nginx’s passive health check removes it: the first failed request is retried on a healthy backend (<code class="i">proxy_next_upstream</code>), and be2 is skipped until it recovers. The user never sees the failure — that is the whole point of a health check.', 'xanh')}` },

  { t: 'Connection draining', giua: true, body: `
${box('Key idea', 'To take a backend out for a deploy, do not just kill it — <b>drain</b> it: stop sending <b>new</b> requests, let the <b>in-flight</b> ones finish, then stop it. Killing it mid-request returns errors to real users.', 'do2')}
${steps([
    'Mark the backend <b>draining</b> at the LB (nginx: <code class="i">down</code> / a lower weight / a management API)',
    'In-flight requests complete; no new ones arrive',
    'Now it is safe to stop, update and return it — repeat per backend (rolling deploy)',
  ])}` },

  { t: 'Choosing an algorithm', giua: true, body: `
${bang(['Situation', 'Reach for'], [
    ['uniform, short requests', 'round robin (default)'],
    ['uneven / long-lived requests', 'least connections'],
    ['per-user cache, sticky needed', 'consistent hashing'],
    ['backends of different sizes', 'weighted'],
  ], { fs: 19 })}
${box('', 'Start with round robin; change only when a measurement tells you to. And always pair the algorithm with a <b>health check</b> and <b>draining</b> — spreading load onto a dead backend is worse than not spreading at all.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>Round robin</b> (default), <b>least connections</b> (uneven load), <b>consistent hashing</b> (sticky per key), <b>weighted</b> (uneven backends)</li>
<li><b>Consistent hashing</b>: same user → same backend; adding/removing a backend remaps only a small fraction of keys</li>
<li><b>Health checks</b>: passive (notices failures in real traffic) vs active (probes <code class="i">/health</code> ahead of users)</li>
<li>A <b>failed backend is removed</b> from the pool and the request retried — the user never sees it (measured)</li>
<li><b>Drain</b> before removing a backend: finish in-flight, accept no new — the basis of a rolling deploy</li>
</ul>
<p style="margin:0">${kw('round robin', 'xoay vòng')} ${kw('least conn', 'ít kết nối nhất')} ${kw('consistent hash', 'băm nhất quán')} ${kw('health check', 'kiểm sức khoẻ')} ${kw('draining', 'rút êm')}</p>` },
]);
