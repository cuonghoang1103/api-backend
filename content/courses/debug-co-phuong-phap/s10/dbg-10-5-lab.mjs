/**
 * 10.5 — Lab: chẩn đoán một sự cố "production" chỉ bằng log và số đo (soạn 24/11/2026, máy nhà Linux).
 * Docker Compose: nginx 1.27 + 2 bản API Node 22 (không --inspect) + khách tạo tải + "Prometheus" thu nhỏ + đồng nghiệp đổi cờ.
 * Output thật bản lỗi/bản sửa — scratchpad/dbg/lab/ch10/node/lab (chuan-bi.sh, kiem.mjs, dap-an/, lab-sua.diff; o-lab10-*.txt).
 */
import { L_COMPOSE, L_CHUAN_BI, L_API, L_DU_LIEU, L_QUAN_SAT, L_KHACH, L_VAN_HANH, L_KIEM, L_DIEU_TRA, L_NHOM_CO, L_CAM_MAU, L_DIFF, L_TRA_LOI } from './_ma-10.mjs';
import { L_DIEU_TRA as RA_DIEU_TRA, L_CAM_MAU as RA_CAM_MAU, L_KIEM as RA_KIEM, L_KIEM_SAI, L_SUA } from './_ra-10.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const CHUAN_BI = ma(`# Cần: Docker (Compose v2), Node 22, jq. Mọi thứ chỉ nghe trên 127.0.0.1 của máy bạn.
cd dbg-lab/ch10/node/lab
./chuan-bi.sh                       # dựng "production": nginx (41050) + api-a + api-b + khách + quan sát + đồng nghiệp
tail -f quan-sat/canh-bao.log       # chờ ~1 phút: sẽ có cảnh báo
# thứ bạn ĐƯỢC dùng: quan-sat/ (nginx-access.log, metrics/*.prom, canh-bao.log), docker compose logs,
#                    cau-hinh/ (flags.json, nhat-ky-thay-doi.log, nhat-ky-co.log), đọc mã trong app/
# thứ KHÔNG được dùng: --inspect, attach debugger, sửa mã trong app/ khi đang chạy, restart api-a/api-b
# chấm: node kiem.mjs tra-loi.json        bản sửa: node kiem.mjs --ban-sua <thư mục app đã sửa>
# dọn:  docker compose down`, 'bash');

const TEP = `<details><summary>compose.yaml · chuan-bi.sh · the services (spoilers inside / có lời giải bên trong — open only after / chỉ mở sau khi làm)</summary>
${ma(L_COMPOSE, 'yaml')}${ma(L_CHUAN_BI, 'bash')}${ma(L_API)}${ma(L_DU_LIEU)}${ma(L_QUAN_SAT)}${ma(L_KHACH)}${ma(L_VAN_HANH)}${ma(L_KIEM)}</details>`;

