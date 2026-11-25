/**
 * Bắt đầu tại đây (2/2) — Checkpoint và làm gì khi kẹt (soạn 24/11/2026, agent fsp).
 * Output THẬT: scripts/checkpoint-1.mjs của dự án mẫu ChiaSe (scratchpad/fsp/chiase, tag ch1) — chạy trước commit, khi lỡ add .env,
 * sau commit; repo tạm /tmp/fsp-ch0 cho phần tag ch0. Git 2.55.0.
 * Sự cố có nguồn (GET 200, 24/11/2026): TechCrunch 02/05/2023 — Samsung hạn chế công cụ AI tạo sinh sau vụ dữ liệu nội bộ lọt vào ChatGPT.
 */
import { nguon, lienKet } from '../_chung.mjs';

const THE = [
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-1-1-quy-trinh', title: 'Debug có phương pháp 1.1 — Tái hiện, khoanh vùng, giả thuyết, kiểm, sửa', sub: 'Phương pháp gỡ lỗi đầy đủ. Bài này chỉ dùng phiên bản rút gọn cho dự án.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-2-5-tra-cuu', title: 'Debug có phương pháp 2.5 — Tra cứu lỗi cho đúng: docs, issue, Stack Overflow, AI', sub: 'Cách làm sạch thông báo lỗi trước khi tìm và trước khi hỏi.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'git', bai: 'git-7-2-tag-semver', title: 'Git 7.2 — Tag & đánh phiên bản ngữ nghĩa', sub: 'Tag có chú thích (annotated) và vì sao dùng nó để đánh dấu checkpoint.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'ai-coding', bai: 'ai-5-1-nguyen-tac', title: 'AI Coding 5.1 — Nguyên tắc prompt cho việc viết code', sub: 'Viết câu hỏi cho AI có đủ ngữ cảnh mà không lộ bí mật.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📰', 'TechCrunch (02/05/2023) — Samsung bans use of generative AI tools like ChatGPT after April internal data leak', 'Một tháng sau khi dữ liệu nội bộ nhạy cảm lọt vào ChatGPT, Samsung tạm hạn chế công cụ AI tạo sinh trên thiết bị công ty.', 'https://techcrunch.com/2023/05/02/samsung-bans-use-of-generative-ai-tools-like-chatgpt-after-april-internal-data-leak/'),
].join('\n');

const OUT_TRUOC = `$ node scripts/checkpoint-1.mjs
== 1. Môi trường
  ✔ Node v22.22.2
  ✔ có package-lock.json (cài được bằng npm ci)
== 2. Kế hoạch đã viết ra
  ✔ README có bảng user story
  ✔ README có Definition of Done
  ✔ README có bảng API dự kiến
  ✔ có docs/erd.md với erDiagram
  ✔ có SQL nháp đã thử
== 3. Bí mật không vào git
  ✔ apps/api/.env.example được commit
  ✔ apps/web/.env.example được commit
  ✔ không có .env nào trong git
  ✔ .gitignore chặn .env
== 4. Chất lượng mã
  ✔ npm run lint
  ✔ npm run typecheck
  ✔ npm run format:check
== 5. Chạy được
  ✔ API trả: {"ten":"chiase-api","phienBan":"0.1.0"}
  ✔ Web trả HTTP 200
== 6. Đã commit
  ✘ chưa có commit nào

KẾT QUẢ: 16 đạt, 1 trượt`;

const OUT_ENV = `$ git add -f apps/api/.env      # cố tình làm sai
$ node scripts/checkpoint-1.mjs
…
== 3. Bí mật không vào git
  ✔ apps/api/.env.example được commit
  ✔ apps/web/.env.example được commit
  ✘ CÓ tệp .env trong git (apps/api/.env) — xoá khỏi index: git rm --cached &lt;tệp&gt;
  ✘ .gitignore chặn .env
…`;

const OUT_TAG = `$ git add -A &amp;&amp; git commit -m "docs: nhật ký dự án"
[main (root-commit) 64c4f56] docs: nhật ký dự án
 1 file changed, 12 insertions(+)
 create mode 100644 docs/nhat-ky.md
$ git tag -a ch0 -m "Checkpoint 0: máy sẵn sàng, repo đầu tiên"
$ echo "- 24/11: thử lệnh mới" &gt;&gt; docs/nhat-ky.md
$ git diff ch0 --stat
 docs/nhat-ky.md | 1 +
 1 file changed, 1 insertion(+)
$ git tag -n
ch0             Checkpoint 0: máy sẵn sàng, repo đầu tiên
$ git log --oneline --decorate
64c4f56 (HEAD -&gt; main, tag: ch0) docs: nhật ký dự án
$ git restore docs/nhat-ky.md &amp;&amp; git status --short
$`;

