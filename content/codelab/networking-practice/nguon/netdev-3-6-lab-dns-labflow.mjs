/**
 * Networking for Developers · LAB chương 3 — "DNS của LabFlow" (bài netdev-3-6-lab-dns-labflow; output thật lab/out/lab3-*.out.txt,
 * kịch bản lab/code/ch03/lab3/). Một đề lớn "bản in": R1 bản đồ ủy quyền từ dig +trace, R3 kế hoạch TTL + đo lần chuyển thật + quy tắc
 * TTL âm, R4 bộ kiểm ủy quyền (cùng các dòng kiem-dns.sh in ra), R5 so DS ở vùng cha với DS tính từ DNSKEY đang công bố.
 */
import { doiDau, KHOA, bi, tn, jsBai, nguon, goi, sauLenh, ra, pre } from './_net.mjs';

const tr = (ds) => ds.map((d) => d.replace(/\s+$/, ''));
const S = (tep, lenh) => tr(sauLenh(tep, lenh));
const T = (tep) => tr(ra(tep).split('\n').slice(1)).filter((d) => d.trim());
const J = (ds) => ds.join('\n');
const TRACE = S('lab3-r1', 'dig +trace +nodnssec www.labflow.test');
const TRACE_STATIC = S('lab3-r1', 'dig +trace +nodnssec static.labflow.test');
const TRACE_CT = S('c31-goc', 'dig +trace +nodnssec cuongthai.com').filter((d) => d.trim() && !/^; <<>>|^;; global/.test(d));
const TRACE_OLD = S('c35-het-han', 'dig +trace +nodnssec www.oldshop.test');
const R3 = T('lab3-r3').filter((d) => /^\d\d:\d\d:\d\d/.test(d));
const THEO33 = T('c33-theo-doc').filter((d) => /^\d\d:\d\d:\d\d/.test(d));
const gio = (tep) => T(tep).find((d) => /^\d\d:\d\d:\d\d$/.test(d));
const R3HA = gio('lab3-r3-ha'), R3DOI = gio('lab3-r3-doi');
const R4 = T('lab3-r4-laptop');
const R4_PARENT = S('lab3-r4-laptop', 'dig +noall +authority +additional labflow.test NS @192.0.2.20');
const R4_CHILD = S('lab3-r4-laptop', 'dig +short NS labflow.test @203.0.113.53');
const R4_KIEM = S('lab3-r4-laptop', './kiem-dns.sh');
const R4_OK = S('lab3-r4-ok', './kiem-dns.sh');
const R5 = T('lab3-r5-laptop');
const R5_PARENT = S('lab3-r5-laptop', 'dig +noall +answer labflow.test DS @192.0.2.20');
const R5_PUB = S('lab3-r5-laptop', 'dig +noall +answer labflow.test DNSKEY @203.0.113.53');
const R5_SAU = S('lab3-r5-sau', 'dig +noall +answer labflow.test DS @192.0.2.20');
const CH_DS = S('c35-chuoi', 'dig +noall +answer labflow.test DS @192.0.2.20');
const CH_PUB = S('c35-chuoi', 'dig +noall +answer labflow.test DNSKEY @203.0.113.53 | dnssec-dsfromkey');
const SOA_LAB = 'labflow.test.		3600	IN	SOA	ns1.labflow.test. hostmaster.labflow.test. 2026110102 3600 600 1209600 300';
if (R3HA !== '17:18:12' || R3DOI !== '17:20:17' || R4_PARENT.length !== 4 || R4_CHILD.length !== 2 || R5_PARENT.length !== 1 || R5_PUB.length !== 1 || R4_KIEM.length !== 7) throw new Error('Lab 3: output thật đổi — xem lại đề');

/* ═══ lời giải tham chiếu ═══ */
/** dig +trace ⇒ các cấp ủy quyền (mỗi khối có NS) và câu trả lời cuối. */
function delegationMap(text) {
  var blocks = [], cur = [];
  String(text).split('\n').forEach(function (line) {
    var r = /^;; Received \d+ bytes from [^(]*\(([^)]*)\) in (\d+) ms/.exec(line);
    if (r) { blocks.push({ from: r[1], ms: Number(r[2]), lines: cur }); cur = []; return; }
    if (line.trim() && line[0] !== ';') cur.push(line.trim().split(/\s+/));
  });
  var levels = [];
  blocks.forEach(function (b) {
    var ns = b.lines.filter(function (w) { return w[3] === 'NS'; });
    if (!ns.length) return;
    levels.push({ zone: ns[0][0], ttl: Number(ns[0][1]), servers: ns.map(function (w) { return w[4]; }).sort(), from: b.from, ms: b.ms });
  });
  var last = blocks[blocks.length - 1];
  var rest = last ? last.lines.filter(function (w) { return w[3] !== 'NS'; }) : [];
  return {
    levels: levels,
    answer: rest.length ? { from: last.from, records: rest.map(function (w) { return w[0] + ' ' + w[3] + ' ' + w.slice(4).join(' '); }) } : null,
  };
}

