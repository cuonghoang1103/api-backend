/**
 * ngx-01-2 — Nginx · Chapter 1 · Lesson 1.2 "server_name, and the four priority levels" (deck video + web, 12/11/2026). Bài web: nginx-1-2-server-name.
 * Output THẬT (scratchpad/ngx/demo/n1-2.txt; nginx/1.24.0): sáu Host ⇒ 1 chính xác / 2 đại diện đầu / 3 đại diện cuối / may42.vidu.com ⇒ ĐẠI DIỆN thắng regex /
 * may42.vidu.net ⇒ regex / khong-khop ⇒ khối đầu. a.b.vidu.com KHỚP *.vidu.com (đại diện đầu phủ NHIỀU nhãn — bài web nói "đúng một nhãn": SAI);
 * vidu.com không khớp *.vidu.com; MOT.VIDU.COM:8080 ⇒ chính xác. server_name "" + return 444; www.*.com ⇒ invalid server name or wildcard;
 * tên dài + bucket 32 ⇒ could not build server_names_hash; regex (?<khach>…) ⇒ root /srv/khach/$khach.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-2:setup": "",
 "n1-2:file:/tmp/ng/conf/ten.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server { listen 8080; server_name mot.vidu.com;                    return 200 \"1 · chinh xac: mot.vidu.com\\n\"; }\n  server { listen 8080; server_name *.vidu.com;                      return 200 \"2 · dai dien DAU: *.vidu.com\\n\"; }\n  server { listen 8080; server_name www.vidu.*;                      return 200 \"3 · dai dien CUOI: www.vidu.*\\n\"; }\n  server { listen 8080; server_name ~^may(?<so>\\d+)\\.vidu\\.com$;     return 200 \"4 · regex: may$so\\n\"; }\n  server { listen 8080; server_name ~^may42\\.vidu\\.net$;             return 200 \"4b · regex: may42.vidu.net\\n\"; }\n}\n",
 "n1-2:bonmuc": "$ for h in mot.vidu.com bat-ky.vidu.com www.vidu.net may42.vidu.com may42.vidu.net khong-khop.com; do printf '%-18s -> ' $h; curl -s -H \"Host: $h\" http://127.0.0.1:8080/; done\nmot.vidu.com       -> 1 · chinh xac: mot.vidu.com\nbat-ky.vidu.com    -> 2 · dai dien DAU: *.vidu.com\nwww.vidu.net       -> 3 · dai dien CUOI: www.vidu.*\nmay42.vidu.com     -> 2 · dai dien DAU: *.vidu.com\nmay42.vidu.net     -> 4b · regex: may42.vidu.net\nkhong-khop.com     -> 1 · chinh xac: mot.vidu.com",
 "n1-2:chitiet": "$ for h in a.b.vidu.com vidu.com MOT.VIDU.COM:8080; do printf '%-18s -> ' $h; curl -s -H \"Host: $h\" http://127.0.0.1:8080/; done\na.b.vidu.com       -> 2 · dai dien DAU: *.vidu.com\nvidu.com           -> 1 · chinh xac: mot.vidu.com\nMOT.VIDU.COM:8080  -> 1 · chinh xac: mot.vidu.com",
 "n1-2:file:/tmp/ng/conf/rong.conf": "pid       /tmp/ng/logs/rong.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server { listen 8081; server_name vidu.com; return 200 \"vidu.com\\n\"; }\n  server { listen 8081; server_name \"\";       return 444; }\n}\n",
 "n1-2:khonghost": "$ curl -s -H 'Host: vidu.com' http://127.0.0.1:8081/\nvidu.com\n$ printf 'GET / HTTP/1.0\\r\\n\\r\\n' | nc -q 2 127.0.0.1 8081; echo \"(ket noi bi dong, khong mot byte nao: 444)\"\n(ket noi bi dong, khong mot byte nao: 444)",
 "n1-2:file:/tmp/ng/conf/sao.conf": "pid       /tmp/ng/logs/sao.pid;\nerror_log /tmp/ng/logs/sao-error.log;\nevents {}\nhttp {\n  access_log off;\n  server { listen 8082; server_name mac-dinh;  return 200 \"mac dinh\\n\"; }\n  server { listen 8082; server_name www.*.com; return 200 \"khop www.*.com\\n\"; }\n}\n",
 "n1-2:sao-giua": "$ nginx -t -c /tmp/ng/conf/sao.conf\n2026/11/12 12:03:32 [emerg] 1878#1878: invalid server name or wildcard \"www.*.com\" on 0.0.0.0:8082\nnginx: configuration file /tmp/ng/conf/sao.conf test failed",
 "n1-2:file:/tmp/ng/conf/dai.conf": "events {}\nhttp {\n  server_names_hash_bucket_size 32;\n  server { listen 8083; server_name ngan.vidu.com; return 200 \"x\\n\"; }\n  server { listen 8083; server_name mot-ten-mien-con-rat-rat-rat-rat-dai-cho-mot-trang-noi-bo-cua-cong-ty.vidu.com; return 200 \"x\\n\"; }\n}\n",
 "n1-2:hash": "$ nginx -t -c /tmp/ng/conf/dai.conf\n2026/11/12 12:03:33 [emerg] 1895#1895: could not build server_names_hash, you should increase server_names_hash_bucket_size: 64\nnginx: configuration file /tmp/ng/conf/dai.conf test failed",
 "n1-2:file:/tmp/ng/conf/khach.conf": "pid       /tmp/ng/logs/khach.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8084;\n    server_name ~^(?<khach>[a-z0-9-]+)\\.vidu\\.com$;\n    root /srv/khach/$khach;\n  }\n}\n",
 "n1-2:nhombat": "$ for h in an.vidu.com binh.vidu.com chi.vidu.com; do printf '%-15s -> ' $h; curl -s -o /tmp/r -w '%{http_code} ' -H \"Host: $h\" http://127.0.0.1:8084/; cat /tmp/r | head -c 40 | tr -d '\\n'; echo; done\nan.vidu.com     -> 200 trang cua khach an\nbinh.vidu.com   -> 200 trang cua khach binh\nchi.vidu.com    -> 404 <html>\n<head><title>404 Not Found</titl"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, tiers, icards, cmp, box, two, steps, kw, c, tbl } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-01-2', code: 'NGX 1.2', title: 'server_name, and the four priority levels', sub: 'Chapter 1 · Lesson 1.2' };
const O = (k) => { const v = DU_LIEU[`n1-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.replace(/\/tmp\/ng\/conf\//g, '').replace(/^\d{4}\/\d\d\/\d\d \d\d:\d\d:\d\d /gm, '');
const vong = (s) => s.replace(/^\$ for h in ([^;]*); do.*$/m, (_, h) => `$ for h in ${h}; do curl -s -H "Host: $h" …; done`);

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.2', t: 'server_name,<br>and the four priority levels', sub: 'Nginx ranks names by KIND, not by how specific they look — and the order in your file almost never matters',
    en: 'Lesson 1.2. Once Nginx has the candidate blocks for a socket, it compares the Host header with their names — in a fixed order that has nothing to do with the order of the blocks in your file.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The four levels: exact, leading wildcard, trailing wildcard, regex</li>
    <li>Why a regex loses to a wildcard — measured</li>
    <li>What a wildcard really covers (more than one label)</li>
    <li>Requests without a Host, long names, invalid wildcards</li>
    <li>The real reason to use a regex: capture groups</li></ul>`,
    en: 'Five takeaways: the four levels; why a regex loses to a wildcard; what a leading wildcard really covers; three practical details; and the real reason to write a regex.' },
  { t: 'Six Hosts, five blocks, measured', body: ngc(bo(O('file:/tmp/ng/conf/ten.conf')).split('\n').slice(5, 10).map((l) => l.replace(/\s+return 200 "([^"]*)\\n";/, ' # $1').replace(/server \{ listen 8080; server_name\s+/, 'server_name ')).join('\n'), { sm: true }) +
    tn(vong(O('bonmuc')), { fs: 15 }),
    en: 'Five blocks on port 8080: an exact name, a leading wildcard, a trailing wildcard and two regexes. Six Host headers: each lands on its level; may42.vidu.com lands on the wildcard, not the regex; and a name nothing matches goes to the first block.' },
  { t: 'Four levels, checked in this order', body: tiers([
      ['check', '1 · Exact name', 'vidu.com · www.vidu.com — a hash table: a thousand cost the same as one', '#008a34'],
      ['filter', '2 · Leading wildcard', '*.vidu.com — the LONGEST match wins', '#2563eb'],
      ['filter', '3 · Trailing wildcard', 'www.vidu.* — longest first again', '#7c3aed'],
      ['code', '4 · Regular expression', '~^may\\d+\\.vidu\\.com$ — LAST, and in FILE ORDER', '#c0392b'],
    ], { th: 70, gap: 22 }) + box('The first level that matches ends the search', 'Levels 1–3 are lookups, so file order is irrelevant there. Only level 4 is a list walked top to bottom.', 'lam'),
    en: 'Four levels, checked in order. Exact names, kept in a hash table. Leading wildcards, longest match first. Trailing wildcards, the same. And regular expressions last — the only level where the order in your file matters. The first level that matches ends the search.' },
  { t: 'Trap: a regex does NOT beat a wildcard', body: tbl(['Host: may42.vidu.com', 'Kind', 'Matches?', 'Result'], [
      ['<code>mot.vidu.com</code>', '1 · exact', 'no', ''],
      ['<code>*.vidu.com</code>', '2 · leading wildcard', '<b>yes</b>', '🏆 wins — search ends here'],
      ['<code>www.vidu.*</code>', '3 · trailing wildcard', 'no', 'never reached'],
      ['<code>~^may(?&lt;so&gt;\\d+)\\.vidu\\.com$</code>', '4 · regex', 'would match', 'never reached'],
    ], { hl: [1] }) + box('Ranked by KIND, not by how specific a pattern looks', 'A catch-all <code>*.vidu.com</code> silently swallows every regex block of that domain — the block you can see right there in the file never runs.', 'do2'),
    en: 'may42.vidu.com matches both the wildcard and the regex, and the wildcard wins, because a leading wildcard is level two and a regex is level four. Nginx ranks by kind, not by how specific a pattern looks.' },
  { t: 'What a wildcard really covers — measured', body: tn(vong(O('chitiet')), { fs: 16 }) + two(
      box('A wildcard covers MORE than one label', '<code>*.vidu.com</code> matched <code>a.b.vidu.com</code>: a leading wildcard covers ONE OR MORE labels in front, not exactly one. It does NOT match the bare <code>vidu.com</code> — list both: <code>server_name vidu.com *.vidu.com;</code>', 'do2'),
      box('Case and port do not matter', '<code>MOT.VIDU.COM:8080</code> matched <code>mot.vidu.com</code>: Nginx lowercases the Host and strips the port BEFORE comparing.', 'xanh')),
    en: 'Measured details. a.b.vidu.com matched the leading wildcard — it covers more than one label, not exactly one as often assumed. The bare vidu.com did not match it. And MOT.VIDU.COM with a port matched the exact name: Nginx lowercases and strips the port first.' },
  { t: 'Exact names are free; the asterisk goes at an END', body: (
      ngc(`# list names — no regex just to avoid typing
server_name vidu.com www.vidu.com shop.vidu.com;

# valid: star at the start or at the end
server_name *.vidu.com;
server_name www.vidu.*;

# INVALID: anything in the middle is a regex's job
server_name www.*.com;`, { sm: true, hl: [9] }) +
      tn(bo(O('sao-giua')), { fs: 15 })) + box('Need the bare name too? List both', '<code>server_name vidu.com *.vidu.com;</code> — the wildcard never covers the bare domain.', 'xanh'),
    en: 'Exact names live in a hash table, so list as many as you need. The asterisk may only stand at the start or the end: www.*.com is rejected at startup with "invalid server name or wildcard". Anything in the middle needs a regex.' },
  { t: 'Requests with NO Host header', body: ngc(bo(O('file:/tmp/ng/conf/rong.conf')).split('\n').slice(5, 7).map((l) => l.trim()).join('\n'), { sm: true }) +
    tn(O('khonghost'), { wrap: 110, fs: 15 }) +
    icards([
      ['search', 'Who sends no Host?', 'HTTP/1.0 clients and many scanners hitting your IP directly.'],
      ['cut', 'return 444', 'Close the connection without a single byte — the reply above printed nothing.'],
      ['shield', 'Where it lives', 'Next to the real names on the same port, or in the refusing default (Lesson 1.3).'],
    ], 3),
    en: 'server_name with an empty string catches requests that carry no Host header at all — HTTP/1.0 clients and some scanners. Here they get 444: Nginx closes the connection without sending a single byte.' },
  { t: 'Long names need a bigger bucket', body: ngc(bo(O('file:/tmp/ng/conf/dai.conf')).split('\n').slice(2, 5).join('\n').replace(/mot-ten-mien-con-rat-rat-rat-rat-dai-cho-mot-trang-noi-bo-cua-cong-ty\.vidu\.com; return 200 "x\\n";/, 'mot-ten-mien-con-rat-rat-…-cua-cong-ty.vidu.com; …'), { sm: true }) +
    tn(bo(O('hash')), { wrap: 110, fs: 15 }) +
    icards([
      ['warn', 'An ERROR, not a warning', 'Nginx refuses to start — nginx -t catches it before any reload.'],
      ['layers', 'Raise the bucket', 'Next power of two: 64, 128. It means exactly what it says.'],
      ['check', 'Nothing else is broken', 'The names themselves are fine; only the table that stores them is too small.'],
    ], 3),
    en: 'A very long name with server_names_hash_bucket_size 32: startup fails with could not build server_names_hash, increase server_names_hash_bucket_size. Raise it to the next power of two; nothing else is wrong.' },
  { t: 'The REAL reason to write a regex: capture groups', body: ngc(bo(O('file:/tmp/ng/conf/khach.conf')).split('\n').slice(5, 10).join('\n'), { sm: true, hl: [3, 4] }) + (
      tn(vong(O('nhombat')).replace(/curl -s -o \/tmp\/r -w '%\{http_code\} '/, 'curl'), { fs: 15 })) +
    box('Only level 4 can capture', '<code>(?&lt;khach&gt;…)</code> makes <code>$khach</code> usable inside the block — a root path, a proxy_pass target, a log field. chi.vidu.com has no folder ⇒ 404.', 'xanh'),
    en: 'The real reason to use a regex is a capture group. Here (?<khach>…) puts the subdomain into $khach, and root points at /srv/khach/$khach: an.vidu.com and binh.vidu.com get their own pages, chi.vidu.com has no folder and gets 404.' },
  { t: 'The rule to carry', body: cmp(['Ask', 'Not this', 'But this'], [
      ['A request landed in the wrong block', 'which pattern is MORE specific?', 'which LEVEL does each pattern belong to?'],
      ['You want many names', 'one clever regex', 'list exact names — free in a hash table'],
      ['You need part of the name', 'a wildcard', 'a regex with a named capture'],
      ['Two regexes overlap', 'the more specific one', 'the one written FIRST in the file'],
    ]) + box('Exact → leading wildcard → trailing wildcard → regex', 'The first match ends the search. When something two levels higher matched first, that is your answer.', 'xanh'),
    en: 'The rule: when a request lands in an unexpected block, do not ask which pattern is more specific — ask which level each pattern belongs to. List exact names, use a regex only when you need a capture, and remember regexes are checked in file order.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('server_name', 'the names a block answers, compared with Host'),
      kw('Exact name', 'level 1 — hash table, free'),
      kw('Leading wildcard', 'level 2 — *.vidu.com, longest match wins'),
      kw('Trailing wildcard', 'level 3 — www.vidu.*'),
      kw('Regex name', 'level 4 — last, file order, capture groups'),
      kw('server_name ""', 'matches requests with no Host'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: server_name, exact name, leading wildcard, trailing wildcard, regex name, and the empty server_name for requests without a Host.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build the five blocks; send the six Hosts with ${c('curl -H')}`,
      `Send ${c('a.b.vidu.com')} and ${c('vidu.com')}: which block, and why?`,
      `Try ${c('server_name www.*.com;')} and read the error`,
      `Capture the subdomain into ${c('$khach')} and use it in ${c('root')}`,
    ]), box('Keep these', `<ul><li>Rank by kind: exact, *., .*, regex</li><li>Regex never beats a wildcard</li><li>*.x covers one or more labels, not x itself</li><li>Regex only for captures</li></ul>`, 'lam'), ''),
    en: 'Your turn: reproduce the six-Host table, test what a wildcard covers, read the invalid wildcard error, and capture a subdomain into a variable. Keep: rank by kind, regex never beats a wildcard, and use a regex only for captures.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — How a request finds a server block', bai: '1.2' }, S);
