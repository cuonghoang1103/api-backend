/**
 * Networking for Developers — Practical Exam (PE): 4 chương trình đọc stdin, nộp .zip, 90 phút.
 *
 * Mỗi câu là một công cụ nhỏ một kỹ sư thật sự viết khi trực sự cố, chạy trên DỮ LIỆU THẬT của phòng lab khoá học
 * (lab/out/c41-tay — bản bắt tcpdump -tt; c142-dem — luật iptables của "mạng trường trong hộp"; c113-path / c132-measure — dòng curl -w)
 * cộng phần DỰNG thêm đúng khuôn để có đủ ca biên (ghi rõ trong từng đề).
 *
 * expectedOutput theo khuôn "INPUT:\n…\nOUTPUT:\n…" của scripts/exam-check.mjs: bộ dựng (_lib/networking-exam-kit.mjs › peQ) chạy lời giải
 * mẫu trên đúng stdin đó; exam-check chạy lại bằng `node answer.cjs < stdin` thật và so từng dòng.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NETWORKING-FOR-DEVELOPERS-PE.mjs --apply
 * Kiểm: node scripts/exam-check.mjs content/exams/NETWORKING-FOR-DEVELOPERS-PE.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { B, EX, code, peQ } from './_lib/networking-exam-kit.mjs';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../courses/networking-for-developers/lab/out');
const ra = (tep) => fs.readFileSync(path.join(OUT, `${tep}.out.txt`), 'utf8').split('\n').map((d) => d.replace(/\r$/, ''));
const sau = (tep, lenh) => { const d = ra(tep); const i = d.findIndex((x) => x.startsWith(`$ ${lenh}`)); const o = []; for (let j = i + 1; j < d.length && !d[j].startsWith('$ '); j++) o.push(d[j]); while (o.length && !o[o.length - 1].trim()) o.pop(); return o; };

const CAP = sau('c41-tay', "tcpdump -nr /tmp/c41.pcap -tt 'tcp'").filter((d) => /Flags/.test(d));
const RULES = sau('c142-dem', 'iptables -L CHAN -v -n --line-numbers');
if (CAP.length !== 10 || RULES.length !== 8) throw new Error('PE: output thật đổi — xem lại đề');

/* ═══ Câu 1 — đọc bản bắt gói nhiều kết nối ═══ */
const L = (t, a, b, f, len) => `${t} IP ${a} > ${b}: Flags [${f}], seq 1, ack 1, win 64, length ${len}`;
const EXTRA = [
  L('1793769990.000000', '10.10.1.11.40100', '10.10.2.20.3000', 'S', 0),
  L('1793769991.000000', '10.10.1.11.40100', '10.10.2.20.3000', 'S', 0),
  L('1793769991.022000', '10.10.2.20.3000', '10.10.1.11.40100', 'S.', 0),
  L('1793769991.022100', '10.10.1.11.40100', '10.10.2.20.3000', '.', 0),
  L('1793769991.022300', '10.10.1.11.40100', '10.10.2.20.3000', 'P.', 96),
  L('1793769991.200000', '10.10.2.20.3000', '10.10.1.11.40100', 'P.', 2048),
  L('1793769996.200000', '10.10.2.20.3000', '10.10.1.11.40100', 'F.', 0),
  L('1793769996.200200', '10.10.1.11.40100', '10.10.2.20.3000', 'F.', 0),
  L('1793769997.000000', '10.10.1.12.51515', '10.10.2.10.443', 'S', 0),
  L('1793769998.000000', '10.10.1.12.51515', '10.10.2.10.443', 'S', 0),
  L('1793770000.000000', '10.10.1.12.51515', '10.10.2.10.443', 'S', 0),
];
const STDIN1 = [...CAP, ...EXTRA].join('\n') + '\n';
const SOL1 = `// PE Q1 — capture reviewer: one line per TCP connection
const input = require('fs').readFileSync(0, 'utf8');

const conns = new Map();   // key = the two endpoints in a fixed order
const order = [];

for (const line of input.split('\\n')) {
  const m = /^(\\d+\\.\\d+) IP (\\S+) > (\\S+): Flags \\[([^\\]]*)\\].*length (\\d+)/.exec(line);
  if (!m) continue;
  const t = Number(m[1]), src = m[2], dst = m[3].replace(/:$/, ''), flags = m[4], len = Number(m[5]);
  const key = [src, dst].sort().join(' ');
  if (!conns.has(key)) { conns.set(key, { client: null, server: null, syns: 0, tSyn: null, tSynAck: null, req: 0, resp: 0, closedBy: null }); order.push(key); }
  const c = conns.get(key);
  if (flags === 'S') {                       // the side that sends a bare SYN is the client
    if (!c.client) { c.client = src; c.server = dst; }
    c.syns++;
    if (c.tSyn === null) c.tSyn = t;
  }
  const fromClient = src === c.client;
  if (flags === 'S.' && c.tSynAck === null) c.tSynAck = t;
  if (fromClient) c.req += len; else c.resp += len;
  if (flags.includes('F') && !c.closedBy) c.closedBy = fromClient ? 'client' : 'server';
}

for (const key of order) {
  const c = conns.get(key);
  const rtt = c.tSyn !== null && c.tSynAck !== null ? ((c.tSynAck - c.tSyn) * 1000).toFixed(1) + 'ms' : 'none';
  console.log(c.client + ' -> ' + c.server + ' rtt=' + rtt + ' req=' + c.req + ' resp=' + c.resp + ' syn-retries=' + Math.max(0, c.syns - 1) + ' closed-by=' + (c.closedBy || 'none'));
}`;
const Q1 = peQ({
  points: 2.5,
  stdin: STDIN1,
  solution: SOL1,
  prompt: B(
    `<p><b>Q1 — Capture reviewer (2.5 points).</b> On call, you get a <code>tcpdump -tt -nr capture.pcap</code> dump with several TCP connections mixed together. The first ten lines of the test input are the REAL capture of one <code>curl</code> from the course lab; the rest were constructed in the same format (a request whose first SYN was lost, and a host that never answers).</p><p>Read stdin and print ONE line per connection, in order of first appearance:</p>${code('<client ip.port> -> <server ip.port> rtt=<ms with 1 decimal>ms|none req=<bytes> resp=<bytes> syn-retries=<n> closed-by=client|server|none')}<ul><li>A connection is the pair of endpoints regardless of direction; the <b>client</b> is the side that sent a bare <code>[S]</code>.</li><li><code>rtt</code> = first SYN → first SYN-ACK (<code>[S.]</code>); <code>none</code> if no SYN-ACK ever came.</li><li><code>req</code>/<code>resp</code> = sum of <code>length</code> sent by client / by server. <code>syn-retries</code> = SYNs sent minus one.</li><li><code>closed-by</code> = sender of the first packet whose flags contain <code>F</code>.</li></ul>`,
    `<p><b>Câu 1 — Đọc bản bắt gói (2,5 điểm).</b> Đang trực sự cố, bạn nhận một bản <code>tcpdump -tt -nr capture.pcap</code> có nhiều kết nối TCP trộn lẫn. Mười dòng đầu của dữ liệu thử là bản bắt THẬT của một lần <code>curl</code> trong phòng lab của khoá; phần còn lại được dựng đúng khuôn (một request bị mất SYN đầu, và một máy không bao giờ trả lời).</p><p>Đọc stdin và in MỘT dòng cho mỗi kết nối, theo thứ tự xuất hiện đầu tiên, theo khuôn:</p>${code('<client ip.port> -> <server ip.port> rtt=<ms, 1 chữ số thập phân>ms|none req=<byte> resp=<byte> syn-retries=<n> closed-by=client|server|none')}<ul><li>Một kết nối là cặp hai đầu bất kể chiều; <b>client</b> là bên gửi <code>[S]</code> trần.</li><li><code>rtt</code> = SYN đầu → SYN-ACK đầu (<code>[S.]</code>); <code>none</code> nếu không có SYN-ACK nào.</li><li><code>req</code>/<code>resp</code> = tổng <code>length</code> do client / server gửi. <code>syn-retries</code> = số SYN đã gửi trừ một.</li><li><code>closed-by</code> = bên gửi gói đầu tiên có cờ chứa <code>F</code>.</li></ul>`,
  ),
});

