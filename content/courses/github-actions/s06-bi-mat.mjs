import { gallery, slide } from './_slides.mjs';

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

    /* ─────────────────────────── 6.0 ─────────────────────────── */
    {
      title: '6.0 — Chapter 6 slides: secrets, permissions and tokens in pictures|||6.0 — Slide Chương 6: bí mật, quyền và token bằng hình',
      slug: 'ga-6-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 30 slide của Chương 6: che *** phủ tới đâu (đo bằng secret giả), add-mask nhiều dòng, khối GITHUB_TOKEN Permissions với 6 cách khai, 403 khi thiếu quyền, OIDC và claim sub thật, environment có người duyệt, và zizmor trên api-backend — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Slides</span>
<h2>The whole chapter in 30 slides</h2>
<p class="lead">Skim these before the lessons to get the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: where the three stars of masking come from and where they stop, the four layers that decide what <code>GITHUB_TOKEN</code> may do, the 403 you get when a scope is missing, a real OIDC token taken apart claim by claim, a job waiting at an environment gate, and a security scanner reading this course&#39;s own workflows.</p>
<p>Slides 3–8 belong to Lesson 6.1, 9–13 to 6.2, 14–18 to 6.3, 19–23 to 6.4 and 24–27 to 6.5. The last three are the chapter&#39;s common mistakes, a cheat sheet, and a 60-minute practice session. Every new log on the slides is real: recorded on 24 September 2026 on GitHub-hosted <code>ubuntu-24.04</code> and <code>macos-15</code> runners (runner 2.337.0) in the public sandbox repository <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, branch <code>ch06-bi-mat</code>. Every secret used there was a <strong>fake</strong> value such as <code>gia-tri-thu-khong-that-123</code>, deleted after the measurements. The OIDC slides show only decoded claims, never a token. The api-backend figures come from read-only commands: the audit script, zizmor 1.30.1 offline, and one settings API call.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Slide</span>
<h2>Cả chương trong 30 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để nắm hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại bên trong bài giảng giải thích nó: ba dấu sao của việc che tới từ đâu và dừng ở đâu, bốn lớp quyết định <code>GITHUB_TOKEN</code> được làm gì, cái 403 bạn nhận khi thiếu một quyền, một token OIDC thật được tháo từng claim, một job đứng chờ ở cổng environment, và một công cụ quét bảo mật đọc chính các workflow của khoá học.</p>
<p>Slide 3–8 thuộc Bài 6.1, 9–13 thuộc 6.2, 14–18 thuộc 6.3, 19–23 thuộc 6.4 và 24–27 thuộc 6.5. Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 60 phút. Mọi log mới trên slide là THẬT: ghi ngày 24/09/2026 trên runner <code>ubuntu-24.04</code> và <code>macos-15</code> của GitHub (runner 2.337.0), trong kho sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, nhánh <code>ch06-bi-mat</code>. Mọi secret dùng ở đó đều là giá trị <strong>GIẢ</strong> như <code>gia-tri-thu-khong-that-123</code>, đã xoá sau khi đo. Các slide OIDC chỉ in claims đã giải mã, không bao giờ in token. Số liệu của api-backend lấy từ lệnh chỉ đọc: script soát, zizmor 1.30.1 offline, và một lệnh API đọc cài đặt.</p>
</div>
${gallery('ga-06', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Che *** là bộ lọc trên LOG'], [4, 'Thứ runner biết thì bị che'], [5, 'Biến đổi nào bị che, biến đổi nào lọt'],
  [6, 'add-mask nhiều dòng: chỉ dòng đầu'], [7, 'Secret ngắn, secret vắng mặt, output bị bỏ'], [8, 'Rò rồi thì xoay'],
  [9, 'Token mỗi job, quyền qua 4 lớp'], [10, 'GITHUB_TOKEN Permissions: 6 cách khai'], [11, '403 not accessible by integration'],
  [12, 'Khối job thay thế khối workflow'], [13, 'Ba loại token'],
  [14, 'OIDC bốn bước'], [15, 'Claims thật của token OIDC'], [16, 'Giải phẫu claim sub'],
  [17, 'Chính sách tin cậy hẹp bằng sub'], [18, 'Thiếu id-token: write'],
  [19, 'Ba nhân vật, ba ranh giới'], [20, 'environment là cổng'], [21, 'Secret của environment'],
  [22, 'Mỗi mối nguy một lớp chặn'], [23, 'Chấm lại api-backend 24/09/2026'],
  [24, 'Script soát trên Linux và macOS'], [25, 'Phép thử làm hỏng'], [26, 'zizmor trên api-backend'], [27, 'Ba công cụ, ba độ sâu'],
  [28, 'Sai lầm hay gặp'], [29, 'Bảng tra nhanh'], [30, 'Thực hành chương 6'],
])}
`,
    },

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
  VPS_SSH_PRIVATE_KEY_B64: &#36;{{ secrets.VPS_SSH_PRIVATE_KEY }}
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
${slide('ga-06', 3, 'Masking is a filter on the log stream: files, artifacts, network requests and job outputs are outside it')}
<p>Picture where the three stars are produced. When a job starts, the runner is handed every secret the job references and <em>registers</em> each value — plus a few encodings of it — with a component called the secret masker. Every line your steps write to stdout or stderr passes through that masker on its way to the log, and any registered string is replaced by <code>***</code>. That is the whole mechanism. It never looks at the file you wrote, the artifact you uploaded, or the request you sent: those bytes never pass through the log stream at all.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">exact matches in log output</span><span class="lz-lnote">including inside a longer line. This is the main protection and it works</span></div>
<div class="lz-layer"><span class="lz-lname">the rendered script in the log group header</span><span class="lz-lnote">so a secret interpolated into <code>run:</code> shows as <code>***</code> rather than its value — which is why the 27 direct interpolations in this repository are not a log-leak problem</span></div>
<div class="lz-layer"><span class="lz-lname">common encodings, added in later runner versions</span><span class="lz-lnote">the runner registers some derived forms of a secret automatically. Do not rely on which ones: the set is not documented as a contract, and base64 of a multi-line value is not reliably among them</span></div>
<div class="lz-layer"><span class="lz-lname">NOT: anything you compute</span><span class="lz-lnote">a token you build by concatenating two secrets, a signature you derive, a decoded key. Register these yourself with <code>::add-mask::</code> if they must exist in a step that prints anything</span></div>
<div class="lz-layer"><span class="lz-lname">NOT: anything outside the log</span><span class="lz-lnote">a secret written to a file, uploaded in an artifact, or sent over the network is simply gone. Masking is a log feature, not a containment boundary</span></div>
</div>

<h3><code>::add-mask::</code>, for values you create</h3>
${slide('ga-06', 6, 'add-mask on a multi-line value registers only the first line, and prints the rest')}
<p>The one-command form — the <code>echo "::add-mask::$KHOA"</code> in the original example further down this section — is correct for a one-line value. For a multi-line value — a PEM key, a certificate, a kubeconfig — it is wrong in a way the sandbox measured. A workflow command is one line long, so <code>echo "::add-mask::$KHOA"</code> with a four-line value registers line one and writes lines two to four to the log as ordinary output, in clear, <em>in the very step that was meant to hide them</em>. Printing the value afterwards shows <code>***</code> for the first line and the key material for the rest. Masking line by line fixes it completely: all four lines become <code>***</code>.</p>
<pre><code><span class="tok-comment"># correct for any value, one line or many</span>
while IFS= read -r dong; do
  [ -n "$dong" ] &amp;&amp; echo "::add-mask::$dong"
done &lt;&lt;&lt; "$KHOA"</code></pre>
<p>In a JavaScript action the equivalent is <code>core.setSecret(value)</code> from <code>@actions/core</code>, which registers the value without printing a workflow command line at all.</p>

<pre><code>- name: Tinh ra mot gia tri phai duoc che
  run: |
    KHOA=\$(echo "\$B64" | base64 -d)
    echo "::add-mask::\$KHOA"      <span class="tok-comment"># dang ky voi runner TRUOC khi dung</span>
    <span class="tok-comment"># tu day tro di, moi lan KHOA xuat hien trong log deu thanh ***</span>
  env:
    B64: &#36;{{ secrets.VPS_SSH_PRIVATE_KEY }}</code></pre>

<div class="pitfall">
<p><strong>Trap — <code>add-mask</code> only protects output printed <em>after</em> it runs.</strong> Registering a mask does not retroactively scrub earlier lines, and it does not survive into another job. So the order matters: compute, mask, then use. And a value masked in one job is unmasked in the next unless that job registers it again — which is a reason to derive secrets where they are used rather than passing derived values between jobs.</p>
</div>

<h3>Measured on the sandbox: what a step does to a secret, and what the log shows</h3>
<p>Everything above can be checked in two minutes with a <strong>fake</strong> value, and it should be — the documentation says outright that redaction "is not guaranteed" because there are too many ways to transform a value. The sandbox repository got a secret <code>CH06_GIA</code> with the value <code>gia-tri-thu-khong-that-123</code> ("a test value, not real"), and one workflow did the ordinary things a real workflow does with a secret. Run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295872" target="_blank" rel="noopener">36006295872</a>, 24/09/2026, runner 2.337.0.</p>
${slide('ga-06', 4, 'Anything the runner registered is masked, even in the middle of a longer line and in the expanded script header')}
<p>The first two steps are the reassuring half. The value printed through an environment variable becomes <code>***</code>; embedded in <code>truoc-&#36;{S}-sau</code> it becomes <code>truoc-***-sau</code>, so masking is a substring replacement, not a whole-line match. And a secret interpolated straight into <code>run:</code> shows as <code>***</code> in the step&#39;s group header, which prints the script <em>after</em> expressions are expanded. That is why 27 direct interpolations of the owner&#39;s own secrets in this repository never leaked into a log.</p>
${slide('ga-06', 5, 'Nine things a step can do with a secret, measured with a fake value: which get masked, which leak')}
<p>The table is the part worth memorising, because it has a pattern:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">masked: the value itself, and its plain base64</span><span class="lz-lnote">the runner registers a handful of encodings of every secret. <code>printf %s "$S" | base64</code> came out as <code>***</code>. So did each line of a multi-line secret, even printed on its own, and a JWT-shaped string that was never a secret at all — GitHub also redacts some well-known token formats by pattern</span></div>
<div class="lz-layer"><span class="lz-lname">partly masked: base64 of something that CONTAINS the secret</span><span class="lz-lnote">the classic Basic-auth header, <code>base64("thu:" + secret)</code>, printed as <code>dGh1Omdp***</code>. The masker knows base64 fragments of the secret at different alignments, so most of it is hidden — but the first characters (which decode to <code>thu:gi</code>) are visible. "Mostly" is not a property you can build on</span></div>
<div class="lz-layer"><span class="lz-lname">leaked: every other transformation</span><span class="lz-lnote">the first eight characters, the upper-case form, a character substitution, one field pulled out of a JSON secret with <code>jq</code>, and the decoded form of a base64-stored key. None of them is the stored string, so none of them is masked</span></div>
</div>
<div class="callout warn">
<p><strong>The "debug the first few characters" habit is the realistic leak.</strong> Nobody deliberately upper-cases a password in CI. People do write <code>echo "token starts with &#36;{TOKEN:0:8}"</code> to check which token was loaded — and eight characters of a 26-character value are a quarter of it. If you need to tell two secrets apart in a log, print a <em>fingerprint</em> instead: <code>printf %s "$TOKEN" | sha256sum | cut -c1-8</code> is stable, comparable across runs, and — for a long random token — reveals nothing usable. (A short password is a different story: eight hex characters of its hash can be brute-forced, so do not fingerprint those in a public log.)</p>
</div>
<div class="callout">
<p><strong>Structured secrets fail twice.</strong> The whole JSON blob was masked, but the <code>pass</code> field extracted from it was printed in clear, because <code>mat-khau-gia-khong-that-789</code> was never registered on its own. GitHub&#39;s own guidance is not to store JSON, XML or YAML as one secret: create one secret per sensitive value, so each value is what gets registered.</p>
</div>

<h3>The other thing masking does that surprises people</h3>
${slide('ga-06', 7, 'A short secret shreds the log; a missing secret is an empty string; a job output carrying a secret is dropped')}
<p>Three more behaviours from the same run, each of which someone eventually files as a bug:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">short secret</span><span class="lz-t"><code>8080</code> masks everywhere</span><span class="lz-d">a secret holding a port number turned <code>18080</code> into <code>1***</code>, <code>80801</code> into <code>***1</code>, and — the surprising one — the <em>step name</em> "Bi mat NGAN (8080)" into "Bi mat NGAN (***)". Masking has no idea what a word is; it replaces bytes. A port, a region name or <code>true</code> is configuration, not a secret: store it as a variable (<code>vars.PORT</code>), which is never masked</span></div>
<div class="lz-step"><span class="lz-k">missing secret</span><span class="lz-t">an empty string, silently</span><span class="lz-d"><code>&#36;{{ secrets.KHONG_HE_CO }}</code>, a secret that was never created, evaluated to <code>""</code> with no error and no warning. A typo in a secret name therefore looks exactly like a deploy that "sometimes cannot authenticate". Guard it on the first line: <code>: "&#36;{K:?secret K is not set}"</code> fails the step with that message</span></div>
<div class="lz-step"><span class="lz-k">job output</span><span class="lz-t">dropped, with a warning</span><span class="lz-d">a step wrote the secret to <code>$GITHUB_OUTPUT</code> and the job declared it as an output. At "Complete job" the runner printed <code>Skip output &#39;bi-mat-ra-ngoai&#39; since it may contain secret.</code> and the next job received an empty string. The runner refuses to carry a registered value across the job boundary in plain text — pass the <em>name</em> of the secret instead, and let the next job read it from <code>secrets.*</code> itself</span></div>
</div>

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

<h3>Where a secret lives, and when the runner reads it</h3>
<p>Secrets exist at three levels, and the level decides which jobs can see them. Limits are from the GitHub secrets reference (as of 09/2026).</p>
<table>
<thead><tr><th>Level</th><th>Who sees it</th><th>Read when</th><th>Limit</th></tr></thead>
<tbody>
<tr><td>Organization</td><td>repositories the org policy allows</td><td>when the run is queued</td><td>1,000 per org; a workflow sees the first 100 alphabetically</td></tr>
<tr><td>Repository</td><td>every workflow in the repository (not fork PRs)</td><td>when the run is queued</td><td>100 per repository</td></tr>
<tr><td>Environment</td><td>only jobs that declare <code>environment:</code> with that name</td><td>when the job <em>starts</em> — after any required approval</td><td>100 per environment</td></tr>
</tbody>
</table>
<p>Each secret is at most 48 KB. When the same name exists at several levels, the most specific wins: environment over repository over organization — Lesson 6.4 measures that on the sandbox. Names are case-insensitive, stored upper-case, cannot start with <code>GITHUB_</code> and cannot start with a digit.</p>
<div class="callout">
<p><strong>Secret or variable?</strong> The <code>vars</code> context (Settings → Secrets and variables → Actions → Variables) holds configuration that is not sensitive: hostnames, regions, feature flags, the port above. Variables are shown in the log in clear, which is exactly what you want when debugging, and they do not shred the log the way a short secret does. The test is simple: if this value appeared in a public log tomorrow, would you have to change it? Yes means secret; no means variable.</p>
</div>

<h3>When a secret has leaked: the order of operations</h3>
${slide('ga-06', 8, 'Masking is a log feature; derived values are not covered; structured secrets fail; a suspected leak is a leak — rotate')}
<ol>
<li><strong>Rotate first.</strong> Generate a new credential at the source (the cloud console, the server&#39;s <code>authorized_keys</code>, the token settings page), update the secret, and revoke the old one. Until the old one is revoked, deleting logs changes nothing — someone may already have the value.</li>
<li><strong>Then remove the evidence.</strong> A run&#39;s logs can be deleted from its page ("Delete all logs") or with <code>gh api -X DELETE repos/OWNER/REPO/actions/runs/RUN_ID/logs</code>; <code>gh run delete RUN_ID</code> removes the whole run. Check artifacts from the same run too — they are separate objects.</li>
<li><strong>Then find how it happened.</strong> Search the workflow for the transformation that produced an unmasked value (<code>base64 -d</code>, <code>jq</code>, a substring, <code>set -x</code>, a verbose flag like <code>curl -v</code> or <code>ssh -vvv</code>), and either remove it or register the derived value with <code>::add-mask::</code>.</li>
</ol>
<div class="pitfall">
<p><strong>Trap — <code>set -x</code> in a step that uses a derived secret.</strong> Shell tracing prints every command after expansion. Values the runner registered are still masked in that trace, but a value you computed in the step — a decoded key, a signed URL, an extracted field — is printed in full, once per command that touches it. Turn tracing on only in steps that handle no credentials, or mask the derived value before the first traced line.</p>
</div>

<div class="callout">
<p><strong>Interview questions you are likely to get.</strong></p>
<p><strong>Q: GitHub masks secrets in logs. Is it safe to <code>echo</code> a secret for debugging?</strong><br>A: No. Masking is an exact-string replacement on the log stream. It catches the stored value and some encodings of it, but not a substring, a changed case, a field extracted from JSON, or a decoded value — I measured all of those leaking with a fake secret. And it does nothing for files, artifacts or network requests. If I need to confirm which secret was loaded, I print a short hash of it, not the value.</p>
<p><strong>Q: A secret is stored base64-encoded and decoded in a step. What do you do about masking?</strong><br>A: The decoded value was never registered, so I register it myself with <code>::add-mask::</code> — line by line, because a multi-line value passed to one <code>add-mask</code> command registers only the first line and prints the rest. Better still, I avoid the decode entirely if the tool can read the secret directly.</p>
<p><strong>Q: A secret appeared in a public log. What is your first action?</strong><br>A: Rotate it — revoke the old credential and issue a new one. Deleting the log comes second, because anyone who already read or downloaded the log still has the value.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> before you trust <code>***</code> in your own pipeline, you want to see with your own eyes where it stops working — using a value that does not matter.</p><ol>
<li>In a test repository, create a fake secret: <code>gh secret set THU_GIA -b 'gia-tri-thu-khong-that-123'</code>.</li>
<li>Add a workflow with one step that has <code>env: S: &#36;{{ secrets.THU_GIA }}</code> and prints: <code>$S</code>, <code>truoc-$S-sau</code>, <code>&#36;{S:0:8}</code>, <code>&#36;{S^^}</code> and <code>$(printf %s "$S" | base64)</code>. Push and open the log.</li>
<li>Add a second step that builds a two-line value (<code>V=$(printf 'dong-1-gia\\ndong-2-gia')</code>), runs <code>echo "::add-mask::$V"</code>, then <code>echo "$V"</code>. Look at what the <code>add-mask</code> line itself printed.</li>
<li>Replace it with the line-by-line loop from this lesson and run again.</li>
<li>Delete the secret afterwards: <code>gh secret delete THU_GIA</code>.</li></ol>
<p><strong>Done when:</strong> you have your own table of "masked / leaked" for the five forms (expect: masked, masked, leaked, leaked, masked); you saw the second line of the two-line value printed by the single <code>add-mask</code>; and after the loop both lines show as <code>***</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Secret (bí mật)</span><span class="v">An encrypted value stored at org, repository or environment level, readable in a job through <code>secrets.NAME</code>.</span></div>
  <div class="kv"><span class="k">Masking / redaction (che)</span><span class="v">The runner replacing registered strings with <code>***</code> in the log stream — and nowhere else.</span></div>
  <div class="kv"><span class="k"><code>::add-mask::</code></span><span class="v">Workflow command that registers a value you computed; applies to output printed <em>after</em> it, one line per command.</span></div>
  <div class="kv"><span class="k">Derived value (giá trị suy ra)</span><span class="v">Anything computed from a secret: decoded, sliced, parsed, re-cased. Not masked unless you register it.</span></div>
  <div class="kv"><span class="k">Structured secret</span><span class="v">JSON/YAML/XML stored as one secret — its fields are not registered separately. Split it.</span></div>
  <div class="kv"><span class="k">Variable (<code>vars</code>)</span><span class="v">Non-sensitive configuration, printed in clear. For ports, hosts, regions.</span></div>
  <div class="kv"><span class="k">Rotation (xoay khoá)</span><span class="v">Replacing a credential at its source and revoking the old one — the only real response to a leak.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Masking replaces registered strings in the <strong>log</strong>, even inside longer lines and in the expanded script header; files, artifacts, network requests are untouched.</li>
<li>Measured with a fake value: the value, its plain base64 and each line of a multi-line secret are masked; a prefix, upper-case, substitution, a JSON field and a decoded key leak.</li>
<li><code>::add-mask::</code> registers one line; mask multi-line values line by line, before first use.</li>
<li>A short secret masks every matching substring (even step names); a missing secret is a silent empty string; a job output carrying a secret is dropped.</li>
<li>Configuration goes in <code>vars</code>, one sensitive value per secret, and no JSON blobs.</li>
<li>A leak is answered by rotating first, deleting logs second.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Secrets reference</span><span class="lc-sub">docs.github.com/en/actions/reference/security/secrets — the three levels, the 100 / 100 / 1,000 limits, 48 KB per secret, precedence, when each level is read, and the list of token formats redacted automatically (JWTs among them).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox run 36006295872 — masking measured with fake secrets</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295872 — the nine transformations, the multi-line add-mask, the short secret and the dropped job output from this lesson.</span></span></div>

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
  VPS_SSH_PRIVATE_KEY_B64: &#36;{{ secrets.VPS_SSH_PRIVATE_KEY }}
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
${slide('ga-06', 3, 'Che là bộ lọc trên dòng LOG: tệp, artifact, request mạng và output của job nằm ngoài nó')}
<p>Hãy hình dung ba dấu sao được tạo ra ở đâu. Lúc job bắt đầu, runner (máy chạy) nhận mọi secret mà job tham chiếu tới và <em>ĐĂNG KÝ</em> từng giá trị — cộng vài dạng mã hoá của nó — với một bộ phận gọi là secret masker (bộ che bí mật). Mọi dòng mà các bước của bạn ghi ra stdout hay stderr đều đi qua bộ che ấy trên đường vào log, và chuỗi nào đã đăng ký sẽ bị thay bằng <code>***</code>. Toàn bộ cơ chế chỉ có vậy. Nó không bao giờ nhìn vào tệp bạn ghi, artifact (sản phẩm dựng) bạn tải lên, hay request bạn gửi đi: những byte ấy không hề đi qua dòng log.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">các chỗ khớp CHÍNH XÁC trong đầu ra log</span><span class="lz-lnote">kể cả nằm bên trong một dòng dài hơn. Đây là phần bảo vệ chính và nó hoạt động</span></div>
<div class="lz-layer"><span class="lz-lname">script đã nở trong tiêu đề nhóm của log</span><span class="lz-lnote">nên một bí mật nội suy vào <code>run:</code> hiện ra là <code>***</code> chứ không phải giá trị của nó — và đó là lý do 27 lượt nội suy trực tiếp ở kho này không phải một vấn đề rò log</span></div>
<div class="lz-layer"><span class="lz-lname">một số dạng mã hoá phổ biến, thêm ở các bản runner sau</span><span class="lz-lnote">runner tự đăng ký một vài dạng suy ra của một bí mật. Đừng dựa vào việc đó là những dạng nào: tập ấy không được ghi thành một cam kết, và base64 của một giá trị nhiều dòng thì không chắc nằm trong đó</span></div>
<div class="lz-layer"><span class="lz-lname">KHÔNG: bất cứ thứ gì bạn TÍNH RA</span><span class="lz-lnote">một token bạn dựng bằng cách ghép hai bí mật, một chữ ký bạn suy ra, một khoá đã giải mã. Hãy tự đăng ký chúng bằng <code>::add-mask::</code> nếu chúng buộc phải tồn tại trong một bước có in ra thứ gì</span></div>
<div class="lz-layer"><span class="lz-lname">KHÔNG: bất cứ thứ gì NGOÀI log</span><span class="lz-lnote">một bí mật ghi vào tệp, tải lên trong một artifact, hay gửi qua mạng thì đơn giản là đi mất. Che là một tính năng của LOG, không phải một ranh giới ngăn chặn</span></div>
</div>

<h3><code>::add-mask::</code>, cho những giá trị bạn tự tạo</h3>
${slide('ga-06', 6, 'add-mask một giá trị nhiều dòng chỉ đăng ký dòng ĐẦU, và in ra các dòng còn lại')}
<p>Dạng một lệnh — dòng <code>echo "::add-mask::$KHOA"</code> trong ví dụ gốc ở phía dưới mục này — đúng với giá trị MỘT dòng. Với giá trị nhiều dòng — khoá PEM, chứng chỉ, kubeconfig — nó sai theo một cách sân tập đã đo được. Một workflow command (lệnh điều khiển runner) chỉ dài một dòng, nên <code>echo "::add-mask::$KHOA"</code> với giá trị bốn dòng sẽ đăng ký dòng một, còn dòng hai tới bốn bị ghi ra log như output bình thường, rõ nguyên văn, <em>ngay trong chính bước vốn định giấu chúng</em>. In lại giá trị sau đó thì dòng đầu là <code>***</code>, các dòng sau là chất liệu khoá. Che TỪNG DÒNG thì sửa được trọn vẹn: cả bốn dòng thành <code>***</code>.</p>
<pre><code><span class="tok-comment"># dung cho moi gia tri, mot dong hay nhieu dong</span>
while IFS= read -r dong; do
  [ -n "$dong" ] &amp;&amp; echo "::add-mask::$dong"
done &lt;&lt;&lt; "$KHOA"</code></pre>
<p>Trong một action JavaScript, cách tương đương là <code>core.setSecret(value)</code> của <code>@actions/core</code> — nó đăng ký giá trị mà không in dòng workflow command nào ra cả.</p>

<pre><code>- name: Tinh ra mot gia tri phai duoc che
  run: |
    KHOA=\$(echo "\$B64" | base64 -d)
    echo "::add-mask::\$KHOA"      <span class="tok-comment"># dang ky voi runner TRUOC khi dung</span>
    <span class="tok-comment"># tu day tro di, moi lan KHOA xuat hien trong log deu thanh ***</span>
  env:
    B64: &#36;{{ secrets.VPS_SSH_PRIVATE_KEY }}</code></pre>

<div class="pitfall">
<p><strong>Bẫy — <code>add-mask</code> chỉ bảo vệ phần đầu ra in ra <em>SAU</em> khi nó chạy.</strong> Đăng ký một cái che KHÔNG quét ngược lại những dòng trước đó, và nó không sống sót sang một job khác. Nên THỨ TỰ có ý nghĩa: tính, che, rồi mới dùng. Và một giá trị được che ở job này thì ở job kế nó KHÔNG được che trừ khi job ấy đăng ký lại — đó là một lý do nên SUY RA bí mật ngay tại chỗ dùng thay vì truyền các giá trị đã suy ra giữa các job.</p>
</div>

<h3>Đo trên sân tập: bước làm gì với secret, và log hiện ra gì</h3>
<p>Mọi điều bên trên kiểm được trong hai phút bằng một giá trị <strong>GIẢ</strong>, và nên kiểm — chính tài liệu của GitHub nói thẳng rằng việc che "không được bảo đảm" vì có quá nhiều cách biến đổi một giá trị. Kho sân tập được tạo một secret <code>CH06_GIA</code> với giá trị <code>gia-tri-thu-khong-that-123</code>, và một workflow làm những việc bình thường mà workflow thật vẫn làm với secret. Run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295872" target="_blank" rel="noopener">36006295872</a>, 24/09/2026, runner 2.337.0.</p>
${slide('ga-06', 4, 'Thứ runner đã đăng ký thì bị che — kể cả giữa một dòng dài và trong tiêu đề script đã nở')}
<p>Hai bước đầu là nửa làm yên lòng. Giá trị in qua biến môi trường thành <code>***</code>; nằm giữa <code>truoc-&#36;{S}-sau</code> thì thành <code>truoc-***-sau</code> — tức là che thay CHUỖI CON, không phải so khớp cả dòng. Và một secret nội suy thẳng vào <code>run:</code> hiện ra là <code>***</code> trong tiêu đề nhóm của bước, nơi in script <em>SAU KHI</em> biểu thức đã nở. Đó là lý do 27 lượt nội suy trực tiếp secret của chủ kho ở kho này chưa từng rò vào log.</p>
${slide('ga-06', 5, 'Chín việc một bước có thể làm với secret, đo bằng giá trị giả: cái nào bị che, cái nào lọt')}
<p>Cái bảng là phần đáng thuộc, vì nó có QUY LUẬT:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">bị che: chính giá trị, và base64 trơn của nó</span><span class="lz-lnote">runner đăng ký thêm vài dạng mã hoá của mỗi secret. <code>printf %s "$S" | base64</code> ra <code>***</code>. Từng dòng của một secret nhiều dòng cũng vậy, kể cả khi in riêng một dòng, và cả một chuỗi có hình dạng JWT vốn chẳng phải secret — GitHub còn che một số định dạng token phổ biến theo MẪU</span></div>
<div class="lz-layer"><span class="lz-lname">che một phần: base64 của thứ CÓ CHỨA secret</span><span class="lz-lnote">header Basic auth kinh điển, <code>base64("thu:" + secret)</code>, in ra thành <code>dGh1Omdp***</code>. Bộ che biết các mảnh base64 của secret ở nhiều vị trí lệch, nên phần lớn bị giấu — nhưng mấy ký tự đầu (giải ra <code>thu:gi</code>) vẫn thấy. "Phần lớn" không phải tính chất để xây dựng lên trên</span></div>
<div class="lz-layer"><span class="lz-lname">lọt: mọi phép biến đổi còn lại</span><span class="lz-lnote">tám ký tự đầu, bản viết hoa, một phép thay ký tự, một trường rút ra khỏi secret JSON bằng <code>jq</code>, và bản đã giải mã của một khoá lưu dạng base64. Không cái nào là chuỗi đã lưu, nên không cái nào bị che</span></div>
</div>
<div class="callout warn">
<p><strong>Thói quen "in vài ký tự đầu để gỡ lỗi" mới là kiểu rò thực tế.</strong> Chẳng ai cố ý viết hoa mật khẩu trong CI. Nhưng người ta vẫn viết <code>echo "token bat dau bang &#36;{TOKEN:0:8}"</code> để xem token nào đã được nạp — và tám ký tự của một giá trị 26 ký tự là gần một phần ba của nó. Muốn phân biệt hai secret trong log thì in một <em>DẤU VÂN TAY</em>: <code>printf %s "$TOKEN" | sha256sum | cut -c1-8</code> ổn định, so được giữa các lần chạy, và — với một token dài ngẫu nhiên — không để lộ gì dùng được. (Mật khẩu ngắn thì khác: tám ký tự hex của mã băm có thể bị dò ngược, nên đừng in dấu vân tay của chúng ra log công khai.)</p>
</div>
<div class="callout">
<p><strong>Secret có cấu trúc hỏng HAI lần.</strong> Cả khối JSON thì bị che, nhưng trường <code>pass</code> rút ra từ nó lại in rõ, vì <code>mat-khau-gia-khong-that-789</code> chưa bao giờ được đăng ký riêng. Chính GitHub khuyên đừng lưu JSON, XML hay YAML thành một secret: mỗi giá trị nhạy cảm một secret, để thứ được đăng ký chính là từng giá trị.</p>
</div>

<h3>Thứ khác mà việc che làm và khiến người ta bất ngờ</h3>
${slide('ga-06', 7, 'Secret ngắn phá nát log; secret vắng mặt là chuỗi rỗng; output của job mang secret bị bỏ')}
<p>Thêm ba hành vi từ cùng run ấy, cái nào rồi cũng có người báo thành lỗi:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">secret ngắn</span><span class="lz-t"><code>8080</code> che khắp nơi</span><span class="lz-d">một secret chứa số cổng biến <code>18080</code> thành <code>1***</code>, <code>80801</code> thành <code>***1</code>, và — cái gây bất ngờ — biến cả <em>TÊN BƯỚC</em> "Bi mat NGAN (8080)" thành "Bi mat NGAN (***)". Bộ che không biết "từ" là gì; nó thay byte. Số cổng, tên vùng hay <code>true</code> là CẤU HÌNH, không phải bí mật: lưu thành variable (biến cấu hình, <code>vars.PORT</code>), thứ không bao giờ bị che</span></div>
<div class="lz-step"><span class="lz-k">secret vắng mặt</span><span class="lz-t">chuỗi rỗng, im lặng</span><span class="lz-d"><code>&#36;{{ secrets.KHONG_HE_CO }}</code>, một secret chưa từng được tạo, cho ra <code>""</code> mà không lỗi, không cảnh báo. Gõ sai tên secret vì thế trông y hệt một lần deploy "thỉnh thoảng không xác thực được". Chặn ngay dòng đầu: <code>: "&#36;{K:?chua dat secret K}"</code> làm bước đỏ với đúng lời nhắn đó</span></div>
<div class="lz-step"><span class="lz-k">output của job</span><span class="lz-t">bị bỏ, kèm cảnh báo</span><span class="lz-d">một bước ghi secret vào <code>$GITHUB_OUTPUT</code> và job khai nó thành output. Tới "Complete job", runner in <code>Skip output &#39;bi-mat-ra-ngoai&#39; since it may contain secret.</code> và job sau nhận chuỗi rỗng. Runner từ chối mang một giá trị đã đăng ký qua ranh giới job dưới dạng chữ thường — hãy truyền TÊN của secret, để job sau tự đọc từ <code>secrets.*</code></span></div>
</div>

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

<h3>Secret sống ở đâu, và runner đọc nó lúc nào</h3>
<p>Secret tồn tại ở ba cấp, và cấp quyết định job nào thấy được nó. Giới hạn lấy từ trang tham chiếu secrets của GitHub (tính đến 09/2026).</p>
<table>
<thead><tr><th>Cấp</th><th>Ai thấy</th><th>Đọc lúc nào</th><th>Giới hạn</th></tr></thead>
<tbody>
<tr><td>Tổ chức (organization)</td><td>các kho mà chính sách của tổ chức cho phép</td><td>khi run được xếp hàng</td><td>1.000 mỗi tổ chức; một workflow chỉ thấy 100 cái đầu theo ABC</td></tr>
<tr><td>Kho (repository)</td><td>mọi workflow trong kho (trừ PR từ fork)</td><td>khi run được xếp hàng</td><td>100 mỗi kho</td></tr>
<tr><td>Environment (môi trường triển khai)</td><td>chỉ job khai <code>environment:</code> đúng tên đó</td><td>khi job <em>BẮT ĐẦU</em> — sau khi được duyệt (nếu cần duyệt)</td><td>100 mỗi environment</td></tr>
</tbody>
</table>
<p>Mỗi secret tối đa 48 KB. Trùng tên ở nhiều cấp thì cấp cụ thể nhất thắng: environment thắng kho, kho thắng tổ chức — bài 6.4 đo chuyện này trên sân tập. Tên không phân biệt hoa thường, được lưu dạng viết hoa, không được bắt đầu bằng <code>GITHUB_</code> và không được bắt đầu bằng chữ số.</p>
<div class="callout">
<p><strong>Secret hay variable?</strong> Ngữ cảnh <code>vars</code> (Settings → Secrets and variables → Actions → Variables) chứa cấu hình KHÔNG nhạy cảm: tên máy chủ, vùng, cờ tính năng, con số cổng ở trên. Variable in rõ ra log — đúng thứ bạn cần khi gỡ lỗi — và không phá nát log như một secret ngắn. Phép thử đơn giản: nếu giá trị này xuất hiện trong một log công khai vào ngày mai, bạn có phải đổi nó không? Có thì là secret; không thì là variable.</p>
</div>

<h3>Khi một secret đã rò: làm theo thứ tự nào</h3>
${slide('ga-06', 8, 'Che là tính năng của log; giá trị suy ra không được che; secret có cấu trúc hỏng; nghi rò là đã rò — xoay')}
<ol>
<li><strong>XOAY trước.</strong> Tạo thông tin đăng nhập mới tại NGUỒN (console của cloud, <code>authorized_keys</code> trên máy chủ, trang cài đặt token), cập nhật secret, rồi thu hồi cái cũ. Chừng nào cái cũ chưa bị thu hồi, xoá log chẳng thay đổi gì — có thể đã có người cầm giá trị.</li>
<li><strong>Rồi mới xoá dấu vết.</strong> Log của một run xoá được trên trang run ("Delete all logs") hoặc bằng <code>gh api -X DELETE repos/OWNER/REPO/actions/runs/RUN_ID/logs</code>; <code>gh run delete RUN_ID</code> xoá cả run. Kiểm luôn artifact của run đó — chúng là đối tượng riêng.</li>
<li><strong>Rồi tìm xem vì sao.</strong> Lục workflow tìm phép biến đổi đã đẻ ra giá trị không được che (<code>base64 -d</code>, <code>jq</code>, cắt chuỗi, <code>set -x</code>, một cờ dài dòng như <code>curl -v</code> hay <code>ssh -vvv</code>), rồi bỏ nó đi hoặc đăng ký giá trị suy ra bằng <code>::add-mask::</code>.</li>
</ol>
<div class="pitfall">
<p><strong>Bẫy — <code>set -x</code> trong một bước dùng secret suy ra.</strong> Chế độ dò vết của shell in mọi lệnh SAU KHI đã nở biến. Giá trị runner đã đăng ký vẫn bị che trong vết ấy, nhưng giá trị bạn TÍNH trong bước — khoá đã giải mã, URL đã ký, trường đã rút ra — bị in đầy đủ, mỗi lệnh đụng tới nó một lần. Chỉ bật dò vết ở những bước không cầm thông tin đăng nhập, hoặc che giá trị suy ra trước dòng dò vết đầu tiên.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: GitHub che secret trong log. Vậy <code>echo</code> secret ra để gỡ lỗi có an toàn không?</strong><br>Đ: Không. Che là phép thay CHUỖI CHÍNH XÁC trên dòng log. Nó bắt giá trị đã lưu và vài dạng mã hoá của nó, nhưng không bắt chuỗi con, bản đổi hoa thường, một trường rút từ JSON hay giá trị đã giải mã — tôi đã đo tất cả những cái đó bị lọt bằng một secret giả. Và nó không làm gì với tệp, artifact hay request mạng. Cần xác nhận secret nào đã được nạp thì tôi in một đoạn mã băm ngắn của nó, không in giá trị.</p>
<p><strong>H: Một secret lưu dạng base64 và được giải mã trong một bước. Bạn xử lý việc che thế nào?</strong><br>Đ: Giá trị đã giải mã chưa bao giờ được đăng ký, nên tôi tự đăng ký bằng <code>::add-mask::</code> — TỪNG DÒNG, vì đưa một giá trị nhiều dòng cho một lệnh <code>add-mask</code> chỉ đăng ký dòng đầu và in phần còn lại ra. Tốt hơn nữa là bỏ hẳn bước giải mã nếu công cụ đọc thẳng được secret.</p>
<p><strong>H: Một secret xuất hiện trong log công khai. Việc đầu tiên bạn làm?</strong><br>Đ: Xoay nó — thu hồi thông tin đăng nhập cũ, cấp cái mới. Xoá log là việc thứ hai, vì ai đã đọc hoặc tải log về thì vẫn cầm giá trị.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trước khi tin <code>***</code> trong pipeline của chính mình, bạn muốn tận mắt thấy nó ngừng tác dụng ở đâu — bằng một giá trị chẳng quan trọng gì.</p><ol>
<li>Trong một kho thử, tạo một secret GIẢ: <code>gh secret set THU_GIA -b 'gia-tri-thu-khong-that-123'</code>.</li>
<li>Thêm một workflow có một bước với <code>env: S: &#36;{{ secrets.THU_GIA }}</code> và in: <code>$S</code>, <code>truoc-$S-sau</code>, <code>&#36;{S:0:8}</code>, <code>&#36;{S^^}</code> và <code>$(printf %s "$S" | base64)</code>. Push rồi mở log.</li>
<li>Thêm bước thứ hai dựng một giá trị hai dòng (<code>V=$(printf 'dong-1-gia\\ndong-2-gia')</code>), chạy <code>echo "::add-mask::$V"</code>, rồi <code>echo "$V"</code>. Nhìn xem chính dòng <code>add-mask</code> đã in ra gì.</li>
<li>Thay bằng vòng lặp từng dòng của bài này rồi chạy lại.</li>
<li>Dọn: <code>gh secret delete THU_GIA</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn có bảng "che / lọt" của riêng mình cho năm dạng (dự kiến: che, che, lọt, lọt, che); bạn thấy dòng thứ hai của giá trị hai dòng bị in ra bởi lệnh <code>add-mask</code> duy nhất; và sau vòng lặp cả hai dòng đều là <code>***</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Secret (bí mật)</span><span class="v">Giá trị mã hoá lưu ở cấp tổ chức, kho hoặc environment; job đọc qua <code>secrets.TEN</code>.</span></div>
  <div class="kv"><span class="k">Masking / redaction (che)</span><span class="v">Runner thay chuỗi đã đăng ký bằng <code>***</code> trên dòng log — và không ở đâu khác.</span></div>
  <div class="kv"><span class="k"><code>::add-mask::</code></span><span class="v">Lệnh đăng ký một giá trị bạn tự tính; áp cho output in ra <em>SAU</em> nó, mỗi lệnh một dòng.</span></div>
  <div class="kv"><span class="k">Giá trị suy ra (derived value)</span><span class="v">Bất cứ thứ gì tính từ secret: giải mã, cắt, parse, đổi hoa thường. Không được che nếu bạn không đăng ký.</span></div>
  <div class="kv"><span class="k">Secret có cấu trúc</span><span class="v">JSON/YAML/XML lưu thành một secret — các trường bên trong không được đăng ký riêng. Hãy tách ra.</span></div>
  <div class="kv"><span class="k">Variable (<code>vars</code>, biến cấu hình)</span><span class="v">Cấu hình không nhạy cảm, in rõ ra log. Dành cho cổng, máy chủ, vùng.</span></div>
  <div class="kv"><span class="k">Rotation (xoay khoá)</span><span class="v">Thay thông tin đăng nhập tại nguồn và thu hồi cái cũ — phản ứng thật duy nhất với một vụ rò.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Che thay chuỗi đã đăng ký trong <strong>LOG</strong>, kể cả giữa dòng dài và trong tiêu đề script đã nở; tệp, artifact, request mạng thì không đụng tới.</li>
<li>Đo bằng giá trị giả: giá trị, base64 trơn của nó và từng dòng của secret nhiều dòng bị che; tiền tố, bản viết hoa, phép thay ký tự, một trường JSON và khoá đã giải mã thì lọt.</li>
<li><code>::add-mask::</code> đăng ký một dòng; giá trị nhiều dòng phải che từng dòng, trước lần dùng đầu tiên.</li>
<li>Secret ngắn che mọi chuỗi con trùng (cả tên bước); secret vắng mặt là chuỗi rỗng im lặng; output của job mang secret bị bỏ.</li>
<li>Cấu hình để trong <code>vars</code>, mỗi giá trị nhạy cảm một secret, không lưu khối JSON.</li>
<li>Rò thì XOAY trước, xoá log sau.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Secrets reference</span><span class="lc-sub">docs.github.com/en/actions/reference/security/secrets — ba cấp secret, giới hạn 100 / 100 / 1.000, 48 KB mỗi secret, thứ tự ưu tiên, lúc mỗi cấp được đọc, và danh sách định dạng token được tự che (có JWT).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run 36006295872 trên sân tập — đo việc che bằng secret giả</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295872 — chín phép biến đổi, add-mask nhiều dòng, secret ngắn và output của job bị bỏ trong bài này.</span></span></div>

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
${slide('ga-06', 9, 'Each job gets a fresh token whose scopes come from four layers: repository default, workflow block, job block, fork downgrade')}
<p>It helps to know what the token physically is. When Actions is enabled, GitHub installs a GitHub App called "GitHub Actions" on the repository; before each job starts, it asks for an <strong>installation access token</strong> for that app, limited to this one repository and to the scopes computed for this job. The token dies when the job finishes, or at its maximum lifetime — six hours on GitHub-hosted runners, because that is the job time limit. The scopes are computed in a fixed order: the repository (or organisation) default, then the workflow-level <code>permissions:</code>, then the job-level one, and finally, for a pull request from a fork, every <code>write</code> is turned into <code>read</code>.</p>
${slide('ga-06', 10, 'The GITHUB_TOKEN Permissions block, measured with six ways of declaring it')}
<p>You never have to reason about those layers in your head, because the runner prints the result. Open any job&#39;s "Set up job" section and there is a group called <code>GITHUB_TOKEN Permissions</code>. On the sandbox (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295870" target="_blank" rel="noopener">36006295870</a>) it read, for five jobs that differ only in their <code>permissions:</code> line:</p>
<div class="out">(nothing declared)   Contents: read · Metadata: read · Packages: read
permissions: {}      Metadata: read
statuses: write      Metadata: read · Statuses: write
read-all             19 scopes, all read
write-all            17 write + Metadata, Models, VulnerabilityAlerts read</div>
<p>Three things follow. The sandbox repository, created in September 2026, has the <em>restricted</em> default — the docs say that is what a new personal repository gets. <code>Metadata: read</code> is always present and cannot be removed; it is what lets the token see the repository exists. And <code>write-all</code> grants scopes most people have never heard of (<code>Drives</code>, <code>CopilotRequests</code>, <code>Models</code>) — along with whatever GitHub adds next year. That is the concrete argument against it.</p>
<div class="callout">
<p><strong>Reading a repository&#39;s default without guessing.</strong> The setting is one API call away for anyone with admin access: <code>gh api repos/OWNER/REPO/actions/permissions/workflow</code> returns <code>{"default_workflow_permissions":"read","can_approve_pull_request_reviews":false}</code> for both the sandbox and this course&#39;s own api-backend repository (read-only call, 24/09/2026). The second field is the separate setting that stops workflows from approving pull requests — keep it <code>false</code>.</p>
</div>

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

<h3>Measured: what a missing scope looks like</h3>
${slide('ga-06', 11, 'A missing scope is an HTTP 403 “Resource not accessible by integration”; none does not stop reading public data')}
<p>The same run tried to do small, harmless writes with the token. Creating a commit status (the little check mark next to a commit) needs <code>statuses: write</code>:</p>
<div class="out">job mac-dinh  (default: contents, metadata, packages read)
  POST /repos/…/statuses/SHA  → gh: Resource not accessible by integration (HTTP 403)
  git push                    → remote: Permission to cuonghoang1103/ga-san-tap.git denied to github-actions[bot].
                                fatal: … The requested URL returned error: 403

job toi-thieu  (statuses: write only)
  POST /repos/…/statuses/SHA  → HTTP 201 · status id 54846750063 · ch06/toi-thieu
  POST to actions/checkout    → Resource not accessible by integration (HTTP 403)
  GET issues (issues: none)   → 1</div>
<p>Memorise the wording <em>"Resource not accessible by integration"</em>: "integration" is GitHub&#39;s old word for an app, and this message is how every missing scope of <code>GITHUB_TOKEN</code> announces itself. It is a loud failure, which is good — the dangerous version is the action that catches the 403, logs it at debug level and carries on green.</p>
<p>The last line is the surprise. With <code>issues: none</code>, reading the issue list still worked, and a job with <code>permissions: {}</code> still checked the code out. A scope set to <code>none</code> removes <em>write</em> access and access to <em>private</em> data; it does not make the token less able than an anonymous visitor, and on a public repository an anonymous visitor can read the code and the issues. On a private repository the same <code>permissions: {}</code> job is expected to fail at checkout, since reading private contents is exactly what <code>contents: read</code> grants (not measured here — the sandbox is public).</p>

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
${slide('ga-06', 13, 'Three kinds of token: pick the shortest-lived one that can do the job')}
<p>A GitHub App token deserves more than one line, because it is the grown-up answer to the cross-repository case. You create an app once (Settings → Developer settings → GitHub Apps), give it exactly the repository permissions it needs, and install it only on the repositories it should touch. In the workflow, <code>actions/create-github-app-token</code> exchanges the app&#39;s ID and private key for an installation token that lives one hour and is scoped to those installations. The private key is still a stored secret — but it cannot be used as a login, it is not tied to a person who might leave, and every action taken with it is attributed to the app in the audit log.</p>
<div class="kv-grid">
<div class="kv"><span class="k">trigger other workflows?</span><span class="v">events caused by <code>GITHUB_TOKEN</code> do not start new runs (except <code>workflow_dispatch</code> and <code>repository_dispatch</code>), which prevents loops. A pull request opened by <code>GITHUB_TOKEN</code> now starts its CI in an <em>approval-required</em> state. An app token or a PAT triggers workflows normally — which is why release bots often use one</span></div>
<div class="kv"><span class="k">fine-grained PAT</span><span class="v">if you must use a PAT: fine-grained, one repository, the minimum permissions, an expiry date (it is mandatory). The classic <code>repo</code> scope is every repository you can reach</span></div>
</div>

<div class="kv-grid">
<div class="kv"><span class="k">it does not expire with the job</span><span class="v">unlike <code>GITHUB_TOKEN</code>, which is dead the moment the job ends. A leaked PAT is valid until somebody revokes it</span></div>
<div class="kv"><span class="k">it carries a person&#39;s access</span><span class="v">a classic PAT is scoped to <em>scopes</em>, not to repositories — <code>repo</code> means every repository that person can reach. A fine-grained PAT fixes this and is worth the extra setup</span></div>
<div class="kv"><span class="k">it needs rotating</span><span class="v">and nothing reminds you. A PAT with no expiry is a credential nobody will think about again until it is in an incident report</span></div>
<div class="kv"><span class="k">the better option where available</span><span class="v">a GitHub App installation token: scoped per repository, short-lived, and revocable without affecting a human&#39;s access. More setup, and the right answer for anything long-lived</span></div>
</div>

<h3>Reducing the default token, in practice</h3>
${slide('ga-06', 12, 'A job-level permissions block replaces the workflow-level one; measured 201 versus 403')}
<p>The first layer below says the job block <em>replaces</em> the workflow block. This is the one people get wrong most often, so the sandbox measured it (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295911" target="_blank" rel="noopener">36006295911</a>): the workflow declares <code>contents: read</code> and <code>statuses: write</code>; job <code>ke-thua</code> declares nothing and creates a status (HTTP 201); job <code>thay-the</code> declares only <code>issues: read</code> — intending to <em>add</em> one scope — and its Set up job shows <code>Issues: read, Metadata: read</code>, nothing else. Its status call is a 403.</p>

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
<p><em>Update, 24/09/2026:</em> Lesson 6.4 now measures an environment on the sandbox — a job waiting for approval, a branch rule that rejects a job before any runner starts, and an environment secret that only reaches the job that names it.</p>

<div class="out">environment: khai o  0 / 11 workflow</div>

<p>An <code>environment:</code> attaches a named set of secrets and, optionally, a <strong>required reviewer</strong> — a job that will not start until a human approves it in the UI. For a repository whose deploy workflows are all <code>workflow_dispatch</code>, the human gate already exists in the form of somebody pressing the button, which is presumably why none were added.</p>

<div class="callout ok">
<p><strong>That reasoning holds only while the trigger stays manual.</strong> The moment any deploy workflow gains a <code>push:</code> or <code>schedule:</code> trigger — which Chapter 9 argues is a tempting change — the approval step disappears and nothing replaces it. An <code>environment:</code> with a reviewer is the mechanism that survives that change, and adding one costs a line.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> <code>GITHUB_TOKEN</code> is short-lived, automatic, and locked to one repository — so <code>permissions:</code> is how you shrink it, an <code>environment:</code> is how you gate it, and a PAT is what you reach for only when you genuinely need to cross the repository boundary.</p>
</div>

<h3>A method for finding the minimum, instead of guessing it</h3>
<p>"Least privilege" is easy to say and awkward to do, because nobody knows by heart which scope <code>gh release create</code> needs. The method that works:</p>
<ol>
<li>Put <code>permissions: contents: read</code> at the top of the workflow. Every job now starts from the minimum.</li>
<li>Run it. For every step that fails with <em>Resource not accessible by integration</em>, find the API it called (the error usually includes the documentation URL — <code>docs.github.com/rest/commits/statuses#create-a-commit-status</code> in the run above) and look up the scope in the table "Permissions required for GitHub Apps".</li>
<li>Add that scope to <strong>that job only</strong>, listing <code>contents: read</code> again because the job block replaces the workflow block.</li>
<li>Read the <code>GITHUB_TOKEN Permissions</code> block of each job once and compare it with what you meant.</li>
</ol>
<div class="callout warn">
<p><strong>The quiet failure to watch for.</strong> Some actions treat a 403 as "nothing to do" — a commenting bot that cannot comment, a labeller that cannot label — and the job stays green. After tightening permissions, search the log for <code>403</code> and <code>not accessible</code> even when everything is green. This is the one change where "it still passes" is weak evidence, as the trap above says.</p>
</div>
<p>Applied to api-backend&#39;s <code>ci-lint.yml</code> (install, type-check, test, no writes), the answer is a single line — <code>permissions: contents: read</code> — and because the repository default is already <code>read</code>, adding it changes nothing today. What it buys is that the workflow stays minimal if someone later flips the repository default to permissive: the file, not a setting page, decides.</p>

<div class="callout">
<p><strong>Interview questions you are likely to get.</strong></p>
<p><strong>Q: What is <code>GITHUB_TOKEN</code>, and how long does it live?</strong><br>A: An installation access token of the GitHub Actions app, created for each job, limited to the repository that runs the workflow. It expires when the job ends, at most six hours on GitHub-hosted runners (24 hours of refresh on self-hosted). Its scopes come from the repository default, then the workflow and job <code>permissions:</code> blocks, with writes turned into reads for fork PRs. I check the result in the "GITHUB_TOKEN Permissions" section of Set up job.</p>
<p><strong>Q: A job has <code>permissions: issues: write</code> and its checkout fails on a private repository. Why?</strong><br>A: Naming any scope sets every other scope to <code>none</code>, including <code>contents</code>. The job needs <code>contents: read</code> listed as well. And if the workflow level had <code>contents: read</code>, it does not help: a job block replaces the workflow block instead of adding to it.</p>
<p><strong>Q: When do you need a PAT instead of <code>GITHUB_TOKEN</code>?</strong><br>A: When the job must act on another repository, or must trigger another workflow through an event. Even then I would prefer a GitHub App installation token — per-repository, one-hour lifetime, not tied to a person — and if it has to be a PAT, a fine-grained one with an expiry.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your team wants every workflow to declare <code>permissions:</code>. You want proof of what changes before you open that pull request.</p><ol>
<li>In a test repository, run <code>gh api repos/OWNER/REPO/actions/permissions/workflow</code> and write down the default.</li>
<li>Add a workflow with two jobs, no <code>permissions:</code> anywhere. Each job runs <code>gh api -X POST repos/&#36;{{ github.repository }}/statuses/&#36;{{ github.sha }} -f state=success -f context=thu</code> with <code>GH_TOKEN: &#36;{{ github.token }}</code>. Push and read both Set up job sections.</li>
<li>Add <code>permissions: contents: read</code> at the top and <code>permissions: { statuses: write }</code> on the second job only. Push again.</li>
<li>Change the second job to <code>permissions: { issues: read }</code>. Push once more.</li></ol>
<p><strong>Done when:</strong> you can show three runs where the status call is 403 → 201 (job 2 with <code>statuses: write</code>) → 403 (job 2 with <code>issues: read</code>), and for each job you copied the <code>GITHUB_TOKEN Permissions</code> lines that explain the result.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>GITHUB_TOKEN</code></span><span class="v">Per-job installation token of the GitHub Actions app; one repository, dies with the job.</span></div>
  <div class="kv"><span class="k">Scope (phạm vi quyền)</span><span class="v">One named permission — <code>contents</code>, <code>issues</code>, <code>statuses</code>… — at <code>read</code>, <code>write</code> or <code>none</code>.</span></div>
  <div class="kv"><span class="k">Restricted / permissive default</span><span class="v">Repository setting: read on contents and packages only, or read-write on everything.</span></div>
  <div class="kv"><span class="k"><code>permissions: {}</code></span><span class="v">No scopes except the unremovable <code>Metadata: read</code>.</span></div>
  <div class="kv"><span class="k">“Resource not accessible by integration”</span><span class="v">The HTTP 403 message a missing scope produces.</span></div>
  <div class="kv"><span class="k">PAT (personal access token)</span><span class="v">A token acting as a person; classic = every repository they reach, fine-grained = chosen repositories, mandatory expiry.</span></div>
  <div class="kv"><span class="k">GitHub App token</span><span class="v">Installation token of your own app: chosen repositories, one-hour life, attributed to the app.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>GITHUB_TOKEN</code> is an installation token minted per job for one repository, expiring with the job (≤ 6 h on hosted runners).</li>
<li>Its scopes = repository default → workflow block → job block (replaces, never adds) → fork downgrade. Read the result in Set up job.</li>
<li>Naming one scope sets the rest to <code>none</code>; <code>Metadata: read</code> always stays; <code>write-all</code> grants scopes you have not heard of.</li>
<li>A missing scope is a loud 403 "Resource not accessible by integration" — but some actions swallow it; grep the log after tightening.</li>
<li><code>none</code> blocks writes and private reads; public data stays readable, so public checkout works with <code>{}</code>.</li>
<li>Cross-repository work needs another credential: prefer a GitHub App token, then a fine-grained PAT, never a classic one.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox runs 36006295870 and 36006295911 — scopes, 403 and replacement</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295870 — the GITHUB_TOKEN Permissions block for six declarations and the 403/201 pair; …/runs/36006295911 — a job block replacing the workflow block.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/create-github-app-token</span><span class="lc-sub">github.com/actions/create-github-app-token — the official action that turns a GitHub App ID and private key into a one-hour installation token for cross-repository work.</span></span></div>

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
${slide('ga-06', 9, 'Mỗi job một token mới; quyền đến từ bốn lớp: mặc định của kho, khối workflow, khối job, hạ cấp cho fork')}
<p>Biết cái token VỀ VẬT LÝ là gì sẽ đỡ rất nhiều. Khi bật Actions, GitHub cài một GitHub App tên "GitHub Actions" vào kho; trước mỗi job, nó xin cho app ấy một <strong>installation access token</strong> (token cài đặt), khoanh vào đúng kho này và đúng các quyền đã tính cho job này. Token chết khi job xong, hoặc khi chạm tuổi thọ tối đa — sáu giờ trên runner của GitHub, vì đó là trần thời gian của một job. Quyền được tính theo thứ tự cố định: mặc định của kho (hoặc tổ chức), rồi khối <code>permissions:</code> mức workflow, rồi mức job, và cuối cùng, với pull request từ fork, mọi <code>write</code> bị hạ thành <code>read</code>.</p>
${slide('ga-06', 10, 'Khối GITHUB_TOKEN Permissions, đo thật với sáu cách khai')}
<p>Bạn không bao giờ phải tự tính mấy lớp ấy trong đầu, vì runner in sẵn KẾT QUẢ. Mở mục "Set up job" của bất kỳ job nào sẽ thấy một nhóm tên <code>GITHUB_TOKEN Permissions</code>. Trên sân tập (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295870" target="_blank" rel="noopener">36006295870</a>), năm job chỉ khác nhau đúng dòng <code>permissions:</code> in ra:</p>
<div class="out">(khong khai gi)      Contents: read · Metadata: read · Packages: read
permissions: {}      Metadata: read
statuses: write      Metadata: read · Statuses: write
read-all             19 quyen, tat ca read
write-all            17 write + Metadata, Models, VulnerabilityAlerts read</div>
<p>Rút ra ba điều. Kho sân tập, tạo tháng 9/2026, có mặc định <em>restricted</em> (hạn chế) — docs nói đó là thứ một kho cá nhân mới nhận được. <code>Metadata: read</code> luôn có và không bỏ được; nhờ nó token mới "thấy" kho tồn tại. Và <code>write-all</code> cấp cả những quyền hầu hết mọi người chưa nghe tên (<code>Drives</code>, <code>CopilotRequests</code>, <code>Models</code>) — cùng mọi quyền GitHub thêm vào năm sau. Đó là lý lẽ CỤ THỂ để không dùng nó.</p>
<div class="callout">
<p><strong>Đọc mặc định của một kho mà không phải đoán.</strong> Thiết lập ấy chỉ cách một lệnh API với người có quyền admin: <code>gh api repos/OWNER/REPO/actions/permissions/workflow</code> trả về <code>{"default_workflow_permissions":"read","can_approve_pull_request_reviews":false}</code> cho cả sân tập lẫn kho api-backend của chính khoá học (lệnh chỉ đọc, 24/09/2026). Trường thứ hai là thiết lập riêng, chặn workflow tự DUYỆT pull request — cứ để <code>false</code>.</p>
</div>

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

<h3>Đo thật: thiếu một quyền trông ra sao</h3>
${slide('ga-06', 11, 'Thiếu quyền là HTTP 403 “Resource not accessible by integration”; none không chặn đọc dữ liệu công khai')}
<p>Cùng run ấy thử làm vài việc GHI nhỏ, vô hại bằng token. Tạo một commit status (dấu tích nhỏ cạnh commit) cần <code>statuses: write</code>:</p>
<div class="out">job mac-dinh  (mac dinh: contents, metadata, packages read)
  POST /repos/…/statuses/SHA  → gh: Resource not accessible by integration (HTTP 403)
  git push                    → remote: Permission to cuonghoang1103/ga-san-tap.git denied to github-actions[bot].
                                fatal: … The requested URL returned error: 403

job toi-thieu  (chi statuses: write)
  POST /repos/…/statuses/SHA  → HTTP 201 · status id 54846750063 · ch06/toi-thieu
  POST sang actions/checkout  → Resource not accessible by integration (HTTP 403)
  GET issues (issues: none)   → 1</div>
<p>Thuộc lòng câu <em>"Resource not accessible by integration"</em>: "integration" là tên cũ GitHub gọi một app, và đây là cách MỌI quyền thiếu của <code>GITHUB_TOKEN</code> tự báo danh. Nó hỏng ỒN ÀO, và thế là tốt — phiên bản nguy hiểm là action nuốt cái 403, ghi nó ở mức debug rồi tiếp tục xanh.</p>
<p>Dòng cuối mới là bất ngờ. Với <code>issues: none</code>, đọc danh sách issue vẫn được, và một job <code>permissions: {}</code> vẫn checkout được mã. Đặt một quyền thành <code>none</code> là bỏ quyền GHI và quyền đọc dữ liệu RIÊNG TƯ; nó không làm token kém hơn một khách vô danh, mà với kho công khai thì khách vô danh vẫn đọc được mã và issue. Với kho riêng tư, cùng job <code>permissions: {}</code> ấy được dự đoán là hỏng ngay ở checkout, vì đọc nội dung riêng tư chính là thứ <code>contents: read</code> cấp (chưa đo ở đây — sân tập là kho công khai).</p>

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
${slide('ga-06', 13, 'Ba loại token: chọn cái sống ngắn nhất làm được việc')}
<p>Token của GitHub App đáng hơn một dòng, vì nó là câu trả lời "người lớn" cho ca liên kho. Bạn tạo một app một lần (Settings → Developer settings → GitHub Apps), cấp đúng những quyền kho nó cần, và chỉ cài nó vào những kho nó được đụng tới. Trong workflow, <code>actions/create-github-app-token</code> đổi ID và khoá riêng của app lấy một installation token sống một giờ, khoanh vào đúng các bản cài ấy. Khoá riêng của app vẫn là một secret phải lưu — nhưng nó không dùng để đăng nhập như một người được, không gắn với một con người có thể nghỉ việc, và mọi việc làm bằng nó được ghi tên APP trong nhật ký kiểm toán.</p>
<div class="kv-grid">
<div class="kv"><span class="k">có kích hoạt workflow khác không?</span><span class="v">sự kiện do <code>GITHUB_TOKEN</code> gây ra không tạo run mới (trừ <code>workflow_dispatch</code> và <code>repository_dispatch</code>) — để chống vòng lặp. Pull request do <code>GITHUB_TOKEN</code> mở giờ khởi động CI ở trạng thái <em>chờ duyệt</em>. Token app hay PAT thì kích hoạt bình thường — lý do bot phát hành hay dùng chúng</span></div>
<div class="kv"><span class="k">PAT fine-grained</span><span class="v">nếu buộc phải dùng PAT: loại fine-grained, một kho, quyền tối thiểu, có ngày hết hạn (bắt buộc). Phạm vi <code>repo</code> của PAT classic là MỌI kho bạn với tới</span></div>
</div>

<div class="kv-grid">
<div class="kv"><span class="k">nó KHÔNG hết hạn theo job</span><span class="v">khác <code>GITHUB_TOKEN</code>, thứ chết ngay khoảnh khắc job kết thúc. Một PAT bị rò thì còn hiệu lực cho tới khi có người thu hồi</span></div>
<div class="kv"><span class="k">nó mang theo quyền CỦA MỘT NGƯỜI</span><span class="v">một PAT cổ điển được khoanh theo <em>PHẠM VI</em>, không theo kho — <code>repo</code> nghĩa là MỌI kho người ấy với tới được. PAT chi-tiết vá được chuyện này và đáng bỏ thêm công thiết lập</span></div>
<div class="kv"><span class="k">nó cần được XOAY</span><span class="v">và chẳng có gì nhắc bạn. Một PAT không đặt hạn là một thông tin đăng nhập mà không ai nghĩ tới nữa cho tới khi nó nằm trong một bản báo cáo sự cố</span></div>
<div class="kv"><span class="k">lựa chọn tốt hơn khi có</span><span class="v">một token cài đặt của GitHub App: khoanh theo từng kho, sống ngắn, và thu hồi được mà không đụng tới quyền của một con người. Thiết lập nhiều hơn, và là đáp án đúng cho bất cứ thứ gì tồn tại lâu dài</span></div>
</div>

<h3>Thu nhỏ token mặc định, trong thực tế</h3>
${slide('ga-06', 12, 'Khối permissions: mức job THAY THẾ khối mức workflow; đo được 201 và 403')}
<p>Lớp đầu tiên của khối bên dưới nói khối job <em>THAY THẾ</em> khối workflow. Đây là chỗ người ta sai nhiều nhất, nên sân tập đã đo (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295911" target="_blank" rel="noopener">36006295911</a>): workflow khai <code>contents: read</code> và <code>statuses: write</code>; job <code>ke-thua</code> không khai gì và tạo status được (HTTP 201); job <code>thay-the</code> chỉ khai <code>issues: read</code> — với ý định <em>THÊM</em> một quyền — và Set up job của nó in <code>Issues: read, Metadata: read</code>, không gì khác. Lời gọi status của nó ăn 403.</p>

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
<p><em>Cập nhật 24/09/2026:</em> bài 6.4 giờ đo một environment thật trên sân tập — một job đứng chờ duyệt, một luật nhánh từ chối job trước cả khi có runner, và một secret của environment chỉ tới job gọi tên nó.</p>

<div class="out">environment: khai o  0 / 11 workflow</div>

<p>Một <code>environment:</code> gắn theo một tập bí mật có tên và, tuỳ chọn, một <strong>người duyệt bắt buộc</strong> — một job sẽ không khởi động cho tới khi một con người phê duyệt nó trên giao diện. Với một kho mà mọi workflow deploy đều là <code>workflow_dispatch</code>, cái cổng con-người vốn đã tồn tại dưới dạng một người bấm nút, và có lẽ đó là lý do không cái nào được thêm.</p>

<div class="callout ok">
<p><strong>Lý lẽ ấy chỉ đứng vững CHỪNG NÀO kích hoạt còn là thủ công.</strong> Ngay khoảnh khắc một workflow deploy nào đó có thêm kích hoạt <code>push:</code> hay <code>schedule:</code> — thứ mà Chương 9 lập luận là một thay đổi đầy cám dỗ — thì bước phê duyệt biến mất và không có gì thay thế. Một <code>environment:</code> kèm người duyệt là cơ chế SỐNG SÓT được qua thay đổi ấy, và thêm nó tốn một dòng.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>GITHUB_TOKEN</code> sống ngắn, tự động, và bị khoá vào một kho — nên <code>permissions:</code> là cách bạn THU NHỎ nó, một <code>environment:</code> là cách bạn ĐẶT CỔNG cho nó, và một PAT là thứ bạn với tay tới CHỈ khi bạn thật sự cần vượt ranh giới kho.</p>
</div>

<h3>Một cách TÌM ra mức tối thiểu, thay vì đoán</h3>
<p>"Quyền tối thiểu" nói thì dễ mà làm thì vướng, vì chẳng ai thuộc lòng <code>gh release create</code> cần quyền gì. Cách làm được việc:</p>
<ol>
<li>Đặt <code>permissions: contents: read</code> ở đầu workflow. Mọi job giờ bắt đầu từ mức thấp nhất.</li>
<li>Chạy. Với mỗi bước hỏng kèm <em>Resource not accessible by integration</em>, tìm API nó đã gọi (lỗi thường kèm URL tài liệu — <code>docs.github.com/rest/commits/statuses#create-a-commit-status</code> ở run bên trên) rồi tra quyền trong bảng "Permissions required for GitHub Apps".</li>
<li>Thêm quyền đó cho <strong>ĐÚNG job ấy</strong>, và liệt kê lại <code>contents: read</code> vì khối job thay thế khối workflow.</li>
<li>Đọc khối <code>GITHUB_TOKEN Permissions</code> của từng job một lần và so với ý định của bạn.</li>
</ol>
<div class="callout warn">
<p><strong>Kiểu hỏng lặng lẽ cần canh.</strong> Có action coi 403 là "chẳng có gì để làm" — bot bình luận không bình luận được, bot gắn nhãn không gắn được — và job vẫn xanh. Sau khi siết quyền, hãy tìm <code>403</code> và <code>not accessible</code> trong log ngay cả khi mọi thứ đều xanh. Đây là thay đổi duy nhất mà "nó vẫn qua" là bằng chứng YẾU, đúng như cái bẫy phía trên.</p>
</div>
<p>Áp vào <code>ci-lint.yml</code> của api-backend (cài, kiểm kiểu, chạy test, không ghi gì), đáp án là đúng một dòng — <code>permissions: contents: read</code> — và vì mặc định của kho vốn đã là <code>read</code>, thêm nó hôm nay không đổi gì. Thứ nó mua được là workflow vẫn tối thiểu nếu mai kia ai đó chuyển mặc định của kho sang permissive: TỆP quyết định, không phải một trang cài đặt.</p>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: <code>GITHUB_TOKEN</code> là gì, sống bao lâu?</strong><br>Đ: Là installation access token của app GitHub Actions, tạo riêng cho từng job, khoanh vào kho đang chạy workflow. Nó hết hạn khi job xong, tối đa sáu giờ trên runner của GitHub (self-hosted thì làm mới được tới 24 giờ). Quyền của nó đi từ mặc định của kho, qua khối <code>permissions:</code> mức workflow rồi mức job, và bị hạ write thành read với PR từ fork. Tôi kiểm kết quả ở mục "GITHUB_TOKEN Permissions" trong Set up job.</p>
<p><strong>H: Một job có <code>permissions: issues: write</code> và bước checkout hỏng trên kho riêng tư. Vì sao?</strong><br>Đ: Nêu tên bất kỳ quyền nào là mọi quyền khác về <code>none</code>, kể cả <code>contents</code>. Job cần liệt kê thêm <code>contents: read</code>. Và nếu mức workflow đã có <code>contents: read</code> thì cũng không cứu được: khối job THAY THẾ khối workflow chứ không cộng thêm.</p>
<p><strong>H: Khi nào cần PAT thay cho <code>GITHUB_TOKEN</code>?</strong><br>Đ: Khi job phải tác động lên một kho KHÁC, hoặc phải kích hoạt workflow khác qua một sự kiện. Ngay cả khi đó tôi vẫn ưu tiên token của GitHub App — theo từng kho, sống một giờ, không gắn với một người — và nếu buộc là PAT thì loại fine-grained có hạn dùng.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm bạn muốn mọi workflow đều khai <code>permissions:</code>. Bạn muốn có bằng chứng thứ gì thay đổi trước khi mở pull request ấy.</p><ol>
<li>Trong một kho thử, chạy <code>gh api repos/OWNER/REPO/actions/permissions/workflow</code> và ghi lại mặc định.</li>
<li>Thêm một workflow có hai job, không có <code>permissions:</code> ở đâu cả. Mỗi job chạy <code>gh api -X POST repos/&#36;{{ github.repository }}/statuses/&#36;{{ github.sha }} -f state=success -f context=thu</code> với <code>GH_TOKEN: &#36;{{ github.token }}</code>. Push và đọc cả hai mục Set up job.</li>
<li>Thêm <code>permissions: contents: read</code> ở đầu tệp và <code>permissions: { statuses: write }</code> CHỈ ở job thứ hai. Push lần nữa.</li>
<li>Đổi job thứ hai thành <code>permissions: { issues: read }</code>. Push thêm lần nữa.</li></ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được ba run mà lời gọi status là 403 → 201 (job 2 với <code>statuses: write</code>) → 403 (job 2 với <code>issues: read</code>), và với mỗi job bạn đã chép các dòng <code>GITHUB_TOKEN Permissions</code> giải thích kết quả.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>GITHUB_TOKEN</code></span><span class="v">Token cài đặt của app GitHub Actions, cấp riêng mỗi job; một kho, chết cùng job.</span></div>
  <div class="kv"><span class="k">Scope (phạm vi quyền)</span><span class="v">Một quyền có tên — <code>contents</code>, <code>issues</code>, <code>statuses</code>… — ở mức <code>read</code>, <code>write</code> hoặc <code>none</code>.</span></div>
  <div class="kv"><span class="k">Mặc định restricted / permissive</span><span class="v">Thiết lập của kho: chỉ đọc contents và packages, hoặc đọc-ghi mọi thứ.</span></div>
  <div class="kv"><span class="k"><code>permissions: {}</code></span><span class="v">Không quyền nào ngoài <code>Metadata: read</code> không bỏ được.</span></div>
  <div class="kv"><span class="k">“Resource not accessible by integration”</span><span class="v">Thông điệp HTTP 403 khi thiếu một quyền.</span></div>
  <div class="kv"><span class="k">PAT (token cá nhân)</span><span class="v">Token nhân danh một người; classic = mọi kho người đó với tới, fine-grained = kho chọn, bắt buộc có hạn.</span></div>
  <div class="kv"><span class="k">Token GitHub App</span><span class="v">Token cài đặt của app riêng: kho chọn, sống một giờ, ghi tên app trong nhật ký.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>GITHUB_TOKEN</code> là installation token đúc riêng cho mỗi job, một kho, hết hạn cùng job (≤ 6 giờ trên runner của GitHub).</li>
<li>Quyền = mặc định của kho → khối workflow → khối job (THAY THẾ, không cộng) → hạ cấp cho fork. Đọc kết quả trong Set up job.</li>
<li>Nêu một quyền là phần còn lại về <code>none</code>; <code>Metadata: read</code> luôn còn; <code>write-all</code> cấp cả quyền bạn chưa nghe tên.</li>
<li>Thiếu quyền là 403 "Resource not accessible by integration" ồn ào — nhưng có action nuốt nó; sau khi siết quyền phải lục log.</li>
<li><code>none</code> chặn ghi và đọc riêng tư; dữ liệu công khai vẫn đọc được, nên checkout kho công khai vẫn chạy với <code>{}</code>.</li>
<li>Việc liên kho cần thông tin đăng nhập khác: ưu tiên token GitHub App, rồi PAT fine-grained, không dùng PAT classic.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run 36006295870 và 36006295911 trên sân tập — quyền, 403 và thay thế</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295870 — khối GITHUB_TOKEN Permissions với sáu cách khai và cặp 403/201; …/runs/36006295911 — khối job thay thế khối workflow.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/create-github-app-token</span><span class="lc-sub">github.com/actions/create-github-app-token — action chính thức đổi ID và khoá riêng của GitHub App lấy installation token sống một giờ cho việc liên kho.</span></span></div>

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
${slide('ga-06', 14, 'OIDC in four steps: request a signed JWT, present it, the cloud checks signature and claims, a short-lived credential comes back')}
<p>Read the picture as four steps, because each step is where one kind of mistake lives:</p>
<ol>
<li><strong>Request.</strong> A job whose token has <code>id-token: write</code> finds two extra environment variables, <code>ACTIONS_ID_TOKEN_REQUEST_URL</code> and <code>ACTIONS_ID_TOKEN_REQUEST_TOKEN</code>. Calling the URL with that bearer token returns a JWT (JSON Web Token) signed by GitHub&#39;s issuer, <code>https://token.actions.githubusercontent.com</code>.</li>
<li><strong>Present.</strong> The job sends that JWT to the cloud&#39;s token service — for AWS, <code>AssumeRoleWithWebIdentity</code>. The official login actions do steps 1 and 2 for you.</li>
<li><strong>Verify.</strong> The cloud fetches GitHub&#39;s public keys from <code>https://token.actions.githubusercontent.com/.well-known/jwks</code>, checks the signature and the expiry, then compares the claims — above all <code>aud</code> and <code>sub</code> — with the trust policy you configured on the role.</li>
<li><strong>Receive.</strong> If everything matches, the cloud returns its own short-lived credential for that role. Nothing about this was stored in GitHub.</li>
</ol>

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

<h3>A real token from the sandbox, decoded</h3>
<p>Everything above is checkable without a cloud account. A JWT is three base64url parts separated by dots — header, payload, signature — and the first two are plain JSON. The sandbox job <code>co-id-token</code> requested a token and printed only the <strong>decoded payload</strong>: never the token itself, never the signature (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295897" target="_blank" rel="noopener">36006295897</a>). The script is short enough to read in full:</p>
<pre><code><span class="tok-comment"># ch06/doc-claims.sh — prints the CLAIMS of this job&#39;s OIDC token, not the token</span>
[ -n "$ACTIONS_ID_TOKEN_REQUEST_URL" ] || { echo "no id-token: write"; exit 0; }
jwt=$(curl -sS -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \\
        "$ACTIONS_ID_TOKEN_REQUEST_URL" | jq -r .value)
payload=$(cut -d. -f2 &lt;&lt;&lt; "$jwt" | tr '_-' '/+')
while [ $(( &#36;{#payload} % 4 )) -ne 0 ]; do payload="$payload="; done
printf %s "$payload" | base64 -d | jq '{iss, aud, sub, repository, ref, environment}'</code></pre>
${slide('ga-06', 15, 'The real claims of an OIDC token: iss, aud, sub, repository, ref, and a 300-second lifetime')}
<p>Four measurements from that output are worth keeping. The token is 2,007 characters, signed with <code>RS256</code>. It lives <strong>300 seconds</strong> (<code>exp - iat</code>). The default <code>aud</code> is the owner&#39;s URL, <code>https://github.com/cuonghoang1103</code>; asking for <code>&amp;audience=sts.amazonaws.com</code> in the same job produced a token whose <code>aud</code> was exactly that string — which is how an AWS role can refuse a token minted for some other service. And there are 31 claims, including <code>ref_protected</code>, <code>repository_visibility</code>, <code>runner_environment</code> and <code>job_workflow_ref</code>, each of which a cloud policy can match on.</p>
${slide('ga-06', 16, 'Anatomy of the sub claim: owner and repository with immutable IDs, then a context that changes per job')}
<p>The <code>sub</code> in the table higher up this lesson was written for this course&#39;s api-backend repository, in the classic form <code>repo:owner/repo:ref:…</code>. The sandbox returned a different shape: <code>repo:cuonghoang1103@125522434/ga-san-tap@1385223175:ref:refs/heads/ch06-bi-mat</code>. That is not a bug. Since GitHub&#39;s changelog of 23/04/2026, repositories created after 15/07/2026 — the sandbox was created in September — carry the immutable owner and repository <strong>IDs</strong> after an <code>@</code>. The reason is name recycling: if an account or repository is deleted and someone registers the same name, the old name-only <code>sub</code> would match their tokens too. IDs are never reused. Repositories created earlier, like api-backend, keep the old format unless the owner opts in — so a trust policy copied between two repositories of different ages can silently stop matching.</p>
<p>The last part of <code>sub</code> is the <em>context</em>, and it changes per job: <code>:ref:refs/heads/&lt;branch&gt;</code> for a push, <code>:environment:&lt;name&gt;</code> when the job declares an environment (measured in Lesson 6.4 — it <em>replaces</em> the ref part), <code>:pull_request</code> for pull requests, <code>:ref:refs/tags/&lt;tag&gt;</code> for tags.</p>

<h3>What it looks like in the workflow</h3>
${slide('ga-06', 18, 'Without id-token: write the request variables do not exist; the permissions block does not list id-token either')}
<p>Two measurements from the same run sharpen the trap below. Job <code>khong-id-token</code> (only <code>contents: read</code>) had no <code>ACTIONS_ID_TOKEN_REQUEST_URL</code> at all — the first thing to check when a cloud login fails. And job <code>chi-id-token</code>, with <code>id-token: write</code> and nothing else, printed a <code>GITHUB_TOKEN Permissions</code> block containing only <code>Metadata: read</code>: <code>id-token</code> is not shown there, so the log block cannot tell you whether it was granted. The same job&#39;s checkout succeeded, because the sandbox is public; see the correction in the trap.</p>

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
<p><strong>Trap — forgetting <code>id-token: write</code>, and reading the error as a provider problem.</strong> Without it the job cannot request a token at all, and the failure surfaces on the cloud side as a credentials error — which sends people to check their role ARN and their trust policy, both of which are fine. It is one line in <code>permissions:</code>, and per 6.2 declaring it also zeroes every other scope, so <code>contents: read</code> has to be listed alongside it or the checkout breaks too — on a <strong>private</strong> repository. <em>(Corrected 24/09/2026: on a public repository the checkout still succeeds with only <code>id-token: write</code>, measured on the sandbox, because public contents are readable without the scope. List <code>contents: read</code> anyway; the day the repository goes private is not the day to find out.)</em></p>
</div>

<h3>Writing the trust policy on the cloud side</h3>
${slide('ga-06', 17, 'A trust policy is only as narrow as the sub string you write')}
<p>OIDC moves the security decision out of GitHub and into one JSON document on the cloud side. For AWS it is the role&#39;s trust policy; the part that matters is the <code>Condition</code>:</p>
<pre><code>{
  "Effect": "Allow",
  "Principal": { "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com" },
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": {
      "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
      "token.actions.githubusercontent.com:sub": "repo:my-org/app:environment:production"
    }
  }
}</code></pre>
<p>Two conditions, each closing one door. <code>aud</code> must equal the audience the AWS action requests, so a token minted for another service is refused. <code>sub</code> pins the repository <em>and</em> the context. Matching on <code>environment:production</code> is the strongest common choice because it inherits everything Lesson 6.4 shows an environment can do: a required reviewer, a branch rule. A wildcard such as <code>repo:my-org/app:*</code> — the version that "just works" in blog posts — accepts every branch, so anyone who can push a branch can assume the production role.</p>
<div class="callout warn">
<p><strong>Match the sub your repository actually sends.</strong> For a repository created after 15/07/2026, the policy above would never match, because the real claim is <code>repo:my-org@ID/app@ID:environment:production</code>. The cheapest way to know the exact string is the one used here: run a job that prints the decoded claims, copy <code>sub</code>, and write the policy from that — not from memory.</p>
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

<h3>Is the OIDC token itself a secret?</h3>
<p>Yes, for its five minutes. Anyone holding a valid token could present it to a cloud whose policy matches — so the script above never prints it, and the runner also redacts JWT-shaped strings in logs (Lesson 6.1 measured a fake one turning into <code>***</code>). But compare the exposure with the key it replaces: a leaked OIDC token is useful for at most 300 seconds, only against policies that match its exact <code>sub</code> and <code>aud</code>, and it cannot be used to mint another. A leaked access key works from anywhere until someone notices.</p>
<div class="kv-grid">
<div class="kv"><span class="k">what the claims are NOT</span><span class="v">a secret. Decoding the payload is not "breaking" anything — the payload is only base64url; the protection is the signature, which a cloud verifies and nobody can forge without GitHub&#39;s private key</span></div>
<div class="kv"><span class="k">what to log</span><span class="v">the claims, when debugging a trust policy. Never the token</span></div>
<div class="kv"><span class="k">where it fails silently</span><span class="v">a job that forgot <code>id-token: write</code> — the request variables simply do not exist, and the cloud action reports "could not load credentials"</span></div>
</div>

<div class="callout">
<p><strong>Interview questions you are likely to get.</strong></p>
<p><strong>Q: How do you deploy to AWS from GitHub Actions without storing an access key?</strong><br>A: OIDC. The job gets <code>id-token: write</code>, the official AWS action requests a JWT from GitHub&#39;s issuer and exchanges it with <code>AssumeRoleWithWebIdentity</code>. On the AWS side there is an OIDC identity provider for <code>token.actions.githubusercontent.com</code> and a role whose trust policy checks <code>aud</code> equals <code>sts.amazonaws.com</code> and <code>sub</code> equals the exact repository and environment. The credential that comes back expires on its own; nothing long-lived is stored in GitHub.</p>
<p><strong>Q: What is in the <code>sub</code> claim and why does it matter?</strong><br>A: It identifies who is asking: repository plus context — branch ref, environment, pull request or tag. It is what the trust policy matches. A wildcard on it lets every branch assume the role. And for new repositories it now contains immutable owner and repository IDs, so policies must be written from the real claim.</p>
<p><strong>Q: A cloud login step fails with a credentials error. What do you check first?</strong><br>A: Whether the job has <code>id-token: write</code> — if <code>ACTIONS_ID_TOKEN_REQUEST_URL</code> is empty, the token was never requested. Then I print the decoded claims and compare <code>sub</code> and <code>aud</code> character by character with the trust policy.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you will write a cloud trust policy next month. You want to know the exact claims your repository produces before you write a single condition — no cloud account needed.</p><ol>
<li>Copy the <code>doc-claims.sh</code> script from this lesson into your test repository.</li>
<li>Add a workflow with two jobs: one with <code>permissions: { contents: read }</code>, one with <code>permissions: { contents: read, id-token: write }</code>. Both check out and run <code>bash doc-claims.sh</code>.</li>
<li>In the second job, run the script twice: once as is, once with <code>&amp;audience=sts.amazonaws.com</code> appended to the request URL.</li>
<li>Push to a branch other than <code>main</code>, then run it again from <code>main</code> (or via <code>workflow_dispatch</code> on main).</li></ol>
<p><strong>Done when:</strong> the first job reports that the request URL does not exist; the second prints <code>iss</code>, <code>aud</code> and <code>sub</code>; the <code>aud</code> changes with the audience parameter; <code>exp - iat</code> is 300; and you can write down the two <code>sub</code> strings (branch vs main) and say which one a policy for "only main" would accept.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OIDC (OpenID Connect)</span><span class="v">A standard way for one system to prove identity to another with a signed token. Here: GitHub proves "this job" to a cloud.</span></div>
  <div class="kv"><span class="k">JWT</span><span class="v">header.payload.signature, base64url-encoded; the payload holds claims, the signature proves who issued them.</span></div>
  <div class="kv"><span class="k">Claim</span><span class="v">One field of the payload: <code>iss</code>, <code>aud</code>, <code>sub</code>, <code>ref</code>, <code>environment</code>…</span></div>
  <div class="kv"><span class="k"><code>aud</code> (audience)</span><span class="v">Who the token is meant for; default is the owner&#39;s URL, cloud actions request their own.</span></div>
  <div class="kv"><span class="k"><code>sub</code> (subject)</span><span class="v">Repository + context; the string trust policies match. Contains immutable IDs for repositories created after 15/07/2026.</span></div>
  <div class="kv"><span class="k">Trust policy (chính sách tin cậy)</span><span class="v">Cloud-side rule saying which tokens may assume a role.</span></div>
  <div class="kv"><span class="k"><code>id-token: write</code></span><span class="v">The permission to request an OIDC token; grants no write access to the repository.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>OIDC replaces a stored cloud key with a signed, five-minute JWT exchanged for a short-lived credential.</li>
<li>The job needs <code>id-token: write</code>; without it <code>ACTIONS_ID_TOKEN_REQUEST_URL</code> does not exist, and the permissions log block does not show the scope either way.</li>
<li>Measured: RS256, 31 claims, <code>exp - iat = 300</code>, <code>aud</code> follows the requested audience.</li>
<li>Security lives in the cloud-side trust policy: check <code>aud</code>, match <code>sub</code> exactly — ideally down to an environment.</li>
<li>New repositories send <code>sub</code> with immutable IDs (<code>owner@id/repo@id</code>); write policies from the decoded real claim.</li>
<li>List <code>contents: read</code> beside <code>id-token: write</code>: public repositories forgive the omission, private ones do not.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Changelog — Immutable subject claims for GitHub Actions OIDC tokens (23/04/2026)</span><span class="lc-sub">github.blog/changelog/2026-04-23-immutable-subject-claims-for-github-actions-oidc-tokens — why sub now carries owner and repository IDs, the @ delimiter, and the 15/07/2026 cut-over for new repositories.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — OpenID Connect reference</span><span class="lc-sub">docs.github.com/en/actions/reference/security/oidc — every claim, the sub formats per event and environment, custom audiences and sub templates.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox run 36006295897 — claims of a real token, decoded</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295897 — the three jobs of this lesson: no id-token, id-token with two audiences, id-token only.</span></span></div>

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
${slide('ga-06', 14, 'OIDC bốn bước: xin JWT đã ký, trình nó ra, cloud kiểm chữ ký và claim, nhận về thông tin đăng nhập sống ngắn')}
<p>Đọc hình như bốn bước, vì mỗi bước là nơi trú của một kiểu sai:</p>
<ol>
<li><strong>Xin.</strong> Một job mà token có <code>id-token: write</code> sẽ thấy thêm hai biến môi trường, <code>ACTIONS_ID_TOKEN_REQUEST_URL</code> và <code>ACTIONS_ID_TOKEN_REQUEST_TOKEN</code>. Gọi URL ấy kèm bearer token đó sẽ nhận về một JWT (JSON Web Token) do issuer (bên phát hành) của GitHub ký: <code>https://token.actions.githubusercontent.com</code>.</li>
<li><strong>Trình.</strong> Job gửi JWT ấy tới dịch vụ token của cloud — với AWS là <code>AssumeRoleWithWebIdentity</code>. Các action đăng nhập chính thức làm hộ bạn bước 1 và 2.</li>
<li><strong>Kiểm.</strong> Cloud lấy khoá công khai của GitHub ở <code>https://token.actions.githubusercontent.com/.well-known/jwks</code>, kiểm chữ ký và hạn dùng, rồi so các claim (trường thông tin) — trước hết là <code>aud</code> và <code>sub</code> — với chính sách tin cậy bạn cấu hình trên vai trò.</li>
<li><strong>Nhận.</strong> Khớp hết thì cloud trả về thông tin đăng nhập sống ngắn CỦA NÓ cho vai trò đó. Không có gì trong chuyện này được lưu ở GitHub.</li>
</ol>

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

<h3>Một token thật từ sân tập, đã giải mã</h3>
<p>Mọi điều bên trên kiểm được mà không cần tài khoản cloud. Một JWT là ba phần base64url nối bằng dấu chấm — header, payload, chữ ký — và hai phần đầu chỉ là JSON thường. Job <code>co-id-token</code> trên sân tập xin một token rồi chỉ in <strong>payload đã giải mã</strong>: không bao giờ in bản thân token, không bao giờ in chữ ký (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295897" target="_blank" rel="noopener">36006295897</a>). Script đủ ngắn để đọc trọn:</p>
<pre><code><span class="tok-comment"># ch06/doc-claims.sh — in CLAIMS cua token OIDC cua job, KHONG in token</span>
[ -n "$ACTIONS_ID_TOKEN_REQUEST_URL" ] || { echo "thieu id-token: write"; exit 0; }
jwt=$(curl -sS -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \\
        "$ACTIONS_ID_TOKEN_REQUEST_URL" | jq -r .value)
payload=$(cut -d. -f2 &lt;&lt;&lt; "$jwt" | tr '_-' '/+')
while [ $(( &#36;{#payload} % 4 )) -ne 0 ]; do payload="$payload="; done
printf %s "$payload" | base64 -d | jq '{iss, aud, sub, repository, ref, environment}'</code></pre>
${slide('ga-06', 15, 'Claims thật của một token OIDC: iss, aud, sub, repository, ref, và tuổi thọ 300 giây')}
<p>Bốn số đo trong output ấy đáng giữ lại. Token dài 2.007 ký tự, ký bằng <code>RS256</code>. Nó sống <strong>300 giây</strong> (<code>exp - iat</code>). <code>aud</code> mặc định là URL của chủ kho, <code>https://github.com/cuonghoang1103</code>; xin kèm <code>&amp;audience=sts.amazonaws.com</code> ngay trong cùng job thì ra token có <code>aud</code> đúng bằng chuỗi đó — đó là cách một vai trò AWS từ chối token đúc cho dịch vụ khác. Và có 31 claim, gồm <code>ref_protected</code>, <code>repository_visibility</code>, <code>runner_environment</code> và <code>job_workflow_ref</code>, cái nào chính sách cloud cũng khớp được.</p>
${slide('ga-06', 16, 'Giải phẫu claim sub: chủ kho và kho kèm ID bất biến, rồi phần ngữ cảnh đổi theo từng job')}
<p>Claim <code>sub</code> trong bảng phía trên của bài này được viết cho kho api-backend của khoá học, theo dạng cổ điển <code>repo:owner/repo:ref:…</code>. Sân tập trả về một hình dạng khác: <code>repo:cuonghoang1103@125522434/ga-san-tap@1385223175:ref:refs/heads/ch06-bi-mat</code>. Đó không phải lỗi. Theo changelog của GitHub ngày 23/04/2026, kho tạo SAU 15/07/2026 — sân tập tạo tháng 9 — mang thêm <strong>ID bất biến</strong> của chủ kho và của kho sau dấu <code>@</code>. Lý do là TÁI SỬ DỤNG TÊN: nếu một tài khoản hay kho bị xoá rồi người khác đăng ký lại đúng tên đó, <code>sub</code> chỉ-có-tên kiểu cũ sẽ khớp cả token của họ. ID thì không bao giờ được cấp lại. Kho tạo trước đó, như api-backend, vẫn giữ dạng cũ trừ khi chủ kho tự bật — nên một chính sách tin cậy chép từ kho này sang kho kia khác tuổi có thể lặng lẽ thôi khớp.</p>
<p>Phần cuối của <code>sub</code> là <em>NGỮ CẢNH</em>, và nó đổi theo từng job: <code>:ref:refs/heads/&lt;nhanh&gt;</code> khi push, <code>:environment:&lt;ten&gt;</code> khi job khai environment (đo ở bài 6.4 — nó <em>THAY</em> phần ref), <code>:pull_request</code> với pull request, <code>:ref:refs/tags/&lt;the&gt;</code> với thẻ.</p>

<h3>Nó trông ra sao trong workflow</h3>
${slide('ga-06', 18, 'Thiếu id-token: write thì biến xin token không tồn tại; khối permissions trong log cũng không liệt kê id-token')}
<p>Hai số đo trong cùng run làm cái bẫy bên dưới sắc hơn. Job <code>khong-id-token</code> (chỉ <code>contents: read</code>) hoàn toàn không có <code>ACTIONS_ID_TOKEN_REQUEST_URL</code> — thứ đầu tiên phải kiểm khi đăng nhập cloud hỏng. Còn job <code>chi-id-token</code>, chỉ có <code>id-token: write</code>, in khối <code>GITHUB_TOKEN Permissions</code> chỉ gồm <code>Metadata: read</code>: <code>id-token</code> không hiện ở đó, nên khối log ấy không cho bạn biết nó có được cấp hay không. Bước checkout của chính job này vẫn thành công, vì sân tập là kho công khai; xem phần đính chính trong cái bẫy.</p>

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
<p><strong>Bẫy — quên <code>id-token: write</code>, rồi đọc lỗi ấy thành lỗi của nhà cung cấp.</strong> Thiếu nó thì job hoàn toàn không xin được token, và cú hỏng lộ ra ở phía đám mây dưới dạng một lỗi thông tin đăng nhập — thứ khiến người ta đi kiểm ARN của vai trò và chính sách tin cậy, mà cả hai đều ổn. Nó là MỘT dòng trong <code>permissions:</code>, và theo bài 6.2 thì khai nó cũng đưa mọi phạm vi khác về không, nên <code>contents: read</code> phải được liệt kê cùng, không thì cả bước checkout cũng vỡ — với kho <strong>RIÊNG TƯ</strong>. <em>(Đính chính 24/09/2026: với kho công khai, checkout vẫn thành công khi chỉ có <code>id-token: write</code>, đã đo trên sân tập, vì nội dung công khai đọc được mà không cần quyền. Cứ liệt kê <code>contents: read</code>; ngày kho chuyển sang riêng tư không phải ngày để phát hiện chuyện này.)</em></p>
</div>

<h3>Viết chính sách tin cậy phía cloud</h3>
${slide('ga-06', 17, 'Chính sách tin cậy chỉ hẹp bằng chuỗi sub bạn viết')}
<p>OIDC chuyển quyết định bảo mật ra khỏi GitHub, vào MỘT tài liệu JSON phía cloud. Với AWS đó là trust policy của vai trò; phần quan trọng là <code>Condition</code>:</p>
<pre><code>{
  "Effect": "Allow",
  "Principal": { "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com" },
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": {
      "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
      "token.actions.githubusercontent.com:sub": "repo:my-org/app:environment:production"
    }
  }
}</code></pre>
<p>Hai điều kiện, mỗi cái đóng một cửa. <code>aud</code> phải bằng audience mà action AWS xin, nên token đúc cho dịch vụ khác bị từ chối. <code>sub</code> ghim cả KHO lẫn NGỮ CẢNH. Khớp tới <code>environment:production</code> là lựa chọn phổ biến chặt nhất, vì nó thừa hưởng mọi thứ bài 6.4 cho thấy một environment làm được: người duyệt bắt buộc, luật nhánh. Một ký tự đại diện kiểu <code>repo:my-org/app:*</code> — bản "chạy ngay" trên các bài blog — nhận MỌI nhánh, nên ai push được một nhánh là nhận được vai trò production.</p>
<div class="callout warn">
<p><strong>Khớp đúng cái sub mà kho của bạn THẬT SỰ gửi.</strong> Với kho tạo sau 15/07/2026, chính sách bên trên sẽ không bao giờ khớp, vì claim thật là <code>repo:my-org@ID/app@ID:environment:production</code>. Cách rẻ nhất để biết chính xác chuỗi là cách đã dùng ở đây: chạy một job in claims đã giải mã, chép <code>sub</code>, rồi viết chính sách từ đó — không viết theo trí nhớ.</p>
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

<h3>Bản thân token OIDC có phải bí mật không?</h3>
<p>Có, trong năm phút của nó. Ai cầm một token còn hạn đều có thể trình nó cho một cloud có chính sách khớp — nên script bên trên không bao giờ in nó, và runner cũng tự che các chuỗi có hình dạng JWT trong log (bài 6.1 đã đo một JWT giả biến thành <code>***</code>). Nhưng hãy so mức phơi nhiễm với cái khoá mà nó thay thế: một token OIDC bị lộ chỉ dùng được tối đa 300 giây, chỉ với những chính sách khớp đúng <code>sub</code> và <code>aud</code> của nó, và không dùng nó để đúc token khác được. Một access key bị lộ thì dùng được từ bất cứ đâu cho tới khi có người để ý.</p>
<div class="kv-grid">
<div class="kv"><span class="k">claims KHÔNG phải là</span><span class="v">bí mật. Giải mã payload không phải "bẻ khoá" gì cả — payload chỉ là base64url; thứ bảo vệ là CHỮ KÝ, cloud kiểm nó, và không ai giả được nếu không có khoá riêng của GitHub</span></div>
<div class="kv"><span class="k">nên ghi log gì</span><span class="v">claims, khi gỡ lỗi chính sách tin cậy. Không bao giờ ghi token</span></div>
<div class="kv"><span class="k">chỗ hỏng lặng lẽ</span><span class="v">job quên <code>id-token: write</code> — biến xin token đơn giản là không tồn tại, và action cloud báo "could not load credentials"</span></div>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Làm sao deploy lên AWS từ GitHub Actions mà không lưu access key?</strong><br>Đ: Dùng OIDC. Job có <code>id-token: write</code>, action AWS chính thức xin JWT từ issuer của GitHub rồi đổi nó bằng <code>AssumeRoleWithWebIdentity</code>. Phía AWS có một OIDC identity provider cho <code>token.actions.githubusercontent.com</code> và một vai trò với trust policy kiểm <code>aud</code> bằng <code>sts.amazonaws.com</code> và <code>sub</code> bằng đúng kho và environment. Thông tin đăng nhập trả về tự hết hạn; không có gì sống lâu được lưu ở GitHub.</p>
<p><strong>H: Claim <code>sub</code> chứa gì và vì sao quan trọng?</strong><br>Đ: Nó cho biết AI đang xin: kho cộng ngữ cảnh — ref nhánh, environment, pull request hay thẻ. Chính sách tin cậy khớp trên nó. Đặt ký tự đại diện là cho mọi nhánh nhận vai trò. Và với kho mới, nó giờ chứa ID bất biến của chủ kho và kho, nên chính sách phải viết từ claim thật.</p>
<p><strong>H: Bước đăng nhập cloud hỏng với lỗi thông tin đăng nhập. Bạn kiểm gì đầu tiên?</strong><br>Đ: Job có <code>id-token: write</code> chưa — nếu <code>ACTIONS_ID_TOKEN_REQUEST_URL</code> rỗng thì token chưa từng được xin. Rồi tôi in claims đã giải mã và so <code>sub</code>, <code>aud</code> từng ký tự với trust policy.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tháng sau bạn sẽ viết một trust policy trên cloud. Bạn muốn biết chính xác các claim kho của mình tạo ra trước khi viết điều kiện nào — không cần tài khoản cloud.</p><ol>
<li>Chép script <code>doc-claims.sh</code> của bài này vào kho thử của bạn.</li>
<li>Thêm một workflow có hai job: một job <code>permissions: { contents: read }</code>, một job <code>permissions: { contents: read, id-token: write }</code>. Cả hai checkout rồi chạy <code>bash doc-claims.sh</code>.</li>
<li>Ở job thứ hai, chạy script hai lần: một lần nguyên bản, một lần nối thêm <code>&amp;audience=sts.amazonaws.com</code> vào URL xin token.</li>
<li>Push lên một nhánh khác <code>main</code>, rồi chạy lại từ <code>main</code> (hoặc bằng <code>workflow_dispatch</code> trên main).</li></ol>
<p><strong>Đạt khi:</strong> job thứ nhất báo URL xin token không tồn tại; job thứ hai in <code>iss</code>, <code>aud</code>, <code>sub</code>; <code>aud</code> đổi theo tham số audience; <code>exp - iat</code> bằng 300; và bạn chép được hai chuỗi <code>sub</code> (nhánh và main) rồi nói được chính sách "chỉ main" nhận cái nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OIDC (OpenID Connect)</span><span class="v">Chuẩn để một hệ thống chứng minh danh tính với hệ thống khác bằng token đã ký. Ở đây: GitHub chứng minh "job này" với một cloud.</span></div>
  <div class="kv"><span class="k">JWT</span><span class="v">header.payload.chữ-ký, mã base64url; payload chứa claim, chữ ký chứng minh ai phát hành.</span></div>
  <div class="kv"><span class="k">Claim (trường thông tin)</span><span class="v">Một trường của payload: <code>iss</code>, <code>aud</code>, <code>sub</code>, <code>ref</code>, <code>environment</code>…</span></div>
  <div class="kv"><span class="k"><code>aud</code> (audience, người nhận)</span><span class="v">Token dành cho ai; mặc định là URL chủ kho, action cloud xin giá trị riêng.</span></div>
  <div class="kv"><span class="k"><code>sub</code> (subject, chủ thể)</span><span class="v">Kho + ngữ cảnh; chuỗi mà trust policy khớp. Có ID bất biến với kho tạo sau 15/07/2026.</span></div>
  <div class="kv"><span class="k">Trust policy (chính sách tin cậy)</span><span class="v">Luật phía cloud nói token nào được nhận vai trò.</span></div>
  <div class="kv"><span class="k"><code>id-token: write</code></span><span class="v">Quyền được XIN token OIDC; không cấp quyền ghi nào vào kho.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>OIDC thay một khoá cloud đã lưu bằng một JWT đã ký sống năm phút, đổi lấy thông tin đăng nhập sống ngắn.</li>
<li>Job cần <code>id-token: write</code>; thiếu nó thì <code>ACTIONS_ID_TOKEN_REQUEST_URL</code> không tồn tại, và khối quyền trong log không hiện quyền này dù có hay không.</li>
<li>Đo được: RS256, 31 claim, <code>exp - iat = 300</code>, <code>aud</code> theo audience đã xin.</li>
<li>Bảo mật nằm ở trust policy phía cloud: kiểm <code>aud</code>, khớp <code>sub</code> chính xác — tốt nhất tới tận environment.</li>
<li>Kho mới gửi <code>sub</code> kèm ID bất biến (<code>owner@id/repo@id</code>); viết chính sách từ claim thật đã giải mã.</li>
<li>Liệt kê <code>contents: read</code> cạnh <code>id-token: write</code>: kho công khai tha thứ chuyện quên, kho riêng tư thì không.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Changelog — Immutable subject claims for GitHub Actions OIDC tokens (23/04/2026)</span><span class="lc-sub">github.blog/changelog/2026-04-23-immutable-subject-claims-for-github-actions-oidc-tokens — vì sao sub giờ mang ID của chủ kho và kho, dấu phân cách @, và mốc 15/07/2026 cho kho mới.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — OpenID Connect reference</span><span class="lc-sub">docs.github.com/en/actions/reference/security/oidc — mọi claim, dạng sub theo sự kiện và environment, audience tuỳ chỉnh và mẫu sub.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run 36006295897 trên sân tập — claims của một token thật, đã giải mã</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295897 — ba job của bài: không id-token, có id-token với hai audience, chỉ có id-token.</span></span></div>

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
${slide('ga-06', 19, 'Three actors, three boundaries — real incidents happen in the middle column')}
<p>The picture puts each actor next to the defence that actually applies to it, because the most common mistake in pipeline security is fitting the wrong defence to the wrong actor: adding <code>permissions:</code> to stop a malicious contributor (it does not; fork PRs are already read-only), or adding code review to stop a compromised action (it does not; the action&#39;s code is not in your diff). Each column has its own control, and the controls are not interchangeable.</p>

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
<div class="lz-layer"><span class="lz-lname">1 — <code>&#36;{{ }}</code> from the event, inside <code>run:</code></span><span class="lz-lnote">3.1: the PR title becomes script text. Three lines to demonstrate, and the fix is routing through <code>env:</code>. In this repository, 27 of 44 secret interpolations are direct — but all are values the owner set, not event data, so none are exposed</span></div>
<div class="lz-layer"><span class="lz-lname">2 — <code>pull_request_target</code> + <code>ref: head.sha</code></span><span class="lz-lnote">1.4: measured to print <code>DEPLOY_KEY = sk-that-su-cua-production-9f2a</code>. One added line turns a safe workflow into a shell for a stranger. Measured here: <strong>0 / 11</strong> workflows use <code>pull_request_target</code></span></div>
<div class="lz-layer"><span class="lz-lname">3 — a compromised action</span><span class="lz-lnote">4.2: 21 of 21 uses pinned to moving major tags, and 6 actions demonstrably changed runtime under an unchanged file. A tag move is how a compromise arrives</span></div>
<div class="lz-layer"><span class="lz-lname">4 — a derived secret, printed</span><span class="lz-lnote">6.1: masking covers the stored string only. The base64-decoded SSH key shares zero nine-character substrings with what GitHub masks</span></div>
</div>

<h3>Scoring this repository against its own measurements</h3>
${slide('ga-06', 23, 'Re-scoring api-backend on 24/09/2026: more workflows, still no SHA pins, and the unknown default is now known')}
<p><em>Re-measured 24/09/2026.</em> The scorecard below was taken when the repository had eleven workflows. Running the same audit script from Lesson 6.5 today, read-only, gives fourteen workflows, 56 secret references, 0 of 24 actions pinned by SHA, <code>permissions:</code> at the top of 2 of 14 files (<code>deploy-ghcr.yml</code> and the newer <code>ship-lab211.yml</code>) and <code>environment:</code> in none. The one row that was an unknown is now a fact: <code>gh api repos/cuonghoang1103/api-backend/actions/permissions/workflow</code> reports the default as <strong>read</strong>. The shape of the result has not changed; the numbers have grown with the repository, which is the argument for running the audit continuously rather than once.</p>

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

<div class="callout ok">
<p><strong>Update on the "default permissions" row (24/09/2026).</strong> "Nobody in this analysis could determine it from the outside" was true of an outside reader, and it is exactly what the repository owner can determine in one read-only call: the default is <code>read</code> (restricted). So the ten undeclared workflows run with contents and packages read, and <code>deploy-ghcr.yml</code> — the one that needs <code>packages: write</code> — declares it. The row stays amber for a different reason: the minimum lives in a setting page instead of in the files, and a setting can be flipped without a diff.</p>
</div>

<div class="pitfall">
<p><strong>Trap — treating a green row as permanent.</strong> Every green result above is a property of the current files, not of the repository. <code>pull_request_target</code> is zero until somebody needs a labeller bot. Event interpolation is zero until somebody adds a step that echoes a branch name. The measurements are a snapshot, and the only thing that keeps them green is that the four checks are cheap enough to re-run — which is what 6.5 is for.</p>
</div>

<h3>Environments, measured on the sandbox</h3>
<p>Row six — no approval gate — is the easiest to fix and the least understood, so the sandbox built one. Environment <code>ch06-production</code> got a required reviewer (the repository owner), a branch rule allowing only <code>ch06-bi-mat</code>, and two environment secrets. A second environment, <code>ch06-chi-main</code>, allowed only <code>main</code>. One workflow had three jobs (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295900" target="_blank" rel="noopener">36006295900</a>):</p>
${slide('ga-06', 20, 'An environment is a gate: the job waits until a reviewer approves; a branch rule rejects before any runner starts')}
<ul>
<li><strong><code>khong-env</code></strong> declared no environment and finished in two seconds.</li>
<li><strong><code>co-env</code></strong> declared <code>environment: ch06-production</code> and stopped in the <em>Waiting</em> state. The API showed the pending deployment with <code>"reviewers":["cuonghoang1103"]</code>; it was approved with a comment through <code>POST …/pending_deployments</code> (the same thing the "Review deployments" button does), and the job then ran in six seconds. No runner is assigned to a job while it waits for approval — the "Set up job" timestamps start only after the approval.</li>
<li><strong><code>chi-main</code></strong> declared <code>environment: ch06-chi-main</code> and was rejected immediately: <code>Branch "ch06-bi-mat" is not allowed to deploy to ch06-chi-main due to environment protection rules.</code> It has zero steps and no log, because the rule is checked before a runner is assigned.</li>
</ul>
${slide('ga-06', 21, 'An environment secret reaches only the job that declares that environment, and wins over a repository secret of the same name')}
<p>The two jobs that ran printed what they could see. The repository secret <code>CH06_TRUNG</code> (26 characters) and the environment secret with the same name (33 characters) were told apart by length: <code>khong-env</code> saw 26, <code>co-env</code> saw 33 — the environment wins. <code>CH06_ENV_GIA</code> existed only in the environment: <code>khong-env</code> got an empty string, <code>co-env</code> got <code>***</code>. And the OIDC claim of <code>co-env</code> changed from <code>…:ref:refs/heads/ch06-bi-mat</code> to <code>…:environment:ch06-production</code>, which is what makes an environment the right thing for a cloud trust policy to match.</p>
<div class="callout">
<p><strong>What that buys in practice.</strong> Put the production credential in the environment, not in the repository. Then a job has to name the environment to receive it; naming it triggers the reviewer; the branch rule refuses every branch but the deploy branch; and environment secrets are only read when the job <em>starts</em>, after approval. A workflow someone adds next year on a feature branch cannot touch the key without passing all three.</p>
</div>
<p>Plan limits, from the docs (as of 09/2026): on Free, Pro and Team plans, required reviewers and wait timers exist only for <strong>public</strong> repositories (private repositories need Enterprise); branch rules for private repositories need Pro or Team. api-backend is public, so every control above is available to it at no cost.</p>

<h3>The ranking, if only one thing gets done</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">SHA-pin the 9 workflows that read the SSH key</span><span class="lz-d">highest ratio of risk removed to effort spent — 8 actions, one afternoon, and it is the row where a single upstream compromise reaches production</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">add <code>permissions:</code> to every workflow</span><span class="lz-d">converts an unknown into a declared minimum, and shrinks what a compromised action in row 1 could do</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">an <code>environment:</code> with a reviewer on the deploy jobs</span><span class="lz-d">one line, and it is the control that survives somebody adding an automatic trigger later</span></div>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> A fork PR is well-contained by default, someone with write access is unconstrained by design, and the entire practical security question is the middle row — third-party code running with your credentials — which is why pinning is worth more than every other item on the list.</p>
</div>

<h3>One control per threat, and how to know it is still working</h3>
${slide('ga-06', 22, 'Each threat has one control, and each control has a way to check that it is still in place')}
<p>A control you cannot check is a control you will lose. The right-hand column of the table is the point: every row has something you can run or read — a zizmor rule (Lesson 6.5), a log block, a job state — so the control can be verified on every change instead of remembered.</p>
<h3>A hardening checklist for a new repository</h3>
<ol>
<li><strong>Settings → Actions → General:</strong> workflow permissions <em>read</em>; "Allow GitHub Actions to create and approve pull requests" off; for a public repository, require approval for workflows from outside collaborators (the default for first-time contributors).</li>
<li><strong>Every workflow file:</strong> <code>permissions: contents: read</code> at the top; widen per job.</li>
<li><strong>Every <code>uses:</code>:</strong> full 40-character SHA with a version comment, and a <code>dependabot.yml</code> entry for <code>github-actions</code> (Chapter 4).</li>
<li><strong>Every <code>run:</code>:</strong> event data and inputs through <code>env:</code> and quoted <code>"$VAR"</code> (Chapter 3).</li>
<li><strong>Every <code>actions/checkout</code> in a job that uploads artifacts or runs third-party code:</strong> <code>persist-credentials: false</code>.</li>
<li><strong>Production credentials:</strong> in an environment with a reviewer and a branch rule — or replaced by OIDC where the target supports it.</li>
<li><strong>CI:</strong> actionlint and zizmor on every pull request that touches <code>.github/</code>.</li>
</ol>
<div class="callout warn">
<p><strong>What this checklist cannot do.</strong> It narrows rows one and two. It does nothing about row three — a person with write access — which is handled outside Actions: branch protection or rulesets on <code>main</code>, required review for changes under <code>.github/</code> (a <code>CODEOWNERS</code> entry plus the "Require review from Code Owners" rule), and a short list of people with admin rights.</p>
</div>

<div class="callout">
<p><strong>Interview questions you are likely to get.</strong></p>
<p><strong>Q: How would you secure the CI/CD pipeline of a repository you just inherited?</strong><br>A: I would start with an inventory rather than opinions: run zizmor and actionlint, read the default token permission, list secrets and which workflows use them. Then in order of risk removed per hour: pin actions by SHA in the workflows that hold production credentials, add <code>permissions:</code> to every workflow, move deploy credentials into an environment with a reviewer and branch rule — or to OIDC — and add the scanners to CI so it stays that way.</p>
<p><strong>Q: What does a GitHub environment give you that a repository secret does not?</strong><br>A: A gate. Environment secrets reach only jobs that declare the environment, and only after its protection rules pass — required reviewers, a wait timer, allowed branches. I measured all three on a sandbox: the job waited for approval, a job on the wrong branch was rejected before any runner started, and a job without the environment saw an empty string where the secret would be.</p>
<p><strong>Q: Does a pull request from a fork get my secrets?</strong><br>A: With the <code>pull_request</code> event, no: no secrets and a read-only token. The danger is <code>pull_request_target</code>, which runs with the base repository&#39;s secrets and a write token — safe only as long as it never checks out and executes the PR&#39;s code.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you are about to let a teammate deploy from your repository. You want production to need your approval, and only from <code>main</code>.</p><ol>
<li>In a test repository (public, or a paid plan): Settings → Environments → New environment <code>thu-prod</code>. Add yourself as required reviewer; under deployment branches choose "Selected branches" and add <code>main</code>.</li>
<li>Add an environment secret: <code>gh secret set THU_ENV --env thu-prod -b 'gia-tri-env-gia'</code>, and a repository secret with the same name and a value of a different length.</li>
<li>Add a workflow with two jobs: one without <code>environment:</code>, one with <code>environment: thu-prod</code>; both print <code>&#36;{#VAR}</code> (the length) of <code>env: VAR: &#36;{{ secrets.THU_ENV }}</code>.</li>
<li>Push from a feature branch; then run it from <code>main</code> and approve with the "Review deployments" button.</li>
<li>Clean up: delete both secrets and the environment.</li></ol>
<p><strong>Done when:</strong> the feature-branch run shows the environment job rejected by the branch rule; the <code>main</code> run shows the job waiting until you approve; and the two lengths printed prove the environment secret won over the repository one.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Attack surface (bề mặt tấn công)</span><span class="v">Everything an attacker can influence, and what each influence can reach.</span></div>
  <div class="kv"><span class="k">Environment (môi trường triển khai)</span><span class="v">A named target with its own secrets, variables and protection rules; a job opts in with <code>environment:</code>.</span></div>
  <div class="kv"><span class="k">Required reviewers</span><span class="v">Up to six people or teams; one approval lets the job start.</span></div>
  <div class="kv"><span class="k">Deployment branch rule</span><span class="v">Which branches or tags may use the environment; checked before a runner is assigned.</span></div>
  <div class="kv"><span class="k">Pending deployment</span><span class="v">A job waiting for approval; visible and approvable in the UI or API.</span></div>
  <div class="kv"><span class="k">CODEOWNERS</span><span class="v">File naming owners for paths such as <code>.github/</code>; with the "Require review from Code Owners" rule, their approval becomes mandatory.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Three actors, three different controls: fork contributor (keep their data out of commands), third-party action (pin, narrow, gate), writer (review, branch protection).</li>
<li>An environment is a gate: reviewer, branch rule, secrets read only after approval — all measured on the sandbox.</li>
<li>Environment secrets beat repository secrets of the same name, and do not exist for jobs that do not declare the environment.</li>
<li>With an environment, the OIDC <code>sub</code> becomes <code>…:environment:&lt;name&gt;</code> — the best thing for a cloud to match.</li>
<li>api-backend on 24/09/2026: 14 workflows, 0/24 SHA pins, 2/14 with <code>permissions:</code>, default token <code>read</code>, 0 environments — same shape, bigger numbers.</li>
<li>Every control needs a check you can run; otherwise it decays silently.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Deployments and environments</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments — required reviewers (up to six), wait timers, deployment branch rules, environment secrets, and which plans get them on private repositories.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox run 36006295900 — an environment gate, measured</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295900 — the waiting job, the branch-rule rejection and the environment secret from this lesson.</span></span></div>

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
${slide('ga-06', 19, 'Ba nhân vật, ba ranh giới — sự cố thật xảy ra ở cột giữa')}
<p>Hình đặt mỗi nhân vật cạnh biện pháp phòng thủ THẬT SỰ áp dụng cho họ, vì sai lầm phổ biến nhất trong bảo mật pipeline là lắp nhầm biện pháp cho nhầm nhân vật: thêm <code>permissions:</code> để chặn người đóng góp xấu (không chặn được; PR từ fork vốn đã chỉ-đọc), hay thêm review mã để chặn một action bị chiếm (không chặn được; mã của action không nằm trong diff của bạn). Mỗi cột có biện pháp riêng, và chúng không thay nhau được.</p>

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
<div class="lz-layer"><span class="lz-lname">1 — <code>&#36;{{ }}</code> lấy từ sự kiện, đặt trong <code>run:</code></span><span class="lz-lnote">bài 3.1: tiêu đề PR trở thành chữ trong script. Ba dòng để minh hoạ, và cách vá là vòng qua <code>env:</code>. Ở kho này, 27 trong 44 lượt nội suy bí mật là trực tiếp — nhưng tất cả đều là giá trị do chủ kho đặt, không phải dữ liệu sự kiện, nên không cái nào bị phơi</span></div>
<div class="lz-layer"><span class="lz-lname">2 — <code>pull_request_target</code> + <code>ref: head.sha</code></span><span class="lz-lnote">bài 1.4: đo được là in ra <code>DEPLOY_KEY = sk-that-su-cua-production-9f2a</code>. Một dòng thêm vào biến một workflow an toàn thành một cái shell cho người lạ. Đo ở đây: <strong>0 / 11</strong> workflow dùng <code>pull_request_target</code></span></div>
<div class="lz-layer"><span class="lz-lname">3 — một action bị chiếm</span><span class="lz-lnote">bài 4.2: 21 trên 21 lượt dùng ghim vào thẻ major di động, và 6 action chứng minh được là đã đổi runtime dưới một cái tệp không đổi. Một cú dời thẻ chính là cách một vụ chiếm quyền đi tới</span></div>
<div class="lz-layer"><span class="lz-lname">4 — một bí mật ĐÃ BIẾN ĐỔI, bị in ra</span><span class="lz-lnote">bài 6.1: che chỉ phủ chuỗi đã lưu. Cái khoá SSH sau khi giải mã base64 không chung một chuỗi con chín ký tự nào với thứ GitHub che</span></div>
</div>

<h3>Chấm điểm kho này theo chính số đo của nó</h3>
${slide('ga-06', 23, 'Chấm lại api-backend ngày 24/09/2026: nhiều workflow hơn, vẫn chưa ghim SHA, và ẩn số về quyền mặc định giờ đã biết')}
<p><em>Đo lại 24/09/2026.</em> Bảng điểm bên dưới được chụp lúc kho có mười một workflow. Chạy lại đúng script soát của bài 6.5 hôm nay, chỉ đọc, ra mười bốn workflow, 56 lượt tham chiếu secret, 0 trên 24 action ghim SHA, <code>permissions:</code> ở đầu 2 trên 14 tệp (<code>deploy-ghcr.yml</code> và <code>ship-lab211.yml</code> mới hơn) và <code>environment:</code> ở không tệp nào. Hàng từng là ẩn số giờ là sự thật: <code>gh api repos/cuonghoang1103/api-backend/actions/permissions/workflow</code> báo mặc định là <strong>read</strong>. HÌNH DẠNG kết quả không đổi; con số lớn lên cùng kho — đó chính là lý lẽ để chạy cuộc soát liên tục thay vì một lần.</p>

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

<div class="callout ok">
<p><strong>Cập nhật hàng "quyền mặc định" (24/09/2026).</strong> Câu "không ai trong cuộc phân tích này xác định được từ bên ngoài" đúng với người đọc từ bên ngoài, và lại chính là thứ chủ kho xác định được bằng một lệnh chỉ đọc: mặc định là <code>read</code> (restricted). Vậy mười workflow không khai quyền chạy với contents và packages ở mức đọc, còn <code>deploy-ghcr.yml</code> — cái cần <code>packages: write</code> — có khai. Hàng này vẫn vàng, nhưng vì lý do khác: mức tối thiểu nằm ở một trang cài đặt thay vì trong tệp, mà cài đặt thì đổi được không cần diff.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi một hàng XANH là vĩnh viễn.</strong> Mọi kết quả xanh bên trên là tính chất của những TỆP HIỆN TẠI, không phải của cái kho. <code>pull_request_target</code> bằng không cho tới khi có người cần một bot gắn nhãn. Nội suy sự kiện bằng không cho tới khi có người thêm một bước echo tên nhánh ra. Mấy phép đo ấy là một BỨC ẢNH CHỤP, và thứ duy nhất giữ chúng xanh là bốn phép kiểm ấy đủ rẻ để chạy lại — mà đó chính là việc của bài 6.5.</p>
</div>

<h3>Environment, đo trên sân tập</h3>
<p>Hàng sáu — không có cổng duyệt — là hàng dễ sửa nhất và ít được hiểu nhất, nên sân tập dựng hẳn một cái. Environment <code>ch06-production</code> có một người duyệt bắt buộc (chủ kho), một luật nhánh chỉ cho <code>ch06-bi-mat</code>, và hai secret riêng. Environment thứ hai, <code>ch06-chi-main</code>, chỉ cho <code>main</code>. Một workflow ba job (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295900" target="_blank" rel="noopener">36006295900</a>):</p>
${slide('ga-06', 20, 'environment là cổng: job đứng chờ tới khi người duyệt bấm; luật nhánh từ chối trước cả khi có runner')}
<ul>
<li><strong><code>khong-env</code></strong> không khai environment, xong trong hai giây.</li>
<li><strong><code>co-env</code></strong> khai <code>environment: ch06-production</code> và dừng ở trạng thái <em>Waiting</em> (chờ). API cho thấy lượt deploy đang chờ với <code>"reviewers":["cuonghoang1103"]</code>; nó được duyệt kèm lời nhắn qua <code>POST …/pending_deployments</code> (đúng việc nút "Review deployments" làm), rồi job chạy trong sáu giây. Không runner nào được cấp cho job trong lúc chờ duyệt — mốc thời gian của "Set up job" chỉ bắt đầu sau khi duyệt.</li>
<li><strong><code>chi-main</code></strong> khai <code>environment: ch06-chi-main</code> và bị từ chối ngay: <code>Branch "ch06-bi-mat" is not allowed to deploy to ch06-chi-main due to environment protection rules.</code> Nó không có bước nào và không có log, vì luật được kiểm TRƯỚC khi cấp runner.</li>
</ul>
${slide('ga-06', 21, 'Secret của environment chỉ tới job khai environment đó, và thắng secret cùng tên của kho')}
<p>Hai job có chạy đã in ra thứ chúng thấy. Secret cấp kho <code>CH06_TRUNG</code> (26 ký tự) và secret cùng tên cấp environment (33 ký tự) được phân biệt bằng ĐỘ DÀI: <code>khong-env</code> thấy 26, <code>co-env</code> thấy 33 — environment thắng. <code>CH06_ENV_GIA</code> chỉ có trong environment: <code>khong-env</code> nhận chuỗi rỗng, <code>co-env</code> nhận <code>***</code>. Và claim OIDC của <code>co-env</code> đổi từ <code>…:ref:refs/heads/ch06-bi-mat</code> thành <code>…:environment:ch06-production</code> — đó là lý do environment là thứ đúng để chính sách tin cậy của cloud khớp vào.</p>
<div class="callout">
<p><strong>Thứ đó mua được gì trong thực tế.</strong> Đặt thông tin đăng nhập production vào ENVIRONMENT, không đặt vào kho. Khi đó job phải gọi tên environment mới nhận được nó; gọi tên thì kích hoạt người duyệt; luật nhánh từ chối mọi nhánh trừ nhánh deploy; và secret của environment chỉ được đọc khi job <em>BẮT ĐẦU</em>, tức là sau khi duyệt. Một workflow ai đó thêm năm sau trên một nhánh tính năng không thể đụng tới cái khoá nếu không qua cả ba.</p>
</div>
<p>Giới hạn theo gói, từ docs (tính đến 09/2026): ở gói Free, Pro và Team, người duyệt bắt buộc và hẹn giờ chỉ có với kho <strong>công khai</strong> (kho riêng tư cần Enterprise); luật nhánh cho kho riêng tư cần Pro hoặc Team. api-backend là kho công khai, nên mọi biện pháp trên đều dùng được miễn phí.</p>

<h3>Thứ tự ưu tiên, nếu chỉ làm được một việc</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">ghim SHA cho 9 workflow đọc khoá SSH</span><span class="lz-d">tỉ lệ rủi-ro-gỡ-được trên công-bỏ-ra cao nhất — 8 action, một buổi chiều, và đó là hàng mà một cú chiếm quyền ở thượng nguồn với thẳng tới production</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">thêm <code>permissions:</code> vào mọi workflow</span><span class="lz-d">biến một ẩn số thành một mức tối thiểu ĐÃ KHAI, và thu nhỏ thứ mà một action bị chiếm ở mục 1 làm được</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">một <code>environment:</code> kèm người duyệt trên các job deploy</span><span class="lz-d">một dòng, và nó là biện pháp SỐNG SÓT được khi về sau có người thêm một kích hoạt tự động</span></div>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Một PR từ fork được nhốt kín khá tốt theo mặc định, một người có quyền ghi thì không bị ràng buộc theo thiết kế, và toàn bộ câu hỏi bảo mật thực dụng nằm ở HÀNG GIỮA — mã của bên thứ ba chạy với thông tin đăng nhập của bạn — và đó là lý do việc GHIM đáng giá hơn mọi mục khác trong danh sách.</p>
</div>

<h3>Mỗi mối nguy một lớp chặn, và cách biết lớp đó còn sống</h3>
${slide('ga-06', 22, 'Mỗi mối nguy có một lớp chặn, và mỗi lớp chặn có một cách kiểm xem nó còn nguyên')}
<p>Một biện pháp không kiểm được là một biện pháp sẽ mất. Cột bên phải của bảng mới là điểm chính: hàng nào cũng có thứ bạn CHẠY hoặc ĐỌC được — một luật của zizmor (bài 6.5), một khối trong log, một trạng thái job — để biện pháp được xác minh ở mọi thay đổi thay vì được nhớ.</p>
<h3>Danh sách siết chặt cho một kho mới</h3>
<ol>
<li><strong>Settings → Actions → General:</strong> workflow permissions để <em>read</em>; tắt "Allow GitHub Actions to create and approve pull requests"; với kho công khai, bắt duyệt workflow của người đóng góp bên ngoài (mặc định là với người đóng góp lần đầu).</li>
<li><strong>Mọi tệp workflow:</strong> <code>permissions: contents: read</code> ở đầu; nới theo từng job.</li>
<li><strong>Mọi <code>uses:</code>:</strong> SHA đủ 40 ký tự kèm chú thích phiên bản, và một mục <code>github-actions</code> trong <code>dependabot.yml</code> (Chương 4).</li>
<li><strong>Mọi <code>run:</code>:</strong> dữ liệu sự kiện và input đi qua <code>env:</code> và <code>"$VAR"</code> có nháy (Chương 3).</li>
<li><strong>Mọi <code>actions/checkout</code> trong job tải artifact lên hoặc chạy mã bên thứ ba:</strong> <code>persist-credentials: false</code>.</li>
<li><strong>Thông tin đăng nhập production:</strong> để trong environment có người duyệt và luật nhánh — hoặc thay bằng OIDC nếu đích hỗ trợ.</li>
<li><strong>CI:</strong> actionlint và zizmor ở mọi pull request đụng tới <code>.github/</code>.</li>
</ol>
<div class="callout warn">
<p><strong>Danh sách này KHÔNG làm được gì.</strong> Nó thu hẹp hàng một và hàng hai. Nó không làm gì với hàng ba — người có quyền ghi — thứ được xử lý NGOÀI Actions: branch protection hoặc ruleset trên <code>main</code>, bắt review cho thay đổi trong <code>.github/</code> (một mục <code>CODEOWNERS</code> cộng luật "Require review from Code Owners"), và một danh sách ngắn người có quyền admin.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Bạn sẽ bảo mật pipeline CI/CD của một kho vừa được giao thế nào?</strong><br>Đ: Tôi bắt đầu bằng kiểm kê thay vì cảm tính: chạy zizmor và actionlint, đọc quyền mặc định của token, liệt kê secret và workflow nào dùng chúng. Rồi làm theo thứ tự rủi ro gỡ được mỗi giờ: ghim SHA cho action trong những workflow cầm thông tin đăng nhập production, thêm <code>permissions:</code> cho mọi workflow, chuyển thông tin đăng nhập deploy vào environment có người duyệt và luật nhánh — hoặc sang OIDC — và đưa hai công cụ soát vào CI để giữ nguyên trạng thái đó.</p>
<p><strong>H: Environment của GitHub cho bạn thứ gì mà secret cấp kho không có?</strong><br>Đ: Một cái CỔNG. Secret của environment chỉ tới job khai environment đó, và chỉ sau khi luật bảo vệ qua hết — người duyệt, hẹn giờ, nhánh được phép. Tôi đã đo cả ba trên sân tập: job đứng chờ duyệt, job ở sai nhánh bị từ chối trước khi có runner, và job không khai environment nhận chuỗi rỗng ở chỗ lẽ ra là secret.</p>
<p><strong>H: Pull request từ fork có nhận được secret của tôi không?</strong><br>Đ: Với sự kiện <code>pull_request</code> thì không: không secret nào, token chỉ đọc. Nguy hiểm là <code>pull_request_target</code>, thứ chạy với secret của kho gốc và token có quyền ghi — chỉ an toàn chừng nào nó không bao giờ checkout rồi chạy mã của PR.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn sắp cho một bạn cùng nhóm deploy từ kho của mình. Bạn muốn production phải qua bạn duyệt, và chỉ từ <code>main</code>.</p><ol>
<li>Trong một kho thử (công khai, hoặc gói trả phí): Settings → Environments → New environment <code>thu-prod</code>. Thêm chính bạn làm người duyệt bắt buộc; ở deployment branches chọn "Selected branches" và thêm <code>main</code>.</li>
<li>Thêm một secret của environment: <code>gh secret set THU_ENV --env thu-prod -b 'gia-tri-env-gia'</code>, và một secret cấp kho cùng tên với giá trị có độ dài khác.</li>
<li>Thêm workflow hai job: một job không có <code>environment:</code>, một job có <code>environment: thu-prod</code>; cả hai in <code>&#36;{#VAR}</code> (độ dài) của <code>env: VAR: &#36;{{ secrets.THU_ENV }}</code>.</li>
<li>Push từ một nhánh tính năng; rồi chạy từ <code>main</code> và duyệt bằng nút "Review deployments".</li>
<li>Dọn: xoá cả hai secret và environment.</li></ol>
<p><strong>Đạt khi:</strong> run từ nhánh tính năng cho thấy job có environment bị luật nhánh từ chối; run từ <code>main</code> cho thấy job chờ tới khi bạn duyệt; và hai độ dài in ra chứng minh secret của environment thắng secret của kho.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Attack surface (bề mặt tấn công)</span><span class="v">Mọi thứ kẻ tấn công tác động được, và mỗi tác động với tới đâu.</span></div>
  <div class="kv"><span class="k">Environment (môi trường triển khai)</span><span class="v">Một đích có tên với secret, biến và luật bảo vệ riêng; job tham gia bằng <code>environment:</code>.</span></div>
  <div class="kv"><span class="k">Required reviewers (người duyệt bắt buộc)</span><span class="v">Tối đa sáu người hoặc nhóm; một người duyệt là job được chạy.</span></div>
  <div class="kv"><span class="k">Deployment branch rule (luật nhánh)</span><span class="v">Nhánh hay thẻ nào được dùng environment; kiểm trước khi cấp runner.</span></div>
  <div class="kv"><span class="k">Pending deployment</span><span class="v">Job đang chờ duyệt; thấy và duyệt được trên giao diện hoặc API.</span></div>
  <div class="kv"><span class="k">CODEOWNERS</span><span class="v">Tệp gán người sở hữu cho đường dẫn như <code>.github/</code>; kèm luật "Require review from Code Owners" thì họ bắt buộc phải duyệt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ba nhân vật, ba biện pháp khác nhau: người đóng góp từ fork (giữ dữ liệu của họ ngoài lệnh), action bên thứ ba (ghim, thu hẹp, đặt cổng), người có quyền ghi (review, branch protection).</li>
<li>Environment là một cổng: người duyệt, luật nhánh, secret chỉ đọc sau khi duyệt — cả ba đã đo trên sân tập.</li>
<li>Secret của environment thắng secret cùng tên của kho, và không tồn tại với job không khai environment.</li>
<li>Có environment thì <code>sub</code> của OIDC thành <code>…:environment:&lt;ten&gt;</code> — thứ tốt nhất để cloud khớp.</li>
<li>api-backend ngày 24/09/2026: 14 workflow, 0/24 ghim SHA, 2/14 có <code>permissions:</code>, token mặc định <code>read</code>, 0 environment — cùng hình dạng, số lớn hơn.</li>
<li>Biện pháp nào cũng cần một phép kiểm chạy được; không thì nó mục dần trong im lặng.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Deployments and environments</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments — người duyệt bắt buộc (tối đa sáu), hẹn giờ, luật nhánh, secret của environment, và gói nào có chúng với kho riêng tư.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run 36006295900 trên sân tập — một cổng environment, đo thật</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36006295900 — job đứng chờ, lượt bị luật nhánh từ chối và secret của environment trong bài này.</span></span></div>

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
${slide('ga-06', 24, 'Same script, two operating systems: on macOS the columns shift because BSD wc -l pads its output')}
<p>The sandbox ran the script on two runners in one matrix (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36006867501" target="_blank" rel="noopener">36006867501</a>). The numbers agreed; the text did not. On <code>macos-15</code>, every count that came from <code>wc -l</code> arrived with leading spaces — <code>0 /        8</code> instead of <code>0 / 8</code> — because BSD <code>wc</code>, which macOS ships, right-aligns its number in a field and GNU <code>wc</code> on Linux does not. The same thing happens on a Mac laptop: running the script against api-backend locally printed <code>0 /       24 da ghim SHA</code>.</p>
<p>Here it only costs alignment, because the script compares with <code>-le</code>, which ignores the spaces. It would be a real bug in a comparison such as <code>[ "$n" = "0" ]</code>, which is false for <code>"       0"</code> — a check that silently never passes on the developer&#39;s Mac and always passes in CI. Two portable fixes:</p>
<pre><code>n=$(grep -l 'pull_request_target' $W/*.yml | wc -l | tr -d ' ')   <span class="tok-comment"># strip the padding</span>
n=$(( $(grep -l 'pull_request_target' $W/*.yml | wc -l) ))       <span class="tok-comment"># arithmetic ignores it</span></code></pre>

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
grep -h -A40 '^\\s*run:' \$W/*.yml | grep -c '&#36;{{ *github\\.event\\.'

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
  "&#36;{{ secrets.VPS_HOST }}" "&#36;{{ secrets.VPS_USER }}" > ~/.ssh/config</div>

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

<h3>Breaking it on purpose — and the bug that showed up</h3>
<p>The trap above says to make the check fail deliberately before trusting it. The sandbox workflow does exactly that as a step: copy <code>.github/</code> to a temporary directory, add a draft file containing <code>on: pull_request_target</code>, run the script there. It went from one to two — the check can fail, good. But why <em>one</em>? The sandbox had no workflow using <code>pull_request_target</code> at all (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36007044889" target="_blank" rel="noopener">36007044889</a>).</p>
${slide('ga-06', 25, 'The deliberate-failure test: the check catches the draft file — and also flags itself')}
<p><code>grep -n</code> answered it. The only file matching was the audit workflow itself: its step <em>name</em> mentions <code>pull_request_target</code>, and so does the <code>printf</code> that writes the draft file. Grep matches characters, not YAML keys, so a workflow that merely <em>talks about</em> the dangerous trigger is counted as using it. That is the honest limit of a forty-line grep script: it is a smoke detector, good at "look here", unable to say "this is a trigger". A tool that parses the YAML — actionlint, zizmor — reads <code>on:</code> as a key and does not make that mistake.</p>
<div class="callout ok">
<p><strong>Two lessons from one run.</strong> The deliberate failure proved the check is alive. The unexplained baseline found a false positive that had been there since the first commit of the workflow. Both came from the same habit as the <code>grep -c</code> story above: when a number is not the number you expected, find out why before moving on.</p>
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

<h3>The real tools: zizmor on api-backend</h3>
<p>The kv-grid above recommends running the real tools alongside the script. Here is what that looks like on this course&#39;s own repository. zizmor 1.30.1 in offline mode (no network, no token), run locally in a container against a read-only copy of api-backend&#39;s <code>.github/workflows</code> on 24/09/2026:</p>
<pre><code>docker run --rm -v "$PWD/.github":/w/.github:ro -w /w \\
  ghcr.io/zizmorcore/zizmor:latest --offline --format plain .github/workflows</code></pre>
<div class="out">194 findings (134 suppressed, 16 unsafe fixes): 4 informational, 0 low, 25 medium, 31 high</div>
${slide('ga-06', 26, 'zizmor on api-backend&#39;s 14 workflows: 60 findings, grouped by rule')}
<p>"Suppressed" findings are ones below zizmor&#39;s default confidence or persona; the 60 it shows group into six rules. Most of them are the chapter&#39;s own conclusions, rediscovered by a tool that knows nothing about this course: <code>unpinned-uses</code> (24) is Lesson 4.2&#39;s "0 of 21 pinned", <code>excessive-permissions</code> (17) is Lesson 6.2&#39;s missing <code>permissions:</code>, <code>artipacked</code> (8) is Lesson 4.3&#39;s checkout credential. Two rules are new:</p>
<div class="kv-grid">
<div class="kv"><span class="k">template-injection · 4 high, 3 low</span><span class="v">all in <code>desktop-release.yml</code>: <code>VER=&#39;&#36;{{ inputs.version }}&#39;</code> and three more uses of that input inside <code>run:</code>. The grep script reported 0 because it only looks for <code>github.event.*</code>. The practical risk is low — only someone with write access can start a <code>workflow_dispatch</code> and type that input (row three of Lesson 6.4) — but the fix is the same two lines as Lesson 3.1: move it into <code>env:</code> and use <code>"$VER"</code></span></div>
<div class="kv"><span class="k">cache-poisoning · 3</span><span class="v">in <code>deploy-ghcr.yml</code>: the job that publishes the production image restores caches (<code>actions/cache</code>, <code>setup-node</code> with <code>cache: npm</code>). A cache written by a less trusted run could influence what gets built and shipped. The usual advice is to not restore caches in release jobs — Chapter 5 weighs that against speed</span></div>
</div>
${slide('ga-06', 27, 'Three tools, three depths: the grep script, actionlint and zizmor — use all three')}
<p>The sandbox ran the same tools in CI, in a job with <code>permissions: {}</code> and no secrets: actionlint 1.7.12 reported nothing, zizmor reported 59 findings (38 suppressed) on the chapter&#39;s deliberately loose workflows — including one <code>excessive-permissions</code> error for the job that uses <code>write-all</code>, exactly the job Lesson 6.2 used to show why not to. A minimal CI job for your own repository:</p>
<pre><code class="language-yaml">name: soat-workflow
on:
  pull_request:
    paths: ['.github/**']
permissions: {}
jobs:
  soat:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4          # pin by SHA in your repository
        with:
          persist-credentials: false
      - run: pipx run zizmor --offline --format plain .github/workflows</code></pre>
<div class="callout warn">
<p><strong>Start as information, not as a gate.</strong> Sixty findings on day one means a required check would block every pull request. Run it non-blocking, fix the high-confidence rows first (template injection, pinning in workflows with production secrets), and make it required when the count reaches zero — the same advice this lesson gave for the grep script.</p>
</div>

<div class="callout">
<p><strong>Interview questions you are likely to get.</strong></p>
<p><strong>Q: How do you check GitHub Actions workflows for security problems automatically?</strong><br>A: Two tools on every pull request that touches <code>.github/</code>: actionlint for correctness — syntax, expressions, action inputs, shellcheck on <code>run:</code> — and zizmor for security — template injection, unpinned actions, excessive permissions, credential persistence, cache poisoning. Neither needs secrets or permissions, so the job can run with <code>permissions: {}</code>.</p>
<p><strong>Q: Your audit shows zero problems. How do you know the audit works?</strong><br>A: I make it fail on purpose — add a draft file with the pattern it should catch and confirm the count goes up — and I check that the baseline is explainable. On a sandbox, that exercise found a false positive: a grep-based check counting a workflow that only mentioned the dangerous trigger in a step name.</p>
<p><strong>Q: A script works in CI but gives odd output on a developer&#39;s Mac. Where do you look?</strong><br>A: At the BSD-versus-GNU differences in the tools it calls. <code>wc -l</code> pads with spaces on macOS; <code>sed -i</code> needs an argument there; <code>date</code> and <code>grep -P</code> differ. I strip padding with <code>tr -d ' '</code> or arithmetic expansion, and I run the script on both OSes in a matrix.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you want an audit of your own repository&#39;s workflows that you can rerun at will — and you want to know it actually works.</p><ol>
<li>Run zizmor on your repository: <code>pipx run zizmor --offline .github/workflows</code> (or the container command from this lesson). Write down the total and the top three rules.</li>
<li>Fix one high-confidence finding (for example move an <code>inputs.*</code> or <code>github.event.*</code> expression from <code>run:</code> into <code>env:</code>), and run zizmor again.</li>
<li>Run the audit script from this lesson in the same repository; compare its injection count with zizmor&#39;s and explain the difference.</li>
<li>Break it on purpose: copy <code>.github</code> to a temporary directory, add a draft workflow with <code>on: pull_request_target</code>, and run the script there.</li>
<li>If you have a Mac and a Linux machine (or a CI matrix), run the script on both and compare the output.</li></ol>
<p><strong>Done when:</strong> you have a before/after zizmor count that differs by at least one; you can say in one sentence why the grep script and zizmor disagree on injection; the draft file raised the <code>pull_request_target</code> count by one; and you know whether your own output has the macOS padding.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Audit script (script soát)</span><span class="v">A repeatable check over the workflow files; cheap enough to run on every change.</span></div>
  <div class="kv"><span class="k">actionlint</span><span class="v">Linter for workflow files: syntax, expressions, action inputs, shellcheck on <code>run:</code>.</span></div>
  <div class="kv"><span class="k">zizmor</span><span class="v">Security scanner for GitHub Actions: injection, pinning, permissions, credential persistence, cache poisoning.</span></div>
  <div class="kv"><span class="k">False positive (báo nhầm)</span><span class="v">A finding where nothing is wrong — here, a workflow that only mentions a trigger.</span></div>
  <div class="kv"><span class="k">Deliberate failure test</span><span class="v">Making a check fail on purpose to prove it can.</span></div>
  <div class="kv"><span class="k">BSD vs GNU tools</span><span class="v">macOS and Linux ship different <code>wc</code>, <code>sed</code>, <code>date</code>, <code>grep</code>; output and flags differ.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The six-grep script reproduces the chapter&#39;s audit in under a second — and must be rerun, because the numbers drift (api-backend: 11 → 14 workflows).</li>
<li>On macOS, BSD <code>wc -l</code> pads numbers; strip with <code>tr -d ' '</code> or <code>$(( ))</code> before comparing strings.</li>
<li>Breaking the check on purpose proved it alive and exposed a false positive: grep counts text, not YAML keys.</li>
<li>zizmor on api-backend: 60 findings in six rules, including 4 high-confidence template injections via <code>inputs.version</code> that the grep script cannot see.</li>
<li>actionlint (correctness) + zizmor (security) run with <code>permissions: {}</code> and no secrets; start non-blocking, then require.</li>
<li>No tool checks the repository settings or who has write access — those stay manual.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">zizmor — audit rules</span><span class="lc-sub">docs.zizmor.sh/audits — every rule used in this lesson (template-injection, unpinned-uses, excessive-permissions, artipacked, cache-poisoning) with examples and fixes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox runs 36006867501 and 36007044889 — the audit on Linux and macOS</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36007044889 — the grep script on two OSes, the deliberate failure, actionlint 1.7.12 and zizmor 1.30.1 in CI.</span></span></div>

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
${slide('ga-06', 24, 'Cùng script, hai hệ điều hành: trên macOS các cột lệch vì wc -l của BSD đệm dấu cách')}
<p>Sân tập chạy script trên hai runner trong cùng một ma trận (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36006867501" target="_blank" rel="noopener">36006867501</a>). Con số khớp nhau; chữ thì không. Trên <code>macos-15</code>, mọi con số lấy từ <code>wc -l</code> tới kèm dấu cách phía trước — <code>0 /        8</code> thay vì <code>0 / 8</code> — vì <code>wc</code> bản BSD mà macOS mang theo căn phải con số trong một ô, còn <code>wc</code> bản GNU trên Linux thì không. Trên laptop Mac cũng y hệt: chạy script với api-backend ở máy in ra <code>0 /       24 da ghim SHA</code>.</p>
<p>Ở đây nó chỉ tốn chuyện thẳng hàng, vì script so bằng <code>-le</code>, thứ bỏ qua dấu cách. Nó sẽ thành lỗi THẬT trong một phép so như <code>[ "$n" = "0" ]</code>, vốn sai với <code>"       0"</code> — một phép kiểm lặng lẽ không bao giờ qua trên máy Mac của lập trình viên và luôn qua trên CI. Hai cách sửa chạy được mọi nơi:</p>
<pre><code>n=$(grep -l 'pull_request_target' $W/*.yml | wc -l | tr -d ' ')   <span class="tok-comment"># bo dau cach dem</span>
n=$(( $(grep -l 'pull_request_target' $W/*.yml | wc -l) ))       <span class="tok-comment"># so hoc tu bo qua</span></code></pre>

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
grep -h -A40 '^\\s*run:' \$W/*.yml | grep -c '&#36;{{ *github\\.event\\.'

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
  "&#36;{{ secrets.VPS_HOST }}" "&#36;{{ secrets.VPS_USER }}" > ~/.ssh/config</div>

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

<h3>Cố ý làm hỏng nó — và con lỗi lòi ra</h3>
<p>Cái bẫy bên trên dặn phải cố ý làm phép kiểm hỏng trước khi tin nó. Workflow của sân tập làm đúng việc đó thành một bước: chép <code>.github/</code> sang thư mục tạm, thêm một tệp nháp chứa <code>on: pull_request_target</code>, rồi chạy script ở đó. Con số đi từ một lên hai — phép kiểm hỏng được, tốt. Nhưng vì sao lại là <em>MỘT</em>? Sân tập không có workflow nào dùng <code>pull_request_target</code> cả (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36007044889" target="_blank" rel="noopener">36007044889</a>).</p>
${slide('ga-06', 25, 'Phép thử làm hỏng: bộ kiểm bắt được tệp nháp — và cũng bắt nhầm chính nó')}
<p><code>grep -n</code> trả lời. Tệp duy nhất khớp là chính workflow soát: <em>TÊN</em> bước của nó nhắc tới <code>pull_request_target</code>, và <code>printf</code> ghi tệp nháp cũng vậy. Grep khớp KÝ TỰ, không khớp khoá YAML, nên một workflow chỉ <em>NÓI VỀ</em> trigger nguy hiểm cũng bị đếm là đang dùng nó. Đó là giới hạn trung thực của một script grep bốn mươi dòng: nó là đầu báo khói, giỏi nói "nhìn chỗ này", không nói được "đây là một trigger". Công cụ đọc hiểu YAML — actionlint, zizmor — đọc <code>on:</code> như một khoá và không mắc lỗi đó.</p>
<div class="callout ok">
<p><strong>Hai bài học từ một run.</strong> Phép làm hỏng có chủ đích chứng minh phép kiểm còn sống. Con số gốc không giải thích được thì tìm ra một ca báo nhầm có từ commit đầu tiên của workflow. Cả hai đến từ cùng thói quen với chuyện <code>grep -c</code> ở trên: khi một con số không phải con số bạn chờ đợi, tìm ra vì sao trước khi đi tiếp.</p>
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

<h3>Công cụ thật: zizmor trên api-backend</h3>
<p>Lưới kv phía trên khuyên chạy công cụ thật song song với script. Đây là hình hài chuyện đó trên chính kho của khoá học. zizmor 1.30.1 ở chế độ offline (không mạng, không token), chạy ở máy trong một container trên bản chỉ-đọc của <code>.github/workflows</code> của api-backend, ngày 24/09/2026:</p>
<pre><code>docker run --rm -v "$PWD/.github":/w/.github:ro -w /w \\
  ghcr.io/zizmorcore/zizmor:latest --offline --format plain .github/workflows</code></pre>
<div class="out">194 findings (134 suppressed, 16 unsafe fixes): 4 informational, 0 low, 25 medium, 31 high</div>
${slide('ga-06', 26, 'zizmor trên 14 workflow của api-backend: 60 phát hiện, gom theo luật')}
<p>Phát hiện "suppressed" (bị ẩn) là những cái dưới ngưỡng tin cậy mặc định của zizmor; 60 cái nó hiện ra gom vào sáu luật. Phần lớn chính là kết luận của các chương, được một công cụ chẳng biết gì về khoá học tìm lại: <code>unpinned-uses</code> (24) là "0 trên 21 ghim" của bài 4.2, <code>excessive-permissions</code> (17) là chuyện thiếu <code>permissions:</code> của bài 6.2, <code>artipacked</code> (8) là cái khoá checkout để lại của bài 4.3. Có hai luật mới:</p>
<div class="kv-grid">
<div class="kv"><span class="k">template-injection · 4 cao, 3 thấp</span><span class="v">tất cả ở <code>desktop-release.yml</code>: <code>VER=&#39;&#36;{{ inputs.version }}&#39;</code> và thêm ba chỗ dùng input đó trong <code>run:</code>. Script grep báo 0 vì nó chỉ tìm <code>github.event.*</code>. Rủi ro thực tế thấp — chỉ người có quyền ghi mới bấm <code>workflow_dispatch</code> và gõ được input đó (hàng ba của bài 6.4) — nhưng cách vá vẫn là hai dòng như bài 3.1: đưa vào <code>env:</code> rồi dùng <code>"$VER"</code></span></div>
<div class="kv"><span class="k">cache-poisoning (đầu độc cache) · 3</span><span class="v">ở <code>deploy-ghcr.yml</code>: job phát hành ảnh production khôi phục cache (<code>actions/cache</code>, <code>setup-node</code> với <code>cache: npm</code>). Một cache do một lần chạy kém tin cậy hơn ghi vào có thể ảnh hưởng tới thứ được dựng và giao đi. Lời khuyên thường gặp là đừng khôi phục cache trong job phát hành — Chương 5 cân chuyện đó với tốc độ</span></div>
</div>
${slide('ga-06', 27, 'Ba công cụ, ba độ sâu: script grep, actionlint và zizmor — dùng cả ba')}
<p>Sân tập chạy cùng các công cụ ấy trong CI, ở một job <code>permissions: {}</code> không secret: actionlint 1.7.12 không báo gì, zizmor báo 59 phát hiện (38 bị ẩn) trên các workflow cố ý lỏng lẻo của chương — gồm một lỗi <code>excessive-permissions</code> cho đúng job dùng <code>write-all</code>, job mà bài 6.2 dùng để cho thấy vì sao đừng dùng nó. Một job CI tối thiểu cho kho của bạn:</p>
<pre><code class="language-yaml">name: soat-workflow
on:
  pull_request:
    paths: ['.github/**']
permissions: {}
jobs:
  soat:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4          # o kho that: ghim SHA
        with:
          persist-credentials: false
      - run: pipx run zizmor --offline --format plain .github/workflows</code></pre>
<div class="callout warn">
<p><strong>Bắt đầu ở dạng thông tin, chưa làm cổng chặn.</strong> Sáu mươi phát hiện ngày đầu nghĩa là một ô kiểm bắt buộc sẽ chặn MỌI pull request. Chạy nó không chặn, vá các hàng độ tin cao trước (template injection, ghim SHA ở workflow cầm secret production), rồi chuyển thành bắt buộc khi con số về không — đúng lời khuyên bài này đã dành cho script grep.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Bạn kiểm tự động vấn đề bảo mật của workflow GitHub Actions thế nào?</strong><br>Đ: Hai công cụ ở mọi pull request đụng tới <code>.github/</code>: actionlint cho tính đúng — cú pháp, biểu thức, input của action, shellcheck trên <code>run:</code> — và zizmor cho bảo mật — template injection, action chưa ghim, quyền thừa, khoá checkout bị giữ, đầu độc cache. Không cái nào cần secret hay quyền, nên job chạy được với <code>permissions: {}</code>.</p>
<p><strong>H: Cuộc soát báo không có vấn đề nào. Làm sao biết cuộc soát chạy đúng?</strong><br>Đ: Tôi cố ý làm nó hỏng — thêm một tệp nháp có mẫu nó phải bắt và xác nhận con số tăng — và kiểm xem con số gốc có giải thích được không. Trên sân tập, bài tập đó tìm ra một ca báo nhầm: phép kiểm bằng grep đếm cả một workflow chỉ nhắc tới trigger nguy hiểm trong tên bước.</p>
<p><strong>H: Một script chạy đúng trên CI nhưng ra output lạ trên máy Mac của đồng nghiệp. Bạn nhìn vào đâu?</strong><br>Đ: Khác biệt BSD và GNU trong các công cụ nó gọi. <code>wc -l</code> đệm dấu cách trên macOS; <code>sed -i</code> ở đó đòi một tham số; <code>date</code> và <code>grep -P</code> khác nhau. Tôi bỏ phần đệm bằng <code>tr -d ' '</code> hoặc phép tính số học, và chạy script trên cả hai hệ điều hành trong một ma trận.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn muốn một cuộc soát workflow của kho mình chạy lại được bất cứ lúc nào — và muốn biết chắc nó thật sự hoạt động.</p><ol>
<li>Chạy zizmor trên kho của bạn: <code>pipx run zizmor --offline .github/workflows</code> (hoặc lệnh container trong bài). Ghi lại tổng số và ba luật đứng đầu.</li>
<li>Vá một phát hiện độ tin cao (ví dụ đưa một biểu thức <code>inputs.*</code> hay <code>github.event.*</code> từ <code>run:</code> vào <code>env:</code>), rồi chạy zizmor lại.</li>
<li>Chạy script soát của bài này trong cùng kho; so số injection của nó với zizmor và giải thích vì sao khác.</li>
<li>Cố ý làm hỏng: chép <code>.github</code> sang thư mục tạm, thêm một workflow nháp có <code>on: pull_request_target</code>, rồi chạy script ở đó.</li>
<li>Nếu có cả máy Mac và máy Linux (hoặc một ma trận CI), chạy script trên cả hai và so output.</li></ol>
<p><strong>Đạt khi:</strong> bạn có số zizmor trước/sau lệch nhau ít nhất một; bạn nói được trong một câu vì sao script grep và zizmor bất đồng về injection; tệp nháp làm số <code>pull_request_target</code> tăng một; và bạn biết output của mình có bị đệm kiểu macOS hay không.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Audit script (script soát)</span><span class="v">Phép kiểm lặp lại được trên các tệp workflow; đủ rẻ để chạy ở mọi thay đổi.</span></div>
  <div class="kv"><span class="k">actionlint</span><span class="v">Công cụ lint cho tệp workflow: cú pháp, biểu thức, input của action, shellcheck trên <code>run:</code>.</span></div>
  <div class="kv"><span class="k">zizmor</span><span class="v">Công cụ quét bảo mật cho GitHub Actions: injection, ghim, quyền, khoá bị giữ, đầu độc cache.</span></div>
  <div class="kv"><span class="k">False positive (báo nhầm)</span><span class="v">Một phát hiện mà thật ra chẳng có gì sai — ở đây là workflow chỉ nhắc tới một trigger.</span></div>
  <div class="kv"><span class="k">Phép thử làm hỏng có chủ đích</span><span class="v">Cố ý làm một phép kiểm hỏng để chứng minh nó hỏng được.</span></div>
  <div class="kv"><span class="k">Công cụ BSD và GNU</span><span class="v">macOS và Linux mang <code>wc</code>, <code>sed</code>, <code>date</code>, <code>grep</code> khác nhau; output và cờ khác nhau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Script sáu lệnh grep tái tạo cuộc soát của chương trong chưa tới một giây — và phải chạy lại, vì con số trôi (api-backend: 11 → 14 workflow).</li>
<li>Trên macOS, <code>wc -l</code> bản BSD đệm con số; bỏ bằng <code>tr -d ' '</code> hoặc <code>$(( ))</code> trước khi so chuỗi.</li>
<li>Cố ý làm hỏng phép kiểm chứng minh nó còn sống và lòi ra một ca báo nhầm: grep đếm chữ, không đếm khoá YAML.</li>
<li>zizmor trên api-backend: 60 phát hiện trong sáu luật, gồm 4 template injection độ tin cao qua <code>inputs.version</code> mà script grep không thấy.</li>
<li>actionlint (tính đúng) + zizmor (bảo mật) chạy với <code>permissions: {}</code> và không secret; bắt đầu không chặn, rồi mới bắt buộc.</li>
<li>Không công cụ nào kiểm cài đặt của kho hay ai có quyền ghi — phần đó vẫn làm tay.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">zizmor — các luật soát</span><span class="lc-sub">docs.zizmor.sh/audits — mọi luật dùng trong bài (template-injection, unpinned-uses, excessive-permissions, artipacked, cache-poisoning) kèm ví dụ và cách vá.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run 36006867501 và 36007044889 trên sân tập — cuộc soát trên Linux và macOS</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36007044889 — script grep trên hai hệ điều hành, phép làm hỏng có chủ đích, actionlint 1.7.12 và zizmor 1.30.1 trong CI.</span></span></div>

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
      description: 'Mười câu tình huống: che *** lọt ở đâu, add-mask nhiều dòng, output mang secret, khối permissions của job thay thế, permissions: {} trên kho công khai, claim sub của OIDC, environment, và vì sao zizmor thấy thứ grep không thấy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>What Chapter 6 measured</h2>
<p class="lead">Ten situations, fifteen minutes. Every correct answer was measured on the sandbox repository with fake secrets on 24 September 2026 — so if an option sounds plausible but contradicts a log you saw in the chapter, trust the log.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say which transformations of a secret are masked in a log and which leak.</li>
<li>I can register a multi-line derived value with <code>::add-mask::</code> correctly.</li>
<li>I can read a job&#39;s effective token scopes and explain a 403 "Resource not accessible by integration".</li>
<li>I can explain how job-level <code>permissions:</code> interacts with the workflow level.</li>
<li>I can read the claims of an OIDC token and write a <code>sub</code> condition that allows only one environment.</li>
<li>I can set up an environment with a reviewer and a branch rule, and run zizmor on a repository.</li>
</ul>
${slide('ga-06', 29, 'Chapter 6 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Chương 6 đã đo được gì</h2>
<p class="lead">Mười tình huống, mười lăm phút. Mọi đáp án đúng đều đã được đo trên kho sân tập bằng secret giả ngày 24/09/2026 — nên nếu một phương án nghe hợp lý mà trái với một dòng log bạn đã thấy trong chương, hãy tin cái log.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được phép biến đổi secret nào bị che trong log và phép nào lọt.</li>
<li>Tôi đăng ký đúng được một giá trị suy ra nhiều dòng bằng <code>::add-mask::</code>.</li>
<li>Tôi đọc được quyền thực tế của token trong một job và giải thích được lỗi 403 "Resource not accessible by integration".</li>
<li>Tôi giải thích được khối <code>permissions:</code> mức job tương tác thế nào với mức workflow.</li>
<li>Tôi đọc được claims của token OIDC và viết được điều kiện <code>sub</code> chỉ cho một environment.</li>
<li>Tôi dựng được environment có người duyệt và luật nhánh, và chạy được zizmor trên một kho.</li>
</ul>
${slide('ga-06', 29, 'Bảng tra nhanh Chương 6')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'To check which token was loaded, a step runs `echo "starts with \${TOKEN:0:8}"`, where TOKEN comes from a repository secret. What does the log show?|||Để xem token nào đã được nạp, một bước chạy `echo "bat dau bang \${TOKEN:0:8}"`, với TOKEN lấy từ một secret của kho. Log hiện gì?',
            options: [
              '`starts with ***`, because the runner masks any part of a registered secret|||`bat dau bang ***`, vì runner che mọi phần của một secret đã đăng ký',
              'The first eight characters in clear, because a substring is not the registered value|||Tám ký tự đầu, rõ nguyên văn, vì chuỗi con không phải giá trị đã đăng ký',
              'Nothing: the runner refuses to execute a step that slices a secret|||Không gì cả: runner từ chối chạy bước có cắt chuỗi secret',
              'A warning "may contain secret" and an empty string in place of the value|||Một cảnh báo "may contain secret" và chuỗi rỗng ở chỗ giá trị',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Masking replaces exact registered strings (plus a few encodings such as plain base64). The measured run printed `gia-tri-` for the first eight characters of the fake secret. The tempting answer “***” assumes masking understands parts of a value; it does not. Print a short hash instead of a prefix.|||VI: Che thay đúng chuỗi đã đăng ký (cộng vài dạng mã hoá như base64 trơn). Run đo được in ra `gia-tri-` cho tám ký tự đầu của secret giả. Phương án hấp dẫn “***” giả định bộ che hiểu được từng phần của giá trị; nó không hiểu. Hãy in một đoạn mã băm ngắn thay vì tiền tố.',
          },
          {
            question: 'A step decodes a four-line PEM key into KHOA and runs `echo "::add-mask::$KHOA"` once, then uses the key. What happens?|||Một bước giải mã một khoá PEM bốn dòng vào KHOA rồi chạy `echo "::add-mask::$KHOA"` một lần, sau đó dùng khoá. Chuyện gì xảy ra?',
            options: [
              'All four lines are registered and nothing leaks|||Cả bốn dòng được đăng ký, không có gì lọt',
              'Nothing is registered, because add-mask rejects values that contain newlines|||Không có gì được đăng ký, vì add-mask từ chối giá trị có xuống dòng',
              'All four lines are registered, but only for output of later steps|||Cả bốn dòng được đăng ký, nhưng chỉ cho output của các bước sau',
              'Only line one is registered; lines two to four are printed to the log by that same command|||Chỉ dòng một được đăng ký; dòng hai tới bốn bị chính lệnh đó in ra log',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: A workflow command is one line. The sandbox showed the three following lines of the fake key printed in clear right after the add-mask line, and a later `echo "$KHOA"` masked only line one. Masking line by line in a loop hid all four. “Nothing leaks” is the intuitive answer and exactly what the measurement disproved.|||VI: Một workflow command chỉ dài một dòng. Sân tập cho thấy ba dòng sau của khoá giả bị in rõ ngay sau dòng add-mask, và một lệnh `echo "$KHOA"` sau đó chỉ che dòng một. Che từng dòng bằng vòng lặp thì giấu được cả bốn. “Không có gì lọt” là đáp án trực giác và cũng chính là thứ phép đo đã bác bỏ.',
          },
          {
            question: 'Job A writes a secret into $GITHUB_OUTPUT and declares it as a job output. Job B (needs: A) prints `needs.A.outputs.x`. What does job B print?|||Job A ghi một secret vào $GITHUB_OUTPUT và khai nó thành output của job. Job B (needs: A) in `needs.A.outputs.x`. Job B in ra gì?',
            options: [
              'An empty string — job A logged “Skip output ‘x’ since it may contain secret” and did not pass it on|||Chuỗi rỗng — job A ghi “Skip output ‘x’ since it may contain secret” và không chuyển nó đi',
              '***, because job B re-registers every value it receives from another job|||***, vì job B đăng ký lại mọi giá trị nhận từ job khác',
              'The secret in clear, because masking does not survive the job boundary|||Secret rõ nguyên văn, vì việc che không sống sót qua ranh giới job',
              'Job B fails with an expression error because outputs cannot hold secrets|||Job B hỏng với lỗi biểu thức vì output không được chứa secret',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured at “Complete job” of the sandbox run: the runner skipped the output with that warning, and the next job printed an empty string. Option C is the most tempting because add-mask really does not survive into another job — but the runner blocks the output before that question arises. Pass the secret’s name, not its value.|||VI: Đo ở mục “Complete job” của run trên sân tập: runner bỏ output kèm cảnh báo đó, và job sau in chuỗi rỗng. Phương án C hấp dẫn nhất vì add-mask thật sự không sống sang job khác — nhưng runner đã chặn output trước khi câu hỏi đó kịp đặt ra. Hãy truyền TÊN secret, không truyền giá trị.',
          },
          {
            question: 'The workflow declares `permissions: { contents: read, statuses: write }`. One job adds `permissions: { issues: read }` and then creates a commit status. Result?|||Workflow khai `permissions: { contents: read, statuses: write }`. Một job thêm `permissions: { issues: read }` rồi tạo commit status. Kết quả?',
            options: [
              'HTTP 201: the job has contents read, statuses write and issues read combined|||HTTP 201: job có gộp contents read, statuses write và issues read',
              'HTTP 201: statuses is inherited because the job did not mention it|||HTTP 201: statuses được kế thừa vì job không nhắc tới nó',
              'HTTP 403: the job block replaces the workflow block, leaving only Issues: read and Metadata: read|||HTTP 403: khối job thay thế khối workflow, chỉ còn Issues: read và Metadata: read',
              'The workflow is rejected as invalid because permissions appears twice|||Workflow bị từ chối là không hợp lệ vì permissions xuất hiện hai lần',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Run 36006295911: job `thay-the` printed `Issues: read, Metadata: read` in Set up job and got “Resource not accessible by integration (HTTP 403)”, while the job without its own block got 201. “Inherited because not mentioned” is how people expect it to work; the job block replaces, it never merges.|||VI: Run 36006295911: job `thay-the` in `Issues: read, Metadata: read` trong Set up job và nhận “Resource not accessible by integration (HTTP 403)”, còn job không có khối riêng nhận 201. “Kế thừa vì không nhắc tới” là cách người ta tưởng; khối job THAY THẾ, không bao giờ gộp.',
          },
          {
            question: 'You tightened permissions and everything is still green. Where do you read the scopes the token of a job actually had?|||Bạn vừa siết quyền và mọi thứ vẫn xanh. Đọc quyền THẬT của token trong một job ở đâu?',
            options: [
              'In Settings → Actions → General, which shows the effective scopes per job|||Ở Settings → Actions → General, nơi hiện quyền thực tế theo từng job',
              'In the “GITHUB_TOKEN Permissions” group of the job’s Set up job log|||Trong nhóm “GITHUB_TOKEN Permissions” ở log Set up job của job',
              'By running `echo $GITHUB_TOKEN | base64 -d` in a step|||Bằng cách chạy `echo $GITHUB_TOKEN | base64 -d` trong một bước',
              'Only in the workflow file, since the file fully determines the scopes|||Chỉ trong tệp workflow, vì tệp quyết định trọn vẹn các quyền',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The runner prints the final result of all four layers (repository default, workflow, job, fork downgrade) in Set up job. The settings page shows only the repository default; the file alone is not enough because the default and the fork rule also apply; and decoding the token is neither possible nor something to print.|||VI: Runner in kết quả cuối cùng của cả bốn lớp (mặc định của kho, workflow, job, hạ cấp cho fork) trong Set up job. Trang cài đặt chỉ hiện mặc định của kho; chỉ đọc tệp là chưa đủ vì mặc định và luật fork cũng áp vào; còn giải mã token thì vừa không làm được vừa không nên in ra.',
          },
          {
            question: 'On a PUBLIC repository, a job with `permissions: {}` runs `actions/checkout` and then reads the issue list with the token. What was measured?|||Trên một kho CÔNG KHAI, một job `permissions: {}` chạy `actions/checkout` rồi đọc danh sách issue bằng token. Đo được gì?',
            options: [
              'Both succeed: none removes writes and private reads, not access to public data|||Cả hai thành công: none bỏ quyền ghi và đọc riêng tư, không bỏ quyền đọc dữ liệu công khai',
              'Checkout fails with 403 because contents is none|||Checkout hỏng với 403 vì contents là none',
              'Checkout succeeds but reading issues returns 403 because issues is none|||Checkout thành công nhưng đọc issue trả 403 vì issues là none',
              'The job is skipped because a job must have at least one scope|||Job bị bỏ qua vì job phải có ít nhất một quyền',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Run 36006295870: the `{}` job checked out the code and the `issues: none` job read the issue list (`1`). A token with fewer scopes is never less able than an anonymous visitor, who can read a public repository. On a private repository the checkout would need `contents: read` — which is why you still list it.|||VI: Run 36006295870: job `{}` checkout được mã và job `issues: none` đọc được danh sách issue (`1`). Token ít quyền không bao giờ kém hơn một khách vô danh, mà khách vô danh đọc được kho công khai. Với kho riêng tư thì checkout cần `contents: read` — lý do bạn vẫn nên liệt kê nó.',
          },
          {
            question: 'An AWS role trusts GitHub OIDC with the condition `sub` like `repo:my-org/app:*`. Why is this a problem?|||Một vai trò AWS tin OIDC của GitHub với điều kiện `sub` dạng `repo:my-org/app:*`. Vì sao đó là vấn đề?',
            options: [
              'It is not: the repository name already limits access to trusted people|||Không phải vấn đề: tên kho đã giới hạn cho người đáng tin',
              'The wildcard makes AWS skip the signature check|||Ký tự đại diện khiến AWS bỏ qua bước kiểm chữ ký',
              'It only works for pull requests, so pushes to main cannot deploy|||Nó chỉ chạy với pull request, nên push lên main không deploy được',
              'Any branch, pull request context or environment of that repository can assume the role — anyone who can push a branch|||Mọi nhánh, ngữ cảnh pull request hay environment của kho đó đều nhận được vai trò — ai push được một nhánh cũng vậy',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The part after the repository is the context (`ref:…`, `environment:…`, `pull_request`). A wildcard accepts all of them. Pin it to `environment:production` (or a protected ref) and check `aud`. The signature is still verified — the problem is what the verified token is allowed to do.|||VI: Phần sau tên kho là ngữ cảnh (`ref:…`, `environment:…`, `pull_request`). Ký tự đại diện nhận tất cả. Hãy ghim tới `environment:production` (hoặc một ref được bảo vệ) và kiểm `aud`. Chữ ký vẫn được kiểm — vấn đề là token đã kiểm ấy được phép làm gì.',
          },
          {
            question: 'A repository created in September 2026 requests an OIDC token on a push to branch `dev`. Which `sub` does it get by default?|||Một kho tạo tháng 9/2026 xin token OIDC khi push lên nhánh `dev`. Mặc định nó nhận `sub` nào?',
            options: [
              '`repo:owner/repo:ref:refs/heads/dev`|||`repo:owner/repo:ref:refs/heads/dev`',
              '`repo:owner/repo:branch:dev`|||`repo:owner/repo:branch:dev`',
              '`repo:owner@<owner-id>/repo@<repo-id>:ref:refs/heads/dev`|||`repo:owner@<ID-chủ-kho>/repo@<ID-kho>:ref:refs/heads/dev`',
              '`https://github.com/owner/repo@dev`|||`https://github.com/owner/repo@dev`',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Repositories created after 15/07/2026 carry immutable owner and repository IDs in `sub` (GitHub changelog 23/04/2026); the sandbox returned `repo:cuonghoang1103@125522434/ga-san-tap@1385223175:ref:refs/heads/ch06-bi-mat`. Option A is the classic format — still correct for older repositories such as api-backend, which is why it is tempting.|||VI: Kho tạo sau 15/07/2026 mang ID bất biến của chủ kho và kho trong `sub` (changelog GitHub 23/04/2026); sân tập trả về `repo:cuonghoang1103@125522434/ga-san-tap@1385223175:ref:refs/heads/ch06-bi-mat`. Phương án A là dạng cổ điển — vẫn đúng với kho cũ như api-backend, nên mới hấp dẫn.',
          },
          {
            question: 'CH06_TRUNG exists as a repository secret (26 characters) and as a secret of environment `production` (33 characters). A job declares `environment: production`. What does it receive?|||CH06_TRUNG có ở dạng secret của kho (26 ký tự) và secret của environment `production` (33 ký tự). Một job khai `environment: production`. Nó nhận gì?',
            options: [
              'The environment value (33) — the most specific level wins; a job without the environment gets the repository value (26)|||Giá trị của environment (33) — cấp cụ thể nhất thắng; job không khai environment nhận giá trị của kho (26)',
              'The repository value (26), because repository secrets are read first when the run is queued|||Giá trị của kho (26), vì secret của kho được đọc trước lúc run xếp hàng',
              'An empty string, because duplicate names cancel each other|||Chuỗi rỗng, vì trùng tên thì triệt tiêu nhau',
              'The run fails at queue time with a duplicate-secret error|||Run hỏng ngay lúc xếp hàng với lỗi trùng secret',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured in run 36006295900 by printing the length: `khong-env` saw 26, `co-env` saw 33. Option B mixes up two true facts — repository secrets are read at queue time, environment secrets at job start — but the later, more specific value is what the job gets.|||VI: Đo ở run 36006295900 bằng cách in độ dài: `khong-env` thấy 26, `co-env` thấy 33. Phương án B trộn hai sự thật đúng — secret của kho đọc lúc xếp hàng, secret của environment đọc lúc job bắt đầu — nhưng thứ job nhận là giá trị cụ thể hơn, đọc sau.',
          },
          {
            question: 'The chapter’s grep audit reports 0 injection risks in api-backend; zizmor reports 4 high-confidence template-injection findings. Which explanation is right?|||Script soát bằng grep của chương báo 0 rủi ro injection ở api-backend; zizmor báo 4 phát hiện template-injection độ tin cao. Giải thích nào đúng?',
            options: [
              'zizmor is wrong: only github.event.* can ever be attacker-controlled|||zizmor sai: chỉ github.event.* mới có thể do kẻ tấn công điều khiển',
              'The grep script only searches for github.event.*; zizmor flags `\${{ inputs.version }}` expanded inside run: in desktop-release.yml|||Script grep chỉ tìm github.event.*; zizmor bắt `\${{ inputs.version }}` nở bên trong run: ở desktop-release.yml',
              'The grep script missed them because of the macOS wc -l padding|||Script grep bỏ sót vì phần đệm của wc -l trên macOS',
              'They are the 27 direct interpolations of the owner’s secrets from Lesson 6.1|||Đó là 27 lượt nội suy trực tiếp secret của chủ kho ở bài 6.1',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: zizmor treats any expression expanded into a shell script as a potential injection and rates confidence; the four findings are `inputs.version` in desktop-release.yml. The practical risk is low (only people with write access can dispatch), but the fix — move it to env: and use "$VER" — is cheap. The padding bug (C) affects alignment only, and secrets (D) are not attacker-controlled.|||VI: zizmor coi mọi biểu thức nở vào script shell là injection tiềm năng và chấm độ tin; bốn phát hiện là `inputs.version` ở desktop-release.yml. Rủi ro thực tế thấp (chỉ người có quyền ghi mới dispatch được), nhưng cách vá — đưa vào env: rồi dùng "$VER" — rất rẻ. Lỗi đệm (C) chỉ ảnh hưởng thẳng hàng, và secret (D) không do kẻ tấn công điều khiển.',
          },
        ],
      },
    },

  ],
};
