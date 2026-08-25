const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 4: Action, `uses:`, và mã của người khác.
 * Số đo: 21 lượt dùng action trong kho này (21/21 ghim thẻ major, 0 ghim SHA),
 * và 11,3% thời gian bước chạy bên trong mã người khác viết.
 */

export default {
  title: 'Chapter 4 — Actions, and running other people’s code|||Chương 4 — Action, và chuyện chạy mã của người khác',
  slug: 'ga-ch4-action',
  description: '21 lượt dùng action, 21/21 ghim bằng thẻ major di động, 0 ghim bằng SHA. Và bằng chứng đo được rằng `@v4` KHÔNG phải hằng số: tệp không đổi suốt 18 ngày, runtime bên dưới sáu action thì đổi.',
  sortOrder: 5,
  lessons: [

    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — What an action is, and what it can do|||4.1 — Action là cái gì, và nó làm được gì',
      slug: 'ga-4-1-action-la-gi',
      type: 'VIDEO',
      description: 'Đo thật: 11,3% thời gian bước của kho này chạy bên trong mã do người khác viết, với `GITHUB_TOKEN` của bạn trong môi trường. Ba loại action, và loại nào chạy được cái gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>What an action is, and what it can do</h2>
<p class="lead">An action is a repository somebody published that contains code, and <code>uses:</code> means "download that repository and run its code on my runner, in my job, with my environment". Everything else about actions follows from reading that sentence carefully.</p>

<h3>How much of a run is other people&#39;s code</h3>
<p>Run 32662461744 again, splitting each build job&#39;s step time into steps that are <code>uses:</code> and steps that are <code>run:</code>:</p>

<div class="out">nen tang    trong ACTION  trong run: cua BAN  ty le action
------------------------------------------------------------
Linux                28s                208s         11.9%
macOS                44s                387s         10.2%
Windows              39s                278s         12.3%
------------------------------------------------------------
CONG                111s                873s         11.3%</div>

<div class="callout">
<p><strong>Eleven percent, from three actions doing unremarkable things</strong> — checking out the repository, installing Node, uploading a file. That is a reasonable proportion and the actions are worth their time. The number is here to be concrete about what is running: for 111 of every 984 seconds, the process on the runner is code this repository did not write, with the job&#39;s <code>GITHUB_TOKEN</code> and every secret passed to that step available to it.</p>
</div>

<h3>Three kinds, and the differences that matter</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">JavaScript action</span><span class="lz-lnote">an <code>action.yml</code> declaring <code>runs: {using: node20, main: dist/index.js}</code>. Runs on the runner&#39;s own Node, in the job&#39;s workspace, with full filesystem and network access. All eight actions this repository uses are this kind, and the runtime version is a property GitHub can change — measured in 4.2</span></div>
<div class="lz-layer"><span class="lz-lname">Docker action</span><span class="lz-lnote"><code>runs: {using: docker, image: ...}</code>. Runs in a container, so it can bring its own toolchain — but <strong>Linux runners only</strong>, and it pays image pull time on every job. Good for a tool with heavy dependencies; wrong for anything on a matrix that includes macOS or Windows</span></div>
<div class="lz-layer"><span class="lz-lname">composite action</span><span class="lz-lnote"><code>runs: {using: composite, steps: [...]}</code>. A named bundle of ordinary steps. No new capability at all — but it is the right tool for "these six steps appear in four workflows", and unlike the other two you can read the whole thing at a glance</span></div>
</div>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">runs on</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">JavaScript · all three platforms</span><span class="lz-nsub">Linux, macOS, Windows. The runner&#39;s own Node executes it — which is why the Node-20 deprecation in 4.2 touched every one of them at once</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Docker · Linux only</span><span class="lz-nsub">a matrix leg on macOS or Windows cannot use it, and the image pull is paid per job</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">composite · all three</span><span class="lz-nsub">it is just steps, so it runs wherever the steps do — but every <code>run:</code> inside must name its <code>shell:</code></span></div></div>
</div>
</div>

<h3>What an action can reach</h3>
<p>The honest answer is: everything the job can. There is no sandbox between a step and the rest of the job, and the boundary people imagine is not there:</p>

<div class="kv-grid">
<div class="kv"><span class="k">the whole workspace</span><span class="v">your checked-out source, and anything earlier steps wrote. It can read it, and it can modify it before your build step runs</span></div>
<div class="kv"><span class="k">the secrets passed to that step</span><span class="v">whatever is in <code>with:</code> or <code>env:</code> for that step, as environment variables. This is the part that is properly scoped — an action does not automatically see secrets you did not give it</span></div>
<div class="kv"><span class="k"><code>GITHUB_TOKEN</code></span><span class="v">present in the environment for the whole job unless you narrow it. With default write permissions, an action can push commits, create releases, and comment on issues in your repository</span></div>
<div class="kv"><span class="k">the network</span><span class="v">unrestricted outbound. There is no egress policy on a GitHub-hosted runner, so an action can send anything it read anywhere it likes</span></div>
<div class="kv"><span class="k">the next steps</span><span class="v">it can write to <code>\$GITHUB_ENV</code> and <code>\$GITHUB_PATH</code>, which change the environment and the executable lookup path for every <em>later</em> step in the job. An action can therefore replace a binary your build calls</span></div>
</div>

<div class="callout warn">
<p><strong>This is not a warning about malice — it is a description of the trust model.</strong> <code>uses:</code> is not "call a function", it is "run this program as me". The industry&#39;s repeated Actions supply-chain incidents have all had the same shape: a widely-used action was compromised at the source, and every workflow pinned to a moving tag picked up the new code on its next run without anybody doing anything. Nothing in the model prevents that; what prevents it is pinning, and 4.2 measures what this repository pins to.</p>
</div>

<h3>Inputs, outputs, and where <code>with:</code> goes</h3>
<pre><code>- uses: actions/setup-node@v4
  id: node
  with:
    node-version: '22'          <span class="tok-comment"># -&gt; INPUT_NODE-VERSION</span>
    cache: npm

- run: echo "\${{ steps.node.outputs.node-version }}"</code></pre>

<p>Each <code>with:</code> key becomes an environment variable named <code>INPUT_&lt;KEY&gt;</code>, uppercased. That is the entire mechanism — which is why passing a value through <code>with:</code> is safe from shell injection in a way that putting it in <code>run:</code> is not: the action receives it as data, and never as script text. Outputs come back the same way an ordinary step&#39;s do, through <code>\$GITHUB_OUTPUT</code>, and are read from the <code>steps</code> context with an <code>id:</code>.</p>

<div class="pitfall">
<p><strong>Trap — a misspelled <code>with:</code> key is silently ignored.</strong> There is no schema validation on inputs at workflow level: write <code>node_version</code> where the action expects <code>node-version</code> and you get no error, no warning, and the action&#39;s <em>default</em> version instead of yours. The symptom is a build that works and uses the wrong toolchain, which surfaces weeks later as an inexplicable difference between CI and a developer machine. Read the action&#39;s <code>action.yml</code> for the exact input names rather than the README, which is prose and can lag.</p>
</div>

<h3>The pre and post phases</h3>
<p>An action can declare a <code>post:</code> script that runs during job cleanup. Chapter 2 measured the order on a job with eight of them:</p>

<div class="out">dung : checkout(2) setup-node(3) cache-SWC(4) cache-backend(5)
       buildx(10) ghcr-login(11) anh-backend(14) anh-frontend(15)
don  : anh-frontend(43) anh-backend(44) ghcr-login(45) buildx(46)
       cache-backend(47) cache-SWC(48) setup-node(49) checkout(50)</div>

<p>Eight setups, eight teardowns, in exactly reverse order. This is where <code>actions/cache</code> actually saves the cache, where <code>docker/login-action</code> logs out, and where <code>actions/checkout</code> removes the credentials it wrote into <code>.git/config</code>. It is also a phase you did not write and cannot see in the YAML — so when a job&#39;s log shows twenty seconds of activity after your last step, this is what it is.</p>

<div class="callout ok">
<p><strong>The one sentence.</strong> An action is a program you run as yourself with your token in the environment, which is exactly as powerful and exactly as risky as that sounds — and the mitigations are the ordinary ones: pin what you run, narrow what it can see, and prefer a composite action you can read over a dependency you cannot.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Metadata syntax for GitHub Actions (action.yml)</span><span class="lc-sub">docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions — the authoritative reference for inputs, outputs, <code>runs.using</code>, and the <code>pre</code>/<code>post</code> hooks. Reading an action&#39;s <code>action.yml</code> answers most questions its README does not.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening: using third-party actions</span><span class="lc-sub">docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-third-party-actions — GitHub&#39;s own statement of the trust model described above, and the recommendation to pin to a full commit SHA.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating a composite action</span><span class="lc-sub">docs.github.com/en/actions/creating-actions/creating-a-composite-action — the third kind, including the restrictions (no <code>if:</code> on composite steps in older versions, and the <code>shell:</code> key being mandatory on every <code>run:</code>).</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — an image is somebody else&#39;s filesystem, and FROM is a trust decision</span><span class="lc-sub">/courses/docker/learn${REF} — the identical model one layer down, including why "official" is a weaker guarantee than a digest.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — what npm install actually executes</span><span class="lc-sub">/courses/nodejs/learn${REF} — install scripts, transitive dependencies, and lockfiles: the same supply-chain question in the ecosystem your build already depends on.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Action là cái gì, và nó làm được gì</h2>
<p class="lead">Một action là một kho ai đó đã công bố, trong có mã, và <code>uses:</code> nghĩa là "tải kho ấy về rồi chạy mã của nó trên runner của tôi, trong job của tôi, với môi trường của tôi". Mọi thứ khác về action đều chảy ra từ việc đọc câu ấy cho kỹ.</p>

<h3>Bao nhiêu phần một lần chạy là mã của người khác</h3>
<p>Lại run 32662461744, tách thời gian bước của mỗi job dựng thành bước <code>uses:</code> và bước <code>run:</code>:</p>

<div class="out">nen tang    trong ACTION  trong run: cua BAN  ty le action
------------------------------------------------------------
Linux                28s                208s         11.9%
macOS                44s                387s         10.2%
Windows              39s                278s         12.3%
------------------------------------------------------------
CONG                111s                873s         11.3%</div>

<div class="callout">
<p><strong>Mười một phần trăm, từ ba action làm những việc chẳng có gì đặc biệt</strong> — lấy mã kho về, cài Node, tải một tệp lên. Tỉ lệ ấy hợp lý và mấy action ấy xứng đáng với thời gian của chúng. Con số nằm đây để nói cho cụ thể cái gì đang chạy: cứ 984 giây thì có 111 giây tiến trình trên runner là mã mà kho này KHÔNG viết, với <code>GITHUB_TOKEN</code> của job và mọi bí mật truyền cho bước ấy nằm sẵn trong tầm với của nó.</p>
</div>

<h3>Ba loại, và những khác biệt có ý nghĩa</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">action JavaScript</span><span class="lz-lnote">một <code>action.yml</code> khai <code>runs: {using: node20, main: dist/index.js}</code>. Chạy trên Node của chính runner, trong thư mục làm việc của job, với toàn quyền hệ tệp và mạng. Cả tám action kho này dùng đều thuộc loại này, và phiên bản runtime là một thuộc tính GitHub đổi được — đo ở bài 4.2</span></div>
<div class="lz-layer"><span class="lz-lname">action Docker</span><span class="lz-lnote"><code>runs: {using: docker, image: ...}</code>. Chạy trong một container, nên nó mang được bộ công cụ riêng — nhưng <strong>CHỈ trên runner Linux</strong>, và nó trả giá bằng thời gian kéo ảnh ở mỗi job. Tốt cho một công cụ có phụ thuộc nặng; sai cho bất cứ thứ gì nằm trên một ma trận có macOS hay Windows</span></div>
<div class="lz-layer"><span class="lz-lname">action composite</span><span class="lz-lnote"><code>runs: {using: composite, steps: [...]}</code>. Một bó các bước thông thường được đặt tên. Hoàn toàn không thêm năng lực gì mới — nhưng nó là công cụ đúng cho "sáu bước này xuất hiện ở bốn workflow", và khác hai loại kia, bạn đọc trọn nó trong một cái liếc</span></div>
</div>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">chạy được ở đâu</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">JavaScript · cả ba nền tảng</span><span class="lz-nsub">Linux, macOS, Windows. Node của chính runner thực thi nó — và đó là lý do cú khai tử Node 20 ở bài 4.2 chạm vào TẤT CẢ chúng cùng lúc</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Docker · CHỈ Linux</span><span class="lz-nsub">một nhánh ma trận trên macOS hay Windows không dùng được nó, và tiền kéo ảnh trả theo TỪNG job</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">composite · cả ba</span><span class="lz-nsub">nó chỉ là các bước, nên nó chạy ở đâu các bước chạy được — nhưng mọi <code>run:</code> bên trong phải nêu <code>shell:</code> của nó</span></div></div>
</div>
</div>

<h3>Một action với tới được những gì</h3>
<p>Câu trả lời trung thực là: mọi thứ job với tới được. KHÔNG có hộp cát nào giữa một bước và phần còn lại của job, và cái ranh giới người ta tưởng tượng ra thì không tồn tại:</p>

<div class="kv-grid">
<div class="kv"><span class="k">toàn bộ thư mục làm việc</span><span class="v">mã nguồn bạn vừa lấy về, và mọi thứ các bước trước đã ghi ra. Nó đọc được, và nó SỬA ĐƯỢC trước khi bước dựng của bạn chạy</span></div>
<div class="kv"><span class="k">bí mật truyền cho bước ấy</span><span class="v">bất cứ thứ gì nằm trong <code>with:</code> hay <code>env:</code> của bước đó, dưới dạng biến môi trường. Đây là phần được khoanh vùng đúng đắn — một action KHÔNG tự động thấy những bí mật bạn không đưa cho nó</span></div>
<div class="kv"><span class="k"><code>GITHUB_TOKEN</code></span><span class="v">có mặt trong môi trường suốt cả job trừ khi bạn thu hẹp lại. Với quyền ghi mặc định, một action đẩy được commit, tạo được bản phát hành, và bình luận được vào issue trong kho bạn</span></div>
<div class="kv"><span class="k">mạng</span><span class="v">ra ngoài không hạn chế. Không có chính sách chặn lối ra nào trên một runner do GitHub cấp, nên một action gửi được bất cứ thứ gì nó đọc được tới bất cứ đâu nó muốn</span></div>
<div class="kv"><span class="k">các bước tiếp theo</span><span class="v">nó ghi được vào <code>\$GITHUB_ENV</code> và <code>\$GITHUB_PATH</code>, thứ đổi môi trường và đường tìm tệp thực thi cho MỌI bước <em>SAU</em> trong job. Nên một action THAY THẾ được một tệp nhị phân mà bản dựng của bạn gọi tới</span></div>
</div>

<div class="callout warn">
<p><strong>Đây không phải lời cảnh báo về ác ý — nó là mô tả MÔ HÌNH TIN CẬY.</strong> <code>uses:</code> không phải "gọi một hàm", nó là "chạy chương trình này với tư cách là tôi". Những sự cố chuỗi cung ứng Actions lặp đi lặp lại của ngành đều cùng một hình dạng: một action được dùng rộng rãi bị chiếm ở gốc, và mọi workflow ghim vào một cái thẻ DI ĐỘNG nhận mã mới ở lần chạy kế mà chẳng ai làm gì cả. Không có gì trong mô hình ngăn được chuyện đó; thứ ngăn được là GHIM, và bài 4.2 đo xem kho này ghim vào cái gì.</p>
</div>

<h3>Tham số vào, tham số ra, và <code>with:</code> đi đâu</h3>
<pre><code>- uses: actions/setup-node@v4
  id: node
  with:
    node-version: '22'          <span class="tok-comment"># -&gt; INPUT_NODE-VERSION</span>
    cache: npm

- run: echo "\${{ steps.node.outputs.node-version }}"</code></pre>

<p>Mỗi khoá <code>with:</code> trở thành một biến môi trường tên <code>INPUT_&lt;KHOÁ&gt;</code>, viết hoa lên. Đó là TOÀN BỘ cơ chế — và đó là lý do truyền một giá trị qua <code>with:</code> thì an toàn trước injection vào shell theo cái cách mà đặt nó vào <code>run:</code> thì không: action nhận nó dưới dạng DỮ LIỆU, không bao giờ dưới dạng chữ trong script. Tham số ra quay về theo đúng cách của một bước thường, qua <code>\$GITHUB_OUTPUT</code>, và được đọc từ context <code>steps</code> với một <code>id:</code>.</p>

<div class="pitfall">
<p><strong>Bẫy — một khoá <code>with:</code> gõ sai bị BỎ QUA im lặng.</strong> Không có phép kiểm lược đồ nào cho tham số ở mức workflow: viết <code>node_version</code> ở chỗ action mong <code>node-version</code> thì bạn không nhận được lỗi, không cảnh báo, và nhận về phiên bản <em>MẶC ĐỊNH</em> của action thay vì phiên bản của bạn. Triệu chứng là một bản dựng chạy được và dùng sai bộ công cụ, thứ lộ ra vài tuần sau dưới dạng một khác biệt không giải thích nổi giữa CI với máy của một người. Hãy đọc <code>action.yml</code> của action để lấy đúng tên tham số, chứ đừng đọc README — README là văn xuôi và nó tụt hậu được.</p>
</div>

<h3>Pha pre và pha post</h3>
<p>Một action khai được một script <code>post:</code> chạy trong lúc dọn dẹp job. Chương 2 đã đo thứ tự trên một job có tám cái:</p>

<div class="out">dung : checkout(2) setup-node(3) cache-SWC(4) cache-backend(5)
       buildx(10) ghcr-login(11) anh-backend(14) anh-frontend(15)
don  : anh-frontend(43) anh-backend(44) ghcr-login(45) buildx(46)
       cache-backend(47) cache-SWC(48) setup-node(49) checkout(50)</div>

<p>Tám cái dựng, tám cái tháo, ngược thứ tự chính xác. Đây là chỗ <code>actions/cache</code> THẬT SỰ lưu cache, chỗ <code>docker/login-action</code> đăng xuất, và chỗ <code>actions/checkout</code> gỡ đi phần thông tin đăng nhập nó đã ghi vào <code>.git/config</code>. Nó cũng là một pha bạn không viết ra và không nhìn thấy được trong YAML — nên khi log của một job hiện ra hai mươi giây hoạt động sau bước cuối cùng của bạn, thì đó chính là nó.</p>

<div class="callout ok">
<p><strong>Một câu.</strong> Một action là một chương trình bạn chạy VỚI TƯ CÁCH LÀ BẠN, với token của bạn trong môi trường, tức là mạnh đúng như nghe và cũng rủi ro đúng như nghe — và cách giảm nhẹ là những cách thông thường: GHIM thứ bạn chạy, THU HẸP thứ nó nhìn thấy, và ưu tiên một action composite bạn ĐỌC ĐƯỢC hơn một phụ thuộc bạn không đọc được.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Metadata syntax for GitHub Actions (action.yml)</span><span class="lc-sub">docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions — tài liệu tham chiếu chính thức cho tham số vào, tham số ra, <code>runs.using</code>, và các móc <code>pre</code>/<code>post</code>. Đọc <code>action.yml</code> của một action trả lời được phần lớn câu hỏi mà README của nó không trả lời.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening: using third-party actions</span><span class="lc-sub">docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-third-party-actions — chính GitHub phát biểu cái mô hình tin cậy mô tả bên trên, cùng khuyến nghị ghim bằng SHA commit đầy đủ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating a composite action</span><span class="lc-sub">docs.github.com/en/actions/creating-actions/creating-a-composite-action — loại thứ ba, kèm các hạn chế (không có <code>if:</code> trên bước composite ở phiên bản cũ, và khoá <code>shell:</code> là BẮT BUỘC trên mọi <code>run:</code>).</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — một ảnh là hệ tệp của người khác, và FROM là một quyết định TIN CẬY</span><span class="lc-sub">/courses/docker/learn${REF} — đúng mô hình ấy ở một tầng thấp hơn, gồm cả việc vì sao "chính thức" là một bảo đảm yếu hơn một digest.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — npm install THẬT SỰ chạy cái gì</span><span class="lc-sub">/courses/nodejs/learn${REF} — script cài đặt, phụ thuộc bắc cầu, và tệp khoá: cùng câu hỏi chuỗi cung ứng trong chính hệ sinh thái mà bản dựng của bạn đã phụ thuộc vào.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — @v4 is a pointer, not a version|||4.2 — @v4 là một CON TRỎ, không phải một phiên bản',
      slug: 'ga-4-2-ghim',
      type: 'VIDEO',
      description: 'Bằng chứng đo được: các dòng `uses:` viết 18/06/2026 và không đổi. Ngày 06/07, tệp y nguyên, log báo runtime bên dưới SÁU action đã đổi. 21/21 lượt dùng ở kho này ghim bằng thẻ major, 0 ghim bằng SHA.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2><code>@v4</code> is a pointer, not a version</h2>
<p class="lead">Everybody writes <code>actions/checkout@v4</code> and reads it as a version number. It is a git tag, tags are mutable, and the action authors move them deliberately. This lesson is the proof from this repository&#39;s own history that the thing under a pin changed while the pin did not.</p>

<h3>The inventory</h3>
<div class="out">actions/checkout@v4            7
actions/setup-node@v4          6
docker/build-push-action@v6    2
actions/cache@v4               2
docker/setup-buildx-action@v3  1
docker/login-action@v3         1
actions/upload-artifact@v4     1
actions/download-artifact@v4   1
                              21 luot dung, 8 action khac nhau

ghim bang the MAJOR (vN):     21 / 21
ghim bang the day du (vN.N.N): 0 / 21
ghim bang SHA 40 hex:          0 / 21</div>

<h3>The proof</h3>
<p>Ask git when the <code>uses:</code> lines in <code>deploy-ghcr.yml</code> were last touched, then read a run log from later:</p>

<div class="out">$ git log -S'actions/checkout@v4' -- .github/workflows/deploy-ghcr.yml
2026-06-18  c4d54ecf  feat(deploy): add GHCR registry deploy workflow (v2)
                                    ^ lan cuoi cung dong uses: doi

--- log run 28786703109, ngay 06/07/2026, TEP KHONG DOI ---
Node.js 20 is deprecated. The following actions target Node.js 20 but are
being forced to run on Node.js 24: actions/cache@v4, actions/checkout@v4,
actions/setup-node@v4, docker/build-push-action@v6, docker/login-action@v3,
docker/setup-buildx-action@v3</div>

<div class="callout warn">
<p><strong>Eighteen days, no commit, six actions running on a different Node runtime.</strong> The file says the same thing it said on 18 June. What it points at does not. That is the entire content of the distinction between pinning a <em>version</em> and pinning <em>content</em> — and it is why a workflow can go from green to red with a diff of zero lines.</p>
</div>

<h3>The three ways to pin, and what each buys</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>@v4</code> — major tag</span><span class="lz-lnote">a tag the maintainer <em>re-points</em> at every new v4.x release. You get bug fixes and security patches with no action from you, and you get behaviour changes the same way. This is what all 21 uses here do</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@v4.2.1</code> — full tag</span><span class="lz-lnote">normally immutable by convention — but it is still a tag, and a tag can be force-moved by anyone with write access to that repository. Better than a major tag; not a guarantee</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@a1b2c3…</code> — full commit SHA</span><span class="lz-lnote">the only form that cannot change. A SHA names content; there is no operation that makes it name different content. The cost is that you now own updating it, and an unattended pin ages into an unpatched dependency</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@main</code> — a branch</span><span class="lz-lnote">every run gets whatever was pushed most recently. There is no reason to do this for a third-party action, and it is worth grepping for once: it means a stranger&#39;s uncommitted-this-morning code runs in your job</span></div>
</div>

<div class="callout ok">
<p><strong>The honest trade, stated plainly.</strong> SHA pinning is the recommendation, and it is right for anything handling secrets or publishing artifacts. But a SHA pin with nobody updating it is a dependency frozen at a known-old version, which is its own risk — the Node 20 deprecation above is precisely the kind of thing a moving tag handled for this repository <em>for free</em>. The workable answer is SHA pins plus an updater bot (Dependabot understands Actions pins and will raise the SHA with the version in the comment). Pinning without an update mechanism swaps one risk for another rather than removing it.</p>
</div>

<h3>What this repository should conclude</h3>
<p>Twenty-one uses of eight actions, all from <code>actions/</code> and <code>docker/</code> — the two most-scrutinised namespaces there are — all on major tags. That is a defensible position and it is not the same as a considered one. The question worth asking is per-workflow rather than global:</p>

<div class="kv-grid">
<div class="kv"><span class="k">handles <code>VPS_SSH_PRIVATE_KEY</code></span><span class="v">this is the sharp end: nine uses of that secret across the deploy workflows. An action running in those jobs can read a key that opens a production server. These are the ones to SHA-pin first</span></div>
<div class="kv"><span class="k">publishes to GHCR or Releases</span><span class="v"><code>docker/login-action</code> and <code>docker/build-push-action</code> hold registry credentials and push artifacts users install. Same reasoning</span></div>
<div class="kv"><span class="k">runs on <code>pull_request</code> only</span><span class="v"><code>ci-lint.yml</code> — no secrets, read-only token, nothing published. A major tag here is a reasonable trade for free upkeep</span></div>
<div class="kv"><span class="k">the thing that makes it tractable</span><span class="v">there are eight distinct actions, not eighty. This is a twenty-minute change, and the inventory above is the whole worklist</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — pinning the action but not what the action downloads.</strong> A SHA-pinned <code>setup-node</code> still fetches a Node distribution over the network at run time; a SHA-pinned <code>checkout</code> still fetches your repository. Pinning the action fixes <em>the code that runs</em>, not <em>everything that code brings in</em>. This is not an argument against pinning — it is an argument against treating a pinned <code>uses:</code> as a completed security task. The install step immediately after it is usually the bigger surface, and that one is governed by your lockfile.</p>
</div>

<h3>The one thing to do today</h3>
<p>Regardless of the pinning decision, one grep is worth running on any repository:</p>

<pre><code><span class="tok-comment"># co action nao ghim vao mot NHANH khong?</span>
grep -rn "uses:.*@\\(main\\|master\\|develop\\)" .github/workflows/

<span class="tok-comment"># kiem ke: dung nhung gi, ghim kieu gi</span>
grep -ho "uses: *[^ ]*" .github/workflows/*.yml | sort | uniq -c | sort -rn</code></pre>

<div class="callout">
<p><strong>The second command produced the table at the top of this lesson.</strong> It takes a second to run and most people have never run it on their own repository — which means most people cannot say how many distinct third parties execute code in their CI. Eight, here. Knowing the number is the prerequisite for having an opinion about it.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> <code>@v4</code> is a pointer somebody else moves, and the measured consequence in this repository is six actions changing runtime under an unchanged file — so the choice is not "pin or not" but "who do you want deciding when your CI changes, and do you have a way to decide it on time".</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening: pin actions to a full length commit SHA</span><span class="lc-sub">docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-third-party-actions — the recommendation, and the explicit statement that tags and branches are mutable references.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Keeping your actions up to date with Dependabot</span><span class="lc-sub">docs.github.com/en/code-security/dependabot/working-with-dependabot/keeping-your-actions-up-to-date-with-dependabot — the update mechanism that makes SHA pinning sustainable, including how it writes the version as a trailing comment.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Changelog — deprecation of Node 20 on Actions runners</span><span class="lc-sub">github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/ — the announcement behind the warning measured above, and the <code>ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION</code> escape hatch it names.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — tag versus digest, and why :latest is not a version</span><span class="lc-sub">/courses/docker/learn${REF} — exactly this lesson in the container registry, including the case where re-pulling the same tag produced a different image and the build was green either way.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — tags are mutable, and what a SHA actually names</span><span class="lc-sub">/courses/git/learn${REF} — why a tag can be moved, what a force-push to a tag looks like from the outside, and why a commit hash is the only stable name git has.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2><code>@v4</code> là một CON TRỎ, không phải một phiên bản</h2>
<p class="lead">Ai cũng viết <code>actions/checkout@v4</code> và đọc nó thành một số hiệu phiên bản. Nó là một cái THẺ git, thẻ thì SỬA ĐƯỢC, và tác giả action dời chúng một cách có chủ ý. Bài này là bằng chứng lấy từ chính lịch sử kho này rằng thứ nằm dưới một cái ghim đã đổi trong khi cái ghim thì không.</p>

<h3>Kiểm kê</h3>
<div class="out">actions/checkout@v4            7
actions/setup-node@v4          6
docker/build-push-action@v6    2
actions/cache@v4               2
docker/setup-buildx-action@v3  1
docker/login-action@v3         1
actions/upload-artifact@v4     1
actions/download-artifact@v4   1
                              21 luot dung, 8 action khac nhau

ghim bang the MAJOR (vN):     21 / 21
ghim bang the day du (vN.N.N): 0 / 21
ghim bang SHA 40 hex:          0 / 21</div>

<h3>Bằng chứng</h3>
<p>Hỏi git xem các dòng <code>uses:</code> trong <code>deploy-ghcr.yml</code> đổi lần cuối khi nào, rồi đọc một log lần chạy MUỘN HƠN:</p>

<div class="out">$ git log -S'actions/checkout@v4' -- .github/workflows/deploy-ghcr.yml
2026-06-18  c4d54ecf  feat(deploy): add GHCR registry deploy workflow (v2)
                                    ^ lan cuoi cung dong uses: doi

--- log run 28786703109, ngay 06/07/2026, TEP KHONG DOI ---
Node.js 20 is deprecated. The following actions target Node.js 20 but are
being forced to run on Node.js 24: actions/cache@v4, actions/checkout@v4,
actions/setup-node@v4, docker/build-push-action@v6, docker/login-action@v3,
docker/setup-buildx-action@v3</div>

<div class="callout warn">
<p><strong>Mười tám ngày, không một commit, sáu action chạy trên một runtime Node khác.</strong> Tệp vẫn nói đúng điều nó đã nói hôm 18 tháng Sáu. Thứ nó TRỎ TỚI thì không. Đó là toàn bộ nội dung của chỗ phân biệt giữa ghim một <em>PHIÊN BẢN</em> và ghim <em>NỘI DUNG</em> — và đó là lý do một workflow đi từ xanh sang đỏ với một diff bằng không dòng.</p>
</div>

<h3>Ba cách ghim, và mỗi cách mua được gì</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>@v4</code> — thẻ major</span><span class="lz-lnote">một cái thẻ mà người bảo trì <em>TRỎ LẠI</em> ở mỗi bản v4.x mới. Bạn nhận vá lỗi và vá bảo mật mà không phải làm gì, và bạn nhận thay đổi hành vi theo đúng cách ấy. Đây là thứ cả 21 lượt dùng ở đây đang làm</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@v4.2.1</code> — thẻ đầy đủ</span><span class="lz-lnote">bình thường thì bất biến theo quy ước — nhưng nó VẪN là một cái thẻ, và một cái thẻ thì ai có quyền ghi vào kho ấy cũng dời cưỡng bức được. Tốt hơn thẻ major; không phải một bảo đảm</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@a1b2c3…</code> — SHA commit đầy đủ</span><span class="lz-lnote">dạng DUY NHẤT không đổi được. Một SHA gọi tên NỘI DUNG; không có thao tác nào khiến nó gọi tên một nội dung khác. Cái giá là giờ bạn sở hữu việc cập nhật nó, và một cái ghim không ai trông thì già đi thành một phụ thuộc chưa vá</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@main</code> — một nhánh</span><span class="lz-lnote">mỗi lần chạy nhận bất cứ thứ gì vừa được đẩy lên gần nhất. Không có lý do gì làm thế với một action của bên thứ ba, và đáng grep tìm một lần: nó nghĩa là mã người lạ vừa gõ sáng nay chạy trong job của bạn</span></div>
</div>

<div class="callout ok">
<p><strong>Sự đánh đổi thật, nói cho thẳng.</strong> Ghim bằng SHA là khuyến nghị, và nó đúng cho bất cứ thứ gì cầm bí mật hay công bố sản phẩm. Nhưng một cái ghim SHA mà không ai cập nhật là một phụ thuộc đông cứng ở một phiên bản đã cũ có tiếng, và đó là một rủi ro của riêng nó — cái deprecation Node 20 bên trên chính xác là kiểu chuyện mà một cái thẻ di động đã xử lý cho kho này <em>MIỄN PHÍ</em>. Đáp án làm được là ghim SHA CỘNG một bot cập nhật (Dependabot hiểu cách ghim của Actions và sẽ nâng SHA kèm số phiên bản trong bình luận). Ghim mà không có cơ chế cập nhật là đổi rủi ro này lấy rủi ro khác chứ không phải gỡ bỏ nó.</p>
</div>

<h3>Kho này nên kết luận gì</h3>
<p>Hai mươi mốt lượt dùng của tám action, tất cả từ <code>actions/</code> và <code>docker/</code> — hai không gian tên bị soi kỹ nhất trên đời — tất cả trên thẻ major. Đó là một vị thế bảo vệ được, mà nó không đồng nghĩa với một vị thế ĐÃ CÂN NHẮC. Câu hỏi đáng hỏi là theo từng workflow chứ không phải trên tổng thể:</p>

<div class="kv-grid">
<div class="kv"><span class="k">có cầm <code>VPS_SSH_PRIVATE_KEY</code></span><span class="v">đây là đầu nhọn: chín lượt dùng bí mật ấy rải khắp các workflow deploy. Một action chạy trong mấy job đó đọc được một cái khoá mở được máy chủ production. Đây là những cái nên ghim SHA TRƯỚC TIÊN</span></div>
<div class="kv"><span class="k">có đẩy lên GHCR hoặc Releases</span><span class="v"><code>docker/login-action</code> và <code>docker/build-push-action</code> giữ thông tin đăng nhập registry và đẩy lên những sản phẩm người dùng đem cài. Cùng lý lẽ</span></div>
<div class="kv"><span class="k">chỉ chạy trên <code>pull_request</code></span><span class="v"><code>ci-lint.yml</code> — không bí mật, token chỉ đọc, không công bố gì. Một cái thẻ major ở đây là một đánh đổi hợp lý lấy phần bảo trì miễn phí</span></div>
<div class="kv"><span class="k">thứ khiến việc này làm được</span><span class="v">có TÁM action khác nhau, không phải tám mươi. Đây là một thay đổi hai mươi phút, và cái bảng kiểm kê bên trên là trọn danh sách việc</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — ghim action nhưng không ghim thứ action TẢI VỀ.</strong> Một <code>setup-node</code> ghim SHA vẫn kéo một bản phân phối Node qua mạng lúc chạy; một <code>checkout</code> ghim SHA vẫn kéo kho của bạn về. Ghim action cố định <em>MÃ ĐANG CHẠY</em>, không cố định <em>MỌI THỨ MÃ ẤY MANG VÀO</em>. Đây không phải lập luận chống lại việc ghim — nó là lập luận chống lại việc coi một <code>uses:</code> đã ghim là một nhiệm vụ bảo mật đã xong. Cái bước cài đặt ngay sau đó thường là bề mặt lớn hơn, và cái đó thì do tệp khoá của bạn cai quản.</p>
</div>

<h3>Một việc nên làm ngay hôm nay</h3>
<p>Bất kể quyết định về ghim thế nào, có một lệnh grep đáng chạy trên bất kỳ kho nào:</p>

<pre><code><span class="tok-comment"># co action nao ghim vao mot NHANH khong?</span>
grep -rn "uses:.*@\\(main\\|master\\|develop\\)" .github/workflows/

<span class="tok-comment"># kiem ke: dung nhung gi, ghim kieu gi</span>
grep -ho "uses: *[^ ]*" .github/workflows/*.yml | sort | uniq -c | sort -rn</code></pre>

<div class="callout">
<p><strong>Lệnh thứ hai đẻ ra cái bảng ở đầu bài này.</strong> Nó chạy hết một giây và phần lớn người ta chưa bao giờ chạy nó trên kho của chính mình — nghĩa là phần lớn người ta không nói được có bao nhiêu bên thứ ba khác nhau đang chạy mã trong CI của họ. Ở đây là tám. Biết con số ấy là điều kiện tiên quyết để có một quan điểm về nó.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> <code>@v4</code> là một con trỏ mà người khác dời, và hệ quả đo được ở kho này là sáu action đổi runtime dưới một cái tệp không đổi — nên lựa chọn không phải "ghim hay không ghim" mà là "bạn muốn AI quyết định lúc nào CI của bạn thay đổi, và bạn có cách để tự quyết đúng lúc hay không".</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening: ghim action bằng SHA commit đầy đủ</span><span class="lc-sub">docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-third-party-actions — khuyến nghị, và phát biểu tường minh rằng thẻ và nhánh là những tham chiếu SỬA ĐƯỢC.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Keeping your actions up to date with Dependabot</span><span class="lc-sub">docs.github.com/en/code-security/dependabot/working-with-dependabot/keeping-your-actions-up-to-date-with-dependabot — cơ chế cập nhật khiến việc ghim SHA duy trì được, gồm cả cách nó ghi số phiên bản thành một bình luận cuối dòng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Changelog — khai tử Node 20 trên runner của Actions</span><span class="lc-sub">github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/ — thông báo đứng sau cái cảnh báo đã đo bên trên, và lối thoát <code>ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION</code> mà nó nêu tên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — thẻ với digest, và vì sao :latest không phải một phiên bản</span><span class="lc-sub">/courses/docker/learn${REF} — đúng bài học này trong registry container, gồm cả ca mà kéo lại cùng một cái thẻ ra một cái ảnh khác và bản dựng thì xanh trong cả hai lần.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — thẻ SỬA ĐƯỢC, và một SHA thật ra gọi tên cái gì</span><span class="lc-sub">/courses/git/learn${REF} — vì sao một cái thẻ dời được, một cú đẩy cưỡng bức lên thẻ nhìn từ ngoài ra sao, và vì sao một mã băm commit là cái tên ỔN ĐỊNH duy nhất mà git có.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — checkout, and the shallow clone that saves almost nothing|||4.3 — checkout, và cú clone nông gần như không tiết kiệm gì',
      slug: 'ga-4-3-checkout',
      type: 'VIDEO',
      description: 'Đo ba lượt mỗi cách trên chính kho này: `fetch-depth: 0` chỉ tốn thêm 1,9 giây và 40MB so với mặc định. Và `--filter=blob:none` cho TRỌN 2.515 commit với +1 giây, +4MB. Cộng chuyện checkout GHI khoá xác thực vào .git/config.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2><code>checkout</code>, and the shallow clone that saves almost nothing</h2>
<p class="lead">Seven of this repository&#39;s twenty-one action uses are <code>actions/checkout</code>, which makes it the one worth knowing properly. Two of its behaviours are load-bearing and neither is obvious from the two lines you write.</p>

<h3><code>fetch-depth</code>, measured on this repository</h3>
<p>The default is <code>fetch-depth: 1</code> — one commit, no history. Received wisdom says this is a large saving. Three runs of each approach:</p>

<div class="out">cach                            3 luot (ms)          TB    .git   ca cay  commit
--------------------------------------------------------------------------------
--depth 1  (MAC DINH)      9221 · 7913 · 9158       8,8s   131M    440M       1
day du (fetch-depth: 0)   11540 · 10381 · 10152    10,7s   171M    480M    2515
--filter=blob:none         9520 · 9866 · 9909       9,8s   135M    444M    2515</div>

<div class="callout warn">
<p><strong>The entire 2,515-commit history costs 1.9 seconds and 40 MB.</strong> On this repository the default is optimising something that was not expensive. And the reason is visible in the numbers: the shallow clone&#39;s pack is already 130 MiB for <em>one</em> commit, because the working tree is 440 MB of content — <code>frontend</code> 117 M, <code>playground-3d</code> 89 M, <code>content</code> 37 M. Content dominates; history is cheap.</p>
</div>

<p>The third row is the useful one. <code>--filter=blob:none</code> is a partial clone: it takes the full commit graph and fetches file contents on demand. Full history, <strong>+1.0 second and +4 MB</strong> over the shallow default — which makes it strictly better than <code>fetch-depth: 0</code> for the case that needs history, such as the changed-files step from lesson 3.5.</p>

<div class="callout">
<p><strong>Honest caveat on these numbers.</strong> The size figures are deterministic and would be the same anywhere. The times were measured through this sandbox&#39;s network proxy, not on a GitHub runner, so treat the absolute seconds as indicative and the <em>ratios</em> as the finding. For scale: the real checkout step on the Linux runner in run 32662461744 took <strong>7 seconds</strong>, while the build step in the same job took 149. All three options here are inside the noise of that job.</p>
</div>

<div class="pitfall">
<p><strong>Trap — "shallow clone is faster" as a general rule.</strong> It is true for a repository with deep history and small files, and this course has now measured a repository where it is not. Before adding <code>fetch-depth: 0</code> and worrying about the cost, or leaving it at 1 and writing around the missing history, measure the two clones. It is one command each and the answer is repository-specific.</p>
</div>

<h3>What else the default costs you</h3>
<div class="kv-grid">
<div class="kv"><span class="k">no merge base</span><span class="v">any <code>git diff origin/main...HEAD</code> fails with <code>unknown revision</code>. This is the pitfall from 3.5 and it is the most common reason people reach for <code>fetch-depth: 0</code></span></div>
<div class="kv"><span class="k">no tags</span><span class="v"><code>git describe</code> has nothing to describe against. A version-from-tag step needs <code>fetch-depth: 0</code> or an explicit <code>fetch-tags: true</code></span></div>
<div class="kv"><span class="k">no other branches</span><span class="v">the default is single-branch. A step that compares against another branch has to fetch it first</span></div>
<div class="kv"><span class="k">submodules are skipped</span><span class="v"><code>submodules: true</code>, or <code>recursive</code>. Silently empty directories otherwise — no error</span></div>
</div>

<h3>The credential it writes into your repository</h3>
<p>To fetch a private repository, <code>checkout</code> has to authenticate — and the way it does that is visible in the cleanup phase of any real run:</p>

<div class="out">[command]/usr/bin/git config --local --name-only --get-regexp
         http\\.https\\:\\/\\/github\\.com\\/\\.extraheader
http.https://github.com/.extraheader
[command]/usr/bin/git config --local --unset-all
         http.https://github.com/.extraheader</div>

<div class="callout warn">
<p><strong>For the whole duration of the job, <code>.git/config</code> in your workspace contains an authentication header.</strong> The post-step removes it — that is what those lines are — but every step between checkout and cleanup can read it, and so can anything those steps invoke: a build script, a test, a postinstall hook, another action. This is the concrete version of 4.1&#39;s point that there is no boundary between a step and the rest of the job.</p>
</div>

<p>Two mitigations exist and both are one line. <code>persist-credentials: false</code> stops <code>checkout</code> writing the header at all — correct whenever no later step needs to talk to git. And narrowing <code>permissions:</code> shrinks what the token could do if it were read, which Chapter 7 measures.</p>

<h3>Checkout on a pull request, revisited</h3>
<p>Lesson 1.4 established that <code>pull_request</code> runs against a merge commit. <code>checkout</code> is where that becomes concrete:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">default</span><span class="lz-t">the merge commit</span><span class="lz-d">no <code>ref:</code> — takes <code>github.sha</code>, which on a PR is <code>refs/pull/&lt;N&gt;/merge</code>. This is what you want for testing</span></div>
<div class="lz-step"><span class="lz-k"><code>ref: head.sha</code></span><span class="lz-t">your branch tip</span><span class="lz-d">safe under <code>pull_request</code>; the vulnerability from 1.4 when combined with <code>pull_request_target</code></span></div>
<div class="lz-step"><span class="lz-k">detached HEAD either way</span><span class="lz-t">no branch checked out</span><span class="lz-d">a step doing <code>git push</code> needs an explicit branch — <code>git symbolic-ref</code> or <code>ref: \${{ github.head_ref }}</code></span></div>
</div>

<h3>The settings worth knowing exist</h3>
<pre><code>- uses: actions/checkout@v4
  with:
    fetch-depth: 0              <span class="tok-comment"># toan bo lich su (do o tren: +1,9s, +40MB)</span>
    persist-credentials: false  <span class="tok-comment"># dung ghi header xac thuc vao .git/config</span>
    submodules: recursive       <span class="tok-comment"># mac dinh la KHONG lay submodule</span>
    path: kho-phu               <span class="tok-comment"># lay ve mot thu muc con — cho phep checkout NHIEU kho</span>
    sparse-checkout: |          <span class="tok-comment"># chi lay mot phan cay — dang ke voi cay 440MB</span>
      src
      package.json</code></pre>

<div class="callout ok">
<p><strong><code>sparse-checkout</code> is the one under-used option here.</strong> Given that this repository&#39;s working tree is 440 MB and its backend job only type-checks <code>src/</code>, a job that fetched <code>src</code> and the two config files would move a small fraction of that. Unlike <code>fetch-depth</code>, it targets the part the measurement showed is actually large.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> <code>checkout</code> makes two decisions for you — how much history to fetch, and whether to leave a credential in your workspace — and on this repository the measured cost of the first is under two seconds, which means the default was chosen for a repository shaped differently from yours.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/checkout — README and action.yml</span><span class="lc-sub">github.com/actions/checkout — every input with its default, including <code>persist-credentials</code>, <code>sparse-checkout</code>, and the note that the default ref is the SHA that triggered the workflow.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-clone(1) — --depth, --filter, and partial clone</span><span class="lc-sub">git-scm.com/docs/git-clone — what <code>--filter=blob:none</code> actually does, and the promisor-remote mechanism that fetches blobs on demand afterwards.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Git — sparse-checkout</span><span class="lc-sub">git-scm.com/docs/git-sparse-checkout — cone mode and pattern mode, for the case the measurement above points at: a large working tree where the job only needs part of it.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — shallow clones, and what a repository actually stores</span><span class="lc-sub">/courses/git/learn${REF} — objects, packs, and why a single commit of a large tree is not small, which is the whole explanation for the measurement above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — a token in a config file is a token on disk</span><span class="lc-sub">/courses/authentication/learn${REF} — credential storage, blast radius, and why "it is removed afterwards" is a different claim from "it was never readable".</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2><code>checkout</code>, và cú clone nông gần như không tiết kiệm gì</h2>
<p class="lead">Bảy trong hai mươi mốt lượt dùng action của kho này là <code>actions/checkout</code>, điều đó khiến nó là cái đáng hiểu cho tử tế. Hai hành vi của nó chịu lực, và không cái nào hiển nhiên từ hai dòng bạn viết ra.</p>

<h3><code>fetch-depth</code>, đo trên chính kho này</h3>
<p>Mặc định là <code>fetch-depth: 1</code> — một commit, không lịch sử. Lời truyền miệng bảo đây là một khoản tiết kiệm lớn. Ba lượt cho mỗi cách:</p>

<div class="out">cach                            3 luot (ms)          TB    .git   ca cay  commit
--------------------------------------------------------------------------------
--depth 1  (MAC DINH)      9221 · 7913 · 9158       8,8s   131M    440M       1
day du (fetch-depth: 0)   11540 · 10381 · 10152    10,7s   171M    480M    2515
--filter=blob:none         9520 · 9866 · 9909       9,8s   135M    444M    2515</div>

<div class="callout warn">
<p><strong>Trọn 2.515 commit lịch sử tốn 1,9 giây và 40 MB.</strong> Ở kho này cái mặc định đang tối ưu một thứ vốn không đắt. Và lý do hiện ra ngay trong mấy con số: pack của bản clone nông đã là 130 MiB cho <em>MỘT</em> commit, bởi cây làm việc là 440 MB nội dung — <code>frontend</code> 117 M, <code>playground-3d</code> 89 M, <code>content</code> 37 M. NỘI DUNG áp đảo; LỊCH SỬ thì rẻ.</p>
</div>

<p>Hàng thứ ba mới là hàng hữu ích. <code>--filter=blob:none</code> là một bản clone TỪNG PHẦN: nó lấy trọn đồ thị commit và tải nội dung tệp về khi cần. Trọn lịch sử, <strong>+1,0 giây và +4 MB</strong> so với mặc định nông — khiến nó tốt hơn hẳn <code>fetch-depth: 0</code> cho ca cần lịch sử, chẳng hạn bước đếm-file-đã-đổi ở bài 3.5.</p>

<div class="callout">
<p><strong>Nói thẳng giới hạn của mấy con số này.</strong> Các số đo DUNG LƯỢNG là tất định và sẽ giống nhau ở bất cứ đâu. Các số đo THỜI GIAN được đo qua proxy mạng của hộp cát này, không phải trên một runner của GitHub, nên hãy coi số giây tuyệt đối là để tham khảo còn <em>TỈ LỆ</em> mới là phát hiện. Để có cỡ: bước checkout thật trên runner Linux trong run 32662461744 mất <strong>7 giây</strong>, còn bước dựng trong cùng job ấy mất 149. Cả ba lựa chọn ở đây đều nằm trong tiếng ồn của job đó.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi "clone nông thì nhanh hơn" là một quy tắc chung.</strong> Nó đúng với một kho có lịch sử sâu và tệp nhỏ, và khoá học này vừa đo một kho mà nó không đúng. Trước khi thêm <code>fetch-depth: 0</code> rồi lo về cái giá, hoặc để nguyên là 1 rồi viết vòng qua chỗ thiếu lịch sử, hãy ĐO hai bản clone. Mỗi cái một câu lệnh và đáp án thì tuỳ từng kho.</p>
</div>

<h3>Cái mặc định còn khiến bạn mất gì nữa</h3>
<div class="kv-grid">
<div class="kv"><span class="k">không có merge base</span><span class="v">mọi câu <code>git diff origin/main...HEAD</code> đều hỏng với <code>unknown revision</code>. Đây là cái bẫy ở bài 3.5 và là lý do phổ biến nhất người ta với tay tới <code>fetch-depth: 0</code></span></div>
<div class="kv"><span class="k">không có tag</span><span class="v"><code>git describe</code> chẳng có gì để mô tả dựa vào. Một bước lấy-phiên-bản-từ-tag cần <code>fetch-depth: 0</code> hoặc một <code>fetch-tags: true</code> tường minh</span></div>
<div class="kv"><span class="k">không có nhánh nào khác</span><span class="v">mặc định là một nhánh. Một bước đối chiếu với nhánh khác phải fetch nhánh ấy trước</span></div>
<div class="kv"><span class="k">submodule bị bỏ qua</span><span class="v"><code>submodules: true</code>, hoặc <code>recursive</code>. Không thì thư mục rỗng một cách âm thầm — không có lỗi nào</span></div>
</div>

<h3>Cái khoá nó GHI vào kho của bạn</h3>
<p>Để lấy được một kho riêng tư, <code>checkout</code> phải xác thực — và cách nó làm chuyện đó hiện ra ngay trong pha dọn dẹp của bất kỳ lần chạy thật nào:</p>

<div class="out">[command]/usr/bin/git config --local --name-only --get-regexp
         http\\.https\\:\\/\\/github\\.com\\/\\.extraheader
http.https://github.com/.extraheader
[command]/usr/bin/git config --local --unset-all
         http.https://github.com/.extraheader</div>

<div class="callout warn">
<p><strong>Suốt cả thời gian job chạy, <code>.git/config</code> trong thư mục làm việc của bạn CHỨA một header xác thực.</strong> Post-step gỡ nó đi — mấy dòng trên chính là chuyện đó — nhưng mọi bước nằm giữa checkout và lúc dọn đều đọc được nó, và mọi thứ mà những bước ấy gọi tới cũng vậy: một script dựng, một bài test, một móc postinstall, một action khác. Đây là phiên bản cụ thể của luận điểm ở bài 4.1 rằng KHÔNG có ranh giới nào giữa một bước và phần còn lại của job.</p>
</div>

<p>Có hai cách giảm nhẹ và cả hai đều một dòng. <code>persist-credentials: false</code> khiến <code>checkout</code> không ghi cái header ấy chút nào — đúng đắn mỗi khi không có bước sau nào cần nói chuyện với git. Và thu hẹp <code>permissions:</code> làm nhỏ lại thứ mà token làm được nếu nó bị đọc, chuyện mà Chương 7 sẽ đo.</p>

<h3>Checkout trên một pull request, xem lại</h3>
<p>Bài 1.4 xác lập rằng <code>pull_request</code> chạy trên một merge commit. <code>checkout</code> là chỗ điều đó thành cụ thể:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">mặc định</span><span class="lz-t">merge commit</span><span class="lz-d">không có <code>ref:</code> — lấy <code>github.sha</code>, mà trên một PR nó là <code>refs/pull/&lt;N&gt;/merge</code>. Đây là thứ bạn MUỐN để kiểm thử</span></div>
<div class="lz-step"><span class="lz-k"><code>ref: head.sha</code></span><span class="lz-t">đầu nhánh của bạn</span><span class="lz-d">an toàn dưới <code>pull_request</code>; là lỗ hổng ở bài 1.4 khi ghép với <code>pull_request_target</code></span></div>
<div class="lz-step"><span class="lz-k">HEAD rời trong cả hai</span><span class="lz-t">không nhánh nào được checkout</span><span class="lz-d">một bước làm <code>git push</code> cần một nhánh tường minh — <code>git symbolic-ref</code> hoặc <code>ref: \${{ github.head_ref }}</code></span></div>
</div>

<h3>Những tuỳ chọn đáng biết là nó có</h3>
<pre><code>- uses: actions/checkout@v4
  with:
    fetch-depth: 0              <span class="tok-comment"># toan bo lich su (do o tren: +1,9s, +40MB)</span>
    persist-credentials: false  <span class="tok-comment"># dung ghi header xac thuc vao .git/config</span>
    submodules: recursive       <span class="tok-comment"># mac dinh la KHONG lay submodule</span>
    path: kho-phu               <span class="tok-comment"># lay ve mot thu muc con — cho phep checkout NHIEU kho</span>
    sparse-checkout: |          <span class="tok-comment"># chi lay mot phan cay — dang ke voi cay 440MB</span>
      src
      package.json</code></pre>

<div class="callout ok">
<p><strong><code>sparse-checkout</code> là tuỳ chọn bị dùng thiếu ở đây.</strong> Cây làm việc của kho này là 440 MB mà job backend chỉ đi kiểm kiểu <code>src/</code>, nên một job chỉ lấy <code>src</code> cùng hai tệp cấu hình sẽ chuyển một phần nhỏ của con số ấy. Khác <code>fetch-depth</code>, nó nhắm vào đúng cái phần mà phép đo cho thấy là thật sự lớn.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>checkout</code> quyết hộ bạn hai chuyện — lấy về bao nhiêu lịch sử, và có để lại một cái khoá trong thư mục làm việc của bạn hay không — và ở kho này cái giá đo được của chuyện thứ nhất là dưới hai giây, nghĩa là cái mặc định ấy được chọn cho một kho có hình dạng khác kho của bạn.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/checkout — README và action.yml</span><span class="lc-sub">github.com/actions/checkout — mọi tham số kèm giá trị mặc định, gồm <code>persist-credentials</code>, <code>sparse-checkout</code>, và ghi chú rằng ref mặc định là cái sha đã kích hoạt workflow.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-clone(1) — --depth, --filter, và partial clone</span><span class="lc-sub">git-scm.com/docs/git-clone — <code>--filter=blob:none</code> thật ra làm gì, và cơ chế promisor-remote tải blob về theo yêu cầu về sau.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Git — sparse-checkout</span><span class="lc-sub">git-scm.com/docs/git-sparse-checkout — chế độ cone và chế độ mẫu, cho đúng cái ca mà phép đo bên trên chỉ vào: một cây làm việc lớn mà job chỉ cần một phần.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — clone nông, và một kho thật ra LƯU cái gì</span><span class="lc-sub">/courses/git/learn${REF} — object, pack, và vì sao một commit đơn lẻ của một cây lớn thì không hề nhỏ, đó là toàn bộ lời giải thích cho phép đo bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — một token trong tệp cấu hình là một token NẰM TRÊN ĐĨA</span><span class="lc-sub">/courses/authentication/learn${REF} — cách lưu thông tin đăng nhập, bán kính thiệt hại, và vì sao "nó bị gỡ đi sau đó" là một lời khẳng định KHÁC với "nó chưa bao giờ đọc được".</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — setup-* actions, and a key I could not reproduce|||4.4 — Các action setup-*, và một cái khoá tôi KHÔNG tái lập được',
      slug: 'ga-4-4-setup',
      type: 'VIDEO',
      description: 'Bài 3.4 đoán được khoá `actions/cache` tới từng ký tự. Thử y hệt với khoá dựng sẵn của `setup-node`: TÁM ứng viên, KHÔNG cái nào khớp. Kết quả rỗng, ghi lại đúng là rỗng — và nó dẫn tới một kết luận dùng được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2><code>setup-*</code> actions, and a key I could not reproduce</h2>
<p class="lead">Six of this repository&#39;s twenty-one action uses are <code>actions/setup-node</code>. It does two separate jobs — install a toolchain version, and cache the dependency download — and the second one turned out to be the more interesting to investigate, because the investigation failed.</p>

<h3>What the setup costs</h3>
<p>From run 32662461744, the <code>setup-node</code> step on each platform:</p>

<div class="out">Linux    13s
macOS    11s
Windows  22s</div>

<p>That buys a specific Node version instead of whatever the runner image happens to ship — which is the point of lesson 2.1&#39;s argument about declaring rather than inheriting. Eleven to twenty-two seconds is the price of your workflow owning its toolchain version rather than GitHub&#39;s image rollout schedule owning it.</p>

<div class="kv-grid">
<div class="kv"><span class="k">already in the tool cache</span><span class="v">runner images preinstall several Node versions. Asking for one of those is a path change, and it is the fast case</span></div>
<div class="kv"><span class="k">not in the tool cache</span><span class="v">it downloads and unpacks — tens of seconds, and it varies. Pinning an exact patch version is more likely to miss the preinstalled set than pinning a major</span></div>
<div class="kv"><span class="k"><code>node-version-file:</code></span><span class="v">reads <code>.nvmrc</code> or <code>package.json</code>&#39;s <code>engines</code>. Better than a literal, because it stops the workflow and the project disagreeing about the version silently</span></div>
<div class="kv"><span class="k">the same shape everywhere</span><span class="v"><code>setup-python</code>, <code>setup-go</code>, <code>setup-java</code>, <code>setup-dotnet</code> all work identically — version input, tool cache, and an optional dependency cache</span></div>
</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">ask for a version</span><span class="lz-t"><code>node-version: &#39;22&#39;</code></span><span class="lz-d">the action looks in the runner&#39;s tool cache first</span></div>
<div class="lz-step"><span class="lz-k">already there</span><span class="lz-t">a PATH change</span><span class="lz-d">the fast case: preinstalled majors cost near nothing</span></div>
<div class="lz-step"><span class="lz-k">not there</span><span class="lz-t">download and unpack</span><span class="lz-d">an exact patch pin is likelier to land here — 11 to 22 seconds, measured</span></div>
</div>

<h3>The investigation, and why it failed</h3>
<p>Lesson 3.4 reproduced <code>hashFiles()</code> and verified it against a real cache key, exactly. So the same method should work on <code>setup-node</code>&#39;s built-in cache. The workflow at that commit declares exactly what to hash:</p>

<pre><code>- uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm'
    cache-dependency-path: |
      package-lock.json
      frontend/package-lock.json</code></pre>

<p>And the log from that run prints the key it computed:</p>

<div class="out">Cache hit occurred on the primary key
  node-cache-Linux-x64-npm-699ec67c02f94027efff6b4cd1c7f842cbaa689063c4d900c963e39ac11c4c6a</div>

<p>Eight candidate calculations, all at the exact commit the run used:</p>

<div class="out">cach tinh                          ket qua
------------------------------------------------------------
hashFiles(chi goc)                 a505030c00af033c...
hashFiles(goc + frontend)          dc25e40311e9cacb...
hashFiles(chi frontend)            e3a98579f5ab829e...
hashFiles(tat ca **/)              dc25e40311e9cacb...
noi HEX thay vi nhi phan           7e9417715d1fe848...
noi NOI DUNG roi bam mot lan       6f426dc0c0a29a69...
thu tu nguoc                       dc25e40311e9cacb...
chi frontend, noi hex              1228ac54b1780ee7...

muc tieu (tu log that)             699ec67c02f94027...</div>

<div class="callout warn">
<p><strong>None of them matched. That is the result, and it is being reported as the result.</strong> The <code>hashFiles()</code> reproduction is known-correct — 3.4 verified it to all sixty-four characters against an <code>actions/cache</code> key from this same run. So the difference is not in my hashing; <code>setup-node</code> computes its key some other way, and eight reasonable guesses did not find it.</p>
</div>

<h3>What the failure is worth</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a key you wrote</span><span class="lz-t">predictable</span><span class="lz-d"><code>nextjs-cache-\${{ runner.os }}-frontend-lock-\${{ hashFiles(...) }}</code> — computed offline in 3.4, matched exactly. You can answer "will this invalidate?" from the file</span></div>
<div class="lz-step"><span class="lz-k">the built-in key</span><span class="lz-t">opaque</span><span class="lz-d">visible in the log after the fact, not derivable from the workflow. Eight attempts, no match</span></div>
</div>

<div class="callout ok">
<p><strong>That is a real, usable conclusion.</strong> <code>cache: 'npm'</code> is one line and works, and for most workflows that is the right trade. But when you need to <em>reason</em> about invalidation — "why did this cache not refresh after I changed the lockfile", "why are two jobs colliding on one entry" — a key you wrote is debuggable from the file and this one is not. Reach for an explicit <code>actions/cache</code> when the caching behaviour itself becomes the question.</p>
</div>

<div class="pitfall">
<p><strong>Trap — the two caches do different things, and people expect the wrong one.</strong> <code>setup-node</code>&#39;s <code>cache:</code> caches the <strong>package manager&#39;s download directory</strong> — <code>~/.npm</code> — not <code>node_modules</code>. So <code>npm ci</code> still runs, still deletes and rebuilds <code>node_modules</code>, and still takes real time; what it skips is the network fetch. Measured on the desktop job in 2.3, <code>npm ci</code> ran in 38 to 107 seconds <em>with</em> that cache active. If you expected "cached dependencies" to mean "no install step", this is where that expectation breaks.</p>
</div>

<h3>A dead cache, found in the same log</h3>
<p>The run being examined also printed this, from a different cache step:</p>

<div class="out">[warning]Path Validation Error: Path(s) specified in the action for caching
         do(es) not exist, hence no cache is being saved.</div>

<p>That is <code>deploy-ghcr.yml</code>&#39;s backend cache, which caches <code>node_modules/.cache</code> — a path this project does not create. The step has never saved anything and never will. It costs almost no time and does nothing, which is exactly why it survived: a cache that silently does nothing looks identical to a cache that is working.</p>

<div class="callout">
<p><strong>The check is one line in the log.</strong> Every <code>actions/cache</code> step prints either a hit, a miss with the key, or that warning. Reading those three lines after adding a cache is the difference between having a cache and believing you have one — and Chapter 5 measures what the working ones are actually worth.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> <code>setup-*</code> actions buy you a declared toolchain for ten to twenty seconds, and their built-in caching buys convenience at the price of a key you cannot compute — which is fine until the day the cache is the thing you need to debug.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node — README</span><span class="lc-sub">github.com/actions/setup-node — <code>node-version-file</code>, the <code>cache</code> and <code>cache-dependency-path</code> inputs, and the statement of which directory is cached (the package manager&#39;s, not <code>node_modules</code>).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node — src/cache-restore.ts</span><span class="lc-sub">github.com/actions/setup-node — the source that computes the key measured against above. When a documented description leaves the exact algorithm open, this is where the answer is, and reading it is the next step after eight failed guesses.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/cache — README, cache hits and misses</span><span class="lc-sub">github.com/actions/cache — the three log lines to look for after adding a cache, including the path-validation warning that identified the dead cache above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — npm ci versus npm install, and what ~/.npm holds</span><span class="lc-sub">/courses/nodejs/learn${REF} — why <code>npm ci</code> still costs time with a warm download cache, which is the mechanism behind the pitfall above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Redis — a cache that silently never hits</span><span class="lc-sub">/courses/redis/learn${REF} — the same failure shape in a different system: a key that never matches produces correct behaviour and no error, and only a hit-rate measurement finds it.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Các action <code>setup-*</code>, và một cái khoá tôi KHÔNG tái lập được</h2>
<p class="lead">Sáu trong hai mươi mốt lượt dùng action của kho này là <code>actions/setup-node</code>. Nó làm hai việc tách biệt — cài một phiên bản bộ công cụ, và cache phần tải phụ thuộc — và việc thứ hai hoá ra là việc thú vị hơn để đi điều tra, bởi cuộc điều tra ấy THẤT BẠI.</p>

<h3>Phần cài đặt tốn gì</h3>
<p>Từ run 32662461744, bước <code>setup-node</code> trên từng nền tảng:</p>

<div class="out">Linux    13s
macOS    11s
Windows  22s</div>

<p>Nó mua cho bạn một phiên bản Node CỤ THỂ thay vì bất cứ thứ gì ảnh runner tình cờ mang theo — đúng luận điểm của bài 2.1 về việc KHAI BÁO thay vì thừa kế. Mười một tới hai mươi hai giây là cái giá để workflow của bạn sở hữu phiên bản bộ công cụ của nó, thay vì để lịch triển khai ảnh của GitHub sở hữu.</p>

<div class="kv-grid">
<div class="kv"><span class="k">đã có sẵn trong tool cache</span><span class="v">ảnh runner cài sẵn vài phiên bản Node. Xin một trong số đó chỉ là đổi đường dẫn, và đó là ca NHANH</span></div>
<div class="kv"><span class="k">không có trong tool cache</span><span class="v">nó tải về rồi giải nén — hàng chục giây, và thay đổi. Ghim một phiên bản vá chính xác thì dễ trượt tập cài sẵn hơn là ghim một số major</span></div>
<div class="kv"><span class="k"><code>node-version-file:</code></span><span class="v">đọc <code>.nvmrc</code> hoặc <code>engines</code> trong <code>package.json</code>. Tốt hơn một hằng viết thẳng, vì nó chặn chuyện workflow và dự án bất đồng về phiên bản một cách âm thầm</span></div>
<div class="kv"><span class="k">cùng một hình dạng ở mọi nơi</span><span class="v"><code>setup-python</code>, <code>setup-go</code>, <code>setup-java</code>, <code>setup-dotnet</code> đều hoạt động y hệt — tham số phiên bản, tool cache, và một cache phụ thuộc tuỳ chọn</span></div>
</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">xin một phiên bản</span><span class="lz-t"><code>node-version: &#39;22&#39;</code></span><span class="lz-d">action tìm trong tool cache của runner trước</span></div>
<div class="lz-step"><span class="lz-k">đã có sẵn</span><span class="lz-t">chỉ đổi PATH</span><span class="lz-d">ca NHANH: các số major cài sẵn gần như không tốn gì</span></div>
<div class="lz-step"><span class="lz-k">chưa có</span><span class="lz-t">tải về rồi giải nén</span><span class="lz-d">ghim một phiên bản vá chính xác thì dễ rơi vào đây — 11 tới 22 giây, đo thật</span></div>
</div>

<h3>Cuộc điều tra, và vì sao nó thất bại</h3>
<p>Bài 3.4 tái lập <code>hashFiles()</code> và kiểm chứng nó với một khoá cache thật, khớp chính xác. Vậy thì cùng phương pháp ấy phải chạy được với cache dựng sẵn của <code>setup-node</code>. Workflow tại commit đó khai đúng thứ cần băm:</p>

<pre><code>- uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm'
    cache-dependency-path: |
      package-lock.json
      frontend/package-lock.json</code></pre>

<p>Và log của lần chạy ấy in ra cái khoá nó tính được:</p>

<div class="out">Cache hit occurred on the primary key
  node-cache-Linux-x64-npm-699ec67c02f94027efff6b4cd1c7f842cbaa689063c4d900c963e39ac11c4c6a</div>

<p>Tám cách tính ứng viên, tất cả tại đúng commit mà lần chạy ấy dùng:</p>

<div class="out">cach tinh                          ket qua
------------------------------------------------------------
hashFiles(chi goc)                 a505030c00af033c...
hashFiles(goc + frontend)          dc25e40311e9cacb...
hashFiles(chi frontend)            e3a98579f5ab829e...
hashFiles(tat ca **/)              dc25e40311e9cacb...
noi HEX thay vi nhi phan           7e9417715d1fe848...
noi NOI DUNG roi bam mot lan       6f426dc0c0a29a69...
thu tu nguoc                       dc25e40311e9cacb...
chi frontend, noi hex              1228ac54b1780ee7...

muc tieu (tu log that)             699ec67c02f94027...</div>

<div class="callout warn">
<p><strong>Không cái nào khớp. Đó là KẾT QUẢ, và nó đang được báo cáo đúng như một kết quả.</strong> Bản tái lập <code>hashFiles()</code> thì đã biết là ĐÚNG — bài 3.4 kiểm chứng nó tới cả sáu mươi tư ký tự với một khoá <code>actions/cache</code> lấy từ chính lần chạy này. Nên khác biệt không nằm ở cách tôi băm; <code>setup-node</code> tính khoá của nó theo một cách khác, và tám phỏng đoán hợp lý đã không tìm ra.</p>
</div>

<h3>Cú thất bại ấy đáng giá gì</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">khoá bạn tự viết</span><span class="lz-t">đoán được</span><span class="lz-d"><code>nextjs-cache-\${{ runner.os }}-frontend-lock-\${{ hashFiles(...) }}</code> — tính ngoại tuyến ở bài 3.4, khớp chính xác. Bạn trả lời được câu "cái này có hết hiệu lực không?" ngay từ tệp</span></div>
<div class="lz-step"><span class="lz-k">khoá dựng sẵn</span><span class="lz-t">ĐỤC</span><span class="lz-d">nhìn thấy trong log SAU KHI đã chạy, không suy ra được từ workflow. Tám lần thử, không khớp</span></div>
</div>

<div class="callout ok">
<p><strong>Đó là một kết luận THẬT và DÙNG ĐƯỢC.</strong> <code>cache: 'npm'</code> chỉ một dòng và nó chạy được, và với phần lớn workflow thì đó là đánh đổi đúng. Nhưng khi bạn cần <em>LẬP LUẬN</em> về việc hết hiệu lực — "vì sao cache này không làm mới sau khi tôi đổi tệp khoá", "vì sao hai job va nhau trên một mục" — thì một cái khoá bạn tự viết gỡ lỗi được từ tệp còn cái này thì không. Hãy với tay tới một <code>actions/cache</code> tường minh khi CHÍNH hành vi cache trở thành câu hỏi.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — hai cái cache làm hai việc khác nhau, và người ta trông đợi nhầm cái.</strong> <code>cache:</code> của <code>setup-node</code> cache <strong>thư mục TẢI VỀ của trình quản lý gói</strong> — <code>~/.npm</code> — chứ không cache <code>node_modules</code>. Nên <code>npm ci</code> vẫn chạy, vẫn xoá rồi dựng lại <code>node_modules</code>, và vẫn tốn thời gian thật; thứ nó bỏ qua là lượt tải qua mạng. Đo trên job desktop ở bài 2.3, <code>npm ci</code> chạy mất 38 tới 107 giây <em>TRONG KHI</em> cache ấy đang hoạt động. Nếu bạn trông đợi "phụ thuộc đã cache" nghĩa là "không có bước cài", thì đây là chỗ trông đợi ấy vỡ.</p>
</div>

<h3>Một cái cache CHẾT, tìm thấy trong cùng log</h3>
<p>Lần chạy đang được soi cũng in ra dòng này, từ một bước cache khác:</p>

<div class="out">[warning]Path Validation Error: Path(s) specified in the action for caching
         do(es) not exist, hence no cache is being saved.</div>

<p>Đó là cache backend của <code>deploy-ghcr.yml</code>, thứ cache <code>node_modules/.cache</code> — một đường dẫn mà dự án này KHÔNG tạo ra. Bước ấy chưa bao giờ lưu gì và sẽ không bao giờ lưu. Nó gần như không tốn thời gian và không làm gì, và đó chính xác là lý do nó sống sót: một cái cache âm thầm chẳng làm gì trông y hệt một cái cache đang chạy tốt.</p>

<div class="callout">
<p><strong>Phép kiểm chỉ là một dòng trong log.</strong> Mọi bước <code>actions/cache</code> đều in ra hoặc một lần trúng, hoặc một lần trượt kèm khoá, hoặc cái cảnh báo kia. Đọc ba dòng ấy sau khi thêm một cache là khác biệt giữa việc CÓ một cái cache và việc TIN rằng mình có — và Chương 5 đo xem những cái đang chạy thật thì đáng bao nhiêu.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Các action <code>setup-*</code> mua cho bạn một bộ công cụ ĐƯỢC KHAI BÁO với giá mười tới hai mươi giây, còn phần cache dựng sẵn của chúng mua sự tiện lợi với cái giá là một cái khoá bạn không tính ra được — điều đó ổn cho tới cái ngày chính cái cache là thứ bạn cần gỡ lỗi.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node — README</span><span class="lc-sub">github.com/actions/setup-node — <code>node-version-file</code>, hai tham số <code>cache</code> và <code>cache-dependency-path</code>, và phát biểu thư mục nào được cache (thư mục của trình quản lý gói, KHÔNG phải <code>node_modules</code>).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node — src/cache-restore.ts</span><span class="lc-sub">github.com/actions/setup-node — mã nguồn tính ra cái khoá vừa được đối chiếu bên trên. Khi mô tả trong tài liệu để ngỏ thuật toán chính xác, đây là chỗ có đáp án, và đọc nó là bước tiếp theo sau tám lần đoán trượt.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/cache — README, trúng và trượt cache</span><span class="lc-sub">github.com/actions/cache — ba dòng log cần tìm sau khi thêm một cache, gồm cả cảnh báo path-validation đã nhận diện cái cache chết bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — npm ci với npm install, và ~/.npm giữ cái gì</span><span class="lc-sub">/courses/nodejs/learn${REF} — vì sao <code>npm ci</code> vẫn tốn thời gian với một cache tải về đang ấm, và đó là cơ chế đứng sau cái bẫy bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Redis — một cái cache âm thầm không bao giờ trúng</span><span class="lc-sub">/courses/redis/learn${REF} — cùng hình dạng hỏng ở một hệ thống khác: một cái khoá không bao giờ khớp thì cho ra hành vi ĐÚNG và không có lỗi nào, và chỉ một phép đo tỉ lệ trúng mới tìm ra nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.5 ─────────────────────────── */
    {
      title: '4.5 — Writing your own, and the drift I measured|||4.5 — Tự viết lấy, và cú trôi dạt tôi đo được',
      slug: 'ga-4-5-tu-viet',
      type: 'VIDEO',
      description: 'Chín bản chép của cùng một khối SSH 10 dòng, nằm ở chín workflow, và chúng đã trôi thành HAI phiên bản: ba dòng giữ-kết-nối có ở hai workflow, không có ở bảy cái kia. Cộng một lần tôi đo sai và phải đo lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Writing your own, and the drift I measured</h2>
<p class="lead">The argument for factoring out a repeated block is usually made on taste. Here it can be made on measurement, because this repository has nine copies of one block and they have already drifted.</p>

<h3>The measurement</h3>
<p>Nine of the eleven workflows use <code>VPS_SSH_PRIVATE_KEY</code>, and each contains a ten-line step that writes the key to disk and builds an SSH config. Comparing the <em>bodies</em> of those nine blocks, ignoring the step name:</p>

<div class="out">9 khoi 'Setup SSH key', moi khoi 10 dong
THAN khoi: 2 phien ban khac nhau

  ban 3de67690 — 7 workflow:
      e2e-message-button · fix-containers · full-deploy
      guard-no-duplicates · restart-containers · sync-frontend
      vps-cleanup-weekly

  ban 57e5f9fc — 2 workflow:
      backend-vps · deploy-ghcr</div>

<p>And the single difference between the two versions:</p>

<div class="out">-printf 'Host vps\\n  HostName %s\\n  User %s\\n
         IdentityFile ~/.ssh/deploy_key\\n  StrictHostKeyChecking no\\n'
+printf 'Host vps\\n  HostName %s\\n  User %s\\n
         IdentityFile ~/.ssh/deploy_key\\n  StrictHostKeyChecking no\\n
         ServerAliveInterval 60\\n  ServerAliveCountMax 10\\n  ConnectTimeout 30\\n'</div>

<div class="callout warn">
<p><strong>Three keep-alive lines exist in two workflows and not in the other seven.</strong> Somebody hit dropped SSH connections on a long deploy, fixed it where it hurt, and stopped — which is the entirely reasonable thing to do at the time. The result is that seven workflows still have the old behaviour, and nothing anywhere records that they are the un-fixed copies. The next person to debug a hung <code>ssh</code> in <code>vps-cleanup-weekly</code> gets to rediscover this.</p>
</div>

<div class="callout">
<p><strong>A correction, kept because it is the more useful lesson.</strong> The first version of this measurement took a sixteen-line window around each match and reported that <em>all nine copies differ</em>. That was wrong — the window was swallowing the <em>next</em> step, which is genuinely different in every workflow. Cutting the block at its real boundary gives nine copies in two versions. The wrong number was more dramatic and would have made a better story; it was also not true.</p>
</div>

<h3>The three ways to stop copying</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">composite action — <code>.github/actions/&lt;name&gt;/action.yml</code></span><span class="lz-lnote">for a repeated sequence of <em>steps</em>. Called with <code>uses: ./.github/actions/&lt;name&gt;</code>. This is the right shape for the SSH block: it is steps, it takes inputs, it belongs inside a job</span></div>
<div class="lz-layer"><span class="lz-lname">reusable workflow — <code>on: workflow_call</code></span><span class="lz-lnote">for a repeated <em>job</em> or set of jobs. Called with <code>uses:</code> at job level. Heavier: it gets its own runner, and secrets must be passed explicitly or with <code>secrets: inherit</code></span></div>
<div class="lz-layer"><span class="lz-lname">a script in the repository</span><span class="lz-lnote">the underrated option. A <code>scripts/ssh-setup.sh</code> called from one <code>run:</code> line is testable on your own machine, which neither of the other two are</span></div>
</div>

<h3>The composite action for that block</h3>
<pre><code><span class="tok-comment"># .github/actions/ssh-vps/action.yml</span>
name: Cai SSH toi VPS
inputs:
  host:    { required: true }
  user:    { required: true }
  khoa:    { required: true }
runs:
  using: composite
  steps:
    - shell: bash          <span class="tok-comment"># BAT BUOC tren moi run: cua composite</span>
      env:
        HOST: \${{ inputs.host }}
        USER: \${{ inputs.user }}
        KHOA: \${{ inputs.khoa }}
      run: |
        mkdir -p ~/.ssh &amp;&amp; chmod 700 ~/.ssh
        echo "\$KHOA" | base64 -d &gt; ~/.ssh/deploy_key
        chmod 600 ~/.ssh/deploy_key
        ssh-keyscan -H "\$HOST" &gt;&gt; ~/.ssh/known_hosts 2&gt;/dev/null || true
        printf 'Host vps\\n  HostName %s\\n  User %s\\n  IdentityFile ~/.ssh/deploy_key\\n  ServerAliveInterval 60\\n' \\
          "\$HOST" "\$USER" &gt; ~/.ssh/config</code></pre>

<p>Called from any of the nine:</p>

<pre><code>- uses: ./.github/actions/ssh-vps
  with:
    host: \${{ secrets.VPS_HOST }}
    user: \${{ secrets.VPS_USER }}
    khoa: \${{ secrets.VPS_SSH_PRIVATE_KEY }}</code></pre>

<div class="callout ok">
<p><strong>Note the secrets go through <code>with:</code> and then <code>env:</code>, never into <code>run:</code> directly</strong> — the rule from 3.1, applying here because a host name from a secret is still a value being substituted into a script. The original copies interpolate <code>\${{ secrets.VPS_HOST }}</code> straight into the <code>printf</code>, which is safe only because that secret is one you set yourself.</p>
</div>

<h3>What composite actions cannot do</h3>
<div class="kv-grid">
<div class="kv"><span class="k"><code>shell:</code> is mandatory</span><span class="v">every <code>run:</code> inside a composite action must specify a shell. Omitting it is an error, and it is the first thing that fails when you move steps in</span></div>
<div class="kv"><span class="k">no <code>secrets</code> context</span><span class="v">a composite action cannot read <code>secrets.*</code>. Pass them as inputs — which is better, because the action then declares what it needs</span></div>
<div class="kv"><span class="k">outputs need plumbing</span><span class="v">a step output inside the action is not automatically an action output; declare it in <code>outputs:</code> with a reference to the inner step&#39;s <code>id</code></span></div>
<div class="kv"><span class="k">local path means local</span><span class="v"><code>uses: ./.github/actions/x</code> requires the repository to be checked out first. A composite action cannot be the step that runs <em>before</em> <code>checkout</code></span></div>
</div>

<div class="pitfall">
<p><strong>Trap — factoring out before the shape is known.</strong> Two copies of something is not evidence of a pattern; it is evidence of two things that currently look alike. A composite action extracted from two call sites tends to grow an input for every way the third call site differs, and ends up harder to read than the duplication it replaced. Nine copies with one axis of variation — this case — is past that threshold. Two copies is not.</p>
</div>

<h3>Reusable workflows, and the one thing that surprises</h3>
<pre><code>jobs:
  goi:
    uses: ./.github/workflows/dung-chung.yml
    with:
      moi_truong: production
    secrets: inherit        <span class="tok-comment"># hoac liet ke tung cai</span></code></pre>

<div class="callout warn">
<p><strong>Without <code>secrets:</code>, the called workflow gets none — and gets empty strings, not errors.</strong> This is 3.2&#39;s availability rule arriving in its most expensive form: a deploy workflow refactored into a reusable one, called without <code>secrets: inherit</code>, will run with a blank host and a blank key and fail somewhere downstream with a message about the wrong thing. <code>secrets: inherit</code> is convenient and passes everything; listing them explicitly is the version that documents what the workflow needs.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> Duplication in workflows is not a style problem, it is a drift problem — nine copies here already carry two behaviours — and the fix is a composite action when the repetition is steps, a reusable workflow when it is jobs, and a plain script whenever you would like to be able to test it.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating a composite action</span><span class="lc-sub">docs.github.com/en/actions/creating-actions/creating-a-composite-action — the full syntax, the mandatory <code>shell:</code>, and how to declare outputs from an inner step.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Reusing workflows</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/reusing-workflows — <code>workflow_call</code>, the <code>secrets: inherit</code> keyword, the nesting limit, and the restrictions on what a called workflow can see.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening: using secrets</span><span class="lc-sub">docs.github.com/en/actions/security-guides/using-secrets-in-github-actions — why passing a secret as an input is preferable to reading it from the context deep inside a shared component.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the deploy script, and why it lives in the repository</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the third option above, argued at length: a script you can run locally is a script you can debug without pushing a commit.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — writing a script that takes arguments instead of hard-coding</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the same factoring decision one level down, including when parameterising makes a script worse.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Tự viết lấy, và cú trôi dạt tôi đo được</h2>
<p class="lead">Lập luận cho việc tách một khối lặp lại ra thường được đưa ra trên nền GU THẨM MỸ. Ở đây nó đưa ra được trên nền SỐ ĐO, bởi kho này có CHÍN bản chép của một khối và chúng ĐÃ trôi dạt rồi.</p>

<h3>Phép đo</h3>
<p>Chín trên mười một workflow dùng <code>VPS_SSH_PRIVATE_KEY</code>, và mỗi cái chứa một bước mười dòng ghi khoá xuống đĩa rồi dựng một cấu hình SSH. So sánh <em>THÂN</em> của chín khối ấy, bỏ qua tên bước:</p>

<div class="out">9 khoi 'Setup SSH key', moi khoi 10 dong
THAN khoi: 2 phien ban khac nhau

  ban 3de67690 — 7 workflow:
      e2e-message-button · fix-containers · full-deploy
      guard-no-duplicates · restart-containers · sync-frontend
      vps-cleanup-weekly

  ban 57e5f9fc — 2 workflow:
      backend-vps · deploy-ghcr</div>

<p>Và khác biệt DUY NHẤT giữa hai phiên bản:</p>

<div class="out">-printf 'Host vps\\n  HostName %s\\n  User %s\\n
         IdentityFile ~/.ssh/deploy_key\\n  StrictHostKeyChecking no\\n'
+printf 'Host vps\\n  HostName %s\\n  User %s\\n
         IdentityFile ~/.ssh/deploy_key\\n  StrictHostKeyChecking no\\n
         ServerAliveInterval 60\\n  ServerAliveCountMax 10\\n  ConnectTimeout 30\\n'</div>

<div class="callout warn">
<p><strong>Ba dòng giữ-kết-nối có mặt ở hai workflow và không có ở bảy cái kia.</strong> Ai đó gặp cảnh SSH rớt giữa một cuộc deploy dài, vá đúng chỗ đau, rồi dừng — mà đó là việc hoàn toàn hợp lý vào lúc ấy. Kết quả là bảy workflow vẫn giữ hành vi cũ, và không có chỗ nào ghi lại rằng chúng là những bản CHƯA VÁ. Người kế tiếp đi gỡ một cú <code>ssh</code> treo trong <code>vps-cleanup-weekly</code> sẽ được khám phá lại chuyện này từ đầu.</p>
</div>

<div class="callout">
<p><strong>Một chỗ tự sửa, giữ lại vì nó mới là bài học hữu ích hơn.</strong> Bản đầu tiên của phép đo này lấy một cửa sổ mười sáu dòng quanh mỗi chỗ khớp rồi báo rằng <em>cả chín bản đều khác nhau</em>. Sai — cửa sổ ấy nuốt cả BƯỚC KẾ TIẾP, thứ vốn thật sự khác nhau ở mọi workflow. Cắt khối ở đúng biên của nó thì ra chín bản trong hai phiên bản. Con số sai thì kịch tính hơn và làm nên một câu chuyện hay hơn; nó cũng không đúng sự thật.</p>
</div>

<h3>Ba cách để thôi chép</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">composite action — <code>.github/actions/&lt;tên&gt;/action.yml</code></span><span class="lz-lnote">cho một chuỗi <em>BƯỚC</em> lặp lại. Gọi bằng <code>uses: ./.github/actions/&lt;tên&gt;</code>. Đây là hình dạng đúng cho khối SSH: nó là các bước, nó nhận tham số, nó thuộc về bên trong một job</span></div>
<div class="lz-layer"><span class="lz-lname">workflow dùng lại — <code>on: workflow_call</code></span><span class="lz-lnote">cho một <em>JOB</em> hay một tập job lặp lại. Gọi bằng <code>uses:</code> ở mức job. Nặng hơn: nó nhận một runner riêng, và bí mật phải được truyền tường minh hoặc bằng <code>secrets: inherit</code></span></div>
<div class="lz-layer"><span class="lz-lname">một script nằm trong kho</span><span class="lz-lnote">lựa chọn bị đánh giá thấp. Một <code>scripts/ssh-setup.sh</code> gọi từ một dòng <code>run:</code> thì KIỂM THỬ ĐƯỢC trên máy của chính bạn, mà hai cái kia thì không</span></div>
</div>

<h3>Composite action cho khối ấy</h3>
<pre><code><span class="tok-comment"># .github/actions/ssh-vps/action.yml</span>
name: Cai SSH toi VPS
inputs:
  host:    { required: true }
  user:    { required: true }
  khoa:    { required: true }
runs:
  using: composite
  steps:
    - shell: bash          <span class="tok-comment"># BAT BUOC tren moi run: cua composite</span>
      env:
        HOST: \${{ inputs.host }}
        USER: \${{ inputs.user }}
        KHOA: \${{ inputs.khoa }}
      run: |
        mkdir -p ~/.ssh &amp;&amp; chmod 700 ~/.ssh
        echo "\$KHOA" | base64 -d &gt; ~/.ssh/deploy_key
        chmod 600 ~/.ssh/deploy_key
        ssh-keyscan -H "\$HOST" &gt;&gt; ~/.ssh/known_hosts 2&gt;/dev/null || true
        printf 'Host vps\\n  HostName %s\\n  User %s\\n  IdentityFile ~/.ssh/deploy_key\\n  ServerAliveInterval 60\\n' \\
          "\$HOST" "\$USER" &gt; ~/.ssh/config</code></pre>

<p>Gọi từ bất kỳ cái nào trong chín:</p>

<pre><code>- uses: ./.github/actions/ssh-vps
  with:
    host: \${{ secrets.VPS_HOST }}
    user: \${{ secrets.VPS_USER }}
    khoa: \${{ secrets.VPS_SSH_PRIVATE_KEY }}</code></pre>

<div class="callout ok">
<p><strong>Để ý bí mật đi qua <code>with:</code> rồi qua <code>env:</code>, không bao giờ đổ thẳng vào <code>run:</code></strong> — quy tắc của bài 3.1, áp dụng ở đây bởi một tên máy chủ lấy từ secret vẫn là một giá trị đang bị thay vào một script. Mấy bản chép gốc nội suy <code>\${{ secrets.VPS_HOST }}</code> thẳng vào câu <code>printf</code>, và điều đó chỉ an toàn vì bí mật ấy là thứ chính bạn đặt vào.</p>
</div>

<h3>Composite action KHÔNG làm được gì</h3>
<div class="kv-grid">
<div class="kv"><span class="k"><code>shell:</code> là BẮT BUỘC</span><span class="v">mọi <code>run:</code> bên trong một composite action đều phải nêu một shell. Bỏ nó đi là lỗi, và đó là thứ hỏng đầu tiên khi bạn dời các bước vào trong</span></div>
<div class="kv"><span class="k">không có context <code>secrets</code></span><span class="v">một composite action KHÔNG đọc được <code>secrets.*</code>. Hãy truyền chúng vào làm tham số — mà như thế TỐT HƠN, vì khi đó action tự khai ra nó cần gì</span></div>
<div class="kv"><span class="k">output cần nối dây</span><span class="v">output của một bước bên trong action KHÔNG tự động thành output của action; hãy khai nó trong <code>outputs:</code> kèm tham chiếu tới <code>id</code> của bước bên trong</span></div>
<div class="kv"><span class="k">đường dẫn cục bộ nghĩa là CỤC BỘ</span><span class="v"><code>uses: ./.github/actions/x</code> đòi kho phải được checkout TRƯỚC. Một composite action không thể là cái bước chạy <em>TRƯỚC</em> <code>checkout</code></span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — tách ra trước khi biết hình dạng.</strong> Hai bản chép của một thứ KHÔNG phải bằng chứng của một khuôn mẫu; nó là bằng chứng của hai thứ hiện đang trông giống nhau. Một composite action tách ra từ hai chỗ gọi thường mọc thêm một tham số cho mỗi cách mà chỗ gọi thứ ba khác đi, rồi kết thúc trong tình trạng khó đọc hơn cả chỗ trùng lặp mà nó thay thế. Chín bản với MỘT trục biến thiên — ca này — thì đã vượt ngưỡng ấy. Hai bản thì chưa.</p>
</div>

<h3>Workflow dùng lại, và một chuyện gây bất ngờ</h3>
<pre><code>jobs:
  goi:
    uses: ./.github/workflows/dung-chung.yml
    with:
      moi_truong: production
    secrets: inherit        <span class="tok-comment"># hoac liet ke tung cai</span></code></pre>

<div class="callout warn">
<p><strong>Không có <code>secrets:</code> thì workflow được gọi KHÔNG nhận cái nào — và nó nhận chuỗi rỗng, không nhận lỗi.</strong> Đây là luật khả dụng của bài 3.2 tới nơi ở dạng đắt nhất: một workflow deploy được tái cấu trúc thành dạng dùng lại, gọi mà quên <code>secrets: inherit</code>, sẽ chạy với một tên máy chủ trống và một cái khoá trống rồi hỏng ở đâu đó phía sau với một thông báo về một chuyện KHÁC. <code>secrets: inherit</code> thì tiện và truyền mọi thứ; liệt kê tường minh mới là bản KHAI RA workflow ấy cần gì.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Trùng lặp trong workflow không phải một vấn đề phong cách mà là một vấn đề TRÔI DẠT — chín bản chép ở đây đã mang hai hành vi — và cách vá là một composite action khi chỗ lặp là các BƯỚC, một workflow dùng lại khi nó là các JOB, và một script trơn bất cứ khi nào bạn muốn có thể kiểm thử nó.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating a composite action</span><span class="lc-sub">docs.github.com/en/actions/creating-actions/creating-a-composite-action — cú pháp đầy đủ, khoá <code>shell:</code> bắt buộc, và cách khai output từ một bước bên trong.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Reusing workflows</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/reusing-workflows — <code>workflow_call</code>, từ khoá <code>secrets: inherit</code>, giới hạn lồng nhau, và các hạn chế về thứ mà một workflow được gọi nhìn thấy được.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Security hardening: using secrets</span><span class="lc-sub">docs.github.com/en/actions/security-guides/using-secrets-in-github-actions — vì sao truyền một bí mật vào làm THAM SỐ thì hơn là đọc nó từ context ở sâu trong một thành phần dùng chung.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — script deploy, và vì sao nó nằm TRONG KHO</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — lựa chọn thứ ba bên trên, lập luận cho đầy đủ: một script bạn chạy được ở máy là một script bạn gỡ lỗi được mà không phải đẩy một commit.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — viết một script NHẬN THAM SỐ thay vì viết cứng</span><span class="lc-sub">/courses/linux-bash/learn${REF} — cùng quyết định tách bạch ấy ở một tầng thấp hơn, gồm cả lúc mà việc tham số hoá làm script TỆ ĐI.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.6 ─────────────────────────── */
    {
      title: '4.6 — Chapter 4 quiz|||4.6 — Kiểm tra Chương 4',
      slug: 'ga-4-6-kiem-tra',
      type: 'QUIZ',
      description: 'Tám câu: 21/21 ghim thẻ major, `@v4` đổi runtime dưới tệp không đổi, clone nông tiết kiệm 1,9 giây, khoá `setup-node` KHÔNG tái lập được, và chín bản chép đã trôi thành hai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>What Chapter 4 measured</h2>
<p class="lead">Eight questions, twelve minutes. Two of this chapter&#39;s findings are things the measurement contradicted: shallow cloning saves almost nothing here, and one hash could not be reproduced at all.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">4.1 — what an action is</span><span class="lz-lnote">11.3% of step time runs other people&#39;s code, with the job&#39;s token in the environment and no boundary between it and your steps</span></div>
<div class="lz-layer"><span class="lz-lname">4.2 — pinning</span><span class="lz-lnote">21 of 21 uses on major tags, 0 on SHAs; and six actions changed runtime while the file went 18 days without a commit</span></div>
<div class="lz-layer"><span class="lz-lname">4.3 — checkout</span><span class="lz-lnote">full history costs 1.9 seconds and 40 MB here; <code>--filter=blob:none</code> gets it for +1.0 s and +4 MB</span></div>
<div class="lz-layer"><span class="lz-lname">4.4 — setup-*</span><span class="lz-lnote">eight candidate calculations, none matched <code>setup-node</code>&#39;s cache key — reported as a null result</span></div>
<div class="lz-layer"><span class="lz-lname">4.5 — writing your own</span><span class="lz-lnote">nine copies of one 10-line block, already in two versions differing by three keep-alive lines</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Chương 4 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Hai trong số phát hiện của chương này là những thứ mà phép đo BÁC BỎ: clone nông ở đây gần như không tiết kiệm gì, và có một cái hash hoàn toàn không tái lập được.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">4.1 — action là gì</span><span class="lz-lnote">11,3% thời gian bước chạy mã của người khác, với token của job trong môi trường và không có ranh giới nào giữa nó với các bước của bạn</span></div>
<div class="lz-layer"><span class="lz-lname">4.2 — ghim</span><span class="lz-lnote">21 trên 21 lượt dùng trên thẻ major, 0 trên SHA; và sáu action đổi runtime trong khi tệp trải 18 ngày không một commit</span></div>
<div class="lz-layer"><span class="lz-lname">4.3 — checkout</span><span class="lz-lnote">lịch sử đầy đủ ở đây tốn 1,9 giây và 40 MB; <code>--filter=blob:none</code> lấy được nó với +1,0 s và +4 MB</span></div>
<div class="lz-layer"><span class="lz-lname">4.4 — setup-*</span><span class="lz-lnote">tám cách tính ứng viên, không cái nào khớp khoá cache của <code>setup-node</code> — báo cáo đúng như một kết quả rỗng</span></div>
<div class="lz-layer"><span class="lz-lname">4.5 — tự viết lấy</span><span class="lz-lnote">chín bản chép của một khối 10 dòng, đã ở hai phiên bản khác nhau bởi ba dòng giữ-kết-nối</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does `uses: some/action@v4` actually do on the runner?|||`uses: some/action@v4` thật ra làm gì trên runner?',
            options: [
              'Downloads that repository and runs its code in your job, with the job&#39;s token in the environment and full access to the workspace and network|||Tải kho ấy về rồi chạy mã của nó TRONG job bạn, với token của job trong môi trường và toàn quyền với thư mục làm việc lẫn mạng',
              'Calls a sandboxed function that can only read the inputs you pass in with:|||Gọi một hàm trong hộp cát, chỉ đọc được những tham số bạn truyền qua with:',
              'Runs the action in a separate container isolated from your other steps|||Chạy action trong một container riêng, cách ly khỏi các bước khác của bạn',
              'Copies the action&#39;s steps into your workflow at parse time, so nothing extra executes|||Chép các bước của action vào workflow của bạn lúc đọc tệp, nên không có gì thêm được thực thi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The `uses:` lines in one workflow last changed on 18 June. On 6 July a run warned that six actions had moved to a new Node runtime. What does that show?|||Các dòng `uses:` trong một workflow đổi lần cuối ngày 18/06. Ngày 06/07 một lần chạy cảnh báo sáu action đã chuyển sang runtime Node mới. Điều đó cho thấy gì?',
            options: [
              '@v4 is a mutable tag the maintainer re-points, so the code under a pin changes without any commit of yours|||@v4 là một cái thẻ SỬA ĐƯỢC mà người bảo trì trỏ lại, nên mã nằm dưới một cái ghim đổi mà không cần commit nào của bạn',
              'GitHub rewrote the workflow file automatically to keep it current|||GitHub tự động viết lại tệp workflow để giữ nó cập nhật',
              'The warning was spurious — a pinned major tag cannot change|||Cảnh báo ấy là giả — một thẻ major đã ghim thì không đổi được',
              'The runner image changed, which has nothing to do with the actions|||Ảnh runner đã đổi, chuyện đó chẳng liên quan gì tới các action',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Measured on this repository: shallow clone 8.8 s / 131 MB, full history 10.7 s / 171 MB. Why is the saving so small?|||Đo trên kho này: clone nông 8,8 s / 131 MB, lịch sử đầy đủ 10,7 s / 171 MB. Vì sao khoản tiết kiệm bé thế?',
            options: [
              'The working tree is 440 MB of content, so a single commit already pulls 130 MiB — content dominates and history is cheap|||Cây làm việc là 440 MB nội dung, nên MỘT commit đã kéo về 130 MiB — nội dung áp đảo còn lịch sử thì rẻ',
              'Because git compresses history to almost nothing in every repository|||Vì git nén lịch sử xuống gần bằng không ở mọi kho',
              'Because --depth 1 is ignored when the branch is the default branch|||Vì --depth 1 bị bỏ qua khi nhánh là nhánh mặc định',
              'The measurement is wrong; shallow clones are always several times faster|||Phép đo sai; clone nông bao giờ cũng nhanh hơn vài lần',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A job needs full history for a `git diff` against the base branch. Which option was measured as cheapest?|||Một job cần lịch sử đầy đủ để `git diff` với nhánh gốc. Lựa chọn nào đo được là rẻ nhất?',
            options: [
              '--filter=blob:none — a partial clone gives all 2,515 commits for +1.0 s and +4 MB over the shallow default|||--filter=blob:none — một bản clone từng phần cho trọn 2.515 commit với +1,0 s và +4 MB so với mặc định nông',
              'fetch-depth: 0, which is the only way to get history at all|||fetch-depth: 0, cách DUY NHẤT lấy được lịch sử',
              'Leaving the default and fetching the base branch in a later step, which costs nothing|||Để nguyên mặc định rồi fetch nhánh gốc ở một bước sau, cách đó không tốn gì',
              'sparse-checkout, which fetches the history but not the files|||sparse-checkout, thứ lấy lịch sử mà không lấy tệp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Eight candidate calculations were compared against setup-node&#39;s real cache key and none matched. What is the reported conclusion?|||Tám cách tính ứng viên được đối chiếu với khoá cache thật của setup-node và không cái nào khớp. Kết luận được báo cáo là gì?',
            options: [
              'A null result: the built-in key is opaque and not derivable from the workflow, which is a reason to write your own key when you need to reason about invalidation|||Một kết quả RỖNG: khoá dựng sẵn là ĐỤC và không suy ra được từ workflow, và đó là lý do nên TỰ VIẾT khoá khi bạn cần lập luận về việc hết hiệu lực',
              'That the hashFiles reproduction from Chapter 3 must have been wrong|||Rằng bản tái lập hashFiles ở Chương 3 chắc hẳn đã sai',
              'That setup-node does not actually cache anything|||Rằng setup-node thật ra chẳng cache gì cả',
              'That the cache key is random and changes on every run|||Rằng khoá cache là ngẫu nhiên và đổi ở mỗi lần chạy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does `cache: \'npm\'` on setup-node actually cache?|||`cache: \'npm\'` trên setup-node thật ra cache CÁI GÌ?',
            options: [
              'The package manager&#39;s download directory (~/.npm) — npm ci still runs and still rebuilds node_modules; only the network fetch is skipped|||Thư mục TẢI VỀ của trình quản lý gói (~/.npm) — npm ci vẫn chạy và vẫn dựng lại node_modules; chỉ lượt tải qua mạng bị bỏ qua',
              'node_modules, so the install step is skipped entirely on a cache hit|||node_modules, nên bước cài bị bỏ qua hoàn toàn khi trúng cache',
              'The Node binary itself, so setup-node takes zero seconds on a hit|||Chính tệp nhị phân Node, nên setup-node tốn không giây khi trúng',
              'Nothing — the input is accepted but has no effect without actions/cache|||Không gì cả — tham số ấy được chấp nhận nhưng vô tác dụng nếu không có actions/cache',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Nine workflows contain the same 10-line SSH setup block. Comparing the bodies found how many distinct versions?|||Chín workflow chứa cùng một khối cài SSH 10 dòng. So sánh phần thân tìm ra bao nhiêu phiên bản khác nhau?',
            options: [
              'Two — seven identical copies, and two carrying three extra keep-alive lines that the other seven never received|||Hai — bảy bản giống hệt, và hai bản mang thêm ba dòng giữ-kết-nối mà bảy bản kia không bao giờ nhận được',
              'One — all nine are byte-identical, which is why nobody noticed the duplication|||Một — cả chín giống hệt tới từng byte, và đó là lý do không ai để ý chỗ trùng lặp',
              'Nine — every copy has drifted independently|||Chín — mỗi bản chép trôi dạt độc lập',
              'Two, differing in which secret name they read|||Hai, khác nhau ở chỗ chúng đọc tên bí mật nào',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A deploy workflow is refactored into a reusable workflow and called without a `secrets:` key. What happens?|||Một workflow deploy được tái cấu trúc thành workflow dùng lại rồi gọi mà không có khoá `secrets:`. Chuyện gì xảy ra?',
            options: [
              'The called workflow receives no secrets — as empty strings, not errors — and fails downstream with a message about something else|||Workflow được gọi KHÔNG nhận bí mật nào — dưới dạng chuỗi rỗng, không phải lỗi — rồi hỏng ở phía sau với một thông báo về một chuyện khác',
              'Secrets are inherited automatically; the key is only needed to restrict them|||Bí mật được thừa kế tự động; cái khoá ấy chỉ cần khi muốn HẠN CHẾ chúng',
              'The workflow refuses to start and reports a missing-secrets error|||Workflow từ chối khởi động và báo lỗi thiếu bí mật',
              'Only organisation-level secrets are inherited; repository secrets are not|||Chỉ bí mật cấp tổ chức được thừa kế; bí mật cấp kho thì không',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
