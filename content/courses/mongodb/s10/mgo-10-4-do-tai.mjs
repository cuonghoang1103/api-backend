/**
 * 10.4 — Đo tải MongoDB: đo p50, p95, p99 (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s10-4-do-tai'] (kịch bản demo/s10/s10-4-do-tai.txt). Máy chủ mgo-tai (mongo:8.0, 2 GB, 2 CPU, --network none), máy đo mgo-tai-node
 * (node:22-alpine, 2 GB, 2 CPU, chung netns) chạy _demo/node/tai.mjs; dữ liệu ch4.don 1.000.000 đơn (_demo/don-trieu.js) + index {khach, ngay}.
 * Khối: 0 nạp + index · 1 trích moHinhMo (lịch gửi cố định) · 2 500/s · 3 bậc 500→4000/s (gãy giữa 3000 và 4000: thông lượng kẹt ~2.500/s, p99 ~4,5 s)
 * · 4 vé đọc (7) vs 12 lõi nhìn thấy · 5 đóng 4 luồng ~3.500/s p99 4,5 ms · 6 đóng 64 luồng 2.360/s p50 26 ms · 7–8 docker pause 2 s: đóng p99 4,6 ms max 2.049 / mở p95 1.757 ms
 * · 9 báo cáo $group một mình ~350 ms · 10 API 1.000/s khi có báo cáo chen: p99 4,7 → 7,6 ms.
 * Kiểm trùng: lý thuyết đo tải (p50/p95/p99, coordinated omission, mô hình mở/đóng, cỡ pool) ở khoá performance-load-testing ⇒ liên kết; ở đây chỉ áp vào MongoDB.
 * Số ms dao động theo tải máy nhà — lời chỉ nêu khoảng/tỉ lệ; hai lượt chạy 24/11 cho cùng điểm gãy (3000 ổn, 4000 gãy).
 */
