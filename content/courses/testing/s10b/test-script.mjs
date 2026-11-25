/**
 * Testing · Chương 10B · 10B.2 — Test script: pm.test, Chai và 7 cách một test xanh mà chẳng kiểm gì. BÀI MỚI 24/11/2026, slug tst-10b-2-test-script.
 * Chạy thật (newman 6.2.3): collection chính 42 assertion; collection "Traps" T1–T6 và "Async" T7 — 4 + 1 đỏ có chủ đích, 4 xanh giả.
 */
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const lines = (t) => t.split('\n');
// Cắt một đoạn output theo dòng bắt đầu bằng "→ <tên>" cho tới dòng trống kế tiếp.
const khoi = (out, name) => {
  const a = lines(out);
  const i = a.findIndex((l) => l.startsWith('→ ' + name));
  let j = i + 1;
  while (j < a.length && a[j].trim() !== '') j++;
  return a.slice(i, j).join('\n');
};
const BAY = OUT['b2-bay'];
const BAY_RUN = lines(BAY).slice(4, 36).join('\n');
const FAILS = lines(BAY).slice(lines(BAY).findIndex((l) => l.includes('#  failure'))).join('\n');
const ASYNC = lines(OUT['b2-async']).slice(4, 12).join('\n');
const ASYNC_FAIL = lines(OUT['b2-async']).slice(lines(OUT['b2-async']).findIndex((l) => l.includes('#  failure'))).join('\n');
const MAIN_BOOK = khoi(OUT['b1-run'].replace(/↳ /g, '→ '), 'Create booking');
const [TH_ADMIN, TH_URL] = OUT['th2-code'].split('\n---\n');
const TH_OK = lines(OUT.th2).filter((l) => /every status|no unresolved|│ +assertions/.test(l)).join('\n');
const TH_SAI = khoi(OUT['th2-sai'].replace(/↳ /g, '→ '), 'Read it back') + '\n' + lines(OUT['th2-sai']).slice(lines(OUT['th2-sai']).findIndex((l) => l.includes('#  failure'))).join('\n');

const CHEAT_EN = `<table>
<thead><tr><th>You want to check</th><th>Write</th><th>Note</th></tr></thead>
<tbody>
<tr><td>status code</td><td><code>pm.response.to.have.status(201)</code></td><td>message says “expected … 201 but got 401”</td></tr>
<tr><td>a header</td><td><code>pm.response.to.have.header('Location', '/api/bookings/1')</code></td><td>name is case-insensitive</td></tr>
<tr><td>body is JSON</td><td><code>pm.response.to.be.json</code></td><td>checks Content-Type and that it parses</td></tr>
<tr><td>a field equals</td><td><code>pm.expect(b.status).to.eql('CONFIRMED')</code></td><td><code>eql</code> = deep equal; <code>equal</code> = same object</td></tr>
<tr><td>some fields of an object</td><td><code>pm.expect(b).to.include({ lab: 'BE-201' })</code></td><td>extra fields allowed</td></tr>
<tr><td>a list contains</td><td><code>pm.expect(ids).to.include(5)</code></td><td>and <code>.to.not.include</code></td></tr>
<tr><td>a list is not empty</td><td><code>pm.expect(list).to.have.length.above(0)</code></td><td>before any <code>forEach</code></td></tr>
<tr><td>the whole shape</td><td><code>pm.response.to.have.jsonSchema(schema)</code></td><td>JSON Schema, validated by Ajv inside the sandbox</td></tr>
<tr><td>speed</td><td><code>pm.expect(pm.response.responseTime).to.be.below(500)</code></td><td>milliseconds, measured by the runner</td></tr>
</tbody></table>`;
const CHEAT_VI = `<table>
<thead><tr><th>Bạn muốn kiểm</th><th>Viết</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>mã trạng thái</td><td><code>pm.response.to.have.status(201)</code></td><td>thông báo ghi “expected … 201 but got 401”</td></tr>
<tr><td>một header</td><td><code>pm.response.to.have.header('Location', '/api/bookings/1')</code></td><td>tên không phân biệt hoa thường</td></tr>
<tr><td>body là JSON</td><td><code>pm.response.to.be.json</code></td><td>kiểm Content-Type và phân tích được</td></tr>
<tr><td>một trường bằng</td><td><code>pm.expect(b.status).to.eql('CONFIRMED')</code></td><td><code>eql</code> = so sâu; <code>equal</code> = cùng một object</td></tr>
<tr><td>vài trường của object</td><td><code>pm.expect(b).to.include({ lab: 'BE-201' })</code></td><td>cho phép thừa trường</td></tr>
<tr><td>danh sách có chứa</td><td><code>pm.expect(ids).to.include(5)</code></td><td>và <code>.to.not.include</code></td></tr>
<tr><td>danh sách không rỗng</td><td><code>pm.expect(list).to.have.length.above(0)</code></td><td>đặt trước mọi <code>forEach</code></td></tr>
<tr><td>cả hình dạng</td><td><code>pm.response.to.have.jsonSchema(schema)</code></td><td>JSON Schema, Ajv kiểm trong sandbox</td></tr>
<tr><td>tốc độ</td><td><code>pm.expect(pm.response.responseTime).to.be.below(500)</code></td><td>mili giây, trình chạy tự đo</td></tr>
</tbody></table>`;

