/**
 * 0.4 — Dựng "công ty một người": không gian CT Work, 5 tài khoản vai, nhãn/vai/quyền, repo GitHub, kênh chat, lịch họp với chính mình (dm5-0-4-dung-cong-ty-mot-nguoi).
 * Nguồn sự cố bảo mật thật: Toyota Motor Corporation thông cáo ngày 07/10/2022 về sự cố T-Connect (khoá truy cập nằm trên GitHub công khai gần 5 năm).
 * Không lặp hướng dẫn bấm nút cơ bản của CT Work / Git — dẫn link sang huong-dan-ct-work, git và agile-teamwork.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, bash, out, ac, cs, ng, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L04 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Section 0 · Lesson 0.4', 'Mục 0 · Bài 0.4', `
<h2>${t('0.4 — Setting up your "one-person company": CT Work, 5 role accounts, GitHub &amp; rituals', '0.4 — Dựng "công ty một người": CT Work, 5 tài khoản vai, GitHub, chat &amp; lịch họp')}</h2>
<p class="lead">${t(
    'Before a carpenter cuts the first plank, they level the workbench, mount the tool pegboard, label the screw boxes, and tape safety rules beside the saw. Skipping workshop setup saves 90 minutes on Day 0 and wastes 30 hours over the next ten weeks hunting for lost files, fixing broken pushes, and wondering which role approved what. This lesson walks you through wiring all four pillars of your one-person software company: CT Work (LF #2 + 5 real role accounts), GitHub (1 honest Git identity + branch protection + webhook), project chat &amp; docs, and your solo meeting calendar.',
    'Trước khi người thợ mộc cưa tấm ván đầu tiên, họ kê chắc bàn cưa, treo bảng đồ nghề, dán nhãn hộp ốc vít và dán nội quy an toàn ngay cạnh máy. Bỏ qua bước dựng xưởng giúp bạn tiết kiệm 90 phút ngày đầu nhưng làm mất 30 giờ suốt mười tuần sau để lục file thất lạc, cứu các cú push hỏng và đoán xem vai nào đã duyệt cái gì. Bài này hướng dẫn bạn lắp trọn bốn trụ cột của công ty phần mềm một người: CT Work (LF #2 + 5 tài khoản vai thật), GitHub (1 danh tính Git trung thực + bảo vệ nhánh + webhook), kênh chat &amp; tài liệu dự án, và lịch họp cố định với chính mình.')}</p>

<h3>${t('Everyday picture: five desks in one small office', 'Liên tưởng đời thường: năm chiếc bàn trong một văn phòng nhỏ')}</h3>
<p>${t(
    'If you run a solo studio from one laptop but keep all five roles inside a single messy browser tab, your brain blurs them together in ten minutes. Now imagine using five colour-coded browser profiles — purple for PM, sky blue for BA, green for Dev BE, amber for Dev FE, red for QA — each logged into its own CT Work role account. When you finish coding in the green window and open the red window to test, your eyes immediately feel the switch: <em>"I am no longer the author; my job now is to break this."</em> Physical boundaries create mental discipline.',
    'Nếu bạn vận hành studio một người trên một chiếc laptop nhưng mở chung cả năm vai trong một tab trình duyệt lộn xộn, não bạn sẽ trộn lẫn chúng sau đúng mười phút. Giờ hãy tưởng tượng bạn dùng năm profile trình duyệt gắn màu — tím cho PM, xanh dương cho BA, xanh lá cho Dev BE, vàng cam cho Dev FE, đỏ cho QA — mỗi profile đăng nhập đúng tài khoản vai CT Work của nó. Khi code xong ở cửa sổ xanh lá và mở cửa sổ đỏ để test, mắt bạn lập tức nhận tín hiệu đổi vai: <em>"Mình không còn là tác giả nữa; việc của mình lúc này là tìm cách phá nó."</em> Ranh giới vật lý tạo nên kỷ luật tư duy.')}</p>

<h3>${t('1. Architecture of your one-person company workspace', '1. Kiến trúc không gian làm việc của công ty một người')}</h3>
<pre><code>  +----------------------------------------------------------------------+
  |                   ONE-PERSON COMPANY (LABFLOW STUDIO)                |
  +----------------------------------------------------------------------+
  |  [1] CT Work — Project LF #2 (/work)                                 |
  |      5 real accounts: C1 (Admin/Leader) + C2, C3, C4, C5 (Members)   |
  |      Modules: board, backlog, requirements, tests, raid, changes,    |
  |               meetings, docs, chat, reports, settings (Done rules)   |
  +--------------------------+-----------------------+-------------------+
                             |                       |
               GitHub webhook| (commits/PRs LF-xx)   | calendar sync / reminders
                             v                       v
  +-----------------------------------+   +------------------------------+
  |  [2] GitHub Repo (Private Pro/    |   |  [3] Calendar + Rituals      |
  |      Student Pack, or PII-free    |   |  - Daily 5-min standup log   |
  |      Public / GitLab Free)        |   |  - Wed mid-sprint check      |
  |  1 REAL Git identity (no fakes!)  |   |  - Sun Weekly Report &amp; Retro |
  |  Protected main (PR + no force;   |   |    (45 min total)            |
  |  add CI checks after Lesson 6.3)  |   +------------------------------+
  |  .gitignore + .env.example        |
  +-----------------------------------+</code></pre>
<p>${t('For the general tool-by-tool philosophy ("one home per information type"), read ', 'Về nguyên tắc chung "mỗi loại thông tin một chỗ ở", xem thêm ')}${cs('agile-teamwork', 'agl-0-2-cong-cu', t('Agile Teamwork 0.2 — The toolbox', 'Agile Teamwork 0.2 — Bộ công cụ'))}${t('; below is the exact adaptation for a <strong>solo 5-role</strong> setup.', '; dưới đây là cách thiết lập riêng cho mô hình <strong>một mình 5 vai</strong>.')}</p>

<h3>${t('2. Pillar 1 — CT Work workspace, 5 real role accounts, labels &amp; permissions', '2. Trụ 1 — Không gian CT Work, 5 tài khoản vai thật, nhãn &amp; quyền hạn')} ${mu('C1', en)}</h3>
<p>${t(
    'If you have never created a workspace or invited members on CT Work, follow ',
    'Nếu bạn chưa từng tạo không gian hay mời thành viên trên CT Work, hãy xem nhanh ')}${cs('huong-dan-ct-work', 'ctw-01-bat-dau', t('CT Work 01 — Getting started', 'CT Work 01 — Bắt đầu'))} ${t('and ', 'và ')}${cs('huong-dan-ct-work', 'ctw-05-moi-nhom-phan-quyen', t('CT Work 05 — Roles &amp; permissions', 'CT Work 05 — Mời nhóm &amp; phân quyền'))}${t(
    '. On LabFlow Studio (project <strong>LF #2</strong>), configure your five real accounts with strict separation of authority:',
    '. Trong không gian LabFlow Studio (dự án <strong>LF #2</strong>), cấu hình năm tài khoản thật với phân quyền rạch ròi như sau:')}</p>

${bang(
  [t('Account / Hat', 'Tài khoản / Mũ'), t('Display name format (honesty rule)', 'Cách đặt tên hiển thị (luật trung thực)'), t('CT Work permission', 'Quyền trên CT Work'), t('Browser profile color &amp; primary pages', 'Màu profile trình duyệt &amp; trang dùng chính')],
  [
    [`${mu('C1', en)}`, '<code>Cuong — C1 Leader/PM (Solo 5-role)</code>', t('<strong>Project Admin / Maintainer</strong> — configures settings, sprints, gates, approves Done &amp; Releases', '<strong>Admin / Maintainer dự án</strong> — cài đặt dự án, sprint, gate, chốt Done &amp; Release'), t('Purple · <code>board</code>, <code>backlog</code>, <code>raid</code>, <code>reports</code>, <code>meetings</code>, <code>settings</code>', 'Tím · <code>board</code>, <code>backlog</code>, <code>raid</code>, <code>reports</code>, <code>meetings</code>, <code>settings</code>')],
    [`${mu('C2', en)}`, '<code>C2 BA — [Solo · 1 người 5 vai]</code>', t('<strong>Member</strong> — edits requirements, spec, diagrams, docs; cannot alter Done rules', '<strong>Member</strong> — sửa yêu cầu, spec, sơ đồ, tài liệu; không sửa Done rules'), t('Sky blue · <code>requirements</code>, <code>spec</code>, <code>wiegers</code>, <code>diagrams</code>, <code>docs</code>', 'Xanh dương · <code>requirements</code>, <code>spec</code>, <code>wiegers</code>, <code>diagrams</code>, <code>docs</code>')],
    [`${mu('C3', en)}`, '<code>C3 Dev BE — [Solo · 1 người 5 vai]</code>', t('<strong>Member</strong> — updates assigned backend/vertical cards, logs work, links PRs', '<strong>Member</strong> — cập nhật thẻ backend/miền phụ trách, log work, gắn PR'), t('Green · <code>board</code>, <code>issue</code>, <code>code</code>, <code>reviews</code>', 'Xanh lá · <code>board</code>, <code>issue</code>, <code>code</code>, <code>reviews</code>')],
    [`${mu('C4', en)}`, '<code>C4 Dev FE — [Solo · 1 người 5 vai]</code>', t('<strong>Member</strong> — updates assigned frontend/vertical cards, reviews API contracts &amp; mockups', '<strong>Member</strong> — cập nhật thẻ frontend/miền phụ trách, rà hợp đồng API &amp; mockup'), t('Amber · <code>board</code>, <code>issue</code>, <code>requirements</code> (mockup), <code>code</code>', 'Vàng cam · <code>board</code>, <code>issue</code>, <code>requirements</code> (mockup), <code>code</code>')],
    [`${mu('C5', en)}`, '<code>C5 QA — [Solo · 1 người 5 vai]</code>', t('<strong>Member</strong> — owns test cases, test cycles, logs Defects/Leakage, runs UAT', '<strong>Member</strong> — sở hữu test case, test cycle, ghi Defect/Leakage, chạy UAT'), t('Red · <code>tests</code>, <code>reviews</code>, <code>portal</code>, <code>board</code>', 'Đỏ · <code>tests</code>, <code>reviews</code>, <code>portal</code>, <code>board</code>')]
  ]
)}

<p>${t('Next, verify four project-level rules in CT Work <code>settings</code> and <code>board</code>:', 'Tiếp theo, kiểm đủ bốn thiết lập cấp dự án trong <code>settings</code> và <code>board</code> của CT Work:')}</p>
<ol>
<li>${t('<strong>Project description banner:</strong> State explicitly in project details: <em>"Solo graduation project (SWP391 → SEP490). One student operating 5 role accounts C1–C5 to practice enterprise workflow."</em>', '<strong>Dòng minh bạch ở mô tả dự án:</strong> Ghi rõ trong phần giới thiệu dự án: <em>"Đồ án cá nhân (SWP391 → SEP490). Một sinh viên vận hành 5 tài khoản vai C1–C5 để luyện quy trình doanh nghiệp."</em>')}</li>
<li>${t('<strong>Five standard labels</strong> (mirroring school GitLab): <code>Req</code> (one screen/feature), <code>Task</code> (sub-work), <code>Q&amp;A</code> (lecturer questions → BR), <code>Defect</code> (bugs found internally), <code>Leakage</code> (bugs found after submission).', '<strong>Năm nhãn chuẩn</strong> (khớp GitLab môn học): <code>Req</code> (một màn/chức năng), <code>Task</code> (việc nhỏ), <code>Q&amp;A</code> (câu hỏi GV → BR), <code>Defect</code> (lỗi tự tìm), <code>Leakage</code> (lỗi GV tìm sau khi nộp).')}</li>
<li>${t('<strong>Four workflow columns:</strong> <code>To Do</code> (<code>1_To Do</code>) → <code>In Progress</code> (<code>2_Doing</code>, solo WIP limit = 2) → <code>In Review</code> (<code>3_Done</code> awaiting another hat\'s check) → <code>Done</code> (Closed by C1/C5 verification).', '<strong>Bốn cột trạng thái:</strong> <code>To Do</code> (<code>1_To Do</code>) → <code>In Progress</code> (<code>2_Doing</code>, giới hạn WIP solo = 2) → <code>In Review</code> (<code>3_Done</code> chờ mũ khác kiểm) → <code>Done</code> (đóng sau khi C1/C5 kiểm).')}</li>
<li>${t('<strong>Done rules (Evidence gate) &amp; mentor ground rules:</strong> Enable Done rules in <code>settings</code> so CT Work rejects dragging any card to <code>Done</code> if the Evidence link (PR, test result, or demo clip) is empty. Also open <code>settings</code> (AI/agent config if available) or pin your mentor ground rules in <code>docs</code> / <code>kb</code> so Ask AI (CuongMini) refuses to write LabFlow code for you.', '<strong>Luật Done (cổng Evidence) &amp; luật mentor:</strong> Bật Done rules trong <code>settings</code> để CT Work tự chặn kéo thẻ sang <code>Done</code> khi chưa có link Evidence (PR, kết quả test hoặc clip demo). Đồng thời mở <code>settings</code> (mục cấu hình AI/agent nếu có) hoặc ghim luật mentor trong <code>docs</code> / <code>kb</code> để nhắc Ask AI (CuongMini) không viết hộ code LabFlow.')}</li>
<li>${t('<strong>Worklog conservation rule across 5 accounts:</strong> Hours logged across C1–C5 are only a <em>split</em> of your real working hours (<code>sum(C1..C5) ≤ actual hours worked</code> — never log the same 2-hour block on multiple hats). Your Weekly Report and Project Tracking must report total effort honestly as <strong>one person</strong>.', '<strong>Luật bảo toàn giờ log trên 5 tài khoản:</strong> Giờ ghi (log work) trên C1–C5 chỉ là <em>phần chia</em> từ giờ làm thật (<code>tổng(C1..C5) ≤ giờ thực tế</code> — tuyệt đối không nhân giờ bằng cách log trùng khung giờ cho nhiều mũ). Weekly Report và Project Tracking phải ghi tổng giờ trung thực của <strong>một người</strong>.')}</li>
</ol>

<h3>${t('3. Pillar 2 — GitHub repo: 1 real Git identity, protected main &amp; CT Work webhook', '3. Trụ 2 — Repo GitHub: 1 danh tính Git thật, bảo vệ main &amp; nối webhook CT Work')} ${mu('C1', en)} ${mu('C3', en)}</h3>
<p>${t(
    'Setting up the repository and webhook step-by-step is already covered in ',
    'Thao tác tạo repo và nối webhook từng bước đã có sẵn tại ')}${cs('git', 'git-kd-4-truong-nhom-tao-repo', t('Git KĐ.4 — Create repo', 'Git KĐ.4 — Tạo repo'))}, ${cs('git', 'git-6-4-bao-ve-nhanh', t('Git 6.4 — Branch protection', 'Git 6.4 — Bảo vệ nhánh'))}${t(', and ', ' và ')}${cs('git', 'git-kd-10-noi-ct-work', t('Git KĐ.10 — Connect GitHub to CT Work', 'Git KĐ.10 — Nối GitHub với CT Work'))}${t(
    '. Apply these solo-company rules on top:',
    '. Khi làm một mình 5 vai, bạn áp thêm các quy ước sau:')}</p>
<ul>
<li>${t('<strong>Never forge Git accounts (and note the role-tag extension):</strong> Keep your real <code>user.name</code> and <code>user.email</code>. The LabFlow project page defines the base convention <code>feature/lf-22-reservation-wizard</code>, commit <code>LF-22 Validate slot overlap</code>, and <strong>only C1 (Maintainer) merges into <code>main</code></strong>. Because you work solo under <em>one</em> Git account, this course <strong>extends</strong> that base convention by adding the active role tag (<code>-c&lt;1-5&gt;</code> in branch names and <code>[C&lt;1-5&gt;]</code> + conventional prefix in commits): <code>feature/lf-22-c1-reservation-wizard</code> and <code>feat(LF-22): [C1] validate slot overlap</code> (keeping <code>LF-22</code> so CT Work auto-links the commit, and still letting only C1 click Merge). Prefer the shorter base format? It also links cleanly to CT Work as long as the card records the role.', '<strong>Tuyệt đối không tạo tài khoản Git giả (và ghi rõ phần mở rộng quy ước tên):</strong> Giữ nguyên <code>user.name</code> và <code>user.email</code> thật của bạn. Trang dự án LabFlow quy định chuẩn gốc là <code>feature/lf-22-reservation-wizard</code>, commit <code>LF-22 Validate slot overlap</code>, và <strong>chỉ C1 (Maintainer) được merge vào <code>main</code></strong>. Vì làm một mình bằng <em>một</em> tài khoản Git, khoá này <strong>mở rộng</strong> chuẩn gốc bằng cách chèn thêm nhãn vai đang đội (<code>-c&lt;1-5&gt;</code> ở tên nhánh và <code>[C&lt;1-5&gt;]</code> kèm tiền tố ở commit): <code>feature/lf-22-c1-reservation-wizard</code> và <code>feat(LF-22): [C1] validate slot overlap</code> (vẫn giữ mã <code>LF-22</code> để CT Work tự gắn commit và vẫn chỉ C1 bấm Merge). Bạn cũng có thể dùng đúng chuẩn gốc ngắn hơn nếu đã ghi rõ vai trên thẻ CT Work.')}</li>
<li>${t('<strong>Protect <code>main</code> on Day 0 (and check GitHub plan requirements!):</strong> On GitHub, Branch Protection / Rulesets on a <strong>private</strong> repository require <strong>GitHub Pro</strong> (free for university students via the <em>GitHub Student Developer Pack</em>) or Team. On a Free personal account, either (a) activate the Student Developer Pack for a private repo, or (b) use a <strong>public</strong> repo strictly containing <strong>zero PII and zero secrets</strong>, or (c) as a fallback if you cannot enable GitHub protection yet, host on <strong>GitLab Free</strong> (which includes branch protection on private repos) or add a local <code>pre-push</code> hook temporarily until Student Pack activates. On <strong>Day 0</strong>, enable: <em>Require a pull request before merging</em>, <em>Disallow force-pushes</em>, and <em>Do not allow bypassing the above settings</em>, then verify the active rule appears in <code>Settings → Branches</code> (or <code>Rulesets</code>). <strong>Note on CI:</strong> your repo has no CI pipeline yet on Day 0 — come back and enable <em>"Require status checks to pass"</em> right after you build CI in <strong>Lesson 6.3</strong>.', '<strong>Bảo vệ nhánh <code>main</code> ngay Ngày 0 (chú ý điều kiện gói GitHub!):</strong> Trên GitHub, Branch Protection / Rulesets cho kho <strong>private</strong> yêu cầu <strong>GitHub Pro</strong> (miễn phí cho sinh viên qua <em>GitHub Student Developer Pack</em>) hoặc gói Team. Với tài khoản Free, bạn chọn một trong ba cách: (a) kích hoạt Student Developer Pack để dùng kho private, (b) dùng kho <strong>public</strong> bảo đảm <strong>không chứa PII và không chứa bí mật</strong>, hoặc (c) phương án dự phòng nếu chưa bật được trên GitHub: dùng <strong>GitLab Free</strong> (có sẵn bảo vệ nhánh cho kho private) hoặc tạm cài hook <code>pre-push</code> dưới máy trong lúc chờ duyệt Student Pack. Ở <strong>Ngày 0</strong>, chỉ cần bật: <em>Require a pull request before merging</em>, <em>Disallow force-pushes</em> và <em>Do not allow bypassing the above settings</em>, rồi kiểm tra thấy rule hiện trong <code>Settings → Branches</code> (hoặc <code>Rulesets</code>). <strong>Lưu ý về CI:</strong> Ngày 0 repo chưa có CI — bạn sẽ quay lại bật thêm <em>"Require status checks to pass"</em> ngay sau khi dựng CI ở <strong>Bài 6.3</strong>.')}</li>
<li>${t('<strong>Commit <code>.gitignore</code> and <code>.env.example</code> on commit #1:</strong> Never commit real passwords or API keys. Keep a generic sample file in the repo so your future self (or teammate in SEP490) knows which variables exist without exposing secrets:', '<strong>Commit <code>.gitignore</code> và <code>.env.example</code> ngay từ commit đầu tiên:</strong> Không bao giờ commit mật khẩu thật hay API key. Giữ một tệp mẫu không chứa giá trị thật trong repo để bạn sau này (hoặc đồng đội SEP490) biết cần biến nào mà không lộ bí mật:')}</li>
</ul>

${bash(`# Minimal generic .gitignore starter (commit #1)
.env
.env.local
target/
node_modules/
dist/
.idea/
*.log`)}

${bash(`# Generic .env.example (safe to commit — placeholders only)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_dev
DB_USER=app_user
DB_PASSWORD=CHANGE_ME_LOCAL_ONLY
JWT_SECRET=CHANGE_ME_AT_LEAST_32_CHARS
MAIL_USER=your_sandbox_user
MAIL_PASS=your_sandbox_pass`)}

<h3>${t('4. Pillar 3 &amp; 4 — Project chat, docs &amp; your solo meeting calendar', '4. Trụ 3 &amp; 4 — Kênh chat, tài liệu &amp; lịch họp với chính mình')} ${mu('C1', en)}</h3>
<p>${t(
    'Why does a one-person company need a project <code>chat</code> channel and scheduled <code>meetings</code> on CT Work (',
    'Vì sao công ty một người vẫn cần kênh <code>chat</code> và lịch <code>meetings</code> trên CT Work (')}${cs('huong-dan-ct-work', 'ctw-04-tro-chuyen-docs-hop', t('CT Work 04 — Chat, Docs &amp; Meetings', 'CT Work 04 — Trò chuyện, Docs &amp; Họp'))}${t(
    ')? Because <strong>human memory is terrible at auditing decisions two months later</strong>. When the defense examiner asks "why did you drop feature X in week 6?", opening a timestamped meeting minute or decision log beats saying "I forgot".',
    ')? Vì <strong>trí nhớ con người cực tệ khi cần đối chứng quyết định của hai tháng trước</strong>. Khi hội đồng hỏi "vì sao tuần 6 em cắt tính năng X?", mở biên bản họp có dấu thời gian thuyết phục hơn hẳn câu "em quên mất rồi".')}</p>

${bang(
  [t('Ritual', 'Nghi thức'), t('When &amp; duration', 'Khi nào &amp; bao lâu'), t('Where it is recorded', 'Ghi ở đâu'), t('Concrete output', 'Đầu ra cụ thể')],
  [
    [t('<strong>Daily 3-line standup</strong>', '<strong>Daily 3 dòng</strong>'), t('Mon–Sat, start of work block (5 min)', 'T2–T7, đầu phiên làm việc (5 phút)'), t('CT Work card "Daily log tuần N" (or <code>chat</code>)', 'Thẻ CT Work "Daily log tuần N" (hoặc <code>chat</code>)'), t('Yesterday done · Today 1–2 cards + hat · Blocker (if any)', 'Hôm qua xong · Hôm nay 1–2 thẻ + mũ · Vướng mắc (nếu có)')],
    [t('<strong>Mid-sprint check</strong>', '<strong>Soát giữa tuần</strong>'), t('Wednesday evening (15 min)', 'Tối thứ Tư (15 phút)'), t('CT Work <code>reports</code> / <code>board</code>', '<code>reports</code> / <code>board</code> trên CT Work'), t('Check burndown &amp; WIP; flag any card stuck &gt; 2 days', 'Xem burndown &amp; WIP; gắn cờ thẻ đứng yên &gt; 2 ngày')],
    [t('<strong>Weekly Review &amp; Retro</strong>', '<strong>Review tuần &amp; Retro</strong>'), t('Sunday morning (45 min total: ~30 min reports + ~15 min retro)', 'Sáng Chủ nhật (tổng 45 phút: ~30 phút báo cáo + ~15 phút retro)'), t('CT Work <code>meetings</code> + <code>retros</code> + Weekly Report', '<code>meetings</code> + <code>retros</code> + Weekly Report trên CT Work'), t('Weekly Report saved, Tracking hours updated as 1 person (sum of C1–C5 ≤ real hours), 1 concrete improvement action → new card', 'Lưu Weekly Report, cập nhật giờ Tracking ghi rõ 1 người (tổng C1–C5 ≤ giờ thật), 1 hành động cải tiến → thẻ mới')],
    [t('<strong>Lecturer Q&amp;A sync</strong>', '<strong>Buổi hỏi đáp với GV</strong>'), t('Per class slot (15–30 min)', 'Theo lịch lớp (15–30 phút)'), t('CT Work <code>Q&amp;A</code> cards + <code>meetings</code> minutes', 'Thẻ <code>Q&amp;A</code> + biên bản trong <code>meetings</code>'), t('Every lecturer answer copied into a BR-xx or Change Request within 24h', 'Mọi câu trả lời của GV được chép thành BR-xx hoặc CR trong 24h')]
  ]
)}

<h3>🕵️ ${t('The attacker\'s angle: Day-0 security mistakes that haunt you forever', 'Góc kẻ xấu: lỗi bảo mật Ngày 0 ám ảnh suốt dự án')}</h3>
<p>${t(
    'One rushed Day-0 shortcut can compromise an entire project. In October 2022, <strong>Toyota Motor Corporation</strong> publicly disclosed that a contractor had accidentally uploaded source code containing an access key for its T-Connect service to a public GitHub repository, where it remained exposed for nearly five years (2017–2022), risking nearly 296,000 customer email addresses and IDs (Toyota Motor Corporation official press release, 7 October 2022). In a solo 5-role setup, watch out for four Day-0 attack surfaces:',
    'Một bước làm ẩu Ngày 0 có thể làm hỏng an ninh cả dự án. Tháng 10/2022, <strong>Toyota Motor Corporation</strong> công bố chính thức rằng một nhà thầu đã vô tình đẩy mã nguồn chứa khoá truy cập dịch vụ T-Connect lên kho GitHub công khai, để lộ suốt gần năm năm (2017–2022) và ảnh hưởng khoảng 296.000 email cùng mã khách hàng (Thông cáo chính thức của Toyota Motor Corporation, 07/10/2022). Ở mô hình 1 mình 5 vai, hãy bịt ngay bốn kẽ hở Ngày 0:')}</p>
<ol>
<li>${t('<strong>Reusing one weak password across all 5 CT Work role accounts:</strong> Use a password manager with unique strong passwords and enable 2FA on your main C1 account and GitHub (see ', '<strong>Dùng chung một mật khẩu yếu cho cả 5 tài khoản vai CT Work:</strong> Dùng trình quản lý mật khẩu tạo mật khẩu riêng mạnh và bật 2FA cho tài khoản chính C1 cùng GitHub (xem ')}${cs('agile-teamwork', 'agl-10-5-tai-khoan', t('Agile Teamwork 10.5 — Account hygiene', 'Agile Teamwork 10.5 — Vệ sinh tài khoản'))}).</li>
<li>${t('<strong>Committing <code>.env</code> or pasting secrets into chat/docs:</strong> Even if you delete <code>.env</code> in the next commit, it lives in Git history forever (fixing it requires rewriting history — ', '<strong>Commit nhầm <code>.env</code> hoặc dán bí mật vào chat/docs:</strong> Dù bạn xoá <code>.env</code> ở commit sau, nó vẫn nằm vĩnh viễn trong lịch sử Git (gỡ ra phải viết lại lịch sử — ')}${cs('git', 'git-8-3-go-bi-mat', t('Git 8.3 — Removing a secret', 'Git 8.3 — Gỡ bí mật khỏi lịch sử'))}).</li>
<li>${t('<strong>Giving an external AI mentor unrestricted write access to CT Work:</strong> If you connect an AI assistant via <code>settings</code> / MCP to read your board, select a <strong>read-only</strong> scope if available — and if the tool does not offer a read-only token yet, require manual confirmation before any write/delete call so no hallucinated tool call can corrupt your 608 cards.', '<strong>Cấp quyền ghi/xoá tự do cho AI mentor bên ngoài trên CT Work:</strong> Nếu nối trợ lý AI qua <code>settings</code> / MCP để đọc bảng, hãy chọn tuỳ chọn <strong>chỉ-đọc (read-only)</strong> nếu có — còn nếu công cụ chưa có tuỳ chọn chỉ-đọc, bắt buộc bật xác nhận tay trước mọi lệnh sửa/xoá để không lệnh nhầm nào làm hỏng 608 thẻ của bạn.')}</li>
<li>${t('<strong>Exposing university PII or keys in a public repo:</strong> Prefer a private repo (with GitHub Student Pack/Pro for branch protection). If you use a public repo on GitHub Free, never include real student IDs, real emails, real lecturer phone numbers, or access keys in seed data, code, or screenshots — and scan for secrets before pushing.', '<strong>Để lộ dữ liệu cá nhân (PII) hoặc khoá truy cập trong kho công khai:</strong> Ưu tiên kho private (kèm GitHub Student Pack/Pro để bật bảo vệ nhánh). Nếu dùng kho public trên GitHub Free, tuyệt đối không đưa mã sinh viên thật, email thật, số điện thoại giảng viên hay khoá truy cập vào dữ liệu mẫu, mã nguồn hay ảnh chụp — và luôn quét secret trước khi push.')}</li>
</ol>

<h3>📋 ${t('Fillable Project Charter — One-Person Company (copy to CT Work docs)', 'Mẫu Điều lệ dự án (Project Charter) — Công ty một người (chép vào CT Work docs)')}</h3>
${bang(
  [t('Field', 'Trường thông tin'), t('Fill for YOUR LabFlow workspace', 'Điền cho không gian LabFlow của BẠN')],
  [
    [t('CT Work Workspace &amp; Project Key', 'Không gian CT Work &amp; Mã dự án'), '<code>LabFlow Studio</code> · Key <code>LF</code> (#2)'],
    [t('Transparency Statement', 'Tuyên bố trung thực'), t('Solo project — 1 student operating 5 role accounts (C1–C5); total logged hours ≤ real hours', 'Dự án cá nhân — 1 sinh viên vận hành 5 tài khoản vai (C1–C5); tổng giờ log ≤ giờ thật')],
    [t('GitHub Repo URL &amp; Visibility', 'URL Repo GitHub &amp; Chế độ'), t('<code>https://github.com/&lt;your-user&gt;/labflow</code> (Private + Student Pack/Pro, or PII-free Public)', '<code>https://github.com/&lt;your-user&gt;/labflow</code> (Private + Student Pack/Pro, hoặc Public không PII)')],
    [t('Single Real Git Identity', 'Danh tính Git thật duy nhất'), '<code>user.name = ...</code> · <code>user.email = ...</code>'],
    [t('Branch &amp; Commit Format', 'Quy ước Nhánh &amp; Commit'), t('<code>feature/lf-&lt;id&gt;-c&lt;1-5&gt;-&lt;slug&gt;</code> · <code>type(LF-&lt;id&gt;): [C&lt;1-5&gt;] ...</code> (solo extension of project page format; only C1 merges)', '<code>feature/lf-&lt;id&gt;-c&lt;1-5&gt;-&lt;slug&gt;</code> · <code>type(LF-&lt;id&gt;): [C&lt;1-5&gt;] ...</code> (bản mở rộng từ chuẩn trang dự án; chỉ C1 merge)')],
    [t('Webhook &amp; Branch Rule Status', 'Trạng thái Webhook &amp; Rule bảo vệ nhánh'), t('Webhook connected · <code>Settings → Branches</code> active rule on <code>main</code>: [ ] Yes (CI check added in Ch 6.3)', 'Đã nối Webhook · <code>Settings → Branches</code> có rule cho <code>main</code>: [ ] Đạt (bật CI check ở Ch 6.3)')],
    [t('Fixed Weekly Rituals', 'Lịch nghi thức tuần cố định'), t('Daily: ___:___ · Mid-sprint Wed: ___:___ · Weekly+Retro Sun (45m): ___:___', 'Daily: ___:___ · Soát giữa tuần T4: ___:___ · Weekly+Retro CN (45p): ___:___')],
    [t('Solo WIP Limit &amp; Max Work Days', 'Giới hạn WIP &amp; Số ngày làm/tuần'), t('Max 2 cards In Progress · 6 days work + Sunday rest', 'Tối đa 2 thẻ In Progress · 6 ngày làm + Chủ nhật nghỉ')]
  ]
)}

${viecLabflow([
  [
    t('Create 5 colour-coded browser profiles (C1 Purple, C2 Sky Blue, C3 Green, C4 Amber, C5 Red) and log each profile into its matching CT Work role account on <strong>LF #2</strong>.', 'Tạo 5 profile trình duyệt gắn màu (C1 Tím, C2 Xanh dương, C3 Xanh lá, C4 Vàng cam, C5 Đỏ) và đăng nhập mỗi profile vào đúng tài khoản vai CT Work tương ứng trong <strong>LF #2</strong>.'),
    t('Switching from Dev (Green) to QA (Red) takes 1 click and shows the red QA account name in the top corner.', 'Đổi từ Dev (Xanh lá) sang QA (Đỏ) chỉ mất 1 cú bấm và góc trên hiện đúng tên tài khoản QA màu đỏ.')
  ],
  [
    t('Fill out the <strong>Project Charter</strong> table above inside CT Work <code>docs</code> (page <code>00-Company-Charter</code>) and link it in the pinned message of project <code>chat</code>.', 'Điền đầy đủ bảng <strong>Điều lệ dự án (Project Charter)</strong> ở trên vào <code>docs</code> của CT Work (trang <code>00-Company-Charter</code>) và ghim link vào kênh <code>chat</code> dự án.'),
    t('Project Charter page is saved with zero blanks and is reachable in 1 click from project chat.', 'Trang Điều lệ dự án lưu không còn ô trống và mở được trong 1 cú bấm từ kênh chat dự án.')
  ]
], en)}

${apDung([
  [t('Multi-vendor E-commerce Marketplace (topic switch)', 'Sàn thương mại điện tử nhiều người bán (đổi đề tài)'), t('Reuse the exact 4-pillar setup: configure <code>Req/Task/Q&amp;A/Defect/Leakage</code> for Cart/Order/Payment/Shipping screens, store payment-gateway sandbox keys (VNPay/Stripe) ONLY in local <code>.env</code> (placeholders in <code>.env.example</code>), ban real buyer phone/address PII from seed data, and enforce protected <code>main</code> + webhook.', 'Dùng lại trọn 4 trụ: tạo nhãn <code>Req/Task/Q&amp;A/Defect/Leakage</code> cho các màn Giỏ hàng/Đơn hàng/Thanh toán/Vận chuyển, giữ khoá sandbox cổng thanh toán (VNPay/Stripe) CHỈ trong <code>.env</code> dưới máy (mẫu rỗng ở <code>.env.example</code>), cấm đưa SĐT/địa chỉ thật của người mua vào dữ liệu mẫu và bật bảo vệ <code>main</code> + webhook.')],
  [t('Real 5-member SEP490 team', 'Đồ án nhóm thật 5 thành viên (SEP490)'), t('Replace the 5 browser profiles with 5 real teammates\' accounts; keep the exact same labels (Req/Task/Q&amp;A/Defect/Leakage), Done rules, branch protection (only Maintainer merges), honest per-member worklogs, and Day-0 security hygiene.', 'Thay 5 profile trình duyệt bằng tài khoản của 5 thành viên thật; giữ nguyên bộ nhãn (Req/Task/Q&amp;A/Defect/Leakage), Done rules, bảo vệ nhánh (chỉ Maintainer merge), log giờ trung thực từng người và vệ sinh bảo mật Ngày 0.')],
  [t('Enterprise company (FPT Software, 20–100 person outsourcing project)', 'Công ty lớn (FPT Software, dự án outsourcing 20–100 người)'), t('Every pillar maps 1-to-1 across PO, Scrum Master, DevOps, Security, and QA Lead under CMMI/ISO: CT Work → Jira, Done rules → Jira workflow validators, protected main → GitLab/GitHub rulesets with secret scanning, read-only token → least-privilege service account.', 'Mỗi trụ ánh xạ 1–1 giữa PO, Scrum Master, DevOps, Bảo mật và QA Lead theo chuẩn CMMI/ISO: CT Work → Jira, Done rules → bộ kiểm quy trình Jira, bảo vệ main → ruleset GitLab/GitHub kèm quét secret, token chỉ-đọc → tài khoản dịch vụ quyền tối thiểu.')]
], en)}

${thuatNgu([
  ['branch protection (bảo vệ nhánh)', t('Server-side GitHub/GitLab rules blocking direct pushes and force-pushes to <code>main</code> and requiring PRs (plus green CI checks once CI is set up in Lesson 6.3).', 'Luật phía máy chủ GitHub/GitLab chặn push thẳng và force-push lên <code>main</code>, bắt buộc đi qua PR (và bật thêm CI xanh sau khi dựng CI ở Bài 6.3).')],
  ['webhook', t('An HTTP callback triggered automatically by GitHub on push/PR events so CT Work displays commits inside the matching card.', 'Cơ chế GitHub tự gọi một địa chỉ HTTP mỗi khi có push/PR để CT Work hiện commit ngay trong thẻ việc tương ứng.')],
  ['Done rules', t('Project workflow guardrails on CT Work that block moving a card to <code>Done</code> unless mandatory fields (like Evidence) are present.', 'Luật chắn quy trình trên CT Work tự từ chối kéo thẻ sang <code>Done</code> nếu thiếu trường bắt buộc (như Evidence).')],
  ['PII (Personally Identifiable Information)', t('Data that can identify a real person (full name + student ID, real email, phone) — banned from seed data and screenshots.', 'Thông tin định danh cá nhân thật (họ tên + MSSV, email thật, số điện thoại) — cấm đưa vào dữ liệu mẫu và ảnh chụp.')],
  ['read-only token', t('An access token permitted only to read project/board data, preventing automated tools or AI from accidentally mutating records.', 'Mã truy cập chỉ có quyền đọc bảng/dự án, ngăn công cụ tự động hay AI vô tình sửa hoặc xoá dữ liệu.')]
], en)}

${tomTat([
  t('Physical boundaries reinforce mental hat-switching: use 5 colour-coded browser profiles logged into your 5 real CT Work role accounts (C1 Admin, C2–C5 Members), and keep total logged hours across all 5 hats ≤ your actual hours worked.', 'Ranh giới vật lý củng cố kỷ luật đổi mũ: dùng 5 profile trình duyệt gắn màu đăng nhập 5 tài khoản vai CT Work thật (C1 Admin, C2–C5 Member), và luôn giữ tổng giờ log của 5 mũ ≤ số giờ làm thật.'),
  t('On GitHub, keep ONE honest Git identity (never fake accounts), use the solo role-tag extension (or base format) with only C1 merging, protect <code>main</code> on Day 0 (PR + no force-push + no bypass; add CI checks in Lesson 6.3 — using Pro/Student Pack for private or a PII-free public repo), and wire the webhook to CT Work.', 'Trên GitHub, giữ MỘT danh tính Git trung thực (không tạo tài khoản giả), dùng quy ước mở rộng gắn vai (hoặc chuẩn gốc) với duy nhất C1 merge, bảo vệ <code>main</code> từ Ngày 0 (PR + cấm force-push + cấm bypass; bật CI check ở Bài 6.3 — dùng Pro/Student Pack cho private hoặc kho public không PII) và nối webhook về CT Work.'),
  t('Use CT Work <code>chat</code>, <code>docs</code>, and <code>meetings</code> plus a fixed calendar (including the 45-min Sunday Weekly Review &amp; Retro) so decisions have timestamped audit trails.', 'Dùng <code>chat</code>, <code>docs</code>, <code>meetings</code> trên CT Work cùng lịch cố định (gồm phiên 45 phút Review tuần &amp; Retro Chủ nhật) để mọi quyết định đều có dấu vết thời gian.'),
  t('Apply the Toyota T-Connect (2022) lesson: never leave access keys in public repos, scan for secrets before pushing, and rotate keys immediately if exposed; combine that with Day-0 preventive measures (<code>.gitignore</code> + <code>.env.example</code>, 2FA, unique passwords, and read-only/manual-approval AI access).', 'Nhớ bài học Toyota T-Connect (2022): tuyệt đối không để khoá truy cập trong kho public, quét secret trước khi push và đổi khoá ngay khi lộ; kết hợp các biện pháp phòng ngừa Ngày 0 (<code>.gitignore</code> + <code>.env.example</code>, 2FA, mật khẩu riêng và giới hạn quyền ghi của AI).')
], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${dm('dm5-0-lab', t('0.5 — Lab: Commissioning your one-person company on CT Work & GitHub', '0.5 — Lab: Khai trương "công ty một người" trên CT Work & GitHub'))}.</p>
`);
};

export default {
  title: '0.4 — Setting up your "one-person company": CT Work, 5 role accounts, GitHub & rituals|||0.4 — Dựng "công ty một người": CT Work, 5 tài khoản vai, GitHub, chat & lịch họp',
  slug: 'dm5-0-4-dung-cong-ty-mot-nguoi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hướng dẫn dựng trọn không gian "công ty một người": CT Work LF #2 với 5 tài khoản vai thật tách profile trình duyệt, nhãn chuẩn & Done rules, luật bảo toàn giờ log, repo GitHub 1 danh tính thật + bảo vệ main (kèm điều kiện gói Pro/Student Pack) + webhook, lịch họp 45 phút Chủ nhật, bảo mật Ngày 0 (sự cố Toyota T-Connect 2022) và mẫu Điều lệ dự án (Project Charter).',
  content: L04(true) + L04(false),
};
