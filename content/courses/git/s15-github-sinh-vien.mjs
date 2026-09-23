/**
 * Git & GitHub — Chương 15 (MỚI, 09/2026): GitHub cho sinh viên — hồ sơ, portfolio & mã nguồn mở.
 * Profile README + repo ghim + README dự án · GitHub Pages cho portfolio React/Vite ·
 * Student Developer Pack, Codespaces, Copilot Student · PR mã nguồn mở đầu tiên · quiz.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div> (KHÔNG </code></pre>). KHÔNG dùng <svg>.
 * Output lệnh là output THẬT trong kho thử scratchpad/ch15-lab (dung.sh, ngày commit cố định 2026-09-23):
 * git 2.51.1, node 22.21, Vite 8.3.0, actionlint 1.7.12. GitHub Pages được GIẢ LẬP bằng máy chủ tĩnh
 * node (gia-lap-pages.mjs); upstream/fork là kho trần cục bộ — không có gì được đẩy lên GitHub.
 * Con số về Pages / Student Pack / Codespaces / Copilot kiểm trên docs.github.com và education.github.com — tính đến 09/2026.
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 15 — GitHub for students: profile, portfolio & open source|||Chương 15 — GitHub cho sinh viên: hồ sơ, portfolio & mã nguồn mở',
  description: 'Biến tài khoản GitHub thành hồ sơ xin thực tập: profile README và repo ghim, README dự án người lạ đọc hiểu, portfolio React/Vite trên GitHub Pages, quyền lợi gói sinh viên (Student Pack, Codespaces, Copilot), và pull request mã nguồn mở đầu tiên.',
  lessons: [
    /* ─────────────────────────── 15.0 ─────────────────────────── */
    {
      title: '15.0 — Chapter 15 slides: GitHub for students, in pictures|||15.0 — Slide Chương 15: GitHub cho sinh viên bằng hình',
      slug: 'git-15-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 18 slide của Chương 15: trang profile trong 30 giây đầu, README tốt và tệ, license, GitHub Pages bằng Actions và lỗi base path, domain riêng, giới hạn Pages, Student Pack, Codespaces, Copilot Student và hành trình PR mã nguồn mở đầu tiên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Slides</span>
<h2>The whole chapter in 18 slides</h2>
<p class="lead">When you apply for an internship, someone opens your GitHub profile before they open your CV properly. These slides follow that visit: what a recruiter sees in the first thirty seconds, the README that makes a stranger understand a project, a React/Vite portfolio published on GitHub Pages, the free tools a verified student gets, and the path from a <code>good first issue</code> to your first merged pull request in someone else’s project.</p>
<p>Every terminal on the slides is real output from a throw-away lab: Vite 8.3 building the portfolio with and without a base path, a small Node server standing in for GitHub Pages to show which URLs return 404, actionlint checking the deploy workflow, and Git 2.51 syncing a fork with its upstream. Nothing was pushed to GitHub. Limits and plan details — Pages, the Student Developer Pack, Codespaces, Copilot Student — were checked on docs.github.com and education.github.com as of 09/2026. The last two slides are a cheat sheet and a 90-minute practice session.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Slide</span>
<h2>Cả chương trong 18 slide</h2>
<p class="lead">Khi bạn nộp đơn thực tập, người ta mở trang GitHub của bạn trước khi đọc kỹ CV. Bộ slide đi theo đúng lượt ghé thăm đó: nhà tuyển dụng thấy gì trong ba mươi giây đầu, cái README (tệp giới thiệu dự án) giúp một người lạ hiểu dự án, một portfolio (trang giới thiệu bản thân) React/Vite xuất bản trên GitHub Pages, những công cụ miễn phí mà sinh viên đã xác minh nhận được, và con đường từ một <code>good first issue</code> (việc dành cho người mới) tới pull request đầu tiên được merge vào dự án của người khác.</p>
<p>Mọi cửa sổ terminal trên slide là output thật trong một kho thử: Vite 8.3 build portfolio khi có và khi thiếu base path (đường dẫn gốc), một máy chủ Node nhỏ đóng vai GitHub Pages để chỉ ra đường dẫn nào trả 404, actionlint kiểm file workflow deploy, và Git 2.51 đồng bộ một fork với upstream (kho gốc). Không có gì được đẩy lên GitHub. Giới hạn và điều kiện gói — Pages, Student Developer Pack, Codespaces, Copilot Student — đều kiểm trên docs.github.com và education.github.com (tính đến 09/2026). Hai slide cuối là bảng tra nhanh và một buổi thực hành 90 phút.</p>
</div>
${gallery('git-15', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Nhà tuyển dụng nhìn gì trong 30 giây'], [4, 'Profile README: repo trùng tên tài khoản'],
  [5, 'README dự án tốt và tệ'], [6, 'License và topics'], [7, 'GitHub Pages: hai cách xuất bản'],
  [8, 'Luồng deploy portfolio bằng Actions'], [9, 'Base path /tên-repo/ và lỗi trang trắng'], [10, 'Domain riêng và HTTPS'],
  [11, 'Giới hạn của GitHub Pages'], [12, 'GitHub Student Developer Pack'], [13, 'Codespaces: máy dev trong trình duyệt'],
  [14, 'Copilot cho sinh viên'], [15, 'Hành trình PR mã nguồn mở đầu tiên'], [16, 'Fork, upstream và đồng bộ'],
  [17, 'Bảng tra nhanh'], [18, 'Thực hành chương 15'],
])}
`,
    },
    /* ─────────────────────────── 15.1 ─────────────────────────── */
    {
      title: '15.1 — Your GitHub profile as a CV: profile README, pins & project READMEs|||15.1 — Hồ sơ GitHub như một CV: profile README, repo ghim & README dự án',
      slug: 'git-15-1-ho-so-github',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Nhà tuyển dụng nhìn gì trong 30 giây đầu trên trang GitHub của bạn, cách làm profile README, chọn 6 repo ghim, viết README dự án (ảnh, demo, cách chạy, phần mình làm trong nhóm), topics và license.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1</span>
<h2>GitHub is your second CV</h2>
<p class="lead">An internship application for a web role almost always has a field for "GitHub". Whoever screens it has a pile of forty applications and will give your profile about half a minute. They are not reading code yet. They are deciding whether there is anything worth reading — and that decision is made by a photo, three lines of text, six repository cards and one README.</p>

<h3>The first thirty seconds</h3>
${slide('git-15', 3, 'Nhà tuyển dụng nhìn gì trong 30 giây')}
<p>Watch someone open a profile they have never seen and the order is always the same. The eye goes to the avatar and the one-line bio, then to the top of the profile README, then across the pinned repositories, and then — if something caught — into exactly one repository. The contribution graph gets a glance; nobody counts the squares.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Avatar + bio (~5 s)</span><span class="v">A real photo or a clean avatar, your name, and one line: what you study, what you are looking for. "IT student at FPTU · looking for a Web/Backend internship · Next.js, Node, Prisma".</span></div>
  <div class="kv"><span class="k">Profile README (~10 s)</span><span class="v">The first three lines must answer "who are you and what have you built". Everything below the fold is a bonus.</span></div>
  <div class="kv"><span class="k">Pinned repos (~15 s)</span><span class="v">Six cards. Each shows a name, a description and a language. Empty descriptions and names like <code>test123</code> read as "nothing here".</span></div>
  <div class="kv"><span class="k">One repository</span><span class="v">Its README decides whether they clone it, look at the code, or close the tab. This is where most student profiles lose.</span></div>
</div>
<p>None of this is about stars or followers. A second-year student with three honest projects, clear READMEs and one merged pull request in a real open-source project looks better than a profile with fifty forked tutorials.</p>

<h3>The profile README: a repository named after you</h3>
${slide('git-15', 4, 'Profile README: repo trùng tên tài khoản')}
<p>The text box at the top of a profile is not a setting — it is the <code>README.md</code> of a special repository. GitHub shows it when all four conditions hold (docs.github.com, as of 09/2026):</p>
<ul>
<li>the repository name is exactly your username — for Cường, <code>cuonghoang1103/cuonghoang1103</code>;</li>
<li>the repository is <strong>public</strong>;</li>
<li>it has a file named <code>README.md</code> at its <strong>root</strong>;</li>
<li>the file is not empty.</li>
</ul>
<p>Create it from the web (New repository → type your username → Public → Add README), or from the terminal like any other repository:</p>
<pre><code class="language-bash">gh repo create cuonghoang1103 --public --clone
cd cuonghoang1103
<span class="tok-comment"># write README.md, then:</span>
git add README.md
git commit -m <span class="tok-string">"docs: profile README"</span>
git push -u origin main</code></pre>
<p>What to write — short, true, with links to things that exist:</p>
<pre><code class="language-markdown">## Hi, I'm Cường 👋

Third-year IT student at FPT University, looking for a **Web/Backend internship (OJT)**.

- 🔨 Building [cuongthai.com](https://cuongthai.com) — Next.js + Node.js + Prisma, deployed with Docker on a VPS
- 🧑‍🤝‍🧑 SWP391 team project: I owned the booking API and the CI pipeline for a team of five
- 🌱 Learning: testing, Docker, contributing to open source

**Tech:** TypeScript · React · Java · PostgreSQL
**Contact:** school email · linkedin.com/in/…</code></pre>
<div class="callout warn">Resist the badge wall: twenty technology logos, a visitor counter, an animated "top languages" card and a random quote. Every one of them pushes the three lines that matter further down the screen, and a language card measures bytes of code, not skill — one large generated or copied file can make it call you a "CSS developer". Links to real work beat decoration.</div>

<h3>Six pins: choose like an editor</h3>
<p>By default the profile shows "Popular repositories", which for a student usually means the three course repositories with the most commits. Take control: on your profile, <strong>Customize your pins</strong> lets you pick <strong>up to six</strong> repositories and gists combined, and drag them into order.</p>
<ul>
<li><strong>Pin work that is real and yours:</strong> a product you run (cuongthai.com), a team project where your part is stated, a portfolio site, a lab repository with tests.</li>
<li><strong>Pin a merged contribution</strong> if you have one — even a small fix in someone else’s project says you can read an unfamiliar codebase and survive review (lesson 15.4).</li>
<li><strong>Do not pin</strong> forks you never changed, tutorial clones, or repositories whose description is empty. Fill the description in the <strong>About</strong> box first; it is what appears on the card.</li>
</ul>

<h3>A project README that a stranger can use</h3>
${slide('git-15', 5, 'README dự án tốt và tệ')}
<p>The default README that <code>npm create vite</code> writes starts with <code># React + Vite</code> and explains the template. Many student repositories are submitted exactly like that. Write for someone who has never heard of your project and will spend two minutes on it:</p>
<pre><code class="language-markdown"># Clinic Booking — SWP391 (Group 3)

Book, reschedule and cancel clinic appointments; doctors see their day at a glance.

![Booking screen](docs/booking.png)

**Demo:** https://… (test account: patient@demo / demo123)

## Features
- Patients book a slot by specialty and doctor
- Doctors confirm, reschedule or mark no-show
- Admin manages schedules and holidays

## Tech
React + Vite · Spring Boot · PostgreSQL · GitHub Actions

## Run locally
&#96;&#96;&#96;bash
cp .env.example .env      # fill DB_URL
npm ci
npm run dev
&#96;&#96;&#96;

## My part
Booking API (12 endpoints, 38 PRs), database schema, CI pipeline (lint + test on every PR).

## Team
@lan (UI) · @minh (auth) · @hoa (doctor dashboard) · @cuong (API + CI) · @an (testing)

## License
MIT</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Screenshot or GIF</span><span class="v">Proves it runs and says what it is faster than any paragraph. Keep images in the repository (<code>docs/</code>) so they do not rot.</span></div>
  <div class="kv"><span class="k">Demo link</span><span class="v">A working URL plus a test account. If there is no hosting, a 60-second screen recording linked from the README is the next best thing.</span></div>
  <div class="kv"><span class="k">Run locally</span><span class="v">Copy-pasteable commands, and an <code>.env.example</code> with the variable names (never the values).</span></div>
  <div class="kv"><span class="k">My part</span><span class="v">The section recruiters look for in a team project. Specific and checkable: "booking API, 38 PRs", not "full-stack development".</span></div>
</div>

<h3>Topics, the About box, and a license</h3>
${slide('git-15', 6, 'License và topics')}
<p>The gear icon next to <strong>About</strong> on a repository page holds three things that matter for a profile: a one-line description, a website link (your demo), and <strong>topics</strong> — subject tags such as <code>react</code>, <code>vite</code>, <code>portfolio</code>, <code>spring-boot</code>. Topics make a repository findable under <code>github.com/topics/&lt;topic&gt;</code>. GitHub’s rules: lowercase letters, numbers and hyphens, at most 50 characters each, no more than 20 per repository.</p>
<p>The license is the one most students skip, and the consequence surprises them. GitHub’s documentation is blunt: without a license, default copyright law applies — you keep all rights, and nobody may reproduce, distribute or create derivative works from your code. Public on GitHub only means people can view and fork it there. If you want others to be able to reuse your portfolio template, pick a license:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">MIT</span><span class="v">Short and permissive: anyone may use, change and redistribute, as long as your copyright notice and the license text stay. The usual choice for a personal project.</span></div>
  <div class="kv"><span class="k">Apache-2.0</span><span class="v">Permissive like MIT, plus an explicit patent grant. Common in larger company-backed projects.</span></div>
  <div class="kv"><span class="k">GPL-3.0</span><span class="v">Copyleft: anyone who distributes a modified version must release it under the same license.</span></div>
  <div class="kv"><span class="k">No license</span><span class="v">All rights reserved. Readable, not reusable.</span></div>
</div>
<p>Add one with <strong>Add file → Create new file</strong>, type <code>LICENSE</code>, and GitHub offers a template picker; <a href="https://choosealicense.com/" target="_blank" rel="noopener">choosealicense.com</a> explains the differences in plain language.</p>
<div class="callout warn"><strong>School projects are not only yours.</strong> Before making a SWP391 repository public or attaching a license, ask your team and check the course rules — the code belongs to five people, and some lecturers do not want graded work public while the course is running. A common compromise: keep the team repository private, and put a public write-up with screenshots and your part on your own profile.</div>

<h3>Your history is part of the profile</h3>
<p>Two things from earlier chapters show up here. Commits count on your profile only if they were made with an email address linked to your GitHub account — which is why a work or school laptop set up with the wrong <code>user.email</code> quietly erases your contribution graph (Chapter 14 sets up two identities with <code>includeIf</code>). And anyone who opens a repository can read your commit messages: a history of <code>update</code>, <code>fix</code>, <code>asdf</code> tells a reviewer something too.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>You are sending your first OJT applications next week. Create the repository <code>&lt;your-username&gt;/&lt;your-username&gt;</code> (public, with a README) and replace the template with three true lines: who you are, what you are building, what you are looking for — plus links to at least two real repositories.</li><li>Open your profile in a private/incognito window, where you are not signed in. Check that the README appears at the top. If it does not, go back through the four conditions (name, public, root, not empty).</li><li>Pick your best team project (SWP391 or similar). Rewrite its README with the structure from this lesson: one sentence, a screenshot, demo or recording, run-locally commands, tech, <strong>My part</strong>. Ask the team before pushing it.</li><li>In the <strong>About</strong> box of that repository fill the description, the website link and 3–5 topics. Then <strong>Customize your pins</strong> and pin 4–6 repositories, each with a non-empty description.</li></ol>
<p><strong>Done when:</strong> in an incognito window, your profile shows your README in its first screen, every pinned card has a description, and the pinned team project’s README contains a "My part" section a stranger could verify from the commit history.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Profile README</span><span class="v">The <code>README.md</code> of a public repository named exactly like your username; GitHub shows it at the top of your profile.</span></div>
  <div class="kv"><span class="k">Pinned repositories</span><span class="v">Up to six repositories and gists you choose to show on your profile, in the order you set.</span></div>
  <div class="kv"><span class="k">README</span><span class="v">The file GitHub renders on a repository’s front page; the first thing anyone reads about a project.</span></div>
  <div class="kv"><span class="k">Topics</span><span class="v">Subject tags on a repository (lowercase, hyphens, ≤ 50 characters, ≤ 20 per repo) that make it findable.</span></div>
  <div class="kv"><span class="k">License</span><span class="v">A file that tells others what they may do with your code. No license means all rights reserved.</span></div>
  <div class="kv"><span class="k">Contribution graph</span><span class="v">The grid of squares on a profile; counts commits made with an email linked to your account.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A recruiter decides in about thirty seconds, from the avatar, three README lines, six pins and one project README.</li><li>A profile README is the README of a public repository named after your username, at the root, not empty.</li><li>Pin real work with filled-in descriptions; hide untouched forks and tutorial clones.</li><li>A project README needs a screenshot, a demo, run-locally commands and, for team work, a specific "My part".</li><li>Without a license nobody may reuse your code; for school projects, ask the team before going public.</li></ul>

<a class="link-card" href="https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme" target="_blank" rel="noopener">
  <span class="lc-ico">👤</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Managing your profile README</span><span class="lc-sub">The four conditions, and how to create or remove it.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Licensing a repository</span><span class="lc-sub">What "no license" means, and the license keywords GitHub recognises.</span></span>
</a>
<a class="link-card" href="https://choosealicense.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">choosealicense.com</span><span class="lc-sub">MIT, Apache-2.0, GPL-3.0 explained in one page each.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>How student profiles lose the thirty seconds.</strong> <b>A committed <code>.env</code> in a pinned repository.</b> The reviewer sees a database password in the first file listing, and the conversation is over — revoke the key and clean the history (8.3) before you pin anything. <b>"Full-stack developer" on a team project where your commits are two README edits.</b> The history is public; claims have to match it. <b>A demo link that returns 404</b> because the free hosting expired last semester — check every link the week you apply. <b>Pinning forty-commit course repositories named <code>lab1</code>, <code>lab2</code>, <code>lab3</code></b>: rename them, describe them, or leave them unpinned.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1</span>
<h2>GitHub là CV thứ hai của bạn</h2>
<p class="lead">Đơn xin thực tập vị trí web gần như luôn có một ô "GitHub". Người sàng lọc có một chồng bốn mươi hồ sơ và sẽ dành cho trang của bạn chừng nửa phút. Họ chưa đọc code. Họ đang quyết định xem có gì đáng đọc hay không — và quyết định ấy dựa vào một tấm ảnh, ba dòng chữ, sáu thẻ repo và một cái README.</p>

<h3>Ba mươi giây đầu</h3>
${slide('git-15', 3, 'Nhà tuyển dụng nhìn gì trong 30 giây')}
<p>Quan sát một người mở trang profile (hồ sơ) lạ, thứ tự lúc nào cũng thế. Mắt đi tới ảnh đại diện và dòng tiểu sử, rồi tới đầu profile README, rồi lướt qua các repo ghim, rồi — nếu có gì giữ chân — bấm vào đúng một repo. Biểu đồ đóng góp chỉ được liếc qua; không ai đếm từng ô vuông.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Ảnh + tiểu sử (~5 giây)</span><span class="v">Ảnh thật hoặc ảnh đại diện gọn gàng, tên của bạn, và một dòng: học gì, đang tìm gì. "SV CNTT FPTU · tìm thực tập Web/Backend · Next.js, Node, Prisma".</span></div>
  <div class="kv"><span class="k">Profile README (~10 giây)</span><span class="v">Ba dòng đầu phải trả lời "bạn là ai, đã làm được gì". Mọi thứ phía dưới màn hình đầu là phần thưởng thêm.</span></div>
  <div class="kv"><span class="k">Repo ghim (~15 giây)</span><span class="v">Sáu thẻ. Mỗi thẻ có tên, mô tả và ngôn ngữ. Mô tả trống và tên kiểu <code>test123</code> đọc lên thành "chẳng có gì".</span></div>
  <div class="kv"><span class="k">Một repo</span><span class="v">README của nó quyết định người ta clone về, xem code, hay đóng tab. Đây là chỗ đa số hồ sơ sinh viên thua.</span></div>
</div>
<p>Không cái nào ở trên liên quan tới sao (star) hay người theo dõi. Một sinh viên năm hai có ba dự án thật, README rõ ràng và một pull request đã merge vào một dự án mã nguồn mở thật trông tốt hơn một trang có năm mươi bài hướng dẫn fork về.</p>

<h3>Profile README: một repo mang tên bạn</h3>
${slide('git-15', 4, 'Profile README: repo trùng tên tài khoản')}
<p>Ô chữ ở đầu trang profile không phải một mục cài đặt — nó là <code>README.md</code> của một repo đặc biệt. GitHub hiện nó khi đủ cả bốn điều kiện (docs.github.com, tính đến 09/2026):</p>
<ul>
<li>tên repo đúng bằng tên tài khoản — với Cường là <code>cuonghoang1103/cuonghoang1103</code>;</li>
<li>repo là <strong>public</strong> (công khai);</li>
<li>có file tên <code>README.md</code> ở <strong>gốc</strong> repo;</li>
<li>file không trống.</li>
</ul>
<p>Tạo trên web (New repository → gõ đúng tên tài khoản → Public → Add README), hoặc từ terminal như mọi repo khác:</p>
<pre><code class="language-bash">gh repo create cuonghoang1103 --public --clone
cd cuonghoang1103
<span class="tok-comment"># viết README.md, rồi:</span>
git add README.md
git commit -m <span class="tok-string">"docs: profile README"</span>
git push -u origin main</code></pre>
<p>Viết gì — ngắn, đúng sự thật, có link tới thứ đang tồn tại:</p>
<pre><code class="language-markdown">## Chào, mình là Cường 👋

Sinh viên CNTT năm 3 tại FPTU. Đang tìm **thực tập (OJT)** vị trí Web/Backend.

- 🔨 Đang làm: [cuongthai.com](https://cuongthai.com) — Next.js + Node.js + Prisma, deploy Docker lên VPS
- 🧑‍🤝‍🧑 Đồ án SWP391: mình phụ trách API đặt lịch và CI cho nhóm 5 người
- 🌱 Đang học: kiểm thử, Docker, đóng góp mã nguồn mở

**Công nghệ:** TypeScript · React · Java · PostgreSQL
**Liên hệ:** email trường · linkedin.com/in/…</code></pre>
<div class="callout warn">Cưỡng lại "bức tường huy hiệu": hai mươi logo công nghệ, bộ đếm lượt xem, thẻ "ngôn ngữ dùng nhiều nhất" chuyển động và một câu trích dẫn ngẫu nhiên. Mỗi thứ đẩy ba dòng quan trọng xuống thấp hơn, còn thẻ ngôn ngữ thì đo số byte mã chứ không đo kỹ năng — một file lớn sinh tự động hay chép từ đâu về là đủ để nó gọi bạn là "lập trình viên CSS". Link tới việc thật thắng mọi thứ trang trí.</div>

<h3>Sáu repo ghim: chọn như một biên tập viên</h3>
<p>Mặc định trang profile hiện "Popular repositories", mà với sinh viên thường là ba repo môn học nhiều commit nhất. Hãy tự quyết: trên trang profile, <strong>Customize your pins</strong> cho chọn <strong>tối đa sáu</strong> repo và gist (tổng cộng), rồi kéo để xếp thứ tự.</p>
<ul>
<li><strong>Ghim việc thật và của mình:</strong> một sản phẩm đang chạy (cuongthai.com), một đồ án nhóm có ghi rõ phần mình làm, một trang portfolio, một repo bài lab có test.</li>
<li><strong>Ghim một đóng góp đã được merge</strong> nếu có — dù chỉ là một sửa lỗi nhỏ trong dự án người khác, nó nói rằng bạn đọc được mã lạ và qua được vòng review (bài 15.4).</li>
<li><strong>Đừng ghim</strong> fork chưa từng sửa gì, bản chép bài hướng dẫn, hay repo có mô tả trống. Điền mô tả trong ô <strong>About</strong> trước; đó là chữ hiện trên thẻ.</li>
</ul>

<h3>README dự án mà người lạ dùng được</h3>
${slide('git-15', 5, 'README dự án tốt và tệ')}
<p>README mặc định mà <code>npm create vite</code> sinh ra mở đầu bằng <code># React + Vite</code> và giải thích cái template. Rất nhiều repo sinh viên được nộp nguyên như vậy. Hãy viết cho một người chưa từng nghe tới dự án và sẽ chỉ dành cho nó hai phút:</p>
<pre><code class="language-markdown"># Đặt lịch phòng khám — SWP391 (Nhóm 3)

Đặt, dời và huỷ lịch khám; bác sĩ xem lịch cả ngày trong một màn hình.

![Màn hình đặt lịch](docs/dat-lich.png)

**Demo:** https://… (tài khoản thử: benhnhan@demo / demo123)

## Tính năng
- Bệnh nhân đặt khung giờ theo chuyên khoa và bác sĩ
- Bác sĩ xác nhận, dời lịch hoặc đánh dấu vắng
- Quản trị viên quản lý lịch làm việc và ngày nghỉ

## Công nghệ
React + Vite · Spring Boot · PostgreSQL · GitHub Actions

## Chạy thử trên máy
&#96;&#96;&#96;bash
cp .env.example .env      # điền DB_URL
npm ci
npm run dev
&#96;&#96;&#96;

## Phần mình làm
API đặt lịch (12 endpoint, 38 PR), thiết kế CSDL, pipeline CI (lint + test mỗi PR).

## Nhóm
@lan (giao diện) · @minh (đăng nhập) · @hoa (màn hình bác sĩ) · @cuong (API + CI) · @an (kiểm thử)

## Giấy phép
MIT</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Ảnh chụp hoặc GIF</span><span class="v">Chứng minh nó chạy và nói nó là gì nhanh hơn mọi đoạn văn. Để ảnh ngay trong repo (<code>docs/</code>) cho khỏi chết link.</span></div>
  <div class="kv"><span class="k">Link demo</span><span class="v">Một địa chỉ chạy được kèm tài khoản thử. Không có chỗ host thì một video quay màn hình 60 giây gắn link trong README là phương án kế tiếp.</span></div>
  <div class="kv"><span class="k">Chạy thử trên máy</span><span class="v">Lệnh chép-dán được, và một file <code>.env.example</code> ghi tên biến (không bao giờ ghi giá trị).</span></div>
  <div class="kv"><span class="k">Phần mình làm</span><span class="v">Mục nhà tuyển dụng tìm trong một đồ án nhóm. Cụ thể và kiểm chứng được: "API đặt lịch, 38 PR", không phải "phát triển full-stack".</span></div>
</div>

<h3>Topics, ô About và giấy phép</h3>
${slide('git-15', 6, 'License và topics')}
<p>Biểu tượng bánh răng cạnh <strong>About</strong> trên trang repo chứa ba thứ quan trọng với hồ sơ: một dòng mô tả, một link website (demo của bạn), và <strong>topics</strong> (nhãn chủ đề) — như <code>react</code>, <code>vite</code>, <code>portfolio</code>, <code>spring-boot</code>. Topics giúp repo được tìm thấy ở <code>github.com/topics/&lt;chủ-đề&gt;</code>. Luật của GitHub: chữ thường, số và gạch nối, mỗi topic tối đa 50 ký tự, không quá 20 topic mỗi repo.</p>
<p>License (giấy phép) là thứ đa số sinh viên bỏ qua, và hậu quả làm họ bất ngờ. Tài liệu của GitHub nói thẳng: không có giấy phép thì luật bản quyền mặc định áp dụng — bạn giữ mọi quyền, và không ai được sao chép, phân phối hay tạo sản phẩm phái sinh từ mã của bạn. Để public trên GitHub chỉ có nghĩa là người khác xem và fork được trên đó. Muốn người khác dùng lại được template portfolio của bạn thì chọn một giấy phép:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">MIT</span><span class="v">Ngắn và dễ dãi: ai cũng được dùng, sửa và phân phối lại, miễn giữ nguyên dòng bản quyền và nội dung giấy phép. Lựa chọn thường gặp cho dự án cá nhân.</span></div>
  <div class="kv"><span class="k">Apache-2.0</span><span class="v">Dễ dãi như MIT, thêm điều khoản cấp quyền bằng sáng chế rõ ràng. Hay gặp ở dự án lớn có công ty đứng sau.</span></div>
  <div class="kv"><span class="k">GPL-3.0</span><span class="v">Copyleft (bắt chia sẻ lại): ai phân phối bản đã sửa thì phải phát hành nó dưới cùng giấy phép.</span></div>
  <div class="kv"><span class="k">Không có giấy phép</span><span class="v">Giữ mọi quyền. Đọc được, không dùng lại được.</span></div>
</div>
<p>Thêm bằng <strong>Add file → Create new file</strong>, gõ tên <code>LICENSE</code> là GitHub hiện bộ chọn mẫu giấy phép; <a href="https://choosealicense.com/" target="_blank" rel="noopener">choosealicense.com</a> giải thích khác biệt bằng lời dễ hiểu.</p>
<div class="callout warn"><strong>Đồ án ở trường không chỉ là của bạn.</strong> Trước khi chuyển repo SWP391 sang public hay gắn giấy phép, hãy hỏi cả nhóm và xem quy định môn học — mã là của năm người, và có giảng viên không muốn bài đang chấm bị công khai khi môn còn chạy. Cách dung hoà hay dùng: giữ repo nhóm ở chế độ private, và đặt một bài viết công khai có ảnh chụp và phần mình làm trên profile của riêng bạn.</div>

<h3>Lịch sử commit cũng là một phần hồ sơ</h3>
<p>Hai điều từ các chương trước hiện ra ở đây. Commit chỉ được tính lên profile khi được tạo bằng một email đã gắn với tài khoản GitHub — nên một máy ở công ty hay ở trường cài sai <code>user.email</code> sẽ âm thầm xoá sạch biểu đồ đóng góp của bạn (Chương 14 dựng hai danh tính bằng <code>includeIf</code>). Và ai mở repo cũng đọc được lời nhắn commit: một lịch sử toàn <code>update</code>, <code>fix</code>, <code>asdf</code> cũng nói với người review một điều gì đó.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Tuần sau bạn gửi những đơn OJT đầu tiên. Tạo repo <code>&lt;tên-tài-khoản&gt;/&lt;tên-tài-khoản&gt;</code> (public, có README) và thay nội dung mẫu bằng ba dòng thật: bạn là ai, đang làm gì, đang tìm gì — kèm link tới ít nhất hai repo có thật.</li><li>Mở trang profile của bạn trong cửa sổ ẩn danh, nơi bạn không đăng nhập. Kiểm rằng README hiện ở đầu trang. Nếu không, rà lại bốn điều kiện (tên, public, ở gốc, không trống).</li><li>Chọn đồ án nhóm tốt nhất (SWP391 hoặc tương tự). Viết lại README theo khung của bài: một câu, một ảnh chụp, demo hoặc video, lệnh chạy thử, công nghệ, <strong>Phần mình làm</strong>. Hỏi nhóm trước khi push.</li><li>Trong ô <strong>About</strong> của repo đó điền mô tả, link website và 3–5 topics. Rồi <strong>Customize your pins</strong> và ghim 4–6 repo, repo nào cũng có mô tả.</li></ol>
<p><strong>Đạt khi:</strong> trong cửa sổ ẩn danh, trang profile hiện README ngay màn hình đầu, thẻ ghim nào cũng có mô tả, và README của đồ án nhóm được ghim có mục "Phần mình làm" mà một người lạ kiểm chứng được qua lịch sử commit.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Profile README</span><span class="v">README hồ sơ — <code>README.md</code> của một repo public trùng đúng tên tài khoản; GitHub hiện nó ở đầu trang profile.</span></div>
  <div class="kv"><span class="k">Pinned repositories</span><span class="v">Repo ghim — tối đa sáu repo và gist bạn chọn để trưng trên profile, theo thứ tự bạn đặt.</span></div>
  <div class="kv"><span class="k">README</span><span class="v">Tệp giới thiệu — file GitHub hiển thị ở trang đầu của repo; thứ đầu tiên ai cũng đọc về một dự án.</span></div>
  <div class="kv"><span class="k">Topics</span><span class="v">Nhãn chủ đề — thẻ gắn cho repo (chữ thường, gạch nối, ≤ 50 ký tự, ≤ 20 mỗi repo) giúp người khác tìm thấy.</span></div>
  <div class="kv"><span class="k">License</span><span class="v">Giấy phép — file nói người khác được làm gì với mã của bạn. Không có giấy phép nghĩa là giữ mọi quyền.</span></div>
  <div class="kv"><span class="k">Contribution graph</span><span class="v">Biểu đồ đóng góp — lưới ô vuông trên profile; chỉ đếm commit tạo bằng email đã gắn với tài khoản.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Nhà tuyển dụng quyết định trong khoảng ba mươi giây, từ ảnh, ba dòng README, sáu thẻ ghim và một README dự án.</li><li>Profile README là README của một repo public trùng tên tài khoản, nằm ở gốc, không trống.</li><li>Ghim việc thật có điền mô tả; giấu fork chưa sửa và bản chép bài hướng dẫn.</li><li>README dự án cần ảnh, demo, lệnh chạy thử và — với việc nhóm — một mục "Phần mình làm" cụ thể.</li><li>Không có giấy phép thì không ai được dùng lại mã; đồ án ở trường thì hỏi nhóm trước khi public.</li></ul>

<a class="link-card" href="https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme" target="_blank" rel="noopener">
  <span class="lc-ico">👤</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Quản lý profile README</span><span class="lc-sub">Bốn điều kiện hiển thị, cách tạo và cách gỡ.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Gắn giấy phép cho repo</span><span class="lc-sub">"Không có giấy phép" nghĩa là gì, và các mã giấy phép GitHub nhận ra.</span></span>
</a>
<a class="link-card" href="https://choosealicense.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">choosealicense.com</span><span class="lc-sub">MIT, Apache-2.0, GPL-3.0 — mỗi cái giải thích trong một trang.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Hồ sơ sinh viên đánh mất ba mươi giây thế nào.</strong> <b>Một file <code>.env</code> đã commit trong repo được ghim.</b> Người xem thấy mật khẩu CSDL ngay trong danh sách file đầu tiên, và cuộc nói chuyện kết thúc — thu hồi khoá và dọn lịch sử (bài 8.3) trước khi ghim bất cứ thứ gì. <b>Ghi "lập trình viên full-stack" trong một đồ án nhóm mà commit của bạn là hai lần sửa README.</b> Lịch sử là công khai; lời khai phải khớp với nó. <b>Link demo trả 404</b> vì gói host miễn phí đã hết hạn từ kỳ trước — kiểm lại mọi link đúng tuần bạn nộp đơn. <b>Ghim mấy repo môn học tên <code>lab1</code>, <code>lab2</code>, <code>lab3</code></b>: đổi tên, viết mô tả, hoặc đừng ghim.</div>
</div>
`,
    },
    /* ─────────────────────────── 15.2 ─────────────────────────── */
    {
      title: '15.2 — GitHub Pages: publishing a React/Vite portfolio|||15.2 — GitHub Pages: xuất bản portfolio React/Vite',
      slug: 'git-15-2-github-pages',
      type: 'LESSON',
      isFreePreview: true,
      description: 'GitHub Pages là gì và không là gì, xuất bản từ nhánh hay bằng Actions, deploy một portfolio React/Vite với base path /tên-repo/, tên miền riêng + HTTPS, và các giới hạn dung lượng, băng thông, thời gian build (tính đến 09/2026).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2</span>
<h2>A portfolio on github.io, deployed by a push</h2>
<p class="lead">A recruiter will click a link far more readily than they will clone a repository. GitHub Pages turns a repository into a website at <code>https://&lt;user&gt;.github.io/…</code>, free for public repositories, with HTTPS included. For a React/Vite portfolio the whole setup is one config line and one workflow file — and one classic mistake that produces a blank white page with no error at all.</p>

<h3>What Pages is — and what it is not</h3>
${slide('git-15', 7, 'GitHub Pages: hai cách xuất bản')}
<p>GitHub’s own definition is precise: a <strong>static</strong> site hosting service that takes HTML, CSS and JavaScript files from a repository, optionally runs a build, and publishes them. There is no server of yours running. Your React app is fine — after <code>vite build</code> it is just files — but the Express API behind cuongthai.com, a Spring Boot backend, PHP, or anything that needs a database cannot run on Pages.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">User site</span><span class="v">A repository named exactly <code>&lt;user&gt;.github.io</code> is published at <code>https://&lt;user&gt;.github.io</code>. One per account.</span></div>
  <div class="kv"><span class="k">Project site</span><span class="v">Any other repository is published at <code>https://&lt;user&gt;.github.io/&lt;repo&gt;/</code>. One per repository.</span></div>
  <div class="kv"><span class="k">Which plans</span><span class="v">GitHub Free: Pages for <strong>public</strong> repositories. Pages from a <strong>private</strong> repository needs a paid plan such as GitHub Pro — which the Student Developer Pack includes (15.3).</span></div>
  <div class="kv"><span class="k">Always public</span><span class="v">The published site is on the open internet even when the repository is private. Never publish anything you would not paste in a public chat.</span></div>
</div>
<p>There are two publishing sources, chosen under <strong>Settings → Pages → Build and deployment → Source</strong>:</p>
<ul>
<li><strong>Deploy from a branch</strong> — pick a branch and either the root <code>/</code> or the <code>/docs</code> folder; GitHub serves the files there (running Jekyll on them by default). Good for a hand-written <code>index.html</code>.</li>
<li><strong>GitHub Actions</strong> — your own workflow builds the site and uploads the result. This is what Vite needs, because the files you want to publish (<code>dist/</code>) do not exist until a build has run — and you should not commit <code>dist/</code>.</li>
</ul>

<h3>The portfolio, from zero</h3>
<p>Everything below was run for real in a lab folder (Vite 8.3, Node 22):</p>
<pre><code class="language-bash">npm create vite@latest portfolio -- --template react --no-interactive
cd portfolio
npm install
npm run build</code></pre>
<div class="out">vite v8.3.0 building client environment for production...
transforming...
✓ 16 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.47 kB │ gzip:  0.32 kB
dist/assets/index-DYnayYsT.css    0.08 kB │ gzip:  0.10 kB
dist/assets/index-D4lLP2T1.js   220.20 kB │ gzip: 68.97 kB

✓ built in 195ms</div>
<p>The build works, and <code>npm run preview</code> shows the page on your machine. That is exactly why the next problem is so confusing: nothing is wrong locally.</p>

<h3>The base path: why the page is white</h3>
${slide('git-15', 9, 'Base path /tên-repo/ và lỗi trang trắng')}
<p>A project site lives in a sub-folder of the domain: <code>https://cuonghoang1103.github.io/portfolio/</code>. Vite, by default, assumes the site lives at the root <code>/</code>, and writes absolute paths into <code>dist/index.html</code>:</p>
<pre><code class="language-bash">grep -o <span class="tok-string">'src="[^"]*"'</span> dist/index.html</code></pre>
<div class="out">src="/assets/index-D4lLP2T1.js"</div>
<p>On GitHub Pages that path points at <code>https://cuonghoang1103.github.io/assets/…</code> — outside your site. To show it without touching GitHub, the lab serves <code>dist/</code> under a <code>portfolio/</code> folder with a tiny Node static server, the same layout Pages uses, and requests three URLs:</p>
<pre><code class="language-bash">node gia-lap-pages.mjs /portfolio/ /assets/index-D4lLP2T1.js /portfolio/assets/index-D4lLP2T1.js</code></pre>
<div class="out">200 /portfolio/
404 /assets/index-D4lLP2T1.js
200 /portfolio/assets/index-D4lLP2T1.js</div>
<p>The HTML arrives (200), the JavaScript that would draw everything does not (404), and the browser shows an empty <code>&lt;div id="root"&gt;</code>: a white page. The fix is one line — tell Vite where the site will live:</p>
<pre><code class="language-javascript"><span class="tok-comment">// vite.config.js</span>
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',   <span class="tok-comment">// project site: https://&lt;user&gt;.github.io/portfolio/</span>
})</code></pre>
<p>Build again and every path carries the prefix; <code>npm run preview</code> now serves at <code>http://localhost:4173/portfolio/</code>, so you test the same URL shape as production:</p>
<div class="out">src="/portfolio/assets/index-BlxItUYO.js"</div>
<p>One trap survives the fix. Vite rewrites paths it knows about — in <code>index.html</code>, in imports, in CSS — but not a string you typed in JSX. The lab portfolio had two links to a CV in <code>public/cv.pdf</code>:</p>
<pre><code class="language-javascript">&lt;a href="/cv.pdf"&gt;Download CV (wrong)&lt;/a&gt;
&lt;a href={import.meta.env.BASE_URL + 'cv.pdf'}&gt;Download CV (right)&lt;/a&gt;</code></pre>
<div class="out">200 /portfolio/cv.pdf
404 /cv.pdf</div>
<p><code>import.meta.env.BASE_URL</code> is replaced at build time with your <code>base</code> (the built bundle literally contains <code>href:&#96;/portfolio/cv.pdf&#96;</code>), so it stays correct if you later move to a custom domain and set <code>base: '/'</code>. The same applies to <code>&lt;img src="/avatar.png"&gt;</code> and to React Router: give <code>BrowserRouter</code> a <code>basename={import.meta.env.BASE_URL}</code>.</p>
<div class="callout warn"><strong>Refreshing a deep link.</strong> Pages only serves files that exist. With client-side routing, <code>/portfolio/projects</code> works when you click to it but returns 404 when you reload it, because there is no <code>projects/index.html</code>. For a one-page portfolio this never comes up; if you add routes, either use hash URLs (<code>#/projects</code>) or give Pages a custom <code>404.html</code> — GitHub serves it for missing paths (still with a 404 status code), and many SPA setups make it load the app.</div>

<h3>The deploy workflow</h3>
${slide('git-15', 8, 'Luồng deploy portfolio bằng Actions')}
<p>First switch the source: <strong>Settings → Pages → Build and deployment → Source → GitHub Actions</strong>. Then commit this file as <code>.github/workflows/deploy.yml</code>. It follows the workflow in Vite’s deployment guide, with each action at its current major version (checked 09/2026):</p>
<pre><code class="language-yaml">name: Deploy portfolio to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: &#36;{{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: ./dist
      - id: deployment
        uses: actions/deploy-pages@v5</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">permissions</span><span class="v"><code>pages: write</code> and <code>id-token: write</code> are what <code>deploy-pages</code> needs; everything else stays read-only (11.2).</span></div>
  <div class="kv"><span class="k">environment: github-pages</span><span class="v">The default Pages environment. Its <code>url</code> becomes the "View deployment" link on the run.</span></div>
  <div class="kv"><span class="k">upload-pages-artifact</span><span class="v">Packs <code>./dist</code> — the build output, which never enters Git.</span></div>
  <div class="kv"><span class="k">concurrency: pages</span><span class="v">Three quick pushes do not race three deploys; the newest wins.</span></div>
</div>
<p>Check it before pushing, as in Chapter 11. Remove the <code>id: deployment</code> line by accident and actionlint catches the dangling reference:</p>
<div class="out">.github/workflows/deploy.yml:21:16: property "deployment" is not defined in object type {} [expression]
   |
21 |       url: &#36;{{ steps.deployment.outputs.page_url }}
   |                ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</div>
<p>Push to <code>main</code>, open the <strong>Actions</strong> tab, and when the run is green the link under the <code>deploy</code> job opens your site.</p>

<h3>A custom domain, with HTTPS</h3>
${slide('git-15', 10, 'Domain riêng và HTTPS')}
<p>The Student Pack includes a free domain for a year (15.3), and <code>cuong.dev</code> reads better on a CV than a sub-folder of github.io. Two pieces, in this order:</p>
<ol>
<li><strong>DNS at your registrar.</strong> For a subdomain like <code>www</code> or <code>portfolio</code>: a <code>CNAME</code> record pointing to <code>&lt;user&gt;.github.io</code>. For the bare (apex) domain: four <code>A</code> records — <code>185.199.108.153</code>, <code>185.199.109.153</code>, <code>185.199.110.153</code>, <code>185.199.111.153</code> — or an <code>ALIAS</code>/<code>ANAME</code> record if your DNS provider offers it.</li>
<li><strong>Settings → Pages → Custom domain</strong>, type the domain, <strong>Save</strong>. GitHub runs a DNS check and requests a certificate from Let’s Encrypt; when it is ready, tick <strong>Enforce HTTPS</strong> so plain HTTP redirects.</li>
</ol>
<ul>
<li>With a custom Actions workflow, no <code>CNAME</code> file is needed in the repository — one that exists is ignored; the setting lives in Settings.</li>
<li>GitHub recommends <strong>verifying</strong> the domain in your account settings first, so nobody else can point a Pages site at it (a "takeover").</li>
<li>The site is now at the root of a domain: set <code>base: '/'</code> again and rebuild, or everything 404s the other way round.</li>
<li><code>github.io</code> sites are served over HTTPS automatically. Mixed content — an <code>http://</code> image on an HTTPS page — is the usual reason a padlock goes missing.</li>
</ul>

<h3>Limits (as of 09/2026)</h3>
${slide('git-15', 11, 'Giới hạn của GitHub Pages')}
<table>
<tr><th>Limit</th><th>Value (docs.github.com)</th></tr>
<tr><td>Published site size</td><td>at most 1 GB</td></tr>
<tr><td>Source repository</td><td>recommended limit 1 GB</td></tr>
<tr><td>Bandwidth</td><td>soft limit 100 GB per month</td></tr>
<tr><td>Deployment time</td><td>times out after 10 minutes</td></tr>
<tr><td>Builds</td><td>soft limit 10 per hour — does not apply when you build with your own Actions workflow</td></tr>
<tr><td>Rate limiting</td><td>may apply; you get HTTP 429</td></tr>
</table>
<p>A "soft" limit means GitHub may contact you or stop serving, not an instant cut-off. Pages is also not allowed as free hosting for an online business, e-commerce or SaaS, nor for sensitive transactions such as passwords or card numbers. A personal portfolio of a few megabytes is nowhere near any of this.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>You want a link on your CV that opens in one click. In your <code>thu-git</code> folder’s parent, run <code>npm create vite@latest portfolio -- --template react --no-interactive</code>, then <code>npm install</code>, and replace <code>src/App.jsx</code> with your name, one line about what you are looking for, and your two best projects.</li><li>Put a file in <code>public/</code> (a CV PDF) and link it twice: once as <code>href="/cv.pdf"</code>, once as <code>href={import.meta.env.BASE_URL + 'cv.pdf'}</code>. Set <code>base: '/portfolio/'</code>, run <code>npm run build</code>, and check <code>grep -o 'src="[^"]*"' dist/index.html</code>.</li><li><code>npm run preview</code> and open the URL it prints. Click both CV links: one should work, one should 404. Delete the wrong one.</li><li>Create the <code>portfolio</code> repository on GitHub, add <code>.github/workflows/deploy.yml</code> from this lesson, switch <strong>Source</strong> to <strong>GitHub Actions</strong>, push, and watch the run.</li></ol>
<pre><code class="language-bash">grep -o <span class="tok-string">'src="[^"]*"'</span> dist/index.html
src="/portfolio/assets/index-BlxItUYO.js"   <span class="tok-comment"># real output from the lab — your hash will differ</span></code></pre>
<p><strong>Done when:</strong> <code>https://&lt;your-user&gt;.github.io/portfolio/</code> shows your page (not white), the browser’s DevTools Network tab lists no 404, the remaining CV link downloads the file, and the Actions run shows a green <code>deploy</code> job.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GitHub Pages</span><span class="v">GitHub’s static site hosting: publishes HTML/CSS/JS from a repository at <code>&lt;user&gt;.github.io</code>.</span></div>
  <div class="kv"><span class="k">Static site</span><span class="v">A site made only of files served as they are; no server-side code or database runs for it.</span></div>
  <div class="kv"><span class="k">Base path (<code>base</code>)</span><span class="v">The sub-folder the site lives under, e.g. <code>/portfolio/</code>; Vite prefixes every built asset path with it.</span></div>
  <div class="kv"><span class="k">Publishing source</span><span class="v">Where Pages takes the site from: a branch (and folder), or a GitHub Actions workflow.</span></div>
  <div class="kv"><span class="k">Custom domain</span><span class="v">Your own domain pointed at Pages with a CNAME (subdomain) or A records (apex) and set in Settings → Pages.</span></div>
  <div class="kv"><span class="k">Soft limit</span><span class="v">A usage ceiling GitHub may enforce by contacting you or throttling, not by an automatic hard stop.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Pages hosts static files only: your built React app yes, your Node or Java backend no.</li><li>A project site lives at <code>/&lt;repo&gt;/</code>, so Vite needs <code>base: '/&lt;repo&gt;/'</code> or the JavaScript 404s and the page is white.</li><li>Hand-typed paths in JSX need <code>import.meta.env.BASE_URL</code>; Vite does not rewrite them.</li><li>Source = GitHub Actions plus <code>configure-pages</code> → <code>upload-pages-artifact</code> → <code>deploy-pages</code> deploys on every push to <code>main</code>.</li><li>Custom domain: CNAME or four A records, Custom domain in Settings, Enforce HTTPS, and <code>base: '/'</code>.</li></ul>

<a class="link-card" href="https://vite.dev/guide/static-deploy" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Vite — Deploying a static site (GitHub Pages)</span><span class="lc-sub">The <code>base</code> rule and the official workflow this lesson follows.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — GitHub Pages limits</span><span class="lc-sub">Size, bandwidth, build and deployment limits, and prohibited uses.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Managing a custom domain</span><span class="lc-sub">DNS records for subdomains and apex domains, and domain verification.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Why the portfolio link on your CV is broken.</strong> <b>White page, no error.</b> <code>base</code> is missing or does not match the repository name exactly — <code>/Portfolio/</code> and <code>/portfolio/</code> are different paths. <b>It worked, then 404 everywhere after adding a domain.</b> <code>base</code> still says <code>/portfolio/</code>; a domain serves from <code>/</code>. <b>The Actions run is green but the site is old.</b> Source is still "Deploy from a branch", so Pages keeps serving the branch. <b>The live page is blank and the browser asks for <code>/src/main.jsx</code>.</b> Source is "Deploy from a branch" on <code>main</code>, so Pages serves the unbuilt source <code>index.html</code> instead of the built <code>dist/</code>. <b>You committed <code>dist/</code> "so Pages can find it".</b> Let the workflow build it; add <code>dist</code> to <code>.gitignore</code>.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.2</span>
<h2>Portfolio trên github.io, deploy bằng một lần push</h2>
<p class="lead">Nhà tuyển dụng sẵn lòng bấm một đường link hơn nhiều so với clone một repo. GitHub Pages biến một repo thành website ở <code>https://&lt;user&gt;.github.io/…</code>, miễn phí cho repo public, có sẵn HTTPS. Với một portfolio React/Vite, toàn bộ việc cài đặt là một dòng cấu hình và một file workflow — cộng một lỗi kinh điển sinh ra trang trắng tinh không kèm lỗi nào.</p>

<h3>Pages là gì — và không là gì</h3>
${slide('git-15', 7, 'GitHub Pages: hai cách xuất bản')}
<p>Định nghĩa của chính GitHub rất chính xác: một dịch vụ lưu trữ site <strong>tĩnh</strong> (static — chỉ gồm file), lấy file HTML, CSS, JavaScript từ một repo, tuỳ chọn chạy bước build, rồi xuất bản. Không có máy chủ nào của bạn chạy cả. App React của bạn thì ổn — sau <code>vite build</code> nó chỉ còn là file — nhưng API Express phía sau cuongthai.com, một backend Spring Boot, PHP, hay bất cứ thứ gì cần CSDL đều không chạy được trên Pages.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">User site</span><span class="v">Site tài khoản — repo tên đúng <code>&lt;user&gt;.github.io</code> được xuất bản ở <code>https://&lt;user&gt;.github.io</code>. Mỗi tài khoản một cái.</span></div>
  <div class="kv"><span class="k">Project site</span><span class="v">Site dự án — mọi repo khác được xuất bản ở <code>https://&lt;user&gt;.github.io/&lt;repo&gt;/</code>. Mỗi repo một cái.</span></div>
  <div class="kv"><span class="k">Gói nào dùng được</span><span class="v">GitHub Free: Pages cho repo <strong>public</strong>. Pages từ repo <strong>private</strong> cần gói trả phí như GitHub Pro — thứ có sẵn trong Student Developer Pack (bài 15.3).</span></div>
  <div class="kv"><span class="k">Luôn công khai</span><span class="v">Site đã xuất bản nằm trên internet mở kể cả khi repo là private. Đừng bao giờ xuất bản thứ bạn không dám dán vào một nhóm chat công khai.</span></div>
</div>
<p>Có hai nguồn xuất bản (publishing source), chọn ở <strong>Settings → Pages → Build and deployment → Source</strong>:</p>
<ul>
<li><strong>Deploy from a branch</strong> (xuất bản từ nhánh) — chọn một nhánh và thư mục gốc <code>/</code> hoặc thư mục <code>/docs</code>; GitHub phục vụ file ở đó (mặc định chạy qua Jekyll). Hợp với một <code>index.html</code> viết tay.</li>
<li><strong>GitHub Actions</strong> — workflow của chính bạn build site rồi tải kết quả lên. Đây là thứ Vite cần, vì các file muốn xuất bản (<code>dist/</code>) chưa tồn tại cho tới khi build chạy — và bạn không nên commit <code>dist/</code>.</li>
</ul>

<h3>Portfolio từ con số không</h3>
<p>Mọi thứ dưới đây chạy thật trong một thư mục thử (Vite 8.3, Node 22):</p>
<pre><code class="language-bash">npm create vite@latest portfolio -- --template react --no-interactive
cd portfolio
npm install
npm run build</code></pre>
<div class="out">vite v8.3.0 building client environment for production...
transforming...
✓ 16 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.47 kB │ gzip:  0.32 kB
dist/assets/index-DYnayYsT.css    0.08 kB │ gzip:  0.10 kB
dist/assets/index-D4lLP2T1.js   220.20 kB │ gzip: 68.97 kB

✓ built in 195ms</div>
<p>Build chạy được, và <code>npm run preview</code> hiện trang trên máy bạn. Chính vì thế vấn đề tiếp theo mới khó hiểu: trên máy chẳng có gì sai.</p>

<h3>Base path: vì sao trang trắng</h3>
${slide('git-15', 9, 'Base path /tên-repo/ và lỗi trang trắng')}
<p>Một project site nằm trong một thư mục con của tên miền: <code>https://cuonghoang1103.github.io/portfolio/</code>. Mặc định Vite giả định site nằm ở gốc <code>/</code>, và ghi đường dẫn tuyệt đối vào <code>dist/index.html</code>:</p>
<pre><code class="language-bash">grep -o <span class="tok-string">'src="[^"]*"'</span> dist/index.html</code></pre>
<div class="out">src="/assets/index-D4lLP2T1.js"</div>
<p>Trên GitHub Pages đường dẫn đó trỏ tới <code>https://cuonghoang1103.github.io/assets/…</code> — nằm ngoài site của bạn. Để chỉ ra điều này mà không đụng tới GitHub, kho thử phục vụ <code>dist/</code> trong một thư mục <code>portfolio/</code> bằng một máy chủ tĩnh Node nhỏ xíu — đúng bố cục Pages dùng — rồi gọi ba địa chỉ:</p>
<pre><code class="language-bash">node gia-lap-pages.mjs /portfolio/ /assets/index-D4lLP2T1.js /portfolio/assets/index-D4lLP2T1.js</code></pre>
<div class="out">200 /portfolio/
404 /assets/index-D4lLP2T1.js
200 /portfolio/assets/index-D4lLP2T1.js</div>
<p>HTML về tới nơi (200), còn file JavaScript lẽ ra vẽ mọi thứ thì không (404), và trình duyệt hiện một <code>&lt;div id="root"&gt;</code> rỗng: trang trắng. Cách sửa là một dòng — nói cho Vite biết site sẽ nằm ở đâu:</p>
<pre><code class="language-javascript"><span class="tok-comment">// vite.config.js</span>
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',   <span class="tok-comment">// project site: https://&lt;user&gt;.github.io/portfolio/</span>
})</code></pre>
<p>Build lại là mọi đường dẫn mang tiền tố; <code>npm run preview</code> giờ phục vụ ở <code>http://localhost:4173/portfolio/</code>, nên bạn thử đúng dạng địa chỉ như trên production:</p>
<div class="out">src="/portfolio/assets/index-BlxItUYO.js"</div>
<p>Còn một cái bẫy sống sót qua lần sửa. Vite viết lại những đường dẫn nó biết — trong <code>index.html</code>, trong lệnh import, trong CSS — nhưng không đụng tới một chuỗi bạn gõ tay trong JSX. Portfolio thử có hai link tới CV ở <code>public/cv.pdf</code>:</p>
<pre><code class="language-javascript">&lt;a href="/cv.pdf"&gt;Tải CV (sai)&lt;/a&gt;
&lt;a href={import.meta.env.BASE_URL + 'cv.pdf'}&gt;Tải CV (đúng)&lt;/a&gt;</code></pre>
<div class="out">200 /portfolio/cv.pdf
404 /cv.pdf</div>
<p><code>import.meta.env.BASE_URL</code> được thay bằng giá trị <code>base</code> lúc build (gói JS sau build chứa đúng chuỗi <code>href:&#96;/portfolio/cv.pdf&#96;</code>), nên nó vẫn đúng khi sau này bạn chuyển sang tên miền riêng và đặt <code>base: '/'</code>. Điều tương tự áp dụng cho <code>&lt;img src="/avatar.png"&gt;</code> và cho React Router: truyền cho <code>BrowserRouter</code> một <code>basename={import.meta.env.BASE_URL}</code>.</p>
<div class="callout warn"><strong>Tải lại một đường dẫn sâu.</strong> Pages chỉ phục vụ file có thật. Với định tuyến phía trình duyệt, <code>/portfolio/projects</code> chạy được khi bạn bấm tới nó nhưng trả 404 khi bạn tải lại trang, vì không có <code>projects/index.html</code>. Portfolio một trang thì không bao giờ gặp; nếu thêm route, hoặc dùng đường dẫn dạng hash (<code>#/projects</code>), hoặc cho Pages một file <code>404.html</code> tuỳ chỉnh — GitHub phục vụ nó cho mọi đường dẫn không tồn tại (vẫn kèm mã trạng thái 404), và nhiều cách dựng SPA cho nó nạp luôn app.</div>

<h3>Workflow deploy</h3>
${slide('git-15', 8, 'Luồng deploy portfolio bằng Actions')}
<p>Trước hết đổi nguồn: <strong>Settings → Pages → Build and deployment → Source → GitHub Actions</strong>. Rồi commit file này thành <code>.github/workflows/deploy.yml</code>. Nó theo đúng workflow trong hướng dẫn deploy của Vite, mỗi action ở phiên bản chính mới nhất (kiểm 09/2026):</p>
<pre><code class="language-yaml">name: Deploy portfolio to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: &#36;{{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: ./dist
      - id: deployment
        uses: actions/deploy-pages@v5</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">permissions</span><span class="v"><code>pages: write</code> và <code>id-token: write</code> là thứ <code>deploy-pages</code> cần; mọi quyền khác giữ ở mức chỉ đọc (bài 11.2).</span></div>
  <div class="kv"><span class="k">environment: github-pages</span><span class="v">Môi trường (environment) mặc định của Pages. <code>url</code> của nó thành link "View deployment" trên lượt chạy.</span></div>
  <div class="kv"><span class="k">upload-pages-artifact</span><span class="v">Đóng gói <code>./dist</code> — kết quả build, thứ không bao giờ vào Git.</span></div>
  <div class="kv"><span class="k">concurrency: pages</span><span class="v">Ba lần push liền nhau không đua nhau deploy ba lần; lần mới nhất thắng.</span></div>
</div>
<p>Kiểm trước khi push, như ở Chương 11. Lỡ tay xoá dòng <code>id: deployment</code> là actionlint bắt được chỗ tham chiếu treo:</p>
<div class="out">.github/workflows/deploy.yml:21:16: property "deployment" is not defined in object type {} [expression]
   |
21 |       url: &#36;{{ steps.deployment.outputs.page_url }}
   |                ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</div>
<p>Push lên <code>main</code>, mở tab <strong>Actions</strong>, và khi lượt chạy xanh thì link dưới job <code>deploy</code> mở ra site của bạn.</p>

<h3>Tên miền riêng, có HTTPS</h3>
${slide('git-15', 10, 'Domain riêng và HTTPS')}
<p>Student Pack có tên miền miễn phí một năm (bài 15.3), và <code>cuong.dev</code> trên CV đọc lên hay hơn một thư mục con của github.io. Hai phần, theo đúng thứ tự:</p>
<ol>
<li><strong>DNS ở nhà đăng ký tên miền.</strong> Với subdomain (tên miền con) như <code>www</code> hay <code>portfolio</code>: một bản ghi <code>CNAME</code> trỏ tới <code>&lt;user&gt;.github.io</code>. Với tên miền gốc (apex): bốn bản ghi <code>A</code> — <code>185.199.108.153</code>, <code>185.199.109.153</code>, <code>185.199.110.153</code>, <code>185.199.111.153</code> — hoặc một bản ghi <code>ALIAS</code>/<code>ANAME</code> nếu nhà cung cấp DNS có.</li>
<li><strong>Settings → Pages → Custom domain</strong>, gõ tên miền, <strong>Save</strong>. GitHub chạy một phép kiểm DNS rồi xin chứng chỉ từ Let’s Encrypt; khi xong thì tích <strong>Enforce HTTPS</strong> (bắt buộc HTTPS) để HTTP thường tự chuyển hướng.</li>
</ol>
<ul>
<li>Dùng workflow Actions riêng thì không cần file <code>CNAME</code> trong repo — có thì cũng bị bỏ qua; cài đặt nằm ở Settings.</li>
<li>GitHub khuyên <strong>xác minh</strong> tên miền trong cài đặt tài khoản trước, để không ai khác trỏ được một site Pages vào nó (tấn công "takeover" — chiếm tên miền).</li>
<li>Giờ site nằm ở gốc một tên miền: đặt lại <code>base: '/'</code> rồi build lại, không thì mọi thứ 404 theo chiều ngược lại.</li>
<li>Site <code>github.io</code> tự được phục vụ qua HTTPS. Mixed content (nội dung trộn) — một ảnh <code>http://</code> trên trang HTTPS — là lý do thường gặp khiến biểu tượng ổ khoá biến mất.</li>
</ul>

<h3>Giới hạn (tính đến 09/2026)</h3>
${slide('git-15', 11, 'Giới hạn của GitHub Pages')}
<table>
<tr><th>Giới hạn</th><th>Giá trị (docs.github.com)</th></tr>
<tr><td>Dung lượng site đã xuất bản</td><td>tối đa 1 GB</td></tr>
<tr><td>Repo nguồn</td><td>khuyến nghị tối đa 1 GB</td></tr>
<tr><td>Băng thông</td><td>giới hạn mềm 100 GB mỗi tháng</td></tr>
<tr><td>Thời gian deploy</td><td>quá 10 phút thì hết giờ (timeout)</td></tr>
<tr><td>Số lần build</td><td>giới hạn mềm 10 lần mỗi giờ — không áp dụng khi bạn build bằng workflow Actions của mình</td></tr>
<tr><td>Giới hạn tần suất</td><td>có thể áp dụng; bạn nhận HTTP 429</td></tr>
</table>
<p>Giới hạn "mềm" nghĩa là GitHub có thể liên hệ bạn hoặc ngừng phục vụ, không phải cắt ngay lập tức. Pages cũng không được dùng làm hosting miễn phí cho kinh doanh online, thương mại điện tử hay SaaS, cũng không cho giao dịch nhạy cảm như mật khẩu hay số thẻ. Một portfolio cá nhân vài megabyte còn cách mọi con số này rất xa.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Bạn muốn trên CV có một đường link mở ra bằng một cú bấm. Ở thư mục cha của <code>thu-git</code>, chạy <code>npm create vite@latest portfolio -- --template react --no-interactive</code>, rồi <code>npm install</code>, và thay <code>src/App.jsx</code> bằng tên bạn, một dòng về việc bạn đang tìm, và hai dự án tốt nhất.</li><li>Đặt một file vào <code>public/</code> (CV dạng PDF) và link tới nó hai lần: một lần <code>href="/cv.pdf"</code>, một lần <code>href={import.meta.env.BASE_URL + 'cv.pdf'}</code>. Đặt <code>base: '/portfolio/'</code>, chạy <code>npm run build</code>, rồi kiểm <code>grep -o 'src="[^"]*"' dist/index.html</code>.</li><li><code>npm run preview</code> và mở địa chỉ nó in ra. Bấm cả hai link CV: một cái chạy, một cái 404. Xoá cái sai.</li><li>Tạo repo <code>portfolio</code> trên GitHub, thêm <code>.github/workflows/deploy.yml</code> của bài, đổi <strong>Source</strong> sang <strong>GitHub Actions</strong>, push, và theo dõi lượt chạy.</li></ol>
<pre><code class="language-bash">grep -o <span class="tok-string">'src="[^"]*"'</span> dist/index.html
src="/portfolio/assets/index-BlxItUYO.js"   <span class="tok-comment"># output thật trong kho thử — mã băm của bạn sẽ khác</span></code></pre>
<p><strong>Đạt khi:</strong> <code>https://&lt;tài-khoản&gt;.github.io/portfolio/</code> hiện trang của bạn (không trắng), tab Network trong DevTools của trình duyệt không có dòng 404 nào, link CV còn lại tải được file, và lượt chạy Actions có job <code>deploy</code> xanh.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GitHub Pages</span><span class="v">Dịch vụ lưu trữ site tĩnh của GitHub — xuất bản HTML/CSS/JS từ một repo ở <code>&lt;user&gt;.github.io</code>.</span></div>
  <div class="kv"><span class="k">Static site</span><span class="v">Site tĩnh — chỉ gồm file được phục vụ nguyên trạng; không có mã phía máy chủ hay CSDL chạy cho nó.</span></div>
  <div class="kv"><span class="k">Base path (<code>base</code>)</span><span class="v">Đường dẫn gốc — thư mục con mà site nằm dưới, vd <code>/portfolio/</code>; Vite gắn nó vào trước mọi đường dẫn file khi build.</span></div>
  <div class="kv"><span class="k">Publishing source</span><span class="v">Nguồn xuất bản — nơi Pages lấy site: một nhánh (và thư mục), hoặc một workflow GitHub Actions.</span></div>
  <div class="kv"><span class="k">Custom domain</span><span class="v">Tên miền riêng — tên miền của bạn trỏ về Pages bằng CNAME (tên miền con) hoặc bản ghi A (tên miền gốc), khai trong Settings → Pages.</span></div>
  <div class="kv"><span class="k">Soft limit</span><span class="v">Giới hạn mềm — mức trần GitHub có thể áp bằng cách liên hệ hoặc giảm tốc, không phải tự động chặn đứng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Pages chỉ phục vụ file tĩnh: app React đã build thì được, backend Node hay Java thì không.</li><li>Project site nằm ở <code>/&lt;repo&gt;/</code>, nên Vite cần <code>base: '/&lt;repo&gt;/'</code>, không thì JavaScript 404 và trang trắng.</li><li>Đường dẫn gõ tay trong JSX cần <code>import.meta.env.BASE_URL</code>; Vite không viết lại chúng.</li><li>Source = GitHub Actions cùng <code>configure-pages</code> → <code>upload-pages-artifact</code> → <code>deploy-pages</code> sẽ deploy ở mỗi lần push lên <code>main</code>.</li><li>Tên miền riêng: CNAME hoặc bốn bản ghi A, khai Custom domain trong Settings, bật Enforce HTTPS, và đặt <code>base: '/'</code>.</li></ul>

<a class="link-card" href="https://vite.dev/guide/static-deploy" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Vite — Deploy site tĩnh (mục GitHub Pages)</span><span class="lc-sub">Luật đặt <code>base</code> và workflow chính thức mà bài này làm theo.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Giới hạn của GitHub Pages</span><span class="lc-sub">Dung lượng, băng thông, giới hạn build và deploy, và những cách dùng bị cấm.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Quản lý tên miền riêng</span><span class="lc-sub">Bản ghi DNS cho tên miền con và tên miền gốc, và việc xác minh tên miền.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Vì sao link portfolio trên CV của bạn hỏng.</strong> <b>Trang trắng, không báo lỗi.</b> Thiếu <code>base</code> hoặc nó không khớp đúng từng chữ với tên repo — <code>/Portfolio/</code> và <code>/portfolio/</code> là hai đường dẫn khác nhau. <b>Đang chạy, thêm tên miền xong thì 404 khắp nơi.</b> <code>base</code> vẫn là <code>/portfolio/</code>; tên miền riêng phục vụ từ <code>/</code>. <b>Lượt Actions xanh mà site vẫn là bản cũ.</b> Source vẫn đang là "Deploy from a branch", nên Pages tiếp tục phục vụ nhánh. <b>Trang trên mạng trắng trơn và trình duyệt đòi file <code>/src/main.jsx</code>.</b> Source đang là "Deploy from a branch" trên <code>main</code>, nên Pages phục vụ file <code>index.html</code> nguồn chưa build thay vì <code>dist/</code> đã build. <b>Commit luôn <code>dist/</code> "cho Pages tìm thấy".</b> Để workflow build nó; thêm <code>dist</code> vào <code>.gitignore</code>.</div>
</div>
`,
    },
    /* ─────────────────────────── 15.3 ─────────────────────────── */
    {
      title: '15.3 — Student Developer Pack, Codespaces & Copilot for students|||15.3 — Student Developer Pack, Codespaces & Copilot cho sinh viên',
      slug: 'git-15-3-student-pack-codespaces',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Xác minh sinh viên trên GitHub Education và các quyền lợi chính của Student Developer Pack, Codespaces (máy dev trên trình duyệt, devcontainer, hạn mức giờ lõi và lưu trữ miễn phí), và gói Copilot Student — số liệu kiểm trên docs.github.com và education.github.com, tính đến 09/2026.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3</span>
<h2>What your student card is worth on GitHub</h2>
<p class="lead">GitHub gives verified students a paid plan, a cloud development machine, an AI assistant and a bundle of partner offers, for free, while you are studying. Most FPTU students never claim it, or claim it and use none of it. This lesson is about getting verified on the first try, and then about the three parts that actually change how you work: GitHub Pro, Codespaces and Copilot.</p>
<div class="callout warn"><strong>Numbers in this lesson are "as of 09/2026".</strong> Plans, credits and partner offers change several times a year. Every figure below was checked on docs.github.com or education.github.com in September 2026; before you rely on one, open the linked page and check again.</div>

<h3>Getting verified: GitHub Education</h3>
${slide('git-15', 12, 'GitHub Student Developer Pack')}
<p>The Student Developer Pack comes with being a verified student on <strong>GitHub Education</strong>. According to GitHub’s documentation you qualify if you:</p>
<ul>
<li>are enrolled in a degree- or diploma-granting program (a university such as FPTU counts);</li>
<li>can provide documents that prove your <strong>current</strong> student status;</li>
<li>have a personal GitHub account;</li>
<li>are at least 13 years old.</li>
</ul>
<p>Apply at <code>github.com/settings/education/benefits</code> → <strong>Start an application</strong>. Accepted proof includes a picture of your student ID with a current enrollment date, your class schedule, your transcript, or an enrollment verification letter.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">School email</span><span class="v">If recent applicants from your school verified with an academic email, GitHub requires one from you too. Add and verify your school address (for FPTU, the <code>…@fpt.edu.vn</code> one) under Settings → Emails <strong>before</strong> applying. Lowercase, no <code>+</code> tricks.</span></div>
  <div class="kv"><span class="k">A document with a date</span><span class="v">The most common rejection is a blurry photo or a card without a visible date. Photograph the student card flat, in good light, with the validity or enrollment date readable.</span></div>
  <div class="kv"><span class="k">One account</span><span class="v">An academic email can be used for one Pack only, and holding several personal accounts is against GitHub’s Terms. Apply from the account you want on your CV.</span></div>
  <div class="kv"><span class="k">It expires</span><span class="v">Access ends when your student status does; you can reapply while still eligible. Timed partner offers usually start when you activate them, not when you are approved — activate the domain when you are ready to use it.</span></div>
</div>

<h3>What is in the Pack</h3>
<p>The Pack page lists dozens of offers. The ones worth knowing about as a web student (education.github.com, as of 09/2026):</p>
<table>
<tr><th>Offer</th><th>What you get</th><th>Useful for</th></tr>
<tr><td>GitHub Pro</td><td>free while you are a student</td><td>Pages from private repos, Pro-level Codespaces quota</td></tr>
<tr><td>Copilot Student</td><td>Copilot plan for verified students</td><td>see below</td></tr>
<tr><td>JetBrains</td><td>student subscription to the professional IDEs, renewed yearly</td><td>IntelliJ IDEA for Java courses</td></tr>
<tr><td>Namecheap / .TECH / Name.com</td><td>a <code>.me</code> domain for 1 year · a <code>.TECH</code> domain for 1 year · a free domain from 25+ extensions such as <code>.dev</code>, <code>.app</code></td><td>custom domain for the portfolio (15.2)</td></tr>
<tr><td>Microsoft Azure</td><td>$100 credit + 25+ free services (18+)</td><td>deploying a backend</td></tr>
<tr><td>Heroku</td><td>$13 USD credit per month for 24 months</td><td>running a small API</td></tr>
<tr><td>MongoDB</td><td>$50 in Atlas credits</td><td>a hosted database</td></tr>
<tr><td>FrontendMasters</td><td>6 months of courses</td><td>JavaScript and front-end depth</td></tr>
</table>
<div class="callout ok">A useful combination for Cường: GitHub Pro for Pages, a free <code>.dev</code> or <code>.me</code> domain pointed at the portfolio (15.2), and one cloud credit for the API behind a project demo. Pick what you will use this semester; activating everything on day one just starts timers.</div>

<h3>Codespaces: a development machine in the browser</h3>
${slide('git-15', 13, 'Codespaces: máy dev trong trình duyệt')}
<p>A <strong>codespace</strong> is a development environment hosted by GitHub: a Docker container running on a Linux virtual machine, from 2 cores / 8 GB RAM up to 32 cores / 128 GB RAM. You connect from the browser (VS Code for the web), from VS Code on your machine, or with <code>gh codespace ssh</code>. It clones the repository into <code>/workspaces/&lt;repo&gt;</code> and you work as if it were local.</p>
<p>Why this matters to a student: the lab machine at school has an old Node; a teammate on Windows cannot get the project to start; your Mac is at home. A codespace built from the repository gives everyone the same environment in about a minute. You describe that environment in a file:</p>
<pre><code class="language-json"><span class="tok-comment">// .devcontainer/devcontainer.json</span>
{
  "name": "portfolio",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:22",
  "postCreateCommand": "npm ci",
  "forwardPorts": [5173]
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">image</span><span class="v">A ready-made Dev Container image with Node 22 and common tools. Pin the major version so the codespace matches your CI.</span></div>
  <div class="kv"><span class="k">postCreateCommand</span><span class="v">Runs once after the container is created — installing dependencies means <code>npm run dev</code> works immediately.</span></div>
  <div class="kv"><span class="k">forwardPorts</span><span class="v">Exposes Vite’s dev server port; Codespaces gives you a private link to open it in a browser tab.</span></div>
</div>
<p>Commit the file, then on the repository page: <strong>Code → Codespaces → Create codespace on main</strong>. From the terminal the same thing is <code>gh codespace create -R cuonghoang1103/portfolio</code>; <code>gh codespace list</code> shows yours and <code>gh codespace stop</code> stops one.</p>

<h3>The free quota, and how not to burn it</h3>
<p>Every personal account has a monthly quota (docs.github.com, as of 09/2026):</p>
<table>
<tr><th>Plan</th><th>Compute per month</th><th>Storage per month</th></tr>
<tr><td>GitHub Free</td><td>120 core hours</td><td>15 GB-month</td></tr>
<tr><td>GitHub Pro (included in the Student Pack)</td><td>180 core hours</td><td>20 GB-month</td></tr>
</table>
<p>The unit is <strong>core hours</strong>: time active × the machine’s multiplier, which is 2 for a 2-core machine. So 120 core hours is about <strong>60 hours</strong> on the smallest machine, and 180 is about 90 — plenty for a course project, gone in a week if you pick an 8-core machine and leave it running.</p>
<ul>
<li>A codespace consumes compute only while it is <strong>running</strong>. It stops by itself after the default <strong>30-minute</strong> idle timeout; stop it yourself when you finish.</li>
<li><strong>Storage</strong> is charged for as long as the codespace exists, running or not. Stopped codespaces are deleted automatically after the default retention period of <strong>30 days</strong>; delete old ones sooner.</li>
<li>Without a payment method on file, usage is simply <strong>blocked</strong> when the quota is used up — there is no surprise bill. You can export your changes to a branch and wait for the monthly reset.</li>
</ul>
<div class="callout warn">A codespace is a machine you do not watch. Commit and push from it like from your laptop — uncommitted work in a codespace that gets deleted after 30 days is gone. And never paste real production secrets into it; use Codespaces secrets in your settings if a project needs keys.</div>

<h3>Copilot for students</h3>
${slide('git-15', 14, 'Copilot cho sinh viên')}
<p>As of 09/2026 GitHub lists a dedicated <strong>Copilot Student</strong> plan: free for verified students, with a monthly allowance of GitHub AI Credits, automatic model selection, and agents included except third-party agents. For comparison, Copilot Free is available to anyone with limited access, and Copilot Pro costs $10 USD per month. GitHub re-evaluates student eligibility every month.</p>
<ol>
<li>Get approved on GitHub Education.</li>
<li>Go to <code>github.com/settings/education/benefits</code>; under the free developer resources for students, click <strong>Learn more</strong>.</li>
<li>Follow the prompts to activate Copilot Student and choose your usage policies.</li>
</ol>
<p>GitHub’s own troubleshooting note is worth repeating: approval and Copilot activation are separate steps, and the student benefit can take several days to apply. If you only see paid checkout pages, <strong>do not buy</strong> — wait a few days and try again from your Copilot settings.</p>
<div class="callout warn"><strong>Using it for coursework.</strong> Read your course’s rules on AI tools before using Copilot on graded work. In a SWP391 defence the lecturer asks you to explain your code; a function you cannot explain costs more than it saved. Use it to write the boring parts you already understand, to explain an unfamiliar codebase (15.4), and to suggest tests — and read every line it writes.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>You want the free domain and Pages-from-private before your OJT applications. In GitHub Settings → Emails, add and verify your school email. Photograph your student card so the dates are readable, then apply at <code>github.com/settings/education/benefits</code>.</li><li>While you wait for approval, add <code>.devcontainer/devcontainer.json</code> from this lesson to your <code>portfolio</code> repository and push it.</li><li>Create a codespace on <code>main</code>. In its terminal run <code>node --version</code> and <code>npm run dev</code>, open the forwarded port 5173, and change one line of <code>App.jsx</code> to see it reload.</li><li>Commit and push from the codespace, then stop it (<code>gh codespace stop</code> or the Codespaces page). Open Settings → Billing and find your Codespaces usage for this month.</li></ol>
<p><strong>Done when:</strong> <code>node --version</code> in the codespace prints <code>v22.…</code>, the commit made inside the codespace appears on GitHub, <code>gh codespace list</code> shows the codespace as stopped (Shutdown), and your education application shows as submitted or approved.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GitHub Education</span><span class="v">GitHub’s program for students and teachers; verification unlocks the Student Developer Pack.</span></div>
  <div class="kv"><span class="k">Student Developer Pack</span><span class="v">The bundle of free offers for verified students: GitHub Pro, Copilot Student, IDEs, domains, cloud credits.</span></div>
  <div class="kv"><span class="k">Codespace</span><span class="v">A cloud development environment: a container on a GitHub-hosted Linux VM, opened in a browser or VS Code.</span></div>
  <div class="kv"><span class="k">Dev container (<code>devcontainer.json</code>)</span><span class="v">A file describing the image, setup commands and ports for a development container, committed with the code.</span></div>
  <div class="kv"><span class="k">Core hour</span><span class="v">Codespaces’ compute unit: hours running × cores multiplier (2 for a 2-core machine).</span></div>
  <div class="kv"><span class="k">Copilot Student</span><span class="v">A free Copilot plan for verified students, with a monthly AI-credit allowance (as of 09/2026).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Verification needs current proof with a readable date, and your school email if your school requires it.</li><li>The Pack’s most useful parts for a web student are GitHub Pro, a free domain, cloud credit and Copilot Student.</li><li>A codespace is a container on a Linux VM, described by <code>.devcontainer/devcontainer.json</code> in the repo.</li><li>Free quota is counted in core hours: 120 (Free) or 180 (Pro) — about 60 or 90 hours on a 2-core machine — plus 15 or 20 GB-month storage.</li><li>Stop codespaces when done, delete old ones, and read your course rules before using Copilot on graded work.</li></ul>

<a class="link-card" href="https://education.github.com/pack" target="_blank" rel="noopener">
  <span class="lc-ico">🎒</span>
  <span class="lc-body"><span class="lc-title">GitHub Student Developer Pack</span><span class="lc-sub">The current list of offers and their conditions.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/education/about-github-education/github-education-for-students/apply-to-github-education-as-a-student" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Apply to GitHub Education as a student</span><span class="lc-sub">Eligibility, accepted documents, academic email rules.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/billing/concepts/product-billing/github-codespaces" target="_blank" rel="noopener">
  <span class="lc-ico">☁️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Codespaces billing</span><span class="lc-sub">Free quota per plan, core-hour multipliers, what happens when it runs out.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/enable-copilot/set-up-for-students" target="_blank" rel="noopener">
  <span class="lc-ico">🤖</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Access Copilot for free as a student</span><span class="lc-sub">Activation steps and what to do if you only see paid plans.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>How students waste the Pack.</strong> <b>Applying with a blurry card and no school email</b>, getting rejected, and giving up — reapply with a clear, dated document. <b>Activating every timed offer on approval day</b>, so the free domain has expired by the time the portfolio exists. <b>An 8-core codespace left running over a weekend</b> — 8 core hours per hour, the whole month’s quota in under a day. <b>A second GitHub account "for school"</b> to get the Pack: against the Terms, and your contributions end up split across two profiles.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.3</span>
<h2>Thẻ sinh viên của bạn đáng giá bao nhiêu trên GitHub</h2>
<p class="lead">GitHub tặng sinh viên đã xác minh một gói trả phí, một máy phát triển trên mây, một trợ lý AI và cả một gói ưu đãi từ đối tác, miễn phí, trong suốt thời gian đi học. Đa số sinh viên FPTU không bao giờ nhận, hoặc nhận rồi chẳng dùng cái nào. Bài này nói về chuyện được xác minh ngay lần đầu, rồi về ba thứ thật sự đổi cách bạn làm việc: GitHub Pro, Codespaces và Copilot.</p>
<div class="callout warn"><strong>Mọi con số trong bài là "tính đến 09/2026".</strong> Gói, tín dụng và ưu đãi đối tác thay đổi vài lần mỗi năm. Mỗi số dưới đây đều đã kiểm trên docs.github.com hoặc education.github.com vào tháng 9/2026; trước khi dựa vào con số nào, hãy mở trang được dẫn và kiểm lại.</div>

<h3>Được xác minh: GitHub Education</h3>
${slide('git-15', 12, 'GitHub Student Developer Pack')}
<p>Student Developer Pack (gói công cụ cho sinh viên) đi kèm tư cách sinh viên đã xác minh trên <strong>GitHub Education</strong>. Theo tài liệu của GitHub, bạn đủ điều kiện nếu:</p>
<ul>
<li>đang theo học một chương trình có cấp bằng hoặc chứng chỉ (một trường đại học như FPTU là đủ);</li>
<li>cung cấp được giấy tờ chứng minh bạn <strong>hiện đang</strong> là sinh viên;</li>
<li>có một tài khoản GitHub cá nhân;</li>
<li>từ 13 tuổi trở lên.</li>
</ul>
<p>Đăng ký ở <code>github.com/settings/education/benefits</code> → <strong>Start an application</strong>. Giấy tờ được chấp nhận gồm ảnh thẻ sinh viên có ngày nhập học/hiệu lực còn hạn, thời khoá biểu, bảng điểm, hoặc giấy xác nhận sinh viên.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Email trường</span><span class="v">Nếu những người đăng ký gần đây từ trường bạn đã xác minh bằng email trường, GitHub sẽ bắt bạn dùng email trường. Thêm và xác minh địa chỉ trường (với FPTU là địa chỉ <code>…@fpt.edu.vn</code>) ở Settings → Emails <strong>trước khi</strong> nộp. Viết thường, không dùng mẹo dấu <code>+</code>.</span></div>
  <div class="kv"><span class="k">Giấy tờ có ngày tháng</span><span class="v">Lý do bị từ chối hay gặp nhất là ảnh mờ hoặc thẻ không thấy ngày. Chụp thẻ sinh viên đặt phẳng, đủ sáng, đọc rõ ngày hiệu lực hoặc ngày nhập học.</span></div>
  <div class="kv"><span class="k">Một tài khoản</span><span class="v">Mỗi email trường chỉ dùng được cho một Pack, và giữ nhiều tài khoản cá nhân là trái Điều khoản của GitHub. Hãy nộp từ đúng tài khoản bạn muốn ghi trên CV.</span></div>
  <div class="kv"><span class="k">Có hạn dùng</span><span class="v">Quyền lợi hết khi bạn thôi là sinh viên; còn đủ điều kiện thì nộp lại được. Ưu đãi đối tác có thời hạn thường tính từ lúc bạn kích hoạt, không phải lúc được duyệt — hãy kích hoạt tên miền khi bạn sẵn sàng dùng nó.</span></div>
</div>

<h3>Trong Pack có gì</h3>
<p>Trang Pack liệt kê hàng chục ưu đãi. Những cái đáng biết với một sinh viên làm web (education.github.com, tính đến 09/2026):</p>
<table>
<tr><th>Ưu đãi</th><th>Bạn nhận được</th><th>Dùng vào việc</th></tr>
<tr><td>GitHub Pro</td><td>miễn phí khi còn là sinh viên</td><td>Pages từ repo private, hạn mức Codespaces mức Pro</td></tr>
<tr><td>Copilot Student</td><td>gói Copilot cho sinh viên đã xác minh</td><td>xem bên dưới</td></tr>
<tr><td>JetBrains</td><td>gói sinh viên cho các IDE chuyên nghiệp, gia hạn hằng năm</td><td>IntelliJ IDEA cho các môn Java</td></tr>
<tr><td>Namecheap / .TECH / Name.com</td><td>một tên miền <code>.me</code> 1 năm · một tên miền <code>.TECH</code> 1 năm · một tên miền miễn phí từ hơn 25 đuôi như <code>.dev</code>, <code>.app</code></td><td>tên miền riêng cho portfolio (bài 15.2)</td></tr>
<tr><td>Microsoft Azure</td><td>$100 tín dụng + hơn 25 dịch vụ miễn phí (từ 18 tuổi)</td><td>deploy một backend</td></tr>
<tr><td>Heroku</td><td>$13 USD tín dụng mỗi tháng trong 24 tháng</td><td>chạy một API nhỏ</td></tr>
<tr><td>MongoDB</td><td>$50 tín dụng Atlas</td><td>một CSDL có sẵn trên mây</td></tr>
<tr><td>FrontendMasters</td><td>6 tháng khoá học</td><td>học sâu JavaScript và front-end</td></tr>
</table>
<div class="callout ok">Một tổ hợp hữu ích cho Cường: GitHub Pro để dùng Pages, một tên miền <code>.dev</code> hoặc <code>.me</code> miễn phí trỏ vào portfolio (bài 15.2), và một khoản tín dụng mây cho API phía sau bản demo của dự án. Chọn thứ bạn sẽ dùng trong kỳ này; kích hoạt tất cả ngay ngày đầu chỉ là bấm giờ đếm ngược.</div>

<h3>Codespaces: máy phát triển trong trình duyệt</h3>
${slide('git-15', 13, 'Codespaces: máy dev trong trình duyệt')}
<p>Một <strong>codespace</strong> (không gian mã) là môi trường phát triển do GitHub lưu trữ: một container Docker chạy trên một máy ảo Linux, từ 2 lõi / 8 GB RAM tới 32 lõi / 128 GB RAM. Bạn kết nối từ trình duyệt (VS Code bản web), từ VS Code trên máy mình, hoặc bằng <code>gh codespace ssh</code>. Nó clone repo vào <code>/workspaces/&lt;repo&gt;</code> và bạn làm việc như trên máy.</p>
<p>Vì sao điều này quan trọng với sinh viên: máy phòng lab ở trường có Node cũ; một bạn cùng nhóm dùng Windows không chạy nổi dự án; còn máy Mac của bạn thì để ở nhà. Một codespace dựng từ repo cho cả nhóm cùng một môi trường trong khoảng một phút. Bạn mô tả môi trường đó trong một file:</p>
<pre><code class="language-json"><span class="tok-comment">// .devcontainer/devcontainer.json</span>
{
  "name": "portfolio",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:22",
  "postCreateCommand": "npm ci",
  "forwardPorts": [5173]
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">image</span><span class="v">Một image Dev Container dựng sẵn có Node 22 và công cụ thông dụng. Ghim phiên bản chính để codespace khớp với CI.</span></div>
  <div class="kv"><span class="k">postCreateCommand</span><span class="v">Chạy một lần sau khi container được tạo — cài sẵn thư viện nghĩa là <code>npm run dev</code> chạy được ngay.</span></div>
  <div class="kv"><span class="k">forwardPorts</span><span class="v">Mở cổng của máy chủ dev Vite; Codespaces cho bạn một link riêng để mở nó trong một tab trình duyệt.</span></div>
</div>
<p>Commit file này, rồi trên trang repo: <strong>Code → Codespaces → Create codespace on main</strong>. Từ terminal thì là <code>gh codespace create -R cuonghoang1103/portfolio</code>; <code>gh codespace list</code> liệt kê codespace của bạn và <code>gh codespace stop</code> dừng một cái.</p>

<h3>Hạn mức miễn phí, và cách đừng đốt nó</h3>
<p>Mỗi tài khoản cá nhân có một hạn mức hằng tháng (docs.github.com, tính đến 09/2026):</p>
<table>
<tr><th>Gói</th><th>Tính toán mỗi tháng</th><th>Lưu trữ mỗi tháng</th></tr>
<tr><td>GitHub Free</td><td>120 giờ lõi</td><td>15 GB-tháng</td></tr>
<tr><td>GitHub Pro (có trong Student Pack)</td><td>180 giờ lõi</td><td>20 GB-tháng</td></tr>
</table>
<p>Đơn vị là <strong>giờ lõi</strong> (core hour): thời gian chạy × hệ số của máy, với máy 2 lõi là 2. Vậy 120 giờ lõi là khoảng <strong>60 giờ</strong> trên máy nhỏ nhất, còn 180 là khoảng 90 — thừa cho một đồ án môn học, nhưng hết veo trong một tuần nếu bạn chọn máy 8 lõi rồi để nó chạy.</p>
<ul>
<li>Codespace chỉ tiêu phần tính toán khi đang <strong>chạy</strong>. Nó tự dừng sau thời gian chờ mặc định <strong>30 phút</strong> không dùng; làm xong thì tự dừng nó.</li>
<li><strong>Lưu trữ</strong> bị tính suốt thời gian codespace còn tồn tại, dù chạy hay dừng. Codespace đã dừng tự bị xoá sau thời hạn giữ mặc định <strong>30 ngày</strong>; xoá cái cũ sớm hơn.</li>
<li>Không khai phương thức thanh toán thì hết hạn mức là bị <strong>chặn</strong> — không có hoá đơn bất ngờ. Bạn có thể xuất thay đổi ra một nhánh và chờ hạn mức làm mới đầu tháng.</li>
</ul>
<div class="callout warn">Codespace là một cái máy bạn không trông. Commit và push từ nó y như từ laptop — việc chưa commit trong một codespace bị xoá sau 30 ngày là mất. Và đừng bao giờ dán khoá bí mật của production vào đó; nếu dự án cần khoá, dùng Codespaces secrets trong cài đặt.</div>

<h3>Copilot cho sinh viên</h3>
${slide('git-15', 14, 'Copilot cho sinh viên')}
<p>Tính đến 09/2026, GitHub có một gói <strong>Copilot Student</strong> riêng: miễn phí cho sinh viên đã xác minh, kèm một hạn mức GitHub AI Credits (tín dụng AI) mỗi tháng, model được chọn tự động, và có agent (tác tử AI tự làm nhiều bước) nhưng không gồm agent của bên thứ ba. Để so sánh, Copilot Free dành cho mọi người với quyền dùng hạn chế, còn Copilot Pro giá $10 USD mỗi tháng. GitHub xét lại tư cách sinh viên hằng tháng.</p>
<ol>
<li>Được duyệt trên GitHub Education.</li>
<li>Vào <code>github.com/settings/education/benefits</code>; ở mục tài nguyên miễn phí cho sinh viên, bấm <strong>Learn more</strong>.</li>
<li>Làm theo hướng dẫn để kích hoạt Copilot Student và chọn chính sách sử dụng.</li>
</ol>
<p>Ghi chú xử lý sự cố của chính GitHub đáng nhắc lại: được duyệt và kích hoạt Copilot là hai bước riêng, và quyền lợi sinh viên có thể mất vài ngày mới áp dụng xong. Nếu bạn chỉ thấy trang thanh toán trả phí, <strong>đừng mua</strong> — đợi vài ngày rồi thử lại từ trang cài đặt Copilot.</p>
<div class="callout warn"><strong>Dùng cho bài học.</strong> Đọc quy định về công cụ AI của môn học trước khi dùng Copilot cho bài được chấm điểm. Buổi bảo vệ SWP391, giảng viên bắt bạn giải thích code; một hàm bạn không giải thích nổi làm mất nhiều hơn phần nó tiết kiệm. Hãy dùng nó để viết phần nhàm chán bạn đã hiểu, để giải thích một codebase lạ (bài 15.4), và để gợi ý test — và đọc từng dòng nó viết.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Bạn muốn có tên miền miễn phí và Pages từ repo private trước đợt nộp đơn OJT. Trong GitHub Settings → Emails, thêm và xác minh email trường. Chụp thẻ sinh viên sao cho đọc rõ ngày, rồi nộp ở <code>github.com/settings/education/benefits</code>.</li><li>Trong lúc chờ duyệt, thêm file <code>.devcontainer/devcontainer.json</code> của bài vào repo <code>portfolio</code> và push.</li><li>Tạo một codespace trên <code>main</code>. Trong terminal của nó chạy <code>node --version</code> và <code>npm run dev</code>, mở cổng 5173 đã được chuyển tiếp, sửa một dòng trong <code>App.jsx</code> để thấy trang tự nạp lại.</li><li>Commit và push từ codespace, rồi dừng nó (<code>gh codespace stop</code> hoặc trang Codespaces). Mở Settings → Billing và tìm mức dùng Codespaces của tháng này.</li></ol>
<p><strong>Đạt khi:</strong> <code>node --version</code> trong codespace in ra <code>v22.…</code>, commit tạo trong codespace hiện trên GitHub, <code>gh codespace list</code> cho thấy codespace ở trạng thái đã dừng (Shutdown), và hồ sơ education của bạn hiện là đã nộp hoặc đã duyệt.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GitHub Education</span><span class="v">Chương trình của GitHub cho sinh viên và giáo viên; được xác minh thì mở khoá Student Developer Pack.</span></div>
  <div class="kv"><span class="k">Student Developer Pack</span><span class="v">Gói công cụ cho sinh viên — tập ưu đãi miễn phí: GitHub Pro, Copilot Student, IDE, tên miền, tín dụng mây.</span></div>
  <div class="kv"><span class="k">Codespace</span><span class="v">Không gian mã — môi trường phát triển trên mây: một container trên máy ảo Linux của GitHub, mở bằng trình duyệt hoặc VS Code.</span></div>
  <div class="kv"><span class="k">Dev container (<code>devcontainer.json</code>)</span><span class="v">Container phát triển — file mô tả image, lệnh cài đặt và cổng của môi trường dev, commit cùng với mã.</span></div>
  <div class="kv"><span class="k">Core hour</span><span class="v">Giờ lõi — đơn vị tính toán của Codespaces: số giờ chạy × hệ số số lõi (máy 2 lõi là 2).</span></div>
  <div class="kv"><span class="k">Copilot Student</span><span class="v">Gói Copilot miễn phí cho sinh viên đã xác minh, kèm hạn mức tín dụng AI hằng tháng (tính đến 09/2026).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Xác minh cần giấy tờ còn hạn có ngày tháng đọc được, và email trường nếu trường bạn bị yêu cầu.</li><li>Phần hữu ích nhất của Pack với sinh viên web là GitHub Pro, một tên miền miễn phí, tín dụng mây và Copilot Student.</li><li>Codespace là một container trên máy ảo Linux, mô tả bằng <code>.devcontainer/devcontainer.json</code> trong repo.</li><li>Hạn mức miễn phí tính bằng giờ lõi: 120 (Free) hoặc 180 (Pro) — khoảng 60 hoặc 90 giờ trên máy 2 lõi — cộng 15 hoặc 20 GB-tháng lưu trữ.</li><li>Dừng codespace khi xong, xoá cái cũ, và đọc quy định môn học trước khi dùng Copilot cho bài được chấm.</li></ul>

<a class="link-card" href="https://education.github.com/pack" target="_blank" rel="noopener">
  <span class="lc-ico">🎒</span>
  <span class="lc-body"><span class="lc-title">GitHub Student Developer Pack</span><span class="lc-sub">Danh sách ưu đãi hiện hành và điều kiện của từng cái.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/education/about-github-education/github-education-for-students/apply-to-github-education-as-a-student" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Nộp đơn GitHub Education với tư cách sinh viên</span><span class="lc-sub">Điều kiện, giấy tờ được chấp nhận, quy định email trường.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/billing/concepts/product-billing/github-codespaces" target="_blank" rel="noopener">
  <span class="lc-ico">☁️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Tính phí Codespaces</span><span class="lc-sub">Hạn mức miễn phí từng gói, hệ số giờ lõi, chuyện gì xảy ra khi hết.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/enable-copilot/set-up-for-students" target="_blank" rel="noopener">
  <span class="lc-ico">🤖</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Dùng Copilot miễn phí khi là sinh viên</span><span class="lc-sub">Các bước kích hoạt và phải làm gì nếu chỉ thấy gói trả phí.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Sinh viên phí phạm Pack thế nào.</strong> <b>Nộp với ảnh thẻ mờ và không có email trường</b>, bị từ chối, rồi bỏ cuộc — hãy nộp lại với giấy tờ rõ, có ngày tháng. <b>Kích hoạt mọi ưu đãi có thời hạn ngay ngày được duyệt</b>, để rồi tên miền miễn phí hết hạn đúng lúc portfolio vừa làm xong. <b>Một codespace 8 lõi để chạy qua cuối tuần</b> — 8 giờ lõi mỗi giờ, cả hạn mức tháng bay trong chưa tới một ngày. <b>Lập tài khoản GitHub thứ hai "cho việc học"</b> để lấy Pack: trái Điều khoản, và đóng góp của bạn bị chia đôi trên hai profile.</div>
</div>
`,
    },
    /* ─────────────────────────── 15.4 ─────────────────────────── */
    {
      title: '15.4 — Your first open-source contribution|||15.4 — Đóng góp mã nguồn mở lần đầu',
      slug: 'git-15-4-dong-gop-ma-nguon-mo',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Từ good first issue tới PR được merge: chọn dự án và issue, đọc CONTRIBUTING và CODE_OF_CONDUCT, hỏi trước khi làm, fork → nhánh → PR nhỏ, DCO và CLA, phản hồi review, đồng bộ fork bằng upstream hoặc gh repo sync — output thật trong kho thử.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.4</span>
<h2>From "good first issue" to a merged pull request</h2>
<p class="lead">A merged pull request in a project you do not own is the strongest line a student GitHub profile can have: it proves you can read someone else’s code, follow their rules and take review from strangers. Chapter 5.4 set up the fork-and-upstream mechanics and Chapter 6 the pull request itself. This lesson is the part those chapters left out — the human side of a first contribution, in the order it actually happens.</p>

<h3>The whole journey</h3>
${slide('git-15', 15, 'Hành trình PR mã nguồn mở đầu tiên')}
<ol>
<li><strong>Find an issue</strong> labelled <code>good first issue</code> or <code>help wanted</code> in a project that is alive.</li>
<li><strong>Read the rules</strong>: <code>CONTRIBUTING.md</code>, <code>CODE_OF_CONDUCT.md</code>, the PR template.</li>
<li><strong>Ask</strong> on the issue before you write code.</li>
<li><strong>Fork, clone, add <code>upstream</code></strong>, create a branch.</li>
<li><strong>Make a small change</strong>, with tests if the project has them, signed off if it uses DCO.</li>
<li><strong>Open the PR</strong> with <code>Fixes #n</code> and a clear description.</li>
<li><strong>Answer review</strong>, push fixes, keep the branch in sync — until it is merged.</li>
</ol>

<h3>Finding a project and an issue</h3>
<p>Maintainers mark beginner-friendly work with the <code>good first issue</code> and <code>help wanted</code> labels — GitHub’s own guide recommends searching for them. On github.com, search issues with <code>is:issue is:open label:"good first issue" language:TypeScript</code>, or browse <code>github.com/topics/&lt;topic&gt;</code> for a subject you care about.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Use something you use</span><span class="v">A library in cuongthai.com’s <code>package.json</code>, a VS Code extension, a Vietnamese-language tool. You already know what "correct" looks like.</span></div>
  <div class="kv"><span class="k">Check it is alive</span><span class="v">Commits in the last month, pull requests merged recently, maintainers answering issues. A project whose last merge was two years ago will not review yours.</span></div>
  <div class="kv"><span class="k">Check the issue is free</span><span class="v">Read the comments. If someone said "I’m on it" last week, pick another one.</span></div>
  <div class="kv"><span class="k">Size it honestly</span><span class="v">A first contribution should be a few lines to a few dozen: a bug with a clear reproduction, a missing test, a documentation fix a real user would hit, a translation.</span></div>
</div>

<h3>Read before you type</h3>
<p>Almost every project that welcomes contributors has a <code>CONTRIBUTING.md</code> (how to set up, run tests, name branches, format commits) and a <code>CODE_OF_CONDUCT.md</code> (how people are expected to treat each other). They are not boilerplate: a PR that ignores the commit format or skips the test command gets closed with a link to the file you did not read. Also look at <code>.github/PULL_REQUEST_TEMPLATE.md</code> — your PR description will need to fill it.</p>
<p>Then ask, on the issue, in one short and specific comment:</p>
<pre><code class="language-markdown">Hi! I'd like to work on this. I can reproduce it on v2.3.1:
formatting a Sunday prints "CN" instead of "Chủ nhật".
My plan is to change the day-name table in src/index.js and add a test.
Does that sound right?</code></pre>
<p>This one comment avoids the two most common ways a first PR is wasted: someone else is already doing it, or the maintainer wanted a different fix. Wait for a reply — a day or two is normal.</p>

<h3>Fork, clone, upstream — and a signed-off commit</h3>
${slide('git-15', 16, 'Fork, upstream và đồng bộ')}
<p>With the GitHub CLI, <code>gh repo fork &lt;owner&gt;/&lt;repo&gt; --clone</code> creates your fork and clones it; check the remotes with <code>git remote -v</code>. Without it, fork on the web and wire up the original yourself. The lab below uses two local bare repositories in place of GitHub — <code>oss-upstream.git</code> is the project, <code>oss-fork.git</code> is your fork — so the output is real:</p>
<pre><code class="language-bash">git remote add upstream ../oss-upstream.git
git remote -v</code></pre>
<div class="out">origin	../oss-fork.git (fetch)
origin	../oss-fork.git (push)
upstream	../oss-upstream.git (fetch)
upstream	../oss-upstream.git (push)</div>
<p><code>origin</code> is yours and you push there; <code>upstream</code> is theirs and you only fetch from it. Work on a branch, never on your fork’s <code>main</code>:</p>
<pre><code class="language-bash">git switch -c fix/12-chu-nhat-day-du
<span class="tok-comment"># edit index.js …</span>
git commit -s -am <span class="tok-string">"fix: hien thi Chu nhat day du (#12)"</span>
git log -1 --format=<span class="tok-string">"%h %s%n%n%b"</span></code></pre>
<div class="out">a9fee7e fix: hien thi Chu nhat day du (#12)

Signed-off-by: Hoang Cuong &lt;cuong@example.com&gt;</div>
<div class="kv-grid">
  <div class="kv"><span class="k">DCO (Developer Certificate of Origin)</span><span class="v">A short statement that you wrote the change or have the right to submit it. Projects that use it check every commit for a <code>Signed-off-by:</code> line — <code>git commit -s</code> adds it from your <code>user.name</code>/<code>user.email</code>. Forgot it? <code>git commit --amend -s</code>, or <code>git rebase --signoff main</code> for several commits.</span></div>
  <div class="kv"><span class="k">CLA (Contributor License Agreement)</span><span class="v">A legal agreement you sign once per project, usually through a bot that comments on your first PR with a link. Read what you sign; it is normal for company-backed projects.</span></div>
</div>
<p>Push the branch to your fork and open the PR against the original repository (Chapter 6.1 for the anatomy). Put <code>Fixes #12</code> in the description so the issue closes on merge, keep the PR to one change, and fill the template.</p>

<h3>Keeping the fork in sync</h3>
<p>While you waited for review, the maintainer merged something else. Your branch is now behind <code>upstream/main</code>, and the PR may show conflicts or a "This branch is out-of-date" notice. Fetch, fast-forward your <code>main</code>, and replay your branch on top:</p>
<pre><code class="language-bash">git fetch upstream
git log --oneline --graph --all</code></pre>
<div class="out">From ../oss-upstream
 * [new branch]      main       -&gt; upstream/main
* e836157 docs: huong dan cai dat
| * a9fee7e fix: hien thi Chu nhat day du (#12)
|/
* 8d37457 init</div>
<pre><code class="language-bash">git switch main
git merge --ff-only upstream/main
git push origin main</code></pre>
<div class="out">Updating 8d37457..e836157
Fast-forward
 README.md | 3 +++
 1 file changed, 3 insertions(+)
To ../oss-fork.git
   8d37457..e836157  main -&gt; main</div>
<pre><code class="language-bash">git switch fix/12-chu-nhat-day-du
git rebase main
git push --force-with-lease origin fix/12-chu-nhat-day-du</code></pre>
<div class="out">Successfully rebased and updated refs/heads/fix/12-chu-nhat-day-du.
To ../oss-fork.git
 + a9fee7e...2cb8aac fix/12-chu-nhat-day-du -&gt; fix/12-chu-nhat-day-du (forced update)</div>
<p>The commit got a new hash (<code>a9fee7e</code> → <code>2cb8aac</code>) because its parent changed — Chapter 8’s rule that rebasing rewrites commits. Force-pushing is fine here because the branch is yours alone; <code>--force-with-lease</code> refuses if the remote branch moved in a way you have not seen (a maintainer can push to your PR branch). <code>--ff-only</code> on <code>main</code> guarantees you never create a merge commit on your fork’s copy of their branch.</p>
<p>Shortcuts, per the <code>gh</code> help and GitHub Docs: <code>gh repo sync</code> inside your clone updates your local branch from the parent repository; <code>gh repo sync &lt;you&gt;/&lt;fork&gt;</code> updates the fork on GitHub; the <strong>Sync fork</strong> button on your fork’s page does the same from the web. All three only fast-forward — if they cannot, fall back to the commands above.</p>

<h3>Review: the part that decides the merge</h3>
<ul>
<li><strong>Every comment gets an answer</strong> — a fix, or a short reason why not. Reply "Done in 3f2c1a0" so the reviewer can check quickly.</li>
<li><strong>Do not argue style.</strong> The project’s conventions win even when you disagree; you are a guest.</li>
<li><strong>Push new commits during review</strong> rather than rewriting everything, unless the project asks you to squash. Many projects squash on merge anyway (6.3).</li>
<li><strong>Silence is normal.</strong> Maintainers are often volunteers. After a week or two without a reply, one polite ping — "Is there anything else you need from me?" — is fine. After that, move on and pick another issue; the work is still visible on your profile.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Rehearse the whole flow locally before you try a real project. Next to <code>thu-git</code>, make a bare "project" and a bare "fork": <code>git clone --bare thu-git oss-upstream.git</code>, then <code>git clone --bare oss-upstream.git oss-fork.git</code>, then <code>git clone oss-fork.git my-fork</code>.</li><li>In <code>my-fork</code>: <code>git remote add upstream ../oss-upstream.git</code>, create <code>fix/1-readme</code>, change a line, and commit with <code>-s</code>. Push the branch with <code>git push -u origin fix/1-readme</code>.</li><li>Play the maintainer: clone <code>oss-upstream.git</code> into another folder, commit something to <code>main</code> and push it.</li><li>Back in <code>my-fork</code>: <code>git fetch upstream</code>, fast-forward <code>main</code> with <code>--ff-only</code>, push it to <code>origin</code>, rebase your branch on <code>main</code>, and <code>git push --force-with-lease</code>.</li></ol>
<p><strong>Done when:</strong> <code>git log --oneline --graph --all</code> in <code>my-fork</code> shows your commit sitting directly on top of the maintainer’s commit, <code>git log -1 --format=%b</code> prints a <code>Signed-off-by:</code> line, and <code>git status -sb</code> shows your branch level with <code>origin</code> (no ahead/behind). Then find one real <code>good first issue</code> and post the "can I take this?" comment.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Good first issue</span><span class="v">A label maintainers put on issues that suit newcomers; <code>help wanted</code> marks work they would welcome help with.</span></div>
  <div class="kv"><span class="k">CONTRIBUTING.md</span><span class="v">The project’s contributor guide: setup, tests, branch and commit conventions, how PRs are reviewed.</span></div>
  <div class="kv"><span class="k">Code of Conduct</span><span class="v">The project’s rules for how participants treat each other, and how problems are reported.</span></div>
  <div class="kv"><span class="k">Upstream</span><span class="v">The original repository your fork came from; you fetch from it and open pull requests against it.</span></div>
  <div class="kv"><span class="k">DCO / sign-off</span><span class="v">Developer Certificate of Origin: a <code>Signed-off-by:</code> line in each commit (<code>git commit -s</code>) stating you may submit the change.</span></div>
  <div class="kv"><span class="k">CLA</span><span class="v">Contributor License Agreement: a legal agreement signed once, usually via a bot on your first PR.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Choose a live project you already use and an unclaimed <code>good first issue</code> you can finish in a few dozen lines.</li><li>Read CONTRIBUTING and the Code of Conduct, then ask on the issue before writing code.</li><li><code>origin</code> is your fork, <code>upstream</code> is theirs; work on a branch and sign off commits if the project uses DCO.</li><li>Sync with <code>git fetch upstream</code>, <code>merge --ff-only</code> on <code>main</code>, rebase the branch, <code>push --force-with-lease</code> — or <code>gh repo sync</code> / Sync fork.</li><li>Answer every review comment, follow their style, and ping politely once if the PR goes quiet.</li></ul>

<a class="link-card" href="https://opensource.guide/how-to-contribute/" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Open Source Guides — How to Contribute to Open Source</span><span class="lc-sub">Finding a project, reading the room, and what to do when a PR is not accepted.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Syncing a fork</span><span class="lc-sub">The web button, <code>gh repo sync</code>, and the command-line way.</span></span>
</a>
<a class="link-card" href="https://developercertificate.org/" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">Developer Certificate of Origin</span><span class="lc-sub">The full text of what a Signed-off-by line certifies.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>How first contributions go wrong.</strong> <b>Working on your fork’s <code>main</code>.</b> The second PR then carries the first one’s commits, and syncing turns into merge commits — always branch. <b>A 2,000-line "refactor everything" PR nobody asked for</b>: it will not be reviewed, however good it is. <b>Twenty one-word typo PRs</b> to fill the contribution graph — maintainers recognise it, and so do recruiters who click. <b>Pasting an AI answer into the issue</b> without reproducing the bug yourself. <b><code>git push --force</code> without <code>-with-lease</code></b> after a maintainer pushed a fix to your branch — you just deleted their commit.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.4</span>
<h2>Từ "good first issue" tới pull request được merge</h2>
<p class="lead">Một pull request được merge vào dự án không phải của mình là dòng mạnh nhất mà một profile GitHub sinh viên có thể có: nó chứng minh bạn đọc được mã người khác, theo được luật của họ và nhận được review từ người lạ. Bài 5.4 đã dựng phần cơ học fork và upstream, Chương 6 dạy chính pull request. Bài này là phần các chương đó bỏ ngỏ — mặt con người của lần đóng góp đầu tiên, theo đúng thứ tự nó thực sự diễn ra.</p>

<h3>Cả hành trình</h3>
${slide('git-15', 15, 'Hành trình PR mã nguồn mở đầu tiên')}
<ol>
<li><strong>Tìm một issue</strong> gắn nhãn <code>good first issue</code> (việc hợp cho người mới) hoặc <code>help wanted</code> (cần giúp) trong một dự án còn sống.</li>
<li><strong>Đọc luật</strong>: <code>CONTRIBUTING.md</code>, <code>CODE_OF_CONDUCT.md</code>, mẫu PR.</li>
<li><strong>Hỏi</strong> trên issue trước khi viết code.</li>
<li><strong>Fork, clone, thêm <code>upstream</code></strong>, tạo nhánh.</li>
<li><strong>Sửa một thay đổi nhỏ</strong>, có test nếu dự án có test, ký sign-off nếu dự án dùng DCO.</li>
<li><strong>Mở PR</strong> có <code>Fixes #n</code> và mô tả rõ ràng.</li>
<li><strong>Trả lời review</strong>, push bản sửa, giữ nhánh đồng bộ — tới khi được merge.</li>
</ol>

<h3>Tìm dự án và issue</h3>
<p>Người duy trì (maintainer) đánh dấu việc hợp cho người mới bằng nhãn <code>good first issue</code> và <code>help wanted</code> — chính hướng dẫn của GitHub khuyên tìm theo hai nhãn này. Trên github.com, tìm issue bằng <code>is:issue is:open label:"good first issue" language:TypeScript</code>, hoặc duyệt <code>github.com/topics/&lt;chủ-đề&gt;</code> theo lĩnh vực bạn quan tâm.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Dùng thứ bạn đang dùng</span><span class="v">Một thư viện trong <code>package.json</code> của cuongthai.com, một extension VS Code, một công cụ tiếng Việt. Bạn đã biết "đúng" trông ra sao.</span></div>
  <div class="kv"><span class="k">Kiểm nó còn sống</span><span class="v">Có commit trong tháng gần đây, PR vừa được merge, maintainer có trả lời issue. Một dự án merge lần cuối hai năm trước sẽ không review PR của bạn.</span></div>
  <div class="kv"><span class="k">Kiểm issue còn trống</span><span class="v">Đọc bình luận. Tuần trước ai đó nói "mình đang làm" thì chọn cái khác.</span></div>
  <div class="kv"><span class="k">Ước lượng thật thà</span><span class="v">Lần đóng góp đầu nên vài dòng tới vài chục dòng: một lỗi có cách tái hiện rõ, một test còn thiếu, một chỗ tài liệu mà người dùng thật sẽ vấp, một bản dịch.</span></div>
</div>

<h3>Đọc trước khi gõ</h3>
<p>Gần như mọi dự án chào đón người đóng góp đều có <code>CONTRIBUTING.md</code> (hướng dẫn đóng góp: cài đặt, chạy test, đặt tên nhánh, định dạng commit) và <code>CODE_OF_CONDUCT.md</code> (quy tắc ứng xử: mọi người đối xử với nhau thế nào). Chúng không phải văn mẫu: một PR phớt lờ định dạng commit hay bỏ qua lệnh test sẽ bị đóng kèm link tới đúng cái file bạn chưa đọc. Xem luôn <code>.github/PULL_REQUEST_TEMPLATE.md</code> — mô tả PR của bạn sẽ phải điền theo nó.</p>
<p>Rồi hỏi, ngay trên issue, bằng một bình luận ngắn và cụ thể:</p>
<pre><code class="language-markdown">Hi! I'd like to work on this. I can reproduce it on v2.3.1:
formatting a Sunday prints "CN" instead of "Chủ nhật".
My plan is to change the day-name table in src/index.js and add a test.
Does that sound right?</code></pre>
<p>Một bình luận này tránh được hai cách phổ biến nhất làm phí PR đầu tiên: người khác đang làm rồi, hoặc maintainer muốn một cách sửa khác. Dự án quốc tế thì viết tiếng Anh, ngắn là được — như mẫu trên. Chờ trả lời — một hai ngày là bình thường.</p>

<h3>Fork, clone, upstream — và một commit có sign-off</h3>
${slide('git-15', 16, 'Fork, upstream và đồng bộ')}
<p>Với GitHub CLI, <code>gh repo fork &lt;chủ&gt;/&lt;repo&gt; --clone</code> tạo fork của bạn rồi clone về; kiểm remote bằng <code>git remote -v</code>. Không dùng gh thì fork trên web rồi tự nối kho gốc. Phần thực hành dưới đây dùng hai kho trần (bare) cục bộ thay cho GitHub — <code>oss-upstream.git</code> là dự án, <code>oss-fork.git</code> là fork của bạn — nên output là thật:</p>
<pre><code class="language-bash">git remote add upstream ../oss-upstream.git
git remote -v</code></pre>
<div class="out">origin	../oss-fork.git (fetch)
origin	../oss-fork.git (push)
upstream	../oss-upstream.git (fetch)
upstream	../oss-upstream.git (push)</div>
<p><code>origin</code> là của bạn, bạn push lên đó; <code>upstream</code> là của họ, bạn chỉ fetch về. Làm trên một nhánh, không bao giờ trên <code>main</code> của fork:</p>
<pre><code class="language-bash">git switch -c fix/12-chu-nhat-day-du
<span class="tok-comment"># sửa index.js …</span>
git commit -s -am <span class="tok-string">"fix: hien thi Chu nhat day du (#12)"</span>
git log -1 --format=<span class="tok-string">"%h %s%n%n%b"</span></code></pre>
<div class="out">a9fee7e fix: hien thi Chu nhat day du (#12)

Signed-off-by: Hoang Cuong &lt;cuong@example.com&gt;</div>
<div class="kv-grid">
  <div class="kv"><span class="k">DCO (Developer Certificate of Origin)</span><span class="v">Chứng nhận nguồn gốc — một tuyên bố ngắn rằng bạn tự viết thay đổi hoặc có quyền gửi nó. Dự án dùng DCO kiểm mọi commit xem có dòng <code>Signed-off-by:</code> không — <code>git commit -s</code> thêm dòng đó từ <code>user.name</code>/<code>user.email</code> của bạn. Quên rồi? <code>git commit --amend -s</code>, hoặc <code>git rebase --signoff main</code> cho nhiều commit.</span></div>
  <div class="kv"><span class="k">CLA (Contributor License Agreement)</span><span class="v">Thoả thuận cấp phép cho người đóng góp — văn bản pháp lý ký một lần cho mỗi dự án, thường qua một bot bình luận link lên PR đầu tiên của bạn. Đọc thứ mình ký; với dự án có công ty đứng sau thì chuyện này bình thường.</span></div>
</div>
<p>Push nhánh lên fork của bạn rồi mở PR vào repo gốc (giải phẫu PR ở bài 6.1). Ghi <code>Fixes #12</code> trong mô tả để issue tự đóng khi merge, giữ PR ở đúng một thay đổi, và điền đủ mẫu.</p>

<h3>Giữ fork đồng bộ</h3>
<p>Trong lúc bạn chờ review, maintainer đã merge một thứ khác. Nhánh của bạn giờ tụt sau <code>upstream/main</code>, và PR có thể báo xung đột hoặc "This branch is out-of-date". Fetch về, tua thẳng <code>main</code> của bạn, rồi phát lại nhánh lên trên:</p>
<pre><code class="language-bash">git fetch upstream
git log --oneline --graph --all</code></pre>
<div class="out">From ../oss-upstream
 * [new branch]      main       -&gt; upstream/main
* e836157 docs: huong dan cai dat
| * a9fee7e fix: hien thi Chu nhat day du (#12)
|/
* 8d37457 init</div>
<pre><code class="language-bash">git switch main
git merge --ff-only upstream/main
git push origin main</code></pre>
<div class="out">Updating 8d37457..e836157
Fast-forward
 README.md | 3 +++
 1 file changed, 3 insertions(+)
To ../oss-fork.git
   8d37457..e836157  main -&gt; main</div>
<pre><code class="language-bash">git switch fix/12-chu-nhat-day-du
git rebase main
git push --force-with-lease origin fix/12-chu-nhat-day-du</code></pre>
<div class="out">Successfully rebased and updated refs/heads/fix/12-chu-nhat-day-du.
To ../oss-fork.git
 + a9fee7e...2cb8aac fix/12-chu-nhat-day-du -&gt; fix/12-chu-nhat-day-du (forced update)</div>
<p>Commit nhận mã băm mới (<code>a9fee7e</code> → <code>2cb8aac</code>) vì cha của nó đã đổi — đúng luật của Chương 8: rebase viết lại commit. Force-push ở đây ổn vì nhánh chỉ của riêng bạn; <code>--force-with-lease</code> từ chối nếu nhánh trên remote đã đổi theo cách bạn chưa thấy (maintainer có thể push lên nhánh PR của bạn). <code>--ff-only</code> trên <code>main</code> bảo đảm bạn không bao giờ tạo merge commit trên bản sao nhánh của họ trong fork.</p>
<p>Đường tắt, theo phần trợ giúp của <code>gh</code> và GitHub Docs: <code>gh repo sync</code> chạy trong bản clone sẽ cập nhật nhánh cục bộ từ repo cha; <code>gh repo sync &lt;bạn&gt;/&lt;fork&gt;</code> cập nhật fork trên GitHub; nút <strong>Sync fork</strong> trên trang fork làm việc tương tự từ web. Cả ba chỉ tua thẳng (fast-forward) — không được thì quay về các lệnh ở trên.</p>

<h3>Review: phần quyết định có merge hay không</h3>
<ul>
<li><strong>Bình luận nào cũng được trả lời</strong> — bằng một bản sửa, hoặc một lý do ngắn vì sao không sửa. Trả lời "Done in 3f2c1a0" để người review kiểm nhanh.</li>
<li><strong>Đừng cãi về phong cách.</strong> Quy ước của dự án thắng kể cả khi bạn không đồng ý; bạn là khách.</li>
<li><strong>Push commit mới trong lúc review</strong> thay vì viết lại tất cả, trừ khi dự án yêu cầu squash. Nhiều dự án tự squash lúc merge (bài 6.3).</li>
<li><strong>Im lặng là bình thường.</strong> Maintainer thường là người tình nguyện. Sau một hai tuần không ai trả lời, nhắc lịch sự một lần — "Is there anything else you need from me?" — là ổn. Sau đó thì bước tiếp, chọn issue khác; công sức vẫn hiện trên profile của bạn.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Tập dượt trọn luồng trên máy trước khi thử với dự án thật. Cạnh thư mục <code>thu-git</code>, tạo một "dự án" trần và một "fork" trần: <code>git clone --bare thu-git oss-upstream.git</code>, rồi <code>git clone --bare oss-upstream.git oss-fork.git</code>, rồi <code>git clone oss-fork.git my-fork</code>.</li><li>Trong <code>my-fork</code>: <code>git remote add upstream ../oss-upstream.git</code>, tạo nhánh <code>fix/1-readme</code>, sửa một dòng, và commit với <code>-s</code>. Push nhánh bằng <code>git push -u origin fix/1-readme</code>.</li><li>Đóng vai maintainer: clone <code>oss-upstream.git</code> ra một thư mục khác, commit một thứ vào <code>main</code> rồi push.</li><li>Quay lại <code>my-fork</code>: <code>git fetch upstream</code>, tua thẳng <code>main</code> bằng <code>--ff-only</code>, push nó lên <code>origin</code>, rebase nhánh của bạn lên <code>main</code>, và <code>git push --force-with-lease</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>git log --oneline --graph --all</code> trong <code>my-fork</code> cho thấy commit của bạn nằm ngay trên commit của maintainer, <code>git log -1 --format=%b</code> in ra một dòng <code>Signed-off-by:</code>, và <code>git status -sb</code> cho thấy nhánh ngang bằng <code>origin</code> (không ahead/behind). Sau đó tìm một <code>good first issue</code> thật và đăng bình luận "mình nhận việc này được không?".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Good first issue</span><span class="v">Việc cho người mới — nhãn maintainer gắn cho issue hợp với người lần đầu đóng góp; <code>help wanted</code> đánh dấu việc họ mong được giúp.</span></div>
  <div class="kv"><span class="k">CONTRIBUTING.md</span><span class="v">Hướng dẫn đóng góp của dự án: cài đặt, test, quy ước nhánh và commit, cách PR được review.</span></div>
  <div class="kv"><span class="k">Code of Conduct</span><span class="v">Quy tắc ứng xử — luật về cách người tham gia đối xử với nhau, và cách báo khi có vấn đề.</span></div>
  <div class="kv"><span class="k">Upstream</span><span class="v">Kho gốc — repo ban đầu mà fork của bạn tách ra; bạn fetch từ nó và mở PR vào nó.</span></div>
  <div class="kv"><span class="k">DCO / sign-off</span><span class="v">Chứng nhận nguồn gốc — dòng <code>Signed-off-by:</code> trong mỗi commit (<code>git commit -s</code>) khẳng định bạn được phép gửi thay đổi.</span></div>
  <div class="kv"><span class="k">CLA</span><span class="v">Thoả thuận cấp phép cho người đóng góp — ký một lần, thường qua bot trên PR đầu tiên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Chọn một dự án còn sống mà bạn đang dùng, và một <code>good first issue</code> chưa ai nhận, làm xong trong vài chục dòng.</li><li>Đọc CONTRIBUTING và Code of Conduct, rồi hỏi trên issue trước khi viết code.</li><li><code>origin</code> là fork của bạn, <code>upstream</code> là của họ; làm trên nhánh và ký sign-off nếu dự án dùng DCO.</li><li>Đồng bộ bằng <code>git fetch upstream</code>, <code>merge --ff-only</code> trên <code>main</code>, rebase nhánh, <code>push --force-with-lease</code> — hoặc <code>gh repo sync</code> / nút Sync fork.</li><li>Trả lời mọi bình luận review, theo phong cách của họ, và nhắc lịch sự một lần nếu PR bị im.</li></ul>

<a class="link-card" href="https://opensource.guide/how-to-contribute/" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Open Source Guides — Cách đóng góp cho mã nguồn mở</span><span class="lc-sub">Tìm dự án, đọc không khí cộng đồng, và làm gì khi PR không được nhận.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Đồng bộ một fork</span><span class="lc-sub">Nút trên web, <code>gh repo sync</code>, và cách dùng dòng lệnh.</span></span>
</a>
<a class="link-card" href="https://developercertificate.org/" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">Developer Certificate of Origin</span><span class="lc-sub">Toàn văn điều mà một dòng Signed-off-by chứng nhận.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Lần đóng góp đầu hỏng thế nào.</strong> <b>Làm trên <code>main</code> của fork.</b> PR thứ hai sẽ kéo theo commit của PR thứ nhất, và đồng bộ biến thành một đống merge commit — luôn tạo nhánh. <b>Một PR 2.000 dòng "refactor toàn bộ" không ai nhờ</b>: nó sẽ không được review, dù hay đến đâu. <b>Hai mươi PR sửa một chữ chính tả</b> để tô xanh biểu đồ đóng góp — maintainer nhận ra, và nhà tuyển dụng bấm vào xem cũng vậy. <b>Dán nguyên câu trả lời của AI vào issue</b> mà chưa tự tái hiện lỗi. <b><code>git push --force</code> không có <code>-with-lease</code></b> sau khi maintainer đã push một bản sửa lên nhánh của bạn — bạn vừa xoá commit của họ.</div>
</div>
`,
    },
    /* ─────────────────────────── 15.5 Quiz ─────────────────────────── */
    {
      title: '15.5 — Chapter 15 quiz|||15.5 — Kiểm tra Chương 15',
      slug: 'git-15-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật khi dựng hồ sơ GitHub xin thực tập: profile README không hiện, trang portfolio trắng, link CV 404, Actions xanh mà site cũ, repo không license, hạn mức Codespaces, Copilot Student chưa kích hoạt, hồ sơ sinh viên bị từ chối, push sau rebase, và issue đã có người nhận.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from turning a GitHub account into an internship application — each one is decided by how GitHub, Vite and Git actually behave, not by definitions. Read the explanation after submitting, especially for the ones you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can make a profile README appear, pin six repositories, and write a project README with a demo, run-locally steps and "My part".</li>
<li>I can explain what having no license means for someone who wants to reuse my code.</li>
<li>I can deploy a Vite app to GitHub Pages with Actions, and say why a missing <code>base</code> gives a white page.</li>
<li>I know what the Student Pack gives me, how to get verified, and how Codespaces counts core hours (as of 09/2026).</li>
<li>I can fork a project, add <code>upstream</code>, sign off a commit, and sync my branch before pushing it again.</li>
</ul>
${slide('git-15', 17, 'Bảng tra nhanh Chương 15')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống khi biến tài khoản GitHub thành một bộ hồ sơ xin thực tập — câu nào cũng được quyết định bởi cách GitHub, Vite và Git thật sự hoạt động, không phải bởi định nghĩa. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi làm được profile README hiện lên, ghim sáu repo, và viết README dự án có demo, cách chạy thử và "Phần mình làm".</li>
<li>Tôi giải thích được "không có giấy phép" nghĩa là gì với người muốn dùng lại mã của tôi.</li>
<li>Tôi deploy được app Vite lên GitHub Pages bằng Actions, và nói được vì sao thiếu <code>base</code> thì ra trang trắng.</li>
<li>Tôi biết Student Pack cho mình những gì, cách được xác minh, và Codespaces tính giờ lõi ra sao (tính đến 09/2026).</li>
<li>Tôi fork được một dự án, thêm <code>upstream</code>, ký sign-off cho commit, và đồng bộ nhánh trước khi push lại.</li>
</ul>
${slide('git-15', 17, 'Bảng tra nhanh Chương 15')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You created the repository cuonghoang1103/cuonghoang1103 as private "until it looks good", with a README.md at the root full of text. Your profile page still shows no README. Why?|||Bạn tạo repo cuonghoang1103/cuonghoang1103 ở chế độ private "cho tới khi nó đẹp", có README.md ở gốc đầy chữ. Trang profile vẫn không hiện README nào. Vì sao?',
            options: [
              'The README must be inside a .github folder to be picked up|||README phải nằm trong thư mục .github thì mới được nhận',
              'Profile READMEs only appear after the first 10 commits to the repository|||Profile README chỉ hiện sau 10 commit đầu tiên của repo',
              'The repository must be public; GitHub does not show a private repository’s README on the profile|||Repo phải là public; GitHub không hiện README của repo private lên profile',
              'Profile READMEs need GitHub Pro, which comes with the Student Pack|||Profile README cần GitHub Pro, thứ đi kèm Student Pack',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: GitHub shows a profile README only when the repository is named exactly like the account, is public, has README.md at its root, and the file is not empty. Here the only failing condition is visibility. The .github folder is tempting because organisation profiles use a .github repository, but a personal profile README lives at the root of the same-name repository. There is no commit count and no paid plan involved.|||VI: GitHub chỉ hiện profile README khi repo trùng đúng tên tài khoản, là public, có README.md ở gốc, và file không trống. Ở đây điều kiện duy nhất trượt là chế độ hiển thị. Thư mục .github là phương án hấp dẫn vì profile của organization dùng một repo tên .github, nhưng profile README cá nhân nằm ở gốc repo trùng tên. Không có chuyện đếm commit hay cần gói trả phí.',
          },
          {
            question: 'Your Vite portfolio deploys to https://cuonghoang1103.github.io/portfolio/. The page is completely white and DevTools shows 404 for https://cuonghoang1103.github.io/assets/index-D4lLP2T1.js. What fixes it?|||Portfolio Vite của bạn deploy lên https://cuonghoang1103.github.io/portfolio/. Trang trắng trơn và DevTools báo 404 cho https://cuonghoang1103.github.io/assets/index-D4lLP2T1.js. Sửa thế nào?',
            options: [
              "Set base: '/portfolio/' in vite.config.js and let the workflow rebuild|||Đặt base: '/portfolio/' trong vite.config.js rồi để workflow build lại",
              'Commit the dist/ folder so GitHub Pages can find the assets|||Commit thư mục dist/ để GitHub Pages tìm thấy file',
              'Rename the repository to cuonghoang1103.github.io so the root path works|||Đổi tên repo thành cuonghoang1103.github.io để đường dẫn gốc chạy được',
              'Enable Enforce HTTPS so the browser stops blocking the script|||Bật Enforce HTTPS để trình duyệt thôi chặn file script',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: A project site lives under /portfolio/, but Vite builds with base "/" by default, so index.html asks for /assets/… outside the site — HTML 200, JavaScript 404, white page. Setting base to the repository path fixes every generated URL. Renaming the repository to <user>.github.io would also serve from the root, but it turns the portfolio into your one user site — a bigger change than the bug. Committing dist/ does not change the paths inside it, and HTTPS is unrelated to a 404.|||VI: Project site nằm dưới /portfolio/, nhưng mặc định Vite build với base "/", nên index.html đòi /assets/… nằm ngoài site — HTML 200, JavaScript 404, trang trắng. Đặt base đúng đường dẫn repo là sửa mọi URL được sinh ra. Đổi tên repo thành <user>.github.io cũng phục vụ từ gốc, nhưng nó biến portfolio thành user site duy nhất của bạn — thay đổi lớn hơn cả con bug. Commit dist/ không đổi được đường dẫn bên trong nó, còn HTTPS chẳng liên quan tới một lỗi 404.',
          },
          {
            question: 'GitHub Education approved you yesterday. Today the Copilot settings page only offers a paid Copilot Pro checkout. What should you do?|||Hôm qua GitHub Education đã duyệt bạn. Hôm nay trang cài đặt Copilot chỉ hiện trang thanh toán Copilot Pro trả phí. Bạn nên làm gì?',
            options: [
              'Buy one month of Copilot Pro; GitHub refunds it automatically once the student plan applies|||Mua một tháng Copilot Pro; GitHub tự hoàn tiền khi gói sinh viên được áp dụng',
              'Reapply to GitHub Education, because the approval clearly did not include Copilot|||Nộp lại GitHub Education, vì rõ ràng lần duyệt không kèm Copilot',
              'Create a second account with your school email and apply again from it|||Tạo tài khoản thứ hai bằng email trường rồi nộp lại từ đó',
              'Do not pay; activation is a separate step that can take several days — retry from the education benefits page or Copilot settings|||Đừng trả tiền; kích hoạt là bước riêng có thể mất vài ngày — thử lại từ trang education benefits hoặc cài đặt Copilot',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: GitHub’s docs say approval and Copilot activation are separate, the student benefit can take several days to apply, and if only paid options appear you should not complete a purchase — wait and retry via github.com/settings/education/benefits or your Copilot settings. Nothing in the docs promises an automatic refund, reapplying restarts a process that already succeeded, and a second personal account is against GitHub’s Terms.|||VI: Tài liệu GitHub nói được duyệt và kích hoạt Copilot là hai bước riêng, quyền lợi sinh viên có thể mất vài ngày mới áp dụng, và nếu chỉ thấy lựa chọn trả phí thì đừng mua — đợi rồi thử lại qua github.com/settings/education/benefits hoặc cài đặt Copilot. Tài liệu không hứa tự hoàn tiền, nộp lại là chạy lại một quy trình đã thành công, còn tài khoản cá nhân thứ hai là trái Điều khoản của GitHub.',
          },
          {
            question: 'You added deploy.yml and every Actions run is green, but the live portfolio is still blank and the browser requests /portfolio/src/main.jsx. What is most likely wrong?|||Bạn đã thêm deploy.yml và lượt Actions nào cũng xanh, nhưng portfolio trên mạng vẫn trắng và trình duyệt đòi file /portfolio/src/main.jsx. Khả năng cao nhất là gì?',
            options: [
              'The deploy-pages action needs a CNAME file before it publishes anything|||Action deploy-pages cần file CNAME thì mới xuất bản',
              'Settings → Pages → Source is still "Deploy from a branch", so Pages serves the unbuilt source files|||Settings → Pages → Source vẫn là "Deploy from a branch", nên Pages phục vụ file nguồn chưa build',
              'The workflow is missing permissions: contents: write|||Workflow thiếu permissions: contents: write',
              'Pages caches sites for 24 hours after every deployment|||Pages lưu đệm site 24 giờ sau mỗi lần deploy',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: A request for src/main.jsx means the browser got the source index.html, which only exists before a build — Pages is publishing the branch, not your artifact. Switch Source to GitHub Actions. With a custom Actions workflow no CNAME file is needed at all, deploy-pages needs pages: write and id-token: write rather than contents: write, and there is no documented 24-hour cache that would serve the source tree.|||VI: Trình duyệt đòi src/main.jsx nghĩa là nó nhận được index.html nguồn, thứ chỉ tồn tại trước khi build — Pages đang xuất bản nhánh, không phải gói kết quả của bạn. Đổi Source sang GitHub Actions. Với workflow Actions riêng thì hoàn toàn không cần file CNAME, deploy-pages cần pages: write và id-token: write chứ không phải contents: write, và không có bộ đệm 24 giờ nào được ghi trong tài liệu để phục vụ cây mã nguồn.',
          },
          {
            question: 'base is set to /portfolio/ and the page renders, but the "Download CV" link, written in App.jsx as <a href="/cv.pdf">, returns 404. The file is public/cv.pdf. What is the right fix?|||base đã đặt /portfolio/ và trang hiện ra, nhưng link "Tải CV" viết trong App.jsx là <a href="/cv.pdf"> trả 404. File nằm ở public/cv.pdf. Sửa đúng là gì?',
            options: [
              'Move cv.pdf into src/ so Vite bundles it into assets/|||Chuyển cv.pdf vào src/ để Vite gói nó vào assets/',
              "Hard-code href=\"https://cuonghoang1103.github.io/portfolio/cv.pdf\"|||Viết cứng href=\"https://cuonghoang1103.github.io/portfolio/cv.pdf\"",
              "Use href={import.meta.env.BASE_URL + 'cv.pdf'} so the base is added at build time|||Dùng href={import.meta.env.BASE_URL + 'cv.pdf'} để base được gắn vào lúc build",
              'Add a 404.html that redirects /cv.pdf to the right place|||Thêm 404.html chuyển hướng /cv.pdf về đúng chỗ',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Vite rewrites paths it processes (index.html, imports, CSS) but not a string typed in JSX. import.meta.env.BASE_URL is replaced with the base at build time — in the lab the bundle contained /portfolio/cv.pdf — and it stays right if you later move to a custom domain with base "/". The hard-coded full URL works today and breaks the day you add a domain. Moving the file into src/ does nothing unless you import it, and a 404.html redirect hides the bug instead of fixing it.|||VI: Vite viết lại những đường dẫn nó xử lý (index.html, import, CSS) nhưng không đụng tới chuỗi gõ tay trong JSX. import.meta.env.BASE_URL được thay bằng base lúc build — trong kho thử gói JS chứa đúng /portfolio/cv.pdf — và vẫn đúng khi sau này bạn chuyển sang tên miền riêng với base "/". URL đầy đủ viết cứng chạy được hôm nay và hỏng đúng ngày bạn thêm tên miền. Chuyển file vào src/ chẳng làm gì nếu bạn không import nó, còn chuyển hướng bằng 404.html là giấu lỗi chứ không sửa.',
          },
          {
            question: 'A classmate wants to copy the components from your public portfolio repository into their own project. The repository has no LICENSE file. What is the situation?|||Một bạn cùng lớp muốn chép các component trong repo portfolio public của bạn vào dự án của họ. Repo không có file LICENSE. Tình hình là gì?',
            options: [
              'Without a license, default copyright applies: they may view and fork it on GitHub, but not reuse the code — add e.g. MIT if you want to allow it|||Không có giấy phép thì luật bản quyền mặc định áp dụng: họ được xem và fork trên GitHub, nhưng không được dùng lại mã — thêm ví dụ MIT nếu bạn muốn cho phép',
              'Public repositories are automatically MIT-licensed by GitHub’s Terms of Service|||Repo public tự động mang giấy phép MIT theo Điều khoản dịch vụ của GitHub',
              'Anything public on the internet is public domain, so they can copy freely|||Mọi thứ công khai trên internet đều thuộc phạm vi công cộng, nên họ được chép tự do',
              'They may reuse it as long as they keep your name in a comment|||Họ được dùng lại miễn là giữ tên bạn trong một dòng chú thích',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: GitHub’s documentation: without a license, default copyright laws apply — you retain all rights and nobody may reproduce, distribute or create derivative works. GitHub’s Terms only let others view and fork a public repository on GitHub. "Keep my name in a comment" is roughly what MIT asks for — which is exactly why it only applies once you add the MIT license. Public is not public domain.|||VI: Tài liệu GitHub: không có giấy phép thì luật bản quyền mặc định áp dụng — bạn giữ mọi quyền và không ai được sao chép, phân phối hay tạo sản phẩm phái sinh. Điều khoản của GitHub chỉ cho người khác xem và fork repo public trên GitHub. "Giữ tên tôi trong chú thích" gần đúng là điều MIT yêu cầu — chính vì thế nó chỉ có hiệu lực khi bạn thêm giấy phép MIT. Công khai không có nghĩa là phạm vi công cộng.',
          },
          {
            question: 'On GitHub Free, with none of this month’s Codespaces quota used, you open a codespace on a 4-core machine and leave it running. Roughly how many hours until the free compute quota is gone (as of 09/2026)?|||Với GitHub Free, chưa dùng chút hạn mức Codespaces nào trong tháng, bạn mở một codespace máy 4 lõi rồi để nó chạy. Khoảng bao nhiêu giờ thì hết hạn mức tính toán miễn phí (tính đến 09/2026)?',
            options: [
              'About 120 hours — the quota is 120 hours whatever the machine|||Khoảng 120 giờ — hạn mức là 120 giờ bất kể máy nào',
              'About 60 hours — the same as on a 2-core machine|||Khoảng 60 giờ — y như trên máy 2 lõi',
              'About 240 hours — bigger machines are billed at a discount|||Khoảng 240 giờ — máy lớn được tính giá ưu đãi',
              'About 30 hours — 120 core hours at a multiplier of 4|||Khoảng 30 giờ — 120 giờ lõi với hệ số 4',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Codespaces compute is counted in core hours: active time × the machine multiplier (2 for 2 cores, 4 for 4 cores). GitHub Free includes 120 core hours per month, so a 4-core machine uses it in about 30 hours, and a 2-core machine in about 60 — which is where the tempting "60" comes from. It is not 120 wall-clock hours on any machine, and larger machines cost proportionally more, not less. The idle timeout (30 minutes by default) is what saves you if you forget.|||VI: Phần tính toán của Codespaces tính bằng giờ lõi: thời gian chạy × hệ số của máy (2 với máy 2 lõi, 4 với máy 4 lõi). GitHub Free có 120 giờ lõi mỗi tháng, nên máy 4 lõi dùng hết trong khoảng 30 giờ, máy 2 lõi trong khoảng 60 — đó là nguồn gốc con số "60" hấp dẫn. Không phải 120 giờ đồng hồ trên máy nào cũng như nhau, và máy lớn tốn tương ứng nhiều hơn chứ không ít hơn. Thời gian chờ tự dừng (mặc định 30 phút) là thứ cứu bạn nếu quên.',
          },
          {
            question: 'Your GitHub Education application was rejected. You had uploaded a phone photo of your student card (the date is not readable) and applied with only your Gmail address on the account. What is the best next step?|||Hồ sơ GitHub Education của bạn bị từ chối. Bạn đã tải lên ảnh chụp thẻ sinh viên bằng điện thoại (không đọc được ngày) và nộp khi tài khoản chỉ có địa chỉ Gmail. Bước tiếp theo tốt nhất là gì?',
            options: [
              'Wait a year; rejected accounts cannot reapply until the next academic year|||Đợi một năm; tài khoản bị từ chối không được nộp lại tới năm học sau',
              'Apply with a teacher application instead, which has no document check|||Nộp theo diện giáo viên, loại không kiểm giấy tờ',
              'Add and verify your …@fpt.edu.vn email, then reapply with a clear document that shows a current date|||Thêm và xác minh email …@fpt.edu.vn, rồi nộp lại với giấy tờ rõ ràng có ngày còn hạn',
              'Upload the same photo again at a higher resolution from a different account|||Tải lại đúng ảnh đó ở độ phân giải cao hơn từ một tài khoản khác',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: The docs list unclear documents without a visible date as a common rejection reason, and require an academic email when recent applicants from your school verified with one. Fix both and reapply from the same account. There is no one-year ban in the docs; applying as a teacher when you are a student is misrepresentation; and a second account is against the Terms — an academic email also works for only one Pack.|||VI: Tài liệu liệt kê giấy tờ không rõ, không thấy ngày là lý do bị từ chối hay gặp, và bắt dùng email trường khi những người nộp gần đây từ trường bạn đã xác minh bằng email trường. Sửa cả hai rồi nộp lại từ chính tài khoản đó. Tài liệu không có lệnh cấm một năm nào; nộp diện giáo viên khi bạn là sinh viên là khai sai; còn tài khoản thứ hai là trái Điều khoản — mỗi email trường cũng chỉ dùng được cho một Pack.',
          },
          {
            question: 'Your PR branch fix/12-chu-nhat-day-du was already pushed to your fork. You fetched upstream and ran git rebase main. Now git push origin fix/12-chu-nhat-day-du is rejected as non-fast-forward. What do you do?|||Nhánh PR fix/12-chu-nhat-day-du đã được push lên fork. Bạn fetch upstream rồi chạy git rebase main. Giờ git push origin fix/12-chu-nhat-day-du bị từ chối vì không tua thẳng được. Bạn làm gì?',
            options: [
              'git pull origin fix/12-chu-nhat-day-du to merge the old commits back in, then push|||git pull origin fix/12-chu-nhat-day-du để merge các commit cũ vào lại, rồi push',
              'git push --force-with-lease origin fix/12-chu-nhat-day-du — the rebase rewrote your own branch, and the lease protects anything pushed by someone else|||git push --force-with-lease origin fix/12-chu-nhat-day-du — rebase đã viết lại nhánh của riêng bạn, và lease bảo vệ thứ người khác đã push',
              'Delete the fork and fork the project again|||Xoá fork và fork lại dự án',
              'Close the PR and open a new one from a new branch name|||Đóng PR và mở PR mới từ một tên nhánh mới',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Rebasing gives your commits new hashes (a9fee7e became 2cb8aac in the lab), so the remote branch is no longer an ancestor and a normal push is refused. On a branch only you work on, --force-with-lease is the right tool: it replaces the branch, but refuses if the remote moved in a way you have not fetched — for example a maintainer pushing a fix to your PR. Pulling is the tempting answer and it merges the pre-rebase copies back in, doubling every commit. Deleting the fork or opening a new PR loses the review history.|||VI: Rebase cho commit của bạn mã băm mới (trong kho thử a9fee7e thành 2cb8aac), nên nhánh trên remote không còn là tổ tiên và push thường bị từ chối. Trên nhánh chỉ mình bạn làm, --force-with-lease là công cụ đúng: nó thay nhánh, nhưng từ chối nếu remote đã đổi theo cách bạn chưa fetch — ví dụ maintainer push một bản sửa lên PR của bạn. Pull là phương án hấp dẫn và nó merge các bản sao trước-rebase vào lại, nhân đôi mọi commit. Xoá fork hay mở PR mới làm mất lịch sử review.',
          },
          {
            question: 'You found a good first issue you want. Three days ago someone commented "I’d like to take this", but there is no linked PR and no reply from a maintainer. What is the best move?|||Bạn tìm được một good first issue muốn làm. Ba ngày trước có người bình luận "I’d like to take this", nhưng chưa có PR nào gắn vào và maintainer chưa trả lời. Nước đi tốt nhất là gì?',
            options: [
              'Leave a short comment asking whether they are still working on it (or pick another issue) — do not start a competing PR|||Để một bình luận ngắn hỏi họ còn làm không (hoặc chọn issue khác) — đừng bắt đầu một PR tranh việc',
              'Open your PR quickly — the first working PR usually wins|||Mở PR thật nhanh — PR chạy được đầu tiên thường thắng',
              'Fork the project and fix it in your fork only, without telling anyone|||Fork dự án và sửa trong fork của mình thôi, không báo ai',
              'Email the maintainer privately asking them to assign it to you instead|||Email riêng cho maintainer xin giao việc cho bạn thay',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Three days is not abandoned. Asking on the issue is visible to the other contributor and the maintainers, and it is the same etiquette you want applied to your own claims; otherwise there are other good first issues. A racing PR is the tempting answer and it is how newcomers annoy maintainers — two people doing the same work, one of them wasted. A fix kept in your fork helps nobody, and a private email bypasses the public process the project uses.|||VI: Ba ngày chưa phải là bỏ dở. Hỏi ngay trên issue thì người đóng góp kia và các maintainer đều thấy, và đó là cùng phép lịch sự bạn muốn người khác dành cho việc mình đã nhận; nếu không thì còn nhiều good first issue khác. PR chạy đua là phương án hấp dẫn và chính là cách người mới làm maintainer khó chịu — hai người làm cùng một việc, một người phí công. Bản sửa để trong fork không giúp ai, còn email riêng là đi vòng qua quy trình công khai của dự án.',
          },
        ],
      },
    },
  ],
};
