/**
 * Git & GitHub — Mục 0: Giới thiệu · Vì sao cần · Cài đặt · Cách học.
 * Song ngữ EN/VI qua .ml-en / .ml-vi (số khối phải bằng nhau).
 * ⚠️ KHÔNG dùng backtick trần trong content (dùng &#96;); mọi `${` trong code mẫu
 * escape thành \${; < > trong code/output → &lt; &gt;; & → &amp;.
 * Khối .out (kết quả chạy thật) LUÔN đóng bằng </div>, KHÔNG </code></pre>.
 * KHÔNG dùng <svg> — sanitizeHtml() xoá sạch nó, sơ đồ biến mất không báo lỗi.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Section 0 — Introduction, Why Git, Setup & How to Study|||Mục 0 — Giới thiệu, Vì sao cần Git, Cài đặt & Cách học',
  description: 'Đọc trước tiên: khoá này dành cho ai, vấn đề mà Git thực sự giải quyết (và vì sao thư mục "báo cáo_final_v2_sửa_lần_cuối" là một hệ quản lý phiên bản tồi), cài đặt và cấu hình Git trên cả ba hệ điều hành, tạo khoá SSH cho GitHub, và cách học khoá này để kiến thức đọng lại.',
  lessons: [
    /* ─────────────────── 0.5 · BẮT ĐẦU TẠI ĐÂY (1/2) ─────────────────── */
    {
      title: 'Start here (1/2) — Git and GitHub: what they are, where they came from, why they matter|||Bắt đầu tại đây (1/2) — Git và GitHub là gì, ra đời thế nào, và vì sao quan trọng với bạn',
      slug: 'git-0-5-bat-dau-tai-day',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bài mở cửa cho người chưa từng dùng Git: Git và GitHub là gì (bằng hình ảnh đời thường trước, định nghĩa sau), khác nhau ra sao, câu chuyện Linus Torvalds viết Git năm 2005, GitHub từ 2008 tới 180 triệu lập trình viên, và Git giúp gì cho đồ án, thực tập, đi làm của chính bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>Hello. Before you type a single command, know what you are learning — and why</h2>
<p class="lead">Welcome. If you have never used Git, or you have used it only by copying <code>git add .</code>, <code>git commit</code>, <code>git push</code> from a friend without knowing what they do, this lesson is for you. No commands to memorise here. In twenty minutes you will know what Git and GitHub are, where they came from, what problem they were built to solve, and why almost every software team on earth uses them — including the team you are about to join for your SWP391 project.</p>
<p>This lesson and the next one are the front door of the course. Lesson 2 of the pair tells real stories of what happens <em>without</em> Git and gives you a study plan that does not burn you out. After that, lesson 0.1 shows the full map, 0.2 goes deeper into the problem Git solves, 0.3 installs everything, and 0.4 builds your safe practice playground.</p>

<h3>What Git is — an everyday picture first</h3>
${slide('git-00', 18, 'Git là gì? Nút “lưu game” cho cả thư mục')}
<p>Forget the textbook definition for a moment. Picture three things you already know:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">🎮 A "save game" button</span><span class="v">Before a hard boss fight you save; if you lose, you reload. Git gives your <strong>whole project folder</strong> a save button. Each save is called a <strong>commit</strong>. You can keep hundreds of them, and go back to any one.</span></div>
  <div class="kv"><span class="k">⏳ A time machine</span><span class="v">"Show me the project exactly as it was last Monday, before I broke the login page." One command, and the folder is back to Monday. Another, and you are back in today.</span></div>
  <div class="kv"><span class="k">📓 A diary with signatures</span><span class="v">Every entry says <em>who</em> changed <em>which lines</em>, <em>when</em>, and <em>why</em> (the commit message). Nobody can quietly rewrite an old entry without it showing — Git fingerprints every version with a hash.</span></div>
</div>
<p>Now the proper definition, and it will make sense: <strong>Git is a distributed version control system</strong>. Word by word:</p>
<ul>
  <li><strong>Version</strong> — one saved state of your project (one commit).</li>
  <li><strong>Version control</strong> — a tool that keeps all those versions, tells you what changed between them, and lets several people combine their changes.</li>
  <li><strong>Distributed</strong> — every person's computer holds the <em>complete</em> history, not just the latest files. There is no single machine whose death kills the project. (Lesson 0.2 compares this with older "centralised" tools.)</li>
</ul>
<div class="callout ok"><strong>One sentence to keep:</strong> Git is a free program on your own computer that takes snapshots of your project folder, labels each one with who, when and why, and lets you move between them — and merge other people's snapshots with yours.</div>

<h3>What GitHub is</h3>
${slide('git-00', 19, 'Git ≠ GitHub — máy bạn ⇄ GitHub ⇄ bạn cùng nhóm')}
<p>Git lives on your laptop. But a team of five needs one <em>shared</em> copy that everybody sends work to and fetches work from. <strong>GitHub</strong> is a website that stores that shared copy of a Git repository for you — and then adds a set of team tools on top that Git itself does not have:</p>
<ul>
  <li><strong>Pull requests</strong> — "here are my changes, please review them before they go into the main branch".</li>
  <li><strong>Issues</strong> and <strong>Projects</strong> — a to-do list and a board for the team's tasks and bugs.</li>
  <li><strong>Actions</strong> — robots that run your tests or deploy your site every time someone pushes.</li>
  <li><strong>Pages</strong> — free hosting for a static website such as your portfolio.</li>
  <li><strong>Your profile</strong> — a public record of what you have built, which recruiters really do open.</li>
</ul>
<p>A useful picture: Git is the camera in everyone's pocket; GitHub is the shared online album where the team puts the photos, comments on them, and decides which ones go into the final book.</p>

<h3>Git vs GitHub — side by side</h3>
${slide('git-00', 20, 'Git và GitHub — so từng dòng')}
<table>
  <tr><th></th><th>Git</th><th>GitHub</th></tr>
  <tr><td>What it is</td><td>A version control program</td><td>A website that hosts Git repositories + team tools</td></tr>
  <tr><td>Where it runs</td><td>On your computer, in the hidden <code>.git/</code> folder</td><td>On GitHub's servers; you use it in a browser or via <code>git push</code> / <code>git pull</code></td></tr>
  <tr><td>Needs internet / account?</td><td>No</td><td>Yes, both</td></tr>
  <tr><td>Who made it</td><td>Linus Torvalds, April 2005; maintained by Junio Hamano since July 2005</td><td>Four founders, launched April 2008; owned by Microsoft since 2018</td></tr>
  <tr><td>Cost</td><td>Free and open source</td><td>Free plan; extra benefits for students (Chapter 15)</td></tr>
  <tr><td>Alternatives</td><td>Practically none today — Git dominates</td><td>GitLab, Bitbucket, Gitea… all use Git underneath</td></tr>
</table>
<div class="callout warn"><strong>Beginner misunderstanding no. 1: "Git = GitHub".</strong> It leads to sentences like "GitHub is down so I cannot commit" (you can — commits are local), "I deleted the repo on GitHub so my code is gone" (the copy on your laptop is untouched), or "I need an account to use Git" (you do not). Keep the two apart: Chapters 1–4 are pure Git on your machine, and GitHub enters in Chapter 5.</div>

<h3>How Git was born — a true story</h3>
${slide('git-00', 21, 'Dòng thời gian: từ email vá lỗi tới 180 triệu lập trình viên')}
<p><strong>Before Git.</strong> From 1991 to 2002, the Linux kernel — the heart of Android phones, most web servers and many supercomputers — was developed by passing changes around as patches in emails and as archive files. Other teams at the time used tools such as CVS and Subversion (SVN), which kept the history on <em>one central server</em>: if the server was down, nobody could save a version; if it was lost, so was the history.</p>
<p><strong>2002 — BitKeeper.</strong> The kernel project started using BitKeeper, a commercial, distributed tool whose company let the Linux community use it free of charge. It worked well, but the code of the tool itself was closed.</p>
<p><strong>Early 2005 — the break-up.</strong> The relationship broke down. BitMover, the company behind BitKeeper, objected to Andrew Tridgell (a well-known open-source developer) building a tool to read BitKeeper's data, and in April 2005 announced it would stop providing the free version. Linus Torvalds, the creator of Linux, later said he had spent weeks trying to mediate before deciding he could not keep using it. None of the free tools of the day were fast enough and distributed enough for a project the size of Linux. So he wrote his own.</p>
<p><strong>April 2005 — ten days.</strong> Work began on 3 April 2005. Linus announced the project on 6 April, and on 7 April Git was already storing its own source code — "self-hosting". The very first commit in Git's history, still visible on GitHub today, has the message <code>Initial revision of "git", the information manager from hell</code>. In a 2015 interview Linus said it came together in "about ten days or so", at which point he made his first kernel commit with it. On 18 April the first merge of multiple branches happened, and on 16 June 2005 the Linux 2.6.12 release was managed with Git.</p>
<p><strong>July 2005 — handing it over.</strong> On 26 July 2005 Linus passed maintenance to <strong>Junio Hamano</strong>, who still maintains Git today. Version 1.0 came out on 21 December 2005.</p>
<p><strong>The name.</strong> "Git" is British slang for an unpleasant, annoying person. Linus joked that he names all his projects after himself — first Linux, now git. The original README also offered other readings, depending on your mood: "the stupid content tracker", or "global information tracker" when it works.</p>

<h3>Why it was born — the five design goals</h3>
${slide('git-00', 22, 'Vì sao Git ra đời: BitKeeper đổ vỡ → mục tiêu thiết kế')}
<p>The Pro Git book lists the goals Linus set for the new system. Every one of them still shapes how you use Git today:</p>
<table>
  <tr><th>Goal</th><th>What it means for you</th></tr>
  <tr><td><strong>Speed</strong></td><td>Commit, switch branch, view history: usually instant, because it all happens on your disk.</td></tr>
  <tr><td><strong>Simple design</strong></td><td>Underneath, Git is just snapshots plus pointers. Chapter 1 teaches that model; Chapter 9 opens <code>.git/</code> so you can see it.</td></tr>
  <tr><td><strong>Strong support for non-linear development</strong> (thousands of parallel branches)</td><td>Five students can each work on their own branch at the same time and merge later. Branches cost almost nothing.</td></tr>
  <tr><td><strong>Fully distributed</strong></td><td>Every clone is a full backup of the history. You can commit on a bus with no Wi-Fi.</td></tr>
  <tr><td><strong>Handles large projects efficiently</strong></td><td>The same tool runs a school project and the Linux kernel.</td></tr>
</table>
<p>And one more that runs through all of them: <strong>integrity</strong>. Every version is identified by a hash of its own content, so if even one bit of history were altered, the hash would no longer match. That is why commits have names like <code>cf119fa</code> instead of "version 3".</p>

<h3>GitHub: from 2008 to 180 million developers</h3>
<p>GitHub was launched in April 2008 by four founders (Tom Preston-Werner, Chris Wanstrath, P. J. Hyett and Scott Chacon — Scott is also the author of the Pro Git book). It made Git easy to share: one web address per project, a friendly page for every commit, and — the killer feature — pull requests. On 4 June 2018 Microsoft announced it would buy GitHub for 7.5 billion US dollars in Microsoft stock; the deal completed on 26 October 2018.</p>
<p>According to GitHub's Octoverse 2025 report (published 28/10/2025), more than <strong>180 million developers</strong> build on GitHub, more than 36 million joined in the past year — more than one new developer every second — and it hosts <strong>630 million repositories</strong>. In 2025 developers pushed nearly 1 billion commits and merged on average 43.2 million pull requests every month.</p>

<h3>What Git is used for</h3>
${slide('git-00', 24, 'Git dùng để làm gì — tám việc, tám chương')}
<table>
  <tr><th>Job</th><th>In plain words</th><th>Where you learn it</th></tr>
  <tr><td>Keep the history</td><td>Every commit is a snapshot of the whole project, kept forever</td><td>Ch 1</td></tr>
  <tr><td>Go back to a working version</td><td>Undo a bad change without destroying the history</td><td>Ch 4</td></tr>
  <tr><td>Work in parallel with branches</td><td>4–5 people change one project without stepping on each other</td><td>Ch 3</td></tr>
  <tr><td>See who changed what and why</td><td><code>git log</code>, <code>git blame</code>, find the commit that introduced a bug</td><td>Ch 2</td></tr>
  <tr><td>Review code</td><td>Teammates read your pull request before it reaches <code>main</code></td><td>Ch 6</td></tr>
  <tr><td>CI/CD</td><td>Every push automatically runs tests or deploys the site (GitHub Actions)</td><td>Ch 11</td></tr>
  <tr><td>Portfolio for job hunting</td><td>Your GitHub profile is proof you can build things</td><td>Ch 15</td></tr>
  <tr><td>Contribute to open source</td><td>Fork → change → pull request into someone else's project</td><td>Ch 5, 15</td></tr>
</table>

<h3>Does it really matter? The numbers</h3>
${slide('git-00', 25, 'Quan trọng tới mức nào? Con số có nguồn')}
<p>The Stack Overflow Developer Survey 2022 asked developers which version control system they use. <strong>93.87%</strong> of all respondents said Git. Among professional developers it was <strong>96.65%</strong>. Even among people still <em>learning to code</em>, <strong>81.87%</strong> already used Git. The next tool on the list, SVN, was at 5.18%. In other words: Git is not one option among many — it is the standard, and the question in a job interview is not "have you used Git?" but "how well?".</p>

<h3>What it does for YOU</h3>
${slide('git-00', 26, 'Git giúp gì cho bạn — từ năm nhất tới đi làm')}
<div class="kv-grid">
  <div class="kv"><span class="k">Your own assignments</span><span class="v">Commit after each step that works. When a "small change" breaks everything at midnight, you go back to the last good commit in seconds instead of pressing Ctrl+Z two hundred times.</span></div>
  <div class="kv"><span class="k">SWP391 and other team projects</span><span class="v">Four or five people editing one codebase for weeks. Without Git: zip files over Zalo, overwritten work, arguments. With Git: one repository, a branch per feature, pull requests, and a history that shows fairly who did what.</span></div>
  <div class="kv"><span class="k">Internship and interviews</span><span class="v">Recruiters open your GitHub. Typical interview questions: "What is the difference between merge and rebase?", "fetch vs pull?", "You committed a password — what now?", "How do you resolve a conflict?". Every one of them is answered in this course.</span></div>
  <div class="kv"><span class="k">Your first job</span><span class="v">Day one at almost any software company: "clone this repository, create a branch, open a pull request". Git is assumed, like knowing how to use email.</span></div>
  <div class="kv"><span class="k">Everything else you will learn</span><span class="v">Docker images, deploying to a server, GitHub Actions — the other courses on this site all start from a Git repository.</span></div>
</div>

<h3>Where this course takes you</h3>
${slide('git-00', 4, 'Lộ trình toàn khoá — 17 phần')}
<p>Seventeen parts: this Section 0, then Chapters 1–4 (the model: commits, history, branches, undo), 5–8 (teamwork on GitHub), 9–12 (depth and automation), 13 (a rescue cookbook for emergencies), and 14–16 (your everyday tools, your GitHub profile as a student, and a full team project that ends with the 20-question final exam). You do not need all of it for your first team project — the next lesson gives you a one-week minimum route. The full map with every chapter is in lesson 0.1.</p>

<div class="pitfall co-tieu-de"><strong>How beginners start in the wrong place.</strong> A new student creates a GitHub account, clicks "Upload files" in the browser to put the project online, and believes that is "using Git". It works for a day. Then two teammates each upload their own copy of the same file. Each upload becomes a commit on GitHub, but the second one simply replaces the whole file with a copy that never contained the first person's changes — nothing is merged, and the lost work only shows up days later as "my fix disappeared". Merging only happens when everyone works in Git on their own machine and pulls before pushing. Learn Git on your own machine first (Chapters 1–4); GitHub is where you <em>share</em> the history Git creates, not a replacement for it.</div>

<h3>🧪 Practice (10 minutes — guaranteed to work)</h3>
<div class="callout ok"><ol><li>Open a terminal (Windows: Git Bash; if you do not have it yet, skip to step 2 and come back after lesson 0.3) and run <code>git --version</code>. Any version from 2.30 up is fine.</li><li>Create a free GitHub account at <code>github.com</code>. Pick a username you would be happy to show a recruiter (for example <code>nguyenvancuong</code>, not <code>xxboy2k6</code>) and use an email you will keep after graduation.</li><li>Open <code>github.com/git/git</code> — the official mirror of Git's own source code. Look around: this is the real history of the tool you are about to learn, with tens of thousands of commits. Then open the link card <em>“The first commit of Git”</em> below — commit <code>e83c516</code>, by Linus Torvalds, 7 April 2005 — and read its message and its date.</li><li>Open <code>github.com/torvalds/linux</code> and note two numbers from the page: how many commits, and how many contributors.</li><li>In one sentence of your own, write down the difference between Git and GitHub.</li></ol>
<pre><code class="language-bash">git --version</code></pre>
<div class="out">git version 2.51.1</div>
<p>(Real output on the author's Mac, 09/2026 — yours may show a different version number.)</p>
<p><strong>Done when:</strong> you have a GitHub account, you have seen the message <code>Initial revision of "git", the information manager from hell</code> with your own eyes, you have written down the commit and contributor counts of the Linux repository, and your one-sentence definition does not say "Git and GitHub are the same thing".</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Git</span><span class="v">A free distributed version control program that runs on your computer.</span></div>
  <div class="kv"><span class="k">GitHub</span><span class="v">A website that hosts Git repositories and adds team tools (pull requests, issues, Actions, Pages).</span></div>
  <div class="kv"><span class="k">Version control system (VCS)</span><span class="v">A tool that keeps every version of a set of files and shows what changed between them.</span></div>
  <div class="kv"><span class="k">Commit</span><span class="v">One saved snapshot of the whole project, with author, time and a message saying why.</span></div>
  <div class="kv"><span class="k">Repository (repo)</span><span class="v">A project folder plus its full history in the hidden <code>.git/</code> folder.</span></div>
  <div class="kv"><span class="k">Distributed</span><span class="v">Every copy of the repository contains the complete history, not just the latest files.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Git is a "save game" button for your whole project folder: each commit records what, who, when and why.</li><li>GitHub is a website that stores a shared copy of Git repositories and adds pull requests, issues and Actions; GitLab and Bitbucket are alternatives.</li><li>Linus Torvalds wrote Git in April 2005, in about ten days, after the Linux kernel lost free use of BitKeeper; Junio Hamano has maintained it since July 2005.</li><li>Git was designed to be fast, simple, branch-friendly, fully distributed and tamper-evident — and those goals explain how you use it today.</li><li>93.87% of developers in the Stack Overflow 2022 survey used Git; GitHub now has 180 million+ developers — Git is the standard you will meet in SWP391, internships and every job.</li></ul>

<a class="link-card" href="https://git-scm.com/book/en/v2/Getting-Started-A-Short-History-of-Git" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 1.2 — A Short History of Git</span><span class="lc-sub">BitKeeper, 2005, and the design goals, from the official book.</span></span>
</a>
<a class="link-card" href="https://www.linuxfoundation.org/blog/blog/10-years-of-git-an-interview-with-git-creator-linus-torvalds" target="_blank" rel="noopener">
  <span class="lc-ico">🎙️</span>
  <span class="lc-body"><span class="lc-title">10 Years of Git: an interview with Linus Torvalds (2015)</span><span class="lc-sub">"About ten days", self-hosting in a day, and why he stopped using BitKeeper — in his own words.</span></span>
</a>
<a class="link-card" href="https://github.com/git/git/commit/e83c5163316f89bfbde7d9ab23ca2e25604af290" target="_blank" rel="noopener">
  <span class="lc-ico">🥇</span>
  <span class="lc-body"><span class="lc-title">The first commit of Git, 7 April 2005</span><span class="lc-sub">"Initial revision of git, the information manager from hell" — open it for the practice above.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Git" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Wikipedia — Git</span><span class="lc-sub">The 2005 timeline (3 April, 7 April, 16 June, 26 July, 21 December) and the story of the name.</span></span>
</a>
<a class="link-card" href="https://github.blog/news-insights/company-news/github-microsoft/" target="_blank" rel="noopener">
  <span class="lc-ico">🤝</span>
  <span class="lc-body"><span class="lc-title">GitHub Blog — GitHub + Microsoft (04/06/2018)</span><span class="lc-sub">GitHub's own announcement of the acquisition.</span></span>
</a>
<a class="link-card" href="https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">GitHub Octoverse 2025</span><span class="lc-sub">180M+ developers, 630M repositories, nearly 1 billion commits in 2025.</span></span>
</a>
<a class="link-card" href="https://survey.stackoverflow.co/2022/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Stack Overflow Developer Survey 2022</span><span class="lc-sub">Section "Version control": Git 93.87% of all respondents, 96.65% of professional developers.</span></span>
</a>
<p class="note-ct"><strong>Next:</strong> lesson 2 of "Start here" — real disasters that happened without a safety net, the situations student teams hit every semester, and a study plan that keeps you going.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Chào bạn. Trước khi gõ lệnh nào, hãy biết mình đang học cái gì — và vì sao</h2>
<p class="lead">Chào mừng bạn. Nếu bạn chưa từng dùng Git, hoặc chỉ dùng bằng cách chép ba dòng <code>git add .</code>, <code>git commit</code>, <code>git push</code> của bạn cùng nhóm mà không biết chúng làm gì, thì bài này viết cho bạn. Ở đây không có lệnh nào phải học thuộc. Trong hai mươi phút, bạn sẽ biết Git và GitHub là gì, chúng ra đời từ đâu, sinh ra để giải quyết chuyện gì, và vì sao gần như mọi nhóm làm phần mềm trên thế giới đều dùng chúng — kể cả nhóm đồ án SWP391 mà bạn sắp vào.</p>
<p>Bài này và bài kế tiếp là cửa vào của cả khoá. Bài thứ hai kể những chuyện có thật xảy ra khi <em>không có</em> Git và đưa bạn một kế hoạch học để không bị nản giữa chừng. Sau đó bài 0.1 cho bạn xem bản đồ đầy đủ, 0.2 đào sâu vấn đề Git giải quyết, 0.3 cài đặt mọi thứ, và 0.4 dựng sân tập an toàn để bạn tha hồ nghịch.</p>

<h3>Git là gì — nói bằng hình ảnh đời thường trước</h3>
${slide('git-00', 18, 'Git là gì? Nút “lưu game” cho cả thư mục')}
<p>Tạm quên định nghĩa trong sách. Hãy hình dung ba thứ bạn đã quen:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">🎮 Nút “lưu game”</span><span class="v">Trước khi đánh trùm khó, bạn lưu game; thua thì nạp lại. Git gắn một nút lưu như vậy cho <strong>cả thư mục dự án</strong>. Mỗi lần lưu gọi là một <strong>commit</strong> (điểm lưu). Bạn giữ được hàng trăm điểm lưu và quay về điểm nào cũng được.</span></div>
  <div class="kv"><span class="k">⏳ Cỗ máy thời gian</span><span class="v">“Cho tôi xem dự án đúng như sáng thứ Hai tuần trước, trước lúc tôi làm hỏng trang đăng nhập.” Một lệnh là thư mục trở về thứ Hai. Một lệnh nữa là bạn về lại hôm nay.</span></div>
  <div class="kv"><span class="k">📓 Sổ nhật ký có chữ ký</span><span class="v">Mỗi trang ghi <em>ai</em> sửa <em>dòng nào</em>, <em>lúc nào</em>, <em>vì sao</em> (lời nhắn commit). Không ai lén sửa được trang cũ mà không lộ — Git đóng dấu vân tay (mã băm — hash) lên từng phiên bản.</span></div>
</div>
<p>Giờ tới định nghĩa chuẩn, và bạn sẽ thấy nó dễ hiểu: <strong>Git là một hệ quản lý phiên bản phân tán</strong> (distributed version control system). Tách từng chữ:</p>
<ul>
  <li><strong>Phiên bản</strong> (version) — một trạng thái đã lưu của dự án (một commit).</li>
  <li><strong>Quản lý phiên bản</strong> (version control) — công cụ giữ hết các phiên bản đó, chỉ cho bạn thấy giữa chúng đã đổi gì, và giúp nhiều người gộp thay đổi của nhau lại.</li>
  <li><strong>Phân tán</strong> (distributed) — máy của mỗi người đều giữ <em>toàn bộ</em> lịch sử, không chỉ bản mới nhất. Không có một cái máy nào mà nó chết là dự án chết theo. (Bài 0.2 so sánh chuyện này với các công cụ “tập trung” đời trước.)</li>
</ul>
<div class="callout ok"><strong>Một câu để nhớ:</strong> Git là một phần mềm miễn phí chạy trên máy bạn, chụp lại thư mục dự án thành từng ảnh chụp (snapshot), ghi kèm ai — lúc nào — vì sao, cho bạn đi lại giữa các ảnh chụp đó, và gộp ảnh chụp của người khác với của bạn.</div>

<h3>GitHub là gì</h3>
${slide('git-00', 19, 'Git ≠ GitHub — máy bạn ⇄ GitHub ⇄ bạn cùng nhóm')}
<p>Git sống trên laptop của bạn. Nhưng một nhóm năm người cần một bản <em>dùng chung</em> để ai cũng gửi việc lên và lấy việc của người khác về. <strong>GitHub</strong> là một trang web giữ hộ bạn bản dùng chung đó của kho Git — rồi thêm lên trên một bộ công cụ làm việc nhóm mà bản thân Git không có:</p>
<ul>
  <li><strong>Pull request</strong> (yêu cầu gộp mã) — “đây là phần mình sửa, các bạn đọc giúp trước khi nó vào nhánh chính nhé”.</li>
  <li><strong>Issues</strong> (phiếu công việc) và <strong>Projects</strong> (bảng công việc) — danh sách việc cần làm, lỗi cần sửa của cả nhóm.</li>
  <li><strong>Actions</strong> (tự động hoá) — “con robot” tự chạy test hoặc tự deploy trang web mỗi khi có người push.</li>
  <li><strong>Pages</strong> — chỗ đăng miễn phí một trang web tĩnh, ví dụ portfolio của bạn.</li>
  <li><strong>Trang hồ sơ</strong> (profile) — bản ghi công khai những gì bạn đã làm, và nhà tuyển dụng thật sự có mở ra xem.</li>
</ul>
<p>Một hình ảnh dễ nhớ: Git là chiếc máy ảnh trong túi mỗi người; GitHub là album online chung, nơi cả nhóm đưa ảnh lên, bình luận từng tấm, và cùng chọn tấm nào vào cuốn kỷ yếu cuối cùng.</p>

<h3>Git và GitHub — so từng dòng</h3>
${slide('git-00', 20, 'Git và GitHub — so từng dòng')}
<table>
  <tr><th></th><th>Git</th><th>GitHub</th></tr>
  <tr><td>Là gì</td><td>Một phần mềm quản lý phiên bản</td><td>Một trang web lưu kho Git + công cụ làm việc nhóm</td></tr>
  <tr><td>Chạy ở đâu</td><td>Trên máy bạn, trong thư mục ẩn <code>.git/</code></td><td>Trên máy chủ của GitHub; bạn dùng qua trình duyệt hoặc <code>git push</code> / <code>git pull</code></td></tr>
  <tr><td>Cần mạng, cần tài khoản?</td><td>Không cần gì</td><td>Cần cả hai</td></tr>
  <tr><td>Ai làm ra</td><td>Linus Torvalds, tháng 4/2005; Junio Hamano bảo trì từ tháng 7/2005</td><td>Bốn nhà sáng lập, ra mắt tháng 4/2008; thuộc Microsoft từ 2018</td></tr>
  <tr><td>Giá</td><td>Miễn phí, mã nguồn mở</td><td>Có gói miễn phí; sinh viên có thêm ưu đãi (Chương 15)</td></tr>
  <tr><td>Thay thế được bằng</td><td>Gần như không — Git đang thống trị</td><td>GitLab, Bitbucket, Gitea… đều dùng Git bên dưới</td></tr>
</table>
<div class="callout warn"><strong>Hiểu lầm số 1 của người mới: “Git = GitHub”.</strong> Nó sinh ra những câu như “GitHub sập nên mình không commit được” (được chứ — commit nằm trên máy bạn), “mình lỡ xoá repo trên GitHub nên mất hết code” (bản trên laptop vẫn nguyên), hay “phải có tài khoản mới dùng được Git” (không cần). Hãy tách bạch hai thứ: Chương 1–4 là Git thuần tuý trên máy bạn, GitHub bước vào từ Chương 5.</div>

<h3>Git ra đời thế nào — một câu chuyện có thật</h3>
${slide('git-00', 21, 'Dòng thời gian: từ email vá lỗi tới 180 triệu lập trình viên')}
<p><strong>Trước khi có Git.</strong> Từ 1991 tới 2002, nhân Linux — trái tim của điện thoại Android, của đa số máy chủ web và nhiều siêu máy tính — được phát triển bằng cách gửi qua lại các bản vá (patch) trong email và các file nén. Nhiều nhóm khác thời đó dùng CVS hay Subversion (SVN), những công cụ giữ lịch sử trên <em>một máy chủ trung tâm</em>: máy chủ sập thì không ai lưu được phiên bản nào; máy chủ mất thì mất luôn lịch sử.</p>
<p><strong>2002 — BitKeeper.</strong> Dự án nhân Linux chuyển sang BitKeeper, một công cụ thương mại, phân tán, mà công ty làm ra nó cho cộng đồng Linux dùng miễn phí. Nó chạy tốt, nhưng mã nguồn của chính công cụ thì đóng.</p>
<p><strong>Đầu 2005 — đổ vỡ.</strong> Quan hệ giữa hai bên rạn nứt. BitMover, công ty đứng sau BitKeeper, phản đối việc Andrew Tridgell (một lập trình viên mã nguồn mở nổi tiếng) viết công cụ đọc dữ liệu của BitKeeper, và tháng 4/2005 tuyên bố ngừng cung cấp bản miễn phí. Linus Torvalds, cha đẻ của Linux, sau này kể ông đã mất nhiều tuần cố hoà giải trước khi quyết định không thể tiếp tục dùng nó. Không công cụ miễn phí nào thời đó đủ nhanh và đủ phân tán cho một dự án cỡ Linux. Thế là ông tự viết.</p>
<p><strong>Tháng 4/2005 — khoảng mười ngày.</strong> Việc bắt đầu ngày 3/4/2005. Linus công bố dự án ngày 6/4, và tới ngày 7/4 Git đã tự lưu được mã nguồn của chính nó — gọi là “self-hosting” (tự lưu chính mình). Commit đầu tiên trong lịch sử của Git, hôm nay vẫn xem được trên GitHub, có lời nhắn <code>Initial revision of "git", the information manager from hell</code> (tạm dịch: “bản đầu tiên của git, trình quản lý thông tin đến từ địa ngục”). Trong một cuộc phỏng vấn năm 2015, Linus nói Git thành hình trong “khoảng mười ngày”, tới lúc đó ông đã commit nhân Linux bằng chính nó. Ngày 18/4 có lần merge nhiều nhánh đầu tiên, và ngày 16/6/2005 bản phát hành Linux 2.6.12 được quản lý bằng Git.</p>
<p><strong>Tháng 7/2005 — trao tay.</strong> Ngày 26/7/2005 Linus giao việc bảo trì cho <strong>Junio Hamano</strong>, người tới giờ vẫn là người bảo trì Git. Bản 1.0 ra ngày 21/12/2005.</p>
<p><strong>Cái tên.</strong> Trong tiếng lóng Anh, “git” là từ chê một người khó ưa, cứng đầu. Linus đùa rằng ông đặt tên mọi dự án theo chính mình — trước là Linux, giờ là git. File README đầu tiên còn đưa thêm vài cách hiểu tuỳ tâm trạng: “the stupid content tracker” (trình theo dõi nội dung ngốc nghếch), hay “global information tracker” (trình theo dõi thông tin toàn cầu) những hôm nó chạy ngon.</p>

<h3>Vì sao nó ra đời — năm mục tiêu thiết kế</h3>
${slide('git-00', 22, 'Vì sao Git ra đời: BitKeeper đổ vỡ → mục tiêu thiết kế')}
<p>Sách Pro Git liệt kê những mục tiêu Linus đặt cho hệ thống mới. Mỗi mục tiêu tới nay vẫn quyết định cách bạn dùng Git:</p>
<table>
  <tr><th>Mục tiêu</th><th>Với bạn, nó nghĩa là</th></tr>
  <tr><td><strong>Nhanh</strong> (speed)</td><td>Commit, đổi nhánh, xem lịch sử: thường tức thì, vì mọi thứ diễn ra ngay trên ổ đĩa của bạn.</td></tr>
  <tr><td><strong>Thiết kế đơn giản</strong> (simple design)</td><td>Bên dưới, Git chỉ là ảnh chụp cộng con trỏ. Chương 1 dạy mô hình đó; Chương 9 mở <code>.git/</code> cho bạn tận mắt thấy.</td></tr>
  <tr><td><strong>Hỗ trợ mạnh phát triển song song</strong> (hàng nghìn nhánh cùng lúc)</td><td>Năm sinh viên mỗi người làm trên nhánh riêng cùng một lúc rồi gộp lại sau. Tạo nhánh gần như không tốn gì.</td></tr>
  <tr><td><strong>Phân tán hoàn toàn</strong> (fully distributed)</td><td>Mỗi bản clone là một bản sao lưu đầy đủ lịch sử. Bạn commit được trên xe buýt không có Wi-Fi.</td></tr>
  <tr><td><strong>Xử lý tốt dự án lớn</strong></td><td>Cùng một công cụ chạy được đồ án của bạn lẫn nhân Linux.</td></tr>
</table>
<p>Và một mục tiêu nữa xuyên suốt tất cả: <strong>toàn vẹn dữ liệu</strong>. Mỗi phiên bản được đặt tên bằng mã băm của chính nội dung nó, nên chỉ cần một bit trong lịch sử bị sửa lén là mã băm không còn khớp. Đó là lý do commit có tên kiểu <code>cf119fa</code> chứ không phải “bản 3”.</p>

<h3>GitHub: từ 2008 tới 180 triệu lập trình viên</h3>
<p>GitHub ra mắt tháng 4/2008, do bốn người sáng lập (Tom Preston-Werner, Chris Wanstrath, P. J. Hyett và Scott Chacon — Scott cũng là tác giả cuốn sách Pro Git). Nó làm cho Git dễ chia sẻ: mỗi dự án một địa chỉ web, mỗi commit một trang dễ đọc, và — tính năng “ăn tiền” nhất — pull request. Ngày 4/6/2018 Microsoft công bố mua GitHub với giá 7,5 tỷ USD trả bằng cổ phiếu Microsoft; thương vụ hoàn tất ngày 26/10/2018.</p>
<p>Theo báo cáo Octoverse 2025 của GitHub (đăng 28/10/2025), hơn <strong>180 triệu lập trình viên</strong> đang làm việc trên GitHub, hơn 36 triệu người mới tham gia trong một năm — trung bình mỗi giây hơn một người — và nền tảng này chứa <strong>630 triệu kho mã</strong>. Riêng năm 2025, lập trình viên đã đẩy lên gần 1 tỷ commit và trung bình mỗi tháng gộp 43,2 triệu pull request.</p>

<h3>Git dùng để làm gì</h3>
${slide('git-00', 24, 'Git dùng để làm gì — tám việc, tám chương')}
<table>
  <tr><th>Việc</th><th>Nói nôm na</th><th>Học ở</th></tr>
  <tr><td>Lưu lịch sử</td><td>Mỗi commit là một ảnh chụp cả dự án, giữ mãi</td><td>Ch 1</td></tr>
  <tr><td>Quay về bản chạy được</td><td>Hoàn tác một thay đổi hỏng mà không phá lịch sử</td><td>Ch 4</td></tr>
  <tr><td>Làm song song bằng nhánh</td><td>4–5 người cùng sửa một dự án mà không giẫm chân nhau</td><td>Ch 3</td></tr>
  <tr><td>Biết ai sửa gì, vì sao</td><td><code>git log</code>, <code>git blame</code>, tìm ra commit nào gây lỗi</td><td>Ch 2</td></tr>
  <tr><td>Review mã (đọc chéo)</td><td>Bạn cùng nhóm đọc pull request của bạn trước khi nó vào <code>main</code></td><td>Ch 6</td></tr>
  <tr><td>CI/CD (tích hợp và triển khai liên tục)</td><td>Mỗi lần push, máy tự chạy test hoặc tự deploy trang web (GitHub Actions)</td><td>Ch 11</td></tr>
  <tr><td>Portfolio xin việc</td><td>Hồ sơ GitHub là bằng chứng bạn làm được sản phẩm</td><td>Ch 15</td></tr>
  <tr><td>Đóng góp mã nguồn mở</td><td>Fork (tách bản) → sửa → gửi pull request vào dự án của người khác</td><td>Ch 5, 15</td></tr>
</table>

<h3>Có thật sự quan trọng không? Nhìn con số</h3>
${slide('git-00', 25, 'Quan trọng tới mức nào? Con số có nguồn')}
<p>Khảo sát lập trình viên của Stack Overflow năm 2022 hỏi mọi người đang dùng hệ quản lý phiên bản nào. <strong>93,87%</strong> người trả lời chọn Git. Trong nhóm lập trình viên chuyên nghiệp, con số là <strong>96,65%</strong>. Ngay cả trong nhóm <em>đang học lập trình</em>, <strong>81,87%</strong> đã dùng Git. Công cụ đứng thứ hai, SVN, chỉ có 5,18%. Nói cách khác: Git không phải một lựa chọn trong nhiều lựa chọn — nó là chuẩn chung, và câu hỏi lúc phỏng vấn không phải “bạn dùng Git chưa?” mà là “bạn dùng Git tốt tới đâu?”.</p>

<h3>Git giúp gì cho chính BẠN</h3>
${slide('git-00', 26, 'Git giúp gì cho bạn — từ năm nhất tới đi làm')}
<div class="kv-grid">
  <div class="kv"><span class="k">Bài tập của riêng bạn</span><span class="v">Chạy được bước nào thì commit bước đó. Nửa đêm một “sửa nhỏ” làm hỏng tất cả, bạn quay về commit tốt gần nhất trong vài giây thay vì bấm Ctrl+Z hai trăm lần.</span></div>
  <div class="kv"><span class="k">SWP391 và các đồ án nhóm</span><span class="v">Bốn, năm người cùng sửa một bộ mã suốt nhiều tuần. Không có Git: gửi file zip qua Zalo, đè mất việc của nhau, cãi nhau. Có Git: một kho chung, mỗi tính năng một nhánh, pull request, và một lịch sử cho thấy công bằng ai đã làm gì.</span></div>
  <div class="kv"><span class="k">Thực tập và phỏng vấn</span><span class="v">Nhà tuyển dụng mở GitHub của bạn ra xem. Câu hỏi phỏng vấn hay gặp: “merge khác rebase thế nào?”, “fetch khác pull?”, “lỡ commit mật khẩu thì làm gì?”, “giải xung đột ra sao?”. Câu nào cũng có lời giải trong khoá này.</span></div>
  <div class="kv"><span class="k">Công việc đầu tiên</span><span class="v">Ngày đầu ở gần như bất kỳ công ty phần mềm nào: “clone kho này về, tạo một nhánh, mở pull request”. Biết Git được coi là đương nhiên, như biết dùng email.</span></div>
  <div class="kv"><span class="k">Mọi thứ khác bạn sẽ học</span><span class="v">Docker, deploy lên máy chủ, GitHub Actions — các khoá khác trên site này đều bắt đầu từ một kho Git.</span></div>
</div>

<h3>Khoá này sẽ đưa bạn đi tới đâu</h3>
${slide('git-00', 4, 'Lộ trình toàn khoá — 17 phần')}
<p>Mười bảy phần: Mục 0 này, rồi Chương 1–4 (mô hình: commit, lịch sử, nhánh, hoàn tác), 5–8 (làm việc nhóm trên GitHub), 9–12 (chiều sâu và tự động hoá), 13 (sách công thức cứu hộ khi có sự cố), và 14–16 (công cụ hằng ngày, hồ sơ GitHub của sinh viên, và một dự án nhóm trọn vẹn kết thúc bằng bài thi cuối khoá 20 câu). Bạn không cần học hết mới làm được đồ án đầu tiên — bài kế tiếp đưa bạn lộ trình tối thiểu một tuần. Bản đồ chi tiết từng chương nằm ở bài 0.1.</p>

<div class="pitfall co-tieu-de"><strong>Người mới hay bắt đầu sai chỗ thế này.</strong> Một bạn tạo tài khoản GitHub, bấm “Upload files” trên trình duyệt để đưa dự án lên mạng, và tin rằng thế là “dùng Git”. Được một hôm. Rồi hai bạn cùng nhóm, mỗi người tải lên bản của riêng mình cho cùng một file. Mỗi lần tải lên thành một commit trên GitHub, nhưng lần thứ hai chỉ đơn giản thay cả file bằng một bản chưa từng chứa phần sửa của người thứ nhất — không có gì được gộp, và phần việc bị mất chỉ lộ ra vài hôm sau dưới dạng “ơ, chỗ mình sửa đâu rồi”. Việc gộp (merge) chỉ xảy ra khi mọi người làm bằng Git trên máy mình và pull trước khi push. Hãy học Git trên máy mình trước (Chương 1–4); GitHub là nơi <em>chia sẻ</em> lịch sử mà Git tạo ra, không phải thứ thay thế Git.</div>

<h3>🧪 Thực hành (10 phút — chắc chắn làm được)</h3>
<div class="callout ok"><ol><li>Mở terminal (Windows: Git Bash; nếu chưa có thì làm bước 2 trước, học xong bài 0.3 quay lại) và chạy <code>git --version</code>. Từ bản 2.30 trở lên là ổn.</li><li>Tạo một tài khoản GitHub miễn phí ở <code>github.com</code>. Chọn tên người dùng mà bạn không ngại cho nhà tuyển dụng xem (ví dụ <code>nguyenvancuong</code>, đừng là <code>xxboy2k6</code>) và dùng email bạn vẫn giữ sau khi ra trường.</li><li>Mở <code>github.com/git/git</code> — bản sao chính thức của mã nguồn Git. Nhìn quanh một lượt: đây là lịch sử thật của chính công cụ bạn sắp học, với hàng chục nghìn commit. Rồi mở thẻ liên kết <em>“Commit đầu tiên của Git”</em> bên dưới — commit <code>e83c516</code>, tác giả Linus Torvalds, ngày 7/4/2005 — đọc lời nhắn và ngày giờ của nó.</li><li>Mở <code>github.com/torvalds/linux</code> và ghi lại hai con số trên trang: bao nhiêu commit, bao nhiêu người đóng góp (contributors).</li><li>Tự viết một câu, bằng lời của bạn, nói Git khác GitHub ở đâu.</li></ol>
<pre><code class="language-bash">git --version</code></pre>
<div class="out">git version 2.51.1</div>
<p>(Output thật trên máy Mac soạn bài, 09/2026 — số phiên bản của bạn có thể khác.)</p>
<p><strong>Đạt khi:</strong> bạn có tài khoản GitHub, đã tận mắt thấy lời nhắn <code>Initial revision of "git", the information manager from hell</code>, đã ghi lại số commit và số người đóng góp của kho Linux, và câu định nghĩa của bạn KHÔNG nói “Git và GitHub là một”.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Git</span><span class="v">Phần mềm quản lý phiên bản phân tán, miễn phí, chạy trên máy bạn.</span></div>
  <div class="kv"><span class="k">GitHub</span><span class="v">Trang web lưu kho Git và thêm công cụ nhóm (pull request, issues, Actions, Pages).</span></div>
  <div class="kv"><span class="k">Version control system (VCS)</span><span class="v">Hệ quản lý phiên bản — công cụ giữ mọi phiên bản của một nhóm file và cho thấy giữa chúng đã đổi gì.</span></div>
  <div class="kv"><span class="k">Commit</span><span class="v">Điểm lưu — một ảnh chụp cả dự án, kèm tác giả, thời điểm và lời nhắn vì sao.</span></div>
  <div class="kv"><span class="k">Repository (repo)</span><span class="v">Kho mã — thư mục dự án cộng toàn bộ lịch sử trong thư mục ẩn <code>.git/</code>.</span></div>
  <div class="kv"><span class="k">Distributed</span><span class="v">Phân tán — mỗi bản sao của kho đều chứa đủ lịch sử, không chỉ file mới nhất.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Git là nút “lưu game” cho cả thư mục dự án: mỗi commit ghi lại đổi gì, ai đổi, lúc nào, vì sao.</li><li>GitHub là trang web giữ bản dùng chung của kho Git và thêm pull request, issues, Actions; GitLab, Bitbucket là các lựa chọn khác.</li><li>Linus Torvalds viết Git tháng 4/2005, trong khoảng mười ngày, sau khi nhân Linux mất quyền dùng miễn phí BitKeeper; Junio Hamano bảo trì Git từ tháng 7/2005.</li><li>Git được thiết kế để nhanh, đơn giản, tạo nhánh dễ, phân tán hoàn toàn và chống sửa lén — những mục tiêu đó giải thích cách bạn dùng nó hôm nay.</li><li>93,87% người trả lời khảo sát Stack Overflow 2022 dùng Git; GitHub có hơn 180 triệu lập trình viên — Git là chuẩn chung bạn sẽ gặp ở SWP391, lúc thực tập và ở mọi công việc.</li></ul>

<a class="link-card" href="https://git-scm.com/book/en/v2/Getting-Started-A-Short-History-of-Git" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 1.2 — Lược sử Git (tiếng Anh)</span><span class="lc-sub">BitKeeper, năm 2005 và các mục tiêu thiết kế, từ cuốn sách chính thức.</span></span>
</a>
<a class="link-card" href="https://www.linuxfoundation.org/blog/blog/10-years-of-git-an-interview-with-git-creator-linus-torvalds" target="_blank" rel="noopener">
  <span class="lc-ico">🎙️</span>
  <span class="lc-body"><span class="lc-title">10 năm Git: phỏng vấn Linus Torvalds (2015)</span><span class="lc-sub">“Khoảng mười ngày”, tự lưu chính mình sau một ngày, và vì sao ông thôi dùng BitKeeper — lời chính ông kể.</span></span>
</a>
<a class="link-card" href="https://github.com/git/git/commit/e83c5163316f89bfbde7d9ab23ca2e25604af290" target="_blank" rel="noopener">
  <span class="lc-ico">🥇</span>
  <span class="lc-body"><span class="lc-title">Commit đầu tiên của Git, 7/4/2005</span><span class="lc-sub">“Initial revision of git, the information manager from hell” — mở ra cho bài thực hành phía trên.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Git" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Wikipedia — Git</span><span class="lc-sub">Các mốc năm 2005 (3/4, 7/4, 16/6, 26/7, 21/12) và chuyện cái tên.</span></span>
</a>
<a class="link-card" href="https://github.blog/news-insights/company-news/github-microsoft/" target="_blank" rel="noopener">
  <span class="lc-ico">🤝</span>
  <span class="lc-body"><span class="lc-title">GitHub Blog — GitHub + Microsoft (4/6/2018)</span><span class="lc-sub">Thông báo thương vụ từ chính GitHub.</span></span>
</a>
<a class="link-card" href="https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">GitHub Octoverse 2025</span><span class="lc-sub">180 triệu+ lập trình viên, 630 triệu kho mã, gần 1 tỷ commit trong năm 2025.</span></span>
</a>
<a class="link-card" href="https://survey.stackoverflow.co/2022/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Stack Overflow Developer Survey 2022</span><span class="lc-sub">Mục “Version control”: Git 93,87% mọi người trả lời, 96,65% lập trình viên chuyên nghiệp.</span></span>
</a>
<p class="note-ct"><strong>Bài kế tiếp:</strong> “Bắt đầu tại đây” phần 2 — những sự cố có thật khi thiếu lưới an toàn, những tình huống nhóm sinh viên gặp mỗi học kỳ, và một kế hoạch học giúp bạn đi tới cùng.</p>
</div>
`,
    },

    /* ─────────────────── 0.6 · BẮT ĐẦU TẠI ĐÂY (2/2) ─────────────────── */
    {
      title: 'Start here (2/2) — Life without Git: real disasters and learning Git without quitting|||Bắt đầu tại đây (2/2) — Khi không có Git: những sự cố thật, và cách học Git mà không bỏ cuộc',
      slug: 'git-0-6-bat-dau-khi-khong-co-git',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bốn sự cố có thật đã kiểm nguồn (Toy Story 2, GitLab 2017, Uber 2016, 28,65 triệu bí mật lộ trên GitHub năm 2025), sáu tình huống điển hình của nhóm đồ án sinh viên, vì sao người mới hay bỏ Git, bảy lời khuyên để học không nản, lộ trình tối thiểu một tuần và nhịp một buổi học.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>Life without Git — and how to learn it without giving up</h2>
<p class="lead">In the previous lesson you met Git and GitHub. This one answers the two questions every beginner quietly asks: "Is it really that bad without it?" and "Will I be able to learn this, or will I quit after three days like last time?" First the stories — some real and documented, some so typical of student teams that you have probably lived one already. Then a plan.</p>

<h3>One week of a team project without Git</h3>
${slide('git-00', 23, 'Trước Git · Sau Git — một tuần đồ án nhóm')}
<p><em>(An illustrative scenario, not a real team.)</em> Monday: An sends <code>src.zip</code> to the group chat. Tuesday: Bình unzips it, works all day on the booking page, and sends <code>src-binh.zip</code>. Meanwhile An has fixed the login bug in her own copy. Wednesday: Chi unzips Bình's zip on top of her folder — An's login fix is gone, and nobody notices until the demo on Friday, when the login bug is back. Thursday night: someone "just cleans up the code a bit", the app stops starting, and the folder now contains <code>do-an-final-v3-sua-lan-cuoi.zip</code>, <code>do-an-final-v3-sua-lan-cuoi(1).zip</code> and <code>do-an-THAT-SU-CUOI.zip</code>. Which one worked on Tuesday? Nobody knows.</p>
<p>Now the same week with Git: each person works on a branch, Git merges the changes and only asks about lines that really overlap, every version has an author and a message, and "the version that worked on Tuesday" is one <code>git log</code> away. That difference is what the rest of this course is about.</p>

<h3>Real incidents — checked against their sources</h3>
${slide('git-00', 27, 'Bốn chuyện có thật — đã kiểm nguồn')}
<p>Four stories that really happened, each with a link to its source at the end of the lesson. Read them for the <em>lesson</em>, not the drama — and notice that not all of them are problems Git solves on its own.</p>
<div class="callout warn"><strong>🎬 Toy Story 2 almost deleted (Pixar, 1998).</strong><br><strong>What happened:</strong> someone ran the command <code>/bin/rm -r -f *</code> on the root folder of the film's files. About 90% of two years of work vanished — and it turned out the backups had not been working for about a month.<br><strong>How it ended:</strong> technical director Galyn Susman, working from home to care for her newborn, had a copy of the film on her home computer. Almost everything was recovered except a few recent days of work.<br><strong>The lesson for you:</strong> a copy on only one machine is a copy waiting to die, and a backup you never tested is not a backup. Git's "every clone is a full copy" design gives you exactly what saved Pixar — the history lives on your laptop, on GitHub, and on every teammate's machine. <strong>Learn it in:</strong> Chapter 5 (remotes: <code>push</code> is your off-site copy).</div>
<div class="callout warn"><strong>🗄️ GitLab.com loses six hours of data (31 January 2017).</strong><br><strong>What happened:</strong> during a late-night fight against database overload, an engineer wiped the PostgreSQL data directory believing he was on the secondary server — it was the primary. Several backup methods turned out not to be working.<br><strong>Consequence:</strong> the site was down for about 18 hours and roughly 6 hours of database changes were lost — around 5,000 projects, 5,000 comments and 700 new user accounts, restored from a snapshot taken 6 hours earlier.<br><strong>The lesson for you — read carefully:</strong> this was a <em>database</em> disaster, not a Git one. GitLab's own report says the code repositories were not affected by the data loss. <strong>Git does not back up your database.</strong> Your SWP391 project's code can live safely in Git, but the rows in your MySQL/SQL Server/PostgreSQL database need their own backup (a dump), tested by actually restoring it. <strong>Learn it in:</strong> not a Git chapter — keep it as a warning about what Git is <em>not</em>.</div>
<div class="callout danger"><strong>🔑 Uber, 2016: a key in a private repository.</strong><br><strong>What happened:</strong> according to the US Federal Trade Commission, an access key to Uber's Amazon cloud storage had been posted, in plain text, in a <em>private</em> GitHub repository. Attackers got into that repository, used the key, and downloaded personal data — including 25.6 million names and email addresses. Uber paid the attackers 100,000 USD through its bug bounty program.<br><strong>The lesson for you:</strong> "private" is not "safe". A password, API key or <code>.env</code> file committed once stays in the history even if you delete it in the next commit. <strong>Learn it in:</strong> Chapter 1.5 (<code>.gitignore</code>), Chapter 8 (removing a secret from all history), Chapter 11 (secret scanning), Chapter 13 (rescue).</div>
<div class="callout danger"><strong>📈 28.65 million secrets in one year (GitGuardian, March 2026).</strong><br><strong>What happened:</strong> the security company GitGuardian scans public GitHub commits. Its State of Secrets Sprawl 2026 report counted <strong>28.65 million</strong> new hard-coded secrets (keys, passwords, tokens) added to public GitHub commits in 2025 — up 34% from the year before. More than 64% of the secrets it confirmed as valid in 2022 were <em>still valid</em> in January 2026.<br><strong>The lesson for you:</strong> leaking a key is common; <em>not revoking it</em> is the real disaster. If you push a key, the first move is to revoke/rotate it at the provider, then clean the history. <strong>Learn it in:</strong> Chapter 8 and Chapter 13.</div>

<h3>Illustrative situations — probably your team</h3>
${slide('git-00', 28, 'Tình huống minh hoạ — rất có thể là nhóm bạn')}
<p>These six are <em>illustrations</em>, not reports of real events — but ask any senior student and they will tell you a version of each one.</p>
<table>
  <tr><th>Situation</th><th>What it costs</th><th>How Git (used properly) prevents it</th><th>Chapter</th></tr>
  <tr><td><code>do-an-final-final-v3-sua-lan-cuoi.zip</code></td><td>Seven zips, nobody dares delete any, nobody knows which one works</td><td>One folder, many commits, each with a message; <code>git log</code> shows which is which</td><td>Ch 1–2</td></tr>
  <tr><td>Two friends send files over Zalo and overwrite each other</td><td>Two days of An's code gone</td><td>Branches + merge: both sets of changes are kept, Git only asks about true overlaps</td><td>Ch 3</td></tr>
  <tr><td>Hard drive dies the night before the deadline</td><td>Everything that lived only on that laptop</td><td>Commit and <code>git push</code> every day; the history is also on GitHub and on teammates' machines</td><td>Ch 5</td></tr>
  <tr><td>"I only changed a little" — and the app no longer runs</td><td>Hours of guessing which edit broke it</td><td><code>git diff</code> shows exactly what changed; <code>git restore</code> / <code>git revert</code> go back</td><td>Ch 1, 4</td></tr>
  <tr><td>A dispute about who did what, when grades are given</td><td>You cannot prove your part</td><td>Every commit carries your name and date; pull requests show your reviews</td><td>Ch 6, 16</td></tr>
  <tr><td>The database password is pushed to a public repo</td><td>Anyone can read (or wipe) your database</td><td><code>.env</code> in <code>.gitignore</code> from day one; if leaked, change the password first</td><td>Ch 1.5, 8, 13</td></tr>
</table>

<div class="pitfall co-tieu-de"><strong>Do not learn the wrong lesson from these stories.</strong> Two traps. First: "Git is a backup tool, so I am safe." Git protects what you <em>commit and push</em>; files you never committed, and your database, are not protected at all. Second: "Our repository is private, so secrets are fine in it." Uber's key was in a private repository. Private means fewer people can see it today — not that it is a safe. Commit often, push daily, keep secrets out of Git entirely.</div>

<h3>Why beginners give up on Git</h3>
${slide('git-00', 29, 'Vì sao người mới hay bỏ Git — và cách chữa')}
<p>If you tried Git before and gave up, you are in large company. It is rarely a lack of intelligence. It is usually one of these:</p>
<ul>
  <li><strong>English jargon everywhere.</strong> Staging, HEAD, detached, upstream, rebase, fast-forward — ten new words before your first commit. <em>Fix in this course:</em> every term gets its meaning right next to it, and every lesson ends with a 🗂 glossary.</li>
  <li><strong>Fear of breaking the team's repository.</strong> So you never experiment, so you never learn. <em>Fix:</em> the scratch repository <code>thu-git</code> from lesson 0.4 — break it on purpose, it costs nothing.</li>
  <li><strong>Learning commands as isolated recipes.</strong> You memorise <code>git pull</code> without knowing what it does, and the first time the recipe does not match the situation, you are stuck. <em>Fix:</em> Chapter 1 teaches the model — snapshots plus pointers — and every later command is explained in terms of it.</li>
  <li><strong>The first conflict.</strong> The screen fills with <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>, it is 11 p.m., and it feels like the project is broken. <em>Fix:</em> in Chapter 3 you create conflicts on purpose in the playground, so the real one looks familiar.</li>
  <li><strong>Believing one mistake loses everything.</strong> <em>Fix:</em> anything that was committed can almost always be brought back with <code>git reflog</code> (Chapter 4). Knowing this lowers your stress more than any command.</li>
</ul>

<h3>Seven pieces of advice that keep you going</h3>
<ol>
  <li><strong>Learn the model before the commands.</strong> Chapter 1 first, even if you are in a hurry. Fifteen commands that you understand beat a hundred that you copied.</li>
  <li><strong>Run <code>git status</code> constantly.</strong> Before and after every command. It tells you which branch you are on, what changed, and very often which command to run next.</li>
  <li><strong>Practise in a scratch repository, never in the team project.</strong> Break things on purpose; that is how you learn how to fix them.</li>
  <li><strong>Remember: committed is (almost) never lost.</strong> Commit small and often on your own branch. Each commit is a save point <code>reflog</code> can find again.</li>
  <li><strong>Read the error message to the end.</strong> Git's messages are long because they are helpful. Two real examples below.</li>
  <li><strong>Use the 🗂 box.</strong> When a word blocks you, look it up in the glossary of the lesson before reading on. One minute now saves ten minutes of confusion.</li>
  <li><strong>Ask for help the right way.</strong> Paste the exact command, the full output, and the result of <code>git status</code>, and say what you expected. "Git is broken, help" gets no useful answer; those three things usually get a fix in minutes.</li>
</ol>
<p>Real output from git 2.51 — a typo, and a push before any remote exists. In both cases Git tells you what to do:</p>
<pre><code class="language-bash">git stauts
git push</code></pre>
<div class="out">git: 'stauts' is not a git command. See 'git --help'.

The most similar command is
	status
fatal: No configured push destination.
Either specify the URL from the command-line or configure a remote repository using

    git remote add &lt;name&gt; &lt;url&gt;

and then push using the remote name

    git push &lt;name&gt;</div>

<h3>A minimum route and a full route</h3>
${slide('git-00', 30, 'Lộ trình: tối thiểu 1 tuần · đầy đủ vài tuần')}
<p><strong>Minimum route — enough for a team project, about one week (5 sittings of about an hour):</strong></p>
<table>
  <tr><th>Sitting</th><th>Study</th><th>You can then…</th></tr>
  <tr><td>1</td><td>Section 0 (these two lessons + 0.3 setup + 0.4 playground)</td><td>run Git, have a GitHub account and an SSH key</td></tr>
  <tr><td>2</td><td>Chapter 1 — the model and the daily loop</td><td>commit with good messages, use <code>.gitignore</code></td></tr>
  <tr><td>3</td><td>Chapter 3 — branches and merging</td><td>work on a branch, merge, resolve a conflict</td></tr>
  <tr><td>4</td><td>Chapter 5 — remotes and GitHub</td><td>clone, push, pull, work with the team repository</td></tr>
  <tr><td>5</td><td>Chapter 6 — pull requests and review</td><td>open a pull request and review a teammate's</td></tr>
</table>
<p><strong>Full route:</strong> all 17 parts, about one chapter per sitting, in order for Chapters 1–4, then as the table in lesson 0.4 suggests. When your project deadline has passed, come back for Chapter 2 (reading history), Chapter 4 (undo) and Chapter 7 (team workflow) — they will make much more sense after you have used Git for real. Chapter 13 can be opened in the middle of any emergency.</p>

<h3>The rhythm of one sitting, and milestones to celebrate</h3>
${slide('git-00', 31, 'Nhịp một buổi học và các mốc “mình làm được”')}
<p>About an hour: <strong>look at the slides</strong> (5 minutes — get the picture), <strong>read the lesson</strong> (about 20 minutes), <strong>type the commands yourself</strong> in <code>thu-git</code> (do not copy-paste; your fingers need to learn too), do the <strong>🧪 practice</strong> (15–20 minutes), and at the end of each chapter take the <strong>10-question quiz</strong>. Stop while you still feel like continuing — tomorrow's sitting will be easier.</p>
<p>Mark these milestones when you reach them. Each one is a real skill that many working developers do not have:</p>
<ul>
  <li><strong>Milestone 1:</strong> your first commit — <code>git log</code> shows your name.</li>
  <li><strong>Milestone 2:</strong> you create and resolve a conflict on your own — the word CONFLICT no longer scares you.</li>
  <li><strong>Milestone 3:</strong> you push to GitHub and open your first pull request.</li>
  <li><strong>Milestone 4:</strong> you bring back a "lost" commit with <code>reflog</code> — from here on, Git is no longer frightening.</li>
</ul>

<h3>🧪 Practice (10 minutes — your first commit, today)</h3>
<div class="callout ok"><ol><li>Make a scratch folder that is <strong>not</strong> your team project: <code>mkdir ~/ke-hoach-hoc &amp;&amp; cd ~/ke-hoach-hoc &amp;&amp; git init</code>. (If Git is not installed yet, do lesson 0.3 first; if Git asks "Please tell me who you are", run the two <code>git config --global</code> lines from lesson 0.3 and try again.)</li><li>Create <code>ke-hoach.md</code> with your study plan: which route (minimum or full), which days of the week, how long each sitting. Three lines is enough.</li><li>Run <code>git status</code> and read what it says — notice it tells you the next command (<code>git add</code>).</li><li>Commit the plan, then add one more line "Milestone 1: first commit — DONE" and commit again.</li><li>Run <code>git log --oneline</code>. You are looking at your own history.</li></ol>
<pre><code class="language-bash">mkdir ~/ke-hoach-hoc &amp;&amp; cd ~/ke-hoach-hoc &amp;&amp; git init
printf <span class="tok-string">'# Kế hoạch học Git\\nLộ trình: Mục 0 → Ch1 → Ch3 → Ch5 → Ch6\\nBuổi học: tối T3, T5, T7 — 45 phút\\n'</span> &gt; ke-hoach.md
git status
git add ke-hoach.md
git commit -m <span class="tok-string">"Thêm kế hoạch học Git"</span>
printf <span class="tok-string">'Mốc 1: tạo commit đầu tiên — XONG\\n'</span> &gt;&gt; ke-hoach.md
git commit -am <span class="tok-string">"Đánh dấu mốc 1: commit đầu tiên"</span>
git log --oneline</code></pre>
<div class="out">Initialized empty Git repository in …/ke-hoach-hoc/.git/
On branch main

No commits yet

Untracked files:
  (use "git add &lt;file&gt;..." to include in what will be committed)
	ke-hoach.md

nothing added to commit but untracked files present (use "git add" to track)
[main (root-commit) cf119fa] Thêm kế hoạch học Git
 1 file changed, 3 insertions(+)
 create mode 100644 ke-hoach.md
[main c466a83] Đánh dấu mốc 1: commit đầu tiên
 1 file changed, 1 insertion(+)
c466a83 Đánh dấu mốc 1: commit đầu tiên
cf119fa Thêm kế hoạch học Git</div>
<p>(Real output from git 2.51.1; the long folder path in the first line is cut to <code>…</code>. Your hashes will differ. If your first branch is called <code>master</code> instead of <code>main</code>, that is fine — lesson 0.3 shows how to change the default.)</p>
<p><strong>Done when:</strong> <code>git log --oneline</code> shows two commits written by you, <code>git status</code> says "nothing to commit, working tree clean", and your plan names a route and at least three study days. That is milestone 1 — congratulations.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Backup</span><span class="v">A separate copy you can restore from. Git protects committed and pushed code — not databases, not uncommitted files.</span></div>
  <div class="kv"><span class="k">Secret</span><span class="v">A password, API key or token. It must never be committed, even to a private repository.</span></div>
  <div class="kv"><span class="k">Revoke / rotate</span><span class="v">Cancel a leaked key and issue a new one — the first thing to do after a leak, before cleaning history.</span></div>
  <div class="kv"><span class="k">Conflict</span><span class="v">Two changes to the same lines that Git cannot combine by itself and asks you to decide.</span></div>
  <div class="kv"><span class="k">Scratch repository</span><span class="v">A throwaway repository (<code>thu-git</code>, <code>ke-hoach-hoc</code>) where breaking things is safe.</span></div>
  <div class="kv"><span class="k">Working tree clean</span><span class="v">Git's way of saying every change is committed — nothing waiting.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Pixar's Toy Story 2 survived only because one copy lived on another machine — Git gives every teammate a full copy by design.</li><li>GitLab's 2017 outage lost database data, not Git repositories: Git does not back up your database.</li><li>Uber's 2016 breach started from a key in a <em>private</em> GitHub repository, and 28.65 million secrets hit public GitHub in 2025: never commit secrets, and revoke first if you do.</li><li>People quit Git because of jargon, fear and memorised recipes; learning the model, practising in a scratch repository and knowing that commits are recoverable fixes all three.</li><li>Minimum route for a team project: Section 0 → Ch 1 → Ch 3 → Ch 5 → Ch 6 in about a week; one sitting = slides, lesson, typing, practice, quiz.</li></ul>

<a class="link-card" href="https://en.wikipedia.org/wiki/Toy_Story_2" target="_blank" rel="noopener">
  <span class="lc-ico">🎬</span>
  <span class="lc-body"><span class="lc-title">Wikipedia — Toy Story 2 (Production)</span><span class="lc-sub">The 1998 deletion, the broken backups, and Galyn Susman's home copy.</span></span>
</a>
<a class="link-card" href="https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">GitLab — Postmortem of database outage of January 31 (2017)</span><span class="lc-sub">GitLab's own report: what was lost, what was not, and which backups failed.</span></span>
</a>
<a class="link-card" href="https://www.ftc.gov/business-guidance/blog/2018/04/ftc-addresses-ubers-undisclosed-data-breach-new-proposed-order" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">FTC — Uber's undisclosed 2016 data breach</span><span class="lc-sub">The access key in a private GitHub repository, and what was taken.</span></span>
</a>
<a class="link-card" href="https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">GitGuardian — The State of Secrets Sprawl 2026</span><span class="lc-sub">28.65 million new secrets on public GitHub in 2025, and how long they stay valid.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/book/en/v2" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git — the free official book</span><span class="lc-sub">Your reference beside this course; chapters 1–3 match our Chapters 1–3.</span></span>
</a>
<p class="note-ct"><strong>Next:</strong> lesson 0.0 has every Section 0 slide in one place, and lesson 0.1 shows the full map of the course. If you already did the practice above, you have already made your first commit — the rest is building on it.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Khi không có Git — và cách học nó mà không bỏ cuộc</h2>
<p class="lead">Bài trước bạn đã làm quen với Git và GitHub. Bài này trả lời hai câu hỏi mà người mới nào cũng thầm hỏi: “Không có nó thì tệ tới vậy thật à?” và “Liệu mình có học nổi không, hay lại bỏ sau ba ngày như lần trước?”. Trước hết là những câu chuyện — có chuyện có thật, có ghi chép rõ ràng; có chuyện điển hình tới mức rất có thể bạn đã trải qua một lần. Sau đó là một kế hoạch.</p>

<h3>Một tuần đồ án nhóm không có Git</h3>
${slide('git-00', 23, 'Trước Git · Sau Git — một tuần đồ án nhóm')}
<p><em>(Tình huống minh hoạ, không phải một nhóm có thật.)</em> Thứ Hai: An gửi <code>src.zip</code> vào nhóm Zalo. Thứ Ba: Bình giải nén, làm cả ngày trang đặt lịch, rồi gửi <code>src-binh.zip</code>. Trong lúc đó An đã sửa lỗi đăng nhập trên bản của mình. Thứ Tư: Chi giải nén file của Bình đè lên thư mục của Chi — bản sửa lỗi đăng nhập của An biến mất, và không ai để ý cho tới buổi demo thứ Sáu, khi lỗi đăng nhập quay lại. Tối thứ Năm: một bạn “dọn code một chút thôi”, app không chạy nữa, và thư mục giờ có <code>do-an-final-v3-sua-lan-cuoi.zip</code>, <code>do-an-final-v3-sua-lan-cuoi(1).zip</code> và <code>do-an-THAT-SU-CUOI.zip</code>. Bản nào chạy được hôm thứ Ba? Không ai biết.</p>
<p>Giờ cùng tuần đó mà có Git: mỗi người làm trên một nhánh, Git tự gộp thay đổi và chỉ hỏi ở những dòng thật sự trùng nhau, mỗi phiên bản có tên người làm và lời nhắn, còn “bản chạy được hôm thứ Ba” chỉ cách bạn một lệnh <code>git log</code>. Khoảng cách giữa hai tuần đó chính là nội dung của cả khoá này.</p>

<h3>Những sự cố có thật — đã đối chiếu nguồn</h3>
${slide('git-00', 27, 'Bốn chuyện có thật — đã kiểm nguồn')}
<p>Bốn chuyện đã thật sự xảy ra, mỗi chuyện có link nguồn ở cuối bài. Hãy đọc để lấy <em>bài học</em>, đừng chỉ đọc cho kịch tính — và để ý rằng không phải chuyện nào Git cũng tự giải quyết được.</p>
<div class="callout warn"><strong>🎬 Toy Story 2 suýt bị xoá sạch (Pixar, 1998).</strong><br><strong>Chuyện gì xảy ra:</strong> một người chạy lệnh <code>/bin/rm -r -f *</code> (xoá tất cả, không hỏi lại) ngay thư mục gốc chứa dữ liệu phim. Khoảng 90% công sức của hai năm biến mất — và lúc đó mới phát hiện hệ thống sao lưu đã không chạy được khoảng một tháng.<br><strong>Kết cục:</strong> đạo diễn kỹ thuật Galyn Susman, đang làm việc ở nhà để chăm con mới sinh, có một bản sao phim trên máy tính ở nhà. Gần như mọi thứ được cứu, chỉ mất vài ngày làm việc gần nhất.<br><strong>Bài học cho bạn:</strong> dữ liệu chỉ nằm trên một máy là dữ liệu đang chờ chết, và bản sao lưu chưa từng thử khôi phục thì chưa phải là bản sao lưu. Thiết kế “mỗi bản clone là một bản sao đầy đủ” của Git cho bạn đúng thứ đã cứu Pixar — lịch sử nằm trên laptop của bạn, trên GitHub, và trên máy từng bạn cùng nhóm. <strong>Học ở:</strong> Chương 5 (remote: <code>push</code> chính là bản sao ngoài máy của bạn).</div>
<div class="callout warn"><strong>🗄️ GitLab.com mất sáu giờ dữ liệu (31/01/2017).</strong><br><strong>Chuyện gì xảy ra:</strong> trong lúc chống quá tải cơ sở dữ liệu lúc nửa đêm, một kỹ sư xoá thư mục dữ liệu PostgreSQL vì tưởng mình đang ở máy phụ — thật ra đó là máy chính. Rồi nhiều cách sao lưu hoá ra không hoạt động.<br><strong>Hậu quả:</strong> trang web ngừng khoảng 18 giờ và khoảng 6 giờ thay đổi trong cơ sở dữ liệu bị mất — chừng 5.000 project, 5.000 bình luận và 700 tài khoản mới — phải khôi phục từ một bản chụp làm 6 tiếng trước đó.<br><strong>Bài học cho bạn — đọc kỹ:</strong> đây là thảm hoạ <em>cơ sở dữ liệu</em>, không phải thảm hoạ Git. Chính báo cáo của GitLab ghi rằng các kho mã không bị mất dữ liệu. <strong>Git không sao lưu cơ sở dữ liệu của bạn.</strong> Mã nguồn đồ án SWP391 nằm an toàn trong Git, nhưng dữ liệu trong MySQL/SQL Server/PostgreSQL cần bản sao lưu riêng (một file dump), và phải thử khôi phục thật mới biết nó dùng được. <strong>Học ở:</strong> không phải một chương Git — hãy giữ nó như lời cảnh báo về thứ Git <em>không</em> làm.</div>
<div class="callout danger"><strong>🔑 Uber, 2016: một chiếc khoá trong kho riêng tư.</strong><br><strong>Chuyện gì xảy ra:</strong> theo Uỷ ban Thương mại Liên bang Mỹ (FTC), một khoá truy cập vào kho lưu trữ đám mây Amazon của Uber đã bị để dạng chữ thường trong một kho GitHub <em>riêng tư</em> (private). Kẻ tấn công vào được kho đó, dùng khoá và tải về dữ liệu cá nhân — trong đó có 25,6 triệu tên kèm địa chỉ email. Uber trả cho kẻ tấn công 100.000 USD qua chương trình thưởng tìm lỗi (bug bounty).<br><strong>Bài học cho bạn:</strong> “riêng tư” không có nghĩa là “an toàn”. Một mật khẩu, khoá API hay file <code>.env</code> đã commit một lần thì vẫn nằm trong lịch sử, kể cả khi bạn xoá nó ở commit sau. <strong>Học ở:</strong> Chương 1.5 (<code>.gitignore</code>), Chương 8 (gỡ bí mật khỏi toàn bộ lịch sử), Chương 11 (quét bí mật), Chương 13 (cứu hộ).</div>
<div class="callout danger"><strong>📈 28,65 triệu bí mật trong một năm (GitGuardian, 03/2026).</strong><br><strong>Chuyện gì xảy ra:</strong> công ty bảo mật GitGuardian quét các commit công khai trên GitHub. Báo cáo State of Secrets Sprawl 2026 của họ đếm được <strong>28,65 triệu</strong> bí mật mới (khoá, mật khẩu, token) bị viết thẳng vào mã và commit lên GitHub công khai trong năm 2025 — tăng 34% so với năm trước. Hơn 64% số bí mật họ xác nhận còn hiệu lực năm 2022 thì tới tháng 1/2026 <em>vẫn còn hiệu lực</em>.<br><strong>Bài học cho bạn:</strong> lỡ lộ khoá là chuyện rất hay gặp; <em>không thu hồi khoá</em> mới là thảm hoạ thật. Lỡ push một khoá lên thì việc đầu tiên là thu hồi/đổi khoá ở nhà cung cấp, rồi mới dọn lịch sử. <strong>Học ở:</strong> Chương 8 và Chương 13.</div>

<h3>Tình huống minh hoạ — rất có thể là nhóm bạn</h3>
${slide('git-00', 28, 'Tình huống minh hoạ — rất có thể là nhóm bạn')}
<p>Sáu tình huống dưới đây là <em>minh hoạ</em>, không phải chuyện có thật được kể lại — nhưng hỏi bất kỳ anh chị khoá trên nào, họ cũng kể cho bạn một phiên bản của từng cái.</p>
<table>
  <tr><th>Tình huống</th><th>Cái giá phải trả</th><th>Git (dùng đúng) chặn nó thế nào</th><th>Chương</th></tr>
  <tr><td><code>do-an-final-final-v3-sua-lan-cuoi.zip</code></td><td>Bảy file zip, không ai dám xoá cái nào, không ai biết cái nào chạy</td><td>Một thư mục, nhiều commit, mỗi cái có lời nhắn; <code>git log</code> cho biết cái nào là cái nào</td><td>Ch 1–2</td></tr>
  <tr><td>Hai bạn gửi file qua Zalo và ghi đè lên nhau</td><td>Mất 2 ngày code của An</td><td>Nhánh + merge: giữ cả hai bộ thay đổi, Git chỉ hỏi chỗ trùng thật</td><td>Ch 3</td></tr>
  <tr><td>Ổ cứng hỏng đêm trước hạn nộp</td><td>Mất mọi thứ chỉ nằm trên laptop đó</td><td>Commit và <code>git push</code> mỗi ngày; lịch sử còn trên GitHub và máy các bạn cùng nhóm</td><td>Ch 5</td></tr>
  <tr><td>“Mình chỉ sửa một chút” — rồi app hết chạy</td><td>Hàng giờ đoán mò chỗ nào làm hỏng</td><td><code>git diff</code> chỉ đúng chỗ đã đổi; <code>git restore</code> / <code>git revert</code> để quay lại</td><td>Ch 1, 4</td></tr>
  <tr><td>Tranh chấp “ai làm phần nào” lúc chấm điểm</td><td>Không chứng minh được phần việc của mình</td><td>Mỗi commit mang tên và ngày của bạn; pull request cho thấy cả việc bạn review</td><td>Ch 6, 16</td></tr>
  <tr><td>Lỡ push mật khẩu CSDL lên repo công khai</td><td>Ai cũng đọc được (hoặc xoá sạch) cơ sở dữ liệu của bạn</td><td><code>.env</code> nằm trong <code>.gitignore</code> từ ngày đầu; lỡ lộ thì đổi mật khẩu trước</td><td>Ch 1.5, 8, 13</td></tr>
</table>

<div class="pitfall co-tieu-de"><strong>Đừng rút ra bài học sai từ những chuyện này.</strong> Có hai cái bẫy. Một: “Git là công cụ sao lưu, vậy là mình an toàn.” Git chỉ bảo vệ những gì bạn đã <em>commit và push</em>; file chưa từng commit, và cơ sở dữ liệu của bạn, thì không được bảo vệ chút nào. Hai: “Repo của nhóm là private, để mật khẩu trong đó cũng được.” Khoá của Uber nằm đúng trong một repo private. Private nghĩa là hôm nay ít người xem được hơn — không có nghĩa nó là két sắt. Hãy commit thường xuyên, push mỗi ngày, và giữ bí mật ra khỏi Git hoàn toàn.</div>

<h3>Vì sao người mới hay bỏ Git</h3>
${slide('git-00', 29, 'Vì sao người mới hay bỏ Git — và cách chữa')}
<p>Nếu bạn từng thử Git rồi bỏ, bạn không hề đơn độc. Hiếm khi là do bạn kém. Thường là do một trong những điều sau:</p>
<ul>
  <li><strong>Thuật ngữ tiếng Anh dày đặc.</strong> Staging, HEAD, detached, upstream, rebase, fast-forward — mười từ mới trước cả commit đầu tiên. <em>Khoá này chữa bằng cách:</em> mỗi thuật ngữ có nghĩa tiếng Việt ngay cạnh, và mỗi bài kết thúc bằng một ô 🗂 thuật ngữ.</li>
  <li><strong>Sợ làm hỏng repo của nhóm.</strong> Nên không dám thử, nên không bao giờ học được. <em>Chữa:</em> kho nháp <code>thu-git</code> ở bài 0.4 — cố tình phá nó đi, chẳng tốn gì.</li>
  <li><strong>Học lệnh như những công thức rời rạc.</strong> Thuộc <code>git pull</code> mà không biết nó làm gì, và lần đầu tiên công thức không khớp tình huống là tắc. <em>Chữa:</em> Chương 1 dạy mô hình — ảnh chụp cộng con trỏ — và mọi lệnh về sau đều được giải thích bằng mô hình đó.</li>
  <li><strong>Lần xung đột (conflict) đầu tiên.</strong> Màn hình đầy <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> và <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>, đồng hồ chỉ 11 giờ đêm, và cảm giác như dự án hỏng rồi. <em>Chữa:</em> ở Chương 3 bạn cố tình tạo xung đột trong sân tập, để tới lúc gặp thật thì nó trông quen thuộc.</li>
  <li><strong>Tin rằng lỡ tay một lần là mất hết.</strong> <em>Chữa:</em> thứ gì đã commit thì gần như luôn lấy lại được bằng <code>git reflog</code> (Chương 4). Biết điều này giúp bạn bớt căng thẳng hơn bất kỳ lệnh nào.</li>
</ul>

<h3>Bảy lời khuyên để học không nản</h3>
<ol>
  <li><strong>Học mô hình trước, lệnh sau.</strong> Chương 1 trước tiên, kể cả khi đang vội. Mười lăm lệnh mà bạn hiểu có giá hơn một trăm lệnh chép lại.</li>
  <li><strong>Chạy <code>git status</code> liên tục.</strong> Trước và sau mỗi lệnh. Nó cho biết bạn đang ở nhánh nào, file nào đã đổi, và rất hay gợi ý luôn lệnh nên chạy tiếp.</li>
  <li><strong>Tập trong kho nháp, không bao giờ tập trong đồ án của nhóm.</strong> Cố tình làm hỏng; đó là cách học sửa.</li>
  <li><strong>Nhớ rằng: đã commit thì (gần như) không bao giờ mất.</strong> Commit nhỏ và thường xuyên trên nhánh của mình. Mỗi commit là một điểm lưu mà <code>reflog</code> tìm lại được.</li>
  <li><strong>Đọc thông báo lỗi tới chữ cuối cùng.</strong> Thông báo của Git dài vì nó muốn giúp. Hai ví dụ thật ngay bên dưới.</li>
  <li><strong>Dùng ô 🗂.</strong> Khi một từ làm bạn khựng lại, tra nó trong ô thuật ngữ của bài trước khi đọc tiếp. Một phút lúc này đỡ mười phút rối về sau.</li>
  <li><strong>Hỏi đúng cách khi bí.</strong> Dán nguyên văn lệnh đã gõ, toàn bộ output, và kết quả <code>git status</code>, rồi nói bạn mong đợi điều gì. Câu “Git bị lỗi, cứu với” không nhận được câu trả lời nào hữu ích; ba thứ kia thường được gỡ trong vài phút.</li>
</ol>
<p>Output thật từ git 2.51 — một lần gõ nhầm, và một lần push khi chưa có remote nào. Cả hai lần Git đều bảo bạn phải làm gì:</p>
<pre><code class="language-bash">git stauts
git push</code></pre>
<div class="out">git: 'stauts' is not a git command. See 'git --help'.

The most similar command is
	status
fatal: No configured push destination.
Either specify the URL from the command-line or configure a remote repository using

    git remote add &lt;name&gt; &lt;url&gt;

and then push using the remote name

    git push &lt;name&gt;</div>
<p>Dòng đầu nói “stauts không phải lệnh git — lệnh giống nhất là <code>status</code>”. Khối sau nói “chưa có nơi nào để push — hãy thêm một remote bằng <code>git remote add</code>”. Bạn chưa cần hiểu remote là gì (Chương 5), chỉ cần thấy: Git không mắng bạn, nó chỉ đường.</p>

<h3>Lộ trình tối thiểu và lộ trình đầy đủ</h3>
${slide('git-00', 30, 'Lộ trình: tối thiểu 1 tuần · đầy đủ vài tuần')}
<p><strong>Lộ trình tối thiểu — đủ dùng cho đồ án nhóm, khoảng một tuần (5 buổi, mỗi buổi chừng một giờ):</strong></p>
<table>
  <tr><th>Buổi</th><th>Học</th><th>Học xong bạn…</th></tr>
  <tr><td>1</td><td>Mục 0 (hai bài này + 0.3 cài đặt + 0.4 sân tập)</td><td>chạy được Git, có tài khoản GitHub và khoá SSH</td></tr>
  <tr><td>2</td><td>Chương 1 — mô hình và vòng lặp hằng ngày</td><td>commit với lời nhắn tử tế, dùng được <code>.gitignore</code></td></tr>
  <tr><td>3</td><td>Chương 3 — nhánh và hợp nhất</td><td>làm việc trên nhánh, merge, giải một xung đột</td></tr>
  <tr><td>4</td><td>Chương 5 — remote và GitHub</td><td>clone, push, pull, làm việc với kho chung của nhóm</td></tr>
  <tr><td>5</td><td>Chương 6 — pull request và review</td><td>mở pull request và review PR của bạn cùng nhóm</td></tr>
</table>
<p><strong>Lộ trình đầy đủ:</strong> cả 17 phần, mỗi buổi khoảng một chương, Chương 1–4 học đúng thứ tự, phần còn lại theo bảng ở bài 0.4. Khi đã qua hạn nộp đồ án, hãy quay lại học Chương 2 (đọc lịch sử), Chương 4 (hoàn tác) và Chương 7 (quy trình nhóm) — lúc đó bạn đã dùng Git thật nên sẽ thấm hơn nhiều. Chương 13 thì mở ra được ngay giữa lúc đang có sự cố.</p>

<h3>Nhịp một buổi học, và những mốc đáng ăn mừng</h3>
${slide('git-00', 31, 'Nhịp một buổi học và các mốc “mình làm được”')}
<p>Khoảng một giờ: <strong>xem slide</strong> (5 phút — nắm hình trước), <strong>đọc bài</strong> (khoảng 20 phút), <strong>tự gõ lại lệnh</strong> trong <code>thu-git</code> (đừng chép-dán; ngón tay cũng cần học), làm <strong>🧪 thực hành</strong> (15–20 phút), và cuối mỗi chương làm <strong>quiz 10 câu</strong>. Dừng lại khi bạn vẫn còn muốn học tiếp — buổi mai sẽ dễ bắt đầu hơn.</p>
<p>Đánh dấu những mốc này khi bạn chạm tới. Mỗi mốc là một kỹ năng thật mà không ít người đi làm rồi vẫn chưa có:</p>
<ul>
  <li><strong>Mốc 1:</strong> commit đầu tiên của đời mình — <code>git log</code> hiện tên bạn.</li>
  <li><strong>Mốc 2:</strong> tự tạo và tự giải một xung đột — chữ CONFLICT hết đáng sợ.</li>
  <li><strong>Mốc 3:</strong> push lên GitHub và mở pull request đầu tiên.</li>
  <li><strong>Mốc 4:</strong> cứu lại một commit “đã mất” bằng <code>reflog</code> — từ đây Git không còn làm bạn sợ nữa.</li>
</ul>

<h3>🧪 Thực hành (10 phút — commit đầu tiên, ngay hôm nay)</h3>
<div class="callout ok"><ol><li>Tạo một thư mục nháp, <strong>không phải</strong> đồ án của nhóm: <code>mkdir ~/ke-hoach-hoc &amp;&amp; cd ~/ke-hoach-hoc &amp;&amp; git init</code>. (Chưa cài Git thì làm bài 0.3 trước; nếu Git hỏi “Please tell me who you are” — hãy cho tôi biết bạn là ai — thì chạy hai dòng <code>git config --global</code> ở bài 0.3 rồi thử lại.)</li><li>Tạo file <code>ke-hoach.md</code> ghi kế hoạch học của bạn: đi lộ trình nào (tối thiểu hay đầy đủ), học những ngày nào trong tuần, mỗi buổi bao lâu. Ba dòng là đủ.</li><li>Chạy <code>git status</code> và đọc nó nói gì — để ý nó chỉ luôn lệnh tiếp theo (<code>git add</code>).</li><li>Commit kế hoạch, rồi thêm một dòng “Mốc 1: tạo commit đầu tiên — XONG” và commit lần nữa.</li><li>Chạy <code>git log --oneline</code>. Bạn đang nhìn lịch sử của chính mình.</li></ol>
<pre><code class="language-bash">mkdir ~/ke-hoach-hoc &amp;&amp; cd ~/ke-hoach-hoc &amp;&amp; git init
printf <span class="tok-string">'# Kế hoạch học Git\\nLộ trình: Mục 0 → Ch1 → Ch3 → Ch5 → Ch6\\nBuổi học: tối T3, T5, T7 — 45 phút\\n'</span> &gt; ke-hoach.md
git status
git add ke-hoach.md
git commit -m <span class="tok-string">"Thêm kế hoạch học Git"</span>
printf <span class="tok-string">'Mốc 1: tạo commit đầu tiên — XONG\\n'</span> &gt;&gt; ke-hoach.md
git commit -am <span class="tok-string">"Đánh dấu mốc 1: commit đầu tiên"</span>
git log --oneline</code></pre>
<div class="out">Initialized empty Git repository in …/ke-hoach-hoc/.git/
On branch main

No commits yet

Untracked files:
  (use "git add &lt;file&gt;..." to include in what will be committed)
	ke-hoach.md

nothing added to commit but untracked files present (use "git add" to track)
[main (root-commit) cf119fa] Thêm kế hoạch học Git
 1 file changed, 3 insertions(+)
 create mode 100644 ke-hoach.md
[main c466a83] Đánh dấu mốc 1: commit đầu tiên
 1 file changed, 1 insertion(+)
c466a83 Đánh dấu mốc 1: commit đầu tiên
cf119fa Thêm kế hoạch học Git</div>
<p>(Output thật từ git 2.51.1; đường dẫn thư mục dài ở dòng đầu được cắt thành <code>…</code>. Mã băm của bạn sẽ khác. Nếu nhánh đầu tiên của bạn tên <code>master</code> thay vì <code>main</code> thì cũng không sao — bài 0.3 chỉ cách đổi mặc định.)</p>
<p><strong>Đạt khi:</strong> <code>git log --oneline</code> hiện hai commit do chính bạn viết, <code>git status</code> báo “nothing to commit, working tree clean” (không còn gì để commit, thư mục sạch), và kế hoạch của bạn có ghi một lộ trình cùng ít nhất ba ngày học. Đó là mốc 1 — chúc mừng bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Backup</span><span class="v">Bản sao lưu — một bản riêng để khôi phục khi cần. Git bảo vệ mã đã commit và push — không bảo vệ cơ sở dữ liệu hay file chưa commit.</span></div>
  <div class="kv"><span class="k">Secret</span><span class="v">Bí mật — mật khẩu, khoá API hay token. Không bao giờ được commit, kể cả vào repo private.</span></div>
  <div class="kv"><span class="k">Revoke / rotate</span><span class="v">Thu hồi / thay khoá — huỷ khoá bị lộ và cấp khoá mới; việc đầu tiên phải làm khi lộ, trước cả dọn lịch sử.</span></div>
  <div class="kv"><span class="k">Conflict</span><span class="v">Xung đột — hai thay đổi trên cùng những dòng mà Git không tự gộp được, nên hỏi bạn chọn.</span></div>
  <div class="kv"><span class="k">Scratch repository</span><span class="v">Kho nháp — kho vứt đi (<code>thu-git</code>, <code>ke-hoach-hoc</code>) nơi làm hỏng không sao cả.</span></div>
  <div class="kv"><span class="k">Working tree clean</span><span class="v">Thư mục làm việc sạch — cách Git nói mọi thay đổi đã được commit, không còn gì chờ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Toy Story 2 của Pixar sống sót chỉ vì còn một bản sao trên máy khác — Git cho mỗi thành viên một bản sao đầy đủ ngay từ thiết kế.</li><li>Sự cố GitLab 2017 mất dữ liệu cơ sở dữ liệu, không mất kho Git: Git không sao lưu cơ sở dữ liệu của bạn.</li><li>Vụ Uber 2016 bắt đầu từ một khoá nằm trong repo GitHub <em>private</em>, và 28,65 triệu bí mật lộ lên GitHub công khai năm 2025: không bao giờ commit bí mật, lỡ lộ thì thu hồi trước.</li><li>Người ta bỏ Git vì thuật ngữ, vì sợ, và vì học thuộc công thức; học mô hình, tập trong kho nháp và biết commit lấy lại được sẽ chữa cả ba.</li><li>Lộ trình tối thiểu cho đồ án: Mục 0 → Ch 1 → Ch 3 → Ch 5 → Ch 6 trong khoảng một tuần; một buổi = slide, đọc bài, tự gõ, thực hành, quiz.</li></ul>

<a class="link-card" href="https://en.wikipedia.org/wiki/Toy_Story_2" target="_blank" rel="noopener">
  <span class="lc-ico">🎬</span>
  <span class="lc-body"><span class="lc-title">Wikipedia — Toy Story 2 (phần Production)</span><span class="lc-sub">Vụ xoá năm 1998, hệ thống sao lưu hỏng, và bản sao ở nhà của Galyn Susman.</span></span>
</a>
<a class="link-card" href="https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">GitLab — Báo cáo sự cố cơ sở dữ liệu 31/01/2017</span><span class="lc-sub">Báo cáo của chính GitLab: mất gì, không mất gì, và những bản sao lưu nào đã hỏng.</span></span>
</a>
<a class="link-card" href="https://www.ftc.gov/business-guidance/blog/2018/04/ftc-addresses-ubers-undisclosed-data-breach-new-proposed-order" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">FTC — Vụ rò rỉ dữ liệu Uber 2016</span><span class="lc-sub">Khoá truy cập trong repo GitHub private, và những gì đã bị lấy.</span></span>
</a>
<a class="link-card" href="https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">GitGuardian — The State of Secrets Sprawl 2026</span><span class="lc-sub">28,65 triệu bí mật mới trên GitHub công khai năm 2025, và chúng còn hiệu lực bao lâu.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/book/en/v2" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git — sách chính thức, miễn phí (tiếng Anh)</span><span class="lc-sub">Cuốn tra cứu đặt cạnh khoá này; chương 1–3 của sách đi cặp với Chương 1–3 của ta.</span></span>
</a>
<p class="note-ct"><strong>Tiếp theo:</strong> bài 0.0 gom mọi slide của Mục 0 vào một chỗ, và bài 0.1 cho bạn xem bản đồ đầy đủ của khoá. Nếu bạn đã làm bài thực hành phía trên thì bạn đã có commit đầu tiên rồi — phần còn lại là xây tiếp lên đó.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.0 ─────────────────────────── */
    {
      title: '0.0 — Section 0 slides: getting started in pictures|||0.0 — Slide Mục 0: bắt đầu với Git bằng hình',
      slug: 'git-0-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 31 slide của Mục 0: 14 slide “Bắt đầu tại đây” (Git và GitHub là gì, lịch sử, số liệu, sự cố thật, cách học không nản) rồi khoá này cho ai, lộ trình 17 phần, vấn đề "final_v2_THẬT.docx", Git khác GitHub, cài đặt trên ba hệ điều hành, git config, khoá SSH và sân tập thu-git.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Slides</span>
<h2>Section 0 in 31 slides</h2>
<p class="lead">Skim these before reading the lessons to see where the whole course goes, then keep them open while you install Git and create your SSH key. Every picture here reappears inside the lesson that explains it.</p>
<p>The first 14 pictures below (slides 18–31) belong to the two "Start here" lessons: what Git and GitHub are, the 2005 timeline, the numbers, real incidents and a study plan. After them come slides 1–17 for lessons 0.1–0.4. The slides are in Vietnamese; the pictures (the 17-stop roadmap, Git vs GitHub, the SSH key pair) read the same in any language. Every terminal on the slides is real output from a real run. Slides 16 and 17 are a cheat sheet and a 30-minute setup session — finish that session and you are ready for Chapter 1.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Slide</span>
<h2>Mục 0 trong 31 slide</h2>
<p class="lead">Lướt bộ này trước khi đọc bài để thấy cả khoá sẽ đi tới đâu, rồi mở nó bên cạnh lúc bạn cài Git và tạo khoá SSH. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó.</p>
<p>14 hình đầu bên dưới (slide 18–31) thuộc hai bài “Bắt đầu tại đây”: Git và GitHub là gì, dòng thời gian năm 2005, các con số, sự cố có thật và kế hoạch học. Tiếp theo là slide 1–17 cho bài 0.1–0.4. Mọi terminal trên slide là output thật của một lần chạy thật. Slide 16 và 17 là bảng tra nhanh và một buổi cài đặt 30 phút — làm xong buổi đó là bạn sẵn sàng vào Chương 1.</p>
</div>
${gallery('git-00', [
  [18, 'Git là gì? Nút “lưu game” cho cả thư mục'], [19, 'Git ≠ GitHub — máy bạn ⇄ GitHub ⇄ bạn cùng nhóm'], [20, 'Git và GitHub — so từng dòng'],
  [21, 'Dòng thời gian: từ email vá lỗi tới 180 triệu lập trình viên'], [22, 'Vì sao Git ra đời: BitKeeper đổ vỡ → mục tiêu thiết kế'],
  [23, 'Trước Git · Sau Git — một tuần đồ án nhóm'], [24, 'Git dùng để làm gì — tám việc, tám chương'], [25, 'Quan trọng tới mức nào? Con số có nguồn'],
  [26, 'Git giúp gì cho bạn — từ năm nhất tới đi làm'], [27, 'Bốn chuyện có thật — đã kiểm nguồn'], [28, 'Tình huống minh hoạ — rất có thể là nhóm bạn'],
  [29, 'Vì sao người mới hay bỏ Git — và cách chữa'], [30, 'Lộ trình: tối thiểu 1 tuần · đầy đủ vài tuần'], [31, 'Nhịp một buổi học và các mốc “mình làm được”'],
  [1, 'Bìa'], [2, 'Bản đồ Mục 0'], [3, 'Khoá này viết cho ai'], [4, 'Lộ trình toàn khoá — 17 phần'],
  [5, 'Ba chương mới 14–16'], [6, 'final_v2_THẬT.docx và git log'], [7, 'Bốn thứ thư mục không làm được'],
  [8, 'Ba thế hệ quản lý phiên bản'], [9, 'Git ≠ GitHub'], [10, 'Cài Git trên ba hệ điều hành'], [11, 'git config tối thiểu'],
  [12, 'Khoá SSH: một cặp, hai nửa'], [13, 'Khoá SSH — output thật'], [14, 'Sân tập thu-git'],
  [15, 'Ba câu hỏi trước khi bấm Enter'], [16, 'Bảng tra nhanh'], [17, 'Thực hành Mục 0'],
])}
`,
    },

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — Who this course is for & the full roadmap|||0.1 — Khoá này cho ai & lộ trình toàn khoá',
      slug: 'git-0-1-gioi-thieu-lo-trinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao hầu hết lập trình viên chỉ dùng được 5 lệnh Git và sợ hãi mọi lệnh còn lại, khoá này lấp khoảng trống nào, và bản đồ toàn khoá (Mục 0 + 16 chương, bài thi cuối khoá ở cuối Chương 16) từ commit đầu tiên tới một dự án nhóm thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Start here — the tool you will touch every single day</h2>
<p class="lead">Almost every developer learns exactly five Git commands — <code>clone</code>, <code>add</code>, <code>commit</code>, <code>push</code>, <code>pull</code> — and then stops. Everything beyond that becomes folklore: "never rebase", "reset --hard deletes your work", "if it breaks, delete the folder and clone again". That folklore is expensive. It costs you afternoons, and occasionally it costs your team a day of lost work.</p>
<p>This course replaces the folklore with a <strong>model</strong>. Once you can picture what Git actually stores, the scary commands stop being scary, because you can predict what each one will do before you press Enter.</p>

<h3>The one idea this course is built on</h3>
<div class="callout ok">Git does not store your files. Git stores a chain of <strong>snapshots</strong>, each one addressed by a hash of its own content, plus a handful of <strong>pointers</strong> (branches, tags, <code>HEAD</code>) that say "you are here". Every command you will learn either creates a snapshot or moves a pointer. That is the whole system.</div>
<p>Hold on to that sentence. In Chapter 9 you will open <code>.git/</code> with your own hands and see the snapshots and pointers as real files on disk, and the whole thing will click.</p>

<h3>Who this is for</h3>
${slide('git-00', 3, 'Khoá này viết cho ai')}
<div class="kv-grid">
  <div class="kv"><span class="k">The beginner</span><span class="v">You have never made a commit. Start at 0.2 — nothing is assumed beyond being able to open a terminal.</span></div>
  <div class="kv"><span class="k">The "five-command" developer</span><span class="v">You ship code daily but freeze when Git says <em>"fatal: refusing to merge unrelated histories"</em>. Chapters 1, 3 and 4 are written for you.</span></div>
  <div class="kv"><span class="k">The team lead</span><span class="v">You need a branching strategy, a review process and protected branches that people actually follow. Chapters 6–8.</span></div>
  <div class="kv"><span class="k">The person mid-disaster</span><span class="v">Something is on fire right now. Jump straight to Chapter 13 — it is a recovery cookbook, readable out of order.</span></div>
</div>

<h3>What you will be able to do at the end</h3>
<ul>
  <li>Explain what a commit <em>is</em>, not just how to make one — and read a repository's history like a document.</li>
  <li>Resolve a merge conflict calmly, including the ugly kind where both sides changed the same function.</li>
  <li>Rewrite your own local history (squash, reword, reorder) and know exactly when that becomes dangerous for other people.</li>
  <li>Recover a commit, a branch, or a whole afternoon's work that "disappeared" — using <code>reflog</code>, which almost nobody knows about.</li>
  <li>Find which commit introduced a bug in a 10,000-commit repository in about eight steps, with <code>git bisect</code>.</li>
  <li>Run a professional GitHub workflow: pull requests, review, protected branches, required checks, releases, tags.</li>
  <li>Remove a leaked API key from every commit in history — properly, not by deleting the line in a new commit.</li>
</ul>

<h3>The 14-chapter roadmap</h3>
${slide('git-00', 4, 'Lộ trình toàn khoá — 17 phần')}
<div class="lz-map">
  <div class="lz-stage">Part 1 — The model (Ch 1–2)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Snapshots, not diffs</div><div class="lz-nsub">The three trees, what a commit really contains, the everyday add/commit loop, .gitignore</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Reading history</div><div class="lz-nsub">log, show, diff, blame, the pickaxe, and bisect — archaeology on your own codebase</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 2 — Moving through history (Ch 3–4)</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Branching &amp; merging</div><div class="lz-nsub">A branch is a 41-byte file. Fast-forward vs 3-way merge, conflicts, merge vs rebase</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Undo, safely</div><div class="lz-nsub">restore, reset (the three modes), revert, stash — and reflog, the undo button for the undo button</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 3 — Working with other people (Ch 5–8)</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Remotes &amp; GitHub</div><div class="lz-nsub">fetch vs pull, tracking branches, SSH keys and tokens, forks and upstream</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Pull requests &amp; review</div><div class="lz-nsub">What makes a PR reviewable, merge vs squash vs rebase, protected branches, CODEOWNERS</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Team workflows &amp; releases</div><div class="lz-nsub">trunk-based vs git-flow, tags, semantic versioning, Conventional Commits, changelogs</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Rewriting history safely</div><div class="lz-nsub">amend, interactive rebase, --force-with-lease, filter-repo for a leaked secret</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 4 — Depth &amp; scale (Ch 9–12)</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Under the hood</div><div class="lz-nsub">Open .git/ and read the object database yourself: blobs, trees, commits, refs, packfiles</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Big repositories</div><div class="lz-nsub">worktree, submodules vs subtree, sparse-checkout, partial clone, LFS, monorepos</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">The GitHub platform</div><div class="lz-nsub">Issues and Projects, Actions, Releases, Dependabot and secret scanning, the gh CLI</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Hooks, signing &amp; automation</div><div class="lz-nsub">pre-commit, husky + lint-staged, server-side policy, signed commits</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 5 — When it goes wrong (Ch 13–14)</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Disaster recovery cookbook</div><div class="lz-nsub">Wrong branch, force-pushed over a colleague, deleted branch, leaked secret, detached HEAD</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Git in a real workflow</div><div class="lz-nsub">The exact flow behind cuongthai.com, reviewing your own diff, working alongside AI agents</div></div></div>
</div>

<div class="callout warn"><strong>Roadmap update (09/2026):</strong> the map above is the original plan and is kept as written. Since then the course has grown to <strong>16 chapters</strong> (17 parts counting this Section 0). The old stop "14 — Git in a real workflow" now lives inside Chapter 13 as lesson 13.2, and three new chapters were added below. Lesson 13.3 is now a check on Chapter 13 only.</div>
<h3>New in 09/2026 — Chapters 14–16</h3>
${slide('git-00', 5, 'Ba chương mới 14–16')}
<div class="lz-map">
  <div class="lz-stage">Part 6 — Tools, career &amp; a real team project (Ch 14–16)</div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Everyday Git in your tools</div><div class="lz-nsub">VS Code Source Control (stage single lines, the 3-column merge editor), Git Graph / GitLens, GitHub Desktop, lazygit; advanced .gitconfig (aliases, includeIf for school vs personal email); working with Windows teammates (CRLF/LF, .gitattributes)</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">GitHub for students</div><div class="lz-nsub">Profile README, pinned repos and project READMEs recruiters actually read, GitHub Pages for a portfolio, the Student Developer Pack and Codespaces, your first open-source contribution</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Capstone: running a team project on GitHub</div><div class="lz-nsub">A 4-student SWP391-style project ("clinic booking", 3 weeks): setting up the repo, one full sprint with a real conflict, tagging v1.0.0 and a hotfix, and 8 classic team incidents with their rescue</div></div></div>
</div>
<div class="callout ok"><strong>The final course exam — 20 questions — sits at the end of Chapter 16</strong> (lesson 16.5). It covers Chapters 1–16 with real situations, and every question comes with an explanation. Each chapter before that ends with its own 10-question check.</div>

<h3>How this course is different from the docs</h3>
<p>The official documentation is a <em>reference</em>: it tells you every flag of every command, and assumes you already know which command you want. This course is a <em>path</em>: it introduces one idea at a time, shows the real terminal output, and tells you which mistake that idea prevents. Keep the reference open beside it — the two are complementary, not competing.</p>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Open a terminal (on Windows: Git Bash) and run <code>git --version</code>. If it prints a version of 2.30 or newer, note it down; if it says "command not found", your first stop is lesson 0.3.</li><li>Find the card on slide 3 that describes you today, and write down which chapters it points to.</li><li>Write down three Git moments from your own team projects (SWP391 or similar) that scared or confused you — for example "I pushed straight to main", "package-lock.json conflicted again", "a teammate committed the .env file".</li><li>Using the roadmap (slide 4 and the map above), put a chapter number next to each moment. Then give Chapters 1–4 a date in your calendar — one chapter per sitting.</li></ol>
<pre><code class="language-bash"><span class="tok-comment"># example of what your note can look like</span>
pushed straight to main            → Ch 4 (undo), Ch 6 (protected branches), Ch 13
package-lock.json conflict         → Ch 3 (conflicts), Ch 16.4
.env committed by a teammate       → Ch 1.5 (.gitignore), Ch 8, Ch 13</code></pre>
<p><strong>Done when:</strong> you have the output of <code>git --version</code> (or know you must install first), three real moments each mapped to at least one chapter number, and dates written down for Chapters 1–4.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Snapshot</span><span class="v">A full picture of the whole project at one moment. Git stores a chain of these, not a list of edits.</span></div>
  <div class="kv"><span class="k">Pointer / ref</span><span class="v">A name that points at one snapshot: a branch, a tag, or <code>HEAD</code> ("you are here").</span></div>
  <div class="kv"><span class="k">Roadmap</span><span class="v">The 17-part route of this course: Section 0 plus Chapters 1–16.</span></div>
  <div class="kv"><span class="k">Capstone</span><span class="v">The final team project in Chapter 16 where every earlier chapter is used together.</span></div>
  <div class="kv"><span class="k">Final exam</span><span class="v">The 20-question test at the end of Chapter 16 (lesson 16.5), covering the whole course.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Git stores snapshots plus a few pointers; every command either creates a snapshot or moves a pointer.</li><li>The course is 17 parts: Section 0 plus 16 chapters, from the model (Ch 1) to a real team project (Ch 16).</li><li>Chapters 1–4 are the foundation — do them in order; Chapter 13 can be opened mid-emergency.</li><li>Chapters 14–16 (new 09/2026) cover everyday tools, your GitHub profile as a student, and a capstone team project.</li><li>The 20-question final exam is at the end of Chapter 16; every other chapter ends with a 10-question check.</li></ul>

<a class="link-card" href="https://git-scm.com/book/en/v2" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git (Chacon &amp; Straub) — the free official book</span><span class="lc-sub">The definitive reference. Chapter 10 "Git Internals" pairs with our Chapter 9.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/get-started" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Get started</span><span class="lc-sub">The platform half: pull requests, protected branches, Actions, security features.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: the Git track on Code Lab</span><span class="lc-sub">Graded exercises that mirror this course chapter by chapter. Read here, drill there.</span></span>
</a>

<div class="pitfall"><strong>The trap this whole course exists to break:</strong> treating Git as a magic box you feed commands to until the error goes away. Every time you fix a Git problem by copying a Stack Overflow command you do not understand, you make the next problem harder — because now you do not know what state your repository is in. Understanding the model is not academic; it is the cheapest path to being fast.</div>
<p class="note-ct"><strong>How to use this course:</strong> keep a scratch repository open in a second terminal (<code>mkdir /tmp/lab &amp;&amp; cd /tmp/lab &amp;&amp; git init</code>) and run every command as you read it. Git is safe to experiment with in a throwaway folder, and reading about <code>reset --hard</code> teaches you nothing compared to doing it once and getting your work back with <code>reflog</code>.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bắt đầu từ đây — công cụ bạn chạm vào mỗi ngày</h2>
<p class="lead">Gần như mọi lập trình viên đều học đúng năm lệnh Git — <code>clone</code>, <code>add</code>, <code>commit</code>, <code>push</code>, <code>pull</code> — rồi dừng lại. Mọi thứ ngoài đó trở thành lời đồn: "đừng bao giờ rebase", "reset --hard là mất code", "hỏng thì xoá thư mục clone lại". Lời đồn ấy đắt. Nó lấy của bạn từng buổi chiều, và thỉnh thoảng lấy của cả nhóm một ngày làm việc.</p>
<p>Khoá này thay lời đồn bằng một <strong>mô hình</strong>. Khi bạn hình dung được Git thực sự lưu cái gì, những lệnh đáng sợ hết đáng sợ — vì bạn đoán trước được nó sẽ làm gì trước khi bấm Enter.</p>

<h3>Một ý tưởng duy nhất mà cả khoá này dựng lên trên đó</h3>
<div class="callout ok">Git KHÔNG lưu file của bạn. Git lưu một chuỗi <strong>ảnh chụp (snapshot)</strong>, mỗi ảnh được định danh bằng mã băm của chính nội dung nó, cộng với vài <strong>con trỏ</strong> (nhánh, tag, <code>HEAD</code>) nói "bạn đang ở đây". Mọi lệnh bạn sắp học đều hoặc tạo một ảnh chụp, hoặc dời một con trỏ. Cả hệ thống chỉ có vậy.</div>
<p>Hãy giữ lấy câu đó. Tới Chương 9 bạn sẽ tự tay mở <code>.git/</code> và thấy ảnh chụp cùng con trỏ nằm đó dưới dạng file thật trên đĩa — và mọi thứ sẽ khớp lại.</p>

<h3>Khoá này dành cho ai</h3>
${slide('git-00', 3, 'Khoá này viết cho ai')}
<div class="kv-grid">
  <div class="kv"><span class="k">Người mới hoàn toàn</span><span class="v">Bạn chưa từng tạo một commit nào. Bắt đầu từ 0.2 — không giả định gì ngoài việc mở được terminal.</span></div>
  <div class="kv"><span class="k">Lập trình viên "năm lệnh"</span><span class="v">Bạn ship code mỗi ngày nhưng đơ người khi Git báo <em>"fatal: refusing to merge unrelated histories"</em>. Chương 1, 3 và 4 viết cho bạn.</span></div>
  <div class="kv"><span class="k">Người dẫn nhóm</span><span class="v">Bạn cần một chiến lược nhánh, một quy trình review và nhánh được bảo vệ mà mọi người thật sự tuân theo. Chương 6–8.</span></div>
  <div class="kv"><span class="k">Người đang gặp sự cố</span><span class="v">Có thứ đang cháy ngay lúc này. Nhảy thẳng tới Chương 13 — nó là sách công thức cứu hộ, đọc lẻ được.</span></div>
</div>

<h3>Học xong bạn làm được gì</h3>
<ul>
  <li>Giải thích một commit <em>là gì</em>, không chỉ cách tạo ra nó — và đọc lịch sử một kho mã như đọc một tài liệu.</li>
  <li>Xử lý xung đột merge một cách bình tĩnh, kể cả loại xấu xí khi hai bên cùng sửa một hàm.</li>
  <li>Viết lại lịch sử cục bộ của mình (gộp, đổi lời, đổi thứ tự) và biết chính xác lúc nào việc đó thành nguy hiểm cho người khác.</li>
  <li>Lấy lại một commit, một nhánh, hay cả buổi chiều làm việc đã "biến mất" — bằng <code>reflog</code>, thứ mà gần như không ai biết.</li>
  <li>Tìm ra commit nào gây lỗi trong một kho 10.000 commit chỉ trong khoảng tám bước, bằng <code>git bisect</code>.</li>
  <li>Chạy một quy trình GitHub chuyên nghiệp: pull request, review, nhánh được bảo vệ, kiểm tra bắt buộc, release, tag.</li>
  <li>Gỡ một khoá API bị lộ khỏi MỌI commit trong lịch sử — đúng cách, không phải bằng cách xoá dòng đó trong một commit mới.</li>
</ul>

<h3>Lộ trình 14 chương</h3>
${slide('git-00', 4, 'Lộ trình toàn khoá — 17 phần')}
<div class="lz-map">
  <div class="lz-stage">Phần 1 — Mô hình (Ch 1–2)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Ảnh chụp, không phải bản khác biệt</div><div class="lz-nsub">Ba cái cây, một commit thật sự chứa gì, vòng lặp add/commit hằng ngày, .gitignore</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Đọc lịch sử</div><div class="lz-nsub">log, show, diff, blame, cái cuốc chim (-S), và bisect — khảo cổ trên chính kho mã của bạn</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 2 — Di chuyển trong lịch sử (Ch 3–4)</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Nhánh &amp; hợp nhất</div><div class="lz-nsub">Một nhánh là một file 41 byte. Fast-forward vs merge 3 chiều, xung đột, merge vs rebase</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Hoàn tác, an toàn</div><div class="lz-nsub">restore, reset (ba chế độ), revert, stash — và reflog, nút undo cho chính nút undo</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 3 — Làm việc với người khác (Ch 5–8)</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Remote &amp; GitHub</div><div class="lz-nsub">fetch vs pull, nhánh theo dõi, khoá SSH và token, fork và upstream</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Pull request &amp; review</div><div class="lz-nsub">Điều gì làm một PR review được, merge vs squash vs rebase, nhánh bảo vệ, CODEOWNERS</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Quy trình nhóm &amp; phát hành</div><div class="lz-nsub">trunk-based vs git-flow, tag, đánh phiên bản ngữ nghĩa, Conventional Commits, changelog</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Viết lại lịch sử an toàn</div><div class="lz-nsub">amend, rebase tương tác, --force-with-lease, filter-repo cho một bí mật bị lộ</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 4 — Chiều sâu &amp; quy mô (Ch 9–12)</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Bên dưới nắp capo</div><div class="lz-nsub">Mở .git/ và tự đọc kho đối tượng: blob, tree, commit, ref, packfile</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Kho mã lớn</div><div class="lz-nsub">worktree, submodule vs subtree, sparse-checkout, partial clone, LFS, monorepo</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Nền tảng GitHub</div><div class="lz-nsub">Issue và Projects, Actions, Releases, Dependabot và quét bí mật, CLI gh</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Hook, ký &amp; tự động hoá</div><div class="lz-nsub">pre-commit, husky + lint-staged, chính sách phía máy chủ, commit có chữ ký</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 5 — Khi mọi thứ hỏng (Ch 13–14)</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Sách công thức cứu hộ</div><div class="lz-nsub">Sai nhánh, force-push đè lên đồng nghiệp, xoá nhánh, lộ bí mật, HEAD lìa cành</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Git trong quy trình thật</div><div class="lz-nsub">Đúng quy trình đằng sau cuongthai.com, tự review diff của mình, làm việc cùng agent AI</div></div></div>
</div>

<div class="callout warn"><strong>Cập nhật lộ trình (09/2026):</strong> bản đồ phía trên là kế hoạch ban đầu, được giữ nguyên văn. Từ đó khoá đã lớn lên thành <strong>16 chương</strong> (17 phần nếu tính cả Mục 0 này). Trạm cũ "14 — Git trong quy trình thật" nay nằm trong Chương 13 dưới dạng bài 13.2, và ba chương mới được thêm vào bên dưới. Bài 13.3 giờ chỉ kiểm tra riêng Chương 13.</div>
<h3>Mới 09/2026 — Chương 14–16</h3>
${slide('git-00', 5, 'Ba chương mới 14–16')}
<div class="lz-map">
  <div class="lz-stage">Phần 6 — Công cụ, nghề nghiệp &amp; một dự án nhóm thật (Ch 14–16)</div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Git hằng ngày trong công cụ</div><div class="lz-nsub">Source Control của VS Code (stage từng dòng, merge editor — trình giải xung đột — 3 cột), Git Graph / GitLens, GitHub Desktop, lazygit; .gitconfig nâng cao (alias — tên tắt, includeIf để tách email trường và email cá nhân); làm nhóm với bạn dùng Windows (CRLF/LF, .gitattributes)</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">GitHub cho sinh viên</div><div class="lz-nsub">Profile README (trang giới thiệu bản thân), ghim repo và README dự án mà nhà tuyển dụng thật sự đọc, GitHub Pages cho portfolio, Student Developer Pack (gói quyền lợi sinh viên) và Codespaces, lần đóng góp mã nguồn mở đầu tiên</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Dự án nhóm cuối khoá</div><div class="lz-nsub">Nhóm 4 sinh viên làm đồ án kiểu SWP391 ("Đặt lịch phòng khám", 3 tuần): dựng repo, một sprint trọn vẹn có xung đột thật, gắn tag v1.0.0 và hotfix (bản vá gấp), 8 sự cố kinh điển của nhóm và cách cứu</div></div></div>
</div>
<div class="callout ok"><strong>Bài thi cuối khoá 20 câu nằm ở cuối Chương 16</strong> (bài 16.5). Nó trải đều Chương 1–16 bằng tình huống thật, câu nào cũng có giải thích. Trước đó, mỗi chương kết thúc bằng bài kiểm tra 10 câu của riêng nó.</div>

<h3>Khoá này khác tài liệu chính thức ở chỗ nào</h3>
<p>Tài liệu chính thức là một <em>cuốn tra cứu</em>: nó liệt kê mọi cờ của mọi lệnh, và giả định bạn đã biết mình cần lệnh nào. Khoá này là một <em>con đường</em>: nó giới thiệu mỗi lần một ý, đưa ra output terminal thật, và nói cho bạn biết ý đó ngăn được sai lầm nào. Hãy mở cuốn tra cứu bên cạnh — hai thứ bổ sung cho nhau, không cạnh tranh.</p>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Mở terminal (Windows: mở Git Bash) và chạy <code>git --version</code>. Nếu nó in ra phiên bản từ 2.30 trở lên, ghi lại; nếu báo "command not found" (không tìm thấy lệnh), điểm dừng đầu tiên của bạn là bài 0.3.</li><li>Tìm thẻ trên slide 3 mô tả đúng bạn lúc này, ghi lại nó trỏ tới những chương nào.</li><li>Ghi ra ba khoảnh khắc Git trong đồ án nhóm của chính bạn (SWP391 hay tương tự) từng làm bạn sợ hoặc rối — ví dụ "mình push thẳng lên main", "package-lock.json lại xung đột", "một bạn commit luôn file .env".</li><li>Dùng lộ trình (slide 4 và bản đồ phía trên), ghi số chương cạnh từng khoảnh khắc. Rồi đặt ngày cho Chương 1–4 trong lịch — mỗi buổi một chương.</li></ol>
<pre><code class="language-bash"><span class="tok-comment"># ví dụ ghi chú của bạn có thể trông thế này</span>
push thẳng lên main                → Ch 4 (hoàn tác), Ch 6 (nhánh bảo vệ), Ch 13
xung đột package-lock.json         → Ch 3 (xung đột), Ch 16.4
bạn cùng nhóm commit file .env     → Ch 1.5 (.gitignore), Ch 8, Ch 13</code></pre>
<p><strong>Đạt khi:</strong> bạn có output của <code>git --version</code> (hoặc biết mình phải cài trước), ba khoảnh khắc thật mỗi cái gắn với ít nhất một số chương, và ngày học Chương 1–4 đã ghi vào lịch.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Snapshot</span><span class="v">Ảnh chụp — bức hình đầy đủ của cả dự án tại một thời điểm. Git lưu một chuỗi những ảnh này, không phải danh sách chỗ sửa.</span></div>
  <div class="kv"><span class="k">Pointer / ref</span><span class="v">Con trỏ / tham chiếu — một cái tên trỏ vào một ảnh chụp: nhánh, tag, hoặc <code>HEAD</code> ("bạn đang ở đây").</span></div>
  <div class="kv"><span class="k">Roadmap</span><span class="v">Lộ trình — con đường 17 phần của khoá: Mục 0 cộng Chương 1–16.</span></div>
  <div class="kv"><span class="k">Capstone</span><span class="v">Dự án tổng kết — đồ án nhóm ở Chương 16, nơi mọi chương trước được dùng cùng lúc.</span></div>
  <div class="kv"><span class="k">Final exam</span><span class="v">Bài thi cuối khoá — 20 câu ở cuối Chương 16 (bài 16.5), phủ toàn bộ khoá.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Git lưu ảnh chụp cộng vài con trỏ; mọi lệnh hoặc tạo ảnh chụp, hoặc dời con trỏ.</li><li>Khoá có 17 phần: Mục 0 cộng 16 chương, từ mô hình (Ch 1) tới một dự án nhóm thật (Ch 16).</li><li>Chương 1–4 là nền móng — học theo thứ tự; Chương 13 mở ra được ngay giữa lúc sự cố.</li><li>Chương 14–16 (mới 09/2026) dạy công cụ hằng ngày, hồ sơ GitHub của sinh viên và một dự án nhóm tổng kết.</li><li>Bài thi cuối khoá 20 câu nằm ở cuối Chương 16; mọi chương khác kết thúc bằng bài kiểm tra 10 câu.</li></ul>

<a class="link-card" href="https://git-scm.com/book/en/v2" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git (Chacon &amp; Straub) — sách chính thức, miễn phí (bản tiếng Anh — bản tiếng Việt trên git-scm.com đã bị gỡ)</span><span class="lc-sub">Cuốn tra cứu chuẩn mực. Chương 10 "Git Internals" đi cặp với Chương 9 của ta.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/get-started" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Bắt đầu</span><span class="lc-sub">Nửa phần nền tảng: pull request, nhánh bảo vệ, Actions, các tính năng bảo mật.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: track Git trên Code Lab</span><span class="lc-sub">Bài tập có chấm điểm bám theo từng chương của khoá này. Đọc ở đây, luyện ở đó.</span></span>
</a>

<div class="pitfall"><strong>Cái bẫy mà cả khoá này sinh ra để phá:</strong> coi Git như một hộp thần kỳ mà ta nhét lệnh vào cho tới khi hết báo lỗi. Mỗi lần bạn sửa một vấn đề Git bằng cách chép một lệnh trên Stack Overflow mà không hiểu, bạn làm vấn đề kế tiếp khó hơn — vì giờ bạn không biết kho mã của mình đang ở trạng thái nào. Hiểu mô hình không phải là chuyện hàn lâm; đó là con đường rẻ nhất để đi nhanh.</div>
<p class="note-ct"><strong>Cách dùng khoá này:</strong> mở sẵn một kho mã nháp ở terminal thứ hai (<code>mkdir /tmp/lab &amp;&amp; cd /tmp/lab &amp;&amp; git init</code>) và chạy mọi lệnh khi bạn đọc tới. Git rất an toàn để nghịch trong một thư mục vứt đi, và đọc về <code>reset --hard</code> không dạy bạn được gì so với làm nó một lần rồi lấy lại được việc của mình bằng <code>reflog</code>.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — The problem Git solves (and why folders do not)|||0.2 — Vấn đề Git giải quyết (và vì sao thư mục thì không)',
      slug: 'git-0-2-van-de-git-giai-quyet',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Từ "báo_cáo_final_v2_sửa_lần_cuối.docx" tới hệ quản lý phiên bản phân tán: bốn vấn đề thật mà Git giải quyết, vì sao "phân tán" quan trọng, và Git khác Dropbox/Google Drive ở chỗ nào.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Everyone invents version control. Most people invent a bad one.</h2>
<p class="lead">Before we touch a command, be clear on the problem. You have already built a version control system — it just looked like this:</p>
<pre><code>report.docx
report_v2.docx
report_final.docx
report_final_FIXED.docx
report_final_FIXED_use_this_one.docx
report_final_FIXED_use_this_one_(An's copy).docx</code></pre>
<p>That is a real version control system. It stores versions. It is also a <em>bad</em> one, and it is worth naming exactly why, because each flaw maps to a Git feature.</p>

<h3>Four things the folder approach cannot do</h3>
${slide('git-00', 6, 'final_v2_THẬT.docx và git log')}
${slide('git-00', 7, 'Bốn thứ thư mục không làm được')}
<div class="kv-grid">
  <div class="kv"><span class="k">It cannot say WHY</span><span class="v">The file name records <em>when</em>-ish, never <em>why</em>. Six months later nobody knows what "FIXED" fixed. Git attaches a message, an author and a timestamp to every version.</span></div>
  <div class="kv"><span class="k">It cannot show WHAT changed</span><span class="v">To find the difference between v2 and final you must read both documents. Git computes the difference for you, line by line, in a second.</span></div>
  <div class="kv"><span class="k">It cannot merge two people's work</span><span class="v">If An and Bình both edit <code>report_final</code>, one of them loses. Git merges both sets of changes automatically when they touch different lines, and asks you only about genuine overlaps.</span></div>
  <div class="kv"><span class="k">It cannot go back safely</span><span class="v">Restoring an old version means copying files over the new ones — destroying the new work. In Git every version stays reachable forever; going back adds history rather than erasing it.</span></div>
</div>

<h3>What a version control system is, precisely</h3>
${slide('git-00', 8, 'Ba thế hệ quản lý phiên bản')}
<p>A <strong>version control system</strong> (VCS) records changes to a set of files over time so that you can recall any specific version later. Three generations exist, and knowing the difference explains most of Git's design:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Local</span><span class="lz-v">Versions live only on your machine (RCS, or your <code>_final_v2</code> folders). Nothing is shared; a dead laptop is a dead project.</span></div>
  <div class="lz-layer"><span class="lz-k">Centralised</span><span class="lz-v">One server holds the history (CVS, Subversion, Perforce). You check files out from it. Simple to reason about — but the server is a single point of failure, and you cannot commit offline.</span></div>
  <div class="lz-layer"><span class="lz-k">Distributed</span><span class="lz-v">Every clone is a <strong>complete</strong> copy of the entire history (Git, Mercurial). You can commit, branch, diff and search history on a plane with no network. The "central" repository is just the clone everyone agrees to treat as central.</span></div>
</div>
<div class="callout ok">That last row is the whole meaning of the D in <strong>DVCS</strong>. When you <code>git clone</code>, you do not download "the current files" — you download <em>every version of every file since the project began</em>, plus all the branches and tags. That is why <code>git log</code> is instant and works offline, and why a GitHub outage does not stop you from working.</div>

<h3>Git in one paragraph of history</h3>
<p>In 2005 the Linux kernel lost access to the proprietary VCS it had been using. Linus Torvalds wrote a replacement in about ten days, with three design goals that still explain every odd corner of the tool: it had to be <strong>fast</strong> (thousands of contributors, a huge codebase), it had to make <strong>branching and merging cheap</strong> (the kernel lives on parallel branches), and it had to <strong>guarantee integrity</strong> — you must be able to prove that the code you have is bit-for-bit the code that was committed. That third goal is why everything in Git is addressed by a SHA hash, which you will meet in Chapter 1.</p>

<h3>Git is not Dropbox — the difference matters</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dropbox / Google Drive</span><span class="v">Syncs <em>continuously and automatically</em>. Every keystroke eventually becomes the shared truth. Great for documents; catastrophic for code, because a half-written function would instantly break everyone else.</span></div>
  <div class="kv"><span class="k">Git</span><span class="v">Syncs <em>deliberately</em>. You decide when a set of changes is coherent enough to become a version (<code>commit</code>), and separately when it is ready for other people (<code>push</code>). That deliberate gap is where code review, tests and CI live.</span></div>
</div>
<p>This is the single most important cultural difference. Git is not a backup tool that happens to handle code. It is a tool for <strong>proposing</strong> changes, and the proposal is the unit of work.</p>

<h3>Git is not GitHub either</h3>
${slide('git-00', 9, 'Git ≠ GitHub')}
<p>Beginners often use the two names as one word. They are different things, and mixing them up leads to wrong mental models ("GitHub is down, so I cannot commit"):</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Git</span><span class="v">A free, open-source program that runs on <em>your</em> machine. Commits, branches, merges and the whole history live in the hidden <code>.git/</code> folder of your project. It works with no network and no account.</span></div>
  <div class="kv"><span class="k">GitHub</span><span class="v">A website (owned by Microsoft) that hosts Git repositories so a team can share one. It adds things Git itself does not have: pull requests, issues, Actions, Pages. GitLab, Bitbucket and Gitea are alternatives that speak the same Git protocol.</span></div>
</div>
<p>Everything in Chapters 1–4 happens in Git, on your laptop. GitHub enters in Chapter 5, when you start exchanging commits with other people through <code>git push</code> and <code>git pull</code>.</p>

<h3>The vocabulary you need for Chapter 1</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">repository (repo)</span><span class="v">A project folder plus the hidden <code>.git/</code> directory holding its full history.</span></div>
  <div class="kv"><span class="k">commit</span><span class="v">One saved version — a snapshot of the whole project plus a message, an author and a link to its parent.</span></div>
  <div class="kv"><span class="k">branch</span><span class="v">A movable pointer to a commit. Used to develop something without disturbing the main line.</span></div>
  <div class="kv"><span class="k">remote</span><span class="v">Another copy of the repository, usually on a server such as GitHub, that you exchange commits with.</span></div>
  <div class="kv"><span class="k">clone / push / pull</span><span class="v">Copy a whole repository down · send your commits up · bring other people's commits down.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Rebuild the "report" story with Git instead of file names. In any scratch folder: <code>mkdir bao-cao &amp;&amp; cd bao-cao &amp;&amp; git init</code>, create <code>bao-cao.md</code> with a title line and "Chương 1: Giới thiệu", then commit it <em>as An</em> (the <code>-c</code> flags set a name for one command only — you configure your own name properly in 0.3).</li><li>Append a line "Chương 2: Yêu cầu hệ thống" and commit it <em>as Bình</em>.</li><li>Open the file in your editor, change line 2 to "Chương 1: Giới thiệu đề tài đặt lịch phòng khám", and commit as An with a message that says <strong>why</strong>.</li><li>Now answer, using only Git: who changed the topic title, when, why, and which exact line changed?</li></ol>
<pre><code class="language-bash">printf <span class="tok-string">'# Báo cáo SWP391\\nChương 1: Giới thiệu\\n'</span> &gt; bao-cao.md
git add . &amp;&amp; git -c user.name=An -c user.email=an@example.com commit -m <span class="tok-string">"Thêm dàn ý báo cáo"</span>
printf <span class="tok-string">'Chương 2: Yêu cầu hệ thống\\n'</span> &gt;&gt; bao-cao.md
git -c user.name=Binh -c user.email=binh@example.com commit -am <span class="tok-string">"Viết chương 2: yêu cầu hệ thống"</span>
<span class="tok-comment"># … edit line 2 in your editor, then:</span>
git -c user.name=An -c user.email=an@example.com commit -am <span class="tok-string">"Sửa tên đề tài theo góp ý của thầy"</span>
git log --format=<span class="tok-string">"%h %ad %an: %s"</span> --date=format:%d/%m
git diff HEAD~1</code></pre>
<div class="out">c09109c 16/09 An: Sửa tên đề tài theo góp ý của thầy
9925789 15/09 Binh: Viết chương 2: yêu cầu hệ thống
63a7a1a 14/09 An: Thêm dàn ý báo cáo
…
-Chương 1: Giới thiệu
+Chương 1: Giới thiệu đề tài đặt lịch phòng khám</div>
<p>(Real output from git 2.51. Your hashes and dates will differ — they depend on the exact content and the moment you commit.)</p>
<p><strong>Done when:</strong> <code>git log</code> shows three commits from two authors, and <code>git diff HEAD~1</code> shows exactly one <code>-</code> line and one <code>+</code> line — the answer to "what changed" that the folder of <code>_final_v2</code> files could never give you.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Version control system (VCS)</span><span class="v">A tool that records changes to files over time so you can get any earlier version back.</span></div>
  <div class="kv"><span class="k">Centralised vs distributed</span><span class="v">One server holds the history, versus every clone holding the complete history.</span></div>
  <div class="kv"><span class="k">Repository (repo)</span><span class="v">Your project folder plus the hidden <code>.git/</code> folder with its full history.</span></div>
  <div class="kv"><span class="k">Hosting service</span><span class="v">A website such as GitHub that stores a shared copy of a Git repository for a team.</span></div>
  <div class="kv"><span class="k">Diff</span><span class="v">The line-by-line difference between two versions: <code>-</code> lines removed, <code>+</code> lines added.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Folders of <code>_final_v2</code> files are a version control system — one that cannot say why, show what, merge, or go back safely.</li><li>Git is distributed: every clone is a full copy of the history, so it works offline and survives a server outage.</li><li>Git is not Dropbox: it syncs only when you deliberately commit and push, and that gap is where review happens.</li><li>Git is not GitHub: Git is the program on your machine; GitHub is a website that hosts repositories and adds PRs, issues and Actions.</li><li>Keep repositories out of Dropbox / Google Drive / OneDrive folders — use a Git remote to share.</li></ul>

<a class="link-card" href="https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 1.1 — About Version Control</span><span class="lc-sub">The three generations of VCS, with the classic diagrams.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/about" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">git-scm.com/about — the design goals, from the source</span><span class="lc-sub">Branching model, distributed nature, data assurance, staging area.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> putting a Git repository inside a Dropbox / Google Drive / OneDrive synced folder. The sync client and Git both write to <code>.git/</code>, and the sync client has no idea those files must change together. The classic result is a corrupted index or a half-written packfile, on a schedule nobody can reproduce. Keep repositories on ordinary local disk and use a Git remote for sharing — that is exactly what remotes are for.</div>
<p class="note-ct"><strong>Worth internalising now:</strong> Git never asks "what changed?". <em>You</em> tell it what belongs together, by choosing what to stage and when to commit. The quality of a repository's history is a direct reflection of that judgement — which is why Chapter 1 spends real time on the staging area rather than treating <code>git add .</code> as the only way.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Ai cũng tự phát minh ra quản lý phiên bản. Đa số phát minh ra một cái tồi.</h2>
<p class="lead">Trước khi chạm vào một lệnh nào, hãy rõ về vấn đề. Bạn đã từng dựng một hệ quản lý phiên bản rồi — nó chỉ trông thế này:</p>
<pre><code>bao_cao.docx
bao_cao_v2.docx
bao_cao_final.docx
bao_cao_final_SUA.docx
bao_cao_final_SUA_dung_ban_nay.docx
bao_cao_final_SUA_dung_ban_nay_(ban_cua_An).docx</code></pre>
<p>Đó là một hệ quản lý phiên bản thật. Nó có lưu các phiên bản. Nó cũng <em>tồi</em>, và đáng gọi tên chính xác vì sao, bởi mỗi khiếm khuyết ứng với một tính năng của Git.</p>

<h3>Bốn thứ cách-làm-bằng-thư-mục không làm được</h3>
${slide('git-00', 6, 'final_v2_THẬT.docx và git log')}
${slide('git-00', 7, 'Bốn thứ thư mục không làm được')}
<div class="kv-grid">
  <div class="kv"><span class="k">Không nói được VÌ SAO</span><span class="v">Tên file ghi lại <em>khi nào</em> một cách mập mờ, không bao giờ ghi <em>vì sao</em>. Sáu tháng sau không ai biết "SUA" đã sửa cái gì. Git gắn một lời nhắn, một tác giả và một dấu thời gian vào mọi phiên bản.</span></div>
  <div class="kv"><span class="k">Không cho thấy ĐÃ ĐỔI GÌ</span><span class="v">Muốn biết v2 khác final chỗ nào, bạn phải đọc cả hai tài liệu. Git tính hộ bạn phần khác biệt, từng dòng một, trong một giây.</span></div>
  <div class="kv"><span class="k">Không hợp nhất được việc của hai người</span><span class="v">Nếu An và Bình cùng sửa <code>bao_cao_final</code>, một người sẽ mất công. Git hợp nhất tự động cả hai bộ thay đổi khi chúng chạm những dòng khác nhau, và chỉ hỏi bạn ở chỗ chồng lấn thật sự.</span></div>
  <div class="kv"><span class="k">Không quay lại được an toàn</span><span class="v">Khôi phục bản cũ nghĩa là chép đè lên bản mới — huỷ luôn việc mới. Trong Git mọi phiên bản còn với tới được mãi mãi; quay lại là thêm vào lịch sử chứ không xoá đi.</span></div>
</div>

<h3>Hệ quản lý phiên bản là gì, nói cho chính xác</h3>
${slide('git-00', 8, 'Ba thế hệ quản lý phiên bản')}
<p>Một <strong>hệ quản lý phiên bản</strong> (VCS) ghi lại thay đổi trên một tập file theo thời gian để sau này bạn gọi lại được bất kỳ phiên bản cụ thể nào. Có ba thế hệ, và biết sự khác nhau giải thích được phần lớn thiết kế của Git:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Cục bộ</span><span class="lz-v">Phiên bản chỉ nằm trên máy bạn (RCS, hoặc mấy thư mục <code>_final_v2</code> của bạn). Không chia sẻ gì; laptop chết là dự án chết.</span></div>
  <div class="lz-layer"><span class="lz-k">Tập trung</span><span class="lz-v">Một máy chủ giữ lịch sử (CVS, Subversion, Perforce). Bạn "mượn" file từ đó. Dễ hình dung — nhưng máy chủ là điểm chết duy nhất, và bạn không commit được khi ngoại tuyến.</span></div>
  <div class="lz-layer"><span class="lz-k">Phân tán</span><span class="lz-v">Mỗi bản clone là một bản sao <strong>đầy đủ</strong> của toàn bộ lịch sử (Git, Mercurial). Bạn commit, tạo nhánh, so sánh và tìm trong lịch sử được ngay trên máy bay không mạng. Kho "trung tâm" chỉ là bản clone mà mọi người đồng ý coi là trung tâm.</span></div>
</div>
<div class="callout ok">Dòng cuối chính là toàn bộ ý nghĩa của chữ D trong <strong>DVCS</strong>. Khi bạn <code>git clone</code>, bạn không tải "các file hiện tại" — bạn tải <em>mọi phiên bản của mọi file từ khi dự án bắt đầu</em>, kèm tất cả nhánh và tag. Vì thế <code>git log</code> chạy tức thì và hoạt động ngoại tuyến, và vì thế GitHub sập không làm bạn ngừng làm việc.</div>

<h3>Git trong một đoạn lịch sử</h3>
<p>Năm 2005 nhân Linux mất quyền dùng cái VCS thương mại mà họ đang xài. Linus Torvalds viết một cái thay thế trong khoảng mười ngày, với ba mục tiêu thiết kế mà tới giờ vẫn giải thích mọi góc kỳ quặc của công cụ này: phải <strong>nhanh</strong> (hàng nghìn người đóng góp, kho mã khổng lồ), phải làm cho <strong>tạo nhánh và hợp nhất rẻ</strong> (nhân Linux sống trên các nhánh song song), và phải <strong>bảo đảm toàn vẹn</strong> — bạn phải chứng minh được rằng mã bạn đang có đúng từng bit với mã đã được commit. Mục tiêu thứ ba là lý do mọi thứ trong Git được định danh bằng mã băm SHA, thứ bạn sẽ gặp ở Chương 1.</p>

<h3>Git không phải Dropbox — khác biệt này quan trọng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dropbox / Google Drive</span><span class="v">Đồng bộ <em>liên tục và tự động</em>. Mỗi phím gõ rốt cuộc trở thành sự thật chung. Tuyệt cho tài liệu; thảm hoạ cho mã nguồn, vì một hàm viết dở sẽ lập tức làm hỏng việc của mọi người khác.</span></div>
  <div class="kv"><span class="k">Git</span><span class="v">Đồng bộ <em>có chủ ý</em>. Bạn quyết định khi nào một bộ thay đổi đủ mạch lạc để trở thành một phiên bản (<code>commit</code>), và tách bạch với việc khi nào nó sẵn sàng cho người khác (<code>push</code>). Chính khoảng ngắt có chủ ý đó là nơi review, test và CI sinh sống.</span></div>
</div>
<p>Đây là khác biệt văn hoá quan trọng nhất. Git không phải công cụ sao lưu tình cờ xử lý được mã nguồn. Nó là công cụ để <strong>đề xuất</strong> thay đổi, và lời đề xuất mới là đơn vị công việc.</p>

<h3>Git cũng không phải GitHub</h3>
${slide('git-00', 9, 'Git ≠ GitHub')}
<p>Người mới hay gọi hai cái tên như một. Chúng là hai thứ khác nhau, và nhầm chúng dẫn tới mô hình tư duy sai ("GitHub sập nên mình không commit được"):</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Git</span><span class="v">Một phần mềm miễn phí, mã nguồn mở, chạy trên máy <em>của bạn</em>. Commit, nhánh, merge và toàn bộ lịch sử nằm trong thư mục ẩn <code>.git/</code> của dự án. Nó chạy được khi không có mạng và không cần tài khoản nào.</span></div>
  <div class="kv"><span class="k">GitHub</span><span class="v">Một trang web (thuộc Microsoft) lưu hộ (host) các kho Git để cả nhóm dùng chung một kho. Nó thêm những thứ Git không có: pull request (yêu cầu gộp mã), issue (phiếu công việc), Actions (tự động hoá), Pages (trang web tĩnh). GitLab, Bitbucket, Gitea là các lựa chọn khác, nói cùng giao thức Git.</span></div>
</div>
<p>Mọi thứ trong Chương 1–4 diễn ra trong Git, trên laptop của bạn. GitHub bước vào ở Chương 5, khi bạn bắt đầu trao đổi commit với người khác qua <code>git push</code> và <code>git pull</code>.</p>

<h3>Bộ từ vựng bạn cần cho Chương 1</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">kho mã (repository, repo)</span><span class="v">Một thư mục dự án cộng với thư mục ẩn <code>.git/</code> giữ toàn bộ lịch sử của nó.</span></div>
  <div class="kv"><span class="k">commit</span><span class="v">Một phiên bản đã lưu — ảnh chụp toàn dự án cộng lời nhắn, tác giả và liên kết tới commit cha.</span></div>
  <div class="kv"><span class="k">nhánh (branch)</span><span class="v">Một con trỏ di chuyển được, trỏ tới một commit. Dùng để phát triển thứ gì đó mà không quấy vào dòng chính.</span></div>
  <div class="kv"><span class="k">remote</span><span class="v">Một bản sao khác của kho mã, thường nằm trên máy chủ như GitHub, để bạn trao đổi commit với nó.</span></div>
  <div class="kv"><span class="k">clone / push / pull</span><span class="v">Chép cả kho mã về · đẩy commit của bạn lên · kéo commit của người khác về.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Dựng lại câu chuyện "báo cáo" bằng Git thay vì bằng tên file. Trong một thư mục nháp bất kỳ: <code>mkdir bao-cao &amp;&amp; cd bao-cao &amp;&amp; git init</code>, tạo <code>bao-cao.md</code> có dòng tiêu đề và "Chương 1: Giới thiệu", rồi commit <em>dưới tên An</em> (cờ <code>-c</code> đặt tên cho đúng một lệnh — bạn sẽ cấu hình tên thật của mình ở bài 0.3).</li><li>Thêm dòng "Chương 2: Yêu cầu hệ thống" rồi commit <em>dưới tên Bình</em>.</li><li>Mở file bằng trình soạn thảo, sửa dòng 2 thành "Chương 1: Giới thiệu đề tài đặt lịch phòng khám", rồi commit dưới tên An với lời nhắn nói rõ <strong>vì sao</strong>.</li><li>Giờ trả lời, chỉ bằng Git: ai đã đổi tên đề tài, lúc nào, vì sao, và đúng dòng nào đã đổi?</li></ol>
<pre><code class="language-bash">printf <span class="tok-string">'# Báo cáo SWP391\\nChương 1: Giới thiệu\\n'</span> &gt; bao-cao.md
git add . &amp;&amp; git -c user.name=An -c user.email=an@example.com commit -m <span class="tok-string">"Thêm dàn ý báo cáo"</span>
printf <span class="tok-string">'Chương 2: Yêu cầu hệ thống\\n'</span> &gt;&gt; bao-cao.md
git -c user.name=Binh -c user.email=binh@example.com commit -am <span class="tok-string">"Viết chương 2: yêu cầu hệ thống"</span>
<span class="tok-comment"># … sửa dòng 2 trong trình soạn thảo, rồi:</span>
git -c user.name=An -c user.email=an@example.com commit -am <span class="tok-string">"Sửa tên đề tài theo góp ý của thầy"</span>
git log --format=<span class="tok-string">"%h %ad %an: %s"</span> --date=format:%d/%m
git diff HEAD~1</code></pre>
<div class="out">c09109c 16/09 An: Sửa tên đề tài theo góp ý của thầy
9925789 15/09 Binh: Viết chương 2: yêu cầu hệ thống
63a7a1a 14/09 An: Thêm dàn ý báo cáo
…
-Chương 1: Giới thiệu
+Chương 1: Giới thiệu đề tài đặt lịch phòng khám</div>
<p>(Output thật từ git 2.51. Mã băm và ngày của bạn sẽ khác — chúng phụ thuộc đúng nội dung và thời điểm bạn commit.)</p>
<p><strong>Đạt khi:</strong> <code>git log</code> có ba commit của hai tác giả, và <code>git diff HEAD~1</code> hiện đúng một dòng <code>-</code> và một dòng <code>+</code> — câu trả lời cho "đã đổi gì" mà thư mục đầy file <code>_final_v2</code> không bao giờ cho bạn được.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Version control system (VCS)</span><span class="v">Hệ quản lý phiên bản — công cụ ghi lại thay đổi của file theo thời gian để lấy lại được bất kỳ bản cũ nào.</span></div>
  <div class="kv"><span class="k">Centralised vs distributed</span><span class="v">Tập trung và phân tán — một máy chủ giữ lịch sử, so với mỗi bản clone đều giữ ĐỦ lịch sử.</span></div>
  <div class="kv"><span class="k">Repository (repo)</span><span class="v">Kho mã — thư mục dự án cộng thư mục ẩn <code>.git/</code> chứa toàn bộ lịch sử.</span></div>
  <div class="kv"><span class="k">Hosting service</span><span class="v">Dịch vụ lưu kho — trang web như GitHub giữ một bản sao dùng chung của kho Git cho cả nhóm.</span></div>
  <div class="kv"><span class="k">Diff</span><span class="v">Phần khác biệt — so từng dòng giữa hai phiên bản: dòng <code>-</code> bị bỏ, dòng <code>+</code> được thêm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Thư mục đầy file <code>_final_v2</code> cũng là một hệ quản lý phiên bản — một cái không nói được vì sao, không cho thấy đổi gì, không hợp nhất được, không quay lại an toàn được.</li><li>Git là phân tán: mỗi bản clone là bản sao đầy đủ của lịch sử, nên chạy được khi mất mạng và sống sót khi máy chủ sập.</li><li>Git không phải Dropbox: nó chỉ đồng bộ khi bạn chủ ý commit và push, và khoảng ngắt đó là nơi review diễn ra.</li><li>Git không phải GitHub: Git là phần mềm trên máy bạn; GitHub là trang web lưu kho và thêm PR, issue, Actions.</li><li>Đừng để kho mã trong thư mục Dropbox / Google Drive / OneDrive — chia sẻ bằng remote của Git.</li></ul>

<a class="link-card" href="https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 1.1 (tiếng Việt) — Về Quản Lý Phiên Bản</span><span class="lc-sub">Ba thế hệ VCS, kèm những sơ đồ kinh điển.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/about" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">git-scm.com/about — mục tiêu thiết kế, từ chính nguồn</span><span class="lc-sub">Mô hình nhánh, tính phân tán, bảo đảm dữ liệu, vùng staging.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đặt một kho Git bên trong thư mục được Dropbox / Google Drive / OneDrive đồng bộ. Cả trình đồng bộ lẫn Git đều ghi vào <code>.git/</code>, và trình đồng bộ không hề biết những file đó phải đổi cùng nhau. Kết quả kinh điển là index hỏng hoặc packfile viết dở, theo một lịch không ai tái hiện nổi. Hãy để kho mã trên đĩa cục bộ bình thường và dùng remote của Git để chia sẻ — remote sinh ra chính là để làm việc đó.</div>
<p class="note-ct"><strong>Đáng ghi nhớ ngay lúc này:</strong> Git không bao giờ hỏi "cái gì đã đổi?". Chính <em>bạn</em> nói cho nó biết những gì thuộc về nhau, bằng cách chọn thứ nào đưa vào staging và commit lúc nào. Chất lượng lịch sử của một kho mã phản ánh trực tiếp phán đoán đó — vì thế Chương 1 dành thời gian thật cho vùng staging thay vì coi <code>git add .</code> là cách duy nhất.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Install & configure Git, and create your SSH key|||0.3 — Cài đặt & cấu hình Git, và tạo khoá SSH',
      slug: 'git-0-3-cai-dat-cau-hinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cài Git trên Windows/macOS/Linux, đặt name và email đúng cách, chọn trình soạn thảo, xử lý CRLF/LF cho nhóm nhiều hệ điều hành, tạo khoá SSH ed25519 và nạp lên GitHub, rồi kiểm chứng bằng một lệnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Fifteen minutes of setup that prevents a year of small annoyances</h2>
<p class="lead">Most Git tutorials say "install Git, set your name, done". That is enough to make a commit and not enough to work in a team. Four of the settings below exist specifically to prevent problems that are painful to fix afterwards — line endings especially, which can turn a one-line change into a 4,000-line diff.</p>

<h3>1. Install</h3>
${slide('git-00', 10, 'Cài Git trên ba hệ điều hành')}
<div class="kv-grid">
  <div class="kv"><span class="k">Windows</span><span class="v">Install <strong>Git for Windows</strong> from git-scm.com. It bundles Git Bash, which gives you a real POSIX shell — use it for this course instead of PowerShell so every command in these lessons works verbatim.</span></div>
  <div class="kv"><span class="k">macOS</span><span class="v"><code>brew install git</code>. macOS ships an old Apple build; Homebrew's is current. Without Homebrew, running <code>git --version</code> once will offer to install the Xcode Command Line Tools.</span></div>
  <div class="kv"><span class="k">Linux</span><span class="v"><code>sudo apt install git</code> (Debian/Ubuntu) or <code>sudo dnf install git</code> (Fedora).</span></div>
</div>
<div class="callout ok"><strong>Checked against git-scm.com (as of 09/2026):</strong> the latest Git is <strong>2.55.0</strong>; Git for Windows is <strong>2.55.0(5)</strong>, released 20/08/2026, with separate installers for x64 and ARM64 plus a portable edition. On Windows you can also install from the terminal with <code>winget install --id Git.Git -e --source winget</code>. On macOS without Homebrew, <code>xcode-select --install</code> gives you Apple's build (older, but fine for this course); the old standalone macOS installer on git-scm.com is no longer maintained. On Ubuntu, <code>sudo add-apt-repository ppa:git-core/ppa</code> gets you the newest release instead of the distribution's one.</div>
<p>If your teammates are on Windows: during the Git for Windows installer, keep the defaults for line endings and the terminal — they match what this course assumes (Git Bash, <code>core.autocrlf true</code>). The one screen worth changing is the default editor: the installer suggests Vim, and picking VS Code or Nano there saves beginners from being stuck inside Vim on their first commit message.</p>
<p>Verify — anything from 2.30 upwards is fine for everything in this course:</p>
<pre><code>git --version</code></pre>
<div class="out">git version 2.43.0</div>

<h3>2. Identity — who is making these commits</h3>
<p>Every commit permanently records a name and an email. Set them once, globally:</p>
<pre><code>git config --global user.name <span class="tok-string">"Nguyen Van An"</span>
git config --global user.email <span class="tok-string">"an@example.com"</span></code></pre>
<div class="callout warn">Use the same email that is registered on your GitHub account, or GitHub will not link your commits to your profile and they will not appear in your contribution graph. If you want to keep your real address private, GitHub gives you a <code>noreply</code> address (Settings → Emails → "Keep my email addresses private") — use that one here instead.</div>

<h3>3. The settings that actually prevent bugs</h3>
<pre><code><span class="tok-comment"># The name of the first branch in a new repo. GitHub uses "main"; Git's</span>
<span class="tok-comment"># historical default was "master". Setting this avoids a mismatch on day one.</span>
git config --global init.defaultBranch main

<span class="tok-comment"># What "git pull" does when your branch and the remote have both moved.</span>
<span class="tok-comment"># Without this, modern Git refuses to pull and prints a wall of text.</span>
<span class="tok-comment"># "false" = create a merge commit. Chapter 5 explains the alternatives.</span>
git config --global pull.rebase false

<span class="tok-comment"># Line endings. THE setting people wish they had known about.</span>
git config --global core.autocrlf input    <span class="tok-comment"># macOS / Linux</span>
git config --global core.autocrlf true     <span class="tok-comment"># Windows</span>

<span class="tok-comment"># The editor Git opens for commit messages and interactive rebase.</span>
<span class="tok-comment"># The default on Linux is vim; if that is unfamiliar, pick one you can exit.</span>
git config --global core.editor <span class="tok-string">"code --wait"</span>   <span class="tok-comment"># VS Code</span>
git config --global core.editor <span class="tok-string">"nano"</span>          <span class="tok-comment"># or nano</span></code></pre>

<h3>Why line endings deserve their own paragraph</h3>
<p>Windows ends a line of text with two invisible characters (carriage return + line feed, <code>CRLF</code>); macOS and Linux use one (<code>LF</code>). If one teammate's editor saves CRLF and another's saves LF, Git sees <em>every line of the file</em> as changed. A one-word fix arrives as a 4,000-line diff that is impossible to review, and it happens again on every commit.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">setting</div><div class="lz-t">core.autocrlf = input</div><div class="lz-d">Convert CRLF → LF when committing; leave the working copy alone. The right choice on macOS/Linux.</div></div>
  <div class="lz-step"><div class="lz-k">setting</div><div class="lz-t">core.autocrlf = true</div><div class="lz-d">Convert CRLF → LF when committing, and LF → CRLF when checking out. The right choice on Windows.</div></div>
  <div class="lz-step"><div class="lz-k">result</div><div class="lz-t">The repository stores LF</div><div class="lz-d">Every machine gets what it wants locally, and the shared history stays uniform.</div></div>
</div>
<p>For a project you own, do better than relying on everyone's global config — commit a <code>.gitattributes</code> file so the rule travels with the repository:</p>
<pre><code><span class="tok-comment"># .gitattributes — normalise text, and mark binaries so Git never touches them</span>
* text=auto
*.sh   text eol=lf
*.bat  text eol=crlf
*.png  binary
*.pdf  binary</code></pre>

<h3>4. Read your configuration back</h3>
${slide('git-00', 11, 'git config tối thiểu và ba mức cấu hình')}
<pre><code>git config --list --show-origin</code></pre>
<div class="out">file:/home/an/.gitconfig        user.name=Nguyen Van An
file:/home/an/.gitconfig        user.email=an@example.com
file:/home/an/.gitconfig        init.defaultbranch=main
file:/home/an/.gitconfig        core.autocrlf=input</div>
<p>Git reads configuration from three levels, each overriding the one above it. Knowing the order saves you from "but I set that!":</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">--system</span><span class="lz-v"><code>/etc/gitconfig</code> — every user on the machine. Rarely touched.</span></div>
  <div class="lz-layer"><span class="lz-k">--global</span><span class="lz-v"><code>~/.gitconfig</code> — you, in every repository. This is where the commands above wrote.</span></div>
  <div class="lz-layer"><span class="lz-k">--local</span><span class="lz-v"><code>.git/config</code> — this one repository only, and it <strong>wins</strong>. Use it to commit to a work project under your work email.</span></div>
</div>

<p>To see which level a value came from without long file paths, ask for the <em>scope</em>. Inside a project where you set a local email, both values show up, and the last one wins:</p>
<pre><code class="language-bash">git config --show-scope --get-all user.email
git config user.email</code></pre>
<div class="out">global	cuong@example.com
local	cuong.nv@fpt.edu.vn
cuong.nv@fpt.edu.vn</div>
<h3>5. An SSH key for GitHub</h3>
${slide('git-00', 12, 'Khoá SSH: một cặp, hai nửa')}
<p>You can talk to GitHub over HTTPS with a personal access token, but SSH is nicer: no token to paste, no expiry to chase. Generate a modern <code>ed25519</code> key:</p>
<pre><code>ssh-keygen -t ed25519 -C <span class="tok-string">"an@example.com"</span>
<span class="tok-comment"># Press Enter to accept ~/.ssh/id_ed25519.</span>
<span class="tok-comment"># A passphrase is optional but recommended — the agent will remember it.</span>

<span class="tok-comment"># Start the agent and add the key so you type the passphrase once per session.</span>
eval <span class="tok-string">"\$(ssh-agent -s)"</span>
ssh-add ~/.ssh/id_ed25519

<span class="tok-comment"># Copy the PUBLIC half (.pub — never the other file) to your clipboard.</span>
cat ~/.ssh/id_ed25519.pub</code></pre>
<p>Paste it into GitHub → Settings → <strong>SSH and GPG keys</strong> → New SSH key. Then prove it works:</p>
<pre><code>ssh -T git@github.com</code></pre>
<div class="out">Hi an-nguyen! You've successfully authenticated, but GitHub does not provide shell access.</div>
<p>That message is a success, despite how it reads. GitHub deliberately refuses you a shell; the authentication is what we were testing.</p>
${slide('git-00', 13, 'Khoá SSH — output thật')}
<div class="callout warn"><strong>What you will really see (OpenSSH 10.3, 09/2026):</strong> after the passphrase prompts, <code>ssh-keygen</code> prints a fingerprint line such as <code>SHA256:asAafUeDlp1FG1HSFW5Ar4TpAUo7zkvyEt3QbKu9E58 cuong@example.com</code> and a small "randomart" box — both are normal. The first time you connect, SSH asks whether to trust <code>github.com</code>; answer <code>yes</code> only if the fingerprint matches the one GitHub publishes: <code>SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU</code> (ED25519). And if you run <code>ssh -T</code> before adding the key to GitHub, the answer is <code>git@github.com: Permission denied (publickey).</code> — that means "GitHub does not know this key yet", not that SSH is broken.</div>
<div class="callout danger">The two files are not interchangeable. <code>id_ed25519.pub</code> is the <strong>public</strong> key — safe to paste anywhere. <code>id_ed25519</code> with no extension is the <strong>private</strong> key — it is a password. Never paste it into a website, never commit it, never send it in a chat. If it ever leaks, delete the key on GitHub and generate a new pair.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Install Git for your OS (table above) and confirm <code>git --version</code> prints 2.30 or newer. Windows: do everything below in Git Bash.</li><li>Run the identity and "prevent bugs" settings with <strong>your</strong> name and the email that is on your GitHub account, then check them with <code>git config --list --show-scope</code>.</li><li>Go into the <code>bao-cao</code> folder from 0.2 and give it your school email only there: <code>git config user.email "you@fpt.edu.vn"</code>. Make one commit and check which email it carries.</li><li>Create an ed25519 key <em>with a passphrase</em>, add the <code>.pub</code> half on GitHub (Settings → SSH and GPG keys → New SSH key), and run <code>ssh -T git@github.com</code>.</li></ol>
<pre><code class="language-bash">git config --show-scope --get-all user.email
git log -1 --format=<span class="tok-string">"%h %an &lt;%ae&gt;"</span></code></pre>
<div class="out">global	cuong@example.com
local	cuong.nv@fpt.edu.vn
697bba5 Nguyen Van Cuong &lt;cuong.nv@fpt.edu.vn&gt;</div>
<p><strong>Done when:</strong> <code>git config --list --show-scope</code> lists your name, email, <code>init.defaultbranch=main</code> and <code>core.autocrlf</code>; the commit in <code>bao-cao</code> carries the school email while your global email is unchanged; and <code>ssh -T git@github.com</code> greets <strong>your</strong> GitHub username.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Global / local config</span><span class="v"><code>~/.gitconfig</code> applies to you everywhere; <code>.git/config</code> applies to one repository and wins.</span></div>
  <div class="kv"><span class="k">Line endings (CRLF / LF)</span><span class="v">Windows ends lines with two invisible characters, macOS/Linux with one; <code>core.autocrlf</code> converts them.</span></div>
  <div class="kv"><span class="k">SSH key pair</span><span class="v">Two files made together: a private key that stays on your machine and a public key you give to GitHub.</span></div>
  <div class="kv"><span class="k">Passphrase</span><span class="v">A password that protects the private key file itself; the ssh-agent remembers it for the session.</span></div>
  <div class="kv"><span class="k">Fingerprint</span><span class="v">A short hash that identifies a key — used to check you are really talking to github.com.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Install Git from the official source for your OS; 2.30 or newer is enough for this course.</li><li>Set <code>user.name</code> and <code>user.email</code> once, globally, with the email that is on your GitHub account.</li><li>A local <code>git config</code> inside a repository overrides the global one — use it for school or company email.</li><li><code>ssh-keygen -t ed25519</code> makes a key pair; only the <code>.pub</code> half ever leaves your machine.</li><li><code>ssh -T git@github.com</code> answering "Hi username!" is success; "Permission denied (publickey)" means the key is not on GitHub yet.</li></ul>

<a class="link-card" href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Connecting to GitHub with SSH</span><span class="lc-sub">Per-OS instructions, agent setup, and troubleshooting a refused key.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-config" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">git config — the full list of settings</span><span class="lc-sub">Every option, with its default and its scope. Search this before inventing a workaround.</span></span>
</a>

<a class="link-card" href="https://git-scm.com/downloads" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">git-scm.com — Install Git</span><span class="lc-sub">The official install page for macOS, Windows and Linux, with the current version number.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Testing your SSH connection</span><span class="lc-sub">The exact success message and GitHub's published host-key fingerprints.</span></span>
</a>
<div class="pitfall"><strong>Trap:</strong> setting <code>user.email</code> to something that is not on your GitHub account, then wondering why months of work shows up as "unknown author" and your contribution graph stays empty. Fixing it later means <em>rewriting history</em> (Chapter 8) on every affected commit. Check it now: <code>git config user.email</code>.</div>
<p class="note-ct"><strong>One habit worth forming today:</strong> when you clone a repository for a client or employer, immediately run <code>git config user.email work@company.com</code> <em>inside that repository</em>. Local config beats global, so your personal address never leaks into their history and their address never leaks into your open-source commits.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Mười lăm phút cài đặt để tránh một năm bực bội vặt</h2>
<p class="lead">Đa số hướng dẫn Git nói "cài Git, đặt tên, xong". Thế là đủ để tạo một commit và KHÔNG đủ để làm việc trong một nhóm. Bốn thiết lập dưới đây tồn tại đúng để chặn những vấn đề rất khó sửa về sau — nhất là ký tự xuống dòng, thứ có thể biến một thay đổi một dòng thành một diff 4.000 dòng.</p>

<h3>1. Cài đặt</h3>
${slide('git-00', 10, 'Cài Git trên ba hệ điều hành')}
<div class="kv-grid">
  <div class="kv"><span class="k">Windows</span><span class="v">Cài <strong>Git for Windows</strong> từ git-scm.com. Nó kèm Git Bash, cho bạn một shell POSIX thật — dùng nó cho khoá này thay vì PowerShell để mọi lệnh trong các bài chạy đúng nguyên văn.</span></div>
  <div class="kv"><span class="k">macOS</span><span class="v"><code>brew install git</code>. macOS đi kèm một bản Apple cũ; bản của Homebrew mới hơn. Không có Homebrew thì chỉ cần chạy <code>git --version</code> một lần, máy sẽ mời cài Xcode Command Line Tools.</span></div>
  <div class="kv"><span class="k">Linux</span><span class="v"><code>sudo apt install git</code> (Debian/Ubuntu) hoặc <code>sudo dnf install git</code> (Fedora).</span></div>
</div>
<div class="callout ok"><strong>Đã đối chiếu với git-scm.com (tính đến 09/2026):</strong> Git mới nhất là <strong>2.55.0</strong>; Git for Windows là <strong>2.55.0(5)</strong>, phát hành 20/08/2026, có bộ cài riêng cho x64 và ARM64 cùng một bản portable (chạy không cần cài). Trên Windows bạn cũng cài được từ terminal bằng <code>winget install --id Git.Git -e --source winget</code>. Trên macOS không có Homebrew, <code>xcode-select --install</code> cho bạn bản của Apple (cũ hơn, nhưng đủ cho khoá này); bộ cài macOS riêng trên git-scm.com đã ngừng được bảo trì. Trên Ubuntu, <code>sudo add-apt-repository ppa:git-core/ppa</code> cho bạn bản mới nhất thay vì bản của bản phân phối.</div>
<p>Nếu bạn cùng nhóm dùng Windows: trong trình cài Git for Windows, cứ giữ mặc định ở phần ký tự xuống dòng và terminal — chúng khớp với những gì khoá này giả định (Git Bash, <code>core.autocrlf true</code>). Màn hình duy nhất nên đổi là trình soạn thảo mặc định: trình cài gợi ý Vim, và chọn VS Code hoặc Nano ở đó giúp người mới khỏi bị kẹt trong Vim ngay lời nhắn commit đầu tiên.</p>
<p>Kiểm chứng — từ 2.30 trở lên là đủ cho mọi thứ trong khoá này:</p>
<pre><code>git --version</code></pre>
<div class="out">git version 2.43.0</div>

<h3>2. Danh tính — ai đang tạo ra những commit này</h3>
<p>Mọi commit đều ghi vĩnh viễn một cái tên và một email. Đặt một lần, ở mức toàn cục:</p>
<pre><code>git config --global user.name <span class="tok-string">"Nguyen Van An"</span>
git config --global user.email <span class="tok-string">"an@example.com"</span></code></pre>
<div class="callout warn">Dùng đúng email đã đăng ký trên tài khoản GitHub, nếu không GitHub sẽ không nối commit của bạn với hồ sơ và chúng không hiện trong biểu đồ đóng góp. Nếu muốn giữ kín địa chỉ thật, GitHub cấp cho bạn một địa chỉ <code>noreply</code> (Settings → Emails → "Keep my email addresses private") — dùng địa chỉ đó ở đây.</div>

<h3>3. Những thiết lập thật sự ngăn được lỗi</h3>
<pre><code><span class="tok-comment"># Tên nhánh đầu tiên trong một kho mới. GitHub dùng "main"; mặc định lịch sử</span>
<span class="tok-comment"># của Git là "master". Đặt cái này để khỏi lệch nhau ngay ngày đầu.</span>
git config --global init.defaultBranch main

<span class="tok-comment"># "git pull" làm gì khi nhánh của bạn và remote cùng tiến lên.</span>
<span class="tok-comment"># Không đặt thì Git đời mới từ chối pull và in ra một bức tường chữ.</span>
<span class="tok-comment"># "false" = tạo một commit hợp nhất. Chương 5 giải thích các lựa chọn khác.</span>
git config --global pull.rebase false

<span class="tok-comment"># Ký tự xuống dòng. THIẾT LẬP mà ai cũng ước biết sớm hơn.</span>
git config --global core.autocrlf input    <span class="tok-comment"># macOS / Linux</span>
git config --global core.autocrlf true     <span class="tok-comment"># Windows</span>

<span class="tok-comment"># Trình soạn thảo Git mở cho lời nhắn commit và rebase tương tác.</span>
<span class="tok-comment"># Mặc định trên Linux là vim; nếu lạ lẫm, chọn cái nào bạn thoát được.</span>
git config --global core.editor <span class="tok-string">"code --wait"</span>   <span class="tok-comment"># VS Code</span>
git config --global core.editor <span class="tok-string">"nano"</span>          <span class="tok-comment"># hoặc nano</span></code></pre>

<h3>Vì sao ký tự xuống dòng xứng đáng một đoạn riêng</h3>
<p>Windows kết thúc một dòng chữ bằng hai ký tự vô hình (carriage return + line feed, <code>CRLF</code>); macOS và Linux dùng một (<code>LF</code>). Nếu trình soạn thảo của một đồng đội lưu CRLF còn của người kia lưu LF, Git thấy <em>mọi dòng của file</em> đều đã đổi. Một sửa đổi một chữ tới tay người review dưới dạng diff 4.000 dòng không thể review nổi, và chuyện đó lặp lại ở mọi commit.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">thiết lập</div><div class="lz-t">core.autocrlf = input</div><div class="lz-d">Đổi CRLF → LF khi commit; để yên bản làm việc. Lựa chọn đúng trên macOS/Linux.</div></div>
  <div class="lz-step"><div class="lz-k">thiết lập</div><div class="lz-t">core.autocrlf = true</div><div class="lz-d">Đổi CRLF → LF khi commit, và LF → CRLF khi checkout. Lựa chọn đúng trên Windows.</div></div>
  <div class="lz-step"><div class="lz-k">kết quả</div><div class="lz-t">Kho mã lưu LF</div><div class="lz-d">Mỗi máy nhận thứ nó muốn ở cục bộ, còn lịch sử chung thì đồng nhất.</div></div>
</div>
<p>Với dự án của chính bạn, hãy làm tốt hơn là trông vào cấu hình toàn cục của từng người — commit một file <code>.gitattributes</code> để luật đi theo kho mã:</p>
<pre><code><span class="tok-comment"># .gitattributes — chuẩn hoá file chữ, và đánh dấu file nhị phân để Git đừng đụng</span>
* text=auto
*.sh   text eol=lf
*.bat  text eol=crlf
*.png  binary
*.pdf  binary</code></pre>

<h3>4. Đọc lại cấu hình của bạn</h3>
${slide('git-00', 11, 'git config tối thiểu và ba mức cấu hình')}
<pre><code>git config --list --show-origin</code></pre>
<div class="out">file:/home/an/.gitconfig        user.name=Nguyen Van An
file:/home/an/.gitconfig        user.email=an@example.com
file:/home/an/.gitconfig        init.defaultbranch=main
file:/home/an/.gitconfig        core.autocrlf=input</div>
<p>Git đọc cấu hình từ ba mức, mức dưới đè lên mức trên. Biết thứ tự này cứu bạn khỏi câu "nhưng tôi đã đặt rồi mà!":</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">--system</span><span class="lz-v"><code>/etc/gitconfig</code> — mọi người dùng trên máy. Hiếm khi đụng tới.</span></div>
  <div class="lz-layer"><span class="lz-k">--global</span><span class="lz-v"><code>~/.gitconfig</code> — riêng bạn, ở mọi kho mã. Đây là nơi các lệnh phía trên ghi vào.</span></div>
  <div class="lz-layer"><span class="lz-k">--local</span><span class="lz-v"><code>.git/config</code> — chỉ một kho mã này, và nó <strong>thắng</strong>. Dùng nó để commit vào dự án công ty bằng email công ty.</span></div>
</div>

<p>Muốn biết một giá trị đến từ mức nào mà không phải đọc đường dẫn file dài, hãy hỏi <em>phạm vi</em> (scope). Trong một dự án có đặt email cục bộ, cả hai giá trị cùng hiện ra, và giá trị cuối cùng thắng:</p>
<pre><code class="language-bash">git config --show-scope --get-all user.email
git config user.email</code></pre>
<div class="out">global	cuong@example.com
local	cuong.nv@fpt.edu.vn
cuong.nv@fpt.edu.vn</div>
<h3>5. Một khoá SSH cho GitHub</h3>
${slide('git-00', 12, 'Khoá SSH: một cặp, hai nửa')}
<p>Bạn nói chuyện với GitHub qua HTTPS bằng personal access token cũng được, nhưng SSH dễ chịu hơn: không phải dán token, không phải chạy theo hạn dùng. Tạo một khoá <code>ed25519</code> đời mới:</p>
<pre><code>ssh-keygen -t ed25519 -C <span class="tok-string">"an@example.com"</span>
<span class="tok-comment"># Nhấn Enter để nhận ~/.ssh/id_ed25519.</span>
<span class="tok-comment"># Mật khẩu bảo vệ là tuỳ chọn nhưng nên có — agent sẽ nhớ hộ bạn.</span>

<span class="tok-comment"># Chạy agent và nạp khoá để mỗi phiên chỉ gõ mật khẩu một lần.</span>
eval <span class="tok-string">"\$(ssh-agent -s)"</span>
ssh-add ~/.ssh/id_ed25519

<span class="tok-comment"># Chép nửa CÔNG KHAI (.pub — tuyệt đối không phải file kia) vào clipboard.</span>
cat ~/.ssh/id_ed25519.pub</code></pre>
<p>Dán nó vào GitHub → Settings → <strong>SSH and GPG keys</strong> → New SSH key. Rồi chứng minh nó chạy:</p>
<pre><code>ssh -T git@github.com</code></pre>
<div class="out">Hi an-nguyen! You've successfully authenticated, but GitHub does not provide shell access.</div>
<p>Thông báo đó là THÀNH CÔNG, dù đọc lên nghe như thất bại. GitHub cố tình không cho bạn một shell; thứ ta đang kiểm là việc xác thực.</p>
${slide('git-00', 13, 'Khoá SSH — output thật')}
<div class="callout warn"><strong>Thứ bạn sẽ thấy thật (OpenSSH 10.3, 09/2026):</strong> sau hai lần hỏi passphrase (mật khẩu bảo vệ khoá), <code>ssh-keygen</code> in một dòng fingerprint (vân tay khoá) kiểu <code>SHA256:asAafUeDlp1FG1HSFW5Ar4TpAUo7zkvyEt3QbKu9E58 cuong@example.com</code> và một ô "randomart" nhỏ — cả hai đều bình thường. Lần đầu kết nối, SSH hỏi có tin <code>github.com</code> không; chỉ trả lời <code>yes</code> khi vân tay khớp với cái GitHub công bố: <code>SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU</code> (ED25519). Và nếu bạn chạy <code>ssh -T</code> TRƯỚC khi nạp khoá lên GitHub, câu trả lời là <code>git@github.com: Permission denied (publickey).</code> — nghĩa là "GitHub chưa biết khoá này", không phải SSH hỏng.</div>
<div class="callout danger">Hai file đó không thay thế cho nhau được. <code>id_ed25519.pub</code> là khoá <strong>công khai</strong> — dán đâu cũng an toàn. <code>id_ed25519</code> không có đuôi là khoá <strong>riêng tư</strong> — nó là một mật khẩu. Đừng bao giờ dán nó vào một trang web, đừng commit, đừng gửi qua chat. Nếu lỡ lộ, xoá khoá đó trên GitHub và tạo cặp mới.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Cài Git cho hệ điều hành của bạn (bảng phía trên) và xác nhận <code>git --version</code> in ra từ 2.30 trở lên. Windows: làm mọi bước dưới đây trong Git Bash.</li><li>Chạy các thiết lập danh tính và "chặn lỗi" với tên của <strong>bạn</strong> và đúng email trên tài khoản GitHub, rồi kiểm bằng <code>git config --list --show-scope</code>.</li><li>Vào thư mục <code>bao-cao</code> từ bài 0.2 và chỉ ở đó đặt email trường: <code>git config user.email "ban@fpt.edu.vn"</code>. Tạo một commit rồi kiểm nó mang email nào.</li><li>Tạo khoá ed25519 <em>có passphrase</em>, nạp nửa <code>.pub</code> lên GitHub (Settings → SSH and GPG keys → New SSH key), rồi chạy <code>ssh -T git@github.com</code>.</li></ol>
<pre><code class="language-bash">git config --show-scope --get-all user.email
git log -1 --format=<span class="tok-string">"%h %an &lt;%ae&gt;"</span></code></pre>
<div class="out">global	cuong@example.com
local	cuong.nv@fpt.edu.vn
697bba5 Nguyen Van Cuong &lt;cuong.nv@fpt.edu.vn&gt;</div>
<p><strong>Đạt khi:</strong> <code>git config --list --show-scope</code> liệt kê tên, email, <code>init.defaultbranch=main</code> và <code>core.autocrlf</code> của bạn; commit trong <code>bao-cao</code> mang email trường còn email toàn cục không đổi; và <code>ssh -T git@github.com</code> chào đúng username GitHub của <strong>bạn</strong>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Global / local config</span><span class="v">Cấu hình toàn cục / cục bộ — <code>~/.gitconfig</code> áp cho bạn ở mọi nơi; <code>.git/config</code> chỉ áp cho một kho và thắng.</span></div>
  <div class="kv"><span class="k">Line endings (CRLF / LF)</span><span class="v">Ký tự xuống dòng — Windows kết thúc dòng bằng hai ký tự vô hình, macOS/Linux bằng một; <code>core.autocrlf</code> chuyển đổi chúng.</span></div>
  <div class="kv"><span class="k">SSH key pair</span><span class="v">Cặp khoá SSH — hai file sinh cùng lúc: khoá riêng nằm yên trên máy bạn, khoá công khai đưa cho GitHub.</span></div>
  <div class="kv"><span class="k">Passphrase</span><span class="v">Mật khẩu bảo vệ chính file khoá riêng; ssh-agent nhớ hộ bạn trong phiên làm việc.</span></div>
  <div class="kv"><span class="k">Fingerprint</span><span class="v">Vân tay khoá — một mã băm ngắn định danh một khoá, dùng để kiểm bạn đang nói chuyện với đúng github.com.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Cài Git từ nguồn chính thức cho hệ điều hành của bạn; từ 2.30 trở lên là đủ cho khoá này.</li><li>Đặt <code>user.name</code> và <code>user.email</code> một lần, ở mức toàn cục, bằng đúng email trên tài khoản GitHub.</li><li><code>git config</code> cục bộ trong một kho đè lên cấu hình toàn cục — dùng cho email trường hoặc email công ty.</li><li><code>ssh-keygen -t ed25519</code> tạo một cặp khoá; chỉ nửa <code>.pub</code> được phép rời khỏi máy bạn.</li><li><code>ssh -T git@github.com</code> trả lời "Hi username!" là thành công; "Permission denied (publickey)" nghĩa là khoá chưa có trên GitHub.</li></ul>

<a class="link-card" href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Kết nối GitHub bằng SSH</span><span class="lc-sub">Hướng dẫn theo từng hệ điều hành, cài agent, và gỡ rối khi khoá bị từ chối.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-config" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">git config — danh sách đầy đủ các thiết lập</span><span class="lc-sub">Mọi tuỳ chọn, kèm giá trị mặc định và phạm vi. Tra ở đây trước khi nghĩ ra một cách lách.</span></span>
</a>

<a class="link-card" href="https://git-scm.com/downloads" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">git-scm.com — Cài đặt Git</span><span class="lc-sub">Trang cài đặt chính thức cho macOS, Windows và Linux, kèm số phiên bản hiện hành.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Kiểm tra kết nối SSH</span><span class="lc-sub">Câu chào thành công chính xác và vân tay khoá máy chủ mà GitHub công bố.</span></span>
</a>
<div class="pitfall"><strong>Bẫy:</strong> đặt <code>user.email</code> thành một địa chỉ không có trên tài khoản GitHub, rồi thắc mắc vì sao hàng tháng trời làm việc hiện ra dưới dạng "tác giả không rõ" và biểu đồ đóng góp vẫn trống. Sửa về sau nghĩa là <em>viết lại lịch sử</em> (Chương 8) trên mọi commit bị ảnh hưởng. Kiểm ngay: <code>git config user.email</code>.</div>
<p class="note-ct"><strong>Một thói quen đáng tạo ngay hôm nay:</strong> khi clone kho mã cho khách hàng hay công ty, chạy ngay <code>git config user.email work@company.com</code> <em>bên trong kho đó</em>. Cấu hình cục bộ thắng toàn cục, nên địa chỉ cá nhân không bao giờ lọt vào lịch sử của họ và địa chỉ của họ không lọt vào các commit mã nguồn mở của bạn.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — How to study this course (and a safe playground)|||0.4 — Cách học khoá này (và một sân tập an toàn)',
      slug: 'git-0-4-cach-hoc',
      type: 'LESSON',
      description: 'Vì sao đọc về Git không dạy được tay bạn, cách dựng một kho nháp để phá thoải mái, ba câu hỏi phải trả lời được trước mọi lệnh, và bộ lệnh chẩn đoán khi bạn lạc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Build a playground you are allowed to destroy</h2>
<p class="lead">Git is a hands skill. Reading about <code>reset --hard</code> teaches you nothing; running it on a throwaway repository, watching your file vanish, and getting it back with <code>reflog</code> teaches you permanently. Set up that playground now — it takes twenty seconds and you will use it in every chapter.</p>

<h3>The scratch repository</h3>
${slide('git-00', 14, 'Sân tập thu-git: phá thoải mái, cứu được hết')}
<pre><code>mkdir -p ~/git-lab &amp;&amp; cd ~/git-lab
git init
printf <span class="tok-string">'line one\\n'</span> &gt; a.txt
git add a.txt
git commit -m <span class="tok-string">"first commit"</span></code></pre>
<div class="out">Initialized empty Git repository in /home/an/git-lab/.git/
[main (root-commit) 8f3c1a2] first commit
 1 file changed, 1 insertion(+)
 create mode 100644 a.txt</div>
<p>That is a complete repository. Nothing in it matters, which is exactly the point: you can run any command in this course against it, including the destructive ones, and the worst case is <code>rm -rf ~/git-lab</code> and thirty seconds to rebuild.</p>
<div class="callout ok">Keep a second terminal open on this folder for the whole course. When a lesson shows a command, run it there <em>before</em> reading the explanation of what it did. Predicting, then checking, is what makes the model stick.</div>
<div class="callout warn"><strong>One name for the playground:</strong> from Chapter 1 onwards every practice box calls this repository <code>thu-git</code> ("try git"). The folder name does not matter to Git, but if you want the practice commands to work word for word, create it as <code>~/thu-git</code> instead of <code>~/git-lab</code>. Never practise inside your real team project — the whole point is a repository nobody else depends on.</div>

<h3>A generator for interesting history</h3>
<p>Several chapters need a repository with a real history to search. This loop builds one with ten commits in a couple of seconds:</p>
<pre><code>cd ~/git-lab
<span class="tok-keyword">for</span> i <span class="tok-keyword">in</span> \$(seq 1 10); <span class="tok-keyword">do</span>
  <span class="tok-keyword">echo</span> <span class="tok-string">"change \$i"</span> &gt;&gt; a.txt
  git commit -am <span class="tok-string">"commit number \$i"</span> &gt;/dev/null
<span class="tok-keyword">done</span>
git log --oneline</code></pre>
<div class="out">1a2b3c4 commit number 10
5d6e7f8 commit number 9
9a0b1c2 commit number 8
…
8f3c1a2 first commit</div>

<h3>Three questions to answer before you press Enter</h3>
${slide('git-00', 15, 'Ba câu hỏi trước khi bấm Enter + bộ ba chẩn đoán')}
<p>This is the single habit that separates people who are comfortable with Git from people who are not. Before running anything you are unsure about, answer:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Which of the three trees does this touch?</div><div class="lz-d">Working directory, staging area, or committed history? (Chapter 1 defines all three.)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Does it move a pointer or create an object?</div><div class="lz-d">Moving a branch pointer is cheap and reversible. Deleting uncommitted file content is not.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Has this commit been pushed?</div><div class="lz-d">Anything already shared is other people's problem too. Rewriting it needs a conversation, not a flag.</div></div>
</div>
<p>Almost every Git horror story is question 3 answered wrong. Rewriting your own unpushed work is free; rewriting shared history is a coordination problem that no command can solve for you.</p>

<h3>The one rule about lost work</h3>
<div class="callout ok"><strong>If it was ever committed, it is not gone.</strong> Git keeps unreachable commits for at least 30 days, and <code>git reflog</code> lists every position <code>HEAD</code> has ever held on your machine. A "lost" branch, a bad <code>reset --hard</code>, a botched rebase — all recoverable in one command. Chapter 4.4 covers it; until then, simply know that panic is unnecessary.</div>
<p>The genuine exception, and the only one worth fearing: changes you <strong>never committed</strong>. Git cannot restore what it was never shown. That is the practical argument for committing often on a local branch — commits are free, and each one is a save point.</p>

<h3>When you get lost — the diagnostic trio</h3>
<p>Three commands answer "where am I and what is going on?". Run them whenever a lesson leaves you unsure:</p>
<pre><code>git status                        <span class="tok-comment"># which branch, what is staged, what is modified</span>
git log --oneline --graph --all -20   <span class="tok-comment"># the shape of history, all branches</span>
git reflog -10                    <span class="tok-comment"># where HEAD has been recently</span></code></pre>
<p>Make the middle one an alias — you will type it hundreds of times:</p>
<pre><code>git config --global alias.lg <span class="tok-string">"log --oneline --graph --all --decorate -20"</span>
git lg</code></pre>
<div class="out">* 1a2b3c4 (HEAD -&gt; main) commit number 10
* 5d6e7f8 commit number 9
* 9a0b1c2 commit number 8</div>

<h3>How to pace the course</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chapters 1–4</span><span class="v">Do these in order and do not skip. They are the model; everything later assumes them. Roughly one chapter per sitting.</span></div>
  <div class="kv"><span class="k">Chapters 5–8</span><span class="v">Team work. Best absorbed while actually collaborating on something, even a two-person project.</span></div>
  <div class="kv"><span class="k">Chapter 9</span><span class="v">Internals. Optional for shipping code, transformative for confidence. Read it once the earlier chapters feel routine.</span></div>
  <div class="kv"><span class="k">Chapters 10–14</span><span class="v">Reference-shaped. Read what you need when you need it; Chapter 13 in particular is a cookbook to open mid-emergency.</span></div>
</div>
<div class="callout ok"><strong>Update 09/2026 — Chapters 14–16:</strong> the table above was written for the original plan. For the three new chapters: read <strong>Chapter 14</strong> (Git inside VS Code and other tools) any time after Chapter 4, once you know what the buttons should be doing; <strong>Chapter 15</strong> (GitHub for students) any time after Chapter 6; and keep <strong>Chapter 16</strong> (the team capstone) for last, because it uses everything — it ends with the 20-question final exam.</div>

<h3>🧪 Practice (15–20 min)</h3>
${slide('git-00', 17, 'Thực hành Mục 0 (30 phút)')}
<div class="callout ok"><ol><li>Build the playground: <code>mkdir -p ~/thu-git &amp;&amp; cd ~/thu-git &amp;&amp; git init</code>, one file, one first commit, then five more commits with the loop below. Set up the <code>git lg</code> alias.</li><li>Before the next step, answer the three questions out loud for <code>git reset --hard HEAD~3</code>: which trees does it touch, does it move a pointer, has anything been pushed?</li><li>Run it. <code>git lg</code> now shows only three commits — "commit số 3, 4, 5" seem gone.</li><li>Run <code>git reflog -5</code>, find the line that still says "commit số 5", and move back to it.</li></ol>
<pre><code class="language-bash">printf <span class="tok-string">'dòng một\\n'</span> &gt; a.txt &amp;&amp; git add a.txt &amp;&amp; git commit -m <span class="tok-string">"commit đầu tiên"</span>
<span class="tok-keyword">for</span> i <span class="tok-keyword">in</span> \$(seq 1 5); <span class="tok-keyword">do</span> <span class="tok-keyword">echo</span> <span class="tok-string">"thay đổi \$i"</span> &gt;&gt; a.txt; git commit -qam <span class="tok-string">"commit số \$i"</span>; <span class="tok-keyword">done</span>
git reset --hard HEAD~3
git reflog -5
git reset --hard <span class="tok-string">"HEAD@{1}"</span>    <span class="tok-comment"># quotes keep PowerShell happy too</span></code></pre>
<div class="out">HEAD is now at 9bdc2af commit số 2
9bdc2af HEAD@{0}: reset: moving to HEAD~3
17f6418 HEAD@{1}: commit: commit số 5
f1c7ab1 HEAD@{2}: commit: commit số 4
9e09032 HEAD@{3}: commit: commit số 3
9bdc2af HEAD@{4}: commit: commit số 2
HEAD is now at 17f6418 commit số 5</div>
<p>(Real output from git 2.51 — your hashes will be different.)</p>
<p><strong>Done when:</strong> <code>git lg</code> in <code>~/thu-git</code> shows "commit số 5" at the top with <code>(HEAD -&gt; main)</code>, <code>git status</code> says "nothing to commit, working tree clean", and you can explain why <code>HEAD@{1}</code> was the right target.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Playground / scratch repo</span><span class="v">A throwaway repository (<code>thu-git</code>) where breaking things costs nothing.</span></div>
  <div class="kv"><span class="k">Reflog</span><span class="v">Git's local diary of every place <code>HEAD</code> has been — the undo button for the undo button.</span></div>
  <div class="kv"><span class="k">Reachable / unreachable commit</span><span class="v">A commit that a branch or tag still leads to, versus one only the reflog remembers (kept at least 30 days).</span></div>
  <div class="kv"><span class="k">Alias</span><span class="v">A short name you define for a long command, such as <code>git lg</code>.</span></div>
  <div class="kv"><span class="k">Diagnostic trio</span><span class="v"><code>git status</code>, <code>git lg</code>, <code>git reflog</code> — the three commands to run whenever you are lost.</span></div>
</div>

<h3>📌 Summary</h3>
${slide('git-00', 16, 'Bảng tra nhanh Mục 0')}
<ul><li>Git is learned by hand: run every command in <code>~/thu-git</code>, never in your real team project.</li><li>Before any unfamiliar command, ask: which tree, pointer or object, and has it been pushed?</li><li>If it was ever committed, <code>git reflog</code> can bring it back; only never-committed changes are truly lost.</li><li>When lost, run <code>git status</code>, <code>git lg</code> and <code>git reflog -10</code> before typing anything else.</li><li>Do Chapters 1–4 in order, then use the rest as needed; Chapter 16 and its 20-question final exam come last.</li></ul>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice after each chapter: the Git track on Code Lab</span><span class="lc-sub">Graded exercises with solutions, ordered to match these chapters.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">git-scm.com/docs — the reference manual</span><span class="lc-sub">Every command. Also available offline: <code>git help &lt;command&gt;</code>.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> learning Git only through a GUI (VS Code's Source Control panel, GitHub Desktop, Sourcetree). GUIs are excellent once you have the model, because they show you the graph. Before that they hide the very distinction you need to learn: the button says "Sync", but was that a fetch, a merge, a rebase, or a push? Learn on the command line for this course, then use whichever GUI you like — you will understand what its buttons actually do.</div>
<p class="note-ct"><strong>A note on memorising:</strong> do not. There are roughly 150 Git commands and nobody knows them all. Learn the <em>model</em> (three trees, snapshots, pointers) and about fifteen commands; look the rest up. Someone who understands the model can find the right command in the docs in a minute, while someone who memorised commands is stuck the moment the situation is slightly different.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Dựng một sân tập mà bạn được phép phá nát</h2>
<p class="lead">Git là kỹ năng của đôi tay. Đọc về <code>reset --hard</code> không dạy bạn được gì; chạy nó trên một kho vứt đi, nhìn file biến mất, rồi lấy lại bằng <code>reflog</code> thì dạy bạn vĩnh viễn. Dựng sân tập đó ngay bây giờ — mất hai mươi giây và bạn sẽ dùng nó ở mọi chương.</p>

<h3>Kho mã nháp</h3>
${slide('git-00', 14, 'Sân tập thu-git: phá thoải mái, cứu được hết')}
<pre><code>mkdir -p ~/git-lab &amp;&amp; cd ~/git-lab
git init
printf <span class="tok-string">'line one\\n'</span> &gt; a.txt
git add a.txt
git commit -m <span class="tok-string">"first commit"</span></code></pre>
<div class="out">Initialized empty Git repository in /home/an/git-lab/.git/
[main (root-commit) 8f3c1a2] first commit
 1 file changed, 1 insertion(+)
 create mode 100644 a.txt</div>
<p>Đó là một kho mã hoàn chỉnh. Không có gì trong đó quan trọng, và đấy chính là mục đích: bạn chạy được mọi lệnh của khoá này lên nó, kể cả những lệnh phá hoại, và tệ nhất là <code>rm -rf ~/git-lab</code> cùng ba mươi giây dựng lại.</p>
<div class="callout ok">Giữ một terminal thứ hai mở ở thư mục này suốt khoá. Khi một bài đưa ra một lệnh, hãy chạy nó ở đó <em>trước khi</em> đọc phần giải thích nó vừa làm gì. Đoán trước rồi kiểm chứng — đó là thứ làm mô hình đọng lại.</div>
<div class="callout warn"><strong>Một cái tên cho sân tập:</strong> từ Chương 1 trở đi, mọi ô thực hành đều gọi kho này là <code>thu-git</code>. Tên thư mục chẳng quan trọng gì với Git, nhưng nếu muốn lệnh trong bài tập chạy đúng nguyên văn thì hãy tạo nó là <code>~/thu-git</code> thay cho <code>~/git-lab</code>. Đừng bao giờ tập trong kho đồ án thật của nhóm — cả ý nghĩa của sân tập là một kho không ai khác phụ thuộc vào.</div>

<h3>Một bộ sinh lịch sử để nghịch</h3>
<p>Vài chương cần một kho có lịch sử thật để tìm kiếm. Vòng lặp này dựng một cái với mười commit trong vài giây:</p>
<pre><code>cd ~/git-lab
<span class="tok-keyword">for</span> i <span class="tok-keyword">in</span> \$(seq 1 10); <span class="tok-keyword">do</span>
  <span class="tok-keyword">echo</span> <span class="tok-string">"change \$i"</span> &gt;&gt; a.txt
  git commit -am <span class="tok-string">"commit number \$i"</span> &gt;/dev/null
<span class="tok-keyword">done</span>
git log --oneline</code></pre>
<div class="out">1a2b3c4 commit number 10
5d6e7f8 commit number 9
9a0b1c2 commit number 8
…
8f3c1a2 first commit</div>

<h3>Ba câu hỏi phải trả lời trước khi bấm Enter</h3>
${slide('git-00', 15, 'Ba câu hỏi trước khi bấm Enter + bộ ba chẩn đoán')}
<p>Đây là thói quen duy nhất phân biệt người thoải mái với Git và người thì không. Trước khi chạy thứ gì bạn chưa chắc, hãy trả lời:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Lệnh này đụng vào cây nào trong ba cây?</div><div class="lz-d">Thư mục làm việc, vùng staging, hay lịch sử đã commit? (Chương 1 định nghĩa cả ba.)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Nó dời một con trỏ hay tạo một đối tượng?</div><div class="lz-d">Dời con trỏ nhánh thì rẻ và đảo ngược được. Xoá nội dung file chưa commit thì không.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Commit này đã push chưa?</div><div class="lz-d">Thứ đã chia sẻ cũng là vấn đề của người khác. Viết lại nó cần một cuộc trò chuyện, không phải một cái cờ.</div></div>
</div>
<p>Gần như mọi câu chuyện kinh dị về Git đều là câu 3 trả lời sai. Viết lại việc của chính mình khi chưa push thì miễn phí; viết lại lịch sử đã chia sẻ là một bài toán phối hợp mà không lệnh nào giải hộ bạn được.</p>

<h3>Một luật duy nhất về việc bị mất</h3>
<div class="callout ok"><strong>Nếu nó từng được commit, nó chưa mất.</strong> Git giữ các commit không còn với tới được ít nhất 30 ngày, và <code>git reflog</code> liệt kê mọi vị trí mà <code>HEAD</code> từng đứng trên máy bạn. Một nhánh "mất", một lần <code>reset --hard</code> hớ, một lần rebase hỏng — đều cứu được bằng một lệnh. Bài 4.4 nói kỹ; tới đó thì cứ biết rằng hoảng loạn là không cần thiết.</div>
<p>Ngoại lệ thật sự, và là ngoại lệ duy nhất đáng sợ: những thay đổi bạn <strong>chưa bao giờ commit</strong>. Git không khôi phục được thứ chưa từng được cho xem. Đó là lý lẽ thực tế cho việc commit thường xuyên trên một nhánh cục bộ — commit thì miễn phí, và mỗi cái là một điểm lưu.</p>

<h3>Khi bạn lạc — bộ ba chẩn đoán</h3>
<p>Ba lệnh trả lời câu "tôi đang ở đâu và chuyện gì đang xảy ra?". Chạy chúng bất cứ lúc nào một bài làm bạn phân vân:</p>
<pre><code>git status                        <span class="tok-comment"># đang ở nhánh nào, gì đã staging, gì đã sửa</span>
git log --oneline --graph --all -20   <span class="tok-comment"># hình dạng lịch sử, mọi nhánh</span>
git reflog -10                    <span class="tok-comment"># HEAD vừa đi qua những đâu</span></code></pre>
<p>Hãy đặt lệnh giữa thành một alias — bạn sẽ gõ nó hàng trăm lần:</p>
<pre><code>git config --global alias.lg <span class="tok-string">"log --oneline --graph --all --decorate -20"</span>
git lg</code></pre>
<div class="out">* 1a2b3c4 (HEAD -&gt; main) commit number 10
* 5d6e7f8 commit number 9
* 9a0b1c2 commit number 8</div>

<h3>Nhịp học cả khoá</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chương 1–4</span><span class="v">Học theo thứ tự và đừng bỏ qua. Đây là mô hình; mọi thứ về sau đều giả định chúng. Khoảng một chương mỗi buổi.</span></div>
  <div class="kv"><span class="k">Chương 5–8</span><span class="v">Làm việc nhóm. Thấm nhất khi bạn đang thật sự cộng tác với ai đó, kể cả dự án hai người.</span></div>
  <div class="kv"><span class="k">Chương 9</span><span class="v">Ruột gan. Không bắt buộc để ship code, nhưng thay đổi hẳn mức độ tự tin. Đọc khi các chương trước đã thành thói quen.</span></div>
  <div class="kv"><span class="k">Chương 10–14</span><span class="v">Dạng tra cứu. Đọc cái nào cần lúc cần; riêng Chương 13 là sách công thức để mở ra giữa lúc sự cố.</span></div>
</div>
<div class="callout ok"><strong>Cập nhật 09/2026 — Chương 14–16:</strong> bảng trên được viết theo kế hoạch ban đầu. Với ba chương mới: đọc <strong>Chương 14</strong> (Git trong VS Code và các công cụ khác) bất cứ lúc nào sau Chương 4, khi bạn đã biết các nút bấm lẽ ra phải làm gì; <strong>Chương 15</strong> (GitHub cho sinh viên) bất cứ lúc nào sau Chương 6; và để <strong>Chương 16</strong> (dự án nhóm tổng kết) sau cùng, vì nó dùng tới mọi thứ — nó kết thúc bằng bài thi cuối khoá 20 câu.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
${slide('git-00', 17, 'Thực hành Mục 0 (30 phút)')}
<div class="callout ok"><ol><li>Dựng sân tập: <code>mkdir -p ~/thu-git &amp;&amp; cd ~/thu-git &amp;&amp; git init</code>, một file, commit đầu tiên, rồi thêm năm commit bằng vòng lặp bên dưới. Đặt alias <code>git lg</code>.</li><li>Trước bước kế tiếp, trả lời to ba câu hỏi cho lệnh <code>git reset --hard HEAD~3</code>: nó đụng cây nào, có dời con trỏ không, đã push gì chưa?</li><li>Chạy nó. <code>git lg</code> giờ chỉ còn ba commit — "commit số 3, 4, 5" có vẻ đã mất.</li><li>Chạy <code>git reflog -5</code>, tìm dòng vẫn còn ghi "commit số 5", rồi quay về đó.</li></ol>
<pre><code class="language-bash">printf <span class="tok-string">'dòng một\\n'</span> &gt; a.txt &amp;&amp; git add a.txt &amp;&amp; git commit -m <span class="tok-string">"commit đầu tiên"</span>
<span class="tok-keyword">for</span> i <span class="tok-keyword">in</span> \$(seq 1 5); <span class="tok-keyword">do</span> <span class="tok-keyword">echo</span> <span class="tok-string">"thay đổi \$i"</span> &gt;&gt; a.txt; git commit -qam <span class="tok-string">"commit số \$i"</span>; <span class="tok-keyword">done</span>
git reset --hard HEAD~3
git reflog -5
git reset --hard <span class="tok-string">"HEAD@{1}"</span>    <span class="tok-comment"># có nháy kép thì PowerShell cũng chạy đúng</span></code></pre>
<div class="out">HEAD is now at 9bdc2af commit số 2
9bdc2af HEAD@{0}: reset: moving to HEAD~3
17f6418 HEAD@{1}: commit: commit số 5
f1c7ab1 HEAD@{2}: commit: commit số 4
9e09032 HEAD@{3}: commit: commit số 3
9bdc2af HEAD@{4}: commit: commit số 2
HEAD is now at 17f6418 commit số 5</div>
<p>(Output thật từ git 2.51 — mã băm của bạn sẽ khác.)</p>
<p><strong>Đạt khi:</strong> <code>git lg</code> trong <code>~/thu-git</code> hiện "commit số 5" trên cùng kèm <code>(HEAD -&gt; main)</code>, <code>git status</code> báo "nothing to commit, working tree clean", và bạn giải thích được vì sao <code>HEAD@{1}</code> là đích đúng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Playground / scratch repo</span><span class="v">Sân tập / kho nháp — một kho vứt đi (<code>thu-git</code>) nơi làm hỏng không tốn gì.</span></div>
  <div class="kv"><span class="k">Reflog</span><span class="v">Nhật ký tham chiếu — sổ ghi cục bộ của Git về mọi chỗ <code>HEAD</code> từng đứng; nút undo cho chính nút undo.</span></div>
  <div class="kv"><span class="k">Reachable / unreachable commit</span><span class="v">Commit với tới được / không với tới được — còn nhánh hay tag dẫn tới, so với chỉ reflog còn nhớ (giữ ít nhất 30 ngày).</span></div>
  <div class="kv"><span class="k">Alias</span><span class="v">Tên tắt — cái tên ngắn bạn tự đặt cho một lệnh dài, như <code>git lg</code>.</span></div>
  <div class="kv"><span class="k">Diagnostic trio</span><span class="v">Bộ ba chẩn đoán — <code>git status</code>, <code>git lg</code>, <code>git reflog</code>: ba lệnh chạy mỗi khi bạn lạc.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
${slide('git-00', 16, 'Bảng tra nhanh Mục 0')}
<ul><li>Git học bằng tay: chạy mọi lệnh trong <code>~/thu-git</code>, không bao giờ trong kho đồ án thật của nhóm.</li><li>Trước một lệnh lạ, hỏi: đụng cây nào, dời con trỏ hay tạo đối tượng, và đã push chưa?</li><li>Thứ gì từng được commit thì <code>git reflog</code> lấy lại được; chỉ thay đổi chưa bao giờ commit mới mất thật.</li><li>Khi lạc, chạy <code>git status</code>, <code>git lg</code> và <code>git reflog -10</code> trước khi gõ bất cứ gì khác.</li><li>Học Chương 1–4 theo thứ tự, phần còn lại dùng khi cần; Chương 16 và bài thi cuối khoá 20 câu để sau cùng.</li></ul>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện sau mỗi chương: track Git trên Code Lab</span><span class="lc-sub">Bài tập có chấm điểm kèm lời giải, sắp xếp khớp với các chương này.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">git-scm.com/docs — sách tra cứu lệnh</span><span class="lc-sub">Mọi lệnh. Cũng có sẵn ngoại tuyến: <code>git help &lt;lệnh&gt;</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> học Git chỉ qua giao diện đồ hoạ (bảng Source Control của VS Code, GitHub Desktop, Sourcetree). GUI rất tốt KHI bạn đã có mô hình, vì nó cho bạn thấy đồ thị. Trước đó nó che đúng cái phân biệt mà bạn cần học: nút ghi "Sync", nhưng vừa rồi là fetch, merge, rebase hay push? Hãy học bằng dòng lệnh trong khoá này, rồi dùng GUI nào bạn thích — bạn sẽ hiểu các nút của nó thật sự làm gì.</div>
<p class="note-ct"><strong>Một lời về học thuộc:</strong> đừng. Git có khoảng 150 lệnh và không ai thuộc hết. Hãy học <em>mô hình</em> (ba cây, ảnh chụp, con trỏ) và chừng mười lăm lệnh; phần còn lại tra. Người hiểu mô hình tìm được lệnh đúng trong tài liệu chỉ trong một phút, còn người học thuộc lệnh thì tắc ngay khi tình huống khác đi một chút.</p>
</div>
`,
    },
  ],
};
