/** Node.js 10.4 — Phục vụ media trở lại: định dạng, cache immutable, HEAD nói dối về CDN, 304/206, proxy vs URL trực tiếp, và xoá. */
import { modul, cs, q, qn, tn, jsBai, nguon, MOI_TRUONG } from './_node-c9-11.mjs';

/* ─── 1. EASY · choice ─── */
const E1 = cs({
  ten: 'The read path: formats, cache headers and the CDN', kho: 'EASY', phut: 10,
  en: 'From the lesson: sharp on two 4032×3024 sources, the real headers of media.cuongthai.com, the HEAD-vs-GET trap at Cloudflare, 304/206/404, and the cost of proxying media through the API.',
  vi: 'Từ bài: sharp trên hai ảnh nguồn 4032×3024, header thật của media.cuongthai.com, bẫy HEAD và GET ở Cloudflare, 304/206/404, và cái giá của việc proxy media qua API.',
  cau: [
    q('c1', ['What saved the most bytes on the smooth 298.6 KB photo?', 'Điều gì tiết kiệm nhiều byte nhất trên ảnh mượt 298,6 KB?'],
      ['Resizing: 4032 px → 1200 px removed about 92% before the format mattered', 'Switching JPEG to WebP, which is always about 30% smaller', 'AVIF q50, because it is the smallest at every size', 'Lowering JPEG quality from 80 to 50'],
      ['Resizing dominates everything. WebP beat JPEG 2.25× on smooth content but lost slightly on noisy content; AVIF is smallest but 4–12× slower to encode.', 'Thu nhỏ quan trọng hơn mọi thứ. WebP thắng JPEG 2,25× trên ảnh mượt nhưng thua nhẹ trên ảnh nhiễu; AVIF nhỏ nhất nhưng mã hoá chậm hơn 4–12×.']),
    q('c2', ['Why is <code>cache-control: public, max-age=31536000, immutable</code> safe on this site’s media?', 'Vì sao <code>cache-control: public, max-age=31536000, immutable</code> an toàn với media của site này?'],
      ['Keys contain a timestamp and random bytes, so a changed image is a different key, never a changed object', 'Cloudflare purges the cache automatically whenever an object is overwritten', 'Browsers revalidate immutable objects once a day anyway', 'R2 refuses to overwrite an object that has immutable in its metadata'],
      ['"Content-addressed keys and immutable are the same decision made twice." On a mutable key (avatars/u7.jpg) users would see the old avatar for a year.', '"Khoá theo nội dung và immutable là cùng một quyết định đưa ra hai lần." Với khoá đổi được (avatars/u7.jpg) người dùng thấy ảnh cũ suốt một năm.']),
    q('c3', ['<code>curl -I</code> on the cover image shows <code>cf-cache-status: DYNAMIC</code> three times. What does that prove?', '<code>curl -I</code> lên ảnh bìa cho <code>cf-cache-status: DYNAMIC</code> ba lần. Điều đó chứng minh gì?'],
      ['Nothing: -I sends HEAD, which Cloudflare answers with DYNAMIC; a GET showed HIT with age 27107', 'That Cloudflare is not caching the object at the edge', 'That the object has no Cache-Control header in R2', 'That the cache is cold and the next request will be a HIT'],
      ['Verify a CDN with <code>curl -s -o /dev/null -D -</code> (a GET) and read <code>age</code>, which a cold cache cannot fake.', 'Kiểm CDN bằng <code>curl -s -o /dev/null -D -</code> (một GET) và đọc <code>age</code>, thứ cache lạnh không giả được.']),
    q('c4', ['A private invoice must be checked on every read but you want the bytes off your server. Best option from the lesson?', 'Một hoá đơn riêng tư phải kiểm quyền mỗi lần đọc nhưng bạn muốn byte không đi qua máy chủ. Phương án tốt nhất trong bài?'],
      ['The API checks permission and answers 302 to a presigned URL valid for a few minutes', 'A public URL with immutable caching, since the key is unguessable', 'A proxy route that buffers the object and sends it with res.send', 'Embedding a one-week presigned URL in the cached HTML page'],
      ['The 302 keeps the access check and still keeps the transfer off your server. Buffering in a proxy cost RSS 69.8 → 125.9 MB for 20 requests; a presigned URL inside cached HTML outlives its signature and 403s later.', '302 giữ được phép kiểm quyền mà byte vẫn không đi qua máy chủ. Proxy đệm tốn RSS 69,8 → 125,9 MB cho 20 request; URL ký sẵn trong HTML được cache sống lâu hơn chữ ký và 403 về sau.']),
    qn('c5', ['Which are real read-path mistakes from the lesson? (choose all)', 'Cái nào là lỗi thật ở đường đọc trong bài? (chọn mọi câu đúng)'],
      ['No Cache-Control on the object at PutObject time', 'Serving user uploads from the main domain that holds the cookies', 'A media proxy that does not implement Range — video seeking breaks', 'Forgetting Content-Disposition: attachment on documents', 'Serving public images from a separate media domain through a CDN'],
      [0, 1, 2, 3],
      ['The last one is the recommended setup. The other four are on the lesson’s list of six.', 'Cái cuối là cách được khuyên dùng. Bốn cái kia nằm trong danh sách sáu lỗi của bài.']),
  ],
  goiY: [['Re-read the three "honest readings" after measurement 1.', 'Đọc lại ba "cách đọc trung thực" sau phép đo 1.'], ['The HEAD/GET pitfall box explains question 3.', 'Khung bẫy HEAD/GET giải thích câu 3.']],
  loi: [['Concluding "the CDN is not caching" from curl -I.', 'Kết luận "CDN không cache" từ curl -I.'], ['Putting immutable on a key that gets overwritten.', 'Đặt immutable lên khoá bị ghi đè.']],
  tns: [tn('immutable', 'bất biến', 'trình duyệt không cần hỏi lại'), tn('CDN edge', 'máy chủ biên của CDN', 'bản sao gần người dùng'), tn('age', 'tuổi trong cache', 'số giây object đã nằm ở edge')],
  kn: ['caching', 'CDN', 'media'],
});

