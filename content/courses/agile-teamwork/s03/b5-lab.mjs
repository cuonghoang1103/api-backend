/**
 * 3.5 — Lab: một ngày pull request của LabFlow (agl-3-5-lab). Soạn 24/11/2026, agent agt. Bài MỚI (thêm vào khung).
 * Mốc dự án chương 3: repo LabFlow có luật (CONTRIBUTING, phan-cong.csv, ci/, hook, mẫu PR, bảo vệ nhánh) + một buổi diễn tập
 * cả nhóm tái hiện đúng ba lỗi của bài 3.3–3.4. Lệnh dựng Postgres + classpath Flyway là đúng lệnh đã chạy trên máy soạn (giới hạn 2 GB).
 * Tên ô cài đặt GitHub: "Require branches to be up to date before merging" đã đối chiếu GitHub Docs 24/11; các ô khác theo cùng trang.
 */
import { bang, cl, note, giai, bash, out, ag, cs, vo } from '../_chung.mjs';

const CAY = `labflow/
├── CONTRIBUTING.md                  ← bài 3.1
├── .github/pull_request_template.md ← bài 3.2
├── .githooks/commit-msg, pre-push   ← bài 0.2
├── docs/phan-cong.csv               ← bài 3.1 (nguồn duy nhất: ticket → màn → chủ màn)
├── ci/
│   ├── ci.sh                        ← bài 3.3 (4 bước)
│   ├── kiem-commit.mjs              ← bài 3.1
│   ├── kiem-migration.mjs           ← bài 3.3
│   ├── Migrate.java                 ← bài 3.3
│   ├── kiem-pr.mjs                  ← bài 3.2
│   ├── dong-gop.mjs                 ← bài 3.1
│   └── tep-nong.mjs                 ← bài 3.4
├── fe/  (React)   fe/test/routes.test.mjs ← bài 3.3
└── be/  (Spring Boot)   be/db/migration/V1__…sql`;

const PG = `# Postgres cho bước 4 của CI cục bộ — có giới hạn RAM/CPU, dữ liệu trong RAM (tmpfs), chỉ nghe ở 127.0.0.1
docker run -d --name labflow-ci-pg --memory 2g --memory-swap 2g --cpus 2 \\
  -p 127.0.0.1:45433:5432 -e POSTGRES_HOST_AUTH_METHOD=trust \\
  --tmpfs /var/lib/postgresql/data postgres:16

# Classpath cho Migrate.java: các jar đã có trong ~/.m2 sau khi build dự án Spring Boot + Flyway một lần
R=~/.m2/repository
export FLYWAY_CP=$R/org/flywaydb/flyway-core/12.4.0/flyway-core-12.4.0.jar:$R/org/flywaydb/flyway-database-postgresql/12.4.0/flyway-database-postgresql-12.4.0.jar:$R/org/postgresql/postgresql/42.7.14/postgresql-42.7.14.jar:$R/tools/jackson/core/jackson-databind/3.1.8/jackson-databind-3.1.8.jar:$R/tools/jackson/core/jackson-core/3.1.8/jackson-core-3.1.8.jar:$R/com/fasterxml/jackson/core/jackson-annotations/2.21/jackson-annotations-2.21.jar
export PG=127.0.0.1:45433
ci/ci.sh

# Xong buổi: tắt và xoá container
docker rm -f labflow-ci-pg`;

export const L35 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 3 · Lesson 3.5 · Lab', 'Chương 3 · Bài 3.5 · Lab', `
<h2>${t('3.5 — Lab: a day of pull requests on LabFlow', '3.5 — Lab: một ngày pull request của LabFlow')}</h2>
<p class="lead">${t(
    'Project milestone of chapter 3. At the end your LabFlow repository has rules that enforce themselves, and your team has <em>already lived through</em> the three classic failures — a migration collision, a conflict "fixed" by deleting markers, an oversized PR — in a one-hour drill, instead of discovering them in week 8.',
    'Mốc dự án của chương 3. Cuối bài, repo LabFlow của bạn có bộ luật tự cưỡng chế, và cả nhóm <em>đã từng trải qua</em> ba lỗi kinh điển — trùng số migration, xung đột "sửa" bằng cách xoá dấu, PR quá to — trong một buổi diễn tập một giờ, thay vì phát hiện chúng ở tuần 8.')}</p>
${cl('info', `<p><strong>🛠 ${t('Project milestone', 'Mốc dự án')}</strong> · ${t('Time: 2 hours for the leader (setup) + 1 hour with the whole team (drill). Tools: Git, Node 22, Java 21+, Docker, a GitHub repository where you are admin.', 'Thời gian: 2 giờ cho trưởng nhóm (dựng) + 1 giờ cả nhóm (diễn tập). Công cụ: Git, Node 22, Java 21+, Docker, một repo GitHub mà bạn là admin.')}</p>`)}

