/**
 * Testing · Chương 4 · 4.3 — Testcontainers cho Node. Slug giữ từ khung: tst-4-3-testcontainers.
 * Chạy thật: @testcontainers/postgresql 12.2.1, image postgres:17 có sẵn, container sẵn sàng 1,2–2,1 s.
 */
import G from '../giang/tst-04-3.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |\[setup\]|✓|×|Tests |Test Files|Duration/.test(l)).join('\n');

const SO_EN = `<table>
<thead><tr><th></th><th>docker compose (4.2)</th><th>Testcontainers (4.3)</th></tr></thead>
<tbody>
<tr><td>Who starts the database</td><td>you, before running tests</td><td>the test run itself</td></tr>
<tr><td>Port</td><td>fixed (54329)</td><td>a random free port</td></tr>
<tr><td>Forgotten cleanup</td><td>container keeps running</td><td>stopped by the setup, or by Ryuk if the run crashes</td></tr>
<tr><td>Reuse between runs</td><td>yes — quick local loops</td><td>a new container every run</td></tr>
<tr><td>Extra dependency</td><td>none</td><td><code>testcontainers</code>, <code>@testcontainers/postgresql</code></td></tr>
</tbody></table>`;
const SO_VI = `<table>
<thead><tr><th></th><th>docker compose (4.2)</th><th>Testcontainers (4.3)</th></tr></thead>
<tbody>
<tr><td>Ai bật cơ sở dữ liệu</td><td>bạn, trước khi chạy test</td><td>chính lần chạy test</td></tr>
<tr><td>Cổng</td><td>cố định (54329)</td><td>một cổng trống ngẫu nhiên</td></tr>
<tr><td>Quên dọn dẹp</td><td>container vẫn chạy</td><td>setup tự dừng, hoặc Ryuk dọn nếu lần chạy bị sập</td></tr>
<tr><td>Dùng lại giữa các lần chạy</td><td>có — vòng lặp nhanh ở máy</td><td>mỗi lần chạy một container mới</td></tr>
<tr><td>Phụ thuộc thêm</td><td>không</td><td><code>testcontainers</code>, <code>@testcontainers/postgresql</code></td></tr>
</tbody></table>`;

