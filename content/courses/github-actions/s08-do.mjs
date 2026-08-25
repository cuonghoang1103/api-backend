const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 8: Khi CI đỏ.
 * Số đo: bảng mã thoát đo bằng tiến trình thật, cú hỏng 134 của kho này,
 * và thứ tự đọc rút ra từ phương sai 1,60 lần đã đo ở Chương 7.
 */

export default {
  title: 'Chapter 8 — When CI is red|||Chương 8 — Khi CI đỏ',
  slug: 'ga-ch8-do',
  description: 'Mã thoát đo bằng tiến trình thật, không chép tài liệu: 127 là gõ sai tên, 134 là V8 hết heap, 137 là bị giết. Cộng thứ tự đọc một lần chạy đỏ, và cách phân biệt một cú hỏng thật với một lần chạy chậm.',
  sortOrder: 9,
  lessons: [

    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — Exit codes, measured rather than looked up|||8.1 — Mã thoát, ĐO chứ không tra',
      slug: 'ga-8-1-ma-thoat',
      type: 'VIDEO',
      description: 'Chạy thật từng ca: 127 là gõ sai tên, 126 là thiếu quyền, 134 là abort(), 137 là bị giết. Và V8 hết heap thoát đúng 134 — khớp với cú hỏng thật của kho này. Cộng lần thứ BA cái bẫy ống cắn chính phép đo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Exit codes, measured rather than looked up</h2>
<p class="lead">A step fails because a process exited non-zero, and the number it exited with usually names the cause precisely. The table below is worth having memorised — so rather than copying it from a manual, here it is produced by running each case.</p>

<h3>The measurement</h3>
<div class="out">lenh                                exit
--------------------------------------------
exit 0                                 0
false                                  1
lenh-khong-ton-tai                   127
tep khong co quyen thuc thi          126
kill -SEGV \$\$                        139
kill -ABRT \$\$                        134
kill -KILL \$\$                        137
kill -TERM \$\$                        143</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — a generic failure</span><span class="lz-lnote">most tools exit 1 for anything that went wrong. It tells you a tool decided to fail, and nothing more. Read the tool&#39;s output</span></div>
<div class="lz-layer"><span class="lz-lname">126 and 127 — the shell could not run it</span><span class="lz-lnote">127 is "command not found": a typo, or a step that was supposed to install it and did not. 126 is "found it, could not execute it": almost always a missing <code>chmod +x</code> on a script in the repository. Neither is a bug in your program, because your program never ran</span></div>
<div class="lz-layer"><span class="lz-lname">128 + n — killed by signal n</span><span class="lz-lnote">this is the family worth recognising on sight, because it means something <em>outside</em> the process ended it. Subtract 128 and you have the signal number</span></div>
<div class="lz-layer"><span class="lz-lname">2 — used wrongly</span><span class="lz-lnote">bash&#39;s code for a syntax error or bad usage. On a CI failure it usually means the script itself is malformed, not that the work failed</span></div>
</div>

<h3>The four signals that appear in CI</h3>
<div class="kv-grid">
<div class="kv"><span class="k">134 = 128 + 6 · SIGABRT</span><span class="v">the process called <code>abort()</code>. For anything Node-based this is almost always V8 hitting its heap limit — measured below</span></div>
<div class="kv"><span class="k">137 = 128 + 9 · SIGKILL</span><span class="v">something killed it and it could not refuse. On a runner that is the OOM killer; in Docker it is also what <code>docker stop</code> escalates to after its grace period. This repository has hit it on the VPS (2026-07-06, <code>Exited(137)</code>)</span></div>
<div class="kv"><span class="k">143 = 128 + 15 · SIGTERM</span><span class="v">a polite request to stop. A cancelled workflow job produces this — so 143 in a log usually means somebody cancelled, not that anything broke</span></div>
<div class="kv"><span class="k">139 = 128 + 11 · SIGSEGV</span><span class="v">a segfault. Rare in a JS toolchain, common in native modules — and a strong signal that a prebuilt binary does not match the platform, which Chapter 2 measured as a real failure mode</span></div>
</div>

<h3>Verifying the one that matters here</h3>
<p>This repository&#39;s most expensive failure exited <strong>134</strong>. Rather than assume that means a heap limit, squeeze a Node process and see:</p>

<div class="out">$ node --max-old-space-size=40 -e 'const a=[]; for(;;) a.push(new Array(1e6).fill(0));'
Aborted
exit THAT = 134

&lt;--- Last few GCs ---&gt;
FATAL ERROR: Reached heap limit Allocation failed</div>

<div class="callout ok">
<p><strong>134, matching the real failure exactly.</strong> Run 32400097927 printed <code>FATAL ERROR: Reached heap limit — JavaScript heap out of memory</code> and exited 134 on the macOS leg. So the chain is now established rather than assumed: V8 cannot allocate → V8 calls <code>abort()</code> → SIGABRT → 128 + 6 = 134. Seeing 134 in a Node build log is enough to know what happened before reading a single line of output.</p>
</div>

<div class="callout warn">
<p><strong>134 and 137 look similar and mean opposite things.</strong> 134 is the process deciding it cannot continue — it hit a limit <em>it</em> knows about, which for Node is the V8 heap ceiling and is raised with <code>--max-old-space-size</code>. 137 is the process being killed from outside — the machine ran out of real memory, and raising the V8 limit makes it <em>worse</em>. Reading them the wrong way round leads to exactly the wrong fix.</p>
</div>

<h3>The pipe trap, for the third time in this course</h3>
<p>The first version of the V8 measurement above was written as <code>node … | tail -3</code>, and it reported <strong>exit 0</strong>:</p>

<div class="out">node --max-old-space-size=40 -e '...'              -> exit 134
node --max-old-space-size=40 -e '...' | tail -1    -> exit 0</div>

<div class="pitfall">
<p><strong>Trap — this is the third time the same trap has caught a measurement in this course.</strong> Lesson 2.4 measured <code>set -e</code> through a <code>| grep</code> and read exit 0. Lesson 6.5&#39;s audit script used <code>grep -c</code> and undercounted by nine. And here, a <code>| tail</code> turned an exit 134 into an exit 0. Three different lessons, three different authors&#39; intentions, one default behaviour: <strong>a pipeline reports the exit code of its last command</strong>. That is why <code>shell: bash</code> — which adds <code>pipefail</code> — is the highest-value one-line change in a workflow file, and why this course keeps saying so.</p>
</div>

<h3>Reading the exit code out of a run</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">in the log</span><span class="lz-t">the last line of the failing step</span><span class="lz-d"><code>##[error]Process completed with exit code 134.</code> — the runner prints it verbatim</span></div>
<div class="lz-step"><span class="lz-k">in your own script</span><span class="lz-t">capture it before it is lost</span><span class="lz-d"><code>lenh; RC=\$?</code> on the very next line. Anything in between — an <code>echo</code>, a pipe — replaces it</span></div>
<div class="lz-step"><span class="lz-k">through a pipeline</span><span class="lz-t"><code>\${PIPESTATUS[@]}</code></span><span class="lz-d">bash keeps every stage&#39;s code in that array. It is the manual version of what <code>pipefail</code> automates</span></div>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> The exit code names the cause before the log does — 127 means it was never found, 126 means it was never executable, 134 means it gave up on itself and 137 means something else gave up on it — and all four are lost the moment the command goes through a pipe.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — EXIT STATUS</span><span class="lc-sub">man 1 bash — the documented meanings of 126, 127 and 128+n, and the statement that a pipeline&#39;s status is that of its last command unless <code>pipefail</code> is set.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">signal(7) — the signal numbers</span><span class="lc-sub">man 7 signal — the table that turns 134, 137, 139 and 143 back into SIGABRT, SIGKILL, SIGSEGV and SIGTERM, and what each one means about who ended the process.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — resource constraints and --max-old-space-size</span><span class="lc-sub">nodejs.org/api/cli.html#--max-old-space-sizesize — the V8 heap ceiling behind every 134 in a Node build, and why the default depends on the machine rather than on your code.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — exit codes, signals, and PIPESTATUS</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the full treatment, including the cases where <code>set -euo pipefail</code> still lets a failure through.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — Exited(137) and what actually killed the container</span><span class="lc-sub">/courses/docker/learn${REF} — the OOM killer versus <code>docker stop</code>, both of which produce 137 and need different responses.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Mã thoát, ĐO chứ không tra</h2>
<p class="lead">Một bước hỏng vì một tiến trình thoát khác không, và con số nó thoát bằng thường gọi tên nguyên nhân rất chính xác. Cái bảng dưới đây đáng thuộc lòng — nên thay vì chép nó từ một trang man, đây là nó được đẻ ra bằng cách CHẠY từng ca.</p>

<h3>Phép đo</h3>
<div class="out">lenh                                exit
--------------------------------------------
exit 0                                 0
false                                  1
lenh-khong-ton-tai                   127
tep khong co quyen thuc thi          126
kill -SEGV \$\$                        139
kill -ABRT \$\$                        134
kill -KILL \$\$                        137
kill -TERM \$\$                        143</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — một cú hỏng chung chung</span><span class="lz-lnote">phần lớn công cụ thoát 1 cho bất cứ chuyện gì sai. Nó cho bạn biết một công cụ đã quyết định hỏng, và không gì hơn. Hãy đọc đầu ra của công cụ ấy</span></div>
<div class="lz-layer"><span class="lz-lname">126 và 127 — shell KHÔNG chạy được nó</span><span class="lz-lnote">127 là "không tìm thấy lệnh": gõ sai, hoặc một bước lẽ ra phải cài nó mà đã không. 126 là "tìm thấy rồi mà không thực thi được": gần như luôn là thiếu <code>chmod +x</code> trên một script trong kho. Không cái nào là lỗi trong CHƯƠNG TRÌNH bạn, bởi chương trình bạn chưa hề chạy</span></div>
<div class="lz-layer"><span class="lz-lname">128 + n — bị TÍN HIỆU n giết</span><span class="lz-lnote">đây là họ đáng nhận ra ngay khi nhìn, bởi nó nghĩa là có thứ gì <em>BÊN NGOÀI</em> đã kết liễu tiến trình. Trừ 128 đi là ra số hiệu tín hiệu</span></div>
<div class="lz-layer"><span class="lz-lname">2 — dùng SAI CÁCH</span><span class="lz-lnote">mã của bash cho một lỗi cú pháp hoặc dùng sai tham số. Trên một cú hỏng CI, nó thường nghĩa là chính cái SCRIPT bị viết hỏng, chứ không phải phần việc hỏng</span></div>
</div>

<h3>Bốn tín hiệu xuất hiện trong CI</h3>
<div class="kv-grid">
<div class="kv"><span class="k">134 = 128 + 6 · SIGABRT</span><span class="v">tiến trình đã gọi <code>abort()</code>. Với bất cứ thứ gì chạy trên Node thì gần như luôn là V8 chạm trần heap của nó — đo ở dưới</span></div>
<div class="kv"><span class="k">137 = 128 + 9 · SIGKILL</span><span class="v">có thứ gì đó GIẾT nó và nó không từ chối được. Trên một runner thì đó là OOM killer; trong Docker thì đó cũng là thứ mà <code>docker stop</code> leo thang tới sau khoảng ân hạn. Kho này đã dính nó trên VPS (06/07/2026, <code>Exited(137)</code>)</span></div>
<div class="kv"><span class="k">143 = 128 + 15 · SIGTERM</span><span class="v">một lời đề nghị dừng lịch sự. Một job workflow bị HUỶ đẻ ra mã này — nên 143 trong log thường nghĩa là có người bấm huỷ, không phải có gì hỏng</span></div>
<div class="kv"><span class="k">139 = 128 + 11 · SIGSEGV</span><span class="v">một cú segfault. Hiếm trong bộ công cụ JS, thường gặp ở các module gốc — và là tín hiệu mạnh rằng một tệp nhị phân dựng sẵn KHÔNG khớp nền tảng, thứ mà Chương 2 đã đo là một kiểu hỏng có thật</span></div>
</div>

<h3>Kiểm chứng cái có ý nghĩa ở đây</h3>
<p>Cú hỏng đắt nhất của kho này thoát bằng <strong>134</strong>. Thay vì cho rằng điều đó nghĩa là chạm trần heap, hãy BÓP một tiến trình Node rồi xem:</p>

<div class="out">$ node --max-old-space-size=40 -e 'const a=[]; for(;;) a.push(new Array(1e6).fill(0));'
Aborted
exit THAT = 134

&lt;--- Last few GCs ---&gt;
FATAL ERROR: Reached heap limit Allocation failed</div>

<div class="callout ok">
<p><strong>134, khớp chính xác với cú hỏng thật.</strong> Lần chạy 32400097927 in ra <code>FATAL ERROR: Reached heap limit — JavaScript heap out of memory</code> và thoát 134 ở nhánh macOS. Nên cái chuỗi giờ được XÁC LẬP chứ không còn là phỏng đoán: V8 không cấp phát được nữa → V8 gọi <code>abort()</code> → SIGABRT → 128 + 6 = 134. Nhìn thấy 134 trong một log dựng Node là đủ biết chuyện gì đã xảy ra trước khi đọc một dòng đầu ra nào.</p>
</div>

<div class="callout warn">
<p><strong>134 và 137 trông giống nhau và mang nghĩa NGƯỢC nhau.</strong> 134 là tiến trình TỰ quyết định nó không đi tiếp được — nó chạm một cái trần mà <em>CHÍNH NÓ</em> biết, với Node thì đó là trần heap của V8 và nâng bằng <code>--max-old-space-size</code>. 137 là tiến trình bị GIẾT TỪ BÊN NGOÀI — cỗ máy cạn bộ nhớ thật, và nâng trần V8 lên chỉ làm nó <em>TỆ HƠN</em>. Đọc lẫn hai cái dẫn thẳng tới đúng cách vá sai.</p>
</div>

<h3>Cái bẫy ống, lần thứ BA trong khoá học này</h3>
<p>Bản đầu tiên của phép đo V8 bên trên được viết là <code>node … | tail -3</code>, và nó báo <strong>exit 0</strong>:</p>

<div class="out">node --max-old-space-size=40 -e '...'              -> exit 134
node --max-old-space-size=40 -e '...' | tail -1    -> exit 0</div>

<div class="pitfall">
<p><strong>Bẫy — đây là lần thứ BA cùng một cái bẫy cắn trúng một phép đo trong khoá này.</strong> Bài 2.4 đo <code>set -e</code> qua một <code>| grep</code> và đọc ra exit 0. Script soát của bài 6.5 dùng <code>grep -c</code> và đếm thiếu chín. Và ở đây, một cái <code>| tail</code> biến exit 134 thành exit 0. Ba bài khác nhau, ba ý định khác nhau của người viết, MỘT hành vi mặc định: <strong>một đường ống báo cáo mã thoát của lệnh CUỐI CÙNG của nó</strong>. Đó là lý do <code>shell: bash</code> — thứ thêm <code>pipefail</code> — là thay đổi một dòng đáng giá nhất trong một tệp workflow, và là lý do khoá học này cứ nói đi nói lại.</p>
</div>

<h3>Đọc mã thoát ra khỏi một lần chạy</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">trong log</span><span class="lz-t">dòng cuối của bước hỏng</span><span class="lz-d"><code>##[error]Process completed with exit code 134.</code> — runner in nguyên văn</span></div>
<div class="lz-step"><span class="lz-k">trong script của bạn</span><span class="lz-t">bắt lấy nó trước khi nó mất</span><span class="lz-d"><code>lenh; RC=\$?</code> ở NGAY dòng kế. Bất cứ thứ gì chen vào giữa — một <code>echo</code>, một cái ống — đều thay thế nó</span></div>
<div class="lz-step"><span class="lz-k">qua một đường ống</span><span class="lz-t"><code>\${PIPESTATUS[@]}</code></span><span class="lz-d">bash giữ mã của MỌI chặng trong cái mảng ấy. Nó là bản làm tay của thứ mà <code>pipefail</code> tự động hoá</span></div>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Mã thoát gọi tên nguyên nhân TRƯỚC cả cái log — 127 nghĩa là chưa bao giờ tìm thấy nó, 126 nghĩa là chưa bao giờ chạy được nó, 134 nghĩa là nó tự bỏ cuộc với chính mình và 137 nghĩa là thứ khác đã bỏ cuộc với nó — và cả bốn đều MẤT ngay khoảnh khắc câu lệnh đi qua một cái ống.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — EXIT STATUS</span><span class="lc-sub">man 1 bash — nghĩa chính thức của 126, 127 và 128+n, và phát biểu rằng trạng thái của một đường ống là trạng thái của lệnh CUỐI trừ khi bật <code>pipefail</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">signal(7) — số hiệu các tín hiệu</span><span class="lc-sub">man 7 signal — cái bảng biến 134, 137, 139 và 143 ngược lại thành SIGABRT, SIGKILL, SIGSEGV và SIGTERM, và mỗi cái nói gì về việc AI đã kết liễu tiến trình.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — resource constraints và --max-old-space-size</span><span class="lc-sub">nodejs.org/api/cli.html#--max-old-space-sizesize — cái trần heap của V8 đứng sau mọi con 134 trong một bản dựng Node, và vì sao mặc định của nó phụ thuộc vào CỖ MÁY chứ không phụ thuộc mã bạn.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — mã thoát, tín hiệu, và PIPESTATUS</span><span class="lc-sub">/courses/linux-bash/learn${REF} — phần trình bày đầy đủ, gồm cả những ca mà <code>set -euo pipefail</code> vẫn để lọt một cú hỏng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — Exited(137) và cái gì THẬT SỰ giết container</span><span class="lc-sub">/courses/docker/learn${REF} — OOM killer so với <code>docker stop</code>, cả hai đều đẻ ra 137 và cần hai cách phản ứng khác nhau.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — Flaky or broken, decided with arithmetic|||8.2 — Flake hay hỏng thật, quyết bằng số học',
      slug: 'ga-8-2-flake',
      type: 'VIDEO',
      description: 'Đo ba kiểu hỏng trên 40 lần chạy: thật 100%, ngẫu nhiên 20%, phụ thuộc thứ tự thì có tính quyết định. Rồi tính: với một bài hỏng 20%, "chạy lại thấy xanh" là kết quả NHIỀU KHẢ NĂNG NHẤT — nên nó không chứng minh gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Flaky or broken, decided with arithmetic</h2>
<p class="lead">"It failed, I re-ran it, it passed" is the most common sentence in CI, and it is used as a conclusion. This lesson measures what it is actually evidence of, and the answer is: usually nothing.</p>

<h3>Three kinds of failure, 40 runs each</h3>
<div class="out">loai                              hong / 40
--------------------------------------------------
THAT (1+1===3)                    40 / 40  = 100%
NGAU NHIEN (phu thuoc dong ho)     8 / 40  =  20%
PHU THUOC THU TU                  xanh khi chay MOT MINH
                                  do  khi chay SAU bai kia</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a real failure · 100%</span><span class="lz-lnote">deterministic. One green run refutes it completely, because a real failure cannot produce one</span></div>
<div class="lz-layer"><span class="lz-lname">a probabilistic flake · 20%</span><span class="lz-lnote">a clock, a race, a random seed, an external service. The rate is a property of the test and is measurable — which is the whole point of this lesson</span></div>
<div class="lz-layer"><span class="lz-lname">order dependence · not probabilistic at all</span><span class="lz-lnote">green alone, red after another test touched shared state. It has <em>no</em> failure rate; it has a precondition. Re-running changes nothing, and re-running with a different test order changes everything</span></div>
</div>

<div class="callout ok">
<p><strong>The third category is the one most often mislabelled as flake.</strong> It is fully deterministic, so it will fail identically every time the same order occurs — and pass identically otherwise. What makes it look random is that the order varies: a parallel test runner, a matrix leg, a changed file list. Diagnosing it by re-running is hopeless; diagnosing it by running the single test alone takes one command.</p>
</div>

<h3>What "re-ran it and it passed" is worth</h3>
<div class="out">p (ty le hong that)   P(hong roi xanh)   P(xanh 2 lan lien)
------------------------------------------------------------
        100%                  0,0%                 0,0%
         50%                 25,0%                25,0%
         20%                 16,0%                64,0%
          5%                  4,8%                90,2%
          1%                  1,0%                98,0%</div>

<div class="callout warn">
<p><strong>For a test that genuinely fails 20% of the time, the next run passes 80% of the time.</strong> So observing "it failed, then it passed" is the <em>most likely</em> outcome — it is what you would expect to see, and it distinguishes a 20% flake from a 5% flake not at all. The single re-run has almost no information in it, and it is treated as a verdict.</p>
</div>

<h3>How many green runs would actually mean something</h3>
<div class="out">neu ty le hong that su la 20%:  can 14 lan xanh lien tiep de tin 95%
                                can 21 lan xanh lien tiep de tin 99%
neu ty le hong that su la  5%:  can 59 lan xanh lien tiep de tin 95%
                                can 90 lan xanh lien tiep de tin 99%</div>

<div class="callout">
<p><strong>Fourteen consecutive green runs to be 95% confident a 20% flake is gone.</strong> Nobody does that, which is fine — the conclusion is not "run it fourteen times", it is that <em>confirming a fix by re-running is not practical</em>. A flake is fixed by finding the source of non-determinism and removing it, and then the green runs are a sanity check rather than the evidence.</p>
</div>

<h3>The compounding cost</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">one test, 20% failure rate</span><span class="lz-t">100 CI runs</span><span class="lz-d">expect 20 red builds</span></div>
<div class="lz-step"><span class="lz-k">each time, somebody re-runs</span><span class="lz-t">80% see green</span><span class="lz-d">and conclude "flake, ignore" — which is the locally rational decision every single time</span></div>
<div class="lz-step"><span class="lz-k">so the test is never fixed</span><span class="lz-t">and it is not a flake</span><span class="lz-d">it is a real defect that manifests one time in five, hidden behind a re-run button</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — the re-run button as a diagnostic.</strong> It is a repair tool, not a measurement: it gets the build green so work continues, which is legitimate. The failure is treating the green run as an answer. If a test has failed intermittently, the number worth having is its failure <em>rate</em> across recent runs — and that number is in the API, not in your memory of how often it feels like it happens.</p>
</div>

<h3>Deciding which one you have, in order of cost</h3>
<div class="kv-grid">
<div class="kv"><span class="k">read the error, first</span><span class="v">a real failure usually names something specific and repeatable; a flake usually names a timeout, a connection, a timestamp or an ordering. This costs nothing and settles most cases</span></div>
<div class="kv"><span class="k">run the single test in isolation, locally</span><span class="v">green alone but red in the suite is order dependence, settled in one command. This is the highest-yield check and it is almost never the one people try first</span></div>
<div class="kv"><span class="k">run it in a loop</span><span class="v"><code>for i in $(seq 50); do npm test -- -t 'ten bai'; done</code>. Gives a rate. Fifty runs of one test is seconds; fifty CI runs is an afternoon</span></div>
<div class="kv"><span class="k">count it across history</span><span class="v">the workflow-runs API gives conclusions per run. "This job has failed 9 of the last 60 times" is a very different statement from "it seems flaky", and it takes one call</span></div>
</div>

<h3>What this repository&#39;s history looks like</h3>
<div class="out">desktop-release, 12 lan gan nhat:  10 thanh cong, 2 hong
  hong #1: 80s   — hong RAT som
  hong #2: 334s  — hong giua chung
  TB thanh cong: 458s

hong #2 la run 32400097927: vite build exit 134, heap limit, CHI tren macOS</div>

<div class="callout ok">
<p><strong>Two failures out of twelve, and neither was a flake.</strong> One is documented as a heap-limit crash with a specific fix — <code>--max-old-space-size</code> plus dropping sourcemaps in CI — and the repository verified the fix by reproducing the failure at a squeezed heap and watching it go from 134 to 0. That is what settling a failure looks like: reproduce it deliberately, fix it, and reproduce the fix. Not re-run it and see.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> A real failure fails 100% of the time and one green run refutes it; a 20% flake passes on re-run 80% of the time, so the re-run tells you nothing — and the third category, order dependence, is not random at all and is diagnosed by running the test alone.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — list workflow runs, filtered by conclusion</span><span class="lc-sub">docs.github.com/en/rest/actions/workflow-runs — <code>?status=failure</code> against recent runs turns "it seems flaky" into a rate, which is the measurement this lesson argues for.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Re-running workflows and jobs</span><span class="lc-sub">docs.github.com/en/actions/managing-workflow-runs/re-running-workflows-and-jobs — including re-running only failed jobs, which is the cheap repair action as distinct from a diagnosis.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google Testing Blog — Flaky tests at Google and how we mitigate them</span><span class="lc-sub">testing.googleblog.com — the industry-scale version of this arithmetic, including the observation that a flake rate below a threshold is cheaper to quarantine than to fix, and where that threshold sits.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — test isolation, shared state, and why order matters</span><span class="lc-sub">/courses/nodejs/learn${REF} — the third failure category above, with the module-caching and global-state mechanisms that produce it.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — tests that share a database</span><span class="lc-sub">/courses/postgresql/learn${REF} — the most common real source of order dependence in a backend suite, and the transaction-per-test pattern that removes it.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Flake hay hỏng thật, quyết bằng số học</h2>
<p class="lead">"Nó hỏng, tôi chạy lại, nó qua" là câu nói phổ biến nhất trong CI, và nó được dùng như một KẾT LUẬN. Bài này đo xem nó thật ra là bằng chứng cho điều gì, và đáp án là: thường thì chẳng cho điều gì cả.</p>

<h3>Ba kiểu hỏng, mỗi kiểu 40 lần chạy</h3>
<div class="out">loai                              hong / 40
--------------------------------------------------
THAT (1+1===3)                    40 / 40  = 100%
NGAU NHIEN (phu thuoc dong ho)     8 / 40  =  20%
PHU THUOC THU TU                  xanh khi chay MOT MINH
                                  do  khi chay SAU bai kia</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một cú hỏng THẬT · 100%</span><span class="lz-lnote">có tính quyết định. MỘT lần chạy xanh bác bỏ nó hoàn toàn, bởi một cú hỏng thật không đẻ ra được một lần xanh nào</span></div>
<div class="lz-layer"><span class="lz-lname">một flake xác suất · 20%</span><span class="lz-lnote">một cái đồng hồ, một cuộc đua, một hạt ngẫu nhiên, một dịch vụ bên ngoài. Cái TỈ LỆ ấy là một tính chất của bài test và ĐO ĐƯỢC — đó là toàn bộ mục đích của bài này</span></div>
<div class="lz-layer"><span class="lz-lname">phụ thuộc thứ tự · KHÔNG hề mang tính xác suất</span><span class="lz-lnote">xanh khi chạy một mình, đỏ khi chạy sau một bài khác đã đụng vào trạng thái chung. Nó KHÔNG có tỉ lệ hỏng; nó có một ĐIỀU KIỆN TIÊN QUYẾT. Chẩn đoán nó bằng cách chạy lại là vô vọng; chẩn đoán bằng cách chạy một mình bài test ấy tốn một câu lệnh</span></div>
</div>

<div class="callout ok">
<p><strong>Loại thứ ba mới là loại hay bị gắn nhầm nhãn "flake" nhất.</strong> Nó hoàn toàn có tính quyết định, nên nó sẽ hỏng Y HỆT mỗi lần cái thứ tự ấy xảy ra — và qua y hệt vào những lần khác. Thứ làm nó TRÔNG như ngẫu nhiên là cái THỨ TỰ thay đổi: một bộ chạy test song song, một nhánh ma trận, một danh sách file đã đổi. Chẩn đoán bằng cách chạy lại thì vô vọng; chẩn đoán bằng cách chạy riêng bài test ấy tốn một câu lệnh.</p>
</div>

<h3>"Chạy lại rồi nó qua" đáng giá bao nhiêu</h3>
<div class="out">p (ty le hong that)   P(hong roi xanh)   P(xanh 2 lan lien)
------------------------------------------------------------
        100%                  0,0%                 0,0%
         50%                 25,0%                25,0%
         20%                 16,0%                64,0%
          5%                  4,8%                90,2%
          1%                  1,0%                98,0%</div>

<div class="callout warn">
<p><strong>Với một bài test THẬT SỰ hỏng 20% số lần, lần chạy kế qua 80% số lần.</strong> Nên quan sát "nó hỏng, rồi nó qua" là kết cục <em>NHIỀU KHẢ NĂNG NHẤT</em> — nó là thứ bạn KỲ VỌNG sẽ thấy, và nó hoàn toàn KHÔNG phân biệt được một flake 20% với một flake 5%. Một lần chạy lại chứa gần như không có thông tin nào, và nó lại đang được coi như một phán quyết.</p>
</div>

<h3>Bao nhiêu lần xanh mới thật sự nghĩa lý gì</h3>
<div class="out">neu ty le hong that su la 20%:  can 14 lan xanh lien tiep de tin 95%
                                can 21 lan xanh lien tiep de tin 99%
neu ty le hong that su la  5%:  can 59 lan xanh lien tiep de tin 95%
                                can 90 lan xanh lien tiep de tin 99%</div>

<div class="callout">
<p><strong>Mười bốn lần xanh liên tiếp mới tin được 95% rằng một flake 20% đã biến mất.</strong> Không ai làm thế, và điều đó ổn — kết luận KHÔNG phải "hãy chạy mười bốn lần", mà là <em>xác nhận một bản vá bằng cách chạy lại thì KHÔNG khả thi</em>. Một flake được vá bằng cách TÌM RA nguồn của tính bất định rồi gỡ nó đi, và khi ấy những lần xanh chỉ là một phép kiểm tỉnh táo chứ không phải BẰNG CHỨNG.</p>
</div>

<h3>Cái giá cộng dồn</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">một bài test, tỉ lệ hỏng 20%</span><span class="lz-t">100 lần chạy CI</span><span class="lz-d">kỳ vọng 20 bản dựng đỏ</span></div>
<div class="lz-step"><span class="lz-k">mỗi lần, có người chạy lại</span><span class="lz-t">80% thấy xanh</span><span class="lz-d">rồi kết luận "flake, bỏ qua" — mà đó là quyết định hợp lý CỤC BỘ ở từng lần một</span></div>
<div class="lz-step"><span class="lz-k">nên bài test không bao giờ được vá</span><span class="lz-t">và nó KHÔNG phải flake</span><span class="lz-d">nó là một khiếm khuyết THẬT lộ ra một lần trong năm, nấp sau cái nút chạy lại</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng nút chạy lại như một công cụ CHẨN ĐOÁN.</strong> Nó là một công cụ SỬA CHỮA, không phải một phép đo: nó làm bản dựng xanh lại để công việc đi tiếp, và như thế là chính đáng. Chỗ hỏng là coi lần chạy xanh ấy như một CÂU TRẢ LỜI. Nếu một bài test đã hỏng chập chờn, con số đáng có là TỈ LỆ hỏng của nó qua các lần chạy gần đây — và con số ấy nằm trong API, không nằm trong trí nhớ của bạn về việc nó có vẻ hay xảy ra tới mức nào.</p>
</div>

<h3>Quyết xem bạn đang có loại nào, theo thứ tự chi phí</h3>
<div class="kv-grid">
<div class="kv"><span class="k">ĐỌC thông báo lỗi, trước tiên</span><span class="v">một cú hỏng thật thường nêu tên một thứ cụ thể và lặp lại được; một flake thường nêu một timeout, một kết nối, một dấu thời gian hoặc một thứ tự. Chuyện này không tốn gì và giải quyết phần lớn các ca</span></div>
<div class="kv"><span class="k">chạy RIÊNG bài test ấy, ở máy</span><span class="v">xanh khi một mình mà đỏ trong cả bộ là phụ thuộc thứ tự, giải quyết trong một câu lệnh. Đây là phép kiểm cho lợi nhất và gần như không bao giờ là phép người ta thử đầu tiên</span></div>
<div class="kv"><span class="k">chạy nó trong một vòng lặp</span><span class="v"><code>for i in $(seq 50); do npm test -- -t 'ten bai'; done</code>. Cho ra một TỈ LỆ. Năm mươi lần chạy một bài test là vài giây; năm mươi lần chạy CI là một buổi chiều</span></div>
<div class="kv"><span class="k">đếm nó qua lịch sử</span><span class="v">API workflow-runs cho kết luận của từng lần chạy. "Job này đã hỏng 9 trên 60 lần gần nhất" là một phát biểu rất khác với "nó có vẻ chập chờn", và nó tốn một lời gọi</span></div>
</div>

<h3>Lịch sử của kho này trông ra sao</h3>
<div class="out">desktop-release, 12 lan gan nhat:  10 thanh cong, 2 hong
  hong #1: 80s   — hong RAT som
  hong #2: 334s  — hong giua chung
  TB thanh cong: 458s

hong #2 la run 32400097927: vite build exit 134, heap limit, CHI tren macOS</div>

<div class="callout ok">
<p><strong>Hai cú hỏng trên mười hai, và không cái nào là flake.</strong> Một cái có tài liệu ghi là cú sập trần heap kèm một bản vá cụ thể — <code>--max-old-space-size</code> cộng với bỏ sourcemap ở CI — và kho này KIỂM CHỨNG bản vá bằng cách TÁI LẬP cú hỏng ở một heap bị bóp rồi xem nó đi từ 134 về 0. Đó mới là hình dạng của việc giải quyết một cú hỏng: cố ý tái lập nó, vá nó, rồi tái lập bản vá. Không phải chạy lại rồi xem sao.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một cú hỏng thật hỏng 100% số lần và một lần xanh bác bỏ được nó; một flake 20% thì qua khi chạy lại ở 80% số lần, nên lần chạy lại ấy chẳng nói gì với bạn — và loại thứ ba, phụ thuộc thứ tự, hoàn toàn không ngẫu nhiên và được chẩn đoán bằng cách chạy bài test MỘT MÌNH.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — list workflow runs, lọc theo conclusion</span><span class="lc-sub">docs.github.com/en/rest/actions/workflow-runs — <code>?status=failure</code> trên các lần chạy gần đây biến "nó có vẻ chập chờn" thành một TỈ LỆ, đúng phép đo mà bài này lập luận.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Re-running workflows and jobs</span><span class="lc-sub">docs.github.com/en/actions/managing-workflow-runs/re-running-workflows-and-jobs — gồm cả việc chỉ chạy lại các job đã hỏng, tức là hành động SỬA CHỮA rẻ tiền, phân biệt với một cuộc CHẨN ĐOÁN.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google Testing Blog — Flaky tests at Google and how we mitigate them</span><span class="lc-sub">testing.googleblog.com — bản quy mô công nghiệp của phép số học này, gồm cả nhận xét rằng một tỉ lệ flake dưới một ngưỡng nào đó thì cách ly rẻ hơn là vá, và cái ngưỡng ấy nằm ở đâu.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — cách ly test, trạng thái chung, và vì sao thứ tự có ý nghĩa</span><span class="lc-sub">/courses/nodejs/learn${REF} — loại hỏng thứ ba bên trên, cùng những cơ chế cache module và biến toàn cục đẻ ra nó.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — những bài test dùng chung một cơ sở dữ liệu</span><span class="lc-sub">/courses/postgresql/learn${REF} — nguồn phụ thuộc thứ tự THẬT phổ biến nhất trong một bộ test backend, và khuôn mẫu một-giao-dịch-cho-mỗi-bài gỡ bỏ nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — Reproducing it, and the guess the measurement refuted|||8.3 — Tái lập nó, và cái phỏng đoán bị phép đo bác bỏ',
      slug: 'ga-8-3-tai-lap',
      type: 'VIDEO',
      description: 'Cách tái lập một cú hỏng chỉ-có-ở-CI là BÓP tài nguyên ở máy bạn cho khớp. Và trong lúc chuẩn bị bài này tôi đoán trần heap V8 là ~4 GB — số đo thật trên máy này là 8.240 MB. Câu "V8 mặc định 4 GB" đã cũ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Reproducing it, and the guess the measurement refuted</h2>
<p class="lead">A failure that only happens in CI is a failure whose cause is a difference between two machines. Finding it means naming the difference — and the most productive move is usually to make your machine <em>worse</em> rather than to make CI more verbose.</p>

<h3>The machine this course runs on</h3>
<div class="out">nhan CPU: 4 · RAM: 15Gi · dia trong: 23G / 252G
node v22.22.2</div>

<p>And the runner specifications, which are documentation rather than a measurement — this course cannot inspect a GitHub runner from outside:</p>

<div class="out">nhan  RAM     SSD    nhan hieu
--------------------------------------------
  4   16 GB   14 GB  ubuntu-latest
  4   16 GB   14 GB  windows-latest
  3    7 GB   14 GB  macos-latest   <- IT RAM NHAT</div>

<div class="callout">
<p><strong>The macOS runner has under half the memory of the other two.</strong> That is a plausible explanation for run 32400097927 failing only on the macOS leg — and it is being stated as a hypothesis that fits the numbers, not as something measured. The measurement that would settle it is the one below.</p>
</div>

<h3>The guess, and the measurement that refuted it</h3>
<p>Before measuring, this lesson was going to state the widely repeated rule that V8&#39;s default heap is about half of RAM, capped near 4 GB — which would have predicted roughly 4,000 MB on a 15 GiB machine. One line checks it:</p>

<div class="out">$ node -e 'console.log(require("v8").getHeapStatistics().heap_size_limit)'
heap_size_limit  = 8.240 MB</div>

<div class="callout warn">
<p><strong>8,240 MB, not 4,000.</strong> Node 22 raised the ceiling, and the "V8 defaults to about 4 GB" advice that appears in every blog post about heap errors is out of date. The prediction was off by more than a factor of two, and the check cost one line. That is the shape of most CI folklore: true once, repeated since, and cheap to test.</p>
</div>

<p>The same call confirms that the flag does what it says, which is worth knowing before you rely on it:</p>

<div class="out">--max-old-space-size=512   -> heap_size_limit =   560 MB
--max-old-space-size=2048  -> heap_size_limit = 2.096 MB</div>

<h3>The technique: make your machine worse</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">name the difference</span><span class="lz-t">memory, cores, disk, OS, tool version</span><span class="lz-d">a CI-only failure has one. The exit code usually points at which — 134 says memory, 137 says memory harder, 139 says a native binary</span></div>
<div class="lz-step"><span class="lz-k">constrain locally to match</span><span class="lz-t"><code>--max-old-space-size</code>, <code>ulimit</code>, <code>docker run -m</code>, <code>taskset</code></span><span class="lz-d">this repository did exactly this: squeezed the heap to 1600 MB and watched <code>vite build</code> go from exit 0 to exit 134</span></div>
<div class="lz-step"><span class="lz-k">then verify the fix the same way</span><span class="lz-t">under the constraint, not without it</span><span class="lz-d">with sourcemaps → 134; without → 0. The fix is proven at the constraint that caused the failure</span></div>
</div>

<div class="callout ok">
<p><strong>That reproduction is the whole reason the fix is trustworthy.</strong> Without it, "we added <code>--max-old-space-size=6144</code> and it stopped failing" is indistinguishable from "we changed something and the flake did not recur" — which lesson 8.2 measured as the most likely outcome regardless. Reproducing the failure first is what turns a green run into evidence.</p>
</div>

<h3>The constraint toolkit</h3>
<div class="kv-grid">
<div class="kv"><span class="k">memory · Node</span><span class="v"><code>node --max-old-space-size=&lt;MB&gt;</code>. Verified above to set <code>heap_size_limit</code> directly. The cheapest constraint to apply and the one that reproduces exit 134</span></div>
<div class="kv"><span class="k">memory · whole process</span><span class="v"><code>docker run -m 512m</code>, or a cgroup. This reproduces <strong>137</strong> rather than 134 — the OOM killer rather than V8 giving up, which is the distinction from 8.1</span></div>
<div class="kv"><span class="k">cores</span><span class="v"><code>taskset -c 0,1</code> or <code>docker run --cpus 2</code>. Reproduces timeouts and race conditions that only appear when the machine is slower than yours</span></div>
<div class="kv"><span class="k">disk</span><span class="v">a small loopback filesystem. Reproduces the <code>no space left on device</code> class — which this repository has hit on its VPS, and a runner has 14 GB</span></div>
<div class="kv"><span class="k">the OS itself</span><span class="v">the one you cannot fake. A Linux container does not reproduce a macOS-only failure, and this is where a matrix leg earns its cost</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — adding logging to CI instead of reproducing locally.</strong> The instinct on a CI-only failure is to push a commit that prints more. Each iteration costs a full run — 141 to 555 seconds here — plus the wait, and it changes the thing being debugged. Constraining a local machine gives an iteration time of seconds and a debugger. Add CI logging when you genuinely cannot name the difference; try to name it first.</p>
</div>

<h3>What to print when you do need CI to tell you</h3>
<pre><code>- name: May nay la may nao
  run: |
    uname -a
    echo "runner: \$RUNNER_OS \$RUNNER_ARCH"
    nproc; free -h 2&gt;/dev/null || vm_stat; df -h /
    node --version
    node -e 'console.log("heap limit MB:",
      (require("v8").getHeapStatistics().heap_size_limit/1048576).toFixed(0))'</code></pre>

<div class="callout">
<p><strong>That last line is the one worth adding permanently.</strong> It costs milliseconds, it prints on every run, and the day a build starts failing with 134 it answers the first question immediately — did the ceiling move, or did the build get bigger? Without it, both hypotheses are equally consistent with the log.</p>
</div>

<h3>What cannot be reproduced locally, and what to do instead</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a specific runner image version</span><span class="lz-lnote">the image is not published as a runnable artifact. The <code>actions/runner-images</code> repository documents what changed between versions, and its announcement issues are the fastest route when a green workflow goes red with no commit — measured in 4.2</span></div>
<div class="lz-layer"><span class="lz-lname">macOS, if you do not have a Mac</span><span class="lz-lnote">no substitute. The practical answer is a matrix leg that fails fast and prints diagnostics, plus <code>fail-fast: false</code> so the other legs still produce artifacts — which is exactly what this repository configured, and 2.5 measured why</span></div>
<div class="lz-layer"><span class="lz-lname">the network from a runner</span><span class="lz-lnote">different egress, different DNS, different rate-limit bucket. A failure that only happens in CI and involves an external service is often this, and the diagnostic is to print the resolved address and the response headers</span></div>
<div class="lz-layer"><span class="lz-lname">a full local runner</span><span class="lz-lnote"><code>act</code> runs workflows locally in Docker. Genuinely useful for iterating on workflow <em>syntax</em> and step wiring; it is not the same OS, not the same image, and not the same resource limits, so it does not reproduce this chapter&#39;s failures</span></div>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> A CI-only failure is a machine difference, the exit code usually names which one, and reproducing it by constraining your own machine turns a fix from "it stopped happening" into "it fails at this limit and stops failing after this change" — while the heap number everyone quotes for that constraint turns out to be twice out of date.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images — available images and specifications</span><span class="lc-sub">github.com/actions/runner-images#available-images — the per-label hardware table quoted above, and the per-image changelogs that explain no-commit regressions.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — v8.getHeapStatistics()</span><span class="lc-sub">nodejs.org/api/v8.html#v8getheapstatistics — the one-line check that refuted the guess above, and the rest of the heap counters worth printing when a build is near a ceiling.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nektos/act — run workflows locally</span><span class="lc-sub">github.com/nektos/act — useful for iterating on workflow structure without pushing; explicitly not a reproduction of the hosted environment, which is the caveat above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — constraining memory and CPU to reproduce a production failure</span><span class="lc-sub">/courses/docker/learn${REF} — <code>-m</code>, <code>--cpus</code> and cgroups, with a measured case where a 512 MB limit reproduced an incident that a laptop could not.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the small machine, and the swap that hid an OOM</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — measuring memory pressure while it is happening rather than after, including a null result from reading the counters too late.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Tái lập nó, và cái phỏng đoán bị phép đo bác bỏ</h2>
<p class="lead">Một cú hỏng chỉ xảy ra ở CI là một cú hỏng mà nguyên nhân của nó là một KHÁC BIỆT giữa hai cỗ máy. Tìm ra nó nghĩa là GỌI TÊN cái khác biệt ấy — và nước đi hiệu quả nhất thường là làm cho máy bạn <em>TỆ ĐI</em> chứ không phải làm cho CI nói nhiều hơn.</p>

<h3>Cỗ máy chạy khoá học này</h3>
<div class="out">nhan CPU: 4 · RAM: 15Gi · dia trong: 23G / 252G
node v22.22.2</div>

<p>Và cấu hình runner, thứ là TÀI LIỆU chứ không phải một phép đo — khoá học này không soi được một runner của GitHub từ bên ngoài:</p>

<div class="out">nhan  RAM     SSD    nhan hieu
--------------------------------------------
  4   16 GB   14 GB  ubuntu-latest
  4   16 GB   14 GB  windows-latest
  3    7 GB   14 GB  macos-latest   <- IT RAM NHAT</div>

<div class="callout">
<p><strong>Runner macOS có chưa bằng một nửa bộ nhớ của hai cái kia.</strong> Đó là một lời giải thích HỢP LÝ cho việc run 32400097927 chỉ hỏng ở nhánh macOS — và nó đang được nêu như một GIẢ THUYẾT khớp với số liệu, không nêu như một thứ đã đo. Phép đo giải quyết được nó là phép ở ngay dưới.</p>
</div>

<h3>Cái phỏng đoán, và phép đo bác bỏ nó</h3>
<p>Trước khi đo, bài này định phát biểu cái quy tắc hay được nhắc lại rằng heap mặc định của V8 khoảng một nửa RAM, trần gần 4 GB — thứ sẽ dự đoán khoảng 4.000 MB trên một máy 15 GiB. Một dòng là kiểm được:</p>

<div class="out">$ node -e 'console.log(require("v8").getHeapStatistics().heap_size_limit)'
heap_size_limit  = 8.240 MB</div>

<div class="callout warn">
<p><strong>8.240 MB, không phải 4.000.</strong> Node 22 đã nâng cái trần ấy, và lời khuyên "V8 mặc định khoảng 4 GB" xuất hiện trong mọi bài blog về lỗi heap thì đã CŨ. Dự đoán lệch hơn hai lần, và phép kiểm tốn một dòng. Đó là hình dạng của phần lớn truyền thuyết về CI: từng đúng một lần, được chép lại từ đó, và rẻ để đem thử.</p>
</div>

<p>Cùng lời gọi ấy xác nhận cái cờ làm đúng thứ nó nói, điều đáng biết trước khi bạn dựa vào nó:</p>

<div class="out">--max-old-space-size=512   -> heap_size_limit =   560 MB
--max-old-space-size=2048  -> heap_size_limit = 2.096 MB</div>

<h3>Kỹ thuật: làm cho máy bạn TỆ ĐI</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">gọi tên cái khác biệt</span><span class="lz-t">bộ nhớ, số nhân, đĩa, hệ điều hành, phiên bản công cụ</span><span class="lz-d">một cú hỏng chỉ-có-ở-CI đều có một cái. Mã thoát thường chỉ ra là cái nào — 134 nói bộ nhớ, 137 nói bộ nhớ nặng hơn, 139 nói một tệp nhị phân gốc</span></div>
<div class="lz-step"><span class="lz-k">bóp ở máy cho khớp</span><span class="lz-t"><code>--max-old-space-size</code>, <code>ulimit</code>, <code>docker run -m</code>, <code>taskset</code></span><span class="lz-d">kho này làm đúng thế: bóp heap còn 1600 MB rồi xem <code>vite build</code> đi từ exit 0 sang exit 134</span></div>
<div class="lz-step"><span class="lz-k">rồi kiểm bản vá theo CÙNG cách</span><span class="lz-t">DƯỚI ràng buộc, không phải khi bỏ nó ra</span><span class="lz-d">có sourcemap → 134; không có → 0. Bản vá được chứng minh tại chính cái ràng buộc đã gây ra cú hỏng</span></div>
</div>

<div class="callout ok">
<p><strong>Chính phép tái lập ấy là toàn bộ lý do bản vá đáng tin.</strong> Không có nó thì "chúng tôi thêm <code>--max-old-space-size=6144</code> và nó thôi hỏng" không phân biệt được với "chúng tôi đổi cái gì đó và cái flake không tái diễn" — mà bài 8.2 đã đo rằng đó là kết cục nhiều khả năng nhất BẤT KỂ thế nào. Tái lập cú hỏng TRƯỚC là thứ biến một lần chạy xanh thành BẰNG CHỨNG.</p>
</div>

<h3>Bộ đồ nghề ràng buộc</h3>
<div class="kv-grid">
<div class="kv"><span class="k">bộ nhớ · Node</span><span class="v"><code>node --max-old-space-size=&lt;MB&gt;</code>. Đã kiểm chứng bên trên là nó đặt thẳng <code>heap_size_limit</code>. Ràng buộc rẻ nhất để áp và là cái tái lập được exit 134</span></div>
<div class="kv"><span class="k">bộ nhớ · cả tiến trình</span><span class="v"><code>docker run -m 512m</code>, hoặc một cgroup. Cái này tái lập <strong>137</strong> chứ không phải 134 — OOM killer chứ không phải V8 tự bỏ cuộc, đúng chỗ phân biệt của bài 8.1</span></div>
<div class="kv"><span class="k">số nhân</span><span class="v"><code>taskset -c 0,1</code> hoặc <code>docker run --cpus 2</code>. Tái lập những cú timeout và những cuộc đua chỉ lộ ra khi cỗ máy chậm hơn máy bạn</span></div>
<div class="kv"><span class="k">đĩa</span><span class="v">một hệ tệp loopback nhỏ. Tái lập lớp <code>no space left on device</code> — thứ kho này đã dính trên VPS, và một runner có 14 GB</span></div>
<div class="kv"><span class="k">chính hệ điều hành</span><span class="v">cái duy nhất bạn KHÔNG giả được. Một container Linux không tái lập được một cú hỏng chỉ-có-trên-macOS, và đó là chỗ một nhánh ma trận tự kiếm được chi phí của nó</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — thêm log vào CI thay vì tái lập ở máy.</strong> Bản năng khi gặp một cú hỏng chỉ-có-ở-CI là đẩy một commit in ra nhiều hơn. Mỗi vòng lặp tốn một lần chạy đầy đủ — 141 tới 555 giây ở đây — cộng thời gian chờ, và nó LÀM THAY ĐỔI chính cái thứ đang được gỡ lỗi. Bóp một cỗ máy cục bộ cho thời gian vòng lặp tính bằng giây và một trình gỡ lỗi. Hãy thêm log vào CI khi bạn THẬT SỰ không gọi tên được cái khác biệt; hãy thử gọi tên nó trước.</p>
</div>

<h3>In gì ra khi bạn THẬT SỰ cần CI nói cho biết</h3>
<pre><code>- name: May nay la may nao
  run: |
    uname -a
    echo "runner: \$RUNNER_OS \$RUNNER_ARCH"
    nproc; free -h 2&gt;/dev/null || vm_stat; df -h /
    node --version
    node -e 'console.log("heap limit MB:",
      (require("v8").getHeapStatistics().heap_size_limit/1048576).toFixed(0))'</code></pre>

