/**
 * Testing · Chương 10B · 10B.6 — Mock server, và Postman so với Bruno, REST Client, HTTPie. BÀI MỚI 24/11/2026, slug tst-10b-6-mock-cong-cu.
 * Chạy thật: Prism 5.14.2 mock từ openapi.json (hợp đồng nghèo ⇒ "1898-07-18", "28:44") và từ openapi-mock.json (có ví dụ) — 09:15 vẫn 201;
 * collection chạy vào mock: 10 đỏ / 43; prism proxy vào API thật: 42/42, cảnh báo route ngoài hợp đồng.
 * Bruno CLI 4.3.0 (3/3, mật khẩu sai exit 1), httpyac 6.16.7 chạy tệp .http (exit 20 khi đỏ), HTTPie 3.2.4 (--ignore-stdin; seats=12 là chuỗi ⇒ 400, exit 4).
 * Postman Mock Server (đám mây, cần tài khoản) KHÔNG chạy — tả theo tài liệu Postman.
 */
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const lines = (t) => t.split('\n');
const gonPrism = (t) => lines(t).filter((l) => !/^(Access-Control|Date|Connection|Keep-Alive|Content-Length)/.test(l)).map((l) => (l.length > 150 ? l.slice(0, 150) + ' …' : l)).join('\n');
const P1 = gonPrism(OUT['b6-prism']);
const P2 = gonPrism(OUT['b6-prism2']);
const MOCK_FAILS = lines(OUT['b6-mock-run']).filter((l) => /^\$ |^ +[0-9]+\.  |│ +assertions/.test(l)).join('\n');
const MOCK_OFFGRID = (() => { const a = lines(OUT['b6-mock-run']); const i = a.findIndex((l) => l.startsWith('↳ Off the 30-minute grid')); return a.slice(i, i + 5).join('\n'); })();
const TH6_TRUOC = OUT['th6-truoc'];
const TH6_SAU = OUT['th6-sau'];
const TH6_RUN = (() => { const a = lines(OUT.th6); const i = a.findIndex((l) => l.startsWith('❏ 3 Admin')); const j = a.findIndex((l, k) => k > i && l.startsWith('┌')); return a.slice(i, j).join('\n').trim() + '\n' + a.filter((l) => /│ +assertions/.test(l)).join('\n'); })();
const PROXY = lines(OUT['b6-proxy-run']).filter((l) => /^\$ |│ +assertions/.test(l)).join('\n') + '\n' + OUT['b6-proxy-log'];

const MOCK_EN = `<table>
<thead><tr><th></th><th>Postman Mock Server</th><th>Prism (Stoplight)</th></tr></thead>
<tbody>
<tr><td>Runs where</td><td>Postman's cloud (a URL like <code>https://&lt;id&gt;.mock.pstmn.io</code>), needs an account</td><td>your machine or CI, <code>npx @stoplight/prism-cli mock</code></td></tr>
<tr><td>Answers from</td><td>the <em>examples</em> saved on requests in a collection</td><td>an OpenAPI file: examples, or data generated from schemas</td></tr>
<tr><td>Choosing a response</td><td>matches method + path (+ query/body if enabled); header <code>x-mock-response-code</code> / <code>x-mock-response-name</code></td><td>header <code>Prefer: code=409</code>, <code>Prefer: dynamic=true</code></td></tr>
<tr><td>Validates requests</td><td>no</td><td>yes — against the contract (<code>sl-violations</code>)</td></tr>
<tr><td>Proxy mode</td><td>no</td><td>yes — forwards to the real API and checks its answers</td></tr>
<tr><td>Measured here</td><td>not run (no cloud account) — from Postman's docs</td><td>everything below</td></tr>
</tbody></table>`;
const MOCK_VI = `<table>
<thead><tr><th></th><th>Postman Mock Server</th><th>Prism (Stoplight)</th></tr></thead>
<tbody>
<tr><td>Chạy ở đâu</td><td>đám mây của Postman (URL kiểu <code>https://&lt;id&gt;.mock.pstmn.io</code>), cần tài khoản</td><td>máy bạn hoặc CI, <code>npx @stoplight/prism-cli mock</code></td></tr>
<tr><td>Trả lời từ</td><td>các <em>example</em> lưu trên request trong collection</td><td>một tệp OpenAPI: ví dụ, hoặc dữ liệu sinh từ schema</td></tr>
<tr><td>Chọn phản hồi</td><td>khớp method + path (+ query/body nếu bật); header <code>x-mock-response-code</code> / <code>x-mock-response-name</code></td><td>header <code>Prefer: code=409</code>, <code>Prefer: dynamic=true</code></td></tr>
<tr><td>Kiểm request</td><td>không</td><td>có — theo hợp đồng (<code>sl-violations</code>)</td></tr>
<tr><td>Chế độ proxy</td><td>không</td><td>có — chuyển tới API thật và kiểm câu trả lời của nó</td></tr>
<tr><td>Đo ở đây</td><td>không chạy (không có tài khoản đám mây) — theo tài liệu Postman</td><td>mọi thứ bên dưới</td></tr>
</tbody></table>`;

