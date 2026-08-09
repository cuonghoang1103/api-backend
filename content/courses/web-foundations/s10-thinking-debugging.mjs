/**
 * Web Foundations — Chương 10 (CAPSTONE): Tư duy lập trình, gỡ lỗi & quy trình Git.
 * Đóng khoá: chia nhỏ vấn đề, đọc lỗi + vòng lặp debug, git workflow (branch/PR/merge/conflict),
 * cách học tiếp, và bức tranh full-stack nối mọi chương lại + trỏ sang khoá Node.js/Next.js.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${. Quiz có field content.
 */

export default {
  title: 'Chapter 10 — Thinking, debugging & Git workflow|||Chương 10 — Tư duy lập trình, gỡ lỗi & quy trình Git',
  description: 'Chương cuối khoá gói lại thứ quan trọng nhất: cách nghĩ về một vấn đề trước khi gõ code, cách đọc một lỗi thay vì sợ nó, cách làm việc với Git như một lập trình viên thật (nhánh, Pull Request, merge), cách tự học sau khi hết khoá, và một bức tranh tổng kết nối mọi mảnh — trình duyệt, HTTP, server, database — lại với nhau.',
  lessons: [
    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — Thinking like a programmer|||10.1 — Tư duy như một lập trình viên',
      slug: 'wf-10-1-think-like-a-programmer',
      type: 'VIDEO',
      isFreePreview: true,
      video: { url: 'https://youtu.be/azcrPFhaY9k', durationSeconds: 0 },
      description: 'Chia nhỏ một vấn đề lớn thành các bước nhỏ, viết pseudocode trước, giải phiên bản đơn giản nhất rồi mở rộng — kỹ năng quan trọng hơn bất kỳ cú pháp nào.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Programming is thinking first, typing second</h2>
<p class="lead">Every lesson so far taught you a tool: HTML, CSS, JavaScript, HTTP, auth, a database, TypeScript. This lesson teaches the thing that decides whether you use those tools well: how to <strong>break a big, scary problem into small, boring steps</strong>. That skill matters more than knowing any one syntax by heart.</p>

<h3>The core habit: decompose before you code</h3>
<p>Beginners stare at a problem and try to write the whole solution in one shot — and freeze, because it is too big to hold in your head at once. Experienced programmers do something different: they refuse to write real code until the problem is broken into pieces small enough that each piece is obviously solvable.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">1. Restate the problem</span><span class="v">In your own words. If you cannot restate it, you do not understand it yet.</span></div>
  <div class="kv"><span class="k">2. List the steps</span><span class="v">In plain language, in order — this is pseudocode, no syntax required.</span></div>
  <div class="kv"><span class="k">3. Solve the simplest version</span><span class="v">Ignore edge cases at first. Get ONE case working end to end.</span></div>
  <div class="kv"><span class="k">4. Extend</span><span class="v">Add edge cases and extra requirements one at a time, testing after each.</span></div>
</div>

<h3>Worked example: reverse the words in a sentence</h3>
<p>Problem: given "the sky is blue", produce "blue is sky the" — the WORDS reversed, not the letters. Do not open your editor yet. Think first.</p>
<pre><code>Step 1 — restate:
  Input:  a sentence, words separated by spaces
  Output: same words, in reverse order, still separated by spaces

Step 2 — pseudocode (plain language, no real syntax):
  split the sentence into a list of words
  reverse the order of that list
  join the list back into a sentence with spaces

Step 3 — simplest version, walked through by hand:
  "the sky is blue"
  → split  → ["the", "sky", "is", "blue"]
  → reverse → ["blue", "is", "sky", "the"]
  → join   → "blue is sky the"   ✔ matches expected output

Step 4 — now write the real code, because the plan already works:
  const words = sentence.split(" ");
  const reversed = words.reverse();
  const result = reversed.join(" ");</code></pre>
<p>Notice something important: by the time real code was written, the hard thinking was already done. Typing <code>.split(" ").reverse().join(" ")</code> was the easy part — because the plan in Step 2 already matched the problem exactly.</p>

<h3>Extend it: what about edge cases?</h3>
<pre><code>What if the sentence has extra spaces?   "the  sky"  → split gives an empty word
What if the sentence is empty?           ""          → split gives [""]
What if there is only one word?          "hello"     → reversed list of 1 is unchanged</code></pre>
<p>You only think about these AFTER the simple case works — trying to handle every edge case before you have anything working just multiplies the number of things you have to hold in your head at once.</p>

<h3>Pseudocode is not a formality — it is thinking on paper</h3>
<p class="pitfall"><strong>If you cannot write the plain-language steps, you are not ready to write the code.</strong> "I don't know where to start" almost always means Step 1 and Step 2 were skipped. Going straight to the editor and typing randomly, hoping something works, is the single biggest time-waster for beginners. Five minutes with pen and paper (or a comment block) before touching the keyboard saves an hour of guessing.</p>

<p class="note-ct"><strong>This is the exact loop you already used, without naming it.</strong> Every array method in Chapter 3, every component you composed in Chapter 4, every route you sketched in Chapter 6 — you restated the problem, listed steps, solved the simple case, then extended. Naming the habit lets you apply it on purpose, on problems no lesson has ever shown you.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Lập trình là nghĩ trước, gõ sau</h2>
<p class="lead">Mọi bài học tới giờ đã dạy bạn một công cụ: HTML, CSS, JavaScript, HTTP, auth, database, TypeScript. Bài này dạy thứ quyết định bạn dùng những công cụ đó tốt hay không: cách <strong>chia một vấn đề lớn, đáng sợ thành các bước nhỏ, nhàm chán</strong>. Kỹ năng đó quan trọng hơn thuộc lòng bất kỳ cú pháp nào.</p>

<h3>Thói quen cốt lõi: chia nhỏ trước khi viết code</h3>
<p>Người mới nhìn một vấn đề rồi cố viết cả lời giải trong một lần — và đơ, vì nó quá lớn để giữ trong đầu cùng lúc. Lập trình viên có kinh nghiệm làm khác: họ từ chối viết code thật cho đến khi vấn đề được chia thành các mảnh đủ nhỏ để mỗi mảnh rõ ràng giải được.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">1. Diễn đạt lại vấn đề</span><span class="v">Bằng lời của bạn. Nếu không diễn đạt lại được nghĩa là bạn chưa hiểu nó.</span></div>
  <div class="kv"><span class="k">2. Liệt kê các bước</span><span class="v">Bằng ngôn ngữ thường, theo thứ tự — đây là pseudocode, không cần cú pháp.</span></div>
  <div class="kv"><span class="k">3. Giải phiên bản đơn giản nhất</span><span class="v">Bỏ qua trường hợp biên trước. Cho MỘT trường hợp chạy trọn từ đầu đến cuối.</span></div>
  <div class="kv"><span class="k">4. Mở rộng</span><span class="v">Thêm trường hợp biên và yêu cầu thêm từng cái một, kiểm tra sau mỗi lần.</span></div>
</div>

<h3>Ví dụ có lời giải: đảo thứ tự các từ trong một câu</h3>
<p>Vấn đề: cho "the sky is blue", tạo ra "blue is sky the" — đảo CÁC TỪ, không phải đảo chữ cái. Đừng mở editor vội. Nghĩ trước.</p>
<pre><code>Bước 1 — diễn đạt lại:
  Đầu vào:  một câu, các từ cách nhau bởi dấu cách
  Đầu ra:   cùng các từ đó, theo thứ tự ngược, vẫn cách nhau bởi dấu cách

Bước 2 — pseudocode (ngôn ngữ thường, không cú pháp thật):
  tách câu thành một danh sách các từ
  đảo ngược thứ tự danh sách đó
  ghép danh sách lại thành câu, cách nhau bởi dấu cách

Bước 3 — phiên bản đơn giản nhất, làm tay từng bước:
  "the sky is blue"
  → tách    → ["the", "sky", "is", "blue"]
  → đảo     → ["blue", "is", "sky", "the"]
  → ghép    → "blue is sky the"   ✔ khớp đầu ra mong đợi

Bước 4 — giờ viết code thật, vì kế hoạch đã chạy đúng:
  const words = sentence.split(" ");
  const reversed = words.reverse();
  const result = reversed.join(" ");</code></pre>
<p>Để ý một điều quan trọng: đến lúc viết code thật, phần nghĩ khó đã xong. Gõ <code>.split(" ").reverse().join(" ")</code> chỉ là phần dễ — vì kế hoạch ở Bước 2 đã khớp chính xác với vấn đề.</p>

<h3>Mở rộng: còn trường hợp biên thì sao?</h3>
<pre><code>Nếu câu có dấu cách thừa?      "the  sky"  → tách ra một "từ" rỗng
Nếu câu rỗng?                  ""          → tách ra [""]
Nếu chỉ có một từ?             "hello"     → đảo danh sách 1 phần tử vẫn không đổi</code></pre>
<p>Bạn chỉ nghĩ tới những cái này SAU KHI trường hợp đơn giản đã chạy được — cố xử lý mọi trường hợp biên trước khi có gì chạy được chỉ nhân số thứ bạn phải giữ trong đầu cùng lúc.</p>

<h3>Pseudocode không phải thủ tục — đó là nghĩ trên giấy</h3>
<p class="pitfall"><strong>Nếu không viết được các bước bằng ngôn ngữ thường, bạn chưa sẵn sàng viết code.</strong> "Tôi không biết bắt đầu từ đâu" gần như luôn nghĩa là Bước 1 và Bước 2 đã bị bỏ qua. Mở thẳng editor gõ ngẫu nhiên, hy vọng chạy được, là kẻ ngốn thời gian số một của người mới. Năm phút với bút giấy (hay một khối comment) trước khi chạm bàn phím tiết kiệm cả tiếng đồng hồ đoán mò.</p>

<p class="note-ct"><strong>Đây đúng là vòng lặp bạn đã dùng, chỉ chưa gọi tên.</strong> Mọi phương thức mảng ở Chương 3, mọi component bạn ghép ở Chương 4, mọi route bạn phác ở Chương 6 — bạn đã diễn đạt lại vấn đề, liệt kê bước, giải trường hợp đơn giản, rồi mở rộng. Gọi tên thói quen này giúp bạn áp dụng nó có chủ đích, trên những vấn đề chưa bài học nào từng chỉ bạn.</p>
</div>
`,
    },

    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — Reading errors & the debugging loop|||10.2 — Đọc lỗi & vòng lặp gỡ lỗi',
      slug: 'wf-10-2-reading-errors-debugging',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/H0XScE08hy8', durationSeconds: 0 },
      description: 'Đọc thông điệp lỗi + số dòng, stack trace, dùng console.log để soi, breakpoint/DevTools, đặt giả thuyết rồi kiểm tra — lỗi là trợ thủ, không phải kẻ thù.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>An error message is not an attack — it is a clue</h2>
<p class="lead">Beginners see red text and panic. Experienced programmers see red text and read it, because an error message is the computer doing you a favour: telling you exactly what went wrong and often exactly where. Debugging is not a mysterious talent — it is a repeatable loop you can learn today.</p>

<h3>Step 1 — actually read the message and the line number</h3>
<pre><code>TypeError: Cannot read properties of undefined (reading 'name')
    at getUserName (app.js:14:23)
    at main (app.js:22:5)</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Error type</span><span class="v">TypeError — you tried to use a value as the wrong kind of thing.</span></div>
  <div class="kv"><span class="k">The message</span><span class="v">"reading 'name'" — you accessed .name on something that was undefined.</span></div>
  <div class="kv"><span class="k">The location</span><span class="v">app.js:14:23 — line 14, column 23. Go look there FIRST, not at random other lines.</span></div>
</div>
<p class="pitfall"><strong>The single biggest beginner mistake: not reading the error at all.</strong> Scrolling past red text to guess-and-check random changes throws away information the computer already handed you for free. Read the first line. Read the line number. That alone solves a large fraction of bugs.</p>

<h3>Step 2 — follow the stack trace</h3>
<p>The <strong>stack trace</strong> is the chain of function calls that led to the error, most recent call first. It answers "how did the program even get here?" — read it top to bottom to trace the path from where it broke back to where you called it.</p>

<h3>Step 3 — inspect with console.log</h3>
<p>When the message alone is not enough, make the program show its work. Print the values right before the line that breaks:</p>
<pre><code>function getUserName(user) {
  console.log("user is:", user);   // what is it actually, right here?
  return user.name;
}</code></pre>
<p>If <code>user</code> logs as <code>undefined</code>, the bug is not in this function at all — it is wherever <code>getUserName</code> was called without a real user. Move the console.log upstream and repeat.</p>

<h3>Step 4 — breakpoints and DevTools, when console.log is not enough</h3>
<p>Browser DevTools (Chapter 5) let you set a <strong>breakpoint</strong> — the code pauses exactly there, and you can inspect every variable in scope, step line by line, and watch the call stack live. It is console.log with superpowers: no editing the source, no re-running from scratch.</p>
<pre><code>Sources tab → click the line number → red dot = breakpoint
Reload the page → execution pauses there
Hover any variable → see its live value
Step over / step into → walk the code one line at a time</code></pre>

<h3>The loop: hypothesis, then test it</h3>
<p>Debugging is the scientific method applied to code:</p>
<pre><code>1. Form a hypothesis  — "I think 'user' is undefined because the fetch failed"
2. Test it            — console.log(user) right before the crash
3. Confirm or reject   — if confirmed, fix that; if rejected, form a new hypothesis
4. Repeat</code></pre>
<p class="note-ct"><strong>Random changes are not debugging.</strong> Editing code without a hypothesis about WHY it will fix things is guessing, and guessing rarely converges. One deliberate hypothesis, tested with one console.log or breakpoint, beats ten random edits — and you learn something permanent from every hypothesis, even a wrong one.</p>

<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration" target="_blank" rel="noopener">MDN — reading JavaScript errors and debugging</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Một thông điệp lỗi không phải một cuộc tấn công — đó là một manh mối</h2>
<p class="lead">Người mới thấy chữ đỏ là hoảng. Lập trình viên có kinh nghiệm thấy chữ đỏ là đọc nó, vì một thông điệp lỗi là máy tính đang giúp bạn: nói chính xác cái gì sai và thường là chính xác ở đâu. Gỡ lỗi không phải tài năng bí ẩn — đó là một vòng lặp có thể học được hôm nay.</p>

<h3>Bước 1 — đọc thật sự thông điệp và số dòng</h3>
<pre><code>TypeError: Cannot read properties of undefined (reading 'name')
    at getUserName (app.js:14:23)
    at main (app.js:22:5)</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Loại lỗi</span><span class="v">TypeError — bạn đã dùng một giá trị như sai loại thứ.</span></div>
  <div class="kv"><span class="k">Thông điệp</span><span class="v">"reading 'name'" — bạn truy cập .name trên một thứ là undefined.</span></div>
  <div class="kv"><span class="k">Vị trí</span><span class="v">app.js:14:23 — dòng 14, cột 23. Xem ở đó TRƯỚC, không phải xem ngẫu nhiên dòng khác.</span></div>
</div>
<p class="pitfall"><strong>Lỗi số một của người mới: không đọc lỗi chút nào.</strong> Cuộn qua chữ đỏ để đoán-rồi-thử các thay đổi ngẫu nhiên vứt bỏ thông tin máy tính đã đưa miễn phí. Đọc dòng đầu. Đọc số dòng. Riêng việc đó đã giải được phần lớn lỗi.</p>

<h3>Bước 2 — theo dấu stack trace</h3>
<p><strong>Stack trace</strong> là chuỗi lời gọi hàm dẫn tới lỗi, cuộc gọi gần nhất trước tiên. Nó trả lời "chương trình đến đây bằng cách nào?" — đọc từ trên xuống để lần đường từ chỗ vỡ ngược về chỗ bạn gọi nó.</p>

<h3>Bước 3 — soi bằng console.log</h3>
<p>Khi riêng thông điệp chưa đủ, hãy khiến chương trình phô ra việc nó làm. In các giá trị ngay trước dòng vỡ:</p>
<pre><code>function getUserName(user) {
  console.log("user is:", user);   // nó thật sự là gì, ngay tại đây?
  return user.name;
}</code></pre>
<p>Nếu <code>user</code> in ra <code>undefined</code>, lỗi hoàn toàn không nằm trong hàm này — nó nằm ở nơi <code>getUserName</code> được gọi mà không có user thật. Dời console.log ngược lên và lặp lại.</p>

<h3>Bước 4 — breakpoint và DevTools, khi console.log chưa đủ</h3>
<p>DevTools trình duyệt (Chương 5) cho bạn đặt một <strong>breakpoint</strong> — code dừng đúng chỗ đó, và bạn có thể soi mọi biến trong phạm vi, chạy từng dòng, xem call stack sống. Đó là console.log có siêu năng lực: không sửa mã nguồn, không chạy lại từ đầu.</p>
<pre><code>Tab Sources → bấm vào số dòng → chấm đỏ = breakpoint
Tải lại trang → thực thi dừng ở đó
Rê chuột vào biến bất kỳ → thấy giá trị sống của nó
Step over / step into → đi từng dòng code một</code></pre>

<h3>Vòng lặp: đặt giả thuyết, rồi kiểm tra</h3>
<p>Gỡ lỗi là phương pháp khoa học áp dụng cho code:</p>
<pre><code>1. Đặt giả thuyết   — "Tôi nghĩ 'user' bị undefined vì fetch thất bại"
2. Kiểm tra nó      — console.log(user) ngay trước chỗ vỡ
3. Xác nhận hay bác bỏ — nếu đúng, sửa chỗ đó; nếu sai, đặt giả thuyết mới
4. Lặp lại</code></pre>
<p class="note-ct"><strong>Sửa ngẫu nhiên không phải gỡ lỗi.</strong> Sửa code mà không có giả thuyết VÌ SAO nó sẽ khắc phục là đoán mò, và đoán mò hiếm khi hội tụ. Một giả thuyết có chủ đích, kiểm bằng một console.log hay breakpoint, thắng mười sửa ngẫu nhiên — và bạn học được thứ lâu dài từ mỗi giả thuyết, kể cả cái sai.</p>

<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration" target="_blank" rel="noopener">MDN — đọc lỗi JavaScript và gỡ lỗi</a></div>
</div>
`,
    },

    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — Git workflow for real work|||10.3 — Quy trình Git cho công việc thật',
      slug: 'wf-10-3-git-workflow',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/Uszj_k0DGsg', durationSeconds: 0 },
      description: 'Nhánh cho mỗi tính năng, commit nhỏ với thông điệp rõ ràng, push, mở Pull Request, review, merge; pull để đồng bộ; giải quyết một xung đột merge đơn giản.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Git basics get you saving; a workflow gets you collaborating</h2>
<p class="lead">Chapter 1 taught the raw Git commands: init, add, commit, push, clone. This lesson is how those commands get organised into a repeatable <strong>workflow</strong> — the pattern real teams use so many people can change the same codebase without stepping on each other.</p>

<h3>One branch per feature</h3>
<p>Never write new work directly on <code>main</code>. Create a <strong>branch</strong> — an isolated copy of the code — for each feature or fix. If it goes wrong, you delete the branch and <code>main</code> was never touched.</p>
<pre><code>git checkout main
git pull                          # start from the latest main
git checkout -b feature/login-form
// ... make changes ...
git status                        # see what changed</code></pre>

<h3>Commit small, with clear messages</h3>
<p>A <strong>commit</strong> is a saved checkpoint. Small, frequent commits with honest messages are easier to review, easier to undo, and easier for your future self to understand than one giant "fixed stuff" commit at the end of the day.</p>
<pre><code>git add src/components/LoginForm.tsx
git commit -m "Add LoginForm with email/password fields"

git add src/components/LoginForm.tsx
git commit -m "Add client-side validation for LoginForm"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Good message</span><span class="v">Says WHAT changed and often WHY — readable months later.</span></div>
  <div class="kv"><span class="k">Bad message</span><span class="v">"fix", "update", "asdf" — tells nobody anything.</span></div>
</div>

<h3>Push, open a Pull Request, review, merge</h3>
<pre><code>git push -u origin feature/login-form   # send the branch to GitHub

// On GitHub: click "Compare & pull request"
// A Pull Request (PR) proposes merging your branch into main
// A teammate reviews the diff, leaves comments, approves
// You click "Merge" — the feature branch's commits join main</code></pre>
<p>The <strong>Pull Request</strong> is the review checkpoint: a second pair of eyes catches bugs before they reach <code>main</code>, and the PR itself becomes a permanent record of what changed and why.</p>

<h3>Pull often, to stay in sync</h3>
<p>While you work on your branch, teammates merge their own work into <code>main</code>. Run <code>git pull</code> on <code>main</code> regularly (and merge <code>main</code> into your branch) so your branch never drifts too far from everyone else's — the longer you wait, the bigger the eventual conflict.</p>

<h3>Resolving a simple merge conflict</h3>
<p>A <strong>conflict</strong> happens when two branches changed the same lines and Git cannot guess which version you want. Git marks both versions in the file:</p>
<pre><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
const greeting = "Welcome back!";
=======
const greeting = "Hello again!";
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/login-form</code></pre>
<pre><code>// You edit the file by hand: pick one, pick the other, or write something new
const greeting = "Welcome back!";

git add src/components/LoginForm.tsx   // mark it resolved
git commit                              // completes the merge</code></pre>
<p class="pitfall"><strong>A conflict is not a crisis — it is Git asking a question it cannot answer alone.</strong> Read both sides, decide what the code should actually say, remove the markers (&lt;&lt;&lt;&lt;&lt;&lt;&lt;, =======, &gt;&gt;&gt;&gt;&gt;&gt;&gt;), then add and commit. Panicking and running destructive commands to "make it go away" is how real work gets lost.</p>

<p class="note-ct"><strong>This is the exact loop this project's own CLAUDE.md documents for every real feature.</strong> Branch, small commits, push, review, merge, stay synced with pull — the same rhythm scales from a solo course project to a team shipping to production.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Git cơ bản giúp bạn lưu; một quy trình giúp bạn cộng tác</h2>
<p class="lead">Chương 1 dạy các lệnh Git thô: init, add, commit, push, clone. Bài này là cách những lệnh đó được tổ chức thành một <strong>quy trình (workflow)</strong> lặp lại được — kiểu mẫu các team thật dùng để nhiều người sửa cùng một codebase mà không giẫm chân nhau.</p>

<h3>Một nhánh cho mỗi tính năng</h3>
<p>Không bao giờ viết việc mới trực tiếp trên <code>main</code>. Tạo một <strong>nhánh (branch)</strong> — một bản sao tách biệt của code — cho mỗi tính năng hay sửa lỗi. Nếu sai, bạn xoá nhánh và <code>main</code> chưa từng bị đụng vào.</p>
<pre><code>git checkout main
git pull                          # bắt đầu từ main mới nhất
git checkout -b feature/login-form
// ... sửa đổi ...
git status                        # xem cái gì đã đổi</code></pre>

<h3>Commit nhỏ, với thông điệp rõ ràng</h3>
<p>Một <strong>commit</strong> là một điểm lưu. Commit nhỏ, thường xuyên với thông điệp thật thà dễ review, dễ hoàn tác, và dễ cho chính bạn tương lai hiểu hơn một commit khổng lồ "sửa mấy thứ" cuối ngày.</p>
<pre><code>git add src/components/LoginForm.tsx
git commit -m "Add LoginForm with email/password fields"

git add src/components/LoginForm.tsx
git commit -m "Add client-side validation for LoginForm"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Thông điệp tốt</span><span class="v">Nói CÁI GÌ đã đổi và thường VÌ SAO — đọc được nhiều tháng sau.</span></div>
  <div class="kv"><span class="k">Thông điệp tệ</span><span class="v">"fix", "update", "asdf" — không nói gì cho ai cả.</span></div>
</div>

<h3>Push, mở Pull Request, review, merge</h3>
<pre><code>git push -u origin feature/login-form   # gửi nhánh lên GitHub

// Trên GitHub: bấm "Compare & pull request"
// Một Pull Request (PR) đề xuất gộp nhánh của bạn vào main
// Một đồng đội review diff, để lại bình luận, chấp thuận
// Bạn bấm "Merge" — các commit của nhánh tính năng gia nhập main</code></pre>
<p><strong>Pull Request</strong> là điểm chốt review: một cặp mắt thứ hai bắt lỗi trước khi chúng đến <code>main</code>, và bản thân PR trở thành hồ sơ vĩnh viễn về cái gì đã đổi và vì sao.</p>

<h3>Pull thường xuyên, để đồng bộ</h3>
<p>Trong lúc bạn làm trên nhánh, đồng đội gộp việc của họ vào <code>main</code>. Chạy <code>git pull</code> trên <code>main</code> thường xuyên (và gộp <code>main</code> vào nhánh của bạn) để nhánh không trôi quá xa mọi người khác — càng chờ lâu, xung đột cuối cùng càng lớn.</p>

<h3>Giải quyết một xung đột merge đơn giản</h3>
<p>Một <strong>xung đột (conflict)</strong> xảy ra khi hai nhánh đổi cùng dòng và Git không đoán được bạn muốn bản nào. Git đánh dấu cả hai bản trong file:</p>
<pre><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
const greeting = "Welcome back!";
=======
const greeting = "Hello again!";
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/login-form</code></pre>
<pre><code>// Bạn sửa file bằng tay: chọn cái này, chọn cái kia, hoặc viết cái mới
const greeting = "Welcome back!";

git add src/components/LoginForm.tsx   // đánh dấu đã giải quyết
git commit                              // hoàn tất việc merge</code></pre>
<p class="pitfall"><strong>Một xung đột không phải khủng hoảng — đó là Git hỏi một câu nó không tự trả lời được.</strong> Đọc cả hai bên, quyết định code nên nói gì thật sự, xoá các dấu đánh dấu (&lt;&lt;&lt;&lt;&lt;&lt;&lt;, =======, &gt;&gt;&gt;&gt;&gt;&gt;&gt;), rồi add và commit. Hoảng loạn chạy lệnh phá huỷ để "cho nó biến mất" là cách việc thật bị mất.</p>

<p class="note-ct"><strong>Đây đúng là vòng lặp mà CLAUDE.md của chính dự án này ghi lại cho mọi tính năng thật.</strong> Nhánh, commit nhỏ, push, review, merge, giữ đồng bộ bằng pull — cùng một nhịp điệu mở rộng từ một dự án khoá học một mình đến một team đưa lên production.</p>
</div>
`,
    },

    /* ─────────────────────────── 10.4 ─────────────────────────── */
    {
      title: '10.4 — How to keep learning|||10.4 — Cách tiếp tục học',
      slug: 'wf-10-4-keep-learning',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/3PHXvlpOkf4', durationSeconds: 0 },
      description: 'Học bằng cách DỰNG dự án (không phải "tutorial hell"), đọc tài liệu chính thức (MDN), đặt câu hỏi tốt (ví dụ tái hiện tối thiểu), gỡ lỗi kiểu "chú vịt cao su", đọc code người khác.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>The course ends; your learning does not</h2>
<p class="lead">No course can teach you everything you will ever need — the web changes, and every real project has quirks no tutorial covered. What this course CAN give you is the habits that let you keep learning on your own, forever. That is worth more than any single fact in the previous nine chapters.</p>

<h3>Build projects — avoid "tutorial hell"</h3>
<p><strong>Tutorial hell</strong> is the trap of endlessly watching or following tutorials, feeling productive, but never being able to build anything without one open beside you. The fix is uncomfortable but simple: after every tutorial, close it and build something small of your own — even a bad, ugly, half-broken version — using only what you remember.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Following a tutorial</span><span class="v">Tests whether you can copy. Necessary, but not sufficient.</span></div>
  <div class="kv"><span class="k">Building your own thing</span><span class="v">Tests whether you can decide. This is where real skill grows.</span></div>
</div>

<h3>Read the docs — MDN and official documentation</h3>
<p>Tutorials and videos go stale; official documentation is the source of truth and stays current. For the web platform, <strong>MDN</strong> (Mozilla Developer Network) is the standard reference for HTML, CSS and JavaScript. Every library and framework has its own official docs too — make reading them a default habit, not a last resort.</p>
<pre><code>Stuck on Array.prototype.reduce?  → search "reduce mdn"
Stuck on a React hook?             → check the framework's own docs first
Stuck on an npm package?           → its README is usually the fastest answer</code></pre>

<h3>Ask good questions — the minimal reproducible example</h3>
<p>"It doesn't work" gets ignored. A good question includes a <strong>minimal reproducible example</strong>: the smallest possible piece of code that shows the problem, plus what you expected, what actually happened, and the exact error message.</p>
<pre><code>Bad:  "my fetch is broken, help"

Good: "I expected fetch("/api/users") to return an array, but I get
       undefined. Here is the smallest code that reproduces it:

       fetch("/api/users").then(res => console.log(res.json()));

       Console shows: Promise { &lt;pending&gt; } — I think I'm missing
       an await, but not sure where."</code></pre>
<p>Writing the minimal example often reveals the bug to YOU before anyone even answers — this is such a well-known effect it has its own name below.</p>

<h3>Rubber-duck debugging</h3>
<p class="note-ct"><strong>Explain your code, line by line, out loud, to an inanimate object (traditionally a rubber duck).</strong> Sounds silly; works constantly. Forcing yourself to articulate what each line is SUPPOSED to do exposes the gap between what you think it does and what it actually does — most bugs surface the moment you have to say them out loud.</p>

<h3>Read other people's code</h3>
<p>Open-source projects on GitHub, your teammates' pull requests, even this course's own content files — reading real code (not just tutorial snippets) teaches idioms, patterns and mistakes to avoid that no isolated exercise can. Start small: pick one function in a project you use, and trace exactly what it does.</p>

<div class="link-card"><a href="https://developer.mozilla.org/en-US/" target="_blank" rel="noopener">MDN Web Docs</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Khoá học kết thúc; việc học của bạn thì không</h2>
<p class="lead">Không khoá học nào dạy hết mọi thứ bạn sẽ cần — web thay đổi, và mọi dự án thật có những chỗ kỳ quặc chưa tutorial nào phủ tới. Điều khoá này CÓ THỂ cho bạn là những thói quen giúp bạn tự học tiếp, mãi mãi. Điều đó đáng giá hơn bất kỳ sự kiện đơn lẻ nào ở chín chương trước.</p>

<h3>Dựng dự án — tránh "tutorial hell"</h3>
<p><strong>Tutorial hell</strong> là cái bẫy xem hoặc theo tutorial vô tận, cảm thấy năng suất, nhưng không bao giờ dựng được gì mà không có một cái mở sẵn bên cạnh. Cách sửa khó chịu nhưng đơn giản: sau mỗi tutorial, đóng nó lại và tự dựng một thứ nhỏ — dù xấu, thô, nửa vỡ — chỉ bằng thứ bạn nhớ.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Theo tutorial</span><span class="v">Kiểm tra bạn có sao chép được không. Cần thiết, nhưng chưa đủ.</span></div>
  <div class="kv"><span class="k">Tự dựng thứ của mình</span><span class="v">Kiểm tra bạn có tự quyết được không. Đây là chỗ kỹ năng thật lớn lên.</span></div>
</div>

<h3>Đọc tài liệu — MDN và tài liệu chính thức</h3>
<p>Tutorial và video cũ đi; tài liệu chính thức là nguồn sự thật và luôn cập nhật. Với nền tảng web, <strong>MDN</strong> (Mozilla Developer Network) là tham chiếu chuẩn cho HTML, CSS và JavaScript. Mọi thư viện và framework cũng có tài liệu chính thức riêng — biến việc đọc chúng thành thói quen mặc định, không phải cứu cánh cuối cùng.</p>
<pre><code>Kẹt với Array.prototype.reduce?   → tìm "reduce mdn"
Kẹt với một React hook?            → kiểm tài liệu chính của framework trước
Kẹt với một gói npm?               → README của nó thường là câu trả lời nhanh nhất</code></pre>

<h3>Đặt câu hỏi tốt — ví dụ tái hiện tối thiểu</h3>
<p>"Nó không chạy" bị lờ đi. Một câu hỏi tốt kèm một <strong>ví dụ tái hiện tối thiểu (minimal reproducible example)</strong>: mảnh code nhỏ nhất có thể cho thấy vấn đề, cộng với bạn mong đợi gì, thực tế xảy ra gì, và thông điệp lỗi chính xác.</p>
<pre><code>Tệ:  "fetch của tôi hỏng, giúp với"

Tốt: "Tôi mong fetch("/api/users") trả về một mảng, nhưng tôi nhận
     undefined. Đây là code nhỏ nhất tái hiện nó:

     fetch("/api/users").then(res => console.log(res.json()));

     Console hiện: Promise { &lt;pending&gt; } — tôi nghĩ mình thiếu
     await, nhưng không chắc ở đâu."</code></pre>
<p>Viết ví dụ tối thiểu thường lộ ra lỗi cho CHÍNH BẠN trước khi ai kịp trả lời — hiệu ứng này nổi tiếng đến mức có tên riêng ngay dưới đây.</p>

<h3>Gỡ lỗi kiểu "chú vịt cao su"</h3>
<p class="note-ct"><strong>Giải thích code của bạn, từng dòng, thành tiếng, cho một vật vô tri (truyền thống là một chú vịt cao su).</strong> Nghe ngớ ngẩn; nhưng hiệu quả liên tục. Ép bản thân nói ra từng dòng LẼ RA phải làm gì phơi bày khoảng cách giữa cái bạn nghĩ nó làm và cái nó thật sự làm — phần lớn lỗi lộ ra ngay lúc bạn phải nói chúng thành lời.</p>

<h3>Đọc code người khác</h3>
<p>Dự án mã nguồn mở trên GitHub, pull request của đồng đội, thậm chí file nội dung của chính khoá học này — đọc code thật (không chỉ đoạn tutorial) dạy bạn lối viết, khuôn mẫu và lỗi cần tránh mà không bài tập cô lập nào dạy được. Bắt đầu nhỏ: chọn một hàm trong một dự án bạn dùng, và lần chính xác nó làm gì.</p>

<div class="link-card"><a href="https://developer.mozilla.org/en-US/" target="_blank" rel="noopener">MDN Web Docs</a></div>
</div>
`,
    },

    /* ─────────────────────────── 10.5 ─────────────────────────── */
    {
      title: '10.5 — The full-stack picture, and what comes next|||10.5 — Bức tranh full-stack, và điều tiếp theo',
      slug: 'wf-10-5-full-stack-picture',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/nu_pCVPKzTk', durationSeconds: 0 },
      description: 'Tổng kết khoá: nối trình duyệt (HTML/CSS/JS) → yêu cầu HTTP → auth server → database, tất cả bằng TypeScript, thành một mô hình duy nhất — và bước tiếp theo: khoá Node.js và khoá Next.js/React.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5 · Course finale</span>
<h2>One mental model for the whole web</h2>
<p class="lead">Nine chapters ago, "how does a website work" was a black box. It no longer is. This lesson ties every chapter into one picture — and points you at exactly where to go next.</p>

<h3>The whole journey, end to end</h3>
<pre><code>1. Browser renders HTML + CSS               (Chapters 2-3)
   → structure and style the user sees

2. JavaScript makes the page interactive     (Chapters 3-5)
   → variables, functions, the DOM, events, components

3. The page sends an HTTP request            (Chapter 6)
   → method, path, headers, JSON body — to a server somewhere

4. The server checks who you are             (Chapter 7)
   → auth: cookies, sessions, tokens — HTTP is stateless, so this
     is how the server remembers you across requests

5. The server talks to a database            (Chapter 8)
   → your data lives beyond a single request, in tables/rows,
     queried and changed safely

6. All of it, written in TypeScript          (Chapter 9)
   → types catch mistakes before the code ever runs, across
     every layer above</code></pre>
<p>That is a complete, real web application — the same shape as huge production systems, just smaller. You already understand every layer.</p>

<h3>Debugging and Git hold the whole thing together</h3>
<p>Chapters 1-9 taught the layers. This chapter taught how you actually WORK across them: decompose a problem before coding it (10.1), read errors instead of fearing them (10.2), and use Git branches and Pull Requests so your changes are safe, reviewable, and reversible (10.3). Those three habits are what separate "I followed a tutorial once" from "I can build things."</p>

<h3>You are ready for the next step</h3>
<p>This course was the foundation — the vocabulary and mental model every web developer needs. From here, two natural paths continue it, going deep instead of wide:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">CuongThai — Node.js course</span><span class="v">Goes deep on the SERVER side: build real Express APIs, connect a real database with Prisma, handle real authentication — everything Chapters 6-8 introduced, at production depth.</span></div>
  <div class="kv"><span class="k">CuongThai — Next.js &amp; React course</span><span class="v">Goes deep on the CLIENT side: components, state, routing and a real framework used across the industry — everything Chapters 4-5 introduced, at production depth.</span></div>
</div>
<p>Both courses assume exactly what you now have: comfort with HTML/CSS/JS, HTTP, the request/response cycle, and enough TypeScript to read a typed codebase without flinching.</p>

<h3>One more habit for the road</h3>
<p>Whatever you build next, keep a map of the ecosystem in view — libraries and tools change year to year, but the layers in the picture above do not.</p>
<div class="link-card"><a href="https://roadmap.sh/" target="_blank" rel="noopener">roadmap.sh — visual developer roadmaps</a></div>

<p class="note-ct"><strong>Thank you for finishing Web Foundations.</strong> Nine chapters ago this was all unfamiliar; now it is a mental model you own. Go build something real — that is the only tutorial left that matters.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5 · Khép khoá</span>
<h2>Một mô hình tư duy cho cả web</h2>
<p class="lead">Chín chương trước, "một website hoạt động thế nào" là một hộp đen. Giờ thì không còn nữa. Bài này nối mọi chương thành một bức tranh — và chỉ đích xác bạn nên đi tiếp đâu.</p>

<h3>Cả hành trình, từ đầu đến cuối</h3>
<pre><code>1. Trình duyệt render HTML + CSS              (Chương 2-3)
   → cấu trúc và giao diện người dùng thấy

2. JavaScript khiến trang tương tác            (Chương 3-5)
   → biến, hàm, DOM, sự kiện, component

3. Trang gửi một yêu cầu HTTP                  (Chương 6)
   → method, path, headers, body JSON — tới một server ở đâu đó

4. Server kiểm tra bạn là ai                   (Chương 7)
   → auth: cookie, session, token — HTTP không lưu trạng thái, nên
     đây là cách server nhớ bạn qua các yêu cầu

5. Server nói chuyện với database               (Chương 8)
   → dữ liệu của bạn sống lâu hơn một yêu cầu đơn lẻ, trong
     bảng/dòng, được truy vấn và đổi một cách an toàn

6. Tất cả, viết bằng TypeScript                 (Chương 9)
   → type bắt lỗi trước khi code từng chạy, xuyên suốt mọi
     tầng ở trên</code></pre>
<p>Đó là một ứng dụng web hoàn chỉnh, thật — cùng hình dạng với các hệ thống production khổng lồ, chỉ nhỏ hơn. Bạn đã hiểu mọi tầng.</p>

<h3>Gỡ lỗi và Git giữ cả bức tranh dính với nhau</h3>
<p>Chương 1-9 dạy các tầng. Chương này dạy bạn thật sự LÀM VIỆC xuyên chúng thế nào: chia nhỏ vấn đề trước khi viết code (10.1), đọc lỗi thay vì sợ nó (10.2), và dùng nhánh Git cùng Pull Request để thay đổi của bạn an toàn, review được, hoàn tác được (10.3). Ba thói quen đó tách "tôi từng theo một tutorial" khỏi "tôi có thể tự dựng thứ".</p>

<h3>Bạn đã sẵn sàng cho bước tiếp theo</h3>
<p>Khoá này là nền tảng — vốn từ và mô hình tư duy mọi web developer cần. Từ đây, hai con đường tự nhiên tiếp nối nó, đào sâu thay vì mở rộng:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">CuongThai — Khoá Node.js</span><span class="v">Đào sâu phía SERVER: dựng API Express thật, nối một database thật với Prisma, xử lý xác thực thật — mọi thứ Chương 6-8 giới thiệu, ở độ sâu production.</span></div>
  <div class="kv"><span class="k">CuongThai — Khoá Next.js &amp; React</span><span class="v">Đào sâu phía CLIENT: component, state, routing và một framework thật dùng khắp ngành — mọi thứ Chương 4-5 giới thiệu, ở độ sâu production.</span></div>
</div>
<p>Cả hai khoá đều giả định đúng thứ bạn có ngay bây giờ: thoải mái với HTML/CSS/JS, HTTP, chu trình request/response, và đủ TypeScript để đọc một codebase có kiểu mà không chùn.</p>

<h3>Thêm một thói quen cho chặng đường</h3>
<p>Dù bạn dựng gì tiếp theo, hãy giữ trong tầm mắt một bản đồ của hệ sinh thái — thư viện và công cụ đổi theo từng năm, nhưng các tầng trong bức tranh trên thì không.</p>
<div class="link-card"><a href="https://roadmap.sh/" target="_blank" rel="noopener">roadmap.sh — bản đồ lộ trình lập trình viên</a></div>

<p class="note-ct"><strong>Cảm ơn bạn đã hoàn thành Web Foundations.</strong> Chín chương trước tất cả còn xa lạ; giờ đó là một mô hình tư duy bạn đã sở hữu. Đi dựng một thứ thật đi — đó là tutorial duy nhất còn lại thật sự quan trọng.</p>
</div>
`,
    },

    /* ─────────────────────────── 10.6 quiz ─────────────────────────── */
    {
      title: '10.6 — Chapter 10 quiz (capstone)|||10.6 — Kiểm tra chương 10 (khép khoá)',
      slug: 'wf-10-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về chia nhỏ vấn đề, đọc lỗi, quy trình Git (branch/PR/merge/xung đột), và thói quen tự học — khép lại toàn khoá Web Foundations.',
      content: `
<div class="ml-en"><p class="lead">Ten questions covering the whole capstone chapter: problem decomposition, reading errors and the debugging loop, the Git branch/PR/merge/conflict workflow, and habits for learning after the course ends.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> Reading about Git workflow is not the same as living it. On Code Lab, create branches, commit, open pull requests and resolve a real merge conflict on the Git track.</p>
<div class="link-card"><a href="/code-lab/git">Practice on Code Lab → Git track</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu bao trọn chương khép khoá: chia nhỏ vấn đề, đọc lỗi và vòng lặp gỡ lỗi, quy trình Git branch/PR/merge/xung đột, và thói quen tự học sau khi khoá kết thúc.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Đọc về quy trình Git không giống như sống với nó. Trên Code Lab, hãy tạo nhánh, commit, mở pull request và giải quyết một xung đột merge thật ở track Git.</p>
<div class="link-card"><a href="/code-lab/git">Luyện tập ở Code Lab → track Git</a></div></div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What should you do BEFORE writing real code to solve a new problem?|||Bạn nên làm gì TRƯỚC KHI viết code thật để giải một vấn đề mới?',
            options: [
              'Restate the problem and list the steps in plain language (pseudocode)|||Diễn đạt lại vấn đề và liệt kê các bước bằng ngôn ngữ thường (pseudocode)',
              'Write the most complex, general solution first|||Viết lời giải phức tạp, tổng quát nhất trước',
              'Handle every edge case before anything works|||Xử lý mọi trường hợp biên trước khi có gì chạy được',
              'Start typing code and see what happens|||Bắt đầu gõ code và xem chuyện gì xảy ra',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In decomposing a problem, what comes right after solving the simplest version?|||Khi chia nhỏ một vấn đề, cái gì đến ngay sau khi giải phiên bản đơn giản nhất?',
            options: [
              'Extend it: add edge cases and requirements one at a time, testing after each|||Mở rộng: thêm trường hợp biên và yêu cầu từng cái một, kiểm sau mỗi lần',
              'Delete the plan and start over|||Xoá kế hoạch và bắt đầu lại',
              'Immediately ship it to production|||Lập tức đưa lên production',
              'Rewrite it in a different language|||Viết lại bằng ngôn ngữ khác',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You see "TypeError: Cannot read properties of undefined (reading name) at app.js:14". What should you check FIRST?|||Bạn thấy "TypeError: Cannot read properties of undefined (reading name) at app.js:14". Bạn nên kiểm cái gì TRƯỚC TIÊN?',
            options: [
              'Line 14 of app.js — the exact location the error points to|||Dòng 14 của app.js — vị trí chính xác mà lỗi chỉ tới',
              'A random unrelated file|||Một file ngẫu nhiên không liên quan',
              'Delete the whole function and rewrite it blindly|||Xoá cả hàm và viết lại mù quáng',
              'Ignore it, the app will still work|||Bỏ qua nó, app vẫn sẽ chạy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does a stack trace tell you?|||Một stack trace cho bạn biết điều gì?',
            options: [
              'The chain of function calls that led to the error, most recent call first|||Chuỗi lời gọi hàm dẫn tới lỗi, cuộc gọi gần nhất trước tiên',
              'How many lines of code the project has|||Dự án có bao nhiêu dòng code',
              'The CSS classes applied to an element|||Các class CSS áp lên một phần tử',
              'The database schema|||Schema của database',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the debugging loop this lesson teaches?|||Vòng lặp gỡ lỗi bài này dạy là gì?',
            options: [
              'Form a hypothesis, test it (e.g. with console.log), confirm or reject, repeat|||Đặt giả thuyết, kiểm tra nó (vd bằng console.log), xác nhận hay bác bỏ, lặp lại',
              'Make random edits until something works|||Sửa ngẫu nhiên cho đến khi có gì đó chạy',
              'Rewrite the whole file from scratch every time|||Viết lại toàn bộ file từ đầu mỗi lần',
              'Wait for someone else to fix it|||Chờ người khác sửa giúp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why should new work go on a feature branch instead of directly on main?|||Vì sao việc mới nên nằm trên một nhánh tính năng thay vì trực tiếp trên main?',
            options: [
              'If it goes wrong you can discard the branch and main was never touched|||Nếu sai bạn có thể bỏ nhánh và main chưa từng bị đụng vào',
              'Branches make the code run faster|||Nhánh khiến code chạy nhanh hơn',
              'main cannot store any commits|||main không thể lưu commit nào',
              'It is required by JavaScript syntax|||Nó là bắt buộc theo cú pháp JavaScript',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the purpose of a Pull Request?|||Mục đích của một Pull Request là gì?',
            options: [
              'Propose merging a branch into main so a teammate can review before it lands|||Đề xuất gộp một nhánh vào main để đồng đội review trước khi nó vào',
              'Permanently delete the main branch|||Xoá vĩnh viễn nhánh main',
              'Download the project for the first time|||Tải dự án lần đầu',
              'Skip code review entirely|||Bỏ qua hoàn toàn việc review code',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A merge conflict appears in a file with <<<<<<< and >>>>>>> markers. What do you do?|||Một xung đột merge xuất hiện trong file với dấu <<<<<<< và >>>>>>>. Bạn làm gì?',
            options: [
              'Read both versions, decide what the code should say, remove the markers, then add and commit|||Đọc cả hai bản, quyết định code nên nói gì, xoá dấu đánh dấu, rồi add và commit',
              'Delete the entire file to make the conflict go away|||Xoá cả file để xung đột biến mất',
              'Run a destructive git command immediately without reading|||Chạy ngay một lệnh git phá huỷ mà không đọc',
              'Ignore it — Git resolves conflicts automatically|||Bỏ qua nó — Git tự giải quyết xung đột',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is "tutorial hell"?|||"Tutorial hell" là gì?',
            options: [
              'Endlessly following tutorials without ever building something on your own|||Theo tutorial vô tận mà không bao giờ tự dựng thứ gì một mình',
              'A type of runtime error in JavaScript|||Một loại lỗi runtime trong JavaScript',
              'A Git command for reverting commits|||Một lệnh Git để hoàn tác commit',
              'A required step before every deploy|||Một bước bắt buộc trước mỗi lần deploy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What makes a good question when asking for help with a bug?|||Điều gì khiến một câu hỏi tốt khi nhờ giúp đỡ với một lỗi?',
            options: [
              'A minimal reproducible example, plus expected vs actual behavior and the exact error|||Một ví dụ tái hiện tối thiểu, cộng hành vi mong đợi vs thực tế và lỗi chính xác',
              "Just saying \"it doesn't work\"|||Chỉ nói \"nó không chạy\"",
              'Pasting the entire project with no explanation|||Dán cả dự án mà không giải thích gì',
              'Waiting silently and hoping someone notices|||Im lặng chờ và hy vọng ai đó để ý',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
