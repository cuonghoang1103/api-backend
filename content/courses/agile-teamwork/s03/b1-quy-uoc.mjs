/**
 * 3.1 — Quy ước đội: nhánh và commit (agl-3-1-quy-uoc). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT (git 2.55.0, Node 22.22.2) — repo LabFlow mẫu dựng bởi scratchpad/agt/lab/ch3/tao-repo.sh, kịch bản kb-quy-uoc.sh;
 * mã + output qua ./_ma.mjs (SINH bởi lab/ch3/tao-ma.mjs). Ranh giới: lời nhắn commit tốt nói chung ⇒ khoá git 1.4; mô hình nhánh ⇒ git 7.1;
 * CONTRIBUTING/CODEOWNERS/khoá main ⇒ git 16.1, 6.4; hook commit-msg/pre-push ⇒ bài 0.2 của khoá này. Bài này dạy LUẬT NHÓM + truy vết cho trưởng nhóm.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, bash, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const CONTRIB = `# Cách làm việc trong repo LabFlow (đọc 5 phút, áp dụng cả kỳ)

Nhánh
- main luôn chạy được; KHÔNG ai push thẳng lên main — mọi thứ vào main qua pull request.
- Một ticket = một nhánh = một PR: <loai>/LF-<số>-<mo-ta-khong-dau>   vd  feat/LF-21-dat-lich
- Nhánh sống tối đa 3 ngày làm việc. Lâu hơn ⇒ ticket quá to, báo ở daily để cắt (bài 2.2).
- Cập nhật nhánh với main mỗi sáng: git fetch && git merge origin/main

Commit
- Mẫu: <loai>(LF-<số>): <làm gì, viết thường, không chấm cuối>
  loai: feat (tính năng) · fix (sửa lỗi) · test · docs · refactor (đổi cấu trúc, không đổi hành vi) · chore (việc vặt)
- Thân commit (không bắt buộc): VÌ SAO, không phải "đã sửa những gì" (diff đã nói điều đó).
- Viết giúp màn của người khác ⇒ người chủ màn commit, thêm dòng cuối:
  Co-authored-by: Dev C3 <c3@nhom.example>

Phân công
- docs/phan-cong.csv là nguồn duy nhất: ticket → màn → chủ màn. Đổi người ⇒ sửa tệp này qua PR, trưởng nhóm duyệt.

Máy mới / clone mới
- git config core.hooksPath .githooks      (bật hook chặn commit/nhánh sai mẫu)
- ci/ci.sh                                 (chạy CI cục bộ trước khi push)`;

export const L31 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 3 · Lesson 3.1', 'Chương 3 · Bài 3.1', `
<h2>${t('3.1 — Team conventions: branches and commits', '3.1 — Quy ước đội: nhánh và commit')}</h2>
<p class="lead">${t(
    'The Git course already teaches how to write a good commit message and how the branching models differ. This lesson is about the part only a leader can do: <strong>choose one set of rules for five people, make the machine enforce it, and use it to answer the questions a leader is asked every week</strong> — "who did what on which screen?", "is S22 done?", "why is S34 empty?". You will run it on a LabFlow repository with five members and a real history.',
    'Khoá Git đã dạy cách viết lời nhắn commit tốt và các mô hình nhánh khác nhau ra sao. Bài này dạy phần chỉ trưởng nhóm làm được: <strong>chọn một bộ luật cho năm người, để máy tự cưỡng chế, và dùng nó trả lời những câu trưởng nhóm bị hỏi mỗi tuần</strong> — "ai làm gì ở màn nào?", "S22 xong chưa?", "sao S34 trống trơn?". Bạn sẽ chạy tất cả trên một repo LabFlow có năm thành viên và lịch sử thật.')}</p>
${note(t('Prerequisites: ', 'Cần trước: ') + cs('git', 'git-1-4-loi-nhan-commit', t('Git 1.4 — commit messages', 'Git 1.4 — lời nhắn commit')) + ' · ' + cs('git', 'git-7-1-chien-luoc-nhanh', t('Git 7.1 — branching strategies', 'Git 7.1 — chiến lược nhánh')) + ' · ' + ag('agl-0-2-cong-cu', t('0.2 — the commit-msg and pre-push hooks', '0.2 — hook commit-msg và pre-push')) + ' · ' + ag('agl-2-2-chia-nho', t('2.2 — one screen, one owner', '2.2 — mỗi màn một người chủ')) + '.')}

<h3>${t('Everyday picture: tracking numbers on parcels', 'Liên tưởng đời thường: mã vận đơn trên bưu kiện')}</h3>
<p>${t(
    'A delivery company handles millions of parcels and can still answer "where is mine?" in one second — because every scan, every truck, every signature carries the same tracking number. Nobody has to remember anything. A team repository works the same way: if the ticket number LF-21 is in the branch name, in every commit and in the PR title, then CT Work, Git and the grading sheet all point at the same thing, and the leader can answer any question with one command instead of five chat messages.',
    'Một công ty giao hàng xử lý hàng triệu bưu kiện mà vẫn trả lời được "hàng của tôi đâu?" trong một giây — vì mọi lần quét, mọi chuyến xe, mọi chữ ký đều mang cùng một mã vận đơn. Không ai phải nhớ gì cả. Repo của nhóm cũng vậy: nếu mã ticket LF-21 nằm trong tên nhánh, trong từng commit và trong tiêu đề PR, thì CT Work, Git và sheet chấm điểm cùng trỏ về một thứ, và trưởng nhóm trả lời được mọi câu hỏi bằng một lệnh thay vì năm tin nhắn.')}</p>

<h3>${t('Four decisions the leader makes in week 1', 'Bốn quyết định trưởng nhóm chốt ở tuần 1')}</h3>
${bang([t('Decision', 'Quyết định'), t('LabFlow choice', 'LabFlow chọn'), t('Why (for a 5-student SWP391 team)', 'Vì sao (với nhóm 5 SV SWP391)')], [
    [t('Branching model', 'Mô hình nhánh'), t('GitHub flow: one <code>main</code>, short feature branches, everything via PR', 'GitHub flow: một <code>main</code>, nhánh tính năng ngắn, mọi thứ qua PR'), t('One demo server, no parallel releases to maintain. git-flow’s <code>develop</code>/<code>release</code> branches solve a problem you do not have and double the merges.', 'Một máy demo, không phải bảo trì nhiều bản phát hành song song. Nhánh <code>develop</code>/<code>release</code> của git-flow giải bài toán bạn không có và nhân đôi số lần merge.')],
    [t('Branch name', 'Tên nhánh'), '<code>feat/LF-21-dat-lich</code>', t('Ticket in the name ⇒ CT Work links the branch to the ticket automatically (', 'Mã ticket trong tên ⇒ CT Work tự gắn nhánh vào ticket (') + cs('git', 'git-kd-10-noi-ct-work', 'Git KĐ.10') + t('); one ticket = one screen = one owner.', '); một ticket = một màn = một người chủ.')],
    [t('Commit message', 'Lời nhắn commit'), '<code>feat(LF-21): kiểm trùng khung giờ</code>', t('Conventional Commits 1.0.0 shape; the scope is the <em>ticket</em>, not a module name, because the team needs traceability more than a changelog.', 'Dạng Conventional Commits 1.0.0; scope là <em>ticket</em>, không phải tên module, vì nhóm cần truy vết hơn là cần changelog.')],
    [t('Who may commit to a screen', 'Ai được commit vào một màn'), t('Its owner; helpers use <code>Co-authored-by</code>', 'Người chủ màn; người giúp dùng <code>Co-authored-by</code>'), t('LOC is graded per screen per owner, and the owner must modify the code live at the demo.', 'LOC chấm theo màn theo chủ màn, và chủ màn phải tự sửa code trực tiếp lúc demo.')],
  ])}
${cl('info', `<p><strong>${t('Conventional Commits, in one paragraph', 'Conventional Commits, trong một đoạn')}</strong>: ${t('the specification (', 'đặc tả (')}${ng('https://www.conventionalcommits.org/en/v1.0.0/', 'conventionalcommits.org v1.0.0')}${t(') says a commit starts with a <em>type</em>, an optional <em>scope</em> in parentheses, a colon and a description; <code>feat</code> and <code>fix</code> have defined meanings, other types are allowed; a breaking change is marked with <code>!</code> or a <code>BREAKING CHANGE:</code> footer. Tools use it to generate changelogs and version numbers (Git 7.3). A team may choose what goes in the scope — LabFlow puts the ticket ID there.', ') quy định commit bắt đầu bằng <em>loại</em>, một <em>scope</em> tuỳ chọn trong ngoặc, dấu hai chấm và mô tả; <code>feat</code> và <code>fix</code> có nghĩa định sẵn, loại khác được phép; thay đổi phá vỡ tương thích đánh dấu bằng <code>!</code> hoặc dòng cuối <code>BREAKING CHANGE:</code>. Công cụ dựa vào nó để sinh changelog và số phiên bản (Git 7.3). Nhóm được tự chọn scope chứa gì — LabFlow đặt mã ticket vào đó.')}</p>`)}

<h3>${t('Write it down: one page, in the repository', 'Ghi ra: một trang, nằm trong repo')}</h3>
<p>${t('Rules that live in a chat message are forgotten by week 3. Put them in <code>CONTRIBUTING.md</code> at the root (the Git course 16.1 shows the general template); this is the LabFlow version, short enough that everyone actually reads it:', 'Luật nằm trong một tin nhắn chat sẽ bị quên trước tuần 3. Đặt chúng vào <code>CONTRIBUTING.md</code> ở gốc repo (khoá Git 16.1 có mẫu tổng quát); đây là bản LabFlow, đủ ngắn để ai cũng đọc thật:')}</p>
${out(CONTRIB)}
<p>${t('The assignment table that every script below reads — the single source of truth for "who owns what" (an extract; the full file has one row per screen of iterations 1–2):', 'Bảng phân công mà mọi script bên dưới đọc — nguồn duy nhất cho câu "ai giữ cái gì" (trích; tệp đầy đủ mỗi màn của iteration 1–2 một dòng):')}</p>
${out(MA.phanCong.split('\n').slice(0, 6).join('\n') + '\n…\n' + MA.phanCong.split('\n').filter((d) => /^LF-(21|33|44|55)/.test(d)).join('\n'))}

<h3>${t('Lab 1 — the hook is not enough: a new laptop', 'Lab 1 — hook là chưa đủ: một chiếc máy mới')}</h3>
<p>${t('Lesson 0.2 installed hooks through <code>core.hooksPath</code>. Hooks live on each laptop, so they fail in exactly the situations where you need them: a reinstalled machine, a fresh clone, someone in a hurry with <code>--no-verify</code>. On 18/02/2027 C5 reinstalled Windows, cloned again and started S34:', 'Bài 0.2 đã cài hook qua <code>core.hooksPath</code>. Hook nằm trên từng máy, nên nó hỏng đúng lúc bạn cần nó: máy vừa cài lại, clone mới, ai đó vội dùng <code>--no-verify</code>. Ngày 18/02/2027 C5 cài lại Windows, clone lại và bắt đầu làm S34:')}</p>
${out(RA.quyUoc.split('### C5 sửa')[0].replace(/^### .*\n/, ''))}
<p>${t('The first line prints nothing: <code>core.hooksPath</code> is not set, so the bad message went straight in. What caught it is step 1 of the team CI, which re-checks <em>every</em> commit of the branch on the server side:', 'Dòng đầu không in gì: <code>core.hooksPath</code> chưa được đặt, nên lời nhắn sai lọt thẳng vào. Thứ bắt được nó là bước 1 của CI nhóm, soát lại <em>mọi</em> commit của nhánh ở phía máy chủ:')}</p>
${js(MA.kiemCommit)}
<p>${t('C5 fixes it while the branch is still private — amending is fine on your own unpushed branch (never on <code>main</code>, see ', 'C5 sửa khi nhánh còn là của riêng mình — amend được trên nhánh riêng chưa ai dùng (không bao giờ trên <code>main</code>, xem ')}${cs('git', 'git-8-1-amend', 'Git 8.1')}):</p>
${out(RA.quyUoc.split('### C5 sửa')[1].split('### Cả ngày')[0].replace(/^[^\n]*\n/, ''))}
${cl('warn', `<p>${t('Two layers, always: the <strong>hook</strong> gives fast feedback on the laptop; the <strong>CI check</strong>, made required on the server, is the rule that cannot be skipped. A rule that exists only on laptops is a suggestion.', 'Luôn hai lớp: <strong>hook</strong> cho phản hồi nhanh trên máy; <strong>check của CI</strong>, đặt bắt buộc trên máy chủ, mới là luật không thể bỏ qua. Luật chỉ nằm trên máy cá nhân là một lời khuyên.')}</p>`)}

<h3>${t('Lab 2 — what the convention buys the leader', 'Lab 2 — quy ước mua được gì cho trưởng nhóm')}</h3>
<p>${t('The rest of the day: C1 builds S22 (C3 helps by writing the overlap test), C4 builds S30, C2 builds S20; all three PRs are squash-merged (lesson 3.4). At 21:30 the leader prepares the weekly report. First question: what happened to LF-21?', 'Phần còn lại của ngày: C1 làm S22 (C3 giúp viết test trùng giờ), C4 làm S30, C2 làm S20; cả ba PR được merge kiểu squash (bài 3.4). 21:30 trưởng nhóm chuẩn bị báo cáo tuần. Câu đầu tiên: LF-21 đã đi tới đâu?')}</p>
${out(RA.quyUoc.split('### Cả ngày')[1].split('\nC1 (main)$ node')[0].replace(/^[^\n]*\n/, ''))}
<p>${t('Second question: per screen of iteration 2, who added what, and where does reality differ from the assignment? This script reads the ticket in every commit message, maps it to a screen and its owner through <code>docs/phan-cong.csv</code>, and also reads <code>Co-authored-by</code> lines:', 'Câu thứ hai: với từng màn của iteration 2, ai thêm gì, và thực tế lệch phân công ở đâu? Script này đọc mã ticket trong từng lời nhắn commit, quy về màn và chủ màn qua <code>docs/phan-cong.csv</code>, đọc cả dòng <code>Co-authored-by</code>:')}</p>
${js(MA.dongGop)}
${out('C1 (main)$ node' + RA.quyUoc.split('\nC1 (main)$ node')[1])}
<p>${t('How a leader reads this table:', 'Trưởng nhóm đọc bảng này thế nào:')}</p>
<ul>
<li>${t('<strong>"Màn chưa có commit nào"</strong> is the list for tomorrow’s daily: S23, S25, S31, S34 have nothing on <code>main</code> yet. Not an accusation — a question: "is it on a branch? blocked?" (chapter 6). S34 is on C5’s branch, not merged.', '<strong>"Màn chưa có commit nào"</strong> là danh sách cho buổi daily ngày mai: S23, S25, S31, S34 chưa có gì trên <code>main</code>. Không phải buộc tội — là một câu hỏi: "đang ở nhánh à? bị chặn à?" (chương 6). S34 đang nằm ở nhánh của C5, chưa merge.')}</li>
<li>${t('<strong>"đồng tác giả C3 trên LF-21"</strong>: the squash merge credited the lines to C1 and kept C3 in a trailer. That is the honest record you want: C3 helped, C1 owns S22. If C3 had silently written half of S22, the lecturer’s demo question "change this validation now" would land on C1 anyway.', '<strong>"đồng tác giả C3 trên LF-21"</strong>: bản merge squash ghi số dòng cho C1 và giữ C3 trong một dòng cuối. Đó là bản ghi trung thực bạn cần: C3 giúp, C1 giữ S22. Nếu C3 lặng lẽ viết nửa S22, câu hỏi lúc demo "sửa phần kiểm tra này ngay đi" vẫn rơi vào C1.')}</li>
<li>${t('Numbers are lines <em>added in Git</em>, not SWP391 LOC (which is counted from screen complexity — lesson 2.2). Use the table as <em>evidence of who worked where</em>, never as a score: a 5-line fix can be the hardest commit of the week.', 'Con số là số dòng <em>thêm vào Git</em>, không phải LOC SWP391 (LOC tính từ độ phức tạp màn — bài 2.2). Dùng bảng làm <em>bằng chứng ai làm ở đâu</em>, đừng bao giờ làm điểm số: một bản sửa 5 dòng có thể là commit khó nhất tuần.')}</li>
</ul>
${cl('info', `<p>${t('GitHub’s squash dialog fills a default message from the PR and its commits; check the box before you press the button and make sure a <code>Co-authored-by</code> line is there for everyone who committed to the branch (', 'Hộp thoại squash của GitHub điền sẵn lời nhắn từ PR và các commit; xem ô đó trước khi bấm và bảo đảm có dòng <code>Co-authored-by</code> cho mọi người đã commit vào nhánh (')}${ng('https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors', t('GitHub Docs — commits with multiple authors', 'GitHub Docs — commit nhiều tác giả'))}${t('). In this lab the "merge button" script adds it; on GitHub it is the merger’s job — put it in the team rules.', '). Trong lab này script "nút merge" tự thêm; trên GitHub đó là việc của người bấm merge — ghi vào luật nhóm.')}</p>`)}

<h3>${t('At work: the same idea, other names', 'Đi làm: cùng ý tưởng, khác tên gọi')}</h3>
<p>${t(
    'At an outsourcing company the convention is usually given to you, not chosen: branches like <code>feature/ABC-1234-login</code> from the Jira key, sometimes a long-lived <code>develop</code> branch and release branches because several versions are maintained for the customer, commit messages in English. Your job on day 1 is to read the project’s rules page and follow it exactly — the customer’s auditors may trace a defect from the bug ticket to the commit. The skill you practise here (one ticket, one branch, the key everywhere) transfers unchanged.',
    'Ở công ty outsourcing, quy ước thường được giao sẵn chứ không phải tự chọn: nhánh kiểu <code>feature/ABC-1234-login</code> theo mã Jira, đôi khi có nhánh <code>develop</code> sống lâu và nhánh release vì phải bảo trì nhiều phiên bản cho khách, lời nhắn commit bằng tiếng Anh. Việc của bạn ngày đầu là đọc trang luật của dự án và làm theo đúng y — kiểm toán của khách có thể lần từ ticket lỗi tới commit. Kỹ năng luyện ở đây (một ticket, một nhánh, mã ở khắp nơi) mang sang nguyên vẹn.')}</p>

<h3>🧪 ${t('Exercise', 'Bài tập')}</h3>
<p>${t('Which of these eight messages pass the LabFlow rule? Decide first, then check with the answer, which runs the exact regular expression of <code>ci/kiem-commit.mjs</code>.', 'Tám lời nhắn sau, cái nào qua luật LabFlow? Tự quyết trước, rồi đối chiếu đáp án — chạy đúng biểu thức chính quy của <code>ci/kiem-commit.mjs</code>.')}</p>
${out(MA.baiTap31.split('\n').filter((d) => d.startsWith("  '")).map((d, i) => `${i + 1}. ${d.trim().replace(/^'|',?$/g, '')}`).join('\n'))}
${giai(t('Answer (real run)', 'Đáp án (chạy thật)'), `${js(MA.baiTap31)}${out('$ node bai-tap-31.mjs\n' + RA.baiTap31)}
<p>${t('Why they fail: 2 no type/ticket; 3 missing colon; 4 the scope must be the ticket, not the screen; 6 description shorter than 5 characters; 7 types are lowercase. Message 4 is the interesting one — it is valid Conventional Commits, but not valid for <em>this team</em>: conventions are local agreements on top of a standard.', 'Vì sao trượt: 2 không có loại/ticket; 3 thiếu dấu hai chấm; 4 scope phải là ticket, không phải màn; 6 mô tả ngắn hơn 5 ký tự; 7 loại phải viết thường. Câu 4 đáng chú ý nhất — nó hợp lệ theo Conventional Commits, nhưng không hợp lệ với <em>nhóm này</em>: quy ước là thoả thuận riêng đặt lên trên một chuẩn chung.')}</p>`)}

${phongVan([
    [t('"What branching strategy did your team use, and why?"', '"Nhóm bạn dùng chiến lược nhánh nào, vì sao?"'), t('GitHub flow: one protected main, short branches per ticket, everything through PRs. We had one deployment target and no parallel versions, so release/develop branches would have added merges without solving anything. Branches lived at most three days; longer meant the ticket was too big.', 'GitHub flow: một main được bảo vệ, nhánh ngắn theo ticket, mọi thứ qua PR. Nhóm chỉ có một nơi triển khai và không có phiên bản song song, nên nhánh release/develop chỉ thêm merge mà không giải quyết gì. Nhánh sống tối đa ba ngày; lâu hơn nghĩa là ticket quá to.')],
    [t('"How do you enforce commit conventions in a team?"', '"Làm sao cưỡng chế quy ước commit trong nhóm?"'), t('Two layers: a local hook for fast feedback, and the same check in CI made required on the server — because hooks can be skipped or missing on a new machine. I have seen exactly that happen: a reinstalled laptop without the hook.', 'Hai lớp: hook ở máy cho phản hồi nhanh, và cùng phép soát đó trong CI được đặt bắt buộc trên máy chủ — vì hook có thể bị bỏ qua hoặc thiếu trên máy mới. Tôi đã gặp đúng chuyện đó: một máy cài lại không có hook.')],
    [t('"Why put the ticket ID in commits?"', '"Sao phải ghi mã ticket vào commit?"'), t('Traceability both ways: from a ticket to the code that implemented it, and from a line of code (git blame) back to the requirement and discussion. It also let me produce a per-screen contribution report for our lecturer from git log, instead of asking everyone.', 'Truy vết hai chiều: từ ticket tới code đã làm nó, và từ một dòng code (git blame) ngược về yêu cầu và cuộc thảo luận. Nó còn giúp tôi xuất báo cáo đóng góp theo màn cho giảng viên từ git log, thay vì đi hỏi từng người.')],
    [t('"A teammate helped you finish your feature. How does that show in history?"', '"Một đồng đội giúp bạn làm xong tính năng. Lịch sử thể hiện điều đó thế nào?"'), t('A Co-authored-by trailer on the commit (or kept in the squash message), so the help is credited and the ownership stays clear.', 'Một dòng Co-authored-by ở cuối commit (hoặc giữ trong lời nhắn squash), để công giúp được ghi nhận mà quyền sở hữu vẫn rõ ràng.')],
  ], en)}

${thuatNgu([
    ['GitHub flow', t('One main branch plus short-lived feature branches merged by PR.', 'Một nhánh main cộng các nhánh tính năng ngắn, merge qua PR.')],
    ['git-flow', t('Model with long-lived develop and release branches.', 'Mô hình có nhánh develop và release sống lâu.')],
    ['Conventional Commits', t('Spec for commit messages: type(scope): description.', 'Đặc tả lời nhắn commit: loai(scope): mô tả.')],
    ['scope', t('The part in parentheses; LabFlow uses the ticket ID.', 'Phần trong ngoặc; LabFlow dùng mã ticket.')],
    ['trailer', t('Key: value line at the end of a commit message.', 'Dòng khoá: giá trị ở cuối lời nhắn commit.')],
    ['Co-authored-by', t('Trailer crediting another author.', 'Dòng cuối ghi công một tác giả khác.')],
    ['core.hooksPath', t('Git setting pointing to a hooks folder kept in the repo.', 'Cài đặt Git trỏ tới thư mục hook nằm trong repo.')],
    [t('traceability', 'truy vết'), t('Following a requirement to its code and back.', 'Lần từ yêu cầu tới code và ngược lại.')],
  ], en)}

${tomTat([
    t('The leader decides four things in week 1: branching model, branch name, commit message shape, who may commit to a screen — and writes them in CONTRIBUTING.md.', 'Trưởng nhóm chốt bốn điều ở tuần 1: mô hình nhánh, tên nhánh, dạng lời nhắn commit, ai được commit vào một màn — và ghi vào CONTRIBUTING.md.'),
    t('The ticket ID everywhere turns Git into a tracking system: git log --grep, CT Work links, per-screen reports.', 'Mã ticket ở khắp nơi biến Git thành hệ thống theo dõi: git log --grep, liên kết CT Work, báo cáo theo màn.'),
    t('Hooks on laptops are convenience; the CI check required on the server is the rule.', 'Hook trên máy là tiện lợi; check CI bắt buộc trên máy chủ mới là luật.'),
    t('Credit help with Co-authored-by; keep one owner per screen.', 'Ghi công giúp đỡ bằng Co-authored-by; giữ mỗi màn một người chủ.'),
    t('The contribution report is evidence of where people worked, not a score.', 'Báo cáo đóng góp là bằng chứng ai làm ở đâu, không phải điểm số.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-3-2-pr-tot', t('3.2 — Opening a PR that is easy to review', '3.2 — Mở PR dễ review'))}.</p>
`);
};

export default {
  title: '3.1 — Team conventions: branches and commits|||3.1 — Quy ước đội: nhánh và commit',
  slug: 'agl-3-1-quy-uoc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bốn quyết định trưởng nhóm chốt ở tuần 1 (GitHub flow, tên nhánh theo ticket, Conventional Commits với scope là mã ticket, ai được commit vào màn), CONTRIBUTING.md một trang cho LabFlow; lab chạy thật: máy mới không có hook ⇒ CI bắt commit sai, và báo cáo đóng góp theo màn đọc từ git log cho báo cáo tuần.',
  content: L31(true) + L31(false),
};
