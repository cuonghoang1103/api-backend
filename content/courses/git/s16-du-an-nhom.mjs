/**
 * Git & GitHub — Chương 16 (MỚI 09/2026, chương CUỐI): Dự án nhóm cuối khoá.
 * Bối cảnh xuyên suốt: nhóm 5 SWP391 (Cường trưởng nhóm, Linh, Huy, Trang), đồ án "Đặt lịch phòng khám", 3 tuần.
 * 16.1 Ngày 0 (Organization, file khuôn, CODEOWNERS, CI, ruleset) · 16.2 một sprint chạy thật (4 bản clone của
 * một kho bare, xung đột thật, squash merge giả lập) · 16.3 tag v1.0.0, CHANGELOG, hotfix v1.0.1 từ tag,
 * cherry-pick về main · 16.4 tám sự cố tái hiện ở máy · 16.5 bài thi cuối khoá 20 câu.
 * LUẬT: backtick → &#96;; ${ → &#36;{ (trong mã mẫu); < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG <svg>.
 * Output lệnh: chạy thật bằng git 2.51.1 / node 22.21 / npm 10.9.4 trong scratchpad/ch16-lab (sprint.sh, su-co.sh),
 * HOME tạm, TZ=Asia/Ho_Chi_Minh, ngày giờ cố định ⇒ mã băm tái lập (trừ package-lock.json phụ thuộc bản npm).
 * Bước "Squash and merge" của GitHub được GIẢ LẬP bằng git merge --squash trong một bản clone riêng
 * (tác giả = người mở PR, committer = GitHub) — không gọi GitHub thật, không bịa output máy chủ.
 * Đường dẫn scratch dài in tắt thành "~" / "~/phong-kham". Tên menu, luật, giới hạn GitHub kiểm trên docs.github.com
 * tính đến 09/2026. File mẫu YAML đã kiểm bằng actionlint 1.7.12 + js-yaml.
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 16 — Capstone: running a team project on GitHub|||Chương 16 — Dự án nhóm cuối khoá: vận hành một dự án nhóm trên GitHub',
  description: 'Chương cuối ghép cả khoá vào một đồ án thật: bốn sinh viên, ba tuần, một repo trên GitHub. Dựng repo Ngày 0 với luật chạy tự động, chạy trọn một sprint có xung đột thật, chốt bản nộp và vá lỗi sau khi nộp, cứu tám sự cố kinh điển — rồi làm bài thi cuối khoá.',
  lessons: [
    /* ─────────────────────────── 16.0 ─────────────────────────── */
    {
      title: '16.0 — Chapter 16 slides: a team project from day 0 to hotfix|||16.0 — Slide Chương 16: một dự án nhóm từ Ngày 0 tới hotfix',
      slug: 'git-16-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 18 slide của Chương 16: trục thời gian ba tuần, bộ khung repo Ngày 0, gói GitHub quyết định luật nào bật được, ruleset cho main, file khuôn, CI, vòng đời một PR, đồ thị bốn làn của bốn thành viên, xung đột thật, bảng Projects, hotfix từ tag, bảng tám sự cố và lộ trình sau khoá học.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Slides</span>
<h2>The whole capstone in 18 slides</h2>
<p class="lead">This last chapter puts the entire course to work on one realistic student project: four people, three weeks, a clinic appointment-booking app, one repository on GitHub. Nothing new is invented here — every step is a command or a setting you already met, now used in the order a real team needs them.</p>
<p>The timeline, the four-lane graph, the conflict, the squash-merged history, the tags and the hotfix are all real output from Git 2.51: the "team" is four clones of one local bare repository, each with its own <code>user.name</code>, with fixed dates so the hashes are reproducible. The GitHub-side steps — creating the organization, the ruleset, CODEOWNERS, the Projects board — are drawn from docs.github.com as of 09/2026, never from invented server output. The last slides are the eight-incident table, the chapter cheat sheet, a "what to learn next" map and a practice session.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Slide</span>
<h2>Cả chương cuối trong 18 slide</h2>
<p class="lead">Chương cuối đem toàn bộ khoá học vào một đồ án sinh viên thật: bốn người, ba tuần, ứng dụng đặt lịch phòng khám, một repo trên GitHub. Ở đây không có gì mới được phát minh — mỗi bước là một lệnh hay một thiết lập bạn đã gặp, giờ được dùng đúng thứ tự mà một nhóm thật cần.</p>
<p>Trục thời gian, đồ thị bốn làn, vụ xung đột, lịch sử sau squash merge (gộp-nén), các tag và bản hotfix (vá gấp) đều là output thật của Git 2.51: "cả nhóm" là bốn bản clone của một kho bare (kho trần, không có thư mục làm việc) trên máy, mỗi bản một <code>user.name</code>, ngày giờ cố định để mã băm tái lập được. Phần làm trên GitHub — tạo Organization (tổ chức), ruleset (bộ luật cho nhánh), CODEOWNERS, bảng Projects — được vẽ theo docs.github.com tính đến 09/2026, không bịa output của máy chủ. Mấy slide cuối là bảng tám sự cố, bảng tra nhanh, bản đồ "học gì tiếp" và một buổi thực hành.</p>
</div>
${gallery('git-16', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Ba tuần của nhóm 5 — trục thời gian'], [4, 'Ngày 0: repo có gì'],
  [5, 'Chủ repo quyết định luật nào bật được'], [6, 'Ruleset cho main: năm luật'], [7, 'Ba file khuôn: issue form, PR template, CODEOWNERS'],
  [8, 'CI tối thiểu và bẫy “0 test vẫn xanh”'], [9, 'Vòng đời một việc: issue → PR → squash'], [10, 'Sprint 1: bốn người, bốn làn, một main'],
  [11, 'Xung đột thật trong config.js'], [12, 'Bảng Projects chạy theo issue và PR'], [13, 'v1.0.0 → hotfix v1.0.1 → cherry-pick'],
  [14, 'Tám sự cố kinh điển'], [15, '--force-with-lease và xung đột lockfile'], [16, 'Bảng tra nhanh'],
  [17, 'Sau khoá này: học gì tiếp'], [18, 'Thực hành chương 16'],
])}
`,
    },

    /* ─────────────────────────── 16.1 ─────────────────────────── */
    {
      title: '16.1 — Day 0: setting up a team repository that enforces its own rules|||16.1 — Ngày 0: dựng một repo nhóm tự giữ luật',
      slug: 'git-16-1-khoi-tao-repo-nhom',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ngày 0 của đồ án nhóm: chọn chủ repo (Organization hay tài khoản cá nhân) theo gói GitHub, bộ khung README/CONTRIBUTING/.gitignore/.gitattributes, mẫu issue và PR, CODEOWNERS, CI tối thiểu, ruleset cho main và quy ước nhánh + commit.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.1</span>
<h2>Day 0: a repository that remembers the rules so nobody has to</h2>
<p class="lead">Team 5 of an SWP391 class — Cường (team lead, backend), Huy (backend), Linh (frontend) and Trang (docs and testing) — has three weeks to build "Clinic Booking". On the first evening Cường spends one hour on the repository before anyone writes a feature. That hour decides whether the next three weeks are spent on the app or on untangling each other's pushes.</p>

<h3>How this chapter works</h3>
<p>Every Git command and every line of output in this chapter was run for real. The "team" is four clones of one local bare repository — <code>cuong/</code>, <code>huy/</code>, <code>linh/</code>, <code>trang/</code> — each with its own <code>user.name</code>, all with fixed dates so the hashes you see are reproducible. A fifth clone plays GitHub: when a pull request is merged, it runs <code>git merge --squash</code> and commits with the pull request author as author and "GitHub" as committer, which is what the <strong>Squash and merge</strong> button produces. Everything that only exists on github.com — organizations, rulesets, the Projects board — is described from docs.github.com as of 09/2026, without invented server output.</p>

<h3>Step 1 — who owns the repository decides which rules exist</h3>
${slide('git-16', 5, 'Chủ repo quyết định luật nào bật được')}
<p>Branch protection, rulesets and CODEOWNERS are the features that make a team repository enforce itself. They are not available everywhere. docs.github.com (09/2026) states it plainly: rulesets "are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, and GitHub Enterprise Cloud". Code owners follow the same pattern. That gives a student team three realistic options:</p>
<table>
<thead><tr><th>Owner</th><th>Rules available</th><th>When it fits</th></tr></thead>
<tbody>
<tr><td>Organization on GitHub Free, <strong>public</strong> repository</td><td>rulesets, branch protection, CODEOWNERS</td><td>the lecturer allows public code — the cleanest option</td></tr>
<tr><td>Organization on GitHub Free, <strong>private</strong> repository</td><td>none of them</td><td>you rely on discipline alone: pull requests still work, nothing is enforced</td></tr>
<tr><td>Team lead's personal account with <strong>GitHub Pro</strong>, private repository</td><td>all of them</td><td>the lead has the Student Developer Pack, which includes GitHub Pro while you are a student (education.github.com); teammates are added as collaborators</td></tr>
</tbody>
</table>
<p>An organization is worth it when you can use it: the project outlives any one member's account, the repository URL does not carry a student's name, and roles are explicit. Creating one takes a minute: profile picture → <strong>Settings</strong> → (Access) <strong>Organizations</strong> → <strong>New organization</strong>, then follow the prompts and pick the free plan. Invite the three teammates as members and give them <strong>Write</strong> on the repository; the lead keeps <strong>Admin</strong>. Nobody else needs Admin — Admin can change the very rules you are about to set.</p>

<h3>Step 2 — the skeleton, before any feature</h3>
${slide('git-16', 4, 'Ngày 0: repo có gì trước dòng code đầu tiên')}
<p>Cường creates the project locally and commits the skeleton in three commits: the project itself, the team conventions, then CI. The files that matter for teamwork:</p>
<pre><code class="language-bash"><span class="tok-comment"># .gitignore — generated or secret things never enter a commit</span>
# phụ thuộc và bản dựng — sinh lại được, không commit
node_modules/
dist/
coverage/
*.log

# bí mật — chỉ commit .env.example
.env
.env.*
!.env.example

# rác của hệ điều hành / trình soạn thảo
.DS_Store
Thumbs.db
.idea/</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># .gitattributes — the Mac/Windows line-ending war ends on day 0 (Chapter 14.4)</span>
# mọi file văn bản lưu LF trong kho, dù ai commit từ Windows
* text=auto eol=lf
# file nhị phân: không so dòng, không đổi đuôi dòng
*.png binary
*.jpg binary
*.pdf binary
*.docx binary</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># .env.example — committed; the real .env is not</span>
# chép thành .env rồi điền giá trị thật — .env KHÔNG BAO GIỜ được commit
PORT=3000
DATABASE_URL=postgresql://user:matkhau@localhost:5432/phongkham</code></pre>
<p>Before pushing, check that the ignore rules really bite. Cường creates a fake <code>.env</code> and a <code>node_modules/</code> folder and asks Git:</p>
<pre><code class="language-bash">git status --short --ignored
git check-ignore -v .env node_modules/x/i.js .env.example</code></pre>
<div class="out">!! .env
!! node_modules/
.gitignore:8:.env	.env
.gitignore:2:node_modules/	node_modules/x/i.js</div>
<p><code>!!</code> means "ignored, as intended". <code>.env.example</code> is not listed by <code>check-ignore</code> at all — the <code>!.env.example</code> line un-ignores it, so it can be committed as documentation.</p>

<h3>CONTRIBUTING.md — the rules in one page</h3>
<p>New teammates read the README; people who are about to push read CONTRIBUTING. Keep it short enough to be read, and make every rule checkable:</p>
<pre><code class="language-markdown"># Làm việc chung trong kho phong-kham

## Luồng một việc
1. Mọi việc bắt đầu từ một **issue** (dùng mẫu "Tính năng" hoặc "Báo lỗi"). Tự gán mình vào issue.
2. Tách nhánh từ &#96;main&#96; mới nhất:
   &#96;git switch main &amp;&amp; git pull &amp;&amp; git switch -c feat/12-ten-ngan&#96;
3. Commit nhỏ, lời nhắn theo Conventional Commits: &#96;feat(lich): ...&#96;, &#96;fix(api): ...&#96;, &#96;docs: ...&#96;.
4. &#96;npm test&#96; xanh ở máy mình rồi mới push: &#96;git push -u origin feat/12-ten-ngan&#96;.
5. Mở **Pull Request** vào &#96;main&#96;, điền đủ mẫu, ghi &#96;Closes #12&#96;. PR nhỏ (dưới ~300 dòng).
6. Cần **1 người duyệt** và **CI xanh**. Người viết PR tự bấm **Squash and merge**, rồi xoá nhánh.

## Tên nhánh
| Tiền tố | Dùng cho | Ví dụ |
|---|---|---|
| &#96;feat/&#96; | tính năng mới | &#96;feat/1-khung-gio&#96; |
| &#96;fix/&#96; | sửa lỗi | &#96;fix/9-trung-lich&#96; |
| &#96;docs/&#96; | tài liệu | &#96;docs/4-huong-dan&#96; |
| &#96;chore/&#96; | cấu hình, CI, dọn dẹp | &#96;chore/ci-node-22&#96; |
| &#96;hotfix/&#96; | sửa gấp bản đã nộp | &#96;hotfix/1.0.1&#96; |

## Luật cứng
- Không push thẳng lên &#96;main&#96; (ruleset sẽ chặn).
- Không &#96;git push --force&#96; lên nhánh của người khác. Nhánh của mình: chỉ &#96;--force-with-lease&#96;.
- Không commit &#96;.env&#96;, khoá API, file &gt; 50 MB, &#96;node_modules/&#96;.
- Xung đột &#96;package-lock.json&#96;: lấy bản của &#96;main&#96;, chạy &#96;npm install&#96;, commit lại — không sửa tay.
- Kẹt quá 30 phút: hỏi trong nhóm, dán nguyên văn &#96;git status&#96;.</code></pre>

<h3>Issue forms and a pull request template</h3>
<p>An issue form turns "làm cái lịch" into a user story with checkable acceptance criteria. Forms are YAML files in <code>.github/ISSUE_TEMPLATE/</code>; the required top-level keys are <code>name</code>, <code>description</code> and <code>body</code> (docs.github.com, "Syntax for issue forms"). Note one detail from the docs: <code>labels</code> are only applied if they already exist — create <code>tinh-nang</code> and <code>loi</code> in the Labels page first.</p>
<pre><code class="language-yaml">name: Tính năng
description: Một việc cần làm cho đồ án — nhỏ, xong trong 1–3 ngày.
title: "[Tính năng]: "
labels: ["tinh-nang"]
body:
  - type: textarea
    id: user-story
    attributes:
      label: User story
      description: Là &lt;ai&gt;, tôi muốn &lt;gì&gt;, để &lt;vì sao&gt;.
      placeholder: Là bệnh nhân, tôi muốn xem các khung giờ còn trống, để chọn giờ khám.
    validations:
      required: true
  - type: textarea
    id: tieu-chi
    attributes:
      label: Tiêu chí hoàn thành
      description: Mỗi dòng một điều KIỂM ĐƯỢC.
      value: |
        - [ ] 
    validations:
      required: true
  - type: dropdown
    id: phan
    attributes:
      label: Phần việc
      options:
        - Backend
        - Frontend
        - Tài liệu
        - CI / cấu hình
    validations:
      required: true
  - type: dropdown
    id: co
    attributes:
      label: Cỡ việc
      options:
        - "S — dưới nửa ngày"
        - "M — 1 đến 2 ngày"
        - "L — 3 ngày trở lên (nên chẻ nhỏ)"
      default: 1</code></pre>
<pre><code class="language-yaml">name: Báo lỗi
description: Có gì chạy sai so với mong đợi.
title: "[Lỗi]: "
labels: ["loi"]
body:
  - type: textarea
    id: cac-buoc
    attributes:
      label: Các bước tái hiện
      placeholder: |
        1. Mở trang đặt lịch
        2. Chọn Chủ nhật 20/09
        3. Bấm Đặt
    validations:
      required: true
  - type: textarea
    id: mong-doi
    attributes:
      label: Mong đợi và thực tế
      description: Đáng lẽ thấy gì, thực tế thấy gì. Dán nguyên văn lỗi nếu có.
    validations:
      required: true
  - type: input
    id: phien-ban
    attributes:
      label: Phiên bản
      description: Chạy git describe --tags rồi dán kết quả.
      placeholder: v1.0.0
    validations:
      required: true</code></pre>
<pre><code class="language-yaml"><span class="tok-comment"># .github/ISSUE_TEMPLATE/config.yml — no empty issues without a template</span>
blank_issues_enabled: false</code></pre>
<p>The pull request template goes in <code>.github/pull_request_template.md</code> (the docs also accept the repository root or <code>docs/</code>). It pre-fills every new pull request body — including the <code>Closes #</code> line that makes GitHub close the issue on merge:</p>
<pre><code class="language-markdown">## Việc gì
&lt;!-- Một hai câu: PR này làm gì, vì sao. --&gt;

Closes #

## Cách kiểm
- [ ] &#96;npm test&#96; xanh ở máy mình
- [ ] Các bước để người duyệt tự thấy thay đổi:
  1.

## Ảnh chụp (nếu đổi giao diện)

## Tự kiểm trước khi xin duyệt
- [ ] Nhánh tách từ &#96;main&#96; mới nhất, tên đúng quy ước
- [ ] Không có &#96;.env&#96;, khoá API, &#96;console.log&#96; gỡ lỗi
- [ ] Đã tự đọc hết tab "Files changed" một lượt</code></pre>
<p>Both files were checked before being committed: <code>actionlint</code> for the workflow below and a YAML parser for every <code>.yml</code> file — a form with a YAML error simply does not appear in the template chooser, with no error shown to anyone.</p>

<h3>CODEOWNERS — reviews that route themselves</h3>
<pre><code class="language-bash"># Dòng khớp SAU CÙNG thắng. Tên tài khoản dưới đây là ví dụ — thay bằng tên thật của nhóm.
*            @cuong-g5
/src/        @huy-g5 @cuong-g5
/public/     @linh-g5
/docs/       @trang-g5
/.github/    @cuong-g5</code></pre>
<p>Three rules from docs.github.com: the file may live in <code>.github/</code>, the root or <code>docs/</code> (searched in that order, first one wins); within the file, "the last matching pattern takes the most precedence", which is why the catch-all <code>*</code> comes first; and every owner must have <strong>write</strong> permission, or the line is ignored. On its own, CODEOWNERS only requests reviews. It becomes a gate when the ruleset turns on "require review from Code Owners" — then a change under <code>/public/</code> cannot merge until Linh (any one of the listed owners) approves.</p>

<h3>A minimal CI — and the trap of the green empty suite</h3>
${slide('git-16', 8, 'CI tối thiểu và bẫy “0 test vẫn xanh”')}
<pre><code class="language-yaml"><span class="tok-comment"># .github/workflows/ci.yml</span>
name: CI

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: ci-&#36;{{ github.ref }}
  cancel-in-progress: true

jobs:
  kiem-tra:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test</code></pre>
<p>Three details carry the weight. <code>permissions: contents: read</code> gives the job the least it needs. <code>concurrency</code> cancels the previous run when someone pushes twice in a minute. And the job id, <code>kiem-tra</code>, is the name you will pick as the required status check. (The actions are pinned to their current major version, <code>v7</code>, as of 09/2026; earlier chapters used <code>v4</code>, which also still exists.)</p>
<p>Now the trap. Before the first test file existed, Cường ran the test command:</p>
<pre><code class="language-bash">npm test 2&gt;&amp;1 | grep -E "^# (tests|pass|fail)"</code></pre>
<div class="out"># tests 0
# pass 0
# fail 0</div>
<p>Zero tests, exit code 0 — CI would be <em>green</em> while checking nothing. A required check that cannot fail protects no one. So one real test goes in before CI is switched on:</p>
<pre><code class="language-javascript">import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GIO_MO, GIO_DONG, SLOT_PHUT } from '../src/config.js';

test('giờ mở cửa trước giờ đóng cửa', () =&gt; {
  assert.ok(GIO_MO &lt; GIO_DONG);
});
test('khung giờ chia hết một giờ', () =&gt; {
  assert.equal(60 % SLOT_PHUT, 0);
});</code></pre>
<div class="out">lint: 1 file, cú pháp ổn
# tests 2
# pass 2
# fail 0</div>
<p>The <code>lint</code> script is a ten-line Node file that runs <code>node --check</code> on every file in <code>src/</code> — deliberately not a shell glob, so it works for the teammate on Windows too.</p>

<h3>Step 3 — push the skeleton, then lock main</h3>
<pre><code class="language-bash">git log --oneline
git remote add origin &lt;repository URL&gt;
git push -u origin main</code></pre>
<div class="out">b10dacc ci: chạy lint + test cho mọi pull request
a97c247 docs: quy ước làm việc nhóm — CONTRIBUTING, mẫu issue/PR, CODEOWNERS
0fd7fe1 chore: khởi tạo dự án phong-kham</div>
${slide('git-16', 6, 'Ruleset cho main: năm luật')}
<p>Only after the skeleton is on GitHub does Cường protect <code>main</code> — otherwise every skeleton file would have to go through a pull request too. Repository → <strong>Settings</strong> → (Code and automation) <strong>Rulesets</strong> → <strong>New ruleset</strong> → <strong>New branch ruleset</strong>; name it, set enforcement to <strong>Active</strong>, target the default branch, and enable (rule names exactly as in "Available rules for rulesets"):</p>
<ul>
<li><strong>Restrict deletions</strong> — nobody deletes <code>main</code> by accident.</li>
<li><strong>Block force pushes</strong> — the shared history cannot be rewritten (Chapter 8.2).</li>
<li><strong>Require a pull request before merging</strong> with 1 required approval, plus "require review from Code Owners". An author cannot approve their own pull request, so every change gets a second pair of eyes.</li>
<li><strong>Require status checks to pass before merging</strong> → add <code>kiem-tra</code>. The docs call the default here "strict": the box <strong>Require branches to be up to date before merging</strong> is ticked. For a team of four, untick it — otherwise each merge forces the other three open pull requests to update and rerun CI. The <code>push: branches: [main]</code> trigger reruns CI after each merge and catches the rare combination that breaks.</li>
<li><strong>Require linear history</strong> (optional) — only squash or rebase merges reach <code>main</code>.</li>
</ul>
<p>Leave the <strong>bypass list</strong> empty. The moment the team lead can skip review "just this once", the rule describes a wish, not the repository.</p>

<div class="pitfall co-tieu-de"><strong>How Day 0 goes wrong in student teams.</strong> <b>Private repository in a free organization, rules "turned on".</b> The settings page lets you design a ruleset, the team believes <code>main</code> is protected, and in week two someone pushes straight to it anyway — on GitHub Free, private organization repositories do not get rulesets. Check with a deliberate test push. <b>Everyone is Admin.</b> "To make things easy" the lead gives all members Admin; now any of them can edit or disable the ruleset at 2 a.m. <b>CI that is green by construction.</b> No tests, or <code>npm test</code> that always exits 0 — the required check passes forever and protects nothing. <b>The <code>.env</code> is committed on day 1</b> because <code>.gitignore</code> was added on day 2; an ignore rule does not remove a file Git already tracks (Chapter 1.5).</div>

<h3>Branch and commit conventions</h3>
<p>The table in CONTRIBUTING is the whole convention: <code>type/issue-number-short-name</code> for branches (<code>feat/1-khung-gio</code>), Conventional Commits for messages (<code>feat(lich): …</code>, Chapter 1.4), one issue per branch, one branch per pull request. Putting the issue number in the branch name costs nothing and means that three weeks later <code>git branch -a</code> still tells you why each branch exists. If you want the commit-message rule enforced rather than asked for, the <code>commit-msg</code> hook from Chapter 12.1 does it on every laptop.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code>, create a folder <code>phong-kham</code> with the files of this lesson: <code>.gitignore</code>, <code>.gitattributes</code>, <code>.env.example</code>, <code>CONTRIBUTING.md</code>, the two issue forms plus <code>config.yml</code>, the pull request template, <code>CODEOWNERS</code> and <code>ci.yml</code> (copy them from the blocks above).</li><li>Create a fake <code>.env</code> and a <code>node_modules/x/i.js</code>. Run <code>git status --short --ignored</code> and <code>git check-ignore -v .env .env.example</code> and explain every line.</li><li>Run <code>npm test</code> with no test file and write down the exit code (<code>echo $?</code>). Add <code>test/config.test.js</code> and run it again.</li><li>Commit the skeleton in three commits (project · conventions · CI) with Conventional Commit messages.</li><li>If you have a free GitHub organization: create a <strong>public</strong> repository, push, add the ruleset from this lesson, then try <code>git push origin main</code> with a new commit.</li></ol>
<p><strong>Done when:</strong> <code>git status --short --ignored</code> shows <code>!! .env</code>, <code>git log --oneline</code> shows exactly three skeleton commits, and (if you did step 5) GitHub rejects the direct push to <code>main</code> with a message that names the rule.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Organization</span><span class="v">A GitHub account owned by a group: repositories, members and roles that do not belong to any one person.</span></div>
  <div class="kv"><span class="k">Ruleset</span><span class="v">A named list of rules for branches or tags (deletions, force pushes, required PRs and checks) enforced by GitHub.</span></div>
  <div class="kv"><span class="k">Bypass list</span><span class="v">People or apps allowed to skip a ruleset — best left empty in a student team.</span></div>
  <div class="kv"><span class="k">Issue form</span><span class="v">A YAML template in <code>.github/ISSUE_TEMPLATE/</code> that turns a new issue into a form with required fields.</span></div>
  <div class="kv"><span class="k">CODEOWNERS</span><span class="v">A file mapping paths to owners who are automatically requested for review; last matching pattern wins.</span></div>
  <div class="kv"><span class="k">Required status check</span><span class="v">A CI job (here <code>kiem-tra</code>) that must pass before a pull request can merge.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Who owns the repository decides which rules exist: rulesets and CODEOWNERS need a public repository on Free, or GitHub Pro/Team for private ones.</li><li>The skeleton — ignore rules, line endings, conventions, templates, CODEOWNERS, CI — goes in before the first feature, in a few clear commits.</li><li>A CI job that cannot fail is worse than none; add a real test before making the check required.</li><li>Protect <code>main</code> only after the skeleton is pushed, keep the bypass list empty, and untick "up to date before merging" for a small team.</li><li>Branch names carry the issue number and commit messages follow Conventional Commits, so the history explains itself.</li></ul>

<a class="link-card" href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets" target="_blank" rel="noopener">
  <span class="lc-ico">🛡</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Available rules for rulesets</span><span class="lc-sub">Restrict deletions, Block force pushes, required pull requests and status checks, strict vs loose.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Syntax for issue forms</span><span class="lc-sub">Required keys, body element types, labels that must already exist.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners" target="_blank" rel="noopener">
  <span class="lc-ico">👥</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — About code owners</span><span class="lc-sub">File locations, last match wins, owners need write access.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/creating-a-new-organization-from-scratch" target="_blank" rel="noopener">
  <span class="lc-ico">🏢</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Creating a new organization from scratch</span><span class="lc-sub">Settings → Organizations → New organization.</span></span>
</a>
<p class="note-ct"><strong>How to think about it:</strong> on Day 0 you are not writing code, you are writing the rules the repository will enforce while you sleep. Every rule you can hand to Git or GitHub is one argument the team never has to have.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.1</span>
<h2>Ngày 0: một repo tự nhớ luật để không ai phải nhớ</h2>
<p class="lead">Nhóm 5 lớp SWP391 — Cường (trưởng nhóm, backend), Huy (backend), Linh (frontend) và Trang (tài liệu và kiểm thử) — có ba tuần để làm "Đặt lịch phòng khám". Tối đầu tiên, Cường dành một giờ cho cái repo trước khi ai viết tính năng nào. Một giờ đó quyết định ba tuần tiếp theo cả nhóm làm ứng dụng, hay ngồi gỡ những lần push giẫm lên nhau.</p>

<h3>Chương này chạy thế nào</h3>
<p>Mọi lệnh Git và mọi dòng output trong chương này đều chạy thật. "Cả nhóm" là bốn bản clone của một kho bare (kho trần — chỉ có dữ liệu Git, không có thư mục làm việc, giống kho trên máy chủ) ở máy: <code>cuong/</code>, <code>huy/</code>, <code>linh/</code>, <code>trang/</code>, mỗi bản một <code>user.name</code>, ngày giờ cố định nên mã băm bạn thấy tái lập được. Một bản clone thứ năm đóng vai GitHub: khi một pull request được merge, nó chạy <code>git merge --squash</code> rồi commit với tác giả là người mở PR và committer (người ghi commit) là "GitHub" — đúng thứ nút <strong>Squash and merge</strong> tạo ra. Những gì chỉ có trên github.com — Organization, ruleset, bảng Projects — được mô tả theo docs.github.com tính đến 09/2026, không bịa output của máy chủ.</p>

<h3>Bước 1 — chủ repo là ai quyết định luật nào tồn tại</h3>
${slide('git-16', 5, 'Chủ repo quyết định luật nào bật được')}
<p>Branch protection (bảo vệ nhánh), ruleset (bộ luật) và CODEOWNERS (chủ sở hữu mã) là những tính năng khiến một repo nhóm tự giữ luật. Chúng không có ở mọi nơi. docs.github.com (09/2026) ghi rõ: ruleset "có trong repo public với GitHub Free và GitHub Free cho tổ chức, và trong repo public lẫn private với GitHub Pro, GitHub Team và GitHub Enterprise Cloud". Code owners cũng y như vậy. Vậy một nhóm sinh viên có ba lựa chọn thực tế:</p>
<table>
<thead><tr><th>Chủ repo</th><th>Luật dùng được</th><th>Hợp khi</th></tr></thead>
<tbody>
<tr><td>Organization gói Free, repo <strong>public</strong></td><td>ruleset, branch protection, CODEOWNERS</td><td>thầy cô cho phép để code công khai — gọn nhất</td></tr>
<tr><td>Organization gói Free, repo <strong>private</strong></td><td>không có cái nào</td><td>chỉ dựa vào kỷ luật: pull request vẫn dùng được, nhưng không gì bị cưỡng chế</td></tr>
<tr><td>Tài khoản cá nhân của trưởng nhóm có <strong>GitHub Pro</strong>, repo private</td><td>đủ cả</td><td>trưởng nhóm đã có Student Developer Pack — gói này tặng GitHub Pro trong thời gian còn là sinh viên (education.github.com); các bạn được thêm làm collaborator (cộng tác viên)</td></tr>
</tbody>
</table>
<p>Organization đáng dùng khi dùng được: dự án sống lâu hơn tài khoản của bất kỳ thành viên nào, URL repo không mang tên một bạn sinh viên, và vai trò được ghi rõ. Tạo mất một phút: ảnh đại diện → <strong>Settings</strong> → (mục Access) <strong>Organizations</strong> → <strong>New organization</strong>, làm theo hướng dẫn và chọn gói miễn phí. Mời ba bạn làm member (thành viên) và cho quyền <strong>Write</strong> (ghi) trên repo; trưởng nhóm giữ <strong>Admin</strong>. Không ai khác cần Admin — Admin sửa được chính những luật bạn sắp đặt ra.</p>

<h3>Bước 2 — bộ khung, trước mọi tính năng</h3>
${slide('git-16', 4, 'Ngày 0: repo có gì trước dòng code đầu tiên')}
<p>Cường tạo dự án ở máy và commit bộ khung thành ba commit: bản thân dự án, quy ước làm việc nhóm, rồi CI. Những file quan trọng cho làm việc nhóm:</p>
<pre><code class="language-bash"><span class="tok-comment"># .gitignore — thứ sinh ra được hoặc thứ bí mật không bao giờ vào commit</span>
# phụ thuộc và bản dựng — sinh lại được, không commit
node_modules/
dist/
coverage/
*.log

# bí mật — chỉ commit .env.example
.env
.env.*
!.env.example

# rác của hệ điều hành / trình soạn thảo
.DS_Store
Thumbs.db
.idea/</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># .gitattributes — cuộc chiến xuống dòng Mac/Windows kết thúc ngay Ngày 0 (Chương 14.4)</span>
# mọi file văn bản lưu LF trong kho, dù ai commit từ Windows
* text=auto eol=lf
# file nhị phân: không so dòng, không đổi đuôi dòng
*.png binary
*.jpg binary
*.pdf binary
*.docx binary</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># .env.example — được commit; .env thật thì không</span>
# chép thành .env rồi điền giá trị thật — .env KHÔNG BAO GIỜ được commit
PORT=3000
DATABASE_URL=postgresql://user:matkhau@localhost:5432/phongkham</code></pre>
<p>Trước khi push, kiểm xem luật bỏ qua có ăn thật không. Cường tạo một <code>.env</code> giả và một thư mục <code>node_modules/</code> rồi hỏi Git:</p>
<pre><code class="language-bash">git status --short --ignored
git check-ignore -v .env node_modules/x/i.js .env.example</code></pre>
<div class="out">!! .env
!! node_modules/
.gitignore:8:.env	.env
.gitignore:2:node_modules/	node_modules/x/i.js</div>
<p><code>!!</code> nghĩa là "bị bỏ qua, đúng ý". <code>.env.example</code> hoàn toàn không xuất hiện trong kết quả <code>check-ignore</code> — dòng <code>!.env.example</code> gỡ nó ra khỏi luật bỏ qua, nên nó được commit làm tài liệu.</p>

<h3>CONTRIBUTING.md — cả bộ luật trong một trang</h3>
<p>Bạn mới vào đọc README; người sắp push đọc CONTRIBUTING (hướng dẫn đóng góp). Giữ nó đủ ngắn để người ta đọc, và mỗi luật phải kiểm được:</p>
<pre><code class="language-markdown"># Làm việc chung trong kho phong-kham

## Luồng một việc
1. Mọi việc bắt đầu từ một **issue** (dùng mẫu "Tính năng" hoặc "Báo lỗi"). Tự gán mình vào issue.
2. Tách nhánh từ &#96;main&#96; mới nhất:
   &#96;git switch main &amp;&amp; git pull &amp;&amp; git switch -c feat/12-ten-ngan&#96;
3. Commit nhỏ, lời nhắn theo Conventional Commits: &#96;feat(lich): ...&#96;, &#96;fix(api): ...&#96;, &#96;docs: ...&#96;.
4. &#96;npm test&#96; xanh ở máy mình rồi mới push: &#96;git push -u origin feat/12-ten-ngan&#96;.
5. Mở **Pull Request** vào &#96;main&#96;, điền đủ mẫu, ghi &#96;Closes #12&#96;. PR nhỏ (dưới ~300 dòng).
6. Cần **1 người duyệt** và **CI xanh**. Người viết PR tự bấm **Squash and merge**, rồi xoá nhánh.

## Tên nhánh
| Tiền tố | Dùng cho | Ví dụ |
|---|---|---|
| &#96;feat/&#96; | tính năng mới | &#96;feat/1-khung-gio&#96; |
| &#96;fix/&#96; | sửa lỗi | &#96;fix/9-trung-lich&#96; |
| &#96;docs/&#96; | tài liệu | &#96;docs/4-huong-dan&#96; |
| &#96;chore/&#96; | cấu hình, CI, dọn dẹp | &#96;chore/ci-node-22&#96; |
| &#96;hotfix/&#96; | sửa gấp bản đã nộp | &#96;hotfix/1.0.1&#96; |

## Luật cứng
- Không push thẳng lên &#96;main&#96; (ruleset sẽ chặn).
- Không &#96;git push --force&#96; lên nhánh của người khác. Nhánh của mình: chỉ &#96;--force-with-lease&#96;.
- Không commit &#96;.env&#96;, khoá API, file &gt; 50 MB, &#96;node_modules/&#96;.
- Xung đột &#96;package-lock.json&#96;: lấy bản của &#96;main&#96;, chạy &#96;npm install&#96;, commit lại — không sửa tay.
- Kẹt quá 30 phút: hỏi trong nhóm, dán nguyên văn &#96;git status&#96;.</code></pre>

<h3>Mẫu issue và mẫu pull request</h3>
<p>Một issue form (mẫu issue dạng biểu mẫu) biến câu "làm cái lịch" thành một user story (câu chuyện người dùng) có tiêu chí hoàn thành kiểm được. Mẫu là file YAML trong <code>.github/ISSUE_TEMPLATE/</code>; ba khoá bắt buộc ở cấp trên cùng là <code>name</code>, <code>description</code> và <code>body</code> (docs.github.com, "Syntax for issue forms"). Để ý một chi tiết trong tài liệu: <code>labels</code> chỉ được gắn nếu nhãn ĐÃ tồn tại — tạo nhãn <code>tinh-nang</code> và <code>loi</code> ở trang Labels trước.</p>
<pre><code class="language-yaml">name: Tính năng
description: Một việc cần làm cho đồ án — nhỏ, xong trong 1–3 ngày.
title: "[Tính năng]: "
labels: ["tinh-nang"]
body:
  - type: textarea
    id: user-story
    attributes:
      label: User story
      description: Là &lt;ai&gt;, tôi muốn &lt;gì&gt;, để &lt;vì sao&gt;.
      placeholder: Là bệnh nhân, tôi muốn xem các khung giờ còn trống, để chọn giờ khám.
    validations:
      required: true
  - type: textarea
    id: tieu-chi
    attributes:
      label: Tiêu chí hoàn thành
      description: Mỗi dòng một điều KIỂM ĐƯỢC.
      value: |
        - [ ] 
    validations:
      required: true
  - type: dropdown
    id: phan
    attributes:
      label: Phần việc
      options:
        - Backend
        - Frontend
        - Tài liệu
        - CI / cấu hình
    validations:
      required: true
  - type: dropdown
    id: co
    attributes:
      label: Cỡ việc
      options:
        - "S — dưới nửa ngày"
        - "M — 1 đến 2 ngày"
        - "L — 3 ngày trở lên (nên chẻ nhỏ)"
      default: 1</code></pre>
<pre><code class="language-yaml">name: Báo lỗi
description: Có gì chạy sai so với mong đợi.
title: "[Lỗi]: "
labels: ["loi"]
body:
  - type: textarea
    id: cac-buoc
    attributes:
      label: Các bước tái hiện
      placeholder: |
        1. Mở trang đặt lịch
        2. Chọn Chủ nhật 20/09
        3. Bấm Đặt
    validations:
      required: true
  - type: textarea
    id: mong-doi
    attributes:
      label: Mong đợi và thực tế
      description: Đáng lẽ thấy gì, thực tế thấy gì. Dán nguyên văn lỗi nếu có.
    validations:
      required: true
  - type: input
    id: phien-ban
    attributes:
      label: Phiên bản
      description: Chạy git describe --tags rồi dán kết quả.
      placeholder: v1.0.0
    validations:
      required: true</code></pre>
<pre><code class="language-yaml"><span class="tok-comment"># .github/ISSUE_TEMPLATE/config.yml — không cho mở issue trống không theo mẫu</span>
blank_issues_enabled: false</code></pre>
<p>Mẫu pull request đặt ở <code>.github/pull_request_template.md</code> (tài liệu cũng nhận ở thư mục gốc hoặc <code>docs/</code>). Nó điền sẵn thân của mọi pull request mới — kể cả dòng <code>Closes #</code> khiến GitHub tự đóng issue khi merge:</p>
<pre><code class="language-markdown">## Việc gì
&lt;!-- Một hai câu: PR này làm gì, vì sao. --&gt;

Closes #

## Cách kiểm
- [ ] &#96;npm test&#96; xanh ở máy mình
- [ ] Các bước để người duyệt tự thấy thay đổi:
  1.

## Ảnh chụp (nếu đổi giao diện)

## Tự kiểm trước khi xin duyệt
- [ ] Nhánh tách từ &#96;main&#96; mới nhất, tên đúng quy ước
- [ ] Không có &#96;.env&#96;, khoá API, &#96;console.log&#96; gỡ lỗi
- [ ] Đã tự đọc hết tab "Files changed" một lượt</code></pre>
<p>Cả hai loại file đều được kiểm trước khi commit: <code>actionlint</code> cho workflow ở dưới và một trình đọc YAML cho mọi file <code>.yml</code> — một issue form sai cú pháp YAML đơn giản là không hiện trong danh sách chọn mẫu, và không ai thấy báo lỗi gì.</p>

<h3>CODEOWNERS — review tự tìm đúng người</h3>
<pre><code class="language-bash"># Dòng khớp SAU CÙNG thắng. Tên tài khoản dưới đây là ví dụ — thay bằng tên thật của nhóm.
*            @cuong-g5
/src/        @huy-g5 @cuong-g5
/public/     @linh-g5
/docs/       @trang-g5
/.github/    @cuong-g5</code></pre>
<p>Ba luật từ docs.github.com: file đặt được ở <code>.github/</code>, thư mục gốc hoặc <code>docs/</code> (tìm theo đúng thứ tự đó, gặp cái nào trước dùng cái đó); trong file, "mẫu khớp CUỐI CÙNG được ưu tiên nhất" — vì thế dòng bắt-tất-cả <code>*</code> đứng đầu; và mọi owner phải có quyền <strong>write</strong>, không thì dòng đó bị bỏ qua. Một mình CODEOWNERS chỉ tự động <em>mời</em> review. Nó thành cửa chặn khi ruleset bật "require review from Code Owners" (bắt buộc chủ sở hữu mã duyệt) — lúc đó một thay đổi trong <code>/public/</code> không merge được cho tới khi Linh (chỉ cần một trong các owner được liệt kê) duyệt.</p>

<h3>CI tối thiểu — và cái bẫy bộ test rỗng mà vẫn xanh</h3>
${slide('git-16', 8, 'CI tối thiểu và bẫy “0 test vẫn xanh”')}
<pre><code class="language-yaml"><span class="tok-comment"># .github/workflows/ci.yml</span>
name: CI

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: ci-&#36;{{ github.ref }}
  cancel-in-progress: true

jobs:
  kiem-tra:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test</code></pre>
<p>Ba chi tiết gánh cả file. <code>permissions: contents: read</code> cho job đúng mức quyền tối thiểu nó cần. <code>concurrency</code> (chạy đồng thời) huỷ lượt chạy trước khi ai đó push hai lần trong một phút. Và mã job, <code>kiem-tra</code>, chính là tên bạn sẽ chọn làm status check (phép kiểm trạng thái) bắt buộc. (Các action được ghim ở bản chính hiện tại, <code>v7</code>, tính đến 09/2026; các chương trước dùng <code>v4</code>, bản đó vẫn còn.)</p>
<p>Giờ tới cái bẫy. Khi chưa có file test nào, Cường chạy lệnh test:</p>
<pre><code class="language-bash">npm test 2&gt;&amp;1 | grep -E "^# (tests|pass|fail)"</code></pre>
<div class="out"># tests 0
# pass 0
# fail 0</div>
<p>Không test nào, mã thoát 0 — CI sẽ <em>xanh</em> trong khi chẳng kiểm gì. Một phép kiểm bắt buộc mà không thể trượt thì không bảo vệ được ai. Nên một test thật phải vào trước khi bật CI:</p>
<pre><code class="language-javascript">import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GIO_MO, GIO_DONG, SLOT_PHUT } from '../src/config.js';

test('giờ mở cửa trước giờ đóng cửa', () =&gt; {
  assert.ok(GIO_MO &lt; GIO_DONG);
});
test('khung giờ chia hết một giờ', () =&gt; {
  assert.equal(60 % SLOT_PHUT, 0);
});</code></pre>
<div class="out">lint: 1 file, cú pháp ổn
# tests 2
# pass 2
# fail 0</div>
<p>Script <code>lint</code> là một file Node mười dòng chạy <code>node --check</code> cho mọi file trong <code>src/</code> — cố ý không dùng glob của shell, để bạn dùng Windows cũng chạy được.</p>

<h3>Bước 3 — push bộ khung, rồi mới khoá main</h3>
<pre><code class="language-bash">git log --oneline
git remote add origin &lt;URL của repo&gt;
git push -u origin main</code></pre>
<div class="out">b10dacc ci: chạy lint + test cho mọi pull request
a97c247 docs: quy ước làm việc nhóm — CONTRIBUTING, mẫu issue/PR, CODEOWNERS
0fd7fe1 chore: khởi tạo dự án phong-kham</div>
${slide('git-16', 6, 'Ruleset cho main: năm luật')}
<p>Chỉ sau khi bộ khung đã lên GitHub, Cường mới bảo vệ <code>main</code> — làm trước thì từng file khung cũng phải đi qua pull request. Repo → <strong>Settings</strong> → (mục Code and automation) <strong>Rulesets</strong> → <strong>New ruleset</strong> → <strong>New branch ruleset</strong>; đặt tên, để trạng thái <strong>Active</strong>, nhắm vào nhánh mặc định, rồi bật (tên luật đúng như trang "Available rules for rulesets"):</p>
<ul>
<li><strong>Restrict deletions</strong> (cấm xoá) — không ai lỡ tay xoá <code>main</code>.</li>
<li><strong>Block force pushes</strong> (chặn force-push) — lịch sử chung không bị viết lại (Chương 8.2).</li>
<li><strong>Require a pull request before merging</strong> (bắt buộc PR trước khi merge) với 1 lượt duyệt, cộng "require review from Code Owners". Tác giả không tự duyệt PR của mình được, nên mọi thay đổi đều qua thêm một cặp mắt.</li>
<li><strong>Require status checks to pass before merging</strong> (bắt buộc phép kiểm xanh) → thêm <code>kiem-tra</code>. Tài liệu gọi mặc định ở đây là "strict" (chặt): ô <strong>Require branches to be up to date before merging</strong> (nhánh phải cập nhật với main) được tích sẵn. Nhóm bốn người nên bỏ tích — không thì mỗi lần một PR merge, ba PR đang mở còn lại phải cập nhật và chạy lại CI. Trigger <code>push: branches: [main]</code> chạy lại CI sau mỗi lần merge và bắt được trường hợp hiếm hai PR xanh ghép lại thành đỏ.</li>
<li><strong>Require linear history</strong> (bắt buộc lịch sử thẳng, tuỳ chọn) — chỉ squash hoặc rebase merge mới vào được <code>main</code>.</li>
</ul>
<p>Để <strong>bypass list</strong> (danh sách được miễn) trống. Khoảnh khắc trưởng nhóm được bỏ qua review "chỉ lần này thôi", cái luật chỉ còn là một mong muốn, không còn là cái repo.</p>

<div class="pitfall co-tieu-de"><strong>Ngày 0 hỏng thế nào trong nhóm sinh viên.</strong> <b>Repo private trong Organization gói Free, luật "đã bật".</b> Trang cài đặt vẫn cho bạn soạn ruleset, cả nhóm tin <code>main</code> đã được bảo vệ, và tuần thứ hai vẫn có người push thẳng lên đó — với GitHub Free, repo private của tổ chức không có ruleset. Kiểm bằng một lần push thử có chủ đích. <b>Ai cũng là Admin.</b> "Cho tiện", trưởng nhóm cho cả nhóm quyền Admin; giờ bất kỳ ai cũng sửa hoặc tắt được ruleset lúc hai giờ sáng. <b>CI xanh từ trong trứng.</b> Không có test, hoặc <code>npm test</code> lúc nào cũng thoát 0 — phép kiểm bắt buộc qua mãi mãi và không bảo vệ gì. <b>File <code>.env</code> bị commit ngày 1</b> vì <code>.gitignore</code> được thêm ngày 2; luật bỏ qua không gỡ một file Git đã theo dõi (Chương 1.5).</div>

<h3>Quy ước nhánh và commit</h3>
<p>Bảng trong CONTRIBUTING là toàn bộ quy ước: <code>loại/số-issue-tên-ngắn</code> cho nhánh (<code>feat/1-khung-gio</code>), Conventional Commits (quy ước lời nhắn commit) cho lời nhắn (<code>feat(lich): …</code>, Chương 1.4), một issue một nhánh, một nhánh một pull request. Đưa số issue vào tên nhánh chẳng tốn gì, mà ba tuần sau <code>git branch -a</code> vẫn cho bạn biết vì sao từng nhánh tồn tại. Muốn luật lời nhắn commit được cưỡng chế thay vì nhờ vả, hook <code>commit-msg</code> ở Chương 12.1 làm việc đó trên mọi laptop.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code>, tạo thư mục <code>phong-kham</code> với các file của bài này: <code>.gitignore</code>, <code>.gitattributes</code>, <code>.env.example</code>, <code>CONTRIBUTING.md</code>, hai issue form cộng <code>config.yml</code>, mẫu pull request, <code>CODEOWNERS</code> và <code>ci.yml</code> (chép từ các khối ở trên).</li><li>Tạo một <code>.env</code> giả và một <code>node_modules/x/i.js</code>. Chạy <code>git status --short --ignored</code> và <code>git check-ignore -v .env .env.example</code>, giải thích từng dòng.</li><li>Chạy <code>npm test</code> khi chưa có file test nào và ghi lại mã thoát (<code>echo $?</code>). Thêm <code>test/config.test.js</code> rồi chạy lại.</li><li>Commit bộ khung thành ba commit (dự án · quy ước · CI) với lời nhắn theo Conventional Commits.</li><li>Nếu có một Organization miễn phí: tạo repo <strong>public</strong>, push, thêm ruleset như bài này, rồi thử <code>git push origin main</code> với một commit mới.</li></ol>
<p><strong>Đạt khi:</strong> <code>git status --short --ignored</code> hiện <code>!! .env</code>, <code>git log --oneline</code> có đúng ba commit khung, và (nếu làm bước 5) GitHub từ chối lần push thẳng vào <code>main</code> với lời báo có nêu tên luật.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Organization</span><span class="v">Tổ chức — một tài khoản GitHub thuộc về một nhóm: repo, thành viên và vai trò không thuộc về riêng ai.</span></div>
  <div class="kv"><span class="k">Ruleset</span><span class="v">Bộ luật — danh sách luật có tên cho nhánh hoặc tag (cấm xoá, cấm force-push, bắt buộc PR và phép kiểm), do GitHub cưỡng chế.</span></div>
  <div class="kv"><span class="k">Bypass list</span><span class="v">Danh sách được miễn — người hoặc app được bỏ qua ruleset; với nhóm sinh viên nên để trống.</span></div>
  <div class="kv"><span class="k">Issue form</span><span class="v">Mẫu issue dạng biểu mẫu — file YAML trong <code>.github/ISSUE_TEMPLATE/</code> biến issue mới thành form có trường bắt buộc.</span></div>
  <div class="kv"><span class="k">CODEOWNERS</span><span class="v">Chủ sở hữu mã — file ánh xạ đường dẫn với người được tự động mời review; mẫu khớp cuối cùng thắng.</span></div>
  <div class="kv"><span class="k">Required status check</span><span class="v">Phép kiểm bắt buộc — một job CI (ở đây <code>kiem-tra</code>) phải xanh thì pull request mới merge được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Chủ repo quyết định luật nào tồn tại: ruleset và CODEOWNERS cần repo public ở gói Free, hoặc GitHub Pro/Team cho repo private.</li><li>Bộ khung — luật bỏ qua, xuống dòng, quy ước, mẫu, CODEOWNERS, CI — vào trước tính năng đầu tiên, thành vài commit rõ ràng.</li><li>Một job CI không thể trượt còn tệ hơn không có; thêm một test thật trước khi biến nó thành phép kiểm bắt buộc.</li><li>Chỉ khoá <code>main</code> sau khi bộ khung đã push, để bypass list trống, và bỏ tích "up to date before merging" cho nhóm nhỏ.</li><li>Tên nhánh mang số issue, lời nhắn commit theo Conventional Commits, để lịch sử tự giải thích.</li></ul>

<a class="link-card" href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets" target="_blank" rel="noopener">
  <span class="lc-ico">🛡</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Available rules for rulesets</span><span class="lc-sub">Cấm xoá, chặn force-push, bắt buộc PR và phép kiểm, strict và loose.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Syntax for issue forms</span><span class="lc-sub">Khoá bắt buộc, các loại phần tử trong body, nhãn phải có sẵn.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners" target="_blank" rel="noopener">
  <span class="lc-ico">👥</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — About code owners</span><span class="lc-sub">Vị trí file, mẫu khớp cuối thắng, owner cần quyền write.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/creating-a-new-organization-from-scratch" target="_blank" rel="noopener">
  <span class="lc-ico">🏢</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Creating a new organization from scratch</span><span class="lc-sub">Settings → Organizations → New organization.</span></span>
</a>
<p class="note-ct"><strong>Nghĩ về nó thế này:</strong> Ngày 0 bạn không viết code, bạn viết những luật mà repo sẽ giữ hộ trong lúc bạn ngủ. Mỗi luật giao được cho Git hay GitHub là một cuộc cãi nhau cả nhóm không bao giờ phải có.</p>
</div>
`,
    },

    /* ─────────────────────────── 16.2 ─────────────────────────── */
    {
      title: '16.2 — One full sprint, run for real: four issues, four branches, one conflict|||16.2 — Một sprint trọn vẹn, chạy thật: bốn issue, bốn nhánh, một xung đột',
      slug: 'git-16-2-sprint-mo-phong',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mô phỏng chạy thật một sprint của nhóm bốn người: issue → nhánh → push → pull request → CI và review → sửa theo review → một xung đột thật khi hai bạn sửa cùng file → giải bằng merge main vào nhánh → squash merge → dọn nhánh; bảng Projects chạy theo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.2</span>
<h2>One sprint, four people, every command real</h2>
<p class="lead">Sprint 1 of Clinic Booking runs from Tuesday 1 to Friday 4 September. Four issues, four branches, four pull requests — and, on Friday morning, the conflict every team meets sooner or later. This lesson follows it command by command, from four different laptops.</p>

<h3>The plan: four issues and a board</h3>
<p>On Monday evening Cường opens four issues with the "Tính năng" form and the team assigns themselves:</p>
<table>
<thead><tr><th>Issue</th><th>Who</th><th>Branch</th><th>Pull request</th></tr></thead>
<tbody>
<tr><td>#1 Free time slots of a day</td><td>Huy</td><td><code>feat/1-khung-gio</code></td><td>#5</td></tr>
<tr><td>#2 Booking form</td><td>Linh</td><td><code>feat/2-form-dat-lich</code></td><td>#6</td></tr>
<tr><td>#3 Booking API, no double booking</td><td>Cường</td><td><code>feat/3-api-dat-lich</code></td><td>#7</td></tr>
<tr><td>#4 How to install and run</td><td>Trang</td><td><code>docs/4-huong-dan</code></td><td>#8</td></tr>
</tbody>
</table>
<p>Why do the pull requests start at #5? On GitHub, issues and pull requests share one number sequence per repository — issues #1–#4 took the first four. He also creates a project in the organization (Projects → New project, Board layout) and adds the four issues. Its two default workflows, per docs.github.com ("Using the built-in automations", 09/2026), are exactly what a student team needs: when an item is <strong>closed</strong> its status becomes <strong>Done</strong>, and when a pull request is <strong>merged</strong> its status becomes <strong>Done</strong>.</p>

<h3>Everyone gets the repository</h3>
<pre><code class="language-bash">git clone &lt;repository URL&gt; phong-kham &amp;&amp; cd phong-kham
git config user.name "Huy Nguyen"      <span class="tok-comment"># each person, their own name and email</span>
git log --oneline</code></pre>
<div class="out">b10dacc ci: chạy lint + test cho mọi pull request
a97c247 docs: quy ước làm việc nhóm — CONTRIBUTING, mẫu issue/PR, CODEOWNERS
0fd7fe1 chore: khởi tạo dự án phong-kham</div>

<h3>Huy: issue #1, from branch to pull request</h3>
<pre><code class="language-bash">git switch -c feat/1-khung-gio</code></pre>
<div class="out">Switched to a new branch 'feat/1-khung-gio'</div>
<p>He adds the lunch break to the configuration — one line at the end of <code>src/config.js</code> — writes <code>src/lich.js</code>, and commits the code and the tests separately:</p>
<pre><code class="language-javascript"><span class="tok-comment">// appended to src/config.js</span>
export const NGHI_TRUA = ['12:00', '13:00'];</code></pre>
<pre><code class="language-bash">git commit -m "feat(lich): tính các khung giờ trống trong ngày"
git commit -m "test(lich): kiểm số khung giờ và giờ đã đặt"
git log --oneline -2
npm test 2&gt;&amp;1 | grep -E "^# (tests|pass|fail)"
git push -u origin feat/1-khung-gio</code></pre>
<div class="out">81804c4 test(lich): kiểm số khung giờ và giờ đã đặt
119d551 feat(lich): tính các khung giờ trống trong ngày
# tests 4
# pass 4
# fail 0
 * [new branch]      feat/1-khung-gio -&gt; feat/1-khung-gio
branch 'feat/1-khung-gio' set up to track 'origin/feat/1-khung-gio'.</div>
<p>On GitHub he opens pull request #5 into <code>main</code>. The template fills the body; he completes it and keeps the line <code>Closes #1</code>. (From the terminal the same step is <code>gh pr create --fill</code>, Chapter 11.1.) The ruleset now takes over: CI starts, and CODEOWNERS requests a review from Cường because the change is under <code>/src/</code>.</p>

<h3>Linh, Cường and Trang do the same</h3>
<pre><code class="language-bash"><span class="tok-comment"># Linh — 1 Sep, 14:00</span>
git switch -c feat/2-form-dat-lich
git commit -m "feat(ui): form đặt lịch khám"          <span class="tok-comment"># → e6b5eb7, PR #6</span>
<span class="tok-comment"># Cường — 2 Sep, 09:00: src/dat-lich.js + tests, and ONE line at the end of src/config.js</span>
git switch -c feat/3-api-dat-lich
git commit -m "feat(api): đặt lịch hẹn, chặn trùng giờ"  <span class="tok-comment"># → ada4c25, PR #7</span>
<span class="tok-comment"># Trang — 2 Sep, 10:00</span>
git switch -c docs/4-huong-dan
git commit -m "docs: hướng dẫn cài và chạy thử"          <span class="tok-comment"># → def05f0, PR #8</span></code></pre>
<p>Cường's one line in <code>src/config.js</code> is <code>export const SO_LICH_TOI_DA = 3;</code> (at most three bookings per phone number) — appended at the end of the file. Huy appended his line at the very same place. Neither of them knows yet.</p>

<h3>Review, CI, squash merge</h3>
${slide('git-16', 9, 'Vòng đời một việc: issue → PR → squash')}
<p>On Thursday morning Cường approves #5, CI is green, and Huy presses <strong>Squash and merge</strong>. GitHub combines the two commits of the branch into one new commit on <code>main</code>, with Huy as author and GitHub as committer, closes issue #1 (the pull request targeted the default branch and said <code>Closes #1</code>) and moves the card to Done. In the simulation, the "GitHub" clone does exactly that:</p>
<pre><code class="language-bash"><span class="tok-comment"># what the Squash and merge button does — done here by the "github" clone, not by you</span>
git merge --squash origin/feat/1-khung-gio
GIT_AUTHOR_NAME="Huy Nguyen" GIT_AUTHOR_EMAIL=huy@example.com \\
GIT_COMMITTER_NAME=GitHub GIT_COMMITTER_EMAIL=noreply@github.com \\
  git commit -m "feat(lich): khung giờ trống trong ngày (#5)" -m "Closes #1"
git push origin main &amp;&amp; git push origin --delete feat/1-khung-gio
<span class="tok-comment"># … and the same for Trang's #8 in the afternoon</span>
git log --oneline -3 origin/main</code></pre>
<div class="out">6aa8d69 docs: hướng dẫn cài và chạy thử (#8)
0d838d5 feat(lich): khung giờ trống trong ngày (#5)
b10dacc ci: chạy lint + test cho mọi pull request</div>
<p>Linh's #6 is different: Huy leaves <strong>Request changes</strong> — the phone field should be <code>type="tel"</code> with a pattern. Linh does not open a new pull request; she pushes one more commit to the same branch, and the pull request updates itself:</p>
<pre><code class="language-bash">git commit -m "fix(ui): ô số điện thoại kiểu tel, kiểm 10 số" &amp;&amp; git push
git log --oneline -2</code></pre>
<div class="out">da49255 fix(ui): ô số điện thoại kiểu tel, kiểm 10 số
e6b5eb7 feat(ui): form đặt lịch khám</div>
<p>On Friday 09:00 #6 is squash-merged. The two commits become one, and GitHub's default message keeps the list of what was squashed (the exact default depends on the repository setting — docs.github.com, "Pull request merges"):</p>
<pre><code class="language-bash">git show -s --format=fuller 23ba455</code></pre>
<div class="out">commit 23ba455faf6b742633b0d782c12f9827641c65d9
Author:     Linh Tran &lt;linh@example.com&gt;
AuthorDate: Fri Sep 4 09:00:00 2026 +0700
Commit:     GitHub &lt;noreply@github.com&gt;
CommitDate: Fri Sep 4 09:00:00 2026 +0700

    feat(ui): form đặt lịch khám (#6)

    Closes #2

    * feat(ui): form đặt lịch khám
    * fix(ui): ô số điện thoại kiểu tel, kiểm 10 số</div>

<h3>The sprint as a graph</h3>
${slide('git-16', 10, 'Sprint 1: bốn người, bốn làn, một main')}
<p>Look at what squash did to the graph. The glowing commits on <code>main</code> each have exactly one parent — the previous commit on <code>main</code>. The branch commits (<code>119d551</code>, <code>81804c4</code>, <code>e6b5eb7</code>, <code>da49255</code>…) are never ancestors of <code>main</code>: their <em>content</em> was copied into a new commit, their <em>history</em> was not joined. Keep that in mind — it explains a message you will see at the end of this lesson.</p>

<h3>Friday 10:00 — a real conflict</h3>
<p>Pull request #7 now shows "This branch has conflicts that must be resolved". Cường updates his branch from <code>main</code> on his own laptop:</p>
${slide('git-16', 11, 'Xung đột thật trong config.js')}
<pre><code class="language-bash">git fetch origin
git merge origin/main</code></pre>
<div class="out">   b10dacc..23ba455  main       -&gt; origin/main
Auto-merging src/config.js
CONFLICT (content): Merge conflict in src/config.js
Automatic merge failed; fix conflicts and then commit the result.</div>
<pre><code class="language-bash">git status --short
cat src/config.js</code></pre>
<div class="out">M  README.md
A  docs/HUONG-DAN.md
A  public/index.html
UU src/config.js
A  src/lich.js
A  test/lich.test.js
// Cấu hình phòng khám
export const GIO_MO = '08:00';
export const GIO_DONG = '17:00';
export const SLOT_PHUT = 30;
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
export const SO_LICH_TOI_DA = 3;
=======
export const NGHI_TRUA = ['12:00', '13:00'];
&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main</div>
<p>Read it the way Chapter 3.3 taught: everything already merged cleanly is staged (<code>M</code>, <code>A</code>); only <code>src/config.js</code> is <code>UU</code>. Two people added a different line at the same spot, so Git cannot know the order. This is not a "pick one" conflict — the file needs <strong>both</strong> lines. Cường deletes the three marker lines, keeps both constants, and checks the result with the combined diff before staging:</p>
<pre><code class="language-bash">git diff</code></pre>
<div class="out">diff --cc src/config.js
index c7749e2,b88bb86..0000000
--- a/src/config.js
+++ b/src/config.js
@@@ -2,4 -2,4 +2,5 @@@
  export const GIO_MO = '08:00';
  export const GIO_DONG = '17:00';
  export const SLOT_PHUT = 30;
+ export const NGHI_TRUA = ['12:00', '13:00'];
 +export const SO_LICH_TOI_DA = 3;</div>
<p>Two columns of <code>+</code>: the first column is "added compared with my side", the second "compared with <code>main</code>" — each line comes from one side, nothing else changed. Then the step students skip: <strong>run the tests before committing the merge</strong>, because "no conflict markers left" is not the same as "works".</p>
<pre><code class="language-bash">git add src/config.js &amp;&amp; npm test 2&gt;&amp;1 | grep -E "^# (tests|pass|fail)"
git commit --no-edit
git log --oneline --graph -6
git push</code></pre>
<div class="out"># tests 6
# pass 6
# fail 0
*   fbd3aaf Merge remote-tracking branch 'origin/main' into feat/3-api-dat-lich
|\\
| * 23ba455 feat(ui): form đặt lịch khám (#6)
| * 6aa8d69 docs: hướng dẫn cài và chạy thử (#8)
| * 0d838d5 feat(lich): khung giờ trống trong ngày (#5)
* | ada4c25 feat(api): đặt lịch hẹn, chặn trùng giờ
|/
* b10dacc ci: chạy lint + test cho mọi pull request
   ada4c25..fbd3aaf  feat/3-api-dat-lich -&gt; feat/3-api-dat-lich</div>
<p>Why merge and not rebase? The branch is already pushed and has an open pull request that Huy has commented on. Merging <code>main</code> into it adds one commit and needs a plain <code>git push</code>. A rebase would rewrite <code>ada4c25</code> and require <code>--force-with-lease</code> (Chapter 8.2) — allowed on your own branch, but one more thing to get wrong. With squash merge, the extra merge commit costs nothing: it disappears when the pull request is squashed.</p>

<h3>After the merge: a straight main, and branches to clean up</h3>
<pre><code class="language-bash">git switch main &amp;&amp; git pull
git log --format="%h %&lt;(12)%an %&lt;(12)%cn %s" main</code></pre>
<div class="out">170a83c Cuong Hoang  GitHub       feat(api): đặt lịch hẹn, chặn trùng giờ (#7)
23ba455 Linh Tran    GitHub       feat(ui): form đặt lịch khám (#6)
6aa8d69 Trang Le     GitHub       docs: hướng dẫn cài và chạy thử (#8)
0d838d5 Huy Nguyen   GitHub       feat(lich): khung giờ trống trong ngày (#5)
b10dacc Cuong Hoang  Cuong Hoang  ci: chạy lint + test cho mọi pull request
a97c247 Cuong Hoang  Cuong Hoang  docs: quy ước làm việc nhóm — CONTRIBUTING, mẫu issue/PR, CODEOWNERS
0fd7fe1 Cuong Hoang  Cuong Hoang  chore: khởi tạo dự án phong-kham</div>
<p>One commit per pull request, each with the number of its pull request, each credited to the person who wrote it. <code>git show --stat 170a83c</code> lists only Cường's own three files — the merge commit he made on his branch left no trace. Now the local branch:</p>
<pre><code class="language-bash">git fetch --prune
git branch -vv
git branch -d feat/3-api-dat-lich
git branch -D feat/3-api-dat-lich</code></pre>
<div class="out"> - [deleted]         (none)     -&gt; origin/feat/3-api-dat-lich
  feat/3-api-dat-lich fbd3aaf [origin/feat/3-api-dat-lich: gone] Merge remote-tracking branch 'origin/main' into feat/3-api-dat-lich
* main                170a83c [origin/main] feat(api): đặt lịch hẹn, chặn trùng giờ (#7)
error: the branch 'feat/3-api-dat-lich' is not fully merged
hint: If you are sure you want to delete it, run 'git branch -D feat/3-api-dat-lich'
Deleted branch feat/3-api-dat-lich (was fbd3aaf).</div>
<p>"Not fully merged" is correct and harmless here: after a squash, the branch's commits are not ancestors of <code>main</code> (the graph above). The safe routine is <code>git fetch --prune</code>, look for <code>: gone</code> in <code>git branch -vv</code>, check that the pull request says <strong>Merged</strong>, and only then <code>-D</code>. If you ever delete one too early, the <code>(was fbd3aaf)</code> hash and the reflog bring it back (Chapter 4.4).</p>

<h3>The board, without anyone dragging cards</h3>
${slide('git-16', 12, 'Bảng Projects chạy theo issue và PR')}
<p>At Thursday 15:00 the board already told the truth: #1 and #4 in Done (their pull requests merged), #2 and #3 in review — one with changes requested, one with a conflict. Nobody moved a card by hand; the only manual step was dragging an issue to In Progress when starting it, and many teams even skip that by opening a draft pull request early (Chapter 6.1).</p>

<div class="pitfall co-tieu-de"><strong>How a sprint goes wrong in student teams.</strong> <b>Resolving the conflict on GitHub's web editor without running anything.</b> The markers disappear, the button turns green, and <code>main</code> gets a file that does not compile — the web editor does not run your tests. Resolve locally, run <code>npm test</code>, then push. <b>"Keep mine" by reflex.</b> In our conflict both lines were needed; choosing one side would have silently deleted Huy's lunch break. <b>A second pull request for review fixes.</b> Push to the same branch; the review, the CI history and the discussion stay in one place. <b>Deleting branches with <code>-D</code> before the pull request is merged</b> — do the <code>: gone</code> check first.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Build your own team of four: <code>git init --bare origin.git</code>, then clone it four times (<code>cuong</code>, <code>huy</code>, <code>linh</code>, <code>trang</code>) and give each clone its own <code>git config user.name</code>. From <code>cuong</code>, commit a <code>config.js</code> with three lines and push <code>main</code>.</li><li>In <code>huy</code> and in <code>cuong</code>, create a feature branch each and append a <strong>different</strong> line at the end of <code>config.js</code>; commit and push both branches.</li><li>Play GitHub for Huy: in a fifth clone, <code>git merge --squash origin/&lt;huy's branch&gt;</code>, commit with <code>--author</code>, push <code>main</code>.</li><li>In <code>cuong</code>: <code>git fetch</code>, <code>git merge origin/main</code>, resolve by keeping both lines, check with <code>git diff</code>, commit, push; then squash-merge Cường's branch too.</li><li>In <code>cuong</code>: <code>git fetch --prune</code>, <code>git branch -vv</code>, then try <code>git branch -d</code> on the merged branch and explain the message.</li></ol>
<p><strong>Done when:</strong> <code>git log --oneline --graph main</code> is a straight line containing both features as one commit each, <code>config.js</code> on <code>main</code> contains both new lines, and you can explain why <code>git branch -d</code> refused.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Sprint</span><span class="v">A short, fixed period (here 1–4 September) in which the team finishes a chosen set of issues.</span></div>
  <div class="kv"><span class="k">Squash and merge</span><span class="v">GitHub merges a pull request as one new commit on the base branch; the branch commits are not joined into its history.</span></div>
  <div class="kv"><span class="k">Request changes</span><span class="v">A review verdict that blocks merging until the author pushes fixes and the reviewer approves.</span></div>
  <div class="kv"><span class="k">Closing keyword</span><span class="v"><code>Closes #1</code> (also <code>fixes</code>, <code>resolves</code>) in a pull request to the default branch closes the issue on merge.</span></div>
  <div class="kv"><span class="k">Combined diff</span><span class="v">The two-column <code>diff --cc</code> shown during a merge: one <code>+</code>/<code>-</code> column per side.</span></div>
  <div class="kv"><span class="k"><code>: gone</code></span><span class="v">What <code>git branch -vv</code> prints when a branch's remote copy was deleted — the signal that it is safe to clean up.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>One issue, one branch, one pull request: the issue number travels through the branch name, the <code>Closes #</code> line and the squash commit.</li><li>Review fixes are new commits on the same branch; the pull request updates itself.</li><li>To update a pushed branch that conflicts, merge <code>main</code> into it, resolve, run the tests, then push — no force needed.</li><li>Squash merge gives a straight <code>main</code> with one commit per pull request, credited to its author.</li><li>After a squash, <code>git branch -d</code> says "not fully merged" by design; check <code>: gone</code> and the Merged badge, then use <code>-D</code>.</li></ul>

<a class="link-card" href="https://docs.github.com/en/pull-requests/reference/pull-request-merges" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Pull request merges</span><span class="lc-sub">Merge commit, squash and merge, rebase and merge; the squash commit message.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Linking a pull request to an issue</span><span class="lc-sub">Closing keywords, and why the pull request must target the default branch.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-built-in-automations" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Using the built-in automations</span><span class="lc-sub">Closed → Done, merged → Done, and the other Projects workflows.</span></span>
</a>
<p class="note-ct"><strong>How to think about it:</strong> a sprint is not four people writing code; it is four streams of commits meeting one <code>main</code>. Most of the skill is in the meeting — small branches, early pull requests, and resolving conflicts on your own laptop where the tests can run.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.2</span>
<h2>Một sprint, bốn người, mọi lệnh đều thật</h2>
<p class="lead">Sprint 1 (vòng làm việc ngắn) của "Đặt lịch phòng khám" chạy từ thứ Ba 1/9 tới thứ Sáu 4/9. Bốn issue, bốn nhánh, bốn pull request — và sáng thứ Sáu, vụ xung đột mà nhóm nào sớm muộn cũng gặp. Bài này đi theo từng lệnh, từ bốn cái laptop khác nhau.</p>

<h3>Kế hoạch: bốn issue và một bảng</h3>
<p>Tối thứ Hai, Cường mở bốn issue bằng mẫu "Tính năng" và mỗi người tự gán mình:</p>
<table>
<thead><tr><th>Issue</th><th>Ai</th><th>Nhánh</th><th>Pull request</th></tr></thead>
<tbody>
<tr><td>#1 Khung giờ trống trong ngày</td><td>Huy</td><td><code>feat/1-khung-gio</code></td><td>#5</td></tr>
<tr><td>#2 Form đặt lịch</td><td>Linh</td><td><code>feat/2-form-dat-lich</code></td><td>#6</td></tr>
<tr><td>#3 API đặt lịch, chặn trùng giờ</td><td>Cường</td><td><code>feat/3-api-dat-lich</code></td><td>#7</td></tr>
<tr><td>#4 Hướng dẫn cài và chạy</td><td>Trang</td><td><code>docs/4-huong-dan</code></td><td>#8</td></tr>
</tbody>
</table>
<p>Vì sao pull request bắt đầu từ #5? Trên GitHub, issue và pull request dùng chung MỘT dãy số trong mỗi repo — issue #1–#4 đã lấy bốn số đầu. Cường cũng tạo một project trong tổ chức (Projects → New project, bố cục Board — bảng Kanban) và thêm bốn issue vào. Hai workflow (luồng tự động) mặc định của nó, theo docs.github.com ("Using the built-in automations", 09/2026), đúng thứ nhóm sinh viên cần: item bị <strong>đóng</strong> thì trạng thái thành <strong>Done</strong>, và pull request được <strong>merge</strong> thì trạng thái thành <strong>Done</strong>.</p>

<h3>Mọi người lấy repo về</h3>
<pre><code class="language-bash">git clone &lt;URL của repo&gt; phong-kham &amp;&amp; cd phong-kham
git config user.name "Huy Nguyen"      <span class="tok-comment"># mỗi người, tên và email của chính mình</span>
git log --oneline</code></pre>
<div class="out">b10dacc ci: chạy lint + test cho mọi pull request
a97c247 docs: quy ước làm việc nhóm — CONTRIBUTING, mẫu issue/PR, CODEOWNERS
0fd7fe1 chore: khởi tạo dự án phong-kham</div>

<h3>Huy: issue #1, từ nhánh tới pull request</h3>
<pre><code class="language-bash">git switch -c feat/1-khung-gio</code></pre>
<div class="out">Switched to a new branch 'feat/1-khung-gio'</div>
<p>Huy thêm giờ nghỉ trưa vào cấu hình — một dòng ở CUỐI <code>src/config.js</code> — viết <code>src/lich.js</code>, rồi commit mã và test thành hai commit riêng:</p>
<pre><code class="language-javascript"><span class="tok-comment">// thêm vào cuối src/config.js</span>
export const NGHI_TRUA = ['12:00', '13:00'];</code></pre>
<pre><code class="language-bash">git commit -m "feat(lich): tính các khung giờ trống trong ngày"
git commit -m "test(lich): kiểm số khung giờ và giờ đã đặt"
git log --oneline -2
npm test 2&gt;&amp;1 | grep -E "^# (tests|pass|fail)"
git push -u origin feat/1-khung-gio</code></pre>
<div class="out">81804c4 test(lich): kiểm số khung giờ và giờ đã đặt
119d551 feat(lich): tính các khung giờ trống trong ngày
# tests 4
# pass 4
# fail 0
 * [new branch]      feat/1-khung-gio -&gt; feat/1-khung-gio
branch 'feat/1-khung-gio' set up to track 'origin/feat/1-khung-gio'.</div>
<p>Trên GitHub, Huy mở pull request #5 vào <code>main</code>. Mẫu điền sẵn phần thân; Huy viết nốt và giữ dòng <code>Closes #1</code>. (Từ terminal, bước này là <code>gh pr create --fill</code>, Chương 11.1.) Giờ ruleset lo phần còn lại: CI chạy, và CODEOWNERS tự mời Cường review vì thay đổi nằm trong <code>/src/</code>.</p>

<h3>Linh, Cường và Trang làm y như vậy</h3>
<pre><code class="language-bash"><span class="tok-comment"># Linh — 1/9, 14:00</span>
git switch -c feat/2-form-dat-lich
git commit -m "feat(ui): form đặt lịch khám"          <span class="tok-comment"># → e6b5eb7, PR #6</span>
<span class="tok-comment"># Cường — 2/9, 09:00: src/dat-lich.js + test, và MỘT dòng ở cuối src/config.js</span>
git switch -c feat/3-api-dat-lich
git commit -m "feat(api): đặt lịch hẹn, chặn trùng giờ"  <span class="tok-comment"># → ada4c25, PR #7</span>
<span class="tok-comment"># Trang — 2/9, 10:00</span>
git switch -c docs/4-huong-dan
git commit -m "docs: hướng dẫn cài và chạy thử"          <span class="tok-comment"># → def05f0, PR #8</span></code></pre>
<p>Dòng duy nhất Cường thêm vào <code>src/config.js</code> là <code>export const SO_LICH_TOI_DA = 3;</code> (mỗi số điện thoại tối đa ba lịch) — nối vào cuối file. Huy cũng nối dòng của mình vào đúng chỗ đó. Chưa ai biết.</p>

<h3>Review, CI, squash merge</h3>
${slide('git-16', 9, 'Vòng đời một việc: issue → PR → squash')}
<p>Sáng thứ Năm, Cường duyệt #5, CI xanh, Huy bấm <strong>Squash and merge</strong>. GitHub gộp hai commit của nhánh thành MỘT commit mới trên <code>main</code>, tác giả là Huy, committer là GitHub; đóng issue #1 (PR nhắm vào nhánh mặc định và có <code>Closes #1</code>) và chuyển thẻ sang Done. Trong mô phỏng, bản clone "GitHub" làm đúng việc đó:</p>
<pre><code class="language-bash"><span class="tok-comment"># việc nút Squash and merge làm — ở đây do bản clone "github" chạy, không phải bạn</span>
git merge --squash origin/feat/1-khung-gio
GIT_AUTHOR_NAME="Huy Nguyen" GIT_AUTHOR_EMAIL=huy@example.com \\
GIT_COMMITTER_NAME=GitHub GIT_COMMITTER_EMAIL=noreply@github.com \\
  git commit -m "feat(lich): khung giờ trống trong ngày (#5)" -m "Closes #1"
git push origin main &amp;&amp; git push origin --delete feat/1-khung-gio
<span class="tok-comment"># … rồi y như vậy với #8 của Trang buổi chiều</span>
git log --oneline -3 origin/main</code></pre>
<div class="out">6aa8d69 docs: hướng dẫn cài và chạy thử (#8)
0d838d5 feat(lich): khung giờ trống trong ngày (#5)
b10dacc ci: chạy lint + test cho mọi pull request</div>
<p>#6 của Linh thì khác: Huy để lại <strong>Request changes</strong> (yêu cầu sửa) — ô số điện thoại nên là <code>type="tel"</code> kèm pattern. Linh KHÔNG mở pull request mới; bạn ấy push thêm một commit lên đúng nhánh đó, và pull request tự cập nhật:</p>
<pre><code class="language-bash">git commit -m "fix(ui): ô số điện thoại kiểu tel, kiểm 10 số" &amp;&amp; git push
git log --oneline -2</code></pre>
<div class="out">da49255 fix(ui): ô số điện thoại kiểu tel, kiểm 10 số
e6b5eb7 feat(ui): form đặt lịch khám</div>
<p>9 giờ sáng thứ Sáu, #6 được squash merge. Hai commit thành một, và lời nhắn mặc định của GitHub giữ lại danh sách những gì đã được gộp (mặc định cụ thể tuỳ thiết lập của repo — docs.github.com, "Pull request merges"):</p>
<pre><code class="language-bash">git show -s --format=fuller 23ba455</code></pre>
<div class="out">commit 23ba455faf6b742633b0d782c12f9827641c65d9
Author:     Linh Tran &lt;linh@example.com&gt;
AuthorDate: Fri Sep 4 09:00:00 2026 +0700
Commit:     GitHub &lt;noreply@github.com&gt;
CommitDate: Fri Sep 4 09:00:00 2026 +0700

    feat(ui): form đặt lịch khám (#6)

    Closes #2

    * feat(ui): form đặt lịch khám
    * fix(ui): ô số điện thoại kiểu tel, kiểm 10 số</div>

<h3>Cả sprint trên một đồ thị</h3>
${slide('git-16', 10, 'Sprint 1: bốn người, bốn làn, một main')}
<p>Nhìn xem squash đã làm gì với đồ thị. Các commit phát sáng trên <code>main</code> mỗi cái có đúng MỘT cha — commit trước đó của <code>main</code>. Các commit trên nhánh (<code>119d551</code>, <code>81804c4</code>, <code>e6b5eb7</code>, <code>da49255</code>…) không bao giờ trở thành tổ tiên của <code>main</code>: <em>nội dung</em> của chúng được chép vào một commit mới, còn <em>lịch sử</em> thì không được nối vào. Nhớ điều này — nó giải thích một lời báo bạn sẽ gặp ở cuối bài.</p>

<h3>10 giờ sáng thứ Sáu — một xung đột thật</h3>
<p>Pull request #7 giờ báo "This branch has conflicts that must be resolved" (nhánh có xung đột cần giải). Cường cập nhật nhánh của mình từ <code>main</code> ngay trên laptop:</p>
${slide('git-16', 11, 'Xung đột thật trong config.js')}
<pre><code class="language-bash">git fetch origin
git merge origin/main</code></pre>
<div class="out">   b10dacc..23ba455  main       -&gt; origin/main
Auto-merging src/config.js
CONFLICT (content): Merge conflict in src/config.js
Automatic merge failed; fix conflicts and then commit the result.</div>
<pre><code class="language-bash">git status --short
cat src/config.js</code></pre>
<div class="out">M  README.md
A  docs/HUONG-DAN.md
A  public/index.html
UU src/config.js
A  src/lich.js
A  test/lich.test.js
// Cấu hình phòng khám
export const GIO_MO = '08:00';
export const GIO_DONG = '17:00';
export const SLOT_PHUT = 30;
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
export const SO_LICH_TOI_DA = 3;
=======
export const NGHI_TRUA = ['12:00', '13:00'];
&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main</div>
<p>Đọc theo cách Chương 3.3 đã dạy: mọi thứ đã gộp êm đều đã được stage (<code>M</code>, <code>A</code>); chỉ <code>src/config.js</code> là <code>UU</code> (cả hai phía cùng sửa). Hai người thêm hai dòng khác nhau vào cùng một chỗ, nên Git không biết thứ tự. Đây KHÔNG phải xung đột kiểu "chọn một" — file cần <strong>cả hai</strong> dòng. Cường xoá ba dòng đánh dấu, giữ cả hai hằng số, rồi kiểm kết quả bằng combined diff (diff kết hợp) trước khi stage:</p>
<pre><code class="language-bash">git diff</code></pre>
<div class="out">diff --cc src/config.js
index c7749e2,b88bb86..0000000
--- a/src/config.js
+++ b/src/config.js
@@@ -2,4 -2,4 +2,5 @@@
  export const GIO_MO = '08:00';
  export const GIO_DONG = '17:00';
  export const SLOT_PHUT = 30;
+ export const NGHI_TRUA = ['12:00', '13:00'];
 +export const SO_LICH_TOI_DA = 3;</div>
<p>Hai cột dấu <code>+</code>: cột thứ nhất là "thêm so với phía mình", cột thứ hai là "so với <code>main</code>" — mỗi dòng đến từ một phía, không gì khác bị đổi. Rồi tới bước sinh viên hay bỏ: <strong>chạy test trước khi commit lần merge</strong>, vì "hết dấu xung đột" không có nghĩa là "chạy đúng".</p>
<pre><code class="language-bash">git add src/config.js &amp;&amp; npm test 2&gt;&amp;1 | grep -E "^# (tests|pass|fail)"
git commit --no-edit
git log --oneline --graph -6
git push</code></pre>
<div class="out"># tests 6
# pass 6
# fail 0
*   fbd3aaf Merge remote-tracking branch 'origin/main' into feat/3-api-dat-lich
|\\
| * 23ba455 feat(ui): form đặt lịch khám (#6)
| * 6aa8d69 docs: hướng dẫn cài và chạy thử (#8)
| * 0d838d5 feat(lich): khung giờ trống trong ngày (#5)
* | ada4c25 feat(api): đặt lịch hẹn, chặn trùng giờ
|/
* b10dacc ci: chạy lint + test cho mọi pull request
   ada4c25..fbd3aaf  feat/3-api-dat-lich -&gt; feat/3-api-dat-lich</div>
<p>Vì sao merge mà không rebase? Nhánh đã push và có một pull request đang mở mà Huy đã bình luận. Merge <code>main</code> vào nhánh chỉ thêm một commit và chỉ cần <code>git push</code> thường. Rebase sẽ viết lại <code>ada4c25</code> và buộc phải <code>--force-with-lease</code> (Chương 8.2) — được phép trên nhánh của chính mình, nhưng là thêm một chỗ để sai. Với squash merge, merge commit thừa đó chẳng tốn gì: nó biến mất khi pull request được squash.</p>

<h3>Sau khi merge: main thẳng tắp, và nhánh phải dọn</h3>
<pre><code class="language-bash">git switch main &amp;&amp; git pull
git log --format="%h %&lt;(12)%an %&lt;(12)%cn %s" main</code></pre>
<div class="out">170a83c Cuong Hoang  GitHub       feat(api): đặt lịch hẹn, chặn trùng giờ (#7)
23ba455 Linh Tran    GitHub       feat(ui): form đặt lịch khám (#6)
6aa8d69 Trang Le     GitHub       docs: hướng dẫn cài và chạy thử (#8)
0d838d5 Huy Nguyen   GitHub       feat(lich): khung giờ trống trong ngày (#5)
b10dacc Cuong Hoang  Cuong Hoang  ci: chạy lint + test cho mọi pull request
a97c247 Cuong Hoang  Cuong Hoang  docs: quy ước làm việc nhóm — CONTRIBUTING, mẫu issue/PR, CODEOWNERS
0fd7fe1 Cuong Hoang  Cuong Hoang  chore: khởi tạo dự án phong-kham</div>
<p>Mỗi pull request một commit, mỗi commit mang số pull request của nó, và ghi công đúng người viết. <code>git show --stat 170a83c</code> chỉ liệt kê đúng ba file của Cường — merge commit bạn ấy tạo trên nhánh không để lại dấu vết nào. Giờ tới nhánh ở máy:</p>
<pre><code class="language-bash">git fetch --prune
git branch -vv
git branch -d feat/3-api-dat-lich
git branch -D feat/3-api-dat-lich</code></pre>
<div class="out"> - [deleted]         (none)     -&gt; origin/feat/3-api-dat-lich
  feat/3-api-dat-lich fbd3aaf [origin/feat/3-api-dat-lich: gone] Merge remote-tracking branch 'origin/main' into feat/3-api-dat-lich
* main                170a83c [origin/main] feat(api): đặt lịch hẹn, chặn trùng giờ (#7)
error: the branch 'feat/3-api-dat-lich' is not fully merged
hint: If you are sure you want to delete it, run 'git branch -D feat/3-api-dat-lich'
Deleted branch feat/3-api-dat-lich (was fbd3aaf).</div>
<p>"Not fully merged" (chưa được merge hết) ở đây là đúng và vô hại: sau squash, các commit của nhánh không phải tổ tiên của <code>main</code> (đồ thị ở trên). Quy trình an toàn: <code>git fetch --prune</code>, tìm chữ <code>: gone</code> (đã mất) trong <code>git branch -vv</code>, kiểm pull request đã hiện <strong>Merged</strong>, rồi mới <code>-D</code>. Lỡ xoá sớm thì mã băm trong <code>(was fbd3aaf)</code> và reflog đưa nó về (Chương 4.4).</p>

<h3>Cái bảng tự chạy, không ai phải kéo thẻ</h3>
${slide('git-16', 12, 'Bảng Projects chạy theo issue và PR')}
<p>Lúc 15 giờ thứ Năm, bảng đã nói đúng sự thật: #1 và #4 ở Done (pull request đã merge), #2 và #3 đang review — một cái bị yêu cầu sửa, một cái đang xung đột. Không ai kéo thẻ bằng tay; bước thủ công duy nhất là kéo issue sang In Progress khi bắt đầu, và nhiều nhóm bỏ luôn bước đó bằng cách mở draft pull request (PR nháp) từ sớm (Chương 6.1).</p>

<div class="pitfall co-tieu-de"><strong>Sprint hỏng thế nào trong nhóm sinh viên.</strong> <b>Giải xung đột bằng trình sửa trên web GitHub mà không chạy gì.</b> Dấu xung đột biến mất, nút chuyển xanh, và <code>main</code> nhận một file không chạy nổi — trình sửa trên web không chạy test của bạn. Giải ở máy, chạy <code>npm test</code>, rồi mới push. <b>"Giữ của mình" theo phản xạ.</b> Trong vụ xung đột ở trên, cả hai dòng đều cần; chọn một phía là âm thầm xoá mất giờ nghỉ trưa của Huy. <b>Mở pull request thứ hai để sửa theo review.</b> Push lên đúng nhánh cũ; review, lịch sử CI và thảo luận ở một chỗ. <b>Xoá nhánh bằng <code>-D</code> trước khi pull request được merge</b> — kiểm <code>: gone</code> trước.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Dựng một nhóm bốn người của riêng bạn: <code>git init --bare origin.git</code>, rồi clone nó bốn lần (<code>cuong</code>, <code>huy</code>, <code>linh</code>, <code>trang</code>) và đặt cho mỗi bản clone một <code>git config user.name</code> riêng. Từ <code>cuong</code>, commit một file <code>config.js</code> ba dòng và push <code>main</code>.</li><li>Trong <code>huy</code> và trong <code>cuong</code>, mỗi người tạo một nhánh tính năng và nối một dòng <strong>khác nhau</strong> vào cuối <code>config.js</code>; commit và push cả hai nhánh.</li><li>Đóng vai GitHub cho Huy: trong bản clone thứ năm, <code>git merge --squash origin/&lt;nhánh của huy&gt;</code>, commit với <code>--author</code>, push <code>main</code>.</li><li>Trong <code>cuong</code>: <code>git fetch</code>, <code>git merge origin/main</code>, giải bằng cách giữ cả hai dòng, kiểm bằng <code>git diff</code>, commit, push; rồi squash merge nhánh của Cường.</li><li>Trong <code>cuong</code>: <code>git fetch --prune</code>, <code>git branch -vv</code>, rồi thử <code>git branch -d</code> với nhánh đã merge và giải thích lời báo.</li></ol>
<p><strong>Đạt khi:</strong> <code>git log --oneline --graph main</code> là một đường thẳng chứa hai tính năng, mỗi cái một commit; <code>config.js</code> trên <code>main</code> có cả hai dòng mới; và bạn giải thích được vì sao <code>git branch -d</code> từ chối.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Sprint</span><span class="v">Vòng làm việc — một khoảng ngắn, cố định (ở đây 1–4/9) để nhóm làm xong một nhóm issue đã chọn.</span></div>
  <div class="kv"><span class="k">Squash and merge</span><span class="v">Gộp-nén rồi merge — GitHub đưa cả pull request vào nhánh đích thành MỘT commit mới; commit trên nhánh không được nối vào lịch sử.</span></div>
  <div class="kv"><span class="k">Request changes</span><span class="v">Yêu cầu sửa — kết luận review chặn merge cho tới khi tác giả push bản sửa và người review duyệt.</span></div>
  <div class="kv"><span class="k">Closing keyword</span><span class="v">Từ khoá đóng issue — <code>Closes #1</code> (hoặc <code>fixes</code>, <code>resolves</code>) trong PR vào nhánh mặc định sẽ đóng issue khi merge.</span></div>
  <div class="kv"><span class="k">Combined diff</span><span class="v">Diff kết hợp — bản <code>diff --cc</code> hai cột hiện trong lúc merge: mỗi phía một cột <code>+</code>/<code>-</code>.</span></div>
  <div class="kv"><span class="k"><code>: gone</code></span><span class="v">Đã mất — chữ <code>git branch -vv</code> in ra khi bản trên remote của nhánh đã bị xoá; tín hiệu có thể dọn nhánh.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một issue, một nhánh, một pull request: số issue đi xuyên qua tên nhánh, dòng <code>Closes #</code> và commit squash.</li><li>Sửa theo review là commit mới trên đúng nhánh cũ; pull request tự cập nhật.</li><li>Cập nhật một nhánh đã push đang bị xung đột: merge <code>main</code> vào nhánh, giải, chạy test, rồi push — không cần force.</li><li>Squash merge cho một <code>main</code> thẳng, mỗi pull request một commit, ghi công đúng tác giả.</li><li>Sau squash, <code>git branch -d</code> báo "not fully merged" là đúng thiết kế; kiểm <code>: gone</code> và nhãn Merged rồi dùng <code>-D</code>.</li></ul>

<a class="link-card" href="https://docs.github.com/en/pull-requests/reference/pull-request-merges" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Pull request merges</span><span class="lc-sub">Merge commit, squash and merge, rebase and merge; lời nhắn của commit squash.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Linking a pull request to an issue</span><span class="lc-sub">Từ khoá đóng issue, và vì sao PR phải nhắm nhánh mặc định.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-built-in-automations" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Using the built-in automations</span><span class="lc-sub">Đóng → Done, merge → Done, và các workflow khác của Projects.</span></span>
</a>
<p class="note-ct"><strong>Nghĩ về nó thế này:</strong> một sprint không phải bốn người cùng viết code; nó là bốn dòng commit cùng đổ về một <code>main</code>. Phần lớn kỹ năng nằm ở chỗ gặp nhau đó — nhánh nhỏ, pull request mở sớm, và giải xung đột trên chính laptop của mình, nơi test chạy được.</p>
</div>
`,
    },

    /* ─────────────────────────── 16.3 ─────────────────────────── */
    {
      title: '16.3 — Shipping the submission: tag v1.0.0, release notes, and a hotfix from the tag|||16.3 — Chốt bản nộp: tag v1.0.0, release notes, và hotfix từ tag',
      slug: 'git-16-3-phat-hanh-hotfix',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Chốt bản nộp đồ án: release notes lấy từ lịch sử, CHANGELOG, tag có chú thích v1.0.0 và GitHub Release; lỗi phát hiện sau khi nộp → nhánh hotfix tách từ tag → v1.0.1; cherry-pick -x bản sửa về main đang phát triển tiếp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.3</span>
<h2>Freeze what you hand in, and fix it without shipping half-finished work</h2>
<p class="lead">On Friday 18 September team 5 submits. The lecturer will clone the repository and grade "the submitted version" — which only means something if that version has a name that never moves. Three days later a bug turns up, while <code>main</code> already contains a new feature nobody has reviewed for grading. This lesson is Chapter 7 (tags, releases, hotfixes) done for real.</p>

<h3>Timeline of the release</h3>
${slide('git-16', 3, 'Ba tuần của nhóm 5 — trục thời gian')}
<p>After sprint 1, sprint 2 added two more squash-merged pull requests (#10, the "booked appointments" page, and #12, a test for the three-bookings limit). Before freezing, Cường checks that <code>main</code> is green and reads the whole history once:</p>
<pre><code class="language-bash">git switch main &amp;&amp; git pull
npm test 2&gt;&amp;1 | grep -E "^# (tests|pass|fail)"
git log --oneline</code></pre>
<div class="out"># tests 7
# pass 7
# fail 0
c6bebcb test: giới hạn 3 lịch mỗi số điện thoại (#12)
bca4107 feat(ui): trang xem lịch đã đặt (#10)
170a83c feat(api): đặt lịch hẹn, chặn trùng giờ (#7)
23ba455 feat(ui): form đặt lịch khám (#6)
6aa8d69 docs: hướng dẫn cài và chạy thử (#8)
0d838d5 feat(lich): khung giờ trống trong ngày (#5)
b10dacc ci: chạy lint + test cho mọi pull request
a97c247 docs: quy ước làm việc nhóm — CONTRIBUTING, mẫu issue/PR, CODEOWNERS
0fd7fe1 chore: khởi tạo dự án phong-kham</div>

<h3>Release notes come from the history — if the history is good</h3>
<p>This is where two weeks of Conventional Commits and squash merges pay off. The raw material for the release notes is one command:</p>
<pre><code class="language-bash">git log --format="- %s" --reverse</code></pre>
<div class="out">- chore: khởi tạo dự án phong-kham
- docs: quy ước làm việc nhóm — CONTRIBUTING, mẫu issue/PR, CODEOWNERS
- ci: chạy lint + test cho mọi pull request
- feat(lich): khung giờ trống trong ngày (#5)
- docs: hướng dẫn cài và chạy thử (#8)
- feat(ui): form đặt lịch khám (#6)
- feat(api): đặt lịch hẹn, chặn trùng giờ (#7)
- feat(ui): trang xem lịch đã đặt (#10)
- test: giới hạn 3 lịch mỗi số điện thoại (#12)</div>
<p>Every line has a type and a pull request number. A human still has to turn that into something a reader wants — group by kind, drop the plumbing, say what changed for the user. That is <code>CHANGELOG.md</code>, in the "Keep a Changelog" format from Chapter 7.3:</p>
<pre><code class="language-markdown"># Changelog

## [1.0.0] — 2026-09-18 (bản nộp SWP391)
### Thêm
- Khung giờ trống trong ngày, bỏ giờ nghỉ trưa (#5)
- Form đặt lịch khám, kiểm số điện thoại (#6)
- Đặt lịch hẹn: chặn trùng giờ, tối đa 3 lịch mỗi số (#7, #12)
- Trang xem lịch đã đặt (#10)
- Hướng dẫn cài và chạy thử (#8)</code></pre>
<p><code>main</code> is protected, so even the release commit — the changelog plus <code>"version": "1.0.0"</code> in <code>package.json</code> — goes through a pull request (#13). That is a feature, not bureaucracy: a teammate reads the changelog before the lecturer does.</p>

<h3>Tag v1.0.0 — a name that never moves</h3>
<pre><code class="language-bash">git switch main &amp;&amp; git pull
git log --oneline -1
git tag -a v1.0.0 -m "Bản nộp SWP391 — đặt lịch phòng khám"
git push origin v1.0.0
git show v1.0.0 --no-patch</code></pre>
<div class="out">f76a7bb chore: phát hành 1.0.0 (#13)
 * [new tag]         v1.0.0 -&gt; v1.0.0
tag v1.0.0
Tagger: Cuong Hoang &lt;cuong@example.com&gt;
Date:   Fri Sep 18 16:40:00 2026 +0700

Bản nộp SWP391 — đặt lịch phòng khám

commit f76a7bb1677ae2acd87bf95f68e7d272ea7a6f18
Author: Cuong Hoang &lt;cuong@example.com&gt;
Date:   Fri Sep 18 16:30:00 2026 +0700

    chore: phát hành 1.0.0 (#13)</div>
<p>Three habits from Chapter 7.2 matter here. <strong>Annotated</strong> (<code>-a</code>), so the tag records who froze the version, when and why. <strong>Tag after pulling</strong>, so the tag points at the squash commit that is on GitHub — not at a local commit that the merge replaced. <strong>Push the tag explicitly</strong>: <code>git push</code> alone does not send tags (Chapter 5.3). The submission form then gets a link that pins the code: <code>…/tree/v1.0.0</code>.</p>
<p>On GitHub, turn the tag into a <strong>Release</strong>: Releases → <strong>Draft a new release</strong> → <strong>Choose a tag</strong> <code>v1.0.0</code> → <strong>Generate release notes</strong> (GitHub lists the merged pull requests and contributors since the previous release) → edit → <strong>Publish release</strong> (docs.github.com, "Automatically generated release notes", 09/2026). From the terminal: <code>gh release create v1.0.0 --generate-notes</code>. Optionally add a <strong>tag ruleset</strong> on <code>v*</code> with <strong>Restrict updates</strong> and <strong>Restrict deletions</strong>, so nobody can quietly move <code>v1.0.0</code> after the deadline.</p>

<h3>Monday: main moved on — then a bug report</h3>
<p>On Sunday 20 September Linh's pull request #14 ("cancel an appointment") is merged into <code>main</code>. On Monday morning a tester reports issue #15 with the "Báo lỗi" form: the clinic is closed on Sundays, yet booking Sunday 20 September is accepted. The form asks for the version — <code>git describe --tags</code> on the submitted code answers <code>v1.0.0</code>. Cường reproduces it on exactly that version:</p>
<pre><code class="language-bash">git fetch
git switch --detach v1.0.0
node -e 'import("./src/dat-lich.js").then(m =&gt; console.log(m.datLich([], {ten:"An", sdt:"0901234567", ngay:"2026-09-20", gio:"09:00"})))'</code></pre>
<div class="out">{ ten: 'An', sdt: '0901234567', ngay: '2026-09-20', gio: '09:00' }</div>

<h3>Hotfix from the tag, not from main</h3>
${slide('git-16', 13, 'v1.0.0 → hotfix v1.0.1 → cherry-pick về main')}
<p>The fix must not be built on <code>main</code>: <code>main</code> now contains #14, which was never part of the graded version. <code>v1.0.1</code> must be <em>exactly</em> <code>v1.0.0</code> plus the fix. So the hotfix branch starts from the tag:</p>
<pre><code class="language-bash">git switch -c hotfix/1.0.1 v1.0.0</code></pre>
<div class="out">Switched to a new branch 'hotfix/1.0.1'</div>
<p>One line in <code>datLich</code> and one test that reproduces the report:</p>
<pre><code class="language-diff">diff --git a/src/dat-lich.js b/src/dat-lich.js
index 5c96aff..171b301 100644
--- a/src/dat-lich.js
+++ b/src/dat-lich.js
@@ -2,6 +2,7 @@ import { SO_LICH_TOI_DA } from './config.js';
 
 // Thêm một lịch hẹn vào danh sách ds; ném lỗi nếu không hợp lệ.
 export function datLich(ds, { ten, sdt, ngay, gio }) {
+  if (new Date(ngay + "T00:00").getDay() === 0) throw new Error("Phòng khám nghỉ Chủ nhật");
   if (!ten || !/^0\\d{9}$/.test(sdt)) throw new Error('Thiếu tên hoặc số điện thoại sai');
   if (ds.some((l) =&gt; l.ngay === ngay &amp;&amp; l.gio === gio)) throw new Error(&#96;Giờ &#36;{gio} ngày &#36;{ngay} đã có người đặt&#96;);
   if (ds.filter((l) =&gt; l.sdt === sdt).length &gt;= SO_LICH_TOI_DA) throw new Error('Quá số lịch cho phép');</code></pre>
<pre><code class="language-bash">npm test 2&gt;&amp;1 | grep -E "^# (tests|pass|fail)"
git commit -m "fix(dat-lich): chặn đặt lịch vào Chủ nhật" -m "Closes #15"
git log --oneline -1</code></pre>
<div class="out"># tests 8
# pass 8
# fail 0
0cec9a9 fix(dat-lich): chặn đặt lịch vào Chủ nhật</div>
<p>The same <code>node -e</code> line now stops with <code>Error: Phòng khám nghỉ Chủ nhật</code> instead of accepting the booking. Then the release commit — version 1.0.1 and a changelog entry — and the tag. By semantic versioning (Chapter 7.2) a bug fix that changes no interface is a <strong>patch</strong>: 1.0.0 → 1.0.1.</p>
<pre><code class="language-bash">git commit -m "chore: phát hành 1.0.1"
git tag -a v1.0.1 -m "Sửa lỗi: không nhận lịch Chủ nhật"
git push -u origin hotfix/1.0.1
git push origin v1.0.1
git log --oneline --graph --decorate v1.0.1 main -9</code></pre>
<div class="out"> * [new tag]         v1.0.1 -&gt; v1.0.1
* d131916 (HEAD -&gt; hotfix/1.0.1, tag: v1.0.1, origin/hotfix/1.0.1) chore: phát hành 1.0.1
* 0cec9a9 fix(dat-lich): chặn đặt lịch vào Chủ nhật
* f76a7bb (tag: v1.0.0, main) chore: phát hành 1.0.0 (#13)
* c6bebcb test: giới hạn 3 lịch mỗi số điện thoại (#12)
* bca4107 feat(ui): trang xem lịch đã đặt (#10)
* 170a83c feat(api): đặt lịch hẹn, chặn trùng giờ (#7)
* 23ba455 feat(ui): form đặt lịch khám (#6)
* 6aa8d69 docs: hướng dẫn cài và chạy thử (#8)
* 0d838d5 feat(lich): khung giờ trống trong ngày (#5)</div>
<p>(The local <code>main</code> label still sits on <code>f76a7bb</code> because Cường has not pulled since Friday; <code>origin/main</code> already has #14.) The hotfix branch is not covered by the <code>main</code> ruleset, so ask one teammate to read the two commits before you tag — a hotfix is exactly when people skip review and ship a second bug.</p>

<h3>Bring the fix back to main: cherry-pick -x</h3>
<p>If the fix only lives on <code>hotfix/1.0.1</code>, the next release built from <code>main</code> brings the Sunday bug back — a regression. Cường copies the one fix commit onto a fresh branch from <code>main</code> and opens a normal pull request:</p>
<pre><code class="language-bash">git switch main &amp;&amp; git pull
git switch -c fix/15-chu-nhat
git cherry-pick -x 0cec9a9
git log -1 --format=%B</code></pre>
<div class="out">Switched to a new branch 'fix/15-chu-nhat'
Auto-merging src/dat-lich.js
[fix/15-chu-nhat f7e4a44] fix(dat-lich): chặn đặt lịch vào Chủ nhật
 Date: Mon Sep 21 08:30:00 2026 +0700
 2 files changed, 4 insertions(+)
fix(dat-lich): chặn đặt lịch vào Chủ nhật

Closes #15

(cherry picked from commit 0cec9a9adc84b189d7d18217a18ceba66f943f0f)</div>
<p><code>Auto-merging src/dat-lich.js</code> is Git applying the change on top of Linh's new <code>huyLich</code> function in the same file — different lines, so no conflict. <code>-x</code> writes the origin into the message, so anyone reading <code>main</code> can find the hotfix commit it came from (Chapter 7.3). Why not merge the whole hotfix branch into <code>main</code>? That would also bring "chore: phát hành 1.0.1" — a version bump that belongs to the hotfix line, not necessarily to what <code>main</code> will release next. Cherry-pick takes exactly the fix; the changelog on <code>main</code> gets its 1.0.1 entry in the next release pull request.</p>
<p>After review and CI, pull request #16 is squash-merged. The final picture:</p>
<pre><code class="language-bash">git log --oneline --graph --decorate --all -12</code></pre>
<div class="out">* 364e32a (HEAD -&gt; main, origin/main, origin/HEAD) fix(dat-lich): chặn đặt lịch vào Chủ nhật (#16)
* a412cdc feat(api): huỷ lịch hẹn (#14)
| * d131916 (tag: v1.0.1, origin/hotfix/1.0.1, hotfix/1.0.1) chore: phát hành 1.0.1
| * 0cec9a9 fix(dat-lich): chặn đặt lịch vào Chủ nhật
|/
* f76a7bb (tag: v1.0.0) chore: phát hành 1.0.0 (#13)
* c6bebcb test: giới hạn 3 lịch mỗi số điện thoại (#12)
* bca4107 feat(ui): trang xem lịch đã đặt (#10)
* 170a83c feat(api): đặt lịch hẹn, chặn trùng giờ (#7)
* 23ba455 feat(ui): form đặt lịch khám (#6)
* 6aa8d69 docs: hướng dẫn cài và chạy thử (#8)
* 0d838d5 feat(lich): khung giờ trống trong ngày (#5)
* b10dacc ci: chạy lint + test cho mọi pull request</div>
<pre><code class="language-bash">git tag -l -n1
git describe --tags main; git describe --tags hotfix/1.0.1
git log --oneline v1.0.0..v1.0.1</code></pre>
<div class="out">v1.0.0          Bản nộp SWP391 — đặt lịch phòng khám
v1.0.1          Sửa lỗi: không nhận lịch Chủ nhật
v1.0.0-2-g364e32a
v1.0.1
d131916 chore: phát hành 1.0.1
0cec9a9 fix(dat-lich): chặn đặt lịch vào Chủ nhật</div>
<p>Read the answers: <code>main</code> is "two commits after v1.0.0" (it does not contain the <code>v1.0.1</code> tag commit, only a copy of the fix); the hotfix branch is exactly <code>v1.0.1</code>; and <code>v1.0.0..v1.0.1</code> is precisely the fix plus the version bump — nothing from #14 leaked into the patch release. That last command is what you show the lecturer.</p>

<div class="pitfall co-tieu-de"><strong>How releases go wrong in student teams.</strong> <b>Tagging the local commit before pulling.</b> With squash merge, your local branch tip is not what landed on <code>main</code>; the tag points at a commit GitHub does not have. Pull, then tag. <b>Moving a tag after the deadline.</b> <code>git tag -f v1.0.0</code> plus a force-push of the tag: everyone who already fetched keeps the old one, and "which v1.0.0 did you grade?" has no answer. Make a new version instead. <b>Hotfix from <code>main</code>.</b> The patch release silently ships the unfinished feature merged after submission. <b>Forgetting to port the fix.</b> The next release reintroduces the bug; <code>git log --grep="cherry picked from"</code> on <code>main</code> should find every hotfix.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In your four-clone team from 16.2 (or in <code>thu-git</code>), write a <code>CHANGELOG.md</code> from <code>git log --format="- %s" --reverse</code>, commit it, and create an annotated tag <code>v1.0.0</code>; push it with <code>git push origin v1.0.0</code>.</li><li>Merge one more small change into <code>main</code> (a "feature after submission").</li><li>Create <code>hotfix/1.0.1</code> from <code>v1.0.0</code>, fix something with a test, commit, and tag <code>v1.0.1</code>.</li><li>Branch from <code>main</code>, <code>git cherry-pick -x</code> the fix, and merge it back.</li><li>Run <code>git log --oneline v1.0.0..v1.0.1</code> and <code>git describe --tags main</code>.</li></ol>
<p><strong>Done when:</strong> <code>v1.0.0..v1.0.1</code> lists only the fix (and a version bump if you made one), <code>git show -s main</code> contains "cherry picked from commit", and <code>git tag -l -n1</code> shows two annotated tags with messages.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Annotated tag</span><span class="v">A tag object with tagger, date and message (<code>git tag -a</code>) — the right kind for a release.</span></div>
  <div class="kv"><span class="k">Release notes</span><span class="v">The human summary of what changed in a version; on GitHub, attached to a Release built on a tag.</span></div>
  <div class="kv"><span class="k">CHANGELOG</span><span class="v">A file listing every version and its changes, newest first, grouped by kind.</span></div>
  <div class="kv"><span class="k">Hotfix</span><span class="v">An urgent fix to a released version, built from that version's tag rather than from the development branch.</span></div>
  <div class="kv"><span class="k">Patch version</span><span class="v">The third number in MAJOR.MINOR.PATCH: bug fixes that change no interface.</span></div>
  <div class="kv"><span class="k"><code>cherry-pick -x</code></span><span class="v">Copies one commit onto the current branch and records the original hash in the message.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Good commit messages make release notes almost free: <code>git log --format="- %s"</code> is the raw material, the changelog is the edited version.</li><li>Tag after pulling, annotate the tag, push it explicitly, and never move it — make a new version instead.</li><li>A hotfix starts from the released tag, so the patch contains the fix and nothing that merged after submission.</li><li>Port the fix back to <code>main</code> with <code>cherry-pick -x</code> through a normal pull request, or the next release brings the bug back.</li><li><code>git log v1.0.0..v1.0.1</code> and <code>git describe --tags</code> prove exactly what each version contains.</li></ul>

<a class="link-card" href="https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes" target="_blank" rel="noopener">
  <span class="lc-ico">🏷</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Automatically generated release notes</span><span class="lc-sub">Draft a new release, Choose a tag, Generate release notes.</span></span>
</a>
<a class="link-card" href="https://keepachangelog.com/en/1.1.0/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Keep a Changelog 1.1.0</span><span class="lc-sub">The changelog format used above.</span></span>
</a>
<a class="link-card" href="https://semver.org/" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Semantic Versioning</span><span class="lc-sub">MAJOR.MINOR.PATCH — why a fix is 1.0.1.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-cherry-pick" target="_blank" rel="noopener">
  <span class="lc-ico">🍒</span>
  <span class="lc-body"><span class="lc-title">git-cherry-pick — Git documentation</span><span class="lc-sub">-x, conflicts, --continue / --abort.</span></span>
</a>
<p class="note-ct"><strong>How to think about it:</strong> a version is a promise about content. The tag keeps the promise from moving, the hotfix branch keeps new work out of it, and cherry-pick keeps the fix from being forgotten.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.3</span>
<h2>Đóng băng thứ mình nộp, và sửa nó mà không nộp kèm việc làm dở</h2>
<p class="lead">Thứ Sáu 18/9, nhóm 5 nộp bài. Thầy sẽ clone repo và chấm "bản đã nộp" — câu đó chỉ có nghĩa khi bản ấy có một cái tên không bao giờ dịch chuyển. Ba ngày sau lòi ra một lỗi, trong khi <code>main</code> đã chứa một tính năng mới chưa ai xem để chấm. Bài này là Chương 7 (tag, phát hành, hotfix) làm thật.</p>

<h3>Trục thời gian của bản phát hành</h3>
${slide('git-16', 3, 'Ba tuần của nhóm 5 — trục thời gian')}
<p>Sau sprint 1, sprint 2 thêm hai pull request được squash merge nữa (#10 trang "lịch đã đặt", và #12 một test cho giới hạn ba lịch). Trước khi đóng băng, Cường kiểm <code>main</code> xanh và đọc lại cả lịch sử một lượt:</p>
<pre><code class="language-bash">git switch main &amp;&amp; git pull
npm test 2&gt;&amp;1 | grep -E "^# (tests|pass|fail)"
git log --oneline</code></pre>
<div class="out"># tests 7
# pass 7
# fail 0
c6bebcb test: giới hạn 3 lịch mỗi số điện thoại (#12)
bca4107 feat(ui): trang xem lịch đã đặt (#10)
170a83c feat(api): đặt lịch hẹn, chặn trùng giờ (#7)
23ba455 feat(ui): form đặt lịch khám (#6)
6aa8d69 docs: hướng dẫn cài và chạy thử (#8)
0d838d5 feat(lich): khung giờ trống trong ngày (#5)
b10dacc ci: chạy lint + test cho mọi pull request
a97c247 docs: quy ước làm việc nhóm — CONTRIBUTING, mẫu issue/PR, CODEOWNERS
0fd7fe1 chore: khởi tạo dự án phong-kham</div>

<h3>Release notes lấy từ lịch sử — nếu lịch sử tốt</h3>
<p>Đây là lúc hai tuần Conventional Commits và squash merge được trả công. Nguyên liệu cho release notes (ghi chú phát hành) chỉ là một lệnh:</p>
<pre><code class="language-bash">git log --format="- %s" --reverse</code></pre>
<div class="out">- chore: khởi tạo dự án phong-kham
- docs: quy ước làm việc nhóm — CONTRIBUTING, mẫu issue/PR, CODEOWNERS
- ci: chạy lint + test cho mọi pull request
- feat(lich): khung giờ trống trong ngày (#5)
- docs: hướng dẫn cài và chạy thử (#8)
- feat(ui): form đặt lịch khám (#6)
- feat(api): đặt lịch hẹn, chặn trùng giờ (#7)
- feat(ui): trang xem lịch đã đặt (#10)
- test: giới hạn 3 lịch mỗi số điện thoại (#12)</div>
<p>Dòng nào cũng có loại và số pull request. Vẫn cần một con người biến nó thành thứ người đọc muốn đọc — gom theo loại, bỏ phần ống nước, nói người dùng được gì. Đó là <code>CHANGELOG.md</code> (nhật ký thay đổi), theo định dạng "Keep a Changelog" ở Chương 7.3:</p>
<pre><code class="language-markdown"># Changelog

## [1.0.0] — 2026-09-18 (bản nộp SWP391)
### Thêm
- Khung giờ trống trong ngày, bỏ giờ nghỉ trưa (#5)
- Form đặt lịch khám, kiểm số điện thoại (#6)
- Đặt lịch hẹn: chặn trùng giờ, tối đa 3 lịch mỗi số (#7, #12)
- Trang xem lịch đã đặt (#10)
- Hướng dẫn cài và chạy thử (#8)</code></pre>
<p><code>main</code> đang được bảo vệ, nên ngay cả commit phát hành — changelog cộng <code>"version": "1.0.0"</code> trong <code>package.json</code> — cũng đi qua pull request (#13). Đó là tính năng chứ không phải thủ tục: một bạn trong nhóm đọc changelog trước khi thầy đọc.</p>

<h3>Tag v1.0.0 — một cái tên không bao giờ dịch chuyển</h3>
<pre><code class="language-bash">git switch main &amp;&amp; git pull
git log --oneline -1
git tag -a v1.0.0 -m "Bản nộp SWP391 — đặt lịch phòng khám"
git push origin v1.0.0
git show v1.0.0 --no-patch</code></pre>
<div class="out">f76a7bb chore: phát hành 1.0.0 (#13)
 * [new tag]         v1.0.0 -&gt; v1.0.0
tag v1.0.0
Tagger: Cuong Hoang &lt;cuong@example.com&gt;
Date:   Fri Sep 18 16:40:00 2026 +0700

Bản nộp SWP391 — đặt lịch phòng khám

commit f76a7bb1677ae2acd87bf95f68e7d272ea7a6f18
Author: Cuong Hoang &lt;cuong@example.com&gt;
Date:   Fri Sep 18 16:30:00 2026 +0700

    chore: phát hành 1.0.0 (#13)</div>
<p>Ba thói quen ở Chương 7.2 quan trọng ở đây. <strong>Tag có chú thích</strong> (annotated, <code>-a</code>), để tag ghi lại ai đóng băng phiên bản, lúc nào, vì sao. <strong>Tag sau khi pull</strong>, để tag trỏ vào commit squash đang nằm trên GitHub — không phải một commit ở máy mà lần merge đã thay thế. <strong>Push tag một cách tường minh</strong>: <code>git push</code> trơn không gửi tag (Chương 5.3). Form nộp bài khi đó nhận một đường link ghim chặt mã nguồn: <code>…/tree/v1.0.0</code>.</p>
<p>Trên GitHub, biến tag thành một <strong>Release</strong> (bản phát hành): Releases → <strong>Draft a new release</strong> → <strong>Choose a tag</strong> <code>v1.0.0</code> → <strong>Generate release notes</strong> (GitHub liệt kê các pull request đã merge và người đóng góp kể từ bản trước) → sửa lại → <strong>Publish release</strong> (docs.github.com, "Automatically generated release notes", 09/2026). Từ terminal: <code>gh release create v1.0.0 --generate-notes</code>. Có thể thêm một <strong>tag ruleset</strong> (bộ luật cho tag) nhắm <code>v*</code> với <strong>Restrict updates</strong> và <strong>Restrict deletions</strong>, để không ai lặng lẽ dời <code>v1.0.0</code> sau hạn nộp.</p>

<h3>Thứ Hai: main đã đi tiếp — rồi một báo lỗi</h3>
<p>Chủ nhật 20/9, pull request #14 của Linh ("huỷ lịch hẹn") được merge vào <code>main</code>. Sáng thứ Hai, một bạn kiểm thử báo issue #15 bằng mẫu "Báo lỗi": phòng khám nghỉ Chủ nhật, vậy mà đặt lịch Chủ nhật 20/9 vẫn được nhận. Mẫu hỏi phiên bản — <code>git describe --tags</code> trên mã đã nộp trả lời <code>v1.0.0</code>. Cường tái hiện lỗi trên đúng phiên bản đó:</p>
<pre><code class="language-bash">git fetch
git switch --detach v1.0.0
node -e 'import("./src/dat-lich.js").then(m =&gt; console.log(m.datLich([], {ten:"An", sdt:"0901234567", ngay:"2026-09-20", gio:"09:00"})))'</code></pre>
<div class="out">{ ten: 'An', sdt: '0901234567', ngay: '2026-09-20', gio: '09:00' }</div>

<h3>Hotfix từ tag, không phải từ main</h3>
${slide('git-16', 13, 'v1.0.0 → hotfix v1.0.1 → cherry-pick về main')}
<p>Bản sửa không được dựng trên <code>main</code>: <code>main</code> giờ đã chứa #14, thứ chưa bao giờ nằm trong bản được chấm. <code>v1.0.1</code> phải là <em>đúng</em> <code>v1.0.0</code> cộng bản sửa. Nên nhánh hotfix tách ra từ chính cái tag:</p>
<pre><code class="language-bash">git switch -c hotfix/1.0.1 v1.0.0</code></pre>
<div class="out">Switched to a new branch 'hotfix/1.0.1'</div>
<p>Một dòng trong <code>datLich</code> và một test tái hiện đúng báo lỗi:</p>
<pre><code class="language-diff">diff --git a/src/dat-lich.js b/src/dat-lich.js
index 5c96aff..171b301 100644
--- a/src/dat-lich.js
+++ b/src/dat-lich.js
@@ -2,6 +2,7 @@ import { SO_LICH_TOI_DA } from './config.js';
 
 // Thêm một lịch hẹn vào danh sách ds; ném lỗi nếu không hợp lệ.
 export function datLich(ds, { ten, sdt, ngay, gio }) {
+  if (new Date(ngay + "T00:00").getDay() === 0) throw new Error("Phòng khám nghỉ Chủ nhật");
   if (!ten || !/^0\\d{9}$/.test(sdt)) throw new Error('Thiếu tên hoặc số điện thoại sai');
   if (ds.some((l) =&gt; l.ngay === ngay &amp;&amp; l.gio === gio)) throw new Error(&#96;Giờ &#36;{gio} ngày &#36;{ngay} đã có người đặt&#96;);
   if (ds.filter((l) =&gt; l.sdt === sdt).length &gt;= SO_LICH_TOI_DA) throw new Error('Quá số lịch cho phép');</code></pre>
<pre><code class="language-bash">npm test 2&gt;&amp;1 | grep -E "^# (tests|pass|fail)"
git commit -m "fix(dat-lich): chặn đặt lịch vào Chủ nhật" -m "Closes #15"
git log --oneline -1</code></pre>
<div class="out"># tests 8
# pass 8
# fail 0
0cec9a9 fix(dat-lich): chặn đặt lịch vào Chủ nhật</div>
<p>Chạy lại đúng dòng <code>node -e</code> kia, giờ nó dừng với <code>Error: Phòng khám nghỉ Chủ nhật</code> thay vì nhận lịch. Tiếp theo là commit phát hành — phiên bản 1.0.1 và một mục changelog — rồi tới tag. Theo semantic versioning (đánh phiên bản ngữ nghĩa, Chương 7.2), một bản sửa lỗi không đổi giao diện nào là bản <strong>patch</strong> (vá): 1.0.0 → 1.0.1.</p>
<pre><code class="language-bash">git commit -m "chore: phát hành 1.0.1"
git tag -a v1.0.1 -m "Sửa lỗi: không nhận lịch Chủ nhật"
git push -u origin hotfix/1.0.1
git push origin v1.0.1
git log --oneline --graph --decorate v1.0.1 main -9</code></pre>
<div class="out"> * [new tag]         v1.0.1 -&gt; v1.0.1
* d131916 (HEAD -&gt; hotfix/1.0.1, tag: v1.0.1, origin/hotfix/1.0.1) chore: phát hành 1.0.1
* 0cec9a9 fix(dat-lich): chặn đặt lịch vào Chủ nhật
* f76a7bb (tag: v1.0.0, main) chore: phát hành 1.0.0 (#13)
* c6bebcb test: giới hạn 3 lịch mỗi số điện thoại (#12)
* bca4107 feat(ui): trang xem lịch đã đặt (#10)
* 170a83c feat(api): đặt lịch hẹn, chặn trùng giờ (#7)
* 23ba455 feat(ui): form đặt lịch khám (#6)
* 6aa8d69 docs: hướng dẫn cài và chạy thử (#8)
* 0d838d5 feat(lich): khung giờ trống trong ngày (#5)</div>
<p>(Nhãn <code>main</code> ở máy vẫn nằm ở <code>f76a7bb</code> vì từ thứ Sáu Cường chưa pull; <code>origin/main</code> thì đã có #14.) Nhánh hotfix không nằm trong ruleset của <code>main</code>, nên hãy nhờ một bạn đọc hai commit trước khi gắn tag — hotfix chính là lúc người ta bỏ qua review và nộp thêm một lỗi thứ hai.</p>

<h3>Đưa bản sửa về main: cherry-pick -x</h3>
<p>Nếu bản sửa chỉ nằm trên <code>hotfix/1.0.1</code>, bản phát hành kế tiếp dựng từ <code>main</code> sẽ mang lỗi Chủ nhật quay lại — một regression (lỗi tái phát). Cường chép đúng commit sửa sang một nhánh mới tách từ <code>main</code> và mở một pull request bình thường:</p>
<pre><code class="language-bash">git switch main &amp;&amp; git pull
git switch -c fix/15-chu-nhat
git cherry-pick -x 0cec9a9
git log -1 --format=%B</code></pre>
<div class="out">Switched to a new branch 'fix/15-chu-nhat'
Auto-merging src/dat-lich.js
[fix/15-chu-nhat f7e4a44] fix(dat-lich): chặn đặt lịch vào Chủ nhật
 Date: Mon Sep 21 08:30:00 2026 +0700
 2 files changed, 4 insertions(+)
fix(dat-lich): chặn đặt lịch vào Chủ nhật

Closes #15

(cherry picked from commit 0cec9a9adc84b189d7d18217a18ceba66f943f0f)</div>
<p><code>Auto-merging src/dat-lich.js</code> là Git áp thay đổi lên trên hàm <code>huyLich</code> mới của Linh trong cùng file — khác dòng, nên không xung đột. <code>-x</code> ghi nguồn gốc vào lời nhắn, để ai đọc <code>main</code> cũng tìm được commit hotfix gốc (Chương 7.3). Sao không merge cả nhánh hotfix vào <code>main</code>? Làm vậy sẽ kéo theo cả "chore: phát hành 1.0.1" — một lần nâng phiên bản thuộc về dòng hotfix, chưa chắc là thứ <code>main</code> sẽ phát hành tiếp. Cherry-pick lấy đúng bản sửa; changelog trên <code>main</code> sẽ nhận mục 1.0.1 ở pull request phát hành kế tiếp.</p>
<p>Sau review và CI, pull request #16 được squash merge. Bức tranh cuối cùng:</p>
<pre><code class="language-bash">git log --oneline --graph --decorate --all -12</code></pre>
<div class="out">* 364e32a (HEAD -&gt; main, origin/main, origin/HEAD) fix(dat-lich): chặn đặt lịch vào Chủ nhật (#16)
* a412cdc feat(api): huỷ lịch hẹn (#14)
| * d131916 (tag: v1.0.1, origin/hotfix/1.0.1, hotfix/1.0.1) chore: phát hành 1.0.1
| * 0cec9a9 fix(dat-lich): chặn đặt lịch vào Chủ nhật
|/
* f76a7bb (tag: v1.0.0) chore: phát hành 1.0.0 (#13)
* c6bebcb test: giới hạn 3 lịch mỗi số điện thoại (#12)
* bca4107 feat(ui): trang xem lịch đã đặt (#10)
* 170a83c feat(api): đặt lịch hẹn, chặn trùng giờ (#7)
* 23ba455 feat(ui): form đặt lịch khám (#6)
* 6aa8d69 docs: hướng dẫn cài và chạy thử (#8)
* 0d838d5 feat(lich): khung giờ trống trong ngày (#5)
* b10dacc ci: chạy lint + test cho mọi pull request</div>
<pre><code class="language-bash">git tag -l -n1
git describe --tags main; git describe --tags hotfix/1.0.1
git log --oneline v1.0.0..v1.0.1</code></pre>
<div class="out">v1.0.0          Bản nộp SWP391 — đặt lịch phòng khám
v1.0.1          Sửa lỗi: không nhận lịch Chủ nhật
v1.0.0-2-g364e32a
v1.0.1
d131916 chore: phát hành 1.0.1
0cec9a9 fix(dat-lich): chặn đặt lịch vào Chủ nhật</div>
<p>Đọc các câu trả lời: <code>main</code> là "hai commit sau v1.0.0" (nó không chứa commit của tag <code>v1.0.1</code>, chỉ chứa một bản sao của bản sửa); nhánh hotfix đúng bằng <code>v1.0.1</code>; và <code>v1.0.0..v1.0.1</code> đúng là bản sửa cộng lần nâng phiên bản — không gì của #14 lọt vào bản vá. Lệnh cuối cùng đó là thứ bạn đưa thầy xem.</p>

<div class="pitfall co-tieu-de"><strong>Phát hành hỏng thế nào trong nhóm sinh viên.</strong> <b>Gắn tag lên commit ở máy trước khi pull.</b> Với squash merge, đầu nhánh ở máy bạn không phải thứ đã vào <code>main</code>; tag trỏ vào một commit GitHub không có. Pull rồi mới tag. <b>Dời tag sau hạn nộp.</b> <code>git tag -f v1.0.0</code> cộng force-push cái tag: ai đã fetch rồi vẫn giữ tag cũ, và câu "thầy chấm v1.0.0 nào?" không có câu trả lời. Hãy ra phiên bản mới. <b>Hotfix từ <code>main</code>.</b> Bản vá âm thầm mang theo tính năng làm dở được merge sau khi nộp. <b>Quên đưa bản sửa về main.</b> Bản phát hành sau đưa lỗi quay lại; <code>git log --grep="cherry picked from"</code> trên <code>main</code> phải tìm thấy mọi hotfix.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong nhóm bốn bản clone ở 16.2 (hoặc trong <code>thu-git</code>), viết <code>CHANGELOG.md</code> từ <code>git log --format="- %s" --reverse</code>, commit, rồi tạo tag có chú thích <code>v1.0.0</code>; push bằng <code>git push origin v1.0.0</code>.</li><li>Merge thêm một thay đổi nhỏ vào <code>main</code> (một "tính năng sau khi nộp").</li><li>Tạo <code>hotfix/1.0.1</code> từ <code>v1.0.0</code>, sửa một thứ kèm test, commit, gắn tag <code>v1.0.1</code>.</li><li>Tách nhánh từ <code>main</code>, <code>git cherry-pick -x</code> bản sửa, rồi merge về.</li><li>Chạy <code>git log --oneline v1.0.0..v1.0.1</code> và <code>git describe --tags main</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>v1.0.0..v1.0.1</code> chỉ liệt kê bản sửa (và lần nâng phiên bản nếu có), <code>git show -s main</code> chứa "cherry picked from commit", và <code>git tag -l -n1</code> hiện hai tag có chú thích kèm lời nhắn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Annotated tag</span><span class="v">Tag có chú thích — đối tượng tag có người gắn, ngày và lời nhắn (<code>git tag -a</code>); đúng loại cho bản phát hành.</span></div>
  <div class="kv"><span class="k">Release notes</span><span class="v">Ghi chú phát hành — bản tóm tắt cho người đọc về thay đổi của một phiên bản; trên GitHub gắn với một Release dựng trên tag.</span></div>
  <div class="kv"><span class="k">CHANGELOG</span><span class="v">Nhật ký thay đổi — file liệt kê mọi phiên bản và thay đổi, mới nhất ở trên, gom theo loại.</span></div>
  <div class="kv"><span class="k">Hotfix</span><span class="v">Bản vá gấp — sửa lỗi của một phiên bản đã phát hành, dựng từ tag của phiên bản đó chứ không từ nhánh phát triển.</span></div>
  <div class="kv"><span class="k">Patch version</span><span class="v">Phiên bản vá — số thứ ba trong MAJOR.MINOR.PATCH: sửa lỗi không đổi giao diện.</span></div>
  <div class="kv"><span class="k"><code>cherry-pick -x</code></span><span class="v">Nhặt commit — chép một commit sang nhánh hiện tại và ghi mã băm gốc vào lời nhắn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Lời nhắn commit tốt làm release notes gần như miễn phí: <code>git log --format="- %s"</code> là nguyên liệu, changelog là bản đã biên tập.</li><li>Tag sau khi pull, dùng tag có chú thích, push tag tường minh, và không bao giờ dời nó — hãy ra phiên bản mới.</li><li>Hotfix bắt đầu từ tag đã phát hành, để bản vá chỉ chứa bản sửa, không chứa gì được merge sau khi nộp.</li><li>Đưa bản sửa về <code>main</code> bằng <code>cherry-pick -x</code> qua một pull request bình thường, không thì bản phát hành sau mang lỗi quay lại.</li><li><code>git log v1.0.0..v1.0.1</code> và <code>git describe --tags</code> chứng minh chính xác mỗi phiên bản chứa gì.</li></ul>

<a class="link-card" href="https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes" target="_blank" rel="noopener">
  <span class="lc-ico">🏷</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Automatically generated release notes</span><span class="lc-sub">Draft a new release, Choose a tag, Generate release notes.</span></span>
</a>
<a class="link-card" href="https://keepachangelog.com/en/1.1.0/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Keep a Changelog 1.1.0</span><span class="lc-sub">Định dạng changelog dùng ở trên.</span></span>
</a>
<a class="link-card" href="https://semver.org/" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Semantic Versioning</span><span class="lc-sub">MAJOR.MINOR.PATCH — vì sao bản sửa là 1.0.1.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-cherry-pick" target="_blank" rel="noopener">
  <span class="lc-ico">🍒</span>
  <span class="lc-body"><span class="lc-title">git-cherry-pick — tài liệu Git</span><span class="lc-sub">-x, xung đột, --continue / --abort.</span></span>
</a>
<p class="note-ct"><strong>Nghĩ về nó thế này:</strong> một phiên bản là một lời hứa về nội dung. Tag giữ lời hứa không dịch chuyển, nhánh hotfix giữ việc mới đứng ngoài nó, và cherry-pick giữ cho bản sửa không bị quên.</p>
</div>
`,
    },

    /* ─────────────────────────── 16.4 ─────────────────────────── */
    {
      title: '16.4 — Eight classic team incidents: symptom, diagnosis, rescue, prevention|||16.4 — Tám sự cố kinh điển của nhóm: triệu chứng, chẩn đoán, cứu, phòng',
      slug: 'git-16-4-su-co-nhom',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tám sự cố hay gặp nhất khi sinh viên làm đồ án nhóm — force-push đè commit bạn, commit .env, merge main sai hướng, file 200 MB, commit bằng tài khoản người khác, xoá nhầm nhánh, làm trên main suốt hai tuần, xung đột package-lock.json — mỗi cái tái hiện ở máy với output thật: triệu chứng, lệnh chẩn đoán, cách cứu, cách phòng và chương liên quan.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.4</span>
<h2>Eight incidents every student team meets — reproduced, diagnosed, fixed</h2>
<p class="lead">Chapter 13 was a cookbook for one person's disasters. This lesson is the team edition: eight incidents that happen in almost every group project, each reproduced in a throw-away repository with real output. For each one: what you see, the one command that tells you what happened, the rescue, and the rule that stops it next time.</p>

${slide('git-16', 14, 'Tám sự cố kinh điển')}
<p>Two questions decide every rescue below, as in Chapter 13.1: <strong>was it committed?</strong> (then it can almost always be recovered) and <strong>was it pushed?</strong> (then fixes must not rewrite shared history — use new commits). Run <code>git status</code> and <code>git reflog -10</code> before anything else.</p>

<h3>1. A teammate force-pushed over your commit</h3>
<p><strong>Symptom.</strong> Linh pushed "giờ nghỉ trưa" to the shared branch <code>feat/lich-chung</code>. Huy's push was rejected, so he "fixed" it with force:</p>
<pre><code class="language-bash">git push            <span class="tok-comment"># Huy</span>
git push --force    <span class="tok-comment"># Huy, after the rejection</span></code></pre>
<div class="out"> ! [rejected]        feat/lich-chung -&gt; feat/lich-chung (fetch first)
 + 4e80a5a...ccb695a feat/lich-chung -&gt; feat/lich-chung (forced update)</div>
<p><strong>Diagnosis</strong> (on Linh's laptop). <code>(forced update)</code> in <code>git fetch</code> is the alarm bell; the remote-tracking reflog shows the jump:</p>
<pre><code class="language-bash">git fetch
git status -sb | head -1
git reflog show origin/feat/lich-chung -3</code></pre>
<div class="out"> + 4e80a5a...ccb695a feat/lich-chung -&gt; origin/feat/lich-chung  (forced update)
## feat/lich-chung...origin/feat/lich-chung [ahead 1, behind 1]
ccb695a refs/remotes/origin/feat/lich-chung@{0}: fetch: forced-update
4e80a5a refs/remotes/origin/feat/lich-chung@{1}: update by push
2649e44 refs/remotes/origin/feat/lich-chung@{2}: update by push</div>
<p><strong>Rescue.</strong> Linh's commit <code>4e80a5a</code> vanished from the remote but is still on her laptop ("ahead 1"). Replay it on top of Huy's version and push normally — no force needed:</p>
<pre><code class="language-bash">git rebase origin/feat/lich-chung
git log --oneline -4 &amp;&amp; git push</code></pre>
<div class="out">Successfully rebased and updated refs/heads/feat/lich-chung.
eaf9816 feat: giờ nghỉ trưa
ccb695a chore: ghi chú ngày lễ
2649e44 feat: khung 30 phút
145de3a chore: khởi tạo
   ccb695a..eaf9816  feat/lich-chung -&gt; feat/lich-chung</div>
<p>If the victim's laptop no longer has the commit, anyone who fetched before the force-push has it in <code>git reflog show origin/&lt;branch&gt;</code>. <strong>Prevention.</strong> Block force pushes on shared branches (16.1) and make <code>--force-with-lease</code> a habit (Chapter 8.2). Replayed: Huy amends his last commit after Linh has pushed something new he has not fetched —</p>
<pre><code class="language-bash">git push --force-with-lease</code></pre>
<div class="out"> ! [rejected]        feat/lich-chung -&gt; feat/lich-chung (stale info)
error: failed to push some refs to '~/origin.git'</div>
<p>"stale info" means: the remote has moved since you last looked — go and look. Revisit: 8.2, 13.1 (recipe 5).</p>

<h3>2. The .env (or an API key) was committed</h3>
<p><strong>Symptom.</strong> Trang's "send reminder e-mails" commit contains the SMTP password:</p>
<pre><code class="language-bash">git add . &amp;&amp; git commit -m "feat: gửi mail nhắc lịch"
git show --stat --format="%h %s" HEAD</code></pre>
<div class="out">05d244c feat: gửi mail nhắc lịch

 .env      | 2 ++
 config.js | 1 +
 2 files changed, 3 insertions(+)</div>
<p><strong>Diagnosis.</strong> <code>git log --all --oneline -- .env</code> lists every commit that touched the file; <code>git status -sb</code> tells you whether it left the laptop — here <code>## main...origin/main [ahead 1]</code>, not pushed.</p>
<p><strong>Rescue, not pushed yet:</strong> untrack, ignore, amend.</p>
<pre><code class="language-bash">git rm --cached .env &amp;&amp; echo ".env" &gt;&gt; .gitignore &amp;&amp; git add .gitignore
git commit --amend --no-edit
git show --stat --format="%h %s" HEAD
git log --all --oneline -- .env</code></pre>
<div class="out">008520f feat: gửi mail nhắc lịch

 .gitignore | 1 +
 config.js  | 1 +
 2 files changed, 2 insertions(+)</div>
<p>The last command prints nothing: no branch contains <code>.env</code> any more (the old commit survives only in the local reflog, which never leaves the laptop). <strong>Already pushed:</strong> the order is fixed — <strong>rotate the secret first</strong> (it is compromised the moment it reached GitHub), then remove it from history with <code>git filter-repo</code> and coordinate a re-clone (Chapter 8.3). <strong>Prevention:</strong> <code>.env</code> in <code>.gitignore</code> from day 0 (16.1), a pre-commit secret check (12.1), and GitHub push protection (11.3), which blocks known token formats at push time. Revisit: 1.5, 8.3, 11.3.</p>

<h3>3. main merged the wrong way</h3>
<p><strong>Symptom.</strong> Linh wanted to bring <code>main</code> into her branch, but she was standing on <code>main</code>:</p>
<pre><code class="language-bash">git switch main &amp;&amp; git pull &amp;&amp; git merge --no-edit feat/2-form
git status -sb | head -1
git log --oneline --graph -5</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 index.html | 2 ++
 1 file changed, 2 insertions(+)
 create mode 100644 index.html
## main...origin/main [ahead 3]
*   8745f55 Merge branch 'feat/2-form'
|\\
| * 9ed359e wip: thử bố cục
| * 451e0f0 feat(ui): form
* | 7bee1e7 feat: khung 30 phút
|/
* 145de3a chore: khởi tạo</div>
<p><strong>Diagnosis.</strong> <code>[ahead 3]</code> on <code>main</code> — your <code>main</code> should never be ahead of <code>origin/main</code> in a pull-request workflow. <strong>Rescue, not pushed:</strong> put <code>main</code> back; the work is still on the feature branch.</p>
<pre><code class="language-bash">git reset --hard origin/main &amp;&amp; git log --oneline -1 feat/2-form</code></pre>
<div class="out">HEAD is now at 7bee1e7 feat: khung 30 phút
9ed359e wip: thử bố cục</div>
<p><strong>Already pushed</strong> (a repository without a ruleset): never reset a shared branch — undo with a new commit. For a merge commit you must say which parent is the mainline:</p>
<pre><code class="language-bash">git revert -m 1 --no-edit HEAD &amp;&amp; git push
git log --oneline --graph -4</code></pre>
<div class="out">[main d933571] Revert "Merge branch 'feat/2-form'"
 Date: Wed Sep 9 10:10:00 2026 +0700
 1 file changed, 2 deletions(-)
 delete mode 100644 index.html
* d933571 Revert "Merge branch 'feat/2-form'"
*   48428d4 Merge branch 'feat/2-form'
|\\
| * 9ed359e wip: thử bố cục
| * 451e0f0 feat(ui): form</div>
<p>Remember the catch from Chapter 4.3: after reverting a merge, merging the same branch again brings nothing back — you will have to revert the revert. <strong>Prevention:</strong> "Require a pull request before merging" makes this push impossible, and <code>git status</code> before every merge shows which branch you are on. Revisit: 4.2, 4.3.</p>

<h3>4. A 200 MB file, and GitHub refuses the push</h3>
<p><strong>Symptom.</strong> Huy committed the screen recording for the defence. GitHub blocks files larger than 100 MiB (and warns above 50 MiB — docs.github.com, "About large files on GitHub", 09/2026), so the push is rejected; the lab below uses a local bare repository, which has no such limit, so we do not print GitHub's message. <strong>Diagnosis</strong>: find the biggest objects in the commits you have not pushed:</p>
<pre><code class="language-bash">git rev-list --objects origin/main..HEAD \\
  | git cat-file --batch-check='%(objecttype) %(objectsize) %(rest)' \\
  | grep '^blob' | sort -k2 -n | tail -3</code></pre>
<div class="out">blob 48 README.md
blob 209715200 demo/quay-man-hinh.mp4</div>
<p><strong>Rescue.</strong> Deleting the file in a <em>new</em> commit does not help — the blob is still in the commit being pushed. Take the unpushed commits apart and rebuild them without it:</p>
<pre><code class="language-bash">git reset --soft origin/main
git rm --cached demo/quay-man-hinh.mp4
printf "demo/*.mp4\\n" &gt;&gt; .gitignore &amp;&amp; git add .gitignore README.md
git commit -m "docs: link video demo (video để trên Drive)"
git rev-list --objects origin/main..HEAD | git cat-file --batch-check='%(objecttype) %(objectsize) %(rest)' | grep '^blob'</code></pre>
<div class="out">blob 11 .gitignore
blob 48 README.md</div>
<p>The video is still on disk (<code>du -h</code> says <code>200M</code>), just no longer in Git — upload it to a drive and link it. If the big file is buried under several pushed-later commits, use <code>git rebase -i</code> or <code>git filter-repo --path … --invert-paths</code>. <strong>Prevention:</strong> ignore media folders, a size check in the pre-commit hook (12.1), Git LFS for files that really belong in the repository (10.3). Revisit: 4.2, 10.3.</p>

<h3>5. Commits made with someone else's account or the wrong e-mail</h3>
<p><strong>Symptom.</strong> On a lab computer, a student from the previous session had set <code>git config --global</code>. Cường's two commits are credited to a stranger, and they will not appear on his GitHub profile:</p>
<pre><code class="language-bash">git log --format="%h %an &lt;%ae&gt; %s" origin/main..HEAD
git config --show-origin user.email</code></pre>
<div class="out">4fb98dd Nguyen Van Tuan &lt;tuan.lab@example.com&gt; feat: nghỉ trưa
8406cc6 Nguyen Van Tuan &lt;tuan.lab@example.com&gt; feat: khung 30 phút
file:~/.gitconfig	tuan.lab@example.com</div>
<p><strong>Rescue, not pushed:</strong> set your identity for this repository, then rewrite the author of every unpushed commit:</p>
<pre><code class="language-bash">git config user.name "Cuong Hoang" &amp;&amp; git config user.email cuong@example.com
git rebase -r origin/main --exec "git commit --amend --no-edit --reset-author"
git log --format="%h %an &lt;%ae&gt; %s" origin/main..HEAD</code></pre>
<div class="out">Successfully rebased and updated refs/heads/main.
5e82e4c Cuong Hoang &lt;cuong@example.com&gt; feat: nghỉ trưa
2635416 Cuong Hoang &lt;cuong@example.com&gt; feat: khung 30 phút</div>
<p>New hashes, as always after a rewrite — fine because nothing was pushed. Already pushed to a shared branch: leave history alone and, if the e-mail is yours, add it to your GitHub account so the commits are attributed. <strong>Prevention:</strong> on shared machines set identity per repository (no <code>--global</code>), and on your own laptop use <code>includeIf</code> for school vs personal (Chapter 14.3); a push over HTTPS on a lab machine may also use a stored credential of another account — clear it when you leave. Revisit: 0.3, 14.3.</p>

<h3>6. A branch deleted by mistake</h3>
<p><strong>Symptom.</strong> Linh cleans up with <code>-D</code> and takes an unmerged branch with her:</p>
<pre><code class="language-bash">git branch -D feat/9-xem-lich
git reflog -3</code></pre>
<div class="out">Deleted branch feat/9-xem-lich (was 93e108e).
145de3a HEAD@{0}: checkout: moving from feat/9-xem-lich to main
93e108e HEAD@{1}: commit: feat(ui): trang xem lịch
145de3a HEAD@{2}: checkout: moving from main to feat/9-xem-lich</div>
<p><strong>Rescue.</strong> The hash is printed right in the delete message, and the reflog has it too:</p>
<pre><code class="language-bash">git branch feat/9-xem-lich 93e108e &amp;&amp; git log --oneline -1 feat/9-xem-lich</code></pre>
<div class="out">93e108e feat(ui): trang xem lịch</div>
<p>Deleted <strong>on the remote</strong>? For the head branch of a closed pull request, GitHub has a <strong>Restore branch</strong> button at the bottom of the pull request (docs.github.com, 09/2026). Otherwise, any teammate who has not run <code>fetch --prune</code> still has <code>origin/feat/9-xem-lich</code> and can push it back:</p>
<pre><code class="language-bash">git branch -r
git push origin origin/feat/9-xem-lich:refs/heads/feat/9-xem-lich</code></pre>
<div class="out">  origin/HEAD -&gt; origin/main
  origin/feat/9-xem-lich
  origin/main
 * [new branch]      origin/feat/9-xem-lich -&gt; feat/9-xem-lich</div>
<p><strong>Prevention:</strong> <code>git branch -d</code> (lowercase) first; use <code>-D</code> only after the <code>: gone</code> + Merged check of 16.2. Revisit: 4.4, 13.1 (recipe 3).</p>

<h3>7. "I have been working on main for two weeks"</h3>
<p><strong>Symptom.</strong> Huy never created a branch. Now the ruleset rejects his push, and his <code>main</code> has drifted from everyone else's:</p>
<pre><code class="language-bash">git fetch &amp;&amp; git status -sb | head -1
git log --oneline origin/main..main</code></pre>
<div class="out">## main...origin/main [ahead 5, behind 3]
dcb3022 feat: việc ngày 22/09
d55c992 feat: việc ngày 21/09
b392f19 feat: việc ngày 16/09
077a919 feat: việc ngày 15/09
4981961 feat: việc ngày 14/09</div>
<p><strong>Rescue</strong> in four moves: put a branch label on the work, move <code>main</code> back to where the team is, replay the work on top, push the branch.</p>
<pre><code class="language-bash">git switch -c feat/viec-cua-huy
git branch -f main origin/main &amp;&amp; git log --oneline -1 main
git rebase origin/main
git log --oneline --graph -9
git push -u origin feat/viec-cua-huy</code></pre>
<div class="out">Switched to a new branch 'feat/viec-cua-huy'
branch 'main' set up to track 'origin/main'.
4dc52be docs: cập nhật ngày 23/09 (#23)
Successfully rebased and updated refs/heads/feat/viec-cua-huy.
* 59c5b9b feat: việc ngày 22/09
* d605e98 feat: việc ngày 21/09
* e8ed7c6 feat: việc ngày 16/09
* 7023d6e feat: việc ngày 15/09
* 1c5df7b feat: việc ngày 14/09
* 4dc52be docs: cập nhật ngày 23/09 (#23)
* 3c84adc docs: cập nhật ngày 18/09 (#18)
* 917a54c docs: cập nhật ngày 15/09 (#15)
* 145de3a chore: khởi tạo
 * [new branch]      feat/viec-cua-huy -&gt; feat/viec-cua-huy</div>
<p>Nothing was lost: the five commits are now on a branch, <code>main</code> matches the team, and the rebase replayed cleanly (if it conflicts, resolve file by file as in Chapter 3.4). Two weeks of work is too big for one review — split it into several pull requests with <code>git cherry-pick</code> onto small branches. <strong>Prevention:</strong> the ruleset makes this fail on day 1 instead of day 14; <code>git status</code> prints the branch in its first line. Revisit: 3.4, 7.1.</p>

<h3>8. A conflict in package-lock.json</h3>
${slide('git-16', 15, '--force-with-lease và xung đột lockfile')}
<p><strong>Symptom.</strong> Linh added <code>dayjs</code>, Huy added <code>zod</code>, Linh's pull request was merged first. Huy updates his branch:</p>
<pre><code class="language-bash">git fetch &amp;&amp; git merge origin/main
git diff --name-only --diff-filter=U</code></pre>
<div class="out">Auto-merging package-lock.json
CONFLICT (content): Merge conflict in package-lock.json
Auto-merging package.json
CONFLICT (content): Merge conflict in package.json
Automatic merge failed; fix conflicts and then commit the result.
package-lock.json
package.json</div>
<p><strong>Rescue.</strong> Never edit the lock file by hand. <code>package.json</code> is small and human — resolve it by keeping both dependencies. For the lock file, the tempting shortcut is to run <code>npm install</code> on the conflicted file. It does remove the markers (npm 10.9.4 here), but look at what it resolved:</p>
<div class="out"># tried: npm install on the conflicted lock
phong-kham@1.0.0 ~/phong-kham
+-- dayjs@1.11.23
&#96;-- zod@3.25.76</div>
<p><code>dayjs</code> jumped from 1.11.13 — the version <code>main</code> had locked and tested — to 1.11.23. The safer way keeps <code>main</code>'s lock and re-resolves only your own addition. During a <em>merge</em>, <code>--theirs</code> is the branch coming in, i.e. <code>main</code> (during a rebase the two words swap — Chapter 3.3):</p>
<pre><code class="language-bash">git checkout --theirs package-lock.json
npm install --package-lock-only      <span class="tok-comment"># in your project: plain npm install</span>
git add package.json package-lock.json
npm ls --package-lock-only</code></pre>
<div class="out">Updated 1 path from the index
phong-kham@1.0.0 ~/phong-kham
+-- dayjs@1.11.13
&#96;-- zod@3.25.76</div>
<p><code>dayjs</code> stays at the tested 1.11.13. <code>zod</code> was resolved fresh to the newest 3.x (3.25.76, not the 3.23.8 Huy had) — check <code>npm ls</code> and pin it again if you need that exact version. Then run the tests and commit the merge. (<code>--package-lock-only</code> updates only the lock file without downloading; in your project a plain <code>npm install</code> does the same plus <code>node_modules</code>.) <strong>Prevention:</strong> add dependencies in their own small pull request and merge it quickly; one person's "chore: update deps" per week instead of everyone adding packages in feature branches. Revisit: 3.3.</p>

<div class="pitfall co-tieu-de"><strong>The meta-mistake behind all eight.</strong> <b>Fixing before diagnosing.</b> Every incident above has a one-line diagnostic (<code>git fetch</code> output, <code>status -sb</code>, <code>reflog</code>, <code>log --format</code>, <code>rev-list | cat-file</code>) — people skip it and reach for <code>--force</code> or <code>reset --hard</code>, which turns a recoverable situation into a lost one. <b>Rewriting what was pushed.</b> Incidents 2, 3, 4 and 5 have a "not pushed" rescue that rewrites history and an "already pushed" rescue that does not; using the first after pushing creates incident 1 for someone else. <b>Fixing alone and quietly.</b> Tell the team before any rescue on a shared branch — someone may be about to pull.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In a throw-away folder, create a bare repository and two clones (<code>a</code>, <code>b</code>), each with its own <code>user.name</code>; commit and push a small file from <code>a</code>.</li><li>Incident 1: from <code>a</code> push a commit to a shared branch; from <code>b</code> (without fetching) amend and <code>git push --force-with-lease</code>. Read the rejection. Then do it with <code>--force</code>, and rescue <code>a</code>'s commit with <code>git fetch</code>, <code>git reflog show origin/&lt;branch&gt;</code> and <code>git rebase</code>.</li><li>Incident 6: <code>git branch -D</code> an unmerged branch and bring it back from the hash in the message.</li><li>Incident 7: make three commits on <code>main</code> in <code>b</code>, push something new from <code>a</code>, then move <code>b</code>'s work to a branch with the four moves above.</li><li>Pick one more incident from the table and reproduce it without reading its section again.</li></ol>
<p><strong>Done when:</strong> in every case <code>git log --all --oneline</code> still contains every commit you created, <code>b</code>'s <code>main</code> equals <code>origin/main</code> (<code>git status -sb</code> shows no ahead/behind), and you can name the diagnostic command you used first for each incident.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">(forced update)</span><span class="v">What <code>git fetch</code> prints when a remote branch was rewritten — someone force-pushed.</span></div>
  <div class="kv"><span class="k">stale info</span><span class="v"><code>--force-with-lease</code> refused because the remote moved since you last fetched.</span></div>
  <div class="kv"><span class="k">Secret rotation</span><span class="v">Revoking a leaked key and issuing a new one — the first step, before cleaning history.</span></div>
  <div class="kv"><span class="k"><code>revert -m 1</code></span><span class="v">Undo a merge commit with a new commit, keeping parent 1 (the branch you were on) as the mainline.</span></div>
  <div class="kv"><span class="k">Lockfile</span><span class="v"><code>package-lock.json</code>: the exact versions that were installed and tested; generated, never edited by hand.</span></div>
  <div class="kv"><span class="k"><code>--reset-author</code></span><span class="v">With <code>commit --amend</code>, rewrites the author to the current <code>user.name</code>/<code>user.email</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Diagnose first: <code>git status -sb</code>, <code>git reflog</code>, the output of <code>git fetch</code> — each incident announces itself in one line.</li><li>"Not pushed" rescues may rewrite history (<code>reset</code>, <code>amend</code>, <code>rebase</code>); "already pushed" rescues add new commits (<code>revert</code>) or are coordinated with the team.</li><li>A leaked secret is rotated first and cleaned second; deleting the file is not enough once it reached GitHub.</li><li>Deleted branches and force-pushed commits live on in reflogs and in teammates' remote-tracking branches.</li><li>For lockfile conflicts: resolve <code>package.json</code> by hand, take <code>main</code>'s lock, let npm re-resolve only your change, and check <code>npm ls</code>.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-push" target="_blank" rel="noopener">
  <span class="lc-ico">⬆️</span>
  <span class="lc-body"><span class="lc-title">git-push — --force-with-lease</span><span class="lc-sub">How the lease is checked, and when it is not enough.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — About large files on GitHub</span><span class="lc-sub">The 50 MiB warning, the 100 MiB block, removing files from history.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/deleting-and-restoring-branches-in-a-pull-request" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Deleting and restoring branches in a pull request</span><span class="lc-sub">The Restore branch button.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/working-with-push-protection-from-the-command-line" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Push protection from the command line</span><span class="lc-sub">What a blocked push looks like, and how to remove the secret.</span></span>
</a>
<p class="note-ct"><strong>How to think about it:</strong> a team incident is rarely lost work — it is usually work sitting somewhere unexpected: in a reflog, in a teammate's clone, on the wrong branch. Find where it is before you decide what to do with it.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.4</span>
<h2>Tám sự cố nhóm nào cũng gặp — tái hiện, chẩn đoán, cứu</h2>
<p class="lead">Chương 13 là sách công thức cho tai nạn của một người. Bài này là bản dành cho nhóm: tám sự cố xảy ra ở hầu hết mọi đồ án nhóm, mỗi cái được tái hiện trong một kho thử với output thật. Với từng cái: bạn thấy gì, một lệnh cho biết chuyện gì đã xảy ra, cách cứu, và luật chặn nó lần sau.</p>

${slide('git-16', 14, 'Tám sự cố kinh điển')}
<p>Hai câu hỏi quyết định mọi cách cứu dưới đây, như ở Chương 13.1: <strong>đã commit chưa?</strong> (rồi thì gần như luôn cứu được) và <strong>đã push chưa?</strong> (rồi thì cách sửa không được viết lại lịch sử chung — dùng commit mới). Chạy <code>git status</code> và <code>git reflog -10</code> trước mọi thứ khác.</p>

<h3>1. Bạn cùng nhóm force-push đè lên commit của mình</h3>
<p><strong>Triệu chứng.</strong> Linh push "giờ nghỉ trưa" lên nhánh chung <code>feat/lich-chung</code>. Huy push bị từ chối, thế là "sửa" bằng force:</p>
<pre><code class="language-bash">git push            <span class="tok-comment"># Huy</span>
git push --force    <span class="tok-comment"># Huy, sau khi bị từ chối</span></code></pre>
<div class="out"> ! [rejected]        feat/lich-chung -&gt; feat/lich-chung (fetch first)
 + 4e80a5a...ccb695a feat/lich-chung -&gt; feat/lich-chung (forced update)</div>
<p><strong>Chẩn đoán</strong> (trên máy Linh). Chữ <code>(forced update)</code> trong output của <code>git fetch</code> là chuông báo động; reflog của nhánh theo dõi remote cho thấy cú nhảy:</p>
<pre><code class="language-bash">git fetch
git status -sb | head -1
git reflog show origin/feat/lich-chung -3</code></pre>
<div class="out"> + 4e80a5a...ccb695a feat/lich-chung -&gt; origin/feat/lich-chung  (forced update)
## feat/lich-chung...origin/feat/lich-chung [ahead 1, behind 1]
ccb695a refs/remotes/origin/feat/lich-chung@{0}: fetch: forced-update
4e80a5a refs/remotes/origin/feat/lich-chung@{1}: update by push
2649e44 refs/remotes/origin/feat/lich-chung@{2}: update by push</div>
<p><strong>Cứu.</strong> Commit <code>4e80a5a</code> của Linh biến khỏi remote nhưng vẫn nằm trên máy Linh ("ahead 1"). Đặt lại nó lên trên bản của Huy rồi push bình thường — không cần force:</p>
<pre><code class="language-bash">git rebase origin/feat/lich-chung
git log --oneline -4 &amp;&amp; git push</code></pre>
<div class="out">Successfully rebased and updated refs/heads/feat/lich-chung.
eaf9816 feat: giờ nghỉ trưa
ccb695a chore: ghi chú ngày lễ
2649e44 feat: khung 30 phút
145de3a chore: khởi tạo
   ccb695a..eaf9816  feat/lich-chung -&gt; feat/lich-chung</div>
<p>Nếu máy nạn nhân không còn commit đó, bất kỳ ai đã fetch trước lần force-push đều còn nó trong <code>git reflog show origin/&lt;nhánh&gt;</code>. <strong>Phòng.</strong> Chặn force-push trên nhánh chung (16.1) và tập thói quen <code>--force-with-lease</code> (Chương 8.2). Diễn lại: Huy amend commit cuối sau khi Linh đã push thêm một thứ mà Huy chưa fetch —</p>
<pre><code class="language-bash">git push --force-with-lease</code></pre>
<div class="out"> ! [rejected]        feat/lich-chung -&gt; feat/lich-chung (stale info)
error: failed to push some refs to '~/origin.git'</div>
<p>"stale info" (thông tin đã cũ) nghĩa là: remote đã đổi kể từ lần cuối bạn nhìn — hãy đi nhìn lại. Xem lại: 8.2, 13.1 (công thức 5).</p>

<h3>2. Lỡ commit .env (hay một khoá API)</h3>
<p><strong>Triệu chứng.</strong> Commit "gửi mail nhắc lịch" của Trang chứa luôn mật khẩu SMTP:</p>
<pre><code class="language-bash">git add . &amp;&amp; git commit -m "feat: gửi mail nhắc lịch"
git show --stat --format="%h %s" HEAD</code></pre>
<div class="out">05d244c feat: gửi mail nhắc lịch

 .env      | 2 ++
 config.js | 1 +
 2 files changed, 3 insertions(+)</div>
<p><strong>Chẩn đoán.</strong> <code>git log --all --oneline -- .env</code> liệt kê mọi commit từng chạm file đó; <code>git status -sb</code> cho biết nó đã rời laptop chưa — ở đây <code>## main...origin/main [ahead 1]</code>, chưa push.</p>
<p><strong>Cứu khi chưa push:</strong> bỏ theo dõi, thêm vào ignore, amend.</p>
<pre><code class="language-bash">git rm --cached .env &amp;&amp; echo ".env" &gt;&gt; .gitignore &amp;&amp; git add .gitignore
git commit --amend --no-edit
git show --stat --format="%h %s" HEAD
git log --all --oneline -- .env</code></pre>
<div class="out">008520f feat: gửi mail nhắc lịch

 .gitignore | 1 +
 config.js  | 1 +
 2 files changed, 2 insertions(+)</div>
<p>Lệnh cuối không in gì: không nhánh nào còn chứa <code>.env</code> (commit cũ chỉ còn trong reflog ở máy, thứ không bao giờ rời laptop). <strong>Đã push:</strong> thứ tự là cố định — <strong>đổi khoá trước</strong> (rotate — nó đã lộ ngay khi tới GitHub), rồi mới gỡ khỏi lịch sử bằng <code>git filter-repo</code> và hẹn cả nhóm clone lại (Chương 8.3). <strong>Phòng:</strong> <code>.env</code> nằm trong <code>.gitignore</code> từ Ngày 0 (16.1), hook pre-commit kiểm bí mật (12.1), và push protection (bảo vệ lúc push) của GitHub (11.3), chặn các dạng token đã biết ngay lúc push. Xem lại: 1.5, 8.3, 11.3.</p>

<h3>3. Merge main sai hướng</h3>
<p><strong>Triệu chứng.</strong> Linh muốn đưa <code>main</code> vào nhánh của mình, nhưng lại đang đứng ở <code>main</code>:</p>
<pre><code class="language-bash">git switch main &amp;&amp; git pull &amp;&amp; git merge --no-edit feat/2-form
git status -sb | head -1
git log --oneline --graph -5</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 index.html | 2 ++
 1 file changed, 2 insertions(+)
 create mode 100644 index.html
## main...origin/main [ahead 3]
*   8745f55 Merge branch 'feat/2-form'
|\\
| * 9ed359e wip: thử bố cục
| * 451e0f0 feat(ui): form
* | 7bee1e7 feat: khung 30 phút
|/
* 145de3a chore: khởi tạo</div>
<p><strong>Chẩn đoán.</strong> <code>[ahead 3]</code> trên <code>main</code> — trong quy trình pull request, <code>main</code> ở máy bạn không bao giờ được đi trước <code>origin/main</code>. <strong>Cứu khi chưa push:</strong> đưa <code>main</code> về chỗ cũ; công sức vẫn nằm trên nhánh tính năng.</p>
<pre><code class="language-bash">git reset --hard origin/main &amp;&amp; git log --oneline -1 feat/2-form</code></pre>
<div class="out">HEAD is now at 7bee1e7 feat: khung 30 phút
9ed359e wip: thử bố cục</div>
<p><strong>Đã push</strong> (một repo chưa có ruleset): không bao giờ reset nhánh chung — hoàn tác bằng một commit mới. Với merge commit, bạn phải nói cha nào là dòng chính:</p>
<pre><code class="language-bash">git revert -m 1 --no-edit HEAD &amp;&amp; git push
git log --oneline --graph -4</code></pre>
<div class="out">[main d933571] Revert "Merge branch 'feat/2-form'"
 Date: Wed Sep 9 10:10:00 2026 +0700
 1 file changed, 2 deletions(-)
 delete mode 100644 index.html
* d933571 Revert "Merge branch 'feat/2-form'"
*   48428d4 Merge branch 'feat/2-form'
|\\
| * 9ed359e wip: thử bố cục
| * 451e0f0 feat(ui): form</div>
<p>Nhớ cái bẫy ở Chương 4.3: sau khi revert một lần merge, merge lại đúng nhánh đó sẽ không mang gì về — bạn phải revert chính cái revert. <strong>Phòng:</strong> luật "Require a pull request before merging" khiến lần push này không thể xảy ra, và <code>git status</code> trước mỗi lần merge cho biết bạn đang đứng ở nhánh nào. Xem lại: 4.2, 4.3.</p>

<h3>4. File 200 MB, GitHub từ chối lần push</h3>
<p><strong>Triệu chứng.</strong> Huy commit video quay màn hình cho buổi bảo vệ. GitHub chặn file lớn hơn 100 MiB (và cảnh báo từ 50 MiB — docs.github.com, "About large files on GitHub", 09/2026), nên lần push bị từ chối; phòng thí nghiệm dưới đây dùng kho bare trên máy, thứ không có giới hạn đó, nên ta không in lời báo của GitHub. <strong>Chẩn đoán</strong>: tìm đối tượng to nhất trong các commit chưa push:</p>
<pre><code class="language-bash">git rev-list --objects origin/main..HEAD \\
  | git cat-file --batch-check='%(objecttype) %(objectsize) %(rest)' \\
  | grep '^blob' | sort -k2 -n | tail -3</code></pre>
<div class="out">blob 48 README.md
blob 209715200 demo/quay-man-hinh.mp4</div>
<p><strong>Cứu.</strong> Xoá file ở một commit <em>mới</em> không giúp được gì — blob vẫn nằm trong commit sắp push. Tháo các commit chưa push ra và dựng lại chúng không có file đó:</p>
<pre><code class="language-bash">git reset --soft origin/main
git rm --cached demo/quay-man-hinh.mp4
printf "demo/*.mp4\\n" &gt;&gt; .gitignore &amp;&amp; git add .gitignore README.md
git commit -m "docs: link video demo (video để trên Drive)"
git rev-list --objects origin/main..HEAD | git cat-file --batch-check='%(objecttype) %(objectsize) %(rest)' | grep '^blob'</code></pre>
<div class="out">blob 11 .gitignore
blob 48 README.md</div>
<p>Video vẫn còn trên đĩa (<code>du -h</code> báo <code>200M</code>), chỉ là không còn trong Git — đưa lên Drive và dán link. Nếu file lớn nằm vùi dưới vài commit sau đó, dùng <code>git rebase -i</code> hoặc <code>git filter-repo --path … --invert-paths</code>. <strong>Phòng:</strong> ignore các thư mục media, hook pre-commit kiểm kích thước (12.1), Git LFS cho file thật sự thuộc về repo (10.3). Xem lại: 4.2, 10.3.</p>

<h3>5. Commit bằng tài khoản người khác hoặc sai email</h3>
<p><strong>Triệu chứng.</strong> Trên máy phòng lab, bạn học ca trước đã đặt <code>git config --global</code>. Hai commit của Cường được ghi công cho một người lạ, và sẽ không hiện trên hồ sơ GitHub của Cường:</p>
<pre><code class="language-bash">git log --format="%h %an &lt;%ae&gt; %s" origin/main..HEAD
git config --show-origin user.email</code></pre>
<div class="out">4fb98dd Nguyen Van Tuan &lt;tuan.lab@example.com&gt; feat: nghỉ trưa
8406cc6 Nguyen Van Tuan &lt;tuan.lab@example.com&gt; feat: khung 30 phút
file:~/.gitconfig	tuan.lab@example.com</div>
<p><strong>Cứu khi chưa push:</strong> đặt danh tính cho riêng repo này, rồi viết lại tác giả của mọi commit chưa push:</p>
<pre><code class="language-bash">git config user.name "Cuong Hoang" &amp;&amp; git config user.email cuong@example.com
git rebase -r origin/main --exec "git commit --amend --no-edit --reset-author"
git log --format="%h %an &lt;%ae&gt; %s" origin/main..HEAD</code></pre>
<div class="out">Successfully rebased and updated refs/heads/main.
5e82e4c Cuong Hoang &lt;cuong@example.com&gt; feat: nghỉ trưa
2635416 Cuong Hoang &lt;cuong@example.com&gt; feat: khung 30 phút</div>
<p>Mã băm mới, như mọi lần viết lại — không sao vì chưa push gì. Đã push lên nhánh chung: để yên lịch sử, và nếu email đó là của bạn thì thêm nó vào tài khoản GitHub để commit được ghi công. <strong>Phòng:</strong> trên máy dùng chung, đặt danh tính theo từng repo (không <code>--global</code>), còn trên laptop của mình dùng <code>includeIf</code> tách trường và cá nhân (Chương 14.3); push qua HTTPS trên máy lab còn có thể dùng thông tin đăng nhập đã lưu của tài khoản khác — xoá nó trước khi rời máy. Xem lại: 0.3, 14.3.</p>

<h3>6. Xoá nhầm nhánh</h3>
<p><strong>Triệu chứng.</strong> Linh dọn nhánh bằng <code>-D</code> và cuốn theo một nhánh chưa merge:</p>
<pre><code class="language-bash">git branch -D feat/9-xem-lich
git reflog -3</code></pre>
<div class="out">Deleted branch feat/9-xem-lich (was 93e108e).
145de3a HEAD@{0}: checkout: moving from feat/9-xem-lich to main
93e108e HEAD@{1}: commit: feat(ui): trang xem lịch
145de3a HEAD@{2}: checkout: moving from main to feat/9-xem-lich</div>
<p><strong>Cứu.</strong> Mã băm được in ngay trong lời báo xoá, và reflog cũng có:</p>
<pre><code class="language-bash">git branch feat/9-xem-lich 93e108e &amp;&amp; git log --oneline -1 feat/9-xem-lich</code></pre>
<div class="out">93e108e feat(ui): trang xem lịch</div>
<p>Bị xoá <strong>trên remote</strong>? Với nhánh nguồn của một pull request đã đóng, GitHub có nút <strong>Restore branch</strong> ở cuối trang pull request (docs.github.com, 09/2026). Không thì bất kỳ bạn nào chưa chạy <code>fetch --prune</code> vẫn còn <code>origin/feat/9-xem-lich</code> và push nó về được:</p>
<pre><code class="language-bash">git branch -r
git push origin origin/feat/9-xem-lich:refs/heads/feat/9-xem-lich</code></pre>
<div class="out">  origin/HEAD -&gt; origin/main
  origin/feat/9-xem-lich
  origin/main
 * [new branch]      origin/feat/9-xem-lich -&gt; feat/9-xem-lich</div>
<p><strong>Phòng:</strong> dùng <code>git branch -d</code> (chữ thường) trước; chỉ <code>-D</code> sau khi đã kiểm <code>: gone</code> + Merged như bài 16.2. Xem lại: 4.4, 13.1 (công thức 3).</p>

<h3>7. "Tôi làm trên main suốt hai tuần"</h3>
<p><strong>Triệu chứng.</strong> Huy chưa từng tạo nhánh. Giờ ruleset từ chối lần push, và <code>main</code> của Huy đã trôi xa khỏi của cả nhóm:</p>
<pre><code class="language-bash">git fetch &amp;&amp; git status -sb | head -1
git log --oneline origin/main..main</code></pre>
<div class="out">## main...origin/main [ahead 5, behind 3]
dcb3022 feat: việc ngày 22/09
d55c992 feat: việc ngày 21/09
b392f19 feat: việc ngày 16/09
077a919 feat: việc ngày 15/09
4981961 feat: việc ngày 14/09</div>
<p><strong>Cứu</strong> bằng bốn nước: dán nhãn nhánh lên công sức, đưa <code>main</code> về chỗ cả nhóm đang đứng, đặt lại công sức lên trên, push nhánh.</p>
<pre><code class="language-bash">git switch -c feat/viec-cua-huy
git branch -f main origin/main &amp;&amp; git log --oneline -1 main
git rebase origin/main
git log --oneline --graph -9
git push -u origin feat/viec-cua-huy</code></pre>
<div class="out">Switched to a new branch 'feat/viec-cua-huy'
branch 'main' set up to track 'origin/main'.
4dc52be docs: cập nhật ngày 23/09 (#23)
Successfully rebased and updated refs/heads/feat/viec-cua-huy.
* 59c5b9b feat: việc ngày 22/09
* d605e98 feat: việc ngày 21/09
* e8ed7c6 feat: việc ngày 16/09
* 7023d6e feat: việc ngày 15/09
* 1c5df7b feat: việc ngày 14/09
* 4dc52be docs: cập nhật ngày 23/09 (#23)
* 3c84adc docs: cập nhật ngày 18/09 (#18)
* 917a54c docs: cập nhật ngày 15/09 (#15)
* 145de3a chore: khởi tạo
 * [new branch]      feat/viec-cua-huy -&gt; feat/viec-cua-huy</div>
<p>Không mất gì: năm commit giờ nằm trên một nhánh, <code>main</code> khớp với cả nhóm, và rebase đặt lại êm (nếu xung đột, giải từng file như Chương 3.4). Hai tuần công sức là quá lớn cho một lần review — chẻ nó thành vài pull request bằng <code>git cherry-pick</code> sang các nhánh nhỏ. <strong>Phòng:</strong> ruleset khiến việc này thất bại ngay ngày 1 thay vì ngày 14; <code>git status</code> in tên nhánh ở ngay dòng đầu. Xem lại: 3.4, 7.1.</p>

<h3>8. Xung đột package-lock.json</h3>
${slide('git-16', 15, '--force-with-lease và xung đột lockfile')}
<p><strong>Triệu chứng.</strong> Linh thêm <code>dayjs</code>, Huy thêm <code>zod</code>, pull request của Linh được merge trước. Huy cập nhật nhánh của mình:</p>
<pre><code class="language-bash">git fetch &amp;&amp; git merge origin/main
git diff --name-only --diff-filter=U</code></pre>
<div class="out">Auto-merging package-lock.json
CONFLICT (content): Merge conflict in package-lock.json
Auto-merging package.json
CONFLICT (content): Merge conflict in package.json
Automatic merge failed; fix conflicts and then commit the result.
package-lock.json
package.json</div>
<p><strong>Cứu.</strong> Không bao giờ sửa tay file lock. <code>package.json</code> nhỏ và dành cho người — giải bằng cách giữ cả hai thư viện. Với file lock, lối tắt hấp dẫn là chạy <code>npm install</code> ngay trên file đang xung đột. Nó đúng là gỡ được dấu xung đột (npm 10.9.4 ở đây), nhưng nhìn xem nó đã giải ra gì:</p>
<div class="out"># thử: npm install trên file lock đang xung đột
phong-kham@1.0.0 ~/phong-kham
+-- dayjs@1.11.23
&#96;-- zod@3.25.76</div>
<p><code>dayjs</code> nhảy từ 1.11.13 — bản <code>main</code> đã khoá và đã test — lên 1.11.23. Cách an toàn hơn giữ nguyên lock của <code>main</code> và chỉ giải lại phần mình thêm. Trong lúc <em>merge</em>, <code>--theirs</code> là nhánh đang được nhập vào, tức <code>main</code> (trong lúc rebase hai chữ này đổi chỗ cho nhau — Chương 3.3):</p>
<pre><code class="language-bash">git checkout --theirs package-lock.json
npm install --package-lock-only      <span class="tok-comment"># trong dự án thật: npm install trơn</span>
git add package.json package-lock.json
npm ls --package-lock-only</code></pre>
<div class="out">Updated 1 path from the index
phong-kham@1.0.0 ~/phong-kham
+-- dayjs@1.11.13
&#96;-- zod@3.25.76</div>
<p><code>dayjs</code> giữ đúng bản 1.11.13 đã test. <code>zod</code> được giải mới lên bản 3.x mới nhất (3.25.76, không phải 3.23.8 Huy từng có) — kiểm bằng <code>npm ls</code> và ghim lại nếu bạn cần đúng bản đó. Rồi chạy test và commit lần merge. (<code>--package-lock-only</code> chỉ cập nhật file lock, không tải thư viện; trong dự án thật, <code>npm install</code> trơn làm y như vậy cộng thêm <code>node_modules</code>.) <strong>Phòng:</strong> thêm thư viện bằng một pull request nhỏ riêng và merge nhanh; mỗi tuần một người làm "chore: cập nhật thư viện" thay vì ai cũng thêm package trong nhánh tính năng. Xem lại: 3.3.</p>

<div class="pitfall co-tieu-de"><strong>Sai lầm gốc đằng sau cả tám.</strong> <b>Sửa trước khi chẩn đoán.</b> Sự cố nào ở trên cũng có một lệnh chẩn đoán một dòng (output của <code>git fetch</code>, <code>status -sb</code>, <code>reflog</code>, <code>log --format</code>, <code>rev-list | cat-file</code>) — người ta bỏ qua nó rồi với tay lấy <code>--force</code> hay <code>reset --hard</code>, biến một tình huống cứu được thành mất thật. <b>Viết lại thứ đã push.</b> Sự cố 2, 3, 4 và 5 đều có cách cứu "chưa push" (viết lại lịch sử) và cách cứu "đã push" (không viết lại); dùng cách thứ nhất sau khi đã push là tạo ra sự cố 1 cho người khác. <b>Sửa một mình, lặng lẽ.</b> Báo cả nhóm trước mọi lần cứu trên nhánh chung — có thể có người đang sắp pull.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong một thư mục thử, tạo một kho bare và hai bản clone (<code>a</code>, <code>b</code>), mỗi bản một <code>user.name</code>; commit và push một file nhỏ từ <code>a</code>.</li><li>Sự cố 1: từ <code>a</code> push một commit lên nhánh chung; từ <code>b</code> (không fetch) amend rồi <code>git push --force-with-lease</code>. Đọc lời từ chối. Rồi làm lại với <code>--force</code>, và cứu commit của <code>a</code> bằng <code>git fetch</code>, <code>git reflog show origin/&lt;nhánh&gt;</code> và <code>git rebase</code>.</li><li>Sự cố 6: <code>git branch -D</code> một nhánh chưa merge rồi đưa nó về bằng mã băm trong lời báo.</li><li>Sự cố 7: tạo ba commit trên <code>main</code> ở <code>b</code>, push một thứ mới từ <code>a</code>, rồi chuyển công sức của <code>b</code> sang một nhánh bằng bốn nước ở trên.</li><li>Chọn thêm một sự cố trong bảng và tái hiện nó mà không đọc lại mục của nó.</li></ol>
<p><strong>Đạt khi:</strong> trong mọi trường hợp <code>git log --all --oneline</code> vẫn chứa mọi commit bạn đã tạo, <code>main</code> của <code>b</code> bằng <code>origin/main</code> (<code>git status -sb</code> không còn ahead/behind), và với mỗi sự cố bạn kể được lệnh chẩn đoán đã chạy đầu tiên.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">(forced update)</span><span class="v">Cập nhật cưỡng bức — thứ <code>git fetch</code> in ra khi một nhánh trên remote bị viết lại, tức có người vừa force-push.</span></div>
  <div class="kv"><span class="k">stale info</span><span class="v">Thông tin đã cũ — <code>--force-with-lease</code> từ chối vì remote đã đổi kể từ lần fetch cuối của bạn.</span></div>
  <div class="kv"><span class="k">Secret rotation</span><span class="v">Đổi khoá — thu hồi khoá bị lộ và cấp khoá mới; là bước ĐẦU TIÊN, trước khi dọn lịch sử.</span></div>
  <div class="kv"><span class="k"><code>revert -m 1</code></span><span class="v">Hoàn tác một merge commit bằng commit mới, giữ cha số 1 (nhánh bạn đang đứng) làm dòng chính.</span></div>
  <div class="kv"><span class="k">Lockfile</span><span class="v">File khoá phiên bản — <code>package-lock.json</code>: đúng các bản đã cài và đã test; được sinh ra, không sửa tay.</span></div>
  <div class="kv"><span class="k"><code>--reset-author</code></span><span class="v">Đặt lại tác giả — đi với <code>commit --amend</code>, ghi tác giả thành <code>user.name</code>/<code>user.email</code> hiện tại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Chẩn đoán trước: <code>git status -sb</code>, <code>git reflog</code>, output của <code>git fetch</code> — sự cố nào cũng tự khai ra trong một dòng.</li><li>Cách cứu "chưa push" được viết lại lịch sử (<code>reset</code>, <code>amend</code>, <code>rebase</code>); cách cứu "đã push" thêm commit mới (<code>revert</code>) hoặc phải bàn với cả nhóm.</li><li>Bí mật bị lộ thì đổi khoá trước, dọn sau; xoá file là không đủ một khi nó đã tới GitHub.</li><li>Nhánh bị xoá và commit bị force-push đè vẫn sống trong reflog và trong nhánh theo dõi remote ở máy bạn cùng nhóm.</li><li>Xung đột lockfile: giải <code>package.json</code> bằng tay, lấy lock của <code>main</code>, để npm chỉ giải lại phần của mình, rồi kiểm <code>npm ls</code>.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-push" target="_blank" rel="noopener">
  <span class="lc-ico">⬆️</span>
  <span class="lc-body"><span class="lc-title">git-push — --force-with-lease</span><span class="lc-sub">Lease được kiểm thế nào, và khi nào nó không đủ.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — About large files on GitHub</span><span class="lc-sub">Cảnh báo 50 MiB, chặn 100 MiB, gỡ file khỏi lịch sử.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/deleting-and-restoring-branches-in-a-pull-request" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Deleting and restoring branches in a pull request</span><span class="lc-sub">Nút Restore branch.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/working-with-push-protection-from-the-command-line" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Push protection from the command line</span><span class="lc-sub">Một lần push bị chặn trông thế nào, và cách gỡ bí mật.</span></span>
</a>
<p class="note-ct"><strong>Nghĩ về nó thế này:</strong> sự cố nhóm hiếm khi là mất công sức — thường là công sức nằm ở một chỗ không ngờ: trong reflog, trong bản clone của bạn cùng nhóm, trên nhầm nhánh. Tìm ra nó đang ở đâu trước khi quyết định làm gì với nó.</p>
</div>
`,
    },

    /* ─────────────────────────── 16.5 Bài thi cuối khoá ─────────────────────────── */
    {
      title: '16.5 — Final exam: the whole course in 20 situations|||16.5 — Bài thi cuối khoá: cả khoá học trong 20 tình huống',
      slug: 'git-16-5-kiem-tra-cuoi-khoa',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Bài thi cuối khoá Git & GitHub: 20 câu tình huống trải đều Chương 1–16, 30 phút, câu nào cũng có giải thích — kèm lời dặn trước khi làm và danh sách năng lực của cả khoá.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Final exam</span>
<h2>The whole course in twenty situations</h2>
<p class="lead">Twenty questions, thirty minutes, one or two from every chapter. None of them asks for a definition — each one is a moment from a real team project where you have to pick the command or the decision. Answer, submit, and then read every explanation, including the ones you got right: the explanation also says why the most tempting wrong answer is wrong, and that is usually where the learning is.</p>

<h3>Before you start</h3>
<ul>
<li>Work without the lessons open, but with a terminal if you like — trying a command in <code>thu-git</code> is allowed and encouraged; it is what you would do at work.</li>
<li>If you score below 14/20, the explanation of each missed question names the chapter to revisit; redo that chapter's practice, not just its quiz.</li>
<li>The chapter-16 cheat sheet and the "what next" map are at the bottom of this page.</li>
</ul>

<h3>Self-check before you start</h3>
<ul>
<li>I can predict what any command does to the working directory, the index and HEAD (Ch 1, 4).</li>
<li>I can find when and why a line changed with <code>log</code>, <code>blame</code>, <code>-S</code> and <code>bisect</code> (Ch 2).</li>
<li>I can branch, merge, resolve a conflict calmly, and clean up my own commits with interactive rebase before review (Ch 3).</li>
<li>I can undo anything — <code>restore</code>, <code>reset</code>, <code>revert</code>, <code>stash</code>, <code>reflog</code> — and know which ones are safe after pushing (Ch 4, 8, 13).</li>
<li>I can work with remotes, pull requests, reviews, branch rules, tags and releases in a team (Ch 5, 6, 7, 11, 12, 16).</li>
<li>I understand the object database well enough to explain why Git rarely loses anything (Ch 9), and I can handle big repositories, my tools, Windows teammates and my public profile (Ch 10, 14, 15).</li>
</ul>
${slide('git-16', 16, 'Bảng tra nhanh Chương 16')}
${slide('git-16', 17, 'Sau khoá này: học gì tiếp')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài thi cuối khoá</span>
<h2>Cả khoá học trong hai mươi tình huống</h2>
<p class="lead">Hai mươi câu, ba mươi phút, mỗi chương một hai câu. Không câu nào hỏi định nghĩa — câu nào cũng là một khoảnh khắc trong đồ án nhóm thật, nơi bạn phải chọn lệnh hoặc quyết định. Làm, nộp, rồi đọc MỌI phần giải thích, kể cả những câu bạn đúng: phần giải thích còn nói vì sao phương án sai hấp dẫn nhất lại sai, và thường đó mới là chỗ học được nhiều nhất.</p>

<h3>Lời dặn trước khi làm</h3>
<ul>
<li>Làm mà không mở bài học, nhưng được mở terminal — thử một lệnh trong <code>thu-git</code> là được phép và nên làm; đi làm bạn cũng sẽ làm vậy.</li>
<li>Nếu dưới 14/20, phần giải thích của mỗi câu sai có ghi chương cần xem lại; làm lại phần thực hành của chương đó, không chỉ làm lại quiz.</li>
<li>Bảng tra nhanh Chương 16 và bản đồ "học gì tiếp" nằm ở cuối trang này.</li>
</ul>

<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đoán trước được mọi lệnh sẽ làm gì với thư mục làm việc, index và HEAD (Ch 1, 4).</li>
<li>Tôi tìm được một dòng đổi lúc nào và vì sao bằng <code>log</code>, <code>blame</code>, <code>-S</code> và <code>bisect</code> (Ch 2).</li>
<li>Tôi tạo nhánh, merge, giải xung đột bình tĩnh, và dọn commit của mình bằng rebase tương tác trước khi xin review (Ch 3).</li>
<li>Tôi hoàn tác được mọi thứ — <code>restore</code>, <code>reset</code>, <code>revert</code>, <code>stash</code>, <code>reflog</code> — và biết cái nào an toàn sau khi đã push (Ch 4, 8, 13).</li>
<li>Tôi làm việc được với remote, pull request, review, luật nhánh, tag và bản phát hành trong một nhóm (Ch 5, 6, 7, 11, 12, 16).</li>
<li>Tôi hiểu kho đối tượng đủ để giải thích vì sao Git hiếm khi làm mất gì (Ch 9), và xử lý được kho lớn, công cụ của mình, bạn dùng Windows và hồ sơ công khai của mình (Ch 10, 14, 15).</li>
</ul>
${slide('git-16', 16, 'Bảng tra nhanh Chương 16')}
${slide('git-16', 17, 'Sau khoá này: học gì tiếp')}
</div>
`,
      quiz: {
        timeLimitSeconds: 1800,
        questions: [
          {
            question: 'You fix a bug in app.js and run git add app.js. Before committing, you add a console.log("debug") to the same file and save. You now run git commit -m "fix: …". What does the commit contain?|||Bạn sửa một lỗi trong app.js và chạy git add app.js. Trước khi commit, bạn thêm console.log("debug") vào đúng file đó và lưu. Giờ bạn chạy git commit -m "fix: …". Commit chứa gì?',
            options: [
              'The file as it is on disk now, including the console.log|||File đúng như trên đĩa lúc này, có cả console.log',
              'Nothing — Git refuses to commit a file that changed after git add|||Không gì cả — Git từ chối commit một file đã đổi sau git add',
              'The version you staged with git add: the fix without the console.log|||Bản bạn đã stage bằng git add: bản sửa, không có console.log',
              'The fix, and the console.log is automatically staged as a second commit|||Bản sửa, còn console.log tự động được stage thành commit thứ hai',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: git add copies a snapshot of the file into the index; git commit records the index, not the working directory. The later console.log stays as an unstaged change (git status shows the file as both staged and modified). The tempting "the file on disk" answer is how commit -a behaves, which is exactly why add -p and git diff --staged exist. Revisit: Chapter 1.1, 1.3.|||VI: git add chép một ảnh chụp của file vào index; git commit ghi lại index, không ghi thư mục làm việc. console.log thêm sau vẫn là thay đổi chưa stage (git status hiện file vừa staged vừa modified). Đáp án hấp dẫn "file trên đĩa" là cách commit -a hoạt động — chính vì vậy mới có add -p và git diff --staged. Xem lại: Chương 1.1, 1.3.',
          },
          {
            question: 'The team’s .env was committed on day 1. On day 2 you add .env to .gitignore and commit, but git status still shows .env as modified whenever someone edits it. What is the fix?|||File .env của nhóm bị commit từ ngày 1. Ngày 2 bạn thêm .env vào .gitignore và commit, nhưng hễ ai sửa .env là git status vẫn hiện nó bị modified. Sửa thế nào?',
            options: [
              'git rm --cached .env and commit — .gitignore does not apply to files Git already tracks|||git rm --cached .env rồi commit — .gitignore không áp dụng cho file Git đã theo dõi',
              'Move the .env line to the top of .gitignore so it takes priority|||Đưa dòng .env lên đầu .gitignore để nó được ưu tiên',
              'Run git update-index --skip-worktree .env on the lead’s machine|||Chạy git update-index --skip-worktree .env trên máy trưởng nhóm',
              'Delete .gitignore and create it again, then commit|||Xoá .gitignore rồi tạo lại, sau đó commit',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Ignore rules only affect untracked files. Once .env is in the index, Git keeps tracking it until you remove it from the index with git rm --cached (the file stays on disk) and commit. If it contained real secrets and was pushed, rotate them too (Chapter 8.3). skip-worktree is a per-machine trick that hides changes on one laptop and fixes nothing for the team; the order of lines in .gitignore is irrelevant here. Revisit: Chapter 1.5.|||VI: Luật bỏ qua chỉ có tác dụng với file chưa được theo dõi. Một khi .env đã nằm trong index, Git tiếp tục theo dõi nó cho tới khi bạn gỡ nó khỏi index bằng git rm --cached (file vẫn ở trên đĩa) rồi commit. Nếu nó chứa bí mật thật và đã push thì còn phải đổi khoá (Chương 8.3). skip-worktree là mẹo theo từng máy, chỉ giấu thay đổi trên một laptop, không sửa gì cho cả nhóm; thứ tự dòng trong .gitignore không liên quan ở đây. Xem lại: Chương 1.5.',
          },
          {
            question: 'The booking page worked at v1.0.0 and is broken now, 60 commits later. You have a script test/lich.sh that exits 0 when the page works and 1 when it is broken. What finds the guilty commit fastest?|||Trang đặt lịch chạy được ở v1.0.0 và giờ hỏng, sau 60 commit. Bạn có script test/lich.sh thoát 0 khi trang chạy và 1 khi hỏng. Cách nào tìm ra commit thủ phạm nhanh nhất?',
            options: [
              'git log -p v1.0.0..HEAD and read every diff|||git log -p v1.0.0..HEAD rồi đọc từng diff',
              'git blame on the booking page file|||git blame file của trang đặt lịch',
              'git revert the last 60 commits one by one until it works|||git revert lần lượt 60 commit gần nhất tới khi chạy được',
              'git bisect start HEAD v1.0.0, then git bisect run test/lich.sh|||git bisect start HEAD v1.0.0, rồi git bisect run test/lich.sh',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: bisect does a binary search: about 6 test runs for 60 commits (log2 60 ≈ 6), and bisect run executes your script at each step, using exit code 0 as good and 1–127 (except 125, "skip") as bad. Reading 60 diffs is slow and misses bugs caused by interactions; blame only shows who last touched each line of one file — the bug may come from another file. Revisit: Chapter 2.4.|||VI: bisect tìm kiếm nhị phân: khoảng 6 lần chạy test cho 60 commit (log2 60 ≈ 6), và bisect run tự chạy script ở mỗi bước, coi mã thoát 0 là tốt, 1–127 (trừ 125 — "bỏ qua") là hỏng. Đọc 60 diff thì chậm và bỏ sót lỗi do hai thay đổi kết hợp; blame chỉ cho biết ai chạm lần cuối vào từng dòng của MỘT file — lỗi có thể đến từ file khác. Xem lại: Chương 2.4.',
          },
          {
            question: 'You created feat/form from main, made 3 commits, and nobody has touched main since. On main you run git merge feat/form and Git prints "Fast-forward". What happened?|||Bạn tạo feat/form từ main, làm 3 commit, và từ đó không ai đụng vào main. Đứng ở main bạn chạy git merge feat/form và Git in "Fast-forward". Chuyện gì đã xảy ra?',
            options: [
              'Git created one merge commit with two parents|||Git tạo một merge commit có hai cha',
              'main was simply moved forward to feat/form’s last commit; no new commit was created|||main chỉ được dời tới commit cuối của feat/form; không commit mới nào được tạo',
              'Git squashed the 3 commits into one commit on main|||Git gộp 3 commit thành một commit trên main',
              'Git rebased the 3 commits onto main, giving them new hashes|||Git rebase 3 commit lên main, cho chúng mã băm mới',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: When the current branch is an ancestor of the branch being merged, there is nothing to combine: Git just moves the main pointer forward (a branch is only a pointer to a commit). The three commits keep their hashes. A merge commit appears only with --no-ff or when both sides have new commits (a three-way merge); squashing is what --squash or GitHub’s button does, not a plain merge. Revisit: Chapter 3.1, 3.2.|||VI: Khi nhánh hiện tại là tổ tiên của nhánh được merge, chẳng có gì để ghép: Git chỉ dời con trỏ main lên phía trước (nhánh chỉ là một con trỏ tới commit). Ba commit giữ nguyên mã băm. Merge commit chỉ xuất hiện với --no-ff hoặc khi cả hai phía đều có commit mới (merge ba chiều); squash là việc của --squash hoặc nút của GitHub, không phải của merge trơn. Xem lại: Chương 3.1, 3.2.',
          },
          {
            question: 'Your branch, not yet pushed, has 5 commits: "form", "wip", "wip 2", "sửa typo", "form xong". Before opening the pull request you want 1 clean commit "feat(ui): form đặt lịch". What do you do?|||Nhánh của bạn, chưa push, có 5 commit: "form", "wip", "wip 2", "sửa typo", "form xong". Trước khi mở pull request bạn muốn còn 1 commit sạch "feat(ui): form đặt lịch". Làm gì?',
            options: [
              'git commit --amend five times|||git commit --amend năm lần',
              'git rebase -i main, keep the first as pick (reword it) and mark the other four as fixup|||git rebase -i main, giữ commit đầu là pick (đổi lời nhắn) và đánh dấu bốn commit sau là fixup',
              'git revert the four extra commits|||git revert bốn commit thừa',
              'git merge --squash main into the branch|||git merge --squash main vào nhánh',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Interactive rebase rewrites your own unpushed commits: fixup folds a commit into the one above it and drops its message; reword lets you set the final message. amend only ever touches the last commit; revert adds new commits that undo old ones — the history gets longer, not cleaner; merge --squash of main into your branch brings main’s changes in, which is the wrong direction entirely. Revisit: Chapter 3.5.|||VI: Rebase tương tác viết lại những commit chưa push của chính bạn: fixup gộp một commit vào commit phía trên nó và bỏ lời nhắn của nó; reword cho bạn đặt lời nhắn cuối. amend chỉ bao giờ chạm vào commit cuối cùng; revert thêm commit mới để hoàn tác commit cũ — lịch sử dài thêm chứ không sạch hơn; merge --squash main vào nhánh là đưa thay đổi của main vào, sai hướng hoàn toàn. Xem lại: Chương 3.5.',
          },
          {
            question: 'You just committed on your local branch but forgot to include one file, and the message is wrong too. Nothing is pushed. You want the changes back in the index so you can redo the commit. Which command?|||Bạn vừa commit trên nhánh ở máy nhưng quên một file, và lời nhắn cũng sai. Chưa push gì. Bạn muốn thay đổi quay về index để làm lại commit. Lệnh nào?',
            options: [
              'git reset --hard HEAD~1|||git reset --hard HEAD~1',
              'git revert HEAD|||git revert HEAD',
              'git restore --staged .|||git restore --staged .',
              'git reset --soft HEAD~1|||git reset --soft HEAD~1',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: reset --soft moves the branch back one commit and leaves both the index and the working directory untouched, so the changes are staged and ready to be committed again (git commit --amend after adding the file would also work). --hard would throw the changes away; revert adds a new commit that undoes the old one — the right tool after pushing, the wrong one here; restore --staged only unstages, it does not undo the commit. Revisit: Chapter 4.2.|||VI: reset --soft dời nhánh lùi một commit và để nguyên cả index lẫn thư mục làm việc, nên thay đổi vẫn đang được stage, sẵn sàng commit lại (add file rồi git commit --amend cũng được). --hard vứt bỏ thay đổi; revert thêm một commit mới hoàn tác commit cũ — đúng công cụ sau khi đã push, sai công cụ ở đây; restore --staged chỉ bỏ stage, không huỷ commit. Xem lại: Chương 4.2.',
          },
          {
            question: 'A commit that broke the booking API is already on main, and three teammates have pulled it. What is the right way to undo it?|||Một commit làm hỏng API đặt lịch đã nằm trên main, và ba bạn cùng nhóm đã pull về. Hoàn tác thế nào cho đúng?',
            options: [
              'git revert <hash>, then push (through a pull request if main is protected)|||git revert <mã>, rồi push (qua pull request nếu main được bảo vệ)',
              'git reset --hard <hash>~1 on main, then git push --force|||git reset --hard <mã>~1 trên main, rồi git push --force',
              'git commit --amend on main and push|||git commit --amend trên main rồi push',
              'Delete main on GitHub and push it again from your laptop|||Xoá main trên GitHub rồi push lại từ laptop của mình',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: revert adds a new commit that applies the inverse change; nobody’s history is rewritten, so the teammates simply pull it. reset + force-push rewrites shared history — the three teammates now have commits the remote no longer has, and the next push from any of them brings the bad commit back (and a ruleset would block it anyway). amend also rewrites; deleting main is the same mistake with more drama. Revisit: Chapter 4.3.|||VI: revert thêm một commit mới áp thay đổi ngược lại; lịch sử của không ai bị viết lại, các bạn chỉ việc pull. reset + force-push viết lại lịch sử chung — ba bạn kia giữ những commit remote không còn, và lần push kế tiếp của bất kỳ ai đưa commit hỏng quay lại (và ruleset cũng sẽ chặn nó). amend cũng viết lại; xoá main là cùng sai lầm đó nhưng kịch tính hơn. Xem lại: Chương 4.3.',
          },
          {
            question: 'You want to see what your teammates pushed to main since this morning, without changing anything in your working directory or your current branch. What do you run?|||Bạn muốn xem các bạn đã push gì lên main từ sáng, mà không thay đổi gì trong thư mục làm việc hay nhánh hiện tại. Chạy gì?',
            options: [
              'git pull, then git log|||git pull, rồi git log',
              'git switch main, then git status|||git switch main, rồi git status',
              'git fetch, then git log --oneline HEAD..origin/main|||git fetch, rồi git log --oneline HEAD..origin/main',
              'git clone the repository again into a new folder|||git clone lại repo vào một thư mục mới',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: fetch only updates the remote-tracking branches (origin/main); your branches and files stay as they are. HEAD..origin/main then lists exactly the commits you do not have yet. pull is fetch plus merge (or rebase) into your current branch — it changes your branch, the thing you wanted to avoid; switching to main still shows your stale local main; re-cloning works but throws away the point of having a remote. Revisit: Chapter 5.1.|||VI: fetch chỉ cập nhật nhánh theo dõi remote (origin/main); nhánh và file của bạn giữ nguyên. HEAD..origin/main khi đó liệt kê đúng những commit bạn chưa có. pull là fetch cộng merge (hoặc rebase) vào nhánh hiện tại — nó đổi nhánh của bạn, đúng thứ bạn muốn tránh; switch sang main vẫn chỉ thấy main cũ ở máy; clone lại thì chạy được nhưng bỏ phí cái lợi của remote. Xem lại: Chương 5.1.',
          },
          {
            question: 'Your team merges pull requests into a branch named develop; main is the default branch. A PR into develop with "Closes #12" in its description was merged, but issue #12 is still open. Why?|||Nhóm bạn merge pull request vào nhánh develop; main là nhánh mặc định. Một PR vào develop có "Closes #12" trong mô tả đã được merge, nhưng issue #12 vẫn mở. Vì sao?',
            options: [
              'The keyword must be "Fixes", not "Closes"|||Từ khoá phải là "Fixes", không phải "Closes"',
              'Issues only close when the PR author closes them manually|||Issue chỉ đóng khi tác giả PR tự tay đóng',
              'The PR had to be squash-merged for the keyword to work|||PR phải được squash merge thì từ khoá mới có tác dụng',
              'Closing keywords only take effect when the PR is merged into the default branch|||Từ khoá đóng issue chỉ có tác dụng khi PR được merge vào nhánh mặc định',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: docs.github.com is explicit: the linked issue is closed automatically when the pull request is merged into the default branch. close, closes, fixes and resolves (and variants) all work, and the merge method does not matter. With a develop branch, the issue closes when develop is later merged into main — or you close it by hand. Revisit: Chapter 6.1, 11.1; lesson 16.2.|||VI: docs.github.com ghi rõ: issue được liên kết tự đóng khi pull request được merge vào nhánh MẶC ĐỊNH. close, closes, fixes, resolves (và các biến thể) đều dùng được, và cách merge không quan trọng. Với nhánh develop, issue đóng khi develop sau này được merge vào main — hoặc bạn tự đóng tay. Xem lại: Chương 6.1, 11.1; bài 16.2.',
          },
          {
            question: 'You ran git tag -a v1.0.0 -m "Bản nộp" and then git push. On GitHub the commits are there but the lecturer finds no tag v1.0.0. What went wrong?|||Bạn chạy git tag -a v1.0.0 -m "Bản nộp" rồi git push. Trên GitHub commit đã có nhưng thầy không thấy tag v1.0.0 nào. Sai ở đâu?',
            options: [
              'Annotated tags are only visible after a GitHub Release is created|||Tag có chú thích chỉ hiện sau khi tạo GitHub Release',
              'git push does not send tags by default; run git push origin v1.0.0|||git push mặc định không gửi tag; chạy git push origin v1.0.0',
              'Tag names cannot start with "v" on GitHub|||Trên GitHub tên tag không được bắt đầu bằng "v"',
              'The tag was created on the wrong commit and GitHub rejected it|||Tag được tạo trên nhầm commit nên GitHub từ chối',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: A plain git push sends branches, not tags. Push the tag explicitly (git push origin v1.0.0), or use git push --follow-tags / the push.followTags setting for annotated tags. A Release is built on top of a tag that already exists on GitHub, not the other way round; "v1.0.0" is the most common tag name there is. Revisit: Chapter 5.3, 7.2; lesson 16.3.|||VI: git push trơn gửi nhánh, không gửi tag. Push tag một cách tường minh (git push origin v1.0.0), hoặc dùng git push --follow-tags / thiết lập push.followTags cho tag có chú thích. Release được dựng trên một tag đã có trên GitHub chứ không ngược lại; "v1.0.0" là tên tag phổ biến nhất có thể. Xem lại: Chương 5.3, 7.2; bài 16.3.',
          },
          {
            question: 'You rebased your own already-pushed branch feat/3-api onto the new main to resolve conflicts. git push is rejected (non-fast-forward). What is the right push?|||Bạn rebase nhánh feat/3-api của chính mình (đã push) lên main mới để giải xung đột. git push bị từ chối (non-fast-forward). Push thế nào cho đúng?',
            options: [
              'git push --force-with-lease|||git push --force-with-lease',
              'git push --force|||git push --force',
              'git pull, then git push|||git pull, rồi git push',
              'Delete the remote branch and push under a new name|||Xoá nhánh trên remote rồi push dưới tên mới',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: After a rebase, overwriting the remote branch is intended — but only if nobody pushed to it meanwhile. --force-with-lease overwrites only when the remote still points where your last fetch saw it, and refuses with "stale info" otherwise. Plain --force overwrites whatever is there, including a teammate’s review fix; git pull would merge the old pre-rebase commits back in, doubling every commit. Revisit: Chapter 8.2; lesson 16.4 (incident 1).|||VI: Sau rebase, ghi đè nhánh trên remote là chủ ý — nhưng chỉ khi trong lúc đó không ai push lên nó. --force-with-lease chỉ ghi đè khi remote vẫn trỏ đúng chỗ lần fetch cuối bạn thấy, không thì từ chối với "stale info". --force trơn ghi đè bất kể có gì, kể cả bản sửa review của bạn cùng nhóm; git pull sẽ merge các commit cũ trước-rebase quay lại, nhân đôi mọi commit. Xem lại: Chương 8.2; bài 16.4 (sự cố 1).',
          },
          {
            question: 'An e-mail API key was committed and pushed to the team’s PUBLIC repository an hour ago. What is the FIRST thing to do?|||Một khoá API gửi email bị commit và push lên repo PUBLIC của nhóm từ một giờ trước. Việc ĐẦU TIÊN phải làm là gì?',
            options: [
              'Run git filter-repo to remove the key from all history, then force-push|||Chạy git filter-repo gỡ khoá khỏi toàn bộ lịch sử, rồi force-push',
              'git revert the commit that added the key|||git revert commit đã thêm khoá',
              'Revoke the key at the provider and issue a new one; clean history afterwards|||Thu hồi khoá ở nhà cung cấp và cấp khoá mới; dọn lịch sử sau',
              'Make the repository private so nobody else can see it|||Chuyển repo sang private để không ai khác xem được',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Once a secret has been on a public repository it must be treated as stolen — bots scan public pushes within minutes, and forks and clones keep copies. Rotation is the only step that actually stops the damage; rewriting history (filter-repo + force-push + everyone re-clones) is the cleanup that comes after. Reverting leaves the key in history; going private does not un-leak it. Revisit: Chapter 8.3, 11.3; lesson 16.4 (incident 2).|||VI: Một khi bí mật đã nằm trên repo public, phải coi như nó đã bị lấy — bot quét các lần push công khai chỉ trong vài phút, và fork, clone vẫn giữ bản sao. Đổi khoá là bước duy nhất thật sự chặn thiệt hại; viết lại lịch sử (filter-repo + force-push + cả nhóm clone lại) là việc dọn dẹp làm SAU. revert để nguyên khoá trong lịch sử; chuyển private không làm nó hết bị lộ. Xem lại: Chương 8.3, 11.3; bài 16.4 (sự cố 2).',
          },
          {
            question: 'The same 2 MB logo.png is committed in both public/ and docs/. How many blob objects does Git store for it?|||Cùng một file logo.png 2 MB được commit ở cả public/ lẫn docs/. Git lưu bao nhiêu đối tượng blob cho nó?',
            options: [
              'Two — one per path|||Hai — mỗi đường dẫn một cái',
              'One — a blob is named by the hash of its content, and both trees point to it|||Một — blob được đặt tên theo mã băm của nội dung, và cả hai tree cùng trỏ tới nó',
              'Two now, merged into one only after git gc|||Hai lúc này, chỉ gộp thành một sau git gc',
              'None — binary files are stored outside the object database|||Không cái nào — file nhị phân được lưu bên ngoài kho đối tượng',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Objects are content-addressed: identical content has an identical hash, so there is exactly one blob, referenced from two different tree entries (the file name lives in the tree, not in the blob). This is not something gc does later — it is true the moment the objects are written. Binary files are ordinary blobs unless you opt into Git LFS. Revisit: Chapter 9.2.|||VI: Đối tượng được định danh theo nội dung: nội dung giống hệt thì mã băm giống hệt, nên chỉ có đúng một blob, được hai mục trong hai tree trỏ tới (tên file nằm trong tree, không nằm trong blob). Đây không phải việc gc làm về sau — nó đúng ngay lúc đối tượng được ghi. File nhị phân vẫn là blob bình thường, trừ khi bạn chủ động dùng Git LFS. Xem lại: Chương 9.2.',
          },
          {
            question: 'You are halfway through a big feature with the dev server running when the lead asks for an urgent fix on main. You do not want to stash, stop the server or lose your editor state. What fits best?|||Bạn đang làm dở một tính năng lớn, dev server đang chạy, thì trưởng nhóm nhờ sửa gấp trên main. Bạn không muốn stash, dừng server hay mất trạng thái trình soạn thảo. Cách nào hợp nhất?',
            options: [
              'git clone the repository again next to the current one|||git clone lại repo ngay cạnh repo hiện tại',
              'git switch main with uncommitted changes and hope nothing conflicts|||git switch main khi còn thay đổi chưa commit và mong không xung đột',
              'Commit the half-done work as "wip" directly on main|||Commit phần làm dở thành "wip" thẳng lên main',
              'git worktree add ../phong-kham-hotfix -b fix/gap origin/main|||git worktree add ../phong-kham-hotfix -b fix/gap origin/main',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: A worktree is a second working directory attached to the same repository: another branch checked out in another folder, sharing objects and refs, while your feature folder stays exactly as it is. A second clone also works but duplicates the object database and has separate refs you must keep in sync; switching with a dirty tree either fails or carries your changes along; a "wip" commit on main is the kind of thing a ruleset exists to block. Revisit: Chapter 10.1.|||VI: Worktree là một thư mục làm việc thứ hai gắn vào cùng một repo: một nhánh khác được checkout ở thư mục khác, dùng chung đối tượng và ref, trong khi thư mục tính năng của bạn giữ nguyên như cũ. Clone thêm một bản cũng được nhưng nhân đôi kho đối tượng và có ref riêng phải tự đồng bộ; switch khi cây còn bẩn thì hoặc bị từ chối hoặc mang thay đổi theo; commit "wip" lên main đúng là thứ ruleset sinh ra để chặn. Xem lại: Chương 10.1.',
          },
          {
            question: 'Your CI workflow has only on: pull_request. Two PRs were each green, but after both were merged main no longer builds, and nobody noticed for two days. What change to the workflow catches this?|||Workflow CI của bạn chỉ có on: pull_request. Hai PR đều xanh, nhưng sau khi cả hai được merge thì main không build nổi, và hai ngày không ai hay. Sửa workflow thế nào để bắt được chuyện này?',
            options: [
              'Also trigger on push to main: on: { pull_request: {}, push: { branches: [main] } }|||Chạy thêm khi push lên main: on: { pull_request: {}, push: { branches: [main] } }',
              'Add timeout-minutes: 10 to the job|||Thêm timeout-minutes: 10 cho job',
              'Add permissions: contents: write|||Thêm permissions: contents: write',
              'Run the workflow only on a nightly schedule instead|||Chỉ chạy workflow theo lịch mỗi đêm thay vì theo PR',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Each PR was tested against the main of its own moment; the combination was never tested. Running CI on push to main tests every merge result immediately (the alternative is ticking "Require branches to be up to date before merging", which forces re-tests before each merge). A timeout or wider permissions change nothing about what is tested; a nightly schedule instead of PR checks removes the check reviewers rely on. Revisit: Chapter 11.2; lesson 16.1.|||VI: Mỗi PR được test với main của thời điểm của nó; tổ hợp hai cái thì chưa từng được test. Chạy CI khi push lên main test ngay mọi kết quả merge (cách khác là tích "Require branches to be up to date before merging", buộc test lại trước mỗi lần merge). Timeout hay mở rộng quyền không đổi gì trong thứ được test; chỉ chạy theo lịch mỗi đêm thay cho PR thì mất luôn phép kiểm mà người review dựa vào. Xem lại: Chương 11.2; bài 16.1.',
          },
          {
            question: 'Cường wrote a pre-commit hook in .git/hooks/pre-commit that blocks commits containing .env. It works on his laptop, but Linh still commits .env. Why, and what is the fix?|||Cường viết hook pre-commit trong .git/hooks/pre-commit chặn commit có .env. Nó chạy trên laptop của Cường, nhưng Linh vẫn commit được .env. Vì sao, và sửa thế nào?',
            options: [
              'Hooks only run on macOS; Linh uses Windows|||Hook chỉ chạy trên macOS; Linh dùng Windows',
              'Linh must run git gc to download the hooks|||Linh phải chạy git gc để tải hook về',
              '.git/hooks is not versioned or cloned; commit the hook to a tracked folder and set core.hooksPath (or use husky)|||.git/hooks không được quản lý phiên bản cũng không được clone; commit hook vào một thư mục được theo dõi và đặt core.hooksPath (hoặc dùng husky)',
              'The hook must be named pre-commit.sh to be picked up|||Hook phải đặt tên pre-commit.sh mới được nhận',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Nothing inside .git/ travels with a clone except the objects and refs; each clone has its own hooks folder. Put the hooks in a tracked directory (for example .githooks/) and have each clone run git config core.hooksPath .githooks — or let husky do it on npm install. Even then a hook is a convenience that anyone can skip with --no-verify, which is why the same check also belongs in CI and push protection. Hooks do run on Windows via Git for Windows; the file must be named exactly pre-commit. Revisit: Chapter 12.1, 12.3.|||VI: Không gì bên trong .git/ đi theo khi clone ngoài đối tượng và ref; mỗi bản clone có thư mục hooks riêng. Đặt hook trong một thư mục được theo dõi (ví dụ .githooks/) và cho mỗi bản clone chạy git config core.hooksPath .githooks — hoặc để husky làm việc đó khi npm install. Kể cả vậy, hook chỉ là tiện ích mà ai cũng bỏ qua được bằng --no-verify, nên cùng phép kiểm đó còn phải có trong CI và push protection. Hook vẫn chạy trên Windows qua Git for Windows; file phải tên đúng là pre-commit. Xem lại: Chương 12.1, 12.3.',
          },
          {
            question: 'You meant to type git reset --soft HEAD~1 but ran git reset --hard HEAD~3 on your branch. Three committed commits "disappeared". How do you get them back?|||Bạn định gõ git reset --soft HEAD~1 nhưng lại chạy git reset --hard HEAD~3 trên nhánh của mình. Ba commit đã commit "biến mất". Lấy lại thế nào?',
            options: [
              'They are gone; reset --hard deletes commits permanently|||Chúng mất rồi; reset --hard xoá commit vĩnh viễn',
              'git revert HEAD~3|||git revert HEAD~3',
              'git stash pop|||git stash pop',
              'git reflog shows the previous position; git reset --hard HEAD@{1}|||git reflog cho thấy vị trí trước đó; git reset --hard HEAD@{1}',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: reset only moves the branch pointer; the commits still exist, and the reflog records where HEAD was before the move — HEAD@{1}. Resetting back to it restores the branch exactly (by default reflog entries are kept for at least 30 days for unreachable commits). The one thing reset --hard really destroys is uncommitted changes, which were never commits. revert and stash pop do not address this at all. Revisit: Chapter 4.4, 13.1.|||VI: reset chỉ dời con trỏ nhánh; các commit vẫn còn, và reflog ghi lại HEAD ở đâu trước lần dời đó — HEAD@{1}. Reset ngược về đó trả nhánh về y nguyên (mặc định mục reflog của commit không còn với tới được giữ ít nhất 30 ngày). Thứ duy nhất reset --hard phá thật là thay đổi chưa commit, vốn chưa bao giờ là commit. revert và stash pop không giải quyết gì ở đây. Xem lại: Chương 4.4, 13.1.',
          },
          {
            question: 'Since Huy (Windows) joined, every PR he opens shows whole files as changed even when he edited one line. What fixes it for the whole team, permanently?|||Từ khi Huy (dùng Windows) vào nhóm, PR nào của Huy cũng hiện cả file bị đổi dù chỉ sửa một dòng. Cách nào sửa cho cả nhóm, một lần là xong?',
            options: [
              'Ask Huy to set core.autocrlf false on his laptop|||Nhờ Huy đặt core.autocrlf false trên laptop của mình',
              'Commit a .gitattributes with "* text=auto eol=lf", then git add --renormalize . and commit|||Commit .gitattributes với "* text=auto eol=lf", rồi git add --renormalize . và commit',
              'Tell reviewers to tick "Hide whitespace" on GitHub|||Dặn người review tích "Hide whitespace" trên GitHub',
              'Convert every file to CRLF so that everyone matches Windows|||Đổi mọi file sang CRLF cho khớp với Windows',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: The diffs are line endings (CRLF vs LF). .gitattributes is committed, so it applies to every clone and overrides each person’s core.autocrlf; renormalize rewrites the files already in the index under the new rule, in one separate commit. A per-laptop setting depends on every future teammate remembering it; hiding whitespace hides the symptom only in the review view; CRLF everywhere breaks shell scripts on Linux, CI and Docker. Revisit: Chapter 14.4.|||VI: Khác biệt nằm ở ký tự xuống dòng (CRLF và LF). .gitattributes được commit, nên áp dụng cho mọi bản clone và thắng core.autocrlf của từng người; renormalize ghi lại các file đang có trong index theo luật mới, gói trong một commit riêng. Thiết lập theo từng laptop phụ thuộc vào việc mọi bạn mới sau này đều nhớ; ẩn khoảng trắng chỉ giấu triệu chứng trong màn hình review; CRLF khắp nơi làm hỏng script shell trên Linux, CI và Docker. Xem lại: Chương 14.4.',
          },
          {
            question: 'Your team’s public repository has no LICENSE file. A company wants to reuse your booking module in its product. What is the legal default?|||Repo public của nhóm bạn không có file LICENSE. Một công ty muốn dùng lại module đặt lịch của bạn trong sản phẩm của họ. Mặc định về pháp lý là gì?',
            options: [
              'Normal copyright applies: they may view it (and fork it on GitHub) but have no permission to use, modify or distribute it|||Bản quyền thông thường áp dụng: họ được xem (và fork trên GitHub) nhưng không có quyền dùng, sửa hay phân phối',
              'Public repositories are public domain, so anyone can use the code|||Repo public là tài sản công cộng, ai cũng dùng được mã',
              'GitHub applies the MIT license automatically to public repositories|||GitHub tự động áp giấy phép MIT cho repo public',
              'They may use it if they credit the team in their README|||Họ được dùng nếu ghi công nhóm trong README',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Without a license, default copyright law applies: the authors keep all rights. GitHub’s terms let others view and fork public repositories on GitHub, but that grants no right to reuse the code elsewhere. "Public" is about visibility, not permission; there is no automatic MIT; attribution is a condition of some licenses, not a substitute for one. If you want your portfolio code reused, add a license such as MIT. Revisit: Chapter 15.1.|||VI: Không có giấy phép thì luật bản quyền mặc định áp dụng: tác giả giữ mọi quyền. Điều khoản của GitHub cho người khác xem và fork repo public ngay trên GitHub, nhưng không trao quyền dùng lại mã ở nơi khác. "Public" nói về ai nhìn thấy, không nói về quyền; không có MIT tự động; ghi công là điều kiện của một số giấy phép, không thay được giấy phép. Muốn mã trong portfolio được dùng lại thì thêm một giấy phép như MIT. Xem lại: Chương 15.1.',
          },
          {
            question: 'You submitted tag v1.0.0. Since then main has two merged PRs that were not part of the graded version. A bug in v1.0.0 must be fixed and resubmitted as v1.0.1. Where do you make the fix?|||Bạn đã nộp tag v1.0.0. Từ đó main có thêm hai PR đã merge không nằm trong bản được chấm. Một lỗi của v1.0.0 phải được sửa và nộp lại thành v1.0.1. Sửa ở đâu?',
            options: [
              'On main, then tag main as v1.0.1|||Trên main, rồi gắn tag v1.0.1 cho main',
              'Move the v1.0.0 tag to a new commit containing the fix|||Dời tag v1.0.0 sang một commit mới có bản sửa',
              'On a branch created from the tag (git switch -c hotfix/1.0.1 v1.0.0), tag v1.0.1 there, then cherry-pick -x the fix onto main|||Trên một nhánh tạo từ tag (git switch -c hotfix/1.0.1 v1.0.0), gắn tag v1.0.1 ở đó, rồi cherry-pick -x bản sửa về main',
              'Revert the two new PRs on main, fix, tag v1.0.1, then re-apply them|||Revert hai PR mới trên main, sửa, gắn tag v1.0.1, rồi áp lại chúng',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: v1.0.1 must be v1.0.0 plus the fix and nothing else, so the hotfix starts from the tag; git log v1.0.0..v1.0.1 then proves it. Tagging main would ship the two ungraded features; moving v1.0.0 breaks the meaning of the submitted version for everyone who already fetched it; reverting and re-applying works in theory but churns main for no reason. Cherry-picking the fix onto main (through a PR) prevents the bug from returning in the next release. Revisit: Chapter 7.3; lesson 16.3.|||VI: v1.0.1 phải là v1.0.0 cộng bản sửa, không gì khác, nên hotfix bắt đầu từ tag; git log v1.0.0..v1.0.1 sau đó chứng minh điều ấy. Gắn tag cho main là nộp kèm hai tính năng chưa được chấm; dời v1.0.0 phá ý nghĩa của bản đã nộp với mọi người đã fetch nó; revert rồi áp lại về lý thuyết được nhưng làm main rối vô ích. Cherry-pick bản sửa về main (qua PR) để lỗi không quay lại ở bản phát hành sau. Xem lại: Chương 7.3; bài 16.3.',
          },
        ],
      },
    },
  ],
};
