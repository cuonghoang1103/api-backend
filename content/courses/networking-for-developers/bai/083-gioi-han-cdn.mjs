/**
 * Chương 8 · 8.4 — Giới hạn của CDN: timeout, kích thước và nội dung động (slug khung netdev-8-4-gioi-han-cdn).
 * Output thật: lab/out/c84-*.out.txt (dựng lại: bash lab/code/dung-output-ch8.sh).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import G from '../giang/nfd-08-4.mjs';

const L = card;
const API = { mon: 'API & System Design', khoa: 'api-design' };

export default {
  title: '8.4 — CDN limits: timeouts, body size and dynamic content|||8.4 — Giới hạn của CDN: timeout, kích thước và nội dung động',
  slug: 'netdev-8-4-gioi-han-cdn',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Biên có giới hạn: timeout yêu cầu (~100s ⇒ Cloudflare 524; lab hiện 504 ở 1s), trần kích thước thân (⇒ 413), và nội dung động/dòng không hợp với biên. Cách đi VÒNG: việc dài ⇒ 202 + chạy nền + hỏi lại; upload lớn ⇒ presigned URL thẳng R2/S3. Phân biệt 502/503/504/524 (ai phát, nghĩa gì). Đo thật 504 và 413 trên lab.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>CDN limits: timeouts, body size and dynamic content</h2>
<p class="lead">A CDN is superb at one thing — many short, cacheable requests — and actively hostile to everything else. The failures are not bugs; they are limits, and they bite exactly when your feature is most important: the big report that times out, the large upload that is rejected, the live stream that stalls. This lesson walks the three walls on the lab — a request timeout, a body-size cap — and shows the pattern for each: route the work <em>around</em> the edge, not through it.</p>

<h3>The edge will not wait forever</h3>
<p>Our lab edge has a 1-second read timeout. Point it at a 3-second origin:</p>
${run('c84-limit', 'curl', 1)}
<p>The origin is perfectly healthy; it is just slow, and the edge gives up at its timeout with a <strong>504</strong>. Cloudflare does exactly this at about <strong>100–125 seconds</strong> and returns its own code, <strong>524</strong>: "I connected to your origin but it did not answer in time." The number differs; the rule is universal — <em>any single request that runs longer than the edge's timeout is doomed</em>, however healthy the origin.</p>

<h3>502, 503, 504, 524 — read the right one</h3>
${kv([
  ['502 Bad Gateway', 'The proxy reached the origin but got a broken/empty reply.'],
  ['503 Service Unavailable', 'The proxy has no healthy origin to send to (down/overloaded).'],
  ['504 Gateway Timeout', 'The origin did not answer within the proxy’s read timeout.'],
  ['524 (Cloudflare)', 'Cloudflare-specific 504: origin connected but silent past ~100 s.'],
])}
<p>All of these come from <strong>the proxy or edge</strong>, describing the origin — not from your application code. Reading the right one tells you whether the origin is broken (502), missing (503) or merely too slow (504/524). Chapter 10 covers them in full; here the point is that the timeout ones (504/524) are a signal to <strong>change the shape of the request</strong>, not to raise a number.</p>

<h3>Long work: return fast, finish later</h3>
<p>If a job can run longer than the edge timeout, do not run it inside the HTTP request. The pattern:</p>
<ol>
<li>The client asks to start the job; the server returns <strong><code>202 Accepted</code></strong> and a status URL <em>immediately</em>.</li>
<li>The job runs in a <strong>background worker / queue</strong>, off the request's clock.</li>
<li>The client <strong>polls</strong> the status URL (or uses SSE/WebSocket — next chapter) until done, then downloads the result.</li>
</ol>
<p>This is Cloudflare's own documented advice for long processes: "implement status polling of large HTTP processes." The request that <em>starts</em> the report is fast and never hits 524; the report itself takes as long as it needs, out of band.</p>
${cauNoi('en', { ...API, bai: 'api-10-1-hang-doi', so: '10.1', ten: 'Asynchronous APIs: 202 Accepted, job resources and polling', giong: 'returning 202 and polling for the result of a long job', khac: 'the API course designs the job-resource contract (status URL, states, estimates)', them: 'why you are forced into it here — the edge’s ~100 s timeout (524) that kills any request held open longer' })}

<h3>Body-size limits</h3>
<p>The edge also caps how big a request body may be. The lab uses <code>client_max_body_size 1m</code>; push 2 MB through it:</p>
${run('c84-limit', 'head', 1)}
<p><strong>413 Payload Too Large.</strong> Cloudflare's free/pro plans cap uploads around 100 MB. Raising the limit is a losing game — pushing large files <em>through</em> the edge wastes its bandwidth and still hits a wall eventually. The real fix is to not send big bytes through the edge at all.</p>

<h3>Big uploads: a presigned URL straight to storage</h3>
<ol>
<li>The browser asks your API for a <strong>presigned URL</strong> — a short-lived, signed <code>PUT</code> to R2/S3.</li>
<li>The browser uploads the file <strong>directly</strong> to object storage, not through your API or the CDN.</li>
<li>The browser tells your API the object key; your API records it. The big bytes never touched the edge.</li>
</ol>
<p>This is exactly how LabFlow and cuongthai.com take large uploads — a presigned <code>PUT</code> straight to Cloudflare R2 — so the edge and the origin only ever see small JSON. No 413, no wasted bandwidth, no timeout.</p>

<div class="pitfall co-tieu-de">
<p><strong>The edge is built for many short requests — do not fight its limits head-on.</strong> Teams hit a 524 and raise the origin timeout, hit a 413 and raise <code>client_max_body_size</code>, hit a stalled stream and tweak buffer sizes — and the problem returns at the next scale. The durable answer is a different <em>shape</em>: start-and-poll for long work, presigned object storage for large transfers, and a purpose-built long-lived connection (next chapter) for streams. Anything long, huge or continuously streaming does not belong on the request/response path through the edge.</p>
</div>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> two incidents — a "generate PDF report" endpoint 524s for big accounts, and a "upload course video" endpoint 413s. Redesign both.</p>
<ol>
<li>On the lab, reproduce the 504 (<code>curl .../cham/api/slow</code>) and the 413 (2 MB upload). Explain which layer produced each and why.</li>
<li>Sketch the report flow with <code>202 Accepted</code> + a status URL + polling. Where does the actual work run?</li>
<li>Sketch the upload flow with a presigned URL. Which bytes go through your API, and which go straight to R2?</li>
<li>Say in one line why raising the origin timeout and <code>client_max_body_size</code> is the wrong fix.</li>
</ol>
<p><strong>Done when:</strong> you have a real 504 and 413, a report flow that returns immediately and polls, and an upload flow where only small JSON touches your API — and you can say the edge is for short requests, so long/huge work is routed around it.</p>
<details><summary>Solution</summary>
<p>The 504 comes from the edge: the origin took 3 s, the edge's read timeout is 1 s. The 413 comes from the edge: the 2 MB body exceeded <code>client_max_body_size 1m</code>. Report flow: <code>POST /reports</code> → <code>202</code> + <code>/reports/:id</code>; a worker builds the PDF; the client polls <code>/reports/:id</code> until <code>done</code> then downloads it. Upload flow: <code>POST /uploads</code> → a presigned <code>PUT</code> URL; the browser <code>PUT</code>s the file directly to R2; then <code>POST /uploads/complete</code> with the key — only small JSON hits your API. Raising timeouts/limits just moves the wall; the shape is wrong, not the number.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['524', 'Cloudflare timeout: origin connected but silent past ~100 s.'],
  ['504 / 502 / 503', 'Gateway timeout / bad gateway / no healthy origin — from the proxy.'],
  ['202 Accepted', 'Start the job, return now with a status URL; finish in the background.'],
  ['Polling', 'Client repeatedly checks the status URL until the job is done.'],
  ['413 Payload Too Large', 'The body exceeded the edge/proxy body-size cap.'],
  ['Presigned URL', 'A short-lived signed URL to upload/download straight to R2/S3.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>The edge has a <strong>request timeout</strong> (~100 s on Cloudflare → <code>524</code>; the lab shows <code>504</code> at 1 s) — long requests are doomed.</li>
<li><code>502/503/504</code> come from the proxy about the origin (broken / missing / too slow); <code>524</code> is Cloudflare's.</li>
<li>Long work ⇒ <code>202</code> + background + poll — never hold the HTTP request open.</li>
<li>The edge caps body size (<code>413</code>); big uploads ⇒ a <strong>presigned URL</strong> straight to R2/S3.</li>
<li>The edge is for many <strong>short</strong> requests; route long/huge/streaming work <em>around</em> it, not through it.</li>
</ul>
${L('https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-524/', '📘', 'Cloudflare — Error 524 (timeout)', 'Why 524 happens (~100 s) and the advice to poll long HTTP processes.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Status/413', '📘', 'MDN — 413 Payload Too Large', 'The body-size status, and how a proxy enforces the cap.', 'Open')}
${L('https://developers.cloudflare.com/r2/api/s3/presigned-urls/', '📘', 'Cloudflare R2 — Presigned URLs', 'Upload/download straight to object storage, bypassing your origin.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Giới hạn của CDN: timeout, kích thước và nội dung động</h2>
<p class="lead">Một CDN xuất sắc ở một việc — nhiều yêu cầu ngắn, cache-được — và thù địch chủ động với mọi thứ khác. Các thất bại không phải lỗi; chúng là giới hạn, và chúng cắn đúng lúc tính năng của bạn quan trọng nhất: báo cáo lớn timeout, upload lớn bị từ chối, dòng trực tiếp kẹt. Bài này đi qua ba bức tường trên lab — một timeout yêu cầu, một trần kích thước thân — và cho thấy khuôn mẫu cho mỗi cái: đưa việc đi <em>vòng</em> qua biên, không <em>xuyên</em> qua nó.</p>

<h3>Biên không chờ mãi được</h3>
<p>Biên lab của ta có timeout đọc 1 giây. Trỏ nó vào một origin 3 giây:</p>
${run('c84-limit', 'curl', 1)}
<p>Origin hoàn toàn khoẻ; nó chỉ chậm, và biên bỏ cuộc ở timeout của nó với một <strong>504</strong>. Cloudflare làm đúng như vậy ở khoảng <strong>100–125 giây</strong> và trả mã riêng của nó, <strong>524</strong>: "Tôi nối tới origin của bạn nhưng nó không trả lời kịp." Con số khác nhau; quy tắc phổ quát — <em>bất kỳ yêu cầu đơn nào chạy lâu hơn timeout của biên đều chết</em>, dù origin khoẻ đến đâu.</p>

<h3>502, 503, 504, 524 — đọc đúng cái</h3>
${kv([
  ['502 Bad Gateway', 'Proxy tới được origin nhưng nhận một trả lời hỏng/rỗng.'],
  ['503 Service Unavailable', 'Proxy không có origin khoẻ nào để gửi tới (sập/quá tải).'],
  ['504 Gateway Timeout', 'Origin không trả lời trong timeout đọc của proxy.'],
  ['524 (Cloudflare)', '504 riêng của Cloudflare: origin nối được nhưng im quá ~100 giây.'],
])}
<p>Tất cả đến từ <strong>proxy hay biên</strong>, mô tả origin — không từ mã ứng dụng của bạn. Đọc đúng cái cho bạn biết origin hỏng (502), thiếu (503) hay chỉ quá chậm (504/524). Chương 10 nói trọn; ở đây điểm là các mã timeout (504/524) là tín hiệu để <strong>đổi dáng của yêu cầu</strong>, không phải nâng một con số.</p>

<h3>Việc dài: trả về nhanh, làm xong sau</h3>
<p>Nếu một việc có thể chạy lâu hơn timeout của biên, đừng chạy nó trong yêu cầu HTTP. Khuôn mẫu:</p>
<ol>
<li>Client xin bắt đầu việc; máy chủ trả <strong><code>202 Accepted</code></strong> và một URL trạng thái <em>ngay</em>.</li>
<li>Việc chạy trong một <strong>worker / hàng đợi ở nền</strong>, ngoài đồng hồ của yêu cầu.</li>
<li>Client <strong>hỏi lại</strong> URL trạng thái (hoặc dùng SSE/WebSocket — chương sau) tới khi xong, rồi tải kết quả.</li>
</ol>
<p>Đây là lời khuyên có tài liệu của chính Cloudflare cho tiến trình dài: "hiện thực hỏi-lại trạng thái cho các tiến trình HTTP lớn." Yêu cầu <em>bắt đầu</em> báo cáo thì nhanh và không bao giờ đụng 524; bản thân báo cáo mất bao lâu tuỳ nó, ngoài luồng.</p>
${cauNoi('vi', { ...API, bai: 'api-10-1-hang-doi', so: '10.1', ten: 'API bất đồng bộ: 202 Accepted, tài nguyên công việc và hỏi lại', giong: 'trả 202 và hỏi lại kết quả của một việc dài', khac: 'khoá API thiết kế hợp đồng tài nguyên công việc (URL trạng thái, các trạng thái, ước lượng)', them: 'vì sao ở đây bạn BUỘC phải dùng nó — timeout ~100 giây của biên (524) giết mọi yêu cầu giữ mở lâu hơn' })}

<h3>Giới hạn kích thước thân</h3>
<p>Biên cũng chặn thân yêu cầu to tới đâu. Lab dùng <code>client_max_body_size 1m</code>; đẩy 2 MB qua nó:</p>
${run('c84-limit', 'head', 1)}
<p><strong>413 Payload Too Large.</strong> Gói miễn phí/pro của Cloudflare chặn upload khoảng 100 MB. Nâng giới hạn là trò thua — đẩy tệp lớn <em>xuyên</em> qua biên phí băng thông của nó và rốt cuộc vẫn đụng tường. Cách sửa thật là hoàn toàn không gửi byte lớn qua biên.</p>

<h3>Upload lớn: một presigned URL thẳng tới kho</h3>
<ol>
<li>Trình duyệt xin API của bạn một <strong>presigned URL</strong> — một <code>PUT</code> có ký, ngắn hạn, tới R2/S3.</li>
<li>Trình duyệt upload tệp <strong>thẳng</strong> tới kho đối tượng, không qua API của bạn hay CDN.</li>
<li>Trình duyệt báo API khoá đối tượng; API ghi lại. Byte lớn không bao giờ chạm biên.</li>
</ol>
<p>Đây đúng là cách LabFlow và cuongthai.com nhận upload lớn — một <code>PUT</code> presigned thẳng tới Cloudflare R2 — nên biên và origin chỉ thấy JSON nhỏ. Không 413, không phí băng thông, không timeout.</p>

<div class="pitfall co-tieu-de">
<p><strong>Biên được dựng cho nhiều yêu cầu ngắn — đừng đấu trực diện với giới hạn của nó.</strong> Đội nhóm đụng 524 thì nâng timeout origin, đụng 413 thì nâng <code>client_max_body_size</code>, đụng dòng kẹt thì chỉnh kích thước đệm — và vấn đề quay lại ở quy mô kế. Câu trả lời bền là một <em>dáng</em> khác: bắt-rồi-hỏi-lại cho việc dài, kho đối tượng presigned cho truyền lớn, và một kết nối sống lâu dựng riêng (chương sau) cho dòng. Bất cứ gì dài, khổng lồ hay phát dòng liên tục không thuộc về đường request/response xuyên qua biên.</p>
</div>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> hai sự cố — một điểm cuối "sinh báo cáo PDF" 524 với tài khoản lớn, và một điểm cuối "upload video khoá học" 413. Thiết kế lại cả hai.</p>
<ol>
<li>Trên lab, tái hiện 504 (<code>curl .../cham/api/slow</code>) và 413 (upload 2 MB). Giải thích tầng nào tạo ra mỗi cái và vì sao.</li>
<li>Phác luồng báo cáo với <code>202 Accepted</code> + một URL trạng thái + hỏi lại. Việc thật chạy ở đâu?</li>
<li>Phác luồng upload với một presigned URL. Byte nào qua API của bạn, byte nào đi thẳng tới R2?</li>
<li>Nói một dòng vì sao nâng timeout origin và <code>client_max_body_size</code> là cách sửa sai.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một 504 và 413 thật, một luồng báo cáo trả về ngay và hỏi lại, và một luồng upload nơi chỉ JSON nhỏ chạm API — và bạn nói được biên dành cho yêu cầu ngắn, nên việc dài/khổng lồ được đưa vòng qua nó.</p>
<details><summary>Lời giải</summary>
<p>504 đến từ biên: origin mất 3 giây, timeout đọc của biên là 1 giây. 413 đến từ biên: thân 2 MB vượt <code>client_max_body_size 1m</code>. Luồng báo cáo: <code>POST /reports</code> → <code>202</code> + <code>/reports/:id</code>; một worker dựng PDF; client hỏi lại <code>/reports/:id</code> tới khi <code>done</code> rồi tải. Luồng upload: <code>POST /uploads</code> → một URL <code>PUT</code> presigned; trình duyệt <code>PUT</code> tệp thẳng tới R2; rồi <code>POST /uploads/complete</code> với khoá — chỉ JSON nhỏ chạm API. Nâng timeout/giới hạn chỉ dời tường; dáng sai, không phải con số.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['524', 'Timeout Cloudflare: origin nối được nhưng im quá ~100 giây.'],
  ['504 / 502 / 503', 'Gateway timeout / bad gateway / không có origin khoẻ — từ proxy.'],
  ['202 Accepted', 'Bắt đầu việc, trả về ngay với một URL trạng thái; làm xong ở nền.'],
  ['Polling (hỏi lại)', 'Client kiểm URL trạng thái lặp lại tới khi việc xong.'],
  ['413 Payload Too Large', 'Thân vượt trần kích thước thân của biên/proxy.'],
  ['Presigned URL', 'Một URL có ký ngắn hạn để upload/download thẳng tới R2/S3.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Biên có một <strong>timeout yêu cầu</strong> (~100 giây trên Cloudflare → <code>524</code>; lab hiện <code>504</code> ở 1 giây) — yêu cầu dài chết.</li>
<li><code>502/503/504</code> đến từ proxy về origin (hỏng / thiếu / quá chậm); <code>524</code> là của Cloudflare.</li>
<li>Việc dài ⇒ <code>202</code> + chạy nền + hỏi lại — không bao giờ giữ yêu cầu HTTP mở.</li>
<li>Biên chặn kích thước thân (<code>413</code>); upload lớn ⇒ một <strong>presigned URL</strong> thẳng tới R2/S3.</li>
<li>Biên dành cho nhiều yêu cầu <strong>ngắn</strong>; đưa việc dài/khổng lồ/phát dòng đi <em>vòng</em> qua nó, không xuyên qua.</li>
</ul>
${L('https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-524/', '📘', 'Cloudflare — Lỗi 524 (timeout)', 'Vì sao 524 xảy ra (~100 giây) và lời khuyên hỏi-lại cho tiến trình HTTP dài.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Status/413', '📘', 'MDN — 413 Payload Too Large', 'Mã kích thước thân, và cách một proxy thi hành trần.', 'Mở')}
${L('https://developers.cloudflare.com/r2/api/s3/presigned-urls/', '📘', 'Cloudflare R2 — Presigned URL', 'Upload/download thẳng tới kho đối tượng, đi vòng qua origin.', 'Mở')}
</div>
`,
};