<div class="callout">
<p><strong>Cái dòng cuối là dòng đáng thêm vào VĨNH VIỄN.</strong> Nó tốn vài mili giây, nó in ra ở mọi lần chạy, và cái ngày một bản dựng bắt đầu hỏng với 134 thì nó trả lời câu hỏi đầu tiên ngay lập tức — cái trần đã dịch, hay bản dựng đã phình ra? Không có nó thì cả hai giả thuyết đều nhất quán với cái log như nhau.</p>
</div>

<h3>Thứ KHÔNG tái lập được ở máy, và làm gì thay vào đó</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một phiên bản ảnh runner cụ thể</span><span class="lz-lnote">cái ảnh ấy không được công bố dưới dạng một sản phẩm chạy được. Kho <code>actions/runner-images</code> ghi lại cái gì đổi giữa các phiên bản, và các issue thông báo của nó là đường nhanh nhất khi một workflow xanh bỗng đỏ mà không có commit nào — đo ở bài 4.2</span></div>
<div class="lz-layer"><span class="lz-lname">macOS, nếu bạn không có máy Mac</span><span class="lz-lnote">không có thứ thay thế. Đáp án thực dụng là một nhánh ma trận hỏng nhanh và in ra chẩn đoán, cộng <code>fail-fast: false</code> để các nhánh khác vẫn đẻ ra artifact — đúng thứ kho này đã cấu hình, và bài 2.5 đã đo vì sao</span></div>
<div class="lz-layer"><span class="lz-lname">mạng nhìn từ một runner</span><span class="lz-lnote">lối ra khác, DNS khác, xô giới-hạn-tần-suất khác. Một cú hỏng chỉ có ở CI mà lại dính tới một dịch vụ bên ngoài thì thường là chuyện này, và cách chẩn đoán là in ra địa chỉ đã phân giải cùng các header phản hồi</span></div>
<div class="lz-layer"><span class="lz-lname">một runner đầy đủ chạy ở máy</span><span class="lz-lnote"><code>act</code> chạy workflow cục bộ trong Docker. Thật sự hữu ích để lặp trên <em>CÚ PHÁP</em> workflow và cách nối các bước; nó không cùng hệ điều hành, không cùng ảnh, và không cùng giới hạn tài nguyên, nên nó KHÔNG tái lập được những cú hỏng của chương này</span></div>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Một cú hỏng chỉ-có-ở-CI là một khác biệt giữa hai cỗ máy, mã thoát thường gọi tên là khác biệt nào, và tái lập nó bằng cách BÓP máy của chính bạn biến một bản vá từ "nó thôi xảy ra" thành "nó hỏng tại giới hạn này và thôi hỏng sau thay đổi này" — trong khi cái con số heap mà ai cũng trích cho ràng buộc ấy thì hoá ra đã cũ gấp đôi.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images — ảnh dùng được và cấu hình</span><span class="lc-sub">github.com/actions/runner-images#available-images — bảng phần cứng theo từng nhãn trích bên trên, và nhật ký thay đổi theo từng ảnh giải thích những cú thoái lui không-có-commit.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — v8.getHeapStatistics()</span><span class="lc-sub">nodejs.org/api/v8.html#v8getheapstatistics — lời gọi một dòng đã bác bỏ phỏng đoán bên trên, và những bộ đếm heap khác đáng in ra khi một bản dựng đang ở gần một cái trần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nektos/act — chạy workflow ở máy</span><span class="lc-sub">github.com/nektos/act — hữu ích để lặp trên cấu trúc workflow mà không phải đẩy commit; tường minh KHÔNG phải một bản tái lập môi trường do GitHub cấp, đó là lời lưu ý bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — bóp bộ nhớ và CPU để tái lập một cú hỏng production</span><span class="lc-sub">/courses/docker/learn${REF} — <code>-m</code>, <code>--cpus</code> và cgroup, kèm một ca đo được nơi giới hạn 512 MB tái lập được một sự cố mà một cái laptop thì không.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — cỗ máy nhỏ, và phần swap che mất một cú OOM</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — đo áp lực bộ nhớ TRONG LÚC nó đang xảy ra chứ không phải sau đó, gồm cả một kết quả rỗng do đọc bộ đếm quá muộn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — Reading a run in triage order|||8.4 — Đọc một lần chạy theo thứ tự phân loại',
      slug: 'ga-8-4-thu-tu-doc',
      type: 'VIDEO',
      description: 'Không mở log ngay. Thứ tự đúng: nhìn thời lượng, nhìn KHÔNG có gì hỏng, nhìn ma trận, nhìn hai dòng cuối, rồi mới đọc log. Sáu bước, mỗi bước có thể GIẢI QUYẾT XONG cuộc điều tra và tiết kiệm phần đọc phía sau.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Reading a run in triage order</h2>