/* ─── 2. EASY · js — header lưu cùng object ─── */
function mediaHeadersFor(key) {
  const TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif', gif: 'image/gif', mp4: 'video/mp4', mp3: 'audio/mpeg', pdf: 'application/pdf' };
  const last = String(key).split('/').pop();
  const ext = (/\.([a-z0-9]+)$/i.exec(last) || [])[1];
  // Content-Type comes from OUR extension (the key was rebuilt, e.g. ".webp"), never from the client's original string.
  const contentType = (ext && TYPES[ext.toLowerCase()]) || 'application/octet-stream';
  // immutable is only true if the key can never be reused: Date.now()-<12 hex> names are content-addressed in practice.
  const contentAddressed = /^\d{13}-[0-9a-f]{12}\.[a-z0-9]+$/.test(last);
  const cacheControl = contentAddressed ? 'public, max-age=31536000, immutable' : 'public, no-cache';
  // A document is downloaded, not rendered: an HTML file missed by validation will not run.
  const contentDisposition = String(key).startsWith('documents/') ? 'attachment' : null;
  return { contentType, cacheControl, contentDisposition };
}

const E2 = jsBai({
  ten: 'Choose the headers to store with each object', kho: 'EASY', phut: 12,
  en: `<p>"Set it at PutObject time; it is stored with the object." Write <code>mediaHeadersFor(key)</code> → <code>{ contentType, cacheControl, contentDisposition }</code>:</p>
<ul><li><code>contentType</code> from the key’s extension (case-insensitive): jpg/jpeg → <code>image/jpeg</code>, png, webp, avif, gif → <code>image/&lt;ext&gt;</code>, mp4 → <code>video/mp4</code>, mp3 → <code>audio/mpeg</code>, pdf → <code>application/pdf</code>; anything else (or none) → <code>application/octet-stream</code>;</li>
<li><code>cacheControl</code>: <code>public, max-age=31536000, immutable</code> only if the last segment is content-addressed — <code>&lt;13 digits&gt;-&lt;12 hex&gt;.&lt;ext&gt;</code>, hex and extension in lower case exactly as <code>buildKey</code> writes them; otherwise <code>public, no-cache</code> (a key that can be overwritten, like <code>avatars/u7.jpg</code>);</li>
<li><code>contentDisposition</code>: <code>attachment</code> for keys under <code>documents/</code>, otherwise <code>null</code>.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>"Đặt nó lúc PutObject; nó được lưu cùng object." Viết <code>mediaHeadersFor(key)</code> → <code>{ contentType, cacheControl, contentDisposition }</code>:</p>
<ul><li><code>contentType</code> theo đuôi của khoá (không phân biệt hoa thường): jpg/jpeg → <code>image/jpeg</code>, png, webp, avif, gif → <code>image/&lt;đuôi&gt;</code>, mp4 → <code>video/mp4</code>, mp3 → <code>audio/mpeg</code>, pdf → <code>application/pdf</code>; còn lại (hoặc không có) → <code>application/octet-stream</code>;</li>
<li><code>cacheControl</code>: <code>public, max-age=31536000, immutable</code> chỉ khi đoạn cuối là khoá theo nội dung — <code>&lt;13 chữ số&gt;-&lt;12 hex&gt;.&lt;đuôi&gt;</code>, hex và đuôi viết thường đúng như <code>buildKey</code> ghi; không thì <code>public, no-cache</code> (khoá có thể bị ghi đè, như <code>avatars/u7.jpg</code>);</li>
<li><code>contentDisposition</code>: <code>attachment</code> cho khoá dưới <code>documents/</code>, không thì <code>null</code>.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['Work on the last path segment: <code>key.split("/").pop()</code>.', 'Làm trên đoạn cuối của đường dẫn: <code>key.split("/").pop()</code>.'], ['One regex decides immutability: <code>/^\\d{13}-[0-9a-f]{12}\\.[a-z0-9]+$/</code>.', 'Một regex quyết định tính bất biến: <code>/^\\d{13}-[0-9a-f]{12}\\.[a-z0-9]+$/</code>.']],
  loi: [['immutable on every key — the overwritten avatar stays old for a year and no refresh helps.', 'immutable cho mọi khoá — avatar bị ghi đè giữ bản cũ suốt một năm, làm mới cũng vô ích.'], ['Echoing the MIME the client uploaded with — validation on the way in is pointless if you echo their MIME on the way out.', 'Lặp lại MIME client gửi lúc upload — kiểm lúc vào là vô nghĩa nếu lúc ra lại dùng MIME của họ.'], ['Serving PDFs inline: a document you meant to be downloaded opens in the page.', 'Phục vụ PDF dạng inline: tài liệu bạn định cho tải về lại mở ngay trong trang.']],
  gt: ['Headers stored with the object are served by the storage and the CDN with no code of yours in the read path, so they must be right at write time. A long immutable lifetime is only correct when the key itself changes whenever the content changes; a reusable key gets <code>no-cache</code>, which still allows a cheap 304 via the ETag. Deriving the type from a server-chosen extension closes mistake (4).', 'Header lưu cùng object được storage và CDN phục vụ mà không có dòng code nào của bạn trên đường đọc, nên chúng phải đúng ngay lúc ghi. Thời hạn dài immutable chỉ đúng khi chính khoá đổi mỗi khi nội dung đổi; khoá dùng lại nhận <code>no-cache</code>, vẫn cho phép 304 rẻ nhờ ETag. Lấy kiểu từ đuôi do máy chủ chọn là đóng lỗi (4).'],
  kn: ['caching', 'object storage'],
  tns: [tn('Cache-Control', 'chỉ dẫn cache', 'public / max-age / immutable / no-cache'), tn('Content-Disposition', 'cách trình bày', 'attachment = tải xuống, không hiển thị')],
  dau: `/** Headers to store with an object at PutObject time. */
function mediaHeadersFor(key) {
  // Write your solution here
  return { contentType: 'image/' + key.split('.').pop(), cacheControl: 'public, max-age=31536000, immutable', contentDisposition: null };
}
`,
  giai: '// Reference solution\n' + nguon(mediaHeadersFor),
  cases: [
    { goi: `mediaHeadersFor('images/post/u7/1753660000000-a1b2c3d4e5f6.webp')`, moTa: ['A content-addressed image', 'Ảnh có khoá theo nội dung'] },
    { goi: `mediaHeadersFor('avatars/u7.jpg')`, moTa: ['A mutable avatar key', 'Khoá avatar đổi được'] },
    { goi: `mediaHeadersFor('documents/u7/1753660000000-a1b2c3d4e5f6.pdf')`, moTa: ['A document is downloaded', 'Tài liệu được tải xuống'] },
    { goi: `[mediaHeadersFor('video/u7/1753660001234-deadbeef1234.MP4'), mediaHeadersFor('audio/u2/1753660001234-deadbeef1234.mp3'), mediaHeadersFor('images/course-covers/nodejs.png')]`, an: true },
    { goi: `[mediaHeadersFor('documents/u1/1753660000000-a1b2c3d4e5f6.html'), mediaHeadersFor('images/post/u7/175366000000-a1b2c3d4e5f6.jpg'), mediaHeadersFor('images/post/u7/1753660000000-A1B2C3D4E5F6.jpg'), mediaHeadersFor('misc/README')]`, an: true },
  ],
});

/* ─── 3. MEDIUM · js — getMediaUrl và vết sẹo blob: ─── */
function getMediaUrl(lp, base) {
  if (lp === null || lp === undefined || lp === '') return '';
  const s = String(lp);
  // The scar: object/data URLs are ALREADY renderable. Prepending the CDN made https://<r2>/blob:https://… → 400.
  if (s.startsWith('blob:') || s.startsWith('data:')) return s;
  // Absolute URLs (an external thumbnail, an already-resolved URL) are left alone.
  if (/^https?:\/\//i.test(s)) return s;
  // A bare key: join with exactly one slash, whatever the config or the key carries.
  return String(base).replace(/\/+$/, '') + '/' + s.replace(/^\/+/, '');
}

const E3 = jsBai({
  ten: 'Turn a stored key into a URL — and keep the blob: scar', kho: 'MEDIUM', phut: 12,
  en: `<p><code>getMediaUrl()</code> in <code>frontend/src/lib/utils.ts</code> turns a bare key into a full URL, "and its first branch is a scar": an optimistic preview made by <code>URL.createObjectURL()</code> got the CDN base prepended → <code>https://&lt;r2&gt;/blob:https://…</code> → 400 on every in-flight preview. Write <code>getMediaUrl(lp, base)</code>:</p>
<ul><li><code>null</code>, <code>undefined</code> or <code>''</code> → <code>''</code>;</li>
<li>starts with <code>blob:</code> or <code>data:</code> → returned unchanged;</li>
<li>an absolute <code>http://</code> / <code>https://</code> URL (any case) → unchanged;</li>
<li>otherwise it is a key: <code>base</code> without trailing slashes + <code>/</code> + key without leading slashes.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p><code>getMediaUrl()</code> trong <code>frontend/src/lib/utils.ts</code> biến khoá trần thành URL đầy đủ, "và nhánh đầu tiên của nó là một vết sẹo": ảnh xem trước lạc quan tạo bằng <code>URL.createObjectURL()</code> bị dán gốc CDN vào trước → <code>https://&lt;r2&gt;/blob:https://…</code> → 400 với mọi ảnh xem trước đang upload. Viết <code>getMediaUrl(lp, base)</code>:</p>
<ul><li><code>null</code>, <code>undefined</code> hoặc <code>''</code> → <code>''</code>;</li>
<li>bắt đầu bằng <code>blob:</code> hoặc <code>data:</code> → giữ nguyên;</li>
<li>URL tuyệt đối <code>http://</code> / <code>https://</code> (mọi kiểu chữ) → giữ nguyên;</li>
<li>còn lại là khoá: <code>base</code> bỏ gạch chéo cuối + <code>/</code> + khoá bỏ gạch chéo đầu.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['Order matters: handle blob:/data: before deciding it is a key.', 'Thứ tự quan trọng: xử lý blob:/data: trước khi coi nó là khoá.'], ['<code>base.replace(/\\/+$/, "")</code> and <code>key.replace(/^\\/+/, "")</code> avoid both <code>//</code> and a missing slash.', '<code>base.replace(/\\/+$/, "")</code> và <code>key.replace(/^\\/+/, "")</code> tránh cả <code>//</code> lẫn thiếu gạch chéo.']],
  loi: [['Prepending the CDN to everything (the original bug).', 'Dán CDN vào trước mọi thứ (lỗi gốc).'], ['<code>base + "/" + key</code> with a base that already ends in <code>/</code>: <code>…com//images/…</code>.', '<code>base + "/" + key</code> với base đã có <code>/</code> ở cuối: <code>…com//images/…</code>.'], ['Treating a relative CourseCard thumbnail as fine — CourseCard uses thumbnailUrl directly, so it must be absolute.', 'Coi ảnh bìa tương đối của CourseCard là ổn — CourseCard dùng thẳng thumbnailUrl nên nó phải tuyệt đối.']],
  gt: ['A URL helper has to recognise everything that is already a URL before it treats a string as a key. Object and data URLs are renderable as they are; absolute URLs belong to someone else; only a bare key needs the media domain. Normalising the slashes on both sides makes the result independent of how the environment variable was written.', 'Một hàm phụ cho URL phải nhận ra mọi thứ đã là URL trước khi coi một chuỗi là khoá. URL object và data hiển thị được ngay; URL tuyệt đối là của nơi khác; chỉ khoá trần mới cần tên miền media. Chuẩn hoá gạch chéo cả hai phía làm kết quả không phụ thuộc vào cách biến môi trường được viết.'],
  kn: ['URLs', 'frontend'],
  tns: [tn('object URL', 'URL đối tượng', 'blob:… do URL.createObjectURL tạo'), tn('optimistic preview', 'xem trước lạc quan', 'hiện ảnh trước khi upload xong')],
  dau: `/** Bare key -> full media URL. */
function getMediaUrl(lp, base) {
  // Write your solution here
  if (!lp) return '';
  if (lp.startsWith('http')) return lp;
  return base + '/' + lp;
}
`,
  giai: '// Reference solution\n' + nguon(getMediaUrl),
  cases: [
    { goi: `getMediaUrl('images/course-covers/nodejs.png', 'https://media.cuongthai.com')`, moTa: ['A bare key', 'Một khoá trần'] },
    { goi: `getMediaUrl('blob:https://cuongthai.com/7c1e2a40-9f1d-4b8e-a3c2-1f2e3d4c5b6a', 'https://media.cuongthai.com')`, moTa: ['The scar: an optimistic preview', 'Vết sẹo: ảnh xem trước lạc quan'] },
    { goi: `[getMediaUrl('/images/a.webp', 'https://media.cuongthai.com/'), getMediaUrl(null, 'https://media.cuongthai.com'), getMediaUrl('https://i.ytimg.com/vi/x/hq.jpg', 'https://media.cuongthai.com')]`, moTa: ['Slashes, null, a foreign URL', 'Gạch chéo, null, URL của nơi khác'] },
    { goi: `[getMediaUrl('data:image/png;base64,iVBORw0KGgo=', 'https://m.example'), getMediaUrl('HTTPS://X.example/a.png', 'https://m.example'), getMediaUrl(undefined, 'x'), getMediaUrl('', 'x')]`, an: true },
    { goi: `[getMediaUrl('//images/x.jpg', 'https://media.cuongthai.com///'), getMediaUrl('http-docs/u1/a.pdf', 'https://media.cuongthai.com'), getMediaUrl('blobs/u1/a.bin', 'https://media.cuongthai.com')]`, an: true },
  ],
});

