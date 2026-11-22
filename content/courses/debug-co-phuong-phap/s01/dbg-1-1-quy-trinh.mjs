/**
 * 1.1 — Vòng lặp gỡ lỗi (soạn 22/11/2026). Output chạy THẬT /tmp/dbg-lab/ch1/1-1 (Node v26.8.1, node:test).
 * Không trùng web-foundations 10.2 (vòng lặp nhập môn) — ở đây đi đủ 6 bước có nhật ký + test chặn tái phát.
 */
import { nguon, lienKet } from '../_chung.mjs';

const MA = `<pre><code class="language-js">// Order total with a discount code (0.1 = 10%)
function tongDon(gioHang, giamGia) {
  let tong = 0;
  for (const sp of gioHang) {
    tong += sp.gia * sp.soLuong;
    if (giamGia) tong = tong * (1 - giamGia);
  }
  return Math.round(tong);
}
module.exports = { tongDon };

if (require.main === module) {
  console.log('1 món :', tongDon([{ gia: 100000, soLuong: 1 }], 0.1));
  console.log('2 món :', tongDon([{ gia: 100000, soLuong: 1 }, { gia: 200000, soLuong: 2 }], 0.1));
  console.log('2 món, không mã:', tongDon([{ gia: 100000, soLuong: 1 }, { gia: 200000, soLuong: 2 }], 0));
}</code></pre>`;

const OUT1 = `<div class="out">$ node gio-hang.js
1 món : 90000
2 món : 441000
2 món, không mã: 500000</div>`;

const OUT_VONG = `<div class="out">$ node -e "…the same loop, printing tong after each item…"
sau món 100000 -&gt; tong = 90000
sau món 200000 -&gt; tong = 441000</div>`;

const TEST = `<pre><code class="language-js">// gio-hang.test.js — run with: node --test gio-hang.test.js
const test = require('node:test');
const assert = require('node:assert');
const { tongDon } = require('./gio-hang.js');

test('giảm 10% áp MỘT lần cho cả đơn nhiều món', () =&gt; {
  const gio = [{ gia: 100000, soLuong: 1 }, { gia: 200000, soLuong: 2 }];
  assert.strictEqual(tongDon(gio, 0.1), 450000);
});</code></pre>`;

const OUT_DO = `<div class="out">$ node --test gio-hang.test.js
✖ giảm 10% áp MỘT lần cho cả đơn nhiều món (0.7495ms)
ℹ tests 1
ℹ pass 0
ℹ fail 1
…
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  441000 !== 450000

      at TestContext.&lt;anonymous&gt; (/private/tmp/dbg-lab/ch1/1-1/gio-hang.test.js:7:10)
…</div>`;

const SUA = `<pre><code class="language-js">function tongDon(gioHang, giamGia) {
  let tong = 0;
  for (const sp of gioHang) {
    tong += sp.gia * sp.soLuong;
  }
  if (giamGia) tong = tong * (1 - giamGia);   // discount ONCE, after the full sum
  return Math.round(tong);
}</code></pre>
<div class="out">$ node gio-hang.js
1 món : 90000
2 món : 450000
2 món, không mã: 500000
$ node --test gio-hang.test.js
✔ giảm 10% áp MỘT lần cho cả đơn nhiều món (0.360833ms)
ℹ tests 1
…</div>`;

const NHAT_KY = `<pre><code class="language-markdown">## Lỗi: đơn nhiều món có mã giảm giá bị giảm quá tay
- Mong đợi / thực tế: (100.000 + 2×200.000) × 0,9 = 450.000 / 441.000
- Tái hiện: node gio-hang.js (dòng "2 món"); 1 món và "không mã" đều đúng
- Đã thử | Kết quả:
  - in tong sau mỗi món | 90.000 rồi 441.000 ⇒ đã giảm ngay sau món 1
- Kết luận: phép giảm nằm TRONG vòng lặp ⇒ giảm lặp lại mỗi món (món đầu bị giảm 2 lần)
- Sửa + test: đưa phép giảm ra sau vòng lặp; gio-hang.test.js đỏ trước, xanh sau</code></pre>`;