export default {
  title: '4.3 — Testcontainers for Node: the test run starts its own database|||4.3 — Testcontainers cho Node: lần chạy test tự bật cơ sở dữ liệu',
  slug: 'tst-4-3-testcontainers',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Global setup bật PostgreSQL 17 bằng @testcontainers/postgresql khi không có TEST_DATABASE_URL, áp schema, provide URL và dừng container sau lần chạy; inject trong file test; cấu hình test tích hợp riêng (fileParallelism false); container sẵn sàng 1,2–2,1 s đo thật; so Compose với Testcontainers; chạy trong CI; test kiểm phiên bản máy chủ.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Testcontainers for Node</h2>
<p class="lead">With Compose you must remember to start the database before the tests and stop it afterwards. <a href="https://testcontainers.com" target="_blank" rel="noopener">Testcontainers</a> moves that into the test run itself: the run starts a container, the tests use it, the run removes it.</p>

<h3>One container per test run</h3>
${ma('javascript', CODE.globalSetup)}
<ul>
<li><code>new PostgreSqlContainer('postgres:17').start()</code> starts the image (pulling it the first time), waits until PostgreSQL accepts connections and maps it to a <strong>random free port</strong>. <code>getConnectionUri()</code> gives the URL with that port and the container’s user and password.</li>
<li>The function returned by <code>setup</code> is Vitest’s teardown: it runs once after all test files and stops the container. If the process crashes, Testcontainers’ helper container <strong>Ryuk</strong> removes it.</li>
<li>With <code>TEST_DATABASE_URL</code> set, no container is started — one setup file supports both workflows of this chapter.</li>
</ul>

<h3>provide in setup, inject in tests</h3>
${ma('javascript', CODE.dbHelpers)}
<p>Test files run in separate worker processes, so a variable from the setup is not simply visible to them. <code>provide('databaseUrl', url)</code> in the setup and <code>inject('databaseUrl')</code> in a test is Vitest’s supported channel between the two. <code>makeBooking</code> is the factory of lesson 4.4.</p>

<h3>A separate config, and the real run</h3>
<p>The integration config from lesson 4.2 points <code>globalSetup</code> at this file and runs files one at a time (<code>fileParallelism: false</code>, explained in 4.4). Without <code>TEST_DATABASE_URL</code>:</p>
${ra(gon(OUT['43-tc']))}
<p>The container was ready in 1.4 s here; across all our runs it took 1.2–2.1 s with the image already downloaded. The very first run on a machine also downloads <code>postgres:17</code> — tens of seconds, once.</p>

<h3>Compose or Testcontainers?</h3>
${SO_EN}
<p>Use Compose when you run integration tests many times in a row and want the database to stay up; use Testcontainers when every run should be self-contained — a new teammate runs <code>npm run test:int</code> with nothing else to remember. In CI, GitHub’s Ubuntu runners have Docker installed, so Testcontainers works as is; alternatively the workflow starts PostgreSQL as a service and sets <code>TEST_DATABASE_URL</code> (Chapter 9).</p>
<p><strong>Spring Boot:</strong> the same library exists for Java (<code>org.testcontainers:postgresql</code>), and Spring Boot can wire a container into the application context with <code>@ServiceConnection</code> — same idea, same reasons.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Write a test that reads <code>SHOW server_version</code> through <code>inject('databaseUrl')</code> and asserts the major version is 17.</li>
<li>In the same test, assert that the <code>btree_gist</code> extension is installed (the constraint depends on it).</li>
<li>Run it once with Testcontainers and once with <code>TEST_DATABASE_URL</code> pointing at the compose database.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th43)}
${ra(gon(OUT['43-th']))}
<p>A test like this protects you from a silent mismatch: someone changes the image to <code>postgres:latest</code>, and the suite tells you before production does.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Testcontainers</span><span class="v">A library that starts throwaway Docker containers from test code and cleans them up.</span></div>
  <div class="kv"><span class="k">Ryuk</span><span class="v">Testcontainers’ helper container that removes leftovers when a run dies.</span></div>
  <div class="kv"><span class="k">provide / inject</span><span class="v">Vitest’s way to pass values from global setup to test files.</span></div>
  <div class="kv"><span class="k">teardown</span><span class="v">Cleanup that runs after the tests — here, the function returned by setup.</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 Testcontainers inside one test run</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">globalSetup</div><div class="lz-d">start postgres:17, apply the schema</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">provide</div><div class="lz-d">hand the connection URL to the workers</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">inject</div><div class="lz-d">each test file reads the URL</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Tests</div><div class="lz-d">run against the real database</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Teardown</div><div class="lz-d">container stopped and removed</div></div>
</div>
<div class="pitfall"><strong>Running integration tests with the unit tests.</strong> If the main config also picks up files that need Docker, every <code>npm run test:unit</code> becomes slow and fails on machines without Docker. Keep them in their own config and their own script.</div>
<h3>📌 Summary</h3>
<ul>
<li>Global setup starts PostgreSQL, applies the schema, provides the URL, and stops the container afterwards.</li>
<li>Tests <code>inject</code> the URL; the port is random, so runs never collide.</li>
<li>Compose for quick local loops, Testcontainers for self-contained runs — one setup supports both.</li>
<li>Pin the image to production’s major version and check it in a test.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Testcontainers cho Node</h2>
<p class="lead">Với Compose, bạn phải nhớ bật cơ sở dữ liệu trước khi test và tắt sau đó. <a href="https://testcontainers.com" target="_blank" rel="noopener">Testcontainers</a> đưa việc đó vào chính lần chạy test: lần chạy bật một container, test dùng nó, lần chạy gỡ nó đi.</p>

<h3>Mỗi lần chạy test một container</h3>
${ma('javascript', CODE.globalSetup)}
<ul>
<li><code>new PostgreSqlContainer('postgres:17').start()</code> bật image (lần đầu thì tải về), chờ tới khi PostgreSQL nhận kết nối và gắn nó vào một <strong>cổng trống ngẫu nhiên</strong>. <code>getConnectionUri()</code> trả về URL kèm cổng đó và tài khoản, mật khẩu của container.</li>
<li>Hàm mà <code>setup</code> trả về là phần teardown (dọn dẹp) của Vitest: chạy một lần sau mọi file test và dừng container. Nếu tiến trình sập, container phụ <strong>Ryuk</strong> của Testcontainers sẽ gỡ nó.</li>
<li>Có <code>TEST_DATABASE_URL</code> thì không bật container nào — một file setup hỗ trợ cả hai cách làm của chương.</li>
</ul>

