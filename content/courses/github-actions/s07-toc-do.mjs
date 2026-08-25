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
<div class="kv-grid">
<div class="kv"><span class="k">a constant, as here</span><span class="v"><code>group: deploy-ghcr</code> — one run at a time across the whole repository. Correct when the workflow touches something singular: a production server, a registry tag, a release</span></div>
<div class="kv"><span class="k">per branch</span><span class="v"><code>group: ci-\${{ github.ref }}</code> — the standard for PR checks. Pushing twice to one PR cancels the first run; two different PRs do not interfere</span></div>
<div class="kv"><span class="k">per workflow and branch</span><span class="v"><code>group: \${{ github.workflow }}-\${{ github.ref }}</code> — the safest general form, because two different workflows on the same branch stay independent</span></div>
<div class="kv"><span class="k">the mistake</span><span class="v">a group that is too broad. <code>group: ci</code> on a repository with active branches means every PR cancels every other PR&#39;s checks, which reads as "CI keeps randomly cancelling"</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — <code>cancel-in-progress: true</code> on anything that deploys or publishes.</strong> A cancelled job stops between two steps, wherever it happened to be. For a lint run that is fine. For a deploy it can mean containers recreated but migrations not applied; for a release, three of five assets uploaded. This repository gets it right by splitting the two cases, and the reasoning is written down in the file — which is the part worth copying, because the next person to add a workflow will otherwise copy whichever block they saw first.</p>
</div>

<h3>The thing <code>concurrency</code> does not do</h3>
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

<h3>What the other nine workflows do</h3>
<div class="out">concurrency: khai o  2 / 11 workflow</div>

<p>The other nine are single-job <code>workflow_dispatch</code> workflows. Their concurrency control is a human deciding to press the button, which is a real control with a real property: it is serialised by a person who knows whether the last one finished. That works until two people press it, or until one of them is a schedule — <code>vps-cleanup-weekly.yml</code> has both a cron and a dispatch trigger, so a manual run and a scheduled run can genuinely overlap.</p>

<div class="callout">
<p><strong>The one sentence.</strong> <code>concurrency</code> decides whether a superseded run dies or waits, the answer depends on whether the run has side effects that must complete, and it does not make anything idempotent — a run that waits its turn and then overwrites the result is exactly as wrong as one that raced.</p>
</div>

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
<div class="kv-grid">
<div class="kv"><span class="k">một hằng số, như ở đây</span><span class="v"><code>group: deploy-ghcr</code> — một lần chạy tại một thời điểm trên toàn kho. Đúng khi workflow chạm vào một thứ ĐƠN NHẤT: một máy chủ production, một nhãn registry, một bản phát hành</span></div>
<div class="kv"><span class="k">theo từng nhánh</span><span class="v"><code>group: ci-\${{ github.ref }}</code> — tiêu chuẩn cho các phép kiểm PR. Đẩy hai lần lên một PR thì huỷ lần chạy đầu; hai PR khác nhau không đụng nhau</span></div>
<div class="kv"><span class="k">theo workflow VÀ nhánh</span><span class="v"><code>group: \${{ github.workflow }}-\${{ github.ref }}</code> — dạng tổng quát an toàn nhất, bởi hai workflow khác nhau trên cùng một nhánh vẫn độc lập</span></div>
<div class="kv"><span class="k">sai lầm</span><span class="v">một cái nhóm quá RỘNG. <code>group: ci</code> trên một kho có nhiều nhánh đang hoạt động nghĩa là mọi PR huỷ phép kiểm của mọi PR khác, và nó đọc lên thành "CI cứ tự dưng huỷ"</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>cancel-in-progress: true</code> trên bất cứ thứ gì có deploy hay công bố.</strong> Một job bị huỷ sẽ dừng GIỮA hai bước, ở đúng chỗ nó tình cờ đang đứng. Với một lượt lint thì ổn. Với một cuộc deploy thì nó có thể nghĩa là container đã dựng lại mà migration chưa chạy; với một cuộc phát hành thì là ba trên năm tệp đã tải lên. Kho này làm đúng nhờ TÁCH hai ca ra, và lý lẽ được ghi lại ngay trong tệp — đó mới là phần đáng chép, bởi người kế tiếp thêm một workflow nếu không sẽ chép đúng cái khối nào họ nhìn thấy trước.</p>
</div>

