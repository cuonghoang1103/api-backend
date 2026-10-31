/**
 * Networking for Developers · LAB chương 1 — "Mổ xẻ một request của LabFlow" (bài netdev-1-6-lab-giai-phau-request, R2 + R3 của
 * content/courses/networking-for-developers/bai/015-lab1.mjs). Người học viết dissect() từ byte thô của HAI bản bắt thật ở hai phía router.
 */
import { doiDau, KHOA, bi, tn, jsBai, nguon, goi, hexDump, sauLenh, inX, dungFrame, tsOpt, tuHex } from './_net.mjs';

const HC = hexDump('c13-hop-client');   // thật — phía LAN, máy client
const HW = hexDump('c13-hop-web');      // thật — phía DMZ, máy web, cùng request đó
const HX = hexDump('c12-goi');          // thật — một request KHÁC (bài 1.3)
const FC = sauLenh('c13-hop-client', 'tshark -r /tmp/h.pcap -Y http.request -T fields');
const FW = sauLenh('c13-hop-web', 'tshark -r /tmp/h.pcap -Y');

/* ─────────────── lời giải tham chiếu ─────────────── */
function hexToBytes(text) {
  // Only the hex columns (characters 6–52) of lines that start with a 4-digit offset; the ASCII column is ignored.
  var bytes = [];
  text.split('\n').forEach(function (line) {
    if (!/^[0-9a-f]{4}  /.test(line)) return;
    line.slice(6, 53).trim().split(/\s+/).forEach(function (x) { if (x) bytes.push(parseInt(x, 16)); });
  });
  return bytes;
}

function parseLayers(b) {
  function hex(n, digits) { var s = n.toString(16); while (s.length < digits) s = '0' + s; return s; }
  function mac(i) { return b.slice(i, i + 6).map(function (x) { return hex(x, 2); }).join(':'); }
  function u16(i) { return b[i] * 256 + b[i + 1]; }
  function u32(i) { return ((b[i] * 256 + b[i + 1]) * 256 + b[i + 2]) * 256 + b[i + 3]; }
  function ip(i) { return b.slice(i, i + 4).join('.'); }
  var layers = [{ layer: 'Ethernet', start: 0, end: 13, fields: { dst: mac(0), src: mac(6), type: '0x' + hex(u16(12), 4) } }];
  // IPv4 at 14. Its header length is the low 4 bits of byte 14 (× 4 bytes).
  var I = 14, ihl = (b[I] & 15) * 4;
  // Checksum check: the one's-complement sum of all 16-bit words of a correct header is 0xffff.
  var sum = 0;
  for (var k = I; k < I + ihl; k += 2) sum += u16(k);
  while (sum > 0xffff) sum = (sum & 0xffff) + Math.floor(sum / 65536);
  var totalLen = u16(I + 2);
  layers.push({ layer: 'IPv4', start: I, end: I + ihl - 1, fields: {
    headerLen: ihl, totalLen: totalLen, id: '0x' + hex(u16(I + 4), 4), ttl: b[I + 8], protocol: b[I + 9],
    checksum: '0x' + hex(u16(I + 10), 4), checksumOk: sum === 0xffff, src: ip(I + 12), dst: ip(I + 16),
  } });
  // TCP right after the IP header. Its header length is the high 4 bits of TCP byte 12 (× 4 bytes).
  var T = I + ihl, thl = (b[T + 12] >> 4) * 4;
  var names = ['FIN', 'SYN', 'RST', 'PSH', 'ACK', 'URG', 'ECE', 'CWR'];
  layers.push({ layer: 'TCP', start: T, end: T + thl - 1, fields: {
    srcPort: u16(T), dstPort: u16(T + 2), seq: u32(T + 4), ack: u32(T + 8), headerLen: thl,
    flags: names.filter(function (_, i) { return (b[T + 13] >> i) & 1; }),
  } });
  // The data ends where the IP packet ends (I + totalLen), not where the frame ends: short frames carry padding.
  var D = T + thl, end = I + totalLen;
  if (end > D) {
    var text = b.slice(D, end).map(function (x) { return String.fromCharCode(x); }).join('');
    var lines = text.split('\r\n');
    var host = null;
    lines.slice(1).forEach(function (l) { var m = /^host:\s*(.*)$/i.exec(l); if (m && host === null) host = m[1]; });
    layers.push({ layer: 'HTTP', start: D, end: end - 1, fields: { requestLine: lines[0], host: host, bytes: end - D } });
  }
  return layers;
}

