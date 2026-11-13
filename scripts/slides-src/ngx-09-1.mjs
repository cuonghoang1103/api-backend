/**
 * ngx-09-1 — Nginx · Chapter 9 · Lesson 9.1 "The upstream block and four ways to choose" (deck video + web, 13/11/2026).
 * Bài web: nginx-9-1-khoi-upstream. Output THẬT (scratchpad/ngx/demo/n9-1.txt; nginx/1.24.0, ba backend Node may.js):
 * 30 request ⇒ round robin 10/10/10 · weight 3:1 ⇒ 23/7 · least_conn 10/10/10 · ip_hash (một IP) ⇒ may-3=30 · random two least_conn ≈ đều ·
 * down + backup ⇒ may-1=30 · header X-May-Chu · may-1 CHẬM 1 s, bắn 30 cái cách 50 ms: round robin may-1=10, least_conn may-1=2.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n9-1:file:/root/may.js": "// may.js <tên> <cổng> [trễ ms] — backend thí nghiệm: trả TÊN máy (thân + header X-May-Chu), đếm request và kết nối TCP (GET …/dem)\nconst [ten, cong, tre = '0'] = process.argv.slice(2);\nlet req = 0, conn = 0;\nconst s = require('http').createServer((q, r) => {\n  req++;\n  if (q.url.endsWith('/dem')) return r.end(`req=${req}  conn=${conn}\\n`);\n  setTimeout(() => { r.setHeader('X-May-Chu', ten); r.end(ten + '\\n'); }, +tre);\n});\ns.on('connection', () => conn++);\ns.keepAliveTimeout = 65000;\ns.listen(+cong, '127.0.0.1');\n",
 "n9-1:file:/root/dem.sh": "# dem.sh <url> <n> [song song] — gửi n request (mặc định LẦN LƯỢT), đếm xem máy nào trả lời\nurl=$1; n=$2; p=${3:-1}\nseq $n | xargs -P $p -I{} curl -s \"$url\" | sort | uniq -c | awk '{printf \"%s=%s  \", $2, $1} END {print \"\"}'\n",
 "n9-1:file:/tmp/ng/conf/lb.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  upstream deu      {              server 127.0.0.1:9501; server 127.0.0.1:9502; server 127.0.0.1:9503; }\n  upstream trongso  {              server 127.0.0.1:9501 weight=3; server 127.0.0.1:9502 weight=1; }\n  upstream itketnoi { least_conn;  server 127.0.0.1:9501; server 127.0.0.1:9502; server 127.0.0.1:9503; }\n  upstream theoip   { ip_hash;     server 127.0.0.1:9501; server 127.0.0.1:9502; server 127.0.0.1:9503; }\n  upstream ngaunhien { random two least_conn; server 127.0.0.1:9501; server 127.0.0.1:9502; server 127.0.0.1:9503; }\n  upstream rut {\n    server 127.0.0.1:9501;\n    server 127.0.0.1:9502 down;      # rút khỏi vòng, KHÔNG xoá dòng\n    server 127.0.0.1:9503 backup;    # chỉ dùng khi MỌI máy chính đã chết\n  }\n  server {\n    listen 8080;\n    location /deu/       { proxy_pass http://deu; }\n    location /trongso/   { proxy_pass http://trongso; }\n    location /itketnoi/  { proxy_pass http://itketnoi; }\n    location /theoip/    { proxy_pass http://theoip; }\n    location /ngaunhien/ { proxy_pass http://ngaunhien; }\n    location /rut/       { proxy_pass http://rut; }\n  }\n}\n",
 "n9-1:setup": "",
 "n9-1:bon": "$ bash dem.sh http://127.0.0.1:8080/deu/ 30\nmay-1=10  may-2=10  may-3=10  \n$ bash dem.sh http://127.0.0.1:8080/trongso/ 30\nmay-1=23  may-2=7  \n$ bash dem.sh http://127.0.0.1:8080/itketnoi/ 30\nmay-1=10  may-2=10  may-3=10  \n$ bash dem.sh http://127.0.0.1:8080/theoip/ 30\nmay-3=30  ",
 "n9-1:them": "$ bash dem.sh http://127.0.0.1:8080/ngaunhien/ 30\nmay-1=7  may-2=14  may-3=9  \n$ bash dem.sh http://127.0.0.1:8080/rut/ 30\nmay-1=30  \n$ curl -s -D - -o /dev/null http://127.0.0.1:8080/deu/ | grep -i x-may-chu\nX-May-Chu: may-1",
 "n9-1:file:/root/ban.sh": "# ban.sh <đường dẫn> — 30 request, cứ 50 ms bắn một cái, KHÔNG chờ cái trước xong; đếm máy nào trả lời\nrm -f /tmp/ng/ban.txt\nfor i in $(seq 30); do curl -s \"http://127.0.0.1:8080$1\" >> /tmp/ng/ban.txt & sleep 0.05; done; wait\nsort /tmp/ng/ban.txt | uniq -c | awk '{printf \"%s=%s  \", $2, $1} END {print \"\"}'\n",
 "n9-1:cham": "may-1 nay CHAM: moi phan hoi mat 1 giay (may-2, may-3 van nhanh).\n$ printf 'round robin : '; bash ban.sh /deu/\nround robin : may-1=10  may-2=10  may-3=10  \n$ printf 'least_conn  : '; bash ban.sh /itketnoi/\nleast_conn  : may-1=2  may-2=14  may-3=14  "
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, path, meter, tiers, hub } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-09-1', code: 'NGX 9.1', title: 'The upstream block and four ways to choose', sub: 'Chapter 9 · Lesson 9.1' };
const O = (k) => { const v = DU_LIEU[`n9-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };

export const S = [
  { cover: true, nhan: 'Chapter 9 · Lesson 9.1', t: 'The upstream block<br>and four ways to choose', sub: 'Three real backends, thirty requests, and a count for every algorithm',
    en: 'Lesson 9.1. One backend is a proxy pass to an address. Several backends is an upstream block, and the only real decision inside it is how Nginx picks which one gets the next request. Three real backends, thirty requests, and a count for each algorithm.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The <code>upstream</code> block: a named pool, used by <code>proxy_pass</code></li>
    <li>Four algorithms, each one counted over thirty requests</li>
    <li><code>weight</code>, <code>down</code> and <code>backup</code> on a server line</li>
    <li>Why round robin balances requests, not work</li>
    <li>One header that turns every question into a measurement</li></ul>`,
    en: 'Five takeaways: the upstream block; four algorithms, each one counted; weight, down and backup; why round robin balances requests rather than work; and one header that turns every question in this chapter into a measurement.' },
  { t: 'Four algorithms, thirty requests each, counted', body: ngc(`upstream deu      {             server …:9501; server …:9502; server …:9503; }
upstream trongso  {             server …:9501 weight=3; server …:9502 weight=1; }
upstream itketnoi { least_conn; server …:9501; server …:9502; server …:9503; }
upstream theoip   { ip_hash;    server …:9501; server …:9502; server …:9503; }`, { sm: true }) + tn(O('bon'), { fs: 18, wrap: 110 }),
    en: 'Four upstream blocks over the same three backends, and thirty requests to each, counted by the name every backend returns. Round robin: ten, ten, ten. Weight three to one: twenty three to seven. Least conn: ten, ten, ten. Ip hash, from one address: all thirty on machine three.' },
  { t: 'Reading the four counts', body: icards([
      ['loop', 'Round robin: the default, and even', 'ten each, exactly — no configuration, no state; right whenever any backend can serve any request'],
      ['gauge', 'weight= changes the ratio, not the mechanism', '23 : 7 for a configured 3 : 1 (22.5 : 7.5, rounded by where the cycle stopped) — for machines of different size'],
      ['count', 'least_conn looked identical — expected', 'every reply took milliseconds, so nobody had a queue: "fewest connections" and "next in line" agree'],
      ['key', 'ip_hash sent all 30 to one box — correctly', 'one client address maps to one backend; from thousands of clients it spreads (9.2)'],
    ], 2),
    en: 'Reading the counts. Round robin is even with no state at all. Weight changes the ratio, not the mechanism: twenty three to seven is three to one rounded by where the cycle stopped. Least conn looked identical because every reply was fast. And ip hash sending everything to one machine is correct: one address, one backend.' },
  { t: 'The upstream block itself', body: ngc(`upstream api {
  server 10.0.1.11:3000 weight=2;    # bigger box takes more
  server 10.0.1.12:3000;
  server 10.0.1.13:3000 backup;      # used ONLY when every primary is dead
  server 10.0.1.14:3000 down;        # out of rotation, the line is kept
  keepalive 32;                      # connection reuse — Lesson 9.4
}
location /api/ { proxy_http_version 1.1; proxy_set_header Connection "";
                 proxy_pass http://api/; }   # the block NAME, not an address`, { hl: [1, 4, 5, 9] }) + icards([
      ['layers', 'Declared at http level', 'several server blocks share one pool — and one view of which backend is failing (9.3)'],
      ['map', 'The pool and the policy', 'one upstream, many locations — each with its own timeouts, buffering, cache'],
      ['search', 'Names resolve at load and reload', 'not per request — Lesson 9.5 measures it'],
    ], 3),
    en: 'The block itself. Each server line can carry a weight, backup — used only when every primary is dead — or down, which takes a machine out without deleting the line. Proxy pass names the block, not an address. The block lives at the http level, so several server blocks share one pool. The pool is the upstream; the policy is the location.' },
  { t: 'down and backup, and a fifth method', body: tn(O('them'), { fs: 18, wrap: 110 }) + cmp(['Server line', 'What it does', 'Measured'], [
      ['server …:9502 down;', 'out of rotation, the line stays', 'never answered'],
      ['server …:9503 backup;', 'only when every primary is dead', 'never answered — may-1 alive'],
      ['random two least_conn;', 'pick two at random, take the less busy', 'roughly even, different every run'],
    ], { hl: [0] }),
    en: 'Down and backup, measured. With may two marked down and may three as a backup, all thirty went to may one: down is out of rotation, and backup waits until every primary is dead. Random two least conn picks two at random and takes the less busy one — roughly even, different every run. Useful for very large pools.' },
  { t: 'Round robin balances requests, not work', body: tn(O('cham'), { fs: 18, wrap: 110 }) +
    meter([['round robin → slow may-1', 10, '#c0392b'], ['least_conn → slow may-1', 2, '#009639']], { don: 'of 30 waited 1 s', rh: 44, fs: 19, nhan: 330 }) +
    box('Count what is in flight, not what has been sent', 'may-1 now takes one second per reply. Round robin still handed it its third — ten requests stuck waiting. least_conn saw its connections stay open and gave it two. A flat benchmark cannot show this, because when every reply is equally fast the two algorithms agree.', 'do2'),
    en: 'The trap. Round robin balances requests, not work. Machine one now takes a full second per reply. Thirty requests, one every fifty milliseconds: round robin still gave it ten — ten users waited a second. Least conn saw its connections stay open and gave it only two. A flat benchmark cannot show this.' },
  { t: 'Choosing between them', body: tiers([
      ['loop', 'Round robin', 'stateless backends, uniform requests — most APIs (the default)', '#008a34'],
      ['gauge', 'least_conn', 'mixed durations — free, falls back to round robin when uniform', '#2563eb'],
      ['key', 'ip_hash / hash', 'a client must keep hitting one backend — Lesson 9.2', '#7c3aed'],
      ['server', 'random two least_conn', 'very large pools — least_conn without the bookkeeping', '#b85a2b'],
    ], { th: 84, gap: 30 }),
    en: 'Choosing. Round robin for stateless backends and uniform requests — most APIs. Least conn when durations vary; it costs nothing and degrades to round robin when they do not, so it is a safe default if you are unsure. Hash when a client must keep reaching one backend. Random two for very large pools.' },
  { t: 'One header turns every question into a count', body: ngc(`# in each backend's server block (or the same header set by the app itself)
add_header X-May-Chu "may-1";`) + tn(O('them').split('\n').slice(-2).join('\n'), { fs: 19, wrap: 110 }) + steps([
      'Every backend puts its NAME in a response header',
      'Send a few hundred requests and COUNT them',
      'Keep the header forever: "which backend did they reach?" is the first useful fact',
      'Every count in this chapter was made exactly this way',
    ]),
    en: 'How to check the distribution on your own system. Have every backend put its name in a response header, send a few hundred requests and count. That one header turns every question in this chapter into an experiment — keep it permanently, because when something behaves oddly for some users, the first useful fact is which backend they reached.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('upstream', 'a named pool of backends'),
      kw('round robin', 'in turn, evenly — the default'),
      kw('weight=', 'changes the ratio'),
      kw('least_conn', 'fewest connections in flight'),
      kw('ip_hash', 'client address → one backend'),
      kw('down / backup', 'out of rotation / last resort'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: upstream, round robin, weight, least conn, ip hash, and down and backup.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Three backends that return their name + ${c('X-May-Chu')}`,
      'Four upstream blocks — count 30 requests each',
      `Mark one server ${c('down')}, another ${c('backup')} — count again`,
      'Make one backend slow: round robin vs least_conn',
    ]), box('Keep these', `<ul><li>proxy_pass names the pool</li><li>weight = ratio, down = drain</li><li>backup only when all are dead</li><li>least_conn counts work in flight</li></ul>`, 'lam'), ''),
    en: 'Your turn: three backends that return their name; four upstream blocks, each counted; one server down and one backup; then one slow backend under round robin and least conn. Keep: proxy pass names the pool; weight is a ratio, down drains; backup only when all are dead; least conn counts work in flight.' },
];
export const slides = lamDeck({ chuong: 'Chapter 9 — Load balancing across several backends', bai: '9.1' }, S);
