/** Node.js 10.3 — Đừng tin file người dùng: magic bytes, file lai GIF+HTML, bom giải nén 256 MP, EXIF, nội dung chủ động. */
import { modul, cs, q, qn, tn, jsBai, nguon, MOI_TRUONG } from './_node-c9-11.mjs';

/* ─── 1. EASY · choice ─── */
const E1 = cs({
  ten: 'Five files that all claim to be images', kho: 'EASY', phut: 10,
  en: 'From the lesson: five files through an extension check, a MIME check and magic-byte sniffing; a GIF+HTML polyglot; a real photo with HTML appended; a 758 KB PNG that costs 99 MB; and a phone photo carrying EXIF.',
  vi: 'Từ bài: năm file qua phép kiểm đuôi, kiểm MIME và đọc magic bytes; một file lai GIF+HTML; một ảnh thật nối thêm HTML; một PNG 758 KB tốn 99 MB; và một ảnh điện thoại mang EXIF.',
  cau: [
    q('f1', ['A PHP shell renamed <code>shell.png</code>, sent with <code>Content-Type: image/png</code>. Which checks let it through?', 'Một shell PHP đổi tên thành <code>shell.png</code>, gửi kèm <code>Content-Type: image/png</code>. Phép kiểm nào cho nó qua?'],
      ['The extension check and the MIME check — both are strings the attacker wrote; magic bytes caught it', 'Only the extension check; the browser corrects the MIME from the file content', 'None: multer rejects files whose content does not match their extension', 'All three, because PHP files start with the same bytes as PNG'],
      ['Its first bytes are "&lt;?php system($_G" — not a PNG signature. Sniffing caught 4 of the 5 files.', 'Các byte đầu là "&lt;?php system($_G" — không phải chữ ký PNG. Đọc magic bytes bắt được 4 trên 5 file.']),
    q('f2', ['<code>GIF89a/**/=1;&lt;script&gt;alert(1)&lt;/script&gt;</code> is sniffed as <code>image/gif</code>. What actually rejects it?', '<code>GIF89a/**/=1;&lt;script&gt;alert(1)&lt;/script&gt;</code> được đọc là <code>image/gif</code>. Thứ gì thật sự từ chối nó?'],
      ['Decoding it: sharp threw "Input buffer has corrupt header"', 'A stricter sniffer that reads 16 bytes instead of 6', 'Checking that the extension is .gif and not .html', 'nosniff on the response, which stops the browser decoding it'],
      ['"The only reliable way to know a file is an image is to decode it as one." Sniffing reads six bytes; a decoder reads all of them.', '"Cách đáng tin duy nhất để biết một file là ảnh là giải mã nó như ảnh." Đọc magic bytes chỉ đọc sáu byte; bộ giải mã đọc hết.']),
    q('f3', ['A genuine JPEG with <code>&lt;script&gt;</code> appended still decodes perfectly. What removes the payload?', 'Một JPEG thật nối thêm <code>&lt;script&gt;</code> vẫn giải mã ngon lành. Thứ gì loại bỏ payload?'],
      ['Re-encoding with sharp and storing the OUTPUT (570 KB, no &lt;script&gt; left)', 'Checking the magic bytes again after upload', 'Setting the stored Content-Type to image/jpeg', 'Rejecting files larger than 5 MB'],
      ['JPEG readers stop at the end-of-image marker and ignore trailing bytes. A re-encode writes a new file from pixels — nothing that was not a pixel survives.', 'Bộ đọc JPEG dừng ở dấu kết thúc ảnh và bỏ qua byte phía sau. Re-encode ghi file mới từ điểm ảnh — thứ gì không phải điểm ảnh đều không sống sót.']),
    q('f4', ['Eight 758 KB "bomb" PNGs (16000×16000) at once vs eight real 6.85 MB photos at once. What did the lesson measure?', 'Tám PNG "bom" 758 KB (16000×16000) cùng lúc so với tám ảnh thật 6,85 MB cùng lúc. Bài đo được gì?'],
      ['Bombs: +445 MB RSS; real photos: +17 MB — size limits, MIME checks and sniffing see none of it', 'Bombs: refused by sharp’s default limit; real photos: +17 MB', 'Both about +60 MB, because sharp streams every image', 'Bombs: +5.9 MB, exactly their size on the wire'],
      ['256 MP sits just under sharp’s default limitInputPixels (268,402,689). The defence is a pixel budget for your product (this site: 100 MP) plus bounded concurrency (4 decodes).', '256 MP nằm ngay dưới limitInputPixels mặc định của sharp (268.402.689). Phòng thủ là ngân sách điểm ảnh theo sản phẩm (site này: 100 MP) cộng giới hạn đồng thời (4 lần giải mã).']),
    qn('f5', ['Which statements are true? (choose all)', 'Nhận định nào đúng? (chọn mọi câu đúng)'],
      ['sharp drops EXIF (including GPS) by default; withMetadata() keeps all of it', 'SVG was blocked by sniffing only because file-type does not recognise SVG — refuse it explicitly', '<code>evil.php.png</code>: only the last extension matters, and only for naming, never for trust', 'An image endpoint should accept HTML if the extension is .jpg, since it will be served as an image', 'image/* is safe to store as-is because it is an image'],
      [0, 1, 2],
      ['The bomb, the polyglot and the EXIF are all images — "image/*" is not a safety property. Active content (HTML, SVG, JS) is refused outright.', 'Quả bom, file lai và EXIF đều là ảnh — "image/*" không phải tính chất an toàn. Nội dung chủ động (HTML, SVG, JS) bị từ chối thẳng.']),
  ],
  goiY: [['Ask of each check: does it read the client’s strings, the first bytes, or the whole file?', 'Hỏi mỗi phép kiểm: nó đọc chuỗi của client, vài byte đầu, hay cả file?'], ['The "bomb" numbers: compressed size vs decoded pixels.', 'Số liệu "bom": cỡ nén so với số điểm ảnh khi giải mã.']],
  loi: [['Treating magic bytes as proof of a valid image.', 'Coi magic bytes là bằng chứng ảnh hợp lệ.'], ['Storing the uploaded bytes instead of the re-encoded output.', 'Lưu byte đã upload thay vì bản re-encode.']],
  tns: [tn('magic bytes', 'chữ ký đầu file', 'vài byte đầu nhận diện định dạng'), tn('polyglot', 'file lai', 'hợp lệ theo hai định dạng cùng lúc'), tn('decompression bomb', 'bom giải nén', 'file nhỏ nở ra rất lớn khi giải mã')],
  kn: ['upload validation'],
});