const DAN_Y_EN = `<ol>
<li><strong>"A bug only happens in production. What do you do?"</strong> Do not attach a debugger or experiment on production. Scope it (who, which route, which instance/version, since when), find what changed (deploys, config, flags), read logs by request id and split time by layer, stop the bleeding with the smallest lever (flag, traffic), then reproduce on staging with the exact input and fix with a test. Collect evidence before any restart.</li>
<li><strong>"Average latency is fine but users complain. Why?"</strong> Averages hide the tail; look at p95/p99 at the edge. In Node a synchronous CPU task blocks the event loop, so requests wait before the handler starts — the app's own timer does not see that wait; event-loop lag and edge latency do.</li>
<li><strong>"How do you roll out a risky feature?"</strong> Behind a flag defaulting to off, stable bucketing, 1% → 5% → 25% → 100% with per-cohort error and latency checks, a kill switch, the decision logged with the request; remove the flag after rollout.</li>
<li><strong>"What should never be in logs?"</strong> Secrets (passwords, tokens, cookies, keys), raw PII; log request id, internal ids or hashes, intermediate values; redact as a safety net; time-box debug logs.</li>
<li><strong>"Rollback or fix forward?"</strong> Restore service first with the lever that undoes the least: flag ⇒ route away ⇒ rollback; fix forward only with a small, reviewed, tested change. Remember rollback does not undo flags or migrations.</li>
</ol>`;
const DAN_Y_VI = `<ol>
<li><strong>"Lỗi chỉ xảy ra trên production. Bạn làm gì?"</strong> Không attach debugger, không thử nghiệm trên production. Khoanh phạm vi (ai, route nào, instance/phiên bản nào, từ lúc nào), tìm cái gì đã đổi (deploy, cấu hình, cờ), đọc log theo request id và tách thời gian theo tầng, cầm máu bằng cần gạt nhỏ nhất (cờ, lưu lượng), rồi tái hiện trên staging bằng đúng input và sửa kèm test. Lấy bằng chứng trước mọi lần restart.</li>
<li><strong>"Độ trễ trung bình ổn mà người dùng vẫn kêu. Vì sao?"</strong> Trung bình giấu phần đuôi; hãy nhìn p95/p99 ở rìa. Trong Node, một việc CPU đồng bộ chặn event loop, nên request phải chờ trước khi handler kịp chạy — đồng hồ của chính ứng dụng không thấy phần chờ đó; event loop lag và độ trễ ở rìa thì thấy.</li>
<li><strong>"Triển khai một tính năng rủi ro thế nào?"</strong> Sau một cờ mặc định tắt, chia nhóm ổn định, 1% → 5% → 25% → 100% kèm kiểm lỗi và độ trễ theo từng nhóm, có công tắc ngắt, log quyết định kèm request; gỡ cờ sau khi triển khai xong.</li>
<li><strong>"Thứ gì không bao giờ được có trong log?"</strong> Bí mật (mật khẩu, token, cookie, khoá), PII thô; log request id, id nội bộ hoặc mã băm, giá trị trung gian; redact làm lưới an toàn; log debug phải có hạn giờ.</li>
<li><strong>"Rollback hay sửa tiến tới?"</strong> Khôi phục dịch vụ trước bằng cần gạt gỡ ít nhất: cờ ⇒ rút lưu lượng ⇒ rollback; chỉ sửa tiến tới khi thay đổi nhỏ, đã review, có test. Nhớ rằng rollback không gỡ cờ hay migration.</li>
</ol>`;

