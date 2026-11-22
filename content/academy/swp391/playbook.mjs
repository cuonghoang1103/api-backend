/**
 * SWP391 · Mục "Dự án nhóm thật" (soạn 22/11/2026) — cẩm nang làm đồ án nhóm THẬT, đặt ở CUỐI danh sách sections
 * (exam_chapter_map lưu sortOrder của section — chèn giữa làm lệch; xem docs/du-an-hop-dong.md).
 *
 * Chạy SONG SONG với các chương: chương dạy lý thuyết + tài liệu của giảng viên; mục này là đường "làm":
 *   P.1 cả kỳ theo tuần + ai làm gì (RACI) + Definition of Done
 *   P.2 hợp đồng nhóm, nhịp họp, Git flow nhóm, xử lý thành viên không làm (kịch bản tin nhắn)
 *   🛠 Mốc 1 — Khởi động
 *   P.3 bên trong một iteration + chuẩn bị mỗi buổi review với giảng viên
 *   P.4 bộ mẫu khởi đầu cho mọi deliverable (issue/MR/UC/màn hình/BR/test/README/release note)
 *   🛠 Mốc 2 — Iteration 1 · 🛠 Mốc 3 — Iteration 2
 *   P.5 lỗi hay mất điểm theo từng deliverable + phép tự soát 1 phút + phép soát khớp
 *   🛠 Mốc 4 — Iteration 3
 *   P.6 câu hội đồng hay hỏi + khung trả lời (yếu vs mạnh)
 *   🛠 Mốc 5 — Tổng duyệt Final Presentation
 *   P.7 từ SWP391 tới OJT — biến đồ án thành kinh nghiệm trên CV
 *   Quiz P (tiếng Anh) · 🎓 Bảo vệ
 * Không trùng nội dung chương: chỗ nào chương đã giảng kỹ thì chỉ dẫn link sang bài đó.
 * Không có tên/mã sinh viên thật.
 */
import { bi } from './_slides.mjs';
import { mocBai, baoVeBai, KHOA, GIT } from './duAn.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pre = (s, lang = 'plaintext') => `<pre><code class="language-${lang}">${esc(String(s).trim())}</code></pre>`;
const moc = (n) => mocBai.find((b) => b.mocDuAn === n);

/** Thẻ liên kết song ngữ (cùng markup với các bài cũ của SWP391). */
const lk = (href, ico, tEn, sEn, tVi, sVi, ext = false) => {
  const a = ext ? ' target="_blank" rel="noopener"' : '';
  const card = (t, s, cta) => `<a class="link-card lien-ket-cheo" href="${href}"${a}>
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${t}</span><span class="lc-sub">${s}</span></span>
  <span class="lc-cta">${cta}</span>
</a>`;
  return bi(card(tEn, sEn, 'OPEN LESSON →'), card(tVi, sVi, 'MỞ BÀI →'));
};

/* ═══════════════════════ P.1 — Cả kỳ trên một trang ═══════════════════════ */
const P1 = {
  title: 'P.1 — The whole semester on one page: week by week, who does what, Definition of Done|||P.1 — Cả kỳ trên một trang: từng tuần, ai làm gì, Definition of Done',
  slug: 'swp391-p-1-ban-do-ca-ky',
  type: 'VIDEO',
  description: 'Cẩm nang làm đồ án nhóm thật: lịch cả kỳ theo slot/tuần (khởi động → 3 iteration → Final Presentation), việc của nhóm và của từng người mỗi giai đoạn, bảng RACI cho mọi deliverable, Definition of Done cho một màn hình và cho một iteration, nhịp làm việc mỗi tuần.',
  content: [
    bi(`<span class="eyebrow">Team project playbook · P.1</span>
<h2>The whole semester on one page</h2>
<p class="lead">The chapters explain each guide and template. This section is the other half: <strong>how a real team actually runs SWP391</strong>, week by week, so nothing is discovered the night before a deadline. Open it in week 1 and keep it next to the chapters — every milestone lesson says which chapter it needs.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Place every deliverable on the calendar: what exists before Iteration 1, what each iteration ships, what the Final Presentation needs.</li>
<li>Say who is Responsible, Accountable, Consulted and Informed for each deliverable in a 4–5 person team.</li>
<li>Check a screen and an iteration against a Definition of Done before the teacher does.</li>
</ul></div>
<h3>The calendar — in slots, because classes differ</h3>
<p>The Subject Guides give each iteration <strong>6 slots of 135 minutes</strong> (or 9 of 90) and the Final Presentation 2 (or 3). On a 10-week term that is roughly three weeks per iteration. Your class calendar may shift the dates; the order below does not change.</p>
<div style="overflow-x:auto"><table><thead><tr><th>Phase</th><th>When</th><th>The team</th><th>Each member</th><th>Hand in / show</th></tr></thead><tbody>
<tr><td><b>Week 0</b></td><td>before slot 1</td><td>form the team, pick 2–3 candidate topics, create the chat channel</td><td>install JDK/Node, IDE, MySQL, Git; log in to GitLab with the school e-mail</td><td>—</td></tr>
<tr><td><b>Kickoff</b> (🛠 Milestone 1)</td><td>first 1–2 slots of Iteration 1</td><td>topic proposal → teacher approval; team charter; repository; Project Tracking draft</td><td>count and claim your screens; clone, run, merge one MR</td><td>approved Q&amp;A issue, repo link</td></tr>
<tr><td><b>Iteration 1</b> (🛠 Milestone 2)</td><td>slots 1–6</td><td>shared core (login, layout, base DAO), SRS/RDS v1, ERD v1</td><td>3–4 screens: spec → design → code → test</td><td>tracking, RDS/SRS(+SDS), tag <code>iter1</code>, DB script, demo videos — <b>15%</b></td></tr>
<tr><td><b>Iteration 2</b> (🛠 Milestone 3)</td><td>slots 7–12</td><td>fix Iteration-1 feedback, core workflow across members, System Test rounds</td><td>3–4 new, more complex screens + their Template3 sheets</td><td>same package + Template3, tag <code>iter2</code> — <b>20%</b></td></tr>
<tr><td><b>Iteration 3</b> (🛠 Milestone 4)</td><td>slots 13–18</td><td>scope freeze, regression of every screen, final documents, build outside the IDE</td><td>last screens, regression of own screens</td><td>final package, tag <code>iter3</code> — <b>25%</b></td></tr>
<tr><td><b>Final Presentation</b> (🛠 Milestone 5 + 🎓 defence)</td><td>last 2 slots</td><td>slides from Template7, demo script, two rehearsals</td><td>present your part, explain your code, make a live change</td><td>15-minute presentation to two other teachers — <b>40%</b>, must be ≥ 5</td></tr>
</tbody></table></div>
<h3>Hats — extra jobs on top of your screens</h3>
<p>SWP391 grades <em>every</em> member on full-stack screens (lesson 0.2), so nobody is "only the tester" or "only the documenter". Give each person one hat as well:</p>
<ul>
<li><strong>Leader</strong> — planning, the Weekly Report, talking to the teacher, unblocking people.</li>
<li><strong>Doc keeper</strong> — merges everyone's sections into SRS/SDS or RDS, owns the glossary and naming.</li>
<li><strong>QA keeper</strong> — the Definition of Done, the review checklist, System Test rounds, Defect vs Leakage.</li>
<li><strong>Release keeper</strong> — repository rules, DB scripts per iteration, tags, the package links.</li>
<li>(5th member) <strong>UI keeper</strong> — the shared theme/layout and the screen flow diagram.</li>
</ul>
<h3>RACI — one table to stop "I thought you were doing it"</h3>
<p>R = does the work · A = answers for it (exactly one) · C = consulted · I = informed.</p>
<div style="overflow-x:auto"><table><thead><tr><th>Deliverable</th><th>Leader</th><th>Doc keeper</th><th>QA keeper</th><th>Release keeper</th><th>Screen owner</th><th>Teacher (PO)</th></tr></thead><tbody>
<tr><td>Topic &amp; scope</td><td>A/R</td><td>C</td><td>C</td><td>I</td><td>C</td><td>approves</td></tr>
<tr><td>Use case + screen spec of a screen</td><td>I</td><td>C</td><td>C</td><td>I</td><td>A/R</td><td>confirms rules</td></tr>
<tr><td>SRS/SDS or RDS (whole)</td><td>C</td><td>A/R</td><td>C</td><td>I</td><td>R (own sections)</td><td>reviews</td></tr>
<tr><td>Database script</td><td>I</td><td>C</td><td>I</td><td>A</td><td>R (own tables)</td><td>—</td></tr>
<tr><td>Code of a screen</td><td>I</td><td>I</td><td>C (review)</td><td>I</td><td>A/R</td><td>grades in code demo</td></tr>
<tr><td>System Test (Template3)</td><td>I</td><td>I</td><td>A</td><td>I</td><td>R (own sheets)</td><td>—</td></tr>
<tr><td>Project Tracking</td><td>A</td><td>C</td><td>C</td><td>I</td><td>R (own rows)</td><td>reads it first</td></tr>
<tr><td>Weekly Report · AI Usage Report</td><td>A/R · A</td><td>I</td><td>I</td><td>I</td><td>R (own AI rows)</td><td>reads</td></tr>
<tr><td>Tag, DB export, package links</td><td>C</td><td>I</td><td>C</td><td>A/R</td><td>I</td><td>grades</td></tr>
<tr><td>Final Presentation</td><td>A</td><td>R (slides)</td><td>R (demo data)</td><td>R (build)</td><td>R (own part)</td><td>—</td></tr>
</tbody></table></div>
<h3>Definition of Done</h3>
<p class="nhan">A screen is Done when</p>
<ol>
<li>Its use case, business rules (by ID) and screen spec are in the documents.</li>
<li>Its design (class + sequence of the main flow) and tables are in the SDS/RDS and the DB script.</li>
<li>It opens from the menu, enforces its role, validates on the server and shows messages for every rule.</li>
<li>Lists have search, sort and paging; SQL is parameterised.</li>
<li>Its Template3 sheet has at least 8 cases (2 abnormal, 1 boundary) and the latest round passes.</li>
<li>It arrived through an issue → branch → MR reviewed by someone else.</li>
<li>Its Product-sheet row (complexity, owner, iteration, status) matches the issue.</li>
<li>The owner can explain every line — including any part drafted with AI, which is logged in Template5.</li>
</ol>
<p class="nhan">An iteration is Done when</p>
<ol>
<li>Every planned screen is Done, or moved with the teacher's agreement (recorded in a Q&amp;A issue).</li>
<li>The documents, the tracking file and the code use the same names.</li>
<li>The tag exists on the submitted commit and restores with its DB script on an empty schema.</li>
<li>Every member has a demo video; every package link opens in a private window.</li>
<li>Weekly Reports and the AI Usage Report cover every week.</li>
</ol>
<h3>A weekly rhythm that works for students</h3>
<ul>
<li><strong>Start of the week (20 min)</strong> — plan: each person names the 1–2 issues they will finish this week.</li>
<li><strong>Every day (async, 3 lines)</strong> — in the team channel or on the issue: done yesterday · doing today · blocked by.</li>
<li><strong>Mid-week</strong> — merge to <code>main</code> and run the app together once; integration problems found on Wednesday are cheap, on deadline night they are fatal.</li>
<li><strong>Before each class slot (15 min)</strong> — the review checklist in lesson P.3.</li>
<li><strong>End of the week</strong> — Leader fills the Weekly Report; each member logs their AI use.</li>
</ul>
<div class="callout"><strong>★ Beyond the guides — this is how real teams work.</strong> A company team calls the same things sprint planning, stand-up, sprint review and retrospective. If you run SWP391 this way you are not "playing company": you can say, truthfully, at your OJT interview that you shipped three increments with planning, code review and testing.</div>`,
    `<span class="eyebrow">Dự án nhóm thật · P.1</span>
<h2>Cả kỳ trên một trang</h2>
<p class="lead">Các chương giải thích từng guide và template. Mục này là nửa còn lại: <strong>một nhóm thật vận hành SWP391 thế nào</strong>, theo từng tuần, để không có gì bị phát hiện vào đêm trước hạn nộp. Mở nó ngay tuần 1 và để cạnh các chương — bài mốc nào cũng ghi cần học xong chương nào.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Đặt mọi deliverable lên lịch: cái gì phải có trước Iteration 1, mỗi iteration nộp gì, Final Presentation cần gì.</li>
<li>Nói được ai Làm, ai Chịu trách nhiệm, ai được Hỏi ý kiến và ai được Báo cho mỗi deliverable trong nhóm 4–5 người.</li>
<li>Soát một màn hình và một iteration theo Definition of Done trước khi giảng viên soát.</li>
</ul></div>
<h3>Lịch — tính theo slot, vì mỗi lớp mỗi khác</h3>
<p>Subject Guides cho mỗi iteration <strong>6 slot 135 phút</strong> (hoặc 9 slot 90 phút) và Final Presentation 2 (hoặc 3) slot. Trong kỳ 10 tuần, mỗi iteration khoảng ba tuần. Lịch lớp bạn có thể lệch ngày; thứ tự dưới đây thì không đổi.</p>
<div style="overflow-x:auto"><table><thead><tr><th>Giai đoạn</th><th>Khi nào</th><th>Cả nhóm</th><th>Mỗi thành viên</th><th>Nộp / trình bày</th></tr></thead><tbody>
<tr><td><b>Tuần 0</b></td><td>trước slot 1</td><td>lập nhóm, chọn 2–3 đề tài ứng viên, tạo kênh chat</td><td>cài JDK/Node, IDE, MySQL, Git; đăng nhập GitLab bằng email trường</td><td>—</td></tr>
<tr><td><b>Khởi động</b> (🛠 Mốc 1)</td><td>1–2 slot đầu của Iteration 1</td><td>đề xuất đề tài → giảng viên duyệt; hợp đồng nhóm; repository; nháp Project Tracking</td><td>đếm và nhận màn hình của mình; clone, chạy, merge một MR</td><td>issue Q&amp;A đã duyệt, link repo</td></tr>
<tr><td><b>Iteration 1</b> (🛠 Mốc 2)</td><td>slot 1–6</td><td>lõi dùng chung (đăng nhập, layout, DAO gốc), SRS/RDS v1, ERD v1</td><td>3–4 màn hình: đặc tả → thiết kế → code → test</td><td>tracking, RDS/SRS(+SDS), tag <code>iter1</code>, DB script, video demo — <b>15%</b></td></tr>
<tr><td><b>Iteration 2</b> (🛠 Mốc 3)</td><td>slot 7–12</td><td>sửa theo nhận xét Iteration 1, luồng lõi xuyên các thành viên, các vòng System Test</td><td>3–4 màn hình mới, phức tạp hơn + sheet Template3 của chúng</td><td>gói như trên + Template3, tag <code>iter2</code> — <b>20%</b></td></tr>
<tr><td><b>Iteration 3</b> (🛠 Mốc 4)</td><td>slot 13–18</td><td>chốt phạm vi, hồi quy mọi màn hình, tài liệu cuối, build chạy ngoài IDE</td><td>các màn hình cuối, hồi quy màn hình của mình</td><td>gói nộp cuối, tag <code>iter3</code> — <b>25%</b></td></tr>
<tr><td><b>Final Presentation</b> (🛠 Mốc 5 + 🎓 bảo vệ)</td><td>2 slot cuối</td><td>slide từ Template7, kịch bản demo, hai lần tổng duyệt</td><td>trình bày phần mình, giải thích code, sửa tại chỗ</td><td>15 phút trước hai giảng viên khác — <b>40%</b>, phải ≥ 5</td></tr>
</tbody></table></div>
<h3>"Vai" — việc thêm, chồng lên màn hình của bạn</h3>
<p>SWP391 chấm <em>mọi</em> thành viên theo màn hình full-stack (bài 0.2), nên không ai "chỉ test" hay "chỉ viết tài liệu". Mỗi người nhận thêm một vai:</p>
<ul>
<li><strong>Trưởng nhóm (Leader)</strong> — lập kế hoạch, Weekly Report, làm việc với giảng viên, gỡ vướng cho mọi người.</li>
<li><strong>Giữ tài liệu (Doc keeper)</strong> — gộp phần của mọi người vào SRS/SDS hoặc RDS, giữ glossary và cách đặt tên.</li>
<li><strong>Giữ chất lượng (QA keeper)</strong> — Definition of Done, checklist review, các vòng System Test, Defect và Leakage.</li>
<li><strong>Giữ phát hành (Release keeper)</strong> — luật repository, DB script mỗi iteration, tag, link gói nộp.</li>
<li>(người thứ 5) <strong>Giữ giao diện (UI keeper)</strong> — theme/layout dùng chung và sơ đồ screen flow.</li>
</ul>
<h3>RACI — một bảng để chấm dứt câu "tớ tưởng cậu làm"</h3>
<p>R = làm · A = chịu trách nhiệm cuối (đúng một người) · C = được hỏi ý kiến · I = được báo.</p>
<div style="overflow-x:auto"><table><thead><tr><th>Deliverable</th><th>Leader</th><th>Doc keeper</th><th>QA keeper</th><th>Release keeper</th><th>Chủ màn hình</th><th>Giảng viên (PO)</th></tr></thead><tbody>
<tr><td>Đề tài &amp; phạm vi</td><td>A/R</td><td>C</td><td>C</td><td>I</td><td>C</td><td>duyệt</td></tr>
<tr><td>Use case + đặc tả một màn hình</td><td>I</td><td>C</td><td>C</td><td>I</td><td>A/R</td><td>xác nhận luật</td></tr>
<tr><td>SRS/SDS hoặc RDS (cả bộ)</td><td>C</td><td>A/R</td><td>C</td><td>I</td><td>R (phần của mình)</td><td>review</td></tr>
<tr><td>DB script</td><td>I</td><td>C</td><td>I</td><td>A</td><td>R (bảng của mình)</td><td>—</td></tr>
<tr><td>Code một màn hình</td><td>I</td><td>I</td><td>C (review)</td><td>I</td><td>A/R</td><td>chấm ở buổi demo code</td></tr>
<tr><td>System Test (Template3)</td><td>I</td><td>I</td><td>A</td><td>I</td><td>R (sheet của mình)</td><td>—</td></tr>
<tr><td>Project Tracking</td><td>A</td><td>C</td><td>C</td><td>I</td><td>R (dòng của mình)</td><td>mở đầu tiên</td></tr>
<tr><td>Weekly Report · AI Usage Report</td><td>A/R · A</td><td>I</td><td>I</td><td>I</td><td>R (dòng AI của mình)</td><td>đọc</td></tr>
<tr><td>Tag, xuất CSDL, link gói nộp</td><td>C</td><td>I</td><td>C</td><td>A/R</td><td>I</td><td>chấm</td></tr>
<tr><td>Final Presentation</td><td>A</td><td>R (slide)</td><td>R (dữ liệu demo)</td><td>R (bản build)</td><td>R (phần của mình)</td><td>—</td></tr>
</tbody></table></div>
<h3>Definition of Done</h3>
<p class="nhan">Một màn hình là Done khi</p>
<ol>
<li>Use case, business rule (theo mã) và đặc tả màn hình đã có trong tài liệu.</li>
<li>Thiết kế (class + sequence của luồng chính) và các bảng đã có trong SDS/RDS và DB script.</li>
<li>Mở được từ menu, chặn đúng vai trò, kiểm lỗi ở server và có thông báo cho mọi luật.</li>
<li>Danh sách có tìm, sắp xếp, phân trang; SQL có tham số.</li>
<li>Sheet Template3 có ít nhất 8 case (2 bất thường, 1 biên) và vòng mới nhất đạt.</li>
<li>Đi vào qua issue → nhánh → MR do người khác review.</li>
<li>Dòng trong sheet Product (độ phức tạp, người làm, iteration, trạng thái) khớp với issue.</li>
<li>Chủ màn hình giải thích được từng dòng — kể cả phần nháp bằng AI, đã ghi trong Template5.</li>
</ol>
<p class="nhan">Một iteration là Done khi</p>
<ol>
<li>Mọi màn hình dự kiến đã Done, hoặc được dời khi giảng viên đồng ý (ghi trong issue Q&amp;A).</li>
<li>Tài liệu, file tracking và code dùng cùng một bộ tên.</li>
<li>Tag nằm đúng commit đã nộp và khôi phục được cùng DB script lên schema trống.</li>
<li>Mỗi thành viên có video demo; mọi link trong gói mở được ở cửa sổ ẩn danh.</li>
<li>Weekly Report và AI Usage Report phủ đủ mọi tuần.</li>
</ol>
<h3>Nhịp tuần hợp với sinh viên</h3>
<ul>
<li><strong>Đầu tuần (20 phút)</strong> — lập kế hoạch: mỗi người nói 1–2 issue sẽ xong trong tuần.</li>
<li><strong>Mỗi ngày (không đồng bộ, 3 dòng)</strong> — trong kênh nhóm hoặc trên issue: hôm qua xong gì · hôm nay làm gì · đang vướng gì.</li>
<li><strong>Giữa tuần</strong> — merge vào <code>main</code> và cùng chạy app một lần; lỗi tích hợp phát hiện thứ Tư thì rẻ, đêm hạn nộp thì chết.</li>
<li><strong>Trước mỗi slot trên lớp (15 phút)</strong> — checklist review ở bài P.3.</li>
<li><strong>Cuối tuần</strong> — Leader điền Weekly Report; mỗi người ghi phần dùng AI của mình.</li>
</ul>
<div class="callout"><strong>★ Ngoài guide — đây là cách team thật làm.</strong> Ở công ty, những việc trên gọi là sprint planning, stand-up, sprint review và retrospective. Làm SWP391 theo cách này không phải "chơi đóng vai công ty": khi phỏng vấn OJT bạn nói được, một cách trung thực, rằng mình đã giao ba bản tăng dần có lập kế hoạch, review code và kiểm thử.</div>`),
    lk(`${KHOA}swp391-4-1-repository-service-sqli`, '🔁', 'Inside one iteration — lesson 4.1', 'The three phases of an iteration, the two status systems that must agree, and the Policies sheet translated.', 'Bên trong một iteration — bài 4.1', 'Ba pha của một iteration, hai hệ trạng thái phải khớp nhau, và sheet Policies dịch đầy đủ.'),
  ].join('\n'),
};

