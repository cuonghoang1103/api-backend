/**
 * 0.2 — Bộ công cụ (agl-0-2-cong-cu). Soạn 24/11/2026, agent agt.
 * Lab: scratchpad/agt/lab/ch0/thu-hook.sh + mau-repo/ (commit-msg, pre-push, PR template, CODEOWNERS) chạy THẬT (git 2.55.0) — output qua ./_ma.mjs.
 * Tính năng CT Work nêu trong bài lấy từ bài git-kd-10-noi-ct-work trên prod (webhook, mã thẻ, Development, Contributions) — không tả nút bấm khác.
 * Ranh giới: cách nối webhook ⇒ git KĐ.10; hook chi tiết ⇒ git 12.1; bảo vệ nhánh ⇒ git 6.4; Slack/email tiếng Anh ⇒ tak.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, bash, out, ag, cs, ac, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L02 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Section 0 · Lesson 0.2', 'Mục 0 · Bài 0.2', `
<h2>${t('0.2 — The toolbox: Git, GitHub, CT Work/Jira, chat', '0.2 — Bộ công cụ: Git, GitHub, CT Work/Jira, chat')}</h2>
<p class="lead">${t(
    'Most student teams use one tool for everything: the group chat. Decisions scroll away, files live in five places, and on week 8 nobody can find "what we agreed about the booking rules". Real teams give each kind of information one home. This lesson tells you which tool holds what, gives you a day-one setup checklist, and makes the repository enforce two team rules by itself — you will see it reject a bad commit and a push to <code>main</code>.',
    'Phần lớn nhóm sinh viên dùng một công cụ cho mọi thứ: nhóm chat. Quyết định trôi mất, tệp nằm năm nơi, tới tuần 8 không ai tìm ra "hôm đó thống nhất luật đặt lịch thế nào". Đội thật cho mỗi loại thông tin một chỗ ở. Bài này nói công cụ nào giữ cái gì, đưa bạn checklist thiết lập ngày đầu, và cho repo tự ép hai luật của nhóm — bạn sẽ thấy nó từ chối một commit xấu và một lần push thẳng lên <code>main</code>.')}</p>

<h3>${t('Everyday picture: a restaurant\'s order book', 'Liên tưởng đời thường: sổ order của quán')}</h3>
<p>${t(
    'A waiter can remember three orders; on a busy night they write every order on the slip that goes to the kitchen, and the cashier reads the same slip. If a customer changes their order by calling out to the cook, the slip is now wrong and the bill will be wrong. "If it is not on the slip, it was not ordered." For a software team the slip is the ticket on the board; the chat is people calling out across the room.',
    'Người phục vụ nhớ được ba order; tối đông khách thì mọi order được ghi vào phiếu đưa xuống bếp, thu ngân đọc cùng tờ phiếu đó. Nếu khách gọi với vào bếp để đổi món, tờ phiếu thành sai và hoá đơn cũng sai. "Không có trên phiếu thì coi như chưa gọi." Với đội phần mềm, tờ phiếu là ticket trên bảng; còn chat là mọi người nói vọng qua phòng.')}</p>

<h3>${t('One home for each kind of information', 'Mỗi loại thông tin một chỗ ở')}</h3>
${bang([t('Tool', 'Công cụ'), t('Holds', 'Giữ cái gì'), t('Does NOT hold', 'KHÔNG giữ'), t('Learn it in', 'Học ở')], [
    ['<strong>Git</strong>', t('Every version of the code, who changed what and why (commit messages)', 'Mọi phiên bản code, ai đổi gì và vì sao (lời nhắn commit)'), t('Passwords, .env, build output, large binaries', 'Mật khẩu, .env, thư mục build, tệp nhị phân lớn'), cs('git', 'git-1-1-ba-cai-cay', t('Git ch. 1', 'Git ch. 1'))],
    ['<strong>GitHub / GitLab</strong>', t('The shared copy of the repo, pull requests, reviews, CI results, branch protection', 'Bản chung của repo, pull request, review, kết quả CI, bảo vệ nhánh'), t('Task planning for non-code work (use the board)', 'Kế hoạch các việc không phải code (dùng bảng)'), cs('git', 'git-6-1-giai-phau-pr', t('Git ch. 6', 'Git ch. 6')) + ' · ' + ac('software-development-project', 'swp391-1-3-gitlab-setup-du-an', t('SWP391 1.3 (school GitLab)', 'SWP391 1.3 (GitLab của trường)'))],
    [t('<strong>CT Work</strong> (or Jira)', '<strong>CT Work</strong> (hoặc Jira)'), t('Backlog, tickets with acceptance criteria, sprints, board, who works on what, time logged, reports', 'Backlog, ticket kèm tiêu chí chấp nhận, sprint, bảng, ai làm gì, giờ công, báo cáo'), t('Long discussions (summarise them into the ticket)', 'Thảo luận dài (tóm lại vào ticket)'), ag('agl-2-4-ct-work', t('Lesson 2.4', 'Bài 2.4'))],
    [t('<strong>Chat</strong> (Zalo, Discord, Teams, Slack)', '<strong>Chat</strong> (Zalo, Discord, Teams, Slack)'), t('Quick questions, "I am blocked", meeting links, social glue', 'Câu hỏi nhanh, "mình đang bí", link họp, gắn kết nhóm'), t('Decisions, requirements, secrets, files', 'Quyết định, yêu cầu, bí mật, tệp'), ag('agl-6-4-tu-xa', t('Lesson 6.4', 'Bài 6.4'))],
    [t('<strong>Documents</strong> (CT Work docs, Drive)', '<strong>Tài liệu</strong> (CT Work docs, Drive)'), t('SRS/SDS, meeting minutes, reports for the lecturer', 'SRS/SDS, biên bản họp, báo cáo cho giảng viên'), t('Code snippets that should be in the repo', 'Đoạn code lẽ ra phải nằm trong repo'), ag('agl-5-1-readme', t('Chapter 5', 'Chương 5'))],
    [t('<strong>Meetings</strong> (Meet, Teams)', '<strong>Họp</strong> (Meet, Teams)'), t('Talking — then the result goes into minutes and tickets', 'Nói chuyện — kết quả rồi phải vào biên bản và ticket'), t('Anything nobody wrote down', 'Bất cứ thứ gì không ai ghi lại'), ag('agl-6-1-standup', t('Chapter 6', 'Chương 6'))],
  ])}
${cl('ok', `<p><strong>${t('Three team rules that make the tools work', 'Ba luật nhóm làm cho công cụ có tác dụng')}</strong></p><ol>
<li>${t('<strong>No ticket, no work.</strong> If a request arrives in chat, the first reply is the ticket link.', '<strong>Không có ticket thì không làm.</strong> Yêu cầu tới qua chat thì câu trả lời đầu tiên là link ticket.')}</li>
<li>${t('<strong>Decisions are copied into the ticket</strong> (one line: who decided what, when). Chat is where you discuss; the ticket is where you remember.', '<strong>Quyết định được chép vào ticket</strong> (một dòng: ai quyết gì, khi nào). Chat là nơi bàn; ticket là nơi nhớ.')}</li>
<li>${t('<strong>The ticket key is in every branch, commit and PR</strong> (<code>LF-23</code>). That is what lets CT Work show the code of each card.', '<strong>Mã ticket có trong mọi nhánh, commit và PR</strong> (<code>LF-23</code>). Nhờ vậy CT Work mới hiện được code của từng thẻ.')}</li>
</ol>`)}

<h3>${t('CT Work in one paragraph', 'CT Work trong một đoạn')}</h3>
<p>${t(
    'CT Work (<a href="/work">/work</a>) is the Jira-style tracker built into this site, free for student teams. A project has a key (for LabFlow: <code>LF</code>), so cards are numbered <code>LF-1</code>, <code>LF-2</code>… You plan cards into sprints, move them across the board, log time, and export reports (including SWP391-style tracking and weekly report sheets). Connected to GitHub by one webhook, each card shows the branches, commits and pull requests whose name contains its key, and the Contributions report counts each member\'s commits. The connection is a ten-minute job taught step by step in ',
    'CT Work (<a href="/work">/work</a>) là công cụ quản lý công việc kiểu Jira có sẵn trên trang này, miễn phí cho nhóm sinh viên. Mỗi dự án có một mã (LabFlow: <code>LF</code>), nên thẻ được đánh số <code>LF-1</code>, <code>LF-2</code>… Bạn xếp thẻ vào sprint, kéo thẻ qua các cột của bảng, ghi giờ công, xuất báo cáo (kể cả sheet theo dõi kiểu SWP391 và báo cáo tuần). Nối với GitHub bằng một webhook, mỗi thẻ hiện các nhánh, commit và pull request có chứa mã của nó, còn báo cáo Contributions đếm commit của từng thành viên. Việc nối mất mười phút, hướng dẫn từng bước ở ')}${cs('git', 'git-kd-10-noi-ct-work', t('Git — Quick start KĐ.10', 'Git — Khởi động nhanh KĐ.10'))}. ${t('Chapter 2.4 runs a whole sprint on it.', 'Bài 2.4 chạy cả một sprint trên đó.')}</p>
${note(t('Jira, Azure Boards, GitLab Issues, Linear, Trello all have the same ideas (project key, issue, sprint, board, workflow). What you learn on CT Work transfers directly — at an internship you will most likely meet Jira or Redmine.', 'Jira, Azure Boards, GitLab Issues, Linear, Trello đều có cùng các ý tưởng (mã dự án, issue, sprint, bảng, quy trình trạng thái). Học trên CT Work thì sang đó dùng được ngay — đi thực tập bạn nhiều khả năng gặp Jira hoặc Redmine.'))}

<h3>${t('Day-one setup checklist for a team of five', 'Checklist thiết lập ngày đầu cho nhóm năm người')}</h3>
${bang(['#', t('Item', 'Việc'), t('Owner (suggested)', 'Người làm (gợi ý)'), t('Done when', 'Xong khi')], [
    ['1', t('Create the repository; add the 4 members with write access', 'Tạo repo; thêm 4 thành viên quyền ghi'), 'C1', t('Everyone has cloned and pushed a test branch', 'Ai cũng clone được và đẩy được một nhánh thử')],
    ['2', t('Protect <code>main</code>: pull request required, 1 approval, CI must pass, no force-push', 'Bảo vệ <code>main</code>: bắt buộc qua PR, 1 người duyệt, CI phải xanh, cấm force-push'), 'C1', t('A direct push to main is rejected by the server', 'Push thẳng lên main bị máy chủ từ chối')],
    ['3', t('Commit the shared hooks, PR template, CODEOWNERS, <code>.gitignore</code> (below)', 'Commit hook dùng chung, mẫu PR, CODEOWNERS, <code>.gitignore</code> (ở dưới)'), 'C3', t('A commit without a ticket key is rejected on every laptop', 'Commit thiếu mã ticket bị chặn trên mọi máy')],
    ['4', t('Create the CT Work project (key, 5 members, board columns To do / In progress / In review / Done)', 'Tạo dự án CT Work (mã, 5 thành viên, cột To do / In progress / In review / Done)'), 'C1', t('Every member sees the board', 'Ai cũng thấy bảng')],
    ['5', t('Connect GitHub → CT Work webhook', 'Nối webhook GitHub → CT Work'), t('C1 + repo owner', 'C1 + chủ repo'), t('A test commit with LF-1 appears on card LF-1', 'Một commit thử có LF-1 hiện trên thẻ LF-1')],
    ['6', t('Chat group + pinned message: RACI, links (repo, board, docs folder), meeting times, the three rules', 'Nhóm chat + tin ghim: RACI, các link (repo, bảng, thư mục tài liệu), giờ họp, ba luật'), 'C2', t('Pinned', 'Đã ghim')],
    ['7', t('One shared docs folder with the subject templates', 'Một thư mục tài liệu chung có sẵn các mẫu của môn'), 'C4', t('Templates copied, permissions = team only', 'Đã chép mẫu, quyền = chỉ nhóm')],
    ['8', t('A README with "how to run locally" — tested by the member with the slowest laptop', 'README "chạy trên máy mình thế nào" — người có máy yếu nhất chạy thử'), 'C5', t('C5 runs the app from scratch following only the README', 'C5 chạy được ứng dụng từ đầu chỉ theo README')],
  ])}
<p>${t('Item 8 is deliberately given to the member most likely to get stuck: if the README works for them, it works for everyone, and they start the project with a win instead of a silent blocker.', 'Việc 8 cố ý giao cho bạn dễ bí nhất: README chạy được với bạn ấy thì chạy được với cả nhóm, và bạn ấy bắt đầu dự án bằng một việc thành công thay vì một vướng mắc im lặng.')}</p>

<h3>${t('Lab: make the repository enforce the rules', 'Lab: cho repo tự ép luật nhóm')}</h3>
<p>${t(
    'Git runs <em>hooks</em> — small scripts — at certain moments. Hooks in <code>.git/hooks</code> are not committed, so each member would have to copy them by hand. The trick: keep them in a committed folder <code>.githooks/</code> and tell Git to use it with one config line per laptop.',
    'Git chạy các <em>hook</em> — script nhỏ — ở những thời điểm nhất định. Hook trong <code>.git/hooks</code> không được commit, nên mỗi thành viên phải tự chép tay. Mẹo: để chúng trong thư mục <code>.githooks/</code> có commit, rồi bảo Git dùng thư mục đó bằng một dòng cấu hình trên mỗi máy.')}</p>
<p><strong>.githooks/commit-msg</strong> — ${t('rejects a commit whose first line has no ticket key:', 'chặn commit mà dòng đầu không có mã ticket:')}</p>
${bash(MA.commitMsg)}
<p><strong>.githooks/pre-push</strong> — ${t('rejects pushing from <code>main</code> and badly named branches:', 'chặn push từ <code>main</code> và nhánh đặt tên sai:')}</p>
${bash(MA.prePush)}
<p>${t('Real run in a temporary repo (member "Dev C3", fake name):', 'Chạy thật trong một repo tạm (thành viên "Dev C3", tên giả):')}</p>
${out(RA.hook.split('$ git commit --no-verify')[0].trim())}
<p>${t('Now the honest part — anyone can skip client-side hooks:', 'Giờ là phần thật thà — ai cũng bỏ qua được hook phía máy mình:')}</p>
${out('$ git commit --no-verify' + RA.hook.split('$ git commit --no-verify')[1])}
${cl('warn', `<p>${t('Client hooks are a <strong>seatbelt reminder</strong>, not a lock: they help honest people not forget. The lock is on the server — branch protection on GitHub ("protected branch" on GitLab) plus CI on every pull request. Set both on day one (checklist item 2). Details: ', 'Hook phía máy là <strong>tiếng nhắc thắt dây an toàn</strong>, không phải ổ khoá: nó giúp người tử tế không quên. Ổ khoá nằm ở máy chủ — bảo vệ nhánh trên GitHub ("protected branch" trên GitLab) cộng CI cho mọi pull request. Bật cả hai từ ngày đầu (việc 2 trong checklist). Chi tiết: ')}${cs('git', 'git-6-4-bao-ve-nhanh', t('Git 6.4 — branch protection', 'Git 6.4 — bảo vệ nhánh'))}, ${cs('git', 'git-12-1-hooks', t('Git 12.1 — hooks', 'Git 12.1 — hook'))}.</p>`)}

<p><strong>.github/pull_request_template.md</strong> — ${t('GitHub pre-fills every new PR description with this (GitLab: <code>.gitlab/merge_request_templates/</code>):', 'GitHub tự điền sẵn mô tả mọi PR mới bằng tệp này (GitLab: <code>.gitlab/merge_request_templates/</code>):')}</p>
${out(MA.prTemplate)}
<p><strong>.github/CODEOWNERS</strong> — ${t('GitHub automatically requests review from the owner of the paths a PR touches; with branch protection you can require their approval:', 'GitHub tự động mời chủ của các đường dẫn mà PR đụng tới vào review; kết hợp bảo vệ nhánh có thể bắt buộc họ duyệt:')}</p>
${out(MA.codeowners)}
${note(t('<code>@c1-leader</code> etc. stand for your members\' real GitHub usernames. Notice the database migration folder has two owners — shared files deserve two pairs of eyes.', '<code>@c1-leader</code>… là chỗ điền username GitHub thật của thành viên. Để ý thư mục migration CSDL có hai chủ — tệp dùng chung đáng có hai cặp mắt.'))}

<h3>🕵️ ${t('The attacker\'s angle: the group chat is not a safe', 'Góc kẻ xấu: nhóm chat không phải két sắt')}</h3>
<p>${t(
    'The commonest student leak is pasting the <code>.env</code> file (database password, API keys, a JWT secret) into the group chat "so everyone can run it", or committing it once and deleting it in the next commit — it stays in history forever. Bots scan public GitHub for keys continuously; Toyota disclosed in October 2022 that an access key for its T-Connect service had sat in a public GitHub repository for almost five years. Rules: <code>.env</code> in <code>.gitignore</code> from the first commit, commit a <code>.env.example</code> without values, share real values one-to-one and rotate them if they leak.',
    'Kiểu lộ phổ biến nhất ở nhóm sinh viên là dán tệp <code>.env</code> (mật khẩu CSDL, khoá API, khoá ký JWT) vào nhóm chat "để ai cũng chạy được", hoặc lỡ commit một lần rồi xoá ở commit sau — nó nằm trong lịch sử mãi mãi. Bot quét GitHub công khai tìm khoá liên tục; tháng 10/2022 Toyota công bố một khoá truy cập dịch vụ T-Connect đã nằm trong một repo GitHub công khai gần năm năm. Luật: <code>.env</code> có trong <code>.gitignore</code> từ commit đầu, commit một tệp <code>.env.example</code> không có giá trị, gửi giá trị thật riêng từng người và đổi ngay nếu lộ.')}
${ag('agl-10-7-su-co-that', t('Lesson 10.7 — real leaks', 'Bài 10.7 — sự cố rò rỉ thật'))} · ${cs('git', 'git-8-3-go-bi-mat', t('Git 8.3 — removing a secret from history', 'Git 8.3 — gỡ bí mật khỏi lịch sử'))}</p>

<h3>🧪 ${t('Practice (25 minutes)', 'Thực hành (25 phút)')}</h3>
<ol>
<li>${t('In a new repo, add <code>.githooks/commit-msg</code> and <code>.githooks/pre-push</code>, run <code>git config core.hooksPath .githooks</code>, and reproduce the output above (rejected "update code", accepted <code>feat(LF-23): …</code>, rejected push to main).', 'Trong một repo mới, thêm <code>.githooks/commit-msg</code> và <code>.githooks/pre-push</code>, chạy <code>git config core.hooksPath .githooks</code>, rồi tái hiện output ở trên ("update code" bị chặn, <code>feat(LF-23): …</code> qua, push lên main bị chặn).')}</li>
<li>${t('A teammate writes <code>Feat(LF-23): form</code>. Does the hook accept it? Predict, then test.', 'Một bạn viết <code>Feat(LF-23): form</code>. Hook có nhận không? Đoán, rồi thử.')}</li>
<li>${t('The hooks only work after each member runs one config line. How do you make sure all five did it?', 'Hook chỉ chạy sau khi mỗi thành viên chạy một dòng cấu hình. Làm sao chắc cả năm người đã chạy?')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<p>${t('2. Rejected twice over: the type must be lowercase (<code>Feat</code> ≠ <code>feat</code>) and the description "form" has only 4 characters (the rule wants at least 5). This is intended — consistent messages make history and CT Work links searchable.', '2. Bị chặn vì hai lý do: loại phải viết thường (<code>Feat</code> ≠ <code>feat</code>) và mô tả "form" chỉ có 4 ký tự (luật đòi ít nhất 5). Cố ý như vậy — lời nhắn thống nhất thì lịch sử và liên kết trên CT Work mới tìm được.')}</p>
<p>${t('3. You cannot fully — which is why the server-side lock exists. Practical steps: put the command in the README "first-time setup", add an npm/Maven script that runs it (for Node, a <code>prepare</code> script in <code>package.json</code> runs on <code>npm install</code>), and rely on branch protection + CI as the real gate.', '3. Không thể chắc tuyệt đối — đó là lý do có ổ khoá phía máy chủ. Cách thực tế: đưa lệnh vào mục "thiết lập lần đầu" của README, thêm một script npm/Maven tự chạy nó (với Node, script <code>prepare</code> trong <code>package.json</code> tự chạy khi <code>npm install</code>), và coi bảo vệ nhánh + CI mới là cổng thật.')}</p>`)}

<h3>🛠 ${t('Project milestone — Section 0', 'Mốc dự án — Mục 0')}</h3>
<ul>
<li>${t('RACI passing the checker (lesson 0.1), pinned.', 'RACI qua bộ kiểm (bài 0.1), đã ghim.')}</li>
<li>${t('Day-one checklist items 1–8 done; screenshot of a rejected direct push to <code>main</code> from the <em>server</em>.', 'Xong 8 việc của checklist ngày đầu; ảnh chụp một lần push thẳng lên <code>main</code> bị <em>máy chủ</em> từ chối.')}</li>
<li>${t('Your team health script run on your repo at the end of week 1, result pasted in the chat.', 'Chạy script sức khoẻ nhóm (bài 0.8) trên repo của nhóm cuối tuần 1, dán kết quả vào nhóm chat.')}</li>
</ul>
<p><strong>${t('Done when', 'Đạt khi')}</strong>: ${t('every member has made at least one commit with a ticket key that shows on its CT Work card.', 'mọi thành viên có ít nhất một commit mang mã ticket và commit đó hiện trên thẻ CT Work tương ứng.')}</p>

${phongVan([
    [t('"What tools did your team use, and how?"', '"Nhóm bạn dùng công cụ gì, dùng thế nào?"'), t('Name each tool with its purpose and one rule: GitHub with protected main and PR reviews; CT Work for backlog and sprints, ticket keys in branch names so cards link to code; chat only for quick questions, decisions copied into tickets.', 'Nêu từng công cụ kèm mục đích và một luật: GitHub có main được bảo vệ và review PR; CT Work cho backlog và sprint, mã thẻ trong tên nhánh để thẻ nối với code; chat chỉ cho câu hỏi nhanh, quyết định chép vào ticket.')],
    [t('"Can a Git hook guarantee commit conventions?"', '"Git hook có bảo đảm được quy ước commit không?"'), t('No — client hooks can be skipped with --no-verify and must be installed per machine. Enforcement belongs on the server: branch protection, required reviews, CI checks (e.g. a commit-lint job).', 'Không — hook phía máy bỏ qua được bằng --no-verify và phải cài trên từng máy. Việc ép luật thuộc về máy chủ: bảo vệ nhánh, bắt buộc review, kiểm tra CI (ví dụ một job commit-lint).')],
    [t('"A teammate pasted the database password in the group chat. What do you do?"', '"Một bạn dán mật khẩu CSDL vào nhóm chat. Bạn làm gì?"'), t('Treat it as leaked: change the password, delete the message, move secrets to .env (ignored) with a .env.example, and agree a rule for sharing secrets. No blame — fix the process.', 'Coi như đã lộ: đổi mật khẩu, xoá tin, chuyển bí mật vào .env (bị ignore) kèm .env.example, thống nhất luật chia sẻ bí mật. Không trách — sửa quy trình.')],
  ], en)}

${thuatNgu([
    [t('single source of truth', 'single source of truth (một nguồn sự thật)'), t('Each kind of information lives in exactly one agreed place.', 'Mỗi loại thông tin nằm ở đúng một chỗ đã thống nhất.')],
    [t('ticket key', 'ticket key (mã thẻ)'), t('Project key + number (LF-23) used in branch, commit and PR names.', 'Mã dự án + số (LF-23), dùng trong tên nhánh, commit, PR.')],
    ['Git hook', t('Script Git runs at a moment such as commit-msg or pre-push.', 'Script Git chạy vào một thời điểm như commit-msg hay pre-push.')],
    ['core.hooksPath', t('Config telling Git to take hooks from a committed folder.', 'Cấu hình bảo Git lấy hook từ một thư mục có commit.')],
    ['branch protection', t('Server rules on a branch: PR required, approvals, CI, no force-push.', 'Luật máy chủ cho một nhánh: bắt buộc PR, người duyệt, CI, cấm force-push.')],
    ['CODEOWNERS', t('File mapping paths to reviewers who are requested automatically.', 'Tệp gán đường dẫn cho người review được mời tự động.')],
    ['webhook', t('The repo host calling a URL on every event (how CT Work sees commits).', 'Máy chủ repo gọi một URL mỗi khi có sự kiện (cách CT Work thấy commit).')],
  ], en)}

${tomTat([
    t('Git/GitHub for code and reviews, CT Work for work, chat for quick talk, docs for documents — one home each.', 'Git/GitHub cho code và review, CT Work cho công việc, chat cho trao đổi nhanh, tài liệu cho văn bản — mỗi thứ một chỗ.'),
    t('No ticket, no work; decisions copied into tickets; ticket key in every branch, commit and PR.', 'Không ticket không làm; quyết định chép vào ticket; mã thẻ trong mọi nhánh, commit, PR.'),
    t('Shared hooks via core.hooksPath remind; branch protection and CI enforce.', 'Hook dùng chung qua core.hooksPath để nhắc; bảo vệ nhánh và CI mới ép được.'),
    t('PR template and CODEOWNERS make every review start with the same information and the right reviewer.', 'Mẫu PR và CODEOWNERS làm mọi lần review bắt đầu với cùng thông tin và đúng người review.'),
    t('Secrets never go in chat or Git history; .env ignored, .env.example committed.', 'Bí mật không bao giờ vào chat hay lịch sử Git; .env bị ignore, .env.example được commit.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-1-1-agile', t('Chapter 1 — Agile values, without the buzzwords', 'Chương 1 — Giá trị Agile, không sáo rỗng'))}.</p>
`);
};

export default {
  title: '0.2 — The toolbox: Git, GitHub, CT Work/Jira, chat|||0.2 — Bộ công cụ: Git, GitHub, CT Work/Jira, chat',
  slug: 'agl-0-2-cong-cu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mỗi loại thông tin một chỗ ở (Git, GitHub/GitLab, CT Work, chat, tài liệu, họp), ba luật nhóm, checklist thiết lập ngày đầu cho nhóm 5 người, hook dùng chung chặn commit thiếu mã thẻ và push thẳng main (chạy thật), mẫu PR, CODEOWNERS, bí mật không vào chat.',
  content: L02(true) + L02(false),
};
