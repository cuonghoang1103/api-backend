/**
 * nfd-11-3 — Networking for Developers, bài 11.3 "Đo đường đi: mtr, ping, iperf3 và curl -w" (slug netdev-11-3-do-duong).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c113-*.out.txt) — curl -w thời gian từng chặng, ping, mtr, iperf3 (netem 20ms).
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-11-3', code: 'NFD 11.3', title: 'Measuring the path', sub: 'Networking for Developers · Chapter 11' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 11 — Troubleshooting', bai: '11.3' }, [
  { cover: true, t: 'Measuring the path', sub: 'curl -w, ping, mtr and iperf3 —<br>where the time goes, and where the loss is', nhan: 'Chapter 11 · Lesson 11.3' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li><b>curl -w</b>: split one request into DNS / connect / TTFB / total</li>
<li><b>ping</b>: round-trip latency, and whether packets are lost</li>
<li><b>mtr</b>: per-hop latency and loss — <b>which</b> hop is the problem</li>
<li><b>iperf3</b>: raw bandwidth between two points</li>
<li>The difference between <b>bandwidth</b> and <b>latency</b> — and why it matters</li>
</ul>` },

  { t: 'curl -w: where the time goes', giua: true, body: `
${term(ra('c113-path', 'curl', 1), { sm: true, title: 'split one request: DNS, connect, TTFB, total' })}
${bang(['Stage', 'Is', 'A big value means'], [
    ['<code class="i">time_namelookup</code>', 'DNS resolution', 'DNS is slow'],
    ['<code class="i">time_connect</code>', 'TCP handshake', 'the network is slow/far'],
    ['<code class="i">time_starttransfer</code>', 'TTFB — server thinking', 'the app/DB is slow'],
    ['<code class="i">time_total</code>', 'the whole request', 'sum of the above + body download'],
  ], { fs: 18 })}
${box('', 'The stage that jumps is the layer to fix. One flag turns a slow request into a labelled breakdown you can act on — no capture needed.', 'xanh')}` },

  { t: 'ping: round-trip time and loss', body: `
${term(ra('c113-path', 'ping', 1), { sm: true, title: 'RTT min/avg/max and % packet loss (20 ms netem on the router)' })}
${box('', '<code class="i">ping</code> sends ICMP echoes and reports the round-trip time and the <b>packet loss</b>. Here the router adds 20 ms, so the RTT is ~20–40 ms with 0% loss. Rising RTT = congestion/distance; non-zero loss = a real problem on the path. The simplest reachability-and-latency check there is.', 'lam')}` },

  { t: 'mtr: which hop is the problem', body: `
${term(ra('c113-path', 'mtr', 1, { cut: 92 }), { sm: true, title: 'per-hop latency and loss, hop by hop to the target' })}
${box('', '<code class="i">mtr</code> is <code class="i">traceroute</code> + <code class="i">ping</code>: it pings <b>every hop</b> on the way and shows latency and loss per hop. Loss that <b>starts at one hop and continues</b> is a real problem there; loss at one hop that <b>does not propagate</b> is just a router de-prioritising ICMP. It tells you <b>where</b> on the path the trouble is.', 'xanh')}` },

  { t: 'iperf3: raw bandwidth', body: `
${term(ra('c113-path', 'iperf3', 1), { sm: true, title: 'throughput client → api (an iperf3 server runs on the api)' })}
${box('', '<code class="i">iperf3</code> measures how much <b>bandwidth</b> a link actually delivers: run <code class="i">iperf3 -s</code> on one side and <code class="i">iperf3 -c</code> on the other. Here it is ~100 Mbit/s. Use it to answer "is the pipe big enough?" — separately from latency, which it does not measure.', 'lam')}` },

  { t: 'Bandwidth is not latency', giua: true, body: `
${bang(['', 'Bandwidth', 'Latency'], [
    ['Is', 'how much per second (Mbit/s)', 'how long one trip takes (ms)'],
    ['Hurts', 'big downloads / uploads', 'every round trip (DNS, TCP, TLS, requests)'],
    ['Measured by', '<code class="i">iperf3</code>', '<code class="i">ping</code> / <code class="i">curl -w</code> / <code class="i">mtr</code>'],
  ], { fs: 19 })}
${box('', 'A fat pipe does not fix a chatty protocol: 100 ms of latency × many round trips is slow no matter the bandwidth. Most "slow site" problems are <b>latency and round trips</b>, not bandwidth — which is why keep-alive, HTTP/2 and CDNs (fewer/closer round trips) help more than a bigger link.', 'do2')}` },

  { t: 'A reusable curl -w template', giua: true, body: `
${steps([
    'Keep a one-liner: <code class="i">curl -w "dns=%{time_namelookup} conn=%{time_connect} ttfb=%{time_starttransfer} total=%{time_total}\\n" -o /dev/null -s URL</code>',
    'Run it from <b>several networks</b> — if only one region is slow, it is the path, not the server',
    'If <b>TTFB</b> is the big number, the server is slow; if <b>connect</b> is, the network/TLS is',
  ])}
${box('', 'This one template answers most "why is it slow" questions before you open a capture. Save it; run it everywhere.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>curl -w</b> splits a request into DNS / connect / TTFB / total — the stage that jumps is the layer to fix</li>
<li><b>ping</b> gives round-trip latency and packet loss; <b>mtr</b> shows <b>which hop</b> loses or delays</li>
<li><b>iperf3</b> measures raw bandwidth between two points (run <code class="i">-s</code> one side, <code class="i">-c</code> the other)</li>
<li><b>Bandwidth ≠ latency</b>: most "slow" is latency × round trips, not a small pipe</li>
<li>Keep a <b>curl -w template</b> and run it from several networks — a slow stage names the layer</li>
</ul>
<p style="margin:0">${kw('curl -w', 'thời gian từng chặng')} ${kw('ping', 'RTT + mất gói')} ${kw('mtr', 'mỗi hop')} ${kw('iperf3', 'băng thông')} ${kw('latency', 'độ trễ')}</p>` },
]);