<p class="lead">A red build is a request to read a log, and reading a log is the last thing to do. Six steps come before it, each one cheap enough to run in seconds and any one of which can settle the investigation before it starts.</p>

<h3>The six steps, in order</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">the duration</span><span class="lz-d">7.3: short means it bailed, normal means it ran, long means it hung. This is one number and it points at where in the log to look</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">what did NOT fail</span><span class="lz-d">skipped jobs propagate from a real failure and are not the story. Their count tells you how far into the chain the failure reached</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">the matrix</span><span class="lz-d">one leg red and others green means a platform difference (8.3). All legs red means a shared cause upstream</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">the exit code, from the last error line</span><span class="lz-d">8.1: 127 was never found, 134 was heap, 137 was killed. This alone often names the fix</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">the diff</span><span class="lz-d">what changed since the last green run. This is the git log entry, not the workflow log</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">the step&#39;s log, only now</span><span class="lz-d">and you already know what to look for</span></div>
</div>

<h3>Applied to the one failure this course has</h3>
<div class="out">Run 32400097927, desktop-release

1. thoi luong: 334s (TB thanh cong 458s)  -> hong GIUA CHUNG, khong som
2. khong hong: kiem tra ma, dung Linux, dung Windows  -> ba job xanh
3. ma tran: CHI macOS do  -> khac biet nen tang, khong phai chung ha nguon
4. ma thoat: 134  -> V8 het heap
5. diff: khong doi buoc dung, khong nang dep
6. log: FATAL ERROR: Reached heap limit — JavaScript heap out of memory</div>

