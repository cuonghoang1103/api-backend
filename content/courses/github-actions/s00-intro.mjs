import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Mục 0: CI thật ra giải quyết vấn đề gì.
 * Số đo lấy từ chính kho api-backend: 11 workflow, 2.343 lần chạy.
 */

export default {
  title: 'Section 0 — What CI actually solves|||Mục 0 — CI thật ra giải quyết vấn đề gì',
  slug: 'ga-muc0-intro',
  description: 'Bốn bài dựng lại vấn đề trước khi dựng lời giải: vì sao "chạy được trên máy tôi" là một câu nói KHÔNG kiểm chứng được, và một cỗ máy chạy mã trên máy người khác thì mua được điều gì.',
  sortOrder: 1,
  lessons: [

    /* ─────────────────────── Bắt đầu tại đây (1/2) ─────────────────────── */
    {
      title: 'Start here (1/2) — CI/CD and GitHub Actions: what, where from, why companies need them|||Bắt đầu tại đây (1/2) — CI/CD và GitHub Actions là gì, ra đời thế nào, vì sao công ty cần',
      slug: 'ga-0-5-bat-dau-tai-day',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bài mở cửa cho người chưa từng viết CI: CI/CD bằng hình ảnh đời thường, CI khác Delivery khác Deployment, lịch sử từ 1991 tới GitHub Actions 2019, so với Jenkins/GitLab CI/CircleCI, con số hiện nay, vì sao công ty cần, nó giúp gì khi bạn đi làm và phỏng vấn hay hỏi gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>Welcome. Before your first workflow, know what CI/CD is — and why it is worth learning</h2>
<p class="lead">Maybe you have never written a CI pipeline. Maybe you have seen a red ✗ next to a pull request and had no idea what it meant, or copied a <code>.github/workflows/*.yml</code> from a tutorial and hoped. Either way this lesson is for you. Nothing to memorise: in about twenty-five minutes you will know what CI and CD are, how they differ, where they came from, why almost every software company runs them, what GitHub Actions is next to Jenkins and GitLab CI, and what interviewers ask about all of it.</p>
<p>This lesson and the next one are the door into the course. Part 2 tells true stories of what happens <em>without</em> CI — and when CI itself is the weak point — and gives you a study plan. Then lessons 0.1–0.4 take one real failure apart, name the four building blocks, read a real workflow line by line, and lay out the fifteen chapters.</p>

<h3>CI/CD in everyday pictures first</h3>
${slide('ga-00', 3, 'CI is a head chef tasting every dish before it leaves the kitchen')}
<p>Forget the textbook definition for a moment. Picture a restaurant kitchen. Cooks prepare dishes; before any plate leaves, the head chef tastes it. Not because the cooks are bad — because a dish sent back from a table costs far more than a spoonful tasted at the pass. A bad plate caught in the kitchen is a thirty-second fix; one caught by the customer is a refund, a complaint and a bad review.</p>
<p>Software has the same shape. You write code, commit it, push it. <strong>Continuous Integration (CI)</strong> is the head chef: every time anyone pushes, a machine that is <em>not</em> your laptop fetches the code fresh, installs what it needs, and runs the checks the team agreed on — type-check, tests, build. Two minutes later there is a ✓ or a ✗ next to your commit. <strong>Continuous Delivery / Deployment (CD)</strong> is the waiter: taking the version that passed and getting it to the people who use it, the same way every time.</p>
<div class="kv-grid">
<div class="kv"><span class="k">🍳 Tasting at the pass</span><span class="v">CI: every change is checked automatically, on a clean machine, within minutes — not once a month before a release.</span></div>
<div class="kv"><span class="k">🏭 Inspection on the assembly line</span><span class="v">A car factory inspects every car at every station instead of the finished car at the end. CI inspects every commit instead of the finished release.</span></div>
<div class="kv"><span class="k">🍽 Serving the same way every time</span><span class="v">CD: the path from "passed" to "in users' hands" is a script, not a person remembering eight steps at 11 p.m.</span></div>
</div>

<h3>Precisely: CI, Continuous Delivery, Continuous Deployment</h3>
${slide('ga-00', 4, 'CI, Delivery, Deployment: three different stopping points')}
<p>The three terms are often mixed up — in job ads and sometimes in interviews — so learn the difference once:</p>
<table>
<thead><tr><th>Term</th><th>What happens automatically</th><th>Where it stops</th><th>Who decides to release</th></tr></thead>
<tbody>
<tr><td><strong>Continuous Integration</strong></td><td>every push is built and tested; everyone merges into the main branch often (at least daily)</td><td>a verified build</td><td>not a release yet</td></tr>
<tr><td><strong>Continuous Delivery</strong></td><td>CI + the build is packaged and deployed to a staging environment; it is always releasable</td><td>one button before production</td><td>a person presses "release"</td></tr>
<tr><td><strong>Continuous Deployment</strong></td><td>everything above, and production too</td><td>nowhere — green goes live</td><td>nobody; the tests are the decision</td></tr>
</tbody>
</table>
<p>"CD" can mean either of the last two; when someone says it, it is fair to ask which. This repository is an honest example of a deliberate choice: CI runs automatically on pull requests, but deploying is a script a person runs (lesson 0.3 and Chapter 9 explain why the push-to-deploy version was switched off after two outages).</p>

<h3>One commit through a pipeline</h3>
${slide('ga-00', 5, 'A commit passes through the pipeline in minutes, with a graph to look at')}
<p>A <strong>pipeline</strong> is the chain of automated steps a commit goes through. In GitHub Actions it is described in a YAML file in <code>.github/workflows/</code>. The smallest real one looks like this — it ran on the course sandbox as run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35988364005" target="_blank" rel="noopener">35988364005</a>:</p>
<pre><code class="language-yaml">name: ch00 — xin chao CI
on:
  push:
    branches: [ch00-mo-dau]      # when: a push to this branch
jobs:
  chao:
    runs-on: ubuntu-24.04        # where: a fresh Linux machine from GitHub
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4          # fetch the code
      - name: Noi xin chao
        run: |
          echo "Xin chao tu runner cua GitHub!"
          echo "commit: $GITHUB_SHA"
          echo "CI=$CI  so CPU: $(nproc)  Node: $(node --version)"</code></pre>
<div class="out">✓ ch00-mo-dau ch00 — xin chao CI · 35988364005
✓ chao in 4s

Xin chao tu runner cua GitHub!
commit: 864c5506f791fed4e58cb7e893604a2f5dd37e54
nhanh:  ch00-mo-dau   nguoi push: cuonghoang1103
CI=true  so CPU: 4  Node: v22.23.2</div>
<p>Four seconds, on a machine in a data centre you will never see, which printed your commit ID and then disappeared. Replace the <code>echo</code> lines with <code>npm ci</code> and <code>npm test</code> and you have real CI. Everything else in this course — triggers, caching, secrets, matrices, deploys — is about making that answer faster, safer and more meaningful.</p>

<h3>Where CI came from — thirty years in two slides</h3>
${slide('ga-00', 6, 'CI existed almost 30 years before GitHub Actions')}
<p>CI is older than most of the tools you use:</p>
<ul>
<li><strong>1991</strong> — Grady Booch uses the phrase "continuous integration" in his book on object-oriented design. As Martin Fowler later notes, it was an offhand phrase, not yet a practice.</li>
<li><strong>1997–1999</strong> — Kent Beck and Ron Jeffries shape <strong>Extreme Programming (XP)</strong> on a Chrysler payroll project; integrating many times a day, with an automated build and tests, becomes one of its core practices.</li>
<li><strong>10 September 2000</strong> — Martin Fowler publishes the article "Continuous Integration" (rewritten in 2006, revised again in January 2024). It is still the clearest statement of the idea.</li>
<li><strong>2001</strong> — <strong>CruiseControl</strong>, from ThoughtWorks, is one of the first open-source CI servers: a machine that watches the repository and builds every change.</li>
<li><strong>7 February 2005</strong> — Kohsuke Kawaguchi at Sun Microsystems releases <strong>Hudson</strong>. After Oracle bought Sun, a naming dispute led the community to vote on 29 January 2011 to rename the project <strong>Jenkins</strong> — still one of the most used CI servers in companies.</li>
</ul>
${slide('ga-00', 7, 'Then CI moved next to the code: 2011 → 2019')}
<ul>
<li><strong>2011</strong> — <strong>Travis CI</strong> (Berlin) and <strong>CircleCI</strong> (September 2011) put CI in the cloud with the configuration <em>in the repository</em>. Travis was the first CI service free for open-source projects — until December 2020.</li>
<li><strong>22 September 2015</strong> — GitLab 8.0 makes <strong>GitLab CI</strong> part of GitLab itself: code and pipeline on one platform.</li>
<li><strong>16 October 2018</strong> — GitHub announces <strong>GitHub Actions</strong> at its Universe conference. The first version used an HCL file (<code>main.workflow</code>) and was about automation in general, not specifically CI.</li>
<li><strong>8 August 2019</strong> — GitHub announces CI/CD in Actions: YAML workflows, Linux, macOS and Windows runners, matrix builds, live logs, free for public repositories. HCL workflows stopped running on <strong>30 September 2019</strong>.</li>
<li><strong>13 November 2019</strong> — GitHub Actions becomes generally available.</li>
</ul>
<div class="callout ok">
<p><strong>What the history teaches.</strong> Each step moved CI closer to the code: from a practice (XP), to a server someone ran in a back room (CruiseControl, Jenkins), to a file in the repository run by a service (Travis, CircleCI), to a feature of the platform where the code already lives (GitLab CI, GitHub Actions). The reason given most often for choosing a CI tool today is exactly that — JetBrains&#39; 2025 CI/CD survey quotes "it lives where our code lives".</p>
</div>

<h3>GitHub Actions next to Jenkins, GitLab CI and CircleCI</h3>
${slide('ga-00', 8, 'Four CI tools: they differ in where they run and where the config lives')}
<p>You will meet all four at work, often two at once. The ideas transfer almost unchanged — event → pipeline → job → step → runner — so learn one well and the others are mostly syntax:</p>
<ul>
<li><strong>GitHub Actions</strong> — the natural choice when the code is on GitHub; huge library of ready-made actions; free standard runners for public repositories.</li>
<li><strong>GitLab CI/CD</strong> — the same idea inside GitLab; popular with companies that host their own GitLab.</li>
<li><strong>Jenkins</strong> — self-hosted, extremely flexible through plugins, common in older and larger organisations. You run and maintain the server yourself.</li>
<li><strong>CircleCI</strong> — a cloud CI service independent of where the code lives, known for build-speed features.</li>
</ul>
<p>A quick vocabulary map: a GitHub <em>workflow</em> is a GitLab <em>pipeline</em> or a Jenkins <em>Pipeline</em>; a GitHub <em>action</em> is roughly a Jenkins <em>plugin</em> or a CircleCI <em>orb</em>; a <em>runner</em> is called a runner in GitLab and an <em>agent</em> in Jenkins.</p>

<h3>Is it really that important? The numbers</h3>
${slide('ga-00', 9, 'Numbers today: CI is daily work, not an option')}
<ul>
<li>GitHub&#39;s Octoverse 2025 report (data from September 2024 to August 2025) counts <strong>11.5 billion GitHub Actions minutes</strong> used in public projects in one year, <strong>up 35%</strong>, on a platform with more than 180 million developers.</li>
<li>JetBrains&#39; "State of CI/CD in 2025" (805 respondents) found <strong>62%</strong> use GitHub Actions for personal projects and <strong>41%</strong> in their organisations — and <strong>32%</strong> of organisations run two CI tools at once.</li>
</ul>
<p>Read those as a direction, not a law: surveys have their own audiences. The direction is clear, though — CI is ordinary daily work in software teams, and GitHub Actions is the tool you are most likely to meet first.</p>

<h3>Why companies care</h3>
${slide('ga-00', 10, 'Companies need CI because a bug is cheapest the moment it is born')}
<p>Companies do not run CI because it is fashionable. They run it because of what it saves:</p>
<ul>
<li><strong>Bugs found in minutes, by the person who made them.</strong> A red ✗ two minutes after a push reaches someone who still remembers what they changed. The same bug found two weeks later needs an investigation.</li>
<li><strong>Many people, one main branch.</strong> Ten developers merging into the same branch every day only works if every pull request is checked on a clean machine first.</li>
<li><strong>Releases become boring.</strong> When build and deploy are scripted and tested every day, releasing on a Friday is no longer an event.</li>
<li><strong>A record.</strong> Who pushed what, which checks ran, with which log — auditors and incident reviews can read it back.</li>
<li><strong>New people start faster.</strong> The workflow is documentation that runs: it shows exactly how the project is built and tested.</li>
<li><strong>Security, both ways.</strong> CI runs dependency and secret scanning — and is also where a project&#39;s most powerful secrets live, which Part 2 shows is a target.</li>
</ul>

<h3>What it does for you, at work</h3>
<p>In your first job you will probably not design a company&#39;s pipeline. You will do the things around it, every week:</p>
<table>
<thead><tr><th>You will…</th><th>You need to know…</th><th>Taught in</th></tr></thead>
<tbody>
<tr><td>see your pull request go red and fix it before review</td><td>read a failed run: job → step → first error line</td><td>Part 2, Chapter 8</td></tr>
<tr><td>add a test or lint step to an existing workflow</td><td>steps, jobs, what green means</td><td>0.2, 0.3, Chapter 2</td></tr>
<tr><td>make a slow pipeline faster</td><td>caching, parallel jobs, the critical path</td><td>Chapters 5, 7</td></tr>
<tr><td>add a secret or an API key for a new integration</td><td>secrets, permissions, why they leak</td><td>Chapter 6</td></tr>
<tr><td>update an action version after a deprecation warning</td><td>what <code>@v4</code> means, pinning to a SHA</td><td>Chapter 4</td></tr>
<tr><td>be asked "is it the code or is it flaky?"</td><td>reproduce, measure, decide</td><td>Chapter 8, 10</td></tr>
</tbody>
</table>
<p>For a student it pays off even earlier: a team project where every push is checked is a team project that does not break the night before the demo — Part 2 has that story.</p>

<h3>What interviewers ask</h3>
${slide('ga-00', 11, 'Common CI/CD interview questions — and short answers')}
<p>For an intern or junior role, CI/CD questions are usually about understanding, not trivia. The six on the slide come up again and again; the answers there are the skeleton. Two to practise out loud:</p>
<div class="callout tip">
<p><strong>"What is the difference between CI and CD?"</strong> "CI means every change is built and tested automatically and merged often, so integration problems show up in minutes. CD takes the verified build further: Continuous Delivery keeps it always releasable and a person presses release; Continuous Deployment releases automatically when the pipeline is green." Then add one sentence from your own experience — "on my project, CI runs on every pull request and deploying is a manual step because…".</p>
</div>
<div class="callout tip">
<p><strong>"Your pipeline is red. What do you do?"</strong> "I open the failed job, then the failed step, and read the first error line — not the last. I check whether my commit touches that part of the code, try to reproduce it locally from a clean checkout, and only re-run if I have a reason to think it is flaky. If it is flaky, I record it rather than just pressing re-run." That answer shows method, which is what the question is testing.</p>
</div>

<h3>Where this course takes you</h3>
${slide('ga-00', 12, 'Sixteen stops, from the first lesson to a real project')}
<p>Sixteen stops. Section 0 (you are here) explains the problem. Chapters 1–4 teach you to write workflows: the file and its YAML traps, jobs and runners, expressions, actions. Chapters 5–7 make them fast and safe: caching, secrets and permissions, speed and cost. Chapters 8–10 are what goes wrong: red runs, deploying, diagnosis by real incidents; Chapter 11 reviews. Chapters 12–15 are the level companies hire for: reusable workflows, your own runners, quality gates and supply-chain security, automated releases, and a capstone pipeline built from zero with a twenty-question final exam.</p>

<div class="pitfall co-tieu-de"><strong>Where beginners usually start wrong.</strong> A student copies a workflow from a blog, pushes it, and it goes green. Two weeks later it goes red for a reason nobody understands — a Node version moved, a secret is missing, a cache is stale — and the conclusion is "CI is fragile" and the file gets deleted. None of those causes is hard; each is one idea from Chapters 2, 4, 5 or 6. Copying a working file is fine. Not knowing what each line does is what hurts. This course explains every line you will copy.</div>

<h3>🧪 Practice (10 min — you will succeed)</h3>
<div class="callout ok"><ol>
<li>Create a new <strong>public</strong> repository on GitHub (for example <code>thu-ci</code>) with a README.</li>
<li>In the browser, add the file <code>.github/workflows/xin-chao.yml</code> with the YAML from the section "One commit through a pipeline" above (change <code>branches: [ch00-mo-dau]</code> to <code>branches: [main]</code>), and commit it to <code>main</code>.</li>
<li>Open the <strong>Actions</strong> tab. Click the run, then the job <code>chao</code>, then the step <code>Noi xin chao</code>.</li>
<li>Write in one sentence, in your own words, the difference between Continuous Delivery and Continuous Deployment.</li>
</ol>
<p><strong>Done when:</strong> your run has a green ✓, the log shows <code>CI=true</code> and your commit ID, and your sentence mentions who (or what) decides to release.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">CI — Continuous Integration (tích hợp liên tục)</span><span class="v">Merge often; every change is built and tested automatically on a clean machine.</span></div>
<div class="kv"><span class="k">Continuous Delivery (giao hàng liên tục)</span><span class="v">Every verified build is always releasable; a person decides when to release.</span></div>
<div class="kv"><span class="k">Continuous Deployment (triển khai liên tục)</span><span class="v">Every verified build goes to production automatically.</span></div>
<div class="kv"><span class="k">Pipeline (đường ống)</span><span class="v">The chain of automated steps a change goes through; in GitHub Actions, a workflow.</span></div>
<div class="kv"><span class="k">Workflow</span><span class="v">A YAML file in <code>.github/workflows/</code> that says when to run and what to do.</span></div>
<div class="kv"><span class="k">Runner (máy chạy)</span><span class="v">The machine that executes a job — a fresh VM from GitHub, or one you host.</span></div>
<div class="kv"><span class="k">Check (phép kiểm)</span><span class="v">The ✓ / ✗ shown next to a commit or pull request for each job.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>CI is tasting every dish before it leaves the kitchen: every push is built and tested on a clean machine within minutes.</li>
<li>Continuous Delivery stops one button before production; Continuous Deployment does not stop.</li>
<li>The idea is older than the tools: Booch 1991, XP in the late 1990s, Fowler&#39;s article in 2000, CruiseControl 2001, Hudson 2005 → Jenkins 2011.</li>
<li>GitHub Actions was announced on 16/10/2018, gained CI/CD in YAML on 8/8/2019 and became generally available on 13/11/2019.</li>
<li>11.5 billion Actions minutes in public projects in a year (Octoverse 2025); 41% of JetBrains&#39; 2025 respondents use it at work.</li>
<li>For you: fewer broken team projects, the everyday tasks of a junior developer, and answers to the most common CI/CD interview questions.</li>
</ul>

<a class="link-card" href="https://martinfowler.com/articles/continuousIntegration.html" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — Continuous Integration</span><span class="lc-sub">First published 10/09/2000, rewritten 2006, revised 2024 — and the note on Booch and Kent Beck.</span></span></a>
<a class="link-card" href="https://github.blog/news-insights/product-news/github-actions-now-supports-ci-cd/" target="_blank" rel="noopener"><span class="lc-ico">📰</span><span class="lc-body"><span class="lc-title">GitHub Blog — GitHub Actions now supports CI/CD (08/08/2019)</span><span class="lc-sub">YAML, Linux/macOS/Windows, matrix builds, free for public repositories, GA on 13/11/2019.</span></span></a>
<a class="link-card" href="https://github.blog/changelog/2019-09-17-github-actions-will-stop-running-workflows-written-in-hcl/" target="_blank" rel="noopener"><span class="lc-ico">🗒</span><span class="lc-body"><span class="lc-title">GitHub Changelog — HCL workflows stop running (17/09/2019)</span><span class="lc-sub">The switch from <code>main.workflow</code> to the YAML files you write today.</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Jenkins_(software)" target="_blank" rel="noopener"><span class="lc-ico">📚</span><span class="lc-body"><span class="lc-title">Wikipedia — Jenkins (and Hudson, Continuous integration)</span><span class="lc-sub">Hudson 2005 at Sun, the 2011 rename vote, CruiseControl 2001.</span></span></a>
<a class="link-card" href="https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">GitHub Octoverse 2025</span><span class="lc-sub">11.5 billion Actions minutes in public projects, +35%; 180 million+ developers.</span></span></a>
<a class="link-card" href="https://blog.jetbrains.com/teamcity/2025/10/the-state-of-cicd/" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">JetBrains — The State of CI/CD in 2025</span><span class="lc-sub">805 respondents; GitHub Actions 62% personal, 41% at work; 32% of organisations use two CI tools.</span></span></a>
<a class="link-card" href="https://docs.github.com/en/actions/get-started/understand-github-actions" target="_blank" rel="noopener"><span class="lc-ico">📘</span><span class="lc-body"><span class="lc-title">GitHub Docs — Understanding GitHub Actions</span><span class="lc-sub">The official overview: workflows, events, jobs, actions, runners.</span></span></a>
<p class="note-ct"><strong>Next:</strong> "Start here" part 2 — true incidents from companies without CI (and with careless CI), the outage this very repository had, and a study plan that gets you to the end.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Chào bạn. Trước workflow đầu tiên, hãy biết CI/CD là gì — và vì sao đáng học</h2>
<p class="lead">Chào mừng bạn. Có thể bạn chưa từng viết một pipeline CI nào. Cũng có thể bạn đã thấy một dấu ✗ đỏ cạnh pull request mà không hiểu nó nghĩa là gì, hoặc đã chép một tệp <code>.github/workflows/*.yml</code> từ bài hướng dẫn nào đó rồi cầu may. Kiểu nào thì bài này cũng viết cho bạn. Ở đây không có gì phải học thuộc. Trong khoảng hai mươi lăm phút, bạn sẽ biết CI và CD là gì, khác nhau ở đâu, ra đời từ đâu, vì sao gần như mọi công ty phần mềm đều chạy chúng, GitHub Actions đứng ở đâu cạnh Jenkins và GitLab CI, và người phỏng vấn hay hỏi gì về tất cả những thứ đó.</p>
<p>Bài này và bài kế tiếp là cửa vào của cả khoá. Phần 2 kể những chuyện có thật xảy ra khi <em>không có</em> CI — và khi chính CI là điểm yếu — rồi đưa bạn một kế hoạch học. Sau đó bài 0.1–0.4 tháo một cú hỏng thật ra từng mảnh, gọi tên bốn khối xây dựng, đọc một workflow thật từng dòng, và trải ra mười lăm chương.</p>

<h3>CI/CD — nói bằng hình ảnh đời thường trước</h3>
${slide('ga-00', 3, 'CI giống bếp trưởng nếm MỌI món trước khi ra bàn')}
<p>Tạm quên định nghĩa trong sách. Hãy hình dung căn bếp của một nhà hàng. Các đầu bếp nấu món; trước khi bất kỳ đĩa nào rời bếp, bếp trưởng nếm thử. Không phải vì đầu bếp dở — mà vì một món bị khách trả về tốn hơn rất nhiều so với một thìa nếm ở quầy ra món. Món hỏng bắt được trong bếp là ba mươi giây sửa; món hỏng do khách phát hiện là hoàn tiền, phàn nàn và một đánh giá một sao.</p>
<p>Phần mềm cũng mắc đúng bài toán đó. Bạn viết mã, commit, push. <strong>Continuous Integration — CI (tích hợp liên tục)</strong> chính là bếp trưởng: mỗi lần có ai push, một cái máy KHÔNG phải laptop của bạn lấy mã về mới tinh, cài những thứ cần, rồi chạy các phép kiểm cả nhóm đã thống nhất — kiểm kiểu, test, dựng bản. Hai phút sau, cạnh commit của bạn hiện ✓ hoặc ✗. <strong>Continuous Delivery / Deployment — CD (giao hàng / triển khai liên tục)</strong> là người bồi bàn: đưa phiên bản đã qua kiểm tới tay người dùng, theo CÙNG một cách, mọi lần.</p>
<div class="kv-grid">
<div class="kv"><span class="k">🍳 Nếm ở quầy ra món</span><span class="v">CI: mọi thay đổi được kiểm tự động, trên máy sạch, trong vài phút — chứ không phải mỗi tháng một lần trước ngày phát hành.</span></div>
<div class="kv"><span class="k">🏭 Kiểm tra trên dây chuyền</span><span class="v">Nhà máy ô tô kiểm từng chiếc xe ở từng trạm thay vì chỉ kiểm chiếc xe hoàn chỉnh ở cuối. CI kiểm từng commit thay vì chỉ kiểm bản phát hành cuối cùng.</span></div>
<div class="kv"><span class="k">🍽 Bưng món theo cùng một cách</span><span class="v">CD: đường từ "đã qua kiểm" tới "trong tay người dùng" là một script, không phải một người phải nhớ tám bước lúc 11 giờ đêm.</span></div>
</div>

<h3>Nói cho chính xác: CI, Continuous Delivery, Continuous Deployment</h3>
${slide('ga-00', 4, 'CI, Delivery, Deployment: ba điểm dừng khác nhau')}
<p>Ba thuật ngữ này hay bị lẫn — trong tin tuyển dụng và đôi khi cả trong buổi phỏng vấn — nên hãy học khác biệt một lần cho chắc:</p>
<table>
<thead><tr><th>Thuật ngữ</th><th>Cái gì diễn ra tự động</th><th>Dừng ở đâu</th><th>Ai quyết định phát hành</th></tr></thead>
<tbody>
<tr><td><strong>Continuous Integration</strong> (tích hợp liên tục)</td><td>mỗi lần push đều được dựng và test; mọi người gộp vào nhánh chính thường xuyên (ít nhất mỗi ngày)</td><td>một bản dựng đã được kiểm</td><td>chưa phải phát hành</td></tr>
<tr><td><strong>Continuous Delivery</strong> (giao hàng liên tục)</td><td>CI + bản dựng được đóng gói và đưa lên môi trường thử (staging); LUÔN sẵn sàng phát hành</td><td>còn đúng một nút bấm trước production</td><td>một NGƯỜI bấm "phát hành"</td></tr>
<tr><td><strong>Continuous Deployment</strong> (triển khai liên tục)</td><td>mọi thứ ở trên, và cả production</td><td>không dừng — xanh là lên</td><td>không ai cả; bộ test chính là quyết định</td></tr>
</tbody>
</table>
<p>"CD" có thể là một trong hai cái cuối; khi ai đó nói "CD", hỏi lại "cái nào?" là hoàn toàn chính đáng. Kho mã này là một ví dụ thật về một lựa chọn có chủ đích: CI chạy tự động trên pull request, nhưng deploy là một script do CON NGƯỜI chạy (bài 0.3 và Chương 9 giải thích vì sao bản push-là-deploy đã bị tắt sau hai sự cố).</p>

<h3>Một commit đi qua pipeline</h3>
${slide('ga-00', 5, 'Một commit đi qua pipeline trong vài phút, và có đồ thị để nhìn')}
<p><strong>Pipeline (đường ống)</strong> là chuỗi các bước tự động mà một commit đi qua. Trong GitHub Actions, nó được mô tả bằng một tệp YAML trong <code>.github/workflows/</code>. Cái nhỏ nhất có thật trông như sau — nó đã chạy trên sân tập của khoá thành lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35988364005" target="_blank" rel="noopener">35988364005</a>:</p>
<pre><code class="language-yaml">name: ch00 — xin chao CI
on:
  push:
    branches: [ch00-mo-dau]      # KHI NÀO: có push vào nhánh này
jobs:
  chao:
    runs-on: ubuntu-24.04        # Ở ĐÂU: một máy Linux mới tinh của GitHub
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4          # lấy mã về
      - name: Noi xin chao
        run: |
          echo "Xin chao tu runner cua GitHub!"
          echo "commit: $GITHUB_SHA"
          echo "CI=$CI  so CPU: $(nproc)  Node: $(node --version)"</code></pre>
<div class="out">✓ ch00-mo-dau ch00 — xin chao CI · 35988364005
✓ chao in 4s

Xin chao tu runner cua GitHub!
commit: 864c5506f791fed4e58cb7e893604a2f5dd37e54
nhanh:  ch00-mo-dau   nguoi push: cuonghoang1103
CI=true  so CPU: 4  Node: v22.23.2</div>
<p>Bốn giây, trên một cái máy trong một trung tâm dữ liệu bạn sẽ không bao giờ nhìn thấy, in ra mã commit của bạn rồi biến mất. Thay các dòng <code>echo</code> bằng <code>npm ci</code> và <code>npm test</code> là bạn có CI thật. Mọi thứ khác trong khoá này — kích hoạt, cache, bí mật, ma trận, deploy — đều là để câu trả lời ấy tới NHANH hơn, AN TOÀN hơn và có NGHĨA hơn.</p>

<h3>CI ra đời thế nào — ba mươi năm trong hai slide</h3>
${slide('ga-00', 6, 'CI ra đời trước GitHub Actions gần 30 năm')}
<p>CI già hơn phần lớn công cụ bạn đang dùng:</p>
<ul>
<li><strong>1991</strong> — Grady Booch dùng cụm từ "continuous integration" trong cuốn sách về thiết kế hướng đối tượng. Như Martin Fowler sau này ghi chú, đó mới là một cụm từ nói lướt qua, chưa phải một thực hành.</li>
<li><strong>1997–1999</strong> — Kent Beck và Ron Jeffries định hình <strong>Extreme Programming — XP (lập trình cực hạn)</strong> trong một dự án tính lương của Chrysler; tích hợp nhiều lần mỗi ngày, có bản dựng và test tự động, trở thành một thực hành cốt lõi của nó.</li>
<li><strong>10/09/2000</strong> — Martin Fowler đăng bài "Continuous Integration" (viết lại năm 2006, sửa lớn lần nữa tháng 01/2024). Tới giờ nó vẫn là phát biểu rõ ràng nhất về ý tưởng này.</li>
<li><strong>2001</strong> — <strong>CruiseControl</strong> của ThoughtWorks là một trong những máy chủ CI mã nguồn mở đầu tiên: một cái máy canh kho mã và dựng MỌI thay đổi.</li>
<li><strong>07/02/2005</strong> — Kohsuke Kawaguchi ở Sun Microsystems phát hành <strong>Hudson</strong>. Sau khi Oracle mua Sun, một tranh chấp về tên gọi khiến cộng đồng bỏ phiếu ngày 29/01/2011 đổi tên dự án thành <strong>Jenkins</strong> — tới nay vẫn là một trong những máy chủ CI được dùng nhiều nhất trong doanh nghiệp.</li>
</ul>
${slide('ga-00', 7, 'Rồi CI chuyển về nằm ngay cạnh mã: 2011 → 2019')}
<ul>
<li><strong>2011</strong> — <strong>Travis CI</strong> (Berlin) và <strong>CircleCI</strong> (09/2011) đưa CI lên mây, với tệp cấu hình <em>nằm trong kho mã</em>. Travis là dịch vụ CI đầu tiên miễn phí cho dự án mã nguồn mở — cho tới 12/2020.</li>
<li><strong>22/09/2015</strong> — GitLab 8.0 đưa <strong>GitLab CI</strong> thành một phần của chính GitLab: mã và pipeline trên cùng một nền tảng.</li>
<li><strong>16/10/2018</strong> — GitHub công bố <strong>GitHub Actions</strong> ở hội nghị Universe. Phiên bản đầu dùng tệp HCL (<code>main.workflow</code>) và nhắm tới tự động hoá nói chung, chưa phải CI.</li>
<li><strong>08/08/2019</strong> — GitHub công bố CI/CD trong Actions: workflow YAML, runner Linux, macOS và Windows, dựng theo ma trận (matrix), nhật ký trực tiếp, miễn phí cho kho công khai. Workflow HCL ngừng chạy từ <strong>30/09/2019</strong>.</li>
<li><strong>13/11/2019</strong> — GitHub Actions chính thức ra mắt cho mọi người (GA — general availability).</li>
</ul>
<div class="callout ok">
<p><strong>Lịch sử dạy điều gì.</strong> Mỗi bước lại đưa CI lại GẦN mã hơn: từ một thực hành (XP), tới một máy chủ ai đó chạy trong phòng kỹ thuật (CruiseControl, Jenkins), tới một tệp trong kho do một dịch vụ chạy (Travis, CircleCI), tới một tính năng của chính nền tảng nơi mã đang nằm (GitLab CI, GitHub Actions). Lý do hay được nêu nhất khi chọn công cụ CI hôm nay chính là thế — khảo sát CI/CD 2025 của JetBrains trích câu "nó sống ở nơi mã của chúng tôi sống".</p>
</div>

<h3>GitHub Actions đứng cạnh Jenkins, GitLab CI và CircleCI</h3>
${slide('ga-00', 8, 'Bốn công cụ CI: khác ở chỗ chạy và chỗ đặt cấu hình')}
<p>Đi làm bạn sẽ gặp cả bốn, thường là hai cái cùng lúc. Các ý tưởng chuyển sang gần như nguyên vẹn — sự kiện → pipeline → job → bước → máy chạy — nên học kỹ một cái thì những cái kia phần lớn chỉ là cú pháp:</p>
<ul>
<li><strong>GitHub Actions</strong> — lựa chọn tự nhiên khi mã nằm trên GitHub; kho action làm sẵn khổng lồ; runner chuẩn miễn phí cho kho công khai.</li>
<li><strong>GitLab CI/CD</strong> — cùng ý tưởng, nằm trong GitLab; được các công ty tự host GitLab ưa dùng.</li>
<li><strong>Jenkins</strong> — tự host, cực kỳ linh hoạt nhờ plugin, phổ biến ở các tổ chức lớn và lâu đời. Bạn tự chạy và tự bảo trì máy chủ.</li>
<li><strong>CircleCI</strong> — dịch vụ CI trên mây, không phụ thuộc mã nằm ở đâu, nổi tiếng với các tính năng tăng tốc bản dựng.</li>
</ul>
<p>Bản đồ từ vựng nhanh: một <em>workflow</em> của GitHub là một <em>pipeline</em> của GitLab hay một <em>Pipeline</em> của Jenkins; một <em>action</em> của GitHub gần giống một <em>plugin</em> của Jenkins hay một <em>orb</em> của CircleCI; <em>runner</em> ở GitLab cũng gọi là runner, ở Jenkins gọi là <em>agent</em>.</p>

<h3>Có thật sự quan trọng không? Nhìn con số</h3>
${slide('ga-00', 9, 'Con số hiện nay: CI là việc hằng ngày, không phải tuỳ chọn')}
<ul>
<li>Báo cáo Octoverse 2025 của GitHub (dữ liệu 09/2024–08/2025) đếm được <strong>11,5 tỷ phút GitHub Actions</strong> dùng trong các dự án công khai trong một năm, <strong>tăng 35%</strong>, trên một nền tảng có hơn 180 triệu lập trình viên.</li>
<li>Khảo sát "The State of CI/CD in 2025" của JetBrains (805 người trả lời) thấy <strong>62%</strong> dùng GitHub Actions cho dự án cá nhân và <strong>41%</strong> dùng trong tổ chức của họ — và <strong>32%</strong> tổ chức chạy HAI công cụ CI cùng lúc.</li>
</ul>
<p>Đọc chúng như một HƯỚNG đi, không phải định luật: mỗi khảo sát có tệp người trả lời riêng. Nhưng hướng thì rõ — CI là việc thường ngày của các nhóm phần mềm, và GitHub Actions là công cụ bạn có khả năng gặp ĐẦU TIÊN nhất.</p>

<h3>Vì sao công ty coi trọng nó</h3>
${slide('ga-00', 10, 'Công ty cần CI vì lỗi rẻ nhất lúc nó vừa sinh ra')}
<p>Công ty không chạy CI vì nó hợp mốt. Họ chạy nó vì thứ nó tiết kiệm được:</p>
<ul>
<li><strong>Lỗi được thấy trong vài phút, bởi chính người gây ra nó.</strong> Một dấu ✗ đỏ hai phút sau khi push tới tay người còn nhớ mình vừa sửa gì. Cùng lỗi đó thấy sau hai tuần thì cần cả một cuộc điều tra.</li>
<li><strong>Nhiều người, một nhánh chính.</strong> Mười lập trình viên gộp vào cùng một nhánh mỗi ngày chỉ ổn khi MỌI pull request đều được kiểm trên máy sạch trước.</li>
<li><strong>Phát hành trở nên nhàm chán.</strong> Khi dựng và deploy đã là script và được thử mỗi ngày, phát hành vào chiều thứ Sáu không còn là một sự kiện.</li>
<li><strong>Có dấu vết.</strong> Ai đẩy gì, phép kiểm nào đã chạy, nhật ký ra sao — kiểm toán và buổi rút kinh nghiệm sự cố đọc lại được.</li>
<li><strong>Người mới vào nhanh hơn.</strong> Workflow là tài liệu CHẠY ĐƯỢC: nó chỉ chính xác dự án được dựng và test thế nào.</li>
<li><strong>Bảo mật, theo cả hai chiều.</strong> CI chạy quét phụ thuộc và quét bí mật — và cũng là nơi cất những bí mật quyền lực nhất của dự án, thứ mà Phần 2 cho thấy là một mục tiêu tấn công.</li>
</ul>

<h3>Nó giúp gì cho chính BẠN khi đi làm</h3>
<p>Ở công việc đầu tiên, có lẽ bạn chưa thiết kế pipeline cho cả công ty. Bạn sẽ làm những việc XUNG QUANH nó, mỗi tuần:</p>
<table>
<thead><tr><th>Bạn sẽ…</th><th>Bạn cần biết…</th><th>Học ở</th></tr></thead>
<tbody>
<tr><td>thấy pull request của mình đỏ và sửa trước khi được review</td><td>đọc một run hỏng: job → bước → dòng lỗi đầu tiên</td><td>Phần 2, Chương 8</td></tr>
<tr><td>thêm một bước test hay lint vào workflow có sẵn</td><td>bước, job, xanh nghĩa là gì</td><td>0.2, 0.3, Chương 2</td></tr>
<tr><td>làm một pipeline chậm nhanh lên</td><td>cache, job song song, đường tới hạn</td><td>Chương 5, 7</td></tr>
<tr><td>thêm một secret hay khoá API cho tích hợp mới</td><td>secret, quyền, vì sao chúng rò</td><td>Chương 6</td></tr>
<tr><td>nâng phiên bản action sau một cảnh báo lỗi thời</td><td><code>@v4</code> nghĩa là gì, ghim theo SHA</td><td>Chương 4</td></tr>
<tr><td>bị hỏi "tại mã hay tại chập chờn (flaky)?"</td><td>tái lập, đo, quyết định</td><td>Chương 8, 10</td></tr>
</tbody>
</table>
<p>Với sinh viên, nó có ích còn sớm hơn: một đồ án nhóm mà mọi lần push đều được kiểm là một đồ án không vỡ vào đêm trước buổi demo — Phần 2 có đúng câu chuyện đó.</p>

<h3>Người phỏng vấn hay hỏi gì</h3>
${slide('ga-00', 11, 'Câu phỏng vấn hay gặp về CI/CD — và ý trả lời gọn')}
<p>Với vị trí thực tập hay junior, câu hỏi về CI/CD thường kiểm SỰ HIỂU, không phải đố mẹo. Sáu câu trên slide lặp đi lặp lại; ý trả lời ở đó là bộ khung. Hai câu nên luyện nói thành tiếng:</p>
<div class="callout tip">
<p><strong>"CI khác CD thế nào?"</strong> "CI nghĩa là mọi thay đổi được dựng và test tự động và được gộp thường xuyên, để lỗi tích hợp lộ ra trong vài phút. CD đưa bản dựng đã kiểm đi xa hơn: Continuous Delivery giữ nó luôn sẵn sàng phát hành và một người bấm phát hành; Continuous Deployment tự phát hành khi pipeline xanh." Rồi thêm MỘT câu từ trải nghiệm của chính bạn — "ở dự án của em, CI chạy trên mọi pull request còn deploy là bước làm tay vì…".</p>
</div>
<div class="callout tip">
<p><strong>"Pipeline của em đỏ. Em làm gì?"</strong> "Em mở job hỏng, rồi bước hỏng, đọc dòng lỗi ĐẦU TIÊN — không phải dòng cuối. Em xem commit của mình có đụng vào phần đó không, thử tái lập ở máy từ một bản clone sạch, và chỉ chạy lại khi có lý do để nghĩ nó chập chờn. Nếu đúng là chập chờn thì em ghi nhận lại, chứ không chỉ bấm chạy lại." Câu trả lời đó cho thấy PHƯƠNG PHÁP — và đó chính là thứ câu hỏi đang kiểm.</p>
</div>

<h3>Khoá này sẽ đưa bạn đi tới đâu</h3>
${slide('ga-00', 12, 'Khoá này đưa bạn qua 16 chặng, từ nhập môn tới dự án thật')}
<p>Mười sáu chặng. Mục 0 (bạn đang ở đây) giải thích vấn đề. Chương 1–4 dạy bạn viết workflow: tệp và những bẫy YAML, job và runner, biểu thức, action. Chương 5–7 làm chúng nhanh và an toàn: cache, bí mật và quyền, tốc độ và chi phí. Chương 8–10 là những gì hỏng: run đỏ, deploy, chẩn đoán bằng sự cố thật; Chương 11 ôn lại. Chương 12–15 là mức mà công ty tuyển: workflow dùng lại, runner riêng, cổng chất lượng và bảo mật chuỗi cung ứng, phát hành tự động, và một pipeline dự án cuối khoá dựng từ số 0 kèm bài thi cuối khoá hai mươi câu.</p>

<div class="pitfall co-tieu-de"><strong>Người mới hay bắt đầu sai chỗ thế này.</strong> Một bạn chép một workflow từ blog, push lên, và nó xanh. Hai tuần sau nó đỏ vì một lý do chẳng ai hiểu — phiên bản Node bị dời, thiếu một secret, cache bị cũ — và kết luận là "CI mong manh quá", tệp bị xoá. Không nguyên nhân nào khó; mỗi cái chỉ là một ý của Chương 2, 4, 5 hay 6. Chép một tệp chạy được thì không sao; <em>không biết từng dòng làm gì</em> mới là thứ gây đau. Khoá này giải thích từng dòng bạn sẽ chép.</div>

<h3>🧪 Thực hành (10 phút — chắc chắn làm được)</h3>
<div class="callout ok"><ol>
<li>Tạo một kho mới <strong>công khai</strong> trên GitHub (ví dụ <code>thu-ci</code>), tích chọn tạo README.</li>
<li>Ngay trên trình duyệt, thêm tệp <code>.github/workflows/xin-chao.yml</code> với nội dung YAML ở mục "Một commit đi qua pipeline" phía trên (đổi <code>branches: [ch00-mo-dau]</code> thành <code>branches: [main]</code>), rồi commit vào <code>main</code>.</li>
<li>Mở tab <strong>Actions</strong>. Bấm vào lần chạy, rồi job <code>chao</code>, rồi bước <code>Noi xin chao</code>.</li>
<li>Viết một câu, bằng lời của bạn, nói Continuous Delivery khác Continuous Deployment ở đâu.</li>
</ol>
<p><strong>Đạt khi:</strong> lần chạy của bạn có dấu ✓ xanh, nhật ký in ra <code>CI=true</code> và mã commit của bạn, và câu của bạn nói rõ AI (hoặc CÁI GÌ) quyết định việc phát hành.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">CI — Continuous Integration (tích hợp liên tục)</span><span class="v">Gộp mã thường xuyên; mọi thay đổi được dựng và test tự động trên một máy sạch.</span></div>
<div class="kv"><span class="k">Continuous Delivery (giao hàng liên tục)</span><span class="v">Mọi bản dựng đã kiểm luôn sẵn sàng phát hành; một người quyết định lúc nào phát hành.</span></div>
<div class="kv"><span class="k">Continuous Deployment (triển khai liên tục)</span><span class="v">Mọi bản dựng đã kiểm tự động lên production.</span></div>
<div class="kv"><span class="k">Pipeline (đường ống)</span><span class="v">Chuỗi bước tự động mà một thay đổi đi qua; trong GitHub Actions gọi là workflow.</span></div>
<div class="kv"><span class="k">Workflow (quy trình tự động)</span><span class="v">Một tệp YAML trong <code>.github/workflows/</code> nói KHI NÀO chạy và LÀM GÌ.</span></div>
<div class="kv"><span class="k">Runner (máy chạy)</span><span class="v">Cái máy thực thi một job — máy ảo mới của GitHub, hoặc máy bạn tự host.</span></div>
<div class="kv"><span class="k">Check (phép kiểm)</span><span class="v">Dấu ✓ / ✗ hiện cạnh commit hay pull request, mỗi job một dấu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>CI là nếm mọi món trước khi ra khỏi bếp: mỗi lần push được dựng và test trên máy sạch trong vài phút.</li>
<li>Continuous Delivery dừng trước production đúng một nút bấm; Continuous Deployment thì không dừng.</li>
<li>Ý tưởng có trước công cụ: Booch 1991, XP cuối thập niên 1990, bài của Fowler năm 2000, CruiseControl 2001, Hudson 2005 → Jenkins 2011.</li>
<li>GitHub Actions được công bố 16/10/2018, có CI/CD bằng YAML ngày 08/08/2019 và ra mắt chính thức 13/11/2019.</li>
<li>11,5 tỷ phút Actions trong các dự án công khai trong một năm (Octoverse 2025); 41% người trả lời khảo sát JetBrains 2025 dùng nó ở chỗ làm.</li>
<li>Với bạn: đồ án nhóm ít vỡ hơn, đúng những việc hằng tuần của một lập trình viên junior, và câu trả lời cho các câu phỏng vấn CI/CD hay gặp nhất.</li>
</ul>

<a class="link-card" href="https://martinfowler.com/articles/continuousIntegration.html" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — Continuous Integration</span><span class="lc-sub">Đăng lần đầu 10/09/2000, viết lại 2006, sửa lớn 2024 — kèm ghi chú về Booch và Kent Beck.</span></span></a>
<a class="link-card" href="https://github.blog/news-insights/product-news/github-actions-now-supports-ci-cd/" target="_blank" rel="noopener"><span class="lc-ico">📰</span><span class="lc-body"><span class="lc-title">GitHub Blog — GitHub Actions now supports CI/CD (08/08/2019)</span><span class="lc-sub">YAML, Linux/macOS/Windows, dựng theo ma trận, miễn phí cho kho công khai, ra mắt chính thức 13/11/2019.</span></span></a>
<a class="link-card" href="https://github.blog/changelog/2019-09-17-github-actions-will-stop-running-workflows-written-in-hcl/" target="_blank" rel="noopener"><span class="lc-ico">🗒</span><span class="lc-body"><span class="lc-title">GitHub Changelog — workflow HCL ngừng chạy (17/09/2019)</span><span class="lc-sub">Cú chuyển từ <code>main.workflow</code> sang các tệp YAML bạn viết hôm nay.</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Jenkins_(software)" target="_blank" rel="noopener"><span class="lc-ico">📚</span><span class="lc-body"><span class="lc-title">Wikipedia — Jenkins (và Hudson, Continuous integration)</span><span class="lc-sub">Hudson 2005 ở Sun, cuộc bỏ phiếu đổi tên 2011, CruiseControl 2001.</span></span></a>
<a class="link-card" href="https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">GitHub Octoverse 2025</span><span class="lc-sub">11,5 tỷ phút Actions ở dự án công khai, +35%; hơn 180 triệu lập trình viên.</span></span></a>
<a class="link-card" href="https://blog.jetbrains.com/teamcity/2025/10/the-state-of-cicd/" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">JetBrains — The State of CI/CD in 2025</span><span class="lc-sub">805 người trả lời; GitHub Actions 62% dự án cá nhân, 41% ở chỗ làm; 32% tổ chức dùng hai công cụ CI.</span></span></a>
<a class="link-card" href="https://docs.github.com/en/actions/get-started/understand-github-actions" target="_blank" rel="noopener"><span class="lc-ico">📘</span><span class="lc-body"><span class="lc-title">GitHub Docs — Understanding GitHub Actions</span><span class="lc-sub">Tổng quan chính thức: workflow, sự kiện, job, action, runner.</span></span></a>
<p class="note-ct"><strong>Bài kế tiếp:</strong> "Bắt đầu tại đây" phần 2 — những sự cố có thật ở các công ty không có CI (và có CI mà dùng ẩu), sự cố của chính kho mã này, và một kế hoạch học giúp bạn đi tới cùng.</p>
</div>
`,
    },

    /* ─────────────────────── Bắt đầu tại đây (2/2) ─────────────────────── */
    {
      title: 'Start here (2/2) — Without CI/CD: real incidents, and how to learn without giving up|||Bắt đầu tại đây (2/2) — Khi không có CI/CD: sự cố thật, và cách học không bỏ cuộc',
      slug: 'ga-0-6-bat-dau-khi-khong-co-ci',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Knight Capital 2012 mất 460 triệu USD vì deploy tay sót một máy, tj-actions 2025 và Codecov 2021 khi chính CI bị tấn công, hai workflow deploy đua nhau của kho này, một đêm trước demo đồ án, ba nỗi sợ khi mới học CI, cách đọc một run đỏ, và lộ trình tối thiểu/đầy đủ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>What goes wrong without CI/CD — and when CI itself is the weak point</h2>
<p class="lead">Part 1 was the theory: tasting every dish before it leaves the kitchen. This part is the evidence. Four true stories with sources — a trading firm that lost more than 460 million dollars in 45 minutes, two attacks where CI was the target, and the outage this course&#39;s own repository caused — plus one illustrative student story, the three things that make beginners quit, how to read a red run, and a study plan.</p>

<h3>Knight Capital, 2012: a manual deploy that missed one server</h3>
${slide('ga-00', 13, 'Knight Capital 2012: a manual deploy missed 1 server, $460M lost')}
<p>Knight Capital was one of the largest traders in US equities. In late July 2012 it prepared new code for its order router, to take part in a new NYSE programme. The US Securities and Exchange Commission later described what happened, in its order against the firm (Release 34-70694):</p>
<ul>
<li>From <strong>27 July 2012</strong>, a technician copied the new code to the router&#39;s servers by hand, in stages. <strong>One of the eight servers was missed.</strong> No second technician reviewed the deployment, and the firm had no written procedure requiring one.</li>
<li>On that eighth server, an old, long-unused feature called "Power Peg" was still present. The new code reused a flag that had once switched it on.</li>
<li>On <strong>1 August 2012</strong>, when the market opened, the seven updated servers behaved correctly. The eighth began sending orders. In <strong>45 minutes</strong> Knight sent <strong>more than 4 million orders</strong> while trying to fill <strong>212</strong> customer orders, trading more than 397 million shares.</li>
<li>The firm lost <strong>more than 460 million dollars</strong>. On 16 October 2013 the SEC announced that Knight had agreed to pay <strong>12 million dollars</strong> to settle the charges.</li>
</ul>
<div class="callout warn">
<p><strong>What this has to do with CI/CD.</strong> Nothing about the new code was exotic. The failure was the <em>deploy</em>: a manual, eight-times-repeated copy with no automatic check that all eight servers now ran the same version. A scripted deployment does the same thing to every server or stops; a post-deploy check compares versions and fails loudly. That is precisely the "deliver the same way every time" half of CI/CD — and the reason this course spends Chapters 9 and 10 on deploys and on checks that can actually fail.</p>
</div>

<h3>When CI itself is attacked: tj-actions/changed-files, March 2025</h3>
${slide('ga-00', 14, 'tj-actions 03/2025: one tag moved, secrets leaked into logs')}
<p>CI is not only a safety net; it is also where a project keeps its most powerful secrets — deploy keys, cloud credentials, package-publishing tokens. That makes it a target. The clearest recent example is a popular GitHub Action, <code>tj-actions/changed-files</code>, used by more than 23,000 repositories (GitHub advisory GHSA-mrrh-fwg8-r2c3, CVE-2025-30066):</p>
<ul>
<li>On <strong>14–15 March 2025</strong>, attackers <strong>retroactively moved several of the action&#39;s version tags</strong> — the advisory lists <code>v1.0.0</code>, <code>v35.7.7-sec</code> and <code>v44.5.1</code> — to point at a malicious commit.</li>
<li>Every workflow that referenced a moved tag — say <code>uses: tj-actions/changed-files@v44.5.1</code> — therefore ran the attacker&#39;s code on its next run, without any change on its side. The code read secrets out of the runner&#39;s memory and printed them into the workflow log.</li>
<li>On public repositories, workflow logs are readable by anyone. The US agency CISA issued an alert on 18 March 2025; the fixed version is 46.0.1.</li>
</ul>
<p>The lesson is concrete and you will use it from Chapter 4 on: <strong>a tag like <code>@v44.5.1</code> is a pointer that its owner — or someone who stole their access — can move. A full commit SHA cannot be moved.</strong> Pinning third-party actions to SHAs, and giving the workflow token the minimum permissions, would have limited the damage.</p>

<h3>Codecov, 2021: two months of CI secrets sent elsewhere</h3>
${slide('ga-00', 15, 'Codecov 2021: a script in CI sent secrets out for two months')}
<p>Codecov, a test-coverage service, distributed a "Bash Uploader" script that thousands of CI pipelines downloaded and ran on every build. According to Codecov&#39;s own security update, on <strong>31 January 2021</strong> an attacker who had obtained a cloud-storage key — exposed through a mistake in Codecov&#39;s Docker image build process — modified that script. The altered line sent the output of <code>git remote -v</code> and <code>env</code> — every environment variable of the CI job, including tokens and keys — to a third-party server. It was discovered and fixed on <strong>1 April 2021</strong>: more than two months of silent leakage.</p>
<p>Nothing looked wrong in any log. The builds were green. That is the uncomfortable part: <strong>green tells you your checks passed; it tells you nothing about what else ran with your secrets.</strong> Chapter 6 measures what a job can reach; Chapter 14 covers supply-chain defences.</p>

<h3>This very repository: two deploy workflows racing each other</h3>
${slide('ga-00', 16, 'This repository: one push, two deploy workflows racing')}
<p>The course is built on the repository of cuongthai.com, and it has its own incident, documented in the project notes. Two workflows — <code>deploy-ghcr.yml</code> (build images, swap them on the VPS, run database migrations) and <code>backend-vps.yml</code> (recreate the backend container) — both ran automatically on every push to <code>main</code>. One push started both. Nothing made one wait for the other:</p>
<ul>
<li><strong>3 July 2026</strong> — the feed returned HTTP 500: the new image was running while the database schema lagged behind it.</li>
<li><strong>6 July 2026</strong> — a recreate race killed the backend container (<code>Exited(137)</code>) and left orphan containers; recovered by starting the container by hand.</li>
</ul>
<p>The fix was not a clever lock. Both workflows were changed to <code>workflow_dispatch</code> only — run by hand — and deploying became a script a person runs. A push now triggers only <code>ci-lint.yml</code>, which checks and deploys nothing. Chapter 9 takes this apart properly, including the <code>concurrency:</code> setting that could have serialised the two.</p>

<h3>An illustrative student story: the night before the demo</h3>
${slide('ga-00', 17, 'Illustrative: the night before a project demo')}
<p><em>This one is illustrative — assembled from very common mistakes, not a specific incident.</em> A team of four has a demo at 8 a.m. At 22:40, A pushes "small UI fix" without running anything, because it is only CSS. While editing, A accidentally deleted an import; A&#39;s laptop still has an old build, so everything still works there. At 22:55, B pulls and gets a blank page. By 01:30 the whole team is going through commits one by one, because nothing checked any of them at push time. With a ten-line workflow that runs <code>npm ci</code> and <code>npm run build</code> on every pull request, A&#39;s change shows a red ✗ at 22:42 with "Module not found", A fixes it in three minutes, and B never sees the blank page.</p>

<h3>The three fears that make beginners quit</h3>
${slide('ga-00', 18, 'Three fears when starting CI, and how to get past each')}
<ul>
<li><strong>"YAML is fragile — one wrong space and it breaks."</strong> True, and the error messages are vague. Use VS Code with the official GitHub Actions extension (it validates keys as you type), run <code>actionlint</code> before pushing (lesson 0.3 shows the one-line Docker command), and start from a small working file you change one line at a time.</li>
<li><strong>"Red CI means I am bad at this."</strong> Red means CI is doing its job — it caught something before a user did. Every lesson in this course has deliberately red runs; you will make your own on purpose from lesson 0.1.</li>
<li><strong>"The log is thousands of lines."</strong> You never read it top to bottom. See the next section.</li>
</ul>

<h3>How to read a red run — the four-step habit</h3>
${slide('ga-00', 19, 'Reading a red run: job ✗ → step ✗ → first error line')}
<ol>
<li><strong>Which job?</strong> The run page (or <code>gh run view &lt;id&gt;</code>) marks each job ✓ or ✗. Ignore the green ones.</li>
<li><strong>Which step?</strong> Inside the red job, exactly one step is red; the ones after it did not run.</li>
<li><strong>The first error line, not the last.</strong> Search the step for <code>##[error]</code> or "Error", then read a few lines <em>upward</em>: the last line is usually just "Process completed with exit code 1"; the cause is above it. <code>gh run view &lt;id&gt; --log-failed</code> prints only the failed steps.</li>
<li><strong>Is it mine?</strong> Does your commit touch that area? Can you reproduce it from a clean checkout (lesson 0.1)? Only then decide between "fix" and "re-run".</li>
</ol>
<p>On the sandbox, those four steps took three commands and ended at <code>Error: ENOENT: no such file or directory, open '…/ch00/config.local.json'</code> — a file that existed only on the author&#39;s laptop. Lesson 0.1 is that story.</p>

<h3>A study plan: minimum and full</h3>
${slide('ga-00', 20, 'Two paths: minimum for a job, full for expert level')}
<p><strong>Minimum (about two weeks)</strong> — enough to write, read and fix CI for a team project and to hold a first-interview conversation: Section 0 → Chapters 1, 2, 3 → Chapter 5 (caching) and 6 (secrets) → Chapter 8 (when CI is red). <strong>Full (six to eight weeks)</strong> — add Chapters 4, 7, 9 and 10, review with Chapter 11, then Chapters 12–14 (reuse, your own runners, quality gates, supply-chain security, releases) and the Chapter 15 capstone. That is the "from basics to expert" range interviewers mean.</p>

<div class="pitfall co-tieu-de"><strong>Trap — "green, so it is safe".</strong> In all three outside incidents above, the checks that existed passed. Knight Capital had no check that all eight servers matched; tj-actions and Codecov ran inside green builds. Green is a statement about the checks you chose. The skill this course builds is choosing them — and knowing what a green run does <em>not</em> tell you.</div>

<div class="callout tip">
<p><strong>Interview question you will meet: "What is a supply-chain attack in CI, and how do you reduce the risk?"</strong> "It is when code you did not write — an action, a script you download, a dependency — runs inside your pipeline with your secrets. The tj-actions attack in March 2025 moved version tags to a malicious commit and dumped secrets into logs. To reduce the risk: pin third-party actions to a full commit SHA, give <code>GITHUB_TOKEN</code> the minimum <code>permissions:</code>, prefer short-lived credentials such as OIDC over stored keys, and keep Dependabot updating the pins." Naming one real incident with its date makes the answer credible.</p>
</div>

<h3>🧪 Practice (10–15 min — you will succeed)</h3>
<div class="callout ok"><ol>
<li>Open the course sandbox run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986054380" target="_blank" rel="noopener">35986054380</a> in the browser (or <code>gh run view 35986054380 -R cuonghoang1103/ga-san-tap</code>). Apply the four-step habit: which job, which step, which first error line?</li>
<li>In your own test repository (or any public repository you like), open <code>.github/workflows/</code> and list every <code>uses:</code> line. Mark which ones use a tag (<code>@v4</code>) and which use a full SHA.</li>
<li>Choose your path — minimum or full — and write the week you will finish Chapter 1 in your calendar.</li>
</ol>
<p><strong>Done when:</strong> you have written down the job name (<code>kiem</code>), the step name and the <code>ENOENT</code> line; you have a list of your <code>uses:</code> lines with tag or SHA marked; and a date is in your calendar.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Deploy (triển khai)</span><span class="v">Putting a new version onto the machines that serve users. Manual deploys repeat human steps; scripted deploys repeat exactly.</span></div>
<div class="kv"><span class="k">Supply-chain attack (tấn công chuỗi cung ứng)</span><span class="v">Compromising something you depend on — an action, a script, a package — so your pipeline runs the attacker&#39;s code.</span></div>
<div class="kv"><span class="k">Tag vs SHA (thẻ và mã băm commit)</span><span class="v"><code>@v44.5.1</code> is a movable name; <code>@&lt;40-character SHA&gt;</code> always means the same commit.</span></div>
<div class="kv"><span class="k">Secret (bí mật)</span><span class="v">A key or token stored in GitHub and handed to jobs; anything running in the job can read it.</span></div>
<div class="kv"><span class="k"><code>workflow_dispatch</code></span><span class="v">A trigger that runs a workflow only when a person (or API call) starts it.</span></div>
<div class="kv"><span class="k">Race condition (tranh chấp)</span><span class="v">Two processes changing the same thing at once, with a result that depends on who finishes first.</span></div>
<div class="kv"><span class="k"><code>--log-failed</code></span><span class="v"><code>gh run view</code> option that prints only the logs of failed steps.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Knight Capital (1/8/2012): a hand-copied deploy missed one of eight servers; 45 minutes, 4 million orders, more than $460 million lost.</li>
<li>tj-actions (14–15/3/2025): moved version tags ran malicious code in 23,000+ repositories and printed secrets into logs — pin actions to a SHA.</li>
<li>Codecov (31/1–1/4/2021): a modified script sent CI environment variables away for two months, inside green builds.</li>
<li>This repository (3 and 6/7/2026): two push-triggered deploy workflows raced; now deploys are run by hand.</li>
<li>Read red runs in four steps — job, step, first error line, is it mine — and start from a small working file.</li>
<li>Minimum path ~2 weeks (Sections 0–3, 5, 6, 8); full path 6–8 weeks through the Chapter 15 capstone.</li>
</ul>

<a class="link-card" href="https://www.sec.gov/newsroom/press-releases/2013-222" target="_blank" rel="noopener"><span class="lc-ico">⚖️</span><span class="lc-body"><span class="lc-title">SEC — Knight Capital charged (Release 2013-222, 16/10/2013)</span><span class="lc-sub">45 minutes, more than 4 million orders, more than $460 million lost, $12 million settlement.</span></span></a>
<a class="link-card" href="https://www.sec.gov/files/litigation/admin/2013/34-70694.pdf" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">SEC order 34-70694 (PDF)</span><span class="lc-sub">Paragraph 15: one of eight servers missed during a manual deploy, no second-technician review.</span></span></a>
<a class="link-card" href="https://github.com/advisories/GHSA-mrrh-fwg8-r2c3" target="_blank" rel="noopener"><span class="lc-ico">🛡</span><span class="lc-body"><span class="lc-title">GitHub Advisory — tj-actions/changed-files (CVE-2025-30066)</span><span class="lc-sub">Retroactively modified tags, secrets dumped into logs, fixed in 46.0.1.</span></span></a>
<a class="link-card" href="https://about.codecov.io/security-update/" target="_blank" rel="noopener"><span class="lc-ico">🛡</span><span class="lc-body"><span class="lc-title">Codecov — Bash Uploader security update</span><span class="lc-sub">Altered 31/01/2021, discovered 01/04/2021; what the modified line sent.</span></span></a>
<a class="link-card" href="https://docs.github.com/en/actions/reference/security/secure-use" target="_blank" rel="noopener"><span class="lc-ico">📘</span><span class="lc-body"><span class="lc-title">GitHub Docs — Secure use reference</span><span class="lc-sub">Pinning actions to a full-length SHA, least-privilege tokens, untrusted input.</span></span></a>
<p class="note-ct"><strong>Next:</strong> lesson 0.1 — the red run from this repository that started it all, and the claim CI can actually make.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Không có CI/CD thì hỏng ra sao — và khi chính CI là điểm yếu</h2>
<p class="lead">Phần 1 là lý thuyết: nếm mọi món trước khi ra khỏi bếp. Phần này là BẰNG CHỨNG. Bốn chuyện có thật, có nguồn — một công ty giao dịch mất hơn 460 triệu đô la trong 45 phút, hai vụ tấn công mà mục tiêu chính là CI, và sự cố do chính kho mã của khoá học này gây ra — cộng một câu chuyện sinh viên để minh hoạ, ba thứ khiến người mới bỏ cuộc, cách đọc một run đỏ, và một kế hoạch học.</p>

<h3>Knight Capital, 2012: một lần deploy tay sót mất một máy chủ</h3>
${slide('ga-00', 13, 'Knight Capital 2012: deploy tay sót 1 máy, lỗ 460 triệu USD')}
<p>Knight Capital từng là một trong những nhà giao dịch cổ phiếu lớn nhất nước Mỹ. Cuối tháng 7/2012, họ chuẩn bị mã mới cho bộ định tuyến lệnh (router) để tham gia một chương trình mới của sàn NYSE. Uỷ ban Chứng khoán Mỹ (SEC) sau này mô tả lại chuyện đã xảy ra trong lệnh xử phạt công ty (số 34-70694):</p>
<ul>
<li>Từ <strong>27/07/2012</strong>, một kỹ thuật viên chép mã mới lên các máy chủ của router BẰNG TAY, theo từng đợt. <strong>Một trong tám máy chủ bị sót.</strong> Không có kỹ thuật viên thứ hai kiểm lại lần triển khai đó, và công ty không có quy trình viết thành văn nào đòi hỏi điều đó.</li>
<li>Trên máy thứ tám ấy, một tính năng cũ, bỏ không từ lâu, tên "Power Peg" vẫn còn nằm đó. Mã mới lại dùng lại đúng cái cờ (flag) từng bật tính năng này.</li>
<li>Ngày <strong>01/08/2012</strong>, khi thị trường mở cửa, bảy máy đã cập nhật chạy đúng. Máy thứ tám bắt đầu bắn lệnh. Trong <strong>45 phút</strong>, Knight gửi <strong>hơn 4 triệu lệnh</strong> trong lúc cố khớp <strong>212</strong> lệnh của khách, giao dịch hơn 397 triệu cổ phiếu.</li>
<li>Công ty lỗ <strong>hơn 460 triệu đô la</strong>. Ngày 16/10/2013, SEC công bố Knight đồng ý nộp <strong>12 triệu đô la</strong> để dàn xếp các cáo buộc.</li>
</ul>
<div class="callout warn">
<p><strong>Chuyện này liên quan gì tới CI/CD.</strong> Mã mới chẳng có gì kỳ lạ. Cái hỏng là KHÂU DEPLOY: một thao tác chép tay lặp lại tám lần, không có phép kiểm tự động nào xác nhận cả tám máy giờ chạy cùng một phiên bản. Một lần deploy bằng script làm y hệt nhau trên mọi máy hoặc dừng lại; một phép kiểm sau deploy so phiên bản và hỏng ẦM Ỹ. Đó chính xác là nửa "giao hàng theo cùng một cách mọi lần" của CI/CD — và là lý do khoá này dành Chương 9 và 10 cho deploy và cho những phép kiểm có thể hỏng thật.</p>
</div>

<h3>Khi chính CI bị tấn công: tj-actions/changed-files, tháng 3/2025</h3>
${slide('ga-00', 14, 'tj-actions 03/2025: một thẻ bị dời, bí mật lộ ra log')}
<p>CI không chỉ là lưới an toàn; nó còn là nơi dự án cất những bí mật quyền lực nhất — khoá deploy, thông tin đăng nhập đám mây, token phát hành gói. Điều đó biến nó thành mục tiêu. Ví dụ gần đây và rõ nhất là một GitHub Action phổ biến, <code>tj-actions/changed-files</code>, được hơn 23.000 kho mã dùng (cảnh báo GHSA-mrrh-fwg8-r2c3 của GitHub, CVE-2025-30066):</p>
<ul>
<li>Ngày <strong>14–15/03/2025</strong>, kẻ tấn công <strong>dời ngược nhiều thẻ phiên bản</strong> của action — cảnh báo liệt kê <code>v1.0.0</code>, <code>v35.7.7-sec</code> và <code>v44.5.1</code> — sang trỏ vào một commit độc.</li>
<li>Vì thế mọi workflow trỏ vào một thẻ bị dời — ví dụ <code>uses: tj-actions/changed-files@v44.5.1</code> — đều chạy mã của kẻ tấn công ở lần chạy kế tiếp, mà bản thân họ không đổi một dòng nào. Đoạn mã đó đọc bí mật từ bộ nhớ của runner rồi in chúng ra nhật ký workflow.</li>
<li>Ở kho công khai, nhật ký workflow ai cũng đọc được. Cơ quan an ninh mạng Mỹ CISA ra cảnh báo ngày 18/03/2025; bản đã vá là 46.0.1.</li>
</ul>
<p>Bài học rất cụ thể và bạn sẽ dùng nó từ Chương 4: <strong>một thẻ như <code>@v44.5.1</code> là một CON TRỎ mà chủ của nó — hoặc kẻ đã đánh cắp quyền của họ — dời đi được. Một SHA đầy đủ của commit thì không dời được.</strong> Ghim action của bên thứ ba theo SHA, và chỉ cho token của workflow đúng những quyền tối thiểu, lẽ ra đã hạn chế được thiệt hại.</p>

<h3>Codecov, 2021: hai tháng bí mật CI bị gửi đi nơi khác</h3>
${slide('ga-00', 15, 'Codecov 2021: script trong CI gửi bí mật ra ngoài hai tháng')}
<p>Codecov, một dịch vụ đo độ phủ test, phát hành một script "Bash Uploader" mà hàng nghìn pipeline CI tải về và chạy ở MỖI lần dựng. Theo thông báo bảo mật của chính Codecov, ngày <strong>31/01/2021</strong>, một kẻ tấn công lấy được một khoá lưu trữ đám mây — bị lộ do một sai sót trong quy trình dựng ảnh Docker của Codecov — đã sửa script đó. Dòng bị sửa gửi đầu ra của <code>git remote -v</code> và <code>env</code> — MỌI biến môi trường của job CI, gồm cả token và khoá — tới một máy chủ bên thứ ba. Nó bị phát hiện và vá ngày <strong>01/04/2021</strong>: hơn hai tháng rò rỉ âm thầm.</p>
<p>Không nhật ký nào trông bất thường. Các bản dựng đều XANH. Đó là phần khó chịu: <strong>màu xanh nói rằng phép kiểm của bạn đã qua; nó không nói gì về những thứ KHÁC đã chạy cùng bí mật của bạn.</strong> Chương 6 đo xem một job với tới được những gì; Chương 14 nói về cách phòng thủ chuỗi cung ứng.</p>

<h3>Chính kho mã này: hai workflow deploy đua nhau</h3>
${slide('ga-00', 16, 'Chính kho này: một cú push, hai workflow deploy đua nhau')}
<p>Khoá học được dựng trên kho mã của cuongthai.com, và kho này có sự cố của riêng nó, được ghi lại trong ghi chú dự án. Hai workflow — <code>deploy-ghcr.yml</code> (dựng ảnh, tráo ảnh trên VPS, chạy migration cơ sở dữ liệu) và <code>backend-vps.yml</code> (tạo lại container backend) — đều TỰ CHẠY ở mỗi lần push vào <code>main</code>. Một cú push khởi động cả hai. Chẳng có gì bắt cái này chờ cái kia:</p>
<ul>
<li><strong>03/07/2026</strong> — trang feed trả HTTP 500: ảnh mới đang chạy trong khi schema cơ sở dữ liệu còn tụt lại phía sau.</li>
<li><strong>06/07/2026</strong> — một cuộc đua tạo lại container giết container backend (<code>Exited(137)</code>) và để lại container mồ côi; phải khởi động lại bằng tay mới cứu được.</li>
</ul>
<p>Cách sửa không phải một cái khoá thông minh. Cả hai workflow được đổi sang CHỈ <code>workflow_dispatch</code> — bấm tay mới chạy — và deploy trở thành một script do con người chạy. Giờ một cú push chỉ kích hoạt <code>ci-lint.yml</code>, thứ chỉ kiểm chứ không deploy gì. Chương 9 tháo chuyện này ra cho đàng hoàng, kể cả thiết lập <code>concurrency:</code> lẽ ra đã xếp hàng được hai cái đó.</p>

<h3>Một câu chuyện sinh viên để minh hoạ: đêm trước buổi demo</h3>
${slide('ga-00', 17, 'Tình huống minh hoạ: đêm trước buổi demo đồ án')}
<p><em>Chuyện này là MINH HOẠ — ghép từ những lỗi rất hay gặp, không phải một sự cố cụ thể.</em> Một nhóm bốn người có buổi demo lúc 8 giờ sáng. 22:40, bạn A push "sửa nhỏ giao diện" mà không chạy lại gì, vì "chỉ sửa CSS". Trong lúc sửa, A lỡ tay xoá một dòng import; laptop của A vẫn còn bản build cũ nên mọi thứ vẫn chạy ở máy A. 22:55, bạn B kéo về và nhận một trang trắng. Tới 01:30 cả nhóm dò từng commit một, vì chẳng có gì được kiểm lúc push. Chỉ cần một workflow mười dòng chạy <code>npm ci</code> và <code>npm run build</code> trên mọi pull request, thay đổi của A đã hiện ✗ đỏ lúc 22:42 với dòng "Module not found", A sửa trong ba phút, và B không bao giờ thấy trang trắng.</p>

<h3>Ba nỗi sợ khiến người mới bỏ cuộc</h3>
${slide('ga-00', 18, 'Ba nỗi sợ khi mới học CI, và cách vượt qua từng cái')}
<ul>
<li><strong>"YAML mong manh — sai một dấu cách là hỏng."</strong> Đúng, và thông báo lỗi thì mơ hồ. Dùng VS Code với tiện ích GitHub Actions chính thức (nó kiểm khoá ngay khi bạn gõ), chạy <code>actionlint</code> trước khi push (bài 0.3 có lệnh Docker một dòng), và bắt đầu từ một tệp nhỏ ĐÃ chạy được, mỗi lần chỉ sửa một dòng.</li>
<li><strong>"CI đỏ nghĩa là mình dở."</strong> Đỏ nghĩa là CI đang LÀM VIỆC — nó bắt được thứ gì đó trước người dùng. Bài nào trong khoá này cũng có run đỏ CỐ Ý; từ bài 0.1 bạn sẽ tự làm đỏ có chủ đích.</li>
<li><strong>"Nhật ký dài hàng nghìn dòng."</strong> Bạn không bao giờ đọc từ trên xuống. Xem mục kế tiếp.</li>
</ul>

<h3>Cách đọc một run đỏ — thói quen bốn bước</h3>
${slide('ga-00', 19, 'Đọc một run đỏ: job ✗ → bước ✗ → dòng lỗi đầu tiên')}
<ol>
<li><strong>Job nào?</strong> Trang lần chạy (hoặc <code>gh run view &lt;id&gt;</code>) đánh dấu từng job ✓ hoặc ✗. Bỏ qua các job xanh.</li>
<li><strong>Bước nào?</strong> Trong job đỏ, đúng một bước đỏ; các bước sau nó không chạy.</li>
<li><strong>Dòng lỗi ĐẦU TIÊN, không phải dòng cuối.</strong> Tìm trong bước đó chữ <code>##[error]</code> hoặc "Error", rồi đọc NGƯỢC lên vài dòng: dòng cuối thường chỉ là "Process completed with exit code 1"; nguyên nhân nằm phía trên nó. <code>gh run view &lt;id&gt; --log-failed</code> chỉ in nhật ký của các bước hỏng.</li>
<li><strong>Có phải của mình không?</strong> Commit của bạn có đụng vào vùng đó không? Tái lập được từ một bản clone sạch không (bài 0.1)? Chỉ khi đó mới quyết định giữa "sửa" và "chạy lại".</li>
</ol>
<p>Trên sân tập, bốn bước đó tốn ba câu lệnh và dừng ở dòng <code>Error: ENOENT: no such file or directory, open '…/ch00/config.local.json'</code> — một tệp chỉ tồn tại trên laptop của tác giả. Bài 0.1 là câu chuyện đó.</p>

<h3>Kế hoạch học: tối thiểu và đầy đủ</h3>
${slide('ga-00', 20, 'Hai lộ trình: tối thiểu để đi làm, đầy đủ để lên chuyên gia')}
<p><strong>Tối thiểu (khoảng hai tuần)</strong> — đủ để viết, đọc, sửa CI cho đồ án nhóm và nói chuyện được ở vòng phỏng vấn đầu: Mục 0 → Chương 1, 2, 3 → Chương 5 (cache) và 6 (bí mật) → Chương 8 (khi CI đỏ). <strong>Đầy đủ (sáu tới tám tuần)</strong> — thêm Chương 4, 7, 9, 10, ôn bằng Chương 11, rồi Chương 12–14 (tái sử dụng, runner riêng, cổng chất lượng, bảo mật chuỗi cung ứng, phát hành) và dự án cuối khoá ở Chương 15. Đó chính là tầm "từ cơ bản tới chuyên gia" mà nhà tuyển dụng nói tới.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — "xanh rồi, vậy là an toàn".</strong> Trong cả ba sự cố bên ngoài ở trên, những phép kiểm đang có đều ĐẠT. Knight Capital không có phép kiểm nào so cả tám máy; tj-actions và Codecov chạy bên trong những bản dựng xanh. Xanh là một phát biểu về những phép kiểm bạn đã chọn. Kỹ năng khoá này xây dựng là CHỌN chúng — và biết một run xanh KHÔNG nói với bạn điều gì.</div>

<div class="callout tip">
<p><strong>Câu hỏi phỏng vấn hay gặp: "Tấn công chuỗi cung ứng trong CI là gì, và giảm rủi ro thế nào?"</strong> "Là khi mã không do mình viết — một action, một script tải về, một thư viện phụ thuộc — chạy bên trong pipeline cùng với bí mật của mình. Vụ tj-actions tháng 3/2025 dời thẻ phiên bản sang một commit độc và in bí mật ra nhật ký. Để giảm rủi ro: ghim action bên thứ ba theo SHA đầy đủ của commit, cho <code>GITHUB_TOKEN</code> đúng <code>permissions:</code> tối thiểu, ưu tiên thông tin xác thực ngắn hạn như OIDC thay vì khoá lưu sẵn, và để Dependabot cập nhật các chỗ ghim." Nêu được MỘT sự cố thật kèm ngày tháng làm câu trả lời đáng tin hơn hẳn.</p>
</div>

<h3>🧪 Thực hành (10–15 phút — chắc chắn làm được)</h3>
<div class="callout ok"><ol>
<li>Mở lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986054380" target="_blank" rel="noopener">35986054380</a> của sân tập trên trình duyệt (hoặc <code>gh run view 35986054380 -R cuonghoang1103/ga-san-tap</code>). Áp dụng thói quen bốn bước: job nào, bước nào, dòng lỗi đầu tiên là gì?</li>
<li>Trong kho thử của bạn (hoặc một kho công khai bất kỳ bạn thích), mở <code>.github/workflows/</code> và liệt kê mọi dòng <code>uses:</code>. Đánh dấu dòng nào dùng thẻ (<code>@v4</code>), dòng nào dùng SHA đầy đủ.</li>
<li>Chọn lộ trình — tối thiểu hay đầy đủ — và ghi vào lịch tuần bạn sẽ học xong Chương 1.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã ghi ra tên job (<code>kiem</code>), tên bước và dòng <code>ENOENT</code>; bạn có danh sách các dòng <code>uses:</code> được đánh dấu thẻ hay SHA; và có một ngày cụ thể trong lịch của bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Deploy (triển khai)</span><span class="v">Đưa phiên bản mới lên những cái máy phục vụ người dùng. Deploy tay lặp lại thao tác người; deploy bằng script lặp lại CHÍNH XÁC.</span></div>
<div class="kv"><span class="k">Supply-chain attack (tấn công chuỗi cung ứng)</span><span class="v">Chiếm một thứ bạn phụ thuộc — action, script, gói thư viện — để pipeline của bạn chạy mã của kẻ tấn công.</span></div>
<div class="kv"><span class="k">Tag và SHA (thẻ và mã băm commit)</span><span class="v"><code>@v44.5.1</code> là một cái tên dời được; <code>@&lt;SHA 40 ký tự&gt;</code> luôn chỉ đúng một commit.</span></div>
<div class="kv"><span class="k">Secret (bí mật)</span><span class="v">Khoá hay token cất trong GitHub và trao cho job; mọi thứ chạy trong job đều đọc được nó.</span></div>
<div class="kv"><span class="k"><code>workflow_dispatch</code></span><span class="v">Sự kiện kích hoạt chỉ chạy workflow khi một người (hoặc một lệnh gọi API) bấm chạy.</span></div>
<div class="kv"><span class="k">Race condition (tranh chấp / đua nhau)</span><span class="v">Hai tiến trình cùng thay đổi một thứ một lúc, kết quả phụ thuộc vào ai xong trước.</span></div>
<div class="kv"><span class="k"><code>--log-failed</code></span><span class="v">Tuỳ chọn của <code>gh run view</code> chỉ in nhật ký của các bước hỏng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Knight Capital (01/08/2012): lần deploy chép tay sót một trong tám máy; 45 phút, 4 triệu lệnh, lỗ hơn 460 triệu đô la.</li>
<li>tj-actions (14–15/03/2025): thẻ phiên bản bị dời làm hơn 23.000 kho chạy mã độc và in bí mật ra nhật ký — hãy ghim action theo SHA.</li>
<li>Codecov (31/01–01/04/2021): một script bị sửa gửi biến môi trường CI đi nơi khác suốt hai tháng, bên trong những bản dựng xanh.</li>
<li>Kho mã này (03 và 06/07/2026): hai workflow deploy kích hoạt bằng push đua nhau; giờ deploy do người chạy.</li>
<li>Đọc run đỏ theo bốn bước — job, bước, dòng lỗi đầu tiên, có phải của mình — và bắt đầu từ một tệp nhỏ đã chạy được.</li>
<li>Lộ trình tối thiểu ~2 tuần (Mục 0, Chương 1–3, 5, 6, 8); đầy đủ 6–8 tuần tới dự án cuối khoá Chương 15.</li>
</ul>

<a class="link-card" href="https://www.sec.gov/newsroom/press-releases/2013-222" target="_blank" rel="noopener"><span class="lc-ico">⚖️</span><span class="lc-body"><span class="lc-title">SEC — Knight Capital bị cáo buộc (Release 2013-222, 16/10/2013)</span><span class="lc-sub">45 phút, hơn 4 triệu lệnh, lỗ hơn 460 triệu đô la, dàn xếp 12 triệu đô la.</span></span></a>
<a class="link-card" href="https://www.sec.gov/files/litigation/admin/2013/34-70694.pdf" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Lệnh SEC 34-70694 (PDF)</span><span class="lc-sub">Đoạn 15: sót một trong tám máy khi deploy tay, không có kỹ thuật viên thứ hai kiểm lại.</span></span></a>
<a class="link-card" href="https://github.com/advisories/GHSA-mrrh-fwg8-r2c3" target="_blank" rel="noopener"><span class="lc-ico">🛡</span><span class="lc-body"><span class="lc-title">GitHub Advisory — tj-actions/changed-files (CVE-2025-30066)</span><span class="lc-sub">Thẻ bị sửa ngược, bí mật bị in ra nhật ký, vá ở 46.0.1.</span></span></a>
<a class="link-card" href="https://about.codecov.io/security-update/" target="_blank" rel="noopener"><span class="lc-ico">🛡</span><span class="lc-body"><span class="lc-title">Codecov — thông báo bảo mật Bash Uploader</span><span class="lc-sub">Bị sửa 31/01/2021, phát hiện 01/04/2021; dòng bị sửa đã gửi đi những gì.</span></span></a>
<a class="link-card" href="https://docs.github.com/en/actions/reference/security/secure-use" target="_blank" rel="noopener"><span class="lc-ico">📘</span><span class="lc-body"><span class="lc-title">GitHub Docs — Secure use reference</span><span class="lc-sub">Ghim action theo SHA đầy đủ, token quyền tối thiểu, dữ liệu đầu vào không tin cậy.</span></span></a>
<p class="note-ct"><strong>Bài kế tiếp:</strong> bài 0.1 — cái run đỏ của kho này đã mở đầu mọi chuyện, và lời khẳng định mà CI thật sự đưa ra được.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.0 — slide ─────────────────────────── */
    {
      title: '0.0 — Section 0 slides: what CI actually solves|||0.0 — Slide Mục 0: CI thật ra giải quyết vấn đề gì',
      slug: 'ga-0-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ 39 slide của Mục 0: CI/CD bằng hình ảnh, lịch sử 1991→2019, bốn công cụ CI, sự cố thật, bốn tầng workflow–job–bước–runner, đọc ci-lint.yml, và các run thật trên sân tập.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Slides</span>
<h2>Section 0 in 39 slides</h2>
<p class="lead">Every slide of this section in one place — for a quick review before the quiz, or to find the picture a lesson was talking about. Each lesson embeds the same slides next to the paragraph that explains them.</p>
<p>Slides 3–12 belong to "Start here (1/2)": CI/CD in everyday pictures, the history from 1991 to GitHub Actions in 2019, four CI tools compared, today&#39;s numbers, and interview questions. Slides 13–20 are "Start here (2/2)": Knight Capital, tj-actions, Codecov, this repository&#39;s own outage, and how to read a red run. Slides 21–36 follow lessons 0.1–0.4, and every terminal on them is real output from the public sandbox <code>ga-san-tap</code> or from this repository&#39;s runs. The last three are common mistakes, a quick-reference table and the section&#39;s practice.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Slide</span>
<h2>Mục 0 trong 39 slide</h2>
<p class="lead">Toàn bộ slide của mục này ở một chỗ — để ôn nhanh trước bài kiểm tra, hoặc để tìm lại cái hình mà một bài đã nhắc tới. Mỗi bài học đều nhúng đúng những slide này cạnh đoạn giải thích chúng.</p>
<p>Slide 3–12 thuộc "Bắt đầu tại đây (1/2)": CI/CD bằng hình ảnh đời thường, lịch sử từ 1991 tới GitHub Actions năm 2019, so bốn công cụ CI, con số hiện nay, và câu hỏi phỏng vấn. Slide 13–20 là "Bắt đầu tại đây (2/2)": Knight Capital, tj-actions, Codecov, sự cố của chính kho này, và cách đọc một run đỏ. Slide 21–36 đi theo bài 0.1–0.4, và mọi cửa sổ terminal trên đó là output THẬT từ sân tập công khai <code>ga-san-tap</code> hoặc từ các lần chạy của kho này. Ba slide cuối là sai lầm hay gặp, bảng tra nhanh và bài thực hành của mục.</p>
</div>
${gallery('ga-00', [
  [1, 'Bìa — CI thật ra giải quyết vấn đề gì'],
  [2, 'Mục 0 có sáu bài, đi từ “vì sao” tới “đọc được”'],
  [3, 'CI giống bếp trưởng nếm MỌI món trước khi ra bàn'],
  [4, 'CI, Delivery, Deployment: ba điểm dừng khác nhau'],
  [5, 'Một commit đi qua pipeline trong vài phút'],
  [6, 'CI ra đời trước GitHub Actions gần 30 năm'],
  [7, 'Rồi CI chuyển về nằm ngay cạnh mã: 2011 → 2019'],
  [8, 'Bốn công cụ CI: khác ở chỗ chạy và chỗ đặt cấu hình'],
  [9, 'Con số hiện nay: CI là việc hằng ngày'],
  [10, 'Công ty cần CI vì lỗi rẻ nhất lúc nó vừa sinh ra'],
  [11, 'Câu phỏng vấn hay gặp về CI/CD — và ý trả lời gọn'],
  [12, 'Khoá này đưa bạn qua 16 chặng'],
  [13, 'Knight Capital 2012: deploy tay sót 1 máy'],
  [14, 'tj-actions 03/2025: một thẻ bị dời, bí mật lộ ra log'],
  [15, 'Codecov 2021: script trong CI gửi bí mật ra ngoài'],
  [16, 'Chính kho này: hai workflow deploy đua nhau'],
  [17, 'Tình huống minh hoạ: đêm trước buổi demo đồ án'],
  [18, 'Ba nỗi sợ khi mới học CI'],
  [19, 'Đọc một run đỏ: job → bước → dòng lỗi đầu tiên'],
  [20, 'Hai lộ trình: tối thiểu và đầy đủ'],
  [21, 'Máy tôi: chạy được. Máy của GitHub: ENOENT'],
  [22, 'Sửa đúng chỗ: mặc định vào kho, tệp riêng chỉ ghi đè'],
  [23, 'Bốn thứ một phép kiểm cục bộ không bao giờ thấy'],
  [24, 'Runner không giống máy bạn — trần heap theo RAM'],
  [25, 'Bốn ranh giới thật: sự kiện → workflow → job → bước'],
  [26, 'Một run phát hành thật: ba máy bắt đầu cùng một giây'],
  [27, 'Job không chia sẻ gì: mang tệp qua bằng artifact'],
  [28, 'Đổi hệ điều hành là đổi thời gian'],
  [29, 'Trong một job, bước chạy tuần tự và dừng ở lỗi đầu tiên'],
  [30, 'Khối on: của ci-lint.yml có một chỗ bất đối xứng'],
  [31, 'timeout-minutes: mặc định 360 phút — hãy tự đặt'],
  [32, 'Không khai shell: ⇒ không pipefail'],
  [33, 'Bước cố ý bỏ qua: secret vắng thành chuỗi rỗng'],
  [34, 'Annotation vàng: checkout@v4 bị ép chạy Node 24'],
  [35, 'Bản đồ 15 chương'],
  [36, 'Thứ chuyển sang dự án của bạn là QUAN HỆ'],
  [37, 'Sai lầm hay gặp ở Mục 0'],
  [38, 'Bảng tra nhanh Mục 0'],
  [39, 'Thực hành Mục 0: workflow đầu tiên trên kho của bạn'],
])}
`,
    },

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — "It works on my machine" is not a claim you can check|||0.1 — "Máy tôi chạy được" KHÔNG phải một lời khẳng định kiểm chứng được',
      slug: 'ga-0-1-may-toi-chay-duoc',
      type: 'VIDEO',
      description: 'Một bản dựng xanh trong 20 giây trên máy nhà và thoát 134 trên runner macOS. Đó là một lần chạy THẬT trong kho này, và nó là toàn bộ lý do CI tồn tại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>"It works on my machine" is not a claim you can check</h2>
<p class="lead">Every measurement in this course comes from one real repository — the one this course is written in — with 11 workflows, 1,394 lines of YAML, and <strong>2,343 real runs</strong> read back through GitHub&#39;s API. This lesson starts with the run that failed.</p>

<h3>The failure</h3>
${slide('ga-00', 24, 'Runners are not your laptop — and the default Node heap follows the RAM')}
<p>Run 32400097927, a desktop release build. The commit message records what happened, and it is worth reading in full because it is the shape of the problem CI exists to solve:</p>

<div class="out">vite build thoat 134 tren runner macOS voi
  FATAL ERROR: Reached heap limit — JavaScript heap out of memory

May nha dung XANH trong 20 giay, nen loi CHI lo ra o CI.</div>

<div class="callout warn">
<p><strong>Twenty seconds green locally, exit 134 on the runner.</strong> Nothing was wrong with the code in a way any local check could see. The difference was the machine: a different amount of memory, a different default heap size, and 51,000 newly added lines that pushed one of them over a line the other never came near.</p>
</div>

<p>Chapter 8 of this author&#39;s Deploy VPS course measured exit 134 from the other direction — it is V8&#39;s own heap limit, which is a <em>better</em> failure than the OOM killer&#39;s 137 because it comes with a stack trace. Here it is the same signal doing the job CI is for: telling you about a machine that is not yours.</p>

<h3>What the fix was, and what it proves</h3>
<div class="out">Hai viec, can CA HAI:
  • build:renderer chay qua node --max-old-space-size=6144
  • ban do nguon TAT khi co bien CI (sourcemap: !process.env.CI)

Do that o heap bi bop 1600MB — khong doan:
  co ban do nguon  → exit 134, dung loi cua CI
  khong            → exit 0</div>

<p>Notice the second line of the fix: <code>!process.env.CI</code>. The build behaves differently <em>because it is running in CI</em> — source maps are generated locally and skipped on the runner, because <code>electron-builder</code> excludes them from the installer anyway. CI was spending memory to produce something it immediately discarded.</p>

<h3>The claim CI can actually make</h3>
${slide('ga-00', 21, 'My machine: runs. GitHub’s machine: ENOENT')}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">"it works on my machine"</span><span class="lz-t">unfalsifiable</span><span class="lz-d">nobody else has your machine, your node version, your leftover node_modules, or your uncommitted file</span></div>
<div class="lz-step"><span class="lz-k">"it works from a clean checkout"</span><span class="lz-t">checkable</span><span class="lz-d">and the only way to check it is to actually do it, somewhere else, every time</span></div>
</div>

<p>That is the whole idea. CI is not a quality tool, a testing tool, or a deployment tool — those are things you can <em>put</em> in it. CI is a machine that answers one question honestly: <strong>does this commit, alone, from nothing, do what you say it does?</strong></p>

<h3>The four things a local check cannot see</h3>
${slide('ga-00', 23, 'Four things a local check never sees')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a file you did not commit</span><span class="lz-lnote">the most common one by a distance. It works locally because the file is there; it is not in the repository</span></div>
<div class="lz-layer"><span class="lz-lname">a dependency you installed once</span><span class="lz-lnote">globally, months ago, and never added to <code>package.json</code></span></div>
<div class="lz-layer"><span class="lz-lname">a different machine</span><span class="lz-lnote">measured in this course: the same <code>npm ci</code> takes 38 s on Linux and 107 s on Windows; the same build takes 149 s on Linux and 315 s on macOS</span></div>
<div class="lz-layer"><span class="lz-lname">a step you skipped</span><span class="lz-lnote">because you knew it would pass. CI does not know that and runs it anyway</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — CI proves the commit works, not that the code is correct.</strong> A green run means every command you listed exited 0 on a clean checkout. If your workflow runs a type-check and no tests, green means the types are consistent — and nothing else. This repository&#39;s own CI is explicit about the distinction: some steps are labelled <code>(required)</code> and one is <code>continue-on-error: true</code>, which means its failure is visible and does not stop the build. Knowing exactly what your green means is more useful than making it greener.</p>
</div>

<h3>What this repository actually gates on</h3>
<p>From <code>ci-lint.yml</code>, unedited:</p>

<pre><code>- name: TypeScript type-check (required)
  run: npx tsc --noEmit
- name: Interview grader eval — golden set (required)
  run: npm run eval:grader
- name: CV linter eval — golden set (required)
  run: npm run eval:cv-linter
- name: Unit tests — money math + payment signature (required)
  run: npm test
- name: ESLint (informational)
  continue-on-error: true
  run: npm run lint 2>&amp;1 | tail -30 || echo "(lint warnings — pre-existing)"</code></pre>

<p>Four gates and one report. The comment on the type-check step explains a choice most workflows leave implicit:</p>

<div class="out"># 22 matches the production runtime (node:22-alpine) and is required
# by the CV PDF round-trip test in &#96;npm test&#96; (unpdf needs
# Promise.withResolvers, a Node 22 feature).</div>

<p>The CI node version is 22 <em>because production is 22</em>. A CI that tests a different runtime than production is answering a question nobody asked.</p>

<div class="callout ok">
<p><strong>The one sentence version.</strong> CI turns "I think this works" into "this worked, on a clean machine, at 06:03:42, and here is the log". Everything else in this course — triggers, jobs, expressions, caches, matrices — is machinery for making that answer arrive faster and mean more.</p>
</div>

<h3>Why the two machines disagreed, measured</h3>
<p>"A different amount of memory" is a hand-wave until you put numbers next to it, so the course measured it. Node sets its default heap ceiling from the memory the machine reports. One workflow on the course sandbox printed that ceiling on all three hosted runners, and the course Mac printed its own:</p>
<div class="out">May Mac cua khoa (32 GB RAM, Node 22):   heap_size_limit 4144 MB
runner ubuntu-24.04  (RAM 15.6 GB):       heap_size_limit 4144 MB
runner windows-2025  (RAM 16.0 GB):       heap_size_limit 4144 MB
runner macos-15      (RAM  7.0 GB):       heap_size_limit 2096 MB</div>
<p>(Run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35987300829" target="_blank" rel="noopener">35987300829</a> on the public sandbox <code>cuonghoang1103/ga-san-tap</code>, 24/09/2026.) The macOS runner gives a Node process <strong>half</strong> the heap your laptop does. A build that peaks at 3 GB is comfortable at home and dies on that runner with exactly the exit 134 at the top of this lesson. The fix was not "CI is broken" — it was two decisions: give the build an explicit ceiling (<code>--max-old-space-size=6144</code>), and stop producing source maps that the installer throws away anyway.</p>
<div class="callout ok">
<p><strong>Why the runners differ by visibility too.</strong> GitHub&#39;s published specs (checked 09/2026) give standard Linux and Windows runners <strong>4 CPU / 16 GB</strong> on public repositories but <strong>2 CPU / 8 GB</strong> on private ones; macOS (M1) is <strong>3 CPU / 7 GB</strong> either way, 14 GB of SSD everywhere. The same workflow can therefore behave differently after a repository is made private. That is not a reason to fear CI; it is a reason to write down, per project, which machine your green was measured on.</p>
</div>

<h3>Try it yourself: the smallest "works on my machine" there is</h3>
<p>You do not need a 51,000-line desktop app to see the whole mechanism. The course reproduced it on the sandbox with three files. The app reads its configuration from a file that is — like most real <code>.env</code> or <code>*.local.json</code> files — in <code>.gitignore</code>:</p>
<pre><code class="language-javascript">// ch00/app.js — reads a file that is NOT committed
const fs = require('node:fs');
const path = require('node:path');
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.local.json'), 'utf8'));
console.log(&#96;Xin chao tu &#36;{cfg.ten} — cong &#36;{cfg.cong}&#96;);</code></pre>
<p>On the course Mac it prints a greeting and exits 0. <code>git status --ignored</code> shows the reason it will not survive the trip:</p>
<div class="out">$ node ch00/app.js
Xin chao tu may-cua-Cuong — cong 3000
$ git status --short --ignored ch00
!! ch00/config.local.json</div>
<p>The two exclamation marks mean "ignored": the file exists on this disk and will never be pushed. The workflow that checks it is deliberately plain:</p>
<pre><code class="language-yaml">name: ch00 — may khac, khong phai may ban
on:
  push:
    branches: [ch00-mo-dau]
jobs:
  kiem:
    runs-on: ubuntu-24.04
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - name: Chay app giong het tren may nha
        run: node ch00/app.js</code></pre>
<p>Run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986054380" target="_blank" rel="noopener">35986054380</a> went red in 7 seconds:</p>
<div class="out">Error: ENOENT: no such file or directory, open '/home/runner/work/ga-san-tap/ga-san-tap/ch00/config.local.json'
    at Object.readFileSync (node:fs:440:20)
    ...
Node.js v22.23.2
##[error]Process completed with exit code 1.</div>
${slide('ga-00', 22, 'The right fix: defaults in the repository, the local file only overrides')}
<p>The fix is not "commit the local file" — that file usually holds <em>your</em> port, <em>your</em> database password. The fix is to commit a <strong>default</strong> (<code>config.example.json</code>) and let the local file override it when present. Run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986409808" target="_blank" rel="noopener">35986409808</a>, same workflow, went green in 6 seconds and printed <code>Xin chao tu cau-hinh-mac-dinh — cong 8080</code>.</p>

<h3>You can catch this before pushing: the clean-clone test</h3>
<p>CI&#39;s superpower is not the cloud; it is the <em>clean checkout</em>. You can borrow it on your own machine in three commands — clone the repository into a temporary folder, which by definition contains only committed files, and run the same command there:</p>
<pre><code class="language-bash">git clone -q --no-local . /tmp/ban-sach     # only what is committed comes along
cd /tmp/ban-sach
node ch00/app.js; echo "exit=$?"</code></pre>
<div class="out">Error: ENOENT: no such file or directory, open '/tmp/ban-sach/ch00/config.local.json'
exit=1</div>
<p>Same error, same exit code, no push needed (measured on the course Mac at the red commit <code>282937f</code>). The difference from CI is everything else a clean machine brings: a different OS, no global packages, a different Node patch version (<code>v22.21.0</code> on the Mac, <code>v22.23.2</code> on the runner that day). The clean clone catches the first of the four invisible things; only another machine catches the rest.</p>

<h3>The CI variable: when to behave differently in CI — and when not to</h3>
<p>Every GitHub-hosted job sets <code>CI=true</code> and <code>GITHUB_ACTIONS=true</code>. The sandbox printed them:</p>
<div class="out">CI=true  GITHUB_ACTIONS=true
4
               total        used        free      shared  buff/cache   available
Mem:            15Gi       948Mi        12Gi        41Mi       2.4Gi        14Gi
v22.23.2</div>
<p>Many tools read that variable on their own — test runners switch off watch mode, package managers stop showing progress bars. The desktop fix in this lesson read it on purpose (<code>sourcemap: !process.env.CI</code>). That is legitimate when the difference is about <strong>output you do not need</strong>. It is dangerous when it changes <strong>what is being checked</strong>.</p>
<table>
<thead><tr><th>Using <code>process.env.CI</code> to…</th><th>Verdict</th><th>Why</th></tr></thead>
<tbody>
<tr><td>skip source maps the installer drops anyway</td><td>fine</td><td>the product is identical; CI saves memory</td></tr>
<tr><td>turn off an interactive prompt or a progress bar</td><td>fine</td><td>nobody is there to answer it</td></tr>
<tr><td>skip a slow test "because CI is slow"</td><td>no</td><td>green now means less than before, and nobody sees the gap</td></tr>
<tr><td>use a different database or Node version in CI</td><td>no</td><td>CI answers a question production never asks — exactly what the repository&#39;s own comment about Node 22 warns against</td></tr>
</tbody>
</table>

<div class="pitfall co-tieu-de"><strong>Trap — "it passed in CI, so it works" is the new "it works on my machine".</strong> CI moves the claim from your laptop to one specific clean machine. It is a much better claim, but it is still one machine: Ubuntu 24.04, 4 CPU, 16 GB, one Node patch version, on the day of the run. If production runs on Alpine with 1 GB of RAM, CI has not tested that. Read the green for what it is: <em>these commands, on this machine, exited 0.</em></div>

<div class="callout tip">
<p><strong>Interview question you will meet: "What does CI actually guarantee?"</strong> A strong short answer: "That a specific commit, checked out clean on a machine I did not prepare, passes the checks we chose — and there is a log to prove it. It does not guarantee correctness; it guarantees the checks ran. So the real question is which checks we run, and whether the CI machine resembles production." Then give one example — the ignored config file, or the heap limit on the macOS runner — because a concrete failure is worth more than a definition.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>In any repository of yours (or a new public test repository), find one file that exists on your machine but is ignored: run <code>git status --short --ignored</code> and look for <code>!!</code>.</li>
<li>Do the clean-clone test: <code>git clone -q --no-local . /tmp/ban-sach &amp;&amp; cd /tmp/ban-sach</code>, then run the command you normally use to start or test the project. Write down whether it still works.</li>
<li>Add <code>.github/workflows/may-khac.yml</code> with one job on <code>ubuntu-24.04</code>, <code>timeout-minutes: 5</code>, a checkout step and a step that prints <code>echo "CI=$CI"; nproc; node --version</code> and then runs your start or test command. Push.</li>
<li>Open the run with <code>gh run view --log</code> (or the Actions tab) and compare the Node version and CPU count with your laptop&#39;s (<code>node --version</code>, <code>nproc</code> or <code>sysctl -n hw.ncpu</code> on a Mac).</li>
</ol>
<p><strong>Done when:</strong> you have one run ID, you can state two concrete differences between your laptop and the runner (e.g. Node patch version, CPU count, a missing ignored file), and you can say in one sentence what your green (or red) actually proves.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">CI — Continuous Integration (tích hợp liên tục)</span><span class="v">Every commit is built and checked automatically on a clean machine, so integration problems appear within minutes.</span></div>
<div class="kv"><span class="k">Runner (máy chạy)</span><span class="v">The machine that executes a job. GitHub-hosted runners are fresh VMs, discarded after the job.</span></div>
<div class="kv"><span class="k">Clean checkout (bản lấy về sạch)</span><span class="v">A copy that contains only committed files — no ignored files, no leftover <code>node_modules</code>.</span></div>
<div class="kv"><span class="k">Exit code (mã thoát)</span><span class="v">The number a command returns: 0 means success; anything else fails the step. 134 = aborted (here: V8 heap limit).</span></div>
<div class="kv"><span class="k">Heap limit (trần heap)</span><span class="v">The most memory V8 lets a Node process use for objects; its default depends on the machine&#39;s RAM.</span></div>
<div class="kv"><span class="k"><code>.gitignore</code></span><span class="v">The list of files Git never commits. Anything your app needs that lives only there will be missing in CI.</span></div>
<div class="kv"><span class="k"><code>CI=true</code></span><span class="v">Environment variable set on every hosted job; tools read it to switch to non-interactive behaviour.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>"Works on my machine" cannot be checked by anyone else; "works from a clean checkout" can — and CI checks it on every push.</li>
<li>The desktop build failed only on macOS because that runner has 7 GB of RAM and Node&#39;s default heap there is 2096 MB, half the laptop&#39;s 4144 MB.</li>
<li>The most common invisible difference is an uncommitted or ignored file; the clean-clone test catches it before you push.</li>
<li>Branch on <code>CI</code> only to drop output you do not need, never to weaken what is checked.</li>
<li>Green means: these commands exited 0 on this machine. Know which machine and which commands.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Understanding GitHub Actions</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/understanding-github-actions — the vocabulary (workflow, job, step, action, runner) this course uses throughout.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — Continuous Integration</span><span class="lc-sub">martinfowler.com/articles/continuousIntegration.html — first published 10 September 2000, rewritten in 2006 and revised again in January 2024 — and still the clearest statement of why integrating often is cheaper than integrating well. (It did not coin the term: Grady Booch used the phrase in 1991, and Kent Beck made it a practice inside Extreme Programming — the article itself says so.)</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — --max-old-space-size</span><span class="lc-sub">nodejs.org/api/cli.html#--max-old-space-sizesize-in-mib — and the note that the default is derived from available system memory, which is exactly why the local machine and the runner disagreed.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — exit 137, exit 134, and what the kernel writes down</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the same exit codes measured from the server side, including why 134 is the more useful failure.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>"Máy tôi chạy được" KHÔNG phải một lời khẳng định kiểm chứng được</h2>
<p class="lead">Mọi số đo trong khoá này tới từ MỘT kho thật — chính cái kho khoá học này được viết trong đó — với 11 workflow, 1.394 dòng YAML, và <strong>2.343 lần chạy THẬT</strong> đọc ngược về qua API của GitHub. Bài này bắt đầu bằng cái lần chạy HỎNG.</p>

<h3>Cú hỏng</h3>
${slide('ga-00', 24, 'Runner không giống máy bạn — và trần heap mặc định của Node đi theo RAM')}
<p>Lần chạy 32400097927, một bản dựng phát hành desktop. Dòng commit ghi lại chuyện đã xảy ra, và nó đáng đọc trọn vẹn vì nó chính là hình dạng của vấn đề mà CI sinh ra để giải:</p>

<div class="out">vite build thoat 134 tren runner macOS voi
  FATAL ERROR: Reached heap limit — JavaScript heap out of memory

May nha dung XANH trong 20 giay, nen loi CHI lo ra o CI.</div>

<div class="callout warn">
<p><strong>Hai mươi giây xanh ở máy nhà, thoát 134 trên runner.</strong> Chẳng có gì sai trong mã theo cái kiểu mà bất kỳ phép kiểm cục bộ nào nhìn thấy được. Khác biệt nằm ở CÁI MÁY: một lượng bộ nhớ khác, một kích thước heap mặc định khác, và 51.000 dòng mã vừa thêm đẩy một trong hai vượt qua cái vạch mà cái kia còn chưa tới gần.</p>
</div>

<p>Chương 8 của khoá Deploy VPS cùng tác giả đã đo mã thoát 134 từ hướng ngược lại — nó là giới hạn heap của chính V8, và đó là một cú hỏng <em>TỐT HƠN</em> cú 137 của OOM killer vì nó kèm theo vết ngăn xếp. Ở đây nó là cùng một tín hiệu đang làm đúng việc CI sinh ra để làm: nói cho bạn biết về một cái máy KHÔNG phải của bạn.</p>

<h3>Cách chữa là gì, và nó chứng minh điều gì</h3>
<div class="out">Hai viec, can CA HAI:
  • build:renderer chay qua node --max-old-space-size=6144
  • ban do nguon TAT khi co bien CI (sourcemap: !process.env.CI)

Do that o heap bi bop 1600MB — khong doan:
  co ban do nguon  → exit 134, dung loi cua CI
  khong            → exit 0</div>

<p>Để ý dòng thứ hai của cách chữa: <code>!process.env.CI</code>. Bản dựng hành xử KHÁC ĐI <em>vì nó đang chạy trong CI</em> — bản đồ nguồn được sinh ở máy nhà và bỏ qua trên runner, vì <code>electron-builder</code> dù sao cũng loại chúng khỏi bản cài. CI đang tốn bộ nhớ để sinh ra một thứ chính nó vứt đi ngay sau đó.</p>

<h3>Lời khẳng định mà CI THẬT SỰ đưa ra được</h3>
${slide('ga-00', 21, 'Máy tôi: chạy được. Máy của GitHub: ENOENT')}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">"máy tôi chạy được"</span><span class="lz-t">không bác bỏ được</span><span class="lz-d">chẳng ai khác có cái máy của bạn, phiên bản node của bạn, đống node_modules sót lại của bạn, hay cái tệp bạn chưa commit</span></div>
<div class="lz-step"><span class="lz-k">"chạy được từ một bản lấy về SẠCH"</span><span class="lz-t">kiểm được</span><span class="lz-d">và cách DUY NHẤT để kiểm là thật sự làm điều đó, ở CHỖ KHÁC, MỖI LẦN</span></div>
</div>

<p>Đó là toàn bộ ý tưởng. CI không phải một công cụ chất lượng, một công cụ kiểm thử, hay một công cụ triển khai — đó là những thứ bạn có thể ĐẶT VÀO nó. CI là một cỗ máy trả lời trung thực đúng một câu hỏi: <strong>cái commit này, một mình nó, từ con số không, có làm đúng cái bạn nói không?</strong></p>

<h3>Bốn thứ một phép kiểm cục bộ KHÔNG thấy được</h3>
${slide('ga-00', 23, 'Bốn thứ một phép kiểm cục bộ không bao giờ thấy')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một tệp bạn CHƯA commit</span><span class="lz-lnote">phổ biến nhất, bỏ xa các cái khác. Nó chạy ở máy bạn vì cái tệp đó CÓ; nó không có trong kho mã</span></div>
<div class="lz-layer"><span class="lz-lname">một phụ thuộc bạn cài một lần</span><span class="lz-lnote">cài toàn cục, vài tháng trước, và chẳng bao giờ thêm vào <code>package.json</code></span></div>
<div class="lz-layer"><span class="lz-lname">một cái máy KHÁC</span><span class="lz-lnote">đo trong khoá này: cùng lệnh <code>npm ci</code> mất 38 s trên Linux và 107 s trên Windows; cùng bản dựng mất 149 s trên Linux và 315 s trên macOS</span></div>
<div class="lz-layer"><span class="lz-lname">một bước bạn BỎ QUA</span><span class="lz-lnote">vì bạn biết chắc nó sẽ đạt. CI không biết chuyện đó và cứ chạy</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — CI chứng minh cái COMMIT chạy được, không chứng minh mã ĐÚNG.</strong> Một lần chạy xanh nghĩa là mọi câu lệnh bạn liệt kê đều thoát 0 trên một bản lấy về sạch. Nếu workflow của bạn chạy một phép kiểm kiểu và không chạy test nào, thì màu xanh nghĩa là các kiểu dữ liệu nhất quán — và không gì khác. Chính CI của kho này nói rõ sự phân biệt đó: vài bước gắn nhãn <code>(required)</code> và một bước có <code>continue-on-error: true</code>, nghĩa là nó hỏng thì thấy được mà không chặn bản dựng. BIẾT CHÍNH XÁC màu xanh của bạn có nghĩa gì thì hữu dụng hơn là làm cho nó xanh hơn.</p>
</div>

<h3>Kho này THẬT SỰ chốt cửa ở đâu</h3>
<p>Trích từ <code>ci-lint.yml</code>, không sửa gì:</p>

<pre><code>- name: TypeScript type-check (required)
  run: npx tsc --noEmit
- name: Interview grader eval — golden set (required)
  run: npm run eval:grader
- name: CV linter eval — golden set (required)
  run: npm run eval:cv-linter
- name: Unit tests — money math + payment signature (required)
  run: npm test
- name: ESLint (informational)
  continue-on-error: true
  run: npm run lint 2>&amp;1 | tail -30 || echo "(lint warnings — pre-existing)"</code></pre>

<p>Bốn cái chốt và một bản báo cáo. Dòng chú thích ở bước kiểm kiểu giải thích một lựa chọn mà phần lớn workflow để ngầm:</p>

<div class="out"># 22 matches the production runtime (node:22-alpine) and is required
# by the CV PDF round-trip test in &#96;npm test&#96; (unpdf needs
# Promise.withResolvers, a Node 22 feature).</div>

<p>Phiên bản node của CI là 22 <em>VÌ production là 22</em>. Một cái CI kiểm thử một môi trường chạy KHÁC với production thì đang trả lời một câu hỏi chẳng ai hỏi.</p>

<div class="callout ok">
<p><strong>Bản một câu.</strong> CI biến "tôi NGHĨ cái này chạy" thành "cái này ĐÃ chạy, trên một cái máy sạch, lúc 06:03:42, và đây là nhật ký". Mọi thứ khác trong khoá này — kích hoạt, job, biểu thức, bộ đệm, ma trận — đều là máy móc để làm cho câu trả lời ấy tới NHANH HƠN và có NGHĨA HƠN.</p>
</div>

<h3>Vì sao hai cái máy không đồng ý với nhau — đo bằng số</h3>
<p>"Một lượng bộ nhớ khác" nghe vẫn còn mơ hồ cho tới khi đặt con số cạnh nó, nên khoá đã đo. Node đặt <strong>trần heap mặc định</strong> (lượng bộ nhớ tối đa cho các đối tượng JavaScript) dựa vào lượng RAM mà cái máy báo lên. Một workflow trên sân tập của khoá in con số đó trên cả ba loại runner do GitHub cấp, và máy Mac của khoá tự in con số của nó:</p>
<div class="out">May Mac cua khoa (32 GB RAM, Node 22):   heap_size_limit 4144 MB
runner ubuntu-24.04  (RAM 15.6 GB):       heap_size_limit 4144 MB
runner windows-2025  (RAM 16.0 GB):       heap_size_limit 4144 MB
runner macos-15      (RAM  7.0 GB):       heap_size_limit 2096 MB</div>
<p>(Lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35987300829" target="_blank" rel="noopener">35987300829</a> trên sân tập công khai <code>cuonghoang1103/ga-san-tap</code>, 24/09/2026.) Runner macOS cho một tiến trình Node <strong>MỘT NỬA</strong> số heap mà laptop của bạn cho. Một bản dựng lúc cao điểm ngốn 3 GB thì ở nhà thoải mái, còn trên runner đó thì chết đúng bằng mã thoát 134 ở đầu bài này. Cách chữa không phải là "CI hỏng rồi" — mà là hai quyết định: đặt trần rõ ràng cho bản dựng (<code>--max-old-space-size=6144</code>), và thôi sinh bản đồ nguồn mà bộ cài đằng nào cũng vứt đi.</p>
<div class="callout ok">
<p><strong>Runner còn khác nhau theo độ công khai của kho.</strong> Theo thông số GitHub công bố (kiểm 09/2026), runner Linux và Windows chuẩn có <strong>4 CPU / 16 GB</strong> ở kho công khai nhưng chỉ <strong>2 CPU / 8 GB</strong> ở kho riêng tư; macOS (chip M1) thì <strong>3 CPU / 7 GB</strong> ở cả hai, ổ SSD 14 GB ở mọi loại. Nghĩa là cùng một workflow có thể hành xử KHÁC sau khi bạn chuyển kho sang riêng tư. Đó không phải lý do để sợ CI; đó là lý do để ghi rõ, cho từng dự án, màu xanh của bạn được đo trên cái máy nào.</p>
</div>

<h3>Tự tay thử: ca "máy tôi chạy được" nhỏ nhất có thể</h3>
<p>Bạn không cần một ứng dụng desktop 51.000 dòng để thấy toàn bộ cơ chế. Khoá dựng lại nó trên sân tập bằng ba tệp. Ứng dụng đọc cấu hình từ một tệp — giống phần lớn tệp <code>.env</code> hay <code>*.local.json</code> ngoài đời — nằm trong <code>.gitignore</code>:</p>
<pre><code class="language-javascript">// ch00/app.js — đọc một tệp KHÔNG được commit
const fs = require('node:fs');
const path = require('node:path');
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.local.json'), 'utf8'));
console.log(&#96;Xin chao tu &#36;{cfg.ten} — cong &#36;{cfg.cong}&#96;);</code></pre>
<p>Trên máy Mac của khoá, nó in lời chào và thoát 0. Lệnh <code>git status --ignored</code> cho thấy vì sao nó sẽ không sống sót qua chuyến đi:</p>
<div class="out">$ node ch00/app.js
Xin chao tu may-cua-Cuong — cong 3000
$ git status --short --ignored ch00
!! ch00/config.local.json</div>
<p>Hai dấu chấm than nghĩa là "bị bỏ qua" (ignored): tệp có trên ổ đĩa này và sẽ không bao giờ được đẩy lên. Workflow kiểm nó được viết đơn giản có chủ đích:</p>
<pre><code class="language-yaml">name: ch00 — may khac, khong phai may ban
on:
  push:
    branches: [ch00-mo-dau]
jobs:
  kiem:
    runs-on: ubuntu-24.04
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - name: Chay app giong het tren may nha
        run: node ch00/app.js</code></pre>
<p>Lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986054380" target="_blank" rel="noopener">35986054380</a> đỏ sau 7 giây:</p>
<div class="out">Error: ENOENT: no such file or directory, open '/home/runner/work/ga-san-tap/ga-san-tap/ch00/config.local.json'
    at Object.readFileSync (node:fs:440:20)
    ...
Node.js v22.23.2
##[error]Process completed with exit code 1.</div>
<p><code>ENOENT</code> là mã lỗi của hệ điều hành cho "không có tệp hay thư mục đó" (Error NO ENTry). Đọc được mã này là đọc được một nửa số lần CI đỏ của người mới.</p>
${slide('ga-00', 22, 'Sửa đúng chỗ: mặc định vào kho, tệp riêng chỉ để ghi đè')}
<p>Cách chữa KHÔNG phải "commit luôn tệp local" — tệp đó thường chứa cổng của <em>bạn</em>, mật khẩu cơ sở dữ liệu của <em>bạn</em>. Cách chữa là commit một bản <strong>mặc định</strong> (<code>config.example.json</code>) và để tệp local ghi đè lên nếu nó có mặt. Lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986409808" target="_blank" rel="noopener">35986409808</a>, cùng workflow, xanh sau 6 giây và in <code>Xin chao tu cau-hinh-mac-dinh — cong 8080</code>.</p>

<h3>Bắt được TRƯỚC khi push: phép thử bản clone sạch</h3>
<p>Siêu năng lực của CI không phải là "đám mây"; nó là <em>bản lấy về sạch</em>. Bạn mượn được nó ngay trên máy mình bằng ba lệnh — clone kho sang một thư mục tạm (thư mục này theo định nghĩa chỉ có tệp đã commit), rồi chạy đúng câu lệnh đó ở đấy:</p>
<pre><code class="language-bash">git clone -q --no-local . /tmp/ban-sach     # chỉ thứ đã commit mới đi theo
cd /tmp/ban-sach
node ch00/app.js; echo "exit=$?"</code></pre>
<div class="out">Error: ENOENT: no such file or directory, open '/tmp/ban-sach/ch00/config.local.json'
exit=1</div>
<p>Cùng lỗi, cùng mã thoát, không cần push (đo trên máy Mac của khoá ở commit đỏ <code>282937f</code>). Khác biệt so với CI là mọi thứ còn lại mà một cái máy sạch mang tới: hệ điều hành khác, không có gói cài toàn cục, bản vá Node khác (<code>v22.21.0</code> trên Mac, <code>v22.23.2</code> trên runner hôm đó). Bản clone sạch bắt được thứ vô hình đầu tiên trong bốn thứ; chỉ một cái máy KHÁC mới bắt được phần còn lại.</p>

<h3>Biến CI: khi nào nên hành xử khác trong CI — và khi nào KHÔNG</h3>
<p>Mọi job trên runner của GitHub đều đặt <code>CI=true</code> và <code>GITHUB_ACTIONS=true</code>. Sân tập in chúng ra:</p>
<div class="out">CI=true  GITHUB_ACTIONS=true
4
               total        used        free      shared  buff/cache   available
Mem:            15Gi       948Mi        12Gi        41Mi       2.4Gi        14Gi
v22.23.2</div>
<p>Nhiều công cụ tự đọc biến đó — bộ chạy test tắt chế độ theo dõi (watch), trình quản lý gói thôi vẽ thanh tiến trình. Cách chữa bản dựng desktop trong bài này đọc nó một cách CÓ CHỦ ĐÍCH (<code>sourcemap: !process.env.CI</code>). Làm vậy là chính đáng khi khác biệt nằm ở <strong>đầu ra bạn không cần</strong>. Nó nguy hiểm khi nó thay đổi <strong>thứ đang được kiểm</strong>.</p>
<table>
<thead><tr><th>Dùng <code>process.env.CI</code> để…</th><th>Kết luận</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>bỏ bản đồ nguồn mà bộ cài đằng nào cũng loại</td><td>được</td><td>sản phẩm y hệt; CI đỡ tốn bộ nhớ</td></tr>
<tr><td>tắt câu hỏi tương tác hoặc thanh tiến trình</td><td>được</td><td>chẳng có ai ngồi đó để trả lời</td></tr>
<tr><td>bỏ qua một test chậm "vì CI chậm"</td><td>không</td><td>màu xanh từ giờ nghĩa là ÍT hơn trước, và không ai thấy cái lỗ đó</td></tr>
<tr><td>dùng cơ sở dữ liệu hay bản Node khác trong CI</td><td>không</td><td>CI trả lời một câu mà production không bao giờ hỏi — đúng điều dòng chú thích về Node 22 của kho này cảnh báo</td></tr>
</tbody>
</table>

<div class="pitfall co-tieu-de"><strong>Bẫy — "CI qua rồi, vậy là chạy" chính là "máy tôi chạy được" phiên bản mới.</strong> CI dời lời khẳng định từ laptop của bạn sang MỘT cái máy sạch cụ thể. Đó là một lời khẳng định tốt hơn nhiều, nhưng vẫn là một cái máy: Ubuntu 24.04, 4 CPU, 16 GB, một bản vá Node, vào đúng ngày chạy. Nếu production chạy Alpine với 1 GB RAM thì CI chưa kiểm cái đó. Đọc màu xanh đúng với bản chất của nó: <em>những lệnh này, trên cái máy này, đã thoát 0.</em></div>

<div class="callout tip">
<p><strong>Câu hỏi phỏng vấn hay gặp: "Rốt cuộc CI đảm bảo được điều gì?"</strong> Một câu trả lời ngắn mà chắc: "Rằng một commit cụ thể, được lấy về sạch trên một cái máy tôi không hề chuẩn bị, qua được những phép kiểm chúng tôi đã chọn — và có nhật ký để chứng minh. Nó không đảm bảo mã ĐÚNG; nó đảm bảo phép kiểm ĐÃ CHẠY. Nên câu hỏi thật là: chúng ta chạy phép kiểm nào, và máy CI có giống production không." Rồi đưa MỘT ví dụ — tệp cấu hình bị ignore, hoặc trần heap trên runner macOS — vì một cú hỏng cụ thể đáng giá hơn một định nghĩa thuộc lòng.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong một kho bất kỳ của bạn (hoặc một kho thử công khai mới tạo), tìm một tệp CÓ trên máy nhưng bị ignore: chạy <code>git status --short --ignored</code> và tìm dòng bắt đầu bằng <code>!!</code>.</li>
<li>Làm phép thử bản clone sạch: <code>git clone -q --no-local . /tmp/ban-sach &amp;&amp; cd /tmp/ban-sach</code>, rồi chạy lệnh bạn vẫn dùng để khởi động hoặc test dự án. Ghi lại nó còn chạy hay không.</li>
<li>Thêm <code>.github/workflows/may-khac.yml</code>: một job <code>ubuntu-24.04</code>, <code>timeout-minutes: 5</code>, một bước checkout, một bước in <code>echo "CI=$CI"; nproc; node --version</code> rồi chạy lệnh khởi động/test của bạn. Push.</li>
<li>Mở lần chạy bằng <code>gh run view --log</code> (hoặc tab Actions) và so phiên bản Node, số CPU với laptop của bạn (<code>node --version</code>; <code>nproc</code>, hoặc <code>sysctl -n hw.ncpu</code> trên Mac).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một số run cụ thể, nêu được hai khác biệt CỤ THỂ giữa laptop và runner (vd bản vá Node, số CPU, một tệp bị ignore bị thiếu), và nói được trong một câu màu xanh (hoặc đỏ) của mình thật sự chứng minh điều gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">CI — Continuous Integration (tích hợp liên tục)</span><span class="v">Mỗi commit được dựng và kiểm tự động trên một máy sạch, để lỗi tích hợp lộ ra trong vài phút.</span></div>
<div class="kv"><span class="k">Runner (máy chạy)</span><span class="v">Cái máy thực thi một job. Runner do GitHub cấp là máy ảo mới tinh, bị huỷ sau job.</span></div>
<div class="kv"><span class="k">Clean checkout (bản lấy về sạch)</span><span class="v">Bản sao chỉ chứa tệp đã commit — không tệp bị ignore, không <code>node_modules</code> sót lại.</span></div>
<div class="kv"><span class="k">Exit code (mã thoát)</span><span class="v">Con số một lệnh trả về: 0 là thành công; khác 0 thì bước hỏng. 134 = bị huỷ (ở đây: chạm trần heap của V8).</span></div>
<div class="kv"><span class="k">Heap limit (trần heap)</span><span class="v">Lượng bộ nhớ tối đa V8 cho một tiến trình Node dùng cho đối tượng; mặc định phụ thuộc RAM của máy.</span></div>
<div class="kv"><span class="k"><code>.gitignore</code></span><span class="v">Danh sách tệp Git không bao giờ commit. Thứ gì ứng dụng cần mà chỉ nằm ở đó sẽ thiếu trong CI.</span></div>
<div class="kv"><span class="k">ENOENT</span><span class="v">Mã lỗi hệ điều hành: không tìm thấy tệp hay thư mục — thủ phạm quen thuộc của "máy tôi chạy được".</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>"Máy tôi chạy được" không ai khác kiểm được; "chạy được từ bản lấy về sạch" thì kiểm được — và CI kiểm nó ở MỖI lần push.</li>
<li>Bản dựng desktop chỉ hỏng trên macOS vì runner đó có 7 GB RAM và trần heap mặc định của Node ở đó là 2096 MB, bằng nửa con số 4144 MB của laptop.</li>
<li>Khác biệt vô hình phổ biến nhất là một tệp chưa commit hoặc bị ignore; phép thử bản clone sạch bắt được nó trước khi push.</li>
<li>Chỉ rẽ nhánh theo biến <code>CI</code> để bỏ đầu ra không cần, KHÔNG BAO GIỜ để làm yếu thứ được kiểm.</li>
<li>Xanh nghĩa là: những lệnh này đã thoát 0 trên cái máy này. Hãy biết đó là máy nào và lệnh nào.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Understanding GitHub Actions</span><span class="lc-sub">docs.github.com/en/actions/learn-github-actions/understanding-github-actions — bộ từ vựng (workflow, job, step, action, runner) mà cả khoá này dùng xuyên suốt.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — Continuous Integration</span><span class="lc-sub">martinfowler.com/articles/continuousIntegration.html — đăng lần đầu 10/09/2000, viết lại năm 2006 và sửa lớn lần nữa tháng 01/2024 — tới giờ vẫn là phát biểu rõ nhất về việc vì sao TÍCH HỢP THƯỜNG XUYÊN rẻ hơn tích hợp giỏi. (Bài này KHÔNG đặt ra thuật ngữ: Grady Booch đã dùng cụm từ năm 1991, và Kent Beck biến nó thành một thực hành trong Extreme Programming — chính bài viết nói vậy.)</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — --max-old-space-size</span><span class="lc-sub">nodejs.org/api/cli.html#--max-old-space-sizesize-in-mib — cùng ghi chú rằng mặc định được suy ra từ bộ nhớ hệ thống khả dụng, mà đó chính xác là lý do máy nhà và runner không đồng ý với nhau.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — mã thoát 137, 134, và thứ nhân hệ điều hành ghi lại</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cùng những mã thoát ấy đo từ phía máy chủ, kể cả vì sao 134 là cú hỏng hữu dụng hơn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — Workflow, job, step, runner|||0.2 — Workflow, job, bước, runner',
      slug: 'ga-0-2-bon-tang',
      type: 'VIDEO',
      description: 'Bốn danh từ, và mỗi cái là một ranh giới THẬT chứ không phải một cách sắp xếp. Đọc qua một lần chạy thật: 5 job, 3 nền tảng, 555 giây — và ba job trong đó bắt đầu cùng một giây.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Workflow, job, step, runner</h2>
<p class="lead">These four words look like an organisational hierarchy. They are not — each one is a real boundary, and knowing which boundary you are crossing explains most of what surprises people later.</p>

<h3>One real run, taken apart</h3>
${slide('ga-00', 26, 'A real release run: three machines start in the same second')}
<p>Run 32662461744 from this repository: a desktop release, five jobs, three operating systems, <strong>555,000 ms</strong> from start to finish.</p>

<div class="out">| Job            | Runner         | Bat dau  | Xong     | Tong |
|----------------|----------------|----------|----------|------|
| Kiem tra ma    | ubuntu-latest  | 19:49:32 | 19:50:44 |  72s |
| Dung Linux     | ubuntu-latest  | 19:50:48 | 19:54:49 | 241s |
| Dung macOS     | macos-latest   | 19:50:48 | 19:58:05 | 437s |
| Dung Windows   | windows-latest | 19:50:48 | 19:56:11 | 323s |
| Cong bo        | ubuntu-latest  | 19:58:08 | 19:58:42 |  34s |</div>

<div class="callout ok">
<p><strong>Read the third column.</strong> Three jobs start at exactly <strong>19:50:48</strong> — the same second. They are not queued behind one another; they are three separate machines running at once. And the first job finished at 19:50:44, four seconds before they started: they were <em>waiting</em> for it. That is the boundary between jobs, visible in timestamps.</p>
</div>

<h3>The four boundaries</h3>
${slide('ga-00', 25, 'Four real boundaries: event → workflow → job → step')}
<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">workflow</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">one YAML file</div><div class="lz-nsub">one trigger, one run. This repository has 11 of them, 1,394 lines</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">job</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">a whole machine</div><div class="lz-nsub">parallel by default; a fresh filesystem; nothing shared with any other job unless you ship it explicitly</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">step</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">one command or one action</div><div class="lz-nsub">sequential within a job, on the same filesystem, in order, stopping at the first failure</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">runner</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">the machine itself</div><div class="lz-nsub">a fresh VM per job, destroyed afterwards. Its OS is a choice with measurable consequences</div></div></div>
</div>
</div>

<h3>The boundary that surprises people: jobs share nothing</h3>
${slide('ga-00', 27, 'Jobs share nothing: files must be carried as an artifact')}
<p>Steps within a job share a filesystem. Jobs do not. In the run above, the Linux build job produced an installer and the publish job needed it — and the workflow had to <em>explicitly</em> move it:</p>

<div class="out">Dung Linux, buoc 9:   "Luu ban cai lam artifact"          8s
Dung macOS, buoc 9:   "Luu ban cai lam artifact"         27s
Dung Windows, buoc 9: "Luu ban cai lam artifact"          6s
Cong bo, buoc 4:      "Tai ban cai cua ca ba nen tang ve" 12s</div>

<p>Four steps and 53 seconds of a 555-second run exist purely to move files between machines. If jobs shared a disk, none of them would be needed. Chapter 5 measures artifacts properly; for now the point is structural: <strong>a job boundary is a machine boundary, and anything that crosses it has to be carried.</strong></p>

<h3>The boundary that costs money: the runner</h3>
${slide('ga-00', 28, 'runs-on is one line, but changing the OS changes the time')}
<p>The same two <code>npm ci</code> commands, on the same commit, in the same run, on three runners:</p>

<div class="out">| Nen tang | npm ci #1 | npm ci #2 | Tong |
|----------|-----------|-----------|------|
| Linux    | 12s       | 26s       |  38s |
| macOS    | 22s       | 50s       |  72s  (1,9x) |
| Windows  | 39s       | 68s       | 107s  (2,8x) |</div>

<p>And the build step itself: <strong>149 s on Linux, 171 s on Windows, 315 s on macOS</strong>. Nothing about the code differs. <code>runs-on:</code> is one line and it is one of the most consequential lines in the file.</p>

<div class="pitfall">
<p><strong>Trap — <code>ubuntu-latest</code> is not a version, it is a moving target.</strong> It points at whatever Ubuntu GitHub currently considers current, and it moves — usually with a deprecation window, occasionally with surprises. A workflow that was green for a year can go red on a morning you did not touch it. This repository&#39;s <code>ci-lint.yml</code> pins <code>ubuntu-24.04</code> for exactly this reason, while <code>desktop-release.yml</code> uses <code>ubuntu-latest</code> — two files, two different risk appetites, both defensible. What is not defensible is not knowing which one you chose.</p>
</div>

<h3>Steps: sequential, and they stop</h3>
${slide('ga-00', 29, 'Inside a job, steps run in order and stop at the first failure')}
<p>Within a job, steps run in order on one filesystem, and the first failure ends the job. That is why the ordering in this repository&#39;s CI is not arbitrary:</p>

<pre><code>- uses: actions/checkout@v4          <span class="tok-comment"># khong co ma thi khong lam gi duoc</span>
- uses: actions/setup-node@v4        <span class="tok-comment"># khong co node thi npm khong chay</span>
- run: npm ci --no-audit --no-fund   <span class="tok-comment"># khong co goi thi tsc khong chay</span>
- run: npx tsc --noEmit              <span class="tok-comment"># chot 1</span>
- run: npm run eval:grader           <span class="tok-comment"># chot 2</span>
- run: npm test                      <span class="tok-comment"># chot 3</span></code></pre>

<p>Cheapest and most likely to fail goes first. A type error that takes 9 seconds to find should not wait behind a test suite that takes 90.</p>

<div class="callout warn">
<p><strong>Two escape hatches, and they mean different things.</strong> <code>continue-on-error: true</code> lets a step fail without failing the job — this repository uses it for ESLint, deliberately, so lint warnings are visible without blocking. <code>if: always()</code> makes a step run even after an earlier failure — for uploading logs or test reports you specifically want <em>when</em> things went wrong. Lesson 2.4 measures the first and lesson 3.5 the second; confusing them is common.</p>
</div>

<h3>Where the vocabulary bites</h3>
<div class="kv-grid">
<div class="kv"><span class="k">"the build is slow"</span><span class="v">which job? The run was 555 s and the Linux build was 241 s. Optimising the wrong one changes nothing (Chapter 7)</span></div>
<div class="kv"><span class="k">"it worked in the previous step"</span><span class="v">same job, so same disk — that is expected. Across jobs it would not be</span></div>
<div class="kv"><span class="k">"just add it to the workflow"</span><span class="v">to which job? Adding a step to job A does nothing for job B, which starts from an empty machine</span></div>
<div class="kv"><span class="k">"CI is red"</span><span class="v">one job or all of them? The Actions UI shows per-job status, and one red job among five is a very different problem</span></div>
</div>

<h3>Run it step by step: proving that jobs share nothing</h3>
<p>The release run above shows the boundary indirectly — through 53 seconds of upload and download steps. The course made it show directly, with a three-job workflow on the sandbox. One job writes a file; two jobs that <code>needs:</code> it try to read it, one without carrying it and one with an artifact:</p>
<pre><code class="language-yaml">jobs:
  dung:
    runs-on: ubuntu-24.04
    steps:
      - run: mkdir -p dist &amp;&amp; echo "ban dung luc $(date -u +%T)" &gt; dist/ket-qua.txt
      - uses: actions/upload-artifact@v4
        with: { name: ket-qua, path: dist/ }
  doc-khong-mang:            # reads without downloading
    needs: dung
    runs-on: ubuntu-24.04
    steps:
      - run: cat dist/ket-qua.txt
  doc-co-mang:               # downloads first
    needs: dung
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/download-artifact@v4
        with: { name: ket-qua, path: dist/ }
      - run: cat dist/ket-qua.txt</code></pre>
<p>Run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986054356" target="_blank" rel="noopener">35986054356</a>:</p>
<div class="out">doc-khong-mang | cat: dist/ket-qua.txt: No such file or directory
doc-khong-mang | ##[error]Process completed with exit code 1.
doc-co-mang    | ban dung luc 10:14:24</div>
<p>Three things to read off this. First, <code>needs: dung</code> is about <strong>order</strong>, not sharing: the reader waited for the writer to finish and still started on an empty disk. Second, the only thing that crossed the boundary was what <code>upload-artifact</code> packed and <code>download-artifact</code> unpacked. Third, the red job did not stop the green one — they are siblings, both depending on <code>dung</code>, and a failure in one does not cancel the other. The whole run is still marked failed, because one of its jobs failed.</p>

<h3>What exactly is a runner? Reading the "Set up job" step</h3>
<p>Every job log starts with a step you did not write, <em>Set up job</em>. It is the runner introducing itself, and on the sandbox it said (run 35986054356, job <code>dung</code>, abridged):</p>
<div class="out">Current runner version: '2.337.0'
Runner Image Provisioner
  Hosted Compute Agent
  Azure Region: eastus2
Operating System
  Ubuntu 24.04.5 LTS
Runner Image
  Image: ubuntu-24.04
  Version: 20260920.314.1
GITHUB_TOKEN Permissions
  Contents: read
  Metadata: read
  Packages: read</div>
<p>A GitHub-hosted runner is a virtual machine in a cloud data centre, created for your job from a published image (the list of preinstalled tools lives in the <code>actions/runner-images</code> repository) and destroyed when the job ends. The three jobs of the sandbox run above even reported three different Azure regions — <code>eastus2</code>, <code>northcentralus</code>, <code>centralus</code> — which is the most physical proof there is that "a job is a machine". (The last group, <em>GITHUB_TOKEN Permissions</em>, is the token your job carries; Chapter 6 is about it.) Chapter 13 covers the other kind: a <strong>self-hosted runner</strong>, a machine you own and register yourself.</p>
<table>
<thead><tr><th></th><th>GitHub-hosted runner</th><th>Self-hosted runner</th></tr></thead>
<tbody>
<tr><td>Who owns the machine</td><td>GitHub (fresh VM per job)</td><td>you (a VPS, a home PC, a Kubernetes pod)</td></tr>
<tr><td>State between jobs</td><td>none — wiped</td><td>whatever you leave behind, unless you make it ephemeral</td></tr>
<tr><td>Cost on a public repository</td><td>free for standard runners</td><td>free in Actions minutes; you pay for the machine</td></tr>
<tr><td>Main risk</td><td>differs from your laptop and production</td><td>code from pull requests runs on <em>your</em> machine</td></tr>
</tbody>
</table>

<h3>One job or several? When to split — and when not to</h3>
<p>Once you know a job is a machine, "how many jobs?" becomes a cost question, not a style question. Each extra job buys parallelism and isolation and pays with its own setup: a new VM, a new checkout, a new <code>npm ci</code>. In this repository&#39;s release run, the two <code>npm ci</code> installs alone cost 38 s per job even on Linux — before any real work.</p>
<table>
<thead><tr><th>Split into separate jobs when…</th><th>Keep it in one job when…</th></tr></thead>
<tbody>
<tr><td>the parts are slow and independent (lint 40 s, tests 90 s → run side by side)</td><td>the parts are fast; setup would cost more than it saves</td></tr>
<tr><td>they need different machines (build on macOS and Windows)</td><td>every part needs the same installed dependencies</td></tr>
<tr><td>you want separate ✓/✗ checks, e.g. to require "tests" but not "lint"</td><td>one combined result is all anyone reads</td></tr>
<tr><td>a later job must only run if earlier ones pass (<code>needs:</code>), such as publish after build</td><td>the order is simply "step after step" on the same files</td></tr>
</tbody>
</table>
<p><code>ci-lint.yml</code> splits in the obvious place — backend and frontend are separate jobs with separate Node versions (22 and 20) and separate folders — and keeps each side&#39;s checks as steps in one job. That is a good default to copy: <strong>split by machine or by owner, not by command.</strong></p>

<h3>Four words people confuse with these four</h3>
<div class="kv-grid">
<div class="kv"><span class="k">run vs workflow</span><span class="v">The workflow is the YAML file; a run is one execution of it, with a number (e.g. 35986054356). One workflow, thousands of runs.</span></div>
<div class="kv"><span class="k">action vs step</span><span class="v">An action is a reusable package you call with <code>uses:</code> (e.g. <code>actions/checkout@v4</code>). It is <em>one kind</em> of step; the other kind is <code>run:</code>, a shell command.</span></div>
<div class="kv"><span class="k">job vs check</span><span class="v">On a pull request each job appears as a check with a ✓ or ✗. Branch protection (Chapter 14) requires checks by name — the job&#39;s <code>name:</code>, not the file name.</span></div>
<div class="kv"><span class="k">artifact vs cache</span><span class="v">An artifact carries a result <em>out</em> of a job (to another job, or to you); a cache speeds up <em>future</em> runs. Chapter 5 measures both.</span></div>
</div>

<div class="pitfall co-tieu-de"><strong>Trap — "I installed it in the lint job, so the test job has it."</strong> The most common first-week bug. Every job begins on an empty machine; <code>npm ci</code>, <code>setup-node</code>, environment variables set with <code>export</code> — none of it survives the job boundary. Either repeat the setup in each job (and let caching make it cheap), or pass a <em>result</em> across with an artifact. Deciding which is the design question behind half of Chapters 2 and 5.</div>

<div class="callout tip">
<p><strong>Interview question you will meet: "Explain the structure of a GitHub Actions workflow."</strong> Answer in boundaries, not in keywords: "An event such as a push triggers a workflow, which is a YAML file. The workflow has jobs; each job runs on its own fresh runner, in parallel by default unless <code>needs:</code> orders them. Inside a job, steps run sequentially on one filesystem and stop at the first failure. Anything that must cross from one job to another goes through artifacts or outputs." If you can add the consequence — "so installing in one job does nothing for another" — you have shown you have actually debugged one.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>In your test repository, create <code>.github/workflows/ranh-gioi.yml</code> with three jobs copied from the "step by step" block above (<code>dung</code>, <code>doc-khong-mang</code>, <code>doc-co-mang</code>), each with <code>timeout-minutes: 5</code>.</li>
<li>Push and open the run. In the job graph, confirm that the two readers wait for <code>dung</code> and then run side by side.</li>
<li>Open the <em>Set up job</em> step of each of the three jobs and write down the Azure region and the image version each one reports.</li>
<li>Run <code>gh run view &lt;id&gt; --log-failed</code> and find the single line that explains the red job.</li>
</ol>
<p><strong>Done when:</strong> your run shows exactly one red job (<code>doc-khong-mang</code>) and one green reader, you have the <code>No such file or directory</code> line copied from the log, and you can explain in one sentence why <code>needs:</code> did not make the file appear.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Workflow (quy trình tự động)</span><span class="v">One YAML file in <code>.github/workflows/</code>; an event starts one run of it.</span></div>
<div class="kv"><span class="k">Run (lần chạy)</span><span class="v">One execution of a workflow, identified by a number; it has jobs, logs, and a conclusion.</span></div>
<div class="kv"><span class="k">Job (công việc)</span><span class="v">A group of steps on one runner. Jobs are parallel by default and share nothing.</span></div>
<div class="kv"><span class="k">Step (bước)</span><span class="v">One <code>run:</code> command or one <code>uses:</code> action; sequential within its job.</span></div>
<div class="kv"><span class="k">Runner (máy chạy)</span><span class="v">The machine for one job: a fresh GitHub-hosted VM, or a self-hosted machine you register.</span></div>
<div class="kv"><span class="k"><code>needs:</code> (phụ thuộc)</span><span class="v">Makes a job wait for others to succeed. It orders jobs; it does not share files.</span></div>
<div class="kv"><span class="k">Artifact (sản phẩm dựng)</span><span class="v">Files uploaded from a job so other jobs — or people — can download them.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Workflow, job, step and runner are four real boundaries: file, machine, command, and the hardware underneath.</li>
<li>Jobs run in parallel on separate machines; three jobs of one release started in the same second, 19:50:48.</li>
<li>Jobs share nothing — measured: the reader without an artifact got "No such file or directory", the one with <code>download-artifact</code> read the file.</li>
<li><code>needs:</code> sets order, not sharing; siblings fail independently, and one red job makes the whole run red.</li>
<li><code>runs-on:</code> changes cost and time: in one run <code>npm ci</code> took 38 s on Linux and 107 s on Windows.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs, steps, runs-on</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions — the normative reference for every key in this lesson.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About GitHub-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners — the hardware behind each label, and the note that macOS runners have different specifications from Linux ones.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images</span><span class="lc-sub">github.com/actions/runner-images — what is preinstalled on each image, and the announcements repository where <code>-latest</code> moves are posted before they happen.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — what a checkout actually is</span><span class="lc-sub">/courses/git/learn${REF} — <code>actions/checkout</code> is a clone with a depth of 1 by default, and knowing that explains several later surprises.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Workflow, job, bước, runner</h2>
<p class="lead">Bốn từ này trông như một cây phân cấp để sắp xếp cho gọn. Không phải — mỗi cái là một RANH GIỚI THẬT, và biết mình đang vượt qua ranh giới nào giải thích được phần lớn những thứ làm người ta bất ngờ về sau.</p>

<h3>Một lần chạy thật, tháo ra</h3>
${slide('ga-00', 26, 'Một run phát hành thật: ba máy bắt đầu cùng một giây')}
<p>Lần chạy 32662461744 của chính kho này: một bản phát hành desktop, năm job, ba hệ điều hành, <strong>555.000 ms</strong> từ đầu tới cuối.</p>

<div class="out">| Job            | Runner         | Bat dau  | Xong     | Tong |
|----------------|----------------|----------|----------|------|
| Kiem tra ma    | ubuntu-latest  | 19:49:32 | 19:50:44 |  72s |
| Dung Linux     | ubuntu-latest  | 19:50:48 | 19:54:49 | 241s |
| Dung macOS     | macos-latest   | 19:50:48 | 19:58:05 | 437s |
| Dung Windows   | windows-latest | 19:50:48 | 19:56:11 | 323s |
| Cong bo        | ubuntu-latest  | 19:58:08 | 19:58:42 |  34s |</div>

<div class="callout ok">
<p><strong>Đọc cột thứ ba.</strong> Ba job bắt đầu vào ĐÚNG <strong>19:50:48</strong> — cùng một giây. Chúng không xếp hàng sau nhau; chúng là BA cái máy riêng chạy cùng lúc. Và job đầu tiên xong lúc 19:50:44, TRƯỚC đó bốn giây: chúng đã <em>CHỜ</em> nó. Đó là ranh giới giữa các job, nhìn thấy được ngay trong dấu thời gian.</p>
</div>

<h3>Bốn ranh giới</h3>
${slide('ga-00', 25, 'Bốn ranh giới thật: sự kiện → workflow → job → bước')}
<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">workflow</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">một tệp YAML</div><div class="lz-nsub">một bộ kích hoạt, một lần chạy. Kho này có 11 cái, 1.394 dòng</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">job</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">CẢ MỘT CÁI MÁY</div><div class="lz-nsub">mặc định chạy song song; một hệ tệp mới tinh; KHÔNG chia sẻ gì với job khác trừ khi bạn chuyển đi một cách tường minh</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">bước</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">một câu lệnh hoặc một action</div><div class="lz-nsub">tuần tự trong một job, trên CÙNG hệ tệp, theo thứ tự, DỪNG ở cú hỏng đầu tiên</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">runner</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">bản thân cái máy</div><div class="lz-nsub">một máy ảo MỚI cho mỗi job, huỷ đi sau đó. Hệ điều hành của nó là một lựa chọn có hậu quả ĐO ĐƯỢC</div></div></div>
</div>
</div>

<h3>Cái ranh giới làm người ta bất ngờ: job KHÔNG chia sẻ gì</h3>
${slide('ga-00', 27, 'Job không chia sẻ gì: tệp phải được mang qua bằng artifact')}
<p>Các bước trong một job dùng chung hệ tệp. Các job thì KHÔNG. Trong lần chạy ở trên, "Dựng Linux" tạo ra một bản cài và "Công bố" cần nó — và workflow phải <em>TƯỜNG MINH</em> chuyển nó đi:</p>

<div class="out">Dung Linux, buoc 9:   "Luu ban cai lam artifact"          8s
Dung macOS, buoc 9:   "Luu ban cai lam artifact"         27s
Dung Windows, buoc 9: "Luu ban cai lam artifact"          6s
Cong bo, buoc 4:      "Tai ban cai cua ca ba nen tang ve" 12s</div>

<p>Bốn bước và 53 giây của một lần chạy 555 giây tồn tại thuần tuý để CHUYỂN TỆP giữa các máy. Nếu các job dùng chung một cái đĩa thì chẳng cần cái nào cả. Chương 5 đo tạo tác cho đàng hoàng; bây giờ điểm cần nắm là về cấu trúc: <strong>ranh giới job là ranh giới MÁY, và bất cứ thứ gì vượt qua nó đều phải được KHIÊNG.</strong></p>

<h3>Cái ranh giới tốn tiền: runner</h3>
${slide('ga-00', 28, 'runs-on là một dòng, nhưng đổi hệ điều hành là đổi thời gian')}
<p>Cùng HAI câu lệnh <code>npm ci</code>, trên cùng một commit, trong cùng một lần chạy, trên ba runner:</p>

<div class="out">| Nen tang | npm ci #1 | npm ci #2 | Tong |
|----------|-----------|-----------|------|
| Linux    | 12s       | 26s       |  38s |
| macOS    | 22s       | 50s       |  72s  (1,9x) |
| Windows  | 39s       | 68s       | 107s  (2,8x) |</div>

<p>Còn bản thân bước dựng: <strong>149 s trên Linux, 171 s trên Windows, 315 s trên macOS</strong>. Chẳng có gì trong mã khác nhau cả. <code>runs-on:</code> là MỘT dòng và nó là một trong những dòng nặng ký nhất trong tệp.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>ubuntu-latest</code> KHÔNG phải một phiên bản, nó là một MỤC TIÊU DI ĐỘNG.</strong> Nó trỏ vào bất cứ bản Ubuntu nào GitHub đang coi là hiện hành, và nó DI CHUYỂN — thường có cửa sổ báo trước, thỉnh thoảng thì bất ngờ. Một workflow xanh suốt một năm có thể đỏ vào một buổi sáng bạn chẳng đụng vào nó. Tệp <code>ci-lint.yml</code> của kho này ghim <code>ubuntu-24.04</code> đúng vì lý do này, trong khi <code>desktop-release.yml</code> dùng <code>ubuntu-latest</code> — hai tệp, hai khẩu vị rủi ro khác nhau, cả hai đều bảo vệ được. Thứ KHÔNG bảo vệ được là không biết mình đã chọn cái nào.</p>
</div>

<h3>Bước: tuần tự, và chúng DỪNG</h3>
${slide('ga-00', 29, 'Trong một job, bước chạy tuần tự và dừng ở lỗi đầu tiên')}
<p>Trong một job, các bước chạy THEO THỨ TỰ trên một hệ tệp, và cú hỏng ĐẦU TIÊN kết thúc job. Đó là lý do thứ tự trong CI của kho này không phải tuỳ tiện:</p>

<pre><code>- uses: actions/checkout@v4          <span class="tok-comment"># khong co ma thi khong lam gi duoc</span>
- uses: actions/setup-node@v4        <span class="tok-comment"># khong co node thi npm khong chay</span>
- run: npm ci --no-audit --no-fund   <span class="tok-comment"># khong co goi thi tsc khong chay</span>
- run: npx tsc --noEmit              <span class="tok-comment"># chot 1</span>
- run: npm run eval:grader           <span class="tok-comment"># chot 2</span>
- run: npm test                      <span class="tok-comment"># chot 3</span></code></pre>

<p>Rẻ nhất và dễ hỏng nhất đi TRƯỚC. Một lỗi kiểu mất 9 giây để tìm ra thì không nên xếp hàng sau một bộ test mất 90 giây.</p>

<div class="callout warn">
<p><strong>Hai cửa thoát, và chúng có nghĩa KHÁC nhau.</strong> <code>continue-on-error: true</code> cho phép một bước HỎNG mà không làm hỏng job — kho này dùng nó cho ESLint, một cách có chủ đích, để cảnh báo lint nhìn thấy được mà không chặn đường. <code>if: always()</code> làm cho một bước CHẠY kể cả sau khi có bước trước hỏng — dành cho việc tải log hay báo cáo test lên, thứ bạn muốn có ĐÚNG LÚC mọi chuyện đổ vỡ. Bài 2.4 đo cái thứ nhất, bài 3.5 đo cái thứ hai; lẫn lộn chúng là chuyện thường gặp.</p>
</div>

<h3>Chỗ mà bộ từ vựng này cắn bạn</h3>
<div class="kv-grid">
<div class="kv"><span class="k">"bản dựng chậm"</span><span class="v">JOB NÀO? Cả lần chạy là 555 s còn bản dựng Linux là 241 s. Tối ưu nhầm cái thì chẳng đổi gì (Chương 7)</span></div>
<div class="kv"><span class="k">"bước trước nó chạy được mà"</span><span class="v">cùng JOB, nên cùng đĩa — thế là ĐÚNG. Qua job khác thì không như vậy</span></div>
<div class="kv"><span class="k">"cứ thêm vào workflow đi"</span><span class="v">vào JOB NÀO? Thêm một bước vào job A chẳng làm gì cho job B, thứ khởi đầu từ một cái máy TRỐNG</span></div>
<div class="kv"><span class="k">"CI đỏ"</span><span class="v">MỘT job hay TẤT CẢ? Giao diện Actions hiện trạng thái theo từng job, và một job đỏ trên năm cái là một vấn đề rất khác</span></div>
</div>

<h3>Chạy thử từng bước: chứng minh job KHÔNG chia sẻ gì</h3>
<p>Lần chạy phát hành ở trên cho thấy ranh giới một cách gián tiếp — qua 53 giây của các bước tải lên, tải xuống. Khoá cho nó hiện ra TRỰC TIẾP bằng một workflow ba job trên sân tập. Một job ghi một tệp; hai job <code>needs:</code> nó thử đọc tệp đó, một job không mang tệp qua, một job mang qua bằng artifact:</p>
<pre><code class="language-yaml">jobs:
  dung:
    runs-on: ubuntu-24.04
    steps:
      - run: mkdir -p dist &amp;&amp; echo "ban dung luc $(date -u +%T)" &gt; dist/ket-qua.txt
      - uses: actions/upload-artifact@v4
        with: { name: ket-qua, path: dist/ }
  doc-khong-mang:            # đọc mà KHÔNG tải về
    needs: dung
    runs-on: ubuntu-24.04
    steps:
      - run: cat dist/ket-qua.txt
  doc-co-mang:               # tải về trước
    needs: dung
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/download-artifact@v4
        with: { name: ket-qua, path: dist/ }
      - run: cat dist/ket-qua.txt</code></pre>
<p>Lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986054356" target="_blank" rel="noopener">35986054356</a>:</p>
<div class="out">doc-khong-mang | cat: dist/ket-qua.txt: No such file or directory
doc-khong-mang | ##[error]Process completed with exit code 1.
doc-co-mang    | ban dung luc 10:14:24</div>
<p>Đọc ra được ba điều. Một, <code>needs: dung</code> là về <strong>THỨ TỰ</strong>, không phải chia sẻ: job đọc đã chờ job ghi xong mà vẫn bắt đầu trên một cái đĩa trống. Hai, thứ DUY NHẤT vượt được ranh giới là thứ <code>upload-artifact</code> đóng gói và <code>download-artifact</code> mở ra. Ba, job đỏ không chặn job xanh — chúng là hai anh em cùng phụ thuộc vào <code>dung</code>, và một đứa hỏng không huỷ đứa kia. Cả lần chạy vẫn bị đánh dấu thất bại, vì có một job của nó thất bại.</p>

<h3>Runner THẬT RA là gì? Đọc bước "Set up job"</h3>
<p>Nhật ký của mọi job đều mở đầu bằng một bước bạn không viết: <em>Set up job</em>. Đó là runner tự giới thiệu, và trên sân tập nó nói (lần chạy 35986054356, job <code>dung</code>, rút gọn):</p>
<div class="out">Current runner version: '2.337.0'
Runner Image Provisioner
  Hosted Compute Agent
  Azure Region: eastus2
Operating System
  Ubuntu 24.04.5 LTS
Runner Image
  Image: ubuntu-24.04
  Version: 20260920.314.1
GITHUB_TOKEN Permissions
  Contents: read
  Metadata: read
  Packages: read</div>
<p>Một runner do GitHub cấp là một máy ảo trong trung tâm dữ liệu đám mây, được dựng cho job của bạn từ một ảnh công bố sẵn (danh sách công cụ cài sẵn nằm ở kho <code>actions/runner-images</code>) và bị huỷ khi job xong. Ba job của lần chạy trên sân tập ở trên thậm chí báo ba vùng Azure khác nhau — <code>eastus2</code>, <code>northcentralus</code>, <code>centralus</code> — đó là bằng chứng "vật lý" nhất rằng "một job là một cái máy". (Nhóm cuối, <em>GITHUB_TOKEN Permissions</em>, là cái token job của bạn mang theo; Chương 6 nói về nó.) Chương 13 nói về loại còn lại: <strong>self-hosted runner</strong> (runner tự host) — một cái máy của bạn, tự đăng ký vào GitHub.</p>
<table>
<thead><tr><th></th><th>Runner GitHub cấp</th><th>Runner tự host</th></tr></thead>
<tbody>
<tr><td>Ai sở hữu cái máy</td><td>GitHub (máy ảo mới cho MỖI job)</td><td>bạn (VPS, máy tính ở nhà, một pod Kubernetes)</td></tr>
<tr><td>Trạng thái giữa các job</td><td>không có — bị xoá sạch</td><td>bất cứ thứ gì bạn để lại, trừ khi bạn cho nó dùng một lần (ephemeral)</td></tr>
<tr><td>Chi phí ở kho công khai</td><td>miễn phí với runner chuẩn</td><td>không tốn phút Actions; bạn trả tiền cái máy</td></tr>
<tr><td>Rủi ro chính</td><td>khác laptop và khác production</td><td>mã từ pull request chạy trên máy CỦA BẠN</td></tr>
</tbody>
</table>

<h3>Một job hay nhiều job? Khi nào nên tách — và khi nào KHÔNG</h3>
<p>Khi đã biết một job là một cái máy, câu "bao nhiêu job?" trở thành câu hỏi CHI PHÍ chứ không phải phong cách. Mỗi job thêm vào mua được chạy song song và cách ly, và trả bằng phần chuẩn bị riêng của nó: một máy ảo mới, một lần checkout mới, một lần <code>npm ci</code> mới. Trong lần chạy phát hành của kho này, riêng hai lần <code>npm ci</code> đã tốn 38 giây mỗi job, ngay cả trên Linux — trước khi làm việc thật nào.</p>
<table>
<thead><tr><th>Tách thành nhiều job khi…</th><th>Giữ trong một job khi…</th></tr></thead>
<tbody>
<tr><td>các phần chậm và độc lập (lint 40 s, test 90 s → chạy cạnh nhau)</td><td>các phần nhanh; phần chuẩn bị sẽ tốn hơn thứ nó tiết kiệm</td></tr>
<tr><td>chúng cần máy khác nhau (dựng trên macOS và Windows)</td><td>phần nào cũng cần đúng những phụ thuộc đã cài</td></tr>
<tr><td>bạn muốn các check ✓/✗ riêng, vd bắt buộc "tests" mà không bắt buộc "lint"</td><td>chỉ có một kết quả gộp là thứ mọi người đọc</td></tr>
<tr><td>job sau chỉ được chạy nếu job trước qua (<code>needs:</code>), như phát hành sau khi dựng</td><td>thứ tự chỉ đơn giản là "bước này rồi bước kia" trên cùng các tệp</td></tr>
</tbody>
</table>
<p><code>ci-lint.yml</code> tách ở đúng chỗ hiển nhiên — backend và frontend là hai job riêng, với hai bản Node riêng (22 và 20) và hai thư mục riêng — còn các phép kiểm của mỗi bên là các bước trong một job. Đó là mặc định tốt để bắt chước: <strong>tách theo MÁY hoặc theo NGƯỜI SỞ HỮU, đừng tách theo từng câu lệnh.</strong></p>

<h3>Bốn từ người ta hay nhầm với bốn từ này</h3>
<div class="kv-grid">
<div class="kv"><span class="k">run và workflow</span><span class="v">Workflow là tệp YAML; run (lần chạy) là MỘT lần thực thi nó, có số hiệu (vd 35986054356). Một workflow, hàng nghìn run.</span></div>
<div class="kv"><span class="k">action và step</span><span class="v">Action là một gói dùng lại, gọi bằng <code>uses:</code> (vd <code>actions/checkout@v4</code>). Nó là MỘT LOẠI bước; loại còn lại là <code>run:</code> — một câu lệnh shell.</span></div>
<div class="kv"><span class="k">job và check</span><span class="v">Trên một pull request, mỗi job hiện thành một check (phép kiểm) có ✓ hoặc ✗. Luật bảo vệ nhánh (Chương 14) đòi check theo TÊN — là <code>name:</code> của job, không phải tên tệp.</span></div>
<div class="kv"><span class="k">artifact và cache</span><span class="v">Artifact mang một kết quả RA KHỎI job (sang job khác, hoặc về tay bạn); cache làm nhanh các lần chạy SAU. Chương 5 đo cả hai.</span></div>
</div>

<div class="pitfall co-tieu-de"><strong>Bẫy — "Mình cài nó ở job lint rồi, job test có sẵn mà."</strong> Lỗi phổ biến nhất tuần đầu. Mọi job bắt đầu trên một cái máy TRỐNG; <code>npm ci</code>, <code>setup-node</code>, biến môi trường đặt bằng <code>export</code> — không cái nào sống qua ranh giới job. Hoặc lặp lại phần chuẩn bị ở mỗi job (và để cache làm nó rẻ đi), hoặc chuyển một <em>kết quả</em> sang bằng artifact. Chọn cách nào là câu hỏi thiết kế đằng sau một nửa Chương 2 và Chương 5.</div>

<div class="callout tip">
<p><strong>Câu hỏi phỏng vấn hay gặp: "Giải thích cấu trúc một workflow GitHub Actions."</strong> Trả lời bằng RANH GIỚI, đừng liệt kê từ khoá: "Một sự kiện, ví dụ push, kích hoạt một workflow — là một tệp YAML. Workflow có các job; mỗi job chạy trên một runner mới của riêng nó, song song theo mặc định trừ khi <code>needs:</code> xếp thứ tự. Trong một job, các bước chạy tuần tự trên cùng một hệ tệp và dừng ở lỗi đầu tiên. Thứ gì cần đi từ job này sang job kia thì phải qua artifact hoặc outputs." Nếu bạn nói thêm được hệ quả — "nên cài ở job này chẳng giúp gì job kia" — người phỏng vấn biết bạn đã từng thật sự gỡ lỗi một cái.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong kho thử của bạn, tạo <code>.github/workflows/ranh-gioi.yml</code> gồm ba job chép từ khối "Chạy thử từng bước" ở trên (<code>dung</code>, <code>doc-khong-mang</code>, <code>doc-co-mang</code>), mỗi job có <code>timeout-minutes: 5</code>.</li>
<li>Push rồi mở lần chạy. Trên đồ thị job, xác nhận hai job đọc chờ <code>dung</code> rồi chạy CẠNH NHAU.</li>
<li>Mở bước <em>Set up job</em> của cả ba job, ghi lại vùng Azure (Azure Region) và phiên bản ảnh mỗi job báo.</li>
<li>Chạy <code>gh run view &lt;id&gt; --log-failed</code> và tìm ĐÚNG MỘT dòng giải thích job đỏ.</li>
</ol>
<p><strong>Đạt khi:</strong> lần chạy của bạn có đúng một job đỏ (<code>doc-khong-mang</code>) và một job đọc xanh, bạn chép được dòng <code>No such file or directory</code> từ nhật ký, và giải thích được trong một câu vì sao <code>needs:</code> không làm tệp hiện ra.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Workflow (quy trình tự động)</span><span class="v">Một tệp YAML trong <code>.github/workflows/</code>; một sự kiện khởi động một lần chạy của nó.</span></div>
<div class="kv"><span class="k">Run (lần chạy)</span><span class="v">Một lần thực thi workflow, có số hiệu; gồm các job, nhật ký và kết luận.</span></div>
<div class="kv"><span class="k">Job (công việc)</span><span class="v">Một nhóm bước trên MỘT runner. Các job song song theo mặc định và không chia sẻ gì.</span></div>
<div class="kv"><span class="k">Step (bước)</span><span class="v">Một lệnh <code>run:</code> hoặc một action <code>uses:</code>; tuần tự bên trong job.</span></div>
<div class="kv"><span class="k">Runner (máy chạy)</span><span class="v">Cái máy cho một job: máy ảo mới của GitHub, hoặc máy tự host bạn đăng ký.</span></div>
<div class="kv"><span class="k"><code>needs:</code> (phụ thuộc)</span><span class="v">Bắt một job chờ các job khác thành công. Nó xếp THỨ TỰ; nó không chia sẻ tệp.</span></div>
<div class="kv"><span class="k">Artifact (sản phẩm dựng)</span><span class="v">Tệp được tải lên từ một job để job khác — hoặc con người — tải xuống.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Workflow, job, bước và runner là bốn ranh giới THẬT: tệp, máy, câu lệnh, và phần cứng bên dưới.</li>
<li>Các job chạy song song trên các máy riêng; ba job của một lần phát hành bắt đầu cùng một giây, 19:50:48.</li>
<li>Job không chia sẻ gì — đo thật: job đọc không có artifact nhận "No such file or directory", job có <code>download-artifact</code> đọc được tệp.</li>
<li><code>needs:</code> đặt thứ tự chứ không chia sẻ; các job anh em hỏng độc lập, và một job đỏ làm cả lần chạy đỏ.</li>
<li><code>runs-on:</code> đổi chi phí và thời gian: trong một lần chạy, <code>npm ci</code> mất 38 s trên Linux và 107 s trên Windows.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: jobs, steps, runs-on</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions — tài liệu chuẩn tắc cho mọi khoá xuất hiện trong bài này.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About GitHub-hosted runners</span><span class="lc-sub">docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners — phần cứng đằng sau mỗi cái nhãn, và ghi chú rằng runner macOS có cấu hình KHÁC runner Linux.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/runner-images</span><span class="lc-sub">github.com/actions/runner-images — cái gì được cài sẵn trên mỗi ảnh, và kho thông báo nơi các cú dời <code>-latest</code> được đăng TRƯỚC khi chúng xảy ra.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — một cú checkout thật ra là gì</span><span class="lc-sub">/courses/git/learn${REF} — <code>actions/checkout</code> là một cú clone với độ sâu mặc định bằng 1, và biết điều đó giải thích được vài chuyện bất ngờ về sau.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Reading a real workflow, line by line|||0.3 — Đọc một workflow THẬT, từng dòng một',
      slug: 'ga-0-3-doc-mot-workflow',
      type: 'VIDEO',
      description: 'Toàn bộ ci-lint.yml của kho này, không sửa gì. Bốn mươi dòng đầu chứa một sự BẤT ĐỐI XỨNG mà tác giả có lẽ không cố ý: sửa README rồi push thì CI KHÔNG chạy, nhưng cũng cú sửa đó trong một pull request thì CI CHẠY.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Reading a real workflow, line by line</h2>
<p class="lead">Not a tutorial workflow — the one that has run 526 times in this repository. Reading a file that is actually in service teaches more than reading one written to be read.</p>

<h3>The trigger block</h3>
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
      - 'frontend/package.json'
      - 'tsconfig.json'
      - 'frontend/tsconfig.json'
      - '.eslintrc.json'
      - '.prettierrc'
  workflow_dispatch: {}   <span class="tok-comment"># cho phep bam chay tay — khong can push</span></code></pre>

<div class="callout warn">
<p><strong>Look at what <code>pull_request</code> does not have.</strong> The <code>push</code> trigger has a <code>paths</code> filter — eleven patterns, so a commit touching only a README or a workflow file does not start a run. The <code>pull_request</code> trigger has <code>branches</code> and <strong>no <code>paths</code></strong>. The same README-only change therefore <em>does</em> start a run when it arrives as a pull request, and does <em>not</em> when it is pushed straight to <code>main</code>.</p>
</div>

<p>Is that a bug? Not necessarily — you could argue a PR should always get a full check regardless of what it touches. But it is almost certainly not a decision somebody made on purpose, and it is the kind of asymmetry that lives in a file for a year without anyone noticing. Reading the trigger block carefully is how you find out what your CI actually does, as opposed to what you assume it does.</p>

<h3>Three triggers, three different jobs of work</h3>
${slide('ga-00', 30, 'The on: block of ci-lint.yml has an asymmetry')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">pull_request</span><span class="lz-lnote">answers "is it safe to merge?" — and runs against a <em>merge commit</em>, not your branch. Chapter 1 measures why that distinction matters</span></div>
<div class="lz-layer"><span class="lz-lname">push</span><span class="lz-lnote">answers "is <code>main</code> still healthy?" — the safety net for anything that got in without a PR</span></div>
<div class="lz-layer"><span class="lz-lname">workflow_dispatch: {}</span><span class="lz-lnote">answers "can a human run this on demand?" The empty <code>{}</code> means no inputs. When this lesson was written, ten of this repository&#39;s eleven workflows were dispatch-only; by 09/2026 it has fourteen, and twelve of them still are</span></div>
</div>

<h3>The job header</h3>
${slide('ga-00', 31, 'timeout-minutes: the default is 360 — set your own')}
<pre><code>jobs:
  backend-lint:
    name: Backend Type Check
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    defaults:
      run:
        working-directory: .</code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">backend-lint</span><span class="v">the job <em>id</em> — what other jobs refer to in <code>needs:</code>, and what appears in the API</span></div>
<div class="kv"><span class="k">name:</span><span class="v">the human label in the UI. Different from the id, deliberately</span></div>
<div class="kv"><span class="k">ubuntu-24.04</span><span class="v">pinned, not <code>-latest</code>. This file chose stability; <code>desktop-release.yml</code> in the same repo chose <code>-latest</code></span></div>
<div class="kv"><span class="k">timeout-minutes: 10</span><span class="v">the single most underused key in GitHub Actions. Default is <strong>360</strong> — six hours of a hung job before anything notices</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — the default timeout is six hours.</strong> A step that waits on input, retries forever, or deadlocks will sit there burning runner time until <code>timeout-minutes</code> or the six-hour ceiling stops it. On a private repository that is billed minutes; on any repository it is a job that looks "in progress" for an afternoon while everyone assumes it is just slow. Ten minutes, as here, is a statement: <em>if this takes longer than ten minutes something is wrong, and I would rather know.</em></p>
</div>

<h3>The steps, and why they are in this order</h3>
<pre><code>- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm'
- name: Install deps
  run: npm ci --no-audit --no-fund
- name: TypeScript type-check (required)
  run: npx tsc --noEmit</code></pre>

<p>Three things worth noticing in four steps.</p>

<p><strong><code>node-version: '22'</code> is quoted.</strong> That is not decoration — Chapter 1 measures what happens without the quotes, and it is not what you expect.</p>

<p><strong><code>cache: 'npm'</code> is one line and it is doing real work.</strong> It restores <code>~/.npm</code> from a previous run keyed on the lockfile hash. Chapter 5 measures how much it saves and the one case where it silently saves nothing.</p>

<p><strong><code>--no-audit --no-fund</code>.</strong> Two flags that turn off things nobody reads in CI: the vulnerability audit output and the funding message. Small, but this step runs on every push.</p>

<h3>The step that is deliberately allowed to fail</h3>
${slide('ga-00', 32, 'Without shell:, run: has no pipefail — a failure mid-pipe is swallowed')}
<pre><code>- name: ESLint (informational)
  continue-on-error: true
  run: npm run lint 2>&amp;1 | tail -30 || echo "(lint warnings — pre-existing)"</code></pre>

<p>Three separate safety nets on one line, which is one more than necessary and worth understanding:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">continue-on-error: true</span><span class="lz-t">job-level</span><span class="lz-d">the step may fail; the job continues and stays green</span></div>
<div class="lz-step"><span class="lz-k">|| echo "…"</span><span class="lz-t">shell-level</span><span class="lz-d">the pipeline never returns non-zero in the first place</span></div>
<div class="lz-step"><span class="lz-k">| tail -30</span><span class="lz-t">output-level</span><span class="lz-d">keeps the log readable — but see the pitfall</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — <code>| tail -30</code> silently discards the exit code.</strong> In a pipeline, the shell reports the status of the <em>last</em> command, and <code>tail</code> almost always succeeds. So <code>npm run lint | tail -30</code> exits 0 whether lint passed or not, and the <code>|| echo</code> after it can never fire. Here that is harmless — the step is informational and <code>continue-on-error</code> already says so. In a step that is meant to gate, the same shape means the gate is not there. The Deploy VPS course measured this exact behaviour: without <code>set -o pipefail</code>, a failing command in a pipeline is invisible.</p>
</div>

<h3>The step that is designed to skip</h3>
${slide('ga-00', 33, 'A step designed to skip: an absent secret becomes an empty string')}
<pre><code>- name: CV critique fabrication test (skips without an AI key)
  env:
    ANTHROPIC_API_KEY: &#36;{{ secrets.ANTHROPIC_API_KEY }}
    LLM_BASE_URL: &#36;{{ secrets.LLM_BASE_URL }}
  run: npm run eval:cv-fabrication</code></pre>

<p>The repository&#39;s notes are explicit that this secret was <em>removed on purpose</em>: the account ran out of credit, so a key would have traded one red build for another. With the secret absent, GitHub substitutes an empty string, the script detects no key, and exits 0 — the step reports success and does nothing.</p>

<div class="callout warn">
<p><strong>That is a deliberate choice with a stated cost, which is the right way to do it.</strong> The notes record what is no longer being checked: nothing watches for the AI inventing metrics in CV critiques any more. A skipped step that everyone knows is skipped is a managed risk. A skipped step nobody noticed is Chapter 10&#39;s recurring nightmare — a check that passes because it is not running.</p>
</div>

<h3>What the whole file costs</h3>
<div class="out">ci-lint.yml, 10 lan chay gan nhat (giay):
  135, 155, 140, 160, 144, 144, 100, 144, 141, 145
  → TB ~141s, min 100s, max 160s

Hai job chay SONG SONG: backend-lint (node 22) + frontend-lint (node 20)</div>

<p>About two minutes and twenty seconds, twice per commit that touches source, 526 times so far. Chapter 7 is about whether that number can come down and whether it should.</p>

<h3>Measured: the shell GitHub picks when you do not say</h3>
<p>The pitfall above says a pipe hides the exit code "without <code>set -o pipefail</code>". The natural next question is whether GitHub sets it for you. The answer depends on one line you probably never wrote. The course ran the same command in two jobs of one run — <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986054351" target="_blank" rel="noopener">35986054351</a> — once without <code>shell:</code> and once with <code>shell: bash</code>:</p>
<pre><code class="language-yaml">  mac-dinh:
    steps:
      - run: |
          false | tail -1
          echo "van chay toi day — buoc XANH"
  khai-bash:
    steps:
      - shell: bash
        run: |
          false | tail -1
          echo "khong bao gio in dong nay"</code></pre>
<div class="out">mac-dinh  | shell: /usr/bin/bash -e {0}
mac-dinh  | van chay toi day — buoc XANH                        → job ✓
khai-bash | shell: /usr/bin/bash --noprofile --norc -e -o pipefail {0}
khai-bash | ##[error]Process completed with exit code 1.       → job ✗</div>
<p>The runner prints the exact command line it uses for every <code>run:</code> step — the <code>shell:</code> line in the log — and it differs: <strong>unspecified</strong> means <code>bash -e</code>, which stops at a failing command but not at a failing command in the middle of a pipe; <strong><code>shell: bash</code></strong> adds <code>-o pipefail</code>. On Windows the unspecified default is PowerShell, while <code>shell: bash</code> uses Git Bash with the same flags — the three-OS run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35987300829" target="_blank" rel="noopener">35987300829</a> printed <code>C:\\Program Files\\Git\\bin\\bash.EXE --noprofile --norc -e -o pipefail {0}</code>.</p>
<table>
<thead><tr><th>You write</th><th>Linux / macOS runs</th><th>Pipe failure</th></tr></thead>
<tbody>
<tr><td>nothing</td><td><code>bash -e {0}</code></td><td>swallowed if the last command succeeds</td></tr>
<tr><td><code>shell: bash</code></td><td><code>bash --noprofile --norc -eo pipefail {0}</code></td><td>fails the step</td></tr>
<tr><td><code>shell: sh</code></td><td><code>sh -e {0}</code></td><td>swallowed</td></tr>
<tr><td><code>defaults: run: shell: bash</code> at the top</td><td>the <code>shell: bash</code> line for every step</td><td>fails the step</td></tr>
</tbody>
</table>
<p>So this repository&#39;s ESLint step — <code>npm run lint 2&gt;&amp;1 | tail -30</code>, no <code>shell:</code> — really does throw lint&#39;s exit code away, and not only because of <code>tail</code>. Informational steps can live with that. For a gating step, one line of <code>defaults:</code> fixes it for the whole file.</p>

<h3>Measured: what timeout-minutes looks like when it fires</h3>
<p>Ten minutes is the right value for this file, but you cannot wait ten minutes to see it work, so the sandbox used one minute on a step that sleeps for five (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986054362" target="_blank" rel="noopener">35986054362</a>):</p>
<div class="out">bat dau luc 10:14:23
##[error]The operation was canceled.
Cleaning up orphan processes
Terminate orphan process: pid (1903) (sleep)

Annotation: The job has exceeded the maximum execution time of 1m0s
Conclusion: cancelled   (step 10:14:23 → 10:15:35)</div>
<p>Two details are worth remembering. The conclusion is <strong>cancelled</strong>, not <strong>failure</strong> — a filter such as <code>if: failure()</code> in a later job will not fire for it (Chapter 3 is about exactly this). And the reason is only in the <em>annotation</em>, not in the step log, which just says "canceled". If you read only the log you will think someone pressed the cancel button.</p>

<h3>Reading any workflow in five questions</h3>
<p>You will be handed workflows you did not write — in a new job, in an open-source project, in an interview. Line-by-line reading works, but five questions in this order get you to the important lines first:</p>
<table>
<thead><tr><th>Question</th><th>Where to look</th><th>Answer for ci-lint.yml</th></tr></thead>
<tbody>
<tr><td>1. When does it run?</td><td><code>on:</code> — events, branches, paths</td><td>PR to main (always), push to main (only source paths), by hand</td></tr>
<tr><td>2. On what?</td><td><code>runs-on:</code>, <code>container:</code>, matrix</td><td>two jobs, both <code>ubuntu-24.04</code>, pinned</td></tr>
<tr><td>3. How long at most?</td><td><code>timeout-minutes:</code></td><td>10 min per job (default would be 360)</td></tr>
<tr><td>4. What does green mean?</td><td>steps without <code>continue-on-error</code> / skip logic</td><td>tsc + two evals + unit tests; lint is only a report; the fabrication test skips without a key</td></tr>
<tr><td>5. What can it touch?</td><td><code>permissions:</code>, <code>secrets.*</code>, deploy steps</td><td>reads two secrets (absent), no deploy, default token permissions</td></tr>
</tbody>
</table>
<p>Question 5 is the one beginners skip and reviewers ask. A workflow that deploys, publishes a package or writes to the repository needs a much slower read than one that only type-checks — Chapter 6 is about that difference.</p>

<h3>A yellow annotation you will see in 09/2026</h3>
${slide('ga-00', 34, 'Yellow annotation in 09/2026: checkout@v4 is being forced onto Node 24')}
<p>Every run on the sandbox that used <code>actions/checkout@v4</code> — the same version this repository&#39;s <code>ci-lint.yml</code> pins — ended with a yellow annotation: <em>"Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4."</em> The run is still green. The action is still v4. What changed is the runtime underneath it: JavaScript actions declare the Node version they need (<code>runs: using: node20</code>), and GitHub has moved runners to Node 24. The current checkout release when this was written is <code>v7.0.1</code> (07/2026) and declares <code>node24</code>.</p>
<div class="pitfall co-tieu-de"><strong>Trap — treating yellow as noise.</strong> Annotations are where GitHub announces what will break next. "Deprecated" today is "removed" on a date in the changelog. The right response is not to bump every <code>@v4</code> to <code>@v7</code> in a panic — major versions can change inputs and defaults — but to read the release notes of each action you use and upgrade deliberately. Chapter 4 teaches how, including why pinning to a full commit SHA is safer than any tag.</div>

<h3>Check a workflow before you push it: actionlint</h3>
<p>YAML mistakes in a workflow only show up after a push — unless you lint it. <code>actionlint</code> checks workflow syntax, expressions, and the shell scripts inside <code>run:</code> (via shellcheck). Run through Docker, it needs nothing installed:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/repo:ro -w /repo rhysd/actionlint:latest</code></pre>
<div class="out">.github/workflows/ch00-ba-may.yml:17:9: shellcheck reported issue in this script: SC2086:info:3:60: Double quote to prevent globbing and word splitting [shellcheck]</div>
<p>That was actionlint 1.7.12 on the course Mac, over a copy of this repository&#39;s <code>ci-lint.yml</code> plus the sandbox workflows: <code>ci-lint.yml</code> came back clean; one sandbox file had an unquoted variable. Note what it did <em>not</em> report: the <code>| tail -30</code> without pipefail. A linter checks that the file is valid; it cannot know which of your steps is meant to gate. That judgement is yours.</p>

<div class="callout tip">
<p><strong>Interview question you will meet: "Here is our workflow — what would you change?"</strong> Do not start with style. Walk the five questions, then name one concrete risk with its fix: "The ESLint step pipes into <code>tail</code> with no <code>shell: bash</code>, so its exit code is lost — fine while it is informational, but if we ever make lint required, add <code>defaults: run: shell: bash</code>." Or: "There is no <code>permissions:</code> block, so the token has the repository default; I would set <code>contents: read</code>." One real finding with a reason beats ten generic tips.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Pick one workflow you did not write — this repository&#39;s <code>ci-lint.yml</code> or any file in a popular open-source project&#39;s <code>.github/workflows/</code> — and answer the five questions in a small table.</li>
<li>In your test repository, add a job with two steps: one plain <code>run: false | tail -1</code>, then the same step with <code>shell: bash</code>. Push and read the <code>shell:</code> line each step prints.</li>
<li>Add a job with <code>timeout-minutes: 1</code> and <code>run: sleep 120</code>. Push, wait, and find the annotation that names the timeout.</li>
<li>Run actionlint over your repository with the Docker command above and fix anything it reports.</li>
</ol>
<p><strong>Done when:</strong> your five-question table is filled for a real workflow; your run shows one ✓ and one ✗ for the identical pipe; the timeout job is <em>cancelled</em> with the "exceeded the maximum execution time" annotation; and actionlint exits with no output.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Trigger / event (sự kiện kích hoạt)</span><span class="v">What starts a run: <code>push</code>, <code>pull_request</code>, <code>schedule</code>, <code>workflow_dispatch</code>…, declared under <code>on:</code>.</span></div>
<div class="kv"><span class="k">Path filter (bộ lọc đường dẫn)</span><span class="v"><code>paths:</code> under an event: the run starts only if the change touches a matching file.</span></div>
<div class="kv"><span class="k"><code>timeout-minutes</code></span><span class="v">Longest a job may run before it is cancelled. Default 360 on hosted runners.</span></div>
<div class="kv"><span class="k"><code>continue-on-error</code></span><span class="v">Lets a step fail without failing the job — for informational checks.</span></div>
<div class="kv"><span class="k">pipefail</span><span class="v">Shell option that makes a pipe fail if any command in it fails. Only on with <code>shell: bash</code>.</span></div>
<div class="kv"><span class="k">Annotation (chú thích của run)</span><span class="v">Warnings and errors GitHub pins to a run summary — including timeouts and deprecations.</span></div>
<div class="kv"><span class="k">actionlint</span><span class="v">Static checker for workflow files, including shellcheck on <code>run:</code> scripts.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Read the trigger block first: <code>ci-lint.yml</code> filters paths on push but not on pull requests, so a README-only change runs CI only in a PR.</li>
<li>Always set <code>timeout-minutes</code>; when it fires the job is <em>cancelled</em> and the reason is in the annotation.</li>
<li>Without <code>shell:</code>, steps run <code>bash -e</code> with no pipefail — measured; <code>shell: bash</code> adds <code>-o pipefail</code>.</li>
<li>Know which steps gate and which only report; a missing secret turns into an empty string and a step can skip silently.</li>
<li>Yellow annotations announce the next breakage (here: Node 20 actions forced onto Node 24); actionlint catches syntax, not intent.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows — the full list, and which filters (<code>branches</code>, <code>paths</code>, <code>types</code>) each event supports. The asymmetry in this lesson is visible in that table.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — timeout-minutes</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idtimeout-minutes — including the 360-minute default that this lesson argues you should always override.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node</span><span class="lc-sub">github.com/actions/setup-node — what <code>cache: 'npm'</code> actually caches, and <code>cache-dependency-path</code> for a lockfile that is not at the repository root.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — pipefail, and the exit code a pipe throws away</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the measured version of the <code>| tail -30</code> pitfall, with a flag-by-flag table.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Đọc một workflow THẬT, từng dòng một</h2>
<p class="lead">Không phải một workflow mẫu trong sách — mà cái đã chạy 526 lần trong chính kho này. Đọc một tệp ĐANG PHỤC VỤ dạy được nhiều hơn đọc một tệp viết ra để cho người ta đọc.</p>

<h3>Khối kích hoạt</h3>
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
      - 'frontend/package.json'
      - 'tsconfig.json'
      - 'frontend/tsconfig.json'
      - '.eslintrc.json'
      - '.prettierrc'
  workflow_dispatch: {}   <span class="tok-comment"># cho phep bam chay tay — khong can push</span></code></pre>

<div class="callout warn">
<p><strong>Nhìn vào thứ mà <code>pull_request</code> KHÔNG có.</strong> Bộ kích hoạt <code>push</code> có bộ lọc <code>paths</code> — mười một mẫu, nên một commit chỉ đụng vào README hay một tệp workflow thì KHÔNG khởi động lần chạy nào. Bộ kích hoạt <code>pull_request</code> có <code>branches</code> và <strong>KHÔNG có <code>paths</code></strong>. Cũng cú sửa chỉ-README ấy vì thế <em>CÓ</em> khởi động một lần chạy khi nó tới dưới dạng pull request, và <em>KHÔNG</em> khi nó được push thẳng vào <code>main</code>.</p>
</div>

<p>Đó có phải một con bọ không? Chưa chắc — bạn hoàn toàn lập luận được rằng một PR thì luôn nên nhận một lượt kiểm đầy đủ bất kể nó đụng vào cái gì. Nhưng gần như chắc chắn đó KHÔNG phải một quyết định ai đó ra một cách có chủ đích, và nó đúng là loại bất đối xứng nằm trong một tệp suốt một năm mà chẳng ai nhận ra. Đọc kỹ khối kích hoạt là cách bạn biết được CI của mình THẬT SỰ làm gì, đối lại với thứ bạn GIẢ ĐỊNH là nó làm.</p>

<h3>Ba bộ kích hoạt, ba việc khác nhau</h3>
${slide('ga-00', 30, 'Khối on: của ci-lint.yml có một chỗ bất đối xứng')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">pull_request</span><span class="lz-lnote">trả lời "gộp vào có an toàn không?" — và nó chạy trên một <em>COMMIT GỘP</em>, không phải trên nhánh của bạn. Chương 1 đo vì sao phân biệt đó quan trọng</span></div>
<div class="lz-layer"><span class="lz-lname">push</span><span class="lz-lnote">trả lời "<code>main</code> còn khoẻ không?" — tấm lưới cho bất cứ thứ gì lọt vào mà không qua PR</span></div>
<div class="lz-layer"><span class="lz-lname">workflow_dispatch: {}</span><span class="lz-lnote">trả lời "người có bấm chạy được không?" Cái <code>{}</code> rỗng nghĩa là không có tham số. Lúc bài này được viết, MƯỜI trên mười một workflow của kho này chỉ chạy bằng dispatch; tới 09/2026 kho có mười bốn workflow và mười hai trong số đó vẫn vậy</span></div>
</div>

<h3>Đầu job</h3>
${slide('ga-00', 31, 'timeout-minutes: mặc định 360 phút — hãy tự đặt')}
<pre><code>jobs:
  backend-lint:
    name: Backend Type Check
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    defaults:
      run:
        working-directory: .</code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">backend-lint</span><span class="v">MÃ ĐỊNH DANH của job — thứ mà các job khác gọi tới trong <code>needs:</code>, và thứ xuất hiện trong API</span></div>
<div class="kv"><span class="k">name:</span><span class="v">cái nhãn cho NGƯỜI đọc trên giao diện. Khác mã định danh, một cách có chủ đích</span></div>
<div class="kv"><span class="k">ubuntu-24.04</span><span class="v">GHIM, không phải <code>-latest</code>. Tệp này chọn sự ổn định; <code>desktop-release.yml</code> trong cùng kho lại chọn <code>-latest</code></span></div>
<div class="kv"><span class="k">timeout-minutes: 10</span><span class="v">cái khoá ít được dùng nhất trong GitHub Actions. Mặc định là <strong>360</strong> — SÁU TIẾNG một job treo trước khi có thứ gì đó nhận ra</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — hạn giờ mặc định là SÁU TIẾNG.</strong> Một bước ngồi chờ đầu vào, thử lại vô hạn, hoặc tự kẹt sẽ nằm đó đốt thời gian runner cho tới khi <code>timeout-minutes</code> hoặc cái trần sáu tiếng chặn nó lại. Trên một kho riêng tư thì đó là phút tính tiền; trên bất kỳ kho nào thì đó là một job trông như "đang chạy" suốt một buổi chiều trong khi ai cũng cho rằng nó chỉ chậm thôi. Mười phút, như ở đây, là một PHÁT BIỂU: <em>nếu cái này lâu hơn mười phút thì có gì đó sai, và tôi MUỐN BIẾT.</em></p>
</div>

<h3>Các bước, và vì sao chúng theo thứ tự này</h3>
<pre><code>- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm'
- name: Install deps
  run: npm ci --no-audit --no-fund
- name: TypeScript type-check (required)
  run: npx tsc --noEmit</code></pre>

<p>Ba thứ đáng để ý trong bốn bước.</p>

<p><strong><code>node-version: '22'</code> ĐƯỢC ĐẶT TRONG NHÁY.</strong> Đó không phải trang trí — Chương 1 đo xem thiếu cặp nháy ấy thì chuyện gì xảy ra, và nó không phải thứ bạn nghĩ.</p>

<p><strong><code>cache: 'npm'</code> là MỘT dòng và nó đang làm việc thật.</strong> Nó khôi phục <code>~/.npm</code> từ một lần chạy trước, khoá theo mã băm của lockfile. Chương 5 đo nó tiết kiệm được bao nhiêu và cái ca duy nhất nó âm thầm chẳng tiết kiệm gì.</p>

<p><strong><code>--no-audit --no-fund</code>.</strong> Hai cái cờ tắt đi những thứ chẳng ai đọc trong CI: output kiểm lỗ hổng và dòng xin tài trợ. Nhỏ thôi, nhưng bước này chạy ở MỌI lần push.</p>

<h3>Cái bước được PHÉP hỏng một cách có chủ đích</h3>
${slide('ga-00', 32, 'Không khai shell: thì không có pipefail — lỗi giữa ống bị nuốt')}
<pre><code>- name: ESLint (informational)
  continue-on-error: true
  run: npm run lint 2>&amp;1 | tail -30 || echo "(lint warnings — pre-existing)"</code></pre>

<p>BA tấm lưới riêng biệt trên một dòng, tức là nhiều hơn cần thiết một tấm, và đáng hiểu:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">continue-on-error: true</span><span class="lz-t">mức JOB</span><span class="lz-d">bước được phép hỏng; job đi tiếp và vẫn xanh</span></div>
<div class="lz-step"><span class="lz-k">|| echo "…"</span><span class="lz-t">mức SHELL</span><span class="lz-d">cái ống ngay từ đầu đã không bao giờ trả về khác không</span></div>
<div class="lz-step"><span class="lz-k">| tail -30</span><span class="lz-t">mức OUTPUT</span><span class="lz-d">giữ cho nhật ký đọc được — nhưng xem cái bẫy</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>| tail -30</code> ÂM THẦM vứt mất mã thoát.</strong> Trong một cái ống, shell báo trạng thái của lệnh CUỐI CÙNG, mà <code>tail</code> thì gần như luôn thành công. Nên <code>npm run lint | tail -30</code> thoát 0 bất kể lint có đạt hay không, và cái <code>|| echo</code> phía sau chẳng bao giờ nổ được. Ở ĐÂY thì vô hại — bước này chỉ để thông tin và <code>continue-on-error</code> vốn đã nói thế. Trong một bước ĐỊNH LÀM CHỐT CỬA thì cùng hình dạng đó nghĩa là cái chốt KHÔNG TỒN TẠI. Khoá Deploy VPS đã đo đúng hành vi này: thiếu <code>set -o pipefail</code>, một lệnh hỏng trong ống là VÔ HÌNH.</p>
</div>

<h3>Cái bước được thiết kế để BỎ QUA</h3>
${slide('ga-00', 33, 'Bước cố ý bỏ qua: secret vắng thành chuỗi rỗng')}
<pre><code>- name: CV critique fabrication test (skips without an AI key)
  env:
    ANTHROPIC_API_KEY: &#36;{{ secrets.ANTHROPIC_API_KEY }}
    LLM_BASE_URL: &#36;{{ secrets.LLM_BASE_URL }}
  run: npm run eval:cv-fabrication</code></pre>

<p>Ghi chú của kho nói rõ rằng cái bí mật đó đã bị gỡ <em>CÓ CHỦ ĐÍCH</em>: tài khoản hết tiền, nên một cái khoá chỉ đổi bản dựng đỏ này lấy bản dựng đỏ khác. Với bí mật vắng mặt, GitHub thế vào một chuỗi RỖNG, script phát hiện không có khoá, và thoát 0 — bước báo thành công và chẳng làm gì.</p>

<div class="callout warn">
<p><strong>Đó là một lựa chọn CÓ CHỦ ĐÍCH kèm cái giá được PHÁT BIỂU RA, và đó là cách làm đúng.</strong> Ghi chú ghi lại thứ KHÔNG CÒN được kiểm nữa: chẳng còn gì canh chừng việc AI bịa ra chỉ số trong các bài phê CV. Một bước bị bỏ qua mà AI CŨNG BIẾT (mọi người đều biết) là bị bỏ qua thì là một rủi ro ĐƯỢC QUẢN LÝ. Một bước bị bỏ qua mà chẳng ai nhận ra thì là cơn ác mộng lặp đi lặp lại của Chương 10 — một phép kiểm ĐẠT vì nó không chạy.</p>
</div>

<h3>Cả tệp đó tốn bao nhiêu</h3>
<div class="out">ci-lint.yml, 10 lan chay gan nhat (giay):
  135, 155, 140, 160, 144, 144, 100, 144, 141, 145
  → TB ~141s, min 100s, max 160s

Hai job chay SONG SONG: backend-lint (node 22) + frontend-lint (node 20)</div>

<p>Khoảng hai phút hai mươi giây, hai job một lượt, ở mỗi commit đụng vào mã nguồn, 526 lần tính tới giờ. Chương 7 nói về việc con số ấy có hạ xuống được không và có NÊN không.</p>

<h3>Đo thật: shell nào GitHub chọn khi bạn không nói</h3>
<p>Cái bẫy ở trên nói một cái ống giấu mã thoát "khi không có <code>set -o pipefail</code>". Câu hỏi tự nhiên tiếp theo: GitHub có tự bật nó cho bạn không? Câu trả lời phụ thuộc vào đúng một dòng mà có lẽ bạn chưa bao giờ viết. Khoá chạy cùng một câu lệnh ở hai job của một lần chạy — <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986054351" target="_blank" rel="noopener">35986054351</a> — một lần KHÔNG có <code>shell:</code>, một lần có <code>shell: bash</code>:</p>
<pre><code class="language-yaml">  mac-dinh:
    steps:
      - run: |
          false | tail -1
          echo "van chay toi day — buoc XANH"
  khai-bash:
    steps:
      - shell: bash
        run: |
          false | tail -1
          echo "khong bao gio in dong nay"</code></pre>
<div class="out">mac-dinh  | shell: /usr/bin/bash -e {0}
mac-dinh  | van chay toi day — buoc XANH                        → job ✓
khai-bash | shell: /usr/bin/bash --noprofile --norc -e -o pipefail {0}
khai-bash | ##[error]Process completed with exit code 1.       → job ✗</div>
<p>Runner in ra CHÍNH XÁC câu lệnh nó dùng cho mỗi bước <code>run:</code> — dòng <code>shell:</code> trong nhật ký — và hai dòng đó khác nhau: <strong>không khai</strong> nghĩa là <code>bash -e</code>, dừng ở một lệnh hỏng nhưng KHÔNG dừng ở một lệnh hỏng nằm giữa ống; <strong><code>shell: bash</code></strong> thêm <code>-o pipefail</code>. Trên Windows, mặc định khi không khai là PowerShell, còn <code>shell: bash</code> dùng Git Bash với cùng các cờ — lần chạy ba hệ điều hành <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35987300829" target="_blank" rel="noopener">35987300829</a> in ra <code>C:\\Program Files\\Git\\bin\\bash.EXE --noprofile --norc -e -o pipefail {0}</code>.</p>
<table>
<thead><tr><th>Bạn viết</th><th>Linux / macOS chạy</th><th>Lệnh hỏng giữa ống</th></tr></thead>
<tbody>
<tr><td>không viết gì</td><td><code>bash -e {0}</code></td><td>bị nuốt nếu lệnh cuối thành công</td></tr>
<tr><td><code>shell: bash</code></td><td><code>bash --noprofile --norc -eo pipefail {0}</code></td><td>làm bước hỏng</td></tr>
<tr><td><code>shell: sh</code></td><td><code>sh -e {0}</code></td><td>bị nuốt</td></tr>
<tr><td><code>defaults: run: shell: bash</code> ở đầu tệp</td><td>dòng <code>shell: bash</code> cho MỌI bước</td><td>làm bước hỏng</td></tr>
</tbody>
</table>
<p>Vậy bước ESLint của kho này — <code>npm run lint 2&gt;&amp;1 | tail -30</code>, không có <code>shell:</code> — thật sự vứt mã thoát của lint đi, và không chỉ vì <code>tail</code>. Bước chỉ để thông tin thì sống chung được với điều đó. Với một bước chặn cửa, một dòng <code>defaults:</code> sửa được cho cả tệp.</p>

<h3>Đo thật: timeout-minutes trông ra sao khi nó nổ</h3>
<p>Mười phút là giá trị đúng cho tệp này, nhưng bạn không thể ngồi chờ mười phút để thấy nó làm việc, nên sân tập dùng một phút cho một bước ngủ năm phút (lần chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986054362" target="_blank" rel="noopener">35986054362</a>):</p>
<div class="out">bat dau luc 10:14:23
##[error]The operation was canceled.
Cleaning up orphan processes
Terminate orphan process: pid (1903) (sleep)

Annotation: The job has exceeded the maximum execution time of 1m0s
Conclusion: cancelled   (buoc 10:14:23 → 10:15:35)</div>
<p>Hai chi tiết đáng nhớ. Kết luận là <strong>cancelled</strong> (bị huỷ), KHÔNG phải <strong>failure</strong> (thất bại) — một điều kiện như <code>if: failure()</code> ở job sau sẽ KHÔNG nổ cho nó (Chương 3 nói đúng chuyện này). Và lý do chỉ nằm ở <em>annotation</em> (chú thích của run), không nằm trong nhật ký bước — nhật ký chỉ nói "canceled". Chỉ đọc nhật ký thì bạn sẽ tưởng có ai đó bấm nút huỷ.</p>

<h3>Đọc bất kỳ workflow nào bằng năm câu hỏi</h3>
<p>Bạn sẽ được giao những workflow bạn không viết — ở chỗ làm mới, ở một dự án mã nguồn mở, trong buổi phỏng vấn. Đọc từng dòng thì được, nhưng năm câu hỏi theo thứ tự này đưa bạn tới những dòng QUAN TRỌNG trước:</p>
<table>
<thead><tr><th>Câu hỏi</th><th>Nhìn vào đâu</th><th>Trả lời cho ci-lint.yml</th></tr></thead>
<tbody>
<tr><td>1. Chạy KHI NÀO?</td><td><code>on:</code> — sự kiện, nhánh, đường dẫn</td><td>PR vào main (luôn luôn), push vào main (chỉ đường dẫn mã nguồn), bấm tay</td></tr>
<tr><td>2. Chạy TRÊN GÌ?</td><td><code>runs-on:</code>, <code>container:</code>, matrix</td><td>hai job, đều <code>ubuntu-24.04</code>, có ghim</td></tr>
<tr><td>3. Tối đa BAO LÂU?</td><td><code>timeout-minutes:</code></td><td>10 phút mỗi job (mặc định sẽ là 360)</td></tr>
<tr><td>4. Xanh NGHĨA LÀ GÌ?</td><td>các bước không có <code>continue-on-error</code> / logic bỏ qua</td><td>tsc + hai bộ eval + unit test; lint chỉ là báo cáo; test bịa số liệu bỏ qua khi không có khoá</td></tr>
<tr><td>5. Nó ĐỤNG được gì?</td><td><code>permissions:</code>, <code>secrets.*</code>, bước deploy</td><td>đọc hai secret (đang vắng), không deploy, quyền token mặc định</td></tr>
</tbody>
</table>
<p>Câu 5 là câu người mới bỏ qua và người review hỏi. Một workflow deploy, phát hành gói hay ghi vào kho cần đọc CHẬM hơn nhiều so với một workflow chỉ kiểm kiểu — Chương 6 nói về khác biệt đó.</p>

<h3>Một annotation vàng bạn sẽ gặp vào 09/2026</h3>
${slide('ga-00', 34, 'Annotation vàng 09/2026: checkout@v4 bị ép chạy Node 24')}
<p>Mọi lần chạy trên sân tập có dùng <code>actions/checkout@v4</code> — đúng phiên bản <code>ci-lint.yml</code> của kho này đang ghim — đều kết thúc bằng một annotation vàng: <em>"Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4."</em> Lần chạy vẫn xanh. Action vẫn là v4. Thứ thay đổi là môi trường chạy bên dưới nó: action viết bằng JavaScript tự khai bản Node nó cần (<code>runs: using: node20</code>), và GitHub đã chuyển runner sang Node 24. Bản checkout mới nhất lúc viết bài là <code>v7.0.1</code> (07/2026) và khai <code>node24</code>.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — coi màu vàng là tiếng ồn.</strong> Annotation là chỗ GitHub báo trước thứ SẮP hỏng. "Deprecated" (lỗi thời) hôm nay là "removed" (gỡ bỏ) vào một ngày ghi trong changelog. Phản ứng đúng KHÔNG phải là hoảng lên đổi mọi <code>@v4</code> thành <code>@v7</code> — phiên bản lớn có thể đổi tham số và mặc định — mà là đọc ghi chú phát hành của từng action bạn dùng rồi nâng có cân nhắc. Chương 4 dạy cách làm, kể cả vì sao ghim theo SHA đầy đủ của commit an toàn hơn mọi thẻ.</div>

<h3>Kiểm workflow TRƯỚC khi push: actionlint</h3>
<p>Lỗi YAML trong workflow chỉ lộ ra SAU khi push — trừ khi bạn lint nó. <code>actionlint</code> kiểm cú pháp workflow, biểu thức, và cả các script shell trong <code>run:</code> (qua shellcheck). Chạy bằng Docker thì không cần cài gì:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/repo:ro -w /repo rhysd/actionlint:latest</code></pre>
<div class="out">.github/workflows/ch00-ba-may.yml:17:9: shellcheck reported issue in this script: SC2086:info:3:60: Double quote to prevent globbing and word splitting [shellcheck]</div>
<p>Đó là actionlint 1.7.12 trên máy Mac của khoá, chạy trên một bản chép <code>ci-lint.yml</code> của kho này cộng các workflow của sân tập: <code>ci-lint.yml</code> sạch; một tệp của sân tập có một biến quên đặt trong nháy kép. Để ý thứ nó KHÔNG báo: cái <code>| tail -30</code> không có pipefail. Một bộ lint kiểm tệp có HỢP LỆ không; nó không thể biết bước nào của bạn có nhiệm vụ chặn cửa. Phán đoán đó là của bạn.</p>

<div class="callout tip">
<p><strong>Câu hỏi phỏng vấn hay gặp: "Đây là workflow của bọn anh — em sẽ đổi gì?"</strong> Đừng mở đầu bằng chuyện thẩm mỹ. Đi qua năm câu hỏi, rồi chỉ ra MỘT rủi ro cụ thể kèm cách sửa: "Bước ESLint đổ vào <code>tail</code> mà không có <code>shell: bash</code>, nên mã thoát bị mất — không sao khi nó chỉ để thông tin, nhưng nếu có ngày bắt buộc lint thì thêm <code>defaults: run: shell: bash</code>." Hoặc: "Không có khối <code>permissions:</code>, nên token mang quyền mặc định của kho; em sẽ đặt <code>contents: read</code>." Một phát hiện THẬT có lý do đáng giá hơn mười lời khuyên chung chung.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một workflow bạn KHÔNG viết — <code>ci-lint.yml</code> của kho này hoặc một tệp bất kỳ trong <code>.github/workflows/</code> của một dự án mã nguồn mở nổi tiếng — và trả lời năm câu hỏi trong một bảng nhỏ.</li>
<li>Trong kho thử của bạn, thêm một job có hai bước: một bước <code>run: false | tail -1</code> trơn, rồi đúng bước đó có thêm <code>shell: bash</code>. Push và đọc dòng <code>shell:</code> mỗi bước in ra.</li>
<li>Thêm một job có <code>timeout-minutes: 1</code> và <code>run: sleep 120</code>. Push, chờ, rồi tìm annotation nêu tên cú hết giờ.</li>
<li>Chạy actionlint trên kho của bạn bằng lệnh Docker ở trên và sửa mọi thứ nó báo.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng năm câu hỏi được điền cho một workflow thật; lần chạy của bạn có một ✓ và một ✗ cho CÙNG một cái ống; job hết giờ có kết luận <em>cancelled</em> kèm annotation "exceeded the maximum execution time"; và actionlint thoát mà không in gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Trigger / event (sự kiện kích hoạt)</span><span class="v">Thứ khởi động một lần chạy: <code>push</code>, <code>pull_request</code>, <code>schedule</code>, <code>workflow_dispatch</code>…, khai dưới <code>on:</code>.</span></div>
<div class="kv"><span class="k">Path filter (bộ lọc đường dẫn)</span><span class="v"><code>paths:</code> dưới một sự kiện: lần chạy chỉ bắt đầu nếu thay đổi đụng vào một tệp khớp mẫu.</span></div>
<div class="kv"><span class="k"><code>timeout-minutes</code></span><span class="v">Thời gian tối đa một job được chạy trước khi bị huỷ. Mặc định 360 trên runner GitHub cấp.</span></div>
<div class="kv"><span class="k"><code>continue-on-error</code></span><span class="v">Cho một bước hỏng mà không làm job hỏng — dành cho phép kiểm chỉ để thông tin.</span></div>
<div class="kv"><span class="k">pipefail</span><span class="v">Tuỳ chọn shell làm cả ống hỏng nếu BẤT KỲ lệnh nào trong ống hỏng. Chỉ bật khi có <code>shell: bash</code>.</span></div>
<div class="kv"><span class="k">Annotation (chú thích của run)</span><span class="v">Cảnh báo và lỗi GitHub ghim lên trang tóm tắt lần chạy — kể cả hết giờ và lỗi thời.</span></div>
<div class="kv"><span class="k">actionlint</span><span class="v">Bộ kiểm tĩnh cho tệp workflow, gồm cả shellcheck cho script trong <code>run:</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc khối kích hoạt trước tiên: <code>ci-lint.yml</code> lọc đường dẫn khi push nhưng không lọc khi PR, nên sửa riêng README chỉ chạy CI trong PR.</li>
<li>Luôn đặt <code>timeout-minutes</code>; khi nó nổ, job bị <em>cancelled</em> và lý do nằm trong annotation.</li>
<li>Không khai <code>shell:</code> thì bước chạy <code>bash -e</code>, không pipefail — đã đo; <code>shell: bash</code> thêm <code>-o pipefail</code>.</li>
<li>Biết bước nào chặn cửa, bước nào chỉ báo cáo; secret vắng thành chuỗi rỗng và một bước có thể âm thầm bỏ qua.</li>
<li>Annotation vàng báo trước cú hỏng kế tiếp (ở đây: action Node 20 bị ép chạy Node 24); actionlint bắt lỗi cú pháp, không bắt được ý đồ.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/events-that-trigger-workflows — danh sách đầy đủ, và mỗi sự kiện hỗ trợ bộ lọc nào (<code>branches</code>, <code>paths</code>, <code>types</code>). Sự bất đối xứng trong bài này nhìn thấy được ngay trong cái bảng đó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — timeout-minutes</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idtimeout-minutes — kể cả giá trị mặc định 360 phút mà bài này lập luận là bạn nên LUÔN ghi đè.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/setup-node</span><span class="lc-sub">github.com/actions/setup-node — <code>cache: 'npm'</code> THẬT RA đệm cái gì, và <code>cache-dependency-path</code> cho một lockfile không nằm ở gốc kho.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — pipefail, và mã thoát mà một cái ống vứt đi</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — bản ĐO ĐƯỢC của cái bẫy <code>| tail -30</code>, kèm bảng từng cờ một.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — What this course measures, and in what order|||0.4 — Khoá này ĐO cái gì, và theo thứ tự nào',
      slug: 'ga-0-4-ban-do',
      type: 'VIDEO',
      description: 'Bản đồ mười một chương, và lời hứa về phương pháp: mọi con số trong khoá này lấy từ 2.343 lần chạy THẬT của kho này hoặc từ một phép đo chạy được trong hộp cát — không có con số nào chép từ tài liệu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>What this course measures, and in what order</h2>
<p class="lead">Fifteen chapters (eleven when the course first shipped), each answering one question about the machine. Every number comes from somewhere you can check.</p>

<div class="callout ok">
<p><strong>The method, stated up front.</strong> Every figure in this course comes from one of two places: <strong>(a)</strong> the 2,343 real runs of this repository&#39;s 11 workflows, read back through GitHub&#39;s API — job timings, step timings, exit codes, failure messages; or <strong>(b)</strong> a measurement run in a sandbox, with the commands shown. Where a measurement surprised me I re-ran it, and where it came back null I say so and explain what the measurement could not see. Nothing here is quoted from documentation as though it were an observation.</p>
</div>

<h3>The fifteen chapters</h3>
<p>The course began with eleven chapters; in 09/2026 Chapter 11 became a mid-course review and Chapters 12–15 were added to take you from "can write and fix a workflow" to the level a team lead expects. The order is the order the questions arise in practice.</p>
${slide('ga-00', 35, 'Map of 15 chapters: each answers one question about the machine')}
${slide('ga-00', 12, 'Sixteen stops, from the first lesson to a real project')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — The workflow file</span><span class="lz-lnote">YAML, and the traps that come from it being YAML: the <code>on</code> key that parses as a boolean, and the version number that becomes a float. Triggers, <code>schedule</code> and how late it really runs, the <code>pull_request</code> merge commit that is not your branch, and path filters</span></div>
<div class="lz-layer"><span class="lz-lname">2 — Jobs and the runner</span><span class="lz-lnote">A job is a whole fresh machine; <code>needs:</code> and the build that finished 5 min 12 s early; one command on three platforms; steps and exit codes; <code>matrix</code> and <code>fail-fast</code></span></div>
<div class="lz-layer"><span class="lz-lname">3 — Expressions and contexts</span><span class="lz-lnote">WHEN <code>&#36;{{ }}</code> is evaluated, which is the answer to most "why did my <code>if</code> not work" questions. Contexts, type coercion, <code>hashFiles()</code>, and conditions that never fire</span></div>
<div class="lz-layer"><span class="lz-lname">4 — Actions</span><span class="lz-lnote">What <code>uses:</code> does — it runs somebody else&#39;s code inside your job. <code>@v4</code> is a pointer, not a version; checkout, the <code>setup-*</code> actions, and writing your own</span></div>
<div class="lz-layer"><span class="lz-lname">5 — Caching and artifacts</span><span class="lz-lnote">Two things that look similar and are not. Cache keys, <code>restore-keys</code>, a dead cache diagnosed, artifacts, limits and the break-even point</span></div>
<div class="lz-layer"><span class="lz-lname">6 — Secrets, permissions and the token</span><span class="lz-lnote">How masking works and exactly how it fails. <code>GITHUB_TOKEN</code>, OIDC instead of stored keys, the whole attack surface on one page</span></div>
<div class="lz-layer"><span class="lz-lname">7 — Speed, concurrency and cost</span><span class="lz-lnote">The critical path, <code>concurrency</code> groups, variance between identical runs, every speed-up ranked, and what CI is worth</span></div>
<div class="lz-layer"><span class="lz-lname">8 — When CI is red</span><span class="lz-lnote">Exit codes measured, flaky or really broken decided by arithmetic, reproducing a failure, and reading a run in triage order</span></div>
<div class="lz-layer"><span class="lz-lname">9 — Deploying from CI</span><span class="lz-lnote">And why this repository <em>stopped</em> — two real outages caused by push-triggered deploys racing each other; where each step should run, rollback, environments, notifications</span></div>
<div class="lz-layer"><span class="lz-lname">10 — Diagnosing by real cases</span><span class="lz-lnote">Five real incidents of this repository: a stale build, a seed that broke on production, a checker that could not fail, killing by port, a half-applied migration</span></div>
<div class="lz-layer"><span class="lz-lname">11 — Mid-course review</span><span class="lz-lnote">Everything from Chapters 1–10 pulled together, with a ten-question check</span></div>
<div class="lz-layer"><span class="lz-lname">12 — Reuse at team scale</span><span class="lz-lnote">Reusable workflows, composite and custom actions, templates for an organisation</span></div>
<div class="lz-layer"><span class="lz-lname">13 — Your own runners</span><span class="lz-lnote">Self-hosted runners in a container, their security, and scaling them</span></div>
<div class="lz-layer"><span class="lz-lname">14 — Quality gates, supply chain and releases</span><span class="lz-lnote">Required checks, <code>pull_request_target</code>, Dependabot and CodeQL, automated releases, monorepos</span></div>
<div class="lz-layer"><span class="lz-lname">15 — Capstone</span><span class="lz-lnote">A complete CI/CD pipeline built from zero, and the twenty-question final exam</span></div>
</div>

<h3>What this course is not</h3>
<div class="kv-grid">
<div class="kv"><span class="k">not a list of actions</span><span class="v">the marketplace has thousands and they change. Chapter 4 teaches how to read one instead</span></div>
<div class="kv"><span class="k">not a YAML tutorial</span><span class="v">except for the parts that bite, which Chapter 1 measures</span></div>
<div class="kv"><span class="k">not about GitLab CI or Jenkins</span><span class="v">though the boundaries in 0.2 transfer almost unchanged</span></div>
<div class="kv"><span class="k">not a substitute for the docs</span><span class="v">every lesson links the normative page. This course is about what the docs do not tell you: what it costs and how it fails</span></div>
</div>

<h3>Where it sits next to the other courses</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Git &amp; GitHub</span><span class="lz-t">before this</span><span class="lz-d">commits, branches, pull requests. This course assumes all three</span></div>
<div class="lz-step"><span class="lz-k">Linux &amp; Bash</span><span class="lz-t">alongside</span><span class="lz-d">every <code>run:</code> step is a shell script, and Chapter 3 of that course is the reason yours does not fail silently</span></div>
<div class="lz-step"><span class="lz-k">Deploy VPS</span><span class="lz-t">after, or alongside</span><span class="lz-d">this course builds the artifact; that one moves it, swaps it, and rolls it back</span></div>
<div class="lz-step"><span class="lz-k">Docker</span><span class="lz-t">optional</span><span class="lz-d">Chapter 9 deploys images and Chapter 14 publishes one to GHCR; that course explains what an image is</span></div>
</div>

${slide('ga-00', 36, 'What transfers to your project is the relationship, not the number')}

<div class="pitfall">
<p><strong>Trap — the numbers in this course are from one repository, and yours will differ.</strong> A Node monorepo on GitHub-hosted runners is a specific shape. Your <code>npm ci</code> will not take 38 seconds; your macOS build will not take 315. What transfers is not the figures but the <em>relationships</em>: that Windows is consistently slower at filesystem-heavy work, that the critical path is one job and not the sum, that a cache hit and a cache miss differ by a factor you should know for your own project. Every chapter shows the command, so you can produce your own numbers.</p>
</div>

<div class="callout ok">
<p><strong>The one thing to carry through all fifteen chapters.</strong> A green run means: <em>every command you listed exited zero, on a clean machine, in an environment you specified.</em> It does not mean the code is correct, the deploy will work, or the thing you forgot to check is fine. Most of what goes wrong with CI is a gap between what people think green means and what it actually means — and every chapter here closes one of those gaps with a measurement.</p>
</div>

<h3>Where the numbers come from — and how to produce your own</h3>
<p>"Every number comes from somewhere you can check" is only a promise if you can check it. Two places, both open to you:</p>
<ol>
<li><strong>This repository&#39;s own history.</strong> The course read back thousands of runs of <code>api-backend</code> through the REST API — the run and step timings in lessons 0.1–0.3 come from there. The repository is public, so the same calls work for you.</li>
<li><strong>The sandbox, <code>github.com/cuonghoang1103/ga-san-tap</code>.</strong> A public repository created for this course. Every chapter works on its own branch (<code>ch00-mo-dau</code> for this section) with workflows named <code>chNN-*.yml</code> that only trigger on that branch, so the runs of one chapter never disturb another. Every run linked in a lesson — red ones included — is there to open.</li>
</ol>
<p>The single call behind most tables in this course returns every job of a run with timestamps for each step:</p>
<pre><code class="language-bash">gh api repos/cuonghoang1103/ga-san-tap/actions/runs/35987300829/jobs \\
  --jq '.jobs[] | "\\(.name): \\((.completed_at|fromdateiso8601) - (.started_at|fromdateiso8601)) giay"'</code></pre>
<div class="out">do (windows-2025): 24 giay
do (macos-15): 7 giay
do (ubuntu-24.04): 7 giay</div>
<p>And one level deeper, per step, for the Windows job of the same run:</p>
<div class="out">1  Set up job                                  10:27:19 → 10:27:19
2  May nay co gi                               10:27:19 → 10:27:27
3  Cai mot goi that (do thoi gian)             10:27:27 → 10:27:38
4  Tran heap mac dinh cua Node tren may nay    10:27:38 → 10:27:40
5  Complete job                                10:27:40 → 10:27:40</div>
<p>(<code>gh</code> 2.93.0 on the course Mac, 24/09/2026.) Replace the owner, repository and run ID with your own and you have the raw material for every "where did the time go" question in Chapter 7. The API reports whole seconds, which is why tiny jobs can show <code>0</code> for a step that plainly did something.</p>

<h3>Before Chapter 1: set up your tools once</h3>
<table>
<thead><tr><th>You need</th><th>How</th><th>Check it worked</th></tr></thead>
<tbody>
<tr><td>A GitHub account and one <strong>public</strong> test repository</td><td>github.com → New repository</td><td>you can push to it</td></tr>
<tr><td>Git</td><td>the Git course on this site, Chapter 0</td><td><code>git --version</code></td></tr>
<tr><td>GitHub CLI (<code>gh</code>)</td><td>macOS <code>brew install gh</code> · Windows <code>winget install --id GitHub.cli</code> · Linux: your package manager (see cli.github.com)</td><td><code>gh --version</code>, then <code>gh auth login</code> and <code>gh auth status</code></td></tr>
<tr><td>An editor that understands workflows</td><td>VS Code + the official "GitHub Actions" extension</td><td>it autocompletes keys under <code>on:</code></td></tr>
<tr><td>Optional: Docker</td><td>the Docker course, Section 0</td><td>lets you run <code>actionlint</code> without installing it</td></tr>
</tbody>
</table>
<div class="callout ok">
<p><strong>Why a public test repository?</strong> Standard GitHub-hosted runners are free and unlimited for public repositories; private repositories spend a monthly allowance (2,000 minutes on GitHub Free, 3,000 on Pro, per the billing docs checked 09/2026) and get smaller Linux and Windows runners (2 CPU / 8 GB instead of 4 CPU / 16 GB). For learning, public is both cheaper and closer to the numbers in this course. Never put a real secret in it — Chapter 6 explains why even a "hidden" secret can leak into a public log.</p>
</div>

<h3>What you can honestly say in an interview after each part</h3>
<p>"I know GitHub Actions" means nothing to an interviewer. A sentence you can back with a run link means a lot. Here is what each stage of the course lets you say truthfully:</p>
<table>
<thead><tr><th>After</th><th>You can say</th><th>Proof you can show</th></tr></thead>
<tbody>
<tr><td>Section 0</td><td>"I can explain CI vs CD and read a failed run to its first error line."</td><td>your red → green pair from lesson 0.1</td></tr>
<tr><td>Chapters 1–4</td><td>"I write workflows with the right triggers, jobs, conditions and pinned actions."</td><td>a workflow with a PR trigger, <code>needs:</code>, an <code>if:</code></td></tr>
<tr><td>Chapters 5–7</td><td>"I make pipelines fast and safe: caching, least-privilege tokens, concurrency."</td><td>before/after timings; a <code>permissions:</code> block</td></tr>
<tr><td>Chapters 8–10</td><td>"I diagnose red and flaky runs and I know why push-to-deploy is risky."</td><td>a short write-up of one incident, with run IDs</td></tr>
<tr><td>Chapters 12–15</td><td>"I built a complete CI/CD pipeline from zero, with reusable workflows, quality gates and automated releases."</td><td>the capstone repository and its Actions tab</td></tr>
</tbody>
</table>

<h3>How to study this course without giving up</h3>
<p>The honest failure mode for a course like this is not difficulty — it is reading it. You can read every chapter, nod, and still freeze in front of an empty <code>.github/workflows/</code> folder. What prevents that is small and boring:</p>
<ul>
<li><strong>One repository, every exercise.</strong> Do every 🧪 practice in the same test repository. By Chapter 5 its Actions tab is a log of your own progress, red runs included.</li>
<li><strong>One chapter a week, plus its practice.</strong> The quiz at the end of each chapter is ten situations, not definitions; if you cannot answer one, the explanation tells you which lesson to reread.</li>
<li><strong>Read red runs before fixing them.</strong> Write down the job, the step and the first error line before you change anything (lesson "Start here 2/2" shows the order). It feels slow for a week and then becomes the fastest thing you do.</li>
<li><strong>Keep a "what green means" note per project.</strong> One line: which commands, which machine. It is the answer to half the interview questions in this course.</li>
</ul>
${slide('ga-00', 37, 'Common mistakes in Section 0')}

<div class="callout tip">
<p><strong>Interview question you will meet: "Tell me about a CI/CD pipeline you built."</strong> Interviewers are listening for four things: a trigger you chose on purpose, jobs split for a reason, a failure you diagnosed, and what "green" guaranteed. Structure it: <em>context</em> (what the project was), <em>pipeline</em> (events → jobs → key steps), <em>one incident</em> (a red run, how you read it, what the root cause was), <em>result</em> (time saved, a bug caught before release). The capstone in Chapter 15 is designed to give you exactly this story with real run links you can show.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Install and sign in to the GitHub CLI: <code>gh --version</code>, <code>gh auth login</code>, <code>gh auth status</code>.</li>
<li>List the latest runs of the course sandbox: <code>gh run list -R cuonghoang1103/ga-san-tap -b ch00-mo-dau -L 10</code>. Find one red and one green run.</li>
<li>Run the <code>gh api …/jobs --jq …</code> command above on one of those runs and note the slowest job.</li>
<li>Do the same on a run from your own test repository (from lesson 0.1 or 0.2), and write your own one-line "what green means" note for that repository.</li>
</ol>
<p><strong>Done when:</strong> <code>gh auth status</code> shows you logged in; you have the job durations of one sandbox run and one of your own runs in seconds; and your note names the commands and the runner your green was measured on.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">GitHub CLI — <code>gh</code></span><span class="v">GitHub&#39;s command-line tool; <code>gh run list/view</code> reads runs, <code>gh api</code> calls the REST API.</span></div>
<div class="kv"><span class="k">REST API</span><span class="v">GitHub&#39;s web interface for programs; <code>/actions/runs/{id}/jobs</code> returns jobs and step timestamps.</span></div>
<div class="kv"><span class="k">jq</span><span class="v">A small language for filtering JSON; <code>gh api --jq</code> uses it without installing anything.</span></div>
<div class="kv"><span class="k">Sandbox (sân tập)</span><span class="v">The public repository <code>ga-san-tap</code> where this course runs every new measurement, one branch per chapter.</span></div>
<div class="kv"><span class="k">Critical path (đường tới hạn)</span><span class="v">The chain of jobs that decides how long a run takes; speeding up anything else changes nothing.</span></div>
<div class="kv"><span class="k">Included minutes (phút miễn phí)</span><span class="v">The monthly allowance of runner minutes for private repositories; public repositories do not spend it on standard runners.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The course has fifteen chapters: 1–10 teach and measure, 11 reviews, 12–15 take you to team-lead level and a capstone with a twenty-question exam.</li>
<li>Every number comes from this repository&#39;s real runs or from the public sandbox <code>ga-san-tap</code>; each lesson links the run.</li>
<li><code>gh api …/actions/runs/{id}/jobs</code> gives per-job and per-step timings — you can produce the same tables for your own project.</li>
<li>Learn with one public test repository, one chapter a week, and a written note of what your green means.</li>
<li>What transfers to your project are the relationships (Windows slower on file-heavy work, one critical path, cache factor), not the figures.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — GitHub Actions documentation</span><span class="lc-sub">docs.github.com/en/actions — the root of the official documentation; every chapter links the specific page rather than repeating it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — Actions</span><span class="lc-sub">docs.github.com/en/rest/actions — how the run and job timings in this course were read. <code>GET /repos/{o}/{r}/actions/runs/{id}/jobs</code> returns per-step timestamps, which is where every table here comes from.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Usage limits, billing, and administration</span><span class="lc-sub">docs.github.com/en/actions/administering-github-actions/usage-limits-billing-and-administration — the concurrency ceilings and the per-minute prices that Chapter 7 works from.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — what a deploy actually is</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the four-step model this course hands its artifact to.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Khoá này ĐO cái gì, và theo thứ tự nào</h2>
<p class="lead">Mười lăm chương (lúc khoá mới ra là mười một), mỗi chương trả lời một câu hỏi về cỗ máy. Mọi con số đều tới từ một chỗ bạn kiểm chứng được.</p>

<div class="callout ok">
<p><strong>Phương pháp, nói thẳng từ đầu.</strong> Mọi con số trong khoá này tới từ một trong hai chỗ: <strong>(a)</strong> 2.343 lần chạy THẬT của 11 workflow trong kho này, đọc ngược về qua API của GitHub — thời lượng job, thời lượng từng bước, mã thoát, dòng báo lỗi; hoặc <strong>(b)</strong> một phép đo chạy trong hộp cát, có kèm câu lệnh. Chỗ nào phép đo làm tôi bất ngờ thì tôi đo lại, và chỗ nào nó trả về RỖNG thì tôi nói ra kèm lý do phép đo không nhìn thấy được. KHÔNG có gì ở đây được trích từ tài liệu rồi trình bày như thể đó là một quan sát.</p>
</div>

<h3>Mười lăm chương</h3>
<p>Khoá khởi đầu với mười một chương; tới 09/2026 Chương 11 trở thành bài ôn giữa khoá và Chương 12–15 được thêm vào để đưa bạn từ mức "viết và sửa được một workflow" lên mức một trưởng nhóm kỳ vọng. Thứ tự các chương là thứ tự các câu hỏi nảy ra ngoài thực tế.</p>
${slide('ga-00', 35, 'Bản đồ 15 chương: mỗi chương trả lời một câu hỏi về cỗ máy')}
${slide('ga-00', 12, 'Mười sáu chặng, từ bài đầu tới dự án thật')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — Tệp workflow</span><span class="lz-lnote">YAML, và những cái bẫy sinh ra CHÍNH VÌ nó là YAML: cái khoá <code>on</code> bị đọc thành boolean, và số phiên bản bị biến thành số thực. Kích hoạt, <code>schedule</code> thật sự trễ tới đâu, cái commit gộp của <code>pull_request</code> vốn KHÔNG phải nhánh của bạn, và bộ lọc đường dẫn</span></div>
<div class="lz-layer"><span class="lz-lname">2 — Job và runner</span><span class="lz-lnote">Một job là cả một cỗ máy mới; <code>needs:</code> và cái máy dựng xong sớm 5 phút 12 giây; cùng một lệnh trên ba nền tảng; bước và mã thoát; <code>matrix</code> và <code>fail-fast</code></span></div>
<div class="lz-layer"><span class="lz-lname">3 — Biểu thức và context</span><span class="lz-lnote">LÚC NÀO <code>&#36;{{ }}</code> được tính, mà đó là câu trả lời cho phần lớn câu hỏi "sao cái <code>if</code> của tôi không chạy". Context, ép kiểu, <code>hashFiles()</code>, và những điều kiện không bao giờ nổ</span></div>
<div class="lz-layer"><span class="lz-lname">4 — Action</span><span class="lz-lnote">Cái <code>uses:</code> làm gì — nó chạy mã của người khác BÊN TRONG job của bạn. <code>@v4</code> là một CON TRỎ chứ không phải phiên bản; checkout, các action <code>setup-*</code>, và tự viết lấy</span></div>
<div class="lz-layer"><span class="lz-lname">5 — Cache và artifact</span><span class="lz-lnote">Hai thứ trông giống nhau và KHÔNG giống nhau. Khoá cache, <code>restore-keys</code>, một cái cache chết được chẩn đoán, artifact, giới hạn và điểm hoà vốn</span></div>
<div class="lz-layer"><span class="lz-lname">6 — Bí mật, quyền và cái token</span><span class="lz-lnote">Việc che bí mật hoạt động thế nào và HỎNG chính xác ra sao. <code>GITHUB_TOKEN</code>, OIDC thay cho khoá lưu sẵn, toàn bộ bề mặt tấn công trong một trang</span></div>
<div class="lz-layer"><span class="lz-lname">7 — Tốc độ, concurrency và chi phí</span><span class="lz-lnote">Đường tới hạn, nhóm <code>concurrency</code>, độ lệch giữa những lần chạy giống hệt nhau, mọi phép tăng tốc được xếp hạng, và CI đáng giá bao nhiêu</span></div>
<div class="lz-layer"><span class="lz-lname">8 — Khi CI đỏ</span><span class="lz-lnote">Mã thoát đo thật, flaky hay hỏng thật quyết bằng số học, tái lập một cú hỏng, và đọc một lần chạy theo thứ tự phân loại</span></div>
<div class="lz-layer"><span class="lz-lname">9 — Deploy từ CI</span><span class="lz-lnote">Và vì sao kho này đã <em>THÔI</em> — hai sự cố THẬT do các lần deploy kích hoạt bằng push giẫm lên nhau; bước nào chạy ở đâu, rollback, environment, thông báo</span></div>
<div class="lz-layer"><span class="lz-lname">10 — Chẩn đoán bằng ca thật</span><span class="lz-lnote">Năm sự cố thật của kho này: bản dựng cũ, cái seed vỡ ở production, bộ kiểm không thể hỏng, diệt theo cổng, cú migration nửa vời</span></div>
<div class="lz-layer"><span class="lz-lname">11 — Ôn tổng giữa khoá</span><span class="lz-lnote">Gom mọi thứ của Chương 1–10, kèm bài kiểm tra mười câu</span></div>
<div class="lz-layer"><span class="lz-lname">12 — Tái sử dụng ở quy mô đội</span><span class="lz-lnote">Workflow dùng lại, composite action và action tự viết, mẫu dùng chung cho cả tổ chức</span></div>
<div class="lz-layer"><span class="lz-lname">13 — Runner của riêng bạn</span><span class="lz-lnote">Runner tự host chạy trong container, bảo mật của nó, và mở rộng quy mô</span></div>
<div class="lz-layer"><span class="lz-lname">14 — Cổng chất lượng, chuỗi cung ứng và phát hành</span><span class="lz-lnote">Check bắt buộc, <code>pull_request_target</code>, Dependabot và CodeQL, phát hành tự động, monorepo</span></div>
<div class="lz-layer"><span class="lz-lname">15 — Dự án cuối khoá</span><span class="lz-lnote">Một pipeline CI/CD hoàn chỉnh dựng từ số 0, và bài thi cuối khoá hai mươi câu</span></div>
</div>

<h3>Khoá này KHÔNG phải cái gì</h3>
<div class="kv-grid">
<div class="kv"><span class="k">không phải danh sách action</span><span class="v">chợ có hàng nghìn cái và chúng thay đổi. Chương 4 dạy cách ĐỌC một cái thay vì liệt kê</span></div>
<div class="kv"><span class="k">không phải giáo trình YAML</span><span class="v">trừ những phần CẮN, và Chương 1 đem chúng đi đo</span></div>
<div class="kv"><span class="k">không nói về GitLab CI hay Jenkins</span><span class="v">dù các ranh giới ở bài 0.2 chuyển sang gần như nguyên vẹn</span></div>
<div class="kv"><span class="k">không thay thế tài liệu chính thức</span><span class="v">mỗi bài đều dẫn trang chuẩn tắc. Khoá này nói về thứ tài liệu KHÔNG nói: nó tốn gì và nó hỏng thế nào</span></div>
</div>

<h3>Nó nằm ở đâu bên cạnh các khoá khác</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Git &amp; GitHub</span><span class="lz-t">TRƯỚC khoá này</span><span class="lz-d">commit, nhánh, pull request. Khoá này giả định có cả ba</span></div>
<div class="lz-step"><span class="lz-k">Linux &amp; Bash</span><span class="lz-t">song song</span><span class="lz-d">mọi bước <code>run:</code> đều là một script shell, và Chương 3 của khoá đó là lý do script của bạn không hỏng âm thầm</span></div>
<div class="lz-step"><span class="lz-k">Deploy VPS</span><span class="lz-t">sau, hoặc song song</span><span class="lz-d">khoá này DỰNG tạo tác; khoá kia CHUYỂN, TRÁO, và LÙI nó</span></div>
<div class="lz-step"><span class="lz-k">Docker</span><span class="lz-t">tuỳ chọn</span><span class="lz-d">Chương 9 deploy ảnh và Chương 14 đẩy một ảnh lên GHCR; khoá đó giải thích một cái ảnh là gì</span></div>
</div>

${slide('ga-00', 36, 'Thứ chuyển sang dự án của bạn là QUAN HỆ, không phải con số')}

<div class="pitfall">
<p><strong>Bẫy — các con số trong khoá này là của MỘT kho, và của bạn sẽ khác.</strong> Một monorepo Node trên runner do GitHub cấp là một hình dạng cụ thể. <code>npm ci</code> của bạn sẽ không mất 38 giây; bản dựng macOS của bạn sẽ không mất 315. Thứ CHUYỂN ĐƯỢC không phải các con số mà là các <em>QUAN HỆ</em>: rằng Windows chậm một cách nhất quán với việc nặng hệ tệp, rằng đường tới hạn là MỘT job chứ không phải tổng, rằng trúng bộ đệm và trượt bộ đệm chênh nhau một hệ số mà bạn nên biết cho DỰ ÁN CỦA MÌNH. Mỗi chương đều đưa ra câu lệnh, để bạn tự sinh ra số của mình.</p>
</div>

<div class="callout ok">
<p><strong>Một thứ duy nhất mang theo suốt mười lăm chương.</strong> Một lần chạy xanh nghĩa là: <em>mọi câu lệnh bạn liệt kê đều thoát 0, trên một cái máy sạch, trong một môi trường bạn chỉ định.</em> Nó KHÔNG có nghĩa là mã đúng, là lần deploy sẽ chạy, hay là cái thứ bạn quên kiểm thì vẫn ổn. Phần lớn những gì hỏng với CI là một khoảng cách giữa thứ người ta NGHĨ màu xanh có nghĩa gì và thứ nó THẬT SỰ có nghĩa — và mỗi chương ở đây khép lại một trong những khoảng cách đó bằng một phép đo.</p>
</div>

<h3>Các con số tới từ đâu — và cách tự làm ra số của bạn</h3>
<p>"Mọi con số đều tới từ một chỗ bạn kiểm chứng được" chỉ là một lời hứa nếu bạn thật sự kiểm được. Có hai chỗ, cả hai đều mở cho bạn:</p>
<ol>
<li><strong>Lịch sử của chính kho này.</strong> Khoá đã đọc ngược hàng nghìn lần chạy của <code>api-backend</code> qua REST API — các số đo run và bước trong bài 0.1–0.3 tới từ đó. Kho này công khai, nên cùng những lệnh gọi ấy chạy được với bạn.</li>
<li><strong>Sân tập <code>github.com/cuonghoang1103/ga-san-tap</code>.</strong> Một kho công khai tạo riêng cho khoá này. Mỗi chương làm việc trên nhánh riêng (<code>ch00-mo-dau</code> cho mục này) với các workflow tên <code>chNN-*.yml</code> chỉ kích hoạt trên nhánh đó, nên các lần chạy của chương này không bao giờ làm phiền chương khác. Mọi lần chạy được dẫn link trong bài — kể cả những lần đỏ — đều nằm ở đó để bạn mở ra xem.</li>
</ol>
<p>Lệnh gọi duy nhất đứng sau phần lớn các bảng trong khoá trả về mọi job của một lần chạy, kèm dấu thời gian của từng bước:</p>
<pre><code class="language-bash">gh api repos/cuonghoang1103/ga-san-tap/actions/runs/35987300829/jobs \\
  --jq '.jobs[] | "\\(.name): \\((.completed_at|fromdateiso8601) - (.started_at|fromdateiso8601)) giay"'</code></pre>
<div class="out">do (windows-2025): 24 giay
do (macos-15): 7 giay
do (ubuntu-24.04): 7 giay</div>
<p>Sâu thêm một tầng, theo từng bước, cho job Windows của cùng lần chạy:</p>
<div class="out">1  Set up job                                  10:27:19 → 10:27:19
2  May nay co gi                               10:27:19 → 10:27:27
3  Cai mot goi that (do thoi gian)             10:27:27 → 10:27:38
4  Tran heap mac dinh cua Node tren may nay    10:27:38 → 10:27:40
5  Complete job                                10:27:40 → 10:27:40</div>
<p>(<code>gh</code> 2.93.0 trên máy Mac của khoá, 24/09/2026.) Thay chủ kho, tên kho và số run bằng của bạn là bạn có nguyên liệu thô cho mọi câu hỏi "thời gian đi đâu" của Chương 7. API báo theo giây chẵn, nên job nhỏ có thể hiện <code>0</code> cho một bước rõ ràng có làm việc.</p>

<h3>Trước Chương 1: chuẩn bị công cụ một lần</h3>
<table>
<thead><tr><th>Bạn cần</th><th>Cách có</th><th>Kiểm là xong</th></tr></thead>
<tbody>
<tr><td>Tài khoản GitHub và một kho thử <strong>công khai</strong></td><td>github.com → New repository</td><td>bạn push được vào nó</td></tr>
<tr><td>Git</td><td>khoá Git trên site này, Mục 0</td><td><code>git --version</code></td></tr>
<tr><td>GitHub CLI (<code>gh</code>)</td><td>macOS <code>brew install gh</code> · Windows <code>winget install --id GitHub.cli</code> · Linux: trình quản lý gói (xem cli.github.com)</td><td><code>gh --version</code>, rồi <code>gh auth login</code> và <code>gh auth status</code></td></tr>
<tr><td>Trình soạn thảo hiểu workflow</td><td>VS Code + tiện ích chính thức "GitHub Actions"</td><td>nó gợi ý khoá dưới <code>on:</code></td></tr>
<tr><td>Tuỳ chọn: Docker</td><td>khoá Docker, Mục 0</td><td>cho phép chạy <code>actionlint</code> mà không phải cài</td></tr>
</tbody>
</table>
<div class="callout ok">
<p><strong>Vì sao nên dùng kho thử CÔNG KHAI?</strong> Runner chuẩn của GitHub miễn phí và không giới hạn cho kho công khai; kho riêng tư thì tiêu vào một hạn mức hằng tháng (2.000 phút với GitHub Free, 3.000 với Pro, theo tài liệu tính phí kiểm 09/2026) và nhận runner Linux, Windows nhỏ hơn (2 CPU / 8 GB thay vì 4 CPU / 16 GB). Để học thì công khai vừa rẻ hơn vừa gần với các con số trong khoá hơn. Đừng bao giờ đặt bí mật THẬT vào đó — Chương 6 giải thích vì sao ngay cả một secret "đã giấu" cũng có thể rò ra một nhật ký công khai.</p>
</div>

<h3>Học xong mỗi phần, bạn nói được gì một cách THẬT THÀ khi phỏng vấn</h3>
<p>"Em biết GitHub Actions" chẳng có nghĩa gì với người phỏng vấn. Một câu mà bạn chứng minh được bằng một link run thì có nghĩa rất nhiều. Đây là những gì mỗi chặng của khoá cho phép bạn nói mà không phóng đại:</p>
<table>
<thead><tr><th>Sau khi học</th><th>Bạn nói được</th><th>Bằng chứng đưa ra được</th></tr></thead>
<tbody>
<tr><td>Mục 0</td><td>"Em giải thích được CI khác CD và đọc một run hỏng tới dòng lỗi đầu tiên."</td><td>cặp run đỏ → xanh của bạn từ bài 0.1</td></tr>
<tr><td>Chương 1–4</td><td>"Em viết workflow với sự kiện kích hoạt, job, điều kiện đúng và action được ghim."</td><td>một workflow có trigger PR, <code>needs:</code>, một <code>if:</code></td></tr>
<tr><td>Chương 5–7</td><td>"Em làm pipeline nhanh và an toàn: cache, token quyền tối thiểu, concurrency."</td><td>số đo thời gian trước/sau; một khối <code>permissions:</code></td></tr>
<tr><td>Chương 8–10</td><td>"Em chẩn đoán run đỏ và run chập chờn, và biết vì sao push-là-deploy rủi ro."</td><td>một bản ghi ngắn về một sự cố, kèm số run</td></tr>
<tr><td>Chương 12–15</td><td>"Em đã dựng một pipeline CI/CD hoàn chỉnh từ số 0, có workflow dùng lại, cổng chất lượng và phát hành tự động."</td><td>kho dự án cuối khoá và tab Actions của nó</td></tr>
</tbody>
</table>

<h3>Học khoá này thế nào để không bỏ cuộc</h3>
<p>Cách thất bại thành thật nhất với một khoá như thế này không phải là nó khó — mà là chỉ ĐỌC nó. Bạn có thể đọc hết mọi chương, gật gù, rồi vẫn đứng hình trước một thư mục <code>.github/workflows/</code> trống trơn. Thứ ngăn điều đó lại thì nhỏ và nhàm chán:</p>
<ul>
<li><strong>Một kho, mọi bài tập.</strong> Làm mọi bài 🧪 trong CÙNG một kho thử. Tới Chương 5, tab Actions của nó là cuốn nhật ký tiến bộ của chính bạn, kể cả những lần đỏ.</li>
<li><strong>Mỗi tuần một chương, cộng bài thực hành của nó.</strong> Bài kiểm tra cuối mỗi chương là mười tình huống, không phải định nghĩa; câu nào không trả lời được thì phần giải thích chỉ cho bạn bài cần đọc lại.</li>
<li><strong>Đọc run đỏ TRƯỚC khi sửa.</strong> Ghi ra job, bước và dòng lỗi đầu tiên trước khi đổi bất cứ thứ gì (bài "Bắt đầu tại đây 2/2" chỉ thứ tự). Tuần đầu thấy chậm, rồi nó trở thành việc bạn làm nhanh nhất.</li>
<li><strong>Giữ một ghi chú "xanh nghĩa là gì" cho mỗi dự án.</strong> Một dòng: những lệnh nào, trên máy nào. Đó là câu trả lời cho một nửa số câu phỏng vấn trong khoá này.</li>
</ul>
${slide('ga-00', 37, 'Sai lầm hay gặp ở Mục 0')}

<div class="callout tip">
<p><strong>Câu hỏi phỏng vấn hay gặp: "Kể về một pipeline CI/CD bạn đã dựng."</strong> Người phỏng vấn nghe bốn thứ: một sự kiện kích hoạt bạn chọn CÓ CHỦ ĐÍCH, các job được tách vì một LÝ DO, một cú hỏng bạn đã CHẨN ĐOÁN, và màu xanh đảm bảo được GÌ. Kể theo khung: <em>bối cảnh</em> (dự án là gì), <em>pipeline</em> (sự kiện → job → các bước chính), <em>một sự cố</em> (một run đỏ, bạn đọc nó thế nào, nguyên nhân gốc là gì), <em>kết quả</em> (tiết kiệm bao nhiêu thời gian, bắt được lỗi nào trước khi phát hành). Dự án cuối khoá ở Chương 15 được thiết kế để cho bạn ĐÚNG câu chuyện này, kèm link run thật để đưa ra.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Cài và đăng nhập GitHub CLI: <code>gh --version</code>, <code>gh auth login</code>, <code>gh auth status</code>.</li>
<li>Liệt kê các lần chạy mới nhất của sân tập: <code>gh run list -R cuonghoang1103/ga-san-tap -b ch00-mo-dau -L 10</code>. Tìm một run đỏ và một run xanh.</li>
<li>Chạy lệnh <code>gh api …/jobs --jq …</code> ở trên cho một trong hai run đó và ghi lại job chậm nhất.</li>
<li>Làm đúng như vậy với một run trong kho thử của bạn (từ bài 0.1 hoặc 0.2), rồi viết ghi chú một dòng "xanh nghĩa là gì" cho kho đó.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>gh auth status</code> báo bạn đã đăng nhập; bạn có thời lượng (tính bằng giây) các job của một run sân tập và một run của chính bạn; và ghi chú của bạn nêu tên những lệnh và loại runner mà màu xanh được đo trên đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">GitHub CLI — <code>gh</code></span><span class="v">Công cụ dòng lệnh của GitHub; <code>gh run list/view</code> đọc các lần chạy, <code>gh api</code> gọi REST API.</span></div>
<div class="kv"><span class="k">REST API (giao diện lập trình)</span><span class="v">Cổng web của GitHub dành cho chương trình; <code>/actions/runs/{id}/jobs</code> trả về các job và dấu thời gian từng bước.</span></div>
<div class="kv"><span class="k">jq</span><span class="v">Một ngôn ngữ nhỏ để lọc JSON; <code>gh api --jq</code> dùng được nó mà không cần cài thêm.</span></div>
<div class="kv"><span class="k">Sân tập (sandbox)</span><span class="v">Kho công khai <code>ga-san-tap</code> nơi khoá chạy mọi phép đo mới, mỗi chương một nhánh.</span></div>
<div class="kv"><span class="k">Critical path (đường tới hạn)</span><span class="v">Chuỗi job quyết định một lần chạy mất bao lâu; tăng tốc bất cứ thứ gì khác đều không đổi được gì.</span></div>
<div class="kv"><span class="k">Included minutes (phút miễn phí)</span><span class="v">Hạn mức phút runner hằng tháng cho kho riêng tư; kho công khai không tiêu vào đó khi dùng runner chuẩn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Khoá có mười lăm chương: 1–10 dạy và đo, 11 ôn giữa khoá, 12–15 đưa bạn lên mức trưởng nhóm và một dự án cuối khoá kèm bài thi hai mươi câu.</li>
<li>Mọi con số tới từ các lần chạy thật của kho này hoặc từ sân tập công khai <code>ga-san-tap</code>; mỗi bài đều dẫn link run.</li>
<li><code>gh api …/actions/runs/{id}/jobs</code> cho thời lượng từng job và từng bước — bạn tự làm được những bảng đó cho dự án của mình.</li>
<li>Học bằng một kho thử công khai, mỗi tuần một chương, và một ghi chú viết ra "xanh nghĩa là gì".</li>
<li>Thứ chuyển sang dự án của bạn là các QUAN HỆ (Windows chậm với việc nặng hệ tệp, một đường tới hạn, hệ số cache), không phải các con số.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — GitHub Actions documentation</span><span class="lc-sub">docs.github.com/en/actions — gốc của tài liệu chính thức; mỗi chương dẫn thẳng trang cụ thể thay vì chép lại.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — Actions</span><span class="lc-sub">docs.github.com/en/rest/actions — cách các số đo thời lượng run và job trong khoá này được đọc ra. <code>GET /repos/{o}/{r}/actions/runs/{id}/jobs</code> trả về dấu thời gian TỪNG BƯỚC, và đó là nơi mọi cái bảng ở đây tới từ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Usage limits, billing, and administration</span><span class="lc-sub">docs.github.com/en/actions/administering-github-actions/usage-limits-billing-and-administration — trần đồng thời và giá theo phút mà Chương 7 làm việc dựa trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — một lần deploy thật ra là gì</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — mô hình bốn bước mà khoá này giao tạo tác của nó vào tay.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.7 — kiểm tra ─────────────────────────── */
    {
      title: '0.7 — Section 0 check|||0.7 — Kiểm tra Mục 0',
      slug: 'ga-0-7-kiem-tra',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật về CI/CD, máy chạy, job, pipefail, timeout, ghim action và sự cố — mỗi câu có giải thích vì sao đúng và vì sao phương án hấp dẫn nhất lại sai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations you will actually meet — on a team project, on a runner, in an interview. Each one is decided by an idea from Section 0. Read the explanation after submitting, especially for the questions you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain CI, Continuous Delivery and Continuous Deployment, and say who decides to release in each.</li>
<li>I can name three dates in the history of CI and GitHub Actions, and one real incident with its lesson.</li>
<li>I can explain why "works on my machine" fails in CI, and run the clean-clone test.</li>
<li>I know that jobs run on separate fresh machines and how a file gets from one job to another.</li>
<li>I know what <code>timeout-minutes</code>, <code>continue-on-error</code> and <code>shell: bash</code> change, and I have seen each in a real run.</li>
<li>I can read a red run in four steps: job, step, first error line, is it mine.</li>
</ul>
${slide('ga-00', 38, 'Section 0 quick reference')}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống bạn sẽ gặp thật — trong đồ án nhóm, trên runner, trong buổi phỏng vấn. Mỗi câu được quyết định bởi một ý của Mục 0. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được CI, Continuous Delivery và Continuous Deployment, và nói được ai quyết định phát hành ở mỗi cái.</li>
<li>Tôi nêu được ba mốc lịch sử của CI và GitHub Actions, và một sự cố thật kèm bài học của nó.</li>
<li>Tôi giải thích được vì sao "máy tôi chạy được" hỏng trong CI, và làm được phép thử bản clone sạch.</li>
<li>Tôi biết các job chạy trên những máy mới tinh riêng biệt, và một tệp đi từ job này sang job kia bằng cách nào.</li>
<li>Tôi biết <code>timeout-minutes</code>, <code>continue-on-error</code> và <code>shell: bash</code> thay đổi điều gì, và đã thấy từng cái trong một run thật.</li>
<li>Tôi đọc được một run đỏ theo bốn bước: job, bước, dòng lỗi đầu tiên, có phải của mình không.</li>
</ul>
${slide('ga-00', 38, 'Bảng tra nhanh Mục 0')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Your team’s pipeline builds and tests every push, deploys every green build to staging automatically, and puts a production release behind an "Approve" button that the product owner clicks. What is this?|||Pipeline của nhóm bạn dựng và test mọi lần push, tự động đưa mọi bản xanh lên staging, và để việc phát hành production sau một nút "Approve" do product owner bấm. Đây là gì?',
            options: [
              'Continuous Integration only, because anything with a human step cannot be called CD|||Chỉ là Continuous Integration, vì có bước con người thì không thể gọi là CD',
              'Continuous Delivery: every build is kept releasable and a person decides when it goes to production|||Continuous Delivery: mọi bản dựng luôn sẵn sàng phát hành và một người quyết định lúc nào lên production',
              'Continuous Deployment, because staging is updated automatically after every green build|||Continuous Deployment, vì staging được cập nhật tự động sau mỗi bản xanh',
              'None of them — CD requires Kubernetes and a canary release to count|||Không cái nào — CD phải có Kubernetes và phát hành canary mới được tính',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Continuous Delivery keeps every verified build releasable and stops one human decision before production — exactly the Approve button. The tempting "Continuous Deployment" is wrong because Deployment means production itself is updated automatically when green; updating staging automatically is part of Delivery. A human gate does not demote it to plain CI.|||VI: Continuous Delivery giữ mọi bản dựng đã kiểm luôn sẵn sàng phát hành và dừng trước production đúng một quyết định của con người — chính là nút Approve. Phương án hấp dẫn "Continuous Deployment" sai vì Deployment nghĩa là CHÍNH production được cập nhật tự động khi xanh; tự động cập nhật staging chỉ là một phần của Delivery. Có một bước duyệt của người không làm nó tụt xuống thành CI thuần.',
          },
          {
            question: 'A teammate says: "The app runs fine on my laptop, but CI fails with ENOENT: no such file or directory, open …/config.local.json. CI must be broken." What is the most likely cause, and the right fix?|||Một bạn cùng nhóm nói: "App chạy ngon trên laptop mình, mà CI báo ENOENT: no such file or directory, open …/config.local.json. Chắc CI hỏng rồi." Nguyên nhân khả dĩ nhất và cách sửa đúng là gì?',
            options: [
              'The runner has too little disk space; add a step that frees space before running the app|||Runner thiếu dung lượng đĩa; thêm một bước dọn đĩa trước khi chạy app',
              'The runner uses a different Node version; pin node-version to match the laptop exactly|||Runner dùng bản Node khác; ghim node-version cho khớp đúng với laptop',
              'The checkout was shallow; set fetch-depth: 0 so the file is included in the clone|||Checkout bị nông; đặt fetch-depth: 0 để tệp có trong bản clone',
              'The file is ignored by Git and was never committed; commit a default config and let the local file only override it|||Tệp bị Git bỏ qua và chưa bao giờ được commit; commit một cấu hình mặc định và để tệp local chỉ ghi đè',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: ENOENT means the file does not exist on the runner. A runner only has what is committed, and *.local.json files usually sit in .gitignore — "git status --ignored" shows them as "!!". The sandbox reproduced exactly this (run 35986054380) and fixed it with a committed config.example.json (run 35986409808). The tempting fetch-depth: 0 is wrong: depth controls how much history is fetched, not whether an uncommitted file appears.|||VI: ENOENT nghĩa là tệp không tồn tại trên runner. Runner chỉ có những gì đã commit, và tệp *.local.json thường nằm trong .gitignore — "git status --ignored" hiện chúng với "!!". Sân tập đã tái lập đúng ca này (run 35986054380) và sửa bằng một config.example.json được commit (run 35986409808). Phương án hấp dẫn fetch-depth: 0 sai: độ sâu quyết định lấy bao nhiêu lịch sử, không làm một tệp chưa commit hiện ra.',
          },
          {
            question: 'Job "lint" runs npm ci and then eslint. Job "test" has needs: lint and runs only npm test — and fails with "jest: not found". Why?|||Job "lint" chạy npm ci rồi eslint. Job "test" có needs: lint và chỉ chạy npm test — rồi hỏng với "jest: not found". Vì sao?',
            options: [
              'Each job runs on its own fresh machine; needs: only orders the jobs, so "test" must install dependencies itself (or receive them another way)|||Mỗi job chạy trên một máy mới tinh của riêng nó; needs: chỉ xếp thứ tự, nên "test" phải tự cài phụ thuộc (hoặc nhận chúng bằng cách khác)',
              'needs: shares the workspace, but node_modules is excluded from sharing for security reasons|||needs: có chia sẻ thư mục làm việc, nhưng node_modules bị loại khỏi phần chia sẻ vì lý do bảo mật',
              'The "test" job started before "lint" finished, so node_modules was only half written|||Job "test" bắt đầu trước khi "lint" xong, nên node_modules mới ghi được một nửa',
              'jest must be installed globally with npm install -g in CI, unlike on a laptop|||Trong CI phải cài jest toàn cục bằng npm install -g, khác với trên laptop',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: A job is a machine. The sandbox run 35986054356 showed it directly: a job with needs: on the writer still got "No such file or directory", while the job that used download-artifact could read the file. The tempting "needs: shares the workspace" is the exact misconception — needs: waits for success, it shares nothing. The half-written option is also wrong: needs: guarantees "lint" finished first.|||VI: Một job là một cái máy. Run 35986054356 của sân tập cho thấy trực tiếp: job có needs: vào job ghi vẫn nhận "No such file or directory", còn job dùng download-artifact thì đọc được tệp. Phương án hấp dẫn "needs: có chia sẻ thư mục" chính là ngộ nhận cần sửa — needs: chờ thành công, nó không chia sẻ gì. Phương án "ghi được một nửa" cũng sai: needs: đảm bảo "lint" xong trước.',
          },
          {
            question: 'A step is written as run: npm test | tee test-output.txt, with no shell: key, on ubuntu-24.04. Several tests fail, yet the step and the job are green. What explains it?|||Một bước viết run: npm test | tee test-output.txt, không có khoá shell:, trên ubuntu-24.04. Vài test hỏng mà bước và job vẫn xanh. Điều gì giải thích chuyện này?',
            options: [
              'tee suppresses all output, so GitHub never saw the failing tests|||tee nuốt hết đầu ra, nên GitHub không bao giờ thấy các test hỏng',
              'GitHub marks a step green whenever any output was produced, whatever the exit code|||GitHub đánh dấu bước xanh bất cứ khi nào có đầu ra, bất kể mã thoát',
              'Without shell:, the step runs bash -e with no pipefail, so the pipe returns tee’s exit code 0; adding shell: bash (bash -eo pipefail) makes it fail|||Không có shell: thì bước chạy bash -e không có pipefail, nên cái ống trả mã thoát 0 của tee; thêm shell: bash (bash -eo pipefail) sẽ làm nó hỏng',
              'npm test always exits 0 in CI because CI=true disables failures|||npm test luôn thoát 0 trong CI vì CI=true tắt các lỗi',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured in run 35986054351: the step without shell: printed "shell: /usr/bin/bash -e {0}" and "false | tail -1" stayed green; with shell: bash it printed "bash --noprofile --norc -e -o pipefail {0}" and failed with exit code 1. A pipe reports the status of its last command, and tee succeeds. The tempting "tee suppresses output" is wrong — tee copies output to the log and the file; the problem is the exit code, not the text.|||VI: Đo trong run 35986054351: bước không có shell: in "shell: /usr/bin/bash -e {0}" và "false | tail -1" vẫn xanh; có shell: bash thì in "bash --noprofile --norc -e -o pipefail {0}" và hỏng với mã thoát 1. Một cái ống báo trạng thái của lệnh CUỐI, mà tee thì thành công. Phương án hấp dẫn "tee nuốt đầu ra" sai — tee chép đầu ra vào cả nhật ký lẫn tệp; vấn đề nằm ở mã thoát, không ở chữ.',
          },
          {
            question: 'A job with timeout-minutes: 10 hangs waiting for input. A later job in the same workflow has if: failure() to send an alert. What happens after ten minutes?|||Một job có timeout-minutes: 10 bị treo chờ nhập liệu. Một job sau trong cùng workflow có if: failure() để gửi cảnh báo. Sau mười phút chuyện gì xảy ra?',
            options: [
              'The job is marked failure and the alert job runs, because a timeout is a kind of failure|||Job bị đánh dấu failure và job cảnh báo chạy, vì hết giờ cũng là một kiểu thất bại',
              'The job is cancelled; the reason appears as an annotation ("exceeded the maximum execution time"), and if: failure() does not fire for a cancellation|||Job bị cancelled (huỷ); lý do hiện trong annotation ("exceeded the maximum execution time"), và if: failure() không nổ với một lần huỷ',
              'Nothing: timeout-minutes only applies to self-hosted runners; hosted runners use the 6-hour limit|||Không gì cả: timeout-minutes chỉ áp dụng cho runner tự host; runner của GitHub dùng giới hạn 6 giờ',
              'The step is retried automatically once, then the job succeeds with a warning|||Bước được tự chạy lại một lần, rồi job thành công kèm cảnh báo',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: In run 35986054362 a one-minute timeout produced conclusion "cancelled", the step log only said "The operation was canceled.", and the annotation said "The job has exceeded the maximum execution time of 1m0s". Because it is a cancellation, failure() is false. The tempting "a timeout is a failure" is how many alerting setups silently miss hung jobs. timeout-minutes applies to hosted runners too (default 360).|||VI: Trong run 35986054362, hết giờ một phút cho kết luận "cancelled", nhật ký bước chỉ nói "The operation was canceled.", còn annotation nói "The job has exceeded the maximum execution time of 1m0s". Vì là một lần huỷ nên failure() là false. Phương án hấp dẫn "hết giờ là thất bại" chính là cách nhiều hệ cảnh báo lặng lẽ bỏ sót job treo. timeout-minutes áp dụng cả cho runner của GitHub (mặc định 360).',
          },
          {
            question: 'In March 2025 thousands of workflows using tj-actions/changed-files leaked secrets into their logs without changing a line. Which practice would have protected a workflow from running the malicious code?|||Tháng 3/2025, hàng nghìn workflow dùng tj-actions/changed-files rò bí mật ra nhật ký mà không hề sửa một dòng. Thực hành nào lẽ ra đã bảo vệ một workflow khỏi chạy mã độc đó?',
            options: [
              'Referencing the action by a full commit SHA instead of a version tag, because the attackers moved tags and a SHA cannot be moved|||Tham chiếu action bằng SHA đầy đủ của commit thay vì thẻ phiên bản, vì kẻ tấn công đã dời thẻ còn SHA thì không dời được',
              'Using the latest major tag such as @v46 so fixes arrive automatically|||Dùng thẻ phiên bản lớn mới nhất như @v46 để bản vá tự tới',
              'Making the repository private, because private repositories cannot run third-party actions|||Chuyển kho sang riêng tư, vì kho riêng tư không chạy được action bên thứ ba',
              'Setting timeout-minutes: 5 so the malicious script has no time to run|||Đặt timeout-minutes: 5 để script độc không kịp chạy',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The advisory (GHSA-mrrh-fwg8-r2c3) says the attackers retroactively modified version tags to point at a malicious commit. A workflow pinned to a known-good full SHA kept running that exact commit. The tempting "use the latest major tag" is exactly the exposure — a tag is a pointer its owner, or an attacker, can move. Private repositories can run third-party actions, and a 5-minute timeout does not stop a script that takes seconds.|||VI: Cảnh báo (GHSA-mrrh-fwg8-r2c3) nói kẻ tấn công đã sửa ngược các thẻ phiên bản để trỏ vào một commit độc. Workflow ghim vào một SHA đầy đủ đã biết là tốt thì vẫn chạy đúng commit đó. Phương án hấp dẫn "dùng thẻ lớn mới nhất" chính là chỗ hở — thẻ là con trỏ mà chủ của nó, hay kẻ tấn công, dời được. Kho riêng tư vẫn chạy action bên thứ ba, và hết giờ 5 phút không chặn được một script chỉ cần vài giây.',
          },
          {
            question: 'According to the SEC, what was the deployment failure behind Knight Capital’s loss of more than $460 million on 1 August 2012?|||Theo SEC, cú hỏng ở khâu triển khai nào đứng sau khoản lỗ hơn 460 triệu đô la của Knight Capital ngày 01/08/2012?',
            options: [
              'The new code had a syntax error that crashed all eight servers at market open|||Mã mới có lỗi cú pháp làm cả tám máy sập lúc thị trường mở cửa',
              'An automated pipeline deployed an untested branch to production without approval|||Một pipeline tự động đã deploy một nhánh chưa test lên production mà không cần duyệt',
              'A technician copied the new code to the servers by hand and missed one of eight; no second review or written procedure caught it|||Một kỹ thuật viên chép mã mới lên các máy bằng tay và sót một trong tám máy; không có người kiểm thứ hai hay quy trình viết thành văn nào bắt được',
              'The database schema was migrated after the new code started, like this repository’s 3 July incident|||Schema cơ sở dữ liệu được migrate sau khi mã mới đã chạy, giống sự cố 03/07 của kho này',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: SEC order 34-70694, paragraph 15: one of Knight’s technicians did not copy the new code to one of the eight servers, no second technician reviewed the deployment, and there were no written procedures requiring such a review. The seven updated servers behaved correctly. The tempting "automated pipeline" answer is the opposite of the facts — the deploy was manual, which is why scripted, verified deploys are the lesson.|||VI: Lệnh SEC 34-70694, đoạn 15: một kỹ thuật viên của Knight không chép mã mới lên một trong tám máy, không có kỹ thuật viên thứ hai kiểm lại, và không có quy trình viết thành văn nào đòi hỏi việc kiểm đó. Bảy máy đã cập nhật chạy đúng. Phương án hấp dẫn "pipeline tự động" ngược với sự thật — lần deploy là làm TAY, và vì thế bài học là deploy bằng script có kiểm chứng.',
          },
          {
            question: 'ci-lint.yml has on: pull_request: branches: [main] and on: push: branches: [main] with a paths: list of source folders. You change only README.md. What happens?|||ci-lint.yml có on: pull_request: branches: [main] và on: push: branches: [main] kèm danh sách paths: các thư mục mã nguồn. Bạn chỉ sửa README.md. Chuyện gì xảy ra?',
            options: [
              'CI runs in both cases, because README.md is at the repository root|||CI chạy ở cả hai trường hợp, vì README.md nằm ở gốc kho',
              'CI runs in neither case, because paths: applies to the whole workflow|||CI không chạy ở trường hợp nào, vì paths: áp dụng cho cả workflow',
              'CI runs when pushed directly to main, but not in a pull request|||CI chạy khi push thẳng vào main, nhưng không chạy trong pull request',
              'Pushed directly to main it does not run; opened as a pull request it runs, because only the push trigger has a paths filter|||Push thẳng vào main thì không chạy; mở thành pull request thì chạy, vì chỉ trigger push có bộ lọc paths',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Filters belong to each event, not to the workflow. The push event has paths:, and README.md matches none of them, so no run. The pull_request event has only branches:, so any PR into main runs CI. The tempting "paths: applies to the whole workflow" is the misunderstanding that lets this asymmetry live in a file for a year. Read the on: block event by event.|||VI: Bộ lọc thuộc về TỪNG sự kiện, không thuộc về cả workflow. Sự kiện push có paths:, và README.md không khớp mẫu nào, nên không chạy. Sự kiện pull_request chỉ có branches:, nên mọi PR vào main đều chạy CI. Phương án hấp dẫn "paths: áp dụng cho cả workflow" chính là ngộ nhận khiến sự bất đối xứng này sống trong tệp cả năm. Hãy đọc khối on: theo từng sự kiện.',
          },
          {
            question: 'A desktop build is green in 20 seconds on a 32 GB Mac but exits 134 ("JavaScript heap out of memory") on the macos-15 runner. Which measurement best explains it?|||Một bản dựng desktop xanh trong 20 giây trên Mac 32 GB nhưng thoát 134 ("JavaScript heap out of memory") trên runner macos-15. Phép đo nào giải thích tốt nhất?',
            options: [
              'The runner has only 3 CPU cores, so the build runs out of time and V8 aborts|||Runner chỉ có 3 nhân CPU, nên bản dựng hết thời gian và V8 huỷ',
              'Node sets its default heap from RAM: the 7 GB macOS runner gives about 2096 MB, half of the 4144 MB on the laptop|||Node đặt heap mặc định theo RAM: runner macOS 7 GB cho khoảng 2096 MB, bằng nửa con số 4144 MB trên laptop',
              'macOS runners use Node 16, which has a smaller heap than Node 22|||Runner macOS dùng Node 16, có heap nhỏ hơn Node 22',
              'Exit 134 means the OOM killer, so the fix is to add swap space on the runner|||Mã 134 nghĩa là OOM killer, nên cách sửa là thêm swap cho runner',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Run 35987300829 printed heap_size_limit 2096 MB on macos-15 (RAM 7.0 GB) and 4144 MB on the Linux and Windows runners; the course Mac also reports 4144 MB. A build that peaks near 3 GB fits one and not the other. The tempting "exit 134 is the OOM killer" is wrong — the kernel’s OOM kill shows up as 137; 134 is an abort, here V8 hitting its own heap limit. CPU count affects speed, not a heap error.|||VI: Run 35987300829 in heap_size_limit 2096 MB trên macos-15 (RAM 7,0 GB) và 4144 MB trên runner Linux, Windows; Mac của khoá cũng báo 4144 MB. Một bản dựng lúc cao điểm gần 3 GB vừa với máy này mà không vừa máy kia. Phương án hấp dẫn "134 là OOM killer" sai — bị nhân hệ điều hành giết vì hết RAM thì hiện 137; 134 là abort, ở đây là V8 chạm trần heap của chính nó. Số CPU ảnh hưởng tốc độ, không gây lỗi heap.',
          },
          {
            question: 'Interview: "What does a green CI run actually guarantee?" Which answer is the most accurate?|||Phỏng vấn: "Một lần chạy CI xanh thật ra đảm bảo điều gì?" Câu trả lời nào chính xác nhất?',
            options: [
              'That the code is correct and ready for production, since all tests passed|||Rằng mã đúng và sẵn sàng cho production, vì mọi test đều qua',
              'That the code works on every developer’s machine, since CI simulates all of them|||Rằng mã chạy được trên máy của mọi lập trình viên, vì CI mô phỏng tất cả các máy đó',
              'That every command in the workflow exited 0 on a clean checkout on that runner — so its value depends on which checks you run and how close the runner is to production|||Rằng mọi lệnh trong workflow đã thoát 0 trên một bản lấy về sạch trên runner đó — nên giá trị của nó phụ thuộc vào phép kiểm nào được chạy và runner giống production tới đâu',
              'That no secret was exposed during the run, since GitHub masks all secrets|||Rằng không bí mật nào bị lộ trong lần chạy, vì GitHub che hết mọi bí mật',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Green means the listed commands exited 0 on one clean machine — nothing more. If the workflow only type-checks, green says nothing about behaviour; if the runner differs from production, green says nothing about production. The tempting "the code is correct" is the gap this whole section is about. And Codecov 2021 and tj-actions 2025 both leaked secrets inside green builds.|||VI: Xanh nghĩa là những lệnh đã liệt kê thoát 0 trên MỘT cái máy sạch — không hơn. Nếu workflow chỉ kiểm kiểu thì xanh không nói gì về hành vi; nếu runner khác production thì xanh không nói gì về production. Phương án hấp dẫn "mã đúng" chính là khoảng hở mà cả mục này nói tới. Và cả Codecov 2021 lẫn tj-actions 2025 đều rò bí mật bên trong những bản dựng xanh.',
          },
        ],
      },
    },
  ],
};
