/**
 * Chương 12 · 12.1 — Câu hỏi kinh điển và cách trả lời (slug khung netdev-12-1-cau-hoi). Bài MỞ CHƯƠNG 12 (có khối 🎯).
 * Output TÁI DÙNG (bằng chứng): lab/out/c113-path (curl -w), c41-tay (bắt tay), c45-ka (keep-alive) — đã có từ các chương trước.
 */
import { run, card, kv } from '../_ui.mjs';
import G from '../giang/nfd-12-1.mjs';

const L = card;

export default {
  title: '12.1 — Classic questions and how to answer them|||12.1 — Câu hỏi kinh điển và cách trả lời',
  slug: 'netdev-12-1-cau-hoi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Câu hỏi mạng kinh điển trong phỏng vấn + cách trả lời CÓ CHIỀU SÂU và kèm MỘT PHÉP ĐO (không phải định nghĩa suông): "gõ URL → thấy trang" đi qua gì (đo bằng curl -w), bắt tay TCP 3 bước (bắt gói thật), TCP vs UDP, HTTP/1.1 vs 2 vs 3 (mỗi bản SỬA gì), TLS 1.3, DNS, CDN/cache, cân bằng tải L4/L7. Biến mọi thứ đã đo trong khoá thành câu trả lời nổi bật.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>Classic questions and how to answer them</h2>
<p class="lead">Networking shows up in nearly every backend, DevOps, SRE and systems interview, and it is one of the few topics where <em>depth is cheap to demonstrate</em>: the questions are predictable, and you have spent this whole course measuring the exact things they ask about. This lesson collects the classics and shows the pattern that makes an answer stand out — name the layers correctly, then back one claim with a <strong>measurement</strong> instead of a definition. The difference between "I memorised a diagram" and "I have used this" is a single <code>curl -w</code> line.</p>

<div class="callout info">
<p><strong>🎯 Chapter 12 at a glance — what you will be able to do after it</strong></p>
<ul>
<li><strong>Answer the classic questions</strong> with depth: URL→page, the 3-way handshake, TCP vs UDP, HTTP/1.1/2/3, TLS, DNS, CDN, load balancing.</li>
<li><strong>Back a claim with a measurement</strong> — a <code>curl -w</code> breakdown, a captured handshake — not a recited definition.</li>
<li><strong>Handle scenario rounds</strong>: diagnose from a symptom with the layered method (next lesson).</li>
<li><strong>Judge certifications</strong> (Network+, CCNA) — when a developer needs one and when not.</li>
<li>Turn <strong>everything you measured</strong> in this course into interview answers that sound like experience, because they are.</li>
</ul>
<p><strong>Why this matters:</strong> most candidates recite the OSI model; almost none can say "and <code>time_starttransfer</code> is the server's TTFB — here's where the latency actually was." That is the answer that gets remembered.</p>
</div>

<h3>The mega-question: "type a URL and press Enter"</h3>
<p>Nearly every interview opens with some version of this. The strong answer walks the layers in order and flags what can be skipped:</p>
<ol>
<li><strong>DNS</strong> resolves the name (browser cache → OS → resolver → root/TLD/authoritative; often a warm cache hit).</li>
<li><strong>TCP</strong> 3-way handshake, then (for https) the <strong>TLS</strong> handshake.</li>
<li><strong>HTTP</strong> request → server, possibly via a <strong>CDN</strong> edge or <strong>load balancer</strong> → response.</li>
<li>The browser <strong>parses and renders</strong>, fetching sub-resources — each a mini-round of the above (reusing the connection via keep-alive, or hitting the CDN).</li>
</ol>
<p>Then add the thing that proves you have done it — you can measure each stage:</p>
${run('c113-path', 'curl -s -o /dev/null -w "dns', 1)}
<p><code>time_namelookup</code> is DNS, <code>time_connect</code> is the TCP handshake, <code>time_starttransfer</code> is the server's <strong>TTFB</strong>, <code>time_total</code> is the whole thing. Naming <code>curl -w</code> unprompted tells the interviewer you debug this for real.</p>

<h3>The 3-way handshake</h3>
<p>"Describe the TCP handshake." Don't just list SYN/SYN-ACK/ACK — explain <em>why</em>, and that you have seen it:</p>
${run('c41-tay', 'tcpdump', 1, { max: 5, cut: 92 })}
<p><strong>SYN</strong> (client's initial sequence number) → <strong>SYN-ACK</strong> (server's ISN + acknowledging the client's) → <strong>ACK</strong>. This establishes sequence numbers in <em>both</em> directions so each side can detect loss and reorder; only then does data flow. The point that impresses: it costs <strong>one round trip of latency before any request is sent</strong> — which is exactly why keep-alive and HTTP/2 exist. And you can show the connection being reused:</p>
${run('c45-ka', 'curl', 1)}
<p>The second request says it is <strong>reusing the existing connection</strong> — no second handshake. That is the whole point of keep-alive.</p>

<h3>TCP vs UDP, and the HTTP versions</h3>
${kv([
  ['TCP', 'Reliable, ordered, retransmits — after a handshake. The web, APIs, anything that must arrive.'],
  ['UDP', 'Best-effort, no setup — just send. DNS, video, games, and QUIC build reliability on top.'],
  ['HTTP/1.1', 'Text; one request at a time per connection; keep-alive but a ~6-connection limit.'],
  ['HTTP/2', 'Multiplexes many streams on one TCP connection — removes the 6-connection limit (still TCP HoL).'],
  ['HTTP/3', 'HTTP over QUIC (UDP) — removes TCP head-of-line blocking and shortens the handshake.'],
])}
<p>The trap with the HTTP versions is "newer = faster." The answer that lands names <strong>what each one fixed</strong>: HTTP/2's multiplexing removed the connection limit; HTTP/3's QUIC removed TCP head-of-line blocking (one lost packet no longer stalls every stream). You read those frames yourself in Chapter 7.</p>

<div class="pitfall co-tieu-de">
<p><strong>The biggest interview mistake is answering with a definition instead of a trade-off.</strong> "TCP is reliable, UDP is not" is a dictionary entry, not an answer. The version that gets you hired states the <em>trade-off and the consequence</em>: "TCP pays a handshake and can head-of-line-block; UDP skips both but hands you no guarantees, so QUIC rebuilds ordering per-stream on UDP to get HTTP/3's speed without TCP's HoL." Same for TLS ("a round trip for a session key and identity — 1.3 cut it to one, and resumption to zero") and DNS ("round trips you cache away by TTL, and Anycast moves the server closer"). Every strong answer in networking is really about <strong>round trips and what removes them</strong> — keep-alive, HTTP/2, TLS resumption, a warm cache, a nearby CDN. Frame your answers that way and you sound like someone who has tuned a real system, because this course had you do exactly that.</p>
</div>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> rehearse out loud, as if in an interview, and force yourself to add one measurement per answer.</p>
<ol>
<li>Answer "what happens when you type a URL" in 60 seconds, ending with the <code>curl -w</code> stages.</li>
<li>Describe the 3-way handshake and why it is one round trip of latency; mention how keep-alive avoids repeating it.</li>
<li>Contrast TCP and UDP as a <em>trade-off</em>, and say where QUIC fits.</li>
<li>Explain HTTP/1.1 → 2 → 3 by <em>what each fixed</em>, not "faster."</li>
</ol>
<p><strong>Done when:</strong> each answer names the layers in order, states a trade-off (not a definition), and includes at least one concrete measurement or mechanism you saw in this course (<code>curl -w</code>, a captured SYN/SYN-ACK/ACK, connection reuse, a frame).</p>
<details><summary>Solution</summary>
<p>URL→page: DNS → TCP → TLS → HTTP → render, skippable via cache/keep-alive/CDN; measured with <code>curl -w</code> (namelookup/connect/starttransfer/total). Handshake: SYN/SYN-ACK/ACK establishes sequence numbers both ways, one RTT before any request, avoided by keep-alive. TCP vs UDP: reliability+order vs speed+control; QUIC adds per-stream ordering on UDP for HTTP/3. HTTP versions: 1.1 keep-alive but 6-conn limit; 2 multiplexing removes it; 3 over QUIC removes TCP head-of-line blocking.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['3-way handshake', 'SYN / SYN-ACK / ACK — establishes sequence numbers both ways (one RTT).'],
  ['TTFB', 'Time to first byte — the server’s thinking time (time_starttransfer).'],
  ['Keep-alive', 'Reusing a TCP connection for more requests — skip the handshake.'],
  ['Multiplexing', 'HTTP/2: many streams on one connection (no 6-connection limit).'],
  ['Head-of-line blocking', 'One lost TCP packet stalls all HTTP/2 streams; QUIC fixes it.'],
  ['QUIC', 'HTTP/3’s transport over UDP with per-stream ordering + fast setup.'],
  ['Round trip', 'The latency unit; performance work removes or shortens round trips.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Know the <strong>URL → page</strong> journey in order, and which layers can be skipped (cache, keep-alive, CDN).</li>
<li>Answer with a <strong>measurement</strong>: <code>curl -w</code> stages, a captured handshake, connection reuse — not a memorised diagram.</li>
<li><strong>TCP vs UDP</strong> as a trade-off (reliability+order vs speed+control); QUIC builds reliability on UDP.</li>
<li><strong>HTTP/1.1 → 2 → 3</strong>: name what each <strong>fixed</strong> (multiplexing, then TCP head-of-line via QUIC).</li>
<li>TLS and DNS are <strong>round trips</strong>; every strong answer is about removing or shortening them.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/Performance/Guides/How_browsers_work', '📘', 'MDN — How browsers work', 'The URL→page pipeline, from navigation to render.', 'Open')}
${L('https://hpbn.co/', '📘', 'High Performance Browser Networking', 'The round-trip view of TCP, TLS, HTTP/2 and more (free online).', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Evolution_of_HTTP', '📘', 'MDN — Evolution of HTTP', 'What HTTP/1.1, /2 and /3 each changed, in order.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Câu hỏi kinh điển và cách trả lời</h2>
<p class="lead">Mạng xuất hiện trong gần như mọi phỏng vấn backend, DevOps, SRE và hệ thống, và nó là một trong ít chủ đề nơi <em>chiều sâu dễ thể hiện</em>: câu hỏi đoán được, và bạn đã dành cả khoá này đo đúng những thứ chúng hỏi. Bài này gom các câu kinh điển và cho thấy khuôn mẫu làm một câu trả lời nổi bật — gọi tên các tầng cho đúng, rồi chống một khẳng định bằng một <strong>phép đo</strong> thay vì một định nghĩa. Khác biệt giữa "tôi thuộc một sơ đồ" và "tôi đã dùng cái này" là một dòng <code>curl -w</code>.</p>

<div class="callout info">
<p><strong>🎯 Chương 12 trong một khung — học xong bạn làm được gì</strong></p>
<ul>
<li><strong>Trả lời các câu kinh điển</strong> với chiều sâu: URL→trang, bắt tay 3 bước, TCP vs UDP, HTTP/1.1/2/3, TLS, DNS, CDN, cân bằng tải.</li>
<li><strong>Chống một khẳng định bằng một phép đo</strong> — một phân tách <code>curl -w</code>, một cú bắt tay đã bắt — không phải một định nghĩa đọc thuộc.</li>
<li><strong>Xử lý vòng tình huống</strong>: chẩn đoán từ một triệu chứng với phương pháp theo tầng (bài sau).</li>
<li><strong>Đánh giá chứng chỉ</strong> (Network+, CCNA) — khi nào một lập trình viên cần và khi nào không.</li>
<li>Biến <strong>mọi thứ bạn đã đo</strong> trong khoá thành câu trả lời phỏng vấn nghe như kinh nghiệm, vì chúng là vậy.</li>
</ul>
<p><strong>Vì sao quan trọng:</strong> phần lớn ứng viên đọc thuộc mô hình OSI; gần như không ai nói được "và <code>time_starttransfer</code> là TTFB của máy chủ — độ trễ thật sự nằm ở đây." Đó là câu trả lời được nhớ.</p>
</div>

<h3>Câu hỏi lớn: "gõ một URL rồi Enter"</h3>
<p>Gần như mọi phỏng vấn mở đầu bằng một biến thể của câu này. Câu trả lời mạnh đi qua các tầng theo thứ tự và chỉ ra cái gì bỏ qua được:</p>
<ol>
<li><strong>DNS</strong> phân giải tên (cache trình duyệt → OS → resolver → root/TLD/authoritative; thường trúng cache ấm).</li>
<li><strong>TCP</strong> bắt tay 3 bước, rồi (cho https) cú <strong>TLS</strong>.</li>
<li><strong>HTTP</strong> yêu cầu → máy chủ, có thể qua một biên <strong>CDN</strong> hay <strong>cân bằng tải</strong> → câu trả lời.</li>
<li>Trình duyệt <strong>phân tích và render</strong>, lấy tài nguyên con — mỗi cái một vòng-nhỏ của những cái trên (dùng lại kết nối qua keep-alive, hay trúng CDN).</li>
</ol>
<p>Rồi thêm thứ chứng minh bạn đã làm nó — bạn đo được mỗi chặng:</p>
${run('c113-path', 'curl -s -o /dev/null -w "dns', 1)}
<p><code>time_namelookup</code> là DNS, <code>time_connect</code> là cú bắt tay TCP, <code>time_starttransfer</code> là <strong>TTFB</strong> của máy chủ, <code>time_total</code> là cả. Gọi <code>curl -w</code> không cần nhắc nói với người phỏng vấn rằng bạn gỡ cái này thật.</p>

<h3>Cú bắt tay 3 bước</h3>
<p>"Mô tả cú bắt tay TCP." Đừng chỉ liệt kê SYN/SYN-ACK/ACK — giải thích <em>vì sao</em>, và rằng bạn đã thấy nó:</p>
${run('c41-tay', 'tcpdump', 1, { max: 5, cut: 92 })}
<p><strong>SYN</strong> (số thứ tự khởi đầu của client) → <strong>SYN-ACK</strong> (ISN của máy chủ + xác nhận của client) → <strong>ACK</strong>. Điều này thiết lập số thứ tự ở <em>cả hai</em> chiều để mỗi bên phát hiện mất và sắp lại; chỉ khi đó dữ liệu mới chảy. Điểm gây ấn tượng: nó tốn <strong>một vòng khứ hồi độ trễ trước khi bất kỳ yêu cầu nào được gửi</strong> — đúng lý do keep-alive và HTTP/2 tồn tại. Và bạn cho thấy kết nối được dùng lại:</p>
${run('c45-ka', 'curl', 1)}
<p>Yêu cầu thứ hai nói nó đang <strong>dùng lại kết nối hiện có</strong> — không có cú bắt tay thứ hai. Đó là toàn bộ mục đích của keep-alive.</p>

<h3>TCP vs UDP, và các phiên bản HTTP</h3>
${kv([
  ['TCP', 'Tin cậy, có thứ tự, truyền lại — sau một cú bắt tay. Web, API, bất cứ gì phải đến.'],
  ['UDP', 'Nỗ-lực-tốt-nhất, không dựng — cứ gửi. DNS, video, game, và QUIC dựng tin cậy lên trên.'],
  ['HTTP/1.1', 'Văn bản; một yêu cầu một lúc mỗi kết nối; keep-alive nhưng giới hạn ~6 kết nối.'],
  ['HTTP/2', 'Ghép nhiều stream trên một kết nối TCP — bỏ giới hạn 6 kết nối (vẫn HoL tầng TCP).'],
  ['HTTP/3', 'HTTP trên QUIC (UDP) — bỏ nghẽn đầu hàng TCP và rút ngắn cú bắt tay.'],
])}
<p>Cái bẫy với các phiên bản HTTP là "mới hơn = nhanh hơn." Câu trả lời đáng gọi tên <strong>cái mỗi cái sửa</strong>: ghép kênh của HTTP/2 bỏ giới hạn kết nối; QUIC của HTTP/3 bỏ nghẽn đầu hàng TCP (một gói mất không còn kẹt mọi stream). Bạn đã tự đọc các frame đó ở Chương 7.</p>

<div class="pitfall co-tieu-de">
<p><strong>Lỗi phỏng vấn lớn nhất là trả lời bằng một định nghĩa thay vì một đánh đổi.</strong> "TCP tin cậy, UDP không" là một mục từ điển, không phải một câu trả lời. Phiên bản giúp bạn được tuyển nêu <em>đánh đổi và hệ quả</em>: "TCP trả một cú bắt tay và có thể nghẽn đầu hàng; UDP bỏ cả hai nhưng không cho bạn bảo đảm nào, nên QUIC dựng lại thứ tự theo-stream trên UDP để có tốc độ HTTP/3 mà không có HoL của TCP." Tương tự cho TLS ("một vòng khứ hồi cho một khoá phiên và danh tính — 1.3 cắt xuống một, và resumption xuống không") và DNS ("các vòng khứ hồi bạn cache đi theo TTL, và Anycast đưa máy chủ gần hơn"). Mọi câu trả lời mạnh trong mạng thật ra về <strong>vòng khứ hồi và cái gì bỏ chúng</strong> — keep-alive, HTTP/2, TLS resumption, một cache ấm, một CDN gần. Khung câu trả lời của bạn theo cách đó và bạn nghe như người đã tinh chỉnh một hệ thống thật, vì khoá này bắt bạn làm đúng điều đó.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> diễn tập nói to, như trong phỏng vấn, và ép mình thêm một phép đo mỗi câu trả lời.</p>
<ol>
<li>Trả lời "gõ một URL thì gì xảy ra" trong 60 giây, kết thúc bằng các chặng <code>curl -w</code>.</li>
<li>Mô tả cú bắt tay 3 bước và vì sao nó là một vòng khứ hồi độ trễ; nhắc keep-alive tránh lặp lại thế nào.</li>
<li>Đối chiếu TCP và UDP như một <em>đánh đổi</em>, và nói QUIC hợp ở đâu.</li>
<li>Giải thích HTTP/1.1 → 2 → 3 bằng <em>cái mỗi cái sửa</em>, không phải "nhanh hơn."</li>
</ol>
<p><strong>Đạt khi:</strong> mỗi câu trả lời gọi tên các tầng theo thứ tự, nêu một đánh đổi (không phải định nghĩa), và gồm ít nhất một phép đo hay cơ chế cụ thể bạn thấy trong khoá (<code>curl -w</code>, một SYN/SYN-ACK/ACK đã bắt, dùng lại kết nối, một frame).</p>
<details><summary>Lời giải</summary>
<p>URL→trang: DNS → TCP → TLS → HTTP → render, bỏ qua được qua cache/keep-alive/CDN; đo bằng <code>curl -w</code> (namelookup/connect/starttransfer/total). Bắt tay: SYN/SYN-ACK/ACK thiết lập số thứ tự cả hai chiều, một RTT trước bất kỳ yêu cầu nào, tránh bằng keep-alive. TCP vs UDP: tin cậy+thứ tự vs tốc độ+kiểm soát; QUIC thêm thứ tự theo-stream trên UDP cho HTTP/3. Phiên bản HTTP: 1.1 keep-alive nhưng giới hạn 6 kết nối; 2 ghép kênh bỏ nó; 3 trên QUIC bỏ nghẽn đầu hàng TCP.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Bắt tay 3 bước', 'SYN / SYN-ACK / ACK — thiết lập số thứ tự cả hai chiều (một RTT).'],
  ['TTFB', 'Time to first byte — thời gian máy chủ nghĩ (time_starttransfer).'],
  ['Keep-alive', 'Dùng lại một kết nối TCP cho nhiều yêu cầu — bỏ cú bắt tay.'],
  ['Ghép kênh', 'HTTP/2: nhiều stream trên một kết nối (không giới hạn 6 kết nối).'],
  ['Nghẽn đầu hàng', 'Một gói TCP mất kẹt mọi stream HTTP/2; QUIC sửa.'],
  ['QUIC', 'Giao vận của HTTP/3 trên UDP với thứ tự theo-stream + dựng nhanh.'],
  ['Vòng khứ hồi', 'Đơn vị độ trễ; việc hiệu năng bỏ hay rút ngắn các vòng khứ hồi.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Biết hành trình <strong>URL → trang</strong> theo thứ tự, và tầng nào bỏ qua được (cache, keep-alive, CDN).</li>
<li>Trả lời bằng một <strong>phép đo</strong>: các chặng <code>curl -w</code>, một cú bắt tay đã bắt, dùng lại kết nối — không phải một sơ đồ thuộc lòng.</li>
<li><strong>TCP vs UDP</strong> như một đánh đổi (tin cậy+thứ tự vs tốc độ+kiểm soát); QUIC dựng tin cậy trên UDP.</li>
<li><strong>HTTP/1.1 → 2 → 3</strong>: gọi tên cái mỗi cái <strong>sửa</strong> (ghép kênh, rồi nghẽn đầu hàng TCP qua QUIC).</li>
<li>TLS và DNS là <strong>vòng khứ hồi</strong>; mọi câu trả lời mạnh là về bỏ hay rút ngắn chúng.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/Performance/Guides/How_browsers_work', '📘', 'MDN — Trình duyệt hoạt động thế nào', 'Đường ống URL→trang, từ điều hướng tới render.', 'Mở')}
${L('https://hpbn.co/', '📘', 'High Performance Browser Networking', 'Góc nhìn vòng-khứ-hồi về TCP, TLS, HTTP/2 và hơn nữa (miễn phí online).', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Evolution_of_HTTP', '📘', 'MDN — Tiến hoá của HTTP', 'HTTP/1.1, /2 và /3 mỗi cái đổi gì, theo thứ tự.', 'Mở')}
</div>
`,
};