<div class="callout ok">
<p><strong>Steps 1 through 4 arrived at "the macOS build ran out of memory in V8" without opening a log.</strong> Step 6 confirmed it in one line. This is the shape triage should take: each earlier step is cheaper and eliminates a category, so by the time you open the log you know which twenty lines to read.</p>
</div>

<h3>What each step actually looks at</h3>
<div class="kv-grid">
<div class="kv"><span class="k">1 — duration</span><span class="v">on the run list. No click needed. Compare to the median of the last ten runs, not to memory</span></div>
<div class="kv"><span class="k">2 — the run summary</span><span class="v">the top of the run page shows every job with its result. Failed and skipped are different symbols; count each</span></div>
<div class="kv"><span class="k">3 — the matrix column</span><span class="v">if there is a matrix, jobs are grouped by it. One column red is a fingerprint that names the axis: which platform, which Node version, which shard</span></div>
<div class="kv"><span class="k">4 — the failed step</span><span class="v">click into the failed job. The last log group is the one that failed, and the very last line of it is the exit code</span></div>
<div class="kv"><span class="k">5 — the commit range</span><span class="v">the run page shows the head commit. Compare to the last green run on the same branch. Small diff, easy diagnosis; large diff, use bisection</span></div>
<div class="kv"><span class="k">6 — the log, from the bottom</span><span class="v">real errors are near the bottom. The middle of a log is setup, and the top is receipts</span></div>
</div>

