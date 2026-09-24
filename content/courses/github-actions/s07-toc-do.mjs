import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 7: Tốc độ, concurrency, và cái giá thật.
 * Số đo: đường tới hạn 543s/1.107 máy-giây, phương sai 1,60 lần trên cùng
 * một workflow, và hai giá trị `cancel-in-progress` ngược nhau đều đúng.
 */

export default {
  title: 'Chapter 7 — Speed, concurrency, and what it costs|||Chương 7 — Tốc độ, concurrency, và cái giá của nó',
  slug: 'ga-ch7-toc-do',
  description: 'Cùng một workflow, cùng một nhánh, chạy 100 giây và 160 giây — biên độ 1,60 lần trước khi bạn đổi bất cứ thứ gì. Cộng hai workflow đặt `cancel-in-progress` NGƯỢC NHAU và cả hai đều đúng.',
  sortOrder: 8,
  lessons: [

    /* ─────────────────────────── 7.0 ─────────────────────────── */
    {
      title: '7.0 — Chapter 7 slides: speed, concurrency and cost in pictures|||7.0 — Slide Chương 7: tốc độ, concurrency và cái giá bằng hình',
      slug: 'ga-7-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 30 slide của Chương 7: đường tới hạn tô đậm trên đồ thị job thật, một cạnh needs: dời đi cắt trung vị 124 s → 95 s, ba cú push với cancel-in-progress true/false và queue: max, 14 lần chạy cùng commit dao động 37–77 s, tách job tốn gấp đôi máy-giây, và giá mỗi phút 09/2026 — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Slides</span>
<h2>The whole chapter in 30 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: the release workflow&#39;s job graph with its critical path drawn in, the timeline where two builds finish early and wait, one <code>needs:</code> edge moved on a real sandbox, three pushes handled three ways by <code>concurrency</code>, the ten-second ladder of a cancelled step, fourteen runs of one commit spread from 37 to 77 seconds, a job split in three that doubles machine time, and the September 2026 price per minute.</p>
<p>Slides 3–8 belong to Lesson 7.1, 9–15 to 7.2, 16–20 to 7.3, 21–24 to 7.4 and 25–27 to 7.5. The last three are the chapter&#39;s common mistakes, a cheat sheet and a 45-minute practice session. Every new log and number is real: recorded on 24 September 2026 on GitHub-hosted runners in the public sandbox repository <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch07-toc-do" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, branch <code>ch07-toc-do</code>, plus this repository&#39;s own release run 32662461744 read through the API. Four slides correct earlier versions of this chapter: the macOS out-of-memory failure was run 32399243354 (not 32400097927), the Chapter 5 cache numbers are now runner measurements, billing is a price per minute rather than a multiplier, and the repository has 3 of 14 workflows with a concurrency group. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Slide</span>
<h2>Cả chương trong 30 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để nắm hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại bên trong bài giảng giải thích nó: đồ thị job của workflow phát hành với đường tới hạn tô đậm, dòng thời gian nơi hai bản dựng xong sớm rồi ngồi chờ, một cạnh <code>needs:</code> được dời đi trên sân tập thật, ba cú push được <code>concurrency</code> xử lý theo ba cách, bậc thang mười giây của một bước bị huỷ, mười bốn lần chạy của cùng một commit trải từ 37 tới 77 giây, một job bị tách làm ba tốn gấp đôi thời gian máy, và giá mỗi phút tính đến 09/2026.</p>
<p>Slide 3–8 thuộc Bài 7.1, 9–15 thuộc 7.2, 16–20 thuộc 7.3, 21–24 thuộc 7.4 và 25–27 thuộc 7.5. Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 45 phút. Mọi log và con số mới đều THẬT: ghi ngày 24/09/2026 trên runner của GitHub trong kho sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch07-toc-do" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, nhánh <code>ch07-toc-do</code>, cộng lần chạy phát hành 32662461744 của chính kho này đọc qua API. Bốn slide đính chính bản cũ của chương: cú hỏng hết bộ nhớ trên macOS là run 32399243354 (không phải 32400097927), số cache của Chương 5 giờ là số đo trên runner, tiền được tính theo giá mỗi phút chứ không còn theo hệ số, và kho giờ có 3 trên 14 workflow khai nhóm concurrency.</p>
</div>
${gallery('ga-07', [
[1, "Bìa"],
[2, "Bản đồ chương: đo trước, tối ưu sau, và biết giá"],
[3, "Đường tới hạn: 3 trong 5 job quyết định cả lần chạy"],
[4, "Dòng thời gian: Linux và Windows xong sớm rồi ngồi chờ"],
[5, "Một script đọc đường tới hạn từ API — không cần mở giao diện"],
[6, "Sân tập: dời MỘT cạnh needs: — trung vị 124 s → 95 s"],
[7, "Hai workflow khác nhau đúng một dòng"],
[8, "Bốn hình dạng đồ thị, bốn công thức cho cái sàn"],
[9, "Ba cú push, ba cách xử lý: huỷ · xếp · xếp hàng dài"],
[10, "Huỷ là dừng GIỮA bước — và bước dọn dẹp vẫn chạy"],
[11, "Huỷ không tức thời: tiến trình có 10 giây để dọn"],
[12, "Chọn group và cancel-in-progress theo việc, không theo khuôn"],
[13, "Hai workflow, hai group = KHÔNG có khoá — cơ chế sự cố 06/07"],
[14, "concurrency xếp hàng — nó không làm việc thành bất biến"],
[15, "queue: max mới có — và actionlint chưa biết tới nó"],
[16, "14 lần chạy CÙNG commit: 37 s tới 77 s"],
[17, "Phân rã: ba lần chậm nhất chậm vì ba lý do khác nhau"],
[18, "Ở mức bước, phương sai nhỏ hơn — trừ bước dùng mạng"],
[19, "Quy tắc đo: trung vị của nhiều lần, so từng bước"],
[20, "Thời lượng là tín hiệu phân loại, trước khi mở log"],
[21, "Tách ba việc ra ba job: đồng hồ −13%, máy-giây ×2"],
[22, "Bảng xếp hạng: phép tăng tốc nào rơi TRÊN đường tới hạn"],
[23, "Nhân với tần suất: workflow chạy nhiều mới là workflow đắt"],
[24, "Thứ tự làm việc khi ai đó nói \"CI chậm quá\""],
[25, "Giá mỗi phút (09/2026): macOS đắt gấp ~10 lần Linux"],
[26, "Nếu kho riêng tư: 76% tiền nằm ở workflow phát hành"],
[27, "Phía bên kia cán cân: cú hỏng chỉ CI thấy"],
[28, "Sai lầm hay gặp ở Chương 7"],
[29, "Bảng tra nhanh Chương 7"],
[30, "Thực hành Chương 7 (45 phút) trên kho của chính bạn"]
])}
`,
    },

    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — The critical path, and the job that was already waiting|||7.1 — Đường tới hạn, và cái job vốn đã ngồi chờ',
      slug: 'ga-7-1-duong-toi-han',
      type: 'VIDEO',
      description: '1.107 máy-giây gói trong 555 giây đồng hồ. Nhưng chỉ 543 giây trong số đó nằm trên đường tới hạn — nên làm nhanh job Linux, cái xong sớm 3 phút 17 giây, thay đổi được ĐÚNG con số không.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>The critical path, and the job that was already waiting</h2>
<p class="lead">"Make CI faster" is usually attempted by finding the slowest step and speeding it up. That works about half the time, and the other half is spent optimising something that was not on the path. The distinction is arithmetic and takes one reading of a run.</p>

<h3>The two numbers a run has</h3>
${slide('ga-07', 3, 'Đường tới hạn: 3 trong 5 job quyết định cả lần chạy')}
<div class="out">run 32662461744

tong MAY-GIAY:      72 + 241 + 437 + 323 + 34 = 1.107 s
thoi gian DONG HO:                              555 s
duong TOI HAN:      72 + 437 + 34             = 543 s</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">machine-seconds</span><span class="lz-t">1,107 s</span><span class="lz-d">what you pay for, and what a billing conversation is about</span></div>
<div class="lz-step"><span class="lz-k">wall-clock</span><span class="lz-t">555 s</span><span class="lz-d">what a developer waits, and what a "CI is slow" complaint is about</span></div>
<div class="lz-step"><span class="lz-k">critical path</span><span class="lz-t">543 s</span><span class="lz-d">the longest chain of dependent jobs. Wall-clock cannot go below this without changing the structure</span></div>
</div>

<div class="callout">
<p><strong>Wall-clock is 555 and the critical path is 543, so the structure is already near-optimal for its shape.</strong> The twelve-second gap is job hand-off overhead. Every second of improvement has to come out of one of three jobs — and 564 of the 1,107 machine-seconds are in jobs that are not among them.</p>
</div>

<h3>Which jobs are on it, and which are not</h3>
${slide('ga-07', 4, 'Dòng thời gian: Linux và Windows xong sớm rồi ngồi chờ')}
<div class="out">Kiem tra ma   72s   ubuntu    <- TREN duong toi han (moi thu doi no)
Dung macOS   437s   macos     <- TREN duong toi han (cham nhat cua ba)
Cong bo       34s   ubuntu    <- TREN duong toi han (doi ca ba)

Dung Linux   241s   ubuntu    <- NGOAI. Xong luc 19:54:49, cho 3m17s
Dung Windows 323s   windows   <- NGOAI. Xong luc 19:56:11, cho 1m55s</div>

<div class="callout warn">
<p><strong>Halving the Linux build would change the run duration by zero seconds.</strong> It finishes three minutes and seventeen seconds early already; making it finish four minutes early moves nothing. That job is 241 machine-seconds of perfectly reasonable optimisation target that returns nothing in wall-clock — and it is exactly the kind of job people optimise, because it is the one whose log they were reading.</p>
</div>

<h3>The three real levers, in order of what they return</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — make the macOS build faster · up to 437 s available</span><span class="lz-lnote">the largest single item on the path. Chapter 2 measured why it is slow: 2.1× Linux on the build step and 3.4× on artifact upload. Any real reduction here comes straight off the run</span></div>
<div class="lz-layer"><span class="lz-lname">2 — remove the check job from the path · up to 72 s</span><span class="lz-lnote">it runs first and everything <code>needs:</code> it. If the check does not gate the build — and a lint pass usually does not — running it <em>alongside</em> rather than before removes 72 seconds from the chain and costs nothing</span></div>
<div class="lz-layer"><span class="lz-lname">3 — start the publish sooner · up to 34 s</span><span class="lz-lnote">smallest, and structurally the hardest: it genuinely needs all three installers. Not worth attacking</span></div>
<div class="lz-layer"><span class="lz-lname">what returns nothing</span><span class="lz-lnote">Linux (241 s) and Windows (323 s), plus every cache and dependency optimisation inside them. Chapter 5 measured a perfect cache as worth 35 seconds on the Linux job; on the critical path that is 35 seconds of nothing</span></div>
</div>

<div class="callout ok">
<p><strong>Lever 2 is the interesting one because it is free.</strong> The check job is 72 seconds of lint and typecheck that everything waits for. If a lint failure should stop the release, keeping it as a gate is correct. If it should merely be visible, moving it off the chain shortens every release by 72 seconds — 13% of the run — with no machine-seconds saved and no code changed. Restructuring beats optimising, and it usually costs less.</p>
</div>

<h3>Computing it for your own workflow</h3>
${slide('ga-07', 8, 'Bốn hình dạng đồ thị, bốn công thức cho cái sàn')}
<p>The API gives every job&#39;s start and end. The critical path is the longest chain through the <code>needs:</code> graph, and for the shapes that occur in practice you can read it off:</p>

<div class="kv-grid">
<div class="kv"><span class="k">no <code>needs:</code> anywhere</span><span class="v">the critical path is the single slowest job. This is <code>ci-lint.yml</code>: two independent jobs, run length = the longer one</span></div>
<div class="kv"><span class="k">a straight chain</span><span class="v">sum of every job in it. Each <code>needs:</code> edge adds its job&#39;s full duration to the floor</span></div>
<div class="kv"><span class="k">a fan-out and a join</span><span class="v">the pattern here: pre + <strong>max</strong>(parallel legs) + post. Only the slowest leg counts, which is why <code>fail-fast</code> and leg balance matter</span></div>
<div class="kv"><span class="k">the sanity check</span><span class="v">critical path should be close to wall-clock. If wall-clock is much larger, jobs are waiting for runners rather than for each other — a different problem with a different fix</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — adding a <code>needs:</code> because the order feels right.</strong> A <code>needs:</code> edge is a promise that job B consumes job A&#39;s output. Adding one for tidiness — "check formatting before we build" — converts two parallel jobs into a chain and adds the first job&#39;s entire duration to every run, permanently, for no information gained. The test is concrete: if job B would still produce a correct result when job A fails, the edge is not a data dependency and it is costing you the whole of A.</p>
</div>

<h3>Three words, defined once</h3>
<p>This chapter leans on three terms that are easy to blur, so here they are side by side before we compute anything:</p>
<table>
<thead><tr><th>Term</th><th>What it measures</th><th>Who cares</th><th>In run 32662461744</th></tr></thead>
<tbody>
<tr><td><strong>machine-seconds</strong> (máy-giây)</td><td>the sum of every job&#39;s duration, as if the jobs ran one after another</td><td>whoever pays the bill — GitHub bills per job, rounded up to the minute</td><td>1,107 s</td></tr>
<tr><td><strong>wall-clock</strong> (thời gian đồng hồ)</td><td>from the first job being created to the last job finishing</td><td>the person waiting for a green tick</td><td>553 s (555 s from the run&#39;s own timestamps)</td></tr>
<tr><td><strong>critical path</strong> (đường tới hạn)</td><td>the longest chain of jobs linked by <code>needs:</code></td><td>whoever wants wall-clock to go down</td><td>72 + 437 + 34 = 543 s</td></tr>
<tr><td><strong>slack</strong> (độ chùng)</td><td>how long a job could grow before it lands on the critical path</td><td>whoever is tempted to optimise it</td><td>Linux 199 s, Windows 117 s</td></tr>
</tbody>
</table>
<p>Machine-seconds can only go down by doing less work. Wall-clock can go down in two ways: doing less work <em>on the critical path</em>, or changing the shape of the graph so the critical path itself is shorter. Those are different activities, and this lesson is about telling them apart.</p>

<h3>Step by step: reading the critical path from the API</h3>
${slide('ga-07', 5, 'Một script đọc đường tới hạn từ API — không cần mở giao diện')}
<p>The run page draws the graph, but it does not tell you which chain is the longest. You can compute it from two API calls. The sandbox repository has a small script that does exactly that, <a href="https://github.com/cuonghoang1103/ga-san-tap/blob/ch07-toc-do/ch07/duong-toi-han.mjs" target="_blank" rel="noopener"><code>ch07/duong-toi-han.mjs</code></a>, and pointed at this repository&#39;s release run it reproduces the chapter&#39;s numbers to within two seconds:</p>
<pre><code class="language-bash">node ch07/duong-toi-han.mjs 32662461744 cuonghoang1103/api-backend</code></pre>
<div class="out">job                         cho may  chay   xong luc
Kiểm tra mã                     3s    72s   19:50:44   &lt;- TREN duong toi han
Dựng Linux                      3s   241s   19:54:49   ngoai: cho 199s
Dựng macOS                      3s   437s   19:58:05   &lt;- TREN duong toi han
Dựng Windows                    3s   323s   19:56:11   ngoai: cho 117s
Công bố bản phát hành           2s    34s   19:58:42   &lt;- TREN duong toi han

tong MAY-GIAY      1107 s
DONG HO (job dau tao -&gt; job cuoi xong)  553 s
duong TOI HAN      72 + 437 + 34 = 543 s
phan con lai = cho runner + ban giao giua job: 10 s</div>
<p>The method does not need to parse your YAML, which is what makes it reusable. It relies on one fact about how GitHub schedules jobs: a job with <code>needs:</code> is only <em>created</em> once everything it needs has finished. So the script walks backwards:</p>
<ol>
<li>Take the job that finished last. It is the end of the critical path by definition — nothing finished after it.</li>
<li>Look at when that job was <em>created</em> (<code>created_at</code>). The job it was waiting for is the one that finished most recently before that moment.</li>
<li>Repeat from that job until you reach one that nothing was blocking.</li>
<li>Add up the durations (<code>completed_at − started_at</code>) of the chain. Compare the total with the wall-clock; the gap is queueing plus hand-off.</li>
</ol>
<p>If you only want the raw numbers, one <code>gh</code> call gives them:</p>
<pre><code class="language-bash">gh api repos/OWNER/REPO/actions/runs/RUN_ID/jobs \\
  --jq '.jobs[] | [.name, .created_at, .started_at, .completed_at] | @tsv'</code></pre>
<p>The sandbox workflows call the same script as their final step, with <code>GH_TOKEN: &#36;{{ github.token }}</code> and <code>permissions: actions: read</code>, so every run writes its own critical path into the job summary. That turns "which jobs are on the path?" from an investigation into something you can glance at.</p>

<div class="callout warn">
<p><strong>Two caveats on the backwards walk.</strong> It assumes that a job created right after another finished was waiting for it — true for <code>needs:</code>, but a job that was merely <em>queued</em> for a runner at that moment would confuse it. And it ignores skipped jobs, which have no duration. For the shapes this course uses it is exact; for a graph with fifty jobs, read the <code>needs:</code> lists as well.</p>
</div>

<h3>Measured on the sandbox: move one <code>needs:</code> edge</h3>
${slide('ga-07', 6, 'Sân tập: dời MỘT cạnh needs: — trung vị 124 s → 95 s')}
<p>The api-backend numbers come from one historical run. To see the lever work, the sandbox has two workflows with the same jobs as the release: a check job (type-check plus a CPU-bound test suite), a build on <code>ubuntu-24.04</code>, <code>windows-2025</code> and <code>macos-15</code>, and a publish job. They differ in one line.</p>
${slide('ga-07', 7, 'Hai workflow khác nhau đúng một dòng')}
<p>Both were started together five times, so each pair ran under the same network and runner conditions. Wall-clock in seconds:</p>
<table>
<thead><tr><th>Pair</th><th>check GATES the build</th><th>check runs ALONGSIDE</th></tr></thead>
<tbody>
<tr><td>1</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009578496" target="_blank" rel="noopener">113</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009578213" target="_blank" rel="noopener">96</a></td></tr>
<tr><td>2</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010873956" target="_blank" rel="noopener">124</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010879542" target="_blank" rel="noopener">99</a></td></tr>
<tr><td>3</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011282047" target="_blank" rel="noopener">117</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011288239" target="_blank" rel="noopener">95</a></td></tr>
<tr><td>4</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011550990" target="_blank" rel="noopener">229</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011556092" target="_blank" rel="noopener">79</a></td></tr>
<tr><td>5</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012034033" target="_blank" rel="noopener">128</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012040208" target="_blank" rel="noopener">76</a></td></tr>
<tr><td><strong>median</strong></td><td><strong>124 s</strong></td><td><strong>95 s (−23%)</strong></td></tr>
</tbody>
</table>
<p>Three things are worth reading out of that table rather than just the headline:</p>
<ul>
<li><strong>The saving is roughly the check job&#39;s length.</strong> The check took 34–44 s; the medians differ by 29 s. The remainder is noise and the few seconds of hand-off that the chained version pays twice.</li>
<li><strong>Machine-seconds barely moved</strong> — median 175 against 195, well inside the noise. Removing an edge does not remove work; it only lets the same work overlap. That is why it is the cheapest speed-up in this chapter.</li>
<li><strong>Pair 4 shows why one run proves nothing.</strong> The Windows build took 167 s instead of its usual 57–83, and the chained run took 229 s. Had that been the only "before" measurement, the change would have looked like a 60% improvement.</li>
</ul>

<div class="callout">
<p><strong>The critical path is a property of the work, not of the platform.</strong> In api-backend the macOS build is the long pole. In the sandbox, with a small TypeScript project, Windows was on the critical path in all ten runs and macOS finished in 26–45 s — faster than Linux in some runs. Do not carry "macOS is always the slow one" from one project to another; read it off each project&#39;s own runs.</p>
</div>

<h3>When to keep a <code>needs:</code> edge — and when to remove it</h3>
<table>
<thead><tr><th>Situation</th><th>Keep the edge?</th><th>Why</th></tr></thead>
<tbody>
<tr><td>B downloads an artifact that A uploads</td><td>Keep</td><td>a real data dependency — B cannot start without A&#39;s output</td></tr>
<tr><td>B deploys, A runs the tests</td><td>Keep</td><td>a <em>safety</em> dependency: you do not want to deploy an untested commit. Here the edge is the whole point</td></tr>
<tr><td>B builds, A lints</td><td>Usually remove</td><td>the build does not read anything from lint. Move the gate to where it matters — the publish or deploy job can <code>needs: [lint, build]</code></td></tr>
<tr><td>B is expensive (macOS minutes), A is cheap and fails often</td><td>Consider keeping</td><td>a fast failing gate saves expensive minutes on bad commits. This is a cost trade, not a correctness one — decide with numbers</td></tr>
<tr><td>A exists "so that the log reads in order"</td><td>Remove</td><td>order in the UI is not worth a job&#39;s duration on every run</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>Slack is a budget, and you can spend it.</strong> The Linux build in the release run has 199 s of slack. That means you could add up to about three minutes of extra checks to it — an extra test suite, a bundle-size report — and the release would not get one second slower. Slack also tells you where a cheaper, smaller runner would cost nothing in wall-clock. Before optimising a job with slack, ask whether you should instead be <em>using</em> its slack.</p>
</div>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: Our pipeline takes 12 minutes. Where do you start?</strong><br>A: Read the per-job timings of a few recent runs and find the critical path — the longest chain of <code>needs:</code>. Only jobs on that chain affect wall-clock. Then look for edges that are not data or safety dependencies, because removing one is free. Only after that do I speed up individual steps, starting with the slowest job on the path.</p>
<p><strong>Q: We made our Linux build twice as fast and CI did not get faster. Why?</strong><br>A: The Linux build was not on the critical path; it had slack. Wall-clock is set by the longest chain, so shortening a job that was already waiting changes nothing.</p>
<p><strong>Q: What is the difference between machine time and wall-clock time?</strong><br>A: Machine time is the sum of all job durations and is what you pay for; wall-clock is how long someone waits. Parallelising lowers wall-clock and can raise machine time.</p>
</div>

<h3>What this changes about reading a slow workflow</h3>
<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">the wrong first question</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"which step is slowest?"</span><span class="lz-nsub">answerable, and frequently answers about a job that finishes early and waits</span></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">the right first question</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"which jobs are on the longest chain?"</span><span class="lz-nsub">three of five, here. Everything else is free to be slow, and optimising it is free of effect</span></div></div>
</div>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> A run has a floor set by its longest chain of dependent jobs, so before optimising anything, list which jobs are on that chain — and expect the answer to exclude the one you were about to work on.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate says "CI is slow, let&#39;s cache more". Before anyone touches a cache, find out which jobs actually set the run&#39;s length.</p><ol>
<li>Pick a workflow in your own repository that has at least two jobs (if none has, copy <code>ch07-do-thi-chuoi.yml</code> from the sandbox branch <code>ch07-toc-do</code> into a test repository and push it).</li>
<li>Copy <code>ch07/duong-toi-han.mjs</code> next to it. Run <code>gh run list --workflow &lt;file&gt; --limit 3</code> and then <code>node duong-toi-han.mjs &lt;run_id&gt; &lt;owner/repo&gt;</code> on each of the three runs.</li>
<li>Write down, for each run: machine-seconds, wall-clock, the jobs on the critical path, and the slack of every job that is not.</li>
<li>Find one <code>needs:</code> edge that is not a data or safety dependency. Make a copy of the workflow without it (move the gate to the last job), and start both with <code>gh workflow run</code> at the same time, three times.</li>
<li>Compare the medians.</li></ol>
<p><strong>Done when:</strong> you have a table of three runs with their critical paths, the same jobs appear on the path in at least two of them (or you can explain why not), and you have a before/after median from paired runs — not from one run each.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Critical path</span><span class="v">The longest chain of jobs linked by <code>needs:</code>. The run cannot finish faster than this chain.</span></div>
  <div class="kv"><span class="k">Slack</span><span class="v">How much longer a job could take before it becomes part of the critical path. Speeding up a job with slack saves no wall-clock.</span></div>
  <div class="kv"><span class="k">Machine-seconds</span><span class="v">Sum of all job durations — the billing view of a run.</span></div>
  <div class="kv"><span class="k">Wall-clock</span><span class="v">Time from the first job created to the last job finished — the waiting view.</span></div>
  <div class="kv"><span class="k">Data dependency</span><span class="v">Job B needs something job A produced (an artifact, an output). A real reason for <code>needs:</code>.</span></div>
  <div class="kv"><span class="k">Fan-out / fan-in</span><span class="v">One job starts several in parallel, and a later job waits for all of them. Floor = before + max(legs) + after.</span></div>
  <div class="kv"><span class="k">Hand-off</span><span class="v">The few seconds between one job finishing and the next job getting a runner. Paid once per edge on the chain.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A run has three numbers: machine-seconds (cost), wall-clock (waiting) and critical path (the floor for wall-clock).</li>
<li>Only jobs on the critical path affect wall-clock; the api-backend Linux build had 199 s of slack, so halving it saves nothing.</li>
<li>You can compute the path from the jobs API by walking back from the last job to the one it was created after.</li>
<li>Removing a <code>needs:</code> edge that is not a data or safety dependency is free: on the sandbox it cut the median from 124 s to 95 s with the same machine-seconds.</li>
<li>Which job is on the path depends on the workload — Windows in the sandbox, macOS in api-backend. Measure each project.</li>
<li>Slack is a budget: you can add work to a job with slack at no wall-clock cost.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — list jobs for a workflow run</span><span class="lc-sub">docs.github.com/en/rest/actions/workflow-jobs — per-job <code>started_at</code>, <code>completed_at</code> and per-step timings, which is where every number in this chapter comes from.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using jobs in a workflow</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow — the <code>needs:</code> semantics that define the graph the critical path runs through.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Critical path method</span><span class="lc-sub">en.wikipedia.org/wiki/Critical_path_method — the general technique, including slack: the 3m17s Linux spends waiting is exactly the slack on that task, and slack is the amount by which a task can slip for free.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the deploy step that was never the slow part</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the same analysis on a deploy pipeline, where the step everyone blamed turned out to have slack.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Đường tới hạn, và cái job vốn đã ngồi chờ</h2>
<p class="lead">"Làm CI nhanh lên" thường được thực hiện bằng cách tìm bước chậm nhất rồi tăng tốc nó. Cách ấy đúng khoảng một nửa số lần, và nửa còn lại tiêu vào việc tối ưu một thứ vốn KHÔNG nằm trên đường tới hạn. Chỗ phân biệt là SỐ HỌC và tốn đúng một lần đọc lần chạy.</p>

<h3>Hai con số mà một lần chạy có</h3>
${slide('ga-07', 3, 'Đường tới hạn: 3 trong 5 job quyết định cả lần chạy')}
<div class="out">run 32662461744

tong MAY-GIAY:      72 + 241 + 437 + 323 + 34 = 1.107 s
thoi gian DONG HO:                              555 s
duong TOI HAN:      72 + 437 + 34             = 543 s</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">máy-giây</span><span class="lz-t">1.107 s</span><span class="lz-d">thứ bạn TRẢ TIỀN, và là thứ một cuộc bàn về hoá đơn nói tới</span></div>
<div class="lz-step"><span class="lz-k">thời gian đồng hồ</span><span class="lz-t">555 s</span><span class="lz-d">thứ một người ngồi CHỜ, và là thứ một lời than "CI chậm quá" nói tới</span></div>
<div class="lz-step"><span class="lz-k">đường tới hạn</span><span class="lz-t">543 s</span><span class="lz-d">chuỗi job phụ thuộc DÀI NHẤT. Thời gian đồng hồ không xuống dưới con số này được nếu không đổi CẤU TRÚC</span></div>
</div>

<div class="callout">
<p><strong>Thời gian đồng hồ là 555 và đường tới hạn là 543, nên cấu trúc vốn đã gần tối ưu cho hình dạng của nó.</strong> Mười hai giây chênh là phần giao tiếp giữa các job. Mọi giây cải thiện đều phải lấy ra từ MỘT trong ba job — và 564 trong số 1.107 máy-giây nằm ở những job KHÔNG thuộc ba cái đó.</p>
</div>

<h3>Job nào nằm trên nó, job nào không</h3>
${slide('ga-07', 4, 'Dòng thời gian: Linux và Windows xong sớm rồi ngồi chờ')}
<div class="out">Kiem tra ma   72s   ubuntu    <- TREN duong toi han (moi thu doi no)
Dung macOS   437s   macos     <- TREN duong toi han (cham nhat cua ba)
Cong bo       34s   ubuntu    <- TREN duong toi han (doi ca ba)

Dung Linux   241s   ubuntu    <- NGOAI. Xong luc 19:54:49, cho 3m17s
Dung Windows 323s   windows   <- NGOAI. Xong luc 19:56:11, cho 1m55s</div>

<div class="callout warn">
<p><strong>Giảm một nửa bản dựng Linux sẽ đổi thời lượng lần chạy đúng KHÔNG giây.</strong> Nó vốn đã xong sớm ba phút mười bảy giây; làm nó xong sớm bốn phút thì chẳng dời được gì. Cái job ấy là 241 máy-giây của một mục tiêu tối ưu hoàn toàn hợp lý mà trả về CON SỐ KHÔNG trên thời gian đồng hồ — và nó đúng là loại job người ta hay đi tối ưu, bởi nó là cái mà họ đang đọc log.</p>
</div>

<h3>Ba đòn bẩy thật, xếp theo thứ chúng trả về</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — làm bản dựng macOS nhanh hơn · tối đa 437 s</span><span class="lz-lnote">mục đơn lẻ lớn nhất trên đường. Chương 2 đã đo vì sao nó chậm: 2,1 lần Linux ở bước dựng và 3,4 lần ở lượt tải artifact. Mọi khoản giảm thật ở đây trừ thẳng vào lần chạy</span></div>
<div class="lz-layer"><span class="lz-lname">2 — gỡ job kiểm ra khỏi đường · tối đa 72 s</span><span class="lz-lnote">nó chạy đầu tiên và mọi thứ <code>needs:</code> nó. Nếu phép kiểm ấy KHÔNG chốt cửa bản dựng — mà một lượt lint thì thường là không — thì cho nó chạy <em>SONG SONG</em> thay vì chạy trước sẽ gỡ 72 giây khỏi chuỗi và không tốn gì</span></div>
<div class="lz-layer"><span class="lz-lname">3 — cho bước công bố khởi động sớm hơn · tối đa 34 s</span><span class="lz-lnote">nhỏ nhất, và về cấu trúc thì khó nhất: nó thật sự cần cả ba bản cài. Không đáng đánh</span></div>
<div class="lz-layer"><span class="lz-lname">thứ trả về CON SỐ KHÔNG</span><span class="lz-lnote">Linux (241 s) và Windows (323 s), cộng mọi phép tối ưu cache và phụ thuộc bên trong chúng. Chương 5 đo một cái cache hoàn hảo đáng 35 giây trên job Linux; trên đường tới hạn thì đó là 35 giây của con số không</span></div>
</div>

<div class="callout ok">
<p><strong>Đòn bẩy 2 mới là cái đáng chú ý, bởi nó MIỄN PHÍ.</strong> Job kiểm là 72 giây lint và kiểm kiểu mà mọi thứ phải chờ. Nếu một cú hỏng lint ĐÁNG chặn cuộc phát hành thì giữ nó làm cổng là đúng. Nếu nó chỉ cần NHÌN THẤY ĐƯỢC, thì dời nó ra khỏi chuỗi sẽ rút ngắn mọi cuộc phát hành đi 72 giây — 13% lần chạy — mà không tiết kiệm máy-giây nào và không đổi một dòng mã. TÁI CẤU TRÚC thắng TỐI ƯU, và nó thường rẻ hơn.</p>
</div>

<h3>Tự tính cho workflow của bạn</h3>
${slide('ga-07', 8, 'Bốn hình dạng đồ thị, bốn công thức cho cái sàn')}
<p>API cho biết lúc bắt đầu và lúc kết thúc của mọi job. Đường tới hạn là chuỗi dài nhất xuyên qua đồ thị <code>needs:</code>, và với những hình dạng gặp trong thực tế thì bạn đọc thẳng ra được:</p>

<div class="kv-grid">
<div class="kv"><span class="k">không có <code>needs:</code> ở đâu cả</span><span class="v">đường tới hạn là job đơn CHẬM NHẤT. Đây là <code>ci-lint.yml</code>: hai job độc lập, độ dài lần chạy = cái dài hơn</span></div>
<div class="kv"><span class="k">một chuỗi thẳng</span><span class="v">TỔNG mọi job trong chuỗi. Mỗi cạnh <code>needs:</code> cộng trọn thời lượng của job nó vào cái sàn</span></div>
<div class="kv"><span class="k">toả ra rồi gộp lại</span><span class="v">khuôn mẫu ở đây: trước + <strong>max</strong>(các nhánh song song) + sau. Chỉ nhánh chậm nhất được tính, và đó là lý do <code>fail-fast</code> cùng độ cân bằng giữa các nhánh có ý nghĩa</span></div>
<div class="kv"><span class="k">phép kiểm tỉnh táo</span><span class="v">đường tới hạn phải GẦN với thời gian đồng hồ. Nếu thời gian đồng hồ lớn hơn nhiều, thì các job đang chờ RUNNER chứ không chờ nhau — một bài toán khác với một cách vá khác</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — thêm một <code>needs:</code> vì thứ tự nghe có vẻ hợp lý.</strong> Một cạnh <code>needs:</code> là một LỜI HỨA rằng job B tiêu thụ đầu ra của job A. Thêm một cạnh cho ngăn nắp — "kiểm định dạng trước rồi mới dựng" — là biến hai job song song thành một chuỗi và cộng trọn thời lượng của job đầu vào MỌI lần chạy, vĩnh viễn, mà chẳng thu thêm thông tin nào. Phép thử thì cụ thể: nếu job B vẫn cho ra một kết quả ĐÚNG khi job A hỏng, thì cạnh ấy không phải một phụ thuộc DỮ LIỆU và nó đang tốn của bạn trọn cái A.</p>
</div>

<h3>Ba từ, định nghĩa một lần cho rõ</h3>
<p>Chương này dựa vào mấy thuật ngữ rất dễ lẫn vào nhau, nên đặt chúng cạnh nhau trước khi tính bất cứ thứ gì:</p>
<table>
<thead><tr><th>Thuật ngữ</th><th>Đo cái gì</th><th>Ai quan tâm</th><th>Ở run 32662461744</th></tr></thead>
<tbody>
<tr><td><strong>máy-giây</strong> (machine-seconds)</td><td>tổng thời lượng MỌI job, như thể chúng chạy lần lượt từng cái</td><td>người trả tiền — GitHub tính tiền theo từng job, làm tròn lên phút</td><td>1.107 s</td></tr>
<tr><td><strong>thời gian đồng hồ</strong> (wall-clock)</td><td>từ lúc job đầu tiên được tạo tới lúc job cuối cùng xong</td><td>người ngồi chờ dấu tích xanh</td><td>553 s (555 s theo mốc giờ của chính lần chạy)</td></tr>
<tr><td><strong>đường tới hạn</strong> (critical path)</td><td>chuỗi job nối bằng <code>needs:</code> DÀI NHẤT</td><td>ai muốn thời gian đồng hồ giảm</td><td>72 + 437 + 34 = 543 s</td></tr>
<tr><td><strong>độ chùng</strong> (slack)</td><td>một job còn được phép dài thêm bao nhiêu trước khi nó rơi vào đường tới hạn</td><td>ai đang định tối ưu nó</td><td>Linux 199 s, Windows 117 s</td></tr>
</tbody>
</table>
<p>Máy-giây chỉ giảm được bằng cách làm ÍT việc hơn. Thời gian đồng hồ giảm được theo hai cách: làm ít việc hơn <em>trên đường tới hạn</em>, hoặc đổi HÌNH DẠNG đồ thị để chính đường tới hạn ngắn lại. Đó là hai hoạt động khác nhau, và bài này là để phân biệt chúng.</p>

<h3>Chạy thử từng bước: đọc đường tới hạn từ API</h3>
${slide('ga-07', 5, 'Một script đọc đường tới hạn từ API — không cần mở giao diện')}
<p>Trang lần chạy vẽ ra đồ thị, nhưng nó không nói cho bạn chuỗi nào dài nhất. Bạn tính được điều đó từ hai lời gọi API. Kho sân tập có một script nhỏ làm đúng việc ấy, <a href="https://github.com/cuonghoang1103/ga-san-tap/blob/ch07-toc-do/ch07/duong-toi-han.mjs" target="_blank" rel="noopener"><code>ch07/duong-toi-han.mjs</code></a>, và chĩa vào lần chạy phát hành của kho này thì nó cho lại đúng các con số của chương, lệch không quá hai giây:</p>
<pre><code class="language-bash">node ch07/duong-toi-han.mjs 32662461744 cuonghoang1103/api-backend</code></pre>
<div class="out">job                         cho may  chay   xong luc
Kiểm tra mã                     3s    72s   19:50:44   &lt;- TREN duong toi han
Dựng Linux                      3s   241s   19:54:49   ngoai: cho 199s
Dựng macOS                      3s   437s   19:58:05   &lt;- TREN duong toi han
Dựng Windows                    3s   323s   19:56:11   ngoai: cho 117s
Công bố bản phát hành           2s    34s   19:58:42   &lt;- TREN duong toi han

tong MAY-GIAY      1107 s
DONG HO (job dau tao -&gt; job cuoi xong)  553 s
duong TOI HAN      72 + 437 + 34 = 543 s
phan con lai = cho runner + ban giao giua job: 10 s</div>
<p>Cách tính này KHÔNG cần đọc YAML của bạn, và đó là điều khiến nó dùng lại được ở mọi kho. Nó dựa vào đúng một sự thật về cách GitHub xếp lịch job: một job có <code>needs:</code> chỉ được <em>TẠO RA</em> khi mọi thứ nó cần đã xong. Nên script đi NGƯỢC:</p>
<ol>
<li>Lấy job xong CUỐI CÙNG. Theo định nghĩa, nó là điểm cuối của đường tới hạn — chẳng có gì xong sau nó.</li>
<li>Nhìn xem job ấy được <em>tạo</em> lúc nào (<code>created_at</code>). Job nó đang chờ là job xong GẦN NHẤT trước thời điểm đó.</li>
<li>Lặp lại từ job vừa tìm được, cho tới khi gặp một job không bị ai chặn.</li>
<li>Cộng thời lượng (<code>completed_at − started_at</code>) của cả chuỗi. So tổng ấy với thời gian đồng hồ; phần chênh là thời gian chờ máy cộng phần bàn giao giữa các job.</li>
</ol>
<p>Nếu chỉ cần số thô thì một lệnh <code>gh</code> là đủ:</p>
<pre><code class="language-bash">gh api repos/OWNER/REPO/actions/runs/RUN_ID/jobs \\
  --jq '.jobs[] | [.name, .created_at, .started_at, .completed_at] | @tsv'</code></pre>
<p>Các workflow trên sân tập gọi chính script này ở bước cuối, với <code>GH_TOKEN: &#36;{{ github.token }}</code> và <code>permissions: actions: read</code>, nên mỗi lần chạy tự ghi đường tới hạn của mình vào trang Summary. Câu hỏi "job nào nằm trên đường?" từ một cuộc điều tra biến thành thứ bạn liếc một cái là thấy.</p>

<div class="callout warn">
<p><strong>Hai giới hạn của phép đi ngược.</strong> Nó giả định rằng một job được tạo ngay sau khi job khác xong là đang CHỜ job ấy — đúng với <code>needs:</code>, nhưng một job chỉ đơn giản đang xếp hàng chờ máy đúng lúc đó sẽ làm nó nhầm. Và nó bỏ qua các job bị skip, vốn không có thời lượng. Với các hình dạng khoá này dùng thì nó chính xác; với một đồ thị năm mươi job, hãy đọc thêm danh sách <code>needs:</code>.</p>
</div>

<h3>Đo trên sân tập: dời MỘT cạnh <code>needs:</code></h3>
${slide('ga-07', 6, 'Sân tập: dời MỘT cạnh needs: — trung vị 124 s → 95 s')}
<p>Các con số của api-backend tới từ một lần chạy trong quá khứ. Để thấy đòn bẩy này làm việc, sân tập có hai workflow với đúng bộ job của bản phát hành: một job kiểm (kiểm kiểu + một bộ test tốn CPU thật), bản dựng trên <code>ubuntu-24.04</code>, <code>windows-2025</code> và <code>macos-15</code>, và một job công bố. Chúng khác nhau đúng một dòng.</p>
${slide('ga-07', 7, 'Hai workflow khác nhau đúng một dòng')}
<p>Hai workflow được khởi động CÙNG LÚC năm lần, nên mỗi cặp chạy trong cùng điều kiện mạng và máy. Thời gian đồng hồ, tính bằng giây:</p>
<table>
<thead><tr><th>Cặp</th><th>kiểm CHẶN bản dựng</th><th>kiểm chạy SONG SONG</th></tr></thead>
<tbody>
<tr><td>1</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009578496" target="_blank" rel="noopener">113</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009578213" target="_blank" rel="noopener">96</a></td></tr>
<tr><td>2</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010873956" target="_blank" rel="noopener">124</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010879542" target="_blank" rel="noopener">99</a></td></tr>
<tr><td>3</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011282047" target="_blank" rel="noopener">117</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011288239" target="_blank" rel="noopener">95</a></td></tr>
<tr><td>4</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011550990" target="_blank" rel="noopener">229</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011556092" target="_blank" rel="noopener">79</a></td></tr>
<tr><td>5</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012034033" target="_blank" rel="noopener">128</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012040208" target="_blank" rel="noopener">76</a></td></tr>
<tr><td><strong>trung vị</strong></td><td><strong>124 s</strong></td><td><strong>95 s (−23%)</strong></td></tr>
</tbody>
</table>
<p>Có ba điều đáng đọc ra từ cái bảng ấy, chứ không chỉ con số tiêu đề:</p>
<ul>
<li><strong>Khoản tiết kiệm xấp xỉ độ dài job kiểm.</strong> Job kiểm mất 34–44 s; hai trung vị chênh 29 s. Phần còn lại là tiếng ồn và vài giây bàn giao mà bản xâu chuỗi phải trả hai lần.</li>
<li><strong>Máy-giây gần như không nhúc nhích</strong> — trung vị 175 so với 195, nằm gọn trong tiếng ồn. Gỡ một cạnh KHÔNG bớt việc; nó chỉ cho cùng khối việc ấy CHỒNG LÊN NHAU. Đó là lý do nó là phép tăng tốc rẻ nhất chương này.</li>
<li><strong>Cặp 4 cho thấy vì sao một lần chạy chẳng chứng minh được gì.</strong> Bản dựng Windows mất 167 s thay vì 57–83 s như thường, và bản xâu chuỗi mất 229 s. Nếu đó là phép đo "trước" duy nhất, thay đổi này đã trông như cải thiện 60%.</li>
</ul>

<div class="callout">
<p><strong>Đường tới hạn là tính chất của KHỐI VIỆC, không phải của nền tảng.</strong> Ở api-backend, bản dựng macOS là cây cột dài nhất. Ở sân tập, với một dự án TypeScript nhỏ, Windows nằm trên đường tới hạn ở cả mười lần chạy, còn macOS xong trong 26–45 s — có lần còn nhanh hơn Linux. Đừng mang câu "macOS lúc nào cũng chậm" từ dự án này sang dự án khác; hãy đọc nó ra từ lần chạy của CHÍNH dự án đó.</p>
</div>

<h3>Khi nào giữ một cạnh <code>needs:</code> — khi nào gỡ</h3>
<table>
<thead><tr><th>Tình huống</th><th>Giữ cạnh?</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>B tải về artifact mà A tải lên</td><td>Giữ</td><td>phụ thuộc DỮ LIỆU thật — B không khởi động được nếu thiếu đầu ra của A</td></tr>
<tr><td>B deploy, A chạy test</td><td>Giữ</td><td>phụ thuộc AN TOÀN: bạn không muốn deploy một commit chưa được kiểm. Ở đây cái cạnh chính là toàn bộ ý nghĩa</td></tr>
<tr><td>B dựng, A lint</td><td>Thường là gỡ</td><td>bản dựng không đọc gì từ lint. Dời cổng tới chỗ nó có ý nghĩa — job công bố hay deploy có thể <code>needs: [lint, build]</code></td></tr>
<tr><td>B đắt (phút macOS), A rẻ và hay hỏng</td><td>Cân nhắc giữ</td><td>một cổng hỏng nhanh tiết kiệm phút đắt tiền cho các commit hỏng. Đây là đánh đổi CHI PHÍ, không phải đúng/sai — quyết bằng số</td></tr>
<tr><td>A tồn tại "để log đọc theo thứ tự"</td><td>Gỡ</td><td>thứ tự trên giao diện không đáng một job ở mọi lần chạy</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>Độ chùng là một NGÂN SÁCH, và bạn tiêu được nó.</strong> Bản dựng Linux trong lần chạy phát hành có 199 s độ chùng. Nghĩa là bạn có thể nhét thêm khoảng ba phút kiểm tra vào đó — thêm một bộ test, một báo cáo kích thước gói — mà bản phát hành không chậm đi một giây nào. Độ chùng cũng chỉ ra chỗ mà một runner nhỏ hơn, rẻ hơn không tốn gì về thời gian đồng hồ. Trước khi tối ưu một job đang có độ chùng, hãy hỏi xem có nên <em>TIÊU</em> cái độ chùng ấy thay vào đó không.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Pipeline của chúng tôi mất 12 phút. Bạn bắt đầu từ đâu?</strong><br>Đ: Đọc thời gian từng job của vài lần chạy gần đây và tìm đường tới hạn — chuỗi <code>needs:</code> dài nhất. Chỉ job trên chuỗi đó mới ảnh hưởng thời gian đồng hồ. Rồi tìm những cạnh không phải phụ thuộc dữ liệu hay an toàn, vì gỡ chúng là miễn phí. Chỉ sau đó tôi mới tăng tốc từng bước, bắt đầu từ job chậm nhất TRÊN đường.</p>
<p><strong>H: Chúng tôi làm bản dựng Linux nhanh gấp đôi mà CI không nhanh lên. Vì sao?</strong><br>Đ: Bản dựng Linux không nằm trên đường tới hạn; nó có độ chùng. Thời gian đồng hồ do chuỗi dài nhất quyết định, nên rút ngắn một job vốn đang ngồi chờ thì chẳng đổi gì.</p>
<p><strong>H: Thời gian máy khác thời gian đồng hồ thế nào?</strong><br>Đ: Thời gian máy là tổng thời lượng mọi job và là thứ bạn trả tiền; thời gian đồng hồ là người ta phải chờ bao lâu. Song song hoá làm giảm thời gian đồng hồ và có thể làm TĂNG thời gian máy.</p>
</div>

<h3>Nó đổi gì trong cách đọc một workflow chậm</h3>
<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">câu hỏi đầu SAI</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"bước nào chậm nhất?"</span><span class="lz-nsub">trả lời được, và thường xuyên trả lời về một job xong sớm rồi ngồi chờ</span></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">câu hỏi đầu ĐÚNG</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"job nào nằm trên chuỗi dài nhất?"</span><span class="lz-nsub">ba trên năm, ở đây. Mọi thứ còn lại được PHÉP chậm, và tối ưu chúng thì vô tác dụng</span></div></div>
</div>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một lần chạy có một cái SÀN do chuỗi job phụ thuộc dài nhất của nó đặt ra, nên trước khi tối ưu bất cứ thứ gì, hãy liệt kê xem job nào nằm trên chuỗi ấy — và hãy chuẩn bị tinh thần rằng đáp án sẽ loại đúng cái job bạn vừa định bắt tay vào.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn trong nhóm bảo "CI chậm, cache thêm đi". Trước khi ai đụng vào cache, hãy tìm xem job nào THẬT SỰ quyết định độ dài lần chạy.</p><ol>
<li>Chọn một workflow trong kho của chính bạn có ít nhất hai job (nếu chưa có, chép <code>ch07-do-thi-chuoi.yml</code> từ nhánh <code>ch07-toc-do</code> của sân tập vào một kho thử rồi push).</li>
<li>Chép <code>ch07/duong-toi-han.mjs</code> vào cạnh nó. Chạy <code>gh run list --workflow &lt;tệp&gt; --limit 3</code> rồi <code>node duong-toi-han.mjs &lt;run_id&gt; &lt;owner/repo&gt;</code> cho từng lần trong ba lần chạy.</li>
<li>Ghi lại cho mỗi lần: máy-giây, thời gian đồng hồ, các job trên đường tới hạn, và độ chùng của mọi job không nằm trên đó.</li>
<li>Tìm một cạnh <code>needs:</code> không phải phụ thuộc dữ liệu hay an toàn. Tạo một bản sao workflow không có cạnh ấy (dời cổng xuống job cuối), rồi khởi động cả hai bằng <code>gh workflow run</code> CÙNG LÚC, ba lần.</li>
<li>So hai trung vị.</li></ol>
<p><strong>Đạt khi:</strong> bạn có bảng ba lần chạy kèm đường tới hạn, cùng những job ấy nằm trên đường ở ít nhất hai lần (hoặc bạn giải thích được vì sao không), và bạn có trung vị trước/sau từ các lần chạy THEO CẶP — không phải mỗi bên một lần.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Critical path (đường tới hạn)</span><span class="v">Chuỗi job nối bằng <code>needs:</code> dài nhất. Lần chạy không thể xong nhanh hơn chuỗi này.</span></div>
  <div class="kv"><span class="k">Slack (độ chùng)</span><span class="v">Một job còn được phép chậm thêm bao nhiêu trước khi nó thành một phần của đường tới hạn. Tăng tốc job có độ chùng không tiết kiệm giây đồng hồ nào.</span></div>
  <div class="kv"><span class="k">Machine-seconds (máy-giây)</span><span class="v">Tổng thời lượng mọi job — góc nhìn hoá đơn của một lần chạy.</span></div>
  <div class="kv"><span class="k">Wall-clock (thời gian đồng hồ)</span><span class="v">Từ lúc job đầu được tạo tới lúc job cuối xong — góc nhìn của người ngồi chờ.</span></div>
  <div class="kv"><span class="k">Data dependency (phụ thuộc dữ liệu)</span><span class="v">Job B cần thứ job A sinh ra (artifact, output). Lý do thật cho <code>needs:</code>.</span></div>
  <div class="kv"><span class="k">Fan-out / fan-in (toả ra / gộp lại)</span><span class="v">Một job mở ra nhiều job song song, và một job sau chờ tất cả. Sàn = trước + max(các nhánh) + sau.</span></div>
  <div class="kv"><span class="k">Hand-off (bàn giao)</span><span class="v">Vài giây giữa lúc một job xong và lúc job kế tiếp nhận được máy. Trả một lần cho mỗi cạnh trên chuỗi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một lần chạy có ba con số: máy-giây (tiền), thời gian đồng hồ (chờ) và đường tới hạn (cái sàn của thời gian đồng hồ).</li>
<li>Chỉ job trên đường tới hạn mới ảnh hưởng thời gian đồng hồ; bản dựng Linux của api-backend có 199 s độ chùng, nên giảm một nửa nó chẳng tiết kiệm gì.</li>
<li>Tính được đường tới hạn từ API jobs bằng cách đi ngược từ job cuối về job mà nó được tạo ra sau đó.</li>
<li>Gỡ một cạnh <code>needs:</code> không phải phụ thuộc dữ liệu hay an toàn là miễn phí: trên sân tập nó đưa trung vị từ 124 s xuống 95 s với cùng số máy-giây.</li>
<li>Job nào nằm trên đường phụ thuộc vào khối việc — Windows ở sân tập, macOS ở api-backend. Đo từng dự án.</li>
<li>Độ chùng là ngân sách: thêm việc vào job có độ chùng không tốn giây đồng hồ nào.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — list jobs for a workflow run</span><span class="lc-sub">docs.github.com/en/rest/actions/workflow-jobs — <code>started_at</code>, <code>completed_at</code> theo từng job và nhịp thời gian theo từng bước, tức là chỗ mọi con số của chương này tới từ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using jobs in a workflow</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow — ngữ nghĩa <code>needs:</code> định nghĩa cái đồ thị mà đường tới hạn chạy xuyên qua.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Phương pháp đường găng (critical path method)</span><span class="lc-sub">en.wikipedia.org/wiki/Critical_path_method — kỹ thuật tổng quát, gồm cả khái niệm ĐỘ CHÙNG: 3m17s mà Linux ngồi chờ chính là độ chùng của tác vụ ấy, và độ chùng là lượng mà một tác vụ được phép trễ MIỄN PHÍ.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — cái bước deploy chưa bao giờ là chỗ chậm</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cùng phép phân tích ấy trên một đường ống deploy, nơi cái bước ai cũng đổ lỗi hoá ra đang có độ chùng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — concurrency, and two opposite settings that are both right|||7.2 — concurrency, và hai thiết lập ngược nhau đều đúng',
      slug: 'ga-7-2-concurrency',
      type: 'VIDEO',
      description: 'Hai workflow trong kho này đặt `cancel-in-progress` ngược nhau, và cả hai đều đúng — lý do là một trong hai có tác dụng phụ KHÔNG được bỏ dở. Cộng một sự cố thật: `concurrency:` chỉ XẾP HÀNG, và v0.5.40 đã bị dựng hai lượt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2><code>concurrency</code>, and two opposite settings that are both right</h2>
<p class="lead">Two of this repository&#39;s eleven workflows declare a concurrency group. They set the same key to opposite values, and reading why is the fastest way to understand what the key is actually for.</p>

<h3>The two declarations</h3>
${slide('ga-07', 9, 'Ba cú push, ba cách xử lý: huỷ · xếp · xếp hàng dài')}
<pre><code><span class="tok-comment"># deploy-ghcr.yml</span>
concurrency:
  group: deploy-ghcr
  cancel-in-progress: true

<span class="tok-comment"># desktop-release.yml</span>
concurrency:
  group: desktop-release
  cancel-in-progress: false</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">deploy · cancel</span><span class="lz-t">true</span><span class="lz-d">a deploy that has been superseded should die. Only the newest commit matters, and the in-flight one is about to be overwritten anyway</span></div>
<div class="lz-step"><span class="lz-k">release · cancel</span><span class="lz-t">false</span><span class="lz-d">a release that is halfway through uploading assets must not be killed. Killing it leaves a partial release, which is worse than a queued one</span></div>
<div class="lz-step"><span class="lz-k">the rule underneath</span><span class="lz-t">does it have side effects that must complete?</span><span class="lz-d">that single question decides the value, and it decides it the same way every time</span></div>
</div>

<div class="callout ok">
<p><strong>The same key, opposite values, both correct.</strong> That is unusual enough to be worth noticing: most configuration has a right answer and a wrong one. <code>cancel-in-progress</code> has a right answer <em>per workflow</em>, and getting it from a template rather than from the question above is how a release gets killed mid-publish.</p>
</div>

<h3>The comment in the deploy file states the goal precisely</h3>
<div class="out">"Allow only one concurrent deploy; cancel older in-flight runs so
 a fast follow-up commit doesn't queue behind a slow build."</div>

<p>That is the whole case for <code>true</code>: without it, pushing three commits in ten minutes queues three deploys, each waiting for the last, and the third — the only one anybody wants — starts twenty minutes late. With it, the first two die as soon as they are superseded.</p>

<h3>Where the group name matters</h3>
${slide('ga-07', 12, 'Chọn group và cancel-in-progress theo việc, không theo khuôn')}
<div class="kv-grid">
<div class="kv"><span class="k">a constant, as here</span><span class="v"><code>group: deploy-ghcr</code> — one run at a time across the whole repository. Correct when the workflow touches something singular: a production server, a registry tag, a release</span></div>
<div class="kv"><span class="k">per branch</span><span class="v"><code>group: ci-&#36;{{ github.ref }}</code> — the standard for PR checks. Pushing twice to one PR cancels the first run; two different PRs do not interfere</span></div>
<div class="kv"><span class="k">per workflow and branch</span><span class="v"><code>group: &#36;{{ github.workflow }}-&#36;{{ github.ref }}</code> — the safest general form, because two different workflows on the same branch stay independent</span></div>
<div class="kv"><span class="k">the mistake</span><span class="v">a group that is too broad. <code>group: ci</code> on a repository with active branches means every PR cancels every other PR&#39;s checks, which reads as "CI keeps randomly cancelling"</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — <code>cancel-in-progress: true</code> on anything that deploys or publishes.</strong> A cancelled job stops between two steps, wherever it happened to be. For a lint run that is fine. For a deploy it can mean containers recreated but migrations not applied; for a release, three of five assets uploaded. This repository gets it right by splitting the two cases, and the reasoning is written down in the file — which is the part worth copying, because the next person to add a workflow will otherwise copy whichever block they saw first.</p>
</div>

<h3>The thing <code>concurrency</code> does not do</h3>
${slide('ga-07', 14, 'concurrency xếp hàng — nó không làm việc thành bất biến')}
<p>It queues. It does not prevent two runs from producing conflicting output — it only ensures they do not overlap in time. This repository has a dated incident that shows the difference, recorded in its own operations notes:</p>

<div class="out">v0.5.40 bi dung HAI luot (19-20/08/2026)
  luot A: cong bo luc 18:08:17
  luot B: xong luc 18:15:37, va TAI DE len dung release do

&#96;concurrency:&#96; DA co mat. No xep hang hai luot, dung nhu duoc yeu cau.
Luot B cho luot A xong roi moi chay — roi ghi de.</div>

<div class="callout warn">
<p><strong>Serialised and still wrong.</strong> The second run did exactly what it was told: it waited, then it ran, then it published version 0.5.40 — over the 0.5.40 that already existed. That time it was harmless because both runs were the same commit. A different commit would have produced an installer carrying another version&#39;s number, and the failure mode is silent: the release page looks complete.</p>
</div>

<div class="callout ok">
<p><strong>The fix was not a concurrency setting.</strong> The repository added a release script that refuses to start when a build is already running, and a workflow step that refuses to build over an already-published version. Ordering is a scheduling property; "this version already exists" is a <em>state</em> question, and only a check against that state answers it. <code>concurrency</code> is the wrong tool for idempotency and always was.</p>
</div>

<h3>What <code>concurrency</code> actually does, in four sentences</h3>
<p>Before the experiment, the rule set, stated from the GitHub documentation (read 24 September 2026):</p>
<ol>
<li>A <strong>group</strong> is just a string. Every run (or job) whose <code>concurrency.group</code> evaluates to the same string is in the same group — across branches and across <em>different workflow files</em> if the strings match.</li>
<li>At most <strong>one</strong> run in a group is <em>running</em> at a time.</li>
<li>By default at most <strong>one</strong> run in a group is <em>pending</em>. When a new run arrives and one is already pending, the pending one is cancelled and the new one takes its place.</li>
<li><code>cancel-in-progress: true</code> additionally cancels the <em>running</em> one when a new run arrives. The newer option <code>queue: max</code> instead lets up to 100 runs wait in order; it cannot be combined with <code>cancel-in-progress: true</code>.</li>
</ol>
<p>Rule 3 is the one people do not expect: <code>cancel-in-progress: false</code> does <em>not</em> mean "every commit gets deployed eventually". It means "the running one finishes, and the <em>latest</em> waiting one runs after it". Anything in between is dropped.</p>

<h3>Measured: three pushes, three settings</h3>
<p>The sandbox has three workflows that are identical except for their concurrency block. Each runs one job that simulates a deploy: step 2 "pushes an image" for 40 seconds, step 3 "runs migrations" for 40 seconds, then a cleanup step with <code>if: always()</code> and one with <code>if: cancelled()</code>. All three trigger on the same file, and three commits were pushed 23 seconds apart (14:02:43, 14:03:06, 14:03:29 UTC). The picture at the top of this lesson is drawn from these runs; here are the raw outcomes:</p>
<table>
<thead><tr><th>Setting</th><th>Commit 1</th><th>Commit 2</th><th>Commit 3</th><th>Last commit finished</th></tr></thead>
<tbody>
<tr><td><code>cancel-in-progress: true</code></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009923442" target="_blank" rel="noopener">cancelled mid-step</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009970441" target="_blank" rel="noopener">cancelled mid-step</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010016477" target="_blank" rel="noopener">✓</a></td><td>+154 s</td></tr>
<tr><td><code>cancel-in-progress: false</code></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009923032" target="_blank" rel="noopener">✓</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009970458" target="_blank" rel="noopener">cancelled while pending — no job ever ran</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010016461" target="_blank" rel="noopener">✓</a></td><td>+183 s</td></tr>
<tr><td><code>queue: max</code></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009923057" target="_blank" rel="noopener">✓</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009970451" target="_blank" rel="noopener">✓</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010016184" target="_blank" rel="noopener">✓</a></td><td>+274 s</td></tr>
</tbody>
</table>
<p>Each row is right for some workflow and wrong for another. <code>true</code> delivers the newest commit fastest and wastes the least machine time — but two runs were cut off halfway through "pushing an image". <code>false</code> never cuts anything off, but commit 2 was silently skipped: its run shows as cancelled with zero jobs. <code>queue: max</code> deploys every commit in order, and the last one lands two minutes later than with <code>true</code>.</p>

<h3>What a cancelled run looks like from the inside</h3>
${slide('ga-07', 10, 'Huỷ là dừng GIỮA bước — và bước dọn dẹp vẫn chạy')}
<div class="out">2 · day anh (gia lap 40 giay)
day anh ... 20 s  (14:03:14)
##[error]The operation was canceled.
3 · chay migration                 -&gt; skipped
4 · don dep (if always)            job.status=cancelled
5 · chi chay khi BI HUY (if cancelled)
run nay bi huy giua chung luc 14:03:19</div>
<p>Four things to notice in that log (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009923442" target="_blank" rel="noopener">36009923442</a>):</p>
<ul>
<li>The step was killed <strong>in the middle</strong>. Twenty seconds of a forty-second "upload" had happened. In a real deploy that is a half-pushed image or, worse, a pushed image with its migration never run — the exact shape of this repository&#39;s 3 July 2026 incident, where the feed returned 500 because the code was newer than the schema.</li>
<li>Step 3 was <strong>skipped</strong>, not failed. A dashboard that only counts failures will not see it.</li>
<li>Steps with <code>if: always()</code> and <code>if: cancelled()</code> <strong>still ran</strong>, and <code>job.status</code> was <code>cancelled</code>. That is where cleanup belongs: removing a half-written file, releasing a lock, posting "deploy aborted".</li>
<li>The reason is not in the log at all. It is in the run&#39;s annotations: <code>Canceling since a higher priority waiting request for ch07 · cc huy (…)-refs/heads/ch07-toc-do exists</code>. Get it with <code>gh api repos/OWNER/REPO/check-runs/CHECK_RUN_ID/annotations</code>, or on the run page under the job summary.</li>
</ul>

<h3>Cancellation is not instant — it has a ladder</h3>
${slide('ga-07', 11, 'Huỷ không tức thời: tiến trình có 10 giây để dọn')}
<p>The documentation describes what the runner does when a job is cancelled: it re-evaluates <code>if:</code> conditions (which is why <code>always()</code> steps run), sends <strong>SIGINT</strong> to the step&#39;s process, waits 7.5 seconds, sends <strong>SIGTERM</strong>, waits 2.5 seconds, and then kills the process tree. After five minutes the server force-terminates anything still running.</p>
<p>The sandbox shows exactly that ten-second budget being used. In both cancelled runs the new run was created and the old step ended ten seconds later (14:03:09 → 14:03:19, and 14:03:31 → 14:03:41). The step was a bash loop around <code>sleep</code>, which does not stop on the first signal, so it rode the ladder to the end. Two consequences:</p>
<ul>
<li>The new run did not start immediately. With <code>cancel-in-progress: true</code>, the newer run&#39;s job was only created at 14:03:23 — fourteen seconds after it was queued — because the old run had to finish dying first. The group still holds one running job at a time.</li>
<li>If your deploy script can do something sensible on SIGINT — finish the current file, write a marker, roll back — you have 7.5 seconds to do it. Use <code>trap</code> in shell scripts; a tool that ignores signals gets killed with nothing cleaned up.</li>
</ul>
<pre><code class="language-bash"># a deploy step that notices it is being cancelled
trap 'echo "cancelled — marking release as incomplete"; touch .deploy-aborted; exit 130' INT TERM
./push-image.sh
./run-migrations.sh</code></pre>

<h3><code>queue: max</code> — new, and ahead of the linter</h3>
${slide('ga-07', 15, 'queue: max mới có — và actionlint chưa biết tới nó')}
<p>For years the only choices were "cancel the running one" or "keep one waiting and drop the rest". <code>queue: max</code> adds a third: keep up to 100 waiting runs and process them in the order they started waiting. It is the right setting when every commit must be deployed in order — a migration chain, for example, where skipping commit 2 would skip a migration that commit 3 assumes.</p>
<p>It is new enough that <code>actionlint</code> (the linter from Chapter 4) rejected it on the day of the experiment: <code>unexpected key "queue" for "concurrency" section</code>. GitHub accepted and ran the same file — three runs, none cancelled. A linter is a model of the platform, and models lag. When the linter and a real run disagree, the real run wins, and the right response is to note it and pin the linter version rather than to delete the setting.</p>

<h3>Two workflows, one server — why the group is named after the resource</h3>
${slide('ga-07', 13, 'Hai workflow, hai group = KHÔNG có khoá — cơ chế sự cố 06/07')}
<p>This repository&#39;s own outages came from exactly this gap. Until 6 July 2026, <code>deploy-ghcr.yml</code> and <code>backend-vps.yml</code> both ran on pushes to <code>main</code> that touched <code>src/**</code>. The first had <code>group: deploy-ghcr</code>; the second had no concurrency block at all. So one push started two deploys to the same server, and neither knew about the other. On 6 July the two recreated the backend container at the same time, one killed the other&#39;s container (<code>Exited(137)</code>) and orphan containers were left behind. Chapter 9 dissects that incident; the mechanism is all you need here:</p>
<div class="callout warn">
<p><strong>A concurrency group protects only what shares its name.</strong> Two workflows with two different group names — or one with a group and one without — are not serialised against each other at all. If several workflows touch one server, they need <em>one</em> group name, chosen after the server (<code>group: prod-vps</code>), not after the file.</p>
</div>
<p>The sandbox repeats it safely: <code>ch07-chung-a.yml</code> and <code>ch07-chung-b.yml</code> both declare <code>group: ch07-vps-chung-&#36;{{ github.ref }}</code> and are triggered by the same push. Workflow B ran from 14:12:33 to 14:13:06 (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011098857" target="_blank" rel="noopener">36011098857</a>); workflow A&#39;s job was created at 14:13:07 (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011098744" target="_blank" rel="noopener">36011098744</a>), one second after B finished. Same push, two files, one queue.</p>
<p>The repository&#39;s actual fix was stronger than a shared group: both deploy workflows became <code>workflow_dispatch</code>-only, and deploys moved to a script run by hand. <code>backend-vps.yml</code> still has no concurrency block today — it is protected only by the fact that a human presses the button. That is a real control, but it is worth knowing it is the only one.</p>

<h3>Job-level concurrency: lock only the dangerous part</h3>
<p><code>concurrency:</code> can sit on a job instead of the whole workflow. Then builds and tests of many commits run freely in parallel, and only the deploy job queues:</p>
<pre><code class="language-yaml">jobs:
  build:
    runs-on: ubuntu-24.04
    steps: [ ... ]            # free to overlap with other runs
  deploy:
    needs: build
    runs-on: ubuntu-24.04
    concurrency:
      group: prod-vps         # named after the SERVER
      cancel-in-progress: false
    steps: [ ... ]</code></pre>
<p>This is usually the best shape for a deploy pipeline: you get the speed of parallel builds and the safety of one deploy at a time, and a newer commit waiting to deploy replaces an older one that has not started yet.</p>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: What does <code>cancel-in-progress</code> do, and when would you not use it?</strong><br>A: It cancels the running run in the same group when a newer one arrives. I use it for PR checks, where only the latest commit matters. I do not use it on anything with side effects that must complete — deploys, releases, migrations — because a cancelled job stops between two steps, and the second half of a deploy never happens.</p>
<p><strong>Q: Two workflows deploy to the same server. How do you stop them overlapping?</strong><br>A: Give both the same concurrency group, named after the server, ideally at the job level on the deploy job. Different group names do not serialise anything.</p>
<p><strong>Q: Does <code>concurrency</code> make a deploy idempotent?</strong><br>A: No. It orders runs in time; it does not stop the second run from overwriting the first. Idempotency needs a check against state — "is this version already published?" — inside the job.</p>
</div>

<h3>What the other nine workflows do</h3>
<div class="out">concurrency: khai o  2 / 11 workflow</div>

<div class="callout">
<p><strong>Update, September 2026.</strong> The repository now has 14 workflows and 3 of them declare a group: the two above plus <code>ship-lab211.yml</code> (<code>group: ship-lab211</code>, <code>cancel-in-progress: false</code>). The reasoning below about the rest still holds.</p>
</div>

<p>The other nine are single-job <code>workflow_dispatch</code> workflows. Their concurrency control is a human deciding to press the button, which is a real control with a real property: it is serialised by a person who knows whether the last one finished. That works until two people press it, or until one of them is a schedule — <code>vps-cleanup-weekly.yml</code> has both a cron and a dispatch trigger, so a manual run and a scheduled run can genuinely overlap.</p>

<div class="callout">
<p><strong>The one sentence.</strong> <code>concurrency</code> decides whether a superseded run dies or waits, the answer depends on whether the run has side effects that must complete, and it does not make anything idempotent — a run that waits its turn and then overwrites the result is exactly as wrong as one that raced.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your PR checks keep piling up when you push fixes in quick succession, and you want to know exactly what each concurrency setting would do before you change anything.</p><ol>
<li>In a test repository, create a workflow with <code>on: push</code> filtered to one file (e.g. <code>paths: ['kich/cc']</code>) and one job with two <code>sleep 40</code> steps, a step with <code>if: always()</code> that prints <code>&#36;{{ job.status }}</code>, and a step with <code>if: cancelled()</code>.</li>
<li>Add <code>concurrency: { group: &#36;{{ github.workflow }}-&#36;{{ github.ref }}, cancel-in-progress: true }</code>.</li>
<li>Push three commits that change the trigger file, about 20 seconds apart.</li>
<li>Run <code>gh run list --workflow &lt;file&gt; --limit 3</code>; open a cancelled run and find the "Canceling since a higher priority waiting request" annotation and the line where the step was cut.</li>
<li>Change to <code>cancel-in-progress: false</code> and repeat. Find the run that was cancelled while still pending.</li></ol>
<p><strong>Done when:</strong> you can show, with run IDs, one run cut mid-step whose cleanup step still ran, and one run that was cancelled with no job — and you can say in one sentence which of the two settings your PR checks should use and which your deploy should use.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Concurrency group</span><span class="v">A string; all runs or jobs that evaluate to the same string share one "one at a time" slot, even across workflow files.</span></div>
  <div class="kv"><span class="k"><code>cancel-in-progress</code></span><span class="v">Cancel the running member of the group when a new one arrives.</span></div>
  <div class="kv"><span class="k">Pending</span><span class="v">Queued in the group, waiting. By default only one pending run is kept; a newer one replaces it.</span></div>
  <div class="kv"><span class="k"><code>queue: max</code></span><span class="v">Keep up to 100 pending runs and process them in order. Not combinable with <code>cancel-in-progress: true</code>.</span></div>
  <div class="kv"><span class="k"><code>cancelled()</code> / <code>always()</code></span><span class="v">Status functions for <code>if:</code>; steps using them still run when the job is cancelled.</span></div>
  <div class="kv"><span class="k">SIGINT / SIGTERM</span><span class="v">The signals the runner sends to a cancelled step: interrupt first, terminate 7.5 s later, kill 2.5 s after that.</span></div>
  <div class="kv"><span class="k">Idempotent</span><span class="v">Running it twice has the same effect as once. Concurrency does not give you this; a state check does.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A concurrency group allows one running and, by default, one pending run; a newer arrival replaces the pending one.</li>
<li><code>cancel-in-progress: true</code> suits PR checks; it cuts a running job between steps, so it is dangerous for deploys and releases.</li>
<li>Measured on three pushes: <code>true</code> finished the last commit at +154 s, <code>false</code> at +183 s with commit 2 silently dropped, <code>queue: max</code> at +274 s with every commit run.</li>
<li>Cancellation takes up to ~10 s (SIGINT, SIGTERM, kill) and <code>if: always()</code> / <code>if: cancelled()</code> steps still run — put cleanup there.</li>
<li>Groups only protect what shares the name: two deploy workflows need one group named after the server — the gap behind the July 2026 outages.</li>
<li>Concurrency orders runs; it does not make them idempotent.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using concurrency</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-concurrency — group expressions, <code>cancel-in-progress</code>, and the rule that only one run can be pending per group (a third queued run replaces the second rather than joining a queue).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — jobs.&lt;id&gt;.concurrency</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idconcurrency — the job-level form, for when only the deploy job needs serialising and the build jobs can run freely.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Canceling a workflow</span><span class="lc-sub">docs.github.com/en/actions/managing-workflow-runs/canceling-a-workflow — what actually happens to a cancelled job, including the grace period and which steps still run, which is the detail behind the pitfall above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — two deploys racing, and the container that exited 137</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the outage this repository had when two deploy workflows overlapped, which is the incident that produced these concurrency blocks.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Redis — idempotency is a state check, not an ordering guarantee</span><span class="lc-sub">/courses/redis/learn${REF} — the distinction the v0.5.40 incident turns on, stated generally: serialising two writers does not make the second one correct.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2><code>concurrency</code>, và hai thiết lập ngược nhau đều đúng</h2>
<p class="lead">Hai trong mười một workflow của kho này khai một nhóm concurrency. Chúng đặt CÙNG một khoá với hai giá trị NGƯỢC NHAU, và đọc xem vì sao là cách nhanh nhất để hiểu cái khoá ấy thật ra dùng để làm gì.</p>

<h3>Hai lời khai</h3>
${slide('ga-07', 9, 'Ba cú push, ba cách xử lý: huỷ · xếp · xếp hàng dài')}
<pre><code><span class="tok-comment"># deploy-ghcr.yml</span>
concurrency:
  group: deploy-ghcr
  cancel-in-progress: true

<span class="tok-comment"># desktop-release.yml</span>
concurrency:
  group: desktop-release
  cancel-in-progress: false</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">deploy · huỷ</span><span class="lz-t">true</span><span class="lz-d">một cuộc deploy đã bị vượt mặt thì NÊN chết. Chỉ commit mới nhất có nghĩa, và cái đang bay dù sao cũng sắp bị ghi đè</span></div>
<div class="lz-step"><span class="lz-k">phát hành · huỷ</span><span class="lz-t">false</span><span class="lz-d">một cuộc phát hành đang tải tệp dở KHÔNG được giết. Giết nó để lại một bản phát hành DỞ DANG, thứ còn tệ hơn một cái đang xếp hàng</span></div>
<div class="lz-step"><span class="lz-k">quy tắc nằm dưới</span><span class="lz-t">nó có tác dụng phụ BẮT BUỘC phải hoàn tất không?</span><span class="lz-d">đúng một câu hỏi ấy quyết định giá trị, và nó quyết định theo cùng một cách ở mọi lần</span></div>
</div>

<div class="callout ok">
<p><strong>Cùng một khoá, hai giá trị ngược nhau, cả hai đều đúng.</strong> Chuyện đó đủ bất thường để đáng để ý: phần lớn cấu hình có một đáp án đúng và một đáp án sai. <code>cancel-in-progress</code> có một đáp án đúng <em>THEO TỪNG WORKFLOW</em>, và lấy nó từ một cái khuôn mẫu thay vì từ câu hỏi bên trên chính là cách một cuộc phát hành bị giết giữa lúc đang công bố.</p>
</div>

<h3>Bình luận trong tệp deploy phát biểu mục tiêu rất chính xác</h3>
<div class="out">"Allow only one concurrent deploy; cancel older in-flight runs so
 a fast follow-up commit doesn't queue behind a slow build."</div>

<p>Đó là toàn bộ lập luận cho <code>true</code>: không có nó, đẩy ba commit trong mười phút sẽ xếp hàng ba cuộc deploy, mỗi cái chờ cái trước, và cái thứ ba — cái duy nhất ai đó muốn — khởi động muộn hai mươi phút. Có nó thì hai cái đầu chết ngay khi bị vượt mặt.</p>

<h3>Chỗ mà TÊN NHÓM có ý nghĩa</h3>
${slide('ga-07', 12, 'Chọn group và cancel-in-progress theo việc, không theo khuôn')}
<div class="kv-grid">
<div class="kv"><span class="k">một hằng số, như ở đây</span><span class="v"><code>group: deploy-ghcr</code> — một lần chạy tại một thời điểm trên toàn kho. Đúng khi workflow chạm vào một thứ ĐƠN NHẤT: một máy chủ production, một nhãn registry, một bản phát hành</span></div>
<div class="kv"><span class="k">theo từng nhánh</span><span class="v"><code>group: ci-&#36;{{ github.ref }}</code> — tiêu chuẩn cho các phép kiểm PR. Đẩy hai lần lên một PR thì huỷ lần chạy đầu; hai PR khác nhau không đụng nhau</span></div>
<div class="kv"><span class="k">theo workflow VÀ nhánh</span><span class="v"><code>group: &#36;{{ github.workflow }}-&#36;{{ github.ref }}</code> — dạng tổng quát an toàn nhất, bởi hai workflow khác nhau trên cùng một nhánh vẫn độc lập</span></div>
<div class="kv"><span class="k">sai lầm</span><span class="v">một cái nhóm quá RỘNG. <code>group: ci</code> trên một kho có nhiều nhánh đang hoạt động nghĩa là mọi PR huỷ phép kiểm của mọi PR khác, và nó đọc lên thành "CI cứ tự dưng huỷ"</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>cancel-in-progress: true</code> trên bất cứ thứ gì có deploy hay công bố.</strong> Một job bị huỷ sẽ dừng GIỮA hai bước, ở đúng chỗ nó tình cờ đang đứng. Với một lượt lint thì ổn. Với một cuộc deploy thì nó có thể nghĩa là container đã dựng lại mà migration chưa chạy; với một cuộc phát hành thì là ba trên năm tệp đã tải lên. Kho này làm đúng nhờ TÁCH hai ca ra, và lý lẽ được ghi lại ngay trong tệp — đó mới là phần đáng chép, bởi người kế tiếp thêm một workflow nếu không sẽ chép đúng cái khối nào họ nhìn thấy trước.</p>
</div>

<h3>Thứ mà <code>concurrency</code> KHÔNG làm</h3>
${slide('ga-07', 14, 'concurrency xếp hàng — nó không làm việc thành bất biến')}
<p>Nó XẾP HÀNG. Nó KHÔNG ngăn hai lần chạy đẻ ra đầu ra xung đột — nó chỉ bảo đảm chúng không CHỒNG LÊN NHAU về thời gian. Kho này có một sự cố có ngày tháng cho thấy chỗ khác biệt, ghi trong chính sổ vận hành của nó:</p>

<div class="out">v0.5.40 bi dung HAI luot (19-20/08/2026)
  luot A: cong bo luc 18:08:17
  luot B: xong luc 18:15:37, va TAI DE len dung release do

&#96;concurrency:&#96; DA co mat. No xep hang hai luot, dung nhu duoc yeu cau.
Luot B cho luot A xong roi moi chay — roi ghi de.</div>

<div class="callout warn">
<p><strong>Đã tuần tự hoá mà VẪN SAI.</strong> Lượt chạy thứ hai làm đúng thứ nó được bảo: nó chờ, rồi nó chạy, rồi nó công bố phiên bản 0.5.40 — ĐÈ LÊN cái 0.5.40 đã có. Lần ấy vô hại vì hai lượt cùng một commit. Một commit khác thì đã đẻ ra một bản cài mang số hiệu của phiên bản khác, và kiểu hỏng ấy thì ÂM THẦM: trang phát hành nhìn vẫn đầy đủ.</p>
</div>

<div class="callout ok">
<p><strong>Cách vá KHÔNG phải một thiết lập concurrency.</strong> Kho này thêm một script phát hành từ chối khởi động khi đang có một lượt dựng chạy, và một bước trong workflow từ chối dựng đè lên một phiên bản đã công bố. THỨ TỰ là một tính chất của việc xếp lịch; "phiên bản này ĐÃ tồn tại" là một câu hỏi về TRẠNG THÁI, và chỉ một phép kiểm đối chiếu với trạng thái ấy mới trả lời được. <code>concurrency</code> là công cụ SAI cho tính bất biến-theo-số-lần-chạy, và xưa nay vẫn thế.</p>
</div>

<h3><code>concurrency</code> thật ra làm gì — trong bốn câu</h3>
<p>Trước khi vào thí nghiệm, đây là bộ luật, phát biểu theo tài liệu của GitHub (đọc ngày 24/09/2026):</p>
<ol>
<li>Một <strong>group</strong> (nhóm) chỉ là một CHUỖI. Mọi lần chạy (hay job) có <code>concurrency.group</code> ra cùng một chuỗi thì chung một nhóm — xuyên qua các nhánh, và xuyên qua cả <em>CÁC TỆP WORKFLOW KHÁC NHAU</em> nếu chuỗi trùng.</li>
<li>Mỗi nhóm có tối đa <strong>MỘT</strong> lần chạy đang <em>chạy</em>.</li>
<li>Mặc định, mỗi nhóm có tối đa <strong>MỘT</strong> lần chạy đang <em>chờ</em> (pending). Khi một lần chạy mới tới mà đã có một cái đang chờ, cái đang chờ bị huỷ và cái mới thế chỗ.</li>
<li><code>cancel-in-progress: true</code> huỷ THÊM cả cái đang <em>chạy</em> khi có cái mới tới. Tuỳ chọn mới hơn <code>queue: max</code> thì ngược lại: cho tới 100 lần chạy xếp hàng chờ theo thứ tự; nó không đi chung được với <code>cancel-in-progress: true</code>.</li>
</ol>
<p>Luật 3 là luật người ta không ngờ tới: <code>cancel-in-progress: false</code> KHÔNG có nghĩa "commit nào rồi cũng được deploy". Nó có nghĩa "cái đang chạy được chạy xong, và cái chờ <em>MỚI NHẤT</em> chạy sau nó". Mọi thứ ở giữa bị bỏ.</p>

<h3>Đo thật: ba cú push, ba thiết lập</h3>
<p>Sân tập có ba workflow giống hệt nhau trừ khối concurrency. Mỗi cái chạy một job giả lập deploy: bước 2 "đẩy ảnh" 40 giây, bước 3 "chạy migration" 40 giây, rồi một bước dọn dẹp <code>if: always()</code> và một bước <code>if: cancelled()</code>. Cả ba kích hoạt bởi cùng một tệp, và ba commit được đẩy lên cách nhau 23 giây (14:02:43, 14:03:06, 14:03:29 UTC). Hình ở đầu bài vẽ từ chính các lần chạy này; đây là kết quả thô:</p>
<table>
<thead><tr><th>Thiết lập</th><th>Commit 1</th><th>Commit 2</th><th>Commit 3</th><th>Commit cuối xong lúc</th></tr></thead>
<tbody>
<tr><td><code>cancel-in-progress: true</code></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009923442" target="_blank" rel="noopener">bị huỷ giữa bước</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009970441" target="_blank" rel="noopener">bị huỷ giữa bước</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010016477" target="_blank" rel="noopener">✓</a></td><td>+154 s</td></tr>
<tr><td><code>cancel-in-progress: false</code></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009923032" target="_blank" rel="noopener">✓</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009970458" target="_blank" rel="noopener">bị huỷ khi đang chờ — không job nào từng chạy</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010016461" target="_blank" rel="noopener">✓</a></td><td>+183 s</td></tr>
<tr><td><code>queue: max</code></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009923057" target="_blank" rel="noopener">✓</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009970451" target="_blank" rel="noopener">✓</a></td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010016184" target="_blank" rel="noopener">✓</a></td><td>+274 s</td></tr>
</tbody>
</table>
<p>Mỗi hàng đúng cho một kiểu workflow và sai cho kiểu khác. <code>true</code> đưa commit mới nhất lên nhanh nhất và phí ít máy nhất — nhưng hai lần chạy bị cắt ngang giữa lúc đang "đẩy ảnh". <code>false</code> không bao giờ cắt ngang cái gì, nhưng commit 2 bị bỏ qua ÂM THẦM: lần chạy của nó hiện "cancelled" với KHÔNG job nào. <code>queue: max</code> deploy mọi commit theo thứ tự, và commit cuối lên muộn hơn hai phút so với <code>true</code>.</p>

<h3>Một lần chạy bị huỷ trông ra sao từ bên trong</h3>
${slide('ga-07', 10, 'Huỷ là dừng GIỮA bước — và bước dọn dẹp vẫn chạy')}
<div class="out">2 · day anh (gia lap 40 giay)
day anh ... 20 s  (14:03:14)
##[error]The operation was canceled.
3 · chay migration                 -&gt; skipped
4 · don dep (if always)            job.status=cancelled
5 · chi chay khi BI HUY (if cancelled)
run nay bi huy giua chung luc 14:03:19</div>
<p>Bốn điều cần để ý trong log ấy (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009923442" target="_blank" rel="noopener">36009923442</a>):</p>
<ul>
<li>Bước bị giết <strong>Ở GIỮA</strong>. Hai mươi giây của một lượt "tải lên" bốn mươi giây đã diễn ra. Ở một cuộc deploy thật, đó là một ảnh đẩy dở, hoặc tệ hơn, một ảnh đã đẩy mà migration chưa từng chạy — đúng hình dạng sự cố 03/07/2026 của kho này, khi feed trả 500 vì mã mới hơn schema.</li>
<li>Bước 3 bị <strong>skipped</strong> (bỏ qua), không phải failed. Một bảng theo dõi chỉ đếm cú hỏng sẽ không thấy nó.</li>
<li>Bước có <code>if: always()</code> và <code>if: cancelled()</code> <strong>VẪN CHẠY</strong>, và <code>job.status</code> là <code>cancelled</code>. Đó là chỗ đặt việc dọn dẹp: xoá tệp ghi dở, nhả khoá, báo "deploy đã bị huỷ".</li>
<li>LÝ DO huỷ hoàn toàn không nằm trong log. Nó nằm ở annotation (chú thích) của lần chạy: <code>Canceling since a higher priority waiting request for ch07 · cc huy (…)-refs/heads/ch07-toc-do exists</code>. Lấy nó bằng <code>gh api repos/OWNER/REPO/check-runs/CHECK_RUN_ID/annotations</code>, hoặc trên trang lần chạy, dưới phần tóm tắt job.</li>
</ul>

<h3>Huỷ KHÔNG tức thời — nó có một bậc thang</h3>
${slide('ga-07', 11, 'Huỷ không tức thời: tiến trình có 10 giây để dọn')}
<p>Tài liệu mô tả runner làm gì khi một job bị huỷ: nó đánh giá lại các điều kiện <code>if:</code> (vì thế các bước <code>always()</code> mới chạy), gửi <strong>SIGINT</strong> (như bấm Ctrl-C) tới tiến trình của bước, chờ 7,5 giây, gửi <strong>SIGTERM</strong>, chờ 2,5 giây, rồi giết cả cây tiến trình. Sau năm phút, máy chủ cưỡng chế dừng mọi thứ còn chạy.</p>
<p>Sân tập cho thấy đúng ngân sách mười giây ấy được dùng hết. Ở cả hai lần chạy bị huỷ, lần chạy mới được tạo và bước cũ kết thúc mười giây sau (14:03:09 → 14:03:19, và 14:03:31 → 14:03:41). Bước ấy là một vòng lặp bash quanh <code>sleep</code>, thứ không dừng ở tín hiệu đầu tiên, nên nó đi hết bậc thang. Hai hệ quả:</p>
<ul>
<li>Lần chạy mới KHÔNG khởi động ngay. Với <code>cancel-in-progress: true</code>, job của lần chạy mới chỉ được tạo lúc 14:03:23 — mười bốn giây sau khi nó vào hàng — vì lần chạy cũ phải chết xong đã. Nhóm vẫn chỉ giữ một job chạy tại một thời điểm.</li>
<li>Nếu script deploy của bạn làm được việc gì hợp lý khi nhận SIGINT — xong tệp đang ghi, ghi một dấu, quay lui — bạn có 7,5 giây để làm. Dùng <code>trap</code> trong script shell; một công cụ phớt lờ tín hiệu sẽ bị giết mà chẳng dọn được gì.</li>
</ul>
<pre><code class="language-bash"># một bước deploy biết mình đang bị huỷ
trap 'echo "bi huy — danh dau ban phat hanh chua xong"; touch .deploy-aborted; exit 130' INT TERM
./push-image.sh
./run-migrations.sh</code></pre>

<h3><code>queue: max</code> — mới, và đi trước cả bộ lint</h3>
${slide('ga-07', 15, 'queue: max mới có — và actionlint chưa biết tới nó')}
<p>Nhiều năm liền chỉ có hai lựa chọn: "huỷ cái đang chạy" hoặc "giữ một cái chờ và bỏ phần còn lại". <code>queue: max</code> thêm lựa chọn thứ ba: giữ tới 100 lần chạy chờ và xử lý theo thứ tự chúng bắt đầu chờ. Nó là thiết lập đúng khi MỌI commit phải được deploy theo thứ tự — ví dụ một chuỗi migration, nơi bỏ qua commit 2 là bỏ qua một migration mà commit 3 mặc định là đã có.</p>
<p>Nó mới tới mức <code>actionlint</code> (bộ lint ở Chương 4) còn từ chối nó vào đúng ngày làm thí nghiệm: <code>unexpected key "queue" for "concurrency" section</code>. GitHub thì chấp nhận và chạy đúng tệp ấy — ba lần chạy, không cái nào bị huỷ. Một bộ lint là một MÔ HÌNH của nền tảng, và mô hình thì đi sau. Khi bộ lint và một lần chạy thật bất đồng, lần chạy thật thắng; việc đúng là ghi chú lại và ghim phiên bản bộ lint, chứ không phải xoá thiết lập đi.</p>

<h3>Hai workflow, một máy chủ — vì sao đặt tên nhóm theo TÀI NGUYÊN</h3>
${slide('ga-07', 13, 'Hai workflow, hai group = KHÔNG có khoá — cơ chế sự cố 06/07')}
<p>Chính các sự cố của kho này tới từ đúng khe hở ấy. Cho tới 06/07/2026, <code>deploy-ghcr.yml</code> và <code>backend-vps.yml</code> đều chạy mỗi khi push lên <code>main</code> có đụng <code>src/**</code>. Cái đầu có <code>group: deploy-ghcr</code>; cái sau không có khối concurrency nào. Vậy là một cú push khởi động HAI cuộc deploy lên cùng một máy chủ, và không cái nào biết cái kia tồn tại. Ngày 06/07, hai cuộc cùng dựng lại container backend một lúc, một cái giết container của cái kia (<code>Exited(137)</code>) và để lại container mồ côi. Chương 9 sẽ mổ xẻ sự cố ấy; ở đây chỉ cần cơ chế:</p>
<div class="callout warn">
<p><strong>Một nhóm concurrency chỉ bảo vệ những gì CHUNG TÊN với nó.</strong> Hai workflow với hai tên nhóm khác nhau — hoặc một cái có nhóm, một cái không — thì chẳng hề được tuần tự hoá với nhau. Nếu nhiều workflow cùng chạm một máy chủ, chúng cần <em>MỘT</em> tên nhóm, đặt theo máy chủ (<code>group: prod-vps</code>), không theo tệp.</p>
</div>
<p>Sân tập tái hiện điều đó một cách an toàn: <code>ch07-chung-a.yml</code> và <code>ch07-chung-b.yml</code> đều khai <code>group: ch07-vps-chung-&#36;{{ github.ref }}</code> và cùng được kích bởi một cú push. Workflow B chạy từ 14:12:33 tới 14:13:06 (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011098857" target="_blank" rel="noopener">36011098857</a>); job của workflow A được tạo lúc 14:13:07 (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011098744" target="_blank" rel="noopener">36011098744</a>), một giây sau khi B xong. Cùng một cú push, hai tệp, MỘT hàng đợi.</p>
<p>Cách vá thật của kho còn mạnh hơn một nhóm chung: cả hai workflow deploy chuyển sang chỉ <code>workflow_dispatch</code>, và việc deploy chuyển sang một script chạy tay. Tới hôm nay <code>backend-vps.yml</code> vẫn không có khối concurrency nào — nó được bảo vệ chỉ nhờ việc có một con người bấm nút. Đó là một biện pháp thật, nhưng nên biết rằng nó là biện pháp DUY NHẤT.</p>

<h3>Concurrency ở mức job: chỉ khoá phần nguy hiểm</h3>
<p><code>concurrency:</code> đặt được trên một job thay vì cả workflow. Khi ấy việc dựng và kiểm của nhiều commit chạy song song thoải mái, chỉ job deploy phải xếp hàng:</p>
<pre><code class="language-yaml">jobs:
  build:
    runs-on: ubuntu-24.04
    steps: [ ... ]            # được phép chồng với các lần chạy khác
  deploy:
    needs: build
    runs-on: ubuntu-24.04
    concurrency:
      group: prod-vps         # đặt theo MÁY CHỦ
      cancel-in-progress: false
    steps: [ ... ]</code></pre>
<p>Đây thường là hình dạng tốt nhất cho một đường ống deploy: bạn có tốc độ của việc dựng song song và sự an toàn của một-cuộc-deploy-một-lúc, và một commit mới đang chờ deploy sẽ thay chỗ một commit cũ chưa kịp bắt đầu.</p>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: <code>cancel-in-progress</code> làm gì, và khi nào bạn KHÔNG dùng nó?</strong><br>Đ: Nó huỷ lần chạy đang chạy trong cùng nhóm khi có lần mới tới. Tôi dùng cho kiểm PR, nơi chỉ commit mới nhất có nghĩa. Tôi không dùng cho thứ có tác dụng phụ phải hoàn tất — deploy, phát hành, migration — vì job bị huỷ dừng GIỮA hai bước, và nửa sau của cuộc deploy không bao giờ xảy ra.</p>
<p><strong>H: Hai workflow cùng deploy lên một máy chủ. Làm sao để chúng không chồng nhau?</strong><br>Đ: Cho cả hai cùng một nhóm concurrency, đặt tên theo máy chủ, tốt nhất ở mức job trên job deploy. Tên nhóm khác nhau thì không tuần tự hoá được gì.</p>
<p><strong>H: <code>concurrency</code> có làm cuộc deploy thành bất biến-theo-số-lần-chạy (idempotent) không?</strong><br>Đ: Không. Nó sắp các lần chạy theo thời gian; nó không ngăn lần sau ghi đè lần trước. Tính bất biến cần một phép kiểm TRẠNG THÁI — "phiên bản này đã công bố chưa?" — ngay trong job.</p>
</div>

<h3>Chín workflow còn lại thì sao</h3>
<div class="out">concurrency: khai o  2 / 11 workflow</div>

<div class="callout">
<p><strong>Cập nhật 09/2026.</strong> Kho giờ có 14 workflow và 3 cái khai nhóm: hai cái bên trên cộng <code>ship-lab211.yml</code> (<code>group: ship-lab211</code>, <code>cancel-in-progress: false</code>). Lập luận dưới đây về phần còn lại vẫn đúng.</p>
</div>

<p>Chín cái kia là những workflow <code>workflow_dispatch</code> một job. Biện pháp kiểm soát đồng thời của chúng là MỘT CON NGƯỜI quyết định bấm nút, và đó là một biện pháp thật với một tính chất thật: nó được tuần tự hoá bởi một người BIẾT cái trước đã xong hay chưa. Cách ấy chạy được cho tới khi có HAI người cùng bấm, hoặc cho tới khi một trong hai là một cái lịch — <code>vps-cleanup-weekly.yml</code> có cả cron lẫn dispatch, nên một lượt chạy tay và một lượt chạy theo lịch THẬT SỰ chồng lên nhau được.</p>

<div class="callout">
<p><strong>Một câu.</strong> <code>concurrency</code> quyết định một lần chạy bị vượt mặt sẽ CHẾT hay CHỜ, đáp án phụ thuộc vào việc lần chạy ấy có tác dụng phụ bắt buộc phải hoàn tất hay không, và nó KHÔNG làm cho thứ gì trở nên bất biến-theo-số-lần-chạy — một lần chạy đứng chờ đến lượt rồi ghi đè kết quả thì sai y hệt một lần chạy đua nhau.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> các lượt kiểm PR của bạn cứ chồng đống mỗi khi bạn đẩy bản vá liên tiếp, và bạn muốn biết chính xác mỗi thiết lập concurrency sẽ làm gì trước khi đổi bất cứ thứ gì.</p><ol>
<li>Trong một kho thử, tạo workflow <code>on: push</code> lọc theo một tệp (vd <code>paths: ['kich/cc']</code>), một job có hai bước <code>sleep 40</code>, một bước <code>if: always()</code> in <code>&#36;{{ job.status }}</code>, và một bước <code>if: cancelled()</code>.</li>
<li>Thêm <code>concurrency: { group: &#36;{{ github.workflow }}-&#36;{{ github.ref }}, cancel-in-progress: true }</code>.</li>
<li>Đẩy ba commit sửa tệp kích, cách nhau khoảng 20 giây.</li>
<li>Chạy <code>gh run list --workflow &lt;tệp&gt; --limit 3</code>; mở một lần chạy bị huỷ, tìm annotation "Canceling since a higher priority waiting request" và dòng mà bước bị cắt.</li>
<li>Đổi sang <code>cancel-in-progress: false</code> và làm lại. Tìm lần chạy bị huỷ khi còn đang chờ.</li></ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được, kèm ID lần chạy, một lần chạy bị cắt giữa bước mà bước dọn dẹp vẫn chạy, và một lần chạy bị huỷ mà không có job nào — và bạn nói được trong một câu kiểm PR nên dùng thiết lập nào, deploy nên dùng thiết lập nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Concurrency group (nhóm đồng thời)</span><span class="v">Một chuỗi; mọi lần chạy hay job ra cùng chuỗi dùng chung một suất "mỗi lúc một cái", kể cả khác tệp workflow.</span></div>
  <div class="kv"><span class="k"><code>cancel-in-progress</code></span><span class="v">Huỷ thành viên đang chạy của nhóm khi có cái mới tới.</span></div>
  <div class="kv"><span class="k">Pending (đang chờ)</span><span class="v">Đã vào nhóm, đang đợi. Mặc định chỉ giữ một cái chờ; cái mới hơn thay chỗ nó.</span></div>
  <div class="kv"><span class="k"><code>queue: max</code></span><span class="v">Giữ tới 100 lần chạy chờ và xử lý theo thứ tự. Không đi chung được với <code>cancel-in-progress: true</code>.</span></div>
  <div class="kv"><span class="k"><code>cancelled()</code> / <code>always()</code></span><span class="v">Hàm trạng thái cho <code>if:</code>; bước dùng chúng vẫn chạy khi job bị huỷ.</span></div>
  <div class="kv"><span class="k">SIGINT / SIGTERM (tín hiệu ngắt / kết thúc)</span><span class="v">Tín hiệu runner gửi tới bước bị huỷ: ngắt trước, 7,5 s sau thì kết thúc, 2,5 s nữa thì giết.</span></div>
  <div class="kv"><span class="k">Idempotent (bất biến theo số lần chạy)</span><span class="v">Chạy hai lần cũng như chạy một lần. Concurrency không cho bạn tính chất này; một phép kiểm trạng thái mới cho.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một nhóm concurrency cho một lần chạy đang chạy và, mặc định, một lần đang chờ; cái mới tới thay chỗ cái đang chờ.</li>
<li><code>cancel-in-progress: true</code> hợp với kiểm PR; nó cắt job đang chạy giữa hai bước nên nguy hiểm với deploy và phát hành.</li>
<li>Đo trên ba cú push: <code>true</code> xong commit cuối ở +154 s, <code>false</code> ở +183 s và bỏ âm thầm commit 2, <code>queue: max</code> ở +274 s và chạy đủ mọi commit.</li>
<li>Huỷ mất tới ~10 s (SIGINT, SIGTERM, giết) và bước <code>if: always()</code> / <code>if: cancelled()</code> vẫn chạy — đặt việc dọn dẹp ở đó.</li>
<li>Nhóm chỉ bảo vệ thứ chung tên: hai workflow deploy cần MỘT nhóm đặt theo máy chủ — chính khe hở đứng sau các sự cố 07/2026.</li>
<li>Concurrency sắp thứ tự các lần chạy; nó không làm chúng bất biến.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using concurrency</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-concurrency — biểu thức đặt nhóm, <code>cancel-in-progress</code>, và luật rằng mỗi nhóm chỉ có MỘT lần chạy được treo chờ (một lượt thứ ba xếp hàng sẽ THAY THẾ lượt thứ hai chứ không nối vào hàng).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — jobs.&lt;id&gt;.concurrency</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idconcurrency — dạng ở mức JOB, cho lúc chỉ mỗi job deploy cần tuần tự hoá còn các job dựng thì được chạy thoải mái.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Canceling a workflow</span><span class="lc-sub">docs.github.com/en/actions/managing-workflow-runs/canceling-a-workflow — chuyện gì THẬT SỰ xảy ra với một job bị huỷ, gồm cả khoảng ân hạn và những bước nào vẫn chạy, tức là chi tiết đứng sau cái bẫy bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — hai cuộc deploy đua nhau, và cái container thoát 137</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — sự cố mà kho này gặp khi hai workflow deploy chồng lên nhau, chính là sự cố đã đẻ ra mấy khối concurrency này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Redis — bất biến-theo-số-lần-chạy là một phép kiểm TRẠNG THÁI, không phải một bảo đảm THỨ TỰ</span><span class="lc-sub">/courses/redis/learn${REF} — chỗ phân biệt mà sự cố v0.5.40 xoay quanh, phát biểu tổng quát: tuần tự hoá hai người ghi không làm cho người thứ hai trở nên đúng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — The same workflow, 100 seconds and 160 seconds|||7.3 — Cùng một workflow, 100 giây và 160 giây',
      slug: 'ga-7-3-phuong-sai',
      type: 'VIDEO',
      description: 'Mười lần chạy `ci-lint` trên cùng một nhánh: 100s tới 160s, biên độ 1,60 lần. Trước khi bạn đổi bất cứ thứ gì. Nên một phép tối ưu "tiết kiệm 15 giây" nằm HOÀN TOÀN trong tiếng ồn, và đo nó bằng một lần chạy là tự lừa mình.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>The same workflow, 100 seconds and 160 seconds</h2>
<p class="lead">Before optimising anything, it is worth knowing how noisy the thing you are about to measure is. For this repository&#39;s CI workflow, the answer is noisier than most of the optimisations people attempt on it.</p>

<h3>Ten consecutive runs, same workflow, same branch</h3>
<div class="out">ci-lint, 10 lan gan nhat (giay):
  135  155  140  160  144  144  100  144  141  145

  TB          141 s
  trung vi    144 s
  min         100 s
  max         160 s
  do lech     15,2 s
  bien do     max/min = 1,60x</div>

<div class="callout warn">
<p><strong>Sixty per cent between the fastest and slowest run of identical work.</strong> Nothing changed between those ten runs except which machine happened to be allocated and what the network did. Any change you make to this workflow that saves less than about thirty seconds cannot be distinguished from noise by running it once.</p>
</div>

<h3>What that does to the usual optimisation claims</h3>
${slide('ga-07', 19, 'Quy tắc đo: trung vị của nhiều lần, so từng bước')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">"caching saved 15 seconds"</span><span class="lz-lnote">one standard deviation. Indistinguishable from a lucky run. Chapter 5 measured the real npm cache saving at 12.6 seconds — which is inside the noise of this workflow and therefore has to be measured on the <em>step</em>, not on the run</span></div>
<div class="lz-layer"><span class="lz-lname">"the new runner image is slower"</span><span class="lz-lnote">needs several runs on each. A single 160-second run after an upgrade proves nothing; the previous ten had a 160 in them</span></div>
<div class="lz-layer"><span class="lz-lname">"CI got slow this week"</span><span class="lz-lnote">compare medians over ten runs, not last-run against remembered-normal. Human memory of "normally about two minutes" is a median, and it gets compared against a single sample</span></div>
<div class="lz-layer"><span class="lz-lname">"this run was fast, the fix worked"</span><span class="lz-lnote">the 100-second run in that list happened with no change at all. Somebody could have attributed it to anything they did that morning</span></div>
</div>

<div class="callout ok">
<p><strong>Where to measure instead: the step.</strong> Per-step timings are much less noisy than run durations, because they exclude queueing, image variation and job hand-off. Chapter 2&#39;s three-platform comparison and Chapter 5&#39;s cache numbers are both step-level for exactly this reason. If an optimisation targets one step, measure that step across a few runs — not the whole workflow across one.</p>
</div>

<h3>The release workflow, which is noisier in absolute terms and tighter in relative</h3>
<div class="out">desktop-release, cac lan THANH CONG (giay):
  555 470 409 470 420 425 476 525 403 429

  TB 458 s · min 403 · max 555 · do lech 48,3 s
  bien do  1,38x

cac lan HONG:  80 s  va  334 s   -> TB 207 s</div>

<div class="callout">
<p><strong>A 48-second standard deviation, but only 1.38× spread.</strong> The longer workflow is relatively steadier — more of its time is real compute and less is fixed overhead, so the noise averages out. Which gives a practical rule: short workflows are proportionally noisier, so the shorter the workflow, the more runs you need to say anything about it.</p>
</div>

<h3>The failure rows, read as a signal</h3>
${slide('ga-07', 20, 'Thời lượng là tín hiệu phân loại, trước khi mở log')}
<p>The two failed runs took 80 and 334 seconds against a 458-second success average — failures are <strong>2.2× faster</strong> than successes here. Chapter 2 introduced this as a reading habit; the numbers make it a usable one:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">much shorter than usual</span><span class="lz-t">something bailed early</span><span class="lz-d">80 s against a 458 s norm. Look at the first job, not the last</span></div>
<div class="lz-step"><span class="lz-k">around usual</span><span class="lz-t">it ran, and something in it failed</span><span class="lz-d">334 s — far enough in that the build started. Look at where it stopped</span></div>
<div class="lz-step"><span class="lz-k">much longer than usual</span><span class="lz-t">something hung or retried</span><span class="lz-d">not present in this sample, and the one that <code>timeout-minutes</code> exists for</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — a performance regression test on run duration.</strong> A check that fails when the run exceeds some threshold will, on this workflow, fire on the 160-second run and stay quiet on the 155-second one, teaching everybody that the check is noise. If you want to catch real regressions, compare a rolling median against a baseline median with a margin of several standard deviations — or measure the specific step you care about, which is both quieter and more informative.</p>
</div>

<h3>Reproduced on the sandbox: 14 runs of one commit</h3>
${slide('ga-07', 16, '14 lần chạy CÙNG commit: 37 s tới 77 s')}
<p>The numbers above are this repository&#39;s history, where commits differed between runs. To remove every excuse, the sandbox workflow <code>ch07-phuong-sai.yml</code> runs one job — checkout, <code>setup-node</code> with the npm cache, <code>npm ci</code> of 681 packages, <code>tsc --noEmit</code> over 600 files, six CPU-bound test groups, <code>tsc</code> build — and it was run 14 times on the <strong>same commit</strong> within 25 minutes on 24 September 2026.</p>
<div class="out">ch07-phuong-sai, 14 lan, CUNG commit (giay):
  77  72  62  51  47  42  47  37  49  50  51  55  46  51

  trung vi    50,5 s
  TB          52,6 s
  min / max   37 / 77      max/min = 2,08x
  do lech     10,9 s
  xep hang (tao job -&gt; runner nhan): 3-4 s moi lan</div>
<p>A 2.08× spread on identical input — wider than the 1.60× in this repository&#39;s own history, because this workflow is shorter (the previous lesson&#39;s rule: short workflows are proportionally noisier). Queueing was 3–4 seconds every time, exactly as Chapter 2 measured; it is not where the variance lives.</p>

<h3>Decomposing the slow runs: three runs, three different causes</h3>
${slide('ga-07', 17, 'Phân rã: ba lần chậm nhất chậm vì ba lý do khác nhau')}
<p>The per-step timestamps from <code>gh api …/jobs</code> say where each run spent its time. The three slow runs were slow for three unrelated reasons, and none of them is in your code:</p>
<table>
<thead><tr><th>#</th><th>Run</th><th>Wall-clock</th><th>What was unusual</th><th>CPU reported by the runner</th></tr></thead>
<tbody>
<tr><td>1</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009578248" target="_blank" rel="noopener">36009578248</a></td><td>77 s</td><td>30 s between the last step and the job being marked complete</td><td>AMD EPYC 9V74</td></tr>
<tr><td>2</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010057800" target="_blank" rel="noopener">36010057800</a></td><td>72 s</td><td>20 s between the job starting and its first step</td><td>Intel Xeon Platinum 8370C</td></tr>
<tr><td>3</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010089507" target="_blank" rel="noopener">36010089507</a></td><td>62 s</td><td><code>setup-node</code> (cache restore) took 20 s instead of 2–5</td><td>AMD EPYC 9V74</td></tr>
<tr><td>8</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010250054" target="_blank" rel="noopener">36010250054</a></td><td>37 s</td><td>fastest: every step at the low end</td><td>AMD EPYC 9V74</td></tr>
<tr><td colspan="2">other ten runs</td><td>42–55 s</td><td>nothing notable</td><td>EPYC 7763 or 9V74</td></tr>
</tbody>
</table>
<ul>
<li><strong>Before the first step (run 2):</strong> the job was "in progress" for 20 seconds before "Set up job" began. That is the runner machine getting ready, and it appears in no step&#39;s timing — only in the gap between the job&#39;s <code>started_at</code> and its first step&#39;s <code>started_at</code>.</li>
<li><strong>After the last step (run 1):</strong> "Complete job" finished at 14:00:43 but the job was only marked complete at 14:01:13. Thirty seconds of reporting and teardown, again invisible in the steps.</li>
<li><strong>Inside a network step (run 3):</strong> restoring the npm cache took 20 seconds instead of the usual 2–5. The cache was the same; the transfer was not.</li>
</ul>
<p>So a "slow run" is often a run that got a slow <em>machine start</em>, <em>teardown</em> or <em>download</em>. If you want to know whether your change made things faster, measure the span from the first step to the last — or the specific step — not the run.</p>

<h3>At the step level the noise is much smaller — except for network steps</h3>
${slide('ga-07', 18, 'Ở mức bước, phương sai nhỏ hơn — trừ bước dùng mạng')}
<table>
<thead><tr><th>Measured over 14 runs</th><th>min</th><th>median</th><th>max</th><th>max/min</th></tr></thead>
<tbody>
<tr><td>whole run (wall-clock)</td><td>37</td><td>50.5</td><td>77</td><td>2.08×</td></tr>
<tr><td>first step → last step</td><td>29</td><td>40</td><td>53</td><td>1.83×</td></tr>
<tr><td><code>setup-node</code> (cache restore)</td><td>2</td><td>4</td><td>20</td><td>10×</td></tr>
<tr><td><code>npm ci</code></td><td>11</td><td>15</td><td>17</td><td>1.55×</td></tr>
<tr><td>test (pure CPU)</td><td>9.5</td><td>12.5</td><td>14.2</td><td>1.49×</td></tr>
<tr><td><code>tsc</code> / build</td><td>2</td><td>3</td><td>4</td><td>±1 s</td></tr>
</tbody>
</table>
<p>The CPU-only test step still varies by half, and the runner tells you why if you ask: the workflow prints <code>nproc</code> and the CPU model, and the 14 runs landed on <strong>three different processors</strong> — AMD EPYC 7763, AMD EPYC 9V74 and Intel Xeon Platinum 8370C — all under the same <code>ubuntu-24.04</code> label with 4 cores. The only Xeon run was the slowest test run (14.2 s); the fastest (9.5 s) were on EPYC 9V74. You do not choose the machine, so print it:</p>
<pre><code class="language-yaml">- name: which machine is this
  run: echo "cpu=$(nproc) · $(grep -m1 'model name' /proc/cpuinfo | cut -d: -f2)"</code></pre>

<div class="callout warn">
<p><strong>Correction to the "cache saved 15 seconds" row above.</strong> The 12.6-second figure attributed to Chapter 5 was measured on a local machine (31.4 s → 18.8 s). Chapter 5 has since measured the same cache on a GitHub runner: <code>cache: npm</code> saves about <strong>3.8 s</strong> per job there (17.5 s → 13.7 s), because the runner downloads packages very fast. Against a workflow whose run-to-run spread is 40 seconds, a 3.8-second saving is invisible at run level and only measurable on the install step itself — which makes this lesson&#39;s point more strongly than the old number did.</p>
</div>

<h3>How many runs do you need?</h3>
<p>There is no magic number, but there is a practical rule you can defend in a code review:</p>
<ul>
<li><strong>At least five runs per side, paired.</strong> Start the "before" and "after" workflows at the same time, so they share network conditions. That is how the critical-path experiment in 7.1 was run.</li>
<li><strong>Compare medians, not means.</strong> One 30-second teardown moved the mean of the 14 runs to 52.6 s; the median stayed at 50.5 s. Means are dragged by exactly the outliers you do not care about.</li>
<li><strong>If the saving is smaller than about half the spread, measure the step.</strong> Here the spread is 40 s; a 5-second saving will only show up reliably at step level.</li>
<li><strong>Write down the machine.</strong> A "regression" that coincides with a different CPU model is a different machine, not a slower commit.</li>
</ul>
<p>Collecting the numbers is two commands. This prints the wall-clock of the last 14 successful runs and their median:</p>
<pre><code class="language-bash">gh run list --workflow ch07-phuong-sai.yml --status success --limit 14 \\
  --json databaseId --jq '.[].databaseId' |
while read id; do
  gh api repos/OWNER/REPO/actions/runs/$id/timing --jq '.run_duration_ms / 1000'
done | sort -n | awk '{a[NR]=$1} END {print "median:", (NR%2 ? a[(NR+1)/2] : (a[NR/2]+a[NR/2+1])/2), "s"}'</code></pre>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: After your change, CI went from 60 s to 50 s. Did your change work?</strong><br>A: I cannot tell from one run. The same commit on this kind of workflow varies from 37 to 77 seconds. I would run both versions five or more times, paired, compare medians, and look at the step my change touched.</p>
<p><strong>Q: Why do runs of the same commit take different times on GitHub-hosted runners?</strong><br>A: Different machines under the same label (I have seen three CPU models), variable machine start-up and teardown, and network-bound steps such as cache restore and package install. Queueing is usually only a few seconds.</p>
<p><strong>Q: How would you alert on CI getting slower?</strong><br>A: Not on a fixed threshold of one run. Compare a rolling median of recent runs against a baseline median, or track a specific step, and alert only when the difference exceeds a few standard deviations.</p>
</div>

<h3>Where the variance comes from</h3>
<div class="kv-grid">
<div class="kv"><span class="k">the machine</span><span class="v">every job gets a different runner (2.1), and they are not identical hardware or identically loaded. This is the largest source and it is not controllable</span></div>
<div class="kv"><span class="k">the network</span><span class="v">every job does a checkout, a dependency fetch and often a cache restore. All three are network-bound, and Chapter 5&#39;s break-even model was explicitly a range for this reason</span></div>
<div class="kv"><span class="k">cache state</span><span class="v">a run that misses where the previous one hit is slower for a reason that is real but not a regression. The 100-second outlier is the shape of a run where everything went right</span></div>
<div class="kv"><span class="k">not the queue</span><span class="v">measured in 2.1 at 2–3 seconds. Queueing is not what makes runs vary; it is the work itself</span></div>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> Identical work on this workflow spans 100 to 160 seconds, so any claim about a saving smaller than half a minute needs several runs or a step-level measurement — and the single fastest run you ever saw was not caused by anything you did.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> before you promise your team that an optimisation "saves 10 seconds", you need to know how noisy your CI is.</p><ol>
<li>Pick a workflow that has <code>workflow_dispatch:</code> (add it if not). Add a step that prints <code>nproc</code> and the CPU model.</li>
<li>Start it 10 times on the same commit: <code>for i in $(seq 10); do gh workflow run &lt;file&gt; --ref &lt;branch&gt;; sleep 15; done</code>.</li>
<li>When all have finished, collect the wall-clock with <code>gh api …/runs/&lt;id&gt;/timing</code> and the per-step times with <code>gh api …/runs/&lt;id&gt;/jobs</code>.</li>
<li>Build a table: min / median / max for the run and for your three biggest steps. Mark each run&#39;s CPU model.</li>
<li>For the slowest run, find where the extra time went: before the first step, inside a step, or after the last step.</li></ol>
<p><strong>Done when:</strong> you can state your workflow&#39;s median and spread, name the step with the largest spread, explain your slowest run in one sentence, and say how big a saving would have to be before one run could show it.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Variance / spread</span><span class="v">How much repeated measurements of the same thing differ. Here: max/min and standard deviation.</span></div>
  <div class="kv"><span class="k">Median</span><span class="v">The middle value when sorted. Robust to one or two outliers, unlike the mean.</span></div>
  <div class="kv"><span class="k">Outlier</span><span class="v">A run far from the rest — usually a slow machine start, teardown or download, not your code.</span></div>
  <div class="kv"><span class="k">Paired runs</span><span class="v">Starting the before and after versions at the same time so they share conditions.</span></div>
  <div class="kv"><span class="k">Step-level timing</span><span class="v">Duration of one step from the jobs API; far less noisy than the run as a whole.</span></div>
  <div class="kv"><span class="k">Runner image vs machine</span><span class="v">The label (<code>ubuntu-24.04</code>) fixes the software; the hardware underneath varies.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The same commit ran 14 times in 37–77 s (median 50.5 s, 2.08×) on the sandbox; this repository&#39;s own CI spans 100–160 s.</li>
<li>The three slowest runs were slow for three unrelated reasons: machine start-up, job teardown and a slow cache download.</li>
<li>Runners under one label used three different CPU models; a pure-CPU step varied 9.5–14.2 s because of it.</li>
<li>Queueing is steady (3–4 s) and is not the source of variance.</li>
<li>Measure paired runs, compare medians, and measure the step your change touches when the saving is small.</li>
<li>Duration is a triage signal: much shorter means an early bail-out, much longer means a hang or retry.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — list workflow runs</span><span class="lc-sub">docs.github.com/en/rest/actions/workflow-runs — <code>run_started_at</code> and <code>updated_at</code> per run, which is how the ten-run distributions above were collected. Ten runs is two API calls.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images — hardware specification</span><span class="lc-sub">github.com/actions/runner-images#available-images — the specification is a floor rather than a guarantee of identical machines, which is the largest term in the variance above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Viewing job execution time</span><span class="lc-sub">docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/viewing-job-execution-time — billable versus wall-clock time in the UI, and the per-step view that this lesson argues you should measure against.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — measuring a change when the baseline moves</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the same problem on a production server: a latency improvement smaller than the daily variation, and how to establish that it is real.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — EXPLAIN ANALYZE, and running it more than once</span><span class="lc-sub">/courses/postgresql/learn${REF} — why a single timing is a sample, and the discipline of separating cold from warm before comparing anything.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Cùng một workflow, 100 giây và 160 giây</h2>
<p class="lead">Trước khi đi tối ưu bất cứ thứ gì, đáng biết cái thứ bạn sắp đo NHIỄU tới mức nào. Với workflow CI của kho này, đáp án là: nhiễu hơn phần lớn những phép tối ưu mà người ta đem áp lên nó.</p>

<h3>Mười lần chạy liên tiếp, cùng workflow, cùng nhánh</h3>
<div class="out">ci-lint, 10 lan gan nhat (giay):
  135  155  140  160  144  144  100  144  141  145

  TB          141 s
  trung vi    144 s
  min         100 s
  max         160 s
  do lech     15,2 s
  bien do     max/min = 1,60x</div>

<div class="callout warn">
<p><strong>Sáu mươi phần trăm giữa lần chạy nhanh nhất và chậm nhất của CÙNG một khối việc.</strong> Không có gì thay đổi giữa mười lần chạy ấy ngoài việc cỗ máy nào tình cờ được cấp và mạng đã làm gì. Mọi thay đổi bạn áp lên workflow này mà tiết kiệm dưới khoảng ba mươi giây thì KHÔNG phân biệt được với tiếng ồn nếu chỉ chạy một lần.</p>
</div>

<h3>Nó làm gì với những lời tuyên bố tối ưu quen thuộc</h3>
${slide('ga-07', 19, 'Quy tắc đo: trung vị của nhiều lần, so từng bước')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">"cache tiết kiệm 15 giây"</span><span class="lz-lnote">một độ lệch chuẩn. Không phân biệt được với một lần chạy may. Chương 5 đo khoản tiết kiệm THẬT của cache npm là 12,6 giây — nằm TRONG tiếng ồn của workflow này, nên buộc phải đo ở mức <em>BƯỚC</em>, không đo ở mức lần chạy</span></div>
<div class="lz-layer"><span class="lz-lname">"ảnh runner mới chậm hơn"</span><span class="lz-lnote">cần vài lần chạy ở mỗi bên. Một lần chạy 160 giây sau khi nâng cấp chứng minh được con số không; mười lần trước đó vốn đã có một cái 160 trong đó</span></div>
<div class="lz-layer"><span class="lz-lname">"tuần này CI chậm hẳn"</span><span class="lz-lnote">hãy so TRUNG VỊ trên mười lần chạy, đừng so lần-chạy-cuối với cái-bình-thường-trong-trí-nhớ. Trí nhớ của con người về "bình thường tầm hai phút" là một trung vị, và nó bị đem so với một mẫu duy nhất</span></div>
<div class="lz-layer"><span class="lz-lname">"lần này chạy nhanh, vậy là bản vá có tác dụng"</span><span class="lz-lnote">cái lần 100 giây trong danh sách kia xảy ra mà KHÔNG có thay đổi nào cả. Ai đó đã có thể quy nó cho bất cứ việc gì họ làm sáng hôm ấy</span></div>
</div>

<div class="callout ok">
<p><strong>Nên đo ở đâu thay vào đó: ở BƯỚC.</strong> Nhịp thời gian theo từng bước ít nhiễu hơn hẳn thời lượng lần chạy, bởi nó loại bỏ phần xếp hàng, phần biến thiên của ảnh máy và phần giao tiếp giữa các job. Phép so ba nền tảng của Chương 2 và các con số cache của Chương 5 đều ở mức BƯỚC, đúng vì lý do này. Nếu một phép tối ưu nhắm vào một bước, hãy đo BƯỚC ẤY qua vài lần chạy — đừng đo cả workflow qua một lần.</p>
</div>

<h3>Workflow phát hành, nhiễu hơn về tuyệt đối và chặt hơn về tương đối</h3>
<div class="out">desktop-release, cac lan THANH CONG (giay):
  555 470 409 470 420 425 476 525 403 429

  TB 458 s · min 403 · max 555 · do lech 48,3 s
  bien do  1,38x

cac lan HONG:  80 s  va  334 s   -> TB 207 s</div>

<div class="callout">
<p><strong>Độ lệch chuẩn 48 giây, mà biên độ chỉ 1,38 lần.</strong> Workflow dài hơn thì TƯƠNG ĐỐI ổn định hơn — phần lớn thời gian của nó là tính toán thật và ít hơn là chi phí cố định, nên tiếng ồn được trung bình hoá bớt đi. Từ đó ra một quy tắc thực dụng: workflow NGẮN thì nhiễu hơn theo tỉ lệ, nên workflow càng ngắn, bạn càng cần nhiều lần chạy mới nói được điều gì về nó.</p>
</div>

<h3>Mấy hàng HỎNG, đọc như một tín hiệu</h3>
${slide('ga-07', 20, 'Thời lượng là tín hiệu phân loại, trước khi mở log')}
<p>Hai lần chạy hỏng mất 80 và 334 giây so với trung bình thành công 458 giây — cú hỏng ở đây <strong>nhanh hơn 2,2 lần</strong> so với cú thành công. Chương 2 giới thiệu chuyện này như một thói quen ĐỌC; mấy con số biến nó thành một thói quen DÙNG ĐƯỢC:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">ngắn hơn thường lệ nhiều</span><span class="lz-t">có thứ gì bỏ cuộc sớm</span><span class="lz-d">80 s so với chuẩn 458 s. Hãy nhìn job ĐẦU TIÊN, đừng nhìn job cuối</span></div>
<div class="lz-step"><span class="lz-k">quanh mức thường lệ</span><span class="lz-t">nó có chạy, và có thứ gì trong đó hỏng</span><span class="lz-d">334 s — đủ sâu để bản dựng đã khởi động. Hãy nhìn chỗ nó DỪNG</span></div>
<div class="lz-step"><span class="lz-k">dài hơn thường lệ nhiều</span><span class="lz-t">có thứ gì treo hoặc thử lại</span><span class="lz-d">không có trong mẫu này, và đó là ca mà <code>timeout-minutes</code> sinh ra để lo</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — một phép kiểm chống thoái lui hiệu năng đặt trên THỜI LƯỢNG LẦN CHẠY.</strong> Một phép kiểm hỏng khi lần chạy vượt một ngưỡng nào đó thì, trên workflow này, sẽ nổ ở lần chạy 160 giây và im ở lần 155 giây, dạy cho mọi người rằng phép kiểm ấy là tiếng ồn. Nếu bạn muốn bắt thoái lui THẬT, hãy so một trung vị TRƯỢT với một trung vị nền, cách nhau vài độ lệch chuẩn — hoặc đo đúng cái bước bạn quan tâm, thứ vừa yên tĩnh hơn vừa nhiều thông tin hơn.</p>
</div>

<h3>Tái hiện trên sân tập: 14 lần chạy của MỘT commit</h3>
${slide('ga-07', 16, '14 lần chạy CÙNG commit: 37 s tới 77 s')}
<p>Các con số bên trên là lịch sử của kho này, nơi commit giữa các lần chạy có khác nhau. Để gỡ hết mọi lý do bào chữa, workflow <code>ch07-phuong-sai.yml</code> trên sân tập chạy một job — checkout, <code>setup-node</code> có cache npm, <code>npm ci</code> 681 gói, <code>tsc --noEmit</code> qua 600 tệp, sáu nhóm test tốn CPU thật, rồi <code>tsc</code> dựng — và nó được chạy 14 lần trên <strong>CÙNG MỘT commit</strong> trong vòng 25 phút, ngày 24/09/2026.</p>
<div class="out">ch07-phuong-sai, 14 lan, CUNG commit (giay):
  77  72  62  51  47  42  47  37  49  50  51  55  46  51

  trung vi    50,5 s
  TB          52,6 s
  min / max   37 / 77      max/min = 2,08x
  do lech     10,9 s
  xep hang (tao job -&gt; runner nhan): 3-4 s moi lan</div>
<p>Biên độ 2,08 lần trên đầu vào giống hệt — rộng hơn 1,60 lần trong lịch sử của chính kho này, vì workflow này NGẮN hơn (đúng quy tắc của đoạn trước: workflow ngắn thì nhiễu hơn theo tỉ lệ). Xếp hàng lần nào cũng 3–4 giây, y như Chương 2 đã đo; phương sai không nằm ở đó.</p>

<h3>Phân rã các lần chậm: ba lần chạy, ba nguyên nhân khác nhau</h3>
${slide('ga-07', 17, 'Phân rã: ba lần chậm nhất chậm vì ba lý do khác nhau')}
<p>Mốc giờ từng bước lấy từ <code>gh api …/jobs</code> cho biết mỗi lần chạy tiêu thời gian vào đâu. Ba lần chậm chậm vì ba lý do chẳng liên quan gì tới nhau, và không lý do nào nằm trong mã của bạn:</p>
<table>
<thead><tr><th>#</th><th>Run</th><th>Đồng hồ</th><th>Điều bất thường</th><th>CPU runner báo</th></tr></thead>
<tbody>
<tr><td>1</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009578248" target="_blank" rel="noopener">36009578248</a></td><td>77 s</td><td>30 s giữa bước cuối và lúc job được đánh dấu xong</td><td>AMD EPYC 9V74</td></tr>
<tr><td>2</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010057800" target="_blank" rel="noopener">36010057800</a></td><td>72 s</td><td>20 s giữa lúc job bắt đầu và bước đầu tiên</td><td>Intel Xeon Platinum 8370C</td></tr>
<tr><td>3</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010089507" target="_blank" rel="noopener">36010089507</a></td><td>62 s</td><td><code>setup-node</code> (khôi phục cache) mất 20 s thay vì 2–5</td><td>AMD EPYC 9V74</td></tr>
<tr><td>8</td><td><a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36010250054" target="_blank" rel="noopener">36010250054</a></td><td>37 s</td><td>nhanh nhất: bước nào cũng ở mức thấp</td><td>AMD EPYC 9V74</td></tr>
<tr><td colspan="2">mười lần còn lại</td><td>42–55 s</td><td>không có gì đáng kể</td><td>EPYC 7763 hoặc 9V74</td></tr>
</tbody>
</table>
<ul>
<li><strong>Trước bước đầu tiên (lần 2):</strong> job ở trạng thái "đang chạy" suốt 20 giây trước khi "Set up job" bắt đầu. Đó là cỗ máy runner đang chuẩn bị, và nó không hiện ra trong thời lượng của bước nào — chỉ hiện ở khoảng giữa <code>started_at</code> của job và <code>started_at</code> của bước đầu.</li>
<li><strong>Sau bước cuối cùng (lần 1):</strong> "Complete job" xong lúc 14:00:43 mà job chỉ được đánh dấu xong lúc 14:01:13. Ba mươi giây báo cáo và dọn máy, lại vô hình trong các bước.</li>
<li><strong>Bên trong một bước dùng mạng (lần 3):</strong> khôi phục cache npm mất 20 giây thay vì 2–5 giây như thường. Cache vẫn thế; đường truyền thì không.</li>
</ul>
<p>Vậy một "lần chạy chậm" thường là một lần chạy gặp phải lúc <em>khởi động máy</em>, <em>dọn máy</em> hay <em>tải xuống</em> chậm. Muốn biết thay đổi của bạn có làm nhanh hơn không, hãy đo khoảng từ bước đầu tới bước cuối — hoặc đúng cái bước ấy — chứ đừng đo cả lần chạy.</p>

<h3>Ở mức bước, tiếng ồn nhỏ hơn nhiều — trừ bước dùng mạng</h3>
${slide('ga-07', 18, 'Ở mức bước, phương sai nhỏ hơn — trừ bước dùng mạng')}
<table>
<thead><tr><th>Đo qua 14 lần</th><th>min</th><th>trung vị</th><th>max</th><th>max/min</th></tr></thead>
<tbody>
<tr><td>cả lần chạy (đồng hồ)</td><td>37</td><td>50,5</td><td>77</td><td>2,08×</td></tr>
<tr><td>bước đầu → bước cuối</td><td>29</td><td>40</td><td>53</td><td>1,83×</td></tr>
<tr><td><code>setup-node</code> (khôi phục cache)</td><td>2</td><td>4</td><td>20</td><td>10×</td></tr>
<tr><td><code>npm ci</code></td><td>11</td><td>15</td><td>17</td><td>1,55×</td></tr>
<tr><td>test (thuần CPU)</td><td>9,5</td><td>12,5</td><td>14,2</td><td>1,49×</td></tr>
<tr><td><code>tsc</code> / dựng</td><td>2</td><td>3</td><td>4</td><td>±1 s</td></tr>
</tbody>
</table>
<p>Bước test chỉ dùng CPU mà vẫn dao động tới một nửa, và runner nói cho bạn vì sao nếu bạn hỏi: workflow in ra <code>nproc</code> và dòng CPU, và 14 lần chạy rơi vào <strong>BA bộ xử lý khác nhau</strong> — AMD EPYC 7763, AMD EPYC 9V74 và Intel Xeon Platinum 8370C — tất cả dưới cùng nhãn <code>ubuntu-24.04</code> với 4 nhân. Lần duy nhất gặp Xeon là lần test chậm nhất (14,2 s); các lần nhanh nhất (9,5 s) đều trên EPYC 9V74. Bạn không chọn được máy, nên hãy IN nó ra:</p>
<pre><code class="language-yaml">- name: may nay la may nao
  run: echo "cpu=$(nproc) · $(grep -m1 'model name' /proc/cpuinfo | cut -d: -f2)"</code></pre>

<div class="callout warn">
<p><strong>Đính chính dòng "cache tiết kiệm 15 giây" bên trên.</strong> Con số 12,6 giây quy cho Chương 5 được đo trên MÁY CỤC BỘ (31,4 s → 18,8 s). Chương 5 sau đó đã đo lại chính cái cache ấy trên runner của GitHub: <code>cache: npm</code> tiết kiệm khoảng <strong>3,8 s</strong> mỗi job ở đó (17,5 s → 13,7 s), vì runner tải gói rất nhanh. So với một workflow dao động 40 giây giữa các lần chạy, khoản 3,8 giây là VÔ HÌNH ở mức lần chạy và chỉ đo được ngay trên bước cài — điều đó làm luận điểm của bài này mạnh hơn cả con số cũ.</p>
</div>

<h3>Cần bao nhiêu lần chạy?</h3>
<p>Không có con số thần kỳ nào, nhưng có một quy tắc thực dụng mà bạn bảo vệ được trong một buổi review mã:</p>
<ul>
<li><strong>Ít nhất năm lần mỗi bên, chạy THEO CẶP.</strong> Khởi động bản "trước" và bản "sau" cùng một lúc, để chúng chung điều kiện mạng. Thí nghiệm đường tới hạn ở bài 7.1 được chạy đúng như thế.</li>
<li><strong>So TRUNG VỊ, đừng so trung bình.</strong> Một cú dọn máy 30 giây kéo trung bình của 14 lần lên 52,6 s; trung vị vẫn đứng ở 50,5 s. Trung bình bị lôi đi bởi đúng những giá trị lạc loài mà bạn không quan tâm.</li>
<li><strong>Nếu khoản tiết kiệm nhỏ hơn khoảng một nửa độ trải, hãy đo BƯỚC.</strong> Ở đây độ trải là 40 s; một khoản 5 giây chỉ hiện ra đáng tin ở mức bước.</li>
<li><strong>Ghi lại loại máy.</strong> Một "cú thoái lui" trùng với một dòng CPU khác là một cỗ máy khác, không phải một commit chậm hơn.</li>
</ul>
<p>Thu số liệu thì hai lệnh là xong. Đoạn sau in thời gian đồng hồ của 14 lần chạy thành công gần nhất và trung vị của chúng:</p>
<pre><code class="language-bash">gh run list --workflow ch07-phuong-sai.yml --status success --limit 14 \\
  --json databaseId --jq '.[].databaseId' |
while read id; do
  gh api repos/OWNER/REPO/actions/runs/$id/timing --jq '.run_duration_ms / 1000'
done | sort -n | awk '{a[NR]=$1} END {print "trung vi:", (NR%2 ? a[(NR+1)/2] : (a[NR/2]+a[NR/2+1])/2), "s"}'</code></pre>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Sau thay đổi của bạn, CI từ 60 s xuống 50 s. Thay đổi có tác dụng không?</strong><br>Đ: Nhìn một lần chạy thì tôi không kết luận được. Cùng một commit trên loại workflow này dao động từ 37 tới 77 giây. Tôi sẽ chạy cả hai phiên bản ít nhất năm lần, theo cặp, so trung vị, và nhìn đúng cái bước mà thay đổi của tôi chạm vào.</p>
<p><strong>H: Vì sao các lần chạy của cùng một commit trên runner của GitHub lại mất thời gian khác nhau?</strong><br>Đ: Các cỗ máy khác nhau dưới cùng một nhãn (tôi đã thấy ba dòng CPU), thời gian khởi động và dọn máy thay đổi, và các bước phụ thuộc mạng như khôi phục cache và cài gói. Xếp hàng thường chỉ vài giây.</p>
<p><strong>H: Bạn sẽ cảnh báo "CI chậm đi" thế nào?</strong><br>Đ: Không đặt ngưỡng cứng trên một lần chạy. So trung vị trượt của các lần gần đây với một trung vị nền, hoặc theo dõi đúng một bước, và chỉ cảnh báo khi chênh lệch vượt vài độ lệch chuẩn.</p>
</div>

<h3>Phương sai tới từ đâu</h3>
<div class="kv-grid">
<div class="kv"><span class="k">cỗ máy</span><span class="v">mỗi job được một runner khác nhau (bài 2.1), và chúng không phải phần cứng giống hệt hay chịu tải giống hệt. Đây là nguồn lớn nhất và nó KHÔNG kiểm soát được</span></div>
<div class="kv"><span class="k">mạng</span><span class="v">mọi job đều checkout, tải phụ thuộc, và thường là phục hồi cache. Cả ba đều bị mạng chặn cổ, và mô hình hoà vốn của Chương 5 được nêu dưới dạng một KHOẢNG đúng vì lý do này</span></div>
<div class="kv"><span class="k">trạng thái cache</span><span class="v">một lần chạy TRƯỢT ở chỗ lần trước TRÚNG thì chậm hơn vì một lý do có thật nhưng không phải một cú thoái lui. Cái lần 100 giây lạc loài kia là hình dạng của một lần chạy mà mọi thứ đều thuận</span></div>
<div class="kv"><span class="k">KHÔNG phải hàng đợi</span><span class="v">đo ở bài 2.1 là 2–3 giây. Xếp hàng không phải thứ làm các lần chạy chênh nhau; chính CÔNG VIỆC mới là thứ đó</span></div>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Cùng một khối việc trên workflow này trải từ 100 tới 160 giây, nên mọi lời tuyên bố về một khoản tiết kiệm nhỏ hơn nửa phút đều cần vài lần chạy hoặc một phép đo ở mức bước — và cái lần chạy nhanh nhất bạn từng thấy thì KHÔNG do bất cứ việc gì bạn làm gây ra.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trước khi hứa với nhóm rằng một phép tối ưu "tiết kiệm 10 giây", bạn cần biết CI của mình nhiễu tới mức nào.</p><ol>
<li>Chọn một workflow có <code>workflow_dispatch:</code> (chưa có thì thêm). Thêm một bước in <code>nproc</code> và dòng CPU.</li>
<li>Chạy nó 10 lần trên cùng một commit: <code>for i in $(seq 10); do gh workflow run &lt;tệp&gt; --ref &lt;nhánh&gt;; sleep 15; done</code>.</li>
<li>Khi tất cả đã xong, lấy thời gian đồng hồ bằng <code>gh api …/runs/&lt;id&gt;/timing</code> và thời gian từng bước bằng <code>gh api …/runs/&lt;id&gt;/jobs</code>.</li>
<li>Lập bảng: min / trung vị / max cho cả lần chạy và cho ba bước lớn nhất. Ghi dòng CPU của từng lần.</li>
<li>Với lần chạy chậm nhất, tìm xem phần thời gian thừa nằm ở đâu: trước bước đầu, trong một bước, hay sau bước cuối.</li></ol>
<p><strong>Đạt khi:</strong> bạn nói được trung vị và độ trải của workflow, chỉ ra bước có độ trải lớn nhất, giải thích lần chạy chậm nhất trong một câu, và nói được một khoản tiết kiệm phải lớn cỡ nào thì một lần chạy mới thấy được nó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Variance / spread (phương sai / độ trải)</span><span class="v">Các lần đo lặp lại của cùng một thứ chênh nhau bao nhiêu. Ở đây: max/min và độ lệch chuẩn.</span></div>
  <div class="kv"><span class="k">Median (trung vị)</span><span class="v">Giá trị ở giữa khi đã sắp xếp. Không bị một hai giá trị lạc loài kéo đi, khác với trung bình.</span></div>
  <div class="kv"><span class="k">Outlier (giá trị lạc loài)</span><span class="v">Một lần chạy khác xa phần còn lại — thường do khởi động máy, dọn máy hay tải xuống chậm, không do mã của bạn.</span></div>
  <div class="kv"><span class="k">Paired runs (chạy theo cặp)</span><span class="v">Khởi động bản trước và bản sau cùng lúc để chúng chung điều kiện.</span></div>
  <div class="kv"><span class="k">Step-level timing (thời gian mức bước)</span><span class="v">Thời lượng của một bước lấy từ API jobs; ít nhiễu hơn hẳn cả lần chạy.</span></div>
  <div class="kv"><span class="k">Runner image vs máy</span><span class="v">Nhãn (<code>ubuntu-24.04</code>) cố định phần mềm; phần cứng bên dưới thì thay đổi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cùng một commit chạy 14 lần mất 37–77 s (trung vị 50,5 s, 2,08×) trên sân tập; CI của chính kho này trải 100–160 s.</li>
<li>Ba lần chậm nhất chậm vì ba lý do chẳng liên quan: khởi động máy, dọn máy sau job, và tải cache chậm.</li>
<li>Runner cùng một nhãn dùng ba dòng CPU khác nhau; một bước thuần CPU dao động 9,5–14,2 s vì thế.</li>
<li>Xếp hàng ổn định (3–4 s) và không phải nguồn của phương sai.</li>
<li>Đo theo cặp, so trung vị, và đo đúng bước mà thay đổi chạm vào khi khoản tiết kiệm nhỏ.</li>
<li>Thời lượng là tín hiệu phân loại: ngắn hơn nhiều là bỏ cuộc sớm, dài hơn nhiều là treo hoặc thử lại.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — list workflow runs</span><span class="lc-sub">docs.github.com/en/rest/actions/workflow-runs — <code>run_started_at</code> và <code>updated_at</code> theo từng lần chạy, đó là cách các phân bố mười-lần bên trên được thu thập. Mười lần chạy là hai lời gọi API.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images — cấu hình phần cứng</span><span class="lc-sub">github.com/actions/runner-images#available-images — bản cấu hình là một cái SÀN chứ không phải một bảo đảm rằng các cỗ máy giống hệt nhau, và đó là số hạng lớn nhất trong phương sai bên trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Viewing job execution time</span><span class="lc-sub">docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/viewing-job-execution-time — thời gian tính tiền so với thời gian đồng hồ trên giao diện, và khung xem theo từng bước mà bài này lập luận là chỗ bạn nên đo.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — đo một thay đổi khi cái nền cũng đang dịch chuyển</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cùng bài toán trên một máy chủ production: một cải thiện độ trễ nhỏ hơn biến thiên hằng ngày, và cách xác lập rằng nó có thật.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — EXPLAIN ANALYZE, và chuyện chạy nó nhiều hơn một lần</span><span class="lc-sub">/courses/postgresql/learn${REF} — vì sao một phép đo thời gian đơn lẻ là một MẪU, và kỷ luật tách lạnh khỏi ấm trước khi so bất cứ thứ gì.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — Every speed-up this course measured, ranked|||7.4 — Mọi phép tăng tốc khoá này đã đo, xếp hạng',
      slug: 'ga-7-4-xep-hang',
      type: 'VIDEO',
      description: 'Gộp mọi số đo từ Chương 2 tới Chương 5 vào một bảng, rồi áp lên đường tới hạn thật. Kết quả: phép tối ưu tốt nhất KHÔNG đổi một dòng mã, và phép người ta hay thử đầu tiên tiết kiệm đúng KHÔNG giây.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Every speed-up this course measured, ranked</h2>
<p class="lead">Six chapters have produced numbers. This lesson puts all of them in one table, applies them to a real run&#39;s critical path, and reports what each one is actually worth in wall-clock.</p>

<h3>The table</h3>
${slide('ga-07', 22, 'Bảng xếp hạng: phép tăng tốc nào rơi TRÊN đường tới hạn')}
<div class="out">phep                                     giay   cong        ghi chu
-------------------------------------------------------------------------------
go job kiem ra khoi chuoi needs:           72   co cau truc  khong doi ma
bo qua buoc theo dieu kien (if:)           24   trung binh   0s khi bi bo qua
cache: npm (da co san)                   12,6   mot dong     NGOAI duong toi han
cache node_modules them                   4,1   mot khoi     tru 1,5-6,1s truyen
fetch-depth 1 -> filter=blob:none         -1,0  mot dong     CHAM hon, nhung co lich su</div>

<div class="callout warn">
<p><strong>Only the first two are on the critical path of the run that was measured.</strong> Applying both takes 543 seconds to 471 — a <strong>13%</strong> improvement, achieved by moving one <code>needs:</code> edge and keeping a condition that already exists. The other three rows are real savings that arrive in jobs with slack, and therefore arrive as nothing.</p>
</div>

<h3>The comparison that makes the point</h3>
<div class="out">toi uu ban dung Linux  (241s): giam 50%  ->  tiet kiem  0s dong ho
toi uu ban dung macOS  (437s): giam 20%  ->  tiet kiem 87s dong ho</div>

<div class="callout">
<p><strong>A 50% win on one job and a 20% win on another, and the smaller one is worth 87 seconds while the larger is worth none.</strong> Which job you optimise matters more than how well you optimise it — and the Linux job is the one whose log a developer is most likely to have open, because it is the one that runs on the platform they use.</p>
</div>

<h3>The order to work in</h3>
${slide('ga-07', 24, 'Thứ tự làm việc khi ai đó nói "CI chậm quá"')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">0 — read the per-job timings first</span><span class="lz-lnote">two API calls, or the run page. Establishes the critical path before any change is considered. Skipping this step is what produces the 50%-for-nothing outcome above</span></div>
<div class="lz-layer"><span class="lz-lname">1 — remove <code>needs:</code> edges that are not data dependencies</span><span class="lz-lnote">the largest measured win here, at 72 seconds, and it costs no machine-seconds. Test: would the downstream job still be <em>correct</em> if the upstream one failed? If yes, the edge is preference</span></div>
<div class="lz-layer"><span class="lz-lname">2 — attack the slowest job <em>on the path</em></span><span class="lz-lnote">the macOS build at 437 seconds. Chapter 2 says where its time goes: 315 s building, 72 s installing, 27 s uploading. Each is a different fix</span></div>
<div class="lz-layer"><span class="lz-lname">3 — then the cheap one-liners</span><span class="lz-lnote"><code>cache:</code>, conditional steps, <code>fetch-depth</code>. Real, small, and worth doing once the structure is right — but never the first move, because you cannot tell whether they landed on the path</span></div>
<div class="lz-layer"><span class="lz-lname">4 — measure again, several runs</span><span class="lz-lnote">7.3: this workflow spans 100–160 seconds unchanged. Anything under thirty seconds needs a distribution, not a run</span></div>
</div>

<div class="callout warn">
<p><strong>Correction to two rows of the table above (September 2026).</strong> The <code>node_modules</code> row says "4.1 s, minus 1.5–6.1 s of transfer" and the list below calls its sign unknown. Chapter 5 has since measured it on a GitHub runner: restoring a 209 MB <code>node_modules</code> and skipping <code>npm ci</code> took 3.6 s against 17.5 s without cache — a saving of about <strong>13.9 s per job</strong>, clearly positive. And the <code>cache: npm</code> row&#39;s 12.6 s was a local-machine number; on the runner it is about 3.8 s. Neither correction changes this lesson&#39;s conclusion: both savings land inside jobs that, in the measured release run, are either off the critical path or dwarfed by the build.</p>
</div>

<h3>Measured: splitting one job into three parallel jobs</h3>
${slide('ga-07', 21, 'Tách ba việc ra ba job: đồng hồ −13%, máy-giây ×2')}
<p>"Run things in parallel" is the other reflex, and it has a price that is easy to miss. The sandbox runs the same three tasks — type-check, a CPU-bound test suite, build — two ways:</p>
<ul>
<li><code>ch07-phuong-sai.yml</code>: <strong>one job</strong> doing checkout → <code>setup-node</code> → <code>npm ci</code> → check → test → build, in sequence. 14 runs.</li>
<li><code>ch07-tach-job.yml</code>: a matrix of <strong>three jobs</strong>, one per task. Each job does its own checkout, <code>setup-node</code> and <code>npm ci</code>, then one task. 5 runs, started in pairs with the single-job version.</li>
</ul>
<table>
<thead><tr><th></th><th>one job, sequential</th><th>three jobs, parallel</th></tr></thead>
<tbody>
<tr><td>wall-clock (median)</td><td>50.5 s</td><td><strong>44 s</strong> (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009578382" target="_blank" rel="noopener">45</a> · <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012332612" target="_blank" rel="noopener">37</a> · <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012449538" target="_blank" rel="noopener">59</a> · <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012595590" target="_blank" rel="noopener">44</a> · <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012717191" target="_blank" rel="noopener">39</a>)</td></tr>
<tr><td>machine-seconds (median)</td><td>44</td><td><strong>86</strong> — nearly double</td></tr>
<tr><td>longest leg</td><td>—</td><td>test: ~15 s install + 13 s tests + overhead ≈ 31–53 s</td></tr>
</tbody>
</table>
<p>Wall-clock fell by 6.5 seconds (13%) and machine-seconds doubled. The reason is visible in the step timings: every new job pays checkout, <code>setup-node</code> and a 15-second <code>npm ci</code> again. The tasks themselves were 3, 13 and 3 seconds; the longest leg is "install + test", and it is not much shorter than the whole sequential job.</p>
<div class="callout">
<p><strong>The rule this measures.</strong> Parallelising pays when each piece of work you split off is much larger than the fixed cost every job repeats (runner start, checkout, dependency install). A 10-minute test suite split into four 2.5-minute shards is a real win. A 3-second type-check moved into its own job mostly buys you another 20 seconds of set-up — which on a private repository is also on the bill.</p>
</div>

<h3>Amdahl&#39;s law, with this chapter&#39;s numbers</h3>
<p>Amdahl&#39;s law says: if a part of the work takes fraction <em>p</em> of the total and you make that part <em>s</em> times faster, the whole becomes <code>1 / ((1 − p) + p / s)</code> times faster. Applied to the release run:</p>
<table>
<thead><tr><th>Part you speed up</th><th>Its share of the critical path (p)</th><th>Made 2× faster</th><th>Whole run</th></tr></thead>
<tbody>
<tr><td>macOS build (on the path)</td><td>437 / 543 = 0.80</td><td>437 → 219 s</td><td>543 → <strong>429 s (1.27×)</strong>, not 325 s — Windows (323 s) takes over the path</td></tr>
<tr><td>check job (on the path)</td><td>72 / 543 = 0.13</td><td>72 → 36 s</td><td>543 → 507 s (1.07×)</td></tr>
<tr><td>Linux build (off the path)</td><td>0</td><td>241 → 121 s</td><td>543 → 543 s (1.00×)</td></tr>
</tbody>
</table>
<p>The law is usually quoted for CPUs; for pipelines the only adjustment is that the "whole" is the critical path, not the sum of all jobs. A job off the path has a share of zero, whatever its size. And the first row shows the second adjustment: the formula predicts 1.67×, but once macOS drops below Windows&#39; 323 s, Windows becomes the critical path and the run only reaches 429 s. <strong>Every speed-up on the path can move the path.</strong> After each change, recompute it.</p>

<h3>The structural levers, beyond <code>needs:</code></h3>
<table>
<thead><tr><th>Lever</th><th>What it does</th><th>When it pays</th><th>What it costs</th></tr></thead>
<tbody>
<tr><td><code>paths:</code> / <code>paths-ignore:</code> filters</td><td>the workflow does not run at all</td><td>docs-only or unrelated commits — the biggest saving is the run that never starts</td><td>a commit can slip through with no check (Chapter 1: 73.5% of this repository&#39;s commits trigger nothing)</td></tr>
<tr><td>job-level <code>if:</code></td><td>skip one job for some events</td><td>deploy only on <code>main</code>, heavy tests only on PRs to <code>main</code></td><td>logic in YAML that must be tested itself</td></tr>
<tr><td>test sharding (matrix over shards)</td><td>split a long test suite across N jobs</td><td>suites of several minutes or more</td><td>N × set-up cost in machine-seconds</td></tr>
<tr><td>move platform-independent work off the matrix</td><td>lint/type-check once, not once per OS</td><td>any multi-OS matrix (Chapter 2)</td><td>nothing — pure saving</td></tr>
<tr><td>larger runner</td><td>more cores / memory for the slowest job</td><td>a CPU-bound job on the critical path</td><td>not free even on public repositories (see 7.5)</td></tr>
<tr><td><code>concurrency</code> + <code>cancel-in-progress</code></td><td>stop spending on superseded commits</td><td>PR checks with frequent pushes</td><td>must not be used on deploys (7.2)</td></tr>
</tbody>
</table>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: Would you split the CI into more parallel jobs to make it faster?</strong><br>A: Only if the work I split off is much larger than the per-job overhead. On a small project I measured splitting three tasks into three jobs: wall-clock fell 13% but machine time doubled, because each job repeated a 15-second install. For a long test suite, sharding is worth it.</p>
<p><strong>Q: You have a list of possible CI optimisations. How do you prioritise them?</strong><br>A: By wall-clock saved on the critical path, multiplied by how often the workflow runs and whether a person waits for it. Structural changes like removing a <code>needs:</code> edge or a <code>paths:</code> filter usually come first because they cost nothing; cache tuning comes later.</p>
</div>

<h3>The speed-ups this course found and did not recommend</h3>
<div class="kv-grid">
<div class="kv"><span class="k">shallow clone</span><span class="v">4.3: the default already is shallow, and full history costs 1.9 seconds here. The <em>reverse</em> change — taking full history via a partial clone — costs one second and enables the changed-files pattern</span></div>
<div class="kv"><span class="k">caching <code>node_modules</code></span><span class="v">5.5: saves 4.1 seconds of compute, costs 1.5–6.1 of transfer. An optimisation whose sign is unknown is not an optimisation</span></div>
<div class="kv"><span class="k">a lint job everything depends on</span><span class="v">7.1: the single most expensive structural choice measured, at 72 seconds on every run — and it is usually added <em>for</em> speed, on the reasoning that failing fast saves the build</span></div>
<div class="kv"><span class="k"><code>fail-fast: true</code></span><span class="v">2.5: saves machine-seconds in the failing run and spends 564 more in the retry. A speed-up that is slower</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — optimising a workflow that is not the slow one.</strong> This chapter has spent five lessons on the release workflow because it has the interesting structure. But it runs on demand, a few times a week, and nobody waits for it. <code>ci-lint.yml</code> runs on every push and every PR — 526 times — and takes 141 seconds. A ten-second improvement there is worth more developer-minutes per month than a two-minute improvement on the release. Frequency belongs in the ranking, and it is not in any of the tables above.</p>
</div>

<h3>What the frequency-weighted ranking looks like</h3>
${slide('ga-07', 23, 'Nhân với tần suất: workflow chạy nhiều mới là workflow đắt')}
<div class="out">workflow             lan chay   thoi luong TB   tong may-phut (uoc luong)
--------------------------------------------------------------------------
ci-lint                  526          141 s        ~1.236 phut
desktop-release           85          458 s          ~649 phut
vps-cleanup-weekly        12            ?               —
tong ca kho            2.343              —               —</div>

<div class="callout ok">
<p><strong>The lint workflow has run six times as often and consumed roughly twice the total time.</strong> So the honest ranking for this repository is: <code>ci-lint</code> first by volume, release second by structure. And the lint workflow&#39;s structure is already right — two independent jobs, no <code>needs:</code>, so its critical path is its slowest job. There is no restructuring win available there, which is exactly why the interesting lessons came from the other one.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> Ranked by measured wall-clock effect, the best speed-up available on this run is deleting a dependency edge, the worst is a cache that may cost more than it saves — and neither ranking survives contact with the question of how often the workflow actually runs.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you have a list of five proposed speed-ups for your CI and time to do two. Rank them with numbers.</p><ol>
<li>For your busiest workflow, get the critical path of three recent runs (7.1&#39;s script) and the run count for the last 30 days: <code>gh run list --workflow &lt;file&gt; --created "&gt;=$(date -v-30d +%F)" --limit 500 --json databaseId --jq length</code> (on Linux use <code>date -d '30 days ago' +%F</code>).</li>
<li>Write down five candidate changes (a cache, a removed <code>needs:</code>, a <code>paths:</code> filter, a split job, a skipped step).</li>
<li>For each, estimate: seconds saved <em>on the critical path</em>, extra machine-seconds, and whether someone waits for this workflow.</li>
<li>Score each: saved seconds × runs per month (× 0 if nobody waits). Sort.</li>
<li>Implement the top one and measure it with paired runs (5 each side).</li></ol>
<p><strong>Done when:</strong> you have a sorted table of five changes with the three numbers each, one implemented change, and a before/after median — plus one sentence on whether the measured saving matched your estimate.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Amdahl&#39;s law</span><span class="v">Speeding up a part helps the whole only in proportion to that part&#39;s share. Off the critical path, the share is zero.</span></div>
  <div class="kv"><span class="k">Per-job overhead</span><span class="v">What every job pays before useful work: runner start, checkout, tool set-up, dependency install.</span></div>
  <div class="kv"><span class="k">Sharding</span><span class="v">Splitting one test suite across several parallel jobs.</span></div>
  <div class="kv"><span class="k">Frequency weighting</span><span class="v">Multiplying a saving by how often the workflow runs; a small saving on a frequent workflow can beat a big one on a rare workflow.</span></div>
  <div class="kv"><span class="k">Structural change</span><span class="v">Changing the graph (edges, filters, conditions) rather than making a step faster. Usually cheaper.</span></div>
  <div class="kv"><span class="k"><code>paths:</code> filter</span><span class="v">Trigger condition that skips the whole workflow when no matching file changed.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Rank speed-ups by wall-clock saved <em>on the critical path</em>; the Linux build −50% is worth 0 s, the macOS build −20% about 87 s.</li>
<li>Removing a <code>needs:</code> edge that is not a real dependency is the best measured change: 72 s in the release run, 29 s (23%) on the sandbox.</li>
<li>Splitting three small tasks into three jobs cut wall-clock 13% and doubled machine-seconds, because each job repeats a 15 s install.</li>
<li>Chapter 5&#39;s runner measurements update this lesson&#39;s cache rows: <code>cache: npm</code> ≈ 3.8 s, cached <code>node_modules</code> ≈ 13.9 s per job.</li>
<li>Weight by frequency and by whether anyone waits: <code>ci-lint</code> (526 runs) matters more than the release (85 runs).</li>
<li>Order of work: measure → find the path → remove edges → attack the slowest job on the path → then caches and splits.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Usage limits, billing, and administration</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/usage-limits-billing-and-administration — concurrency limits per account, the 6-hour job ceiling, and the 35-day workflow-run retention that bounds how much history you can measure.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — workflow run timing</span><span class="lc-sub">docs.github.com/en/rest/actions/workflow-runs#get-workflow-run-usage — <code>run_duration_ms</code> and per-platform billable milliseconds in one call, which is the cheapest way to build the frequency table above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Amdahl&#39;s law</span><span class="lc-sub">en.wikipedia.org/wiki/Amdahl%27s_law — the formal version of the argument in this lesson: speeding up a component bounds the whole-system gain by that component&#39;s share, and a component off the critical path has a share of zero.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — the index that made one query fast and the app no faster</span><span class="lc-sub">/courses/postgresql/learn${REF} — the same lesson in a database: optimising a query that was not the bottleneck, measured before and after.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — build in parallel at home, swap on the server</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — a restructuring win rather than an optimisation one: the same work, moved to where it can run concurrently, measured at roughly 3× faster.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Mọi phép tăng tốc khoá này đã đo, xếp hạng</h2>
<p class="lead">Sáu chương đã đẻ ra những con số. Bài này gom hết vào một bảng, áp chúng lên đường tới hạn của một lần chạy thật, rồi báo cáo mỗi cái THẬT SỰ đáng bao nhiêu tính theo thời gian đồng hồ.</p>

<h3>Cái bảng</h3>
${slide('ga-07', 22, 'Bảng xếp hạng: phép tăng tốc nào rơi TRÊN đường tới hạn')}
<div class="out">phep                                     giay   cong        ghi chu
-------------------------------------------------------------------------------
go job kiem ra khoi chuoi needs:           72   co cau truc  khong doi ma
bo qua buoc theo dieu kien (if:)           24   trung binh   0s khi bi bo qua
cache: npm (da co san)                   12,6   mot dong     NGOAI duong toi han
cache node_modules them                   4,1   mot khoi     tru 1,5-6,1s truyen
fetch-depth 1 -> filter=blob:none         -1,0  mot dong     CHAM hon, nhung co lich su</div>

<div class="callout warn">
<p><strong>Chỉ hai hàng đầu nằm TRÊN đường tới hạn của lần chạy đã đo.</strong> Áp cả hai thì đưa 543 giây xuống 471 — cải thiện <strong>13%</strong>, đạt được bằng cách dời MỘT cạnh <code>needs:</code> và giữ một điều kiện vốn đã có sẵn. Ba hàng còn lại là những khoản tiết kiệm CÓ THẬT nhưng rơi vào những job đang có độ chùng, và do đó rơi vào con số không.</p>
</div>

<h3>Phép so sánh làm rõ luận điểm</h3>
<div class="out">toi uu ban dung Linux  (241s): giam 50%  ->  tiet kiem  0s dong ho
toi uu ban dung macOS  (437s): giam 20%  ->  tiet kiem 87s dong ho</div>

<div class="callout">
<p><strong>Một thắng lợi 50% ở một job và 20% ở một job khác, và cái NHỎ hơn đáng 87 giây trong khi cái LỚN hơn đáng con số không.</strong> Bạn tối ưu JOB NÀO quan trọng hơn bạn tối ưu GIỎI tới đâu — và cái job Linux lại đúng là cái mà một lập trình viên nhiều khả năng đang mở log nhất, bởi nó chạy trên nền tảng họ đang dùng.</p>
</div>

<h3>Thứ tự nên làm việc</h3>
${slide('ga-07', 24, 'Thứ tự làm việc khi ai đó nói "CI chậm quá"')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">0 — ĐỌC nhịp thời gian từng job TRƯỚC</span><span class="lz-lnote">hai lời gọi API, hoặc trang lần chạy. Xác lập đường tới hạn trước khi cân nhắc bất kỳ thay đổi nào. Bỏ qua bước này chính là thứ đẻ ra kết cục 50%-đổi-lấy-không bên trên</span></div>
<div class="lz-layer"><span class="lz-lname">1 — gỡ những cạnh <code>needs:</code> KHÔNG phải phụ thuộc dữ liệu</span><span class="lz-lnote">thắng lợi đo được lớn nhất ở đây, 72 giây, và nó không tốn máy-giây nào. Phép thử: job phía sau có còn cho ra kết quả <em>ĐÚNG</em> không nếu job phía trước hỏng? Nếu có, cạnh ấy là sở thích</span></div>
<div class="lz-layer"><span class="lz-lname">2 — đánh vào job chậm nhất <em>TRÊN ĐƯỜNG</em></span><span class="lz-lnote">bản dựng macOS 437 giây. Chương 2 nói thời gian nó đi đâu: 315 s dựng, 72 s cài, 27 s tải lên. Mỗi cái là một cách vá khác nhau</span></div>
<div class="lz-layer"><span class="lz-lname">3 — rồi mới tới mấy dòng lẻ rẻ tiền</span><span class="lz-lnote"><code>cache:</code>, bước có điều kiện, <code>fetch-depth</code>. Có thật, nhỏ, và đáng làm một khi cấu trúc đã đúng — nhưng KHÔNG BAO GIỜ là nước đi đầu tiên, bởi bạn không biết được chúng có rơi trúng đường tới hạn hay không</span></div>
<div class="lz-layer"><span class="lz-lname">4 — đo lại, vài lần chạy</span><span class="lz-lnote">bài 7.3: workflow này trải 100–160 giây khi không đổi gì. Mọi thứ dưới ba mươi giây đều cần một PHÂN BỐ, không phải một lần chạy</span></div>
</div>

<div class="callout warn">
<p><strong>Đính chính hai hàng của bảng bên trên (09/2026).</strong> Hàng <code>node_modules</code> ghi "4,1 s, trừ 1,5–6,1 s truyền" và danh sách bên dưới gọi dấu của nó là "chưa biết". Chương 5 sau đó đã đo trên runner của GitHub: khôi phục <code>node_modules</code> 209 MB rồi bỏ qua <code>npm ci</code> mất 3,6 s so với 17,5 s khi không cache — tiết kiệm khoảng <strong>13,9 s mỗi job</strong>, dương rõ ràng. Còn 12,6 s của hàng <code>cache: npm</code> là số đo trên máy cục bộ; trên runner nó khoảng 3,8 s. Cả hai đính chính đều không đổi kết luận của bài: hai khoản tiết kiệm ấy rơi vào những job mà, ở lần chạy phát hành đã đo, hoặc nằm ngoài đường tới hạn, hoặc quá nhỏ so với bước dựng.</p>
</div>

<h3>Đo thật: tách một job thành ba job song song</h3>
${slide('ga-07', 21, 'Tách ba việc ra ba job: đồng hồ −13%, máy-giây ×2')}
<p>"Cho chạy song song" là phản xạ còn lại, và nó có một cái giá rất dễ bỏ sót. Sân tập chạy cùng ba việc — kiểm kiểu, một bộ test tốn CPU, dựng — theo hai cách:</p>
<ul>
<li><code>ch07-phuong-sai.yml</code>: <strong>MỘT job</strong> làm lần lượt checkout → <code>setup-node</code> → <code>npm ci</code> → kiểm → test → dựng. 14 lần chạy.</li>
<li><code>ch07-tach-job.yml</code>: ma trận <strong>BA job</strong>, mỗi việc một job. Job nào cũng tự checkout, <code>setup-node</code> và <code>npm ci</code>, rồi làm một việc. 5 lần chạy, khởi động theo cặp cùng bản một-job.</li>
</ul>
<table>
<thead><tr><th></th><th>một job, lần lượt</th><th>ba job, song song</th></tr></thead>
<tbody>
<tr><td>đồng hồ (trung vị)</td><td>50,5 s</td><td><strong>44 s</strong> (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009578382" target="_blank" rel="noopener">45</a> · <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012332612" target="_blank" rel="noopener">37</a> · <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012449538" target="_blank" rel="noopener">59</a> · <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012595590" target="_blank" rel="noopener">44</a> · <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36012717191" target="_blank" rel="noopener">39</a>)</td></tr>
<tr><td>máy-giây (trung vị)</td><td>44</td><td><strong>86</strong> — gần gấp đôi</td></tr>
<tr><td>nhánh dài nhất</td><td>—</td><td>test: ~15 s cài + 13 s test + chi phí cố định ≈ 31–53 s</td></tr>
</tbody>
</table>
<p>Thời gian đồng hồ giảm 6,5 giây (13%) còn máy-giây tăng gấp đôi. Lý do hiện rõ trong thời gian từng bước: mỗi job mới lại trả checkout, <code>setup-node</code> và một lượt <code>npm ci</code> 15 giây. Bản thân các việc chỉ 3, 13 và 3 giây; nhánh dài nhất là "cài + test", và nó chẳng ngắn hơn bao nhiêu so với cả job tuần tự.</p>
<div class="callout">
<p><strong>Quy tắc mà phép đo này cho thấy.</strong> Song song hoá chỉ có lãi khi mỗi phần việc bạn tách ra LỚN HƠN NHIỀU phần chi phí cố định mà job nào cũng lặp lại (khởi động máy, checkout, cài phụ thuộc). Một bộ test 10 phút chia thành bốn mảnh 2,5 phút là thắng lợi thật. Một lượt kiểm kiểu 3 giây dời sang job riêng thì chủ yếu mua thêm 20 giây dựng môi trường — mà ở kho riêng tư thì phần ấy cũng nằm trên hoá đơn.</p>
</div>

<h3>Định luật Amdahl, với số của chương này</h3>
<p>Định luật Amdahl nói: nếu một phần việc chiếm tỉ phần <em>p</em> của tổng và bạn làm phần ấy nhanh gấp <em>s</em> lần, thì toàn bộ nhanh lên <code>1 / ((1 − p) + p / s)</code> lần. Áp vào lần chạy phát hành:</p>
<table>
<thead><tr><th>Phần được tăng tốc</th><th>Tỉ phần trên đường tới hạn (p)</th><th>Nhanh gấp 2</th><th>Cả lần chạy</th></tr></thead>
<tbody>
<tr><td>bản dựng macOS (trên đường)</td><td>437 / 543 = 0,80</td><td>437 → 219 s</td><td>543 → <strong>429 s (1,27×)</strong>, không phải 325 s — Windows (323 s) chiếm lấy đường tới hạn</td></tr>
<tr><td>job kiểm (trên đường)</td><td>72 / 543 = 0,13</td><td>72 → 36 s</td><td>543 → 507 s (1,07×)</td></tr>
<tr><td>bản dựng Linux (ngoài đường)</td><td>0</td><td>241 → 121 s</td><td>543 → 543 s (1,00×)</td></tr>
</tbody>
</table>
<p>Định luật thường được nhắc cho CPU; với đường ống CI, điều chỉnh duy nhất là "toàn bộ" ở đây là ĐƯỜNG TỚI HẠN, không phải tổng mọi job. Một job ngoài đường có tỉ phần bằng không, dù nó to cỡ nào. Và hàng đầu tiên cho thấy điều chỉnh thứ hai: công thức dự đoán 1,67 lần, nhưng khi macOS xuống dưới 323 s của Windows thì Windows thành đường tới hạn và lần chạy chỉ xuống được 429 s. <strong>Mỗi phép tăng tốc trên đường đều có thể DỜI chính cái đường.</strong> Sau mỗi thay đổi, hãy tính lại.</p>

<h3>Các đòn bẩy cấu trúc, ngoài <code>needs:</code></h3>
<table>
<thead><tr><th>Đòn bẩy</th><th>Nó làm gì</th><th>Khi nào có lãi</th><th>Nó tốn gì</th></tr></thead>
<tbody>
<tr><td>Bộ lọc <code>paths:</code> / <code>paths-ignore:</code></td><td>workflow không chạy luôn</td><td>commit chỉ sửa tài liệu hay phần không liên quan — khoản tiết kiệm lớn nhất là lần chạy không bao giờ bắt đầu</td><td>một commit có thể lọt qua mà không được kiểm (Chương 1: 73,5% commit của kho này không kích hoạt gì)</td></tr>
<tr><td><code>if:</code> ở mức job</td><td>bỏ một job với một số sự kiện</td><td>chỉ deploy trên <code>main</code>, test nặng chỉ ở PR vào <code>main</code></td><td>logic trong YAML mà chính nó cũng cần được kiểm</td></tr>
<tr><td>Chia mảnh test (ma trận theo mảnh)</td><td>chia một bộ test dài cho N job</td><td>bộ test từ vài phút trở lên</td><td>N × chi phí dựng môi trường, tính bằng máy-giây</td></tr>
<tr><td>Dời việc không phụ thuộc nền tảng ra khỏi ma trận</td><td>lint/kiểm kiểu một lần, không phải mỗi OS một lần</td><td>mọi ma trận nhiều OS (Chương 2)</td><td>không gì cả — tiết kiệm thuần</td></tr>
<tr><td>Runner lớn hơn</td><td>thêm nhân / bộ nhớ cho job chậm nhất</td><td>một job nặng CPU nằm trên đường tới hạn</td><td>không miễn phí kể cả với kho công khai (xem 7.5)</td></tr>
<tr><td><code>concurrency</code> + <code>cancel-in-progress</code></td><td>thôi tiêu máy cho các commit đã bị vượt mặt</td><td>kiểm PR khi push dồn dập</td><td>không được dùng cho deploy (7.2)</td></tr>
</tbody>
</table>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Bạn có tách CI ra thêm nhiều job song song cho nhanh không?</strong><br>Đ: Chỉ khi phần việc tách ra lớn hơn nhiều chi phí cố định của mỗi job. Trên một dự án nhỏ tôi đã đo việc tách ba việc thành ba job: đồng hồ giảm 13% mà thời gian máy tăng gấp đôi, vì job nào cũng lặp lại lượt cài 15 giây. Với một bộ test dài thì chia mảnh là đáng.</p>
<p><strong>H: Bạn có một danh sách phép tối ưu CI. Bạn xếp ưu tiên thế nào?</strong><br>Đ: Theo số giây đồng hồ tiết kiệm được TRÊN đường tới hạn, nhân với tần suất chạy của workflow và việc có ai ngồi chờ nó không. Thay đổi cấu trúc như gỡ một cạnh <code>needs:</code> hay thêm bộ lọc <code>paths:</code> thường đứng đầu vì chúng không tốn gì; tinh chỉnh cache để sau.</p>
</div>

<h3>Những phép tăng tốc khoá này tìm ra và KHÔNG khuyến nghị</h3>
<div class="kv-grid">
<div class="kv"><span class="k">clone nông</span><span class="v">bài 4.3: mặc định vốn ĐÃ nông, và lịch sử đầy đủ tốn 1,9 giây ở đây. Thay đổi <em>NGƯỢC LẠI</em> — lấy trọn lịch sử bằng một bản clone từng phần — tốn một giây và mở ra được khuôn mẫu đếm-file-đã-đổi</span></div>
<div class="kv"><span class="k">cache <code>node_modules</code></span><span class="v">bài 5.5: tiết kiệm 4,1 giây tính toán, tốn 1,5–6,1 giây truyền. Một phép tối ưu mà DẤU của nó chưa biết thì không phải một phép tối ưu</span></div>
<div class="kv"><span class="k">một job lint mà mọi thứ phụ thuộc vào</span><span class="v">bài 7.1: lựa chọn cấu trúc đắt nhất đã đo được, 72 giây ở MỌI lần chạy — và nó thường được thêm vào <em>VÌ</em> tốc độ, với lý lẽ rằng hỏng sớm thì tiết kiệm được bản dựng</span></div>
<div class="kv"><span class="k"><code>fail-fast: true</code></span><span class="v">bài 2.5: tiết kiệm máy-giây trong lần chạy hỏng rồi tiêu thêm 564 giây ở lần chạy lại. Một phép tăng tốc mà CHẬM HƠN</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — tối ưu một workflow KHÔNG PHẢI cái chậm.</strong> Chương này đã dành năm bài cho workflow phát hành vì nó có cấu trúc thú vị. Nhưng nó chạy theo yêu cầu, vài lần một tuần, và không ai ngồi chờ nó. <code>ci-lint.yml</code> chạy ở mọi cú push và mọi PR — 526 lần — và mất 141 giây. Một cải thiện mười giây ở đó đáng nhiều phút-lập-trình-viên mỗi tháng hơn một cải thiện hai phút ở bản phát hành. TẦN SUẤT phải nằm trong bảng xếp hạng, và nó không có trong bất kỳ bảng nào bên trên.</p>
</div>

<h3>Bảng xếp hạng có trọng số theo tần suất trông ra sao</h3>
${slide('ga-07', 23, 'Nhân với tần suất: workflow chạy nhiều mới là workflow đắt')}
<div class="out">workflow             lan chay   thoi luong TB   tong may-phut (uoc luong)
--------------------------------------------------------------------------
ci-lint                  526          141 s        ~1.236 phut
desktop-release           85          458 s          ~649 phut
vps-cleanup-weekly        12            ?               —
tong ca kho            2.343              —               —</div>

<div class="callout ok">
<p><strong>Workflow lint đã chạy nhiều gấp sáu lần và ngốn khoảng gấp đôi tổng thời gian.</strong> Nên bảng xếp hạng trung thực cho kho này là: <code>ci-lint</code> đứng nhất theo KHỐI LƯỢNG, bản phát hành đứng nhì theo CẤU TRÚC. Và cấu trúc của workflow lint thì vốn đã đúng — hai job độc lập, không <code>needs:</code>, nên đường tới hạn của nó chính là job chậm nhất của nó. Ở đó không có thắng lợi tái-cấu-trúc nào để lấy, mà đó chính xác là lý do những bài học thú vị lại tới từ cái kia.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Xếp theo tác động đo được lên thời gian đồng hồ, phép tăng tốc tốt nhất có sẵn trên lần chạy này là XOÁ MỘT CẠNH PHỤ THUỘC, phép tệ nhất là một cái cache có thể tốn hơn nó tiết kiệm — và không bảng xếp hạng nào sống sót qua câu hỏi workflow ấy THẬT SỰ chạy bao nhiêu lần.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn có danh sách năm đề xuất tăng tốc CI và chỉ đủ thời gian làm hai. Xếp hạng chúng bằng số.</p><ol>
<li>Với workflow bận rộn nhất của bạn, lấy đường tới hạn của ba lần chạy gần đây (script ở bài 7.1) và số lần chạy trong 30 ngày qua: <code>gh run list --workflow &lt;tệp&gt; --created "&gt;=$(date -v-30d +%F)" --limit 500 --json databaseId --jq length</code> (trên Linux dùng <code>date -d '30 days ago' +%F</code>).</li>
<li>Viết ra năm thay đổi ứng viên (một cache, một <code>needs:</code> bị gỡ, một bộ lọc <code>paths:</code>, một job được tách, một bước được bỏ qua).</li>
<li>Với mỗi cái, ước lượng: số giây tiết kiệm <em>trên đường tới hạn</em>, máy-giây tăng thêm, và có ai ngồi chờ workflow này không.</li>
<li>Chấm điểm: giây tiết kiệm × số lần chạy mỗi tháng (× 0 nếu không ai chờ). Sắp xếp.</li>
<li>Làm cái đứng đầu và đo bằng các lần chạy theo cặp (mỗi bên 5 lần).</li></ol>
<p><strong>Đạt khi:</strong> bạn có bảng đã sắp xếp năm thay đổi với ba con số mỗi dòng, một thay đổi đã làm, và trung vị trước/sau — cộng một câu nói khoản tiết kiệm đo được có khớp với ước lượng không.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Amdahl&#39;s law (định luật Amdahl)</span><span class="v">Tăng tốc một phần chỉ giúp toàn bộ theo đúng tỉ phần của phần ấy. Ngoài đường tới hạn, tỉ phần bằng không.</span></div>
  <div class="kv"><span class="k">Per-job overhead (chi phí cố định mỗi job)</span><span class="v">Thứ job nào cũng trả trước khi làm việc thật: khởi động máy, checkout, dựng công cụ, cài phụ thuộc.</span></div>
  <div class="kv"><span class="k">Sharding (chia mảnh)</span><span class="v">Chia một bộ test cho nhiều job song song.</span></div>
  <div class="kv"><span class="k">Frequency weighting (trọng số tần suất)</span><span class="v">Nhân một khoản tiết kiệm với số lần workflow chạy; khoản nhỏ trên workflow chạy nhiều có thể thắng khoản lớn trên workflow hiếm chạy.</span></div>
  <div class="kv"><span class="k">Structural change (thay đổi cấu trúc)</span><span class="v">Đổi đồ thị (cạnh, bộ lọc, điều kiện) thay vì làm một bước nhanh hơn. Thường rẻ hơn.</span></div>
  <div class="kv"><span class="k">Bộ lọc <code>paths:</code></span><span class="v">Điều kiện kích hoạt bỏ qua cả workflow khi không tệp khớp nào thay đổi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Xếp hạng phép tăng tốc theo giây đồng hồ tiết kiệm <em>trên đường tới hạn</em>; dựng Linux −50% đáng 0 s, dựng macOS −20% đáng khoảng 87 s.</li>
<li>Gỡ một cạnh <code>needs:</code> không phải phụ thuộc thật là thay đổi tốt nhất đã đo: 72 s ở lần chạy phát hành, 29 s (23%) trên sân tập.</li>
<li>Tách ba việc nhỏ thành ba job cắt 13% đồng hồ và nhân đôi máy-giây, vì job nào cũng lặp lại lượt cài 15 s.</li>
<li>Số đo trên runner của Chương 5 cập nhật các hàng cache của bài: <code>cache: npm</code> ≈ 3,8 s, cache <code>node_modules</code> ≈ 13,9 s mỗi job.</li>
<li>Nhân trọng số tần suất và việc có ai chờ: <code>ci-lint</code> (526 lần) quan trọng hơn bản phát hành (85 lần).</li>
<li>Thứ tự làm: đo → tìm đường → gỡ cạnh → đánh vào job chậm nhất trên đường → rồi mới cache và tách job.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Usage limits, billing, and administration</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/usage-limits-billing-and-administration — giới hạn đồng thời theo tài khoản, trần 6 tiếng cho một job, và thời hạn giữ 35 ngày của lần chạy, thứ đặt biên cho lượng lịch sử bạn đo được.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — workflow run timing</span><span class="lc-sub">docs.github.com/en/rest/actions/workflow-runs#get-workflow-run-usage — <code>run_duration_ms</code> và số mili giây tính tiền theo từng nền tảng trong một lời gọi, cách rẻ nhất để dựng cái bảng tần suất bên trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Định luật Amdahl</span><span class="lc-sub">en.wikipedia.org/wiki/Amdahl%27s_law — bản hình thức của lập luận trong bài này: tăng tốc một thành phần thì lợi ích toàn hệ bị chặn bởi TỈ PHẦN của thành phần ấy, và một thành phần nằm ngoài đường tới hạn có tỉ phần bằng không.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — cái index làm một truy vấn nhanh lên mà ứng dụng thì không</span><span class="lc-sub">/courses/postgresql/learn${REF} — cùng bài học ấy trong một cơ sở dữ liệu: tối ưu một truy vấn vốn không phải chỗ nghẽn, đo trước và sau.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — dựng song song ở nhà, tráo trên máy chủ</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — một thắng lợi TÁI CẤU TRÚC chứ không phải tối ưu: cùng khối việc, dời tới chỗ nó chạy song song được, đo ra nhanh gấp khoảng 3 lần.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 7.5 ─────────────────────────── */
    {
      title: '7.5 — What CI costs, and what it is worth|||7.5 — CI tốn gì, và nó đáng gì',
      slug: 'ga-7-5-gia-tri',
      type: 'VIDEO',
      description: 'Kho này công khai nên CI miễn phí — billable 0ms. Tính ngược lại nếu nó riêng tư: 11.130 phút tính tiền, trong đó 8.500 là của MỘT workflow chạy 85 lần. Và ở phía kia của cán cân là một cú hỏng mà chỉ CI thấy được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>What CI costs, and what it is worth</h2>
<p class="lead">Speed is one axis and money is another, and this repository sits at an unusual point on both: it pays nothing, because it is public. That makes it a good place to compute the counterfactual honestly, and then to ask the harder question underneath.</p>

<h3>What it actually costs</h3>
${slide('ga-07', 25, 'Giá mỗi phút (09/2026): macOS đắt gấp ~10 lần Linux')}
<div class="out">billable: MACOS 0ms · UBUNTU 0ms · WINDOWS 0ms</div>

<p>Zero. Public repositories get GitHub-hosted standard runners free, with no minute allowance and no overage. Every timing in this course was measured on infrastructure that cost nothing.</p>

<h3>The counterfactual, computed from the same measurements</h3>
${slide('ga-07', 26, 'Nếu kho riêng tư: 76% tiền nằm ở workflow phát hành')}
<div class="out">neu la kho RIENG TU:

  ci-lint            526 lan  x    5 phut-tinh-tien  =   2.630 phut
  desktop-release     85 lan  x  100 phut-tinh-tien  =   8.500 phut
  ------------------------------------------------------------------
  TONG                                                  11.130 phut</div>

<div class="callout warn">
<p><strong>The release workflow is 16% of the runs and 76% of the bill.</strong> Chapter 2 explained why: one macOS leg, rounded up to the minute, at the 10× multiplier, is 80 billable minutes for a 437-second job. Everything else in that run together is 20. The most expensive thing this repository does, in a world where it paid, would be building for a platform that a minority of its users are on.</p>
</div>

<div class="callout">
<p><strong>Two honest caveats on that number.</strong> It is an estimate: it assumes every run took the average duration and applies per-job minute rounding, which is the documented model but not a bill anybody received. And it spans the whole history rather than a month, so it is not directly comparable to a monthly allowance. The shape — one workflow dominating — is robust to both.</p>
</div>

<div class="callout warn">
<p><strong>Update, September 2026: the "10× multiplier" is now a price table.</strong> GitHub&#39;s billing documentation no longer describes Windows and macOS minutes as "multiplied" Linux minutes; it lists a price per minute for each runner. Read on 24 September 2026: Linux 2-core <strong>$0.006</strong>, Windows 2-core <strong>$0.010</strong>, macOS 3- or 4-core <strong>$0.062</strong>. macOS is still about 10× Linux (10.3×), so the reasoning above holds; Windows is 1.7×, not 2×. Recomputed in dollars with per-job rounding, one release run is $0.496 of macOS + $0.060 of Windows + $0.048 of Linux = <strong>$0.604</strong>; 85 of them are $51.3 against $15.8 for 526 <code>ci-lint</code> runs — the release is still <strong>76%</strong> of the total, and the macOS leg alone is 82% of every release run. Free plans include 2,000 minutes a month for private repositories (Pro and Team 3,000).</p>
</div>

<h3>Computing a run&#39;s cost yourself</h3>
<p>The API has an endpoint for exactly this, and on a public repository it shows the free tier at work:</p>
<pre><code class="language-bash">gh api repos/cuonghoang1103/ga-san-tap/actions/runs/36009578496/timing</code></pre>
<div class="out">{"billable":{"UBUNTU":{"total_ms":0,"jobs":3,…},
             "WINDOWS":{"total_ms":0,"jobs":1,…},
             "MACOS":{"total_ms":0,"jobs":1,…}},
 "run_duration_ms":116000}</div>
<p>Billable is zero because the repository is public. To know what the same run <em>would</em> cost privately, apply the documented rule — each job rounded <strong>up</strong> to a whole minute, times its runner&#39;s price — to the per-job durations. For that sandbox run (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009578496" target="_blank" rel="noopener">36009578496</a>):</p>
<table>
<thead><tr><th>Job</th><th>Ran</th><th>Billed minutes</th><th>Price</th><th>Cost</th></tr></thead>
<tbody>
<tr><td>check (ubuntu)</td><td>34 s</td><td>1</td><td>$0.006</td><td>$0.006</td></tr>
<tr><td>build ubuntu</td><td>28 s</td><td>1</td><td>$0.006</td><td>$0.006</td></tr>
<tr><td>build windows</td><td>62 s</td><td>2</td><td>$0.010</td><td>$0.020</td></tr>
<tr><td>build macos</td><td>45 s</td><td>1</td><td>$0.062</td><td>$0.062</td></tr>
<tr><td>publish (ubuntu)</td><td>6 s</td><td>1</td><td>$0.006</td><td>$0.006</td></tr>
<tr><td><strong>total</strong></td><td><strong>175 s</strong></td><td><strong>6 min = 360 s</strong></td><td></td><td><strong>$0.100</strong></td></tr>
</tbody>
</table>
<div class="callout">
<p><strong>The rounding tax.</strong> 175 machine-seconds were billed as 360 — more than double — because five short jobs each round up to a full minute, and the Windows job at 62 s rounds up to two. This is the cost-side mirror of 7.4&#39;s parallelisation result: splitting work into many short jobs multiplies both the per-job set-up and the rounding. On a private repository, a job of a few seconds is never "almost free"; it is one minute.</p>
</div>

<h3>Where the money goes, and which levers move it</h3>
<table>
<thead><tr><th>Lever</th><th>Effect on the bill</th><th>Effect on safety</th></tr></thead>
<tbody>
<tr><td>fewer macOS legs (build macOS only on release, not on every PR)</td><td>largest: one macOS minute = ~10 Linux minutes</td><td>macOS-only bugs found later — decide per project</td></tr>
<tr><td><code>cancel-in-progress: true</code> on PR checks</td><td>superseded runs stop paying (7.2: 2 of 3 runs cancelled)</td><td>none for checks; never on deploys</td></tr>
<tr><td><code>paths:</code> filters</td><td>runs that never start cost nothing</td><td>commits outside the filter are unchecked</td></tr>
<tr><td>merge short jobs</td><td>less rounding: three 20 s jobs = 3 min, one 60 s job = 1 min</td><td>slower wall-clock; less isolation between tasks</td></tr>
<tr><td>artifact <code>retention-days</code></td><td>storage is billed separately (Free: 500 MB included)</td><td>older artifacts disappear sooner</td></tr>
<tr><td>self-hosted runner</td><td>no per-minute charge (September 2026)</td><td>you own patching and isolation; GitHub warns against them on public repositories</td></tr>
<tr><td>larger runner</td><td>more expensive per minute, and <em>not</em> free on public repositories</td><td>none; can cut wall-clock on a CPU-bound path</td></tr>
</tbody>
</table>

<h3>A metric worth tracking: minutes per merged PR</h3>
<p>Total minutes grows when the team grows, which is not a problem. Minutes per merged pull request grows when workflows get slower <em>or</em> when people re-run them more often — and re-runs usually mean flaky tests or unexplained red builds, which cost people more than they cost GitHub. Both inputs are one command away:</p>
<pre><code class="language-bash"># merged PRs in the last 30 days
gh pr list --state merged --search "merged:&gt;=$(date -v-30d +%F)" --limit 500 --json number --jq length
# runs that needed more than one attempt
gh run list --limit 200 --json databaseId,attempt --jq '[.[] | select(.attempt &gt; 1)] | length'</code></pre>
<p>If the second number is a noticeable fraction of the first, speeding up CI is the wrong project; making it trustworthy is the right one.</p>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: How is GitHub Actions billed?</strong><br>A: Standard GitHub-hosted runners are free on public repositories. On private repositories each plan includes minutes (2,000 a month on Free), then each job is billed per minute, rounded up, at a per-runner price — as of September 2026 about $0.006 for Linux, $0.010 for Windows and $0.062 for macOS. Storage for artifacts is separate. Self-hosted runners have no per-minute charge.</p>
<p><strong>Q: Our Actions bill doubled. Where do you look?</strong><br>A: The per-workflow usage breakdown, then per-job: macOS legs first because of the price, then many short jobs because of per-job rounding, then how many runs were superseded or re-run. Cancelling superseded PR runs and moving macOS builds to release-only are usually the biggest levers.</p>
<p><strong>Q: Someone wants to delete the slowest CI job to save money. What do you ask?</strong><br>A: What it caught last. If it has caught nothing in a year, deleting it is reasonable; if it caught a real failure recently — like a macOS-only out-of-memory build — its cost is the price of not shipping that failure.</p>
</div>

<h3>The cost that is not on any invoice</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">developer wait</span><span class="lz-lnote">141 seconds × 526 runs of <code>ci-lint</code> is about 20 hours of somebody watching a spinner — and that is the workflow that costs almost nothing in money. Wall-clock and money rank workflows differently, and 7.4 measured that they disagree here</span></div>
<div class="lz-layer"><span class="lz-lname">context switching</span><span class="lz-lnote">the real cost of a two-minute wait is rarely two minutes. It is the tab that gets opened while waiting. This is not measurable from an API and is the largest term in most people&#39;s experience of CI</span></div>
<div class="lz-layer"><span class="lz-lname">a red build that is not your fault</span><span class="lz-lnote">7.3 measured a 1.60× spread on identical work. Time spent investigating a slow run that was just a slow run is pure loss, and the defence is knowing the distribution</span></div>
<div class="lz-layer"><span class="lz-lname">maintenance</span><span class="lz-lnote">1,394 lines of YAML, nine duplicated SSH blocks (4.5), one dead cache (5.3), six actions whose runtime changed under an unedited file (4.2). CI is software, and it has the running costs of software</span></div>
</div>

<h3>The other side of the ledger</h3>
${slide('ga-07', 27, 'Phía bên kia cán cân: cú hỏng chỉ CI thấy')}
<p>Against all of that sits one measured event. Run <strong>32399243354</strong>: <code>vite build</code> exited 134 with <code>Reached heap limit</code> on the macOS leg. The developer&#39;s own machine had built the same commit green in twenty seconds.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">what CI caught</span><span class="lz-t">a build that only fails on a smaller machine</span><span class="lz-d">invisible locally, by construction — you cannot see a memory ceiling you are not near</span></div>
<div class="lz-step"><span class="lz-k">what it would have cost</span><span class="lz-t">a broken macOS installer, published</span><span class="lz-d">and auto-update means a broken release propagates to everyone who already had it</span></div>
<div class="lz-step"><span class="lz-k">what made it findable</span><span class="lz-t">a different machine, running the same commit</span><span class="lz-d">which is the entire mechanism of CI, stated in one line</span></div>
</div>

<div class="callout ok">
<p><strong>That is the value proposition with a number attached, and it is not a speed number.</strong> CI is not primarily a way to run tests faster; it is a way to run them <em>somewhere other than the machine that already agrees with you</em>. Everything else in this chapter — critical paths, caches, concurrency — is about making that cheap enough to keep doing.</p>
</div>

<h3>Where this repository&#39;s spending does not match its risk</h3>
<div class="out">bai 1.5 do: 147 / 200 commit gan nhat tren main KHONG chay CI nao (73,5%)
             trong do desktop/ chiem 297 file
cu hong 32399243354 nam TRON trong tap 147 commit ay</div>

<div class="callout warn">
<p><strong>The failure CI caught was in the directory CI does not check on push.</strong> It was caught at release time, by the release workflow, which is the expensive one. A cheap Linux-only build of <code>desktop/</code> on every push would have caught the same class of error earlier and for roughly nothing — Linux is 1× and the build there took 149 seconds against macOS&#39;s 315. That is the specific, measured, cost-effective change this chapter arrives at: not "spend less on CI", but "spend a small amount on the 73.5% that currently has none".</p>
</div>

<div class="kv-grid">
<div class="kv"><span class="k">the free tier is real</span><span class="v">public repositories pay nothing for standard runners. If cost is the reason a project has no CI, that reason does not apply to open source</span></div>
<div class="kv"><span class="k">private repositories: watch macOS</span><span class="v">the 10× multiplier plus per-job minute rounding means a short macOS job is disproportionately expensive. Hoisting platform-independent work off the matrix (2.3) is the single biggest lever</span></div>
<div class="kv"><span class="k">self-hosted changes the arithmetic</span><span class="v">no per-minute cost, and you own the machine, the patching and the isolation. It trades a metered cost for an unmetered one — worth it at volume, and a liability at low volume</span></div>
<div class="kv"><span class="k">the number to track</span><span class="v">not total minutes. Minutes-per-merged-PR, which goes up when workflows get slower <em>and</em> when they get re-run more often — and the second is usually the real problem</span></div>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> This repository&#39;s CI is free, would cost 11,130 billable minutes if it were not, and 76% of that would be one macOS matrix leg — while the failure that most justified having CI at all was in a directory that 73.5% of commits change without triggering anything.</p>
</div>

<div class="pitfall">
<p><strong>Trap — measuring CI by its invoice instead of by what it catches.</strong> Minutes are the visible number, so that is what gets optimised: caching aggressively, dropping the slowest job, running tests only on changed paths. Each saves money and each removes coverage, and the loss shows up months later as a bug that reached production through the path nobody checks any more. The comparison that matters is against the counterfactual — what one escaped defect costs in incident time, rollback, and the hour every engineer spends waiting on a broken main. Before cutting a job, find the last thing it caught. If it has never caught anything in a year, that is a real argument for deleting it; &quot;it is slow&quot; is not.</p>
</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your project might move to a private repository. Work out what its CI would cost before anyone is surprised by a bill.</p><ol>
<li>Pick your busiest workflow. Count its runs over the last 30 days with <code>gh run list --workflow &lt;file&gt; --limit 500 --json createdAt</code>.</li>
<li>Take one typical run and list its jobs with <code>gh api repos/OWNER/REPO/actions/runs/&lt;id&gt;/jobs --jq '.jobs[] | [.name, .started_at, .completed_at] | @tsv'</code>.</li>
<li>Round each job up to whole minutes and multiply by the runner price (Linux $0.006, Windows $0.010, macOS $0.062 per minute, as of September 2026).</li>
<li>Multiply by the monthly run count; compare with the included minutes of the Free plan (2,000).</li>
<li>Find the single change that would cut the estimate most, and the last failure that change would have hidden.</li></ol>
<p><strong>Done when:</strong> you have a per-run cost with the rounding shown, a monthly estimate, the share taken by the most expensive job, and one sentence weighing the biggest saving against what it would stop catching.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Billable minutes</span><span class="v">Minutes GitHub charges: per job, rounded up, at the runner&#39;s per-minute price. Zero for standard runners on public repositories.</span></div>
  <div class="kv"><span class="k">Included minutes</span><span class="v">The monthly allowance of a plan for private repositories (Free 2,000; Pro and Team 3,000).</span></div>
  <div class="kv"><span class="k">Per-job rounding</span><span class="v">Each job is billed in whole minutes; many short jobs pay far more than their machine-seconds.</span></div>
  <div class="kv"><span class="k">Larger runner</span><span class="v">A GitHub-hosted runner with more cores or memory; billed even on public repositories.</span></div>
  <div class="kv"><span class="k">Self-hosted runner</span><span class="v">Your own machine registered to run jobs; no per-minute charge, but you own security and maintenance.</span></div>
  <div class="kv"><span class="k"><code>/actions/runs/&lt;id&gt;/timing</code></span><span class="v">API endpoint returning billable milliseconds per platform and the run&#39;s duration.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Standard runners on a public repository cost nothing; the API shows <code>total_ms: 0</code> for every platform.</li>
<li>Prices as of September 2026: Linux $0.006, Windows $0.010, macOS $0.062 per minute; each job rounds up to a whole minute.</li>
<li>If this repository were private, the release workflow would be about 76% of the CI spend, and its macOS leg 82% of each release run.</li>
<li>Rounding is a real cost: a sandbox run of 175 machine-seconds is billed as 6 minutes.</li>
<li>CI&#39;s value is not speed: run 32399243354 caught a macOS-only out-of-memory build that the author&#39;s machine did not show.</li>
<li>Before cutting a job to save money, find the last thing it caught.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About billing for GitHub Actions</span><span class="lc-sub">docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions — the per-platform multipliers, per-job minute rounding, included allowances per plan, and the statement that public repositories are free.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Viewing your Actions usage</span><span class="lc-sub">docs.github.com/en/billing/managing-billing-for-github-actions/viewing-your-github-actions-usage — the per-workflow breakdown that turns the estimate above into a real figure for a private repository.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About self-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners — including the explicit warning against using them on public repositories, which is the security half of the arithmetic above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — building at home instead of on the server</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the same cost decision made in the other direction, with the measurement that justified it and the outage that followed getting it slightly wrong.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — build once, and where that build should happen</span><span class="lc-sub">/courses/docker/learn${REF} — image builds are the most expensive thing most pipelines do, and where they run is a cost decision before it is a technical one.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>CI tốn gì, và nó đáng gì</h2>
<p class="lead">Tốc độ là một trục và TIỀN là một trục khác, và kho này đứng ở một điểm bất thường trên cả hai: nó không trả gì cả, vì nó công khai. Điều đó khiến nó thành một chỗ tốt để tính cái giả định một cách trung thực, rồi hỏi câu khó hơn nằm bên dưới.</p>

<h3>Nó thật sự tốn gì</h3>
${slide('ga-07', 25, 'Giá mỗi phút (09/2026): macOS đắt gấp ~10 lần Linux')}
<div class="out">billable: MACOS 0ms · UBUNTU 0ms · WINDOWS 0ms</div>

<p>Bằng không. Kho công khai được dùng runner tiêu chuẩn do GitHub cấp miễn phí, không có hạn mức phút và không có phần vượt. Mọi phép đo thời gian trong khoá học này đều đo trên hạ tầng chẳng tốn đồng nào.</p>

<h3>Cái giả định, tính từ chính những phép đo ấy</h3>
${slide('ga-07', 26, 'Nếu kho riêng tư: 76% tiền nằm ở workflow phát hành')}
<div class="out">neu la kho RIENG TU:

  ci-lint            526 lan  x    5 phut-tinh-tien  =   2.630 phut
  desktop-release     85 lan  x  100 phut-tinh-tien  =   8.500 phut
  ------------------------------------------------------------------
  TONG                                                  11.130 phut</div>

<div class="callout warn">
<p><strong>Workflow phát hành chiếm 16% số lần chạy và 76% hoá đơn.</strong> Chương 2 đã giải thích vì sao: một nhánh macOS, làm tròn lên phút, ở hệ số 10×, là 80 phút tính tiền cho một job 437 giây. Mọi thứ còn lại trong lần chạy ấy cộng lại là 20. Thứ đắt nhất kho này làm, ở một thế giới nơi nó phải trả tiền, sẽ là việc dựng cho một nền tảng mà thiểu số người dùng của nó đang dùng.</p>
</div>

<div class="callout">
<p><strong>Hai giới hạn trung thực của con số ấy.</strong> Nó là một ƯỚC LƯỢNG: nó giả định mọi lần chạy đều mất đúng thời lượng trung bình và áp làm-tròn-phút theo từng job, tức là mô hình có ghi trong tài liệu chứ không phải một hoá đơn ai đó nhận được. Và nó trải trọn LỊCH SỬ chứ không phải một tháng, nên không so trực tiếp được với một hạn mức hằng tháng. Cái HÌNH DẠNG — một workflow áp đảo — thì vững trước cả hai giới hạn ấy.</p>
</div>

<div class="callout warn">
<p><strong>Cập nhật 09/2026: "hệ số 10×" giờ là một BẢNG GIÁ.</strong> Tài liệu tính tiền của GitHub không còn mô tả phút Windows và macOS như phút Linux "nhân hệ số"; nó liệt kê GIÁ MỖI PHÚT cho từng loại runner. Đọc ngày 24/09/2026: Linux 2 nhân <strong>$0,006</strong>, Windows 2 nhân <strong>$0,010</strong>, macOS 3 hoặc 4 nhân <strong>$0,062</strong>. macOS vẫn đắt khoảng 10 lần Linux (10,3×), nên lập luận bên trên vẫn đứng; Windows là 1,7×, không phải 2×. Tính lại bằng đô la với làm-tròn-từng-job, một lần chạy phát hành là $0,496 macOS + $0,060 Windows + $0,048 Linux = <strong>$0,604</strong>; 85 lần là $51,3 so với $15,8 cho 526 lần <code>ci-lint</code> — bản phát hành vẫn chiếm <strong>76%</strong> tổng, và riêng nhánh macOS là 82% của mỗi lần phát hành. Gói Free có sẵn 2.000 phút mỗi tháng cho kho riêng tư (Pro và Team 3.000).</p>
</div>

<h3>Tự tính giá một lần chạy</h3>
<p>API có một endpoint cho đúng việc này, và với kho công khai thì nó cho thấy tầng miễn phí đang làm việc:</p>
<pre><code class="language-bash">gh api repos/cuonghoang1103/ga-san-tap/actions/runs/36009578496/timing</code></pre>
<div class="out">{"billable":{"UBUNTU":{"total_ms":0,"jobs":3,…},
             "WINDOWS":{"total_ms":0,"jobs":1,…},
             "MACOS":{"total_ms":0,"jobs":1,…}},
 "run_duration_ms":116000}</div>
<p>Số tính tiền bằng không vì kho công khai. Muốn biết cùng lần chạy ấy <em>SẼ</em> tốn bao nhiêu nếu riêng tư, áp luật có ghi trong tài liệu — mỗi job làm tròn <strong>LÊN</strong> phút nguyên, nhân giá của loại runner — vào thời lượng từng job. Với lần chạy sân tập ấy (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009578496" target="_blank" rel="noopener">36009578496</a>):</p>
<table>
<thead><tr><th>Job</th><th>Chạy</th><th>Phút tính tiền</th><th>Giá</th><th>Tiền</th></tr></thead>
<tbody>
<tr><td>kiểm (ubuntu)</td><td>34 s</td><td>1</td><td>$0,006</td><td>$0,006</td></tr>
<tr><td>dựng ubuntu</td><td>28 s</td><td>1</td><td>$0,006</td><td>$0,006</td></tr>
<tr><td>dựng windows</td><td>62 s</td><td>2</td><td>$0,010</td><td>$0,020</td></tr>
<tr><td>dựng macos</td><td>45 s</td><td>1</td><td>$0,062</td><td>$0,062</td></tr>
<tr><td>công bố (ubuntu)</td><td>6 s</td><td>1</td><td>$0,006</td><td>$0,006</td></tr>
<tr><td><strong>cộng</strong></td><td><strong>175 s</strong></td><td><strong>6 phút = 360 s</strong></td><td></td><td><strong>$0,100</strong></td></tr>
</tbody>
</table>
<div class="callout">
<p><strong>Thuế làm tròn.</strong> 175 máy-giây bị tính thành 360 — hơn gấp đôi — vì năm job ngắn mỗi cái làm tròn lên một phút trọn, và job Windows 62 s làm tròn lên hai phút. Đây là mặt CHI PHÍ của kết quả song song hoá ở bài 7.4: chia việc thành nhiều job ngắn thì nhân lên cả phần dựng môi trường lẫn phần làm tròn. Ở kho riêng tư, một job vài giây không bao giờ là "gần như miễn phí"; nó là MỘT PHÚT.</p>
</div>

<h3>Tiền đi đâu, và đòn bẩy nào lay được nó</h3>
<table>
<thead><tr><th>Đòn bẩy</th><th>Tác động tới hoá đơn</th><th>Tác động tới an toàn</th></tr></thead>
<tbody>
<tr><td>bớt nhánh macOS (chỉ dựng macOS lúc phát hành, không phải mỗi PR)</td><td>lớn nhất: một phút macOS ≈ 10 phút Linux</td><td>lỗi chỉ-macOS bị phát hiện muộn hơn — quyết theo từng dự án</td></tr>
<tr><td><code>cancel-in-progress: true</code> cho kiểm PR</td><td>các lần chạy bị vượt mặt thôi tốn tiền (7.2: 2 trên 3 lần bị huỷ)</td><td>không sao với kiểm tra; không bao giờ dùng cho deploy</td></tr>
<tr><td>bộ lọc <code>paths:</code></td><td>lần chạy không bắt đầu thì không tốn gì</td><td>commit ngoài bộ lọc không được kiểm</td></tr>
<tr><td>gộp các job ngắn</td><td>ít làm tròn hơn: ba job 20 s = 3 phút, một job 60 s = 1 phút</td><td>đồng hồ chậm hơn; các việc ít cách ly nhau hơn</td></tr>
<tr><td><code>retention-days</code> của artifact</td><td>lưu trữ tính tiền riêng (Free: kèm 500 MB)</td><td>artifact cũ biến mất sớm hơn</td></tr>
<tr><td>runner tự vận hành</td><td>không tính tiền theo phút (09/2026)</td><td>bạn tự lo vá lỗi và cách ly; GitHub khuyên không dùng cho kho công khai</td></tr>
<tr><td>runner lớn</td><td>đắt hơn mỗi phút, và <em>KHÔNG</em> miễn phí cho kho công khai</td><td>không; có thể cắt đồng hồ trên đường tới hạn nặng CPU</td></tr>
</tbody>
</table>

<h3>Một chỉ số đáng theo dõi: số phút trên mỗi PR đã gộp</h3>
<p>Tổng số phút tăng khi nhóm lớn lên, và đó không phải vấn đề. Số phút trên mỗi pull request đã gộp tăng khi workflow chậm đi <em>HOẶC</em> khi người ta chạy lại chúng nhiều hơn — mà chạy lại thường có nghĩa là test chập chờn hay bản dựng đỏ không rõ lý do, thứ tốn của con người nhiều hơn tốn của GitHub. Cả hai số đều chỉ cách một lệnh:</p>
<pre><code class="language-bash"># PR đã gộp trong 30 ngày qua
gh pr list --state merged --search "merged:&gt;=$(date -v-30d +%F)" --limit 500 --json number --jq length
# các lần chạy phải thử hơn một lượt
gh run list --limit 200 --json databaseId,attempt --jq '[.[] | select(.attempt &gt; 1)] | length'</code></pre>
<p>Nếu số thứ hai là một phần đáng kể của số thứ nhất, thì làm CI nhanh hơn là dự án SAI; làm nó ĐÁNG TIN mới là dự án đúng.</p>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: GitHub Actions tính tiền thế nào?</strong><br>Đ: Runner tiêu chuẩn do GitHub cấp miễn phí cho kho công khai. Với kho riêng tư, mỗi gói có sẵn một số phút (Free 2.000 phút/tháng), sau đó mỗi job tính theo phút, làm tròn lên, theo giá của từng loại runner — tính đến 09/2026 khoảng $0,006 cho Linux, $0,010 cho Windows và $0,062 cho macOS. Lưu trữ artifact tính riêng. Runner tự vận hành không tính tiền theo phút.</p>
<p><strong>H: Hoá đơn Actions của chúng tôi tăng gấp đôi. Bạn nhìn vào đâu?</strong><br>Đ: Bảng phân tích theo từng workflow, rồi theo từng job: nhánh macOS trước vì giá, rồi nhiều job ngắn vì làm tròn theo job, rồi xem bao nhiêu lần chạy bị vượt mặt hay bị chạy lại. Huỷ các lần chạy PR bị vượt mặt và chỉ dựng macOS lúc phát hành thường là hai đòn bẩy lớn nhất.</p>
<p><strong>H: Có người muốn xoá job CI chậm nhất cho đỡ tốn tiền. Bạn hỏi gì?</strong><br>Đ: Lần gần nhất nó bắt được gì. Nếu suốt một năm nó chẳng bắt được gì thì xoá là hợp lý; nếu gần đây nó vừa bắt được một lỗi thật — như một bản dựng hết bộ nhớ chỉ xảy ra trên macOS — thì cái giá của nó chính là giá của việc không phát hành lỗi ấy.</p>
</div>

<h3>Cái giá không nằm trên hoá đơn nào</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">thời gian người ta NGỒI CHỜ</span><span class="lz-lnote">141 giây × 526 lần chạy <code>ci-lint</code> là khoảng 20 giờ ai đó nhìn một cái vòng xoay — và đó lại là workflow gần như không tốn tiền. Thời gian đồng hồ và tiền xếp hạng các workflow KHÁC NHAU, và bài 7.4 đã đo rằng chúng bất đồng ở đây</span></div>
<div class="lz-layer"><span class="lz-lname">chuyển ngữ cảnh</span><span class="lz-lnote">cái giá thật của một lần chờ hai phút hiếm khi là hai phút. Nó là cái tab được mở ra trong lúc chờ. Thứ này KHÔNG đo được từ một API và là số hạng lớn nhất trong trải nghiệm CI của phần lớn mọi người</span></div>
<div class="lz-layer"><span class="lz-lname">một bản dựng đỏ mà không phải lỗi bạn</span><span class="lz-lnote">bài 7.3 đo biên độ 1,60 lần trên cùng khối việc. Thời gian bỏ ra điều tra một lần chạy chậm mà nó chỉ là một lần chạy chậm là mất trắng, và cách phòng là BIẾT cái phân bố</span></div>
<div class="lz-layer"><span class="lz-lname">bảo trì</span><span class="lz-lnote">1.394 dòng YAML, chín khối SSH trùng lặp (bài 4.5), một cái cache chết (bài 5.3), sáu action đổi runtime dưới một tệp không sửa (bài 4.2). CI là PHẦN MỀM, và nó có chi phí vận hành của phần mềm</span></div>
</div>

<h3>Phía bên kia của cán cân</h3>
${slide('ga-07', 27, 'Phía bên kia cán cân: cú hỏng chỉ CI thấy')}
<p>Đối trọng với tất cả những thứ trên là MỘT sự kiện đã đo được. Lần chạy <strong>32399243354</strong>: <code>vite build</code> thoát 134 với <code>Reached heap limit</code> ở nhánh macOS. Máy của chính người viết đã dựng đúng commit ấy XANH trong hai mươi giây.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">CI bắt được gì</span><span class="lz-t">một bản dựng chỉ hỏng trên một cỗ máy NHỎ HƠN</span><span class="lz-d">vô hình ở máy nhà, theo cấu tạo — bạn không nhìn thấy được một cái trần bộ nhớ mà bạn không ở gần</span></div>
<div class="lz-step"><span class="lz-k">nó lẽ ra đã tốn gì</span><span class="lz-t">một bản cài macOS hỏng, đã công bố</span><span class="lz-d">và tự-cập-nhật nghĩa là một bản phát hành hỏng lan tới mọi người vốn đã cài</span></div>
<div class="lz-step"><span class="lz-k">cái gì khiến nó tìm ra được</span><span class="lz-t">một cỗ máy KHÁC, chạy cùng một commit</span><span class="lz-d">và đó là toàn bộ cơ chế của CI, phát biểu trong một dòng</span></div>
</div>

<div class="callout ok">
<p><strong>Đó là lời chào hàng giá trị kèm một con số, và nó KHÔNG phải một con số về tốc độ.</strong> CI trước hết không phải một cách chạy test nhanh hơn; nó là một cách chạy chúng <em>Ở MỘT CHỖ KHÁC cái máy vốn đã đồng ý với bạn</em>. Mọi thứ khác trong chương này — đường tới hạn, cache, concurrency — là để làm cho chuyện ấy đủ RẺ để còn tiếp tục làm.</p>
</div>

<h3>Chỗ mà mức chi của kho này không khớp với rủi ro của nó</h3>
<div class="out">bai 1.5 do: 147 / 200 commit gan nhat tren main KHONG chay CI nao (73,5%)
             trong do desktop/ chiem 297 file
cu hong 32399243354 nam TRON trong tap 147 commit ay</div>

<div class="callout warn">
<p><strong>Cú hỏng mà CI bắt được lại nằm ở cái thư mục mà CI KHÔNG kiểm khi push.</strong> Nó bị bắt vào lúc PHÁT HÀNH, bởi workflow phát hành, tức là cái đắt tiền. Một bản dựng <code>desktop/</code> chỉ-trên-Linux ở mọi cú push đã bắt được cùng lớp lỗi ấy SỚM HƠN và với chi phí gần như bằng không — Linux là hệ số 1× và bản dựng ở đó mất 149 giây so với 315 của macOS. Đó chính là thay đổi CỤ THỂ, ĐO ĐƯỢC, HIỆU QUẢ-CHI-PHÍ mà chương này đi tới: không phải "chi ít hơn cho CI", mà là "chi một khoản nhỏ cho cái 73,5% hiện đang không có gì cả".</p>
</div>

<div class="kv-grid">
<div class="kv"><span class="k">tầng miễn phí là CÓ THẬT</span><span class="v">kho công khai không trả gì cho runner tiêu chuẩn. Nếu chi phí là lý do một dự án không có CI, thì lý do ấy không áp dụng cho mã nguồn mở</span></div>
<div class="kv"><span class="k">kho riêng tư: canh chừng macOS</span><span class="v">hệ số 10× cộng với làm tròn phút theo từng job nghĩa là một job macOS NGẮN lại đắt một cách không cân xứng. Nhấc phần việc không phụ thuộc nền tảng ra khỏi ma trận (bài 2.3) là đòn bẩy lớn nhất</span></div>
<div class="kv"><span class="k">runner tự vận hành đổi cả phép tính</span><span class="v">không có chi phí theo phút, và bạn sở hữu cỗ máy, phần vá lỗi lẫn phần cách ly. Nó đổi một chi phí ĐO ĐẾM ĐƯỢC lấy một chi phí KHÔNG ĐO ĐẾM — đáng ở khối lượng lớn, và là một gánh nặng ở khối lượng nhỏ</span></div>
<div class="kv"><span class="k">con số nên theo dõi</span><span class="v">không phải tổng số phút. Mà là PHÚT TRÊN MỖI PR ĐÃ GỘP, thứ tăng lên khi workflow chậm đi <em>VÀ</em> khi chúng bị chạy lại nhiều hơn — mà cái thứ hai thường mới là vấn đề thật</span></div>
</div>

<div class="callout">
<p><strong>Một câu.</strong> CI của kho này miễn phí, sẽ tốn 11.130 phút tính tiền nếu không, và 76% con số ấy sẽ là MỘT nhánh ma trận macOS — trong khi cú hỏng biện minh mạnh nhất cho việc có CI lại nằm ở một thư mục mà 73,5% commit sửa vào mà không kích hoạt gì cả.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — đo CI bằng hoá đơn của nó thay vì bằng thứ nó bắt được.</strong> Số phút là con số nhìn thấy được, nên đó là thứ bị đem đi tối ưu: nhớ đệm thật mạnh, bỏ bớt việc chậm nhất, chỉ chạy kiểm thử trên những đường đã đổi. Mỗi cách đều tiết kiệm tiền và mỗi cách đều gỡ bớt phạm vi phủ, và phần mất mát hiện ra vài tháng sau dưới dạng một lỗi lọt lên production qua đúng con đường mà chẳng ai còn kiểm. Phép so sánh đáng làm là so với kịch bản ngược lại — một khiếm khuyết lọt lưới tốn bao nhiêu thời gian xử lý sự cố, quay lui, và một giờ mà mỗi kỹ sư ngồi chờ nhánh chính hỏng. Trước khi cắt một việc, hãy tìm xem lần gần nhất nó bắt được cái gì. Nếu suốt một năm nó chẳng bắt được gì thì đó là lý lẽ thật để xoá nó; còn &quot;nó chậm&quot; thì không.</p>
</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> dự án của bạn có thể phải chuyển sang kho riêng tư. Tính trước CI của nó sẽ tốn bao nhiêu, trước khi ai đó bất ngờ vì hoá đơn.</p><ol>
<li>Chọn workflow bận nhất. Đếm số lần chạy trong 30 ngày qua bằng <code>gh run list --workflow &lt;tệp&gt; --limit 500 --json createdAt</code>.</li>
<li>Lấy một lần chạy điển hình và liệt kê job bằng <code>gh api repos/OWNER/REPO/actions/runs/&lt;id&gt;/jobs --jq '.jobs[] | [.name, .started_at, .completed_at] | @tsv'</code>.</li>
<li>Làm tròn LÊN từng job thành phút nguyên và nhân với giá runner (Linux $0,006, Windows $0,010, macOS $0,062 mỗi phút, tính đến 09/2026).</li>
<li>Nhân với số lần chạy mỗi tháng; so với số phút có sẵn của gói Free (2.000).</li>
<li>Tìm MỘT thay đổi cắt được ước lượng nhiều nhất, và cú hỏng gần nhất mà thay đổi ấy lẽ ra đã che mất.</li></ol>
<p><strong>Đạt khi:</strong> bạn có giá một lần chạy kèm phần làm tròn, một ước lượng theo tháng, tỉ phần của job đắt nhất, và một câu cân khoản tiết kiệm lớn nhất với thứ nó sẽ không bắt được nữa.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Billable minutes (phút tính tiền)</span><span class="v">Số phút GitHub tính tiền: theo từng job, làm tròn lên, theo giá mỗi phút của runner. Bằng 0 với runner tiêu chuẩn ở kho công khai.</span></div>
  <div class="kv"><span class="k">Included minutes (phút có sẵn)</span><span class="v">Hạn mức hằng tháng của một gói cho kho riêng tư (Free 2.000; Pro và Team 3.000).</span></div>
  <div class="kv"><span class="k">Per-job rounding (làm tròn theo job)</span><span class="v">Mỗi job tính bằng phút nguyên; nhiều job ngắn trả nhiều hơn hẳn số máy-giây của chúng.</span></div>
  <div class="kv"><span class="k">Larger runner (runner lớn)</span><span class="v">Runner do GitHub cấp có nhiều nhân hay bộ nhớ hơn; tính tiền kể cả ở kho công khai.</span></div>
  <div class="kv"><span class="k">Self-hosted runner (runner tự vận hành)</span><span class="v">Máy của chính bạn đăng ký để chạy job; không tính tiền theo phút, nhưng bạn tự lo bảo mật và bảo trì.</span></div>
  <div class="kv"><span class="k"><code>/actions/runs/&lt;id&gt;/timing</code></span><span class="v">Endpoint API trả về số mili giây tính tiền theo nền tảng và thời lượng lần chạy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Runner tiêu chuẩn ở kho công khai không tốn gì; API báo <code>total_ms: 0</code> cho mọi nền tảng.</li>
<li>Giá tính đến 09/2026: Linux $0,006, Windows $0,010, macOS $0,062 mỗi phút; mỗi job làm tròn lên phút nguyên.</li>
<li>Nếu kho này riêng tư, workflow phát hành chiếm khoảng 76% chi phí CI, và nhánh macOS chiếm 82% mỗi lần phát hành.</li>
<li>Làm tròn là chi phí thật: một lần chạy sân tập 175 máy-giây bị tính thành 6 phút.</li>
<li>Giá trị của CI không phải tốc độ: run 32399243354 bắt được một bản dựng hết bộ nhớ chỉ-trên-macOS mà máy người viết không cho thấy.</li>
<li>Trước khi cắt một job để tiết kiệm tiền, hãy tìm thứ cuối cùng nó bắt được.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About billing for GitHub Actions</span><span class="lc-sub">docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions — hệ số theo nền tảng, làm tròn phút theo từng job, hạn mức kèm theo mỗi gói, và phát biểu rằng kho công khai là miễn phí.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Viewing your Actions usage</span><span class="lc-sub">docs.github.com/en/billing/managing-billing-for-github-actions/viewing-your-github-actions-usage — bảng phân tích theo từng workflow, thứ biến ước lượng bên trên thành một con số THẬT cho một kho riêng tư.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About self-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners — gồm cả lời cảnh báo tường minh không dùng chúng trên kho công khai, tức là nửa BẢO MẬT của phép tính bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — dựng ở nhà thay vì dựng trên máy chủ</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cùng quyết định chi phí ấy làm theo chiều ngược lại, kèm phép đo biện minh cho nó và cú sự cố sau khi làm hơi lệch đi.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — dựng một lần, và bản dựng ấy NÊN xảy ra ở đâu</span><span class="lc-sub">/courses/docker/learn${REF} — dựng ảnh là thứ đắt nhất mà phần lớn đường ống làm, và chuyện chúng chạy ở đâu là một quyết định CHI PHÍ trước khi nó là một quyết định kỹ thuật.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 7.6 ─────────────────────────── */
    {
      title: '7.6 — Chapter 7 quiz|||7.6 — Kiểm tra Chương 7',
      slug: 'ga-7-6-kiem-tra',
      type: 'QUIZ',
      description: 'Mười câu tình huống: đường tới hạn dời đi khi tăng tốc, commit bị bỏ âm thầm với cancel-in-progress: false, hai workflow deploy khác nhóm, bậc thang huỷ 10 giây, 14 lần chạy cùng commit, tách job và thuế làm tròn phút.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>What Chapter 7 measured</h2>
<p class="lead">Ten questions, fifteen minutes. Every scenario comes from a real run: this repository&#39;s release workflow, or the sandbox branch <code>ch07-toc-do</code>. The recurring finding is that the intuitive target is usually the wrong one: the slowest job may have slack, a faster job can move the critical path, <code>cancel-in-progress: false</code> still drops commits, and one run is not a measurement.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can compute machine-seconds, wall-clock and the critical path of a run from the jobs API, and name each job&#39;s slack.</li>
<li>I can decide whether a <code>needs:</code> edge is a data, safety or merely cosmetic dependency.</li>
<li>I can predict what <code>cancel-in-progress: true</code>, <code>false</code> and <code>queue: max</code> do to three quick pushes.</li>
<li>I know which steps still run when a job is cancelled, and how long a step has before it is killed.</li>
<li>I can explain why two runs of one commit differ and measure a change with paired runs and medians.</li>
<li>I can estimate what a run would cost on a private repository, including per-job rounding.</li>
</ul>
${slide('ga-07', 29, 'Bảng tra nhanh Chương 7')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Chương 7 đã đo được gì</h2>
<p class="lead">Mười câu, mười lăm phút. Mọi tình huống đều lấy từ một lần chạy thật: workflow phát hành của kho này, hoặc nhánh <code>ch07-toc-do</code> của sân tập. Phát hiện lặp đi lặp lại của chương là cái đích theo trực giác thường SAI: job chậm nhất có thể đang có độ chùng, làm nhanh một job có thể DỜI đường tới hạn, <code>cancel-in-progress: false</code> vẫn bỏ commit, và một lần chạy không phải một phép đo.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tính được máy-giây, thời gian đồng hồ và đường tới hạn của một lần chạy từ API jobs, và chỉ ra độ chùng của từng job.</li>
<li>Tôi phân biệt được một cạnh <code>needs:</code> là phụ thuộc dữ liệu, phụ thuộc an toàn, hay chỉ để cho đẹp.</li>
<li>Tôi đoán trước được <code>cancel-in-progress: true</code>, <code>false</code> và <code>queue: max</code> làm gì với ba cú push liên tiếp.</li>
<li>Tôi biết bước nào vẫn chạy khi job bị huỷ, và một bước có bao lâu trước khi bị giết.</li>
<li>Tôi giải thích được vì sao hai lần chạy của cùng một commit khác nhau, và đo một thay đổi bằng các lần chạy theo cặp và trung vị.</li>
<li>Tôi ước lượng được một lần chạy sẽ tốn bao nhiêu ở kho riêng tư, kể cả phần làm tròn theo job.</li>
</ul>
${slide('ga-07', 29, 'Bảng tra nhanh Chương 7')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "A release run has 1,107 machine-seconds, 553 s wall-clock and a critical path of check 72 s → macOS build 437 s → publish 34 s. The team halves the 241-second Linux build. How much faster does the release finish?|||Một lần chạy phát hành có 1.107 máy-giây, 553 s đồng hồ và đường tới hạn kiểm 72 s → dựng macOS 437 s → công bố 34 s. Nhóm giảm một nửa bản dựng Linux 241 s. Bản phát hành xong sớm hơn bao nhiêu?",
            options: [
              "About 120 s, half of the Linux job|||Khoảng 120 s, một nửa job Linux",
              "Not at all — the Linux build already had 199 s of slack|||Không sớm hơn chút nào — bản dựng Linux vốn đã có 199 s độ chùng",
              "About 60 s, because the three builds run in parallel|||Khoảng 60 s, vì ba bản dựng chạy song song",
              "Half of the whole run, because Linux is the default platform|||Một nửa cả lần chạy, vì Linux là nền tảng mặc định",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Wall-clock is set by the longest chain of needs:. The Linux build finished 199 s before publish could start, so shortening it only makes it wait longer. The tempting “120 s” treats machine time as if it were wall-clock time.|||VI: Thời gian đồng hồ do chuỗi needs: dài nhất quyết định. Bản dựng Linux xong trước lúc công bố được bắt đầu tới 199 s, nên rút ngắn nó chỉ làm nó ngồi chờ lâu hơn. Đáp án “120 s” nghe hợp lý vì nó coi thời gian MÁY như thể là thời gian đồng hồ.",
          },
          {
            question: "In the same run (Windows build 323 s), someone makes the macOS build twice as fast: 437 s → 219 s. What does the whole run become?|||Vẫn lần chạy ấy (bản dựng Windows 323 s), có người làm bản dựng macOS nhanh gấp đôi: 437 s → 219 s. Cả lần chạy còn bao nhiêu?",
            options: [
              "325 s — Amdahl: 72 + 219 + 34|||325 s — theo Amdahl: 72 + 219 + 34",
              "272 s — half of 543|||272 s — một nửa của 543",
              "543 s — macOS was not on the critical path|||543 s — macOS không nằm trên đường tới hạn",
              "About 429 s — Windows (323 s) becomes the new critical path|||Khoảng 429 s — Windows (323 s) thành đường tới hạn mới",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Once macOS drops below 323 s, the Windows leg is the longest: 72 + 323 + 34 = 429 s. Every speed-up on the path can move the path. 325 s is what the formula gives if you forget to recompute the path after the change.|||VI: Khi macOS xuống dưới 323 s, nhánh Windows thành dài nhất: 72 + 323 + 34 = 429 s. Mỗi phép tăng tốc trên đường đều có thể DỜI cái đường. 325 s là kết quả của công thức nếu bạn quên tính lại đường tới hạn sau thay đổi.",
          },
          {
            question: "A deploy workflow uses concurrency with cancel-in-progress: false. Three commits are pushed 23 seconds apart while each deploy takes about 85 s. What happens to commit 2?|||Một workflow deploy dùng concurrency với cancel-in-progress: false. Ba commit được đẩy cách nhau 23 giây, mỗi lần deploy mất khoảng 85 s. Commit 2 ra sao?",
            options: [
              "Its run is cancelled while still pending, with no job ever started, when commit 3 arrives|||Lần chạy của nó bị huỷ khi còn đang chờ, không job nào từng chạy, lúc commit 3 tới",
              "It runs after commit 1, then commit 3 runs after it|||Nó chạy sau commit 1, rồi commit 3 chạy sau nó",
              "It cancels commit 1, which is still deploying|||Nó huỷ commit 1 đang deploy dở",
              "It runs at the same time as commit 1 on another runner|||Nó chạy cùng lúc với commit 1 trên một runner khác",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: By default a group keeps one running and one pending run; a newer arrival replaces the pending one. The sandbox showed run 36009970458 cancelled with zero jobs. “Runs after commit 1” is what queue: max does, not false.|||VI: Mặc định mỗi nhóm giữ một lần đang chạy và một lần đang chờ; cái mới tới thay chỗ cái đang chờ. Sân tập cho thấy run 36009970458 bị huỷ với không job nào. “Chạy sau commit 1” là việc của queue: max, không phải của false.",
          },
          {
            question: "deploy-ghcr.yml has group: deploy-ghcr; backend-vps.yml has no concurrency block. Both run on the same push and deploy to the same server. What protects the server from two simultaneous deploys?|||deploy-ghcr.yml có group: deploy-ghcr; backend-vps.yml không có khối concurrency. Cả hai chạy trên cùng một cú push và cùng deploy lên một máy chủ. Thứ gì bảo vệ máy chủ khỏi hai cuộc deploy cùng lúc?",
            options: [
              "The deploy-ghcr group, because it is defined at workflow level|||Nhóm deploy-ghcr, vì nó khai ở mức workflow",
              "GitHub never runs two workflows from one push at the same time|||GitHub không bao giờ chạy hai workflow của cùng một cú push cùng lúc",
              "Nothing — only runs sharing the same group name are serialised; both need one group named after the server|||Không gì cả — chỉ những lần chạy CHUNG tên nhóm mới bị tuần tự hoá; cả hai cần một nhóm đặt theo máy chủ",
              "cancel-in-progress: true in deploy-ghcr cancels backend-vps|||cancel-in-progress: true ở deploy-ghcr sẽ huỷ backend-vps",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: A group only affects runs whose group string matches. This gap is the mechanism behind the July 2026 outages (Exited 137). The sandbox showed two files with one shared group queueing behind each other. A group in one file cannot see a workflow that has none.|||VI: Một nhóm chỉ tác động tới những lần chạy có chuỗi nhóm trùng. Khe hở này là cơ chế đứng sau các sự cố 07/2026 (Exited 137). Sân tập cho thấy hai tệp dùng chung một nhóm thì xếp hàng sau nhau. Nhóm ở một tệp không thể “thấy” một workflow không khai nhóm.",
          },
          {
            question: "A deploy job is cancelled by cancel-in-progress while step 2 “push image” is running. Steps are: 2 push image, 3 run migrations, 4 cleanup (if: always()). What happens?|||Một job deploy bị cancel-in-progress huỷ khi bước 2 “đẩy ảnh” đang chạy. Các bước: 2 đẩy ảnh, 3 chạy migration, 4 dọn dẹp (if: always()). Chuyện gì xảy ra?",
            options: [
              "Step 2 finishes first, then the job stops before step 3|||Bước 2 chạy xong đã, rồi job dừng trước bước 3",
              "Step 2 is interrupted (SIGINT, then SIGTERM, then kill within ~10 s), step 3 is skipped, step 4 still runs|||Bước 2 bị ngắt (SIGINT, rồi SIGTERM, rồi giết trong ~10 s), bước 3 bị bỏ qua, bước 4 vẫn chạy",
              "The whole job is rolled back automatically|||Cả job được tự động quay lui",
              "All remaining steps are skipped, including cleanup|||Mọi bước còn lại bị bỏ qua, kể cả dọn dẹp",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Cancellation cuts the running step mid-way and re-evaluates if: conditions, so always()/cancelled() steps run. The sandbox log shows “The operation was canceled.” 10 s after the new run, step 3 skipped and cleanup printing job.status=cancelled. Nothing is rolled back — that is exactly why deploys must not use cancel-in-progress: true.|||VI: Huỷ cắt ngang bước đang chạy và đánh giá lại các điều kiện if:, nên bước always()/cancelled() vẫn chạy. Log sân tập cho thấy “The operation was canceled.” 10 s sau khi có lần chạy mới, bước 3 bị skip và bước dọn dẹp in job.status=cancelled. Không có gì được quay lui — chính vì thế deploy không được dùng cancel-in-progress: true.",
          },
          {
            question: "You need every commit on main deployed, in order, none skipped. You add concurrency with queue: max and actionlint reports “unexpected key queue”. What is the right move?|||Bạn cần mọi commit trên main được deploy, theo thứ tự, không bỏ cái nào. Bạn thêm concurrency với queue: max và actionlint báo “unexpected key queue”. Làm gì là đúng?",
            options: [
              "Replace it with cancel-in-progress: false, which queues every run|||Thay bằng cancel-in-progress: false, vốn cũng xếp hàng mọi lần chạy",
              "Remove concurrency; the linter proves the key does not exist|||Bỏ concurrency; bộ lint đã chứng minh khoá ấy không tồn tại",
              "Add cancel-in-progress: true next to it so the linter accepts the block|||Thêm cancel-in-progress: true bên cạnh để bộ lint chấp nhận khối",
              "Check the docs and a real run: GitHub accepts queue: max; note the linter lag and pin its version|||Kiểm docs và một lần chạy thật: GitHub chấp nhận queue: max; ghi chú bộ lint đi sau và ghim phiên bản của nó",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: queue: max keeps up to 100 pending runs in order; on the sandbox all three commits ran. false keeps only one pending run and drops the rest, so it would skip commits. And queue: max combined with cancel-in-progress: true is a documented validation error.|||VI: queue: max giữ tới 100 lần chạy chờ theo thứ tự; trên sân tập cả ba commit đều chạy. false chỉ giữ một lần chờ và bỏ phần còn lại, nên sẽ bỏ qua commit. Còn queue: max đi cùng cancel-in-progress: true là lỗi kiểm tra có ghi trong docs.",
          },
          {
            question: "The same commit ran 14 times in 37–77 s (median 50.5 s). After your change, one run takes 45 s; the run before your change took 60 s. What can you conclude?|||Cùng một commit chạy 14 lần mất 37–77 s (trung vị 50,5 s). Sau thay đổi của bạn, một lần chạy mất 45 s; lần chạy trước thay đổi mất 60 s. Kết luận được gì?",
            options: [
              "The change saved 15 s|||Thay đổi tiết kiệm được 15 s",
              "The change saved 25% and should be merged|||Thay đổi tiết kiệm 25% và nên được gộp",
              "Nothing yet — both runs are inside the normal spread; compare medians of paired runs or the step you changed|||Chưa gì cả — cả hai lần đều nằm trong độ trải bình thường; hãy so trung vị của các lần chạy theo cặp hoặc so đúng bước bạn đổi",
              "The change made CI slower, because 45 s is below the median|||Thay đổi làm CI chậm đi, vì 45 s thấp hơn trung vị",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: With a 40-second spread on identical input, a 15-second difference between two single runs is noise. Measure at least five paired runs per side and compare medians, or time the step your change touched. “Saved 15 s” is the classic single-sample mistake.|||VI: Với độ trải 40 giây trên cùng một đầu vào, chênh 15 giây giữa hai lần chạy đơn lẻ là tiếng ồn. Đo ít nhất năm lần mỗi bên theo cặp và so trung vị, hoặc bấm giờ đúng bước bạn đổi. “Tiết kiệm 15 s” là lỗi kinh điển của việc chỉ có một mẫu.",
          },
          {
            question: "In one slow run, the job started at 14:03:57 but its first step “Set up job” began at 14:04:17. Where did those 20 seconds go?|||Ở một lần chạy chậm, job bắt đầu lúc 14:03:57 mà bước đầu “Set up job” tới 14:04:17 mới bắt đầu. 20 giây ấy đi đâu?",
            options: [
              "To the runner machine getting ready — it is not in any step and not in your code; measure first-step-to-last-step instead|||Vào việc cỗ máy runner chuẩn bị — nó không nằm trong bước nào và không nằm trong mã của bạn; hãy đo từ bước đầu tới bước cuối",
              "To the checkout step downloading history|||Vào bước checkout tải lịch sử",
              "To waiting for a needs: dependency|||Vào việc chờ một phụ thuộc needs:",
              "To the npm cache restore|||Vào việc khôi phục cache npm",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: The gap between the job’s started_at and its first step is runner start-up; queueing was separately 3 s. Checkout and cache restore are steps with their own timings, and a needs: wait happens before the job is even created.|||VI: Khoảng giữa started_at của job và bước đầu là thời gian khởi động runner; riêng xếp hàng chỉ 3 s. Checkout và khôi phục cache là các bước có thời gian riêng, còn chờ needs: xảy ra trước cả khi job được tạo.",
          },
          {
            question: "Splitting type-check, tests and build from one job into three parallel jobs changed wall-clock from 50.5 s to 44 s and machine-seconds from 44 to 86. Which conclusion is right?|||Tách kiểm kiểu, test và dựng từ một job ra ba job song song đổi thời gian đồng hồ từ 50,5 s xuống 44 s và máy-giây từ 44 lên 86. Kết luận nào đúng?",
            options: [
              "Always split: parallel jobs are free on public repositories|||Luôn tách: job song song miễn phí ở kho công khai",
              "Parallelising pays only when each split-off piece is much larger than the per-job overhead (here a 15 s install repeated three times)|||Song song hoá chỉ có lãi khi mỗi phần tách ra lớn hơn nhiều chi phí cố định mỗi job (ở đây lượt cài 15 s bị lặp ba lần)",
              "The measurement is wrong: parallel jobs cannot use more machine time|||Phép đo sai: job song song không thể tốn thêm thời gian máy",
              "Never split jobs; it always makes CI slower|||Đừng bao giờ tách job; nó luôn làm CI chậm đi",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Each new job repeats runner start, checkout, setup-node and npm ci. The tasks were 3, 13 and 3 s, so the split bought 6.5 s of wall-clock for double the machine time — and on a private repository, double the bill. For a multi-minute test suite the same split is worth it.|||VI: Mỗi job mới lặp lại khởi động máy, checkout, setup-node và npm ci. Các việc chỉ 3, 13 và 3 s, nên việc tách mua được 6,5 s đồng hồ với giá gấp đôi thời gian máy — và ở kho riêng tư là gấp đôi hoá đơn. Với bộ test dài vài phút thì cùng cách tách ấy lại đáng.",
          },
          {
            question: "On a private repository, a run with jobs of 34 s, 28 s, 6 s (Linux), 62 s (Windows) and 45 s (macOS) — 175 machine-seconds — is billed as how many minutes, and why?|||Ở kho riêng tư, một lần chạy có các job 34 s, 28 s, 6 s (Linux), 62 s (Windows) và 45 s (macOS) — 175 máy-giây — bị tính bao nhiêu phút, và vì sao?",
            options: [
              "6 minutes: each job is rounded up to a whole minute, and the 62 s Windows job to two|||6 phút: mỗi job làm tròn lên phút nguyên, và job Windows 62 s thành hai phút",
              "3 minutes: 175 s rounded up once for the whole run|||3 phút: 175 s làm tròn lên một lần cho cả lần chạy",
              "0 minutes: jobs under a minute are free|||0 phút: job dưới một phút thì miễn phí",
              "2 minutes: only the longest job is billed|||2 phút: chỉ job dài nhất bị tính",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: GitHub rounds each job up to the nearest whole minute, then prices it by runner (Sept 2026: Linux $0.006, Windows $0.010, macOS $0.062). Five jobs become 6 minutes = 360 s for 175 s of work — the rounding tax that makes many short jobs expensive. Rounding once per run would be 3 minutes, but that is not the rule.|||VI: GitHub làm tròn TỪNG job lên phút nguyên, rồi nhân giá theo loại runner (09/2026: Linux $0,006, Windows $0,010, macOS $0,062). Năm job thành 6 phút = 360 s cho 175 s việc — thuế làm tròn khiến nhiều job ngắn trở nên đắt. Làm tròn một lần cho cả lần chạy sẽ ra 3 phút, nhưng luật không như thế.",
          },
        ],
      },
    },
  ],
};
