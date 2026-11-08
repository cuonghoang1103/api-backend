/** Node.js 16.3 — Nén: đổi CPU lấy băng thông, gzip 9 / brotli 11 là cái bẫy, ai nén cho website, SSE bị gom, keep-alive. */
import { modul, cs, q, qn, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'The compression trade, who compresses, and the stream that stopped streaming', kho: 'EASY', phut: 7,
  en: 'Questions on lesson 16.3 (one 145,119-byte JSON response of 500 varied notes, Node’s built-in zlib).',
  vi: 'Câu hỏi về bài 16.3 (một response JSON 145.119 byte gồm 500 ghi chú đa dạng, zlib có sẵn của Node).',
  cau: [
    q('c1', ['gzip 6: 26,564 B in 3.31 ms. gzip 9: 26,377 B in 5.03 ms. What does level 9 buy?', 'gzip 6: 26.564 B trong 3,31 ms. gzip 9: 26.377 B trong 5,03 ms. Mức 9 mua được gì?'],
      ['0.7% fewer bytes for about 1.5× the CPU time', '30% fewer bytes for the same CPU time', 'Nothing: level 9 produces exactly the same bytes as 6', 'Faster decompression on the client, which saves battery'],
      ['gzip 9 is the worst gzip. Decompression is nearly free for the client either way (0.15 ms) — the server pays for the level.', 'gzip 9 là gzip tệ nhất. Giải nén gần như miễn phí với client trong mọi trường hợp (0,15 ms) — server mới trả giá cho mức nén.']),
    q('c2', ['On highly repetitive JSON, brotli 4 gave 1,322 B in 0.13 ms and brotli 11 gave 1,434 B in 131.34 ms. Conclusion?', 'Trên JSON lặp lại nhiều, brotli 4 cho 1.322 B trong 0,13 ms còn brotli 11 cho 1.434 B trong 131,34 ms. Kết luận?'],
      ['“Higher is better” is not even safe: here 11 was bigger and about 1,000× slower', 'Quality 11 is always smaller, so it is worth it for repetitive data', 'Repetitive data cannot be compressed, so both numbers are noise', 'brotli is broken on repetitive data; switch to gzip 9 instead'],
      ['On varied data 11 was 30% smaller and 148× slower; on repetitive data 8% bigger and 984× slower. Measure your own responses.', 'Trên dữ liệu đa dạng, 11 nhỏ hơn 30% và chậm 148 lần; trên dữ liệu lặp lại thì to hơn 8% và chậm 984 lần. Hãy đo response của chính bạn.']),
    q('c3', ['The website sits behind nginx with gzip on, yet API responses come back with content-encoding: br. Who compressed them?', 'Website nằm sau nginx có bật gzip, vậy mà response API trả về content-encoding: br. Ai đã nén?'],
      ['Node: app.use(compression({ level: 6, … })), brotli quality 4 by default; nginx passes it through', 'nginx: it upgrades every gzip response to brotli before sending it', 'Cloudflare: the CDN re-compresses every response with brotli 11', 'The browser: it asks for br, so the response is compressed client-side'],
      ['nginx does not compress twice: if Node already set Content-Encoding, nginx forwards it. “nginx has gzip on” says nothing about who really compressed your JSON.', 'nginx không nén hai lần: nếu Node đã đặt Content-Encoding, nginx chuyển tiếp nguyên vẹn. “nginx bật gzip” không nói gì về việc ai thật sự nén JSON của bạn.']),
    q('c4', ['A dashboard route uses Server-Sent Events. It worked locally, then stopped updating after the compression middleware was added. Why?', 'Một route dashboard dùng Server-Sent Events. Chạy tốt ở máy, rồi ngừng cập nhật sau khi thêm middleware nén. Vì sao?'],
      ['The middleware buffers output, so events arrive all at once at the end', 'Browsers refuse compressed event streams and close the connection', 'Compression changes the MIME type to application/gzip', 'SSE needs HTTP/2, which the middleware disables'],
      ['Exclude text/event-stream in the filter (else fall back to compression.filter), or call res.flush() after each res.write(chunk).', 'Loại text/event-stream trong filter (không thì dùng compression.filter), hoặc gọi res.flush() sau mỗi res.write(chunk).']),
    qn('c5', ['Keep-alive, measured on loopback. Which statements are true? (choose all that apply)', 'Keep-alive, đo trên loopback. Những câu nào đúng? (chọn mọi câu đúng)'],
      ['500 sequential calls: agent: false 89 ms, globalAgent 36 ms — reuse is 2.5× faster', 'In Node 22 http.globalAgent keeps connections alive by default', 'On loopback 2 sockets beat 20, but with 50 ms of latency the ranking reverses', 'Keep-alive only matters for HTTP/1.0 clients, so modern servers can switch it off'],
      [0, 1, 2],
      ['The mistake today is code that sets agent: false or an old HTTP library. And a benchmark on 127.0.0.1 answers a different question than production does.', 'Sai lầm ngày nay là mã đặt agent: false hoặc thư viện HTTP cũ. Và benchmark trên 127.0.0.1 trả lời một câu hỏi khác với production.']),
  ],
  goiY: [['Compare bytes AND time for each pair of rows.', 'So cả byte LẪN thời gian cho từng cặp dòng.'], ['Content-Encoding is set by whoever compressed first.', 'Content-Encoding do bên nén đầu tiên đặt.']],
  loi: [['Copying a static-asset build setting (brotli 11) into a dynamic API: 24 req/s.', 'Chép cấu hình build tài nguyên tĩnh (brotli 11) vào API động: 24 req/s.'], ['Assuming the proxy compresses because its config says gzip on.', 'Cho rằng proxy nén vì cấu hình của nó ghi gzip on.']],
  tns: [tn('compression level', 'mức nén'), tn('Content-Encoding', 'Content-Encoding'), tn('keep-alive', 'giữ kết nối'), tn('SSE', 'Server-Sent Events')],
  kn: ['compression', 'HTTP', 'performance'],
});