/* ═══════════════════════ P.2 — Hợp đồng nhóm, họp, Git flow ═══════════════════════ */
const CHARTER = `
# Team charter — <team code> · <project name>

## 1. Members & hats
| Member (GitLab user) | Hat            | Screens (see Product sheet) |
|----------------------|----------------|-----------------------------|
| member-a             | Leader         | UC-01..UC-04                |
| member-b             | Doc keeper     | UC-05..UC-08                |
| member-c             | QA keeper      | …                           |
| member-d             | Release keeper | …                           |
| member-e             | UI keeper      | …                           |

## 2. Communication
- Team channel: <Slack/Discord/Zalo group>. Questions about requirements go to a Q&A issue, not the chat.
- Reply within 12 hours on weekdays. Say early when you cannot.
- Daily async stand-up before 22:00: done · doing · blocked.

## 3. Meetings
- Planning: first day of each iteration, 45 min. Weekly check: <day/time>, 20 min. Retro: last day, 20 min.
- Minutes in docs/meetings/YYYY-MM-DD.md (decisions + owners + due dates).

## 4. Definition of Done
- Screen: see P.1 (8 points). Iteration: see P.1 (5 points).

## 5. Git rules
- main is protected; work on feature/<issue>-<short-name>; MR with the template; 1 reviewer; no self-merge.
- Pull/merge main into your branch every day. Never commit .env, passwords, build/ or IDE private folders.

## 6. Deadlines & late work
- Internal deadline = official deadline − 48 h. A task late by 24 h is raised in the stand-up with a new, smaller date.
- Escalation ladder: private message → stand-up → re-plan together → tell the teacher with facts (issues, commits, Weekly Report).

## 7. AI use
- Allowed with Template5 logging; you must be able to explain every line you submit.

Agreed by (one commit each): member-a, member-b, member-c, member-d, member-e`;

const MINUTES = `
# Meeting — 2026-xx-xx (Iteration 2 planning) · 45 min · present: a, b, c, d (e excused)
Decisions
- Booking screen owns the overlap rule (BR-03); check runs inside one transaction.
- Scope cut: "recurring booking" moves to Iteration 3 (confirmed in Q&A issue #27).
Actions
- [ ] a — Req #31 Book slot — due Fri
- [ ] b — RDS section 3.4 update — due Sat
- [ ] c — Template3 sheets for #31, #32 — due Sun
Risks / blockers
- d's laptop cannot run MySQL 8 → use docker compose (lesson 9.1) — d, today`;

const GITFLOW = `
# once per screen (issue #31)
git switch main && git pull
git switch -c feature/31-book-slot

# every day
git add -p                        # stage only what belongs to this issue
git commit -m "Req #31: validate slot overlap before insert"
git fetch origin && git merge origin/main   # or: git rebase origin/main (only before anyone reviewed)
git push -u origin feature/31-book-slot

# open MR "Req #31: Book slot" with the template → reviewer ticks the checklist → merge → delete branch
# end of iteration (release keeper)
git switch main && git pull
git tag -a iter2 -m "Iteration 2 submission" && git push origin iter2`;

const GITIGNORE = `
# Java web (NetBeans / Maven)
/build/  /dist/  /target/  nbproject/private/  *.class  *.war
# Node / React
node_modules/  dist/  .vite/
# secrets & local config — share .env.example instead
.env  *.local  config/db.properties
# OS / IDE
.DS_Store  Thumbs.db  .idea/  .vscode/settings.json`;