var hms = function (s) { var p = s.split(':').map(Number); return p[0] * 3600 + p[1] * 60 + p[2]; };
var fmt = function (n) { var p = function (x) { return (x < 10 ? '0' : '') + x; }; return p(Math.floor(n / 3600) % 24) + ':' + p(Math.floor(n / 60) % 60) + ':' + p(n % 60); };
/** Kế hoạch chuyển máy chủ: đổi IP khi TTL cũ đã hết khắp nơi. */
function ttlPlan(o) {
  var change = hms(o.lowerAt) + o.oldTtl + (o.safety || 0);
  return { changeAt: fmt(change), worstStale: o.newTtl, ok: o.newTtl <= o.maxStale, keepOldUntil: fmt(change + o.newTtl) };
}
/** Đọc các lượt hỏi thật "HH:MM:SS  TTL n  ip": lần cuối thấy IP cũ, lần đầu thấy IP mới, độ trễ. */
function measureSwitch(text, changeAt, newIp) {
  var polls = String(text).split('\n').map(function (l) { return l.trim().split(/\s+/); }).filter(function (w) { return /^\d\d:\d\d:\d\d$/.test(w[0]); })
    .map(function (w) { return { at: w[0], ip: w[w.length - 1] }; });
  var c = hms(changeAt), first = null, lastOld = null;
  polls.forEach(function (p) {
    if (hms(p.at) < c || first) return;
    if (p.ip === newIp) first = p; else lastOld = p;
  });
  return { lastOld: lastOld ? lastOld.at : null, firstNew: first ? first.at : null, delayS: first ? hms(first.at) - c : null };
}
/** Quy tắc TTL âm: tên được hỏi trước khi tạo thì resolver thấy nó lúc nào. */
function negativeWait(soaLine, queriedAt, createdAt) {
  var w = soaLine.trim().split(/\s+/);
  var neg = Math.min(Number(w[1]), Number(w[w.length - 1]));
  var q = hms(queriedAt), c = hms(createdAt);
  return { negTtl: neg, visibleFrom: fmt(q >= c ? q : Math.max(c, q + neg + 1)) };
}
/** Các kiểm ủy quyền của kiem-dns.sh (không có phần DNSSEC). */
function checkDelegation(d) {
  var rows = String(d.parent).split('\n').map(function (l) { return l.trim().split(/\s+/); });
  var parentNs = rows.filter(function (w) { return w[3] === 'NS'; }).map(function (w) { return w[4]; }).sort();
  var glue = {};
  rows.forEach(function (w) { if (w[3] === 'A') glue[w[0]] = w[4]; });
  var out = ['[OK]   delegation at the parent: ' + parentNs.join(' ')];
  var serials = [];
  parentNs.forEach(function (ns) {
    var ip = glue[ns];
    if (!ip) { out.push('[FAIL] ' + ns + ' has no address at the parent'); return; }
    var s = d.serials[ip];
    if (s) { out.push('[OK]   ' + ns + ' ' + ip + ' answers, serial ' + s); serials.push(s); }
    else out.push('[FAIL] ' + ns + ' ' + ip + ' does not answer');
  });
  var uniq = serials.filter(function (s, i) { return serials.indexOf(s) === i; });
  out.push(uniq.length <= 1 ? '[OK]   all name servers have the same serial' : '[FAIL] serials differ: ' + serials.join(' '));
  var childNs = String(d.child).split('\n').map(function (l) { return l.trim(); }).filter(Boolean).sort();
  out.push(childNs.join(' ') === parentNs.join(' ') ? '[OK]   child NS = parent NS' : '[FAIL] child NS (' + childNs.join(' ') + ') != parent NS (' + parentNs.join(' ') + ')');
  return out;
}
/** So DS ở vùng cha với DS tính từ DNSKEY đang công bố. */
function dsMatch(parentText, publishedText) {
  var parse = function (text) {
    return String(text).split('\n').map(function (l) { return l.trim().split(/\s+/); }).filter(function (w) { return w.indexOf('DS') >= 0; }).map(function (w) {
      var i = w.indexOf('DS');
      return { keyTag: Number(w[i + 1]), alg: Number(w[i + 2]), digestType: Number(w[i + 3]), digest: w.slice(i + 4).join('').toUpperCase() };
    });
  };
  var p = parse(parentText), k = parse(publishedText);
  var same = function (a, b) { return a.keyTag === b.keyTag && a.alg === b.alg && a.digestType === b.digestType && a.digest === b.digest; };
  var reason;
  if (!p.length) reason = 'no DS at parent (insecure)';
  else if (p.some(function (a) { return k.some(function (b) { return same(a, b); }); })) reason = 'ok';
  else if (p.some(function (a) { return k.some(function (b) { return a.keyTag === b.keyTag; }); })) reason = 'digest differs';
  else reason = 'key tag differs';
  return { match: reason === 'ok', reason: reason, parent: p, published: k };
}

