/**
 * nfd-04-4 — Networking for Developers, bài 4.4 "Trạng thái kết nối, TIME_WAIT và cạn cổng" (slug netdev-4-4-trang-thai).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c44-*.out.txt).
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-04-4', code: 'NFD 4.4', title: 'Connection states, TIME_WAIT and port exhaustion', sub: 'Networking for Developers · Chapter 4' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 4 — TCP', bai: '4.4' }, [
  { cover: true, t: 'Connection states,<br>TIME_WAIT and port exhaustion', sub: 'Reading <code class="i">ss</code>, and why a busy client<br>runs out of ports', nhan: 'Chapter 4 · Lesson 4.4' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The TCP <b>state machine</b> and how to read it with <code class="i">ss -tan</code></li>
<li>Why <b>TIME_WAIT</b> appears on the side that closes first — and why it exists at all</li>
<li><b>Port exhaustion</b>: how a busy client without keep-alive runs out of ephemeral ports</li>
<li>The <b>accept queue</b> (backlog): where finished handshakes wait for your <code class="i">accept()</code></li>
<li>The settings that matter: <code class="i">somaxconn</code>, <code class="i">tcp_max_tw_buckets</code>, ephemeral range</li>
</ul>` },

  { t: 'A connection is a little state machine', giua: true, body: `
${bang(['State', 'Means'], [
    ['<b>LISTEN</b>', 'a server socket waiting for SYNs'],
    ['<b>SYN-SENT / SYN-RECV</b>', 'mid-handshake'],
    ['<b>ESTABLISHED</b>', 'open, data can flow'],
    ['<b>FIN-WAIT / CLOSE-WAIT</b>', 'one side started closing'],
    ['<b>TIME-WAIT</b>', 'the active closer, waiting ~60 s before the 4-tuple is free'],
  ], { fs: 20 })}
${box('', 'Every socket is in exactly one state. Debugging TCP is mostly reading which state your connections are stuck in — and <code class="i">ss -tan</code> shows it straight from the kernel.', 'lam')}` },

  { t: 'Read the states', body: `
${term(ra('c44-states', "ss -tan", 1, { max: 9 }), { sm: true, title: 'nfd-client: two held-open connections + some just closed' })}
${term(ra('c44-states', 'ss -s', 1, { max: 3 }), { sm: true, title: 'ss -s: a one-line census' })}
${box('', 'Two <b>ESTAB</b>, several <b>TIME-WAIT</b>. <code class="i">ss -s</code> counts them all at a glance — the first thing to run when “the server feels stuck”.', 'lam')}` },

  { t: 'Whoever closes first gets TIME_WAIT', giua: true, body: `
${term(ra('c44-timewait', 'echo "TIME-WAIT', 1), { sm: true, title: 'after 20 short curls that the client closed' })}
${box('', 'The client made 20 short requests and closed each one, so <b>TIME-WAIT piles up on the client</b>. Had the server closed (e.g. <code class="i">Connection: close</code>), the sockets would sit on the server instead. The side doing the <b>active close</b> pays.', 'lam')}
${steps([
    'A reverse proxy that closes upstream connections accumulates TIME_WAIT on <b>itself</b>, not the backend',
    '<code class="i">tcp_fin_timeout</code> (60 s) and <code class="i">tcp_max_tw_buckets</code> (32768) bound how long and how many',
    'Do not “disable” it — the next slide is why',
  ])}` },

  { t: 'Why TIME_WAIT exists', giua: true, body: `
${steps([
    'A late, duplicated packet from the old connection could arrive after it closed',
    'If the same 4-tuple (src ip:port · dst ip:port) were reused immediately, that stray packet could be mistaken for new data',
    'So the active closer waits <b>2 × MSL</b> (~60 s on Linux) before the 4-tuple is free',
  ])}
${box('', 'TIME_WAIT is a feature, not a leak. <code class="i">net.ipv4.tcp_fin_timeout</code> and <code class="i">tcp_max_tw_buckets</code> bound it. The dangerous “fix” is reusing ports too aggressively — the stray-packet bug TIME_WAIT prevents is real.', 'lam')}` },

  { t: 'Port exhaustion', giua: true, body: `
${term(ra('c44-exhaust', 'for i', 1, { cut: 92 }), { sm: true, title: 'force just 3 source ports, no keep-alive' })}
${box('', 'With only three ephemeral ports allowed and each connection left in TIME_WAIT, the <b>4th connection cannot bind a source port</b> (exit 45). Real clients see this as <code class="i">EADDRNOTAVAIL</code> / “cannot assign requested address” when they open thousands of short connections to one destination.', 'do2')}
${steps([
    'A connection is unique by its <b>4-tuple</b>, so you only exhaust ports <b>per destination</b>',
    'It recovers on its own as the TIME_WAIT sockets expire (~60 s) — then fails again under load',
    'The real fix is the next slide, not a bigger port range',
  ])}` },

  { t: 'The fix is fewer connections, not more ports', giua: true, body: `
${bang(['Lever', 'Effect'], [
    ['<b>keep-alive / pooling</b>', 'the real fix: reuse connections, so you never churn ports (lesson 4.5)'],
    ['widen ephemeral range', '<code class="i">net.ipv4.ip_local_port_range</code> — more ports, buys headroom'],
    ['<code class="i">SO_REUSEADDR</code> on the server', 'lets a server rebind its listen port in TIME_WAIT — safe'],
    ['<code class="i">tcp_tw_reuse</code> (outbound)', 'reuse a TIME_WAIT 4-tuple for new <b>outbound</b> connections — careful'],
  ], { fs: 19 })}
${box('', 'If your service makes many short HTTP calls to one upstream, the cure is a <b>pooled client</b> with keep-alive. Tuning ports and timers only buys time.', 'xanh')}` },

  { t: 'The accept queue (backlog)', body: `
${term(ra('c44-backlog', 'ss -ltn', 1, { max: 4 }), { sm: true, title: 'listening sockets: Send-Q = backlog capacity' })}
${steps([
    'A listening socket has a queue of connections whose handshake finished, waiting for <code class="i">accept()</code>',
    '<b>Send-Q</b> is its capacity (nginx 511 here), <b>Recv-Q</b> is how many are waiting right now',
    'The cap is <code class="i">min(backlog, net.core.somaxconn)</code> — a famous source of dropped connections under load',
  ])}` },

  { t: 'When the queue overflows', giua: true, body: `
${box('Symptom', 'Under a burst, new connections are accepted into the kernel (handshake done) but your app is too slow to <code class="i">accept()</code> them. The queue fills, and further SYNs are dropped — clients see timeouts even though the server is “up”.', 'do2')}
${box('Fix', 'Raise <code class="i">somaxconn</code> AND the app’s <code class="i">listen(backlog)</code> together (one caps the other), and make <code class="i">accept()</code> faster. <code class="i">tcp_max_syn_backlog</code> and SYN cookies protect the half-open queue against SYN floods.', 'xanh')}` },

  { t: 'Where this lives in the computer', giua: true, body: `
${bang(['Piece', 'What it is'], [
    ['the state', 'a field in the kernel socket struct; <code class="i">ss -tan</code> reads it'],
    ['TIME_WAIT', 'the active closer holding the 4-tuple ~60 s (<code class="i">tcp_fin_timeout</code>, <code class="i">tcp_max_tw_buckets</code>)'],
    ['ephemeral ports', '<code class="i">ip_local_port_range</code>, ~32768–60999 — the client’s pool of source ports'],
    ['accept queue', 'per-listen-socket, capped by <code class="i">min(listen backlog, somaxconn)</code>'],
  ], { fs: 20 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Every socket is in one TCP <b>state</b>; read them with <code class="i">ss -tan</code> and census with <code class="i">ss -s</code></li>
<li><b>TIME_WAIT</b> lands on the side that closes first; it exists so stray old packets cannot poison a new connection</li>
<li><b>Port exhaustion</b> hits a busy client that churns short connections — the 4th of 3 ports failed with exit 45</li>
<li>The fix is <b>keep-alive / pooling</b>, not just widening ports or shrinking timers</li>
<li>The <b>accept queue</b> (Send-Q, capped by <code class="i">somaxconn</code>) drops connections when your app accepts too slowly</li>
</ul>
<p style="margin:0">${kw('ESTABLISHED', 'đã thiết lập')} ${kw('TIME_WAIT', 'chờ tàn')} ${kw('ephemeral port', 'cổng tạm')} ${kw('port exhaustion', 'cạn cổng')} ${kw('backlog', 'hàng đợi accept')}</p>` },
]);
