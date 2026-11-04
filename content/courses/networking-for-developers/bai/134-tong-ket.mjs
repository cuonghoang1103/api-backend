/**
 * Chương 13 · 13.5 — Tổng kết và câu chuyện phỏng vấn (slug khung netdev-13-5-tong-ket). Capstone — bài CUỐI khoá.
 * Output TÁI DÙNG: lab/out/c133-toiuu (số đo trước/sau) làm neo cho câu chuyện.
 */
import { run, card, kv } from '../_ui.mjs';
import G from '../giang/nfd-13-5.mjs';

const L = card;

export default {
  title: '13.5 — Review and the interview story|||13.5 — Tổng kết và câu chuyện phỏng vấn',
  slug: 'netdev-13-5-tong-ket',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài CUỐI khoá: ôn cả khoá như MỘT đường request (mỗi chương là một chặng — DNS→TCP→TLS→HTTP→CDN/LB→real-time, đo được mọi chặng); tóm tắt capstone (dựng→đo→tinh chỉnh→làm hỏng→báo cáo); kể CÂU CHUYỆN PHỎNG VẤN một đoạn bằng CON SỐ của bạn (nén 37×, cache 3s→~0,3ms); rubric hoàn thành capstone (10 điểm); và đi đâu tiếp (backend/DevOps-SRE/security/real-time). Khoá này là XƯƠNG SỐNG mọi đường đó xây trên.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.5 · Capstone</span>
<h2>Review and the interview story</h2>
<p class="lead">The course began with one question — "what happens when you type a URL and press Enter?" — and ends with you able to measure and reason about every hop of the answer. This final lesson reviews the whole journey as a single request path, recaps the capstone, and shows how to turn it into the one-paragraph interview story that sounds like experience, because by now it is. It also gives the capstone completion rubric and where to take this next.</p>

<h3>The whole course, one path</h3>
<p>Every chapter was a hop on the same request, and you can now do something concrete at each:</p>
${kv([
  ['Name → IP (DNS, Ch3)', 'Trace resolution, read TTL and Anycast, diagnose with dig.'],
  ['Connect (IP/TCP/UDP/QUIC, Ch1,2,4,5)', 'Read a handshake, subnet, congestion control, keep-alive.'],
  ['Secure (TLS, Ch6)', 'Read the certificate chain, dates and the handshake with openssl.'],
  ['Request (HTTP 1.1→3, Ch7)', 'Read versions, headers, multiplexing — and what each fixed.'],
  ['Edge (CDN/cache, LB, Ch8,10)', 'Cache, compress, balance, and read 502/503/504/524.'],
  ['Live + tools (real-time, Ch9,11)', 'SSE/WebSocket, capture with tcpdump, measure, diagnose by layer.'],
])}
<p>A single request touches all of it. The spine of this course is exactly that path — and you can now put a stopwatch, a capture and a hypothesis on any part of it.</p>

<h3>The capstone, recapped</h3>
<p>Five verbs, which are precisely what a performance or SRE engineer does, done on a real stack with real numbers: you <strong>built</strong> a client → nginx edge → API path, <strong>measured</strong> a baseline hop by hop, <strong>tuned</strong> one knob at a time and proved each gain, <strong>broke</strong> it on purpose and diagnosed each failure to a layer, and <strong>reported</strong> it as a baseline table, a before/after table, an incident, and a story.</p>

<h3>The before/after, in your own numbers</h3>
${run('c133-toiuu', 'echo "== compression', 3)}
<p>These are <em>your</em> numbers to quote: compression cut the response <strong>37×</strong> (67,092 → 1,809 bytes), and the edge cache turned a <strong>3.0-second</strong> origin call into a <strong>~0.3 ms</strong> hit. An interviewer remembers "I measured a 37× smaller payload and collapsed a 3-second call to sub-millisecond" far longer than "I know about caching." The number is what sticks.</p>

<div class="pitfall co-tieu-de">
<p><strong>The interview story is only as strong as the measurements inside it — so build it from numbers and tools, not adjectives.</strong> The most common way strong engineers undersell themselves is narrating their work in adjectives: "I made it faster, I improved reliability, I'm good with networking." None of that is checkable, and interviewers have heard it a thousand times. The capstone exists to give you the opposite: a paragraph where <em>every clause carries a number or a tool</em>. Compare "I optimised the API" with: <em>"I measured the path with <code>curl -w</code>, found the download dominated, enabled gzip to cut a 67 KB response to 1.8 KB, then cached a slow report endpoint at the edge to turn a 3-second call into sub-millisecond; I broke it on purpose — a 504 from a slow upstream, a 502 from a dead one — diagnosed each by layer with <code>nc</code>/<code>curl -I</code>/<code>openssl</code>, and added a TTFB alert."</em> The second version is unforgettable, and you cannot fake it — which is exactly why it works. Do the capstone, keep your tables, and the story writes itself from the measurements you actually produced.</p>
</div>

<h3>🧪 Final deliverable — the capstone rubric (30 minutes)</h3>
<div class="callout ok">
<p><strong>Grade your own capstone against this rubric (10 points):</strong></p>
<table>
<tr><th>Criterion</th><th>Pts</th><th>Full marks when</th></tr>
<tr><td>Stack built</td><td>2</td><td>a request reaches the API through the edge (c131)</td></tr>
<tr><td>Baseline</td><td>2</td><td>every hop measured (dns/connect/ttfb/total + size), recorded</td></tr>
<tr><td>Optimise</td><td>3</td><td>≥2 before/after gains, one change each, measured (e.g. 37× compression, 3 s→~0.3 ms cache)</td></tr>
<tr><td>Break &amp; diagnose</td><td>2</td><td>≥2 failures induced (504, 502…), each diagnosed to a layer</td></tr>
<tr><td>Report &amp; story</td><td>1</td><td>the two tables + an incident report + the one-paragraph story</td></tr>
</table>
<p><strong>Done when:</strong> you score the full 10 with real artefacts — the baseline and before/after tables, an incident report (symptom → layer → fix → prevention), and an interview story where every sentence carries a number or a tool.</p>
</div>

<h3>Where to go next</h3>
${kv([
  ['Backend / API', 'api-design, nginx, Node.js, databases — the layers above this path.'],
  ['DevOps / SRE', 'Docker, Linux & Bash, observability; a CCNA if you move into infrastructure.'],
  ['Security', 'network-security, TLS/PKI depth, web-security — the trust layer, in depth.'],
  ['Real-time', 'socket.io, WebRTC, streaming at scale — the long-lived-connection path.'],
])}
<p>This course is the <strong>spine</strong>: the request path every one of those builds on. You will meet DNS, TCP, TLS, HTTP, caching and load balancing again in each — and now you can measure them, not just name them.</p>

<h3>🗂 Key terms</h3>
${kv([
  ['The request path', 'DNS → TCP → TLS → HTTP → CDN/LB → real-time — the course’s spine.'],
  ['build → measure → tune → break → report', 'The five verbs of the capstone (and of performance/SRE work).'],
  ['Before/after', 'A measured delta — the unit of a defensible optimisation.'],
  ['Incident report', 'Symptom → diagnosis (layer + measurement) → fix → prevention.'],
  ['Interview story', 'One paragraph where every clause carries a number or a tool.'],
])}

<h3>📌 Summary — you can now…</h3>
<ul>
<li><strong>Explain</strong> the whole request path (DNS → TCP → TLS → HTTP → CDN/LB → real-time) and <strong>measure</strong> each hop.</li>
<li><strong>Tune</strong> a real stack and prove each gain as a before/after (you cut a payload 37× and a call to sub-ms).</li>
<li><strong>Break</strong> a system on purpose and diagnose any failure to a layer with <code>dig</code>/<code>curl</code>/<code>nc</code>/<code>openssl</code>/<code>tcpdump</code>.</li>
<li><strong>Tell the story</strong> in an interview with numbers and tools — like someone who has done it, because you have.</li>
<li>Carry this <strong>spine</strong> into backend, DevOps/SRE, security and real-time work. That is the course — congratulations.</li>
</ul>
${L('https://hpbn.co/', '📘', 'High Performance Browser Networking', 'The whole request path, in depth — your next reference.', 'Open')}
${L('https://sre.google/books/', '📘', 'Google SRE Books (free)', 'Where measuring, breaking and reporting become a career.', 'Open')}
${L('https://roadmap.sh/', '📘', 'roadmap.sh', 'Backend, DevOps and security roadmaps that build on this spine.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.5 · Capstone</span>
<h2>Tổng kết và câu chuyện phỏng vấn</h2>
<p class="lead">Khoá bắt đầu với một câu hỏi — "gõ một URL rồi Enter thì gì xảy ra?" — và kết thúc với bạn đo và lập luận được về mọi chặng của câu trả lời. Bài cuối này ôn cả hành trình như một đường request duy nhất, tóm tắt capstone, và cho thấy cách biến nó thành câu chuyện phỏng vấn một đoạn nghe như kinh nghiệm, vì tới giờ nó là vậy. Nó cũng cho rubric hoàn thành capstone và đưa cái này đi đâu tiếp.</p>

<h3>Cả khoá, một đường</h3>
<p>Mỗi chương là một chặng trên cùng một yêu cầu, và giờ bạn làm được điều cụ thể ở mỗi cái:</p>
${kv([
  ['Tên → IP (DNS, Ch3)', 'Truy vết phân giải, đọc TTL và Anycast, chẩn đoán với dig.'],
  ['Connect (IP/TCP/UDP/QUIC, Ch1,2,4,5)', 'Đọc một cú bắt tay, subnet, kiểm soát tắc nghẽn, keep-alive.'],
  ['Secure (TLS, Ch6)', 'Đọc chuỗi chứng chỉ, ngày và cú bắt tay với openssl.'],
  ['Request (HTTP 1.1→3, Ch7)', 'Đọc phiên bản, header, ghép kênh — và cái mỗi cái sửa.'],
  ['Edge (CDN/cache, LB, Ch8,10)', 'Cache, nén, cân bằng, và đọc 502/503/504/524.'],
  ['Live + công cụ (real-time, Ch9,11)', 'SSE/WebSocket, bắt với tcpdump, đo, chẩn đoán theo tầng.'],
])}
<p>Một yêu cầu đơn chạm tất cả. Xương sống của khoá này đúng là đường đó — và giờ bạn đặt được một đồng hồ bấm giờ, một bản bắt và một giả thuyết lên bất kỳ phần nào của nó.</p>

<h3>Capstone, tóm tắt</h3>
<p>Năm động từ, đúng là cái một kỹ sư hiệu năng hay SRE làm, làm trên một stack thật với con số thật: bạn <strong>dựng</strong> một đường client → nginx biên → API, <strong>đo</strong> một mốc nền từng chặng, <strong>tinh chỉnh</strong> một núm một lúc và chứng minh mỗi cái lợi, <strong>làm hỏng</strong> nó có chủ đích và chẩn đoán mỗi lỗi tới một tầng, và <strong>báo cáo</strong> nó như một bảng mốc nền, một bảng trước/sau, một sự cố, và một câu chuyện.</p>

<h3>Trước/sau, trong con số của chính bạn</h3>
${run('c133-toiuu', 'echo "== compression', 3)}
<p>Đây là con số <em>của bạn</em> để trích: nén cắt câu trả lời <strong>37×</strong> (67.092 → 1.809 byte), và cache biên biến một lời gọi origin <strong>3,0 giây</strong> thành một trúng <strong>~0,3 ms</strong>. Một người phỏng vấn nhớ "tôi đo một payload nhỏ hơn 37× và làm sụp một lời gọi 3 giây xuống dưới-mili-giây" lâu hơn nhiều "tôi biết về cache." Con số là thứ dính lại.</p>

<div class="pitfall co-tieu-de">
<p><strong>Câu chuyện phỏng vấn chỉ mạnh bằng các phép đo bên trong nó — nên xây nó từ con số và công cụ, không phải tính từ.</strong> Cách phổ biến nhất các kỹ sư giỏi bán rẻ bản thân là kể việc bằng tính từ: "tôi làm nó nhanh hơn, tôi cải thiện độ tin cậy, tôi giỏi mạng." Không cái nào kiểm được, và người phỏng vấn nghe nó một nghìn lần rồi. Capstone tồn tại để cho bạn cái ngược lại: một đoạn nơi <em>mỗi mệnh đề mang một con số hay một công cụ</em>. So "tôi tối ưu API" với: <em>"tôi đo đường với <code>curl -w</code>, thấy tải trội, bật gzip để cắt một câu trả lời 67 KB xuống 1,8 KB, rồi cache một điểm cuối báo cáo chậm ở biên để biến một lời gọi 3 giây thành dưới-mili-giây; tôi làm hỏng nó có chủ đích — một 504 từ một upstream chậm, một 502 từ một cái chết — chẩn đoán mỗi cái theo tầng với <code>nc</code>/<code>curl -I</code>/<code>openssl</code>, và thêm một cảnh báo TTFB."</em> Phiên bản thứ hai không thể quên, và bạn không giả được nó — đúng lý do nó hiệu quả. Làm capstone, giữ các bảng của bạn, và câu chuyện tự viết từ các phép đo bạn thật sự tạo ra.</p>
</div>

<h3>🧪 Deliverable cuối — rubric capstone (30 phút)</h3>
<div class="callout ok">
<p><strong>Tự chấm capstone của bạn theo rubric này (10 điểm):</strong></p>
<table>
<tr><th>Tiêu chí</th><th>Điểm</th><th>Trọn điểm khi</th></tr>
<tr><td>Stack dựng</td><td>2</td><td>một yêu cầu tới API qua biên (c131)</td></tr>
<tr><td>Mốc nền</td><td>2</td><td>mỗi chặng đo (dns/connect/ttfb/total + size), ghi</td></tr>
<tr><td>Tối ưu</td><td>3</td><td>≥2 cái lợi trước/sau, mỗi cái một thay đổi, đo được (vd nén 37×, cache 3 s→~0,3 ms)</td></tr>
<tr><td>Làm hỏng &amp; chẩn đoán</td><td>2</td><td>≥2 lỗi gây ra (504, 502…), mỗi cái chẩn đoán tới một tầng</td></tr>
<tr><td>Báo cáo &amp; câu chuyện</td><td>1</td><td>hai bảng + một báo cáo sự cố + câu chuyện một đoạn</td></tr>
</table>
<p><strong>Đạt khi:</strong> bạn đạt trọn 10 với hiện vật thật — bảng mốc nền và trước/sau, một báo cáo sự cố (triệu chứng → tầng → sửa → ngừa), và một câu chuyện phỏng vấn nơi mỗi câu mang một con số hay một công cụ.</p>
</div>

<h3>Đi đâu tiếp</h3>
${kv([
  ['Backend / API', 'api-design, nginx, Node.js, cơ sở dữ liệu — các tầng trên đường này.'],
  ['DevOps / SRE', 'Docker, Linux & Bash, quan sát; một CCNA nếu bạn vào hạ tầng.'],
  ['Bảo mật', 'network-security, TLS/PKI sâu, web-security — tầng tin cậy, chuyên sâu.'],
  ['Thời gian thực', 'socket.io, WebRTC, streaming ở quy mô — đường kết-nối-sống-lâu.'],
])}
<p>Khoá này là <strong>xương sống</strong>: đường request mỗi cái trong số đó xây trên. Bạn sẽ gặp DNS, TCP, TLS, HTTP, cache và cân bằng tải lần nữa trong mỗi cái — và giờ bạn đo được chúng, không chỉ gọi tên.</p>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Đường request', 'DNS → TCP → TLS → HTTP → CDN/LB → real-time — xương sống của khoá.'],
  ['dựng → đo → tinh chỉnh → làm hỏng → báo cáo', 'Năm động từ của capstone (và của việc hiệu năng/SRE).'],
  ['Trước/sau', 'Một độ chênh đo được — đơn vị của một tối ưu bảo vệ được.'],
  ['Báo cáo sự cố', 'Triệu chứng → chẩn đoán (tầng + phép đo) → sửa → ngừa.'],
  ['Câu chuyện phỏng vấn', 'Một đoạn nơi mỗi mệnh đề mang một con số hay một công cụ.'],
])}