<h3>${t('Step 1 — Put the rules in the repository (leader, 60 min)', 'Bước 1 — Đưa luật vào repo (trưởng nhóm, 60 phút)')}</h3>
<p>${t('Create this structure on a branch <code>chore/LF-01-luat-nhom</code>. Every file’s full content is in the lesson named next to it.', 'Tạo cấu trúc này trên nhánh <code>chore/LF-01-luat-nhom</code>. Nội dung đầy đủ của từng tệp nằm ở bài ghi bên cạnh.')}</p>
${out(CAY)}
<p>${t('Fill <code>docs/phan-cong.csv</code> from the CT Work backlog of lesson 2.5: one row per screen with ticket, screen code, owner, area and iteration. In the real Spring Boot project, step 4 of <code>ci.sh</code> can stay as it is for local runs; on GitHub Actions it becomes <code>mvn verify</code> with a Postgres service (', 'Điền <code>docs/phan-cong.csv</code> từ backlog CT Work của bài 2.5: mỗi màn một dòng gồm ticket, mã màn, chủ màn, miền và iteration. Ở dự án Spring Boot thật, bước 4 của <code>ci.sh</code> giữ nguyên để chạy ở máy; trên GitHub Actions nó thành <code>mvn verify</code> với Postgres dạng service (')}${cs('github-actions', 'ga-15-1-ci-cho-pr', 'GA 15.1')}).</p>
<p>${t('Run the local CI exactly as it was run for this chapter:', 'Chạy CI cục bộ đúng như đã chạy khi soạn chương này:')}</p>
${bash(PG)}

<h3>${t('Step 2 — Lock main on GitHub (leader, 15 min)', 'Bước 2 — Khoá main trên GitHub (trưởng nhóm, 15 phút)')}</h3>
<p>${t('Push the rules branch, merge it (the last direct change you will ever make), then in the repository settings create a branch protection rule (or ruleset) for <code>main</code>. The screens are walked through in ', 'Push nhánh luật, merge nó (thay đổi trực tiếp cuối cùng bạn từng làm), rồi trong cài đặt repo tạo luật bảo vệ nhánh (hoặc ruleset) cho <code>main</code>. Từng màn hình được hướng dẫn ở ')}${cs('git', 'git-6-4-bao-ve-nhanh', 'Git 6.4')}.</p>
${bang([t('Setting', 'Ô cài đặt'), t('Value', 'Giá trị'), t('Lesson', 'Bài')], [
    ['Require a pull request before merging', t('on, 1 approval', 'bật, 1 phê duyệt'), '3.2'],
    ['Require status checks to pass before merging', t('on, select the CI check', 'bật, chọn check CI'), '3.3'],
    ['Require branches to be up to date before merging', t('on ("strict")', 'bật ("strict")'), t('3.3 Lab 1', '3.3 Lab 1')],
    ['Do not allow bypassing the above settings', t('on — the leader too', 'bật — cả trưởng nhóm'), '3.3'],
    [t('Force pushes / deletions of main', 'Force push / xoá main'), t('blocked', 'chặn'), '3.1'],
    [t('Merge buttons (General → Pull Requests)', 'Nút merge (General → Pull Requests)'), t('only "Allow squash merging"; "Automatically delete head branches" on', 'chỉ "Allow squash merging"; bật "Automatically delete head branches"'), '3.4'],
  ])}
${note(t('A private repository on a free personal account may not offer every protection feature; the GitHub Student Developer Pack or a free organisation for the team usually solves it (', 'Repo riêng tư trên tài khoản cá nhân miễn phí có thể không có đủ mọi tính năng bảo vệ; GitHub Student Developer Pack hoặc một organization miễn phí cho nhóm thường giải quyết được (') + cs('git', 'git-15-3-student-pack-codespaces', 'Git 15.3') + t('). If a setting is unavailable, the rule still exists — write it in CONTRIBUTING.md and check it in review.', '). Nếu ô nào không có, luật vẫn tồn tại — ghi vào CONTRIBUTING.md và soát khi review.'))}

