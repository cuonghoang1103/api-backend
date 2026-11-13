/**
 * ngx-10-2 — Nginx · Chapter 10 · Lesson 10.2 "JSON logs, and the escape that decides if a machine can read them" (deck video + web, 13/11/2026).
 * Bài web: nginx-10-2-log-json-escape. Output THẬT (scratchpad/ngx/demo/n10-2.txt; nginx/1.24.0):
 * ba UA (ngoặc kép · gạch ngược · "Chào bạn") qua escape mặc định ⇒ \x22, \x5C, Ch\xC3\xA0o b\xE1\xBA\xA1n · escape=json ⇒ \" \\ và UTF-8 nguyên ·
 * escape=none ⇒ "ua":"Trinh duyet "co ngoac"" (JSON vỡ) · json_sai (số để trần): /noi-bo ⇒ "tgian_up":, · thử lại ⇒ "tgian_up":0.000, 0.001 ⇒ 2/3 dòng hỏng;
 * json đúng (bọc ngoặc) 3/3 hợp lệ, "tgian_up":"" và "0.000, 0.001" · 200 request đa dạng: kết hợp 150,7 · hữu dụng 126,8 · json 174,9 byte/dòng thô,
 * gzip 8,8 / 8,1 / 8,6 byte/dòng · 200/200 hợp lệ · jq lọc /cham 0,60 s.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n10-2:file:/tmp/ng/conf/json.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  log_format ua_mac_dinh             '\"$http_user_agent\"';\n  log_format ua_json   escape=json   '\"ua\":\"$http_user_agent\"';\n  log_format ua_none   escape=none   '\"ua\":\"$http_user_agent\"';\n  # dinh dang JSON — trong nhin RAT hop ly (so de tran)\n  log_format json_sai  escape=json '{\"ma\":$status,\"tgian_up\":$upstream_response_time,\"ref\":\"$http_referer\"}';\n  # sua: cai gi CO THE rong thi boc ngoac kep\n  log_format json      escape=json '{\"tg\":\"$time_iso8601\",\"ip\":\"$remote_addr\",\"ma\":$status,'\n                                   '\"tgian\":$request_time,\"tgian_up\":\"$upstream_response_time\",'\n                                   '\"uri\":\"$request_uri\",\"ua\":\"$http_user_agent\",\"byte\":$body_bytes_sent}';\n  log_format huu_dung  '$remote_addr $status $request_time $upstream_response_time $upstream_addr '\n                       '$upstream_status \"$request_method $request_uri\" -> \"$uri\" $body_bytes_sent \"$http_user_agent\"';\n  upstream app { server 127.0.0.1:9600; }\n  upstream hai { server 127.0.0.1:9601; server 127.0.0.1:9600; }       # 9601 chết ⇒ thử lại\n  server {                                                             # 8080: ba kiểu escape\n    listen 8080;\n    access_log /tmp/ng/logs/mac-dinh.log ua_mac_dinh;\n    access_log /tmp/ng/logs/esc-json.log ua_json;\n    access_log /tmp/ng/logs/esc-none.log ua_none;\n    location / { return 200 \"ok\\n\"; }\n  }\n  server {                                                             # 8081: JSON sai vs JSON đúng\n    listen 8081;\n    access_log /tmp/ng/logs/json-sai.log json_sai;\n    access_log /tmp/ng/logs/json.log     json;\n    location = /noi-bo { return 200 \"nginx tu tra loi\\n\"; }            # KHÔNG qua upstream\n    location /thu-lai/ { proxy_pass http://hai/; }\n    location /         { proxy_pass http://app; }\n  }\n  server {                                                             # 8082: đo kích thước 3 định dạng\n    listen 8082;\n    access_log /tmp/ng/logs/kt-ket-hop.log combined;\n    access_log /tmp/ng/logs/kt-huu-dung.log huu_dung;\n    access_log /tmp/ng/logs/kt-json.log json;\n    location / { proxy_pass http://app; }\n  }\n}\n",
 "n10-2:file:/root/doc_json.py": "# doc_json.py <tệp> — đưa TỪNG dòng qua trình phân tích JSON thật; in dòng hỏng + lỗi, đếm hợp lệ / hỏng\nimport json, sys\nok = hong = 0\nfor l in open(sys.argv[1]):\n    try: json.loads(l); ok += 1\n    except json.JSONDecodeError as e: hong += 1; print('  HONG', l.strip(), '\\n      ', type(e).__name__ + ':', e)\nprint(f'  hop le: {ok}   hong: {hong}')\n",
 "n10-2:file:/root/kich_thuoc.py": "# kich_thuoc.py — so kích thước mỗi dòng của ba định dạng, thô và sau gzip\nimport gzip, os\nfor ten in ('ket-hop', 'huu-dung', 'json'):\n    b = open(f'/tmp/ng/logs/kt-{ten}.log', 'rb').read(); n = b.count(b'\\n'); z = len(gzip.compress(b))\n    print(f'  {ten:9} {len(b) / n:6.1f} byte/dong tho  ->  gzip con {100 * z / len(b):4.1f}%  ({z / n:4.1f} byte/dong)')\n",
 "n10-2:setup": "",
 "n10-2:escape": "$ curl -s -o /dev/null -A 'Trinh duyet \"co ngoac\"' http://127.0.0.1:8080/\n$ curl -s -o /dev/null -A 'co\\backslash va \"ngoac\"' http://127.0.0.1:8080/\n$ curl -s -o /dev/null -A 'tieng Viet: Chào bạn' http://127.0.0.1:8080/\n$ for f in mac-dinh esc-json esc-none; do echo \"=== $f ===\"; cat $f.log; done\n=== mac-dinh ===\n\"Trinh duyet \\x22co ngoac\\x22\"\n\"co\\x5Cbackslash va \\x22ngoac\\x22\"\n\"tieng Viet: Ch\\xC3\\xA0o b\\xE1\\xBA\\xA1n\"\n=== esc-json ===\n\"ua\":\"Trinh duyet \\\"co ngoac\\\"\"\n\"ua\":\"co\\\\backslash va \\\"ngoac\\\"\"\n\"ua\":\"tieng Viet: Chào bạn\"\n=== esc-none ===\n\"ua\":\"Trinh duyet \"co ngoac\"\"\n\"ua\":\"co\\backslash va \"ngoac\"\"\n\"ua\":\"tieng Viet: Chào bạn\"",
 "n10-2:json": "$ curl -s -o /dev/null http://127.0.0.1:8081/noi-bo              # KHÔNG qua upstream\n$ curl -s -o /dev/null http://127.0.0.1:8081/binh-thuong         # có upstream\n$ curl -s -o /dev/null http://127.0.0.1:8081/thu-lai/binh-thuong # thử lại hai máy\n$ cat json-sai.log\n{\"ma\":200,\"tgian_up\":,\"ref\":\"\"}\n{\"ma\":200,\"tgian_up\":0.011,\"ref\":\"\"}\n{\"ma\":200,\"tgian_up\":0.000, 0.001,\"ref\":\"\"}\n$ python3 doc_json.py json-sai.log\n  HONG {\"ma\":200,\"tgian_up\":,\"ref\":\"\"} \n       JSONDecodeError: Expecting value: line 1 column 22 (char 21)\n  HONG {\"ma\":200,\"tgian_up\":0.000, 0.001,\"ref\":\"\"} \n       JSONDecodeError: Expecting property name enclosed in double quotes: line 1 column 29 (char 28)\n  hop le: 1   hong: 2\n$ python3 doc_json.py json.log\n  hop le: 3   hong: 0\n$ cat json.log\n{\"tg\":\"2026-11-13T00:39:49+00:00\",\"ip\":\"127.0.0.1\",\"ma\":200,\"tgian\":0.000,\"tgian_up\":\"\",\"uri\":\"/noi-bo\",\"ua\":\"curl/8.5.0\",\"byte\":17}\n{\"tg\":\"2026-11-13T00:39:49+00:00\",\"ip\":\"127.0.0.1\",\"ma\":200,\"tgian\":0.012,\"tgian_up\":\"0.011\",\"uri\":\"/binh-thuong\",\"ua\":\"curl/8.5.0\",\"byte\":25}\n{\"tg\":\"2026-11-13T00:39:49+00:00\",\"ip\":\"127.0.0.1\",\"ma\":200,\"tgian\":0.002,\"tgian_up\":\"0.000, 0.001\",\"uri\":\"/thu-lai/binh-thuong\",\"ua\":\"curl/8.5.0\",\"byte\":25}",
 "n10-2:file:/root/tao_tai.py": "# tao_tai.py — 200 request ĐA DẠNG (đường dẫn, user agent, referer khác nhau; seed cố định) vào cổng 8082\nimport random, subprocess\nrandom.seed(7)\nua = ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1) Safari/604.1', 'curl/8.5.0', 'Googlebot/2.1 (+http://www.google.com/bot.html)']\np = ['/binh-thuong', '/san-pham/%d', '/tim?q=ao+so+mi+%d', '/loi', '/cham', '/anh/%d.webp']\nfor i in range(200):\n    u = random.choice(p); u = u % random.randint(1, 9999) if '%d' in u else u\n    subprocess.run(['curl', '-s', '-o', '/dev/null', '-A', random.choice(ua), '-e', 'https://vidu.com/trang-%d' % random.randint(1, 50), 'http://127.0.0.1:8082' + u])\n",
 "n10-2:kichthuoc": "$ python3 kich_thuoc.py\n  ket-hop    150.7 byte/dong tho  ->  gzip con  5.8%  ( 8.8 byte/dong)\n  huu-dung   126.8 byte/dong tho  ->  gzip con  6.4%  ( 8.1 byte/dong)\n  json       174.9 byte/dong tho  ->  gzip con  4.9%  ( 8.6 byte/dong)\n$ python3 doc_json.py kt-json.log\n  hop le: 200   hong: 0\n$ jq -c 'select(.tgian > 0.5) | [.tgian, .ma, .uri]' kt-json.log | head -3\n[0.606,200,\"/cham\"]\n[0.604,200,\"/cham\"]\n[0.605,200,\"/cham\"]"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, meter, tiers, vsd } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-10-2', code: 'NGX 10.2', title: 'JSON logs, and the escape that decides if a machine can read them', sub: 'Chapter 10 · Lesson 10.2' };
const O = (k) => { const v = DU_LIEU[`n10-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const L = (k, a, b) => O(k).split('\n').slice(a, b).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 10 · Lesson 10.2', t: 'JSON logs, and the escape<br>that decides if a machine can read them', sub: 'One broken line and a log shipper drops it — or stops',
    en: 'Lesson 10.2. The reason to log JSON is that a machine reads it. That only pays off if every line parses — one broken line and a log shipper either drops it or stops. Two settings decide whether that happens, and the default is wrong for both.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three escape modes, the same three user agents</li>
    <li>The default turns Vietnamese into hex</li>
    <li>A bare number that is sometimes empty — and sometimes a list</li>
    <li>Empty is "" not -, and $time_iso8601</li>
    <li>What JSON costs, and the only test that counts</li></ul>`,
    en: 'Five takeaways: three escape modes on the same input; how the default turns Vietnamese into hex; a bare number that is sometimes empty and sometimes a list; empty strings and ISO timestamps; and what JSON costs, with the only test that counts.' },
  { t: 'Three escape modes, the same three requests', body: ngc(`log_format ua_mac_dinh             '"$http_user_agent"';
log_format ua_json   escape=json   '"ua":"$http_user_agent"';
log_format ua_none   escape=none   '"ua":"$http_user_agent"';`, { sm: true }) + tn(L('escape', 3, 17), { fs: 17, wrap: 110 }),
    en: 'Three log formats, identical except for the escape parameter, fed the same three user agents: one with quotes, one with a backslash, one in Vietnamese. The default writes backslash x and two hex digits. Escape json writes exactly what JSON needs. Escape none writes the bytes as they came — and the quotes end the JSON string early.' },
  { t: 'Reading the three modes', body: cmp(['Mode', '" (quote)', '\\ (backslash)', 'Chào bạn', 'Valid JSON?'], [
      ['default', '\\x22', '\\x5C', 'Ch\\xC3\\xA0o b\\xE1\\xBA\\xA1n', 'no — JSON has no \\x'],
      ['escape=json', '\\"', '\\\\', 'Chào bạn', 'yes'],
      ['escape=none', '"', '\\', 'Chào bạn', 'no — a quote ends the string'],
    ], { hl: [1] }) + icards([
      ['type', 'The default destroys Vietnamese', 'one \\xNN per BYTE: à is 2 bytes, ạ is 3 — correct, reversible, unreadable'],
      ['check', 'escape=json is the only readable one', 'JSON allows raw UTF-8 inside a string — your own logs stay legible'],
      ['warn', 'escape=none inside JSON is a loaded gun', 'any client can put a quote in a header and break the line'],
    ], 3),
    en: 'Reading the modes. The default escapes every non ASCII byte, so Chào bạn becomes a string of hex — correct, reversible and unreadable, for every Vietnamese search term and product name in your log. Escape json is the only mode that leaves Vietnamese legible while still producing valid JSON. Escape none inside JSON is a loaded gun.' },
  { t: 'The pitfall: a number without quotes', body: ngc(`# looks VERY reasonable: numbers left bare
log_format json_sai escape=json '{"ma":$status,"tgian_up":$upstream_response_time,"ref":"$http_referer"}';`, { sm: true, hl: [2] }) + tn(L('json', 0, 13), { fs: 16, wrap: 118 }),
    en: 'The pitfall. Quote the strings, leave the numbers bare — it passes nginx dash t. Three requests: one answered by Nginx itself, one through the backend, one retried across two backends. Two of the three lines are broken. With no upstream the value is empty: a key with nothing after the colon. With a retry it is a list: zero point zero zero zero comma zero point zero zero one.' },
  { t: 'The broken lines are the ones you do not test', body: two(icards([
      ['warn', 'Empty: no upstream contacted', 'health checks, redirects, static files, return 404 — everything nginx answers itself'],
      ['loop', 'A list: a retry (9.3)', '"0.000, 0.001" — bare, it is broken JSON AND a lost measurement'],
      ['eye', 'nginx -t knows nothing about JSON', 'every request you test through the proxy looks fine'],
    ], 1), ngc(`# $status is ALWAYS a number — bare is fine.
# $upstream_response_time CAN be empty
#   or a list — it must be quoted.
log_format json escape=json
  '{"tg":"$time_iso8601","ip":"$remote_addr",'
  '"ma":$status,"tgian":$request_time,'
  '"tgian_up":"$upstream_response_time",'
  '"uri":"$request_uri","ua":"$http_user_agent",'
  '"byte":$body_bytes_sent}';`, { sm: true, hl: [7] }), '') + cmp(['Request', 'Who answers', '$upstream_response_time', 'Bare in JSON'], [
      ['/noi-bo', 'nginx itself (return 200)', '(empty)', '"tgian_up":, — broken'],
      ['/binh-thuong', 'one backend, one try', '0.011', 'valid'],
      ['/thu-lai/…', 'backend 9601 dead ⇒ retry 9600', '0.000, 0.001', 'broken — a list'],
    ], { hl: [0, 2] }),
    en: 'The trap: the broken lines are exactly the ones you do not test. Everything you send through the proxy while building this is valid. The lines that break are health checks, redirects, static files, return four oh fours — everything Nginx answers by itself — plus every retry. The fix is one quote on each side, and convert to a number at query time.' },
  { t: 'The fix, verified by a real parser', body: tn(L('json', 13, 19), { fs: 15, wrap: 118 }) + cmp(['Safe bare (always a number)', 'Must be quoted (can be empty or a list)', 'Always quoted (client input)'], [
      ['$status · $body_bytes_sent', '$upstream_response_time · $upstream_connect_time', '$request_uri · $http_* · $uri'],
      ['$request_length · $request_time', '$upstream_header_time · $upstream_status · $upstream_addr', '$remote_addr · $host'],
    ]) + box('Empty is "" — not -', 'combined writes a missing value as -; escape=json writes "". A filter written as != "-" against JSON silently matches everything.', 'lam'),
    en: 'The fix, verified by a real parser: three lines out of three are valid. With no upstream the field is an empty string; with a retry it is a string you can split later. Leave bare only what Nginx always sets to a number. And notice empty is an empty string, not a dash — a filter written for combined logs silently matches everything against JSON.' },
  { t: 'What it costs, measured', body: tn(O('kichthuoc').split('\n').slice(0, 4).join('\n'), { fs: 18, wrap: 110 }) +
    meter([['combined — raw', 150.7, '#64748b'], ['huu_dung — raw', 126.8, '#2563eb'], ['json — raw', 174.9, '#009639'], ['combined — gzip', 8.8, '#64748b'], ['json — gzip', 8.6, '#009639']], { don: 'byte/line', rh: 36, fs: 17, nhan: 300 }) +
    box('Raw: +16% · gzip: about the same', '200 varied requests (paths, user agents, referers). JSON repeats its keys on every line — exactly what gzip removes best, and rotated logs are always compressed. Real traffic compresses worse than a loop; trust the raw number more.', 'lam'),
    en: 'What it costs, measured on two hundred varied requests. Raw, JSON is about sixteen percent larger than combined. After gzip the gap disappears — eight point six bytes per line against eight point eight — because repeated key names are exactly what a compressor removes. Real traffic compresses worse than a generated loop, so trust the raw number more. Tens of percent, not multiples.' },
  { t: 'Does it actually parse? — the only test that counts', body: tn(O('kichthuoc').split('\n').slice(4).join('\n'), { fs: 19, wrap: 110 }) + ngc(`# after ANY change to log_format — one line:
while read l; do echo "$l" | jq -e . >/dev/null || echo "BROKEN: $l"; done < access.log`, { sm: true }) + icards([
      ['check', 'escape=json', 'not optional: valid JSON, legible Vietnamese'],
      ['type', 'Quote anything that CAN be empty', 'the whole upstream_* family'],
      ['gauge', '$time_iso8601, not $time_local', '2026-11-13T00:39:49+00:00 sorts as text; every ingester reads it'],
    ], 3),
    en: 'Does it actually parse? Two hundred lines, two hundred valid, and a query that would be painful against text: every request slower than half a second, in one jq line. Run the one line check after any change to the log format — a format valid for a year can break the day you add a return block. And use time ISO 8601, which sorts as text.' },
  { t: 'Should you log JSON at all?', body: tiers([
      ['server', 'Something ingests the logs', 'Loki, Elasticsearch, Vector, CloudWatch ⇒ yes, JSON', '#009639'],
      ['eye', 'You read them with grep, awk and your eyes', 'one server ⇒ the aligned text format of 10.1 is easier', '#2563eb'],
      ['warn', 'Never: text re-parsed by a regex', 'a second copy of your format, breaks silently on a new field', '#c0392b'],
    ], { th: 80, gap: 30 }) + box('For a Vietnamese-language site there is a second reason', 'escape=json is the only mode that lets you read your own logs — search terms, product names, referers.', 'xanh'),
    en: 'Should you log JSON at all? If something ingests the logs, yes. If you read them with grep and your eyes on one server, the text format of the last lesson is easier. Never keep a text format that a tool re-parses with a regex. And for a Vietnamese site, escape json is the only way to read your own logs.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('escape=default', '\\xNN per byte'),
      kw('escape=json', '\\" \\\\ — UTF-8 kept'),
      kw('escape=none', 'raw bytes — unsafe'),
      kw('bare vs quoted', 'empty / list ⇒ quote'),
      kw('$time_iso8601', 'sortable timestamp'),
      kw('jq -e .', 'the parse test'),
    ].join('')}</div>` + vsd(`<ul><li>escape default ⇒ \\x22, Ch\\xC3\\xA0o</li><li>a bare <code>$upstream_response_time</code></li><li><code>$time_local</code></li></ul>`, `<ul><li>escape=json ⇒ \\" and Chào bạn</li><li><code>"$upstream_response_time"</code></li><li><code>$time_iso8601</code> · checked by <code>jq -e .</code></li></ul>`, '✗ Breaks on lines you never test', '✓ 3 of 3 lines parse'), to: true,
    en: 'Key terms: escape default, escape json, escape none, bare against quoted values, time ISO 8601, and jq dash e dot.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Three formats, one per escape mode — log a quote, a backslash, "Chào bạn"',
      `A JSON format with a bare ${c('$upstream_response_time')}`,
      'Hit a return block and a retry — run the parser',
      'Quote it, re-run, then measure raw and gzip size',
    ]), box('Keep these', `<ul><li>escape=json, always</li><li>quote what can be empty or a list</li><li>"" not -</li><li>verify with a real parser</li></ul>`, 'lam'), ''),
    en: 'Your turn: three formats, one per escape mode; a JSON format with a bare upstream time; hit a return block and a retry and run the parser; then quote it, re-run, and measure the size. Keep: escape json always; quote what can be empty or a list; empty is an empty string; verify with a real parser.' },
];
export const slides = lamDeck({ chuong: 'Chapter 10 — Logs, and seeing what is happening', bai: '10.2' }, S);
