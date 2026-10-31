/**
 * Testing · Chương 4 · Lab 4 — Test tích hợp cho adapter PostgreSQL: diệt 8 đột biến. BÀI MỚI 01/11/2026, slug tst-4-5-lab-tich-hop.
 * Máy chấm scripts/dot-bien-4.mjs (mỗi đột biến một PostgreSQL mới qua Testcontainers). Output thật: bộ yếu 0/8; lời giải 11 test 8/8.
 */
import G from '../giang/tst-lab-4.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |\[setup\]|✓|×|Tests |Test Files|Duration|mutants|killed|SURVIVED/.test(l)).join('\n');

const UNIT = OUT['lab4-unit'].split('\n').filter((l) => /^\$ |^ [✓❯] |Tests |Test Files|Duration/.test(l)).join('\n');

const RUBRIC_EN = `<table>
<thead><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td>Mutants killed</td><td>4 (0.5 each)</td><td><code>node scripts/dot-bien-4.mjs</code></td></tr>
<tr><td>Boundaries of the SQL and the constraint: touching slots in both directions, another lab, another day</td><td>2</td><td>read the table of cases</td></tr>
<tr><td>Isolation: every test starts empty; any single test passes when run alone</td><td>2</td><td><code>-t</code> on single tests, any order</td></tr>
<tr><td>Database errors asserted by SQLSTATE (<code>23P01</code>, <code>23514</code>) and mapped to <code>OVERLAP</code></td><td>1</td><td>read the tests</td></tr>
<tr><td>Unit suite still separate and Docker-free; clear names</td><td>1</td><td><code>npm run test:unit</code></td></tr>
</tbody></table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>Số đột biến bị diệt</td><td>4 (0,5 mỗi con)</td><td><code>node scripts/dot-bien-4.mjs</code></td></tr>
<tr><td>Biên của SQL và của ràng buộc: khung chạm nhau theo cả hai chiều, phòng khác, ngày khác</td><td>2</td><td>đọc bảng tình huống</td></tr>
<tr><td>Cô lập: mọi test bắt đầu từ bảng rỗng; chạy riêng từng test vẫn đạt</td><td>2</td><td><code>-t</code> từng test, thứ tự bất kỳ</td></tr>
<tr><td>Khẳng định lỗi cơ sở dữ liệu bằng SQLSTATE (<code>23P01</code>, <code>23514</code>) và đổi đúng sang <code>OVERLAP</code></td><td>1</td><td>đọc test</td></tr>
<tr><td>Bộ unit test vẫn tách riêng, không cần Docker; tên rõ ràng</td><td>1</td><td><code>npm run test:unit</code></td></tr>
</tbody></table>`;

