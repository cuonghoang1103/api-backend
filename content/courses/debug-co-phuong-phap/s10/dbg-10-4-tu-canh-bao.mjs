/**
 * 10.4 — Từ cảnh báo tới nguyên nhân trên một hệ thống thật — học tiếp ở đâu (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: Docker Compose (nginx 1.27 + 2 bản API Node 22 + pg 8.23 + PostgreSQL 16), một bản bị hạ DB_POOL 10 → 2 —
 * scratchpad/dbg/lab/ch10/node/c104 (c104.sh, o-104.txt).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { API104, COMPOSE104, C104_SH } from './_ma-10.mjs';
import { C104 } from './_ra-10.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;
const chiTiet = (tom, noiDung) => `<details><summary>${tom}</summary>${noiDung}</details>`;

const TIN_DAU_EN = ma(`[INCIDENT?] LabFlow API — p95 latency > 300 ms since ~08:17 (UTC+7, 01:17Z) (alert ChamCao)
Impact: ~1 in 20 requests slow (≈ 0.3 s), no errors yet. All routes.
Scope so far: only instance api-b (api-a p95 = 38 ms). Started 08:17, right after a config change on api-b (DB_POOL 10 → 2, dev-b).
Doing now: restoring DB_POOL=10 on api-b. Next update: 08:30 or sooner.
— Cường (on call, first responder)`, 'text');
const TIN_DAU_VI = ma(`[SỰ CỐ?] LabFlow API — p95 độ trễ > 300 ms từ ~08:17 (giờ VN, 01:17Z) (cảnh báo ChamCao)
Ảnh hưởng: ~1/20 request chậm (≈ 0,3 s), chưa có lỗi. Mọi route.
Phạm vi tới giờ: chỉ instance api-b (api-a p95 = 38 ms). Bắt đầu 08:17, ngay sau một thay đổi cấu hình trên api-b (DB_POOL 10 → 2, dev-b).
Đang làm: trả DB_POOL=10 cho api-b. Cập nhật kế tiếp: 08:30 hoặc sớm hơn.
— Cường (trực, người phát hiện đầu tiên)`, 'text');

const K8S_EN = `<table>
<thead><tr><th>Step</th><th>Docker Compose (this lesson)</th><th>Kubernetes (course Kubernetes ch9)</th></tr></thead>
<tbody>
<tr><td>Which instances, which version</td><td><code>docker compose ps</code>, <code>/health</code></td><td><code>kubectl get pods -o wide</code>, <code>kubectl get deploy -o wide</code></td></tr>
<tr><td>What changed</td><td>change log, <code>docker inspect</code> (env, StartedAt)</td><td><code>kubectl rollout history</code>, <code>kubectl get events --sort-by=.lastTimestamp</code></td></tr>
<tr><td>Logs, including the crashed instance</td><td><code>docker compose logs svc</code></td><td><code>kubectl logs pod --previous</code></td></tr>
<tr><td>Config of one instance</td><td><code>docker compose exec svc env</code></td><td><code>kubectl describe pod</code>, <code>kubectl get cm,secret</code> (names only)</td></tr>
<tr><td>Stop the bleeding</td><td><code>up -d svc</code> with the old value, LB weight</td><td><code>kubectl rollout undo</code>, scale, flag</td></tr>
</tbody></table>`;
const K8S_VI = `<table>
<thead><tr><th>Bước</th><th>Docker Compose (bài này)</th><th>Kubernetes (khoá Kubernetes chương 9)</th></tr></thead>
<tbody>
<tr><td>Những instance nào, phiên bản nào</td><td><code>docker compose ps</code>, <code>/health</code></td><td><code>kubectl get pods -o wide</code>, <code>kubectl get deploy -o wide</code></td></tr>
<tr><td>Cái gì đã đổi</td><td>nhật ký thay đổi, <code>docker inspect</code> (env, StartedAt)</td><td><code>kubectl rollout history</code>, <code>kubectl get events --sort-by=.lastTimestamp</code></td></tr>
<tr><td>Log, kể cả của instance đã chết</td><td><code>docker compose logs svc</code></td><td><code>kubectl logs pod --previous</code></td></tr>
<tr><td>Cấu hình của một instance</td><td><code>docker compose exec svc env</code></td><td><code>kubectl describe pod</code>, <code>kubectl get cm,secret</code> (chỉ xem tên)</td></tr>
<tr><td>Cầm máu</td><td><code>up -d svc</code> với giá trị cũ, trọng số LB</td><td><code>kubectl rollout undo</code>, scale, cờ</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('📘', 'Google SRE Book — Effective Troubleshooting', 'Triage, examine, diagnose, test; "what touched it last".', 'https://sre.google/sre-book/effective-troubleshooting/'),
  lienKet({ khoa: 'observability-monitoring', bai: 'obs-11-1-nam-phut-dau', title: 'Observability 11.1 — Năm phút đầu tiên', sub: 'Đào sâu: chẩn đoán từ cảnh báo tới nguyên nhân với log, metric, trace thật.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'kubernetes', bai: 'k8s-9-1-go-loi', title: 'Kubernetes 9.1 — Gỡ lỗi Pending, CrashLoopBackOff, ImagePullBackOff', sub: 'Cùng 5 bước, trên cụm Kubernetes.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'incident-response', bai: 'ir-4-5-dong-thoi-gian', title: 'Incident Response 4.5 — Ghi dòng thời gian ngay trong lúc xảy ra', sub: 'Bước 5 của bài này, làm đầy đủ.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'incident-response', bai: 'ir-1-4-tuyen-bo', title: 'Incident Response 1.4 — Tuyên bố sự cố sớm', sub: 'Khi nào tin nhắn đầu tiên của bạn trở thành một sự cố chính thức.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-1-3-khoanh-vung', title: 'Bài 1.3 — Khoanh vùng: chia đôi theo tầng', sub: 'Bước 3 là đúng phương pháp đó, chỉ khác công cụ.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '10.4 — From alert to cause in a real stack — where to go next|||10.4 — Từ cảnh báo tới nguyên nhân trên một hệ thống thật — học tiếp ở đâu',
  slug: 'dbg-10-4-tu-canh-bao',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Quy trình rút gọn 5 bước cho người trực đầu tiên, chạy trọn trên một hệ thống thật (nginx + 2 bản API Node + PostgreSQL): cảnh báo p95 > 300 ms sau khi ai đó "tạm" hạ DB_POOL của một máy từ 10 xuống 2. (1) Xác nhận + phạm vi: access log nginx tách theo upstream ⇒ api-b p95 301 ms, api-a 38 ms; p50 gần như không đổi nên bảng trung bình không thấy. (2) Cái gì vừa đổi: nhật ký thay đổi + env + StartedAt của từng container. (3) Khoanh tầng: log "request chậm" tách ms_cho_pool 274 / ms_sql 21 ⇒ nghẽn ở pool chứ không ở DB; pg_stat_activity 2 kết nối. (4) Cầm máu: trả cấu hình, đo lại p95 40 ms. (5) Ghi dòng thời gian. Mẫu tin nhắn đầu tiên khi bạn là người trực đầu tiên, bảng lệnh tương đương trên Kubernetes, và lộ trình học tiếp (Observability ch11, Kubernetes ch9, Incident Response).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>The first fifteen minutes, as a procedure</h2>
<p class="lead">An alert fires. You are the first person looking. You have no debugger (10.1), you have logs (10.2), you have levers (10.3). What you need now is an order of work that finds the cause without making things worse, and that someone more senior can follow from your notes when they join. This lesson runs five steps end-to-end on a real stack — nginx, two API instances, PostgreSQL — where a configuration slipped on one machine, and every number below comes from that run.</p>

<h3>An everyday picture: the electrician called to a dark building</h3>
<p>A good electrician does not start by opening walls. They ask: which rooms are dark (scope), did anyone touch anything today (change), is the problem at the meter, the breaker panel or the socket (layer), then restore power with the smallest safe action, and write down what they found for the owner. Same five questions, same order, every time — that is what makes them fast.</p>

<h3>The stack and the incident</h3>
${ma(API104)}
${chiTiet('compose.yaml — nginx, api-a, api-b, db', ma(COMPOSE104, 'yaml'))}
${chiTiet('c104.sh — the whole run, including the five steps', ma(C104_SH, 'bash'))}
<p>Each request takes one connection from the pool, runs a 20 ms query, and logs a line when it took more than 200 ms — with the time split into <em>waiting for a pool connection</em> and <em>running SQL</em>. Halfway through the run, "dev-b" lowers <code>DB_POOL</code> on api-b from 10 to 2 "to test something, will put it back". Nobody tells the person on call.</p>
${ra(C104)}

<h3>Step 1 — Confirm and scope: where, for whom, since when?</h3>
<p>First the alert itself: is it real? The load generator's windows show p95 jumping from 40 ms to ~300 ms while p50 stays around 30–50 ms. That shape — median fine, tail bad — is why dashboards of averages miss incidents. Then the access log of nginx, grouped by upstream: one upstream has p95 301 ms, the other 38 ms. Two minutes in, you know it is <em>one instance</em>, <em>all routes</em>, <em>no errors</em>. That rules out a bad query (it would hurt both), a database outage (both), a bad release (both run the same image). Scope is the cheapest step and removes most hypotheses.</p>
<p>Measure at the edge (nginx, load balancer) first: that is the time users actually wait. Lesson 10.5 shows a case where the application's own latency histogram looks perfect while users wait half a second.</p>

<h3>Step 2 — What changed?</h3>
<p>Most incidents follow a change: a deploy, a config edit, a flag, a dependency, traffic, an infrastructure event. Look at all of them, not just deploys. Here the change log has the answer, and the environment of each container confirms it: <code>api-a: DB_POOL=10</code>, <code>api-b: DB_POOL=2</code>, and api-b was restarted at 01:17:05 — seconds before the latency jumped. If the change log were empty, the same <code>docker inspect</code> would still show a container started recently with a different environment from its twin. "Two replicas that should be identical are not" is one of the most common findings in real incidents.</p>

<h3>Step 3 — Which layer is the time in?</h3>
<p>A correlation is not a cause yet. The application's slow-request lines answer it: on api-b, 1,388 slow requests, average 295 ms, of which 274 ms waiting for a pool connection and 21 ms of SQL; up to 25 requests queued for 2 connections. The database is fine — the queue is in front of it. <code>pg_stat_activity</code> agrees from the other side: api-b holds exactly 2 connections. This is the layer-by-layer bisection of lesson 1.3 with production tools: edge time (nginx) ⇒ application time ⇒ split into pool wait and SQL ⇒ database view.</p>

<h3>Step 4 — Stop the bleeding, then measure again</h3>
<p>The smallest safe action is to restore the previous value on that one instance. After it, p95 is back at 40–42 ms. Note what you did <em>not</em> do: restart the database, scale up, roll back the release. Each of those has side effects and none matches the evidence. And note that you measured after acting — "I changed it back" is not "it is fixed".</p>

<h3>Step 5 — Write it down</h3>
<p>The change log now has both lines: who changed what at 01:16:55, who restored it at 01:17:23. With the alert times from step 1 that is the timeline of a postmortem (chapter 11). Write as you go, in the incident channel or ticket — memory after a stressful hour is unreliable.</p>

<h3>If you are the first responder: the first message</h3>
<p>Before step 3 is finished, other people need to know. Send a short message in the agreed channel — what, impact, scope, what you are doing, when you will update:</p>
${TIN_DAU_EN}
<p>Facts with times, no blame (it says "a config change by dev-b", not "dev-b broke it"), and a promise of the next update. If you are an intern and unsure whether it is an incident, send it anyway and tag your lead: declaring early and cancelling is cheap; staying silent for 40 minutes is not (Incident Response 1.4).</p>

<h3>The same steps on Kubernetes</h3>
${K8S_EN}

<h3>Where to go next</h3>
<ul>
<li><strong>Observability &amp; Monitoring, chapter 11</strong> — the same diagnosis with real metrics, traces and dashboards; seven failure shapes; four real incidents.</li>
<li><strong>Kubernetes, chapter 9</strong> — Pending, CrashLoopBackOff, ImagePullBackOff, logs and metrics on a cluster.</li>
<li><strong>Incident Response</strong> — roles, communication, timeline, postmortem; this course stops at the debugging part.</li>
<li><strong>Log from A to Z, chapter 2</strong> — every <code>jq</code>, <code>grep</code>, <code>awk</code> used in this chapter, from zero.</li>
</ul>

<h3>On the job</h3>
<p>On an OJT project you are rarely the official on-call engineer, but you are often the first to notice: a test environment is slow, a customer writes in the chat "the app is very slow since this morning". The five steps still apply, scaled down: confirm with a measurement (not "it feels slow"), find the scope (which environment, which instance, which users), ask "what changed" in the team channel, do not touch anything you do not own, and write a message like the one above to your lead. Being the person who brings scope and a timeline instead of "it's broken" is noticed quickly.</p>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>c104.sh</code>. Change the incident to <code>DB_POOL_B=1</code>. Which numbers in steps 1 and 3 change, and by how much?</li>
<li>Make the incident a slow query instead: add <code>pg_sleep(0.2)</code> for one route on both instances. Run the five steps. Which step tells you it is not a pool problem?</li>
<li>Write the first message for your variant, with times from your run.</li>
<li>For your own project, write the commands of steps 1–3 into <code>RUNBOOK.md</code> (where are the edge logs? how do you see each instance's config?).</li>
</ol>
<p><strong>Done when:</strong> for a new incident you can produce scope, change, layer and timeline in under fifteen minutes, from logs and numbers only.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">First responder</span><span class="v">The first person working an alert: confirms, scopes, communicates, stabilises.</span></div>
  <div class="kv"><span class="k">Scope</span><span class="v">Which instances, routes, users, versions and since when — the cheapest hypothesis filter.</span></div>
  <div class="kv"><span class="k">Edge latency</span><span class="v">Time measured at the load balancer: what users actually wait.</span></div>
  <div class="kv"><span class="k">p95 / tail latency</span><span class="v">The slow end of the distribution; incidents show here before the median moves.</span></div>
  <div class="kv"><span class="k">Configuration drift</span><span class="v">Replicas that should be identical but are not.</span></div>
  <div class="kv"><span class="k">Incident timeline</span><span class="v">Timestamped facts and actions, written during the incident.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Five steps, always in order: confirm and scope, what changed, which layer, stop the bleeding and re-measure, write it down.</li>
<li>Scope at the edge, per instance and per version; look at p95, not the average.</li>
<li>"What changed" includes config, flags and traffic, not only deploys; compare replicas.</li>
<li>Split time by layer in your logs (pool wait vs SQL) so step 3 takes one query.</li>
<li>First message early: what, impact, scope, action, next update — facts, no blame.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Mười lăm phút đầu tiên, thành một quy trình</h2>
<p class="lead">Một cảnh báo nổ. Bạn là người đầu tiên nhìn vào. Bạn không có debugger (10.1), bạn có log (10.2), bạn có các cần gạt (10.3). Thứ bạn cần lúc này là một trình tự làm việc tìm ra nguyên nhân mà không làm mọi thứ tệ hơn, và người có kinh nghiệm hơn đọc ghi chép của bạn là theo tiếp được khi họ vào. Bài này chạy trọn năm bước trên một hệ thống thật — nginx, hai instance API, PostgreSQL — nơi một cấu hình bị lệch trên một máy, và mọi con số dưới đây đều lấy từ lần chạy đó.</p>

<h3>Liên tưởng đời thường: thợ điện được gọi tới một toà nhà mất điện</h3>
<p>Thợ điện giỏi không bắt đầu bằng việc đục tường. Họ hỏi: phòng nào tối (phạm vi), hôm nay có ai đụng vào gì không (thay đổi), hỏng ở công tơ, ở tủ cầu dao hay ở ổ cắm (tầng), rồi cấp điện lại bằng thao tác nhỏ nhất mà an toàn, và ghi lại những gì đã thấy cho chủ nhà. Cùng năm câu hỏi, cùng thứ tự, lần nào cũng vậy — chính điều đó làm họ nhanh.</p>

<h3>Hệ thống và sự cố</h3>
${ma(API104)}
${chiTiet('compose.yaml — nginx, api-a, api-b, db', ma(COMPOSE104, 'yaml'))}
${chiTiet('c104.sh — cả lần chạy, gồm năm bước', ma(C104_SH, 'bash'))}
<p>Mỗi request lấy một kết nối từ pool, chạy một truy vấn 20 ms, và ghi một dòng log khi mất hơn 200 ms — thời gian tách thành <em>chờ kết nối từ pool</em> và <em>chạy SQL</em>. Giữa chừng, "dev-b" hạ <code>DB_POOL</code> trên api-b từ 10 xuống 2 "để thử cái này, lát trả lại". Không ai báo cho người trực.</p>
${ra(C104)}

<h3>Bước 1 — Xác nhận và khoanh phạm vi: ở đâu, cho ai, từ lúc nào?</h3>
<p>Trước hết là chính cảnh báo: nó có thật không? Các cửa sổ của bộ tạo tải cho thấy p95 nhảy từ 40 ms lên ~300 ms trong khi p50 vẫn quanh 30–50 ms. Hình dạng đó — trung vị ổn, phần đuôi tệ — là lý do bảng theo dõi chỉ có trung bình bỏ lỡ sự cố. Rồi tới access log của nginx, gom theo upstream: một upstream có p95 301 ms, upstream kia 38 ms. Mới hai phút, bạn đã biết đây là <em>một instance</em>, <em>mọi route</em>, <em>không có lỗi</em>. Điều đó loại được một truy vấn tệ (sẽ hại cả hai), DB sập (cả hai), một bản phát hành lỗi (cả hai chạy cùng ảnh). Khoanh phạm vi là bước rẻ nhất và loại được nhiều giả thuyết nhất.</p>
<p>Đo ở rìa (nginx, load balancer) trước: đó là thời gian người dùng thật sự chờ. Bài 10.5 có một trường hợp histogram độ trễ của chính ứng dụng trông hoàn hảo trong khi người dùng chờ nửa giây.</p>

<h3>Bước 2 — Cái gì vừa thay đổi?</h3>
<p>Đa số sự cố đến sau một thay đổi: deploy, sửa cấu hình, cờ, thư viện, lưu lượng, một sự kiện hạ tầng. Hãy nhìn tất cả, không chỉ deploy. Ở đây nhật ký thay đổi có câu trả lời, và môi trường của từng container xác nhận: <code>api-a: DB_POOL=10</code>, <code>api-b: DB_POOL=2</code>, và api-b được khởi động lại lúc 01:17:05 — vài giây trước khi độ trễ nhảy lên. Nếu nhật ký thay đổi trống trơn, cùng lệnh <code>docker inspect</code> vẫn chỉ ra một container mới khởi động gần đây với môi trường khác anh em sinh đôi của nó. "Hai bản sao lẽ ra giống hệt mà không giống" là một trong những phát hiện hay gặp nhất ở sự cố thật.</p>

<h3>Bước 3 — Thời gian nằm ở tầng nào?</h3>
<p>Tương quan chưa phải nguyên nhân. Các dòng log request chậm của ứng dụng trả lời câu đó: trên api-b có 1.388 request chậm, trung bình 295 ms, trong đó 274 ms chờ kết nối từ pool và 21 ms chạy SQL; có lúc 25 request xếp hàng chờ 2 kết nối. Cơ sở dữ liệu vẫn ổn — hàng đợi nằm phía trước nó. <code>pg_stat_activity</code> đồng ý từ phía bên kia: api-b giữ đúng 2 kết nối. Đây là phép chia đôi theo tầng của bài 1.3 với công cụ production: thời gian ở rìa (nginx) ⇒ thời gian trong ứng dụng ⇒ tách thành chờ pool và SQL ⇒ góc nhìn của cơ sở dữ liệu.</p>

<h3>Bước 4 — Cầm máu, rồi đo lại</h3>
<p>Thao tác nhỏ nhất mà an toàn là trả lại giá trị cũ trên đúng instance đó. Sau đó p95 về lại 40–42 ms. Để ý những gì bạn <em>không</em> làm: restart cơ sở dữ liệu, tăng số máy, rollback bản phát hành. Cái nào cũng có tác dụng phụ và không cái nào khớp với bằng chứng. Và để ý rằng bạn đã đo sau khi hành động — "mình đã trả lại rồi" chưa phải là "đã hết lỗi".</p>

<h3>Bước 5 — Ghi lại</h3>
<p>Nhật ký thay đổi giờ có đủ hai dòng: ai đổi gì lúc 01:16:55, ai trả lại lúc 01:17:23. Cộng với giờ của cảnh báo ở bước 1, đó là dòng thời gian của một postmortem (chương 11). Ghi trong lúc làm, ở kênh sự cố hoặc ticket — trí nhớ sau một giờ căng thẳng không đáng tin.</p>

<h3>Nếu bạn là người phát hiện đầu tiên: tin nhắn đầu tiên</h3>
<p>Trước khi bước 3 xong, người khác cần được biết. Gửi một tin ngắn vào kênh đã thống nhất — chuyện gì, ảnh hưởng, phạm vi, bạn đang làm gì, khi nào cập nhật:</p>
${TIN_DAU_VI}
<p>Sự kiện kèm giờ, không đổ lỗi (viết "một thay đổi cấu hình của dev-b", không viết "dev-b làm hỏng"), và hẹn lần cập nhật kế tiếp. Nếu là intern và không chắc đây có phải sự cố, cứ gửi và gắn tên trưởng nhóm: tuyên bố sớm rồi huỷ thì rẻ; im lặng 40 phút thì không (Incident Response 1.4).</p>

<h3>Cùng các bước đó trên Kubernetes</h3>
${K8S_VI}

<h3>Học tiếp ở đâu</h3>
<ul>
<li><strong>Observability &amp; Monitoring, chương 11</strong> — cùng phép chẩn đoán với metric, trace và dashboard thật; bảy hình dạng hỏng hóc; bốn sự cố thật.</li>
<li><strong>Kubernetes, chương 9</strong> — Pending, CrashLoopBackOff, ImagePullBackOff, log và metric trên một cụm.</li>
<li><strong>Incident Response</strong> — vai trò, giao tiếp, dòng thời gian, postmortem; khoá này dừng ở phần gỡ lỗi.</li>
<li><strong>Log từ A đến Z, chương 2</strong> — mọi lệnh <code>jq</code>, <code>grep</code>, <code>awk</code> dùng trong chương này, từ số 0.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Ở dự án OJT bạn hiếm khi là kỹ sư trực chính thức, nhưng hay là người thấy đầu tiên: môi trường test chậm, khách hàng nhắn trong nhóm chat "từ sáng tới giờ ứng dụng chậm lắm". Năm bước vẫn áp dụng, thu nhỏ lại: xác nhận bằng một phép đo (không phải "thấy chậm chậm"), tìm phạm vi (môi trường nào, instance nào, người dùng nào), hỏi "có gì vừa đổi không" trong kênh nhóm, không đụng vào thứ không phải của mình, và gửi trưởng nhóm một tin như ở trên. Là người mang tới phạm vi và dòng thời gian thay vì "nó hỏng rồi" thì sẽ được để ý rất nhanh.</p>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>c104.sh</code>. Đổi sự cố thành <code>DB_POOL_B=1</code>. Những con số nào ở bước 1 và bước 3 thay đổi, và thay đổi bao nhiêu?</li>
<li>Đổi sự cố thành một truy vấn chậm: thêm <code>pg_sleep(0.2)</code> cho một route trên cả hai instance. Chạy năm bước. Bước nào cho bạn biết đây không phải chuyện pool?</li>
<li>Viết tin nhắn đầu tiên cho biến thể của bạn, kèm giờ lấy từ lần chạy.</li>
<li>Với dự án của bạn, ghi lệnh của bước 1–3 vào <code>RUNBOOK.md</code> (log ở rìa nằm đâu? xem cấu hình của từng instance thế nào?).</li>
</ol>
<p><strong>Đạt khi:</strong> với một sự cố mới, bạn đưa ra được phạm vi, thay đổi, tầng và dòng thời gian trong chưa đầy mười lăm phút, chỉ bằng log và số đo.</p>
</div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Người phát hiện đầu tiên</span><span class="v">Người đầu tiên xử lý một cảnh báo: xác nhận, khoanh phạm vi, thông báo, ổn định.</span></div>
  <div class="kv"><span class="k">Phạm vi</span><span class="v">Instance, route, người dùng, phiên bản nào và từ lúc nào — bộ lọc giả thuyết rẻ nhất.</span></div>
  <div class="kv"><span class="k">Độ trễ ở rìa</span><span class="v">Thời gian đo tại load balancer: cái người dùng thật sự chờ.</span></div>
  <div class="kv"><span class="k">p95 / độ trễ đuôi</span><span class="v">Đầu chậm của phân bố; sự cố hiện ra ở đây trước khi trung vị kịp đổi.</span></div>
  <div class="kv"><span class="k">Lệch cấu hình</span><span class="v">Các bản sao lẽ ra giống hệt mà không giống.</span></div>
  <div class="kv"><span class="k">Dòng thời gian sự cố</span><span class="v">Sự kiện và hành động có mốc giờ, ghi ngay trong lúc xảy ra.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Năm bước, luôn đúng thứ tự: xác nhận và khoanh phạm vi, cái gì đã đổi, tầng nào, cầm máu rồi đo lại, ghi lại.</li>
<li>Khoanh phạm vi ở rìa, theo instance và theo phiên bản; nhìn p95, đừng nhìn trung bình.</li>
<li>"Cái gì đã đổi" gồm cả cấu hình, cờ và lưu lượng, không chỉ deploy; so các bản sao với nhau.</li>
<li>Tách thời gian theo tầng ngay trong log (chờ pool và SQL) để bước 3 chỉ mất một truy vấn.</li>
<li>Gửi tin nhắn đầu tiên sớm: chuyện gì, ảnh hưởng, phạm vi, hành động, lần cập nhật kế — sự kiện, không đổ lỗi.</li>
</ul>
${NGUON}
</div>
`,
};
