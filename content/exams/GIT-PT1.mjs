/**
 * Git & GitHub — Progress Test 1 (Mục 0 → Chương 4).
 *
 * Đề tự soạn, bám sát `content/courses/git/s00-intro.mjs` … `s04-hoan-tac.mjs`.
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi.
 *
 * ⚠️ MỌI transcript, mọi thông báo lỗi, mọi mã thoát trong đề này đều được LẤY
 * TỪ MỘT KHO NHÁP THẬT dựng trong scratchpad (NGOÀI kho api-backend), chạy bằng
 *
 *     git version 2.51.1   (Homebrew, macOS arm64, 10/09/2026)
 *
 * với `GIT_CONFIG_GLOBAL` trỏ vào một file rỗng và `GIT_CONFIG_SYSTEM=/dev/null`
 * để không có cấu hình nào của máy lọt vào phép đo. Mã băm trong đề là **mã băm
 * thật của kho nháp đó**, chép nguyên văn — không có mã băm nào bịa ra.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BỐN CHỖ MÁY KHÁC GIÁO TRÌNH (đo 10/09/2026, git 2.51.1)
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. `git init` KHÔNG cho ra `main`. Bài 0.3 và bảng cấu hình ở 13.2 đều dạy
 *    `git config --global init.defaultBranch main`, và mọi transcript trong
 *    khoá hiện `[main …]`. Nhưng với một cấu hình toàn cục RỖNG, git 2.51.1 vẫn
 *    tạo `master`, kèm khối `hint:` chín dòng. Câu 4 của đề hỏi đúng chỗ này và
 *    theo MÁY, không theo giáo trình.
 *
 * 2. Dòng gợi ý tắt lời khuyên nay là `git config set advice.X false` (tiểu lệnh
 *    `git config set` mới), không phải `git config --global advice.X false` như
 *    các bản git thời 2.43 mà bài 0.3 chụp lại.
 *
 * 3. Thông báo từ chối xoá nhánh chưa hợp nhất đã đổi chữ. Sách vở (và bài 3.1)
 *    quen với `error: The branch 'x' is not fully merged.` — chữ T hoa, có dấu
 *    chấm. Máy 2.51.1 trả:
 *        error: the branch 'feat' is not fully merged
 *        hint: If you are sure you want to delete it, run 'git branch -D feat'
 *    Câu 17 chép nguyên văn bản của máy.
 *
 * 4. Kiểu ký hiệu xung đột MẶC ĐỊNH vẫn là `merge` (hai phần), KHÔNG phải
 *    `zdiff3`. Bài 3.3 gọi `zdiff3` là "thiết lập Git có giá trị nhất trong cả
 *    khoá" và in ra khối có phần `||||||| merge base` — nhưng đó là thứ phải tự
 *    bật. Trên máy sạch, khối xung đột chỉ có `<<<<<<< HEAD`, `=======` và
 *    `>>>>>>> <nhánh>`. Đề bám theo mặc định của máy.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh trong đề bài):
 *     { '0': 7, '1': 8, '2': 8, '3': 7 }   → A 7 · B 8 · C 8 · D 7
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/GIT-PT1.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/git-exam-kit.mjs';

export default {
  course: { slug: 'git' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Sections 0–4 (setup, the three trees, reading history, branching, undo)',
        'Kiểm tra tiến độ 1 — Mục 0–4 (cài đặt, ba cái cây, đọc lịch sử, nhánh, hoàn tác)',
      ),
      description: B(
        'The first third of the Git course: installing and configuring Git, the three trees, what a commit really is, .gitignore, querying history with log/blame/bisect, branching and merging, and every way to undo. 30 multiple-choice questions plus 2 programming questions you write here in the exam room.',
        'Một phần ba đầu của khoá Git: cài đặt và cấu hình Git, ba cái cây, một commit thật sự là gì, .gitignore, truy vấn lịch sử bằng log/blame/bisect, nhánh và hợp nhất, và mọi cách hoàn tác. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–4'),
      questions: [
        // ── Mục 0 — Cài đặt & cấu hình ──────────────────────────────────
        mcq({
          prompt: B(
            'These three commands were run in this order, and then the fourth one asked what is in effect:' + code(
              'git config --system user.email  system@example.com\n' +
              'git config --global user.email  global@example.com\n' +
              'git config           user.email  local@example.com\n' +
              'git config user.email',
            ) + 'Which address does the last command print, and where does that value live?',
            'Ba lệnh sau được chạy theo thứ tự này, rồi lệnh thứ tư hỏi cái nào đang có hiệu lực:' + code(
              'git config --system user.email  system@example.com\n' +
              'git config --global user.email  global@example.com\n' +
              'git config           user.email  local@example.com\n' +
              'git config user.email',
            ) + 'Lệnh cuối in ra địa chỉ nào, và giá trị đó nằm ở đâu?',
          ),
          options: [
            B('<code>system@example.com</code>, from <code>/etc/gitconfig</code> — the machine-wide file is the authority and the narrower files only add keys it has not set', '<code>system@example.com</code>, từ <code>/etc/gitconfig</code> — file cấp máy là nơi quyết định, các file hẹp hơn chỉ thêm những khoá nó chưa đặt'),
            B('<code>global@example.com</code>, from <code>~/.gitconfig</code> — the per-user file always wins because Git identifies commits by person, not by repository', '<code>global@example.com</code>, từ <code>~/.gitconfig</code> — file của người dùng luôn thắng vì Git định danh commit theo người, không theo kho mã'),
            B('<code>local@example.com</code>, from <code>.git/config</code> — the narrowest scope wins, and a bare <code>git config</code> with no scope flag writes local', '<code>local@example.com</code>, từ <code>.git/config</code> — mức hẹp nhất thắng, và <code>git config</code> không kèm cờ phạm vi thì ghi vào mức local'),
            B('Git refuses and prints a warning that the same key is set at three different scopes at once', 'Git từ chối và in cảnh báo rằng cùng một khoá đang được đặt ở ba phạm vi khác nhau'),
          ],
          correct: 2,
          explanation: EX(
            'Verified on the machine: with all three set, <code>git config user.email</code> printed <code>local@example.com</code>, and after <code>git config --unset user.email</code> it fell back to the global value. Three scopes, narrowest wins: <code>--system</code> (<code>/etc/gitconfig</code>) → <code>--global</code> (<code>~/.gitconfig</code>) → <code>--local</code> (<code>.git/config</code>). This is exactly why the lesson tells you to run <code>git config user.email work@company.com</code> INSIDE a client repository: one command, and every commit there carries the right identity without touching your personal default. <code>git config --list --show-origin</code> prints the file each value came from.',
            'Đã đo trên máy: khi cả ba cùng được đặt, <code>git config user.email</code> in ra <code>local@example.com</code>, và sau <code>git config --unset user.email</code> nó rơi về giá trị global. Ba mức, hẹp nhất thắng: <code>--system</code> (<code>/etc/gitconfig</code>) → <code>--global</code> (<code>~/.gitconfig</code>) → <code>--local</code> (<code>.git/config</code>). Đây chính là lý do bài 0.3 dặn chạy <code>git config user.email work@company.com</code> BÊN TRONG kho của khách hàng: một lệnh, và mọi commit ở đó mang đúng danh tính mà không đụng tới mặc định cá nhân. <code>git config --list --show-origin</code> in ra file nguồn của từng giá trị.',
          ),
        }),

        mcq({
          prompt: B(
            'Your team is half macOS and half Windows. What does <code>core.autocrlf</code> do on each side, and what ends up stored in the repository?',
            'Nhóm của bạn nửa dùng macOS, nửa dùng Windows. <code>core.autocrlf</code> làm gì ở mỗi bên, và cuối cùng cái gì được lưu trong kho mã?',
          ),
          options: [
            B('<code>input</code> on Windows and <code>true</code> on macOS; the repository stores CRLF because Windows is the stricter platform of the two', '<code>input</code> trên Windows và <code>true</code> trên macOS; kho mã lưu CRLF vì Windows là nền tảng khắt khe hơn'),
            B('<code>input</code> on macOS/Linux (convert CRLF to LF on commit only) and <code>true</code> on Windows (also convert LF back to CRLF on checkout); the repository stores LF', '<code>input</code> trên macOS/Linux (chỉ đổi CRLF sang LF lúc commit) và <code>true</code> trên Windows (đổi thêm LF về CRLF lúc checkout); kho mã lưu LF'),
            B('It only affects <code>git diff</code> output and never changes a single byte of what is actually committed to the object database', 'Nó chỉ ảnh hưởng tới output của <code>git diff</code> và không bao giờ đổi một byte nào của thứ thật sự được commit vào kho đối tượng'),
            B('Nothing on either side unless the repository also ships a <code>.gitattributes</code> file, which is the only mechanism Git has for line endings', 'Không làm gì ở cả hai bên, trừ khi kho mã có kèm file <code>.gitattributes</code> — cơ chế duy nhất Git có cho ký tự xuống dòng'),
          ],
          correct: 1,
          explanation: EX(
            'Windows ends a line with two characters (CR + LF), macOS and Linux with one (LF). The repository should always hold LF. <code>core.autocrlf=input</code> normalises on the way in and leaves your files alone; <code>core.autocrlf=true</code> also converts back on checkout so Windows tools see what they expect. Get this wrong and one person\'s "save file" rewrites every line ending, which is how a one-word change reaches a reviewer as a 4,000-line diff. <code>.gitattributes</code> is the better fix long-term because the rule then travels with the repository instead of living in each person\'s config.',
            'Windows kết thúc một dòng bằng hai ký tự (CR + LF), macOS và Linux bằng một (LF). Kho mã thì luôn nên giữ LF. <code>core.autocrlf=input</code> chuẩn hoá lúc đi vào và để yên file của bạn; <code>core.autocrlf=true</code> đổi ngược lại lúc checkout để công cụ Windows thấy đúng thứ chúng chờ đợi. Đặt sai là một cái "lưu file" của một người viết lại toàn bộ ký tự xuống dòng — đó là cách một thay đổi một chữ tới tay người review dưới dạng diff 4.000 dòng. <code>.gitattributes</code> là cách sửa tốt hơn về lâu dài vì luật khi đó đi theo kho mã thay vì nằm trong cấu hình từng người.',
          ),
        }),

        mcq({
          prompt: B(
            'You created an SSH key with <code>ssh-keygen -t ed25519</code> and now have two files in <code>~/.ssh/</code>: <code>id_ed25519</code> and <code>id_ed25519.pub</code>. Which one do you paste into GitHub, and what is the other one?',
            'Bạn vừa tạo khoá SSH bằng <code>ssh-keygen -t ed25519</code> và giờ có hai file trong <code>~/.ssh/</code>: <code>id_ed25519</code> và <code>id_ed25519.pub</code>. Bạn dán file nào lên GitHub, và file còn lại là gì?',
          ),
          options: [
            B('Paste <code>id_ed25519.pub</code>; the file with no extension is the PRIVATE key and is effectively a password — if it leaks, delete the key on GitHub and generate a new pair', 'Dán <code>id_ed25519.pub</code>; file không có phần mở rộng là khoá RIÊNG TƯ và thực chất là một mật khẩu — lộ thì xoá khoá trên GitHub và tạo cặp mới'),
            B('Paste <code>id_ed25519</code>; the <code>.pub</code> file is only a local checksum that Git uses to detect a corrupted key file on disk', 'Dán <code>id_ed25519</code>; file <code>.pub</code> chỉ là một mã kiểm tra cục bộ để Git phát hiện file khoá bị hỏng trên đĩa'),
            B('Paste both, in that order — GitHub needs the pair to be able to verify a signature and to encrypt the session', 'Dán cả hai, theo đúng thứ tự đó — GitHub cần cả cặp mới xác minh được chữ ký và mã hoá phiên'),
            B('Neither: GitHub reads the key straight from <code>ssh-agent</code> the first time you run <code>git push</code> over SSH', 'Không dán cái nào: GitHub đọc thẳng khoá từ <code>ssh-agent</code> ngay lần đầu bạn chạy <code>git push</code> qua SSH'),
          ],
          correct: 0,
          explanation: EX(
            'The <code>.pub</code> half is public by design — pasting it into a GitHub settings page, a wiki or a chat is harmless. The file with no extension never leaves your machine. And note the reply that reads like a failure but is a success: <code>ssh -T git@github.com</code> answering <i>"Hi &lt;you&gt;! You\'ve successfully authenticated, but GitHub does not provide shell access."</i> is exactly what a working key looks like — GitHub simply has no shell to give you.',
            'Nửa <code>.pub</code> vốn dĩ là công khai — dán nó vào trang cài đặt GitHub, một wiki hay một khung chat đều vô hại. File không có phần mở rộng thì không bao giờ rời khỏi máy bạn. Và để ý câu trả lời đọc lên như thất bại nhưng thật ra là thành công: <code>ssh -T git@github.com</code> trả về <i>"Hi &lt;bạn&gt;! You\'ve successfully authenticated, but GitHub does not provide shell access."</i> chính là dấu hiệu khoá đang chạy tốt — GitHub đơn giản là không có shell nào để đưa cho bạn.',
          ),
        }),

        mcq({
          prompt: B(
            'On a machine whose global Git config is EMPTY, <code>git init</code> is run in a new folder. What is the name of the branch that is created?' + code(
              '$ git init\n' +
              "hint: Using '???' as the name for the initial branch. This default branch name\n" +
              'hint: is subject to change. To configure the initial branch name to use in all\n' +
              'hint: of your new repositories, which will suppress this warning, call:\n' +
              'hint:\n' +
              'hint: \tgit config --global init.defaultBranch <name>\n' +
              '...\n' +
              '$ git symbolic-ref --short HEAD\n' +
              '???',
            ),
            'Trên một máy có cấu hình Git toàn cục RỖNG, <code>git init</code> được chạy trong một thư mục mới. Nhánh được tạo ra tên là gì?' + code(
              '$ git init\n' +
              "hint: Using '???' as the name for the initial branch. This default branch name\n" +
              'hint: is subject to change. To configure the initial branch name to use in all\n' +
              'hint: of your new repositories, which will suppress this warning, call:\n' +
              'hint:\n' +
              'hint: \tgit config --global init.defaultBranch <name>\n' +
              '...\n' +
              '$ git symbolic-ref --short HEAD\n' +
              '???',
            ),
          ),
          options: [
            B('<code>main</code> — modern Git switched the built-in default years ago, and the hint block above is only left over for scripts that still expect the old name', '<code>main</code> — Git đời mới đã đổi mặc định cài sẵn từ nhiều năm trước, khối hint ở trên chỉ còn sót lại cho các script vẫn chờ tên cũ'),
            B('<code>trunk</code> — the neutral name Git falls back to whenever <code>init.defaultBranch</code> is unset, which is why the hint offers it as an alternative', '<code>trunk</code> — cái tên trung tính Git rơi về khi <code>init.defaultBranch</code> chưa được đặt, và đó là lý do khối hint nêu nó ra như một lựa chọn'),
            B('There is no branch yet: <code>git symbolic-ref</code> fails until the first commit creates one, so nothing is printed at all', 'Chưa có nhánh nào cả: <code>git symbolic-ref</code> báo lỗi cho tới khi commit đầu tiên tạo ra một nhánh, nên không có gì được in ra'),
            B('<code>master</code> — the built-in default has never changed; <code>main</code> only appears once you set <code>init.defaultBranch</code> yourself', '<code>master</code> — mặc định cài sẵn chưa hề đổi; <code>main</code> chỉ xuất hiện khi chính bạn đặt <code>init.defaultBranch</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Measured on git 2.51.1 with an empty global config: <code>git init</code> printed the nine-line hint and <code>git symbolic-ref --short HEAD</code> answered <code>master</code>. GitHub renamed the default for NEW REPOSITORIES CREATED ON GITHUB; the <code>git</code> binary on your laptop did not follow. Every <code>main</code> in this course exists because lesson 0.3 told you to run <code>git config --global init.defaultBranch main</code> — that is a setting, not a default. The same release also changed the "how to silence me" line to the new subcommand form, <code>git config set advice.defaultBranchName false</code>.',
            'Đo trên git 2.51.1 với cấu hình toàn cục rỗng: <code>git init</code> in ra khối hint chín dòng và <code>git symbolic-ref --short HEAD</code> trả lời <code>master</code>. GitHub đổi mặc định cho KHO MỚI TẠO TRÊN GITHUB; còn cái <code>git</code> trên máy bạn thì không đi theo. Mọi chữ <code>main</code> trong khoá này có được là nhờ bài 0.3 bảo bạn chạy <code>git config --global init.defaultBranch main</code> — đó là một thiết lập, không phải mặc định. Cũng bản đó đổi luôn dòng "tắt lời khuyên này" sang dạng tiểu lệnh mới: <code>git config set advice.defaultBranchName false</code>.',
          ),
        }),

        // ── Chương 1 — Mô hình ──────────────────────────────────────────
        mcq({
          prompt: B(
            'A repository has one commit containing <code>a.txt</code> and <code>g.txt</code>. Then:' + code(
              '$ git rm --cached g.txt\n' +
              "rm 'g.txt'\n" +
              '$ git status --short\n' +
              '???',
            ) + 'What does <code>git status --short</code> print, and is <code>g.txt</code> still on disk?',
            'Một kho có một commit chứa <code>a.txt</code> và <code>g.txt</code>. Sau đó:' + code(
              '$ git rm --cached g.txt\n' +
              "rm 'g.txt'\n" +
              '$ git status --short\n' +
              '???',
            ) + '<code>git status --short</code> in ra gì, và <code>g.txt</code> còn trên đĩa không?',
          ),
          options: [
            B('One line, <code> D g.txt</code>, and the file is gone from disk — <code>--cached</code> only decides whether the deletion is staged', 'Một dòng, <code> D g.txt</code>, và file đã biến khỏi đĩa — <code>--cached</code> chỉ quyết định việc xoá có được staging hay không'),
            B('Two lines, <code>D  g.txt</code> and <code>?? g.txt</code>, and the file is still on disk — it was removed from the index but not from the working directory', 'Hai dòng, <code>D  g.txt</code> và <code>?? g.txt</code>, và file vẫn còn trên đĩa — nó bị gỡ khỏi index chứ không khỏi thư mục làm việc'),
            B('Nothing at all, because <code>git rm --cached</code> already committed the removal on your behalf', 'Không in gì cả, vì <code>git rm --cached</code> đã tự commit việc gỡ bỏ giúp bạn'),
            B('One line, <code>?? g.txt</code>, because a file Git no longer tracks cannot appear in the left-hand column', 'Một dòng, <code>?? g.txt</code>, vì file mà Git không còn theo dõi thì không thể xuất hiện ở cột bên trái'),
          ],
          correct: 1,
          explanation: EX(
            'Copied verbatim from the scratch repository. The two columns of <code>--short</code> are <b>index vs HEAD</b> and <b>working directory vs index</b>. <code>D&nbsp;&nbsp;g.txt</code> says the index no longer has a file that HEAD does have; <code>?? g.txt</code> says the same path exists on disk and nothing is tracking it. Both lines describe the same file at once, which is exactly why <code>git rm --cached</code> is the right tool for "stop tracking this, keep my copy" — the fix for a <code>.env</code> that was committed before you wrote the <code>.gitignore</code> line. Plain <code>git rm</code> with no flag deletes the file from your disk too.',
            'Chép nguyên văn từ kho nháp. Hai cột của <code>--short</code> là <b>index so với HEAD</b> và <b>thư mục làm việc so với index</b>. <code>D&nbsp;&nbsp;g.txt</code> nói index không còn file mà HEAD vẫn có; <code>?? g.txt</code> nói đúng đường dẫn đó vẫn nằm trên đĩa và không có gì theo dõi nó. Hai dòng cùng mô tả một file, và đó chính là lý do <code>git rm --cached</code> là công cụ đúng cho "ngừng theo dõi cái này, giữ bản của tôi" — cách sửa cho một file <code>.env</code> đã trót commit trước khi bạn kịp viết dòng <code>.gitignore</code>. <code>git rm</code> trần không cờ thì xoá luôn file khỏi đĩa.',
          ),
        }),

        mcq({
          prompt: B(
            'You ran <code>git commit -m "…"</code> with a 300-character explanation crammed into the single <code>-m</code>. What went wrong, and what is the fix that still avoids opening an editor?',
            'Bạn chạy <code>git commit -m "…"</code> với một lời giải thích 300 ký tự nhét hết vào một cái <code>-m</code>. Sai ở đâu, và cách sửa nào vẫn tránh được việc mở trình soạn thảo?',
          ),
          options: [
            B('Git truncated the message at 72 characters when it wrote the commit object, so the rest of your explanation is simply not stored anywhere', 'Git đã cắt lời nhắn ở ký tự thứ 72 khi ghi đối tượng commit, nên phần còn lại của lời giải thích không được lưu ở đâu cả'),
            B('Nothing went wrong; <code>git log --oneline</code> wraps long subjects automatically and GitHub shows the whole thing in the pull request list', 'Không sai gì cả; <code>git log --oneline</code> tự xuống dòng với tiêu đề dài và GitHub hiện đủ cả câu trong danh sách pull request'),
            B('With no blank line there is no body: the whole paragraph became the SUBJECT, so <code>git log --oneline</code> is unreadable — pass <code>-m</code> twice, and the second one becomes the body', 'Không có dòng trống thì không có thân bài: cả đoạn văn trở thành TIÊU ĐỀ, nên <code>git log --oneline</code> hết đọc nổi — hãy truyền <code>-m</code> hai lần, cái thứ hai thành thân bài'),
            B('The commit was rejected because Git enforces the 50/72 rule and refuses any subject longer than 50 characters', 'Commit bị từ chối vì Git áp luật 50/72 và không nhận tiêu đề dài quá 50 ký tự'),
          ],
          correct: 2,
          explanation: EX(
            'A commit message is <b>subject · blank line · body</b>, and the blank line is what creates the split. Without it every tool that shows "the subject" — <code>git log --oneline</code>, the GitHub commit list, the PR list, <code>git shortlog</code> — shows your whole paragraph. Git enforces none of this: the 50/72 rule is a convention, not a validation. Two <code>-m</code> flags give you a real body without an editor, and the subject test that ends every argument is whether it completes the sentence "If applied, this commit will …".',
            'Một lời nhắn commit gồm <b>tiêu đề · dòng trống · thân bài</b>, và chính dòng trống tạo ra ranh giới đó. Thiếu nó thì mọi công cụ hiện "tiêu đề" — <code>git log --oneline</code>, danh sách commit trên GitHub, danh sách PR, <code>git shortlog</code> — đều hiện nguyên cả đoạn. Git không ép gì cả: luật 50/72 là quy ước chứ không phải phép kiểm. Truyền hai cờ <code>-m</code> là có thân bài thật mà không cần trình soạn thảo, còn phép thử dập tắt mọi tranh cãi về tiêu đề là nó có hoàn thành được câu "Nếu áp dụng, commit này sẽ …" hay không.',
          ),
        }),

        mcq({
          prompt: B(
            'Your project uses Conventional Commits and derives release numbers from them. The version is currently <code>2.4.1</code>. Which mapping is correct?',
            'Dự án của bạn dùng Conventional Commits và suy ra số phiên bản từ đó. Phiên bản hiện tại là <code>2.4.1</code>. Ánh xạ nào ĐÚNG?',
          ),
          options: [
            B('<code>fix:</code> → patch (2.4.2) · <code>feat:</code> → minor (2.5.0) · a <code>BREAKING CHANGE:</code> footer or a <code>!</code> after the type → major (3.0.0)', '<code>fix:</code> → patch (2.4.2) · <code>feat:</code> → minor (2.5.0) · dòng chân <code>BREAKING CHANGE:</code> hoặc dấu <code>!</code> sau loại → major (3.0.0)'),
            B('<code>feat:</code> → patch (2.4.2) · <code>fix:</code> → minor (2.5.0) · <code>refactor:</code> → major (3.0.0), because a refactor is the riskiest of the three', '<code>feat:</code> → patch (2.4.2) · <code>fix:</code> → minor (2.5.0) · <code>refactor:</code> → major (3.0.0), vì refactor là thứ rủi ro nhất trong ba loại'),
            B('Every conventional type bumps the patch number; only a human editing package.json can ever move the minor or major digit', 'Mọi loại conventional đều tăng số patch; chỉ có người sửa tay package.json mới dời được chữ số minor hay major'),
            B('The type only controls which section of the changelog the line lands in; it has no defined relationship to the version number at all', 'Loại chỉ quyết định dòng đó rơi vào mục nào của changelog; nó hoàn toàn không có quan hệ nào được định nghĩa với số phiên bản'),
          ],
          correct: 0,
          explanation: EX(
            'That mapping is the whole point of the convention: a machine can read the log and compute the next version, which is what <code>release-please</code> and <code>semantic-release</code> do. The other types (<code>docs</code>, <code>chore</code>, <code>test</code>, <code>refactor</code>, <code>perf</code>) do not move the number by themselves. It also makes the log queryable — <code>git log --grep "^fix"</code> answers "what did we fix this month?". The catch is that the discipline has to be real: one <code>feat:</code> that was actually breaking, and your <code>2.5.0</code> silently breaks every caller.',
            'Ánh xạ đó chính là toàn bộ lý do quy ước này tồn tại: một cái máy đọc được log và tính ra phiên bản kế tiếp — đúng việc mà <code>release-please</code> và <code>semantic-release</code> làm. Các loại còn lại (<code>docs</code>, <code>chore</code>, <code>test</code>, <code>refactor</code>, <code>perf</code>) tự chúng không dời số. Nó cũng làm lịch sử truy vấn được — <code>git log --grep "^fix"</code> trả lời "tháng này ta đã sửa những gì?". Cái giá là kỷ luật phải thật: một cái <code>feat:</code> mà thật ra phá vỡ tương thích là bản <code>2.5.0</code> của bạn âm thầm làm hỏng mọi bên gọi.',
          ),
        }),

        mcq({
          prompt: B(
            'You are running <code>git add -p src/auth.ts</code>. One hunk contains two unrelated ideas and you only want to stage the first. Which key does the job?' + code(
              '(1/2) Stage this hunk [y,n,q,a,d,j,J,g,/,s,e,?]?',
            ),
            'Bạn đang chạy <code>git add -p src/auth.ts</code>. Một đoạn (hunk) chứa hai ý không liên quan và bạn chỉ muốn staging ý thứ nhất. Phím nào làm được việc đó?' + code(
              '(1/2) Stage this hunk [y,n,q,a,d,j,J,g,/,s,e,?]?',
            ),
          ),
          options: [
            B('<code>a</code> — "accept part", which stages the first half of the hunk and leaves the remainder for the next prompt', '<code>a</code> — "accept part", staging nửa đầu của đoạn và để phần còn lại cho lượt hỏi kế tiếp'),
            B('<code>y</code> then immediately <code>n</code> — Git rewinds and applies your answers line by line inside the same hunk', '<code>y</code> rồi bấm ngay <code>n</code> — Git tua lại và áp câu trả lời của bạn theo từng dòng bên trong cùng đoạn đó'),
            B('None of them: hunks are the smallest unit <code>-p</code> can work with, so you must commit both ideas together and split later', 'Không phím nào cả: đoạn là đơn vị nhỏ nhất mà <code>-p</code> làm việc được, nên bạn phải commit cả hai ý rồi chẻ ra sau'),
            B('<code>s</code> — split the hunk into smaller ones, then answer <code>y</code>/<code>n</code> for each; <code>e</code> opens the hunk for hand editing when even that is not fine enough', '<code>s</code> — chẻ đoạn đó thành các đoạn nhỏ hơn, rồi trả lời <code>y</code>/<code>n</code> cho từng cái; <code>e</code> mở đoạn ra sửa tay khi chẻ vẫn chưa đủ mịn'),
          ],
          correct: 3,
          explanation: EX(
            '<code>s</code> is the most-used key in the whole prompt. <code>a</code> means "stage this hunk and all remaining hunks in this file", <code>d</code> is its opposite, and <code>q</code> quits. The staging area exists so that a commit can be one idea even when your afternoon contained three — and <code>add -p</code> is the tool that makes that possible after the fact, without rearranging your working tree. If splitting still leaves two ideas in one hunk, <code>e</code> hands you the patch in an editor.',
            '<code>s</code> là phím dùng nhiều nhất trong cả bảng đó. <code>a</code> nghĩa là "staging đoạn này và mọi đoạn còn lại trong file", <code>d</code> là ngược lại, <code>q</code> là thoát. Vùng staging tồn tại để một commit là MỘT ý ngay cả khi buổi chiều của bạn chứa ba ý — và <code>add -p</code> chính là công cụ làm được điều đó sau khi mọi thứ đã xong, không cần xáo trộn cây làm việc. Nếu chẻ rồi mà một đoạn vẫn còn hai ý thì <code>e</code> đưa bản vá vào trình soạn thảo cho bạn sửa tay.',
          ),
        }),

        mcq({
          prompt: B(
            'A file is not showing up in <code>git status</code> and you want to know which rule hid it. You run:' + code(
              '$ git check-ignore -v logs/debug.log\n' +
              '.gitignore:1:logs/\tlogs/debug.log',
            ) + 'How do you read that line, and what does it mean when the command prints nothing at all?',
            'Một file không hiện ra trong <code>git status</code> và bạn muốn biết luật nào đã giấu nó. Bạn chạy:' + code(
              '$ git check-ignore -v logs/debug.log\n' +
              '.gitignore:1:logs/\tlogs/debug.log',
            ) + 'Đọc dòng đó thế nào, và không in ra gì cả thì nghĩa là gì?',
          ),
          options: [
            B('It reports the number of ignore rules that matched (here: 1); no output means the file matched every rule at once and Git could not pick a winner', 'Nó báo số luật ignore đã khớp (ở đây: 1); không in gì nghĩa là file khớp mọi luật cùng lúc và Git không chọn được luật nào thắng'),
            B('It names the file, the line number and the exact pattern that matched — <code>.gitignore</code> line 1, pattern <code>logs/</code>; printing nothing means the path is NOT ignored', 'Nó gọi tên file, số dòng và chính xác cái mẫu đã khớp — <code>.gitignore</code> dòng 1, mẫu <code>logs/</code>; không in gì nghĩa là đường dẫn đó KHÔNG bị ignore'),
            B('It shows the rule Git would ADD if you asked it to ignore this path; no output means the path is already ignored and nothing needs adding', 'Nó cho thấy luật mà Git SẼ THÊM nếu bạn nhờ nó ignore đường dẫn này; không in gì nghĩa là đường dẫn đã bị ignore rồi, khỏi thêm gì nữa'),
            B('It reports whether the file is tracked; no output means the file is tracked, which is why <code>.gitignore</code> has no effect on it', 'Nó báo file có được theo dõi không; không in gì nghĩa là file đang được theo dõi, và đó là lý do <code>.gitignore</code> không có tác dụng với nó'),
          ],
          correct: 1,
          explanation: EX(
            'Verified in the scratch repository, including the negative case: with <code>logs/</code> in the ignore file, <code>logs/debug.log</code> matched line 1; with the pattern changed to <code>logs/*</code>, the same command reported line 2, the negation <code>!logs/debug.log</code>, and the file appeared in <code>git status</code>. That is the tool for the "why is my file invisible?" question, and it beats reading the ignore file by eye — the rule can also come from <code>.git/info/exclude</code> or from your global <code>core.excludesFile</code>, and <code>-v</code> tells you which. Remember the separate trap: none of this applies to a file Git already tracks.',
            'Đã kiểm trong kho nháp, kể cả ca ngược lại: với <code>logs/</code> trong file ignore, <code>logs/debug.log</code> khớp dòng 1; đổi mẫu thành <code>logs/*</code> thì đúng lệnh đó báo dòng 2, luật phủ định <code>!logs/debug.log</code>, và file hiện ra trong <code>git status</code>. Đó là công cụ cho câu hỏi "sao file của tôi tàng hình?", và nó hơn hẳn việc đọc file ignore bằng mắt — luật còn có thể tới từ <code>.git/info/exclude</code> hoặc <code>core.excludesFile</code> toàn cục của bạn, và <code>-v</code> nói cho bạn biết là cái nào. Nhớ cái bẫy riêng: mọi thứ trên đây không áp dụng cho file Git vốn đã theo dõi.',
          ),
        }),

        mcq({
          prompt: B(
            'A teammate adds <code>package-lock.json</code> to <code>.gitignore</code> "because it is generated anyway, like node_modules". What does the course say happens?',
            'Một đồng nghiệp thêm <code>package-lock.json</code> vào <code>.gitignore</code> "vì nó là file sinh ra thôi, giống node_modules". Theo bài học thì chuyện gì xảy ra?',
          ),
          options: [
            B('Nothing bad — npm regenerates an identical lockfile from package.json on every machine, so committing it is pure duplication', 'Không sao cả — npm sinh lại một lockfile y hệt từ package.json trên mọi máy, nên commit nó chỉ là trùng lặp'),
            B('Git refuses the commit, because a lockfile is one of the paths Git treats as mandatory content in a Node project', 'Git từ chối commit, vì lockfile là một trong những đường dẫn Git coi là nội dung bắt buộc trong một dự án Node'),
            B('Installs stop being reproducible: CI and production resolve different versions than your laptop, which is exactly the "but it works on my machine" bug — ignore <code>node_modules/</code>, COMMIT the lockfile', 'Việc cài đặt hết tái lập được: CI và production phân giải ra phiên bản khác máy bạn, đúng con lỗi "máy tôi chạy được mà" — hãy ignore <code>node_modules/</code>, và COMMIT lockfile'),
            B('Only the deployment breaks; local development is unaffected because a developer machine always has a lockfile left over from an earlier install', 'Chỉ deploy hỏng; phát triển ở máy không bị ảnh hưởng vì máy lập trình viên lúc nào cũng còn lockfile sót lại từ lần cài trước'),
          ],
          correct: 2,
          explanation: EX(
            'The lockfile is not a build artifact — it is the record of which exact versions were resolved, and it is the only thing that makes an install reproducible. Without it a caret range like <code>^4.18.0</code> quietly resolves to different code on different days, and you spend three days on a bug that nobody introduced. The four categories that genuinely never belong in Git are secrets, dependencies, build output and machine noise; a lockfile is none of them.',
            'Lockfile không phải sản phẩm build — nó là bản ghi những phiên bản chính xác đã được phân giải, và là thứ duy nhất làm cho một lần cài đặt tái lập được. Thiếu nó thì một phạm vi dấu mũ như <code>^4.18.0</code> âm thầm ra mã khác nhau vào những ngày khác nhau, và bạn mất ba ngày cho một con lỗi chẳng ai tạo ra. Bốn nhóm thật sự không bao giờ thuộc về Git là bí mật, thư viện phụ thuộc, sản phẩm build và rác của máy; lockfile không thuộc nhóm nào.',
          ),
        }),

        // ── Chương 2 — Đọc lịch sử ──────────────────────────────────────
        mcq({
          prompt: B(
            'A repository has commits by <b>An Nguyen</b> and <b>Binh Tran</b>. Running <code>git log --author=An --oneline</code> listed only An\'s three commits. Why is that result NOT something to rely on?',
            'Một kho có commit của <b>An Nguyen</b> và <b>Binh Tran</b>. Chạy <code>git log --author=An --oneline</code> chỉ ra ba commit của An. Vì sao kết quả đó KHÔNG đáng tin cậy?',
          ),
          options: [
            B('<code>--author</code> matches a SUBSTRING of "Name &lt;email&gt;", so it happened to work here — with a colleague named Tran Van An or a bot, it would over-match; anchor it with the email or a regex such as <code>--author="^Nguyen"</code>', '<code>--author</code> khớp CHUỖI CON của "Tên &lt;email&gt;", nên ở đây nó chỉ tình cờ đúng — có thêm một đồng nghiệp tên Tran Van An hay một con bot là nó khớp thừa; hãy neo bằng email hoặc regex kiểu <code>--author="^Nguyen"</code>'),
            B('<code>--author</code> reads the COMMITTER field, not the author field, so a rebase by someone else silently reassigns every commit to the person who rebased', '<code>--author</code> đọc trường COMMITTER chứ không phải trường author, nên một lần rebase của người khác âm thầm gán lại mọi commit cho người đã rebase'),
            B('<code>--author</code> is case-insensitive, so it also matched every commit whose message happens to contain the letters "an"', '<code>--author</code> không phân biệt hoa thường, nên nó khớp luôn mọi commit có lời nhắn chứa hai chữ cái "an"'),
            B('<code>--author</code> only looks at the most recent 100 commits unless you also pass <code>--all</code>, so older commits by An are missing from the list', '<code>--author</code> chỉ nhìn 100 commit gần nhất trừ khi bạn truyền thêm <code>--all</code>, nên các commit cũ hơn của An bị thiếu trong danh sách'),
          ],
          correct: 0,
          explanation: EX(
            'Measured: with authors <code>An Nguyen</code> and <code>Binh Tran</code>, <code>--author=An</code> returned exactly An\'s commits — "Binh Tran" contains no capital-A "An". Change one name and the answer changes. The filter is a case-sensitive substring match against the whole author field, which is why <code>--author=an</code> in a real repository happily matches "Hoang", "Tran" and "dependabot". Anchor on something unique: <code>--author=an@example.com</code>.',
            'Đã đo: với tác giả <code>An Nguyen</code> và <code>Binh Tran</code>, <code>--author=An</code> trả về đúng các commit của An — chuỗi "Binh Tran" không chứa "An" viết hoa. Đổi một cái tên là kết quả đổi theo. Bộ lọc này khớp chuỗi con có phân biệt hoa thường trên toàn bộ trường tác giả, và đó là lý do <code>--author=an</code> trong kho thật vui vẻ khớp cả "Hoang", "Tran" lẫn "dependabot". Hãy neo vào thứ duy nhất: <code>--author=an@example.com</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'You need a one-line-per-commit report with the short hash, the author and the date. Which format string produces exactly that?' + code(
              "git log --format='???' --date=short\n" +
              'd8352de Binh Tran 2026-03-05\n' +
              'd19f33f Binh Tran 2026-03-04\n' +
              'c0bd858 An Nguyen 2026-03-03',
            ),
            'Bạn cần một báo cáo mỗi commit một dòng, gồm mã băm rút gọn, tác giả và ngày. Chuỗi định dạng nào cho ra đúng thế?' + code(
              "git log --format='???' --date=short\n" +
              'd8352de Binh Tran 2026-03-05\n' +
              'd19f33f Binh Tran 2026-03-04\n' +
              'c0bd858 An Nguyen 2026-03-03',
            ),
          ),
          options: [
            B('<code>%H %author %date</code> — Git accepts the long English names and abbreviates the hash itself when the terminal is narrow', '<code>%H %author %date</code> — Git nhận cả tên tiếng Anh dài và tự rút gọn mã băm khi terminal hẹp'),
            B('<code>$h $an $ad</code> — the placeholders use a dollar sign so that they never collide with a literal percent sign in a message', '<code>$h $an $ad</code> — các ký hiệu dùng dấu đô la để không bao giờ đụng với một dấu phần trăm thật trong lời nhắn'),
            B('<code>{hash} {author} {date}</code> — the same brace syntax that <code>git for-each-ref</code> uses for its own format strings', '<code>{hash} {author} {date}</code> — cùng cú pháp ngoặc nhọn mà <code>git for-each-ref</code> dùng cho chuỗi định dạng của nó'),
            B('<code>%h %an %ad</code> — short hash, author name, author date; <code>%H</code> would give the full 40 characters and <code>%s</code> the subject', '<code>%h %an %ad</code> — mã băm rút gọn, tên tác giả, ngày tác giả; <code>%H</code> cho đủ 40 ký tự và <code>%s</code> cho tiêu đề'),
          ],
          correct: 3,
          explanation: EX(
            'Run verbatim in the scratch repository — the output above is what it printed. The placeholders worth remembering: <code>%h</code>/<code>%H</code> short and full hash, <code>%an</code>/<code>%ae</code> author name and email, <code>%ad</code>/<code>%ar</code> date (formatted by <code>--date=</code>) and relative date, <code>%s</code>/<code>%b</code> subject and body, <code>%d</code> the ref names. This is how you turn <code>git log</code> from something you read into something a script consumes — a changelog, a release note, a report of who touched which area.',
            'Đã chạy nguyên văn trong kho nháp — output ở trên chính là thứ nó in ra. Những ký hiệu đáng nhớ: <code>%h</code>/<code>%H</code> mã băm rút gọn và đầy đủ, <code>%an</code>/<code>%ae</code> tên và email tác giả, <code>%ad</code>/<code>%ar</code> ngày (theo <code>--date=</code>) và ngày tương đối, <code>%s</code>/<code>%b</code> tiêu đề và thân, <code>%d</code> tên các ref. Đây là cách biến <code>git log</code> từ thứ để đọc thành thứ cho script tiêu thụ — một changelog, một ghi chú phát hành, một báo cáo ai đụng vào phần nào.',
          ),
        }),

        mcq({
          prompt: B(
            'Two files were both renamed at some point and you want the full history of both. What happens with this command?' + code(
              'git log --oneline --follow -- src/auth.ts src/feed.ts',
            ),
            'Hai file đều từng bị đổi tên và bạn muốn xem lịch sử đầy đủ của cả hai. Chuyện gì xảy ra với lệnh này?' + code(
              'git log --oneline --follow -- src/auth.ts src/feed.ts',
            ),
          ),
          options: [
            B('It works and merges both histories, sorted by date, which is why <code>--follow</code> is safe to add to any <code>git log</code> invocation', 'Nó chạy được và gộp cả hai lịch sử, sắp theo ngày, và đó là lý do <code>--follow</code> thêm vào lệnh <code>git log</code> nào cũng an toàn'),
            B('<code>--follow</code> only accepts ONE path — that limitation is exactly why it is not the default; run it once per file', '<code>--follow</code> chỉ nhận MỘT đường dẫn — chính hạn chế đó là lý do nó không phải mặc định; hãy chạy riêng cho từng file'),
            B('It silently ignores <code>--follow</code> and behaves like a plain path-filtered log, so you get the short history for both without any warning', 'Nó âm thầm bỏ qua <code>--follow</code> và chạy như một log lọc theo đường dẫn bình thường, nên bạn nhận lịch sử ngắn của cả hai mà không có cảnh báo nào'),
            B('It follows only the first path and treats the second as a commit-ish, so Git errors with "unknown revision"', 'Nó chỉ theo đường dẫn đầu tiên và coi cái thứ hai là một tham chiếu commit, nên Git báo lỗi "unknown revision"'),
          ],
          correct: 1,
          explanation: EX(
            'Rename detection is not a lookup — Git never recorded a rename. A rename is just a new tree naming the same blob differently, so <code>--follow</code> has to run a similarity heuristic backwards through history, one path at a time. The difference is dramatic in practice: on the lesson\'s example, a plain path-filtered log showed 2 commits and <code>--follow</code> showed 5, back to the file\'s real beginning under its old name. Same reason <code>git blame -C</code> exists, and same reason both can occasionally be wrong when a file was renamed AND heavily edited in one commit.',
            'Phát hiện đổi tên không phải một phép tra cứu — Git chưa bao giờ ghi lại một lần đổi tên nào. Đổi tên chỉ là một tree mới gọi cùng cái blob bằng tên khác, nên <code>--follow</code> phải chạy một thuật toán tương đồng ngược dòng lịch sử, mỗi lần một đường dẫn. Khác biệt thực tế thì rõ rệt: trong ví dụ của bài, log lọc đường dẫn thường cho 2 commit, còn <code>--follow</code> cho 5, về tới tận khởi đầu thật của file dưới cái tên cũ. Cũng vì lý do đó mà có <code>git blame -C</code>, và cũng vì lý do đó mà cả hai thỉnh thoảng vẫn sai khi một file vừa bị đổi tên vừa bị sửa nhiều trong cùng một commit.',
          ),
        }),

        mcq({
          prompt: B(
            'What is <code>git shortlog -sn --since="3 months ago"</code> good for, and what is it explicitly NOT good for?' + code(
              '   142  Nguyen Van An\n' +
              '    87  Tran Thi Binh\n' +
              '     12  dependabot[bot]',
            ),
            '<code>git shortlog -sn --since="3 months ago"</code> dùng tốt cho việc gì, và bài học nói rõ nó KHÔNG dùng được cho việc gì?' + code(
              '   142  Nguyen Van An\n' +
              '    87  Tran Thi Binh\n' +
              '     12  dependabot[bot]',
            ),
          ),
          options: [
            B('Good for billing by contribution; not good for release notes, because the counts include merge commits that nobody wrote by hand', 'Tốt cho việc tính tiền theo đóng góp; không tốt cho ghi chú phát hành, vì các con số gồm cả commit hợp nhất chẳng ai gõ tay'),
            B('Good for detecting force-pushes, because a rewritten branch changes the counts; not good for finding who introduced a specific bug', 'Tốt để phát hiện force-push, vì một nhánh bị viết lại làm đổi các con số; không tốt để tìm ai đã tạo ra một con lỗi cụ thể'),
            B('Good for the question "who knows this part of the codebase?" before you ask someone for a review; useless as a productivity metric — a commit is not a unit of value', 'Tốt cho câu hỏi "ai hiểu phần này của kho mã?" trước khi bạn nhờ ai đó review; vô dụng như một thước đo năng suất — một commit không phải một đơn vị giá trị'),
            B('Good for both, as long as you exclude bot accounts first; the numbers are then a fair comparison between people on the same team', 'Tốt cho cả hai, miễn là loại các tài khoản bot ra trước; các con số khi đó là phép so sánh công bằng giữa những người trong cùng một nhóm'),
          ],
          correct: 2,
          explanation: EX(
            'The command is a fast way to find the person who has spent the most time in an area — add <code>-- src/services/auth/</code> and it answers "who should review this?". As a performance number it is meaningless and actively harmful: it rewards many small commits, punishes the person who squashes, counts a typo fix and a week of design work the same, and completely misses review, debugging and the code that got deleted.',
            'Lệnh này là cách nhanh để tìm người đã dành nhiều thời gian nhất cho một mảng — thêm <code>-- src/services/auth/</code> là nó trả lời "nên nhờ ai review?". Còn dùng làm con số đánh giá năng suất thì vô nghĩa và có hại: nó thưởng cho việc chia nhiều commit nhỏ, phạt người biết gộp commit, tính một lần sửa lỗi chính tả ngang một tuần thiết kế, và bỏ qua hoàn toàn việc review, gỡ lỗi và cả phần mã đã bị xoá đi.',
          ),
        }),

        mcq({
          prompt: B(
            'Your repository has a branch named <code>auth</code> and a directory named <code>auth/</code>. What does the <code>--</code> do here, and what happens without it?' + code(
              'git log --oneline -- auth',
            ),
            'Kho của bạn có một nhánh tên <code>auth</code> và một thư mục tên <code>auth/</code>. Dấu <code>--</code> ở đây làm gì, và không có nó thì sao?',
          ),
          options: [
            B('It tells Git that everything after it is a PATH, not a revision; without it <code>auth</code> is ambiguous and Git cannot know whether you meant the branch or the directory', 'Nó nói với Git rằng mọi thứ phía sau là ĐƯỜNG DẪN, không phải một tham chiếu; thiếu nó thì <code>auth</code> nhập nhằng và Git không biết bạn muốn nói nhánh hay thư mục'),
            B('It marks the end of the options list, exactly like in <code>rm -- -file</code>; Git treats a bare name as a path either way, so the result is identical', 'Nó đánh dấu hết danh sách tuỳ chọn, y như trong <code>rm -- -file</code>; Git luôn coi một cái tên trần là đường dẫn nên kết quả vẫn y hệt'),
            B('It asks for a diff against the previous revision of that path, which is why <code>git log --</code> with no path after it prints nothing at all', 'Nó yêu cầu so sánh với phiên bản trước của đường dẫn đó, và vì thế <code>git log --</code> không kèm đường dẫn nào thì không in ra gì'),
            B('It disables rename detection for the paths that follow, so the log stops at the commit where the directory was created', 'Nó tắt phát hiện đổi tên cho các đường dẫn phía sau, nên log dừng lại ở commit tạo ra thư mục đó'),
          ],
          correct: 0,
          explanation: EX(
            'Git\'s command line takes revisions and paths in the same position, so a name that is both is genuinely ambiguous — and when it is, Git errors rather than guess. Typing <code>--</code> costs nothing and removes the whole class of problem, which is why every path filter in the lesson is written <code>git log --oneline -- src/services/auth/</code>. The same separator matters for <code>git diff</code>, <code>git checkout</code> and <code>git restore</code>, where guessing wrong is a lot more expensive than a wrong log.',
            'Dòng lệnh của Git nhận cả tham chiếu lẫn đường dẫn ở cùng vị trí, nên một cái tên vừa là nhánh vừa là thư mục thì thật sự nhập nhằng — và khi nhập nhằng, Git báo lỗi chứ không đoán. Gõ <code>--</code> chẳng tốn gì mà xoá sạch cả một nhóm vấn đề, nên mọi bộ lọc đường dẫn trong bài đều viết là <code>git log --oneline -- src/services/auth/</code>. Cũng dấu ngăn đó quan trọng với <code>git diff</code>, <code>git checkout</code> và <code>git restore</code>, nơi đoán sai đắt hơn nhiều so với một cái log sai.',
          ),
        }),

        mcq({
          prompt: B(
            'A bisect session finished and printed the guilty commit. You go back to work and notice that <code>git branch</code> now says <code>* (HEAD detached at 7b3e9d1)</code>. What happened, and what is the fix?',
            'Một phiên bisect vừa kết thúc và in ra commit thủ phạm. Bạn quay lại làm việc và thấy <code>git branch</code> giờ ghi <code>* (HEAD detached at 7b3e9d1)</code>. Chuyện gì đã xảy ra, và sửa thế nào?',
          ),
          options: [
            B('The bisect corrupted HEAD; recover it with <code>git symbolic-ref HEAD refs/heads/main</code> written by hand', 'Bisect đã làm hỏng HEAD; khôi phục bằng cách tự viết <code>git symbolic-ref HEAD refs/heads/main</code>'),
            B('The first bad commit is automatically checked out and becomes your new branch tip; run <code>git switch -c fix/…</code> to give it a name', 'Commit hỏng đầu tiên tự động được checkout và trở thành đầu nhánh mới của bạn; chạy <code>git switch -c fix/…</code> để đặt tên cho nó'),
            B('Nothing is wrong: detached HEAD after a bisect is permanent by design, and committing from there is the intended way to write the fix', 'Không sai gì cả: HEAD lìa cành sau bisect là trạng thái cố ý và vĩnh viễn, commit từ đó chính là cách viết bản vá đúng ý đồ'),
            B('Bisect deliberately parks you on a detached HEAD while it searches, and you forgot <code>git bisect reset</code> — that command is always safe and returns you to the branch you started on', 'Bisect cố tình đặt bạn ở HEAD lìa cành trong lúc tìm, và bạn quên <code>git bisect reset</code> — lệnh đó lúc nào cũng an toàn và đưa bạn về đúng nhánh lúc bắt đầu'),
          ],
          correct: 3,
          explanation: EX(
            'Bisect works by checking out candidate commits, so a detached HEAD is the normal working state of the search, not a fault. <code>git bisect reset</code> ends the session and restores the original branch; run it even when you are not sure whether a session is open. Measured in the scratch repository: a run over 31 commits reported <i>"Bisecting: 14 revisions left to test after this (roughly 4 steps)"</i> at the first step and named the first bad commit four tests later.',
            'Bisect làm việc bằng cách checkout các commit ứng viên, nên HEAD lìa cành là trạng thái làm việc bình thường của cuộc tìm chứ không phải sự cố. <code>git bisect reset</code> kết thúc phiên và trả bạn về nhánh ban đầu; cứ chạy nó kể cả khi bạn không chắc có phiên nào đang mở. Đo trong kho nháp: một lượt trên 31 commit báo <i>"Bisecting: 14 revisions left to test after this (roughly 4 steps)"</i> ở bước đầu và gọi tên commit hỏng đầu tiên sau bốn lần kiểm.',
          ),
        }),

        // ── Chương 3 — Nhánh & hợp nhất ─────────────────────────────────
        mcq({
          prompt: B(
            'Branch <code>feat</code> has two commits that <code>main</code> does not have. You try to delete it:' + code(
              '$ git branch -d feat\n' +
              "error: the branch 'feat' is not fully merged\n" +
              "hint: If you are sure you want to delete it, run 'git branch -D feat'",
            ) + 'What exactly is Git checking, and what is <code>-D</code>?',
            'Nhánh <code>feat</code> có hai commit mà <code>main</code> chưa có. Bạn thử xoá nó:' + code(
              '$ git branch -d feat\n' +
              "error: the branch 'feat' is not fully merged\n" +
              "hint: If you are sure you want to delete it, run 'git branch -D feat'",
            ) + 'Git đang kiểm chính xác điều gì, và <code>-D</code> là gì?',
          ),
          options: [
            B('It is checking whether the branch was pushed; <code>-D</code> deletes it locally and on <code>origin</code> at the same time so the two stay in sync', 'Nó kiểm nhánh đã được push chưa; <code>-D</code> xoá nó ở cục bộ và trên <code>origin</code> cùng lúc để hai bên đồng bộ'),
            B('It is checking whether the tip of <code>feat</code> is reachable from the current branch; <code>-D</code> forces the deletion, and the commits survive in the reflog for at least 30 days', 'Nó kiểm đầu nhánh <code>feat</code> có với tới được từ nhánh hiện tại không; <code>-D</code> ép xoá, và các commit vẫn sống trong reflog ít nhất 30 ngày'),
            B('It is checking for uncommitted changes in the working directory; <code>-D</code> deletes the branch and discards those changes as well', 'Nó kiểm có thay đổi chưa commit trong thư mục làm việc không; <code>-D</code> xoá nhánh và vứt luôn cả những thay đổi đó'),
            B('It is checking whether a pull request is open for the branch; <code>-D</code> deletes it anyway and closes the pull request', 'Nó kiểm có pull request nào đang mở cho nhánh đó không; <code>-D</code> vẫn xoá và đóng luôn pull request'),
          ],
          correct: 1,
          explanation: EX(
            'Copied verbatim from git 2.51.1 — note that the wording is lowercase and has no trailing full stop, unlike the version most documentation quotes. <code>-d</code> refuses when the branch holds commits that are not reachable from where you are standing, which is the whole safety value of the flag; use it as the default. <code>-D</code> is the override, and even then the commits are not gone: deleting a branch deletes a 41-byte file, and <code>git reflog</code> still names the tip. Measured in the same repository: after a merge, <code>git branch -d feat</code> succeeded with <code>Deleted branch feat (was 5b1e8fe).</code>',
            'Chép nguyên văn từ git 2.51.1 — để ý chữ thường và không có dấu chấm cuối, khác với bản mà đa số tài liệu trích. <code>-d</code> từ chối khi nhánh còn giữ những commit không với tới được từ chỗ bạn đang đứng, và đó là toàn bộ giá trị an toàn của cái cờ này; hãy dùng nó làm mặc định. <code>-D</code> là cách ghi đè, và kể cả thế thì các commit cũng chưa mất: xoá một nhánh là xoá một file 41 byte, và <code>git reflog</code> vẫn còn gọi tên cái đầu nhánh ấy. Đo trong cùng kho đó: sau khi merge, <code>git branch -d feat</code> thành công với <code>Deleted branch feat (was 5b1e8fe).</code>',
          ),
        }),

        mcq({
          prompt: B(
            'Branch <code>feat</code> has 2 commits on top of <code>main</code>, and <code>main</code> has moved nowhere. You run <code>git merge --no-ff feat</code> and Git answers:' + code(
              "Merge made by the 'ort' strategy.\n" +
              ' b.txt | 1 +\n' +
              ' c.txt | 1 +\n' +
              ' 2 files changed, 2 insertions(+)',
            ) + 'What does <code>git rev-list --count HEAD</code> print afterwards, and what did <code>--no-ff</code> buy you?',
            'Nhánh <code>feat</code> có 2 commit nằm trên <code>main</code>, còn <code>main</code> không đi đâu cả. Bạn chạy <code>git merge --no-ff feat</code> và Git trả lời:' + code(
              "Merge made by the 'ort' strategy.\n" +
              ' b.txt | 1 +\n' +
              ' c.txt | 1 +\n' +
              ' 2 files changed, 2 insertions(+)',
            ) + 'Sau đó <code>git rev-list --count HEAD</code> in ra bao nhiêu, và <code>--no-ff</code> mang lại điều gì?',
          ),
          options: [
            B('3 — <code>--no-ff</code> replays the branch commits instead of joining them, so the count is unchanged and only the hashes differ', '3 — <code>--no-ff</code> phát lại các commit của nhánh thay vì nhập chúng vào, nên số lượng không đổi mà chỉ mã băm khác'),
            B('3 — <code>--no-ff</code> squashes the two branch commits into one and adds it on top, which is what the GitHub button of the same name does', '3 — <code>--no-ff</code> gộp hai commit của nhánh thành một rồi thêm lên trên, đúng như cái nút cùng tên trên GitHub'),
            B('4 — <code>--no-ff</code> forces a merge commit even though a fast-forward was possible, so the branch stays visible in the graph and <code>revert -m 1</code> can undo the whole feature at once', '4 — <code>--no-ff</code> ép tạo commit hợp nhất dù hoàn toàn fast-forward được, nên cái nhánh vẫn hiện ra trong đồ thị và <code>revert -m 1</code> hoàn tác được cả tính năng bằng một lệnh'),
            B('4 — <code>--no-ff</code> is required whenever the branches have diverged; on a branch that could fast-forward the flag is silently ignored', '4 — <code>--no-ff</code> là bắt buộc khi hai nhánh đã phân ly; với nhánh có thể fast-forward thì cờ này bị bỏ qua trong im lặng'),
          ],
          correct: 2,
          explanation: EX(
            'Measured: 1 base commit + 2 branch commits + 1 merge commit = 4, and <code>git log --oneline --graph</code> showed the fork and the join. Without the flag Git would have slid the pointer forward, created no commit at all, and afterwards nothing would show that a branch had ever existed. Note the strategy name: <code>ort</code> has been the default since Git 2.34 — older books and blog posts say <code>recursive</code>, which is the previous implementation, not a different result.',
            'Đã đo: 1 commit gốc + 2 commit của nhánh + 1 commit hợp nhất = 4, và <code>git log --oneline --graph</code> hiện rõ chỗ rẽ và chỗ nhập lại. Không có cờ đó thì Git chỉ trượt con trỏ lên, không tạo commit nào, và về sau chẳng còn gì cho thấy từng có một cái nhánh. Để ý tên chiến lược: <code>ort</code> là mặc định từ Git 2.34 — sách vở và bài blog cũ ghi <code>recursive</code>, đó là bản cài đặt trước đó chứ không phải một kết quả khác.',
          ),
        }),

        mcq({
          prompt: B(
            'A merge conflict left <code>src/config.ts</code> with markers, and you have decided that YOUR version is simply correct. Which sequence resolves it?',
            'Một xung đột hợp nhất để lại ký hiệu trong <code>src/config.ts</code>, và bạn đã quyết định rằng phiên bản CỦA BẠN đơn giản là đúng. Chuỗi lệnh nào giải quyết được?',
          ),
          options: [
            B('<code>git checkout --ours src/config.ts</code> then <code>git add src/config.ts</code> — <code>--ours</code> takes your side whole, and the <code>add</code> is what marks the path resolved', '<code>git checkout --ours src/config.ts</code> rồi <code>git add src/config.ts</code> — <code>--ours</code> lấy nguyên phía của bạn, còn <code>add</code> mới là thứ đánh dấu đường dẫn đã giải quyết'),
            B('<code>git merge --abort</code> then <code>git merge --strategy=ours feat</code> — the only way to keep your side of a single file', '<code>git merge --abort</code> rồi <code>git merge --strategy=ours feat</code> — cách duy nhất để giữ phía của bạn cho một file'),
            B('<code>git restore --ours src/config.ts</code> then <code>git commit</code> — <code>add</code> is unnecessary because a conflicted path is staged automatically once it stops containing markers', '<code>git restore --ours src/config.ts</code> rồi <code>git commit</code> — khỏi cần <code>add</code> vì một đường dẫn đang xung đột tự được staging ngay khi nó hết ký hiệu'),
            B('<code>git reset --hard HEAD</code> then re-run the merge with <code>-X ours</code>, which is the documented way to resolve one file in your favour', '<code>git reset --hard HEAD</code> rồi chạy lại merge với <code>-X ours</code>, đó là cách được ghi trong tài liệu để giải một file theo ý bạn'),
          ],
          correct: 0,
          explanation: EX(
            'While a merge is unresolved, Git keeps three versions of the path in the index at stages 1, 2 and 3 (base, ours, theirs) — visible with <code>git ls-files -u</code>, which in the scratch repository listed exactly three lines for the conflicted file. <code>--ours</code>/<code>--theirs</code> pull one of those stages into the working file. Nothing marks a conflict resolved except <code>git add</code>; that is why <code>git status</code> says <i>"use \'git add &lt;file&gt;...\' to mark resolution"</i>. And the labels only mean "ours" relative to the operation — in a rebase they are inverted. Careful: this is the whole-file escape hatch, and most conflicts genuinely want a third answer that is neither side.',
            'Trong lúc một lần merge chưa được giải, Git giữ ba phiên bản của đường dẫn đó trong index ở giai đoạn 1, 2 và 3 (gốc, của ta, của họ) — nhìn thấy bằng <code>git ls-files -u</code>, mà trong kho nháp liệt kê đúng ba dòng cho file đang xung đột. <code>--ours</code>/<code>--theirs</code> kéo một trong ba giai đoạn đó ra file làm việc. Không gì đánh dấu một xung đột là đã giải ngoài <code>git add</code>; vì thế <code>git status</code> mới ghi <i>"use \'git add &lt;file&gt;...\' to mark resolution"</i>. Và hai cái nhãn chỉ mang nghĩa "của ta" tương đối với thao tác đang chạy — trong rebase chúng bị đảo. Lưu ý: đây là cửa thoát cho cả file, còn phần lớn xung đột thật ra cần một câu trả lời thứ ba, không thuộc bên nào.',
          ),
        }),

        mcq({
          prompt: B(
            'Not every conflict is two versions of the same lines. Which set of conflict types does the course list as the ones that do NOT have content markers to edit?',
            'Không phải xung đột nào cũng là hai phiên bản của cùng vài dòng. Bài học liệt kê nhóm xung đột nào là những loại KHÔNG có ký hiệu nội dung để sửa?',
          ),
          options: [
            B('whitespace, encoding, line-ending and permission conflicts — all four are settled by <code>git config</code> rather than by editing anything', 'xung đột khoảng trắng, bảng mã, ký tự xuống dòng và quyền — cả bốn đều được xử lý bằng <code>git config</code> chứ không phải sửa gì'),
            B('branch/branch, tag/tag, remote/remote and stash/stash — conflicts between two refs that name the same thing', 'nhánh/nhánh, tag/tag, remote/remote và stash/stash — xung đột giữa hai ref cùng gọi tên một thứ'),
            B('index/HEAD, index/worktree, HEAD/worktree and detached/attached — the four pairwise disagreements between the three trees', 'index/HEAD, index/cây làm việc, HEAD/cây làm việc và lìa cành/gắn cành — bốn cặp bất đồng giữa ba cái cây'),
            B('modify/delete, rename/rename, add/add and binary — you settle these by choosing a whole file (<code>git rm</code>, <code>git add</code>, or <code>--ours</code>/<code>--theirs</code>), not by editing markers', 'modify/delete, rename/rename, add/add và nhị phân — bạn giải chúng bằng cách chọn nguyên một file (<code>git rm</code>, <code>git add</code>, hoặc <code>--ours</code>/<code>--theirs</code>), không phải bằng cách sửa ký hiệu'),
          ],
          correct: 3,
          explanation: EX(
            'A modify/delete conflict is Git asking a real question — one side thought the file should still exist and the other deleted it, and only a human knows which is right. rename/rename means both sides moved the same file to different names: pick one, remove the other, and move the content across. add/add is two people creating the same path independently. A binary file cannot be merged line by line at all, so the answer is always a whole file. Knowing these four stops the panic when <code>git status</code> shows a conflicted path that contains no <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> anywhere.',
            'Xung đột modify/delete là Git đang hỏi một câu thật — một bên cho rằng file vẫn nên tồn tại, bên kia đã xoá nó, và chỉ con người mới biết bên nào đúng. rename/rename nghĩa là cả hai bên đổi tên cùng một file thành hai tên khác: chọn một, xoá cái kia, chuyển nội dung sang. add/add là hai người cùng tạo một đường dẫn một cách độc lập. File nhị phân thì không hợp nhất theo dòng được, nên câu trả lời luôn là nguyên một file. Biết bốn loại này là hết hoảng khi <code>git status</code> báo một đường dẫn xung đột mà mở ra chẳng thấy <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> ở đâu.',
          ),
        }),

        mcq({
          prompt: B(
            'Commit A is the fork point. <code>topic</code> added B on top of A; <code>main</code> then added C on top of A. What does <code>git merge-base main topic</code> print, and why does a three-way merge need it?',
            'Commit A là điểm rẽ nhánh. <code>topic</code> thêm B lên trên A; sau đó <code>main</code> thêm C lên trên A. <code>git merge-base main topic</code> in ra cái gì, và vì sao hợp nhất ba chiều cần tới nó?',
          ),
          options: [
            B('It prints C, the tip of the current branch, and the merge needs it to decide which side keeps its hashes after the merge commit is written', 'Nó in ra C, đầu nhánh hiện tại, và merge cần nó để quyết định bên nào giữ được mã băm sau khi commit hợp nhất được ghi'),
            B('It prints A, the common ancestor — knowing it is what lets Git tell "you ADDED this line" apart from "they DELETED it", which a two-way comparison cannot', 'Nó in ra A, tổ tiên chung — biết được nó mới cho phép Git phân biệt "bạn THÊM dòng này" với "họ XOÁ nó", điều mà phép so hai chiều không làm được'),
            B('It prints nothing on a diverged history and only works before the branches have both moved, which is why you run it right after branching', 'Nó không in gì trên một lịch sử đã phân ly và chỉ chạy được trước khi cả hai nhánh cùng di chuyển, nên bạn phải chạy nó ngay sau khi rẽ nhánh'),
            B('It prints both B and C, the two tips, because a merge base is by definition the pair of commits being joined together', 'Nó in ra cả B và C, hai đầu nhánh, vì theo định nghĩa merge base là cặp commit đang được nhập vào nhau'),
          ],
          correct: 1,
          explanation: EX(
            'Verified against real Git on a purpose-built graph: <code>git merge-base -a</code> returned the fork point in every ordinary case. The "three" in three-way merge is the two tips plus that base. With only the two tips, a line that exists on one side and not the other is ambiguous — added or removed? With the base, Git knows. That is also why <code>git diff main...feature</code> (three dots) is the diff a pull request shows: it compares against the merge base, not against wherever <code>main</code> happens to be today. A criss-cross history can even have TWO merge bases; <code>git merge-base -a</code> lists them all.',
            'Đã kiểm với Git thật trên một đồ thị dựng riêng: <code>git merge-base -a</code> trả về đúng điểm rẽ nhánh trong mọi ca thông thường. Chữ "ba" trong hợp nhất ba chiều là hai đầu nhánh cộng cái gốc đó. Chỉ có hai đầu nhánh thì một dòng có ở bên này mà không có ở bên kia là nhập nhằng — được thêm vào hay bị xoá đi? Có cái gốc thì Git biết. Đó cũng là lý do <code>git diff main...feature</code> (ba chấm) mới là bản diff mà một pull request hiện ra: nó so với merge base chứ không so với chỗ <code>main</code> đang đứng hôm nay. Một lịch sử đan chéo thậm chí có thể có HAI merge base; <code>git merge-base -a</code> liệt kê hết.',
          ),
        }),

        mcq({
          prompt: B(
            'Commit <code>3f6643a</code> ("B feature") exists on branch <code>topic</code>. From <code>main</code> you run <code>git cherry-pick 3f6643a</code> and Git answers <code>[main 8fa9e5e] B feature</code>. What is the state of the two commits now?',
            'Commit <code>3f6643a</code> ("B feature") nằm trên nhánh <code>topic</code>. Từ <code>main</code> bạn chạy <code>git cherry-pick 3f6643a</code> và Git trả lời <code>[main 8fa9e5e] B feature</code>. Trạng thái hai commit đó bây giờ ra sao?',
          ),
          options: [
            B('The commit was moved: <code>3f6643a</code> no longer exists and <code>topic</code> now points at its parent', 'Commit đã bị dời đi: <code>3f6643a</code> không còn tồn tại và <code>topic</code> giờ trỏ vào commit cha của nó'),
            B('Both hashes name the same object; Git reused it because the content is identical, and the two branches now share that commit', 'Hai mã băm cùng gọi tên một đối tượng; Git dùng lại nó vì nội dung y hệt, và giờ hai nhánh dùng chung commit đó'),
            B('There are now two commits with the same change, the same message and the same author but DIFFERENT hashes — the original is untouched on <code>topic</code>', 'Giờ có hai commit cùng thay đổi, cùng lời nhắn, cùng tác giả nhưng KHÁC mã băm — bản gốc vẫn nguyên vẹn trên <code>topic</code>'),
            B('Git created a merge commit on <code>main</code> with <code>topic</code> as its second parent, which is what makes the change traceable back', 'Git đã tạo một commit hợp nhất trên <code>main</code> với <code>topic</code> là cha thứ hai, và đó là cái làm cho thay đổi truy ngược lại được'),
          ],
          correct: 2,
          explanation: EX(
            'Measured: after the cherry-pick, <code>git log --oneline --all --graph</code> showed <code>8fa9e5e B feature</code> on <code>main</code> and <code>3f6643a B feature</code> still on <code>topic</code>, and <code>git cat-file -t 3f6643a</code> still answered <code>commit</code>. A commit\'s hash covers its parent, so the same change on a different parent is necessarily a different commit. That is the whole cost model of cherry-pick, and the reason for <code>-x</code>, which writes "(cherry picked from commit …)" into the new message — without it there is no way at all to find the pair later. Cherry-pick in ONE direction (main to a release branch); it is not a substitute for merging.',
            'Đã đo: sau lệnh cherry-pick, <code>git log --oneline --all --graph</code> hiện <code>8fa9e5e B feature</code> trên <code>main</code> và <code>3f6643a B feature</code> vẫn còn trên <code>topic</code>, và <code>git cat-file -t 3f6643a</code> vẫn trả lời <code>commit</code>. Mã băm của một commit có bao gồm cả cha nó, nên cùng một thay đổi đặt trên một cha khác thì tất yếu là một commit khác. Đó là toàn bộ mô hình chi phí của cherry-pick, và là lý do có cờ <code>-x</code> — nó ghi "(cherry picked from commit …)" vào lời nhắn mới; không có nó thì về sau không cách nào tìm lại được cặp đó. Hãy cherry-pick theo MỘT chiều (từ main sang nhánh phát hành); nó không thay thế được việc merge.',
          ),
        }),

        mcq({
          prompt: B(
            'Branch <code>feature/child</code> was created on top of <code>feature/base</code>, which you now want to abandon. What does this command do?' + code(
              'git rebase --onto main feature/base feature/child',
            ),
            'Nhánh <code>feature/child</code> được tạo trên nền <code>feature/base</code>, và giờ bạn muốn bỏ <code>feature/base</code>. Lệnh này làm gì?' + code(
              'git rebase --onto main feature/base feature/child',
            ),
          ),
          options: [
            B('It replays the commits in the range <code>feature/base..feature/child</code> onto <code>main</code>, so the child branch keeps its own commits and loses the base branch underneath it', 'Nó phát lại các commit trong khoảng <code>feature/base..feature/child</code> lên trên <code>main</code>, nên nhánh con giữ commit của chính nó và mất phần nền bên dưới'),
            B('It replays <code>main</code> onto <code>feature/base</code> and then merges the result into <code>feature/child</code>, which is why three names are needed', 'Nó phát lại <code>main</code> lên trên <code>feature/base</code> rồi merge kết quả vào <code>feature/child</code>, và đó là lý do phải có ba cái tên'),
            B('It renames <code>feature/base</code> to <code>main</code> and moves <code>feature/child</code> along with it, leaving the commits untouched', 'Nó đổi tên <code>feature/base</code> thành <code>main</code> và kéo <code>feature/child</code> theo, giữ nguyên các commit'),
            B('It rebases all three branches onto their common ancestor so that the whole stack becomes linear in one operation', 'Nó rebase cả ba nhánh lên tổ tiên chung của chúng để toàn bộ chồng nhánh thành tuyến tính trong một thao tác'),
          ],
          correct: 0,
          explanation: EX(
            'Read the three arguments as <b>onto · upstream · branch</b>: "take the commits that <code>feature/child</code> has but <code>feature/base</code> does not, and replay them on top of <code>main</code>". It is the tool for the stacked-branch situation — your base branch got rejected, or was squash-merged so its commits no longer exist on main by hash, and a plain <code>git rebase main</code> would try to replay the base commits too. As with every rebase, the replayed commits are new objects with new hashes, so the golden rule applies in full.',
            'Đọc ba tham số là <b>onto · upstream · branch</b>: "lấy những commit mà <code>feature/child</code> có còn <code>feature/base</code> không có, rồi phát lại lên trên <code>main</code>". Nó là công cụ cho tình huống nhánh chồng nhánh — nhánh nền của bạn bị từ chối, hoặc bị squash-merge nên commit của nó không còn tồn tại trên main theo mã băm, và một lệnh <code>git rebase main</code> trần sẽ cố phát lại cả các commit của nhánh nền. Như mọi lần rebase, các commit được phát lại là đối tượng mới với mã băm mới, nên luật vàng áp dụng đầy đủ.',
          ),
        }),

        // ── Chương 4 — Hoàn tác ─────────────────────────────────────────
        mcq({
          prompt: B(
            'A file went through three versions. Then one command was run:' + code(
              '$ echo v1 > a.txt && git add . && git commit -m A\n' +
              '$ echo v2 > a.txt && git add a.txt      # v2 is now in the index\n' +
              '$ echo v3 > a.txt                       # v3 is in the working directory\n' +
              '$ git restore a.txt\n' +
              '$ cat a.txt\n' +
              '???',
            ) + 'What does <code>cat</code> print?',
            'Một file đi qua ba phiên bản. Rồi một lệnh được chạy:' + code(
              '$ echo v1 > a.txt && git add . && git commit -m A\n' +
              '$ echo v2 > a.txt && git add a.txt      # v2 giờ nằm trong index\n' +
              '$ echo v3 > a.txt                       # v3 nằm trong thư mục làm việc\n' +
              '$ git restore a.txt\n' +
              '$ cat a.txt\n' +
              '???',
            ),
          ),
          options: [
            B('<code>v1</code> — <code>git restore</code> always restores from the last commit, which is what makes it the dangerous member of the undo family', '<code>v1</code> — <code>git restore</code> luôn khôi phục từ commit gần nhất, và đó là điều làm nó thành thành viên nguy hiểm của họ lệnh hoàn tác'),
            B('<code>v3</code> — with no flags <code>restore</code> is a no-op on a file that has staged changes, and it prints a warning telling you to unstage first', '<code>v3</code> — không có cờ nào thì <code>restore</code> không làm gì với file đang có thay đổi được staging, và nó in cảnh báo bảo bạn gỡ staging trước'),
            B('Nothing — the file is deleted, because restoring a path that differs in both the index and the working directory is ambiguous and Git removes it', 'Không gì cả — file bị xoá, vì khôi phục một đường dẫn khác nhau ở cả index lẫn thư mục làm việc là nhập nhằng nên Git gỡ nó đi'),
            B('<code>v2</code> — <code>git restore &lt;file&gt;</code> copies from the INDEX, not from HEAD; <code>--source=HEAD</code> is what reaches back to the commit', '<code>v2</code> — <code>git restore &lt;file&gt;</code> chép từ INDEX chứ không phải từ HEAD; muốn với tới commit thì phải <code>--source=HEAD</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Run exactly as written: <code>cat a.txt</code> printed <code>v2</code>, and <code>git status --short</code> then showed <code>M&nbsp;&nbsp;a.txt</code> — still staged, because only the working directory was touched. Adding <code>--source=HEAD</code> gave <code>v1</code> and left the status at <code>MM</code>, since the index still held v2. The undo map in one line: <code>restore &lt;file&gt;</code> is working directory ← index; <code>restore --staged &lt;file&gt;</code> is index ← HEAD. Run them in that order and you land on HEAD; run <code>--staged</code> first and the plain <code>restore</code> then pulls HEAD\'s content out of the index instead. And v3 is gone for good — uncommitted content is the one thing Git genuinely cannot bring back.',
            'Chạy đúng như viết: <code>cat a.txt</code> in ra <code>v2</code>, và <code>git status --short</code> khi đó hiện <code>M&nbsp;&nbsp;a.txt</code> — vẫn còn staging, vì chỉ thư mục làm việc bị đụng tới. Thêm <code>--source=HEAD</code> thì ra <code>v1</code> và trạng thái thành <code>MM</code>, vì index vẫn giữ v2. Bản đồ hoàn tác gói trong một dòng: <code>restore &lt;file&gt;</code> là thư mục làm việc ← index; <code>restore --staged &lt;file&gt;</code> là index ← HEAD. Chạy theo thứ tự đó thì bạn về tới HEAD; chạy <code>--staged</code> trước thì lệnh <code>restore</code> trần sau đó kéo nội dung của HEAD từ index ra. Còn v3 thì mất hẳn — nội dung chưa commit là thứ duy nhất Git thật sự không mang về được.',
          ),
        }),

        mcq({
          prompt: B(
            'What is the difference between these two commands?' + code(
              'git reset --mixed HEAD~1\n' +
              'git reset HEAD~1 -- src/app.ts',
            ),
            'Hai lệnh sau khác nhau thế nào?' + code(
              'git reset --mixed HEAD~1\n' +
              'git reset HEAD~1 -- src/app.ts',
            ),
          ),
          options: [
            B('They are identical except that the second only prints output for one file; both move the branch pointer back one commit', 'Chúng y hệt nhau, chỉ khác là cái thứ hai chỉ in output cho một file; cả hai đều dời con trỏ nhánh lùi một commit'),
            B('The first moves the branch AND resets the index; the second, because it names a path, NEVER moves the branch — it only stages that one file as it was in <code>HEAD~1</code>', 'Cái đầu dời nhánh VÀ đặt lại index; cái thứ hai, vì có gọi tên một đường dẫn, KHÔNG BAO GIỜ dời nhánh — nó chỉ staging đúng file đó đúng như nó có ở <code>HEAD~1</code>'),
            B('The first is safe and the second is destructive, because naming a path implies <code>--hard</code> for that path only', 'Cái đầu an toàn còn cái sau phá huỷ, vì gọi tên một đường dẫn là ngầm định <code>--hard</code> cho riêng đường dẫn đó'),
            B('The second is rejected: <code>git reset</code> does not accept a pathspec, which is what <code>git restore</code> was introduced for', 'Cái thứ hai bị từ chối: <code>git reset</code> không nhận pathspec, và đó chính là lý do <code>git restore</code> ra đời'),
          ],
          correct: 1,
          explanation: EX(
            'Two very different commands sharing one name. Without a path, <code>reset</code> always moves the current branch first and the flag decides how far the change spreads: <code>--soft</code> branch only, <code>--mixed</code> branch + index, <code>--hard</code> all three trees. With a path it does not touch the branch at all — it copies that path from the named commit into the index, which is how you stage a file exactly as it was in the past and then commit the restoration. Note there is deliberately no <code>--hard</code> with a pathspec; the per-file destructive operation is <code>git restore</code>.',
            'Hai lệnh rất khác nhau dùng chung một cái tên. Không có đường dẫn thì <code>reset</code> luôn dời con trỏ nhánh trước, còn cái cờ quyết định thay đổi lan xuống bao xa: <code>--soft</code> chỉ nhánh, <code>--mixed</code> nhánh + index, <code>--hard</code> cả ba cây. Có đường dẫn thì nó hoàn toàn không đụng tới nhánh — nó chép đường dẫn đó từ commit được gọi tên vào index, và đó là cách bạn staging một file đúng như nó từng có trong quá khứ rồi commit lại bản khôi phục. Để ý là Git cố tình không cho <code>--hard</code> đi kèm pathspec; thao tác phá huỷ theo từng file là <code>git restore</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'You have two untracked files, <code>debug.log</code> and <code>scratch/</code>, plus some modified tracked files. You run <code>git reset --hard HEAD</code>. What is left?',
            'Bạn có hai file chưa theo dõi, <code>debug.log</code> và <code>scratch/</code>, cộng với vài file được theo dõi đã bị sửa. Bạn chạy <code>git reset --hard HEAD</code>. Còn lại gì?',
          ),
          options: [
            B('Nothing — <code>--hard</code> makes the working directory identical to HEAD, which by definition means removing anything HEAD does not contain', 'Không còn gì — <code>--hard</code> làm thư mục làm việc giống hệt HEAD, mà theo định nghĩa nghĩa là gỡ bỏ mọi thứ HEAD không có'),
            B('Everything — <code>--hard</code> with no commit argument is a no-op, so both the modifications and the untracked files survive', 'Còn nguyên tất cả — <code>--hard</code> không kèm tham số commit là lệnh không làm gì, nên cả sửa đổi lẫn file chưa theo dõi đều sống sót'),
            B('The untracked files survive: <code>git status --short</code> still shows <code>?? debug.log</code> and <code>?? scratch/</code>; <code>--hard</code> only resets TRACKED files, and removing the rest is <code>git clean</code>', 'File chưa theo dõi sống sót: <code>git status --short</code> vẫn hiện <code>?? debug.log</code> và <code>?? scratch/</code>; <code>--hard</code> chỉ đặt lại file ĐƯỢC THEO DÕI, còn dọn phần kia là việc của <code>git clean</code>'),
            B('The files survive but the directory does not, because Git can only leave individual untracked files in place, never untracked directories', 'File thì còn nhưng thư mục thì không, vì Git chỉ giữ lại được file chưa theo dõi lẻ chứ không giữ được thư mục chưa theo dõi'),
          ],
          correct: 2,
          explanation: EX(
            'This is the pairing that surprises people in both directions. <code>reset --hard</code> is the destructive command for tracked content and it says nothing about the rest, so a "clean slate" is really two commands. <code>git clean</code> handles the other half in four escalating steps: <code>-n</code> dry run (always run this first), <code>-f</code> files, <code>-fd</code> also directories, <code>-fdx</code> also ignored files — and that last one takes your <code>.env</code>, your local database and <code>node_modules</code> with it. There is no undo for any of it, because those files were never in Git.',
            'Đây là cặp lệnh làm người ta bất ngờ theo cả hai chiều. <code>reset --hard</code> là lệnh phá huỷ dành cho nội dung được theo dõi và nó không nói gì về phần còn lại, nên muốn "sạch bong" thì thật ra cần hai lệnh. <code>git clean</code> lo nửa kia theo bốn mức tăng dần: <code>-n</code> chạy thử (luôn chạy cái này trước), <code>-f</code> xoá file, <code>-fd</code> xoá cả thư mục, <code>-fdx</code> xoá cả file bị ignore — và cái cuối cùng mang theo cả <code>.env</code>, database cục bộ lẫn <code>node_modules</code> của bạn. Không có hoàn tác nào cho tất cả những thứ đó, vì chúng chưa bao giờ nằm trong Git.',
          ),
        }),

        mcq({
          prompt: B(
            'You want to undo the last three commits on a SHARED branch. Which is correct about <code>git revert HEAD~3..HEAD</code>?',
            'Bạn muốn hoàn tác ba commit cuối trên một nhánh DÙNG CHUNG. Điều nào ĐÚNG về <code>git revert HEAD~3..HEAD</code>?',
          ),
          options: [
            B('Git applies the inverses newest-first and creates one revert commit per commit; <code>--no-commit</code> stages all the inverses so you can finish with a single commit', 'Git áp các nghịch đảo theo thứ tự mới-nhất-trước và tạo một commit revert cho MỖI commit; <code>--no-commit</code> staging hết các nghịch đảo để bạn kết thúc bằng một commit duy nhất'),
            B('Git applies the inverses oldest-first, which is why a range revert conflicts far more often than reverting the three hashes by hand', 'Git áp các nghịch đảo theo thứ tự cũ-nhất-trước, và vì thế revert theo khoảng hay xung đột hơn hẳn so với tự revert ba mã băm bằng tay'),
            B('Git creates exactly one commit for the whole range, which is why <code>--no-commit</code> exists only for reverting a merge', 'Git tạo đúng một commit cho cả khoảng, và vì thế <code>--no-commit</code> chỉ tồn tại để phục vụ việc revert một commit hợp nhất'),
            B('Git refuses ranges entirely: <code>revert</code> takes a single commit, and a range must be undone with <code>git reset --hard</code> followed by a force-push', 'Git từ chối hẳn dạng khoảng: <code>revert</code> chỉ nhận một commit, và muốn hoàn tác cả khoảng thì phải <code>git reset --hard</code> rồi force-push'),
          ],
          correct: 0,
          explanation: EX(
            'Order matters because each inverse has to apply on top of the state the later commits left behind. Give Git a range and it handles that for you; list the hashes individually and you must write them newest-first yourself, or the first patch will not apply. <code>--no-commit</code> is worth knowing for exactly this case: three revert commits in the log are noise, one commit named "revert: roll back the feed preload feature" is a record. And the reason you are reverting at all instead of resetting is that the branch is shared: revert makes history LONGER by one, so every existing clone stays valid.',
            'Thứ tự quan trọng vì mỗi nghịch đảo phải áp lên trên trạng thái mà các commit sau đó để lại. Đưa Git một khoảng thì nó lo hộ; liệt kê từng mã băm thì bạn phải tự viết mới-nhất-trước, nếu không bản vá đầu tiên đã không áp được. <code>--no-commit</code> đáng biết đúng cho ca này: ba commit revert trong log là tiếng ồn, còn một commit tên "revert: lùi toàn bộ tính năng preload feed" là một bản ghi. Và lý do bạn revert thay vì reset là vì nhánh đang dùng chung: revert làm lịch sử DÀI THÊM một cái, nên mọi bản clone hiện có vẫn hợp lệ.',
          ),
        }),

        mcq({
          prompt: B(
            'Feature branch <code>feat</code> was merged into <code>main</code> as merge commit M. The feature broke production, so you ran <code>git revert -m 1 M</code>. Two weeks later the feature is fixed and you merge <code>feat</code> into <code>main</code> again. What arrives on main?',
            'Nhánh tính năng <code>feat</code> đã được merge vào <code>main</code> bằng commit hợp nhất M. Tính năng làm hỏng production nên bạn chạy <code>git revert -m 1 M</code>. Hai tuần sau tính năng đã được sửa và bạn merge <code>feat</code> vào <code>main</code> lần nữa. Cái gì tới được main?',
          ),
          options: [
            B('Everything, plus a conflict on every file the revert touched — Git replays the whole branch because the revert removed its commits from main', 'Mọi thứ, kèm xung đột ở mọi file mà lệnh revert đã đụng tới — Git phát lại cả nhánh vì lệnh revert đã gỡ các commit của nó khỏi main'),
            B('Nothing at all: Git reports "Already up to date" because M is still an ancestor of main, and the only way forward is to recreate the branch from scratch', 'Không gì cả: Git báo "Already up to date" vì M vẫn là tổ tiên của main, và lối thoát duy nhất là dựng lại nhánh từ đầu'),
            B('Everything, correctly — reverting a merge only undoes the content, and Git treats the branch as unmerged again as soon as the revert lands', 'Mọi thứ, đúng đắn — revert một merge chỉ hoàn tác phần nội dung, và Git coi nhánh đó là chưa merge trở lại ngay khi commit revert xuất hiện'),
            B('Only the NEW commits: by ancestry the old ones already count as "in main" even though the revert removed their effect, so half the feature ships missing — the fix is to revert the revert first', 'Chỉ các commit MỚI: theo luật tổ tiên thì các commit cũ vẫn được tính là "đã có trong main" dù lệnh revert đã xoá tác dụng của chúng, nên tính năng lên production thiếu mất một nửa — cách sửa là revert chính cái revert trước đã'),
          ],
          correct: 3,
          explanation: EX(
            'This is the long tail of reverting a merge, and it is one of the few Git traps that fails silently and in production. Merging is decided by ancestry, not by content: once M is an ancestor of main, every commit on <code>feat</code> up to that point is "already merged", no matter that a later commit undid their effect. Re-merging therefore brings only what is new. The documented fix is to revert the revert (<code>git revert &lt;the-revert-commit&gt;</code>) before merging again — the classic write-up is "How to revert a faulty merge" in the Git documentation, by Linus Torvalds.',
            'Đây là cái đuôi dài của việc revert một merge, và là một trong số ít cạm bẫy của Git hỏng trong im lặng và hỏng ngay trên production. Việc merge được quyết bằng quan hệ tổ tiên chứ không bằng nội dung: một khi M là tổ tiên của main thì mọi commit của <code>feat</code> tới thời điểm đó đều "đã được merge", bất kể có một commit sau đó xoá tác dụng của chúng. Vì thế merge lại chỉ mang về phần mới. Cách sửa được ghi trong tài liệu là revert chính cái commit revert (<code>git revert &lt;commit-revert&gt;</code>) trước khi merge lần nữa — bài viết kinh điển là "How to revert a faulty merge" trong tài liệu Git, do Linus Torvalds viết.',
          ),
        }),

        mcq({
          prompt: B(
            'After <code>git stash -u</code>, the repository was inspected. Where does a stash actually live?' + code(
              '$ git cat-file -t stash@{0}\n' +
              'commit\n' +
              '\n' +
              '$ git rev-list --parents -n 1 stash@{0} | wc -w\n' +
              '       4\n' +
              '\n' +
              '$ find .git/refs -type f\n' +
              '.git/refs/heads/main\n' +
              '.git/refs/stash',
            ),
            'Sau <code>git stash -u</code>, kho được đem ra soi. Một bản cất thật ra nằm ở đâu?' + code(
              '$ git cat-file -t stash@{0}\n' +
              'commit\n' +
              '\n' +
              '$ git rev-list --parents -n 1 stash@{0} | wc -w\n' +
              '       4\n' +
              '\n' +
              '$ find .git/refs -type f\n' +
              '.git/refs/heads/main\n' +
              '.git/refs/stash',
            ),
          ),
          options: [
            B('In a dedicated binary file <code>.git/stash-store</code>, outside the object database — which is why a stash is never pushed and why <code>git fsck</code> never reports one', 'Trong một file nhị phân riêng <code>.git/stash-store</code>, nằm ngoài kho đối tượng — và vì thế một bản cất không bao giờ được push và <code>git fsck</code> không bao giờ báo về nó'),
            B('It is a real COMMIT — with <code>-u</code> it has three parents (HEAD, one holding the index, one holding the untracked files) — sitting on the single ref <code>refs/stash</code> instead of on a branch', 'Nó là một COMMIT thật — với <code>-u</code> thì nó có ba cha (HEAD, một cha giữ index, một cha giữ các file chưa theo dõi) — nằm trên đúng một ref <code>refs/stash</code> thay vì trên một nhánh'),
            B('As a set of patch files under <code>.git/stash/</code> that Git re-applies with <code>git apply</code>, which is why applying one can fail on a tree that has moved on', 'Dưới dạng một bộ file bản vá trong <code>.git/stash/</code> mà Git áp lại bằng <code>git apply</code>, và vì thế áp một bản cất có thể hỏng trên một cái cây đã đi tiếp'),
            B('In an ordinary branch called <code>stash</code> that Git hides from <code>git branch</code>, so <code>git switch stash</code> is the documented way to inspect one', 'Trong một nhánh bình thường tên <code>stash</code> mà Git giấu khỏi <code>git branch</code>, nên <code>git switch stash</code> là cách được ghi trong tài liệu để soi một bản cất'),
          ],
          correct: 1,
          explanation: EX(
            'Every line was measured. <code>rev-list --parents</code> printed four words — the stash itself plus three parents — and their subjects were <code>A</code>, <code>index on main: 914f7ea A</code> and <code>untracked files on main: 914f7ea A</code>. That structure is why the staged/unstaged split survives a <code>pop</code>, and why the tracked-only form has two parents instead of three. The consequence worth remembering is <code>refs/stash</code>: ONE ref for the whole repository (shared even between worktrees), never pushed, never cloned. A stash is a parking space for a five-minute interruption, not storage and not a backup — for anything longer, a <code>wip/</code> branch with a real commit is visible in <code>git branch</code> and can be pushed.',
            'Mọi dòng đều đã đo. <code>rev-list --parents</code> in ra bốn từ — chính cái stash cộng ba cha — và tiêu đề của chúng là <code>A</code>, <code>index on main: 914f7ea A</code> và <code>untracked files on main: 914f7ea A</code>. Chính cấu trúc đó là lý do phần chia staging/chưa-staging sống sót qua một lệnh <code>pop</code>, và là lý do dạng chỉ-file-được-theo-dõi có hai cha thay vì ba. Hệ quả đáng nhớ nằm ở <code>refs/stash</code>: MỘT ref duy nhất cho cả kho (dùng chung cả giữa các worktree), không bao giờ được push, không bao giờ được clone. Một bản cất là chỗ đỗ xe cho một lần gián đoạn năm phút, không phải chỗ lưu trữ và không phải bản sao lưu — lâu hơn thế thì một nhánh <code>wip/</code> với một commit thật sẽ hiện ra trong <code>git branch</code> và push lên được.',
          ),
        }),

        mcq({
          prompt: B(
            'Read this reflog carefully. What does the hash at the START of each line mean?' + code(
              'c200b64 HEAD@{0}: reset: moving to HEAD~3\n' +
              '7a6a15f HEAD@{1}: revert: Revert "B add b.txt"\n' +
              'e92a16f HEAD@{2}: commit: C add c.txt\n' +
              '530f16b HEAD@{3}: commit: B add b.txt\n' +
              'c200b64 HEAD@{4}: commit (initial): A add a.txt',
            ),
            'Đọc kỹ reflog sau. Mã băm ở ĐẦU mỗi dòng nghĩa là gì?' + code(
              'c200b64 HEAD@{0}: reset: moving to HEAD~3\n' +
              '7a6a15f HEAD@{1}: revert: Revert "B add b.txt"\n' +
              'e92a16f HEAD@{2}: commit: C add c.txt\n' +
              '530f16b HEAD@{3}: commit: B add b.txt\n' +
              'c200b64 HEAD@{4}: commit (initial): A add a.txt',
            ),
          ),
          options: [
            B('The commit HEAD pointed at BEFORE the action, which is why line 0 and line 4 show the same hash — both record leaving <code>c200b64</code>', 'Commit mà HEAD trỏ vào TRƯỚC hành động, và đó là lý do dòng 0 và dòng 4 cùng một mã băm — cả hai ghi lại việc rời khỏi <code>c200b64</code>'),
            B('The commit that the action created; entries whose action created nothing (checkout, reset) reuse the previous line\'s hash as a placeholder', 'Commit mà hành động đó tạo ra; những dòng có hành động không tạo ra gì (checkout, reset) thì mượn lại mã băm của dòng trước làm chỗ giữ chỗ'),
            B('The commit HEAD pointed at AFTER the action — so <code>git reset --hard HEAD@{1}</code> puts you back where you were just before the reset, at <code>7a6a15f</code>', 'Commit mà HEAD trỏ vào SAU hành động — nên <code>git reset --hard HEAD@{1}</code> đưa bạn về đúng chỗ ngay trước lệnh reset, tức <code>7a6a15f</code>'),
            B('The commit that will be garbage-collected when the entry expires, which is why the newest line always names the oldest reachable commit', 'Commit sẽ bị thu gom rác khi dòng đó hết hạn, và vì thế dòng mới nhất luôn gọi tên commit cũ nhất còn với tới được'),
          ],
          correct: 2,
          explanation: EX(
            'Copied verbatim from the scratch repository, and then verified: <code>git reset --hard HEAD@{1}</code> answered <code>HEAD is now at 7a6a15f Revert "B add b.txt"</code> and the four commits were back. The line reads "after this action, HEAD was here", which is why the recovery recipe is always <b>the line above the destructive one</b>. Line 0 and line 4 share a hash simply because the reset landed back on the initial commit. Two limits worth remembering: the reflog is local (it lives in <code>.git/logs/</code> and is never pushed or cloned), and it expires — 90 days for reachable entries, 30 for unreachable ones.',
            'Chép nguyên văn từ kho nháp, và đã kiểm lại: <code>git reset --hard HEAD@{1}</code> trả lời <code>HEAD is now at 7a6a15f Revert "B add b.txt"</code> và bốn commit đã quay về. Dòng đó đọc là "sau hành động này, HEAD đứng ở đây", nên công thức cứu hộ luôn là <b>dòng nằm ngay trên cái lệnh phá huỷ</b>. Dòng 0 và dòng 4 trùng mã băm đơn giản vì lệnh reset đáp trúng commit đầu tiên. Hai giới hạn đáng nhớ: reflog là cục bộ (nó nằm ở <code>.git/logs/</code> và không bao giờ được push hay clone), và nó hết hạn — 90 ngày với dòng còn với tới được, 30 ngày với dòng không với tới được.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Find the merge base yourself (chapter 3).</b> A three-way merge needs the common ancestor. Given a commit graph as plain data, compute it — no repository, no <code>git</code>, no libraries.</p>' +
            '<p>Implement three functions:</p>' +
            '<ul>' +
            '<li><code>ancestors(repo, id)</code> — every commit reachable from <code>id</code>, <b>including <code>id</code> itself</b>, as an array sorted alphabetically. Follow ALL parents, and make sure a commit reachable by two routes is only counted once.</li>' +
            '<li><code>isAncestor(repo, a, b)</code> — <code>true</code> when <code>a</code> is a proper ancestor of <code>b</code>. A commit is <b>not</b> its own ancestor, so <code>isAncestor(x, x)</code> is <code>false</code>.</li>' +
            '<li><code>mergeBase(repo, a, b)</code> — the <b>best</b> common ancestors, sorted alphabetically: every commit reachable from both, minus any that is an ancestor of another common ancestor. Return <code>[]</code> when the two histories are unrelated. A criss-cross history can legitimately return TWO commits — this mirrors <code>git merge-base -a</code>.</li>' +
            '</ul>' +
            '<p>A commit with an empty <code>parents</code> array is a root commit. Keep the given data and the printing loop exactly as they are.</p>',

            '<p><b>Câu 31 — Tự tìm merge base (chương 3).</b> Hợp nhất ba chiều cần tổ tiên chung. Cho một đồ thị commit dưới dạng dữ liệu thuần, hãy tính nó ra — không kho mã, không <code>git</code>, không thư viện.</p>' +
            '<p>Cài đặt ba hàm:</p>' +
            '<ul>' +
            '<li><code>ancestors(repo, id)</code> — mọi commit với tới được từ <code>id</code>, <b>kể cả chính <code>id</code></b>, trả về mảng sắp theo bảng chữ cái. Đi theo TẤT CẢ các cha, và nhớ rằng một commit tới được bằng hai đường thì chỉ tính một lần.</li>' +
            '<li><code>isAncestor(repo, a, b)</code> — <code>true</code> khi <code>a</code> là tổ tiên thực sự của <code>b</code>. Một commit <b>không</b> là tổ tiên của chính nó, nên <code>isAncestor(x, x)</code> là <code>false</code>.</li>' +
            '<li><code>mergeBase(repo, a, b)</code> — các tổ tiên chung <b>tốt nhất</b>, sắp theo bảng chữ cái: mọi commit với tới được từ cả hai, trừ đi những cái là tổ tiên của một tổ tiên chung khác. Trả <code>[]</code> khi hai lịch sử không liên quan. Một lịch sử đan chéo hoàn toàn có thể trả về HAI commit — đúng như <code>git merge-base -a</code>.</li>' +
            '</ul>' +
            '<p>Commit có mảng <code>parents</code> rỗng là commit gốc. Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// A-B-C rẽ thành D-F và E-G, gặp lại ở M-N.\n' +
            '// X và Y là hai lần merge D và E theo hai thứ tự cha khác nhau (đan chéo).\n' +
            '// P-Q là một lịch sử hoàn toàn rời rạc.\n' +
            'const REPO = [\n' +
            "  { id: 'A', parents: [] },\n" +
            "  { id: 'B', parents: ['A'] },\n" +
            "  { id: 'C', parents: ['B'] },\n" +
            "  { id: 'D', parents: ['C'] },\n" +
            "  { id: 'E', parents: ['C'] },\n" +
            "  { id: 'F', parents: ['D'] },\n" +
            "  { id: 'G', parents: ['E'] },\n" +
            "  { id: 'M', parents: ['F', 'G'] },\n" +
            "  { id: 'N', parents: ['M'] },\n" +
            "  { id: 'X', parents: ['D', 'E'] },\n" +
            "  { id: 'Y', parents: ['E', 'D'] },\n" +
            "  { id: 'P', parents: [] },\n" +
            "  { id: 'Q', parents: ['P'] },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function ancestors(repo, id) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function isAncestor(repo, a, b) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function mergeBase(repo, a, b) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const QUERIES = [\n' +
            "  ['F', 'G'], ['N', 'G'], ['C', 'F'], ['F', 'F'],\n" +
            "  ['B', 'A'], ['N', 'Q'], ['X', 'Y'], ['M', 'C'],\n" +
            '];\n' +
            'for (const [a, b] of QUERIES) {\n' +
            "  console.log(a + ' ' + b + ' -> base=' + JSON.stringify(mergeBase(REPO, a, b))\n" +
            "    + ' ancestorOf=' + isAncestor(REPO, a, b));\n" +
            '}\n' +
            "console.log('ancestors(N)=' + JSON.stringify(ancestors(REPO, 'N')));\n",
          expectedOutput:
            'F G -> base=["C"] ancestorOf=false\n' +
            'N G -> base=["G"] ancestorOf=false\n' +
            'C F -> base=["C"] ancestorOf=true\n' +
            'F F -> base=["F"] ancestorOf=false\n' +
            'B A -> base=["A"] ancestorOf=false\n' +
            'N Q -> base=[] ancestorOf=false\n' +
            'X Y -> base=["D","E"] ancestorOf=false\n' +
            'M C -> base=["C"] ancestorOf=false\n' +
            'ancestors(N)=["A","B","C","D","E","F","G","M","N"]',
          sampleSolution:
            'function ancestors(repo, id) {\n' +
            '  const by = new Map(repo.map((c) => [c.id, c]));\n' +
            '  const seen = new Set();\n' +
            '  const stack = [id];\n' +
            '  while (stack.length) {\n' +
            '    const cur = stack.pop();\n' +
            '    if (seen.has(cur)) continue;      // đồ thị, không phải cây: phải chống đi lại\n' +
            '    seen.add(cur);\n' +
            '    for (const p of (by.get(cur)?.parents ?? [])) stack.push(p);\n' +
            '  }\n' +
            '  return [...seen].sort();\n' +
            '}\n\n' +
            'function isAncestor(repo, a, b) {\n' +
            '  return a !== b && ancestors(repo, b).includes(a);\n' +
            '}\n\n' +
            'function mergeBase(repo, a, b) {\n' +
            '  const sa = new Set(ancestors(repo, a));\n' +
            '  const common = ancestors(repo, b).filter((id) => sa.has(id));\n' +
            '  // "Tốt nhất" = không phải tổ tiên của một tổ tiên chung nào khác.\n' +
            '  return common\n' +
            '    .filter((id) => !common.some((other) => isAncestor(repo, id, other)))\n' +
            '    .sort();\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Simulate the three trees (chapters 1 and 4).</b> Implement <code>run(script)</code>, which replays a list of commands against a model of HEAD, the index and the working directory, then returns what <code>git status --short</code> would print, as an array of strings sorted by file name.</p>' +
            '<p>The commands, exactly as they appear in the data:</p>' +
            '<ul>' +
            '<li><code>write &lt;file&gt; &lt;content&gt;</code> · <code>delete &lt;file&gt;</code> — working directory only.</li>' +
            '<li><code>add &lt;file&gt;</code> — copy that path from the working directory into the index (if the file is gone, the path leaves the index too). <code>add .</code> makes the index match the working directory.</li>' +
            '<li><code>commit &lt;msg&gt;</code> — push the current HEAD snapshot onto a history stack, then HEAD becomes a copy of the index.</li>' +
            '<li><code>rm --cached &lt;file&gt;</code> — drop the path from the index, leave the working directory alone.</li>' +
            '<li><code>reset --soft|--mixed|--hard HEAD~1</code> — HEAD pops back one snapshot; <code>--mixed</code> also resets the index, <code>--hard</code> also resets the working directory.</li>' +
            '<li><code>restore &lt;file&gt;</code> — working directory ← index. <code>restore --staged &lt;file&gt;</code> — index ← HEAD.</li>' +
            '</ul>' +
            '<p>Status codes: the left column is index vs HEAD, the right column is working directory vs index. <code>A</code> = in the index but not in HEAD, <code>D</code> = in HEAD but not in the index (left) or in the index but not on disk (right), <code>M</code> = present on both sides with different content, space = same. A path in neither HEAD nor the index prints <code>?? &lt;file&gt;</code>. A path that is in HEAD, gone from the index, and back on disk prints <b>both</b> its <code>XY</code> line and a <code>??</code> line — that is what real Git does after <code>git rm --cached</code>.</p>' +
            '<p>Keep the given data and the printing loop exactly as they are.</p>',

            '<p><b>Câu 32 — Mô phỏng ba cái cây (chương 1 và 4).</b> Cài đặt <code>run(script)</code>: phát lại một danh sách lệnh trên mô hình HEAD, index và thư mục làm việc, rồi trả về đúng thứ <code>git status --short</code> sẽ in, dưới dạng mảng chuỗi sắp theo tên file.</p>' +
            '<p>Các lệnh, đúng như chúng xuất hiện trong dữ liệu:</p>' +
            '<ul>' +
            '<li><code>write &lt;file&gt; &lt;nội dung&gt;</code> · <code>delete &lt;file&gt;</code> — chỉ đụng thư mục làm việc.</li>' +
            '<li><code>add &lt;file&gt;</code> — chép đường dẫn đó từ thư mục làm việc vào index (file không còn thì đường dẫn cũng rời index). <code>add .</code> làm index khớp thư mục làm việc.</li>' +
            '<li><code>commit &lt;lời nhắn&gt;</code> — đẩy ảnh chụp HEAD hiện tại vào một ngăn xếp lịch sử, rồi HEAD thành bản sao của index.</li>' +
            '<li><code>rm --cached &lt;file&gt;</code> — bỏ đường dẫn khỏi index, để yên thư mục làm việc.</li>' +
            '<li><code>reset --soft|--mixed|--hard HEAD~1</code> — HEAD lùi lại một ảnh chụp; <code>--mixed</code> đặt lại thêm index, <code>--hard</code> đặt lại thêm thư mục làm việc.</li>' +
            '<li><code>restore &lt;file&gt;</code> — thư mục làm việc ← index. <code>restore --staged &lt;file&gt;</code> — index ← HEAD.</li>' +
            '</ul>' +
            '<p>Mã trạng thái: cột trái là index so với HEAD, cột phải là thư mục làm việc so với index. <code>A</code> = có trong index mà không có trong HEAD, <code>D</code> = có trong HEAD mà không có trong index (cột trái) hoặc có trong index mà không có trên đĩa (cột phải), <code>M</code> = có ở cả hai bên nhưng khác nội dung, dấu cách = giống nhau. Đường dẫn không có trong cả HEAD lẫn index thì in <code>?? &lt;file&gt;</code>. Đường dẫn có trong HEAD, đã rời index, và vẫn nằm trên đĩa thì in <b>cả hai</b> — dòng <code>XY</code> lẫn dòng <code>??</code> — đúng như Git thật làm sau <code>git rm --cached</code>.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const SCRIPTS = [\n' +
            "  ['write a.txt v1', 'add a.txt', 'commit A', 'write a.txt v2', 'add a.txt', 'write a.txt v3'],\n" +
            "  ['write a.txt v1', 'write g.txt x', 'add .', 'commit A', 'rm --cached g.txt'],\n" +
            "  ['write a.txt v1', 'add .', 'commit A', 'write b.txt b', 'add .', 'commit B', 'reset --soft HEAD~1'],\n" +
            "  ['write a.txt v1', 'add .', 'commit A', 'write b.txt b', 'add .', 'commit B', 'reset --mixed HEAD~1'],\n" +
            "  ['write a.txt v1', 'add .', 'commit A', 'write b.txt b', 'add .', 'commit B', 'reset --hard HEAD~1'],\n" +
            "  ['write a.txt v1', 'add .', 'commit A', 'write a.txt v2', 'add a.txt', 'write a.txt v3', 'restore --staged a.txt'],\n" +
            "  ['write a.txt v1', 'add .', 'commit A', 'write a.txt v2', 'add a.txt', 'write a.txt v3', 'restore a.txt'],\n" +
            "  ['write a.txt v1', 'add .', 'commit A', 'delete a.txt'],\n" +
            "  ['write a.txt v1', 'add .', 'commit A', 'delete a.txt', 'add .'],\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function run(script) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const s of SCRIPTS) {\n' +
            '  const out = run(s);\n' +
            "  console.log('[' + s[s.length - 1] + '] ' + (out.length ? out.join(' / ') : '(clean)'));\n" +
            '}\n',
          expectedOutput:
            '[write a.txt v3] MM a.txt\n' +
            '[rm --cached g.txt] D  g.txt / ?? g.txt\n' +
            '[reset --soft HEAD~1] A  b.txt\n' +
            '[reset --mixed HEAD~1] ?? b.txt\n' +
            '[reset --hard HEAD~1] (clean)\n' +
            '[restore --staged a.txt]  M a.txt\n' +
            '[restore a.txt] M  a.txt\n' +
            '[delete a.txt]  D a.txt\n' +
            '[add .] D  a.txt',
          sampleSolution:
            'function run(script) {\n' +
            '  let head = new Map();      // ảnh chụp của commit HEAD đang trỏ tới\n' +
            '  let index = new Map();     // vùng chờ\n' +
            '  let work = new Map();      // thư mục làm việc\n' +
            '  const history = [];        // ngăn xếp các ảnh chụp cũ của HEAD\n' +
            '  const copy = (m) => new Map(m);\n\n' +
            '  for (const line of script) {\n' +
            "    const [cmd, ...rest] = line.split(' ');\n" +
            "    if (cmd === 'write') { work.set(rest[0], rest[1]); continue; }\n" +
            "    if (cmd === 'delete') { work.delete(rest[0]); continue; }\n" +
            "    if (cmd === 'add') {\n" +
            "      if (rest[0] === '.') index = copy(work);\n" +
            '      else if (work.has(rest[0])) index.set(rest[0], work.get(rest[0]));\n' +
            '      else index.delete(rest[0]);\n' +
            '      continue;\n' +
            '    }\n' +
            "    if (cmd === 'rm') { index.delete(rest[1]); continue; }\n" +
            "    if (cmd === 'commit') { history.push(copy(head)); head = copy(index); continue; }\n" +
            "    if (cmd === 'reset') {\n" +
            '      const mode = rest[0];\n' +
            '      head = history.pop() ?? new Map();\n' +
            "      if (mode === '--mixed' || mode === '--hard') index = copy(head);\n" +
            "      if (mode === '--hard') work = copy(head);\n" +
            '      continue;\n' +
            '    }\n' +
            "    if (cmd === 'restore') {\n" +
            "      if (rest[0] === '--staged') {\n" +
            '        const f = rest[1];\n' +
            '        if (head.has(f)) index.set(f, head.get(f)); else index.delete(f);\n' +
            '      } else {\n' +
            '        const f = rest[0];\n' +
            '        if (index.has(f)) work.set(f, index.get(f)); else work.delete(f);\n' +
            '      }\n' +
            '      continue;\n' +
            '    }\n' +
            '  }\n\n' +
            '  const files = [...new Set([...head.keys(), ...index.keys(), ...work.keys()])].sort();\n' +
            '  const out = [];\n' +
            '  for (const f of files) {\n' +
            "    if (!index.has(f) && !head.has(f)) { out.push('?? ' + f); continue; }\n" +
            "    let x = ' ', y = ' ';\n" +
            "    if (index.has(f) && !head.has(f)) x = 'A';\n" +
            "    else if (!index.has(f) && head.has(f)) x = 'D';\n" +
            "    else if (index.get(f) !== head.get(f)) x = 'M';\n\n" +
            "    if (index.has(f) && !work.has(f)) y = 'D';\n" +
            "    else if (index.has(f) && work.get(f) !== index.get(f)) y = 'M';\n" +
            '    else if (!index.has(f) && work.has(f)) {\n' +
            '      // Bị gỡ khỏi index nhưng vẫn nằm trên đĩa: Git in HAI dòng.\n' +
            "      out.push(x + y + ' ' + f);\n" +
            "      out.push('?? ' + f);\n" +
            '      continue;\n' +
            '    }\n\n' +
            "    if (x !== ' ' || y !== ' ') out.push(x + y + ' ' + f);\n" +
            '  }\n' +
            '  return out;\n' +
            '}\n',
        }),
      ],
    },
  ],
};
