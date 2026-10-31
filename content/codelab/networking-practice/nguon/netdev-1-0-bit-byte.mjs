/** Networking for Developers · 1.1 — Bit, byte, hex, UTF-8, thứ tự byte mạng, bit/s vs byte/s. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, sauLenh, pre, hexDump } from './_net.mjs';

/* ── 1. Đổi cơ số ── */
const b8 = (n) => n.toString(2).padStart(8, '0');
const h2 = (n) => n.toString(16).padStart(2, '0');
const hangDoi = (n, ghi) => ({ o: { x: `${n}${ghi ? ` (${ghi})` : ''}` }, a: { b: [b8(n), `${b8(n).slice(0, 4)} ${b8(n).slice(4)}`], h: [h2(n), `0x${h2(n)}`] } });
const E1 = cs({
  ten: 'Bytes 1 — Decimal, binary and hex of one byte', kho: 'EASY', phut: 10, loai: 'table',
  en: 'One byte has 8 bit positions with weights 128, 64, 32, 16, 8, 4, 2, 1; four bits are exactly one hex digit. Write each byte as 8 binary digits and as 2 hex digits (lower case). Every value appears in a real capture of this course.',
  vi: 'Một byte có 8 vị trí bit với trọng số 128, 64, 32, 16, 8, 4, 2, 1; bốn bit đúng bằng một chữ số hex. Viết mỗi byte thành 8 chữ số nhị phân và 2 chữ số hex (chữ thường). Mọi giá trị đều có trong một bản bắt gói thật của khoá.',
  bang: [bang1('b1', ['Convert the byte', 'Đổi byte'], [{ ma: 'x', ten: 'Decimal' }, { ma: 'b', ten: 'Binary (8 digits)' }, { ma: 'h', ten: 'Hex (2 digits)' }], [
    hangDoi(71, 'the letter G'), hangDoi(80, 'the low byte of port 80'), hangDoi(187, 'the low byte of port 443'),
    hangDoi(10, 'each 10 in 10.10.2.10'), hangDoi(64, 'the TTL of the client\'s packets'), hangDoi(160, 'the second byte of à'),
  ], ['Split the binary into two groups of four and read each group as one hex digit: 0100 0111 = 4 7 ⇒ 0x47 = "G"; 1011 1011 = b b ⇒ 0xbb = 187; 1010 0000 = a 0 ⇒ 0xa0. The classic slip is writing 10 as "a": one byte is ALWAYS two hex digits, so 10 is 0a — exactly how it appears in 0a 0a 02 0a.', 'Tách số nhị phân thành hai nhóm bốn bit và đọc mỗi nhóm thành một chữ số hex: 0100 0111 = 4 7 ⇒ 0x47 = "G"; 1011 1011 = b b ⇒ 0xbb = 187; 1010 0000 = a 0 ⇒ 0xa0. Lỗi kinh điển là viết 10 thành "a": một byte LUÔN có hai chữ số hex, nên 10 là 0a — đúng như trong 0a 0a 02 0a.'])],
  goiY: [['Subtract the largest weight that fits, repeatedly: 71 = 64 + 4 + 2 + 1.', 'Trừ dần trọng số lớn nhất còn vừa: 71 = 64 + 4 + 2 + 1.'], ['Hex digits: 10 = a, 11 = b, 12 = c, 13 = d, 14 = e, 15 = f.', 'Chữ số hex: 10 = a, 11 = b, 12 = c, 13 = d, 14 = e, 15 = f.']],
  loi: [['Dropping leading zeros (1010 instead of 00001010, a instead of 0a).', 'Bỏ số 0 đầu (1010 thay vì 00001010, a thay vì 0a).'], ['Reading 0x40 as forty: it is 4 × 16 = 64.', 'Đọc 0x40 là bốn mươi: nó là 4 × 16 = 64.']],
  tns: [tn('bit', 'bit', 'Một số 0 hoặc 1.'), tn('byte / octet', 'byte (8 bit)'), tn('hexadecimal', 'hệ mười sáu')],
  kn: ['binary', 'hexadecimal'],
});