/* ═══ Câu 2 — báo cáo thời gian theo vùng ═══ */
const STDIN2 = [
  'lab dns=0.000011 connect=0.020503 tls=0.020503 ttfb=0.040733 total=0.040777',
  'singapore dns=0.002000 connect=0.014000 tls=0.031000 ttfb=0.080000 total=0.090000',
  'tokyo dns=0.003000 connect=0.035000 tls=0.071000 ttfb=0.125000 total=0.140000',
  'hanoi dns=0.004000 connect=0.214000 tls=0.428000 ttfb=0.480000 total=0.530000',
].join('\n') + '\n';
const SOL2 = `// PE Q2 — where does the time go, per region?
const input = require('fs').readFileSync(0, 'utf8');

const rows = [];
for (const line of input.split('\\n')) {
  const w = line.trim().split(/\\s+/);
  if (w.length < 2) continue;
  const v = {};
  for (const kv of w.slice(1)) { const [k, x] = kv.split('='); v[k] = Number(x); }
  const ms = (x) => Math.round(x * 1000);
  rows.push({
    region: w[0],
    dns: ms(v.dns), tcp: ms(v.connect - v.dns), tls: ms(v.tls - v.connect),
    server: ms(v.ttfb - v.tls), download: ms(v.total - v.ttfb),
  });
}
for (const r of rows) console.log(r.region + ': dns=' + r.dns + ' tcp=' + r.tcp + ' tls=' + r.tls + ' server=' + r.server + ' download=' + r.download);

const median = (xs) => { const s = xs.slice().sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
let verdict = 'healthy';
if (median(rows.map((r) => r.server)) >= 500) verdict = 'origin';
else {
  let worst = null;
  for (const r of rows) {
    const others = rows.filter((o) => o !== r).map((o) => o.tcp);
    if (others.length && r.tcp >= 3 * median(others) && (!worst || r.tcp > worst.tcp)) worst = r;
  }
  if (worst) verdict = 'path:' + worst.region;
}
console.log('verdict: ' + verdict);`;
const Q2 = peQ({
  points: 2.5,
  stdin: STDIN2,
  solution: SOL2,
  prompt: B(
    `<p><b>Q2 — Where does the time go? (2.5 points)</b> Each input line is a region followed by the CUMULATIVE <code>curl -w</code> timers in seconds: <code>dns</code>, <code>connect</code>, <code>tls</code> (the TLS handshake end; equal to connect over plain HTTP), <code>ttfb</code>, <code>total</code>. The first line is the real lab measurement over HTTP; the region lines were constructed for the exercise.</p><p>Print, per region, the stage durations in whole milliseconds (rounded): <code>dns</code>, <code>tcp</code> = connect − dns, <code>tls</code> = tls − connect, <code>server</code> = ttfb − tls, <code>download</code> = total − ttfb, as</p>${code('<region>: dns=<n> tcp=<n> tls=<n> server=<n> download=<n>')}<p>Then one line <code>verdict: origin</code> if the median <code>server</code> (sorted ascending, index floor(n/2)) is ≥ 500; otherwise <code>verdict: path:&lt;region&gt;</code> for the region whose <code>tcp</code> is ≥ 3 × the median <code>tcp</code> of the other regions (the largest if several); otherwise <code>verdict: healthy</code>.</p>`,
    `<p><b>Câu 2 — Thời gian đi đâu? (2,5 điểm)</b> Mỗi dòng đầu vào là một vùng theo sau là các mốc <code>curl -w</code> CỘNG DỒN tính bằng giây: <code>dns</code>, <code>connect</code>, <code>tls</code> (lúc xong bắt tay TLS; bằng connect khi là HTTP thường), <code>ttfb</code>, <code>total</code>. Dòng đầu là số đo thật của lab qua HTTP; các dòng vùng được dựng cho bài.</p><p>In cho mỗi vùng thời lượng từng chặng theo mili giây nguyên (làm tròn): <code>dns</code>, <code>tcp</code> = connect − dns, <code>tls</code> = tls − connect, <code>server</code> = ttfb − tls, <code>download</code> = total − ttfb, theo khuôn</p>${code('<region>: dns=<n> tcp=<n> tls=<n> server=<n> download=<n>')}<p>Sau đó một dòng <code>verdict: origin</code> nếu trung vị <code>server</code> (sắp tăng dần, chỉ số floor(n/2)) ≥ 500; nếu không thì <code>verdict: path:&lt;vùng&gt;</code> cho vùng có <code>tcp</code> ≥ 3 × trung vị <code>tcp</code> của các vùng khác (nhiều vùng thì lấy vùng lớn nhất); còn lại <code>verdict: healthy</code>.</p>`,
  ),
});