<h3>Two shortcuts that break the order</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">opening the log first</span><span class="lz-lnote">the default action, and it produces the reader who spends fifteen minutes on a stack trace from a job that was skipped. Steps 1–3 rule out the skipped jobs before the log tempts you</span></div>
<div class="lz-layer"><span class="lz-lname">re-running before reading</span><span class="lz-lnote">8.2 measured what that tells you: for a 20% flake, nothing. For a real failure, nothing plus one more run. The button is a repair, not a diagnosis</span></div>
<div class="lz-layer"><span class="lz-lname">searching the log for "error"</span><span class="lz-lnote">many green steps print the word. The last <code>##[error]</code> line names the exit code and the failing step, and that is what you want. Search for <code>##[error]</code></span></div>
<div class="lz-layer"><span class="lz-lname">reading someone else&#39;s log first</span><span class="lz-lnote">a similar-looking previous failure is only similar-looking. Read your run first, and only then compare — otherwise you have imported their diagnosis into yours</span></div>
</div>

<h3>Where the six steps break down</h3>
<div class="kv-grid">
<div class="kv"><span class="k">a step exited 0 but wrote errors</span><span class="v">step 4 gives you 0 and nothing to work with. This is the <code>pipefail</code>-missing case from 2.4: the shell hid the failure. The fix is in the shell, not in this run</span></div>
<div class="kv"><span class="k">the job was cancelled</span><span class="v">exit 143, and the "failure" is really "somebody cancelled it or fail-fast did". Step 3 reveals it: a leg cancelled while its siblings ran is what fail-fast leaves</span></div>
<div class="kv"><span class="k">the runner died</span><span class="v">no exit code at all, and the log ends abruptly. The run page shows "The runner has received a shutdown signal" — infrastructure, not code. Re-run once</span></div>
<div class="kv"><span class="k">a step timed out</span><span class="v">the runner injects an error and the last line is a timeout notice. Step 1 catches this too — the duration is at the ceiling</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — treating a failed downstream job as the failure.</strong> A red publish job with three red build jobs upstream has one failure, not four. The build jobs failed for their own reasons; the publish job failed because its <code>needs:</code> did not succeed. Read the earliest failure in the chain, not the loudest one — which is usually the one at the end.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> Read the run before the log: the duration says how, the skipped jobs say where the failure did not spread to, the matrix says which axis differs, and the exit code names the cause — so by the time you are looking at text, you are looking at the right twenty lines.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About monitoring and troubleshooting</span><span class="lc-sub">docs.github.com/en/actions/monitoring-and-troubleshooting-workflows — the UI features that support the six steps above: the run summary, per-job status, and the log group markers that let you jump to the failure.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: ::error:: and ::warning::</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — how a step signals its failure so step 4 finds it, and what to write in your own scripts so the fifth step reader knows what happened.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Downloading logs</span><span class="lc-sub">docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs — the raw log zip, for the rare case that the UI truncates before the interesting line.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — reading an incident from the tail of a log</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the same triage order applied to a production incident, including a case where step 1 was enough.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — read from the bottom</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the general log-reading discipline, including why <code>less +G</code> is worth memorising.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Đọc một lần chạy theo thứ tự phân loại</h2>
<p class="lead">Một bản dựng đỏ là một lời đề nghị bạn đọc log, và đọc log là việc CUỐI CÙNG cần làm. Sáu bước tới trước nó, mỗi bước rẻ tới mức làm được trong vài giây và bất cứ bước nào cũng có thể giải quyết xong cuộc điều tra trước khi nó bắt đầu.</p>

