/**
 * SWP391 · Chapter 6 — Iteration releases: tags, packages & deployment.
 * The old chapter was titled "Milestone 3: Deployment" (Week 10, staging URL, v1.0.0) — that is
 * not how SWP391 works. The Subject/Student Guides define 3 ITERATIONS, each ending in a submitted
 * package: Project Tracking xlsx + RDS + links to every member's demo video + a GitLab TAG of the
 * iteration's source with the DB scripts (Student Guides slide 6, Subject Guides slide 6), the tag
 * being created/annotated/with files attached as on Student Guides slide 18.
 *   6.1 What you submit each iteration + tagging the release on GitLab   (g-student 6, 18)
 *   6.2 The DB script and the per-member demo video
 *   6.3 Running it outside your laptop: WAR on Tomcat, MySQL dump/restore, a free cloud option, MailTrap
 *   Iteration 3 / final package checklist (slug kept: swp391-milestone-3-checklist)
 *   Quiz 6 (new)
 */
import { walk, walkHead, slide, bi, books, ansEn, ansVi } from './_slides.mjs';

/* ─────────────────────── 6.1 Iteration package + GitLab tag ─────────────────────── */
const L61 = {
  title: '6.1 — What you submit each iteration, and tagging the release on GitLab|||6.1 — Nộp gì sau mỗi iteration, và gắn tag bản phát hành trên GitLab',
  slug: 'swp391-6-1-build-staging-cicd',
  type: 'VIDEO',
  description: 'Gói nộp của mỗi iteration theo Student Guides slide 6 (Tracking, RDS, video demo từng người, tag GitLab kèm DB script), khác biệt với bản Subject Guides, và cách tạo tag có chú thích + đính kèm file (slide 18) bằng giao diện lẫn dòng lệnh.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.1 · Student Guides slides 6 and 18</span>
<h2>Every iteration ends in a release — here is what goes into it</h2>
<p class="lead">SWP391 has <strong>three iterations</strong> (15%, 20%, 25%), not a requirement / code / deploy sequence with a single "deployment milestone" at the end. Each iteration closes with the same kind of <strong>package</strong>: the tracking file, the RDS, a demo video per member and a <strong>GitLab tag</strong> that freezes the exact source and database the teacher will grade.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>list every item of an iteration package, and say which deck version your teacher follows;</li>
<li>create an annotated tag on the right commit, from the GitLab UI and from the command line;</li>
<li>attach the DB scripts and the links file to the tag, and share the tag URL;</li>
<li>recover calmly when the tag points to the wrong commit.</li>
</ul></div>
<div class="pitfall co-tieu-de"><strong>What the old version of this chapter got wrong.</strong> It spoke of a "Milestone 3 — deployment in Week 10" graded on a public staging URL and a v1.0.0 tag. The guides say: 3 iterations of 6 slots (135') each, an iteration graded by <strong>LOC 70% + submitted package 30%</strong>, and a tag per iteration. Deployment to a server is useful (lesson 6.3) but it is not a graded milestone.</div>`,
    `<span class="eyebrow">Chương 6 · Bài 6.1 · Student Guides slide 6 và 18</span>
<h2>Mỗi iteration kết thúc bằng một bản phát hành — và đây là những gì nằm trong đó</h2>
<p class="lead">SWP391 có <strong>ba iteration</strong> (15%, 20%, 25%), không phải chuỗi yêu cầu / code / triển khai với một "milestone triển khai" duy nhất ở cuối. Iteration nào cũng khép lại bằng cùng một kiểu <strong>gói nộp</strong>: file tracking, RDS, video demo của từng người và một <strong>tag GitLab</strong> đóng băng đúng source và database mà giáo viên sẽ chấm.</p>
<div class="callout"><strong>Học xong bài này bạn sẽ:</strong>
<ul>
<li>kể đủ các thành phần của một gói nộp iteration, và biết giáo viên của bạn theo phiên bản slide nào;</li>
<li>tạo tag có chú thích trên đúng commit, bằng giao diện GitLab lẫn dòng lệnh;</li>
<li>đính kèm DB script và file danh sách link vào tag, rồi chia sẻ URL của tag;</li>
<li>bình tĩnh xử lý khi tag trỏ nhầm commit.</li>
</ul></div>
<div class="pitfall co-tieu-de"><strong>Bản cũ của chương này đã sai ở đâu.</strong> Nó nói về "Milestone 3 — triển khai ở Tuần 10", chấm bằng một URL staging công khai và tag v1.0.0. Tài liệu hướng dẫn nói: 3 iteration, mỗi iteration 6 slot (135'), chấm theo <strong>LOC 70% + gói nộp 30%</strong>, và mỗi iteration một tag. Deploy lên server là việc có ích (bài 6.3) nhưng không phải một milestone được chấm điểm.</div>`),
    walkHead('g-student', 6, 18, 'Two slides belong to this lesson: slide 6 (what to submit) and slide 18 (git tags). Slides 7 (grading) and 13–17 (labels, issues) are covered in the earlier chapters.', 'Hai slide thuộc bài này: slide 6 (nộp gì) và slide 18 (git tag). Slide 7 (cách chấm) và 13–17 (nhãn, issue) đã học ở các chương trước.'),
    walk('g-student', [
      [6, 'Milestones & Evaluations — Iteration Submit Items',
        `<p class="y-chinh">🎯 At the end of EVERY iteration the team submits four things: Project Tracking, the RDS, and links to the demo videos and to the tagged source.</p>
<p class="nhan">1. Project Tracking document</p>
<ul>
<li><strong>Sheets "Use Cases" and "Product"</strong> — the product scope, kept up to date.</li>
<li><strong>Status</strong> of the screens/functions implemented in this iteration.</li>
<li><strong>Plan</strong> — the screens/functions assigned for the next iteration.</li>
<li><strong>Note</strong> — the first scope list and the Iteration 1 assignment are submitted <em>before</em> Iteration 1 starts.</li>
</ul>
<p class="nhan">2. RDS document</p>
<p>Requirement &amp; Design Specification of this iteration's screens, plus updates to earlier iterations if anything changed.</p>
<p class="nhan">3. Links to released materials</p>
<ul>
<li><strong>Each member's demonstration video</strong> — one per person (lesson 6.2).</li>
<li><strong>The tagged source on GitLab</strong> — the DB scripts and any other source/config files must be <em>inside</em> the tagged code.</li>
</ul>
<p class="nhan">The other deck says it slightly differently</p>
<p>Subject Guides slide 6 names the tracking sheets <strong>RMS</strong>, <strong>iterX</strong> and <strong>iter[X+1]</strong>, puts the links "in a text file", and warns that problems with Tracking or other required materials subtract up to <strong>10%</strong> of the team grade. Follow the version your teacher posts on EduNext/CMS.</p>
<p class="meo">🧠 <strong>Remember "T·R·V·T":</strong> Tracking, RDS, Videos, Tag (with DB scripts).</p>
<div class="pitfall">The package is 30% of the iteration grade, and the tag is how the teacher finds your code. A missing tag or a tag without the DB script means the teacher cannot run what you demoed.</div>`,
        `<p class="y-chinh">🎯 Cuối MỖI iteration nhóm nộp bốn thứ: Project Tracking, RDS, và link tới các video demo cùng source đã gắn tag.</p>
<p class="nhan">1. Tài liệu Project Tracking</p>
<ul>
<li><strong>Sheet "Use Cases" và "Product"</strong> — phạm vi sản phẩm, luôn cập nhật.</li>
<li><strong>Trạng thái</strong> của các màn hình/chức năng đã làm trong iteration này.</li>
<li><strong>Kế hoạch</strong> — các màn hình/chức năng giao cho iteration sau.</li>
<li><strong>Lưu ý</strong> — danh sách phạm vi ban đầu và phần giao cho Iteration 1 phải nộp <em>trước</em> khi Iteration 1 bắt đầu.</li>
</ul>
<p class="nhan">2. Tài liệu RDS</p>
<p>Đặc tả yêu cầu &amp; thiết kế của các màn hình trong iteration này, cộng phần cập nhật cho các iteration trước nếu có thay đổi.</p>
<p class="nhan">3. Link tới các sản phẩm phát hành</p>
<ul>
<li><strong>Video demo của từng thành viên</strong> — mỗi người một video (bài 6.2).</li>
<li><strong>Source đã gắn tag trên GitLab</strong> — DB script và mọi file source/cấu hình khác phải nằm <em>bên trong</em> code đã gắn tag.</li>
</ul>
<p class="nhan">Bộ slide còn lại nói hơi khác</p>
<p>Subject Guides slide 6 gọi các sheet tracking là <strong>RMS</strong>, <strong>iterX</strong> và <strong>iter[X+1]</strong>, yêu cầu để các link "trong một file text", và cảnh báo thiếu sót ở Tracking hay tài liệu bắt buộc khác bị trừ tối đa <strong>10%</strong> điểm nhóm. Hãy theo phiên bản giáo viên đăng trên EduNext/CMS.</p>
<p class="meo">🧠 <strong>Mẹo nhớ "T·R·V·T":</strong> Tracking, RDS, Video, Tag (kèm DB script).</p>
<div class="pitfall">Gói nộp là 30% điểm iteration, và tag là cách giáo viên tìm thấy code của bạn. Thiếu tag, hoặc tag không có DB script, là giáo viên không chạy lại được thứ bạn đã demo.</div>`],
      [18, 'Tracking & Monitoring — Manage git tags',
        `<p class="y-chinh">🎯 A tag freezes one commit under a name; on GitLab you create it from a form and can attach files to it.</p>
<p class="nhan">The New Tag form (Project Information › Repository › Tags › New tag)</p>
<ol>
<li><strong>Tag name</strong> — use the iteration: <code>iter1</code>, <code>iter2</code>, <code>iter3</code> (or the naming your teacher gives).</li>
<li><strong>Create from</strong> — a branch, a tag or a commit SHA. Choose <code>main</code> only after everything is merged and Round 3 passed.</li>
<li><strong>Message</strong> — makes an <em>annotated</em> tag. Leave it blank and you get a <em>lightweight</em> tag with no author, date or text — avoid.</li>
<li><strong>Release notes</strong> — optional Markdown that creates a public Release; <strong>Attach a file</strong> sits at its bottom right.</li>
</ol>
<p class="nhan">After creating it</p>
<ul>
<li><strong>Copy the tag URL</strong> from the address bar — that is the link you submit.</li>
<li><strong>Attach or change files</strong> on the tag (e.g. the exported DB script, the links text file).</li>
</ul>
<p class="ghi-chu">Newer GitLab versions moved the menu to <em>Code › Tags</em> and create releases under <em>Deploy › Releases</em>. The idea is the same.</p>
<p class="meo">🧠 <strong>Remember:</strong> branch = a pointer that moves; tag = a pointer that never moves.</p>`,
        `<p class="y-chinh">🎯 Tag đóng băng một commit dưới một cái tên; trên GitLab bạn tạo nó bằng một form và đính kèm được file.</p>
<p class="nhan">Form New Tag (Project Information › Repository › Tags › New tag)</p>
<ol>
<li><strong>Tag name</strong> — đặt theo iteration: <code>iter1</code>, <code>iter2</code>, <code>iter3</code> (hoặc quy ước giáo viên đưa).</li>
<li><strong>Create from</strong> — một branch, một tag hay một commit SHA. Chỉ chọn <code>main</code> sau khi đã merge đủ và Round 3 đã pass.</li>
<li><strong>Message</strong> — tạo tag <em>có chú thích</em> (annotated). Để trống sẽ ra tag <em>lightweight</em> không tác giả, không ngày, không mô tả — tránh.</li>
<li><strong>Release notes</strong> — Markdown tuỳ chọn, tạo một Release công khai; nút <strong>Attach a file</strong> ở góc dưới bên phải.</li>
</ol>
<p class="nhan">Sau khi tạo</p>
<ul>
<li><strong>Copy URL của tag</strong> trên thanh địa chỉ — đó là link bạn nộp.</li>
<li><strong>Đính kèm hoặc thay file</strong> cho tag (vd DB script đã export, file text chứa các link).</li>
</ul>
<p class="ghi-chu">GitLab bản mới chuyển menu sang <em>Code › Tags</em> và tạo release ở <em>Deploy › Releases</em>. Ý tưởng không đổi.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> branch = con trỏ di chuyển; tag = con trỏ đứng yên mãi mãi.</p>`],
    ]),
    bi(`<h3>The package, laid out</h3>
<table>
<thead><tr><th>Item</th><th>Where it lives</th><th>Named like</th></tr></thead>
<tbody>
<tr><td>Project Tracking</td><td>OneDrive / Google Drive team folder (+ submitted file)</td><td><code>{ClassName}_{Group}_{System Name}_ProjectTracking.xlsx</code> — the template's own file name</td></tr>
<tr><td>RDS</td><td>team folder</td><td><code>SE18xx_G5_JobITForFreelancer_RDS Document.docx</code> (as the G5 sample)</td></tr>
<tr><td>System Test, AI Usage, Weekly Report (2026 templates, if your teacher asks)</td><td>team folder</td><td><code>…_ST_v2.0.xlsx</code>, <code>…_AIUsage.xlsx</code></td></tr>
<tr><td>Source + DB scripts</td><td>GitLab, tag <code>iter2</code></td><td><code>database/iter2/01_schema.sql</code>, <code>02_data.sql</code></td></tr>
<tr><td>Demo videos</td><td>OneDrive/Drive (view for the FPT domain) or unlisted YouTube</td><td><code>G5_Iter2_&lt;RollNo&gt;_ApplyJob-ListApply.mp4</code></td></tr>
<tr><td>Links file</td><td>attached to the tag + submitted</td><td><code>G5_Iter2_Links.txt</code></td></tr>
</tbody>
</table>
<p class="nhan">A links file the teacher can use in 30 seconds</p>
<pre>SE18xx - G5 - Job IT for Freelancer - Iteration 2
Tag (source + DB scripts): https://gitlab.com/&lt;group&gt;/&lt;project&gt;/-/tags/iter2
DB scripts in the tag:     database/iter2/01_schema.sql, 02_data.sql (MySQL 8.0)
Demo accounts:             see database/iter2/README.md (one per role)

Member  Screens this iteration                 Video
M1      Apply Job, List Apply                  https://…
M2      Create Post, Update Post, My Posts     https://…
M3      Manage Applicants, Change Status        https://…
M4      Dashboard (Recruiter), Mark Freelancer https://…</pre>
<h3>The same tag from the command line</h3>
<pre>git switch main
git pull origin main                    # the merged state everyone tested
git log --oneline -5                    # check the top commit is the one Round 3 ran on
git tag -a iter2 -m "Iteration 2: Apply Job, Create/Update Post, Manage Applicants, Dashboard; DB script database/iter2"
git push origin iter2                   # a tag is NOT pushed by a normal git push
git show iter2                          # tagger, date, message, commit</pre>
<p class="nhan">Wrong commit tagged? Fix it before the deadline, and say so</p>
<pre>git tag -d iter2                        # delete locally
git push origin --delete iter2          # delete on GitLab
git tag -a iter2 &lt;right-sha&gt; -m "…"     # re-create on the right commit
git push origin iter2</pre>
<div class="pitfall co-tieu-de"><strong>Never move a tag after the deadline.</strong> The teacher may already have cloned it; changing it silently looks like submitting late. If you must, tell the teacher in Slack and keep the old one as <code>iter2-old</code>.</div>
<div class="pitfall co-tieu-de"><strong>Tagging before the DB script is committed.</strong> The tag then holds code that expects tables the teacher does not have. Commit <code>database/iterN/</code> first, run it on an empty schema (lesson 6.2), then tag.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Semantic versions next to iteration tags.</strong> Industry tags releases as MAJOR.MINOR.PATCH. You can add <code>v0.1.0</code>, <code>v0.2.0</code>, <code>v1.0.0</code> on the same commits as <code>iter1–3</code>, and <code>v0.2.1</code> for a fix after a Leakage. <code>git describe --tags</code> then tells anyone which release a build came from.</div>`,
    `<h3>Gói nộp, bày ra cho rõ</h3>
<table>
<thead><tr><th>Thành phần</th><th>Nằm ở đâu</th><th>Đặt tên kiểu</th></tr></thead>
<tbody>
<tr><td>Project Tracking</td><td>thư mục nhóm trên OneDrive / Google Drive (+ file nộp)</td><td><code>{ClassName}_{Group}_{System Name}_ProjectTracking.xlsx</code> — đúng tên file của template</td></tr>
<tr><td>RDS</td><td>thư mục nhóm</td><td><code>SE18xx_G5_JobITForFreelancer_RDS Document.docx</code> (như mẫu G5)</td></tr>
<tr><td>System Test, AI Usage, Weekly Report (template 2026, nếu giáo viên yêu cầu)</td><td>thư mục nhóm</td><td><code>…_ST_v2.0.xlsx</code>, <code>…_AIUsage.xlsx</code></td></tr>
<tr><td>Source + DB script</td><td>GitLab, tag <code>iter2</code></td><td><code>database/iter2/01_schema.sql</code>, <code>02_data.sql</code></td></tr>
<tr><td>Video demo</td><td>OneDrive/Drive (cho domain FPT xem) hoặc YouTube chế độ không công khai</td><td><code>G5_Iter2_&lt;RollNo&gt;_ApplyJob-ListApply.mp4</code></td></tr>
<tr><td>File danh sách link</td><td>đính kèm vào tag + nộp</td><td><code>G5_Iter2_Links.txt</code></td></tr>
</tbody>
</table>
<p class="nhan">Một file link giáo viên dùng được trong 30 giây</p>
<pre>SE18xx - G5 - Job IT for Freelancer - Iteration 2
Tag (source + DB scripts): https://gitlab.com/&lt;group&gt;/&lt;project&gt;/-/tags/iter2
DB scripts in the tag:     database/iter2/01_schema.sql, 02_data.sql (MySQL 8.0)
Demo accounts:             see database/iter2/README.md (one per role)

Member  Screens this iteration                 Video
M1      Apply Job, List Apply                  https://…
M2      Create Post, Update Post, My Posts     https://…
M3      Manage Applicants, Change Status        https://…
M4      Dashboard (Recruiter), Mark Freelancer https://…</pre>
<h3>Cùng cái tag đó bằng dòng lệnh</h3>
<pre>git switch main
git pull origin main                    # trạng thái đã merge mà cả nhóm đã test
git log --oneline -5                    # kiểm commit trên cùng đúng là commit Round 3 đã chạy
git tag -a iter2 -m "Iteration 2: Apply Job, Create/Update Post, Manage Applicants, Dashboard; DB script database/iter2"
git push origin iter2                   # git push thường KHÔNG đẩy tag lên
git show iter2                          # người tạo, ngày, mô tả, commit</pre>
<p class="nhan">Gắn nhầm commit? Sửa trước hạn nộp, và báo cho giáo viên</p>
<pre>git tag -d iter2                        # xoá ở máy
git push origin --delete iter2          # xoá trên GitLab
git tag -a iter2 &lt;sha-đúng&gt; -m "…"      # tạo lại trên đúng commit
git push origin iter2</pre>
<div class="pitfall co-tieu-de"><strong>Đừng bao giờ dời tag sau hạn nộp.</strong> Giáo viên có thể đã clone về rồi; lặng lẽ đổi tag trông y như nộp muộn. Nếu buộc phải đổi, báo giáo viên trên Slack và giữ tag cũ dưới tên <code>iter2-old</code>.</div>
<div class="pitfall co-tieu-de"><strong>Gắn tag trước khi commit DB script.</strong> Khi đó tag chứa code cần những bảng giáo viên không có. Commit <code>database/iterN/</code> trước, chạy thử trên một schema trống (bài 6.2), rồi mới gắn tag.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Semantic version song song với tag iteration.</strong> Trong ngành, bản phát hành được gắn tag MAJOR.MINOR.PATCH. Bạn có thể thêm <code>v0.1.0</code>, <code>v0.2.0</code>, <code>v1.0.0</code> trên đúng các commit của <code>iter1–3</code>, và <code>v0.2.1</code> cho bản sửa sau một Leakage. Khi đó <code>git describe --tags</code> cho ai cũng biết một bản build đến từ bản phát hành nào.</div>`),
    books([
      ['progit', 'Ch. 2.6 "Git Basics — Tagging" (annotated vs lightweight, sharing and deleting tags)', 'Ch. 2.6 "Git Basics — Tagging" (tag annotated vs lightweight, đẩy và xoá tag)'],
      ['sommerville', 'Ch. 25 "Configuration management" — releases and baselines', 'Ch. 25 "Configuration management" — release và baseline'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 6.2 DB script + demo video ─────────────────────── */
const L62 = {
  title: '6.2 — The DB script in the tag, and a 3–5 minute demo video per member|||6.2 — DB script trong tag, và video demo 3–5 phút của từng thành viên',
  slug: 'swp391-6-2-db-script-demo-video',
  type: 'VIDEO',
  description: 'Xuất DB script MySQL (schema + dữ liệu demo) đúng thứ tự khoá ngoại, kiểm bằng cách khôi phục lên schema trống, và quay video demo cá nhân 3–5 phút đúng thứ giáo viên chấm LOC cần xem.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Two items only you can make: a runnable database and your own demo</h2>
<p class="lead">The teacher grades LOC <strong>individually</strong> and grades the package on "source code, DB script and RDS". The DB script is what lets him run your tag; the demo video is what shows <em>your</em> screens working. Both are cheap to make well and expensive to make badly.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>export a MySQL database as a schema script and a demo-data script, in foreign-key order;</li>
<li>prove the scripts work by restoring them into an empty schema;</li>
<li>plan, record and share a 3–5 minute demo that covers happy path, unhappy cases and data effects.</li>
</ul></div>
<h3>What goes into database/iterN/</h3>
<pre>database/
  iter2/
    01_schema.sql     CREATE DATABASE + every table, key, index, view, procedure (whole DB, not a diff)
    02_data.sql       demo data: lookup tables first, then users, then posts, then applications
    README.md         MySQL version, how to run, one demo account per role (demo passwords only)</pre>
<ul>
<li><strong>Whole database, every iteration</strong> — the teacher should build the DB from zero with the scripts of ONE tag. Keep a <code>03_changes_from_iter1.sql</code> only as extra information.</li>
<li><strong>Foreign-key order</strong> — Role → User → Freelancer / Recruiter → Categories, JobType, Duration → Post → JobApply. A dump from mysqldump handles this; a hand-written file must follow it.</li>
<li><strong>utf8mb4</strong> — Vietnamese names and content survive only if the database, the tables and the JDBC URL all use UTF-8.</li>
<li><strong>Fake people</strong> — demo data uses invented names, e-mails like <code>freelancer1@demo.local</code> and phone numbers such as 0900000001. Never real classmates' data.</li>
</ul>
<h3>Export — two ways</h3>
<p class="nhan">MySQL Workbench</p>
<ol>
<li><strong>Server › Data Export</strong>, tick the schema.</li>
<li>Choose <em>Dump Structure Only</em> → export to a self-contained file <code>01_schema.sql</code>, tick <strong>Include Create Schema</strong>; tick "Dump Stored Procedures and Functions" if you have any.</li>
<li>Run again with <em>Dump Data Only</em> → <code>02_data.sql</code>.</li>
</ol>
<p class="nhan">Command line</p>
<pre>mysqldump -u root -p --default-character-set=utf8mb4 --no-data --routines --triggers \\
          --databases jobit &gt; database/iter2/01_schema.sql
mysqldump -u root -p --default-character-set=utf8mb4 --no-create-info --complete-insert \\
          jobit &gt; database/iter2/02_data.sql</pre>
<h3>Prove it: restore into an empty schema</h3>
<pre>mysql -u root -p -e "DROP DATABASE IF EXISTS jobit; "     # on YOUR machine only
mysql -u root -p &lt; database/iter2/01_schema.sql           # creates jobit
mysql -u root -p jobit &lt; database/iter2/02_data.sql
# then start the app on this fresh DB and log in with every demo account</pre>
<div class="pitfall co-tieu-de"><strong>"It runs on my machine" databases.</strong> Columns added by hand in Workbench and never exported; a stored procedure missing from the dump; data scripts that insert JobApply before Post exist. All three are caught in two minutes by the restore test above.</div>
<p class="ghi-chu">The G5 sample script is SQL Server (T-SQL with <code>GO</code> and <code>[dbo]</code>); the guides recommend MySQL 8 and the Tracking Policies sheet makes MySQL mandatory. Convert, do not copy.</p>`,
    `<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Hai thứ chỉ bạn làm được: một database chạy được và video demo của chính bạn</h2>
<p class="lead">Giáo viên chấm LOC <strong>theo từng người</strong> và chấm gói nộp trên "source code, DB script và RDS". DB script giúp thầy/cô chạy được tag của bạn; video demo cho thấy <em>các màn hình của bạn</em> chạy đúng. Cả hai làm tốt thì rẻ, làm ẩu thì đắt.</p>
<div class="callout"><strong>Học xong bài này bạn sẽ:</strong>
<ul>
<li>xuất database MySQL thành một script schema và một script dữ liệu demo, đúng thứ tự khoá ngoại;</li>
<li>chứng minh script chạy được bằng cách khôi phục lên một schema trống;</li>
<li>lên kịch bản, quay và chia sẻ video demo 3–5 phút phủ luồng chính, case không suôn sẻ và tác động lên dữ liệu.</li>
</ul></div>
<h3>Trong database/iterN/ có gì</h3>
<pre>database/
  iter2/
    01_schema.sql     CREATE DATABASE + mọi bảng, khoá, index, view, procedure (cả DB, không phải phần chênh)
    02_data.sql       dữ liệu demo: bảng tra cứu trước, rồi user, rồi bài đăng, rồi đơn ứng tuyển
    README.md         phiên bản MySQL, cách chạy, mỗi role một tài khoản demo (chỉ mật khẩu demo)</pre>
<ul>
<li><strong>Cả database, mỗi iteration</strong> — giáo viên phải dựng được DB từ số 0 chỉ với script của MỘT tag. Chỉ giữ <code>03_changes_from_iter1.sql</code> như thông tin thêm.</li>
<li><strong>Thứ tự khoá ngoại</strong> — Role → User → Freelancer / Recruiter → Categories, JobType, Duration → Post → JobApply. Dump bằng mysqldump tự lo việc này; file viết tay phải tuân theo.</li>
<li><strong>utf8mb4</strong> — tên và nội dung tiếng Việt chỉ còn nguyên khi database, các bảng và URL JDBC đều dùng UTF-8.</li>
<li><strong>Người giả</strong> — dữ liệu demo dùng tên bịa, e-mail kiểu <code>freelancer1@demo.local</code> và số điện thoại như 0900000001. Không bao giờ dùng dữ liệu thật của bạn cùng lớp.</li>
</ul>
<h3>Xuất — hai cách</h3>
<p class="nhan">MySQL Workbench</p>
<ol>
<li><strong>Server › Data Export</strong>, tick schema.</li>
<li>Chọn <em>Dump Structure Only</em> → xuất ra một file tự chứa <code>01_schema.sql</code>, tick <strong>Include Create Schema</strong>; tick "Dump Stored Procedures and Functions" nếu có.</li>
<li>Chạy lại với <em>Dump Data Only</em> → <code>02_data.sql</code>.</li>
</ol>
<p class="nhan">Dòng lệnh</p>
<pre>mysqldump -u root -p --default-character-set=utf8mb4 --no-data --routines --triggers \\
          --databases jobit &gt; database/iter2/01_schema.sql
mysqldump -u root -p --default-character-set=utf8mb4 --no-create-info --complete-insert \\
          jobit &gt; database/iter2/02_data.sql</pre>
<h3>Chứng minh: khôi phục lên một schema trống</h3>
<pre>mysql -u root -p -e "DROP DATABASE IF EXISTS jobit; "     # CHỈ trên máy của bạn
mysql -u root -p &lt; database/iter2/01_schema.sql           # tạo jobit
mysql -u root -p jobit &lt; database/iter2/02_data.sql
# rồi chạy app trên DB mới này và đăng nhập bằng từng tài khoản demo</pre>
<div class="pitfall co-tieu-de"><strong>Database "chạy trên máy em".</strong> Cột thêm tay trong Workbench mà không bao giờ export; stored procedure thiếu trong bản dump; script dữ liệu chèn JobApply trước khi có Post. Cả ba đều lộ ra trong hai phút nhờ phép khôi phục ở trên.</div>
<p class="ghi-chu">Script mẫu của G5 là SQL Server (T-SQL có <code>GO</code> và <code>[dbo]</code>); tài liệu hướng dẫn khuyên MySQL 8 và sheet Policies của file Tracking bắt buộc MySQL. Hãy chuyển đổi, đừng chép nguyên.</p>`),
    bi(`<h3>The demo video — one per member, 3–5 minutes</h3>
<p>The teacher uses it to see <em>your</em> 3–4 screens working on the integrated source, and to judge their complexity (C) and quality (Q). Record from the build you tag, logged in with the demo accounts from README.md.</p>
<table>
<thead><tr><th>Time</th><th>Show</th><th>Say</th></tr></thead>
<tbody>
<tr><td>0:00–0:15</td><td>title slide or the home page</td><td>group, system, iteration, which screens are yours (the same names as the Tracking sheet Product)</td></tr>
<tr><td>0:15–2:30</td><td>each screen's happy path, one after the other</td><td>the role you are logged in as, what the screen is for, the result</td></tr>
<tr><td>2:30–3:30</td><td>2–3 unhappy cases per screen</td><td>blank and too-long input, a wrong format, a business rule (expired post, applying twice), a wrong role or a typed URL</td></tr>
<tr><td>3:30–4:15</td><td>the effect: the new row in Workbench, the status seen by the other role, the e-mail in MailTrap</td><td>"the data really changed"</td></tr>
<tr><td>4:15–4:45</td><td>where the code is: servlet / service / DAO / JSP of one screen</td><td>one thing you are proud of (validation, paging, a query)</td></tr>
<tr><td>4:45–5:00</td><td>—</td><td>known limitations, honestly</td></tr>
</tbody>
</table>
<p class="nhan">Recording set-up</p>
<ul>
<li><strong>Tool</strong> — OBS Studio (free; Windows, macOS, Linux), or the built-in recorders: Windows Game Bar <em>Win + Alt + R</em> (records one app window), macOS <em>Cmd + Shift + 5</em>.</li>
<li><strong>Picture</strong> — 1920×1080, browser zoom 110–125%, bookmarks bar and notifications hidden, a clean demo account with a neutral avatar.</li>
<li><strong>Sound</strong> — a headset microphone, a 10-second test first; speak Vietnamese or English as your teacher prefers.</li>
<li><strong>Data</strong> — prepared in a notepad and pasted, so there is no live typing of long texts.</li>
</ul>
<p class="nhan">Sharing</p>
<ol>
<li>Upload to the team OneDrive/Google Drive folder, or to YouTube as <em>Unlisted</em>.</li>
<li>Set the permission so the teacher can view (your FPT domain, or "anyone with the link").</li>
<li>Open the link in a private window before you paste it into the links file.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Videos that lose marks.</strong> 12 minutes of scrolling · no sound · only the happy path · running on your own branch, not the tagged build · showing a teammate's screen as yours · a link that asks for access.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Chapters and a script.</strong> Write the 6-row table above as a script before recording. On YouTube, timestamps such as <code>0:15 Apply Job</code> in the description become chapters, so the teacher jumps straight to the screen being graded. The same script becomes your part of the Final Presentation demo.</div>`,
    `<h3>Video demo — mỗi người một video, 3–5 phút</h3>
<p>Giáo viên dùng nó để xem <em>3–4 màn hình của bạn</em> chạy trên source tích hợp, và đánh giá độ phức tạp (C) cùng chất lượng (Q). Hãy quay từ đúng bản build bạn gắn tag, đăng nhập bằng các tài khoản demo trong README.md.</p>
<table>
<thead><tr><th>Thời gian</th><th>Cho xem</th><th>Nói</th></tr></thead>
<tbody>
<tr><td>0:00–0:15</td><td>slide tiêu đề hoặc trang chủ</td><td>nhóm, hệ thống, iteration, màn hình nào là của bạn (cùng tên với sheet Product của file Tracking)</td></tr>
<tr><td>0:15–2:30</td><td>luồng chính của từng màn hình, lần lượt</td><td>đang đăng nhập bằng role nào, màn hình để làm gì, kết quả</td></tr>
<tr><td>2:30–3:30</td><td>2–3 case không suôn sẻ mỗi màn hình</td><td>bỏ trống và nhập quá dài, sai định dạng, một luật nghiệp vụ (bài hết hạn, apply hai lần), sai role hoặc gõ thẳng URL</td></tr>
<tr><td>3:30–4:15</td><td>tác động: dòng mới trong Workbench, trạng thái role khác thấy, e-mail trong MailTrap</td><td>"dữ liệu thật sự đã đổi"</td></tr>
<tr><td>4:15–4:45</td><td>code nằm ở đâu: servlet / service / DAO / JSP của một màn hình</td><td>một điểm bạn tự hào (validation, phân trang, một câu truy vấn)</td></tr>
<tr><td>4:45–5:00</td><td>—</td><td>các hạn chế còn lại, nói thật</td></tr>
</tbody>
</table>
<p class="nhan">Chuẩn bị quay</p>
<ul>
<li><strong>Công cụ</strong> — OBS Studio (miễn phí; Windows, macOS, Linux), hoặc công cụ có sẵn: Windows Game Bar <em>Win + Alt + R</em> (quay một cửa sổ ứng dụng), macOS <em>Cmd + Shift + 5</em>.</li>
<li><strong>Hình</strong> — 1920×1080, zoom trình duyệt 110–125%, ẩn thanh bookmark và thông báo, tài khoản demo sạch với avatar trung tính.</li>
<li><strong>Tiếng</strong> — micro tai nghe, thử 10 giây trước; nói tiếng Việt hay tiếng Anh theo yêu cầu giáo viên.</li>
<li><strong>Dữ liệu</strong> — soạn sẵn trong notepad rồi dán, không gõ trực tiếp những đoạn dài.</li>
</ul>
<p class="nhan">Chia sẻ</p>
<ol>
<li>Upload vào thư mục OneDrive/Google Drive của nhóm, hoặc lên YouTube ở chế độ <em>Unlisted</em>.</li>
<li>Đặt quyền để giáo viên xem được (domain FPT, hoặc "bất kỳ ai có link").</li>
<li>Mở link trong cửa sổ ẩn danh trước khi dán vào file danh sách link.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Những video làm mất điểm.</strong> 12 phút cuộn trang · không có tiếng · chỉ luồng chính · chạy trên nhánh riêng thay vì bản đã gắn tag · khoe màn hình của bạn khác như của mình · link bắt xin quyền truy cập.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Chương mục và kịch bản.</strong> Viết bảng 6 dòng ở trên thành kịch bản trước khi quay. Trên YouTube, các mốc như <code>0:15 Apply Job</code> trong phần mô tả tự thành chương, giáo viên nhảy thẳng tới màn hình đang chấm. Cũng chính kịch bản đó thành phần demo của bạn trong buổi Final Presentation.</div>`),
    books([
      ['sommerville', 'Ch. 25.2 "System building" and 25.4 "Release management"', 'Ch. 25.2 "System building" và 25.4 "Release management"'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 6.3 Deploy + MailTrap ─────────────────────── */
const L63 = {
  title: '6.3 — Running it outside your laptop: WAR on Tomcat, MySQL, a free cloud option, MailTrap|||6.3 — Chạy ngoài laptop: WAR trên Tomcat, MySQL, một lựa chọn cloud miễn phí, MailTrap',
  slug: 'swp391-6-3-deploy-java-web-mailtrap',
  type: 'VIDEO',
  description: 'Build file WAR từ NetBeans (Ant/Maven), bẫy javax vs jakarta giữa Tomcat 9 và 10, deploy lên Tomcat độc lập, cấu hình DB ngoài code, ba cách đưa lên mạng miễn phí, và gửi e-mail thử bằng MailTrap sandbox.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>From "Run in NetBeans" to a WAR that runs anywhere</h2>
<p class="lead">For grading, the guides need one thing: the <strong>integrated source runs</strong> — the Policies sheet says the demo runs from ONE merged source, not from each member's machine. Building a WAR and running it on a clean Tomcat + MySQL is the most honest check that this is true, and it is how a real customer would receive your system.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>build a WAR from a NetBeans Ant or Maven project and deploy it to a standalone Tomcat;</li>
<li>avoid the javax / jakarta mismatch between Tomcat 9 and Tomcat 10+;</li>
<li>keep the database address and passwords out of the source code;</li>
<li>put the app on the Internet for free for a demo, and test e-mail features with MailTrap.</li>
</ul></div>
<h3>Step 1 — build the WAR</h3>
<ul>
<li><strong>Ant project</strong> (NetBeans "Java with Ant › Java Web") — right-click the project › <strong>Clean and Build</strong> → <code>dist/JobIT.war</code>.</li>
<li><strong>Maven project</strong> — <strong>Clean and Build</strong> or <code>mvn clean package</code> → <code>target/jobit-1.0.war</code>. Tests run during the build; a red test stops it (lesson 5.3).</li>
</ul>
<div class="pitfall co-tieu-de"><strong>javax or jakarta — pick the Tomcat that matches your imports.</strong> Tomcat 9 implements Java EE 8: <code>import javax.servlet.*</code>. Tomcat 10.1 implements Jakarta EE 10: <code>import jakarta.servlet.*</code>. A javax WAR on Tomcat 10 deploys "successfully" and then every servlet answers 404. The whole team must use the same Tomcat major version from Iteration 1.</div>
<h3>Step 2 — deploy to a standalone Tomcat</h3>
<ol>
<li>Install the same JDK and Tomcat versions as in NetBeans (e.g. JDK 17 + Tomcat 10.1).</li>
<li>Copy the WAR into <code>tomcat/webapps/</code>; Tomcat unpacks it and the URL becomes <code>http://host:8080/JobIT/</code> (the WAR name is the context path).</li>
<li>Or use the Manager app: add a user with role <code>manager-gui</code> in <code>conf/tomcat-users.xml</code>, open <code>/manager/html</code>, "WAR file to deploy".</li>
<li>Read <code>logs/catalina.*.log</code> if the app does not start — the first exception is the real cause.</li>
</ol>`,
    `<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Từ "Run trong NetBeans" tới một file WAR chạy ở đâu cũng được</h2>
<p class="lead">Để được chấm, tài liệu hướng dẫn chỉ cần một điều: <strong>source tích hợp chạy được</strong> — sheet Policies nói demo chạy trên MỘT source đã merge, không chạy trên máy riêng từng người. Build ra WAR và chạy nó trên một Tomcat + MySQL sạch là cách kiểm trung thực nhất rằng điều đó đúng, và cũng là cách một khách hàng thật nhận hệ thống của bạn.</p>
<div class="callout"><strong>Học xong bài này bạn sẽ:</strong>
<ul>
<li>build WAR từ project NetBeans Ant hoặc Maven và deploy lên một Tomcat độc lập;</li>
<li>tránh lệch javax / jakarta giữa Tomcat 9 và Tomcat 10+;</li>
<li>giữ địa chỉ database và mật khẩu ở ngoài source code;</li>
<li>đưa app lên Internet miễn phí để demo, và test tính năng e-mail bằng MailTrap.</li>
</ul></div>
<h3>Bước 1 — build WAR</h3>
<ul>
<li><strong>Project Ant</strong> (NetBeans "Java with Ant › Java Web") — chuột phải project › <strong>Clean and Build</strong> → <code>dist/JobIT.war</code>.</li>
<li><strong>Project Maven</strong> — <strong>Clean and Build</strong> hoặc <code>mvn clean package</code> → <code>target/jobit-1.0.war</code>. Test chạy trong lúc build; một test đỏ là dừng (bài 5.3).</li>
</ul>
<div class="pitfall co-tieu-de"><strong>javax hay jakarta — chọn Tomcat khớp với câu import.</strong> Tomcat 9 hiện thực Java EE 8: <code>import javax.servlet.*</code>. Tomcat 10.1 hiện thực Jakarta EE 10: <code>import jakarta.servlet.*</code>. WAR dùng javax thả lên Tomcat 10 vẫn deploy "thành công" rồi mọi servlet đều trả 404. Cả nhóm phải dùng cùng một bản Tomcat chính ngay từ Iteration 1.</div>
<h3>Bước 2 — deploy lên Tomcat độc lập</h3>
<ol>
<li>Cài đúng phiên bản JDK và Tomcat như trong NetBeans (vd JDK 17 + Tomcat 10.1).</li>
<li>Chép WAR vào <code>tomcat/webapps/</code>; Tomcat tự giải nén và URL thành <code>http://host:8080/JobIT/</code> (tên WAR là context path).</li>
<li>Hoặc dùng Manager app: thêm user có role <code>manager-gui</code> trong <code>conf/tomcat-users.xml</code>, mở <code>/manager/html</code>, mục "WAR file to deploy".</li>
<li>Đọc <code>logs/catalina.*.log</code> nếu app không lên — exception đầu tiên mới là nguyên nhân thật.</li>
</ol>`),
    bi(`<h3>Step 3 — configuration outside the code</h3>
<p>The same WAR must run on your laptop, a teammate's laptop and a server. So the database address and passwords are read at run time, never typed into <code>DBContext.java</code>.</p>
<pre>public class DBContext {
    public static Connection getConnection() throws SQLException {
        String url  = System.getenv().getOrDefault("DB_URL",
                "jdbc:mysql://localhost:3306/jobit?useUnicode=true&amp;characterEncoding=UTF-8");
        String user = System.getenv().getOrDefault("DB_USER", "jobit_app");
        String pass = System.getenv("DB_PASSWORD");              // set on each machine, never committed
        return DriverManager.getConnection(url, user, pass);
    }
}</pre>
<ul>
<li><strong>Environment variables</strong> — set <code>DB_PASSWORD</code> in <code>tomcat/bin/setenv.bat</code> (Windows) or <code>setenv.sh</code>, which is not in Git.</li>
<li><strong>Or a JNDI DataSource</strong> — a <code>&lt;Resource&gt;</code> in Tomcat's <code>conf/context.xml</code> gives connection pooling as well.</li>
<li><strong>A dedicated DB user</strong> — <code>CREATE USER 'jobit_app'@'%' IDENTIFIED BY '…'; GRANT SELECT, INSERT, UPDATE, DELETE ON jobit.* TO 'jobit_app'@'%';</code> — the app never logs in as root.</li>
<li><strong>MySQL Connector/J</strong> — in <code>WEB-INF/lib</code> (Ant) or as a Maven dependency, so the WAR carries its driver.</li>
</ul>
<h3>Step 4 — on the Internet, for free (optional)</h3>
<table>
<thead><tr><th>Option</th><th>How</th><th>Good for</th><th>Watch out</th></tr></thead>
<tbody>
<tr><td><strong>Tunnel from your laptop</strong></td><td>Cloudflare Tunnel (<code>cloudflared tunnel --url http://localhost:8080</code>) or ngrok gives a temporary public https URL</td><td>showing the teacher or a friend for an hour</td><td>stops when the laptop sleeps</td></tr>
<tr><td><strong>An always-free VM</strong></td><td>e.g. Oracle Cloud Always Free: Ubuntu VM, install JDK + Tomcat + MySQL, <code>scp</code> the WAR, open port 8080</td><td>a URL that stays up the whole semester</td><td>you are the administrator: updates, firewall, backups</td></tr>
<tr><td><strong>A container platform</strong></td><td>a 3-line Dockerfile on a free web-service tier + a free hosted MySQL</td><td>deploy on every push</td><td>free tiers sleep and change their limits — check the current terms</td></tr>
</tbody>
</table>
<pre>FROM tomcat:10.1-jdk17
COPY target/jobit-1.0.war /usr/local/tomcat/webapps/ROOT.war
EXPOSE 8080</pre>
<p class="ghi-chu">Naming the WAR <code>ROOT.war</code> makes the app answer at <code>/</code> instead of <code>/jobit-1.0/</code>. For a deeper container guide see <a href="/exp-hub/docker" target="_blank" rel="noopener">Exp Hub › Docker</a>.</p>`,
    `<h3>Bước 3 — cấu hình nằm ngoài code</h3>
<p>Cùng một file WAR phải chạy được trên laptop của bạn, laptop của bạn cùng nhóm và trên server. Vì vậy địa chỉ database và mật khẩu được đọc lúc chạy, không bao giờ gõ cứng vào <code>DBContext.java</code>.</p>
<pre>public class DBContext {
    public static Connection getConnection() throws SQLException {
        String url  = System.getenv().getOrDefault("DB_URL",
                "jdbc:mysql://localhost:3306/jobit?useUnicode=true&amp;characterEncoding=UTF-8");
        String user = System.getenv().getOrDefault("DB_USER", "jobit_app");
        String pass = System.getenv("DB_PASSWORD");              // set on each machine, never committed
        return DriverManager.getConnection(url, user, pass);
    }
}</pre>
<ul>
<li><strong>Biến môi trường</strong> — đặt <code>DB_PASSWORD</code> trong <code>tomcat/bin/setenv.bat</code> (Windows) hoặc <code>setenv.sh</code>, file này không nằm trong Git.</li>
<li><strong>Hoặc JNDI DataSource</strong> — một <code>&lt;Resource&gt;</code> trong <code>conf/context.xml</code> của Tomcat, được thêm cả connection pool.</li>
<li><strong>User DB riêng</strong> — <code>CREATE USER 'jobit_app'@'%' IDENTIFIED BY '…'; GRANT SELECT, INSERT, UPDATE, DELETE ON jobit.* TO 'jobit_app'@'%';</code> — app không bao giờ đăng nhập bằng root.</li>
<li><strong>MySQL Connector/J</strong> — nằm trong <code>WEB-INF/lib</code> (Ant) hoặc là dependency Maven, để WAR mang theo driver của nó.</li>
</ul>
<h3>Bước 4 — lên Internet, miễn phí (tuỳ chọn)</h3>
<table>
<thead><tr><th>Lựa chọn</th><th>Cách làm</th><th>Hợp khi</th><th>Cần để ý</th></tr></thead>
<tbody>
<tr><td><strong>Tunnel từ laptop</strong></td><td>Cloudflare Tunnel (<code>cloudflared tunnel --url http://localhost:8080</code>) hoặc ngrok cho một URL https công khai tạm thời</td><td>cho giáo viên hay bạn bè xem trong một giờ</td><td>laptop ngủ là tắt</td></tr>
<tr><td><strong>Một VM miễn phí vĩnh viễn</strong></td><td>vd Oracle Cloud Always Free: VM Ubuntu, cài JDK + Tomcat + MySQL, <code>scp</code> file WAR lên, mở cổng 8080</td><td>một URL sống suốt học kỳ</td><td>bạn là người quản trị: cập nhật, tường lửa, sao lưu</td></tr>
<tr><td><strong>Nền tảng container</strong></td><td>một Dockerfile 3 dòng trên gói web service miễn phí + một MySQL hosted miễn phí</td><td>tự deploy mỗi lần push</td><td>gói miễn phí hay ngủ và đổi giới hạn — kiểm điều khoản hiện tại</td></tr>
</tbody>
</table>
<pre>FROM tomcat:10.1-jdk17
COPY target/jobit-1.0.war /usr/local/tomcat/webapps/ROOT.war
EXPOSE 8080</pre>
<p class="ghi-chu">Đặt tên WAR là <code>ROOT.war</code> để app trả lời ở <code>/</code> thay vì <code>/jobit-1.0/</code>. Hướng dẫn container sâu hơn xem <a href="/exp-hub/docker" target="_blank" rel="noopener">Exp Hub › Docker</a>.</p>`),
    bi(`<h3>MailTrap — the mailing tool named in the Student Guides</h3>
<p>Student Guides slide 2 lists "Mailing Tool: integrate with the MailTrap (mailtrap.io)". Its <strong>Email Testing sandbox</strong> is a fake SMTP server: your app sends real e-mails, MailTrap catches every one in a team inbox, and <em>nothing reaches a real person</em>. That is exactly what you want while testing "register", "forgot password" (the G5 system resets passwords by e-mail) or "your application status changed".</p>
<ol>
<li>Sign up at mailtrap.io › <strong>Email Testing › Inboxes</strong> › open the inbox › <strong>SMTP Settings</strong>.</li>
<li>Copy host <code>sandbox.smtp.mailtrap.io</code>, port <code>2525</code> (25, 465 and 587 also work), and the inbox username/password.</li>
<li>Put them in environment variables (as in Step 3) — never in the source.</li>
<li>Invite the teammates to the inbox so every tester sees the e-mails.</li>
</ol>
<pre>// Jakarta Mail 2.x (Tomcat 10+); on Tomcat 9 use javax.mail 1.6 — same code, javax.* imports
public class Mailer {
    public static void send(String to, String subject, String html) throws MessagingException {
        Properties p = new Properties();
        p.put("mail.smtp.auth", "true");
        p.put("mail.smtp.starttls.enable", "true");
        p.put("mail.smtp.host", System.getenv("SMTP_HOST"));      // sandbox.smtp.mailtrap.io
        p.put("mail.smtp.port", System.getenv("SMTP_PORT"));      // 2525
        Session s = Session.getInstance(p, new Authenticator() {
            @Override protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(System.getenv("SMTP_USER"), System.getenv("SMTP_PASS"));
            }
        });
        MimeMessage m = new MimeMessage(s);
        m.setFrom(new InternetAddress("no-reply@jobit.local"));
        m.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
        m.setSubject(subject, "UTF-8");
        m.setContent(html, "text/html; charset=UTF-8");
        Transport.send(m);
    }
}</pre>
<p class="nhan">Test cases for an e-mail feature</p>
<ul>
<li><strong>Arrives</strong> — exactly one e-mail per action, to the right address.</li>
<li><strong>Content</strong> — subject and body in correct Vietnamese (UTF-8), the right name and job title.</li>
<li><strong>Link</strong> — the reset / verify link opens the right page and expires as the rule says.</li>
<li><strong>Failure</strong> — wrong SMTP password: the user sees a clear message, the action is not half-done.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Sending from a personal Gmail.</strong> Teams paste a Gmail app password into the code, push it, and the account gets locked or abused. MailTrap costs nothing and keeps test e-mails away from real inboxes.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Send e-mail in the background.</strong> SMTP can take seconds; a servlet that waits makes "Change status" feel frozen. Hand the message to an <code>ExecutorService</code> and return at once. Real delivery (MailTrap "Email Sending", or any provider) additionally needs a verified domain with SPF and DKIM records — a good topic for the Final Presentation's "future work".</div>`,
    `<h3>MailTrap — công cụ gửi mail được nêu trong Student Guides</h3>
<p>Student Guides slide 2 ghi "Mailing Tool: integrate with the MailTrap (mailtrap.io)". <strong>Email Testing sandbox</strong> của nó là một SMTP server giả: app của bạn gửi e-mail thật, MailTrap hứng mọi e-mail vào một hộp thư chung của nhóm, và <em>không thư nào tới người thật</em>. Đó đúng là điều bạn cần khi test "đăng ký", "quên mật khẩu" (hệ thống G5 đặt lại mật khẩu qua e-mail) hay "trạng thái đơn ứng tuyển đã đổi".</p>
<ol>
<li>Đăng ký mailtrap.io › <strong>Email Testing › Inboxes</strong> › mở inbox › <strong>SMTP Settings</strong>.</li>
<li>Chép host <code>sandbox.smtp.mailtrap.io</code>, cổng <code>2525</code> (25, 465 và 587 cũng được), cùng username/password của inbox.</li>
<li>Đặt chúng vào biến môi trường (như Bước 3) — không bao giờ vào source.</li>
<li>Mời các bạn cùng nhóm vào inbox để tester nào cũng thấy e-mail.</li>
</ol>
<pre>// Jakarta Mail 2.x (Tomcat 10+); on Tomcat 9 use javax.mail 1.6 — same code, javax.* imports
public class Mailer {
    public static void send(String to, String subject, String html) throws MessagingException {
        Properties p = new Properties();
        p.put("mail.smtp.auth", "true");
        p.put("mail.smtp.starttls.enable", "true");
        p.put("mail.smtp.host", System.getenv("SMTP_HOST"));      // sandbox.smtp.mailtrap.io
        p.put("mail.smtp.port", System.getenv("SMTP_PORT"));      // 2525
        Session s = Session.getInstance(p, new Authenticator() {
            @Override protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(System.getenv("SMTP_USER"), System.getenv("SMTP_PASS"));
            }
        });
        MimeMessage m = new MimeMessage(s);
        m.setFrom(new InternetAddress("no-reply@jobit.local"));
        m.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
        m.setSubject(subject, "UTF-8");
        m.setContent(html, "text/html; charset=UTF-8");
        Transport.send(m);
    }
}</pre>
<p class="nhan">Test case cho một tính năng e-mail</p>
<ul>
<li><strong>Có tới</strong> — đúng một e-mail cho mỗi thao tác, đúng địa chỉ nhận.</li>
<li><strong>Nội dung</strong> — tiêu đề và thân thư tiếng Việt đúng dấu (UTF-8), đúng tên người và tên job.</li>
<li><strong>Link</strong> — link đặt lại / xác thực mở đúng trang và hết hạn như luật quy định.</li>
<li><strong>Khi lỗi</strong> — sai mật khẩu SMTP: người dùng thấy thông báo rõ ràng, thao tác không bị làm dở dang.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Gửi bằng Gmail cá nhân.</strong> Nhiều nhóm dán app password của Gmail vào code, push lên, rồi tài khoản bị khoá hoặc bị lạm dụng. MailTrap miễn phí và giữ e-mail test tránh xa hộp thư thật.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Gửi e-mail ở chế độ nền.</strong> SMTP có thể mất vài giây; servlet ngồi chờ khiến nút "Change status" như bị treo. Giao thư cho một <code>ExecutorService</code> và trả kết quả ngay. Gửi thật (MailTrap "Email Sending" hoặc nhà cung cấp khác) còn cần một domain đã xác thực với bản ghi SPF và DKIM — một chủ đề hay cho phần "hướng phát triển" ở buổi Final Presentation.</div>`),
    books([
      ['sommerville', 'Ch. 25.4 "Release management" (what a release contains, how it is documented)', 'Ch. 25.4 "Release management" (một bản phát hành gồm gì, được ghi lại thế nào)'],
    ]),
  ].join('\n'),
};

/* ─────────────── Iteration 3 / final package checklist (old slug kept) ─────────────── */
const CHECK = {
  title: 'Iteration 3 — final package checklist (25%) before the Final Presentation|||Iteration 3 — checklist gói nộp cuối (25%) trước buổi Final Presentation',
  slug: 'swp391-milestone-3-checklist',
  type: 'VIDEO',
  description: 'Danh sách kiểm gói cuối Iteration 3: sản phẩm, chất lượng, tài liệu, bản phát hành (tag iter3 + DB script + video), sẵn sàng thuyết trình — kèm lịch đếm ngược 4 ngày trước hạn nộp.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Iteration 3 checklist</span>
<h2>Iteration 3 — the final package</h2>
<p class="lead">Iteration 3 (25%) is graded like the others — LOC per member + package — with two differences: LOC now counts <strong>all</strong> screens you completed in the whole project, and its result is what two other teachers examine in the <strong>Final Presentation (40%)</strong>.</p>
<table>
<thead><tr><th>Rule</th><th>Student Guides</th><th>Subject Guides</th></tr></thead>
<tbody>
<tr><td>LOC Grade in Iteration 3</td><td>Converted-LOC × 10 / <strong>720</strong></td><td>Converted-LOC × 10 / <strong>660</strong></td></tr>
<tr><td>Package</td><td>30% of the iteration grade</td><td>source + RDS graded; Tracking/other items: up to 10% subtracted</td></tr>
</tbody>
</table>
<p class="ghi-chu">The Project Tracking template (sheet Refs) notes that in Iteration 3 the non-LOC part weighs 40% instead of 30%. The decks differ — follow your teacher's current guide on EduNext/CMS.</p>
<h3>A. Product</h3>
<ol>
<li>☐ Every screen assigned in Iterations 1–3 is done and merged into <code>main</code>.</li>
<li>☐ Screens reach each other through the menu — none only by typing a URL (Policies).</li>
<li>☐ Every input validates required, length and format; every table has search, filter, sort, paging.</li>
<li>☐ Each role sees only its functions; a typed URL of another role is refused.</li>
<li>☐ Shared header/footer/menu in one JSP; similar screens share code (Policies).</li>
</ol>
<h3>B. Quality</h3>
<ol>
<li>☐ Template3 Round 3 run on the commit you will tag; statistics fixed and filled.</li>
<li>☐ No open Defect on a core flow; every Leakage from Iterations 1–2 closed or explained.</li>
<li>☐ Unit tests green (<code>Test Project</code> / <code>mvn test</code>).</li>
</ol>
<h3>C. Documents</h3>
<ol>
<li>☐ Project Tracking: sheets Use Cases + Product show the final status of every screen.</li>
<li>☐ RDS covers all iterations and matches the code (field names, messages, rules).</li>
<li>☐ 2026 templates your teacher asked for: SRS/SDS, System Test, AI Usage Report, Weekly Reports.</li>
</ol>`,
    `<span class="eyebrow">Chương 6 · Checklist Iteration 3</span>
<h2>Iteration 3 — gói nộp cuối</h2>
<p class="lead">Iteration 3 (25%) được chấm như các iteration khác — LOC từng người + gói nộp — với hai khác biệt: LOC giờ tính <strong>mọi</strong> màn hình bạn đã hoàn thành trong cả đồ án, và kết quả của nó là thứ hai giáo viên khác sẽ xem xét ở buổi <strong>Final Presentation (40%)</strong>.</p>
<table>
<thead><tr><th>Quy định</th><th>Student Guides</th><th>Subject Guides</th></tr></thead>
<tbody>
<tr><td>LOC Grade ở Iteration 3</td><td>Converted-LOC × 10 / <strong>720</strong></td><td>Converted-LOC × 10 / <strong>660</strong></td></tr>
<tr><td>Gói nộp</td><td>30% điểm iteration</td><td>chấm source + RDS; Tracking/mục khác: trừ tối đa 10%</td></tr>
</tbody>
</table>
<p class="ghi-chu">Template Project Tracking (sheet Refs) ghi chú rằng ở Iteration 3 phần ngoài LOC chiếm 40% thay vì 30%. Các bộ tài liệu khác nhau — hãy theo hướng dẫn hiện hành của giáo viên trên EduNext/CMS.</p>
<h3>A. Sản phẩm</h3>
<ol>
<li>☐ Mọi màn hình được giao ở Iteration 1–3 đã xong và đã merge vào <code>main</code>.</li>
<li>☐ Các màn hình đi tới nhau qua menu — không màn hình nào chỉ vào được bằng cách gõ URL (Policies).</li>
<li>☐ Mọi ô nhập validate bắt buộc, độ dài, định dạng; mọi bảng có search, filter, sort, paging.</li>
<li>☐ Mỗi role chỉ thấy chức năng của mình; gõ URL của role khác bị từ chối.</li>
<li>☐ Header/footer/menu dùng chung một JSP; các màn hình giống nhau dùng chung code (Policies).</li>
</ol>
<h3>B. Chất lượng</h3>
<ol>
<li>☐ Template3 Round 3 chạy trên đúng commit sẽ gắn tag; phần thống kê đã sửa công thức và điền đủ.</li>
<li>☐ Không còn Defect mở trên luồng chính; mọi Leakage của Iteration 1–2 đã đóng hoặc có giải thích.</li>
<li>☐ Unit test xanh (<code>Test Project</code> / <code>mvn test</code>).</li>
</ol>
<h3>C. Tài liệu</h3>
<ol>
<li>☐ Project Tracking: sheet Use Cases + Product thể hiện trạng thái cuối của mọi màn hình.</li>
<li>☐ RDS phủ cả ba iteration và khớp với code (tên field, message, luật).</li>
<li>☐ Các template 2026 giáo viên yêu cầu: SRS/SDS, System Test, AI Usage Report, Weekly Report.</li>
</ol>`),
    bi(`<h3>D. Release</h3>
<ol>
<li>☐ <code>database/iter3/01_schema.sql</code> + <code>02_data.sql</code> committed and restored once into an empty schema.</li>
<li>☐ README with MySQL version, run steps and one demo account per role.</li>
<li>☐ Annotated tag <code>iter3</code> on the Round 3 commit, pushed; tag URL copied.</li>
<li>☐ One 3–5 minute video per member, links opened in a private window.</li>
<li>☐ Links text file complete and attached to the tag.</li>
</ol>
<h3>E. Ready for the Final Presentation</h3>
<ol>
<li>☐ Slides from Template7 (Project Presentation); a demo script with who shows what.</li>
<li>☐ The demo runs on ONE machine from the tagged build, with the restored demo data; a backup video in case the network fails.</li>
<li>☐ Every member can explain his/her own code and change it on request — the Policies sheet expects a requested change within 30 minutes.</li>
<li>☐ Criteria in mind: team working 20% · product 40% · requirement analysis 20% · design 20%.</li>
</ol>
<h3>Countdown to the deadline</h3>
<table>
<thead><tr><th>Day</th><th>Do</th></tr></thead>
<tbody>
<tr><td>D-4</td><td>feature freeze: only fixes are merged from now on</td></tr>
<tr><td>D-3</td><td>Template3 Round 3 on <code>main</code>; open Defect issues; fix</td></tr>
<tr><td>D-2</td><td>re-test the fixes; export and restore the DB scripts; finish RDS and Tracking</td></tr>
<tr><td>D-1</td><td>tag <code>iter3</code>; record the videos from the tagged build; write the links file</td></tr>
<tr><td>D</td><td>submit; check every link from another account</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>The classic last-night failures.</strong> A "small" merge after tagging that breaks login · videos recorded before the final fixes · a DB script exported before the last column was added · one member's screens only on his laptop — not merged, so not counted.</div>
<div class="callout ok">Do one honest <strong>acceptance run</strong> the day before: a teammate plays the teacher, opens only the links file, restores the database, logs in with the README accounts and tries every screen in the Tracking sheet. Everything he cannot do alone, the teacher cannot do either.</div>`,
    `<h3>D. Bản phát hành</h3>
<ol>
<li>☐ <code>database/iter3/01_schema.sql</code> + <code>02_data.sql</code> đã commit và đã khôi phục thử một lần lên schema trống.</li>
<li>☐ README ghi phiên bản MySQL, các bước chạy và mỗi role một tài khoản demo.</li>
<li>☐ Tag có chú thích <code>iter3</code> trên commit của Round 3, đã push; đã copy URL của tag.</li>
<li>☐ Mỗi thành viên một video 3–5 phút, link đã mở thử trong cửa sổ ẩn danh.</li>
<li>☐ File text danh sách link đầy đủ và đã đính kèm vào tag.</li>
</ol>
<h3>E. Sẵn sàng cho Final Presentation</h3>
<ol>
<li>☐ Slide theo Template7 (Project Presentation); kịch bản demo ghi rõ ai trình bày gì.</li>
<li>☐ Demo chạy trên MỘT máy từ bản đã gắn tag, với dữ liệu demo đã khôi phục; có video dự phòng khi mạng hỏng.</li>
<li>☐ Thành viên nào cũng giải thích được code của mình và sửa được khi được yêu cầu — sheet Policies đòi sửa xong trong vòng 30 phút.</li>
<li>☐ Nhớ tiêu chí: làm việc nhóm 20% · sản phẩm 40% · phân tích yêu cầu 20% · thiết kế 20%.</li>
</ol>
<h3>Đếm ngược tới hạn nộp</h3>
<table>
<thead><tr><th>Ngày</th><th>Việc</th></tr></thead>
<tbody>
<tr><td>D-4</td><td>đóng băng tính năng: từ giờ chỉ merge bản sửa lỗi</td></tr>
<tr><td>D-3</td><td>Template3 Round 3 trên <code>main</code>; mở issue Defect; sửa</td></tr>
<tr><td>D-2</td><td>test lại các bản sửa; export và khôi phục thử DB script; hoàn thiện RDS và Tracking</td></tr>
<tr><td>D-1</td><td>gắn tag <code>iter3</code>; quay video từ bản đã gắn tag; viết file danh sách link</td></tr>
<tr><td>D</td><td>nộp; kiểm mọi link bằng một tài khoản khác</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Những thất bại kinh điển của đêm cuối.</strong> Một lần merge "nhỏ" sau khi gắn tag làm hỏng đăng nhập · video quay trước các bản sửa cuối · DB script export trước khi thêm cột cuối cùng · màn hình của một thành viên chỉ nằm trên laptop của bạn ấy — chưa merge, nên không được tính.</div>
<div class="callout ok">Chạy một <strong>buổi nghiệm thu</strong> trung thực trước một ngày: một bạn đóng vai giáo viên, chỉ mở file danh sách link, khôi phục database, đăng nhập bằng các tài khoản trong README và thử mọi màn hình trong sheet Tracking. Việc gì bạn ấy không tự làm được thì giáo viên cũng không làm được.</div>`),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz 6 ──────────────────────────────── */
// Options written with the key in any slot; q() rotates each question so answers spread over A–D.
let qn = 0;
const q = (question, options, correctIndex, explanation) => {
  const k = qn++ % options.length;
  const opts = [...options.slice(k), ...options.slice(0, k)];
  return { question, options: opts, correctIndex: (correctIndex - k + options.length) % options.length, explanation, points: 1 };
};
const QUIZ6 = {
  title: 'Quiz 6 — Iteration releases, tags & deployment|||Quiz 6 — Phát hành iteration, tag & triển khai',
  slug: 'swp391-quiz-6',
  type: 'QUIZ',
  description: '16 câu: gói nộp mỗi iteration, tag GitLab, DB script, video demo, WAR/Tomcat, cấu hình ngoài code, MailTrap và luật chấm Iteration 3.',
  quiz: {
    timeLimitSeconds: 1200,
    questions: [
      q('How is SWP391 organised over the semester?|||SWP391 được tổ chức thế nào trong học kỳ?',
        ['Requirement, then coding, then a deployment milestone|||Yêu cầu, rồi code, rồi một milestone triển khai', '3 iterations (15%, 20%, 25%) and a Final Presentation (40%)|||3 iteration (15%, 20%, 25%) và Final Presentation (40%)', 'One big submission at the end|||Một lần nộp lớn ở cuối', '10 weekly labs|||10 bài lab hằng tuần'], 1,
        'Student/Subject Guides slide 4: Iteration 1 15%, Iteration 2 20%, Iteration 3 25% (final package), Final Presentation 40%.|||Student/Subject Guides slide 4: Iteration 1 15%, Iteration 2 20%, Iteration 3 25% (gói cuối), Final Presentation 40%.'),
      q('Which set is the iteration package of Student Guides slide 6?|||Bộ nào là gói nộp iteration theo Student Guides slide 6?',
        ['Only the source code|||Chỉ source code', 'Project Tracking, RDS, links to each member\'s demo video and to the tagged source with DB scripts|||Project Tracking, RDS, link video demo từng người và link source đã gắn tag kèm DB script', 'A printed report|||Một báo cáo in', 'A staging URL|||Một URL staging'], 1,
        'T-R-V-T: Tracking, RDS, Videos, Tag (DB scripts and config inside the tagged code).|||T-R-V-T: Tracking, RDS, Video, Tag (DB script và cấu hình nằm trong code đã gắn tag).'),
      q('When must the initial scope list and the Iteration 1 assignment be submitted?|||Danh sách phạm vi ban đầu và phần giao cho Iteration 1 phải nộp khi nào?',
        ['At the end of Iteration 1|||Cuối Iteration 1', 'Before Iteration 1 starts|||Trước khi Iteration 1 bắt đầu', 'With the Final Presentation|||Cùng buổi Final Presentation', 'Never|||Không bao giờ'], 1,
        'Slide 6 note: the initial product scope and the planned screens for iter1 are submitted before the start of iter1.|||Ghi chú slide 6: phạm vi ban đầu và các màn hình dự kiến cho iter1 được nộp trước khi iter1 bắt đầu.'),
      q('Where must the iteration\'s DB scripts be?|||DB script của iteration phải nằm ở đâu?',
        ['Sent by e-mail to the teacher|||Gửi e-mail cho giáo viên', 'Inside the tagged source code on GitLab (or attached to the tag)|||Trong source code đã gắn tag trên GitLab (hoặc đính kèm vào tag)', 'Only on the leader\'s laptop|||Chỉ trên laptop của leader', 'In Slack|||Trên Slack'], 1,
        'Slide 6: the iteration\'s DB scripts and other source/config materials need to be added to the tagged code; slide 18 shows attaching files to a tag.|||Slide 6: DB script và tài liệu source/cấu hình khác phải được thêm vào code đã gắn tag; slide 18 cho thấy cách đính kèm file vào tag.'),
      q('On the GitLab New Tag form, leaving Message blank creates…|||Trên form New Tag của GitLab, để trống ô Message sẽ tạo…',
        ['an annotated tag|||một tag annotated', 'a lightweight tag with no message, tagger or date|||một tag lightweight không mô tả, không người tạo, không ngày', 'a new branch|||một nhánh mới', 'a merge request|||một merge request'], 1,
        'The form says: optionally add a message; leaving this blank creates a lightweight tag. Iteration tags should be annotated.|||Form ghi: có thể thêm message; để trống sẽ tạo lightweight tag. Tag iteration nên là annotated.'),
      q('You ran git tag -a iter2 -m "..." and then git push. The teacher cannot see the tag. Why?|||Bạn đã chạy git tag -a iter2 -m "..." rồi git push. Giáo viên không thấy tag. Vì sao?',
        ['Tags only appear after 24 hours|||Tag chỉ hiện sau 24 giờ', 'A normal git push does not send tags; run git push origin iter2|||git push thường không đẩy tag; phải chạy git push origin iter2', 'Annotated tags are private|||Tag annotated là riêng tư', 'GitLab does not support tags|||GitLab không hỗ trợ tag'], 1,
        'Tags are pushed explicitly: git push origin iter2 (or --tags).|||Tag phải được đẩy riêng: git push origin iter2 (hoặc --tags).'),
      q('After the deadline you notice iter2 points to the wrong commit. What is the right move?|||Sau hạn nộp bạn phát hiện iter2 trỏ nhầm commit. Làm gì cho đúng?',
        ['Silently delete and re-create it|||Lặng lẽ xoá rồi tạo lại', 'Tell the teacher, keep the old tag (e.g. iter2-old) and follow the teacher\'s decision|||Báo giáo viên, giữ tag cũ (vd iter2-old) và làm theo quyết định của giáo viên', 'Delete the repository|||Xoá repository', 'Force-push main|||Force-push main'], 1,
        'The teacher may already have cloned the tag; moving it silently looks like a late submission.|||Giáo viên có thể đã clone tag; lặng lẽ dời nó trông như nộp muộn.'),
      q('Which statement about the per-member demo video is correct?|||Phát biểu nào về video demo của từng thành viên là đúng?',
        ['One team video of 20 minutes is enough|||Một video nhóm 20 phút là đủ', 'Each member records his/her own screens, about 3–5 minutes, from the tagged build|||Mỗi thành viên quay các màn hình của mình, khoảng 3–5 phút, từ bản đã gắn tag', 'Only the leader records|||Chỉ leader quay', 'Videos are optional|||Video là tuỳ chọn'], 1,
        'Slide 6 asks for links to each team member\'s demonstration videos; LOC is graded individually.|||Slide 6 yêu cầu link video demo của từng thành viên; LOC được chấm theo từng người.'),
      q('Why should a demo video show 2–3 unhappy cases per screen?|||Vì sao video demo nên có 2–3 case không suôn sẻ cho mỗi màn hình?',
        ['To make it longer|||Để video dài hơn', 'Quality Q depends on handling all cases, not only the happy path|||Chất lượng Q phụ thuộc vào việc xử lý mọi case, không chỉ luồng chính', 'The teacher only grades errors|||Giáo viên chỉ chấm lỗi', 'It is required by MailTrap|||MailTrap bắt buộc'], 1,
        'L1 happy cases = 0.5, L2 all cases = 0.75, L3 optimised = 1.0 in the Tracking template.|||Trong template Tracking: L1 happy cases = 0.5, L2 all cases = 0.75, L3 optimized = 1.0.'),
      q('What is the quickest proof that your DB scripts are complete?|||Cách nhanh nhất chứng minh DB script đã đầy đủ?',
        ['Open them in Notepad|||Mở bằng Notepad', 'Restore them into an empty schema and run the app with every demo account|||Khôi phục chúng lên một schema trống rồi chạy app với từng tài khoản demo', 'Count the lines|||Đếm số dòng', 'Ask ChatGPT|||Hỏi ChatGPT'], 1,
        'Missing columns, procedures or wrong insert order show up in the restore test within minutes.|||Thiếu cột, thiếu procedure hay sai thứ tự insert đều lộ ra trong vài phút khi khôi phục thử.'),
      q('A WAR that imports javax.servlet is deployed on Tomcat 10.1. What typically happens?|||Một WAR import javax.servlet được deploy lên Tomcat 10.1. Thường chuyện gì xảy ra?',
        ['It works normally|||Chạy bình thường', 'It deploys, but the servlets are not found (404) because Tomcat 10 uses jakarta.servlet|||Deploy được, nhưng không tìm thấy servlet (404) vì Tomcat 10 dùng jakarta.servlet', 'MySQL refuses the connection|||MySQL từ chối kết nối', 'NetBeans deletes the project|||NetBeans xoá project'], 1,
        'Tomcat 9 = Java EE 8 (javax.*); Tomcat 10+ = Jakarta EE (jakarta.*). The whole team must use the same major version.|||Tomcat 9 = Java EE 8 (javax.*); Tomcat 10+ = Jakarta EE (jakarta.*). Cả nhóm phải dùng cùng một bản chính.'),
      q('Where should DB_PASSWORD come from in the deployed app?|||Trong app đã deploy, DB_PASSWORD nên lấy từ đâu?',
        ['A constant in DBContext.java|||Một hằng số trong DBContext.java', 'An environment variable or a Tomcat DataSource set on each machine, outside Git|||Biến môi trường hoặc DataSource của Tomcat đặt trên từng máy, nằm ngoài Git', 'The README|||File README', 'The JSP page|||Trang JSP'], 1,
        'The same WAR runs everywhere; only the environment differs. A password in Git is a leak.|||Cùng một WAR chạy mọi nơi; chỉ môi trường khác nhau. Mật khẩu trong Git là rò rỉ.'),
      q('What does the MailTrap Email Testing sandbox do?|||MailTrap Email Testing sandbox làm gì?',
        ['Delivers e-mails to real users faster|||Gửi e-mail tới người dùng thật nhanh hơn', 'Catches every e-mail the app sends in a test inbox, so nothing reaches real people|||Hứng mọi e-mail app gửi vào một inbox test, không thư nào tới người thật', 'Stores the database backup|||Lưu bản sao lưu database', 'Hosts the WAR file|||Host file WAR'], 1,
        'It is a fake SMTP server (sandbox.smtp.mailtrap.io) for testing register, reset password and notification e-mails.|||Đó là một SMTP server giả (sandbox.smtp.mailtrap.io) để test e-mail đăng ký, đặt lại mật khẩu và thông báo.'),
      q('Per the Student Guides, the Iteration 3 LOC Grade is…|||Theo Student Guides, LOC Grade của Iteration 3 là…',
        ['Converted-LOC x 10 / 240|||Converted-LOC x 10 / 240', 'Converted-LOC x 10 / 720, over all completed screens|||Converted-LOC x 10 / 720, tính trên mọi màn hình đã hoàn thành', 'Number of commits / 10|||Số commit / 10', 'The same as the Final Presentation grade|||Bằng điểm Final Presentation'], 1,
        'Student Guides: MaxLOC 240 for iterations 1 and 2, 720 for iteration 3. Subject Guides says 180 / 240 / 660 — follow your teacher\'s current guide.|||Student Guides: MaxLOC 240 cho iteration 1 và 2, 720 cho iteration 3. Subject Guides ghi 180 / 240 / 660 — theo hướng dẫn hiện hành của giáo viên.'),
      q('According to the Subject Guides, what happens if Project Tracking or other required materials have problems?|||Theo Subject Guides, nếu Project Tracking hay tài liệu bắt buộc khác có vấn đề thì sao?',
        ['Nothing|||Không sao', 'The team grade is reduced accordingly, by at most 10% of the total|||Điểm nhóm bị trừ tương ứng, tối đa 10% tổng điểm', 'The team fails immediately|||Nhóm trượt ngay', 'The Final Presentation is cancelled|||Buổi Final Presentation bị huỷ'], 1,
        'Subject Guides slide 7: issues with Project Tracking and other required materials subtract up to 10% of the total grade.|||Subject Guides slide 7: thiếu sót ở Project Tracking và tài liệu bắt buộc khác bị trừ tối đa 10% tổng điểm.'),
      q('Why rename the WAR to ROOT.war in a container?|||Vì sao đổi tên WAR thành ROOT.war trong container?',
        ['It makes the app faster|||Để app nhanh hơn', 'Tomcat then serves the app at / instead of /appname/|||Khi đó Tomcat phục vụ app ở / thay vì /tên-app/', 'Docker requires it|||Docker bắt buộc', 'It hides the source code|||Để giấu source code'], 1,
        'The WAR file name is the context path; ROOT is the special name for the root path.|||Tên file WAR là context path; ROOT là tên đặc biệt cho đường dẫn gốc.'),
    ],
  },
};

export default {
  title: 'Chapter 6 — Iteration releases: tags, packages & deployment|||Chương 6 — Phát hành theo iteration: tag, gói nộp & triển khai',
  description: 'Gói nộp sau mỗi iteration (Tracking, RDS, video demo từng thành viên, tag GitLab kèm DB script), cách tạo tag và đính kèm file, quay video demo 3–5 phút, build WAR chạy trên Tomcat, dump/restore MySQL, một lựa chọn cloud miễn phí, MailTrap cho tính năng e-mail và checklist gói cuối Iteration 3.',
  lessons: [L61, L62, L63, CHECK, QUIZ6],
};
