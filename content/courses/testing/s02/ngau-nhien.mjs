/**
 * Testing · Chương 2 · 2.4 — Ngẫu nhiên, mã định danh và tính bất định. Slug giữ từ khung: tst-2-4-ngau-nhien.
 * Mọi code/output lấy từ ./_ma.mjs. Test chập chờn đo thật hai lượt 100 lần: 86/14 và 82/18 (lý thuyết ≈ 17 %).
 */
import G from '../giang/tst-02-4.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const HINH_EN = `<table>
<thead><tr><th>Value</th><th>Assert its shape with</th></tr></thead>
<tbody>
<tr><td>booking code</td><td><code>toMatch(/^LF-[A-HJ-NP-Z2-9]{6}$/)</code> — exactly the alphabet, exactly six characters</td></tr>
<tr><td>UUID</td><td><code>expect.stringMatching(/^[0-9a-f-]{36}$/)</code> inside <code>toEqual</code></td></tr>
<tr><td>timestamp</td><td><code>expect.any(String)</code> — or better, fix the clock (lesson 2.2)</td></tr>
<tr><td>“all different”</td><td>not a shape: use a seeded generator, or a fast-check property with a fixed <code>seed</code></td></tr>
</tbody>
</table>`;
const HINH_VI = `<table>
<thead><tr><th>Giá trị</th><th>Khẳng định hình dạng bằng</th></tr></thead>
<tbody>
<tr><td>mã đặt chỗ</td><td><code>toMatch(/^LF-[A-HJ-NP-Z2-9]{6}$/)</code> — đúng bảng chữ, đúng sáu ký tự</td></tr>
<tr><td>UUID</td><td><code>expect.stringMatching(/^[0-9a-f-]{36}$/)</code> bên trong <code>toEqual</code></td></tr>
<tr><td>mốc thời gian</td><td><code>expect.any(String)</code> — hoặc tốt hơn, cố định đồng hồ (bài 2.2)</td></tr>
<tr><td>“khác nhau hết”</td><td>không phải hình dạng: dùng bộ sinh có seed, hoặc thuộc tính fast-check với <code>seed</code> cố định</td></tr>
</tbody>
</table>`;

export default {
  title: '2.4 — Randomness, IDs and non-determinism: a flaky test measured, then made repeatable|||2.4 — Ngẫu nhiên, mã định danh và tính bất định: đo một test chập chờn, rồi làm nó lặp lại được',
  slug: 'tst-2-4-ngau-nhien',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mã đặt chỗ ngẫu nhiên của LabFlow Lite; một test chập chờn đo thật 100 lần (86/14 và 82/18, lý thuyết ≈ 17 %); ba cách kiểm soát: tiêm bộ sinh (biên 0 và 0.999999), seed (mulberry32), vi.spyOn(Math.random) + restore; mock không trả lại làm hỏng test sau và restoreMocks; ID và đồng hồ làm tham số cho newBookingRecord; khẳng định hình dạng khi giá trị phải ngẫu nhiên.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Randomness, IDs and non-determinism</h2>
<p class="lead">Async code and clocks were the first two things that make tests unrepeatable. The third is chance: random codes, UUIDs, shuffled lists. A test that depends on chance is <strong>flaky</strong> — it passes and fails on the same code. Here we measure one for real and then make it repeatable in three ways.</p>

<h3>The code: booking codes and records</h3>
<p>Add <code>src/rules/code.js</code>:</p>
${ma('javascript', CODE.code)}
<ul>
<li><code>makeBookingCode</code> builds codes like <code>LF-VQ5XFS</code> that a student can read out at the lab door. The alphabet has 32 characters and leaves out 0, O, 1 and I, which people confuse.</li>
<li>The random generator is a <strong>parameter</strong> with <code>Math.random</code> as its default. Production code calls <code>makeBookingCode()</code> and never thinks about it; tests can pass their own.</li>
<li><code>seededRandom(seed)</code> is mulberry32, a well-known eight-line generator: the same seed always produces the same sequence, on every machine.</li>
<li><code>newBookingRecord</code> builds the row that will be stored. The UUID generator (<code>crypto.randomUUID</code>, built into Node) and the clock are parameters too.</li>
</ul>

<h3>A flaky test, measured</h3>
${ma('javascript', CODE.chapChon)}
<p>Twenty two-letter codes should all be different — surely? There are 32 × 32 = 1024 possible codes. Run the test once:</p>
${ra(OUT['24-chap-chon-fail'])}
<p>Sometimes it is green, sometimes red, with the same code. To see how often, run it a hundred times:</p>
${ma('bash', CODE.do100)}
${ra(OUT['24-chap-chon-100'])}
${ra(OUT['24-chap-chon-100b'])}
<p>Two measurements on our machine: 14 and 18 failures in 100 runs. The maths agrees: the chance that 20 random picks out of 1024 are all different is (1 − 1/1024)(1 − 2/1024)…(1 − 19/1024) ≈ 0.83, so about <strong>17 %</strong> of runs fail. This is the birthday problem — the same reason that in a class of 23 students two probably share a birthday. Your own numbers will differ a little; that is the point.</p>
<p>Why this matters more than it looks: a test that fails one time in six teaches the team to press “re-run”. Soon nobody believes a red build, and a real failure is re-run away too. Chapter 8 shows how to hunt flaky tests in a large suite; this lesson shows how not to write them.</p>

<h3>Fix 1 — inject the randomness, and test its boundaries</h3>
<p>Because the generator is a parameter, the test can pass a function that always returns the same number. Two numbers are especially useful: <code>() =&gt; 0</code> picks the <strong>first</strong> character of the alphabet and <code>() =&gt; 0.999999</code> the <strong>last</strong> — the boundaries of <code>Math.floor(random() * 32)</code>. A bug such as <code>* (ALPHABET.length - 1)</code> would never produce “9”, and only the upper boundary would notice.</p>

<h3>Fix 2 — seed it</h3>
<p>A seeded generator gives values that <em>look</em> random — useful when you need variety, such as many different codes — but are identical on every run. Seed 42 gives <code>LF-VQ5XFS</code> then <code>LF-JV5RH6</code>, today, tomorrow and in CI.</p>

<h3>Fix 3 — spy on Math.random, and restore it</h3>
<p>When code calls <code>Math.random()</code> directly and you cannot change it yet, <code>vi.spyOn(Math, 'random')</code> replaces the method on the real <code>Math</code> object, and <code>.mockReturnValue(0.5)</code> fixes its answer: 0.5 × 32 = 16, the letter <code>S</code>. All three fixes in one file:</p>
${ma('javascript', CODE.ngauNhien)}
${ra(OUT['24-ngau-nhien'])}
<p>Notice <code>afterEach(() =&gt; { vi.restoreAllMocks(); })</code>. A spy changes a <strong>global</strong> object that every test shares. Prefer fix 1 or 2; use fix 3 for code you do not own yet, and treat it as a reason to refactor.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — the spy that is never restored.</strong></p>
${ma('javascript', CODE.roRi)}
${ra(OUT['24-ro-ri'])}
<p>Test B is correct. It fails because test A left <code>Math.random</code> returning 0, so both “fresh” codes are <code>LF-AAAAAA</code>. Run B alone and it is green:</p>
${ra(OUT['24-ro-ri-B'])}
<p>This is an <strong>order-dependent</strong> failure — the I in F.I.R.S.T. (Isolated) broken. The fix is one line in the config, so nobody has to remember <code>afterEach</code>:</p>
${ma('javascript', CODE.restoreConfig)}
${ra(OUT['24-ro-ri-restore'])}
<p>With <code>restoreMocks: true</code>, Vitest restores every <code>vi.spyOn</code> before each test. Add it to the main <code>vitest.config.js</code> of every project.</p>
</div>

<h3>IDs and clocks as parameters</h3>
<p>The last test in the file above builds a whole record with a fixed id and a fixed clock, so <code>toEqual</code> can compare it exactly. The booking code inside stays random — so the test checks its <strong>shape</strong> with <code>expect.stringMatching(/^LF-/)</code>. In a real service you would inject the code generator as well; here the mix shows both tools.</p>
<p>The same idea appears in every backend framework: Spring Boot code takes a <code>java.time.Clock</code> bean instead of calling <code>LocalDateTime.now()</code>, and tests pass <code>Clock.fixed(...)</code>. Database-generated IDs are a different story — Chapter 4 deals with them.</p>

<h3>When the value must stay random: assert its shape</h3>
${HINH_EN}
<p>The rule behind all of this: <strong>a unit test must give the same answer every time</strong>. If it depends on chance, control the chance; never “just re-run”.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Make the twenty-codes test deterministic with <code>seededRandom(7)</code>.</li>
<li>Prove that the same seed gives the same first code.</li>
<li>Run <code>demo2/ro-ri.test.js</code> with a config that has <code>restoreMocks: true</code> — A and B both green.</li>
<li>Test <code>newBookingRecord</code> with a fixed id and clock (the last test of <code>ngau-nhien.test.js</code> is the model).</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th24)}
${ra(OUT['24-th'])}
<p>The same 100-run loop, pointed at <code>demo2/th24.test.js</code>:</p>
${ra(OUT['24-th-100'])}
<p><strong>Done when:</strong> <code>th24</code> shows <code>2 passed</code> on every run — the loop prints <code>100 passed, 0 failed</code> — and the leak demo is green with <code>restoreMocks</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">flaky test</span><span class="v">A test that passes and fails on the same code without any change.</span></div>
  <div class="kv"><span class="k">deterministic</span><span class="v">Always giving the same output for the same input.</span></div>
  <div class="kv"><span class="k">seed</span><span class="v">The starting value of a pseudo-random generator; same seed, same sequence.</span></div>
  <div class="kv"><span class="k">vi.spyOn</span><span class="v">Replaces a method on a real object so the test can watch or control it.</span></div>
  <div class="kv"><span class="k">restoreMocks</span><span class="v">Vitest option that restores every spy before each test.</span></div>
  <div class="kv"><span class="k">UUID</span><span class="v">A 128-bit random identifier written as 36 characters; <code>crypto.randomUUID()</code> in Node.</span></div>
  <div class="kv"><span class="k">birthday problem</span><span class="v">Collisions among random picks are far more likely than intuition says.</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 Making randomness testable</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Random inside</div><div class="lz-d">a different result every run</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Inject</div><div class="lz-d">pass random() and newId() in</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Seed</div><div class="lz-d">the same seed gives the same sequence</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Assert</div><div class="lz-d">exact values, or properties for many seeds</div></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Randomness makes tests flaky: 14 and 18 failures in two runs of 100, the same code each time.</li>
<li>Inject the generator and test its boundaries (0 and 0.999999), or seed it.</li>
<li><code>vi.spyOn(Math, 'random')</code> only when you must — and always restore; <code>restoreMocks: true</code> does it for you.</li>
<li>An un-restored mock creates order-dependent failures in other tests.</li>
<li>Make IDs and clocks parameters; assert the shape of what must stay random.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Ngẫu nhiên, mã định danh và tính bất định</h2>
<p class="lead">Code bất đồng bộ và đồng hồ là hai thứ đầu tiên làm test không lặp lại được. Thứ thứ ba là may rủi: mã ngẫu nhiên, UUID, danh sách bị xáo trộn. Test phụ thuộc may rủi là test <strong>chập chờn</strong> (flaky) — cùng một code, lúc đạt lúc hỏng. Ở đây ta đo thật một test như vậy rồi làm nó lặp lại được bằng ba cách.</p>

<h3>Code: mã đặt chỗ và bản ghi</h3>
<p>Thêm <code>src/rules/code.js</code>:</p>
${ma('javascript', CODE.code)}
<ul>
<li><code>makeBookingCode</code> tạo mã như <code>LF-VQ5XFS</code> để sinh viên đọc ở cửa phòng lab. Bảng chữ có 32 ký tự và bỏ 0, O, 1, I — những chữ người ta hay nhầm.</li>
<li>Bộ sinh ngẫu nhiên là một <strong>tham số</strong> mặc định là <code>Math.random</code>. Code chạy thật gọi <code>makeBookingCode()</code> và không phải nghĩ gì thêm; test thì truyền được bộ sinh của riêng nó.</li>
<li><code>seededRandom(seed)</code> là mulberry32, một bộ sinh tám dòng rất phổ biến: cùng seed (hạt giống) thì luôn ra cùng một dãy, trên mọi máy.</li>
<li><code>newBookingRecord</code> dựng dòng dữ liệu sẽ được lưu. Bộ sinh UUID (<code>crypto.randomUUID</code>, có sẵn trong Node) và đồng hồ cũng là tham số.</li>
</ul>

<h3>Một test chập chờn, đo thật</h3>
${ma('javascript', CODE.chapChon)}
<p>Hai mươi mã hai chữ thì chắc hẳn khác nhau hết? Có 32 × 32 = 1024 mã có thể có. Chạy test một lần:</p>
${ra(OUT['24-chap-chon-fail'])}
<p>Lúc xanh, lúc đỏ, với cùng một code. Để biết bao lâu đỏ một lần, chạy nó một trăm lần:</p>
${ma('bash', CODE.do100)}
${ra(OUT['24-chap-chon-100'])}
${ra(OUT['24-chap-chon-100b'])}
<p>Hai lần đo trên máy của chúng tôi: 14 và 18 lần hỏng trong 100 lần chạy. Toán học đồng ý: xác suất 20 lần chọn ngẫu nhiên trong 1024 mã đều khác nhau là (1 − 1/1024)(1 − 2/1024)…(1 − 19/1024) ≈ 0,83, nên khoảng <strong>17 %</strong> số lần chạy sẽ hỏng. Đây là bài toán ngày sinh (birthday problem) — cùng lý do khiến trong một lớp 23 sinh viên rất có thể có hai bạn trùng ngày sinh. Con số của bạn sẽ hơi khác; đó chính là vấn đề.</p>
<p>Vì sao chuyện này nghiêm trọng hơn vẻ ngoài: một test cứ sáu lần hỏng một sẽ dạy cả nhóm bấm “chạy lại”. Chẳng bao lâu không ai tin bản dựng đỏ nữa, và một lỗi thật cũng bị “chạy lại” cho qua. Chương 8 chỉ cách săn test chập chờn trong một bộ test lớn; bài này chỉ cách đừng viết ra chúng.</p>

<h3>Cách 1 — tiêm bộ sinh, và test các biên của nó</h3>
<p>Vì bộ sinh là tham số, test truyền được một hàm luôn trả về cùng một số. Hai số đặc biệt có ích: <code>() =&gt; 0</code> chọn ký tự <strong>đầu tiên</strong> của bảng chữ, còn <code>() =&gt; 0.999999</code> chọn ký tự <strong>cuối cùng</strong> — hai biên của <code>Math.floor(random() * 32)</code>. Một bug kiểu <code>* (ALPHABET.length - 1)</code> sẽ không bao giờ sinh ra “9”, và chỉ biên trên mới phát hiện được.</p>

<h3>Cách 2 — dùng seed</h3>
<p>Bộ sinh có seed cho ra những giá trị <em>trông</em> ngẫu nhiên — hữu ích khi cần sự đa dạng, chẳng hạn nhiều mã khác nhau — nhưng giống hệt nhau ở mọi lần chạy. Seed 42 cho <code>LF-VQ5XFS</code> rồi <code>LF-JV5RH6</code>, hôm nay, ngày mai, và cả trên CI.</p>

<h3>Cách 3 — spy Math.random, và trả lại</h3>
<p>Khi code gọi thẳng <code>Math.random()</code> mà bạn chưa sửa được, <code>vi.spyOn(Math, 'random')</code> thay phương thức trên chính object <code>Math</code> thật, và <code>.mockReturnValue(0.5)</code> cố định câu trả lời: 0,5 × 32 = 16, chữ <code>S</code>. Cả ba cách trong một file:</p>
${ma('javascript', CODE.ngauNhien)}
${ra(OUT['24-ngau-nhien'])}
<p>Để ý <code>afterEach(() =&gt; { vi.restoreAllMocks(); })</code>. Một spy thay đổi một object <strong>toàn cục</strong> mà mọi test dùng chung. Ưu tiên cách 1 hoặc 2; dùng cách 3 cho code chưa thuộc quyền bạn sửa, và coi đó là lý do để tái cấu trúc (refactor).</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — spy không bao giờ được trả lại.</strong></p>
${ma('javascript', CODE.roRi)}
${ra(OUT['24-ro-ri'])}
<p>Test B viết đúng. Nó hỏng vì test A để <code>Math.random</code> luôn trả về 0, nên hai mã “mới” đều là <code>LF-AAAAAA</code>. Chạy riêng B thì xanh:</p>
${ra(OUT['24-ro-ri-B'])}
<p>Đây là lỗi <strong>phụ thuộc thứ tự</strong> — chữ I (Isolated, độc lập) của F.I.R.S.T. bị phá. Cách sửa chỉ là một dòng cấu hình, để không ai phải nhớ viết <code>afterEach</code>:</p>
${ma('javascript', CODE.restoreConfig)}
${ra(OUT['24-ro-ri-restore'])}
<p>Với <code>restoreMocks: true</code>, Vitest trả lại mọi <code>vi.spyOn</code> trước mỗi test. Hãy thêm nó vào <code>vitest.config.js</code> chính của mọi dự án.</p>
</div>

<h3>ID và đồng hồ làm tham số</h3>
<p>Test cuối trong file ở trên dựng cả một bản ghi với id cố định và đồng hồ cố định, nên <code>toEqual</code> so được chính xác. Mã đặt chỗ bên trong vẫn ngẫu nhiên — nên test kiểm <strong>hình dạng</strong> của nó bằng <code>expect.stringMatching(/^LF-/)</code>. Trong một dịch vụ thật bạn sẽ tiêm luôn bộ sinh mã; ở đây trộn cả hai để thấy cả hai công cụ.</p>
<p>Ý tưởng này có ở mọi framework backend: code Spring Boot nhận một bean <code>java.time.Clock</code> thay vì gọi <code>LocalDateTime.now()</code>, và test truyền vào <code>Clock.fixed(...)</code>. ID do cơ sở dữ liệu sinh ra là chuyện khác — Chương 4 xử lý chúng.</p>

<h3>Khi giá trị buộc phải ngẫu nhiên: khẳng định hình dạng</h3>
${HINH_VI}
<p>Quy tắc đứng sau tất cả: <strong>unit test phải cho cùng một đáp số ở mọi lần chạy</strong>. Nếu nó phụ thuộc may rủi, hãy kiểm soát may rủi; đừng bao giờ “chạy lại cho qua”.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Làm test hai mươi mã thành tất định bằng <code>seededRandom(7)</code>.</li>
<li>Chứng minh cùng seed thì cho cùng mã đầu tiên.</li>
<li>Chạy <code>demo2/ro-ri.test.js</code> với một cấu hình có <code>restoreMocks: true</code> — cả A lẫn B đều xanh.</li>
<li>Test <code>newBookingRecord</code> với id và đồng hồ cố định (test cuối của <code>ngau-nhien.test.js</code> là mẫu).</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th24)}
${ra(OUT['24-th'])}
<p>Cùng vòng lặp 100 lần đó, trỏ vào <code>demo2/th24.test.js</code>:</p>
${ra(OUT['24-th-100'])}
<p><strong>Đạt khi:</strong> <code>th24</code> hiện <code>2 passed</code> ở mọi lần chạy — vòng lặp in <code>100 passed, 0 failed</code> — và demo rò rỉ xanh khi có <code>restoreMocks</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">flaky test (test chập chờn)</span><span class="v">Test lúc đạt lúc hỏng trên cùng một code, không có gì thay đổi.</span></div>
  <div class="kv"><span class="k">deterministic (tất định)</span><span class="v">Luôn cho cùng đầu ra với cùng đầu vào.</span></div>
  <div class="kv"><span class="k">seed (hạt giống)</span><span class="v">Giá trị khởi đầu của bộ sinh giả ngẫu nhiên; cùng seed, cùng dãy số.</span></div>
  <div class="kv"><span class="k">vi.spyOn</span><span class="v">Thay một phương thức trên object thật để test theo dõi hoặc điều khiển nó.</span></div>
  <div class="kv"><span class="k">restoreMocks</span><span class="v">Tuỳ chọn của Vitest: trả lại mọi spy trước mỗi test.</span></div>
  <div class="kv"><span class="k">UUID</span><span class="v">Định danh ngẫu nhiên 128 bit viết thành 36 ký tự; trong Node là <code>crypto.randomUUID()</code>.</span></div>
  <div class="kv"><span class="k">birthday problem (bài toán ngày sinh)</span><span class="v">Khả năng trùng nhau giữa các lần chọn ngẫu nhiên cao hơn trực giác rất nhiều.</span></div>
</div>

<h3>🗺 Làm ngẫu nhiên test được</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Ngẫu nhiên bên trong</div><div class="lz-d">mỗi lần chạy một kết quả</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Tiêm vào</div><div class="lz-d">truyền random() và newId() từ ngoài</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Seed</div><div class="lz-d">cùng seed ra cùng một dãy</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Khẳng định</div><div class="lz-d">giá trị chính xác, hoặc thuộc tính cho nhiều seed</div></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Ngẫu nhiên làm test chập chờn: 14 và 18 lần hỏng trong hai lượt 100 lần, cùng một code.</li>
<li>Tiêm bộ sinh và test các biên của nó (0 và 0.999999), hoặc dùng seed.</li>
<li>Chỉ <code>vi.spyOn(Math, 'random')</code> khi bắt buộc — và luôn trả lại; <code>restoreMocks: true</code> làm việc đó thay bạn.</li>
<li>Mock không được trả lại tạo ra lỗi phụ thuộc thứ tự ở các test khác.</li>
<li>Biến ID và đồng hồ thành tham số; khẳng định hình dạng của những gì buộc phải ngẫu nhiên.</li>
</ul>
</div>
`,
};
