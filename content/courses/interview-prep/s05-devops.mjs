/**
 * IT Interview Prep — Chương 5: Vòng kỹ thuật DevOps (soạn 15/11/2026, nhánh B).
 * Git · Docker · CI/CD · Linux, mạng, cloud · lab mock 45 phút (chẩn đoán sự cố) · quiz.
 * Câu hỏi viết MỘT lần dạng song ngữ rồi in hai lần qua qs('en'|'vi', …).
 * Output ghi "minh hoạ" là dựng lại theo sự cố thật để luyện đọc, không phải log gốc.
 * LUẬT: backtick → &#96;; không viết "${" trong chữ; < > & trong chữ → &lt; &gt; &amp;; không gạch chéo ngược.
 */
import { ma, ra, lienKet, nguon, yt, flow, stack, kv, bang, bay, keXau, doiThuong, neu, qa, thucHanh, thuatNgu, tomTat, lienQuan, rubric, cau } from './_pv.mjs';

const qs = (L, arr) => arr.map((x) => {
  const i = L === 'en' ? 0 : 1;
  return qa(L, { so: x.so, q: x.q[i], chu: x.chu ? x.chu[i] : '', a: x.a[i], sau: x.sau ? x.sau[i] : [], loi: x.loi ? x.loi[i] : '' });
}).join('\n');

/** Khung trả lời câu hỏi vận hành: triệu chứng → giả thuyết → bằng chứng → sửa → chặn tái diễn. */
const khungSuCo = (L) => L === 'en' ? flow([
  ['1 · Symptom', 'what exactly is observed', 'Status code, error text, since when, for whom. Never start from a guess.'],
  ['2 · Hypotheses', 'two or three, cheapest to check first', 'Say them out loud — interviewers grade the order you check things in.'],
  ['3 · Evidence', 'one command per hypothesis', 'docker ps, logs, df -h, curl -w … — each result kills or confirms one hypothesis.'],
  ['4 · Fix', 'smallest change that restores service', 'Rollback first if users are affected; investigate after.'],
  ['5 · Prevent', 'a check so it cannot recur silently', 'A test, a smoke check, an alert, a gate in the pipeline.'],
]) : flow([
  ['1 · Triệu chứng', 'chính xác thấy gì', 'Mã trạng thái, chữ báo lỗi, từ khi nào, với ai. Không bao giờ bắt đầu từ một phỏng đoán.'],
  ['2 · Giả thuyết', 'hai ba cái, cái rẻ nhất kiểm trước', 'Nói thành tiếng — người phỏng vấn chấm cả thứ tự bạn kiểm.'],
  ['3 · Bằng chứng', 'mỗi giả thuyết một lệnh', 'docker ps, logs, df -h, curl -w … — mỗi kết quả loại hoặc xác nhận một giả thuyết.'],
  ['4 · Sửa', 'thay đổi nhỏ nhất để dịch vụ chạy lại', 'Người dùng đang bị ảnh hưởng thì quay lui trước; điều tra sau.'],
  ['5 · Chặn tái diễn', 'một chốt kiểm để nó không lặp lại trong im lặng', 'Một test, một smoke check, một cảnh báo, một cổng trong pipeline.'],
]);

/* ═══════════════════════ 5.1 — Git ═══════════════════════ */
const GIT_CUU = `
# Lỡ "git reset --hard" mất commit: reflog nhớ mọi chỗ HEAD từng đứng
git reflog
#   a1b2c3d HEAD@{0}: reset: moving to HEAD~3
#   9f8e7d6 HEAD@{1}: commit: feat(booking): kiểm trùng lịch      <- commit "đã mất"
git branch cuu-ho 9f8e7d6          # đặt nhánh lên đó, xong

# Hoàn tác một commit ĐÃ push lên nhánh chung: revert (tạo commit đảo ngược), không reset
git revert 4e5f6a7
git push

# Tìm commit làm hỏng bằng tìm kiếm nhị phân
git bisect start
git bisect bad                     # bản hiện tại hỏng
git bisect good v1.2.0             # bản này còn tốt
#   ... Git checkout từng điểm giữa, bạn chạy test rồi báo good / bad ...
git bisect reset
`;

const QGIT = [
  {
    so: '5.1-1',
    q: ['Merge vs rebase — what is the difference, and when do you use each?', 'Merge và rebase khác nhau thế nào, và khi nào dùng cái nào?'],
    chu: ['The most common Git question; they want the golden rule.', 'Câu Git hay gặp nhất; họ muốn nghe luật vàng.'],
    a: [
      '<p><strong>Merge</strong> joins two histories with a merge commit; nothing existing is rewritten, so it is always safe on shared branches, but the history shows every branch and merge. <strong>Rebase</strong> replays your commits on top of another branch, creating <em>new</em> commits with new hashes; the history is linear and easier to read. Golden rule: <strong>never rebase commits that others already have</strong> (a pushed shared branch) — their copies would conflict with your rewritten ones. In practice: rebase your own feature branch on the latest main before opening a pull request (<code>git pull --rebase</code>), merge (or squash-merge) the PR into main.</p>',
      '<p><strong>Merge</strong> nối hai lịch sử bằng một merge commit; không gì có sẵn bị viết lại, nên luôn an toàn trên nhánh dùng chung, nhưng lịch sử hiện ra mọi nhánh và mọi lần merge. <strong>Rebase</strong> phát lại các commit của bạn lên đỉnh một nhánh khác, tạo ra commit <em>mới</em> với mã băm mới; lịch sử thẳng và dễ đọc hơn. Luật vàng: <strong>không bao giờ rebase những commit người khác đã có</strong> (một nhánh dùng chung đã push) — bản của họ sẽ xung đột với bản bạn vừa viết lại. Thực tế: rebase nhánh tính năng của riêng mình lên main mới nhất trước khi mở pull request (<code>git pull --rebase</code>), rồi merge (hoặc squash-merge) PR vào main.</p>',
    ],
    sau: [['What does a fast-forward merge mean?', 'What is squash merging and what does it lose?'], ['Fast-forward merge nghĩa là gì?', 'Squash merge là gì và nó làm mất gì?']],
    loi: ['"Rebase is better because the history is cleaner" — without the rule about shared commits.', '"Rebase tốt hơn vì lịch sử sạch hơn" — mà không có luật về commit dùng chung.'],
  },
  {
    so: '5.1-2',
    q: ['You pushed a bad commit to main. How do you undo it? What do reset --soft, --mixed and --hard do?', 'Bạn đã push một commit hỏng lên main. Hoàn tác thế nào? reset --soft, --mixed và --hard làm gì?'],
    chu: ['Knowing the safe undo on shared history.', 'Biết cách hoàn tác an toàn trên lịch sử dùng chung.'],
    a: [
      '<p>On a shared branch, use <strong><code>git revert &lt;sha&gt;</code></strong>: it adds a new commit that does the opposite, so nobody’s history is rewritten and it can be pushed normally. <code>git reset</code> moves the branch pointer back and is for <em>local, unpushed</em> work: <code>--soft</code> keeps the changes staged, <code>--mixed</code> (default) keeps them in the working directory unstaged, <code>--hard</code> throws them away. Reset plus force-push on main would break everyone else’s clone — many teams forbid force-push to main entirely. One more thing a senior would add: if the bad commit included a database migration, reverting the code does not revert the database.</p>',
      '<p>Trên nhánh dùng chung, dùng <strong><code>git revert &lt;sha&gt;</code></strong>: nó thêm một commit mới làm điều ngược lại, nên lịch sử của không ai bị viết lại và push bình thường được. <code>git reset</code> dời con trỏ nhánh lùi lại và dành cho việc <em>cục bộ, chưa push</em>: <code>--soft</code> giữ thay đổi ở staging, <code>--mixed</code> (mặc định) giữ thay đổi trong thư mục làm việc nhưng bỏ staging, <code>--hard</code> vứt luôn. Reset rồi force-push lên main sẽ làm hỏng bản clone của mọi người — nhiều đội cấm hẳn force-push lên main. Một điều người có kinh nghiệm sẽ thêm: nếu commit hỏng có kèm migration CSDL, revert mã không revert được CSDL.</p>',
    ],
    sau: [['How would you undo a merge commit that is already on main?', 'What is --force-with-lease?'], ['Hoàn tác một merge commit đã nằm trên main thế nào?', '--force-with-lease là gì?']],
    loi: ['"git reset --hard and force push" on a shared branch.', '"git reset --hard rồi force push" trên nhánh dùng chung.'],
  },
  {
    so: '5.1-3',
    q: ['You ran git reset --hard and lost commits. Can you get them back?', 'Bạn lỡ chạy git reset --hard và mất commit. Lấy lại được không?'],
    chu: ['Calm, and knowing that Git rarely loses committed work.', 'Bình tĩnh, và biết rằng Git hiếm khi làm mất thứ đã commit.'],
    a: [
      '<p>Yes, if they were committed. <strong><code>git reflog</code></strong> records every position HEAD has been at, locally, for weeks by default. Find the line before the reset, then <code>git branch rescue &lt;sha&gt;</code> or <code>git reset --hard &lt;sha&gt;</code>. What cannot be recovered this way is work that was never committed or stashed — which is why small, frequent commits are a safety habit, not just tidiness.</p>',
      '<p>Được, nếu chúng đã được commit. <strong><code>git reflog</code></strong> ghi lại mọi vị trí HEAD từng đứng, ở máy cục bộ, mặc định trong nhiều tuần. Tìm dòng ngay trước lần reset, rồi <code>git branch rescue &lt;sha&gt;</code> hoặc <code>git reset --hard &lt;sha&gt;</code>. Thứ không lấy lại được bằng cách này là việc chưa bao giờ được commit hay stash — vì vậy commit nhỏ và thường xuyên là thói quen an toàn, không chỉ là cho gọn.</p>',
    ],
    sau: [['Is the reflog shared when you push?', 'What does git stash do, and where are stashes stored?'], ['Reflog có được chia sẻ khi push không?', 'git stash làm gì, và stash được lưu ở đâu?']],
    loi: ['"No, it is gone, I would rewrite it."', '"Không ạ, mất rồi, em viết lại."'],
  },
  {
    so: '5.1-4',
    q: ['How do you resolve a merge conflict?', 'Bạn giải quyết xung đột merge thế nào?'],
    chu: ['A calm, repeatable method — and communication with the teammate.', 'Một phương pháp bình tĩnh, lặp lại được — và việc trao đổi với đồng đội.'],
    a: [
      '<p><code>git status</code> lists the conflicted files. In each, Git marks the two versions between <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code> and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>. I read both sides and decide what the <em>combined</em> code should be — often neither side alone — remove the markers, <strong>run the build and tests</strong>, then <code>git add</code> and continue the merge or rebase. If I do not understand the other change, I ask its author instead of guessing. To reduce conflicts: small pull requests, pulling main often, and not reformatting whole files in a feature branch.</p>',
      '<p><code>git status</code> liệt kê các tệp xung đột. Trong mỗi tệp, Git đánh dấu hai phiên bản giữa <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code> và <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>. Em đọc cả hai phía và quyết định mã <em>kết hợp</em> phải là gì — thường không phải chỉ một phía — xoá các dấu, <strong>chạy build và test</strong>, rồi <code>git add</code> và tiếp tục merge hoặc rebase. Nếu không hiểu thay đổi của người kia, em hỏi tác giả thay vì đoán. Để bớt xung đột: pull request nhỏ, kéo main thường xuyên, và không định dạng lại cả tệp trong nhánh tính năng.</p>',
    ],
    sau: [['What do "ours" and "theirs" mean during a rebase?', 'How do you abort a merge in progress?'], ['"ours" và "theirs" nghĩa là gì khi đang rebase?', 'Huỷ một lần merge đang dở thế nào?']],
    loi: ['Accepting "my version" for every conflict to make the error go away.', 'Chọn "bản của mình" cho mọi xung đột cho hết báo lỗi.'],
  },
  {
    so: '5.1-5',
    q: ['You committed an API key and pushed it. What do you do?', 'Bạn lỡ commit một API key và đã push. Bạn làm gì?'],
    chu: ['Security priorities in the right order.', 'Ưu tiên bảo mật đúng thứ tự.'],
    a: [
      '<p><strong>First, revoke and rotate the key</strong> at the provider — assume it is already compromised; bots scan public repositories for keys within minutes. Then remove it from history (<code>git filter-repo</code> or BFG), force-push in coordination with the team, and ask everyone to re-clone. Then prevent recurrence: keep secrets in environment files listed in <code>.gitignore</code> (in my project the rule is that <code>.env</code> files are never committed), add secret scanning (GitHub push protection or a pre-commit hook), and keep an <code>.env.example</code> with names only.</p>',
      '<p><strong>Trước tiên, thu hồi và thay khoá</strong> ở nhà cung cấp — coi như nó đã bị lộ rồi; bot quét kho công khai tìm khoá chỉ trong vài phút. Rồi gỡ nó khỏi lịch sử (<code>git filter-repo</code> hoặc BFG), force-push sau khi thống nhất với đội, và nhờ mọi người clone lại. Rồi chặn tái diễn: giữ bí mật trong tệp môi trường có trong <code>.gitignore</code> (dự án của em có luật tệp <code>.env</code> không bao giờ được commit), thêm quét bí mật (push protection của GitHub hoặc hook pre-commit), và giữ một <code>.env.example</code> chỉ có tên biến.</p>',
    ],
    sau: [['Why is deleting the file in a new commit not enough?', 'What if the repository is private?'], ['Vì sao xoá tệp trong một commit mới là không đủ?', 'Nếu kho là private thì sao?']],
    loi: ['Rewriting history first and forgetting to rotate the key — the key stays valid in every clone and fork.', 'Viết lại lịch sử trước rồi quên thay khoá — khoá vẫn dùng được trong mọi bản clone và fork.'],
  },
  {
    so: '5.1-6',
    q: ['How does your team work with branches and pull requests?', 'Đội của bạn làm việc với nhánh và pull request thế nào?'],
    chu: ['Whether you have worked in a team process, e.g. on SWP391.', 'Bạn đã từng làm theo quy trình nhóm chưa, ví dụ ở SWP391.'],
    a: [
      '<p>A simple flow (GitHub flow, close to trunk-based): main is always deployable and protected — no direct pushes, at least one review, required checks green. Each task gets a short-lived branch named after the ticket (<code>feat/LF-42-booking-conflict</code>), small commits with clear messages, a pull request with a description and screenshots, a review, then squash-merge. Releases are tagged. In the team project we also linked commits to cards on the tracker by the card key, so the board showed which code belonged to which requirement.</p>',
      '<p>Một luồng đơn giản (GitHub flow, gần với trunk-based): main luôn deploy được và được bảo vệ — không push thẳng, ít nhất một người review, các bước kiểm bắt buộc phải xanh. Mỗi việc một nhánh sống ngắn đặt theo mã thẻ (<code>feat/LF-42-booking-conflict</code>), commit nhỏ có thông điệp rõ, một pull request có mô tả và ảnh chụp, một lượt review, rồi squash-merge. Bản phát hành được gắn tag. Trong dự án nhóm, bọn em còn nối commit với thẻ trên công cụ quản lý bằng mã thẻ, để board hiện được đoạn mã nào thuộc yêu cầu nào.</p>',
    ],
    sau: [['What makes a pull request easy to review?', 'Git-flow vs trunk-based?'], ['Điều gì làm một pull request dễ review?', 'Git-flow khác trunk-based thế nào?']],
    loi: ['"Everyone pushed to main" — honest, but then say what you would do differently.', '"Cả nhóm push thẳng lên main" — thật lòng, nhưng hãy nói thêm bạn sẽ làm khác thế nào.'],
  },
  {
    so: '5.1-7',
    q: ['git fetch vs git pull?', 'git fetch khác git pull thế nào?'],
    chu: ['The mental model of remotes.', 'Mô hình tư duy về remote.'],
    a: [
      '<p><code>git fetch</code> downloads new commits from the remote and updates the remote-tracking branches (<code>origin/main</code>) without touching your branch or files — safe at any time. <code>git pull</code> is fetch <em>plus</em> integrating into your current branch, by merge (default) or rebase (<code>--rebase</code> or <code>pull.rebase=true</code>). Fetching first lets you look (<code>git log HEAD..origin/main</code>) before you integrate.</p>',
      '<p><code>git fetch</code> tải commit mới từ remote và cập nhật các nhánh theo dõi remote (<code>origin/main</code>) mà không đụng nhánh hay tệp của bạn — an toàn bất cứ lúc nào. <code>git pull</code> là fetch <em>cộng</em> việc tích hợp vào nhánh hiện tại, bằng merge (mặc định) hoặc rebase (<code>--rebase</code> hay <code>pull.rebase=true</code>). Fetch trước cho phép bạn xem (<code>git log HEAD..origin/main</code>) trước khi tích hợp.</p>',
    ],
    sau: [['What is origin/main exactly?'], ['origin/main chính xác là gì?']],
    loi: ['"They are the same."', '"Hai cái như nhau."'],
  },
  {
    so: '5.1-8',
    q: ['A feature that worked last week is broken now, with 60 commits in between. How do you find the cause?', 'Một tính năng tuần trước còn chạy giờ hỏng, giữa chừng có 60 commit. Bạn tìm nguyên nhân thế nào?'],
    chu: ['A "to score points" question: systematic debugging with Git.', 'Câu "ghi điểm": gỡ lỗi có hệ thống bằng Git.'],
    a: [
      '<p><strong><code>git bisect</code></strong>: mark the current commit bad and a known-good commit (a tag from last week) good; Git checks out the midpoint, I test and answer good or bad, and it halves the range each time — about six steps for 60 commits. With a script that exits 0 or non-zero, <code>git bisect run</code> does it automatically. Then <code>git show</code> on the guilty commit, and <code>git log -S</code> or <code>git blame</code> to understand why that line changed.</p>',
      '<p><strong><code>git bisect</code></strong>: đánh dấu commit hiện tại là hỏng và một commit chắc chắn tốt (một tag tuần trước) là tốt; Git checkout điểm giữa, em kiểm rồi báo good hoặc bad, và nó chia đôi khoảng mỗi lần — khoảng sáu bước cho 60 commit. Có script trả mã 0 hoặc khác 0 thì <code>git bisect run</code> tự làm hết. Sau đó <code>git show</code> commit có tội, và <code>git log -S</code> hay <code>git blame</code> để hiểu vì sao dòng đó đổi.</p>',
    ],
    sau: [['What does git log -S do?'], ['git log -S làm gì?']],
    loi: ['"I read all 60 commits."', '"Em đọc hết 60 commit."'],
  },
];