<h3>Sáu bước, theo thứ tự</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">thời lượng</span><span class="lz-d">bài 7.3: ngắn nghĩa là bỏ cuộc, bình thường nghĩa là có chạy, dài nghĩa là treo. Đây là một con số và nó chỉ chỗ đọc trong log</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">cái gì KHÔNG hỏng</span><span class="lz-d">các job bị bỏ qua LAN TRUYỀN từ một cú hỏng thật và không phải câu chuyện. Số lượng của chúng cho biết cú hỏng lan sâu tới đâu trong chuỗi</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">ma trận</span><span class="lz-d">một nhánh đỏ, các nhánh khác xanh nghĩa là khác biệt nền tảng (bài 8.3). Cả ma trận đỏ nghĩa là nguyên nhân CHUNG ở thượng nguồn</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">mã thoát, từ dòng lỗi cuối</span><span class="lz-d">bài 8.1: 127 nghĩa là chưa bao giờ tìm thấy, 134 là heap, 137 là bị giết. Riêng cái này thường gọi tên được bản vá</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">diff</span><span class="lz-d">cái gì đã đổi kể từ lần chạy xanh gần nhất. Đây là mục trong git log, không phải log workflow</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">log của bước, chỉ tới lúc này</span><span class="lz-d">và bạn đã biết mình đang tìm gì</span></div>
</div>

<h3>Áp lên cú hỏng duy nhất khoá học này có</h3>
<div class="out">Run 32400097927, desktop-release

1. thoi luong: 334s (TB thanh cong 458s)  -> hong GIUA CHUNG, khong som
2. khong hong: kiem tra ma, dung Linux, dung Windows  -> ba job xanh
3. ma tran: CHI macOS do  -> khac biet nen tang, khong phai chung ha nguon
4. ma thoat: 134  -> V8 het heap
5. diff: khong doi buoc dung, khong nang dep
6. log: FATAL ERROR: Reached heap limit — JavaScript heap out of memory</div>

<div class="callout ok">
<p><strong>Bước 1 tới 4 đã đưa tới "bản dựng macOS cạn bộ nhớ trong V8" mà không mở một cái log nào.</strong> Bước 6 xác nhận nó bằng một dòng. Đây là hình dạng mà phân loại NÊN có: mỗi bước sớm hơn thì RẺ hơn và loại được một hạng mục, nên tới lúc bạn đang nhìn chữ thì bạn đang nhìn đúng hai mươi dòng cần đọc.</p>
</div>

<h3>Từng bước thật ra nhìn vào đâu</h3>
<div class="kv-grid">
<div class="kv"><span class="k">1 — thời lượng</span><span class="v">có sẵn trên danh sách lần chạy. Không cần click. So với trung vị của mười lần chạy gần nhất, không so với trí nhớ</span></div>
<div class="kv"><span class="k">2 — bản tóm tắt lần chạy</span><span class="v">phần đầu trang lần chạy hiện MỌI job kèm kết quả. Hỏng và bỏ qua là hai ký hiệu KHÁC NHAU; hãy đếm từng loại</span></div>
<div class="kv"><span class="k">3 — cột ma trận</span><span class="v">nếu có ma trận, các job được nhóm theo nó. Một cột đỏ là một dấu vân tay gọi tên cái trục: nền tảng nào, phiên bản Node nào, mảnh sharding nào</span></div>
<div class="kv"><span class="k">4 — bước hỏng</span><span class="v">click vào job hỏng. Nhóm log CUỐI là nhóm đã hỏng, và dòng CUỐI CÙNG của nó là mã thoát</span></div>
<div class="kv"><span class="k">5 — khoảng commit</span><span class="v">trang lần chạy hiện commit đầu. So với lần chạy xanh gần nhất trên CÙNG nhánh. Diff nhỏ, chẩn đoán dễ; diff lớn, dùng bisection</span></div>
<div class="kv"><span class="k">6 — log, đọc TỪ DƯỚI LÊN</span><span class="v">lỗi thật nằm gần đáy. Giữa log là phần thiết lập, và đầu log là hoá đơn</span></div>
</div>

<h3>Hai lối tắt phá vỡ thứ tự</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">mở log ngay</span><span class="lz-lnote">hành động mặc định, và nó đẻ ra người đọc bỏ mười lăm phút vào một stack trace của một job đã bị bỏ qua. Bước 1–3 loại các job bị bỏ qua TRƯỚC khi log cám dỗ bạn</span></div>
<div class="lz-layer"><span class="lz-lname">chạy lại trước khi đọc</span><span class="lz-lnote">bài 8.2 đã đo điều đó nói lên gì: với một flake 20%, không gì cả. Với một cú hỏng thật, không gì cộng thêm một lần chạy nữa. Cái nút là một biện pháp SỬA CHỮA, không phải một cuộc chẩn đoán</span></div>
<div class="lz-layer"><span class="lz-lname">tìm "error" trong log</span><span class="lz-lnote">nhiều bước xanh cũng in ra từ đó. Dòng <code>##[error]</code> CUỐI gọi tên mã thoát và bước hỏng, và đó là thứ bạn muốn. Hãy tìm <code>##[error]</code></span></div>
<div class="lz-layer"><span class="lz-lname">đọc log của người khác trước</span><span class="lz-lnote">một cú hỏng cũ trông giống nhau thì chỉ TRÔNG giống. Đọc lần chạy của BẠN trước, và chỉ khi đó mới so — nếu không, bạn đã nhập chẩn đoán của họ vào chẩn đoán của mình</span></div>
</div>

