/**
 * Git & GitHub — Progress Test 3 (Chương 10 → 13).
 *
 * Đề tự soạn, bám sát `content/courses/git/s10-kho-lon.mjs` …
 * `s13-cuu-ho.mjs`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong
 * phòng thi.
 *
 * ⚠️ MỌI transcript, mọi thông báo lỗi và mọi mã thoát trong đề này đều lấy từ
 * KHO NHÁP THẬT dựng trong scratchpad (NGOÀI kho api-backend) — có worktree
 * liên kết, có submodule thật, có hook thật, có sparse-checkout thật — chạy bằng
 *
 *     git version 2.51.1   (Homebrew, macOS arm64, 10/09/2026)
 *
 * với `GIT_CONFIG_GLOBAL` trỏ vào file rỗng và `GIT_CONFIG_SYSTEM=/dev/null`.
 * Mã băm là mã băm thật của kho nháp đó. Vài câu dùng mã băm bảy ký tự dạng giữ
 * chỗ (`3f8a1c9`, `c7f1a30`) đúng như giáo trình dùng; những chỗ đó không hỏi gì
 * về giá trị của mã băm.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BA CHỖ MÁY KHÁC GIÁO TRÌNH (đo 10/09/2026, git 2.51.1)
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. LỜI TỪ CHỐI CỦA WORKTREE ĐÃ ĐỔI CHỮ. Bài 10.1 trích
 *        fatal: 'main' is already checked out at …
 *    Máy 2.51.1 trả
 *        fatal: 'feature' is already used by worktree at '/…/wt-feature'
 *    "used by worktree", không phải "checked out". Câu 1 và câu 2 chép bản của
 *    MÁY. (Bản của FE cũng đã dùng chữ mới này — giáo trình mới là chỗ lệch.)
 *
 * 2. `git worktree list` NAY CÓ CỘT `prunable`. Sau khi xoá thư mục worktree
 *    bằng `rm -rf`, máy in
 *        /…/wt-feature  a035221 [feature] prunable
 *    Giáo trình mô tả đúng tình huống (Git vẫn tin nhánh đang được checkout) mà
 *    không nhắc tới cái dấu này — dấu đó chính là thứ nói cho bạn biết phải chạy
 *    `git worktree prune`.
 *
 * 3. `git verify-commit` TRÊN COMMIT CHƯA KÝ IM LẶNG HOÀN TOÀN: không in một
 *    dòng nào, chỉ trả mã thoát 1. Bài 12.2 chỉ dạy bảng `%G?` (và đúng: máy in
 *    `N` cho commit chưa ký). Nhưng một script kiểm chữ ký mà chỉ đọc stdout thì
 *    "không có output" trông y hệt "mọi thứ ổn" — phải xét MÃ THOÁT. Câu 21 hỏi
 *    đúng chỗ đó.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh trong đề bài):
 *     { '0': 7, '1': 8, '2': 8, '3': 7 }   → A 7 · B 8 · C 8 · D 7
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/GIT-PT3.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/git-exam-kit.mjs';

export default {
  course: { slug: 'git' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 10–13 (big repositories, the GitHub platform, hooks & signing, disaster recovery)',
        'Kiểm tra tiến độ 3 — Chương 10–13 (kho mã lớn, nền tảng GitHub, hook & ký commit, cứu hộ)',
      ),
      description: B(
        'The last third of the Git course: worktrees, submodules and subtree, monorepos, sparse-checkout and LFS, issues and GitHub Actions, hooks and commit signing, and the disaster recovery cookbook. 30 multiple-choice questions plus 2 programming questions you write here in the exam room.',
        'Một phần ba cuối của khoá Git: worktree, submodule và subtree, monorepo, sparse-checkout và LFS, issue và GitHub Actions, hook và ký commit, cùng sách công thức cứu hộ. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '10–13'),
      questions: [
        // ── Chương 10 — Kho mã lớn ──────────────────────────────────────
        mcq({
          prompt: B(
            'A linked worktree was created and then inspected. What is <code>.git</code> inside it?' + code(
              '$ git worktree add ../wt-feature feature\n' +
              "Preparing worktree (checking out 'feature')\n" +
              'HEAD is now at a035221 A\n' +
              '\n' +
              '$ ls -la ../wt-feature/.git\n' +
              '-rw-r--r--  1 admin  wheel  146 Sep 10 06:05 ../wt-feature/.git\n' +
              '\n' +
              '$ cat ../wt-feature/.git\n' +
              'gitdir: /…/r20/.git/worktrees/wt-feature',
            ),
            'Một worktree liên kết được tạo ra rồi đem soi. <code>.git</code> bên trong nó là gì?' + code(
              '$ git worktree add ../wt-feature feature\n' +
              "Preparing worktree (checking out 'feature')\n" +
              'HEAD is now at a035221 A\n' +
              '\n' +
              '$ ls -la ../wt-feature/.git\n' +
              '-rw-r--r--  1 admin  wheel  146 Sep 10 06:05 ../wt-feature/.git\n' +
              '\n' +
              '$ cat ../wt-feature/.git\n' +
              'gitdir: /…/r20/.git/worktrees/wt-feature',
            ),
          ),
          options: [
            B('A symbolic link to the main repository\'s <code>.git</code> directory, which is why the two worktrees share absolutely everything including HEAD', 'Một liên kết tượng trưng tới thư mục <code>.git</code> của kho chính, và vì thế hai worktree dùng chung tuyệt đối mọi thứ, kể cả HEAD'),
            B('A plain FILE (146 bytes) pointing back into the main repository — the objects and refs are shared, while HEAD, the index and the reflog live per-worktree under <code>.git/worktrees/&lt;name&gt;/</code>', 'Một FILE thường (146 byte) trỏ ngược về kho chính — kho đối tượng và các ref thì dùng chung, còn HEAD, index và reflog nằm riêng cho từng worktree dưới <code>.git/worktrees/&lt;tên&gt;/</code>'),
            B('A complete second copy of the object database, which is what makes a worktree as expensive on disk as a fresh clone', 'Một bản sao thứ hai đầy đủ của kho đối tượng, và đó là lý do một worktree tốn đĩa ngang một lần clone mới'),
            B('A directory containing only <code>config</code> and <code>HEAD</code>; every other file is fetched from the main repository on demand over a local socket', 'Một thư mục chỉ chứa <code>config</code> và <code>HEAD</code>; mọi file khác được lấy từ kho chính khi cần qua một socket cục bộ'),
          ],
          correct: 1,
          explanation: EX(
            'Copied verbatim from the scratch repository — note it is a file, not a directory, and 146 bytes long. That single line is the whole trick: a second worktree costs one checkout, not one clone. Shared objects and refs mean a commit made in one worktree is immediately visible from the other with no push or fetch; separate HEAD and index mean the two never stage over each other. That combination is why the course recommends one worktree per AI agent session — two agents in one directory will <code>git add</code> over each other\'s half-written files.',
            'Chép nguyên văn từ kho nháp — để ý đó là một file chứ không phải thư mục, và dài 146 byte. Một dòng đó là toàn bộ mẹo: một worktree thứ hai tốn một lần checkout, không phải một lần clone. Dùng chung đối tượng và ref nghĩa là một commit tạo ở worktree này nhìn thấy ngay từ worktree kia, khỏi push khỏi fetch; HEAD và index riêng nghĩa là hai bên không bao giờ staging đè lên nhau. Đúng sự kết hợp đó là lý do bài học khuyên mỗi phiên agent AI một worktree — hai agent trong cùng một thư mục sẽ <code>git add</code> đè lên file viết dở của nhau.',
          ),
        }),

        mcq({
          prompt: B(
            'You deleted a worktree directory with <code>rm -rf</code>. Now this happens. What is going on?' + code(
              '$ git worktree list\n' +
              '/…/r20          a035221 [main]\n' +
              '/…/wt-feature   a035221 [feature] prunable\n' +
              '\n' +
              '$ git switch feature\n' +
              "fatal: 'feature' is already used by worktree at '/…/wt-feature'",
            ),
            'Bạn đã xoá thư mục worktree bằng <code>rm -rf</code>. Giờ chuyện này xảy ra. Đang có vấn đề gì?' + code(
              '$ git worktree list\n' +
              '/…/r20          a035221 [main]\n' +
              '/…/wt-feature   a035221 [feature] prunable\n' +
              '\n' +
              '$ git switch feature\n' +
              "fatal: 'feature' is already used by worktree at '/…/wt-feature'",
            ),
          ),
          options: [
            B('The branch itself was deleted along with the directory; recreate it with <code>git switch -c feature &lt;hash&gt;</code> from the reflog', 'Bản thân cái nhánh đã bị xoá theo thư mục; hãy tạo lại bằng <code>git switch -c feature &lt;mã băm&gt;</code> lấy từ reflog'),
            B('The repository is corrupt because a worktree was removed outside Git; the only fix is a fresh clone followed by <code>git fsck --lost-found</code>', 'Kho bị hỏng vì một worktree bị gỡ ngoài tầm kiểm soát của Git; cách sửa duy nhất là clone lại rồi <code>git fsck --lost-found</code>'),
            B('Git still holds the administrative record and believes <code>feature</code> is checked out at a path that no longer exists; <code>git worktree prune</code> drops the stale record — and <code>git worktree remove</code> would have avoided the situation entirely', 'Git vẫn giữ bản ghi hành chính và tin rằng <code>feature</code> đang được checkout ở một đường dẫn không còn tồn tại; <code>git worktree prune</code> xoá bản ghi cũ đó — còn <code>git worktree remove</code> thì đã tránh được hẳn tình huống này'),
            B('Two worktrees may never hold the same commit; because both now point at <code>a035221</code>, Git refuses the switch until one of them moves forward', 'Hai worktree không bao giờ được giữ cùng một commit; vì cả hai đang trỏ vào <code>a035221</code> nên Git từ chối cho chuyển cho tới khi một bên đi tiếp'),
          ],
          correct: 2,
          explanation: EX(
            'Reproduced exactly, including the <code>prunable</code> marker — which is the machine telling you what to run. After <code>git worktree prune</code>, the same <code>git switch feature</code> answered <code>Switched to branch \'feature\'</code>. The refusal itself is a protection, not an annoyance: two directories committing onto one branch would produce a state neither of them expects. When you genuinely want the same commit in two places, use a different branch or <code>--detach</code>.',
            'Đã tái hiện đúng, kể cả cái dấu <code>prunable</code> — chính là máy đang bảo bạn phải chạy lệnh gì. Sau <code>git worktree prune</code>, đúng lệnh <code>git switch feature</code> đó trả lời <code>Switched to branch \'feature\'</code>. Bản thân lời từ chối là một sự bảo vệ chứ không phải sự phiền phức: hai thư mục cùng commit lên một nhánh sẽ sinh ra một trạng thái mà không bên nào lường được. Khi bạn thật sự muốn cùng một commit ở hai chỗ, hãy dùng nhánh khác hoặc <code>--detach</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'You add a worktree to fix a production bug while your feature branch stays checked out in the main directory. You <code>cd</code> into the new worktree and the build immediately fails. Why?',
            'Bạn thêm một worktree để vá một lỗi production trong khi nhánh tính năng vẫn đang được checkout ở thư mục chính. Bạn <code>cd</code> vào worktree mới và bản dựng hỏng ngay. Vì sao?',
          ),
          options: [
            B('Ignored files are not copied into a new worktree: it has no <code>node_modules</code>, no <code>.env</code> and no build cache, because none of those are in the repository', 'File bị ignore không được chép sang worktree mới: nó không có <code>node_modules</code>, không có <code>.env</code>, không có cache build — vì chẳng cái nào nằm trong kho mã'),
            B('A linked worktree is read-only until you run <code>git worktree unlock</code>, so the build cannot write its output directory', 'Một worktree liên kết là chỉ-đọc cho tới khi bạn chạy <code>git worktree unlock</code>, nên bản dựng không ghi được vào thư mục kết quả'),
            B('The two worktrees share one index, so the build tool sees a half-staged tree from the other directory', 'Hai worktree dùng chung một index, nên công cụ dựng nhìn thấy một cái cây staging dở dang từ thư mục kia'),
            B('The new worktree is shallow by default, so any tool that reads the version from <code>git describe</code> fails on the very first step', 'Worktree mới mặc định là nông, nên mọi công cụ đọc phiên bản từ <code>git describe</code> đều hỏng ngay bước đầu tiên'),
          ],
          correct: 0,
          explanation: EX(
            'A worktree gives you the tracked files at a commit, and nothing else — which is exactly right, because <code>node_modules</code> and <code>.env</code> were never in Git. Plan for it: <code>npm ci</code> and a copied <code>.env</code> are part of setting up a worktree. Two related surprises from the same lesson: the stash is SHARED (<code>refs/stash</code> is one ref for the whole repository, not one per worktree), and submodules must be initialised separately in each worktree with <code>git submodule update --init</code>. And for a two-minute interruption, <code>git stash</code> is still faster — a worktree earns its keep when the environment around the code is the expensive part.',
            'Một worktree đưa cho bạn các file được theo dõi tại một commit, và không gì khác — điều đó hoàn toàn đúng, vì <code>node_modules</code> và <code>.env</code> chưa bao giờ nằm trong Git. Hãy tính trước: <code>npm ci</code> và chép <code>.env</code> sang là một phần của việc dựng worktree. Hai bất ngờ cùng bài: stash là thứ DÙNG CHUNG (<code>refs/stash</code> là một ref duy nhất cho cả kho, không phải mỗi worktree một cái), và submodule phải được khởi tạo riêng ở từng worktree bằng <code>git submodule update --init</code>. Còn với một lần gián đoạn hai phút thì <code>git stash</code> vẫn nhanh hơn — worktree trả công khi môi trường quanh mã mới là thứ đắt đỏ.',
          ),
        }),

        mcq({
          prompt: B(
            'A parent repository reports this about its submodule. What does the leading <code>+</code> mean, and what does <code>git diff</code> in the parent then show?' + code(
              '$ git submodule status\n' +
              '+8b731536833fbdb3526a217c53aca5159ae3a392 vendor/sublib (heads/main)\n' +
              '\n' +
              '$ git diff\n' +
              'diff --git a/vendor/sublib b/vendor/sublib\n' +
              'index 61cbfd0..8b73153 160000\n' +
              '-Subproject commit 61cbfd006f33d87e248dbe485756670c77a0c503\n' +
              '+Subproject commit 8b731536833fbdb3526a217c53aca5159ae3a392',
            ),
            'Một kho cha báo cáo như thế này về submodule của nó. Dấu <code>+</code> ở đầu nghĩa là gì, và <code>git diff</code> trong kho cha khi đó hiện gì?' + code(
              '$ git submodule status\n' +
              '+8b731536833fbdb3526a217c53aca5159ae3a392 vendor/sublib (heads/main)\n' +
              '\n' +
              '$ git diff\n' +
              'diff --git a/vendor/sublib b/vendor/sublib\n' +
              'index 61cbfd0..8b73153 160000\n' +
              '-Subproject commit 61cbfd006f33d87e248dbe485756670c77a0c503\n' +
              '+Subproject commit 8b731536833fbdb3526a217c53aca5159ae3a392',
            ),
          ),
          options: [
            B('<code>+</code> means the submodule has uncommitted changes; the diff shows them the way it would for any other directory in the repository', '<code>+</code> nghĩa là submodule còn thay đổi chưa commit; bản diff hiện chúng y như với bất kỳ thư mục nào khác trong kho'),
            B('<code>+</code> means the submodule is ahead of its remote and needs pushing; the parent repository is otherwise clean', '<code>+</code> nghĩa là submodule đang đi trước remote của nó và cần được push; ngoài ra kho cha vẫn sạch'),
            B('<code>+</code> means the submodule has not been initialised; the diff is the placeholder Git shows for an empty directory', '<code>+</code> nghĩa là submodule chưa được khởi tạo; bản diff đó là chỗ giữ chỗ Git hiện cho một thư mục rỗng'),
            B('<code>+</code> means the checked-out commit differs from the one PINNED in the parent; the parent\'s whole diff is one line of forty characters, because a submodule is stored as a gitlink (mode <code>160000</code>), not as files', '<code>+</code> nghĩa là commit đang checkout khác với commit ĐƯỢC GHIM trong kho cha; toàn bộ bản diff của kho cha là một dòng bốn mươi ký tự, vì submodule được lưu dưới dạng gitlink (chế độ <code>160000</code>), không phải dưới dạng file'),
          ],
          correct: 3,
          explanation: EX(
            'Every line above came from a real submodule in the scratch lab. The three status symbols are worth memorising: <code>-hash</code> not initialised (the directory is empty and your build fails with a confusing "module not found"), <code>&nbsp;hash</code> exactly on the pinned commit, <code>+hash</code> on a different one. The gitlink is also why a submodule conflict is resolved by choosing the right COMMIT rather than by editing text, and why the push order is submodule first, parent second — get it backwards and every colleague gets <code>fatal: reference is not a tree</code>.',
            'Mọi dòng ở trên đều lấy từ một submodule thật trong phòng thí nghiệm nháp. Ba ký hiệu trạng thái đáng thuộc: <code>-mã băm</code> chưa khởi tạo (thư mục trống và bản dựng hỏng với một thông báo "module not found" khó hiểu), <code>&nbsp;mã băm</code> đang ở đúng commit được ghim, <code>+mã băm</code> đang ở một commit khác. Cái gitlink cũng là lý do một xung đột submodule được giải bằng cách chọn đúng COMMIT chứ không phải sửa chữ, và là lý do thứ tự push là submodule trước, kho cha sau — làm ngược là mọi đồng nghiệp nhận <code>fatal: reference is not a tree</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Removing a submodule takes four steps. What breaks if you skip the third one?' + code(
              'git submodule deinit -f vendor/ui-kit\n' +
              'git rm -f vendor/ui-kit\n' +
              'rm -rf .git/modules/vendor/ui-kit\n' +
              'git commit -m "chore: bo submodule ui-kit"',
            ),
            'Gỡ một submodule cần bốn bước. Bỏ qua bước thứ ba thì hỏng gì?' + code(
              'git submodule deinit -f vendor/ui-kit\n' +
              'git rm -f vendor/ui-kit\n' +
              'rm -rf .git/modules/vendor/ui-kit\n' +
              'git commit -m "chore: bo submodule ui-kit"',
            ),
          ),
          options: [
            B('Nothing breaks now, but the commit is incomplete and colleagues will see the directory come back on their next <code>git pull</code>', 'Không hỏng gì ngay, nhưng commit bị thiếu và đồng nghiệp sẽ thấy thư mục đó quay lại ở lần <code>git pull</code> kế tiếp'),
            B('The stale metadata stays under <code>.git/modules/</code>, so adding a submodule at the SAME path again later fails or silently reuses the old configuration — and <code>.git/</code> is not in the repository, so the leftover is invisible to everyone else', 'Siêu dữ liệu cũ nằm lại dưới <code>.git/modules/</code>, nên về sau thêm một submodule ở CÙNG đường dẫn sẽ hỏng hoặc âm thầm dùng lại cấu hình cũ — và <code>.git/</code> không nằm trong kho mã nên phần sót lại đó vô hình với mọi người khác'),
            B('The submodule\'s own history is lost permanently, because <code>.git/modules/</code> is the only place its objects were ever stored', 'Lịch sử của chính cái submodule mất vĩnh viễn, vì <code>.git/modules/</code> là nơi duy nhất từng lưu các đối tượng của nó'),
            B('<code>git rm -f</code> is rejected on the next run with "submodule still registered", so the removal simply cannot be completed', 'Lần chạy sau, <code>git rm -f</code> bị từ chối với thông báo "submodule still registered", nên việc gỡ đơn giản là không hoàn tất được'),
          ],
          correct: 1,
          explanation: EX(
            'A submodule is registered in three places: <code>.gitmodules</code> (committed), <code>.git/config</code> (local), and <code>.git/modules/&lt;path&gt;</code> (the submodule\'s own repository, local). The first two steps clean the first two, and the third cleans the one nobody remembers. Because it lives under <code>.git/</code>, the mess only exists on your machine — which is exactly why it is so confusing when you hit it months later and nobody else can reproduce it. Worth stepping back: before reaching for submodules at all, ask whether a package registry solves the problem, because it usually does and it comes with versions, caching and a lockfile.',
            'Một submodule được đăng ký ở ba chỗ: <code>.gitmodules</code> (được commit), <code>.git/config</code> (cục bộ), và <code>.git/modules/&lt;đường dẫn&gt;</code> (chính kho của submodule, cục bộ). Hai bước đầu dọn hai chỗ đầu, bước thứ ba dọn cái chỗ chẳng ai nhớ. Vì nó nằm dưới <code>.git/</code> nên mớ rác đó chỉ tồn tại trên máy bạn — và đúng vì thế mà nó cực kỳ khó hiểu khi bạn gặp lại sau nhiều tháng còn không ai khác tái hiện được. Đáng lùi lại một bước: trước khi vớ lấy submodule, hãy hỏi xem một package registry có giải quyết được không, vì thường là được, và nó còn kèm theo phiên bản, cache và lockfile.',
          ),
        }),

        mcq({
          prompt: B(
            'Your team is choosing between a submodule and a subtree for a shared UI library. What is the trade-off the course describes?',
            'Nhóm của bạn đang chọn giữa submodule và subtree cho một thư viện UI dùng chung. Bài học mô tả sự đánh đổi nào?',
          ),
          options: [
            B('Submodule copies the library into your repository and subtree only pins a commit; subtree is therefore the smaller of the two on disk', 'Submodule chép thư viện vào kho của bạn còn subtree chỉ ghim một commit; nên subtree là cái nhỏ hơn trên đĩa'),
            B('They are functionally identical; subtree is simply the newer command and submodule is kept only for backwards compatibility', 'Chúng giống hệt nhau về chức năng; subtree chỉ là lệnh mới hơn còn submodule được giữ lại vì tương thích ngược'),
            B('Submodule pins ONE commit of another repository as a forty-character gitlink, so a plain clone gives an empty directory and everyone needs extra commands; subtree copies the files in for real, so a clone just works — at the cost of repository size and history noise', 'Submodule ghim MỘT commit của kho khác dưới dạng gitlink bốn mươi ký tự, nên một lần clone thường cho ra thư mục trống và ai cũng phải gõ thêm lệnh; subtree chép hẳn file vào, nên clone là chạy được ngay — đổi lại là kích thước kho và tiếng ồn lịch sử'),
            B('Subtree requires the library to be a public repository while submodule works with private ones, which is the only practical difference between them', 'Subtree đòi hỏi thư viện phải là kho công khai còn submodule thì dùng được với kho riêng tư, và đó là khác biệt thực tế duy nhất giữa hai cái'),
          ],
          correct: 2,
          explanation: EX(
            'The cost of a submodule is coordination: an empty directory after a normal clone, a pin that does not follow a branch, a detached HEAD inside it, two pushes in the right order, and merge conflicts on the gitlink. The cost of a subtree is repository size plus long commands that people forget — write them into a Makefile. <code>--squash</code> keeps the imported history to one commit per update. And the honest summary from the lesson: whenever a package registry is available, it beats both.',
            'Cái giá của submodule là chi phí phối hợp: thư mục trống sau một lần clone thường, cái ghim không đi theo nhánh, HEAD lìa cành ở bên trong, hai lần push đúng thứ tự, và xung đột hợp nhất trên gitlink. Cái giá của subtree là kích thước kho cộng những lệnh dài tới mức người ta quên — hãy viết chúng vào một Makefile. Cờ <code>--squash</code> giữ phần lịch sử nhập vào ở mức một commit mỗi lần cập nhật. Và lời tóm tắt thẳng thắn của bài: hễ có package registry dùng được thì nó thắng cả hai.',
          ),
        }),

        mcq({
          prompt: B(
            'A monorepo was cloned with sparse-checkout so that only <code>apps/web</code> and <code>packages/ui</code> are on disk. What do these two commands print?' + code(
              '$ ls apps\n' +
              'web\n' +
              '\n' +
              '$ git log --oneline -- apps/admin\n' +
              '???',
            ),
            'Một monorepo được clone kèm sparse-checkout sao cho chỉ <code>apps/web</code> và <code>packages/ui</code> nằm trên đĩa. Hai lệnh sau in ra gì?' + code(
              '$ ls apps\n' +
              'web\n' +
              '\n' +
              '$ git log --oneline -- apps/admin\n' +
              '???',
            ),
          ),
          options: [
            B('The full history of <code>apps/admin</code> — sparse-checkout changes only which files are WRITTEN to the working directory; the history is complete and every path is still queryable and fetchable', 'Toàn bộ lịch sử của <code>apps/admin</code> — sparse-checkout chỉ đổi những file nào được GHI ra thư mục làm việc; lịch sử vẫn đầy đủ và mọi đường dẫn vẫn truy vấn được và lấy về được'),
            B('Nothing, because the commits touching <code>apps/admin</code> were filtered out of the clone along with the files', 'Không gì cả, vì những commit đụng tới <code>apps/admin</code> đã bị lọc khỏi bản clone cùng với các file'),
            B('An error, because a path outside the sparse set is not a valid pathspec until you run <code>git sparse-checkout add apps/admin</code>', 'Một lỗi, vì một đường dẫn ngoài tập sparse không phải pathspec hợp lệ cho tới khi bạn chạy <code>git sparse-checkout add apps/admin</code>'),
            B('Only the commits since the sparse-checkout was configured, because Git rewrites the local history to match the selected cone', 'Chỉ những commit kể từ lúc cấu hình sparse-checkout, vì Git viết lại lịch sử cục bộ cho khớp với cái cone đã chọn'),
          ],
          correct: 0,
          explanation: EX(
            'Verified in a real monorepo clone: after <code>git sparse-checkout set apps/web packages/ui</code>, <code>ls apps</code> showed only <code>web</code>, but <code>git ls-files</code> still listed <code>apps/admin/i.ts</code> and <code>git log --oneline -- apps/admin</code> still printed the commit. That separation — the working directory shrinks, the history does not — is the whole point: it turns a 40,000-file checkout into 2,000 without giving anything up. Cone mode has been the default since Git 2.26; only use <code>--no-cone</code> if you truly need per-file globs, and expect it to be slower.',
            'Đã kiểm trên một bản clone monorepo thật: sau <code>git sparse-checkout set apps/web packages/ui</code>, <code>ls apps</code> chỉ hiện <code>web</code>, nhưng <code>git ls-files</code> vẫn liệt kê <code>apps/admin/i.ts</code> và <code>git log --oneline -- apps/admin</code> vẫn in ra commit đó. Chính sự tách bạch ấy — thư mục làm việc thu nhỏ, lịch sử thì không — là toàn bộ ý nghĩa: nó biến một lần checkout 40.000 file thành 2.000 mà không phải từ bỏ gì. Chế độ cone là mặc định từ Git 2.26; chỉ dùng <code>--no-cone</code> khi thật sự cần mẫu ở mức từng file, và hãy chờ đợi nó chậm hơn.',
          ),
        }),

        mcq({
          prompt: B(
            'A colleague clones a repository that uses Git LFS, without having <code>git lfs</code> installed. They open <code>design/hero.psd</code> and find:' + code(
              'version https://git-lfs.github.com/spec/v1\n' +
              'oid sha256:4d7a1e8f9c2b5a6e0d3f7b1c4a8e2d6f0b9c3a5e7d1f4b8c2a6e0d3f7b1c4a8e\n' +
              'size 52428800',
            ) + 'What is that, and what does <code>GIT_LFS_SKIP_SMUDGE=1 git clone</code> do?',
            'Một đồng nghiệp clone một kho dùng Git LFS mà chưa cài <code>git lfs</code>. Họ mở <code>design/hero.psd</code> và thấy:' + code(
              'version https://git-lfs.github.com/spec/v1\n' +
              'oid sha256:4d7a1e8f9c2b5a6e0d3f7b1c4a8e2d6f0b9c3a5e7d1f4b8c2a6e0d3f7b1c4a8e\n' +
              'size 52428800',
            ) + 'Đó là cái gì, và <code>GIT_LFS_SKIP_SMUDGE=1 git clone</code> làm gì?',
          ),
          options: [
            B('A corrupted download; re-cloning with <code>--filter=blob:none</code> fetches the real file, and the environment variable disables the corruption check', 'Một lần tải hỏng; clone lại với <code>--filter=blob:none</code> sẽ lấy được file thật, còn biến môi trường kia tắt phép kiểm hỏng hóc'),
            B('A placeholder Git writes for any file over 50 MB regardless of LFS; the variable raises that limit for the clone', 'Chỗ giữ chỗ mà Git ghi ra cho mọi file trên 50 MB bất kể có LFS hay không; biến môi trường kia nâng cái ngưỡng đó lên cho lần clone'),
            B('An error message from the LFS server rendered into the file; the variable retries the download without authentication', 'Một thông báo lỗi từ máy chủ LFS được ghi thẳng vào file; biến môi trường kia thử tải lại mà không xác thực'),
            B('The three-line LFS POINTER that is what the repository actually stores — the 50 MB of bytes live on the LFS server; the variable clones the pointers only, which is what a CI job that does not need the assets wants', 'Đó là FILE CON TRỎ LFS ba dòng — thứ mà kho mã thật sự lưu; 50 MB byte kia nằm trên máy chủ LFS; biến môi trường đó chỉ clone các con trỏ, đúng thứ mà một job CI không cần tài sản nhị phân mong muốn'),
          ],
          correct: 3,
          explanation: EX(
            'Three lines in the repository, 50 MB on the LFS server (<code>52428800</code> bytes is exactly that). Without the client installed, the checkout leaves the pointer in place and the application silently fails to load an asset that LOOKS committed — no error, just a broken image. Two limits worth knowing: LFS is not retroactive (a 400 MB video committed in 2023 stays in every clone until you rewrite history), and it does not make binaries mergeable — it changes how they are stored, not what a merge means.',
            'Ba dòng trong kho mã, 50 MB trên máy chủ LFS (<code>52428800</code> byte đúng bằng thế). Không cài client thì lần checkout để nguyên cái con trỏ và ứng dụng âm thầm không nạp được một tài sản TRÔNG NHƯ đã được commit — không lỗi gì, chỉ là một cái ảnh vỡ. Hai giới hạn đáng biết: LFS không có hiệu lực ngược (một video 400 MB commit từ năm 2023 vẫn nằm trong mọi bản clone cho tới khi bạn viết lại lịch sử), và nó không làm file nhị phân merge được — nó đổi cách lưu trữ chứ không đổi ngữ nghĩa hợp nhất.',
          ),
        }),

        // ── Chương 11 — Nền tảng GitHub ─────────────────────────────────
        mcq({
          prompt: B(
            'The course recommends a label scheme built on THREE axes rather than a large flat set. What are they, and what goes wrong with forty unprefixed labels?' + code(
              'type:bug        type:feature     type:chore     type:docs\n' +
              'prio:high       prio:medium      prio:low\n' +
              'area:auth       area:feed        area:payments  area:infra',
            ),
            'Bài học khuyên dùng bộ nhãn dựng trên BA TRỤC thay vì một tập phẳng lớn. Ba trục đó là gì, và bốn mươi nhãn không tiền tố thì hỏng ở đâu?' + code(
              'type:bug        type:feature     type:chore     type:docs\n' +
              'prio:high       prio:medium      prio:low\n' +
              'area:auth       area:feed        area:payments  area:infra',
            ),
          ),
          options: [
            B('Author, reviewer and milestone; without prefixes GitHub cannot sort the labels alphabetically in the picker', 'Tác giả, người review và milestone; thiếu tiền tố thì GitHub không sắp được nhãn theo bảng chữ cái trong ô chọn'),
            B('What kind of thing it is, how urgent it is, and which part of the system it belongs to — prefixed labels sit together in the picker and read unambiguously, while a repository with forty unprefixed labels ends up with nobody labelling anything at all', 'Nó là loại gì, gấp tới đâu, và thuộc phần nào của hệ thống — nhãn có tiền tố đứng gần nhau trong ô chọn và đọc không nhập nhằng, còn một kho có bốn mươi nhãn không tiền tố rốt cuộc thành ra không ai gắn nhãn cho cái gì cả'),
            B('Open, closed and stale; the prefixes exist so that GitHub Actions can close inactive issues automatically without a script', 'Mở, đóng và cũ; các tiền tố tồn tại để GitHub Actions tự đóng những issue không hoạt động mà khỏi cần script'),
            B('Severity, customer and quarter; a flat set is fine technically but exceeds the GitHub limit of thirty labels per repository', 'Mức nghiêm trọng, khách hàng và quý; tập phẳng thì về kỹ thuật vẫn ổn nhưng vượt giới hạn ba mươi nhãn mỗi kho của GitHub'),
          ],
          correct: 1,
          explanation: EX(
            'Labels are a filtering tool, and a filter nobody applies is worse than no filter, because it looks like data. Three axes cover almost every real query — "open high-priority bugs in payments" — and the prefix makes the picker navigable. Keep the small set of workflow labels (<code>status:blocked</code>, <code>good-first-issue</code>, <code>help-wanted</code>) and stop there. The same discipline applies to where work is tracked: pick ONE place. The moment a decision only exists in a chat thread, it is gone in six weeks.',
            'Nhãn là một công cụ lọc, và một bộ lọc không ai gắn còn tệ hơn là không có bộ lọc nào, vì nó trông như dữ liệu. Ba trục phủ gần như mọi truy vấn thật — "các lỗi ưu tiên cao đang mở thuộc mảng thanh toán" — và cái tiền tố làm ô chọn đi lại được. Giữ thêm một nhóm nhỏ nhãn quy trình (<code>status:blocked</code>, <code>good-first-issue</code>, <code>help-wanted</code>) rồi dừng lại. Cùng kỷ luật đó áp cho chỗ theo dõi công việc: chọn MỘT chỗ. Khoảnh khắc một quyết định chỉ được ghi trong khung chat, sáu tuần sau nó biến mất.',
          ),
        }),

        mcq({
          prompt: B(
            'A CI run failed and you want to know why, from the terminal. Which command does the course single out as being worth installing <code>gh</code> for on its own?',
            'Một lượt chạy CI hỏng và bạn muốn biết vì sao, ngay từ terminal. Bài học chỉ đích danh lệnh nào là "riêng nó đã đáng để cài <code>gh</code>"?',
          ),
          options: [
            B('<code>gh run list --limit 5</code> — the only way to see whether a run happened at all without opening a browser tab', '<code>gh run list --limit 5</code> — cách duy nhất để biết có lượt chạy nào diễn ra không mà khỏi mở trình duyệt'),
            B('<code>gh run rerun --failed</code> — because re-running is faster than reading, and the second attempt usually passes', '<code>gh run rerun --failed</code> — vì chạy lại nhanh hơn đọc, và lần thử thứ hai thường là qua'),
            B('<code>gh run view --log-failed</code> — it prints the output of the FAILING step only, instead of scrolling a browser through four thousand lines of green', '<code>gh run view --log-failed</code> — nó chỉ in output của bước BỊ HỎNG, thay vì cuộn trình duyệt qua bốn nghìn dòng màu xanh'),
            B('<code>gh run watch</code> — it blocks until the run finishes, which is what lets a script wait for CI before deploying', '<code>gh run watch</code> — nó chờ cho tới khi lượt chạy xong, và đó là thứ cho phép một script đợi CI trước khi deploy'),
          ],
          correct: 2,
          explanation: EX(
            'Everything else on that list is useful too, but this is the one that changes the loop: the failing step, in your terminal, in one command. Pair it with the habit from the CuongThai operations notes — when CI goes red, check WHICH step failed and whether your commit even touches that part of the tree (<code>git show --stat</code>) before assuming it is your diff. A surprising share of red builds are somebody else\'s change, a flaky test, or an expired secret.',
            'Mọi lệnh khác trong danh sách đó cũng hữu ích, nhưng đây là cái đổi cả vòng lặp làm việc: đúng bước bị hỏng, ngay trong terminal, bằng một lệnh. Đi kèm nó là thói quen trong sổ tay vận hành CuongThai — khi CI đỏ, hãy kiểm BƯỚC NÀO hỏng và xem commit của bạn có chạm vào phần cây đó không (<code>git show --stat</code>) trước khi cho rằng lỗi nằm ở diff của mình. Một tỉ lệ đáng ngạc nhiên các bản dựng đỏ là do thay đổi của người khác, một test chớp nháy, hoặc một secret hết hạn.',
          ),
        }),

        mcq({
          prompt: B(
            'When does the course say to open a GitHub <b>Discussion</b> instead of an <b>Issue</b>?',
            'Bài học nói khi nào nên mở một <b>Discussion</b> trên GitHub thay vì một <b>Issue</b>?',
          ),
          options: [
            B('When there is no definition of done: a question, an idea or an announcement, which is why a Discussion is never "closed" and instead has threaded replies and an accepted answer — an Issue is a specific piece of work that CAN be finished', 'Khi không có định nghĩa thế nào là xong: một câu hỏi, một ý tưởng hay một thông báo, và vì thế Discussion không bao giờ được "đóng" mà thay vào đó có luồng trả lời và một câu trả lời được chấp nhận — còn Issue là một việc cụ thể CÓ THỂ hoàn thành'),
            B('When the report comes from outside the team, because Discussions are the only surface that external users can post to on a private repository', 'Khi báo cáo tới từ ngoài nhóm, vì Discussion là mặt duy nhất mà người dùng bên ngoài đăng được trên một kho riêng tư'),
            B('When the item is too large for one milestone; a Discussion is automatically split into several Issues once it passes a size threshold', 'Khi hạng mục quá lớn cho một milestone; một Discussion sẽ tự động được chẻ thành nhiều Issue khi vượt một ngưỡng kích thước'),
            B('When you want automation: a Discussion can move a Projects card, while an Issue cannot be linked to a project board at all', 'Khi bạn muốn tự động hoá: một Discussion dời được thẻ trong Projects, còn Issue thì hoàn toàn không liên kết được với bảng dự án'),
          ],
          correct: 0,
          explanation: EX(
            'The test is whether the thing can be finished. "Feed returns 500 when a post has no author" has a definition of done and closes; "should we move to server components?" does not, and forcing it into an Issue leaves a ticket that stays open forever and slowly stops meaning anything. Whichever you choose, write the resolution into it when you close it: six months later, "closed" with no explanation is indistinguishable from "abandoned".',
            'Phép thử là cái đó có kết thúc được không. "Feed trả 500 khi một bài không có tác giả" có định nghĩa thế nào là xong và sẽ đóng lại được; "có nên chuyển sang server component không?" thì không, và ép nó vào một Issue là để lại một tấm phiếu mở mãi mãi và dần dần hết mang ý nghĩa gì. Chọn cái nào cũng vậy, hãy viết cách giải quyết vào đó khi đóng: sáu tháng sau, chữ "closed" không kèm giải thích thì không phân biệt được với "bỏ dở".',
          ),
        }),

        mcq({
          prompt: B(
            'A workflow caches dependencies like this. What does <code>restore-keys</code> add?' + code(
              '- uses: actions/cache@v4\n' +
              '  with:\n' +
              '    path: .next/cache\n' +
              "    key: build-Linux-<hash of package-lock.json>\n" +
              '    restore-keys: build-Linux-',
            ),
            'Một workflow cache thư viện như sau. <code>restore-keys</code> thêm gì?' + code(
              '- uses: actions/cache@v4\n' +
              '  with:\n' +
              '    path: .next/cache\n' +
              "    key: build-Linux-<mã băm của package-lock.json>\n" +
              '    restore-keys: build-Linux-',
            ),
          ),
          options: [
            B('It names an alternative cache to write to when the primary key is already taken by another branch', 'Nó gọi tên một cache thay thế để ghi vào khi khoá chính đã bị một nhánh khác chiếm'),
            B('It lists the keys to DELETE after the job finishes, which is how a workflow keeps its cache storage under the repository quota', 'Nó liệt kê những khoá cần XOÁ sau khi job xong, và đó là cách một workflow giữ dung lượng cache dưới hạn ngạch của kho'),
            B('It forces a cache miss on every run so the step always rebuilds, which is the recommended setting for release builds', 'Nó ép trượt cache ở mọi lượt chạy để bước đó luôn dựng lại, đây là thiết lập khuyến nghị cho bản dựng phát hành'),
            B('A PREFIX fallback: when no cache matches the exact key, the newest cache whose key starts with that prefix is restored — so a lockfile change gives you a warm cache instead of a cold one, and the fresh cache is saved under the new exact key', 'Một cơ chế rơi về theo TIỀN TỐ: khi không có cache nào khớp chính xác khoá, cache mới nhất có khoá bắt đầu bằng tiền tố đó sẽ được khôi phục — nên một lần đổi lockfile cho bạn cache ấm thay vì cache nguội, và cache mới được lưu lại dưới khoá chính xác mới'),
          ],
          correct: 3,
          explanation: EX(
            'The exact key is what gets SAVED; the restore keys are what gets LOADED when the exact key misses. Without a prefix fallback, every dependency bump throws away the whole cache and you pay a cold build; with one, you start from yesterday\'s cache and only the changed part is recomputed. For npm specifically, <code>actions/setup-node</code> with <code>cache: npm</code> does the same job in one line; <code>actions/cache</code> is for everything else — a Next.js build cache, Playwright browsers, a compiler cache.',
            'Khoá chính xác là thứ được LƯU; các restore key là thứ được NẠP khi khoá chính xác trượt. Không có cơ chế rơi về theo tiền tố thì mỗi lần nâng một thư viện là vứt cả cache và bạn trả giá bằng một bản dựng nguội; có nó thì bạn bắt đầu từ cache của hôm qua và chỉ phần thay đổi mới phải tính lại. Riêng với npm thì <code>actions/setup-node</code> kèm <code>cache: npm</code> làm đúng việc đó bằng một dòng; <code>actions/cache</code> dành cho mọi thứ còn lại — cache build của Next.js, trình duyệt của Playwright, cache của trình biên dịch.',
          ),
        }),

        mcq({
          prompt: B(
            'How many jobs does this matrix produce, and what does <code>fail-fast: false</code> change?' + code(
              'strategy:\n' +
              '  fail-fast: false\n' +
              '  matrix:\n' +
              '    node: [20, 22]\n' +
              '    os: [ubuntu-latest, windows-latest]',
            ),
            'Ma trận này sinh ra bao nhiêu job, và <code>fail-fast: false</code> đổi gì?' + code(
              'strategy:\n' +
              '  fail-fast: false\n' +
              '  matrix:\n' +
              '    node: [20, 22]\n' +
              '    os: [ubuntu-latest, windows-latest]',
            ),
          ),
          options: [
            B('Two jobs, one per operating system, each looping over both Node versions in sequence; the flag makes the loop continue past the first failing version', 'Hai job, mỗi hệ điều hành một cái, mỗi cái chạy tuần tự qua cả hai phiên bản Node; cái cờ làm vòng lặp đi tiếp sau phiên bản hỏng đầu tiên'),
            B('Four jobs, the cross product, running in parallel; by default the first failure cancels the rest, and <code>fail-fast: false</code> lets them all finish so you can see whether the failure is one combination or all of them', 'Bốn job, tích chéo, chạy song song; mặc định thì cái hỏng đầu tiên huỷ hết phần còn lại, và <code>fail-fast: false</code> để chúng chạy hết để bạn thấy được lỗi nằm ở một tổ hợp hay ở tất cả'),
            B('Four jobs, but they run in sequence because a matrix shares one runner; the flag has no effect unless <code>max-parallel</code> is also set', 'Bốn job, nhưng chạy tuần tự vì một ma trận dùng chung một runner; cái cờ không có tác dụng trừ khi đặt thêm <code>max-parallel</code>'),
            B('Four jobs; <code>fail-fast: false</code> retries each failing combination once before reporting it, which is the built-in defence against flaky tests', 'Bốn job; <code>fail-fast: false</code> thử lại mỗi tổ hợp hỏng một lần trước khi báo, đó là lá chắn cài sẵn chống test chớp nháy'),
          ],
          correct: 1,
          explanation: EX(
            'Two by two is four, and jobs run in parallel by default — <code>needs:</code> is what forces an order. The default fail-fast behaviour is optimised for speed and terrible for diagnosis: knowing that Node 20 on Windows failed tells you much less than knowing that Node 20 on Windows failed while the other three passed. Remember that each job gets its OWN machine, so files written in one job are not visible in another unless you upload them as an artifact.',
            'Hai nhân hai là bốn, và các job mặc định chạy song song — <code>needs:</code> mới là thứ ép thứ tự. Hành vi fail-fast mặc định được tối ưu cho tốc độ và rất tệ cho việc chẩn đoán: biết rằng Node 20 trên Windows hỏng thì ít thông tin hơn hẳn so với biết rằng Node 20 trên Windows hỏng trong khi ba cái kia đều qua. Nhớ rằng mỗi job có MÁY RIÊNG, nên file ghi ra ở job này không nhìn thấy được từ job kia trừ khi bạn tải lên dưới dạng artifact.',
          ),
        }),

        mcq({
          prompt: B(
            'A workflow declares <code>permissions: contents: read</code> at the top and raises it to <code>contents: write</code> on one job only. Why does the course also prefer <code>GITHUB_TOKEN</code> over a personal access token?',
            'Một workflow khai <code>permissions: contents: read</code> ở đầu file và chỉ nâng lên <code>contents: write</code> cho đúng một job. Vì sao bài học cũng ưu tiên <code>GITHUB_TOKEN</code> hơn một personal access token?',
          ),
          options: [
            B('Because a personal access token cannot be stored as a repository secret at all, so there is no way to use one from a workflow', 'Vì personal access token hoàn toàn không lưu được dưới dạng secret của kho, nên không có cách nào dùng nó từ một workflow'),
            B('Because <code>GITHUB_TOKEN</code> is not masked in logs and therefore does not need protecting, while a PAT does', 'Vì <code>GITHUB_TOKEN</code> không bị che trong log nên không cần bảo vệ, còn PAT thì cần'),
            B('Because <code>GITHUB_TOKEN</code> is minted per run, scoped to that repository, and expires when the job ends — while a leaked personal token is your whole account, on every repository you can reach', 'Vì <code>GITHUB_TOKEN</code> được đúc riêng cho từng lượt chạy, giới hạn trong đúng kho đó, và hết hạn khi job kết thúc — còn một token cá nhân bị lộ là cả tài khoản của bạn, trên mọi kho bạn với tới được'),
            B('Because a PAT ignores the <code>permissions:</code> block entirely and always runs with write access, which is a GitHub bug that has no workaround', 'Vì PAT bỏ qua hẳn khối <code>permissions:</code> và luôn chạy với quyền ghi, đó là một lỗi của GitHub và không có cách nào lách'),
          ],
          correct: 2,
          explanation: EX(
            'The blast radius is the whole argument: an ephemeral, repository-scoped token that dies with the job versus a credential that opens everything you own. Combine it with least privilege — read by default, write only on the job that needs it — and a compromised action can do very little. The related trap is <code>pull_request_target</code> on a public repository: it runs with WRITE permissions and access to your secrets in the base branch context, so checking out the pull request\'s code there means executing a stranger\'s code with your credentials. It exists for labelling and commenting on forks, not for building their code.',
            'Bán kính vụ nổ là toàn bộ lập luận: một token phù du, giới hạn trong một kho và chết theo job, so với một chứng chỉ mở ra mọi thứ bạn sở hữu. Kết hợp với nguyên tắc đặc quyền tối thiểu — mặc định chỉ đọc, chỉ mở quyền ghi ở đúng job cần — thì một action bị chiếm cũng làm được rất ít. Cái bẫy đi kèm là <code>pull_request_target</code> trên kho công khai: nó chạy với quyền GHI và có quyền truy cập secret trong ngữ cảnh nhánh gốc, nên checkout mã của pull request ở đó là thực thi mã của người lạ bằng chứng chỉ của bạn. Nó tồn tại để gắn nhãn và bình luận trên các fork, không phải để dựng mã của họ.',
          ),
        }),

        mcq({
          prompt: B(
            'A workflow triggered by <code>on: pull_request</code> runs against which commit?',
            'Một workflow kích hoạt bởi <code>on: pull_request</code> chạy trên commit nào?',
          ),
          options: [
            B('A MERGE PREVIEW — a temporary merge of your branch into the base branch — not the tip of your branch, which is why CI can go red on a change that is green locally', 'Một BẢN XEM TRƯỚC SAU MERGE — một lần hợp nhất tạm thời nhánh của bạn vào nhánh gốc — chứ không phải đầu nhánh của bạn, và vì thế CI có thể đỏ với một thay đổi mà ở máy thì xanh'),
            B('The base branch only; your changes are applied as a patch afterwards inside each individual step', 'Chỉ nhánh gốc; các thay đổi của bạn được áp dưới dạng bản vá sau đó, bên trong từng bước một'),
            B('The tip of your branch exactly as pushed, which is why "require branches to be up to date" exists as a separate branch protection rule', 'Đúng đầu nhánh của bạn như lúc push, và vì thế "bắt buộc nhánh phải cập nhật" tồn tại như một luật bảo vệ nhánh riêng'),
            B('The most recent commit on the base branch that has already passed CI, so that a red base branch never makes your pull request look broken', 'Commit mới nhất trên nhánh gốc đã qua CI, để một nhánh gốc đang đỏ không làm pull request của bạn trông như hỏng'),
          ],
          correct: 0,
          explanation: EX(
            'Testing the merge result is the right thing to test — nobody cares whether your branch works in isolation, they care whether it works once it lands. It also explains a class of confusing failures: the base branch moved, the preview now contains someone else\'s change, and your green branch goes red without you touching anything. Note that this preview is recomputed each time, but it is NOT the same guarantee as "require branches to be up to date": that rule is about the merge actually happening on current main, and it is the second half of the pair that keeps main green.',
            'Kiểm thử kết quả sau khi merge mới là thứ đáng kiểm — không ai quan tâm nhánh của bạn chạy được khi đứng riêng, người ta quan tâm nó có chạy được khi đã nhập vào hay không. Nó cũng giải thích một nhóm lỗi gây bối rối: nhánh gốc đi tiếp, bản xem trước giờ chứa thay đổi của người khác, và nhánh đang xanh của bạn hoá đỏ mà bạn chẳng đụng vào gì. Lưu ý bản xem trước này được tính lại mỗi lần, nhưng nó KHÔNG phải cùng một bảo đảm với "bắt buộc nhánh phải cập nhật": luật đó nói về việc lần merge thật sự diễn ra trên main hiện tại, và nó là nửa còn lại của cặp giữ cho main xanh.',
          ),
        }),

        mcq({
          prompt: B(
            'A nightly job is declared with <code>on: schedule: - cron: "0 7 * * *"</code> and the team expects it at 07:00 Hanoi time. What is wrong?',
            'Một job chạy đêm được khai bằng <code>on: schedule: - cron: "0 7 * * *"</code> và cả nhóm chờ nó chạy lúc 07:00 giờ Hà Nội. Sai ở đâu?',
          ),
          options: [
            B('Cron expressions in Actions have six fields, not five, so this one is rejected at parse time and the workflow simply never registers', 'Biểu thức cron trong Actions có sáu trường chứ không phải năm, nên cái này bị từ chối lúc phân tích và workflow đơn giản là không được đăng ký'),
            B('Scheduled workflows only run on the default branch, so a job defined on any other branch never fires regardless of the expression', 'Workflow theo lịch chỉ chạy trên nhánh mặc định, nên một job định nghĩa trên nhánh khác thì không bao giờ chạy bất kể biểu thức thế nào'),
            B('A scheduled workflow always runs at midnight in the runner\'s local time; the cron expression only controls which DAYS it runs on', 'Workflow theo lịch luôn chạy lúc nửa đêm theo giờ địa phương của runner; biểu thức cron chỉ quyết định nó chạy vào những NGÀY nào'),
            B('The schedule is in UTC, so 07:00 UTC is 14:00 in Hanoi — and on top of that a scheduled run can be delayed under load, so nothing time-critical should depend on it firing on the minute', 'Lịch tính theo giờ UTC, nên 07:00 UTC là 14:00 ở Hà Nội — và trên hết, một lượt chạy theo lịch có thể bị trễ khi hệ thống tải cao, nên đừng để thứ gì gấp về thời gian phụ thuộc vào việc nó chạy đúng phút'),
          ],
          correct: 3,
          explanation: EX(
            'Two separate facts, and the second one bites harder: even with the right offset, a scheduled run is best-effort. Anything that must happen at a specific moment needs its own scheduler; a cron workflow is for maintenance that tolerates drift — a weekly cleanup, a dependency audit, a report. In this repository, <code>vps-cleanup-weekly.yml</code> is exactly that kind of job, and it depends on secrets that must not be deleted, because a silently missing schedule is the hardest kind of failure to notice.',
            'Hai sự thật tách biệt, và cái thứ hai cắn đau hơn: kể cả khi bạn tính đúng múi giờ, một lượt chạy theo lịch chỉ là "cố gắng hết sức". Thứ gì bắt buộc phải xảy ra vào một thời điểm cụ thể thì cần bộ lập lịch riêng; workflow cron dành cho việc bảo trì chịu được xê dịch — một lần dọn dẹp hằng tuần, một lần rà soát thư viện, một báo cáo. Trong chính kho này, <code>vps-cleanup-weekly.yml</code> đúng là loại job đó, và nó phụ thuộc vào những secret không được xoá, vì một cái lịch âm thầm biến mất là kiểu hỏng khó nhận ra nhất.',
          ),
        }),

        // ── Chương 12 — Hook & ký commit ────────────────────────────────
        mcq({
          prompt: B(
            'Which hook does what?' + code(
              'prepare-commit-msg\n' +
              'commit-msg',
            ),
            'Hook nào làm việc gì?' + code(
              'prepare-commit-msg\n' +
              'commit-msg',
            ),
          ),
          options: [
            B('Both validate the message; the first runs on <code>git commit -m</code> and the second only when an editor is opened, which is why a rule must be written twice', 'Cả hai đều xác thực lời nhắn; cái đầu chạy với <code>git commit -m</code> còn cái sau chỉ chạy khi có mở trình soạn thảo, và vì thế một luật phải viết hai lần'),
            B('<code>prepare-commit-msg</code> runs BEFORE the editor and can pre-fill the message (a ticket number from the branch name, a template); <code>commit-msg</code> runs AFTER, receives the message file, and a non-zero exit refuses the commit', '<code>prepare-commit-msg</code> chạy TRƯỚC trình soạn thảo và điền sẵn được lời nhắn (mã ticket lấy từ tên nhánh, một mẫu có sẵn); <code>commit-msg</code> chạy SAU, nhận file lời nhắn, và thoát khác 0 là từ chối commit'),
            B('<code>prepare-commit-msg</code> runs on the server when the commit is pushed; <code>commit-msg</code> is its local counterpart', '<code>prepare-commit-msg</code> chạy trên máy chủ khi commit được push; <code>commit-msg</code> là bản tương ứng ở máy'),
            B('<code>prepare-commit-msg</code> stages files matching a pattern; <code>commit-msg</code> writes the commit object once staging is complete', '<code>prepare-commit-msg</code> staging các file khớp một mẫu; <code>commit-msg</code> ghi đối tượng commit khi việc staging đã xong'),
          ],
          correct: 1,
          explanation: EX(
            'One prepares, one judges. That is why commitlint is wired to <code>commit-msg</code>: it receives the path to the message file as <code>$1</code>, reads it, and exits non-zero to refuse. Measured in the scratch repository with a hand-written <code>commit-msg</code> hook enforcing Conventional Commits: <code>git commit -m "them x"</code> printed the hook\'s error and exited 1 with no commit created, while <code>git commit -m "feat: them x"</code> succeeded. Remember the two reasons a hook silently does nothing: the file still ends in <code>.sample</code>, or it is missing <code>chmod +x</code>.',
            'Một cái chuẩn bị, một cái phán xét. Vì thế commitlint được cắm vào <code>commit-msg</code>: nó nhận đường dẫn tới file lời nhắn qua <code>$1</code>, đọc file đó, và thoát khác 0 để từ chối. Đã đo trong kho nháp với một hook <code>commit-msg</code> tự viết áp Conventional Commits: <code>git commit -m "them x"</code> in ra lỗi của hook và thoát 1, không tạo commit nào, còn <code>git commit -m "feat: them x"</code> thì thành công. Nhớ hai lý do khiến một hook âm thầm không làm gì: file vẫn còn đuôi <code>.sample</code>, hoặc thiếu <code>chmod +x</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A pre-commit hook wants to catch leftover conflict markers and whitespace damage. Which line does the job, and what does it print?' + code(
              '$ git diff --cached --check\n' +
              'y.txt:1: trailing whitespace.\n' +
              '+a = 1 \n' +
              'y.txt:2: leftover conflict marker\n' +
              '$ echo $?\n' +
              '2',
            ),
            'Một hook pre-commit muốn bắt ký hiệu xung đột còn sót và lỗi khoảng trắng. Dòng nào làm được việc đó, và nó in ra gì?' + code(
              '$ git diff --cached --check\n' +
              'y.txt:1: trailing whitespace.\n' +
              '+a = 1 \n' +
              'y.txt:2: leftover conflict marker\n' +
              '$ echo $?\n' +
              '2',
            ),
          ),
          options: [
            B('<code>git grep -n \'&lt;&lt;&lt;&lt;&lt;&lt;&lt;\'</code> is the only reliable check, because <code>--check</code> looks at whitespace and nothing else', '<code>git grep -n \'&lt;&lt;&lt;&lt;&lt;&lt;&lt;\'</code> là phép kiểm đáng tin duy nhất, vì <code>--check</code> chỉ nhìn khoảng trắng chứ không nhìn gì khác'),
            B('<code>git status --porcelain</code>, whose second column marks any file that still contains markers with a <code>U</code>', '<code>git status --porcelain</code>, cột thứ hai của nó đánh dấu <code>U</code> cho mọi file còn chứa ký hiệu'),
            B('<code>git diff --cached --check</code> — a built-in that reports BOTH leftover conflict markers and whitespace errors, with a file and line number, and exits non-zero so a hook can simply return its status', '<code>git diff --cached --check</code> — một lệnh có sẵn báo CẢ ký hiệu xung đột còn sót lẫn lỗi khoảng trắng, kèm tên file và số dòng, và thoát khác 0 để một hook chỉ việc trả về mã thoát của nó'),
            B('<code>git fsck --full</code>, because a conflict marker makes the blob invalid and fsck is what detects invalid objects', '<code>git fsck --full</code>, vì một ký hiệu xung đột làm blob không hợp lệ và fsck là thứ phát hiện đối tượng không hợp lệ'),
          ],
          correct: 2,
          explanation: EX(
            'Copied verbatim from the scratch repository, exit code included. One built-in command instead of a regular expression you will get wrong — and it judges only what is STAGED, which is the right scope for a pre-commit hook. Two design rules for the gate it sits in: keep pre-commit under about two seconds (format and lint the staged files, scan for secrets), and push the slow checks to <code>pre-push</code> (type check, unit tests) and to CI (the matrix, integration, e2e). A hook that grows to ninety seconds gets bypassed permanently.',
            'Chép nguyên văn từ kho nháp, kể cả mã thoát. Một lệnh có sẵn thay cho một biểu thức chính quy mà bạn sẽ viết sai — và nó chỉ phán xét thứ ĐÃ STAGING, đúng phạm vi của một hook pre-commit. Hai nguyên tắc thiết kế cho cái cửa mà nó đứng: giữ pre-commit dưới khoảng hai giây (định dạng và lint file đã staging, quét bí mật), và đẩy các phép kiểm chậm sang <code>pre-push</code> (kiểm kiểu, test đơn vị) và sang CI (ma trận, tích hợp, e2e). Một hook phình lên chín mươi giây sẽ bị bỏ qua vĩnh viễn.',
          ),
        }),

        mcq({
          prompt: B(
            'The course describes three gates with three time budgets. Which check belongs where?',
            'Bài học mô tả ba cửa kiểm với ba ngân sách thời gian. Phép kiểm nào thuộc về cửa nào?',
          ),
          options: [
            B('<code>pre-commit</code> under about 2 seconds — format and lint the STAGED files, scan for secrets. <code>pre-push</code> under about 60 seconds — full type check and unit tests. CI, minutes and not bypassable — the matrix, integration, e2e, security scanning', '<code>pre-commit</code> dưới khoảng 2 giây — định dạng và lint file ĐÃ STAGING, quét bí mật. <code>pre-push</code> dưới khoảng 60 giây — kiểm kiểu đầy đủ và test đơn vị. CI, tính bằng phút và không bỏ qua được — ma trận, tích hợp, e2e, quét bảo mật'),
            B('Everything in <code>pre-commit</code>, because catching a problem earlier is always cheaper, and CI exists only to publish artifacts', 'Mọi thứ dồn vào <code>pre-commit</code>, vì bắt lỗi sớm hơn thì luôn rẻ hơn, còn CI chỉ tồn tại để công bố sản phẩm'),
            B('<code>pre-commit</code> for unit tests, <code>pre-push</code> for formatting, CI for type checking — ordered by how long each one has been part of the toolchain', '<code>pre-commit</code> cho test đơn vị, <code>pre-push</code> cho định dạng, CI cho kiểm kiểu — sắp theo thứ tự cái nào có mặt trong bộ công cụ lâu hơn'),
            B('Nothing in the hooks at all; every check belongs in CI, because a hook can be bypassed and a bypassable check is worse than none', 'Không đặt gì trong hook cả; mọi phép kiểm đều thuộc về CI, vì hook bỏ qua được và một phép kiểm bỏ qua được thì còn tệ hơn không có'),
          ],
          correct: 0,
          explanation: EX(
            'Each gate catches what the one before it could not afford to run. The budgets are the whole design: a hook that takes forty seconds gets <code>--no-verify</code>d until nobody remembers it exists. Note the last option is not quite wrong about enforcement — a hook IS a convenience and never a control — but it throws away the value: hooks make the right thing fast, CI makes it mandatory. The lint-staged half matters too: running a linter over the STAGED files (and re-staging what it fixes) is what keeps the hook fast and keeps the commit matching what you saw.',
            'Mỗi cửa bắt đúng thứ mà cửa trước không kham nổi về thời gian. Các ngân sách chính là toàn bộ thiết kế: một hook tốn bốn mươi giây sẽ bị <code>--no-verify</code> cho tới khi chẳng ai nhớ nó tồn tại. Để ý phương án cuối không hẳn sai về chuyện cưỡng chế — hook ĐÚNG là một tiện lợi và không bao giờ là biện pháp kiểm soát — nhưng nó vứt đi phần giá trị: hook làm cho việc đúng trở nên nhanh, CI làm cho nó trở thành bắt buộc. Nửa lint-staged cũng quan trọng: chạy linter trên các file ĐÃ STAGING (và staging lại phần nó vừa sửa) là thứ giữ cho hook nhanh và giữ cho commit khớp với thứ bạn nhìn thấy.',
          ),
        }),

        mcq({
          prompt: B(
            'A pre-commit hook runs the formatter over the WHOLE project instead of just the staged files. Besides being slow, what goes wrong?',
            'Một hook pre-commit chạy formatter trên TOÀN DỰ ÁN thay vì chỉ các file đã staging. Ngoài chuyện chậm, còn hỏng gì?',
          ),
          options: [
            B('Git refuses the commit, because a hook is not allowed to modify files outside the staged set', 'Git từ chối commit, vì một hook không được phép sửa file nằm ngoài tập đã staging'),
            B('The formatter runs against the working directory instead of the index, so the commit records unformatted content and CI fails on style', 'Formatter chạy trên thư mục làm việc thay vì index, nên commit ghi lại nội dung chưa định dạng và CI hỏng ở phần kiểu cách'),
            B('The reformatted files are added to the commit automatically, so a single-line change lands as a 400-line diff that hides the real change from the reviewer', 'Các file được định dạng lại bị tự động thêm vào commit, nên một thay đổi một dòng đáp xuống dưới dạng diff 400 dòng và giấu mất thay đổi thật khỏi mắt người review'),
            B('It touches files you did not stage, and those reformatted-but-unstaged changes SILENTLY do not reach the commit — so the diff on GitHub differs from what you saw locally', 'Nó đụng vào những file bạn không staging, và các thay đổi được định dạng lại mà chưa staging đó ÂM THẦM không lọt vào commit — nên bản diff trên GitHub khác thứ bạn nhìn thấy ở máy'),
          ],
          correct: 3,
          explanation: EX(
            'The commit records the INDEX, not the working directory, so anything the hook touched outside the staged set is left behind as an uncommitted change — and you are looking at a formatted file locally while the reviewer is looking at an unformatted one. That is the failure mode that makes people distrust hooks. <code>lint-staged</code> exists precisely for this: it runs the tools on the staged paths only, and re-stages whatever they fixed, so the hook stays fast AND the commit matches what you saw.',
            'Commit ghi lại INDEX chứ không phải thư mục làm việc, nên mọi thứ hook đụng tới ngoài tập đã staging đều bị bỏ lại dưới dạng thay đổi chưa commit — và bạn đang nhìn một file đã định dạng ở máy trong khi người review nhìn một file chưa định dạng. Đó chính là kiểu hỏng làm người ta mất lòng tin vào hook. <code>lint-staged</code> tồn tại đúng cho chuyện này: nó chỉ chạy công cụ trên các đường dẫn đã staging, và staging lại phần chúng vừa sửa, nên hook vừa nhanh VỪA cho ra commit khớp với thứ bạn nhìn thấy.',
          ),
        }),

        mcq({
          prompt: B(
            'A script checks whether commits are signed. Measured on git 2.51.1 against an UNSIGNED commit:' + code(
              "$ git log --format='%h %G? %s' -1\n" +
              '2754f8e N C2\n' +
              '\n' +
              '$ git verify-commit HEAD\n' +
              '$ echo $?\n' +
              '1',
            ) + 'What is the trap for the script author?',
            'Một script kiểm xem commit có được ký không. Đo trên git 2.51.1 với một commit CHƯA KÝ:' + code(
              "$ git log --format='%h %G? %s' -1\n" +
              '2754f8e N C2\n' +
              '\n' +
              '$ git verify-commit HEAD\n' +
              '$ echo $?\n' +
              '1',
            ) + 'Cái bẫy cho người viết script là gì?',
          ),
          options: [
            B('<code>%G?</code> is unreliable and returns <code>N</code> even for good signatures, so only <code>git verify-commit</code> should be used', '<code>%G?</code> không đáng tin và trả <code>N</code> ngay cả với chữ ký tốt, nên chỉ được dùng <code>git verify-commit</code>'),
            B('<code>git verify-commit</code> printed NOTHING at all and only signalled failure through exit code 1 — a script that reads stdout sees empty output and reads it as success; <code>N</code> in <code>%G?</code> means "no signature", which is normal, not an error', '<code>git verify-commit</code> KHÔNG in ra gì cả và chỉ báo hỏng qua mã thoát 1 — một script đọc stdout sẽ thấy output rỗng và hiểu đó là thành công; còn <code>N</code> trong <code>%G?</code> nghĩa là "không có chữ ký", đó là bình thường chứ không phải lỗi'),
            B('The commit is signed but the key is untrusted; that state is what <code>N</code> encodes, and the correct code for an unsigned commit is <code>U</code>', 'Commit đó có ký nhưng khoá không được tin cậy; trạng thái đó chính là ý nghĩa của <code>N</code>, còn mã đúng cho một commit chưa ký là <code>U</code>'),
            B('Exit code 1 means the repository has no <code>allowedSignersFile</code> configured; with one configured the same command exits 0 even for unsigned commits', 'Mã thoát 1 nghĩa là kho chưa cấu hình <code>allowedSignersFile</code>; cấu hình rồi thì đúng lệnh đó thoát 0 kể cả với commit chưa ký'),
          ],
          correct: 1,
          explanation: EX(
            'Both lines were measured. The <code>%G?</code> codes are <code>G</code> good signature from an allowed signer, <code>U</code> good signature from an untrusted key, <code>B</code>/<code>X</code>/<code>Y</code> bad, expired signature, expired key, and <code>N</code> no signature at all — normal for the vast majority of commits in the vast majority of repositories. It is not a fault; it is an absence of evidence. And the general lesson is bigger than signing: silence is not success. Check the exit code, and check your checker before you trust it.',
            'Cả hai dòng đều đã đo. Bảng mã <code>%G?</code>: <code>G</code> chữ ký tốt từ một người ký được cho phép, <code>U</code> chữ ký tốt nhưng khoá chưa được tin cậy, <code>B</code>/<code>X</code>/<code>Y</code> chữ ký sai, chữ ký hết hạn, khoá hết hạn, và <code>N</code> hoàn toàn không có chữ ký — chuyện bình thường với đại đa số commit ở đại đa số kho mã. Đó không phải lỗi, đó là sự vắng mặt của bằng chứng. Và bài học chung còn lớn hơn chuyện ký: im lặng không phải là thành công. Hãy xét mã thoát, và hãy kiểm bộ kiểm trước khi tin nó.',
          ),
        }),

        mcq({
          prompt: B(
            'You can sign both commits and tags. Why does the course say signing a TAG is the more valuable of the two?',
            'Bạn có thể ký cả commit lẫn tag. Vì sao bài học nói ký TAG là cái có giá trị hơn trong hai thứ?',
          ),
          options: [
            B('Because a commit signature is destroyed by any rebase, while a tag signature survives every history rewrite by design', 'Vì chữ ký của commit bị phá bởi bất kỳ lần rebase nào, còn chữ ký của tag thì theo thiết kế sống sót qua mọi lần viết lại lịch sử'),
            B('Because GitHub only shows the Verified badge on tags; commit signatures are verified locally and never appear in the interface', 'Vì GitHub chỉ hiện huy hiệu Verified trên tag; chữ ký commit chỉ được xác minh ở máy và không bao giờ hiện lên giao diện'),
            B('Because a tag is what pipelines consume and what users download — proving that <code>v1.5.0</code> really is the build YOU cut is worth more than proving authorship of one commit out of five hundred', 'Vì tag là thứ mà pipeline tiêu thụ và người dùng tải về — chứng minh <code>v1.5.0</code> đúng là bản mà CHÍNH BẠN cắt ra đáng giá hơn chứng minh quyền tác giả của một commit trong năm trăm cái'),
            B('Because signing every commit doubles the size of the object database, while a repository has only a handful of tags', 'Vì ký mọi commit làm kho đối tượng phình gấp đôi, trong khi một kho chỉ có dăm ba cái tag'),
          ],
          correct: 2,
          explanation: EX(
            'Signatures answer "who produced this?", and the artefact where that question has real money attached is the release. <code>git tag -s v1.5.0</code> plus <code>git verify-tag v1.5.0</code> is the whole workflow. Two things signing does not fix: a stolen key signs perfectly well, and any rewrite destroys a signature — including GitHub\'s own squash-merge, which re-signs the resulting commit with GITHUB\'S key, so the badge stays but your authorship signature does not survive. And be careful turning on "require signed commits" for a whole branch: outside contributors without a signing key simply cannot contribute, and GitHub\'s rejection does not explain why.',
            'Chữ ký trả lời câu "ai đã tạo ra thứ này?", và cái sản phẩm mà câu hỏi đó gắn với tiền thật chính là bản phát hành. <code>git tag -s v1.5.0</code> cộng <code>git verify-tag v1.5.0</code> là toàn bộ quy trình. Hai thứ việc ký không giải quyết được: một khoá bị đánh cắp vẫn ký ngon lành, và mọi lần viết lại đều phá chữ ký — kể cả chính nút squash-merge của GitHub, thứ ký lại commit kết quả bằng khoá CỦA GITHUB, nên huy hiệu vẫn còn mà chữ ký tác giả của bạn thì không sống sót. Và hãy cẩn thận khi bật "bắt buộc commit có chữ ký" cho cả một nhánh: người đóng góp bên ngoài không có khoá ký thì đơn giản là không đóng góp được, và lời từ chối của GitHub không giải thích nguyên nhân.',
          ),
        }),

        mcq({
          prompt: B(
            'You added your SSH public key to GitHub and turned on <code>commit.gpgsign</code> with <code>gpg.format ssh</code>. Locally <code>git log --show-signature</code> reports a good signature, but GitHub shows <b>Unverified</b>. What is the most likely cause?',
            'Bạn đã thêm khoá SSH công khai lên GitHub và bật <code>commit.gpgsign</code> với <code>gpg.format ssh</code>. Ở máy, <code>git log --show-signature</code> báo chữ ký tốt, nhưng GitHub hiện <b>Unverified</b>. Nguyên nhân khả dĩ nhất?',
          ),
          options: [
            B('The same public key must be registered a SECOND time on GitHub as a <b>Signing Key</b> — the Authentication and Signing roles are separate, which is why the badge says Unverified rather than showing nothing at all', 'Đúng cái khoá công khai đó phải được đăng ký LẦN THỨ HAI trên GitHub với vai trò <b>Signing Key</b> — hai vai trò Authentication và Signing là tách biệt, và vì thế huy hiệu ghi Unverified chứ không phải là không hiện gì'),
            B('SSH signing is local-only; GitHub verifies GPG signatures exclusively, so the fix is to generate a GPG key and re-sign', 'Ký bằng SSH chỉ có tác dụng ở máy; GitHub chỉ xác minh chữ ký GPG, nên cách sửa là tạo một khoá GPG và ký lại'),
            B('The commit author email does not need to match anything; the badge appears only after the commit reaches the default branch', 'Email tác giả của commit không cần khớp với gì cả; huy hiệu chỉ xuất hiện sau khi commit tới được nhánh mặc định'),
            B('You are missing <code>gpg.ssh.allowedSignersFile</code>; GitHub reads that file from the repository to decide which keys it trusts', 'Bạn thiếu <code>gpg.ssh.allowedSignersFile</code>; GitHub đọc file đó từ trong kho để quyết định nó tin những khoá nào'),
          ],
          correct: 0,
          explanation: EX(
            'The badge wording is the clue: <b>Unverified</b> means "there IS a signature and I cannot match the key", whereas an unsigned commit shows no badge at all. GitHub keeps the two key roles apart, so the same <code>id_ed25519.pub</code> has to be added twice. <code>allowedSignersFile</code> is a separate, LOCAL mechanism — it is what makes <code>%G?</code> report <code>G</code> instead of <code>U</code> on your own machine, and GitHub never reads it. Also note what a Verified badge actually proves: that the content was produced by the holder of a key registered to an account with a verified email matching the author. It is a signal about identity, not about quality — not that the code is good, and not that anyone reviewed it.',
            'Chữ trên huy hiệu chính là manh mối: <b>Unverified</b> nghĩa là "CÓ chữ ký mà tôi không khớp được cái khoá", trong khi một commit chưa ký thì không hiện huy hiệu nào. GitHub giữ hai vai trò của khoá tách biệt nhau, nên đúng cái <code>id_ed25519.pub</code> đó phải được thêm hai lần. <code>allowedSignersFile</code> là một cơ chế riêng và CỤC BỘ — nó là thứ làm <code>%G?</code> báo <code>G</code> thay vì <code>U</code> trên máy bạn, và GitHub không bao giờ đọc tới nó. Cũng nên nhớ huy hiệu Verified thật sự chứng minh điều gì: rằng nội dung commit do người giữ một khoá được đăng ký với tài khoản có email đã xác minh khớp tác giả tạo ra. Đó là tín hiệu về danh tính, không phải về chất lượng — không nói mã tốt, cũng không nói đã có ai review.',
          ),
        }),

        // ── Chương 13 — Cứu hộ ──────────────────────────────────────────
        mcq({
          prompt: B(
            'A merge finished and the result is wrong. You are no longer mid-merge, so <code>git merge --abort</code> does nothing. What is the fastest correct move?',
            'Một lần merge đã xong và kết quả thì sai. Bạn không còn đang giữa chừng nên <code>git merge --abort</code> không làm gì. Nước đi đúng và nhanh nhất là gì?',
          ),
          options: [
            B('<code>git revert -m 1 &lt;merge&gt;</code>, because a completed merge can only ever be undone by adding an inverse commit', '<code>git revert -m 1 &lt;merge&gt;</code>, vì một lần merge đã hoàn tất chỉ có thể hoàn tác bằng cách thêm một commit nghịch đảo'),
            B('Delete the branch and re-clone; a merge writes into the index and the object database at the same time, so nothing local can be trusted afterwards', 'Xoá nhánh rồi clone lại; một lần merge ghi vào index và kho đối tượng cùng lúc nên sau đó không tin được thứ gì ở cục bộ'),
            B('<code>git reset --hard HEAD~1</code>, which is always safe because a merge commit has no content of its own', '<code>git reset --hard HEAD~1</code>, lúc nào cũng an toàn vì một commit hợp nhất không có nội dung của riêng nó'),
            B('<code>git reset --hard ORIG_HEAD</code> — Git saved where you were standing before the last dangerous operation; if that is gone, find the line just before <code>merge</code> or <code>rebase (start)</code> in <code>git reflog</code>', '<code>git reset --hard ORIG_HEAD</code> — Git đã lưu chỗ bạn đứng trước thao tác nguy hiểm gần nhất; nếu nó không còn thì tìm dòng ngay trước <code>merge</code> hay <code>rebase (start)</code> trong <code>git reflog</code>'),
          ],
          correct: 3,
          explanation: EX(
            '<code>ORIG_HEAD</code> is a plain file under <code>.git/</code> holding the commit HEAD pointed at before the last operation that moved it a long way — merge, rebase, reset, pull. It is the one-command undo for "that merge went wrong", and it works after the operation has finished, which <code>--abort</code> does not. Two caveats: it holds only the MOST RECENT such position, so a second dangerous command overwrites it (the reflog still has both), and it is the right answer only on a branch you have not shared — on a shared branch the correct undo of a merge is <code>git revert -m 1</code>, with the long tail that requires reverting the revert before you merge again.',
            '<code>ORIG_HEAD</code> là một file thường dưới <code>.git/</code> giữ commit mà HEAD trỏ vào trước thao tác gần nhất dời nó đi xa — merge, rebase, reset, pull. Nó là nút hoàn tác một-lệnh cho tình huống "lần merge đó hỏng rồi", và nó chạy được sau khi thao tác đã kết thúc, điều mà <code>--abort</code> không làm được. Hai lưu ý: nó chỉ giữ vị trí GẦN NHẤT loại đó, nên một lệnh nguy hiểm thứ hai sẽ ghi đè (reflog thì vẫn còn cả hai), và nó chỉ là câu trả lời đúng trên nhánh bạn chưa chia sẻ — trên nhánh dùng chung thì cách hoàn tác đúng của một merge là <code>git revert -m 1</code>, kèm cái đuôi dài buộc bạn phải revert chính cái revert trước khi merge lại.',
          ),
        }),

        mcq({
          prompt: B(
            'You made one commit on <code>main</code> that belonged on a feature branch. Nothing has been pushed. Which sequence fixes it?',
            'Bạn đã tạo một commit trên <code>main</code> mà lẽ ra phải nằm trên một nhánh tính năng. Chưa push gì cả. Chuỗi lệnh nào sửa được?',
          ),
          options: [
            B('<code>git revert HEAD</code> on main, then re-apply the change by hand on the feature branch — the only approach that never rewrites anything', '<code>git revert HEAD</code> trên main, rồi tự tay áp lại thay đổi đó trên nhánh tính năng — cách duy nhất không viết lại gì cả'),
            B('<code>git switch -c feature/right-branch</code> (the commit comes with you, because the new branch is created where you are standing), then <code>git switch main</code> and <code>git reset --hard HEAD~1</code> to take it back off main', '<code>git switch -c feature/right-branch</code> (commit đó đi theo bạn, vì nhánh mới được tạo ngay tại chỗ bạn đang đứng), rồi <code>git switch main</code> và <code>git reset --hard HEAD~1</code> để gỡ nó khỏi main'),
            B('<code>git stash</code>, switch branches, <code>git stash pop</code> — a commit is just a stashed change that has been given a name', '<code>git stash</code>, chuyển nhánh, <code>git stash pop</code> — một commit chỉ là một thay đổi đã cất đi và được đặt tên'),
            B('<code>git branch -m feature/right-branch</code>, which renames the current branch and leaves main untouched at its previous position', '<code>git branch -m feature/right-branch</code>, lệnh này đổi tên nhánh hiện tại và để yên main ở vị trí cũ'),
          ],
          correct: 1,
          explanation: EX(
            'A branch is a pointer, so creating one where you already are costs nothing and captures the commit automatically. Then main goes back one step. For several commits, or if you already switched away, <code>git cherry-pick</code> them onto the right branch and reset main by that many. Note why option D is wrong in a specific way: renaming the current branch takes MAIN with it — you would end up with no <code>main</code> at all and a feature branch holding everything.',
            'Một nhánh là một con trỏ, nên tạo nó ngay tại chỗ bạn đang đứng chẳng tốn gì mà lại bắt được cái commit đó luôn. Rồi main lùi lại một bước. Với nhiều commit, hoặc khi bạn đã chuyển đi rồi, thì <code>git cherry-pick</code> chúng sang đúng nhánh và reset main lùi đúng bấy nhiêu bậc. Để ý phương án D sai theo một kiểu rất cụ thể: đổi tên nhánh hiện tại là mang luôn cả MAIN đi — bạn sẽ chẳng còn cái <code>main</code> nào và một nhánh tính năng ôm hết mọi thứ.',
          ),
        }),

        mcq({
          prompt: B(
            'A merge stops with this. What does the course say it usually means, and what should you NOT do?' + code(
              'fatal: refusing to merge unrelated histories',
            ),
            'Một lần merge dừng lại với thông báo này. Bài học nói nó thường có nghĩa gì, và bạn KHÔNG nên làm gì?' + code(
              'fatal: refusing to merge unrelated histories',
            ),
          ),
          options: [
            B('It means the two branches have diverged too far to merge; the fix is <code>git rebase</code> instead, and using <code>--allow-unrelated-histories</code> would produce duplicate commits', 'Nó nghĩa là hai nhánh đã phân ly quá xa để merge được; cách sửa là dùng <code>git rebase</code>, còn <code>--allow-unrelated-histories</code> sẽ sinh ra commit trùng lặp'),
            B('It means one side is a shallow clone; unshallow it with <code>git fetch --unshallow</code>, and <code>--allow-unrelated-histories</code> would merge only the commits present locally', 'Nó nghĩa là một bên là bản clone nông; hãy gỡ nông bằng <code>git fetch --unshallow</code>, còn <code>--allow-unrelated-histories</code> chỉ merge những commit có sẵn ở máy'),
            B('It means the two sides have DIFFERENT ROOT COMMITS — usually because you cloned into a directory that already had a repository, or ran <code>git init</code> twice. Compare <code>git log --oneline | tail -3</code> on both sides and fix the real mistake; <code>--allow-unrelated-histories</code> only buries it', 'Nó nghĩa là hai bên có COMMIT GỐC KHÁC NHAU — thường vì bạn clone vào một thư mục vốn đã có kho, hoặc chạy <code>git init</code> hai lần. Hãy so <code>git log --oneline | tail -3</code> ở cả hai phía và sửa cái sai lầm thật; <code>--allow-unrelated-histories</code> chỉ chôn vùi nó đi'),
            B('It means the remote rejected the merge under a branch protection rule requiring linear history; ask an administrator to allow merge commits', 'Nó nghĩa là remote từ chối lần merge vì một luật bảo vệ nhánh đòi lịch sử tuyến tính; hãy nhờ quản trị viên cho phép commit hợp nhất'),
          ],
          correct: 2,
          explanation: EX(
            'Git is telling you something true and useful: these two histories have nothing in common, not even a first commit, so there is no merge base and a three-way merge is impossible. Ninety per cent of the time that is a mistake in how the repository was set up, and forcing the flag glues two unrelated trees together permanently. Check the roots first. The pattern generalises to the whole recovery chapter: name the situation before you run anything, because stacking guesses on top of a bad state is what turns a small problem into an unreadable one.',
            'Git đang nói cho bạn một điều đúng và có ích: hai lịch sử này không có gì chung, đến cả commit đầu tiên cũng không, nên không có merge base và hợp nhất ba chiều là bất khả. Chín mươi phần trăm trường hợp đó là một sai lầm ở khâu dựng kho, và ép cái cờ kia là dán vĩnh viễn hai cái cây chẳng liên quan vào nhau. Hãy kiểm gốc trước. Khuôn mẫu này áp cho cả chương cứu hộ: gọi tên tình huống trước khi chạy bất cứ thứ gì, vì chồng những phỏng đoán lên trên một trạng thái tồi chính là cách biến một vấn đề nhỏ thành một vấn đề không đọc nổi.',
          ),
        }),

        mcq({
          prompt: B(
            'A colleague force-pushed over your three commits and your local clone no longer has them either. What does the course suggest before giving up?' + code(
              'gh api repos/OWNER/REPO/events \\\n' +
              '  --jq \'.[] | select(.type=="PushEvent") | {before: .payload.before, ref: .payload.ref}\'',
            ),
            'Một đồng nghiệp force-push đè lên ba commit của bạn và bản clone ở máy bạn cũng không còn giữ chúng. Bài học gợi ý làm gì trước khi bỏ cuộc?' + code(
              'gh api repos/OWNER/REPO/events \\\n' +
              '  --jq \'.[] | select(.type=="PushEvent") | {before: .payload.before, ref: .payload.ref}\'',
            ),
          ),
          options: [
            B('The <code>before</code> field of a PushEvent is the commit the branch pointed at BEFORE that push, and you can still <code>git fetch origin &lt;sha&gt;</code> it — worth knowing BEFORE you need it, because the events window is not infinite', 'Trường <code>before</code> của một PushEvent là commit mà nhánh trỏ vào TRƯỚC lần push đó, và bạn vẫn <code>git fetch origin &lt;sha&gt;</code> nó về được — đáng biết TRƯỚC khi cần tới, vì cửa sổ sự kiện không phải vô hạn'),
            B('GitHub keeps a server-side reflog that you can read with <code>git reflog origin/main</code> after a fetch, which lists every position the remote branch has held', 'GitHub giữ một reflog phía máy chủ mà bạn đọc được bằng <code>git reflog origin/main</code> sau khi fetch, nó liệt kê mọi vị trí nhánh trên remote từng đứng'),
            B('Ask GitHub Support to restore the branch; the events API is only a notification feed and contains no commit identifiers at all', 'Nhờ GitHub Support khôi phục nhánh; API sự kiện chỉ là một luồng thông báo và hoàn toàn không chứa mã định danh commit nào'),
            B('Nothing helps once the local clone has lost them — a force-push deletes the objects on the server immediately, which is what makes it destructive', 'Không gì cứu được một khi bản clone ở máy đã mất chúng — force-push xoá các đối tượng trên máy chủ ngay lập tức, và đó là điều làm nó có tính phá huỷ'),
          ],
          correct: 0,
          explanation: EX(
            'The overwritten commits are not deleted straight away; they simply stop being reachable, and nobody can find them without knowing a hash. The events feed is where that hash still exists for a while. Try the reflog first — if your clone still has the commits, <code>git switch -c rescue &lt;hash&gt;</code>, rebase onto the new upstream and push to a new branch name. And the reason this is a story at all is that <code>--force-with-lease</code> was skipped or defeated; the refusal it would have given you IS the information.',
            'Các commit bị đè lên không bị xoá ngay; chúng chỉ thôi với tới được, và không ai tìm ra chúng nếu không biết mã băm. Luồng sự kiện là nơi cái mã băm đó còn tồn tại một thời gian. Hãy thử reflog trước — nếu bản clone của bạn vẫn còn các commit thì <code>git switch -c rescue &lt;mã băm&gt;</code>, rebase lên lịch sử mới rồi push sang một tên nhánh khác. Và lý do chuyện này thành ra một câu chuyện là vì <code>--force-with-lease</code> đã bị bỏ qua hoặc bị vô hiệu; lời từ chối mà nó lẽ ra đưa cho bạn CHÍNH LÀ thông tin.',
          ),
        }),

        mcq({
          prompt: B(
            'A repository "looks broken" and you are about to delete it. Which four commands does the course tell you to run first, and what chain are they walking?' + code(
              'git fsck --full\n' +
              'cat .git/HEAD\n' +
              'git rev-parse main\n' +
              'git cat-file -t $(git rev-parse HEAD)',
            ),
            'Một kho "trông như bị hỏng" và bạn sắp xoá nó đi. Bài học bảo chạy bốn lệnh nào trước, và chúng đang đi theo sợi dây nào?' + code(
              'git fsck --full\n' +
              'cat .git/HEAD\n' +
              'git rev-parse main\n' +
              'git cat-file -t $(git rev-parse HEAD)',
            ),
          ),
          options: [
            B('They rebuild the index, the refs, the packfiles and the reflog in that order, which is Git\'s documented repair sequence', 'Chúng dựng lại index, các ref, packfile và reflog theo đúng thứ tự đó, đây là trình tự sửa chữa được ghi trong tài liệu của Git'),
            B('They compare your clone against the remote and report which objects are missing so that a targeted <code>git fetch</code> can replace them', 'Chúng so bản clone của bạn với remote và báo những đối tượng nào bị thiếu để một lệnh <code>git fetch</code> có chủ đích thay thế chúng'),
            B('They test the disk, the file permissions, the Git version and the configuration — the four things that make a repository unreadable', 'Chúng kiểm đĩa, quyền file, phiên bản Git và cấu hình — bốn thứ làm cho một kho không đọc được'),
            B('They walk the chain <b>HEAD → ref → hash → object</b> one link at a time, so you find out WHICH link is broken instead of guessing; the last resort is a fresh clone plus <code>git fsck --lost-found</code> against the old <code>.git</code>', 'Chúng đi theo sợi dây <b>HEAD → ref → mã băm → đối tượng</b> từng mắt một, để bạn biết mắt NÀO đứt thay vì đoán mò; phương án cuối cùng là clone mới cộng <code>git fsck --lost-found</code> chạy trên cái <code>.git</code> cũ'),
          ],
          correct: 3,
          explanation: EX(
            'Almost everything that "looks broken" is one link in that chain: HEAD naming a ref that does not exist, a ref that does not resolve, a hash with no object behind it. Checking them in order turns a vague panic into a specific fact. And before any of it, the two commands that are always safe and always worth running: <code>git status</code> to see what is uncommitted, and <code>git reflog -15</code> to see where HEAD has been. Protect the working tree with <code>git stash -u</code> first — one second, and the destructive command becomes reversible, because the only work Git genuinely cannot recover is work that was never committed.',
            'Gần như mọi thứ "trông như hỏng" đều là một mắt trong sợi dây đó: HEAD gọi tên một ref không tồn tại, một ref không phân giải được, một mã băm không có đối tượng nào phía sau. Kiểm theo đúng thứ tự là biến một cơn hoảng mơ hồ thành một sự thật cụ thể. Và trước tất cả những thứ đó là hai lệnh lúc nào cũng an toàn và lúc nào cũng đáng chạy: <code>git status</code> xem có gì chưa commit, và <code>git reflog -15</code> xem HEAD đã đi qua những đâu. Hãy bảo vệ cây làm việc bằng <code>git stash -u</code> trước — một giây, và cái lệnh phá huỷ trở thành đảo ngược được, vì thứ duy nhất Git thật sự không cứu được là phần việc chưa bao giờ được commit.',
          ),
        }),

        mcq({
          prompt: B(
            'The panic checklist has five steps. What is step one, and why is it first?',
            'Danh sách kiểm lúc hoảng có năm bước. Bước một là gì, và vì sao nó đứng đầu?',
          ),
          options: [
            B('Push everything to a backup remote, so that whatever happens next exists in two places before you touch anything', 'Push mọi thứ lên một remote sao lưu, để dù chuyện gì xảy ra tiếp theo thì nó cũng tồn tại ở hai nơi trước khi bạn đụng vào bất cứ thứ gì'),
            B('STOP TYPING — every extra command makes the state harder to read and adds another line to the reflog, and nothing is on fire enough that one minute makes it worse', 'NGỪNG GÕ — mỗi lệnh thêm vào làm trạng thái khó đọc hơn và thêm một dòng vào reflog, và không có gì đang cháy tới mức một phút làm nó tệ hơn'),
            B('Run <code>git gc --prune=now</code> to remove the corrupted objects before they spread further through the object database', 'Chạy <code>git gc --prune=now</code> để gỡ các đối tượng hỏng trước khi chúng lan rộng trong kho đối tượng'),
            B('Delete the local clone immediately; the remote is the source of truth and re-cloning is always faster than diagnosing', 'Xoá ngay bản clone ở máy; remote mới là nguồn sự thật và clone lại lúc nào cũng nhanh hơn chẩn đoán'),
          ],
          correct: 1,
          explanation: EX(
            'The five steps are: stop typing · protect the working tree (<code>git stash -u</code>, or copy the directory) · look (<code>git status</code>, <code>git reflog -15</code>, <code>git log --oneline --graph --all -20</code>) · NAME the situation, matching it to one of the ten recipes, before running anything · then fix, and verify by looking again. Step one exists because the classic way a small problem becomes an unrecoverable one is a reset, then a merge, then a rebase, each based on a guess. Option C is actively dangerous: <code>--prune=now</code> removes the safety net you are about to need.',
            'Năm bước là: ngừng gõ · bảo vệ cây làm việc (<code>git stash -u</code>, hoặc chép cả thư mục ra) · nhìn (<code>git status</code>, <code>git reflog -15</code>, <code>git log --oneline --graph --all -20</code>) · GỌI TÊN tình huống, khớp nó với một trong mười công thức, TRƯỚC khi chạy bất cứ thứ gì · rồi sửa, và kiểm chứng bằng cách nhìn lại. Bước một tồn tại vì cách kinh điển để một vấn đề nhỏ hoá thành không cứu nổi là reset, rồi merge, rồi rebase, mỗi cái dựa trên một phỏng đoán. Phương án C thì nguy hiểm thật sự: <code>--prune=now</code> gỡ đúng cái lưới an toàn mà bạn sắp cần tới.',
          ),
        }),

        mcq({
          prompt: B(
            'Two AI agent sessions are working in the same repository at the same time. Which pair of rules does the course give?',
            'Hai phiên agent AI đang làm việc trong cùng một kho, cùng lúc. Bài học đưa ra cặp luật nào?',
          ),
          options: [
            B('Let each agent commit freely but never push; a human then reviews the combined working tree once at the end of the day', 'Cho mỗi agent commit thoải mái nhưng không được push; cuối ngày một người sẽ review toàn bộ cây làm việc gộp lại một lần'),
            B('Give each agent its own clone of the repository, and merge their branches with <code>--allow-unrelated-histories</code> afterwards', 'Cho mỗi agent một bản clone riêng của kho, rồi sau đó merge các nhánh của chúng bằng <code>--allow-unrelated-histories</code>'),
            B('Never <code>git add -A</code> while another session is running — name the exact paths, because <code>-A</code> sweeps up whatever the other session is half-writing; and give each agent its own WORKTREE, so the two have separate indexes and separate HEADs while sharing objects', 'Đừng bao giờ <code>git add -A</code> khi có phiên khác đang chạy — hãy gọi tên đúng đường dẫn, vì <code>-A</code> vơ luôn thứ mà phiên kia đang viết dở; và cho mỗi agent một WORKTREE riêng, để hai bên có index riêng, HEAD riêng mà vẫn dùng chung kho đối tượng'),
            B('Run both agents on the same branch but with <code>core.fileMode false</code>, which is what prevents them from overwriting each other\'s staged changes', 'Chạy cả hai agent trên cùng một nhánh nhưng đặt <code>core.fileMode false</code>, đó là thứ ngăn chúng ghi đè lên phần staging của nhau'),
          ],
          correct: 2,
          explanation: EX(
            'Both rules exist because of measured incidents in this very repository. The third rule in the set is "one build or dev server at a time" — two processes writing into one build cache corrupt it in a way that looks exactly like a code bug for an hour. And the fourth: never deploy without asking, because a deploy script that rsyncs the working tree will ship another session\'s half-written file to production; <code>deploy.sh</code> did exactly that three times. Review an agent\'s diff the way you would review a colleague\'s — read it, do not skim. An agent produces plausible-sounding code quickly, which means a wrong assumption arrives as forty confident lines instead of as a question.',
            'Cả hai luật đều tồn tại vì những sự cố đã đo được trong chính kho này. Luật thứ ba trong bộ là "mỗi lúc chỉ MỘT bản dựng hoặc dev server" — hai tiến trình cùng ghi vào một cache build làm hỏng nó theo kiểu trông y hệt một lỗi mã suốt cả một giờ đồng hồ. Và luật thứ tư: đừng bao giờ deploy khi chưa hỏi, vì một script deploy rsync cả cây làm việc sẽ đẩy file viết dở của phiên khác lên production; <code>deploy.sh</code> đã làm đúng chuyện đó ba lần. Hãy review diff của agent như review của đồng nghiệp — đọc, đừng lướt. Một agent viết ra mã nghe hợp lý rất nhanh, nghĩa là một giả định sai tới tay bạn dưới dạng bốn mươi dòng đầy tự tin thay vì dưới dạng một câu hỏi.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Resolve conflict blocks by rule (chapters 3 and 13).</b> During a recovery you have dozens of files left in a conflicted state and a policy for how each one should be settled. Write the resolver.</p>' +
            '<p>Implement <code>resolve(text, strategy)</code>. A conflict block is git\'s default (non-diff3) shape: a line starting with ' + code('<<<<<<<') + ' opens it, a line that is exactly ' + code('=======') + ' separates the two sides, and a line starting with ' + code('>>>>>>>') + ' closes it. Everything outside a block is copied through unchanged.</p>' +
            '<p><code>strategy</code> is <code>&quot;ours&quot;</code> (keep the lines above the separator), <code>&quot;theirs&quot;</code> (keep the lines below it) or <code>&quot;union&quot;</code> (keep both, ours first). A side may be empty, and a file may contain several blocks.</p>' +
            '<p>On success return <code>{ text, conflicts }</code> — the resolved text and how many blocks were settled. On malformed input return <code>{ error }</code> instead, using these exact messages (line numbers are 1-based):</p>' +
            '<ul>' +
            '<li>a block that is never closed → <code>unterminated conflict opened on line N</code> (N is the line of its opening marker)</li>' +
            '<li>a separator outside any block → <code>separator outside a conflict on line N</code></li>' +
            '<li>a closing marker outside any block → <code>unexpected end marker on line N</code></li>' +
            '<li>an opening marker inside a block → <code>nested conflict on line N</code></li>' +
            '</ul>' +
            '<p>Do not use any library. Keep the given data and the printing loop exactly as they are.</p>',

            '<p><b>Câu 31 — Giải các khối xung đột theo luật (chương 3 và 13).</b> Trong một đợt cứu hộ, bạn có hàng chục file còn nằm ở trạng thái xung đột và một chính sách cho biết mỗi file nên giải theo hướng nào. Hãy viết bộ giải đó.</p>' +
            '<p>Cài đặt <code>resolve(text, strategy)</code>. Khối xung đột có hình dạng mặc định của git (không phải diff3): một dòng bắt đầu bằng ' + code('<<<<<<<') + ' mở khối, một dòng đúng bằng ' + code('=======') + ' ngăn hai phía, và một dòng bắt đầu bằng ' + code('>>>>>>>') + ' đóng khối. Mọi thứ ngoài khối được chép qua nguyên vẹn.</p>' +
            '<p><code>strategy</code> là <code>&quot;ours&quot;</code> (giữ các dòng phía trên vạch ngăn), <code>&quot;theirs&quot;</code> (giữ các dòng phía dưới) hoặc <code>&quot;union&quot;</code> (giữ cả hai, phía ta trước). Một phía có thể rỗng, và một file có thể có nhiều khối.</p>' +
            '<p>Thành công thì trả <code>{ text, conflicts }</code> — văn bản đã giải và số khối đã xử lý. Đầu vào hỏng thì trả <code>{ error }</code>, dùng đúng các thông báo sau (số dòng đếm từ 1):</p>' +
            '<ul>' +
            '<li>một khối không bao giờ được đóng → <code>unterminated conflict opened on line N</code> (N là dòng chứa ký hiệu mở của nó)</li>' +
            '<li>một vạch ngăn nằm ngoài mọi khối → <code>separator outside a conflict on line N</code></li>' +
            '<li>một ký hiệu đóng nằm ngoài mọi khối → <code>unexpected end marker on line N</code></li>' +
            '<li>một ký hiệu mở nằm bên trong một khối → <code>nested conflict on line N</code></li>' +
            '</ul>' +
            '<p>Không dùng thư viện nào. Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const L = (...lines) => lines.join('\\n') + '\\n';\n\n" +
            'const FILES = {\n' +
            "  'clean.txt': L('port = 8080', 'debug = false'),\n\n" +
            "  'one.txt': L(\n" +
            "    'host = api.local',\n" +
            "    '<<<<<<< HEAD',\n" +
            "    'timeout = 90',\n" +
            "    '=======',\n" +
            "    'timeout = 60',\n" +
            "    '>>>>>>> feature/timeout',\n" +
            "    'retries = 3',\n" +
            '  ),\n\n' +
            "  'two.txt': L(\n" +
            "    '<<<<<<< HEAD',\n" +
            "    'name = an',\n" +
            "    '=======',\n" +
            "    'name = binh',\n" +
            "    '>>>>>>> feature/rename',\n" +
            "    'shared = yes',\n" +
            "    '<<<<<<< HEAD',\n" +
            "    '=======',\n" +
            "    'extra = added-by-them',\n" +
            "    '>>>>>>> feature/rename',\n" +
            '  ),\n\n' +
            "  'broken.txt': L(\n" +
            "    '<<<<<<< HEAD',\n" +
            "    'a = 1',\n" +
            "    '=======',\n" +
            "    'a = 2',\n" +
            '  ),\n\n' +
            "  'stray.txt': L('x = 1', '=======', 'x = 2'),\n" +
            '};\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function resolve(text, strategy) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const show = (s) => JSON.stringify(s);\n' +
            'for (const name of Object.keys(FILES)) {\n' +
            "  for (const strategy of ['ours', 'theirs', 'union']) {\n" +
            '    const out = resolve(FILES[name], strategy);\n' +
            "    console.log(name + ' + ' + strategy + ' -> ' + (out.error\n" +
            "      ? 'ERROR ' + out.error\n" +
            "      : 'conflicts=' + out.conflicts + ' ' + show(out.text)));\n" +
            '  }\n' +
            '}\n',
          expectedOutput:
            'clean.txt + ours -> conflicts=0 "port = 8080\\ndebug = false\\n"\n' +
            'clean.txt + theirs -> conflicts=0 "port = 8080\\ndebug = false\\n"\n' +
            'clean.txt + union -> conflicts=0 "port = 8080\\ndebug = false\\n"\n' +
            'one.txt + ours -> conflicts=1 "host = api.local\\ntimeout = 90\\nretries = 3\\n"\n' +
            'one.txt + theirs -> conflicts=1 "host = api.local\\ntimeout = 60\\nretries = 3\\n"\n' +
            'one.txt + union -> conflicts=1 "host = api.local\\ntimeout = 90\\ntimeout = 60\\nretries = 3\\n"\n' +
            'two.txt + ours -> conflicts=2 "name = an\\nshared = yes\\n"\n' +
            'two.txt + theirs -> conflicts=2 "name = binh\\nshared = yes\\nextra = added-by-them\\n"\n' +
            'two.txt + union -> conflicts=2 "name = an\\nname = binh\\nshared = yes\\nextra = added-by-them\\n"\n' +
            'broken.txt + ours -> ERROR unterminated conflict opened on line 1\n' +
            'broken.txt + theirs -> ERROR unterminated conflict opened on line 1\n' +
            'broken.txt + union -> ERROR unterminated conflict opened on line 1\n' +
            'stray.txt + ours -> ERROR separator outside a conflict on line 2\n' +
            'stray.txt + theirs -> ERROR separator outside a conflict on line 2\n' +
            'stray.txt + union -> ERROR separator outside a conflict on line 2',
          sampleSolution:
            'function resolve(text, strategy) {\n' +
            "  const lines = text.split('\\n');\n" +
            '  const out = [];\n' +
            '  let conflicts = 0;\n' +
            '  let i = 0;\n\n' +
            '  while (i < lines.length) {\n' +
            '    const line = lines[i];\n\n' +
            "    if (line.startsWith('>>>>>>>')) {\n" +
            "      return { error: 'unexpected end marker on line ' + (i + 1) };\n" +
            '    }\n' +
            "    if (line.trim() === '=======') {\n" +
            "      return { error: 'separator outside a conflict on line ' + (i + 1) };\n" +
            '    }\n' +
            "    if (!line.startsWith('<<<<<<<')) { out.push(line); i += 1; continue; }\n\n" +
            '    const startedAt = i + 1;\n' +
            '    const ours = [];\n' +
            '    const theirs = [];\n' +
            '    let side = ours;\n' +
            '    let closed = false;\n' +
            '    i += 1;\n\n' +
            '    while (i < lines.length) {\n' +
            '      const cur = lines[i];\n' +
            "      if (cur.startsWith('<<<<<<<')) {\n" +
            "        return { error: 'nested conflict on line ' + (i + 1) };\n" +
            '      }\n' +
            "      if (cur.trim() === '=======') { side = theirs; i += 1; continue; }\n" +
            "      if (cur.startsWith('>>>>>>>')) { closed = true; i += 1; break; }\n" +
            '      side.push(cur);\n' +
            '      i += 1;\n' +
            '    }\n\n' +
            "    if (!closed) return { error: 'unterminated conflict opened on line ' + startedAt };\n\n" +
            '    conflicts += 1;\n' +
            "    const keep = strategy === 'ours' ? ours\n" +
            "      : strategy === 'theirs' ? theirs\n" +
            '        : [...ours, ...theirs];\n' +
            '    out.push(...keep);\n' +
            '  }\n\n' +
            "  return { text: out.join('\\n'), conflicts };\n" +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Hooks are a convenience, the server is the control (chapter 12).</b> Model the two gates a commit passes through and show why they are not the same thing.</p>' +
            '<p>Implement four functions:</p>' +
            '<ul>' +
            '<li><code>preCommit(policy, attempt)</code> — a LOCAL hook. Return an error string for the first offending file, or <code>null</code>. A file is a secret when its BASE NAME is in <code>policy.secretPaths</code> or ends with <code>policy.secretSuffix</code> → <code>pre-commit: secret file &lt;path&gt;</code>. A file over <code>policy.maxFileKb</code> → <code>pre-commit: &lt;path&gt; is &lt;kb&gt;kb</code>. Check the files in the order given, and check the secret rule before the size rule for each file.</li>' +
            '<li><code>commitMsg(policy, attempt)</code> — a LOCAL hook. The message must match <code>type(scope): subject</code>, where the scope is optional and lowercase alphanumeric with dashes. Not matching at all → <code>commit-msg: not a conventional commit</code>. A type outside <code>policy.types</code> → <code>commit-msg: unknown type &lt;type&gt;</code>. A whole message longer than <code>policy.maxSubject</code> → <code>commit-msg: subject is &lt;length&gt; chars</code>. Otherwise <code>null</code>.</li>' +
            '<li><code>preReceive(policy, attempt)</code> — the SERVER hook. It refuses a secret file with <code>pre-receive: secret file &lt;path&gt;</code>, and a force push to a branch in <code>policy.protectedBranches</code> with <code>pre-receive: force push to protected branch &lt;branch&gt;</code>. It does NOT care about message style, and it does NOT care about <code>--no-verify</code>.</li>' +
            '<li><code>gate(policy, attempt)</code> — put them together. <code>attempt.noVerify</code> skips BOTH local hooks. Local failure → <code>{ local: \'BLOCKED \' + reason, server: \'never reached\' }</code>. Otherwise <code>local</code> is <code>\'bypassed (--no-verify)\'</code> or <code>\'ok\'</code>, and <code>server</code> is <code>\'REJECTED \' + reason</code> or <code>\'accepted\'</code>. Run pre-commit before commit-msg.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing loop exactly as they are.</p>',

            '<p><b>Câu 32 — Hook là tiện lợi, máy chủ mới là kiểm soát (chương 12).</b> Hãy mô hình hoá hai cái cửa mà một commit đi qua và cho thấy vì sao chúng không phải một thứ.</p>' +
            '<p>Cài đặt bốn hàm:</p>' +
            '<ul>' +
            '<li><code>preCommit(policy, attempt)</code> — hook CỤC BỘ. Trả về chuỗi lỗi cho file phạm luật đầu tiên, hoặc <code>null</code>. Một file là bí mật khi TÊN CƠ SỞ của nó nằm trong <code>policy.secretPaths</code> hoặc kết thúc bằng <code>policy.secretSuffix</code> → <code>pre-commit: secret file &lt;đường dẫn&gt;</code>. File vượt <code>policy.maxFileKb</code> → <code>pre-commit: &lt;đường dẫn&gt; is &lt;kb&gt;kb</code>. Xét các file theo đúng thứ tự cho sẵn, và với mỗi file thì xét luật bí mật trước luật kích thước.</li>' +
            '<li><code>commitMsg(policy, attempt)</code> — hook CỤC BỘ. Lời nhắn phải khớp <code>type(scope): subject</code>, phần scope là tuỳ chọn và gồm chữ thường, số và dấu gạch ngang. Không khớp gì cả → <code>commit-msg: not a conventional commit</code>. Loại nằm ngoài <code>policy.types</code> → <code>commit-msg: unknown type &lt;loại&gt;</code>. Cả lời nhắn dài quá <code>policy.maxSubject</code> → <code>commit-msg: subject is &lt;độ dài&gt; chars</code>. Còn lại thì <code>null</code>.</li>' +
            '<li><code>preReceive(policy, attempt)</code> — hook trên MÁY CHỦ. Nó từ chối file bí mật với <code>pre-receive: secret file &lt;đường dẫn&gt;</code>, và từ chối force push vào nhánh nằm trong <code>policy.protectedBranches</code> với <code>pre-receive: force push to protected branch &lt;nhánh&gt;</code>. Nó KHÔNG quan tâm kiểu cách lời nhắn, và KHÔNG quan tâm <code>--no-verify</code>.</li>' +
            '<li><code>gate(policy, attempt)</code> — ghép lại. <code>attempt.noVerify</code> bỏ qua CẢ HAI hook cục bộ. Hỏng ở cục bộ → <code>{ local: \'BLOCKED \' + lý do, server: \'never reached\' }</code>. Còn lại thì <code>local</code> là <code>\'bypassed (--no-verify)\'</code> hoặc <code>\'ok\'</code>, và <code>server</code> là <code>\'REJECTED \' + lý do</code> hoặc <code>\'accepted\'</code>. Chạy pre-commit trước commit-msg.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const POLICY = {\n' +
            '  // pre-commit ở máy: đường dẫn bị cấm và trần kích thước\n' +
            "  secretPaths: ['.env', '.env.local', 'id_rsa'],\n" +
            "  secretSuffix: '.pem',\n" +
            '  maxFileKb: 500,\n' +
            '  // commit-msg ở máy: Conventional Commits, cả lời nhắn tối đa 50 ký tự\n' +
            "  types: ['feat', 'fix', 'chore', 'docs', 'refactor', 'test'],\n" +
            '  maxSubject: 50,\n' +
            '  // pre-receive trên máy chủ\n' +
            "  protectedBranches: ['main', 'release'],\n" +
            '};\n\n' +
            'const ATTEMPTS = [\n' +
            "  { branch: 'feature/login', message: 'feat(auth): add refresh token rotation',\n" +
            "    files: [{ path: 'src/auth.ts', kb: 12 }], noVerify: false, force: false },\n\n" +
            "  { branch: 'feature/login', message: 'updated stuff',\n" +
            "    files: [{ path: 'src/auth.ts', kb: 12 }], noVerify: false, force: false },\n\n" +
            "  { branch: 'feature/login', message: 'updated stuff',\n" +
            "    files: [{ path: 'src/auth.ts', kb: 12 }], noVerify: true, force: false },\n\n" +
            "  { branch: 'feature/cfg', message: 'chore: add config',\n" +
            "    files: [{ path: 'src/a.ts', kb: 3 }, { path: '.env', kb: 1 }], noVerify: false, force: false },\n\n" +
            "  { branch: 'feature/cfg', message: 'chore: add config',\n" +
            "    files: [{ path: 'src/a.ts', kb: 3 }, { path: '.env', kb: 1 }], noVerify: true, force: false },\n\n" +
            "  { branch: 'feature/keys', message: 'chore: add deploy key',\n" +
            "    files: [{ path: 'ops/deploy.pem', kb: 2 }], noVerify: true, force: false },\n\n" +
            "  { branch: 'feature/assets', message: 'feat: add hero video',\n" +
            "    files: [{ path: 'public/hero.mp4', kb: 51200 }], noVerify: false, force: false },\n\n" +
            "  { branch: 'main', message: 'fix: hotfix the payment timeout',\n" +
            "    files: [{ path: 'src/pay.ts', kb: 4 }], noVerify: false, force: true },\n\n" +
            "  { branch: 'feature/long', message: 'refactor(api): extract the pagination helper out of the feed service',\n" +
            "    files: [{ path: 'src/feed.ts', kb: 9 }], noVerify: false, force: false },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function preCommit(policy, attempt) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function commitMsg(policy, attempt) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function preReceive(policy, attempt) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function gate(policy, attempt) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const [n, a] of ATTEMPTS.entries()) {\n' +
            '  const r = gate(POLICY, a);\n' +
            "  console.log('#' + (n + 1) + ' local=' + r.local + ' | server=' + r.server);\n" +
            '}\n',
          expectedOutput:
            '#1 local=ok | server=accepted\n' +
            '#2 local=BLOCKED commit-msg: not a conventional commit | server=never reached\n' +
            '#3 local=bypassed (--no-verify) | server=accepted\n' +
            '#4 local=BLOCKED pre-commit: secret file .env | server=never reached\n' +
            '#5 local=bypassed (--no-verify) | server=REJECTED pre-receive: secret file .env\n' +
            '#6 local=bypassed (--no-verify) | server=REJECTED pre-receive: secret file ops/deploy.pem\n' +
            '#7 local=BLOCKED pre-commit: public/hero.mp4 is 51200kb | server=never reached\n' +
            '#8 local=ok | server=REJECTED pre-receive: force push to protected branch main\n' +
            '#9 local=BLOCKED commit-msg: subject is 68 chars | server=never reached',
          sampleSolution:
            'function isSecret(policy, path) {\n' +
            "  const base = path.split('/').pop();\n" +
            '  return policy.secretPaths.includes(base) || base.endsWith(policy.secretSuffix);\n' +
            '}\n\n' +
            'function preCommit(policy, attempt) {\n' +
            '  for (const f of attempt.files) {\n' +
            "    if (isSecret(policy, f.path)) return 'pre-commit: secret file ' + f.path;\n" +
            "    if (f.kb > policy.maxFileKb) return 'pre-commit: ' + f.path + ' is ' + f.kb + 'kb';\n" +
            '  }\n' +
            '  return null;\n' +
            '}\n\n' +
            'function commitMsg(policy, attempt) {\n' +
            '  const m = /^([a-z]+)(?:\\(([a-z0-9-]+)\\))?: (.+)$/.exec(attempt.message);\n' +
            "  if (!m) return 'commit-msg: not a conventional commit';\n" +
            "  if (!policy.types.includes(m[1])) return 'commit-msg: unknown type ' + m[1];\n" +
            '  if (attempt.message.length > policy.maxSubject) {\n' +
            "    return 'commit-msg: subject is ' + attempt.message.length + ' chars';\n" +
            '  }\n' +
            '  return null;\n' +
            '}\n\n' +
            'function preReceive(policy, attempt) {\n' +
            '  // Máy chủ KHÔNG quan tâm --no-verify: nó chạy trên máy chủ.\n' +
            '  for (const f of attempt.files) {\n' +
            "    if (isSecret(policy, f.path)) return 'pre-receive: secret file ' + f.path;\n" +
            '  }\n' +
            '  if (attempt.force && policy.protectedBranches.includes(attempt.branch)) {\n' +
            "    return 'pre-receive: force push to protected branch ' + attempt.branch;\n" +
            '  }\n' +
            '  return null;\n' +
            '}\n\n' +
            'function gate(policy, attempt) {\n' +
            '  // --no-verify bỏ qua MỌI hook ở máy, và chỉ ở máy.\n' +
            '  const local = attempt.noVerify\n' +
            '    ? null\n' +
            '    : (preCommit(policy, attempt) ?? commitMsg(policy, attempt));\n\n' +
            "  if (local) return { local: 'BLOCKED ' + local, server: 'never reached' };\n\n" +
            '  const server = preReceive(policy, attempt);\n' +
            '  return {\n' +
            "    local: attempt.noVerify ? 'bypassed (--no-verify)' : 'ok',\n" +
            "    server: server ? 'REJECTED ' + server : 'accepted',\n" +
            '  };\n' +
            '}\n',
        }),
      ],
    },
  ],
};