const TRAPS_EN = `<table>
<thead><tr><th>#</th><th>Trap</th><th>Result on the real API</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>T1</td><td><code>forEach</code> over a list that is empty</td><td>✓ — zero items, zero assertions</td><td>assert the length first</td></tr>
<tr><td>T2</td><td>a comparison without <code>pm.expect</code></td><td>✓ — <code>status === 'down'</code> is computed and thrown away</td><td>every test body must call <code>pm.expect</code> or <code>pm.response.to</code></td></tr>
<tr><td>T3</td><td><code>{{bookingID}}</code> instead of <code>{{bookingId}}</code></td><td>✓ — the literal text is sent, the API says 404, the “IDOR” test passes</td><td>assert the id you meant, or log <code>pm.request.url</code></td></tr>
<tr><td>T4</td><td><code>to.equal</code> on an object</td><td>✗ — two objects with the same content are not the same object</td><td><code>to.eql</code> for content</td></tr>
<tr><td>T5</td><td><code>pm.expect</code> outside <code>pm.test</code></td><td>the script stops at that line; later tests never run</td><td>always inside <code>pm.test</code></td></tr>
<tr><td>T6</td><td>schema with a field the API never sends</td><td>✗ — correctly red (shows the schema check works)</td><td>schema from the contract, not from memory</td></tr>
<tr><td>T7</td><td>assertion inside a <code>pm.sendRequest</code> callback, no <code>done</code></td><td>✓ — test finished before the callback ran with 401</td><td><code>pm.test(name, (done) =&gt; …)</code></td></tr>
</tbody></table>`;
const TRAPS_VI = `<table>
<thead><tr><th>#</th><th>Bẫy</th><th>Kết quả trên API thật</th><th>Sửa</th></tr></thead>
<tbody>
<tr><td>T1</td><td><code>forEach</code> trên danh sách rỗng</td><td>✓ — không phần tử, không assertion nào</td><td>khẳng định độ dài trước</td></tr>
<tr><td>T2</td><td>một phép so sánh không có <code>pm.expect</code></td><td>✓ — <code>status === 'down'</code> được tính rồi vứt đi</td><td>thân test nào cũng phải gọi <code>pm.expect</code> hoặc <code>pm.response.to</code></td></tr>
<tr><td>T3</td><td><code>{{bookingID}}</code> thay vì <code>{{bookingId}}</code></td><td>✓ — gửi nguyên chữ, API trả 404, test “IDOR” xanh</td><td>khẳng định đúng id bạn định dùng, hoặc in <code>pm.request.url</code></td></tr>
<tr><td>T4</td><td><code>to.equal</code> trên object</td><td>✗ — hai object cùng nội dung không phải cùng một object</td><td><code>to.eql</code> để so nội dung</td></tr>
<tr><td>T5</td><td><code>pm.expect</code> nằm ngoài <code>pm.test</code></td><td>script dừng ở dòng đó; các test sau không bao giờ chạy</td><td>luôn đặt trong <code>pm.test</code></td></tr>
<tr><td>T6</td><td>schema có trường API không bao giờ gửi</td><td>✗ — đỏ đúng (cho thấy kiểm schema hoạt động)</td><td>schema lấy từ hợp đồng, không viết theo trí nhớ</td></tr>
<tr><td>T7</td><td>assertion trong callback của <code>pm.sendRequest</code>, không có <code>done</code></td><td>✓ — test đã xong trước khi callback chạy với 401</td><td><code>pm.test(tên, (done) =&gt; …)</code></td></tr>
</tbody></table>`;

