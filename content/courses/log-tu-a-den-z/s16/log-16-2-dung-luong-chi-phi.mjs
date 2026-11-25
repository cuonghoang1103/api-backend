/**
 * 16.2 — Dung lượng và chi phí (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s16/dung-luong'] (gói log của khoá; pino 9 mức info/debug; nginx 1.27 bỏ /health + lấy mẫu 10 %; bảng giá CloudWatch Logs ap-southeast-1
 * lấy từ AWS Price List API công khai, publicationDate 2026-11-19). Số tất định dùng trong lời: 202/206 B mỗi dòng, 2,64 GB/ngày, 158890 vs 962450 byte (×6),
 * 1012 → 59 dòng, 0,70/0,35/0,03 USD. Tỉ lệ nén (21× gzip, 16× zstd) tất định vì gói log tất định.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Volume and cost: estimating GB per day, sampling, dropping noise, compression, cloud cost per GB|||Dung lượng và chi phí: ước lượng GB mỗi ngày, lấy mẫu, bỏ nhiễu, nén, giá theo GB trên cloud',
  slug: 'log-16-2-dung-luong-chi-phi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ước lượng GB log mỗi ngày từ số request × số dòng × byte/dòng đo trên log thật (202 B/dòng ⇒ 2,64 GB/ngày ở 50 req/s). Đo thật: quên tắt debug làm log nặng gấp 6 lần; nginx bỏ /health thành công và lấy mẫu 10 % request 2xx mà giữ 100 % lỗi: 1012 → 59 dòng. Giá CloudWatch Logs Singapore lấy từ API giá của AWS: nạp 0,70 USD/GB, lưu 0,03 USD/GB-tháng — nạp là khoản lớn, nên lọc ở nguồn. Cảnh báo khi dung lượng tăng bất thường.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.2</span>
<h2>How many gigabytes, and who pays</h2>
<p class="lead">"How much log do we produce?" is a question you can answer with arithmetic before anything is installed, and check with one command after. This lesson estimates, measures, cuts the noise at the source, and turns gigabytes into money with a real price list. The Observability course measures the cost per line in nanoseconds and the compression of JSON in depth (1.4, 2.5) — here we stay at the level of an operator planning a budget.</p>

<h3>The everyday picture: the water bill</h3>
<p>Water is cheap per litre, but a tap left dripping all month shows up on the bill. Debug logging left on in production is that dripping tap — and the cloud charges you for every litre that goes <em>in</em>, not only for what you keep.</p>

<h3>Step 1 — bytes per line, measured</h3>
${lenh('s16/dung-luong', 0)}
<p>An nginx combined line and a pino JSON line are both about 200 bytes. Measure your own: long URLs, user agents and stack traces change this a lot.</p>

<h3>Step 2 — the estimate</h3>
<p><strong>GB/day = requests per second × 86 400 × log lines per request × bytes per line ÷ 10⁹</strong></p>
${lenh('s16/dung-luong', 1)}
<p>50 requests/s on average (a small e-commerce site; peaks are higher but the average is what fills the disk), one access-log line plus two application lines per request: 2.64 GB of raw logs a day, 79 GB a month. Add system logs (journal, auth) — usually small — and audit logs if enabled.</p>

<h3>Step 3 — compression, once</h3>
${lenh('s16/dung-luong', 2)}
<p>Text logs compress 10–20×: on the course access log gzip gives 21× and zstd level 3 gives 16× (the log pack is repetitive; real logs are often 8–15×). Rotated files on disk and object storage should always be compressed; logrotate does it with <code>compress</code>. Most cloud log services charge on the <em>uncompressed</em> size at ingestion.</p>

<h3>Step 4 — the forgotten debug level</h3>
${ma('javascript', 's16/dung-luong/muc-log.mjs')}
${lenh('s16/dung-luong', 3)}
${lenh('s16/dung-luong', 4)}
<p>Same 1000 requests: 158 890 bytes at <code>info</code>, 962 450 bytes at <code>debug</code> — <strong>six times</strong> more, and the debug lines carry headers and SQL parameters (lesson 16.3 risks). The level must come from configuration (<code>LOG_LEVEL</code>, <code>logging.level.root</code> in Spring) with <code>info</code> as the production default, and changing it temporarily should be possible without a redeploy (Spring's <code>/actuator/loggers</code>, lesson 10.5).</p>

<h3>Step 5 — drop and sample at the source</h3>
<p>Filtering in the store is too late: you already paid for ingestion and transport. The cheapest line is the one never written. nginx can decide per request:</p>
${ma('nginx', 's16/dung-luong/nginx.conf')}
${lenh('s16/dung-luong', 6)}
${lenh('s16/dung-luong', 7)}
<p>600 health checks, 400 normal requests, 12 errors: the full log has 1012 lines, the reduced log 59 — <strong>all 12 errors</strong>, none of the health checks, and 47 of the 400 normal requests (≈ 10 %, <code>split_clients</code> hashes <code>$request_id</code>). Keep the full log locally for a day if you like (cheap disk), ship only the reduced one. Rules for sampling:</p>
<ul>
<li>Never sample errors, security events (auth, admin actions) or audit logs.</li>
<li>Sample successes, and write the rate down — "×10" when counting. A dashboard that counts sampled lines without correcting is wrong by ten times.</li>
<li>Prefer metrics for "how many requests" (the Observability course) and logs for "what happened to this one".</li>
</ul>
<p>Other sources of noise worth checking on any system you take over: health checks and readiness probes, one line per layer instead of one line per request, retries logging the same stack trace, chatty libraries at <code>info</code> (set them to <code>warn</code>).</p>

<h3>Step 6 — turn GB into money (real price list)</h3>
${lenh('s16/dung-luong', 9)}
${lenh('s16/dung-luong', 10)}
${lenh('s16/dung-luong', 11)}
<p>Amazon CloudWatch Logs in Singapore (ap-southeast-1), read from AWS's public Price List API (published 19 Nov 2026): <strong>0.70 USD per GB ingested</strong> (0.35 for the Infrequent Access class), <strong>0.03 USD per GB-month stored</strong>, first 5 GB per month free. For our 79 GB/month: about 56 USD to ingest, well under 1 USD to store. Ingestion is the bill — so reducing lines at the source is what saves money; shortening retention barely does. Grafana Cloud and Datadog also price mainly by ingested GB. Prices change: always read the current page and region.</p>

<h3>Step 7 — alert when volume jumps</h3>
<p>A sudden doubling of log volume means something: a debug flag, a retry storm, a scanner, or an attacker flooding to push evidence out (lesson 7.4 showed a journal flood erasing older boots). Two cheap checks:</p>
<ul>
<li>In Loki: <code>sum by (container) (bytes_over_time({job="docker"}[1h]))</code> compared with the same hour yesterday (<code>offset 1d</code>); alert when the ratio is &gt; 3 (Chapter 15 alerting).</li>
<li>On a single server: the morning report (16.5) prints the size of <code>/var/log</code> and compares it with the previous run.</li>
</ul>

<h3>🛡️ Attacker's corner: flooding as a weapon</h3>
<p>Two real techniques: filling logs so that rotation or a size cap deletes the lines that show the intrusion (MITRE ATT&amp;CK: Indicator Removal T1070; after the 2026 renumbering, clearing system logs is under T1685 "Disable or Modify Tools", e.g. T1685.006 for Linux/macOS), and "denial of wallet" — driving up a pay-per-GB bill with junk requests that each produce large log lines. Defences are the same as above: size caps per source, sampling of successes only, rate limits at the edge, volume alerts, and shipping security logs before anything can rotate them away.</p>

<h3>Real-world situations</h3>
<ul>
<li><strong>The first invoice shock</strong> on a cloud project is usually logs. In an outsourcing team, the customer pays it — show the estimate before go-live.</li>
<li><strong>"Turn on debug to catch the bug"</strong> on production: set a reminder, scope it to one logger or one request id, and turn it off.</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Measure bytes/line of your own project's logs and compute GB/day at your expected traffic.</li>
<li>Run <code>muc-log.mjs</code> at <code>warn</code>. How many bytes?</li>
<li>Change the nginx config to keep 100 % of requests slower than 1 s (<code>$request_time</code>) as well.</li>
</ol>
<p><strong>Pass:</strong> (1) a formula with your numbers; (2) 0 bytes — no <code>warn</code> lines exist, which is also a check that warn is used for real warnings only; (3) <code>map $request_time $cham { "~^([1-9]|[0-9]{2,})\\." 1; default 0; }</code> (quoted — the <code>{2,}</code> braces break nginx's parser otherwise), then put <code>$cham</code> first in the key of <code>$ghi</code> with a <code>~^1:</code> → 1 branch. Tested: three 2.5-second responses (<code>limit_rate 1000</code>) all appear in the reduced log.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Ingestion', 'Sending logs into a service; usually the largest cost item.'],
  ['Sampling', 'Keeping a fixed fraction of similar events; never for errors/security.'],
  ['Drop at source', 'Not writing a line at all (nginx if=, log level).'],
  ['bytes_over_time', 'LogQL: bytes of log lines in a window — volume alerts.'],
  ['Denial of wallet', 'Attack that makes you pay by generating usage (logs, requests).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>GB/day = rps × 86 400 × lines/request × bytes/line — measure bytes/line.</li>
<li>Debug in production: ×6 in our test. Level from config, info by default.</li>
<li>Drop health checks and sample successes at the source; keep 100 % of errors.</li>
<li>Cloud: ingestion (0.70 USD/GB in Singapore) dominates storage (0.03 USD/GB-month).</li>
<li>Alert on volume jumps.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.2</span>
<h2>Bao nhiêu GB, và ai trả tiền</h2>
<p class="lead">"Hệ thống mình sinh bao nhiêu log?" là câu trả lời được bằng phép nhân trước khi cài bất cứ gì, và kiểm lại bằng một lệnh sau đó. Bài này ước lượng, đo, cắt nhiễu ngay ở nguồn, và đổi GB ra tiền bằng bảng giá thật. Khoá Observability đo chi phí mỗi dòng bằng nano giây và độ nén của JSON rất kỹ (bài 1.4, 2.5) — ở đây ta đứng ở góc người vận hành lập ngân sách.</p>

<h3>Liên tưởng đời thường: hoá đơn tiền nước</h3>
<p>Nước rẻ theo từng lít, nhưng một vòi nhỏ giọt cả tháng sẽ hiện lên hoá đơn. Log debug quên tắt trên production chính là cái vòi nhỏ giọt đó — và cloud tính tiền theo từng lít <em>chảy vào</em>, không chỉ theo phần bạn giữ lại.</p>

<h3>Bước 1 — mỗi dòng bao nhiêu byte, đo thật</h3>
${lenh('s16/dung-luong', 0)}
<p>Một dòng combined của nginx và một dòng JSON của pino đều khoảng 200 byte. Hãy đo log của chính bạn: URL dài, user agent và stack trace làm con số này đổi nhiều.</p>

<h3>Bước 2 — ước lượng</h3>
<p><strong>GB/ngày = số request mỗi giây × 86 400 × số dòng log mỗi request × byte mỗi dòng ÷ 10⁹</strong></p>
${lenh('s16/dung-luong', 1)}
<p>Trung bình 50 request/giây (một web bán hàng nhỏ; giờ cao điểm cao hơn nhưng trung bình mới là thứ lấp đầy đĩa), mỗi request một dòng access log và hai dòng của ứng dụng: 2,64 GB log thô mỗi ngày, 79 GB mỗi tháng. Cộng thêm log hệ thống (journal, auth) — thường nhỏ — và audit log nếu bật.</p>

<h3>Bước 3 — nén, nói một lần</h3>
${lenh('s16/dung-luong', 2)}
<p>Log dạng chữ nén được 10–20 lần: trên access log của khoá, gzip được 21 lần và zstd mức 3 được 16 lần (gói log khá lặp lại; log thật thường 8–15 lần). Tệp đã xoay trên đĩa và trong kho đối tượng luôn phải nén; logrotate làm bằng <code>compress</code>. Phần lớn dịch vụ log trên cloud tính tiền nạp theo kích thước <em>chưa nén</em>.</p>

<h3>Bước 4 — mức debug bị bỏ quên</h3>
${ma('javascript', 's16/dung-luong/muc-log.mjs')}
${lenh('s16/dung-luong', 3)}
${lenh('s16/dung-luong', 4)}
<p>Cùng 1000 request: 158 890 byte ở mức <code>info</code>, 962 450 byte ở mức <code>debug</code> — <strong>gấp sáu lần</strong>, và các dòng debug mang theo header và tham số SQL (rủi ro của bài 16.3). Mức log phải lấy từ cấu hình (<code>LOG_LEVEL</code>, <code>logging.level.root</code> trong Spring) với mặc định production là <code>info</code>, và đổi tạm phải làm được mà không cần deploy lại (<code>/actuator/loggers</code> của Spring, bài 10.5).</p>

<h3>Bước 5 — bỏ và lấy mẫu ngay ở nguồn</h3>
<p>Lọc ở kho là quá muộn: bạn đã trả tiền nạp và truyền. Dòng rẻ nhất là dòng không bao giờ được ghi. nginx có thể quyết định cho từng request:</p>
${ma('nginx', 's16/dung-luong/nginx.conf')}
${lenh('s16/dung-luong', 6)}
${lenh('s16/dung-luong', 7)}
<p>600 lần kiểm sức khoẻ, 400 request bình thường, 12 lỗi: log đầy đủ có 1012 dòng, log rút gọn 59 dòng — <strong>đủ cả 12 lỗi</strong>, không dòng /health nào, và 47 trên 400 request bình thường (≈ 10 %, <code>split_clients</code> băm <code>$request_id</code>). Muốn thì giữ log đầy đủ tại chỗ một ngày (đĩa rẻ), chỉ gửi bản rút gọn đi. Luật lấy mẫu:</p>
<ul>
<li>Không bao giờ lấy mẫu lỗi, sự kiện bảo mật (đăng nhập, thao tác quản trị) hay audit log.</li>
<li>Chỉ lấy mẫu request thành công, và ghi lại tỉ lệ — "×10" khi đếm. Bảng theo dõi đếm dòng đã lấy mẫu mà không nhân lại sẽ sai mười lần.</li>
<li>Câu "có bao nhiêu request" nên trả lời bằng metric (khoá Observability); log để trả lời "chuyện gì đã xảy ra với request này".</li>
</ul>
<p>Những nguồn nhiễu khác đáng kiểm trên mọi hệ thống bạn tiếp quản: health check và readiness probe, mỗi tầng một dòng thay vì mỗi request một dòng, retry ghi đi ghi lại cùng một stack trace, thư viện nói nhiều ở mức <code>info</code> (đặt chúng về <code>warn</code>).</p>

<h3>Bước 6 — đổi GB ra tiền (bảng giá thật)</h3>
${lenh('s16/dung-luong', 9)}
${lenh('s16/dung-luong', 10)}
${lenh('s16/dung-luong', 11)}
<p>Amazon CloudWatch Logs ở Singapore (ap-southeast-1), đọc từ Price List API công khai của AWS (công bố 19/11/2026): <strong>0,70 USD mỗi GB nạp vào</strong> (0,35 USD với lớp Infrequent Access), <strong>0,03 USD mỗi GB-tháng lưu</strong>, 5 GB đầu mỗi tháng miễn phí. Với 79 GB/tháng của ta: khoảng 56 USD tiền nạp, chưa tới 1 USD tiền lưu. Tiền nạp mới là hoá đơn — nên bớt dòng ở nguồn mới tiết kiệm; rút ngắn thời gian lưu gần như không. Grafana Cloud và Datadog cũng tính chủ yếu theo GB nạp. Giá thay đổi: luôn đọc trang giá hiện tại và đúng vùng.</p>

<h3>Bước 7 — cảnh báo khi dung lượng nhảy vọt</h3>
<p>Dung lượng log đột ngột gấp đôi luôn có nghĩa: một cờ debug, một cơn bão retry, một kẻ quét, hoặc kẻ tấn công làm ngập log để đẩy bằng chứng ra ngoài (bài 7.4 đã cho thấy ngập journal xoá sạch các lần khởi động cũ). Hai cách kiểm rẻ:</p>
<ul>
<li>Trong Loki: <code>sum by (container) (bytes_over_time({job="docker"}[1h]))</code> so với cùng giờ hôm qua (<code>offset 1d</code>); báo khi tỉ lệ &gt; 3 (cảnh báo ở Chương 15).</li>
<li>Trên một máy chủ: báo cáo buổi sáng (16.5) in dung lượng <code>/var/log</code> và so với lần chạy trước.</li>
</ul>

<h3>🛡️ Góc hacker: dùng ngập log làm vũ khí</h3>
<p>Hai kỹ thuật có thật: làm đầy log để cơ chế xoay hoặc trần dung lượng tự xoá những dòng ghi lại vụ đột nhập (MITRE ATT&amp;CK: xoá dấu vết T1070; sau đợt đánh số lại 2026, xoá log hệ thống nằm ở T1685 "Disable or Modify Tools", vd T1685.006 cho Linux/macOS), và "denial of wallet" — đẩy hoá đơn tính theo GB lên bằng request rác mà mỗi cái sinh ra dòng log lớn. Cách phòng giống hệt phía trên: trần dung lượng cho từng nguồn, chỉ lấy mẫu request thành công, giới hạn tốc độ ở biên, cảnh báo dung lượng, và gửi log bảo mật đi trước khi bất cứ thứ gì kịp xoay mất chúng.</p>

<h3>Tình huống đi làm thật</h3>
<ul>
<li><strong>Cú sốc hoá đơn đầu tiên</strong> của dự án cloud thường là log. Trong đội outsourcing, khách hàng là người trả — đưa bản ước lượng cho họ trước khi go-live.</li>
<li><strong>"Bật debug để bắt lỗi"</strong> trên production: đặt nhắc giờ tắt, chỉ bật cho một logger hoặc một request id, rồi tắt.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Đo byte/dòng của log dự án bạn và tính GB/ngày theo lưu lượng dự kiến.</li>
<li>Chạy <code>muc-log.mjs</code> ở mức <code>warn</code>. Bao nhiêu byte?</li>
<li>Sửa cấu hình nginx để giữ thêm 100 % request chậm hơn 1 giây (<code>$request_time</code>).</li>
</ol>
<p><strong>Đạt khi:</strong> (1) một công thức với số của bạn; (2) 0 byte — không có dòng <code>warn</code> nào, đó cũng là cách kiểm rằng warn chỉ dùng cho cảnh báo thật; (3) <code>map $request_time $cham { "~^([1-9]|[0-9]{2,})\\." 1; default 0; }</code> (phải có nháy kép — dấu <code>{2,}</code> làm nginx đọc sai nếu không), rồi đặt <code>$cham</code> lên đầu khoá của <code>$ghi</code> với nhánh <code>~^1:</code> → 1. Đã thử: ba phản hồi 2,5 giây (<code>limit_rate 1000</code>) đều có mặt trong log rút gọn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Nạp (ingestion)', 'Đưa log vào một dịch vụ; thường là khoản chi lớn nhất.'],
  ['Lấy mẫu (sampling)', 'Giữ một tỉ lệ cố định của các sự kiện giống nhau; không áp cho lỗi/bảo mật.'],
  ['Bỏ ở nguồn', 'Không ghi dòng đó ngay từ đầu (if= của nginx, mức log).'],
  ['bytes_over_time', 'LogQL: tổng byte của các dòng trong một khung — dùng cảnh báo dung lượng.'],
  ['Denial of wallet', 'Tấn công bắt bạn trả tiền bằng cách sinh ra lượng dùng (log, request).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>GB/ngày = rps × 86 400 × dòng/request × byte/dòng — byte/dòng phải đo.</li>
<li>Debug trên production: gấp 6 lần trong phép thử của ta. Mức log lấy từ cấu hình, mặc định info.</li>
<li>Bỏ health check và lấy mẫu request thành công ngay ở nguồn; giữ 100 % lỗi.</li>
<li>Cloud: tiền nạp (0,70 USD/GB ở Singapore) lớn hơn hẳn tiền lưu (0,03 USD/GB-tháng).</li>
<li>Cảnh báo khi dung lượng nhảy vọt.</li>
</ul>
${nguon('💲', 'Amazon CloudWatch — Pricing', 'Logs: giá nạp (Standard / Infrequent Access) và lưu theo vùng', 'https://aws.amazon.com/cloudwatch/pricing/')}
${nguon('📘', 'nginx — ngx_http_log_module', 'access_log … if=, log_format', 'https://nginx.org/en/docs/http/ngx_http_log_module.html')}
${nguon('📘', 'nginx — ngx_http_split_clients_module', 'Chia request theo tỉ lệ bằng băm (lấy mẫu)', 'https://nginx.org/en/docs/http/ngx_http_split_clients_module.html')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-1-4-chi-phi-that', title: 'Observability 1.4 — Một dòng log thật sự tốn bao nhiêu', sub: 'Đo nano giây và byte mỗi dòng', cta: 'Mở bài' })}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-2-5-luu-tru', title: 'Observability 2.5 — Giữ bao lâu, và cái đó tốn bao nhiêu', sub: 'Nén 12,8×, phân bậc, health check chiếm phần lớn log', cta: 'Mở bài' })}
</div>
`,
};
