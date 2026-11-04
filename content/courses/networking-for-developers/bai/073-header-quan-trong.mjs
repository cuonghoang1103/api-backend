/**
 * Chương 7 · 7.4 — Các header đổi hành vi: cache, nén, CORS, bảo mật (slug khung netdev-7-4-header-quan-trong).
 * Output thật: lab/out/c74-*.out.txt (dựng lại: bash lab/code/dung-output-ch7.sh).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import G from '../giang/nfd-07-4.mjs';

const L = card;
const WF = { mon: 'Web Foundations', khoa: 'web-foundations' };

export default {
  title: '7.4 — Headers that change behaviour: caching, compression, CORS, security|||7.4 — Các header đổi hành vi: cache, nén, CORS, bảo mật',
  slug: 'netdev-7-4-header-quan-trong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Các header là CHỈ DẪN đổi hành vi của cache/bộ nén/trình duyệt: cache (Cache-Control, ETag + If-None-Match → 304, Vary); nén (Accept-Encoding/Content-Encoding, gzip vs brotli vs zstd); CORS (preflight OPTIONS + Access-Control-Allow-*, do TRÌNH DUYỆT thi hành, sửa ở máy chủ); bảo mật (HSTS, CSP). Đọc từ câu trả lời thật bằng curl -I/-D.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Headers that change behaviour: caching, compression, CORS, security</h2>
<p class="lead">Most HTTP headers just describe the message. A handful <em>change what happens</em>: whether a browser caches a file for a year or never, whether a response is compressed 4× or sent raw, whether JavaScript on another site may read your API, whether the browser will ever speak plain HTTP to you again. Getting these wrong is behind a huge share of real problems — the page that will not update, the API that is mysteriously slow, the dreaded CORS error. This lesson reads the four families you meet most, each from a real response, so these headers stop being incantations you copy from Stack Overflow and become things you can see and verify.</p>

<h3>Caching: ETag and the 304</h3>
<p>The most valuable response is the one you do not have to download. The server stamps each version of a resource with an <strong>ETag</strong> (a version id); the client sends it back next time, and if nothing changed the server says so without re-sending the body:</p>
${run('c74-cache', 'etag=', 1, { max: 3 })}
${run('c74-cache', 'curl -sk -o /dev/null -w', 1)}
<p>The second request carried <code>If-None-Match: &lt;etag&gt;</code> and got <strong>304 Not Modified</strong> — a round trip, but <strong>no body</strong>. The client keeps using its cached copy. For a large asset that rarely changes, this turns a megabyte download into a tiny 304.</p>
<p>The companion headers tune the whole caching story:</p>
<ul>
<li><code>Cache-Control: max-age=600</code> — the client may use the cached copy for 600 seconds <em>without even asking</em> (it is “fresh”). No round trip at all.</li>
<li><code>Cache-Control: no-store</code> — never cache (sensitive data); <code>private</code> — only the browser, not shared CDNs.</li>
<li><code>ETag</code> + <code>If-None-Match</code> — revalidate when freshness expires: 304 if unchanged, 200 + body if changed.</li>
<li><code>Vary: Accept-Encoding</code> — cache a <em>separate</em> copy for each value of that request header, so a gzip client and a non-gzip client do not get each other’s body.</li>
</ul>
<p>The pattern behind every fast site: serve assets with <strong>hashed, immutable filenames</strong> (<code>app.9f3a.js</code>) and a long <code>max-age</code> — cache forever, and a changed file gets a new hash, so the URL itself busts the cache.</p>

<h3>Compression</h3>
<p>Text compresses brilliantly, so HTTP lets the client ask for it and the server provide it:</p>
${run('c74-gzip', 'curl -sk -o /dev/null -w', 1)}
${run('c74-gzip', 'curl -sk --compressed -D - -o /dev/null', 1)}
<p>The client advertises <code>Accept-Encoding: gzip, br, zstd</code> (curl’s <code>--compressed</code> does this); the server compresses and replies <code>Content-Encoding: gzip</code>, and the body is smaller. HTML, CSS, JS and JSON typically shrink 3–5×. The choices:</p>
<ul>
<li><strong>gzip</strong> — universal, fast, good enough; the safe default.</li>
<li><strong>brotli (br)</strong> — compresses static text better; ideal for pre-compressed assets at the CDN.</li>
<li><strong>zstd</strong> — newest, excellent ratio and speed; growing support.</li>
</ul>
<p>Two rules: <strong>compress text, not already-compressed bytes</strong> (JPEG/PNG/MP4/zip gain nothing and waste CPU), and remember <code>Vary: Accept-Encoding</code> so caches store the compressed and uncompressed versions separately.</p>

<h3>CORS: the preflight you can see</h3>
<p>When JavaScript on <code>https://app.labflow.test</code> calls an API on a <em>different</em> origin with a method or header that is not “simple”, the browser sends a <strong>preflight OPTIONS</strong> first, to ask permission:</p>
${run('c74-cors', 'curl -sk -X OPTIONS', 1, { max: 6 })}
<p>The server answers the OPTIONS (here <code>204</code>) with <code>Access-Control-Allow-Origin</code>, <code>-Methods</code> and <code>-Headers</code>. Only if those permit the real request does the browser send it. The crucial thing to understand:</p>
<div class="pitfall co-tieu-de">
<p><strong>CORS is a browser rule, not server security.</strong> The server <em>always</em> runs the request — <code>curl</code> and any non-browser client ignore CORS completely. CORS only decides whether <strong>JavaScript on another origin</strong> may <em>read</em> the response. So a “CORS error” in the console is never fixed by “disabling CORS” in the client; it is fixed on the <strong>server</strong> by sending the right <code>Access-Control-Allow-*</code> headers for that origin, method and header. And you cannot combine <code>Access-Control-Allow-Origin: *</code> with credentials — you must echo the specific requesting origin.</p>
</div>

<h3>Security headers</h3>
<p>Some headers harden the browser against attacks on future requests:</p>
${run('c74-cors', 'curl -sk -D - -o /dev/null https', 1)}
<ul>
<li><strong>HSTS</strong> (<code>Strict-Transport-Security</code>): “for the next <code>max-age</code> seconds, only ever reach this site over HTTPS” — the browser upgrades even a typed <code>http://</code> and refuses to downgrade. It closes the gap where a first plain-HTTP request could be hijacked.</li>
<li><strong>CSP</strong> (<code>Content-Security-Policy</code>): restrict where scripts, styles and images may load from — the main defence against XSS.</li>
<li><code>X-Content-Type-Options: nosniff</code>, <code>Referrer-Policy</code>, and others round out the set.</li>
</ul>
<p>The attacks these defend against are the subject of the web-security course; here the point is that they are just <strong>headers</strong>, set by your server or CDN, which you confirm with <code>curl -I</code>.</p>
${cauNoi('en', { ...WF, bai: 'wf-7-5-https-cors', so: '7.5', ten: 'HTTPS and CORS', giong: 'CORS and why cross-origin requests are restricted', khac: 'Web Foundations covers CORS from the application/API side', them: 'the preflight OPTIONS and Access-Control-Allow-* seen on the wire, caching with ETag/304 and Cache-Control, Accept-Encoding/Content-Encoding compression, and HSTS — the headers read from real responses' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> three complaints land: “the deployed JS won’t update”, “the API feels heavy over mobile”, and “our frontend gets a CORS error calling the API”. Diagnose each with headers.</p>
<ol>
<li>Caching: <code>curl -I</code> the static file, note the <code>ETag</code>, then re-request with <code>-H 'If-None-Match: &lt;etag&gt;'</code> and confirm <code>304</code>. Explain how hashed filenames + <code>max-age</code> fix “won’t update”.</li>
<li>Compression: compare <code>curl</code> with and without <code>--compressed</code>; find <code>Content-Encoding: gzip</code> and the size difference.</li>
<li>CORS: send a preflight <code>OPTIONS</code> with an <code>Origin</code> and <code>Access-Control-Request-Method</code>; read the <code>Access-Control-Allow-*</code> headers. Explain why the fix is on the server, not the browser.</li>
<li>Write the one-line fix for each complaint.</li>
</ol>
<p><strong>Done when:</strong> you have a 304 from an ETag, a measured compression saving, and a preflight response — and your fixes are “hashed filenames + long max-age”, “enable gzip/brotli”, and “add the right Access-Control-Allow-Origin on the server”.</p>
<details><summary>Solution</summary>
<p>The static file returns an <code>ETag</code>; re-requesting with <code>If-None-Match</code> gives <code>304</code> with no body. <code>--compressed</code> yields <code>Content-Encoding: gzip</code> and a smaller body. The preflight <code>OPTIONS</code> returns the <code>Access-Control-Allow-Origin/-Methods/-Headers</code>. Fixes: “won’t update → serve JS as <code>app.&lt;hash&gt;.js</code> with a long <code>max-age</code> so a new build gets a new URL; heavy over mobile → enable gzip/brotli (and don’t compress images); CORS error → the server must send <code>Access-Control-Allow-Origin</code> for the frontend’s origin — it is a browser rule, so you fix it on the server.”</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Cache-Control', 'Freshness rules: max-age (how long fresh), no-store, private/public.'],
  ['ETag / If-None-Match', 'A version id and the revalidation request that yields 304 if unchanged.'],
  ['304 Not Modified', 'A bodyless response telling the client to reuse its cached copy.'],
  ['Vary', 'Tells caches to key on a request header (e.g. Accept-Encoding) — separate copies.'],
  ['Accept-Encoding / Content-Encoding', 'The client asks for, and the server declares, compression (gzip/br/zstd).'],
  ['CORS preflight', 'An OPTIONS the browser sends before a non-simple cross-origin request.'],
  ['Access-Control-Allow-*', 'The server’s answer permitting an origin/method/header — enforced by the browser.'],
  ['HSTS', 'Strict-Transport-Security: force HTTPS for this site for max-age seconds.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>ETag + If-None-Match → 304 (no re-download); Cache-Control sets freshness; Vary splits the cache key.</li>
<li>Accept-Encoding / Content-Encoding: gzip/brotli/zstd shrink text 3–5× — never re-compress images.</li>
<li>CORS is a preflight OPTIONS + Access-Control-Allow-* ; enforced by the browser, fixed on the server (not <code>curl</code>).</li>
<li>HSTS, CSP and friends tell the browser to stay on HTTPS and restrict what loads.</li>
<li>Headers are instructions to caches/compressors/browsers — verify them with <code>curl -I</code> at each hop.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/HTTP/Caching', '📘', 'MDN — HTTP caching', 'Cache-Control, ETag, revalidation and the 304, with examples.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/CORS', '📘', 'MDN — CORS', 'The preflight, the Access-Control-Allow-* headers, and credentials.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Encoding', '📘', 'MDN — Content-Encoding', 'gzip, br and zstd, and when to use each.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security', '📘', 'MDN — Strict-Transport-Security (HSTS)', 'Forcing HTTPS, max-age, includeSubDomains and preload.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Các header đổi hành vi: cache, nén, CORS, bảo mật</h2>
<p class="lead">Phần lớn header HTTP chỉ mô tả thông điệp. Một nhúm thì <em>đổi chuyện gì xảy ra</em>: trình duyệt cache một tệp cả năm hay không bao giờ, một câu trả lời được nén 4× hay gửi thô, JavaScript trên một site khác có đọc được API của bạn không, trình duyệt có bao giờ nói HTTP thường với bạn nữa không. Làm sai những cái này là nguyên nhân của một phần lớn các vấn đề thật — trang không chịu cập nhật, API chậm bí ẩn, lỗi CORS đáng sợ. Bài này đọc bốn họ bạn gặp nhiều nhất, mỗi cái từ một câu trả lời thật, để các header này thôi là bùa chú bạn chép từ Stack Overflow và trở thành thứ bạn thấy và xác nhận được.</p>

<h3>Cache: ETag và cái 304</h3>
<p>Câu trả lời giá trị nhất là câu bạn không phải tải. Máy chủ đóng dấu mỗi phiên bản của một tài nguyên bằng một <strong>ETag</strong> (một mã phiên bản); client gửi nó lại lần sau, và nếu không đổi gì máy chủ nói vậy mà không gửi lại thân:</p>
${run('c74-cache', 'etag=', 1, { max: 3 })}
${run('c74-cache', 'curl -sk -o /dev/null -w', 1)}
<p>Yêu cầu thứ hai mang <code>If-None-Match: &lt;etag&gt;</code> và nhận <strong>304 Not Modified</strong> — một vòng khứ hồi, nhưng <strong>không thân</strong>. Client tiếp tục dùng bản cache. Với một tài nguyên lớn hiếm khi đổi, điều này biến một lần tải megabyte thành một 304 tí hon.</p>
<p>Các header đi kèm chỉnh cả câu chuyện cache:</p>
<ul>
<li><code>Cache-Control: max-age=600</code> — client được dùng bản cache 600 giây <em>mà không cần hỏi</em> (nó “tươi”). Không vòng khứ hồi nào.</li>
<li><code>Cache-Control: no-store</code> — không bao giờ cache (dữ liệu nhạy cảm); <code>private</code> — chỉ trình duyệt, không CDN dùng chung.</li>
<li><code>ETag</code> + <code>If-None-Match</code> — kiểm lại khi độ tươi hết: 304 nếu không đổi, 200 + thân nếu đổi.</li>
<li><code>Vary: Accept-Encoding</code> — cache một bản <em>riêng</em> cho mỗi giá trị của header yêu cầu đó, để một client gzip và một client không-gzip không nhận thân của nhau.</li>
</ul>
<p>Khuôn mẫu sau mọi site nhanh: phục vụ tài nguyên với <strong>tên tệp có mã băm, bất biến</strong> (<code>app.9f3a.js</code>) và một <code>max-age</code> dài — cache mãi mãi, và một tệp đổi nhận một mã băm mới, nên chính URL phá cache.</p>

<h3>Nén</h3>
<p>Văn bản nén tuyệt vời, nên HTTP cho client xin và máy chủ cung cấp:</p>
${run('c74-gzip', 'curl -sk -o /dev/null -w', 1)}
${run('c74-gzip', 'curl -sk --compressed -D - -o /dev/null', 1)}
<p>Client khai <code>Accept-Encoding: gzip, br, zstd</code> (<code>--compressed</code> của curl làm vậy); máy chủ nén và trả <code>Content-Encoding: gzip</code>, và thân nhỏ hơn. HTML, CSS, JS và JSON thường co 3–5×. Các lựa chọn:</p>
<ul>
<li><strong>gzip</strong> — phổ quát, nhanh, đủ tốt; mặc định an toàn.</li>
<li><strong>brotli (br)</strong> — nén văn bản tĩnh tốt hơn; lý tưởng cho tài nguyên nén sẵn ở CDN.</li>
<li><strong>zstd</strong> — mới nhất, tỷ lệ và tốc độ tuyệt; hỗ trợ đang tăng.</li>
</ul>
<p>Hai quy tắc: <strong>nén văn bản, không nén các byte đã nén</strong> (JPEG/PNG/MP4/zip chẳng được gì và phí CPU), và nhớ <code>Vary: Accept-Encoding</code> để cache lưu riêng bản nén và không nén.</p>

<h3>CORS: cú preflight bạn thấy được</h3>
<p>Khi JavaScript trên <code>https://app.labflow.test</code> gọi một API ở một origin <em>khác</em> với một method hay header không “đơn giản”, trình duyệt gửi một <strong>preflight OPTIONS</strong> trước, để xin phép:</p>
${run('c74-cors', 'curl -sk -X OPTIONS', 1, { max: 6 })}
<p>Máy chủ trả OPTIONS (ở đây <code>204</code>) với <code>Access-Control-Allow-Origin</code>, <code>-Methods</code> và <code>-Headers</code>. Chỉ khi chúng cho phép yêu cầu thật trình duyệt mới gửi nó. Điều quan trọng cần hiểu:</p>
<div class="pitfall co-tieu-de">
<p><strong>CORS là một luật trình duyệt, không phải bảo mật máy chủ.</strong> Máy chủ <em>luôn</em> chạy yêu cầu — <code>curl</code> và bất kỳ client không-trình-duyệt nào bỏ qua CORS hoàn toàn. CORS chỉ quyết <strong>JavaScript trên một origin khác</strong> có được <em>đọc</em> câu trả lời không. Nên một “lỗi CORS” trong console không bao giờ sửa bằng “tắt CORS” ở client; nó sửa trên <strong>máy chủ</strong> bằng cách gửi đúng các header <code>Access-Control-Allow-*</code> cho origin, method và header đó. Và bạn không kết hợp được <code>Access-Control-Allow-Origin: *</code> với credentials — phải vọng lại origin cụ thể đang hỏi.</p>
</div>

<h3>Các header bảo mật</h3>
<p>Một số header làm cứng trình duyệt chống tấn công trên các yêu cầu sau:</p>
${run('c74-cors', 'curl -sk -D - -o /dev/null https', 1)}
<ul>
<li><strong>HSTS</strong> (<code>Strict-Transport-Security</code>): “trong <code>max-age</code> giây tới, chỉ tới site này qua HTTPS” — trình duyệt nâng cả một <code>http://</code> gõ tay và từ chối hạ cấp. Nó đóng khe mà một yêu cầu HTTP thường đầu tiên có thể bị cướp.</li>
<li><strong>CSP</strong> (<code>Content-Security-Policy</code>): hạn chế script, style và ảnh được tải từ đâu — phòng thủ chính chống XSS.</li>
<li><code>X-Content-Type-Options: nosniff</code>, <code>Referrer-Policy</code>, và các cái khác làm trọn bộ.</li>
</ul>
<p>Các cuộc tấn công chúng phòng là chủ đề của khoá bảo mật web; ở đây điểm là chúng chỉ là <strong>header</strong>, đặt bởi máy chủ hay CDN của bạn, mà bạn xác nhận bằng <code>curl -I</code>.</p>
${cauNoi('vi', { ...WF, bai: 'wf-7-5-https-cors', so: '7.5', ten: 'HTTPS và CORS', giong: 'CORS và vì sao yêu cầu chéo origin bị hạn chế', khac: 'khoá Nền tảng Web dạy CORS từ phía ứng dụng/API', them: 'preflight OPTIONS và Access-Control-Allow-* thấy trên dây, cache với ETag/304 và Cache-Control, nén Accept-Encoding/Content-Encoding, và HSTS — các header đọc từ câu trả lời thật' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> ba lời than đến: “JS đã deploy không chịu cập nhật”, “API thấy nặng qua di động”, và “frontend của mình bị lỗi CORS khi gọi API”. Chẩn đoán từng cái bằng header.</p>
<ol>
<li>Cache: <code>curl -I</code> tệp tĩnh, ghi <code>ETag</code>, rồi hỏi lại với <code>-H 'If-None-Match: &lt;etag&gt;'</code> và xác nhận <code>304</code>. Giải thích tên tệp có mã băm + <code>max-age</code> sửa “không cập nhật” ra sao.</li>
<li>Nén: so <code>curl</code> có và không <code>--compressed</code>; tìm <code>Content-Encoding: gzip</code> và khác biệt kích thước.</li>
<li>CORS: gửi một preflight <code>OPTIONS</code> với một <code>Origin</code> và <code>Access-Control-Request-Method</code>; đọc các header <code>Access-Control-Allow-*</code>. Giải thích vì sao cách sửa ở máy chủ, không phải trình duyệt.</li>
<li>Viết cách sửa một dòng cho mỗi lời than.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một 304 từ một ETag, một khoản tiết kiệm nén đo được, và một câu trả lời preflight — và các cách sửa là “tên tệp có mã băm + max-age dài”, “bật gzip/brotli”, và “thêm đúng Access-Control-Allow-Origin ở máy chủ”.</p>
<details><summary>Lời giải</summary>
<p>Tệp tĩnh trả một <code>ETag</code>; hỏi lại với <code>If-None-Match</code> cho <code>304</code> không thân. <code>--compressed</code> cho <code>Content-Encoding: gzip</code> và một thân nhỏ hơn. Preflight <code>OPTIONS</code> trả các <code>Access-Control-Allow-Origin/-Methods/-Headers</code>. Sửa: “không cập nhật → phục vụ JS là <code>app.&lt;hash&gt;.js</code> với một <code>max-age</code> dài để một build mới nhận một URL mới; nặng qua di động → bật gzip/brotli (và đừng nén ảnh); lỗi CORS → máy chủ phải gửi <code>Access-Control-Allow-Origin</code> cho origin của frontend — nó là luật trình duyệt, nên sửa ở máy chủ.”</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Cache-Control', 'Luật độ tươi: max-age (tươi bao lâu), no-store, private/public.'],
  ['ETag / If-None-Match', 'Một mã phiên bản và yêu cầu kiểm lại cho 304 nếu không đổi.'],
  ['304 Not Modified', 'Một câu trả lời không thân bảo client dùng lại bản cache.'],
  ['Vary', 'Bảo cache khoá theo một header yêu cầu (vd Accept-Encoding) — bản riêng.'],
  ['Accept-Encoding / Content-Encoding', 'Client xin, và máy chủ khai, nén (gzip/br/zstd).'],
  ['CORS preflight', 'Một OPTIONS trình duyệt gửi trước một yêu cầu chéo origin không đơn giản.'],
  ['Access-Control-Allow-*', 'Câu trả lời của máy chủ cho phép một origin/method/header — do trình duyệt thi hành.'],
  ['HSTS', 'Strict-Transport-Security: ép HTTPS cho site này trong max-age giây.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>ETag + If-None-Match → 304 (không tải lại); Cache-Control đặt độ tươi; Vary tách khoá cache.</li>
<li>Accept-Encoding / Content-Encoding: gzip/brotli/zstd co văn bản 3–5× — đừng nén lại ảnh.</li>
<li>CORS là một preflight OPTIONS + Access-Control-Allow-* ; do trình duyệt thi hành, sửa ở máy chủ (không phải <code>curl</code>).</li>
<li>HSTS, CSP và họ hàng bảo trình duyệt ở lại HTTPS và hạn chế cái gì được tải.</li>
<li>Header là chỉ dẫn cho cache/bộ nén/trình duyệt — xác nhận bằng <code>curl -I</code> ở mỗi chặng.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/HTTP/Caching', '📘', 'MDN — Cache HTTP', 'Cache-Control, ETag, kiểm lại và cái 304, kèm ví dụ.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/CORS', '📘', 'MDN — CORS', 'Preflight, các header Access-Control-Allow-*, và credentials.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Encoding', '📘', 'MDN — Content-Encoding', 'gzip, br và zstd, và khi nào dùng cái nào.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security', '📘', 'MDN — Strict-Transport-Security (HSTS)', 'Ép HTTPS, max-age, includeSubDomains và preload.', 'Mở')}
</div>
`,
};
