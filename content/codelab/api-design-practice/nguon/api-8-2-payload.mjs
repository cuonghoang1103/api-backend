/** API Design · 8.3 — Chậm do thiết kế: kích thước payload trên đường truyền chậm, chọn kiểu nén theo Accept-Encoding (output thật bài 8.3). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Payload 1 — Bytes on a slow link', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 8.3 (100 bookings, compression 1.8.2, perf/slow-link.mjs at 1 Mbit/s with 40 ms each way).',
  vi: 'Những điều từ bài 8.3 (100 lượt đặt, compression 1.8.2, perf/slow-link.mjs 1 Mbit/s, trễ 40 ms mỗi chiều).',
  cau: [
    q('c1', ['The 25,501-byte list took 319 ms through the slow link, 103 ms with gzip. Where did most of the 319 ms go?', 'Danh sách 25.501 byte mất 319 ms qua đường chậm, 103 ms khi gzip. Phần lớn 319 ms đi đâu?'],
      ['Transfer: 25,501 × 8 ÷ 1,000,000 ≈ 204 ms, plus 80 ms of delay', 'The server building and indenting the JSON for 100 bookings', 'Compressing the response with Brotli before sending', 'The PostgreSQL query behind the bookings list'],
      ['The server spent 2–3 ms. The contract (size) cost the time, not the code.', 'Server chỉ tốn 2–3 ms. Hợp đồng (kích thước) tốn thời gian, không phải code.']),
    q('c2', ['GET /v2/labs/lab_1 (101 bytes) came back without Content-Encoding although the client sent Accept-Encoding: gzip, br. Why?', 'GET /v2/labs/lab_1 (101 byte) trả về không có Content-Encoding dù client gửi Accept-Encoding: gzip, br. Vì sao?'],
      ['It is below the 1 KB threshold — compressing would cost more than it saves', 'Brotli is not supported by Node 22', 'Labs are marked Cache-Control: no-transform', 'curl did not really send the header'],
      ['compression({ threshold: 1024 }): small bodies stay plain; the 100-booking list went out as br, 1,447 bytes.', 'compression({ threshold: 1024 }): body nhỏ gửi nguyên; danh sách 100 lượt đặt đi ra dạng br, 1.447 byte.']),
    q('c3', ['Why does the response also carry Vary: Accept-Encoding?', 'Vì sao response còn có Vary: Accept-Encoding?'],
      ['So caches keep one copy per encoding and never send Brotli to a client that cannot decode it', 'To tell the browser which coding to use when it decompresses the body', 'Because Express adds it to every response, compressed or not, by default', 'To make the response smaller by removing duplicate headers from the body'],
      ['The same URL has different bytes depending on a request header; Vary says which header (Chapter 9: caching).', 'Cùng URL có byte khác nhau tuỳ một header của request; Vary nói đó là header nào (Chương 9: cache).']),
  ],
  goiY: [['Transfer time = size ÷ bandwidth.', 'Thời gian truyền = kích thước ÷ băng thông.'], ['Look at the threshold.', 'Nhìn ngưỡng.']],
  loi: [['Mixing up bytes and bits (× 8).', 'Nhầm byte với bit (× 8).'], ['Judging an API by localhost timings.', 'Đánh giá API bằng số đo localhost.']],
  tns: [tn('bandwidth', 'băng thông'), tn('Content-Encoding', 'kiểu nén server đã dùng')],
  kn: ['HTTP', 'performance'],
});

function transferMs(bytes, kbps, delayMs) {
  return Math.round((2 * delayMs + (bytes * 8) / kbps) * 10) / 10;
}
const E2 = jsBai({
  ten: 'Payload 2 — Write transferMs(bytes, kbps, delayMs)', kho: 'EASY', phut: 8,
  en: `<p>Predict how long a response takes over a slow link, the way lesson 8.3 checked its measurements: the request pays <code>delayMs</code> going out and <code>delayMs</code> coming back, then the body flows at <code>kbps</code> kilobits per second (1 kbit = 1000 bits). Ignore server time. Round to 1 decimal.</p>`,
  vi: `<p>Đoán một response mất bao lâu qua đường chậm, đúng cách bài 8.3 kiểm số đo: request trả <code>delayMs</code> lúc đi và <code>delayMs</code> lúc về, rồi body chảy với tốc độ <code>kbps</code> kilobit mỗi giây (1 kbit = 1000 bit). Bỏ qua thời gian server. Làm tròn 1 chữ số.</p>`,
  dauVao: ['bytes, kbps, delayMs — numbers', 'bytes, kbps, delayMs — số'],
  dauRa: ['milliseconds, 1 decimal', 'mili giây, 1 chữ số'],
  goiY: [['bits = bytes × 8; at kbps kbit/s, 1 ms carries kbps bits.', 'bit = byte × 8; ở kbps kbit/s, 1 ms chở được kbps bit.'], ['Delay counts twice.', 'Trễ tính hai lần.']],
  loi: [['Forgetting × 8.', 'Quên × 8.'], ['Counting the delay only once.', 'Chỉ tính trễ một lần.']],
  gt: ['25,501 B at 1,000 kbit/s with 40 ms ⇒ 284 ms predicted; measured 319 ms (the drip proxy sleeps per 1 KB piece). gzip 1,688 B ⇒ 93.5 ms; measured 103 ms.', '25.501 B ở 1.000 kbit/s, trễ 40 ms ⇒ đoán 284 ms; đo được 319 ms (proxy nhỏ giọt ngủ theo từng mẩu 1 KB). gzip 1.688 B ⇒ 93,5 ms; đo 103 ms.'],
  kn: ['performance'],
  tns: [tn('round trip', 'lượt đi-về'), tn('kbit/s', 'kilobit mỗi giây')],
  dau: `/** predicted ms for one response over a slow link */
