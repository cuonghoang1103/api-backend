/**
 * Chương 12 · 12.2 — Vòng tình huống: chẩn đoán từ một triệu chứng (slug khung netdev-12-2-tinh-huong).
 * Output TÁI DÙNG: lab/out/c114-checklist (bảng kiểm theo tầng, Ch11) làm bằng chứng phương pháp.
 */
import { run, card, kv } from '../_ui.mjs';
import G from '../giang/nfd-12-2.mjs';

const L = card;

export default {
  title: '12.2 — Scenario rounds: diagnose from a symptom|||12.2 — Vòng tình huống: chẩn đoán từ một triệu chứng',
  slug: 'netdev-12-2-tinh-huong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Phỏng vấn cấp cao cho một TRIỆU CHỨNG và nhìn bạn chẩn đoán. Khuôn: triệu chứng → giả thuyết (xếp theo tầng) → PHÉP ĐO xác nhận mỗi cái → kết luận. Ba tình huống kinh điển: "chậm chỉ một vùng" (định vị bằng curl -w/ping/mtr, đường vs origin), "API timeout mỗi tối" (tương quan tải, đọc mã 504/503/502), "chỉ Android cũ lỗi chứng chỉ" (tin cậy/chuỗi — trung gian thiếu, đọc bằng openssl s_client). Kể PHƯƠNG PHÁP, đừng đoán.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Scenario rounds: diagnose from a symptom</h2>
<p class="lead">The higher the role, the less an interview asks you to <em>define</em> and the more it asks you to <em>diagnose</em>. You get a symptom — "the page is slow from Hanoi," "the API times out every evening," "only old phones get certificate errors" — and the interviewer watches <strong>how you think</strong>. The good news: there is a method, it is the same layered checklist you have used all course, and narrating it well matters more than instantly knowing the answer. This lesson gives you the frame and three classic scenarios.</p>

<h3>The frame: symptom → hypothesis → measurement → conclusion</h3>
<ol>
<li><strong>Restate the symptom</strong> precisely — who, where, when, how often. Precision alone eliminates half the hypotheses.</li>
<li><strong>List hypotheses</strong> across the layers, ordered by likelihood — show you think in layers, not hunches.</li>
<li><strong>Name the measurement</strong> that would confirm or kill each — the one command, not a vague "I'd check logs."</li>
<li><strong>Conclude</strong>: the layer, the fix, and how you'd prevent a recurrence.</li>
</ol>
<p>The interviewer is grading <strong>method</strong>. "I'd run <code>curl -w</code> from both regions and compare" beats "probably the CDN" every single time.</p>

<h3>Scenario 1 — "slow only in one region"</h3>
${kv([
  ['Far from the origin (latency)', 'curl -w / ping from that region vs others — is time_connect the big stage there?'],
  ['CDN missing/misconfigured there', 'curl -I → cf-cache-status; which PoP answered?'],
  ['A bad hop / peering on that path', 'mtr from the slow region — loss/latency at a specific hop'],
])}
<p><strong>Conclusion pattern:</strong> if <code>curl -w</code> shows a large <code>time_connect</code> only from that region, it's distance/path; if <strong>TTFB</strong> is high <em>everywhere</em>, it's the origin and the region is a red herring. You localise before you blame.</p>

<h3>Scenario 2 — "the API times out every evening"</h3>
${kv([
  ['Load spike exhausts the pool', 'connection/pool metrics at peak; ss -s — are sockets maxed?'],
  ['A slow query under load', 'DB slow log; does TTFB (curl -w) climb with concurrency?'],
  ['LB read timeout → 504', 'the status code: 504 = too slow (not down), 503 = no capacity'],
])}
<p>"Every evening" screams <strong>correlation with load</strong>. The sharp move is to read the <strong>status code</strong> first — <code>504</code> (backend too slow) vs <code>503</code> (no healthy capacity) vs <code>502</code> (backend broken) each point at a different fix — then measure TTFB against concurrency. The time of day is a clue, not a cause.</p>

<h3>Scenario 3 — "only old Android gets cert errors"</h3>
<p>A <em>subset</em> of clients failing TLS is almost never "the certificate is down" — it's <strong>trust</strong>. Read the chain the server actually sends:</p>
${run('c114-checklist', 'openssl', 1)}
<p>Two classic causes: a <strong>missing intermediate certificate</strong> (modern clients fetch it via AIA; old ones don't, so the chain doesn't build), or an <strong>expired root</strong> in the old device's trust store. The measurement is <code>openssl s_client</code> to inspect the chain and dates, plus a test against an old client profile (or SSL Labs). "Some clients, not all" = a chain/trust problem — diagnose it there, not at the app.</p>

<div class="pitfall co-tieu-de">
<p><strong>The failure mode interviewers punish is jumping to a cause before localising — "it's probably X."</strong> Every scenario here has an obvious-but-wrong first guess ("the region is slow → blame the CDN"; "evening timeouts → the DB is slow"; "cert errors → the cert expired"). The candidate who guesses is right sometimes and looks lucky; the candidate who <em>localises first</em> — "let me compare <code>curl -w</code> across regions / read the status code / inspect the chain with <code>openssl</code>" — is right reliably and looks like an engineer. The symptom tells you <em>where to measure</em>, not what the answer is. Reduce every scenario to the layered checklist (<strong>DNS → routing → port → TLS → HTTP → app</strong>), name the one measurement per hypothesis, and narrate it — the method is what gets graded, and the method is what you have.</p>
</div>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> rehearse the three scenarios out loud, forcing a measurement for each hypothesis.</p>
<ol>
<li>"Slow from one region": give three hypotheses and the command that confirms each; state the conclusion rule (time_connect vs TTFB).</li>
<li>"Evening timeouts": say what the status code tells you (504 vs 503 vs 502) and how you'd correlate with load.</li>
<li>"Old clients, cert errors": name the likely cause and the <code>openssl s_client</code> check.</li>
<li>For all three, map the symptom to a layer in the DNS→...→app checklist.</li>
</ol>
<p><strong>Done when:</strong> each answer lists ordered hypotheses, a confirming measurement per hypothesis, a conclusion rule, and the layer — and you never jump to a cause before a measurement.</p>
<details><summary>Solution</summary>
<p>Region: latency (curl -w/ping), CDN miss (curl -I/cf-cache-status), bad hop (mtr) — big time_connect only there = path; high TTFB everywhere = origin. Evening: pool exhaustion (ss -s), slow query (DB log + TTFB vs load), 504 read timeout — read the code (504 slow / 503 no capacity / 502 broken). Old clients: missing intermediate or expired root — <code>openssl s_client</code> on the chain + an old-client test. Layers: region → routing/HTTP(CDN); evening → HTTP/app under load; certs → TLS.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Scenario round', 'An interview format: a symptom, and you diagnose out loud.'],
  ['Localise', 'Narrow to a layer/region/hop before proposing a cause.'],
  ['TTFB vs connect', 'High TTFB → server; high connect → network/distance.'],
  ['Status code triage', '504 slow · 503 no capacity · 502 broken — different fixes.'],
  ['Certificate chain', 'Leaf + intermediate(s) + root; a missing intermediate breaks old clients.'],
  ['openssl s_client', 'Inspect the chain and dates a server actually presents.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Scenario rounds test your <strong>method</strong>: symptom → hypotheses → the measurement that confirms each → conclusion.</li>
<li>"Slow in one region" → localise with <code>curl -w</code>/<code>ping</code>/<code>mtr</code> (path vs origin).</li>
<li>"Evening timeouts" → correlate with load; read the <strong>status code</strong> (504 slow / 503 no capacity).</li>
<li>"Only old clients fail TLS" → a trust/chain issue (missing intermediate); read it with <code>openssl s_client</code>.</li>
<li><strong>Narrate</strong> the hypotheses and the confirming measurement — and never jump to a cause before measuring.</li>
</ul>
${L('https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/', '📘', 'Cloudflare — 5xx triage', '520–524 and which side each blames — status-code-first diagnosis.', 'Open')}
${L('https://www.ssllabs.com/ssltest/', '📘', 'SSL Labs — SSL Server Test', 'See the chain a server sends and which clients will trust it.', 'Open')}
${L('https://wizardzines.com/zines/networking/', '📘', 'Julia Evans — Networking!', 'The layered mental model behind every scenario here.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Vòng tình huống: chẩn đoán từ một triệu chứng</h2>
<p class="lead">Vai trò càng cao, phỏng vấn càng ít bảo bạn <em>định nghĩa</em> và càng bảo bạn <em>chẩn đoán</em>. Bạn nhận một triệu chứng — "trang chậm từ Hà Nội," "API timeout mỗi tối," "chỉ điện thoại cũ lỗi chứng chỉ" — và người phỏng vấn nhìn <strong>cách bạn nghĩ</strong>. Tin tốt: có một phương pháp, nó là cùng bảng kiểm theo tầng bạn đã dùng suốt khoá, và kể nó hay quan trọng hơn biết ngay câu trả lời. Bài này cho bạn khuôn và ba tình huống kinh điển.</p>

<h3>Khuôn: triệu chứng → giả thuyết → phép đo → kết luận</h3>
<ol>
<li><strong>Nêu lại triệu chứng</strong> chính xác — ai, ở đâu, khi nào, bao lâu một lần. Chính xác một mình loại nửa số giả thuyết.</li>
<li><strong>Liệt kê giả thuyết</strong> qua các tầng, xếp theo khả năng — cho thấy bạn nghĩ theo tầng, không phải linh cảm.</li>
<li><strong>Gọi tên phép đo</strong> xác nhận hay giết mỗi cái — một lệnh, không phải một "tôi sẽ kiểm log" mơ hồ.</li>
<li><strong>Kết luận</strong>: tầng, cách sửa, và cách ngừa tái diễn.</li>
</ol>
<p>Người phỏng vấn chấm <strong>phương pháp</strong>. "Tôi sẽ chạy <code>curl -w</code> từ cả hai vùng và so" thắng "chắc tại CDN" mọi lần.</p>

<h3>Tình huống 1 — "chậm chỉ một vùng"</h3>
${kv([
  ['Xa origin (độ trễ)', 'curl -w / ping từ vùng đó so với vùng khác — time_connect có là chặng lớn ở đó không?'],
  ['CDN thiếu/cấu hình sai ở đó', 'curl -I → cf-cache-status; PoP nào trả lời?'],
  ['Một hop / peering tồi trên đường', 'mtr từ vùng chậm — mất/trễ ở một hop cụ thể'],
])}
<p><strong>Khuôn kết luận:</strong> nếu <code>curl -w</code> cho thấy một <code>time_connect</code> lớn chỉ từ vùng đó, đó là khoảng cách/đường; nếu <strong>TTFB</strong> cao ở <em>mọi nơi</em>, đó là origin và vùng là đánh lạc hướng. Bạn định vị trước khi đổ lỗi.</p>

<h3>Tình huống 2 — "API timeout mỗi tối"</h3>
${kv([
  ['Đợt dồn tải làm cạn pool', 'chỉ số kết nối/pool lúc đỉnh; ss -s — socket có cạn không?'],
  ['Một truy vấn chậm dưới tải', 'log chậm DB; TTFB (curl -w) có leo theo đồng thời không?'],
  ['LB read timeout → 504', 'mã trạng thái: 504 = quá chậm (không down), 503 = không dung lượng'],
])}
<p>"Mỗi tối" hét lên <strong>tương quan với tải</strong>. Nước sắc là đọc <strong>mã trạng thái</strong> trước — <code>504</code> (backend quá chậm) so với <code>503</code> (không dung lượng khoẻ) so với <code>502</code> (backend hỏng) mỗi cái chỉ một cách sửa khác — rồi đo TTFB theo đồng thời. Thời điểm trong ngày là manh mối, không phải nguyên nhân.</p>

<h3>Tình huống 3 — "chỉ Android cũ lỗi chứng chỉ"</h3>
<p>Một <em>tập con</em> client hỏng TLS gần như không bao giờ là "chứng chỉ down" — mà là <strong>tin cậy</strong>. Đọc chuỗi máy chủ thật sự gửi:</p>
${run('c114-checklist', 'openssl', 1)}
<p>Hai nguyên nhân kinh điển: một <strong>chứng chỉ trung gian thiếu</strong> (client hiện đại lấy nó qua AIA; cũ không, nên chuỗi không dựng được), hay một <strong>root hết hạn</strong> trong kho tin cậy của thiết bị cũ. Phép đo là <code>openssl s_client</code> để soi chuỗi và ngày, cộng một thử với một hồ sơ client cũ (hay SSL Labs). "Một số client, không phải tất cả" = một vấn đề chuỗi/tin cậy — chẩn đoán ở đó, không phải ở app.</p>

<div class="pitfall co-tieu-de">
<p><strong>Kiểu thất bại người phỏng vấn phạt là nhảy tới một nguyên nhân trước khi định vị — "chắc tại X."</strong> Mọi tình huống ở đây có một đoán đầu hiển-nhiên-nhưng-sai ("vùng chậm → đổ lỗi CDN"; "timeout tối → DB chậm"; "lỗi cert → cert hết hạn"). Ứng viên đoán thì đúng đôi lúc và trông may; ứng viên <em>định vị trước</em> — "để tôi so <code>curl -w</code> giữa các vùng / đọc mã trạng thái / soi chuỗi bằng <code>openssl</code>" — thì đúng đáng tin và trông như một kỹ sư. Triệu chứng cho bạn biết <em>đo ở đâu</em>, không phải câu trả lời là gì. Quy mọi tình huống về bảng kiểm theo tầng (<strong>DNS → định tuyến → cổng → TLS → HTTP → app</strong>), gọi tên một phép đo mỗi giả thuyết, và kể nó — phương pháp là cái được chấm, và phương pháp là cái bạn có.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> diễn tập ba tình huống nói to, ép một phép đo cho mỗi giả thuyết.</p>
<ol>
<li>"Chậm từ một vùng": cho ba giả thuyết và lệnh xác nhận mỗi cái; nêu quy tắc kết luận (time_connect vs TTFB).</li>
<li>"Timeout buổi tối": nói mã trạng thái cho bạn biết gì (504 vs 503 vs 502) và cách tương quan với tải.</li>
<li>"Client cũ, lỗi cert": gọi tên nguyên nhân có khả năng và phép kiểm <code>openssl s_client</code>.</li>
<li>Cả ba, ánh xạ triệu chứng tới một tầng trong bảng kiểm DNS→...→app.</li>
</ol>
<p><strong>Đạt khi:</strong> mỗi câu trả lời liệt kê giả thuyết xếp thứ tự, một phép đo xác nhận mỗi giả thuyết, một quy tắc kết luận, và tầng — và bạn không bao giờ nhảy tới nguyên nhân trước một phép đo.</p>
<details><summary>Lời giải</summary>
<p>Vùng: độ trễ (curl -w/ping), CDN trượt (curl -I/cf-cache-status), hop tồi (mtr) — time_connect lớn chỉ ở đó = đường; TTFB cao mọi nơi = origin. Tối: cạn pool (ss -s), truy vấn chậm (log DB + TTFB theo tải), 504 read timeout — đọc mã (504 chậm / 503 không dung lượng / 502 hỏng). Client cũ: trung gian thiếu hay root hết hạn — <code>openssl s_client</code> trên chuỗi + một thử client cũ. Tầng: vùng → định tuyến/HTTP(CDN); tối → HTTP/app dưới tải; cert → TLS.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Vòng tình huống', 'Một dạng phỏng vấn: một triệu chứng, và bạn chẩn đoán nói to.'],
  ['Định vị', 'Thu hẹp tới một tầng/vùng/hop trước khi đề xuất một nguyên nhân.'],
  ['TTFB vs connect', 'TTFB cao → máy chủ; connect cao → mạng/khoảng cách.'],
  ['Phân loại mã', '504 chậm · 503 không dung lượng · 502 hỏng — cách sửa khác nhau.'],
  ['Chuỗi chứng chỉ', 'Lá + trung gian + root; một trung gian thiếu phá client cũ.'],
  ['openssl s_client', 'Soi chuỗi và ngày một máy chủ thật sự trình.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Vòng tình huống kiểm <strong>phương pháp</strong>: triệu chứng → giả thuyết → phép đo xác nhận mỗi cái → kết luận.</li>
<li>"Chậm một vùng" → định vị với <code>curl -w</code>/<code>ping</code>/<code>mtr</code> (đường vs origin).</li>
<li>"Timeout buổi tối" → tương quan với tải; đọc <strong>mã trạng thái</strong> (504 chậm / 503 không dung lượng).</li>
<li>"Chỉ client cũ hỏng TLS" → một vấn đề tin cậy/chuỗi (trung gian thiếu); đọc bằng <code>openssl s_client</code>.</li>
<li><strong>Kể</strong> các giả thuyết và phép đo xác nhận — và không bao giờ nhảy tới nguyên nhân trước khi đo.</li>
</ul>
${L('https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/', '📘', 'Cloudflare — phân loại 5xx', '520–524 và mỗi cái đổ lỗi phía nào — chẩn đoán mã-trước.', 'Mở')}
${L('https://www.ssllabs.com/ssltest/', '📘', 'SSL Labs — SSL Server Test', 'Thấy chuỗi một máy chủ gửi và client nào sẽ tin.', 'Mở')}
${L('https://wizardzines.com/zines/networking/', '📘', 'Julia Evans — Networking!', 'Mô hình tư duy theo tầng sau mọi tình huống ở đây.', 'Mở')}
</div>
`,
};