/* ═══ dữ liệu cho ca kiểm ═══ */
const ma = (x) => JSON.stringify(x);
const SERIALS_R4 = { '203.0.113.53': '2026110104', '203.0.113.55': null };
// DỰNG từ đúng các giá trị kiem-dns.sh in ở lab3-r4-ok (sau khi TLD sửa ủy quyền): dạng output của dig, giá trị thật.
const PARENT_OK = ['labflow.test.\t\t172800\tIN\tNS\tns1.labflow.test.', 'labflow.test.\t\t172800\tIN\tNS\tns2.labflow.test.', 'ns1.labflow.test.\t172800\tIN\tA\t203.0.113.53', 'ns2.labflow.test.\t172800\tIN\tA\t203.0.113.54'].join('\n');
// DỰNG: ủy quyền thêm một máy chủ tên ngoài vùng (không có glue) và hai serial lệch nhau.
const PARENT_3 = `${PARENT_OK}\nlabflow.test.\t\t172800\tIN\tNS\tns.backup-dns.example.`;
const DS_ROLL = `${R5_PARENT[0]}\n${CH_DS[0]}`;                       // DỰNG: lúc đổi KSK đúng cách — vùng cha giữ cả DS cũ lẫn DS mới
const DS_DIGEST = R5_PUB[0].replace(/0FA2C679/, '0FA2C67A');            // DỰNG: cùng key tag, digest sai một ký tự (dán nhầm)
const POLLS_R3 = J(R3), POLLS_33 = J(THEO33);
const R3_PLAN = { oldTtl: 120, newTtl: 10, maxStale: 10, lowerAt: R3HA, safety: 5 };
if (ttlPlan(R3_PLAN).changeAt !== R3DOI) throw new Error('Lab 3: kế hoạch không khớp giờ đổi thật');
const ky = (o) => JSON.stringify(o);
if (ky(checkDelegation({ parent: J(R4_PARENT), child: J(R4_CHILD), serials: SERIALS_R4 }).map((d) => d.replace(/\s+/g, ' '))) !== ky(R4_KIEM.slice(0, 5).map((d) => d.replace(/\s+/g, ' ').replace(/ \)/g, ')').trim()))) throw new Error('Lab 3: checkDelegation không khớp kiem-dns.sh thật');

