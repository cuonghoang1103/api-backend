    /* ─────────────────────────── 18.8 ─────────────────────────── */
    {
      title: '18.8 — Chapter 18 quiz|||18.8 — Kiểm tra Chương 18',
      slug: 'git-18-8-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về bảy tai nạn của nhóm: build/ lọt vào kho, xung đột web.xml, ba thông báo đồng bộ, làm nhầm trên main, tự merge không review, hoàn tác merge.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Quiz</span>
<h2>Ten situations from a student team's bad night</h2>
<p class="lead">Every question is a scene from this chapter. Read the symptom first, decide what Git is telling you, then choose the safest fix — the explanation says why the tempting answer is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain why a rule added to <code>.gitignore</code> does nothing for files that are already tracked, and the command that fixes it.</li>
<li>I know that a leaked password must be rotated, not just deleted.</li>
<li>I can resolve a conflict in <code>web.xml</code> and prove the result is valid XML.</li>
<li>I can tell "would be overwritten", "no tracking information", "rejected" and "divergent branches" apart.</li>
<li>I can choose between <code>reset</code> and <code>revert</code> by asking whether the commit has left my laptop.</li>
<li>I know why re-merging a branch after <code>revert -m 1</code> says "Already up to date".</li>
</ul>
${slide('git-18', 16, 'Bảng tra nhanh Chương 18')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Kiểm tra</span>
<h2>Mười tình huống từ một đêm tệ của nhóm sinh viên</h2>
<p class="lead">Mỗi câu là một cảnh trong chương này. Đọc triệu chứng trước, quyết định Git đang nói gì, rồi chọn cách sửa an toàn nhất — phần giải thích cho biết vì sao đáp án hấp dẫn lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được vì sao một luật thêm vào <code>.gitignore</code> không làm gì với tệp đã được theo dõi, và lệnh sửa nó.</li>
<li>Tôi biết mật khẩu bị lộ phải được xoay vòng, không chỉ xoá.</li>
<li>Tôi giải được xung đột trong <code>web.xml</code> và chứng minh được kết quả là XML hợp lệ.</li>
<li>Tôi phân biệt được "would be overwritten", "no tracking information", "rejected" và "divergent branches".</li>
<li>Tôi chọn được giữa <code>reset</code> và <code>revert</code> bằng cách hỏi commit đã rời laptop chưa.</li>
<li>Tôi biết vì sao merge lại một nhánh sau <code>revert -m 1</code> báo "Already up to date".</li>
</ul>
${slide('git-18', 16, 'Bảng tra nhanh Chương 18')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Bình runs git pull and Git lists build/…/HomeServlet.class and dist/QuanLyPhongKham.war as "local changes … would be overwritten". An committed them last week with git add . after a NetBeans build. What is the right repair?|||Bình chạy git pull và Git liệt kê build/…/HomeServlet.class và dist/QuanLyPhongKham.war là "local changes … would be overwritten". An đã commit chúng tuần trước bằng git add . sau một lần build NetBeans. Cách sửa đúng là gì?',
            options: [
              'Bình commits his own build output, so that both versions are in history and the conflict can be resolved|||Bình commit luôn sản phẩm build của mình, để cả hai phiên bản nằm trong lịch sử và giải xung đột',
              'Add build/ and dist/ to .gitignore; Git stops tracking them at once|||Thêm build/ và dist/ vào .gitignore; Git ngừng theo dõi chúng ngay',
              'git rm -r --cached build dist, add the rules to .gitignore, commit and push; teammates stash their copies before pulling|||git rm -r --cached build dist, thêm luật vào .gitignore, commit và push; đồng đội stash bản của mình trước khi pull',
              'git stash and pull again every morning|||git stash rồi pull lại mỗi sáng',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'Build output is tracked, so the fix is to stop tracking it: git rm -r --cached removes it from the index (files stay on disk) and the .gitignore rules keep it out afterwards. Option B is the tempting one but wrong: a .gitignore rule never affects files already in the index. Committing binaries (A) just creates unresolvable binary conflicts, and stashing daily (D) treats the symptom forever.|||Sản phẩm build đang được theo dõi nên cách sửa là ngừng theo dõi: git rm -r --cached gỡ chúng khỏi index (tệp vẫn nằm trên đĩa) và luật .gitignore giữ chúng ra ngoài về sau. Đáp án B hấp dẫn nhưng sai: một luật .gitignore không bao giờ ảnh hưởng tới tệp đã nằm trong index. Commit tệp nhị phân (A) chỉ tạo ra xung đột nhị phân không giải được, còn stash mỗi ngày (D) chữa triệu chứng mãi mãi.',
          },
          {
            question: 'The team realises nbproject/private/private.properties, committed and pushed two days ago, contains the Tomcat manager password, which is also used for a test database. They have already removed the file from the repository. What must still be done?|||Nhóm nhận ra nbproject/private/private.properties, đã commit và push hai ngày trước, chứa mật khẩu Tomcat manager, cũng là mật khẩu của một database thử. Họ đã gỡ tệp khỏi kho. Còn phải làm gì?',
            options: [
              'Change the password everywhere it is used; the old value is still in history and must be treated as leaked|||Đổi mật khẩu ở mọi nơi nó được dùng; giá trị cũ vẫn nằm trong lịch sử và phải coi là đã lộ',
              'Nothing: once the file is deleted and the fix is pushed, the password is no longer reachable|||Không cần gì: khi tệp đã xoá và bản sửa đã push thì mật khẩu không còn với tới được',
              'Run git push --force with an empty commit so the old commits disappear from GitHub|||Chạy git push --force với một commit rỗng để các commit cũ biến khỏi GitHub',
              'Make the repository private; that removes the history|||Chuyển repository sang private; việc đó xoá lịch sử',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'The commits that contain the password are still in history, in every clone and possibly in forks and cached views. The first step is always to rotate the secret (and every place it is reused); rewriting history is optional afterwards. B is wrong because deleting a file does not delete its past versions; C does not remove anything (an empty commit changes nothing) and breaks teammates; D changes who can see the repository, not what it contains.|||Các commit chứa mật khẩu vẫn nằm trong lịch sử, trong mọi clone và có thể trong fork và bản lưu đệm. Bước đầu tiên luôn là xoay vòng bí mật (và mọi nơi dùng lại nó); viết lại lịch sử chỉ là tuỳ chọn sau đó. B sai vì xoá một tệp không xoá các phiên bản trước của nó; C không xoá được gì (commit rỗng không đổi gì) và làm hỏng clone đồng đội; D đổi người được xem kho, không đổi nội dung kho.',
          },
          {
            question: 'After a conflict in web.xml, Bình deletes the three marker lines (<<<<<<<, =======, >>>>>>>), keeps everything else and commits. Tomcat then fails on every machine. xmllint says: "Opening and ending tag mismatch: servlet-mapping … and servlet". Why?|||Sau một xung đột trong web.xml, Bình xoá ba dòng dấu hiệu (<<<<<<<, =======, >>>>>>>), giữ mọi thứ còn lại rồi commit. Tomcat lỗi trên mọi máy. xmllint báo: "Opening and ending tag mismatch: servlet-mapping … and servlet". Vì sao?',
            options: [
              'Git corrupted the file while merging; the merge must be redone with --strategy=theirs|||Git làm hỏng tệp khi merge; phải merge lại với --strategy=theirs',
              'The markers are required by XML parsers and must stay in the file|||Dấu hiệu là thứ trình phân tích XML bắt buộc phải có và phải ở lại trong tệp',
              'xmllint is outdated and reports an error that Tomcat does not care about|||xmllint đã cũ và báo một lỗi mà Tomcat không quan tâm',
              'Git cut the conflict region in the middle of XML elements, so keeping both halves glued the opening of one block to the tail of the other|||Git cắt vùng xung đột giữa chừng các phần tử XML, nên giữ cả hai nửa đã dán phần đầu của một khối vào phần đuôi của khối kia',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'A conflict hunk starts and ends where the two sides differ, not where an element starts and ends; the shared lines (such as the closing tag) stay outside the markers. Removing only the markers can therefore leave mismatched tags. The right fix is to rebuild the file from main plus your own block and validate it with xmllint or the IDE. Git did not corrupt anything (A), and markers must never stay in a file (B).|||Một đoạn xung đột bắt đầu và kết thúc ở chỗ hai phía khác nhau, không phải chỗ một phần tử bắt đầu và kết thúc; các dòng chung (như thẻ đóng) nằm ngoài dấu hiệu. Chỉ xoá dấu hiệu vì vậy có thể để lại các thẻ không khớp. Cách sửa đúng là dựng lại tệp từ main cộng khối của bạn rồi kiểm bằng xmllint hoặc IDE. Git không làm hỏng gì (A), và dấu hiệu không bao giờ được ở lại trong tệp (B).',
          },
          {
            question: 'Chi forgot to branch and built on main. git status -sb shows "## main...origin/main [ahead 1, behind 2]" and "UU web/WEB-INF/web.xml" after a git pull. She has not pushed anything. What is the first move?|||Chi quên rẽ nhánh và làm trên main. git status -sb hiện "## main...origin/main [ahead 1, behind 2]" và "UU web/WEB-INF/web.xml" sau một lần git pull. Bạn ấy chưa push gì. Nước đi đầu tiên là gì?',
            options: [
              'git reset --hard origin/main, then redo the work from memory|||git reset --hard origin/main, rồi làm lại việc theo trí nhớ',
              'git merge --abort, then put the commit on a branch before moving main|||git merge --abort, rồi đặt commit lên một nhánh trước khi dời main',
              'Edit web.xml right away and push with --force to settle the matter|||Sửa web.xml ngay và push với --force cho xong chuyện',
              'Delete the folder and clone the repository again|||Xoá thư mục và clone lại repository',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'Leave the half-done merge first (merge --abort returns to the state before the pull), then save the commit on a branch, and only then move main. A would destroy the only copy of her work before it is saved; C rewrites the shared branch; D throws away the unpushed commit that is inside the clone.|||Rời phép merge dang dở trước (merge --abort về trạng thái trước lần pull), rồi cất commit lên một nhánh, và chỉ lúc đó mới dời main. A phá bản duy nhất của việc trước khi kịp cất; C viết lại nhánh chung; D vứt commit chưa push nằm trong clone.',
          },
          {
            question: 'Chi has uncommitted edits in HomeServlet.java and types "git pull origin main". An changed the same file upstream. Git prints "Your local changes to the following files would be overwritten by merge … Aborting". What does it mean and what is safe?|||Chi có sửa chưa commit trong HomeServlet.java và gõ "git pull origin main". An đã sửa cùng tệp trên remote. Git in "Your local changes to the following files would be overwritten by merge … Aborting". Nghĩa là gì và làm gì an toàn?',
            options: [
              'The repository is corrupted; clone it again|||Kho bị hỏng; clone lại',
              'Git deleted her edits; recover them with git reflog|||Git đã xoá phần sửa của bạn ấy; khôi phục bằng git reflog',
              'Nothing was lost, the pull was refused; commit (or stash), then fetch and merge origin/main into her branch|||Không mất gì, pull bị từ chối; commit (hoặc stash), rồi fetch và merge origin/main vào nhánh của bạn ấy',
              'Run git pull --force to overwrite the file|||Chạy git pull --force để ghi đè tệp',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'The incoming commit touches a file with unsaved edits, so Git refuses rather than blend them: the pull did not happen and nothing was lost. Commit first (or stash), fetch, look at what is coming, then merge. There is no such thing as a safe pull --force here; and re-cloning (A) is the way to lose exactly the work the message was protecting.|||Commit sắp vào đụng một tệp có phần sửa chưa lưu, nên Git từ chối thay vì trộn: pull không xảy ra và không mất gì. Commit trước (hoặc stash), fetch, xem cái gì sắp về, rồi merge. Không có chuyện pull --force an toàn ở đây; và clone lại (A) là cách mất đúng phần việc mà thông báo đang bảo vệ.',
          },
          {
            question: 'Bình’s git push to main is rejected ("! [rejected] main -> main (fetch first)"). A teammate says: "just add --force". What is the right answer?|||git push lên main của Bình bị từ chối ("! [rejected] main -> main (fetch first)"). Một bạn bảo: "thêm --force là xong". Câu trả lời đúng là gì?',
            options: [
              'No: --force would delete the commit that someone else pushed; pull first (merge or rebase), then push|||Không: --force sẽ xoá commit mà người khác đã push; pull trước (merge hoặc rebase), rồi push',
              'Yes: --force only changes your own branch, so it is safe|||Được: --force chỉ đổi nhánh của riêng bạn nên an toàn',
              'Yes, but only on Fridays, when nobody pushes|||Được, nhưng chỉ vào thứ Sáu, khi không ai push',
              'No: delete the local main and recreate it from scratch|||Không: xoá main cục bộ và tạo lại từ đầu',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'The rejection means the remote main has a commit Bình lacks; forcing makes the remote forget it (the lab showed "(forced update)" and An’s commit vanishing from origin/main). The safe route is to integrate first: git pull --no-rebase (merge) or --rebase, then push. B is false: a force overwrites the shared branch, not "your own".|||Việc bị từ chối nghĩa là main trên remote có một commit Bình chưa có; force làm remote "quên" nó (lab đã cho thấy "(forced update)" và commit của An biến khỏi origin/main). Đường an toàn là tích hợp trước: git pull --no-rebase (merge) hoặc --rebase, rồi push. B sai: force ghi đè nhánh chung, không phải nhánh "của riêng bạn".',
          },
          {
            question: 'git status -sb shows "## main...origin/main [ahead 2]": two commits meant for a feature branch were made on main and nothing was pushed. Which sequence moves them safely?|||git status -sb hiện "## main...origin/main [ahead 2]": hai commit đáng lẽ thuộc nhánh tính năng đã làm trên main và chưa push gì. Chuỗi lệnh nào dời chúng an toàn?',
            options: [
              'git reset --hard origin/main, then git switch -c feature/x|||git reset --hard origin/main, rồi git switch -c feature/x',
              'git branch feature/x, git reset --hard origin/main, git switch feature/x|||git branch feature/x, git reset --hard origin/main, git switch feature/x',
              'git revert HEAD~2..HEAD, then git push|||git revert HEAD~2..HEAD, rồi git push',
              'git push --force origin main, then create the branch on GitHub|||git push --force origin main, rồi tạo nhánh trên GitHub',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'Create the branch at the current commit first, so the commits stay reachable, then reset main to origin/main and switch. A runs the reset before the commits are saved, and after it no branch points at them (only the reflog remembers). C and D publish the mistake — the commits have not left the laptop, so there is nothing to revert or force.|||Tạo nhánh tại commit hiện tại trước, để các commit còn với tới được, rồi reset main về origin/main và chuyển nhánh. A chạy reset trước khi cất commit, và sau đó không nhánh nào trỏ tới chúng (chỉ reflog còn nhớ). C và D công bố luôn lỗi — commit chưa rời laptop nên không có gì để revert hay force.',
          },
          {
            question: 'The same two commits were pushed to main and three teammates have already pulled them. Which fix is correct?|||Hai commit đó đã được push lên main và ba bạn đã pull chúng. Cách sửa nào đúng?',
            options: [
              'git reset --hard HEAD~2 and git push --force origin main|||git reset --hard HEAD~2 và git push --force origin main',
              'Ask everyone to delete their clones and clone again|||Nhờ mọi người xoá clone và clone lại',
              'git branch -D main on your laptop and push|||git branch -D main trên laptop của bạn và push',
              'Keep the work on a branch, then git revert HEAD~2..HEAD and push (a normal push)|||Giữ việc trên một nhánh, rồi git revert HEAD~2..HEAD và push (push thường)',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'On a shared branch history may only grow: revert adds two commits that cancel the mistake and everybody’s next pull is a fast-forward, while the work survives on its branch. A rewrites a branch three people already have; B and C do not undo anything on the remote.|||Trên nhánh chung lịch sử chỉ được dài thêm: revert thêm hai commit huỷ lỗi và lần pull kế của mọi người là fast-forward, còn việc vẫn sống trên nhánh của nó. A viết lại nhánh mà ba người đã có; B và C không hoàn tác được gì trên remote.',
          },
          {
            question: 'Looking at the history of main you see a merge titled "Merge nhanh trang-chu-moi (khong qua PR)" and the app now has two servlets mapped to /home. Which measure prevents the next one?|||Nhìn lịch sử main bạn thấy một merge tên "Merge nhanh trang-chu-moi (khong qua PR)" và ứng dụng giờ có hai servlet cùng ánh xạ /home. Biện pháp nào ngăn lần sau?',
            options: [
              'A ruleset on main requiring a pull request and an approval, with an empty bypass list, plus CODEOWNERS for web.xml|||Một ruleset trên main bắt buộc pull request và một lượt duyệt, danh sách bypass để trống, cộng CODEOWNERS cho web.xml',
              'Put the team leader on the bypass list so emergencies can be fixed quickly|||Đưa trưởng nhóm vào danh sách bypass để sửa khẩn cấp cho nhanh',
              'Ask everybody to be more careful before merging|||Nhắc mọi người cẩn thận hơn trước khi merge',
              'Rename main to master|||Đổi tên main thành master',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'Rules enforced by the server survive deadline pressure; reminders (C) do not. A bypass for the leader (B) re-opens exactly the shortcut that caused the accident. Renaming the branch (D) changes nothing. Check in Settings whether your plan allows rulesets; if not, agree the rule in writing and add a local pre-push hook.|||Luật do máy chủ thực thi sống qua áp lực hạn nộp; lời nhắc (C) thì không. Một lối bypass cho trưởng nhóm (B) mở lại đúng đường tắt đã gây tai nạn. Đổi tên nhánh (D) không đổi gì. Hãy kiểm trong Settings xem gói của bạn có cho ruleset không; nếu không, thoả thuận luật bằng văn bản và thêm hook pre-push cục bộ.',
          },
          {
            question: 'main already has the bad merge reverted with "git revert -m 1". Bình fixes his branch and runs "git merge feature/trang-chu-moi" on main: "Already up to date." What is going on and what is the way out?|||main đã revert merge hỏng bằng "git revert -m 1". Bình sửa nhánh của mình và chạy "git merge feature/trang-chu-moi" trên main: "Already up to date." Chuyện gì đang xảy ra và lối ra là gì?',
            options: [
              'The fix was lost; redo the whole feature from scratch|||Bản sửa đã mất; làm lại cả tính năng từ đầu',
              'GitHub caches the branch; wait ten minutes and merge again|||GitHub lưu đệm nhánh; chờ mười phút rồi merge lại',
              'The branch commits are already ancestors of main, so Git has nothing to merge; revert the revert (locally, before pushing), then merge the fixed branch|||Các commit của nhánh đã là tổ tiên của main nên Git không có gì để merge; revert cái revert (cục bộ, trước khi push), rồi merge nhánh đã sửa',
              'Use git merge --force to bring the commits back|||Dùng git merge --force để mang các commit về',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'Git merges only commits that are not yet ancestors. The original merge made them ancestors, and the revert is just another commit on top, so re-merging does nothing; merging a fixed branch without undoing the revert gives a confusing conflict instead. Reverting the revert restores the merged content, after which merging the fixed branch applies only the fix. Nothing is lost (A), caching is irrelevant (B), and git merge has no --force (D).|||Git chỉ merge các commit chưa là tổ tiên. Lần merge gốc đã biến chúng thành tổ tiên, và revert chỉ là một commit nữa nằm trên, nên merge lại không làm gì; merge nhánh đã sửa mà không huỷ revert thì cho một xung đột khó hiểu. Revert cái revert khôi phục nội dung đã merge, sau đó merge nhánh đã sửa chỉ áp bản sửa. Không mất gì (A), lưu đệm không liên quan (B), và git merge không có --force (D).',
          },
        ],
      },
    },