const DAP_AN = `<details><summary>The investigation, step by step (real output) / Cuộc điều tra, từng bước (output thật)</summary>
${ma(L_DIEU_TRA, 'bash')}
${ma(L_NHOM_CO)}
${ra(RA_DIEU_TRA)}
<p>EN: (1) The alert started at 01:27:04, one window after 01:26:59 where everything was normal. (2) The deploy of 2.5.0 was at 01:26:17 — forty seconds of healthy traffic followed it — but the flag <code>xuat-ical</code> went from 0% to 25% at 01:26:58. The cause is the flag change, not the deploy. (3) After that moment <code>/lich/ical</code> has 422 errors, and <em>every</em> route is slow at p95 (~250–310 ms) — before the change p95 was 1 ms. (4) All 500s are one TypeError at <code>api.mjs:40</code>: <code>d.phong.ten</code> with <code>phong = null</code>. (5) All 6 students who got a 500 are inside the flag's 25%: the new code path, plus bookings made online before a room is assigned. (6) The decisive comparison: the app's own histogram says <em>all</em> /phong requests on api-a finished under 250 ms, nginx says 822 of 8,564 took longer, and <code>nodejs_eventloop_lag_p99_ms</code> is 184. The time is spent waiting for the event loop, outside the handler: <code>pbkdf2Sync</code> with 200,000 iterations per calendar event blocks the only JavaScript thread. (7) A <code>/phong</code> request — no iCal involved — that took 264 ms is the proof that the feature hurts everyone on the instance.</p>
<p>VI: (1) Cảnh báo bắt đầu lúc 01:27:04, ngay sau cửa sổ 01:26:59 còn bình thường. (2) Deploy 2.5.0 lúc 01:26:17 — sau đó còn bốn mươi giây lưu lượng khoẻ mạnh — còn cờ <code>xuat-ical</code> đi từ 0% lên 25% lúc 01:26:58. Nguyên nhân là lần đổi cờ, không phải lần deploy. (3) Sau thời điểm đó <code>/lich/ical</code> có 422 lỗi, và <em>mọi</em> route đều chậm ở p95 (~250–310 ms) — trước khi đổi, p95 là 1 ms. (4) Mọi lỗi 500 là cùng một TypeError tại <code>api.mjs:40</code>: <code>d.phong.ten</code> với <code>phong = null</code>. (5) Cả 6 sinh viên gặp 500 đều nằm trong 25% của cờ: đường mã mới, cộng với các lượt đặt online trước khi được xếp phòng. (6) Phép so quyết định: histogram của chính ứng dụng nói <em>mọi</em> request /phong trên api-a xong dưới 250 ms, nginx nói 822 trên 8.564 request lâu hơn thế, và <code>nodejs_eventloop_lag_p99_ms</code> là 184. Thời gian bị tiêu vào việc chờ event loop, ngoài handler: <code>pbkdf2Sync</code> 200.000 vòng cho mỗi sự kiện lịch chặn luồng JavaScript duy nhất. (7) Một request <code>/phong</code> — không dính gì tới iCal — mất 264 ms là bằng chứng tính năng làm hại mọi người trên instance đó.</p>
</details>
<details><summary>Stop the bleeding and the grader / Cầm máu và bộ chấm</summary>
${ma(L_CAM_MAU, 'bash')}
${ra(RA_CAM_MAU)}
<p>EN: one kill switch; the next measurement window already drops to 0.33% errors and the one after that to zero, with throughput back from ~450 to ~1,460 requests per 5 s. No deploy, no restart. (Rolling back to 2.4.3 would also have stopped it — in minutes instead of seconds, and taking the spelling fixes of 2.5.0 with it.)</p>
<p>VI: một công tắc ngắt; cửa sổ đo kế tiếp đã giảm còn 0,33% lỗi và cửa sổ sau nữa về không, thông lượng trở lại từ ~450 lên ~1.460 request mỗi 5 s. Không deploy, không restart. (Rollback về 2.4.3 cũng dừng được — nhưng mất vài phút thay vì vài giây, và kéo theo luôn các sửa chính tả của 2.5.0.)</p>
${ma(L_TRA_LOI, 'json')}
${ra(RA_KIEM)}
${ra(L_KIEM_SAI)}
</details>
<details><summary>The fix (diff) and proof / Bản sửa (diff) và bằng chứng</summary>
${ma(L_DIFF, 'diff')}
${ra(L_SUA)}
<p>EN: a calendar UID only needs to be stable and unique — a plain SHA-256 is microseconds; <code>pbkdf2</code> is deliberately slow (it exists to make password guessing expensive), and its <code>Sync</code> form blocks the event loop. A booking with no room yet is valid data, so the template handles it. With the flag at 100%, the fixed version serves all 300 students with zero errors and keeps /phong at p95 6 ms.</p>
<p>VI: UID của sự kiện lịch chỉ cần ổn định và không trùng — SHA-256 thường mất vài micro giây; <code>pbkdf2</code> cố tình chậm (nó sinh ra để làm việc đoán mật khẩu trở nên đắt), và bản <code>Sync</code> của nó chặn event loop. Lượt đặt chưa có phòng là dữ liệu hợp lệ, nên mẫu lịch phải xử lý nó. Với cờ ở 100%, bản sửa phục vụ cả 300 sinh viên không lỗi nào và giữ /phong ở p95 6 ms.</p>
</details>`;