<h3>Thứ mà <code>concurrency</code> KHÔNG làm</h3>
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

<h3>Chín workflow còn lại thì sao</h3>
<div class="out">concurrency: khai o  2 / 11 workflow</div>

<p>Chín cái kia là những workflow <code>workflow_dispatch</code> một job. Biện pháp kiểm soát đồng thời của chúng là MỘT CON NGƯỜI quyết định bấm nút, và đó là một biện pháp thật với một tính chất thật: nó được tuần tự hoá bởi một người BIẾT cái trước đã xong hay chưa. Cách ấy chạy được cho tới khi có HAI người cùng bấm, hoặc cho tới khi một trong hai là một cái lịch — <code>vps-cleanup-weekly.yml</code> có cả cron lẫn dispatch, nên một lượt chạy tay và một lượt chạy theo lịch THẬT SỰ chồng lên nhau được.</p>

<div class="callout">
<p><strong>Một câu.</strong> <code>concurrency</code> quyết định một lần chạy bị vượt mặt sẽ CHẾT hay CHỜ, đáp án phụ thuộc vào việc lần chạy ấy có tác dụng phụ bắt buộc phải hoàn tất hay không, và nó KHÔNG làm cho thứ gì trở nên bất biến-theo-số-lần-chạy — một lần chạy đứng chờ đến lượt rồi ghi đè kết quả thì sai y hệt một lần chạy đua nhau.</p>
</div>

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
<p>The two failed runs took 80 and 334 seconds against a 458-second success average — failures are <strong>2.2× faster</strong> than successes here. Chapter 2 introduced this as a reading habit; the numbers make it a usable one:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">much shorter than usual</span><span class="lz-t">something bailed early</span><span class="lz-d">80 s against a 458 s norm. Look at the first job, not the last</span></div>
<div class="lz-step"><span class="lz-k">around usual</span><span class="lz-t">it ran, and something in it failed</span><span class="lz-d">334 s — far enough in that the build started. Look at where it stopped</span></div>
<div class="lz-step"><span class="lz-k">much longer than usual</span><span class="lz-t">something hung or retried</span><span class="lz-d">not present in this sample, and the one that <code>timeout-minutes</code> exists for</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — a performance regression test on run duration.</strong> A check that fails when the run exceeds some threshold will, on this workflow, fire on the 160-second run and stay quiet on the 155-second one, teaching everybody that the check is noise. If you want to catch real regressions, compare a rolling median against a baseline median with a margin of several standard deviations — or measure the specific step you care about, which is both quieter and more informative.</p>
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
<p>Hai lần chạy hỏng mất 80 và 334 giây so với trung bình thành công 458 giây — cú hỏng ở đây <strong>nhanh hơn 2,2 lần</strong> so với cú thành công. Chương 2 giới thiệu chuyện này như một thói quen ĐỌC; mấy con số biến nó thành một thói quen DÙNG ĐƯỢC:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">ngắn hơn thường lệ nhiều</span><span class="lz-t">có thứ gì bỏ cuộc sớm</span><span class="lz-d">80 s so với chuẩn 458 s. Hãy nhìn job ĐẦU TIÊN, đừng nhìn job cuối</span></div>
<div class="lz-step"><span class="lz-k">quanh mức thường lệ</span><span class="lz-t">nó có chạy, và có thứ gì trong đó hỏng</span><span class="lz-d">334 s — đủ sâu để bản dựng đã khởi động. Hãy nhìn chỗ nó DỪNG</span></div>
<div class="lz-step"><span class="lz-k">dài hơn thường lệ nhiều</span><span class="lz-t">có thứ gì treo hoặc thử lại</span><span class="lz-d">không có trong mẫu này, và đó là ca mà <code>timeout-minutes</code> sinh ra để lo</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — một phép kiểm chống thoái lui hiệu năng đặt trên THỜI LƯỢNG LẦN CHẠY.</strong> Một phép kiểm hỏng khi lần chạy vượt một ngưỡng nào đó thì, trên workflow này, sẽ nổ ở lần chạy 160 giây và im ở lần 155 giây, dạy cho mọi người rằng phép kiểm ấy là tiếng ồn. Nếu bạn muốn bắt thoái lui THẬT, hãy so một trung vị TRƯỢT với một trung vị nền, cách nhau vài độ lệch chuẩn — hoặc đo đúng cái bước bạn quan tâm, thứ vừa yên tĩnh hơn vừa nhiều thông tin hơn.</p>
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
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">0 — read the per-job timings first</span><span class="lz-lnote">two API calls, or the run page. Establishes the critical path before any change is considered. Skipping this step is what produces the 50%-for-nothing outcome above</span></div>
<div class="lz-layer"><span class="lz-lname">1 — remove <code>needs:</code> edges that are not data dependencies</span><span class="lz-lnote">the largest measured win here, at 72 seconds, and it costs no machine-seconds. Test: would the downstream job still be <em>correct</em> if the upstream one failed? If yes, the edge is preference</span></div>
<div class="lz-layer"><span class="lz-lname">2 — attack the slowest job <em>on the path</em></span><span class="lz-lnote">the macOS build at 437 seconds. Chapter 2 says where its time goes: 315 s building, 72 s installing, 27 s uploading. Each is a different fix</span></div>
<div class="lz-layer"><span class="lz-lname">3 — then the cheap one-liners</span><span class="lz-lnote"><code>cache:</code>, conditional steps, <code>fetch-depth</code>. Real, small, and worth doing once the structure is right — but never the first move, because you cannot tell whether they landed on the path</span></div>
<div class="lz-layer"><span class="lz-lname">4 — measure again, several runs</span><span class="lz-lnote">7.3: this workflow spans 100–160 seconds unchanged. Anything under thirty seconds needs a distribution, not a run</span></div>
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
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">0 — ĐỌC nhịp thời gian từng job TRƯỚC</span><span class="lz-lnote">hai lời gọi API, hoặc trang lần chạy. Xác lập đường tới hạn trước khi cân nhắc bất kỳ thay đổi nào. Bỏ qua bước này chính là thứ đẻ ra kết cục 50%-đổi-lấy-không bên trên</span></div>
<div class="lz-layer"><span class="lz-lname">1 — gỡ những cạnh <code>needs:</code> KHÔNG phải phụ thuộc dữ liệu</span><span class="lz-lnote">thắng lợi đo được lớn nhất ở đây, 72 giây, và nó không tốn máy-giây nào. Phép thử: job phía sau có còn cho ra kết quả <em>ĐÚNG</em> không nếu job phía trước hỏng? Nếu có, cạnh ấy là sở thích</span></div>
<div class="lz-layer"><span class="lz-lname">2 — đánh vào job chậm nhất <em>TRÊN ĐƯỜNG</em></span><span class="lz-lnote">bản dựng macOS 437 giây. Chương 2 nói thời gian nó đi đâu: 315 s dựng, 72 s cài, 27 s tải lên. Mỗi cái là một cách vá khác nhau</span></div>
<div class="lz-layer"><span class="lz-lname">3 — rồi mới tới mấy dòng lẻ rẻ tiền</span><span class="lz-lnote"><code>cache:</code>, bước có điều kiện, <code>fetch-depth</code>. Có thật, nhỏ, và đáng làm một khi cấu trúc đã đúng — nhưng KHÔNG BAO GIỜ là nước đi đầu tiên, bởi bạn không biết được chúng có rơi trúng đường tới hạn hay không</span></div>
<div class="lz-layer"><span class="lz-lname">4 — đo lại, vài lần chạy</span><span class="lz-lnote">bài 7.3: workflow này trải 100–160 giây khi không đổi gì. Mọi thứ dưới ba mươi giây đều cần một PHÂN BỐ, không phải một lần chạy</span></div>
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
<div class="out">billable: MACOS 0ms · UBUNTU 0ms · WINDOWS 0ms</div>