const TOOLS_EN = `<table>
<thead><tr><th></th><th>Postman</th><th>Bruno</th><th>.http (REST Client / httpyac)</th><th>HTTPie</th></tr></thead>
<tbody>
<tr><td>Kind</td><td>desktop + cloud platform</td><td>desktop app, offline-first</td><td>plain text file in the editor</td><td>command line</td></tr>
<tr><td>Stored as</td><td>one JSON collection (or in your account)</td><td>one <code>.bru</code> text file per request, in your repo</td><td>one <code>.http</code> file</td><td>shell commands</td></tr>
<tr><td>Account needed</td><td>for workspaces, sync, mocks</td><td>no</td><td>no</td><td>no</td></tr>
<tr><td>Tests</td><td><code>pm.test</code> + Chai</td><td><code>test()</code> + Chai <code>expect</code></td><td>httpyac: <code>?? status == 201</code>; REST Client: none</td><td><code>--check-status</code> only</td></tr>
<tr><td>CLI for CI</td><td>Newman (exit 1)</td><td><code>bru run</code> (exit 1)</td><td><code>httpyac send --all</code> (exit 20)</td><td>itself (exit 4 on 4xx)</td></tr>
<tr><td>Best for</td><td>teams, QA, mocks, docs, sharing with a client</td><td>developers who want requests reviewed in git</td><td>a few requests next to the code</td><td>one quick call in a terminal or script</td></tr>
</tbody></table>`;
const TOOLS_VI = `<table>
<thead><tr><th></th><th>Postman</th><th>Bruno</th><th>.http (REST Client / httpyac)</th><th>HTTPie</th></tr></thead>
<tbody>
<tr><td>Loại</td><td>desktop + nền tảng đám mây</td><td>ứng dụng desktop, ưu tiên ngoại tuyến</td><td>tệp chữ thường trong trình soạn</td><td>dòng lệnh</td></tr>
<tr><td>Lưu dạng</td><td>một collection JSON (hoặc trong tài khoản)</td><td>mỗi request một tệp chữ <code>.bru</code>, trong repo của bạn</td><td>một tệp <code>.http</code></td><td>lệnh shell</td></tr>
<tr><td>Cần tài khoản</td><td>cho workspace, đồng bộ, mock</td><td>không</td><td>không</td><td>không</td></tr>
<tr><td>Test</td><td><code>pm.test</code> + Chai</td><td><code>test()</code> + Chai <code>expect</code></td><td>httpyac: <code>?? status == 201</code>; REST Client: không có</td><td>chỉ <code>--check-status</code></td></tr>
<tr><td>CLI cho CI</td><td>Newman (exit 1)</td><td><code>bru run</code> (exit 1)</td><td><code>httpyac send --all</code> (exit 20)</td><td>chính nó (exit 4 khi 4xx)</td></tr>
<tr><td>Hợp nhất cho</td><td>đội, QA, mock, tài liệu, chia sẻ với khách</td><td>lập trình viên muốn request được review trong git</td><td>vài request ngay cạnh mã</td><td>một lời gọi nhanh trong terminal hoặc script</td></tr>
</tbody></table>`;