const P2 = {
  title: 'P.2 — Team setup that lasts: charter, meetings, team Git flow, a member who does not deliver|||P.2 — Dựng nhóm cho trụ cả kỳ: hợp đồng nhóm, họp, Git flow nhóm, thành viên không làm',
  slug: 'swp391-p-2-hop-dong-nhom-git-flow',
  type: 'VIDEO',
  description: 'Hợp đồng nhóm mẫu (chép vào docs/team-charter.md), bốn loại họp và biên bản mẫu, Git flow của nhóm từng lệnh (nhánh theo issue, MR có review, tag mỗi iteration, .gitignore), và kịch bản tin nhắn từng bậc khi có thành viên không làm — liên kết khoá Git.',
  content: [
    bi(`<span class="eyebrow">Team project playbook · P.2</span>
<h2>Team setup that survives the semester</h2>
<p class="lead">Most SWP391 teams do not fail on Java or SQL. They fail on unwritten rules: nobody knows the deadline inside the team, three people edit the same JSP, one member disappears in week 4. Write the rules down on day one — it takes an hour and saves the semester.</p>
<h3>1 · The team charter — copy into <code>docs/team-charter.md</code></h3>
<p>Fill it together in the kickoff meeting. Each member commits one line ("agreed — member-x") <em>with their own account</em>: it is the first piece of contribution evidence and it makes the rules impossible to "not remember".</p>
${pre(CHARTER, 'markdown')}
<h3>2 · Four meetings, each with a job</h3>
<div style="overflow-x:auto"><table><thead><tr><th>Meeting</th><th>When · length</th><th>Agenda</th><th>Output</th></tr></thead><tbody>
<tr><td><b>Planning</b></td><td>first day of the iteration · 45 min</td><td>feedback from the last iteration → screens of this iteration (Product sheet) → who owns what → shared-core changes → risks</td><td>issues created and assigned, milestone set</td></tr>
<tr><td><b>Stand-up</b></td><td>daily, async · 3 lines</td><td>done · doing · blocked</td><td>a message in the channel or on the issue</td></tr>
<tr><td><b>Review prep</b></td><td>before each class slot · 15 min</td><td>the checklist in P.3; questions for the teacher</td><td>a list of Q&amp;A questions; what to show</td></tr>
<tr><td><b>Retro</b></td><td>after submitting · 20 min</td><td>keep / drop / try — one concrete change</td><td>3 bullets in the Weekly Report</td></tr>
</tbody></table></div>
<p>Minutes are short and live in the repo — decisions, owners, dates:</p>
${pre(MINUTES, 'markdown')}
<h3>3 · The team Git flow, command by command</h3>
<p>The course decks teach Git and GitLab (lessons 1.3–1.5, 4.6). Here is the flow a team of five actually follows, from one issue to the iteration tag:</p>
${pre(GITFLOW, 'bash')}
<ul>
<li><strong>One issue = one branch = one MR.</strong> The MR title starts with the issue number, so the teacher can follow Product row → issue → MR → commits.</li>
<li><strong>Shared files have an owner.</strong> The header/menu, the base DAO and the DB connection belong to one person; others change them only through that person's review. Most conflicts in SWP391 come from the shared header and <code>web.xml</code>.</li>
<li><strong>Merge <code>main</code> into your branch every day</strong>, not only at the end; small conflicts are easy.</li>
<li><strong>Never push someone else's work from your machine</strong> "to save time" — the commit author is the contribution evidence (lesson 7.1).</li>
</ul>
<p class="nhan">.gitignore — what never goes into the repository</p>
${pre(GITIGNORE)}
<h3>4 · A member who does not deliver — what to actually write</h3>
<p>Lesson 7.1 gives the fair escalation ladder (early · visible · factual). These are the messages for each step — kind, specific, and with a date:</p>
<ol>
<li><strong>Private, early (day 2–3 of no movement):</strong> "Hi, I saw issue #31 hasn't moved since Monday. Are you stuck on something? I can pair with you for 30 minutes tonight." </li>
<li><strong>In the stand-up:</strong> "#31 Book slot — the new target is Thursday for the list part only; the payment part can wait. OK?" — and write it in the minutes.</li>
<li><strong>Re-plan together:</strong> "We have 6 days left. If #31 is not merged by Friday, can B take the payment part and you keep the list? I'll update the Product sheet with both names." — only with the owner's agreement.</li>
<li><strong>Tell the teacher (coach hat), with facts, before the deadline:</strong> "Team G3: issue #31 (assigned week 1) has no commits; we re-planned on <date> (minutes link). We are moving the payment part to member B. Please advise." </li>
</ol>
<div class="pitfall co-tieu-de"><strong>What not to do.</strong> Do not silently code the screen for them — they cannot explain it in the code demo, the examiners notice after one question, and both of you are exposed (lesson 7.1). Do not complain in the group chat without the facts. Do not wait until the last week: by then the teacher can only grade what exists.</div>
<p class="meo">🧠 <strong>Remember:</strong> a rule that is not written down is not a rule. Charter, minutes and issues are your memory — and your evidence.</p>`,
    `<span class="eyebrow">Dự án nhóm thật · P.2</span>
<h2>Dựng nhóm cho trụ được cả kỳ</h2>
<p class="lead">Đa số nhóm SWP391 không trượt vì Java hay SQL. Họ trượt vì luật không viết ra: không ai biết hạn trong nhóm, ba người cùng sửa một file JSP, một thành viên biến mất từ tuần 4. Viết luật ra ngay ngày đầu — mất một giờ, cứu cả kỳ.</p>
<h3>1 · Hợp đồng nhóm — chép vào <code>docs/team-charter.md</code></h3>
<p>Cả nhóm cùng điền trong buổi khởi động. Mỗi người commit một dòng ("agreed — member-x") <em>bằng tài khoản của chính mình</em>: đó là bằng chứng đóng góp đầu tiên, và cũng khiến không ai "quên" được luật.</p>
${pre(CHARTER, 'markdown')}
<p class="ghi-chu">Mẫu viết tiếng Anh vì repository và tài liệu nộp thường bằng tiếng Anh; nhóm có thể viết tiếng Việt nếu giảng viên đồng ý.</p>
<h3>2 · Bốn buổi họp, mỗi buổi một việc</h3>
<div style="overflow-x:auto"><table><thead><tr><th>Buổi</th><th>Khi nào · bao lâu</th><th>Nội dung</th><th>Kết quả</th></tr></thead><tbody>
<tr><td><b>Planning</b></td><td>ngày đầu iteration · 45 phút</td><td>nhận xét iteration trước → màn hình của iteration này (sheet Product) → ai nhận gì → thay đổi phần lõi chung → rủi ro</td><td>issue được tạo và giao, gắn milestone</td></tr>
<tr><td><b>Stand-up</b></td><td>hằng ngày, không đồng bộ · 3 dòng</td><td>xong gì · làm gì · vướng gì</td><td>một tin trong kênh nhóm hoặc trên issue</td></tr>
<tr><td><b>Chuẩn bị review</b></td><td>trước mỗi slot trên lớp · 15 phút</td><td>checklist ở P.3; câu hỏi cho giảng viên</td><td>danh sách câu hỏi Q&amp;A; thứ sẽ cho xem</td></tr>
<tr><td><b>Retro</b></td><td>sau khi nộp · 20 phút</td><td>giữ / bỏ / thử — một thay đổi cụ thể</td><td>3 gạch đầu dòng trong Weekly Report</td></tr>
</tbody></table></div>
<p>Biên bản ngắn và nằm trong repo — quyết định, người làm, hạn:</p>
${pre(MINUTES, 'markdown')}
<h3>3 · Git flow của nhóm, từng lệnh một</h3>
<p>Slide của môn dạy Git và GitLab (bài 1.3–1.5, 4.6). Dưới đây là luồng một nhóm năm người thật sự đi, từ một issue tới tag của iteration:</p>
${pre(GITFLOW, 'bash')}
<ul>
<li><strong>Một issue = một nhánh = một MR.</strong> Tiêu đề MR bắt đầu bằng số issue, để giảng viên lần được dòng Product → issue → MR → commit.</li>
<li><strong>File dùng chung có chủ.</strong> Header/menu, DAO gốc và kết nối CSDL thuộc về một người; người khác chỉ sửa qua review của người đó. Phần lớn xung đột ở SWP391 đến từ header chung và <code>web.xml</code>.</li>
<li><strong>Merge <code>main</code> vào nhánh của mình mỗi ngày</strong>, đừng đợi tới cuối; xung đột nhỏ thì dễ gỡ.</li>
<li><strong>Không bao giờ push bài của bạn khác từ máy mình</strong> "cho nhanh" — tác giả commit chính là bằng chứng đóng góp (bài 7.1).</li>
</ul>
<p class="nhan">.gitignore — thứ không bao giờ vào repository</p>
${pre(GITIGNORE)}
<h3>4 · Thành viên không làm — viết gì cho đúng</h3>
<p>Bài 7.1 đã có thang leo thang công bằng (sớm · thấy được · có dữ kiện). Đây là tin nhắn cho từng bậc — tử tế, cụ thể, có ngày:</p>
<ol>
<li><strong>Nhắn riêng, sớm (sau 2–3 ngày không nhúc nhích):</strong> "Ê, tớ thấy issue #31 chưa động từ thứ Hai. Cậu đang vướng chỗ nào à? Tối nay tớ ngồi cùng 30 phút được."</li>
<li><strong>Trong stand-up:</strong> "#31 Đặt sân — hạn mới là thứ Năm, chỉ phần danh sách; phần thanh toán để sau. Được không?" — và ghi vào biên bản.</li>
<li><strong>Cùng lập lại kế hoạch:</strong> "Còn 6 ngày. Nếu thứ Sáu #31 chưa merge, B nhận phần thanh toán, cậu giữ phần danh sách nhé? Tớ ghi cả hai tên vào sheet Product." — chỉ khi chủ màn hình đồng ý.</li>
<li><strong>Báo giảng viên (mũ coach), bằng dữ kiện, trước hạn:</strong> "Nhóm G3: issue #31 (giao tuần 1) chưa có commit nào; nhóm đã lập lại kế hoạch ngày … (link biên bản). Nhóm đang chuyển phần thanh toán cho thành viên B. Xin thầy/cô góp ý."</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Đừng làm.</strong> Đừng lặng lẽ code hộ màn hình — bạn đó không giải thích được ở buổi demo code, giám khảo nhận ra sau một câu hỏi, và cả hai cùng lộ (bài 7.1). Đừng than trong nhóm chat mà không có dữ kiện. Đừng đợi tới tuần cuối: lúc đó giảng viên chỉ chấm được thứ đang có.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> luật không viết ra thì không phải luật. Hợp đồng nhóm, biên bản và issue là trí nhớ của nhóm — và là bằng chứng.</p>`),
    lk(`${GIT}git-kd-7-mot-lan-va-moi-ngay`, '🌿', 'Git course · KĐ.7 — one-off setup and the daily loop for one task card', 'Every command of the daily loop on Windows and Mac, then KĐ.8 (pull, merge main, first conflict) and KĐ.9 (real team mistakes).', 'Khoá Git · KĐ.7 — việc một lần và vòng lặp mỗi ngày cho một thẻ việc', 'Từng lệnh của vòng lặp hằng ngày trên Windows và Mac, rồi KĐ.8 (pull, merge main, xung đột đầu tiên) và KĐ.9 (lỗi nhóm đã gặp thật).'),
    lk(`${GIT}git-6-1-giai-phau-pr`, '🔍', 'Git course · 6.1 — anatomy of a pull request that really gets reviewed', 'GitLab calls it a merge request; the rules are the same: small, one purpose, a description the reviewer can check.', 'Khoá Git · 6.1 — giải phẫu một pull request thật sự được review', 'GitLab gọi là merge request; luật giống hệt: nhỏ, một mục đích, mô tả mà người review kiểm được.'),
    lk(`${GIT}git-16-4-su-co-nhom`, '🚑', 'Git course · 16.4 — eight classic team incidents: symptom, diagnosis, rescue, prevention', 'And chapter 18: build/ committed by mistake, web.xml conflicts, a broken merge — the accidents SWP391 teams really have.', 'Khoá Git · 16.4 — tám sự cố kinh điển của nhóm: triệu chứng, chẩn đoán, cứu, phòng', 'Cùng chương 18: lỡ commit build/, xung đột web.xml, merge hỏng — đúng những tai nạn nhóm SWP391 hay gặp.'),
  ].join('\n'),
};

/* ═══════════════════════ P.3 — Bên trong một iteration + buổi review ═══════════════════════ */
const QA_ISSUE = `
Title: [Q&A] BR-04 — how late can a customer cancel?

Context: UC-09 Cancel booking. Our draft rule BR-04: "a customer may cancel up to 2 hours before the start".
Question: Is 2 hours right? What happens to the deposit when they cancel later?
Options we considered:
  A) refuse the cancel after the limit
  B) allow it but keep the deposit
Our proposal: B, and show the rule on the confirmation screen.
Needed by: Thursday (screen is planned for Iteration 2).
---
Teacher's answer (copied here and in RDS §BR when received): …`;

