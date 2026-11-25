/**
 * 8.5 — Lab: một race, một lỗi thời gian và một rò rỉ (soạn 24/11/2026, máy nhà Linux).
 * Ứng dụng lab: node:http + pg (Node 22, cổng 41850, TZ=UTC như container), PostgreSQL 16 (labflow_lab8).
 * kiem.mjs: #801 100 vòng × 5 request song song, #802 100 lần × 3 truy vấn lịch theo múi, #803 30.000 lần báo giá + đo heap sau GC.
 * Output thật bản lỗi/bản sửa — scratchpad/dbg/lab/ch8/lab, lab-sua, lab-sua.diff; o-lab8-*.txt.
 */
import { L_APP, L_KIEM, L_CHAY, L_SCHEMA, L_DIFF } from './_ma-8.mjs';
import { L_LOI, L_SUA, TZ_BAY } from './_ra-8.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const CHUAN_BI = ma(`# PostgreSQL 16 cho lab (cổng 45432 chỉ trên máy mình)
docker run -d --name dbg-pg -e POSTGRES_PASSWORD=dbg -p 127.0.0.1:45432:5432 postgres:16
echo 'CREATE DATABASE labflow_lab8;' | docker exec -i dbg-pg psql -U postgres
docker exec -i dbg-pg psql -U postgres -d labflow_lab8 &lt; schema.sql

npm install pg@8           # thư viện duy nhất
./chay.sh                  # chạy app nền với TZ=UTC (như trong container), log ở app.log
node kiem.mjs              # cả ba ticket;  node kiem.mjs 802  — chỉ một ticket`, 'bash');

const TEP = `<details><summary>app.mjs — the application (all three bugs are in here) / ứng dụng (cả ba lỗi nằm ở đây)</summary>${ma(L_APP)}</details>
<details><summary>schema.sql · chay.sh</summary>${ma(L_SCHEMA, 'sql')}${ma(L_CHAY, 'bash')}</details>`;

const DAN_Y_EN = `<ol>
<li><strong>Race you could not reproduce.</strong> Do not wait for luck: write a script that fires N identical requests at once (Promise.all / ExecutorService + latch), count the result in the database, run 100 rounds and report "x/100". Then read the code for check-then-act and read-modify-write, and fix with a constraint or atomic statement; show 0/100.</li>
<li><strong>Why a transaction is not enough.</strong> At READ COMMITTED a SELECT locks nothing; five transactions can all see "no row" and all insert. You need something that conflicts: a UNIQUE/EXCLUDE constraint, an atomic conditional UPDATE, SELECT … FOR UPDATE on an existing parent row, or SERIALIZABLE with retry.</li>
<li><strong>Storing time.</strong> Instants as UTC (timestamptz / Instant) with the offset in JSON; calendar dates as dates; the user's zone stored separately when "their day" matters. Compute day boundaries in the user's zone, test at 00:30/23:30 local and on DST days, inject a clock.</li>
<li><strong>Memory grows in production.</strong> Graph memory after GC over days; check restart reason (137 OOMKilled vs runtime OOM); reproduce with load locally; two heap snapshots / class histograms; follow retainers to the holding variable; fix (bound, TTL, unsubscribe); show a flat trend. Raising the limit is a temporary mitigation.</li>
<li><strong>"Sometimes" bugs in general.</strong> Turn "sometimes" into a number: under which condition, how often. Increase the frequency (more concurrency, specific time, specific data), automate the reproduction, and keep the script as a regression test.</li>
</ol>`;