/* ── 2. Đơn vị, tốc độ ── */
const IP = sauLenh('c10-bit-byte', 'iperf3 -c 10.10.2.10 -t 2 -f m');
const ETH = sauLenh('c10-bit-byte', 'ethtool eth0');
const E2 = cs({
  ten: 'Bytes 2 — Bits per second, bytes per second', kho: 'EASY', phut: 8,
  en: `Network speeds are in bits per second, file sizes in bytes. Real output from the lab:${pre(['$ ethtool eth0 | grep -E \'Speed|Duplex\'', ...ETH, '$ iperf3 -c 10.10.2.10 -t 2 -f m | grep -E \'sender|receiver\'', ...IP])}`,
  vi: `Tốc độ mạng tính bằng bit mỗi giây, kích thước tệp tính bằng byte. Output thật trong lab:${pre(['$ ethtool eth0 | grep -E \'Speed|Duplex\'', ...ETH, '$ iperf3 -c 10.10.2.10 -t 2 -f m | grep -E \'sender|receiver\'', ...IP])}`,
  cau: [
    q('c1', ['Your plan says 100 Mbps. What is the best possible download speed?', 'Gói cước ghi 100 Mbps. Tốc độ tải tốt nhất có thể là bao nhiêu?'], ['12.5 MB/s', '100 MB/s', '800 MB/s', '1.25 MB/s'], ['Divide by 8: 100 000 000 bits/s ÷ 8 = 12 500 000 bytes/s, before any header overhead.', 'Chia 8: 100 000 000 bit/s ÷ 8 = 12 500 000 byte/s, chưa trừ phần header.']),
    q('c2', ['A 300 Mbps plan downloads a 750 MB file. At the very best it takes about …', 'Gói 300 Mbps tải một tệp 750 MB. Tốt nhất mất khoảng …'], ['20 seconds', '2.5 seconds', '160 seconds', '0.4 seconds'], ['300 Mbps ÷ 8 = 37.5 MB/s; 750 ÷ 37.5 = 20 s — and in practice longer, because every packet also carries headers.', '300 Mbps ÷ 8 = 37,5 MB/s; 750 ÷ 37,5 = 20 s — thực tế lâu hơn vì mỗi gói còn mang header.']),
    q('c3', ['The virtual card says 10000 Mb/s but iperf3 measured 46815 Mbit/s. Why can it be faster?', 'Card ảo ghi 10000 Mb/s nhưng iperf3 đo được 46815 Mbit/s. Vì sao có thể nhanh hơn?'], ['Both containers share one computer; the "cable" is a memory copy', 'iperf3 counts bytes while ethtool counts bits, so they differ', 'The card compresses the data, so it carries more than its speed', 'The two runs used different cards with different speeds'], ['Between two containers on the same machine, data is copied between kernel buffers, limited only by CPU. On real hardware the advertised speed is a ceiling and you get less.', 'Giữa hai container trên cùng máy, dữ liệu chỉ được chép giữa các bộ đệm trong kernel, chỉ bị CPU giới hạn. Trên phần cứng thật, tốc độ quảng cáo là trần và bạn được ít hơn.']),
    q('c4', ['A MAC address has 48 bits. How many bytes, and how many hex digits are printed?', 'Địa chỉ MAC có 48 bit. Bao nhiêu byte, và in ra bao nhiêu chữ số hex?'], ['6 bytes, 12 hex digits', '48 bytes, 96 hex digits', '6 bytes, 6 hex digits', '12 bytes, 24 hex digits'], ['48 ÷ 8 = 6 bytes, two hex digits each: 02:00:0a:0a:01:0a.', '48 ÷ 8 = 6 byte, mỗi byte hai chữ số hex: 02:00:0a:0a:01:0a.']),
    q('c5', ['Why do RFCs say "octet" instead of "byte"?', 'Vì sao RFC dùng chữ "octet" thay cho "byte"?'], ['An octet is always exactly 8 bits; old machines had other byte sizes', 'An octet is 16 bits, so it fits a whole port number in it', 'An octet is a byte that is sent in network byte order', 'An octet is the hex form of a byte with two digits'], ['Some historical computers used bytes of 6, 7 or 9 bits; "octet" removes all doubt. Today byte and octet mean the same 8 bits.', 'Vài máy tính thời xưa dùng byte 6, 7 hay 9 bit; "octet" xoá mọi nghi ngờ. Ngày nay byte và octet cùng là 8 bit.']),
  ],
  goiY: [['Lower-case b = bit, upper-case B = byte; 1 B = 8 b.', 'b thường = bit, B hoa = byte; 1 B = 8 b.'], ['Divide a speed in bits by 8 before comparing it with a size in bytes.', 'Chia tốc độ tính bằng bit cho 8 trước khi so với kích thước tính bằng byte.']],
  loi: [['Expecting a 100 Mbps plan to download 100 MB per second.', 'Mong gói 100 Mbps tải 100 MB mỗi giây.'], ['Trusting the advertised link speed as the real throughput.', 'Tin tốc độ quảng cáo của đường truyền là thông lượng thật.']],
  tns: [tn('Mbps', 'triệu bit mỗi giây'), tn('MB/s', 'triệu byte mỗi giây'), tn('throughput', 'thông lượng', 'Lượng dữ liệu thật sự đi được mỗi giây.')],
  kn: ['bits vs bytes'],
});