function compressionTrade(bytes, compressedBytes, cpuMs, mbps) {
  // Thời gian trên đường truyền = bit ÷ băng thông. 10 Mbit/s = 10.000.000 bit/s. (Phép tính, không phải phép đo.)
  const wire = (b) => ((b * 8) / (mbps * 1e6)) * 1000;
  const r1 = (x) => Number(x.toFixed(1));
  const saved = wire(bytes) - wire(compressedBytes);
  return { wireBeforeMs: r1(wire(bytes)), wireAfterMs: r1(wire(compressedBytes)), savedMs: r1(saved), netMs: r1(saved - cpuMs), worth: saved > cpuMs };
}
const E2 = await jsBai({
  ten: 'compressionTrade(bytes, compressedBytes, cpuMs, mbps): milliseconds on the wire vs milliseconds of CPU', kho: 'EASY', phut: 7,
  en: '<p>Compression openly trades CPU for bandwidth. Write <code>compressionTrade(bytes, compressedBytes, cpuMs, mbps)</code>: the time on a <code>mbps</code> Mbit/s link is <code>bytes × 8 / (mbps × 10<sup>6</sup>)</code> seconds. Return <code>{ wireBeforeMs, wireAfterMs, savedMs, netMs, worth }</code>: wire times before/after, <code>savedMs</code> = before − after, <code>netMs</code> = saved − <code>cpuMs</code> (all rounded to 1 decimal at the end), <code>worth</code> = saved &gt; cpuMs (unrounded).</p>',
  vi: '<p>Nén công khai đổi CPU lấy băng thông. Viết <code>compressionTrade(bytes, compressedBytes, cpuMs, mbps)</code>: thời gian trên đường truyền <code>mbps</code> Mbit/s là <code>bytes × 8 / (mbps × 10<sup>6</sup>)</code> giây. Trả về <code>{ wireBeforeMs, wireAfterMs, savedMs, netMs, worth }</code>: thời gian truyền trước/sau, <code>savedMs</code> = trước − sau, <code>netMs</code> = tiết kiệm − <code>cpuMs</code> (tất cả làm tròn 1 chữ số ở cuối), <code>worth</code> = tiết kiệm &gt; cpuMs (chưa làm tròn).</p>',
  goiY: [['Bytes → bits (× 8), Mbit/s → bit/s (× 10^6), seconds → ms (× 1000).', 'Byte → bit (× 8), Mbit/s → bit/s (× 10^6), giây → ms (× 1000).'], ['Compute with full precision and round only the returned numbers.', 'Tính với độ chính xác đầy đủ và chỉ làm tròn các số trả về.']],
  loi: [['Forgetting × 8: bytes are not bits, so every wire time is 8× too small.', 'Quên × 8: byte không phải bit, nên mọi thời gian truyền nhỏ đi 8 lần.'], ['Counting the CPU once per server instead of once per response: it is paid on every request, on the same CPU that serves requests.', 'Tính CPU một lần cho cả server thay vì mỗi response: nó bị trả ở mọi request, trên chính CPU đang phục vụ request.']],
  gt: ['On 10 Mbit/s the uncompressed 145,361 B take 116 ms; gzip 1 or brotli 4 bring that to ~27 / 25 ms — about 90 ms saved for ~0.6–1 ms of CPU, usually worth it for a phone. brotli 11 at 147.79 ms costs more CPU than it saves on the wire.', 'Ở 10 Mbit/s, 145.361 B chưa nén mất 116 ms; gzip 1 hay brotli 4 đưa về ~27 / 25 ms — tiết kiệm khoảng 90 ms đổi lấy ~0,6–1 ms CPU, thường đáng với điện thoại. brotli 11 tốn 147,79 ms CPU, nhiều hơn phần tiết kiệm trên đường truyền.'],
  kn: ['compression', 'networking'],
  tns: [tn('bandwidth', 'băng thông'), tn('Mbit/s', 'megabit mỗi giây')],
  dau: `/** wire time saved vs CPU spent */
function compressionTrade(bytes, compressedBytes, cpuMs, mbps) {
  // Write your solution here
  const wire = (b) => b / (mbps * 1e6) * 1000;
  const saved = wire(bytes) - wire(compressedBytes);
  return { wireBeforeMs: wire(bytes), wireAfterMs: wire(compressedBytes), savedMs: saved, netMs: saved - cpuMs, worth: saved > cpuMs };
}
`,
  giai: '// Reference solution\n' + nguon(compressionTrade),
  cases: [
    { goi: goi('compressionTrade', 145361, 33500, 0.57, 10), moTa: ['gzip level 1 on 10 Mbit/s', 'gzip mức 1 trên 10 Mbit/s'] },
    { goi: goi('compressionTrade', 145361, 21734, 147.79, 10), moTa: ['brotli quality 11 on 10 Mbit/s', 'brotli quality 11 trên 10 Mbit/s'] },
    { goi: goi('compressionTrade', 145361, 26564, 3.31, 1000), an: true },
    { goi: goi('compressionTrade', 800, 700, 0.05, 10), an: true },
  ],
});