var COMPARE = [
  ['eth.dst', 'Ethernet', 'dst'], ['eth.src', 'Ethernet', 'src'],
  ['ip.len', 'IPv4', 'totalLen'], ['ip.id', 'IPv4', 'id'], ['ip.ttl', 'IPv4', 'ttl'], ['ip.checksum', 'IPv4', 'checksum'],
  ['ip.src', 'IPv4', 'src'], ['ip.dst', 'IPv4', 'dst'],
  ['tcp.srcport', 'TCP', 'srcPort'], ['tcp.dstport', 'TCP', 'dstPort'], ['tcp.seq', 'TCP', 'seq'], ['tcp.ack', 'TCP', 'ack'], ['tcp.flags', 'TCP', 'flags'],
  ['http.request_line', 'HTTP', 'requestLine'], ['http.host', 'HTTP', 'host'],
];
function compareFrames(a, b) {
  // Value of one field in a layer list; a missing layer (no HTTP data) counts as null. Arrays (flags) compare as text.
  function value(layers, name, field) {
    var l = layers.filter(function (x) { return x.layer === name; })[0];
    var v = l ? l.fields[field] : null;
    return Array.isArray(v) ? v.join(',') : (v === undefined ? null : v);
  }
  var sameFields = [], changedFields = [];
  COMPARE.forEach(function (c) {
    (value(a, c[1], c[2]) === value(b, c[1], c[2]) ? sameFields : changedFields).push(c[0]);
  });
  return { sameFields: sameFields, changedFields: changedFields };
}

function dissect(textA, textB) {
  var a = parseLayers(hexToBytes(textA)), b = parseLayers(hexToBytes(textB));
  var cmp = compareFrames(a, b);
  function has(f) { return cmp.changedFields.indexOf(f) >= 0; }
  var hops = a[1].fields.ttl - b[1].fields.ttl;
  var verdict;
  if (has('ip.id') || has('tcp.seq') || has('http.request_line')) verdict = 'different-packet';
  else if (has('ip.src') || has('ip.dst') || has('tcp.srcport') || has('tcp.dstport')) verdict = 'nat';
  else if (hops > 0) verdict = 'routed';
  else verdict = 'same-link';
  return { layers: a, sameFields: cmp.sameFields, changedFields: cmp.changedFields, hops: hops, verdict: verdict };
}

/* ─────────────── dữ liệu cho ca ẩn: frame DỰNG (ghi rõ trong đề) ─────────────── */
const B_HC = tuHex(HC);
const TS_HC = B_HC.slice(54, 66);   // option timestamp thật của request
const REQ = 'GET /api/hello HTTP/1.1\r\nHost: 10.10.2.10\r\nUser-Agent: curl/8.18.0\r\nAccept: */*\r\n\r\n';
const goc = { id: 0x4ae5, srcIp: '10.10.1.10', dstIp: '10.10.2.10', srcPort: 37070, dstPort: 80, seq: 1782733281, ack: (B_HC[42] * 2 ** 24) + (B_HC[43] << 16) + (B_HC[44] << 8) + B_HC[45], flags: 0x18, window: 63, tcpOptions: TS_HC, payload: REQ };
// (1) cùng request sau HAI router (tới một mạng thứ ba giả định): TTL 62, MAC của đường thứ ba.
const H2 = inX(dungFrame({ ...goc, ttl: 62, srcMac: '02:00:0a:0a:03:fe', dstMac: '02:00:0a:0a:03:0a' }));
// (2) trước / sau một router NAT (Chương 2): IP nguồn và cổng nguồn bị thay — trường hợp DUY NHẤT IP thật sự đổi.
const natA = { id: 0x5c01, srcIp: '10.10.1.10', dstIp: '203.0.113.10', srcPort: 41000, dstPort: 80, seq: 1000, ack: 2000, flags: 0x18, window: 63, tcpOptions: tsOpt(5000, 6000), payload: 'GET / HTTP/1.1\r\nHost: shop.example\r\n\r\n' };
const N0 = inX(dungFrame({ ...natA, ttl: 64, srcMac: '02:00:0a:0a:01:0a', dstMac: '02:00:0a:0a:01:fe' }));
const N1 = inX(dungFrame({ ...natA, ttl: 63, srcIp: '198.51.100.7', srcPort: 61001, srcMac: '02:00:0a:0a:09:fe', dstMac: '02:00:0a:0a:09:01' }));
// (3) hai ACK trần (không có dữ liệu HTTP), một bị đệm tới 60 byte như máy nhận thấy.
const ackA = { id: 0x0102, srcIp: '10.10.1.11', dstIp: '10.10.2.10', srcPort: 38458, dstPort: 80, seq: 500, ack: 900, flags: 0x10, window: 502 };
const A0 = inX(dungFrame({ ...ackA, ttl: 64, srcMac: '02:00:0a:0a:01:0b', dstMac: '02:00:0a:0a:01:fe' }));
const A1 = inX(dungFrame({ ...ackA, ttl: 63, srcMac: '02:00:0a:0a:02:fe', dstMac: '02:00:0a:0a:02:0a', padTo: 60 }));
// (4) frame hỏng: TTL bị sửa mà checksum giữ nguyên (checksumOk phải là false).
const B_BAD = [...B_HC]; B_BAD[22] = 0x3e;
// (5) request có 4 byte option IP và header Host viết thường.
const OPT = dungFrame({ ...goc, id: 0x7a01, ttl: 64, srcIp: '10.10.1.11', srcPort: 51000, dstIp: '10.10.2.20', dstPort: 3000, srcMac: '02:00:0a:0a:01:0b', dstMac: '02:00:0a:0a:01:fe', ipOptions: [0x94, 0x04, 0x00, 0x00], payload: 'GET /api/lab1 HTTP/1.1\r\nhost: 10.10.2.20:3000\r\nX-Trace: ab cd ef 01\r\n\r\n' });