<h3>${t('Step 3 — The drill: one hour, three accidents on purpose (whole team)', 'Bước 3 — Diễn tập: một giờ, ba tai nạn có chủ đích (cả nhóm)')}</h3>
<p>${t('Do it on a throw-away copy of the repository (<code>labflow-dien-tap</code>), never on the real one. Everyone clones it and enables the hooks. The leader plays the "merge button" and narrates.', 'Làm trên một bản sao bỏ đi của repo (<code>labflow-dien-tap</code>), không bao giờ trên repo thật. Mọi người clone về và bật hook. Trưởng nhóm đóng vai "nút merge" và dẫn dắt.')}</p>
${bang(['', t('Who does what', 'Ai làm gì'), t('What must happen', 'Điều phải xảy ra')], [
    [t('A. Migration collision (10 min)', 'A. Trùng số migration (10 phút)'), t('Two members each add <code>V3__…sql</code> on separate branches, open PRs. Leader merges one.', 'Hai người mỗi người thêm <code>V3__…sql</code> trên nhánh riêng, mở PR. Trưởng nhóm merge một PR.'), t('The second PR is blocked as out of date; after updating, CI step 3 and 4 go red; the author renames to V4; green; merge.', 'PR thứ hai bị chặn vì chưa cập nhật; cập nhật xong thì bước 3 và 4 của CI đỏ; tác giả đổi thành V4; xanh; merge.')],
    [t('B. Same-file conflict (20 min)', 'B. Xung đột cùng tệp (20 phút)'), t('Two members append a route to the same area file and a menu item to the same role. Leader merges one.', 'Hai người cùng thêm một route vào cùng tệp miền và một mục menu vào cùng vai. Trưởng nhóm merge một PR.'), t('The later author tries "delete the markers" first and runs <code>ci/ci.sh</code> ⇒ red; then resolves by meaning with the other author on a call ⇒ green.', 'Tác giả PR sau thử "xoá dấu" trước rồi chạy <code>ci/ci.sh</code> ⇒ đỏ; sau đó giải theo nghĩa cùng tác giả bên kia qua cuộc gọi ⇒ xanh.')],
    [t('C. The big PR (15 min)', 'C. PR to (15 phút)'), t('One member puts two screens + a reformat in one branch and runs <code>node ci/kiem-pr.mjs</code>.', 'Một người gom hai màn + một lần định dạng lại vào một nhánh rồi chạy <code>node ci/kiem-pr.mjs</code>.'), t('The script reports 2 screens and formatting-only lines; the member splits into two branches and the warnings shrink to "shared file / migration".', 'Script báo 2 màn và các dòng chỉ đổi định dạng; người đó tách thành hai nhánh và cảnh báo chỉ còn "tệp chung / migration".')],
    [t('D. Debrief (15 min)', 'D. Rút kinh nghiệm (15 phút)'), t('Leader runs <code>node ci/tep-nong.mjs</code> and <code>node ci/dong-gop.mjs main</code> on the drill repo.', 'Trưởng nhóm chạy <code>node ci/tep-nong.mjs</code> và <code>node ci/dong-gop.mjs main</code> trên repo diễn tập.'), t('Agree: which hot files get pre-filled at each planning; who reviews whom this sprint; the 30-minute rule for a red main.', 'Chốt: tệp nóng nào được điền sẵn ở mỗi buổi planning; sprint này ai review ai; luật 30 phút khi main đỏ.')],
  ])}
${cl('warn', `<p>${t('Why a drill and not just reading: the first time a member meets conflict markers should not be at 23:00 before an iteration deadline. A rehearsed procedure under no pressure becomes the automatic one under pressure — the same reason ships run fire drills.', 'Vì sao diễn tập chứ không chỉ đọc: lần đầu một thành viên gặp dấu xung đột không nên là lúc 23 giờ trước hạn nộp iteration. Quy trình đã tập khi không áp lực sẽ thành phản xạ khi có áp lực — cùng lý do tàu biển tập chữa cháy.')}</p>`)}

<h3>${t('Step 4 — From now on, every day', 'Bước 4 — Từ nay, mỗi ngày')}</h3>
<ul>
<li>${t('Morning: <code>git fetch &amp;&amp; git merge origin/main</code> on your branch; open a draft PR on day 1 of a ticket.', 'Sáng: <code>git fetch &amp;&amp; git merge origin/main</code> trên nhánh của mình; mở PR nháp ngay ngày đầu của ticket.')}</li>
<li>${t('Before "Ready for review": <code>ci/ci.sh</code> + <code>node ci/kiem-pr.mjs</code>; description from the template.', 'Trước "Ready for review": <code>ci/ci.sh</code> + <code>node ci/kiem-pr.mjs</code>; mô tả theo mẫu.')}</li>
<li>${t('Reviewer: first response within one working day (how to write it: chapter 4).', 'Người review: phản hồi lần đầu trong một ngày làm việc (cách viết: chương 4).')}</li>
<li>${t('Leader, weekly: <code>node ci/dong-gop.mjs main --it N</code> into the weekly report (chapter 6); <code>node ci/tep-nong.mjs main 3</code> before each planning.', 'Trưởng nhóm, hằng tuần: <code>node ci/dong-gop.mjs main --it N</code> đưa vào báo cáo tuần (chương 6); <code>node ci/tep-nong.mjs main 3</code> trước mỗi buổi planning.')}</li>
</ul>