/* ═══ Câu 3 — mô phỏng log của biên CDN ═══ */
const STDIN3 = [
  '0 /img/logo.txt public,max-age=3600',
  '1 /img/logo.txt public,max-age=3600',
  '2 /img/logo.txt?v=2 public,max-age=3600',
  '3 / public,max-age=30',
  '4 / public,max-age=30',
  '34 / public,max-age=30',
  '35 /account private,max-age=600',
  '36 /feed no-cache',
  '37 /feed no-cache',
  '38 /api/report no-store',
  '40 /about -',
  '50 /news public,max-age=60,s-maxage=300',
  '200 /news public,max-age=60,s-maxage=300',
].join('\n') + '\n';
const SOL3 = `// PE Q3 — a CDN edge, one request per line: "<t> <url> <cache-control or ->"
const input = require('fs').readFileSync(0, 'utf8');

function directives(cc) {
  const d = {};
  if (cc === '-') return d;
  for (const part of cc.split(',')) {
    const [k, v] = part.trim().toLowerCase().split('=');
    if (k) d[k] = v === undefined ? true : Number(v);
  }
  return d;
}

const store = new Map();     // url (with its query) -> { at, ttl }
let hits = 0, origin = 0, total = 0;
for (const line of input.split('\\n')) {
  const w = line.trim().split(/\\s+/);
  if (w.length < 3) continue;
  const t = Number(w[0]), url = w[1], d = directives(w[2]);
  let status;
  if (d['no-store'] || d.private || (d['s-maxage'] === undefined && d['max-age'] === undefined && !d['no-cache'])) {
    status = 'BYPASS';                            // not storable at a shared cache
  } else if (d['no-cache']) {
    status = store.has(url) ? 'REVALIDATED' : 'MISS';
    store.set(url, { at: t, ttl: 0 });
  } else {
    const ttl = d['s-maxage'] !== undefined ? d['s-maxage'] : d['max-age'];
    const e = store.get(url);
    if (!e) status = 'MISS';
    else if (t - e.at >= e.ttl) status = 'EXPIRED';
    else status = 'HIT';
    if (status !== 'HIT') store.set(url, { at: t, ttl });
  }
  total++;
  if (status === 'HIT') hits++; else origin++;
  console.log(t + ' ' + url + ' ' + status);
}
console.log('hit ratio ' + (total ? Math.round(hits / total * 100) : 0) + '% origin=' + origin);`;
const Q3 = peQ({
  points: 2.5,
  stdin: STDIN3,
  solution: SOL3,
  prompt: B(
    `<p><b>Q3 — Replay a CDN edge (2.5 points).</b> Each line is a request reaching a shared edge: <code>&lt;t seconds&gt; &lt;url&gt; &lt;Cache-Control of the origin's answer, or -&gt;</code> (directives comma-separated, no spaces). The cache key is the URL including its query. Print <code>&lt;t&gt; &lt;url&gt; &lt;STATUS&gt;</code> per line, then <code>hit ratio &lt;n&gt;% origin=&lt;n&gt;</code>:</p><ul><li><code>BYPASS</code> — not storable: <code>no-store</code>, <code>private</code>, or no <code>max-age</code>/<code>s-maxage</code>/<code>no-cache</code> at all (this edge never guesses).</li><li><code>no-cache</code> — <code>MISS</code> the first time, <code>REVALIDATED</code> afterwards (stored, but always checked with the origin).</li><li>Otherwise TTL = <code>s-maxage</code> if present, else <code>max-age</code>: no entry ⇒ <code>MISS</code>; t − stored_at ≥ TTL ⇒ <code>EXPIRED</code>; else <code>HIT</code>. MISS and EXPIRED store a fresh copy at t.</li><li>Only HIT avoids the origin; the hit ratio is HITs / all requests, rounded to a whole percent.</li></ul><p>The first six lines replay what the course lab measured for real (MISS → HIT; <code>?v=2</code> is a new key; a 30 s TTL expiring).</p>`,
    `<p><b>Câu 3 — Phát lại một biên CDN (2,5 điểm).</b> Mỗi dòng là một request tới biên dùng chung: <code>&lt;t giây&gt; &lt;url&gt; &lt;Cache-Control trong câu trả lời của origin, hoặc -&gt;</code> (các chỉ thị ngăn bằng dấu phẩy, không có dấu cách). Khoá cache là URL kèm cả query. In <code>&lt;t&gt; &lt;url&gt; &lt;TRẠNG THÁI&gt;</code> cho mỗi dòng, rồi <code>hit ratio &lt;n&gt;% origin=&lt;n&gt;</code>:</p><ul><li><code>BYPASS</code> — không lưu được: <code>no-store</code>, <code>private</code>, hoặc không có <code>max-age</code>/<code>s-maxage</code>/<code>no-cache</code> nào (biên này không bao giờ đoán).</li><li><code>no-cache</code> — lần đầu <code>MISS</code>, các lần sau <code>REVALIDATED</code> (có lưu, nhưng luôn kiểm lại với origin).</li><li>Còn lại TTL = <code>s-maxage</code> nếu có, không thì <code>max-age</code>: chưa có mục ⇒ <code>MISS</code>; t − lúc_lưu ≥ TTL ⇒ <code>EXPIRED</code>; còn lại <code>HIT</code>. MISS và EXPIRED lưu bản mới lúc t.</li><li>Chỉ HIT mới tránh được origin; hit ratio là số HIT / tổng request, làm tròn tới phần trăm nguyên.</li></ul><p>Sáu dòng đầu phát lại đúng thứ phòng lab của khoá đã đo thật (MISS → HIT; <code>?v=2</code> là khoá mới; TTL 30 giây hết hạn).</p>`,
  ),
});

