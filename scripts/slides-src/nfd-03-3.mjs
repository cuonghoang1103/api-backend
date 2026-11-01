/**
 * nfd-03-3 — Networking for Developers, bài 3.3 "TTL, cache và vì sao đổi DNS lại chậm" (slug netdev-3-3-ttl-cache).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c33-*.out.txt). Mốc giờ của sơ đồ dòng thời gian lấy từ c33-theo-doc / c33-ns-*.
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra, svg, T, R, C } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-03-3', code: 'NFD 3.3', title: 'TTL, caching and why DNS changes are slow', sub: 'Networking for Developers · Chapter 3' };
const term = (t, o = {}) => sh(t, o);
const D = { drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN|^$/ };

/** Dòng thời gian thí nghiệm (giây tính từ 16:10:46 — lần resolver lấy bản ghi). */
function dongThoiGian() {
  const x0 = 70, px = 4.6, y = 120, X = (t) => x0 + t * px;
  let s = '';
  s += `<line x1="${X(0)}" y1="${y}" x2="${X(225)}" y2="${y}" stroke="#555" stroke-width="3"/>`;
  for (let t = 0; t <= 225; t += 15) s += `<line x1="${X(t)}" y1="${y - 6}" x2="${X(t)}" y2="${y + 6}" stroke="#555" stroke-width="2"/>`;
  // bản cũ trong cache: 0 → 120 s
  s += R(X(0), y - 70, 120 * px, 34, '#e8f0f8', C.ip, { rx: 6 }) + T(X(60), y - 47, 'resolver keeps .10 — old TTL 120 counting down', 15, { a: 'middle', w: 800, f: C.ip });
  s += R(X(120), y - 70, 30 * px, 34, '#fff3c4', C.or, { rx: 6 }) + T(X(135), y - 47, '.11', 15, { a: 'middle', w: 800, f: C.br });
  s += R(X(150), y - 70, 75 * px, 34, '#e9f5ec', C.tcp, { rx: 6 }) + T(X(187), y - 47, '.10 again', 15, { a: 'middle', w: 800, f: C.tcp });
  const vach = (t, y2, c) => `<line x1="${X(t)}" y1="${y}" x2="${X(t)}" y2="${y2}" stroke="${c}" stroke-width="2.5" stroke-dasharray="5 4"/>`;
  s += vach(5, y + 118, C.red) + vach(16, y + 118, C.red);
  s += T(X(16) + 6, y + 136, '16:10:51 TTL → 10, 16:11:02 IP → .11', 15, { w: 800, f: C.red }) + T(X(16) + 6, y + 156, 'both on ns1 — the IP change came too early', 13, { f: '#555' });
  s += vach(121, y + 52, C.or);
  s += T(X(121) - 6, y + 70, '16:12:47 laptop sees .11', 15, { a: 'end', w: 800, f: C.br }) + T(X(121) - 6, y + 90, '1 min 45 s after the change', 13, { a: 'end', f: '#555' });
  s += vach(141, y + 118, C.tcp);
  s += T(X(141) + 6, y + 136, '16:13:07 IP → .10', 15, { w: 800, f: C.tcp }) + T(X(141) + 6, y + 156, 'seen at 16:13:17 (TTL 10)', 13, { f: '#555' });
  s += T(X(0), y + 26, '0 s', 13, { a: 'middle', f: '#777' }) + T(X(120), y + 26, '120 s', 13, { a: 'middle', f: '#777' }) + T(X(225), y + 26, '225 s', 13, { a: 'middle', f: '#777' });
  return svg(1110, 290, s);
}

