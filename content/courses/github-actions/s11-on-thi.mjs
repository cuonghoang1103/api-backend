const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 11: Ôn tổng và kỳ thi cuối.
 * Số đo: một bản chốt các luật đo được của cả cuốn, và mười hai câu
 * kỳ thi bao trọn mười chương.
 */

export default {
  title: 'Chapter 11 — Wrap-up and final exam|||Chương 11 — Ôn tổng và kỳ thi cuối',
  slug: 'ga-ch11-on-thi',
  description: 'Hai bài: một bản chốt các luật đo được xuyên suốt cuốn — cái nào là bằng chứng, cái nào là niềm tin, và cái nào rẻ đến mức KHÔNG có lý do bỏ qua — và một kỳ thi mười hai câu, mười tám phút, ghép các bài học ngang qua mười chương.',
  sortOrder: 12,
  lessons: [

    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — What survived measurement|||11.1 — Cái sống sót qua đo đạc',
      slug: 'ga-11-1-chot',
      type: 'VIDEO',
      description: 'Bản chốt: các luật MẶC ĐỊNH đúng, các luật CHỈ đúng khi có số đo, và các cú tự-vá TRÔNG có ích và HỎNG âm thầm. Không phải một checklist — một cấu trúc kiến thức để đọc lại mỗi khi CI trên một kho MỚI khiến bạn không chắc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>What survived measurement</h2>
<p class="lead">Ten chapters of measurements collapse into three columns: what is true by default, what is true only when measured, and what is comfortable to believe and always wrong. Reading them in that shape makes it possible to apply this course to a repository you have never seen.</p>

<h3>Column 1 — always true</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a workflow is only what its YAML says</span><span class="lz-lnote">Ch 1 — the file is the whole contract; if the behaviour on push differs from the file, the file wins and something else is broken (the runner, the trigger, an override)</span></div>
<div class="lz-layer"><span class="lz-lname">an action pinned to a moving ref is a supply-chain surface you do not own</span><span class="lz-lnote">Ch 4, Ch 6 — <code>@main</code> and <code>@v3</code> both move; only a full-SHA pin cannot be rewritten silently</span></div>
<div class="lz-layer"><span class="lz-lname">a secret in <code>echo</code> is a secret in the log</span><span class="lz-lnote">Ch 6 — the mask is a display filter, not a data guarantee; anything derived from a secret must not reach stdout</span></div>
<div class="lz-layer"><span class="lz-lname">a checker that has never been red is not a checker</span><span class="lz-lnote">Ch 8, Ch 10 — verify the checker before trusting it; break the thing checked and confirm the check turns red</span></div>
<div class="lz-layer"><span class="lz-lname">deploying is not a side effect of pushing</span><span class="lz-lnote">Ch 9 — the two July 2026 outages here started from workflows racing on <code>push:</code>; dispatch-only removes the whole class</span></div>
</div>

<h3>Column 2 — true only when you have measured</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">cache hits save time</span><span class="lz-lnote">Ch 5 — sometimes true. In this repo <code>node_modules/.cache</code> never existed, so the "cache tsc incremental" step ran on a never-created path. Measure before believing</span></div>
<div class="lz-layer"><span class="lz-lname">matrix jobs are faster</span><span class="lz-lnote">Ch 7 — for embarrassingly parallel work, yes. For work with a shared bottleneck (npm registry, docker layer cache upload) they can be slower AND more expensive. Measure the wall-clock, not the CPU-time</span></div>
<div class="lz-layer"><span class="lz-lname">a flaky test is infrastructure noise</span><span class="lz-lnote">Ch 8 — sometimes true, more often the test has a race the harness surfaces intermittently. Re-run once to confirm; a second failure is real</span></div>
<div class="lz-layer"><span class="lz-lname">this action is safe because it has stars</span><span class="lz-lnote">Ch 4, Ch 6 — reputation is a prior, not a proof. Read the source, or pin to a reviewed SHA</span></div>
</div>

<h3>Column 3 — comfortable to believe and always wrong</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>|| true</code> makes the step "safe"</span><span class="lz-lnote">Ch 6, Ch 10 — it swallows the signal you needed. A step whose failure is invisible is worse than no step</span></div>
<div class="lz-layer"><span class="lz-lname">exit code 0 means success</span><span class="lz-lnote">Ch 6, Ch 10 — pkill returned 0 with the wrong process left alive; grep -c counted lines not matches; a pipe-fed <code>set -e</code> lost the exit status. Exit codes need a POST-CONDITION check</span></div>
<div class="lz-layer"><span class="lz-lname">the build being green means the image works</span><span class="lz-lnote">Ch 9 — 2026-08-18: build green, image bad, 7 minutes of 502. Add a libc-versus-engine check BEFORE push</span></div>
<div class="lz-layer"><span class="lz-lname">a failed migration is fixable with one command</span><span class="lz-lnote">Ch 10 — <code>--rolled-back</code> and <code>--applied</code> are both wrong in the middle state. The fix is a six-step protocol, not a flag</span></div>
</div>

<h3>Two operating rules on top of the columns</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">A</span><span class="lz-t">measure before you believe</span><span class="lz-d">Column 2 exists because most "obvious" optimisations are wrong on <em>this specific repository</em>. The measurement is often one command; the belief without it costs hours or a bad deploy.</span></div>
<div class="lz-step"><span class="lz-k">B</span><span class="lz-t">the auto-fix that fits the error is usually wrong</span><span class="lz-d">Column 3 is the same shape everywhere: the tool prints a solution, and the solution assumes the tool understood the problem. It did not. Read the error, list what ran, propose a fix, get it approved. Slow beats silently corrupt.</span></div>
</div>

<h3>The classes of failure this chapter catalogued</h3>
<p>Chapter 10 dated six real incidents. Each collapses to a class you can recognise on a new repo:</p>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">stale artifact</span><span class="lz-nsub">10.1</span></span>
<span class="lz-nbody">the code you see is not the code that ran. 404 with the file on disk, wrong bundle hash cached in the CDN, an image tag that was reused. Diagnose with an unauthenticated <code>curl</code>.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">checklist gap</span><span class="lz-nsub">10.2</span></span>
<span class="lz-nbody">the checklist ran what it configured to run. The failure happened in what it excluded. Widen the checklist against the concrete thing that broke.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">checker that cannot fire</span><span class="lz-nsub">10.3</span></span>
<span class="lz-nbody">a step that always passes is not a check. Break the thing checked and watch the step go red; if it does not, the step is decoration.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">name-based signalling in a renamed process</span><span class="lz-nsub">10.4</span></span>
<span class="lz-nbody">tool matches by a name the target can rewrite. Match by an invariant instead — port for daemons, container name for services, PID for tracked processes.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">state error mistaken for a command error</span><span class="lz-nsub">10.5</span></span>
<span class="lz-nbody">a failed migration is a question about the database's state, not about which flag to pass. Measure with <code>migrate diff</code> before choosing a resolve action.</span>
</div>
</div>

<h3>What to do on a NEW repository</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">read the workflow files first</span><span class="lz-lnote">not the README. The workflow files are the ground truth for what the CI actually does. Grep for <code>secrets.</code>, <code>uses:</code>, <code>run: |</code> — the concrete surface</span></div>
<div class="lz-layer"><span class="lz-lname">count SHA-pinned actions vs branch-pinned</span><span class="lz-lnote">the ratio tells you how much of your build's supply chain has already been reviewed. Under 50% is unusual</span></div>
<div class="lz-layer"><span class="lz-lname">grep for <code>|| true</code>, <code>continue-on-error</code>, <code>|| sleep</code></span><span class="lz-lnote">these are the shapes of silent-failure passes. Each is a place a checker might not fire</span></div>
<div class="lz-layer"><span class="lz-lname">look at the last five failed runs</span><span class="lz-lnote"><code>gh run list --status failure --limit 5</code>. Are they the same failure? Then something is being ignored. Are they different? Then people are pushing broken code and cleaning up after — measure how often</span></div>
<div class="lz-layer"><span class="lz-lname">measure one build's cache hit rate</span><span class="lz-lnote">enable debug logging (<code>ACTIONS_STEP_DEBUG=true</code>) on one run. Read the actual cache-miss lines. Believe those, not the intent of the yaml</span></div>
</div>

<div class="callout">
<p><strong>One sentence.</strong> This course is not a set of rules to memorise — it is a habit: every time a CI step surprises you, ask what the step MEASURED, decide whether it MEASURED what you thought, and if it did not, fix the measurement before you fix the code.</p>
</div>

<div class="pitfall">
<p><strong>Trap — treating the course as complete.</strong> Every repository has its own incident log, and every incident log adds a class this catalogue does not cover. The correct way to use this chapter is as a starter — the second time you diagnose a novel failure, add it to your own <code>CLAUDE.md</code>-shaped notes, with a date and a measurement.</p>
</div>

<h3>Sources for the next step</h3>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — where the CI ends and the operation starts</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the boundary this course stopped at: what you do once the artifact is built and the deploy has landed. Reads like a continuation of Chapter 9.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — the layer that GH cache hits and misses talk about</span><span class="lc-sub">/courses/docker/learn${REF} — build cache, layer invalidation, and what makes a Dockerfile cache-friendly. Chapter 5 assumed you had these primitives.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — the shell semantics behind the run block</span><span class="lc-sub">/courses/linux-bash/learn${REF} — <code>set -e</code>, pipe exit codes, subshells, argv rewriting. Half the traps in Chapters 6 and 10 are shell semantics wearing YAML clothes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — the source dataset for Chapter 10</span><span class="lc-sub">the incident log this repo maintains, with dates. The habit worth copying: every diagnosis becomes a dated row and a lesson.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Cái sống sót qua đo đạc</h2>
<p class="lead">Mười chương đo đạc gói vào ba cột: cái MẶC ĐỊNH đúng, cái CHỈ đúng khi đã đo, và cái thoải mái tin và LUÔN sai. Đọc theo hình dạng ấy khiến bạn có thể áp cuốn này lên một kho bạn chưa từng thấy.</p>

<h3>Cột 1 — luôn đúng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một workflow chỉ là cái YAML của nó nói</span><span class="lz-lnote">Ch 1 — file là toàn bộ hợp đồng; nếu hành vi trên push khác với file, file thắng và một cái gì khác hỏng (runner, trigger, một cú override)</span></div>
<div class="lz-layer"><span class="lz-lname">một action ghim vào tham chiếu di động là một bề mặt chuỗi cung ứng bạn không sở hữu</span><span class="lz-lnote">Ch 4, Ch 6 — <code>@main</code> và <code>@v3</code> đều di động; chỉ ghim theo SHA đầy đủ mới không thể bị viết lại âm thầm</span></div>
<div class="lz-layer"><span class="lz-lname">một bí mật trong <code>echo</code> là một bí mật trong log</span><span class="lz-lnote">Ch 6 — mask là bộ lọc hiển thị, không phải bảo đảm dữ liệu; bất cứ gì phái sinh từ bí mật KHÔNG được ra stdout</span></div>
<div class="lz-layer"><span class="lz-lname">một phép kiểm chưa từng đỏ KHÔNG phải phép kiểm</span><span class="lz-lnote">Ch 8, Ch 10 — xác thực phép kiểm trước khi tin; làm hỏng cái nó kiểm và xác nhận nó chuyển đỏ</span></div>
<div class="lz-layer"><span class="lz-lname">deploy KHÔNG phải hệ quả phụ của push</span><span class="lz-lnote">Ch 9 — hai sự cố tháng 7/2026 ở đây khởi từ hai workflow đua trên <code>push:</code>; dispatch-only gỡ nguyên cả lớp</span></div>
</div>

<h3>Cột 2 — chỉ đúng khi bạn đã đo</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">cache hit tiết kiệm thời gian</span><span class="lz-lnote">Ch 5 — đôi khi đúng. Trong kho này <code>node_modules/.cache</code> chưa bao giờ tồn tại, nên bước "cache tsc incremental" chạy trên một path chưa-bao-giờ-được-tạo. Đo trước khi tin</span></div>
<div class="lz-layer"><span class="lz-lname">matrix job nhanh hơn</span><span class="lz-lnote">Ch 7 — với việc song song hoàn hảo, đúng. Với việc có nút thắt chung (registry npm, upload cache layer docker) chúng có thể CHẬM HƠN VÀ đắt hơn. Đo wall-clock, không CPU-time</span></div>
<div class="lz-layer"><span class="lz-lname">một test flake là nhiễu hạ tầng</span><span class="lz-lnote">Ch 8 — đôi khi đúng, thường xuyên hơn thì test có một cuộc đua mà harness bộc lộ chập chờn. Chạy lại một lần để xác nhận; cú hỏng lần hai là thật</span></div>
<div class="lz-layer"><span class="lz-lname">action này AN TOÀN vì nó có sao</span><span class="lz-lnote">Ch 4, Ch 6 — danh tiếng là một xác suất tiên nghiệm, không phải bằng chứng. Đọc mã nguồn, hoặc ghim theo SHA đã review</span></div>
</div>

<h3>Cột 3 — thoải mái tin và LUÔN sai</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>|| true</code> làm bước "an toàn"</span><span class="lz-lnote">Ch 6, Ch 10 — nó nuốt tín hiệu bạn CẦN. Một bước mà cú hỏng VÔ HÌNH thì TỆ HƠN không có bước</span></div>
<div class="lz-layer"><span class="lz-lname">mã thoát 0 nghĩa là thành công</span><span class="lz-lnote">Ch 6, Ch 10 — pkill trả 0 với tiến trình sai để lại sống; grep -c đếm dòng không đếm khớp; một <code>set -e</code> qua pipe mất mã thoát. Mã thoát cần một kiểm HẬU-ĐIỀU-KIỆN</span></div>
<div class="lz-layer"><span class="lz-lname">build xanh nghĩa là ảnh chạy được</span><span class="lz-lnote">Ch 9 — 18/08/2026: build xanh, ảnh hỏng, bảy phút 502. Thêm phép kiểm libc-đối-lập-engine TRƯỚC push</span></div>
<div class="lz-layer"><span class="lz-lname">một migration hỏng vá được bằng một lệnh</span><span class="lz-lnote">Ch 10 — <code>--rolled-back</code> và <code>--applied</code> đều SAI ở trạng thái giữa. Cú vá là sáu-bước, không phải một cờ</span></div>
</div>

<h3>Hai luật vận hành trên các cột</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">A</span><span class="lz-t">đo trước khi tin</span><span class="lz-d">Cột 2 tồn tại vì hầu hết tối ưu "hiển nhiên" đều SAI trên <em>chính kho cụ thể này</em>. Số đo thường là một lệnh; niềm tin không có nó tốn hàng giờ hoặc một cú deploy hỏng.</span></div>
<div class="lz-step"><span class="lz-k">B</span><span class="lz-t">cú tự-vá khớp với lỗi thường SAI</span><span class="lz-d">Cột 3 có cùng hình dạng ở mọi nơi: công cụ in ra một giải pháp, và giải pháp giả định công cụ đã hiểu vấn đề. Nó KHÔNG. Đọc lỗi, liệt kê cái đã chạy, đề nghị cú vá, xin duyệt. CHẬM thắng HỎNG-ÂM-THẦM.</span></div>
</div>

<h3>Các lớp hỏng chương này đã liệt kê</h3>
<p>Chương 10 có ngày cho sáu sự cố thật. Mỗi cái gói vào một lớp bạn có thể nhận ra trên một kho mới:</p>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">tài sản cũ</span><span class="lz-nsub">10.1</span></span>
<span class="lz-nbody">mã bạn thấy KHÔNG phải mã đã chạy. 404 với file trên đĩa, hash gói sai được CDN cache, một tag ảnh đã bị dùng lại. Chẩn đoán bằng một cú <code>curl</code> không xác thực.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">lỗ hổng checklist</span><span class="lz-nsub">10.2</span></span>
<span class="lz-nbody">checklist đã chạy cái nó được CẤU HÌNH để chạy. Cú hỏng xảy ra ở cái nó LOẠI TRỪ. Mở rộng checklist đối chiếu với cái CỤ THỂ đã vỡ.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">phép kiểm không nổ được</span><span class="lz-nsub">10.3</span></span>
<span class="lz-nbody">một bước LUÔN qua không phải một phép kiểm. Làm hỏng cái nó kiểm và xem bước chuyển đỏ; nếu không, bước là đồ trang trí.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">tín hiệu theo-tên trong tiến trình đổi-tên</span><span class="lz-nsub">10.4</span></span>
<span class="lz-nbody">công cụ khớp bằng một tên đích có thể ghi đè. Khớp bằng một BẤT BIẾN thay vì — cổng cho daemon, tên container cho service, PID cho tiến trình được theo dõi.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">lỗi TRẠNG THÁI bị nhầm là lỗi LỆNH</span><span class="lz-nsub">10.5</span></span>
<span class="lz-nbody">một cú hỏng migration là câu hỏi về TRẠNG THÁI database, không phải về cờ nào truyền. Đo bằng <code>migrate diff</code> trước khi chọn hành động resolve.</span>
</div>
</div>

<h3>Cần làm gì trên một kho MỚI</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">đọc file workflow trước</span><span class="lz-lnote">không phải README. File workflow là sự thật gốc cho cái CI THẬT SỰ làm. Grep <code>secrets.</code>, <code>uses:</code>, <code>run: |</code> — bề mặt cụ thể</span></div>
<div class="lz-layer"><span class="lz-lname">đếm action ghim-SHA đối lập ghim-nhánh</span><span class="lz-lnote">tỉ lệ nói cho bạn biết bao nhiêu chuỗi cung ứng của build đã được review. Dưới 50% là bất thường</span></div>
<div class="lz-layer"><span class="lz-lname">grep <code>|| true</code>, <code>continue-on-error</code>, <code>|| sleep</code></span><span class="lz-lnote">đây là hình dạng của các cú qua hỏng-âm-thầm. Mỗi cái là một nơi phép kiểm có thể không nổ</span></div>
<div class="lz-layer"><span class="lz-lname">xem năm cú chạy hỏng gần nhất</span><span class="lz-lnote"><code>gh run list --status failure --limit 5</code>. Chúng cùng một cú hỏng? Thế thì có cái gì đang bị bỏ qua. Chúng khác nhau? Thế thì mọi người đang push mã vỡ và dọn dẹp sau — đo tần suất</span></div>
<div class="lz-layer"><span class="lz-lname">đo tỉ lệ cache hit của một build</span><span class="lz-lnote">bật debug logging (<code>ACTIONS_STEP_DEBUG=true</code>) trên một cuộc chạy. Đọc các dòng cache-miss THẬT. Tin những cái ấy, không phải ý định của yaml</span></div>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Cuốn này KHÔNG phải một tập luật để học thuộc — nó là một THÓI QUEN: mỗi khi một bước CI làm bạn ngạc nhiên, hỏi xem bước ấy ĐO cái gì, quyết định xem nó có ĐO cái bạn nghĩ không, và nếu không, sửa PHÉP ĐO trước khi sửa mã.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — xem cuốn này là XONG.</strong> Mỗi kho có sổ sự cố của riêng nó, và mỗi sự cố thêm một lớp mà catalog này KHÔNG bao phủ. Cách đúng để dùng chương này là như MỘT KHỞI ĐẦU — lần thứ hai bạn chẩn đoán một cú hỏng mới, hãy thêm nó vào ghi chú kiểu <code>CLAUDE.md</code> của chính bạn, với một ngày và một số đo.</p>
</div>

<h3>Nguồn cho bước kế</h3>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — nơi CI kết thúc và vận hành bắt đầu</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — ranh giới cuốn này DỪNG lại: bạn làm gì khi artifact đã dựng và cuộc deploy đã đáp. Đọc như một cú tiếp nối Chương 9.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — tầng mà cache hit và miss của GH nói về</span><span class="lc-sub">/courses/docker/learn${REF} — cache dựng, tầng vô hiệu hoá, và cái làm một Dockerfile thân-với-cache. Chương 5 giả định bạn có các nguyên tố này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — ngữ nghĩa shell đằng sau khối run</span><span class="lc-sub">/courses/linux-bash/learn${REF} — <code>set -e</code>, mã thoát pipe, subshell, viết lại argv. Nửa số bẫy ở Chương 6 và 10 là ngữ nghĩa shell mặc quần áo YAML.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — bộ dữ liệu nguồn cho Chương 10</span><span class="lc-sub">sổ sự cố kho này duy trì, có ngày. Thói quen đáng chép: mỗi chẩn đoán trở thành một dòng có ngày và một bài học.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — Final exam|||11.2 — Kỳ thi cuối',
      slug: 'ga-11-2-thi-cuoi',
      type: 'QUIZ',
      description: 'Mười hai câu, mười tám phút. Kỳ thi bao trọn mười chương — trigger, expression, cache, secret, matrix, deploy, chẩn đoán. Bạn hoặc đã đo, hoặc đang đoán.',
      content: `
<div class="ml-en">
<span class="eyebrow">GitHub Actions · Final exam</span>
<h2>Twelve across ten chapters</h2>
<p class="lead">Twelve questions, eighteen minutes. The exam cross-cuts chapters — each question is a real diagnosis or a real trade-off from this repository's measurements.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">what is being tested</span><span class="lz-lnote">whether you can read a workflow file for what it actually does, versus what it was hoped to do</span></div>
<div class="lz-layer"><span class="lz-lname">how to answer</span><span class="lz-lnote">the correct option is the one you can back with a MEASUREMENT, not the one that reads like common sense</span></div>
<div class="lz-layer"><span class="lz-lname">what "trap" answers look like</span><span class="lz-lnote">shorter, more confident, cited an authority ("the docs say..."). If you cannot cite a MEASUREMENT, it is a trap</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">GitHub Actions · Kỳ thi cuối</span>
<h2>Mười hai câu ngang mười chương</h2>
<p class="lead">Mười hai câu, mười tám phút. Kỳ thi cắt ngang các chương — mỗi câu là một cuộc chẩn đoán THẬT hoặc một sự đánh đổi THẬT từ các số đo của kho này.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">cái đang được kiểm</span><span class="lz-lnote">liệu bạn có đọc được file workflow theo cái nó THẬT SỰ làm, đối lập với cái nó được KỲ VỌNG làm</span></div>
<div class="lz-layer"><span class="lz-lname">cách trả lời</span><span class="lz-lnote">lựa chọn đúng là cái bạn có thể chống lưng bằng một SỐ ĐO, không phải cái đọc như lẽ thường</span></div>
<div class="lz-layer"><span class="lz-lname">các đáp án BẪY trông thế nào</span><span class="lz-lnote">ngắn hơn, tự tin hơn, viện dẫn thẩm quyền ("docs nói..."). Nếu bạn không dẫn được một SỐ ĐO, đó là bẫy</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 1080,
        questions: [
          {
            question: 'A workflow triggered by <code>on: pull_request_target</code> that runs untrusted code from the fork is dangerous. Why is this pattern in the docs at all?|||Một workflow trigger bởi <code>on: pull_request_target</code> mà chạy mã không tin từ fork là NGUY HIỂM. Vì sao khuôn mẫu này lại có trong docs?',
            options: [
              'Because it runs in the base repo\'s context, giving it write access — for legitimate cases (label a PR, comment on the diff) that is exactly what is needed. It is dangerous when combined with checkout of untrusted code|||Vì nó chạy trong ngữ cảnh của repo base, cho quyền write — cho các case hợp pháp (gắn label PR, comment lên diff) đó chính là cái cần. Nó NGUY HIỂM khi kết hợp với checkout mã không tin',
              'Because pull_request is deprecated and pull_request_target is the replacement|||Vì pull_request bị bỏ và pull_request_target là bản thay',
              'Because pull_request_target skips CI on fork PRs, saving minutes|||Vì pull_request_target bỏ qua CI trên PR fork, tiết kiệm phút',
              'Because it is the only way to run on public repositories|||Vì đó là cách duy nhất để chạy trên kho công khai',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You have three actions in a workflow: <code>@main</code>, <code>@v3</code>, <code>@a1b2c3d4...</code>. Which one CANNOT be silently rewritten to run different code?|||Bạn có ba action trong workflow: <code>@main</code>, <code>@v3</code>, <code>@a1b2c3d4...</code>. Cái nào KHÔNG THỂ bị viết lại âm thầm để chạy mã khác?',
            options: [
              'The SHA-pinned one. Branches move, tags can be re-pointed, only full SHAs cannot be reassigned to different content|||Cái ghim SHA. Nhánh di chuyển, tag có thể trỏ lại, chỉ SHA đầy đủ không thể gán lại cho nội dung khác',
              'The @v3 tag, because major versions are frozen by convention|||Tag @v3, vì major version bị đóng băng theo quy ước',
              'The @main branch, because branches are protected by default|||Nhánh @main, vì nhánh được bảo vệ mặc định',
              'None; GitHub Actions caches the code so all three are frozen after first use|||Không cái nào; GitHub Actions cache mã nên cả ba đều bị đóng băng sau lần dùng đầu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A cache step reports 100% hit rate but the job time did not drop. What is the most likely cause?|||Một bước cache báo tỉ lệ hit 100% nhưng thời gian job không giảm. Nguyên nhân khả dĩ nhất?',
            options: [
              'The cached path was never a bottleneck — the tool being cached did not use it, or the directory did not exist. Measure the cache DOWNLOAD time against the operation it was meant to save|||Path được cache chưa bao giờ là bottleneck — công cụ được cache không dùng nó, hoặc thư mục không tồn tại. Đo thời gian TẢI cache đối lập với thao tác nó lẽ ra tiết kiệm',
              'The cache was corrupted; delete and re-run|||Cache hỏng; xoá và chạy lại',
              'The runner is slower this week; wait for GitHub to fix it|||Runner tuần này chậm; chờ GitHub sửa',
              'The cache key includes a timestamp so hits are actually misses|||Key cache có timestamp nên hit thật ra là miss',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A colleague adds <code>echo "TOKEN=$SECRET_TOKEN"</code> to debug a workflow. The mask ***s it in the log. Is the token safe?|||Đồng nghiệp thêm <code>echo "TOKEN=$SECRET_TOKEN"</code> để debug. Mask *** nó trong log. Token có AN TOÀN không?',
            options: [
              'No — the mask is a display filter, not a data guarantee. Anyone who can access the raw log stream, an unmasked derivation, or a value derived from the secret (base64, curl body) sees it. Rotate the secret|||KHÔNG — mask là bộ lọc HIỂN THỊ, không phải bảo đảm dữ liệu. Ai có quyền tới log thô, một cú phái sinh không-mask, hoặc một giá trị phái sinh từ bí mật (base64, body curl) đều thấy. Xoay bí mật',
              'Yes, GitHub encrypts logs with the same key that encrypts secrets|||Có, GitHub mã hoá log bằng cùng khoá mã hoá bí mật',
              'Yes, if the log is deleted within 24 hours no exposure occurred|||Có, nếu log bị xoá trong 24 giờ thì không có phơi bày',
              'Yes, because <code>echo</code> writes to stderr, not stdout|||Có, vì <code>echo</code> ghi ra stderr, không stdout',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A matrix of 10 jobs takes 12 minutes wall-clock; a single sequential job would take 40 minutes. But the billed minutes are 120 vs 40. When is the matrix worth it?|||Một matrix 10 job tốn 12 phút wall-clock; một job tuần tự duy nhất tốn 40 phút. Nhưng phút bị tính là 120 đối lập 40. Khi nào matrix ĐÁNG?',
            options: [
              'When the wall-clock reduction unlocks something time-sensitive (a deploy queue, a developer waiting) worth more than the extra 80 minutes of billed compute|||Khi giảm wall-clock GỠ CHẶN cái nhạy-với-thời-gian (một hàng đợi deploy, một dev đang chờ) đáng giá hơn 80 phút compute tính thêm',
              'Always, because parallel is always better|||Luôn luôn, vì song song luôn tốt hơn',
              'Never, because the billing math never comes out ahead|||Không bao giờ, vì phép tính hoá đơn không bao giờ có lợi',
              'Only when the underlying test suite has zero shared state|||Chỉ khi bộ test bên dưới không có trạng thái chung',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repository moved from push-to-deploy to dispatch-only. What class of failure did that eliminate?|||Kho này chuyển từ push-để-deploy sang dispatch-only. Nó loại bỏ lớp hỏng nào?',
            options: [
              'Two deploy workflows racing on the same push and overwriting each other\'s state (image tag, migration, container recreate). CLAUDE.md dates two July 2026 outages to exactly this|||Hai workflow deploy đua nhau trên cùng cú push và ghi đè trạng thái của nhau (tag ảnh, migration, recreate container). CLAUDE.md ghi ngày cho hai sự cố tháng 7/2026 đúng cái này',
              'A malicious PR triggering a deploy from a fork|||Một PR độc trigger deploy từ fork',
              'Rate limits from GitHub for too many pushes|||Rate limit từ GitHub vì quá nhiều push',
              'Merge conflicts blocking the deploy branch|||Xung đột merge chặn nhánh deploy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A route works locally but returns 404 in production. What one command decides whether it is a stale build or a missing route?|||Một route chạy local mà trả 404 ở production. Một lệnh nào quyết định giữa bản-dựng-cũ và route thiếu?',
            options: [
              '<code>curl -sI</code> without auth: 404 = route not mounted (stale image or wrong version), 401 = route mounted but needs auth (route exists, deploy is current)|||<code>curl -sI</code> không xác thực: 404 = route KHÔNG mount (ảnh cũ hoặc sai version), 401 = route mount nhưng cần auth (route tồn tại, deploy hiện tại)',
              'Check the deploy job\'s exit code; 0 = success|||Kiểm mã thoát của job deploy; 0 = thành công',
              'Restart the container to force reload|||Restart container để buộc tải lại',
              'Diff the git working tree against origin/main|||Diff cây làm việc git đối lập origin/main',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'CLAUDE.md says <code>tsc --noEmit</code> passed but seed broke on prod after an enum rename. Which measurement in the checklist was missing?|||CLAUDE.md nói <code>tsc --noEmit</code> qua nhưng seed vỡ ở prod sau khi đổi tên enum. Số đo nào trong checklist đã THIẾU?',
            options: [
              'A typecheck for <code>prisma/**</code> using a tsconfig whose enum types come from <code>@prisma/client</code> — plus <code>prisma db seed</code> as a runtime dry-run|||Một cú typecheck cho <code>prisma/**</code> dùng một tsconfig có type enum lấy từ <code>@prisma/client</code> — cộng với <code>prisma db seed</code> như một cú thử chạy',
              'A linter run to catch the rename|||Một cú chạy linter để bắt cú đổi tên',
              'A staging deploy before production|||Một cú deploy staging trước production',
              'A code review checkpoint on schema changes|||Một điểm review mã trên thay đổi schema',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A frontend smoke test in <code>deploy.sh</code> called <code>wget</code> inside a container that omits <code>wget</code>. It failed six times per deploy, silently, wasting ~25s. What is the smallest fix that keeps the check?|||Smoke test frontend trong <code>deploy.sh</code> gọi <code>wget</code> bên trong container không có <code>wget</code>. Nó hỏng sáu lần mỗi deploy, âm thầm, đốt ~25s. Cú vá NHỎ NHẤT giữ được phép kiểm là gì?',
            options: [
              'Replace <code>wget</code> with <code>node -e</code> using the built-in <code>http</code> module — that is what the container\'s own healthcheck uses, so it is guaranteed present|||Thay <code>wget</code> bằng <code>node -e</code> dùng module <code>http</code> built-in — đó là cái healthcheck của container dùng, nên đảm bảo có',
              'Install wget in the Dockerfile|||Cài wget trong Dockerfile',
              'Add <code>|| true</code> to prevent the failures|||Thêm <code>|| true</code> để chặn các cú hỏng',
              'Delete the smoke test since it does not work|||Xoá smoke test vì nó không chạy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You run <code>pkill -f "next start"</code>, exit 0, but the port stays busy. Why?|||Bạn chạy <code>pkill -f "next start"</code>, exit 0, nhưng cổng vẫn bận. Vì sao?',
            options: [
              'Node rewrites the child process\'s argv to <code>next-server ...</code> — <code>pkill -f</code> matched the launcher (<code>next start</code>) and returned 0, but the actual daemon has a different argv and survives|||Node ghi đè argv của tiến trình con thành <code>next-server ...</code> — <code>pkill -f</code> khớp bộ khởi động (<code>next start</code>) và trả 0, nhưng daemon THẬT SỰ có argv khác và sống sót',
              '<code>pkill</code> is asynchronous; the process needs a few seconds to actually die|||<code>pkill</code> bất đồng bộ; tiến trình cần vài giây để chết thật',
              'The port is bound by systemd, not the process|||Cổng được systemd bind, không phải tiến trình',
              'There are two servers, one on IPv4 and one on IPv6, and pkill only got one|||Có hai server, một trên IPv4 và một trên IPv6, và pkill chỉ được một',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A migration failed with 3 of 5 statements applied. <code>prisma migrate deploy</code> now returns P3009 on every deploy. What do you do FIRST?|||Một migration hỏng với 3 trên 5 câu lệnh áp dụng. <code>prisma migrate deploy</code> giờ trả P3009 ở mọi cuộc deploy. Bạn làm gì ĐẦU TIÊN?',
            options: [
              'Run <code>prisma migrate diff --from-migrations ./prisma/migrations --to-database-url $DATABASE_URL --script</code> to measure the actual drift, THEN decide with an approver|||Chạy <code>prisma migrate diff --from-migrations ./prisma/migrations --to-database-url $DATABASE_URL --script</code> để đo cái lệch THẬT, RỒI quyết định với người phê duyệt',
              'Run <code>prisma migrate resolve --rolled-back</code> to reset the state|||Chạy <code>prisma migrate resolve --rolled-back</code> để reset trạng thái',
              'Run <code>prisma migrate reset</code> to start clean|||Chạy <code>prisma migrate reset</code> để bắt đầu sạch',
              'Rewrite the migration with <code>CREATE TABLE IF NOT EXISTS</code> and re-deploy|||Viết lại migration với <code>CREATE TABLE IF NOT EXISTS</code> và deploy lại',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You inherit a CI on a NEW repository. What is the single highest-value thing to grep for before trusting the workflows?|||Bạn thừa kế CI trên một kho MỚI. Một thứ đáng grep NHẤT trước khi tin các workflow là gì?',
            options: [
              '<code>|| true</code>, <code>continue-on-error</code>, and <code>|| sleep</code> — these are the shapes of silent-failure passes; each is a place a checker might not fire|||<code>|| true</code>, <code>continue-on-error</code>, và <code>|| sleep</code> — đây là hình dạng của các cú qua hỏng-âm-thầm; mỗi cái là một nơi phép kiểm có thể không nổ',
              '<code>TODO</code> and <code>FIXME</code> comments|||Comment <code>TODO</code> và <code>FIXME</code>',
              'Deprecated action versions|||Version action bị bỏ',
              'YAML anchors that are hard to read|||YAML anchor khó đọc',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