export default {
  title: 'Lab 4 — Integration tests for the PostgreSQL adapter: kill 8 mutants|||Lab 4 — Test tích hợp cho adapter PostgreSQL: diệt 8 đột biến',
  slug: 'tst-4-5-lab-tich-hop',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 4, thang chấm 10 điểm: test tích hợp cho createPgRepo, schema (EXCLUDE, CHECK) và bookLab trên PostgreSQL thật; script dot-bien-4.mjs cài 8 bug ở SQL, schema và phần đổi mã lỗi, mỗi lần một PostgreSQL mới. Output thật: bộ yếu 3 test xanh diệt 0/8; lời giải 11 test diệt 8/8.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lab 4</span>
<h2>Integration tests for the PostgreSQL adapter</h2>
<p class="lead">About 75 minutes. The same grading as Labs 1–3, with one difference: every mutant run starts a fresh PostgreSQL and applies the schema file — so two of the bugs are planted in SQL that no unit test could ever execute.</p>

<h3>Setup</h3>
<ol>
<li>LabFlow Lite with <code>db/schema.sql</code>, <code>src/booking/pgRepo.js</code>, the Chapter 4 line in <code>service.js</code>, <code>test/support/db.js</code>, the global setup and <code>vitest.integration.config.js</code> — all from lessons 4.1–4.4. Docker running.</li>
<li>Create <code>scripts/dot-bien-4.mjs</code>:
${ma('javascript', CODE.dotBien4)}</li>
</ol>
<p>Mutants #3 and #4 replace a filter with an always-true condition that still uses its parameter (<code>$1::text IS NOT NULL</code>). Simply deleting <code>lab = $1</code> would leave <code>$1</code> unused, and PostgreSQL would reject the whole query — a mutant every test kills for the wrong reason. Good mutants change behaviour, not syntax.</p>

<h3>Your task</h3>
<p>Write <code>test/integration/pgRepo.int.test.js</code> so that <code>npm run test:int -- test/integration</code> is green and <code>node scripts/dot-bien-4.mjs</code> prints <strong>8/8</strong>, with isolated tests (TRUNCATE or ROLLBACK). <code>npm run test:unit</code> must stay green without Docker.</p>

<h3>What a first attempt usually looks like</h3>
${ma('javascript', CODE.weak4)}
${ra(gon(OUT['lab4-weak-run']))}
${ra(gon(OUT['lab4-mut-weak']))}
<p>Three green tests against a real database, zero bugs noticed. All times overlap clearly, there is one lab and one day, and the second booking is stopped by <code>findOverlap</code> before it ever reaches the constraint — so the boundaries in SQL, the constraint, the CHECK and the error mapping are never exercised. A real database does not make a weak test strong.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>Hints — open one at a time</h3>
<ol>
<li>Store one booking 08:00–10:00 in BE-201; ask <code>findOverlap</code> about six neighbours: two overlapping, two touching (10:00–12:00 and 07:00–08:00), another lab, another day.</li>
<li>Call <code>repo.insert</code> directly to reach the constraint without <code>findOverlap</code>: touching must be accepted, overlapping refused with cause <code>23P01</code>.</li>
<li>Insert 0 seats directly: <code>23514</code>.</li>
<li>For mutant #8, wrap the repository so <code>findOverlap</code> always returns null, then book an overlapping slot through <code>bookLab</code>.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('javascript', CODE.pgRepoTest)}
${ra(gon(OUT['lab4-ref']))}
${ra(gon(OUT['lab4-mut-strong']))}
${ra(UNIT)}
<p>Eleven integration tests, 8/8, and the 73 unit tests still green without Docker. Notice the “blind repository” trick: <code>{ ...repo, findOverlap: async () =&gt; null }</code> is a tiny stub (lesson 3.1) combined with a real database — the cleanest way to make the constraint, not the pre-check, answer.</p>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run test:int -- test/integration</code> green (<code>demo4/</code> keeps its red-on-purpose demos); <code>npm run test:unit</code> green without Docker.</li>
<li><code>node scripts/dot-bien-4.mjs</code> prints 8/8.</li>
<li><code>git diff</code> shows only test files — the script restored the schema and the code.</li>
<li>Commit: <code>test: PostgreSQL adapter and constraints (Lab 4, 8/8)</code>.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
<li>A real database does not make a weak test strong: the first attempt killed 0 of 8.</li>
<li>Test SQL boundaries with a table of neighbours; reach constraints by inserting directly.</li>
<li>Assert SQLSTATE codes and their mapping; keep every test isolated.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Lab 4</span>
<h2>Test tích hợp cho adapter PostgreSQL</h2>
<p class="lead">Khoảng 75 phút. Cách chấm như Lab 1–3, khác một điểm: mỗi lần chạy đột biến lại bật một PostgreSQL mới và áp file schema — nên hai trong số các con bug được cài vào SQL mà không unit test nào có thể chạy tới.</p>

<h3>Chuẩn bị</h3>
<ol>
<li>LabFlow Lite có <code>db/schema.sql</code>, <code>src/booking/pgRepo.js</code>, dòng mới của Chương 4 trong <code>service.js</code>, <code>test/support/db.js</code>, global setup và <code>vitest.integration.config.js</code> — tất cả từ bài 4.1–4.4. Docker đang chạy.</li>
<li>Tạo <code>scripts/dot-bien-4.mjs</code>:
${ma('javascript', CODE.dotBien4)}</li>
</ol>
<p>Đột biến 3 và 4 thay một điều kiện lọc bằng một điều kiện luôn đúng mà vẫn dùng tham số của nó (<code>$1::text IS NOT NULL</code>). Nếu chỉ xoá <code>lab = $1</code>, tham số <code>$1</code> sẽ bị bỏ không và PostgreSQL từ chối cả câu truy vấn — một đột biến test nào cũng diệt, nhưng diệt vì lý do sai. Đột biến tốt thay đổi hành vi, không phá cú pháp.</p>

<h3>Nhiệm vụ</h3>
<p>Viết <code>test/integration/pgRepo.int.test.js</code> sao cho <code>npm run test:int -- test/integration</code> xanh và <code>node scripts/dot-bien-4.mjs</code> in <strong>8/8</strong>, với các test được cô lập (TRUNCATE hoặc ROLLBACK). <code>npm run test:unit</code> phải vẫn xanh khi không có Docker.</p>

<h3>Lần thử đầu thường trông thế nào</h3>
${ma('javascript', CODE.weak4)}
${ra(gon(OUT['lab4-weak-run']))}
${ra(gon(OUT['lab4-mut-weak']))}
<p>Ba test xanh với cơ sở dữ liệu thật, không phát hiện con bug nào. Các giờ đều chồng nhau rõ ràng, một phòng, một ngày, và lượt đặt thứ hai bị <code>findOverlap</code> chặn trước khi chạm tới ràng buộc — nên biên trong SQL, ràng buộc, CHECK và phần đổi mã lỗi không bao giờ chạy. Cơ sở dữ liệu thật không biến một test yếu thành test mạnh.</p>

<h3>Thang chấm (10 điểm, đạt từ 7)</h3>
${RUBRIC_VI}

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li>Lưu một lượt đặt 08:00–10:00 ở BE-201; hỏi <code>findOverlap</code> về sáu khung lân cận: hai khung chồng, hai khung chạm (10:00–12:00 và 07:00–08:00), một phòng khác, một ngày khác.</li>
<li>Gọi thẳng <code>repo.insert</code> để chạm tới ràng buộc mà không qua <code>findOverlap</code>: khung chạm phải được nhận, khung chồng phải bị từ chối với nguyên nhân <code>23P01</code>.</li>
<li>Chèn thẳng 0 chỗ: <code>23514</code>.</li>
<li>Với đột biến 8, bọc repository để <code>findOverlap</code> luôn trả null, rồi đặt một khung chồng qua <code>bookLab</code>.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã tự làm)</h3>
${ma('javascript', CODE.pgRepoTest)}
${ra(gon(OUT['lab4-ref']))}
${ra(gon(OUT['lab4-mut-strong']))}
${ra(UNIT)}
<p>Mười một test tích hợp, 8/8, và 73 unit test vẫn xanh khi không có Docker. Để ý mẹo “repository mù”: <code>{ ...repo, findOverlap: async () =&gt; null }</code> là một stub bé xíu (bài 3.1) kết hợp với cơ sở dữ liệu thật — cách gọn nhất để buộc ràng buộc, chứ không phải bước kiểm trước, phải trả lời.</p>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run test:int -- test/integration</code> xanh (<code>demo4/</code> vẫn giữ các demo cố ý đỏ); <code>npm run test:unit</code> xanh khi không có Docker.</li>
<li><code>node scripts/dot-bien-4.mjs</code> in 8/8.</li>
<li><code>git diff</code> chỉ có file test — script đã trả lại schema và code.</li>
<li>Commit: <code>test: PostgreSQL adapter and constraints (Lab 4, 8/8)</code>.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cơ sở dữ liệu thật không biến test yếu thành test mạnh: lần thử đầu diệt 0/8.</li>
<li>Test biên của SQL bằng bảng các khung lân cận; chạm tới ràng buộc bằng cách chèn thẳng.</li>
<li>Khẳng định mã SQLSTATE và cách đổi mã; giữ mọi test được cô lập.</li>
</ul>
</div>
`,
};