export default {
  title: '10.5 — Lab: Diagnose a "production" incident from logs and metrics only|||10.5 — Lab: Chẩn đoán một sự cố "production" chỉ bằng log và số đo',
  slug: 'dbg-10-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một "production" thu nhỏ chạy thật bằng Docker Compose: nginx + hai bản API 2.5.0 không mở debugger, lưu lượng của 300 sinh viên, bộ thu /metrics kiểu Prometheus + cảnh báo, và một đồng nghiệp tăng cờ xuat-ical lên 25% bốn mươi giây sau deploy. Cảnh báo: 5xx ~2% và >10% request chậm hơn 250 ms. Chỉ được dùng log nginx, docker compose logs, metrics, nhật ký thay đổi/cờ và đọc mã. Lời giải (output thật): thay đổi gây lỗi là lần tăng cờ (01:26:58), không phải deploy; 422 lỗi 500 đều là TypeError d.phong.ten với lượt đặt chưa xếp phòng, cả 6 sinh viên đều thuộc nhóm 25%; mọi route chậm vì pbkdf2Sync 200.000 vòng chặn event loop (lag p99 184 ms) — histogram của app không thấy (822/8.564 request /phong chậm ở nginx, 0 trong app). Công tắc ngắt ⇒ hết cảnh báo sau 10 giây. kiem.mjs chấm bằng chứng thật 8/8 (câu trả lời vội 3/8); bản sửa sha256 + xử lý null đạt 3/3 khi cờ 100%. Gợi ý 3 bậc, rubric 100, 5 câu phỏng vấn, mốc dự án.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lab</span>
<h2>An alert, two instances, no debugger</h2>
<p class="lead">LabFlow 2.5.0 went out this morning. A minute later the alerting system starts paging: errors above 1% and too many slow requests. You are on call. The rules of this lab are the rules of production: no <code>--inspect</code>, no attaching, no editing running code, no restarting instances to "see if it helps". You have what a real on-call engineer has — the load balancer's access log, the application logs, metrics scraped every five seconds, the change log, the flag store — and you have to deliver a cause with evidence, a stopped incident, and a fix.</p>

<h3>Rules</h3>
<ul>
<li>Allowed: everything in <code>quan-sat/</code> and <code>cau-hinh/</code>, <code>docker compose logs</code>, <code>docker compose ps</code>/<code>inspect</code>, reading <code>app/</code>, <code>jq</code>/<code>grep</code>/<code>awk</code>, running code on your own machine outside the stack.</li>
<li>Forbidden: <code>--inspect</code>, a debugger, editing <code>app/</code> while the stack runs, restarting <code>api-a</code>/<code>api-b</code>.</li>
<li>The one change you may make to "production" is through the flag store, and it must be written to <code>cau-hinh/nhat-ky-co.log</code> with time, name and incident id.</li>
<li>Time-box: 60 minutes to a cause, 15 more to a fix. Use the hints one level at a time.</li>
</ul>

<h3>Setup (5 min)</h3>
${CHUAN_BI}
${TEP}

<h3>The page (as the alerting system sent it)</h3>
<div class="callout warn">
<p><strong>🔔 LoiCao</strong> — LabFlow API 5xx &gt; 1% (5-minute window). <strong>🔔 ChamCao</strong> — &gt; 2% of requests slower than 250 ms at the load balancer. Started after today's release window. Runbook: "find scope, find change, stop the bleeding, report".</p>
</div>

<h3>Hints (open one level at a time)</h3>
<details><summary>Level 1: where to look</summary><p>Put three timestamps on one line: the deploy, every flag change, the first alert. Which one is closest to the first alert? Then group the access log by route, before and after that moment.</p></details>
<details><summary>Level 2: tools</summary><p><code>jq -s 'group_by(.uri)'</code> on <code>quan-sat/nginx-access.log</code>; <code>docker compose logs api-a api-b | grep -o '{.*' | jq -s 'group_by(.loi)'</code>; compare <code>http_request_duration_ms_bucket{le="250"}</code> with the same share at nginx; <code>nodejs_eventloop_lag_p99_ms</code>. To check who is inside a flag's percentage, import the app's own <code>co.mjs</code> — do not re-implement the hash.</p></details>
<details><summary>Level 3: the area</summary><p>Read <code>icalMoi()</code> in <code>app/api.mjs</code>. What does each event cost, and does it run on the event loop? What does <code>du-lieu.mjs</code> say about <code>phong</code>?</p></details>

<h3>What to hand in</h3>
<ol>
<li><code>tra-loi.json</code> with: <code>bat_dau</code> (ISO time the incident started), <code>co</code> (the change that caused it), <code>rid_500</code> (one failing request id), <code>rid_cham</code> (a request id of a <em>non-iCal</em> request that was slow), <code>nguyen_nhan_500</code>, <code>nguyen_nhan_cham</code>, <code>cam_mau</code>, <code>de_xuat_sua</code>. <code>node kiem.mjs tra-loi.json</code> checks it against the real logs.</li>
<li>The kill switch applied and logged; <code>kiem.mjs</code> checks that the last two measurement windows have no alert.</li>
<li>A fixed <code>app/</code> in a separate folder that passes <code>node kiem.mjs --ban-sua &lt;folder&gt;</code> with the flag at 100%.</li>
<li>A half-page incident note: timeline (times from the files), scope, cause, evidence (three commands and their output), action, follow-ups.</li>
</ol>

<h3>Rubric (100 points)</h3>
<table>
<thead><tr><th>Criterion</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Identifies the flag change (not the deploy) as the trigger, with timestamps</td><td>15</td></tr>
<tr><td>Scope: per route and before/after, from the edge log</td><td>15</td></tr>
<tr><td>Cause of the 500s with stack location and why only flagged users</td><td>15</td></tr>
<tr><td>Cause of the slowness, including why the app's histogram misses it</td><td>20</td></tr>
<tr><td>Kill switch applied, logged, recovery measured</td><td>10</td></tr>
<tr><td>Fix passes <code>--ban-sua</code>; a regression test for <code>phong = null</code></td><td>15</td></tr>
<tr><td>Incident note: clear, timed, blameless</td><td>10</td></tr>
</tbody></table>

<h3>🎤 What an interviewer will ask</h3>
${DAN_Y_EN}

<h3>🛠 Project milestone</h3>
<p>For your own project: expose an edge access log in JSON with request id and upstream, add event-loop lag (Node) or thread-pool saturation (Spring) to the metrics, put the next risky feature behind a flag with a kill switch, and write a <code>RUNBOOK.md</code> section "first 15 minutes" with the exact commands from this chapter.</p>

<h3>Answers (check only after writing yours)</h3>
${DAP_AN}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Lab</span>
<h2>Một cảnh báo, hai instance, không có debugger</h2>
<p class="lead">LabFlow 2.5.0 vừa lên sáng nay. Một phút sau hệ thống cảnh báo bắt đầu gọi: lỗi vượt 1% và quá nhiều request chậm. Bạn đang trực. Luật của lab này là luật của production: không <code>--inspect</code>, không attach, không sửa mã đang chạy, không restart instance "xem có đỡ không". Bạn có đúng những gì một kỹ sư trực thật có — access log của load balancer, log ứng dụng, số đo thu mỗi năm giây, nhật ký thay đổi, kho cờ — và phải giao được một nguyên nhân có bằng chứng, một sự cố đã dừng, và một bản sửa.</p>

<h3>Luật</h3>
<ul>
<li>Được dùng: mọi thứ trong <code>quan-sat/</code> và <code>cau-hinh/</code>, <code>docker compose logs</code>, <code>docker compose ps</code>/<code>inspect</code>, đọc <code>app/</code>, <code>jq</code>/<code>grep</code>/<code>awk</code>, chạy mã trên máy mình ở ngoài hệ thống.</li>
<li>Cấm: <code>--inspect</code>, debugger, sửa <code>app/</code> khi hệ thống đang chạy, restart <code>api-a</code>/<code>api-b</code>.</li>
<li>Thay đổi duy nhất được phép lên "production" là qua kho cờ, và phải ghi vào <code>cau-hinh/nhat-ky-co.log</code> kèm giờ, tên và mã sự cố.</li>
<li>Giới hạn giờ: 60 phút tìm ra nguyên nhân, thêm 15 phút cho bản sửa. Mở gợi ý từng bậc một.</li>
</ul>

<h3>Chuẩn bị (5 phút)</h3>
${CHUAN_BI}
${TEP}

<h3>Lời gọi (nguyên văn hệ thống cảnh báo gửi)</h3>
<div class="callout warn">
<p><strong>🔔 LoiCao</strong> — LabFlow API 5xx &gt; 1% (cửa sổ 5 phút). <strong>🔔 ChamCao</strong> — &gt; 2% request chậm hơn 250 ms ở load balancer. Bắt đầu sau khung giờ phát hành hôm nay. Runbook: "tìm phạm vi, tìm thay đổi, cầm máu, báo cáo".</p>
</div>

<h3>Gợi ý (mở từng bậc một)</h3>
<details><summary>Bậc 1: nhìn vào đâu</summary><p>Đặt ba mốc giờ lên cùng một dòng: lần deploy, mọi lần đổi cờ, cảnh báo đầu tiên. Mốc nào gần cảnh báo đầu tiên nhất? Rồi gom access log theo route, trước và sau thời điểm đó.</p></details>
<details><summary>Bậc 2: công cụ</summary><p><code>jq -s 'group_by(.uri)'</code> trên <code>quan-sat/nginx-access.log</code>; <code>docker compose logs api-a api-b | grep -o '{.*' | jq -s 'group_by(.loi)'</code>; so <code>http_request_duration_ms_bucket{le="250"}</code> với cùng tỉ lệ đó ở nginx; <code>nodejs_eventloop_lag_p99_ms</code>. Để kiểm ai nằm trong phần trăm của cờ, import chính <code>co.mjs</code> của ứng dụng — đừng tự viết lại hàm băm.</p></details>
<details><summary>Bậc 3: vùng mã</summary><p>Đọc <code>icalMoi()</code> trong <code>app/api.mjs</code>. Mỗi sự kiện tốn bao nhiêu, và nó có chạy trên event loop không? <code>du-lieu.mjs</code> nói gì về <code>phong</code>?</p></details>

<h3>Nộp gì</h3>
<ol>
<li><code>tra-loi.json</code> gồm: <code>bat_dau</code> (giờ ISO sự cố bắt đầu), <code>co</code> (thay đổi đã gây ra nó), <code>rid_500</code> (một request id bị lỗi), <code>rid_cham</code> (request id của một request <em>không phải iCal</em> mà vẫn chậm), <code>nguyen_nhan_500</code>, <code>nguyen_nhan_cham</code>, <code>cam_mau</code>, <code>de_xuat_sua</code>. <code>node kiem.mjs tra-loi.json</code> đối chiếu với log thật.</li>
<li>Công tắc ngắt đã gạt và đã ghi nhật ký; <code>kiem.mjs</code> kiểm hai cửa sổ đo gần nhất không còn cảnh báo.</li>
<li>Một bản <code>app/</code> đã sửa ở thư mục riêng, qua được <code>node kiem.mjs --ban-sua &lt;thư mục&gt;</code> với cờ 100%.</li>
<li>Nửa trang ghi chép sự cố: dòng thời gian (giờ lấy từ các tệp), phạm vi, nguyên nhân, bằng chứng (ba lệnh kèm output), hành động, việc cần làm tiếp.</li>
</ol>

<h3>Rubric (100 điểm)</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Chỉ ra lần đổi cờ (không phải lần deploy) là thứ kích hoạt, có mốc giờ</td><td>15</td></tr>
<tr><td>Phạm vi: theo route và trước/sau, lấy từ log ở rìa</td><td>15</td></tr>
<tr><td>Nguyên nhân lỗi 500, có vị trí trong stack và vì sao chỉ người trong nhóm cờ</td><td>15</td></tr>
<tr><td>Nguyên nhân chậm, kể cả vì sao histogram của ứng dụng không thấy</td><td>20</td></tr>
<tr><td>Công tắc ngắt đã gạt, đã ghi nhật ký, đã đo sự hồi phục</td><td>10</td></tr>
<tr><td>Bản sửa qua <code>--ban-sua</code>; có test hồi quy cho <code>phong = null</code></td><td>15</td></tr>
<tr><td>Ghi chép sự cố: rõ, có giờ, không đổ lỗi</td><td>10</td></tr>
</tbody></table>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
${DAN_Y_VI}

<h3>🛠 Mốc dự án</h3>
<p>Với dự án của bạn: có access log ở rìa dạng JSON kèm request id và upstream, thêm event loop lag (Node) hoặc độ bão hoà thread pool (Spring) vào metric, đưa tính năng rủi ro kế tiếp vào sau một cờ có công tắc ngắt, và viết mục "15 phút đầu tiên" trong <code>RUNBOOK.md</code> bằng đúng các lệnh của chương này.</p>

<h3>Đáp án (chỉ xem sau khi đã viết câu trả lời của mình)</h3>
${DAP_AN}
</div>
`,
};
