/**
 * Testing · Chương 10B · 10B.1 — Postman từ số 0: collection, environment và năm tầng biến. BÀI MỚI 24/11/2026, slug tst-10b-1-collection-bien.
 * Chạy thật: newman 6.2.3 với API LabFlow Lite (postman/server.js, container pmn-api); thí nghiệm thứ tự ưu tiên biến 4 lượt.
 */
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const SERVER = CODE.server.split('\n').filter((l, i, a) => {
  const k = a.findIndex((x) => x.includes('// Demo accounts'));
  return i < 7 || (i >= k && i <= k + 8);
}).join('\n');
const RUN_HEAD = OUT['b1-run'].split('\n').slice(0, 17).join('\n');
const RUN_TAIL = OUT['b1-run'].split('\n').filter((l) => /^[┌│├└]/.test(l)).join('\n');

const SCOPE_EN = `<table>
<thead><tr><th>Scope (weakest → strongest)</th><th>Where it lives</th><th>Use it for</th><th>Newman flag</th></tr></thead>
<tbody>
<tr><td>1. Global</td><td>the whole workspace</td><td>almost nothing — it leaks into every collection</td><td><code>--global-var k=v</code>, <code>-g file</code></td></tr>
<tr><td>2. Collection</td><td>inside the collection JSON</td><td>values that belong to the API: passwords of demo users, ids saved between requests</td><td>(in the file)</td></tr>
<tr><td>3. Environment</td><td>a separate file per machine</td><td><code>baseUrl</code> for local / staging / CI, secrets injected by CI</td><td><code>-e file</code>, <code>--env-var k=v</code></td></tr>
<tr><td>4. Data</td><td>one row of a CSV/JSON file</td><td>test cases (lesson 10B.4)</td><td><code>-d file</code></td></tr>
<tr><td>5. Local</td><td>one script run only</td><td>a value computed just before sending</td><td><code>pm.variables.set</code></td></tr>
</tbody></table>`;
const SCOPE_VI = `<table>
<thead><tr><th>Tầng (yếu → mạnh)</th><th>Nằm ở đâu</th><th>Dùng cho</th><th>Cờ Newman</th></tr></thead>
<tbody>
<tr><td>1. Global</td><td>cả workspace</td><td>gần như không gì — nó tràn vào mọi collection</td><td><code>--global-var k=v</code>, <code>-g tệp</code></td></tr>
<tr><td>2. Collection</td><td>ngay trong JSON của collection</td><td>giá trị thuộc về API: mật khẩu tài khoản demo, id lưu giữa các request</td><td>(trong tệp)</td></tr>
<tr><td>3. Environment</td><td>một tệp riêng cho mỗi máy</td><td><code>baseUrl</code> của local / staging / CI, bí mật do CI bơm vào</td><td><code>-e tệp</code>, <code>--env-var k=v</code></td></tr>
<tr><td>4. Data</td><td>một dòng của tệp CSV/JSON</td><td>ca kiểm thử (bài 10B.4)</td><td><code>-d tệp</code></td></tr>
<tr><td>5. Local</td><td>chỉ một lần chạy script</td><td>giá trị tính ngay trước khi gửi</td><td><code>pm.variables.set</code></td></tr>
</tbody></table>`;

