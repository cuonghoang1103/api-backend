/**
 * Testing · Chương 4 · 4.2 — Postgres dùng một lần cho test (Docker, tmpfs). Slug giữ từ khung: tst-4-2-docker-db.
 * Đo thật: compose up --wait 2,1 s; 2000 insert tmpfs 660–686 ms vs volume ổ đĩa 792–885 ms (Docker Desktop, Mac).
 */
import G from '../giang/tst-04-2.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const DOWN = OUT['42-down'].split('\n')[0].slice(2); // chỉ dòng lệnh
const gon = (t) => t.split('\n').filter((l) => /^\$ |Healthy|Started|real|✓|×|Tests |Test Files|inserts on/.test(l)).join('\n');

export default {
  title: '4.2 — Throwaway Postgres for tests: Docker Compose, tmpfs and a fresh schema|||4.2 — Postgres dùng một lần cho test: Docker Compose, tmpfs và schema mới mỗi lần',
  slug: 'tst-4-2-docker-db',
  type: 'LESSON',
  isFreePreview: true,
  description: 'compose.test.yml: PostgreSQL 17 cổng riêng 54329, dữ liệu trên tmpfs, healthcheck pg_isready; up -d --wait (2,1 s đo thật) thay vì sleep; global setup dựng lại schema từ db/schema.sql mỗi lần chạy; chạy npm run test:int với TEST_DATABASE_URL; đo tmpfs vs ổ đĩa (≈ 0,67 s vs 0,85 s cho 2000 insert); quy tắc an toàn cho CSDL test.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Throwaway Postgres for tests</h2>
<p class="lead">Integration tests delete and rewrite data all the time, so they need a database that exists only for them — one you can destroy without a second thought. Docker Compose gives you exactly that, ready in about two seconds.</p>

<h3>A compose file just for tests</h3>
${ma('yaml', CODE.compose)}
<ul>
<li><strong>Same major version as production</strong> (<code>postgres:17</code>): SQL behaviour changes between versions.</li>
<li><strong>Port 54329</strong>, not 5432 — it never collides with a development database you care about. (On our machine port 54330 was already taken by an SSH tunnel; always check with <code>lsof -i :PORT</code> if a connection is refused or a password “does not match”.)</li>
<li><strong>tmpfs</strong> keeps the data directory in memory: nothing survives a restart, which is exactly what tests want.</li>
<li><strong>healthcheck</strong> with <code>pg_isready</code>: Compose knows when the server really accepts connections.</li>
</ul>
${ra(gon(OUT['42-up']))}
<p><code>--wait</code> returns only when the container is <em>healthy</em> — 2.1 s here. Scripts that “sleep 5” are either too slow or, on a busy CI machine, too fast.</p>

<h3>A fresh schema before every run</h3>
<p>The integration config has a global setup that runs once before all test files:</p>
${ma('javascript', CODE.globalSetup)}
<p>If <code>TEST_DATABASE_URL</code> is set, it uses that database; otherwise it starts its own container (lesson 4.3). Either way it drops the table and applies <code>db/schema.sql</code> — the same file production uses — so a leftover table from yesterday can never make today’s run green. The URL is handed to the test files with <code>provide</code>.</p>
${ma('javascript', CODE.intConfig)}
${ma('javascript', CODE.config)}
<p>Two commands from now on: <code>npx vitest run src/</code> — unit tests, no Docker, a quarter of a second; <code>npm run test:int</code> — integration tests against PostgreSQL. As with <code>demo/</code>–<code>demo3/</code>, <code>demo4/</code> contains demos that are red on purpose, so name the files you want: <code>npm run test:int -- test/integration</code>.</p>
${ra(gon(OUT['42-int-compose']))}

<h3>tmpfs or disk? Measure it</h3>
<p>A second compose file puts the same database on a normal Docker volume (port 54339), and a small script times 2000 single-row inserts — each its own transaction, like a test suite:</p>
${ma('javascript', CODE.doGhi)}
${ra(OUT['42-do-ghi'])}
<p>About 0.67 s on tmpfs against 0.85 s on disk: roughly 20 % faster on this Mac with Docker Desktop. On a slower disk the gap can be bigger, or smaller on a fast one — measure on your own machine and your CI before believing anyone’s number, including ours. Then stop both:</p>
${ma('bash', DOWN)}

<div class="pitfall co-tieu-de">
<p><strong>Never run integration tests against a database with real data.</strong> The suite uses <code>TRUNCATE</code> and <code>DROP TABLE</code> on purpose. One wrong <code>TEST_DATABASE_URL</code> — say, the shared development database, or worse — and that data is gone. Use a separate container, a separate port, the password “test”, and nothing worth keeping inside.</p>
</div>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li><code>docker compose -f compose.test.yml up -d --wait</code> — time it.</li>
<li><code>TEST_DATABASE_URL=postgres://postgres:test@localhost:54329/labflow_test npm run test:int -- test/integration</code> — 11 passed (output above).</li>
<li>Start <code>demo4/compose.disk.yml</code> and run <code>demo4/do-ghi.mjs</code> against both ports three times; write down your numbers.</li>
<li><code>down</code> both (add <code>-v</code> for the disk one to delete its volume).</li>
</ol>
<p><strong>Done when:</strong> the 11 integration tests pass against the compose database, and you have your own tmpfs/disk numbers.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">tmpfs</span><span class="v">A file system in memory: fast, and empty after every restart.</span></div>
  <div class="kv"><span class="k">healthcheck / --wait</span><span class="v">A command Docker runs to know the service is ready; <code>--wait</code> blocks until it passes.</span></div>
  <div class="kv"><span class="k">global setup</span><span class="v">Code Vitest runs once before all test files (and its returned function once after).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A disposable PostgreSQL: same major version, separate port, tmpfs, healthcheck.</li>
<li><code>up --wait</code> instead of sleeping; a fresh schema from the production file every run.</li>
<li>Unit and integration tests run with separate commands and configs.</li>
<li>tmpfs was ≈ 20 % faster here — measure yours. Never point tests at real data.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Postgres dùng một lần cho test</h2>
<p class="lead">Test tích hợp xoá và ghi lại dữ liệu liên tục, nên chúng cần một cơ sở dữ liệu chỉ tồn tại cho riêng chúng — thứ bạn huỷ đi mà không cần nghĩ lần hai. Docker Compose cho đúng thứ đó, sẵn sàng trong khoảng hai giây.</p>

<h3>Một file compose chỉ dành cho test</h3>
${ma('yaml', CODE.compose)}
<ul>
<li><strong>Cùng phiên bản chính với production</strong> (<code>postgres:17</code>): hành vi SQL thay đổi giữa các phiên bản.</li>
<li><strong>Cổng 54329</strong>, không phải 5432 — không bao giờ đụng cơ sở dữ liệu phát triển mà bạn quý. (Trên máy chúng tôi, cổng 54330 đã bị một đường hầm SSH chiếm; luôn kiểm bằng <code>lsof -i :PORT</code> khi kết nối bị từ chối hay báo sai mật khẩu một cách khó hiểu.)</li>
<li><strong>tmpfs</strong> giữ thư mục dữ liệu trong bộ nhớ: không gì sống sót qua một lần khởi động lại, đúng điều test cần.</li>
<li><strong>healthcheck</strong> bằng <code>pg_isready</code>: Compose biết khi nào máy chủ thật sự nhận kết nối.</li>
</ul>
${ra(gon(OUT['42-up']))}
<p><code>--wait</code> chỉ trả về khi container đã <em>healthy</em> — ở đây 2,1 giây. Script kiểu “sleep 5” hoặc quá chậm, hoặc trên một máy CI đang bận thì lại quá nhanh.</p>

<h3>Schema mới trước mỗi lần chạy</h3>
<p>Cấu hình test tích hợp có một global setup chạy một lần trước mọi file test:</p>
${ma('javascript', CODE.globalSetup)}
<p>Nếu có <code>TEST_DATABASE_URL</code>, nó dùng cơ sở dữ liệu đó; nếu không, nó tự bật container (bài 4.3). Cách nào thì nó cũng xoá bảng và áp <code>db/schema.sql</code> — đúng file production dùng — để một bảng sót lại từ hôm qua không thể làm lần chạy hôm nay xanh. URL được trao cho các file test bằng <code>provide</code>.</p>
${ma('javascript', CODE.intConfig)}
${ma('javascript', CODE.config)}
<p>Từ giờ có hai lệnh: <code>npx vitest run src/</code> — unit test, không cần Docker, một phần tư giây; <code>npm run test:int</code> — test tích hợp với PostgreSQL. Giống <code>demo/</code>–<code>demo3/</code>, thư mục <code>demo4/</code> có những demo cố ý đỏ, nên hãy chỉ rõ file cần chạy: <code>npm run test:int -- test/integration</code>.</p>
${ra(gon(OUT['42-int-compose']))}

<h3>tmpfs hay ổ đĩa? Hãy đo</h3>
<p>File compose thứ hai đặt cùng cơ sở dữ liệu đó lên một volume Docker bình thường (cổng 54339), và một script nhỏ bấm giờ 2000 lần chèn một dòng — mỗi lần một giao dịch, giống một bộ test:</p>
${ma('javascript', CODE.doGhi)}
${ra(OUT['42-do-ghi'])}
<p>Khoảng 0,67 giây trên tmpfs so với 0,85 giây trên ổ đĩa: nhanh hơn chừng 20 % trên máy Mac này với Docker Desktop. Ổ chậm hơn thì chênh có thể lớn hơn, ổ nhanh thì nhỏ hơn — hãy đo trên máy và CI của bạn trước khi tin số của bất kỳ ai, kể cả của chúng tôi. Rồi tắt cả hai:</p>
${ma('bash', DOWN)}

<div class="pitfall co-tieu-de">
<p><strong>Không bao giờ chạy test tích hợp trên cơ sở dữ liệu có dữ liệu thật.</strong> Bộ test cố ý dùng <code>TRUNCATE</code> và <code>DROP TABLE</code>. Chỉ một <code>TEST_DATABASE_URL</code> sai — chẳng hạn cơ sở dữ liệu phát triển dùng chung, hay tệ hơn — là dữ liệu đó mất. Dùng container riêng, cổng riêng, mật khẩu “test”, và không có gì đáng giữ bên trong.</p>
</div>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li><code>docker compose -f compose.test.yml up -d --wait</code> — bấm giờ.</li>
<li><code>TEST_DATABASE_URL=postgres://postgres:test@localhost:54329/labflow_test npm run test:int -- test/integration</code> — 11 passed (output ở trên).</li>
<li>Bật <code>demo4/compose.disk.yml</code> và chạy <code>demo4/do-ghi.mjs</code> với cả hai cổng ba lần; ghi lại số của bạn.</li>
<li><code>down</code> cả hai (thêm <code>-v</code> cho cái ổ đĩa để xoá volume).</li>
</ol>
<p><strong>Đạt khi:</strong> 11 test tích hợp đạt với cơ sở dữ liệu compose, và bạn có số tmpfs/ổ đĩa của riêng mình.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">tmpfs</span><span class="v">Hệ thống file nằm trong bộ nhớ: nhanh, và rỗng sau mỗi lần khởi động lại.</span></div>
  <div class="kv"><span class="k">healthcheck / --wait</span><span class="v">Lệnh Docker chạy để biết dịch vụ đã sẵn sàng; <code>--wait</code> chặn lại tới khi nó đạt.</span></div>
  <div class="kv"><span class="k">global setup</span><span class="v">Code Vitest chạy một lần trước mọi file test (và hàm nó trả về chạy một lần sau đó).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một PostgreSQL dùng một lần: cùng phiên bản chính, cổng riêng, tmpfs, healthcheck.</li>
<li><code>up --wait</code> thay vì ngủ; schema mới từ file production ở mỗi lần chạy.</li>
<li>Unit test và test tích hợp chạy bằng lệnh và cấu hình riêng.</li>
<li>tmpfs nhanh hơn ≈ 20 % ở đây — hãy đo của bạn. Không bao giờ trỏ test vào dữ liệu thật.</li>
</ul>
</div>
`,
};