/* ─── 4. MEDIUM · js — 304 và 206 khi phải tự phục vụ ─── */
function serveObject(headers, obj) {
  if (!obj) return { status: 404, headers: {}, body: '' };
  const size = obj.body.length;
  const base = { 'accept-ranges': 'bytes', etag: obj.etag };
  const h = {};
  for (const k of Object.keys(headers || {})) h[k.toLowerCase()] = String(headers[k]);
  // 1) Conditional GET: the client already has this version ⇒ 304, zero body bytes.
  const inm = h['if-none-match'];
  if (inm !== undefined) {
    const strip = (t) => t.trim().replace(/^W\//, '');                 // weak comparison, like browsers use for GET
    if (inm.trim() === '*' || inm.split(',').map(strip).includes(strip(obj.etag))) return { status: 304, headers: base, body: '' };
  }
  // 2) Range: what makes <video> seekable. One range only; a malformed header is ignored (full 200).
  const m = /^bytes=(\d*)-(\d*)$/.exec((h.range || '').trim());
  if (m && (m[1] !== '' || m[2] !== '')) {
    let start, end;
    if (m[1] === '') { start = Math.max(0, size - Number(m[2])); end = size - 1; }   // bytes=-500: the LAST 500
    else { start = Number(m[1]); end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1); }
    if (start >= size || start > end) return { status: 416, headers: { ...base, 'content-range': 'bytes */' + size }, body: '' };
    return { status: 206, headers: { ...base, 'content-range': 'bytes ' + start + '-' + end + '/' + size, 'content-length': String(end - start + 1) }, body: obj.body.slice(start, end + 1) };
  }
  return { status: 200, headers: { ...base, 'content-length': String(size) }, body: obj.body };
}