<p>Zero. Public repositories get GitHub-hosted standard runners free, with no minute allowance and no overage. Every timing in this course was measured on infrastructure that cost nothing.</p>

<h3>The counterfactual, computed from the same measurements</h3>
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

<h3>The cost that is not on any invoice</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">developer wait</span><span class="lz-lnote">141 seconds × 526 runs of <code>ci-lint</code> is about 20 hours of somebody watching a spinner — and that is the workflow that costs almost nothing in money. Wall-clock and money rank workflows differently, and 7.4 measured that they disagree here</span></div>
<div class="lz-layer"><span class="lz-lname">context switching</span><span class="lz-lnote">the real cost of a two-minute wait is rarely two minutes. It is the tab that gets opened while waiting. This is not measurable from an API and is the largest term in most people&#39;s experience of CI</span></div>
<div class="lz-layer"><span class="lz-lname">a red build that is not your fault</span><span class="lz-lnote">7.3 measured a 1.60× spread on identical work. Time spent investigating a slow run that was just a slow run is pure loss, and the defence is knowing the distribution</span></div>
<div class="lz-layer"><span class="lz-lname">maintenance</span><span class="lz-lnote">1,394 lines of YAML, nine duplicated SSH blocks (4.5), one dead cache (5.3), six actions whose runtime changed under an unedited file (4.2). CI is software, and it has the running costs of software</span></div>
</div>