const TOOLS_EN = `<table>
<thead><tr><th></th><th>Supertest (Chapter 5)</th><th>Postman + Newman (this chapter)</th></tr></thead>
<tbody>
<tr><td>Where the test lives</td><td>in the repo, next to the code, in JavaScript</td><td>a JSON collection; written by clicking or by hand</td></tr>
<tr><td>Who writes it</td><td>the developer</td><td>developer, QA, BA — anyone who can read HTTP</td></tr>
<tr><td>What it needs</td><td>the app object, imported</td><td>only a URL — the API can be Node, Spring, .NET, or a vendor's</td></tr>
<tr><td>Speed</td><td>milliseconds, no deploy</td><td>needs a running server</td></tr>
<tr><td>Best at</td><td>every rule and error path, in CI on every push</td><td>exploring, sharing with the team, smoke tests on a deployed environment</td></tr>
</tbody></table>`;
const TOOLS_VI = `<table>
<thead><tr><th></th><th>Supertest (Chương 5)</th><th>Postman + Newman (chương này)</th></tr></thead>
<tbody>
<tr><td>Test nằm ở đâu</td><td>trong repo, cạnh mã, viết bằng JavaScript</td><td>một collection JSON; tạo bằng cách bấm hoặc viết tay</td></tr>
<tr><td>Ai viết</td><td>lập trình viên</td><td>lập trình viên, QA, BA — ai đọc được HTTP là viết được</td></tr>
<tr><td>Cần gì</td><td>object app, import vào</td><td>chỉ một URL — API viết bằng Node, Spring, .NET hay của bên thứ ba đều được</td></tr>
<tr><td>Tốc độ</td><td>vài mili giây, không cần triển khai</td><td>cần một server đang chạy</td></tr>
<tr><td>Mạnh nhất ở</td><td>mọi luật và mọi đường lỗi, chạy trong CI mỗi lần push</td><td>khám phá API, chia sẻ cho cả nhóm, smoke test trên môi trường đã triển khai</td></tr>
</tbody></table>`;

const PV_EN = `<ol>
<li><strong>“Environment variable or collection variable — which one for <code>baseUrl</code>?”</strong> Environment: the URL changes per machine (local, staging, CI) while the requests do not. Collection variables travel with the collection to everyone.</li>
<li><strong>“Two scopes define the same name. Which wins?”</strong> The narrower one: local &gt; data &gt; environment &gt; collection &gt; global. Show you measured it rather than memorised it.</li>
<li><strong>“Why would you use Postman when you already have Supertest?”</strong> Different job: Supertest checks the code from inside on every push; a collection checks a running deployment from outside, in a form the QA team and the client can read and run.</li>
<li><strong>“What is in a collection file?”</strong> JSON (schema v2.1): folders, requests, scripts as arrays of lines, collection variables, auth. It is text, so it belongs in git and in code review.</li>
</ol>`;
const PV_VI = `<ol>
<li><strong>“Biến environment hay biến collection — <code>baseUrl</code> để đâu?”</strong> Environment: URL đổi theo máy (local, staging, CI) còn request thì không. Biến collection đi theo collection tới tay mọi người.</li>
<li><strong>“Hai tầng cùng định nghĩa một tên. Cái nào thắng?”</strong> Tầng hẹp hơn: local &gt; data &gt; environment &gt; collection &gt; global. Hãy cho thấy bạn đã đo, không phải học thuộc.</li>
<li><strong>“Đã có Supertest rồi thì dùng Postman làm gì?”</strong> Hai việc khác nhau: Supertest kiểm mã từ bên trong mỗi lần push; collection kiểm một bản đang chạy từ bên ngoài, dưới dạng đội QA và khách hàng đọc và chạy được.</li>
<li><strong>“Trong tệp collection có gì?”</strong> JSON (schema v2.1): folder, request, script là mảng các dòng, biến collection, auth. Nó là chữ, nên thuộc về git và được review như mã.</li>
</ol>`;

