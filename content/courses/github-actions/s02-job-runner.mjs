const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 2: Job và runner.
 * Số đo: run 32662461744 đọc qua API — 5 job, 5 runner_id, ba nền tảng,
 * và 5 phút 12 giây máy dựng-xong-không-dùng-được.
 */

export default {
  title: 'Chapter 2 — Jobs, runners, and the machines that wait|||Chương 2 — Job, runner, và những cỗ máy ngồi chờ',
  slug: 'ga-ch2-job-runner',
  description: 'Một lần chạy, 5 job, 5 `runner_id` khác nhau — không gì sống sót giữa hai job. Ba nền tảng chạy CÙNG một lệnh chênh nhau 2,8 lần. Và `needs:` đợi TRỌN ma trận, để lại 5m12s máy đã dựng xong mà không dùng được.',
  sortOrder: 3,
  lessons: [

    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — A job is a whole machine, and you get a new one every time|||2.1 — Một job là cả một cỗ máy, và mỗi lần bạn được một cái mới',
      slug: 'ga-2-1-may-moi',
      type: 'VIDEO',
      description: 'Một lần chạy, 5 job, và 5 `runner_id` khác nhau — đo qua API chứ không suy từ tài liệu. Xếp hàng 2–3 giây, đối chiếu với 41–268 phút của cron. Và danh sách chính xác những gì KHÔNG sống sót giữa hai job.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>A job is a whole machine, and you get a new one every time</h2>
<p class="lead">The word "job" suggests something small — a task, a unit of work. It is not small. Each job in a workflow gets its own virtual machine, booted for that job, thrown away when the job ends. Almost every confusing thing about Actions follows from that one fact, so this lesson establishes it by measurement rather than by assertion.</p>

<h3>The measurement</h3>
<p>Run 32662461744 of this repository&#39;s desktop release had five jobs. The API reports a <code>runner_id</code> for each one:</p>

<div class="out">job           nen tang          runner_id   XEP HANG     CHAY
--------------------------------------------------------------
Kiem tra ma   ubuntu-latest    1000003394         3s      72s
Dung Linux    ubuntu-latest    1000003395         3s     241s
Dung macOS    macos-latest     1000003396         3s     437s
Dung Windows  windows-latest   1000003397         3s     323s
Cong bo       ubuntu-latest    1000003398         2s      34s

5 job -> 5 runner_id KHAC NHAU: [1000003394 .. 1000003398]</div>

<div class="callout">
<p><strong>Five jobs, five machines.</strong> Note that three of them asked for the same label, <code>ubuntu-latest</code>, and still got three different runners. "Same label" means "same kind of machine", never "the same machine". There is no arrangement of workflow syntax that gets two jobs onto one runner.</p>
</div>

<h3>What that costs you, concretely</h3>
<p>Everything a job does to its own filesystem, environment, or installed software is gone when the job ends. The list is longer than people expect:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">the checked-out repository</span><span class="lz-lnote">every job that wants the code runs <code>actions/checkout</code> again. Five jobs, five clones</span></div>
<div class="lz-layer"><span class="lz-lname"><code>node_modules</code> and every other install</span><span class="lz-lnote"><code>npm ci</code> in job A does nothing for job B. This is the single largest source of wasted CI minutes, and Chapter 5 measures the cache that fixes it</span></div>
<div class="lz-layer"><span class="lz-lname">files your steps wrote</span><span class="lz-lnote">a build output in <code>dist/</code> exists only inside the job that produced it. Getting it to the next job requires an artifact — an explicit upload and download, measured in 2.2</span></div>
<div class="lz-layer"><span class="lz-lname">environment variables you exported</span><span class="lz-lnote">and, within a job, even between <em>steps</em>: a plain <code>export FOO=bar</code> in one <code>run:</code> block is invisible to the next one, because each step is a separate shell process</span></div>
<div class="lz-layer"><span class="lz-lname">running background processes</span><span class="lz-lnote">a database you started, a server you backgrounded — all killed. The machine is destroyed, not tidied</span></div>
<div class="lz-layer"><span class="lz-lname">anything the job installed with apt/brew/choco</span><span class="lz-lnote">24 seconds of system libraries in one job buys the next job nothing</span></div>
</div>

<p>What <em>does</em> survive is deliberately narrow: artifacts (uploaded explicitly, retained for a configured period), caches (keyed, best-effort, and never guaranteed), job outputs (small strings, declared), and whatever you pushed to a real external system such as a registry or a server.</p>

<div class="pitfall">
<p><strong>Bẫy — expecting <code>export</code> to reach the next step.</strong> Each <code>run:</code> block is its own shell. <code>export VERSION=1.2.3</code> in step 4 is simply gone by step 5. The mechanism that does work is writing to the file named by <code>\$GITHUB_ENV</code>: <code>echo "VERSION=1.2.3" &gt;&gt; \$GITHUB_ENV</code> makes <code>\$VERSION</code> available in every <em>later</em> step — but still not in the step that wrote it, and never in another job.</p>
</div>

<h3>Queueing is fast — and this is the surprising part</h3>
<p>Look at the queue column again: 2 to 3 seconds from job creation to job start, for all five jobs, including the macOS and Windows ones. Compare that with the other number this course has measured:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a job waiting for a runner</span><span class="lz-t">2–3 seconds</span><span class="lz-d">measured across five jobs on three platforms in one run</span></div>
<div class="lz-step"><span class="lz-k">a scheduled run waiting to be queued</span><span class="lz-t">41–268 minutes</span><span class="lz-d">measured across ten runs in lesson 1.3</span></div>
</div>

<div class="callout ok">
<p><strong>These are two different systems and it is worth keeping them apart.</strong> Once a run exists, getting machines for its jobs is quick. The multi-hour delay in lesson 1.3 happens <em>before</em> that — in deciding to create the run at all. So "CI is slow today" almost never means the runner pool is short; it means either your jobs genuinely take that long, or the run was late to be created. The distinction tells you which number to go look at.</p>
</div>

<h3>Picking the machine: <code>runs-on</code></h3>
<p>Across this repository&#39;s eleven workflows:</p>

<div class="out">runs-on: ubuntu-24.04    11   <- GHIM phien ban
runs-on: ubuntu-latest    2
runs-on: \${{ matrix.os }}  1   <- no ra macos-latest, windows-latest, ubuntu-latest</div>

<p>Eleven pinned against two floating is a deliberate ratio, and the reasoning is the same as pinning a dependency version. <code>ubuntu-latest</code> is not a constant: it moved from 20.04 to 22.04 to 24.04, each time on a rollout schedule, and each move changed preinstalled tool versions underneath workflows that had not been edited. A workflow that was green on Friday can be red on Monday with no commit in between.</p>

<div class="kv-grid">
<div class="kv"><span class="k">pinned — <code>ubuntu-24.04</code></span><span class="v">changes when you change it. The cost is that you must eventually move, and GitHub deprecates old images on a published timeline</span></div>
<div class="kv"><span class="k">floating — <code>ubuntu-latest</code></span><span class="v">changes when GitHub changes it. The benefit is you never do the migration yourself; the cost is you do not choose when it happens</span></div>
<div class="kv"><span class="k">the reasonable split</span><span class="v">pin anything whose failure blocks a deploy; float things where a surprise is cheap. This repository pins its lint and deploy paths and floats the desktop release matrix</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — treating a preinstalled tool as a stable interface.</strong> Runner images ship a large set of preinstalled software, and it is tempting to just call <code>node</code>, <code>python</code> or <code>docker</code> and rely on whatever is there. Those versions change with the image. The fix is not to distrust the runner but to <em>declare</em>: <code>actions/setup-node@v4</code> with an explicit version costs 8 to 22 seconds — measured on the three platforms in 2.3 — and makes the version a property of your workflow instead of a property of GitHub&#39;s rollout schedule.</p>
</div>

<h3>The runner is a real machine, and you can look at it</h3>
<p>Two habits pay for themselves the first time a job behaves impossibly. Neither needs any tooling:</p>

<pre><code>- name: Cai gi dang chay o day
  run: |
    <span class="tok-comment"># danh tinh may</span>
    uname -a
    echo "runner: \$RUNNER_OS \$RUNNER_ARCH"
    <span class="tok-comment"># tai nguyen — cai nay giai thich phan lon cu OOM</span>
    nproc; free -h; df -h /
    <span class="tok-comment"># phien ban that cua thu ban dang goi</span>
    node --version; npm --version</code></pre>

<p>The memory line in particular is worth having in your reflexes. The most expensive CI failure in this repository&#39;s history was <code>vite build</code> exiting 134 with <code>Reached heap limit</code> on a macOS runner while building green in twenty seconds on a developer machine with far more RAM. The runner was not broken and the code was not wrong; the two machines were different sizes, which is exactly the fact this lesson is about.</p>

<div class="callout ok">
<p><strong>The one sentence.</strong> A job is a machine you rent for the length of the job, and the design consequence is that <em>every</em> transfer of state — between jobs, between runs, between steps — has to be something you asked for explicitly, and therefore something you can find in the YAML when it is missing.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using GitHub-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners — the hardware specs per platform, the available labels, and the statement that each job runs in a fresh instance.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images</span><span class="lc-sub">github.com/actions/runner-images — the actual image definitions, the full preinstalled-software list per image, and the announcement issues for every image rollout. This is where you check what changed when a green workflow goes red without a commit.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: GITHUB_ENV and GITHUB_OUTPUT</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — the supported ways to move a value from one step to a later one, and why <code>export</code> is not among them.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — a container is a process, and what dies with it</span><span class="lc-sub">/courses/docker/learn${REF} — the same disposable-machine model one level down, including why "it worked in my container" and "it worked on my runner" fail for identical reasons.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — each command is a process, and environment inheritance</span><span class="lc-sub">/courses/linux-bash/learn${REF} — why <code>export</code> in one shell cannot reach another, which is the whole explanation for the step-to-step trap above.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Một job là cả một cỗ máy, và mỗi lần bạn được một cái mới</h2>
<p class="lead">Chữ "job" gợi ra thứ gì đó nhỏ — một tác vụ, một đơn vị công việc. Nó không nhỏ. Mỗi job trong một workflow được cấp một máy ảo riêng, khởi động cho đúng job đó, vứt đi khi job kết thúc. Gần như mọi thứ khó hiểu ở Actions đều chảy ra từ đúng một sự thật ấy, nên bài này xác lập nó bằng SỐ ĐO chứ không bằng khẳng định.</p>

<h3>Phép đo</h3>
<p>Lần chạy 32662461744 của bản phát hành desktop kho này có năm job. API báo một <code>runner_id</code> cho từng cái:</p>

<div class="out">job           nen tang          runner_id   XEP HANG     CHAY
--------------------------------------------------------------
Kiem tra ma   ubuntu-latest    1000003394         3s      72s
Dung Linux    ubuntu-latest    1000003395         3s     241s
Dung macOS    macos-latest     1000003396         3s     437s
Dung Windows  windows-latest   1000003397         3s     323s
Cong bo       ubuntu-latest    1000003398         2s      34s

5 job -> 5 runner_id KHAC NHAU: [1000003394 .. 1000003398]</div>

<div class="callout">
<p><strong>Năm job, năm cỗ máy.</strong> Để ý ba trong số đó xin cùng một nhãn, <code>ubuntu-latest</code>, mà vẫn nhận ba runner khác nhau. "Cùng nhãn" nghĩa là "cùng LOẠI máy", không bao giờ nghĩa là "cùng MỘT máy". Không có cách sắp xếp cú pháp workflow nào đưa được hai job lên chung một runner.</p>
</div>

<h3>Nó khiến bạn mất gì, cụ thể</h3>
<p>Mọi thứ một job làm với hệ tệp, môi trường hay phần mềm cài thêm của chính nó đều biến mất khi job kết thúc. Danh sách dài hơn người ta tưởng:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">kho mã đã checkout</span><span class="lz-lnote">mỗi job muốn có mã đều phải chạy <code>actions/checkout</code> lại. Năm job, năm bản sao</span></div>
<div class="lz-layer"><span class="lz-lname"><code>node_modules</code> và mọi lần cài khác</span><span class="lz-lnote"><code>npm ci</code> ở job A chẳng làm gì cho job B. Đây là nguồn phí phạm phút CI lớn nhất, và Chương 5 đo cái cache vá nó</span></div>
<div class="lz-layer"><span class="lz-lname">file các bước của bạn đã ghi</span><span class="lz-lnote">một bản dựng trong <code>dist/</code> chỉ tồn tại bên trong job đã tạo ra nó. Đưa nó sang job kế đòi một artifact — một lượt tải lên và tải xuống tường minh, đo ở bài 2.2</span></div>
<div class="lz-layer"><span class="lz-lname">biến môi trường bạn đã export</span><span class="lz-lnote">và ngay trong một job, giữa các <em>bước</em> cũng vậy: một câu <code>export FOO=bar</code> trơn ở khối <code>run:</code> này thì khối kế không thấy, vì mỗi bước là một tiến trình shell riêng</span></div>
<div class="lz-layer"><span class="lz-lname">tiến trình nền đang chạy</span><span class="lz-lnote">một cơ sở dữ liệu bạn khởi động, một server bạn đẩy xuống nền — đều bị giết. Cái máy bị PHÁ HUỶ, không phải dọn dẹp</span></div>
<div class="lz-layer"><span class="lz-lname">mọi thứ job cài bằng apt/brew/choco</span><span class="lz-lnote">24 giây cài thư viện hệ thống ở job này mua được con số không cho job kế</span></div>
</div>

<p>Thứ <em>có</em> sống sót thì hẹp một cách cố ý: artifact (tải lên tường minh, giữ trong một thời hạn có cấu hình), cache (theo khoá, cố-gắng-hết-sức, và không bao giờ được bảo đảm), output của job (chuỗi ngắn, phải khai báo), và bất cứ thứ gì bạn đã đẩy tới một hệ thống ngoài thật sự như một registry hay một máy chủ.</p>

<div class="pitfall">
<p><strong>Bẫy — trông chờ <code>export</code> tới được bước kế.</strong> Mỗi khối <code>run:</code> là một shell riêng. <code>export VERSION=1.2.3</code> ở bước 4 đơn giản là biến mất ở bước 5. Cơ chế thật sự chạy được là ghi vào tệp mà <code>\$GITHUB_ENV</code> trỏ tới: <code>echo "VERSION=1.2.3" &gt;&gt; \$GITHUB_ENV</code> làm <code>\$VERSION</code> có mặt ở mọi bước <em>SAU</em> — nhưng vẫn không có ở chính bước vừa ghi, và không bao giờ có ở một job khác.</p>
</div>

<h3>Xếp hàng thì NHANH — và đây là chỗ bất ngờ</h3>
<p>Nhìn lại cột xếp hàng: 2 tới 3 giây từ lúc job được tạo tới lúc job bắt đầu, cho cả năm job, kể cả macOS và Windows. So nó với con số kia mà khoá học này đã đo:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">một job chờ runner</span><span class="lz-t">2–3 giây</span><span class="lz-d">đo trên năm job, ba nền tảng, trong một lần chạy</span></div>
<div class="lz-step"><span class="lz-k">một lần chạy theo lịch chờ được xếp hàng</span><span class="lz-t">41–268 phút</span><span class="lz-d">đo trên mười lần chạy ở bài 1.3</span></div>
</div>

<div class="callout ok">
<p><strong>Đây là hai hệ thống khác nhau và đáng giữ cho tách bạch.</strong> Một khi lần chạy đã tồn tại, kiếm máy cho các job của nó là chuyện nhanh. Độ trễ hàng giờ ở bài 1.3 xảy ra <em>TRƯỚC</em> chỗ đó — ở khâu quyết định có tạo lần chạy hay không. Nên "hôm nay CI chậm" gần như không bao giờ nghĩa là hồ runner đang thiếu; nó nghĩa là hoặc job của bạn thật sự lâu đến thế, hoặc lần chạy bị tạo muộn. Phân biệt được thì biết đi tra con số nào.</p>
</div>

<h3>Chọn máy: <code>runs-on</code></h3>
<p>Trên mười một workflow của kho này:</p>

<div class="out">runs-on: ubuntu-24.04    11   <- GHIM phien ban
runs-on: ubuntu-latest    2
runs-on: \${{ matrix.os }}  1   <- no ra macos-latest, windows-latest, ubuntu-latest</div>

<p>Mười một cái ghim so với hai cái thả là một tỉ lệ có chủ ý, và lý lẽ y hệt việc ghim phiên bản một thư viện. <code>ubuntu-latest</code> KHÔNG phải hằng số: nó đã đi từ 20.04 sang 22.04 rồi 24.04, mỗi lần theo một lịch triển khai, và mỗi lần đổi phiên bản các công cụ cài sẵn bên dưới những workflow chẳng ai sửa. Một workflow xanh hôm thứ Sáu có thể đỏ hôm thứ Hai mà không có commit nào ở giữa.</p>

<div class="kv-grid">
<div class="kv"><span class="k">ghim — <code>ubuntu-24.04</code></span><span class="v">đổi khi BẠN đổi. Cái giá là rồi bạn vẫn phải chuyển, và GitHub khai tử ảnh cũ theo một lịch công bố</span></div>
<div class="kv"><span class="k">thả — <code>ubuntu-latest</code></span><span class="v">đổi khi GITHUB đổi. Cái lợi là bạn không bao giờ phải tự làm cuộc di trú; cái giá là bạn không chọn được lúc nó xảy ra</span></div>
<div class="kv"><span class="k">cách chia hợp lý</span><span class="v">ghim mọi thứ mà hỏng thì chặn deploy; thả những chỗ mà một bất ngờ là rẻ. Kho này ghim đường lint và đường deploy, thả ma trận phát hành desktop</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi một công cụ cài sẵn là một giao diện ổn định.</strong> Ảnh runner mang theo một bộ phần mềm cài sẵn khá lớn, và rất dễ cứ thế gọi <code>node</code>, <code>python</code> hay <code>docker</code> rồi dựa vào bất cứ thứ gì đang có ở đó. Những phiên bản ấy đổi theo ảnh. Cách vá không phải là mất lòng tin vào runner mà là KHAI BÁO: <code>actions/setup-node@v4</code> kèm phiên bản tường minh tốn 8 tới 22 giây — đo trên ba nền tảng ở bài 2.3 — và biến phiên bản thành thuộc tính của WORKFLOW bạn thay vì thuộc tính của lịch triển khai của GitHub.</p>
</div>

<h3>Runner là một cỗ máy thật, và bạn nhìn được vào nó</h3>
<p>Hai thói quen tự trả tiền cho chúng ngay lần đầu một job cư xử một cách bất khả. Không cái nào cần công cụ gì:</p>

<pre><code>- name: Cai gi dang chay o day
  run: |
    <span class="tok-comment"># danh tinh may</span>
    uname -a
    echo "runner: \$RUNNER_OS \$RUNNER_ARCH"
    <span class="tok-comment"># tai nguyen — cai nay giai thich phan lon cu OOM</span>
    nproc; free -h; df -h /
    <span class="tok-comment"># phien ban that cua thu ban dang goi</span>
    node --version; npm --version</code></pre>

<p>Riêng dòng bộ nhớ đáng đưa vào phản xạ. Cú hỏng CI đắt nhất trong lịch sử kho này là <code>vite build</code> thoát 134 với <code>Reached heap limit</code> trên một runner macOS trong khi nó dựng xanh trong hai mươi giây trên máy của người viết vốn nhiều RAM hơn hẳn. Runner không hỏng và mã không sai; hai cỗ máy có KÍCH THƯỚC khác nhau, mà đó đúng là sự thật bài này đang nói tới.</p>

<div class="callout ok">
<p><strong>Một câu.</strong> Một job là một cỗ máy bạn thuê đúng bằng độ dài của job, và hệ quả thiết kế là <em>MỌI</em> lần chuyển giao trạng thái — giữa các job, giữa các lần chạy, giữa các bước — đều phải là thứ bạn yêu cầu tường minh, và do đó là thứ bạn tìm thấy được trong YAML khi nó vắng mặt.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using GitHub-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners — cấu hình phần cứng theo từng nền tảng, các nhãn dùng được, và phát biểu rằng mỗi job chạy trong một thực thể mới tinh.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images</span><span class="lc-sub">github.com/actions/runner-images — định nghĩa ảnh thật sự, danh sách đầy đủ phần mềm cài sẵn theo từng ảnh, và issue thông báo cho mỗi lượt triển khai ảnh. Đây là chỗ đi tra xem cái gì đã đổi khi một workflow xanh bỗng đỏ mà không có commit nào.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: GITHUB_ENV và GITHUB_OUTPUT</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — những cách được hỗ trợ để chuyển một giá trị từ bước này sang bước sau, và vì sao <code>export</code> không nằm trong đó.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — một container là một tiến trình, và cái gì chết theo nó</span><span class="lc-sub">/courses/docker/learn${REF} — cùng mô hình máy-dùng-một-lần ở một tầng thấp hơn, gồm cả việc vì sao "ở container tôi thì chạy" và "ở runner tôi thì chạy" hỏng vì cùng những lý do.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — mỗi lệnh là một tiến trình, và sự thừa kế môi trường</span><span class="lc-sub">/courses/linux-bash/learn${REF} — vì sao <code>export</code> trong một shell không với tới được shell khác, và đó là toàn bộ lời giải thích cho cái bẫy bước-sang-bước bên trên.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — needs:, and the 5m12s of machines that finished early|||2.2 — needs:, và 5 phút 12 giây máy dựng xong sớm',
      slug: 'ga-2-2-needs',
      type: 'VIDEO',
      description: 'Ba job dựng cùng bắt đầu 19:50:48. Linux xong lúc 19:54:49 rồi NGỒI CHỜ 3 phút 17 giây. `needs:` đợi TRỌN, và bài này đo cái giá — cộng cách duy nhất chuyển được file giữa hai máy đã bị phá huỷ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2><code>needs:</code>, and the 5m12s of machines that finished early</h2>
<p class="lead">Jobs run in parallel by default. <code>needs:</code> is how you say "not this one, not yet" — and it is the only ordering primitive there is. Understanding what it waits for, and what it costs when it waits, is most of what you need to reason about a slow workflow.</p>

<h3>The workflow, and what it declares</h3>
<p>This repository&#39;s desktop release declares three jobs:</p>

<pre><code>jobs:
  kiem-tra:                 <span class="tok-comment"># khong co needs: -> chay ngay</span>
    runs-on: ubuntu-latest

  dung:
    needs: kiem-tra         <span class="tok-comment"># doi kiem-tra xong</span>
    runs-on: \${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        include:
          - os: macos-latest
          - os: windows-latest
          - os: ubuntu-latest

  cong-bo:
    needs: dung             <span class="tok-comment"># doi TRON ma tran</span>
    runs-on: ubuntu-latest</code></pre>

<p>Three declared jobs. The run had five, because a matrix expands into one job per combination — 2.5 covers that. What matters here is the ordering, and the timing the API reports for it:</p>

<div class="out">BA job dung deu bat dau 19:50:48 (song song).
&#96;cong-bo&#96; co &#96;needs: dung&#96;, tuc doi CA BA.

  Linux xong   19:54:49 -> NGOI CHO 197s = 3m17s
  Windows xong 19:56:11 -> NGOI CHO 115s = 1m55s
  macOS xong   19:58:05 -> KE DINH NHIP, cho 1s

  tong may DUNG XONG ma khong dung duoc: 312s = 5m12s

duong toi han = 72 + 437 + 34 = 543s
run_duration_ms bao 555s (chenh 12s = khoang giao job)</div>

<div class="callout warn">
<p><strong><code>needs:</code> waits for all of them, and the slowest one sets the pace.</strong> Linux had a finished, correct build sitting on disk at 19:54:49 and nothing could use it for another three minutes and seventeen seconds. That is not waste in the sense of a bug — the publish step genuinely needs all three installers. It is the shape of the cost, and it is the number you attack when you want the workflow to be faster.</p>
</div>

<h3>The critical path is the only number that matters</h3>
<p>Add up the total machine-time in that run and you get 72 + 241 + 437 + 323 + 34 = 1,107 seconds of compute. The run took 555 seconds. The difference is parallelism working, and the reason the run is not much faster than 555 is that one chain of dependent jobs is 543 seconds long:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Check job · 72s</span><span class="lz-d">everything waits on this — nothing else can start</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">macOS build · 437s</span><span class="lz-d">the slowest of three parallel jobs, so it alone sets this stage&#39;s length</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Publish · 34s</span><span class="lz-d">cannot start until every matrix leg is done</span></div>
</div>

<div class="callout ok">
<p><strong>Making Linux faster would change nothing.</strong> It is not on the critical path — it already finishes 3m17s early. Every second you want back has to come out of the 72-second check job, the 437-second macOS build, or the 34-second publish. This is the single most useful habit in optimising a workflow: compute the chain before you optimise anything, because the intuitive target is usually the job that is already waiting. Chapter 6 does this properly with the full matrix.</p>
</div>

<h3>Passing something between two machines that no longer exist</h3>
<p>Lesson 2.1 established that nothing survives a job. So <code>cong-bo</code> cannot see the installers the three build jobs produced — those machines are gone. The mechanism is an artifact, and the real cost of it is visible in the step timings:</p>

<div class="out">Luu ban cai lam artifact (tai LEN):
  Linux    8s
  Windows  6s
  macOS   27s

Tai VE ca ba trong job cong-bo: 12s</div>

<p>Two things worth noticing. macOS uploads three times slower than Windows for comparable output — a platform difference that 2.3 measures across the whole job. And the download of all three together took twelve seconds, less than macOS spent uploading its one.</p>

<div class="kv-grid">
<div class="kv"><span class="k">artifact</span><span class="v">explicit upload and download, survives the run, retained 90 days by default, visible in the UI. This is the supported way to move a build output between jobs</span></div>
<div class="kv"><span class="k">job output</span><span class="v"><code>outputs:</code> on the job, read as <code>\${{ needs.&lt;job&gt;.outputs.&lt;name&gt; }}</code>. For small strings only — a version number, a computed tag — and it is capped, so it is not a file transfer channel</span></div>
<div class="kv"><span class="k">cache</span><span class="v">a different tool for a different problem: it speeds up recreating something, it does not transfer something. Never rely on a cache hit for correctness</span></div>
<div class="kv"><span class="k">the runner filesystem</span><span class="v">not a channel at all, between jobs. Within one job it is fine and it is free</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — the artifact that costs more than the job it saved.</strong> Uploading <code>node_modules</code> so the next job need not run <code>npm ci</code> is a reliable way to make a workflow slower. It is tens of thousands of small files; the upload compresses and transfers them, the download reverses it, and on the measurements in this repository a fresh <code>npm ci</code> takes 12 to 39 seconds depending on platform. Artifacts are for build <em>outputs</em> — the installer, the bundle, the report. For dependencies, the tool is the cache, and Chapter 5 measures both.</p>
</div>

<h3>What <code>needs:</code> actually means when things fail</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a needed job fails</span><span class="lz-lnote">the dependent job is <strong>skipped</strong>, not failed. It reports as skipped and the run is red because of the original failure</span></div>
<div class="lz-layer"><span class="lz-lname">a needed job is skipped</span><span class="lz-lnote">skips propagate. A job whose <code>if:</code> was false skips everything downstream of it, which surprises people building conditional deploy chains</span></div>
<div class="lz-layer"><span class="lz-lname">you want it to run anyway</span><span class="lz-lnote"><code>if: always()</code> runs it regardless; <code>if: \${{ !cancelled() }}</code> runs it unless somebody hit cancel. Use these for reporting and cleanup jobs, never for deploys</span></div>
<div class="lz-layer"><span class="lz-lname">multiple dependencies</span><span class="lz-lnote"><code>needs: [a, b]</code> waits for both. Any one of them failing skips the job — there is no "wait for a, tolerate b" without an explicit <code>if:</code></span></div>
</div>

<div class="callout">
<p><strong>The skipped-not-failed distinction matters when you read a run.</strong> A red run with one failed job and six skipped ones has exactly one thing to investigate. Reading the six skips as six problems is the most common way to waste twenty minutes on a broken pipeline — Chapter 9 builds the reading order properly.</p>
</div>

<h3>The shape to aim for</h3>
<p>Two structures cover almost every real workflow, and the difference between them is measurable in wall-clock:</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">wide</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">independent jobs, no <code>needs:</code></span><span class="lz-nsub">lint, typecheck, unit tests, build — all start at once. Run length = the slowest single job. This is what <code>ci-lint.yml</code> does with its two jobs</span></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">deep</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">a chain of <code>needs:</code></span><span class="lz-nsub">check → build → publish. Run length = the sum of the chain. Justified only when each stage genuinely consumes the previous one&#39;s output — as the release workflow does</span></div></div>
</div>
</div>

<p>The failure mode to watch for is a chain that is deep for no reason: a lint job that everything <code>needs:</code>, purely because it feels tidy to check formatting before building. That serialises 72 seconds in front of every other job and buys nothing, since a lint failure and a build failure are both things you want to know about in the same run. Depth should be a data dependency, not a preference about ordering.</p>

<div class="callout ok">
<p><strong>The one sentence.</strong> <code>needs:</code> is the only ordering tool, it waits for every job named and for every leg of a matrix, and the price of each edge you add is paid in wall-clock by whichever job is unlucky enough to finish first.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using jobs in a workflow: jobs.&lt;id&gt;.needs</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow — the ordering semantics, the skip-propagation rule, and the <code>always()</code> escape hatch.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/upload-artifact and actions/download-artifact</span><span class="lc-sub">github.com/actions/upload-artifact — retention settings, compression level, and the v3-to-v4 change that made artifacts immutable per job (which breaks the old "several jobs append to one artifact" pattern).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Defining outputs for jobs</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/defining-outputs-for-jobs — the <code>outputs:</code> / <code>needs.&lt;job&gt;.outputs</code> mechanism and its size limits, for the cases where you need a string rather than a file.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the critical path, and optimising the job that is already waiting</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the same measurement discipline applied to a deploy pipeline, including a case where the obvious optimisation target was off the critical path entirely.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2><code>needs:</code>, và 5 phút 12 giây máy dựng xong sớm</h2>
<p class="lead">Mặc định các job chạy song song. <code>needs:</code> là cách bạn nói "cái này thì chưa" — và nó là công cụ SẮP THỨ TỰ duy nhất tồn tại. Hiểu nó đợi cái gì, và nó tốn gì khi đợi, chiếm phần lớn thứ bạn cần để lập luận về một workflow chậm.</p>

<h3>Workflow, và nó khai báo cái gì</h3>
<p>Bản phát hành desktop của kho này khai ba job:</p>

<pre><code>jobs:
  kiem-tra:                 <span class="tok-comment"># khong co needs: -> chay ngay</span>
    runs-on: ubuntu-latest

  dung:
    needs: kiem-tra         <span class="tok-comment"># doi kiem-tra xong</span>
    runs-on: \${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        include:
          - os: macos-latest
          - os: windows-latest
          - os: ubuntu-latest

  cong-bo:
    needs: dung             <span class="tok-comment"># doi TRON ma tran</span>
    runs-on: ubuntu-latest</code></pre>

<p>Ba job khai báo. Lần chạy có năm, vì một ma trận nở ra thành một job cho mỗi tổ hợp — bài 2.5 nói chuyện đó. Chỗ quan trọng ở đây là THỨ TỰ, và cái nhịp thời gian mà API báo cho nó:</p>

<div class="out">BA job dung deu bat dau 19:50:48 (song song).
&#96;cong-bo&#96; co &#96;needs: dung&#96;, tuc doi CA BA.

  Linux xong   19:54:49 -> NGOI CHO 197s = 3m17s
  Windows xong 19:56:11 -> NGOI CHO 115s = 1m55s
  macOS xong   19:58:05 -> KE DINH NHIP, cho 1s

  tong may DUNG XONG ma khong dung duoc: 312s = 5m12s

duong toi han = 72 + 437 + 34 = 543s
run_duration_ms bao 555s (chenh 12s = khoang giao job)</div>

<div class="callout warn">
<p><strong><code>needs:</code> đợi TẤT CẢ, và kẻ chậm nhất định nhịp.</strong> Linux đã có một bản dựng xong xuôi, đúng đắn, nằm sẵn trên đĩa lúc 19:54:49 và không gì dùng được nó suốt ba phút mười bảy giây nữa. Đó không phải lãng phí theo nghĩa một lỗi — bước công bố thật sự cần cả ba bản cài. Đó là HÌNH DẠNG của cái giá, và nó là con số bạn nhắm vào khi muốn workflow nhanh hơn.</p>
</div>

<h3>Đường tới hạn là con số duy nhất có nghĩa</h3>
<p>Cộng tổng thời-gian-máy trong lần chạy ấy được 72 + 241 + 437 + 323 + 34 = 1.107 giây tính toán. Lần chạy mất 555 giây. Chênh lệch chính là sự song song đang phát huy, và lý do lần chạy không nhanh hơn 555 bao nhiêu là vì có một CHUỖI job phụ thuộc dài 543 giây:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Kiểm tra mã · 72s</span><span class="lz-d">mọi thứ chờ cái này — không gì khác khởi động được</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Dựng macOS · 437s</span><span class="lz-d">chậm nhất trong ba job song song, nên một mình nó định độ dài của chặng này</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Công bố · 34s</span><span class="lz-d">không khởi động được cho tới khi mọi nhánh ma trận xong</span></div>
</div>

<div class="callout ok">
<p><strong>Làm Linux nhanh hơn sẽ KHÔNG đổi được gì.</strong> Nó không nằm trên đường tới hạn — nó vốn đã xong sớm 3m17s. Mọi giây bạn muốn đòi lại đều phải lấy ra từ job kiểm 72 giây, bản dựng macOS 437 giây, hoặc bước công bố 34 giây. Đây là thói quen hữu ích nhất khi tối ưu một workflow: TÍNH CHUỖI trước khi tối ưu bất cứ thứ gì, bởi cái đích trực giác thường là cái job vốn đã ngồi chờ. Chương 6 làm chuyện này cho tử tế với cả ma trận.</p>
</div>

<h3>Chuyển một thứ giữa hai cỗ máy không còn tồn tại</h3>
<p>Bài 2.1 đã xác lập rằng không gì sống sót qua một job. Nên <code>cong-bo</code> không nhìn thấy được các bản cài mà ba job dựng đã tạo ra — mấy cỗ máy ấy biến mất rồi. Cơ chế là artifact, và cái giá thật của nó hiện ra trong nhịp thời gian từng bước:</p>

<div class="out">Luu ban cai lam artifact (tai LEN):
  Linux    8s
  Windows  6s
  macOS   27s

Tai VE ca ba trong job cong-bo: 12s</div>

<p>Hai chỗ đáng để ý. macOS tải lên chậm gấp ba Windows với đầu ra tương đương — một khác biệt nền tảng mà bài 2.3 đo trên toàn bộ job. Và việc tải VỀ cả ba cùng lúc mất mười hai giây, ít hơn thời gian macOS tải lên đúng một bản của nó.</p>

<div class="kv-grid">
<div class="kv"><span class="k">artifact</span><span class="v">tải lên và tải về tường minh, sống qua lần chạy, mặc định giữ 90 ngày, thấy được trên giao diện. Đây là cách được hỗ trợ để chuyển một bản dựng giữa các job</span></div>
<div class="kv"><span class="k">output của job</span><span class="v"><code>outputs:</code> trên job, đọc bằng <code>\${{ needs.&lt;job&gt;.outputs.&lt;ten&gt; }}</code>. Chỉ dành cho chuỗi ngắn — một số hiệu phiên bản, một nhãn tính ra — và nó có trần, nên không phải kênh chuyển file</span></div>
<div class="kv"><span class="k">cache</span><span class="v">một công cụ khác cho một bài toán khác: nó tăng tốc việc TẠO LẠI một thứ, nó không CHUYỂN một thứ. Đừng bao giờ dựa vào một lần trúng cache để đảm bảo tính đúng đắn</span></div>
<div class="kv"><span class="k">hệ tệp của runner</span><span class="v">không phải kênh gì cả, giữa các job. Trong cùng một job thì nó ổn và nó miễn phí</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cái artifact tốn hơn cả job nó tiết kiệm được.</strong> Tải <code>node_modules</code> lên để job kế khỏi phải chạy <code>npm ci</code> là một cách đáng tin cậy để làm workflow CHẬM đi. Đó là hàng chục nghìn file bé; lượt tải lên nén rồi truyền chúng, lượt tải về làm ngược lại, mà theo số đo ở kho này một lần <code>npm ci</code> tươi mất 12 tới 39 giây tuỳ nền tảng. Artifact dành cho <em>ĐẦU RA</em> của bản dựng — bản cài, gói bundle, bản báo cáo. Với thư viện phụ thuộc, công cụ là cache, và Chương 5 đo cả hai.</p>
</div>

<h3><code>needs:</code> thật ra nghĩa gì khi có thứ hỏng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một job được needs bị hỏng</span><span class="lz-lnote">job phụ thuộc bị <strong>BỎ QUA</strong>, không phải HỎNG. Nó báo cáo là skipped và lần chạy đỏ vì cú hỏng gốc</span></div>
<div class="lz-layer"><span class="lz-lname">một job được needs bị bỏ qua</span><span class="lz-lnote">việc bỏ qua LAN TRUYỀN. Một job có <code>if:</code> sai sẽ bỏ qua mọi thứ nằm sau nó, và điều này làm bất ngờ những ai đang dựng chuỗi deploy có điều kiện</span></div>
<div class="lz-layer"><span class="lz-lname">bạn muốn nó chạy bất chấp</span><span class="lz-lnote"><code>if: always()</code> chạy bất kể; <code>if: \${{ !cancelled() }}</code> chạy trừ khi có người bấm huỷ. Dùng mấy cái này cho job báo cáo và dọn dẹp, đừng bao giờ dùng cho deploy</span></div>
<div class="lz-layer"><span class="lz-lname">nhiều phụ thuộc</span><span class="lz-lnote"><code>needs: [a, b]</code> đợi cả hai. Bất kỳ cái nào hỏng cũng bỏ qua job — không có kiểu "đợi a, chịu đựng b" nếu không viết <code>if:</code> tường minh</span></div>
</div>

<div class="callout">
<p><strong>Chỗ phân biệt bỏ-qua với hỏng có nghĩa khi bạn ĐỌC một lần chạy.</strong> Một lần chạy đỏ với một job hỏng và sáu job bị bỏ qua có đúng MỘT thứ cần điều tra. Đọc sáu cái skip thành sáu vấn đề là cách phổ biến nhất để phí hai mươi phút cho một đường ống hỏng — Chương 9 dựng thứ tự đọc cho tử tế.</p>
</div>

<h3>Hình dạng cần nhắm tới</h3>
<p>Hai cấu trúc phủ gần hết mọi workflow thật, và khác biệt giữa chúng đo được bằng thời gian đồng hồ:</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">rộng</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">các job độc lập, không <code>needs:</code></span><span class="lz-nsub">lint, kiểm kiểu, unit test, dựng — tất cả khởi động cùng lúc. Độ dài lần chạy = job đơn chậm nhất. Đây là thứ <code>ci-lint.yml</code> làm với hai job của nó</span></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">sâu</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">một chuỗi <code>needs:</code></span><span class="lz-nsub">kiểm → dựng → công bố. Độ dài lần chạy = tổng của chuỗi. Chỉ chính đáng khi mỗi chặng THẬT SỰ tiêu thụ đầu ra của chặng trước — như workflow phát hành đang làm</span></div></div>
</div>
</div>

<p>Kiểu hỏng cần canh chừng là một chuỗi sâu mà chẳng vì lý do gì: một job lint mà mọi thứ đều <code>needs:</code> nó, thuần tuý vì cảm giác ngăn nắp khi kiểm định dạng trước rồi mới dựng. Cái đó xếp 72 giây thành hàng dọc trước mặt mọi job khác và chẳng mua được gì, bởi một cú hỏng lint và một cú hỏng dựng đều là những thứ bạn muốn biết trong cùng một lần chạy. Độ sâu nên là một phụ thuộc DỮ LIỆU, không phải một sở thích về thứ tự.</p>

<div class="callout ok">
<p><strong>Một câu.</strong> <code>needs:</code> là công cụ sắp thứ tự duy nhất, nó đợi mọi job được nêu tên và mọi nhánh của một ma trận, và cái giá cho mỗi cạnh bạn thêm vào được trả bằng thời gian đồng hồ, bởi cái job xui xẻo nào xong trước.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using jobs in a workflow: jobs.&lt;id&gt;.needs</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow — ngữ nghĩa sắp thứ tự, luật lan truyền việc bỏ qua, và lối thoát <code>always()</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/upload-artifact và actions/download-artifact</span><span class="lc-sub">github.com/actions/upload-artifact — thiết lập thời hạn giữ, mức nén, và thay đổi từ v3 sang v4 khiến artifact thành bất biến theo từng job (làm vỡ khuôn mẫu cũ "nhiều job cùng nối thêm vào một artifact").</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Defining outputs for jobs</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/defining-outputs-for-jobs — cơ chế <code>outputs:</code> / <code>needs.&lt;job&gt;.outputs</code> và giới hạn kích thước của nó, cho những lúc bạn cần một chuỗi chứ không phải một tệp.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — đường tới hạn, và chuyện tối ưu cái job vốn đã ngồi chờ</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cùng kỷ luật đo đạc áp lên một đường ống deploy, gồm cả một ca mà đích tối ưu hiển nhiên hoá ra nằm hoàn toàn ngoài đường tới hạn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — The same command on three platforms|||2.3 — Cùng một lệnh trên ba nền tảng',
      slug: 'ga-2-3-ba-nen-tang',
      type: 'VIDEO',
      description: 'Cùng một commit, cùng một lệnh, ba runner. Windows chậm hơn Linux 3,2 lần ở `npm ci` nhưng chỉ 1,1 lần ở bước dựng. macOS ngược lại. Không có "hệ số chậm" nào cả — và ở kho riêng tư, macOS chiếm 82% hoá đơn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>The same command on three platforms</h2>
<p class="lead">Run 32662461744 is an unusually clean experiment: one commit, one workflow file, three runners executing the same steps in the same order. Everything that differs between the three columns below is the platform and nothing else.</p>

<h3>The measurement</h3>
<div class="out">buoc                 Linux   macOS  Windows    mac/lin win/lin
--------------------------------------------------------------
checkout                7s      6s      11s       0.9x    1.6x
setup-node             13s     11s      22s       0.8x    1.7x
npm ci #1              12s     22s      39s       1.8x    3.2x
npm ci #2              26s     50s      68s       1.9x    2.6x
Dung                  149s    315s     171s       2.1x    1.1x
tai artifact len        8s     27s       6s       3.4x    0.8x
--------------------------------------------------------------
TONG                  215s    431s     317s       2.0x    1.5x

job tong (API):  Linux 241s  macOS 437s (1.81x)  Windows 323s (1.34x)</div>

<div class="callout warn">
<p><strong>Read down the ratio columns, not across the totals.</strong> There is no single number that describes how much slower a platform is. Windows is 3.2× slower at <code>npm ci</code> and 1.1× slower at the build. macOS is the reverse: 2.1× at the build, but <em>faster</em> than Linux at checkout and <code>setup-node</code>. The totals — 2.0× and 1.5× — are averages of things that have nothing to do with each other, and quoting them as "macOS is twice as slow" predicts the wrong number for any specific step.</p>
</div>

<h3>What each platform is actually bad at</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Windows · many small files</span><span class="lz-lnote"><code>npm ci</code> writes tens of thousands of tiny files. 107s total against Linux&#39;s 38s — <strong>2.8×</strong>. NTFS plus per-file antivirus filtering is the standard explanation, and the shape of the number fits it: the operations Windows loses on are the ones counted in file-creations, not in CPU cycles</span></div>
<div class="lz-layer"><span class="lz-lname">macOS · sustained CPU, and upload</span><span class="lz-lnote">the build step is 315s against 149s — <strong>2.1×</strong> — and the artifact upload is 27s against 8s, <strong>3.4×</strong>. The build is compilation and bundling; the upload is network. Both are places where the macOS runner fleet has historically had thinner hardware than the Linux one</span></div>
<div class="lz-layer"><span class="lz-lname">Linux · nothing, here</span><span class="lz-lnote">fastest or joint-fastest on five of six steps. It is also the platform every action is tested against first, so it is the one where things simply work. If a job does not need a specific OS, this is the answer</span></div>
<div class="lz-layer"><span class="lz-lname">the exception worth noticing</span><span class="lz-lnote">macOS beats Linux at <code>checkout</code> (6s vs 7s) and <code>setup-node</code> (11s vs 13s). Small, but it means "macOS runners are slow" is false as stated — they are slow at <em>some things</em></span></div>
</div>

<h3>The cost, which is a completely different ranking</h3>
<p>GitHub bills runner minutes at different rates per platform. This repository is public, so the API reports what it actually cost:</p>

<div class="out">billable: MACOS 0ms · UBUNTU 0ms · WINDOWS 0ms</div>

<p>Zero — public repositories get GitHub-hosted runners free. That makes this run a good place to ask the counterfactual: what would the identical run have cost in a <em>private</em> repository, where Linux bills at 1×, Windows at 2× and macOS at 10×, rounded up to the minute per job?</p>

<div class="out">nen tang   giay that  he so  phut tinh tien
--------------------------------------------
Linux           241s     1x             5 phut
Windows         323s     2x            12 phut
macOS           437s    10x            80 phut
--------------------------------------------
TONG                                   97 phut

macOS chiem 82% hoa don, du chi chiem 44% thoi gian that</div>

<div class="callout warn">
<p><strong>macOS is 44% of the wall-clock and 82% of the bill.</strong> The 10× multiplier does something unintuitive: it makes the <em>slowest</em> platform also the most expensive per second, so the two effects multiply rather than trade off. A ten-minute macOS job on a private repository consumes a hundred minutes of quota. Any conversation about CI cost that does not separate these two rankings will optimise the wrong job.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — putting a platform-independent job on a matrix leg.</strong> If a step&#39;s result cannot differ between platforms — a lint pass, a typecheck, a JSON schema validation, a docs build — running it on all three legs of a matrix triples the wall-clock contribution and, at the multipliers above, multiplies the cost by thirteen for no additional information. Hoist those steps into a single Linux job that the matrix <code>needs:</code>. This repository does exactly that: <code>kiem-tra</code> runs once on Linux in 72 seconds, and only the genuinely platform-specific build fans out.</p>
</div>

<h3>Writing steps that work on all three</h3>
<p>The default shell is not the same everywhere, and this is where cross-platform workflows break in ways that are tedious rather than interesting:</p>

<div class="kv-grid">
<div class="kv"><span class="k">default shell</span><span class="v"><code>bash</code> on Linux and macOS; <strong>PowerShell</strong> on Windows. So <code>export FOO=1</code>, <code>&amp;&amp;</code> chains, <code>$(...)</code> and single-quoted strings all behave differently on one leg</span></div>
<div class="kv"><span class="k">the fix</span><span class="v"><code>shell: bash</code> on the step, or <code>defaults.run.shell: bash</code> on the job. Git Bash is present on the Windows runners, so this works — and it makes one shell dialect the whole workflow&#39;s problem instead of three</span></div>
<div class="kv"><span class="k">paths</span><span class="v">use forward slashes everywhere; Windows accepts them. Never build a path by string-concatenating with <code>/</code> or <code>\\\\</code> — use the runner variables (<code>\$GITHUB_WORKSPACE</code>) and let the tool resolve it</span></div>
<div class="kv"><span class="k">line endings</span><span class="v">checkout on Windows can apply <code>core.autocrlf</code>, and a shell script that arrives with CRLF fails with a message about <code>\\\\r</code> that names no file. If a script runs on Linux and dies on Windows, check this before anything else</span></div>
<div class="kv"><span class="k">case sensitivity</span><span class="v">Linux is case-sensitive; macOS and Windows are usually not. <code>require('./Utils')</code> for a file named <code>utils.ts</code> passes on two platforms and fails on the third — and Linux is the one that is right</span></div>
</div>

<h3>The failure this repository actually had</h3>
<p>Run 32400097927: <code>vite build</code> exited <strong>134</strong> on the macOS leg with <code>FATAL ERROR: Reached heap limit — JavaScript heap out of memory</code>. Linux and Windows built fine in the same run. The developer&#39;s own machine built it green in twenty seconds.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">what it looked like</span><span class="lz-t">a macOS-only bug</span><span class="lz-d">two platforms green, one red, on the same commit</span></div>
<div class="lz-step"><span class="lz-k">what it was</span><span class="lz-t">a memory ceiling</span><span class="lz-d">the build was near the limit everywhere; macOS was the leg with the least headroom, so it was the one that crossed it first</span></div>
<div class="lz-step"><span class="lz-k">the fix</span><span class="lz-t">raise the heap, drop sourcemaps in CI</span><span class="lz-d"><code>node --max-old-space-size=6144</code> plus disabling sourcemaps when <code>CI</code> is set — verified by reproducing at a squeezed 1600MB heap: with sourcemaps exit 134, without exit 0</span></div>
</div>

<div class="callout ok">
<p><strong>The generalisable part.</strong> A failure on exactly one matrix leg is usually not a bug in that platform. It is a threshold — memory, disk, timing, a race — that the whole workflow was already close to, showing up first on the leg with the least margin. Fixing "the macOS bug" by special-casing macOS leaves the other two legs one dependency upgrade away from the same crash. The reproduction that proves you understood it is the one this repository did: shrink the resource deliberately on a <em>different</em> platform and watch the same failure appear.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> Platforms do not have a speed, they have a profile — Windows loses on file counts, macOS on sustained CPU and upload — and the billing multipliers reorder the ranking again, so the cheap job and the fast job are frequently not the same job.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About billing for GitHub Actions</span><span class="lc-sub">docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions — the per-platform multipliers, the per-job rounding rule, and the statement that public repositories use standard runners for free.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images — hardware specification per platform</span><span class="lc-sub">github.com/actions/runner-images#available-images — the vCPU, RAM and disk actually allocated on each label, which is the first place to look when one matrix leg runs out of something.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs.&lt;id&gt;.defaults.run.shell</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#defaultsrun — the available shells per platform and how to force one, which removes most cross-platform step breakage in a single line.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — one image, two libc implementations, and a build that was green and dead</span><span class="lc-sub">/courses/docker/learn${REF} — the same lesson in a different medium: a build succeeding says nothing about whether the artefact runs on the target, and the check that catches it has to happen before the swap.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — the V8 heap limit and what --max-old-space-size does</span><span class="lc-sub">/courses/nodejs/learn${REF} — why exit code 134 means what it means, and why the default heap ceiling is a function of the machine rather than of your code.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Cùng một lệnh trên ba nền tảng</h2>
<p class="lead">Lần chạy 32662461744 là một thí nghiệm sạch hiếm có: một commit, một tệp workflow, ba runner thực thi cùng những bước theo cùng thứ tự. Mọi thứ khác nhau giữa ba cột dưới đây là NỀN TẢNG chứ không gì khác.</p>

<h3>Phép đo</h3>
<div class="out">buoc                 Linux   macOS  Windows    mac/lin win/lin
--------------------------------------------------------------
checkout                7s      6s      11s       0.9x    1.6x
setup-node             13s     11s      22s       0.8x    1.7x
npm ci #1              12s     22s      39s       1.8x    3.2x
npm ci #2              26s     50s      68s       1.9x    2.6x
Dung                  149s    315s     171s       2.1x    1.1x
tai artifact len        8s     27s       6s       3.4x    0.8x
--------------------------------------------------------------
TONG                  215s    431s     317s       2.0x    1.5x

job tong (API):  Linux 241s  macOS 437s (1.81x)  Windows 323s (1.34x)</div>

<div class="callout warn">
<p><strong>Hãy đọc DỌC theo cột tỉ lệ, đừng đọc ngang hàng tổng.</strong> Không có một con số duy nhất nào mô tả được một nền tảng chậm hơn bao nhiêu. Windows chậm hơn 3,2 lần ở <code>npm ci</code> và 1,1 lần ở bước dựng. macOS thì ngược: 2,1 lần ở bước dựng, nhưng <em>NHANH HƠN</em> Linux ở checkout và <code>setup-node</code>. Mấy con số tổng — 2,0 lần và 1,5 lần — là trung bình của những thứ chẳng liên quan gì tới nhau, và đem chúng ra nói "macOS chậm gấp đôi" là dự đoán sai con số cho bất kỳ bước cụ thể nào.</p>
</div>

<h3>Mỗi nền tảng thật ra DỞ ở chỗ nào</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Windows · nhiều file nhỏ</span><span class="lz-lnote"><code>npm ci</code> ghi hàng chục nghìn file tí hon. Tổng 107s so với 38s của Linux — <strong>2,8 lần</strong>. NTFS cộng với việc chống virus lọc từng file là lời giải thích tiêu chuẩn, và hình dạng con số khớp với nó: những thao tác Windows thua đều là thứ đếm bằng số lần TẠO FILE, không phải bằng chu kỳ CPU</span></div>
<div class="lz-layer"><span class="lz-lname">macOS · CPU chạy dài, và tải lên</span><span class="lz-lnote">bước dựng 315s so với 149s — <strong>2,1 lần</strong> — và tải artifact lên 27s so với 8s, <strong>3,4 lần</strong>. Bước dựng là biên dịch và đóng gói; tải lên là mạng. Cả hai đều là chỗ mà đội runner macOS xưa nay có phần cứng mỏng hơn đội Linux</span></div>
<div class="lz-layer"><span class="lz-lname">Linux · không dở gì cả, ở đây</span><span class="lz-lnote">nhanh nhất hoặc đồng nhanh nhất ở năm trên sáu bước. Nó cũng là nền tảng mà mọi action được kiểm thử đầu tiên, nên nó là chỗ mọi thứ đơn giản là CHẠY. Nếu một job không cần một hệ điều hành cụ thể, đây là câu trả lời</span></div>
<div class="lz-layer"><span class="lz-lname">ngoại lệ đáng để ý</span><span class="lz-lnote">macOS thắng Linux ở <code>checkout</code> (6s so 7s) và <code>setup-node</code> (11s so 13s). Nhỏ, nhưng nó nghĩa là câu "runner macOS chậm" SAI như đã phát biểu — chúng chậm ở <em>MỘT SỐ việc</em></span></div>
</div>

<h3>Chi phí, và đó là một bảng xếp hạng hoàn toàn khác</h3>
<p>GitHub tính tiền phút runner theo mức khác nhau tuỳ nền tảng. Kho này công khai, nên API báo cái nó THẬT SỰ tốn:</p>

<div class="out">billable: MACOS 0ms · UBUNTU 0ms · WINDOWS 0ms</div>

<p>Bằng không — kho công khai được dùng runner do GitHub cấp miễn phí. Điều đó khiến lần chạy này thành chỗ tốt để hỏi câu giả định: lần chạy y hệt ấy sẽ tốn bao nhiêu ở một kho <em>RIÊNG TƯ</em>, nơi Linux tính 1×, Windows 2× và macOS 10×, làm tròn lên phút cho mỗi job?</p>

<div class="out">nen tang   giay that  he so  phut tinh tien
--------------------------------------------
Linux           241s     1x             5 phut
Windows         323s     2x            12 phut
macOS           437s    10x            80 phut
--------------------------------------------
TONG                                   97 phut

macOS chiem 82% hoa don, du chi chiem 44% thoi gian that</div>

<div class="callout warn">
<p><strong>macOS chiếm 44% thời gian đồng hồ và 82% hoá đơn.</strong> Cái hệ số 10× làm một chuyện phản trực giác: nó khiến nền tảng <em>CHẬM NHẤT</em> cũng đồng thời đắt nhất tính theo giây, nên hai hiệu ứng NHÂN với nhau chứ không bù trừ. Một job macOS mười phút ở kho riêng tư ngốn một trăm phút hạn ngạch. Mọi cuộc bàn về chi phí CI mà không tách hai bảng xếp hạng này ra sẽ đi tối ưu nhầm job.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — đặt một việc không phụ thuộc nền tảng lên một nhánh ma trận.</strong> Nếu kết quả một bước không thể khác nhau giữa các nền tảng — một lượt lint, một lượt kiểm kiểu, một lượt kiểm lược đồ JSON, một bản dựng tài liệu — thì chạy nó trên cả ba nhánh ma trận sẽ nhân ba phần đóng góp vào thời gian đồng hồ và, với các hệ số trên, nhân chi phí lên MƯỜI BA lần mà không thu thêm được thông tin nào. Hãy nhấc mấy bước ấy lên một job Linux duy nhất mà ma trận <code>needs:</code> tới. Kho này làm đúng như thế: <code>kiem-tra</code> chạy MỘT lần trên Linux trong 72 giây, và chỉ bước dựng thật sự phụ thuộc nền tảng mới toả ra.</p>
</div>

<h3>Viết bước chạy được trên cả ba</h3>
<p>Shell mặc định không giống nhau ở mọi nơi, và đây là chỗ các workflow đa nền tảng vỡ theo kiểu buồn tẻ chứ không thú vị:</p>

<div class="kv-grid">
<div class="kv"><span class="k">shell mặc định</span><span class="v"><code>bash</code> trên Linux và macOS; <strong>PowerShell</strong> trên Windows. Nên <code>export FOO=1</code>, chuỗi <code>&amp;&amp;</code>, <code>$(...)</code> và chuỗi trong nháy đơn đều cư xử khác ở một nhánh</span></div>
<div class="kv"><span class="k">cách vá</span><span class="v"><code>shell: bash</code> trên bước, hoặc <code>defaults.run.shell: bash</code> trên job. Git Bash có sẵn trên runner Windows nên cái này chạy được — và nó biến MỘT phương ngữ shell thành vấn đề của cả workflow thay vì ba</span></div>
<div class="kv"><span class="k">đường dẫn</span><span class="v">dùng gạch chéo xuôi ở mọi nơi; Windows chấp nhận. Đừng bao giờ ghép chuỗi đường dẫn bằng tay với <code>/</code> hay <code>\\\\</code> — dùng biến của runner (<code>\$GITHUB_WORKSPACE</code>) rồi để công cụ tự phân giải</span></div>
<div class="kv"><span class="k">ký tự xuống dòng</span><span class="v">checkout trên Windows có thể áp <code>core.autocrlf</code>, và một script shell tới nơi mang CRLF sẽ hỏng với một thông báo về <code>\\\\r</code> chẳng nêu tên file nào. Nếu một script chạy trên Linux mà chết trên Windows, hãy kiểm chỗ này trước mọi thứ khác</span></div>
<div class="kv"><span class="k">phân biệt hoa thường</span><span class="v">Linux phân biệt; macOS và Windows thường thì không. <code>require('./Utils')</code> cho một file tên <code>utils.ts</code> sẽ qua ở hai nền tảng và hỏng ở cái thứ ba — và Linux mới là cái ĐÚNG</span></div>
</div>

<h3>Cú hỏng kho này thật sự đã gặp</h3>
<p>Lần chạy 32400097927: <code>vite build</code> thoát <strong>134</strong> ở nhánh macOS với <code>FATAL ERROR: Reached heap limit — JavaScript heap out of memory</code>. Linux và Windows dựng ổn trong cùng lần chạy ấy. Máy của chính người viết dựng xanh trong hai mươi giây.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">nó TRÔNG như</span><span class="lz-t">một lỗi chỉ có ở macOS</span><span class="lz-d">hai nền tảng xanh, một đỏ, trên cùng một commit</span></div>
<div class="lz-step"><span class="lz-k">nó THẬT SỰ là</span><span class="lz-t">một trần bộ nhớ</span><span class="lz-d">bản dựng đã sát trần ở mọi nơi; macOS là nhánh còn ít khoảng trống nhất nên nó là cái vượt qua trước</span></div>
<div class="lz-step"><span class="lz-k">cách vá</span><span class="lz-t">nâng heap, bỏ sourcemap ở CI</span><span class="lz-d"><code>node --max-old-space-size=6144</code> cộng với tắt sourcemap khi có biến <code>CI</code> — kiểm chứng bằng cách tái lập ở heap bóp còn 1600MB: có sourcemap thoát 134, không có thoát 0</span></div>
</div>

<div class="callout ok">
<p><strong>Phần khái quát được.</strong> Một cú hỏng ở đúng MỘT nhánh ma trận thường không phải lỗi của nền tảng ấy. Nó là một NGƯỠNG — bộ nhớ, đĩa, thời gian, một cuộc đua — mà cả workflow vốn đã ở sát, và nó lộ ra trước ở cái nhánh còn ít lề nhất. Vá "lỗi macOS" bằng cách xử lý đặc biệt cho macOS thì hai nhánh kia vẫn chỉ cách cùng cú sập đúng một lần nâng cấp thư viện. Phép tái lập chứng minh bạn đã hiểu đúng là phép mà kho này đã làm: BÓP tài nguyên có chủ ý trên một nền tảng <em>KHÁC</em> rồi xem đúng cú hỏng ấy hiện ra.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Các nền tảng không có một TỐC ĐỘ, chúng có một HỒ SƠ — Windows thua ở số lượng file, macOS thua ở CPU chạy dài và ở tải lên — và các hệ số tính tiền còn xáo lại bảng xếp hạng lần nữa, nên job rẻ và job nhanh thường xuyên không phải cùng một job.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About billing for GitHub Actions</span><span class="lc-sub">docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions — hệ số nhân theo nền tảng, luật làm tròn theo từng job, và phát biểu rằng kho công khai dùng runner tiêu chuẩn miễn phí.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images — cấu hình phần cứng theo nền tảng</span><span class="lc-sub">github.com/actions/runner-images#available-images — số vCPU, RAM và đĩa thật sự được cấp cho từng nhãn, đây là chỗ nhìn đầu tiên khi một nhánh ma trận cạn thứ gì đó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs.&lt;id&gt;.defaults.run.shell</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#defaultsrun — các shell dùng được theo từng nền tảng và cách ép một cái, thứ gỡ bỏ phần lớn cú vỡ bước đa nền tảng chỉ bằng một dòng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — một ảnh, hai bản libc, và một bản dựng xanh nhưng chết</span><span class="lc-sub">/courses/docker/learn${REF} — cùng bài học ở một môi trường khác: một bản dựng thành công không nói được gì về việc sản phẩm có chạy được trên máy đích hay không, và phép kiểm bắt được nó phải xảy ra TRƯỚC lúc tráo.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — trần heap của V8 và --max-old-space-size làm gì</span><span class="lc-sub">/courses/nodejs/learn${REF} — vì sao mã thoát 134 mang nghĩa như thế, và vì sao trần heap mặc định là một hàm của CỖ MÁY chứ không phải của mã bạn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Steps, exit codes, and the flag that hides a failure|||2.4 — Bước, mã thoát, và cái cờ giấu mất cú hỏng',
      slug: 'ga-2-4-buoc-ma-thoat',
      type: 'VIDEO',
      description: 'GitHub mặc định `bash -e`; ghi `shell: bash` thì thành `bash -eo pipefail`. Đo thật: cùng một script, mặc định trả 0 (XANH, cú hỏng vô hình), có pipefail trả 127. Cộng năm chỗ `set -e` KHÔNG kích hoạt — và cái bẫy đã cắn chính phép đo của bài này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Steps, exit codes, and the flag that hides a failure</h2>
<p class="lead">A step fails if its process exits non-zero. That rule is simple, complete, and hides an enormous amount, because "its process" means a shell, and which shell you get depends on a line you probably did not write.</p>

<h3>The default shell is not the shell you asked for</h3>
<p>Write <code>run:</code> with no <code>shell:</code> and GitHub runs your script with:</p>

<pre><code><span class="tok-comment"># mac dinh tren Linux va macOS</span>
bash -e {0}

<span class="tok-comment"># khi ban ghi ro shell: bash</span>
bash --noprofile --norc -eo pipefail {0}</code></pre>

<p>The difference is <code>pipefail</code>. Here is what that one flag is worth, measured on a script whose first command in a pipeline fails:</p>

<div class="out">$ cat pipe.sh
lenh-khong-ton-tai | tail -1
echo "ma thoat cua ca ong: $?"

########  bash -e  (MAC DINH)  ########
pipe.sh: line 2: lenh-khong-ton-tai: command not found
ma thoat cua ca ong: 0
&gt;&gt;&gt; exit=0

########  bash -eo pipefail  (shell: bash)  ########
pipe.sh: line 2: lenh-khong-ton-tai: command not found
&gt;&gt;&gt; exit=127</div>

<div class="callout warn">
<p><strong>Same script. Under the default, the step is green.</strong> The command not found message is right there in the log, and the step reports success, because the exit code of a pipeline is the exit code of its <em>last</em> command and <code>tail</code> succeeded at reading nothing. Adding the single line <code>shell: bash</code> turns the same run into exit 127. This is the highest-value one-line change in most workflow files.</p>
</div>

<h3><code>set -e</code> is weaker than it reads</h3>
<p>Even with <code>-e</code> on, there are contexts where a failing command does not stop the script. Measured, all five in one run:</p>

<div class="out">1. trong if           -> chay tiep
2. ben trai &amp;&amp;        -> chay tiep
3. co ! dang truoc    -> chay tiep
4. trong HAM duoc goi trong if -> CA HAM duoc mien, chay tiep
5. goi TRAN           -> day moi chet (exit 127)</div>

<p>The first three are the documented and reasonable ones: a command being <em>tested</em> is allowed to fail, that is the point of testing it. The fourth is the one that surprises people, and it is worth stating precisely: if a shell function is called from inside an <code>if</code>, then every command inside that function is exempt too — the exemption is inherited, not confined to the call itself. A carefully written function full of error checks can run to completion with all of them ignored, because of where it was called from.</p>

<div class="pitfall">
<p><strong>Bẫy — the measurement command that hid the answer.</strong> While measuring the list above, the first command written for it was <code>bash -e mien.sh | grep -v "command not found"; echo \$?</code> — and it printed <strong>0</strong>. Read straight, that says <code>set -e</code> never fired at all. It is wrong: <code>\$?</code> there is the exit code of <code>grep</code>, not of the script. Re-run without the pipe:</p>
<p><code>bash -e mien.sh</code> → <strong>127</strong> · <code>bash -e mien.sh | cat</code> → <strong>0</strong> · <code>pipefail</code> + pipe → <strong>127</strong></p>
<p>The trap this lesson is about bit the lesson&#39;s own measurement, which is the most useful demonstration available: it is not an exotic failure mode, it is what happens by default to anyone who pipes a command into anything.</p>
</div>

<h3>Steps, and what carries between them</h3>
<div class="kv-grid">
<div class="kv"><span class="k">each step is a new process</span><span class="v">variables, shell functions, <code>cd</code>, <code>set -x</code> — none of it reaches the next step. The working directory resets to the job&#39;s <code>working-directory</code> each time</span></div>
<div class="kv"><span class="k">to pass a value forward</span><span class="v"><code>echo "K=V" &gt;&gt; \$GITHUB_ENV</code> for an environment variable, or <code>echo "k=v" &gt;&gt; \$GITHUB_OUTPUT</code> with an <code>id:</code> on the step, read as <code>\${{ steps.&lt;id&gt;.outputs.k }}</code></span></div>
<div class="kv"><span class="k">to pass a multi-line value</span><span class="v">the heredoc form with a random delimiter — a value containing a newline written naively lets anyone who controls it inject arbitrary variables. Chapter 7 measures that</span></div>
<div class="kv"><span class="k">to write to the run summary</span><span class="v"><code>\$GITHUB_STEP_SUMMARY</code> takes Markdown and renders it on the run page. This is the cheapest good thing you can add to a workflow — a table of what actually happened, visible without opening logs</span></div>
</div>

<h3>Steps that are allowed to fail</h3>
<p><code>continue-on-error: true</code> lets a step fail without failing the job. This repository uses it exactly twice, and how it uses it is the point:</p>

<div class="out">"ESLint (informational)"                                  continue-on-error: true
"Next.js ESLint (informational)"                          continue-on-error: true
"Unit tests — money math + payment signature (required)"  KHONG co
"TypeScript type-check (required)"                        KHONG co</div>

<div class="callout ok">
<p><strong>The step names carry the classification.</strong> Anyone reading the log — or the workflow file, or a failing run six months from now — can see at a glance which steps are allowed to be red and which are not, without cross-referencing the YAML. That is what makes this a legitimate use rather than a way of hiding failures: the tolerance is <em>declared in the name</em>, so a green run with a red informational step is honest rather than misleading.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>continue-on-error</code> as a way to make CI quiet.</strong> The moment it appears on a step that checks correctness — a test, a typecheck, a security scan — the job&#39;s green tick stops meaning anything, and it stops meaning anything <em>silently</em>, since a passing job is not something anybody opens. If a check is too noisy to block on, the honest options are to fix it, to delete it, or to mark it informational in its own name. Leaving a correctness check nominally present but unable to fail is the worst of the three, because it also removes the pressure to do one of the other two.</p>
</div>

<h3>Conditions, and the two that get confused</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>if:</code> on a step</span><span class="lz-lnote">a false condition <strong>skips</strong> the step, which is not a failure. A skipped step costs nothing: measured on this run, the Linux-only system-libraries step took 24s on Linux and 0s on macOS and Windows where it was skipped</span></div>
<div class="lz-layer"><span class="lz-lname">the implicit <code>success()</code></span><span class="lz-lnote">every step has <code>if: success()</code> unless you say otherwise. Once a step fails, later steps skip — which is why cleanup and reporting steps need something explicit</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: always()</code></span><span class="lz-lnote">runs even after a failure <em>and</em> after a cancel. Correct for uploading logs and test reports; wrong for anything that acts on the world, because a cancelled run should not deploy</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: \${{ !cancelled() }}</code></span><span class="lz-lnote">runs after a failure but not after a cancel. This is what most people mean when they reach for <code>always()</code>, and it is the safer default of the two</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: failure()</code></span><span class="lz-lnote">runs only when something earlier failed. The right condition for a notification step, and the wrong one for log collection — you want the logs either way</span></div>
</div>

<h3>The steps you did not write</h3>
<p>Every action with a cleanup phase contributes a post-step, and the API shows both their order and something odder:</p>

<div class="out">thu tu dung:  checkout (buoc 2) -> setup-node (buoc 4)
thu tu don:   Post setup-node (15) -> Post checkout (16)

so hieu buoc KHONG lien tuc:
  job "Kiem tra ma"  di 1..8 roi nhay toi 15
  job "Dung Linux"   di 1..9 roi nhay toi 17</div>

<p>Cleanup runs in reverse order of setup — last set up, first torn down — which is the same discipline as a stack of resources anywhere else, and it matters when one action&#39;s cleanup depends on another action&#39;s still being present. The numbering gap is the runner reserving slots for post-steps it might need; it is observable and harmless, but worth recognising so a jump from step 8 to step 15 in a log does not read as missing output.</p>

<div class="callout">
<p><strong>The one sentence.</strong> A step passes when its shell exits zero, so everything about step reliability reduces to knowing which shell ran and what it did with the exit codes — and the default, without <code>pipefail</code>, will let a failed command inside a pipeline report success.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs.&lt;id&gt;.steps[*].shell</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#custom-shell — the exact command line for every shell option on every platform, including the two bash forms measured above. Worth reading once in full; the defaults are not guessable.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — the set builtin, and the exemptions for -e</span><span class="lc-sub">man bash, section on <code>set -e</code> — the authoritative list of contexts where a non-zero status does not cause an exit, including the inherited exemption inside a function called from a condition.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: GITHUB_OUTPUT, GITHUB_ENV, GITHUB_STEP_SUMMARY</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — the supported step-to-step channels, the heredoc form for multi-line values, and the Markdown summary that renders on the run page.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — exit codes, pipelines, and why set -e is not enough</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the full treatment of <code>set -euo pipefail</code>, what each flag actually buys, and the cases where the trio still lets a failure through.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — a deploy script that reported success while doing nothing</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the same class of bug outside CI, where a missing <code>pipefail</code> let a broken step pass and the deploy carried on to the swap.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Bước, mã thoát, và cái cờ giấu mất cú hỏng</h2>
<p class="lead">Một bước hỏng nếu tiến trình của nó thoát khác không. Quy tắc ấy đơn giản, đầy đủ, và giấu đi một lượng khổng lồ, bởi "tiến trình của nó" nghĩa là MỘT SHELL, và bạn nhận được shell nào thì phụ thuộc vào một dòng mà nhiều phần là bạn không viết.</p>

<h3>Shell mặc định không phải shell bạn tưởng mình xin</h3>
<p>Viết <code>run:</code> mà không có <code>shell:</code> thì GitHub chạy script của bạn bằng:</p>

<pre><code><span class="tok-comment"># mac dinh tren Linux va macOS</span>
bash -e {0}

<span class="tok-comment"># khi ban ghi ro shell: bash</span>
bash --noprofile --norc -eo pipefail {0}</code></pre>

<p>Khác biệt là <code>pipefail</code>. Đây là giá trị của đúng một cái cờ ấy, đo trên một script mà lệnh đầu tiên trong một đường ống bị hỏng:</p>

<div class="out">$ cat pipe.sh
lenh-khong-ton-tai | tail -1
echo "ma thoat cua ca ong: $?"

########  bash -e  (MAC DINH)  ########
pipe.sh: line 2: lenh-khong-ton-tai: command not found
ma thoat cua ca ong: 0
&gt;&gt;&gt; exit=0

########  bash -eo pipefail  (shell: bash)  ########
pipe.sh: line 2: lenh-khong-ton-tai: command not found
&gt;&gt;&gt; exit=127</div>

<div class="callout warn">
<p><strong>Cùng một script. Dưới mặc định, bước ấy XANH.</strong> Dòng "command not found" nằm sờ sờ trong log, mà bước vẫn báo thành công, vì mã thoát của một đường ống là mã thoát của lệnh <em>CUỐI</em> và <code>tail</code> đã đọc-không-gì-cả một cách thành công. Thêm đúng một dòng <code>shell: bash</code> là biến chính lần chạy ấy thành thoát 127. Đây là thay đổi một dòng đáng giá nhất trong hầu hết các tệp workflow.</p>
</div>

<h3><code>set -e</code> yếu hơn vẻ ngoài của nó</h3>
<p>Ngay cả khi đã bật <code>-e</code>, vẫn có những ngữ cảnh mà một lệnh hỏng KHÔNG dừng script. Đo thật, cả năm chỗ trong một lần chạy:</p>

<div class="out">1. trong if           -> chay tiep
2. ben trai &amp;&amp;        -> chay tiep
3. co ! dang truoc    -> chay tiep
4. trong HAM duoc goi trong if -> CA HAM duoc mien, chay tiep
5. goi TRAN           -> day moi chet (exit 127)</div>

<p>Ba chỗ đầu là những chỗ có ghi trong tài liệu và hợp lý: một lệnh đang được <em>KIỂM</em> thì được phép hỏng, đó chính là mục đích của việc kiểm nó. Chỗ thứ tư mới làm người ta bất ngờ, và đáng phát biểu cho chính xác: nếu một hàm shell được gọi từ bên trong một <code>if</code>, thì MỌI lệnh bên trong hàm ấy cũng được miễn — sự miễn trừ được THỪA KẾ, không bị giới hạn ở chính lời gọi. Một hàm viết cẩn thận đầy các phép kiểm lỗi có thể chạy tới hết với mọi phép kiểm bị bỏ qua, chỉ vì chỗ nó được gọi.</p>

<div class="pitfall">
<p><strong>Bẫy — cái lệnh đo đã giấu mất đáp án.</strong> Trong lúc đo cái danh sách trên, lệnh đầu tiên viết ra cho nó là <code>bash -e mien.sh | grep -v "command not found"; echo \$?</code> — và nó in ra <strong>0</strong>. Đọc thẳng thì câu đó bảo <code>set -e</code> chẳng hề kích hoạt lần nào. Sai: <code>\$?</code> ở đó là mã thoát của <code>grep</code>, không phải của script. Chạy lại mà bỏ cái ống đi:</p>
<p><code>bash -e mien.sh</code> → <strong>127</strong> · <code>bash -e mien.sh | cat</code> → <strong>0</strong> · <code>pipefail</code> + ống → <strong>127</strong></p>
<p>Cái bẫy mà bài này đang nói tới đã cắn chính phép đo của bài, và đó là minh hoạ hữu ích nhất có thể có: nó không phải một kiểu hỏng kỳ dị, nó là thứ xảy ra MẶC ĐỊNH với bất kỳ ai đổ một lệnh qua một cái ống.</p>
</div>

<h3>Bước, và cái gì đi được sang bước kế</h3>
<div class="kv-grid">
<div class="kv"><span class="k">mỗi bước là một tiến trình mới</span><span class="v">biến, hàm shell, <code>cd</code>, <code>set -x</code> — không cái nào tới được bước kế. Thư mục làm việc đặt lại về <code>working-directory</code> của job mỗi lần</span></div>
<div class="kv"><span class="k">để chuyển một giá trị đi tiếp</span><span class="v"><code>echo "K=V" &gt;&gt; \$GITHUB_ENV</code> cho một biến môi trường, hoặc <code>echo "k=v" &gt;&gt; \$GITHUB_OUTPUT</code> kèm <code>id:</code> trên bước, đọc bằng <code>\${{ steps.&lt;id&gt;.outputs.k }}</code></span></div>
<div class="kv"><span class="k">để chuyển giá trị nhiều dòng</span><span class="v">dạng heredoc với dấu phân cách ngẫu nhiên — một giá trị chứa ký tự xuống dòng mà viết ngây thơ thì cho phép ai kiểm soát được nó chèn vào biến tuỳ ý. Chương 7 đo chuyện đó</span></div>
<div class="kv"><span class="k">để ghi vào bản tóm tắt lần chạy</span><span class="v"><code>\$GITHUB_STEP_SUMMARY</code> nhận Markdown và hiển thị nó trên trang lần chạy. Đây là thứ tốt rẻ nhất bạn thêm được vào một workflow — một bảng kể chuyện gì đã xảy ra, nhìn thấy được mà không phải mở log</span></div>
</div>

<h3>Những bước được phép hỏng</h3>
<p><code>continue-on-error: true</code> cho một bước hỏng mà không làm hỏng job. Kho này dùng nó đúng hai lần, và CÁCH nó dùng mới là điểm chính:</p>

<div class="out">"ESLint (informational)"                                  continue-on-error: true
"Next.js ESLint (informational)"                          continue-on-error: true
"Unit tests — money math + payment signature (required)"  KHONG co
"TypeScript type-check (required)"                        KHONG co</div>

<div class="callout ok">
<p><strong>Chính TÊN BƯỚC mang theo sự phân loại.</strong> Bất cứ ai đọc log — hay đọc tệp workflow, hay đọc một lần chạy hỏng sáu tháng sau — đều thấy ngay bước nào được phép đỏ và bước nào không, mà không phải đối chiếu với YAML. Đó là thứ làm cho đây thành một cách dùng chính đáng chứ không phải một cách giấu cú hỏng: sự dung thứ được <em>KHAI BÁO NGAY TRONG TÊN</em>, nên một lần chạy xanh có kèm một bước informational đỏ là trung thực chứ không đánh lừa.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>continue-on-error</code> như một cách làm CI im mồm.</strong> Ngay khoảnh khắc nó xuất hiện trên một bước KIỂM TÍNH ĐÚNG ĐẮN — một bài test, một lượt kiểm kiểu, một lượt quét bảo mật — thì dấu tick xanh của job thôi mang nghĩa gì, và nó thôi mang nghĩa một cách <em>ÂM THẦM</em>, vì một job đang qua thì chẳng ai đi mở ra xem. Nếu một phép kiểm ồn quá để đem ra chặn, thì các lựa chọn trung thực là vá nó, xoá nó, hoặc đánh dấu nó là informational ngay trong tên của nó. Để một phép kiểm đúng-đắn có mặt trên danh nghĩa mà không thể hỏng được là tệ nhất trong ba, vì nó còn gỡ luôn cái áp lực phải làm một trong hai cách kia.</p>
</div>

<h3>Điều kiện, và hai cái hay bị lẫn</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>if:</code> trên một bước</span><span class="lz-lnote">điều kiện sai thì <strong>BỎ QUA</strong> bước, và bỏ qua không phải hỏng. Một bước bị bỏ qua không tốn gì: đo trên lần chạy này, "Cài thư viện hệ thống (Linux)" tốn 24s trên Linux và 0s trên macOS với Windows nơi nó bị bỏ qua</span></div>
<div class="lz-layer"><span class="lz-lname"><code>success()</code> ngầm định</span><span class="lz-lnote">mọi bước đều có <code>if: success()</code> trừ khi bạn nói khác. Một khi có bước hỏng, các bước sau bị bỏ qua — và đó là lý do bước dọn dẹp với bước báo cáo cần một điều kiện tường minh</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: always()</code></span><span class="lz-lnote">chạy cả sau khi hỏng <em>VÀ</em> sau khi bị huỷ. Đúng cho việc tải log và báo cáo test lên; SAI cho bất cứ thứ gì tác động ra thế giới, vì một lần chạy bị huỷ thì không nên deploy</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: \${{ !cancelled() }}</code></span><span class="lz-lnote">chạy sau khi hỏng nhưng không chạy sau khi bị huỷ. Đây là thứ phần lớn người ta THẬT SỰ muốn khi họ với tay tới <code>always()</code>, và nó là mặc định an toàn hơn trong hai cái</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: failure()</code></span><span class="lz-lnote">chỉ chạy khi có thứ gì trước đó hỏng. Đúng cho một bước gửi thông báo, và SAI cho việc thu thập log — bạn muốn có log trong cả hai trường hợp</span></div>
</div>

<h3>Những bước bạn không viết</h3>
<p>Mỗi action có pha dọn dẹp đều góp một post-step, và API cho thấy cả thứ tự của chúng lẫn một điều lạ hơn:</p>

<div class="out">thu tu dung:  checkout (buoc 2) -> setup-node (buoc 4)
thu tu don:   Post setup-node (15) -> Post checkout (16)

so hieu buoc KHONG lien tuc:
  job "Kiem tra ma"  di 1..8 roi nhay toi 15
  job "Dung Linux"   di 1..9 roi nhay toi 17</div>

<p>Việc dọn chạy NGƯỢC thứ tự dựng — dựng sau cùng thì tháo đầu tiên — cùng một kỷ luật với một chồng tài nguyên ở bất cứ đâu khác, và nó có nghĩa khi phần dọn của action này phụ thuộc vào việc action kia vẫn còn đó. Chỗ trống trong đánh số là runner dành sẵn slot cho những post-step nó có thể cần; nó quan sát được và vô hại, nhưng đáng nhận ra để một cú nhảy từ bước 8 sang bước 15 trong log không bị đọc thành thiếu mất phần đầu ra.</p>

<div class="callout">
<p><strong>Một câu.</strong> Một bước qua khi shell của nó thoát bằng không, nên mọi chuyện về độ tin cậy của bước quy về việc biết shell nào đã chạy và nó đã làm gì với các mã thoát — và cái mặc định, không có <code>pipefail</code>, sẽ để một lệnh hỏng bên trong một đường ống báo cáo thành công.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs.&lt;id&gt;.steps[*].shell</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#custom-shell — dòng lệnh chính xác cho mọi lựa chọn shell trên mọi nền tảng, gồm cả hai dạng bash vừa đo bên trên. Đáng đọc trọn một lần; các mặc định không đoán ra được.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — lệnh dựng sẵn set, và các trường hợp miễn trừ của -e</span><span class="lc-sub">man bash, phần về <code>set -e</code> — danh sách chính thức các ngữ cảnh mà một trạng thái khác không không gây thoát, gồm cả sự miễn trừ được thừa kế bên trong một hàm gọi từ một điều kiện.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: GITHUB_OUTPUT, GITHUB_ENV, GITHUB_STEP_SUMMARY</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — các kênh bước-sang-bước được hỗ trợ, dạng heredoc cho giá trị nhiều dòng, và bản tóm tắt Markdown hiện trên trang lần chạy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — mã thoát, đường ống, và vì sao set -e chưa đủ</span><span class="lc-sub">/courses/linux-bash/learn${REF} — phần trình bày đầy đủ về <code>set -euo pipefail</code>, mỗi cờ thật sự mua được gì, và những ca mà cả bộ ba vẫn để lọt một cú hỏng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — một script deploy báo thành công trong khi chẳng làm gì</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cùng loại lỗi ở ngoài CI, nơi một chỗ thiếu <code>pipefail</code> đã để một bước hỏng đi qua và cuộc deploy cứ thế tiến tới lúc tráo.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.5 ─────────────────────────── */
    {
      title: '2.5 — matrix, fail-fast, and why this repository turned it off|||2.5 — matrix, fail-fast, và vì sao kho này tắt nó đi',
      slug: 'ga-2-5-ma-tran',
      type: 'VIDEO',
      description: '3 job khai báo nở thành 5 job chạy. `fail-fast` mặc định BẬT, và nó huỷ những nhánh đang chạy tốt — tính trên số đo thật: mặc định thu về 0 bản cài, tắt đi thu về 2 và tiết kiệm 564 máy-giây cho lần chạy lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2><code>matrix</code>, <code>fail-fast</code>, and why this repository turned it off</h2>
<p class="lead">A matrix is a loop over job definitions. It is the cleanest thing in the whole syntax and it has one default that will, on the day it matters, throw away work that was going fine.</p>

<h3>Three declared jobs, five running jobs</h3>
<p>The release workflow declares <code>kiem-tra</code>, <code>dung</code> and <code>cong-bo</code>. The run had five jobs, because <code>dung</code> carries this:</p>

<pre><code>  dung:
    name: Dung \${{ matrix.ten }}
    needs: kiem-tra
    runs-on: \${{ matrix.os }}
    timeout-minutes: 40
    strategy:
      <span class="tok-comment"># Mot nen tang hong thi hai nen tang kia VAN dung xong.</span>
      <span class="tok-comment"># Mac dinh cua GitHub la huy het — ma tha co hai ban con hon khong co ban nao.</span>
      fail-fast: false
      matrix:
        include:
          - os: macos-latest
            ten: macOS
            lenh: dist:mac
          - os: windows-latest
            ten: Windows
            lenh: dist:win
          - os: ubuntu-latest
            ten: Linux
            lenh: dist:linux</code></pre>

<p>Every key inside a matrix entry becomes available as <code>matrix.&lt;key&gt;</code> anywhere in the job — including in <code>runs-on:</code> and <code>name:</code>, which is what turns one definition into three differently-named jobs on three different machines. The <code>lenh</code> key is not a special word; it is an ordinary value carried through to the build step, so the same job body runs <code>dist:mac</code>, <code>dist:win</code> or <code>dist:linux</code>.</p>

<div class="kv-grid">
<div class="kv"><span class="k">cross-product form</span><span class="v"><code>matrix: {os: [a, b], node: [18, 20]}</code> generates <strong>four</strong> jobs — every combination. Two more values in each list gives sixteen, and that arithmetic is where matrices become expensive without anyone deciding to make them expensive</span></div>
<div class="kv"><span class="k"><code>include:</code></span><span class="v">an explicit list of combinations, as above. Use it when the combinations are not a product — this repository does not want "macOS with dist:win"</span></div>
<div class="kv"><span class="k"><code>exclude:</code></span><span class="v">removes specific combinations from a cross product. Useful for "everything except this one broken pairing"</span></div>
<div class="kv"><span class="k"><code>max-parallel:</code></span><span class="v">caps how many legs run at once. Reach for it when the legs contend over something external — a shared test database, an API rate limit — not to save money, since the total work is unchanged</span></div>
</div>

<h3>The default that costs you</h3>
<p><code>fail-fast</code> defaults to <strong>true</strong>: the moment any leg fails, GitHub cancels every other leg that is still running. The reasoning is sound in the abstract — if the suite is broken, why keep burning machines? Apply it to this repository&#39;s measured timings and the abstraction gets expensive.</p>

<p>Take the real failure this repository had: <code>vite build</code> running out of heap on the macOS leg. It died early. Say at 60 seconds:</p>

<div class="out">### fail-fast: true (MAC DINH cua GitHub)
  macOS hong luc t=60 -> GitHub HUY hai nhanh kia ngay
  Linux dang o 60/241s   -> bi huy, KHONG co ban cai
  Windows dang o 60/323s -> bi huy, KHONG co ban cai
  ket qua: 0 ban cai
  da dot 3 x 60 = 180 may-giay, thu ve 0

### fail-fast: false (kho NAY dat)
  macOS hong luc t=60 -> hai nhanh kia CHAY TIEP
  Linux xong 241s   -> CO ban cai
  Windows xong 323s -> CO ban cai
  ket qua: 2/3 ban cai
  dot 60 + 241 + 323 = 624 may-giay, thu ve 2 ban cai

### lan chay LAI, sau khi va
  fail-fast: true  -> phai dung lai ca ba: 1001 may-giay
  fail-fast: false -> chi dung lai macOS:   437 may-giay
                      tiet kiem 564 may-giay</div>

<div class="callout warn">
<p><strong>The default optimises for the wrong resource.</strong> It saves machine-seconds in the failing run and spends far more of them in the retry, because a cancelled leg has to be redone from scratch. And the machine-seconds are the smaller loss: with <code>fail-fast: true</code> you end the run holding <em>nothing</em>, so you cannot ship a partial release, cannot compare a working platform against a broken one, and cannot tell whether the failure was platform-specific or universal — which is the first question you will want answered.</p>
</div>

<div class="callout ok">
<p><strong>The comment in the workflow file says it in one line</strong> (translated from the Vietnamese in the source): better to have two builds than none. That is the whole decision, and it is written where the next person to read the file will find it.</p>
</div>

<h3>When the default is right</h3>
<p><code>fail-fast: true</code> is not a mistake everywhere. It fits when the legs are testing the same thing under different conditions and any failure invalidates the whole answer:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">keep it on — a test matrix over Node versions</span><span class="lz-lnote">if the suite fails on Node 18 you are not shipping regardless of what Node 20 says. Cancelling the rest is a straight saving</span></div>
<div class="lz-layer"><span class="lz-lname">turn it off — a build matrix producing artifacts</span><span class="lz-lnote">each leg produces something independently useful. This repository&#39;s case</span></div>
<div class="lz-layer"><span class="lz-lname">turn it off — a large matrix you are debugging</span><span class="lz-lnote">when four of twelve legs fail, you want to know <em>which four</em>. With fail-fast on, you learn about one and the other eleven are cancelled, so it takes several runs to see a pattern that one run could have shown</span></div>
<div class="lz-layer"><span class="lz-lname">turn it off — legs with wildly different durations</span><span class="lz-lnote">measured here: Linux 241s against macOS 437s. A fast leg failing cancels a slow leg that was 80% done, and that slow leg is the expensive one to redo</span></div>
</div>

<h3>Two things that also come out of the timings</h3>
<p>The desktop release has run twelve recent times. Ten succeeded and two failed:</p>

<div class="out">thanh cong (10 lan): 555, 470, 409, 470, 420, 425, 476, 525, 403, 429  -> TB ~455s
HONG      ( 2 lan): 80, 334                                             -> HONG NHANH HON</div>

<div class="callout">
<p><strong>Failures are faster than successes, and that is worth internalising as a reading habit.</strong> A run that finished in 80 seconds when the normal time is 455 did not go well — it stopped early. So run duration is a usable signal before you open anything: much shorter than usual means something bailed, much longer than usual means something hung or retried. Chapter 9 builds this into a proper triage order.</p>
</div>

<p>The other one is <code>timeout-minutes: 40</code> on the matrix job. Six of this repository&#39;s workflows set an explicit timeout; the default, if you set none, is <strong>360 minutes</strong> — six hours. A hung job with no timeout holds a runner for six hours and, on a private repository at the macOS multiplier, bills 3,600 minutes for producing nothing at all.</p>

<div class="pitfall">
<p><strong>Bẫy — a matrix that grew by multiplication.</strong> <code>{os: [ubuntu, macos, windows], node: [18, 20, 22]}</code> is nine jobs, which reads as reasonable until you price it: at the platform multipliers from 2.3, the three macOS legs alone would dominate the bill. Matrices grow by <em>multiplication</em> while the config grows by addition, so a one-line change adds three jobs. Before adding a dimension, ask what a leg would tell you that another leg does not — and if the answer is "it would be the same", <code>include:</code> the combinations that matter rather than crossing everything with everything.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> A matrix turns one job definition into <em>n</em> real jobs on real machines, and <code>fail-fast: true</code> — the default — trades the results you were about to get for machine-seconds you will spend again anyway on the retry.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Running variations of jobs in a workflow</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs — the cross-product rules, <code>include</code> and <code>exclude</code> semantics (including the surprising ones where <code>include</code> adds keys to existing combinations), and the 256-job ceiling per workflow run.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — jobs.&lt;id&gt;.strategy.fail-fast and max-parallel</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategyfail-fast — the default value, and the per-step <code>continue-on-error</code> interaction that lets one leg be tolerated while others are not.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — jobs.&lt;id&gt;.timeout-minutes</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idtimeout-minutes — the 360-minute default that applies when you set nothing, and the separate per-step timeout.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — partial success is a result, not a failure</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the same argument in a deploy: a rollout that reached two of three nodes is information you want to keep, and a pipeline that discards it on the first error is harder to reason about than one that does not.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2><code>matrix</code>, <code>fail-fast</code>, và vì sao kho này tắt nó đi</h2>
<p class="lead">Một ma trận là một vòng lặp trên các định nghĩa job. Nó là thứ gọn gàng nhất trong cả bộ cú pháp và nó có đúng một cái mặc định mà vào cái ngày nó có ý nghĩa, sẽ vứt đi phần việc vốn đang chạy tốt.</p>

<h3>Ba job khai báo, năm job chạy</h3>
<p>Workflow phát hành khai <code>kiem-tra</code>, <code>dung</code> và <code>cong-bo</code>. Lần chạy có năm job, vì <code>dung</code> mang theo cái này:</p>

<pre><code>  dung:
    name: Dung \${{ matrix.ten }}
    needs: kiem-tra
    runs-on: \${{ matrix.os }}
    timeout-minutes: 40
    strategy:
      <span class="tok-comment"># Mot nen tang hong thi hai nen tang kia VAN dung xong.</span>
      <span class="tok-comment"># Mac dinh cua GitHub la huy het — ma tha co hai ban con hon khong co ban nao.</span>
      fail-fast: false
      matrix:
        include:
          - os: macos-latest
            ten: macOS
            lenh: dist:mac
          - os: windows-latest
            ten: Windows
            lenh: dist:win
          - os: ubuntu-latest
            ten: Linux
            lenh: dist:linux</code></pre>

<p>Mọi khoá bên trong một mục ma trận đều trở thành <code>matrix.&lt;khoá&gt;</code> dùng được ở bất cứ đâu trong job — kể cả trong <code>runs-on:</code> và <code>name:</code>, và đó chính là thứ biến một định nghĩa thành ba job mang tên khác nhau trên ba cỗ máy khác nhau. Khoá <code>lenh</code> không phải từ đặc biệt gì; nó là một giá trị bình thường được mang xuống bước dựng, nên cùng một thân job chạy <code>dist:mac</code>, <code>dist:win</code> hoặc <code>dist:linux</code>.</p>

<div class="kv-grid">
<div class="kv"><span class="k">dạng tích chéo</span><span class="v"><code>matrix: {os: [a, b], node: [18, 20]}</code> sinh ra <strong>BỐN</strong> job — mọi tổ hợp. Thêm hai giá trị vào mỗi danh sách là ra mười sáu, và chính phép tính ấy là chỗ ma trận trở nên đắt mà không ai quyết định làm cho nó đắt</span></div>
<div class="kv"><span class="k"><code>include:</code></span><span class="v">một danh sách tổ hợp tường minh, như trên. Dùng khi các tổ hợp KHÔNG phải một tích — kho này không muốn "macOS với dist:win"</span></div>
<div class="kv"><span class="k"><code>exclude:</code></span><span class="v">gỡ các tổ hợp cụ thể khỏi một tích chéo. Hữu ích cho kiểu "tất cả trừ đúng cặp hỏng này"</span></div>
<div class="kv"><span class="k"><code>max-parallel:</code></span><span class="v">chặn số nhánh chạy cùng lúc. Với tay tới nó khi các nhánh tranh nhau một thứ bên ngoài — một cơ sở dữ liệu test dùng chung, một trần gọi API — chứ không phải để tiết kiệm tiền, vì tổng công việc không đổi</span></div>
</div>

<h3>Cái mặc định khiến bạn tốn</h3>
<p><code>fail-fast</code> mặc định là <strong>true</strong>: ngay khoảnh khắc bất kỳ nhánh nào hỏng, GitHub HUỶ mọi nhánh còn đang chạy. Lý lẽ nghe hợp lý ở mức trừu tượng — nếu cả bộ đã hỏng, đốt máy tiếp làm gì? Đem áp lên số đo thật của kho này thì cái trừu tượng ấy hoá đắt.</p>

<p>Lấy cú hỏng thật kho này từng gặp: <code>vite build</code> cạn heap ở nhánh macOS. Nó chết sớm. Cứ cho là ở giây thứ 60:</p>

<div class="out">### fail-fast: true (MAC DINH cua GitHub)
  macOS hong luc t=60 -> GitHub HUY hai nhanh kia ngay
  Linux dang o 60/241s   -> bi huy, KHONG co ban cai
  Windows dang o 60/323s -> bi huy, KHONG co ban cai
  ket qua: 0 ban cai
  da dot 3 x 60 = 180 may-giay, thu ve 0

### fail-fast: false (kho NAY dat)
  macOS hong luc t=60 -> hai nhanh kia CHAY TIEP
  Linux xong 241s   -> CO ban cai
  Windows xong 323s -> CO ban cai
  ket qua: 2/3 ban cai
  dot 60 + 241 + 323 = 624 may-giay, thu ve 2 ban cai

### lan chay LAI, sau khi va
  fail-fast: true  -> phai dung lai ca ba: 1001 may-giay
  fail-fast: false -> chi dung lai macOS:   437 may-giay
                      tiet kiem 564 may-giay</div>

<div class="callout warn">
<p><strong>Cái mặc định đang tối ưu nhầm tài nguyên.</strong> Nó tiết kiệm máy-giây trong lần chạy hỏng rồi tiêu tốn nhiều hơn hẳn ở lần chạy lại, bởi một nhánh bị huỷ thì phải làm lại từ đầu. Mà máy-giây còn là mất mát NHỎ hơn: với <code>fail-fast: true</code> bạn kết thúc lần chạy trong tay <em>KHÔNG CÓ GÌ</em>, nên bạn không phát hành được một phần, không đối chiếu được nền tảng chạy tốt với nền tảng hỏng, và không biết được cú hỏng là riêng của nền tảng hay là chung — mà đó lại là câu hỏi đầu tiên bạn sẽ muốn có đáp án.</p>
</div>

<div class="callout ok">
<p><strong>Bình luận trong chính tệp workflow nói gọn trong một dòng:</strong> "thà có hai bản còn hơn không có bản nào". Đó là toàn bộ quyết định, và nó được viết ngay chỗ mà người kế tiếp đọc tệp sẽ thấy.</p>
</div>

<h3>Khi nào cái mặc định là ĐÚNG</h3>
<p><code>fail-fast: true</code> không phải sai lầm ở mọi nơi. Nó hợp khi các nhánh đang kiểm CÙNG một thứ dưới những điều kiện khác nhau và bất kỳ cú hỏng nào cũng vô hiệu hoá cả câu trả lời:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">GIỮ bật — một ma trận test qua các phiên bản Node</span><span class="lz-lnote">nếu bộ test hỏng trên Node 18 thì bạn không phát hành, bất kể Node 20 nói gì. Huỷ phần còn lại là một khoản tiết kiệm thẳng</span></div>
<div class="lz-layer"><span class="lz-lname">TẮT — một ma trận dựng sinh ra artifact</span><span class="lz-lnote">mỗi nhánh tạo ra một thứ tự nó đã hữu ích. Ca của kho này</span></div>
<div class="lz-layer"><span class="lz-lname">TẮT — một ma trận lớn mà bạn đang gỡ lỗi</span><span class="lz-lnote">khi bốn trong mười hai nhánh hỏng, bạn muốn biết <em>BỐN CÁI NÀO</em>. Với fail-fast bật, bạn biết được một cái và mười một cái kia bị huỷ, nên phải mấy lần chạy mới thấy được cái quy luật mà một lần chạy đã có thể cho thấy</span></div>
<div class="lz-layer"><span class="lz-lname">TẮT — các nhánh có độ dài chênh nhau dữ dội</span><span class="lz-lnote">đo ở đây: Linux 241s so với macOS 437s. Một nhánh nhanh hỏng sẽ huỷ một nhánh chậm vốn đã xong 80%, và cái nhánh chậm ấy mới là cái đắt để làm lại</span></div>
</div>

<h3>Hai thứ nữa cũng rơi ra từ nhịp thời gian</h3>
<p>Bản phát hành desktop đã chạy mười hai lần gần đây. Mười lần thành công và hai lần hỏng:</p>

<div class="out">thanh cong (10 lan): 555, 470, 409, 470, 420, 425, 476, 525, 403, 429  -> TB ~455s
HONG      ( 2 lan): 80, 334                                             -> HONG NHANH HON</div>

<div class="callout">
<p><strong>Hỏng thì nhanh hơn thành công, và điều đó đáng nội hoá thành một thói quen ĐỌC.</strong> Một lần chạy xong trong 80 giây khi giờ bình thường là 455 thì đã không suôn sẻ — nó dừng sớm. Nên độ dài lần chạy là một tín hiệu dùng được TRƯỚC khi bạn mở bất cứ thứ gì: ngắn hơn hẳn thường lệ nghĩa là có thứ gì đã bỏ cuộc, dài hơn hẳn nghĩa là có thứ gì treo hoặc thử lại. Chương 9 dựng cái này thành một thứ tự phân loại tử tế.</p>
</div>

<p>Cái thứ hai là <code>timeout-minutes: 40</code> trên job ma trận. Sáu trong số workflow của kho này đặt thời hạn tường minh; mặc định, nếu bạn không đặt gì, là <strong>360 phút</strong> — sáu tiếng. Một job treo mà không có thời hạn sẽ giữ một runner suốt sáu tiếng và, ở một kho riêng tư với hệ số macOS, tính tiền 3.600 phút cho việc chẳng tạo ra cái gì.</p>

<div class="pitfall">
<p><strong>Bẫy — một ma trận phình ra bằng phép NHÂN.</strong> <code>{os: [ubuntu, macos, windows], node: [18, 20, 22]}</code> là chín job, đọc lên nghe hợp lý cho tới khi bạn tính tiền cho nó: với các hệ số nền tảng ở bài 2.3, chỉ riêng ba nhánh macOS đã áp đảo hoá đơn. Ma trận lớn lên bằng phép <em>NHÂN</em> trong khi cấu hình lớn lên bằng phép cộng, nên một thay đổi một dòng thêm ba job. Trước khi thêm một chiều, hãy hỏi một nhánh sẽ cho bạn biết điều gì mà nhánh khác không cho — và nếu đáp án là "nó sẽ y hệt", thì hãy <code>include:</code> đúng những tổ hợp có nghĩa thay vì đem mọi thứ nhân với mọi thứ.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Một ma trận biến một định nghĩa job thành <em>n</em> job thật trên máy thật, và <code>fail-fast: true</code> — cái mặc định — đem đổi những kết quả bạn sắp có lấy số máy-giây mà rồi bạn cũng sẽ tiêu lại ở lần chạy lại.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Running variations of jobs in a workflow</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs — luật tích chéo, ngữ nghĩa <code>include</code> và <code>exclude</code> (gồm cả những chỗ bất ngờ nơi <code>include</code> THÊM khoá vào các tổ hợp có sẵn), và trần 256 job cho mỗi lần chạy workflow.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — jobs.&lt;id&gt;.strategy.fail-fast và max-parallel</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategyfail-fast — giá trị mặc định, và tương tác với <code>continue-on-error</code> ở mức bước, thứ cho phép dung thứ một nhánh trong khi không dung thứ những nhánh khác.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — jobs.&lt;id&gt;.timeout-minutes</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idtimeout-minutes — mặc định 360 phút áp dụng khi bạn không đặt gì, và thời hạn riêng ở mức từng bước.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — thành công một phần là một KẾT QUẢ, không phải một cú hỏng</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cùng lập luận ấy trong một cuộc deploy: một lượt triển khai tới được hai trong ba nút là thông tin bạn muốn giữ, và một đường ống vứt nó đi ngay lỗi đầu tiên thì khó lập luận hơn một đường ống không vứt.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.6 ─────────────────────────── */
    {
      title: '2.6 — Chapter 2 quiz|||2.6 — Kiểm tra Chương 2',
      slug: 'ga-2-6-kiem-tra',
      type: 'QUIZ',
      description: 'Tám câu trên số đo của chương: 5 job / 5 runner_id, 5m12s máy ngồi không, Windows 3,2 lần ở npm ci, macOS 82% hoá đơn, và cái cờ pipefail giấu mất một cú hỏng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>What Chapter 2 measured</h2>
<p class="lead">Eight questions, twelve minutes. Everything here came out of one workflow run read through the API, plus a bash rig — including the one case where the measurement command itself hid the answer.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">2.1 — a job is a machine</span><span class="lz-lnote">5 jobs produced 5 distinct <code>runner_id</code>s; queueing took 2–3 seconds against the 41–268 minutes a scheduled run waits</span></div>
<div class="lz-layer"><span class="lz-lname">2.2 — <code>needs:</code></span><span class="lz-lnote">Linux finished 3m17s early and waited; 5m12s of finished-but-unusable machine time across the run</span></div>
<div class="lz-layer"><span class="lz-lname">2.3 — three platforms</span><span class="lz-lnote">Windows 3.2× at <code>npm ci</code> but 1.1× at the build; macOS 44% of wall-clock and 82% of a private repository&#39;s bill</span></div>
<div class="lz-layer"><span class="lz-lname">2.4 — steps and exit codes</span><span class="lz-lnote">the default <code>bash -e</code> reports success for a failed command in a pipeline; <code>shell: bash</code> adds <code>pipefail</code> and reports 127</span></div>
<div class="lz-layer"><span class="lz-lname">2.5 — matrix</span><span class="lz-lnote"><code>fail-fast: true</code> would have ended the run with zero installers and cost 564 extra machine-seconds on the retry</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Chương 2 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Mọi thứ ở đây ra từ một lần chạy workflow đọc qua API, cộng một bộ đồ nghề bash — kể cả cái ca mà chính lệnh đo đã giấu mất đáp án.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">2.1 — một job là một cỗ máy</span><span class="lz-lnote">5 job cho ra 5 <code>runner_id</code> khác nhau; xếp hàng mất 2–3 giây so với 41–268 phút mà một lần chạy theo lịch phải đợi</span></div>
<div class="lz-layer"><span class="lz-lname">2.2 — <code>needs:</code></span><span class="lz-lnote">Linux xong sớm 3m17s rồi ngồi chờ; cả lần chạy có 5m12s thời gian máy dựng-xong-không-dùng-được</span></div>
<div class="lz-layer"><span class="lz-lname">2.3 — ba nền tảng</span><span class="lz-lnote">Windows 3,2 lần ở <code>npm ci</code> nhưng 1,1 lần ở bước dựng; macOS chiếm 44% thời gian và 82% hoá đơn của một kho riêng tư</span></div>
<div class="lz-layer"><span class="lz-lname">2.4 — bước và mã thoát</span><span class="lz-lnote">mặc định <code>bash -e</code> báo thành công cho một lệnh hỏng trong đường ống; <code>shell: bash</code> thêm <code>pipefail</code> và báo 127</span></div>
<div class="lz-layer"><span class="lz-lname">2.5 — ma trận</span><span class="lz-lnote"><code>fail-fast: true</code> sẽ kết thúc lần chạy với KHÔNG bản cài nào và tốn thêm 564 máy-giây ở lần chạy lại</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'One workflow run had five jobs, three of them asking for the label ubuntu-latest. How many distinct runners did the API report?|||Một lần chạy workflow có năm job, ba trong số đó xin nhãn ubuntu-latest. API báo bao nhiêu runner khác nhau?',
            options: [
              'Five — every job gets its own machine, and asking for the same label means the same kind of machine, never the same one|||Năm — mỗi job được một cỗ máy riêng, và xin cùng một nhãn nghĩa là cùng LOẠI máy, không bao giờ là cùng MỘT máy',
              'Three — jobs sharing a label are packed onto one runner to save capacity|||Ba — các job dùng chung một nhãn được dồn lên một runner để tiết kiệm năng lực',
              'One — a workflow run occupies a single runner for its whole duration|||Một — một lần chạy workflow chiếm một runner duy nhất suốt thời gian của nó',
              'Two — the three ubuntu-latest jobs shared a runner, macOS and Windows each got their own|||Hai — ba job ubuntu-latest dùng chung một runner, macOS và Windows mỗi cái một runner riêng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A step runs `export VERSION=1.2.3`. The next step in the same job echoes $VERSION. What does it print?|||Một bước chạy `export VERSION=1.2.3`. Bước kế trong CÙNG job echo $VERSION. Nó in ra gì?',
            options: [
              'Nothing — each step is a separate shell process; the supported channel is writing to the file $GITHUB_ENV points at|||Không gì — mỗi bước là một tiến trình shell riêng; kênh được hỗ trợ là ghi vào tệp mà $GITHUB_ENV trỏ tới',
              '1.2.3 — exported variables persist for the rest of the job|||1.2.3 — biến đã export tồn tại suốt phần còn lại của job',
              '1.2.3, but only if the two steps use the same shell: value|||1.2.3, nhưng chỉ khi hai bước dùng cùng một giá trị shell:',
              'It fails the step — referencing an unset variable is an error under the default shell|||Nó làm bước hỏng — tham chiếu một biến chưa đặt là lỗi dưới shell mặc định',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Three build jobs started together; the publish job had `needs:` on all three. Linux finished at 19:54:49, macOS at 19:58:05. What did that cost?|||Ba job dựng cùng khởi động; job công bố có `needs:` cả ba. Linux xong 19:54:49, macOS xong 19:58:05. Cái đó tốn gì?',
            options: [
              'Linux sat finished and unusable for 3m17s — 5m12s across both early finishers — because needs: waits for every leg and the slowest sets the pace|||Linux nằm đó đã xong mà không dùng được suốt 3m17s — cả hai kẻ xong sớm cộng lại 5m12s — vì needs: đợi MỌI nhánh và kẻ chậm nhất định nhịp',
              'Nothing — GitHub starts the publish job as soon as the first dependency finishes|||Không gì — GitHub khởi động job công bố ngay khi phụ thuộc đầu tiên xong',
              'Linux was cancelled once it finished, to free the runner|||Linux bị huỷ ngay khi xong, để giải phóng runner',
              'The publish job ran three times, once per completed dependency|||Job công bố chạy ba lần, mỗi phụ thuộc hoàn thành một lần',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Measured on the same commit: Windows was 3.2× slower than Linux at `npm ci` but only 1.1× slower at the build step. What does that show?|||Đo trên cùng một commit: Windows chậm hơn Linux 3,2 lần ở `npm ci` nhưng chỉ 1,1 lần ở bước dựng. Điều đó cho thấy gì?',
            options: [
              'A platform has a profile, not a speed — Windows loses on operations counted in file creations, not on CPU work|||Một nền tảng có một HỒ SƠ chứ không có một TỐC ĐỘ — Windows thua ở những thao tác đếm bằng số lần tạo file, không thua ở việc dùng CPU',
              'The build step was cached on Windows and therefore not comparable|||Bước dựng đã được cache trên Windows nên không so sánh được',
              'npm ci is single-threaded and the build is parallel, which explains every platform gap|||npm ci chạy một luồng còn bước dựng chạy song song, và đó giải thích mọi khoảng cách giữa các nền tảng',
              'The measurements are inconsistent, so the per-step numbers should be discarded in favour of the job totals|||Các phép đo không nhất quán, nên nên bỏ số liệu từng bước mà dùng số tổng của job',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In a private repository at GitHub&#39;s platform multipliers, macOS took 44% of the wall-clock in this run. What share of the bill?|||Ở một kho riêng tư với hệ số nền tảng của GitHub, macOS chiếm 44% thời gian đồng hồ trong lần chạy này. Nó chiếm bao nhiêu phần hoá đơn?',
            options: [
              '82% — the 10× multiplier means the slowest platform is also the most expensive per second, so the two effects multiply|||82% — hệ số 10× nghĩa là nền tảng chậm nhất cũng đắt nhất tính theo giây, nên hai hiệu ứng NHÂN với nhau',
              '44% — billing is proportional to time, so the two figures are always the same|||44% — tính tiền tỉ lệ với thời gian nên hai con số luôn bằng nhau',
              '10% — the multiplier is a discount for longer jobs|||10% — hệ số ấy là khoản giảm giá cho các job dài',
              '0% — GitHub does not bill for macOS runners on any repository|||0% — GitHub không tính tiền runner macOS ở bất kỳ kho nào',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A step runs `lenh-khong-ton-tai | tail -1` with no `shell:` key. The log shows "command not found". What does the step report?|||Một bước chạy `lenh-khong-ton-tai | tail -1` mà không có khoá `shell:`. Log hiện "command not found". Bước ấy báo cáo gì?',
            options: [
              'Success — the default is bash -e without pipefail, so the pipeline&#39;s exit code is tail&#39;s, which is 0|||Thành công — mặc định là bash -e KHÔNG có pipefail, nên mã thoát của đường ống là mã thoát của tail, tức 0',
              'Failure with exit 127 — set -e stops the script at the failing command|||Hỏng với mã thoát 127 — set -e dừng script tại lệnh hỏng',
              'Failure — any "command not found" line in the log fails the step|||Hỏng — bất kỳ dòng "command not found" nào trong log cũng làm bước hỏng',
              'The step is skipped, because the shell could not be resolved|||Bước bị bỏ qua, vì shell không phân giải được',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'With `set -e` on, in which of these does a failing command NOT stop the script?|||Với `set -e` đang bật, cú hỏng của một lệnh KHÔNG dừng script trong trường hợp nào?',
            options: [
              'Inside an if condition, on the left of &&, after !, and every command inside a function called from a condition|||Bên trong điều kiện if, bên trái &&, sau dấu !, và MỌI lệnh bên trong một hàm được gọi từ một điều kiện',
              'Only when the command is the last one in the script|||Chỉ khi lệnh ấy là lệnh cuối cùng của script',
              'Nowhere — set -e stops the script at any non-zero exit, without exception|||Không ở đâu cả — set -e dừng script ở bất kỳ mã thoát khác không nào, không ngoại lệ',
              'Only inside a subshell created with parentheses|||Chỉ bên trong một subshell tạo bằng dấu ngoặc đơn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A three-platform build matrix has one leg fail 60 seconds in. Why does this repository set `fail-fast: false`?|||Một ma trận dựng ba nền tảng có một nhánh hỏng ở giây thứ 60. Vì sao kho này đặt `fail-fast: false`?',
            options: [
              'The default cancels the other two, so the run ends with zero installers and the retry must redo all three — 564 more machine-seconds than redoing only the failed leg|||Mặc định sẽ huỷ hai nhánh kia, nên lần chạy kết thúc với KHÔNG bản cài nào và lần chạy lại phải dựng lại cả ba — nhiều hơn 564 máy-giây so với chỉ dựng lại nhánh hỏng',
              'Because fail-fast: true is deprecated and will be removed|||Vì fail-fast: true đã bị khai tử và sắp bị gỡ',
              'To make the matrix run sequentially instead of in parallel|||Để ma trận chạy tuần tự thay vì song song',
              'Because the default would make the failing leg retry itself automatically|||Vì mặc định sẽ khiến nhánh hỏng tự động thử lại chính nó',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