const PV_EN = `<ol>
<li><strong>“What is the difference between <code>pm.test</code> and <code>pm.expect</code>?”</strong> <code>pm.test</code> names a check and catches its failure; <code>pm.expect</code> is the Chai assertion that throws. Outside a <code>pm.test</code>, a throw stops the whole script (T5).</li>
<li><strong>“How do you pass data from one request to the next?”</strong> Save it in the test script — <code>pm.collectionVariables.set('bookingId', b.id)</code> — and use <code>{{bookingId}}</code> later. Prefer collection variables over globals and environments for values a run produces.</li>
<li><strong>“Your collection is all green. How do you know the tests test anything?”</strong> Break the API on purpose and watch them go red — exactly the Lab of this chapter. Plus: no <code>forEach</code> without a length check, no unresolved <code>{{…}}</code> in the log.</li>
<li><strong>“<code>eql</code> or <code>equal</code>?”</strong> <code>eql</code> compares content (deep); <code>equal</code> asks “same object?” and fails on two equal JSON objects — measured.</li>
<li><strong>“How do you test asynchronous code in a Postman script?”</strong> Take the <code>done</code> callback in <code>pm.test</code> and call it after the assertion, or <code>done(err)</code> on failure; otherwise the test ends first.</li>
</ol>`;
const PV_VI = `<ol>
<li><strong>“<code>pm.test</code> khác <code>pm.expect</code> thế nào?”</strong> <code>pm.test</code> đặt tên cho một phép kiểm và bắt lỗi của nó; <code>pm.expect</code> là assertion Chai ném lỗi. Nằm ngoài <code>pm.test</code>, một lần ném làm dừng cả script (T5).</li>
<li><strong>“Truyền dữ liệu từ request này sang request sau thế nào?”</strong> Lưu trong test script — <code>pm.collectionVariables.set('bookingId', b.id)</code> — rồi dùng <code>{{bookingId}}</code> ở sau. Giá trị do một lượt chạy sinh ra thì nên để ở biến collection, không để global hay environment.</li>
<li><strong>“Collection xanh hết. Sao biết test có kiểm gì không?”</strong> Cố ý làm hỏng API và xem chúng đỏ — đúng như Lab của chương này. Thêm nữa: không <code>forEach</code> khi chưa kiểm độ dài, không còn <code>{{…}}</code> chưa điền trong log.</li>
<li><strong>“<code>eql</code> hay <code>equal</code>?”</strong> <code>eql</code> so nội dung (sâu); <code>equal</code> hỏi “cùng một object không?” và đỏ với hai object JSON bằng nhau — đã đo.</li>
<li><strong>“Test mã bất đồng bộ trong script Postman thế nào?”</strong> Nhận tham số <code>done</code> trong <code>pm.test</code> và gọi nó sau assertion, hoặc <code>done(err)</code> khi lỗi; không thì test kết thúc trước.</li>
</ol>`;