const DAN_Y_VI = `<ol>
<li><strong>Race không tái hiện được.</strong> Đừng chờ may mắn: viết script bắn N request giống nhau cùng lúc (Promise.all / ExecutorService + latch), đếm kết quả trong cơ sở dữ liệu, chạy 100 vòng và báo "x/100". Rồi đọc mã tìm kiểm-rồi-làm và đọc-sửa-ghi, sửa bằng ràng buộc hoặc câu lệnh nguyên tử; cho thấy 0/100.</li>
<li><strong>Vì sao transaction là chưa đủ.</strong> Ở READ COMMITTED, SELECT không khoá gì; năm transaction đều có thể thấy "chưa có dòng" và đều chèn. Cần một thứ gây xung đột: ràng buộc UNIQUE/EXCLUDE, UPDATE nguyên tử có điều kiện, SELECT … FOR UPDATE trên một dòng cha đã tồn tại, hoặc SERIALIZABLE kèm thử lại.</li>
<li><strong>Lưu thời gian.</strong> Thời điểm theo UTC (timestamptz / Instant) kèm độ lệch trong JSON; ngày lịch lưu dạng ngày; lưu riêng múi giờ của người dùng khi "ngày của họ" quan trọng. Tính biên ngày theo múi của người dùng, test lúc 00:30/23:30 giờ địa phương và ngày DST, tiêm đồng hồ.</li>
<li><strong>Bộ nhớ tăng trên production.</strong> Vẽ bộ nhớ sau GC theo ngày; kiểm lý do khởi động lại (137 OOMKilled hay OOM của runtime); tái hiện bằng tải ở máy; hai heap snapshot / class histogram; lần theo retainers tới biến đang giữ; sửa (đặt trần, TTL, huỷ đăng ký); cho thấy xu hướng phẳng. Tăng giới hạn chỉ là giảm nhẹ tạm thời.</li>
<li><strong>Lỗi "thỉnh thoảng" nói chung.</strong> Biến "thỉnh thoảng" thành con số: điều kiện nào, bao lâu một lần. Tăng tần suất (đồng thời nhiều hơn, thời điểm cụ thể, dữ liệu cụ thể), tự động hoá việc tái hiện, và giữ script làm test hồi quy.</li>
</ol>`;