const L51 = {
  title: '5.1 — Git questions: merge vs rebase, undo, reflog, conflicts, leaked secrets|||5.1 — Câu hỏi Git: merge và rebase, hoàn tác, reflog, xung đột, lộ bí mật',
  slug: 'pv-5-1-git',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám câu Git hay gặp: merge và rebase cùng luật vàng, hoàn tác commit đã push (revert) và ba kiểu reset, cứu commit bằng reflog, giải xung đột, xử lý API key lỡ commit theo đúng thứ tự, quy trình nhánh và pull request của nhóm, fetch và pull, tìm commit gây lỗi bằng bisect.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Git questions — showing you will not break the team’s repository</h2>
<p class="lead">Git questions in an internship interview are really one question: "if we give you write access tomorrow, will you damage anything?" A good answer shows three things — you know which commands rewrite history, you can recover from mistakes calmly, and you have worked inside a team flow with pull requests.</p>
${doiThuong('en', 'A shared branch is a group chat. Merge is replying to a message; revert is sending "ignore my last message"; rebase-and-force-push on a shared branch is secretly editing messages everyone has already read — their screens and yours no longer agree. The reflog is your phone’s recently-deleted folder: things you thought were gone are usually still there for a while.')}
${khungSuCo('en')}
<h3>The questions</h3>
${qs('en', QGIT.slice(0, 3))}
${ma('bash', GIT_CUU)}
${qs('en', QGIT.slice(3))}
${bay('en', 'answering with commands only.', '"I would use git revert" is half an answer. The interviewer is checking judgement: say <em>why</em> revert and not reset (shared history), and what you would tell the team. One sentence of reasoning turns a command into evidence.')}
${keXau('en', 'Leaked keys in public repositories are found by automated scanners quickly, and attackers use cloud keys to start expensive machines or read data. Private repositories are not safe storage either: every collaborator, every CI log and every fork carries the history. Treat a committed secret as compromised, always.')}
${thucHanh('en', { phut: '30–40', steps: [
  'In a throw-away repository, make three commits, run <code>git reset --hard HEAD~3</code>, then recover them with <code>git reflog</code>.',
  'Create a conflict on purpose (two branches edit the same line), resolve it, and write down the steps you took.',
  'Make a broken commit among ten good ones and find it with <code>git bisect</code>.',
  'Answer 5.1-1, 5.1-2 and 5.1-5 out loud, recorded, each with a reason, not only a command.',
], dat: 'you recovered the commits, resolved a conflict, found the broken commit with bisect, and your recordings explain the reasoning.' })}
${thuatNgu('en', [
  ['Merge / rebase', 'Join histories with a merge commit / replay commits on top of another branch.'],
  ['Revert', 'A new commit that undoes an earlier one — safe on shared branches.'],
  ['Reset (soft/mixed/hard)', 'Move the branch pointer back, keeping changes staged / unstaged / not at all.'],
  ['Reflog', 'A local log of every position HEAD has been at.'],
  ['Force push', 'Overwriting the remote branch with your history — dangerous on shared branches.'],
  ['Branch protection', 'Rules that block direct pushes and require reviews and checks.'],
  ['Bisect', 'Binary search through commits to find the one that introduced a bug.'],
])}
${tomTat('en', [
  'Rebase your own unpushed work; never rewrite commits others already have.',
  'Undo on shared branches with revert; reset is for local work.',
  'Committed work is almost never lost — the reflog remembers.',
  'Resolve conflicts by understanding both sides, then build and test before continuing.',
  'A leaked secret: rotate first, clean history second, prevent third.',
  'Describe a real team flow: protected main, short branches, pull requests, reviews, tags.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'git', bai: 'git-3-4-rebase-vs-merge', L: 'en', title: 'Git 3.4 — Rebase vs merge', sub: 'Replaying instead of joining, with diagrams.' }),
  lienKet({ khoa: 'git', bai: 'git-4-4-reflog', L: 'en', title: 'Git 4.4 — git reflog: nothing is ever really lost', sub: 'Question 5.1-3 practised.' }),
  lienKet({ khoa: 'git', bai: 'git-8-3-go-bi-mat', L: 'en', title: 'Git 8.3 — Removing a leaked secret from all of history', sub: 'Question 5.1-5 step by step.' }),
  yt('0chZFIZLR_0', 'ByteByteGo', 'Git MERGE vs REBASE: Everything You Need to Know', 5, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Câu hỏi Git — cho thấy bạn sẽ không làm hỏng kho mã của cả đội</h2>
<p class="lead">Câu hỏi Git trong phỏng vấn thực tập thật ra là một câu: "nếu ngày mai giao em quyền ghi, em có làm hỏng gì không?" Một câu trả lời tốt cho thấy ba điều — bạn biết lệnh nào viết lại lịch sử, bạn cứu được sai lầm một cách bình tĩnh, và bạn đã làm việc trong một quy trình nhóm có pull request.</p>
${doiThuong('vi', 'Một nhánh dùng chung là một nhóm chat. Merge là trả lời một tin nhắn; revert là gửi "bỏ qua tin trước của mình nhé"; rebase rồi force-push trên nhánh chung là lén sửa những tin mọi người đã đọc — màn hình của họ và của bạn không còn khớp nhau. Reflog là thư mục "đã xoá gần đây" của điện thoại: những thứ bạn tưởng mất thường vẫn còn ở đó một thời gian.')}
${khungSuCo('vi')}
<h3>Các câu hỏi</h3>
${qs('vi', QGIT.slice(0, 3))}
${ma('bash', GIT_CUU)}
${qs('vi', QGIT.slice(3))}
${bay('vi', 'trả lời chỉ bằng lệnh.', '"Em dùng git revert" mới là nửa câu trả lời. Người phỏng vấn đang kiểm óc phán đoán: hãy nói <em>vì sao</em> revert mà không reset (lịch sử dùng chung), và bạn sẽ báo gì cho đội. Một câu lý lẽ biến một câu lệnh thành bằng chứng.')}
${keXau('vi', 'Khoá bị lộ trên kho công khai bị máy quét tự động tìm ra rất nhanh, và kẻ tấn công dùng khoá cloud để bật máy đắt tiền hoặc đọc dữ liệu. Kho private cũng không phải chỗ cất an toàn: mọi cộng tác viên, mọi log CI và mọi bản fork đều mang theo lịch sử. Luôn coi một bí mật đã commit là đã bị lộ.')}
${thucHanh('vi', { phut: '30–40', steps: [
  'Trong một kho thử, tạo ba commit, chạy <code>git reset --hard HEAD~3</code>, rồi cứu chúng bằng <code>git reflog</code>.',
  'Cố ý tạo xung đột (hai nhánh sửa cùng một dòng), giải quyết nó, và ghi lại các bước bạn đã làm.',
  'Chèn một commit hỏng giữa mười commit tốt và tìm ra nó bằng <code>git bisect</code>.',
  'Trả lời thành tiếng câu 5.1-1, 5.1-2 và 5.1-5, có ghi âm, mỗi câu có lý do, không chỉ có lệnh.',
], dat: 'bạn đã cứu được commit, giải được xung đột, tìm được commit hỏng bằng bisect, và bản ghi âm giải thích được lý lẽ.' })}
${thuatNgu('vi', [
  ['Merge / rebase', 'Nối lịch sử bằng merge commit / phát lại commit lên đỉnh nhánh khác.'],
  ['Revert', 'Một commit mới đảo ngược commit cũ — an toàn trên nhánh dùng chung.'],
  ['Reset (soft/mixed/hard)', 'Dời con trỏ nhánh lùi, giữ thay đổi ở staging / ngoài staging / bỏ hẳn.'],
  ['Reflog', 'Nhật ký cục bộ của mọi vị trí HEAD từng đứng.'],
  ['Force push', 'Ghi đè nhánh trên remote bằng lịch sử của bạn — nguy hiểm trên nhánh dùng chung.'],
  ['Branch protection (bảo vệ nhánh)', 'Luật chặn push thẳng, bắt buộc review và các bước kiểm.'],
  ['Bisect', 'Tìm kiếm nhị phân qua các commit để ra commit gây lỗi.'],
])}
${tomTat('vi', [
  'Rebase việc riêng chưa push của mình; không bao giờ viết lại commit người khác đã có.',
  'Hoàn tác trên nhánh chung bằng revert; reset dành cho việc cục bộ.',
  'Thứ đã commit gần như không bao giờ mất — reflog nhớ hết.',
  'Giải xung đột bằng cách hiểu cả hai phía, rồi build và test trước khi đi tiếp.',
  'Lộ bí mật: thay khoá trước, dọn lịch sử sau, chặn tái diễn cuối cùng.',
  'Mô tả một quy trình nhóm thật: main được bảo vệ, nhánh ngắn, pull request, review, tag.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'git', bai: 'git-3-4-rebase-vs-merge', title: 'Git 3.4 — Rebase và merge', sub: 'Phát lại thay vì nối, có sơ đồ.' }),
  lienKet({ khoa: 'git', bai: 'git-4-4-reflog', title: 'Git 4.4 — git reflog: không gì thật sự mất', sub: 'Luyện câu 5.1-3.' }),
  lienKet({ khoa: 'git', bai: 'git-8-3-go-bi-mat', title: 'Git 8.3 — Gỡ một bí mật bị lộ khỏi toàn bộ lịch sử', sub: 'Câu 5.1-5 từng bước.' }),
  yt('0chZFIZLR_0', 'ByteByteGo', 'Git MERGE vs REBASE: Everything You Need to Know', 5),
])}
</div>
`,
};

/* ═══════════════════════ 5.2 — Docker ═══════════════════════ */
const DOCKERFILE = `
# ---- giai đoạn 1: build (có đủ công cụ biên dịch) ----
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./      # chỉ manifest ⇒ tầng npm ci được cache khi mã đổi
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

# ---- giai đoạn 2: chạy (chỉ thứ cần để chạy) ----
FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
USER node                                   # không chạy bằng root
EXPOSE 4000
CMD ["node", "dist/index.js"]               # dạng exec ⇒ node là PID 1, nhận SIGTERM
`;

const DOCKER_CHAN_DOAN = `
docker ps -a --format 'table {{.Names}}	{{.Status}}'
#   NAMES        STATUS
#   app_backend  Restarting (1) 4 seconds ago          (minh hoạ)
docker logs --tail 20 app_backend
#   Error: ... could not locate the Query Engine for runtime "linux-musl" ...   (minh hoạ)
docker inspect app_backend --format '{{.State.ExitCode}} {{.State.OOMKilled}}'
#   137 true   ⇒ bị giết vì vượt giới hạn RAM (exit 137 = 128 + 9, SIGKILL)
docker system df          # ảnh, container, volume, build cache chiếm bao nhiêu đĩa
`;

const QDOCKER = [
  {
    so: '5.2-1',
    q: ['Image vs container? Container vs virtual machine?', 'Image khác container thế nào? Container khác máy ảo thế nào?'],
    chu: ['The basic mental model — with the kernel point that most candidates miss.', 'Mô hình tư duy cơ bản — kèm ý về kernel mà phần lớn ứng viên bỏ sót.'],
    a: [
      '<p>An <strong>image</strong> is a read-only template: a stack of filesystem layers plus metadata (command, environment, ports). A <strong>container</strong> is a running instance of an image with its own thin writable layer — like a class and an object. A <strong>virtual machine</strong> runs a whole guest operating system with its own kernel on a hypervisor; a <strong>container</strong> is an ordinary process on the host’s kernel, isolated with <strong>namespaces</strong> (what it can see: processes, network, filesystem) and limited with <strong>cgroups</strong> (how much CPU and memory it may use). So containers start in milliseconds and are light, but they share the host kernel — weaker isolation than a VM. On a Mac, Docker Desktop actually runs a small Linux VM and the containers live inside it.</p>',
      '<p><strong>Image</strong> là một khuôn chỉ đọc: một chồng các tầng hệ thống tệp cộng siêu dữ liệu (lệnh chạy, biến môi trường, cổng). <strong>Container</strong> là một thể hiện đang chạy của image, có một tầng ghi mỏng của riêng nó — giống class và object. <strong>Máy ảo</strong> chạy cả một hệ điều hành khách với kernel riêng trên hypervisor; <strong>container</strong> là một tiến trình bình thường trên kernel của máy chủ, được cô lập bằng <strong>namespace</strong> (nó thấy được gì: tiến trình, mạng, hệ thống tệp) và giới hạn bằng <strong>cgroup</strong> (được dùng bao nhiêu CPU và RAM). Vì vậy container khởi động trong vài mili giây và nhẹ, nhưng dùng chung kernel máy chủ — cô lập yếu hơn máy ảo. Trên Mac, Docker Desktop thật ra chạy một máy ảo Linux nhỏ và container sống bên trong đó.</p>',
    ],
    sau: [['Why does a container built on an M1 Mac sometimes fail on an amd64 server?', 'What happens to files written inside a container when it is removed?'], ['Vì sao container build trên Mac M1 đôi khi chạy hỏng trên server amd64?', 'Tệp ghi bên trong container ra sao khi container bị xoá?']],
    loi: ['"A container is a lightweight VM." It is a process, not a machine.', '"Container là máy ảo nhẹ." Nó là một tiến trình, không phải một cái máy.'],
  },
  {
    so: '5.2-2',
    q: ['How do layers and the build cache work? How would you make a slow build fast?', 'Tầng ảnh và build cache hoạt động thế nào? Bạn làm một bản build chậm thành nhanh ra sao?'],
    chu: ['Practical Dockerfile skill.', 'Kỹ năng viết Dockerfile thực tế.'],
    a: [
      '<p>Each instruction (<code>RUN</code>, <code>COPY</code>, …) produces a layer. When rebuilding, Docker reuses a layer from cache if the instruction and its inputs are unchanged; the first changed layer and <strong>every layer after it</strong> are rebuilt. So order from least to most frequently changed: copy <code>package.json</code> and the lockfile, run <code>npm ci</code>, and only then <code>COPY . .</code> — editing source code then reuses the dependency layer. Also: a <code>.dockerignore</code> (no <code>node_modules</code>, <code>.git</code>, <code>.env</code> in the build context), BuildKit cache mounts for package downloads, and sharing cache with CI.</p>',
      '<p>Mỗi chỉ thị (<code>RUN</code>, <code>COPY</code>, …) sinh ra một tầng. Khi build lại, Docker dùng lại tầng trong cache nếu chỉ thị và đầu vào của nó không đổi; tầng đầu tiên thay đổi và <strong>mọi tầng sau nó</strong> đều phải build lại. Nên xếp từ ít đổi tới hay đổi: chép <code>package.json</code> và lockfile, chạy <code>npm ci</code>, rồi mới <code>COPY . .</code> — sửa mã nguồn khi đó vẫn dùng lại tầng thư viện. Thêm: một <code>.dockerignore</code> (không cho <code>node_modules</code>, <code>.git</code>, <code>.env</code> vào build context), cache mount của BuildKit cho việc tải gói, và chia sẻ cache với CI.</p>',
    ],
    sau: [['Why does deleting a file in a later layer not make the image smaller?', 'What is the build context?'], ['Vì sao xoá tệp ở tầng sau không làm image nhỏ đi?', 'Build context là gì?']],
    loi: ['<code>COPY . .</code> as the first line, then <code>RUN npm install</code> — every code change reinstalls everything.', '<code>COPY . .</code> ngay dòng đầu, rồi <code>RUN npm install</code> — mỗi lần sửa mã là cài lại tất cả.'],
  },
  {
    so: '5.2-3',
    q: ['What is a multi-stage build, and how do you choose a base image?', 'Multi-stage build là gì, và bạn chọn ảnh nền thế nào?'],
    chu: ['Small, safe images — and the Alpine trap, if you know it.', 'Ảnh nhỏ, an toàn — và cái bẫy Alpine, nếu bạn biết.'],
    a: [
      '<p>A multi-stage build uses one stage with compilers and dev dependencies to build, and copies only the result into a clean final stage: smaller image, fewer vulnerabilities, no build tools or source in production. For the base, pin a version (<code>node:22-bookworm-slim</code>, not <code>latest</code>), prefer slim images, and know that <strong>Alpine uses musl instead of glibc</strong>: native binaries built for glibc may not run on it.</p><p><strong>A real incident from my project:</strong> an image built on an Alpine (musl) base carried a Prisma query engine compiled for glibc. The build was green, the push was green, the swap was green — and the backend restarted in a loop: the API returned 502 for about seven minutes. Two lessons: the build had used the wrong Dockerfile, and "green build" does not mean "runnable image". We added a check that compares the base image’s libc with the engine <em>before</em> pushing.</p>',
      '<p>Multi-stage build dùng một giai đoạn có trình biên dịch và thư viện dev để build, rồi chỉ chép kết quả sang một giai đoạn cuối sạch sẽ: ảnh nhỏ hơn, ít lỗ hổng hơn, không có công cụ build hay mã nguồn trên production. Với ảnh nền, ghim phiên bản (<code>node:22-bookworm-slim</code>, không dùng <code>latest</code>), ưu tiên ảnh slim, và biết rằng <strong>Alpine dùng musl thay vì glibc</strong>: tệp nhị phân gốc build cho glibc có thể không chạy được trên nó.</p><p><strong>Sự cố thật trong dự án của em:</strong> một image dựng trên nền Alpine (musl) lại mang engine truy vấn Prisma biên dịch cho glibc. Build xanh, đẩy xanh, tráo xanh — và backend khởi động lại liên tục: API trả 502 khoảng bảy phút. Hai bài học: lần build đó đã dùng nhầm Dockerfile, và "build xanh" không có nghĩa là "image chạy được". Bọn em thêm một bước kiểm so libc của ảnh nền với engine <em>trước khi</em> đẩy.</p>',
    ],
    sau: [['What is distroless?', 'How would you have detected the broken image before users did?'], ['Distroless là gì?', 'Lẽ ra bạn phát hiện image hỏng trước người dùng bằng cách nào?']],
    loi: ['"Always use Alpine because it is smallest" — without knowing what musl breaks.', '"Luôn dùng Alpine vì nhỏ nhất" — mà không biết musl làm hỏng gì.'],
  },
  {
    so: '5.2-4',
    q: ['Volumes vs bind mounts. Why did my container lose its data?', 'Volume khác bind mount thế nào? Vì sao container của em mất dữ liệu?'],
    chu: ['Understanding the writable layer and persistence.', 'Hiểu tầng ghi và việc lưu bền dữ liệu.'],
    a: [
      '<p>Anything written into the container’s writable layer disappears when the container is removed (<code>docker compose down</code> then <code>up</code> creates new containers). Persist data outside: a <strong>named volume</strong> is managed by Docker (best for databases: <code>pgdata:/var/lib/postgresql/data</code>); a <strong>bind mount</strong> maps a host path into the container (good for config files and source code in development).</p><p>A subtle trap from my project: nginx’s config was a bind mount of a <em>single file</em>. Docker binds a single file by its <strong>inode</strong> at start-up. Our deploy replaced the file with <code>mv</code>, which points the path at a new inode — so the container kept reading the old file; <code>nginx -t</code> and reload both reported OK while nothing changed. The fix was to overwrite in place and to verify the checksum <em>from inside</em> the container.</p>',
      '<p>Mọi thứ ghi vào tầng ghi của container biến mất khi container bị xoá (<code>docker compose down</code> rồi <code>up</code> là tạo container mới). Hãy giữ dữ liệu ở bên ngoài: <strong>named volume</strong> do Docker quản lý (tốt nhất cho CSDL: <code>pgdata:/var/lib/postgresql/data</code>); <strong>bind mount</strong> ánh xạ một đường dẫn của máy chủ vào container (hợp với tệp cấu hình và mã nguồn khi dev).</p><p>Một cái bẫy tinh vi trong dự án của em: cấu hình nginx là bind mount một <em>tệp đơn</em>. Docker gắn tệp đơn theo <strong>inode</strong> lúc khởi động. Bước deploy của bọn em thay tệp bằng <code>mv</code>, khiến đường dẫn trỏ sang một inode mới — nên container vẫn đọc tệp cũ; <code>nginx -t</code> và reload đều báo OK trong khi chẳng có gì đổi. Cách sửa là ghi đè tại chỗ và kiểm checksum <em>từ bên trong</em> container.</p>',
    ],
    sau: [['How do you back up a database volume?', 'What does docker compose down -v do?'], ['Sao lưu một volume CSDL thế nào?', 'docker compose down -v làm gì?']],
    loi: ['Storing uploaded files or database data inside the container and being surprised after a redeploy.', 'Lưu tệp tải lên hay dữ liệu CSDL bên trong container rồi ngạc nhiên sau một lần deploy lại.'],
  },
  {
    so: '5.2-5',
    q: ['Inside a container, why can my app not connect to the database on localhost:5432?', 'Trong container, vì sao ứng dụng của em không nối được CSDL ở localhost:5432?'],
    chu: ['Container networking basics — one of the most common real bugs.', 'Mạng container cơ bản — một trong những lỗi thật hay gặp nhất.'],
    a: [
      '<p>Each container has its own network namespace, so <code>localhost</code> inside the app container is the app container itself, not the host and not the database container. In Docker Compose, services on the same network reach each other <strong>by service name</strong> through Docker’s internal DNS: <code>postgres://db:5432</code>. To reach something on the host from Docker Desktop, use <code>host.docker.internal</code>. Also: <code>depends_on</code> only orders start-up; to wait until Postgres is actually ready, add a healthcheck and <code>condition: service_healthy</code>.</p><p>A security point: publishing a port (<code>-p 6379:6379</code>) binds it on all interfaces, and Docker writes firewall rules that can bypass a host firewall such as UFW. Publish only what must be public, and bind internal services to <code>127.0.0.1</code> or do not publish them at all.</p>',
      '<p>Mỗi container có namespace mạng riêng, nên <code>localhost</code> bên trong container ứng dụng chính là container ứng dụng, không phải máy chủ, cũng không phải container CSDL. Trong Docker Compose, các service cùng mạng gọi nhau <strong>bằng tên service</strong> qua DNS nội bộ của Docker: <code>postgres://db:5432</code>. Muốn gọi một thứ trên máy chủ từ Docker Desktop thì dùng <code>host.docker.internal</code>. Thêm nữa: <code>depends_on</code> chỉ sắp thứ tự khởi động; muốn chờ Postgres thật sự sẵn sàng thì thêm healthcheck và <code>condition: service_healthy</code>.</p><p>Một điểm bảo mật: công bố cổng (<code>-p 6379:6379</code>) là gắn nó trên mọi giao diện mạng, và Docker ghi luật tường lửa có thể đi vòng qua tường lửa máy chủ như UFW. Chỉ công bố thứ phải công khai, và gắn các dịch vụ nội bộ vào <code>127.0.0.1</code> hoặc không công bố chúng.</p>',
    ],
    sau: [['Why is the default bridge network a poor choice?', 'How would you debug DNS between containers?'], ['Vì sao mạng bridge mặc định là lựa chọn kém?', 'Gỡ lỗi DNS giữa các container thế nào?']],
    loi: ['"Open the port on the firewall" — the problem is not the firewall.', '"Mở cổng trên tường lửa" — vấn đề không nằm ở tường lửa.'],
  },
  {
    so: '5.2-6',
    q: ['A container keeps restarting and docker inspect shows exit code 137. What is going on?', 'Một container cứ khởi động lại và docker inspect báo mã thoát 137. Chuyện gì đang xảy ra?'],
    chu: ['Reading exit codes — real production skill.', 'Đọc mã thoát — kỹ năng production thật.'],
    a: [
      '<p>137 = 128 + 9: the process was killed with <strong>SIGKILL</strong>. The usual cause is running out of memory — the kernel’s OOM killer or the container’s memory limit; <code>docker inspect</code> shows <code>OOMKilled=true</code>. (It can also be <code>docker kill</code>, or a stop timeout that expired.) Check memory with <code>docker stats</code>, the limit, and what used the memory. In my project, parallel cold builds of the backend and the Next.js frontend on a 6 GB VPS got <code>next build</code> killed with 137; the fixes were building sequentially and, later, building on a bigger machine at home and only swapping images on the server. Exit code 1 would instead be the app’s own error — read the logs.</p>',
      '<p>137 = 128 + 9: tiến trình bị giết bằng <strong>SIGKILL</strong>. Nguyên nhân thường gặp là hết bộ nhớ — OOM killer của kernel hoặc giới hạn bộ nhớ của container; <code>docker inspect</code> báo <code>OOMKilled=true</code>. (Cũng có thể do <code>docker kill</code>, hoặc hạn chờ khi stop đã hết.) Kiểm bộ nhớ bằng <code>docker stats</code>, kiểm giới hạn, và xem cái gì đã ăn bộ nhớ. Trong dự án của em, build nguội song song backend và frontend Next.js trên VPS 6 GB làm <code>next build</code> bị giết với mã 137; cách sửa là build tuần tự và, về sau, build trên một máy mạnh hơn ở nhà và chỉ tráo image trên server. Còn mã thoát 1 thì là lỗi của chính ứng dụng — đọc log.</p>',
    ],
    sau: [['What does exit code 143 mean?', 'How do you set a memory limit in Compose?'], ['Mã thoát 143 nghĩa là gì?', 'Đặt giới hạn bộ nhớ trong Compose thế nào?']],
    loi: ['"Restart it and see" without reading the exit code or logs.', '"Khởi động lại xem sao" mà không đọc mã thoát hay log.'],
  },
  {
    so: '5.2-7',
    q: ['CMD vs ENTRYPOINT? Why does my container take 10 seconds to stop?', 'CMD khác ENTRYPOINT thế nào? Vì sao container của em mất 10 giây mới dừng?'],
    chu: ['PID 1 and signals — a detail that shows depth.', 'PID 1 và tín hiệu — chi tiết cho thấy độ sâu.'],
    a: [
      '<p><code>ENTRYPOINT</code> is the executable; <code>CMD</code> provides default arguments (or the whole command if there is no entrypoint), and arguments to <code>docker run</code> replace CMD. Use the <strong>exec form</strong> (<code>["node", "dist/index.js"]</code>): with the shell form (<code>CMD node dist/index.js</code>), a shell becomes PID 1, may not forward <code>SIGTERM</code> to Node, and Docker waits its 10-second timeout and then kills it. With exec form, Node is PID 1 and must handle SIGTERM itself to shut down gracefully (Lesson 4.1-6). <code>--init</code> or tini adds a tiny init that forwards signals and reaps zombies.</p>',
      '<p><code>ENTRYPOINT</code> là tệp thực thi; <code>CMD</code> cung cấp tham số mặc định (hoặc cả lệnh nếu không có entrypoint), và tham số của <code>docker run</code> thay thế CMD. Dùng <strong>dạng exec</strong> (<code>["node", "dist/index.js"]</code>): với dạng shell (<code>CMD node dist/index.js</code>), một shell trở thành PID 1, có thể không chuyển <code>SIGTERM</code> cho Node, và Docker chờ hết 10 giây rồi giết. Với dạng exec, Node là PID 1 và phải tự xử lý SIGTERM để tắt êm (bài 4.1-6). <code>--init</code> hoặc tini thêm một init rất nhỏ chuyển tín hiệu và dọn tiến trình zombie.</p>',
    ],
    sau: [['Why is PID 1 special in Linux?'], ['Vì sao PID 1 đặc biệt trong Linux?']],
    loi: ['"They are interchangeable."', '"Hai cái dùng thay nhau được."'],
  },
  {
    so: '5.2-8',
    q: ['The server disk is almost full and Postgres is at risk. Docker is involved. What do you do?', 'Đĩa server gần đầy và Postgres đang gặp nguy. Có dính tới Docker. Bạn làm gì?'],
    chu: ['A "to score points" operations question: safe clean-up, then prevention.', 'Câu vận hành "ghi điểm": dọn an toàn, rồi chặn tái diễn.'],
    a: [
      '<p>Measure first: <code>df -h</code> for the filesystem, <code>docker system df</code> for images, containers, volumes and <strong>build cache</strong>, and <code>du</code> on log directories. Clean the safe things — build cache (<code>docker builder prune</code>), dangling images, old container logs — and <strong>never prune volumes blindly</strong>: that is where database data lives. Then prevent: log rotation for container logs, regular clean-up, alerts at a disk threshold. In my project the build cache once grew to about 7.6 GB on the same disk as Postgres and a deploy died with "no space left on device"; the lasting fix was to stop building on the server at all — build images elsewhere, push them to a registry, and have the server only pull and swap.</p>',
      '<p>Đo trước: <code>df -h</code> cho hệ thống tệp, <code>docker system df</code> cho image, container, volume và <strong>build cache</strong>, và <code>du</code> trên các thư mục log. Dọn những thứ an toàn — build cache (<code>docker builder prune</code>), image treo, log container cũ — và <strong>không bao giờ prune volume một cách mù quáng</strong>: đó là nơi dữ liệu CSDL nằm. Rồi chặn tái diễn: xoay vòng log container, dọn định kỳ, cảnh báo khi đĩa vượt ngưỡng. Trong dự án của em, có lần build cache phình tới khoảng 7,6 GB trên đúng cái đĩa chứa Postgres và một lần deploy chết với "no space left on device"; cách sửa lâu dài là ngừng build trên server hẳn — build image ở chỗ khác, đẩy lên registry, và để server chỉ kéo về rồi tráo.</p>',
    ],
    sau: [['What is the difference between docker image prune and docker image prune -a?', 'How would you rotate container logs?'], ['docker image prune khác docker image prune -a thế nào?', 'Xoay vòng log container thế nào?']],
    loi: ['<code>docker system prune -a --volumes</code> on a production server.', '<code>docker system prune -a --volumes</code> trên server production.'],
  },
];

const L52 = {
  title: '5.2 — Docker questions: images, layers, the musl trap, volumes, networking, exit 137|||5.2 — Câu hỏi Docker: image, tầng, bẫy musl, volume, mạng, mã thoát 137',
  slug: 'pv-5-2-docker',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám câu Docker hay gặp, trả lời bằng sự cố thật của một hệ thống chạy Docker Compose trên VPS: image và container, container và máy ảo, tầng và cache, multi-stage và ảnh Alpine làm API 502 bảy phút, volume và bind mount tệp đơn theo inode, localhost trong container, mã thoát 137, CMD/ENTRYPOINT và PID 1, đĩa đầy vì build cache.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Docker questions — and the incidents that make your answers believable</h2>
<p class="lead">"Docker" on a student CV usually means "I ran docker compose up". Interviewers know that, so they ask one level deeper: what a container really is, why the build is slow, why data vanished, what exit code 137 means. If you have run containers in production, even a personal project, your incidents are the strongest answers you have.</p>
${doiThuong('en', 'An image is a frozen meal kit in the freezer: the same box gives the same dish every time. A container is one portion heated and on the table — you can add salt to it, but when you throw the plate away, the salt is gone; the kit in the freezer is unchanged. A volume is the fridge next to the table where you keep what must last.')}
${khungSuCo('en')}
<h3>The questions</h3>
${qs('en', QDOCKER.slice(0, 2))}
${ma('dockerfile', DOCKERFILE)}
${qs('en', QDOCKER.slice(2, 5))}
<h3>When containers misbehave</h3>
${ma('bash', DOCKER_CHAN_DOAN)}
${qs('en', QDOCKER.slice(5))}
${bang(['Exit code', 'Meaning', 'First check'], [
  ['0', 'exited normally', 'was it supposed to keep running? (wrong CMD)'],
  ['1', 'the app’s own error', 'docker logs'],
  ['137', 'SIGKILL (often out of memory)', 'OOMKilled in docker inspect, docker stats'],
  ['143', 'SIGTERM — stopped on request', 'normal on deploy / docker stop'],
  ['126 / 127', 'not executable / command not found', 'the CMD path, the architecture, missing binary'],
])}
${bay('en', 'claiming Docker experience you cannot debug.', 'If your only Docker experience is copying a compose file, say so and talk about what you understood from it. The follow-up "it restarts in a loop — what do you check?" exposes the difference in ten seconds. "docker ps, then logs, then inspect for the exit code" is the minimum honest answer.')}
${keXau('en', 'Container risks: running as root (an escape bug then gives root on the host), mounting the Docker socket into a container (equivalent to root on the host), secrets baked into image layers (anyone who pulls the image can read them with <code>docker history</code>), and published ports that bypass the host firewall. The fixes are <code>USER</code>, never mounting the socket casually, runtime secrets, and binding to 127.0.0.1.')}
${thucHanh('en', { phut: '40–50', steps: [
  'Build a small Node app twice with a bad Dockerfile (<code>COPY . .</code> first) and twice with the ordered one; change one source line between builds and compare the build times.',
  'Run Postgres without a volume, insert a row, <code>docker rm -f</code> and start it again — the row is gone. Repeat with a named volume.',
  'Run <code>docker run --rm -m 64m node:22-slim node -e "const a=[];while(1)a.push(Buffer.alloc(1e6))"</code> and read the exit code and <code>OOMKilled</code>.',
  'Answer 5.2-3, 5.2-4 and 5.2-6 out loud with your own incident or with one from this lesson, recorded.',
], dat: 'you measured the cache difference, reproduced data loss and its fix, and saw exit 137 with OOMKilled=true yourself.' })}
${thuatNgu('en', [
  ['Image / container', 'Read-only template / running instance with a writable layer.'],
  ['Layer', 'One step of the image filesystem, cached by instruction and inputs.'],
  ['Namespaces / cgroups', 'Kernel features for what a process can see / how much it can use.'],
  ['Multi-stage build', 'Build in one stage, copy only the result into a clean final stage.'],
  ['musl / glibc', 'Two C libraries; binaries built for one may not run on the other.'],
  ['Named volume / bind mount', 'Docker-managed storage / a host path mapped into the container.'],
  ['Exit code 137', 'Killed with SIGKILL, usually out of memory.'],
  ['PID 1', 'The first process in the container; it receives the stop signal.'],
])}
${tomTat('en', [
  'A container is a process with namespaces and cgroups on the host kernel, not a small VM.',
  'Order the Dockerfile from rarely to often changed; use .dockerignore and multi-stage builds.',
  'Pin base images and know the musl/glibc trap — a green build is not a runnable image.',
  'Data lives in volumes; single-file bind mounts follow the inode, not the path.',
  'Inside a container, localhost is the container; reach services by name.',
  'Read exit codes before acting: 137 means killed, usually out of memory; never prune volumes blindly.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'docker', bai: 'dk-1-1-container-la-gi', L: 'en', title: 'Docker 1.1 — What a container is actually made of', sub: 'Namespaces and cgroups, seen on a real Linux host.' }),
  lienKet({ khoa: 'docker', bai: 'dk-6-2-chon-anh-nen', L: 'en', title: 'Docker 6.2 — Choosing a base image, and the musl trap', sub: 'The incident in question 5.2-3, reproduced.' }),
  lienKet({ khoa: 'docker', bai: 'dk-11-2-han-muc-137', L: 'en', title: 'Docker 11.2 — Limits, and exit 137', sub: 'Question 5.2-6 measured.' }),
  yt('rIrNIzy6U_g', 'Fireship', '100+ Docker Concepts you Need to Know', 8, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Câu hỏi Docker — và những sự cố làm câu trả lời của bạn đáng tin</h2>
<p class="lead">"Docker" trên CV sinh viên thường có nghĩa là "em đã chạy docker compose up". Người phỏng vấn biết điều đó, nên họ hỏi sâu hơn một tầng: container thật ra là gì, vì sao build chậm, vì sao dữ liệu biến mất, mã thoát 137 nghĩa là gì. Nếu bạn từng chạy container trên production, kể cả dự án cá nhân, các sự cố của bạn là câu trả lời mạnh nhất bạn có.</p>
${doiThuong('vi', 'Image là một hộp đồ ăn chế biến sẵn trong ngăn đá: cùng một hộp lần nào cũng ra cùng một món. Container là một phần đã hâm nóng và bày trên bàn — bạn rắc thêm muối được, nhưng khi bỏ đĩa đi thì muối cũng mất; hộp trong ngăn đá không hề đổi. Volume là cái tủ lạnh cạnh bàn, nơi bạn cất những gì phải giữ lâu.')}
${khungSuCo('vi')}
<h3>Các câu hỏi</h3>
${qs('vi', QDOCKER.slice(0, 2))}
${ma('dockerfile', DOCKERFILE)}
${qs('vi', QDOCKER.slice(2, 5))}
<h3>Khi container trở chứng</h3>
${ma('bash', DOCKER_CHAN_DOAN)}
${qs('vi', QDOCKER.slice(5))}
${bang(['Mã thoát', 'Ý nghĩa', 'Kiểm gì trước'], [
  ['0', 'thoát bình thường', 'lẽ ra nó phải chạy mãi? (sai CMD)'],
  ['1', 'lỗi của chính ứng dụng', 'docker logs'],
  ['137', 'SIGKILL (thường do hết bộ nhớ)', 'OOMKilled trong docker inspect, docker stats'],
  ['143', 'SIGTERM — dừng theo yêu cầu', 'bình thường khi deploy / docker stop'],
  ['126 / 127', 'không thực thi được / không tìm thấy lệnh', 'đường dẫn CMD, kiến trúc CPU, thiếu tệp nhị phân'],
])}
${bay('vi', 'nhận là có kinh nghiệm Docker mà không gỡ lỗi được.', 'Nếu kinh nghiệm Docker duy nhất của bạn là chép một file compose, hãy nói thật và kể những gì bạn đã hiểu từ nó. Câu đào sâu "nó khởi động lại liên tục — em kiểm gì?" phơi ra khác biệt trong mười giây. "docker ps, rồi logs, rồi inspect xem mã thoát" là câu trả lời trung thực tối thiểu.')}
${keXau('vi', 'Rủi ro của container: chạy bằng root (khi đó một lỗi thoát container cho kẻ tấn công quyền root trên máy chủ), gắn Docker socket vào container (tương đương root trên máy chủ), bí mật bị nướng vào tầng image (ai kéo image về cũng đọc được bằng <code>docker history</code>), và cổng công bố đi vòng qua tường lửa máy chủ. Cách sửa: <code>USER</code>, không gắn socket tuỳ tiện, truyền bí mật lúc chạy, và gắn vào 127.0.0.1.')}
${thucHanh('vi', { phut: '40–50', steps: [
  'Build một ứng dụng Node nhỏ hai lần bằng Dockerfile tồi (<code>COPY . .</code> đầu tiên) và hai lần bằng bản đã sắp thứ tự; sửa một dòng mã giữa các lần build và so thời gian.',
  'Chạy Postgres không có volume, chèn một dòng, <code>docker rm -f</code> rồi chạy lại — dòng đó mất. Làm lại với một named volume.',
  'Chạy <code>docker run --rm -m 64m node:22-slim node -e "const a=[];while(1)a.push(Buffer.alloc(1e6))"</code> và đọc mã thoát cùng <code>OOMKilled</code>.',
  'Trả lời thành tiếng câu 5.2-3, 5.2-4 và 5.2-6 bằng sự cố của chính bạn hoặc một sự cố trong bài, có ghi âm.',
], dat: 'bạn tự đo được khác biệt của cache, tái hiện được việc mất dữ liệu và cách sửa, và tự thấy mã thoát 137 kèm OOMKilled=true.' })}
${thuatNgu('vi', [
  ['Image / container', 'Khuôn chỉ đọc / thể hiện đang chạy có tầng ghi.'],
  ['Layer (tầng)', 'Một bước của hệ thống tệp trong image, được cache theo chỉ thị và đầu vào.'],
  ['Namespace / cgroup', 'Tính năng kernel cho tiến trình thấy được gì / được dùng bao nhiêu.'],
  ['Multi-stage build (build nhiều giai đoạn)', 'Build ở một giai đoạn, chỉ chép kết quả sang giai đoạn cuối sạch.'],
  ['musl / glibc', 'Hai thư viện C; tệp nhị phân build cho cái này có thể không chạy trên cái kia.'],
  ['Named volume / bind mount', 'Kho lưu trữ do Docker quản lý / một đường dẫn máy chủ ánh xạ vào container.'],
  ['Exit code 137 (mã thoát 137)', 'Bị giết bằng SIGKILL, thường do hết bộ nhớ.'],
  ['PID 1', 'Tiến trình đầu tiên trong container; nó nhận tín hiệu dừng.'],
])}
${tomTat('vi', [
  'Container là một tiến trình có namespace và cgroup trên kernel máy chủ, không phải máy ảo thu nhỏ.',
  'Sắp Dockerfile từ ít đổi tới hay đổi; dùng .dockerignore và multi-stage build.',
  'Ghim ảnh nền và biết bẫy musl/glibc — build xanh không phải là image chạy được.',
  'Dữ liệu sống trong volume; bind mount tệp đơn đi theo inode, không theo đường dẫn.',
  'Trong container, localhost là chính container; gọi dịch vụ khác bằng tên.',
  'Đọc mã thoát trước khi hành động: 137 là bị giết, thường do hết bộ nhớ; không bao giờ prune volume một cách mù quáng.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'docker', bai: 'dk-1-1-container-la-gi', title: 'Docker 1.1 — Container thật ra làm bằng gì', sub: 'Namespace và cgroup, nhìn trên một máy Linux thật.' }),
  lienKet({ khoa: 'docker', bai: 'dk-6-2-chon-anh-nen', title: 'Docker 6.2 — Chọn ảnh nền, và cái bẫy musl', sub: 'Sự cố ở câu 5.2-3, tái hiện lại.' }),
  lienKet({ khoa: 'docker', bai: 'dk-11-2-han-muc-137', title: 'Docker 11.2 — Giới hạn tài nguyên, và mã thoát 137', sub: 'Câu 5.2-6 có số đo.' }),
  yt('rIrNIzy6U_g', 'Fireship', '100+ Docker Concepts you Need to Know', 8),
])}
</div>
`,
};

/* ═══════════════════════ 5.3 — CI/CD ═══════════════════════ */
const CI_YAML = `
name: CI
on:
  pull_request:
  push:
    branches: [main]
concurrency:
  group: ci-refs-heads-main-or-pr     # (minh hoạ) một lượt mỗi nhánh, lượt cũ bị huỷ
  cancel-in-progress: true
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:17
        env: { POSTGRES_PASSWORD: pw }
        ports: ['5432:5432']
        options: --health-cmd "pg_isready" --health-interval 5s --health-retries 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npx prisma migrate deploy
        env: { DATABASE_URL: postgresql://postgres:pw@localhost:5432/postgres }
      - run: npm test
        env: { DATABASE_URL: postgresql://postgres:pw@localhost:5432/postgres }
`;

const QCICD = [
  {
    so: '5.3-1',
    q: ['What is CI/CD? Continuous delivery vs continuous deployment?', 'CI/CD là gì? Continuous delivery khác continuous deployment thế nào?'],
    chu: ['Clear definitions plus the purpose.', 'Định nghĩa rõ cộng với mục đích.'],
    a: [
      '<p><strong>Continuous integration</strong>: every change is merged often into the main branch and automatically built and tested, so integration problems show up within minutes, not at the end of the sprint. <strong>Continuous delivery</strong>: every change that passes is <em>ready</em> to release, and releasing is a button or a command — a human decides when. <strong>Continuous deployment</strong>: every change that passes goes to production automatically. The purpose of all three is small, frequent, low-risk changes with fast feedback, instead of big painful releases.</p>',
      '<p><strong>Continuous integration (tích hợp liên tục)</strong>: mọi thay đổi được gộp thường xuyên vào nhánh chính và tự động build, test, để lỗi tích hợp lộ ra trong vài phút chứ không phải cuối sprint. <strong>Continuous delivery (chuyển giao liên tục)</strong>: mọi thay đổi đã qua kiểm đều <em>sẵn sàng</em> phát hành, và phát hành chỉ là một nút bấm hay một lệnh — con người quyết khi nào. <strong>Continuous deployment (triển khai liên tục)</strong>: mọi thay đổi đã qua kiểm tự động lên production. Mục đích của cả ba là các thay đổi nhỏ, thường xuyên, ít rủi ro với phản hồi nhanh, thay vì những lần phát hành lớn đau đớn.</p>',
    ],
    sau: [['Which of the two does your project use, and why?'], ['Dự án của bạn dùng kiểu nào, và vì sao?']],
    loi: ['"CI/CD is GitHub Actions." A tool is not the practice.', '"CI/CD là GitHub Actions." Công cụ không phải là cách làm.'],
  },
  {
    so: '5.3-2',
    q: ['Describe a CI pipeline you built or used.', 'Mô tả một pipeline CI bạn đã dựng hoặc đã dùng.'],
    chu: ['Concrete steps and why each one exists.', 'Các bước cụ thể và vì sao mỗi bước tồn tại.'],
    a: [
      '<p>On every pull request: check out, install with the lockfile (<code>npm ci</code>), type-check, lint, run migrations on a <strong>throw-away PostgreSQL service</strong>, run unit and integration tests, build the frontend. Each step is there because of a class of bug: type-check catches broken contracts, migrations on a fresh database catch migrations that cannot replay, the frontend build catches JSX errors that type-checking alone misses. The check is <strong>required</strong> on the protected branch, so a red pipeline blocks the merge. Dependencies are cached to keep it fast, and <code>concurrency</code> cancels outdated runs of the same branch.</p>',
      '<p>Ở mọi pull request: checkout, cài theo lockfile (<code>npm ci</code>), kiểm kiểu, lint, chạy migration trên một <strong>dịch vụ PostgreSQL dùng một lần</strong>, chạy unit và integration test, build frontend. Mỗi bước có mặt vì một loại lỗi: kiểm kiểu bắt hợp đồng bị gãy, migration trên CSDL mới tinh bắt migration không phát lại được, build frontend bắt lỗi JSX mà chỉ kiểm kiểu không thấy. Bước kiểm này là <strong>bắt buộc</strong> trên nhánh được bảo vệ, nên pipeline đỏ là chặn merge. Thư viện được cache cho nhanh, và <code>concurrency</code> huỷ các lượt chạy đã lỗi thời của cùng nhánh.</p>',
    ],
    sau: [['Why npm ci instead of npm install?', 'How do you keep a pipeline under ten minutes?'], ['Vì sao npm ci mà không npm install?', 'Giữ pipeline dưới mười phút thế nào?']],
    loi: ['Describing a pipeline that only runs "npm test" with no idea what the tests cover.', 'Mô tả pipeline chỉ chạy "npm test" mà không biết test phủ gì.'],
  },
  {
    so: '5.3-3',
    q: ['How do you handle secrets in CI/CD?', 'Bạn xử lý bí mật trong CI/CD thế nào?'],
    chu: ['Security reflexes in the pipeline.', 'Phản xạ bảo mật trong pipeline.'],
    a: [
      '<p>Secrets live in the platform’s secret store (GitHub Actions secrets or environments), never in the repository or workflow file. They are masked in logs — but masking only hides the exact stored string, so never print or transform secrets. Give each job the least permission it needs (<code>permissions:</code> on the token), prefer short-lived credentials via OIDC over long-lived cloud keys, do not expose secrets to workflows triggered by pull requests from forks, and pin third-party actions to a full commit SHA because a moving tag can be changed under you. When a new environment variable is added, someone must also add it to the CI secrets and the server environment — forgetting that is a common cause of failed deploys.</p>',
      '<p>Bí mật nằm trong kho bí mật của nền tảng (secrets hoặc environments của GitHub Actions), không bao giờ trong repo hay tệp workflow. Chúng được che trong log — nhưng việc che chỉ giấu đúng chuỗi đã lưu, nên đừng bao giờ in hay biến đổi bí mật. Cho mỗi job quyền tối thiểu nó cần (<code>permissions:</code> của token), ưu tiên thông tin xác thực sống ngắn qua OIDC thay vì khoá cloud sống lâu, không đưa bí mật cho workflow chạy từ pull request của fork, và ghim action bên thứ ba vào mã SHA đầy đủ vì một tag có thể bị dời sau lưng bạn. Khi thêm biến môi trường mới, ai đó phải thêm nó vào secrets của CI và môi trường server — quên bước đó là nguyên nhân hay gặp của deploy hỏng.</p>',
    ],
    sau: [['What is pull_request_target and why is it dangerous?', 'What would you do if a secret appeared in a log?'], ['pull_request_target là gì và vì sao nguy hiểm?', 'Thấy bí mật xuất hiện trong log thì bạn làm gì?']],
    loi: ['"The repository is private, so it is fine."', '"Kho private nên không sao."'],
  },
  {
    so: '5.3-4',
    q: ['Should a push to main deploy automatically? Tell me about a deploy problem you saw.', 'Push lên main có nên tự deploy không? Kể một sự cố deploy bạn từng gặp.'],
    chu: ['Judgement, and a story with a lesson — the "to score points" question of this lesson.', 'Óc phán đoán, và một câu chuyện có bài học — câu "ghi điểm" của bài này.'],
    a: [
      '<p>It can, for a mature team with good tests and safe rollouts. But it must be designed: <strong>one</strong> deploy at a time, the database migration ordered correctly relative to the new code, a health check before traffic switches, and a rollback path.</p><p><strong>From my project:</strong> two workflows deployed on every push to main and raced each other. One day the feed returned 500 because the new image was live before the schema had been migrated; another day a backend container was recreated twice concurrently and ended killed with orphan containers left behind. We made deploying a deliberate script instead of a side effect of pushing: the image is built once on a build machine, pushed to a registry, and the server only pulls and swaps it; migrations run, a smoke test calls the core routes, and the script pushes to main only after the required checks pass on a clean checkout of exactly the deployed commit. The lesson: pushing and deploying are different decisions, and concurrency in deploys must be controlled.</p>',
      '<p>Có thể, với một đội trưởng thành có test tốt và cách triển khai an toàn. Nhưng nó phải được thiết kế: <strong>mỗi lúc một</strong> lần deploy, migration CSDL được sắp đúng thứ tự so với mã mới, kiểm sức khoẻ trước khi chuyển lưu lượng, và có đường quay lui.</p><p><strong>Từ dự án của em:</strong> hai workflow cùng deploy mỗi khi push lên main và đua nhau. Có hôm feed trả 500 vì image mới đã chạy trước khi lược đồ được migrate; hôm khác một container backend bị tạo lại hai lần cùng lúc và kết thúc bị giết, để lại container mồ côi. Bọn em biến việc deploy thành một script chạy có chủ đích thay vì tác dụng phụ của việc push: image được build một lần trên máy build, đẩy lên registry, và server chỉ kéo về rồi tráo; migration chạy, một smoke test gọi các route cốt lõi, và script chỉ push lên main sau khi các bước kiểm bắt buộc qua trên một bản checkout sạch đúng commit đã deploy. Bài học: push và deploy là hai quyết định khác nhau, và tính đồng thời của deploy phải được kiểm soát.</p>',
    ],
    sau: [['What does a concurrency group do in GitHub Actions?', 'Migration first or code first — why?'], ['Concurrency group trong GitHub Actions làm gì?', 'Migration trước hay mã trước — vì sao?']],
    loi: ['A story that ends at "it broke" with no change made afterwards.', 'Một câu chuyện kết thúc ở "nó hỏng" mà không có thay đổi gì sau đó.'],
  },
  {
    so: '5.3-5',
    q: ['How do you roll back a bad deploy?', 'Bạn quay lui một lần deploy hỏng thế nào?'],
    chu: ['Whether rollback was designed before it was needed.', 'Đường quay lui có được thiết kế trước khi cần tới không.'],
    a: [
      '<p>Fastest: redeploy the <strong>previous image</strong>. That requires immutable tags — tag images by commit SHA, not only <code>latest</code> — and keeping the previous image available on the server or registry. In code terms: <code>git revert</code> the bad commit and deploy again; never force-push main to "roll back". The hard part is the <strong>database</strong>: reverting code does not revert a migration, so migrations should be backward-compatible (the old code still works with the new schema), and destructive changes (dropping a column) happen only in a later release. And practise it: a rollback path nobody has tried is a path that is broken.</p>',
      '<p>Nhanh nhất: deploy lại <strong>image trước đó</strong>. Muốn vậy cần tag bất biến — gắn tag image theo SHA của commit, không chỉ <code>latest</code> — và giữ image trước đó trên server hoặc registry. Về mã: <code>git revert</code> commit hỏng rồi deploy lại; không bao giờ force-push main để "quay lui". Phần khó là <strong>CSDL</strong>: revert mã không revert migration, nên migration phải tương thích ngược (mã cũ vẫn chạy được với lược đồ mới), và thay đổi phá huỷ (xoá cột) chỉ làm ở bản phát hành sau. Và hãy tập nó: một đường quay lui chưa ai thử là một đường đã hỏng.</p>',
    ],
    sau: [['Blue-green vs canary deployment?', 'How long would your rollback take today?'], ['Triển khai blue-green khác canary thế nào?', 'Quay lui hôm nay của bạn mất bao lâu?']],
    loi: ['"Fix forward quickly" as the only plan.', '"Sửa nhanh rồi deploy tiếp" là kế hoạch duy nhất.'],
  },
  {
    so: '5.3-6',
    q: ['The build is green but production is broken. How is that possible, and how do you catch it?', 'Build xanh mà production hỏng. Sao có thể như thế, và bắt nó thế nào?'],
    chu: ['Understanding that CI checks what it checks — nothing more.', 'Hiểu rằng CI chỉ kiểm đúng những gì nó kiểm — không hơn.'],
    a: [
      '<p>CI proves the code compiles and the tests pass in CI’s environment. Production can still break because of: a wrong or stale image actually running, a missing environment variable or secret on the server, a migration that did not run, a different libc or CPU architecture in the runtime image, a configuration file outside the image that was not updated, or a script that was never type-checked. Catch it <strong>after</strong> deploy with a <strong>smoke test</strong>: call core routes without auth and expect 401/200 — a 404 means the route is not in the running build. In my project, the post-deploy smoke test fails the deploy on any 404, after a stale build once served a version missing a whole route.</p>',
      '<p>CI chứng minh mã biên dịch được và test qua trong môi trường của CI. Production vẫn có thể hỏng vì: image đang chạy thật là bản sai hoặc bản cũ, thiếu biến môi trường hay bí mật trên server, một migration không chạy, libc hoặc kiến trúc CPU khác trong image chạy, một tệp cấu hình nằm ngoài image không được cập nhật, hoặc một script chưa bao giờ được kiểm kiểu. Bắt nó <strong>sau</strong> deploy bằng <strong>smoke test</strong>: gọi các route cốt lõi không kèm xác thực và mong 401/200 — 404 nghĩa là route không có trong bản đang chạy. Trong dự án của em, smoke test sau deploy làm hỏng cả lần deploy khi gặp bất kỳ 404 nào, sau lần một bản build cũ được phục vụ, thiếu hẳn một route.</p>',
    ],
    sau: [['What would you put in a smoke test, and what would you not?'], ['Bạn đặt gì vào smoke test, và không đặt gì?']],
    loi: ['"If CI is green, it works."', '"CI xanh là chạy được."'],
  },
  {
    so: '5.3-7',
    q: ['CI fails on your pull request in a part of the code you did not touch. What do you do?', 'CI đỏ ở pull request của bạn, tại phần mã bạn không hề đụng tới. Bạn làm gì?'],
    chu: ['Calm triage instead of blaming or retrying blindly.', 'Phân loại bình tĩnh thay vì đổ lỗi hay chạy lại mù quáng.'],
    a: [
      '<p>Read <em>which step</em> failed and the first error, then check whether my change can affect it (<code>git show --stat</code>; dependencies, shared config, generated code). Then check whether main is red too — the failure may already exist. If it fails only sometimes, treat it as flaky: rerun once to confirm, then report it with the log instead of silencing it. If it is caused by something outside my change, tell the team or the owner with the evidence; do not "fix" unrelated code in my PR without agreement.</p>',
      '<p>Đọc <em>bước nào</em> hỏng và lỗi đầu tiên, rồi kiểm xem thay đổi của mình có thể ảnh hưởng tới nó không (<code>git show --stat</code>; thư viện, cấu hình dùng chung, mã sinh tự động). Rồi kiểm main có đỏ luôn không — có thể lỗi đã có sẵn. Nếu lúc đỏ lúc xanh, coi là chập chờn: chạy lại một lần để xác nhận, rồi báo kèm log thay vì giấu nó đi. Nếu nguyên nhân nằm ngoài thay đổi của mình, báo đội hoặc người phụ trách kèm bằng chứng; không tự "sửa" mã không liên quan trong PR của mình khi chưa thống nhất.</p>',
    ],
    sau: [['How do you tell flaky from broken?'], ['Phân biệt chập chờn với hỏng thật thế nào?']],
    loi: ['Rerunning until green and merging.', 'Chạy lại tới khi xanh rồi merge.'],
  },
];

const L53 = {
  title: '5.3 — CI/CD questions: pipelines, secrets, push-to-deploy, rollback, smoke tests|||5.3 — Câu hỏi CI/CD: pipeline, bí mật, push là deploy, quay lui, smoke test',
  slug: 'pv-5-3-cicd',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bảy câu CI/CD hay gặp: CI, continuous delivery và deployment, mô tả một pipeline có PostgreSQL dùng một lần, bí mật trong pipeline, câu chuyện thật "hai workflow deploy đua nhau làm sập feed" và cách tách push khỏi deploy, quay lui image và CSDL, vì sao build xanh mà production hỏng và smoke test, xử lý CI đỏ ở chỗ mình không đụng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>CI/CD questions — the pipeline is a story about risk</h2>
<p class="lead">Interviewers rarely care which CI tool you used. They care whether you understand why each step exists, how secrets stay safe, and what happens when a deploy goes wrong. A student who can tell one real deploy incident and what changed afterwards sounds like a junior engineer, not a student.</p>
${doiThuong('en', 'CI/CD is the security check and boarding process at an airport. CI is the scanner every bag goes through, every time, automatically. Continuous delivery is a plane fuelled and ready at the gate; continuous deployment is a plane that takes off as soon as the last passenger sits down. A rollback is the plan for landing back safely — and you want it written before take-off, not invented in the air.')}
${khungSuCo('en')}
<h3>Pipelines</h3>
${qs('en', QCICD.slice(0, 2))}
${ma('yaml', CI_YAML)}
${qs('en', QCICD.slice(2, 3))}
<h3>Deploying, and when it goes wrong</h3>
${stack([
  ['Build once', 'one image per commit, tagged by its SHA, built on a machine with enough memory'],
  ['Push to a registry', 'the server never builds; it only pulls'],
  ['Migrate', 'backward-compatible migrations, applied before or with the new code'],
  ['Swap and smoke-test', 'core routes must return 401/200; any 404 fails the deploy'],
  ['Record', 'which SHA is live, so rollback knows where to go'],
])}
${qs('en', QCICD.slice(3))}
${bay('en', 'describing CI as "it runs the tests".', 'A good answer names what each step protects against, what is required before merge, and what happens after deploy. "Tests" without "on a fresh database", "required check" and "smoke test after the swap" is a beginner’s answer.')}
${keXau('en', 'CI pipelines are a favourite target: a malicious dependency or a compromised third-party action runs with the pipeline’s secrets. Real incidents have involved popular actions whose tags were moved to malicious code. Defences: pin actions to full SHAs, minimal token permissions, no secrets for untrusted pull requests, and review changes to workflow files as carefully as code.')}
${thucHanh('en', { phut: '40–60', steps: [
  'In a small repository, add the workflow above (adapt the commands), open a pull request, and make it fail on purpose with a type error; then fix it.',
  'Write down, for your own project, the deploy steps from build to "live", and mark where a rollback would start.',
  'Write a three-line smoke test (curl with <code>-w "%{http_code}"</code>) for three of your routes and the status each should return.',
  'Tell the 5.3-4 story — yours or this lesson’s — out loud in under two minutes, ending with what changed.',
], dat: 'a pull request shows a red then green required check, and you have a written deploy-and-rollback plan with a smoke test.' })}
${thuatNgu('en', [
  ['CI', 'Merging often, with automatic build and tests on every change.'],
  ['Continuous delivery / deployment', 'Always releasable, a human presses the button / released automatically.'],
  ['Required check', 'A CI job that must pass before a protected branch accepts a merge.'],
  ['Registry', 'A store of images (GHCR, Docker Hub) that servers pull from.'],
  ['Immutable tag', 'An image tag, such as the commit SHA, that never points to anything else.'],
  ['Smoke test', 'A few quick checks right after deploy that the system is basically alive.'],
  ['Rollback', 'Returning to the previous working version.'],
])}
${tomTat('en', [
  'CI = merge often with automatic checks; delivery = always releasable; deployment = released automatically.',
  'Every pipeline step should exist because of a class of bug — say which.',
  'Secrets stay in the secret store with minimal permissions; pin third-party actions.',
  'Pushing and deploying are different decisions; deploys need one-at-a-time control and ordered migrations.',
  'Roll back with SHA-tagged images and backward-compatible migrations — and practise it.',
  'Green CI is not a live system: smoke-test after every deploy.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'github-actions', bai: 'ga-9-1-push-de-deploy', L: 'en', title: 'GitHub Actions 9.1 — Push-to-deploy, and the two outages that ended it here', sub: 'The full story behind question 5.3-4.' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-10-1-build-cu', L: 'en', title: 'GitHub Actions 10.1 — Stale build, and 404 versus 401 as diagnosis', sub: 'Question 5.3-6 in depth.' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-10-2-seed-vo', L: 'en', title: 'GitHub Actions 10.2 — The seed that passed everything and broke prod', sub: 'A second green-build-broken-prod story.' }),
  yt('ddDJxFnv-qs', 'TechWorld with Nana', 'CI/CD Explained in 5 Minutes', 5, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Câu hỏi CI/CD — pipeline là một câu chuyện về rủi ro</h2>
<p class="lead">Người phỏng vấn hiếm khi quan tâm bạn đã dùng công cụ CI nào. Họ quan tâm bạn có hiểu vì sao mỗi bước tồn tại, bí mật được giữ an toàn ra sao, và chuyện gì xảy ra khi một lần deploy hỏng. Một sinh viên kể được một sự cố deploy thật và điều đã thay đổi sau đó nghe như một kỹ sư junior, không còn như sinh viên.</p>
${doiThuong('vi', 'CI/CD là khâu soi chiếu an ninh và lên máy bay ở sân bay. CI là máy soi mà mọi kiện hành lý đi qua, lần nào cũng thế, tự động. Continuous delivery là chiếc máy bay đã đổ đầy nhiên liệu chờ sẵn ở cửa; continuous deployment là chiếc máy bay cất cánh ngay khi hành khách cuối cùng ngồi xuống. Quay lui là kế hoạch hạ cánh trở lại an toàn — và bạn muốn nó được viết trước khi cất cánh, không phải nghĩ ra giữa trời.')}
${khungSuCo('vi')}
<h3>Pipeline</h3>
${qs('vi', QCICD.slice(0, 2))}
${ma('yaml', CI_YAML)}
${qs('vi', QCICD.slice(2, 3))}
<h3>Deploy, và khi nó hỏng</h3>
${stack([
  ['Build một lần', 'mỗi commit một image, gắn tag theo SHA, build trên máy đủ bộ nhớ'],
  ['Đẩy lên registry', 'server không bao giờ build; nó chỉ kéo về'],
  ['Migrate', 'migration tương thích ngược, áp trước hoặc cùng lúc với mã mới'],
  ['Tráo và smoke test', 'các route cốt lõi phải trả 401/200; gặp 404 là hỏng lần deploy'],
  ['Ghi lại', 'SHA nào đang chạy, để quay lui biết phải về đâu'],
])}
${qs('vi', QCICD.slice(3))}
${bay('vi', 'mô tả CI là "nó chạy test".', 'Một câu trả lời tốt nêu được mỗi bước chặn loại lỗi gì, cái gì bắt buộc trước khi merge, và chuyện gì xảy ra sau khi deploy. "Test" mà thiếu "trên CSDL mới tinh", "bước kiểm bắt buộc" và "smoke test sau khi tráo" là câu trả lời của người mới.')}
${keXau('vi', 'Pipeline CI là mục tiêu ưa thích: một thư viện độc hoặc một action bên thứ ba bị chiếm quyền sẽ chạy với bí mật của pipeline. Đã có sự cố thật với những action phổ biến bị dời tag sang mã độc. Cách phòng: ghim action vào SHA đầy đủ, quyền token tối thiểu, không đưa bí mật cho pull request không tin cậy, và review thay đổi ở tệp workflow kỹ như review mã.')}
${thucHanh('vi', { phut: '40–60', steps: [
  'Trong một kho nhỏ, thêm workflow ở trên (sửa lệnh cho hợp), mở pull request, và cố ý làm nó đỏ bằng một lỗi kiểu; rồi sửa.',
  'Viết ra, cho dự án của bạn, các bước deploy từ build tới "đang chạy", và đánh dấu chỗ một lần quay lui sẽ bắt đầu.',
  'Viết một smoke test ba dòng (curl với <code>-w "%{http_code}"</code>) cho ba route của bạn kèm mã trạng thái mỗi route phải trả.',
  'Kể câu chuyện 5.3-4 — của bạn hoặc của bài này — thành tiếng dưới hai phút, kết bằng điều đã thay đổi.',
], dat: 'một pull request hiện bước kiểm bắt buộc đỏ rồi xanh, và bạn có kế hoạch deploy + quay lui viết sẵn kèm smoke test.' })}
${thuatNgu('vi', [
  ['CI (tích hợp liên tục)', 'Gộp mã thường xuyên, tự động build và test ở mọi thay đổi.'],
  ['Continuous delivery / deployment', 'Luôn sẵn sàng phát hành, người bấm nút / tự động phát hành.'],
  ['Required check (bước kiểm bắt buộc)', 'Job CI phải qua thì nhánh được bảo vệ mới nhận merge.'],
  ['Registry (kho image)', 'Nơi chứa image (GHCR, Docker Hub) để server kéo về.'],
  ['Immutable tag (tag bất biến)', 'Tag image, như SHA của commit, không bao giờ trỏ sang thứ khác.'],
  ['Smoke test', 'Vài phép kiểm nhanh ngay sau deploy rằng hệ thống còn sống.'],
  ['Rollback (quay lui)', 'Trở về phiên bản chạy tốt trước đó.'],
])}
${tomTat('vi', [
  'CI = gộp thường xuyên có kiểm tự động; delivery = luôn phát hành được; deployment = tự phát hành.',
  'Mỗi bước pipeline phải tồn tại vì một loại lỗi — nói ra đó là loại nào.',
  'Bí mật ở trong kho bí mật với quyền tối thiểu; ghim action của bên thứ ba.',
  'Push và deploy là hai quyết định khác nhau; deploy cần kiểm soát mỗi lúc một lượt và migration đúng thứ tự.',
  'Quay lui bằng image gắn tag SHA và migration tương thích ngược — và tập nó.',
  'CI xanh không phải hệ thống đang sống: smoke test sau mỗi lần deploy.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'github-actions', bai: 'ga-9-1-push-de-deploy', title: 'GitHub Actions 9.1 — Push là deploy, và hai lần sập đã chấm dứt nó', sub: 'Toàn bộ câu chuyện đứng sau câu 5.3-4.' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-10-1-build-cu', title: 'GitHub Actions 10.1 — Bản build cũ, và 404 với 401 để chẩn đoán', sub: 'Câu 5.3-6 đi sâu.' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-10-2-seed-vo', title: 'GitHub Actions 10.2 — Seed qua mọi bước kiểm mà vẫn vỡ production', sub: 'Thêm một chuyện "build xanh, production hỏng".' }),
  yt('ddDJxFnv-qs', 'TechWorld with Nana', 'CI/CD Explained in 5 Minutes', 5),
])}
</div>
`,
};

/* ═══════════════════════ 5.4 — Linux, mạng và cloud ═══════════════════════ */
const LNX_LENH = `
# Ai đang giữ cổng 3000?
lsof -ti :3000            # in PID
ss -tlnp | grep 3000      # Linux: tiến trình đang nghe cổng
# Diệt THEO CỔNG, không theo tên: Next.js đổi tên tiến trình thành "next-server",
# nên pkill -f "next start" không khớp gì cả.
lsof -ti :3000 | xargs -r kill

# Máy chậm / đĩa đầy
uptime                    # load average 1, 5, 15 phút
free -m                   # RAM và swap
df -h                     # dung lượng từng hệ thống tệp
du -sh /var/lib/docker /var/log 2>/dev/null
journalctl -u nginx --since "10 min ago"

# Đo một request đi qua từng chặng
curl -s -o /dev/null -w "dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}" https://example.com/
`;

const QLNX = [
  {
    so: '5.4-1',
    q: ['What happens when you type a URL into the browser and press Enter?', 'Chuyện gì xảy ra khi bạn gõ một URL vào trình duyệt rồi nhấn Enter?'],
    chu: ['The classic open question — the depth you choose shows what you know.', 'Câu hỏi mở kinh điển — độ sâu bạn chọn cho thấy bạn biết gì.'],
    a: [
      '<ol><li><strong>DNS</strong>: the browser checks its cache, then the OS, then a recursive resolver, which asks root → TLD → the domain’s authoritative server and returns an IP (an A or AAAA record).</li><li><strong>TCP</strong>: a three-way handshake to port 443 (or QUIC over UDP for HTTP/3).</li><li><strong>TLS</strong>: the server presents a certificate for that name, the browser verifies the chain, and both agree on keys.</li><li><strong>HTTP request</strong>: method, path, headers, cookies.</li><li>On the server side — in a setup like mine — a <strong>CDN/proxy</strong> (Cloudflare) receives it, forwards to <strong>nginx</strong> on the server, which proxies to the <strong>app container</strong> (Next.js for pages, Express for <code>/api</code>), which queries <strong>PostgreSQL/Redis</strong>.</li><li>The <strong>response</strong> comes back; the browser parses HTML, fetches CSS/JS/images (often from the CDN), runs JavaScript and paints.</li></ol><p>Then offer to go deeper into any step — the interviewer will pick one.</p>',
      '<ol><li><strong>DNS</strong>: trình duyệt xem cache của nó, rồi của hệ điều hành, rồi hỏi một recursive resolver (máy phân giải đệ quy), máy này hỏi root → TLD → máy chủ có thẩm quyền của tên miền và trả về một IP (bản ghi A hoặc AAAA).</li><li><strong>TCP</strong>: bắt tay ba bước tới cổng 443 (hoặc QUIC trên UDP với HTTP/3).</li><li><strong>TLS</strong>: server đưa ra chứng chỉ cho đúng tên đó, trình duyệt kiểm chuỗi chứng chỉ, và hai bên thống nhất khoá.</li><li><strong>HTTP request</strong>: phương thức, đường dẫn, header, cookie.</li><li>Phía server — trong một hệ như của em — một <strong>CDN/proxy</strong> (Cloudflare) nhận nó, chuyển tới <strong>nginx</strong> trên server, nginx chuyển tiếp tới <strong>container ứng dụng</strong> (Next.js cho trang, Express cho <code>/api</code>), ứng dụng truy vấn <strong>PostgreSQL/Redis</strong>.</li><li><strong>Response</strong> quay về; trình duyệt phân tích HTML, tải CSS/JS/ảnh (thường từ CDN), chạy JavaScript và vẽ lên màn hình.</li></ol><p>Rồi đề nghị đi sâu vào bước bất kỳ — người phỏng vấn sẽ chọn một bước.</p>',
    ],
    sau: [['Why might a DNS change take hours to be seen?', 'What does the CDN cache, and what must it not cache?'], ['Vì sao một thay đổi DNS có thể mất vài giờ mới thấy?', 'CDN cache cái gì, và không được cache cái gì?']],
    loi: ['Ten minutes on one step and nothing on the rest — give the overview first, then go deep where asked.', 'Nói mười phút về một bước và bỏ trống phần còn lại — đưa bức tranh tổng trước, rồi đi sâu khi được hỏi.'],
  },
  {
    so: '5.4-2',
    q: ['Process vs thread? "Port 3000 is already in use" — how do you find and stop what holds it?', 'Tiến trình khác luồng thế nào? "Port 3000 is already in use" — bạn tìm và dừng thứ đang giữ nó ra sao?'],
    chu: ['Comfort on the command line.', 'Sự thoải mái với dòng lệnh.'],
    a: [
      '<p>A <strong>process</strong> is a running program with its own memory space; <strong>threads</strong> are paths of execution inside one process that share its memory — cheaper to create, but shared memory needs synchronisation. To find the holder of a port: <code>lsof -i :3000</code> or <code>ss -tlnp</code>, read the PID, then <code>kill &lt;PID&gt;</code> (SIGTERM) and only if it ignores that, <code>kill -9</code>. A real gotcha I hit: killing the Next.js server with <code>pkill -f "next start"</code> matched nothing, because Node renames the process to <code>next-server</code> — the old server kept the port and the new one died with EADDRINUSE. Killing <strong>by port</strong> is the reliable way.</p>',
      '<p><strong>Tiến trình</strong> là một chương trình đang chạy có vùng nhớ riêng; <strong>luồng</strong> là các mạch thực thi bên trong một tiến trình, dùng chung bộ nhớ của nó — tạo rẻ hơn, nhưng dùng chung bộ nhớ thì cần đồng bộ. Tìm thứ đang giữ cổng: <code>lsof -i :3000</code> hoặc <code>ss -tlnp</code>, đọc PID, rồi <code>kill &lt;PID&gt;</code> (SIGTERM), và chỉ khi nó lờ đi mới <code>kill -9</code>. Một cái bẫy thật em từng gặp: diệt server Next.js bằng <code>pkill -f "next start"</code> không khớp gì cả, vì Node đổi tên tiến trình thành <code>next-server</code> — server cũ vẫn giữ cổng và server mới chết với EADDRINUSE. Diệt <strong>theo cổng</strong> mới là cách chắc chắn.</p>',
    ],
    sau: [['What is a zombie process?', 'What is the difference between SIGINT, SIGTERM and SIGKILL?'], ['Tiến trình zombie là gì?', 'SIGINT, SIGTERM và SIGKILL khác nhau thế nào?']],
    loi: ['Going straight to <code>kill -9</code> — the program never gets the chance to clean up.', 'Dùng ngay <code>kill -9</code> — chương trình không có cơ hội dọn dẹp.'],
  },
  {
    so: '5.4-3',
    q: ['You get "Permission denied". How do you debug it?', 'Bạn gặp "Permission denied". Gỡ lỗi thế nào?'],
    chu: ['Understanding the permission model instead of reaching for chmod 777.', 'Hiểu mô hình quyền thay vì vớ ngay chmod 777.'],
    a: [
      '<p>Find out <em>who</em> is trying (<code>whoami</code>, or the user the service or container runs as) and <em>what</em> they are touching (<code>ls -l</code> on the file <strong>and every directory on the path</strong> — you need execute permission on a directory to enter it). Read the owner, group and the <code>rwx</code> bits; a typical fix is changing ownership (<code>chown</code>) to the service user or adding the user to a group, with the smallest permission that works — 644 for files, 755 for directories, 600 for private keys. Never <code>chmod 777</code>: it makes the file writable by every user and process on the machine. In containers, the image’s <code>USER</code> and the owner of mounted host files often disagree — that is a frequent cause.</p>',
      '<p>Tìm ra <em>ai</em> đang thử (<code>whoami</code>, hoặc người dùng mà dịch vụ hay container chạy dưới danh nghĩa) và họ đang chạm <em>cái gì</em> (<code>ls -l</code> trên tệp <strong>và mọi thư mục trên đường dẫn</strong> — cần quyền thực thi trên thư mục mới vào được nó). Đọc chủ sở hữu, nhóm và các bit <code>rwx</code>; cách sửa điển hình là đổi chủ (<code>chown</code>) sang người dùng của dịch vụ hoặc thêm người dùng vào nhóm, với quyền nhỏ nhất đủ dùng — 644 cho tệp, 755 cho thư mục, 600 cho khoá riêng. Không bao giờ <code>chmod 777</code>: nó cho mọi người dùng và mọi tiến trình trên máy ghi được tệp đó. Trong container, <code>USER</code> của image và chủ của tệp gắn từ máy chủ hay lệch nhau — đó là nguyên nhân thường gặp.</p>',
    ],
    sau: [['What does the x bit mean on a directory?', 'Why does SSH refuse a private key with mode 644?'], ['Bit x trên thư mục nghĩa là gì?', 'Vì sao SSH từ chối khoá riêng có quyền 644?']],
    loi: ['"sudo chmod -R 777 ."', '"sudo chmod -R 777 ."'],
  },
  {
    so: '5.4-4',
    q: ['Users report 502, 504 or 524 errors. What does each tell you?', 'Người dùng báo lỗi 502, 504 hoặc 524. Mỗi mã nói lên điều gì?'],
    chu: ['Locating a failure along the request path.', 'Định vị chỗ hỏng dọc đường đi của request.'],
    a: [
      '<p>All three come from a <strong>proxy in front of your app</strong>, not from the app. <strong>502 Bad Gateway</strong>: the proxy (nginx) could not get a valid response — the app is down, restarting, crashed, or nginx points at the wrong address/port. <strong>504 Gateway Timeout</strong>: the app accepted but did not answer within the proxy’s timeout — a slow query, a blocked event loop, a deadlock. <strong>524</strong> is Cloudflare-specific: Cloudflare connected to your origin but the origin did not answer before Cloudflare’s own timeout. Check in order: is the app container running and healthy (<code>docker ps</code>, logs), can nginx reach it, what does the app log say for that request. For work that legitimately takes minutes, do not hold the request open: return <code>202 Accepted</code> with a job id and let the client poll.</p>',
      '<p>Cả ba đều tới từ một <strong>proxy đứng trước ứng dụng</strong>, không phải từ ứng dụng. <strong>502 Bad Gateway</strong>: proxy (nginx) không nhận được response hợp lệ — ứng dụng đang sập, đang khởi động lại, bị crash, hoặc nginx trỏ sai địa chỉ/cổng. <strong>504 Gateway Timeout</strong>: ứng dụng đã nhận nhưng không trả lời kịp trong hạn chờ của proxy — truy vấn chậm, event loop bị chặn, deadlock. <strong>524</strong> là mã riêng của Cloudflare: Cloudflare đã nối được tới origin nhưng origin không trả lời trước hạn chờ của chính Cloudflare. Kiểm theo thứ tự: container ứng dụng có đang chạy và khoẻ không (<code>docker ps</code>, log), nginx có với tới được nó không, log ứng dụng nói gì về request đó. Việc thật sự mất vài phút thì đừng giữ request mở: trả <code>202 Accepted</code> kèm id việc và để client hỏi lại.</p>',
    ],
    sau: [['Where would you look first for a 502 right after a deploy?'], ['Ngay sau deploy gặp 502 thì bạn nhìn đâu trước?']],
    loi: ['"It is a server error, I would restart the server."', '"Lỗi server ạ, em khởi động lại server."'],
  },
  {
    so: '5.4-5',
    q: ['The server is slow. What do you check, in what order?', 'Server chạy chậm. Bạn kiểm gì, theo thứ tự nào?'],
    chu: ['A method, not a list of random commands.', 'Một phương pháp, không phải danh sách lệnh ngẫu nhiên.'],
    a: [
      '<p>First, what is slow and since when (one endpoint or everything? after a deploy?). Then the resources, cheapest first — the "USE" idea (utilisation, saturation, errors) for each: <strong>CPU</strong> (<code>top</code>, load average versus number of cores), <strong>memory</strong> (<code>free -m</code>, swapping, OOM kills in <code>dmesg</code>), <strong>disk</strong> (<code>df -h</code> for space, <code>iostat</code> for waiting), <strong>network</strong> (<code>curl -w</code> timings per phase). Then the application: slow-query log, event-loop delay, connection-pool exhaustion, error logs (<code>journalctl</code>, <code>docker logs</code>). Change one thing at a time and measure again.</p>',
      '<p>Trước tiên, cái gì chậm và từ bao giờ (một endpoint hay tất cả? sau một lần deploy?). Rồi tới tài nguyên, cái rẻ nhất trước — ý tưởng "USE" (mức dùng, mức bão hoà, lỗi) cho từng thứ: <strong>CPU</strong> (<code>top</code>, load average so với số nhân), <strong>bộ nhớ</strong> (<code>free -m</code>, có swap không, có bị giết vì OOM trong <code>dmesg</code> không), <strong>đĩa</strong> (<code>df -h</code> cho dung lượng, <code>iostat</code> cho thời gian chờ), <strong>mạng</strong> (<code>curl -w</code> đo từng chặng). Rồi tới ứng dụng: log truy vấn chậm, độ trễ event loop, pool kết nối cạn, log lỗi (<code>journalctl</code>, <code>docker logs</code>). Mỗi lần đổi một thứ và đo lại.</p>',
    ],
    sau: [['What does a load average of 8 mean on a 4-core machine?'], ['Load average 8 trên máy 4 nhân nghĩa là gì?']],
    loi: ['"Upgrade the server" before measuring anything.', '"Nâng cấp server" khi chưa đo gì.'],
  },
  {
    so: '5.4-6',
    q: ['Explain the DNS records you have used. Why do DNS changes "take time"?', 'Giải thích những bản ghi DNS bạn từng dùng. Vì sao thay đổi DNS "mất thời gian"?'],
    chu: ['Hands-on experience with a real domain.', 'Kinh nghiệm thực tế với một tên miền thật.'],
    a: [
      '<p><strong>A</strong> maps a name to an IPv4 address, <strong>AAAA</strong> to IPv6, <strong>CNAME</strong> makes a name an alias of another name, <strong>MX</strong> says where mail for the domain goes, <strong>TXT</strong> holds text such as SPF/DKIM records or domain-verification tokens. Each record has a <strong>TTL</strong>: resolvers cache the answer for that many seconds, so after a change, people whose resolver cached the old answer keep seeing it until the TTL runs out. Before a planned move, lower the TTL a day ahead. With a proxying CDN, the public A record points at the CDN, not at your server — which also hides the server’s address.</p>',
      '<p><strong>A</strong> ánh xạ một tên tới địa chỉ IPv4, <strong>AAAA</strong> tới IPv6, <strong>CNAME</strong> biến một tên thành bí danh của tên khác, <strong>MX</strong> cho biết thư của tên miền đi về đâu, <strong>TXT</strong> chứa văn bản như bản ghi SPF/DKIM hay mã xác minh tên miền. Mỗi bản ghi có một <strong>TTL</strong>: máy phân giải cache câu trả lời trong ngần ấy giây, nên sau khi đổi, những ai có máy phân giải đã cache câu trả lời cũ vẫn thấy nó tới khi hết TTL. Trước một lần chuyển máy có kế hoạch, hãy hạ TTL trước một ngày. Với CDN làm proxy, bản ghi A công khai trỏ tới CDN, không trỏ tới server — nhờ vậy cũng giấu được địa chỉ server.</p>',
    ],
    sau: [['Why can you not put a CNAME at the root of a domain (in classic DNS)?', 'How would you check what a domain resolves to?'], ['Vì sao (theo DNS cổ điển) không đặt CNAME ở gốc tên miền được?', 'Kiểm một tên miền phân giải ra gì bằng cách nào?']],
    loi: ['"DNS propagation takes 48 hours" as a fixed law — it is caching, and TTL controls it.', '"DNS cần 48 giờ để lan truyền" như một định luật — thật ra là cache, và TTL điều khiển nó.'],
  },
  {
    so: '5.4-7',
    q: ['How do you secure SSH access to a server?', 'Bạn bảo vệ việc SSH vào server thế nào?'],
    chu: ['Basic server hygiene — and one real lesson if you have it.', 'Vệ sinh server cơ bản — và một bài học thật nếu bạn có.'],
    a: [
      '<p>Key-based login only: disable password authentication, disallow root login with a password, keep private keys at mode 600 with a passphrase. Use a firewall that allows only the ports you need, keep the system updated, and consider fail2ban. <strong>A real lesson:</strong> when I disabled password authentication by adding a drop-in file, <code>sshd -t</code> and the reload both succeeded, yet passwords still worked — an existing cloud-init file with the opposite setting sorted earlier, and in sshd_config <em>the first value read wins</em>. Renaming my file to sort first fixed it, and I learnt to verify with <code>sshd -T</code> (the effective configuration), not by reading the file I just wrote. Another one: on a network that blocks port 22, adding a second SSH listener on an allowed port was safer than editing the running one.</p>',
      '<p>Chỉ đăng nhập bằng khoá: tắt xác thực bằng mật khẩu, không cho root đăng nhập bằng mật khẩu, giữ khoá riêng ở quyền 600 có passphrase. Dùng tường lửa chỉ mở những cổng cần, cập nhật hệ thống, cân nhắc fail2ban. <strong>Một bài học thật:</strong> khi em tắt đăng nhập bằng mật khẩu bằng cách thêm một tệp drop-in, <code>sshd -t</code> và reload đều thành công, vậy mà mật khẩu vẫn dùng được — một tệp cloud-init có sẵn với giá trị ngược lại xếp trước theo thứ tự chữ cái, mà trong sshd_config <em>giá trị đọc được đầu tiên thắng</em>. Đổi tên tệp của em để nó xếp trước là xong, và em học được cách kiểm bằng <code>sshd -T</code> (cấu hình đang có hiệu lực), không phải bằng việc đọc lại tệp vừa ghi. Một bài nữa: trên mạng chặn cổng 22, thêm một listener SSH thứ hai trên cổng được phép an toàn hơn sửa cái đang chạy.</p>',
    ],
    sau: [['How would you give a new teammate access?', 'What is an SSH tunnel?'], ['Bạn cấp quyền truy cập cho một đồng đội mới thế nào?', 'SSH tunnel là gì?']],
    loi: ['"Change the port to something random" as the main security measure.', '"Đổi cổng sang số ngẫu nhiên" là biện pháp bảo mật chính.'],
  },
  {
    so: '5.4-8',
    q: ['What cloud services do you know? VPS or managed services — how would you choose?', 'Bạn biết những dịch vụ cloud nào? VPS hay dịch vụ được quản lý — chọn thế nào?'],
    chu: ['Practical judgement about cost and responsibility, not a list of AWS names.', 'Óc phán đoán thực tế về chi phí và trách nhiệm, không phải danh sách tên dịch vụ AWS.'],
    a: [
      '<p>Models: <strong>IaaS</strong> (virtual machines, networks, disks — you manage the OS), <strong>PaaS</strong> (you give code or a container, the platform runs it), <strong>SaaS</strong> (finished software). Typical building blocks: compute (EC2, a VPS), managed databases (RDS), object storage (S3, Cloudflare R2), CDN, identity and access management (IAM — least privilege for every key). A single VPS with Docker Compose is cheap and teaches a lot, but <em>you</em> own backups, updates, security and disk space — the disk-full and SSH incidents in this chapter are that responsibility. Managed services cost more and remove that work. Watch hidden costs: <strong>egress</strong> (data going out) is often the surprise on a cloud bill, which is one reason some teams choose storage with no egress fee for media.</p>',
      '<p>Các mô hình: <strong>IaaS</strong> (máy ảo, mạng, đĩa — bạn quản lý hệ điều hành), <strong>PaaS</strong> (bạn đưa mã hoặc container, nền tảng chạy hộ), <strong>SaaS</strong> (phần mềm làm sẵn). Các khối xây dựng điển hình: tính toán (EC2, một VPS), CSDL được quản lý (RDS), lưu trữ đối tượng (S3, Cloudflare R2), CDN, quản lý danh tính và quyền (IAM — quyền tối thiểu cho mọi khoá). Một VPS duy nhất chạy Docker Compose thì rẻ và dạy được rất nhiều, nhưng <em>bạn</em> chịu trách nhiệm sao lưu, cập nhật, bảo mật và dung lượng đĩa — sự cố đầy đĩa và SSH trong chương này chính là trách nhiệm đó. Dịch vụ được quản lý đắt hơn và gỡ việc đó đi. Cẩn thận chi phí ẩn: <strong>egress</strong> (dữ liệu đi ra) hay là khoản bất ngờ trên hoá đơn cloud, đó là một lý do có đội chọn kho lưu trữ không tính phí egress cho media.</p>',
    ],
    sau: [['How do you back up a database on a VPS, and have you tested a restore?', 'What is a region and an availability zone?'], ['Sao lưu CSDL trên VPS thế nào, và bạn đã thử khôi phục chưa?', 'Region và availability zone là gì?']],
    loi: ['Listing service names you have never used.', 'Liệt kê tên dịch vụ bạn chưa bao giờ dùng.'],
  },
];

const L54 = {
  title: '5.4 — Linux, networking and cloud questions: URL journey, processes, 502/504, DNS, SSH|||5.4 — Câu hỏi Linux, mạng và cloud: hành trình URL, tiến trình, 502/504, DNS, SSH',
  slug: 'pv-5-4-linux-cloud',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám câu Linux, mạng và cloud hay gặp: gõ URL rồi Enter, tiến trình và luồng cùng chuyện "diệt theo cổng chứ không theo tên", Permission denied, 502/504/524, server chậm kiểm theo thứ tự nào, bản ghi DNS và TTL, bảo vệ SSH kèm bài học "giá trị đọc trước thắng", VPS hay dịch vụ được quản lý.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Linux, networking and cloud questions</h2>
<p class="lead">These questions check whether you can find your way around the machine your code runs on. You do not need to be a system administrator; you need a calm method and a handful of commands — and if you have run a VPS, the incidents you lived through are excellent answers.</p>
${doiThuong('en', 'Delivering a request is like sending a parcel across the city. DNS is looking up the street address from the shop name; TCP is the courier confirming the door exists; TLS is checking the recipient’s ID; nginx is the building’s reception passing the parcel to the right office; a 502 is reception saying "that office is not answering"; a 504 is "they took the parcel and have not come back".')}
${khungSuCo('en')}
${qs('en', QLNX.slice(0, 2))}
${ma('bash', LNX_LENH)}
${qs('en', QLNX.slice(2))}
${bay('en', 'reaching for sudo and 777 to make an error go away.', 'Interviewers ask "permission denied" questions precisely to see whether you understand or just force. "I would check the user and the path, then give the service user the smallest permission it needs" is a junior answer; "sudo chmod 777" ends the conversation.')}
${keXau('en', 'A server on the internet is scanned within minutes of getting a public IP: bots try SSH passwords, open database ports and default admin panels. That is why password SSH is turned off, internal ports are bound to localhost, and the real server address is kept behind the CDN where possible.')}
${thucHanh('en', { phut: '40–50', steps: [
  'Start any server on port 3000, then find and stop it only with <code>lsof</code>/<code>ss</code> and <code>kill</code> — no task manager.',
  'Run the <code>curl -w</code> timing command against three websites and explain which phase dominates for each.',
  'Use <code>dig</code> (or <code>nslookup</code>) to read the A, CNAME, MX and TXT records of a domain you own or your school’s domain, and note the TTLs.',
  'Explain "what happens when you type a URL" out loud in three minutes, then repeat with one step in depth.',
], dat: 'you stopped a process by port, interpreted real curl timings, read real DNS records, and recorded a three-minute URL-journey answer.' })}
${thuatNgu('en', [
  ['Process / thread', 'A running program with its own memory / a path of execution sharing a process’s memory.'],
  ['Signal (SIGINT, SIGTERM, SIGKILL)', 'A message to a process: interrupt, please stop, die now.'],
  ['rwx / chmod / chown', 'Read-write-execute bits / change them / change owner.'],
  ['502 / 504 / 524', 'Proxy got a bad answer / proxy timed out / Cloudflare’s origin timeout.'],
  ['DNS record (A, CNAME, MX, TXT)', 'An entry that maps a name to an address, an alias, mail servers or text.'],
  ['TTL', 'How long resolvers may cache a DNS answer.'],
  ['IaaS / PaaS / SaaS', 'Rent machines / rent a platform that runs your code / use finished software.'],
  ['Egress', 'Data leaving a cloud provider — often charged.'],
])}
${tomTat('en', [
  'Give the URL journey as an overview first — DNS, TCP, TLS, HTTP, proxy, app, database, render — then go deep where asked.',
  'Find processes by port; stop them with SIGTERM before SIGKILL.',
  'Debug permissions by user and path; never chmod 777.',
  '502, 504 and 524 come from proxies and point at different failures; long work belongs in a background job.',
  'Investigate slowness resource by resource, measuring before changing.',
  'DNS changes are slow because of caching and TTL; SSH is key-only and verified with sshd -T.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-0-2-go-dia-chi', L: 'en', title: 'Networking 0.2 — What happens when you type a URL and press Enter', sub: 'Question 5.4-1, measured hop by hop.' }),
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-10-4-ma-loi-gateway', L: 'en', title: 'Networking 10.4 — Reading 502, 503, 504 and 524 correctly', sub: 'Question 5.4-4 in depth.' }),
  lienKet({ khoa: 'linux-bash', bai: 'lnx-5-1-tien-trinh-la-gi', L: 'en', title: 'Linux 5.1 — What a process is, and how to look at one', sub: 'The ground under question 5.4-2.' }),
  lienKet({ khoa: 'linux-bash', bai: 'lnx-12-1-phuong-phap', L: 'en', title: 'Linux 12.1 — A method for a machine you have never seen', sub: 'Question 5.4-5 as a full method.' }),
  yt('AlkDbnbv7dk', 'ByteByteGo', 'What happens when you type a URL into your browser?', 5, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Câu hỏi Linux, mạng và cloud</h2>
<p class="lead">Những câu này kiểm xem bạn có tự xoay xở được trên cái máy mà mã của bạn chạy không. Bạn không cần là quản trị hệ thống; bạn cần một phương pháp bình tĩnh và một nhúm lệnh — và nếu bạn đã từng chạy một VPS, những sự cố bạn đã trải qua là câu trả lời tuyệt vời.</p>
${doiThuong('vi', 'Đưa một request đi giống gửi một bưu kiện qua thành phố. DNS là tra địa chỉ nhà từ tên cửa hàng; TCP là shipper xác nhận cánh cửa có thật; TLS là kiểm căn cước người nhận; nginx là lễ tân toà nhà chuyển bưu kiện tới đúng phòng; 502 là lễ tân bảo "phòng đó không ai trả lời"; 504 là "họ nhận bưu kiện rồi mà mãi chưa quay ra".')}
${khungSuCo('vi')}
${qs('vi', QLNX.slice(0, 2))}
${ma('bash', LNX_LENH)}
${qs('vi', QLNX.slice(2))}
${bay('vi', 'vớ ngay sudo và 777 cho hết báo lỗi.', 'Người phỏng vấn hỏi về "permission denied" chính là để xem bạn hiểu hay chỉ ép. "Em sẽ kiểm người dùng và đường dẫn, rồi cấp cho người dùng của dịch vụ quyền nhỏ nhất nó cần" là câu trả lời của junior; "sudo chmod 777" là kết thúc cuộc nói chuyện.')}
${keXau('vi', 'Một server trên Internet bị quét chỉ vài phút sau khi có IP công khai: bot thử mật khẩu SSH, cổng CSDL đang mở và trang quản trị mặc định. Vì vậy SSH bằng mật khẩu bị tắt, cổng nội bộ được gắn vào localhost, và địa chỉ thật của server được giấu sau CDN khi có thể.')}
${thucHanh('vi', { phut: '40–50', steps: [
  'Chạy một server bất kỳ ở cổng 3000, rồi tìm và dừng nó chỉ bằng <code>lsof</code>/<code>ss</code> và <code>kill</code> — không dùng trình quản lý tác vụ.',
  'Chạy lệnh đo thời gian <code>curl -w</code> với ba trang web và giải thích chặng nào chiếm nhiều nhất ở từng trang.',
  'Dùng <code>dig</code> (hoặc <code>nslookup</code>) đọc bản ghi A, CNAME, MX và TXT của một tên miền bạn sở hữu hoặc tên miền của trường, ghi lại TTL.',
  'Giải thích "chuyện gì xảy ra khi gõ URL" thành tiếng trong ba phút, rồi làm lại với một bước đi sâu.',
], dat: 'bạn đã dừng một tiến trình theo cổng, giải thích được số đo curl thật, đọc được bản ghi DNS thật, và có bản ghi âm ba phút về hành trình của URL.' })}
${thuatNgu('vi', [
  ['Process / thread (tiến trình / luồng)', 'Chương trình đang chạy có bộ nhớ riêng / mạch thực thi dùng chung bộ nhớ của tiến trình.'],
  ['Signal (tín hiệu: SIGINT, SIGTERM, SIGKILL)', 'Thông điệp gửi tới tiến trình: ngắt, xin dừng, chết ngay.'],
  ['rwx / chmod / chown', 'Bit đọc-ghi-thực thi / đổi bit / đổi chủ sở hữu.'],
  ['502 / 504 / 524', 'Proxy nhận câu trả lời hỏng / proxy chờ quá hạn / hạn chờ origin của Cloudflare.'],
  ['DNS record (bản ghi DNS: A, CNAME, MX, TXT)', 'Mục ánh xạ một tên tới địa chỉ, bí danh, máy chủ thư hoặc văn bản.'],
  ['TTL', 'Máy phân giải được cache một câu trả lời DNS bao lâu.'],
  ['IaaS / PaaS / SaaS', 'Thuê máy / thuê nền tảng chạy mã của bạn / dùng phần mềm làm sẵn.'],
  ['Egress', 'Dữ liệu đi ra khỏi nhà cung cấp cloud — thường bị tính tiền.'],
])}
${tomTat('vi', [
  'Kể hành trình URL dạng tổng quan trước — DNS, TCP, TLS, HTTP, proxy, ứng dụng, CSDL, vẽ trang — rồi đi sâu khi được hỏi.',
  'Tìm tiến trình theo cổng; dừng bằng SIGTERM trước SIGKILL.',
  'Gỡ lỗi quyền theo người dùng và đường dẫn; không bao giờ chmod 777.',
  '502, 504 và 524 tới từ proxy và chỉ vào những chỗ hỏng khác nhau; việc dài thuộc về job chạy nền.',
  'Điều tra chậm theo từng tài nguyên, đo trước khi đổi.',
  'Thay đổi DNS chậm vì cache và TTL; SSH chỉ dùng khoá và kiểm bằng sshd -T.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-0-2-go-dia-chi', title: 'Networking 0.2 — Chuyện gì xảy ra khi gõ URL và nhấn Enter', sub: 'Câu 5.4-1, đo từng chặng.' }),
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-10-4-ma-loi-gateway', title: 'Networking 10.4 — Đọc đúng 502, 503, 504 và 524', sub: 'Câu 5.4-4 đi sâu.' }),
  lienKet({ khoa: 'linux-bash', bai: 'lnx-5-1-tien-trinh-la-gi', title: 'Linux 5.1 — Tiến trình là gì, và xem một tiến trình thế nào', sub: 'Phần nền dưới câu 5.4-2.' }),
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-14-3-ssh-cong-bi-chan', title: 'Networking 14.3 — SSH khi cổng 22 bị chặn', sub: 'Bài học thứ hai trong câu 5.4-7, làm từng bước.' }),
  yt('AlkDbnbv7dk', 'ByteByteGo', 'What happens when you type a URL into your browser?', 5),
])}
</div>
`,
};

/* ═══════════════════════ 5.5 — Lab: mock DevOps 45 phút ═══════════════════════ */
const THE_SU_CO = `
THẺ 1  (ứng viên hỏi "triệu chứng là gì?")
  curl -s -o /dev/null -w "%{http_code}" https://app.example/api/v1/health      ->  502
  Trang chủ vẫn mở được. Deploy xong 3 phút trước.

THẺ 2  (ứng viên đòi "docker ps")
  NAMES            STATUS
  app_frontend     Up 3 minutes (healthy)
  app_backend      Restarting (1) 5 seconds ago
  app_postgres     Up 12 days (healthy)

THẺ 3  (ứng viên đòi log backend)
  PrismaClientInitializationError: Unable to require(.../libquery_engine-debian-openssl-3.0.x.so.node)
  Error loading shared library ... : No such file or directory
  (image mới dựng trên node:22-alpine)

THẺ 4  (ứng viên hỏi "image trước còn không?")
  Còn: app-backend:9f3c1a2 (bản chạy tốt hôm qua)

THẺ 5  (tình huống 2 — sau khi xử lý xong tình huống 1)
  "Tuần sau, deploy chết giữa chừng: no space left on device. df -h: / dùng 97%."
                                                     (tất cả output là minh hoạ)
`;

const L55 = {
  title: '5.5 — Lab: a 45-minute DevOps mock interview built around an incident drill|||5.5 — Lab: phỏng vấn thử DevOps 45 phút xoay quanh một buổi diễn tập sự cố',
  slug: 'pv-5-5-lab-mock-devops',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài lab: buổi phỏng vấn thử DevOps 45 phút — phần câu hỏi nhanh, rồi một buổi diễn tập sự cố "502 sau deploy" người hỏi lật từng thẻ bằng chứng (dựng lại từ sự cố musl/glibc thật), một tình huống đầy đĩa, phiếu chấm theo phương pháp năm bước, gợi ý và đáp án.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lab</span>
<h2>Lab — A DevOps mock interview with an incident drill</h2>
<p class="lead">DevOps interviews love scenario rounds: "production is down, what do you do?". The interviewer reveals information only when you ask for it, and scores the <em>order</em> of your questions as much as the answer. In this lab a partner plays the interviewer with a deck of evidence cards rebuilt from a real incident.</p>
<h3>Format (45 minutes)</h3>
${flow([
  ['0–15 min', 'rapid questions', 'Eight questions from Lessons 5.1–5.4, about 90 seconds each: 5.1-1, 5.1-2, 5.2-1, 5.2-4, 5.2-6, 5.3-4, 5.4-1, 5.4-4.'],
  ['15–35 min', 'incident drill', 'The scenario below. The interviewer shows a card only when the candidate asks for the matching evidence.'],
  ['35–40 min', 'second scenario', 'Disk full during deploy (card 5).'],
  ['40–45 min', 'debrief', 'What would you add so this never reaches users again?'],
])}
<h3>The drill: "502 after deploy"</h3>
<p>The interviewer reads: <em>"You deployed the backend three minutes ago. Users say the app is broken. Go."</em> The cards (all output is illustrative, rebuilt from a real incident):</p>
${ra(THE_SU_CO)}
<details><summary>Hint — what a strong candidate does, in order</summary><ol><li>Asks for the exact symptom and scope (card 1): only the API, right after a deploy — the deploy is the prime suspect.</li><li>Checks the container state (card 2): restarting with exit code 1 — the app itself fails at start, not a network or proxy problem.</li><li>Reads the logs (card 3): a Prisma engine built for glibc (debian-openssl) cannot load on an Alpine (musl) image.</li><li><strong>Restores service first</strong>: redeploy the previous image tag (card 4) — about a minute — and confirms with the health check.</li><li>Then the root cause: the build used a Dockerfile with the wrong base image, and nothing checked the image could start before it was pushed.</li><li>Prevention: build from the same Dockerfile that Compose uses, add a check that the base image’s libc matches the Prisma engine target before pushing, keep the post-deploy smoke test that fails on errors, keep the previous image for rollback.</li></ol><p>For card 5: measure (<code>df -h</code>, <code>docker system df</code>), clean build cache and dangling images — never volumes — then stop building on the server: build elsewhere and only pull.</p></details>
<h3>Score sheet (out of 20)</h3>
${rubric('en', [
  ['Symptom first', 'Jumps to a fix', 'Asks some questions', 'Establishes what, where, since when before acting'],
  ['Order of checks', 'Random', 'Mostly sensible', 'Cheapest and most likely first (deploy → container → logs)'],
  ['Restores service', 'Debugs while users wait', 'Mentions rollback late', 'Rolls back first, investigates after'],
  ['Root cause', 'Stops at "restart it"', 'Finds the error', 'Explains why it happened and why checks missed it'],
  ['Prevention', 'None', 'Generic ("be careful")', 'Concrete gates: libc check, smoke test, kept image'],
  ['Disk scenario', 'Prunes everything', 'Cleans safely', 'Cleans safely and removes the cause'],
  ['Rapid questions', 'Fewer than 4 good', '4–6 good', '7–8 good'],
  ['Communication', 'Silent or chaotic', 'Partly narrated', 'Narrates hypotheses and evidence throughout'],
  ['Honesty', 'Invents output', 'Guesses without saying so', 'Asks for evidence instead of assuming'],
  ['Calm', 'Panics', 'Uneven', 'Steady, methodical'],
])}
${bay('en', 'fixing before restoring.', 'The most common mistake in incident rounds is spending the drill investigating while "users" stay broken. When a deploy just broke production and the previous version is available, roll back first. Interviewers explicitly score this.')}
${neu('en', 'there is no previous image to roll back to? Say it: "Then I would build the last good commit, or hot-fix forward with the smallest change — and afterwards I would make sure every deploy keeps the previous image." Admitting the gap and fixing the process is the right answer.')}
${thucHanh('en', { phut: '60', steps: [
  'Give a partner this lesson’s script and cards; run the 45 minutes with a timer.',
  'Have the partner hide the cards and reveal each only when you ask for that evidence.',
  'Score with the sheet, then re-run the drill alone, out loud, aiming for a full answer in five minutes.',
  'Write your own drill from an incident in your project (symptom, three cards, the fix) for Chapter 10.',
], dat: 'you scored at least 14/20, you rolled back before investigating, and you have written one drill from your own project.' })}
${thuatNgu('en', [
  ['Incident drill', 'A practice scenario where evidence is revealed step by step.'],
  ['Restore vs root cause', 'Getting users working again / understanding why it broke.'],
  ['Postmortem', 'A blameless write-up: what happened, impact, cause, actions.'],
  ['Gate', 'An automatic check in the pipeline that stops a bad release.'],
  ['Health check', 'An endpoint or command that tells whether a service is working.'],
])}
${tomTat('en', [
  'Scenario rounds score the order of your questions as much as your answer.',
  'Symptom → container state → logs: cheapest and most likely first.',
  'Roll back first when a deploy just broke production; investigate after.',
  'Root cause includes why the checks missed it; prevention is a concrete gate.',
  'Write drills from your own incidents — they become your best interview stories.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'docker', bai: 'dk-12-1-phuong-phap', L: 'en', title: 'Docker 12.1 — A method, before the cookbook', sub: 'The diagnosis method behind the drill.' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-15-4-van-hanh-pipeline', L: 'en', title: 'GitHub Actions 15.4 — Running the pipeline, and interview questions', sub: 'More pipeline scenarios.' }),
  yt('6GigmhdY4sA', 'Abhishek.Veeramalla', 'Ultimate DevOps Mock Interview', 27, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Lab</span>
<h2>Lab — Phỏng vấn thử DevOps với một buổi diễn tập sự cố</h2>
<p class="lead">Phỏng vấn DevOps rất thích vòng tình huống: "production đang sập, em làm gì?". Người phỏng vấn chỉ đưa thông tin khi bạn hỏi đúng, và chấm <em>thứ tự</em> câu hỏi của bạn ngang với câu trả lời. Trong lab này, một bạn tập đóng vai người phỏng vấn với bộ thẻ bằng chứng dựng lại từ một sự cố thật.</p>
<h3>Hình thức (45 phút)</h3>
${flow([
  ['0–15 phút', 'câu hỏi nhanh', 'Tám câu từ các bài 5.1–5.4, mỗi câu khoảng 90 giây: 5.1-1, 5.1-2, 5.2-1, 5.2-4, 5.2-6, 5.3-4, 5.4-1, 5.4-4.'],
  ['15–35 phút', 'diễn tập sự cố', 'Tình huống dưới đây. Người hỏi chỉ đưa thẻ khi ứng viên hỏi đúng bằng chứng tương ứng.'],
  ['35–40 phút', 'tình huống hai', 'Đầy đĩa khi deploy (thẻ 5).'],
  ['40–45 phút', 'rút kinh nghiệm', 'Em sẽ thêm gì để chuyện này không bao giờ tới tay người dùng nữa?'],
])}
<h3>Buổi diễn tập: "502 sau khi deploy"</h3>
<p>Người hỏi đọc: <em>"Em vừa deploy backend ba phút trước. Người dùng báo app hỏng. Bắt đầu đi."</em> Các thẻ (mọi output đều là minh hoạ, dựng lại từ một sự cố thật):</p>
${ra(THE_SU_CO)}
<details><summary>Gợi ý — một ứng viên mạnh làm gì, theo thứ tự</summary><ol><li>Hỏi chính xác triệu chứng và phạm vi (thẻ 1): chỉ API, ngay sau deploy — lần deploy là nghi phạm số một.</li><li>Kiểm trạng thái container (thẻ 2): khởi động lại liên tục với mã thoát 1 — chính ứng dụng hỏng lúc khởi động, không phải chuyện mạng hay proxy.</li><li>Đọc log (thẻ 3): engine Prisma build cho glibc (debian-openssl) không nạp được trên image Alpine (musl).</li><li><strong>Khôi phục dịch vụ trước</strong>: deploy lại tag image trước đó (thẻ 4) — khoảng một phút — và xác nhận bằng health check.</li><li>Rồi mới tới nguyên nhân gốc: lần build dùng nhầm Dockerfile có ảnh nền sai, và không có gì kiểm image khởi động được trước khi đẩy.</li><li>Chặn tái diễn: build từ đúng Dockerfile mà Compose dùng, thêm bước kiểm libc của ảnh nền khớp đích của engine Prisma trước khi đẩy, giữ smoke test sau deploy làm hỏng lần deploy khi có lỗi, giữ image trước để quay lui.</li></ol><p>Với thẻ 5: đo (<code>df -h</code>, <code>docker system df</code>), dọn build cache và image treo — không bao giờ dọn volume — rồi ngừng build trên server: build ở chỗ khác và chỉ kéo về.</p></details>
<h3>Phiếu chấm (thang 20)</h3>
${rubric('vi', [
  ['Triệu chứng trước', 'Nhảy ngay vào sửa', 'Có hỏi vài câu', 'Xác lập cái gì, ở đâu, từ khi nào trước khi hành động'],
  ['Thứ tự kiểm', 'Ngẫu nhiên', 'Phần lớn hợp lý', 'Rẻ nhất và khả dĩ nhất trước (deploy → container → log)'],
  ['Khôi phục dịch vụ', 'Gỡ lỗi trong lúc người dùng chờ', 'Nhắc quay lui muộn', 'Quay lui trước, điều tra sau'],
  ['Nguyên nhân gốc', 'Dừng ở "khởi động lại"', 'Tìm ra lỗi', 'Giải thích vì sao xảy ra và vì sao các bước kiểm bỏ lọt'],
  ['Chặn tái diễn', 'Không có', 'Chung chung ("cẩn thận hơn")', 'Cổng cụ thể: kiểm libc, smoke test, giữ image'],
  ['Tình huống đĩa', 'Prune hết', 'Dọn an toàn', 'Dọn an toàn và gỡ được nguyên nhân'],
  ['Câu hỏi nhanh', 'Dưới 4 câu tốt', '4–6 câu tốt', '7–8 câu tốt'],
  ['Giao tiếp', 'Im lặng hoặc rối', 'Kể một phần', 'Nói ra giả thuyết và bằng chứng suốt buổi'],
  ['Trung thực', 'Tự bịa output', 'Đoán mà không nói là đoán', 'Hỏi bằng chứng thay vì giả định'],
  ['Bình tĩnh', 'Hoảng', 'Lúc được lúc không', 'Đều đặn, có phương pháp'],
])}
${bay('vi', 'sửa trước khi khôi phục.', 'Lỗi hay gặp nhất ở vòng sự cố là dành cả buổi để điều tra trong khi "người dùng" vẫn hỏng. Khi một lần deploy vừa làm sập production và bản trước vẫn còn, hãy quay lui trước. Người phỏng vấn chấm điểm này một cách rõ ràng.')}
${neu('vi', 'không còn image trước để quay lui? Nói thẳng: "Vậy em sẽ build lại commit tốt gần nhất, hoặc sửa tiến lên bằng thay đổi nhỏ nhất — và sau đó em sẽ đảm bảo mọi lần deploy đều giữ image trước." Nhận ra lỗ hổng và sửa quy trình là câu trả lời đúng.')}
${thucHanh('vi', { phut: '60', steps: [
  'Đưa bạn tập kịch bản và bộ thẻ của bài này; chạy 45 phút có đồng hồ.',
  'Nhờ bạn tập giấu thẻ và chỉ lật từng thẻ khi bạn hỏi đúng bằng chứng đó.',
  'Chấm bằng phiếu, rồi tự chạy lại buổi diễn tập một mình, thành tiếng, nhắm một câu trả lời trọn vẹn trong năm phút.',
  'Viết một buổi diễn tập của riêng bạn từ một sự cố trong dự án của bạn (triệu chứng, ba thẻ, cách sửa) cho Chương 10.',
], dat: 'bạn đạt ít nhất 14/20, đã quay lui trước khi điều tra, và đã viết một buổi diễn tập từ dự án của chính mình.' })}
${thuatNgu('vi', [
  ['Incident drill (diễn tập sự cố)', 'Một tình huống tập trong đó bằng chứng được lật dần từng bước.'],
  ['Restore vs root cause', 'Cho người dùng dùng lại được / hiểu vì sao nó hỏng.'],
  ['Postmortem (báo cáo sau sự cố)', 'Bản viết không đổ lỗi: chuyện gì xảy ra, ảnh hưởng, nguyên nhân, việc cần làm.'],
  ['Gate (cổng kiểm)', 'Một bước kiểm tự động trong pipeline chặn bản phát hành hỏng.'],
  ['Health check (kiểm sức khoẻ)', 'Endpoint hoặc lệnh cho biết dịch vụ có đang chạy đúng không.'],
])}
${tomTat('vi', [
  'Vòng tình huống chấm thứ tự câu hỏi của bạn ngang với câu trả lời.',
  'Triệu chứng → trạng thái container → log: rẻ nhất và khả dĩ nhất trước.',
  'Deploy vừa làm sập production thì quay lui trước; điều tra sau.',
  'Nguyên nhân gốc phải gồm cả vì sao bước kiểm bỏ lọt; chặn tái diễn là một cổng kiểm cụ thể.',
  'Viết buổi diễn tập từ chính sự cố của bạn — chúng thành câu chuyện phỏng vấn tốt nhất.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'docker', bai: 'dk-12-1-phuong-phap', title: 'Docker 12.1 — Phương pháp, trước khi tra công thức', sub: 'Phương pháp chẩn đoán đứng sau buổi diễn tập.' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-15-4-van-hanh-pipeline', title: 'GitHub Actions 15.4 — Vận hành pipeline, và câu hỏi phỏng vấn', sub: 'Thêm tình huống về pipeline.' }),
  yt('6GigmhdY4sA', 'Abhishek.Veeramalla', 'Ultimate DevOps Mock Interview', 27),
])}
</div>
`,
};

/* ═══════════════════════ 5.6 — Quiz ═══════════════════════ */
const Q56 = {
  title: '5.6 — Chapter 5 check|||5.6 — Kiểm tra Chương 5',
  slug: 'pv-5-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống DevOps: hoàn tác commit đã push, lộ API key, mất dữ liệu sau compose down, localhost trong container, mã thoát 137, ảnh Alpine và engine glibc, push là deploy, smoke test 404, 502 sau deploy, diệt tiến trình theo cổng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Check</span>
<h2>Chapter 5 check — the DevOps round</h2>
<p class="lead">Ten situations, most of them taken from real incidents in a small production system. The wrong options are the actions people really take under pressure.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I know which Git commands rewrite history, and how to undo safely on main.</li>
<li>I can explain why data disappears from a container and where it should live.</li>
<li>I can read exit codes 1, 137 and 143.</li>
<li>I can explain why a green build can still break production, and how a smoke test catches it.</li>
<li>I can locate a 502, 504 or 524 along the request path.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Kiểm tra Chương 5 — vòng DevOps</h2>
<p class="lead">Mười tình huống, phần lớn lấy từ sự cố thật của một hệ thống production nhỏ. Các phương án sai là những việc người ta thật sự làm khi bị áp lực.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi biết lệnh Git nào viết lại lịch sử, và cách hoàn tác an toàn trên main.</li>
<li>Tôi giải thích được vì sao dữ liệu biến khỏi container và nó nên nằm ở đâu.</li>
<li>Tôi đọc được mã thoát 1, 137 và 143.</li>
<li>Tôi giải thích được vì sao build xanh vẫn có thể làm hỏng production, và smoke test bắt nó thế nào.</li>
<li>Tôi định vị được 502, 504 hay 524 trên đường đi của request.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      cau('A commit you pushed to the shared main branch an hour ago broke the build. Teammates have already pulled. What is the safest way to undo it?|||Một commit bạn push lên nhánh main dùng chung một giờ trước làm hỏng build. Đồng đội đã pull về. Cách hoàn tác an toàn nhất là gì?', [
        'git reset --hard HEAD~1 then git push --force|||git reset --hard HEAD~1 rồi git push --force',
        'git revert the commit and push the new commit|||git revert commit đó và push commit mới',
        'Delete the branch and recreate it|||Xoá nhánh rồi tạo lại',
        'git commit --amend and push|||git commit --amend rồi push',
      ], 1, 'EN: Revert adds a new commit and rewrites nothing, so teammates’ clones stay consistent. Reset plus force-push is the tempting shortcut, but it rewrites history others already have.|||VI: Revert thêm commit mới và không viết lại gì, nên bản clone của đồng đội vẫn khớp. Reset rồi force-push là đường tắt hấp dẫn, nhưng nó viết lại lịch sử người khác đã có.'),
      cau('You notice an API key in a commit pushed to a public repository ten minutes ago. What do you do FIRST?|||Bạn phát hiện một API key trong commit đã push lên kho công khai mười phút trước. Việc ĐẦU TIÊN là gì?', [
        'Remove it from history with git filter-repo|||Gỡ nó khỏi lịch sử bằng git filter-repo',
        'Make the repository private|||Chuyển kho sang private',
        'Revoke and rotate the key at the provider|||Thu hồi và thay khoá ở nhà cung cấp',
        'Add the file to .gitignore|||Thêm tệp vào .gitignore',
      ], 2, 'EN: Assume the key is already compromised — scanners find public keys within minutes. Cleaning history matters, but only rotation makes the leaked key useless; .gitignore only affects future commits.|||VI: Coi như khoá đã bị lộ — máy quét tìm ra khoá công khai trong vài phút. Dọn lịch sử có quan trọng, nhưng chỉ thay khoá mới làm khoá bị lộ thành vô dụng; .gitignore chỉ có tác dụng với commit sau này.'),
      cau('After docker compose down and up, the Postgres data of the team project is gone. What was most likely missing?|||Sau docker compose down rồi up, dữ liệu Postgres của dự án nhóm biến mất. Nhiều khả năng đã thiếu cái gì?', [
        'A healthcheck on the postgres service|||Healthcheck cho service postgres',
        'A restart: always policy|||Chính sách restart: always',
        'A larger memory limit|||Giới hạn bộ nhớ lớn hơn',
        'A named volume mounted at /var/lib/postgresql/data|||Một named volume gắn vào /var/lib/postgresql/data',
      ], 3, 'EN: Without a volume the data lived in the container’s writable layer, which is deleted with the container. Restart policies and healthchecks do not keep data across a recreate.|||VI: Không có volume thì dữ liệu nằm trong tầng ghi của container, và bị xoá cùng container. Chính sách restart hay healthcheck không giữ dữ liệu khi container bị tạo lại.'),
      cau('Inside the backend container, the app tries postgres://localhost:5432 and fails, although Postgres runs in another service of the same Compose file. What is the fix?|||Bên trong container backend, ứng dụng thử postgres://localhost:5432 và thất bại, dù Postgres chạy ở một service khác trong cùng file Compose. Cách sửa?', [
        'Use the service name as host, e.g. postgres://db:5432|||Dùng tên service làm host, ví dụ postgres://db:5432',
        'Open port 5432 in the host firewall|||Mở cổng 5432 trên tường lửa máy chủ',
        'Run both in the same container|||Chạy cả hai trong cùng một container',
        'Publish 5432 with -p 5432:5432|||Công bố 5432 bằng -p 5432:5432',
      ], 0, 'EN: localhost inside a container is that container. Services reach each other by name through Docker’s DNS. Publishing the port or opening the firewall exposes the database without fixing the address.|||VI: localhost trong container là chính container đó. Các service gọi nhau bằng tên qua DNS của Docker. Công bố cổng hay mở tường lửa chỉ phơi CSDL ra ngoài mà không sửa được địa chỉ.'),
      cau('docker inspect shows ExitCode 137 and OOMKilled true for the frontend build container on a 6 GB server. What does it mean?|||docker inspect báo ExitCode 137 và OOMKilled true cho container build frontend trên server 6 GB. Nghĩa là gì?', [
        'The build script has a syntax error|||Script build có lỗi cú pháp',
        'The process was killed with SIGKILL for exceeding memory|||Tiến trình bị giết bằng SIGKILL vì vượt bộ nhớ',
        'The container was stopped normally on deploy|||Container được dừng bình thường khi deploy',
        'The command was not found in the image|||Không tìm thấy lệnh trong image',
      ], 1, 'EN: 137 = 128 + 9 (SIGKILL), and OOMKilled confirms memory. A normal stop would be 143; command-not-found is 127; a syntax error usually exits with 1.|||VI: 137 = 128 + 9 (SIGKILL), và OOMKilled xác nhận là do bộ nhớ. Dừng bình thường sẽ là 143; không tìm thấy lệnh là 127; lỗi cú pháp thường thoát mã 1.'),
      cau('An image built on node:22-alpine passes CI, is pushed and deployed, then the backend restarts in a loop with an error loading a Prisma engine for debian-openssl. What is the root cause?|||Một image dựng trên node:22-alpine qua CI, được đẩy và deploy, rồi backend khởi động lại liên tục với lỗi nạp engine Prisma cho debian-openssl. Nguyên nhân gốc là gì?', [
        'The database password changed|||Mật khẩu CSDL đã đổi',
        'The server ran out of disk|||Server hết đĩa',
        'A glibc-built native engine cannot load on a musl (Alpine) base — and nothing checked the image could start before pushing|||Engine gốc build cho glibc không nạp được trên nền musl (Alpine) — và không có gì kiểm image khởi động được trước khi đẩy',
        'Prisma does not support Node 22|||Prisma không hỗ trợ Node 22',
      ], 2, 'EN: The error names the engine target (debian-openssl) on an Alpine image: a libc mismatch. A green build only proves it compiled. A password change would give an authentication error, not a library-loading error.|||VI: Lỗi nêu rõ đích của engine (debian-openssl) trên image Alpine: lệch libc. Build xanh chỉ chứng minh nó biên dịch được. Đổi mật khẩu sẽ ra lỗi xác thực, không ra lỗi nạp thư viện.'),
      cau('Two workflows both deploy on every push to main, and one day the feed returns 500 because the new code went live before the migration ran. Which change addresses the cause?|||Hai workflow cùng deploy ở mọi lần push lên main, và có hôm feed trả 500 vì mã mới chạy trước khi migration được áp. Thay đổi nào xử lý đúng nguyên nhân?', [
        'Add more unit tests|||Thêm unit test',
        'Deploy only from one controlled path, one at a time, with migrations ordered before the swap|||Chỉ deploy qua một đường có kiểm soát, mỗi lúc một lượt, migration được sắp trước khi tráo',
        'Retry the deploy automatically on failure|||Tự động deploy lại khi hỏng',
        'Push less often|||Push ít hơn',
      ], 1, 'EN: The cause is uncontrolled concurrency and ordering between deploy paths. Unit tests would pass; automatic retries add more concurrent deploys; pushing less often only makes the race rarer.|||VI: Nguyên nhân là tính đồng thời và thứ tự không được kiểm soát giữa các đường deploy. Unit test vẫn sẽ qua; tự deploy lại chỉ thêm lượt deploy đồng thời; push ít hơn chỉ làm cuộc đua hiếm hơn.'),
      cau('Right after a deploy, the smoke test calls GET /api/v1/gifs without logging in and receives 404. The route needs authentication. What does it suggest?|||Ngay sau deploy, smoke test gọi GET /api/v1/gifs không đăng nhập và nhận 404. Route này cần xác thực. Điều đó gợi ý gì?', [
        'The route is missing from the running build — a stale or partial build|||Route không có trong bản đang chạy — bản build cũ hoặc dở dang',
        'The smoke test is wrong; it should log in|||Smoke test sai; lẽ ra phải đăng nhập',
        'The GIF provider is down|||Nhà cung cấp GIF đang sập',
        'Everything is fine — protected routes return 404|||Mọi thứ ổn — route được bảo vệ trả 404',
      ], 0, 'EN: A mounted protected route answers 401 to an unauthenticated call; 404 means the router does not know it. The provider being down would show up as 5xx from that route, not 404.|||VI: Một route được bảo vệ đã gắn sẽ trả 401 cho lời gọi không đăng nhập; 404 nghĩa là bộ định tuyến không biết nó. Nhà cung cấp sập sẽ hiện thành lỗi 5xx từ route đó, không phải 404.'),
      cau('Users get 502 from nginx right after a backend deploy, while the frontend works. What do you check first?|||Người dùng nhận 502 từ nginx ngay sau một lần deploy backend, trong khi frontend vẫn chạy. Bạn kiểm gì trước?', [
        'The DNS records of the domain|||Bản ghi DNS của tên miền',
        'The TLS certificate|||Chứng chỉ TLS',
        'The database indexes|||Chỉ mục CSDL',
        'Whether the backend container is running and what its logs say|||Container backend có đang chạy không và log của nó nói gì',
      ], 3, 'EN: 502 means nginx got no valid answer from the upstream — the freshly deployed backend is the prime suspect. DNS and TLS are fine (the frontend works through the same name); slow queries would cause 504, not 502.|||VI: 502 nghĩa là nginx không nhận được câu trả lời hợp lệ từ phía sau — backend vừa deploy là nghi phạm số một. DNS và TLS vẫn ổn (frontend vẫn chạy qua cùng tên miền); truy vấn chậm sẽ gây 504 chứ không phải 502.'),
      cau('pkill -f "next start" reports nothing killed, the new Next.js server fails with EADDRINUSE, and the old one keeps serving. What is the reliable fix?|||pkill -f "next start" báo không giết được gì, server Next.js mới chết với EADDRINUSE, server cũ vẫn phục vụ. Cách sửa chắc chắn?', [
        'Reboot the machine every deploy|||Khởi động lại máy mỗi lần deploy',
        'Use a different port each deploy|||Mỗi lần deploy dùng một cổng khác',
        'Find the process by port (lsof -ti :3000) and kill that PID|||Tìm tiến trình theo cổng (lsof -ti :3000) rồi giết đúng PID đó',
        'Run pkill -9 -f "next start" instead|||Chạy pkill -9 -f "next start" thay vào',
      ], 2, 'EN: The process renamed itself (next-server), so matching by name finds nothing — with or without -9. Killing by port targets exactly the process holding the socket. Changing ports or rebooting hides the problem.|||VI: Tiến trình đã tự đổi tên (next-server), nên khớp theo tên không tìm thấy gì — có -9 hay không cũng vậy. Giết theo cổng nhắm đúng tiến trình đang giữ socket. Đổi cổng hay khởi động lại máy chỉ che vấn đề đi.'),
    ],
  },
};

export default {
  title: 'Chapter 5 — DevOps technical round|||Chương 5 — Vòng kỹ thuật DevOps',
  description: 'Git, Docker, CI/CD, Linux, mạng và cloud: bộ câu hỏi thật hay gặp, câu trả lời mẫu có chiều sâu kể bằng sự cố thật của một hệ thống production nhỏ (502 vì musl/glibc, đầy đĩa vì build cache, push-to-deploy đua nhau, bind mount theo inode, SSH), câu đào sâu và lỗi hay gặp; lab phỏng vấn thử với buổi diễn tập sự cố, và quiz 10 câu.',
  lessons: [L51, L52, L53, L54, L55, Q56],
};