function chooseEncoding({ acceptEncoding = '', accept = '', contentType = '', bytes }) {
  // 1) Luồng (SSE): không nén — middleware sẽ gom output và luồng thôi chảy.
  if (/text\/event-stream/i.test(accept) || /text\/event-stream/i.test(contentType)) return { encoding: 'identity' };
  // 2) Đã nén sẵn (jpg, png, mp4, zip…): nén lại là đốt CPU lấy ~0%.
  if (/^(image\/(?!svg)|video\/|audio\/)|application\/(zip|gzip|x-gzip|pdf)/i.test(contentType)) return { encoding: 'identity' };
  // 3) Dưới 1 KB: header và khung dữ liệu ăn hết phần lợi.
  if (bytes < 1024) return { encoding: 'identity' };
  // 4) Client chấp nhận gì? q=0 nghĩa là "không".
  const ok = {};
  for (const part of acceptEncoding.split(',')) {
    const [name, ...params] = part.trim().toLowerCase().split(';');
    if (!name) continue;
    const qp = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
    ok[name] = qp ? Number(qp.slice(2)) > 0 : true;
  }
  if (ok.br) return { encoding: 'br', quality: 4 };      // dữ liệu động: mức thấp, đừng vặn lên
  if (ok.gzip) return { encoding: 'gzip', level: 1 };
  return { encoding: 'identity' };
}
const E3 = await jsBai({
  ten: 'chooseEncoding(req): the five-line compression policy as code', kho: 'MEDIUM', phut: 15,
  en: '<p>Turn the lesson’s policy for <b>dynamic</b> responses into a function. <code>chooseEncoding({ acceptEncoding, accept, contentType, bytes })</code> returns, checking in this order:</p><ol><li><code>{ encoding: "identity" }</code> when <code>accept</code> or <code>contentType</code> contains <code>text/event-stream</code>;</li><li><code>{ encoding: "identity" }</code> for already-compressed types: <code>image/*</code> except <code>image/svg+xml</code>, <code>video/*</code>, <code>audio/*</code>, <code>application/zip</code>, <code>application/gzip</code>, <code>application/pdf</code>;</li><li><code>{ encoding: "identity" }</code> when <code>bytes &lt; 1024</code>;</li><li><code>{ encoding: "br", quality: 4 }</code> if the client accepts <code>br</code>, else <code>{ encoding: "gzip", level: 1 }</code> if it accepts <code>gzip</code>, else identity.</li></ol><p><code>acceptEncoding</code> is a comma list such as <code>"gzip, deflate, br;q=0"</code>; a coding with <code>q=0</code> is <b>not</b> accepted; names are case-insensitive.</p>',
  vi: '<p>Biến chính sách của bài cho response <b>động</b> thành một hàm. <code>chooseEncoding({ acceptEncoding, accept, contentType, bytes })</code> trả về, xét theo thứ tự:</p><ol><li><code>{ encoding: "identity" }</code> khi <code>accept</code> hoặc <code>contentType</code> chứa <code>text/event-stream</code>;</li><li><code>{ encoding: "identity" }</code> với kiểu đã nén sẵn: <code>image/*</code> trừ <code>image/svg+xml</code>, <code>video/*</code>, <code>audio/*</code>, <code>application/zip</code>, <code>application/gzip</code>, <code>application/pdf</code>;</li><li><code>{ encoding: "identity" }</code> khi <code>bytes &lt; 1024</code>;</li><li><code>{ encoding: "br", quality: 4 }</code> nếu client nhận <code>br</code>, không thì <code>{ encoding: "gzip", level: 1 }</code> nếu nhận <code>gzip</code>, không thì identity.</li></ol><p><code>acceptEncoding</code> là danh sách phẩy như <code>"gzip, deflate, br;q=0"</code>; mã nén có <code>q=0</code> là <b>không</b> được nhận; tên không phân biệt hoa thường.</p>',
  goiY: [['Split on ",", then on ";" — the first piece is the name, a "q=…" piece is its weight.', 'Tách theo ",", rồi theo ";" — mảnh đầu là tên, mảnh "q=…" là trọng số.'], ['Write the three identity checks first; only then look at what the client accepts.', 'Viết ba phép kiểm identity trước; chỉ sau đó mới xem client nhận gì.']],
  loi: [['acceptEncoding.includes("br"): "br;q=0" means the client refuses brotli, and includes() says yes.', 'acceptEncoding.includes("br"): "br;q=0" nghĩa là client từ chối brotli, còn includes() bảo có.'], ['Compressing SSE: the stream works locally and silently stops behind the proxy.', 'Nén SSE: luồng chạy ở máy rồi âm thầm ngừng sau proxy.']],
  gt: ['Live server, same 145 KB body: no compression 3,560 req/s, gzip 1 −28.5%, brotli 4 −36.2%, gzip 6 −69.5%, brotli 11 24 req/s. Low levels for dynamic data, nothing for tiny or already-compressed bodies, never for streams — and static bundles are pre-compressed once at build time instead.', 'Server thật, cùng body 145 KB: không nén 3.560 req/s, gzip 1 −28,5%, brotli 4 −36,2%, gzip 6 −69,5%, brotli 11 còn 24 req/s. Mức thấp cho dữ liệu động, không nén body nhỏ hay đã nén sẵn, không bao giờ nén luồng — còn bundle tĩnh thì nén sẵn một lần lúc build.'],
  kn: ['compression', 'HTTP headers', 'parsing'],
  tns: [tn('Accept-Encoding', 'Accept-Encoding', 'which codings the client can decode'), tn('q-value', 'trọng số q', 'q=0 means “not acceptable”'), tn('identity', 'identity', 'no compression')],
  dau: `/** pick the response compression */
function chooseEncoding({ acceptEncoding = '', accept = '', contentType = '', bytes }) {
  // Write your solution here
  if (acceptEncoding.includes('br')) return { encoding: 'br', quality: 11 };
  if (acceptEncoding.includes('gzip')) return { encoding: 'gzip', level: 9 };
  return { encoding: 'identity' };
}
`,
  giai: '// Reference solution\n' + nguon(chooseEncoding),
  cases: [
    { goi: 'chooseEncoding({ acceptEncoding: "gzip, deflate, br", contentType: "application/json", bytes: 145119 })', moTa: ['A browser asking for a 145 KB JSON list', 'Trình duyệt xin danh sách JSON 145 KB'] },
    { goi: 'chooseEncoding({ acceptEncoding: "gzip", accept: "text/event-stream", contentType: "text/event-stream", bytes: 5000 })', moTa: ['An SSE dashboard', 'Dashboard SSE'] },
    { goi: '[chooseEncoding({ acceptEncoding: "gzip, br", contentType: "application/json", bytes: 600 }), chooseEncoding({ acceptEncoding: "gzip, br", contentType: "image/jpeg", bytes: 900000 }), chooseEncoding({ acceptEncoding: "gzip, br", contentType: "image/svg+xml", bytes: 4096 })]', an: true },
    { goi: '[chooseEncoding({ acceptEncoding: "gzip, BR;q=0", contentType: "application/json", bytes: 2048 }), chooseEncoding({ acceptEncoding: "identity", contentType: "text/html", bytes: 2048 }), chooseEncoding({ acceptEncoding: "br;q=0.5", contentType: "text/css", bytes: 2048 })]', an: true },
    { goi: 'chooseEncoding({ contentType: "application/json", bytes: 1024 })', an: true },
  ],
});