const P3 = {
  title: 'P.3 — Inside one iteration, slot by slot — and how to prepare every review with your teacher|||P.3 — Bên trong một iteration, từng slot — và chuẩn bị mỗi buổi review với giảng viên',
  slug: 'swp391-p-3-vong-iteration-buoi-review',
  type: 'VIDEO',
  description: 'Một iteration 6 slot chia việc thế nào (đặc tả → thiết kế → code → tích hợp → test → đóng gói), ba kiểu buổi gặp giảng viên, checklist 12 mục trước mỗi buổi review, mẫu issue Q&A hỏi PO cho đúng, biến nhận xét thành issue trong 24 giờ, và những dấu hiệu giảng viên thấy trong 30 giây.',
  content: [
    bi(`<span class="eyebrow">Team project playbook · P.3</span>
<h2>Inside one iteration — and every review with your teacher</h2>
<p class="lead">Each iteration is a small project of its own, and the teacher sees it through a few short meetings. Teams that prepare those meetings get their requirements confirmed, their mistakes caught early and their grade explained. Teams that "just show up" find out at the code demo.</p>
<h3>1 · Six slots, one plan (135-minute slots; stretch it over 9 if yours are 90)</h3>
<div style="overflow-x:auto"><table><thead><tr><th>Slot</th><th>In class (with the teacher)</th><th>Between slots (the team)</th></tr></thead><tbody>
<tr><td>1</td><td>show the plan: screens of this iteration in the Product sheet; ask open requirement questions</td><td>use-case + screen specs of your screens; BR list updated</td></tr>
<tr><td>2</td><td>get rules confirmed (Q&amp;A issues answered); show the prototype</td><td>design: class/sequence diagrams, your tables in the DB script</td></tr>
<tr><td>3</td><td>progress check: first screens running on <code>main</code></td><td>code; MRs reviewed within 24 h</td></tr>
<tr><td>4</td><td>show a working flow; ask about anything that changed</td><td>finish code; Template3 cases written</td></tr>
<tr><td>5</td><td>integration demo of the whole iteration on one machine</td><td>test round(s); fix Defects; documents merged</td></tr>
<tr><td>6</td><td>code demo / iteration review (graded)</td><td>tag, DB export, videos, package links; retro</td></tr>
</tbody></table></div>
<p>Your teacher may organise the slots differently; keep the <em>sequence</em>: specify → confirm → design → build → integrate → test → package. Coding before the rules are confirmed is how screens end up rated Low quality.</p>
<h3>2 · Three kinds of meeting with the teacher</h3>
<ul>
<li><strong>Progress check</strong> — "where are you?". The teacher looks at the board and the Product sheet. Bring numbers: screens Done / In progress / Not started per member.</li>
<li><strong>Requirement clarification</strong> — the teacher is your <em>customer/PO</em>. Bring written questions with options (template below); leave with answers recorded.</li>
<li><strong>Code demo / iteration review</strong> — each member opens <em>their</em> screens and explains the code; the teacher decides Complexity and Quality (lessons 0.2, 4.3). Findings after you submit become <code>Leakage</code> issues.</li>
</ul>
<h3>3 · Checklist before every review slot (15 minutes, the night before)</h3>
<ol>
<li><code>main</code> builds and runs on one laptop with the current DB script — the laptop you will present on.</li>
<li>Demo accounts for each role work; demo data is realistic (no "aaa", no "test123").</li>
<li>Board: every issue has an assignee, a milestone, one status label (<code>1_To Do</code>, <code>2_Doing</code>, <code>3_Done</code>).</li>
<li>Product sheet statuses match the board (lesson 4.1 §5).</li>
<li>Each member knows which 1–2 things they will show and can open them in under a minute.</li>
<li>Open questions are written as Q&amp;A issues, not in someone's head.</li>
<li>Last review's feedback is already turned into issues — and you can say which are closed.</li>
<li>The Weekly Report for last week is filled in.</li>
<li>AI Usage rows for this week exist for anyone who used AI.</li>
<li>Documents in the repo are the latest; the Record of Changes has this week's rows.</li>
<li>Nobody plans to "fix one small thing" during the meeting.</li>
<li>One person takes notes of everything the teacher says.</li>
</ol>
<h3>4 · Asking the PO well — the Q&amp;A issue template</h3>
${pre(QA_ISSUE, 'markdown')}
<p>Context, a precise question, your options and a proposal: the teacher can answer in one line, and the answer becomes a confirmed business rule you can cite in the defence ("confirmed in issue #27").</p>
<h3>5 · After the review: feedback → issues within 24 hours</h3>
<ul>
<li>Bug found by the teacher after submission → <code>Leakage</code> issue (never relabel it as <code>Defect</code>; lesson 5.1).</li>
<li>Requirement change → update the use case/BR, add a Record of Changes row, link the Q&amp;A issue.</li>
<li>Advice about the process → one line in the Weekly Report and the next retro.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Red flags a teacher sees in 30 seconds.</strong> All commits from one account. A board with no issues in <code>2_Doing</code> for two weeks, then forty closed on the last night. A Product sheet where every screen is "Complex". Documents dated the day of submission. A demo that starts with "wait, it worked yesterday".</div>`,
    `<span class="eyebrow">Dự án nhóm thật · P.3</span>
<h2>Bên trong một iteration — và mỗi buổi review với giảng viên</h2>
<p class="lead">Mỗi iteration là một dự án nhỏ, và giảng viên nhìn nó qua vài buổi gặp ngắn. Nhóm chuẩn bị kỹ các buổi đó thì yêu cầu được xác nhận, lỗi được bắt sớm và điểm được giải thích. Nhóm "cứ tới rồi tính" thì tới buổi demo code mới biết.</p>
<h3>1 · Sáu slot, một kế hoạch (slot 135 phút; lớp 90 phút thì giãn ra 9 slot)</h3>
<div style="overflow-x:auto"><table><thead><tr><th>Slot</th><th>Trên lớp (có giảng viên)</th><th>Giữa các slot (cả nhóm)</th></tr></thead><tbody>
<tr><td>1</td><td>trình kế hoạch: màn hình của iteration trong sheet Product; hỏi các câu yêu cầu còn mở</td><td>đặc tả use case + màn hình của mình; cập nhật danh sách BR</td></tr>
<tr><td>2</td><td>xin xác nhận luật (issue Q&amp;A có trả lời); cho xem prototype</td><td>thiết kế: class/sequence diagram, bảng của mình trong DB script</td></tr>
<tr><td>3</td><td>soát tiến độ: màn hình đầu tiên chạy trên <code>main</code></td><td>code; MR được review trong 24 giờ</td></tr>
<tr><td>4</td><td>cho xem một luồng chạy được; hỏi về mọi thứ đã thay đổi</td><td>xong code; viết case Template3</td></tr>
<tr><td>5</td><td>demo tích hợp cả iteration trên một máy</td><td>(các) vòng test; sửa Defect; gộp tài liệu</td></tr>
<tr><td>6</td><td>demo code / review iteration (có chấm)</td><td>tag, xuất CSDL, video, link gói nộp; retro</td></tr>
</tbody></table></div>
<p>Giảng viên của bạn có thể tổ chức slot khác; hãy giữ <em>trình tự</em>: đặc tả → xác nhận → thiết kế → xây → tích hợp → test → đóng gói. Code trước khi luật được xác nhận là con đường dẫn tới màn hình bị chấm Quality Low.</p>
<h3>2 · Ba kiểu buổi gặp giảng viên</h3>
<ul>
<li><strong>Soát tiến độ</strong> — "nhóm đang ở đâu?". Giảng viên nhìn bảng issue và sheet Product. Mang theo con số: màn hình Done / Đang làm / Chưa làm của từng người.</li>
<li><strong>Làm rõ yêu cầu</strong> — giảng viên là <em>khách hàng/PO</em>. Mang câu hỏi viết sẵn kèm phương án (mẫu bên dưới); ra về với câu trả lời đã ghi lại.</li>
<li><strong>Demo code / review iteration</strong> — mỗi thành viên mở <em>màn hình của mình</em> và giải thích code; giảng viên quyết định Complexity và Quality (bài 0.2, 4.3). Lỗi tìm ra sau khi nộp thành issue <code>Leakage</code>.</li>
</ul>
<h3>3 · Checklist trước mỗi slot review (15 phút, tối hôm trước)</h3>
<ol>
<li><code>main</code> build và chạy được trên một laptop với DB script hiện tại — đúng laptop sẽ trình bày.</li>
<li>Tài khoản demo của từng vai trò đăng nhập được; dữ liệu demo giống thật (không "aaa", không "test123").</li>
<li>Bảng issue: issue nào cũng có người nhận, milestone, đúng một label trạng thái (<code>1_To Do</code>, <code>2_Doing</code>, <code>3_Done</code>).</li>
<li>Trạng thái trong sheet Product khớp với bảng issue (bài 4.1 mục 5).</li>
<li>Mỗi thành viên biết mình sẽ cho xem 1–2 thứ gì và mở được trong dưới một phút.</li>
<li>Câu hỏi còn mở đã viết thành issue Q&amp;A, không nằm trong đầu ai đó.</li>
<li>Nhận xét của buổi trước đã thành issue — và nói được cái nào đã đóng.</li>
<li>Weekly Report tuần trước đã điền.</li>
<li>Ai dùng AI trong tuần thì đã có dòng AI Usage.</li>
<li>Tài liệu trong repo là bản mới nhất; Record of Changes có các dòng của tuần này.</li>
<li>Không ai định "sửa nốt một chỗ nhỏ" ngay trong buổi gặp.</li>
<li>Một người ghi lại mọi điều giảng viên nói.</li>
</ol>
<h3>4 · Hỏi PO cho đúng — mẫu issue Q&amp;A</h3>
${pre(QA_ISSUE, 'markdown')}
<p>Bối cảnh, một câu hỏi chính xác, các phương án và đề xuất của nhóm: giảng viên trả lời được trong một dòng, và câu trả lời thành một business rule đã xác nhận để bạn dẫn ra khi bảo vệ ("đã xác nhận ở issue #27").</p>
<h3>5 · Sau buổi review: nhận xét → issue trong 24 giờ</h3>
<ul>
<li>Lỗi giảng viên tìm ra sau khi nộp → issue <code>Leakage</code> (đừng bao giờ đổi nhãn thành <code>Defect</code>; bài 5.1).</li>
<li>Thay đổi yêu cầu → sửa use case/BR, thêm một dòng Record of Changes, link tới issue Q&amp;A.</li>
<li>Góp ý về quy trình → một dòng trong Weekly Report và buổi retro tới.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Dấu hiệu xấu giảng viên thấy trong 30 giây.</strong> Mọi commit từ một tài khoản. Bảng issue hai tuần không có gì ở <code>2_Doing</code>, rồi bốn mươi issue đóng trong đêm cuối. Sheet Product màn hình nào cũng "Complex". Tài liệu đề ngày nộp bài. Demo mở đầu bằng câu "khoan, hôm qua nó còn chạy".</div>`),
    lk(`${KHOA}swp391-0-3-tracking-monitoring`, '📊', 'How the teacher tracks you on GitLab — lesson 0.3', 'Milestones, the label system, issue workflow and tagging, slide by slide.', 'Giảng viên theo dõi bạn trên GitLab thế nào — bài 0.3', 'Milestone, hệ thống label, luồng issue và gắn tag, từng slide một.'),
  ].join('\n'),
};

/* ═══════════════════════ P.4 — Bộ mẫu khởi đầu ═══════════════════════ */
const TREE = `
<team-repo>/
├── README.md
├── docs/
│   ├── team-charter.md
│   ├── meetings/2026-xx-xx.md
│   ├── RDS.docx  (or SRS.docx + SDS.docx from Template1/Template2)
│   ├── Project_Tracking.xlsx
│   ├── SystemTest.xlsx        (Template3)
│   ├── AI_Usage_Report.xlsx   (Template5)
│   ├── Weekly_Report.xlsx     (Template6)
│   └── diagrams/              (.drawio sources + exported .png)
├── database/
│   ├── iter1/  schema.sql  data.sql
│   ├── iter2/  …
│   └── iter3/  …
├── src/ …   test/ …
└── .gitlab/
    ├── issue_templates/   Req.md  Defect.md  Leakage.md  QA.md
    └── merge_request_templates/   Default.md`;

const REQ_TPL = `
<!-- .gitlab/issue_templates/Req.md -->
## Screen / function
UC-__  ·  <screen name>  ·  actor(s): ___  ·  complexity (Product sheet): Simple | Medium | Complex

## Acceptance criteria (confirmed with the PO — link the Q&A issue)
- [ ] ...
- [ ] ...

## Business rules
BR-__, BR-__

## Done when (P.1 Definition of Done)
- [ ] spec + screen spec in docs   - [ ] design + tables   - [ ] code via MR   - [ ] Template3 ≥ 8 cases, latest round pass
- [ ] Product sheet row updated    - [ ] demo in my video

/label ~Req
/milestone %"Iter1"`;

const DEFECT_TPL = `
<!-- .gitlab/issue_templates/Defect.md  (found by us)  — copy as Leakage.md for issues found by the teacher -->
**Screen / test case:** UC-__ / BK-02
**Steps:** 1. … 2. … 3. …
**Expected:** …        **Actual:** …        **Severity:** Critical | High | Medium | Low
**Evidence:** screenshot / log
**Fixed in:** MR !__   **Retested:** round __, date __

/label ~Defect`;

const MR_TPL = `
<!-- .gitlab/merge_request_templates/Default.md -->
Closes #__  ·  UC-__ <screen name>

### What changed
-

### How to test
1. log in as ___  2. open ___ from the menu  3. ___

### Reviewer checklist
- [ ] runs on my machine from this branch
- [ ] server-side validation for every rule in the issue
- [ ] no SQL built from user input (parameters / ORM)
- [ ] role check on the controller/filter, not only a hidden menu item
- [ ] no secrets, no build/ or IDE private files
- [ ] names match the documents (screen, table, actor)`;

const UC_TPL = `
UC-07  Book a court slot                         Owner: member-a   Iteration: 2   Complexity: Complex
Actor            Customer (primary) · Staff (walk-in variant)
Trigger          Customer clicks "Book" on a free slot
Preconditions    Logged in as Customer; account not locked
Postconditions   Booking saved as Pending; slot shown as booked; e-mail sent
Main flow        1. System shows slot, price (BR-02) and cancel rule (BR-04)
                 2. Customer confirms
                 3. System re-checks overlap (BR-03) and saves in one transaction
                 4. System shows booking code
Alternative      2a. Customer picks "every week for N weeks" → UC-08 Recurring booking
Exceptions       3a. Slot taken meanwhile → "This slot is no longer available", back to the grid
                 3b. Customer has 3 unpaid bookings (BR-05) → refused with message
Business rules   BR-02, BR-03, BR-04, BR-05
Screens          SCR-11 Slot grid, SCR-12 Booking confirmation`;

const SCREEN_TPL = `
SCR-12  Booking confirmation        Role: Customer        Opens from: SCR-11 "Book"
| Field          | Type     | Required | Validation / source              | Message on error                 |
|----------------|----------|----------|----------------------------------|----------------------------------|
| Court          | label    | —        | from slot                        | —                                |
| Date, time     | label    | —        | from slot                        | —                                |
| Price          | label    | —        | BR-02 peak/off-peak table        | —                                |
| Note           | textarea | no       | ≤ 200 chars                      | "Note must be at most 200 chars" |
| Accept rule    | checkbox | yes      | must be ticked                   | "Please accept the cancel rule"  |
Actions: [Confirm] → UC-07 step 3 · [Back] → SCR-11`;