<h3>The other side of the ledger</h3>
<p>Against all of that sits one measured event. Run <strong>32400097927</strong>: <code>vite build</code> exited 134 with <code>Reached heap limit</code> on the macOS leg. The developer&#39;s own machine had built the same commit green in twenty seconds.</p>

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
cu hong 32400097927 nam TRON trong tap 147 commit ay</div>

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
<div class="out">billable: MACOS 0ms · UBUNTU 0ms · WINDOWS 0ms</div>

<p>Bằng không. Kho công khai được dùng runner tiêu chuẩn do GitHub cấp miễn phí, không có hạn mức phút và không có phần vượt. Mọi phép đo thời gian trong khoá học này đều đo trên hạ tầng chẳng tốn đồng nào.</p>

<h3>Cái giả định, tính từ chính những phép đo ấy</h3>
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

<h3>Cái giá không nằm trên hoá đơn nào</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">thời gian người ta NGỒI CHỜ</span><span class="lz-lnote">141 giây × 526 lần chạy <code>ci-lint</code> là khoảng 20 giờ ai đó nhìn một cái vòng xoay — và đó lại là workflow gần như không tốn tiền. Thời gian đồng hồ và tiền xếp hạng các workflow KHÁC NHAU, và bài 7.4 đã đo rằng chúng bất đồng ở đây</span></div>
<div class="lz-layer"><span class="lz-lname">chuyển ngữ cảnh</span><span class="lz-lnote">cái giá thật của một lần chờ hai phút hiếm khi là hai phút. Nó là cái tab được mở ra trong lúc chờ. Thứ này KHÔNG đo được từ một API và là số hạng lớn nhất trong trải nghiệm CI của phần lớn mọi người</span></div>
<div class="lz-layer"><span class="lz-lname">một bản dựng đỏ mà không phải lỗi bạn</span><span class="lz-lnote">bài 7.3 đo biên độ 1,60 lần trên cùng khối việc. Thời gian bỏ ra điều tra một lần chạy chậm mà nó chỉ là một lần chạy chậm là mất trắng, và cách phòng là BIẾT cái phân bố</span></div>
<div class="lz-layer"><span class="lz-lname">bảo trì</span><span class="lz-lnote">1.394 dòng YAML, chín khối SSH trùng lặp (bài 4.5), một cái cache chết (bài 5.3), sáu action đổi runtime dưới một tệp không sửa (bài 4.2). CI là PHẦN MỀM, và nó có chi phí vận hành của phần mềm</span></div>
</div>