function compareLevels(rows, budgetMs) {
  // Dòng bị "lấn át": có dòng khác vừa ≤ byte vừa ≤ thời gian, và hơn hẳn ở ít nhất một mặt — không có lý do chọn nó.
  const dominated = rows.filter((r) => rows.some((o) => o !== r && o.bytes <= r.bytes && o.ms <= r.ms && (o.bytes < r.bytes || o.ms < r.ms))).map((r) => r.name);
  // Trong ngân sách CPU: chọn đầu ra nhỏ nhất; hoà thì nhanh hơn.
  const fit = rows.filter((r) => r.ms <= budgetMs).sort((a, b) => a.bytes - b.bytes || a.ms - b.ms);
  return { pick: fit.length ? fit[0].name : null, dominated };
}
const VARIED = [
  { name: 'gzip-1', bytes: 33500, ms: 0.57 }, { name: 'gzip-6', bytes: 26564, ms: 3.31 }, { name: 'gzip-9', bytes: 26377, ms: 5.03 },
  { name: 'br-4', bytes: 31269, ms: 1.0 }, { name: 'br-9', bytes: 24211, ms: 5.5 }, { name: 'br-11', bytes: 21734, ms: 147.79 },
];
const REPET = [{ name: 'br-4', bytes: 1322, ms: 0.13 }, { name: 'br-11', bytes: 1434, ms: 131.34 }];
const E4 = await jsBai({
  ten: 'compareLevels(rows, budgetMs): which settings are never worth choosing, and which one fits the CPU budget', kho: 'HARD', phut: 16,
  en: '<p>Each row is one measured setting <code>{ name, bytes, ms }</code> (output size, CPU time per response). Write <code>compareLevels(rows, budgetMs)</code> returning <code>{ pick, dominated }</code>:</p><ul><li><code>dominated</code> — names (in input order) of rows for which some <b>other</b> row is at least as small <b>and</b> at least as fast, and strictly better in at least one of the two;</li><li><code>pick</code> — among rows with <code>ms ≤ budgetMs</code>, the one with the fewest bytes (ties: the faster one); <code>null</code> if none fits.</li></ul>',
  vi: '<p>Mỗi dòng là một cấu hình đã đo <code>{ name, bytes, ms }</code> (kích thước đầu ra, thời gian CPU mỗi response). Viết <code>compareLevels(rows, budgetMs)</code> trả về <code>{ pick, dominated }</code>:</p><ul><li><code>dominated</code> — tên (theo thứ tự đầu vào) các dòng mà có một dòng <b>khác</b> vừa nhỏ bằng hoặc hơn <b>vừa</b> nhanh bằng hoặc hơn, và hơn hẳn ở ít nhất một trong hai;</li><li><code>pick</code> — trong các dòng có <code>ms ≤ budgetMs</code>, dòng ít byte nhất (hoà: dòng nhanh hơn); <code>null</code> nếu không dòng nào vừa.</li></ul>',
  goiY: [['Dominated: rows.some(o => o !== r && o.bytes <= r.bytes && o.ms <= r.ms && (o.bytes < r.bytes || o.ms < r.ms)).', 'Bị lấn át: rows.some(o => o !== r && o.bytes <= r.bytes && o.ms <= r.ms && (o.bytes < r.bytes || o.ms < r.ms)).'], ['Filter by budget, then sort by bytes and then ms.', 'Lọc theo ngân sách, rồi sắp theo byte rồi ms.']],
  loi: [['Picking the highest level because it is “the best compression”: on repetitive data brotli 11 is bigger than brotli 4.', 'Chọn mức cao nhất vì “nén tốt nhất”: trên dữ liệu lặp lại brotli 11 còn to hơn brotli 4.'], ['Calling a row dominated when it is only worse on one side: gzip-9 is slower than br-4 but smaller, so it is a trade, not a loss.', 'Gọi một dòng là bị lấn át khi nó chỉ kém ở một mặt: gzip-9 chậm hơn br-4 nhưng nhỏ hơn, nên đó là đánh đổi, không phải thua.']],
  gt: ['Ratio and cost move in opposite directions, so most settings are a trade — except the ones that are worse in both dimensions, like brotli 11 on repetitive data. Picking under a per-response CPU budget is the honest version of “gzip level 1 or brotli 4 for dynamic JSON”.', 'Tỉ lệ nén và chi phí đi ngược chiều nhau, nên đa số cấu hình là đánh đổi — trừ những cái kém ở cả hai mặt, như brotli 11 trên dữ liệu lặp lại. Chọn theo ngân sách CPU mỗi response là phiên bản trung thực của “gzip mức 1 hoặc brotli 4 cho JSON động”.'],
  kn: ['compression', 'trade-offs'],
  tns: [tn('dominated option', 'phương án bị lấn át', 'worse or equal on every axis'), tn('CPU budget', 'ngân sách CPU')],
  dau: `/** which compression settings make sense? */
function compareLevels(rows, budgetMs) {
  // Write your solution here
  const best = rows.slice().sort((a, b) => a.bytes - b.bytes)[0];
  return { pick: best.name, dominated: [] };
}
`,
  giai: '// Reference solution\n' + nguon(compareLevels),
  cases: [
    { goi: goi('compareLevels', VARIED, 2), moTa: ['Varied JSON, 2 ms of CPU per response', 'JSON đa dạng, 2 ms CPU mỗi response'] },
    { goi: goi('compareLevels', REPET, 200), moTa: ['Repetitive JSON, generous budget', 'JSON lặp lại, ngân sách rộng'] },
    { goi: goi('compareLevels', VARIED, 0.1), an: true },
    { goi: goi('compareLevels', [...VARIED, { name: 'gzip-6-copy', bytes: 26564, ms: 3.31 }, { name: 'zstd-3', bytes: 26000, ms: 0.9 }], 6), an: true },
  ],
});

export default modul('nodejs-16-3-nen-va-duong-truyen', '16.3 Compression and keep-alive: trading CPU for bandwidth', [E1, E2, E3, E4]);