/* ─── 2. EASY · js — đọc magic bytes ─── */
function sniff(bytes) {
  const at = (offset, sig) => sig.every((b, i) => bytes[offset + i] === b);
  const ascii = (offset, s) => at(offset, Array.from(s, (ch) => ch.charCodeAt(0)));
  // Order does not matter here because the signatures cannot overlap — but every check is anchored at an OFFSET.
  if (at(0, [0xff, 0xd8, 0xff])) return 'image/jpeg';                                   // JPEG SOI marker
  if (at(0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png';      // \x89PNG\r\n\x1a\n
  if (ascii(0, 'GIF87a') || ascii(0, 'GIF89a')) return 'image/gif';                     // …which the polyglot also has
  if (ascii(0, 'RIFF') && ascii(8, 'WEBP')) return 'image/webp';                       // RIFF container, WEBP at 8
  if (ascii(0, '%PDF-')) return 'application/pdf';
  return null;                                                                          // text formats (HTML, SVG, PHP) have no magic
}

const HEX = String.raw`
function hex(h) { const a = []; for (let i = 0; i < h.length; i += 2) a.push(parseInt(h.slice(i, i + 2), 16)); return a; }
const SHELL = hex('3c3f7068702073797374656d28245f47');
const HTML = hex('3c68746d6c3e3c7363726970743e6665');
const POLY = hex('4749463839612f2a2a2f3d313b3c7363');
const SVG = hex('3c73766720786d6c6e733d2268747470');
const JPEG = hex('ffd8ffdb004300030202020202030202');
`;

const E2 = jsBai({
  ten: 'Sniff the magic bytes', kho: 'EASY', phut: 10,
  en: `<p>The lesson printed the first 16 bytes of each file. Write <code>sniff(bytes)</code> (an array of byte values) → MIME type or <code>null</code>:</p>
<ul><li><code>FF D8 FF</code> at 0 → <code>image/jpeg</code>; <code>89 50 4E 47 0D 0A 1A 0A</code> at 0 → <code>image/png</code>;</li>
<li><code>GIF87a</code> or <code>GIF89a</code> at 0 → <code>image/gif</code>; <code>RIFF</code> at 0 <b>and</b> <code>WEBP</code> at 8 → <code>image/webp</code>; <code>%PDF-</code> at 0 → <code>application/pdf</code>;</li>
<li>anything else (too short, HTML, SVG, PHP…) → <code>null</code>.</li></ul>
<p>The tests use the lesson’s exact hex: <code>3c3f7068…</code> (PHP shell), <code>3c68746d…</code> (HTML), <code>47494638…</code> (the polyglot), <code>3c737667…</code> (SVG), <code>ffd8ffdb…</code> (JPEG).</p>${MOI_TRUONG.en}`,
  vi: `<p>Bài đã in 16 byte đầu của mỗi file. Viết <code>sniff(bytes)</code> (mảng giá trị byte) → kiểu MIME hoặc <code>null</code>:</p>
<ul><li><code>FF D8 FF</code> ở 0 → <code>image/jpeg</code>; <code>89 50 4E 47 0D 0A 1A 0A</code> ở 0 → <code>image/png</code>;</li>
<li><code>GIF87a</code> hoặc <code>GIF89a</code> ở 0 → <code>image/gif</code>; <code>RIFF</code> ở 0 <b>và</b> <code>WEBP</code> ở 8 → <code>image/webp</code>; <code>%PDF-</code> ở 0 → <code>application/pdf</code>;</li>
<li>còn lại (quá ngắn, HTML, SVG, PHP…) → <code>null</code>.</li></ul>
<p>Bộ kiểm dùng đúng hex của bài: <code>3c3f7068…</code> (shell PHP), <code>3c68746d…</code> (HTML), <code>47494638…</code> (file lai), <code>3c737667…</code> (SVG), <code>ffd8ffdb…</code> (JPEG).</p>${MOI_TRUONG.vi}`,
  goiY: [['Write one helper <code>at(offset, [bytes…])</code> that compares a signature at a position.', 'Viết một hàm phụ <code>at(offset, [byte…])</code> so một chữ ký tại một vị trí.'], ['For ASCII signatures, turn the string into codes with <code>charCodeAt</code>.', 'Với chữ ký ASCII, đổi chuỗi thành mã bằng <code>charCodeAt</code>.']],
  loi: [['Searching for "GIF89a" anywhere in the file (<code>includes</code>) instead of at offset 0.', 'Tìm "GIF89a" ở bất kỳ đâu trong file (<code>includes</code>) thay vì ở vị trí 0.'], ['Calling RIFF alone WebP — WAV and AVI are RIFF too; WEBP must be at offset 8.', 'Gọi RIFF một mình là WebP — WAV và AVI cũng là RIFF; WEBP phải ở vị trí 8.'], ['Believing a sniff result proves the file is a valid image (the polyglot).', 'Tin rằng kết quả sniff chứng minh file là ảnh hợp lệ (file lai).']],
  gt: ['Binary formats announce themselves in fixed bytes at a fixed offset, so sniffing is a handful of anchored comparisons — cheap, and it fails fast on a renamed PHP shell or HTML page. Text formats have no magic at all, which is why SVG returned null "by accident". And the polyglot shows the limit: six correct bytes say nothing about the rest; only decoding does.', 'Định dạng nhị phân tự xưng danh bằng byte cố định ở vị trí cố định, nên sniff chỉ là vài phép so có neo — rẻ, và loại nhanh shell PHP hay trang HTML bị đổi tên. Định dạng chữ không có magic nào, vì vậy SVG ra null "do tình cờ". Và file lai cho thấy giới hạn: sáu byte đúng không nói gì về phần còn lại; chỉ giải mã mới nói được.'],
  kn: ['magic bytes', 'binary data'],
  tns: [tn('signature', 'chữ ký định dạng', 'chuỗi byte cố định đầu file'), tn('offset', 'vị trí', 'chỉ số byte tính từ 0')],
  fakes: HEX,
  dau: `/** Detect the real type of a file from its first bytes. */
function sniff(bytes) {
  // Write your solution here
  const text = String.fromCharCode(...bytes);
  if (text.includes('GIF')) return 'image/gif';
  if (bytes[0] === 0xff) return 'image/jpeg';
  return 'image/png';
}
`,
  giai: '// Reference solution\n' + nguon(sniff),
  cases: [
    { goi: '[sniff(SHELL), sniff(HTML), sniff(POLY), sniff(SVG), sniff(JPEG)]', moTa: ['The lesson’s five files', 'Năm file của bài'] },
    { goi: 'sniff(hex("89504e470d0a1a0a0000000d49484452"))', moTa: ['A PNG header', 'Một header PNG'] },
    { goi: '[sniff(hex("524946462a000000574542505650384c")), sniff(hex("524946462a00000057415645666d7420"))]', moTa: ['RIFF/WEBP vs RIFF/WAVE', 'RIFF/WEBP so với RIFF/WAVE'] },
    { goi: '[sniff([]), sniff([0xff, 0xd8]), sniff(hex("255044462d312e37")), sniff(hex("474946383761")), sniff(hex("3c21444f43545950452068746d6c3e47494638396")), sniff(hex("89504e470d0a1a"))]', an: true },
    { goi: '[sniff(bytes("<?php echo GIF89a; ?>")), sniff(bytes("GIF89a<script>")), sniff(bytes("%PDF")), sniff(hex("ffd8ffe000104a464946"))]', an: true },
  ],
});

/* ─── 3. MEDIUM · js — cổng chặn nội dung chủ động ─── */
function assertSafeUploadType(mime, name, family) {
  const DANGEROUS_MIME = new Set(['text/html', 'application/xhtml+xml', 'image/svg+xml', 'application/javascript', 'text/javascript', 'application/xml', 'text/xml', 'application/x-httpd-php']);
  const DANGEROUS_EXT = /\.(html?|xhtml|svg|js|mjs|xml|php|phtml)$/i;          // anchored at the end: only the LAST extension
  const FAMILY = { images: 'image/', audio: 'audio/', video: 'video/', documents: 'application/pdf' };
  // "image/svg+xml; charset=utf-8" and "TEXT/HTML" are the same type: normalise first.
  const type = String(mime || '').split(';')[0].trim().toLowerCase();
  if (DANGEROUS_MIME.has(type)) return 'DANGEROUS_TYPE';
  // Second gate on the NAME, on purpose: the client controls the MIME, so a .html sent as image/png must still stop here.
  if (DANGEROUS_EXT.test(String(name || ''))) return 'DANGEROUS_EXT';
  // Empty / octet-stream (drag-drop, some mobile browsers): skip the family check rather than reject a real photo.
  if (type === '' || type === 'application/octet-stream') return 'OK';
  return type.startsWith(FAMILY[family]) ? 'OK' : 'WRONG_FAMILY';
}

const E3 = jsBai({
  ten: 'The first gate: refuse active content by type AND by name', kho: 'MEDIUM', phut: 15,
  en: `<p>This site’s first layer is <code>assertSafeUploadType(mimetype, originalName, bucket)</code> in <code>src/storage/uploadService.ts</code>. Write it, returning a code:</p>
<ol><li>normalise the MIME: drop parameters after <code>;</code>, trim, lower-case;</li>
<li>in <code>text/html, application/xhtml+xml, image/svg+xml, application/javascript, text/javascript, application/xml, text/xml, application/x-httpd-php</code> → <code>'DANGEROUS_TYPE'</code>;</li>
<li>the name matches <code>/\\.(html?|xhtml|svg|js|mjs|xml|php|phtml)$/i</code> → <code>'DANGEROUS_EXT'</code> (a second gate, because the client controls the MIME);</li>
<li>empty MIME or <code>application/octet-stream</code> → <code>'OK'</code> (skip the family check — the dangerous-extension gate already ran);</li>
<li>family check: <code>images</code> → <code>image/…</code>, <code>audio</code> → <code>audio/…</code>, <code>video</code> → <code>video/…</code>, <code>documents</code> → <code>application/pdf</code>; mismatch → <code>'WRONG_FAMILY'</code>, else <code>'OK'</code>.</li></ol>${MOI_TRUONG.en}`,
  vi: `<p>Lớp đầu tiên của site này là <code>assertSafeUploadType(mimetype, originalName, bucket)</code> trong <code>src/storage/uploadService.ts</code>. Viết nó, trả về một mã:</p>
<ol><li>chuẩn hoá MIME: bỏ tham số sau <code>;</code>, cắt khoảng trắng, viết thường;</li>
<li>thuộc <code>text/html, application/xhtml+xml, image/svg+xml, application/javascript, text/javascript, application/xml, text/xml, application/x-httpd-php</code> → <code>'DANGEROUS_TYPE'</code>;</li>
<li>tên khớp <code>/\\.(html?|xhtml|svg|js|mjs|xml|php|phtml)$/i</code> → <code>'DANGEROUS_EXT'</code> (cổng thứ hai, vì client điều khiển MIME);</li>
<li>MIME rỗng hoặc <code>application/octet-stream</code> → <code>'OK'</code> (bỏ qua kiểm họ — cổng đuôi nguy hiểm đã chạy);</li>
<li>kiểm họ: <code>images</code> → <code>image/…</code>, <code>audio</code> → <code>audio/…</code>, <code>video</code> → <code>video/…</code>, <code>documents</code> → <code>application/pdf</code>; lệch → <code>'WRONG_FAMILY'</code>, không thì <code>'OK'</code>.</li></ol>${MOI_TRUONG.vi}`,
  goiY: [['<code>String(mime).split(";")[0].trim().toLowerCase()</code> before any comparison.', '<code>String(mime).split(";")[0].trim().toLowerCase()</code> trước mọi phép so.'], ['The order of the checks is the specification: dangerous type, dangerous name, the octet-stream exception, then the family.', 'Thứ tự các phép kiểm chính là đặc tả: kiểu nguy hiểm, tên nguy hiểm, ngoại lệ octet-stream, rồi mới tới họ.']],
  loi: [['A deny-list of extensions without the MIME gate (or the other way round): the client controls both strings.', 'Danh sách đen đuôi mà không có cổng MIME (hoặc ngược lại): client kiểm soát cả hai chuỗi.'], ['Rejecting every empty/octet-stream MIME — real photos from drag-drop and mobile browsers fail.', 'Từ chối mọi MIME rỗng/octet-stream — ảnh thật từ kéo-thả và trình duyệt di động bị trượt.'], ['Comparing <code>"image/svg+xml; charset=utf-8"</code> to the list without stripping the parameter.', 'So <code>"image/svg+xml; charset=utf-8"</code> với danh sách mà không bỏ tham số.']],
  gt: ['Two independent gates on two attacker-controlled strings: a dangerous MIME or a dangerous final extension is refused before anything else, so the exception for blank MIMEs can never reopen HTML or SVG. The family check comes last and is allowed to be lenient, because this gate is only layer one — re-encoding and a server-chosen extension (.webp) are what make the stored file trustworthy.', 'Hai cổng độc lập trên hai chuỗi do kẻ tấn công kiểm soát: MIME nguy hiểm hay đuôi cuối nguy hiểm bị từ chối trước mọi thứ, nên ngoại lệ cho MIME trống không bao giờ mở lại HTML hay SVG. Kiểm họ đi sau cùng và được phép dễ dãi, vì cổng này chỉ là lớp một — re-encode và đuôi do máy chủ chọn (.webp) mới làm file lưu đáng tin.'],
  kn: ['upload validation', 'active content'],
  tns: [tn('active content', 'nội dung chủ động', 'thứ trình duyệt sẽ chạy: HTML, SVG, JS'), tn('octet-stream', 'luồng byte chung', 'MIME "không rõ kiểu"')],
  dau: `/** First upload gate. Returns 'OK' | 'DANGEROUS_TYPE' | 'DANGEROUS_EXT' | 'WRONG_FAMILY'. */
function assertSafeUploadType(mime, name, family) {
  // Write your solution here
  if (mime === 'text/html') return 'DANGEROUS_TYPE';
  if (name.endsWith('.php')) return 'DANGEROUS_EXT';
  return mime.startsWith(family.slice(0, -1)) ? 'OK' : 'WRONG_FAMILY';
}
`,
  giai: '// Reference solution\n' + nguon(assertSafeUploadType),
  cases: [
    { goi: `[assertSafeUploadType('image/jpeg', 'IMG_0001.jpg', 'images'), assertSafeUploadType('text/html', 'anh.jpg', 'images'), assertSafeUploadType('image/png', 'shell.php', 'images')]`, moTa: ['A photo, HTML as .jpg, a .php sent as image/png', 'Một ảnh, HTML giả .jpg, .php gửi kèm image/png'] },
    { goi: `[assertSafeUploadType('image/svg+xml; charset=utf-8', 'logo.svg', 'images'), assertSafeUploadType('TEXT/HTML', 'x.txt', 'documents')]`, moTa: ['MIME with parameters and in upper case', 'MIME có tham số và viết hoa'] },
    { goi: `[assertSafeUploadType('', 'IMG_2024.HEIC', 'images'), assertSafeUploadType('application/octet-stream', 'drop.jpg', 'images'), assertSafeUploadType('application/octet-stream', 'page.html', 'images')]`, moTa: ['Blank / octet-stream: family skipped, dangerous name still blocked', 'Trống / octet-stream: bỏ kiểm họ, tên nguy hiểm vẫn bị chặn'] },
    { goi: `[assertSafeUploadType('video/mp4', 'clip.mp4', 'images'), assertSafeUploadType('audio/mpeg', 'a.mp3', 'audio'), assertSafeUploadType('application/pdf', 'cv.pdf', 'documents'), assertSafeUploadType('application/zip', 'cv.docx', 'documents')]`, an: true },
    { goi: `[assertSafeUploadType('image/png', 'evil.php.png', 'images'), assertSafeUploadType('image/png', 'evil.png.PHTML', 'images'), assertSafeUploadType('image/gif', 'a.MJS', 'images'), assertSafeUploadType(' Application/XML ', 'feed.rss', 'documents'), assertSafeUploadType(undefined, 'x.xhtml', 'images')]`, an: true },
  ],
});

/* ─── 4. MEDIUM · js — ngân sách điểm ảnh, đọc từ header trước khi giải mã ─── */
function checkPixels(bytes, limit) {
  const SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (!SIG.every((b, i) => bytes[i] === b)) return { ok: false, code: 'NOT_PNG' };
  if (bytes.length < 24) return { ok: false, code: 'TRUNCATED' };
  // IHDR is always the first chunk: length (4) + "IHDR" (4) start at 8, so width is bytes 16–19, height 20–23,
  // big-endian. Multiply instead of "<< 24": b << 24 is a SIGNED 32-bit int and goes negative from 0x80.
  const u32 = (i) => bytes[i] * 2 ** 24 + bytes[i + 1] * 2 ** 16 + bytes[i + 2] * 2 ** 8 + bytes[i + 3];
  const width = u32(16), height = u32(20);
  const pixels = width * height;
  // Decide from the HEADER — 24 bytes — before any decoder allocates width × height × 4 bytes of RAM.
  if (pixels > limit) return { ok: false, code: 'TOO_MANY_PIXELS', width, height, pixels };
  return { ok: true, width, height, pixels };
}

const PNGH = String.raw`
// a real PNG signature + IHDR chunk for the given size (what a bomb sends in its first 24 bytes)
function pngHeader(w, h) { const be = (n) => [Math.floor(n / 16777216) % 256, Math.floor(n / 65536) % 256, Math.floor(n / 256) % 256, n % 256]; return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, ...be(w), ...be(h), 8, 2, 0, 0, 0]; }
const SITE_LIMIT = 100000000;      // this site: 100 MP
const SHARP_DEFAULT = 268402689;   // 0x3FFF × 0x3FFF
`;

const E4 = jsBai({
  ten: 'Refuse the bomb from its header, before decoding', kho: 'MEDIUM', phut: 18,
  en: `<p>Bomb 1 — 758 KB on the wire, 16000×16000 = 256 million pixels — sits just under sharp’s default <code>limitInputPixels</code> (268,402,689) and cost +99 MB. This site "checks the pixel count from the header before decoding, so bomb 1 is refused as <code>TOO_MANY_PIXELS</code>". Write <code>checkPixels(bytes, limit)</code> for PNG:</p>
<ul><li>the first 8 bytes must be the PNG signature, else <code>{ ok:false, code:'NOT_PNG' }</code>; fewer than 24 bytes → <code>{ ok:false, code:'TRUNCATED' }</code>;</li>
<li>width = bytes 16–19, height = bytes 20–23, <b>unsigned big-endian</b> 32-bit; <code>pixels = width × height</code>;</li>
<li><code>pixels &gt; limit</code> → <code>{ ok:false, code:'TOO_MANY_PIXELS', width, height, pixels }</code>, otherwise <code>{ ok:true, width, height, pixels }</code>.</li></ul>
<p>The tests build headers with <code>pngHeader(w, h)</code> and use <code>SITE_LIMIT</code> (100 MP) and <code>SHARP_DEFAULT</code>.</p>${MOI_TRUONG.en}`,
  vi: `<p>Bom 1 — 758 KB trên đường truyền, 16000×16000 = 256 triệu điểm ảnh — nằm ngay dưới <code>limitInputPixels</code> mặc định của sharp (268.402.689) và tốn +99 MB. Site này "kiểm số điểm ảnh từ header trước khi giải mã, nên bom 1 bị từ chối là <code>TOO_MANY_PIXELS</code>". Viết <code>checkPixels(bytes, limit)</code> cho PNG:</p>
<ul><li>8 byte đầu phải là chữ ký PNG, không thì <code>{ ok:false, code:'NOT_PNG' }</code>; ít hơn 24 byte → <code>{ ok:false, code:'TRUNCATED' }</code>;</li>
<li>rộng = byte 16–19, cao = byte 20–23, số 32-bit <b>không dấu, big-endian</b>; <code>pixels = rộng × cao</code>;</li>
<li><code>pixels &gt; limit</code> → <code>{ ok:false, code:'TOO_MANY_PIXELS', width, height, pixels }</code>, không thì <code>{ ok:true, width, height, pixels }</code>.</li></ul>
<p>Bộ kiểm dựng header bằng <code>pngHeader(w, h)</code> và dùng <code>SITE_LIMIT</code> (100 MP) và <code>SHARP_DEFAULT</code>.</p>${MOI_TRUONG.vi}`,
  goiY: [['Big-endian: the first byte is the most significant — <code>b[16] × 2²⁴ + b[17] × 2¹⁶ + b[18] × 2⁸ + b[19]</code>.', 'Big-endian: byte đầu là byte nặng nhất — <code>b[16] × 2²⁴ + b[17] × 2¹⁶ + b[18] × 2⁸ + b[19]</code>.'], ['Check the signature first, then the length, then read the numbers.', 'Kiểm chữ ký trước, rồi độ dài, rồi mới đọc số.']],
  loi: [['<code>b[16] &lt;&lt; 24</code>: JavaScript bit shifts are signed 32-bit, so a width of 0x80000000 becomes negative and "passes" the limit.', '<code>b[16] &lt;&lt; 24</code>: phép dịch bit của JavaScript là 32-bit có dấu, nên rộng 0x80000000 thành số âm và "lọt" giới hạn.'], ['Reading little-endian (b[19] first): 16000 becomes a completely different number.', 'Đọc little-endian (b[19] trước): 16000 thành một số hoàn toàn khác.'], ['Relying on sharp’s default limit: 256 MP is under it.', 'Dựa vào giới hạn mặc định của sharp: 256 MP nằm dưới nó.']],
  gt: ['A decompression bomb is small on the wire and huge in memory, so neither a byte limit nor sniffing sees it. PNG writes its dimensions in the first 24 bytes, so the real cost of decoding is known before any work starts — refusing there costs nothing. The limit is chosen for the product (100 MP is above any phone or DSLR), not for the format; the second half of the defence is bounding how many decodes run at once (next exercise).', 'Bom giải nén nhỏ trên đường truyền và khổng lồ trong bộ nhớ, nên cả giới hạn byte lẫn sniff đều không thấy. PNG ghi kích thước trong 24 byte đầu, nên chi phí giải mã thật được biết trước khi bắt đầu làm gì — từ chối ở đó không tốn gì. Giới hạn chọn theo sản phẩm (100 MP trên mọi điện thoại hay máy ảnh), không theo định dạng; nửa còn lại của phòng thủ là giới hạn số lần giải mã chạy cùng lúc (bài sau).'],
  kn: ['decompression bombs', 'binary data'],
  tns: [tn('IHDR', 'khối header PNG', 'chứa rộng, cao, độ sâu màu'), tn('big-endian', 'byte lớn trước', 'byte nặng nhất đứng đầu'), tn('pixel budget', 'ngân sách điểm ảnh', 'số điểm ảnh tối đa chịu giải mã')],
  fakes: PNGH,
  dau: `/** Read a PNG's size from its header and enforce a pixel budget. */
function checkPixels(bytes, limit) {
  // Write your solution here
  const width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
  const height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
  const pixels = width * height;
  return pixels > limit ? { ok: false, code: 'TOO_MANY_PIXELS', width, height, pixels } : { ok: true, width, height, pixels };
}
`,
  giai: '// Reference solution\n' + nguon(checkPixels),
  cases: [
    { goi: '[checkPixels(pngHeader(16000, 16000), SITE_LIMIT), checkPixels(pngHeader(16000, 16000), SHARP_DEFAULT)]', moTa: ['Bomb 1: refused at 100 MP, accepted by sharp’s default', 'Bom 1: bị chặn ở 100 MP, sharp mặc định cho qua'] },
    { goi: 'checkPixels(pngHeader(4032, 3024), SITE_LIMIT)', moTa: ['A real phone photo', 'Một ảnh điện thoại thật'] },
    { goi: '[checkPixels(bytes("GIF89a/**/=1;<script>alert(1)</script>"), SITE_LIMIT), checkPixels(pngHeader(1, 1).slice(0, 20), SITE_LIMIT)]', moTa: ['Not a PNG / truncated', 'Không phải PNG / bị cắt'] },
    { goi: '[checkPixels(pngHeader(2147483648, 2), SITE_LIMIT), checkPixels(pngHeader(20000, 20000), SHARP_DEFAULT), checkPixels(pngHeader(10000, 10000), SITE_LIMIT)]', an: true },
    { goi: '[checkPixels(pngHeader(10000, 10001), SITE_LIMIT), checkPixels(pngHeader(0, 0), SITE_LIMIT), checkPixels(pngHeader(65536, 1), 70000)]', an: true },
  ],
});

/* ─── 5. HARD · js — giới hạn số lần giải mã đồng thời ─── */
function createGate(max) {
  let running = 0;
  const waiting = [];          // FIFO of callbacks that start a queued task
  const pump = () => {
    while (running < max && waiting.length) waiting.shift()();
  };
  return {
    get running() { return running; },
    get queued() { return waiting.length; },
    run(task) {
      return new Promise((resolve, reject) => {
        waiting.push(() => {
          running++;
          // Promise.resolve().then(task): a task that THROWS synchronously still becomes a rejection, never a leak.
          Promise.resolve()
            .then(task)
            .then(resolve, reject)
            .finally(() => { running--; pump(); });   // free the slot on success AND on failure
        });
        pump();
      });
    },
  };
}

const GATE = String.raw`
const stats = { now: 0, max: 0, order: [] };
// a fake sharp decode: takes ms (virtual), records how many run at once
const decode = (name, ms, fail) => async () => { stats.now++; stats.max = Math.max(stats.max, stats.now); stats.order.push(name); await new Promise((r) => setTimeout(r, ms)); stats.now--; if (fail) throw new Error('Input image exceeds pixel limit'); return name + '.webp'; };
`;

const E5 = jsBai({
  ten: 'At most four decodes at once', kho: 'HARD', phut: 25,
  en: `<p>"Because sharp’s work happens in libvips’ own threads rather than on the event loop, a queue is the other half of the answer: bound how many images you process concurrently instead of letting request volume decide." This site uses <code>MAX_CONCURRENT_DECODES = 4</code>. Write <code>createGate(max)</code> → <code>{ run(task), running, queued }</code>:</p>
<ul><li><code>run(task)</code> returns a Promise for the result of <code>task()</code> (an async function);</li>
<li>at most <code>max</code> tasks run at the same time; the others wait in a <b>FIFO</b> queue and start as soon as a slot frees;</li>
<li>a task that rejects (or throws) rejects its own <code>run</code> promise <b>and still frees its slot</b>;</li>
<li><code>running</code> / <code>queued</code> are getters with the current counts.</li></ul>
<p>The tests start 8 fake decodes of 100 ms (virtual clock) at once — the lesson’s "eight bombs" — and measure the peak concurrency and the total time.</p>${MOI_TRUONG.en}`,
  vi: `<p>"Vì việc của sharp chạy trong luồng riêng của libvips chứ không trên event loop, một hàng đợi là nửa còn lại của câu trả lời: giới hạn số ảnh xử lý cùng lúc thay vì để lượng request quyết định." Site này dùng <code>MAX_CONCURRENT_DECODES = 4</code>. Viết <code>createGate(max)</code> → <code>{ run(task), running, queued }</code>:</p>
<ul><li><code>run(task)</code> trả Promise cho kết quả của <code>task()</code> (một hàm async);</li>
<li>tối đa <code>max</code> tác vụ chạy cùng lúc; số còn lại chờ trong hàng đợi <b>FIFO</b> và bắt đầu ngay khi có chỗ trống;</li>
<li>tác vụ bị reject (hoặc ném lỗi) làm reject promise <code>run</code> của nó <b>và vẫn trả chỗ</b>;</li>
<li><code>running</code> / <code>queued</code> là getter cho số đếm hiện tại.</li></ul>
<p>Bộ kiểm khởi động 8 lần giải mã giả mỗi lần 100 ms (đồng hồ ảo) cùng lúc — "tám quả bom" của bài — rồi đo độ đồng thời cao nhất và tổng thời gian.</p>${MOI_TRUONG.vi}`,
  goiY: [['Keep a counter <code>running</code> and an array of waiting "start" functions; a <code>pump()</code> starts waiting ones while there is room.', 'Giữ biến đếm <code>running</code> và một mảng các hàm "bắt đầu" đang chờ; hàm <code>pump()</code> khởi động những cái đang chờ khi còn chỗ.'], ['Use <code>.finally()</code> to decrement and pump — it runs on success and on failure.', 'Dùng <code>.finally()</code> để giảm đếm và pump — nó chạy cả khi thành công lẫn thất bại.'], ['<code>Promise.resolve().then(task)</code> turns a synchronous throw into a rejection.', '<code>Promise.resolve().then(task)</code> biến lỗi ném đồng bộ thành rejection.']],
  loi: [['Freeing the slot only on success: after four failures (four bombs) the gate is stuck forever.', 'Chỉ trả chỗ khi thành công: sau bốn lần lỗi (bốn quả bom) cổng kẹt vĩnh viễn.'], ['<code>await Promise.all(tasks.map(t =&gt; t()))</code> — that is "let request volume decide".', '<code>await Promise.all(tasks.map(t =&gt; t()))</code> — đó chính là "để lượng request quyết định".'], ['Starting queued tasks in LIFO order: the earliest uploader waits the longest.', 'Khởi động tác vụ chờ theo LIFO: người upload sớm nhất lại chờ lâu nhất.']],
  gt: ['Peak memory of image processing is (memory per decode) × (decodes at once). The pixel budget bounds the first factor; the gate bounds the second, so eight bombs cost at most four decodes’ worth of RAM regardless of traffic — at the price of latency (200 ms instead of 100 ms for eight jobs here). Releasing the slot in <code>finally</code> is what keeps one bad file from permanently shrinking the pool.', 'Bộ nhớ đỉnh của xử lý ảnh là (bộ nhớ mỗi lần giải mã) × (số lần giải mã cùng lúc). Ngân sách điểm ảnh chặn thừa số đầu; cổng chặn thừa số sau, nên tám quả bom tốn tối đa RAM của bốn lần giải mã bất kể lưu lượng — đổi lại là độ trễ (ở đây 200 ms thay vì 100 ms cho tám việc). Trả chỗ trong <code>finally</code> là điều giữ một file xấu không làm nhỏ vĩnh viễn bể xử lý.'],
  kn: ['concurrency', 'promises', 'decompression bombs'],
  tns: [tn('semaphore', 'cờ hiệu đếm', 'cho tối đa N việc cùng chạy'), tn('FIFO', 'vào trước ra trước', 'hàng đợi công bằng')],
  fakes: GATE,
  dau: `/** Allow at most \`max\` tasks to run at the same time. */
function createGate(max) {
  // Write your solution here
  let running = 0;
  return {
    get running() { return running; },
    get queued() { return 0; },
    async run(task) {
      running++;
      const result = await task();
      running--;
      return result;
    },
  };
}
`,
  giai: '// Reference solution\n' + nguon(createGate),
  cases: [
    { goi: 'await (async () => { const g = createGate(4); const t0 = Date.now(); const out = await Promise.all(Array.from({ length: 8 }, (_, i) => g.run(decode("bomb" + i, 100)))); return [out, stats.max, Date.now() - t0]; })()', moTa: ['Eight decodes, gate of 4: peak 4, 200 ms', 'Tám lần giải mã, cổng 4: đỉnh 4, 200 ms'] },
    { goi: 'await (async () => { const g = createGate(2); const ps = ["a", "b", "c", "d", "e"].map((n) => g.run(decode(n, 50))); const snap = [g.running, g.queued]; await Promise.all(ps); await new Promise((r) => setTimeout(r, 1)); return [snap, stats.order, g.running, g.queued]; })()', moTa: ['FIFO order and the counters', 'Thứ tự FIFO và các bộ đếm'] },
    { goi: 'await (async () => { const g = createGate(1); const a = g.run(decode("bad", 10, true)).catch((e) => "rejected: " + e.message); const b = g.run(decode("good", 10)); const ra = await a, rb = await b; await new Promise((r) => setTimeout(r, 1)); return [ra, rb, g.running]; })()', moTa: ['A failing decode frees its slot', 'Lần giải mã lỗi vẫn trả chỗ'] },
    { goi: 'await (async () => { const g = createGate(4); const t0 = Date.now(); const rs = await Promise.allSettled(Array.from({ length: 8 }, (_, i) => g.run(decode("x" + i, 100, i % 2 === 0)))); const dt = Date.now() - t0; await new Promise((r) => setTimeout(r, 1)); return [rs.map((r) => r.status), stats.max, dt, g.running]; })()', an: true },
    { goi: 'await (async () => { const g = createGate(3); const r = await Promise.allSettled([g.run(() => { throw new Error("sync throw"); }), g.run(decode("ok", 30))]); await new Promise((r) => setTimeout(r, 1)); return [r.map((x) => x.status), g.running, g.queued]; })()', an: true },
    { goi: 'await (async () => { const g = createGate(2); const t0 = Date.now(); const times = []; await Promise.all([300, 100, 100, 100].map((ms, i) => g.run(decode("j" + i, ms)).then(() => times.push(Date.now() - t0)))); return [times, stats.max]; })()', an: true },
  ],
});

export default modul('nodejs-10-3-kiem-file-that', '10.3 Never trust the file: sniffing, polyglots, bombs', [E1, E2, E3, E4, E5]);