/* ═══ Câu 4 — thử luật tường lửa ═══ */
const STDIN4 = [...RULES, '---', 'udp 8.8.8.8 53', 'tcp 198.18.0.10 443 social.test', 'tcp 198.18.0.10 443 news.test', 'tcp 198.18.0.30 22', 'tcp 198.18.0.30 993', 'udp 198.18.0.30 51820', 'tcp 198.18.0.30 443', 'tcp 198.18.0.20 443', 'tcp 198.18.0.53 53'].join('\n') + '\n';
const SOL4 = `// PE Q4 — which rule decides each packet? (first match wins)
const input = require('fs').readFileSync(0, 'utf8');
const [ruleText, packetText] = input.split(/^---$/m);

const rules = [];
for (const line of ruleText.split('\\n')) {
  const w = line.trim().split(/\\s+/);
  if (!/^\\d+$/.test(w[0]) || w.length < 10) continue;   // numbered rule lines only
  rules.push({ num: Number(w[0]), target: w[3], prot: w[4], dst: w[9], extra: w.slice(10).join(' ') });
}

function matches(r, p) {
  if (r.prot !== 'all' && r.prot !== p.proto) return false;
  if (r.dst !== '0.0.0.0/0' && r.dst !== p.dst) return false;
  const dpt = /dpt:(\\d+)/.exec(r.extra);
  if (dpt && Number(dpt[1]) !== p.dport) return false;
  const mp = /multiport dports\\s+(!?)([\\d,]+)/.exec(r.extra);
  if (mp) {
    const inList = mp[2].split(',').map(Number).includes(p.dport);
    if (mp[1] === '!' ? inList : !inList) return false;     // "!list" = every port NOT in the list
  }
  const s = /STRING match\\s+"([^"]+)"/.exec(r.extra);
  if (s && p.sni !== s[1]) return false;
  return true;
}

for (const line of packetText.split('\\n')) {
  const w = line.trim().split(/\\s+/);
  if (w.length < 3) continue;
  const p = { proto: w[0], dst: w[1], dport: Number(w[2]), sni: w[3] };
  const r = rules.find((x) => matches(x, p));
  console.log(line.trim() + ' -> ' + (r ? 'rule ' + r.num + ' ' + r.target : 'ACCEPT (no rule matched)'));
}`;
const Q4 = peQ({
  points: 2.5,
  stdin: STDIN4,
  solution: SOL4,
  prompt: B(
    `<p><b>Q4 — Which school rule blocked you? (2.5 points)</b> The input starts with the REAL <code>iptables -L CHAN -v -n --line-numbers</code> output of the course's "school network in a box", then a line <code>---</code>, then one packet per line: <code>&lt;tcp|udp&gt; &lt;dst&gt; &lt;dport&gt; [sni]</code>. For each packet print <code>&lt;the packet line&gt; -&gt; rule &lt;num&gt; &lt;TARGET&gt;</code> for the FIRST matching rule, or <code>&lt;the packet line&gt; -&gt; ACCEPT (no rule matched)</code>.</p><p>A rule (only lines whose first word is a number; columns num pkts bytes target prot opt in out source destination, then match options) matches when ALL hold: <code>prot</code> is <code>all</code> or the packet's; <code>destination</code> is <code>0.0.0.0/0</code> or the packet's dst; <code>dpt:N</code> ⇒ dport = N; <code>multiport dports A,B…</code> ⇒ dport in the list, with a leading <code>!</code> ⇒ NOT in the list; <code>STRING match "x"</code> ⇒ the packet's sni is exactly x.</p>`,
    `<p><b>Câu 4 — Luật nào của trường đã chặn bạn? (2,5 điểm)</b> Đầu vào bắt đầu bằng kết xuất THẬT của <code>iptables -L CHAN -v -n --line-numbers</code> từ "mạng trường trong hộp" của khoá, rồi một dòng <code>---</code>, rồi mỗi dòng một gói: <code>&lt;tcp|udp&gt; &lt;dst&gt; &lt;dport&gt; [sni]</code>. Với mỗi gói in <code>&lt;dòng gói&gt; -&gt; rule &lt;số&gt; &lt;TARGET&gt;</code> của luật khớp ĐẦU TIÊN, hoặc <code>&lt;dòng gói&gt; -&gt; ACCEPT (no rule matched)</code>.</p><p>Một luật (chỉ dòng có từ đầu là số; cột num pkts bytes target prot opt in out source destination, rồi các tuỳ chọn khớp) khớp khi MỌI điều sau đúng: <code>prot</code> là <code>all</code> hoặc bằng của gói; <code>destination</code> là <code>0.0.0.0/0</code> hoặc bằng dst của gói; <code>dpt:N</code> ⇒ dport = N; <code>multiport dports A,B…</code> ⇒ dport nằm trong danh sách, có <code>!</code> phía trước ⇒ KHÔNG nằm trong danh sách; <code>STRING match "x"</code> ⇒ sni của gói đúng bằng x.</p>`,
  ),
});