const BR_TPL = `
| ID    | Type (lesson 2.3)   | Rule                                                       | Source / confirmed  | Used in        |
|-------|---------------------|------------------------------------------------------------|---------------------|----------------|
| BR-02 | Computation         | Price = base × 1.5 between 17:00 and 21:00                 | Q&A #14             | UC-07, UC-15   |
| BR-03 | Constraint          | Two bookings of one court may not overlap in time          | Q&A #14             | UC-07, UC-08   |
| BR-04 | Constraint          | Cancel allowed until 2 h before start; deposit kept after   | Q&A #27             | UC-09          |
| BR-05 | Action enabler      | ≥ 3 unpaid bookings ⇒ new booking refused                   | team proposal, Q&A #29 | UC-07       |`;

const README_TPL = `
# <Project name> — SWP391 · <team code>
One sentence: who uses it and for what.

## Run it (≤ 15 minutes on a fresh machine)
1. Requirements: JDK __ / Node __, MySQL 8, Tomcat __ (or Docker)
2. Create the database: run database/iter3/schema.sql then data.sql
3. Copy .env.example (or db.properties.example) and set your DB password
4. Start: <command or IDE steps>  →  open http://localhost:8080/<app>

## Demo accounts (demo data only)
| Role | User | Password |

## Documents
docs/RDS.docx · docs/Project_Tracking.xlsx · docs/SystemTest.xlsx · approved topic: <link to Q&A issue>

## Known limitations
- …`;

const RELEASE_TPL = `
Iteration 2 — tag iter2 — 2026-xx-xx
New screens:   UC-07 Book slot (a) · UC-09 Cancel (b) · UC-12 Check-in (c) · …
Fixed:         Leakage #40 price shown without peak rate · Defect #41 double booking
Database:      database/iter2/ (adds bookings, payments; seed data for 3 courts)
Known issues:  #45 paging resets after sort (Low) — planned Iteration 3`;

const P4 = {
  title: 'P.4 — Starter templates for every deliverable (issue, MR, use case, screen, rules, README)|||P.4 — Bộ mẫu khởi đầu cho mọi deliverable (issue, MR, use case, màn hình, luật, README)',
  slug: 'swp391-p-4-bo-mau-tai-lieu',
  type: 'VIDEO',
  description: 'Bộ khung chép thẳng vào repo nhóm: cây thư mục chuẩn, template issue Req/Defect/Leakage và MR có checklist review, khung đặc tả use case, bảng đặc tả màn hình, bảng business rule, dòng System Test, README chạy được trong 15 phút, release note mỗi tag — khớp với Template1–7 của giảng viên.',
  content: [
    bi(`<span class="eyebrow">Team project playbook · P.4</span>
<h2>Starter templates — copy them into your repository</h2>
<p class="lead">The teacher's Template1–7 define <em>what</em> is submitted (chapters 2–7 explain them page by page). These starters are the working files that make filling those templates fast and consistent. They are aligned with the official templates; where they differ, <strong>the teacher's template wins</strong>.</p>
<h3>1 · Repository layout</h3>
${pre(TREE)}
<p>On GitHub the folders are <code>.github/ISSUE_TEMPLATE/</code> and <code>.github/pull_request_template.md</code>; the content is the same.</p>
<h3>2 · Issue template — Req (one per screen/function)</h3>
${pre(REQ_TPL, 'markdown')}
<h3>3 · Issue template — Defect / Leakage</h3>
${pre(DEFECT_TPL, 'markdown')}
<h3>4 · Merge-request template with the reviewer checklist</h3>
${pre(MR_TPL, 'markdown')}
<h3>5 · Use-case specification skeleton (goes into SRS/RDS)</h3>
${pre(UC_TPL)}
<h3>6 · Screen specification table</h3>
${pre(SCREEN_TPL, 'markdown')}
<h3>7 · Business-rule list</h3>
${pre(BR_TPL, 'markdown')}
<p>Every rule has an ID, a type, a source (ideally a Q&amp;A issue) and the use cases that apply it. The defence question "where does this rule come from?" is then answered by pointing at one row.</p>
<h3>8 · System Test row</h3>
<p>Use the columns of Template3 (lesson 5.2): ID, description, procedure, expected result, result per round, date, note. The skeleton in Milestone 3 shows four filled rows for one screen.</p>
<h3>9 · README that runs in 15 minutes</h3>
${pre(README_TPL, 'markdown')}
<h3>10 · Release note for each tag</h3>
${pre(RELEASE_TPL)}
<p>Paste it into the tag message or the GitLab release. It is also the first slide of your next iteration review: what is new, what was fixed, what is known.</p>
<div class="callout"><strong>★ Weekly Report and AI Usage Report</strong> keep their official spreadsheets (Template6, Template5 — lessons 4.7 and 8.2). Do not invent your own format: the teacher compares them with the templates.</div>`,
    `<span class="eyebrow">Dự án nhóm thật · P.4</span>
<h2>Bộ mẫu khởi đầu — chép vào repository của nhóm</h2>
<p class="lead">Template1–7 của giảng viên quy định <em>nộp cái gì</em> (chương 2–7 giảng từng trang). Bộ khung dưới đây là file làm việc giúp điền các template đó nhanh và thống nhất. Chúng bám template chính thức; chỗ nào khác nhau thì <strong>template của giảng viên thắng</strong>.</p>
<h3>1 · Cấu trúc repository</h3>
${pre(TREE)}
<p>Trên GitHub thư mục là <code>.github/ISSUE_TEMPLATE/</code> và <code>.github/pull_request_template.md</code>; nội dung giống hệt.</p>
<h3>2 · Template issue — Req (mỗi màn hình/chức năng một issue)</h3>
${pre(REQ_TPL, 'markdown')}
<h3>3 · Template issue — Defect / Leakage</h3>
${pre(DEFECT_TPL, 'markdown')}
<h3>4 · Template merge request có checklist cho người review</h3>
${pre(MR_TPL, 'markdown')}
<h3>5 · Khung đặc tả use case (đưa vào SRS/RDS)</h3>
${pre(UC_TPL)}
<h3>6 · Bảng đặc tả màn hình</h3>
${pre(SCREEN_TPL, 'markdown')}
<h3>7 · Danh sách business rule</h3>
${pre(BR_TPL, 'markdown')}
<p>Luật nào cũng có mã, loại, nguồn (tốt nhất là một issue Q&amp;A) và các use case áp dụng nó. Câu hỏi bảo vệ "luật này từ đâu ra?" khi đó trả lời bằng cách chỉ vào đúng một dòng.</p>
<h3>8 · Dòng System Test</h3>
<p>Dùng các cột của Template3 (bài 5.2): ID, mô tả, các bước, kết quả mong đợi, kết quả từng vòng, ngày, ghi chú. Khung mẫu ở Mốc 3 có bốn dòng đã điền cho một màn hình.</p>
<h3>9 · README chạy được trong 15 phút</h3>
${pre(README_TPL, 'markdown')}
<h3>10 · Release note cho mỗi tag</h3>
${pre(RELEASE_TPL)}
<p>Dán vào lời nhắn của tag hoặc release trên GitLab. Nó cũng là slide đầu của buổi review iteration sau: có gì mới, sửa gì, còn biết lỗi gì.</p>
<div class="callout"><strong>★ Weekly Report và AI Usage Report</strong> giữ nguyên bảng tính chính thức (Template6, Template5 — bài 4.7 và 8.2). Đừng tự chế định dạng: giảng viên đối chiếu với template.</div>`),
    lk(`${KHOA}swp391-2-4-srs-template`, '📄', 'The SRS template (Template1), section by section — lesson 2.4', 'Where each of these starters goes in the official document, and a plan to fill it over three iterations.', 'Mẫu SRS (Template1) từng mục — bài 2.4', 'Mỗi khung ở đây vào mục nào của tài liệu chính thức, và kế hoạch điền nó qua ba iteration.'),
  ].join('\n'),
};

/* ═══════════════════════ P.5 — Lỗi mất điểm theo deliverable ═══════════════════════ */
const ROWS_LOI = [
  ['SRS / RDS', 'Use cases without alternative and exception flows', 'Requirement marks; the screen cannot reach Quality High', 'Open 3 random UC specs: is there at least one "a." line under Alternative and Exceptions?', 'Use case không có luồng thay thế và ngoại lệ', 'Điểm yêu cầu; màn hình không đạt Quality High', 'Mở ngẫu nhiên 3 đặc tả UC: có ít nhất một dòng "a." ở Alternative và Exceptions không?'],
  ['SRS / RDS', 'Business rules invented by the team, never confirmed', 'Arguments in the defence; screens rejected at review', 'Every BR row has a source column with a Q&A issue or "team proposal + date confirmed"', 'Business rule do nhóm tự nghĩ, chưa từng xác nhận', 'Tranh cãi khi bảo vệ; màn hình bị trả ở buổi review', 'Mọi dòng BR có cột nguồn là issue Q&A hoặc "nhóm đề xuất + ngày được xác nhận"'],
  ['SRS / RDS', 'Use-case diagram shows features that do not exist', 'Examiners ask for the screen; credibility drops', 'Every UC in the diagram is Done in tracking or listed in Limitations', 'Use case diagram vẽ tính năng không có thật', 'Giám khảo đòi xem màn hình; mất uy tín', 'Mọi UC trong sơ đồ hoặc Done trong tracking, hoặc có trong Limitations'],
  ['Design / DB', 'ERD and the real database differ', 'Design marks (20%)', 'Generate the ERD from the database (MySQL Workbench reverse-engineer) and compare with the document', 'ERD và CSDL thật khác nhau', 'Điểm thiết kế (20%)', 'Dựng ERD từ CSDL (reverse-engineer bằng MySQL Workbench) rồi so với tài liệu'],
  ['Design / DB', 'Class/sequence diagrams drawn after coding, not matching the code', 'Questions you cannot answer', 'Pick one sequence diagram: every message name exists as a method in the code', 'Class/sequence diagram vẽ sau khi code, không khớp code', 'Câu hỏi không trả lời được', 'Chọn một sequence diagram: tên mọi message có thật là method trong code'],
  ['Design / DB', 'No foreign keys or unique constraints ("the code checks it")', 'Design marks; double bookings in the demo', 'SHOW CREATE TABLE for each core table: FKs and UNIQUE where the rules need them', 'Không có khoá ngoại hay ràng buộc unique ("code tự kiểm")', 'Điểm thiết kế; demo bị đặt trùng', 'SHOW CREATE TABLE từng bảng lõi: có FK và UNIQUE ở chỗ luật cần'],
  ['Code', 'SQL concatenated with user input', 'Quality drops; the classic defence question', 'Search the code for "+ request.getParameter" / template strings inside SQL', 'SQL nối chuỗi dữ liệu nhập', 'Quality tụt; câu hỏi bảo vệ kinh điển', 'Tìm trong code "+ request.getParameter" / chuỗi template bên trong SQL'],
  ['Code', 'Validation only in the browser', 'Quality Medium/Low', 'Disable JavaScript (or send the form with curl) and submit bad data', 'Chỉ kiểm lỗi ở trình duyệt', 'Quality Medium/Low', 'Tắt JavaScript (hoặc gửi form bằng curl) rồi nộp dữ liệu sai'],
  ['Code', 'Role check only by hiding menu items', 'Security question fails; Leakage', 'Log in as the weakest role and type the URL of an admin screen', 'Chỉ chặn vai trò bằng cách ẩn mục menu', 'Trượt câu hỏi bảo mật; Leakage', 'Đăng nhập vai yếu nhất rồi gõ URL một màn hình admin'],
  ['Code', 'Lists without search, sort or paging', 'Complexity and Quality both lower', 'Every list screen: search box, sortable column, page links', 'Danh sách không tìm, không sắp xếp, không phân trang', 'Cả Complexity lẫn Quality đều thấp', 'Mọi màn hình danh sách: ô tìm, cột sắp xếp được, link trang'],
  ['Code', 'Screens reachable only by typing the URL', 'Not counted as integrated', 'Click from the home page to each of your screens without typing', 'Màn hình chỉ vào được bằng gõ URL', 'Không được tính là đã tích hợp', 'Bấm từ trang chủ tới từng màn hình của mình mà không gõ gì'],
  ['Code', 'A screen the owner cannot explain (copied, AI, or a teammate wrote it)', 'Product marks for that screen; integrity condition', 'Each owner explains one random method of their screen to a teammate in 2 minutes', 'Màn hình chủ của nó không giải thích được (chép, AI, hoặc bạn khác viết)', 'Mất điểm sản phẩm của màn hình; điều kiện liêm chính', 'Mỗi người giải thích cho đồng đội một method bất kỳ trong màn hình của mình trong 2 phút'],
  ['Test', 'Template3 with only happy-path cases', 'Quality evidence missing; more Leakages', 'Each sheet: ≥ 2 abnormal, ≥ 1 boundary, every BR of the screen at least once', 'Template3 chỉ có case luồng đúng', 'Thiếu bằng chứng chất lượng; nhiều Leakage hơn', 'Mỗi sheet: ≥ 2 case bất thường, ≥ 1 case biên, mọi BR của màn hình xuất hiện ít nhất một lần'],
  ['Test', 'Iteration 3 without regression of earlier screens', 'Old screens re-graded lower', 'Round results recorded for 100% of completed screens on the iter3 tag', 'Iteration 3 không test hồi quy màn hình cũ', 'Màn hình cũ bị chấm lại thấp hơn', 'Có kết quả vòng test cho 100% màn hình đã xong trên tag iter3'],
  ['Test', 'Relabelling Leakage as Defect', 'Trust — the history shows it', 'Never edit a label someone else set; fix and close instead', 'Đổi nhãn Leakage thành Defect', 'Mất lòng tin — lịch sử issue ghi lại hết', 'Không bao giờ sửa label người khác đặt; sửa lỗi rồi đóng'],
  ['Tracking / Git', 'Product sheet and board disagree', 'The first five minutes of grading go badly', 'Filter the board by milestone; count Done; compare with the sheet', 'Sheet Product và bảng issue lệch nhau', 'Năm phút đầu chấm bài đã xấu', 'Lọc bảng theo milestone; đếm Done; so với sheet'],
  ['Tracking / Git', 'Everything committed by one account, or all on the last night', 'Contribution cannot be proven', 'git shortlog -sn iter1..iter2 and the commit dates per member', 'Mọi thứ commit từ một tài khoản, hoặc dồn hết vào đêm cuối', 'Không chứng minh được đóng góp', 'git shortlog -sn iter1..iter2 và ngày commit của từng người'],
  ['Tracking / Git', 'Every screen marked Complex', 'The teacher re-rates them all — and stops trusting the sheet', 'Apply the Refs-sheet rules (lesson 4.3) to each row; be ready to defend each Complex', 'Màn hình nào cũng ghi Complex', 'Giảng viên chấm lại hết — và hết tin sheet', 'Áp luật sheet Refs (bài 4.3) cho từng dòng; sẵn sàng bảo vệ từng màn Complex'],
  ['Package', 'Tag missing or on the wrong commit', 'The iteration is graded on what the tag contains', 'git show iter2 --stat is the commit you meant to submit', 'Thiếu tag hoặc tag sai commit', 'Iteration được chấm theo nội dung của tag', 'git show iter2 --stat đúng là commit định nộp'],
  ['Package', 'DB script that only runs on the author’s machine', 'Teacher cannot run the system', 'Restore database/iterN/ on an empty schema on another laptop', 'DB script chỉ chạy trên máy người viết', 'Giảng viên không chạy được hệ thống', 'Khôi phục database/iterN/ lên schema trống trên laptop khác'],
  ['Package', 'Drive links that ask for access', 'Missing deliverable', 'Open every link in a private window', 'Link Drive đòi quyền truy cập', 'Coi như thiếu deliverable', 'Mở mọi link trong cửa sổ ẩn danh'],
  ['Presentation', 'Slides that promise more than the product', 'Product (40%) and credibility', 'Each slide claim → a screen you can open in 10 seconds', 'Slide hứa nhiều hơn sản phẩm', 'Điểm sản phẩm (40%) và uy tín', 'Mỗi khẳng định trên slide → một màn hình mở được trong 10 giây'],
  ['Presentation', 'One member presents everything', 'Team working (20%); others look like passengers', 'Run-sheet gives every member a part and a workflow', 'Một người trình bày hết', 'Làm việc nhóm (20%); những người còn lại như người đi nhờ', 'Bảng phân thời gian giao cho mỗi người một phần và một luồng'],
  ['Presentation', 'Demo on dirty data, or live-coding fixes during the demo', 'Crashes in front of the panel', 'Restore clean demo data the morning of; feature freeze 4–5 days before', 'Demo trên dữ liệu bẩn, hoặc vừa demo vừa sửa code', 'Lỗi văng ngay trước hội đồng', 'Khôi phục dữ liệu demo sạch sáng hôm đó; dừng tính năng trước 4–5 ngày'],
];

