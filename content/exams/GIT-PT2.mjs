/**
 * Git & GitHub — Progress Test 2 (Chương 5 → 9).
 *
 * Đề tự soạn, bám sát `content/courses/git/s05-remote-github.mjs` …
 * `s09-ruot-gan.mjs`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong
 * phòng thi.
 *
 * ⚠️ MỌI transcript, mọi thông báo lỗi và mọi mã băm trong đề này đều lấy từ
 * MỘT KHO NHÁP THẬT dựng trong scratchpad (NGOÀI kho api-backend): một kho trần
 * `srv.git` đóng vai GitHub cộng hai bản clone `an/` và `binh/` trên cùng đĩa,
 * chạy bằng
 *
 *     git version 2.51.1   (Homebrew, macOS arm64, 10/09/2026)
 *
 * với `GIT_CONFIG_GLOBAL` trỏ vào file rỗng và `GIT_CONFIG_SYSTEM=/dev/null`.
 * Mã băm là mã băm thật của kho nháp đó — không có mã băm nào bịa ra. Vài câu
 * dùng mã băm bảy ký tự dạng giữ chỗ (`3f8a1c9`, `9e2d4b7`) đúng như giáo trình
 * dùng; những chỗ đó không hỏi gì về giá trị của mã băm.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BA CHỖ MÁY KHÁC GIÁO TRÌNH (đo 10/09/2026, git 2.51.1)
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. DANH SÁCH VIỆC CỦA `git rebase -i` NAY CÓ DẤU `#`. Bài 3.5 in ra
 *        pick 9e2d4b7 feat(auth): add refresh token rotation
 *    Máy 2.51.1 in ra
 *        pick 9e2d4b7 # feat(auth): add refresh token rotation
 *    Tiêu đề bị đưa ra sau dấu thăng. Mọi script tự sinh todo mà cắt chuỗi theo
 *    "hash rồi tới subject" đều đọc sai từ bản này. Câu 24 hỏi đúng chỗ đó và
 *    theo MÁY.
 *
 * 2. Lỗi khi đặt `squash` ở dòng đầu nay viết thường: máy trả
 *        error: cannot 'squash' without a previous commit
 *    trong khi tài liệu và sách vở quen với `Cannot 'squash' …` chữ C hoa.
 *
 * 3. Lời từ chối push có BỐN dòng `hint:`, không phải ba như bài 5.3 chép. Bản
 *    2.51.1 thêm dòng cuối
 *        hint: See the 'Note about fast-forwards' in 'git push --help' for details.
 *    Đề chép đúng bản của máy.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh trong đề bài):
 *     { '0': 7, '1': 8, '2': 8, '3': 7 }   → A 7 · B 8 · C 8 · D 7
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/GIT-PT2.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/git-exam-kit.mjs';

export default {
  course: { slug: 'git' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 5–9 (remotes, pull requests, team workflow, rewriting history, internals)',
        'Kiểm tra tiến độ 2 — Chương 5–9 (remote, pull request, quy trình nhóm, viết lại lịch sử, ruột gan)',
      ),
      description: B(
        'The middle third of the Git course: remotes and authentication, pushing, forks, pull requests and review, merge strategies and branch protection, branching strategies, tags and releases, amend and force-with-lease, and the object database under .git/. 30 multiple-choice questions plus 2 programming questions you write here in the exam room.',
        'Một phần ba giữa của khoá Git: remote và xác thực, push, fork, pull request và review, chiến lược merge và bảo vệ nhánh, chiến lược nhánh, tag và phát hành, amend và force-with-lease, và kho đối tượng dưới .git/. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '5–9'),
      questions: [
        // ── Chương 5 — Remote & GitHub ──────────────────────────────────
        mcq({
          prompt: B(
            'Right after <code>git remote add origin …</code>, this appeared in <code>.git/config</code>:' + code(
              '[remote "origin"]\n' +
              '\turl = https://github.com/x/y.git\n' +
              '\tfetch = +refs/heads/*:refs/remotes/origin/*',
            ) + 'What does that second line say?',
            'Ngay sau <code>git remote add origin …</code>, đoạn này xuất hiện trong <code>.git/config</code>:' + code(
              '[remote "origin"]\n' +
              '\turl = https://github.com/x/y.git\n' +
              '\tfetch = +refs/heads/*:refs/remotes/origin/*',
            ) + 'Dòng thứ hai nói điều gì?',
          ),
          options: [
            B('It lists the branches allowed to be pushed; the <code>+</code> means new branches may be created on the remote as well as updated', 'Nó liệt kê những nhánh được phép push; dấu <code>+</code> nghĩa là được tạo nhánh mới trên remote chứ không chỉ cập nhật'),
            B('It is the fetch refspec: every branch on the remote (<code>refs/heads/*</code>) is mirrored into your local <code>refs/remotes/origin/*</code> namespace, and the <code>+</code> allows a non-fast-forward update of those tracking refs', 'Đó là refspec khi fetch: mọi nhánh trên remote (<code>refs/heads/*</code>) được ánh xạ vào không gian tên <code>refs/remotes/origin/*</code> ở máy bạn, và dấu <code>+</code> cho phép cập nhật không-fast-forward các ref theo dõi đó'),
            B('It maps your local branches onto remote ones so that <code>git push</code> knows which name to use on the far side, which is why <code>-u</code> is unnecessary', 'Nó ánh xạ nhánh cục bộ sang nhánh remote để <code>git push</code> biết dùng tên nào ở phía bên kia, và vì thế khỏi cần <code>-u</code>'),
            B('It is the tag refspec; branches are always fetched, and this line only exists so that annotated tags come along automatically', 'Đó là refspec cho tag; nhánh thì lúc nào cũng được fetch, dòng này chỉ tồn tại để tag có chú thích tự đi kèm'),
          ],
          correct: 1,
          explanation: EX(
            'Copied verbatim from the scratch repository. This one line is the whole mechanism behind remote-tracking branches: <code>origin/main</code> is not a view of the server, it is a local ref that <code>fetch</code> writes into using this mapping. That is why <code>origin/main</code> only ever changes when you run <code>fetch</code>, <code>pull</code> or <code>push</code> — and why <code>git log origin/main</code> after a week away confidently shows you last week\'s picture with no warning at all. The leading <code>+</code> matters when someone force-pushes: without it the tracking ref could not move backwards.',
            'Chép nguyên văn từ kho nháp. Một dòng này là toàn bộ cơ chế của nhánh theo dõi remote: <code>origin/main</code> không phải một cửa sổ nhìn vào máy chủ, nó là một ref cục bộ mà <code>fetch</code> ghi vào theo đúng ánh xạ trên. Vì thế <code>origin/main</code> chỉ đổi khi bạn chạy <code>fetch</code>, <code>pull</code> hay <code>push</code> — và vì thế <code>git log origin/main</code> sau một tuần vắng mặt tự tin cho bạn xem bức tranh của tuần trước mà không cảnh báo gì. Dấu <code>+</code> ở đầu có ý nghĩa khi ai đó force-push: thiếu nó thì ref theo dõi không lùi lại được.',
          ),
        }),

        mcq({
          prompt: B(
            'You push a new branch and Git answers:' + code(
              'To ../srv.git\n' +
              ' * [new branch]      feature/login -> feature/login\n' +
              "branch 'feature/login' set up to track 'origin/feature/login'.",
            ) + 'What did the <code>-u</code> in <code>git push -u origin feature/login</code> actually buy you?',
            'Bạn push một nhánh mới và Git trả lời:' + code(
              'To ../srv.git\n' +
              ' * [new branch]      feature/login -> feature/login\n' +
              "branch 'feature/login' set up to track 'origin/feature/login'.",
            ) + 'Cái <code>-u</code> trong <code>git push -u origin feature/login</code> thật ra mang lại gì?',
          ),
          options: [
            B('It marks the branch as protected on the remote, so that a later force-push from another clone is refused', 'Nó đánh dấu nhánh là được bảo vệ trên remote, nên một lần force-push sau đó từ bản clone khác sẽ bị từ chối'),
            B('It uploads the branch and every tag that points into it, which is the only reason a release workflow ever fires', 'Nó tải lên nhánh và mọi tag trỏ vào nhánh đó, và đó là lý do duy nhất một workflow phát hành được kích hoạt'),
            B('It records the upstream link, which is what makes bare <code>git push</code> and <code>git pull</code> work, lets <code>git status</code> say "ahead 2, behind 3", and makes <code>@{u}</code> resolvable', 'Nó ghi lại liên kết thượng nguồn — thứ làm cho <code>git push</code> và <code>git pull</code> trần chạy được, cho <code>git status</code> nói được "ahead 2, behind 3", và làm <code>@{u}</code> phân giải được'),
            B('It creates the branch on the remote; without it the push would have failed with "remote ref does not exist"', 'Nó tạo nhánh trên remote; không có nó thì lệnh push đã hỏng với "remote ref does not exist"'),
          ],
          correct: 2,
          explanation: EX(
            'Measured in the scratch clones: after <code>-u</code>, <code>git branch -vv</code> showed <code>* main 13d053d [origin/main] A</code>, and after both sides moved it read <code>[origin/main: ahead 1, behind 1]</code>. Without an upstream, a bare push fails with <code>fatal: The current branch has no upstream branch</code> — set <code>git config --global push.autoSetupRemote true</code> once and you never see it again. The quietly valuable part is <code>@{u}</code>: <code>git log --oneline @{u}..HEAD</code> is "what am I about to push?", the one-second check that catches a stray "wip" commit or a <code>.env</code> while it still costs nothing.',
            'Đã đo trên các bản clone nháp: sau <code>-u</code>, <code>git branch -vv</code> hiện <code>* main 13d053d [origin/main] A</code>, và sau khi cả hai bên cùng đi tiếp thì thành <code>[origin/main: ahead 1, behind 1]</code>. Không có thượng nguồn thì lệnh push trần hỏng với <code>fatal: The current branch has no upstream branch</code> — đặt <code>git config --global push.autoSetupRemote true</code> một lần là hết gặp. Phần giá trị âm thầm là <code>@{u}</code>: <code>git log --oneline @{u}..HEAD</code> chính là "tôi sắp push cái gì?", phép kiểm một giây bắt được một commit "wip" lạc lối hay một file <code>.env</code> khi nó còn sửa được với giá bằng không.',
          ),
        }),

        mcq({
          prompt: B(
            'Three different pushes were refused. Which reading of the three is correct?' + code(
              '! [rejected]        main -> main (fetch first)\n' +
              '! [rejected]        main -> main (non-fast-forward)\n' +
              '! [remote rejected] main -> main (protected branch hook declined)',
            ),
            'Ba lần push khác nhau đều bị từ chối. Cách đọc nào ĐÚNG?' + code(
              '! [rejected]        main -> main (fetch first)\n' +
              '! [rejected]        main -> main (non-fast-forward)\n' +
              '! [remote rejected] main -> main (protected branch hook declined)',
            ),
          ),
          options: [
            B('(1) someone else pushed while you worked — pull/rebase then push, never force. (2) your history diverged, usually because you rewrote commits the remote still has — <code>--force-with-lease</code>, and only on your own branch. (3) a branch protection rule said no — push a branch and open a pull request', '(1) ai đó đã push trong lúc bạn làm — pull/rebase rồi push, đừng bao giờ ép. (2) lịch sử của bạn phân ly, thường vì bạn viết lại commit mà remote vẫn giữ — <code>--force-with-lease</code>, và chỉ trên nhánh của chính bạn. (3) một luật bảo vệ nhánh nói không — hãy push lên một nhánh rồi mở pull request'),
            B('All three mean the same thing with different wording depending on the Git version; the fix is the same in every case: fetch, then push again', 'Cả ba nghĩa như nhau, chỉ khác chữ tuỳ phiên bản Git; cách sửa giống hệt nhau trong mọi trường hợp: fetch rồi push lại'),
            B('(1) and (2) are network failures that a retry usually fixes; only (3) is a real refusal, and it needs an administrator to unlock the branch', '(1) và (2) là hỏng mạng, thử lại thường là xong; chỉ (3) mới là từ chối thật, và nó cần quản trị viên mở khoá nhánh'),
            B('(1) your token expired, (2) your local clone is corrupt, (3) the branch does not exist on the remote yet — each one needs a fresh clone', '(1) token của bạn hết hạn, (2) bản clone của bạn hỏng, (3) nhánh chưa tồn tại trên remote — cái nào cũng cần clone lại'),
          ],
          correct: 0,
          explanation: EX(
            'The first two were reproduced in the scratch repository. <code>(fetch first)</code> came with four hint lines beginning <i>"Updates were rejected because the remote contains work that you do not have locally"</i>; <code>(non-fast-forward)</code> appeared after an <code>--amend</code> and said <i>"the tip of your current branch is behind"</i>. Same word "rejected", genuinely different situations. Read the refusal as INFORMATION, not as an obstacle: in case (1) it is Git protecting a colleague\'s commits, and reaching for <code>--force</code> there is how you delete work that only exists on the server.',
            'Hai cái đầu đã được tái hiện trong kho nháp. <code>(fetch first)</code> đi kèm bốn dòng hint mở đầu bằng <i>"Updates were rejected because the remote contains work that you do not have locally"</i>; <code>(non-fast-forward)</code> xuất hiện sau một lệnh <code>--amend</code> và ghi <i>"the tip of your current branch is behind"</i>. Cùng chữ "rejected", nhưng tình huống khác hẳn nhau. Hãy đọc lời từ chối như một THÔNG TIN chứ không phải một chướng ngại: ở ca (1) đó là Git đang bảo vệ commit của đồng nghiệp, và vớ lấy <code>--force</code> ở đó chính là cách bạn xoá mất phần việc chỉ còn tồn tại trên máy chủ.',
          ),
        }),

        mcq({
          prompt: B(
            'To "make push just work", a colleague ran:' + code(
              'git remote set-url origin https://ghp_XXXXXXXXXXXX@github.com/team/api.git',
            ) + 'It works. What is wrong with it?',
            'Để "cho push chạy được cái đã", một đồng nghiệp chạy:' + code(
              'git remote set-url origin https://ghp_XXXXXXXXXXXX@github.com/team/api.git',
            ) + 'Nó chạy được. Vậy sai ở đâu?',
          ),
          options: [
            B('Nothing, as long as the token is fine-grained and scoped to that one repository; this is the documented way to authenticate a CI checkout', 'Không sai gì, miễn là token loại fine-grained và chỉ giới hạn trong kho đó; đây là cách được ghi trong tài liệu để xác thực một lần checkout trong CI'),
            B('It only breaks on Windows, where the credential manager rewrites the URL and strips the token before the request goes out', 'Nó chỉ hỏng trên Windows, nơi trình quản lý chứng chỉ viết lại URL và cắt token đi trước khi request được gửi'),
            B('The token expires after one hour when embedded this way, so the setup has to be repeated every session', 'Token nhúng theo cách này sẽ hết hạn sau một giờ, nên phải làm lại mỗi phiên'),
            B('The token is now stored in plain text in <code>.git/config</code> and in the shell history, it is printed by <code>git remote -v</code>, and it ends up pasted into bug reports — a token is a password with permissions, so use a credential helper or SSH instead', 'Token giờ nằm chữ thô trong <code>.git/config</code> và trong lịch sử shell, bị <code>git remote -v</code> in ra, và rốt cuộc bị dán vào các báo cáo lỗi — token là một mật khẩu kèm quyền, hãy dùng credential helper hoặc SSH'),
          ],
          correct: 3,
          explanation: EX(
            'The nastiest part is <code>git remote -v</code>: the moment anyone debugs anything, the token is on screen and one copy-paste later it is in a chat thread. Same reason the lesson tells you to avoid <code>credential.helper store</code>, which writes to <code>~/.git-credentials</code> as plain text despite the reassuring name. Use the platform keychain (<code>osxkeychain</code>, <code>manager</code>, <code>libsecret</code>) or SSH. And never put a personal token on a server or in CI: if the box is compromised the attacker inherits access to EVERY repository you can reach, and the audit log carries your name.',
            'Chỗ khó chịu nhất là <code>git remote -v</code>: hễ có ai gỡ lỗi cái gì là token hiện lên màn hình, và một lần dán nữa là nó nằm trong một khung chat. Cũng vì lý do đó mà bài học dặn tránh <code>credential.helper store</code> — bất chấp cái tên nghe yên tâm, nó ghi vào <code>~/.git-credentials</code> dưới dạng chữ thô. Hãy dùng keychain của hệ điều hành (<code>osxkeychain</code>, <code>manager</code>, <code>libsecret</code>) hoặc SSH. Và đừng bao giờ đặt token cá nhân lên máy chủ hay trong CI: máy bị chiếm là kẻ tấn công thừa hưởng quyền vào MỌI kho bạn với tới được, còn nhật ký kiểm toán thì ghi tên bạn.',
          ),
        }),

        mcq({
          prompt: B(
            'You have a personal GitHub account and a work one, both with SSH keys loaded in the agent. Why does the lesson insist on <code>IdentitiesOnly yes</code> in <code>~/.ssh/config</code>?',
            'Bạn có một tài khoản GitHub cá nhân và một tài khoản công ty, cả hai đều đã nạp khoá SSH vào agent. Vì sao bài học nhấn mạnh phải có <code>IdentitiesOnly yes</code> trong <code>~/.ssh/config</code>?',
          ),
          options: [
            B('Without it SSH falls back to password authentication, which GitHub removed in 2021, so the connection fails with "Permission denied"', 'Thiếu nó thì SSH rơi về xác thực bằng mật khẩu, thứ GitHub đã bỏ từ 2021, nên kết nối hỏng với "Permission denied"'),
            B('Without it SSH offers every key in the agent in turn and GitHub authenticates you as whichever account matches FIRST — so you can silently push to the company repository under your personal identity', 'Thiếu nó thì SSH lần lượt đưa ra mọi khoá trong agent và GitHub xác thực bạn dưới tài khoản khớp ĐẦU TIÊN — nên bạn có thể âm thầm push vào kho công ty dưới danh tính cá nhân'),
            B('Without it the two keys are merged into a single identity file, and deleting one account\'s key breaks the other', 'Thiếu nó thì hai khoá bị gộp vào một file danh tính, và xoá khoá của một tài khoản là hỏng luôn cái kia'),
            B('It has no security effect; it only speeds up the handshake by skipping keys the server has already rejected once', 'Nó không có tác dụng bảo mật nào; nó chỉ làm cái bắt tay nhanh hơn nhờ bỏ qua những khoá máy chủ từng từ chối'),
          ],
          correct: 1,
          explanation: EX(
            'The failure is silent, which is what makes it expensive: the push succeeds, the commit lands, and the author is your personal account on a company repository — sometimes for months before anyone notices. <code>IdentitiesOnly yes</code> tells SSH to use exactly the <code>IdentityFile</code> named in that <code>Host</code> block and nothing else, so <code>git clone git@github-work:company/api.git</code> can only ever authenticate as the work identity. Pair it with a per-repository <code>git config user.email an@company.com</code> so the commit metadata matches the account too.',
            'Kiểu hỏng này im lặng, và chính vì thế nó đắt: lệnh push thành công, commit đáp xuống, và tác giả là tài khoản cá nhân của bạn trên một kho của công ty — đôi khi hàng tháng trời mới có người để ý. <code>IdentitiesOnly yes</code> bảo SSH chỉ dùng đúng cái <code>IdentityFile</code> khai trong khối <code>Host</code> đó và không dùng gì khác, nên <code>git clone git@github-work:company/api.git</code> chỉ có thể xác thực dưới danh tính công ty. Đi kèm với nó là <code>git config user.email an@company.com</code> đặt riêng cho từng kho, để siêu dữ liệu commit cũng khớp với tài khoản.',
          ),
        }),

        mcq({
          prompt: B(
            'A contributor opened pull request #431 against the project and then deleted their fork. You still need to test the code locally. What works?' + code(
              'git fetch upstream pull/431/head:pr-431\n' +
              'git switch pr-431',
            ),
            'Một người đóng góp mở pull request #431 vào dự án rồi xoá fork của họ. Bạn vẫn cần chạy thử mã đó ở máy. Cách nào chạy được?' + code(
              'git fetch upstream pull/431/head:pr-431\n' +
              'git switch pr-431',
            ),
          ),
          options: [
            B('Nothing works any more — a pull request is only a view of the contributor\'s fork, so deleting the fork deletes the code with it', 'Không cách nào còn chạy được — pull request chỉ là một cửa sổ nhìn vào fork của người đóng góp, xoá fork là xoá luôn mã'),
            B('It works, but only because GitHub keeps a 30-day grace copy of deleted forks; after that the ref is gone too', 'Nó chạy được, nhưng chỉ vì GitHub giữ bản sao ân hạn 30 ngày của fork đã xoá; sau đó cái ref cũng biến mất'),
            B('It works: GitHub exposes every pull request on the UPSTREAM repository as a ref under <code>pull/&lt;n&gt;/head</code>, which is independent of whether the contributor\'s fork still exists', 'Nó chạy được: GitHub phơi mọi pull request ra thành một ref dưới <code>pull/&lt;n&gt;/head</code> ngay trên kho THƯỢNG NGUỒN, độc lập với việc fork của người đóng góp còn hay không'),
            B('It works only for pull requests from branches on the same repository; for a fork you must ask the contributor to re-push before you can fetch anything', 'Nó chỉ chạy với pull request mở từ nhánh nằm trong cùng kho; với fork thì bạn phải nhờ người đóng góp push lại rồi mới fetch được'),
          ],
          correct: 2,
          explanation: EX(
            'When a pull request is opened, GitHub copies the head commit into the upstream repository under a ref you can fetch by number. That is why maintainers can still build, test and even rescue a contribution long after the fork is gone. The same trick makes review comfortable: <code>gh pr checkout 431</code> does exactly this behind the scenes. Worth knowing before you need it — like the Events API trick for finding the commit a branch pointed at before someone force-pushed over it.',
            'Khi một pull request được mở, GitHub chép commit đầu nhánh vào chính kho thượng nguồn dưới một ref mà bạn fetch được theo số. Vì thế người bảo trì vẫn dựng được, kiểm được, thậm chí cứu được một đóng góp rất lâu sau khi fork đã biến mất. Cũng mẹo đó làm việc review dễ chịu: <code>gh pr checkout 431</code> thật ra làm đúng chuyện này ở bên dưới. Đáng biết TRƯỚC khi cần tới — giống mẹo dùng Events API để tìm commit mà một nhánh từng trỏ vào trước khi có người force-push đè lên.',
          ),
        }),

        // ── Chương 6 — Pull request & review ────────────────────────────
        mcq({
          prompt: B(
            'You open a pull request as a <b>draft</b> (<code>gh pr create --draft</code>). Which description is correct?',
            'Bạn mở một pull request ở dạng <b>nháp</b> (<code>gh pr create --draft</code>). Mô tả nào ĐÚNG?',
          ),
          options: [
            B('It cannot be merged and does not request review, but CI still runs and colleagues can still comment — so it is the right way to share direction early', 'Nó không merge được và không yêu cầu review, nhưng CI vẫn chạy và đồng nghiệp vẫn bình luận được — nên đó là cách đúng để chia sẻ hướng đi từ sớm'),
            B('It is a private note visible only to you until you publish it; nobody else can see the branch, the diff or the CI result', 'Nó là một ghi chú riêng chỉ mình bạn thấy cho tới khi công bố; không ai khác nhìn được nhánh, bản diff hay kết quả CI'),
            B('It behaves exactly like a normal pull request except that the merge button is labelled differently, which is purely cosmetic', 'Nó y hệt một pull request bình thường, chỉ khác cái nhãn trên nút merge — thuần trang trí'),
            B('It skips CI entirely to save runner minutes, which is why you must mark it ready before any check can report a result', 'Nó bỏ hẳn CI để tiết kiệm phút chạy, nên bạn phải đánh dấu sẵn sàng thì mới có phép kiểm nào báo kết quả'),
          ],
          correct: 0,
          explanation: EX(
            'A draft is for "here is where I am going, does the shape look right?" — the expensive mistake it prevents is three days of work in the wrong direction. Because CI runs, you also get the type check and the tests on every push while the work is still cheap to change. What it does NOT do is spare you from writing a description: the reviewer still needs to know what and why. Mark it ready when you would be comfortable merging it as is.',
            'Bản nháp dành cho câu "tôi đang đi hướng này, hình dạng có ổn không?" — sai lầm đắt đỏ mà nó ngăn được là ba ngày làm việc sai hướng. Vì CI vẫn chạy nên bạn cũng nhận được phần kiểm kiểu và test ở mỗi lần push, lúc mà việc sửa còn rẻ. Thứ nó KHÔNG làm hộ là viết phần mô tả: người review vẫn cần biết cái gì và vì sao. Hãy đánh dấu sẵn sàng khi bạn thấy yên tâm nếu nó được merge nguyên như thế.',
          ),
        }),

        mcq({
          prompt: B(
            'GitHub review verdicts are <b>Comment</b>, <b>Approve</b> and <b>Request changes</b>. What is the practical difference, and what warning does the course attach to one of them?',
            'Ba loại phán quyết khi review trên GitHub là <b>Comment</b>, <b>Approve</b> và <b>Request changes</b>. Khác biệt thực tế là gì, và bài học cảnh báo gì về một trong ba?',
          ),
          options: [
            B('Approve is advisory and Request changes is advisory too; only branch protection can block a merge, and it counts approvals without looking at change requests', 'Approve chỉ mang tính tham khảo và Request changes cũng thế; chỉ bảo vệ nhánh mới chặn được merge, và nó đếm số lượt duyệt chứ không nhìn tới các yêu cầu sửa'),
            B('Comment auto-approves after 24 hours, Approve is permanent, and Request changes can be cleared by any other reviewer on the team', 'Comment tự chuyển thành duyệt sau 24 giờ, Approve là vĩnh viễn, còn Request changes thì bất kỳ người review nào khác trong nhóm cũng gỡ được'),
            B('Request changes is the default verdict for any review containing at least one comment, which is why the course tells you to prefix optional remarks with "nit:"', 'Request changes là phán quyết mặc định cho mọi lượt review có ít nhất một bình luận, và vì thế bài học dặn gắn tiền tố "nit:" cho các nhận xét tuỳ chọn'),
            B('Comment carries no verdict, Approve says "I am comfortable with this going to production", and Request changes BLOCKS the merge under branch protection until the SAME reviewer re-reviews — a forgotten one from someone on holiday can freeze a piece of work for a week', 'Comment không kèm phán quyết, Approve nghĩa là "tôi thấy yên tâm khi cái này lên production", còn Request changes CHẶN merge dưới luật bảo vệ nhánh cho tới khi CHÍNH người đó review lại — một cái bị quên của người đang đi nghỉ có thể đóng băng một phần việc cả tuần'),
          ],
          correct: 3,
          explanation: EX(
            'That blocking property is what makes "Request changes" a decision, not an opinion — reserve it for correctness, security and data loss, never for taste. Style belongs in a <code>nit:</code> comment or, better, in a formatter that runs automatically. The other half of the etiquette is the comment weights the lesson gives: <code>blocking:</code>, <code>question:</code>, <code>nit:</code> and <code>praise:</code> — with no such prefix, every remark reads to the author like a demand.',
            'Chính đặc tính chặn merge làm cho "Request changes" là một quyết định chứ không phải một ý kiến — hãy dành nó cho tính đúng đắn, bảo mật và mất dữ liệu, đừng bao giờ dùng cho gu thẩm mỹ. Chuyện kiểu cách thuộc về một bình luận <code>nit:</code>, hoặc tốt hơn là một formatter chạy tự động. Nửa còn lại của phép lịch sự là bốn nhãn sức nặng mà bài nêu: <code>blocking:</code>, <code>question:</code>, <code>nit:</code> và <code>praise:</code> — không có tiền tố nào thì mọi nhận xét đọc lên với tác giả đều như một yêu sách.',
          ),
        }),

        mcq({
          prompt: B(
            'You are reviewing a 300-line pull request and have eleven remarks. Why does the course insist on "Start a review" instead of posting each one with "Add single comment"?',
            'Bạn đang review một pull request 300 dòng và có mười một nhận xét. Vì sao bài học nhấn mạnh phải dùng "Start a review" thay vì gửi từng cái bằng "Add single comment"?',
          ),
          options: [
            B('Single comments are not attached to a commit, so they disappear the moment the author pushes again', 'Bình luận lẻ không gắn với commit nào nên biến mất ngay khi tác giả push lần nữa'),
            B('Each single comment sends its own notification — fifteen in twenty minutes is fifteen interruptions, and the author starts answering remark number three while you are still forming remark number eleven', 'Mỗi bình luận lẻ gửi một thông báo riêng — mười lăm cái trong hai mươi phút là mười lăm lần cắt ngang, và tác giả bắt đầu trả lời nhận xét số ba trong khi bạn còn đang hình thành ý ở nhận xét số mười một'),
            B('Single comments cannot contain suggestion blocks, so the author has to apply every change by hand', 'Bình luận lẻ không chứa được khối suggestion nên tác giả phải tự áp từng thay đổi bằng tay'),
            B('GitHub rate-limits single comments to five per pull request per hour, so the eleventh one would be silently dropped', 'GitHub giới hạn năm bình luận lẻ mỗi pull request mỗi giờ, nên cái thứ mười một sẽ bị bỏ đi trong im lặng'),
          ],
          correct: 1,
          explanation: EX(
            'A batched review arrives as one event with one verdict, which is what lets the author read it as a coherent argument instead of a drip feed. It also protects you: half-formed remarks can be edited or deleted before you submit, and the picture you have after reading file nine often changes what you wanted to say about file two. The related habit is the reading order — description and linked issue, then the tests, then the main change, then config, migrations and generated files, which is where secrets hide.',
            'Một lượt review gom lại tới nơi như MỘT sự kiện với MỘT phán quyết, và đó là thứ giúp tác giả đọc nó như một lập luận liền mạch thay vì một dòng nhỏ giọt. Nó cũng bảo vệ chính bạn: những nhận xét còn dở dang vẫn sửa hoặc xoá được trước khi gửi, và bức tranh bạn có sau khi đọc tới file thứ chín thường làm đổi cả điều bạn định nói ở file thứ hai. Thói quen đi kèm là thứ tự đọc — mô tả và issue liên kết, rồi tới các test, rồi thay đổi chính, rồi cấu hình, migration và file sinh tự động, đó là chỗ bí mật hay nấp.',
          ),
        }),

        mcq({
          prompt: B(
            'A reviewer leaves a <code>suggestion</code> block on your pull request. What happens when you click "Apply suggestion", and when should a reviewer NOT use one?',
            'Một người review để lại một khối <code>suggestion</code> trên pull request của bạn. Khi bạn bấm "Apply suggestion" thì chuyện gì xảy ra, và khi nào người review KHÔNG nên dùng nó?',
          ),
          options: [
            B('It opens the file in the web editor with the change pre-typed; nothing is committed until you press save, so it is safe for any size of change', 'Nó mở file trong trình soạn thảo web với thay đổi đã gõ sẵn; không có gì được commit cho tới khi bạn bấm lưu, nên nó an toàn với thay đổi cỡ nào cũng được'),
            B('It records the reviewer\'s preference as metadata that CI can enforce later; the code itself is unchanged until the author edits it locally', 'Nó ghi lại lựa chọn của người review dưới dạng siêu dữ liệu để CI cưỡng chế về sau; bản thân mã không đổi cho tới khi tác giả tự sửa ở máy'),
            B('It becomes a real commit on your branch, authored through the reviewer\'s suggestion — ideal for a typo, a name or a one-line fix, and wrong for anything the author needs to think about, because applying a suggestion is not the same as understanding it', 'Nó trở thành một commit thật trên nhánh của bạn, tạo ra từ chính gợi ý của người review — lý tưởng cho lỗi chính tả, cách đặt tên hay một bản vá một dòng, và sai với bất cứ thứ gì tác giả cần suy nghĩ, vì áp một gợi ý không giống với hiểu nó'),
            B('It is rejected unless the reviewer has write access to the branch, which contributors from a fork never have', 'Nó bị từ chối trừ khi người review có quyền ghi vào nhánh, thứ mà người đóng góp từ một fork không bao giờ có'),
          ],
          correct: 2,
          explanation: EX(
            'One button, one commit, no round trip — which is exactly why it is the right tool for the small stuff and the wrong tool for a design question. If the fix requires the author to reason about it, ask the question instead and let them write the answer; otherwise you have moved the thinking into your own head and left the author maintaining code they did not reason through. The related discipline for the author: push fixes as NEW commits during review, so the reviewer can see what changed since last time, and squash at merge.',
            'Một cái nút, một commit, không phải đi đi lại lại — và chính vì thế nó là công cụ đúng cho những thứ nhỏ và là công cụ sai cho một câu hỏi thiết kế. Nếu bản sửa đòi tác giả phải suy nghĩ thì hãy hỏi, và để họ tự viết câu trả lời; nếu không thì bạn đã dời phần suy nghĩ vào đầu mình và để tác giả ở lại bảo trì đoạn mã mà họ chưa từng nghĩ thấu. Kỷ luật đi kèm cho tác giả: trong lúc review, hãy đẩy bản sửa thành commit MỚI để người review thấy được cái gì đã đổi từ lần trước, rồi gộp lại lúc merge.',
          ),
        }),

        mcq({
          prompt: B(
            'A push to <code>main</code> is refused like this. What exactly refused it, and what is the fix?' + code(
              'remote: error: GH006: Protected branch update failed for refs/heads/main.\n' +
              'remote: error: Changes must be made through a pull request.\n' +
              ' ! [remote rejected] main -> main (protected branch hook declined)',
            ),
            'Một lệnh push lên <code>main</code> bị từ chối như sau. Chính xác thì cái gì đã từ chối, và sửa thế nào?' + code(
              'remote: error: GH006: Protected branch update failed for refs/heads/main.\n' +
              'remote: error: Changes must be made through a pull request.\n' +
              ' ! [remote rejected] main -> main (protected branch hook declined)',
            ),
          ),
          options: [
            B('A server-side hook enforcing a branch protection rule — nothing local can bypass it (<code>--no-verify</code> and <code>--force</code> included); push to a branch and open a pull request', 'Một hook phía máy chủ đang cưỡng chế một luật bảo vệ nhánh — không thứ gì ở máy bạn bỏ qua được nó (kể cả <code>--no-verify</code> và <code>--force</code>); hãy push lên một nhánh rồi mở pull request'),
            B('Your local <code>pre-push</code> hook — the <code>remote:</code> prefix only means the message mentions a remote ref; delete the hook or pass <code>--no-verify</code>', 'Hook <code>pre-push</code> ở máy bạn — tiền tố <code>remote:</code> chỉ nghĩa là thông báo có nhắc tới một ref của remote; hãy xoá hook hoặc truyền <code>--no-verify</code>'),
            B('The remote is out of date; the rule disappears once you fetch, because branch protection is evaluated against your tracking ref', 'Remote đang cũ; luật đó biến mất sau khi bạn fetch, vì bảo vệ nhánh được đánh giá dựa trên ref theo dõi của bạn'),
            B('Your token is missing the <code>workflow</code> scope, which GitHub reports with the generic GH006 code whenever the push touches a protected ref', 'Token của bạn thiếu quyền <code>workflow</code>, và GitHub báo bằng mã chung GH006 mỗi khi lệnh push đụng vào một ref được bảo vệ'),
          ],
          correct: 0,
          explanation: EX(
            'Every <code>remote:</code> line was produced on the server, which is what makes this class of refusal different from anything a local hook does: there is no flag to get past it. That is the point — a client-side hook is a convenience, a server-side rule is a control. The pair of rules that actually keeps <code>main</code> green is "require status checks to pass" PLUS "require branches to be up to date"; either one alone still leaves the hole where two pull requests each pass on their own and break each other once both land.',
            'Mọi dòng <code>remote:</code> đều do máy chủ sinh ra, và đó là điều làm nhóm từ chối này khác hẳn mọi thứ một hook cục bộ làm được: không có cờ nào vượt qua nó. Đó chính là ý đồ — hook ở máy là một tiện lợi, luật ở máy chủ mới là một biện pháp kiểm soát. Cặp luật thật sự giữ cho <code>main</code> xanh là "bắt buộc kiểm tra trạng thái phải qua" CỘNG "bắt buộc nhánh phải cập nhật"; chỉ một trong hai thì vẫn còn cái lỗ hai pull request tách riêng cái nào cũng qua mà nhập lại thì phá nhau.',
          ),
        }),

        mcq({
          prompt: B(
            'Your team uses <b>Squash and merge</b> for everything. Branch <code>feature/base</code> is long-lived and <code>feature/child</code> was branched off it. What does the course warn will happen?',
            'Nhóm của bạn dùng <b>Squash and merge</b> cho mọi thứ. Nhánh <code>feature/base</code> sống lâu và <code>feature/child</code> được rẽ ra từ nó. Bài học cảnh báo chuyện gì sẽ xảy ra?',
          ),
          options: [
            B('Nothing special happens: squash rewrites only the commit MESSAGES and leaves the underlying objects alone, so both branches still share the same commit hashes and the second merge is a clean fast-forward', 'Không có gì đặc biệt: squash chỉ viết lại LỜI NHẮN commit và để yên các đối tượng bên dưới, nên hai nhánh vẫn dùng chung mã băm commit và lần merge thứ hai là một fast-forward sạch sẽ'),
            B('GitHub detects the situation and blocks the second merge with a message telling you to rebase the child branch first, so the problem is always caught in the interface before it can ever reach main', 'GitHub phát hiện tình huống này và chặn lần merge thứ hai kèm thông báo bảo bạn rebase nhánh con trước, nên vấn đề luôn được bắt ngay trên giao diện trước khi kịp tới main'),
            B('The child branch is deleted automatically along with its parent when the parent is squash-merged, which is exactly what the "automatically delete head branches" setting in the repository does', 'Nhánh con bị xoá tự động cùng với nhánh cha khi nhánh cha được squash-merge, và đó đúng là việc mà thiết lập "tự động xoá nhánh nguồn" trong kho thực hiện'),
            B('Squashing <code>feature/base</code> puts a NEW commit on main, so <code>feature/child</code> — built on the originals — now has a history with no common head; merging it replays the same changes as "new" work that conflicts with itself. Merge a branch that has children with a merge commit, not a squash', 'Gộp <code>feature/base</code> đặt một commit MỚI lên main, nên <code>feature/child</code> — vốn dựng trên các commit gốc — giờ có lịch sử không còn đầu chung; merge nó là phát lại đúng những thay đổi đó như công việc "mới" và xung đột với chính nó. Nhánh nào có nhánh con thì merge bằng commit hợp nhất, đừng squash'),
          ],
          correct: 3,
          explanation: EX(
            'Squash is the right default for most teams — one pull request, one commit, one revert, and a history where <code>git bisect</code> only ever lands on states that passed CI as a whole. The cost lands exactly here: the branch commits do not survive, so anything built on them is orphaned by hash. The rule of thumb from the lesson is short: if a branch has children, merge it with a merge commit. And remember the other squash consequence — the PULL REQUEST TITLE becomes the permanent commit message on main, so "Fixes" is what your history will say forever.',
            'Squash là mặc định đúng cho phần lớn nhóm — một pull request, một commit, một lần revert, và một lịch sử mà <code>git bisect</code> chỉ đáp xuống những trạng thái đã qua CI trọn khối. Cái giá rơi đúng vào đây: các commit của nhánh không sống sót, nên mọi thứ dựng trên chúng đều mồ côi theo mã băm. Nguyên tắc trong bài rất ngắn: nhánh nào có nhánh con thì merge bằng commit hợp nhất. Và nhớ luôn hệ quả kia của squash — TIÊU ĐỀ PULL REQUEST trở thành lời nhắn commit vĩnh viễn trên main, nên "Sửa lỗi" sẽ là thứ lịch sử của bạn ghi lại mãi mãi.',
          ),
        }),

        // ── Chương 7 — Quy trình nhóm, tag & phát hành ──────────────────
        mcq({
          prompt: B(
            'Your product is a web application with exactly one version running in production, deployed most days. Which branching strategy does the course prescribe, and on what basis is the choice made?',
            'Sản phẩm của bạn là một web app chỉ có đúng một phiên bản chạy trên production, gần như ngày nào cũng deploy. Bài học chỉ định chiến lược nhánh nào, và dựa trên cơ sở gì?',
          ),
          options: [
            B('git-flow, because it is the most complete model and the extra branches cost nothing when you deploy often', 'git-flow, vì nó là mô hình đầy đủ nhất và mấy nhánh phụ chẳng tốn gì khi bạn deploy thường xuyên'),
            B('GitHub flow — branch from main, open a pull request, merge, deploy — and the choice is made by how you RELEASE, not by how you write code; git-flow is for software shipped in multiple supported versions', 'GitHub flow — rẽ nhánh từ main, mở pull request, merge, deploy — và lựa chọn được quyết bởi cách bạn PHÁT HÀNH chứ không phải cách bạn viết mã; git-flow dành cho phần mềm giao khách chạy nhiều phiên bản được hỗ trợ'),
            B('Whichever the team already knows; the models are interchangeable and the only thing that matters is that everybody uses the same one', 'Cái nào nhóm đã quen thì dùng; các mô hình thay thế nhau được và điều duy nhất quan trọng là mọi người dùng chung một cái'),
            B('Trunk-based, unconditionally — it is the modern replacement for both of the others and requires nothing beyond short branches', 'Trunk-based, không điều kiện gì — nó là bản thay thế hiện đại cho cả hai cái kia và không đòi hỏi gì ngoài việc giữ nhánh ngắn'),
          ],
          correct: 1,
          explanation: EX(
            'Three questions decide it: is more than one version live (yes → you need release branches), can you deploy any day (yes → GitHub flow), and do you already have a solid test suite and feature flags (yes → trunk-based is within reach). git-flow is the most misapplied model in the industry — its own author later noted it was designed for versioned, shipped software. cuongthai.com runs GitHub flow with one deliberate twist: a push to <code>main</code> does NOT deploy. Deploying is a script a human runs, because your branching model and your deploy trigger are two separate decisions.',
            'Ba câu hỏi quyết định: có hơn một phiên bản đang chạy không (có → cần nhánh phát hành), ngày nào cũng deploy được không (được → GitHub flow), và đã có bộ test chắc cùng cờ tính năng chưa (có → trunk-based nằm trong tầm với). git-flow là mô hình bị áp dụng sai chỗ nhiều nhất trong nghề — chính tác giả của nó về sau ghi chú rằng nó được thiết kế cho phần mềm có phiên bản, giao cho khách. cuongthai.com chạy GitHub flow với một điểm xoắn có chủ ý: một lần push vào <code>main</code> KHÔNG deploy. Triển khai là một script do người chạy, vì mô hình nhánh và cơ chế kích hoạt deploy là hai quyết định tách biệt.',
          ),
        }),

        mcq({
          prompt: B(
            'A repository standardises on branch names like <code>feature/user-profile</code>, <code>fix/login-500</code>, <code>hotfix/payment-timeout</code>, <code>chore/bump-prisma</code>, <code>release/1.5.0</code> and <code>an/spike-webgl</code>. Beyond tidiness, what does the consistency buy?',
            'Một kho thống nhất đặt tên nhánh kiểu <code>feature/user-profile</code>, <code>fix/login-500</code>, <code>hotfix/payment-timeout</code>, <code>chore/bump-prisma</code>, <code>release/1.5.0</code> và <code>an/spike-webgl</code>. Ngoài chuyện gọn gàng, sự nhất quán đó mang lại gì?',
          ),
          options: [
            B('Git itself enforces different merge rules per prefix — <code>hotfix/</code> branches, for example, are exempt from fast-forward restrictions', 'Bản thân Git áp luật merge khác nhau theo tiền tố — ví dụ nhánh <code>hotfix/</code> được miễn các hạn chế fast-forward'),
            B('Each prefix creates a separate ref namespace on the remote, so two people can use the same branch name under different prefixes without colliding', 'Mỗi tiền tố tạo một không gian tên ref riêng trên remote, nên hai người dùng cùng tên nhánh dưới hai tiền tố khác nhau mà không đụng nhau'),
            B('<code>git branch --list \'fix/*\'</code> becomes useful, the GitHub UI groups branches by prefix, and CI can apply different rules per prefix — a name is a filter, not decoration', '<code>git branch --list \'fix/*\'</code> trở nên hữu ích, giao diện GitHub gom nhánh theo tiền tố, và CI áp được luật khác nhau theo tiền tố — cái tên là một bộ lọc, không phải đồ trang trí'),
            B('Branch protection rules can only be written against prefixed names, so an unprefixed branch can never be protected', 'Luật bảo vệ nhánh chỉ viết được cho tên có tiền tố, nên một nhánh không tiền tố thì không bao giờ bảo vệ được'),
          ],
          correct: 2,
          explanation: EX(
            'The slash is a real directory under <code>refs/heads/</code>, which is why the pattern filters work at all — and also why you can never have both a branch called <code>feature</code> and a branch called <code>feature/login</code> in the same repository: one path would have to be a file and a directory at the same time. Note the personal prefix in the list: <code>an/spike-webgl</code> tells everyone at a glance that the branch is a scratch experiment and nobody should build on it.',
            'Dấu gạch chéo là một thư mục thật dưới <code>refs/heads/</code>, và đó là lý do các mẫu lọc chạy được — cũng là lý do bạn không bao giờ có đồng thời một nhánh tên <code>feature</code> và một nhánh tên <code>feature/login</code> trong cùng một kho: một đường dẫn sẽ phải vừa là file vừa là thư mục. Để ý cái tiền tố cá nhân trong danh sách: <code>an/spike-webgl</code> nói ngay cho mọi người rằng nhánh đó là chỗ nháp thử nghiệm và đừng ai dựng gì lên trên nó.',
          ),
        }),

        mcq({
          prompt: B(
            'You tagged <code>v1.5.0</code>, pushed it, and ten minutes later realise it points at the wrong commit. Six colleagues have already fetched. What does the course prescribe?',
            'Bạn gắn tag <code>v1.5.0</code>, đã push, và mười phút sau nhận ra nó trỏ nhầm commit. Sáu đồng nghiệp đã fetch về rồi. Bài học chỉ định làm gì?',
          ),
          options: [
            B('Publish <code>v1.5.1</code> instead. Moving a published tag is a history rewrite for everyone who fetched it — their local <code>v1.5.0</code> keeps pointing at the old commit and Git will not silently update it, so "version 1.5.0" comes to mean two different things depending on whom you ask', 'Hãy công bố <code>v1.5.1</code>. Dời một tag đã công bố là một lần viết lại lịch sử với mọi người đã fetch nó — <code>v1.5.0</code> ở máy họ vẫn trỏ vào commit cũ và Git sẽ không âm thầm cập nhật, nên "phiên bản 1.5.0" trở thành hai thứ khác nhau tuỳ bạn hỏi ai'),
            B('Delete and recreate the tag; Git detects the change on the next fetch and updates every clone automatically, so no coordination is needed', 'Xoá rồi tạo lại tag; Git phát hiện thay đổi ở lần fetch kế tiếp và tự cập nhật mọi bản clone, nên khỏi cần phối hợp gì'),
            B('Convert it to a lightweight tag first — lightweight tags are allowed to move, annotated ones are not, which is the practical difference between the two kinds', 'Đổi nó sang tag nhẹ trước — tag nhẹ thì được phép dời, tag có chú thích thì không, và đó là khác biệt thực tế giữa hai loại'),
            B('Force-push the tag and tell nobody; a tag is only a label, so nothing downstream can depend on where it points', 'Force-push cái tag và đừng báo ai; tag chỉ là một cái nhãn nên không có gì phía sau phụ thuộc vào chỗ nó trỏ'),
          ],
          correct: 0,
          explanation: EX(
            'A tag is the one pointer that is supposed to never move — in six months <code>v1.5.0</code> still has to mean exactly those forty characters. If you catch it within a few minutes and tell the team, deleting and recreating (locally, then <code>git push origin --delete v1.5.0</code>, then re-tag and push) is survivable. Never do it to a tag that a release artifact was already built from: the artifact and the tag then disagree, and there is no way for anyone downstream to notice.',
            'Tag là con trỏ duy nhất lẽ ra không bao giờ được dịch chuyển — sáu tháng nữa, <code>v1.5.0</code> vẫn phải có nghĩa là đúng bốn mươi ký tự đó. Nếu bạn phát hiện trong vòng vài phút và báo cả nhóm thì xoá rồi tạo lại (ở cục bộ, rồi <code>git push origin --delete v1.5.0</code>, rồi gắn tag lại và push) vẫn sống được. Đừng bao giờ làm thế với một tag mà sản phẩm phát hành đã được dựng từ đó: khi ấy sản phẩm và tag nói hai điều khác nhau, và không ai ở phía sau có cách nào nhận ra.',
          ),
        }),

        mcq({
          prompt: B(
            'A build ran <code>git describe --tags</code> in a repository whose newest annotated tag is <code>v1.0.0</code>, and got:' + code(
              'v1.0.0-2-g799e644',
            ) + 'How do you read the three parts, and what does <code>--dirty</code> add?',
            'Một bản dựng chạy <code>git describe --tags</code> trong một kho mà tag có chú thích mới nhất là <code>v1.0.0</code>, và nhận được:' + code(
              'v1.0.0-2-g799e644',
            ) + 'Ba phần đó đọc thế nào, và <code>--dirty</code> thêm gì?',
          ),
          options: [
            B('Tag, then the number of files changed since the tag, then the hash of the tag object itself; <code>--dirty</code> appends the name of the current branch', 'Tag, rồi số file đã đổi kể từ tag đó, rồi mã băm của chính đối tượng tag; <code>--dirty</code> nối thêm tên nhánh hiện tại'),
            B('Tag, then the semver patch number, then the abbreviated tree hash; <code>--dirty</code> appends <code>-dirty</code> when the build ran on a machine with untracked files', 'Tag, rồi số patch của semver, rồi mã băm tree rút gọn; <code>--dirty</code> nối thêm <code>-dirty</code> khi bản dựng chạy trên máy có file chưa theo dõi'),
            B('Tag, then the number of commits since the tag on the current branch, then the hash of the tag\'s target commit; <code>--dirty</code> is silent unless the tag itself was moved', 'Tag, rồi số commit kể từ tag đó trên nhánh hiện tại, rồi mã băm của commit mà tag trỏ vào; <code>--dirty</code> im lặng trừ khi chính cái tag bị dời'),
            B('Nearest reachable tag, then the number of commits since it, then the CURRENT commit prefixed with <code>g</code> for git; <code>--dirty</code> appends <code>-dirty</code> when the working tree has uncommitted changes', 'Tag gần nhất với tới được, rồi số commit kể từ nó, rồi commit HIỆN TẠI có tiền tố <code>g</code> nghĩa là git; <code>--dirty</code> nối thêm <code>-dirty</code> khi cây làm việc còn thay đổi chưa commit'),
          ],
          correct: 3,
          explanation: EX(
            'Measured: two empty commits after tagging <code>v1.0.0</code> produced exactly that string, with <code>799e644</code> being <code>HEAD</code>. This is the standard way to stamp a build, and <code>--dirty</code> is what tells you six months later that an artifact was produced from a tree nobody committed. One trap worth knowing before CI bites you: only ANNOTATED tags count by default, and a shallow clone has none — in the same lab, <code>git clone --depth 1</code> followed by <code>git describe</code> answered <code>fatal: No names found, cannot describe anything.</code>',
            'Đã đo: hai commit rỗng sau khi gắn tag <code>v1.0.0</code> cho ra đúng chuỗi đó, với <code>799e644</code> chính là <code>HEAD</code>. Đây là cách chuẩn để đóng dấu phiên bản lên một bản dựng, và <code>--dirty</code> là thứ nói cho bạn biết sáu tháng sau rằng sản phẩm đó được tạo ra từ một cái cây chẳng ai commit. Một cái bẫy đáng biết trước khi CI cắn: mặc định chỉ tag CÓ CHÚ THÍCH mới được tính, mà một bản clone nông thì không có tag nào — trong cùng phòng thí nghiệm đó, <code>git clone --depth 1</code> rồi <code>git describe</code> trả lời <code>fatal: No names found, cannot describe anything.</code>',
          ),
        }),

        mcq({
          prompt: B(
            'A Node project cuts releases with these two commands. What does each one do?' + code(
              'npm version minor\n' +
              'git push --follow-tags',
            ),
            'Một dự án Node cắt bản phát hành bằng hai lệnh này. Mỗi lệnh làm gì?' + code(
              'npm version minor\n' +
              'git push --follow-tags',
            ),
          ),
          options: [
            B('The first only edits <code>package.json</code>; the second pushes commits and then every tag that exists locally, which is why stray experimental tags reach the server too', 'Lệnh đầu chỉ sửa <code>package.json</code>; lệnh sau push commit rồi push mọi tag đang có ở máy, và vì thế các tag thử nghiệm lạc lõng cũng lên máy chủ theo'),
            B('The first bumps the version, commits that change, AND creates an annotated tag; the second pushes the commits plus the ANNOTATED tags that point into them — which is what actually fires a <code>on: push: tags:</code> release workflow', 'Lệnh đầu tăng số phiên bản, commit thay đổi đó, VÀ tạo một tag có chú thích; lệnh sau push commit cộng những tag CÓ CHÚ THÍCH trỏ vào chúng — và đó mới là thứ thật sự kích hoạt một workflow phát hành <code>on: push: tags:</code>'),
            B('The first publishes the package to the npm registry immediately; the second is only needed if you also want the tag on GitHub', 'Lệnh đầu công bố gói lên registry npm ngay lập tức; lệnh sau chỉ cần khi bạn muốn có cả cái tag trên GitHub'),
            B('The first creates a lightweight tag (annotated requires <code>-a</code>, which npm does not pass); the second refuses to push it, which is why release workflows silently never fire', 'Lệnh đầu tạo một tag nhẹ (muốn có chú thích thì phải <code>-a</code>, mà npm không truyền); lệnh sau từ chối push nó, và vì thế workflow phát hành âm thầm không bao giờ chạy'),
          ],
          correct: 1,
          explanation: EX(
            'One command, one commit, one tag, one push — which removes the step people forget. Tags do NOT travel with commits: verified in the scratch repository, after <code>git tag -a v1.0.0</code> and a plain <code>git push origin main</code>, <code>git ls-remote --tags origin</code> was empty, and only an explicit <code>git push origin v1.0.0</code> put it there. That silence is how a release workflow that triggers on <code>tags: [\'v*.*.*\']</code> never runs and nobody can see why. <code>--follow-tags</code> is the good default because it takes the annotated tags on the commits you are pushing and leaves your local experiments alone; <code>--tags</code> takes everything.',
            'Một lệnh, một commit, một tag, một lần push — bỏ luôn cái bước người ta hay quên. Tag KHÔNG đi theo commit: đã kiểm trong kho nháp, sau <code>git tag -a v1.0.0</code> và một lệnh <code>git push origin main</code> trần, <code>git ls-remote --tags origin</code> trống trơn, và chỉ khi chạy tường minh <code>git push origin v1.0.0</code> thì tag mới lên. Chính sự im lặng đó là cách một workflow phát hành kích hoạt theo <code>tags: [\'v*.*.*\']</code> không bao giờ chạy mà chẳng ai thấy vì sao. <code>--follow-tags</code> là mặc định tốt vì nó lấy các tag có chú thích trên đúng những commit bạn đang push và để yên đám thử nghiệm ở máy; còn <code>--tags</code> thì lấy hết.',
          ),
        }),

        mcq({
          prompt: B(
            'A release is cut with <code>gh release create v1.5.0 --generate-notes</code>, and the repository contains a <code>.github/release.yml</code> listing categories with labels. Where do the notes come from?',
            'Một bản phát hành được cắt bằng <code>gh release create v1.5.0 --generate-notes</code>, và kho có file <code>.github/release.yml</code> khai các mục kèm nhãn. Ghi chú phát hành lấy từ đâu?',
          ),
          options: [
            B('From the commit messages since the previous tag, grouped by Conventional Commits type — which is why the type prefix is mandatory for this to work', 'Từ lời nhắn commit kể từ tag trước, gom theo loại Conventional Commits — và vì thế tiền tố loại là bắt buộc để việc này chạy được'),
            B('From <code>CHANGELOG.md</code>, which GitHub parses for the matching version heading and copies verbatim into the release body', 'Từ <code>CHANGELOG.md</code>, GitHub đọc tìm mục tiêu đề khớp phiên bản và chép nguyên văn vào thân bản phát hành'),
            B('From the pull requests merged since the previous tag, grouped by LABEL according to the categories in <code>.github/release.yml</code>', 'Từ các pull request đã merge kể từ tag trước, gom theo NHÃN đúng như các mục khai trong <code>.github/release.yml</code>'),
            B('From the annotated tag message, which is why the release notes are empty whenever a lightweight tag is used', 'Từ lời nhắn của tag có chú thích, và vì thế ghi chú phát hành trống rỗng mỗi khi dùng tag nhẹ'),
          ],
          correct: 2,
          explanation: EX(
            'Labels, not commit messages — which means the quality of your release notes is decided when someone labels a pull request, weeks earlier. That is also why the configuration file is worth writing: without it every merged PR lands in one undifferentiated list. And notes generated for a machine are not the same as notes written for a person. The changelog entry that actually helps is the one aimed at someone deciding whether to upgrade: "sessions never expired — a 40-day-old token still worked" tells them whether this is urgent; "fixed auth bug" tells them nothing.',
            'Là nhãn chứ không phải lời nhắn commit — nghĩa là chất lượng ghi chú phát hành của bạn được quyết định lúc ai đó gắn nhãn cho một pull request, từ nhiều tuần trước. Cũng vì thế mà file cấu hình kia đáng viết: thiếu nó thì mọi PR đã merge rơi vào một danh sách không phân loại. Và ghi chú do máy sinh không giống ghi chú viết cho người. Dòng changelog thật sự có ích là dòng nhắm vào người đang quyết định có nên nâng cấp không: "phiên đăng nhập không bao giờ hết hạn — một token 40 ngày tuổi vẫn chạy" cho họ biết chuyện này có gấp hay không; "sửa lỗi auth" chẳng nói gì cả.',
          ),
        }),

        // ── Chương 8 — Viết lại lịch sử ─────────────────────────────────
        mcq({
          prompt: B(
            'You run <code>git commit --amend --no-edit</code> to add a forgotten file to the last commit. What happens to the two timestamps a commit carries?',
            'Bạn chạy <code>git commit --amend --no-edit</code> để thêm một file quên mất vào commit cuối. Hai dấu thời gian mà một commit mang theo sẽ ra sao?',
          ),
          options: [
            B('The AUTHOR date is preserved and the COMMITTER date is updated — that two-timestamp design is exactly what lets a rebase or a patch record who wrote it and who replayed it', 'Ngày TÁC GIẢ được giữ nguyên và ngày NGƯỜI COMMIT được cập nhật — thiết kế hai dấu thời gian đó chính là thứ cho phép một lần rebase hay một bản vá ghi lại ai viết và ai phát lại'),
            B('Both are updated to now, which is why <code>git log --since</code> can lose an amended commit that was originally made yesterday', 'Cả hai được cập nhật thành hiện tại, và vì thế <code>git log --since</code> có thể làm mất một commit đã amend vốn được tạo từ hôm qua'),
            B('Both are preserved; amend is defined as a content-only change, and <code>--date=now</code> exists to override that when you want it', 'Cả hai được giữ nguyên; amend được định nghĩa là một thay đổi chỉ về nội dung, và <code>--date=now</code> tồn tại để ghi đè khi bạn muốn'),
            B('Neither exists on an amended commit: Git drops both fields and recomputes them at <code>git log</code> time from the reflog entry', 'Cả hai không tồn tại trên một commit đã amend: Git bỏ hai trường đó và tính lại lúc chạy <code>git log</code> từ dòng reflog'),
          ],
          correct: 0,
          explanation: EX(
            'A commit records an author (who wrote the change) and a committer (who put it into history), and they are usually the same person on the same day — until a rebase, a cherry-pick or an amend separates them. Amend keeps the author date so the history still says when the work was done. Use <code>--date=now</code> when you want to move it, and <code>--reset-author</code> when the identity itself was wrong — which only works on the most recent commit; further back it is <code>git rebase -i</code> and an <code>edit</code> stop.',
            'Một commit ghi lại tác giả (người viết ra thay đổi) và người commit (người đưa nó vào lịch sử), và thường thì hai người đó là một, trong cùng một ngày — cho tới khi một lần rebase, cherry-pick hay amend tách chúng ra. Amend giữ nguyên ngày tác giả để lịch sử vẫn nói đúng thời điểm công việc được làm. Dùng <code>--date=now</code> khi bạn muốn dời nó, và <code>--reset-author</code> khi chính danh tính bị sai — cái này chỉ chạy với commit gần nhất; xa hơn thì phải <code>git rebase -i</code> và một điểm dừng <code>edit</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A reviewer asks for a change that belongs in commit <code>3f8a1c9</code>, five commits back on your branch. What does this pair of commands do?' + code(
              'git commit --fixup 3f8a1c9\n' +
              'git rebase -i --autosquash HEAD~6',
            ),
            'Người review yêu cầu một thay đổi thuộc về commit <code>3f8a1c9</code>, cách năm commit trên nhánh của bạn. Cặp lệnh này làm gì?' + code(
              'git commit --fixup 3f8a1c9\n' +
              'git rebase -i --autosquash HEAD~6',
            ),
          ),
          options: [
            B('The first amends <code>3f8a1c9</code> in place without a rebase; the second is only needed when the commit is already pushed', 'Lệnh đầu amend thẳng vào <code>3f8a1c9</code> mà không cần rebase; lệnh sau chỉ cần khi commit đó đã được push'),
            B('The first cherry-picks <code>3f8a1c9</code> to the tip so you can edit it there; the second moves it back into position afterwards', 'Lệnh đầu cherry-pick <code>3f8a1c9</code> lên đầu nhánh để bạn sửa ở đó; lệnh sau đưa nó về đúng vị trí cũ'),
            B('The first stages the fix as a normal commit and prints a warning that <code>--fixup</code> is deprecated in favour of <code>--squash</code>', 'Lệnh đầu staging bản sửa thành một commit bình thường và in cảnh báo rằng <code>--fixup</code> đã lỗi thời, hãy dùng <code>--squash</code>'),
            B('The first creates a normal commit whose message is <code>fixup! &lt;subject of 3f8a1c9&gt;</code>; the second sees that marker, moves the line directly under its target and pre-sets it to <code>fixup</code>, so the fix melds into the right commit', 'Lệnh đầu tạo một commit bình thường có lời nhắn là <code>fixup! &lt;tiêu đề của 3f8a1c9&gt;</code>; lệnh sau thấy cái dấu đó, dời dòng ấy xuống ngay dưới commit đích và đặt sẵn thành <code>fixup</code>, nên bản sửa nhập vào đúng commit'),
          ],
          correct: 3,
          explanation: EX(
            'This is the polite way to answer review comments on a branch you intend to keep tidy: each fix is a real commit while the discussion is live, so the reviewer can see what changed since last time, and the whole set collapses into the right places at the end. Turn it on permanently with <code>git config --global rebase.autosquash true</code>. Note the pairing: <code>--fixup</code> discards the fix\'s message, <code>--squash</code> keeps it and opens an editor to combine both.',
            'Đây là cách lịch sự để đáp lại các bình luận review trên một nhánh mà bạn muốn giữ gọn: trong lúc thảo luận còn sôi nổi thì mỗi bản sửa là một commit thật, để người review thấy được cái gì đã đổi từ lần trước, rồi tới cuối cả bộ mới xẹp về đúng chỗ. Bật vĩnh viễn bằng <code>git config --global rebase.autosquash true</code>. Để ý cặp đôi: <code>--fixup</code> vứt lời nhắn của bản sửa, còn <code>--squash</code> giữ lại và mở trình soạn thảo để bạn gộp cả hai.',
          ),
        }),

        mcq({
          prompt: B(
            'You are removing a leaked <code>.env</code> from all of history with <code>git filter-repo</code>. Which pair of statements about the aftermath is correct?',
            'Bạn đang gỡ một file <code>.env</code> bị lộ khỏi toàn bộ lịch sử bằng <code>git filter-repo</code>. Cặp phát biểu nào về hậu quả là ĐÚNG?',
          ),
          options: [
            B('It rewrites in place, so a normal <code>git push</code> is enough; colleagues just run <code>git pull</code> and Git reconciles the two histories automatically', 'Nó viết lại tại chỗ nên một lệnh <code>git push</code> bình thường là đủ; đồng nghiệp chỉ cần <code>git pull</code> và Git tự điều hoà hai lịch sử'),
            B('It deliberately REMOVES the remote from the rewritten clone so you cannot push reflexively; and every colleague must CLONE AGAIN, because a pull would just merge the old history back in', 'Nó cố tình GỠ remote khỏi bản clone đã viết lại để bạn không push theo phản xạ; và mọi đồng nghiệp phải CLONE LẠI, vì một lệnh pull chỉ mang lịch sử cũ quay về'),
            B('It refuses to run on a repository that has open pull requests, which is the built-in protection against orphaning review branches', 'Nó từ chối chạy trên kho đang có pull request mở, đó là lá chắn cài sẵn chống việc bỏ rơi các nhánh đang review'),
            B('It preserves every commit hash by design, so nothing downstream breaks — that hash stability is the whole reason it replaced <code>git filter-branch</code>', 'Nó giữ nguyên mọi mã băm commit theo thiết kế nên không có gì phía sau bị hỏng — chính sự ổn định mã băm đó là lý do nó thay thế <code>git filter-branch</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Every commit from the earliest rewritten one onwards gets a new hash, so the old and new histories share nothing; a pull would produce duplicate commits and inexplicable conflicts. That coordination cost is the expensive, unskippable part, and it is exactly why the first step of a leak is never Git — it is rotating the credential. Also note the aftermath a force-push does not fix: on GitHub the old commits are still reachable by full hash via URL, forks keep their own copies indefinitely, and only a request to GitHub Support removes them. And use <code>filter-repo</code>, not <code>filter-branch</code>: the Git project itself now recommends against the old tool.',
            'Mọi commit từ cái bị viết lại sớm nhất trở đi đều nhận mã băm mới, nên lịch sử cũ và mới không chia sẻ gì với nhau; một lệnh pull sẽ sinh ra commit trùng lặp và những xung đột không giải thích nổi. Cái chi phí phối hợp đó là phần đắt đỏ và không bỏ qua được, và đó chính là lý do bước một của một vụ lộ không bao giờ là Git — mà là xoay chứng chỉ. Cũng để ý phần hậu quả mà force-push không sửa được: trên GitHub các commit cũ vẫn với tới được bằng mã băm đầy đủ qua URL, các bản fork giữ bản sao riêng vô thời hạn, và chỉ một yêu cầu tới GitHub Support mới xoá hẳn được. Và hãy dùng <code>filter-repo</code>, đừng dùng <code>filter-branch</code>: chính dự án Git nay khuyến cáo không dùng công cụ cũ.',
          ),
        }),

        mcq({
          prompt: B(
            'A commit was amended after it had been pushed. Two pushes were then attempted:' + code(
              '$ git push\n' +
              '! [rejected]        main -> main (non-fast-forward)\n' +
              'error: failed to push some refs to \'../fl.git\'\n' +
              'hint: Updates were rejected because the tip of your current branch is behind\n' +
              '\n' +
              '$ git push --force-with-lease\n' +
              ' + 3ecc956...b6f738b main -> main (forced update)',
            ) + 'What does the leading <code>+</code> on the last line mean, and what did the lease actually check?',
            'Một commit đã bị amend sau khi được push. Rồi hai lệnh push được thử:' + code(
              '$ git push\n' +
              '! [rejected]        main -> main (non-fast-forward)\n' +
              'error: failed to push some refs to \'../fl.git\'\n' +
              'hint: Updates were rejected because the tip of your current branch is behind\n' +
              '\n' +
              '$ git push --force-with-lease\n' +
              ' + 3ecc956...b6f738b main -> main (forced update)',
            ),
          ),
          options: [
            B('The <code>+</code> means the push created a new ref; the lease checked that the branch is not protected by a server-side rule', 'Dấu <code>+</code> nghĩa là lệnh push đã tạo một ref mới; cái lease kiểm rằng nhánh đó không bị một luật phía máy chủ bảo vệ'),
            B('The <code>+</code> means the tag namespace was updated too; the lease checked that your local clone has no uncommitted changes', 'Dấu <code>+</code> nghĩa là không gian tên tag cũng được cập nhật; cái lease kiểm rằng bản clone của bạn không còn thay đổi chưa commit'),
            B('The <code>+</code> marks a non-fast-forward update — the remote branch moved to a commit that is not a descendant of where it was; the lease checked that the remote branch is still exactly where your <code>origin/main</code> tracking ref says it is', 'Dấu <code>+</code> đánh dấu một cập nhật không-fast-forward — nhánh trên remote đã nhảy sang một commit không phải hậu duệ của chỗ cũ; còn cái lease kiểm rằng nhánh trên remote vẫn đúng ở chỗ mà ref theo dõi <code>origin/main</code> của bạn nói'),
            B('The <code>+</code> means the push succeeded on the second attempt after an automatic retry; the lease checked that the new history is longer than the old one', 'Dấu <code>+</code> nghĩa là lệnh push thành công ở lần thử thứ hai sau một lần tự động lặp lại; cái lease kiểm rằng lịch sử mới dài hơn lịch sử cũ'),
          ],
          correct: 2,
          explanation: EX(
            'Both transcripts came from the scratch clones. The lease is a comparison against your REMOTE-TRACKING REF, not a live question to the server — and that is precisely the hole to know about: anything that quietly runs <code>git fetch</code> for you (an IDE polling, a shell prompt, a background sync) updates that ref without you ever seeing the new commits, and the check then compares the server against itself and sails through exactly like a bare <code>--force</code>. From Git 2.30 the fix is to pass <code>--force-if-includes</code> as well, which additionally demands that your local branch actually CONTAINS everything you have fetched.',
            'Cả hai transcript đều lấy từ các bản clone nháp. Cái lease so với REF THEO DÕI REMOTE của bạn chứ không hỏi trực tiếp máy chủ — và đó đúng là cái lỗ cần biết: bất cứ thứ gì âm thầm chạy <code>git fetch</code> hộ bạn (một IDE đang thăm dò, một dấu nhắc shell, một tiến trình đồng bộ nền) đều cập nhật cái ref đó mà bạn chưa hề nhìn thấy các commit mới, và khi ấy phép kiểm so máy chủ với chính nó, đi qua trót lọt y hệt một lệnh <code>--force</code> trần. Từ Git 2.30, cách bịt là truyền thêm <code>--force-if-includes</code>, nó đòi hỏi thêm rằng nhánh cục bộ của bạn thật sự CHỨA mọi thứ bạn đã fetch về.',
          ),
        }),

        mcq({
          prompt: B(
            'Which classification of force-pushing matches the course?',
            'Cách phân loại nào về force-push khớp với bài học?',
          ),
          options: [
            B('Fine on your own feature branch and on your fork\'s pull request branch (though not mid-review, because it invalidates comments); risky on a branch two people share, and requires telling them first; never on <code>main</code>, <code>develop</code> or <code>release/*</code>, where branch protection should make it impossible', 'Bình thường trên nhánh tính năng của chính bạn và trên nhánh pull request thuộc fork của bạn (tuy không nên làm giữa lúc đang review vì nó làm mất hiệu lực các bình luận); rủi ro trên nhánh hai người cùng dùng, và phải báo trước; không bao giờ trên <code>main</code>, <code>develop</code> hay <code>release/*</code>, nơi bảo vệ nhánh phải làm cho nó bất khả thi'),
            B('Fine on any branch at all as long as you pass <code>--force-with-lease</code> instead of a bare <code>--force</code>, which is the entire reason that flag exists; once the lease passes, the name of the branch stops mattering', 'Bình thường trên bất cứ nhánh nào miễn là truyền <code>--force-with-lease</code> thay cho <code>--force</code> trần, đó là toàn bộ lý do cái cờ này tồn tại; một khi cái lease đã qua thì tên nhánh không còn quan trọng nữa'),
            B('Never acceptable under any circumstances at all: every history rewrite should be published as an ordinary revert commit instead, on a personal branch and a shared branch alike, so that no clone anywhere is ever invalidated', 'Không bao giờ chấp nhận được trong bất kỳ hoàn cảnh nào: mọi lần viết lại lịch sử đều nên được công bố dưới dạng một commit revert bình thường, trên nhánh cá nhân cũng như nhánh dùng chung, để không bản clone nào ở đâu bị mất hiệu lực'),
            B('Fine on shared branches and dangerous on personal ones, because a shared branch always has a colleague holding a second copy of the commits while a personal branch exists on your laptop and on the server only', 'Bình thường trên nhánh dùng chung và nguy hiểm trên nhánh cá nhân, vì nhánh dùng chung luôn có một đồng nghiệp giữ bản sao thứ hai của các commit, còn nhánh cá nhân chỉ tồn tại trên laptop của bạn và trên máy chủ'),
          ],
          correct: 0,
          explanation: EX(
            'Force-pushing is the most destructive thing an ordinary Git user can do: the overwritten commits are not deleted from the server immediately, but nothing points at them and nobody can find them without a server-side reflog — so if the colleague\'s laptop no longer has them, that work is gone. The cultural half matters as much as the flag: on any branch someone else touches, say so first. "I am about to force-push feature/login, pull before you touch it" costs one message and prevents the tangle where a colleague\'s <code>git pull</code> merges the old and new histories into duplicate commits.',
            'Force-push là thứ có sức phá huỷ lớn nhất mà một người dùng Git bình thường làm được: các commit bị đè lên không bị xoá khỏi máy chủ ngay, nhưng không gì trỏ vào chúng và không ai tìm ra chúng nếu không có reflog phía máy chủ — nên nếu laptop của đồng nghiệp không còn giữ thì phần việc đó đã mất. Nửa văn hoá quan trọng ngang cái cờ: trên bất kỳ nhánh nào có người khác đụng vào, hãy báo trước. "Tôi sắp force-push feature/login, hãy pull trước khi đụng vào" tốn một tin nhắn và ngăn được cái mớ rối khi <code>git pull</code> của đồng nghiệp hợp nhất lịch sử cũ và mới thành một đống commit trùng lặp.',
          ),
        }),

        mcq({
          prompt: B(
            'On git 2.51.1, <code>git rebase -i HEAD~3</code> opened this todo list. Which reading is correct?' + code(
              'pick b581d39 # feat: add login\n' +
              'pick 28d2ebc # fix typo\n' +
              'pick 88d42d1 # wip\n' +
              '\n' +
              '# Rebase 838b3de..88d42d1 onto 838b3de (3 commands)',
            ),
            'Trên git 2.51.1, <code>git rebase -i HEAD~3</code> mở ra danh sách việc này. Cách đọc nào ĐÚNG?' + code(
              'pick b581d39 # feat: add login\n' +
              'pick 28d2ebc # fix typo\n' +
              'pick 88d42d1 # wip\n' +
              '\n' +
              '# Rebase 838b3de..88d42d1 onto 838b3de (3 commands)',
            ),
          ),
          options: [
            B('The three commits are listed newest-first, exactly as in <code>git log</code>, so <code>fixup</code> on line 2 melds into <code>wip</code>', 'Ba commit được liệt kê mới-nhất-trước, đúng như trong <code>git log</code>, nên đặt <code>fixup</code> ở dòng 2 là nhập vào <code>wip</code>'),
            B('The <code>#</code> means those three lines are commented out and the rebase will do nothing; you must delete the <code>#</code> before saving', 'Dấu <code>#</code> nghĩa là ba dòng đó đã bị chú thích và lần rebase sẽ không làm gì; bạn phải xoá dấu <code>#</code> trước khi lưu'),
            B('The <code>#</code> marks commits that have already been pushed, which is Git\'s built-in warning against rewriting shared history', 'Dấu <code>#</code> đánh dấu những commit đã được push, đó là cảnh báo cài sẵn của Git chống việc viết lại lịch sử đã chia sẻ'),
            B('The <code>#</code> comments out the subject only; the lines themselves are active, they are OLDEST-FIRST (the reverse of <code>git log</code>), and marking line 1 <code>squash</code> fails with <code>error: cannot \'squash\' without a previous commit</code>', 'Dấu <code>#</code> chỉ biến phần tiêu đề thành chú thích; bản thân các dòng vẫn có hiệu lực, chúng xếp CŨ-NHẤT-TRƯỚC (ngược với <code>git log</code>), và đánh dấu dòng 1 là <code>squash</code> sẽ hỏng với <code>error: cannot \'squash\' without a previous commit</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Both details were measured on git 2.51.1: the todo really does put a <code>#</code> between the hash and the subject — note that the course, and every book written before this format change, shows <code>pick 9e2d4b7 feat(auth): …</code> with no hash sign — and marking the first line <code>squash</code> produced exactly <code>error: cannot \'squash\' without a previous commit</code>, lowercase. If you write scripts that generate a todo list, this is a breaking change: splitting the line as "hash then subject" now reads the subject as <code>#</code>. Reordering is done by moving lines; deleting a line is the same as <code>drop</code>.',
            'Cả hai chi tiết đều đã đo trên git 2.51.1: danh sách việc thật sự đặt một dấu <code>#</code> giữa mã băm và tiêu đề — để ý rằng giáo trình, và mọi sách viết trước lần đổi định dạng này, đều in <code>pick 9e2d4b7 feat(auth): …</code> không có dấu thăng — và đánh dấu dòng đầu là <code>squash</code> cho ra đúng <code>error: cannot \'squash\' without a previous commit</code>, chữ thường. Nếu bạn viết script sinh danh sách việc thì đây là một thay đổi phá vỡ tương thích: tách dòng theo kiểu "hash rồi tới subject" giờ đọc ra tiêu đề là <code>#</code>. Đổi thứ tự thì dời dòng; xoá một dòng tương đương với <code>drop</code>.',
          ),
        }),

        // ── Chương 9 — Ruột gan ─────────────────────────────────────────
        mcq({
          prompt: B(
            'Two repositories were inspected. One printed the first line, the other the second. What is the difference between the two states?' + code(
              '$ cat .git/HEAD\n' +
              'ref: refs/heads/main\n' +
              '\n' +
              '$ cat .git/HEAD\n' +
              '3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d',
            ),
            'Hai kho được soi. Cái thứ nhất in ra dòng đầu, cái thứ hai in ra dòng sau. Hai trạng thái đó khác nhau ở đâu?' + code(
              '$ cat .git/HEAD\n' +
              'ref: refs/heads/main\n' +
              '\n' +
              '$ cat .git/HEAD\n' +
              '3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d',
            ),
          ),
          options: [
            B('The first is a working repository and the second is a bare one; a bare repository has no branch to name because it has no working directory', 'Cái đầu là kho làm việc còn cái sau là kho trần; kho trần không có nhánh nào để gọi tên vì nó không có thư mục làm việc'),
            B('The first is attached to a branch, the second is a DETACHED HEAD holding a commit hash directly — that is the entire difference between the two states, and committing there moves no branch pointer', 'Cái đầu đang gắn vào một nhánh, cái sau là HEAD LÌA CÀNH giữ thẳng một mã băm commit — đó là toàn bộ khác biệt giữa hai trạng thái, và commit ở đó không dời con trỏ nhánh nào cả'),
            B('The second repository is corrupt: <code>.git/HEAD</code> must always contain a symbolic ref, and a raw hash means the file was written by something other than Git', 'Kho thứ hai bị hỏng: <code>.git/HEAD</code> luôn phải chứa một ref tượng trưng, và một mã băm trần nghĩa là file đó bị thứ khác ngoài Git ghi vào'),
            B('The second is mid-merge; Git stores the target commit in HEAD until the merge is committed, then restores the symbolic ref', 'Cái sau đang giữa chừng một lần merge; Git lưu commit đích vào HEAD cho tới khi merge được commit, rồi mới trả lại ref tượng trưng'),
          ],
          correct: 1,
          explanation: EX(
            'One file, two shapes, and the whole of "detached HEAD" lives in that difference. Both were reproduced in the lab. Detached is a normal state, not a fault — <code>git bisect</code> deliberately puts you there, and so does checking out a tag. The one real danger is committing while detached and then switching away: no branch moved, so nothing points at your work. Git does warn (<i>"you are leaving 1 commit behind"</i>, with the hash and the command to save it), and the reflog still has it — but only on that machine.',
            'Một file, hai hình dạng, và toàn bộ khái niệm "HEAD lìa cành" nằm ở khác biệt đó. Cả hai đã được tái hiện trong phòng thí nghiệm. Lìa cành là trạng thái bình thường chứ không phải sự cố — <code>git bisect</code> cố tình đặt bạn vào đó, và checkout một tag cũng thế. Nguy hiểm thật sự duy nhất là commit khi đang lìa cành rồi chuyển đi: không nhánh nào dịch chuyển nên không gì trỏ vào công việc của bạn. Git có cảnh báo (<i>"you are leaving 1 commit behind"</i>, kèm mã băm và lệnh để cứu), và reflog vẫn còn giữ — nhưng chỉ trên đúng cái máy đó.',
          ),
        }),

        mcq({
          prompt: B(
            'In a fresh repository with exactly one commit, <code>git cat-file -p HEAD</code> printed this. What is missing compared with a later commit, and why?' + code(
              'tree 528903e4d882221fc14d6727b785b28861d6d234\n' +
              'author An Nguyen <an@example.com> 1772330400 +0700\n' +
              'committer An Nguyen <an@example.com> 1772330400 +0700\n' +
              '\n' +
              'A',
            ),
            'Trong một kho mới toanh chỉ có đúng một commit, <code>git cat-file -p HEAD</code> in ra thế này. So với một commit về sau thì thiếu gì, và vì sao?' + code(
              'tree 528903e4d882221fc14d6727b785b28861d6d234\n' +
              'author An Nguyen <an@example.com> 1772330400 +0700\n' +
              'committer An Nguyen <an@example.com> 1772330400 +0700\n' +
              '\n' +
              'A',
            ),
          ),
          options: [
            B('The <code>message</code> field — a root commit stores its message in <code>.git/COMMIT_EDITMSG</code> instead, which is why the text appears only after the blank line', 'Thiếu trường <code>message</code> — commit gốc lưu lời nhắn trong <code>.git/COMMIT_EDITMSG</code>, và vì thế đoạn chữ chỉ xuất hiện sau dòng trống'),
            B('The <code>branch</code> field — commits normally record which branch they were made on, but a root commit predates the branch that later points at it', 'Thiếu trường <code>branch</code> — commit bình thường có ghi lại nó được tạo trên nhánh nào, nhưng commit gốc có trước cả cái nhánh sau này trỏ vào nó'),
            B('The <code>parent</code> line: a root commit has no parent, while a normal commit has one and a merge commit has two or more — and because the parent hash is part of what gets hashed, rewriting one commit changes every hash after it', 'Thiếu dòng <code>parent</code>: commit gốc không có cha, commit bình thường có một, commit hợp nhất có hai hoặc hơn — và vì mã băm của cha nằm trong phần được đem đi băm, viết lại một commit là đổi mọi mã băm phía sau nó'),
            B('The <code>size</code> line — Git only records the object size for commits that have a parent, since the size is computed as a delta against it', 'Thiếu dòng <code>size</code> — Git chỉ ghi kích thước đối tượng cho những commit có cha, vì kích thước được tính dưới dạng delta so với cha'),
          ],
          correct: 2,
          explanation: EX(
            'Copied verbatim from the scratch repository. That is the entire commit object: a tree, zero or more parents, two identities with timestamps, and a message. Everything else you think of as "the commit" — the diff, the branch it is on, whether it was pushed — is computed or stored elsewhere. The parent line is the load-bearing one: it makes history a chain, it makes <code>HEAD~3</code> meaningful, and it is why editing a commit message from three months ago hands new hashes to all 200 commits after it.',
            'Chép nguyên văn từ kho nháp. Đó là toàn bộ một đối tượng commit: một tree, không hoặc nhiều cha, hai danh tính kèm dấu thời gian, và một lời nhắn. Mọi thứ khác mà bạn nghĩ là "cái commit" — bản diff, nó nằm trên nhánh nào, nó đã được push chưa — đều được tính ra hoặc lưu ở chỗ khác. Dòng parent mới là dòng chịu lực: nó làm cho lịch sử thành một sợi xích, làm cho <code>HEAD~3</code> có nghĩa, và là lý do sửa lời nhắn của một commit ba tháng trước sẽ phát mã băm mới cho cả 200 commit phía sau.',
          ),
        }),

        mcq({
          prompt: B(
            'A repository reports this. Which field is the one you should worry about, and what does a non-zero value there suggest?' + code(
              'count: 143\n' +
              'size: 1.21 MiB\n' +
              'in-pack: 24817\n' +
              'packs: 1\n' +
              'size-pack: 38.42 MiB\n' +
              'prune-packable: 0\n' +
              'garbage: 0',
            ),
            'Một kho báo cáo như sau. Trường nào là trường bạn nên lo, và giá trị khác 0 ở đó gợi ý điều gì?' + code(
              'count: 143\n' +
              'size: 1.21 MiB\n' +
              'in-pack: 24817\n' +
              'packs: 1\n' +
              'size-pack: 38.42 MiB\n' +
              'prune-packable: 0\n' +
              'garbage: 0',
            ),
          ),
          options: [
            B('<code>garbage</code> — it counts files inside <code>objects/</code> that Git does not recognise, so a non-zero value suggests something wrote into <code>.git/</code> that should not have', '<code>garbage</code> — nó đếm những file trong <code>objects/</code> mà Git không nhận ra, nên giá trị khác 0 gợi ý có thứ gì đó đã ghi vào <code>.git/</code> mà lẽ ra không nên'),
            B('<code>count</code> — loose objects are unreferenced by definition, so 143 of them means 143 commits are already lost and only <code>git fsck</code> can list them', '<code>count</code> — theo định nghĩa thì đối tượng rời là không ai trỏ tới, nên 143 cái nghĩa là 143 commit đã mất và chỉ <code>git fsck</code> mới liệt kê ra được'),
            B('<code>packs</code> — more than zero packfiles means <code>git gc</code> has run and unreachable objects were destroyed, so recovery is no longer possible', '<code>packs</code> — có hơn không packfile nghĩa là <code>git gc</code> đã chạy và các đối tượng không với tới được đã bị huỷ, nên hết cứu'),
            B('<code>prune-packable</code> — a value of 0 means the repository has never been packed, which is why <code>size-pack</code> should be treated as an estimate', '<code>prune-packable</code> — giá trị 0 nghĩa là kho chưa bao giờ được gói lại, và vì thế <code>size-pack</code> chỉ nên coi là con số ước lượng'),
          ],
          correct: 0,
          explanation: EX(
            'The other fields are healthy bookkeeping: <code>count</code>/<code>size</code> are loose objects written since the last <code>gc</code>, <code>in-pack</code>/<code>size-pack</code> are what has been packed, and almost everything ends up packed. <code>garbage</code> is the odd one out — Git found something in <code>objects/</code> that is not a Git object. That is the tell for the trap in this chapter: editing files under <code>.git/</code> by hand to fix a problem. Reading <code>.git/</code> is educational; writing to it bypasses every check Git performs, and the corruption surfaces hours later somewhere unrelated.',
            'Các trường còn lại chỉ là sổ sách bình thường: <code>count</code>/<code>size</code> là đối tượng rời ghi ra kể từ lần <code>gc</code> gần nhất, <code>in-pack</code>/<code>size-pack</code> là phần đã được gói, và gần như mọi thứ rốt cuộc đều được gói. <code>garbage</code> là kẻ lạc loài — Git tìm thấy trong <code>objects/</code> một thứ không phải đối tượng của Git. Đó là dấu hiệu của cái bẫy trong chương này: tự tay sửa file dưới <code>.git/</code> để chữa một vấn đề. ĐỌC <code>.git/</code> thì bổ ích; GHI vào nó là bỏ qua mọi phép kiểm Git thực hiện, và sự hỏng hóc sinh ra sẽ lộ ra vài giờ sau ở một chỗ chẳng liên quan.',
          ),
        }),

        mcq({
          prompt: B(
            'A commit was built by hand with five plumbing commands. What does the ordinary <code>git commit</code> add on top of these?' + code(
              'git hash-object -w --stdin\n' +
              'git update-index --add --cacheinfo 100644,<blob>,hello.txt\n' +
              'git write-tree\n' +
              'git commit-tree <tree>\n' +
              'git update-ref refs/heads/main <commit>',
            ),
            'Một commit được dựng bằng tay với năm lệnh cấp thấp. Lệnh <code>git commit</code> thông thường thêm gì lên trên chúng?' + code(
              'git hash-object -w --stdin\n' +
              'git update-index --add --cacheinfo 100644,<blob>,hello.txt\n' +
              'git write-tree\n' +
              'git commit-tree <tree>\n' +
              'git update-ref refs/heads/main <commit>',
            ),
          ),
          options: [
            B('Compression: the plumbing path writes objects uncompressed, and only <code>git commit</code> applies zlib and delta encoding', 'Nén: đường cấp thấp ghi đối tượng không nén, chỉ <code>git commit</code> mới áp zlib và mã hoá delta'),
            B('Hashing: <code>commit-tree</code> only builds the object body, and <code>git commit</code> is what computes and assigns the final SHA', 'Băm: <code>commit-tree</code> chỉ dựng phần thân đối tượng, còn <code>git commit</code> mới là thứ tính ra và gán mã SHA cuối cùng'),
            B('Nothing functional: <code>git commit</code> is a shell alias for exactly these five commands, which is why they must be run in that order', 'Không thêm gì về chức năng: <code>git commit</code> là một alias shell cho đúng năm lệnh đó, và vì thế phải chạy đúng thứ tự này'),
            B('Convenience only: it reads your config for the author identity, opens the editor for a message, runs the hooks, and writes the reflog entry — the five steps above ARE what committing is', 'Chỉ là tiện ích: nó đọc cấu hình lấy danh tính tác giả, mở trình soạn thảo để nhập lời nhắn, chạy các hook, và ghi dòng reflog — còn năm bước ở trên CHÍNH LÀ việc commit'),
          ],
          correct: 3,
          explanation: EX(
            'Doing it by hand once is what makes the model stop being abstract: content becomes a blob, the index becomes a tree, the tree gets wrapped in a commit, and a ref is pointed at it. That last step is the one people underestimate — until <code>update-ref</code> runs, the commit exists in the database and no branch knows about it, which is exactly the state a detached-HEAD commit is left in. And note where the hash comes from: Git hashes <code>"&lt;type&gt; &lt;size&gt;\\0&lt;content&gt;"</code>, not the content alone, which is why a blob and a commit with identical bytes get different ids.',
            'Làm bằng tay đúng một lần là đủ để mô hình hết trừu tượng: nội dung thành một blob, index thành một tree, cái tree được bọc trong một commit, và một ref được trỏ vào đó. Bước cuối là bước người ta hay xem nhẹ — cho tới khi <code>update-ref</code> chạy thì commit đã tồn tại trong cơ sở dữ liệu mà chẳng nhánh nào biết tới nó, đúng bằng trạng thái mà một commit tạo khi HEAD lìa cành bị bỏ lại. Và để ý mã băm tới từ đâu: Git băm chuỗi <code>"&lt;loại&gt; &lt;kích thước&gt;\\0&lt;nội dung&gt;"</code> chứ không băm riêng nội dung, và vì thế một blob với một commit có cùng byte lại nhận mã định danh khác nhau.',
          ),
        }),

        mcq({
          prompt: B(
            'Every line of <code>git ls-files --stage</code> starts with a six-digit mode, and in practice only two values ever appear for files: <code>100644</code> and <code>100755</code>. What does that tell you?' + code(
              '100644 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d 0\tsrc/app.ts\n' +
              '100755 a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c81 0\tdeploy.sh',
            ),
            'Mỗi dòng của <code>git ls-files --stage</code> bắt đầu bằng một chế độ sáu chữ số, và trong thực tế với file thì chỉ có hai giá trị xuất hiện: <code>100644</code> và <code>100755</code>. Điều đó cho bạn biết gì?' + code(
              '100644 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d 0\tsrc/app.ts\n' +
              '100755 a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c81 0\tdeploy.sh',
            ),
          ),
          options: [
            B('The mode encodes the file size class, which is how Git decides whether an object goes loose or straight into a packfile', 'Chế độ mã hoá nhóm kích thước file, và đó là cách Git quyết định một đối tượng nằm rời hay đi thẳng vào packfile'),
            B('Git records only "regular file" and "executable file" — it deliberately does NOT track full Unix permissions, so a <code>chmod 600</code> is invisible to Git while a <code>chmod +x</code> is a real change', 'Git chỉ ghi lại "file thường" và "file thực thi được" — nó cố tình KHÔNG theo dõi quyền Unix đầy đủ, nên một lệnh <code>chmod 600</code> là vô hình với Git còn <code>chmod +x</code> là một thay đổi thật'),
            B('Those are the only two modes POSIX allows in a version control system, which is why Git cannot represent a symbolic link at all', 'Đó là hai chế độ duy nhất mà POSIX cho phép trong một hệ quản lý phiên bản, và vì thế Git hoàn toàn không biểu diễn được một liên kết tượng trưng'),
            B('The mode is the owner and group id packed into six digits, which is why a repository cloned by a different user shows different numbers', 'Chế độ là id của chủ sở hữu và nhóm gói vào sáu chữ số, và vì thế một kho được người khác clone sẽ hiện các con số khác'),
          ],
          correct: 1,
          explanation: EX(
            'Two modes for files, plus <code>040000</code> for a directory (tree) and <code>160000</code> for a submodule gitlink. That is the whole vocabulary. The practical consequence bites on deployment: your <code>deploy.sh</code> keeps its executable bit through a clone, but the <code>600</code> you carefully set on a config file does not, because Git never recorded it. If a file must have restrictive permissions in production, that is the deployment\'s job, not the repository\'s. The <code>0</code> after the hash is the merge stage — 1, 2 and 3 appear only while a conflict is unresolved.',
            'Hai chế độ cho file, cộng <code>040000</code> cho thư mục (tree) và <code>160000</code> cho gitlink của submodule. Đó là toàn bộ vốn từ. Hệ quả thực tế cắn vào lúc triển khai: file <code>deploy.sh</code> của bạn giữ được bit thực thi qua một lần clone, nhưng cái quyền <code>600</code> bạn cẩn thận đặt cho một file cấu hình thì không, vì Git chưa bao giờ ghi lại nó. Nếu một file bắt buộc phải có quyền hạn chế trên production thì đó là việc của khâu triển khai, không phải của kho mã. Con số <code>0</code> sau mã băm là giai đoạn hợp nhất — 1, 2 và 3 chỉ xuất hiện khi một xung đột chưa được giải.',
          ),
        }),

        mcq({
          prompt: B(
            'A CI job checks out with <code>git clone --depth 1</code> to save time, and the build step then fails:' + code(
              '$ git describe\n' +
              'fatal: No names found, cannot describe anything.',
            ) + 'What else breaks in the same job, and what is the fix?',
            'Một job CI checkout bằng <code>git clone --depth 1</code> cho nhanh, và bước dựng sau đó hỏng:' + code(
              '$ git describe\n' +
              'fatal: No names found, cannot describe anything.',
            ) + 'Trong cùng job đó còn gì hỏng nữa, và sửa thế nào?',
          ),
          options: [
            B('Only <code>git describe</code> is affected; a shallow clone keeps tags and drops only the commit bodies, so any other history command still works', 'Chỉ <code>git describe</code> bị ảnh hưởng; clone nông vẫn giữ tag và chỉ bỏ phần thân commit, nên mọi lệnh lịch sử khác vẫn chạy'),
            B('The clone is corrupt; a shallow clone is only valid as a cache and must be completed with <code>git fsck --lost-found</code> before use', 'Bản clone bị hỏng; clone nông chỉ hợp lệ như một bộ nhớ đệm và phải được hoàn thiện bằng <code>git fsck --lost-found</code> trước khi dùng'),
            B('A shallow clone has essentially no history, so <code>git log v1.4.0..HEAD</code> comes back empty and ancestry checks fail too — fetch the tags (<code>git fetch --depth=1 origin +refs/tags/*:refs/tags/*</code>), unshallow, or use <code>--filter=blob:none</code> instead', 'Clone nông thì gần như không có lịch sử, nên <code>git log v1.4.0..HEAD</code> trả về trống và các phép kiểm tổ tiên cũng hỏng — hãy fetch tag về (<code>git fetch --depth=1 origin +refs/tags/*:refs/tags/*</code>), gỡ nông, hoặc dùng <code>--filter=blob:none</code>'),
            B('Nothing else breaks, but the message is a warning rather than an error — set <code>describe.fallback</code> and the build continues', 'Không có gì khác hỏng, và thông báo đó là cảnh báo chứ không phải lỗi — đặt <code>describe.fallback</code> là bản dựng chạy tiếp'),
          ],
          correct: 2,
          explanation: EX(
            'Reproduced exactly: the full clone answered <code>v1.0.0-2-g799e644</code>, and <code>git clone --depth 1</code> of the same repository answered the fatal above. This is the classic CI trap, because the shallow clone is genuinely faster and the failure only shows up in whichever step stamps the version. The partial clone (<code>--filter=blob:none</code>) is usually the better trade: you get the full commit and tree history, and file contents are fetched lazily when something actually reads them.',
            'Đã tái hiện đúng: bản clone đầy đủ trả về <code>v1.0.0-2-g799e644</code>, còn <code>git clone --depth 1</code> của chính kho đó trả về dòng fatal ở trên. Đây là cái bẫy CI kinh điển, vì clone nông đúng là nhanh hơn thật và chỗ hỏng chỉ lộ ra ở bước đóng dấu phiên bản. Partial clone (<code>--filter=blob:none</code>) thường là đánh đổi tốt hơn: bạn có đủ lịch sử commit và tree, còn nội dung file thì được lấy về từ từ khi có gì đó thật sự đọc tới.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Ahead, behind, and what to do about it (chapter 5).</b> Reimplement the arithmetic behind <code>git status -sb</code>, from plain data. No repository, no <code>git</code>, no libraries.</p>' +
            '<p><code>PARENT</code> maps a commit id to its single parent, or <code>null</code> for a root commit. Implement three functions:</p>' +
            '<ul>' +
            '<li><code>aheadBehind(parent, local, remote)</code> — return <code>[ahead, behind]</code>: how many commits <code>local</code> has that <code>remote</code> does not, and vice versa. Two unrelated roots therefore count as fully ahead AND fully behind.</li>' +
            '<li><code>statusLine(branch, upstream, ahead, behind)</code> — the exact first line of <code>git status -sb</code>. With no upstream: <code>## &lt;branch&gt;</code>. In sync: <code>## &lt;branch&gt;...&lt;upstream&gt;</code>. Otherwise append <code>[ahead N]</code>, <code>[behind N]</code>, or <code>[ahead N, behind N]</code> — in that order, comma and one space between them.</li>' +
            '<li><code>advice(upstream, ahead, behind)</code> — one of <code>git push -u origin HEAD</code> (no upstream), <code>up to date</code>, <code>git push</code>, <code>git pull --ff-only</code>, <code>git pull --rebase</code>.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing loop exactly as they are.</p>',

            '<p><b>Câu 31 — Ahead, behind, và phải làm gì với nó (chương 5).</b> Cài đặt lại phần số học đằng sau <code>git status -sb</code>, từ dữ liệu thuần. Không kho mã, không <code>git</code>, không thư viện.</p>' +
            '<p><code>PARENT</code> ánh xạ một mã commit tới cha duy nhất của nó, hoặc <code>null</code> nếu là commit gốc. Cài đặt ba hàm:</p>' +
            '<ul>' +
            '<li><code>aheadBehind(parent, local, remote)</code> — trả về <code>[ahead, behind]</code>: <code>local</code> có bao nhiêu commit mà <code>remote</code> không có, và ngược lại. Hai gốc rời rạc vì thế được tính là ahead hết VÀ behind hết.</li>' +
            '<li><code>statusLine(branch, upstream, ahead, behind)</code> — đúng dòng đầu tiên của <code>git status -sb</code>. Không có thượng nguồn: <code>## &lt;nhánh&gt;</code>. Đồng bộ: <code>## &lt;nhánh&gt;...&lt;thượng nguồn&gt;</code>. Còn lại thì nối thêm <code>[ahead N]</code>, <code>[behind N]</code>, hoặc <code>[ahead N, behind N]</code> — đúng thứ tự đó, giữa hai phần là dấu phẩy và một dấu cách.</li>' +
            '<li><code>advice(upstream, ahead, behind)</code> — một trong <code>git push -u origin HEAD</code> (chưa có thượng nguồn), <code>up to date</code>, <code>git push</code>, <code>git pull --ff-only</code>, <code>git pull --rebase</code>.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// A-B-C là phần chung. D-E là hai commit chỉ có ở máy,\n' +
            '// F-G-H là ba commit chỉ có trên máy chủ. P-Q hoàn toàn rời rạc.\n' +
            'const PARENT = {\n' +
            "  A: null, B: 'A', C: 'B',\n" +
            "  D: 'C', E: 'D',\n" +
            "  F: 'C', G: 'F', H: 'G',\n" +
            "  P: null, Q: 'P',\n" +
            '};\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function aheadBehind(parent, local, remote) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function statusLine(branch, upstream, ahead, behind) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function advice(upstream, ahead, behind) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const CASES = [\n' +
            "  { branch: 'main',    upstream: 'origin/main',    local: 'C', remote: 'C' },\n" +
            "  { branch: 'main',    upstream: 'origin/main',    local: 'E', remote: 'C' },\n" +
            "  { branch: 'main',    upstream: 'origin/main',    local: 'C', remote: 'H' },\n" +
            "  { branch: 'main',    upstream: 'origin/main',    local: 'E', remote: 'H' },\n" +
            "  { branch: 'solo',    upstream: null,             local: 'E', remote: null },\n" +
            "  { branch: 'orphan',  upstream: 'origin/orphan',  local: 'Q', remote: 'C' },\n" +
            '];\n' +
            'for (const cs of CASES) {\n' +
            '  const [ahead, behind] = cs.upstream ? aheadBehind(PARENT, cs.local, cs.remote) : [0, 0];\n' +
            '  console.log(statusLine(cs.branch, cs.upstream, ahead, behind));\n' +
            "  console.log('   ' + advice(cs.upstream, ahead, behind));\n" +
            '}\n',
          expectedOutput:
            '## main...origin/main\n' +
            '   up to date\n' +
            '## main...origin/main [ahead 2]\n' +
            '   git push\n' +
            '## main...origin/main [behind 3]\n' +
            '   git pull --ff-only\n' +
            '## main...origin/main [ahead 2, behind 3]\n' +
            '   git pull --rebase\n' +
            '## solo\n' +
            '   git push -u origin HEAD\n' +
            '## orphan...origin/orphan [ahead 2, behind 3]\n' +
            '   git pull --rebase',
          sampleSolution:
            'function chain(parent, id) {\n' +
            '  const out = [];\n' +
            '  for (let cur = id; cur; cur = parent[cur]) out.push(cur);\n' +
            '  return out;\n' +
            '}\n\n' +
            'function aheadBehind(parent, local, remote) {\n' +
            '  const l = chain(parent, local);\n' +
            '  const r = chain(parent, remote);\n' +
            '  const inR = new Set(r);\n' +
            '  const inL = new Set(l);\n' +
            '  // Đúng nghĩa của A...B: mỗi bên đếm phần riêng của mình.\n' +
            '  return [l.filter((cm) => !inR.has(cm)).length, r.filter((cm) => !inL.has(cm)).length];\n' +
            '}\n\n' +
            'function statusLine(branch, upstream, ahead, behind) {\n' +
            "  if (!upstream) return '## ' + branch;\n" +
            '  const bits = [];\n' +
            "  if (ahead) bits.push('ahead ' + ahead);\n" +
            "  if (behind) bits.push('behind ' + behind);\n" +
            "  return '## ' + branch + '...' + upstream + (bits.length ? ' [' + bits.join(', ') + ']' : '');\n" +
            '}\n\n' +
            'function advice(upstream, ahead, behind) {\n' +
            "  if (!upstream) return 'git push -u origin HEAD';\n" +
            "  if (!ahead && !behind) return 'up to date';\n" +
            "  if (ahead && !behind) return 'git push';\n" +
            "  if (!ahead && behind) return 'git pull --ff-only';\n" +
            "  return 'git pull --rebase';\n" +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Replay an interactive rebase (chapter 8).</b> Implement <code>replay(branch, todo)</code>: given the original branch (oldest first) and a rebase todo list, work out the commit messages that survive.</p>' +
            '<p>Each todo line is <code>&lt;command&gt; &lt;id&gt;</code>, except <code>reword</code>, which is <code>reword &lt;id&gt; =&gt; &lt;new message&gt;</code>. The commands:</p>' +
            '<ul>' +
            '<li><code>pick</code> — keep the commit as it is.</li>' +
            '<li><code>reword</code> — keep the change, replace the message.</li>' +
            '<li><code>squash</code> — meld into the previous surviving commit and join the messages with a blank line between them (<code>&quot;prev\\n\\nthis&quot;</code>).</li>' +
            '<li><code>fixup</code> — meld into the previous surviving commit and DISCARD this message.</li>' +
            '<li><code>drop</code> — remove the commit entirely.</li>' +
            '</ul>' +
            '<p>The list may reorder commits. On success return <code>{ messages, count }</code> where <code>messages</code> is the resulting list, oldest first.</p>' +
            '<p>Three failures return <code>{ error }</code> instead, with these exact strings:</p>' +
            '<ul>' +
            '<li>a <code>squash</code> or <code>fixup</code> with nothing above it → <code>cannot \'&lt;cmd&gt;\' without a previous commit</code> (this is git\'s own wording)</li>' +
            '<li>an id that is not on the branch → <code>unknown commit: &lt;id&gt;</code></li>' +
            '<li>the same id listed twice → <code>commit listed twice: &lt;id&gt;</code></li>' +
            '</ul>' +
            '<p>Keep the given data and the printing loop exactly as they are.</p>',

            '<p><b>Câu 32 — Phát lại một lần rebase tương tác (chương 8).</b> Cài đặt <code>replay(branch, todo)</code>: cho nhánh ban đầu (cũ nhất trước) và một danh sách việc của rebase, hãy tính ra những lời nhắn commit còn sống sót.</p>' +
            '<p>Mỗi dòng todo có dạng <code>&lt;lệnh&gt; &lt;id&gt;</code>, riêng <code>reword</code> là <code>reword &lt;id&gt; =&gt; &lt;lời nhắn mới&gt;</code>. Các lệnh:</p>' +
            '<ul>' +
            '<li><code>pick</code> — giữ nguyên commit.</li>' +
            '<li><code>reword</code> — giữ thay đổi, thay lời nhắn.</li>' +
            '<li><code>squash</code> — nhập vào commit sống sót ngay trước đó và nối hai lời nhắn, ngăn bằng một dòng trống (<code>&quot;trước\\n\\nnày&quot;</code>).</li>' +
            '<li><code>fixup</code> — nhập vào commit sống sót ngay trước đó và VỨT lời nhắn này đi.</li>' +
            '<li><code>drop</code> — bỏ hẳn commit.</li>' +
            '</ul>' +
            '<p>Danh sách có thể đổi thứ tự commit. Thành công thì trả <code>{ messages, count }</code>, trong đó <code>messages</code> là danh sách kết quả, cũ nhất trước.</p>' +
            '<p>Ba trường hợp hỏng thì trả <code>{ error }</code>, với đúng các chuỗi sau:</p>' +
            '<ul>' +
            '<li><code>squash</code> hay <code>fixup</code> mà phía trên không có gì → <code>cannot \'&lt;lệnh&gt;\' without a previous commit</code> (đây là nguyên văn chữ của git)</li>' +
            '<li>một id không thuộc nhánh → <code>unknown commit: &lt;id&gt;</code></li>' +
            '<li>cùng một id xuất hiện hai lần → <code>commit listed twice: &lt;id&gt;</code></li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// Lịch sử ban đầu, cũ nhất trước. `id` đứng thay cho mã băm rút gọn.\n' +
            'const BRANCH = [\n' +
            "  { id: 'aaa1111', message: 'feat: add login form' },\n" +
            "  { id: 'bbb2222', message: 'fix typo' },\n" +
            "  { id: 'ccc3333', message: 'feat: add logout' },\n" +
            "  { id: 'ddd4444', message: 'wip' },\n" +
            '];\n\n' +
            'const TODOS = [\n' +
            "  ['pick aaa1111', 'pick bbb2222', 'pick ccc3333', 'pick ddd4444'],\n" +
            "  ['pick aaa1111', 'fixup bbb2222', 'pick ccc3333', 'fixup ddd4444'],\n" +
            "  ['pick aaa1111', 'squash bbb2222', 'pick ccc3333', 'drop ddd4444'],\n" +
            "  ['pick ccc3333', 'pick aaa1111', 'fixup bbb2222'],\n" +
            "  ['pick aaa1111', 'reword bbb2222 => fix: correct the label', 'pick ccc3333'],\n" +
            "  ['squash aaa1111', 'pick bbb2222'],\n" +
            "  ['pick aaa1111', 'pick aaa1111'],\n" +
            "  ['pick aaa1111', 'pick eee5555'],\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function replay(branch, todo) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const [n, todo] of TODOS.entries()) {\n' +
            '  const out = replay(BRANCH, todo);\n' +
            "  console.log('todo#' + (n + 1) + ' -> ' + JSON.stringify(out));\n" +
            '}\n',
          expectedOutput:
            'todo#1 -> {"messages":["feat: add login form","fix typo","feat: add logout","wip"],"count":4}\n' +
            'todo#2 -> {"messages":["feat: add login form","feat: add logout"],"count":2}\n' +
            'todo#3 -> {"messages":["feat: add login form\\n\\nfix typo","feat: add logout"],"count":2}\n' +
            'todo#4 -> {"messages":["feat: add logout","feat: add login form"],"count":2}\n' +
            'todo#5 -> {"messages":["feat: add login form","fix: correct the label","feat: add logout"],"count":3}\n' +
            'todo#6 -> {"error":"cannot \'squash\' without a previous commit"}\n' +
            'todo#7 -> {"error":"commit listed twice: aaa1111"}\n' +
            'todo#8 -> {"error":"unknown commit: eee5555"}',
          sampleSolution:
            'function replay(branch, todo) {\n' +
            '  const byId = new Map(branch.map((cm) => [cm.id, cm]));\n' +
            '  const out = [];\n' +
            '  const seen = new Set();\n\n' +
            '  for (const line of todo) {\n' +
            '    const m = /^(\\w+)\\s+(\\w+)(?:\\s+=>\\s+(.*))?$/.exec(line.trim());\n' +
            "    if (!m) return { error: 'bad todo line: ' + line };\n" +
            '    const [, cmd, id, newMessage] = m;\n\n' +
            "    if (!byId.has(id)) return { error: 'unknown commit: ' + id };\n" +
            "    if (seen.has(id)) return { error: 'commit listed twice: ' + id };\n" +
            '    seen.add(id);\n\n' +
            '    const original = byId.get(id).message;\n\n' +
            "    if (cmd === 'drop') continue;\n" +
            "    if (cmd === 'pick') { out.push(original); continue; }\n" +
            "    if (cmd === 'reword') { out.push(newMessage ?? original); continue; }\n\n" +
            "    if (cmd === 'squash' || cmd === 'fixup') {\n" +
            '      // Nhập vào cái nằm TRÊN nó trong danh sách, tức commit sớm hơn.\n' +
            '      if (!out.length) return { error: "cannot \'" + cmd + "\' without a previous commit" };\n' +
            "      if (cmd === 'squash') out[out.length - 1] += '\\n\\n' + original;\n" +
            '      continue;\n' +
            '    }\n\n' +
            "    return { error: 'unknown command: ' + cmd };\n" +
            '  }\n\n' +
            '  return { messages: out, count: out.length };\n' +
            '}\n',
        }),
      ],
    },
  ],
};
