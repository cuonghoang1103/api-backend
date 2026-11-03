/**
 * Bài 10.1 — Tư duy như lập trình viên (nâng cấp 02/11/2026). Output thật: _demo/_t10/10-1/chay.sh (Node 22.23):
 * "đảo từ" bản 1 vs bản cuối trên 5 ca biên, dò tay từng bước của top-words, node --test: bản đầu 1/5 đạt → bản cuối 5/5.
 * Deck: scripts/slides-src/wf-10-1.mjs (9 slide, WF/v1/wf-10-1). Code Lab: wf-10-1-think-like-a-programmer.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const dong = (k, a, b) => OUT[k].split('\n').slice(a, b).join('\n');

const G = walkWf('wf-10-1', 'Thinking like a programmer', 'Tư duy như lập trình viên', [
  [1, 'Thinking like a programmer',
    '<p>You now know many tools. What decides whether you can use them on a problem nobody has shown you is a habit: restate the problem, plan in plain words, make the simplest case work, then add the hard cases one at a time with a test for each. This lesson runs that habit on two real problems and shows the output at every step.</p>',
    '<p>Giờ bạn đã biết nhiều công cụ. Điều quyết định bạn có dùng được chúng cho một bài toán chưa ai chỉ hay không là một thói quen: nói lại bài toán, lập kế hoạch bằng lời thường, cho ca đơn giản nhất chạy, rồi thêm từng ca khó một, mỗi ca một phép kiểm. Bài này chạy thói quen đó trên hai bài toán thật và cho thấy output ở từng bước.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to turn a vague task into input, output and steps, trace a plan by hand before trusting it, list edge cases deliberately, write those cases down as automatic tests with node test, and fix them one at a time until every test passes.</p>',
    '<p>Bạn sẽ biến được một việc mơ hồ thành đầu vào, đầu ra và các bước, dò tay một kế hoạch trước khi tin nó, liệt kê ca biên có chủ đích, viết các ca đó thành phép kiểm tự động bằng node test, và sửa từng ca cho tới khi mọi phép kiểm đều đạt.</p>'],
  [3, 'Restate, plan, solve, extend',
    '<p>Four steps. Say the input and output in your own words. Write the steps in plain language. Make one simple example work from start to end. Only then add the awkward cases. If you cannot write step two, you are not ready to write code yet.</p>',
    '<p>Bốn bước. Nói đầu vào và đầu ra bằng lời của bạn. Viết các bước bằng ngôn ngữ thường. Cho một ví dụ đơn giản chạy từ đầu tới cuối. Chỉ khi đó mới thêm các ca khó chịu. Nếu chưa viết được bước hai, bạn chưa sẵn sàng viết mã.</p>'],
  [4, 'The plan works — for one case',
    '<p>Reverse the words of a sentence: split, reverse, join. The first version gave the right answer for the normal sentence. Extra spaces came out as extra spaces in the wrong places, and a tab was not treated as a separator at all. The final version trims and splits on any run of white space.</p>',
    '<p>Đảo các từ trong một câu: tách, đảo, nối. Bản đầu cho đúng với câu bình thường. Khoảng trắng thừa thành khoảng trắng thừa ở sai chỗ, còn dấu tab hoàn toàn không được coi là dấu ngăn. Bản cuối cắt hai đầu và tách theo mọi chuỗi khoảng trắng.</p>'],
  [5, 'Trace the plan by hand',
    '<p>The three most common words in a post. Before writing the real function, we ran each step on one sentence and printed what it produced: the words, the words left after removing stop words, the counts, and the top three. Each line can be checked by eye.</p>',
    '<p>Ba từ hay gặp nhất trong một bài viết. Trước khi viết hàm thật, ta chạy từng bước trên một câu và in ra thứ nó tạo: các từ, các từ còn lại sau khi bỏ từ dừng, số đếm, và ba từ đứng đầu. Mỗi dòng đều kiểm được bằng mắt.</p>'],
  [6, 'Edge cases become tests',
    '<p>We wrote five cases as tests before fixing anything: the simple case, capital letters and punctuation, stop words, empty text, and ties. The first version, written in one go, passed only one of them. Each failure shows what was expected and what came back.</p>',
    '<p>Ta viết năm ca thành phép kiểm trước khi sửa gì: ca đơn giản, chữ hoa và dấu câu, từ dừng, văn bản rỗng, và hoà. Bản đầu tiên, viết một mạch, chỉ đạt một ca. Mỗi lỗi cho thấy điều được mong đợi và thứ thật sự trả về.</p>'],
  [7, 'Fix one case at a time',
    '<p>One change per failing test, run again, watch one more line turn green. After four small changes all five tests passed. Running after every few lines turns a large mystery into a small, recent change.</p>',
    '<p>Mỗi phép kiểm hỏng một thay đổi, chạy lại, nhìn thêm một dòng chuyển xanh. Sau bốn thay đổi nhỏ, cả năm phép kiểm đều đạt. Chạy sau mỗi vài dòng biến một bí ẩn lớn thành một thay đổi nhỏ, vừa mới làm.</p>'],
  [8, 'When you are stuck',
    '<p>Shrink the problem: fewer inputs, a smaller example, one step at a time. Explain it out loud, line by line. Print the value at each step. And step away for ten minutes. Being stuck is normal; staying stuck without a method is the problem.</p>',
    '<p>Thu nhỏ bài toán: ít đầu vào hơn, ví dụ nhỏ hơn, từng bước một. Giải thích thành tiếng, từng dòng. In giá trị ở mỗi bước. Và rời máy mười phút. Bị kẹt là bình thường; kẹt mà không có phương pháp mới là vấn đề.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to solve a new problem with the four steps: write the plan as comments, trace it by hand, write at least five tests including edge cases, and make them pass one at a time. Done when node test reports every test passing.</p>',
    '<p>Bài luyện yêu cầu bạn giải một bài toán mới bằng bốn bước: viết kế hoạch thành chú thích, dò tay, viết ít nhất năm phép kiểm có cả ca biên, và cho chúng đạt từng cái một. Xong khi node test báo mọi phép kiểm đều đạt.</p>'],
]);

export default {
  title: '10.1 — Thinking like a programmer|||10.1 — Tư duy như một lập trình viên',
  slug: 'wf-10-1-think-like-a-programmer',
  type: 'VIDEO',
  isFreePreview: true,
  video: { url: 'https://youtu.be/azcrPFhaY9k', durationSeconds: 0 },
  description: 'Nói lại bài toán, kế hoạch bằng lời, cho ca đơn giản chạy rồi mở rộng: "đảo từ" bản đầu đúng 1 câu nhưng sai với khoảng trắng thừa và tab (Node 22.23 chạy thật); dò tay từng bước "ba từ hay gặp nhất"; ca biên thành phép kiểm node --test — bản viết một mạch đạt 1/5, sửa từng ca tới 5/5; cách gỡ kẹt.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Programming is thinking first, typing second</h2>
<p class="lead">After this lesson you can take a task nobody has shown you and get it working on purpose: restate it as input and output, plan the steps in plain words, trace the plan by hand, list the awkward cases, write them down as automatic tests, and fix them one at a time. Every chapter so far gave you a tool — HTML, JavaScript, HTTP, SQL, TypeScript. This habit is what lets you use those tools on real problems, at work and in every course that follows.</p>

<h3>Step 1 — the four-step habit</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Restate</span><span class="lz-d">Input, output, one example — in your own words. "Given a sentence, return the same words in reverse order."</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Plan in plain words</span><span class="lz-d">Split into words · reverse the list · join with spaces. No syntax yet. If you cannot write this, stop and go back to 1.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Make the simplest case work</span><span class="lz-d">One normal input, end to end. Running beats perfect.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Extend, one case at a time</span><span class="lz-d">Empty input, extra spaces, capital letters, ties… each one tested after you add it.</span></div>
</div>
<p>The order matters. Beginners try to handle every case in the first attempt, hold ten things in their head at once, and freeze. Experienced developers deliberately make the problem smaller first.</p>

<h3>Step 2 — the plan works… for one case</h3>
<p>Reverse the words of a sentence. The plan "split, reverse, join" becomes one line of code (<code>reverseWordsV1</code>). Then the edge cases are run on purpose:</p>
${ma('javascript', CODE['_t10/10-1/reverse.mjs'])}
${ra(OUT['_t10/out/reverse'])}
<table>
<thead><tr><th>Input</th><th>Version 1</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>"the sky is blue"</code></td><td>✅ correct</td><td>the case the plan was written for</td></tr>
<tr><td><code>"  the   sky  "</code></td><td>❌ spaces moved around</td><td><code>split(' ')</code> makes an empty "word" between every two spaces</td></tr>
<tr><td><code>"one\\ttwo"</code></td><td>❌ unchanged</td><td>a tab is not a space, so there is only one "word"</td></tr>
<tr><td><code>""</code>, <code>"hello"</code></td><td>✅</td><td>(by luck — worth testing anyway)</td></tr>
</tbody>
</table>
<p>The fix is not a new plan — it is a better step 1 of the plan: "split on any run of white space, ignoring the ends" (<code>trim().split(/\\s+/)</code>), plus one decision for the empty sentence.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — testing only the example from the task.</strong> The example in a task description is the one case that is guaranteed to work. Bugs live in the cases nobody wrote down: empty, one item, duplicates, extra spaces, capital letters, very long input, negative numbers. Before you say "done", write the list on purpose — it takes two minutes and is where most real bugs are found.</p></div>

<h3>Step 3 — trace the plan by hand before trusting it</h3>
<p>A bigger task: "show the three most common words in a blog post, ignoring capital letters, punctuation and little words like <em>the</em>". The plan in plain words:</p>
<pre><code>1. split the text into words (lowercase, letters and digits only)
2. drop stop words ("the", "a", "is", …)
3. count each remaining word
4. sort by count (ties alphabetically), keep the first three</code></pre>
<p>Run each step on one sentence and print what it produced. This is what "tracing" means — and you can check every line by eye:</p>
${ra(OUT['_t10/out/trace'])}
${ma('javascript', CODE['_t10/10-1/top-words.mjs'])}
<p>The function has exactly the four numbered steps of the plan, as comments. When something goes wrong later, you know which step to look at.</p>

<h3>Step 4 — edge cases become automatic tests</h3>
<p>Instead of re-checking cases by hand after every change, write them down once as tests. Node has a test runner built in (<code>node:test</code>, Node 18+), nothing to install:</p>
${ma('javascript', CODE['_t10/10-1/top-words.test.mjs'])}
<p>Here is the first version — written in one go, before thinking about edge cases — against those five tests:</p>
${ma('javascript', CODE['_t10/10-1/top-words-v1.mjs'])}
${ra(dong('_t10/out/tests-v1', 0, 27) + '\n  … (three more failures, each with expected vs actual)')}
<p>One pass, four failures — and each failure says exactly what was expected (<code>-</code>) and what came back (<code>+</code>): <code>'Cache.'</code> with its full stop counted as a separate word, <code>'the'</code> winning because stop words were never removed, an empty string counted as a word, and ties in whatever order they appeared.</p>

<h3>Step 5 — fix one failing test at a time</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Test 2</span><span class="lz-t">lowercase + a regex for words</span><span class="lz-d"><code>toLowerCase().match(/[\\p{L}\\p{N}']+/gu)</code> — letters in any language, so "Đà Nẵng" stays two words.</span></div>
<div class="lz-layer"><span class="lz-k">Test 3</span><span class="lz-t">a stop-word set</span><span class="lz-d"><code>if (!STOP.has(w))</code> before counting.</span></div>
<div class="lz-layer"><span class="lz-k">Test 4</span><span class="lz-t">no matches</span><span class="lz-d"><code>match</code> returns <code>null</code> for "" ⇒ <code>?? []</code>.</span></div>
<div class="lz-layer"><span class="lz-k">Test 5</span><span class="lz-t">tie-break</span><span class="lz-d"><code>b[1] - a[1] || a[0].localeCompare(b[0])</code>.</span></div>
</div>
${ra(OUT['_t10/out/tests-final'])}
<p>Four small changes, four runs, five green ticks. Each run told you whether the last change helped — that is the whole point of running often.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — writing a hundred lines before running anything.</strong> It feels fast and it is the slowest way to work: when you finally run it, five things are wrong at once, they interact, and the first error is rarely the one that matters. Run after every few lines, even if it only prints. "Something in here is broken" becomes "the line I just typed is broken" — a much smaller problem.</p></div>

<h3>Step 6 — when you are stuck</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Shrink it</span><span class="v">Smaller input, fewer features, one step. Does step 1 alone produce what you expect? (Lesson 10.4 turns this into a method.)</span></div>
  <div class="kv"><span class="k">Print every step</span><span class="v">Exactly like the trace above. Guessing what a value is costs more than printing it.</span></div>
  <div class="kv"><span class="k">Explain it out loud</span><span class="v">"Rubber duck": explain each line to an object. You hear the wrong assumption as you say it.</span></div>
  <div class="kv"><span class="k">Write the test first</span><span class="v">If you cannot write the expected output, the problem is not clear yet — go back to "restate".</span></div>
  <div class="kv"><span class="k">Step away</span><span class="v">Ten minutes away from the screen solves a surprising number of bugs.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Practice (40 minutes) — a problem nobody solved for you</strong></p>
<p>Task: <em>"Given a list of orders <code>{ customer, total }</code>, return the top N customers by total spent, with their totals."</em></p>
<ol>
<li>Restate it in one sentence with one example input and the exact output you expect.</li>
<li>Write the plan as numbered comments in an empty <code>top-customers.mjs</code>.</li>
<li>Trace the plan by hand on 4 orders (on paper or in comments).</li>
<li>Write at least five tests in <code>top-customers.test.mjs</code>: simple case, a customer with several orders, N larger than the number of customers, an empty list, and a tie.</li>
<li>Implement until <code>node --test</code> passes — run it after each change.</li>
</ol>
<p>Hint: start from the plan of <code>topWords</code> — "count" becomes "add up", the rest is the same shape.</p>
<p><strong>Done when:</strong> <code>node --test</code> prints <code>ℹ pass 5</code> (or more) and <code>ℹ fail 0</code>, and your file still contains the plan as comments. Then do Code Lab module 10.1.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">decompose</span><span class="v">chia nhỏ bài toán.</span></div>
  <div class="kv"><span class="k">pseudocode</span><span class="v">mã giả — các bước bằng lời thường.</span></div>
  <div class="kv"><span class="k">edge case</span><span class="v">ca biên — rỗng, một phần tử, trùng, khoảng trắng thừa…</span></div>
  <div class="kv"><span class="k">trace</span><span class="v">dò tay — chạy từng bước và in kết quả.</span></div>
  <div class="kv"><span class="k">test runner</span><span class="v">trình chạy kiểm thử — <code>node --test</code>.</span></div>
  <div class="kv"><span class="k">assertion</span><span class="v">phép khẳng định — <code>assert.deepEqual</code>.</span></div>
  <div class="kv"><span class="k">expected / actual</span><span class="v">giá trị mong đợi / giá trị thật.</span></div>
  <div class="kv"><span class="k">stop word</span><span class="v">từ dừng — the, a, is…</span></div>
  <div class="kv"><span class="k">tie-break</span><span class="v">luật phân định khi hoà.</span></div>
  <div class="kv"><span class="k">rubber duck debugging</span><span class="v">gỡ lỗi bằng cách giải thích thành tiếng.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Restate → plan in plain words → make one case work → extend one case at a time.</li>
  <li>The task's own example is the case least likely to be broken; list edge cases on purpose.</li>
  <li>Trace a plan by printing each step on one example before trusting it.</li>
  <li>Write edge cases as tests (<code>node:test</code>); a failure shows expected vs actual.</li>
  <li>Fix one failing test at a time and run after every small change.</li>
  <li>Stuck? Shrink, print, explain out loud, write the test first, step away.</li>
</ul>
${nguon('📗', 'Node.js — Test runner', 'node:test, assert and the built-in reporters', 'https://nodejs.org/api/test.html')}
${nguon('📘', 'How to Solve It (George Pólya) — summary', 'Understand, plan, carry out, look back: the classic four steps', 'https://en.wikipedia.org/wiki/How_to_Solve_It')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-1-vi-sao-test', title: 'Node.js 14.1 — Why we test', sub: 'Automatic tests for a real backend, from unit tests to HTTP tests', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Lập trình là nghĩ trước, gõ sau</h2>
<p class="lead">Học xong bài này bạn có thể cầm một việc chưa ai chỉ và làm cho nó chạy một cách có chủ đích: nói lại nó thành đầu vào và đầu ra, lập kế hoạch các bước bằng lời thường, dò tay kế hoạch, liệt kê các ca khó chịu, viết chúng thành phép kiểm tự động, và sửa từng cái một. Mọi chương tới giờ cho bạn một công cụ — HTML, JavaScript, HTTP, SQL, TypeScript. Thói quen này là thứ giúp bạn dùng các công cụ đó cho bài toán thật, ở chỗ làm và ở mọi khoá tiếp theo.</p>

<h3>Bước 1 — thói quen bốn bước</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nói lại</span><span class="lz-d">Đầu vào, đầu ra, một ví dụ — bằng lời của bạn. "Cho một câu, trả về chính các từ đó theo thứ tự ngược lại."</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Kế hoạch bằng lời thường</span><span class="lz-d">Tách thành từ · đảo danh sách · nối bằng dấu cách. Chưa có cú pháp. Chưa viết được thì dừng và quay lại bước 1.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cho ca đơn giản nhất chạy</span><span class="lz-d">Một đầu vào bình thường, từ đầu tới cuối. Chạy được hơn hoàn hảo.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Mở rộng, từng ca một</span><span class="lz-d">Đầu vào rỗng, khoảng trắng thừa, chữ hoa, hoà… mỗi ca được kiểm ngay sau khi thêm.</span></div>
</div>
<p>Thứ tự là quan trọng. Người mới cố xử lý mọi ca ngay lần đầu, giữ mười thứ trong đầu cùng lúc, rồi đơ. Lập trình viên có kinh nghiệm cố ý làm bài toán nhỏ lại trước.</p>

<h3>Bước 2 — kế hoạch đúng… cho một ca</h3>
<p>Đảo các từ trong một câu. Kế hoạch "tách, đảo, nối" thành một dòng mã (<code>reverseWordsV1</code>). Rồi các ca biên được chạy có chủ đích:</p>
${ma('javascript', CODE['_t10/10-1/reverse.mjs'])}
${ra(OUT['_t10/out/reverse'])}
<table>
<thead><tr><th>Đầu vào</th><th>Bản 1</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td><code>"the sky is blue"</code></td><td>✅ đúng</td><td>đúng ca mà kế hoạch được viết cho</td></tr>
<tr><td><code>"  the   sky  "</code></td><td>❌ khoảng trắng bị xáo</td><td><code>split(' ')</code> tạo một "từ" rỗng giữa mỗi hai dấu cách</td></tr>
<tr><td><code>"one\\ttwo"</code></td><td>❌ giữ nguyên</td><td>tab không phải dấu cách, nên chỉ có một "từ"</td></tr>
<tr><td><code>""</code>, <code>"hello"</code></td><td>✅</td><td>(nhờ may — vẫn đáng kiểm)</td></tr>
</tbody>
</table>
<p>Cách sửa không phải kế hoạch mới — mà là bước 1 tốt hơn: "tách theo mọi chuỗi khoảng trắng, bỏ hai đầu" (<code>trim().split(/\\s+/)</code>), cộng một quyết định cho câu rỗng.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ kiểm đúng ví dụ trong đề.</strong> Ví dụ trong mô tả việc là ca duy nhất chắc chắn chạy. Lỗi sống ở những ca không ai viết ra: rỗng, một phần tử, trùng lặp, khoảng trắng thừa, chữ hoa, đầu vào rất dài, số âm. Trước khi nói "xong", hãy viết danh sách đó có chủ đích — mất hai phút và là nơi tìm ra phần lớn lỗi thật.</p></div>

<h3>Bước 3 — dò tay kế hoạch trước khi tin nó</h3>
<p>Một việc lớn hơn: "hiện ba từ hay gặp nhất trong một bài blog, bỏ qua chữ hoa, dấu câu và các từ nhỏ như <em>the</em>". Kế hoạch bằng lời thường:</p>
<pre><code>1. tách văn bản thành từ (chữ thường, chỉ chữ và số)
2. bỏ từ dừng ("the", "a", "is", …)
3. đếm từng từ còn lại
4. sắp theo số đếm (hoà thì theo bảng chữ cái), giữ ba từ đầu</code></pre>
<p>Chạy từng bước trên một câu và in thứ nó tạo. Đó là "dò tay" — và bạn kiểm được từng dòng bằng mắt:</p>
${ra(OUT['_t10/out/trace'])}
${ma('javascript', CODE['_t10/10-1/top-words.mjs'])}
<p>Hàm có đúng bốn bước đánh số của kế hoạch, dưới dạng chú thích. Khi có gì hỏng sau này, bạn biết phải nhìn bước nào.</p>

<h3>Bước 4 — ca biên thành phép kiểm tự động</h3>
<p>Thay vì kiểm lại bằng tay sau mỗi thay đổi, hãy viết các ca một lần thành phép kiểm. Node có sẵn trình chạy kiểm thử (<code>node:test</code>, Node 18+), không cần cài gì:</p>
${ma('javascript', CODE['_t10/10-1/top-words.test.mjs'])}
<p>Đây là bản đầu tiên — viết một mạch, trước khi nghĩ tới ca biên — chạy với năm phép kiểm đó:</p>
${ma('javascript', CODE['_t10/10-1/top-words-v1.mjs'])}
${ra(dong('_t10/out/tests-v1', 0, 27) + '\n  … (thêm ba lỗi nữa, mỗi lỗi có mong đợi và thực tế)')}
<p>Một đạt, bốn hỏng — và mỗi lỗi nói chính xác thứ được mong đợi (<code>-</code>) và thứ trả về (<code>+</code>): <code>'Cache.'</code> cả dấu chấm được tính là một từ riêng, <code>'the'</code> thắng vì từ dừng chưa bao giờ bị bỏ, chuỗi rỗng được đếm là một từ, và các từ hoà theo thứ tự xuất hiện tuỳ ý.</p>

<h3>Bước 5 — sửa từng phép kiểm hỏng một</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Kiểm 2</span><span class="lz-t">chữ thường + regex cho từ</span><span class="lz-d"><code>toLowerCase().match(/[\\p{L}\\p{N}']+/gu)</code> — chữ của mọi ngôn ngữ, nên "Đà Nẵng" vẫn là hai từ.</span></div>
<div class="lz-layer"><span class="lz-k">Kiểm 3</span><span class="lz-t">tập từ dừng</span><span class="lz-d"><code>if (!STOP.has(w))</code> trước khi đếm.</span></div>
<div class="lz-layer"><span class="lz-k">Kiểm 4</span><span class="lz-t">không khớp gì</span><span class="lz-d"><code>match</code> trả <code>null</code> với "" ⇒ <code>?? []</code>.</span></div>
<div class="lz-layer"><span class="lz-k">Kiểm 5</span><span class="lz-t">phân định hoà</span><span class="lz-d"><code>b[1] - a[1] || a[0].localeCompare(b[0])</code>.</span></div>
</div>
${ra(OUT['_t10/out/tests-final'])}
<p>Bốn thay đổi nhỏ, bốn lần chạy, năm dấu tích xanh. Mỗi lần chạy cho biết thay đổi vừa rồi có giúp không — đó chính là lý do phải chạy thường xuyên.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — viết trăm dòng rồi mới chạy.</strong> Cảm giác nhanh nhưng là cách làm chậm nhất: khi cuối cùng chạy, năm thứ hỏng cùng lúc, chúng ảnh hưởng nhau, và lỗi đầu tiên hiếm khi là lỗi quan trọng. Chạy sau mỗi vài dòng, dù chỉ để in. "Có gì trong này hỏng" thành "dòng tôi vừa gõ hỏng" — một bài toán nhỏ hơn nhiều.</p></div>

<h3>Bước 6 — khi bị kẹt</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Thu nhỏ</span><span class="v">Đầu vào nhỏ hơn, ít tính năng hơn, một bước. Riêng bước 1 có cho ra thứ bạn mong không? (Bài 10.4 biến việc này thành phương pháp.)</span></div>
  <div class="kv"><span class="k">In mọi bước</span><span class="v">Đúng như phần dò tay ở trên. Đoán một giá trị tốn hơn in nó ra.</span></div>
  <div class="kv"><span class="k">Giải thích thành tiếng</span><span class="v">"Chú vịt cao su": giải thích từng dòng cho một đồ vật. Bạn nghe ra giả định sai ngay khi nói.</span></div>
  <div class="kv"><span class="k">Viết phép kiểm trước</span><span class="v">Không viết được output mong đợi thì bài toán chưa rõ — quay lại bước "nói lại".</span></div>
  <div class="kv"><span class="k">Rời máy</span><span class="v">Mười phút rời màn hình giải được số lỗi nhiều đến bất ngờ.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (40 phút) — một bài toán chưa ai giải giùm</strong></p>
<p>Việc: <em>"Cho danh sách đơn hàng <code>{ customer, total }</code>, trả về N khách chi tiêu nhiều nhất kèm tổng của họ."</em></p>
<ol>
<li>Nói lại bằng một câu, kèm một ví dụ đầu vào và đúng output bạn mong đợi.</li>
<li>Viết kế hoạch thành chú thích đánh số trong một tệp trống <code>top-customers.mjs</code>.</li>
<li>Dò tay kế hoạch trên 4 đơn hàng (trên giấy hoặc trong chú thích).</li>
<li>Viết ít nhất năm phép kiểm trong <code>top-customers.test.mjs</code>: ca đơn giản, một khách có nhiều đơn, N lớn hơn số khách, danh sách rỗng, và một ca hoà.</li>
<li>Cài đặt tới khi <code>node --test</code> đạt — chạy sau mỗi thay đổi.</li>
</ol>
<p>Gợi ý: bắt đầu từ kế hoạch của <code>topWords</code> — "đếm" thành "cộng dồn", phần còn lại cùng hình dạng.</p>
<p><strong>Xong khi:</strong> <code>node --test</code> in <code>ℹ pass 5</code> (hoặc hơn) và <code>ℹ fail 0</code>, và tệp của bạn vẫn giữ kế hoạch dưới dạng chú thích. Sau đó làm module Code Lab 10.1.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">decompose</span><span class="v">chia nhỏ bài toán.</span></div>
  <div class="kv"><span class="k">pseudocode</span><span class="v">mã giả — các bước bằng lời thường.</span></div>
  <div class="kv"><span class="k">edge case</span><span class="v">ca biên — rỗng, một phần tử, trùng, khoảng trắng thừa…</span></div>
  <div class="kv"><span class="k">trace</span><span class="v">dò tay — chạy từng bước và in kết quả.</span></div>
  <div class="kv"><span class="k">test runner</span><span class="v">trình chạy kiểm thử — <code>node --test</code>.</span></div>
  <div class="kv"><span class="k">assertion</span><span class="v">phép khẳng định — <code>assert.deepEqual</code>.</span></div>
  <div class="kv"><span class="k">expected / actual</span><span class="v">giá trị mong đợi / giá trị thật.</span></div>
  <div class="kv"><span class="k">stop word</span><span class="v">từ dừng — the, a, is…</span></div>
  <div class="kv"><span class="k">tie-break</span><span class="v">luật phân định khi hoà.</span></div>
  <div class="kv"><span class="k">rubber duck debugging</span><span class="v">gỡ lỗi bằng cách giải thích thành tiếng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Nói lại → kế hoạch bằng lời → cho một ca chạy → mở rộng từng ca một.</li>
  <li>Ví dụ trong đề là ca ít khả năng hỏng nhất; hãy liệt kê ca biên có chủ đích.</li>
  <li>Dò tay một kế hoạch bằng cách in từng bước trên một ví dụ trước khi tin nó.</li>
  <li>Viết ca biên thành phép kiểm (<code>node:test</code>); lỗi cho thấy mong đợi và thực tế.</li>
  <li>Sửa từng phép kiểm hỏng một và chạy sau mỗi thay đổi nhỏ.</li>
  <li>Bị kẹt? Thu nhỏ, in ra, giải thích thành tiếng, viết phép kiểm trước, rời máy.</li>
</ul>
${nguon('📗', 'Node.js — Test runner', 'node:test, assert và các reporter có sẵn', 'https://nodejs.org/api/test.html')}
${nguon('📘', 'How to Solve It (George Pólya) — tóm tắt', 'Hiểu, lập kế hoạch, thực hiện, nhìn lại: bốn bước kinh điển', 'https://en.wikipedia.org/wiki/How_to_Solve_It')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-1-vi-sao-test', title: 'Node.js 14.1 — Vì sao phải kiểm thử', sub: 'Kiểm thử tự động cho một backend thật, từ unit test tới kiểm HTTP', cta: 'Mở bài' })}
</div>
`,
};