const NGUON = [
  nguon('📘', 'Google SRE Book — Effective Troubleshooting', 'Cùng vòng lặp, ở quy mô hệ thống: report → triage → examine → diagnose → test/treat.', 'https://sre.google/sre-book/effective-troubleshooting/'),
  nguon('🟢', 'Node.js — Test runner (node:test)', 'Bộ chạy test có sẵn trong Node, không cần cài gì.', 'https://nodejs.org/api/test.html'),
  lienKet({ khoa: 'web-foundations', bai: 'wf-10-2-reading-errors-debugging', title: 'Web Foundations 10.2 — vòng lặp gỡ lỗi nhập môn', sub: 'Bản giới thiệu ngắn của vòng lặp; bài này là bản đầy đủ có nhật ký và test.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '1.1 — The loop: reproduce, isolate, hypothesise, test, fix, prevent|||1.1 — Vòng lặp: tái hiện, khoanh vùng, giả thuyết, kiểm, sửa, chặn tái phát',
  slug: 'dbg-1-1-quy-trinh',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Sáu bước gỡ lỗi, mỗi bước trả lời một câu hỏi, chạy trọn trên một lỗi giảm giá thật (441.000 thay vì 450.000); sửa triệu chứng và sửa gốc khác nhau thế nào; test node:test đỏ trước xanh sau; mẫu nhật ký gỡ lỗi.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Six steps, six questions — and one bug walked through all of them</h2>
<p class="lead">Every bug in this course, from a wrong total to a deadlock, goes through the same six steps. Each step answers exactly one question; if you cannot answer it, you are not ready for the next step. This lesson names the steps, then runs them for real on a discount bug that looks tiny and would cost a shop money every day.</p>

<h3>An everyday picture: the motorbike mechanic</h3>
<p>You ride into a repair shop: "it makes a noise". A good mechanic first makes it make the noise (<em>reproduce</em>) — revs the engine, rides a few metres. Then listens near the chain, then near the engine (<em>isolate</em>). "I think it is the chain tensioner" (<em>hypothesis</em>). Loosens it a little: the noise changes (<em>test</em>). Replaces it (<em>fix</em>), and tells you to come back if the noise returns after 500 km (<em>prevent</em>). A bad mechanic replaces the chain, the sprocket and the tensioner at once and charges you for all three. Same result today, no knowledge, triple the cost.</p>

<h3>The loop</h3>
<table>
<thead><tr><th>Step</th><th>Question it answers</th><th>Output you should have</th></tr></thead>
<tbody>
<tr><td>1. Reproduce</td><td>Can I make it happen on demand?</td><td>One command or a list of steps that shows the bug every time</td></tr>
<tr><td>2. Isolate</td><td>Where does correct turn into wrong?</td><td>A layer, a function, a line, an input</td></tr>
<tr><td>3. Hypothesise</td><td>What exactly could cause that?</td><td>One sentence you can prove wrong</td></tr>
<tr><td>4. Test</td><td>Is the hypothesis true?</td><td>An observation that confirms or kills it (if killed: back to 3)</td></tr>
<tr><td>5. Fix</td><td>What is the smallest change to the cause?</td><td>A diff you can explain in one sentence</td></tr>
<tr><td>6. Prevent</td><td>How will we know if it comes back?</td><td>A test that was red before the fix and is green after</td></tr>
</tbody>
</table>
<p>The loop goes back, not only forward: a killed hypothesis sends you back to step 3, and a fix that does not turn the test green sends you back to step 2.</p>

<h3>Walk-through on a real bug: a discount applied too many times</h3>
<p>A shop applies a discount code to an order. The tester reports: "with the 10% code my order of 500,000 costs 441,000; it should be 450,000". Here is the code (<code>~/dbg-lab/ch1/1-1/gio-hang.js</code>):</p>
${MA}
<p><strong>Step 1 — Reproduce.</strong> Do not trust the report yet; run it. The three lines are chosen on purpose — they vary one thing at a time (number of items, discount on/off):</p>
${OUT1}
<p>One item: correct (90,000). Two items without a code: correct (500,000). Two items with a code: wrong. We already know a lot: the bug needs <em>both</em> several items <em>and</em> a discount.</p>
<p><strong>Step 2 — Isolate.</strong> The total is correct before the loop and wrong after it, so look inside the loop. Print the value after each item (a temporary line, removed later):</p>
${OUT_VONG}
<p>After the first item the total is already discounted (90,000). Then 400,000 is added and the whole thing is discounted <em>again</em>. Correct turns into wrong on the line <code>if (giamGia) tong = tong * (1 - giamGia);</code>.</p>
<p><strong>Step 3 — Hypothesise.</strong> "The discount is inside the loop, so it is applied once per item; the first item's price is discounted twice." It can be proven wrong: if it were true, (100,000 × 0.9 + 400,000) × 0.9 must equal 441,000. It does.</p>
<p><strong>Step 4 — Test</strong>, before fixing: write the test that describes correct behaviour and watch it fail for the reason you expect.</p>
${TEST}
${OUT_DO}
<p>Red, with exactly the number the hypothesis predicts (441,000). A test that fails for the <em>predicted</em> reason is strong evidence; a test that fails for some other reason means your hypothesis is incomplete.</p>
<p><strong>Step 5 — Fix</strong> the cause, not the symptom. <strong>Step 6 — Prevent:</strong> the same test is now green, and stays in the project.</p>
${SUA}

<h3>Symptom fix vs root-cause fix</h3>
<p>A symptom fix for this bug is easy to imagine: "if there is more than one item, add back 10% of the first item". It would pass the tester's single example and break on three items. The test of a root-cause fix is simple: <strong>can you say the cause in one sentence, and does the fix remove that cause?</strong> "The discount was applied per item; now it is applied once to the sum." Yes on both counts.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — skipping step 6 because "it is obviously fixed".</strong> Six months later someone "optimises" the loop and moves the line back. Without the test nobody notices until a customer does. The test costs two minutes; finding the same bug twice costs a day.</p></div>

<h3>The debugging log for this bug</h3>
<p>Five lines, written while you work — not afterwards from memory:</p>
${NHAT_KY}

<h3>🧪 Practice (20 min) — run the loop yourself</h3>
<div class="callout ok">
<ol>
<li>Type <code>gio-hang.js</code> and <code>gio-hang.test.js</code> into <code>~/dbg-lab/ch1/1-1</code>. Run <code>node gio-hang.js</code> and confirm the three lines above.</li>
<li>Run <code>node --test gio-hang.test.js</code> and see it fail with <code>441000 !== 450000</code>.</li>
<li>Add a second test: three items (100,000 × 1, 200,000 × 2, 50,000 × 2) with 10% off must cost 540,000. Run it before fixing: what number does it show? Check it against your own hand calculation of the buggy loop.</li>
<li>Fix the cause, run both tests, and write the five-line log in <code>~/dbg-lab/nhat-ky/</code>.</li>
</ol>
<p><strong>Done when:</strong> both tests were red before the fix (the second shows a number you predicted by hand) and green after, and your log names the cause in one sentence.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">reproduce</span><span class="v">Make the bug happen on demand with a command or fixed steps.</span></div>
  <div class="kv"><span class="k">isolate</span><span class="v">Find where correct turns into wrong.</span></div>
  <div class="kv"><span class="k">hypothesis</span><span class="v">One sentence about the cause that an observation could prove wrong.</span></div>
  <div class="kv"><span class="k">root cause</span><span class="v">The reason underneath; removing it removes the bug.</span></div>
  <div class="kv"><span class="k">regression test</span><span class="v">A test that fails if this bug comes back.</span></div>
  <div class="kv"><span class="k">assertion</span><span class="v">A line in a test that states what must be true (<code>assert.strictEqual</code>).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Reproduce → isolate → hypothesise → test → fix → prevent; each step answers one question.</li>
<li>Vary one thing at a time when reproducing — it already narrows the cause.</li>
<li>A good hypothesis predicts a number or an observation that could prove it wrong.</li>
<li>Write the test before the fix and check it fails for the predicted reason.</li>
<li>A root-cause fix can be explained in one sentence and removes that cause; keep the test forever.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Sáu bước, sáu câu hỏi — và một lỗi đi trọn qua cả sáu</h2>
<p class="lead">Mọi lỗi trong khoá này, từ tổng tiền sai tới deadlock, đều đi qua cùng sáu bước. Mỗi bước trả lời đúng một câu hỏi; chưa trả lời được thì chưa sang bước sau. Bài này gọi tên sáu bước, rồi chạy thật chúng trên một lỗi giảm giá trông bé xíu mà mỗi ngày làm cửa hàng mất tiền.</p>

<h3>Liên tưởng đời thường: thợ sửa xe máy</h3>
<p>Bạn dắt xe vào tiệm: "xe kêu". Thợ giỏi trước hết làm cho nó kêu (<em>tái hiện</em>) — rồ ga, chạy thử vài mét. Rồi nghe gần xích, rồi gần máy (<em>khoanh vùng</em>). "Chắc là cái tăng xích" (<em>giả thuyết</em>). Nới nó ra một chút: tiếng kêu đổi (<em>kiểm</em>). Thay cái đó (<em>sửa</em>), và dặn bạn chạy 500 km mà còn kêu thì quay lại (<em>chặn tái phát</em>). Thợ kém thay luôn xích, nhông và tăng xích một lần rồi tính tiền cả ba. Hôm nay kết quả như nhau, nhưng không ai biết gì thêm, và tốn gấp ba.</p>

<h3>Vòng lặp</h3>
<table>
<thead><tr><th>Bước</th><th>Câu hỏi nó trả lời</th><th>Bạn phải có trong tay</th></tr></thead>
<tbody>
<tr><td>1. Tái hiện (reproduce)</td><td>Mình làm lỗi xảy ra theo ý được chưa?</td><td>Một lệnh hoặc danh sách bước, lần nào cũng ra lỗi</td></tr>
<tr><td>2. Khoanh vùng (isolate)</td><td>Đúng biến thành sai ở chỗ nào?</td><td>Một tầng, một hàm, một dòng, một đầu vào</td></tr>
<tr><td>3. Giả thuyết (hypothesise)</td><td>Chính xác cái gì gây ra điều đó?</td><td>Một câu mà có thể bị chứng minh là sai</td></tr>
<tr><td>4. Kiểm (test)</td><td>Giả thuyết đúng không?</td><td>Một quan sát xác nhận hoặc bác bỏ nó (bị bác: quay lại bước 3)</td></tr>
<tr><td>5. Sửa (fix)</td><td>Thay đổi nhỏ nhất vào đúng nguyên nhân là gì?</td><td>Một diff giải thích được bằng một câu</td></tr>
<tr><td>6. Chặn tái phát (prevent)</td><td>Làm sao biết nếu nó quay lại?</td><td>Một test đỏ trước khi sửa, xanh sau khi sửa</td></tr>
</tbody>
</table>
<p>Vòng lặp đi lùi được, không chỉ đi tới: giả thuyết bị bác đưa bạn về bước 3, bản sửa không làm test xanh đưa bạn về bước 2.</p>

<h3>Đi trọn trên một lỗi thật: giảm giá bị áp quá nhiều lần</h3>
<p>Một cửa hàng áp mã giảm giá cho đơn. Tester báo: "dùng mã 10% thì đơn 500.000 của tôi còn 441.000; đáng lẽ là 450.000". Đây là code (<code>~/dbg-lab/ch1/1-1/gio-hang.js</code>):</p>
${MA}
<p><strong>Bước 1 — Tái hiện.</strong> Đừng tin bản báo vội; chạy đã. Ba dòng được chọn có chủ đích — mỗi dòng đổi đúng một thứ (số món, có/không có mã):</p>
${OUT1}
<p>Một món: đúng (90.000). Hai món không mã: đúng (500.000). Hai món có mã: sai. Ta đã biết khá nhiều: lỗi cần <em>cả</em> nhiều món <em>lẫn</em> có mã giảm.</p>
<p><strong>Bước 2 — Khoanh vùng.</strong> Tổng đúng trước vòng lặp và sai sau vòng lặp, nên nhìn vào trong vòng lặp. In giá trị sau mỗi món (một dòng tạm, lát nữa xoá):</p>
${OUT_VONG}
<p>Sau món đầu, tổng đã bị giảm (90.000). Rồi cộng thêm 400.000 và cả tổng lại bị giảm <em>lần nữa</em>. Đúng biến thành sai ở dòng <code>if (giamGia) tong = tong * (1 - giamGia);</code>.</p>
<p><strong>Bước 3 — Giả thuyết.</strong> "Phép giảm nằm trong vòng lặp nên bị áp mỗi món một lần; giá món đầu bị giảm hai lần." Câu này bác bỏ được: nếu đúng thì (100.000 × 0,9 + 400.000) × 0,9 phải bằng 441.000. Nó bằng thật.</p>
<p><strong>Bước 4 — Kiểm</strong>, trước khi sửa: viết test mô tả hành vi đúng và nhìn nó đỏ vì đúng lý do bạn đoán.</p>
${TEST}
${OUT_DO}
<p>Đỏ, với đúng con số giả thuyết dự đoán (441.000). Test đỏ vì lý do <em>đã dự đoán</em> là bằng chứng mạnh; test đỏ vì lý do khác nghĩa là giả thuyết của bạn còn thiếu.</p>
<p><strong>Bước 5 — Sửa</strong> nguyên nhân, không sửa triệu chứng. <strong>Bước 6 — Chặn tái phát:</strong> chính test đó giờ xanh, và ở lại trong dự án.</p>
${SUA}

<h3>Sửa triệu chứng và sửa nguyên nhân gốc</h3>
<p>Một bản sửa triệu chứng cho lỗi này dễ nghĩ ra: "nếu nhiều hơn một món thì cộng trả lại 10% giá món đầu". Nó qua được đúng một ví dụ của tester và hỏng khi có ba món. Phép thử của bản sửa gốc rất đơn giản: <strong>bạn nói được nguyên nhân trong một câu không, và bản sửa có gỡ đúng nguyên nhân đó không?</strong> "Phép giảm bị áp theo từng món; giờ áp một lần cho tổng." Cả hai đều có.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — bỏ bước 6 vì "rõ ràng sửa xong rồi".</strong> Sáu tháng sau ai đó "tối ưu" vòng lặp và đưa dòng đó vào lại. Không có test thì không ai biết cho tới khi khách hàng biết. Test tốn hai phút; tìm lại cùng một lỗi lần hai tốn một ngày.</p></div>

<h3>Nhật ký gỡ lỗi cho lỗi này</h3>
<p>Năm dòng, viết trong lúc làm — không phải viết lại sau từ trí nhớ:</p>
${NHAT_KY}

<h3>🧪 Thực hành (20 phút) — tự chạy vòng lặp</h3>
<div class="callout ok">
<ol>
<li>Gõ <code>gio-hang.js</code> và <code>gio-hang.test.js</code> vào <code>~/dbg-lab/ch1/1-1</code>. Chạy <code>node gio-hang.js</code>, xác nhận ba dòng như trên.</li>
<li>Chạy <code>node --test gio-hang.test.js</code>, thấy nó đỏ với <code>441000 !== 450000</code>.</li>
<li>Thêm test thứ hai: ba món (100.000 × 1, 200.000 × 2, 50.000 × 2) giảm 10% phải còn 540.000. Chạy trước khi sửa: nó hiện số nào? Đối chiếu với con số bạn tự tính tay theo vòng lặp lỗi.</li>
<li>Sửa nguyên nhân, chạy cả hai test, viết nhật ký năm dòng vào <code>~/dbg-lab/nhat-ky/</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> cả hai test đỏ trước khi sửa (test thứ hai hiện đúng số bạn đã tính tay) và xanh sau khi sửa, và nhật ký nói nguyên nhân trong một câu.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">reproduce (tái hiện)</span><span class="v">Làm lỗi xảy ra theo ý bằng một lệnh hoặc các bước cố định.</span></div>
  <div class="kv"><span class="k">isolate (khoanh vùng)</span><span class="v">Tìm chỗ đúng biến thành sai.</span></div>
  <div class="kv"><span class="k">hypothesis (giả thuyết)</span><span class="v">Một câu về nguyên nhân mà một quan sát có thể bác bỏ.</span></div>
  <div class="kv"><span class="k">root cause (nguyên nhân gốc)</span><span class="v">Lý do bên dưới; gỡ nó là hết lỗi.</span></div>
  <div class="kv"><span class="k">regression test (test chặn tái phát)</span><span class="v">Test sẽ đỏ nếu lỗi này quay lại.</span></div>
  <div class="kv"><span class="k">assertion (khẳng định)</span><span class="v">Dòng trong test nói điều gì phải đúng (<code>assert.strictEqual</code>).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tái hiện → khoanh vùng → giả thuyết → kiểm → sửa → chặn tái phát; mỗi bước trả lời một câu hỏi.</li>
<li>Khi tái hiện, mỗi lần đổi một thứ — chỉ riêng việc đó đã thu hẹp nguyên nhân.</li>
<li>Giả thuyết tốt dự đoán được một con số hay một quan sát có thể bác bỏ nó.</li>
<li>Viết test trước khi sửa và kiểm nó đỏ đúng lý do đã đoán.</li>
<li>Bản sửa gốc giải thích được bằng một câu và gỡ đúng nguyên nhân đó; test giữ mãi.</li>
</ul>
${NGUON}
</div>
`,
};