const NHAT_KY = `# Nhật ký dự án ChiaSe

## Mẫu một lần kẹt
- Ngày/giờ:
- Đang làm (chương, bước):
- Mong đợi:
- Thực tế (chép NGUYÊN VĂN lỗi):
- Đã thử (mỗi lần một thay đổi, kết quả):
- Thay đổi gì từ checkpoint gần nhất (git diff &lt;tag&gt; --stat):
- Nguyên nhân gốc:
- Cách sửa + vì sao đúng:
- Thời gian kẹt:`;

export default {
  title: 'Start here (2/2) — How to use the checkpoints, and what to do when you get stuck|||Bắt đầu tại đây (2/2) — Dùng checkpoint thế nào, và làm gì khi bị kẹt',
  slug: 'fp-0-9-bat-dau-khi-khong-co',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Checkpoint là gì và tự chấm bằng script thế nào (output thật 16/17 → 17/17), commit + tag sau mỗi checkpoint để có đường lùi, thang 6 bậc khi kẹt quá 30 phút, hỏi AI mà không lộ bí mật (Samsung 2023), và vì sao đừng mở lời giải trước.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>Learning alone works if you can tell, by yourself, whether you are done</h2>
<p class="lead">Nobody will sit next to you during this course. That is fine, as long as two things are true: you can <strong>prove</strong> each chapter works without asking anyone, and you have a <strong>plan</strong> for the moment you get stuck. This lesson gives you both — checkpoints you grade with one command, a Git habit that always gives you a way back, and a six-step ladder for getting unstuck.</p>

<h3>An everyday picture: kilometre markers on a highway</h3>
<p>Driving from Hà Nội to Hải Phòng, you do not wonder "am I making progress?" — the kilometre markers tell you. If you take a wrong exit, you drive back to the last marker you are sure about. A checkpoint is a kilometre marker for code: an observable fact ("<code>curl /api/health</code> returns 200", "17 checks pass") plus a Git tag you can drive back to.</p>

<h3>What a checkpoint is in this course</h3>
<ul>
<li>The last lesson of every chapter (1.4, 2.4, … 11.4) is a checkpoint.</li>
<li>Each checkpoint has a <strong>script</strong> in the repository, for example <code>scripts/checkpoint-1.mjs</code> (plain Node, so it runs the same on Windows, macOS and Linux), that runs the checks and prints ✔ / ✘ with a reason. You write it in that lesson; it keeps working in later chapters, so old features cannot silently break.</li>
<li>"Done" means <strong>0 failed</strong>. Not "it worked once on my screen".</li>
</ul>
<p>Here is the real output of Checkpoint 1 on our machine, run <em>before</em> the first commit:</p>
<div class="out">${OUT_TRUOC}</div>
<p>One check fails, for the right reason: nothing is committed yet. After <code>git commit</code> the same script ends with <code>KẾT QUẢ: 17 đạt, 0 trượt</code>. A good checkpoint also catches mistakes you did not plan for. We deliberately committed the secret file <code>.env</code>:</p>
<div class="out">${OUT_ENV}</div>

<h3>Commit and tag after every checkpoint — your way back</h3>
<p>When a checkpoint passes: commit, then put an <strong>annotated tag</strong> on that commit (<code>git tag -a ch1 -m "…"</code>). Two chapters later, when something breaks, <code>git diff ch1 --stat</code> shows exactly what changed since the last known-good state — usually the bug is in that list.</p>
<div class="out">${OUT_TAG}</div>
<p>The empty output of the last command means the working folder is back to exactly the checkpoint.</p>

<h3>The ladder: stuck for more than 30 minutes</h3>
<p>Spend at most about 30 minutes stuck at one rung, then climb to the next. Write each attempt in <code>docs/nhat-ky.md</code> as you go.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Read the whole error</span><span class="lz-d">Copy it verbatim. The answer is in the message more often than you think — "Port 41811 is already in use" means exactly that.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Reproduce it small</span><span class="lz-d">One curl, one test, one file. Change one thing at a time.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Diff against the checkpoint</span><span class="lz-d"><code>git diff ch3 --stat</code>. Undo half of the changes; does it still fail?</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Official docs, exact error</span><span class="lz-d">Search the exact message plus the tool version. Prefer docs and GitHub issues over random blogs.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Ask an AI — with context, without secrets</span><span class="lz-d">Versions, the smallest code, the exact error, what you tried. Never paste .env, tokens or real user data.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Ask a human</span><span class="lz-d">A friend, a mentor, a forum — same template. A well-written question is often answered by yourself while writing it.</span></div>
</div>
<p>Why not ask the AI first? Because rungs 1–3 build the skill an interviewer is testing: "how do you debug?". And because an AI answer you cannot check is a guess. Use AI to <em>explain</em> and <em>suggest</em>, then verify with your own checkpoint.</p>

<h3>⚠️ Real incident: a company's internal data pasted into a chatbot</h3>
<p>In April 2023, sensitive internal data from <strong>Samsung</strong> was accidentally leaked to ChatGPT by people using it at work. A month later (TechCrunch, 2 May 2023) Samsung temporarily restricted generative AI tools on company devices and on personal devices connected to its internal network. The lesson for you is not "never use AI" — it is <strong>know what you are pasting</strong>. Before sending code to any outside service (AI, Stack Overflow, a screenshot in a group chat):</p>
<ul>
<li>Remove <code>.env</code> contents, passwords, tokens, database URLs with passwords, private keys.</li>
<li>Replace real user data (emails, phone numbers) with fake ones.</li>
<li>In a company, read the AI policy first. Many outsourcing contracts forbid sending the client's code outside; breaking an NDA is a firing reason, not a small mistake.</li>
</ul>

<div class="pitfall co-tieu-de"><p><strong>Trap — "it worked once".</strong> A checkpoint that passed once on your screen, then you changed three files without re-running it, is not passed. Re-run before every commit; it takes seconds.</p></div>
<h3>About model solutions</h3>
<p>Each lab in this course has a solution hidden under a "Solution" toggle. Rule: <strong>try for at least 20 minutes and write your attempt down</strong> before opening it. If you open it, close it again and rewrite the solution from memory — copying teaches your eyes, rewriting teaches your hands.</p>

<h3>🧪 Practice (15 min) — your first checkpoint and your diary</h3>
<div class="callout ok">
<ol>
<li>Create the project folder and a Git repository: <code>mkdir -p chiase/docs &amp;&amp; cd chiase &amp;&amp; git init -b main</code>.</li>
<li>Create <code>docs/nhat-ky.md</code> with the template below.</li>
<li>Commit, then tag it: <code>git tag -a ch0 -m "Checkpoint 0: máy sẵn sàng, repo đầu tiên"</code>.</li>
<li>Add one line to the diary, run <code>git diff ch0 --stat</code>, then undo it with <code>git restore docs/nhat-ky.md</code>.</li>
</ol>
<pre><code class="language-markdown">${NHAT_KY}</code></pre>
<p><strong>Done when:</strong> <code>git tag -n</code> shows <code>ch0</code> with its message and <code>git status --short</code> prints nothing.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">checkpoint</span><span class="v">An observable proof that a chapter works, checked by a script.</span></div>
  <div class="kv"><span class="k">annotated tag</span><span class="v">A named, permanent marker on a commit with a message (<code>git tag -a</code>).</span></div>
  <div class="kv"><span class="k">known-good state</span><span class="v">The last commit you are sure works — your place to compare against.</span></div>
  <div class="kv"><span class="k">minimal reproduction</span><span class="v">The smallest input that still shows the bug.</span></div>
  <div class="kv"><span class="k">NDA</span><span class="v">Non-disclosure agreement: a contract forbidding you to share the client's code or data.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A checkpoint = a script that prints ✔/✘; "done" = 0 failed.</li>
<li>Commit + annotated tag after each checkpoint; <code>git diff chN --stat</code> shows what changed since the last good state.</li>
<li>Stuck: climb the ladder — error → small repro → diff → docs → AI (no secrets) → human; ~30 minutes per rung.</li>
<li>Samsung 2023: know what you paste into outside services.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Tự học được, nếu bạn tự biết mình đã xong hay chưa</h2>
<p class="lead">Suốt khoá này sẽ không có ai ngồi cạnh bạn. Không sao, miễn là có hai điều: bạn <strong>chứng minh</strong> được từng chương chạy đúng mà không cần hỏi ai, và bạn có <strong>kế hoạch</strong> cho lúc bị kẹt. Bài này cho bạn cả hai — checkpoint tự chấm bằng một lệnh, một thói quen Git luôn chừa đường lùi, và một "thang" sáu bậc để gỡ kẹt.</p>

<h3>Liên tưởng đời thường: cột cây số trên quốc lộ</h3>
<p>Đi từ Hà Nội về Hải Phòng, bạn không phải tự hỏi "mình có đang tiến không?" — cột cây số trả lời. Rẽ nhầm lối, bạn quay về cột cây số gần nhất mà mình chắc chắn. Checkpoint là cột cây số của mã: một sự thật nhìn thấy được ("<code>curl /api/health</code> trả 200", "17 mục đạt") cộng một tag Git để quay về.</p>

<h3>Checkpoint trong khoá này là gì</h3>
<ul>
<li>Bài cuối mỗi chương (1.4, 2.4, … 11.4) là một checkpoint.</li>
<li>Mỗi checkpoint có một <strong>script</strong> nằm trong repo, ví dụ <code>scripts/checkpoint-1.mjs</code> (Node thuần, nên chạy giống nhau trên Windows, macOS và Linux), chạy các phép kiểm và in ✔ / ✘ kèm lý do. Bạn tự viết nó ở bài checkpoint; nó vẫn chạy ở các chương sau, nên tính năng cũ không thể hỏng âm thầm.</li>
<li>"Xong" nghĩa là <strong>0 trượt</strong>. Không phải "lúc nãy chạy được một lần trên màn hình mình".</li>
</ul>
<p>Đây là output thật của Checkpoint 1 trên máy chúng tôi, chạy <em>trước</em> commit đầu tiên:</p>
<div class="out">${OUT_TRUOC}</div>
<p>Một mục trượt, và trượt đúng lý do: chưa commit gì. Sau <code>git commit</code>, cùng script đó kết thúc bằng <code>KẾT QUẢ: 17 đạt, 0 trượt</code>. Checkpoint tốt còn bắt được cả lỗi bạn không lường trước. Chúng tôi cố tình commit tệp bí mật <code>.env</code>:</p>
<div class="out">${OUT_ENV}</div>

<h3>Commit và tag sau mỗi checkpoint — đường lùi của bạn</h3>
<p>Khi checkpoint đạt: commit, rồi gắn một <strong>tag có chú thích</strong> (annotated tag) lên commit đó (<code>git tag -a ch1 -m "…"</code>). Hai chương sau, khi có gì hỏng, <code>git diff ch1 --stat</code> cho thấy chính xác những gì đã đổi từ lúc còn chạy tốt — thường lỗi nằm trong danh sách đó.</p>
<div class="out">${OUT_TAG}</div>
<p>Lệnh cuối không in gì nghĩa là thư mục làm việc đã về đúng checkpoint.</p>

<h3>Cái thang: kẹt quá 30 phút</h3>
<p>Mỗi bậc kẹt tối đa khoảng 30 phút, rồi leo lên bậc kế. Ghi từng lần thử vào <code>docs/nhat-ky.md</code> ngay lúc làm.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đọc hết thông báo lỗi</span><span class="lz-d">Chép nguyên văn. Đáp án nằm sẵn trong thông báo nhiều hơn bạn nghĩ — "Port 41811 is already in use" nghĩa đúng như vậy.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tái hiện nhỏ nhất</span><span class="lz-d">Một lệnh curl, một test, một tệp. Mỗi lần đổi một thứ.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">So với checkpoint</span><span class="lz-d"><code>git diff ch3 --stat</code>. Bỏ một nửa thay đổi; còn lỗi không?</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tài liệu chính thức, đúng thông báo lỗi</span><span class="lz-d">Tìm nguyên văn lỗi kèm phiên bản công cụ. Ưu tiên tài liệu và issue GitHub hơn blog ngẫu nhiên.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Hỏi AI — đủ ngữ cảnh, không bí mật</span><span class="lz-d">Phiên bản, đoạn mã nhỏ nhất, lỗi nguyên văn, những gì đã thử. Không bao giờ dán .env, token hay dữ liệu người dùng thật.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Hỏi người</span><span class="lz-d">Bạn bè, mentor, diễn đàn — cùng mẫu đó. Viết câu hỏi cho tử tế, nhiều khi bạn tự ra đáp án ngay lúc viết.</span></div>
</div>
<p>Sao không hỏi AI ngay từ đầu? Vì bậc 1–3 luyện đúng kỹ năng nhà tuyển dụng hỏi: "bạn gỡ lỗi thế nào?". Và vì câu trả lời của AI mà bạn không kiểm được thì chỉ là phỏng đoán. Dùng AI để <em>giải thích</em> và <em>gợi ý</em>, rồi kiểm bằng chính checkpoint của bạn.</p>

<h3>⚠️ Sự cố thật: dữ liệu nội bộ công ty bị dán vào chatbot</h3>
<p>Tháng 4/2023, dữ liệu nội bộ nhạy cảm của <strong>Samsung</strong> vô tình lọt vào ChatGPT do người dùng nó trong công việc. Một tháng sau (TechCrunch, 02/05/2023), Samsung tạm hạn chế các công cụ AI tạo sinh trên thiết bị công ty và cả thiết bị cá nhân nối vào mạng nội bộ. Bài học không phải "đừng bao giờ dùng AI" — mà là <strong>biết mình đang dán cái gì</strong>. Trước khi gửi mã ra bất kỳ dịch vụ bên ngoài nào (AI, Stack Overflow, ảnh chụp màn hình trong nhóm chat):</p>
<ul>
<li>Xoá nội dung <code>.env</code>, mật khẩu, token, chuỗi kết nối CSDL có mật khẩu, khoá riêng.</li>
<li>Thay dữ liệu người dùng thật (email, số điện thoại) bằng dữ liệu giả.</li>
<li>Ở công ty, đọc quy định dùng AI trước. Nhiều hợp đồng outsourcing cấm gửi mã của khách ra ngoài; vi phạm NDA là lý do cho nghỉ việc, không phải lỗi nhỏ.</li>
</ul>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — "lúc nãy chạy được mà".</strong> Checkpoint đạt một lần trên màn hình, rồi bạn sửa ba tệp mà không chạy lại, thì chưa phải là đạt. Chạy lại trước mỗi commit; chỉ mất vài giây.</p></div>
<h3>Về lời giải mẫu</h3>
<p>Mỗi lab trong khoá có lời giải giấu dưới nút "Lời giải". Luật: <strong>tự làm ít nhất 20 phút và ghi lại cách mình thử</strong> trước khi mở. Nếu đã mở, đóng lại và tự viết lại lời giải từ trí nhớ — chép thì mắt học, tự viết lại thì tay học.</p>

<h3>🧪 Thực hành (15 phút) — checkpoint đầu tiên và cuốn nhật ký</h3>
<div class="callout ok">
<ol>
<li>Tạo thư mục dự án và repo Git: <code>mkdir -p chiase/docs &amp;&amp; cd chiase &amp;&amp; git init -b main</code>.</li>
<li>Tạo <code>docs/nhat-ky.md</code> theo mẫu dưới.</li>
<li>Commit, rồi gắn tag: <code>git tag -a ch0 -m "Checkpoint 0: máy sẵn sàng, repo đầu tiên"</code>.</li>
<li>Thêm một dòng vào nhật ký, chạy <code>git diff ch0 --stat</code>, rồi hoàn tác bằng <code>git restore docs/nhat-ky.md</code>.</li>
</ol>
<pre><code class="language-markdown">${NHAT_KY}</code></pre>
<p><strong>Xong khi:</strong> <code>git tag -n</code> hiện <code>ch0</code> kèm chú thích và <code>git status --short</code> không in gì.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">checkpoint</span><span class="v">Bằng chứng nhìn thấy được rằng một chương chạy đúng, do script kiểm.</span></div>
  <div class="kv"><span class="k">annotated tag</span><span class="v">Mốc có tên, cố định, gắn lên một commit, kèm chú thích (<code>git tag -a</code>).</span></div>
  <div class="kv"><span class="k">known-good state</span><span class="v">Trạng thái chắc chắn chạy tốt gần nhất — chỗ để so sánh.</span></div>
  <div class="kv"><span class="k">minimal reproduction</span><span class="v">Bản tái hiện tối giản: đầu vào nhỏ nhất vẫn còn thấy lỗi.</span></div>
  <div class="kv"><span class="k">NDA</span><span class="v">Thoả thuận bảo mật: hợp đồng cấm chia sẻ mã hoặc dữ liệu của khách hàng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Checkpoint = một script in ✔/✘; "xong" = 0 trượt.</li>
<li>Commit + tag có chú thích sau mỗi checkpoint; <code>git diff chN --stat</code> cho thấy những gì đã đổi từ lúc còn chạy tốt.</li>
<li>Kẹt: leo thang — đọc lỗi → tái hiện nhỏ → so diff → tài liệu → AI (không bí mật) → hỏi người; mỗi bậc khoảng 30 phút.</li>
<li>Samsung 2023: biết mình đang dán gì vào dịch vụ bên ngoài.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