const PV_EN = `<ol>
<li><strong>“The frontend team needs the API before the backend is ready.”</strong> Agree the OpenAPI contract with examples, run a mock from it (Prism locally, or a Postman mock), and keep the same collection to test the real backend later. Measured: a mock answers 201 to an off-grid booking — it shows shapes, not rules.</li>
<li><strong>“What can a mock not tell you?”</strong> Anything about behaviour: business rules, permissions, state between requests. Against the mock, 10 of 43 assertions failed exactly on those.</li>
<li><strong>“Postman or Bruno?”</strong> Postman for team workspaces, mocks and non-developers; Bruno when requests must live in git as reviewable text and nothing may go to a cloud. Both run in CI.</li>
<li><strong>“How would you check the real API still matches its OpenAPI contract?”</strong> Run the existing collection through a validating proxy (Prism proxy) or validate responses in tests (Chapter 5's Ajv check).</li>
</ol>`;
const PV_VI = `<ol>
<li><strong>“Đội frontend cần API trước khi backend xong.”</strong> Chốt hợp đồng OpenAPI có ví dụ, chạy mock từ nó (Prism ở máy, hoặc mock của Postman), và giữ đúng collection đó để sau này test backend thật. Đo được: mock trả 201 cho lượt đặt lệch lưới — nó cho thấy hình dạng, không cho thấy luật.</li>
<li><strong>“Mock không nói được gì cho bạn?”</strong> Mọi thứ về hành vi: luật nghiệp vụ, phân quyền, trạng thái giữa các request. Chạy vào mock, 10/43 assertion đỏ đúng ở những chỗ đó.</li>
<li><strong>“Postman hay Bruno?”</strong> Postman cho workspace của đội, mock và người không phải lập trình viên; Bruno khi request phải nằm trong git dưới dạng chữ review được và không được gửi gì lên đám mây. Cả hai đều chạy trong CI.</li>
<li><strong>“Kiểm API thật còn khớp hợp đồng OpenAPI thế nào?”</strong> Cho collection có sẵn chạy qua một proxy kiểm hợp đồng (Prism proxy) hoặc kiểm phản hồi ngay trong test (bước Ajv của Chương 5).</li>
</ol>`;