export default {
  course: { slug: 'networking-for-developers' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 20,
      title: B('Practical Exam — four on-call tools on real lab data', 'Đề thực hành — bốn công cụ trực sự cố trên dữ liệu thật của lab'),
      description: B('Four stdin-to-stdout programs: a capture reviewer, a per-region timing report, a CDN edge replay and a firewall rule tester.', 'Bốn chương trình đọc stdin in stdout: đọc bản bắt gói, báo cáo thời gian theo vùng, phát lại biên CDN và thử luật tường lửa.'),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 5,
      instructions: EX(
        '<p>This is the <b>practical exam</b> of <b>Networking for Developers</b>: four small tools of the kind an engineer writes while on call. Each one reads its input from <b>stdin</b> and prints to <b>stdout</b>, in Node.js 22 with no packages (<code>require(\'fs\').readFileSync(0, \'utf8\')</code> reads stdin).</p><ul><li>Real data from the course lab is part of every input; the problem says which part was constructed.</li><li>Match the output format exactly — it is compared line by line, then graded by AI against the reference solution and a rubric.</li><li>Submit one <code>.zip</code> with <code>q1.js</code> … <code>q4.js</code>.</li></ul>',
        '<p>Đây là <b>đề thực hành</b> của <b>Networking for Developers</b>: bốn công cụ nhỏ đúng loại một kỹ sư viết khi đang trực sự cố. Mỗi công cụ đọc dữ liệu từ <b>stdin</b> và in ra <b>stdout</b>, bằng Node.js 22, không dùng gói nào (<code>require(\'fs\').readFileSync(0, \'utf8\')</code> đọc stdin).</p><ul><li>Dữ liệu thật của phòng lab là một phần của mọi đầu vào; đề ghi rõ phần nào được dựng thêm.</li><li>Khớp đúng khuôn in ra — kết quả được so từng dòng, rồi AI chấm theo đáp án mẫu và bộ tiêu chí.</li><li>Nộp một tệp <code>.zip</code> gồm <code>q1.js</code> … <code>q4.js</code>.</li></ul>',
      ),
      isPublished: true,
      questions: [Q1, Q2, Q3, Q4],
    },
  ],
};