export const slides = lamDeck({ chuong: 'Chapter 3 — DNS in depth', bai: '3.3' }, [
  { cover: true, t: 'TTL, caching and<br>why DNS changes are slow', sub: 'A server move done in the wrong order — then right —<br>measured second by second', nhan: 'Chapter 3 · Lesson 3.3' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>TTL</b> really is — measured counting down inside a resolver</li>
<li>The <b>layers of cache</b> between your users and your server</li>
<li>A server move done <b>in the wrong order</b>: how long users kept the old IP</li>
<li>The <b>right procedure</b> for changing a record without hurting anyone</li>
<li><b>Negative caching</b>: a name that “does not exist” after you created it</li>
<li>Inside your app: <b>Java caches, Node does not</b> — and Node’s thread pool with slow DNS</li>
</ul>` },

  { t: 'The TTL counts down in every cache', body: `
${term(ra('c33-dem', 'dig +noall +answer api.labflow.test', 4, D), { title: 'nfi-laptop: through the resolver, twice — then the authoritative server' })}
${steps([
    'The authoritative server always says <b>120</b>: the TTL written in the zone',
    'The resolver says 120, then <b>115</b> five seconds later: it stores an expiry time and reports what is left',
    'At 0 the record is thrown away and the next question goes back up the tree',
  ])}` },

  { t: 'Inside the resolver', giua: true, body: `
${term(ra('c33-isp-cache', 'unbound-control dump_cache', 2, D), { title: 'nfi-isp (Unbound)' })}
${box('A TTL is a promise', 'Once a resolver holds your record with 115 s left, <b>nothing you do on your server</b> makes it forget sooner. Two questions here: one miss (went to the Internet), one hit.', 'do2')}` },

  { t: 'Every layer has its own cache', giua: true, body: `
${bang(['Layer', 'Example', 'Clear it'], [
    ['Browser', 'Chrome / Firefox host cache', '<code class="i">chrome://net-internals/#dns</code>'],
    ['Your runtime', 'JVM: 30 s by default · Node: <b>no cache</b>', 'restart · <code class="i">networkaddress.cache.ttl</code>'],
    ['Operating system', 'systemd-resolved, macOS mDNSResponder, Windows DNS Client', '<code class="i">resolvectl flush-caches</code> · <code class="i">ipconfig /flushdns</code>'],
    ['Recursive resolver', 'ISP DNS, 1.1.1.1, 8.8.8.8, company DNS', 'only its operator (public resolvers: purge page)'],
  ], { fs: 18 })}
${box('', 'The resolver’s copy matters most: it serves thousands of users. Unbound caps every record at one day (<code class="i">cache-max-ttl 86400</code>).', 'lam')}` },

  { t: 'Experiment: lower the TTL, then change the IP 11 s later', body: `
${term(ra('c33-ns-ha', 'date', 4, { ...D, gay: 96 }), { sm: true, title: 'nfi-ns 16:10:51 — TTL of api 120 → 10' })}
${term(ra('c33-ns-doi', 'date', 4, { ...D, gay: 96 }), { sm: true, title: 'nfi-ns 16:11:02 — api .10 → .11 (Singapore)' })}` },

  { t: 'What the laptop received, every 15 seconds', body: `
${two(term(ra('c33-theo-doc', 'cat', 1, D), { title: 'nfi-laptop → resolver' }), `<div>${steps([
    '16:10:51, 16:11:02: changes on the server — the laptop sees <b>nothing</b>',
    'The resolver keeps counting down the <b>old</b> TTL 120: it does not know, and does not ask',
    '16:12:47: old copy expired ⇒ new record, TTL 10, <b>.11</b>',
    '16:13:07 second change ⇒ seen at 16:13:17',
  ])}</div>`)}` },

  { t: 'The timeline: 1 min 45 s of the old IP', giua: true, body: `
${dongThoiGian()}
${box('Rule', 'Worst-case delay of a change = the TTL that was in caches <b>when you changed</b> — not the TTL you set at that moment.', 'do2')}` },

  { t: 'The right order for moving a server', to: true, giua: true, body: `
${steps([
    '<b>Lower the TTL</b> (e.g. 3600 → 60) — and nothing else',
    '<b>Wait at least the old TTL</b> (one hour here): every cached copy now expires within 60 s',
    '<b>Change the IP</b> — keep the old server running a while (60 s + runtime caches)',
    '<b>Verify</b> on ns1 and ns2 directly, then through a few resolvers',
    '<b>Raise the TTL back</b> once no rollback is needed: fewer lookups, more resilience',
  ])}` },

  { t: 'Negative caching: “it does not exist” is cached too', body: `
${term(ra('c33-am', 'dig new.labflow.test', 1, D), { sm: true, title: 'nfi-laptop: someone checks new.labflow.test before creating it' })}
${term(ra('c33-am-ns', 'printf', 3, { ...D, gay: 96 }), { sm: true, title: 'nfi-ns: now the record is created' })}
${term(ra('c33-am2', 'dig', 2, D), { sm: true, title: 'nfi-laptop: ns1 has it — the resolver still says NXDOMAIN (298 s left)' })}` },

  { t: 'Flushing one name was not enough', body: `
${term([ra('c33-am-xoa1', 'unbound-control flush', 1, D), ra('c33-am3b', 'dig', 1, D)].join('\n'), { sm: true, title: 'nfi-isp then nfi-laptop: flush the name ⇒ still NXDOMAIN' })}
${term([ra('c33-am-xoa2', 'unbound-control', 2, D), ra('c33-am3', 'dig', 1, D)].join('\n'), { sm: true, title: 'flush the whole zone ⇒ the new name resolves' })}
${steps([
    'Negative TTL = min(SOA TTL, SOA minimum) = min(3600, 300) = <b>300 s</b> (RFC 2308)',
    'Signed zone: the resolver kept the <b>NSEC</b> proof “after mail comes ns1” — nothing called new exists',
    '<b>aggressive-nsec</b> (RFC 8198) answers from that proof ⇒ flush the whole zone',
  ])}` },

  { t: 'Real world: “does not exist” for 30 minutes', giua: true, body: `
${term(ra('c33-that', 'dig', 2, D), { title: 'real Internet — Cloudflare’s name server for cuongthai.com' })}
${bang(['Zone', 'SOA TTL · minimum', 'NXDOMAIN cached for'], [
    ['labflow.test (lab)', '3600 · 300', 'min(3600, 300) = <b>300 s</b>'],
    ['cuongthai.com (Cloudflare)', '1800 · 1800', '<b>1800 s = 30 min</b>'],
  ], { fs: 20 })}
${box('“I just created it and it says it does not exist”', 'New subdomain checked too early, a monitoring probe, Let’s Encrypt DNS-01 asking before the TXT exists… <b>Create first</b>, check on the authoritative server, then through a resolver.', 'do2')}` },

  { t: 'Inside your app: Java remembers, Node asks every time', body: `
${term(ra('c33-app', 'java', 4, D), { title: 'nfi-laptop: 5 lookups 1 s apart — then count the DNS questions that left the machine' })}
${box('', 'JVM: one trip to the network (A + AAAA), then its own cache — <b>30 s</b> by default (<code class="i">DEFAULT_POSITIVE = 30</code>). Node: <b>5 questions</b>, no DNS cache.', 'lam')}` },

  { t: 'Two traps, one per runtime', to: true, giua: true, body: `
${bang(['Runtime', 'Trap', 'Do this'], [
    ['Java', '<code class="i">networkaddress.cache.ttl=-1</code> or a security manager ⇒ old IP <b>until restart</b>', 'set it explicitly (30–60 s) in containers / Kubernetes'],
    ['Node', 'no DNS cache ⇒ every new connection does a lookup', 'reuse connections (keep-alive is the default since v19); cache DNS if you call many hosts'],
  ], { fs: 20 })}
${box('Either way', 'After a move, the old address can live in the <b>DNS caches</b> (TTL) <b>plus</b> the <b>runtime cache</b> (Java 30 s, or forever if misconfigured). Keep the old server up a little longer than the TTL.', 'lam')}` },

  { t: 'Slow DNS and Node’s thread pool', body: `
${term(ra('c33-treo', 'node treo.mjs', 1, D), { sm: true, title: 'nfi-laptop: 4 lookups of names whose server never answers, then read a small file' })}
${term(ra('c33-treo8', 'UV_THREADPOOL_SIZE=8', 1, D), { sm: true, title: 'same with 8 threads' })}` },

  { t: 'Why: DNS may use only half the pool', giua: true, body: `
${steps([
    '<code class="i">dns.lookup</code> = blocking <b>getaddrinfo()</b> ⇒ runs on the <b>libuv thread pool</b> (4 threads)',
    'libuv calls DNS “slow I/O” and allows at most <b>(threads + 1) / 2</b> of them at once ⇒ <b>2</b>',
    'File read not blocked · x1, x2 fail at <b>10 s</b> (glibc: 2 tries × 5 s) · x3, x4 only start then ⇒ <b>20 s</b>',
    '8 threads ⇒ 4 lookups at once ⇒ all fail at 10 s',
  ])}
${box('In a real service', 'One slow DNS server ⇒ requests to every host queue. Use keep-alive, short timeouts on outgoing calls, and <code class="i">UV_THREADPOOL_SIZE</code> at start-up if you do many lookups.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Authoritative = full TTL; caches <b>count it down</b> and do not ask again before 0</li>
<li>Change delay = TTL in caches <b>when you change</b>: lower, wait the old TTL, then change</li>
<li>NXDOMAIN cached for min(SOA TTL, minimum) — <b>300 s</b> in the lab, <b>1800 s</b> for cuongthai.com</li>
<li>Java caches <b>30 s</b>; Node <b>does not cache</b></li>
<li>Node: DNS uses at most <b>half the libuv pool</b> ⇒ slow DNS makes lookups queue</li>
</ul>
<p style="margin:0">${kw('TTL', 'thời gian được giữ')} ${kw('negative caching', 'cache âm')} ${kw('cache hit / miss', 'trúng / trượt')} ${kw('flush', 'xoá cache')} ${kw('thread pool', 'nhóm luồng')}</p>` },
]);