const LAB = jsBai({
  ten: 'Lab 3 — LabFlow\'s DNS: the toolkit behind the report', kho: 'HARD', phut: 150, diem: 60, dangBai: 'lab',
  en: '<p>See the brief.</p>', vi: '<p>Xem đề.</p>',
  banIn: {
    tieuDe: bi('Lab 3 — LabFlow\'s DNS: the toolkit behind the report', 'Lab 3 — DNS của LabFlow: bộ công cụ đứng sau báo cáo'),
    phu: bi('Chapter 3 lab · course project part 3 · JavaScript, graded in the browser · 10 marks', 'Lab chương 3 · phần 3 của dự án khoá · JavaScript, chấm trong trình duyệt · 10 điểm'),
    moTa: bi(`<p><b>Situation.</b> LabFlow launches a status page, moves its API to the Singapore edge and survives two DNS incidents (lesson Lab 3). Your lead wants the report's numbers to come from code, not from eyeballing: a delegation map, a TTL plan checked against the real switch, the negative-TTL rule for the new name, a delegation checker and a DS comparison. Everything below is real output of the course lab (lab/out/lab3-*), unless marked <i>constructed</i>.</p>
<p>R1, the delegation as dig +trace saw it:</p>${pre(TRACE)}
<p>R3, the move: TTL lowered at ${R3HA}, IP changed at ${R3DOI}; the laptop polled every 5 s:</p>${pre(R3)}
<p>R4, incident A (after <code>su-co-a.sh</code> on nfi-tld):</p>${pre(R4)}
<p>R5, incident B (after <code>su-co-b.sh</code> on nfi-ns):</p>${pre(R5)}`,
    `<p><b>Tình huống.</b> LabFlow ra mắt trang trạng thái, chuyển API sang máy biên Singapore và vượt qua hai sự cố DNS (bài Lab 3). Trưởng nhóm muốn các con số trong báo cáo đến từ mã, không phải nhìn bằng mắt: bản đồ ủy quyền, kế hoạch TTL đối chiếu với lần chuyển thật, quy tắc TTL âm cho tên mới, bộ kiểm ủy quyền và phép so DS. Mọi thứ dưới đây là output thật của phòng lab (lab/out/lab3-*), trừ chỗ ghi <i>dựng</i>.</p>
<p>R1, ủy quyền như dig +trace thấy:</p>${pre(TRACE)}
<p>R3, lần chuyển: hạ TTL lúc ${R3HA}, đổi IP lúc ${R3DOI}; laptop hỏi 5 s một lần:</p>${pre(R3)}
<p>R4, sự cố A (sau <code>su-co-a.sh</code> trên nfi-tld):</p>${pre(R4)}
<p>R5, sự cố B (sau <code>su-co-b.sh</code> trên nfi-ns):</p>${pre(R5)}`),
    chucNangChinh: [
      bi('<code>delegationMap(traceText)</code> — who holds each level, TTL of each referral, the final answer (R1).', '<code>delegationMap(traceText)</code> — ai giữ từng cấp, TTL của từng referral, câu trả lời cuối (R1).'),
      bi('<code>ttlPlan(o)</code> + <code>measureSwitch(pollText, changeAt, newIp)</code> + <code>negativeWait(soaLine, queriedAt, createdAt)</code> — plan the move, measure it, and the negative-TTL rule (R2, R3).', '<code>ttlPlan(o)</code> + <code>measureSwitch(pollText, changeAt, newIp)</code> + <code>negativeWait(soaLine, queriedAt, createdAt)</code> — lên kế hoạch chuyển, đo nó, và quy tắc TTL âm (R2, R3).'),
      bi('<code>checkDelegation({ parent, child, serials })</code> — the delegation checks of kiem-dns.sh (R4, R6).', '<code>checkDelegation({ parent, child, serials })</code> — các phép kiểm ủy quyền của kiem-dns.sh (R4, R6).'),
      bi('<code>dsMatch(parentText, publishedText)</code> — does the parent vouch for the key that is published? (R5)', '<code>dsMatch(parentText, publishedText)</code> — vùng cha có bảo lãnh đúng khoá đang công bố không? (R5)'),
    ],
    yeuCauChung: [
      bi('One file, <code>answer.js</code>, all functions at top level (the grader calls each one directly). Helpers are allowed — reuse your code from exercises 3.1–3.5.', 'Một tệp <code>answer.js</code>, mọi hàm ở cấp cao nhất (máy chấm gọi trực tiếp từng hàm). Được viết hàm phụ — dùng lại code của bạn từ các bài 3.1–3.5.'),
      bi('Plain JavaScript, no libraries. Return values, do not print. Do not modify the arguments. Times are "HH:MM:SS" strings of one day.', 'JavaScript thuần, không thư viện. Trả về giá trị, đừng in. Không sửa các đối số. Thời gian là chuỗi "HH:MM:SS" trong một ngày.'),
      bi('Each function is graded on its own inputs, so a mistake in one does not cost the others.', 'Mỗi hàm được chấm bằng đầu vào riêng, nên lỗi ở hàm này không làm mất điểm hàm khác.'),
    ],
    tieuDeCay: bi('Files', 'Tệp'),
    cayThuMuc: 'answer.js        delegationMap · ttlPlan · measureSwitch · negativeWait · checkDelegation · dsMatch',
    moHinh: [
      { ten: 'Inputs', truong: [
        ['traceText', 'string', bi('output of dig +trace +nodnssec (records, then ";; Received … from IP#53(NAME) in N ms" after each block)', 'output của dig +trace +nodnssec (các bản ghi, rồi ";; Received … from IP#53(TÊN) in N ms" sau mỗi khối)')],
        ['o (ttlPlan)', '{ oldTtl, newTtl, maxStale, lowerAt, safety? }', bi('R3: 120, 10, 10, "17:18:12", 5', 'R3: 120, 10, 10, "17:18:12", 5')],
        ['pollText', 'string', bi('lines "HH:MM:SS  TTL n  ip" (lab/out/lab3-r3)', 'các dòng "HH:MM:SS  TTL n  ip" (lab/out/lab3-r3)')],
        ['parent / child / serials', 'string / string / { ip: serial | null }', bi('parent = dig +noall +authority +additional NS @TLD; child = dig +short NS @first server that answered; serials = SOA serial per IP (null = no answer)', 'parent = dig +noall +authority +additional NS @TLD; child = dig +short NS @máy chủ đầu tiên trả lời; serials = serial SOA theo IP (null = không trả lời)')],
        ['parentText / publishedText', 'string / string', bi('dig +noall +answer DS @TLD / dnssec-dsfromkey output (one or more DS lines each)', 'dig +noall +answer DS @TLD / output dnssec-dsfromkey (mỗi bên một hoặc nhiều dòng DS)')],
      ] },
      { ten: 'Outputs', truong: [
        ['delegationMap', '{ levels: [{ zone, ttl, servers, from, ms }], answer: { from, records } | null }', bi('one level per block that has NS lines; answer = the non-NS records of the last block, as "name TYPE data"', 'mỗi khối có dòng NS là một cấp; answer = các bản ghi không phải NS của khối cuối, dạng "tên TYPE data"')],
        ['ttlPlan', '{ changeAt, worstStale, ok, keepOldUntil }', bi('times as "HH:MM:SS"', 'thời gian dạng "HH:MM:SS"')],
        ['measureSwitch / negativeWait', '{ lastOld, firstNew, delayS } / { negTtl, visibleFrom }', bi('null when not seen', 'null khi không thấy')],
        ['checkDelegation', '[lines]', bi('"[OK]   …" / "[FAIL] …" in the order of kiem-dns.sh', '"[OK]   …" / "[FAIL] …" theo thứ tự của kiem-dns.sh')],
        ['dsMatch', '{ match, reason, parent, published }', bi('reason "ok" | "digest differs" | "key tag differs" | "no DS at parent (insecure)"', 'reason "ok" | "digest differs" | "key tag differs" | "no DS at parent (insecure)"')],
      ] },
    ],
    duLieuMau: `# R4 — the parent and the child disagree (lab/out/lab3-r4-laptop)\n${J(R4_PARENT)}\n# child: dig +short NS labflow.test @203.0.113.53\n${J(R4_CHILD)}\n# serials: ${ma(SERIALS_R4)}\n\n# R5 — DS at the parent vs DS computed from the published DNSKEY (lab/out/lab3-r5-laptop)\n${R5_PARENT[0]}\n${R5_PUB[0]}`,
    chucNang: [
      { ten: bi('delegationMap() — R1', 'delegationMap() — R1'), diem: 2,
        moTa: bi('Turn a +trace into the delegation map of the report: one level per referral, with the TTL the parent gives, and the final answer.', 'Biến một +trace thành bản đồ ủy quyền của báo cáo: mỗi referral một cấp, kèm TTL mà vùng cha đưa, và câu trả lời cuối.'),
        yeuCau: [
          bi('A block = the record lines before a <code>;; Received … from IP#53(NAME) in N ms</code> line; <code>from</code> = the text in parentheses, <code>ms</code> = N. Other lines starting with ";" and empty lines are ignored.', 'Một khối = các dòng bản ghi đứng trước dòng <code>;; Received … from IP#53(TÊN) in N ms</code>; <code>from</code> = chữ trong ngoặc tròn, <code>ms</code> = N. Các dòng khác bắt đầu bằng ";" và dòng trống bỏ qua.'),
          bi('A block with NS lines gives a level: <code>zone</code> = owner of the first NS line, <code>ttl</code> = its TTL (number), <code>servers</code> = the NS targets sorted. Blocks without NS give no level.', 'Khối có dòng NS cho một cấp: <code>zone</code> = tên chủ của dòng NS đầu, <code>ttl</code> = TTL của nó (số), <code>servers</code> = các đích NS đã sắp xếp. Khối không có NS không cho cấp nào.'),
          bi('<code>answer</code>: the non-NS lines of the <b>last</b> block as <code>"name TYPE data"</code> (data words joined by one space), with that block\'s <code>from</code>; <code>null</code> if there are none.', '<code>answer</code>: các dòng không phải NS của khối <b>cuối</b> dạng <code>"tên TYPE data"</code> (các chữ data nối bằng một dấu cách), kèm <code>from</code> của khối đó; <code>null</code> nếu không có.'),
        ],
        viDu: 'delegationMap(r1).levels.map(l => l.zone + " " + l.ttl)\n⇒ [". 86400", "test. 172800", "labflow.test. 172800", "labflow.test. 86400"]   // parent copy 2 days, child copy 1 day' },
      { ten: bi('ttlPlan(), measureSwitch(), negativeWait() — R2, R3', 'ttlPlan(), measureSwitch(), negativeWait() — R2, R3'), diem: 2.5,
        moTa: bi('Plan the API move with the rule "worst-case delay = TTL in caches when you change", check it against the real poll, and compute when a resolver that asked too early sees the new status name.', 'Lên kế hoạch chuyển API theo quy tắc "độ trễ xấu nhất = TTL đang trong cache lúc đổi", đối chiếu với lượt hỏi thật, và tính khi nào một resolver đã hỏi quá sớm thấy được tên status mới.'),
        yeuCau: [
          bi('<code>ttlPlan(o)</code>: <code>changeAt</code> = lowerAt + oldTtl + safety (default 0); <code>worstStale</code> = newTtl; <code>ok</code> = newTtl ≤ maxStale; <code>keepOldUntil</code> = changeAt + newTtl (the old server must keep answering until then).', '<code>ttlPlan(o)</code>: <code>changeAt</code> = lowerAt + oldTtl + safety (mặc định 0); <code>worstStale</code> = newTtl; <code>ok</code> = newTtl ≤ maxStale; <code>keepOldUntil</code> = changeAt + newTtl (máy cũ phải còn trả lời tới lúc đó).'),
          bi('<code>measureSwitch(pollText, changeAt, newIp)</code>: among polls at or after changeAt, <code>firstNew</code> = the first showing newIp, <code>lastOld</code> = the last one before it showing another IP, <code>delayS</code> = firstNew − changeAt in seconds (all null when not seen).', '<code>measureSwitch(pollText, changeAt, newIp)</code>: trong các lượt hỏi từ changeAt trở đi, <code>firstNew</code> = lượt đầu thấy newIp, <code>lastOld</code> = lượt cuối trước nó thấy IP khác, <code>delayS</code> = firstNew − changeAt tính bằng giây (đều null khi không thấy).'),
          bi('<code>negativeWait(soaLine, queriedAt, createdAt)</code>: negTtl = min(SOA record TTL, SOA minimum); a name asked before it was created becomes visible at max(createdAt, queriedAt + negTtl + 1); asked after creation ⇒ visible at queriedAt.', '<code>negativeWait(soaLine, queriedAt, createdAt)</code>: negTtl = min(TTL của bản ghi SOA, minimum của SOA); tên bị hỏi trước khi tạo sẽ thấy được lúc max(createdAt, queriedAt + negTtl + 1); hỏi sau khi tạo ⇒ thấy ngay lúc queriedAt.'),
        ],
        viDu: `ttlPlan({ oldTtl: 120, newTtl: 10, maxStale: 10, lowerAt: "${R3HA}", safety: 5 }).changeAt ⇒ "${R3DOI}"   // the real change time\nmeasureSwitch(r3, "${R3DOI}", "203.0.113.11") ⇒ ${ma(measureSwitch(POLLS_R3, R3DOI, '203.0.113.11'))}` },
      { ten: bi('checkDelegation() — R4, R6', 'checkDelegation() — R4, R6'), diem: 3,
        moTa: bi('The delegation part of kiem-dns.sh as a function — so it can run in CI or a cron job and print what the script printed during incident A (the bash script leaves a stray space before each ")"; your lines must not).', 'Phần kiểm ủy quyền của kiem-dns.sh viết thành hàm — để chạy trong CI hay cron và in đúng những gì script đã in trong sự cố A (script bash để thừa một dấu cách trước mỗi ")"; dòng của bạn thì không).'),
        yeuCau: [
          bi('Parent NS = the NS targets in <code>parent</code>, sorted; glue = its A lines. First line: <code>"[OK]   delegation at the parent: " + names joined by one space</code>.', 'NS ở vùng cha = các đích NS trong <code>parent</code>, đã sắp xếp; glue = các dòng A của nó. Dòng đầu: <code>"[OK]   delegation at the parent: " + các tên nối bằng một dấu cách</code>.'),
          bi('Then one line per parent NS, in that order: no glue ⇒ <code>"[FAIL] NS has no address at the parent"</code>; serials[ip] present ⇒ <code>"[OK]   NS IP answers, serial S"</code>; else <code>"[FAIL] NS IP does not answer"</code>.', 'Rồi mỗi NS của vùng cha một dòng, theo thứ tự đó: không có glue ⇒ <code>"[FAIL] NS has no address at the parent"</code>; có serials[ip] ⇒ <code>"[OK]   NS IP answers, serial S"</code>; ngược lại <code>"[FAIL] NS IP does not answer"</code>.'),
          bi('Then <code>"[OK]   all name servers have the same serial"</code> (at most one distinct serial among those that answered) or <code>"[FAIL] serials differ: S1 S2 …"</code> (in NS order); then <code>"[OK]   child NS = parent NS"</code> or <code>"[FAIL] child NS (A B) != parent NS (C D)"</code> with both lists sorted. Note the three spaces after [OK].', 'Rồi <code>"[OK]   all name servers have the same serial"</code> (tối đa một serial khác nhau trong số máy đã trả lời) hoặc <code>"[FAIL] serials differ: S1 S2 …"</code> (theo thứ tự NS); rồi <code>"[OK]   child NS = parent NS"</code> hoặc <code>"[FAIL] child NS (A B) != parent NS (C D)"</code> với cả hai danh sách đã sắp xếp. Để ý ba dấu cách sau [OK].'),
        ],
        viDu: `checkDelegation({ parent: r4Parent, child: r4Child, serials: ${ma(SERIALS_R4)} })\n⇒ ${ma(checkDelegation({ parent: J(R4_PARENT), child: J(R4_CHILD), serials: SERIALS_R4 }))}` },
      { ten: bi('dsMatch() — R5', 'dsMatch() — R5'), diem: 2.5,
        moTa: bi('Compare what the parent publishes with what the zone\'s keys hash to. This is the one check that would have caught incident B before customers did.', 'So thứ vùng cha công bố với băm từ các khoá của vùng. Đây là phép kiểm duy nhất bắt được sự cố B trước khi khách hàng phát hiện.'),
        yeuCau: [
          bi('Each line containing the word <code>DS</code> is one DS: after it come key tag, algorithm, digest type, then the digest — which dig may split with a space: join the remaining words and upper-case them. Return them as <code>parent</code> and <code>published</code>: <code>[{ keyTag, alg, digestType, digest }]</code>.', 'Mỗi dòng có chữ <code>DS</code> là một DS: sau nó là key tag, thuật toán, loại digest, rồi digest — mà dig có thể tách bằng dấu cách: nối các chữ còn lại và viết hoa. Trả chúng ra ở <code>parent</code> và <code>published</code>: <code>[{ keyTag, alg, digestType, digest }]</code>.'),
          bi('<code>reason</code>: no DS at the parent ⇒ <code>"no DS at parent (insecure)"</code>; some parent DS equal (all four fields) to some published one ⇒ <code>"ok"</code>; else a shared key tag ⇒ <code>"digest differs"</code>; else <code>"key tag differs"</code>. <code>match</code> = reason is "ok".', '<code>reason</code>: vùng cha không có DS ⇒ <code>"no DS at parent (insecure)"</code>; có DS của vùng cha bằng (cả bốn trường) một DS đang công bố ⇒ <code>"ok"</code>; ngược lại có key tag trùng ⇒ <code>"digest differs"</code>; còn lại <code>"key tag differs"</code>. <code>match</code> = reason là "ok".'),
        ],
        viDu: `dsMatch(r5Parent, r5Published).reason ⇒ "key tag differs"   // 50642 at the TLD, 30957 published` },
    ],
    truDiem: [
      bi('Taking the child\'s NS TTL (86400) as the TTL of the delegation: the parent\'s copy (172800) is what resolvers keep after a referral.', 'Lấy TTL NS của vùng con (86400) làm TTL của ủy quyền: bản của vùng cha (172800) mới là thứ resolver giữ sau một referral.'),
      bi('Changing the IP right after lowering the TTL (lesson 3.3: 105 s of old answers).', 'Đổi IP ngay sau khi hạ TTL (bài 3.3: 105 s trả lời cũ).'),
      bi('Comparing DS digests as written: dig inserts a space inside long digests.', 'So digest DS như được in: dig chèn dấu cách vào giữa digest dài.'),
      bi('Fixing incident A in the zone file: the wrong NS list lives at the parent (the registrar).', 'Sửa sự cố A trong tệp vùng: danh sách NS sai nằm ở vùng cha (nhà đăng ký).'),
    ],
    nopBai: bi('Press Submit. Every feature is graded by its own checks (visible ones on Run, hidden ones on Submit). Then paste the outputs into your Lab 3 report: the delegation map (R1), the plan next to the measured switch (R3), the checker lines before and after each fix (R4, R6) and the DS comparison (R5).', 'Bấm Nộp. Mỗi chức năng được chấm bằng các kiểm riêng (kiểm hiện khi Chạy, kiểm ẩn khi Nộp). Rồi dán output vào báo cáo Lab 3: bản đồ ủy quyền (R1), kế hoạch đặt cạnh lần chuyển đo được (R3), các dòng của bộ kiểm trước và sau mỗi lần sửa (R4, R6) và phép so DS (R5).'),
  },
  goiY: [
    ['Hint 1 (after 15 minutes): reuse parseZone-style splitting — every record line is "name ttl IN TYPE data…"; the word at index 3 is the type.', 'Gợi ý 1 (sau 15 phút): dùng lại cách tách kiểu parseZone — mọi dòng bản ghi là "tên ttl IN TYPE data…"; chữ ở vị trí 3 là loại.'],
    ['Hint 2 (after 40 minutes): write hms("HH:MM:SS") ⇒ seconds and its inverse once; ttlPlan, measureSwitch and negativeWait are then a few lines each.', 'Gợi ý 2 (sau 40 phút): viết hms("HH:MM:SS") ⇒ giây và hàm ngược một lần; ttlPlan, measureSwitch và negativeWait khi đó chỉ vài dòng mỗi hàm.'],
    ['Hint 3 (after 60 minutes): in checkDelegation, build every list first (parent NS, glue, child NS), then produce the lines in order.', 'Gợi ý 3 (sau 60 phút): trong checkDelegation, dựng mọi danh sách trước (NS vùng cha, glue, NS vùng con), rồi mới in các dòng theo thứ tự.'],
  ],
  loi: [
    ['Not sorting the NS lists: dig returns them in any order and the comparison flips at random.', 'Không sắp xếp danh sách NS: dig trả theo thứ tự bất kỳ và phép so đổi kết quả ngẫu nhiên.'],
    ['Counting a server that did not answer as "serial differs".', 'Coi máy không trả lời là "serial khác".'],
    ['Measuring the switch from the moment the TTL was lowered instead of from the IP change.', 'Đo lần chuyển từ lúc hạ TTL thay vì từ lúc đổi IP.'],
  ],
  gt: ['The chapter in one toolkit. R1 shows that each level knows one level down and that the parent\'s copy of the NS set (172800 s) outlives the child\'s (86400 s) — why incident A hurts for days. R3 turns the TTL rule into a schedule that matches the real change time to the second, and the measured 9 s stays within the 10 s promised. The checker reproduces the real kiem-dns.sh lines of incident A, and dsMatch names incident B in one word: the parent vouches for key 50642 while the zone publishes 30957.', 'Cả chương trong một bộ công cụ. R1 cho thấy mỗi cấp biết một cấp bên dưới và bản NS của vùng cha (172800 s) sống lâu hơn bản của vùng con (86400 s) — vì sao sự cố A gây hại nhiều ngày. R3 biến quy tắc TTL thành lịch khớp giờ đổi thật tới từng giây, và 9 s đo được nằm trong 10 s đã hứa. Bộ kiểm tái hiện đúng các dòng kiem-dns.sh thật của sự cố A, và dsMatch gọi tên sự cố B trong một chữ: vùng cha bảo lãnh khoá 50642 trong khi vùng công bố 30957.'],
  kn: ['delegation', 'TTL planning', 'negative caching', 'DNS monitoring', 'DNSSEC DS'],
  tns: [tn('delegation map', 'bản đồ ủy quyền'), tn('KSK rollover', 'đổi khoá ký khoá'), tn('glue', 'địa chỉ máy chủ tên ở vùng cha'), tn('monitoring check', 'phép kiểm giám sát')],
  dau: `/**
 * Lab 3 — LabFlow's DNS. Six functions, graded separately (see the brief).
 * Helpers are welcome: paste your code from exercises 3.1–3.5.
 */
function delegationMap(traceText) {
  // ⇒ { levels: [{ zone, ttl, servers, from, ms }], answer: { from, records } | null }
  return { levels: [], answer: null };
}

function ttlPlan(o) {
  // ⇒ { changeAt, worstStale, ok, keepOldUntil }
  return { changeAt: o.lowerAt, worstStale: o.newTtl, ok: true, keepOldUntil: o.lowerAt };
}

function measureSwitch(pollText, changeAt, newIp) {
  // ⇒ { lastOld, firstNew, delayS }
  return { lastOld: null, firstNew: null, delayS: null };
}

function negativeWait(soaLine, queriedAt, createdAt) {
  // ⇒ { negTtl, visibleFrom }
  return { negTtl: 0, visibleFrom: createdAt };
}

function checkDelegation(d) {
  // ⇒ ["[OK]   delegation at the parent: …", …]
  return [];
}

function dsMatch(parentText, publishedText) {
  // ⇒ { match, reason, parent, published }
  return { match: false, reason: 'key tag differs', parent: [], published: [] };
}
`,
  giai: '// Reference solution\n' + nguon(delegationMap, 'var hms = ' + hms.toString() + ';', 'var fmt = ' + fmt.toString() + ';', ttlPlan, measureSwitch, negativeWait, checkDelegation, dsMatch),
  cases: [
    // f1
    { goi: goi('delegationMap', J(TRACE)), nhom: 'f1', moTa: ['delegationMap(the real R1 trace of www.labflow.test)', 'delegationMap(trace R1 thật của www.labflow.test)'] },
    { goi: `${goi('delegationMap', J(TRACE))}.levels.map(function (l) { return l.zone + ' ' + l.ttl; })`, nhom: 'f1', moTa: ['The four levels and their TTLs', 'Bốn cấp và TTL của chúng'] },
    { goi: goi('delegationMap', J(TRACE_STATIC)), nhom: 'f1', an: true, moTa: ['Hidden: the real, cut static.labflow.test trace (first block has no records)', 'Ẩn: trace static.labflow.test thật đã bị cắt (khối đầu không có bản ghi)'] },
    { goi: goi('delegationMap', J(TRACE_CT)), nhom: 'f1', an: true, moTa: ['Hidden: the real Internet — cuongthai.com from the root', 'Ẩn: Internet thật — cuongthai.com từ máy chủ gốc'] },
    { goi: goi('delegationMap', J(TRACE_OLD)), nhom: 'f1', an: true, moTa: ['Hidden: the expired domain — the TLD answers with its SOA', 'Ẩn: tên miền hết hạn — TLD trả lời bằng SOA của nó'] },
    // f2
    { goi: goi('ttlPlan', R3_PLAN), nhom: 'f2', moTa: ['ttlPlan — the real R3 numbers', 'ttlPlan — các số R3 thật'] },
    { goi: goi('measureSwitch', POLLS_R3, R3DOI, '203.0.113.11'), nhom: 'f2', moTa: ['measureSwitch — the real R3 poll', 'measureSwitch — lượt hỏi R3 thật'] },
    { goi: goi('negativeWait', SOA_LAB, '17:05:00', '17:06:10'), nhom: 'f2', moTa: ['negativeWait — status.labflow.test asked 70 s before it was created', 'negativeWait — status.labflow.test bị hỏi 70 s trước khi tạo'] },
    { goi: goi('measureSwitch', POLLS_33, '16:11:02', '203.0.113.11'), nhom: 'f2', an: true, moTa: ['Hidden: the wrong-order move of lesson 3.3 (real)', 'Ẩn: lần chuyển sai thứ tự của bài 3.3 (thật)'] },
    { goi: goi('ttlPlan', { oldTtl: 3600, newTtl: 60, maxStale: 30, lowerAt: '21:30:00' }), nhom: 'f2', an: true },
    { goi: goi('measureSwitch', POLLS_R3, R3DOI, '203.0.113.99'), nhom: 'f2', an: true },
    { goi: goi('negativeWait', 'cuongthai.com. 1800 IN SOA kyrie.ns.cloudflare.com. dns.cloudflare.com. 2418592525 10000 2400 604800 1800', '09:00:00', '09:00:30'), nhom: 'f2', an: true },
    { goi: goi('negativeWait', SOA_LAB, '17:10:00', '17:06:10'), nhom: 'f2', an: true },
    { goi: goi('negativeWait', SOA_LAB, '17:00:00', '17:20:00'), nhom: 'f2', an: true },
    // f3
    { goi: goi('checkDelegation', { parent: J(R4_PARENT), child: J(R4_CHILD), serials: SERIALS_R4 }), nhom: 'f3', moTa: ['Incident A — the real R4 inputs (same lines as kiem-dns.sh)', 'Sự cố A — đầu vào R4 thật (cùng các dòng kiem-dns.sh)'] },
    { goi: goi('checkDelegation', { parent: PARENT_OK, child: 'ns2.labflow.test.\nns1.labflow.test.', serials: { '203.0.113.53': '2026110104', '203.0.113.54': '2026110104' } }), nhom: 'f3', an: true, moTa: ['Hidden: after the fix (values of lab3-r4-ok)', 'Ẩn: sau khi sửa (giá trị của lab3-r4-ok)'] },
    { goi: goi('checkDelegation', { parent: PARENT_OK, child: 'ns1.labflow.test.\nns2.labflow.test.', serials: { '203.0.113.53': '2026110102', '203.0.113.54': '2026110101' } }), nhom: 'f3', an: true, moTa: ['Hidden: ns2 kept an old serial (constructed)', 'Ẩn: ns2 giữ serial cũ (dựng)'] },
    { goi: goi('checkDelegation', { parent: PARENT_3, child: 'ns1.labflow.test.\nns2.labflow.test.', serials: { '203.0.113.53': '2026110105', '203.0.113.54': '2026110105' } }), nhom: 'f3', an: true, moTa: ['Hidden: a third name server outside the zone, no glue (constructed)', 'Ẩn: máy chủ tên thứ ba ngoài vùng, không có glue (dựng)'] },
    { goi: goi('checkDelegation', { parent: J(R4_PARENT), child: J(R4_CHILD), serials: { '203.0.113.53': null, '203.0.113.55': null } }), nhom: 'f3', an: true },
    // f4
    { goi: goi('dsMatch', J(R5_PARENT), J(R5_PUB)), nhom: 'f4', moTa: ['Incident B — the real R5 DS lines', 'Sự cố B — các dòng DS R5 thật'] },
    { goi: goi('dsMatch', J(CH_DS), J(CH_PUB)), nhom: 'f4', moTa: ['The healthy chain of lesson 3.5 (digest split by a space)', 'Chuỗi lành của bài 3.5 (digest bị tách bằng dấu cách)'] },
    { goi: goi('dsMatch', J(R5_SAU), J(R5_PUB)), nhom: 'f4', an: true, moTa: ['Hidden: the parent after the fix (real)', 'Ẩn: vùng cha sau khi sửa (thật)'] },
    { goi: goi('dsMatch', DS_ROLL, J(R5_PUB)), nhom: 'f4', an: true, moTa: ['Hidden: a correct rollover, old and new DS together (constructed)', 'Ẩn: đổi khoá đúng cách, DS cũ và mới cùng lúc (dựng)'] },
    { goi: goi('dsMatch', DS_DIGEST, J(R5_PUB)), nhom: 'f4', an: true },
    { goi: goi('dsMatch', '', J(R5_PUB)), nhom: 'f4', an: true },
  ],
  viDu: [{ input: `dsMatch(r5Parent, r5Published)   // incident B, real lines|||dsMatch(r5Parent, r5Published)   // sự cố B, dòng thật`, output: JSON.stringify({ match: false, reason: 'key tag differs' }) + ' …', explanation: 'The TLD still publishes the DS of the old key (50642); the zone now signs with 30957 — validators find no key matching the DS and answer SERVFAIL (EDE 6).|||TLD vẫn công bố DS của khoá cũ (50642); vùng giờ ký bằng 30957 — bộ kiểm không tìm thấy khoá khớp DS và trả SERVFAIL (EDE 6).' }],
});

export default doiDau({ slug: 'netdev-3-6-lab-dns-labflow', ten: 'Lab 3 — LabFlow’s DNS: audit, a server move and two incidents', khoa: KHOA, baiHoc: 'netdev-3-6-lab-dns-labflow', de: [LAB] });