function bangLoi(i) {
  const head = i === 0 ? ['Deliverable', 'Mistake', 'What it costs', 'One-minute self-check'] : ['Deliverable', 'Lỗi', 'Mất gì', 'Tự soát 1 phút'];
  const rows = ROWS_LOI.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[i === 0 ? 1 : 4])}</td><td>${esc(r[i === 0 ? 2 : 5])}</td><td>${esc(r[i === 0 ? 3 : 6])}</td></tr>`).join('');
  return `<div style="overflow-x:auto"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

const P5 = {
  title: 'P.5 — Where teams lose marks: a deliverable-by-deliverable pre-mortem with one-minute self-checks|||P.5 — Nhóm mất điểm ở đâu: soát trước theo từng deliverable, mỗi lỗi một phép tự soát 1 phút',
  slug: 'swp391-p-5-loi-mat-diem',
  type: 'VIDEO',
  description: '24 lỗi hay mất điểm xếp theo deliverable (SRS/RDS, thiết kế/CSDL, code, test, tracking/Git, gói nộp, thuyết trình) — mỗi lỗi ghi mất gì và một phép tự soát trong 1 phút; cộng phép soát khớp 6 chiều (tên màn hình, bảng, actor, UC) trước mỗi lần nộp.',
  content: [
    bi(`<span class="eyebrow">Team project playbook · P.5</span>
<h2>Where teams lose marks — and how to catch it in one minute</h2>
<p class="lead">A <em>pre-mortem</em> imagines the project already failed and asks why. Lesson 0.8 lists the green and red flags iteration by iteration; this table is organised by <strong>deliverable</strong>, and every line comes with a check you can run in about a minute. Run the whole table as a team before each submission — QA keeper reads, owners answer.</p>
${bangLoi(0)}
<h3>The consistency check — six places, one set of names</h3>
<p>Examiners compare documents with each other and with the product. The fastest way to look careless is a screen called "Manage Booking" in the SRS, "Booking List" in tracking, <code>OrderServlet</code> in code and "Đơn hàng" on the slide. Before every submission, pick five screens and check that the same name, actor and tables appear in:</p>
<ol>
<li>the use-case diagram and UC list,</li>
<li>the screen flow and screen specs,</li>
<li>the Product sheet,</li>
<li>the ERD / table descriptions,</li>
<li>the code (controller/page names, table names),</li>
<li>the slides (in Iteration 3).</li>
</ol>
<div class="callout ok"><strong>Score yourself before the teacher does.</strong> Each member fills their own Product rows with the honest level and quality, computes Converted-LOC × 10 / MaxLOC (lesson 0.2) and says the number in the stand-up. Below 5 with two slots left still leaves time to finish a screen or raise one from Medium to High quality — at the code demo it does not.</div>`,
    `<span class="eyebrow">Dự án nhóm thật · P.5</span>
<h2>Nhóm mất điểm ở đâu — và bắt nó trong một phút</h2>
<p class="lead"><em>Pre-mortem</em> là tưởng tượng dự án đã hỏng rồi hỏi vì sao. Bài 0.8 liệt kê cờ xanh, cờ đỏ theo từng iteration; bảng dưới đây xếp theo <strong>deliverable</strong>, và dòng nào cũng kèm một phép soát làm trong khoảng một phút. Cả nhóm chạy hết bảng trước mỗi lần nộp — QA keeper đọc, chủ màn hình trả lời.</p>
${bangLoi(1)}
<h3>Phép soát khớp — sáu chỗ, một bộ tên</h3>
<p>Giám khảo đối chiếu tài liệu với nhau và với sản phẩm. Cách nhanh nhất để trông cẩu thả là một màn hình tên "Manage Booking" trong SRS, "Booking List" trong tracking, <code>OrderServlet</code> trong code và "Đơn hàng" trên slide. Trước mỗi lần nộp, chọn năm màn hình và kiểm cùng tên, actor và bảng xuất hiện ở:</p>
<ol>
<li>use case diagram và danh sách UC,</li>
<li>screen flow và đặc tả màn hình,</li>
<li>sheet Product,</li>
<li>ERD / mô tả bảng,</li>
<li>code (tên controller/trang, tên bảng),</li>
<li>slide (ở Iteration 3).</li>
</ol>
<div class="callout ok"><strong>Tự chấm trước khi giảng viên chấm.</strong> Mỗi người tự điền dòng Product của mình với level và quality trung thực, tính Converted-LOC × 10 / MaxLOC (bài 0.2) và nói con số trong stand-up. Dưới 5 khi còn hai slot thì vẫn kịp làm xong một màn hình hoặc nâng một màn từ Medium lên High — tới buổi demo code thì hết kịp.</div>`),
    lk(`${KHOA}swp391-0-6-chong-truot-diem-cao`, '🚩', 'Why teams lose marks, iteration by iteration — lesson 0.8', 'The teacher’s Policies sheet, green and red flags per iteration, and five habits of high-scoring teams.', 'Vì sao nhóm mất điểm, theo từng iteration — bài 0.8', 'Sheet Policies của giảng viên, cờ xanh – cờ đỏ theo iteration, và năm thói quen của nhóm điểm cao.'),
  ].join('\n'),
};

/* ═══════════════════════ P.6 — Câu hội đồng + khung trả lời ═══════════════════════ */
const QA_MAU = [
  ['Requirement', 'Where does this rule come from?',
    '"We thought it was logical."',
    'Point: BR-04, cancel until 2 h before. Show: the BR table row and Q&A issue #27 with the teacher’s answer. Why: the court needs time to resell the slot. Limit: we did not model partial refunds.',
    'Luật này từ đâu ra?', '"Nhóm em thấy nó hợp lý."',
    'Ý chính: BR-04, huỷ trước 2 giờ. Cho xem: dòng trong bảng BR và issue Q&A #27 có trả lời của thầy/cô. Vì sao: sân cần thời gian bán lại khung giờ. Giới hạn: nhóm chưa làm hoàn tiền một phần.'],
  ['Requirement', 'Which use cases are not done?',
    '"We did almost everything."',
    'Point: 2 of 31 — recurring booking and SMS reminders. Show: Limitations section and the Q&A issue where the cut was agreed. Why: recurring booking needs a scheduler we could not test in time. Limit: e-mail reminders cover part of it.',
    'Use case nào chưa làm?', '"Nhóm em làm gần hết rồi ạ."',
    'Ý chính: 2/31 — đặt cố định và nhắc qua SMS. Cho xem: mục Limitations và issue Q&A nơi đã thống nhất cắt. Vì sao: đặt cố định cần bộ lập lịch mà nhóm không kịp test. Giới hạn: e-mail nhắc lịch thay được một phần.'],
  ['Design', 'Why is booking a separate table and not columns in court?',
    '"Because that is how we drew it."',
    'Point: one court has many bookings over time — 1:N. Show: the FK booking.court_id and the UNIQUE(court_id, date, start_time). Why: putting bookings in court would repeat court data and make the overlap rule impossible to enforce. Limit: overlapping ranges still need a query check, the unique key only covers identical starts.',
    'Vì sao lượt đặt là một bảng riêng chứ không phải các cột trong bảng sân?', '"Vì nhóm em vẽ vậy ạ."',
    'Ý chính: một sân có nhiều lượt đặt theo thời gian — 1:N. Cho xem: FK booking.court_id và UNIQUE(court_id, date, start_time). Vì sao: để lượt đặt trong bảng sân sẽ lặp dữ liệu sân và không chặn được luật trùng giờ. Giới hạn: khoảng giờ chồng nhau vẫn cần câu truy vấn kiểm tra, khoá unique chỉ chặn trùng giờ bắt đầu.'],
  ['Design', 'Where is authorisation checked?',
    '"The menu hides admin pages."',
    'Point: one filter on /admin/* and /owner/* reads the role from the session. Show: the filter class and its URL mapping. Why: hidden menus do not stop a typed URL. Limit: row-level checks (an owner editing another owner’s court) are in the service.',
    'Phân quyền được kiểm ở đâu?', '"Menu ẩn các trang admin ạ."',
    'Ý chính: một filter cho /admin/* và /owner/* đọc vai trò trong session. Cho xem: lớp filter và URL mapping. Vì sao: ẩn menu không chặn được URL gõ tay. Giới hạn: kiểm theo dòng dữ liệu (chủ sân sửa sân của người khác) nằm ở service.'],
  ['Product / code', 'Two customers press "Book" on the same slot at the same moment. What happens?',
    '"That cannot happen."',
    'Point: only one succeeds. Show: the service re-checks overlap inside a transaction, and the UNIQUE key rejects the second insert; the controller turns that into "slot no longer available". Why: the check before the click is not enough. Limit: we tested it with two browsers, not with load tests.',
    'Hai khách cùng bấm "Đặt" một khung giờ đúng cùng lúc. Chuyện gì xảy ra?', '"Không thể xảy ra đâu ạ."',
    'Ý chính: chỉ một người thành công. Cho xem: service kiểm lại trùng giờ trong transaction, và khoá UNIQUE từ chối lần insert thứ hai; controller đổi lỗi đó thành "khung giờ không còn trống". Vì sao: kiểm trước khi bấm là chưa đủ. Giới hạn: nhóm test bằng hai trình duyệt, chưa test tải.'],
  ['Product / code', 'Change it now: the note field may be at most 100 characters.',
    'Edits only the HTML maxlength.',
    'Changes the server-side validation and its message, the HTML attribute, the screen spec row, and adds a boundary test case (100 ok, 101 refused) — then says which three files changed.',
    'Sửa ngay: trường ghi chú tối đa 100 ký tự.', 'Chỉ sửa maxlength trong HTML.',
    'Sửa kiểm lỗi phía server và thông báo, thuộc tính HTML, dòng đặc tả màn hình, và thêm một test case biên (100 được, 101 bị từ chối) — rồi nói rõ ba tệp nào đã đổi.'],
  ['Team', 'How do we know you wrote this screen?',
    '"I did, I promise."',
    'Point: it is UC-07 in my Product rows. Show: issue #31 assigned to me, MR !44 from my account with the reviewer’s comments, my commits on the branch. Why it matters: we split by vertical slice so every screen has one owner. Limit: the shared header was written by our UI keeper.',
    'Làm sao biết em viết màn hình này?', '"Em làm thật mà."',
    'Ý chính: đó là UC-07 trong các dòng Product của em. Cho xem: issue #31 giao cho em, MR !44 từ tài khoản của em có bình luận của người review, các commit của em trên nhánh. Vì sao quan trọng: nhóm chia theo lát cắt dọc nên màn hình nào cũng có một chủ. Giới hạn: header chung do UI keeper viết.'],
  ['Team', 'What did AI do in your project?',
    '"Nothing." (while Template5 has 30 rows)',
    'Point: drafts of use-case specs, test cases and part of the schema. Show: two Template5 rows — one accepted after review, one rejected because it broke BR-03. Why: we verify AI output against our own rules before it enters the package. Limit: we did not use AI for the final code of the booking rule.',
    'AI đã làm gì trong dự án?', '"Không có gì ạ." (trong khi Template5 có 30 dòng)',
    'Ý chính: nháp đặc tả use case, test case và một phần schema. Cho xem: hai dòng Template5 — một dòng nhận sau khi soát, một dòng bỏ vì phá BR-03. Vì sao: nhóm soát đầu ra AI theo luật của chính mình trước khi đưa vào gói nộp. Giới hạn: nhóm không dùng AI cho code cuối của luật đặt sân.'],
];

