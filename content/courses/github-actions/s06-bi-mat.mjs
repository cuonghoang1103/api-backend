const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 6: Bí mật, quyền, và cái token.
 * Số đo: 8 bí mật / 44 lượt tham chiếu của kho này, permissions: 1/11,
 * environment: 0/11, và chứng minh che-bí-mật chỉ phủ đúng chuỗi đã lưu.
 */

export default {
  title: 'Chapter 6 — Secrets, permissions, and the token|||Chương 6 — Bí mật, quyền, và cái token',
  slug: 'ga-ch6-bi-mat',
  description: '8 bí mật, 44 lượt tham chiếu, và 27 trong số đó nội suy thẳng vào `run:`. `permissions:` khai ở 1/11 workflow, `environment:` ở 0/11. Cộng chứng minh rằng che-bí-mật chỉ phủ ĐÚNG chuỗi đã lưu, không phủ bản đã biến đổi.',
  sortOrder: 7,
  lessons: [

    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — Masking covers the stored string, and nothing else|||6.1 — Che bí mật phủ ĐÚNG chuỗi đã lưu, không phủ gì khác',
      slug: 'ga-6-1-che-bi-mat',
      type: 'VIDEO',
      description: 'Kho này lưu khoá SSH dạng base64 rồi giải mã trong bước. GitHub che bản base64. Bản đã giải mã và bản base64 KHÔNG chung một chuỗi con 9 ký tự nào — nên nếu có bước nào in nó ra, log sẽ hiện khoá thật, không che.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Masking covers the stored string, and nothing else</h2>
<p class="lead">GitHub replaces secret values with <code>***</code> in logs, and that protection is real. It is also narrower than almost everyone assumes, in a way this repository&#39;s own configuration makes easy to demonstrate.</p>

<h3>What this repository stores</h3>
<p>Eight secrets, forty-four references across eleven workflows:</p>

<div class="out">secrets.VPS_HOST            18
secrets.VPS_USER             9
secrets.VPS_SSH_PRIVATE_KEY  9
secrets.RELEASE_TOKEN        4
secrets.LLM_MODEL_REPORT     1
secrets.LLM_BASE_URL         1
secrets.GITHUB_TOKEN         1
secrets.ANTHROPIC_API_KEY    1</div>

<p>The SSH key is stored <strong>base64-encoded</strong> and decoded inside the step — a common pattern, because a multi-line PEM key is awkward to paste into a secret field:</p>

<pre><code>env:
  VPS_SSH_PRIVATE_KEY_B64: \${{ secrets.VPS_SSH_PRIVATE_KEY }}
run: |
  echo "\$VPS_SSH_PRIVATE_KEY_B64" | base64 -d &gt; ~/.ssh/deploy_key</code></pre>

<h3>The demonstration</h3>
<p>GitHub masks the value it was given: the base64 string. What lands in the file is a different string entirely. How different?</p>

<div class="out">GitHub LUU (va che) chuoi nay:
  LS0tLS1CRUdJTiBPUEVOU1NIIFBSSVZBVEUgS0VZLS0tLS0KYjNCbGJuTnphQzFy...

Sau &#96;base64 -d&#96;, gia tri THAT trong tep la:
  -----BEGIN OPENSSH PRIVATE KEY-----
  b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gt
  ...

so chuoi con 9-ky-tu CHUNG giua hai ban: 0</div>

<div class="callout warn">
<p><strong>Zero shared substrings of nine characters.</strong> The masking engine works by scanning output for the exact strings it knows are secret. It has never seen the decoded key, so it cannot recognise it. A single debugging step — <code>cat ~/.ssh/deploy_key</code>, or an <code>ssh -vvv</code> that echoes the key on failure — would print an SSH private key into a log in plain text, on a run that shows no error and no warning about it.</p>
</div>

<div class="callout">
<p><strong>The general rule, which is worth memorising exactly:</strong> masking covers the stored value byte-for-byte. Every <em>transformation</em> of a secret produces a value outside the mask — base64-decoding, JSON-parsing, taking a substring, changing case, URL-encoding, or splitting a combined secret into parts. If your workflow derives a value from a secret, that derived value is unprotected.</p>
</div>

<h3>What masking does cover, and its limits</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">exact matches in log output</span><span class="lz-lnote">including inside a longer line. This is the main protection and it works</span></div>
<div class="lz-layer"><span class="lz-lname">the rendered script in the log group header</span><span class="lz-lnote">so a secret interpolated into <code>run:</code> shows as <code>***</code> rather than its value — which is why the 27 direct interpolations in this repository are not a log-leak problem</span></div>
<div class="lz-layer"><span class="lz-lname">common encodings, added in later runner versions</span><span class="lz-lnote">the runner registers some derived forms of a secret automatically. Do not rely on which ones: the set is not documented as a contract, and base64 of a multi-line value is not reliably among them</span></div>
<div class="lz-layer"><span class="lz-lname">NOT: anything you compute</span><span class="lz-lnote">a token you build by concatenating two secrets, a signature you derive, a decoded key. Register these yourself with <code>::add-mask::</code> if they must exist in a step that prints anything</span></div>
<div class="lz-layer"><span class="lz-lname">NOT: anything outside the log</span><span class="lz-lnote">a secret written to a file, uploaded in an artifact, or sent over the network is simply gone. Masking is a log feature, not a containment boundary</span></div>
</div>

<h3><code>::add-mask::</code>, for values you create</h3>
<pre><code>- name: Tinh ra mot gia tri phai duoc che
  run: |
    KHOA=\$(echo "\$B64" | base64 -d)
    echo "::add-mask::\$KHOA"      <span class="tok-comment"># dang ky voi runner TRUOC khi dung</span>
    <span class="tok-comment"># tu day tro di, moi lan KHOA xuat hien trong log deu thanh ***</span>
  env:
    B64: \${{ secrets.VPS_SSH_PRIVATE_KEY }}</code></pre>

<div class="pitfall">
<p><strong>Trap — <code>add-mask</code> only protects output printed <em>after</em> it runs.</strong> Registering a mask does not retroactively scrub earlier lines, and it does not survive into another job. So the order matters: compute, mask, then use. And a value masked in one job is unmasked in the next unless that job registers it again — which is a reason to derive secrets where they are used rather than passing derived values between jobs.</p>
</div>

<h3>The other thing masking does that surprises people</h3>
<div class="kv-grid">
<div class="kv"><span class="k">short or common secrets break logs</span><span class="v">a secret whose value is <code>true</code> or <code>8080</code> or <code>admin</code> will mask every occurrence of that string everywhere, turning ordinary output into <code>***</code>. If a log becomes unreadable, look for a secret with a short value</span></div>
<div class="kv"><span class="k">masking is not confidentiality</span><span class="v">anyone who can edit a workflow can print a secret in any form they like. Masking protects against <em>accidental</em> disclosure by a well-meaning script, not against a person with write access</span></div>
<div class="kv"><span class="k">so who can write workflows matters</span><span class="v">and that is a branch-protection and review question, not an Actions setting. The strongest control available is that a fork PR gets no secrets at all — measured in 1.4</span></div>
<div class="kv"><span class="k">rotating is the real answer</span><span class="v">if a secret may have been printed, it has been. Rotate it. There is no way to un-publish a log line, and log retention is generous</span></div>
</div>

<h3>What this repository gets right, and where the line actually is</h3>
<p>Of the forty-four secret references, twenty-seven are interpolated directly into <code>run:</code> blocks — which lesson 3.1 warned about. But look at <em>which</em> ones:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">the private key</span><span class="lz-t">through <code>env:</code></span><span class="lz-d">the most sensitive value takes the safe path. Read as <code>\$VPS_SSH_PRIVATE_KEY_B64</code>, never substituted into script text</span></div>
<div class="lz-step"><span class="lz-k">host and user</span><span class="lz-t">straight into <code>run:</code></span><span class="lz-d">interpolated into <code>ssh-keyscan</code> and <code>printf</code>. Masked in the log, and safe — because the repository owner chose those values</span></div>
<div class="lz-step"><span class="lz-k">so the rule is</span><span class="lz-t">about control, not secrecy</span><span class="lz-d">3.1&#39;s rule is "never interpolate a value <em>someone else</em> controls". A secret you set is not attacker-controlled, so this is a style preference rather than a vulnerability</span></div>
</div>

<div class="callout ok">
<p><strong>Stating that precisely matters, because the sloppy version of the rule teaches the wrong reflex.</strong> "Never put a secret in <code>run:</code>" leads people to route harmless configuration through <code>env:</code> while happily interpolating a PR title. The actual danger is untrusted <em>input</em>, and a secret is the one category of value that is definitionally trusted — it is the one you put there.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> Masking is an exact-string search over log output, so it protects the secret you stored and nothing derived from it — which makes <code>base64 -d</code>, the most common way to store a key, also the most common way to have an unmasked one in your job.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using secrets in GitHub Actions</span><span class="lc-sub">docs.github.com/en/actions/security-guides/using-secrets-in-github-actions — the masking behaviour, the explicit warning that structured or transformed secrets may not be redacted, and the limits on secret size and count.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: add-mask</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#masking-a-value-in-a-log — the command for registering a computed value, and the note that it applies only to subsequent output.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening: good practices for secrets</span><span class="lc-sub">docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-secrets — including the recommendation to register masks for generated values and to audit what your workflows print.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — a leaked credential is leaked, and rotation is the only answer</span><span class="lc-sub">/courses/authentication/learn${REF} — blast radius, rotation procedure, and why "we deleted the log" is not a remediation.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — where production secrets actually live</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the runtime env file on the server, why it survives deploys, and the separation between build-time and run-time secrets.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Che bí mật phủ ĐÚNG chuỗi đã lưu, không phủ gì khác</h2>
<p class="lead">GitHub thay giá trị bí mật bằng <code>***</code> trong log, và sự bảo vệ ấy là thật. Nó cũng HẸP hơn gần như mọi người vẫn tưởng, theo một cách mà chính cấu hình của kho này khiến việc chứng minh trở nên dễ dàng.</p>

<h3>Kho này lưu những gì</h3>
<p>Tám bí mật, bốn mươi bốn lượt tham chiếu trên mười một workflow:</p>

<div class="out">secrets.VPS_HOST            18
secrets.VPS_USER             9
secrets.VPS_SSH_PRIVATE_KEY  9
secrets.RELEASE_TOKEN        4
secrets.LLM_MODEL_REPORT     1
secrets.LLM_BASE_URL         1
secrets.GITHUB_TOKEN         1
secrets.ANTHROPIC_API_KEY    1</div>

<p>Cái khoá SSH được lưu dạng <strong>base64</strong> rồi giải mã ngay trong bước — một khuôn mẫu phổ biến, bởi một khoá PEM nhiều dòng thì dán vào ô bí mật rất vướng:</p>

<pre><code>env:
  VPS_SSH_PRIVATE_KEY_B64: \${{ secrets.VPS_SSH_PRIVATE_KEY }}
run: |
  echo "\$VPS_SSH_PRIVATE_KEY_B64" | base64 -d &gt; ~/.ssh/deploy_key</code></pre>

<h3>Phần chứng minh</h3>
<p>GitHub che cái giá trị nó ĐƯỢC ĐƯA: chuỗi base64. Thứ rơi vào tệp là một chuỗi hoàn toàn khác. Khác tới đâu?</p>

<div class="out">GitHub LUU (va che) chuoi nay:
  LS0tLS1CRUdJTiBPUEVOU1NIIFBSSVZBVEUgS0VZLS0tLS0KYjNCbGJuTnphQzFy...

Sau &#96;base64 -d&#96;, gia tri THAT trong tep la:
  -----BEGIN OPENSSH PRIVATE KEY-----
  b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gt
  ...

so chuoi con 9-ky-tu CHUNG giua hai ban: 0</div>

<div class="callout warn">
<p><strong>Không một chuỗi con chín ký tự nào chung.</strong> Bộ máy che hoạt động bằng cách quét đầu ra tìm ĐÚNG những chuỗi nó biết là bí mật. Nó chưa bao giờ thấy cái khoá đã giải mã, nên nó không nhận ra được. Chỉ cần một bước gỡ lỗi — <code>cat ~/.ssh/deploy_key</code>, hay một lệnh <code>ssh -vvv</code> in khoá ra khi hỏng — là một khoá riêng SSH sẽ nằm chình ình trong log dưới dạng chữ thường, trong một lần chạy không có lỗi nào và không có cảnh báo nào về chuyện đó.</p>
</div>

<div class="callout">
<p><strong>Quy tắc tổng quát, đáng thuộc cho chính xác:</strong> việc che phủ giá trị ĐÃ LƯU, từng byte một. Mọi phép <em>BIẾN ĐỔI</em> một bí mật đều đẻ ra một giá trị NGOÀI vùng che — giải mã base64, phân tích JSON, cắt chuỗi con, đổi chữ hoa thường, mã hoá URL, hay tách một bí mật gộp ra thành các phần. Nếu workflow của bạn SUY RA một giá trị từ một bí mật, thì giá trị suy ra ấy KHÔNG được bảo vệ.</p>
</div>

<h3>Việc che phủ được gì, và giới hạn của nó</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">các chỗ khớp CHÍNH XÁC trong đầu ra log</span><span class="lz-lnote">kể cả nằm bên trong một dòng dài hơn. Đây là phần bảo vệ chính và nó hoạt động</span></div>
<div class="lz-layer"><span class="lz-lname">script đã nở trong tiêu đề nhóm của log</span><span class="lz-lnote">nên một bí mật nội suy vào <code>run:</code> hiện ra là <code>***</code> chứ không phải giá trị của nó — và đó là lý do 27 lượt nội suy trực tiếp ở kho này không phải một vấn đề rò log</span></div>
<div class="lz-layer"><span class="lz-lname">một số dạng mã hoá phổ biến, thêm ở các bản runner sau</span><span class="lz-lnote">runner tự đăng ký một vài dạng suy ra của một bí mật. Đừng dựa vào việc đó là những dạng nào: tập ấy không được ghi thành một cam kết, và base64 của một giá trị nhiều dòng thì không chắc nằm trong đó</span></div>
<div class="lz-layer"><span class="lz-lname">KHÔNG: bất cứ thứ gì bạn TÍNH RA</span><span class="lz-lnote">một token bạn dựng bằng cách ghép hai bí mật, một chữ ký bạn suy ra, một khoá đã giải mã. Hãy tự đăng ký chúng bằng <code>::add-mask::</code> nếu chúng buộc phải tồn tại trong một bước có in ra thứ gì</span></div>
<div class="lz-layer"><span class="lz-lname">KHÔNG: bất cứ thứ gì NGOÀI log</span><span class="lz-lnote">một bí mật ghi vào tệp, tải lên trong một artifact, hay gửi qua mạng thì đơn giản là đi mất. Che là một tính năng của LOG, không phải một ranh giới ngăn chặn</span></div>
</div>

<h3><code>::add-mask::</code>, cho những giá trị bạn tự tạo</h3>
<pre><code>- name: Tinh ra mot gia tri phai duoc che
  run: |
    KHOA=\$(echo "\$B64" | base64 -d)
    echo "::add-mask::\$KHOA"      <span class="tok-comment"># dang ky voi runner TRUOC khi dung</span>
    <span class="tok-comment"># tu day tro di, moi lan KHOA xuat hien trong log deu thanh ***</span>
  env:
    B64: \${{ secrets.VPS_SSH_PRIVATE_KEY }}</code></pre>

<div class="pitfall">
<p><strong>Bẫy — <code>add-mask</code> chỉ bảo vệ phần đầu ra in ra <em>SAU</em> khi nó chạy.</strong> Đăng ký một cái che KHÔNG quét ngược lại những dòng trước đó, và nó không sống sót sang một job khác. Nên THỨ TỰ có ý nghĩa: tính, che, rồi mới dùng. Và một giá trị được che ở job này thì ở job kế nó KHÔNG được che trừ khi job ấy đăng ký lại — đó là một lý do nên SUY RA bí mật ngay tại chỗ dùng thay vì truyền các giá trị đã suy ra giữa các job.</p>
</div>

<h3>Thứ khác mà việc che làm và khiến người ta bất ngờ</h3>
<div class="kv-grid">
<div class="kv"><span class="k">bí mật NGẮN hay THÔNG DỤNG làm vỡ log</span><span class="v">một bí mật có giá trị là <code>true</code> hay <code>8080</code> hay <code>admin</code> sẽ che MỌI chỗ xuất hiện của chuỗi ấy ở khắp nơi, biến đầu ra bình thường thành <code>***</code>. Nếu một cái log trở nên không đọc nổi, hãy đi tìm một bí mật có giá trị ngắn</span></div>
<div class="kv"><span class="k">che KHÔNG phải là bảo mật</span><span class="v">ai sửa được workflow thì người ấy in bí mật ra dưới dạng nào tuỳ thích. Che bảo vệ trước sự lộ ra <em>DO TAI NẠN</em> bởi một script có thiện chí, không bảo vệ trước một người có quyền ghi</span></div>
<div class="kv"><span class="k">nên AI viết được workflow mới là chuyện đáng bàn</span><span class="v">và đó là câu hỏi về branch protection và review, không phải một thiết lập của Actions. Biện pháp mạnh nhất sẵn có là một PR từ fork KHÔNG nhận được bí mật nào — đo ở bài 1.4</span></div>
<div class="kv"><span class="k">XOAY khoá mới là câu trả lời thật</span><span class="v">nếu một bí mật CÓ THỂ đã bị in ra, thì coi như nó ĐÃ bị. Hãy xoay nó. Không có cách nào rút một dòng log về, và thời hạn giữ log thì rộng rãi</span></div>
</div>

<h3>Kho này làm đúng chỗ nào, và cái vạch thật ra nằm ở đâu</h3>
<p>Trong bốn mươi bốn lượt tham chiếu bí mật, hai mươi bảy lượt nội suy thẳng vào khối <code>run:</code> — đúng thứ bài 3.1 cảnh báo. Nhưng hãy nhìn xem đó là <em>NHỮNG CÁI NÀO</em>:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">khoá riêng tư</span><span class="lz-t">đi qua <code>env:</code></span><span class="lz-d">giá trị nhạy cảm nhất đi đường AN TOÀN. Đọc bằng <code>\$VPS_SSH_PRIVATE_KEY_B64</code>, không bao giờ bị thay vào chữ của script</span></div>
<div class="lz-step"><span class="lz-k">host và user</span><span class="lz-t">thẳng vào <code>run:</code></span><span class="lz-d">nội suy vào <code>ssh-keyscan</code> và <code>printf</code>. Được che trong log, và AN TOÀN — bởi chính chủ kho chọn những giá trị ấy</span></div>
<div class="lz-step"><span class="lz-k">nên quy tắc là</span><span class="lz-t">về QUYỀN KIỂM SOÁT, không phải về sự bí mật</span><span class="lz-d">luật của bài 3.1 là "đừng bao giờ nội suy một giá trị do <em>NGƯỜI KHÁC</em> kiểm soát". Một bí mật do bạn đặt thì không nằm trong tay kẻ tấn công, nên đây là chuyện sở thích phong cách chứ không phải một lỗ hổng</span></div>
</div>

<div class="callout ok">
<p><strong>Phát biểu chuyện đó cho chính xác là quan trọng, bởi bản luộm thuộm của quy tắc dạy ra một phản xạ SAI.</strong> Câu "đừng bao giờ đặt bí mật vào <code>run:</code>" khiến người ta vòng những cấu hình vô hại qua <code>env:</code> trong khi vẫn vui vẻ nội suy một tiêu đề PR. Mối nguy THẬT là ĐẦU VÀO không tin cậy được, và một bí mật lại đúng là loại giá trị được tin cậy theo định nghĩa — nó là thứ chính bạn đặt vào đó.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Che là một phép tìm chuỗi CHÍNH XÁC trên đầu ra log, nên nó bảo vệ cái bí mật bạn đã lưu và không bảo vệ thứ gì suy ra từ nó — điều đó khiến <code>base64 -d</code>, cách phổ biến nhất để lưu một cái khoá, cũng là cách phổ biến nhất để có một cái khoá KHÔNG được che nằm trong job của bạn.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using secrets in GitHub Actions</span><span class="lc-sub">docs.github.com/en/actions/security-guides/using-secrets-in-github-actions — hành vi che, lời cảnh báo tường minh rằng bí mật có cấu trúc hoặc đã biến đổi có thể KHÔNG bị lược bỏ, và các giới hạn về kích thước lẫn số lượng bí mật.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: add-mask</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#masking-a-value-in-a-log — lệnh đăng ký một giá trị tính ra, và ghi chú rằng nó chỉ áp cho phần đầu ra SAU đó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening: good practices for secrets</span><span class="lc-sub">docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-secrets — gồm cả khuyến nghị đăng ký che cho các giá trị sinh ra và soát lại xem workflow của bạn in ra những gì.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — một thông tin đăng nhập đã rò là đã rò, và XOAY là câu trả lời duy nhất</span><span class="lc-sub">/courses/authentication/learn${REF} — bán kính thiệt hại, quy trình xoay khoá, và vì sao "chúng tôi đã xoá cái log" không phải một biện pháp khắc phục.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — bí mật production thật ra sống ở đâu</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — tệp env lúc chạy trên máy chủ, vì sao nó sống sót qua các lần deploy, và chỗ tách bạch giữa bí mật lúc-dựng với bí mật lúc-chạy.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — GITHUB_TOKEN, and the boundary it cannot cross|||6.2 — GITHUB_TOKEN, và cái ranh giới nó không vượt được',
      slug: 'ga-6-2-token',
      type: 'VIDEO',
      description: '`permissions:` khai ở 1/11 workflow của kho này, và tệp ấy giải thích lý do ngay trong bình luận. Cộng một ca thật: bản phát hành desktop phải dùng PAT, vì `GITHUB_TOKEN` bị khoá trong ĐÚNG cái kho đang chạy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2><code>GITHUB_TOKEN</code>, and the boundary it cannot cross</h2>
<p class="lead">Every job gets a token it did not ask for. It is created when the job starts, expires when the job ends, and it is scoped to exactly one repository — the one running the workflow. That last property is the one that shapes real workflows.</p>

<h3>What it can do by default</h3>
<p>The default permission set is a repository setting, not a workflow one, and it has two possible values: <em>permissive</em> (write access to most scopes) or <em>restricted</em> (read to <code>contents</code> and <code>packages</code>, nothing else). Newer repositories default to restricted; older ones may still be permissive, and there is no way to tell from the workflow file.</p>

<div class="callout warn">
<p><strong>That ambiguity is itself the argument for declaring <code>permissions:</code> explicitly.</strong> A workflow that does not declare permissions has a token whose power depends on a setting somebody chose years ago and nobody remembers. Declaring the block makes the workflow&#39;s needs a property of the workflow, readable in the diff, and — because declaring any scope resets all the others to <code>none</code> — automatically minimal.</p>
</div>

<h3>What this repository declares</h3>
<div class="out">permissions: khai tuong minh:  1 / 11 workflow</div>

<p>The one is <code>deploy-ghcr.yml</code>, and it explains itself in a comment above the block:</p>

<pre><code><span class="tok-comment"># GHCR push requires &#96;packages: write&#96;. Default GITHUB_TOKEN has</span>
<span class="tok-comment"># read-only package scope; we explicitly request the higher scope</span>
<span class="tok-comment"># for the duration of this workflow.</span>
permissions:
  contents: read
  actions: write
  packages: write</code></pre>

<div class="callout ok">
<p><strong>Three scopes, each earning its place.</strong> <code>contents: read</code> to check out; <code>packages: write</code> to push images to GHCR; <code>actions: write</code> for the workflow&#39;s own management calls. Everything else — issues, pull requests, deployments, security events — is implicitly <code>none</code>, because naming any scope zeroes the rest. That is the whole mechanism, and it makes the minimal-permissions version of a workflow the <em>easy</em> version to write.</p>
</div>

<h3>The boundary: one repository</h3>
<p>The desktop release workflow publishes installers to a <strong>different repository</strong> — the release repo has to be public, because <code>electron-updater</code> downloads updates without a token. And that requirement collides with the token&#39;s scope:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k"><code>GITHUB_TOKEN</code></span><span class="lz-t">this repository only</span><span class="lz-d">it is minted for the running repository and is not valid anywhere else, at any permission level</span></div>
<div class="lz-step"><span class="lz-k">the requirement</span><span class="lz-t">write to another repository</span><span class="lz-d">create a release and upload assets in <code>cuonghoang1103/cuongthai-desktop</code></span></div>
<div class="lz-step"><span class="lz-k">so the workflow uses</span><span class="lz-t"><code>secrets.RELEASE_TOKEN</code></span><span class="lz-d">a personal access token, with the comment in the file saying exactly why the default token will not do</span></div>
</div>

<div class="callout">
<p><strong>This is the legitimate reason to use a PAT, and it is close to the only one.</strong> If a workflow needs a PAT for anything <em>inside</em> its own repository, that is almost always a <code>permissions:</code> block that was not written. Cross-repository access is different — no permission setting extends <code>GITHUB_TOKEN</code> past its repository, so a separate credential is the mechanism, not a workaround.</p>
</div>

<h3>What a PAT costs, stated plainly</h3>
<div class="kv-grid">
<div class="kv"><span class="k">it does not expire with the job</span><span class="v">unlike <code>GITHUB_TOKEN</code>, which is dead the moment the job ends. A leaked PAT is valid until somebody revokes it</span></div>
<div class="kv"><span class="k">it carries a person&#39;s access</span><span class="v">a classic PAT is scoped to <em>scopes</em>, not to repositories — <code>repo</code> means every repository that person can reach. A fine-grained PAT fixes this and is worth the extra setup</span></div>
<div class="kv"><span class="k">it needs rotating</span><span class="v">and nothing reminds you. A PAT with no expiry is a credential nobody will think about again until it is in an incident report</span></div>
<div class="kv"><span class="k">the better option where available</span><span class="v">a GitHub App installation token: scoped per repository, short-lived, and revocable without affecting a human&#39;s access. More setup, and the right answer for anything long-lived</span></div>
</div>

<h3>Reducing the default token, in practice</h3>
<pre><code><span class="tok-comment"># o dau workflow: mac dinh cho MOI job</span>
permissions:
  contents: read

jobs:
  cong-bo:
    <span class="tok-comment"># nang o dung job can, va chi job do</span>
    permissions:
      contents: write        <span class="tok-comment"># tao release</span>
      packages: write
    steps: ...</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">declare at workflow level, raise per job</span><span class="lz-lnote">the job-level block <em>replaces</em> the workflow-level one rather than adding to it — so a job that raises one scope must re-list the ones it still needs</span></div>
<div class="lz-layer"><span class="lz-lname"><code>permissions: {}</code> is legal</span><span class="lz-lnote">no permissions at all. Correct for a lint job on a public repository: it does not need to read anything but its own checkout, which the token still allows because the repository is public</span></div>
<div class="lz-layer"><span class="lz-lname">a fork PR is already restricted</span><span class="lz-lnote">read-only regardless of what you declare — measured in 1.4. So the <code>permissions:</code> block protects against <em>your own</em> workflows and actions, not against fork contributors</span></div>
<div class="lz-layer"><span class="lz-lname">and it protects against actions</span><span class="lz-lnote">which is the point Chapter 4 measured: 11.3% of step time is third-party code running with this token in its environment. Narrowing the token narrows what a compromised action can reach</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — adding <code>permissions:</code> and breaking a step nobody remembered needed it.</strong> Declaring any scope zeroes the rest, so a workflow that quietly relied on <code>issues: write</code> to post a comment stops posting, silently, with a 403 buried in an action&#39;s output. The safe order is: add the block with the scopes you know about, run it once, and read the log for permission errors — rather than adding it and assuming green means complete. This is the one change where "it still passes" is weak evidence.</p>
</div>

<h3>Environments, which this repository does not use</h3>
<div class="out">environment: khai o  0 / 11 workflow</div>

<p>An <code>environment:</code> attaches a named set of secrets and, optionally, a <strong>required reviewer</strong> — a job that will not start until a human approves it in the UI. For a repository whose deploy workflows are all <code>workflow_dispatch</code>, the human gate already exists in the form of somebody pressing the button, which is presumably why none were added.</p>

<div class="callout ok">
<p><strong>That reasoning holds only while the trigger stays manual.</strong> The moment any deploy workflow gains a <code>push:</code> or <code>schedule:</code> trigger — which Chapter 9 argues is a tempting change — the approval step disappears and nothing replaces it. An <code>environment:</code> with a reviewer is the mechanism that survives that change, and adding one costs a line.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> <code>GITHUB_TOKEN</code> is short-lived, automatic, and locked to one repository — so <code>permissions:</code> is how you shrink it, an <code>environment:</code> is how you gate it, and a PAT is what you reach for only when you genuinely need to cross the repository boundary.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Automatic token authentication</span><span class="lc-sub">docs.github.com/en/actions/security-guides/automatic-token-authentication — the token&#39;s lifetime, the full scope table with both default sets, and the statement that it is limited to the repository containing the workflow.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: permissions</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions — every available scope, and the rule that naming any scope sets the unnamed ones to <code>none</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using environments for deployment</span><span class="lc-sub">docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment — required reviewers, wait timers, and environment-scoped secrets, which is the gate the section above argues for.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Fine-grained personal access tokens</span><span class="lc-sub">docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens — per-repository scoping and mandatory expiry, which is what makes the cross-repository case above safe rather than merely possible.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — scopes, least privilege, and token lifetime</span><span class="lc-sub">/courses/authentication/learn${REF} — why a short-lived narrow token is a different kind of object from a long-lived broad one, and how to reason about the difference.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2><code>GITHUB_TOKEN</code>, và cái ranh giới nó không vượt được</h2>
<p class="lead">Mỗi job được cấp một cái token mà nó không hề xin. Nó được tạo lúc job bắt đầu, hết hạn lúc job kết thúc, và nó bị khoanh vào ĐÚNG MỘT kho — cái kho đang chạy workflow. Chính tính chất cuối cùng ấy mới định hình các workflow thật.</p>

<h3>Mặc định nó làm được gì</h3>
<p>Tập quyền mặc định là một THIẾT LẬP CỦA KHO, không phải của workflow, và nó có hai giá trị khả dĩ: <em>rộng rãi</em> (quyền ghi ở phần lớn phạm vi) hoặc <em>hạn chế</em> (đọc <code>contents</code> và <code>packages</code>, ngoài ra không gì). Các kho mới hơn mặc định là hạn chế; kho cũ có thể vẫn rộng rãi, và không có cách nào biết được từ tệp workflow.</p>

<div class="callout warn">
<p><strong>Chính sự mơ hồ ấy là lập luận để khai <code>permissions:</code> một cách tường minh.</strong> Một workflow không khai quyền thì có một cái token mà sức mạnh của nó phụ thuộc vào một thiết lập ai đó chọn nhiều năm trước và không ai còn nhớ. Khai cái khối ấy biến nhu cầu của workflow thành một thuộc tính CỦA workflow, đọc được ngay trong diff, và — bởi khai bất kỳ phạm vi nào cũng đặt mọi phạm vi khác về <code>none</code> — nó tự động TỐI THIỂU.</p>
</div>

<h3>Kho này khai gì</h3>
<div class="out">permissions: khai tuong minh:  1 / 11 workflow</div>

<p>Cái duy nhất ấy là <code>deploy-ghcr.yml</code>, và nó tự giải thích trong một bình luận ngay trên khối:</p>

<pre><code><span class="tok-comment"># GHCR push requires &#96;packages: write&#96;. Default GITHUB_TOKEN has</span>
<span class="tok-comment"># read-only package scope; we explicitly request the higher scope</span>
<span class="tok-comment"># for the duration of this workflow.</span>
permissions:
  contents: read
  actions: write
  packages: write</code></pre>

<div class="callout ok">
<p><strong>Ba phạm vi, mỗi cái tự kiếm chỗ đứng.</strong> <code>contents: read</code> để checkout; <code>packages: write</code> để đẩy ảnh lên GHCR; <code>actions: write</code> cho những lời gọi tự quản của chính workflow. Mọi thứ khác — issue, pull request, deployment, sự kiện bảo mật — ngầm định là <code>none</code>, bởi nêu tên bất kỳ phạm vi nào cũng đưa phần còn lại về không. Đó là toàn bộ cơ chế, và nó khiến bản quyền-tối-thiểu của một workflow trở thành bản DỄ VIẾT nhất.</p>
</div>

<h3>Ranh giới: một kho</h3>
<p>Workflow phát hành desktop công bố các bản cài sang một <strong>KHO KHÁC</strong> — kho phát hành bắt buộc phải công khai, vì <code>electron-updater</code> tải bản cập nhật mà không kèm token. Và yêu cầu ấy đụng vào phạm vi của cái token:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k"><code>GITHUB_TOKEN</code></span><span class="lz-t">chỉ kho NÀY</span><span class="lz-d">nó được đúc cho cái kho đang chạy và không hợp lệ ở bất cứ đâu khác, ở bất kỳ mức quyền nào</span></div>
<div class="lz-step"><span class="lz-k">yêu cầu</span><span class="lz-t">ghi vào một kho khác</span><span class="lz-d">tạo một bản phát hành và tải tệp lên ở <code>cuonghoang1103/cuongthai-desktop</code></span></div>
<div class="lz-step"><span class="lz-k">nên workflow dùng</span><span class="lz-t"><code>secrets.RELEASE_TOKEN</code></span><span class="lz-d">một personal access token, kèm bình luận trong tệp nói chính xác vì sao token mặc định không dùng được</span></div>
</div>

<div class="callout">
<p><strong>Đây là lý do CHÍNH ĐÁNG để dùng một PAT, và nó gần như là lý do duy nhất.</strong> Nếu một workflow cần một PAT cho việc gì đó <em>BÊN TRONG</em> chính kho của nó, thì gần như luôn là có một khối <code>permissions:</code> chưa được viết. Truy cập LIÊN KHO thì khác — không thiết lập quyền nào nối dài <code>GITHUB_TOKEN</code> ra ngoài kho của nó, nên một thông tin đăng nhập riêng là CƠ CHẾ, không phải một cách lách.</p>
</div>

<h3>Một PAT tốn gì, nói cho thẳng</h3>
<div class="kv-grid">
<div class="kv"><span class="k">nó KHÔNG hết hạn theo job</span><span class="v">khác <code>GITHUB_TOKEN</code>, thứ chết ngay khoảnh khắc job kết thúc. Một PAT bị rò thì còn hiệu lực cho tới khi có người thu hồi</span></div>
<div class="kv"><span class="k">nó mang theo quyền CỦA MỘT NGƯỜI</span><span class="v">một PAT cổ điển được khoanh theo <em>PHẠM VI</em>, không theo kho — <code>repo</code> nghĩa là MỌI kho người ấy với tới được. PAT chi-tiết vá được chuyện này và đáng bỏ thêm công thiết lập</span></div>
<div class="kv"><span class="k">nó cần được XOAY</span><span class="v">và chẳng có gì nhắc bạn. Một PAT không đặt hạn là một thông tin đăng nhập mà không ai nghĩ tới nữa cho tới khi nó nằm trong một bản báo cáo sự cố</span></div>
<div class="kv"><span class="k">lựa chọn tốt hơn khi có</span><span class="v">một token cài đặt của GitHub App: khoanh theo từng kho, sống ngắn, và thu hồi được mà không đụng tới quyền của một con người. Thiết lập nhiều hơn, và là đáp án đúng cho bất cứ thứ gì tồn tại lâu dài</span></div>
</div>

<h3>Thu nhỏ token mặc định, trong thực tế</h3>
<pre><code><span class="tok-comment"># o dau workflow: mac dinh cho MOI job</span>
permissions:
  contents: read

jobs:
  cong-bo:
    <span class="tok-comment"># nang o dung job can, va chi job do</span>
    permissions:
      contents: write        <span class="tok-comment"># tao release</span>
      packages: write
    steps: ...</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">khai ở mức workflow, nâng theo từng job</span><span class="lz-lnote">khối ở mức job <em>THAY THẾ</em> khối ở mức workflow chứ không cộng vào — nên một job nâng một phạm vi thì phải liệt kê lại những phạm vi nó vẫn cần</span></div>
<div class="lz-layer"><span class="lz-lname"><code>permissions: {}</code> là hợp lệ</span><span class="lz-lnote">không quyền nào cả. Đúng cho một job lint trên một kho công khai: nó không cần đọc gì ngoài bản checkout của chính nó, thứ mà token vẫn cho phép vì kho là công khai</span></div>
<div class="lz-layer"><span class="lz-lname">một PR từ fork VỐN ĐÃ bị hạn chế</span><span class="lz-lnote">chỉ-đọc bất kể bạn khai gì — đo ở bài 1.4. Nên khối <code>permissions:</code> bảo vệ trước <em>CHÍNH</em> workflow và action của bạn, không bảo vệ trước người đóng góp từ fork</span></div>
<div class="lz-layer"><span class="lz-lname">và nó bảo vệ trước các ACTION</span><span class="lz-lnote">đúng luận điểm Chương 4 đã đo: 11,3% thời gian bước là mã bên thứ ba chạy với cái token này trong môi trường của nó. Thu hẹp token là thu hẹp thứ mà một action bị chiếm với tới được</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — thêm <code>permissions:</code> rồi làm vỡ một bước mà không ai nhớ là nó cần quyền.</strong> Khai bất kỳ phạm vi nào cũng đưa phần còn lại về không, nên một workflow âm thầm dựa vào <code>issues: write</code> để đăng một bình luận sẽ THÔI đăng, một cách im lặng, với một lỗi 403 chôn trong đầu ra của một action. Thứ tự an toàn là: thêm khối với những phạm vi bạn BIẾT, chạy một lần, rồi đọc log tìm lỗi quyền — chứ không phải thêm vào rồi cho rằng xanh nghĩa là đủ. Đây là thay đổi duy nhất mà câu "nó vẫn qua" là bằng chứng YẾU.</p>
</div>

<h3>Environment, thứ kho này không dùng</h3>
<div class="out">environment: khai o  0 / 11 workflow</div>

<p>Một <code>environment:</code> gắn theo một tập bí mật có tên và, tuỳ chọn, một <strong>người duyệt bắt buộc</strong> — một job sẽ không khởi động cho tới khi một con người phê duyệt nó trên giao diện. Với một kho mà mọi workflow deploy đều là <code>workflow_dispatch</code>, cái cổng con-người vốn đã tồn tại dưới dạng một người bấm nút, và có lẽ đó là lý do không cái nào được thêm.</p>

<div class="callout ok">
<p><strong>Lý lẽ ấy chỉ đứng vững CHỪNG NÀO kích hoạt còn là thủ công.</strong> Ngay khoảnh khắc một workflow deploy nào đó có thêm kích hoạt <code>push:</code> hay <code>schedule:</code> — thứ mà Chương 9 lập luận là một thay đổi đầy cám dỗ — thì bước phê duyệt biến mất và không có gì thay thế. Một <code>environment:</code> kèm người duyệt là cơ chế SỐNG SÓT được qua thay đổi ấy, và thêm nó tốn một dòng.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>GITHUB_TOKEN</code> sống ngắn, tự động, và bị khoá vào một kho — nên <code>permissions:</code> là cách bạn THU NHỎ nó, một <code>environment:</code> là cách bạn ĐẶT CỔNG cho nó, và một PAT là thứ bạn với tay tới CHỈ khi bạn thật sự cần vượt ranh giới kho.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Automatic token authentication</span><span class="lc-sub">docs.github.com/en/actions/security-guides/automatic-token-authentication — vòng đời của token, bảng phạm vi đầy đủ với cả hai tập mặc định, và phát biểu rằng nó bị giới hạn trong cái kho chứa workflow.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: permissions</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions — mọi phạm vi dùng được, và luật rằng nêu tên bất kỳ phạm vi nào cũng đặt những cái không nêu về <code>none</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using environments for deployment</span><span class="lc-sub">docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment — người duyệt bắt buộc, bộ hẹn chờ, và bí mật khoanh theo môi trường, tức là cái cổng mà phần trên vừa lập luận.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Fine-grained personal access tokens</span><span class="lc-sub">docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens — khoanh theo từng kho và bắt buộc có hạn dùng, thứ khiến ca liên-kho bên trên trở nên AN TOÀN chứ không chỉ là khả thi.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — phạm vi, đặc quyền tối thiểu, và vòng đời token</span><span class="lc-sub">/courses/authentication/learn${REF} — vì sao một token hẹp sống ngắn là một loại vật thể KHÁC HẲN một token rộng sống lâu, và cách lập luận về chỗ khác biệt ấy.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — OIDC, and the secret you stop storing|||6.3 — OIDC, và cái bí mật bạn thôi phải lưu',
      slug: 'ga-6-3-oidc',
      type: 'VIDEO',
      description: 'Kho này có 2/8 bí mật là thông tin đăng nhập SỐNG LÂU — một khoá SSH mở được máy chủ production và một PAT. OIDC là cơ chế thay chúng bằng thứ sống vài phút. Đo: 0/11 workflow dùng nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>OIDC, and the secret you stop storing</h2>
<p class="lead">The safest secret is the one that does not exist. OIDC is the mechanism for that: instead of storing a credential and handing it to a job, the job proves who it is and receives a short-lived credential in return. This repository does not use it, and the reason to explain it here is that it would replace the two most dangerous things it does store.</p>

<h3>What is stored, classified by lifetime</h3>
<div class="out">VPS_SSH_PRIVATE_KEY   khoa SSH — KHONG het han, mo duoc may chu production
RELEASE_TOKEN         PAT — hieu luc toi khi co nguoi thu hoi
VPS_HOST / VPS_USER   cau hinh, khong phai thong tin dang nhap
GITHUB_TOKEN          TU DONG, song ngan, chet cung job

2 / 8 la thong tin dang nhap SONG LAU
1 / 8 song ngan va tu dong</div>

<div class="callout warn">
<p><strong>The asymmetry is the point.</strong> <code>GITHUB_TOKEN</code> is minted per job and dead within minutes, so a leak of it is a small window. The SSH key has no expiry at all: if it were printed into a log in 2026 it would still open the production server whenever somebody found it. Same repository, same workflows, two completely different exposure profiles — and only one of them is under your control.</p>
</div>

<h3>How OIDC changes the shape</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">without OIDC</span><span class="lz-t">store, then hand over</span><span class="lz-d">a long-lived credential sits in repository settings, is injected into a job, and is only as safe as every action and script in that job</span></div>
<div class="lz-step"><span class="lz-k">with OIDC</span><span class="lz-t">prove, then receive</span><span class="lz-d">the job asks GitHub for a signed token describing itself, presents it to the cloud provider, and gets back a credential valid for minutes</span></div>
<div class="lz-step"><span class="lz-k">what you store</span><span class="lz-t">nothing</span><span class="lz-d">the trust lives in the provider&#39;s configuration — "this repository, this branch, may assume this role" — not in a secret</span></div>
</div>

<p>The token GitHub issues is a JWT whose claims describe the run, and the provider&#39;s trust policy matches on those claims:</p>

<div class="out">claim              vi du                                y nghia
------------------------------------------------------------------------
iss                https://token.actions.githubusercontent.com
sub                repo:cuonghoang1103/api-backend:ref:refs/heads/main
repository         cuonghoang1103/api-backend
ref                refs/heads/main
environment        production        (chi co khi job dung environment:)
job_workflow_ref   .../deploy.yml@refs/heads/main</div>

<div class="callout ok">
<p><strong>Read the <code>sub</code> claim carefully, because it is where the security actually lives.</strong> A trust policy matching <code>repo:org/name:*</code> accepts a token from <em>any</em> branch of that repository — including a branch a contributor pushed. Matching <code>repo:org/name:ref:refs/heads/main</code> accepts only the default branch. Matching on <code>environment</code> is tighter still, because an environment can require a human approval. The mechanism is only as narrow as the string you configured on the provider side, and the permissive version is the one that gets copied from a blog post.</p>
</div>

<h3>What it looks like in the workflow</h3>
<pre><code>permissions:
  id-token: write        <span class="tok-comment"># BAT BUOC — khong co thi khong xin duoc token</span>
  contents: read

steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123456789012:role/deploy
      aws-region: ap-southeast-1
      <span class="tok-comment"># khong co aws-access-key-id, khong co aws-secret-access-key</span></code></pre>

<div class="out">id-token: write khai o  0 / 11 workflow cua kho nay</div>

<div class="pitfall">
<p><strong>Trap — forgetting <code>id-token: write</code>, and reading the error as a provider problem.</strong> Without it the job cannot request a token at all, and the failure surfaces on the cloud side as a credentials error — which sends people to check their role ARN and their trust policy, both of which are fine. It is one line in <code>permissions:</code>, and per 6.2 declaring it also zeroes every other scope, so <code>contents: read</code> has to be listed alongside it or the checkout breaks too.</p>
</div>

<h3>Where it applies, and where it does not</h3>
<div class="kv-grid">
<div class="kv"><span class="k">works well</span><span class="v">AWS, Google Cloud, Azure, HashiCorp Vault, and any registry or service that accepts an OIDC trust relationship. This is most of what a deploy pipeline touches</span></div>
<div class="kv"><span class="k">does not apply</span><span class="v">a plain SSH server, which is this repository&#39;s case. <code>sshd</code> has no notion of a federated identity, so the key stays a key</span></div>
<div class="kv"><span class="k">the partial answer for SSH</span><span class="v">an SSH certificate authority: a short-lived certificate signed for this run rather than a permanent key. Real, and considerably more setup than one lesson can justify — but it is the same idea</span></div>
<div class="kv"><span class="k">the cheap improvements meanwhile</span><span class="v">a dedicated deploy user rather than <code>root</code>, a <code>command=</code> restriction in <code>authorized_keys</code> so the key can only run the deploy script, and <code>from=</code> if the runner IPs were fixed — which for GitHub-hosted runners they are not</span></div>
</div>

<div class="callout">
<p><strong>Being honest about what this repository can actually do.</strong> Its deploy target is a VPS reached over SSH, so OIDC does not fit and saying "use OIDC" would be advice that cannot be taken. The transferable part is the question OIDC asks: <em>does this credential need to outlive the job?</em> For the SSH key the honest answer is no — it needs to exist for four minutes, three times a week — and the mechanisms that get closer to that are an SSH CA, or a deploy user whose key can only invoke one command.</p>
</div>

<h3>The one measurement that would change the decision</h3>
<p>The SSH key opens a machine that runs the database, the backend, the frontend and nginx. Chapter 4 measured that 11.3% of step time in this repository runs third-party action code with the job&#39;s environment available to it. Put those two facts together and the question is concrete: how many distinct pieces of code, across how many workflows, are in a position to read that key?</p>

<div class="out">workflow co dung VPS_SSH_PRIVATE_KEY:  9 / 11
action ben thu ba chay trong cac job do: checkout, setup-node,
                                         cache, upload/download-artifact,
                                         buildx, login-action, build-push
=> 8 action khac nhau, tat ca ghim bang the MAJOR di dong (bai 4.2)</div>

<div class="callout ok">
<p><strong>That is the argument for SHA-pinning stated as a number rather than a principle.</strong> Nine workflows, eight third-party actions, one non-expiring key that opens production. Chapter 4 said "pin the ones that handle <code>VPS_SSH_PRIVATE_KEY</code> first" — this is where that recommendation comes from, and why it is the specific one worth doing even if nothing else changes.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> OIDC replaces a stored credential with a proof of identity and a credential that expires in minutes, and where it does not fit — an SSH server — the question it asks still does: this key needs to work for four minutes, so what would it take to stop it working for the other 604,796 seconds of the week?</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About security hardening with OpenID Connect</span><span class="lc-sub">docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect — the full claim list, the <code>id-token: write</code> requirement, and the customisation options for the <code>sub</code> claim.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Configuring OIDC in cloud providers</span><span class="lc-sub">docs.github.com/en/actions/deployment/security-hardening-your-deployments — the per-provider guides for AWS, Azure and GCP, each of which includes the trust-policy condition that narrows <code>sub</code> to a branch or environment.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OpenSSH — certificate authentication and the <code>command=</code> restriction</span><span class="lc-sub">man 8 sshd, AUTHORIZED_KEYS FILE FORMAT — short-lived signed certificates, and the option that limits a key to running exactly one command regardless of what the client asks for.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — short-lived credentials, and why expiry is a feature</span><span class="lc-sub">/courses/authentication/learn${REF} — token lifetime as a security property, refresh flows, and the difference between revoking and expiring.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the deploy user, and not using root</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the cheap SSH hardening measures named above, measured against what they actually prevent.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>OIDC, và cái bí mật bạn thôi phải lưu</h2>
<p class="lead">Bí mật an toàn nhất là bí mật KHÔNG TỒN TẠI. OIDC là cơ chế cho chuyện đó: thay vì lưu một thông tin đăng nhập rồi đưa cho một job, job tự CHỨNG MINH nó là ai rồi nhận về một thông tin đăng nhập sống ngắn. Kho này không dùng nó, và lý do giải thích nó ở đây là vì nó sẽ thay được đúng hai thứ nguy hiểm nhất mà kho đang lưu.</p>

<h3>Đang lưu những gì, phân loại theo VÒNG ĐỜI</h3>
<div class="out">VPS_SSH_PRIVATE_KEY   khoa SSH — KHONG het han, mo duoc may chu production
RELEASE_TOKEN         PAT — hieu luc toi khi co nguoi thu hoi
VPS_HOST / VPS_USER   cau hinh, khong phai thong tin dang nhap
GITHUB_TOKEN          TU DONG, song ngan, chet cung job

2 / 8 la thong tin dang nhap SONG LAU
1 / 8 song ngan va tu dong</div>

<div class="callout warn">
<p><strong>Sự bất đối xứng ấy mới là điểm chính.</strong> <code>GITHUB_TOKEN</code> được đúc theo từng job và chết trong vài phút, nên một lần rò nó là một cửa sổ nhỏ. Cái khoá SSH thì hoàn toàn KHÔNG có hạn: nếu nó bị in vào một cái log năm 2026 thì nó vẫn mở được máy chủ production vào bất cứ lúc nào có người tìm thấy. Cùng một kho, cùng những workflow, hai hồ sơ phơi nhiễm hoàn toàn khác nhau — và chỉ một trong hai nằm trong tầm kiểm soát của bạn.</p>
</div>

<h3>OIDC đổi HÌNH DẠNG như thế nào</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">không OIDC</span><span class="lz-t">lưu, rồi trao tay</span><span class="lz-d">một thông tin đăng nhập sống lâu nằm trong thiết lập kho, được bơm vào một job, và nó chỉ an toàn ngang với MỌI action và script trong job ấy</span></div>
<div class="lz-step"><span class="lz-k">có OIDC</span><span class="lz-t">chứng minh, rồi nhận</span><span class="lz-d">job xin GitHub một token đã ký mô tả chính nó, trình cho nhà cung cấp đám mây, rồi nhận về một thông tin đăng nhập có hiệu lực vài phút</span></div>
<div class="lz-step"><span class="lz-k">bạn lưu cái gì</span><span class="lz-t">không gì cả</span><span class="lz-d">sự tin cậy sống trong CẤU HÌNH của nhà cung cấp — "kho này, nhánh này, được phép nhận vai trò này" — chứ không sống trong một bí mật</span></div>
</div>

<p>Cái token GitHub cấp là một JWT mà các claim của nó mô tả lần chạy, và chính sách tin cậy của nhà cung cấp khớp trên những claim ấy:</p>

<div class="out">claim              vi du                                y nghia
------------------------------------------------------------------------
iss                https://token.actions.githubusercontent.com
sub                repo:cuonghoang1103/api-backend:ref:refs/heads/main
repository         cuonghoang1103/api-backend
ref                refs/heads/main
environment        production        (chi co khi job dung environment:)
job_workflow_ref   .../deploy.yml@refs/heads/main</div>

<div class="callout ok">
<p><strong>Hãy đọc kỹ cái claim <code>sub</code>, vì đó là chỗ phần bảo mật THẬT SỰ nằm.</strong> Một chính sách tin cậy khớp <code>repo:org/name:*</code> sẽ chấp nhận token từ <em>BẤT KỲ</em> nhánh nào của kho ấy — kể cả một nhánh do một người đóng góp vừa đẩy lên. Khớp <code>repo:org/name:ref:refs/heads/main</code> thì chỉ chấp nhận nhánh mặc định. Khớp trên <code>environment</code> còn chặt hơn nữa, bởi một environment có thể đòi một con người phê duyệt. Cơ chế này chỉ HẸP ngang với cái chuỗi bạn cấu hình bên phía nhà cung cấp, và bản rộng rãi lại là bản hay bị chép từ một bài blog.</p>
</div>

<h3>Nó trông ra sao trong workflow</h3>
<pre><code>permissions:
  id-token: write        <span class="tok-comment"># BAT BUOC — khong co thi khong xin duoc token</span>
  contents: read

steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123456789012:role/deploy
      aws-region: ap-southeast-1
      <span class="tok-comment"># khong co aws-access-key-id, khong co aws-secret-access-key</span></code></pre>

<div class="out">id-token: write khai o  0 / 11 workflow cua kho nay</div>

<div class="pitfall">
<p><strong>Bẫy — quên <code>id-token: write</code>, rồi đọc lỗi ấy thành lỗi của nhà cung cấp.</strong> Thiếu nó thì job hoàn toàn không xin được token, và cú hỏng lộ ra ở phía đám mây dưới dạng một lỗi thông tin đăng nhập — thứ khiến người ta đi kiểm ARN của vai trò và chính sách tin cậy, mà cả hai đều ổn. Nó là MỘT dòng trong <code>permissions:</code>, và theo bài 6.2 thì khai nó cũng đưa mọi phạm vi khác về không, nên <code>contents: read</code> phải được liệt kê cùng, không thì cả bước checkout cũng vỡ.</p>
</div>

<h3>Nó áp dụng ở đâu, và không áp dụng ở đâu</h3>
<div class="kv-grid">
<div class="kv"><span class="k">chạy tốt</span><span class="v">AWS, Google Cloud, Azure, HashiCorp Vault, và mọi registry hay dịch vụ chấp nhận một quan hệ tin cậy OIDC. Đó là phần lớn những gì một đường ống deploy chạm tới</span></div>
<div class="kv"><span class="k">KHÔNG áp dụng</span><span class="v">một máy chủ SSH trơn, tức là ca của kho này. <code>sshd</code> không có khái niệm danh tính liên kết, nên cái khoá vẫn cứ là một cái khoá</span></div>
<div class="kv"><span class="k">đáp án MỘT PHẦN cho SSH</span><span class="v">một cơ quan chứng thực SSH: một chứng chỉ sống ngắn được ký cho ĐÚNG lần chạy này thay vì một cái khoá vĩnh viễn. Có thật, và tốn công thiết lập hơn nhiều so với mức một bài học biện minh được — nhưng nó là cùng một ý tưởng</span></div>
<div class="kv"><span class="k">những cải thiện rẻ trong lúc chờ</span><span class="v">một người dùng deploy riêng thay vì <code>root</code>, một hạn chế <code>command=</code> trong <code>authorized_keys</code> để cái khoá chỉ chạy được đúng script deploy, và <code>from=</code> nếu IP của runner cố định — mà với runner do GitHub cấp thì không</span></div>
</div>

<div class="callout">
<p><strong>Nói thẳng xem kho này THẬT SỰ làm được gì.</strong> Đích deploy của nó là một VPS với tới qua SSH, nên OIDC không vừa và bảo "dùng OIDC đi" là đưa ra một lời khuyên không thể làm theo. Phần chuyển giao được là CÂU HỎI mà OIDC đặt ra: <em>thông tin đăng nhập này có cần sống lâu hơn cái job không?</em> Với cái khoá SSH, đáp án trung thực là KHÔNG — nó cần tồn tại bốn phút, ba lần một tuần — và những cơ chế tới gần được điều đó là một CA cho SSH, hoặc một người dùng deploy mà khoá của họ chỉ gọi được đúng một câu lệnh.</p>
</div>

<h3>Một phép đo sẽ làm đổi quyết định</h3>
<p>Cái khoá SSH mở một cỗ máy đang chạy cơ sở dữ liệu, backend, frontend và nginx. Chương 4 đã đo rằng 11,3% thời gian bước ở kho này chạy mã action của bên thứ ba với môi trường của job nằm sẵn trong tầm với. Ghép hai sự thật ấy lại thì câu hỏi thành cụ thể: có bao nhiêu mẩu mã khác nhau, trải trên bao nhiêu workflow, đang ở vị thế đọc được cái khoá ấy?</p>

<div class="out">workflow co dung VPS_SSH_PRIVATE_KEY:  9 / 11
action ben thu ba chay trong cac job do: checkout, setup-node,
                                         cache, upload/download-artifact,
                                         buildx, login-action, build-push
=> 8 action khac nhau, tat ca ghim bang the MAJOR di dong (bai 4.2)</div>

<div class="callout ok">
<p><strong>Đó là lập luận cho việc ghim SHA, phát biểu bằng một CON SỐ chứ không bằng một nguyên tắc.</strong> Chín workflow, tám action bên thứ ba, một cái khoá không hết hạn mở được production. Chương 4 nói "hãy ghim những cái có cầm <code>VPS_SSH_PRIVATE_KEY</code> TRƯỚC TIÊN" — đây chính là chỗ khuyến nghị ấy tới từ, và là lý do nó là việc cụ thể đáng làm ngay cả khi không có gì khác thay đổi.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> OIDC thay một thông tin đăng nhập ĐÃ LƯU bằng một BẰNG CHỨNG DANH TÍNH cộng một thông tin đăng nhập hết hạn sau vài phút, và ở chỗ nó không vừa — một máy chủ SSH — thì câu hỏi nó đặt ra vẫn vừa: cái khoá này cần hoạt động bốn phút, vậy phải làm gì để nó THÔI hoạt động trong 604.796 giây còn lại của tuần?</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About security hardening with OpenID Connect</span><span class="lc-sub">docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect — danh sách claim đầy đủ, yêu cầu <code>id-token: write</code>, và các tuỳ chọn tuỳ biến claim <code>sub</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Configuring OIDC in cloud providers</span><span class="lc-sub">docs.github.com/en/actions/deployment/security-hardening-your-deployments — hướng dẫn riêng cho AWS, Azure và GCP, mỗi cái đều kèm điều kiện chính sách tin cậy thu hẹp <code>sub</code> về một nhánh hoặc một environment.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OpenSSH — xác thực bằng chứng chỉ và hạn chế <code>command=</code></span><span class="lc-sub">man 8 sshd, phần AUTHORIZED_KEYS FILE FORMAT — chứng chỉ sống ngắn được ký, và tuỳ chọn giới hạn một cái khoá chỉ chạy được đúng một câu lệnh bất kể phía khách xin gì.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — thông tin đăng nhập sống ngắn, và vì sao HẾT HẠN là một tính năng</span><span class="lc-sub">/courses/authentication/learn${REF} — vòng đời token như một tính chất bảo mật, luồng làm mới, và chỗ khác nhau giữa THU HỒI với HẾT HẠN.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — người dùng deploy, và chuyện không dùng root</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — những biện pháp gia cố SSH rẻ tiền nêu bên trên, đo đối chiếu với thứ chúng thật sự ngăn được.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — The whole attack surface, on one page|||6.4 — Toàn bộ bề mặt tấn công, gói trong một trang',
      slug: 'ga-6-4-be-mat',
      type: 'VIDEO',
      description: 'Gộp mọi thứ đã đo từ Chương 1 tới đây thành một bản đồ: người lạ mở một PR với tới được gì, chủ kho với tới được gì, và mã của bên thứ ba với tới được gì. Kèm con số thật của kho này ở từng ô.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>The whole attack surface, on one page</h2>
<p class="lead">Six chapters have measured pieces of this. Put together they answer one question with an actual boundary rather than a feeling: given a workflow, who can make it do something, and what can that something reach?</p>

<h3>Three actors, and what each one holds</h3>
<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">a stranger with a fork PR</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">controls: the code, the branch name, the PR title and body, the commit messages</span><span class="lz-nsub">holds: <strong>no secrets</strong>, a read-only <code>GITHUB_TOKEN</code>. Measured in 1.4: <code>DEPLOY_KEY = (không thấy)</code></span></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">a third-party action</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">controls: everything the job does, once it runs</span><span class="lz-nsub">holds: the workspace, <code>\$GITHUB_ENV</code>, <code>\$GITHUB_PATH</code>, the job&#39;s token, and every secret passed to its step. 11.3% of step time here, 8 distinct actions, all on moving tags</span></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">someone with write access</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">controls: the workflow file itself</span><span class="lz-nsub">holds: everything. No Actions setting constrains this — masking, permissions and environments all assume the workflow author is trusted</span></div></div>
</div>
</div>

<div class="callout">
<p><strong>Almost every real incident is row two or a mistake that promotes row one into row two.</strong> Row three is a review and branch-protection problem, not an Actions one. Row one is well-defended by default — and the defences fail only where a workflow author reaches past them, which is the list below.</p>
</div>

<h3>The four ways row one becomes row two</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — <code>\${{ }}</code> from the event, inside <code>run:</code></span><span class="lz-lnote">3.1: the PR title becomes script text. Three lines to demonstrate, and the fix is routing through <code>env:</code>. In this repository, 27 of 44 secret interpolations are direct — but all are values the owner set, not event data, so none are exposed</span></div>
<div class="lz-layer"><span class="lz-lname">2 — <code>pull_request_target</code> + <code>ref: head.sha</code></span><span class="lz-lnote">1.4: measured to print <code>DEPLOY_KEY = sk-that-su-cua-production-9f2a</code>. One added line turns a safe workflow into a shell for a stranger. Measured here: <strong>0 / 11</strong> workflows use <code>pull_request_target</code></span></div>
<div class="lz-layer"><span class="lz-lname">3 — a compromised action</span><span class="lz-lnote">4.2: 21 of 21 uses pinned to moving major tags, and 6 actions demonstrably changed runtime under an unchanged file. A tag move is how a compromise arrives</span></div>
<div class="lz-layer"><span class="lz-lname">4 — a derived secret, printed</span><span class="lz-lnote">6.1: masking covers the stored string only. The base64-decoded SSH key shares zero nine-character substrings with what GitHub masks</span></div>
</div>

<h3>Scoring this repository against its own measurements</h3>
<div class="out">1. bieu thuc su kien trong run:   0 cho  ✅  (27 noi suy deu la secret cua chu kho)
2. pull_request_target             0 / 11  ✅
3. action ghim bang SHA             0 / 21  ⚠️  tat ca deu la the major di dong
4. bi mat bien doi, co in ra?       khong  ✅  khoa giai ma ghi thang vao tep
5. permissions: khai tuong minh     1 / 11  ⚠️
6. environment: co nguoi duyet      0 / 11  ⚠️  (cong con nguoi la nut Run workflow)
7. bi mat song lau                  2 / 8   ⚠️  khoa SSH + PAT, khong het han</div>

<div class="callout ok">
<p><strong>Four green, three amber, no red.</strong> The two failure modes that actually leak secrets to strangers — event interpolation and <code>pull_request_target</code> — are both absent, and that is the part that matters most. The amber rows are all the same shape: not wrong, but relying on nothing going wrong elsewhere.</p>
</div>

<h3>What the amber rows are actually saying</h3>
<div class="kv-grid">
<div class="kv"><span class="k">moving tags</span><span class="v">the repository trusts <code>actions/</code> and <code>docker/</code> to not be compromised, which is a reasonable bet on the two most-scrutinised namespaces. It is a bet, and 4.2 measured that the thing under the tag does change</span></div>
<div class="kv"><span class="k">default permissions</span><span class="v">ten workflows run with whatever the repository setting says, which nobody in this analysis could determine from the outside. Unknown blast radius is a worse state than a large known one</span></div>
<div class="kv"><span class="k">no approval gate</span><span class="v">safe while every deploy is <code>workflow_dispatch</code>. The gate is a human pressing a button, and it disappears the day somebody adds a trigger</span></div>
<div class="kv"><span class="k">non-expiring credentials</span><span class="v">the SSH key is the whole server. Nine workflows can read it, eight third-party actions run alongside it, and it will still work in a year</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — treating a green row as permanent.</strong> Every green result above is a property of the current files, not of the repository. <code>pull_request_target</code> is zero until somebody needs a labeller bot. Event interpolation is zero until somebody adds a step that echoes a branch name. The measurements are a snapshot, and the only thing that keeps them green is that the four checks are cheap enough to re-run — which is what 6.5 is for.</p>
</div>

<h3>The ranking, if only one thing gets done</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">SHA-pin the 9 workflows that read the SSH key</span><span class="lz-d">highest ratio of risk removed to effort spent — 8 actions, one afternoon, and it is the row where a single upstream compromise reaches production</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">add <code>permissions:</code> to every workflow</span><span class="lz-d">converts an unknown into a declared minimum, and shrinks what a compromised action in row 1 could do</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">an <code>environment:</code> with a reviewer on the deploy jobs</span><span class="lz-d">one line, and it is the control that survives somebody adding an automatic trigger later</span></div>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> A fork PR is well-contained by default, someone with write access is unconstrained by design, and the entire practical security question is the middle row — third-party code running with your credentials — which is why pinning is worth more than every other item on the list.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening for GitHub Actions</span><span class="lc-sub">docs.github.com/en/actions/security-guides/security-hardening-for-github-actions — the whole page, which covers all four failure modes above in GitHub&#39;s own words and is the shortest complete reference on the subject.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Security Lab — the Actions research series</span><span class="lc-sub">securitylab.github.com/resources/ — the pwn-request and untrusted-input write-ups behind rows one and two, with real vulnerable workflows found in public repositories.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OpenSSF — Scorecard checks for GitHub Actions</span><span class="lc-sub">github.com/ossf/scorecard — an automated version of the scoring table above, including the pinned-dependencies and token-permissions checks, runnable against any public repository.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — threat modelling by asking who controls what</span><span class="lc-sub">/courses/authentication/learn${REF} — the actor-and-capability table above is a threat model, and this is the method it comes from.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — supply chain, digests, and trusting a base image</span><span class="lc-sub">/courses/docker/learn${REF} — row two in a different medium, with the same conclusion: pin what you run, and know how many distinct parties you are trusting.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Toàn bộ bề mặt tấn công, gói trong một trang</h2>
<p class="lead">Sáu chương đã đo từng mảnh của chuyện này. Ghép lại, chúng trả lời một câu hỏi bằng một RANH GIỚI thật chứ không bằng cảm giác: cho một workflow, AI khiến nó làm được một việc gì đó, và cái việc ấy với tới được đâu?</p>

<h3>Ba nhân vật, và mỗi người nắm gì</h3>
<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">một người lạ mở PR từ fork</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">kiểm soát: mã, tên nhánh, tiêu đề và thân PR, các thông điệp commit</span><span class="lz-nsub">nắm: <strong>KHÔNG bí mật nào</strong>, một <code>GITHUB_TOKEN</code> chỉ đọc. Đo ở bài 1.4: <code>DEPLOY_KEY = (không thấy)</code></span></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">một action của bên thứ ba</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">kiểm soát: mọi thứ job làm, một khi nó chạy</span><span class="lz-nsub">nắm: thư mục làm việc, <code>\$GITHUB_ENV</code>, <code>\$GITHUB_PATH</code>, token của job, và mọi bí mật truyền cho bước của nó. 11,3% thời gian bước ở đây, 8 action khác nhau, tất cả trên thẻ di động</span></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">một người có quyền ghi</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">kiểm soát: chính tệp workflow</span><span class="lz-nsub">nắm: mọi thứ. Không thiết lập Actions nào ràng buộc được chuyện này — che bí mật, quyền và environment đều giả định tác giả workflow là ĐÁNG TIN</span></div></div>
</div>
</div>

<div class="callout">
<p><strong>Gần như mọi sự cố thật đều là hàng hai, hoặc là một sai lầm nâng hàng một lên thành hàng hai.</strong> Hàng ba là bài toán review và branch protection, không phải bài toán của Actions. Hàng một thì mặc định đã được phòng thủ tốt — và phòng thủ ấy chỉ vỡ ở chỗ một tác giả workflow với tay ra ngoài nó, tức là danh sách dưới đây.</p>
</div>

<h3>Bốn cách hàng MỘT thành hàng HAI</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — <code>\${{ }}</code> lấy từ sự kiện, đặt trong <code>run:</code></span><span class="lz-lnote">bài 3.1: tiêu đề PR trở thành chữ trong script. Ba dòng để minh hoạ, và cách vá là vòng qua <code>env:</code>. Ở kho này, 27 trong 44 lượt nội suy bí mật là trực tiếp — nhưng tất cả đều là giá trị do chủ kho đặt, không phải dữ liệu sự kiện, nên không cái nào bị phơi</span></div>
<div class="lz-layer"><span class="lz-lname">2 — <code>pull_request_target</code> + <code>ref: head.sha</code></span><span class="lz-lnote">bài 1.4: đo được là in ra <code>DEPLOY_KEY = sk-that-su-cua-production-9f2a</code>. Một dòng thêm vào biến một workflow an toàn thành một cái shell cho người lạ. Đo ở đây: <strong>0 / 11</strong> workflow dùng <code>pull_request_target</code></span></div>
<div class="lz-layer"><span class="lz-lname">3 — một action bị chiếm</span><span class="lz-lnote">bài 4.2: 21 trên 21 lượt dùng ghim vào thẻ major di động, và 6 action chứng minh được là đã đổi runtime dưới một cái tệp không đổi. Một cú dời thẻ chính là cách một vụ chiếm quyền đi tới</span></div>
<div class="lz-layer"><span class="lz-lname">4 — một bí mật ĐÃ BIẾN ĐỔI, bị in ra</span><span class="lz-lnote">bài 6.1: che chỉ phủ chuỗi đã lưu. Cái khoá SSH sau khi giải mã base64 không chung một chuỗi con chín ký tự nào với thứ GitHub che</span></div>
</div>

<h3>Chấm điểm kho này theo chính số đo của nó</h3>
<div class="out">1. bieu thuc su kien trong run:   0 cho  ✅  (27 noi suy deu la secret cua chu kho)
2. pull_request_target             0 / 11  ✅
3. action ghim bang SHA             0 / 21  ⚠️  tat ca deu la the major di dong
4. bi mat bien doi, co in ra?       khong  ✅  khoa giai ma ghi thang vao tep
5. permissions: khai tuong minh     1 / 11  ⚠️
6. environment: co nguoi duyet      0 / 11  ⚠️  (cong con nguoi la nut Run workflow)
7. bi mat song lau                  2 / 8   ⚠️  khoa SSH + PAT, khong het han</div>

<div class="callout ok">
<p><strong>Bốn xanh, ba vàng, không đỏ.</strong> Hai kiểu hỏng THẬT SỰ làm rò bí mật cho người lạ — nội suy sự kiện và <code>pull_request_target</code> — đều VẮNG MẶT, và đó mới là phần quan trọng nhất. Ba hàng vàng đều cùng một hình dạng: không sai, nhưng đang dựa vào việc không có gì sai ở chỗ khác.</p>
</div>

<h3>Ba hàng vàng ấy thật ra đang nói gì</h3>
<div class="kv-grid">
<div class="kv"><span class="k">thẻ di động</span><span class="v">kho này tin rằng <code>actions/</code> và <code>docker/</code> sẽ không bị chiếm, mà đó là một canh bạc hợp lý trên hai không gian tên bị soi kỹ nhất. Nó vẫn là một CANH BẠC, và bài 4.2 đã đo rằng thứ nằm dưới cái thẻ CÓ đổi</span></div>
<div class="kv"><span class="k">quyền mặc định</span><span class="v">mười workflow chạy với bất cứ thứ gì thiết lập kho nói, mà không ai trong cuộc phân tích này xác định được từ bên ngoài. Một bán kính thiệt hại KHÔNG BIẾT còn tệ hơn một bán kính lớn đã biết</span></div>
<div class="kv"><span class="k">không có cổng phê duyệt</span><span class="v">an toàn chừng nào mọi cuộc deploy còn là <code>workflow_dispatch</code>. Cái cổng là một con người bấm nút, và nó biến mất vào cái ngày ai đó thêm một kích hoạt</span></div>
<div class="kv"><span class="k">thông tin đăng nhập không hết hạn</span><span class="v">cái khoá SSH LÀ cả cỗ máy chủ. Chín workflow đọc được nó, tám action bên thứ ba chạy bên cạnh nó, và một năm nữa nó vẫn dùng được</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi một hàng XANH là vĩnh viễn.</strong> Mọi kết quả xanh bên trên là tính chất của những TỆP HIỆN TẠI, không phải của cái kho. <code>pull_request_target</code> bằng không cho tới khi có người cần một bot gắn nhãn. Nội suy sự kiện bằng không cho tới khi có người thêm một bước echo tên nhánh ra. Mấy phép đo ấy là một BỨC ẢNH CHỤP, và thứ duy nhất giữ chúng xanh là bốn phép kiểm ấy đủ rẻ để chạy lại — mà đó chính là việc của bài 6.5.</p>
</div>

<h3>Thứ tự ưu tiên, nếu chỉ làm được một việc</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">ghim SHA cho 9 workflow đọc khoá SSH</span><span class="lz-d">tỉ lệ rủi-ro-gỡ-được trên công-bỏ-ra cao nhất — 8 action, một buổi chiều, và đó là hàng mà một cú chiếm quyền ở thượng nguồn với thẳng tới production</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">thêm <code>permissions:</code> vào mọi workflow</span><span class="lz-d">biến một ẩn số thành một mức tối thiểu ĐÃ KHAI, và thu nhỏ thứ mà một action bị chiếm ở mục 1 làm được</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">một <code>environment:</code> kèm người duyệt trên các job deploy</span><span class="lz-d">một dòng, và nó là biện pháp SỐNG SÓT được khi về sau có người thêm một kích hoạt tự động</span></div>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Một PR từ fork được nhốt kín khá tốt theo mặc định, một người có quyền ghi thì không bị ràng buộc theo thiết kế, và toàn bộ câu hỏi bảo mật thực dụng nằm ở HÀNG GIỮA — mã của bên thứ ba chạy với thông tin đăng nhập của bạn — và đó là lý do việc GHIM đáng giá hơn mọi mục khác trong danh sách.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening for GitHub Actions</span><span class="lc-sub">docs.github.com/en/actions/security-guides/security-hardening-for-github-actions — trọn trang, nó phủ cả bốn kiểu hỏng bên trên bằng lời của chính GitHub và là tài liệu tham chiếu ĐẦY ĐỦ ngắn nhất về chủ đề này.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Security Lab — loạt nghiên cứu về Actions</span><span class="lc-sub">securitylab.github.com/resources/ — các bài viết pwn-request và untrusted-input đứng sau hàng một và hàng hai, kèm những workflow dễ tổn thương thật tìm thấy trong kho công khai.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OpenSSF — Scorecard checks cho GitHub Actions</span><span class="lc-sub">github.com/ossf/scorecard — một bản tự động của cái bảng chấm điểm bên trên, gồm cả phép kiểm pinned-dependencies và token-permissions, chạy được trên bất kỳ kho công khai nào.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — mô hình hoá mối đe doạ bằng cách hỏi AI kiểm soát CÁI GÌ</span><span class="lc-sub">/courses/authentication/learn${REF} — cái bảng nhân-vật-và-năng-lực bên trên chính là một mô hình mối đe doạ, và đây là phương pháp nó tới từ.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — chuỗi cung ứng, digest, và chuyện tin một ảnh nền</span><span class="lc-sub">/courses/docker/learn${REF} — hàng hai ở một môi trường khác, với cùng kết luận: ghim thứ bạn chạy, và biết bạn đang tin bao nhiêu bên khác nhau.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.5 ─────────────────────────── */
    {
      title: '6.5 — A script that audits a repository in one command|||6.5 — Một script soát cả kho bằng một câu lệnh',
      slug: 'ga-6-5-soat',
      type: 'VIDEO',
      description: 'Sáu phép kiểm của bài 6.4, viết thành một script bash chạy được, và chạy thật trên kho này: 3 đạt, 3 cảnh báo. Kèm một lỗi trong CHÍNH script ấy — `grep -c` đếm dòng chứ không đếm lần — bắt được vì nó lệch với phép đếm tay.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>A script that audits a repository in one command</h2>
<p class="lead">Lesson 6.4 ended by saying the checks are only useful because they are cheap to re-run. This lesson makes that literal: six of the seven rows are a grep, and the whole thing fits in forty lines.</p>

<h3>Running it</h3>
<div class="out">$ bash soat.sh
=== SOAT BAO MAT ACTIONS — api-backend ===

  ✅ bieu thuc github.event trong run:      0 cho
  ✅ workflow dung pull_request_target      0 workflow
  ✅ action ghim vao mot NHANH              0 cho
  ⚠️  action CHUA ghim bang SHA              0 / 21 da ghim SHA
  ⚠️  workflow KHONG khai permissions:       1 / 11 da khai
  ⚠️  workflow KHONG dung environment:       0 / 11 co dung
  ℹ️  44 luot tham chieu secrets.*

  ket qua: 3 dat, 3 canh bao</div>

<p>Those numbers are the ones 6.4 arrived at by hand. Producing them again in under a second is the point — an audit you run once is a snapshot, and an audit you run on every change is a control.</p>

<h3>The checks, and what each grep actually asks</h3>
<pre><code><span class="tok-comment"># 1. bieu thuc SU KIEN noi suy thang vao run:  — bay o bai 3.1</span>
grep -h -A40 '^\\s*run:' \$W/*.yml | grep -c '\${{ *github\\.event\\.'

<span class="tok-comment"># 2. pull_request_target — bay o bai 1.4</span>
grep -l 'pull_request_target' \$W/*.yml | wc -l

<span class="tok-comment"># 3. action ghim vao mot NHANH — bai 4.2</span>
grep -h -o 'uses: *[^ ]*@\\(main\\|master\\|develop\\)\$' \$W/*.yml | wc -l

<span class="tok-comment"># 4. ti le ghim SHA — bai 4.2</span>
tong=\$(grep -h -o 'uses: *[^ ]*@[^ ]*'          \$W/*.yml | wc -l)
sha=\$( grep -h -o 'uses: *[^ ]*@[0-9a-f]\\{40\\}' \$W/*.yml | wc -l)

<span class="tok-comment"># 5 va 6. permissions: va environment: — bai 6.2</span>
grep -l '^permissions:'       \$W/*.yml | wc -l
grep -l '^\\s*environment:'    \$W/*.yml | wc -l</code></pre>

<div class="callout">
<p><strong>Check 1 is the only one that is approximate, and it is worth knowing why.</strong> It takes forty lines after each <code>run:</code> and looks for an event expression in them — which will occasionally catch a line belonging to the <em>next</em> step, and will miss an event expression more than forty lines into a very long script. It is a smoke detector, not a proof. Lesson 4.5 measured what happens when a window like that is trusted too far: a sixteen-line window reported nine divergent copies of a block where there were two.</p>
</div>

<h3>The bug in the script, found by disagreeing with a hand count</h3>
<p>The first version reported <strong>35</strong> secret references. Chapter 6 had counted <strong>44</strong> by hand. One of the two was wrong:</p>

<div class="out">grep -c  (so DONG):   35
grep -o  (so LAN):    44
chenh:                 9

dong gay ra chenh lech:
  "\${{ secrets.VPS_HOST }}" "\${{ secrets.VPS_USER }}" > ~/.ssh/config</div>

<div class="callout warn">
<p><strong><code>grep -c</code> counts matching <em>lines</em>, not matches.</strong> That <code>printf</code> line has two secrets on it, and it appears in exactly nine workflows — the nine copies of the SSH block measured in 4.5. So the discrepancy was not noise; it was 9 × 1, and the number it was off by pointed straight at the duplication that another chapter had already found. Fixed with <code>grep -o … | wc -l</code>, and the two counts now agree.</p>
</div>

<div class="callout ok">
<p><strong>The reason to tell this story rather than quietly fix it:</strong> the script was believable. It produced plausible output, it agreed with the manual audit on six of seven rows, and nothing about <code>grep -c</code> looks wrong. The only thing that caught it was having counted the same quantity a different way earlier and noticing the two did not match. That is the general technique — not "check your script", which nobody does, but "measure one thing twice by two methods", which is cheap and fails loudly.</p>
</div>

<h3>Where to run it</h3>
<div class="kv-grid">
<div class="kv"><span class="k">before a PR that touches <code>.github/</code></span><span class="v">the cheapest moment. The diff is small and the person reading it has the context</span></div>
<div class="kv"><span class="k">as a workflow, on <code>pull_request</code></span><span class="v">no secrets needed, no permissions needed — <code>permissions: {}</code> is enough, per 6.2. It reads files that are already checked out</span></div>
<div class="kv"><span class="k">not as a blocking check, at first</span><span class="v">three amber rows on day one means a required check that fails on every PR. Run it informationally — with the step named so, as this repository does for its lint steps in 2.4 — until the ambers are cleared</span></div>
<div class="kv"><span class="k">alongside the real tools</span><span class="v">this is a forty-line teaching script. <code>actionlint</code> catches syntax and expression errors, <code>zizmor</code> and OpenSSF Scorecard catch more security patterns than six greps. Use them; write this one anyway, because writing it is how you learn what they are checking</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — a check that cannot fail.</strong> The most likely outcome for a script like this is that it is added, everything is green because the greps do not match anything, and nobody notices that a typo in a pattern made it structurally incapable of finding a problem. Before trusting it, break something on purpose: add <code>pull_request_target</code> to a scratch file, run the script, confirm it goes amber, and remove it. A check you have never seen fail is a check you have not tested.</p>
</div>

<h3>What it deliberately does not check</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">whether a secret is derived and printed</span><span class="lz-lnote">6.1&#39;s <code>base64 -d</code> case. Detecting it needs to know what a value <em>becomes</em>, which grep cannot do</span></div>
<div class="lz-layer"><span class="lz-lname">what the repository&#39;s default token permissions are</span><span class="lz-lnote">a repository setting, not a file. Check it in Settings → Actions, once</span></div>
<div class="lz-layer"><span class="lz-lname">whether an action is trustworthy</span><span class="lz-lnote">pinning tells you the code will not change; it says nothing about whether the pinned code is good</span></div>
<div class="lz-layer"><span class="lz-lname">who has write access</span><span class="lz-lnote">row three of 6.4, and the one no Actions tooling addresses. That is a branch-protection and review question</span></div>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> Six greps reproduce the audit that took a chapter to reason out, which makes the audit repeatable — and the bug in those six greps was found not by reviewing them but by having counted one number twice and noticed the answers differed by nine.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">rhysd/actionlint</span><span class="lc-sub">github.com/rhysd/actionlint — a real static checker for workflow files: expression type checking, context availability, shellcheck on <code>run:</code> blocks. It catches the class of error Chapter 3 measured, statically.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">zizmor — a security linter for GitHub Actions</span><span class="lc-sub">woodruffw.github.io/zizmor — audits for template injection, <code>pull_request_target</code> misuse, unpinned actions, and excessive permissions. The tool version of this lesson&#39;s script.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OpenSSF Scorecard — Token-Permissions and Pinned-Dependencies</span><span class="lc-sub">github.com/ossf/scorecard/blob/main/docs/checks.md — the definitions behind the two amber rows above, and the scoring the wider ecosystem uses for them.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">grep(1) — -c versus -o</span><span class="lc-sub">man 1 grep — <code>-c</code> is documented as printing a count of matching <em>lines</em>. The bug above is entirely explained by that one word in the manual page.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — counting things correctly, and the -c trap</span><span class="lc-sub">/courses/linux-bash/learn${REF} — lines versus matches versus files, and why the three diverge on exactly the data you care about.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — check the checker before you trust it</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the deliberate-breakage technique from the pitfall above, applied to health checks and smoke tests.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Một script soát cả kho bằng một câu lệnh</h2>
<p class="lead">Bài 6.4 kết thúc bằng câu rằng mấy phép kiểm ấy chỉ hữu ích vì chúng RẺ để chạy lại. Bài này biến chuyện đó thành sự thật theo nghĩa đen: sáu trong bảy hàng là một lệnh grep, và toàn bộ gói gọn trong bốn mươi dòng.</p>

<h3>Chạy nó</h3>
<div class="out">$ bash soat.sh
=== SOAT BAO MAT ACTIONS — api-backend ===

  ✅ bieu thuc github.event trong run:      0 cho
  ✅ workflow dung pull_request_target      0 workflow
  ✅ action ghim vao mot NHANH              0 cho
  ⚠️  action CHUA ghim bang SHA              0 / 21 da ghim SHA
  ⚠️  workflow KHONG khai permissions:       1 / 11 da khai
  ⚠️  workflow KHONG dung environment:       0 / 11 co dung
  ℹ️  44 luot tham chieu secrets.*

  ket qua: 3 dat, 3 canh bao</div>

<p>Mấy con số ấy là những con số bài 6.4 đã lần ra bằng tay. Đẻ lại chúng trong chưa tới một giây mới là điểm chính — một cuộc soát bạn chạy MỘT lần là một bức ảnh chụp, còn một cuộc soát bạn chạy ở mọi thay đổi là một BIỆN PHÁP KIỂM SOÁT.</p>

<h3>Các phép kiểm, và mỗi lệnh grep thật ra hỏi gì</h3>
<pre><code><span class="tok-comment"># 1. bieu thuc SU KIEN noi suy thang vao run:  — bay o bai 3.1</span>
grep -h -A40 '^\\s*run:' \$W/*.yml | grep -c '\${{ *github\\.event\\.'

<span class="tok-comment"># 2. pull_request_target — bay o bai 1.4</span>
grep -l 'pull_request_target' \$W/*.yml | wc -l

<span class="tok-comment"># 3. action ghim vao mot NHANH — bai 4.2</span>
grep -h -o 'uses: *[^ ]*@\\(main\\|master\\|develop\\)\$' \$W/*.yml | wc -l

<span class="tok-comment"># 4. ti le ghim SHA — bai 4.2</span>
tong=\$(grep -h -o 'uses: *[^ ]*@[^ ]*'          \$W/*.yml | wc -l)
sha=\$( grep -h -o 'uses: *[^ ]*@[0-9a-f]\\{40\\}' \$W/*.yml | wc -l)

<span class="tok-comment"># 5 va 6. permissions: va environment: — bai 6.2</span>
grep -l '^permissions:'       \$W/*.yml | wc -l
grep -l '^\\s*environment:'    \$W/*.yml | wc -l</code></pre>

<div class="callout">
<p><strong>Phép kiểm 1 là phép duy nhất GẦN ĐÚNG, và đáng biết vì sao.</strong> Nó lấy bốn mươi dòng sau mỗi <code>run:</code> rồi tìm một biểu thức sự kiện trong đó — thứ thỉnh thoảng sẽ vớ trúng một dòng thuộc về bước <em>KẾ TIẾP</em>, và sẽ bỏ sót một biểu thức sự kiện nằm quá bốn mươi dòng trong một script rất dài. Nó là một cái đầu báo khói, không phải một chứng minh. Bài 4.5 đã đo chuyện gì xảy ra khi một cửa sổ như thế bị tin quá xa: một cửa sổ mười sáu dòng báo có chín bản chép khác nhau ở chỗ chỉ có hai.</p>
</div>

<h3>Lỗi trong chính script, tìm ra nhờ nó BẤT ĐỒNG với phép đếm tay</h3>
<p>Bản đầu tiên báo <strong>35</strong> lượt tham chiếu bí mật. Chương 6 đã đếm tay ra <strong>44</strong>. Một trong hai đã sai:</p>

<div class="out">grep -c  (so DONG):   35
grep -o  (so LAN):    44
chenh:                 9

dong gay ra chenh lech:
  "\${{ secrets.VPS_HOST }}" "\${{ secrets.VPS_USER }}" > ~/.ssh/config</div>

<div class="callout warn">
<p><strong><code>grep -c</code> đếm số <em>DÒNG</em> khớp, không đếm số lần khớp.</strong> Cái dòng <code>printf</code> ấy có HAI bí mật trên nó, và nó xuất hiện ở đúng chín workflow — chín bản chép của khối SSH đã đo ở bài 4.5. Nên chênh lệch ấy không phải tiếng ồn; nó là 9 × 1, và con số nó lệch đi chỉ thẳng vào cái chỗ trùng lặp mà một chương khác đã tìm ra. Vá bằng <code>grep -o … | wc -l</code>, và hai phép đếm giờ đã khớp.</p>
</div>

<div class="callout ok">
<p><strong>Lý do kể lại chuyện này thay vì lặng lẽ sửa:</strong> cái script ấy TIN ĐƯỢC. Nó đẻ ra đầu ra hợp lý, nó khớp với cuộc soát tay ở sáu trên bảy hàng, và không có gì ở <code>grep -c</code> trông sai cả. Thứ duy nhất bắt được nó là việc đã đếm CÙNG một đại lượng bằng một cách khác từ trước và để ý thấy hai kết quả không khớp. Đó mới là kỹ thuật tổng quát — không phải "hãy kiểm lại script của bạn", thứ chẳng ai làm, mà là "hãy đo một thứ HAI LẦN bằng HAI CÁCH", thứ vừa rẻ vừa hỏng một cách ỒN ÀO.</p>
</div>

<h3>Chạy nó ở đâu</h3>
<div class="kv-grid">
<div class="kv"><span class="k">trước một PR có đụng <code>.github/</code></span><span class="v">khoảnh khắc rẻ nhất. Diff thì nhỏ và người đọc nó đang có sẵn ngữ cảnh</span></div>
<div class="kv"><span class="k">dưới dạng một workflow, chạy khi <code>pull_request</code></span><span class="v">không cần bí mật, không cần quyền — <code>permissions: {}</code> là đủ, theo bài 6.2. Nó đọc những tệp vốn đã được checkout</span></div>
<div class="kv"><span class="k">ĐỪNG làm ô kiểm chặn, ít nhất là lúc đầu</span><span class="v">ba hàng vàng ở ngày đầu tiên nghĩa là một ô kiểm bắt buộc hỏng ở MỌI PR. Hãy chạy nó dạng thông tin — kèm tên bước nói rõ điều đó, đúng như kho này làm với các bước lint ở bài 2.4 — cho tới khi mấy hàng vàng được dọn</span></div>
<div class="kv"><span class="k">chạy KÈM các công cụ thật</span><span class="v">đây là một script dạy học bốn mươi dòng. <code>actionlint</code> bắt lỗi cú pháp và lỗi biểu thức, <code>zizmor</code> và OpenSSF Scorecard bắt nhiều khuôn mẫu bảo mật hơn sáu lệnh grep. Hãy dùng chúng; và vẫn cứ viết cái này, bởi viết nó là cách bạn HIỂU chúng đang kiểm cái gì</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — một phép kiểm KHÔNG THỂ hỏng.</strong> Kết cục nhiều khả năng nhất cho một script như thế này là nó được thêm vào, mọi thứ xanh vì mấy lệnh grep chẳng khớp gì cả, và không ai để ý rằng một chữ gõ sai trong một cái mẫu đã khiến nó về mặt cấu trúc KHÔNG THỂ tìm ra vấn đề nào. Trước khi tin nó, hãy CỐ Ý làm hỏng một thứ: thêm <code>pull_request_target</code> vào một tệp nháp, chạy script, xác nhận nó chuyển vàng, rồi bỏ đi. Một phép kiểm bạn chưa bao giờ thấy nó HỎNG là một phép kiểm bạn chưa kiểm thử.</p>
</div>

<h3>Nó CỐ Ý không kiểm những gì</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một bí mật có bị BIẾN ĐỔI rồi in ra không</span><span class="lz-lnote">ca <code>base64 -d</code> của bài 6.1. Phát hiện nó đòi phải biết một giá trị TRỞ THÀNH cái gì, mà grep thì không làm được</span></div>
<div class="lz-layer"><span class="lz-lname">quyền token mặc định của kho là gì</span><span class="lz-lnote">một THIẾT LẬP của kho, không phải một tệp. Hãy kiểm ở Settings → Actions, một lần</span></div>
<div class="lz-layer"><span class="lz-lname">một action có đáng tin không</span><span class="lz-lnote">ghim cho bạn biết mã sẽ KHÔNG ĐỔI; nó không nói gì về việc cái mã đã ghim có TỐT hay không</span></div>
<div class="lz-layer"><span class="lz-lname">ai có quyền ghi</span><span class="lz-lnote">hàng ba của bài 6.4, và là hàng mà không công cụ Actions nào chạm tới. Đó là câu hỏi về branch protection và review</span></div>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Sáu lệnh grep tái tạo lại cuộc soát mà cả một chương mới lập luận ra, khiến cuộc soát ấy LẶP LẠI ĐƯỢC — và cái lỗi trong sáu lệnh grep ấy được tìm ra không phải nhờ đi review chúng mà nhờ đã đếm một con số HAI LẦN rồi để ý thấy hai đáp án lệch nhau đúng chín.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">rhysd/actionlint</span><span class="lc-sub">github.com/rhysd/actionlint — một bộ kiểm tĩnh thật cho tệp workflow: kiểm kiểu biểu thức, tính khả dụng của context, chạy shellcheck trên các khối <code>run:</code>. Nó bắt được lớp lỗi mà Chương 3 đã đo, một cách TĨNH.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">zizmor — bộ lint bảo mật cho GitHub Actions</span><span class="lc-sub">woodruffw.github.io/zizmor — soát injection vào khuôn, dùng sai <code>pull_request_target</code>, action chưa ghim, và quyền quá rộng. Bản công cụ hoá của script trong bài này.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OpenSSF Scorecard — Token-Permissions và Pinned-Dependencies</span><span class="lc-sub">github.com/ossf/scorecard/blob/main/docs/checks.md — định nghĩa đứng sau hai hàng vàng bên trên, và cách cả hệ sinh thái chấm điểm cho chúng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">grep(1) — -c với -o</span><span class="lc-sub">man 1 grep — <code>-c</code> được ghi rõ là in ra số DÒNG khớp. Cái lỗi bên trên được giải thích trọn vẹn bởi đúng một từ ấy trong trang man.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — đếm cho đúng, và cái bẫy -c</span><span class="lc-sub">/courses/linux-bash/learn${REF} — dòng với lần khớp với tệp, và vì sao ba con số ấy tách nhau ra đúng ở bộ dữ liệu mà bạn quan tâm.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — kiểm bộ kiểm trước khi tin nó</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — kỹ thuật cố-ý-làm-hỏng ở cái bẫy bên trên, áp lên các phép kiểm sức khoẻ và smoke test.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.6 ─────────────────────────── */
    {
      title: '6.6 — Chapter 6 quiz|||6.6 — Kiểm tra Chương 6',
      slug: 'ga-6-6-kiem-tra',
      type: 'QUIZ',
      description: 'Tám câu: che bí mật chỉ phủ chuỗi đã lưu, GITHUB_TOKEN khoá trong một kho, `permissions:` khai một phạm vi là đưa phần còn lại về không, và ba nhân vật của bề mặt tấn công.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>What Chapter 6 measured</h2>
<p class="lead">Eight questions, twelve minutes. The chapter&#39;s central demonstration is that masking is an exact-string search — proved by showing the base64 and decoded forms of one key share zero nine-character substrings.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">6.1 — masking</span><span class="lz-lnote">covers the stored string only; every transformation of a secret escapes it. 8 secrets, 44 references, 27 of them straight into <code>run:</code></span></div>
<div class="lz-layer"><span class="lz-lname">6.2 — the token</span><span class="lz-lnote">scoped to one repository; <code>permissions:</code> declared in 1 of 11; the desktop release needs a PAT because it publishes to a different repository</span></div>
<div class="lz-layer"><span class="lz-lname">6.3 — OIDC</span><span class="lz-lnote">0 of 11 workflows use it; 2 of 8 secrets are non-expiring credentials, and one of them opens the production server</span></div>
<div class="lz-layer"><span class="lz-lname">6.4 — the surface</span><span class="lz-lnote">three actors, four ways a stranger becomes an insider, and a scorecard: four green, three amber, no red</span></div>
<div class="lz-layer"><span class="lz-lname">6.5 — the audit script</span><span class="lz-lnote">six greps reproduce the chapter — and a <code>grep -c</code> bug in them was caught only by counting the same number twice</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Chương 6 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Phần chứng minh trung tâm của chương là việc che bí mật là một phép TÌM CHUỖI CHÍNH XÁC — chứng minh bằng cách cho thấy bản base64 và bản đã giải mã của một cái khoá không chung một chuỗi con chín ký tự nào.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">6.1 — che bí mật</span><span class="lz-lnote">chỉ phủ chuỗi đã lưu; mọi phép biến đổi một bí mật đều thoát khỏi nó. 8 bí mật, 44 lượt tham chiếu, 27 trong số đó vào thẳng <code>run:</code></span></div>
<div class="lz-layer"><span class="lz-lname">6.2 — cái token</span><span class="lz-lnote">khoanh vào MỘT kho; <code>permissions:</code> khai ở 1 trên 11; bản phát hành desktop cần một PAT vì nó công bố sang một kho KHÁC</span></div>
<div class="lz-layer"><span class="lz-lname">6.3 — OIDC</span><span class="lz-lnote">0 trên 11 workflow dùng nó; 2 trên 8 bí mật là thông tin đăng nhập không hết hạn, và một trong hai mở được máy chủ production</span></div>
<div class="lz-layer"><span class="lz-lname">6.4 — bề mặt</span><span class="lz-lnote">ba nhân vật, bốn cách một người lạ thành người trong, và một bảng điểm: bốn xanh, ba vàng, không đỏ</span></div>
<div class="lz-layer"><span class="lz-lname">6.5 — script soát</span><span class="lz-lnote">sáu lệnh grep tái tạo cả chương — và một lỗi <code>grep -c</code> trong đó chỉ bị bắt nhờ đếm cùng một con số HAI LẦN</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A repository stores an SSH key base64-encoded and decodes it in a step. A later step runs `cat ~/.ssh/deploy_key`. What appears in the log?|||Một kho lưu khoá SSH dạng base64 rồi giải mã trong một bước. Một bước sau chạy `cat ~/.ssh/deploy_key`. Log hiện ra gì?',
            options: [
              'The private key in plain text — GitHub masks the stored base64 string, and the decoded form shares zero nine-character substrings with it|||Khoá riêng tư dưới dạng chữ thường — GitHub che chuỗi base64 ĐÃ LƯU, còn bản đã giải mã không chung với nó một chuỗi con chín ký tự nào',
              '*** — masking follows the value through any transformation|||*** — việc che bám theo giá trị qua mọi phép biến đổi',
              'Nothing — GitHub blocks steps that read files written from secrets|||Không gì — GitHub chặn những bước đọc tệp được ghi ra từ bí mật',
              '*** only if the step also declares the secret in its env: block|||*** chỉ khi bước ấy cũng khai bí mật trong khối env: của nó',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which of these values is NOT automatically masked?|||Giá trị nào trong số này KHÔNG được che tự động?',
            options: [
              'A token you build by concatenating two secrets — GitHub has never seen the combined string, so register it with ::add-mask::|||Một token bạn dựng bằng cách ghép hai bí mật — GitHub chưa bao giờ thấy chuỗi gộp ấy, nên hãy đăng ký nó bằng ::add-mask::',
              'A secret appearing inside a longer log line|||Một bí mật xuất hiện bên trong một dòng log dài hơn',
              'A secret interpolated into a run: block, shown in the log group header|||Một bí mật nội suy vào một khối run:, hiện ở tiêu đề nhóm của log',
              'A secret passed to an action through with:|||Một bí mật truyền cho một action qua with:',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The desktop release workflow uses a PAT instead of GITHUB_TOKEN. Why is that the correct choice here?|||Workflow phát hành desktop dùng một PAT thay vì GITHUB_TOKEN. Vì sao đó là lựa chọn ĐÚNG ở đây?',
            options: [
              'It publishes to a different repository, and GITHUB_TOKEN is scoped to the repository running the workflow at any permission level|||Nó công bố sang một kho KHÁC, mà GITHUB_TOKEN bị khoanh vào cái kho đang chạy workflow ở mọi mức quyền',
              'GITHUB_TOKEN cannot create releases at all|||GITHUB_TOKEN hoàn toàn không tạo được bản phát hành',
              'A PAT is required whenever a workflow uploads files|||Một PAT là bắt buộc mỗi khi một workflow tải tệp lên',
              'Because the workflow is workflow_dispatch rather than push-triggered|||Vì workflow ấy là workflow_dispatch chứ không phải kích hoạt theo push',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A workflow adds `permissions: { packages: write }`. What happens to the other scopes?|||Một workflow thêm `permissions: { packages: write }`. Chuyện gì xảy ra với các phạm vi khác?',
            options: [
              'They all become none — naming any scope zeroes every unnamed one, which is why adding the block can silently break a step that needed issues: write|||Tất cả thành none — nêu tên bất kỳ phạm vi nào cũng đưa mọi phạm vi không nêu về không, và đó là lý do thêm khối ấy có thể âm thầm làm vỡ một bước vốn cần issues: write',
              'They keep the repository default, and only packages is raised|||Chúng giữ nguyên mặc định của kho, chỉ mỗi packages được nâng',
              'They all become write, since declaring permissions opts into the permissive set|||Tất cả thành write, vì khai permissions là chọn vào tập rộng rãi',
              'Nothing — permissions at workflow level are advisory until set per job|||Không gì — permissions ở mức workflow chỉ mang tính khuyến nghị cho tới khi đặt theo từng job',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A workflow uses OIDC but the job fails with a cloud credentials error. What is the most likely cause?|||Một workflow dùng OIDC nhưng job hỏng với một lỗi thông tin đăng nhập phía đám mây. Nguyên nhân khả dĩ nhất là gì?',
            options: [
              'Missing `id-token: write` in permissions — without it the job cannot request a token at all, and the failure surfaces on the provider side|||Thiếu `id-token: write` trong permissions — không có nó thì job hoàn toàn không xin được token, và cú hỏng lộ ra ở phía nhà cung cấp',
              'The role ARN is wrong; OIDC does not use permissions|||ARN của vai trò sai; OIDC không dùng tới permissions',
              'OIDC requires a stored secret as well, which was not set|||OIDC còn đòi một bí mật đã lưu nữa, mà nó chưa được đặt',
              'The runner must be self-hosted for OIDC to work|||Runner phải là loại tự vận hành thì OIDC mới chạy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'An OIDC trust policy matches `sub: repo:org/name:*`. What does that accept?|||Một chính sách tin cậy OIDC khớp `sub: repo:org/name:*`. Nó chấp nhận những gì?',
            options: [
              'A token from any branch of that repository, including one a contributor just pushed — the narrow form pins the ref or the environment|||Một token từ BẤT KỲ nhánh nào của kho ấy, kể cả nhánh một người đóng góp vừa đẩy lên — bản hẹp thì ghim ref hoặc environment',
              'Only the default branch, since * excludes non-default refs|||Chỉ nhánh mặc định, vì * loại trừ các ref không mặc định',
              'Only workflows that declare an environment:|||Chỉ những workflow có khai environment:',
              'Nothing — a wildcard sub is rejected by every provider|||Không gì — một sub có ký tự đại diện bị mọi nhà cung cấp từ chối',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Of the three actors in the attack-surface map, which one does no Actions setting constrain?|||Trong ba nhân vật của bản đồ bề mặt tấn công, nhân vật nào mà KHÔNG thiết lập Actions nào ràng buộc được?',
            options: [
              'Someone with write access — masking, permissions and environments all assume the workflow author is trusted, so this is a review and branch-protection question|||Một người có quyền ghi — che bí mật, quyền và environment đều giả định tác giả workflow là đáng tin, nên đây là câu hỏi về review và branch protection',
              'A stranger opening a fork PR|||Một người lạ mở PR từ fork',
              'A third-party action|||Một action của bên thứ ba',
              'All three are constrained by the permissions: block|||Cả ba đều bị khối permissions: ràng buộc',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The audit script reported 35 secret references where a hand count gave 44. What was wrong, and how was it found?|||Script soát báo 35 lượt tham chiếu bí mật trong khi đếm tay ra 44. Cái gì sai, và tìm ra bằng cách nào?',
            options: [
              '`grep -c` counts matching lines, not matches — nine workflows have two secrets on one line. It was found by having measured the same number twice by different methods|||`grep -c` đếm số DÒNG khớp, không đếm số lần khớp — chín workflow có hai bí mật trên cùng một dòng. Tìm ra nhờ đã đo cùng một con số hai lần bằng hai cách khác nhau',
              'The hand count was wrong; 35 is correct|||Phép đếm tay sai; 35 mới đúng',
              'The script skipped one workflow file because of a glob typo|||Script bỏ sót một tệp workflow vì gõ sai mẫu glob',
              'Nine secrets were masked and therefore invisible to grep|||Chín bí mật bị che nên grep không thấy',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
