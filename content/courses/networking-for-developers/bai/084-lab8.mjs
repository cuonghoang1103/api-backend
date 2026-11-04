/**
 * Chương 8 · Lab 8 — Kiểm toán tầng CDN của LabFlow (phần 8 dự án xuyên khoá). CDN thu nhỏ: edge/origin/broken edge + slow/limit.
 * Lời giải dùng output thật: lab/out/c81-*, c82-*, c83-*, c84-*.out.txt.
 */
import { run, card, kv, code } from '../_ui.mjs';
import G from '../giang/nfd-lab-8.mjs';

const L = card;
const PHIEU = `# Lab 8 report — <your name>, <date>

## R1 Hit/miss/expired — MISS → HIT → HIT (one file); MISS → HIT → EXPIRED (across TTL); which requests hit the origin
## R2 Cache key       — ?v=1 vs ?v=2 are separate entries; low hit rate; fix = hashed filenames
## R3 Swallowed header — origin max-age=3600 vs broken edge no-store; the two directives (proxy_hide_header + add_header)
## R4 Edge limits     — 504 (slow origin, 1 s timeout) + 413 (2 MB body, 1 MB cap); redesign (202+poll, presigned URL)`;

export default {
  title: 'Lab 8 — Auditing LabFlow’s CDN layer: prove the cache, catch a swallowed header, hit the limits|||Lab 8 — Kiểm toán tầng CDN của LabFlow: chứng minh cache, bắt header bị nuốt, đụng giới hạn',
  slug: 'netdev-8-5-lab-cdn-labflow',
  type: 'LESSON',
  isFreePreview: true,
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lab 8 · Course project part 8</span>
<h2>Lab 8 — Auditing LabFlow’s CDN layer</h2>
<p class="lead">LabFlow put a CDN in front of the app, and the audit found a mess of symptoms: some pages fast, a "fixed" logo still stale after a deploy, a big CDN bill with a low hit rate, and the report and upload endpoints failing. The audit does not want opinions — it wants proof read from headers of what the cache does on each request, and the root cause of each complaint. This lab builds a miniature CDN (an edge, an origin, a deliberately broken edge, and endpoints that reproduce the timeout and body-size walls) and tracks every symptom to its cause. Everything is in Chapter 8.</p>

<h3>What you get</h3>
<ul>
<li>An <strong>edge</strong> (<code>10.10.2.10:8080</code>) caching from an <strong>origin</strong> (<code>:8081</code>), plus a <strong>broken edge</strong> (<code>:8082</code>) that rewrites cache headers.</li>
<li>A <strong>slow path</strong> (<code>:8080/cham/</code>, 1 s read timeout) and a <strong>1 MB body cap</strong> to reproduce 504 and 413.</li>
<li>The tools: <code>curl -I</code> / <code>curl -sD -</code>, and <code>bash lab/code/dung-output-ch8.sh</code> to bring it all up.</li>
</ul>

<h3>Requirements</h3>
<ol>
<li><strong>R1 Hit/miss/expired.</strong> Show <code>MISS → HIT → HIT</code> on one file and <code>MISS → HIT → EXPIRED</code> across a TTL. Say which requests reached the origin.</li>
<li><strong>R2 Cache key.</strong> Show that <code>?v=1</code> and <code>?v=2</code> are separate cache entries, and explain the low hit rate. Give the fix.</li>
<li><strong>R3 Swallowed header.</strong> Show the origin's <code>max-age=3600</code> and the broken edge's <code>no-store</code> for the same file; name the two nginx directives.</li>
<li><strong>R4 Edge limits.</strong> Produce a <code>504</code> (slow origin) and a <code>413</code> (oversized body); give the right redesign for each.</li>
</ol>

<h3>Report template</h3>
${code(PHIEU, 'markdown')}

<h3>Rubric — 10 points</h3>
<table>
<tr><th>Item</th><th>Pts</th><th>Full marks when</th></tr>
<tr><td>R1</td><td>2.5</td><td>MISS→HIT→HIT and MISS→HIT→EXPIRED, with origin-touch explained</td></tr>
<tr><td>R2</td><td>2.5</td><td><code>?v=1</code> vs <code>?v=2</code> shown as separate keys; hashed-filename fix</td></tr>
<tr><td>R3</td><td>2.5</td><td>origin vs broken edge <code>Cache-Control</code> shown; both directives named</td></tr>
<tr><td>R4</td><td>2.5</td><td>504 and 413 reproduced; 202+poll and presigned-URL redesign given</td></tr>
</table>

<h3>Hints by level</h3>
<details><summary>Hints</summary>
<ul>
<li>R1: <code>curl -sD - -o /dev/null http://10.10.2.10:8080/img/logo.txt | grep -i x-cache</code> (×3); then <code>:8080/</code> with a 31 s wait for <code>EXPIRED</code>.</li>
<li>R2: the same file with <code>?v=1</code> (twice) then <code>?v=2</code>.</li>
<li>R3: compare <code>grep -i cache-control</code> at <code>:8081</code> (origin) vs <code>:8082</code> (broken edge).</li>
<li>R4: <code>:8080/cham/api/slow</code> for 504; <code>head -c 2000000 /dev/zero | curl --data-binary @- :8080/img/</code> for 413.</li>
</ul>
</details>

<h3>Solution (real output)</h3>
<p><strong>R1</strong> — the first request is a MISS (fetched from origin), the rest are HITs; across a TTL the status flips to EXPIRED. Only the MISS and the EXPIRED revalidation touched the origin:</p>
${run('c81-hitmiss', 'curl', 3)}
${run('c81-expire', 'curl', 4)}
<p><strong>R2</strong> — the cache key includes the query, so <code>?v=1</code> and <code>?v=2</code> are different entries (both MISS first time). A cache-busting or tracking query fragments the cache and kills the hit rate; the fix is hashed immutable filenames, not a hand-edited <code>?v=</code>:</p>
${run('c82-key', 'curl', 3)}
<p><strong>R3</strong> — the origin sends a correct <code>max-age=3600</code>; the broken edge returns <code>no-store</code> for the identical file. The cause is <code>proxy_hide_header Cache-Control;</code> + <code>add_header Cache-Control "no-store";</code> — the last layer to touch the header wins:</p>
${run('c83-nuot', 'curl', 2)}
<p><strong>R4</strong> — the slow origin (3 s) exceeds the edge's 1 s read timeout and returns <code>504</code> (Cloudflare does this at ~100 s as <code>524</code>); a 2 MB body over a 1 MB cap returns <code>413</code>:</p>
${run('c84-limit', 'curl', 1)}
${run('c84-limit', 'head', 1)}
<p><strong>The redesigns:</strong> the report endpoint should return <code>202 Accepted</code> + a status URL and run in a background worker, with the client polling for the result — never held open past the edge timeout. The upload endpoint should hand the browser a <strong>presigned URL</strong> so the file goes straight to R2, and only small JSON touches the origin. Raising the timeout and <code>client_max_body_size</code> only moves the wall.</p>

<h3>Going further</h3>
<ul>
<li>Add a <code>stale-while-revalidate</code> to a semi-dynamic route and watch it serve instantly after expiry while refreshing.</li>
<li>Give the broken edge a corrected <code>location</code> (no <code>proxy_hide_header</code>) and confirm the origin's <code>max-age</code> now survives with <code>curl -I</code>.</li>
<li><strong>Course project:</strong> the cache/CDN layer returns in the Chapter 13 request-path capstone — keep your per-hop <code>curl -I</code> checklist and your 202+poll / presigned-URL patterns.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Lab 8 · Dự án xuyên khoá phần 8</span>
<h2>Lab 8 — Kiểm toán tầng CDN của LabFlow</h2>
<p class="lead">LabFlow đặt một CDN trước app, và cuộc kiểm toán thấy một mớ triệu chứng: vài trang nhanh, một logo đã "sửa" vẫn cũ sau một deploy, hoá đơn CDN lớn với tỷ lệ trúng thấp, và các điểm cuối báo cáo cùng upload hỏng. Cuộc kiểm toán không muốn ý kiến — nó muốn bằng chứng đọc từ header về cái cache làm ở mỗi yêu cầu, và nguyên nhân gốc của mỗi lời than. Lab này dựng một CDN thu nhỏ (một biên, một origin, một biên cố tình hỏng, và các điểm cuối tái hiện tường timeout cùng kích thước thân) và truy mỗi triệu chứng tới nguyên nhân. Mọi thứ đều có trong Chương 8.</p>

<h3>Bạn được gì</h3>
<ul>
<li>Một <strong>biên</strong> (<code>10.10.2.10:8080</code>) cache từ một <strong>origin</strong> (<code>:8081</code>), cộng một <strong>biên hỏng</strong> (<code>:8082</code>) ghi đè header cache.</li>
<li>Một <strong>đường chậm</strong> (<code>:8080/cham/</code>, timeout đọc 1 giây) và một <strong>trần thân 1 MB</strong> để tái hiện 504 và 413.</li>
<li>Bộ công cụ: <code>curl -I</code> / <code>curl -sD -</code>, và <code>bash lab/code/dung-output-ch8.sh</code> để dựng tất cả.</li>
</ul>

<h3>Yêu cầu</h3>
<ol>
<li><strong>R1 Trúng/trượt/hết hạn.</strong> Cho thấy <code>MISS → HIT → HIT</code> trên một tệp và <code>MISS → HIT → EXPIRED</code> qua một TTL. Nói yêu cầu nào chạm origin.</li>
<li><strong>R2 Khoá cache.</strong> Cho thấy <code>?v=1</code> và <code>?v=2</code> là hai mục cache riêng, và giải thích tỷ lệ trúng thấp. Cho cách sửa.</li>
<li><strong>R3 Header bị nuốt.</strong> Cho thấy <code>max-age=3600</code> của origin và <code>no-store</code> của biên hỏng cho cùng tệp; kể hai chỉ thị nginx.</li>
<li><strong>R4 Giới hạn biên.</strong> Tạo một <code>504</code> (origin chậm) và một <code>413</code> (thân quá lớn); cho cách thiết kế lại đúng cho mỗi cái.</li>
</ol>

<h3>Mẫu báo cáo</h3>
${code(PHIEU, 'markdown')}

<h3>Thang điểm — 10 điểm</h3>
<table>
<tr><th>Mục</th><th>Điểm</th><th>Trọn điểm khi</th></tr>
<tr><td>R1</td><td>2.5</td><td>MISS→HIT→HIT và MISS→HIT→EXPIRED, với origin-chạm giải thích</td></tr>
<tr><td>R2</td><td>2.5</td><td><code>?v=1</code> so với <code>?v=2</code> hiện là hai khoá riêng; cách sửa tên-tệp-mã-băm</td></tr>
<tr><td>R3</td><td>2.5</td><td><code>Cache-Control</code> origin so với biên hỏng; kể cả hai chỉ thị</td></tr>
<tr><td>R4</td><td>2.5</td><td>504 và 413 tái hiện; cách thiết kế lại 202+hỏi-lại và presigned-URL</td></tr>
</table>

<h3>Gợi ý theo bậc</h3>
<details><summary>Gợi ý</summary>
<ul>
<li>R1: <code>curl -sD - -o /dev/null http://10.10.2.10:8080/img/logo.txt | grep -i x-cache</code> (×3); rồi <code>:8080/</code> với một chờ 31 giây cho <code>EXPIRED</code>.</li>
<li>R2: cùng tệp với <code>?v=1</code> (hai lần) rồi <code>?v=2</code>.</li>
<li>R3: so <code>grep -i cache-control</code> ở <code>:8081</code> (origin) so với <code>:8082</code> (biên hỏng).</li>
<li>R4: <code>:8080/cham/api/slow</code> cho 504; <code>head -c 2000000 /dev/zero | curl --data-binary @- :8080/img/</code> cho 413.</li>
</ul>
</details>

<h3>Lời giải (output thật)</h3>
<p><strong>R1</strong> — yêu cầu đầu là một MISS (lấy từ origin), còn lại là HIT; qua một TTL trạng thái lật sang EXPIRED. Chỉ MISS và lần kiểm lại EXPIRED chạm origin:</p>
${run('c81-hitmiss', 'curl', 3)}
${run('c81-expire', 'curl', 4)}
<p><strong>R2</strong> — khoá cache gồm cả query, nên <code>?v=1</code> và <code>?v=2</code> là hai mục khác nhau (cả hai MISS lần đầu). Một query phá-cache hay theo dõi phân mảnh cache và giết tỷ lệ trúng; cách sửa là tên tệp bất biến có mã băm, không phải một <code>?v=</code> sửa tay:</p>
${run('c82-key', 'curl', 3)}
<p><strong>R3</strong> — origin gửi một <code>max-age=3600</code> đúng; biên hỏng trả <code>no-store</code> cho đúng tệp đó. Nguyên nhân là <code>proxy_hide_header Cache-Control;</code> + <code>add_header Cache-Control "no-store";</code> — tầng cuối chạm vào header thắng:</p>
${run('c83-nuot', 'curl', 2)}
<p><strong>R4</strong> — origin chậm (3 giây) vượt timeout đọc 1 giây của biên và trả <code>504</code> (Cloudflare làm vậy ở ~100 giây là <code>524</code>); một thân 2 MB qua trần 1 MB trả <code>413</code>:</p>
${run('c84-limit', 'curl', 1)}
${run('c84-limit', 'head', 1)}
<p><strong>Các cách thiết kế lại:</strong> điểm cuối báo cáo nên trả <code>202 Accepted</code> + một URL trạng thái và chạy trong một worker nền, với client hỏi lại kết quả — không bao giờ giữ mở quá timeout của biên. Điểm cuối upload nên trao trình duyệt một <strong>presigned URL</strong> để tệp đi thẳng tới R2, và chỉ JSON nhỏ chạm origin. Nâng timeout và <code>client_max_body_size</code> chỉ dời tường.</p>

<h3>Đi xa hơn</h3>
<ul>
<li>Thêm một <code>stale-while-revalidate</code> cho một tuyến nửa-động và nhìn nó phục vụ tức thì sau khi hết hạn trong khi làm tươi.</li>
<li>Cho biên hỏng một <code>location</code> đã sửa (không <code>proxy_hide_header</code>) và xác nhận <code>max-age</code> của origin nay sống sót bằng <code>curl -I</code>.</li>
<li><strong>Dự án xuyên khoá:</strong> tầng cache/CDN quay lại trong dự án đường-request Chương 13 — giữ bảng kiểm <code>curl -I</code> từng chặng và các khuôn mẫu 202+hỏi-lại / presigned-URL của bạn.</li>
</ul>
</div>
`,
};
