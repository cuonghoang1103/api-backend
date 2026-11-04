/**
 * nfd-04-3 — Networking for Developers, bài 4.3 "Kiểm soát luồng và kiểm soát tắc nghẽn" (slug netdev-4-3-tac-nghen).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c43-*.out.txt).
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-04-3', code: 'NFD 4.3', title: 'Flow control and congestion control (Reno, CUBIC, BBR)', sub: 'Networking for Developers · Chapter 4' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 4 — TCP', bai: '4.3' }, [
  { cover: true, t: 'Flow control and<br>congestion control', sub: 'Why a big download speeds up gradually,<br>and what Reno, CUBIC and BBR change', nhan: 'Chapter 4 · Lesson 4.3' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Two different limits: the <b>receive window</b> (flow control) and the <b>congestion window</b> (congestion control)</li>
<li><b>Slow start</b>: watch the congestion window double every round trip, in real <code class="i">ss</code> output</li>
<li>Why a large download <b>speeds up gradually</b> instead of hitting full speed at once</li>
<li>What <b>Reno, CUBIC and BBR</b> do differently, and how to read which one is in use</li>
<li>The <b>bandwidth-delay product</b>: why a fast, far link needs a big window to fill</li>
</ul>` },

  { t: 'Two windows, two problems', giua: true, body: `
${bang(['Window', 'Protects', 'Set by'], [
    ['<b>receive window</b> (rwnd)', 'the <b>receiver’s</b> buffer — don’t overflow a slow reader', 'the receiver, advertised in every ACK'],
    ['<b>congestion window</b> (cwnd)', 'the <b>network</b> — don’t overload the path', 'the sender, grown/shrunk by the algorithm'],
  ], { fs: 21 })}
${box('', 'A sender may have at most <b>min(rwnd, cwnd)</b> bytes in flight (unacked). Flow control stops you drowning a slow <em>reader</em>; congestion control stops you drowning the <em>path</em>. This lesson is mostly about the second.', 'lam')}` },

  { t: 'Slow start: the window doubles each round trip', giua: true, body: `
${bang(['when', 'cwnd (segments)', 'ssthresh', 'rtt'], [
    ['t ≈ 0.2 s', '<b>10</b>', '— (still slow start)', '40 ms'],
    ['t ≈ 1.5 s', '<b>133</b>', '36', '41 ms'],
    ['t ≈ 3.5 s', '<b>1086</b>', '36', '48 ms'],
  ], { fs: 21 })}
${box('ss -ti, measured', '<code class="i">ss -ti</code> shows the congestion window grow <b>10 → 133 → 1086</b> segments over a few round trips — roughly doubling each RTT. That is <b>slow start</b>: begin cautiously (10 segments), then probe for capacity exponentially until the first loss or <code class="i">ssthresh</code>.', 'xanh')}` },

  { t: 'The ramp you can see', body: `
${term(ra('c43-win', 'wait', 1, { max: 11 }), { sm: true, title: 'iperf3 on a 20 Mbit / 40 ms link — bitrate climbs as cwnd grows' })}
${box('', 'The transfer starts at <b>16.7 Mbit/s</b> and climbs to <b>700 Mbit/s</b> as the window opens. A short request never reaches full speed — it finishes while still in slow start. This is why many small files are slower than one big one, and why warm, reused connections (4.5) start where the last left off.', 'lam')}` },

  { t: 'Which algorithm is running', body: `
${term(ra('c43-cc', 'sysctl net.ipv4.tcp_congestion_control', 2), { sm: true, title: 'the sender’s choice of algorithm' })}
${box('BBR needs a kernel module', 'This lab kernel offers <b>reno</b> and <b>cubic</b> (default). <b>BBR</b> must be loaded (<code class="i">modprobe tcp_bbr</code>) on a real Linux host — it is not present here.', 'do2')}` },

  { t: 'Three ways to find the right speed', giua: true, body: `
${bang(['Algorithm', 'Idea', 'Reacts to'], [
    ['<b>Reno</b> (1990)', 'AIMD: add 1 per RTT, halve on loss', 'packet loss'],
    ['<b>CUBIC</b> (Linux default)', 'cubic curve back to the last good window — fast on big/far links', 'packet loss, but recovers faster'],
    ['<b>BBR</b> (Google, 2016)', 'model the bottleneck bandwidth and RTT directly', 'measured bandwidth + delay, not loss'],
  ], { fs: 20 })}
${box('', 'Reno and CUBIC treat <b>loss</b> as the signal to slow down. On a link that drops a little without being congested, that can be too cautious — BBR instead measures the pipe and ignores incidental loss. Change it with <code class="i">sysctl net.ipv4.tcp_congestion_control</code>.', 'lam')}` },

  { t: 'AIMD: additive increase, multiplicative decrease', giua: true, body: `
${steps([
    '<b>Slow start</b>: cwnd doubles each RTT until loss or the slow-start threshold (<code class="i">ssthresh</code>)',
    '<b>Congestion avoidance</b>: after that, add roughly one segment per RTT — a gentle climb',
    '<b>On loss</b>: multiplicative decrease — cut the window (Reno halves it), then climb again',
  ])}
${box('', 'This sawtooth — climb gently, halve on loss, climb again — is how classic TCP shares a link fairly among many flows without any of them talking to each other. <code class="i">ss</code> prints <code class="i">ssthresh</code> once slow start ends.', 'lam')}` },

  { t: 'The bandwidth-delay product', giua: true, body: `
${box('How much must be “in flight” to fill a pipe?', 'BDP = bandwidth × RTT. A <b>1 Gbit/s</b> link with <b>80 ms</b> RTT needs <b>10 MB</b> in flight to stay full. If the window (rwnd or cwnd) is smaller, you leave the pipe half empty no matter the bandwidth.', 'lam')}
${steps([
    'This is why <b>window scaling</b> exists — the old 64 KB window could never fill a fast, far link',
    'And why a far server feels slow even at high bandwidth: the window has to grow through slow start first',
    'Fix: keep connections warm (4.5), or use more of them, so you are past slow start when it matters',
  ])}` },

  { t: 'Where this lives in the computer', giua: true, body: `
${bang(['Piece', 'What it is'], [
    ['rwnd', 'the receiver’s free buffer, advertised in the <code class="i">win</code> field of every ACK (× the window scale)'],
    ['cwnd / ssthresh', 'sender-side state in the kernel socket struct; <code class="i">ss -ti</code> prints them'],
    ['the algorithm', 'a kernel module (<code class="i">tcp_cubic</code>, <code class="i">tcp_bbr</code>…); one is the default, set per-socket or per-host'],
    ['pacing_rate / delivery_rate', 'what <code class="i">ss -ti</code> estimates the sender is achieving — useful to spot a stuck flow'],
  ], { fs: 20 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Two windows: <b>rwnd</b> (flow control, receiver) and <b>cwnd</b> (congestion control, network); bytes in flight ≤ min of them</li>
<li><b>Slow start</b> doubles cwnd each RTT — measured here 10 → 133 → 1086 — so transfers speed up gradually</li>
<li>A short request finishes <b>before</b> reaching full speed; warm connections and fewer of them help</li>
<li><b>Reno/CUBIC react to loss</b>; <b>BBR</b> models bandwidth and delay — change it with <code class="i">sysctl</code></li>
<li><b>BDP = bandwidth × RTT</b>: a fast, far link needs a big window (window scaling) to stay full</li>
</ul>
<p style="margin:0">${kw('flow control', 'kiểm soát luồng')} ${kw('congestion window', 'cửa sổ tắc nghẽn')} ${kw('slow start', 'khởi động chậm')} ${kw('AIMD', 'tăng cộng giảm nhân')} ${kw('BDP', 'tích băng thông–độ trễ')}</p>` },
]);