/* ── 3. Tự viết: in byte thành hex ── */
function toHex(bytes) {
  // Each byte ⇒ exactly two lower-case hex digits (10 ⇒ "0a", never "a"), joined by one space.
  return bytes.map(function (b) { return (b < 16 ? '0' : '') + b.toString(16); }).join(' ');
}
const FRAME = hexDump('c12-goi').split('\n').flatMap((d) => d.slice(6, 53).trim().split(/\s+/)).map((x) => parseInt(x, 16));
const E3 = jsBai({
  ten: 'Bytes 3 — Write toHex(bytes) like xxd and tshark print them', kho: 'EASY', phut: 10,
  en: `<p>Every packet tool prints bytes as pairs of hex digits. Write <code>toHex(bytes)</code>: <code>bytes</code> is an array of numbers 0–255; return them as two lower-case hex digits each, separated by one space.</p>${pre(["$ printf 'GET' | xxd", ...sauLenh('c10-bit-byte', "printf 'GET' | xxd")])}<p>So <code>toHex([71, 69, 84])</code> must return <code>'47 45 54'</code> and <code>toHex([10, 10, 2, 10])</code> must return <code>'0a 0a 02 0a'</code> — the address 10.10.2.10 inside a real frame. An empty array gives an empty string.</p>`,
  vi: `<p>Mọi công cụ xem gói in byte thành từng cặp chữ số hex. Viết <code>toHex(bytes)</code>: <code>bytes</code> là mảng số 0–255; trả về mỗi byte thành hai chữ số hex chữ thường, cách nhau một dấu cách.</p>${pre(["$ printf 'GET' | xxd", ...sauLenh('c10-bit-byte', "printf 'GET' | xxd")])}<p>Vậy <code>toHex([71, 69, 84])</code> phải trả <code>'47 45 54'</code> và <code>toHex([10, 10, 2, 10])</code> phải trả <code>'0a 0a 02 0a'</code> — địa chỉ 10.10.2.10 trong một frame thật. Mảng rỗng cho chuỗi rỗng.</p>`,
  dauVao: ['bytes — an array of integers 0–255.', 'bytes — mảng số nguyên 0–255.'],
  dauRa: ['A string like \'47 45 54\'.', 'Một chuỗi như \'47 45 54\'.'],
  goiY: [['n.toString(16) converts to hex — but 10 becomes "a", only one digit.', 'n.toString(16) đổi sang hex — nhưng 10 thành "a", chỉ một chữ số.'], ['Pad to two digits: (n < 16 ? "0" : "") + …, or .padStart(2, "0"). Then join(" ").', 'Đệm cho đủ hai chữ số: (n < 16 ? "0" : "") + …, hoặc .padStart(2, "0"). Rồi join(" ").']],
  loi: [['Forgetting the leading zero: "a a 2 a" instead of "0a 0a 02 0a".', 'Quên số 0 đầu: "a a 2 a" thay vì "0a 0a 02 0a".'], ['Using toUpperCase or adding a trailing space.', 'Dùng toUpperCase hoặc thừa dấu cách cuối.']],
  gt: ['A byte has 256 values and one hex digit has 16, so exactly two digits are always needed; the leading zero is what keeps the columns of xxd and tshark aligned and the bytes unambiguous ("a a" could be one byte or two). The hidden case prints the first 14 bytes of the real 149-byte frame of lesson 1.3 — the Ethernet header.', 'Một byte có 256 giá trị, một chữ số hex có 16, nên luôn cần đúng hai chữ số; số 0 đầu giữ cho các cột của xxd và tshark thẳng hàng và byte không bị nhập nhằng ("a a" là một hay hai byte?). Ca ẩn in 14 byte đầu của frame thật 149 byte ở bài 1.3 — header Ethernet.'],
  kn: ['hexadecimal', 'hex dump'],
  tns: [tn('hex dump', 'bản in hex', 'Dữ liệu in thành các cặp chữ số hex, như xxd hay tshark -x.'), tn('padding', 'đệm thêm', 'Thêm số 0 phía trước cho đủ độ dài.')],
  dau: `/** bytes: [71, 69, 84] ⇒ '47 45 54' */
function toHex(bytes) {
  // Write your solution here
  return bytes.map(function (b) { return b.toString(16); }).join(' ');
}
`,
  giai: '// Reference solution\n' + nguon(toHex),
  cases: [
    { goi: goi('toHex', [71, 69, 84]) },
    { goi: goi('toHex', [10, 10, 2, 10]) },
    { goi: goi('toHex', [0, 80]) },
    { goi: goi('toHex', []), an: true },
    { goi: goi('toHex', [255, 0, 15, 16, 160]), an: true },
    { goi: goi('toHex', FRAME.slice(0, 14)), an: true },
    { goi: goi('toHex', [0xc3, 0xa0]), an: true },
  ],
});