import { lenh, ma, nguon, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's10-4-do-tai';

const BAO_CAO = `Báo cáo đo tải — API "10 đơn mới nhất của khách" (ch4.don, 1.000.000 đơn)
Môi trường : mongod 8.0.38, 2 CPU, 2 GB; máy đo riêng 2 CPU; cùng máy vật lý (không qua mạng thật)
Mục tiêu   : p99 < 20 ms ở tải dự kiến 1.500 req/s (giờ cao điểm × 3)
Kết quả    : 500–3.000 req/s: p99 4–12 ms ✔ · 4.000 req/s: thông lượng kẹt ~2.500/s, p99 ~4,5 s ✘
Kết luận   : điểm gãy giữa 3.000 và 4.000 req/s; dư địa so với mục tiêu ~2× ⇒ ĐẠT
Rủi ro     : báo cáo $group chạy giờ hành chính làm p99 tăng ~1,6×; máy chủ đứng hình 2 s ⇒ p95 ~1,8 s
Việc tiếp  : chuyển báo cáo sang secondary (readPreference) hoặc giờ thấp điểm; đo lại trên cấu hình production`;

export default {
  title: '10.4 — Load testing MongoDB: measure p50, p95, p99|||10.4 — Đo tải MongoDB: đo p50, p95, p99',
  slug: 'mgo-10-4-do-tai',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Đo tải MongoDB bằng một công cụ ~100 dòng tự viết, chạy thật trên 1 triệu đơn: mô hình MỞ (gửi theo lịch, đo từ lúc lẽ ra phải gửi) tăng dần 500 → 4.000 req/s tìm ra điểm gãy — 3.000/s p99 ~12 ms, 4.000/s thông lượng kẹt ~2.500/s và p99 vọt lên ~4,5 giây; mô hình ĐÓNG 4 luồng với 64 luồng (thêm luồng làm chậm đi); coordinated omission đo thật bằng docker pause 2 giây (đóng: p99 4,6 ms nhưng max 2 s; mở: p95 1,8 s); một báo cáo $group chen vào làm p99 của API tăng ~1,6 lần; và cách viết báo cáo đo tải.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Load testing MongoDB: measure p50, p95, p99</h2>
<p class="lead">"How many users can it handle?" is a question you will be asked before every go-live, and "it was fast on my machine" is not an answer. This lesson measures one real API query — "the 10 latest orders of a customer" on 1 million orders — with a small load tool you can read in full, finds the point where MongoDB stops keeping up, and shows three ways a load test lies: the closed loop, coordinated omission, and the forgotten report running next door.</p>

<h3>An everyday picture</h3>
<p>A noodle shop serves one bowl a minute without trouble. Measuring it by sending in four friends who each order again only after finishing tells you very little: they never form a queue. Real customers arrive whenever they like — 30 at noon. The question is not "how fast is one bowl" but "at how many customers per minute does the queue outside start growing", and what the <em>last</em> customer in that queue experiences.</p>
${lienKet({ cta: 'Open lesson', khoa: 'performance-load-testing', bai: 'perf-1-1-do-tre', title: 'Performance course · 1.1 — Latency: p50, p95, p99 and why the average lies', sub: 'percentiles explained in depth — this lesson applies them to MongoDB' })}

<h3>1. The setup and the tool</h3>
${lenh(K, 0)}
<p>The server is a separate container limited to 2 CPUs and 2 GB, the load generator another container with its own 2 CPUs — a load tool on the same CPUs as the database measures itself. The query uses the index <code>{ khach: 1, ngay: -1 }</code> from Chapter 4, so each request is an index lookup of 10 documents.</p>
${lenh(K, 1)}
<p>The heart of <code>tai.mjs</code>: in the <strong>open model</strong>, request <em>i</em> is scheduled at <code>t0 + i/rate</code> and sent at that time whether or not earlier requests have finished — like real users. Latency is measured from the <em>scheduled</em> time, so if the tool itself falls behind, the delay is counted. The column <code>trễ-ngây-thơ</code> ("naive latency") measures from the moment the request actually left, the way many tools do.</p>

<h3>2. Ramp up and find the knee</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Below the knee</span><span class="lz-t">throughput = offered rate</span><span class="lz-d">500–3,000/s: p99 about 4 → 12 ms</span></div>
  <div class="lz-step"><span class="lz-k">At the knee</span><span class="lz-t">CPU / tickets fully busy</span><span class="lz-d">latency starts to climb faster</span></div>
  <div class="lz-step"><span class="lz-k">Above the knee</span><span class="lz-t">arrivals > service rate</span><span class="lz-d">4,000/s: stuck at ~2,500/s, queue grows, p99 in seconds</span></div>
</div>
${lenh(K, 2)}
${lenh(K, 3)}
<p>Read the table top to bottom. From 500 to 3,000 requests per second, throughput equals the offered rate and p99 grows slowly (about 4 → 12 ms) — the system keeps up. At 4,000/s it no longer does: throughput is stuck around 2,500/s, and since requests keep arriving faster than they leave, the queue grows for the whole run — p50 jumps to over 2 seconds and p99 to about 4.5 seconds. That is the <strong>knee</strong>: below it latency is flat, above it latency is limited only by how long you run the test. Capacity is not "4,000/s" — it is "about 3,000/s at p99 under ~12 ms" on this hardware.</p>
${lenh(K, 4)}
<p>Why does it saturate there? The container has 2 CPUs while mongod sees all 12 cores of the host, and it limits concurrency inside the storage engine with execution tickets (a handful for reads here, Lesson 10.2). CPU is the bottleneck: each request costs some microseconds of CPU, and 2 CPUs can only do so many per second.</p>

<h3>3. Closed model: why "more threads" is not the answer</h3>
${lenh(K, 5)}
${lenh(K, 6)}
<p>In the <strong>closed model</strong> a fixed number of "users" each send a request, wait for the answer, then send the next. Four of them push about 3,500 req/s at p99 ~4.5 ms — more than the open test's limit, because a closed loop never lets a queue build up: it slows down with the server. 64 of them get <em>less</em> throughput (2,360/s) and every request now waits ~26 ms in the median: the extra concurrency only queues in the pool, on the tickets and on the 2 CPUs. On a real project this is the "we doubled the thread pool and it got slower" ticket.</p>
${lienKet({ cta: 'Open lesson', khoa: 'performance-load-testing', bai: 'perf-2-2-mo-dong', title: 'Performance course · 2.2 — Open vs closed workload models', sub: 'which model matches your users' })}
${lienKet({ cta: 'Open lesson', khoa: 'performance-load-testing', bai: 'perf-8-4-pool', title: 'Performance course · 8.4 — Connection pool sizing by measurement', sub: 'the same "bigger pool, slower" curve, measured' })}

<h3>4. Coordinated omission, measured</h3>
${lenh(K, 7)}
${lenh(K, 8)}
<p>Six seconds into each run, the server is frozen for 2 seconds with <code>docker pause</code> — the same effect as a long GC pause, a stalled disk or a VM migration. The closed run reports p99 ≈ 4.6 ms: its four users were stuck <em>waiting</em>, so during those 2 seconds only four requests were measured, and they disappear in the 1% tail (max shows 2,049 ms). The open run keeps the schedule: the 2,000 requests that real users would have sent during the freeze are all late, so p95 is about 1.8 s and p99 about 2 s. The first number would go into a report saying "p99 under 5 ms"; the second tells you one customer in twenty waited almost two seconds. This error has a name — <strong>coordinated omission</strong> — and it is why the tool measures from the schedule.</p>
${lienKet({ cta: 'Open lesson', khoa: 'performance-load-testing', bai: 'perf-1-5-coordinated-omission', title: 'Performance course · 1.5 — Coordinated omission', sub: 'the theory and HdrHistogram-style correction' })}

<h3>5. The report running next door</h3>
${lenh(K, 9)}
${lenh(K, 10)}
<p>A <code>$group</code> over the whole collection takes about 350 ms on its own. Run two of them continuously while the API takes 1,000 req/s, and the API's p99 rises from about 4.7 ms (the 1,000/s step above) to about 7.6 ms; the reports themselves slow down too. Nothing failed — but if the report were heavier, or the API closer to its knee, this is the "every morning at 9 the app is slow" incident. Real fixes: run reports on a secondary with <code>readPreference: 'secondary'</code> (accepting slightly stale data, Lesson 7.1), schedule them off-peak, or pre-aggregate with <code>$merge</code> (Lesson 5.5).</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — load-testing on an empty or tiny database.</strong> With 2,000 orders everything is in cache and every query is fast; with 1 million (or the real 50 million) the working set, index sizes and disk reads change everything (Lesson 10.3). Test with production-sized, realistically distributed data — generated deterministically like <code>don-trieu.js</code> so two runs are comparable.</p>
</div>

<h3>6. Writing the result down</h3>
${ma('text', BAO_CAO)}
<p>A load test report is short and states its conditions: hardware and versions, the query, the model and rates, the target (an SLO such as "p99 under 20 ms at 1,500 req/s"), the measured knee, the margin, and the risks you saw. Without the conditions the numbers are meaningless; without the target nobody can say whether the result is good.</p>

<h3>🕵️ Attacker's view</h3>
<p>The knee is also your denial-of-service threshold. An attacker doesn't need a botnet to take down an API whose knee is 3,000 req/s and that has a search endpoint costing 350 ms per call — a few dozen requests per second to the expensive endpoint are enough (compare with the unbounded regex of Lesson 9.3). Rate-limit expensive endpoints per user and per IP, put <code>maxTimeMS</code> on queries, and include the expensive endpoints in your load tests, not only the cheap ones.</p>

<h3>💼 On the job</h3>
<p>Japanese and European clients often ask for a "performance test report" as a go-live deliverable, with a target such as "1,000 concurrent users, response under 2 s". Translate "concurrent users" into requests per second (users × requests per user per second), choose the open model, test the busiest endpoints with realistic data, and report percentiles with conditions. Tools like k6, Gatling or JMeter do the same job at scale; knowing what they measure (open vs closed, from schedule or from send) is what lets you read their reports correctly.</p>

<h3>🎤 What an interviewer will ask</h3>
<ol>
<li><strong>"Why p99 instead of the average?"</strong> — The average hides the slow tail; p99 is what one request in a hundred — many users per minute — actually experiences.</li>
<li><strong>"What is the knee and how do you find it?"</strong> — The load above which latency grows without bound because arrivals exceed service rate; ramp an open-model load in steps and watch throughput stop following the offered rate.</li>
<li><strong>"What is coordinated omission?"</strong> — When the load tool waits for slow responses before sending more, it stops sending during stalls and under-reports latency; fix with an open model measured from the scheduled time.</li>
<li><strong>"We doubled the connection pool and it got slower. Why?"</strong> — More concurrency than the bottleneck (CPU, tickets) can serve only adds queueing; measured 4 vs 64 workers: 3,500/s vs 2,360/s.</li>
<li><strong>"How do you keep reporting queries from hurting the API?"</strong> — Run them on secondaries, off-peak, or pre-aggregate; and load-test with them running.</li>
</ol>

<h3>🧪 Practice (40 minutes)</h3>
<div class="callout ok"><ol>
<li>From the ramp table, what capacity would you promise for an SLO of "p99 under 10 ms", and why not the highest rate that "passed"?</li>
<li>In the 64-worker closed run, p50 is about 26 ms. Using Little's law (concurrency = throughput × latency), check that the numbers are consistent.</li>
<li>The client says "1,000 concurrent users, each opens a page every 10 seconds, each page makes 3 database queries". What rate do you test?</li>
<li>Why does the naive latency column at 4,000/s look as bad as the scheduled one, while in the paused closed run it hides the stall?</li>
</ol>
${loiGiai('Suggested answers', `<p>1. 2,000/s had p99 ≈ 6 ms and 3,000/s ≈ 12 ms, so "p99 &lt; 10 ms" holds up to about 2,000/s on this hardware. Promise less than the last passing step (e.g. plan for 1,500/s) — the knee is close above 3,000/s, and a single 8-second run is one sample; real traffic is burstier.</p>
<p>2. 64 concurrent requests ÷ 2,360 req/s ≈ 27 ms per request — matching the measured p50 ≈ 26 ms. The extra workers didn't add throughput; they added waiting time.</p>
<p>3. 1,000 users × 1 page / 10 s × 3 queries = 300 queries/s on average; test well above that (peaks are often 3× average) — e.g. ramp to 900–1,200/s — with the open model.</p>
<p>4. At 4,000/s the open tool keeps sending, so requests pile up inside the driver/server and even "time since actually sent" includes queueing. In the paused closed run the tool simply stops sending — there is no request to measure during the stall. Both errors exist; only the scheduled-time measurement catches both.</p>`)}
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['p50 / p95 / p99', 'Latency that 50% / 95% / 99% of requests are at or below.'],
  ['Open / closed model', 'Requests arrive on a schedule regardless of responses / a fixed number of clients wait for each response.'],
  ['Knee (saturation point)', 'Load above which throughput stops increasing and latency grows with queue length.'],
  ['Coordinated omission', 'Under-reporting latency because the load tool stops sending while the system stalls.'],
  ['Little\'s law', 'Concurrency = throughput × time in system.'],
  ['SLO', 'Service-level objective, e.g. "p99 &lt; 20 ms at 1,500 req/s".'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Load-test with an open model and measure from the scheduled time; report p50/p95/p99 with conditions.</li>
<li>Ramp the rate to find the knee; capacity is a rate at a latency target, with margin.</li>
<li>More concurrency than the bottleneck allows only adds queueing.</li>
<li>Test with realistic data and with the background jobs that really run.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Đo tải MongoDB: đo p50, p95, p99</h2>
<p class="lead">"Nó chịu được bao nhiêu người dùng?" là câu bạn sẽ bị hỏi trước mỗi lần chạy thật, và "trên máy em thì nhanh" không phải câu trả lời. Bài này đo một truy vấn API thật, "10 đơn mới nhất của một khách" trên 1 triệu đơn, bằng một công cụ tạo tải nhỏ mà bạn đọc được trọn. Ta tìm ra điểm mà MongoDB không theo kịp nữa, và xem ba cách một phép đo tải nói dối: vòng lặp đóng, coordinated omission, và bản báo cáo bị quên đang chạy bên cạnh.</p>

<h3>Hình ảnh đời thường</h3>
<p>Một quán phở phục vụ mỗi phút một bát chẳng khó khăn gì. Đo quán bằng cách cho bốn người bạn vào, mỗi người ăn xong mới gọi bát tiếp, thì gần như chẳng biết được gì: họ không bao giờ xếp hàng. Khách thật thì tới lúc nào tuỳ họ, trưa có thể 30 người một lúc. Câu hỏi không phải "một bát nhanh cỡ nào", mà là "bao nhiêu khách mỗi phút thì hàng ngoài cửa bắt đầu dài ra", và người <em>cuối</em> hàng phải chờ thế nào.</p>
${lienKet({ khoa: 'performance-load-testing', bai: 'perf-1-1-do-tre', title: 'Khoá Performance · 1.1 — Độ trễ: p50, p95, p99 và vì sao trung bình nói dối', sub: 'giải thích sâu về phân vị — bài này áp chúng vào MongoDB' })}

<h3>1. Dàn dựng và công cụ</h3>
${lenh(K, 0)}
<p>Máy chủ là một container riêng giới hạn 2 CPU và 2 GB; máy tạo tải là một container khác với 2 CPU của nó. Công cụ tạo tải chạy chung CPU với database thì đo luôn cả chính nó. Truy vấn dùng index <code>{ khach: 1, ngay: -1 }</code> của Chương 4, nên mỗi request là một lần tra index lấy 10 tài liệu.</p>
${lenh(K, 1)}
<p>Trái tim của <code>tai.mjs</code>: ở <strong>mô hình mở</strong>, request thứ <em>i</em> được hẹn giờ ở <code>t0 + i/tốc độ</code> và được gửi đúng lúc đó, dù các request trước đã xong hay chưa, giống người dùng thật. Độ trễ đo từ thời điểm <em>hẹn</em>, nên nếu chính công cụ bị tụt lại, phần chậm đó vẫn được tính. Cột <code>trễ-ngây-thơ</code> đo từ lúc request thật sự rời đi, như nhiều công cụ vẫn làm.</p>

<h3>2. Tăng dần tải và tìm điểm gãy</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Dưới điểm gãy</span><span class="lz-t">thông lượng = tốc độ gửi</span><span class="lz-d">500–3.000/s: p99 khoảng 4 → 12 ms</span></div>
  <div class="lz-step"><span class="lz-k">Tại điểm gãy</span><span class="lz-t">CPU / vé thực thi bận kín</span><span class="lz-d">độ trễ bắt đầu tăng nhanh hơn</span></div>
  <div class="lz-step"><span class="lz-k">Trên điểm gãy</span><span class="lz-t">tới nhanh hơn xử lý</span><span class="lz-d">4.000/s: kẹt ~2.500/s, hàng đợi dài ra, p99 tính bằng giây</span></div>
</div>
${lenh(K, 2)}
${lenh(K, 3)}
<p>Đọc bảng từ trên xuống. Từ 500 tới 3.000 request mỗi giây, thông lượng bằng đúng tốc độ gửi, và p99 tăng chậm (khoảng 4 → 12 ms): hệ thống theo kịp. Tới 4.000/s thì không nữa. Thông lượng kẹt quanh 2.500/s, và vì request tới nhanh hơn được xử lý, hàng đợi dài ra suốt lượt đo: p50 vọt lên hơn 2 giây, p99 khoảng 4,5 giây. Đó là <strong>điểm gãy</strong>: dưới nó độ trễ phẳng, trên nó độ trễ chỉ bị giới hạn bởi việc bạn đo lâu bao nhiêu. Năng lực không phải "4.000/s", mà là "khoảng 3.000/s với p99 dưới ~12 ms" trên phần cứng này.</p>
${lenh(K, 4)}
<p>Vì sao bão hoà ở đó? Container có 2 CPU, trong khi mongod nhìn thấy cả 12 lõi của máy, và nó giới hạn số thao tác chạy đồng thời trong bộ máy lưu trữ bằng vé thực thi (ở đây chỉ vài vé đọc, Bài 10.2). CPU là nút cổ chai: mỗi request tốn vài micro giây CPU, và 2 CPU chỉ làm được chừng ấy mỗi giây.</p>

<h3>3. Mô hình đóng: vì sao "thêm luồng" không phải lời giải</h3>
${lenh(K, 5)}
${lenh(K, 6)}
<p>Ở <strong>mô hình đóng</strong>, một số "người dùng" cố định, mỗi người gửi một request, chờ trả lời rồi mới gửi tiếp. Bốn người đẩy được khoảng 3.500 req/s với p99 ~4,5 ms, hơn cả giới hạn của phép đo mở, vì vòng lặp đóng không bao giờ để hàng đợi hình thành: nó chậm lại theo máy chủ. 64 người thì thông lượng <em>thấp hơn</em> (2.360/s), và mọi request giờ chờ ~26 ms ở trung vị. Phần đồng thời dư ra chỉ đi xếp hàng trong pool, ở vé thực thi và trên 2 CPU. Ở dự án thật, đây là ticket "tăng gấp đôi thread pool mà lại chậm hơn".</p>
${lienKet({ khoa: 'performance-load-testing', bai: 'perf-2-2-mo-dong', title: 'Khoá Performance · 2.2 — Mô hình tải mở vs đóng', sub: 'mô hình nào giống người dùng của bạn' })}
${lienKet({ khoa: 'performance-load-testing', bai: 'perf-8-4-pool', title: 'Khoá Performance · 8.4 — Chọn cỡ connection pool bằng phép đo', sub: 'cùng đường cong "pool to hơn, chậm hơn", đo thật' })}

<h3>4. Coordinated omission, đo thật</h3>
${lenh(K, 7)}
${lenh(K, 8)}
<p>Sau sáu giây của mỗi lượt, máy chủ bị đóng băng 2 giây bằng <code>docker pause</code>, giống hệt một lần GC dài, một ổ đĩa bị treo hay một lần di chuyển máy ảo. Lượt đóng báo p99 ≈ 4,6 ms. Bốn người dùng của nó kẹt lại <em>chờ</em>, nên trong 2 giây đó chỉ có bốn request được đo, và chúng chìm mất trong 1% đuôi (max vẫn hiện 2.049 ms). Lượt mở giữ đúng lịch: 2.000 request mà người dùng thật lẽ ra đã gửi trong lúc đóng băng đều bị trễ, nên p95 khoảng 1,8 s và p99 khoảng 2 s. Con số đầu sẽ đi vào báo cáo ghi "p99 dưới 5 ms"; con số sau cho bạn biết cứ hai mươi khách thì một người chờ gần hai giây. Lỗi này có tên: <strong>coordinated omission</strong>. Đó là lý do công cụ đo từ thời điểm hẹn.</p>
${lienKet({ khoa: 'performance-load-testing', bai: 'perf-1-5-coordinated-omission', title: 'Khoá Performance · 1.5 — Coordinated omission và những cách phép đo nói dối', sub: 'lý thuyết và cách hiệu chỉnh kiểu HdrHistogram' })}

<h3>5. Bản báo cáo chạy bên cạnh</h3>
${lenh(K, 9)}
${lenh(K, 10)}
<p>Một <code>$group</code> trên cả collection mất khoảng 350 ms khi chạy một mình. Cho hai cái chạy liên tục trong khi API nhận 1.000 req/s, p99 của API tăng từ khoảng 4,7 ms (bậc 1.000/s ở trên) lên khoảng 7,6 ms; bản thân báo cáo cũng chậm đi. Không có gì hỏng. Nhưng nếu báo cáo nặng hơn, hoặc API gần điểm gãy hơn, đây chính là sự cố "sáng nào 9 giờ ứng dụng cũng chậm". Cách sửa thật: chạy báo cáo trên secondary với <code>readPreference: 'secondary'</code> (chấp nhận dữ liệu cũ đi một chút, Bài 7.1), xếp lịch giờ thấp điểm, hoặc tính sẵn bằng <code>$merge</code> (Bài 5.5).</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — đo tải trên database rỗng hoặc tí hon.</strong> Với 2.000 đơn, mọi thứ nằm trong cache và truy vấn nào cũng nhanh. Với 1 triệu (hay 50 triệu thật), working set, cỡ index và số lần đọc đĩa thay đổi tất cả (Bài 10.3). Hãy đo với dữ liệu cỡ production, phân bố giống thật, sinh tất định như <code>don-trieu.js</code> để hai lượt đo so được với nhau.</p>
</div>

<h3>6. Ghi kết quả ra</h3>
${ma('text', BAO_CAO)}
<p>Báo cáo đo tải thì ngắn và nêu rõ điều kiện: phần cứng và phiên bản, truy vấn, mô hình và tốc độ, mục tiêu (một SLO như "p99 dưới 20 ms ở 1.500 req/s"), điểm gãy đo được, dư địa, và rủi ro bạn đã thấy. Thiếu điều kiện thì con số vô nghĩa; thiếu mục tiêu thì không ai nói được kết quả tốt hay xấu.</p>

<h3>🕵️ Góc hacker</h3>
<p>Điểm gãy cũng là ngưỡng từ chối dịch vụ của bạn. Kẻ tấn công không cần botnet để hạ một API có điểm gãy 3.000 req/s và có một endpoint tìm kiếm tốn 350 ms mỗi lần gọi: vài chục request mỗi giây vào endpoint đắt đó là đủ (so với regex không giới hạn ở Bài 9.3). Hãy giới hạn tốc độ các endpoint đắt theo người dùng và theo IP, đặt <code>maxTimeMS</code> cho truy vấn, và đưa các endpoint đắt vào phép đo tải, chứ không chỉ các endpoint rẻ.</p>

<h3>💼 Đi làm</h3>
<p>Khách Nhật và châu Âu hay yêu cầu "báo cáo kiểm thử hiệu năng" như một sản phẩm bàn giao trước ngày chạy thật, kèm mục tiêu như "1.000 người dùng đồng thời, phản hồi dưới 2 s". Hãy đổi "người dùng đồng thời" ra request mỗi giây (số người × số request mỗi người mỗi giây), chọn mô hình mở, đo các endpoint bận nhất với dữ liệu giống thật, và báo cáo phân vị kèm điều kiện. Các công cụ như k6, Gatling hay JMeter làm cùng việc đó ở quy mô lớn. Biết chúng đo cái gì (mở hay đóng, tính từ lúc hẹn hay lúc gửi) mới giúp bạn đọc đúng báo cáo của chúng.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Sao dùng p99 mà không dùng trung bình?"</strong> — Trung bình che mất cái đuôi chậm; p99 là thứ mà cứ một trăm request lại có một cái gặp phải, tức rất nhiều người dùng mỗi phút.</li>
<li><strong>"Điểm gãy là gì, tìm thế nào?"</strong> — Mức tải mà trên đó độ trễ tăng không giới hạn vì request tới nhanh hơn tốc độ xử lý; tăng dần tải mô hình mở theo bậc và xem khi nào thông lượng thôi bám theo tốc độ gửi.</li>
<li><strong>"Coordinated omission là gì?"</strong> — Khi công cụ tạo tải chờ phản hồi chậm rồi mới gửi tiếp, nó ngừng gửi trong lúc hệ thống khựng lại và báo độ trễ thấp hơn thật; sửa bằng mô hình mở, đo từ thời điểm hẹn.</li>
<li><strong>"Tăng gấp đôi connection pool mà chậm hơn. Vì sao?"</strong> — Đồng thời nhiều hơn mức nút cổ chai (CPU, vé) phục vụ được chỉ thêm xếp hàng; đo thật 4 với 64 luồng: 3.500/s với 2.360/s.</li>
<li><strong>"Làm sao để truy vấn báo cáo không ảnh hưởng API?"</strong> — Chạy trên secondary, giờ thấp điểm, hoặc tính sẵn; và đo tải khi chúng đang chạy.</li>
</ol>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
<li>Từ bảng tăng tải, bạn sẽ cam kết năng lực bao nhiêu cho SLO "p99 dưới 10 ms", và vì sao không lấy mức cao nhất "đã qua"?</li>
<li>Ở lượt đóng 64 luồng, p50 khoảng 26 ms. Dùng định luật Little (số đồng thời = thông lượng × độ trễ) kiểm xem các con số có khớp nhau không.</li>
<li>Khách nói "1.000 người dùng đồng thời, mỗi người mở một trang mỗi 10 giây, mỗi trang gọi 3 truy vấn database". Bạn đo ở tốc độ nào?</li>
<li>Vì sao cột trễ ngây thơ ở 4.000/s trông tệ y như cột tính theo lịch, còn ở lượt đóng bị tạm dừng thì nó che mất lần khựng?</li>
</ol>
${loiGiai('Gợi ý đáp án', `<p>1. 2.000/s có p99 ≈ 6 ms và 3.000/s ≈ 12 ms, nên "p99 &lt; 10 ms" giữ được tới khoảng 2.000/s trên phần cứng này. Hãy cam kết thấp hơn bậc cuối cùng đã qua (ví dụ tính 1.500/s): điểm gãy ở ngay trên 3.000/s, và một lượt 8 giây chỉ là một mẫu; tải thật dồn cục hơn.</p>
<p>2. 64 request đồng thời ÷ 2.360 req/s ≈ 27 ms mỗi request, khớp với p50 đo được ≈ 26 ms. Các luồng thêm vào không tăng thông lượng; chúng chỉ thêm thời gian chờ.</p>
<p>3. 1.000 người × 1 trang / 10 s × 3 truy vấn = trung bình 300 truy vấn/s; đo cao hơn hẳn mức đó (đỉnh thường gấp 3 lần trung bình), ví dụ tăng dần tới 900–1.200/s, bằng mô hình mở.</p>
<p>4. Ở 4.000/s, công cụ mở vẫn tiếp tục gửi, nên request dồn lại bên trong driver/máy chủ, và ngay cả "thời gian từ lúc thật sự gửi" cũng chứa phần xếp hàng. Ở lượt đóng bị tạm dừng, công cụ đơn giản là ngừng gửi: không có request nào để đo trong lúc khựng. Cả hai lỗi đều có; chỉ đo theo thời điểm hẹn mới bắt được cả hai.</p>`)}
</div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['p50 / p95 / p99', 'Độ trễ mà 50% / 95% / 99% request bằng hoặc nhanh hơn.'],
  ['Mô hình mở / đóng', 'Request tới theo lịch bất kể phản hồi / một số client cố định chờ từng phản hồi.'],
  ['Điểm gãy (bão hoà)', 'Mức tải mà trên đó thông lượng thôi tăng và độ trễ tăng theo độ dài hàng đợi.'],
  ['Coordinated omission', 'Báo độ trễ thấp hơn thật vì công cụ ngừng gửi khi hệ thống khựng lại.'],
  ['Định luật Little', 'Số đồng thời = thông lượng × thời gian nằm trong hệ thống.'],
  ['SLO', 'Mục tiêu mức dịch vụ, ví dụ "p99 &lt; 20 ms ở 1.500 req/s".'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo tải bằng mô hình mở, đo từ thời điểm hẹn; báo p50/p95/p99 kèm điều kiện.</li>
<li>Tăng dần tốc độ để tìm điểm gãy; năng lực là một tốc độ tại một mục tiêu độ trễ, có dư địa.</li>
<li>Đồng thời nhiều hơn mức nút cổ chai cho phép chỉ thêm xếp hàng.</li>
<li>Đo với dữ liệu giống thật và với các tác vụ nền thật sự đang chạy.</li>
</ul>
</div>
`,
};