const OBJ = String.raw`
const COVER = { etag: '"6a5e9970fab4f24ecec396e4a64ac9d0"', body: 'x'.repeat(1000) + 'ABCDEFGHIJ' };
const VIDEO = { etag: '"v1"', body: '0123456789abcdefghijklmnopqrstuvwxyz' };
`;

const E4 = jsBai({
  ten: 'If you must proxy media: 304 and Range, or seeking breaks', kho: 'MEDIUM', phut: 22,
  en: `<p>Measurement 3: <code>If-None-Match</code> → 304 with 0 bytes; <code>Range: bytes=0-99</code> → 206 with 100 bytes; a missing key → 404. "If you ever proxy media yourself, you must implement Range or seeking silently breaks." Write <code>serveObject(headers, obj)</code> → <code>{ status, headers, body }</code>, where <code>obj</code> is <code>{ etag, body }</code> (a string) or <code>null</code>:</p>
<ul><li><code>null</code> → <code>{ status:404, headers:{}, body:'' }</code>;</li>
<li>every other answer carries <code>accept-ranges: bytes</code> and <code>etag</code> (lower-case header names);</li>
<li><code>if-none-match</code> (request header names are case-insensitive) equal to the etag — comparing without a <code>W/</code> prefix, in a comma-separated list, or <code>*</code> → 304, body <code>''</code>;</li>
<li><code>range: bytes=a-b</code>, <code>bytes=a-</code> or <code>bytes=-n</code> (last n bytes): end is clamped to <code>size-1</code>; start ≥ size → 416 with <code>content-range: bytes */size</code>; otherwise 206 with <code>content-range: bytes start-end/size</code>, <code>content-length</code> and the slice. A malformed range is ignored;</li>
<li>otherwise 200 with <code>content-length</code> and the whole body.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Phép đo 3: <code>If-None-Match</code> → 304 với 0 byte; <code>Range: bytes=0-99</code> → 206 với 100 byte; khoá không có → 404. "Nếu có lúc bạn tự proxy media, bạn phải cài Range, không thì tua video âm thầm hỏng." Viết <code>serveObject(headers, obj)</code> → <code>{ status, headers, body }</code>, với <code>obj</code> là <code>{ etag, body }</code> (chuỗi) hoặc <code>null</code>:</p>
<ul><li><code>null</code> → <code>{ status:404, headers:{}, body:'' }</code>;</li>
<li>mọi câu trả lời khác mang <code>accept-ranges: bytes</code> và <code>etag</code> (tên header viết thường);</li>
<li><code>if-none-match</code> (tên header của request không phân biệt hoa thường) bằng etag — so sau khi bỏ tiền tố <code>W/</code>, trong danh sách cách nhau bằng dấu phẩy, hoặc <code>*</code> → 304, thân <code>''</code>;</li>
<li><code>range: bytes=a-b</code>, <code>bytes=a-</code> hoặc <code>bytes=-n</code> (n byte cuối): end bị kẹp về <code>size-1</code>; start ≥ size → 416 với <code>content-range: bytes */size</code>; còn lại 206 với <code>content-range: bytes start-end/size</code>, <code>content-length</code> và đoạn cắt. Range sai dạng thì bỏ qua;</li>
<li>còn lại 200 với <code>content-length</code> và cả thân.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['Lower-case the request header names first; then handle 404 → 304 → Range → 200 in that order.', 'Viết thường tên header của request trước; rồi xử lý 404 → 304 → Range → 200 theo thứ tự đó.'], ['One regex reads all three range forms: <code>/^bytes=(\\d*)-(\\d*)$/</code>.', 'Một regex đọc cả ba dạng range: <code>/^bytes=(\\d*)-(\\d*)$/</code>.'], ['<code>slice(start, end + 1)</code> — ranges are inclusive on both ends.', '<code>slice(start, end + 1)</code> — range bao gồm cả hai đầu.']],
  loi: [['<code>slice(start, end)</code>: every range is one byte short and the video decoder chokes.', '<code>slice(start, end)</code>: mọi range thiếu một byte và bộ giải mã video nghẹn.'], ['Reading <code>bytes=-500</code> as "from 0 to 500" instead of the last 500 bytes.', 'Đọc <code>bytes=-500</code> thành "từ 0 tới 500" thay vì 500 byte cuối.'], ['Answering 200 to a Range request: the player downloads the whole file to seek.', 'Trả 200 cho request có Range: trình phát tải cả file để tua.']],
  gt: ['A CDN and object storage already do this; a proxy that skips it silently turns every revisit into a full download and every seek into a restart. 304 trades the body for a round trip; 206 lets a video element fetch the bytes around the timestamp. The real conclusion of the lesson is one level up: public media should not go through this code at all.', 'CDN và object storage đã làm sẵn việc này; proxy bỏ qua nó âm thầm biến mỗi lần xem lại thành tải đủ, mỗi lần tua thành bắt đầu lại. 304 đổi thân lấy một vòng đi về; 206 cho thẻ video lấy các byte quanh mốc thời gian. Kết luận thật của bài ở tầng cao hơn: media công khai không nên đi qua đoạn code này chút nào.'],
  kn: ['HTTP caching', 'range requests'],
  tns: [tn('conditional request', 'request có điều kiện', 'If-None-Match + ETag ⇒ 304'), tn('206 Partial Content', 'nội dung một phần', 'trả đúng đoạn byte được hỏi'), tn('416', 'range không đáp ứng được', 'start vượt cỡ file')],
  fakes: OBJ,
  dau: `/** Serve an object with conditional GET and Range support. */
function serveObject(headers, obj) {
  // Write your solution here
  if (!obj) return { status: 404, headers: {}, body: '' };
  return { status: 200, headers: { 'accept-ranges': 'bytes', etag: obj.etag, 'content-length': String(obj.body.length) }, body: obj.body };
}
`,
  giai: '// Reference solution\n' + nguon(serveObject),
  cases: [
    { goi: `(() => { const r = serveObject({ 'If-None-Match': COVER.etag }, COVER); return [r.status, r.body.length, r.headers]; })()`, moTa: ['If-None-Match → 304, 0 bytes', 'If-None-Match → 304, 0 byte'] },
    { goi: `(() => { const r = serveObject({ Range: 'bytes=0-99' }, COVER); return [r.status, r.body.length, r.headers['content-range']]; })()`, moTa: ['Range 0-99 → 206, 100 bytes', 'Range 0-99 → 206, 100 byte'] },
    { goi: `[serveObject({}, null), serveObject({}, VIDEO)]`, moTa: ['404 and a plain 200', '404 và một 200 thường'] },
    { goi: `[serveObject({ range: 'bytes=30-' }, VIDEO), serveObject({ range: 'bytes=-4' }, VIDEO), serveObject({ range: 'bytes=10-1000' }, VIDEO), serveObject({ range: 'bytes=36-40' }, VIDEO)]`, an: true },
    { goi: `[serveObject({ 'if-none-match': 'W/"v1"' }, VIDEO).status, serveObject({ 'if-none-match': '"x", "v1"' }, VIDEO).status, serveObject({ 'if-none-match': '*' }, VIDEO).status, serveObject({ 'if-none-match': '"old"' }, VIDEO).status, serveObject({ range: 'items=0-5' }, VIDEO).status, serveObject({ range: 'bytes=-' }, VIDEO).status]`, an: true },
    { goi: `[serveObject({ range: 'bytes=5-2' }, VIDEO), serveObject({ RANGE: 'bytes=0-0' }, VIDEO)]`, an: true },
  ],
});

/* ─── 5. HARD · js — xoá là một phần của tính năng ─── */
async function deletePost(post, { db, storage, base, log }) {
  const prefix = String(base).replace(/\/+$/, '') + '/';
  const deleted = [], failed = [], skipped = [];
  // 1) OBJECTS FIRST: a failed row delete then leaves a file that cleanup can find; the reverse leaves a row
  //    pointing at nothing (or a file nobody will ever find again).
  for (const url of post.media || []) {
    if (!String(url).startsWith(prefix)) { skipped.push(url); continue; }   // a YouTube thumbnail is not ours to delete
    const key = String(url).slice(prefix.length);
    try {
      await storage.del(key);
      deleted.push(key);
    } catch (err) {
      // A failed delete is a LEAK, not a user-facing error: log it and carry on.
      log.push({ level: 'warn', key, message: String(err && err.message) });
      failed.push(key);
    }
  }
  // 2) …then the row.
  await db.deletePost(post.id);
  return { deleted, failed, skipped };
}

async function sweepPending(rows, now, { storage, db }) {
  const removed = [];
  for (const row of rows) {
    // Only abandoned uploads: still PENDING and past their 24 h TTL. CONFIRMED rows belong to real posts.
    if (row.status !== 'PENDING' || row.expiresAt > now) continue;
    try {
      await storage.del(row.key);      // object first, row second — same rule as above
      await db.removePending(row.id);
      removed.push(row.id);
    } catch {
      // leave the row: tomorrow's sweep retries it
    }
  }
  return removed;
}

const DEL = String.raw`
const BASE = 'https://media.cuongthai.com';
const calls = []; const log = [];
const storage = { broken: new Set(), async del(key) { await new Promise((r) => setTimeout(r, 5)); calls.push('del ' + key); if (this.broken.has(key)) throw new Error('R2 503 SlowDown'); } };
const db = { async deletePost(id) { calls.push('row ' + id); }, async removePending(id) { calls.push('pending ' + id); } };
const DAY = 24 * 3600 * 1000;
`;

const E5 = jsBai({
  ten: 'Delete the post — and its files, in the right order', kho: 'HARD', phut: 25,
  en: `<p>"Storage has no foreign keys. Delete a post row and the objects stay, paid for, forever." Write two functions, like <code>deleteByUrls()</code> and the nightly <code>PendingUpload</code> sweep:</p>
<p><code>async deletePost(post, { db, storage, base, log })</code> — <code>post = { id, media: [urls] }</code>:</p>
<ul><li>a URL that does not start with <code>base + '/'</code> (base may end with <code>/</code>) is <b>skipped</b> (foreign — not ours to delete);</li>
<li>for each of ours, key = the URL without that prefix; <code>await storage.del(key)</code>; if it throws push <code>{ level:'warn', key, message }</code> to <code>log</code> and continue — <b>never throw</b>;</li>
<li><b>objects first</b>, then <code>await db.deletePost(post.id)</code>;</li>
<li>return <code>{ deleted, failed, skipped }</code> (keys, keys, URLs, in order).</li></ul>
<p><code>async sweepPending(rows, now, { storage, db })</code> — for each row with <code>status === 'PENDING'</code> and <code>expiresAt &lt;= now</code>: delete the object (<code>row.key</code>), then <code>db.removePending(row.id)</code>; if either throws, leave the row for the next sweep. Return the removed ids. <code>CONFIRMED</code> rows are never touched.</p>
<p>The fakes record every call in order in <code>calls</code>.</p>${MOI_TRUONG.en}`,
  vi: `<p>"Storage không có khoá ngoại. Xoá dòng bài viết thì object vẫn ở đó, bị tính tiền, mãi mãi." Viết hai hàm, như <code>deleteByUrls()</code> và lượt quét <code>PendingUpload</code> hằng đêm:</p>
<p><code>async deletePost(post, { db, storage, base, log })</code> — <code>post = { id, media: [url] }</code>:</p>
<ul><li>URL không bắt đầu bằng <code>base + '/'</code> (base có thể có <code>/</code> ở cuối) bị <b>bỏ qua</b> (của nơi khác — không phải của ta để xoá);</li>
<li>với mỗi URL của ta, khoá = URL bỏ tiền tố đó; <code>await storage.del(key)</code>; nếu ném lỗi thì đẩy <code>{ level:'warn', key, message }</code> vào <code>log</code> rồi tiếp tục — <b>không bao giờ ném</b>;</li>
<li><b>object trước</b>, rồi mới <code>await db.deletePost(post.id)</code>;</li>
<li>trả <code>{ deleted, failed, skipped }</code> (khoá, khoá, URL, theo thứ tự).</li></ul>
<p><code>async sweepPending(rows, now, { storage, db })</code> — với mỗi dòng <code>status === 'PENDING'</code> và <code>expiresAt &lt;= now</code>: xoá object (<code>row.key</code>), rồi <code>db.removePending(row.id)</code>; nếu một trong hai ném lỗi thì để dòng đó cho lượt quét sau. Trả các id đã xoá. Dòng <code>CONFIRMED</code> không bao giờ bị đụng.</p>
<p>Đồ giả ghi mọi lời gọi theo thứ tự vào <code>calls</code>.</p>${MOI_TRUONG.vi}`,
  goiY: [['Compute <code>prefix = base.replace(/\\/+$/, "") + "/"</code> once.', 'Tính <code>prefix = base.replace(/\\/+$/, "") + "/"</code> một lần.'], ['Put the try/catch around each <code>storage.del</code>, not around the whole loop — one failure must not stop the others.', 'Đặt try/catch quanh từng <code>storage.del</code>, không quanh cả vòng lặp — một lỗi không được chặn những cái khác.'], ['In the sweep, compare <code>row.expiresAt &lt;= now</code> and check the status first.', 'Trong lượt quét, so <code>row.expiresAt &lt;= now</code> và kiểm trạng thái trước.']],
  loi: [['Deleting the row first: if the object delete then fails, nothing references the file and it is billed forever.', 'Xoá dòng trước: nếu sau đó xoá object hỏng, không còn gì tham chiếu tới file và nó bị tính tiền mãi.'], ['Deleting every URL in the post, including a YouTube thumbnail that belongs to someone else.', 'Xoá mọi URL trong bài, kể cả ảnh thu nhỏ YouTube thuộc về nơi khác.'], ['Throwing on a failed object delete: the user sees an error for a cleanup problem.', 'Ném lỗi khi xoá object hỏng: người dùng thấy lỗi vì một vấn đề dọn dẹp.']],
  gt: ['With no foreign keys, the order of the two deletes decides which failure is recoverable: objects first means the worst case is a file still referenced by a row (found and retried), never an orphan nobody can find. Resolving URLs against our own base and skipping the rest keeps the cleanup from touching what is not ours; logging instead of throwing treats a failed delete as the leak it is. The TTL sweep closes the third leak — uploads abandoned before a post existed.', 'Không có khoá ngoại, thứ tự hai lần xoá quyết định lỗi nào sửa được: object trước nghĩa là trường hợp xấu nhất là một file vẫn được một dòng tham chiếu (tìm thấy và thử lại), không bao giờ là file mồ côi không ai tìm ra. Giải URL theo gốc của mình và bỏ qua phần còn lại giữ việc dọn không đụng thứ không phải của mình; ghi log thay vì ném coi lần xoá hỏng đúng là rò rỉ. Lượt quét theo TTL đóng rò rỉ thứ ba — upload bị bỏ dở trước khi có bài viết.'],
  kn: ['object storage', 'cleanup', 'error handling'],
  tns: [tn('orphaned object', 'object mồ côi', 'không dòng nào tham chiếu nhưng vẫn tính tiền'), tn('sweep', 'lượt quét dọn', 'cron xoá thứ bỏ dở')],
  fakes: DEL,
  dau: `/** Delete a post and its media. */
async function deletePost(post, { db, storage, base, log }) {
  // Write your solution here
  await db.deletePost(post.id);
  const deleted = [];
  for (const url of post.media) {
    const key = url.replace(base + '/', '');
    await storage.del(key);
    deleted.push(key);
  }
  return { deleted, failed: [], skipped: [] };
}

/** Nightly: remove abandoned uploads. */
async function sweepPending(rows, now, { storage, db }) {
  return [];
}
`,
  giai: '// Reference solution\n' + nguon(deletePost, sweepPending),
  cases: [
    { goi: '[await deletePost({ id: 42, media: [BASE + "/images/post/u7/1753660000000-a1b2c3d4e5f6.webp", "https://i.ytimg.com/vi/abc/hqdefault.jpg"] }, { db, storage, base: BASE, log }), calls]', moTa: ['Objects first, the YouTube thumbnail skipped', 'Object trước, ảnh YouTube bị bỏ qua'] },
    { goi: 'await (async () => { storage.broken.add("images/post/u7/1753660000000-000000000002.webp"); const r = await deletePost({ id: 7, media: [BASE + "/images/post/u7/1753660000000-000000000001.webp", BASE + "/images/post/u7/1753660000000-000000000002.webp", BASE + "/images/post/u7/1753660000000-000000000003.webp"] }, { db, storage, base: BASE + "/", log }); return [r, calls, log]; })()', moTa: ['One delete fails: logged, the others still go, the row is deleted', 'Một lần xoá hỏng: ghi log, cái khác vẫn chạy, dòng vẫn bị xoá'] },
    { goi: '[await sweepPending([{ id: 1, key: "video/u7/a.mp4", status: "PENDING", expiresAt: 1000 }, { id: 2, key: "video/u7/b.mp4", status: "CONFIRMED", expiresAt: 1000 }, { id: 3, key: "video/u7/c.mp4", status: "PENDING", expiresAt: 5000 }], 2000, { storage, db }), calls]', moTa: ['Sweep: only expired PENDING rows', 'Quét: chỉ dòng PENDING đã hết hạn'] },
    { goi: '[await deletePost({ id: 1, media: [] }, { db, storage, base: BASE, log }), await deletePost({ id: 2, media: ["https://media.cuongthai.com.evil.example/x.jpg", "http://media.cuongthai.com/y.jpg"] }, { db, storage, base: BASE, log }), calls]', an: true },
    { goi: 'await (async () => { storage.broken.add("video/u7/b.mp4"); const r = await sweepPending([{ id: 1, key: "video/u7/a.mp4", status: "PENDING", expiresAt: 0 }, { id: 2, key: "video/u7/b.mp4", status: "PENDING", expiresAt: 0 }, { id: 3, key: "video/u7/c.mp4", status: "PENDING", expiresAt: 10 * DAY }], 10 * DAY, { storage, db }); return [r, calls]; })()', an: true },
  ],
});

export default modul('nodejs-10-4-phuc-vu-media-cache', '10.4 Serving media: formats, caching, CDN', [E1, E2, E3, E4, E5]);