export default {
  title: '10B.1 — Postman from zero: collections, environments and five scopes of variables|||10B.1 — Postman từ số 0: collection, environment và năm tầng biến',
  slug: 'tst-10b-1-collection-bien',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao cần test API từ bên ngoài mã khi đã có Supertest; Postman ra đời thế nào; workspace → collection → folder → request; tệp collection v2.1 là JSON vào được git; environment cho từng máy; năm tầng biến và tầng nào thắng (đo thật 4 lượt); chạy cả collection bằng Newman: 14 request, 42 assertion xanh.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10B · Lesson 10B.1</span>
<h2>Postman from zero: collections, environments and five scopes of variables</h2>
<p class="lead">In Chapter 5 you tested the LabFlow Lite API from inside the code with Supertest. On a real project you will also meet the other half: a QA engineer sends you a Postman collection, the client wants “the Postman file” with the delivery, and CI runs it against staging every night. This chapter teaches that half properly — same API, tested from the outside.</p>

<h3>What Postman is, and where it came from</h3>
<p>Postman is an <em>HTTP client</em> (a program that sends HTTP requests and shows the responses) that grew into a platform: you save requests in <strong>collections</strong>, attach JavaScript <strong>test scripts</strong> to them, and run the whole set again and again. It began in 2012 as Abhinav Asthana's side project — a Chrome extension to stop retyping API calls — and became the company Postman, Inc. in 2014. <strong>Newman</strong> is its command-line runner: it reads the same collection file and runs it without a window, which is what makes Postman tests usable in CI.</p>
<p>Where it sits next to what you know:</p>
${TOOLS_EN}
<p>Neither replaces the other. A typical team keeps fast Supertest tests in the repo and a Postman collection as the shared, runnable description of the API — used by QA for manual exploration and by CI as a smoke test after each deploy.</p>

<div class="pitfall co-tieu-de"><p><strong>About this machine.</strong> Every command in this chapter ran for real with <strong>Newman 6.2.3</strong> on Node 22. The Postman desktop app needs a window and an account, so the screenshots of buttons are described from the official docs (learning.postman.com) rather than captured. That costs you nothing: what you click in Postman is saved as exactly the JSON shown below, and <em>File → Import</em> in Postman opens these files as they are.</p></div>

<h3>The API we test</h3>
<p>The Chapter 5 API plus three things a collection needs: a demo login, a tiny OAuth 2.0 token endpoint (lesson 10B.3) and a reset endpoint so every run starts from an empty store. It lives in <code>postman/server.js</code>:</p>
${ma('javascript', SERVER)}
<p>Start it: <code>ALLOW_RESET=1 PORT=43180 node postman/server.js</code>. The reset route is only mounted when <code>ALLOW_RESET=1</code> — a test-only door must never exist in production.</p>

<h3>Workspace → collection → folder → request</h3>
<ul>
<li><strong>Workspace</strong> — a space in your Postman account (personal, team or <em>public</em> — remember that word for lesson 10B.3).</li>
<li><strong>Collection</strong> — a named set of requests with shared variables, auth and scripts. Ours is <em>LabFlow Lite API</em>.</li>
<li><strong>Folder</strong> — groups requests; folders run in order, top to bottom. We use <em>0 Setup, 1 Auth, 2 Bookings, 3 Admin</em>.</li>
<li><strong>Request</strong> — method, URL, headers, body, plus a <em>pre-request script</em> (runs before sending) and a <em>test script</em> (runs after the response).</li>
</ul>
<p>Saved to disk (Postman: <em>⋯ → Export → Collection v2.1</em>), the collection is plain JSON. Here is its top and one request:</p>
${ma('json', CODE.excerpt)}
<p>Three things to notice. <code>{{baseUrl}}</code> and <code>{{tokenAn}}</code> are <strong>variables</strong>, filled in at send time. The collection-level <code>auth</code> is inherited by every request that does not override it. Scripts are stored as arrays of lines — so a diff in a pull request shows exactly which assertion changed.</p>

<h3>Environments: one file per machine</h3>
<p>The collection never contains a host name. The <strong>environment</strong> does:</p>
${ma('json', CODE.env)}
<p>Staging gets its own file with another <code>baseUrl</code>; CI gets its own (lesson 10B.5). Same requests, different place.</p>

<h3>Five scopes, one winner — measured</h3>
${SCOPE_EN}
<p>To see the order for real, a one-request collection defines <code>who</code> in every scope and prints the value that was actually sent:</p>
${ma('json', CODE.scopeCol)}
${ra(OUT['b1-scope'])}
<p>Read it top to bottom: the global value never won while the collection had one; the environment beat the collection; a data row beat the environment; a local value set in the pre-request script beat everything. The narrower the scope, the stronger it is.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a forgotten global.</strong> A global with the same name as an environment variable is harmless today (it loses). Delete the environment variable and the stale global quietly takes over — your requests go to an old host and nobody sees why. Keep globals empty.</p></div>
<p>In the Postman app each variable also has an <strong>initial value</strong> (saved in the collection/environment, synced to your Postman account and shared with the workspace) and a <strong>current value</strong> (only on your machine). Secrets go in the current value only — or better, nowhere in the file at all. Lesson 10B.3 shows why with a real 2024 incident.</p>

<h3>Run the whole collection with Newman</h3>
<p>Install once in the project: <code>npm install --save-dev newman@6.2.3</code>. Then:</p>
${ra(RUN_HEAD)}
<p>… and after the last folder, the summary:</p>
${ra(RUN_TAIL)}
<p>14 requests, 28 test scripts, 42 assertions, under a second. In the Postman app the same thing is the <em>Collection Runner</em> (<em>Run collection</em> on the collection's menu). Newman's exit code is 0 here; one failed assertion makes it 1 — the only thing CI needs.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Create a <code>staging.postman_environment.json</code> whose <code>baseUrl</code> is <code>http://localhost:43181</code>, start a second server on that port, and run the collection against it without touching the collection.</li>
<li>Then run against the first server again, overriding just the URL from the command line.</li>
</ol>
<details><summary>Solution and real result</summary>
<p>1. Copy the environment file, change one value, <code>PORT=43181 ALLOW_RESET=1 node postman/server.js</code>, then <code>newman run labflow.postman_collection.json -e staging.postman_environment.json</code>. 2. <code>newman run labflow.postman_collection.json -e staging.postman_environment.json --env-var baseUrl=http://localhost:43180</code> — <code>--env-var</code> overrides a value inside the loaded environment. Both runs end with the same table as above: 42 assertions, 0 failed.</p>
</details>
<p><strong>Done when</strong> you can point the same collection at two servers without editing it.</p>
</div>

<h3>In real life</h3>
<p>A collection is a recipe book, an environment is the kitchen. The recipe says “oven at 180°”; whether that oven is at home or in the restaurant is the kitchen's business. Hard-code the restaurant's address into every recipe and you can never cook at home.</p>
<p><strong>On an outsourcing project:</strong> the customer's QA hands you <code>Booking_API_v3.postman_collection.json</code> where every URL is <code>https://api-uat.customer.com/…</code> typed by hand. First job before running anything: replace the host with <code>{{baseUrl}}</code>, move it to an environment, and commit both. Otherwise the first “quick test” from your laptop writes into the customer's UAT data.</p>

<h3>🎤 What an interviewer will ask</h3>
${PV_EN}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">collection</span><span class="v">A saved set of requests with shared variables, auth and scripts; a JSON file (schema v2.1).</span></div>
  <div class="kv"><span class="k">environment</span><span class="v">A set of variables for one place the API runs (local, staging, CI).</span></div>
  <div class="kv"><span class="k">variable scope</span><span class="v">Where a variable is defined; the narrower scope wins: local &gt; data &gt; environment &gt; collection &gt; global.</span></div>
  <div class="kv"><span class="k">initial / current value</span><span class="v">Postman app: initial is saved and shared; current stays on your machine.</span></div>
  <div class="kv"><span class="k">Newman</span><span class="v">Postman's command-line runner; same collection file, no window, exit code for CI.</span></div>
  <div class="kv"><span class="k">Collection Runner</span><span class="v">The Postman app's button that runs every request of a collection in order.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Supertest tests the code from inside; a collection tests a running API from outside, in a form the whole team can run.</li>
<li>A collection is JSON — keep it in git. Hosts live in environments, never in requests.</li>
<li>Measured scope order: local &gt; data &gt; environment &gt; collection &gt; global. Keep globals empty.</li>
<li>Newman runs the same file in CI: 14 requests, 42 assertions, exit code 0.</li>
</ul>
${lienKet({ khoa: 'api-design', bai: 'api-0-2-bo-cong-cu', title: 'Also in API Design — 0.2: curl, HTTPie, Postman and Bruno', sub: 'The first look at each tool and its traps. This chapter goes deep on Postman as a test runner.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'testing', bai: 'tst-5-1-supertest', title: 'Back to 5.1 — Supertest', sub: 'The same API tested from inside the code.', cta: 'OPEN LESSON →' })}
${nguon('📘', 'Postman Docs — Variables', 'Scopes, initial and current values.', 'https://learning.postman.com/docs/sending-requests/variables/variables/')}
${nguon('📘', 'Newman on GitHub', 'Command-line options and reporters.', 'https://github.com/postmanlabs/newman')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10B · Bài 10B.1</span>
<h2>Postman từ số 0: collection, environment và năm tầng biến</h2>
<p class="lead">Ở Chương 5 bạn đã test API LabFlow Lite từ bên trong mã bằng Supertest. Đi làm thật bạn còn gặp nửa kia: kỹ sư QA gửi bạn một collection Postman, khách hàng đòi “tệp Postman” kèm bản bàn giao, và CI chạy nó vào môi trường staging mỗi đêm. Chương này dạy cho đến nơi nửa đó — cùng API, nhưng test từ bên ngoài.</p>

<h3>Postman là gì, ra đời thế nào</h3>
<p>Postman là một <em>HTTP client</em> (chương trình gửi request HTTP và hiện phản hồi) rồi lớn thành cả một nền tảng: bạn lưu request vào <strong>collection</strong>, gắn <strong>test script</strong> JavaScript cho chúng, và chạy lại cả bộ bao nhiêu lần cũng được. Nó bắt đầu năm 2012 là dự án làm thêm của Abhinav Asthana — một tiện ích Chrome để khỏi gõ lại các lời gọi API — rồi thành công ty Postman, Inc. năm 2014. <strong>Newman</strong> là trình chạy dòng lệnh của nó: đọc đúng tệp collection ấy và chạy không cần cửa sổ — nhờ vậy test Postman mới dùng được trong CI.</p>
<p>Đặt cạnh thứ bạn đã biết:</p>
${TOOLS_VI}
<p>Không cái nào thay cái nào. Một đội điển hình giữ test Supertest nhanh trong repo, và một collection Postman làm bản mô tả API dùng chung, chạy được — QA dùng để khám phá bằng tay, CI dùng làm smoke test sau mỗi lần triển khai.</p>

<div class="pitfall co-tieu-de"><p><strong>Về máy chạy bài này.</strong> Mọi lệnh trong chương đều chạy thật bằng <strong>Newman 6.2.3</strong> trên Node 22. Ứng dụng Postman desktop cần cửa sổ và tài khoản, nên các nút bấm được tả theo tài liệu chính thức (learning.postman.com) chứ không chụp. Bạn không mất gì: thứ bạn bấm trong Postman được lưu thành đúng JSON bên dưới, và <em>File → Import</em> trong Postman mở nguyên các tệp này.</p></div>

<h3>API chúng ta test</h3>
<p>API của Chương 5 cộng ba thứ một collection cần: đăng nhập demo, một endpoint cấp token OAuth 2.0 nhỏ (bài 10B.3) và endpoint reset để lần chạy nào cũng bắt đầu từ kho rỗng. Nằm ở <code>postman/server.js</code>:</p>
${ma('javascript', SERVER)}
<p>Bật lên: <code>ALLOW_RESET=1 PORT=43180 node postman/server.js</code>. Route reset chỉ được gắn khi <code>ALLOW_RESET=1</code> — cửa chỉ dành cho test thì không bao giờ được tồn tại trên production.</p>

<h3>Workspace → collection → folder → request</h3>
<ul>
<li><strong>Workspace</strong> — một không gian trong tài khoản Postman (cá nhân, nhóm hoặc <em>công khai</em> — nhớ chữ này cho bài 10B.3).</li>
<li><strong>Collection</strong> — một bộ request có tên, dùng chung biến, auth và script. Của ta là <em>LabFlow Lite API</em>.</li>
<li><strong>Folder</strong> — gom request; folder chạy theo thứ tự từ trên xuống. Ta dùng <em>0 Setup, 1 Auth, 2 Bookings, 3 Admin</em>.</li>
<li><strong>Request</strong> — method, URL, header, body, cộng một <em>pre-request script</em> (chạy trước khi gửi) và một <em>test script</em> (chạy sau khi có phản hồi).</li>
</ul>
<p>Lưu ra đĩa (Postman: <em>⋯ → Export → Collection v2.1</em>), collection là JSON thuần. Đây là phần đầu và một request:</p>
${ma('json', CODE.excerpt)}
<p>Ba điều cần thấy. <code>{{baseUrl}}</code> và <code>{{tokenAn}}</code> là <strong>biến</strong>, được điền lúc gửi. <code>auth</code> ở mức collection được mọi request kế thừa nếu request đó không ghi đè. Script lưu thành mảng các dòng — nên diff trong pull request cho thấy đúng assertion nào đã đổi.</p>

<h3>Environment: mỗi máy một tệp</h3>
<p>Collection không bao giờ chứa tên máy chủ. <strong>Environment</strong> chứa:</p>
${ma('json', CODE.env)}
<p>Staging có tệp riêng với <code>baseUrl</code> khác; CI có tệp riêng (bài 10B.5). Cùng request, khác nơi chạy.</p>

<h3>Năm tầng biến, một người thắng — đo thật</h3>
${SCOPE_VI}
<p>Để thấy thứ tự thật, một collection một request định nghĩa <code>who</code> ở mọi tầng và in giá trị thực sự được gửi đi:</p>
${ma('json', CODE.scopeCol)}
${ra(OUT['b1-scope'])}
<p>Đọc từ trên xuống: giá trị global không bao giờ thắng khi collection có giá trị; environment thắng collection; một dòng data thắng environment; giá trị local đặt trong pre-request script thắng tất cả. Tầng càng hẹp càng mạnh.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — một biến global bị bỏ quên.</strong> Global trùng tên với biến environment hôm nay vô hại (nó thua). Xoá biến environment đi là global cũ lặng lẽ lên thay — request của bạn chạy vào một máy chủ cũ mà không ai hiểu vì sao. Để global trống.</p></div>
<p>Trong ứng dụng Postman mỗi biến còn có <strong>initial value</strong> (lưu trong collection/environment, đồng bộ lên tài khoản Postman và chia sẻ cho cả workspace) và <strong>current value</strong> (chỉ nằm trên máy bạn). Bí mật chỉ để ở current value — hoặc tốt hơn, không nằm trong tệp nào cả. Bài 10B.3 cho thấy vì sao bằng một sự cố thật năm 2024.</p>

<h3>Chạy cả collection bằng Newman</h3>
<p>Cài một lần trong dự án: <code>npm install --save-dev newman@6.2.3</code>. Rồi:</p>
${ra(RUN_HEAD)}
<p>… và sau folder cuối, bảng tổng kết:</p>
${ra(RUN_TAIL)}
<p>14 request, 28 test script, 42 assertion, chưa tới một giây. Trong ứng dụng Postman việc này là <em>Collection Runner</em> (mục <em>Run collection</em> trong menu của collection). Mã thoát của Newman ở đây là 0; một assertion đỏ là thành 1 — đó là thứ duy nhất CI cần.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Tạo <code>staging.postman_environment.json</code> có <code>baseUrl</code> là <code>http://localhost:43181</code>, bật server thứ hai ở cổng đó, và chạy collection vào nó mà không sửa collection.</li>
<li>Rồi chạy lại vào server đầu tiên, chỉ ghi đè URL từ dòng lệnh.</li>
</ol>
<details><summary>Lời giải và kết quả thật</summary>
<p>1. Chép tệp environment, đổi một giá trị, <code>PORT=43181 ALLOW_RESET=1 node postman/server.js</code>, rồi <code>newman run labflow.postman_collection.json -e staging.postman_environment.json</code>. 2. <code>newman run labflow.postman_collection.json -e staging.postman_environment.json --env-var baseUrl=http://localhost:43180</code> — <code>--env-var</code> ghi đè một giá trị bên trong environment đã nạp. Cả hai lượt kết thúc bằng đúng bảng như trên: 42 assertion, 0 đỏ.</p>
</details>
<p><strong>Xong khi</strong> bạn chĩa được cùng một collection vào hai server mà không sửa nó.</p>
</div>

<h3>Liên hệ đời thường</h3>
<p>Collection là cuốn sách công thức, environment là căn bếp. Công thức ghi “lò 180°”; lò đó ở nhà hay ở nhà hàng là việc của căn bếp. Ghi cứng địa chỉ nhà hàng vào từng công thức thì bạn không bao giờ nấu ở nhà được.</p>
<p><strong>Ở dự án outsourcing:</strong> QA bên khách hàng đưa bạn <code>Booking_API_v3.postman_collection.json</code> mà URL nào cũng là <code>https://api-uat.customer.com/…</code> gõ tay. Việc đầu tiên trước khi chạy bất cứ gì: thay host bằng <code>{{baseUrl}}</code>, chuyển nó sang environment, commit cả hai. Không thì lần “test thử nhanh” đầu tiên từ laptop của bạn sẽ ghi thẳng vào dữ liệu UAT của khách.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
${PV_VI}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">collection (bộ request)</span><span class="v">Một bộ request đã lưu, dùng chung biến, auth và script; là một tệp JSON (schema v2.1).</span></div>
  <div class="kv"><span class="k">environment (môi trường)</span><span class="v">Một bộ biến cho một nơi API chạy (local, staging, CI).</span></div>
  <div class="kv"><span class="k">variable scope (tầng biến)</span><span class="v">Nơi biến được định nghĩa; tầng hẹp hơn thắng: local &gt; data &gt; environment &gt; collection &gt; global.</span></div>
  <div class="kv"><span class="k">initial / current value</span><span class="v">Trong ứng dụng Postman: initial được lưu và chia sẻ; current chỉ ở trên máy bạn.</span></div>
  <div class="kv"><span class="k">Newman</span><span class="v">Trình chạy dòng lệnh của Postman; cùng tệp collection, không cửa sổ, có mã thoát cho CI.</span></div>
  <div class="kv"><span class="k">Collection Runner</span><span class="v">Nút trong ứng dụng Postman chạy lần lượt mọi request của một collection.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Supertest kiểm mã từ bên trong; collection kiểm một API đang chạy từ bên ngoài, dưới dạng cả đội chạy được.</li>
<li>Collection là JSON — để trong git. Host nằm ở environment, không bao giờ nằm trong request.</li>
<li>Thứ tự tầng đo được: local &gt; data &gt; environment &gt; collection &gt; global. Để global trống.</li>
<li>Newman chạy đúng tệp đó trong CI: 14 request, 42 assertion, mã thoát 0.</li>
</ul>
${lienKet({ khoa: 'api-design', bai: 'api-0-2-bo-cong-cu', title: 'Bên khoá API Design — 0.2: curl, HTTPie, Postman và Bruno', sub: 'Lần làm quen đầu tiên với từng công cụ và bẫy của nó. Chương này đi sâu vào Postman như một trình chạy test.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'testing', bai: 'tst-5-1-supertest', title: 'Quay lại 5.1 — Supertest', sub: 'Cùng API, test từ bên trong mã.', cta: 'MỞ BÀI →' })}
${nguon('📘', 'Postman Docs — Variables', 'Các tầng biến, initial và current value.', 'https://learning.postman.com/docs/sending-requests/variables/variables/')}
${nguon('📘', 'Newman trên GitHub', 'Tuỳ chọn dòng lệnh và reporter.', 'https://github.com/postmanlabs/newman')}
</div>
`,
};
