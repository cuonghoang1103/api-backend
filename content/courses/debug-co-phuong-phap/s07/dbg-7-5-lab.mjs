/**
 * 7.5 — Lab: Ba lỗi cơ sở dữ liệu trong ứng dụng đặt lịch (soạn 24/11/2026, máy nhà Linux).
 * Repo lab: scratchpad/dbg/lab/ch7/lab (Express 5 + Prisma 6.19.3, DB labflow_lab trên dbg-pg 127.0.0.1:45432, API 41720;
 * "staging" = qua proxy trễ tools/tre.mjs 45433), bản sửa lab-sua/ + lab-sua.diff, bộ kiểm lab/kiem.mjs, đo tools/c75-do.sh.
 * Output THẬT (o-lab7-*.txt). Đáp án che bằng <details>.
 */
import { SCHEMA, SEED, L_APP, L_KIEM, L_CHAY, L_DIFF, TRE } from './_ma-7.mjs';
import { L_LOI_MAY, L_LOI_STG, L_MA, L_MA_LOG, L_SUA, L_DO } from './_ra-7.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const TEP = (en) => `<details><summary>${en ? 'Lab files (copy into lab/ — or take them from the course repo folder ch7/lab)' : 'Các tệp của lab (chép vào lab/ — hoặc lấy ở thư mục ch7/lab của repo khoá)'}</summary>
<p><code>lab/src/app.ts</code></p>${ma(L_APP, 'ts')}
<p><code>lab/prisma/schema.prisma</code></p>${ma(SCHEMA, 'prisma')}
<p><code>lab/prisma/seed.sql</code></p>${ma(SEED, 'sql')}
<p><code>lab/chay.sh</code> + <code>tools/tre.mjs</code></p>${ma(L_CHAY, 'bash')}${ma(TRE)}
</details>`;

const CHUAN_BI = ma(`docker run -d --name dbg-pg -e POSTGRES_PASSWORD=dbg -e POSTGRES_DB=labflow -p 127.0.0.1:45432:5432 postgres:16 \\
  -c shared_preload_libraries=pg_stat_statements -c log_lock_waits=on -c deadlock_timeout=1s
docker exec dbg-pg psql -U postgres -c "create database labflow_lab"
cd lab && npm install
DATABASE_URL=postgresql://postgres:dbg@127.0.0.1:45432/labflow_lab npx prisma db push
docker exec -i dbg-pg psql -U postgres -d labflow_lab &lt; prisma/seed.sql
./chay.sh            # máy dev: DB cùng máy
./chay.sh staging    # như staging: DB qua mạng, trễ ~2 ms mỗi vòng hỏi–đáp
node kiem.mjs        # bộ kiểm: ĐẠT / CHƯA ĐẠT cho từng ticket`, 'bash');

const DAN_Y_EN = `<ol>
<li><strong>N+1:</strong> definition in one sentence; how you detect it (query log with the same statement repeating, a per-request counter, <code>pg_stat_statements</code> calls ratio); why it hides on localhost; fixes (include/JOIN FETCH/entity graph/batch fetching) and a test that asserts the query count.</li>
<li><strong>Wrong totals:</strong> method first — independent count per child table, then one parent row's raw joined rows; name fan-out; fix by aggregating before joining; mention NULL in arithmetic as the second suspect.</li>
<li><strong>Hang:</strong> <code>pg_stat_activity</code> + <code>pg_blocking_pids</code>; idle in transaction vs active; ask before terminate; prevention: short transactions, no network calls inside, <code>lock_timeout</code>, <code>idle_in_transaction_session_timeout</code>, <code>application_name</code>.</li>
<li><strong>External call inside a transaction:</strong> it holds locks and a pooled connection for the duration of the call; the timeout of the transaction can fire after work is done; use an outbox (write the intent in the same transaction, send after commit, retry idempotently).</li>
<li><strong>Index on a foreign key:</strong> PostgreSQL and Prisma do not create it; show how you would verify with <code>EXPLAIN (ANALYZE, BUFFERS)</code> on production-sized data, and when you would <em>not</em> add one (write-heavy table, low selectivity).</li>
</ol>`;