/* ── 4. Byte trên dây ── */
const be = (n) => `${h2(n >> 8)} ${h2(n & 255)}`;
const bien = (s) => [s, s.replace(/ /g, ''), s.replace(/ /g, ':')];
const E4 = cs({
  ten: 'Bytes 4 — Which bytes go on the wire?', kho: 'MEDIUM', phut: 12, loai: 'table',
  en: `Internet protocols send multi-byte numbers <b>big-endian</b> (most significant byte first). Text is sent as UTF-8. Write the bytes in hex, separated by spaces (e.g. <code>00 50</code>). Check yourself against the lab:${pre(['$ python3 -c "print((80).to_bytes(2, \'big\').hex(), (443).to_bytes(2, \'big\').hex(), (50228).to_bytes(2, \'big\').hex())"', ...sauLenh('c10-bit-byte', 'python3 -c "print((80)'), "$ printf 'Xin chào' | xxd", ...sauLenh('c10-bit-byte', "printf 'Xin chào' | xxd")])}`,
  vi: `Giao thức Internet gửi số nhiều byte theo <b>big-endian</b> (byte nặng nhất đi trước). Chữ được gửi theo UTF-8. Viết các byte bằng hex, cách nhau dấu cách (vd <code>00 50</code>). Tự đối chiếu với lab:${pre(['$ python3 -c "print((80).to_bytes(2, \'big\').hex(), (443).to_bytes(2, \'big\').hex(), (50228).to_bytes(2, \'big\').hex())"', ...sauLenh('c10-bit-byte', 'python3 -c "print((80)'), "$ printf 'Xin chào' | xxd", ...sauLenh('c10-bit-byte', "printf 'Xin chào' | xxd")])}`,
  bang: [bang1('b1', ['Bytes in hex', 'Byte dạng hex'], [{ ma: 'x', ten: 'Value' }, { ma: 'h', ten: 'Bytes on the wire (hex)' }], [
    { o: { x: 'port 22 (SSH)' }, a: { h: bien(be(22)) } },
    { o: { x: 'port 3000 (Node dev server)' }, a: { h: bien(be(3000)) } },
    { o: { x: 'port 5432 (PostgreSQL)' }, a: { h: bien(be(5432)) } },
    { o: { x: 'port 443 (HTTPS)' }, a: { h: bien(be(443)) } },
    { o: { x: 'IPv4 address 10.10.1.10' }, a: { h: bien('0a 0a 01 0a') } },
    { o: { x: 'the letter à in UTF-8' }, a: { h: bien('c3 a0') } },
    { o: { x: 'the letter ễ in UTF-8' }, a: { h: bien('e1 bb 85') } },
  ], ['Ports: divide by 256 — 3000 = 11 × 256 + 184 ⇒ 0b b8; 5432 = 21 × 256 + 56 ⇒ 15 38; 443 = 1 × 256 + 187 ⇒ 01 bb. An IPv4 address is its four numbers, one byte each. à takes two UTF-8 bytes (c3 a0) and ễ three (e1 bb 85) — the lesson\'s practice found them with printf | xxd. The tempting mistake is the little-endian order of your CPU (b8 0b for 3000).', 'Cổng: chia cho 256 — 3000 = 11 × 256 + 184 ⇒ 0b b8; 5432 = 21 × 256 + 56 ⇒ 15 38; 443 = 1 × 256 + 187 ⇒ 01 bb. Địa chỉ IPv4 là bốn con số, mỗi số một byte. à chiếm hai byte UTF-8 (c3 a0) còn ễ ba byte (e1 bb 85) — phần thực hành của bài tìm ra chúng bằng printf | xxd. Lỗi dễ mắc là thứ tự little-endian của CPU (b8 0b cho 3000).'])],
  goiY: [['High byte = Math.floor(n / 256), low byte = n % 256; the high byte goes first.', 'Byte cao = Math.floor(n / 256), byte thấp = n % 256; byte cao đi trước.'], ['Vietnamese letters with marks are 2 or 3 bytes in UTF-8.', 'Chữ tiếng Việt có dấu chiếm 2 hoặc 3 byte trong UTF-8.']],
  loi: [['Writing the low byte first, as the CPU stores it.', 'Viết byte thấp trước, như CPU lưu.'], ['Writing a port with one byte (16 instead of 00 16).', 'Viết cổng bằng một byte (16 thay vì 00 16).']],
  tns: [tn('big-endian', 'byte nặng trước', 'Còn gọi là network byte order.'), tn('UTF-8', 'bảng mã UTF-8', 'Mã hoá chữ của web: 1 byte cho chữ ASCII, 2–4 byte cho chữ khác.')],
  kn: ['network byte order', 'UTF-8'],
});

