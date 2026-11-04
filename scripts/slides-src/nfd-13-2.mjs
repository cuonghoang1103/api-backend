/**
 * nfd-13-2 — Networking for Developers, bài 13.2 "Đo mọi chặng" (slug netdev-13-2-do-duong-di). Capstone.
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c132-*.out.txt) — curl -w tách DNS/connect/TTFB/total qua stack (netem 20ms).
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-13-2', code: 'NFD 13.2', title: 'Measure every hop', sub: 'Networking for Developers · Chapter 13' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 13 — Capstone', bai: '13.2' }, [
  { cover: true, t: 'Measure every hop', sub: 'Record the baseline before you tune —<br>DNS, TCP, TLS, TTFB, size', nhan: 'Chapter 13 · Lesson 13.2 · Capstone' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li>The <b>baseline</b> principle: measure <b>before</b> you change anything</li>
<li><code class="i">curl -w</code> across the whole stack: DNS / connect / TTFB / total + size</li>
<li>Reading each stage against <b>your</b> stack (edge vs API vs network)</li>
<li>Capturing at the <b>edge</b> with tcpdump/tshark to see the hop in detail</li>
<li>The <b>baseline table</b> you record and compare every tuning against</li>
</ul>` },

  { t: 'You cannot improve what you did not measure', giua: true, body: `
${box('Key idea', 'The first rule of performance work is a <b>baseline</b>: a recorded measurement of the current state, taken <b>before</b> any change. Without it, "it feels faster" is unfalsifiable and "I enabled gzip" is a claim, not a result.', 'do2')}
${steps([
    'Measure the current request path end to end — numbers, written down',
    'Only then change something (next lesson), and measure again',
    'The <b>delta</b> is the result; the baseline is what makes the delta meaningful',
  ])}` },

  { t: 'curl -w across the stack', giua: true, body: `
${term(ra('c132-measure', 'curl', 1), { sm: true, title: 'one request through the edge, split into stages (20 ms injected)' })}
${steps([
    'No extra tooling — just <code class="i">curl -w</code> with a write-out format string',
    'With 20 ms injected on the path, <code class="i">connect</code> shows the handshake RTT and <code class="i">ttfb</code> adds the server’s work',
    'Run it a few times and take the <b>median</b> — one noisy run is not a baseline',
  ])}
${box('', 'One request to the edge, broken into <code class="i">dns</code>, <code class="i">connect</code> (TCP), <code class="i">ttfb</code> (server to first byte), <code class="i">total</code>, plus <code class="i">size</code>. This one line is your <b>per-hop stopwatch</b> — the next slide reads each stage against the stack.', 'xanh')}` },

  { t: 'Reading the stages against your stack', giua: true, body: `
${bang(['Stage', 'On this stack it is', 'If it is big'], [
    ['<code class="i">dns</code>', 'name resolution (cached = ~0)', 'DNS/resolver — rarely the issue once warm'],
    ['<code class="i">connect</code>', 'TCP handshake to the edge', 'network latency / distance'],
    ['<code class="i">ttfb</code>', 'edge + proxy + API work', 'the edge or the API (tune these)'],
    ['<code class="i">total - ttfb</code>', 'body download', 'response size / bandwidth (compress!)'],
  ], { fs: 18 })}
${box('', 'The gap from <code class="i">connect</code> to <code class="i">ttfb</code> is where the <b>server side</b> lives; <code class="i">total</code> minus <code class="i">ttfb</code> is the <b>download</b>. Those two gaps are exactly what the next lesson tunes.', 'lam')}` },

  { t: 'Capture at the edge for detail', giua: true, body: `
${steps([
    'Timing says <b>where</b> the latency is; a <b>capture</b> says <b>what</b> the packets did there',
    'Run <code class="i">tcpdump</code> at the edge (Chapter 11) during a slow request; open it in Wireshark/tshark',
    'Look for the pre-response gap (server thinking) vs retransmissions (network loss)',
  ])}
${box('', 'In production the edge and the API are separate boxes (or containers). Capturing at the <b>edge</b> shows both legs — client↔edge and edge↔API — so you can tell which leg owns the delay.', 'lam')}` },

  { t: 'The baseline table', giua: true, body: `
${bang(['Record', 'Example (this lab)'], [
    ['dns / connect / ttfb / total', 'from <code class="i">curl -w</code>, a few runs (take the median)'],
    ['response size', 'bytes, with and without compression'],
    ['status + cache status', 'the code, and HIT/MISS if cached'],
    ['from where', 'same client, same network — note it'],
  ], { fs: 19 })}
${box('', 'Write it down. Every optimisation in the next lesson is judged <b>against this table</b> — a before/after is only as good as the "before" you recorded.', 'do2')}` },

  { t: 'Measure from several networks', giua: true, body: `
${box('', 'A single measurement from one machine can mislead. Run the baseline from <b>more than one network</b> (office, home, a cloud box in another region). If one region is slow and others are not, the problem is the <b>path</b>, not the server — and no server tuning will fix it.', 'lam')}
${steps([
    'Same request, several vantage points → separates path problems from server problems',
    'A region-specific slowdown points at routing / peering / a far CDN edge',
    'A uniform slowdown points at the origin (the edge or API) — tune it',
  ])}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A <b>baseline</b> is a recorded measurement taken <b>before</b> any change — the reference the tuning is judged against</li>
<li><code class="i">curl -w</code> splits the request into <b>dns / connect / ttfb / total</b> + size — your per-hop stopwatch</li>
<li><b>connect→ttfb</b> is the server side; <b>total−ttfb</b> is the download — the two gaps you will tune</li>
<li>Capture at the <b>edge</b> to see <b>what</b> the packets did where the timing says the latency is</li>
<li>Measure from <b>several networks</b> to separate a path problem from a server problem</li>
</ul>
<p style="margin:0">${kw('baseline', 'mốc nền')} ${kw('curl -w', 'thời gian từng chặng')} ${kw('TTFB', 'byte đầu')} ${kw('capture at edge', 'bắt ở biên')} ${kw('path vs origin', 'đường vs gốc')}</p>` },
]);