export default {
  title: '10B.2 — Test scripts: pm.test, Chai, and seven ways a test passes without checking anything|||10B.2 — Test script: pm.test, Chai và 7 cách một test xanh mà chẳng kiểm gì',
  slug: 'tst-10b-2-test-script',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Test script chạy sau phản hồi: pm.test đặt tên, pm.expect là Chai; bảng assertion hay dùng; nối request bằng pm.collectionVariables; test chung ở mức collection; JSON Schema; rồi 7 bẫy đo thật trên API — forEach trên danh sách rỗng, test không assertion, biến gõ sai tên gửi nguyên {{…}} mà test IDOR vẫn xanh, eql/equal, expect ngoài pm.test làm dừng script, assertion trong callback không done.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10B · Lesson 10B.2</span>
<h2>Test scripts: pm.test, Chai, and seven ways a test passes without checking anything</h2>
<p class="lead">A request without a test is a bookmark. The test script — a few lines of JavaScript that run after the response arrives — turns it into a check that can fail. This lesson writes the scripts of the LabFlow Lite collection, then measures seven ways such a script stays green while checking nothing.</p>

<h3>Where a test script runs</h3>
<p>Postman (and Newman) run your script in a <em>sandbox</em> — a separate JavaScript environment with a global <code>pm</code> object and no access to your files. For each request: collection pre-request → folder pre-request → request pre-request → <strong>send</strong> → collection test → folder test → request test. The response is in <code>pm.response</code>.</p>
<ul>
<li><code>pm.test(name, fn)</code> — one named check. If <code>fn</code> throws, that check is red and the next line of the script still runs.</li>
<li><code>pm.expect(value)</code> — a <strong>Chai</strong> assertion (Chai is the assertion library Mocha users know: <code>expect(x).to.eql(y)</code>). It throws when false.</li>
<li><code>pm.response.to.have.status(…)</code> — shortcuts on the response, also built on Chai.</li>
</ul>

<h3>The test script of “Create booking”</h3>
<p>Request body (Postman: <em>Body → raw → JSON</em>):</p>
${ma('json', CODE.createBody)}
<p>Tests tab:</p>
${ma('javascript', CODE.createTest)}
<p>Three habits are visible. Status and header together — Chapter 5 measured that a status-only test misses a broken body. The body is checked field by field with <code>include</code>, plus the two fields the server computes (<code>status</code>, <code>minutes</code>). The last line saves the new id so later requests can use <code>{{bookingId}}</code>.</p>
${ra(MAIN_BOOK)}
<p>The login request does the same with the token, and the collection's auth uses it:</p>
${ma('javascript', CODE.loginTest)}

<h3>Tests every request gets: the collection level</h3>
<p>Put shared checks on the collection (<em>collection → Scripts → Post-response</em>) instead of copying them into 14 requests:</p>
${ma('javascript', CODE.common)}
<p>That is why every request in the run shows “answers in under 500 ms” and “JSON body”. The <code>if</code> skips the JSON check for 204 No Content, which has no body by definition.</p>

<h3>An assertion cheat sheet</h3>
${CHEAT_EN}

<h3>Seven traps, measured</h3>
<p>A separate collection <em>Traps</em> runs as the lecturer <code>thay</code>, who has no bookings yet. Each request holds one trap. The scripts:</p>
${ma('javascript', CODE.bayT1)}
${ma('javascript', CODE.bayT2)}
${ma('javascript', CODE.bayT3)}
${ma('javascript', CODE.bayT4)}
${ma('javascript', CODE.bayT5)}
${ma('javascript', CODE.bayT6)}
<p>The real run:</p>
${ra(BAY_RUN)}
${ra(FAILS)}
<p>Count the ✓ that mean nothing. <strong>T1</strong>: the list is empty, <code>forEach</code> never calls its function — green; the fixed version asks for at least one item first and is honestly red. <strong>T2</strong>: no assertion, green whatever the API says. <strong>T3</strong> is the dangerous one: the variable name has a capital D, Postman does not know it, sends the braces literally (look at the URL: <code>%7B%7BbookingID%7D%7D</code>), the API answers 404 for that nonsense id — and the test called “another user gets 404” passes. An IDOR test that passes because the request was broken. <strong>T5</strong>: the bare <code>pm.expect</code> threw, Newman reports “AssertionError in test-script”, and “T5 this line runs?” never appears at all.</p>
<p>T7 needs its own collection, because it calls a second request from inside a test:</p>
${ma('javascript', CODE.async)}
${ra(ASYNC)}
${ra(ASYNC_FAIL)}
<p>Same request, same 401. Without <code>done</code>, the test function returned before the response came back, so it was marked ✓ — and the failing <code>pm.expect</code> ran later with nobody listening. With <code>done</code>, the runner waits and the failure is reported. A second lesson hides in the same output: <code>pm.sendRequest</code> does <em>not</em> inherit the collection's auth — the admin list answered 401. Lesson 10B.3 deals with that.</p>
${TRAPS_EN}
<div class="pitfall co-tieu-de"><p><strong>Trap — the script editor does not save you.</strong> Postman's editor highlights syntax errors, but every trap above is valid JavaScript. The only defence is the one this course keeps repeating: see each test fail once, for the right reason, before trusting it green.</p></div>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Add a test to “Admin lists all” that every booking in the list has a <code>status</code> among <code>CONFIRMED</code>, <code>PENDING</code>, <code>CANCELLED</code> — without falling into T1.</li>
<li>Make T3 impossible: in “Read it back”, fail if the request URL still contains <code>{{</code>.</li>
</ol>
<details><summary>Solution and real output</summary>
${ma('javascript', TH_ADMIN)}
${ma('javascript', TH_URL)}
<p>Why <code>decodeURIComponent</code>? The first version of this test checked <code>pm.request.url.toString()</code> directly — and stayed green on the broken URL, because by then the braces are already encoded as <code>%7B%7B</code>. Measured, then fixed. With the store holding one booking:</p>
${ra(TH_OK)}
<p>And with <code>{{bookingId}}</code> misspelt as <code>{{bookingID}}</code> in “Read it back”:</p>
${ra(TH_SAI)}
</details>
<p><strong>Done when</strong> each new test has been red once on purpose.</p>
</div>

<h3>In real life</h3>
<p>A smoke detector without a battery is silent — which looks exactly like “no fire”. T1, T2, T3 and T7 are detectors without batteries. The monthly “press the test button” is breaking the API on purpose.</p>
<p><strong>At work:</strong> a reviewer on your team gets a collection with 300 green assertions from a vendor. Ask one question: “Which of these have you seen red?” If the answer is “none”, the number 300 tells you nothing yet. Pick three, break the matching rule on a local server, and see.</p>

<h3>🎤 What an interviewer will ask</h3>
${PV_EN}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test script</span><span class="v">JavaScript that runs after the response (Postman: Scripts → Post-response).</span></div>
  <div class="kv"><span class="k">pre-request script</span><span class="v">JavaScript that runs before sending; can set variables and call other requests.</span></div>
  <div class="kv"><span class="k">pm.test / pm.expect</span><span class="v">A named check / a Chai assertion that throws.</span></div>
  <div class="kv"><span class="k">Chai</span><span class="v">The BDD assertion library behind <code>pm.expect</code>: <code>to.eql</code>, <code>to.include</code>, <code>to.be.oneOf</code>…</span></div>
  <div class="kv"><span class="k">sandbox</span><span class="v">The isolated JavaScript environment where scripts run, with <code>pm</code> and a few libraries.</span></div>
  <div class="kv"><span class="k">vacuous pass</span><span class="v">A test that is green because nothing was checked.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every check inside <code>pm.test</code>; status, the headers that matter, and the body together.</li>
<li>Shared checks at collection level; values between requests in collection variables.</li>
<li>Measured: an empty <code>forEach</code>, a test without assertion, a misspelt variable and a callback without <code>done</code> are all green. A bare <code>pm.expect</code> silently skips the rest of the script.</li>
<li>Trust a test only after you have seen it red for the right reason.</li>
</ul>
${lienKet({ khoa: 'testing', bai: 'tst-1-2-matcher', title: 'Back to 1.2 — Matchers that say what you mean', sub: 'The same eql/equal and include ideas in Vitest.', cta: 'OPEN LESSON →' })}
${nguon('📘', 'Postman Docs — Write scripts to test API response data', 'pm.test, pm.expect and the response assertions.', 'https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/')}
${nguon('📘', 'Chai — BDD API', 'Every chain you can use after pm.expect.', 'https://www.chaijs.com/api/bdd/')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10B · Bài 10B.2</span>
<h2>Test script: pm.test, Chai và 7 cách một test xanh mà chẳng kiểm gì</h2>
<p class="lead">Một request không có test chỉ là một dấu trang. Test script — vài dòng JavaScript chạy sau khi phản hồi tới — biến nó thành một phép kiểm có thể đỏ. Bài này viết script cho collection LabFlow Lite, rồi đo bảy cách một script như thế vẫn xanh mà chẳng kiểm gì.</p>

<h3>Test script chạy ở đâu</h3>
<p>Postman (và Newman) chạy script của bạn trong một <em>sandbox</em> — một môi trường JavaScript riêng có object toàn cục <code>pm</code> và không đụng được tệp của bạn. Với mỗi request: pre-request của collection → của folder → của request → <strong>gửi</strong> → test của collection → của folder → của request. Phản hồi nằm trong <code>pm.response</code>.</p>
<ul>
<li><code>pm.test(tên, fn)</code> — một phép kiểm có tên. Nếu <code>fn</code> ném lỗi, phép kiểm đó đỏ và dòng tiếp theo của script vẫn chạy.</li>
<li><code>pm.expect(giá_trị)</code> — một assertion <strong>Chai</strong> (Chai là thư viện assertion người dùng Mocha quen: <code>expect(x).to.eql(y)</code>). Sai thì nó ném lỗi.</li>
<li><code>pm.response.to.have.status(…)</code> — lối tắt trên phản hồi, cũng dựng trên Chai.</li>
</ul>

<h3>Test script của “Create booking”</h3>
<p>Body của request (Postman: <em>Body → raw → JSON</em>):</p>
${ma('json', CODE.createBody)}
<p>Thẻ Tests:</p>
${ma('javascript', CODE.createTest)}
<p>Thấy được ba thói quen. Status và header đi cùng nhau — Chương 5 đã đo: test chỉ kiểm status bỏ lọt body hỏng. Body kiểm từng trường bằng <code>include</code>, cộng hai trường server tự tính (<code>status</code>, <code>minutes</code>). Dòng cuối lưu id mới để các request sau dùng <code>{{bookingId}}</code>.</p>
${ra(MAIN_BOOK)}
<p>Request đăng nhập làm y như vậy với token, và auth của collection dùng nó:</p>
${ma('javascript', CODE.loginTest)}

<h3>Test mọi request đều có: mức collection</h3>
<p>Đặt phép kiểm dùng chung ở collection (<em>collection → Scripts → Post-response</em>) thay vì chép vào 14 request:</p>
${ma('javascript', CODE.common)}
<p>Vì thế request nào trong lượt chạy cũng hiện “answers in under 500 ms” và “JSON body”. Câu <code>if</code> bỏ qua kiểm JSON cho 204 No Content — theo định nghĩa nó không có body.</p>

<h3>Bảng assertion hay dùng</h3>
${CHEAT_VI}

<h3>Bảy cái bẫy, đo thật</h3>
<p>Một collection riêng tên <em>Traps</em> chạy bằng tài khoản giảng viên <code>thay</code>, người chưa có lượt đặt nào. Mỗi request chứa một bẫy. Các script:</p>
${ma('javascript', CODE.bayT1)}
${ma('javascript', CODE.bayT2)}
${ma('javascript', CODE.bayT3)}
${ma('javascript', CODE.bayT4)}
${ma('javascript', CODE.bayT5)}
${ma('javascript', CODE.bayT6)}
<p>Lượt chạy thật:</p>
${ra(BAY_RUN)}
${ra(FAILS)}
<p>Đếm những dấu ✓ chẳng có nghĩa gì. <strong>T1</strong>: danh sách rỗng, <code>forEach</code> không gọi hàm lần nào — xanh; bản sửa đòi ít nhất một phần tử trước nên đỏ một cách trung thực. <strong>T2</strong>: không assertion, xanh dù API nói gì. <strong>T3</strong> nguy hiểm nhất: tên biến có chữ D hoa, Postman không biết biến đó, gửi nguyên cặp ngoặc nhọn (nhìn URL: <code>%7B%7BbookingID%7D%7D</code>), API trả 404 cho cái id vô nghĩa ấy — và test tên “another user gets 404” xanh. Một test IDOR xanh vì chính request bị hỏng. <strong>T5</strong>: <code>pm.expect</code> đứng trần ném lỗi, Newman báo “AssertionError in test-script”, và “T5 this line runs?” không hề xuất hiện.</p>
<p>T7 cần collection riêng, vì nó gọi thêm một request từ bên trong test:</p>
${ma('javascript', CODE.async)}
${ra(ASYNC)}
${ra(ASYNC_FAIL)}
<p>Cùng request, cùng 401. Không có <code>done</code>, hàm test trả về trước khi phản hồi quay lại, nên bị đánh ✓ — còn <code>pm.expect</code> đỏ chạy sau đó, không ai nghe. Có <code>done</code>, trình chạy chờ và báo lỗi. Cùng output còn giấu bài học thứ hai: <code>pm.sendRequest</code> <em>không</em> kế thừa auth của collection — danh sách admin trả 401. Bài 10B.3 xử lý chuyện đó.</p>
${TRAPS_VI}
<div class="pitfall co-tieu-de"><p><strong>Bẫy — trình soạn script không cứu bạn.</strong> Trình soạn của Postman tô lỗi cú pháp, nhưng mọi bẫy trên đều là JavaScript hợp lệ. Cách phòng duy nhất là điều khoá học này nhắc mãi: thấy mỗi test đỏ một lần, đúng lý do, trước khi tin nó lúc xanh.</p></div>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Thêm vào “Admin lists all” một test rằng mọi lượt đặt trong danh sách có <code>status</code> thuộc <code>CONFIRMED</code>, <code>PENDING</code>, <code>CANCELLED</code> — mà không rơi vào T1.</li>
<li>Làm cho T3 không thể xảy ra: trong “Read it back”, đỏ nếu URL request còn chứa <code>{{</code>.</li>
</ol>
<details><summary>Lời giải và output thật</summary>
${ma('javascript', TH_ADMIN)}
${ma('javascript', TH_URL)}
<p>Vì sao cần <code>decodeURIComponent</code>? Bản đầu của test này kiểm thẳng <code>pm.request.url.toString()</code> — và vẫn xanh trên URL hỏng, vì lúc đó cặp ngoặc đã bị mã hoá thành <code>%7B%7B</code>. Đo rồi mới sửa. Khi kho có một lượt đặt:</p>
${ra(TH_OK)}
<p>Còn khi <code>{{bookingId}}</code> bị gõ sai thành <code>{{bookingID}}</code> trong “Read it back”:</p>
${ra(TH_SAI)}
</details>
<p><strong>Xong khi</strong> mỗi test mới đã đỏ một lần có chủ đích.</p>
</div>

<h3>Liên hệ đời thường</h3>
<p>Máy báo khói hết pin thì im lặng — trông y hệt “không có cháy”. T1, T2, T3 và T7 là những máy báo khói hết pin. Việc “bấm nút thử” hằng tháng chính là cố ý làm hỏng API.</p>
<p><strong>Đi làm:</strong> người review trong đội bạn nhận từ bên đối tác một collection 300 assertion xanh. Hỏi một câu: “Cái nào trong số này anh chị đã thấy đỏ?” Nếu câu trả lời là “chưa cái nào”, con số 300 chưa nói lên gì. Chọn ba cái, làm hỏng đúng luật tương ứng trên server local, rồi xem.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
${PV_VI}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test script</span><span class="v">JavaScript chạy sau phản hồi (Postman: Scripts → Post-response).</span></div>
  <div class="kv"><span class="k">pre-request script</span><span class="v">JavaScript chạy trước khi gửi; đặt được biến và gọi request khác.</span></div>
  <div class="kv"><span class="k">pm.test / pm.expect</span><span class="v">Một phép kiểm có tên / một assertion Chai ném lỗi.</span></div>
  <div class="kv"><span class="k">Chai</span><span class="v">Thư viện assertion kiểu BDD đứng sau <code>pm.expect</code>: <code>to.eql</code>, <code>to.include</code>, <code>to.be.oneOf</code>…</span></div>
  <div class="kv"><span class="k">sandbox (hộp cát)</span><span class="v">Môi trường JavaScript cô lập nơi script chạy, có <code>pm</code> và vài thư viện.</span></div>
  <div class="kv"><span class="k">vacuous pass (xanh suông)</span><span class="v">Test xanh vì không có gì được kiểm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi phép kiểm nằm trong <code>pm.test</code>; kiểm status, header quan trọng và body cùng lúc.</li>
<li>Phép kiểm dùng chung đặt ở mức collection; giá trị giữa các request để ở biến collection.</li>
<li>Đo được: <code>forEach</code> rỗng, test không assertion, biến gõ sai tên và callback không <code>done</code> đều xanh. Một <code>pm.expect</code> đứng trần lặng lẽ bỏ qua phần còn lại của script.</li>
<li>Chỉ tin một test sau khi đã thấy nó đỏ đúng lý do.</li>
</ul>
${lienKet({ khoa: 'testing', bai: 'tst-1-2-matcher', title: 'Quay lại 1.2 — Matcher nói đúng ý bạn', sub: 'Cùng ý eql/equal và include, trong Vitest.', cta: 'MỞ BÀI →' })}
${nguon('📘', 'Postman Docs — Write scripts to test API response data', 'pm.test, pm.expect và các assertion trên phản hồi.', 'https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/')}
${nguon('📘', 'Chai — BDD API', 'Mọi chuỗi bạn dùng được sau pm.expect.', 'https://www.chaijs.com/api/bdd/')}
</div>
`,
};