export default {
  title: '10B.6 — Mock servers, and Postman next to Bruno, REST Client and HTTPie|||10B.6 — Mock server, và Postman đặt cạnh Bruno, REST Client, HTTPie',
  slug: 'tst-10b-6-mock-cong-cu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mock server từ hợp đồng OpenAPI bằng Prism (đo thật: hợp đồng nghèo sinh ngày 1898 và giờ 28:44; có ví dụ thì giống thật nhưng 09:15 vẫn 201; collection chạy vào mock đỏ 10/43 đúng ở luật và phân quyền), Prism proxy kiểm API thật; Postman Mock Server theo tài liệu; cùng ba request viết bằng Bruno, tệp .http và HTTPie — kèm bẫy --ignore-stdin và seats=12 thành chuỗi; bảng chọn công cụ và chuyện Postman bỏ Scratch Pad năm 2023.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10B · Lesson 10B.6</span>
<h2>Mock servers, and Postman next to Bruno, REST Client and HTTPie</h2>
<p class="lead">Two questions every team asks sooner or later: “Can the frontend start before the API exists?” and “Do we really need Postman for this?” This lesson answers both with measurements — a mock built from the contract, then the same three requests in three other tools.</p>

<h3>What a mock server is for</h3>
<p>A <strong>mock server</strong> answers HTTP requests with canned or generated responses that follow the agreed contract, with no real logic behind it. The frontend can build screens against it on day one; the QA team can write the collection before the backend exists; a demo can run without a database. Two ways to get one:</p>
${MOCK_EN}

<h3>A mock is only as good as its contract</h3>
<p>Start Prism from the Chapter 5 <code>openapi.json</code> as it is — it describes responses but has no request body schema and no examples:</p>
${ra(P1)}
<p>The request was refused because the contract declares no body; the generated error body is <code>"code": "string"</code>; and asking for a dynamic booking returns a date in 1898, an end time of 28:44 and 13 million seats. Every value matches the <em>schema</em> (a string matching <code>^[0-2][0-9]:[0-5][0-9]$</code> may well be 28:44). Nobody can build a screen on that. A contract written for mocking adds a request body and <em>examples</em> (<code>postman/openapi-mock.json</code>, made by a small script from the original):</p>
${ma('json', CODE.mockSpec)}
${ra(P2)}
<p>Now it looks real — and look at what it does. Start time 09:15, off the 30-minute grid: <strong>201 Created</strong>, and the body says 09:00, because it is the example, not your booking. <code>Prefer: code=409</code> gives the OVERLAP example on demand, which is perfect for building the frontend's error message. No token: 401 — Prism checks the security scheme. An invalid body: 422 with the <code>OFF_GRID</code> example, where the real API answers 400 VALIDATION. Run the whole collection against the mock:</p>
${ra(MOCK_FAILS)}
${ra(MOCK_OFFGRID)}
<p>Ten failures, and each one is a rule or a permission: reset and login are not in the contract (404), another student <em>can</em> read the booking, the same slot can be booked twice, a student can list all bookings. A mock tells you the shapes are right; only the real API can tell you the rules are right.</p>

<h3>The other direction: a proxy that checks the real API</h3>
<p>Prism can also sit <em>in front of</em> the real API, forward every request and validate both sides against the contract. Point the same collection at it:</p>
${ra(PROXY)}
<p>The real API passed all 42 assertions. The validator flagged six requests to routes the contract does not describe (<code>/api/test/reset</code>, <code>/api/login</code>) and the two requests that are <em>meant</em> to be wrong (no token; <code>role</code> in the body). No response violated the contract. Run this nightly and a field renamed in the code without the contract shows up as a violation — the drift Chapter 5's contract test catches from inside.</p>
<div class="pitfall co-tieu-de"><p><strong>Postman's own mocks (not run here).</strong> In the Postman app you save <em>examples</em> on a request (a response you captured or typed), then <em>Mock collection</em> gives you a cloud URL. Postman picks the example whose method and path match; with several, it chooses by headers <code>x-mock-response-code</code> or <code>x-mock-response-name</code>. Same limit as above: it returns the example you saved, never what your request should have caused. And it runs in the cloud — the same workspace rules as lesson 10B.3 apply to examples that contain real data.</p></div>

<h3>The same three requests in Bruno</h3>
<p>Bruno (open source, MIT, 2022) stores each request as a small text file in your repo and needs no account. Two of the three files:</p>
${ma('text', CODE.bru1)}
${ma('text', CODE.bru2)}
${ra(OUT['b6-bruno'])}
<p>With a wrong password <code>bru run</code> reports <em>Tests 1/3</em> and exits 1 — usable in CI like Newman. The real advantage shows in a pull request: changing one assertion is a one-line diff in one small file.</p>

<h3>A <code>.http</code> file: REST Client and httpyac</h3>
<p>VS Code's <em>REST Client</em> extension reads <code>.http</code> files: requests separated by <code>###</code>, sent with a click above each one. <strong>httpyac</strong> reads the same format from the command line and adds assertions:</p>
${ma('http', CODE.http)}
${ra(OUT['b6-httpyac'])}
<p>Two honest limits. The <code>?? status == 201</code> lines and the short form <code>{{login.token}}</code> are httpyac's; REST Client has no assertions and writes request variables as <code>{{login.response.body.$.token}}</code>. And on failure httpyac exits with code 20 (measured), not 1 — fine for CI, but do not test for <code>== 1</code>.</p>

<h3>HTTPie in a script</h3>
<p>HTTPie is curl with readable syntax: <code>key=value</code> sends JSON strings, <code>key:=value</code> sends raw JSON (numbers, booleans). Two traps, both measured:</p>
${ra(OUT['b6-httpie'])}
<p>First, in a script or CI step stdin is not a terminal, and HTTPie refuses to mix it with <code>key=value</code> data — add <code>--ignore-stdin</code>. Second, <code>seats=12</code> sends <code>"12"</code>: the same string-versus-number trap as the quoted CSV in 10B.4, and <code>--check-status</code> turns the 400 into exit code 4.</p>

<h3>Choosing</h3>
${TOOLS_EN}
<p>Why Bruno exists at all: in 2023 Postman deprecated its offline <em>Scratch Pad</em>, so using the app meant signing in and syncing to Postman's cloud; the same year Insomnia 8 briefly required an account too. Teams that may not put customer requests into a third-party cloud — banks, many outsourcing contracts — moved to tools that keep everything in the repo. Check your project's rules before choosing.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>In the run against the mock, “Admin lists all — contains our booking” was ✓. Find out why it is green by luck, then add an example for <code>GET /api/admin/bookings</code> so it is green on purpose. Finally explain in one sentence why “Student cannot list all” cannot be made green on a mock.</p>
<details><summary>Solution and real output</summary>
${ra(TH6_TRUOC)}
<p>Without an example Prism generates one static item, and its id happens to be 1 — the same <code>bookingId</code> the collection saved from the 201 example. Note also <code>"lab": "string"</code>: the static generator ignores the <code>pattern</code> of its own schema. Add <code>"example": [ booking 1, booking 2 ]</code> under <code>paths['/api/admin/bookings'].get.responses['200'].content['application/json']</code>:</p>
${ra(TH6_SAU)}
${ra(TH6_RUN)}
<p>“contains our booking” is now green because the example says so. “Student cannot list all” stays red: the mock has no idea who is calling and answers the 200 example to everyone; asking for <code>Prefer: code=403</code> would make the admin get 403 as well. Permissions are behaviour, and a mock has none.</p>
</details>
<p><strong>Done when</strong> you can name two failures that only the real API can fix.</p>
</div>

<h3>In real life</h3>
<p>A mock is the cardboard model of a house: you can check the room sizes and where the windows go, but you cannot test whether the plumbing works. Architects still build the model — before the concrete is poured.</p>
<p><strong>On a project:</strong> in many outsourcing projects the backend and the mobile app are built by two teams in parallel, sometimes in two companies. The OpenAPI contract with examples is signed off first; the mobile team works against the mock for weeks. The day the backend is ready, run the collection against both — the differences are your integration bug list.</p>

<h3>🎤 What an interviewer will ask</h3>
${PV_EN}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mock server</span><span class="v">Answers with responses from a contract or saved examples; no real logic.</span></div>
  <div class="kv"><span class="k">example</span><span class="v">A saved sample response used by a mock.</span></div>
  <div class="kv"><span class="k">validating proxy</span><span class="v">Forwards to the real API and checks requests and responses against the contract.</span></div>
  <div class="kv"><span class="k">contract drift</span><span class="v">The API's real behaviour slowly differing from its documented contract.</span></div>
  <div class="kv"><span class="k">.bru / .http</span><span class="v">Plain-text request files of Bruno / REST Client and httpyac.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A mock needs examples in the contract; without them Prism invented 1898 and 28:44.</li>
<li>Measured: a mock answers 201 to an off-grid booking; the collection failed 10/43 against it, all on rules and permissions.</li>
<li>Prism proxy runs the real API under contract validation: 42/42, only intended violations.</li>
<li>Bruno, <code>.http</code> + httpyac and HTTPie ran the same requests; each exits non-zero on failure (1, 20, 4).</li>
<li>Choose by who uses it and where data may live, not by fashion.</li>
</ul>
${lienKet({ khoa: 'api-design', bai: 'api-7-1-kiem-hop-dong', title: 'API Design — 7.1: checking the contract', sub: 'OpenAPI as the source of truth, and how to keep the API honest to it.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'testing', bai: 'tst-5-4-hop-dong', title: 'Back to 5.4 — Contract tests with OpenAPI and Ajv', sub: 'The same check from inside the code.', cta: 'OPEN LESSON →' })}
${nguon('📘', 'Prism — Stoplight', 'Mock and validation proxy from an OpenAPI file.', 'https://github.com/stoplightio/prism')}
${nguon('📘', 'Postman Docs — Set up a mock server', 'Examples, matching, x-mock-response headers.', 'https://learning.postman.com/docs/design-apis/mock-apis/set-up-mock-servers/')}
${nguon('📘', 'Bruno docs', 'The .bru format and the CLI.', 'https://docs.usebruno.com/')}
${nguon('📘', 'httpyac', 'Running .http files from the command line, with assertions.', 'https://httpyac.github.io/')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10B · Bài 10B.6</span>
<h2>Mock server, và Postman đặt cạnh Bruno, REST Client, HTTPie</h2>
<p class="lead">Hai câu hỏi sớm muộn đội nào cũng hỏi: “Frontend bắt đầu trước khi có API được không?” và “Việc này có thật cần Postman không?” Bài này trả lời cả hai bằng số đo — một mock dựng từ hợp đồng, rồi cùng ba request viết bằng ba công cụ khác.</p>

<h3>Mock server để làm gì</h3>
<p><strong>Mock server</strong> trả lời request HTTP bằng phản hồi soạn sẵn hoặc tự sinh, theo đúng hợp đồng đã thống nhất, không có logic thật nào phía sau. Frontend dựng được màn hình dựa vào nó ngay ngày đầu; đội QA viết được collection trước khi có backend; một buổi demo chạy được mà không cần cơ sở dữ liệu. Hai cách có một cái:</p>
${MOCK_VI}

<h3>Mock chỉ tốt bằng hợp đồng của nó</h3>
<p>Bật Prism từ <code>openapi.json</code> của Chương 5 nguyên như nó đang có — nó mô tả phản hồi nhưng không có schema cho body request, không có ví dụ:</p>
${ra(P1)}
<p>Request bị từ chối vì hợp đồng không khai báo body; body lỗi được sinh ra là <code>"code": "string"</code>; còn xin một lượt đặt sinh động thì nhận ngày năm 1898, giờ kết thúc 28:44 và 13 triệu chỗ. Giá trị nào cũng khớp <em>schema</em> (một chuỗi khớp <code>^[0-2][0-9]:[0-5][0-9]$</code> hoàn toàn có thể là 28:44). Không ai dựng nổi màn hình trên thứ đó. Một hợp đồng viết để mock thêm body request và <em>ví dụ</em> (<code>postman/openapi-mock.json</code>, một script nhỏ sinh ra từ bản gốc):</p>
${ma('json', CODE.mockSpec)}
${ra(P2)}
<p>Giờ trông như thật — và nhìn xem nó làm gì. Giờ bắt đầu 09:15, lệch lưới 30 phút: <strong>201 Created</strong>, và body ghi 09:00, vì đó là ví dụ, không phải lượt đặt của bạn. <code>Prefer: code=409</code> cho ví dụ OVERLAP khi cần, rất hợp để dựng thông báo lỗi của frontend. Không token: 401 — Prism kiểm security scheme. Body sai: 422 với ví dụ <code>OFF_GRID</code>, trong khi API thật trả 400 VALIDATION. Chạy cả collection vào mock:</p>
${ra(MOCK_FAILS)}
${ra(MOCK_OFFGRID)}
<p>Mười lỗi, và lỗi nào cũng là một luật hoặc một quyền: reset và đăng nhập không có trong hợp đồng (404), sinh viên khác <em>đọc được</em> lượt đặt, cùng khung giờ đặt được hai lần, sinh viên liệt kê được mọi lượt đặt. Mock cho bạn biết hình dạng đúng; chỉ API thật mới cho biết luật đúng.</p>

<h3>Chiều ngược lại: proxy kiểm API thật</h3>
<p>Prism cũng đứng được <em>trước</em> API thật, chuyển tiếp mọi request và kiểm cả hai chiều theo hợp đồng. Chĩa cùng collection vào nó:</p>
${ra(PROXY)}
<p>API thật qua cả 42 assertion. Bộ kiểm đánh dấu sáu request tới route hợp đồng không mô tả (<code>/api/test/reset</code>, <code>/api/login</code>) và hai request <em>cố ý</em> sai (không token; <code>role</code> trong body). Không phản hồi nào vi phạm hợp đồng. Chạy cái này hằng đêm thì một trường bị đổi tên trong mã mà không sửa hợp đồng sẽ hiện thành vi phạm — đúng kiểu lệch mà test hợp đồng của Chương 5 bắt từ bên trong.</p>
<div class="pitfall co-tieu-de"><p><strong>Mock của chính Postman (không chạy ở đây).</strong> Trong ứng dụng Postman bạn lưu <em>example</em> trên một request (phản hồi đã bắt được hoặc tự gõ), rồi <em>Mock collection</em> cho bạn một URL trên đám mây. Postman chọn example có method và path khớp; có nhiều cái thì chọn theo header <code>x-mock-response-code</code> hoặc <code>x-mock-response-name</code>. Cùng giới hạn như trên: nó trả example bạn đã lưu, không bao giờ trả thứ request của bạn lẽ ra phải gây ra. Và nó chạy trên đám mây — luật về workspace ở bài 10B.3 áp dụng cho cả example chứa dữ liệu thật.</p></div>

<h3>Cùng ba request trong Bruno</h3>
<p>Bruno (mã nguồn mở, MIT, 2022) lưu mỗi request thành một tệp chữ nhỏ trong repo của bạn và không cần tài khoản. Hai trong ba tệp:</p>
${ma('text', CODE.bru1)}
${ma('text', CODE.bru2)}
${ra(OUT['b6-bruno'])}
<p>Với mật khẩu sai, <code>bru run</code> báo <em>Tests 1/3</em> và thoát 1 — dùng trong CI được như Newman. Lợi thế thật lộ ra ở pull request: đổi một assertion là diff một dòng trong một tệp nhỏ.</p>

<h3>Tệp <code>.http</code>: REST Client và httpyac</h3>
<p>Tiện ích <em>REST Client</em> của VS Code đọc tệp <code>.http</code>: các request cách nhau bằng <code>###</code>, bấm gửi ngay phía trên từng cái. <strong>httpyac</strong> đọc cùng định dạng đó từ dòng lệnh và thêm assertion:</p>
${ma('http', CODE.http)}
${ra(OUT['b6-httpyac'])}
<p>Hai giới hạn nói thật. Các dòng <code>?? status == 201</code> và dạng gọn <code>{{login.token}}</code> là của httpyac; REST Client không có assertion và viết biến request là <code>{{login.response.body.$.token}}</code>. Và khi đỏ, httpyac thoát với mã 20 (đã đo), không phải 1 — CI vẫn bắt được, nhưng đừng kiểm <code>== 1</code>.</p>

<h3>HTTPie trong script</h3>
<p>HTTPie là curl với cú pháp dễ đọc: <code>khoá=giá_trị</code> gửi chuỗi JSON, <code>khoá:=giá_trị</code> gửi JSON thô (số, boolean). Hai bẫy, cả hai đã đo:</p>
${ra(OUT['b6-httpie'])}
<p>Thứ nhất, trong script hay bước CI, stdin không phải terminal, và HTTPie từ chối trộn nó với dữ liệu <code>khoá=giá_trị</code> — thêm <code>--ignore-stdin</code>. Thứ hai, <code>seats=12</code> gửi <code>"12"</code>: đúng bẫy chuỗi-hay-số như CSV có ngoặc kép ở 10B.4, và <code>--check-status</code> biến 400 thành mã thoát 4.</p>

<h3>Chọn công cụ</h3>
${TOOLS_VI}
<p>Vì sao lại có Bruno: năm 2023 Postman ngừng hỗ trợ <em>Scratch Pad</em> ngoại tuyến, nên dùng ứng dụng nghĩa là đăng nhập và đồng bộ lên đám mây của Postman; cùng năm đó Insomnia 8 cũng có lúc bắt buộc tài khoản. Những đội không được đưa request của khách hàng lên đám mây bên thứ ba — ngân hàng, nhiều hợp đồng outsourcing — chuyển sang công cụ giữ mọi thứ trong repo. Hỏi luật của dự án trước khi chọn.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Trong lượt chạy vào mock, “Admin lists all — contains our booking” được ✓. Tìm xem vì sao nó xanh do may, rồi thêm example cho <code>GET /api/admin/bookings</code> để nó xanh có chủ đích. Cuối cùng giải thích trong một câu vì sao “Student cannot list all” không thể xanh trên mock.</p>
<details><summary>Lời giải và output thật</summary>
${ra(TH6_TRUOC)}
<p>Không có example, Prism sinh một phần tử tĩnh, và id của nó tình cờ là 1 — đúng <code>bookingId</code> collection đã lưu từ example 201. Để ý cả <code>"lab": "string"</code>: bộ sinh tĩnh bỏ qua <code>pattern</code> trong chính schema của nó. Thêm <code>"example": [ lượt đặt 1, lượt đặt 2 ]</code> dưới <code>paths['/api/admin/bookings'].get.responses['200'].content['application/json']</code>:</p>
${ra(TH6_SAU)}
${ra(TH6_RUN)}
<p>“contains our booking” giờ xanh vì example nói vậy. “Student cannot list all” vẫn đỏ: mock không biết ai đang gọi và trả example 200 cho tất cả; xin <code>Prefer: code=403</code> thì admin cũng nhận 403. Phân quyền là hành vi, và mock không có hành vi.</p>
</details>
<p><strong>Xong khi</strong> bạn kể được hai lỗi chỉ API thật mới sửa được.</p>
</div>

<h3>Liên hệ đời thường</h3>
<p>Mock là mô hình nhà bằng bìa các-tông: bạn kiểm được kích thước phòng và chỗ đặt cửa sổ, nhưng không thử được đường ống nước có chảy không. Kiến trúc sư vẫn làm mô hình — trước khi đổ bê tông.</p>
<p><strong>Ở dự án:</strong> nhiều dự án outsourcing có backend và ứng dụng di động do hai đội làm song song, có khi ở hai công ty. Hợp đồng OpenAPI kèm ví dụ được ký duyệt trước; đội di động làm việc dựa vào mock hàng tuần liền. Ngày backend xong, chạy collection vào cả hai — những chỗ khác nhau chính là danh sách lỗi tích hợp của bạn.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
${PV_VI}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mock server (máy chủ giả)</span><span class="v">Trả lời bằng phản hồi lấy từ hợp đồng hoặc example đã lưu; không có logic thật.</span></div>
  <div class="kv"><span class="k">example (ví dụ)</span><span class="v">Một phản hồi mẫu đã lưu để mock dùng.</span></div>
  <div class="kv"><span class="k">validating proxy (proxy kiểm)</span><span class="v">Chuyển tới API thật và kiểm request, phản hồi theo hợp đồng.</span></div>
  <div class="kv"><span class="k">contract drift (lệch hợp đồng)</span><span class="v">Hành vi thật của API dần khác hợp đồng đã ghi.</span></div>
  <div class="kv"><span class="k">.bru / .http</span><span class="v">Tệp request dạng chữ của Bruno / REST Client và httpyac.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mock cần ví dụ trong hợp đồng; không có ví dụ, Prism bịa ra năm 1898 và 28:44.</li>
<li>Đo được: mock trả 201 cho lượt đặt lệch lưới; collection đỏ 10/43 trên mock, toàn ở luật và phân quyền.</li>
<li>Prism proxy chạy API thật dưới sự kiểm của hợp đồng: 42/42, chỉ có các vi phạm cố ý.</li>
<li>Bruno, <code>.http</code> + httpyac và HTTPie chạy cùng các request; cái nào cũng thoát khác 0 khi đỏ (1, 20, 4).</li>
<li>Chọn theo ai dùng và dữ liệu được phép nằm ở đâu, không theo trào lưu.</li>
</ul>
${lienKet({ khoa: 'api-design', bai: 'api-7-1-kiem-hop-dong', title: 'Khoá API Design — 7.1: kiểm hợp đồng', sub: 'OpenAPI là nguồn sự thật, và cách giữ API trung thực với nó.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'testing', bai: 'tst-5-4-hop-dong', title: 'Quay lại 5.4 — Test hợp đồng với OpenAPI và Ajv', sub: 'Cùng phép kiểm đó, từ bên trong mã.', cta: 'MỞ BÀI →' })}
${nguon('📘', 'Prism — Stoplight', 'Mock và proxy kiểm từ một tệp OpenAPI.', 'https://github.com/stoplightio/prism')}
${nguon('📘', 'Postman Docs — Set up a mock server', 'Example, cách khớp, header x-mock-response.', 'https://learning.postman.com/docs/design-apis/mock-apis/set-up-mock-servers/')}
${nguon('📘', 'Bruno docs', 'Định dạng .bru và CLI.', 'https://docs.usebruno.com/')}
${nguon('📘', 'httpyac', 'Chạy tệp .http từ dòng lệnh, có assertion.', 'https://httpyac.github.io/')}
</div>
`,
};