/* ── 5. Tự viết: đếm byte UTF-8 không dùng TextEncoder ── */
function utf8Length(str) {
  var n = 0;
  // for…of walks CODE POINTS: an emoji such as 👋 (two UTF-16 units, str.length 2) is one step.
  for (var ch of str) {
    var cp = ch.codePointAt(0);
    if (cp <= 0x7f) n += 1;          // ASCII: 0xxxxxxx
    else if (cp <= 0x7ff) n += 2;    // 110xxxxx 10xxxxxx — e.g. à (U+00E0)
    else if (cp <= 0xffff) n += 3;   // 1110xxxx + 2 bytes — e.g. ễ (U+1EC5), 中
    else n += 4;                     // 11110xxx + 3 bytes — emoji and other symbols beyond U+FFFF
  }
  return n;
}
const E5 = jsBai({
  ten: 'Bytes 5 — Write utf8Length(str) without TextEncoder', kho: 'MEDIUM', phut: 20,
  en: `<p>HTTP's <code>Content-Length</code> counts <b>bytes</b>. A hand-written server that sets <code>Content-Length: body.length</code> is correct for English and breaks on the first Vietnamese name — the client stops reading early and gets broken JSON. Real output from the lab:</p>${pre(["$ python3 -c \"print(len('Xin chào'), 'characters,', len('Xin chào'.encode()), 'bytes')\"", ...sauLenh('c10-bit-byte', 'python3 -c "print(len(')])}<p>Write <code>utf8Length(str)</code> that returns how many bytes UTF-8 uses for <code>str</code>, computed <b>yourself</b> from the code points — <code>TextEncoder</code>, <code>Buffer</code>, <code>Blob</code>, <code>encodeURIComponent</code> and <code>unescape</code> are not allowed (a check reads your code).</p>${'<table><thead><tr><th>Code point</th><th>UTF-8 bytes</th><th>Examples</th></tr></thead><tbody><tr><td>U+0000 – U+007F</td><td>1</td><td>G, e, space</td></tr><tr><td>U+0080 – U+07FF</td><td>2</td><td>à (U+00E0), é</td></tr><tr><td>U+0800 – U+FFFF</td><td>3</td><td>ễ (U+1EC5), ệ, 中</td></tr><tr><td>U+10000 – U+10FFFF</td><td>4</td><td>👋, 🇻 (each half of a flag)</td></tr></tbody></table>'}<p>"Nguyễn" has 6 characters and 8 bytes; "Xin chào" has 8 characters and 9 bytes.</p>`,
  vi: `<p><code>Content-Length</code> của HTTP đếm <b>byte</b>. Một server viết tay đặt <code>Content-Length: body.length</code> đúng với tiếng Anh và hỏng ở cái tên tiếng Việt đầu tiên — client dừng đọc sớm và nhận JSON vỡ. Output thật trong lab:</p>${pre(["$ python3 -c \"print(len('Xin chào'), 'characters,', len('Xin chào'.encode()), 'bytes')\"", ...sauLenh('c10-bit-byte', 'python3 -c "print(len(')])}<p>Viết <code>utf8Length(str)</code> trả số byte UTF-8 dùng cho <code>str</code>, <b>tự tính</b> từ các code point — không được dùng <code>TextEncoder</code>, <code>Buffer</code>, <code>Blob</code>, <code>encodeURIComponent</code> và <code>unescape</code> (có một kiểm đọc mã của bạn).</p>${'<table><thead><tr><th>Code point</th><th>Số byte UTF-8</th><th>Ví dụ</th></tr></thead><tbody><tr><td>U+0000 – U+007F</td><td>1</td><td>G, e, dấu cách</td></tr><tr><td>U+0080 – U+07FF</td><td>2</td><td>à (U+00E0), é</td></tr><tr><td>U+0800 – U+FFFF</td><td>3</td><td>ễ (U+1EC5), ệ, 中</td></tr><tr><td>U+10000 – U+10FFFF</td><td>4</td><td>👋, 🇻 (mỗi nửa lá cờ)</td></tr></tbody></table>'}<p>"Nguyễn" có 6 ký tự và 8 byte; "Xin chào" có 8 ký tự và 9 byte.</p>`,
  dauVao: ['str — any JavaScript string (well-formed, written in NFC as typed on a keyboard).', 'str — chuỗi JavaScript bất kỳ (hợp lệ, dạng NFC như gõ từ bàn phím).'],
  dauRa: ['The number of UTF-8 bytes.', 'Số byte UTF-8.'],
  goiY: [
    ['str.length counts UTF-16 code units, not characters and not bytes — that is the bug you are fixing.', 'str.length đếm đơn vị UTF-16, không phải ký tự cũng không phải byte — đó chính là lỗi bạn đang sửa.'],
    ['for (const ch of str) gives one code point per step; ch.codePointAt(0) is its number. Compare it with 0x7F, 0x7FF and 0xFFFF.', 'for (const ch of str) cho mỗi bước một code point; ch.codePointAt(0) là số của nó. So với 0x7F, 0x7FF và 0xFFFF.'],
  ],
  loi: [
    ['Returning str.length: "Nguyễn" gives 6 instead of 8.', 'Trả str.length: "Nguyễn" cho 6 thay vì 8.'],
    ['Looping with for (let i = 0; i < str.length; i++) and charCodeAt: an emoji is seen as two "characters" of 3 bytes each = 6 instead of 4.', 'Lặp bằng for (let i = 0; i < str.length; i++) và charCodeAt: một emoji bị thấy thành hai "ký tự" 3 byte = 6 thay vì 4.'],
  ],
  gt: ['UTF-8 stores each code point in 1–4 bytes depending on its size, with the ranges in the table. Walking the string with for…of yields code points (it joins the two UTF-16 halves of an emoji), so each one is counted once with the right size. This is exactly what Buffer.byteLength(body) computes in Node — the value Content-Length must carry.', 'UTF-8 lưu mỗi code point bằng 1–4 byte tuỳ độ lớn, theo các khoảng trong bảng. Duyệt chuỗi bằng for…of cho ra code point (nó ghép hai nửa UTF-16 của emoji), nên mỗi cái được đếm một lần với đúng kích thước. Đây đúng là thứ Buffer.byteLength(body) tính trong Node — giá trị Content-Length phải mang.'],
  kn: ['UTF-8', 'Content-Length'],
  tns: [tn('code point', 'điểm mã', 'Số hiệu của một ký tự trong Unicode, vd U+1EC5 = ễ.'), tn('UTF-16 code unit', 'đơn vị UTF-16', 'Thứ mà str.length của JavaScript đếm.'), tn('Content-Length', 'độ dài nội dung (byte)')],
  dau: `/** "Xin chào" ⇒ 9, "Nguyễn" ⇒ 8 — without TextEncoder / Buffer. */
function utf8Length(str) {
  // Write your solution here
  return str.length;
}
`,
  giai: '// Reference solution\n' + nguon(utf8Length),
  cases: [
    { goi: goi('utf8Length', 'GET') },
    { goi: goi('utf8Length', 'Xin chào') },
    { goi: goi('utf8Length', 'Nguyễn') },
    { goi: goi('utf8Length', ''), an: true },
    { goi: goi('utf8Length', '👋'), an: true },
    { goi: goi('utf8Length', 'Việt Nam 🇻🇳'), an: true },
    { goi: goi('utf8Length', '{"name":"Trần Thị Ngọc Ánh","city":"Đà Nẵng"}'), an: true },
    { goi: goi('utf8Length', '中文 OK'), an: true },
  ],
  kiemThem: [{ kiem: 'ma-nguon', moTa: { en: 'Computes it yourself (no TextEncoder, Buffer, Blob, encodeURIComponent, unescape)', vi: 'Tự tính (không TextEncoder, Buffer, Blob, encodeURIComponent, unescape)' }, tep: 'answer.js', khop: 'TextEncoder|Buffer|Blob|encodeURI|unescape', phuDinh: true }],
});

