/**
 * Chương 13 · 13.1 — Dựng hệ thống (slug khung netdev-13-1-dung-lab). Bài MỞ dự án CUỐI KHOÁ (có khối 🎯).
 * Output thật: lab/out/c131-*.out.txt (dựng lại: bash lab/code/dung-output-ch13.sh).
 */
import { run, card, kv } from '../_ui.mjs';
import G from '../giang/nfd-13-1.mjs';

const L = card;

export default {
  title: '13.1 — Capstone: build the request stack|||13.1 — Dự án cuối khoá: dựng hệ thống đường đi request',
  slug: 'netdev-13-1-dung-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'DỰ ÁN CUỐI KHOÁ (kiểu PE/FE): dựng một đường đi request thật client → nginx biên (reverse proxy: gzip/cache/keep-alive) → API, phản chiếu stack production (Cloudflare → nginx → Docker → API → PG/Redis → R2). Phương pháp: MỐC NỀN → tối ưu (đo trước/sau) → làm hỏng & chẩn đoán → báo cáo. Nộp: bảng mốc nền, bảng trước/sau, báo cáo sự cố, câu chuyện phỏng vấn. Có checklist hoàn thành. Số đo THẬT trên lab.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1 · Capstone</span>
<h2>Capstone: build the request stack</h2>
<p class="lead">This final chapter is one project, and it is the point of the whole course. You will build a realistic request path — a client, an <strong>nginx edge</strong>, and an API — then do to it exactly what a performance or SRE engineer does to production: <strong>measure a baseline, optimise and prove the gain, break it on purpose and diagnose, and write it up</strong>. By the end you will not just "know networking" — you will have a request path you measured, tuned by a measured amount, broke, diagnosed, and can narrate in an interview. This lesson stands the stack up and lays out the method, the deliverables, and the completion checklist.</p>

<div class="callout info">
<p><strong>🎯 Chapter 13 capstone — what you will produce</strong></p>
<ul>
<li><strong>A working stack</strong>: client → nginx edge (reverse proxy with gzip, cache, keep-alive) → API — the shape of a real site.</li>
<li><strong>A baseline</strong> (13.2): every hop measured — DNS/TCP/TLS/TTFB and response size — <em>before</em> you touch anything.</li>
<li><strong>Before/after gains</strong> (13.3): compression, edge caching and keep-alive, each shown as a measured improvement.</li>
<li><strong>Induced failures + diagnosis</strong> (13.4): 502/504/refused, each diagnosed to the right layer with the Chapter 11 method.</li>
<li><strong>A report</strong> (13.5): a baseline table, a before/after table, an incident write-up, and the one-paragraph interview story.</li>
</ul>
<p><strong>The rule that makes it real:</strong> <em>measure, change one thing, measure again.</em> A tuning win you cannot show as a before/after number is just a claim — and this capstone is about numbers.</p>
</div>

<h3>The stack you build</h3>
${kv([
  ['Client', 'nfd-client (curl, tcpdump) — stands in for a browser / mobile app.'],
  ['Edge', 'nginx reverse proxy (gzip, cache, keep-alive to upstream) — stands in for Cloudflare + nginx.'],
  ['API', 'Node on nfd-api — stands in for Express/Spring on Docker.'],
  ['(behind)', 'In production: PostgreSQL / Redis / R2 — the lab stops at the API.'],
])}
<p>This is a faithful miniature of a real path. cuongthai.com runs <strong>Cloudflare → nginx → Docker → Express/Spring → PostgreSQL/Redis → R2</strong>; every layer you studied appears there exactly once, and your lab stack is the same shape at small scale — which is why the tuning and the failures you measure here transfer directly.</p>

<h3>It runs</h3>
<p>Bring it up with <code>bash lab/code/dung-output-ch13.sh</code> and send a request through the edge to the API:</p>
${run('c131-stack', 'curl', 1)}
<p>The edge (<code>:8080</code>) proxied <code>/api/hello</code> to the API, which echoed what it saw: <code>seenOn</code> is the API's own address (<code>10.10.2.20:3000</code>), and the request carried the edge's <code>X-Forwarded-For</code>. The path is live end to end — now it is something you can put a stopwatch and a packet capture on.</p>

<h3>The method, and what you hand in</h3>
<ol>
<li><strong>Baseline (13.2)</strong> — measure every hop before changing anything. You cannot improve what you did not measure.</li>
<li><strong>Optimise (13.3)</strong> — change <em>one</em> thing at a time (compression, cache, keep-alive), measure before/after, keep what helps.</li>
<li><strong>Break (13.4)</strong> — induce real failures (502/504/refused) and diagnose each to a layer.</li>
<li><strong>Report (13.5)</strong> — the numbers, the incident, and the interview story.</li>
</ol>

<div class="pitfall co-tieu-de">
<p><strong>The capstone is graded on measured before/after, not on "I enabled gzip."</strong> The single most common way this project (and real performance work) goes wrong is changing several things at once and declaring victory without numbers. If you turn on compression, caching and keep-alive together and the page got faster, you have learned nothing you can defend — you don't know which change helped, by how much, or whether one hurt. The discipline is boring and non-negotiable: <strong>record a baseline, change exactly one thing, measure again, write down the delta.</strong> That is what produces a before/after table you can show an interviewer ("compression cut the response from 67 KB to 1.8 KB; the edge cache turned a 3.0 s origin call into a 0.3 ms hit"), and it is what separates an engineer who <em>tunes</em> from one who <em>fiddles</em>. Every number in this capstone must be one you measured, one change at a time.</p>
</div>

<h3>🧪 Completion checklist (the capstone deliverable)</h3>
<div class="callout ok">
<p>Tick all five — these are what you hand in:</p>
<ul>
<li>☐ The stack is up and a request reaches the API <strong>through the edge</strong> (you saw <code>c131</code>).</li>
<li>☐ A <strong>baseline</strong> exists: every hop measured (DNS/TCP/TLS/TTFB/total + size), numbers recorded.</li>
<li>☐ At least <strong>two optimisations</strong> shown as <strong>before/after</strong> numbers (e.g. compression, edge cache).</li>
<li>☐ At least <strong>two failures</strong> (e.g. 504, 502) induced and <strong>diagnosed to the right layer</strong>.</li>
<li>☐ A <strong>one-paragraph interview story</strong> that cites <em>your own</em> numbers.</li>
</ul>
<p><strong>Done when:</strong> all five boxes are ticked with real artefacts — a baseline table, a before/after table, an incident report, and the story — each backed by measurements you ran on this stack.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Edge / reverse proxy', 'The nginx layer in front of the API (gzip, cache, keep-alive, TLS).'],
  ['Baseline', 'The measurements taken before any change — the reference to improve against.'],
  ['Before/after', 'A measured delta proving one change helped (and by how much).'],
  ['Incident report', 'A broken scenario written as symptom → layer → fix.'],
  ['Interview story', 'The one-paragraph narration of the measured, tuned, diagnosed path.'],
  ['One change at a time', 'The discipline that makes a before/after number trustworthy.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>The capstone builds a real request path — <strong>client → nginx edge → API</strong> — and makes it measurable.</li>
<li>Method: <strong>baseline → optimise (before/after) → break & diagnose → report</strong>.</li>
<li>Deliverables: a baseline table, a before/after table, an incident report, and an interview story.</li>
<li>It mirrors a production stack (Cloudflare → nginx → Docker → API → PG/Redis → R2) at small scale.</li>
<li>The rule: <strong>measure, change one thing, measure again</strong> — a win you can't show as a number is a claim.</li>
</ul>
${L('https://web.dev/articles/optimize-ttfb', '📘', 'web.dev — Optimize TTFB', 'The hops that make up TTFB and how to measure/improve them.', 'Open')}
${L('https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/', '📘', 'nginx — Reverse proxy', 'The edge you build: proxying, headers, and upstreams.', 'Open')}
${L('https://hpbn.co/', '📘', 'High Performance Browser Networking', 'The measure-then-tune mindset for the whole request path.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1 · Dự án cuối khoá</span>
<h2>Dự án cuối khoá: dựng hệ thống đường đi request</h2>
<p class="lead">Chương cuối này là một dự án, và nó là điểm của cả khoá. Bạn sẽ dựng một đường request thực tế — một client, một <strong>nginx biên</strong>, và một API — rồi làm với nó đúng điều một kỹ sư hiệu năng hay SRE làm với production: <strong>đo một mốc nền, tối ưu và chứng minh cái lợi, làm hỏng có chủ đích và chẩn đoán, và viết lại</strong>. Tới cuối bạn sẽ không chỉ "biết mạng" — bạn sẽ có một đường request bạn đã đo, tinh chỉnh một lượng đo được, làm hỏng, chẩn đoán, và kể được trong một phỏng vấn. Bài này dựng hệ thống lên và bày ra phương pháp, các deliverable, và checklist hoàn thành.</p>

<div class="callout info">
<p><strong>🎯 Dự án cuối khoá Chương 13 — bạn sẽ tạo ra</strong></p>
<ul>
<li><strong>Một stack chạy</strong>: client → nginx biên (reverse proxy với gzip, cache, keep-alive) → API — dáng của một site thật.</li>
<li><strong>Một mốc nền</strong> (13.2): mỗi chặng đo — DNS/TCP/TLS/TTFB và kích thước câu trả lời — <em>trước</em> khi bạn chạm bất cứ gì.</li>
<li><strong>Cái lợi trước/sau</strong> (13.3): nén, cache biên và keep-alive, mỗi cái trình như một cải thiện đo được.</li>
<li><strong>Lỗi gây ra + chẩn đoán</strong> (13.4): 502/504/refused, mỗi cái chẩn đoán tới tầng đúng với phương pháp Chương 11.</li>
<li><strong>Một báo cáo</strong> (13.5): một bảng mốc nền, một bảng trước/sau, một bản viết sự cố, và câu chuyện phỏng vấn một đoạn.</li>
</ul>
<p><strong>Quy tắc làm nó thật:</strong> <em>đo, đổi một thứ, đo lại.</em> Một thắng lợi tinh chỉnh bạn không trình được như một con số trước/sau chỉ là một khẳng định — và capstone này là về con số.</p>
</div>

<h3>Stack bạn dựng</h3>
${kv([
  ['Client', 'nfd-client (curl, tcpdump) — thay cho một trình duyệt / app di động.'],
  ['Biên', 'nginx reverse proxy (gzip, cache, keep-alive tới upstream) — thay cho Cloudflare + nginx.'],
  ['API', 'Node trên nfd-api — thay cho Express/Spring trên Docker.'],
  ['(phía sau)', 'Trên production: PostgreSQL / Redis / R2 — lab dừng ở API.'],
])}
<p>Đây là một mô hình thu nhỏ trung thực của một đường thật. cuongthai.com chạy <strong>Cloudflare → nginx → Docker → Express/Spring → PostgreSQL/Redis → R2</strong>; mỗi tầng bạn học hiện ở đó đúng một lần, và lab stack của bạn là cùng dáng ở quy mô nhỏ — lý do tinh chỉnh và lỗi bạn đo ở đây chuyển trực tiếp.</p>

<h3>Nó chạy</h3>
<p>Dựng bằng <code>bash lab/code/dung-output-ch13.sh</code> và gửi một yêu cầu qua biên tới API:</p>
${run('c131-stack', 'curl', 1)}
<p>Biên (<code>:8080</code>) proxy <code>/api/hello</code> tới API, nó echo cái nó thấy: <code>seenOn</code> là địa chỉ của chính API (<code>10.10.2.20:3000</code>), và yêu cầu mang <code>X-Forwarded-For</code> của biên. Đường sống đầu-cuối — giờ nó là thứ bạn đặt được một đồng hồ bấm giờ và một bản bắt gói lên.</p>

<h3>Phương pháp, và cái bạn nộp</h3>
<ol>
<li><strong>Mốc nền (13.2)</strong> — đo mỗi chặng trước khi đổi bất cứ gì. Bạn không cải thiện được cái bạn không đo.</li>
<li><strong>Tối ưu (13.3)</strong> — đổi <em>một</em> thứ một lúc (nén, cache, keep-alive), đo trước/sau, giữ cái giúp.</li>
<li><strong>Làm hỏng (13.4)</strong> — gây lỗi thật (502/504/refused) và chẩn đoán mỗi cái tới một tầng.</li>
<li><strong>Báo cáo (13.5)</strong> — con số, sự cố, và câu chuyện phỏng vấn.</li>
</ol>

<div class="pitfall co-tieu-de">
<p><strong>Capstone được chấm theo trước/sau đo được, không theo "tôi bật gzip."</strong> Cách phổ biến nhất dự án này (và việc hiệu năng thật) hỏng là đổi nhiều thứ cùng lúc và tuyên bố thắng mà không có con số. Nếu bạn bật nén, cache và keep-alive cùng nhau và trang nhanh hơn, bạn chẳng học được gì bảo vệ được — bạn không biết thay đổi nào giúp, bao nhiêu, hay một cái có hại không. Kỷ luật thì nhàm và không thương lượng: <strong>ghi một mốc nền, đổi đúng một thứ, đo lại, viết xuống độ chênh.</strong> Đó là cái tạo ra một bảng trước/sau bạn trình được cho người phỏng vấn ("nén cắt câu trả lời từ 67 KB xuống 1,8 KB; cache biên biến một lời gọi origin 3,0 giây thành một trúng 0,3 ms"), và đó là cái tách một kỹ sư <em>tinh chỉnh</em> khỏi một người <em>nghịch</em>. Mọi con số trong capstone này phải là một cái bạn đã đo, một thay đổi một lúc.</p>
</div>

<h3>🧪 Checklist hoàn thành (deliverable của capstone)</h3>
<div class="callout ok">
<p>Tick cả năm — đây là cái bạn nộp:</p>
<ul>
<li>☐ Hệ thống lên và một yêu cầu tới API <strong>qua biên</strong> (bạn đã thấy <code>c131</code>).</li>
<li>☐ Một <strong>mốc nền</strong> tồn tại: mỗi chặng đo (DNS/TCP/TLS/TTFB/total + kích thước), con số ghi.</li>
<li>☐ Ít nhất <strong>hai tối ưu</strong> trình như con số <strong>trước/sau</strong> (vd nén, cache biên).</li>
<li>☐ Ít nhất <strong>hai lỗi</strong> (vd 504, 502) gây ra và <strong>chẩn đoán tới tầng đúng</strong>.</li>
<li>☐ Một <strong>câu chuyện phỏng vấn một đoạn</strong> trích con số <em>của chính bạn</em>.</li>
</ul>
<p><strong>Đạt khi:</strong> cả năm ô tick với hiện vật thật — một bảng mốc nền, một bảng trước/sau, một báo cáo sự cố, và câu chuyện — mỗi cái chống bởi phép đo bạn chạy trên stack này.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Biên / reverse proxy', 'Tầng nginx trước API (gzip, cache, keep-alive, TLS).'],
  ['Mốc nền (baseline)', 'Phép đo lấy trước bất kỳ thay đổi nào — tham chiếu để cải thiện theo.'],
  ['Trước/sau', 'Một độ chênh đo được chứng minh một thay đổi giúp (và bao nhiêu).'],
  ['Báo cáo sự cố', 'Một tình huống hỏng viết như triệu chứng → tầng → cách sửa.'],
  ['Câu chuyện phỏng vấn', 'Lời kể một đoạn của đường đã đo, tinh chỉnh, chẩn đoán.'],
  ['Một thay đổi một lúc', 'Kỷ luật làm một con số trước/sau đáng tin.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Capstone dựng một đường request thật — <strong>client → nginx biên → API</strong> — và làm nó đo được.</li>
<li>Phương pháp: <strong>mốc nền → tối ưu (trước/sau) → làm hỏng & chẩn đoán → báo cáo</strong>.</li>
<li>Deliverable: một bảng mốc nền, một bảng trước/sau, một báo cáo sự cố, và một câu chuyện phỏng vấn.</li>
<li>Nó phản chiếu một stack production (Cloudflare → nginx → Docker → API → PG/Redis → R2) ở quy mô nhỏ.</li>
<li>Quy tắc: <strong>đo, đổi một thứ, đo lại</strong> — một thắng lợi bạn không trình được như một con số là một khẳng định.</li>
</ul>
${L('https://web.dev/articles/optimize-ttfb', '📘', 'web.dev — Tối ưu TTFB', 'Các chặng tạo nên TTFB và cách đo/cải thiện chúng.', 'Mở')}
${L('https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/', '📘', 'nginx — Reverse proxy', 'Biên bạn dựng: proxy, header, và upstream.', 'Mở')}
${L('https://hpbn.co/', '📘', 'High Performance Browser Networking', 'Tư duy đo-rồi-tinh-chỉnh cho cả đường request.', 'Mở')}
</div>
`,
};