<h3>Chỗ sáu bước ấy đổ vỡ</h3>
<div class="kv-grid">
<div class="kv"><span class="k">một bước thoát 0 mà đã ghi ra lỗi</span><span class="v">bước 4 cho bạn 0 và không có gì để làm việc với. Đây là ca thiếu <code>pipefail</code> ở bài 2.4: shell đã che cú hỏng. Cách vá nằm ở SHELL, không nằm trong lần chạy này</span></div>
<div class="kv"><span class="k">job bị huỷ</span><span class="v">exit 143, và "cú hỏng" thật ra là "có ai đó huỷ nó hoặc fail-fast đã huỷ". Bước 3 phát hiện nó: một nhánh bị huỷ trong khi các anh em nó vẫn chạy là thứ fail-fast để lại</span></div>
<div class="kv"><span class="k">runner chết</span><span class="v">không có mã thoát nào cả, và log kết thúc đột ngột. Trang lần chạy hiện "The runner has received a shutdown signal" — hạ tầng, không phải mã. Chạy lại một lần</span></div>
<div class="kv"><span class="k">một bước hết giờ</span><span class="v">runner tiêm vào một lỗi và dòng cuối là một thông báo timeout. Bước 1 cũng bắt được — thời lượng ở đúng trần</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi một job phía sau bị hỏng là CÚ HỎNG.</strong> Một job công bố đỏ với ba job dựng đỏ ở thượng nguồn thì có MỘT cú hỏng, không phải bốn. Các job dựng hỏng vì lý do của chúng; job công bố hỏng vì <code>needs:</code> của nó không thành công. Hãy đọc cú hỏng SỚM NHẤT trong chuỗi, không phải cú ồn ào nhất — thứ thường là cú ở cuối.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Hãy đọc LẦN CHẠY trước khi đọc LOG: thời lượng nói CÁCH nó hỏng, các job bị bỏ qua nói cú hỏng KHÔNG lan tới đâu, ma trận nói TRỤC nào khác, và mã thoát gọi tên NGUYÊN NHÂN — nên tới lúc bạn đang nhìn chữ, bạn đang nhìn đúng hai mươi dòng.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About monitoring and troubleshooting</span><span class="lc-sub">docs.github.com/en/actions/monitoring-and-troubleshooting-workflows — các tính năng giao diện hỗ trợ sáu bước bên trên: bản tóm tắt lần chạy, trạng thái từng job, và các dấu nhóm log cho phép bạn nhảy tới cú hỏng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: ::error:: và ::warning::</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — cách một bước báo hiệu cú hỏng để bước 4 tìm ra, và viết gì trong script của bạn để người đọc ở bước 5 biết chuyện gì đã xảy ra.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Downloading logs</span><span class="lc-sub">docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs — tệp zip log gốc, cho ca hiếm mà giao diện cắt cụt trước cái dòng đáng chú ý.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — đọc một sự cố từ ĐÁY log</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cùng thứ tự phân loại ấy áp lên một sự cố production, gồm cả một ca mà bước 1 là đủ.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — đọc từ đáy lên</span><span class="lc-sub">/courses/linux-bash/learn${REF} — kỷ luật đọc log tổng quát, gồm cả việc vì sao <code>less +G</code> đáng thuộc.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.5 ─────────────────────────── */
    {
      title: '8.5 — Verifying a fix, and the acceptance test that saves you|||8.5 — Kiểm chứng bản vá, và bài nghiệm thu cứu bạn',
      slug: 'ga-8-5-kiem-ban-va',
      type: 'VIDEO',
      description: 'Sau khi biết vì sao nó hỏng, câu hỏi thật là: bản vá có ĐỦ không? Đo trên rig: heap 1600 MB, có sourcemap → 134, tắt sourcemap → 0. Đó là bằng chứng. Kèm mẫu bài kiểm nghiệm thu để lỗi tái diễn không sống sót được lần thứ hai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>Verifying a fix, and the acceptance test that saves you</h2>
<p class="lead">"CI is green now" is the default answer to whether a fix worked, and 8.2 measured what it is worth: a 20% flake goes green on the next run 80% of the time. So the honest evidence has a different shape — reproduce the failure deliberately, apply the fix under the same conditions, and watch it turn green.</p>

<h3>The demonstration this repository did</h3>
<div class="out">reproduction:  node --max-old-space-size=1600  vite build
  co sourcemap  -> exit 134   (FATAL ERROR: Reached heap limit)
  khong          -> exit 0

apply:  set NODE_OPTIONS=--max-old-space-size=6144 in CI, drop sourcemaps when CI is set
verify: run under the 1600 MB constraint again
  co sourcemap  -> exit 134   (unchanged — the fix is the OTHER thing)
  khong          -> exit 0    (fix confirmed)</div>

<div class="callout ok">
<p><strong>The reproduction is not optional.</strong> Without it the sequence is "the build failed; we changed something; the next build was green" — indistinguishable from a flake that resolved itself. With it the sequence is "the build fails at limit X unless we do Y", which is a claim about mechanism. A future regression on Y produces the same failure, in the same log, and gets fixed the same way.</p>
</div>

<h3>The three states a fix can be in</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">reproduced, unfixed</span><span class="lz-lnote">you can make the failure happen on demand. This is the starting position and the useful one — you now hold the failure by its axis</span></div>
<div class="lz-layer"><span class="lz-lname">reproduced, fixed once</span><span class="lz-lnote">applying the change under the constraint turns the failure into a success. Real evidence, but it does not stop the same class recurring three months later when somebody adds a dependency</span></div>
<div class="lz-layer"><span class="lz-lname">reproduced, fixed forever</span><span class="lz-lnote">the constraint is baked into CI as an acceptance test that the build itself must pass. Now a regression fails immediately on the developer&#39;s next commit rather than on the release</span></div>
</div>

<h3>Turning the reproduction into a CI step</h3>
<pre><code>- name: Build phai chay duoc voi heap bop toi 2GB
  env:
    NODE_OPTIONS: --max-old-space-size=2048
  run: |
    npm run build
    <span class="tok-comment"># neu cai nay hong, mot phu thuoc vua nang muc dung heap.</span>
    <span class="tok-comment"># Fix la giam heap use, khong phai nang --max-old-space-size.</span></code></pre>

<div class="callout">
<p><strong>The test asserts a property of the build, not a hardware fact.</strong> A production release has to run on machines the developer does not choose, and this step encodes the smallest such machine as a constraint. If it fails, somebody removed the margin the fix restored — and the fix is to restore it, not to raise the ceiling in the test.</p>
</div>

<h3>What acceptance tests are worth, generalised</h3>
<div class="kv-grid">
<div class="kv"><span class="k">reproduce the exact past failure</span><span class="v">the 1600 MB heap test above. The value is that the specific bug cannot come back silently — it either fixes itself or fails the check</span></div>
<div class="kv"><span class="k">assert the smoke path</span><span class="v">the deploy script&#39;s route-mounted check from Chapter 1&#39;s history: an unauth <code>curl</code> to core routes, failing on any 404. Not comprehensive, and does not need to be</span></div>
<div class="kv"><span class="k">assert file presence in a release</span><span class="v">the release job&#39;s "count files before publishing" from 5.4. Missing <code>latest-mac.yml</code> silently breaks auto-update, so the check counts it — and refuses to publish a release without it</span></div>
<div class="kv"><span class="k">assert what the workflow ITSELF does</span><span class="v">6.5&#39;s audit script. Six greps that keep the repository honest about what its own workflows say</span></div>
</div>

<h3>The verification order, once you have a fix in mind</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">reproduce the failure locally</span><span class="lz-d">under the constraint 8.3 identified. If you cannot reproduce it, you do not know what you are fixing</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">apply the fix under the same constraint</span><span class="lz-d">and watch the failure become a success. This is the evidence</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">codify the constraint as a check</span><span class="lz-d">so the class cannot come back. This is the acceptance test</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">deliberately break something else and watch the check fail</span><span class="lz-d">the "check the checker" pattern from Deploy VPS. A test you have never seen fail is a test you have not tested</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">only now, push and let CI run</span><span class="lz-d">the green run is a confirmation, not the evidence</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — the fix that raises the ceiling instead of restoring the margin.</strong> The most tempting reply to "the build ran out of heap" is to add <code>--max-old-space-size=8192</code> and push. It works — until the next dependency raises the peak by another 400 MB and CI is red again, having exchanged an OOM for a silent slow build in production. The reproduction identifies whether the fix should restore the margin or raise the ceiling. Both are legitimate; conflating them is how the class comes back.</p>
</div>

<h3>The green run as a check, not a proof</h3>
<div class="callout warn">
<p><strong>Every fix in this course lives or dies on the same measurement.</strong> A green build after a change is evidence at the strength of the flake rate — which for a 20% flake is 80% likelihood by chance. The evidence is the reproduction: it fails without the fix, it passes with it, under the same constraint, twice. Once for the failure, once for the fix.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> A fix is verified when the same constraint produces the failure without it and a success with it — the CI green light is a confirmation of that pair, not a substitute for it.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About tests in workflows</span><span class="lc-sub">docs.github.com/en/actions/automating-builds-and-tests/about-continuous-integration — the general framing of CI, with the specific note that a test is a claim you can point at when it fails.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — --max-old-space-size and process resource limits</span><span class="lc-sub">nodejs.org/api/cli.html — the flag used above and the alternatives for constraining resources, which is the toolkit for the reproduction step.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google Testing Blog — regression tests and the change that reveals the bug</span><span class="lc-sub">testing.googleblog.com — the practice of writing the failing test first, applied at CI scale rather than unit scale.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the smoke test on core routes, and check the checker</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the deploy-time acceptance tests this course keeps referring back to, including how one of them was itself broken and how that was found.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — the query that had to run under production data volume</span><span class="lc-sub">/courses/postgresql/learn${REF} — the same discipline applied to a database: reproducing the slow path under realistic conditions before claiming the index worked.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Kiểm chứng bản vá, và bài nghiệm thu cứu bạn</h2>
<p class="lead">"Giờ CI xanh rồi" là câu trả lời mặc định cho việc bản vá có tác dụng không, và bài 8.2 đã đo nó đáng gì: một flake 20% qua ở lần chạy kế 80% số lần. Nên bằng chứng trung thực có một HÌNH DẠNG khác — TÁI LẬP cú hỏng có chủ ý, áp bản vá dưới cùng điều kiện, rồi xem nó chuyển xanh.</p>

<h3>Bản trình diễn mà kho này đã làm</h3>
<div class="out">tai lap:  node --max-old-space-size=1600  vite build
  co sourcemap  -> exit 134   (FATAL ERROR: Reached heap limit)
  khong          -> exit 0

ap dung:  dat NODE_OPTIONS=--max-old-space-size=6144 trong CI, tat sourcemap khi co bien CI
kiem:    chay lai duoi rang buoc 1600 MB
  co sourcemap  -> exit 134   (khong doi — ban va la CAI KIA)
  khong          -> exit 0    (ban va duoc xac nhan)</div>

<div class="callout ok">
<p><strong>Phần TÁI LẬP không phải tuỳ chọn.</strong> Không có nó thì chuỗi sự kiện là "bản dựng hỏng; chúng tôi đổi cái gì đó; bản dựng kế xanh" — không phân biệt được với một flake tự nó biến mất. Có nó thì chuỗi là "bản dựng hỏng ở giới hạn X trừ khi chúng tôi làm Y", tức là một LỜI KHẲNG ĐỊNH VỀ CƠ CHẾ. Một cú thoái lui về Y trong tương lai đẻ ra cùng cú hỏng, trong cùng cái log, và được vá theo cùng cách.</p>
</div>

<h3>Ba trạng thái mà một bản vá có thể ở</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">đã tái lập, chưa vá</span><span class="lz-lnote">bạn khiến cú hỏng xảy ra theo yêu cầu. Đây là vị trí xuất phát và là vị trí HỮU ÍCH — bạn đang cầm cú hỏng bằng cái trục của nó</span></div>
<div class="lz-layer"><span class="lz-lname">đã tái lập, đã vá một lần</span><span class="lz-lnote">áp thay đổi dưới ràng buộc biến cú hỏng thành cú thành công. Bằng chứng có thật, nhưng nó không ngăn CÙNG LỚP tái diễn ba tháng sau khi có người thêm một phụ thuộc</span></div>
<div class="lz-layer"><span class="lz-lname">đã tái lập, đã vá MÃI MÃI</span><span class="lz-lnote">cái ràng buộc được nướng vào CI dưới dạng một BÀI NGHIỆM THU mà chính bản dựng phải qua. Giờ một cú thoái lui hỏng ngay ở commit kế của người viết chứ không phải ở lúc phát hành</span></div>
</div>

<h3>Biến bản tái lập thành một bước CI</h3>
<pre><code>- name: Build phai chay duoc voi heap bop toi 2GB
  env:
    NODE_OPTIONS: --max-old-space-size=2048
  run: |
    npm run build
    <span class="tok-comment"># neu cai nay hong, mot phu thuoc vua nang muc dung heap.</span>
    <span class="tok-comment"># Fix la giam heap use, khong phai nang --max-old-space-size.</span></code></pre>

<div class="callout">
<p><strong>Bài test khẳng định một TÍNH CHẤT CỦA BẢN DỰNG, không phải một sự thật về phần cứng.</strong> Một bản phát hành production phải chạy được trên những cỗ máy mà người viết KHÔNG chọn, và cái bước này mã hoá cỗ máy NHỎ NHẤT như một ràng buộc. Nếu nó hỏng, có ai đó vừa gỡ mất phần lề mà bản vá đã khôi phục — và cách vá là KHÔI PHỤC LỀ, không phải nâng cái trần trong bài test.</p>
</div>

<h3>Bài nghiệm thu đáng gì, tổng quát</h3>
<div class="kv-grid">
<div class="kv"><span class="k">tái lập ĐÚNG cú hỏng cũ</span><span class="v">bài test heap 1600 MB bên trên. Giá trị là ở chỗ cái BUG CỤ THỂ ấy không quay lại được một cách âm thầm — hoặc nó tự vá, hoặc nó làm phép kiểm hỏng</span></div>
<div class="kv"><span class="k">khẳng định đường smoke</span><span class="v">phép kiểm route-đã-mount của script deploy từ lịch sử Chương 1: một cú <code>curl</code> không xác thực tới các route lõi, hỏng khi có bất kỳ 404 nào. Không toàn diện, và không cần toàn diện</span></div>
<div class="kv"><span class="k">khẳng định tệp có mặt trong bản phát hành</span><span class="v">phép "đếm tệp trước khi công bố" của job phát hành ở bài 5.4. Thiếu <code>latest-mac.yml</code> âm thầm làm vỡ tự-cập-nhật, nên phép kiểm ĐẾM nó — và từ chối công bố một bản phát hành thiếu nó</span></div>
<div class="kv"><span class="k">khẳng định thứ workflow TỰ nó làm</span><span class="v">script soát của bài 6.5. Sáu lệnh grep giữ cho kho trung thực về việc workflow của nó nói gì</span></div>
</div>

<h3>Thứ tự kiểm chứng, khi bạn đã nghĩ tới một bản vá</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">tái lập cú hỏng ở máy</span><span class="lz-d">dưới ràng buộc mà bài 8.3 nhận diện. Nếu bạn không tái lập được, bạn KHÔNG biết mình đang vá cái gì</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">áp bản vá dưới CÙNG ràng buộc</span><span class="lz-d">rồi xem cú hỏng chuyển thành cú thành công. Đó là BẰNG CHỨNG</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">mã hoá ràng buộc thành một phép kiểm</span><span class="lz-d">để cái LỚP ấy không quay lại được. Đó là BÀI NGHIỆM THU</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">CỐ Ý phá một thứ khác rồi xem phép kiểm HỎNG</span><span class="lz-d">khuôn mẫu "kiểm bộ kiểm" của Deploy VPS. Một phép kiểm bạn chưa bao giờ thấy nó HỎNG là một phép kiểm bạn chưa kiểm thử</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">chỉ tới lúc này, đẩy và để CI chạy</span><span class="lz-d">lần chạy xanh là một XÁC NHẬN, không phải bằng chứng</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — bản vá NÂNG cái trần thay vì KHÔI PHỤC lề.</strong> Đáp trả cám dỗ nhất cho "bản dựng cạn heap" là thêm <code>--max-old-space-size=8192</code> rồi đẩy. Nó chạy — cho tới khi cái phụ thuộc kế nâng đỉnh dùng thêm 400 MB nữa và CI lại đỏ, sau khi vừa đổi một cú OOM lấy một bản dựng chậm âm thầm ở production. Phần tái lập nhận diện được bản vá NÊN khôi phục lề hay nâng trần. Cả hai đều chính đáng; TRỘN chúng là cách lớp lỗi quay lại.</p>
</div>

<h3>Lần chạy XANH như một PHÉP KIỂM, không phải một chứng minh</h3>
<div class="callout warn">
<p><strong>Mọi bản vá trong khoá học này sống chết trên cùng một phép đo.</strong> Một bản dựng xanh sau một thay đổi là bằng chứng có SỨC MẠNH ngang với tỉ lệ flake — mà với một flake 20% là 80% xác suất do ngẫu nhiên. Bằng chứng là PHẦN TÁI LẬP: nó hỏng khi không có bản vá, nó qua khi có bản vá, dưới cùng ràng buộc, HAI lần. Một cho cú hỏng, một cho bản vá.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Một bản vá được kiểm chứng khi CÙNG một ràng buộc đẻ ra cú hỏng khi KHÔNG có nó và cú thành công khi CÓ nó — cái đèn xanh của CI là một xác nhận của cái CẶP ấy, không phải một thứ THAY THẾ nó.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About tests in workflows</span><span class="lc-sub">docs.github.com/en/actions/automating-builds-and-tests/about-continuous-integration — khung tổng quát của CI, kèm ghi chú cụ thể rằng một bài test là một LỜI KHẲNG ĐỊNH bạn CHỈ VÀO ĐƯỢC khi nó hỏng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — --max-old-space-size và các giới hạn tài nguyên tiến trình</span><span class="lc-sub">nodejs.org/api/cli.html — cái cờ dùng bên trên và các lựa chọn khác để ràng buộc tài nguyên, tức là bộ đồ nghề cho bước tái lập.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google Testing Blog — regression tests và thay đổi bộc lộ bug</span><span class="lc-sub">testing.googleblog.com — thực hành viết BÀI TEST HỎNG TRƯỚC, áp ở tầng CI thay vì tầng unit.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — smoke test trên các route lõi, và kiểm bộ kiểm</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — các bài nghiệm thu lúc-deploy mà khoá này cứ nhắc lại, gồm cả cách một trong số đó tự bị hỏng và cách chuyện ấy bị phát hiện.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — truy vấn phải chạy dưới volume dữ liệu production</span><span class="lc-sub">/courses/postgresql/learn${REF} — cùng kỷ luật ấy áp lên một cơ sở dữ liệu: tái lập đường chậm dưới điều kiện thực tế trước khi khẳng định index có tác dụng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.6 ─────────────────────────── */
    {
      title: '8.6 — Chapter 8 quiz|||8.6 — Kiểm tra Chương 8',
      slug: 'ga-8-6-kiem-tra',
      type: 'QUIZ',
      description: 'Tám câu: mã thoát 127/134/137, cái bẫy ống lần thứ ba, xác suất "chạy lại thấy xanh", tái lập bằng cách bóp máy, và thứ tự đọc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>What Chapter 8 measured</h2>
<p class="lead">Eight questions, twelve minutes. The chapter&#39;s recurring finding: a red build is diagnosed by <em>not</em> reading the log first, and by measuring rather than guessing.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">8.1 — exit codes</span><span class="lz-lnote">measured, not looked up: 127 not found, 134 V8 abort, 137 killed — and the pipe trap for the third time in this course</span></div>
<div class="lz-layer"><span class="lz-lname">8.2 — flake</span><span class="lz-lnote">"re-ran and it passed" is the MOST LIKELY outcome for a 20% flake, so it proves nothing; 14 consecutive greens to be 95% confident</span></div>
<div class="lz-layer"><span class="lz-lname">8.3 — reproduce</span><span class="lz-lnote">make your machine worse to match; and the V8 heap default is 8,240 MB not 4,000 as folklore claims</span></div>
<div class="lz-layer"><span class="lz-lname">8.4 — reading order</span><span class="lz-lnote">duration, skipped, matrix, exit code, diff — then log. The one failure this course has diagnosed itself in four steps</span></div>
<div class="lz-layer"><span class="lz-lname">8.5 — verifying</span><span class="lz-lnote">reproduce without fix → 134, reproduce with fix → 0; codify the constraint as an acceptance test</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Chương 8 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Phát hiện lặp lại của chương: một bản dựng đỏ được chẩn đoán bằng cách KHÔNG đọc log trước, và bằng cách ĐO chứ không đoán.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">8.1 — mã thoát</span><span class="lz-lnote">đo chứ không tra: 127 không tìm thấy, 134 V8 abort, 137 bị giết — và cái bẫy ống lần thứ ba trong khoá học</span></div>
<div class="lz-layer"><span class="lz-lname">8.2 — flake</span><span class="lz-lnote">"chạy lại thấy qua" là kết cục NHIỀU KHẢ NĂNG NHẤT với một flake 20%, nên nó không chứng minh gì; 14 lần xanh liên tiếp mới tin 95%</span></div>
<div class="lz-layer"><span class="lz-lname">8.3 — tái lập</span><span class="lz-lnote">làm máy bạn tệ đi cho khớp; và trần heap V8 mặc định là 8.240 MB chứ không phải 4.000 như truyền thuyết nói</span></div>
<div class="lz-layer"><span class="lz-lname">8.4 — thứ tự đọc</span><span class="lz-lnote">thời lượng, bị bỏ qua, ma trận, mã thoát, diff — rồi mới log. Cú hỏng duy nhất của khoá học tự chẩn đoán được ở bước 4</span></div>
<div class="lz-layer"><span class="lz-lname">8.5 — kiểm chứng</span><span class="lz-lnote">tái lập KHÔNG có bản vá → 134, tái lập CÓ bản vá → 0; mã hoá ràng buộc thành một bài nghiệm thu</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A step exits 127. What does that name?|||Một bước thoát 127. Điều đó gọi tên cái gì?',
            options: [
              'Command not found — the shell could not find what you asked it to run, so a typo or a missing install step is likely|||Không tìm thấy lệnh — shell không tìm được thứ bạn yêu cầu chạy, nên gõ sai hay thiếu bước cài là khả năng cao',
              'A generic failure of the program — read the tool output|||Cú hỏng chung của chương trình — đọc đầu ra công cụ',
              'A permissions error on an executable file|||Lỗi quyền trên một tệp thực thi',
              'The process was killed by an external signal|||Tiến trình bị một tín hiệu ngoài giết',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A Node build exits 134 with "Reached heap limit". Which fix matches, and why?|||Một bản dựng Node thoát 134 với "Reached heap limit". Cách vá nào KHỚP, và vì sao?',
            options: [
              'V8 called abort() because it could not allocate — raise --max-old-space-size, and/or reduce peak heap use (drop sourcemaps, split the build)|||V8 gọi abort() vì không cấp phát được — nâng --max-old-space-size, hoặc giảm đỉnh dùng heap (bỏ sourcemap, tách bản dựng)',
              'The OS killed it (OOM killer) — add swap or reduce process count|||OS giết nó (OOM killer) — thêm swap hoặc giảm số tiến trình',
              'A permissions issue — chmod the entrypoint|||Vấn đề quyền — chmod cái điểm vào',
              'The user cancelled the workflow — nothing to fix|||Người dùng huỷ workflow — không có gì để vá',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why did this course measure `set -e` failure as exit 0 the first time it tried?|||Vì sao khoá học này đo cú hỏng `set -e` ra exit 0 ở lần thử đầu?',
            options: [
              'The measurement command piped output through grep/tail, and a pipeline reports the exit code of its LAST command unless pipefail is set|||Lệnh đo đưa đầu ra qua grep/tail, và một đường ống báo cáo mã thoát của lệnh CUỐI trừ khi có pipefail',
              'set -e is disabled inside CI runners|||set -e bị tắt trong runner CI',
              'The script accidentally called exit 0|||Script vô tình gọi exit 0',
              'grep suppresses non-zero exit codes|||grep chặn các mã thoát khác không',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A test fails 20% of the time. You see it fail, re-run, and it passes. What did that prove?|||Một bài test hỏng 20% số lần. Bạn thấy nó hỏng, chạy lại, nó qua. Điều đó chứng minh gì?',
            options: [
              'Nothing — an 80% chance of green on the next run is exactly what a 20% flake produces, so a single green is not evidence|||Không gì cả — 80% khả năng xanh ở lần chạy kế đúng là thứ mà một flake 20% đẻ ra, nên một lần xanh không phải bằng chứng',
              'That it was a flake, not a real bug|||Rằng nó là flake, không phải bug thật',
              'That the fix worked, since it now passes|||Rằng bản vá có tác dụng, vì giờ nó qua',
              'That the test is broken and can be removed|||Rằng bài test đã hỏng và có thể xoá đi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A test is green when run alone and red when run in the suite. Which category?|||Một bài test xanh khi chạy một mình và đỏ khi chạy trong bộ. Thuộc loại nào?',
            options: [
              'Order dependence — deterministic and diagnosed by running alone, not by re-running the suite|||Phụ thuộc thứ tự — có tính quyết định và chẩn đoán bằng cách chạy MỘT MÌNH, không phải bằng cách chạy lại cả bộ',
              'A random flake — re-run until it passes|||Một flake ngẫu nhiên — chạy lại tới khi qua',
              'A real bug in the test itself|||Bug thật trong chính bài test',
              'A CI environment issue that cannot be reproduced locally|||Vấn đề môi trường CI không tái lập được ở máy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This course measured V8&#39;s default heap on the sandbox machine. What was it, and what does that say?|||Khoá này đo trần heap MẶC ĐỊNH của V8 trên máy hộp cát. Con số là bao nhiêu, và nói lên gì?',
            options: [
              '8,240 MB — twice the "V8 defaults to 4 GB" folklore, showing that the advice repeated in blog posts is out of date and worth checking with one line|||8.240 MB — gấp đôi truyền thuyết "V8 mặc định 4 GB", cho thấy lời khuyên chép qua các blog đã cũ và đáng kiểm bằng một dòng',
              'Exactly 4 GB, confirming the standard advice|||Đúng 4 GB, xác nhận lời khuyên tiêu chuẩn',
              '2 GB, because the machine has low RAM|||2 GB, vì máy ít RAM',
              'Unmeasurable — Node does not expose the limit at runtime|||Không đo được — Node không cho biết trần này lúc chạy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You are triaging a red release run with three green build jobs and one red publish job. What failed?|||Bạn đang phân loại một lần chạy phát hành đỏ với ba job dựng xanh và một job công bố đỏ. Cái gì hỏng?',
            options: [
              'Read the earliest failure in the chain, not the loudest — but if the publish job is the only one red, its own log holds the cause|||Đọc cú hỏng SỚM NHẤT trong chuỗi, không phải cú ồn ào nhất — nhưng nếu chỉ job công bố đỏ, log của chính nó chứa nguyên nhân',
              'Four things failed and each needs its own investigation|||Bốn thứ hỏng và mỗi cái cần điều tra riêng',
              'The build jobs failed and cascaded — publish is just the symptom|||Các job dựng hỏng và lan truyền — công bố chỉ là triệu chứng',
              'The runner died — always re-run first|||Runner chết — luôn chạy lại trước',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'How do you verify a fix without relying on "the next run is green"?|||Làm sao kiểm chứng bản vá mà không dựa vào "lần chạy kế xanh"?',
            options: [
              'Reproduce the failure under the same constraint (e.g. constrained heap), apply the fix, reproduce success — then codify the constraint as an acceptance test|||Tái lập cú hỏng dưới CÙNG ràng buộc (ví dụ heap bị bóp), áp bản vá, tái lập cú thành công — rồi mã hoá ràng buộc thành một bài nghiệm thu',
              'Run CI three times; three greens in a row is proof|||Chạy CI ba lần; ba lần xanh liên tiếp là chứng minh',
              'Add extensive logging so the next failure is easy to diagnose|||Thêm log dày đặc để lần hỏng kế dễ chẩn đoán',
              'Ask a reviewer to inspect the diff|||Nhờ người review đọc diff',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