function transferMs(bytes, kbps, delayMs) {
  // Write your solution here
  return delayMs + bytes / kbps;
}
`,
  giai: '// Reference solution\n' + nguon(transferMs),
  cases: [
    { goi: goi('transferMs', 25501, 1000, 40), moTa: ['100 bookings, uncompressed', '100 lượt đặt, không nén'] },
    { goi: goi('transferMs', 1688, 1000, 40), moTa: ['The same with gzip', 'Cùng danh sách, gzip'] },
    { goi: goi('transferMs', 11653, 400, 40), an: true },
    { goi: goi('transferMs', 0, 1000, 0), an: true },
  ],
});

function pickEncoding(acceptEncoding, size, threshold = 1024) {
  if (!acceptEncoding || size < threshold) return null;
  const q = {};
  for (const part of acceptEncoding.split(',')) {
    const [name, ...params] = part.trim().toLowerCase().split(';').map((x) => x.trim());
    if (!name) continue;
    let w = 1;
    for (const p of params) if (p.startsWith('q=')) w = Number(p.slice(2));
    q[name] = Number.isFinite(w) ? w : 0;
  }
  const weight = (c) => (c in q ? q[c] : ('*' in q ? q['*'] : 0));
  const br = weight('br'), gz = weight('gzip');
  if (br <= 0 && gz <= 0) return null;
  return br >= gz ? 'br' : 'gzip';
}
const E3 = jsBai({
  ten: 'Payload 3 — Write pickEncoding(acceptEncoding, size, threshold)', kho: 'MEDIUM', phut: 15,
  en: `<p>Decide how the server compresses a response. The server supports <code>br</code> and <code>gzip</code>. Parse <code>Accept-Encoding</code>: comma-separated codings, each with an optional <code>;q=</code> weight (default 1; <code>q=0</code> means “not acceptable”); names are case-insensitive; <code>*</code> gives the weight of any coding not listed. Return the supported coding with the highest weight above 0, preferring <code>br</code> on a tie. Return <code>null</code> if the header is missing, nothing acceptable is supported, or <code>size</code> is below <code>threshold</code> (default 1024).</p>`,
  vi: `<p>Quyết định server nén response thế nào. Server hỗ trợ <code>br</code> và <code>gzip</code>. Phân tích <code>Accept-Encoding</code>: các kiểu nén cách nhau dấu phẩy, mỗi kiểu có thể kèm trọng số <code>;q=</code> (mặc định 1; <code>q=0</code> nghĩa là “không chấp nhận”); tên không phân biệt hoa thường; <code>*</code> cho trọng số của mọi kiểu không được liệt kê. Trả kiểu được hỗ trợ có trọng số cao nhất và lớn hơn 0, hoà thì ưu tiên <code>br</code>. Trả <code>null</code> nếu thiếu header, không có kiểu nào vừa được chấp nhận vừa được hỗ trợ, hoặc <code>size</code> nhỏ hơn <code>threshold</code> (mặc định 1024).</p>`,
  dauVao: ['acceptEncoding — string | undefined; size — bytes; threshold — bytes', 'acceptEncoding — chuỗi | undefined; size — byte; threshold — byte'],
  dauRa: ['"br" | "gzip" | null', '"br" | "gzip" | null'],
  goiY: [['Build a map coding ⇒ q first.', 'Dựng map kiểu nén ⇒ q trước.'], ['A coding not listed gets the weight of *, or 0.', 'Kiểu không được liệt kê lấy trọng số của *, hoặc 0.']],
  loi: [['Treating gzip;q=0 as “gzip allowed”.', 'Coi gzip;q=0 là “cho gzip”.'], ['Compressing a 101-byte body.', 'Nén một body 101 byte.']],
  gt: ['Browsers send “gzip, deflate, br, zstd” ⇒ br; the 101-byte lab ⇒ null — exactly what curl showed in lesson 8.3.', 'Trình duyệt gửi “gzip, deflate, br, zstd” ⇒ br; phòng lab 101 byte ⇒ null — đúng như curl thấy ở bài 8.3.'],
  kn: ['HTTP', 'content negotiation'],
  tns: [tn('Accept-Encoding', 'client giải nén được gì'), tn('q-value', 'trọng số ưu tiên')],
  dau: `/** "br" | "gzip" | null for this response */
