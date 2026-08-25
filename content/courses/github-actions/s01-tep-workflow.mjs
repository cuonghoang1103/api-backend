const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 1: Tệp workflow, và những cái bẫy sinh ra vì nó là YAML.
 * Số đo: pyyaml trên chuẩn YAML 1.1, và 10 lần chạy theo lịch THẬT của kho này.
 */

export default {
  title: 'Chapter 1 — The workflow file, and the traps that come from YAML|||Chương 1 — Tệp workflow, và những cái bẫy tới từ YAML',
  slug: 'ga-ch1-tep-workflow',
  description: 'Cái khoá `on:` trong mọi workflow bị YAML đọc thành boolean `True`. `node-version: 18.20` thành `18.2`. Và mười lần chạy theo lịch của kho này: KHÔNG lần nào đúng giờ, trễ trung bình 2,6 tiếng.',
  sortOrder: 2,
  lessons: [

    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — It is YAML, and that is where the traps live|||1.1 — Nó là YAML, và bẫy nằm ở đó',
      slug: 'ga-1-1-la-yaml',
      type: 'VIDEO',
      description: 'Cái khoá `on:` mở đầu mọi workflow trên đời bị YAML đọc thành boolean `True`. `node-version: 18.20` thành `18.2`. Và `run: >` gấp hai câu lệnh thành một, khiến câu thứ hai KHÔNG BAO GIỜ chạy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>It is YAML, and that is where the traps live</h2>
<p class="lead">A workflow file is not a GitHub Actions file that happens to use YAML syntax. It <em>is</em> a YAML document, parsed by a YAML parser, with all of YAML&#39;s opinions about what your text means. Most of the surprises in this chapter are YAML&#39;s, not GitHub&#39;s.</p>

<h3>Start with the first key in every workflow ever written</h3>
<pre><code>name: thu
on:
  push:
    branches: [main]
jobs:
  a:
    runs-on: ubuntu-latest</code></pre>

<p>Parse that with a standard YAML parser and ask what the top-level keys are:</p>

<div class="out">cac khoa cap tren: {'name': str, True: bool, 'jobs': str}

d[True]        = {'push': {'branches': ['main']}}
d.get("on")    = None</div>

<div class="callout warn">
<p><strong>The key is not the string <code>"on"</code>. It is the boolean <code>True</code>.</strong> YAML 1.1 treats <code>on</code>, <code>yes</code>, <code>y</code>, <code>true</code> and their negatives as booleans, and an unquoted key is a scalar like any other. So the single most important key in GitHub Actions — the one that decides when your workflow runs — is stored under a boolean.</p>
</div>

<p>This does not break your workflow: GitHub&#39;s own parser knows and handles it. It breaks <em>your tooling</em>. Every script that lints workflows, every "list all triggers" one-liner, every editor plugin that reads the file has to know to look up <code>True</code> as well as <code>"on"</code>. If you have ever written a five-line script to audit your workflows and got empty results, this is why.</p>

<h3>The one that silently changes your runtime</h3>
<div class="out">| viet         | doc ra  | kieu  |
|--------------|---------|-------|
| yes / on     | True    | bool  |
| no / off / NO| False   | bool  |
| 1.20         | 1.2     | float |
| 3.10         | 3.1     | float |
| 18.20        | 18.2    | float |  ← BAY
| 08           | '08'    | str   |
| 2026-08-24   | date    | date  |
| "3.10"       | '3.10'  | str   |</div>

<p>Read the <code>18.20</code> row. Written unquoted, <code>node-version: 18.20</code> is the number eighteen point two — and <code>setup-node</code> is asked for Node <strong>18.2</strong>, a version from June 2022, instead of 18.20, a version from 2024. Same for <code>python-version: 3.10</code>, which becomes 3.1 — a Python released in 2009.</p>

<div class="callout ok">
<p><strong>This is why <code>ci-lint.yml</code> in this repository writes <code>node-version: '22'</code> with quotes.</strong> For <code>22</code> the quotes change nothing — an integer is unambiguous. The habit matters because the day somebody writes <code>18.20</code>, the quotes are already there. Quote every version number, always, without thinking about whether this particular one needs it.</p>
</div>

<div class="pitfall">
<p><strong>Trap — the "Norway problem" is real and it is this same rule.</strong> A list of country codes containing <code>NO</code> parses as <code>[..., False, ...]</code>. It has bitten enough people to have a name. The general rule: <strong>if a scalar could be read as something other than a string, and you meant a string, quote it.</strong> Version numbers, country codes, git refs, anything starting with a zero, anything that looks like a date.</p>
</div>

<h3>The one that silently drops a command</h3>
<p>YAML has five ways to write a multi-line string, and two of them are common in workflows:</p>

<div class="out">| dang | ket qua                |
|------|------------------------|
| \\|    | 'dong 1\\ndong 2\\n'     |  giu xuong dong
| >    | 'dong 1 dong 2\\n'      |  GAP thanh mot dong
| \\|-   | 'dong 1\\ndong 2'       |  bo \\n cuoi
| >-   | 'dong 1 dong 2'        |
| \\|+   | 'dong 1\\n\\n'           |  giu moi dong trong cuoi</div>

<p>Now put that in a step and run it for real:</p>

<pre><code>- run: |
    echo mot
    echo hai

- run: >
    echo mot
    echo hai</code></pre>

<div class="out">=== buoc dung dau | ===
mot
hai
=== buoc dung dau > (bi gap dong) ===
mot echo hai</div>

<div class="callout warn">
<p><strong>The second step ran one command, not two.</strong> <code>&gt;</code> folds newlines into spaces, so the shell received <code>echo mot echo hai</code> — a single <code>echo</code> with four arguments. The second command never ran, the step exited 0, and CI went green. Nothing anywhere reports this.</p>
</div>

<p>For a <code>run:</code> block you almost always want <code>|</code>. <code>&gt;</code> is for prose — a long <code>description</code> or a comment you want wrapped in the file but joined in the value.</p>

<h3>The rest of the YAML that matters here</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">indentation is structure</span><span class="lz-lnote">two spaces, never tabs — a tab is a parse error, and the message points at the line after the one you edited</span></div>
<div class="lz-layer"><span class="lz-lname">a list is <code>-</code>, a map is <code>key:</code></span><span class="lz-lnote"><code>steps:</code> is a list of maps, which is why every step starts with <code>-</code> and later keys line up under it</span></div>
<div class="lz-layer"><span class="lz-lname">inline forms are equivalent</span><span class="lz-lnote"><code>branches: [main]</code> and a two-line block form parse identically. This repository uses both, in the same file</span></div>
<div class="lz-layer"><span class="lz-lname"><code>#</code> is a comment anywhere</span><span class="lz-lnote">except inside a quoted string — and inside a <code>|</code> block, where it is part of the script and the shell sees it</span></div>
<div class="lz-layer"><span class="lz-lname"><code>{}</code> is an empty map</span><span class="lz-lnote"><code>workflow_dispatch: {}</code> means "this trigger, with no configuration" — the same as <code>workflow_dispatch:</code> with nothing after it</span></div>
</div>

<h3>Checking it before you push</h3>
<p>A workflow with a YAML error does not run — it appears in the Actions tab as a failed run with a parse message, which costs a round trip. Two ways to find out sooner:</p>

<pre><code><span class="tok-comment"># bat ky bo phan tich YAML nao cung bat duoc loi cu phap</span>
python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/ci.yml'))"

<span class="tok-comment"># actionlint kiem CA cu phap YAML LAN luoc do cua GitHub Actions</span>
actionlint .github/workflows/*.yml</code></pre>

<p>The first catches malformed YAML. The second catches valid YAML that is not a valid workflow — a misspelled key, a job referring to a <code>needs:</code> that does not exist, a shell expression that will not evaluate. It also flags the unquoted-version trap.</p>

<div class="callout ok">
<p><strong>The three rules that prevent most of this.</strong> <strong>(1)</strong> Quote every version number and every value that could be read as a boolean or a date. <strong>(2)</strong> Use <code>|</code> for <code>run:</code>, never <code>&gt;</code>. <strong>(3)</strong> Run a YAML parser over the file before pushing, because a parse error costs a full round trip to find.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">YAML 1.2 specification — §7 Flow styles, §8 Block styles</span><span class="lc-sub">yaml.org/spec/1.2.2/#chapter-8-block-style-productions — the normative description of <code>|</code>, <code>&gt;</code>, and the chomping indicators <code>-</code> and <code>+</code> measured above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">YAML 1.1 — Boolean type</span><span class="lc-sub">yaml.org/type/bool.html — the resolution table that turns <code>on</code>, <code>yes</code> and <code>NO</code> into booleans. YAML 1.2 narrowed this, but most parsers still implement 1.1 behaviour by default.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actionlint</span><span class="lc-sub">github.com/rhysd/actionlint — a static checker for workflow files; it knows the schema, the expression syntax, and the shell inside <code>run:</code>. Worth adding to your own CI.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node — Supported version syntax</span><span class="lc-sub">github.com/actions/setup-node#supported-version-syntax — what strings it accepts, and why <code>lts/*</code> is often better than a number you have to remember to quote.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — quoting, and what the shell does with your string</span><span class="lc-sub">/courses/linux-bash/learn${REF} — why <code>echo mot echo hai</code> is one command with four arguments, and how word splitting decides that.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Nó là YAML, và bẫy nằm ở đó</h2>
<p class="lead">Một tệp workflow không phải một tệp GitHub Actions tình cờ dùng cú pháp YAML. Nó <em>LÀ</em> một tài liệu YAML, được một bộ phân tích YAML đọc, kèm theo toàn bộ ý kiến của YAML về việc chữ của bạn có nghĩa gì. Phần lớn những bất ngờ trong chương này là của YAML, không phải của GitHub.</p>

<h3>Bắt đầu từ cái khoá đầu tiên trong mọi workflow từng được viết ra</h3>
<pre><code>name: thu
on:
  push:
    branches: [main]
jobs:
  a:
    runs-on: ubuntu-latest</code></pre>

<p>Đem cái đó cho một bộ phân tích YAML chuẩn rồi hỏi các khoá cấp trên là gì:</p>

<div class="out">cac khoa cap tren: {'name': str, True: bool, 'jobs': str}

d[True]        = {'push': {'branches': ['main']}}
d.get("on")    = None</div>

<div class="callout warn">
<p><strong>Cái khoá đó KHÔNG phải chuỗi <code>"on"</code>. Nó là boolean <code>True</code>.</strong> YAML 1.1 coi <code>on</code>, <code>yes</code>, <code>y</code>, <code>true</code> và các dạng phủ định của chúng là boolean, và một khoá không đặt trong nháy thì cũng là một vô hướng như mọi vô hướng khác. Nên cái khoá QUAN TRỌNG NHẤT trong GitHub Actions — cái quyết định workflow của bạn chạy lúc nào — được lưu dưới một giá trị boolean.</p>
</div>

<p>Chuyện này KHÔNG làm hỏng workflow của bạn: bộ phân tích của chính GitHub biết và xử lý được. Nó làm hỏng <em>CÔNG CỤ CỦA BẠN</em>. Mọi script đi soi workflow, mọi dòng lệnh "liệt kê tất cả trigger", mọi plugin trình soạn thảo đọc cái tệp đó đều phải biết mà tra cả <code>True</code> lẫn <code>"on"</code>. Nếu bạn từng viết một script năm dòng để kiểm kê workflow của mình và nhận về kết quả rỗng, thì đây là lý do.</p>

<h3>Cái bẫy ÂM THẦM đổi môi trường chạy của bạn</h3>
<div class="out">| viet         | doc ra  | kieu  |
|--------------|---------|-------|
| yes / on     | True    | bool  |
| no / off / NO| False   | bool  |
| 1.20         | 1.2     | float |
| 3.10         | 3.1     | float |
| 18.20        | 18.2    | float |  ← BAY
| 08           | '08'    | str   |
| 2026-08-24   | date    | date  |
| "3.10"       | '3.10'  | str   |</div>

<p>Đọc dòng <code>18.20</code>. Viết không nháy, <code>node-version: 18.20</code> là con số mười tám phẩy hai — và <code>setup-node</code> được yêu cầu cài Node <strong>18.2</strong>, một phiên bản từ tháng 6 năm 2022, thay vì 18.20, một phiên bản từ 2024. Tương tự với <code>python-version: 3.10</code>, thành 3.1 — một bản Python phát hành năm 2009.</p>

<div class="callout ok">
<p><strong>Đây là lý do <code>ci-lint.yml</code> của kho này viết <code>node-version: '22'</code> CÓ NHÁY.</strong> Với <code>22</code> thì cặp nháy chẳng đổi gì — một số nguyên thì không mơ hồ. Cái đáng giá là THÓI QUEN: tới cái ngày có người viết <code>18.20</code> thì cặp nháy đã sẵn ở đó rồi. Hãy đặt nháy cho MỌI số phiên bản, LUÔN LUÔN, đừng dừng lại để nghĩ xem cái này có cần không.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — "vấn đề Na Uy" là có thật và nó chính là cái luật này.</strong> Một danh sách mã quốc gia có chứa <code>NO</code> sẽ đọc ra thành <code>[..., False, ...]</code>. Nó cắn đủ nhiều người để được đặt tên riêng. Quy tắc tổng quát: <strong>nếu một vô hướng CÓ THỂ bị đọc thành thứ khác ngoài chuỗi, mà bạn định nói chuỗi, thì hãy ĐẶT NHÁY.</strong> Số phiên bản, mã quốc gia, tham chiếu git, mọi thứ bắt đầu bằng số không, mọi thứ trông giống một ngày tháng.</p>
</div>

<h3>Cái bẫy ÂM THẦM vứt mất một câu lệnh</h3>
<p>YAML có năm cách viết một chuỗi nhiều dòng, và hai trong số đó hay gặp trong workflow:</p>

<div class="out">| dang | ket qua                |
|------|------------------------|
| \\|    | 'dong 1\\ndong 2\\n'     |  giu xuong dong
| >    | 'dong 1 dong 2\\n'      |  GAP thanh mot dong
| \\|-   | 'dong 1\\ndong 2'       |  bo \\n cuoi
| >-   | 'dong 1 dong 2'        |
| \\|+   | 'dong 1\\n\\n'           |  giu moi dong trong cuoi</div>

<p>Giờ đặt cái đó vào một bước và chạy THẬT:</p>

<pre><code>- run: |
    echo mot
    echo hai

- run: >
    echo mot
    echo hai</code></pre>

<div class="out">=== buoc dung dau | ===
mot
hai
=== buoc dung dau > (bi gap dong) ===
mot echo hai</div>

<div class="callout warn">
<p><strong>Bước thứ hai chạy MỘT câu lệnh, không phải hai.</strong> <code>&gt;</code> gấp các dấu xuống dòng thành dấu cách, nên shell nhận được <code>echo mot echo hai</code> — một lệnh <code>echo</code> duy nhất với bốn tham số. Câu lệnh thứ hai KHÔNG BAO GIỜ chạy, bước thoát 0, và CI xanh. Chẳng có gì ở đâu báo chuyện này.</p>
</div>

<p>Với một khối <code>run:</code> thì gần như luôn luôn bạn muốn <code>|</code>. Cái <code>&gt;</code> dành cho VĂN XUÔI — một dòng <code>description</code> dài hay một chú thích bạn muốn xuống dòng trong tệp mà nối liền trong giá trị.</p>

<h3>Phần YAML còn lại có ý nghĩa ở đây</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">thụt lề LÀ cấu trúc</span><span class="lz-lnote">hai dấu cách, không bao giờ dùng tab — một cái tab là lỗi phân tích, và dòng thông báo trỏ vào dòng SAU cái dòng bạn vừa sửa</span></div>
<div class="lz-layer"><span class="lz-lname">danh sách là <code>-</code>, ánh xạ là <code>khoa:</code></span><span class="lz-lnote"><code>steps:</code> là một DANH SÁCH các ánh xạ, và đó là lý do mọi bước bắt đầu bằng <code>-</code> còn các khoá sau thì thẳng hàng dưới nó</span></div>
<div class="lz-layer"><span class="lz-lname">dạng nội dòng là TƯƠNG ĐƯƠNG</span><span class="lz-lnote"><code>branches: [main]</code> và dạng khối hai dòng phân tích ra y hệt nhau. Kho này dùng cả hai, trong cùng một tệp</span></div>
<div class="lz-layer"><span class="lz-lname"><code>#</code> là chú thích ở mọi chỗ</span><span class="lz-lnote">trừ bên trong một chuỗi có nháy — và bên trong một khối <code>|</code>, nơi nó là một phần của script và SHELL nhìn thấy nó</span></div>
<div class="lz-layer"><span class="lz-lname"><code>{}</code> là một ánh xạ RỖNG</span><span class="lz-lnote"><code>workflow_dispatch: {}</code> nghĩa là "bộ kích hoạt này, không có cấu hình gì" — giống hệt <code>workflow_dispatch:</code> để trống phía sau</span></div>
</div>

<h3>Kiểm nó TRƯỚC khi push</h3>
<p>Một workflow có lỗi YAML thì KHÔNG chạy — nó hiện ra ở tab Actions dưới dạng một lần chạy hỏng kèm dòng báo lỗi phân tích, và chuyện đó tốn một vòng đi về. Hai cách biết sớm hơn:</p>

<pre><code><span class="tok-comment"># bat ky bo phan tich YAML nao cung bat duoc loi cu phap</span>
python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/ci.yml'))"

<span class="tok-comment"># actionlint kiem CA cu phap YAML LAN luoc do cua GitHub Actions</span>
actionlint .github/workflows/*.yml</code></pre>

<p>Cái đầu bắt được YAML dị dạng. Cái thứ hai bắt được YAML HỢP LỆ mà không phải một workflow hợp lệ — một khoá gõ sai, một job trỏ tới một <code>needs:</code> không tồn tại, một biểu thức shell sẽ không tính ra được. Nó cũng gắn cờ cái bẫy phiên-bản-không-nháy.</p>

<div class="callout ok">
<p><strong>Ba quy tắc ngăn được phần lớn chuyện này.</strong> <strong>(1)</strong> Đặt nháy cho mọi số phiên bản và mọi giá trị có thể bị đọc thành boolean hay ngày tháng. <strong>(2)</strong> Dùng <code>|</code> cho <code>run:</code>, đừng bao giờ dùng <code>&gt;</code>. <strong>(3)</strong> Chạy một bộ phân tích YAML lên tệp trước khi push, vì một lỗi phân tích tốn trọn một vòng đi về mới tìm ra.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Đặc tả YAML 1.2 — §7 Flow styles, §8 Block styles</span><span class="lc-sub">yaml.org/spec/1.2.2/#chapter-8-block-style-productions — mô tả chuẩn tắc về <code>|</code>, <code>&gt;</code>, và các chỉ báo cắt <code>-</code> với <code>+</code> đo ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">YAML 1.1 — kiểu Boolean</span><span class="lc-sub">yaml.org/type/bool.html — cái bảng phân giải biến <code>on</code>, <code>yes</code> và <code>NO</code> thành boolean. YAML 1.2 đã thu hẹp lại, nhưng phần lớn bộ phân tích tới giờ vẫn cài đặt hành vi 1.1 theo mặc định.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actionlint</span><span class="lc-sub">github.com/rhysd/actionlint — bộ kiểm tĩnh cho tệp workflow; nó biết lược đồ, biết cú pháp biểu thức, và biết cả cái shell nằm trong <code>run:</code>. Đáng thêm vào chính CI của bạn.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node — Supported version syntax</span><span class="lc-sub">github.com/actions/setup-node#supported-version-syntax — nó nhận những chuỗi nào, và vì sao <code>lts/*</code> thường tốt hơn một con số mà bạn phải NHỚ đặt nháy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — dấu nháy, và shell làm gì với chuỗi của bạn</span><span class="lc-sub">/courses/linux-bash/learn${REF} — vì sao <code>echo mot echo hai</code> là MỘT lệnh với bốn tham số, và việc tách từ quyết định điều đó ra sao.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — What starts a run|||1.2 — Cái gì KHỞI ĐỘNG một lần chạy',
      slug: 'ga-1-2-kich-hoat',
      type: 'VIDEO',
      description: 'Mười một workflow trong kho này, và MƯỜI cái chỉ chạy khi có người bấm nút. Đó không phải lười — đó là một quyết định có ghi ngày, ra sau hai lần sập production thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>What starts a run</h2>
<p class="lead">The trigger block is the most consequential part of a workflow, and the easiest to get wrong in a way nobody notices for months. Here is the actual inventory of one repository.</p>

<h3>Eleven workflows, counted</h3>
<div class="out">backend-vps.yml          workflow_dispatch
ci-lint.yml              pull_request, push, workflow_dispatch
deploy-ghcr.yml          workflow_dispatch
desktop-release.yml      workflow_dispatch
e2e-message-button.yml   workflow_dispatch
fix-containers.yml       workflow_dispatch
full-deploy.yml          workflow_dispatch
guard-no-duplicates.yml  workflow_dispatch
restart-containers.yml   workflow_dispatch
sync-frontend.yml        workflow_dispatch
vps-cleanup-weekly.yml   schedule, workflow_dispatch</div>

<div class="callout warn">
<p><strong>Ten of eleven run only when a human presses a button.</strong> Exactly one workflow starts on a push. That looks like an under-automated repository until you read why — and the why is written down, with dates, because it cost two outages.</p>
</div>

<h3>Why the deploys stopped being automatic</h3>
<p>From this repository&#39;s own notes: two deploy workflows once both ran on every push to <code>main</code>, and they raced each other into production.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">2026-07-03</span><span class="lz-t">feed returning 500</span><span class="lz-d">the schema lagged behind the image — two pipelines finished in the wrong order</span></div>
<div class="lz-step"><span class="lz-k">2026-07-06</span><span class="lz-t">Exited(137) + orphan containers</span><span class="lz-d">a backend recreate race; recovered by hand with <code>docker start</code></span></div>
<div class="lz-step"><span class="lz-k">after</span><span class="lz-t">both moved to workflow_dispatch</span><span class="lz-d">"deploying stays a script you run, never a side effect of pushing"</span></div>
</div>

<p>Chapter 10 measures that decision properly. The point here is narrower and more useful: <strong>the trigger is a policy decision, not a formality.</strong> "Run on push" means "anybody who can push can start this", and if what it starts touches production, that is the same sentence as "anybody who can push can deploy".</p>

<h3>The triggers worth knowing</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">push</span><span class="lz-lnote">a commit reached a branch or tag. Supports <code>branches</code>, <code>branches-ignore</code>, <code>tags</code>, <code>paths</code>, <code>paths-ignore</code></span></div>
<div class="lz-layer"><span class="lz-lname">pull_request</span><span class="lz-lnote">a PR was opened, updated, reopened or retargeted. Runs against a <em>merge commit</em>, not your branch — 1.4 measures why that matters</span></div>
<div class="lz-layer"><span class="lz-lname">workflow_dispatch</span><span class="lz-lnote">a human pressed Run workflow, or something called the API. Can declare typed <code>inputs</code>, which is how a deploy workflow asks "which environment?"</span></div>
<div class="lz-layer"><span class="lz-lname">schedule</span><span class="lz-lnote">cron, in UTC. 1.3 measures how punctual it actually is, and the answer will change how you use it</span></div>
<div class="lz-layer"><span class="lz-lname">workflow_run</span><span class="lz-lnote">another workflow finished. The way to chain "test" into "deploy" without merging them into one file</span></div>
<div class="lz-layer"><span class="lz-lname">release, issues, issue_comment…</span><span class="lz-lnote">roughly thirty more. Useful, and each has its own filter vocabulary</span></div>
</div>

<h3>The default that surprises people</h3>
<pre><code>on:
  pull_request:      <span class="tok-comment"># khong noi 'types' → mac dinh la ba loai</span>
    branches: [main]</code></pre>

<p>Written like that, <code>pull_request</code> fires on <strong>opened</strong>, <strong>synchronize</strong> and <strong>reopened</strong> — and <em>not</em> on the many other things that happen to a PR. Adding a label does not trigger it. Neither does a review, a comment, or converting from draft. If you want those you must say so:</p>

<pre><code>on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review, labeled]</code></pre>

<div class="pitfall">
<p><strong>Trap — <code>synchronize</code> is the one that fires on every new commit, and it is easy to remove by accident.</strong> The moment you write an explicit <code>types:</code> list you have taken responsibility for the whole list. Writing <code>types: [opened]</code> because you wanted to add something gives you a workflow that checks the first commit of a PR and never looks at it again — every subsequent push goes unchecked while the PR still shows a green tick from the first run. This is one of the quietest ways to lose CI coverage.</p>
</div>

<h3>Multiple triggers in one file</h3>
<p>A workflow can have several, and each carries its own filters — which is exactly where <code>ci-lint.yml</code>&#39;s asymmetry came from (0.3):</p>

<pre><code>on:
  pull_request:
    branches: [main]          <span class="tok-comment"># KHONG co paths</span>
  push:
    branches: [main]
    paths: ['src/**', …]      <span class="tok-comment"># CO paths</span>
  workflow_dispatch: {}</code></pre>

<p>Three independent entry points into the same jobs. A README-only commit skips CI when pushed and runs CI when it arrives as a PR. Neither behaviour is wrong; not knowing which you have is.</p>

<div class="callout ok">
<p><strong>Read your trigger block out loud as a sentence.</strong> "This runs when a PR targeting main is opened or updated, <em>or</em> when a commit lands on main that touches source, <em>or</em> when someone presses the button." If the sentence surprises you, the file is not doing what you think. It takes ten seconds and it is the cheapest audit in this course.</p>
</div>

<h3>workflow_dispatch, and its inputs</h3>
<p>An empty <code>{}</code> means no inputs. Declaring them turns a workflow into a form:</p>

<pre><code>on:
  workflow_dispatch:
    inputs:
      moi_truong:
        description: 'Moi truong dich'
        required: true
        default: 'staging'
        type: choice
        options: [staging, production]
      bo_qua_test:
        type: boolean
        default: false</code></pre>

<p>Which gives you a dropdown in the UI, and <code>\${{ inputs.moi_truong }}</code> inside the run. This is the mechanism that lets a deploy be deliberate — a human chooses the target and the moment — while still being one button rather than a checklist somebody follows from memory.</p>

<div class="pitfall">
<p><strong>Trap — a boolean input arrives as a <em>string</em>.</strong> <code>type: boolean</code> produces the text <code>'true'</code> or <code>'false'</code> in the expression context, so <code>if: inputs.bo_qua_test</code> is truthy for <em>both</em> values, because a non-empty string is truthy. Write <code>if: inputs.bo_qua_test == 'true'</code>. Chapter 3 measures the expression rules that make this happen; it catches almost everybody once.</p>
</div>

<h3>What starts nothing</h3>
<div class="kv-grid">
<div class="kv"><span class="k">a workflow file on a branch</span><span class="v">for <code>push</code> and <code>pull_request</code>, GitHub uses the workflow file from the branch being pushed. A new workflow added on a feature branch does run on that branch</span></div>
<div class="kv"><span class="k">but <code>schedule</code> only runs from the default branch</span><span class="v">adding a cron on a feature branch schedules nothing, ever, and there is no warning</span></div>
<div class="kv"><span class="k">and <code>workflow_dispatch</code> needs to be on the default branch first</span><span class="v">before the Run workflow button appears at all. A dispatch-only workflow on a feature branch is invisible in the UI</span></div>
<div class="kv"><span class="k">a push by a workflow</span><span class="v">using <code>GITHUB_TOKEN</code> does <strong>not</strong> trigger another workflow — deliberate, to prevent infinite loops. Chapter 7 covers the consequences</span></div>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows — every event, its default activity types, and which filters it supports. The table is the reference for this whole lesson.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Manually running a workflow</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/manually-running-a-workflow — <code>workflow_dispatch</code> inputs, the API endpoint behind the button, and the default-branch requirement.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Triggering a workflow from a workflow</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/triggering-a-workflow#triggering-a-workflow-from-a-workflow — the normative statement that <code>GITHUB_TOKEN</code> pushes do not cascade, and what to use when you need them to.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — branches, pull requests, and what a push actually is</span><span class="lc-sub">/courses/git/learn${REF} — the vocabulary every trigger in this lesson is built on.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Cái gì KHỞI ĐỘNG một lần chạy</h2>
<p class="lead">Khối kích hoạt là phần nặng ký nhất của một workflow, và dễ viết sai nhất theo kiểu chẳng ai nhận ra suốt nhiều tháng. Đây là bản kiểm kê THẬT của một kho.</p>

<h3>Mười một workflow, đếm ra</h3>
<div class="out">backend-vps.yml          workflow_dispatch
ci-lint.yml              pull_request, push, workflow_dispatch
deploy-ghcr.yml          workflow_dispatch
desktop-release.yml      workflow_dispatch
e2e-message-button.yml   workflow_dispatch
fix-containers.yml       workflow_dispatch
full-deploy.yml          workflow_dispatch
guard-no-duplicates.yml  workflow_dispatch
restart-containers.yml   workflow_dispatch
sync-frontend.yml        workflow_dispatch
vps-cleanup-weekly.yml   schedule, workflow_dispatch</div>

<div class="callout warn">
<p><strong>Mười trên mười một chỉ chạy khi có NGƯỜI bấm nút.</strong> Đúng MỘT workflow khởi động khi push. Nhìn thì tưởng đây là một kho lười tự động hoá, cho tới khi bạn đọc LÝ DO — và lý do đó được ghi lại, có ngày tháng, vì nó đã tốn HAI lần sập.</p>
</div>

<h3>Vì sao các lần deploy THÔI tự động</h3>
<p>Trích ghi chú của chính kho này: hai workflow deploy từng cùng chạy ở MỌI lần push vào <code>main</code>, và chúng giẫm lên nhau ngay trên production.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">03/07/2026</span><span class="lz-t">bảng tin trả 500</span><span class="lz-d">lược đồ tụt lại sau cái ảnh — hai đường ống về đích SAI THỨ TỰ</span></div>
<div class="lz-step"><span class="lz-k">06/07/2026</span><span class="lz-t">Exited(137) + container mồ côi</span><span class="lz-d">một cuộc đua khi tạo lại backend; cứu bằng tay với <code>docker start</code></span></div>
<div class="lz-step"><span class="lz-k">sau đó</span><span class="lz-t">cả hai chuyển sang workflow_dispatch</span><span class="lz-d">"deploy vẫn là một script BẠN chạy, không bao giờ là tác dụng phụ của việc push"</span></div>
</div>

<p>Chương 10 đem quyết định đó ra đo cho đàng hoàng. Điểm ở đây hẹp hơn và hữu dụng hơn: <strong>bộ kích hoạt là một quyết định CHÍNH SÁCH, không phải một thủ tục.</strong> "Chạy khi push" nghĩa là "AI push được thì khởi động được cái này", và nếu cái nó khởi động đụng tới production, thì đó là cùng một câu với "ai push được thì deploy được".</p>

<h3>Những bộ kích hoạt đáng biết</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">push</span><span class="lz-lnote">một commit tới được một nhánh hay một thẻ. Hỗ trợ <code>branches</code>, <code>branches-ignore</code>, <code>tags</code>, <code>paths</code>, <code>paths-ignore</code></span></div>
<div class="lz-layer"><span class="lz-lname">pull_request</span><span class="lz-lnote">một PR được mở, cập nhật, mở lại hay đổi đích. Chạy trên một <em>COMMIT GỘP</em>, không phải nhánh của bạn — bài 1.4 đo vì sao chuyện đó quan trọng</span></div>
<div class="lz-layer"><span class="lz-lname">workflow_dispatch</span><span class="lz-lnote">một người bấm Run workflow, hoặc có thứ gì đó gọi API. Khai báo được <code>inputs</code> có kiểu, và đó là cách một workflow deploy hỏi "môi trường nào?"</span></div>
<div class="lz-layer"><span class="lz-lname">schedule</span><span class="lz-lnote">cron, theo UTC. Bài 1.3 đo xem nó ĐÚNG GIỜ tới đâu, và câu trả lời sẽ đổi cách bạn dùng nó</span></div>
<div class="lz-layer"><span class="lz-lname">workflow_run</span><span class="lz-lnote">một workflow khác vừa xong. Cách nối "kiểm thử" vào "deploy" mà không gộp chúng thành một tệp</span></div>
<div class="lz-layer"><span class="lz-lname">release, issues, issue_comment…</span><span class="lz-lnote">khoảng ba mươi cái nữa. Hữu dụng, và mỗi cái có bộ từ vựng lọc riêng</span></div>
</div>

<h3>Cái mặc định làm người ta bất ngờ</h3>
<pre><code>on:
  pull_request:      <span class="tok-comment"># khong noi 'types' → mac dinh la ba loai</span>
    branches: [main]</code></pre>

<p>Viết như thế, <code>pull_request</code> nổ khi <strong>opened</strong>, <strong>synchronize</strong> và <strong>reopened</strong> — và <em>KHÔNG</em> nổ với hàng loạt chuyện khác xảy ra với một PR. Gắn nhãn thì không kích hoạt. Cũng không có review, không có bình luận, không có chuyện chuyển từ nháp. Muốn có mấy cái đó thì phải NÓI RA:</p>

<pre><code>on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review, labeled]</code></pre>

<div class="pitfall">
<p><strong>Bẫy — <code>synchronize</code> là cái nổ ở MỖI commit mới, và nó dễ bị gỡ đi một cách vô tình.</strong> Khoảnh khắc bạn viết một danh sách <code>types:</code> tường minh là bạn đã nhận trách nhiệm cho TOÀN BỘ danh sách. Viết <code>types: [opened]</code> vì bạn muốn THÊM một thứ gì đó sẽ cho bạn một workflow kiểm commit ĐẦU TIÊN của một PR rồi chẳng bao giờ nhìn lại — mọi cú push sau đó không được kiểm trong khi PR vẫn hiện một dấu tích xanh từ lần chạy đầu. Đây là một trong những cách ÂM THẦM NHẤT để mất độ phủ CI.</p>
</div>

<h3>Nhiều bộ kích hoạt trong một tệp</h3>
<p>Một workflow có thể có vài cái, và MỖI CÁI mang bộ lọc riêng — mà đó chính xác là chỗ sự bất đối xứng của <code>ci-lint.yml</code> tới từ (bài 0.3):</p>

<pre><code>on:
  pull_request:
    branches: [main]          <span class="tok-comment"># KHONG co paths</span>
  push:
    branches: [main]
    paths: ['src/**', …]      <span class="tok-comment"># CO paths</span>
  workflow_dispatch: {}</code></pre>

<p>Ba lối vào ĐỘC LẬP dẫn tới cùng những job đó. Một commit chỉ-README bỏ qua CI khi được push và chạy CI khi tới dưới dạng PR. Không hành vi nào là SAI; không BIẾT mình đang có hành vi nào mới là sai.</p>

<div class="callout ok">
<p><strong>Hãy ĐỌC TO khối kích hoạt của bạn thành một câu.</strong> "Cái này chạy khi một PR nhắm vào main được mở hoặc cập nhật, <em>HOẶC</em> khi một commit đáp xuống main mà nó đụng vào mã nguồn, <em>HOẶC</em> khi có người bấm nút." Nếu cái câu đó làm bạn bất ngờ thì tệp đang không làm cái bạn nghĩ. Nó tốn mười giây và là lần soi rẻ nhất trong cả khoá này.</p>
</div>

<h3>workflow_dispatch, và tham số của nó</h3>
<p>Một cái <code>{}</code> rỗng nghĩa là không có tham số. Khai báo chúng thì biến một workflow thành một cái BIỂU MẪU:</p>

<pre><code>on:
  workflow_dispatch:
    inputs:
      moi_truong:
        description: 'Moi truong dich'
        required: true
        default: 'staging'
        type: choice
        options: [staging, production]
      bo_qua_test:
        type: boolean
        default: false</code></pre>

<p>Cái đó cho bạn một ô thả xuống trên giao diện, và <code>\${{ inputs.moi_truong }}</code> bên trong lúc chạy. Đây là cơ chế cho phép một lần deploy trở nên CÓ CHỦ ĐÍCH — một con người chọn cái đích và chọn thời điểm — mà vẫn là MỘT cái nút chứ không phải một danh sách việc ai đó làm theo trí nhớ.</p>

<div class="pitfall">
<p><strong>Bẫy — một tham số boolean tới nơi dưới dạng một <em>CHUỖI</em>.</strong> <code>type: boolean</code> đẻ ra chữ <code>'true'</code> hoặc <code>'false'</code> trong ngữ cảnh biểu thức, nên <code>if: inputs.bo_qua_test</code> là ĐÚNG với <em>CẢ HAI</em> giá trị, vì một chuỗi không rỗng thì luôn đúng. Hãy viết <code>if: inputs.bo_qua_test == 'true'</code>. Chương 3 đo các luật biểu thức làm chuyện này xảy ra; nó tóm được gần như tất cả mọi người, một lần.</p>
</div>

<h3>Thứ KHÔNG khởi động gì cả</h3>
<div class="kv-grid">
<div class="kv"><span class="k">một tệp workflow trên một nhánh</span><span class="v">với <code>push</code> và <code>pull_request</code>, GitHub dùng tệp workflow TỪ CHÍNH cái nhánh đang được push. Một workflow mới thêm trên nhánh tính năng thì CÓ chạy trên nhánh đó</span></div>
<div class="kv"><span class="k">nhưng <code>schedule</code> chỉ chạy từ nhánh MẶC ĐỊNH</span><span class="v">thêm một cái cron trên nhánh tính năng thì chẳng lên lịch gì cả, KHÔNG BAO GIỜ, và không có cảnh báo nào</span></div>
<div class="kv"><span class="k">và <code>workflow_dispatch</code> phải có mặt trên nhánh mặc định TRƯỚC ĐÃ</span><span class="v">thì cái nút Run workflow mới hiện ra. Một workflow chỉ-dispatch nằm trên nhánh tính năng thì VÔ HÌNH trên giao diện</span></div>
<div class="kv"><span class="k">một cú push DO workflow thực hiện</span><span class="v">dùng <code>GITHUB_TOKEN</code> thì <strong>KHÔNG</strong> kích hoạt workflow khác — có chủ đích, để ngăn vòng lặp vô hạn. Chương 7 nói về hệ quả</span></div>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows — mọi sự kiện, các loại hoạt động mặc định của nó, và nó hỗ trợ bộ lọc nào. Cái bảng đó là tài liệu tham chiếu cho cả bài này.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Manually running a workflow</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/manually-running-a-workflow — tham số của <code>workflow_dispatch</code>, endpoint API nằm sau cái nút, và yêu cầu về nhánh mặc định.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Triggering a workflow from a workflow</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/triggering-a-workflow#triggering-a-workflow-from-a-workflow — phát biểu chuẩn tắc rằng các cú push bằng <code>GITHUB_TOKEN</code> KHÔNG lan truyền, và dùng gì khi bạn CẦN chúng lan truyền.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — nhánh, pull request, và một cú push thật ra là gì</span><span class="lc-sub">/courses/git/learn${REF} — bộ từ vựng mà mọi bộ kích hoạt trong bài này dựng lên trên đó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — schedule, and how late it actually is|||1.3 — schedule, và nó THẬT SỰ trễ tới đâu',
      slug: 'ga-1-3-lich-cron',
      type: 'VIDEO',
      description: 'Mười lần chạy theo lịch của kho này, cron đặt 03:00 UTC Chủ nhật. KHÔNG lần nào đúng giờ. Trễ ít nhất 41 phút, nhiều nhất 4 tiếng rưỡi, trung bình 2,6 tiếng — và có một xu hướng trong đó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2><code>schedule</code>, and how late it actually is</h2>
<p class="lead">The documentation says scheduled workflows "may be delayed during periods of high load". This lesson measures ten real runs of one cron over two months, and the answer is stronger than that sentence suggests.</p>

<h3>The workflow, and what it asks for</h3>
<pre><code>on:
  schedule:
    <span class="tok-comment"># Chay luc 3h sang UTC moi Chu nhat (= 10h sang VN)</span>
    - cron: '0 3 * * 0'</code></pre>

<p>Sunday, 03:00 UTC. Ten runs, from June to August, read back through the API:</p>

<div class="out">  lan | ngay       | gio THAT (UTC) | TRE
  ----+------------+----------------+--------
   12 | 2026-08-23 | 03:42:42       | +0h42m
    9 | 2026-08-16 | 03:40:56       | +0h40m
    8 | 2026-08-09 | 04:11:47       | +1h11m
    7 | 2026-08-02 | 05:48:11       | +2h48m
    6 | 2026-07-26 | 05:52:32       | +2h52m
    5 | 2026-07-19 | 05:43:19       | +2h43m
    4 | 2026-07-12 | 05:48:52       | +2h48m
    3 | 2026-07-05 | 06:33:20       | +3h33m
    2 | 2026-06-28 | 06:57:00       | +3h57m
    1 | 2026-06-21 | 07:28:18       | +4h28m

  n = 10 lan chay theo lich
  dung gio (tre < 1 phut): 0
  TRE it nhat   : 41 phut
  TRE nhieu nhat: 268 phut = 4,5 gio
  TRUNG BINH    : 155 phut = 2,6 gio
  TRUNG VI      : 169 phut</div>

<div class="callout warn">
<p><strong>Zero out of ten started on time.</strong> Not "usually on time with occasional delays" — <em>none</em> of them. The best was 41 minutes late and the worst was four and a half hours. If this cron had been "take a backup at 03:00 and alert if it has not finished by 04:00", it would have paged somebody on eight of ten Sundays for a reason that had nothing to do with the backup.</p>
</div>

<h3>There is a trend, and it is worth reading</h3>
<p>Look at the delays in date order rather than in the table&#39;s order: <strong>4h28m, 3h57m, 3h33m, 2h48m, 2h43m, 2h52m, 2h48m, 1h11m, 0h40m, 0h42m</strong>. June was consistently worse than August, and the improvement is monotone apart from noise in the middle.</p>

<p>That is a measurement of GitHub&#39;s queue, not of this repository — nothing about the workflow changed across those ten weeks. It also means the number you would have measured in June (about four hours) and the number you would measure today (about forty minutes) differ by a factor of six. <strong>Any specific delay figure has a shelf life.</strong> What does not expire is the shape: scheduled runs start late, by an amount you do not control and cannot predict.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">what cron means elsewhere</span><span class="lz-t">at 03:00</span><span class="lz-d">a Linux crontab fires within a second of the minute, every time</span></div>
<div class="lz-step"><span class="lz-k">what it means here</span><span class="lz-t">not before 03:00</span><span class="lz-d">a request to enter a queue, serviced when there is capacity</span></div>
</div>

<h3>The timezone, which is the other half</h3>
<p>GitHub runs cron in <strong>UTC</strong>. Not the repository owner&#39;s timezone, not the runner&#39;s, and with no daylight-saving adjustment:</p>

<div class="out">'0 0 * * *' = 00:00 UTC = 07:00 gio Viet Nam
'0 3 * * *' = 03:00 UTC = 10:00 gio Viet Nam
'0 17 * * *' = 17:00 UTC = 00:00 gio Viet Nam (hom sau)

→ muon chay 03:00 GIO VIET NAM thi phai viet '0 20 * * *'
  (20:00 UTC HOM TRUOC)</div>

<p>This repository&#39;s workflow gets it right and, more importantly, <em>writes the conversion in a comment</em> — <code># Chạy lúc 3h sáng UTC mỗi Chủ nhật (= 10h sáng VN)</code>. A cron expression is five numbers with no units and no timezone; the comment is the only place the intent can live.</p>

<div class="pitfall">
<p><strong>Trap — for a country that observes daylight saving, one cron cannot mean one local time all year.</strong> UTC does not shift; local time does. A job scheduled for 09:00 local runs at 09:00 for half the year and 08:00 or 10:00 for the other half, and switches on a date nobody wrote down. Vietnam does not observe DST so this repository is unaffected — but if your team is in Europe or North America, the "why did the report arrive an hour early in March" question has this answer.</p>
</div>

<h3>What this measurement should change</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">do not schedule anything time-critical</span><span class="lz-lnote">"publish at 09:00" is not something <code>schedule</code> can promise. Publish from a workflow the moment the thing is ready instead</span></div>
<div class="lz-layer"><span class="lz-lname">do not alert on "did not finish by X"</span><span class="lz-lnote">measured: that alarm would have fired on 8 of 10 Sundays. Alert on "has not run in more than 8 days" instead — a dead-man&#39;s switch, which is the shape Chapter 9 argues for</span></div>
<div class="lz-layer"><span class="lz-lname">do not chain two crons</span><span class="lz-lnote">"A at 03:00, B at 04:00, B needs A" is a coin flip. Make B depend on A finishing, with <code>workflow_run</code></span></div>
<div class="lz-layer"><span class="lz-lname">do keep <code>workflow_dispatch</code> alongside</span><span class="lz-lnote">this repository does. When the schedule is four hours late and you need it now, the button is the answer</span></div>
<div class="lz-layer"><span class="lz-lname">do make the job idempotent</span><span class="lz-lnote">a cleanup that runs at 03:42 instead of 03:00 should not care. If it does care, the delay is not your real problem</span></div>
</div>

<h3>The other way schedules die: silently</h3>
<p>Two rules that produce no error message:</p>

<div class="kv-grid">
<div class="kv"><span class="k">only the default branch</span><span class="v">a <code>schedule:</code> on a feature branch schedules nothing. No warning, no run, no way to tell from the Actions tab</span></div>
<div class="kv"><span class="k">disabled after 60 days of inactivity</span><span class="v">GitHub turns off scheduled workflows in public repositories with no commits for 60 days, and emails the owner. A quiet repository stops running its own maintenance</span></div>
<div class="kv"><span class="k">the shortest interval is 5 minutes</span><span class="v">and given the measured delays, treating <code>*/5</code> as "every five minutes" is optimistic</span></div>
<div class="kv"><span class="k">no run means no record</span><span class="v">the Actions tab shows runs that happened. It cannot show you a run that was never queued, which is why the dead-man&#39;s switch matters</span></div>
</div>

<div class="callout ok">
<p><strong>The rule this lesson buys.</strong> <code>schedule</code> answers "roughly daily" or "roughly weekly", and it answers that well — this cleanup job has run every Sunday for two months without anybody touching it. It does not answer "at 03:00". If your requirement contains a clock time that matters, <code>schedule</code> is the wrong mechanism and no amount of tuning the cron expression will change that.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows: schedule</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule — the UTC statement, the five-minute minimum, the default-branch rule, and the 60-day disable. The delay warning is one sentence; this lesson is what it looks like measured.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">crontab(5)</span><span class="lc-sub">man 5 crontab — the five fields, the ranges, and the step syntax <code>*/n</code>. GitHub accepts POSIX cron syntax but not the <code>@yearly</code>-style shortcuts.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">crontab.guru</span><span class="lc-sub">crontab.guru — reads an expression back in English. Worth pasting into before committing, because <code>'0 3 * * 0'</code> and <code>'0 3 0 * *'</code> look similar and mean very different things.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — alerting on absence, not on threshold</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the dead-man&#39;s-switch pattern this lesson recommends, measured against a threshold alarm on the same data.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2><code>schedule</code>, và nó THẬT SỰ trễ tới đâu</h2>
<p class="lead">Tài liệu nói các workflow theo lịch "có thể bị trễ trong những lúc tải cao". Bài này đo MƯỜI lần chạy thật của một cái cron suốt hai tháng, và câu trả lời mạnh hơn cái câu đó gợi ý.</p>

<h3>Workflow, và nó yêu cầu gì</h3>
<pre><code>on:
  schedule:
    <span class="tok-comment"># Chay luc 3h sang UTC moi Chu nhat (= 10h sang VN)</span>
    - cron: '0 3 * * 0'</code></pre>

<p>Chủ nhật, 03:00 UTC. Mười lần chạy, từ tháng 6 tới tháng 8, đọc ngược về qua API:</p>

<div class="out">  lan | ngay       | gio THAT (UTC) | TRE
  ----+------------+----------------+--------
   12 | 2026-08-23 | 03:42:42       | +0h42m
    9 | 2026-08-16 | 03:40:56       | +0h40m
    8 | 2026-08-09 | 04:11:47       | +1h11m
    7 | 2026-08-02 | 05:48:11       | +2h48m
    6 | 2026-07-26 | 05:52:32       | +2h52m
    5 | 2026-07-19 | 05:43:19       | +2h43m
    4 | 2026-07-12 | 05:48:52       | +2h48m
    3 | 2026-07-05 | 06:33:20       | +3h33m
    2 | 2026-06-28 | 06:57:00       | +3h57m
    1 | 2026-06-21 | 07:28:18       | +4h28m

  n = 10 lan chay theo lich
  dung gio (tre < 1 phut): 0
  TRE it nhat   : 41 phut
  TRE nhieu nhat: 268 phut = 4,5 gio
  TRUNG BINH    : 155 phut = 2,6 gio
  TRUNG VI      : 169 phut</div>

<div class="callout warn">
<p><strong>KHÔNG trên mười lần bắt đầu đúng giờ.</strong> Không phải "thường đúng giờ, thỉnh thoảng trễ" — <em>KHÔNG CÁI NÀO</em>. Tốt nhất là trễ 41 phút và tệ nhất là bốn tiếng rưỡi. Nếu cái cron này từng là "sao lưu lúc 03:00 và báo động nếu chưa xong trước 04:00", thì nó đã gọi điện đánh thức ai đó vào TÁM trên mười Chủ nhật vì một lý do chẳng liên quan gì tới việc sao lưu.</p>
</div>

<h3>Có một XU HƯỚNG, và nó đáng đọc</h3>
<p>Nhìn các độ trễ theo thứ tự NGÀY thay vì theo thứ tự trong bảng: <strong>4h28m, 3h57m, 3h33m, 2h48m, 2h43m, 2h52m, 2h48m, 1h11m, 0h40m, 0h42m</strong>. Tháng 6 tệ hơn tháng 8 một cách nhất quán, và mức cải thiện là ĐƠN ĐIỆU trừ chút nhiễu ở khúc giữa.</p>

<p>Đó là một phép đo về HÀNG ĐỢI CỦA GITHUB, không phải về cái kho này — chẳng có gì trong workflow thay đổi suốt mười tuần ấy. Nó cũng có nghĩa là con số bạn đo được hồi tháng 6 (khoảng bốn tiếng) và con số bạn đo hôm nay (khoảng bốn mươi phút) chênh nhau SÁU LẦN. <strong>Mọi con số độ trễ cụ thể đều có hạn sử dụng.</strong> Thứ KHÔNG hết hạn là cái HÌNH DẠNG: các lần chạy theo lịch bắt đầu MUỘN, muộn một lượng bạn không kiểm soát được và không dự đoán được.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">cron nghĩa là gì ở nơi khác</span><span class="lz-t">LÚC 03:00</span><span class="lz-d">một crontab Linux nổ trong vòng một giây kể từ phút đó, mọi lần</span></div>
<div class="lz-step"><span class="lz-k">nó nghĩa là gì ở đây</span><span class="lz-t">KHÔNG SỚM HƠN 03:00</span><span class="lz-d">một lời xin vào hàng đợi, được phục vụ khi có chỗ</span></div>
</div>

<h3>Múi giờ, nửa còn lại của vấn đề</h3>
<p>GitHub chạy cron theo <strong>UTC</strong>. Không theo múi giờ của chủ kho, không theo múi giờ của runner, và KHÔNG điều chỉnh theo giờ mùa hè:</p>

<div class="out">'0 0 * * *' = 00:00 UTC = 07:00 gio Viet Nam
'0 3 * * *' = 03:00 UTC = 10:00 gio Viet Nam
'0 17 * * *' = 17:00 UTC = 00:00 gio Viet Nam (hom sau)

→ muon chay 03:00 GIO VIET NAM thi phai viet '0 20 * * *'
  (20:00 UTC HOM TRUOC)</div>

<p>Workflow của kho này làm đúng, và quan trọng hơn, nó <em>GHI PHÉP QUY ĐỔI RA CHÚ THÍCH</em> — <code># Chạy lúc 3h sáng UTC mỗi Chủ nhật (= 10h sáng VN)</code>. Một biểu thức cron là năm con số không có đơn vị và không có múi giờ; cái chú thích là NƠI DUY NHẤT ý định có thể sống.</p>

<div class="pitfall">
<p><strong>Bẫy — với một nước có giờ mùa hè, MỘT cái cron không thể có nghĩa là MỘT giờ địa phương suốt cả năm.</strong> UTC không dịch; giờ địa phương thì có. Một tác vụ hẹn 09:00 giờ địa phương sẽ chạy lúc 09:00 trong nửa năm và 08:00 hoặc 10:00 trong nửa còn lại, và nó chuyển vào một ngày chẳng ai ghi lại. Việt Nam không dùng giờ mùa hè nên kho này không dính — nhưng nếu đội của bạn ở châu Âu hay Bắc Mỹ, thì câu hỏi "sao báo cáo tới sớm một tiếng hồi tháng Ba" có câu trả lời ở đây.</p>
</div>

<h3>Phép đo này nên đổi điều gì</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">ĐỪNG lên lịch thứ gì phụ thuộc THỜI ĐIỂM</span><span class="lz-lnote">"đăng lúc 09:00" không phải thứ <code>schedule</code> hứa được. Hãy đăng từ một workflow NGAY KHI thứ đó sẵn sàng, thay vì thế</span></div>
<div class="lz-layer"><span class="lz-lname">ĐỪNG báo động theo kiểu "chưa xong trước giờ X"</span><span class="lz-lnote">đo thật: cái báo động đó đã nổ vào 8 trên 10 Chủ nhật. Hãy báo động theo kiểu "chưa chạy suốt hơn 8 ngày" — một công tắc người chết, đúng hình dạng mà Chương 9 lập luận</span></div>
<div class="lz-layer"><span class="lz-lname">ĐỪNG nối hai cái cron với nhau</span><span class="lz-lnote">"A lúc 03:00, B lúc 04:00, B cần A" là tung đồng xu. Hãy làm cho B phụ thuộc vào việc A KẾT THÚC, bằng <code>workflow_run</code></span></div>
<div class="lz-layer"><span class="lz-lname">HÃY giữ <code>workflow_dispatch</code> đi kèm</span><span class="lz-lnote">kho này có làm thế. Khi lịch trễ bốn tiếng và bạn cần nó NGAY, cái nút là câu trả lời</span></div>
<div class="lz-layer"><span class="lz-lname">HÃY làm cho tác vụ BẤT BIẾN theo số lần chạy</span><span class="lz-lnote">một cú dọn dẹp chạy lúc 03:42 thay vì 03:00 thì KHÔNG nên bận tâm. Nếu nó có bận tâm, thì độ trễ không phải vấn đề thật của bạn</span></div>
</div>

<h3>Cách khác mà lịch chết: ÂM THẦM</h3>
<p>Hai quy tắc không đẻ ra dòng báo lỗi nào:</p>

<div class="kv-grid">
<div class="kv"><span class="k">chỉ nhánh MẶC ĐỊNH</span><span class="v">một <code>schedule:</code> trên nhánh tính năng thì chẳng lên lịch gì. Không cảnh báo, không lần chạy nào, không có cách nào biết được từ tab Actions</span></div>
<div class="kv"><span class="k">bị TẮT sau 60 ngày không hoạt động</span><span class="v">GitHub tắt các workflow theo lịch trong kho công khai không có commit nào suốt 60 ngày, và gửi email cho chủ kho. Một cái kho im ắng sẽ thôi chạy chính phần bảo trì của nó</span></div>
<div class="kv"><span class="k">khoảng ngắn nhất là 5 phút</span><span class="v">và với các độ trễ đã đo, coi <code>*/5</code> là "mỗi năm phút" thì hơi lạc quan</span></div>
<div class="kv"><span class="k">không chạy thì không có bản ghi</span><span class="v">tab Actions hiện những lần chạy ĐÃ XẢY RA. Nó không thể cho bạn xem một lần chạy chưa bao giờ được xếp hàng, và đó là lý do công tắc người chết quan trọng</span></div>
</div>

<div class="callout ok">
<p><strong>Quy tắc bài này mua được.</strong> <code>schedule</code> trả lời câu "đại khái hằng ngày" hoặc "đại khái hằng tuần", và nó trả lời TỐT — cái tác vụ dọn dẹp này đã chạy mỗi Chủ nhật suốt hai tháng mà không ai phải đụng tới. Nó KHÔNG trả lời câu "lúc 03:00". Nếu yêu cầu của bạn chứa một giờ đồng hồ CÓ Ý NGHĨA, thì <code>schedule</code> là cơ chế SAI và không có mức tinh chỉnh biểu thức cron nào đổi được điều đó.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows: schedule</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule — phát biểu về UTC, mức tối thiểu năm phút, luật nhánh mặc định, và cú tắt sau 60 ngày. Lời cảnh báo về độ trễ chỉ có MỘT câu; bài này là hình dạng của nó khi đem đi ĐO.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">crontab(5)</span><span class="lc-sub">man 5 crontab — năm trường, các khoảng, và cú pháp bước <code>*/n</code>. GitHub nhận cú pháp cron POSIX nhưng KHÔNG nhận các lối viết tắt kiểu <code>@yearly</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">crontab.guru</span><span class="lc-sub">crontab.guru — đọc ngược một biểu thức ra tiếng Anh. Đáng dán vào đó trước khi commit, vì <code>'0 3 * * 0'</code> và <code>'0 3 0 * *'</code> trông giống nhau mà nghĩa rất khác nhau.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — báo động theo SỰ VẮNG MẶT, không theo ngưỡng</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — khuôn mẫu công-tắc-người-chết mà bài này khuyên dùng, đo đối chiếu với một báo động ngưỡng trên cùng bộ dữ liệu.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — pull_request runs on a commit that is not on your branch|||1.4 — pull_request chạy trên một commit KHÔNG nằm trên nhánh bạn',
      slug: 'ga-1-4-merge-commit',
      type: 'VIDEO',
      description: 'Đo thật: nhánh PR xanh, main xanh, gộp không xung đột — và CI vẫn ĐỎ. Vì `pull_request` không chạy trên nhánh bạn, nó chạy trên một merge commit không tồn tại ở đâu cả. Cộng ba tổ hợp `pull_request_target` và cái nào rò bí mật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2><code>pull_request</code> runs on a commit that is not on your branch</h2>
<p class="lead">You push a branch, open a PR, and CI goes green. It is natural to read that tick as "my branch passes". It does not say that. It says something narrower and more useful, and the gap between the two is where a whole class of broken-main incidents lives.</p>

<h3>The question, stated precisely</h3>
<p>When a <code>pull_request</code> event fires and <code>actions/checkout</code> runs, <strong>which commit ends up in the working directory?</strong> Three candidates look plausible:</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">candidate</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">the tip of my branch</span><span class="lz-nsub">what I pushed, what I tested locally, what the PR page shows as the latest commit</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">the tip of the base branch</span><span class="lz-nsub">main as it stands now, without my changes at all</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">a merge of the two</span><span class="lz-nsub">a commit nobody wrote, that exists on no branch, created by GitHub for this purpose</span></div></div>
</div>
</div>

<p>It is the third one. GitHub computes <code>git merge --no-ff</code> of your branch into the base and publishes the result as <code>refs/pull/&lt;N&gt;/merge</code>. That commit is what the job checks out, and its SHA is what <code>\${{ github.sha }}</code> holds.</p>

<h3>Why that distinction is not academic</h3>
<p>Here is a rig built to make the difference visible. Base branch has a function and a test for it. The PR branch <strong>adds one new file</strong> and its own test — it does not touch a single file that the base branch touches. Meanwhile the base branch changes that function&#39;s signature and updates <em>its own</em> test to match:</p>

<pre><code><span class="tok-comment"># main: chu ky cu</span>
function calc(a, b) { return a + b; }

<span class="tok-comment"># nhanh PR: CHI THEM file moi, goi ham theo chu ky cu</span>
function orderTotal(x, y) { return calc(x, y); }

<span class="tok-comment"># main (trong luc do): doi chu ky, va sua test CUA CHINH NO</span>
function calc({ a, b }) { return a + b; }</code></pre>

<p>No file is edited on both sides, so the merge is textually clean. Now run the same test suite in each of the three places:</p>

<div class="out">######## A. CHAY TREN DAU NHANH PR (cai ban thay o local) ########
  xanh: thu-bao-cao
  xanh: thu-tinh
CI XANH
exit=0

######## B. CHAY TREN MAIN (khong co PR) ########
  xanh: thu-tinh
CI XANH
exit=0

######## C. MERGE COMMIT — cai ma pull_request THUC SU chay ########
gop: SACH, khong xung dot
GITHUB_SHA      = ebf646c58c6dfcf24ba494d6d7fca4e16f914698
  ^1 (base)     = 4455dae17852942087937e976f117b6b465f6407
  ^2 (dau PR)   = f1f968b0ebb224829e605d94db8c9d2636937728
  HONG: thu-bao-cao.js - tongDon(10,20) = NaN, mong doi 30
  xanh: thu-tinh
CI DO (1 hong)
exit=1</div>

<div class="callout warn">
<p><strong>Both branches are green. The merge has no conflict. The result is red.</strong> There is no version-control operation that could have warned you: git&#39;s job is to reconcile <em>text</em>, and the text reconciled perfectly. What broke is a contract between two files that were never edited together. Only running the merged tree can find it, and running the merged tree is exactly what <code>pull_request</code> does.</p>
</div>

<p>Read the SHAs in block C again. The merge commit has <strong>two parents</strong>, and the interesting one is that neither parent is the commit you would have guessed:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">^1</span><span class="lz-t">4455dae1 — the base</span><span class="lz-d">the tip of <code>main</code> at the moment the merge ref was computed</span></div>
<div class="lz-step"><span class="lz-k">^2</span><span class="lz-t">f1f968b0 — your branch</span><span class="lz-d">the commit the PR page displays, the one you pushed</span></div>
<div class="lz-step"><span class="lz-k">itself</span><span class="lz-t">ebf646c5 — GITHUB_SHA</span><span class="lz-d">on no branch, in nobody&#39;s local clone, and it is the thing CI judged</span></div>
</div>

<h3>The SHA the API shows you is not the SHA the job saw</h3>
<p>This is where the confusion becomes concrete. Ask the API about a real <code>pull_request</code> run from this repository and compare it with the PR itself:</p>

<div class="out">run 27990511412 (PR #4) head_sha = 3220149d38388b8f8173e1e2d9312ae7739860a6
PR #4 head.sha (API)             = 3220149d38388b8f8173e1e2d9312ae7739860a6  <- GIONG NHAU
PR #4 mergeable_state            = unknown  <- GitHub tinh LUOI, chi tinh khi co nguoi HOI</div>

<p>The run&#39;s <code>head_sha</code> equals the PR&#39;s head. So every tool that reads the API — dashboards, badges, bots, your own scripts — reports the run as being <em>about</em> your branch tip. Inside the job, <code>\${{ github.sha }}</code> is a different SHA entirely, and it appears nowhere in the run&#39;s API record. Two coherent views of the same run that disagree about what was tested.</p>

<div class="kv-grid">
<div class="kv"><span class="k">want the merge commit</span><span class="v"><code>\${{ github.sha }}</code> — the default, what checkout takes with no <code>ref:</code></span></div>
<div class="kv"><span class="k">want your branch tip</span><span class="v"><code>\${{ github.event.pull_request.head.sha }}</code> — pass it as <code>ref:</code> explicitly</span></div>
<div class="kv"><span class="k">want the base tip</span><span class="v"><code>\${{ github.event.pull_request.base.sha }}</code></span></div>
<div class="kv"><span class="k">want the branch NAME</span><span class="v"><code>\${{ github.head_ref }}</code>. <code>\${{ github.ref }}</code> on a PR is <code>refs/pull/&lt;N&gt;/merge</code>, which is not a branch and will surprise anything that string-matches it</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — tagging or publishing with <code>github.sha</code> on a PR run.</strong> A step that does <code>docker build -t app:\${{ github.sha }}</code> produces, on a PR, an image tagged with a merge commit that will never exist again once the PR updates. It is not reproducible, not reachable from any branch, and after the PR merges the tag corresponds to nothing. On PR runs tag with <code>head.sha</code>, or do not publish from PR runs at all.</p>
</div>

<h3>When the merge does not exist, nothing runs — and nothing says so</h3>
<p>Same rig, one change: let both sides edit the same file so the merge genuinely conflicts.</p>

<div class="out">Auto-merging thu.js
CONFLICT (content): Merge conflict in thu.js
Automatic merge failed; fix conflicts and then commit the result.

git rev-parse HEAD -> van la main, KHONG co commit nao duoc tao</div>

<p>There is no merge commit to check out, so GitHub queues no run. The consequence on the PR page is specific and worth recognising on sight: the check does not go red. It does not go green. It sits at <strong>"Expected — Waiting for status to be reported"</strong>, indefinitely, and if it is a required check the PR is unmergeable with no failure to click into.</p>

<div class="callout">
<p><strong>The recognition rule.</strong> A check that is <em>pending forever</em> on a PR is almost never a stuck runner. It is one of three things: a merge conflict (no merge ref to run against), a path or branch filter that excluded this PR (lesson 1.5), or a required check whose workflow no longer exists. All three are configuration, and none of them will produce a log to read.</p>
</div>

<h3>How much a green tick can go stale</h3>
<p>PR #4 in this repository is still open. Its last CI run was a success. Here is what has happened to the base branch underneath it since:</p>

<div class="out">PR #4: mo 22/06/2026, base luc do = dda544e7, dau nhanh = 3220149d
lan chay ci-lint cuoi: 27990511412, 22/06/2026, ket qua: success

main tu do toi nay (24/08/2026) da di them:
  1527 commit
  5315 file thay doi
  +1.214.424 / -14.703 dong</div>

<div class="callout warn">
<p><strong>That green tick was computed against a merge commit whose base half is now 1,527 commits old.</strong> It is not wrong — it faithfully reports that the merge <em>as of 22 June</em> was fine. It simply has nothing to say about merging this PR today. And <code>mergeable_state: unknown</code> is GitHub telling you it has not even recomputed whether the merge is still possible; it does that lazily, when something asks.</p>
</div>

<p>This is the practical rule that follows: <strong>a PR&#39;s green tick ages, and the rate it ages at is the rate the base branch moves.</strong> On a quiet repository a week-old tick is fine. On this one, 1,527 commits in two months, a tick from June is decoration. Branch protection has a setting for exactly this — "Require branches to be up to date before merging" — which forces the PR to absorb the base before the tick counts. It costs a re-run on every merge into the base, which is why it is off by default and why busy repositories turn it on anyway.</p>

<h3><code>pull_request_target</code>, and the reason it exists</h3>
<p>A PR from a fork is code written by somebody who does not have write access to your repository. If CI ran that code with your secrets, the fork author would have your secrets. So GitHub does not: on a <code>pull_request</code> run from a fork, <code>GITHUB_TOKEN</code> is read-only and repository secrets are <strong>not</strong> passed.</p>

<p>That is safe and it is also inconvenient — a labeller bot, a benchmark that posts a comment, a preview deployment all need write access. <code>pull_request_target</code> is the answer: it runs <strong>the workflow file from the base branch</strong>, in the context of the base branch, with full secrets. Three combinations, measured on a rig where the base has a harmless <code>postinstall</code> script and the PR branch rewrites that same script to print a secret:</p>

<div class="out">############ 1. pull_request (checkout mac dinh) ############
[pr] sau-cai: DEPLOY_KEY = (khong thay)

############ 2. pull_request_target (checkout mac dinh) ############
[base] sau-cai: khong lam gi ca

############ 3. pull_request_target + checkout ref: head.sha ############
[pr] sau-cai: DEPLOY_KEY = sk-that-su-cua-production-9f2a</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — <code>pull_request</code></span><span class="lz-lnote">runs the PR&#39;s code, with NO secrets. The attacker&#39;s script executes and finds nothing. This is the safe default and it is why the default exists</span></div>
<div class="lz-layer"><span class="lz-lname">2 — <code>pull_request_target</code>, default checkout</span><span class="lz-lnote">runs the BASE&#39;s code, WITH secrets. The attacker&#39;s script never executes at all — checkout took the base tree. Also safe</span></div>
<div class="lz-layer"><span class="lz-lname">3 — <code>pull_request_target</code> + <code>ref: head.sha</code></span><span class="lz-lnote">runs the PR&#39;s code, WITH secrets. The attacker&#39;s script executes AND finds the key. This single added line is the entire vulnerability</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — the line that turns a convenience into a compromise.</strong> Combination 2 is useless for most real jobs: you wanted <code>pull_request_target</code> so you could <em>build the PR</em>, and the base checkout does not contain the PR. So the obvious next step is to add <code>ref: \${{ github.event.pull_request.head.sha }}</code>, and that step produces combination 3. It is obvious, it is what a search result will show you, and it hands an arbitrary stranger a shell with your production credentials in the environment. Note also that nothing in the attack required a malicious <em>workflow</em> — the workflow file came from the base branch, untouched. Editing one already-trusted script was enough.</p>
</div>

<h3>What to do instead</h3>
<div class="kv-grid">
<div class="kv"><span class="k">need nothing privileged</span><span class="v">use <code>pull_request</code>. Lint, typecheck, tests. This is the overwhelming majority of CI and it needs no secrets at all</span></div>
<div class="kv"><span class="k">need to write a comment or label</span><span class="v">split it: <code>pull_request</code> builds and uploads a report as an artifact, then a separate <code>workflow_run</code> workflow — which runs from the base and never checks out PR code — reads the artifact and posts</span></div>
<div class="kv"><span class="k">must use <code>pull_request_target</code></span><span class="v">never check out PR code in it. If you truly must, gate on a maintainer-applied label and <code>environment:</code> approval, scope <code>permissions:</code> to the minimum, and treat every secret it touches as one PR away from public</span></div>
<div class="kv"><span class="k">building this repository&#39;s workflows</span><span class="v">this is not hypothetical for you today: <strong>0 of 11</strong> workflows here use <code>pull_request_target</code>, and the one <code>pull_request</code> workflow needs no secrets. Keep it that way</span></div>
</div>

<h3>What this repository actually does</h3>
<div class="out">pull_request_target       : 0 / 11 workflow
permissions: khai tuong minh: 1 / 11 (chi deploy-ghcr.yml)
ci-lint.yml on pull_request: branches: [main], KHONG co paths:
8 lan chay pull_request tong cong, tat ca success</div>

<p>One line there is a deliberate choice worth naming. <code>ci-lint.yml</code> has a <code>paths:</code> filter on its <code>push</code> trigger but <strong>not</strong> on its <code>pull_request</code> trigger. That asymmetry looks like an oversight and is the opposite — it is the fix for a failure mode that lesson 1.5 measures.</p>

<div class="callout ok">
<p><strong>The one sentence.</strong> <code>pull_request</code> tests a commit that exists nowhere but GitHub&#39;s servers, made of your branch plus the base as it stood at some past moment — which is the right thing to test, and is also why a green tick is a statement with an expiry date on it.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows: pull_request</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request — states the merge-commit behaviour and the fork permission rules. The merge-commit sentence is one line long and is the single most consequential line on the page.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Security Lab — Keeping your GitHub Actions and workflows secure: Preventing pwn requests</span><span class="lc-sub">securitylab.github.com/resources/github-actions-preventing-pwn-requests/ — the original write-up of combination 3, by the team that found it in the wild. The artifact + workflow_run split recommended above comes from here.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/checkout — README, the <code>ref</code> input</span><span class="lc-sub">github.com/actions/checkout#usage — documents that the default ref is the SHA that triggered the workflow, and carries its own warning against checking out untrusted code under pull_request_target.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-merge(1) — the --no-ff flag and two-parent commits</span><span class="lc-sub">git-scm.com/docs/git-merge — what GitHub is actually running to produce refs/pull/N/merge, and why HEAD^1 and HEAD^2 mean what they mean.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — merge commits, two parents, and reading history</span><span class="lc-sub">/courses/git/learn${REF} — the merge machinery underneath this lesson, including why a clean merge and a correct merge are different claims.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2><code>pull_request</code> chạy trên một commit KHÔNG nằm trên nhánh bạn</h2>
<p class="lead">Bạn đẩy một nhánh, mở PR, CI xanh. Đọc cái dấu tick ấy thành "nhánh của tôi qua được" là phản xạ tự nhiên. Nó KHÔNG nói thế. Nó nói một câu hẹp hơn và hữu ích hơn, và khoảng cách giữa hai câu ấy là nơi cả một họ sự cố vỡ-main sinh sống.</p>

<h3>Câu hỏi, phát biểu cho chính xác</h3>
<p>Khi một sự kiện <code>pull_request</code> nổ và <code>actions/checkout</code> chạy, <strong>commit nào rơi vào thư mục làm việc?</strong> Ba ứng viên đều nghe hợp lý:</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">ứng viên</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">đầu nhánh của tôi</span><span class="lz-nsub">cái tôi đã đẩy, cái tôi đã thử ở máy, cái trang PR hiện ra là commit mới nhất</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">đầu nhánh gốc</span><span class="lz-nsub">main như nó đang có, hoàn toàn không có thay đổi của tôi</span></div></div>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">một bản gộp của hai cái</span><span class="lz-nsub">một commit không ai viết, không nằm trên nhánh nào, do GitHub tạo ra cho đúng việc này</span></div></div>
</div>
</div>

<p>Là cái thứ ba. GitHub tính <code>git merge --no-ff</code> nhánh bạn vào nhánh gốc rồi công bố kết quả dưới tên <code>refs/pull/&lt;N&gt;/merge</code>. Chính commit đó được job lấy về, và sha của nó là thứ nằm trong <code>\${{ github.sha }}</code>.</p>

<h3>Vì sao chỗ phân biệt ấy không phải chuyện hàn lâm</h3>
<p>Đây là một bộ đồ nghề dựng ra để cho thấy khác biệt đó. Nhánh gốc có một hàm và một bài kiểm cho nó. Nhánh PR <strong>chỉ thêm một file mới</strong> cùng bài kiểm của riêng nó — nó không đụng một file nào mà nhánh gốc đụng. Trong lúc đó nhánh gốc đổi chữ ký của hàm ấy và sửa <em>bài kiểm của chính nó</em> cho khớp:</p>

<pre><code><span class="tok-comment"># main: chu ky cu</span>
function calc(a, b) { return a + b; }

<span class="tok-comment"># nhanh PR: CHI THEM file moi, goi ham theo chu ky cu</span>
function orderTotal(x, y) { return calc(x, y); }

<span class="tok-comment"># main (trong luc do): doi chu ky, va sua test CUA CHINH NO</span>
function calc({ a, b }) { return a + b; }</code></pre>

<p>Không file nào bị sửa ở cả hai phía, nên xét về mặt chữ, bản gộp sạch. Bây giờ chạy đúng một bộ kiểm ấy ở cả ba chỗ:</p>

<div class="out">######## A. CHAY TREN DAU NHANH PR (cai ban thay o local) ########
  xanh: thu-bao-cao
  xanh: thu-tinh
CI XANH
exit=0

######## B. CHAY TREN MAIN (khong co PR) ########
  xanh: thu-tinh
CI XANH
exit=0

######## C. MERGE COMMIT — cai ma pull_request THUC SU chay ########
gop: SACH, khong xung dot
GITHUB_SHA      = ebf646c58c6dfcf24ba494d6d7fca4e16f914698
  ^1 (base)     = 4455dae17852942087937e976f117b6b465f6407
  ^2 (dau PR)   = f1f968b0ebb224829e605d94db8c9d2636937728
  HONG: thu-bao-cao.js - tongDon(10,20) = NaN, mong doi 30
  xanh: thu-tinh
CI DO (1 hong)
exit=1</div>

<div class="callout warn">
<p><strong>Cả hai nhánh đều xanh. Bản gộp không xung đột. Kết quả ĐỎ.</strong> Không có thao tác quản lý phiên bản nào có thể cảnh báo bạn: việc của git là hoà giải <em>chữ</em>, và chữ hoà giải hoàn hảo. Cái vỡ là một khế ước giữa hai file chưa bao giờ được sửa cùng nhau. Chỉ chạy cái cây ĐÃ GỘP mới tìm ra, và chạy cái cây đã gộp đúng là việc <code>pull_request</code> làm.</p>
</div>

<p>Đọc lại mấy cái sha trong khối C. Merge commit có <strong>hai cha</strong>, và điều đáng chú ý là không cha nào là commit bạn sẽ đoán:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">^1</span><span class="lz-t">4455dae1 — nhánh gốc</span><span class="lz-d">đầu <code>main</code> tại thời điểm merge ref được tính</span></div>
<div class="lz-step"><span class="lz-k">^2</span><span class="lz-t">f1f968b0 — nhánh bạn</span><span class="lz-d">commit trang PR hiện ra, cái bạn đã đẩy</span></div>
<div class="lz-step"><span class="lz-k">chính nó</span><span class="lz-t">ebf646c5 — GITHUB_SHA</span><span class="lz-d">không nằm trên nhánh nào, không có trong bản sao của ai, và nó là thứ CI đã phán</span></div>
</div>

<h3>Cái sha API cho bạn xem KHÔNG phải cái sha job nhìn thấy</h3>
<p>Đây là chỗ sự nhầm lẫn thành cụ thể. Hỏi API về một lần chạy <code>pull_request</code> thật của kho này rồi đối chiếu với chính cái PR:</p>

<div class="out">run 27990511412 (PR #4) head_sha = 3220149d38388b8f8173e1e2d9312ae7739860a6
PR #4 head.sha (API)             = 3220149d38388b8f8173e1e2d9312ae7739860a6  <- GIONG NHAU
PR #4 mergeable_state            = unknown  <- GitHub tinh LUOI, chi tinh khi co nguoi HOI</div>

<p><code>head_sha</code> của lần chạy đúng bằng đầu nhánh của PR. Nên mọi công cụ đọc API — bảng điều khiển, huy hiệu, bot, và script của chính bạn — đều báo lần chạy ấy là <em>về</em> đầu nhánh bạn. Bên trong job, <code>\${{ github.sha }}</code> là một sha hoàn toàn khác, và nó KHÔNG xuất hiện ở đâu trong bản ghi API của lần chạy. Hai cách nhìn nhất quán về cùng một lần chạy, bất đồng về việc cái gì đã được kiểm.</p>

<div class="kv-grid">
<div class="kv"><span class="k">muốn merge commit</span><span class="v"><code>\${{ github.sha }}</code> — mặc định, thứ checkout lấy khi không có <code>ref:</code></span></div>
<div class="kv"><span class="k">muốn đầu nhánh của bạn</span><span class="v"><code>\${{ github.event.pull_request.head.sha }}</code> — truyền tường minh vào <code>ref:</code></span></div>
<div class="kv"><span class="k">muốn đầu nhánh gốc</span><span class="v"><code>\${{ github.event.pull_request.base.sha }}</code></span></div>
<div class="kv"><span class="k">muốn TÊN nhánh</span><span class="v"><code>\${{ github.head_ref }}</code>. <code>\${{ github.ref }}</code> trên một PR là <code>refs/pull/&lt;N&gt;/merge</code> — không phải tên nhánh, và nó sẽ làm bất ngờ mọi thứ đem so khớp chuỗi với nó</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — gắn nhãn hay công bố bằng <code>github.sha</code> trên lần chạy PR.</strong> Một bước làm <code>docker build -t app:\${{ github.sha }}</code> sẽ, trên một PR, đẻ ra một ảnh mang nhãn là merge commit — thứ sẽ không bao giờ tồn tại lại một khi PR cập nhật. Không tái lập được, không với tới được từ nhánh nào, và sau khi PR gộp thì cái nhãn ấy ứng với hư không. Trên lần chạy PR hãy gắn nhãn bằng <code>head.sha</code>, hoặc đừng công bố gì từ lần chạy PR cả.</p>
</div>

<h3>Khi bản gộp không tồn tại thì KHÔNG có gì chạy — và cũng không có gì báo</h3>
<p>Vẫn bộ đồ nghề ấy, đổi một chỗ: cho hai phía cùng sửa một file để bản gộp xung đột thật.</p>

<div class="out">Auto-merging thu.js
CONFLICT (content): Merge conflict in thu.js
Automatic merge failed; fix conflicts and then commit the result.

git rev-parse HEAD -> van la main, KHONG co commit nao duoc tao</div>

<p>Không có merge commit để lấy về, nên GitHub không xếp hàng lần chạy nào. Hệ quả trên trang PR rất đặc trưng và đáng nhận ra ngay khi nhìn: ô kiểm KHÔNG đỏ. Cũng KHÔNG xanh. Nó nằm ở <strong>"Expected — Waiting for status to be reported"</strong>, vô thời hạn, và nếu đó là một ô kiểm bắt buộc thì PR không gộp được mà chẳng có cú hỏng nào để bấm vào xem.</p>

<div class="callout">
<p><strong>Quy tắc nhận dạng.</strong> Một ô kiểm <em>treo mãi</em> trên PR gần như không bao giờ là runner kẹt. Nó là một trong ba thứ: bản gộp xung đột (không có merge ref để chạy), một bộ lọc đường dẫn hay nhánh đã loại PR này ra (bài 1.5), hoặc một ô kiểm bắt buộc mà workflow của nó không còn tồn tại. Cả ba đều là cấu hình, và không cái nào đẻ ra một dòng log để đọc.</p>
</div>

<h3>Một dấu tick xanh cũ được tới đâu</h3>
<p>PR #4 của kho này vẫn đang mở. Lần chạy CI cuối của nó thành công. Đây là những gì đã xảy ra với nhánh gốc bên dưới nó kể từ đó:</p>

<div class="out">PR #4: mo 22/06/2026, base luc do = dda544e7, dau nhanh = 3220149d
lan chay ci-lint cuoi: 27990511412, 22/06/2026, ket qua: success

main tu do toi nay (24/08/2026) da di them:
  1527 commit
  5315 file thay doi
  +1.214.424 / -14.703 dong</div>

<div class="callout warn">
<p><strong>Cái tick xanh ấy được tính trên một merge commit mà nửa gốc của nó nay đã cũ 1.527 commit.</strong> Nó không sai — nó tường thuật trung thực rằng bản gộp <em>tính tới 22/06</em> ổn. Nó chỉ đơn giản là không có gì để nói về việc gộp PR này HÔM NAY. Và <code>mergeable_state: unknown</code> là GitHub đang nói với bạn rằng nó còn chưa tính lại xem bản gộp có còn khả thi không; nó tính lười, khi nào có thứ gì hỏi tới.</p>
</div>

<p>Từ đó ra quy tắc dùng được: <strong>dấu tick xanh của một PR CÓ TUỔI, và nó già đi với tốc độ mà nhánh gốc di chuyển.</strong> Ở một kho im ắng, một cái tick một tuần tuổi vẫn ổn. Ở kho này, 1.527 commit trong hai tháng, một cái tick từ tháng Sáu là đồ trang trí. Branch protection có đúng một tuỳ chọn cho chuyện này — "Require branches to be up to date before merging" — bắt PR phải hấp thụ nhánh gốc trước khi cái tick được tính. Cái giá là một lượt chạy lại cho mỗi lần gộp vào nhánh gốc, đó là lý do nó tắt mặc định và cũng là lý do các kho bận rộn vẫn bật.</p>

<h3><code>pull_request_target</code>, và lý do nó tồn tại</h3>
<p>Một PR từ fork là mã do một người KHÔNG có quyền ghi vào kho bạn viết. Nếu CI chạy mã đó với bí mật của bạn, thì tác giả fork có bí mật của bạn. Nên GitHub không làm thế: trong một lần chạy <code>pull_request</code> đến từ fork, <code>GITHUB_TOKEN</code> chỉ đọc và bí mật của kho <strong>không</strong> được truyền vào.</p>

<p>Điều đó an toàn và cũng bất tiện — một bot gắn nhãn, một phép đo hiệu năng có bình luận kết quả, một bản dựng xem thử đều cần quyền ghi. <code>pull_request_target</code> là câu trả lời: nó chạy <strong>tệp workflow của nhánh gốc</strong>, trong ngữ cảnh nhánh gốc, với đầy đủ bí mật. Ba tổ hợp, đo trên một bộ đồ nghề mà nhánh gốc có một script <code>postinstall</code> vô hại còn nhánh PR viết lại đúng script ấy để in một bí mật ra:</p>

<div class="out">############ 1. pull_request (checkout mac dinh) ############
[pr] sau-cai: DEPLOY_KEY = (khong thay)

############ 2. pull_request_target (checkout mac dinh) ############
[base] sau-cai: khong lam gi ca

############ 3. pull_request_target + checkout ref: head.sha ############
[pr] sau-cai: DEPLOY_KEY = sk-that-su-cua-production-9f2a</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — <code>pull_request</code></span><span class="lz-lnote">chạy mã của PR, KHÔNG bí mật. Script của kẻ tấn công có chạy và không thấy gì. Đây là mặc định an toàn, và đó là lý do cái mặc định ấy tồn tại</span></div>
<div class="lz-layer"><span class="lz-lname">2 — <code>pull_request_target</code>, checkout mặc định</span><span class="lz-lnote">chạy mã của NHÁNH GỐC, CÓ bí mật. Script của kẻ tấn công không hề chạy — checkout đã lấy cây của nhánh gốc. Cũng an toàn</span></div>
<div class="lz-layer"><span class="lz-lname">3 — <code>pull_request_target</code> + <code>ref: head.sha</code></span><span class="lz-lnote">chạy mã của PR, CÓ bí mật. Script của kẻ tấn công vừa chạy VỪA thấy cái khoá. Đúng một dòng thêm vào ấy LÀ toàn bộ lỗ hổng</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cái dòng biến một tiện lợi thành một cú thất thủ.</strong> Tổ hợp 2 vô dụng với phần lớn việc thật: bạn muốn <code>pull_request_target</code> để <em>dựng cái PR</em>, mà bản checkout nhánh gốc thì không chứa PR. Nên bước tiếp theo hiển nhiên là thêm <code>ref: \${{ github.event.pull_request.head.sha }}</code>, và bước đó đẻ ra tổ hợp 3. Nó hiển nhiên, nó là thứ một kết quả tìm kiếm sẽ chỉ cho bạn, và nó trao cho một người lạ bất kỳ một cái shell với thông tin đăng nhập production nằm sẵn trong môi trường. Cũng để ý: cú tấn công KHÔNG cần một <em>workflow</em> độc hại nào — tệp workflow đến từ nhánh gốc, nguyên vẹn. Sửa một script vốn đã được tin tưởng là đủ.</p>
</div>

<h3>Thay vào đó thì làm gì</h3>
<div class="kv-grid">
<div class="kv"><span class="k">không cần quyền gì đặc biệt</span><span class="v">dùng <code>pull_request</code>. Lint, kiểm kiểu, chạy test. Đây là đại đa số CI và nó không cần bí mật nào cả</span></div>
<div class="kv"><span class="k">cần viết bình luận hay gắn nhãn</span><span class="v">tách đôi: <code>pull_request</code> dựng rồi tải kết quả lên dạng artifact, sau đó một workflow <code>workflow_run</code> riêng — chạy từ nhánh gốc và không bao giờ checkout mã PR — đọc artifact ấy rồi đăng</span></div>
<div class="kv"><span class="k">buộc phải dùng <code>pull_request_target</code></span><span class="v">đừng bao giờ checkout mã PR trong đó. Nếu thật sự buộc phải, hãy chốt bằng một nhãn do người bảo trì gắn cộng phê duyệt <code>environment:</code>, thu <code>permissions:</code> về mức tối thiểu, và coi mọi bí mật nó chạm tới là cách chỗ công khai đúng một cái PR</span></div>
<div class="kv"><span class="k">dựng workflow cho chính kho này</span><span class="v">chuyện này không hề giả định với bạn hôm nay: <strong>0 trên 11</strong> workflow ở đây dùng <code>pull_request_target</code>, và workflow <code>pull_request</code> duy nhất thì không cần bí mật nào. Cứ giữ nguyên như thế</span></div>
</div>

<h3>Kho này thực tế đang làm gì</h3>
<div class="out">pull_request_target       : 0 / 11 workflow
permissions: khai tuong minh: 1 / 11 (chi deploy-ghcr.yml)
ci-lint.yml on pull_request: branches: [main], KHONG co paths:
8 lan chay pull_request tong cong, tat ca success</div>

<p>Một dòng ở đó là lựa chọn có chủ ý, đáng gọi tên. <code>ci-lint.yml</code> có bộ lọc <code>paths:</code> trên kích hoạt <code>push</code> nhưng <strong>không</strong> có trên kích hoạt <code>pull_request</code>. Sự bất đối xứng ấy trông như sót, và nó là điều ngược lại — nó là phần vá cho một kiểu hỏng mà bài 1.5 sẽ đo.</p>

<div class="callout ok">
<p><strong>Một câu.</strong> <code>pull_request</code> kiểm một commit không tồn tại ở đâu ngoài máy chủ GitHub, làm bằng nhánh bạn cộng nhánh gốc như nó đứng tại một thời điểm đã qua — đó ĐÚNG là thứ cần kiểm, và cũng chính là lý do một dấu tick xanh là một lời khẳng định có ghi hạn dùng.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows: pull_request</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request — phát biểu hành vi merge commit và luật quyền với fork. Câu về merge commit dài đúng một dòng và là dòng nặng hệ quả nhất trên cả trang.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Security Lab — Preventing pwn requests</span><span class="lc-sub">securitylab.github.com/resources/github-actions-preventing-pwn-requests/ — bài viết gốc về tổ hợp 3, của chính đội đã bắt được nó ngoài thực địa. Cách tách artifact + workflow_run khuyến nghị ở trên lấy từ đây.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/checkout — README, tham số <code>ref</code></span><span class="lc-sub">github.com/actions/checkout#usage — ghi rõ ref mặc định là sha đã kích hoạt workflow, và tự nó mang một lời cảnh báo về việc checkout mã không tin cậy dưới pull_request_target.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-merge(1) — cờ --no-ff và commit hai cha</span><span class="lc-sub">git-scm.com/docs/git-merge — đúng thứ GitHub đang chạy để đẻ ra refs/pull/N/merge, và vì sao HEAD^1 với HEAD^2 mang nghĩa như thế.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — merge commit, hai cha, và cách đọc lịch sử</span><span class="lc-sub">/courses/git/learn${REF} — bộ máy gộp nằm dưới bài này, gồm cả việc vì sao "gộp sạch" và "gộp đúng" là hai lời khẳng định khác nhau.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.5 ─────────────────────────── */
    {
      title: '1.5 — Filters, and the 73.5% of commits that run no CI|||1.5 — Bộ lọc, và 73,5% commit không chạy CI nào',
      slug: 'ga-1-5-bo-loc',
      type: 'VIDEO',
      description: 'Đo 200 commit gần nhất trên main của kho này: 147 cái KHÔNG kích hoạt CI nào. Bộ lọc `paths:` không sai — nhưng cú hỏng thật duy nhất của tháng Bảy nằm trọn trong tập bị bỏ qua. Và `src/*` khớp 1 file, `src/**` khớp 353.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Filters, and the 73.5% of commits that run no CI</h2>
<p class="lead">Filters make CI cheaper by not running it. That is the whole point and it works. The question this lesson answers with numbers is: <em>on what, exactly, is it not running?</em> — because in this repository the answer turned out to include the one thing that actually broke.</p>

<h3>The four filters</h3>
<div class="kv-grid">
<div class="kv"><span class="k"><code>branches:</code> / <code>branches-ignore:</code></span><span class="v">which branch the push or PR targets. On <code>pull_request</code> this filters the <strong>base</strong> branch — where the PR is going, not where it came from</span></div>
<div class="kv"><span class="k"><code>tags:</code> / <code>tags-ignore:</code></span><span class="v">only for <code>push</code>. Adding <code>tags:</code> and omitting <code>branches:</code> means branch pushes stop triggering entirely</span></div>
<div class="kv"><span class="k"><code>paths:</code> / <code>paths-ignore:</code></span><span class="v">which files the change touched. Any one match is enough to run</span></div>
<div class="kv"><span class="k">the pairing rule</span><span class="v">you cannot use <code>paths:</code> and <code>paths-ignore:</code> in the same event, nor <code>branches:</code> with <code>branches-ignore:</code>. Pick one side of each pair</span></div>
</div>

<h3>What this repository&#39;s filter actually filters</h3>
<p><code>ci-lint.yml</code> is the only workflow here that runs on <code>push</code>, and it carries a <code>paths:</code> list:</p>

<pre><code>on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'frontend/src/**'
      - 'eval/**'
      - 'prisma/**'
      - 'package.json'
      - 'package-lock.json'
      <span class="tok-comment"># ... con 5 duong nua</span></code></pre>

<p>Rather than reason about whether that list is right, replay it. Take the last 200 commits on <code>main</code> and apply the patterns to each commit&#39;s file list:</p>

<div class="out">200 commit gan nhat tren main:
  KHOP bo loc paths (ci-lint CHAY):    53
  TRUOT bo loc     (ci-lint IM LANG):  147
  ty le im lang: 73.5%</div>

<div class="callout warn">
<p><strong>Just under three quarters of commits on the main branch trigger no CI at all.</strong> That is not a bug report yet — it might be exactly right. But it is a number worth knowing before you assume "main is green" means anything.</p>
</div>

<h3>Is it right? Look at what the skipped commits touch</h3>
<div class="out">147 commit bi bo qua dung vao dau (dem theo file):
  desktop/   297
  content/    84
  firmware/   46
  scripts/     2
  deploy-nha.sh  2
  .github/       1
  docker-compose.yml 1
  CLAUDE.md      1
  AGENTS.md      1</div>

<p>Now check that against what the job would have done anyway. The backend job runs <code>tsc --noEmit</code>, and the compiler&#39;s own scope is:</p>

<div class="out">include: ['src*']
exclude: ['node_modules', 'dist', 'prisma/seed.ts']
rootDir: ./src</div>

<div class="callout ok">
<p><strong>The filter is correctly scoped.</strong> <code>tsc</code> genuinely does not look at <code>desktop/</code>, <code>content/</code>, <code>firmware/</code> or <code>scripts/</code>, so running it on a commit that touches only those would burn two minutes to re-verify an unchanged tree. Those 147 skips are 147 correct decisions, and the person who wrote that list knew what the job checks.</p>
</div>

<h3>And yet</h3>
<p>The most expensive CI failure this repository has had was run <strong>32400097927</strong> — <code>vite build</code> exiting 134 with <code>Reached heap limit — JavaScript heap out of memory</code> on a macOS runner, during a desktop release. It built green in twenty seconds on the developer&#39;s own machine. It failed only on CI, only on macOS, and only at release time.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">where the break lived</span><span class="lz-t"><code>desktop/</code></span><span class="lz-d">297 of the 147 skipped commits&#39; files are in this directory</span></div>
<div class="lz-step"><span class="lz-k">what CI ran on it</span><span class="lz-t">nothing</span><span class="lz-d">no pattern in the <code>paths:</code> list matches <code>desktop/**</code></span></div>
<div class="lz-step"><span class="lz-k">when it surfaced</span><span class="lz-t">at release</span><span class="lz-d">the first time anything built that directory was a human pressing publish</span></div>
</div>

<div class="callout warn">
<p><strong>The filter is not wrong; the coverage is.</strong> Every pattern in that list is defensible. What is missing is a <em>second job</em> — one that builds <code>desktop/</code> — and a matching pattern for it. A <code>paths:</code> filter silently converts "we have no job for this directory" into "CI passed", and those two sentences look identical on the commit list. That is the failure mode worth carrying out of this lesson: filters do not hide broken jobs, they hide <strong>missing</strong> ones.</p>
</div>

<h3>The glob syntax, measured against the real file list</h3>
<p>The single most common filter bug is writing one asterisk where two are needed. Apply each pattern to this repository&#39;s actual tracked files:</p>

<div class="out">mau                so file khop   ghi chu
------------------------------------------------------------
src/**                      353
src/*                         1   <- CHI src/index.ts
src/*.ts                      1
src/**/*.ts                 353
**/*.ts                   1.039   <- ca kho
frontend/**               2.242
*.json                        5   <- chi thu muc goc
**/*.json                    93</div>

<div class="pitfall">
<p><strong>Trap — <code>src/*</code> is not "everything under src".</strong> A single <code>*</code> does not cross a <code>/</code>. In this repository <code>src/**</code> matches 353 files and <code>src/*</code> matches exactly one, because <code>src/index.ts</code> is the only file sitting directly in <code>src/</code>. Write <code>src/*</code> in a <code>paths:</code> filter and you have removed CI from 352 files — with no error, no warning, and a workflow that still runs often enough to look alive. The same trap turns <code>*.json</code> (5 files, root only) into something very different from <code>**/*.json</code> (93 files).</p>
</div>

<h3>The filter that stops a PR forever</h3>
<p>This is the reason for an asymmetry in the config above that looks like an oversight. Read the two triggers again:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>push:</code> has <code>paths:</code></span><span class="lz-lnote">correct — a push to main that touches nothing the job checks should not spend two minutes checking it</span></div>
<div class="lz-layer"><span class="lz-lname"><code>pull_request:</code> has NO <code>paths:</code></span><span class="lz-lnote">also correct, and for a completely different reason</span></div>
</div>

<p>A <em>required</em> status check that never runs never reports. GitHub does not treat "this workflow was filtered out" as a pass — it treats it as a result that has not arrived. The PR sits at <strong>"Expected — Waiting for status to be reported"</strong> and cannot be merged, with no failing job to open and no log to read. Combine a <code>paths:</code> filter on <code>pull_request</code> with branch protection requiring that check, and every documentation-only PR is permanently unmergeable.</p>

<div class="callout">
<p><strong>The standard fix, when you do want path filtering on PRs.</strong> Drop <code>paths:</code> from the trigger and move the condition inside: keep the job always running, and let its <em>steps</em> decide. A job that starts, discovers nothing relevant changed, and exits 0 in eight seconds reports success — which is what branch protection needs. The dedicated tool is a changed-files action feeding an <code>if:</code> on the expensive steps; Chapter 3 builds that pattern properly. The cheap version is a first step that computes the diff and sets an output.</p>
</div>

<h3>Two limits, one of which does not apply here</h3>
<p>The documentation states that <code>paths</code> filtering only examines the first 300 files of a push, and that a push of more than 1,000 commits always runs regardless of filters. Both are real. Whether they matter to you is measurable:</p>

<div class="out">commit lon nhat trong 200 commit gan nhat: 23 file
so commit vuot 300 file: 0 / 200</div>

<div class="callout ok">
<p><strong>A null result, reported as one.</strong> The 300-file ceiling exists and is worth knowing, and in this repository it has not come close to biting — the largest commit in two hundred touched 23 files. It would matter to a monorepo doing generated-code commits or vendored dependency updates. Stating it as a live hazard here would be teaching a rule by a threat that the numbers say is not present.</p>
</div>

<h3>Tags, and a grep that lied</h3>
<p>Counting tag triggers in this repository looks like one command, and the obvious command gives the wrong answer:</p>

<div class="out">$ grep -l "tags:" .github/workflows/*.yml
.github/workflows/deploy-ghcr.yml        <- co ve nhu CO kich hoat theo tag</div>

<p>It does not. That match is inside a <code>docker/build-push-action</code> step, where <code>tags:</code> names the <em>Docker image tags</em> to push. Counting only inside the <code>on:</code> block gives the real number: <strong>0 of 11</strong> workflows here trigger on a tag.</p>

<div class="pitfall">
<p><strong>Trap — grepping a key name across YAML with no regard for nesting.</strong> <code>tags:</code>, <code>name:</code>, <code>env:</code>, <code>if:</code> and <code>permissions:</code> are all legal at several different depths with different meanings. A flat <code>grep</code> across workflow files answers a question you did not ask. Scope the search to the block you mean — and when a one-line grep produces a surprising claim about your own repository, that surprise is the signal to check it, not to write it down.</p>
</div>

<p>One more thing falls out of that same file. <code>deploy-ghcr.yml</code> tags its images with <code>\${{ github.sha }}</code>, which lesson 1.4 named as a pitfall on PR runs. It is safe here for a reason that has nothing to do with the tag: the workflow is <code>workflow_dispatch:</code> only, so it can never run on a pull request, so <code>github.sha</code> is always a real branch commit. The hazard was avoided by the trigger configuration, not by the variable choice — which is exactly the kind of accidental safety that stops being safe the moment somebody adds a <code>pull_request:</code> trigger to that file.</p>

<div class="callout ok">
<p><strong>What to take away.</strong> Filters are an economic decision that reads as a correctness one. Before adding <code>paths:</code>, replay it over your last two hundred commits — the command is short and the number is usually surprising. Then ask the second question, which is the one that matters: of the directories this filter excludes, which ones have <em>no job at all</em>?</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: onpushpaths / filter patterns cheat sheet</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#filter-pattern-cheat-sheet — the authoritative table for <code>*</code> vs <code>**</code> vs <code>?</code>, and the statement that <code>paths</code> and <code>paths-ignore</code> cannot coexist on one event.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Troubleshooting required status checks</span><span class="lc-sub">docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/troubleshooting-required-status-checks — the official description of the "Expected — Waiting for status to be reported" state and its causes, including the filtered-out case.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">dorny/paths-filter and tj-actions/changed-files</span><span class="lc-sub">github.com/dorny/paths-filter — the standard way to move path conditions from the trigger into the job, so a required check still reports on every PR. Chapter 3 uses this with <code>if:</code> on individual steps.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — pathspec, .gitignore globs, and why they differ</span><span class="lc-sub">/courses/git/learn${REF} — git&#39;s own glob rules are close to but not identical to the Actions filter syntax, and the differences bite in exactly the <code>*</code> vs <code>**</code> place this lesson measured.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Bộ lọc, và 73,5% commit không chạy CI nào</h2>
<p class="lead">Bộ lọc làm CI rẻ đi bằng cách KHÔNG chạy nó. Đó là toàn bộ mục đích và nó hiệu quả. Câu hỏi bài này trả lời bằng con số là: <em>chính xác thì nó đang không chạy trên cái gì?</em> — bởi ở kho này, đáp án hoá ra có chứa đúng cái thứ đã vỡ.</p>

<h3>Bốn bộ lọc</h3>
<div class="kv-grid">
<div class="kv"><span class="k"><code>branches:</code> / <code>branches-ignore:</code></span><span class="v">cú push hay PR nhắm vào nhánh nào. Với <code>pull_request</code>, nó lọc nhánh <strong>GỐC</strong> — nơi PR đi TỚI, không phải nơi PR đi RA</span></div>
<div class="kv"><span class="k"><code>tags:</code> / <code>tags-ignore:</code></span><span class="v">chỉ dành cho <code>push</code>. Thêm <code>tags:</code> mà bỏ <code>branches:</code> nghĩa là push lên nhánh THÔI kích hoạt hoàn toàn</span></div>
<div class="kv"><span class="k"><code>paths:</code> / <code>paths-ignore:</code></span><span class="v">thay đổi đụng vào file nào. Khớp được MỘT cái là đủ chạy</span></div>
<div class="kv"><span class="k">luật cặp đôi</span><span class="v">không được dùng <code>paths:</code> cùng <code>paths-ignore:</code> trong cùng một sự kiện, cũng không được <code>branches:</code> cùng <code>branches-ignore:</code>. Mỗi cặp chọn một phía</span></div>
</div>

<h3>Bộ lọc của kho này thật ra lọc cái gì</h3>
<p><code>ci-lint.yml</code> là workflow duy nhất ở đây chạy khi <code>push</code>, và nó mang một danh sách <code>paths:</code>:</p>

<pre><code>on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'frontend/src/**'
      - 'eval/**'
      - 'prisma/**'
      - 'package.json'
      - 'package-lock.json'
      <span class="tok-comment"># ... con 5 duong nua</span></code></pre>

<p>Thay vì ngồi lập luận xem danh sách ấy có đúng không, hãy DIỄN LẠI nó. Lấy 200 commit gần nhất trên <code>main</code> rồi áp các mẫu ấy vào danh sách file của từng commit:</p>

<div class="out">200 commit gan nhat tren main:
  KHOP bo loc paths (ci-lint CHAY):    53
  TRUOT bo loc     (ci-lint IM LANG):  147
  ty le im lang: 73.5%</div>

<div class="callout warn">
<p><strong>Chưa đầy một phần tư commit trên nhánh chính là có CI; ba phần tư còn lại không kích hoạt gì cả.</strong> Đó chưa phải một báo cáo lỗi — có thể nó đúng y như vậy là hợp lý. Nhưng đó là con số đáng biết TRƯỚC khi bạn cho rằng "main đang xanh" có nghĩa gì đó.</p>
</div>

<h3>Nó có đúng không? Nhìn xem các commit bị bỏ qua đụng vào đâu</h3>
<div class="out">147 commit bi bo qua dung vao dau (dem theo file):
  desktop/   297
  content/    84
  firmware/   46
  scripts/     2
  deploy-nha.sh  2
  .github/       1
  docker-compose.yml 1
  CLAUDE.md      1
  AGENTS.md      1</div>

<p>Giờ đối chiếu với việc mà job dù sao cũng sẽ làm. Job backend chạy <code>tsc --noEmit</code>, và phạm vi của chính trình biên dịch là:</p>

<div class="out">include: ['src*']
exclude: ['node_modules', 'dist', 'prisma/seed.ts']
rootDir: ./src</div>

<div class="callout ok">
<p><strong>Bộ lọc được khoanh ĐÚNG phạm vi.</strong> <code>tsc</code> thật sự không nhìn tới <code>desktop/</code>, <code>content/</code>, <code>firmware/</code> hay <code>scripts/</code>, nên chạy nó trên một commit chỉ đụng mấy chỗ đó là đốt hai phút để kiểm lại một cái cây không đổi. 147 lần bỏ qua ấy là 147 quyết định đúng, và người viết danh sách kia biết rõ job kiểm cái gì.</p>
</div>

<h3>Vậy mà</h3>
<p>Cú hỏng CI đắt nhất kho này từng có là lần chạy <strong>32400097927</strong> — <code>vite build</code> thoát 134 với <code>Reached heap limit — JavaScript heap out of memory</code> trên runner macOS, giữa một lượt phát hành desktop. Nó dựng xanh trong hai mươi giây trên máy của chính người viết. Nó chỉ hỏng ở CI, chỉ trên macOS, và chỉ vào lúc phát hành.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">chỗ cú vỡ nằm</span><span class="lz-t"><code>desktop/</code></span><span class="lz-d">297 trong số file của 147 commit bị bỏ qua nằm ở thư mục này</span></div>
<div class="lz-step"><span class="lz-k">CI chạy gì trên đó</span><span class="lz-t">không gì cả</span><span class="lz-d">không mẫu nào trong danh sách <code>paths:</code> khớp <code>desktop/**</code></span></div>
<div class="lz-step"><span class="lz-k">lúc nào nó lộ ra</span><span class="lz-t">lúc phát hành</span><span class="lz-d">lần đầu tiên có thứ gì dựng thư mục ấy là một con người bấm nút công bố</span></div>
</div>

<div class="callout warn">
<p><strong>Bộ lọc không sai; ĐỘ PHỦ mới sai.</strong> Mọi mẫu trong danh sách kia đều bảo vệ được. Cái thiếu là một <em>job thứ hai</em> — cái dựng <code>desktop/</code> — cùng một mẫu tương ứng cho nó. Một bộ lọc <code>paths:</code> âm thầm biến "chúng ta không có job nào cho thư mục này" thành "CI đã qua", và hai câu ấy trông y hệt nhau trên danh sách commit. Đó là kiểu hỏng đáng mang ra khỏi bài này: bộ lọc không giấu job HỎNG, nó giấu job <strong>KHÔNG TỒN TẠI</strong>.</p>
</div>

<h3>Cú pháp glob, đo trên danh sách file thật</h3>
<p>Lỗi bộ lọc phổ biến nhất là viết một dấu sao ở chỗ cần hai. Áp từng mẫu vào danh sách file đang được theo dõi của kho này:</p>

<div class="out">mau                so file khop   ghi chu
------------------------------------------------------------
src/**                      353
src/*                         1   <- CHI src/index.ts
src/*.ts                      1
src/**/*.ts                 353
**/*.ts                   1.039   <- ca kho
frontend/**               2.242
*.json                        5   <- chi thu muc goc
**/*.json                    93</div>

<div class="pitfall">
<p><strong>Bẫy — <code>src/*</code> KHÔNG phải "mọi thứ dưới src".</strong> Một dấu <code>*</code> không vượt qua dấu <code>/</code>. Ở kho này <code>src/**</code> khớp 353 file còn <code>src/*</code> khớp đúng MỘT, vì <code>src/index.ts</code> là file duy nhất nằm trực tiếp trong <code>src/</code>. Viết <code>src/*</code> vào một bộ lọc <code>paths:</code> là bạn vừa gỡ CI khỏi 352 file — không lỗi, không cảnh báo, và một workflow vẫn chạy đủ thường xuyên để trông như còn sống. Cùng cái bẫy ấy biến <code>*.json</code> (5 file, chỉ gốc) thành một thứ rất khác <code>**/*.json</code> (93 file).</p>
</div>

<h3>Bộ lọc chặn đứng một PR vĩnh viễn</h3>
<p>Đây là lý do cho một sự bất đối xứng trong cấu hình bên trên, cái trông như sót. Đọc lại hai kích hoạt:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>push:</code> CÓ <code>paths:</code></span><span class="lz-lnote">đúng — một cú push vào main không đụng gì job kiểm thì không nên tốn hai phút đi kiểm nó</span></div>
<div class="lz-layer"><span class="lz-lname"><code>pull_request:</code> KHÔNG có <code>paths:</code></span><span class="lz-lnote">cũng đúng, và vì một lý do hoàn toàn khác</span></div>
</div>

<p>Một ô kiểm trạng thái <em>bắt buộc</em> mà không bao giờ chạy thì không bao giờ báo cáo. GitHub KHÔNG coi "workflow này bị lọc ra" là một lần qua — nó coi đó là một kết quả CHƯA TỚI. PR nằm ở <strong>"Expected — Waiting for status to be reported"</strong> và không gộp được, không có job hỏng nào để mở, không có log nào để đọc. Ghép một bộ lọc <code>paths:</code> trên <code>pull_request</code> với branch protection đòi ô kiểm ấy, và mọi PR chỉ sửa tài liệu sẽ vĩnh viễn không gộp được.</p>

<div class="callout">
<p><strong>Cách vá chuẩn, khi bạn THẬT SỰ muốn lọc đường dẫn trên PR.</strong> Bỏ <code>paths:</code> khỏi kích hoạt và đưa điều kiện vào BÊN TRONG: giữ cho job luôn chạy, để các <em>bước</em> của nó tự quyết. Một job khởi động, phát hiện không có gì liên quan thay đổi, rồi thoát 0 trong tám giây thì vẫn báo cáo thành công — đúng thứ branch protection cần. Công cụ chuyên dụng là một action đọc danh sách file đã đổi rồi nạp vào <code>if:</code> của các bước đắt tiền; Chương 3 dựng khuôn mẫu ấy cho tử tế. Bản rẻ tiền là một bước đầu tiên tính diff rồi đặt một output.</p>
</div>

<h3>Hai giới hạn, một cái không áp dụng ở đây</h3>
<p>Tài liệu nói rằng việc lọc <code>paths</code> chỉ xét 300 file đầu của một cú push, và rằng một cú push quá 1.000 commit thì luôn chạy bất kể bộ lọc. Cả hai đều có thật. Chúng có ăn thua với bạn không thì đo được:</p>

<div class="out">commit lon nhat trong 200 commit gan nhat: 23 file
so commit vuot 300 file: 0 / 200</div>

<div class="callout ok">
<p><strong>Một kết quả RỖNG, và ghi lại đúng là rỗng.</strong> Cái trần 300 file có thật và đáng biết, còn ở kho này nó chưa hề tới gần chỗ cắn — commit lớn nhất trong hai trăm cái đụng 23 file. Nó sẽ ăn thua với một monorepo hay commit mã sinh tự động hoặc cập nhật thư viện nhúng kèm. Đem nó ra doạ ở đây là dạy một quy tắc bằng một mối nguy mà số đo bảo là không có mặt.</p>
</div>

<h3>Tag, và một lệnh grep nói dối</h3>
<p>Đếm số kích hoạt theo tag trong kho này trông như một câu lệnh, và câu lệnh hiển nhiên ấy cho đáp án SAI:</p>

<div class="out">$ grep -l "tags:" .github/workflows/*.yml
.github/workflows/deploy-ghcr.yml        <- co ve nhu CO kich hoat theo tag</div>

<p>Không hề. Chỗ khớp ấy nằm bên trong một bước <code>docker/build-push-action</code>, nơi <code>tags:</code> đặt tên cho các <em>nhãn ảnh Docker</em> cần đẩy. Chỉ đếm bên trong khối <code>on:</code> mới ra con số thật: <strong>0 trên 11</strong> workflow ở đây kích hoạt theo tag.</p>

<div class="pitfall">
<p><strong>Bẫy — grep một tên khoá xuyên qua YAML mà không đếm xỉa tới độ lồng.</strong> <code>tags:</code>, <code>name:</code>, <code>env:</code>, <code>if:</code> và <code>permissions:</code> đều hợp lệ ở nhiều độ sâu khác nhau với nghĩa khác nhau. Một lệnh <code>grep</code> phẳng xuyên các tệp workflow sẽ trả lời một câu hỏi bạn không hỏi. Hãy khoanh vùng tìm kiếm vào đúng khối bạn định nói — và khi một lệnh grep một dòng đẻ ra một khẳng định gây bất ngờ về chính kho của bạn, thì sự bất ngờ ấy là tín hiệu để đi KIỂM, không phải để ghi xuống.</p>
</div>

<p>Còn một thứ nữa rơi ra từ chính tệp ấy. <code>deploy-ghcr.yml</code> gắn nhãn ảnh bằng <code>\${{ github.sha }}</code>, đúng cái bài 1.4 đã gọi tên là bẫy trên lần chạy PR. Ở đây nó an toàn vì một lý do chẳng liên quan gì tới cái nhãn: workflow ấy <code>workflow_dispatch:</code> thuần, nên nó không bao giờ chạy trên một pull request, nên <code>github.sha</code> luôn là một commit thật của nhánh. Mối nguy bị né nhờ cấu hình KÍCH HOẠT, không nhờ việc chọn biến — mà đó đúng là kiểu an toàn tình cờ sẽ thôi an toàn ngay khoảnh khắc có người thêm một kích hoạt <code>pull_request:</code> vào tệp đó.</p>

<div class="callout ok">
<p><strong>Rút ra cái gì.</strong> Bộ lọc là một quyết định KINH TẾ nhưng đọc lên như một quyết định ĐÚNG-SAI. Trước khi thêm <code>paths:</code>, hãy diễn lại nó trên hai trăm commit gần nhất của bạn — câu lệnh ngắn và con số thường gây bất ngờ. Rồi hỏi câu thứ hai, câu mới thật sự quan trọng: trong những thư mục mà bộ lọc này loại ra, thư mục nào <em>không có job nào cả</em>?</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: bảng tra cứu mẫu lọc</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#filter-pattern-cheat-sheet — bảng chính thức cho <code>*</code> với <code>**</code> với <code>?</code>, và phát biểu rằng <code>paths</code> và <code>paths-ignore</code> không thể cùng nằm trên một sự kiện.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Troubleshooting required status checks</span><span class="lc-sub">docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/troubleshooting-required-status-checks — mô tả chính thức trạng thái "Expected — Waiting for status to be reported" và các nguyên nhân, gồm cả trường hợp bị bộ lọc loại ra.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">dorny/paths-filter và tj-actions/changed-files</span><span class="lc-sub">github.com/dorny/paths-filter — cách chuẩn để chuyển điều kiện đường dẫn từ kích hoạt vào bên trong job, để một ô kiểm bắt buộc vẫn báo cáo trên mọi PR. Chương 3 dùng nó cùng <code>if:</code> trên từng bước.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — pathspec, glob của .gitignore, và chỗ chúng khác nhau</span><span class="lc-sub">/courses/git/learn${REF} — luật glob của chính git gần giống nhưng không đồng nhất với cú pháp lọc của Actions, và chỗ khác biệt cắn đúng vào chỗ <code>*</code> với <code>**</code> mà bài này vừa đo.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.6 ─────────────────────────── */
    {
      title: '1.6 — Chapter 1 quiz|||1.6 — Kiểm tra Chương 1',
      slug: 'ga-1-6-kiem-tra',
      type: 'QUIZ',
      description: 'Tám câu trên đúng những số đã đo trong chương: khoá `on:` thành boolean, `run: >` nuốt lệnh, cron 0/10 đúng giờ, merge commit của `pull_request`, tổ hợp rò bí mật, và `src/*` khớp 1 file.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>What Chapter 1 measured</h2>
<p class="lead">Eight questions, twelve minutes. Every one of them is about a number or a behaviour that was measured in this chapter rather than asserted — if an answer feels like it depends on opinion, re-read the output block it came from.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1.1 — it is YAML</span><span class="lz-lnote">the <code>on:</code> key parses as boolean <code>True</code>; <code>18.20</code> becomes the float <code>18.2</code>; <code>run: &gt;</code> folds two commands into one and the second never runs</span></div>
<div class="lz-layer"><span class="lz-lname">1.2 — what starts a run</span><span class="lz-lnote">10 of this repository&#39;s 11 workflows are <code>workflow_dispatch</code> only, and two dated outages are why</span></div>
<div class="lz-layer"><span class="lz-lname">1.3 — schedule</span><span class="lz-lnote">0 of 10 scheduled runs started on time; mean delay 2.6 hours, worst 4.5</span></div>
<div class="lz-layer"><span class="lz-lname">1.4 — the merge commit</span><span class="lz-lnote">both branches green, merge clean, CI red; and the one added <code>ref:</code> line that leaks secrets</span></div>
<div class="lz-layer"><span class="lz-lname">1.5 — filters</span><span class="lz-lnote">73.5% of commits run no CI; <code>src/*</code> matches 1 file where <code>src/**</code> matches 353</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Chương 1 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Mỗi câu đều xoay quanh một con số hoặc một hành vi đã được ĐO trong chương này chứ không phải được khẳng định suông — nếu một đáp án khiến bạn thấy nó phụ thuộc quan điểm, hãy đọc lại khối kết quả mà nó lấy ra từ đó.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1.1 — nó là YAML</span><span class="lz-lnote">khoá <code>on:</code> đọc ra boolean <code>True</code>; <code>18.20</code> thành số thực <code>18.2</code>; <code>run: &gt;</code> gấp hai lệnh thành một và lệnh thứ hai không bao giờ chạy</span></div>
<div class="lz-layer"><span class="lz-lname">1.2 — cái gì khởi động một lần chạy</span><span class="lz-lnote">10 trên 11 workflow của kho này chỉ <code>workflow_dispatch</code>, và hai sự cố có ngày tháng là lý do</span></div>
<div class="lz-layer"><span class="lz-lname">1.3 — schedule</span><span class="lz-lnote">0 trên 10 lần chạy theo lịch khởi động đúng giờ; trễ trung bình 2,6 tiếng, tệ nhất 4,5</span></div>
<div class="lz-layer"><span class="lz-lname">1.4 — merge commit</span><span class="lz-lnote">cả hai nhánh xanh, gộp sạch, CI đỏ; và đúng một dòng <code>ref:</code> thêm vào làm rò bí mật</span></div>
<div class="lz-layer"><span class="lz-lname">1.5 — bộ lọc</span><span class="lz-lnote">73,5% commit không chạy CI nào; <code>src/*</code> khớp 1 file trong khi <code>src/**</code> khớp 353</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A YAML parser reads a workflow file and is asked for the value of the key "on". It returns nothing. Why?|||Một trình đọc YAML đọc một tệp workflow rồi được hỏi giá trị của khoá "on". Nó trả về rỗng. Vì sao?',
            options: [
              'YAML 1.1 parses the bare word on as the boolean True, so the key is the boolean True and not the string "on"|||YAML 1.1 đọc từ trần on thành boolean True, nên khoá ấy là boolean True chứ không phải chuỗi "on"',
              'The key on is reserved by GitHub and stripped out before the file is parsed|||Khoá on được GitHub giữ riêng và bị gỡ đi trước khi tệp được đọc',
              'on must be quoted in every workflow file or GitHub rejects the file|||on bắt buộc phải để trong nháy ở mọi tệp workflow, không thì GitHub từ chối tệp',
              'The parser needs the workflow schema loaded before it can resolve top-level keys|||Trình đọc cần nạp lược đồ workflow trước rồi mới phân giải được các khoá cấp trên cùng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A step is written as `run: >` with `echo mot` on one line and `echo hai` on the next. What does the shell actually execute?|||Một bước viết `run: >` với `echo mot` ở một dòng và `echo hai` ở dòng kế. Shell thật sự chạy cái gì?',
            options: [
              'One command, `echo mot echo hai` — it prints "mot echo hai" and the second command never runs|||Một lệnh duy nhất, `echo mot echo hai` — nó in ra "mot echo hai" và lệnh thứ hai không bao giờ chạy',
              'Two commands, exactly as written — `>` and `|` behave identically for run: blocks|||Hai lệnh, đúng như đã viết — `>` và `|` cư xử y hệt nhau với khối run:',
              'Two commands, but the second runs in a separate shell so its exit code is discarded|||Hai lệnh, nhưng lệnh thứ hai chạy trong một shell riêng nên mã thoát của nó bị bỏ đi',
              'Nothing — YAML rejects a folded scalar inside a run: key|||Không gì cả — YAML từ chối một chuỗi gấp bên trong khoá run:',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Ten real scheduled runs of `cron: 0 3 * * 0` were measured over two months. How many started on time (within one minute)?|||Mười lần chạy theo lịch THẬT của `cron: 0 3 * * 0` được đo suốt hai tháng. Bao nhiêu lần khởi động đúng giờ (lệch dưới một phút)?',
            options: [
              'Zero — the best was 41 minutes late, the worst 4.5 hours, mean delay 2.6 hours|||Không lần nào — sớm nhất là trễ 41 phút, tệ nhất 4,5 tiếng, trễ trung bình 2,6 tiếng',
              'Nine of ten, with a single outlier during a GitHub incident|||Chín trên mười, với đúng một lần lệch trong lúc GitHub có sự cố',
              'All ten — cron on GitHub fires within seconds, same as a Linux crontab|||Cả mười — cron trên GitHub nổ trong vài giây, y như crontab của Linux',
              'Six of ten; delays only happen on weekday schedules|||Sáu trên mười; chỉ lịch ngày thường mới bị trễ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'On a `pull_request` event with a default `actions/checkout`, which commit is in the working directory?|||Trong một sự kiện `pull_request` với `actions/checkout` mặc định, commit nào nằm trong thư mục làm việc?',
            options: [
              'A merge commit that GitHub creates from your branch and the base, which exists on no branch and is what github.sha holds|||Một merge commit GitHub tạo ra từ nhánh bạn và nhánh gốc, không nằm trên nhánh nào, và đó là thứ github.sha đang giữ',
              'The tip of your branch — the same commit the PR page shows as latest|||Đầu nhánh của bạn — đúng commit mà trang PR hiện ra là mới nhất',
              'The tip of the base branch, so CI checks main rather than your change|||Đầu nhánh gốc, nên CI kiểm main chứ không kiểm thay đổi của bạn',
              'Whichever of the two is newer by commit timestamp|||Cái nào mới hơn theo dấu thời gian commit trong hai cái',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A PR branch is green, main is green, and the merge has no conflict. The `pull_request` run is red. What happened?|||Nhánh PR xanh, main xanh, bản gộp không xung đột. Lần chạy `pull_request` lại đỏ. Chuyện gì đã xảy ra?',
            options: [
              'The merged tree breaks a contract between two files that were never edited together — git reconciled the text correctly, and only running the merge finds it|||Cây đã gộp làm vỡ một khế ước giữa hai file chưa bao giờ được sửa cùng nhau — git hoà giải phần CHỮ hoàn toàn đúng, và chỉ chạy bản gộp mới tìm ra',
              'The runner picked up a stale cache from a previous run on the base branch|||Runner nhặt phải một bộ nhớ đệm cũ từ một lần chạy trước trên nhánh gốc',
              'This cannot happen — a clean merge of two green branches is always green|||Chuyện này không thể xảy ra — gộp sạch hai nhánh xanh thì luôn ra xanh',
              'The merge commit was computed against an older base and needs the PR to be rebased|||Merge commit được tính trên một nhánh gốc cũ hơn và cần PR phải rebase lại',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Three combinations were measured against a PR branch that rewrites a postinstall script to print a secret. Which one printed the real secret?|||Ba tổ hợp được đo với một nhánh PR viết lại script postinstall để in một bí mật ra. Tổ hợp nào đã in ra bí mật thật?',
            options: [
              'pull_request_target with `ref: github.event.pull_request.head.sha` — the PR&#39;s code runs, and the base&#39;s secrets are present|||pull_request_target kèm `ref: github.event.pull_request.head.sha` — mã của PR chạy, và bí mật của nhánh gốc có mặt',
              'pull_request with the default checkout — it runs the PR&#39;s code, so the secret is exposed|||pull_request với checkout mặc định — nó chạy mã của PR nên bí mật bị lộ',
              'pull_request_target with the default checkout — it has secrets, so the secret is exposed|||pull_request_target với checkout mặc định — nó có bí mật nên bí mật bị lộ',
              'All three — any workflow triggered by a fork PR can read repository secrets|||Cả ba — mọi workflow bị một PR từ fork kích hoạt đều đọc được bí mật của kho',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Measured against this repository&#39;s real file list, `src/**` matches 353 files. How many does `src/*` match?|||Đo trên danh sách file thật của kho này, `src/**` khớp 353 file. Vậy `src/*` khớp bao nhiêu?',
            options: [
              'One — a single asterisk does not cross a slash, and src/index.ts is the only file directly inside src/|||Một — một dấu sao không vượt qua dấu gạch chéo, và src/index.ts là file duy nhất nằm trực tiếp trong src/',
              'The same 353 — the two forms are interchangeable in Actions filter syntax|||Vẫn 353 — hai cách viết thay thế được cho nhau trong cú pháp lọc của Actions',
              'Zero — a filter pattern must end in ** to match anything at all|||Không — một mẫu lọc phải kết thúc bằng ** thì mới khớp được thứ gì',
              'Three hundred — the pattern is capped at the 300-file filter limit|||Ba trăm — mẫu ấy bị chặn ở giới hạn lọc 300 file',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does `ci-lint.yml` carry a `paths:` filter on its `push` trigger but deliberately none on `pull_request`?|||Vì sao `ci-lint.yml` mang bộ lọc `paths:` trên kích hoạt `push` nhưng CỐ Ý không có trên `pull_request`?',
            options: [
              'A required check that is filtered out never reports, so the PR sits at "Expected — Waiting for status to be reported" and can never be merged|||Một ô kiểm bắt buộc bị lọc ra thì không bao giờ báo cáo, nên PR nằm mãi ở "Expected — Waiting for status to be reported" và không bao giờ gộp được',
              'GitHub does not support paths: on the pull_request event at all|||GitHub hoàn toàn không hỗ trợ paths: trên sự kiện pull_request',
              'Path filters on a PR are evaluated against the merge commit and are therefore always empty|||Bộ lọc đường dẫn trên một PR được xét trên merge commit nên luôn luôn rỗng',
              'Because PRs are rarer than pushes, so filtering them saves nothing worth the config|||Vì PR hiếm hơn push nên lọc chúng chẳng tiết kiệm được gì đáng công cấu hình',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