function bangQA(i) {
  return QA_MAU.map((q) => `<div class="callout"><p class="nhan">${esc(q[0])} · ${esc(i === 0 ? q[1] : q[4])}</p>
<p>❌ <b>${i === 0 ? 'Weak' : 'Yếu'}:</b> ${esc(i === 0 ? q[2] : q[5])}</p>
<p>✅ <b>${i === 0 ? 'Strong' : 'Mạnh'}:</b> ${esc(i === 0 ? q[3] : q[6])}</p></div>`).join('\n');
}

const P6 = {
  title: 'P.6 — Panel questions with answer frames: how to answer, not just what|||P.6 — Câu hội đồng hay hỏi kèm khung trả lời: trả lời thế nào, không chỉ trả lời gì',
  slug: 'swp391-p-6-cau-hoi-hoi-dong',
  type: 'VIDEO',
  description: 'Khung trả lời 4 bước Ý chính → Cho xem → Vì sao → Giới hạn, tám câu hội đồng hay hỏi có ví dụ trả lời yếu và mạnh (yêu cầu, thiết kế, code, nhóm, AI), cách xử lý khi không biết câu trả lời, và cách luyện theo cặp trước buổi Final Presentation.',
  content: [
    bi(`<span class="eyebrow">Team project playbook · P.6</span>
<h2>Panel questions — how to answer, not just what</h2>
<p class="lead">Lessons 0.8, 7.3 and the PE page list the questions examiners ask; the defence lesson has 26 of them. What separates a 6 from a 9 is rarely knowing the answer — it is <strong>showing the evidence</strong> in the first ten seconds. Use one frame for every answer.</p>
<h3>The frame: Point → Show → Why → Limit</h3>
<ol>
<li><strong>Point</strong> — one sentence that answers the question directly.</li>
<li><strong>Show</strong> — open the file, the table row, the issue or the sheet. Evidence beats explanation.</li>
<li><strong>Why</strong> — the reason or the trade-off, in one or two sentences.</li>
<li><strong>Limit</strong> — what it does not cover yet. Saying it first is honest and stops the follow-up trap.</li>
</ol>
<h3>Eight questions, weak and strong answers (sports court booking as the example)</h3>
${bangQA(0)}
<h3>When you do not know</h3>
<ul>
<li>Say so, then reason aloud: "I'm not sure; I would check the service method first — may I open it?" Examiners grade understanding, not bluffing.</li>
<li>Never answer for a teammate's screen unless asked to — the panel wants to hear each owner.</li>
<li>If the live change breaks something, revert (<code>git restore</code>) calmly and explain what you would do; panic costs more than the bug.</li>
</ul>
<h3>How to practise</h3>
<ul>
<li>In pairs, 20 minutes: one asks five random questions from the defence list, the other answers with the frame, pointing at real files. Swap.</li>
<li>Record one rehearsal; listen for "uhm, I think…" and answers that never open a file.</li>
<li>Finish in the AI defence room of the last lesson — it asks about <em>your</em> topic and gives rubric feedback.</li>
</ul>`,
    `<span class="eyebrow">Dự án nhóm thật · P.6</span>
<h2>Câu hội đồng — trả lời thế nào, không chỉ trả lời gì</h2>
<p class="lead">Bài 0.8, 7.3 và trang PE đã liệt kê các câu giám khảo hay hỏi; bài bảo vệ có 26 câu. Khác biệt giữa 6 điểm và 9 điểm hiếm khi nằm ở chỗ biết câu trả lời — mà ở chỗ <strong>đưa ra bằng chứng</strong> trong mười giây đầu. Dùng một khung cho mọi câu trả lời.</p>
<h3>Khung: Ý chính → Cho xem → Vì sao → Giới hạn</h3>
<ol>
<li><strong>Ý chính</strong> — một câu trả lời thẳng vào câu hỏi.</li>
<li><strong>Cho xem</strong> — mở tệp, dòng trong bảng, issue hoặc sheet. Bằng chứng thắng lời giải thích.</li>
<li><strong>Vì sao</strong> — lý do hoặc cái giá phải trả, một hai câu.</li>
<li><strong>Giới hạn</strong> — phần nó chưa phủ. Tự nói ra trước là trung thực, và chặn được cái bẫy của câu hỏi nối tiếp.</li>
</ol>
<h3>Tám câu hỏi, câu trả lời yếu và mạnh (ví dụ đề tài đặt sân thể thao)</h3>
${bangQA(1)}
<h3>Khi không biết</h3>
<ul>
<li>Nói thật, rồi suy luận thành tiếng: "Em chưa chắc; em sẽ xem method ở service trước — em mở ra được không ạ?" Giám khảo chấm sự hiểu, không chấm sự chém gió.</li>
<li>Đừng trả lời thay màn hình của đồng đội nếu không được hỏi — hội đồng muốn nghe từng chủ màn hình.</li>
<li>Nếu sửa tại chỗ làm hỏng gì đó, bình tĩnh hoàn tác (<code>git restore</code>) và nói mình sẽ làm gì; hoảng loạn mất điểm hơn cái lỗi.</li>
</ul>
<h3>Cách luyện</h3>
<ul>
<li>Theo cặp, 20 phút: một người hỏi ngẫu nhiên năm câu trong danh sách bảo vệ, người kia trả lời theo khung, chỉ vào tệp thật. Đổi vai.</li>
<li>Quay lại một lần tổng duyệt; nghe xem chỗ nào "ờm, em nghĩ là…" và câu nào không mở tệp nào.</li>
<li>Kết thúc bằng phòng bảo vệ AI ở bài cuối — nó hỏi về <em>đề tài của bạn</em> và trả nhận xét theo rubric.</li>
</ul>`),
    lk(`${KHOA}swp391-7-3-presentation-template-demo-qa`, '🎤', 'Template7, the 15-minute run-sheet and the rehearsal checklist — lesson 7.3', 'The presentation itself: slide by slide, demo script and the Q&A list grouped by grading criterion.', 'Template7, bảng phân thời gian 15 phút và checklist tập dượt — bài 7.3', 'Chính bài thuyết trình: từng slide, kịch bản demo và danh sách Q&A theo tiêu chí chấm.'),
  ].join('\n'),
};

/* ═══════════════════════ P.7 — Từ SWP391 tới OJT ═══════════════════════ */
const P7 = {
  title: 'P.7 — From SWP391 to OJT: turn the team project into real experience on your CV|||P.7 — Từ SWP391 tới OJT: biến đồ án nhóm thành kinh nghiệm thật trên CV',
  slug: 'swp391-p-7-tu-swp391-toi-ojt',
  type: 'VIDEO',
  description: 'Đồ án SWP391 là "kinh nghiệm dự án" đầu tiên của sinh viên khi xin OJT: phỏng vấn hỏi gì về đồ án, dòng CV yếu và mạnh, câu chuyện STAR, README tiếng Anh, giữ repo sau khi qua môn (gỡ bí mật, dữ liệu demo), và những gì nên học thêm từ chính dự án.',
  content: [
    bi(`<span class="eyebrow">Team project playbook · P.7</span>
<h2>From SWP391 to OJT — the project is your first work experience</h2>
<p class="lead">At an OJT interview most students have no job history. What they do have is SWP391: a team, three releases, a database, code review, tests and a defence. Interviewers know the course and ask about it — the answer either sounds like homework or like work.</p>
<h3>What interviewers ask about a student project</h3>
<ul>
<li>"What did <em>you</em> build — not the team?" → your screens, your rules, your tables.</li>
<li>"What was the hardest bug, and how did you find it?" → a Defect or Leakage issue with its fix.</li>
<li>"How did your team work?" → issues, branches, merge requests, reviews, tags, weekly reports.</li>
<li>"If you did it again, what would you change?" → one honest lesson from a retro.</li>
<li>Technical follow-ups on what you claim: SQL joins and transactions, MVC, REST, Git conflicts, validation and security.</li>
</ul>
<h3>CV lines — weak vs strong</h3>
<div style="overflow-x:auto"><table><thead><tr><th>Weak</th><th>Strong</th></tr></thead><tbody>
<tr><td>Participated in a court booking website project.</td><td>Built 10 of 47 screens of a court-booking web app (Java Servlet/JSP, MySQL) in a 5-person team over 3 iterations, including the booking flow with an overlap rule enforced in a DB transaction.</td></tr>
<tr><td>Used Git.</td><td>Worked through issues and reviewed merge requests on GitLab (protected main, one branch per issue); reviewed ~20 teammates' MRs.</td></tr>
<tr><td>Did testing.</td><td>Wrote and ran 90 system test cases in 3 rounds; 31 defects found before submission, 4 leaked to the customer review.</td></tr>
</tbody></table></div>
<p>Only numbers you can show. If the interviewer opens your repository, the numbers must be there.</p>
<h3>A STAR story from your project (60–90 seconds)</h3>
<ul>
<li><strong>Situation</strong> — "In Iteration 2 two customers could book the same court slot."</li>
<li><strong>Task</strong> — "I owned the booking screen and its rule BR-03."</li>
<li><strong>Action</strong> — "I reproduced it with two browsers, moved the check into a transaction and added a unique key, then wrote boundary test cases."</li>
<li><strong>Result</strong> — "No double bookings in the Iteration-3 regression; the teacher used it as a question in our defence and I could show the code."</li>
</ul>
<h3>Keeping the project after the course</h3>
<ul>
<li>Ask the team before making the repository public; each member may keep a fork.</li>
<li>Remove secrets from the history before publishing (Git course 8.3); keep <code>.env.example</code> only.</li>
<li>Replace any real personal data in demo data with invented data.</li>
<li>Write the README in English: what it is, your part, how to run it, screenshots, what you learned.</li>
<li>Pin it on your GitHub profile (Git course 15.1) and link it from your CV.</li>
</ul>
<h3>What to learn next, from this project</h3>
<ul>
<li>Rebuild your own screens with <strong>Spring Boot + a React front end</strong> — the stack most outsourcing companies interview for.</li>
<li>Add unit tests and a CI pipeline; put it in Docker (Chapter 9).</li>
<li>Practise explaining the project in English, out loud, in two minutes.</li>
</ul>`,
    `<span class="eyebrow">Dự án nhóm thật · P.7</span>
<h2>Từ SWP391 tới OJT — đồ án là kinh nghiệm làm việc đầu tiên của bạn</h2>
<p class="lead">Ở buổi phỏng vấn OJT, đa số sinh viên chưa từng đi làm. Thứ họ có là SWP391: một nhóm, ba bản phát hành, một CSDL, review code, test và một buổi bảo vệ. Người phỏng vấn biết môn này và sẽ hỏi về nó — câu trả lời hoặc nghe như bài tập về nhà, hoặc nghe như đi làm thật.</p>
<h3>Phỏng vấn hay hỏi gì về đồ án sinh viên</h3>
<ul>
<li>"<em>Em</em> làm gì — không phải cả nhóm?" → màn hình của bạn, luật của bạn, bảng của bạn.</li>
<li>"Lỗi khó nhất là gì, em tìm ra nó thế nào?" → một issue Defect hoặc Leakage cùng bản sửa.</li>
<li>"Nhóm em làm việc ra sao?" → issue, nhánh, merge request, review, tag, weekly report.</li>
<li>"Làm lại thì em đổi gì?" → một bài học trung thực từ buổi retro.</li>
<li>Câu hỏi kỹ thuật nối tiếp theo những gì bạn khẳng định: JOIN và transaction trong SQL, MVC, REST, xung đột Git, kiểm lỗi và bảo mật.</li>
</ul>
<h3>Dòng CV — yếu và mạnh</h3>
<div style="overflow-x:auto"><table><thead><tr><th>Yếu</th><th>Mạnh</th></tr></thead><tbody>
<tr><td>Tham gia dự án website đặt sân.</td><td>Built 10 of 47 screens of a court-booking web app (Java Servlet/JSP, MySQL) in a 5-person team over 3 iterations, including the booking flow with an overlap rule enforced in a DB transaction.</td></tr>
<tr><td>Biết dùng Git.</td><td>Worked through issues and reviewed merge requests on GitLab (protected main, one branch per issue); reviewed ~20 teammates' MRs.</td></tr>
<tr><td>Có làm test.</td><td>Wrote and ran 90 system test cases in 3 rounds; 31 defects found before submission, 4 leaked to the customer review.</td></tr>
</tbody></table></div>
<p class="ghi-chu">Cột "Mạnh" để tiếng Anh vì CV xin OJT ở công ty phần mềm thường viết tiếng Anh. Chỉ ghi con số bạn cho xem được — người phỏng vấn mở repo ra thì con số phải ở đó.</p>
<h3>Một câu chuyện STAR từ đồ án (60–90 giây)</h3>
<ul>
<li><strong>Situation (bối cảnh)</strong> — "Ở Iteration 2, hai khách đặt được cùng một khung giờ sân."</li>
<li><strong>Task (nhiệm vụ)</strong> — "Em phụ trách màn hình đặt sân và luật BR-03."</li>
<li><strong>Action (hành động)</strong> — "Em tái hiện lỗi bằng hai trình duyệt, chuyển phép kiểm vào transaction và thêm khoá unique, rồi viết test case biên."</li>
<li><strong>Result (kết quả)</strong> — "Vòng hồi quy Iteration 3 không còn đặt trùng; giảng viên dùng chính nó làm câu hỏi khi bảo vệ và em cho xem được code."</li>
</ul>
<h3>Giữ dự án sau khi qua môn</h3>
<ul>
<li>Hỏi cả nhóm trước khi để repository công khai; mỗi người có thể giữ một bản fork.</li>
<li>Gỡ bí mật khỏi lịch sử trước khi công khai (khoá Git bài 8.3); chỉ giữ <code>.env.example</code>.</li>
<li>Thay mọi dữ liệu cá nhân thật trong dữ liệu demo bằng dữ liệu bịa.</li>
<li>Viết README bằng tiếng Anh: nó là gì, phần của bạn, cách chạy, ảnh chụp, bạn học được gì.</li>
<li>Ghim nó lên hồ sơ GitHub (khoá Git bài 15.1) và link từ CV.</li>
</ul>
<h3>Học gì tiếp, từ chính dự án này</h3>
<ul>
<li>Làm lại các màn hình của mình bằng <strong>Spring Boot + front end React</strong> — stack mà đa số công ty gia công phần mềm phỏng vấn.</li>
<li>Thêm unit test và pipeline CI; đóng gói bằng Docker (Chương 9).</li>
<li>Luyện kể về dự án bằng tiếng Anh, nói thành tiếng, trong hai phút.</li>
</ul>`),
    lk(`${GIT}git-15-1-ho-so-github`, '🪪', 'Git course · 15.1 — your GitHub profile as a CV: profile README, pinned repos, project README', 'Then 8.3 to remove a leaked secret from the whole history before you publish.', 'Khoá Git · 15.1 — hồ sơ GitHub như một CV: profile README, repo ghim, README dự án', 'Rồi bài 8.3 để gỡ một bí mật bị lộ khỏi toàn bộ lịch sử trước khi công khai.'),
    lk('/courses/api-design/learn?lessonSlug=api-12-4-tong-ket', '🎯', 'API Design course · 12.8 — review, documentation and your interview story', 'An evidence sheet where every claim is a measured number, three STAR stories, CV lines weak vs strong.', 'Khoá API Design · 12.8 — rà soát, tài liệu và câu chuyện kể khi phỏng vấn', 'Bảng bằng chứng mà khẳng định nào cũng là số đo, ba câu chuyện STAR, dòng CV yếu và mạnh.'),
  ].join('\n'),
};