<h3>📌 Tóm tắt — giờ bạn làm được…</h3>
<ul>
<li><strong>Giải thích</strong> cả đường request (DNS → TCP → TLS → HTTP → CDN/LB → real-time) và <strong>đo</strong> mỗi chặng.</li>
<li><strong>Tinh chỉnh</strong> một stack thật và chứng minh mỗi cái lợi như một trước/sau (bạn cắt một payload 37× và một lời gọi xuống dưới-ms).</li>
<li><strong>Làm hỏng</strong> một hệ thống có chủ đích và chẩn đoán bất kỳ lỗi nào tới một tầng với <code>dig</code>/<code>curl</code>/<code>nc</code>/<code>openssl</code>/<code>tcpdump</code>.</li>
<li><strong>Kể câu chuyện</strong> trong một phỏng vấn với con số và công cụ — như người đã làm nó, vì bạn đã làm.</li>
<li>Mang <strong>xương sống</strong> này vào việc backend, DevOps/SRE, bảo mật và thời gian thực. Đó là khoá học — chúc mừng.</li>
</ul>
${L('https://hpbn.co/', '📘', 'High Performance Browser Networking', 'Cả đường request, chuyên sâu — tham chiếu kế của bạn.', 'Mở')}
${L('https://sre.google/books/', '📘', 'Sách Google SRE (miễn phí)', 'Nơi đo, làm hỏng và báo cáo thành một sự nghiệp.', 'Mở')}
${L('https://roadmap.sh/', '📘', 'roadmap.sh', 'Lộ trình backend, DevOps và bảo mật xây trên xương sống này.', 'Mở')}
</div>
`,
};