/* ── 6. Tự viết: thứ tự byte ── */
function u16be(n) {
  if (!Number.isInteger(n) || n < 0 || n > 65535) throw new RangeError('not a 16-bit unsigned number: ' + n);
  return [Math.floor(n / 256), n % 256];           // [high byte, low byte] — the order on the wire
}
function readU16(bytes, offset) {
  if (!Number.isInteger(offset) || offset < 0 || offset + 1 >= bytes.length) throw new RangeError('offset out of range: ' + offset);
  return bytes[offset] * 256 + bytes[offset + 1];  // big-endian: the first byte is the heavy one
}
function htonsLE(n) {
  // On a little-endian CPU, memory holds the LOW byte first. htons() swaps the two bytes so that,
  // stored that way, the bytes in memory are [high, low] = network order. 80 = 0x0050 ⇒ 0x5000 = 20480.
  var b = u16be(n);
  return b[1] * 256 + b[0];
}
const WEB = hexDump('c13-hop-web').split('\n').flatMap((d) => d.slice(6, 53).trim().split(/\s+/)).map((x) => parseInt(x, 16));
const E6 = jsBai({
  ten: 'Bytes 6 — Write u16be, readU16 and htonsLE', kho: 'HARD', phut: 25,
  en: `<p>Binary headers (TCP, IP, DNS, TLS) carry 16-bit numbers as two bytes, most significant first. Your laptop's CPU is little-endian, which is why C code calls <code>htons()</code>. Real output from the lab client:</p>${pre(['$ python3 -c "import sys; print(sys.byteorder)"', ...sauLenh('c10-bit-byte', 'python3 -c "import sys'), '$ python3 -c "import socket; print(socket.htons(80), hex(socket.htons(80)))"', ...sauLenh('c10-bit-byte', 'python3 -c "import socket')])}<p>Write three functions in one file:</p>
<ol>
<li><code>u16be(n)</code> ⇒ <code>[high, low]</code>, the two bytes of <code>n</code> in network order: <code>u16be(443)</code> = <code>[1, 187]</code>.</li>
<li><code>readU16(bytes, offset)</code> ⇒ the big-endian number stored at <code>bytes[offset]</code> and <code>bytes[offset + 1]</code>. With the 149 bytes of the real frame of lesson 1.3, <code>readU16(frame, 36)</code> is the destination port 80 and <code>readU16(frame, 16)</code> is the IP total length 135.</li>
<li><code>htonsLE(n)</code> ⇒ what <code>htons(n)</code> returns on a little-endian machine (the two bytes swapped): <code>htonsLE(80)</code> = <code>20480</code>.</li>
</ol>
<p><code>u16be</code> and <code>htonsLE</code> must throw a <code>RangeError</code> when <code>n</code> is not an integer from 0 to 65535; <code>readU16</code> must throw a <code>RangeError</code> when the two bytes are not inside the array. Hidden cases read another real frame (the web side of the router, lesson 1.4).</p>`,
  vi: `<p>Header nhị phân (TCP, IP, DNS, TLS) chở số 16 bit bằng hai byte, byte nặng trước. CPU laptop của bạn là little-endian, vì thế code C phải gọi <code>htons()</code>. Output thật trên máy client của lab:</p>${pre(['$ python3 -c "import sys; print(sys.byteorder)"', ...sauLenh('c10-bit-byte', 'python3 -c "import sys'), '$ python3 -c "import socket; print(socket.htons(80), hex(socket.htons(80)))"', ...sauLenh('c10-bit-byte', 'python3 -c "import socket')])}<p>Viết ba hàm trong một tệp:</p>
<ol>
<li><code>u16be(n)</code> ⇒ <code>[cao, thấp]</code>, hai byte của <code>n</code> theo thứ tự mạng: <code>u16be(443)</code> = <code>[1, 187]</code>.</li>
<li><code>readU16(bytes, offset)</code> ⇒ số big-endian lưu ở <code>bytes[offset]</code> và <code>bytes[offset + 1]</code>. Với 149 byte của frame thật ở bài 1.3, <code>readU16(frame, 36)</code> là cổng đích 80 và <code>readU16(frame, 16)</code> là tổng độ dài IP 135.</li>
<li><code>htonsLE(n)</code> ⇒ giá trị <code>htons(n)</code> trả về trên máy little-endian (đổi chỗ hai byte): <code>htonsLE(80)</code> = <code>20480</code>.</li>
</ol>
<p><code>u16be</code> và <code>htonsLE</code> phải ném <code>RangeError</code> khi <code>n</code> không phải số nguyên từ 0 tới 65535; <code>readU16</code> phải ném <code>RangeError</code> khi hai byte không nằm trong mảng. Ca ẩn đọc một frame thật khác (phía web của router, bài 1.4).</p>`,
  yc: [['Return values; do not print them.', 'Trả về giá trị, đừng in.'], ['Throw RangeError (not return null) for invalid input.', 'Ném RangeError (không trả null) khi đầu vào sai.']],
  dauVao: ['n — a number; bytes — an array of 0–255; offset — an index.', 'n — một số; bytes — mảng 0–255; offset — chỉ số.'],
  dauRa: ['u16be ⇒ [high, low]; readU16 ⇒ a number 0–65535; htonsLE ⇒ a number 0–65535.', 'u16be ⇒ [cao, thấp]; readU16 ⇒ số 0–65535; htonsLE ⇒ số 0–65535.'],
  goiY: [
    ['high = Math.floor(n / 256), low = n % 256 (or n >> 8 and n & 0xff).', 'cao = Math.floor(n / 256), thấp = n % 256 (hoặc n >> 8 và n & 0xff).'],
    ['readU16 is the reverse: bytes[offset] × 256 + bytes[offset + 1]. The last valid offset is bytes.length − 2.', 'readU16 là chiều ngược: bytes[offset] × 256 + bytes[offset + 1]. offset hợp lệ cuối cùng là bytes.length − 2.'],
    ['htonsLE(n) = low × 256 + high — reuse u16be, which already checks the range.', 'htonsLE(n) = thấp × 256 + cao — dùng lại u16be, hàm đó đã kiểm khoảng.'],
  ],
  loi: [
    ['Reading the two bytes in CPU order: 0x00 0x50 becomes 0x5000 = 20480 — the bug htons exists to prevent.', 'Đọc hai byte theo thứ tự CPU: 0x00 0x50 thành 0x5000 = 20480 — đúng lỗi mà htons sinh ra để chặn.'],
    ['Allowing offset = bytes.length − 1: bytes[offset + 1] is undefined and the result is NaN.', 'Cho phép offset = bytes.length − 1: bytes[offset + 1] là undefined và kết quả là NaN.'],
    ['Accepting 65536 or 80.5: they do not fit in 16 bits; real code would silently truncate them.', 'Chấp nhận 65536 hay 80.5: chúng không vừa 16 bit; code thật sẽ âm thầm cắt bớt.'],
  ],
  gt: ['A 16-bit number is high × 256 + low. Network order sends high first, so u16be and readU16 are each other\'s inverse. A little-endian CPU keeps low first in memory; htons swaps the two bytes so that memory then holds high, low — the wire order. That is why Python printed 20480 = 0x5000 for htons(80). Checking the range and the offset turns silent corruption (NaN, truncated ports) into a loud error.', 'Số 16 bit là cao × 256 + thấp. Thứ tự mạng gửi byte cao trước, nên u16be và readU16 là nghịch đảo của nhau. CPU little-endian giữ byte thấp trước trong bộ nhớ; htons đổi chỗ hai byte để bộ nhớ chứa cao, thấp — đúng thứ tự trên dây. Vì thế Python in 20480 = 0x5000 cho htons(80). Kiểm khoảng và offset biến lỗi âm thầm (NaN, cổng bị cắt) thành lỗi rõ ràng.'],
  kn: ['network byte order', 'endianness', 'htons'],
  tns: [tn('big-endian', 'byte nặng trước'), tn('little-endian', 'byte nhẹ trước', 'Cách CPU x86 và ARM lưu số.'), tn('htons', 'host to network short', 'Đổi số 16 bit từ thứ tự máy sang thứ tự mạng.'), tn('RangeError', 'lỗi ngoài khoảng')],
  dau: `function u16be(n) {
  // Write your solution here
}

function readU16(bytes, offset) {
  // Write your solution here
}

function htonsLE(n) {
  // Write your solution here
}
`,
  giai: '// Reference solution\n' + nguon(u16be, readU16, htonsLE),
  cases: [
    { goi: 'u16be(80)' }, { goi: 'u16be(443)' }, { goi: 'u16be(50228)' },
    { goi: `readU16(${JSON.stringify(FRAME)}, 36)`, moTa: ['readU16(frame of lesson 1.3, 36) — destination port', 'readU16(frame bài 1.3, 36) — cổng đích'] },
    { goi: `readU16(${JSON.stringify(FRAME)}, 16)`, moTa: ['readU16(frame of lesson 1.3, 16) — IP total length', 'readU16(frame bài 1.3, 16) — tổng độ dài IP'] },
    { goi: 'htonsLE(80)' },
    { goi: 'htonsLE(443)', an: true }, { goi: 'htonsLE(50228)', an: true }, { goi: 'u16be(0)', an: true }, { goi: 'u16be(65535)', an: true },
    { goi: `readU16(${JSON.stringify(WEB)}, 34)`, an: true }, { goi: `readU16(${JSON.stringify(WEB)}, 24)`, an: true },
    { goi: 'readU16([1, 187], 0)', an: true },
    { goi: 'u16be(65536)', nem: 'RangeError', an: true }, { goi: 'htonsLE(80.5)', nem: 'RangeError', an: true }, { goi: 'u16be(-1)', nem: 'RangeError', an: true },
    { goi: 'readU16([1, 187], 1)', nem: 'RangeError', an: true },
  ],
  vdGt: ['80 = 0 × 256 + 80 ⇒ the bytes 00 50, exactly what Python printed.', '80 = 0 × 256 + 80 ⇒ hai byte 00 50, đúng như Python in ra.'],
});

export default doiDau({ slug: 'netdev-1-0-bit-byte', ten: '1.1 Bits, bytes, hex and signals', khoa: KHOA, baiHoc: 'netdev-1-0-bit-byte', de: [E1, E2, E3, E4, E5, E6] });