const DAN_Y_VI = `<ol>
<li><strong>N+1:</strong> định nghĩa trong một câu; cách phát hiện (log truy vấn có cùng một câu lặp lại, bộ đếm theo request, tỉ lệ calls trong <code>pg_stat_statements</code>); vì sao nó trốn được trên localhost; cách sửa (include/JOIN FETCH/entity graph/batch fetching) và một test khẳng định số truy vấn.</li>
<li><strong>Tổng sai:</strong> phương pháp trước — đếm độc lập từng bảng con, rồi xem các dòng JOIN thô của một dòng cha; gọi tên fan-out; sửa bằng gộp trước khi JOIN; nhắc NULL trong phép tính là nghi phạm thứ hai.</li>
<li><strong>Treo:</strong> <code>pg_stat_activity</code> + <code>pg_blocking_pids</code>; idle in transaction khác active thế nào; hỏi trước khi terminate; phòng ngừa: transaction ngắn, không gọi mạng bên trong, <code>lock_timeout</code>, <code>idle_in_transaction_session_timeout</code>, <code>application_name</code>.</li>
<li><strong>Gọi dịch vụ ngoài trong transaction:</strong> nó giữ khoá và một kết nối của pool suốt thời gian gọi; timeout của transaction có thể nổ sau khi việc đã xong; dùng outbox (ghi ý định trong cùng transaction, gửi sau commit, thử lại một cách idempotent).</li>
<li><strong>Index trên khoá ngoại:</strong> PostgreSQL và Prisma không tự tạo; nói cách bạn kiểm bằng <code>EXPLAIN (ANALYZE, BUFFERS)</code> trên dữ liệu cỡ production, và khi nào bạn <em>không</em> thêm (bảng ghi nhiều, độ chọn lọc thấp).</li>
</ol>`;

