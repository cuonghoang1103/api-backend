/**
 * Chương 13 · 13.3 — Tối ưu: keep-alive, cache, nén, CDN (slug khung netdev-13-3-toi-uu). Capstone — đo TRƯỚC/SAU.
 * Output thật: lab/out/c133-*.out.txt (dựng lại: bash lab/code/dung-output-ch13.sh).
 */
import { run, card, kv } from '../_ui.mjs';
import G from '../giang/nfd-13-3.mjs';

const L = card;

export default {
  title: '13.3 — Optimise: keep-alive, cache, compression, CDN|||13.3 — Tối ưu: keep-alive, cache, nén, CDN',
  slug: 'netdev-13-3-toi-uu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Làm stack nhanh hơn và CHỨNG MINH: đổi MỘT núm một lúc, đo trước/sau theo mốc nền. Đo thật: nén gzip ở biên 67.092 B → 1.809 B (37×, co khoảng trống tải); cache biên một câu trả lời chậm 3s: MISS 3,0s → HIT ~0,3 ms (sụp ttfb, gỡ tải origin). keep-alive bỏ bắt tay thượng nguồn; HTTP/2 + CDN cho trang nhiều tài nguyên/người dùng xa. Khớp núm với khoảng trống trội. Lắp BẢNG TRƯỚC/SAU — hiện vật chủ đạo của capstone.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3 · Capstone</span>
<h2>Optimise: keep-alive, cache, compression, CDN</h2>
<p class="lead">This is the lesson where the whole course pays off in numbers. You have a baseline; now you turn the knobs that move it — compression, edge caching, keep-alive, HTTP/2 and a CDN — one at a time, each as a measured before/after. Two of them you'll see live on the stack, and they are not subtle: compression makes a response <strong>37× smaller</strong>, and an edge cache turns a <strong>3-second</strong> call into a fraction of a millisecond. The table you build here is the headline artefact of your capstone.</p>

<h3>The rule: change one knob, measure the delta</h3>
<p>The entire value of this exercise lives in the discipline from the last lesson: <strong>change exactly one thing, re-measure against the baseline, record the before→after number.</strong> Flip three knobs at once and a faster page proves nothing — you can't attribute the gain, or notice if one change made things worse.</p>

<h3>Compression — the download gap</h3>
<p>Turn on gzip at the edge and request the same file without and with client compression:</p>
${run('c133-toiuu', 'echo "== compression', 3)}
<p>The identical response drops from <strong>67,092 bytes to 1,809</strong> — a <strong>37×</strong> smaller download. The client advertises <code>Accept-Encoding</code>, the edge compresses, and the <code>total − ttfb</code> (download) gap shrinks directly. Text (HTML/CSS/JS/JSON) compresses brilliantly; <strong>never</strong> compress already-compressed bytes (images, video) — pure wasted CPU.</p>

<h3>Edge caching — the ttfb gap</h3>
<p>Now cache a <em>slow</em> (3-second) origin response at the edge and request it twice:</p>
${run('c133-toiuu', 'echo "== edge cache', 3)}
<p>The first request is a <code>MISS</code> and pays the full <strong>3.0 s</strong> origin cost; the second is a <code>HIT</code> served from the edge in <strong>~0.3 ms</strong>, never touching the origin. That ~0.3 ms is measured right next to the edge; re-measured on 13/11/2026 across a link with ~20 ms of delay, the same HIT took 0.041 s — the cache removes the origin&#39;s 3 s, not the network round trip. For a cacheable response this collapses the <code>ttfb</code> gap to almost nothing and offloads the origin. The effect is dramatic <em>because</em> the origin was slow — caching a fast response saves little, but caching a slow one is transformative.</p>

<h3>Keep-alive, HTTP/2 and a CDN</h3>
${kv([
  ['keep-alive (edge→API)', 'Reuse upstream connections — skip a TCP handshake per backend request (smaller ttfb).'],
  ['HTTP/2 (client→edge)', 'One connection, many streams — removes the 6-connection limit (many-asset pages).'],
  ['CDN', 'A nearby edge terminates TLS and caches — shrinks dns + connect + ttfb by proximity.'],
])}
<p>The lab edge already keeps a connection pool to the API (<code>keepalive 16</code> + <code>proxy_http_version 1.1</code> + <code>proxy_set_header Connection ""</code>), so repeated requests skip the upstream handshake. In production, a CDN does the same for the client's leg, nearer the user — which is why a CDN helps even uncacheable requests (closer TLS/TCP termination).</p>

<div class="pitfall co-tieu-de">
<p><strong>Match the knob to the gap your baseline shows — and change one at a time, or your table is fiction.</strong> It is tempting to "enable all the optimisations" and move on, but each knob targets a <em>specific</em> gap: compression shrinks the <strong>download</strong> (<code>total − ttfb</code>), caching collapses an expensive <strong>ttfb</strong> on cacheable responses, keep-alive removes <strong>upstream handshakes</strong>, and a CDN/HTTP/2 help <strong>distance</strong> and <strong>many-asset</strong> pages. Turning on compression when your problem is a slow database wastes effort and proves nothing; caching an endpoint that must be fresh serves stale data. Worse, flipping several knobs together makes your before/after meaningless — if the page got faster, which change did it, and did one regress? The capstone (and real performance work) is graded on a table where <strong>each row is one change with one measured number</strong>. Measure which gap dominates, pick the knob for it, change only that, re-measure, write the delta. That table is what distinguishes tuning from fiddling — and it is defensible in an interview because every number is one you produced, one change at a time.</p>
</div>

<h3>🧪 Practice — build the before/after table (25 minutes)</h3>
<div class="callout ok">
<p><strong>Deliverable:</strong> your capstone's before/after table.</p>
<ol>
<li>From your baseline, enable <strong>compression</strong> only; measure the response size before/after. Record the ratio.</li>
<li>Reset; enable the <strong>edge cache</strong> on a slow response; measure the MISS and HIT times. Record both.</li>
<li>Describe how you'd verify <strong>keep-alive</strong> to the backend (fewer upstream handshakes) and what it targets.</li>
<li>Assemble a table: one row per change, each with a before and an after number.</li>
</ol>
<p><strong>Done when:</strong> your table has at least two rows with real numbers (compression ~37×; cache 3.0 s → ~0.3 ms), each from one isolated change, and you can say which gap in the baseline each row improved.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Compression (gzip/br)', 'Shrink text responses 3–40× — targets the download gap.'],
  ['Edge cache (MISS/HIT)', 'Serve a cached response from the edge — collapses ttfb for cacheable routes.'],
  ['keep-alive (upstream)', 'Reuse edge→API connections — removes per-request handshakes.'],
  ['HTTP/2', 'One connection, many streams — helps many-asset pages.'],
  ['CDN', 'A nearby edge for TLS/cache — shrinks distance for all requests.'],
  ['One change at a time', 'The rule that makes a before/after number trustworthy.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Change <strong>one knob at a time</strong> and re-measure against the baseline — the delta is the result.</li>
<li><strong>Compression</strong>: 67 KB → 1.8 KB (37×) on text — shrinks the download gap.</li>
<li><strong>Edge cache</strong>: a 3 s origin call → ~0.3 ms hit — collapses ttfb for cacheable responses.</li>
<li><strong>keep-alive</strong> skips upstream handshakes; <strong>HTTP/2</strong> and a <strong>CDN</strong> help many-asset and far-user cases.</li>
<li>Assemble the <strong>before/after table</strong> — one change, one number, each defensible.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Encoding', '📘', 'MDN — Content-Encoding (gzip/br/zstd)', 'How edge compression works and when to use each codec.', 'Open')}
${L('https://www.nginx.com/blog/tuning-nginx/', '📘', 'nginx — Tuning for performance', 'keep-alive, gzip, caching and buffer settings at the edge.', 'Open')}
${L('https://web.dev/articles/http-cache', '📘', 'web.dev — The HTTP cache', 'Cacheability, TTL and the hits that collapse TTFB.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3 · Capstone</span>
<h2>Tối ưu: keep-alive, cache, nén, CDN</h2>
<p class="lead">Đây là bài cả khoá sinh lời bằng con số. Bạn có một mốc nền; giờ bạn vặn các núm dời nó — nén, cache biên, keep-alive, HTTP/2 và một CDN — mỗi cái một lúc, mỗi cái như một trước/sau đo được. Hai cái bạn thấy trực tiếp trên stack, và chúng không tinh tế: nén làm một câu trả lời <strong>nhỏ hơn 37×</strong>, và một cache biên biến một lời gọi <strong>3 giây</strong> thành một phần nhỏ của một mili-giây. Bảng bạn dựng ở đây là hiện vật chủ đạo của capstone.</p>

<h3>Quy tắc: đổi một núm, đo độ chênh</h3>
<p>Toàn bộ giá trị bài tập này sống trong kỷ luật từ bài trước: <strong>đổi đúng một thứ, đo lại theo mốc nền, ghi con số trước→sau.</strong> Lật ba núm cùng lúc và một trang nhanh hơn chẳng chứng minh gì — bạn không gán được cái lợi, hay nhận ra một thay đổi làm tệ hơn.</p>

<h3>Nén — khoảng trống tải</h3>
<p>Bật gzip ở biên và hỏi cùng tệp không và có nén client:</p>
${run('c133-toiuu', 'echo "== compression', 3)}
<p>Câu trả lời y hệt rớt từ <strong>67.092 byte xuống 1.809</strong> — một tải nhỏ hơn <strong>37×</strong>. Client khai <code>Accept-Encoding</code>, biên nén, và khoảng trống <code>total − ttfb</code> (tải) co trực tiếp. Văn bản (HTML/CSS/JS/JSON) nén tuyệt; <strong>đừng bao giờ</strong> nén các byte đã nén (ảnh, video) — thuần phí CPU.</p>

<h3>Cache biên — khoảng trống ttfb</h3>
<p>Giờ cache một câu trả lời origin <em>chậm</em> (3 giây) ở biên và hỏi nó hai lần:</p>
${run('c133-toiuu', 'echo "== edge cache', 3)}
<p>Yêu cầu đầu là một <code>MISS</code> và trả trọn chi phí origin <strong>3,0 giây</strong>; cái thứ hai là một <code>HIT</code> phục vụ từ biên trong <strong>~0,3 ms</strong>, không bao giờ chạm origin. Con số ~0,3 ms đó đo sát cạnh biên; đo lại ngày 13/11/2026 qua một đường có độ trễ ~20 ms, cùng cú HIT mất 0,041 giây — cache gỡ đi 3 giây của origin, không gỡ được vòng đi-về của mạng. Cho một câu trả lời cache-được điều này làm sụp khoảng trống <code>ttfb</code> xuống gần không và gỡ tải origin. Hiệu ứng lớn <em>vì</em> origin chậm — cache một câu trả lời nhanh tiết kiệm ít, nhưng cache một cái chậm thì biến đổi.</p>

<h3>Keep-alive, HTTP/2 và một CDN</h3>
${kv([
  ['keep-alive (biên→API)', 'Dùng lại kết nối thượng nguồn — bỏ một cú bắt tay TCP mỗi yêu cầu backend (ttfb nhỏ hơn).'],
  ['HTTP/2 (client→biên)', 'Một kết nối, nhiều stream — bỏ giới hạn 6 kết nối (trang nhiều tài nguyên).'],
  ['CDN', 'Một biên gần kết thúc TLS và cache — co dns + connect + ttfb theo khoảng cách.'],
])}
<p>Biên lab đã giữ một pool kết nối tới API (<code>keepalive 16</code> + <code>proxy_http_version 1.1</code> + <code>proxy_set_header Connection ""</code>), nên yêu cầu lặp lại bỏ cú bắt tay thượng nguồn. Trên production, một CDN làm y vậy cho chặng client, gần người dùng hơn — lý do một CDN giúp cả yêu cầu không-cache-được (kết thúc TLS/TCP gần hơn).</p>

<div class="pitfall co-tieu-de">
<p><strong>Khớp núm với khoảng trống mốc nền của bạn cho thấy — và đổi một cái một lúc, không thì bảng của bạn là hư cấu.</strong> Thật cám dỗ "bật mọi tối ưu" và đi tiếp, nhưng mỗi núm nhắm một khoảng trống <em>cụ thể</em>: nén co <strong>tải</strong> (<code>total − ttfb</code>), cache làm sụp một <strong>ttfb</strong> đắt trên câu trả lời cache-được, keep-alive bỏ <strong>bắt tay thượng nguồn</strong>, và một CDN/HTTP/2 giúp <strong>khoảng cách</strong> và trang <strong>nhiều-tài-nguyên</strong>. Bật nén khi vấn đề của bạn là một cơ sở dữ liệu chậm phí công và chẳng chứng minh gì; cache một điểm cuối phải tươi phục vụ dữ liệu cũ. Tệ hơn, lật vài núm cùng nhau làm trước/sau của bạn vô nghĩa — nếu trang nhanh hơn, thay đổi nào làm, và một cái có thụt lùi? Capstone (và việc hiệu năng thật) được chấm theo một bảng nơi <strong>mỗi dòng là một thay đổi với một con số đo được</strong>. Đo khoảng trống nào trội, chọn núm cho nó, đổi chỉ cái đó, đo lại, viết độ chênh. Bảng đó là cái tách tinh chỉnh khỏi nghịch — và nó bảo vệ được trong một phỏng vấn vì mọi con số là một cái bạn tạo ra, một thay đổi một lúc.</p>
</div>

<h3>🧪 Thực hành — dựng bảng trước/sau (25 phút)</h3>
<div class="callout ok">
<p><strong>Deliverable:</strong> bảng trước/sau của capstone bạn.</p>
<ol>
<li>Từ mốc nền của bạn, bật <strong>nén</strong> thôi; đo kích thước câu trả lời trước/sau. Ghi tỷ lệ.</li>
<li>Reset; bật <strong>cache biên</strong> trên một câu trả lời chậm; đo thời gian MISS và HIT. Ghi cả hai.</li>
<li>Mô tả cách bạn sẽ xác minh <strong>keep-alive</strong> tới backend (ít bắt tay thượng nguồn) và nó nhắm gì.</li>
<li>Lắp một bảng: một dòng mỗi thay đổi, mỗi cái với một con số trước và một sau.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng của bạn có ít nhất hai dòng với con số thật (nén ~37×; cache 3,0 s → ~0,3 ms), mỗi cái từ một thay đổi cô lập, và bạn nói được khoảng trống nào trong mốc nền mỗi dòng cải thiện.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Nén (gzip/br)', 'Co câu trả lời văn bản 3–40× — nhắm khoảng trống tải.'],
  ['Cache biên (MISS/HIT)', 'Phục vụ một câu trả lời cache từ biên — sụp ttfb cho tuyến cache-được.'],
  ['keep-alive (thượng nguồn)', 'Dùng lại kết nối biên→API — bỏ bắt tay mỗi yêu cầu.'],
  ['HTTP/2', 'Một kết nối, nhiều stream — giúp trang nhiều tài nguyên.'],
  ['CDN', 'Một biên gần cho TLS/cache — co khoảng cách cho mọi yêu cầu.'],
  ['Một thay đổi một lúc', 'Quy tắc làm một con số trước/sau đáng tin.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đổi <strong>một núm một lúc</strong> và đo lại theo mốc nền — độ chênh là kết quả.</li>
<li><strong>Nén</strong>: 67 KB → 1,8 KB (37×) trên văn bản — co khoảng trống tải.</li>
<li><strong>Cache biên</strong>: một lời gọi origin 3 s → trúng ~0,3 ms — sụp ttfb cho câu trả lời cache-được.</li>
<li><strong>keep-alive</strong> bỏ bắt tay thượng nguồn; <strong>HTTP/2</strong> và một <strong>CDN</strong> giúp trường hợp nhiều-tài-nguyên và người-dùng-xa.</li>
<li>Lắp <strong>bảng trước/sau</strong> — một thay đổi, một con số, mỗi cái bảo vệ được.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Encoding', '📘', 'MDN — Content-Encoding (gzip/br/zstd)', 'Nén ở biên hoạt động thế nào và khi nào dùng codec nào.', 'Mở')}
${L('https://www.nginx.com/blog/tuning-nginx/', '📘', 'nginx — Tinh chỉnh cho hiệu năng', 'keep-alive, gzip, cache và thiết lập đệm ở biên.', 'Mở')}
${L('https://web.dev/articles/http-cache', '📘', 'web.dev — Cache HTTP', 'Khả năng cache, TTL và các trúng làm sụp TTFB.', 'Mở')}
</div>
`,
};