export default {
  title: '8.5 — Lab: A race, a time bug and a leak|||8.5 — Lab: Một race, một lỗi thời gian và một rò rỉ',
  slug: 'dbg-8-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba ticket thật của LabFlow mini (node:http + PostgreSQL, server TZ=UTC): #801 "đã bọc transaction mà vẫn hai người giữ một ca" (100/100 vòng sai), #802 "khách Nhật đặt 01/12 hiện ở 30/11" (biên ngày tính bằng new Date(ngày) = nửa đêm UTC; cả ca 06:30 giờ VN cũng mất), #803 "chạy hai ngày là pod restart" (cache báo giá dùng cả tham số _= né cache làm khoá: heap 8 → 90 MB sau 30.000 lần). Script kiem.mjs tái hiện đỏ trước khi sửa; đạt khi cả ba xanh (801 là 100 vòng liên tiếp). Gợi ý ba bậc, rubric 100 điểm, 5 câu phỏng vấn kèm dàn ý, mốc dự án; đáp án là output thật bản lỗi/bản sửa + diff (UNIQUE + 23505 ⇒ 409; biên ngày AT TIME ZONE trong PostgreSQL; khoá cache chỉ gồm tham số ảnh hưởng + trần) và bẫy Intl.supportedValuesOf không có Asia/Ho_Chi_Minh.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lab</span>
<h2>Three "sometimes" tickets</h2>
<p class="lead">LabFlow mini is a small booking service (Node <code>node:http</code> + PostgreSQL) that runs in UTC like every container. The client's QA filed three tickets this week, each of the kind this chapter is about: a race, a time zone bug and a memory leak. None of them shows up when you click through the app once on your laptop. The rule of the lab: <strong>the reproduction script must be red before you change a line of the app</strong>, and green after — the race 100 rounds in a row.</p>

<h3>Rules</h3>
<ul>
<li>Reproduce each ticket with <code>node kiem.mjs &lt;ticket&gt;</code> first and write down the red line.</li>
<li>One change at a time; rerun the checker after each.</li>
<li>Do not edit <code>kiem.mjs</code>. Do not fix #801 with a lock in application memory, #802 by setting the server's <code>TZ</code>, or #803 by raising the memory limit.</li>
<li>AI may explain an error or a concept; it may not write the fix.</li>
</ul>

<h3>Setup (10 min)</h3>
${CHUAN_BI}
${TEP}
<p><code>kiem.mjs</code> never trusts the app's answers: for #801 it counts rows in the database after each round, for #802 it inserts three bookings at known instants and checks which day each one lands on in Tokyo and Việt Nam, for #803 it forces a GC (<code>--expose-gc</code>) and compares heap before/after 30,000 requests.</p>

<h3>The three tickets (as QA wrote them)</h3>
<div class="callout">
<p><strong>#801 — Hai bạn cùng giữ được Lab 401 ca 2.</strong> "Dev nói đã bọc transaction rồi. Em test tay 10 lần không bị, nhưng sáng thứ Hai lúc mở đăng ký thì có 3 ca bị hai người cùng giữ." Priority: High.</p>
<p><strong>#802 — Khách Nhật đặt lịch ngày 1/12, màn hình lịch ngày 1/12 không thấy.</strong> "Đối tác Tokyo xem lịch theo tz=Asia/Tokyo. Lịch 8 giờ sáng ngày 1/12 của họ lại hiện ở ngày 30/11. Bên mình xem theo giờ VN thì ca 6 giờ 30 sáng cũng biến mất." Priority: High.</p>
<p><strong>#803 — Service báo giá chạy hai ngày là bị restart.</strong> "Grafana: bộ nhớ tăng đều, tới ngưỡng thì pod restart, sau đó lại tăng. Không có lỗi trong log." Priority: Medium.</p>
</div>

<h3>Hints (open one level at a time)</h3>
<details><summary>#801 — level 1 / 2 / 3</summary><p>1: The transaction is real. What does a <code>SELECT</code> lock at READ COMMITTED when the row does not exist yet (lesson 8.1)? 2: Five transactions start, all see zero rows, all insert — what in the database could make the second insert fail? 3: A <code>UNIQUE (phong, ngay, ca)</code> constraint, and map SQLSTATE <code>23505</code> to 409 — without that mapping you trade double bookings for 500s.</p></details>
<details><summary>#802 — level 1 / 2 / 3</summary><p>1: Run the app with <code>TZ=Asia/Ho_Chi_Minh</code> and with <code>TZ=UTC</code>: does it change anything? Why not (lesson 8.2, section 1)? 2: What instant is <code>new Date('2026-12-01')</code>? What instant is midnight of 1 December in Tokyo? 3: Compute the day boundaries in the user's zone — in SQL: <code>($1::date)::timestamp AT TIME ZONE $2</code> — and keep comparing the raw <code>bat_dau</code> column so an index still works.</p></details>
<details><summary>#803 — level 1 / 2 / 3</summary><p>1: Measure <code>/mem</code> after N requests at three points (lesson 8.4). Staircase or saw-tooth? 2: What is the key of the memo map, and what does the front-end add to every URL? Take two heap snapshots and look for a count that matches your load. 3: Key only on the parameters that change the result, and bound the map (LRU or TTL).</p></details>

<h3>What to hand in</h3>
<ul>
<li>For each ticket a debugging log: symptom → reproduction (the red line) → hypothesis → test → fix.</li>
<li>The diff and the full <code>node kiem.mjs</code> output ending in <code>KẾT QUẢ: ĐẠT</code>.</li>
<li>For #801 one paragraph: why did "wrap it in a transaction" not help, and why did QA's manual test not find it?</li>
<li>For #802 a table of the three bookings: instant in UTC, local time in Tokyo and Việt Nam, which day the old code put them on, which day the fixed code puts them on.</li>
<li>For #803 the two measurements (before/after) and the name of the variable that retained the memory.</li>
</ul>
<details><summary>kiem.mjs — the reproduction script</summary>${ma(L_KIEM)}</details>

<h3>Rubric (100 points)</h3>
<table>
<thead><tr><th>Item</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Each ticket reproduced red before the fix, with the evidence written down (3 × 10)</td><td>30</td></tr>
<tr><td>#801: constraint in the schema, 409 not 500, 100/100 rounds green; explanation of READ COMMITTED</td><td>20</td></tr>
<tr><td>#802: boundaries in the user's zone, works for Tokyo and VN, no reliance on server <code>TZ</code>; the table</td><td>20</td></tr>
<tr><td>#803: retaining variable identified with evidence (snapshot or counters), bounded cache, flat heap</td><td>20</td></tr>
<tr><td>Logs readable by a teammate; one change at a time</td><td>10</td></tr>
</tbody></table>

<h3>🎤 What an interviewer will ask</h3>
<ol>
<li>"A bug happens only sometimes and you cannot reproduce it. What do you do?"</li>
<li>"Two users booked the same slot although the code checks first and runs inside a transaction. Explain and fix."</li>
<li>"How do you store and compare dates and times in an application with users in several countries?"</li>
<li>"Memory of a Node/Java service keeps growing in production. How do you find out why?"</li>
<li>"Optimistic or pessimistic locking — when would you choose each?"</li>
</ol>
<details><summary>Answer outlines</summary>${DAN_Y_EN}</details>

<h3>🛠 Project milestone</h3>
<p>In your own project (or the capstone): add one parallel reproduction script for the most important "at most one" rule (booking, voucher, stock) and keep it in CI; add a UNIQUE or atomic update where it is missing; inject a clock into every place that computes "today" or "expired" and test 00:30/23:30 local; add <code>/health</code> with the build commit; set explicit memory limits (Node heap ≈ 75% of the container, JVM <code>MaxRAMPercentage</code>) and <code>HeapDumpOnOutOfMemoryError</code>.</p>

<h3>Answers (check only after writing yours)</h3>
<details><summary>Our real run on the buggy version</summary>${ra(L_LOI)}
<p>#801: every one of the 100 rounds ended with more than one row — five transactions each saw zero rows, each inserted. #802: <code>new Date('2026-12-01')</code> is midnight UTC, i.e. 09:00 in Tokyo and 07:00 in Việt Nam, so Tanaka's 08:00 Tokyo and Lan's 06:30 VN fall into "30 November", and Minh's 23:30 VN (16:30 UTC) is the only one the old code shows for 1 December in Việt Nam — in Tokyo it is already 2 December, yet the old code shows it for Tokyo's 1 December too. #803: the memo key is <code>JSON.stringify(query)</code>, and the front-end's <code>_=&lt;timestamp&gt;</code> makes every key unique: 30,000 entries, 8 → 90 MB, and it never stops.</p></details>
<details><summary>The fix (diff) and the run on the fixed version</summary>${ma(L_DIFF, 'diff')}${ra(L_SUA)}
<p>#801: the constraint makes the second insert fail with <code>23505</code>, mapped to 409 — 100 rounds, 0 wrong, 0 errors. #802: PostgreSQL computes the start and end of "1 December in the user's zone" (DST-safe: a day can be 23 or 25 hours) and the query still compares the <code>bat_dau</code> column directly. #803: the key is <code>phong:gio</code> and the map is capped at 1,000 entries; the heap stays at 8–9 MB.</p></details>
<details><summary>A trap we hit while fixing #802</summary>${ra(TZ_BAY)}
<p>The first version of the fix validated <code>tz</code> with <code>Intl.supportedValuesOf('timeZone').includes(tz)</code> — and rejected every Vietnamese user with 500, because that list contains only canonical names (<code>Asia/Saigon</code>), not the alias <code>Asia/Ho_Chi_Minh</code>. Validate by trying: <code>new Intl.DateTimeFormat('en', { timeZone: tz })</code> throws on an invalid zone. The checker caught it immediately — one more reason to run the full script after every change.</p></details>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Lab</span>
<h2>Ba ticket "thỉnh thoảng"</h2>
<p class="lead">LabFlow mini là một dịch vụ đặt lịch nhỏ (Node <code>node:http</code> + PostgreSQL) chạy theo UTC như mọi container. Tuần này QA phía khách gửi ba ticket, mỗi cái thuộc đúng một loại của chương này: một race, một lỗi múi giờ và một rò rỉ bộ nhớ. Không cái nào hiện ra khi bạn bấm thử ứng dụng một lần trên laptop. Luật của lab: <strong>script tái hiện phải đỏ trước khi bạn sửa một dòng nào của ứng dụng</strong>, và xanh sau đó — riêng race là 100 vòng liên tiếp.</p>

<h3>Luật</h3>
<ul>
<li>Tái hiện từng ticket bằng <code>node kiem.mjs &lt;ticket&gt;</code> trước, và ghi lại dòng đỏ.</li>
<li>Mỗi lần chỉ đổi một thứ; chạy lại script kiểm sau mỗi lần.</li>
<li>Không sửa <code>kiem.mjs</code>. Không sửa #801 bằng khoá trong bộ nhớ ứng dụng, #802 bằng cách đặt <code>TZ</code> cho server, hay #803 bằng cách tăng giới hạn bộ nhớ.</li>
<li>AI được giải thích một lỗi hay một khái niệm; không được viết bản sửa.</li>
</ul>

<h3>Chuẩn bị (10 phút)</h3>
${CHUAN_BI}
${TEP}
<p><code>kiem.mjs</code> không bao giờ tin câu trả lời của ứng dụng: với #801 nó đếm dòng trong cơ sở dữ liệu sau mỗi vòng, với #802 nó chèn ba lịch hẹn ở những thời điểm đã biết rồi kiểm mỗi lịch rơi vào ngày nào theo giờ Tokyo và giờ Việt Nam, với #803 nó ép GC (<code>--expose-gc</code>) và so heap trước/sau 30.000 request.</p>

<h3>Ba ticket (nguyên văn QA viết)</h3>
<div class="callout">
<p><strong>#801 — Hai bạn cùng giữ được Lab 401 ca 2.</strong> "Dev nói đã bọc transaction rồi. Em test tay 10 lần không bị, nhưng sáng thứ Hai lúc mở đăng ký thì có 3 ca bị hai người cùng giữ." Priority: High.</p>
<p><strong>#802 — Khách Nhật đặt lịch ngày 1/12, màn hình lịch ngày 1/12 không thấy.</strong> "Đối tác Tokyo xem lịch theo tz=Asia/Tokyo. Lịch 8 giờ sáng ngày 1/12 của họ lại hiện ở ngày 30/11. Bên mình xem theo giờ VN thì ca 6 giờ 30 sáng cũng biến mất." Priority: High.</p>
<p><strong>#803 — Service báo giá chạy hai ngày là bị restart.</strong> "Grafana: bộ nhớ tăng đều, tới ngưỡng thì pod restart, sau đó lại tăng. Không có lỗi trong log." Priority: Medium.</p>
</div>

<h3>Gợi ý (mở từng bậc một)</h3>
<details><summary>#801 — bậc 1 / 2 / 3</summary><p>1: Transaction là thật. Ở READ COMMITTED, một câu <code>SELECT</code> khoá gì khi dòng đó chưa tồn tại (bài 8.1)? 2: Năm transaction bắt đầu, đều thấy không có dòng nào, đều chèn — thứ gì trong cơ sở dữ liệu có thể làm lần chèn thứ hai thất bại? 3: Ràng buộc <code>UNIQUE (phong, ngay, ca)</code>, và ánh xạ SQLSTATE <code>23505</code> thành 409 — thiếu bước ánh xạ đó thì bạn chỉ đổi đặt trùng lấy lỗi 500.</p></details>
<details><summary>#802 — bậc 1 / 2 / 3</summary><p>1: Chạy ứng dụng với <code>TZ=Asia/Ho_Chi_Minh</code> và với <code>TZ=UTC</code>: có gì khác không? Vì sao không (bài 8.2, mục 1)? 2: <code>new Date('2026-12-01')</code> là thời điểm nào? Nửa đêm ngày 1 tháng 12 ở Tokyo là thời điểm nào? 3: Tính biên ngày theo múi của người dùng — trong SQL: <code>($1::date)::timestamp AT TIME ZONE $2</code> — và vẫn so sánh trực tiếp trên cột <code>bat_dau</code> để index còn dùng được.</p></details>
<details><summary>#803 — bậc 1 / 2 / 3</summary><p>1: Đo <code>/mem</code> sau N request ở ba điểm (bài 8.4). Bậc thang hay răng cưa? 2: Khoá của map ghi nhớ là gì, và giao diện gắn thêm gì vào mọi URL? Chụp hai heap snapshot và tìm một con số khớp với lượng tải. 3: Chỉ lấy khoá theo các tham số làm thay đổi kết quả, và đặt trần cho map (LRU hoặc TTL).</p></details>

<h3>Nộp gì</h3>
<ul>
<li>Với mỗi ticket một nhật ký gỡ lỗi: triệu chứng → tái hiện (dòng đỏ) → giả thuyết → kiểm → sửa.</li>
<li>Diff và toàn bộ output của <code>node kiem.mjs</code> kết thúc bằng <code>KẾT QUẢ: ĐẠT</code>.</li>
<li>Với #801 một đoạn văn: vì sao "bọc transaction" không giúp được, và vì sao test tay của QA không tìm ra?</li>
<li>Với #802 một bảng ba lịch hẹn: thời điểm theo UTC, giờ địa phương ở Tokyo và Việt Nam, mã cũ xếp vào ngày nào, mã đã sửa xếp vào ngày nào.</li>
<li>Với #803 hai phép đo (trước/sau) và tên biến đã giữ bộ nhớ.</li>
</ul>
<details><summary>kiem.mjs — script tái hiện</summary>${ma(L_KIEM)}</details>

<h3>Rubric (100 điểm)</h3>
<table>
<thead><tr><th>Mục</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Mỗi ticket tái hiện đỏ trước khi sửa, có ghi lại bằng chứng (3 × 10)</td><td>30</td></tr>
<tr><td>#801: ràng buộc trong schema, 409 chứ không 500, 100/100 vòng xanh; giải thích được READ COMMITTED</td><td>20</td></tr>
<tr><td>#802: biên ngày theo múi của người dùng, đúng cho cả Tokyo và VN, không dựa vào <code>TZ</code> của server; có bảng</td><td>20</td></tr>
<tr><td>#803: chỉ ra biến giữ bộ nhớ kèm bằng chứng (snapshot hoặc bộ đếm), cache có trần, heap phẳng</td><td>20</td></tr>
<tr><td>Nhật ký đồng đội đọc được; mỗi lần đổi một thứ</td><td>10</td></tr>
</tbody></table>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li>"Một lỗi chỉ thỉnh thoảng xảy ra và bạn không tái hiện được. Bạn làm gì?"</li>
<li>"Hai người dùng đặt cùng một ca dù mã có kiểm trước và chạy trong transaction. Giải thích và sửa."</li>
<li>"Bạn lưu và so sánh ngày giờ thế nào trong một ứng dụng có người dùng ở nhiều nước?"</li>
<li>"Bộ nhớ của một dịch vụ Node/Java cứ tăng trên production. Bạn tìm nguyên nhân thế nào?"</li>
<li>"Khoá lạc quan hay khoá bi quan — khi nào bạn chọn cái nào?"</li>
</ol>
<details><summary>Dàn ý trả lời</summary>${DAN_Y_VI}</details>

<h3>🛠 Mốc dự án</h3>
<p>Trong dự án của bạn (hoặc dự án cuối khoá): thêm một script tái hiện song song cho luật "nhiều nhất một" quan trọng nhất (đặt lịch, phiếu giảm giá, tồn kho) và giữ nó trong CI; thêm UNIQUE hoặc UPDATE nguyên tử ở chỗ còn thiếu; tiêm đồng hồ vào mọi chỗ tính "hôm nay" hay "hết hạn" và test lúc 00:30/23:30 giờ địa phương; thêm <code>/health</code> kèm commit của bản build; đặt giới hạn bộ nhớ tường minh (heap Node ≈ 75% container, <code>MaxRAMPercentage</code> của JVM) và <code>HeapDumpOnOutOfMemoryError</code>.</p>

<h3>Đáp án (chỉ xem sau khi đã viết câu trả lời của mình)</h3>
<details><summary>Lần chạy thật của chúng tôi trên bản lỗi</summary>${ra(L_LOI)}
<p>#801: cả 100 vòng đều kết thúc với hơn một dòng — năm transaction đều thấy không có dòng nào, đều chèn. #802: <code>new Date('2026-12-01')</code> là nửa đêm UTC, tức 09:00 ở Tokyo và 07:00 ở Việt Nam, nên lịch 08:00 Tokyo của Tanaka và ca 06:30 VN của Lan rơi vào "ngày 30/11", còn lịch 23:30 VN của Minh (16:30 UTC) là lịch duy nhất mã cũ hiện cho ngày 1/12 ở Việt Nam — ở Tokyo nó đã là ngày 2/12, vậy mà mã cũ vẫn hiện nó cho ngày 1/12 của Tokyo. #803: khoá ghi nhớ là <code>JSON.stringify(query)</code>, và tham số <code>_=&lt;thời điểm&gt;</code> của giao diện làm mọi khoá đều khác nhau: 30.000 mục, 8 → 90 MB, và không bao giờ dừng.</p></details>
<details><summary>Bản sửa (diff) và lần chạy trên bản đã sửa</summary>${ma(L_DIFF, 'diff')}${ra(L_SUA)}
<p>#801: ràng buộc làm lần chèn thứ hai thất bại với <code>23505</code>, được ánh xạ thành 409 — 100 vòng, 0 sai, 0 lỗi. #802: PostgreSQL tính điểm đầu và điểm cuối của "ngày 1/12 theo múi của người dùng" (an toàn với DST: một ngày có thể dài 23 hoặc 25 giờ) và truy vấn vẫn so sánh trực tiếp trên cột <code>bat_dau</code>. #803: khoá là <code>phong:gio</code> và map có trần 1.000 mục; heap đứng ở 8–9 MB.</p></details>
<details><summary>Một cái bẫy chúng tôi gặp khi sửa #802</summary>${ra(TZ_BAY)}
<p>Bản sửa đầu tiên kiểm <code>tz</code> bằng <code>Intl.supportedValuesOf('timeZone').includes(tz)</code> — và từ chối mọi người dùng Việt Nam bằng lỗi 500, vì danh sách đó chỉ chứa tên chuẩn (<code>Asia/Saigon</code>), không có bí danh <code>Asia/Ho_Chi_Minh</code>. Hãy kiểm bằng cách thử: <code>new Intl.DateTimeFormat('en', { timeZone: tz })</code> sẽ ném lỗi với múi không hợp lệ. Script kiểm bắt được ngay — thêm một lý do để chạy toàn bộ script sau mỗi lần sửa.</p></details>
</div>
`,
};