<h3>provide trong setup, inject trong test</h3>
${ma('javascript', CODE.dbHelpers)}
<p>Các file test chạy trong những tiến trình worker riêng, nên biến trong setup không tự hiện ra với chúng. <code>provide('databaseUrl', url)</code> trong setup và <code>inject('databaseUrl')</code> trong test là kênh chính thức của Vitest giữa hai bên. <code>makeBooking</code> là factory của bài 4.4.</p>

<h3>Cấu hình riêng, và lần chạy thật</h3>
<p>Cấu hình test tích hợp ở bài 4.2 trỏ <code>globalSetup</code> vào file này và cho các file chạy lần lượt (<code>fileParallelism: false</code>, giải thích ở 4.4). Không đặt <code>TEST_DATABASE_URL</code>:</p>
${ra(gon(OUT['43-tc']))}
<p>Ở đây container sẵn sàng sau 1,4 giây; qua mọi lần chạy của chúng tôi là 1,2–2,1 giây khi image đã tải sẵn. Lần chạy đầu tiên trên một máy còn phải tải <code>postgres:17</code> — vài chục giây, một lần.</p>

<h3>Compose hay Testcontainers?</h3>
${SO_VI}
<p>Dùng Compose khi bạn chạy test tích hợp nhiều lần liên tiếp và muốn cơ sở dữ liệu luôn bật; dùng Testcontainers khi mỗi lần chạy phải tự đủ — một bạn mới vào nhóm chạy <code>npm run test:int</code> mà không phải nhớ gì thêm. Trên CI, máy chạy Ubuntu của GitHub có sẵn Docker, nên Testcontainers chạy ngay; hoặc workflow bật PostgreSQL dạng service rồi đặt <code>TEST_DATABASE_URL</code> (Chương 9).</p>
<p><strong>Spring Boot:</strong> thư viện này cũng có cho Java (<code>org.testcontainers:postgresql</code>), và Spring Boot gắn được container vào application context bằng <code>@ServiceConnection</code> — cùng ý tưởng, cùng lý do.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Viết một test đọc <code>SHOW server_version</code> qua <code>inject('databaseUrl')</code> và khẳng định phiên bản chính là 17.</li>
<li>Trong cùng test, khẳng định extension <code>btree_gist</code> đã được cài (ràng buộc phụ thuộc vào nó).</li>
<li>Chạy một lần với Testcontainers và một lần với <code>TEST_DATABASE_URL</code> trỏ vào cơ sở dữ liệu compose.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th43)}
${ra(gon(OUT['43-th']))}
<p>Một test như vậy che cho bạn khỏi sự lệch phiên bản âm thầm: ai đó đổi image thành <code>postgres:latest</code>, và bộ test báo cho bạn trước khi production báo.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Testcontainers</span><span class="v">Thư viện bật container Docker dùng một lần ngay từ code test và tự dọn chúng.</span></div>
  <div class="kv"><span class="k">Ryuk</span><span class="v">Container phụ của Testcontainers, gỡ đồ sót lại khi lần chạy bị chết.</span></div>
  <div class="kv"><span class="k">provide / inject</span><span class="v">Cách Vitest truyền giá trị từ global setup sang các file test.</span></div>
  <div class="kv"><span class="k">teardown (dọn dẹp)</span><span class="v">Phần dọn chạy sau các test — ở đây là hàm mà setup trả về.</span></div>
</div>

<h3>🗺 Testcontainers trong một lần chạy test</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">globalSetup</div><div class="lz-d">bật postgres:17, áp schema</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">provide</div><div class="lz-d">đưa URL kết nối cho các worker</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">inject</div><div class="lz-d">mỗi file test đọc URL</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Test</div><div class="lz-d">chạy trên CSDL thật</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Teardown</div><div class="lz-d">container được dừng và xoá</div></div>
</div>
<div class="pitfall"><strong>Chạy test tích hợp chung với unit test.</strong> Nếu config chính cũng gom các file cần Docker, mọi lần <code>npm run test:unit</code> đều chậm và hỏng trên máy không có Docker. Để chúng trong config riêng và script riêng.</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Global setup bật PostgreSQL, áp schema, cung cấp URL, và dừng container sau đó.</li>
<li>Test <code>inject</code> URL; cổng ngẫu nhiên nên các lần chạy không đụng nhau.</li>
<li>Compose cho vòng lặp nhanh ở máy, Testcontainers cho lần chạy tự đủ — một setup hỗ trợ cả hai.</li>
<li>Ghim image theo phiên bản chính của production và kiểm nó bằng một test.</li>
</ul>
</div>
`,
};