<h3>Phía bên kia của cán cân</h3>
<p>Đối trọng với tất cả những thứ trên là MỘT sự kiện đã đo được. Lần chạy <strong>32400097927</strong>: <code>vite build</code> thoát 134 với <code>Reached heap limit</code> ở nhánh macOS. Máy của chính người viết đã dựng đúng commit ấy XANH trong hai mươi giây.</p>

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
cu hong 32400097927 nam TRON trong tap 147 commit ay</div>

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
      description: 'Tám câu: đường tới hạn 543 trên 1.107 máy-giây, biên độ 1,60 lần trên cùng khối việc, hai `cancel-in-progress` ngược nhau, và 76% hoá đơn nằm ở một nhánh ma trận.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>What Chapter 7 measured</h2>
<p class="lead">Eight questions, twelve minutes. The chapter&#39;s recurring finding is that the intuitive target is usually the wrong one: the slowest job has slack, the biggest saving is off the path, and the cheapest workflow costs the most developer time.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">7.1 — critical path</span><span class="lz-lnote">1,107 machine-seconds in 555 wall-clock, with a 543-second floor; halving the Linux job returns zero</span></div>
<div class="lz-layer"><span class="lz-lname">7.2 — concurrency</span><span class="lz-lnote">two workflows, opposite <code>cancel-in-progress</code>, both right; and v0.5.40 built twice <em>despite</em> concurrency, because queueing is not idempotency</span></div>
<div class="lz-layer"><span class="lz-lname">7.3 — variance</span><span class="lz-lnote">100 s to 160 s on identical work — a 1.60× spread that swallows most optimisations whole</span></div>
<div class="lz-layer"><span class="lz-lname">7.4 — the ranking</span><span class="lz-lnote">the best measured speed-up deletes a <code>needs:</code> edge and changes no code; frequency reorders everything</span></div>
<div class="lz-layer"><span class="lz-lname">7.5 — cost</span><span class="lz-lnote">free here; 11,130 billable minutes if private, 76% of it one macOS leg</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Chương 7 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Phát hiện lặp đi lặp lại của chương là cái đích theo trực giác thường SAI: job chậm nhất lại đang có độ chùng, khoản tiết kiệm lớn nhất nằm ngoài đường tới hạn, và workflow rẻ nhất lại tốn nhiều thời gian con người nhất.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">7.1 — đường tới hạn</span><span class="lz-lnote">1.107 máy-giây gói trong 555 giây đồng hồ, với một cái sàn 543 giây; giảm một nửa job Linux trả về con số không</span></div>
<div class="lz-layer"><span class="lz-lname">7.2 — concurrency</span><span class="lz-lnote">hai workflow, <code>cancel-in-progress</code> ngược nhau, cả hai đều đúng; và v0.5.40 bị dựng hai lượt <em>DÙ ĐÃ CÓ</em> concurrency, bởi xếp hàng không phải bất biến-theo-số-lần-chạy</span></div>
<div class="lz-layer"><span class="lz-lname">7.3 — phương sai</span><span class="lz-lnote">100 s tới 160 s trên cùng khối việc — biên độ 1,60 lần nuốt trọn phần lớn các phép tối ưu</span></div>
<div class="lz-layer"><span class="lz-lname">7.4 — xếp hạng</span><span class="lz-lnote">phép tăng tốc đo được tốt nhất là XOÁ một cạnh <code>needs:</code> và không đổi một dòng mã; TẦN SUẤT sắp xếp lại mọi thứ</span></div>
<div class="lz-layer"><span class="lz-lname">7.5 — chi phí</span><span class="lz-lnote">ở đây miễn phí; 11.130 phút tính tiền nếu riêng tư, 76% con số ấy là MỘT nhánh macOS</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A run has 1,107 machine-seconds, 555 seconds of wall-clock, and a 543-second critical path. What does halving the 241-second Linux job achieve?|||Một lần chạy có 1.107 máy-giây, 555 giây đồng hồ, và đường tới hạn 543 giây. Giảm một nửa job Linux 241 giây đạt được gì?',
            options: [
              'Zero seconds of wall-clock — that job already finishes 3m17s early and is not on the critical path|||Không giây đồng hồ nào — job ấy vốn đã xong sớm 3m17s và KHÔNG nằm trên đường tới hạn',
              'About 120 seconds, proportional to its share of machine-seconds|||Khoảng 120 giây, tỉ lệ với phần máy-giây của nó',
              'It halves the whole run, because the jobs run sequentially|||Nó giảm một nửa cả lần chạy, vì các job chạy tuần tự',
              'It cannot be determined without knowing the queue times|||Không xác định được nếu chưa biết thời gian xếp hàng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the largest measured speed-up available on that run, and what does it cost?|||Phép tăng tốc đo được LỚN NHẤT trên lần chạy ấy là gì, và nó tốn gì?',
            options: [
              'Removing the check job from the needs: chain — 72 seconds, no code changed and no machine-seconds saved|||Gỡ job kiểm ra khỏi chuỗi needs: — 72 giây, không đổi mã và không tiết kiệm máy-giây nào',
              'Caching node_modules, worth 4.1 seconds|||Cache node_modules, đáng 4,1 giây',
              'Switching to a shallow clone, worth about 2 seconds|||Chuyển sang clone nông, đáng khoảng 2 giây',
              'Enabling fail-fast so failing runs end sooner|||Bật fail-fast để các lần chạy hỏng kết thúc sớm hơn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does deploy-ghcr.yml set `cancel-in-progress: true` while desktop-release.yml sets it to false?|||Vì sao deploy-ghcr.yml đặt `cancel-in-progress: true` còn desktop-release.yml đặt false?',
            options: [
              'A superseded deploy should die, but a release that is halfway through uploading assets must not be killed — the question is whether the run has side effects that must complete|||Một cuộc deploy bị vượt mặt thì nên chết, nhưng một cuộc phát hành đang tải tệp dở thì KHÔNG được giết — câu hỏi là lần chạy ấy có tác dụng phụ bắt buộc phải hoàn tất hay không',
              'Because one is triggered by push and the other by workflow_dispatch|||Vì một cái kích hoạt theo push còn cái kia theo workflow_dispatch',
              'Because cancel-in-progress must be false whenever a matrix is used|||Vì cancel-in-progress phải là false mỗi khi có dùng ma trận',
              'It is an inconsistency; one of the two is wrong|||Đó là một chỗ thiếu nhất quán; một trong hai là sai',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'v0.5.40 was built twice and the second run overwrote the first, even though `concurrency:` was configured. Why did concurrency not prevent it?|||v0.5.40 bị dựng hai lượt và lượt sau ghi đè lượt trước, dù `concurrency:` đã được cấu hình. Vì sao concurrency không ngăn được?',
            options: [
              'It queues rather than blocks — the second run waited its turn, then ran, then published over the existing release. Ordering is not idempotency|||Nó XẾP HÀNG chứ không CHẶN — lượt thứ hai chờ tới lượt, rồi chạy, rồi công bố đè lên bản phát hành đã có. Thứ tự không phải bất biến-theo-số-lần-chạy',
              'The concurrency group names were different|||Tên nhóm concurrency của hai lượt khác nhau',
              'cancel-in-progress was true, so the first run was killed|||cancel-in-progress là true nên lượt đầu bị giết',
              'Concurrency does not apply to workflow_dispatch runs|||Concurrency không áp dụng cho các lần chạy workflow_dispatch',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Ten consecutive runs of the same workflow on the same branch took 100 to 160 seconds. What follows for measuring an optimisation?|||Mười lần chạy liên tiếp của cùng một workflow trên cùng một nhánh mất 100 tới 160 giây. Từ đó suy ra gì cho việc đo một phép tối ưu?',
            options: [
              'Anything saving less than about thirty seconds cannot be told from noise in one run — measure the step, or measure a distribution|||Mọi thứ tiết kiệm dưới khoảng ba mươi giây đều không phân biệt được với tiếng ồn trong một lần chạy — hãy đo BƯỚC, hoặc đo một PHÂN BỐ',
              'The workflow has a performance bug that should be fixed first|||Workflow ấy có một lỗi hiệu năng cần vá trước',
              'Run durations are reliable; the spread came from a code change|||Thời lượng lần chạy đáng tin; biên độ ấy tới từ một thay đổi mã',
              'Use the fastest of several runs, since that is the true time|||Hãy lấy lần nhanh nhất trong vài lần chạy, vì đó mới là thời gian thật',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Failed runs of the release workflow took 80 and 334 seconds against a 458-second success average. How should that be read?|||Các lần chạy HỎNG của workflow phát hành mất 80 và 334 giây so với trung bình thành công 458 giây. Nên đọc điều đó thế nào?',
            options: [
              'Run duration is a triage signal before you open anything — much shorter than usual means something bailed early, so look at the first job|||Thời lượng lần chạy là một tín hiệu PHÂN LOẠI trước khi bạn mở bất cứ thứ gì — ngắn hơn thường lệ nhiều nghĩa là có thứ gì bỏ cuộc sớm, nên hãy nhìn job ĐẦU TIÊN',
              'Failures are cheaper, so they are not worth investigating|||Hỏng thì rẻ hơn nên không đáng điều tra',
              'The failures were cancelled runs rather than real failures|||Mấy lần hỏng ấy là các lần chạy bị huỷ chứ không phải hỏng thật',
              'It means the timeout was set too low|||Nó nghĩa là thời hạn được đặt quá thấp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In the private-repository estimate, the release workflow was 16% of runs. What share of billable minutes?|||Trong ước lượng cho kho riêng tư, workflow phát hành chiếm 16% số lần chạy. Nó chiếm bao nhiêu phần phút tính tiền?',
            options: [
              '76% — one macOS leg at the 10× multiplier with per-job minute rounding is 80 billable minutes for a 437-second job|||76% — một nhánh macOS ở hệ số 10× kèm làm tròn phút theo từng job là 80 phút tính tiền cho một job 437 giây',
              '16%, since billing is proportional to run count|||16%, vì tính tiền tỉ lệ với số lần chạy',
              'About 30%, since it is roughly three times longer per run|||Khoảng 30%, vì mỗi lần chạy nó dài gấp khoảng ba lần',
              '0%, because macOS runners are always free|||0%, vì runner macOS luôn miễn phí',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The build failure that most justified having CI was a macOS heap-limit crash. Where in the repository did it live?|||Cú hỏng bản dựng biện minh mạnh nhất cho việc có CI là một cú sập trần heap trên macOS. Nó nằm ở đâu trong kho?',
            options: [
              'In desktop/, which is inside the 73.5% of commits that trigger no CI on push — so it was only caught at release time, by the most expensive workflow|||Trong desktop/, tức là nằm trong cái 73,5% commit KHÔNG kích hoạt CI nào khi push — nên nó chỉ bị bắt vào lúc phát hành, bởi workflow đắt nhất',
              'In src/, which the paths filter covers on every push|||Trong src/, thứ mà bộ lọc paths phủ ở mọi cú push',
              'In the workflow file itself|||Trong chính tệp workflow',
              'In a third-party action that changed under its tag|||Trong một action bên thứ ba đã đổi dưới cái thẻ của nó',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