/* ═══════════════════════ Quiz P (tiếng Anh, kiểu FE) ═══════════════════════ */
const Q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, explanation });
const QUIZ_P = [
  Q('In a 5-member SWP391 team, who should code full-stack screens in every iteration?|||Trong nhóm SWP391 5 người, ai phải code màn hình full-stack ở mọi iteration?',
    ['Only the two strongest coders|||Chỉ hai người code giỏi nhất', 'Everyone except the leader|||Mọi người trừ trưởng nhóm', 'Every member, including the leader and the doc keeper|||Mọi thành viên, kể cả trưởng nhóm và người giữ tài liệu', 'Only members without a documentation role|||Chỉ người không phụ trách tài liệu'],
    2, 'Iterations are graded per member on Converted-LOC of their own screens, so hats such as leader or doc keeper are extra jobs, not exemptions.|||Iteration chấm từng người theo Converted-LOC của màn hình mình, nên vai trưởng nhóm hay giữ tài liệu là việc thêm, không phải miễn.'),
  Q('In a RACI table, how many people should be "A" (accountable) for one deliverable?|||Trong bảng RACI, một deliverable nên có bao nhiêu người là "A" (chịu trách nhiệm cuối)?',
    ['Exactly one|||Đúng một', 'At least two, for safety|||Ít nhất hai, cho chắc', 'The whole team|||Cả nhóm', 'None; the teacher is accountable|||Không ai; giảng viên chịu trách nhiệm'],
    0, 'One accountable person per deliverable removes "I thought you were doing it".|||Mỗi deliverable một người chịu trách nhiệm cuối thì hết câu "tớ tưởng cậu làm".'),
  Q('A bug is found by the teacher after your team submitted Iteration 1. Which label should the issue have?|||Giảng viên tìm ra một lỗi sau khi nhóm đã nộp Iteration 1. Issue đó mang label nào?',
    ['Defect|||Defect', 'Leakage|||Leakage', 'Task|||Task', 'Q&A|||Q&A'],
    1, 'Defect = found by the team; Leakage = found by the customer/teacher after submission. Never relabel a Leakage as a Defect.|||Defect = nhóm tự tìm; Leakage = khách hàng/giảng viên tìm sau khi nộp. Không bao giờ đổi Leakage thành Defect.'),
  Q('Which branch and review practice fits the team Git flow in this playbook?|||Cách dùng nhánh và review nào khớp Git flow của nhóm trong cẩm nang này?',
    ['Everyone pushes directly to main to avoid conflicts|||Mọi người push thẳng vào main cho khỏi xung đột', 'One branch per member for the whole semester, merged at the end|||Mỗi người một nhánh cả kỳ, cuối kỳ mới merge', 'One branch per issue, a merge request reviewed by another member, no self-merge|||Mỗi issue một nhánh, merge request do thành viên khác review, không tự merge', 'The leader commits everyone’s code from one laptop|||Trưởng nhóm commit code của mọi người từ một laptop'],
    2, 'One issue = one branch = one MR, reviewed by someone else; commit authorship is contribution evidence.|||Một issue = một nhánh = một MR, do người khác review; tác giả commit là bằng chứng đóng góp.'),
  Q('A teammate’s screen has not moved for three days. What is the best FIRST step?|||Màn hình của một đồng đội ba ngày không nhúc nhích. Bước ĐẦU TIÊN tốt nhất là gì?',
    ['Code the screen for them so the team looks complete|||Code hộ màn hình để nhóm trông đầy đủ', 'Report them to the teacher immediately|||Báo giảng viên ngay lập tức', 'Ask privately what is blocking them and offer to pair|||Hỏi riêng đang vướng gì và đề nghị ngồi làm cùng', 'Remove them from the repository|||Xoá họ khỏi repository'],
    2, 'The ladder is early · visible · factual: private message, stand-up, re-plan together, then the teacher with facts. Coding it for them exposes both of you in the code demo.|||Thang leo thang là sớm · thấy được · có dữ kiện: nhắn riêng, stand-up, cùng lập lại kế hoạch, rồi mới báo giảng viên kèm dữ kiện. Code hộ thì cả hai cùng lộ ở buổi demo code.'),
  Q('Which is the BEST way to ask the teacher (PO) about an unclear business rule?|||Cách TỐT NHẤT để hỏi giảng viên (PO) về một business rule chưa rõ là gì?',
    ['Assume the most logical rule and code it|||Tự chọn luật hợp lý nhất rồi code', 'A Q&A issue with context, a precise question, options and the team’s proposal|||Một issue Q&A có bối cảnh, câu hỏi chính xác, các phương án và đề xuất của nhóm', 'Ask a student from another class|||Hỏi một bạn lớp khác', 'Wait until the final presentation|||Đợi tới buổi thuyết trình cuối'],
    1, 'A written question with options can be answered in one line and becomes a confirmed rule you can cite in the defence.|||Câu hỏi viết sẵn có phương án thì trả lời được trong một dòng và thành luật đã xác nhận để dẫn ra khi bảo vệ.'),
  Q('What does Iteration 3 require that earlier iterations do not?|||Iteration 3 đòi hỏi điều gì mà các iteration trước không đòi?',
    ['Only new screens are graded|||Chỉ chấm màn hình mới', 'All completed screens are graded again, so regression testing of every screen is needed|||Mọi màn hình đã xong được chấm lại, nên phải test hồi quy mọi màn hình', 'No documents are submitted|||Không nộp tài liệu', 'The team presents to the class teacher only|||Nhóm chỉ trình bày với giảng viên lớp'],
    1, 'The Iteration-3 package re-grades every completed screen; a screen broken by later changes loses its marks.|||Gói Iteration 3 chấm lại mọi màn hình đã xong; màn hình bị hỏng do thay đổi sau sẽ mất điểm.'),
  Q('Your role check only hides admin links in the menu. What is the risk?|||Phân quyền của bạn chỉ ẩn link admin trên menu. Rủi ro là gì?',
    ['None, users cannot see the links|||Không có, người dùng không thấy link', 'A logged-in user can type the admin URL and open the screen|||Người dùng đã đăng nhập gõ URL admin là mở được màn hình', 'The page becomes slower|||Trang chạy chậm hơn', 'The database loses its foreign keys|||CSDL mất khoá ngoại'],
    1, 'Authorisation must be enforced on the server (filter/controller); hidden menus are only UI.|||Phân quyền phải chặn ở server (filter/controller); ẩn menu chỉ là giao diện.'),
  Q('Which answer frame does lesson P.6 recommend for panel questions?|||Bài P.6 khuyên dùng khung trả lời nào cho câu hỏi hội đồng?',
    ['Point → Show → Why → Limit|||Ý chính → Cho xem → Vì sao → Giới hạn', 'Apologise → Explain → Promise|||Xin lỗi → Giải thích → Hứa', 'Read the slide aloud|||Đọc to slide', 'Let the leader answer every question|||Để trưởng nhóm trả lời mọi câu'],
    0, 'Answer directly, show the evidence, give the reason, state the limit.|||Trả lời thẳng, cho xem bằng chứng, nêu lý do, nói giới hạn.'),
  Q('An examiner asks you to limit a field to 100 characters, live. Which change is complete?|||Giám khảo yêu cầu giới hạn một trường 100 ký tự, ngay tại chỗ. Thay đổi nào là đầy đủ?',
    ['Only the HTML maxlength attribute|||Chỉ thuộc tính maxlength trong HTML', 'Server-side validation and its message, the HTML attribute, and a boundary test (100 ok, 101 refused)|||Kiểm lỗi phía server và thông báo, thuộc tính HTML, và một test biên (100 được, 101 bị từ chối)', 'Only the database column length|||Chỉ độ dài cột trong CSDL', 'Nothing; explain it would take a day|||Không sửa gì; nói là mất một ngày'],
    1, 'Client-side limits can be bypassed; the rule must live on the server, and a boundary test proves it.|||Giới hạn phía client lách được; luật phải nằm ở server, và test biên chứng minh nó.'),
  Q('Which CV line is the strongest for an OJT application?|||Dòng CV nào mạnh nhất khi xin OJT?',
    ['Participated in a web project|||Tham gia một dự án web', 'Good at teamwork and Git|||Giỏi làm việc nhóm và Git', 'Built 10 of 47 screens in a 5-person team over 3 iterations, including a booking flow enforced in a DB transaction|||Xây 10/47 màn hình trong nhóm 5 người qua 3 iteration, gồm luồng đặt sân được chặn bằng transaction CSDL', 'Learned many technologies|||Học được nhiều công nghệ'],
    2, 'Specific scope, numbers you can show and one technical decision make a project line credible.|||Phạm vi cụ thể, con số cho xem được và một quyết định kỹ thuật làm dòng dự án đáng tin.'),
  Q('Before making the team repository public after the course, what must you do first?|||Trước khi công khai repository nhóm sau môn học, việc gì phải làm trước?',
    ['Nothing; it is your own code|||Không cần gì; đó là code của mình', 'Ask the team, remove secrets from the whole history and replace real personal data in demo data|||Hỏi cả nhóm, gỡ bí mật khỏi toàn bộ lịch sử và thay dữ liệu cá nhân thật trong dữ liệu demo', 'Delete the README|||Xoá README', 'Squash everything into one commit by your account|||Gộp mọi thứ thành một commit bằng tài khoản của mình'],
    1, 'The project belongs to the team, secrets stay in Git history unless removed, and demo data must not expose real people.|||Dự án là của cả nhóm, bí mật còn trong lịch sử Git nếu không gỡ, và dữ liệu demo không được lộ người thật.'),
];

const QUIZ_LESSON = {
  title: 'Quiz P — Running the team project|||Quiz P — Vận hành dự án nhóm',
  slug: 'swp391-quiz-p',
  type: 'QUIZ',
  description: 'Kiểm tra 12 câu tiếng Anh về vận hành dự án nhóm: vai và RACI, Git flow nhóm, Defect/Leakage, hỏi PO, thành viên không làm, Iteration 3, phân quyền, khung trả lời hội đồng, CV OJT.',
  quiz: { timeLimitSeconds: 900, questions: QUIZ_P },
};

export default {
  title: 'Team project playbook — SWP391 as a real software team (milestones & defence)|||Dự án nhóm thật — làm SWP391 như một team phần mềm (mốc dự án & bảo vệ)',
  description: 'Đường "làm" chạy song song với các chương: lịch cả kỳ, RACI, Definition of Done, hợp đồng nhóm, Git flow nhóm, chuẩn bị buổi review, bộ mẫu deliverable, lỗi hay mất điểm, câu hội đồng kèm khung trả lời, từ SWP391 tới OJT — cùng 5 mốc dự án theo đúng hạn nộp thật và bài bảo vệ.',
  lessons: [P1, P2, moc(1), P3, P4, moc(2), moc(3), P5, moc(4), P6, moc(5), P7, QUIZ_LESSON, baoVeBai],
};