function pickEncoding(acceptEncoding, size, threshold = 1024) {
  // Write your solution here
  if (acceptEncoding.includes('br')) return 'br';
  if (acceptEncoding.includes('gzip')) return 'gzip';
  return null;
}
`,
  giai: '// Reference solution\n' + nguon(pickEncoding),
  cases: [
    { goi: goi('pickEncoding', 'gzip, deflate, br, zstd', 25501), moTa: ['A browser, 100 bookings', 'Trình duyệt, 100 lượt đặt'] },
    { goi: goi('pickEncoding', 'gzip, br', 101), moTa: ['The 101-byte lab', 'Phòng lab 101 byte'] },
    { goi: goi('pickEncoding', 'gzip', 5000), an: true },
    { goi: goi('pickEncoding', 'br;q=0, gzip;q=0.5', 5000), an: true },
    { goi: goi('pickEncoding', 'identity', 5000), an: true },
    { goi: goi('pickEncoding', '*;q=0.3, gzip;q=0.8', 5000), an: true },
    { goi: goi('pickEncoding', 'GZIP;q=1, BR;q=0.9', 2048, 4096), an: true },
    { goi: goi('pickEncoding', 'GZIP;q=1, BR;q=0.9', 2048, 1024), an: true },
  ],
});

export default doiDau({ slug: 'api-8-2-payload', ten: '8.3 Payload size, sparse fields and compression', khoa: KHOA, baiHoc: 'api-8-2-payload', de: [E1, E2, E3] });