const L = (t) => parseLayers(hexToBytes(t));
const ma = (t) => JSON.stringify(t);

const LAB = jsBai({
  ten: 'Lab 1 — Dissect one request of LabFlow', kho: 'HARD', phut: 120, diem: 60, dangBai: 'lab',
  en: '<p>See the brief.</p>', vi: '<p>Xem đề.</p>',
  banIn: {
    tieuDe: bi('Lab 1 — Dissect one request of LabFlow', 'Lab 1 — Mổ xẻ một request của LabFlow'),
    phu: bi('Chapter 1 lab · course project part 1 · JavaScript, graded in the browser · 10 marks', 'Lab chương 1 · phần 1 của dự án khoá · JavaScript, chấm trong trình duyệt · 10 điểm'),
    moTa: bi(`<p><b>Situation.</b> At Monday's stand-up a teammate says: <i>"Our router rewrites the client's IP address — that's why the API sees 10.10.2.10."</i> Your lead wants evidence, not opinions. You captured the same request <code>curl -s http://10.10.2.10/api/hello</code> at the same moment on both sides of the router (lesson 1.4): on the client (LAN) and on the web server (DMZ). In the lesson lab (R2, R3) you read those captures by hand; here you write the code that does it from the raw bytes, so the next argument can be settled in one call.</p>
<p>tshark's own summary of the two frames, for reference:</p><pre>${['# LAN side', ...FC, '', '# DMZ side', ...FW].join('\n')}</pre>
<p>Your program must reach the same conclusion from the bytes alone — and must still give the right answer for captures it has never seen (hidden cases: another real request, frames built for this lab with IP options, padding, two routers, a NAT router, a corrupted checksum).</p>`,
    `<p><b>Tình huống.</b> Trong buổi stand-up sáng thứ Hai, một bạn nói: <i>"Router của mình viết lại IP của client — vì thế API thấy 10.10.2.10."</i> Trưởng nhóm cần bằng chứng, không cần ý kiến. Bạn đã bắt cùng một request <code>curl -s http://10.10.2.10/api/hello</code> vào cùng một lúc ở hai phía router (bài 1.4): trên client (LAN) và trên web server (DMZ). Trong lab của bài (R2, R3) bạn đọc tay hai bản bắt đó; ở đây bạn viết code làm việc ấy từ byte thô, để lần tranh cãi sau được phân xử bằng một lần gọi hàm.</p>
<p>Bản tóm tắt của chính tshark cho hai frame, để tham khảo:</p><pre>${['# phía LAN', ...FC, '', '# phía DMZ', ...FW].join('\n')}</pre>
<p>Chương trình của bạn phải ra cùng kết luận chỉ từ các byte — và vẫn phải đúng với bản bắt nó chưa từng thấy (ca ẩn: một request thật khác, các frame dựng cho lab này có option IP, byte đệm, hai router, router NAT, checksum hỏng).</p>`),
    chucNangChinh: [
      bi('<code>hexToBytes(text)</code> — the tshark -x text ⇒ an array of byte values.', '<code>hexToBytes(text)</code> — chữ tshark -x ⇒ mảng giá trị byte.'),
      bi('<code>parseLayers(bytes)</code> — the bytes ⇒ a list of layers with their byte ranges and fields.', '<code>parseLayers(bytes)</code> — các byte ⇒ danh sách tầng kèm khoảng byte và các trường.'),
      bi('<code>compareFrames(layersA, layersB)</code> — which fields stayed the same, which changed.', '<code>compareFrames(layersA, layersB)</code> — trường nào giữ nguyên, trường nào đổi.'),
      bi('<code>dissect(textA, textB)</code> — the full report with the number of routers and a verdict.', '<code>dissect(textA, textB)</code> — báo cáo đầy đủ với số router đã qua và kết luận.'),
    ],
    yeuCauChung: [
      bi('One file, <code>answer.js</code>, with the four functions at top level (the grader calls each one directly).', 'Một tệp <code>answer.js</code>, bốn hàm ở cấp cao nhất (máy chấm gọi trực tiếp từng hàm).'),
      bi('Plain JavaScript, no libraries, no TextDecoder/Buffer needed. Return values, do not print.', 'JavaScript thuần, không thư viện, không cần TextDecoder/Buffer. Trả về giá trị, đừng in.'),
      bi('Never use fixed offsets past byte 14: every later position comes from a length field in the packet.', 'Không dùng offset cố định sau byte 14: mọi vị trí phía sau đều lấy từ một trường độ dài trong gói.'),
      bi('Each function is graded on its own inputs, so a mistake in one does not cost the others.', 'Mỗi hàm được chấm bằng đầu vào riêng, nên lỗi ở hàm này không làm mất điểm hàm khác.'),
    ],
    tieuDeCay: bi('Files', 'Tệp'),
    cayThuMuc: 'answer.js        hexToBytes · parseLayers · compareFrames · dissect',
    moHinh: [
      { ten: 'Layer (one element of the parseLayers result)', truong: [
        ['layer', 'string', bi('"Ethernet", "IPv4", "TCP" or "HTTP" — in this order; "HTTP" only when the packet carries data', '"Ethernet", "IPv4", "TCP" hoặc "HTTP" — theo thứ tự này; chỉ có "HTTP" khi gói chở dữ liệu')],
        ['start, end', 'number', bi('first and last byte offset of the layer, both included (Ethernet 0–13)', 'offset byte đầu và cuối của tầng, tính cả hai (Ethernet 0–13)')],
        ['fields (Ethernet)', 'object', bi('{ dst, src, type } — MACs lower-case with colons, type "0x0800"', '{ dst, src, type } — MAC chữ thường có dấu hai chấm, type "0x0800"')],
        ['fields (IPv4)', 'object', bi('{ headerLen, totalLen, id, ttl, protocol, checksum, checksumOk, src, dst } — id and checksum as "0x" + 4 hex digits; checksumOk = the header checksum verifies', '{ headerLen, totalLen, id, ttl, protocol, checksum, checksumOk, src, dst } — id và checksum dạng "0x" + 4 chữ số hex; checksumOk = checksum header kiểm lại đúng')],
        ['fields (TCP)', 'object', bi('{ srcPort, dstPort, seq, ack, headerLen, flags } — seq/ack raw 32-bit numbers; flags as in exercise 1.3 (FIN, SYN, RST, PSH, ACK, URG, ECE, CWR from bit 0 up)', '{ srcPort, dstPort, seq, ack, headerLen, flags } — seq/ack là số 32 bit thô; flags như bài 1.3 (FIN, SYN, RST, PSH, ACK, URG, ECE, CWR từ bit 0 lên)')],
        ['fields (HTTP)', 'object', bi('{ requestLine, host, bytes } — the text before the first CRLF; the value of the first Host header (any case), or null; the number of data bytes', '{ requestLine, host, bytes } — chữ trước CRLF đầu tiên; giá trị header Host đầu tiên (hoa thường đều được), hoặc null; số byte dữ liệu')],
      ] },
      { ten: 'Report (the dissect result)', truong: [
        ['layers', 'Layer[]', bi('parseLayers of the FIRST capture', 'parseLayers của bản bắt THỨ NHẤT')],
        ['sameFields, changedFields', 'string[]', bi('the 15 compared fields, split in two, each list in the order of the table in feature 3', '15 trường được so, chia làm hai, mỗi danh sách theo thứ tự bảng ở chức năng 3')],
        ['hops', 'number', bi('TTL of capture A − TTL of capture B (routers between the two capture points)', 'TTL bản A − TTL bản B (số router giữa hai điểm bắt)')],
        ['verdict', 'string', bi('"different-packet" | "nat" | "routed" | "same-link" — rules in feature 4', '"different-packet" | "nat" | "routed" | "same-link" — luật ở chức năng 4')],
      ] },
    ],
    duLieuMau: `# A — LAN side, lab/out/c13-hop-client (real)\n${HC}\n\n# B — DMZ side, lab/out/c13-hop-web (real)\n${HW}`,
    chucNang: [
      { ten: bi('hexToBytes(text)', 'hexToBytes(text)'), diem: 1.5,
        moTa: bi('Turn the text printed by <code>tshark -x</code> into an array of numbers 0–255.', 'Đổi chữ do <code>tshark -x</code> in ra thành mảng số 0–255.'),
        yeuCau: [
          bi('Use only lines that start with four hex digits and two spaces; take characters 6–52 (the 16 hex columns) and ignore the ASCII column, which can contain anything — even text like "ab cd ef".', 'Chỉ dùng dòng bắt đầu bằng bốn chữ số hex và hai dấu cách; lấy ký tự 6–52 (16 cột hex) và bỏ cột ASCII, vốn có thể chứa bất cứ gì — kể cả chữ như "ab cd ef".'),
          bi('The two sample captures give 149 bytes each; the last line holds only 5 bytes.', 'Hai bản bắt mẫu cho mỗi bản 149 byte; dòng cuối chỉ có 5 byte.'),
        ],
        viDu: 'hexToBytes(A).length            ⇒ 149\nhexToBytes(A).slice(12, 16)     ⇒ [8, 0, 69, 0]' },
      { ten: bi('parseLayers(bytes)', 'parseLayers(bytes)'), diem: 3,
        moTa: bi('Split the frame into its layers, following the length fields — this is R2 of the lesson lab.', 'Tách frame thành các tầng, đi theo các trường độ dài — đây là R2 của lab trong bài.'),
        yeuCau: [
          bi('Ethernet is bytes 0–13. IPv4 starts at 14 and is <code>(byte14 &amp; 15) × 4</code> long; TCP starts right after it and is <code>(TCP byte 12 &gt;&gt; 4) × 4</code> long.', 'Ethernet là byte 0–13. IPv4 bắt đầu ở 14 và dài <code>(byte14 &amp; 15) × 4</code>; TCP bắt đầu ngay sau và dài <code>(byte 12 của TCP &gt;&gt; 4) × 4</code>.'),
          bi('The data runs from the end of the TCP header to <code>14 + totalLen − 1</code>; bytes after that are Ethernet padding. No data ⇒ no "HTTP" layer.', 'Dữ liệu chạy từ cuối header TCP tới <code>14 + totalLen − 1</code>; byte sau đó là đệm Ethernet. Không có dữ liệu ⇒ không có tầng "HTTP".'),
          bi('<code>checksumOk</code>: add the header as 16-bit big-endian words, fold the carries back in (while sum &gt; 0xffff: sum = low 16 bits + the rest); a correct header gives 0xffff.', '<code>checksumOk</code>: cộng header thành các từ 16 bit big-endian, gập phần nhớ vào (khi sum &gt; 0xffff: sum = 16 bit thấp + phần còn lại); header đúng cho 0xffff.'),
        ],
        viDu: 'parseLayers(hexToBytes(A)).map(l => l.layer + " " + l.start + "-" + l.end)\n⇒ ["Ethernet 0-13", "IPv4 14-33", "TCP 34-65", "HTTP 66-148"]' },
      { ten: bi('compareFrames(layersA, layersB)', 'compareFrames(layersA, layersB)'), diem: 2.5,
        moTa: bi('Compare two parseLayers results field by field — this is R3 of the lesson lab. The 15 fields, in this order:<br><code>eth.dst eth.src ip.len ip.id ip.ttl ip.checksum ip.src ip.dst tcp.srcport tcp.dstport tcp.seq tcp.ack tcp.flags http.request_line http.host</code>', 'So hai kết quả parseLayers theo từng trường — đây là R3 của lab trong bài. 15 trường, theo thứ tự:<br><code>eth.dst eth.src ip.len ip.id ip.ttl ip.checksum ip.src ip.dst tcp.srcport tcp.dstport tcp.seq tcp.ack tcp.flags http.request_line http.host</code>'),
        yeuCau: [
          bi('They map to Ethernet dst/src, IPv4 totalLen/id/ttl/checksum/src/dst, TCP srcPort/dstPort/seq/ack/flags and HTTP requestLine/host.', 'Chúng ứng với Ethernet dst/src, IPv4 totalLen/id/ttl/checksum/src/dst, TCP srcPort/dstPort/seq/ack/flags và HTTP requestLine/host.'),
          bi('A field of a missing layer (no HTTP data) counts as null; flags compare as lists. Return <code>{ sameFields, changedFields }</code>, both in the order above.', 'Trường của tầng vắng (không có dữ liệu HTTP) tính là null; flags so như danh sách. Trả <code>{ sameFields, changedFields }</code>, cả hai theo thứ tự trên.'),
        ],
        viDu: 'compareFrames(L(A), L(B)).changedFields\n⇒ ["eth.dst", "eth.src", "ip.ttl", "ip.checksum"]' },
      { ten: bi('dissect(textA, textB) and the verdict', 'dissect(textA, textB) và kết luận'), diem: 3,
        moTa: bi('Put it together: <code>{ layers, sameFields, changedFields, hops, verdict }</code> where <code>layers</code> is the dissection of capture A and <code>hops</code> = TTL A − TTL B.', 'Ghép lại: <code>{ layers, sameFields, changedFields, hops, verdict }</code> với <code>layers</code> là kết quả mổ xẻ bản A và <code>hops</code> = TTL A − TTL B.'),
        yeuCau: [
          bi('<code>"different-packet"</code> if ip.id, tcp.seq or http.request_line changed — the two captures are not the same packet, nothing can be concluded.', '<code>"different-packet"</code> nếu ip.id, tcp.seq hoặc http.request_line đổi — hai bản bắt không phải cùng một gói, không kết luận được gì.'),
          bi('Otherwise <code>"nat"</code> if ip.src, ip.dst, tcp.srcport or tcp.dstport changed — the claim would be true (Chapter 2).', 'Ngược lại <code>"nat"</code> nếu ip.src, ip.dst, tcp.srcport hoặc tcp.dstport đổi — khi đó lời khẳng định đúng (Chương 2).'),
          bi('Otherwise <code>"routed"</code> if hops &gt; 0 — the packet crossed routers that rewrote only the frame, the TTL and the checksum.', 'Ngược lại <code>"routed"</code> nếu hops &gt; 0 — gói đi qua router và chỉ frame, TTL và checksum bị viết lại.'),
          bi('Otherwise <code>"same-link"</code>.', 'Còn lại <code>"same-link"</code>.'),
        ],
        viDu: 'dissect(A, B).hops    ⇒ 1\ndissect(A, B).verdict ⇒ "routed"   (the teammate\'s claim is false)' },
    ],
    truDiem: [
      bi('Fixed offsets (TCP at 34, data at 66): the hidden frame with IP options breaks.', 'Offset cố định (TCP ở 34, dữ liệu ở 66): frame ẩn có option IP sẽ hỏng.'),
      bi('Data length from the frame size: the padded ACK then "carries" 6 bytes.', 'Độ dài dữ liệu tính từ kích thước frame: ACK được đệm khi đó "chở" 6 byte.'),
      bi('Verdict "nat" because ip.checksum changed: the checksum changes whenever the TTL does.', 'Kết luận "nat" vì ip.checksum đổi: checksum đổi mỗi khi TTL đổi.'),
    ],
    nopBai: bi('Press Submit. Every feature is graded by its own checks (visible ones on Run, hidden ones on Submit); the rubric above shows the marks per feature. Then write the verdict for your lead in two sentences, quoting changedFields as the evidence.', 'Bấm Nộp. Mỗi chức năng được chấm bằng các kiểm riêng (kiểm hiện khi Chạy thử, kiểm ẩn khi Nộp); thang điểm ở trên cho điểm từng chức năng. Sau đó viết kết luận cho trưởng nhóm trong hai câu, trích changedFields làm bằng chứng.'),
  },
  goiY: [
    ['Hint 1 (after 15 minutes): do hexToBytes first and check the length is 149. Then write tiny helpers u16(i), u32(i), mac(i), ip(i) — every field is one of them.', 'Gợi ý 1 (sau 15 phút): làm hexToBytes trước và kiểm độ dài là 149. Rồi viết các hàm nhỏ u16(i), u32(i), mac(i), ip(i) — trường nào cũng là một trong số đó.'],
    ['Hint 2 (after 30 minutes): compute positions, never hard-code them: I = 14, T = I + ihl, D = T + thl, end = I + totalLen. u32 must stay positive: multiply by 256 instead of shifting by 24.', 'Gợi ý 2 (sau 30 phút): tính vị trí, đừng bao giờ gán cứng: I = 14, T = I + ihl, D = T + thl, end = I + totalLen. u32 phải luôn dương: nhân 256 thay vì dịch 24 bit.'],
    ['Hint 3 (after 45 minutes): for compareFrames write value(layers, layerName, fieldName) that returns null for a missing layer and joins arrays; then one loop over the 15-field table. For the verdict, check the rules in the order given — "different-packet" first.', 'Gợi ý 3 (sau 45 phút): với compareFrames viết value(layers, tênTầng, tênTrường) trả null cho tầng vắng và nối mảng; rồi một vòng lặp qua bảng 15 trường. Với kết luận, xét luật theo đúng thứ tự — "different-packet" trước.'],
  ],
  loi: [
    ['Parsing the ASCII column as hex: the request with "X-Trace: ab cd ef 01" then has extra bytes and every later field shifts.', 'Đọc cột ASCII như hex: request có "X-Trace: ab cd ef 01" khi đó thừa byte và mọi trường phía sau bị lệch.'],
    ['Computing seq with (b[i] << 24): for bytes ≥ 0x80 the result is negative in JavaScript.', 'Tính seq bằng (b[i] << 24): với byte ≥ 0x80 kết quả bị âm trong JavaScript.'],
    ['Concluding "the router changed the IP" because ip.checksum is in changedFields — it is recomputed because the TTL changed.', 'Kết luận "router đổi IP" vì ip.checksum nằm trong changedFields — nó được tính lại vì TTL đổi.'],
  ],
  gt: ['The packet describes itself: every header carries the length that tells you where the next one starts, and the IP total length tells you where the data ends, so the same code reads a 149-byte request, a padded ACK and a frame with IP options. On the two real captures exactly four fields change — both MACs (a new frame for the DMZ link), the TTL (64 → 63, so hops = 1) and the IP checksum (recomputed because the TTL changed) — while the IP addresses, the ports, the sequence numbers and the HTTP request line are identical: verdict "routed", the claim is false. The API sees 10.10.2.10 because nginx opened a second connection to it (R5 of the lesson lab; nginx before 1.29.7 — the lab runs 1.28.3 — proxies with HTTP/1.0 and Connection: close). Only a NAT router really rewrites ip.src, which the constructed NAT pair shows.', 'Gói tự mô tả chính nó: mỗi header mang độ dài cho biết header kế tiếp bắt đầu ở đâu, và tổng độ dài IP cho biết dữ liệu kết thúc ở đâu, nên cùng một đoạn code đọc được request 149 byte, ACK có đệm và frame có option IP. Ở hai bản bắt thật đúng bốn trường đổi — hai MAC (frame mới cho đường DMZ), TTL (64 → 63, nên hops = 1) và checksum IP (tính lại vì TTL đổi) — còn địa chỉ IP, cổng, số thứ tự và dòng request HTTP giống hệt: kết luận "routed", lời khẳng định sai. API thấy 10.10.2.10 vì nginx mở kết nối thứ hai tới nó (R5 của lab trong bài; nginx trước 1.29.7 — lab chạy 1.28.3 — proxy bằng HTTP/1.0 và Connection: close). Chỉ router NAT mới thật sự viết lại ip.src, như cặp NAT dựng cho thấy.'],
  kn: ['packet dissection', 'hop-by-hop rewriting', 'evidence-based debugging'],
  tns: [tn('dissect', 'mổ xẻ (phân tích từng lớp)'), tn('evidence', 'bằng chứng', 'Một lệnh và output thật ủng hộ một khẳng định.'), tn('one\'s complement sum', 'tổng bù một', 'Cách tính checksum của IP: cộng 16 bit, gập phần nhớ.'), tn('NAT', 'dịch địa chỉ mạng'), tn('padding', 'byte đệm')],
  dau: `/**
 * Lab 1 — Dissect one request of LabFlow. Four functions, graded separately (see the brief).
 */
function hexToBytes(text) {
  // tshark -x text ⇒ [2, 0, 10, 10, 1, 254, …]
  return [];
}

function parseLayers(bytes) {
  // ⇒ [{ layer: 'Ethernet', start: 0, end: 13, fields: { dst, src, type } }, { layer: 'IPv4', … }, { layer: 'TCP', … }, { layer: 'HTTP', … }]
  return [];
}

function compareFrames(layersA, layersB) {
  // ⇒ { sameFields: [...], changedFields: [...] } over the 15 fields, in the order of the brief
  return { sameFields: [], changedFields: [] };
}

function dissect(textA, textB) {
  // ⇒ { layers, sameFields, changedFields, hops, verdict }
  return { layers: [], sameFields: [], changedFields: [], hops: 0, verdict: 'same-link' };
}
`,
  giai: '// Reference solution\n' + nguon(hexToBytes, parseLayers, `var COMPARE = ${JSON.stringify(COMPARE).replace(/\],\[/g, '],\n  [').replace(/^\[\[/, '[\n  [').replace(/\]\]$/, '],\n];')}`, compareFrames, dissect),
  cases: [
    // f1
    { goi: `hexToBytes(${ma(HC)}).length`, nhom: 'f1', moTa: ['hexToBytes(A).length — the real LAN-side capture', 'hexToBytes(A).length — bản bắt thật phía LAN'] },
    { goi: `hexToBytes(${ma(HW)}).slice(0, 16)`, nhom: 'f1', moTa: ['hexToBytes(B).slice(0, 16) — the first line of the DMZ capture', 'hexToBytes(B).slice(0, 16) — dòng đầu của bản bắt DMZ'] },
    { goi: `hexToBytes(${ma(HX)}).slice(144)`, nhom: 'f1', an: true, moTa: ['Hidden: the short last line of another real capture', 'Ẩn: dòng cuối ngắn của một bản bắt thật khác'] },
    { goi: `hexToBytes(${ma(inX(OPT))}).length`, nhom: 'f1', an: true, moTa: ['Hidden: an ASCII column that looks like hex (constructed frame)', 'Ẩn: cột ASCII trông như hex (frame dựng)'] },
    // f2
    { goi: `parseLayers(${ma(B_HC)})`, nhom: 'f2', moTa: ['parseLayers(bytes of A) — the real LAN-side frame', 'parseLayers(byte của A) — frame thật phía LAN'] },
    { goi: `parseLayers(${ma(tuHex(HW))})`, nhom: 'f2', an: true, moTa: ['Hidden: the real DMZ-side frame', 'Ẩn: frame thật phía DMZ'] },
    { goi: `parseLayers(${ma(OPT)})`, nhom: 'f2', an: true, moTa: ['Hidden: constructed request with IP options and a lower-case host header', 'Ẩn: request dựng có option IP và header host chữ thường'] },
    { goi: `parseLayers(${ma(tuHex(A1))})`, nhom: 'f2', an: true, moTa: ['Hidden: constructed bare ACK padded to 60 bytes (no HTTP layer)', 'Ẩn: ACK trần dựng, đệm tới 60 byte (không có tầng HTTP)'] },
    { goi: `parseLayers(${ma(B_BAD)})[1].fields.checksumOk`, nhom: 'f2', an: true, moTa: ['Hidden: TTL changed without a new checksum ⇒ checksumOk false', 'Ẩn: TTL đổi mà không tính lại checksum ⇒ checksumOk false'] },
    // f3
    { goi: `compareFrames(${ma(L(HC))}, ${ma(L(HW))})`, nhom: 'f3', moTa: ['compareFrames(A, B) — the two real captures', 'compareFrames(A, B) — hai bản bắt thật'] },
    { goi: `compareFrames(${ma(L(N0))}, ${ma(L(N1))})`, nhom: 'f3', an: true, moTa: ['Hidden: constructed NAT pair', 'Ẩn: cặp NAT dựng'] },
    { goi: `compareFrames(${ma(L(A0))}, ${ma(L(A1))})`, nhom: 'f3', an: true, moTa: ['Hidden: two constructed ACKs without HTTP data', 'Ẩn: hai ACK dựng không có dữ liệu HTTP'] },
    { goi: `compareFrames(${ma(L(HX))}, ${ma(L(HW))})`, nhom: 'f3', an: true, moTa: ['Hidden: two different real requests', 'Ẩn: hai request thật khác nhau'] },
    // f4
    { goi: goi('dissect', HC, HW), nhom: 'f4', moTa: ['dissect(A, B) — the two real captures', 'dissect(A, B) — hai bản bắt thật'] },
    { goi: `dissect(${ma(HC)}, ${ma(H2)}).verdict + " " + dissect(${ma(HC)}, ${ma(H2)}).hops`, nhom: 'f4', an: true, moTa: ['Hidden: the same request after two routers (constructed)', 'Ẩn: cùng request sau hai router (dựng)'] },
    { goi: `dissect(${ma(N0)}, ${ma(N1)}).verdict`, nhom: 'f4', an: true, moTa: ['Hidden: a NAT router (constructed)', 'Ẩn: router NAT (dựng)'] },
    { goi: `dissect(${ma(HX)}, ${ma(HW)}).verdict`, nhom: 'f4', an: true, moTa: ['Hidden: two different real requests', 'Ẩn: hai request thật khác nhau'] },
    { goi: `dissect(${ma(HC)}, ${ma(HC)})`, nhom: 'f4', an: true, moTa: ['Hidden: the same capture twice', 'Ẩn: cùng một bản bắt hai lần'] },
  ],
  viDu: [{ input: 'dissect(A, B)   // A, B = the two real captures in the brief|||dissect(A, B)   // A, B = hai bản bắt thật trong đề', output: JSON.stringify({ hops: 1, verdict: 'routed', changedFields: ['eth.dst', 'eth.src', 'ip.ttl', 'ip.checksum'] }), explanation: 'Only the frame, the TTL and the checksum changed: the router did not touch the IP addresses.|||Chỉ frame, TTL và checksum đổi: router không đụng tới địa chỉ IP.' }],
});

export default doiDau({ slug: 'netdev-1-6-lab-giai-phau-request', ten: 'Lab 1 — Dissect one request of LabFlow', khoa: KHOA, baiHoc: 'netdev-1-6-lab-giai-phau-request', de: [LAB] });