<h3>✅ ${t('Done when', 'Đạt khi')}</h3>
${bang([t('Check', 'Soát'), t('Evidence', 'Bằng chứng')], [
    [t('Rules are in the repository', 'Luật nằm trong repo'), t('CONTRIBUTING.md, PR template, phan-cong.csv, ci/, .githooks/ on main', 'CONTRIBUTING.md, mẫu PR, phan-cong.csv, ci/, .githooks/ trên main')],
    [t('Main is protected and nobody can bypass it', 'Main được bảo vệ và không ai vượt qua được'), t('A direct push to main by the leader is rejected', 'Trưởng nhóm push thẳng lên main bị từ chối')],
    [t('CI is required, strict, and proven to go red', 'CI bắt buộc, strict, và đã chứng minh chuyển đỏ được'), t('Drill A: red PR, then green after renaming', 'Diễn tập A: PR đỏ, rồi xanh sau khi đổi số')],
    [t('Every member has resolved one conflict', 'Mỗi thành viên đã giải một xung đột'), t('Drill B, rotated so all five try', 'Diễn tập B, xoay vòng để cả năm người thử')],
    [t('Only squash merge allowed; branches auto-deleted', 'Chỉ cho squash merge; nhánh tự xoá'), t('Repository settings screenshot in the team folder', 'Ảnh chụp cài đặt repo trong thư mục nhóm')],
    [t('Review rotation and response time agreed', 'Đã chốt xoay vòng review và thời gian phản hồi'), t('Written in CONTRIBUTING.md', 'Ghi trong CONTRIBUTING.md')],
  ])}
${giai(t('Self-check: what the lecturer or a senior may ask about your repository', 'Tự kiểm: giảng viên hoặc senior có thể hỏi gì về repo của bạn'), `<ol>
<li>${t('"Can you show me everything C4 did this iteration?" — <code>node ci/dong-gop.mjs main --it 2</code>, plus <code>git log --author="C4"</code>; every commit carries a ticket.', '"Cho thầy/cô xem mọi thứ C4 đã làm iteration này?" — <code>node ci/dong-gop.mjs main --it 2</code>, cộng <code>git log --author="C4"</code>; commit nào cũng mang ticket.')}</li>
<li>${t('"What stops someone from pushing broken code to the demo branch?" — protection on main: PR + approval + required strict CI, no bypass.', '"Cái gì ngăn ai đó đẩy code hỏng lên nhánh demo?" — bảo vệ main: PR + phê duyệt + CI bắt buộc chế độ strict, không ai vượt qua.')}</li>
<li>${t('"How do you avoid two people changing the database the same way?" — the migration-order check in CI and the update-before-merge rule.', '"Làm sao tránh hai người cùng sửa CSDL đụng nhau?" — bước soát thứ tự migration trong CI và luật cập nhật nhánh trước khi merge.')}</li>
<li>${t('"S30 broke the demo. How fast can you remove it?" — one <code>git revert</code> of its squash commit, plus a forward migration if its table reached the shared database.', '"S30 làm hỏng bản demo. Gỡ nó ra nhanh cỡ nào?" — một lệnh <code>git revert</code> commit squash của nó, cộng một migration đi tới nếu bảng của nó đã chạm CSDL dùng chung.')}</li>
</ol>`)}
<p>${t('Next: ', 'Tiếp theo: ')}${ag('agl-3-6-quiz', t('3.6 — Chapter 3 quiz', '3.6 — Kiểm tra Chương 3'))} · ${ag('agl-4-1-muc-dich', t('Chapter 4 — code review', 'Chương 4 — code review'))}.</p>
`);
};

export default {
  title: '3.5 — Lab: a day of pull requests on LabFlow|||3.5 — Lab: một ngày pull request của LabFlow',
  slug: 'agl-3-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mốc dự án chương 3: đưa luật nhóm vào repo LabFlow (CONTRIBUTING, mẫu PR, phan-cong.csv, thư mục ci/ với 7 script, hook), khoá main trên GitHub (PR + phê duyệt + CI bắt buộc strict, không ai vượt, chỉ squash), chạy CI cục bộ với Postgres giới hạn tài nguyên, và một buổi diễn tập một giờ cả nhóm tự gây ba tai nạn: trùng số migration, xung đột cùng tệp, PR to; bảng "Đạt khi".',
  content: L35(true) + L35(false),
};