export default {
  title: '7.5 — Lab: Three database bugs in the booking app|||7.5 — Lab: Ba lỗi cơ sở dữ liệu trong ứng dụng đặt lịch',
  slug: 'dbg-7-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Repo LabFlow (Express 5 + Prisma 6.19 + PostgreSQL 16) với ba ticket thật kiểu outsourcing: LAB-701 trang Phòng 51 truy vấn (31 ms máy dev, 155 ms staging), LAB-702 báo cáo doanh thu 333 triệu so với sổ kế toán 264 triệu, LAB-703 năm người bấm Duyệt cùng phòng ⇒ hai lượt lỗi P2028 sau 5 s vì gửi email trong transaction đang giữ FOR UPDATE — và có lần lỗi 500 mà DB vẫn ghi đã duyệt. Bộ kiểm kiem.mjs so với phép đếm độc lập; gợi ý 3 bậc, rubric 100 điểm, 5 câu phỏng vấn, đáp án = output thật bản lỗi/bản sửa (1 truy vấn, 264 triệu, 5/5 trong 1,6 s) + diff.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lab</span>
<h2>Three tickets from the booking app</h2>
<p class="lead">You join the LabFlow team. The client's QA has filed three database tickets this week. None of them has a stack trace. Your job is the method of this chapter: see the real SQL, compare with an independent number, ask the database who waits for whom — then fix, and prove the fix with numbers.</p>

<h3>Rules</h3>
<ul>
<li>Reproduce each ticket <strong>before</strong> changing code, and write down the evidence (query count, the two numbers, the blocking pid).</li>
<li>One change at a time; re-run <code>node kiem.mjs</code> after each.</li>
<li>Do not "fix" the checker, the seed, or the timeouts. Do not raise Prisma's transaction timeout as the fix for LAB-703.</li>
<li>AI may explain an error message or a plan; it may not write the fix.</li>
</ul>

<h3>Setup (10 min)</h3>
${CHUAN_BI}
${TEP(true)}
<p><code>kiem.mjs</code> computes every expected value <em>independently</em> with SQL through the <code>pg</code> driver (not through the app), measures the query count from the <code>X-So-Truy-Van</code> header, and for LAB-703 fires five approvals at once and then reads the real state from the database.</p>

<h3>The three tickets (as QA wrote them)</h3>
<div class="callout">
<p><strong>LAB-701 — Màn hình Phòng chậm trên staging.</strong> "Trên máy em mở /phong?toa=Alpha nhanh, lên staging thì lâu thấy rõ, giờ cao điểm còn lâu hơn. Dữ liệu hiển thị đúng." Priority: Medium.</p>
<p><strong>LAB-702 — Báo cáo doanh thu tháng 11 lệch so với kế toán.</strong> "Kế toán cộng tay từ bảng thanh toán và bảng thuê thiết bị được 264.000.000 đ, màn hình báo cáo ra 333.000.000 đ. Toà nào cũng lệch." Priority: High.</p>
<p><strong>LAB-703 — Bấm Duyệt quay mãi rồi báo lỗi.</strong> "Sáng thứ Hai, 5 giáo vụ cùng duyệt lịch phòng Lab 104, hai người bị lỗi sau khoảng 5–6 giây. Có người F5 thì thấy lịch đã duyệt rồi, có người thì chưa." Priority: High.</p>
</div>

<h3>Hints (open one level at a time)</h3>
<details><summary>LAB-701 — level 1 / 2 / 3</summary><p>1: Why would the same code be fast on your laptop and slow on staging, with correct data? What is different between the two (lesson 7.1, the proxy)? 2: Look at the <code>X-So-Truy-Van</code> header, then run with <code>LOG_SQL=1</code>. 3: The loop over rooms makes two queries per room. Prisma can count with a filter (<code>_count: { select: { datLich: { where } } }</code>) and fetch "the latest one" (<code>take: 1</code>) inside one <code>include</code>.</p></details>
<details><summary>LAB-702 — level 1 / 2 / 3</summary><p>1: Compute room money and equipment money separately, without the app. Which one is off, and by what factor? 2: Take one booking that has both payments and equipment and run the report's FROM/JOIN part without GROUP BY (lesson 7.2). 3: Aggregate each child table to one row per booking before joining.</p></details>
<details><summary>LAB-703 — level 1 / 2 / 3</summary><p>1: While the five approvals run, query <code>pg_stat_activity</code> with <code>pg_blocking_pids</code> (lesson 7.4). Who waits for whom, and for how long each? 2: How long does the transaction keep the room locked? What runs between <code>FOR UPDATE</code> and the end of the transaction? 3: The email does not need the lock. Commit first, then send (or write an outbox row inside the transaction). Read Prisma's P2028 message carefully: which timeout fired?</p></details>

<h3>What to hand in</h3>
<ul>
<li>For each ticket a debugging log (symptom → evidence → hypothesis → test → fix), with the numbers.</li>
<li>The diff, and <code>node kiem.mjs</code> output on the machine and on staging: three lines <code>ĐẠT</code>.</li>
<li>For LAB-702 a reconciliation table: report vs independent count per building, difference, and one booking that explains it.</li>
<li>For LAB-703 one paragraph answering QA's last sentence: why could a user see "error" while the booking was approved?</li>
</ul>
<details><summary>kiem.mjs — the automated check we used</summary>${ma(L_KIEM)}</details>

<h3>Rubric (100 points)</h3>
<table>
<thead><tr><th>Item</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Each ticket reproduced with evidence before the fix (3 × 10)</td><td>30</td></tr>
<tr><td>LAB-701: ≤ 3 queries, same data, timing on staging before/after</td><td>15</td></tr>
<tr><td>LAB-702: correct totals + reconciliation table explaining the difference</td><td>20</td></tr>
<tr><td>LAB-703: lock holder identified from <code>pg_stat_activity</code>, external call out of the transaction, 5/5 in under 2.5 s</td><td>20</td></tr>
<tr><td>LAB-703: the "error but approved" case explained correctly</td><td>5</td></tr>
<tr><td>Logs readable by a teammate; one change at a time</td><td>10</td></tr>
</tbody></table>

<h3>🎤 What an interviewer will ask</h3>
<ol>
<li>"What is the N+1 problem, and how would you find it in an app you have never seen?"</li>
<li>"A revenue report is 26% higher than accounting. Walk me through how you would investigate."</li>
<li>"An endpoint sometimes hangs for 30 seconds and then succeeds. The CPU is idle. What do you check?"</li>
<li>"Why is calling an external API inside a database transaction a bad idea? What do you do instead?"</li>
<li>"Should every foreign key have an index? How would you decide?"</li>
</ol>
<details><summary>Answer outlines</summary>${DAN_Y_EN}</details>

<h3>🛠 Project milestone</h3>
<p>In your own project (or the course capstone), add a query counter per request (header or log), enable <code>pg_stat_statements</code> on your dev database, and write one test that fails if your main list endpoint exceeds three queries. Set <code>lock_timeout</code>, <code>statement_timeout</code> and <code>application_name</code> in your connection settings. Keep the notes — the chapter 12 capstone has N+1 and deadlock bugs waiting for you.</p>

<h3>Answers (check only after writing yours)</h3>
<details><summary>Our real run on the buggy version (machine, then staging)</summary>${ra(L_LOI_MAY)}${ra(L_LOI_STG)}
<p>LAB-701: 51 queries = 1 + 2 × 25 rooms. LAB-702: 333 vs 264 million — room money inflated for bookings that rented equipment, equipment money doubled because every booking has two payments. LAB-703: the room lock is held for the whole email call (~1.5 s), so five approvals run one after another: 1.5, 3, 4.5 s… and the fourth and fifth hit Prisma's default interactive-transaction timeout of 5,000 ms.</p></details>
<details><summary>"Error, but approved": the same code, another run</summary>${ra(L_MA)}${ra(L_MA_LOG)}
<p>In 2 of our 8 runs, a request answered HTTP 500 with <code>P2028 … A commit cannot be executed on an expired transaction</code> while the database shows the booking as <code>DA_DUYET</code>. Do not trust an error from a timed-out transaction to mean "nothing happened": the client-side timeout and the database's commit race each other. This is why QA saw both cases after F5. The cure is the same as for the hang — keep the transaction short so the timeout never fires — plus idempotent retries and checking the real state before telling the user.</p></details>
<details><summary>The fix (diff), the run on the fixed version, and the timings</summary>${ma(L_DIFF, 'diff')}${ra(L_SUA)}${ra(L_DO)}
<p>LAB-701: 1 query with <code>relationLoadStrategy: 'join'</code>, 155 ms → 15 ms on staging. LAB-702: aggregate before joining. LAB-703: the transaction keeps only the check and the update; the email is sent after commit, so the five approvals overlap and all finish in ~1.6 s. A production version would write an outbox row inside the transaction and let a worker send the email with retries.</p></details>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Lab</span>
<h2>Ba ticket từ ứng dụng đặt lịch</h2>
<p class="lead">Bạn vào nhóm LabFlow. Tuần này QA phía khách đã gửi ba ticket về cơ sở dữ liệu. Không ticket nào có stack trace. Việc của bạn là phương pháp của chương này: nhìn SQL thật, so với một con số độc lập, hỏi cơ sở dữ liệu ai đang chờ ai — rồi sửa, và chứng minh bản sửa bằng con số.</p>

<h3>Luật</h3>
<ul>
<li>Tái hiện từng ticket <strong>trước khi</strong> sửa mã, và ghi lại bằng chứng (số truy vấn, hai con số, pid đang chặn).</li>
<li>Mỗi lần đổi một thứ; chạy lại <code>node kiem.mjs</code> sau mỗi lần.</li>
<li>Không "sửa" bộ kiểm, dữ liệu mẫu hay các timeout. Không lấy việc tăng timeout transaction của Prisma làm bản sửa cho LAB-703.</li>
<li>AI được giải thích một thông báo lỗi hay một plan; không được viết bản sửa.</li>
</ul>

<h3>Chuẩn bị (10 phút)</h3>
${CHUAN_BI}
${TEP(false)}
<p><code>kiem.mjs</code> tính mọi giá trị mong đợi một cách <em>độc lập</em> bằng SQL qua driver <code>pg</code> (không qua ứng dụng), đo số truy vấn từ header <code>X-So-Truy-Van</code>, và với LAB-703 bắn năm lượt duyệt cùng lúc rồi đọc trạng thái thật trong cơ sở dữ liệu.</p>

<h3>Ba ticket (nguyên văn QA viết)</h3>
<div class="callout">
<p><strong>LAB-701 — Màn hình Phòng chậm trên staging.</strong> "Trên máy em mở /phong?toa=Alpha nhanh, lên staging thì lâu thấy rõ, giờ cao điểm còn lâu hơn. Dữ liệu hiển thị đúng." Priority: Medium.</p>
<p><strong>LAB-702 — Báo cáo doanh thu tháng 11 lệch so với kế toán.</strong> "Kế toán cộng tay từ bảng thanh toán và bảng thuê thiết bị được 264.000.000 đ, màn hình báo cáo ra 333.000.000 đ. Toà nào cũng lệch." Priority: High.</p>
<p><strong>LAB-703 — Bấm Duyệt quay mãi rồi báo lỗi.</strong> "Sáng thứ Hai, 5 giáo vụ cùng duyệt lịch phòng Lab 104, hai người bị lỗi sau khoảng 5–6 giây. Có người F5 thì thấy lịch đã duyệt rồi, có người thì chưa." Priority: High.</p>
</div>

<h3>Gợi ý (mở từng bậc một)</h3>
<details><summary>LAB-701 — bậc 1 / 2 / 3</summary><p>1: Vì sao cùng một đoạn mã lại nhanh trên laptop mà chậm trên staging, dữ liệu vẫn đúng? Hai nơi khác nhau ở chỗ nào (bài 7.1, cái proxy)? 2: Xem header <code>X-So-Truy-Van</code>, rồi chạy với <code>LOG_SQL=1</code>. 3: Vòng lặp qua các phòng chạy hai truy vấn cho mỗi phòng. Prisma đếm có lọc được (<code>_count: { select: { datLich: { where } } }</code>) và lấy "lượt gần nhất" (<code>take: 1</code>) ngay trong một <code>include</code>.</p></details>
<details><summary>LAB-702 — bậc 1 / 2 / 3</summary><p>1: Tính riêng tiền phòng và tiền thiết bị, không qua ứng dụng. Cái nào lệch, lệch bao nhiêu lần? 2: Chọn một lượt có cả thanh toán lẫn thiết bị và chạy phần FROM/JOIN của báo cáo mà không GROUP BY (bài 7.2). 3: Gộp từng bảng con về một dòng mỗi lượt đặt trước khi JOIN.</p></details>
<details><summary>LAB-703 — bậc 1 / 2 / 3</summary><p>1: Trong lúc năm lượt duyệt đang chạy, truy vấn <code>pg_stat_activity</code> kèm <code>pg_blocking_pids</code> (bài 7.4). Ai chờ ai, mỗi người chờ bao lâu? 2: Transaction giữ khoá phòng trong bao lâu? Cái gì chạy giữa <code>FOR UPDATE</code> và lúc kết thúc transaction? 3: Gửi email không cần khoá. Commit trước, rồi mới gửi (hoặc ghi một dòng outbox bên trong transaction). Đọc kỹ thông báo P2028 của Prisma: timeout nào đã nổ?</p></details>

<h3>Nộp gì</h3>
<ul>
<li>Với mỗi ticket một nhật ký gỡ lỗi (triệu chứng → bằng chứng → giả thuyết → kiểm → sửa), kèm con số.</li>
<li>Bản diff, và output <code>node kiem.mjs</code> trên máy và trên staging: ba dòng <code>ĐẠT</code>.</li>
<li>Với LAB-702 một bảng đối chiếu: số báo cáo so với số đếm độc lập theo từng toà, phần chênh, và một lượt đặt giải thích được nó.</li>
<li>Với LAB-703 một đoạn văn trả lời câu cuối của QA: vì sao người dùng có thể thấy "lỗi" mà lịch vẫn được duyệt?</li>
</ul>
<details><summary>kiem.mjs — bộ kiểm tự động chúng tôi đã dùng</summary>${ma(L_KIEM)}</details>

<h3>Rubric (100 điểm)</h3>
<table>
<thead><tr><th>Mục</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Mỗi ticket được tái hiện kèm bằng chứng trước khi sửa (3 × 10)</td><td>30</td></tr>
<tr><td>LAB-701: ≤ 3 truy vấn, dữ liệu y nguyên, thời gian trên staging trước/sau</td><td>15</td></tr>
<tr><td>LAB-702: tổng đúng + bảng đối chiếu giải thích phần chênh</td><td>20</td></tr>
<tr><td>LAB-703: chỉ ra phiên giữ khoá từ <code>pg_stat_activity</code>, đưa lời gọi ngoài ra khỏi transaction, 5/5 dưới 2,5 s</td><td>20</td></tr>
<tr><td>LAB-703: giải thích đúng trường hợp "lỗi mà vẫn duyệt"</td><td>5</td></tr>
<tr><td>Nhật ký đồng đội đọc hiểu được; mỗi lần đổi một thứ</td><td>10</td></tr>
</tbody></table>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li>"N+1 là gì, và bạn tìm nó thế nào trong một ứng dụng bạn chưa từng thấy?"</li>
<li>"Báo cáo doanh thu cao hơn số kế toán 26%. Kể tôi nghe bạn điều tra thế nào."</li>
<li>"Một endpoint thỉnh thoảng treo 30 giây rồi mới thành công. CPU rảnh. Bạn kiểm gì?"</li>
<li>"Vì sao gọi API bên ngoài trong một transaction cơ sở dữ liệu là ý tồi? Bạn làm gì thay thế?"</li>
<li>"Khoá ngoại nào cũng nên có index không? Bạn quyết định thế nào?"</li>
</ol>
<details><summary>Dàn ý trả lời</summary>${DAN_Y_VI}</details>

<h3>🛠 Mốc dự án</h3>
<p>Trong dự án của bạn (hoặc dự án cuối khoá), thêm bộ đếm truy vấn theo request (header hoặc log), bật <code>pg_stat_statements</code> trên DB dev, và viết một test thất bại nếu endpoint danh sách chính vượt quá ba truy vấn. Đặt <code>lock_timeout</code>, <code>statement_timeout</code> và <code>application_name</code> trong cấu hình kết nối. Giữ lại ghi chép — dự án cuối khoá ở chương 12 có sẵn lỗi N+1 và deadlock chờ bạn.</p>

<h3>Đáp án (chỉ xem sau khi đã viết câu trả lời của mình)</h3>
<details><summary>Lần chạy thật của chúng tôi trên bản lỗi (máy dev, rồi staging)</summary>${ra(L_LOI_MAY)}${ra(L_LOI_STG)}
<p>LAB-701: 51 truy vấn = 1 + 2 × 25 phòng. LAB-702: 333 so với 264 triệu — tiền phòng bị thổi lên ở những lượt có thuê thiết bị, tiền thiết bị gấp đôi vì lượt nào cũng có hai lần thanh toán. LAB-703: khoá phòng bị giữ suốt lời gọi email (~1,5 s), nên năm lượt duyệt chạy nối đuôi: 1,5, 3, 4,5 s… và lượt thứ tư, thứ năm chạm timeout mặc định 5.000 ms của interactive transaction trong Prisma.</p></details>
<details><summary>"Lỗi, mà vẫn duyệt": cùng mã, một lần chạy khác</summary>${ra(L_MA)}${ra(L_MA_LOG)}
<p>Trong 2 trên 8 lần chạy của chúng tôi, một request trả HTTP 500 với <code>P2028 … A commit cannot be executed on an expired transaction</code> trong khi cơ sở dữ liệu ghi lượt đó là <code>DA_DUYET</code>. Đừng tin rằng lỗi của một transaction đã hết giờ nghĩa là "chưa có gì xảy ra": timeout phía client và lệnh commit của cơ sở dữ liệu chạy đua với nhau. Đó là lý do QA thấy cả hai trường hợp sau khi F5. Thuốc chữa giống như với chuyện treo — giữ transaction thật ngắn để timeout không bao giờ nổ — cộng với thử lại idempotent và kiểm trạng thái thật trước khi báo cho người dùng.</p></details>
<details><summary>Bản sửa (diff), lần chạy trên bản đã sửa, và số đo thời gian</summary>${ma(L_DIFF, 'diff')}${ra(L_SUA)}${ra(L_DO)}
<p>LAB-701: 1 truy vấn với <code>relationLoadStrategy: 'join'</code>, trên staging từ 155 ms còn 15 ms. LAB-702: gộp trước khi JOIN. LAB-703: transaction chỉ giữ phần kiểm và phần cập nhật; email gửi sau khi commit, nên năm lượt duyệt chồng lên nhau và cùng xong trong ~1,6 s. Bản production sẽ ghi một dòng outbox trong transaction và để worker gửi email, có thử lại.</p></details>
</div>
`,
};
