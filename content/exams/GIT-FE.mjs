/**
 * Git & GitHub — Final Exam (FE): 50 câu trắc nghiệm phủ cả 14 chương (s00–s13).
 *
 * Đề tự soạn, bám sát `content/courses/git/s00…s13`. Có cả câu lý thuyết lẫn câu
 * đọc chuỗi lệnh; MỌI câu hỏi "sau chuỗi lệnh này Git in ra gì / file ở trạng
 * thái nào" đều đã CHẠY THẬT trên **git 2.51.1** trong một kho tạm dùng một lần
 * (macOS, Darwin 25.6). Thông báo lỗi, dấu xung đột, số commit và output
 * `git status --short` trong đáp án là nguyên văn máy in ra, không phải trí nhớ.
 *
 * ⚠️ Ba chỗ giáo trình lệch với git 2.51.1, đã tránh không ra đề vào:
 *   • 12.1 nói `ls .git/hooks/` có 9 file `.sample`; git 2.51.1 đẻ ra **14**
 *     (thêm fsmonitor-watchman, pre-applypatch, pre-merge-commit,
 *     push-to-checkout, sendemail-validate). Số lượng là chi tiết theo phiên bản.
 *   • 3.3 in mốc thứ ba của `zdiff3` là `||||||| merge base`; git 2.51.1 in
 *     `||||||| <sha nền>`. Câu 15 vì thế hỏi Ý NGHĨA của khối thứ ba, không hỏi
 *     chữ trên mốc.
 *   • 3.5 liệt kê 7 động từ của `rebase -i`; bản thật còn `exec`, `label`,
 *     `reset`, `merge`, `update-ref`. Câu 17 chỉ hỏi squash so với fixup.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/GIT-FE.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/git-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all 14 chapters, from "why a folder full of report_final_v2 files is a bad version control system" to recovering a repository that looks broken. Many questions show a sequence of commands and ask what Git prints or what state the repository is left in; every one of those answers came from actually running the commands on <code>git 2.51.1</code>, so read the sequence rather than the intuition.</p>' +
  '<p>Two habits pay off here. First, keep asking <b>which of the three trees</b> a command touches — working directory, index, or <code>HEAD</code>; half the undo questions turn on nothing else. Second, keep asking <b>whether a hash survives</b>: amend, rebase, cherry-pick and squash all produce new commits, and every consequence for other people follows from that single fact.</p>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả 14 chương, từ chuyện "vì sao một thư mục đầy file bao_cao_final_v2 là một hệ quản lý phiên bản tồi" tới việc cứu một kho mã trông như đã hỏng. Nhiều câu cho sẵn một chuỗi lệnh và hỏi Git in ra gì hoặc kho mã còn lại ở trạng thái nào; mọi đáp án loại đó đều lấy từ việc chạy thật chuỗi lệnh ấy trên <code>git 2.51.1</code>, nên hãy đọc chuỗi lệnh thay vì đoán theo cảm tính.</p>' +
  '<p>Hai thói quen giúp ích ở đây. Một là luôn hỏi lệnh này đụng vào <b>cây nào trong ba cây</b> — thư mục làm việc, index, hay <code>HEAD</code>; một nửa số câu về hoàn tác chỉ ăn thua ở đó. Hai là luôn hỏi <b>mã băm có sống sót không</b>: amend, rebase, cherry-pick và squash đều đẻ ra commit mới, và mọi hệ quả với người khác đều sinh ra từ đúng một sự thật ấy.</p>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'git' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 4,
      title: B(
        'Final Exam — the whole Git & GitHub course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá Git & GitHub (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all fourteen chapters: why a distributed VCS exists, the three trees, reading history with log and diff and bisect, branching and merging and rebase, the whole undo map, remotes and authentication, pull requests and branch protection, team workflows and semantic versioning, rewriting history safely, the object database, big repositories, the GitHub platform, hooks and signing, and the disaster recovery cookbook.',
        'Năm mươi câu trắc nghiệm phủ cả mười bốn chương: vì sao cần một hệ quản lý phiên bản phân tán, ba cái cây, đọc lịch sử bằng log và diff và bisect, nhánh và hợp nhất và rebase, toàn bộ bản đồ hoàn tác, remote và xác thực, pull request và bảo vệ nhánh, quy trình nhóm và đánh phiên bản ngữ nghĩa, viết lại lịch sử an toàn, kho đối tượng, kho mã lớn, nền tảng GitHub, hook và ký commit, và sách công thức cứu hộ.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        // ── Chương 0 — Giới thiệu, vì sao cần Git, cài đặt ───────────────
        mcq({
          prompt: B(
            'You run <code>git clone</code> on a five-year-old project, then unplug the network. Which set of commands still works completely?',
            'Bạn chạy <code>git clone</code> một dự án năm năm tuổi, rồi rút mạng. Bộ lệnh nào vẫn chạy được đầy đủ?',
          ),
          options: [
            B(
              'None of them — a clone downloads the current files and asks the server for anything older',
              'Không lệnh nào — clone chỉ tải các file hiện tại và phải hỏi máy chủ mỗi khi cần thứ cũ hơn',
            ),
            B(
              'Only <code>git status</code> and <code>git diff</code>, because those look at your disk; history needs the server',
              'Chỉ <code>git status</code> và <code>git diff</code>, vì hai lệnh đó nhìn vào đĩa; còn lịch sử thì cần máy chủ',
            ),
            B(
              '<code>git log</code>, <code>git diff v1.0.0 v2.0.0</code>, <code>git branch</code>, <code>git commit</code> — a clone contains every version of every file plus all branches and tags',
              '<code>git log</code>, <code>git diff v1.0.0 v2.0.0</code>, <code>git branch</code>, <code>git commit</code> — một bản clone chứa mọi phiên bản của mọi file, kèm tất cả nhánh và tag',
            ),
            B(
              'Everything except <code>git commit</code>, which has to reserve the new revision number on the server first',
              'Mọi thứ trừ <code>git commit</code>, vì lệnh này phải xin số hiệu bản sửa đổi mới từ máy chủ trước',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the whole meaning of the D in <b>DVCS</b> (lesson 0.2). A clone is not a checkout of the current files: it downloads <em>every version of every file since the project began</em>, plus all the branches and tags, into <code>.git/</code>. That is why <code>git log</code> is instant, why you can commit on a plane, and why a GitHub outage does not stop you working. Option 4 describes a <em>centralised</em> system such as Subversion, where revision numbers are handed out by the server — Git names commits by a hash of their own content instead, so no coordination is needed.',
            'Đây chính là toàn bộ ý nghĩa của chữ D trong <b>DVCS</b> (bài 0.2). Clone không phải là lấy về các file hiện tại: nó tải <em>mọi phiên bản của mọi file từ khi dự án bắt đầu</em>, kèm tất cả nhánh và tag, vào <code>.git/</code>. Vì thế <code>git log</code> chạy tức thì, vì thế bạn commit được trên máy bay, và vì thế GitHub sập không làm bạn ngừng làm việc. Phương án 4 mô tả một hệ <em>tập trung</em> như Subversion, nơi số hiệu bản sửa đổi do máy chủ phát ra — Git thì đặt tên commit bằng mã băm của chính nội dung nó, nên không cần phối hợp với ai.',
          ),
        }),

        mcq({
          prompt: B(
            'A teammate suggests putting the team repository inside a shared Dropbox folder "so everyone always has the latest code". What does the course say goes wrong?',
            'Một đồng đội đề xuất đặt kho mã của nhóm trong một thư mục Dropbox dùng chung "để ai cũng luôn có mã mới nhất". Giáo trình nói điều gì sẽ hỏng?',
          ),
          options: [
            B(
              'Nothing technically — it is only slower than a proper remote, because Dropbox re-uploads the whole folder',
              'Về kỹ thuật thì không sao — chỉ chậm hơn một remote đúng nghĩa, vì Dropbox tải lại cả thư mục',
            ),
            B(
              'Dropbox and Git both write into <code>.git/</code> without knowing those files must change together, so you get a corrupted index or a half-written packfile on a schedule nobody can reproduce',
              'Dropbox và Git cùng ghi vào <code>.git/</code> mà không biết những file đó phải đổi cùng nhau, nên bạn nhận được index hỏng hoặc packfile viết dở, theo một lịch không ai tái hiện nổi',
            ),
            B(
              'Git refuses to initialise a repository inside a synced folder and prints <code>fatal: unsafe repository</code>',
              'Git từ chối khởi tạo kho mã trong một thư mục được đồng bộ và in ra <code>fatal: unsafe repository</code>',
            ),
            B(
              'Merge conflicts become impossible to resolve, because Dropbox strips the conflict markers when it syncs the file',
              'Xung đột merge trở nên không thể giải quyết, vì Dropbox gỡ mất các dấu xung đột khi nó đồng bộ file',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The trap named in lesson 0.2. Git writes several files in <code>.git/</code> that only make sense as a set — the index, a packfile and the refs that point into it. A sync client copies them one at a time, in whatever order it likes, from whichever machine finished first. The failure is intermittent and untraceable, which is what makes it expensive. Keep repositories on ordinary local disk and share through a Git remote; that is exactly what remotes are for. The deeper point of the same lesson is that Git and Dropbox are not competing tools: Dropbox syncs <em>continuously and automatically</em>, Git syncs <em>deliberately</em>, and that deliberate gap is where review, tests and CI live.',
            'Đúng cái bẫy nêu ở bài 0.2. Git ghi nhiều file trong <code>.git/</code> mà chỉ có nghĩa khi đi cùng nhau — index, một packfile, và các ref trỏ vào đó. Trình đồng bộ chép từng file một, theo thứ tự tuỳ nó, từ bất cứ máy nào xong trước. Lỗi xảy ra chập chờn và không truy được nguồn, và chính điều đó làm nó đắt. Hãy để kho mã trên đĩa cục bộ bình thường và chia sẻ qua remote của Git; remote sinh ra chính là để làm việc đó. Ý sâu hơn của cùng bài học: Git và Dropbox không phải hai công cụ cạnh tranh — Dropbox đồng bộ <em>liên tục và tự động</em>, Git đồng bộ <em>có chủ ý</em>, và chính khoảng ngắt có chủ ý ấy là nơi review, test và CI sinh sống.',
          ),
        }),

        mcq({
          prompt: B(
            'Which statement about the four flaws of the "report_final_v2_use_this_one.docx" approach is <b>false</b>?',
            'Phát biểu nào về bốn khiếm khuyết của cách làm "bao_cao_final_v2_dung_ban_nay.docx" là <b>SAI</b>?',
          ),
          options: [
            B(
              'It cannot record <em>why</em> a version exists — the file name records a vague when, never a reason',
              'Nó không ghi được <em>vì sao</em> một phiên bản tồn tại — tên file ghi lại một mốc thời gian mập mờ, không bao giờ ghi lý do',
            ),
            B(
              'It cannot show what changed without a human reading both documents side by side',
              'Nó không cho thấy đã đổi gì nếu không có người đọc song song cả hai tài liệu',
            ),
            B(
              'It cannot merge two people’s work — if two people edit the same copy, one of them loses',
              'Nó không hợp nhất được việc của hai người — nếu hai người cùng sửa một bản, một người sẽ mất công',
            ),
            B(
              'It cannot store more than one version of a file, which is the flaw Git fixes first',
              'Nó không lưu được quá một phiên bản của một file, và đó là khiếm khuyết đầu tiên mà Git sửa',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Lesson 0.2 opens by conceding the opposite: that folder <em>is</em> a real version control system, and it does store versions. Storing versions is the one thing it gets right. The four things it cannot do are why, what changed, merging, and going back safely — and each of the four maps onto a Git feature (a commit message, <code>git diff</code>, the merge machinery, and the fact that every version stays reachable forever). Starting from "it works, here is precisely where it breaks" is the point of the lesson; a candidate who marks option 1, 2 or 3 as false has inverted it.',
            'Bài 0.2 mở đầu bằng đúng điều ngược lại: cái thư mục ấy <em>là</em> một hệ quản lý phiên bản thật, và nó có lưu các phiên bản. Lưu phiên bản chính là thứ duy nhất nó làm đúng. Bốn thứ nó không làm được là vì sao, đã đổi gì, hợp nhất, và quay lại an toàn — mỗi thứ ứng với một tính năng của Git (lời nhắn commit, <code>git diff</code>, bộ máy merge, và việc mọi phiên bản còn với tới được mãi mãi). Bắt đầu từ "nó có chạy, và đây là chỗ nó gãy" mới là ý của bài; ai chọn phương án 1, 2 hay 3 là đã hiểu ngược.',
          ),
        }),

        // ── Chương 1 — Mô hình: ảnh chụp, không phải bản khác biệt ───────
        mcq({
          prompt: B(
            'These commands were run in a fresh repository. What does the last one print?' + code(
              'echo "v1" > f.txt && git add f.txt && git commit -m "A"\n' +
              'echo "v2" > f.txt && git add f.txt      # staged\n' +
              'echo "v3" > f.txt                       # edited again, NOT staged\n' +
              'git status --short',
            ),
            'Các lệnh sau được chạy trong một kho mã mới tinh. Lệnh cuối in ra gì?' + code(
              'echo "v1" > f.txt && git add f.txt && git commit -m "A"\n' +
              'echo "v2" > f.txt && git add f.txt      # đã đưa vào index\n' +
              'echo "v3" > f.txt                       # sửa tiếp, CHƯA đưa vào index\n' +
              'git status --short',
            ),
          ),
          options: [
            B(
              '<code> M f.txt</code> — one M in the right column, because the newest edit is unstaged',
              '<code> M f.txt</code> — một chữ M ở cột phải, vì lần sửa mới nhất chưa vào index',
            ),
            B(
              '<code>MM f.txt</code> — two columns: the index differs from HEAD, and the working directory differs from the index',
              '<code>MM f.txt</code> — hai cột: index khác HEAD, và thư mục làm việc khác index',
            ),
            B(
              '<code>M  f.txt</code> — one M in the left column, because <code>git add</code> was the last thing that touched the index',
              '<code>M  f.txt</code> — một chữ M ở cột trái, vì <code>git add</code> là thứ cuối cùng đụng vào index',
            ),
            B(
              '<code>?? f.txt</code> — staging then editing again makes Git lose track of the file',
              '<code>?? f.txt</code> — đưa vào index rồi sửa tiếp khiến Git mất dấu file',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. <code>git status --short</code> has exactly two columns, and they are the two gaps between the three trees of lesson 1.1: the <b>left</b> column compares <code>HEAD</code> with the <b>index</b>, the <b>right</b> column compares the index with the <b>working directory</b>. Here <code>v2</code> was staged (so index ≠ HEAD) and then <code>v3</code> was written on disk without staging (so working directory ≠ index) — both gaps are open, so both columns show <code>M</code>. If you commit now you get <code>v2</code>, not <code>v3</code>: the commit is built from the index. Options 1 and 3 each describe what you would see if only one of the two edits had happened.',
            'Đã chạy thật. <code>git status --short</code> có đúng hai cột, và hai cột đó là hai khe hở giữa ba cái cây ở bài 1.1: cột <b>trái</b> so <code>HEAD</code> với <b>index</b>, cột <b>phải</b> so index với <b>thư mục làm việc</b>. Ở đây <code>v2</code> đã vào index (nên index ≠ HEAD) rồi <code>v3</code> được ghi ra đĩa mà không add (nên thư mục làm việc ≠ index) — cả hai khe đều hở, nên cả hai cột đều hiện <code>M</code>. Commit ngay lúc này thì bạn được <code>v2</code> chứ không phải <code>v3</code>: commit dựng từ index. Phương án 1 và 3 mỗi cái mô tả trạng thái nếu chỉ có một trong hai lần sửa xảy ra.',
          ),
        }),

        mcq({
          prompt: B(
            'You committed <code>.env</code> by accident yesterday. Today you add <code>.env</code> to <code>.gitignore</code>, commit that, then change a value inside <code>.env</code>. What does <code>git status --short</code> show?',
            'Hôm qua bạn lỡ commit <code>.env</code>. Hôm nay bạn thêm <code>.env</code> vào <code>.gitignore</code>, commit file đó, rồi sửa một giá trị bên trong <code>.env</code>. <code>git status --short</code> hiện gì?',
          ),
          options: [
            B(
              'Nothing — the file is ignored now, so Git stops reporting it',
              'Không gì cả — file đã bị bỏ qua rồi, nên Git thôi báo về nó',
            ),
            B(
              '<code>!! .env</code>, the status code Git uses for a tracked file that has become ignored',
              '<code>!! .env</code>, mã trạng thái Git dùng cho một file đang được theo dõi mà chuyển thành bị bỏ qua',
            ),
            B(
              '<code> M .env</code> — <code>.gitignore</code> only decides whether <b>untracked</b> files are offered to you; a file already in the index stays tracked',
              '<code> M .env</code> — <code>.gitignore</code> chỉ quyết định các file <b>chưa được theo dõi</b> có được gợi ý hay không; file đã nằm trong index thì vẫn được theo dõi tiếp',
            ),
            B(
              '<code>?? .env</code> — adding the rule untracks the file automatically at the next commit',
              '<code>?? .env</code> — thêm luật vào là file tự động thôi được theo dõi ở commit kế tiếp',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Verified by running it: the file still shows as modified. This is the single most common <code>.gitignore</code> misunderstanding, and lesson 1.5 states the rule plainly — <b>ignore rules are only consulted for untracked files.</b> Once a path is in the index, Git keeps reporting it forever, no matter what the ignore file says. The fix is one command that removes it from the index while leaving it on disk:' + code('git rm --cached .env\ngit commit -m "chore: stop tracking .env"') + 'and then it really is ignored. Note the second half of the lesson too: the file is out of the <em>future</em>, but yesterday’s commit still contains the secret, so the credential must be rotated (chapter 8.3).',
            'Đã chạy thật: file vẫn hiện là đã sửa. Đây là hiểu nhầm phổ biến nhất về <code>.gitignore</code>, và bài 1.5 nói thẳng luật — <b>luật bỏ qua chỉ được tra cho những file CHƯA được theo dõi.</b> Một khi đường dẫn đã nằm trong index, Git còn báo về nó mãi, bất kể file ignore viết gì. Cách sửa là một lệnh gỡ nó khỏi index mà vẫn giữ trên đĩa:' + code('git rm --cached .env\ngit commit -m "chore: stop tracking .env"') + 'rồi thì nó mới thật sự bị bỏ qua. Chú ý nửa sau của bài nữa: file đã ra khỏi <em>tương lai</em>, nhưng commit hôm qua vẫn chứa bí mật, nên phải đổi khoá (chương 8.3).',
          ),
        }),

        mcq({
          prompt: B(
            'A repository is created, three files with <b>identical content</b> are added, and one commit is made. <code>git count-objects -v</code> then reports <code>count: 3</code>. Which three objects are they?',
            'Một kho mã được tạo, ba file có <b>nội dung giống hệt nhau</b> được thêm vào, và một commit được tạo. <code>git count-objects -v</code> báo <code>count: 3</code>. Ba đối tượng đó là gì?',
          ),
          options: [
            B(
              'Three blobs, one per file — the tree and the commit are stored inside the index, not the object database',
              'Ba blob, mỗi file một cái — tree và commit nằm trong index chứ không nằm trong kho đối tượng',
            ),
            B(
              'One blob, one tree, one commit — identical content hashes to the same blob, so the three files share it',
              'Một blob, một tree, một commit — nội dung giống nhau băm ra cùng một blob, nên ba file dùng chung nó',
            ),
            B(
              'Three trees, one per file, because a tree records the file name and the names differ',
              'Ba tree, mỗi file một cái, vì tree ghi tên file mà ba tên thì khác nhau',
            ),
            B(
              'One blob, one commit, one tag — Git creates an implicit tag object for the first commit',
              'Một blob, một commit, một tag — Git tạo một đối tượng tag ngầm cho commit đầu tiên',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it — all three files reported the same blob hash, <code>ce013625030ba8dba906f756967f9e9ca394464a</code>, and the database held exactly three objects. This is content addressing doing its job (lessons 1.2 and 9.2): a <b>blob stores bytes and nothing else</b> — no name, no path, no permissions — so identical content is physically the same object, stored once. The <b>names</b> live one level up, in the <b>tree</b>, which lists three entries all pointing at that one blob. Option 3 gets the tree right in spirit but wrong in structure: one commit has one root tree, not one tree per file. The same mechanism is why renaming a 10 MB file costs almost nothing.',
            'Đã chạy thật — cả ba file báo cùng một mã băm blob, <code>ce013625030ba8dba906f756967f9e9ca394464a</code>, và kho chứa đúng ba đối tượng. Đây là cơ chế định danh theo nội dung đang làm việc của nó (bài 1.2 và 9.2): một <b>blob chỉ lưu các byte</b> — không tên, không đường dẫn, không quyền — nên nội dung giống nhau thì về mặt vật lý là cùng một đối tượng, lưu một lần. <b>Tên</b> nằm ở tầng trên, trong <b>tree</b>, và tree đó liệt kê ba mục cùng trỏ vào một blob. Phương án 3 đúng tinh thần về tree nhưng sai cấu trúc: một commit có một tree gốc, không phải mỗi file một tree. Cũng chính cơ chế này khiến việc đổi tên một file 10 MB gần như không tốn gì.',
          ),
        }),

        mcq({
          prompt: B(
            'With <code>v1</code> committed, <code>v2</code> staged and <code>v3</code> in the working directory, which command shows the difference between <code>v1</code> and <code>v2</code>?',
            'Khi <code>v1</code> đã commit, <code>v2</code> đang ở index và <code>v3</code> đang ở thư mục làm việc, lệnh nào cho thấy khác biệt giữa <code>v1</code> và <code>v2</code>?',
          ),
          options: [
            B('<code>git diff</code>, which compares the index with the working directory', '<code>git diff</code>, lệnh so index với thư mục làm việc'),
            B('<code>git diff HEAD</code>, which compares HEAD with the working directory', '<code>git diff HEAD</code>, lệnh so HEAD với thư mục làm việc'),
            B('<code>git diff --staged</code>, which compares HEAD with the index', '<code>git diff --staged</code>, lệnh so HEAD với index'),
            B('<code>git diff HEAD~1</code>, which compares the previous commit with the index', '<code>git diff HEAD~1</code>, lệnh so commit trước đó với index'),
          ],
          correct: 2,
          explanation: EX(
            'Verified by running all three: bare <code>git diff</code> printed <code>-v2 / +v3</code>, <code>git diff --staged</code> printed <code>-v1 / +v2</code>, and <code>git diff HEAD</code> printed <code>-v1 / +v3</code>. Lesson 1.3 calls these the three faces of diff, and each one compares a different pair of the three trees: <b>bare</b> = index ↔ working directory ("what have I changed that is not yet staged?"), <b>--staged</b> = HEAD ↔ index ("what exactly will my next commit contain?"), <b>HEAD</b> = HEAD ↔ working directory ("everything I have changed, staged or not"). <code>--staged</code> is the one worth running before every commit, because it is the only one that shows the commit you are actually about to make.',
            'Đã chạy thật cả ba: <code>git diff</code> trần in <code>-v2 / +v3</code>, <code>git diff --staged</code> in <code>-v1 / +v2</code>, và <code>git diff HEAD</code> in <code>-v1 / +v3</code>. Bài 1.3 gọi đây là ba khuôn mặt của diff, và mỗi cái so một cặp khác nhau trong ba cây: <b>trần</b> = index ↔ thư mục làm việc ("tôi đã sửa gì mà chưa add?"), <b>--staged</b> = HEAD ↔ index ("commit kế tiếp của tôi chứa CHÍNH XÁC những gì?"), <b>HEAD</b> = HEAD ↔ thư mục làm việc ("tất cả những gì tôi đã sửa, add rồi hay chưa"). <code>--staged</code> là cái đáng chạy trước mỗi lần commit, vì nó là cái duy nhất cho thấy đúng commit bạn sắp tạo.',
          ),
        }),

        mcq({
          prompt: B(
            'On a linear history (no merges), what happens when you run <code>git show HEAD^2</code>?',
            'Trên một lịch sử thẳng (không có merge), chạy <code>git show HEAD^2</code> thì điều gì xảy ra?',
          ),
          options: [
            B(
              'It fails: <code>fatal: ambiguous argument &#x27;HEAD^2&#x27;: unknown revision or path not in the working tree.</code> — <code>^2</code> selects the <em>second parent</em>, which only a merge commit has',
              'Nó thất bại: <code>fatal: ambiguous argument &#x27;HEAD^2&#x27;: unknown revision or path not in the working tree.</code> — <code>^2</code> chọn <em>commit cha thứ hai</em>, thứ mà chỉ commit merge mới có',
            ),
            B(
              'It shows the grandparent, exactly like <code>HEAD~2</code> — <code>^</code> and <code>~</code> are two spellings of the same thing',
              'Nó hiện commit ông, y hệt <code>HEAD~2</code> — <code>^</code> và <code>~</code> là hai cách viết của cùng một thứ',
            ),
            B(
              'It shows the current commit twice, because <code>^2</code> is read as "apply <code>^</code> zero times, then take entry 2"',
              'Nó hiện commit hiện tại hai lần, vì <code>^2</code> được hiểu là "áp dụng <code>^</code> không lần nào, rồi lấy mục số 2"',
            ),
            B(
              'It shows the second-most-recent commit on the branch, i.e. the same as <code>HEAD~1</code>',
              'Nó hiện commit mới thứ nhì trên nhánh, tức là giống <code>HEAD~1</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it — that is the exact message git 2.51.1 printed. Lesson 1.2 draws the line clearly: <code>~</code> means <b>walk back N generations</b>, always following the first parent, so <code>HEAD~2</code> is the grandparent; <code>^</code> means <b>choose which parent</b>, so <code>HEAD^1</code> is the first parent (identical to <code>HEAD~1</code>) and <code>HEAD^2</code> is the second — the branch that was merged in. An ordinary commit has one parent, so there is no second one to name and Git errors out. The course calls the mix-up "harmless with <code>show</code> and expensive with <code>reset</code>", which is exactly right: on a merge commit, <code>reset --hard HEAD^2</code> throws you onto the wrong side of the merge.',
            'Đã chạy thật — đó đúng là thông báo git 2.51.1 in ra. Bài 1.2 vạch ranh giới rất rõ: <code>~</code> nghĩa là <b>lùi N thế hệ</b>, luôn đi theo commit cha thứ nhất, nên <code>HEAD~2</code> là commit ông; <code>^</code> nghĩa là <b>chọn commit cha nào</b>, nên <code>HEAD^1</code> là cha thứ nhất (y hệt <code>HEAD~1</code>) còn <code>HEAD^2</code> là cha thứ hai — nhánh đã được merge vào. Một commit thường chỉ có một cha, nên không có cha thứ hai để gọi tên và Git báo lỗi. Giáo trình gọi vụ nhầm này là "vô hại với <code>show</code> và đắt đỏ với <code>reset</code>", và đúng thế: trên một commit merge, <code>reset --hard HEAD^2</code> ném bạn sang đúng phía sai của phép merge.',
          ),
        }),

        // ── Chương 2 — Đọc lịch sử ──────────────────────────────────────
        mcq({
          prompt: B(
            'A file went through five commits: C1 adds <code>alpha()</code>; C2 adds <code>calcTax()</code>; C3 edits the body of <code>calcTax()</code>; C4 removes <code>calcTax()</code>; C5 adds <code>beta()</code>. How many commits does each of the two searches list?' + code(
              'git log -S"calcTax" --oneline\n' +
              'git log -G"calcTax" --oneline',
            ),
            'Một file đi qua năm commit: C1 thêm <code>alpha()</code>; C2 thêm <code>calcTax()</code>; C3 sửa thân hàm <code>calcTax()</code>; C4 xoá <code>calcTax()</code>; C5 thêm <code>beta()</code>. Mỗi phép tìm sau liệt kê bao nhiêu commit?' + code(
              'git log -S"calcTax" --oneline\n' +
              'git log -G"calcTax" --oneline',
            ),
          ),
          options: [
            B('<code>-S</code> lists 3 (C2, C3, C4) and <code>-G</code> lists 2 (C2, C4)', '<code>-S</code> liệt kê 3 (C2, C3, C4) và <code>-G</code> liệt kê 2 (C2, C4)'),
            B('Both list the same 3 commits (C2, C3, C4) — the two flags differ only in regex support', 'Cả hai liệt kê cùng 3 commit (C2, C3, C4) — hai cờ chỉ khác nhau ở chỗ có nhận biểu thức chính quy hay không'),
            B('<code>-S</code> lists 2 (C2, C4) and <code>-G</code> lists 3 (C2, C3, C4)', '<code>-S</code> liệt kê 2 (C2, C4) và <code>-G</code> liệt kê 3 (C2, C3, C4)'),
            B('Both list all 5, because every commit touched the file the string lives in', 'Cả hai liệt kê đủ 5, vì mọi commit đều đụng vào file chứa chuỗi đó'),
          ],
          correct: 2,
          explanation: EX(
            'Verified by building exactly that history and running both commands. <b><code>-S</code> is the pickaxe</b>: it reports only commits where the <em>number of occurrences</em> of the string changed — so it finds the commit that introduced <code>calcTax</code> and the commit that deleted it, and stays silent about C3, which merely edited the body while leaving one occurrence on each side. <b><code>-G</code> is looser</b>: it reports every commit whose diff contains a line matching the pattern, so it also catches C3. That difference is the whole reason both exist. Lesson 2.3 recommends <code>-S</code> for the question "when did this appear or vanish?", which is the archaeology question you usually have; reach for <code>-G</code> when you also want the edits in between.',
            'Đã chạy thật: dựng đúng lịch sử đó rồi chạy cả hai lệnh. <b><code>-S</code> là cái cuốc chim</b>: nó chỉ báo những commit làm <em>số lần xuất hiện</em> của chuỗi thay đổi — nên nó tìm ra commit khai sinh <code>calcTax</code> và commit xoá nó, và im lặng với C3, cái chỉ sửa thân hàm mà hai bên vẫn còn đúng một lần xuất hiện. <b><code>-G</code> lỏng hơn</b>: nó báo mọi commit có dòng nào trong diff khớp mẫu, nên bắt luôn C3. Khác biệt đó chính là lý do cả hai cùng tồn tại. Bài 2.3 khuyên dùng <code>-S</code> cho câu hỏi "thứ này xuất hiện hay biến mất lúc nào?", vốn là câu hỏi khảo cổ bạn hay gặp; dùng <code>-G</code> khi muốn thấy cả những lần sửa ở giữa.',
          ),
        }),

        mcq({
          prompt: B(
            'Branch <code>feat</code> forked from <code>main</code> and added <code>mine.txt</code>. Meanwhile <code>main</code> added <code>theirs.txt</code>. What does each diff print?' + code(
              'git diff --name-status main feat\n' +
              'git diff --name-status main...feat',
            ),
            'Nhánh <code>feat</code> tách ra từ <code>main</code> và thêm <code>mine.txt</code>. Trong lúc đó <code>main</code> thêm <code>theirs.txt</code>. Mỗi lệnh diff in ra gì?' + code(
              'git diff --name-status main feat\n' +
              'git diff --name-status main...feat',
            ),
          ),
          options: [
            B(
              'Two dots prints <code>A mine.txt</code> and <code>D theirs.txt</code>; three dots prints only <code>A mine.txt</code>',
              'Hai chấm in <code>A mine.txt</code> và <code>D theirs.txt</code>; ba chấm chỉ in <code>A mine.txt</code>',
            ),
            B(
              'Two dots prints only <code>A mine.txt</code>; three dots prints both, because it includes the other branch as well',
              'Hai chấm chỉ in <code>A mine.txt</code>; ba chấm in cả hai, vì nó gộp luôn nhánh kia vào',
            ),
            B(
              'They print the same two lines — the dot count only matters to <code>git log</code>, not to <code>git diff</code>',
              'Cả hai in cùng hai dòng — số dấu chấm chỉ có ý nghĩa với <code>git log</code>, không với <code>git diff</code>',
            ),
            B(
              'Two dots prints nothing because the branches share an ancestor; three dots prints <code>A mine.txt</code>',
              'Hai chấm không in gì vì hai nhánh có chung tổ tiên; ba chấm in <code>A mine.txt</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running both. <b>Two dots compares the two endpoints literally</b>, so a file that <code>main</code> gained after the fork shows up <em>reversed</em>, as though your branch had deleted it — hence the surprising <code>D theirs.txt</code>. <b>Three dots compares against the merge base</b>, answering "what did <em>this branch</em> change since we parted?" — which is why it lists only <code>mine.txt</code>. Lesson 2.2 notes that <b>a GitHub pull request shows you the three-dot diff</b>, and that a two-week-old branch can make the two-dot diff twice as large as the real change. Careful: for <code>git log</code> the meanings are different again — there <code>A..B</code> is the useful one and <code>A...B</code> means "unique to either side".',
            'Đã chạy thật cả hai. <b>Hai chấm so hai đầu mút theo đúng nghĩa đen</b>, nên một file mà <code>main</code> có thêm sau khi tách nhánh sẽ hiện ra <em>ngược</em>, như thể nhánh của bạn đã xoá nó — vì thế mới có dòng <code>D theirs.txt</code> gây bất ngờ. <b>Ba chấm so với điểm tách nhánh</b>, trả lời câu "riêng <em>nhánh này</em> đã đổi gì kể từ lúc rẽ?" — nên nó chỉ liệt kê <code>mine.txt</code>. Bài 2.2 lưu ý rằng <b>pull request trên GitHub cho bạn xem diff ba chấm</b>, và một nhánh hai tuần tuổi có thể làm diff hai chấm phình gấp đôi thay đổi thật. Cẩn thận: với <code>git log</code> thì hai nghĩa lại khác — ở đó <code>A..B</code> mới là cái hữu dụng còn <code>A...B</code> nghĩa là "riêng có ở một trong hai phía".',
          ),
        }),

        mcq({
          prompt: B(
            'You need to see what <code>src/config.ts</code> looked like at tag <code>v1.4.0</code>, without disturbing your work in progress. Which command does that?',
            'Bạn cần xem <code>src/config.ts</code> hồi ở tag <code>v1.4.0</code> trông ra sao, mà không được động vào việc đang làm dở. Lệnh nào làm được?',
          ),
          options: [
            B('<code>git checkout v1.4.0 src/config.ts</code> — it prints the old file to the terminal', '<code>git checkout v1.4.0 src/config.ts</code> — nó in file cũ ra terminal'),
            B('<code>git diff v1.4.0 src/config.ts</code> — a diff against a path shows the old version', '<code>git diff v1.4.0 src/config.ts</code> — diff với một đường dẫn sẽ hiện bản cũ'),
            B('<code>git log v1.4.0 -- src/config.ts</code> — the log of a path prints its contents at that point', '<code>git log v1.4.0 -- src/config.ts</code> — log của một đường dẫn in ra nội dung của nó tại thời điểm đó'),
            B('<code>git show v1.4.0:src/config.ts</code> — the <code>&lt;commit&gt;:&lt;path&gt;</code> syntax reads a file out of any commit', '<code>git show v1.4.0:src/config.ts</code> — cú pháp <code>&lt;commit&gt;:&lt;đường dẫn&gt;</code> đọc một file ra khỏi commit bất kỳ'),
          ],
          correct: 3,
          explanation: EX(
            'Lesson 2.2. The <code>&lt;commit&gt;:&lt;path&gt;</code> syntax reads one file out of the object database and writes it to standard output; nothing is checked out, nothing is staged, your working directory never moves. It pipes and redirects like any other command — <code>git show v1.4.0:src/config.ts &gt; /tmp/old-config.ts</code> — which makes it the fastest way to diff an old version against something outside the repository. Option 1 is actively dangerous: <code>git checkout &lt;commit&gt; &lt;path&gt;</code> does not print anything, it <b>overwrites the file on disk and stages it</b>, which is exactly the accident that made the Git project split <code>checkout</code> into <code>switch</code> and <code>restore</code> in 2.23.',
            'Bài 2.2. Cú pháp <code>&lt;commit&gt;:&lt;đường dẫn&gt;</code> đọc một file ra khỏi kho đối tượng và ghi ra đầu ra chuẩn; không checkout gì, không add gì, thư mục làm việc không nhúc nhích. Nó nối ống và chuyển hướng được như mọi lệnh khác — <code>git show v1.4.0:src/config.ts &gt; /tmp/old-config.ts</code> — nên đây là cách nhanh nhất để so một bản cũ với thứ gì đó nằm ngoài kho mã. Phương án 1 thì nguy hiểm thật sự: <code>git checkout &lt;commit&gt; &lt;đường dẫn&gt;</code> không in gì cả, nó <b>ghi đè file trên đĩa rồi đưa luôn vào index</b> — đúng cái tai nạn khiến dự án Git tách <code>checkout</code> thành <code>switch</code> và <code>restore</code> ở bản 2.23.',
          ),
        }),

        mcq({
          prompt: B(
            'You are running <code>git bisect run ./check.sh</code>. On some old commits the project does not even compile, so the test cannot say anything about the bug. What must <code>check.sh</code> exit with on those commits, and why?',
            'Bạn đang chạy <code>git bisect run ./check.sh</code>. Ở vài commit cũ, dự án còn không biên dịch nổi, nên phép thử không nói được gì về con lỗi. <code>check.sh</code> phải thoát với mã nào ở những commit đó, và vì sao?',
          ),
          options: [
            B(
              '<code>exit 125</code> — the reserved "cannot test this commit" code, which makes Git <b>skip</b> it instead of recording a verdict',
              '<code>exit 125</code> — mã dành riêng cho "không kiểm được commit này", khiến Git <b>bỏ qua</b> nó thay vì ghi nhận một phán quyết',
            ),
            B(
              '<code>exit 0</code> — treat it as good, because an untestable commit cannot be the one that broke things',
              '<code>exit 0</code> — coi như tốt, vì một commit không kiểm được thì không thể là commit gây lỗi',
            ),
            B(
              '<code>exit 1</code> — treat it as bad, so the search moves away from the broken region as fast as possible',
              '<code>exit 1</code> — coi như hỏng, để phép tìm rời khỏi vùng gãy càng nhanh càng tốt',
            ),
            B(
              '<code>exit 255</code> — the code that aborts the whole bisect so you can fix the build first',
              '<code>exit 255</code> — mã huỷ toàn bộ phiên bisect để bạn đi sửa build trước đã',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 2.4. <code>git bisect run</code> reads exit codes as verdicts — <b>0 means good, any non-zero means bad, and 125 is reserved for "this commit cannot be tested"</b>. On 125 Git skips the commit and picks a different one, so the binary search continues without recording a false answer. Options 2 and 3 both poison the search: bisect is a binary search, so one wrong verdict sends it down the wrong half and the "first bad commit" it eventually names is nonsense, <b>with no warning at all</b>. The same lesson warns about flaky tests for the same reason, and recommends running your check three times on a known-good and a known-bad commit before starting — bisect amplifies flakiness into confident wrong answers.',
            'Bài 2.4. <code>git bisect run</code> đọc mã thoát như một phán quyết — <b>0 là tốt, khác 0 là hỏng, và 125 dành riêng cho "commit này không kiểm được"</b>. Gặp 125, Git bỏ qua commit đó và chọn commit khác, nên phép tìm nhị phân đi tiếp mà không ghi nhận một câu trả lời sai. Phương án 2 và 3 đều đầu độc phép tìm: bisect là tìm nhị phân, nên chỉ một phán quyết sai là nó lao xuống nửa sai, và cái "commit hỏng đầu tiên" nó nêu tên cuối cùng là vô nghĩa, <b>mà không hề có cảnh báo nào</b>. Cùng bài đó cảnh báo về test chập chờn vì đúng lý do này, và khuyên chạy phép kiểm ba lần trên một commit chắc chắn tốt và một commit chắc chắn hỏng trước khi bắt đầu — bisect khuếch đại sự chập chờn thành những câu trả lời sai đầy tự tin.',
          ),
        }),

        mcq({
          prompt: B(
            'A file was created as <code>old.txt</code>, edited, renamed to <code>new.txt</code> with <code>git mv</code>, then edited again — four commits in total. <code>git log --oneline -- new.txt</code> prints two lines. Why, and what prints all four?',
            'Một file được tạo tên <code>old.txt</code>, sửa, đổi tên thành <code>new.txt</code> bằng <code>git mv</code>, rồi sửa tiếp — tổng cộng bốn commit. <code>git log --oneline -- new.txt</code> in ra hai dòng. Vì sao, và lệnh nào in đủ bốn?',
          ),
          options: [
            B(
              'Because Git only keeps two commits per path; <code>git log --all -- new.txt</code> prints the rest',
              'Vì Git chỉ giữ hai commit cho mỗi đường dẫn; <code>git log --all -- new.txt</code> in ra phần còn lại',
            ),
            B(
              'Because <code>git mv</code> broke the link; <code>git log --oneline -- old.txt new.txt</code> is the only way to see all four',
              'Vì <code>git mv</code> làm đứt liên kết; <code>git log --oneline -- old.txt new.txt</code> là cách duy nhất thấy đủ bốn',
            ),
            B(
              'Because Git stores snapshots and never recorded a rename, so a path filter stops at the name change; <code>git log --oneline --follow -- new.txt</code> infers it and prints all four',
              'Vì Git lưu ảnh chụp và chưa từng ghi lại một phép đổi tên nào, nên bộ lọc theo đường dẫn dừng lại ở chỗ đổi tên; <code>git log --oneline --follow -- new.txt</code> suy ra được và in đủ bốn',
            ),
            B(
              'Because the two commits before the rename are on a different branch; <code>git log --oneline --graph --all</code> shows them',
              'Vì hai commit trước lúc đổi tên nằm trên một nhánh khác; <code>git log --oneline --graph --all</code> sẽ hiện chúng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Verified by running it: the bare path filter listed 2 commits and <code>--follow</code> listed 4. The deep reason is lesson 9.2’s point, not a quirk of <code>log</code>: <b>Git stores snapshots, and there is no rename in the object database.</b> A rename is simply a tree that stops mentioning one name and starts mentioning another, both pointing at the same blob. So a path filter genuinely has nothing to follow — until you pass <code>--follow</code>, which runs a <em>similarity heuristic</em> to guess that the old path became the new one. That is also why <code>--follow</code> accepts only one path at a time, and why it can be wrong when a file was renamed and heavily rewritten in the same commit.',
            'Đã chạy thật: bộ lọc đường dẫn trần liệt kê 2 commit và <code>--follow</code> liệt kê 4. Lý do sâu xa là ý của bài 9.2, không phải một nét lạ của <code>log</code>: <b>Git lưu ảnh chụp, và trong kho đối tượng không hề có khái niệm đổi tên.</b> Đổi tên chỉ đơn giản là một tree thôi nhắc tới tên cũ và bắt đầu nhắc tới tên mới, cả hai cùng trỏ vào một blob. Nên bộ lọc đường dẫn thật sự không có gì để lần theo — cho tới khi bạn đưa <code>--follow</code>, thứ chạy một <em>phép đoán theo độ giống nhau</em> để suy ra đường dẫn cũ đã thành đường dẫn mới. Đó cũng là lý do <code>--follow</code> chỉ nhận một đường dẫn mỗi lần, và lý do nó có thể đoán sai khi một file vừa bị đổi tên vừa bị viết lại gần hết trong cùng một commit.',
          ),
        }),

        // ── Chương 3 — Nhánh & hợp nhất ─────────────────────────────────
        mcq({
          prompt: B(
            '<code>main</code> is at commit A. <code>feat</code> was branched from A and has two commits on top. Nothing else happened. You run <code>git switch main && git merge feat</code>. What does <code>git log --oneline</code> then show?',
            '<code>main</code> đang ở commit A. <code>feat</code> tách ra từ A và có thêm hai commit. Không có gì khác xảy ra. Bạn chạy <code>git switch main && git merge feat</code>. Sau đó <code>git log --oneline</code> hiện gì?',
          ),
          options: [
            B(
              'Four lines: A, the two feature commits, and a merge commit created to join them',
              'Bốn dòng: A, hai commit của nhánh feat, và một commit merge được tạo ra để nối chúng lại',
            ),
            B(
              'Three lines, straight and with no merge commit — Git printed <code>Fast-forward</code> and simply slid the <code>main</code> pointer to the tip of <code>feat</code>',
              'Ba dòng, thẳng tắp và không có commit merge — Git in <code>Fast-forward</code> rồi chỉ trượt con trỏ <code>main</code> tới đầu nhánh <code>feat</code>',
            ),
            B(
              'One line — the two feature commits are squashed into A because they share its tree',
              'Một dòng — hai commit của nhánh feat bị gộp vào A vì chúng dùng chung tree của A',
            ),
            B(
              'It refuses with <code>Already up to date.</code> because <code>main</code> is an ancestor of <code>feat</code>',
              'Nó từ chối với <code>Already up to date.</code> vì <code>main</code> là tổ tiên của <code>feat</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it: Git printed <code>Updating c6dd99a..26545dc</code> then <code>Fast-forward</code>, and the log showed three commits in a straight line. Lesson 3.2 is built on this: <b>one command, two completely different operations.</b> Because A is an ancestor of the feature tip, everything in <code>main</code> is already contained in <code>feat</code> — there is nothing to reconcile, so Git moves a pointer and creates <b>no commit at all</b>. The cost, and the reason <code>--no-ff</code> exists, is in the last sentence of that lesson: afterwards you cannot tell that a branch ever existed. With <code>--no-ff</code> the same merge produced a merge commit and a visible branch shape, which is what makes <code>git log --first-parent</code> read as one line per feature.',
            'Đã chạy thật: Git in <code>Updating c6dd99a..26545dc</code> rồi <code>Fast-forward</code>, và log hiện ba commit thẳng hàng. Bài 3.2 dựng lên từ đúng chỗ này: <b>một lệnh, hai thao tác hoàn toàn khác nhau.</b> Vì A là tổ tiên của đầu nhánh feat, mọi thứ trong <code>main</code> đã nằm sẵn trong <code>feat</code> — không có gì phải hoà giải, nên Git dời một con trỏ và <b>không tạo commit nào cả</b>. Cái giá, và cũng là lý do <code>--no-ff</code> tồn tại, nằm ở câu cuối bài ấy: sau đó bạn không còn nhìn ra là đã từng có một nhánh. Với <code>--no-ff</code>, cũng phép merge đó đẻ ra một commit merge và một hình nhánh nhìn thấy được, và chính điều đó làm <code>git log --first-parent</code> đọc thành mỗi tính năng một dòng.',
          ),
        }),

        mcq({
          prompt: B(
            'You are on <code>feat</code> and run <code>git rebase main</code>. A conflict appears and the file contains:' + code(
              '<<<<<<< HEAD\n' +
              'TIMEOUT = 90\n' +
              '=======\n' +
              'TIMEOUT = 60\n' +
              '>>>>>>> 535cb93 (feat: bump to 60)',
            ) + 'Whose value is <code>90</code>?',
            'Bạn đang ở nhánh <code>feat</code> và chạy <code>git rebase main</code>. Xung đột hiện ra, file chứa:' + code(
              '<<<<<<< HEAD\n' +
              'TIMEOUT = 90\n' +
              '=======\n' +
              'TIMEOUT = 60\n' +
              '>>>>>>> 535cb93 (feat: bump to 60)',
            ) + 'Giá trị <code>90</code> là của ai?',
          ),
          options: [
            B(
              'Yours — <code>HEAD</code> always means the branch you typed the command on, which is <code>feat</code>',
              'Của bạn — <code>HEAD</code> luôn nghĩa là nhánh bạn đang gõ lệnh, tức <code>feat</code>',
            ),
            B(
              'Neither — the top block is always the merge base, i.e. the common ancestor',
              'Không của ai — khối trên luôn là điểm tách nhánh, tức tổ tiên chung',
            ),
            B(
              '<code>main</code>’s — during a rebase the labels invert: <code>HEAD</code> is the branch you are replaying <b>onto</b>, and your own commit is the one under the arrows',
              'Của <code>main</code> — trong lúc rebase các nhãn bị đảo: <code>HEAD</code> là nhánh bạn đang phát lại <b>lên trên</b>, còn commit của chính bạn nằm dưới các mũi tên',
            ),
            B(
              'Impossible to tell without <code>merge.conflictStyle=zdiff3</code>, which is the only way to label the sides',
              'Không thể biết nếu chưa bật <code>merge.conflictStyle=zdiff3</code>, vốn là cách duy nhất để dán nhãn hai phía',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Verified by running it: <code>main</code> held 90, <code>feat</code> held 60, and the rebase put 90 under <code>HEAD</code>. Lesson 3.3 calls this "the single most common cause of resolving a conflict backwards", and the mechanism is in 3.4: a rebase <b>replays your commits on top of theirs</b>, so at each step Git has already checked out the upstream branch and is applying <em>your</em> commit as the incoming change. During a plain <code>git merge</code> the labels are the other way round. The reliable habit the course gives is to <b>read the name after the closing arrows</b>, which is a commit subject during a rebase and a branch name during a merge — never assume from the word <code>HEAD</code>.',
            'Đã chạy thật: <code>main</code> giữ 90, <code>feat</code> giữ 60, và phép rebase đặt 90 dưới nhãn <code>HEAD</code>. Bài 3.3 gọi đây là "nguyên nhân số một khiến người ta giải quyết xung đột ngược", và cơ chế nằm ở bài 3.4: rebase <b>phát lại commit của bạn lên trên commit của họ</b>, nên ở mỗi bước Git đã checkout sẵn nhánh đích và đang áp <em>commit của bạn</em> vào như phần thay đổi đến sau. Trong một phép <code>git merge</code> thường thì hai nhãn ngược lại. Thói quen đáng tin mà giáo trình đưa ra là <b>đọc cái tên sau dãy mũi tên đóng</b> — trong lúc rebase nó là tiêu đề một commit, trong lúc merge nó là tên nhánh — đừng bao giờ suy từ chữ <code>HEAD</code>.',
          ),
        }),

        mcq({
          prompt: B(
            '<code>main</code> and <code>feat</code> diverged: <code>main</code> has 1 extra commit, <code>feat</code> has 2. Starting from the same repository, one developer runs <code>git merge feat</code> on <code>main</code>; another runs <code>git rebase main</code> on <code>feat</code>. How many commits does <code>git rev-list --count HEAD</code> report in each case?',
            '<code>main</code> và <code>feat</code> đã rẽ nhau: <code>main</code> có thêm 1 commit, <code>feat</code> có thêm 2. Xuất phát từ cùng một kho mã, một người chạy <code>git merge feat</code> trên <code>main</code>; người kia chạy <code>git rebase main</code> trên <code>feat</code>. <code>git rev-list --count HEAD</code> báo bao nhiêu commit trong mỗi trường hợp?',
          ),
          options: [
            B('Merge 5, rebase 5 — both integrate the same work, so the count must match', 'Merge 5, rebase 5 — cả hai gộp cùng một khối việc, nên số phải bằng nhau'),
            B('Merge 6, rebase 5 — the merge adds a merge commit, the rebase replays the two commits with new hashes and adds nothing', 'Merge 6, rebase 5 — merge thêm một commit merge, còn rebase phát lại hai commit với mã băm mới và không thêm gì'),
            B('Merge 5, rebase 6 — the rebase keeps the originals and adds copies', 'Merge 5, rebase 6 — rebase giữ lại bản gốc và thêm bản sao'),
            B('Merge 6, rebase 3 — the rebase discards the commits that came from <code>main</code>', 'Merge 6, rebase 3 — rebase vứt bỏ những commit đến từ <code>main</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running both on identical copies of the same repository: the merge history counted 6, the rebased history counted 5. The merge produced a commit with <b>two parents</b> and left both original lines intact. The rebase produced a straight line — but the two feature commits are <b>not the same commits any more</b>: their hashes changed, because a commit hash covers its parent, so changing the parent changes the child. Option 3 misreads that: the originals still exist in the object database and in the reflog, but the branch no longer points at them, so <code>rev-list</code> from <code>HEAD</code> cannot see them. That hash change is the entire risk profile of rebase, and the reason for the golden rule in 3.4.',
            'Đã chạy thật trên hai bản sao y hệt của cùng một kho: lịch sử sau merge đếm được 6, lịch sử sau rebase đếm được 5. Phép merge đẻ ra một commit có <b>hai cha</b> và giữ nguyên cả hai đường lịch sử. Phép rebase cho ra một đường thẳng — nhưng hai commit của nhánh feat <b>không còn là hai commit cũ nữa</b>: mã băm của chúng đã đổi, vì mã băm của một commit bao gồm cả mã băm của cha nó, nên đổi cha là đổi con. Phương án 3 hiểu sai chỗ đó: bản gốc vẫn còn trong kho đối tượng và trong reflog, nhưng nhánh không còn trỏ vào chúng nữa, nên <code>rev-list</code> đi từ <code>HEAD</code> không thấy. Chính việc đổi mã băm ấy là toàn bộ mức rủi ro của rebase, và là lý do có luật vàng ở bài 3.4.',
          ),
        }),

        mcq({
          prompt: B(
            'A branch has four commits: <code>feat: add login</code>, <code>fix typo</code>, <code>fix typo again</code>, on top of a base. You run <code>git rebase -i HEAD~3</code> and mark the last two lines <code>fixup</code> instead of <code>squash</code>. What is the resulting commit message?',
            'Một nhánh có bốn commit: <code>feat: add login</code>, <code>fix typo</code>, <code>fix typo again</code>, nằm trên một commit nền. Bạn chạy <code>git rebase -i HEAD~3</code> và đánh dấu hai dòng cuối là <code>fixup</code> thay vì <code>squash</code>. Lời nhắn của commit thu được là gì?',
          ),
          options: [
            B(
              'All three messages concatenated, with <code>fix typo</code> and <code>fix typo again</code> in the body',
              'Cả ba lời nhắn nối lại, với <code>fix typo</code> và <code>fix typo again</code> nằm trong phần thân',
            ),
            B(
              'The last one, <code>fix typo again</code>, because <code>fixup</code> keeps the newest message',
              'Cái cuối cùng, <code>fix typo again</code>, vì <code>fixup</code> giữ lời nhắn mới nhất',
            ),
            B(
              'An empty message, which is why <code>fixup</code> always opens an editor',
              'Một lời nhắn rỗng, và vì thế <code>fixup</code> luôn mở trình soạn thảo',
            ),
            B(
              'Just <code>feat: add login</code> — <code>fixup</code> melds into the commit above it in the list and <b>discards</b> its own message',
              'Chỉ còn <code>feat: add login</code> — <code>fixup</code> gộp vào commit nằm TRÊN nó trong danh sách và <b>vứt bỏ</b> lời nhắn của chính nó',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Verified by running both variants on the same starting history. With <code>fixup</code> the resulting message was exactly <code>feat: add login</code>; with <code>squash</code> it was the three messages concatenated — which is the trap lesson 3.5 names, a commit whose body reads "wip / fix typo / actually fix it". Two mechanics are worth memorising. First, the to-do list is in <b>oldest-first</b> order, the reverse of <code>git log</code>, so "the previous commit" that <code>squash</code> and <code>fixup</code> meld into is the line <em>above</em>. Second, this is what <code>git commit --fixup &lt;sha&gt;</code> plus <code>git rebase -i --autosquash</code> automates: Git pre-arranges the list so each <code>fixup!</code> commit sits under its target already marked.',
            'Đã chạy thật cả hai biến thể trên cùng một lịch sử xuất phát. Với <code>fixup</code>, lời nhắn thu được đúng là <code>feat: add login</code>; với <code>squash</code>, nó là ba lời nhắn nối lại — đúng cái bẫy bài 3.5 nêu tên, một commit mà phần thân đọc thành "wip / fix typo / actually fix it". Có hai điểm cơ học đáng thuộc. Một, danh sách việc xếp theo thứ tự <b>cũ trước</b>, ngược với <code>git log</code>, nên "commit trước đó" mà <code>squash</code> và <code>fixup</code> gộp vào chính là dòng <em>ở trên</em>. Hai, đây đúng là thứ mà <code>git commit --fixup &lt;sha&gt;</code> cộng với <code>git rebase -i --autosquash</code> tự động hoá: Git xếp sẵn danh sách sao cho mỗi commit <code>fixup!</code> nằm ngay dưới đích của nó và đã được đánh dấu.',
          ),
        }),

        mcq({
          prompt: B(
            'Which situation does the golden rule of rebase forbid, and what is the failure it prevents?',
            'Luật vàng của rebase cấm tình huống nào, và nó ngăn được hỏng hóc gì?',
          ),
          options: [
            B(
              'Rebasing onto a branch that has a merge commit in it — Git cannot replay a commit with two parents and aborts',
              'Rebase lên một nhánh có commit merge bên trong — Git không phát lại được commit có hai cha nên nó huỷ giữa chừng',
            ),
            B(
              'Rebasing commits other people already have — the replay replaces them with new hashes, so a colleague’s next pull merges the old copies with the new ones and produces duplicate commits nobody can explain',
              'Rebase những commit mà người khác đã có — phép phát lại thay chúng bằng commit mới có mã băm khác, nên lần pull kế tiếp của đồng nghiệp sẽ merge bản cũ với bản mới và đẻ ra những commit trùng lặp không ai giải thích nổi',
            ),
            B(
              'Rebasing more than about twenty commits at once — the replay applies them one by one and conflicts compound past that point',
              'Rebase quá khoảng hai mươi commit một lúc — phép phát lại áp từng cái một và xung đột dồn lại quá mức đó',
            ),
            B(
              'Rebasing a branch that has an upstream set — Git refuses because the upstream would immediately be out of date',
              'Rebase một nhánh đã đặt upstream — Git từ chối vì upstream sẽ lạc hậu ngay lập tức',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Lesson 3.4. Everything about rebase follows from one fact: <b>it copies commits, it does not move them.</b> Once your colleague has pulled the originals, replacing them means their history and yours have silently diverged even though the code is identical — and Git, having no idea the two sets are "the same work", tries to reconcile both. The practical boundary the course gives is a question, not a rule to memorise: <em>have I pushed this branch, and could anyone have pulled it?</em> A personal feature branch nobody else touches is fine to rebase even after pushing, with <code>--force-with-lease</code>. <code>main</code>, <code>develop</code>, or a branch two people share is not. The team norm that follows: <b>rebase to update your own branch, merge to integrate it.</b>',
            'Bài 3.4. Mọi chuyện về rebase đều sinh ra từ một sự thật: <b>nó CHÉP commit chứ không DỜI commit.</b> Một khi đồng nghiệp đã pull bản gốc về, việc thay chúng đi nghĩa là lịch sử của họ và của bạn đã âm thầm rẽ nhau dù mã nguồn y hệt — và Git, vốn không biết hai bộ ấy là "cùng một khối việc", sẽ cố hoà giải cả hai. Ranh giới thực dụng mà giáo trình đưa ra là một câu hỏi chứ không phải một luật để học thuộc: <em>tôi đã push nhánh này chưa, và có ai kịp pull nó về không?</em> Một nhánh tính năng riêng không ai đụng tới thì rebase thoải mái kể cả sau khi push, dùng <code>--force-with-lease</code>. <code>main</code>, <code>develop</code>, hay một nhánh hai người cùng làm thì không. Chuẩn mực nhóm suy ra từ đó: <b>rebase để cập nhật nhánh của mình, merge để đưa nó vào chung.</b>',
          ),
        }),

        mcq({
          prompt: B(
            'Your branch renamed <code>getUser()</code> to <code>fetchUser()</code>. A colleague’s branch added three new calls to <code>getUser()</code>. Both branches merge into <code>main</code> with <b>zero conflicts</b>, and the build then fails. What is this called, and what is the defence?',
            'Nhánh của bạn đổi tên <code>getUser()</code> thành <code>fetchUser()</code>. Nhánh của một đồng nghiệp thêm ba lời gọi mới tới <code>getUser()</code>. Cả hai nhánh merge vào <code>main</code> với <b>không một xung đột nào</b>, rồi build gãy. Chuyện này gọi là gì, và cách phòng là gì?',
          ),
          options: [
            B(
              'A semantic conflict — Git merges text, not meaning, so the only defence is running the tests <b>after</b> every merge, never just before',
              'Xung đột ngữ nghĩa — Git hợp nhất văn bản chứ không hợp nhất ý nghĩa, nên cách phòng duy nhất là chạy test <b>SAU</b> mỗi lần merge, không phải chỉ trước đó',
            ),
            B(
              'A rename conflict — Git should have detected it, and <code>git merge -M</code> turns rename detection on',
              'Xung đột đổi tên — lẽ ra Git phải phát hiện được, và <code>git merge -M</code> bật tính năng dò đổi tên',
            ),
            B(
              'A fast-forward error — merging two branches into the same base without <code>--no-ff</code> loses one side',
              'Lỗi fast-forward — merge hai nhánh vào cùng một nền mà không dùng <code>--no-ff</code> thì mất một phía',
            ),
            B(
              'A stale index — the merge used cached blobs, and <code>git merge --renormalize</code> is the fix',
              'Index lạc hậu — phép merge dùng blob trong bộ nhớ đệm, và <code>git merge --renormalize</code> là cách sửa',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 3.2 names this a <b>semantic conflict</b> and calls it the trap of "assuming a successful merge means working code". Git merges lines of text. Neither branch touched the same lines, so there is genuinely nothing for Git to ask you about — the merge is textually perfect and semantically broken. No flag fixes it, because the information Git would need is "these calls refer to that function", which is a property of the language, not of the file. Chapter 6.4 turns this into infrastructure: <b>"require status checks" plus "require the branch to be up to date"</b> is the pair that closes exactly this hole, by forcing CI to run against the current <code>main</code> rather than last week’s. Chapter 6.3 adds the repository-scale version, a merge queue.',
            'Bài 3.2 gọi đây là <b>xung đột ngữ nghĩa</b>, và gọi nó là cái bẫy "tưởng merge thành công nghĩa là mã chạy được". Git hợp nhất các dòng văn bản. Hai nhánh không đụng vào cùng dòng nào, nên thật sự chẳng có gì để Git hỏi bạn — phép merge hoàn hảo về mặt văn bản và gãy về mặt ngữ nghĩa. Không cờ nào sửa được, vì thông tin Git cần là "mấy lời gọi này trỏ tới hàm kia", mà đó là chuyện của ngôn ngữ chứ không phải của file. Chương 6.4 biến điều này thành hạ tầng: <b>"bắt buộc các phép kiểm phải xanh" cộng với "bắt buộc nhánh phải cập nhật"</b> chính là cặp bịt đúng lỗ hổng này, bằng cách ép CI chạy trên <code>main</code> hiện tại chứ không phải <code>main</code> tuần trước. Chương 6.3 bổ sung phiên bản quy mô cả kho: hàng đợi merge.',
          ),
        }),

        // ── Chương 4 — Hoàn tác an toàn ─────────────────────────────────
        mcq({
          prompt: B(
            'Commit C added a brand-new file <code>b.txt</code>. Three copies of the repository each run one command. What does <code>git status --short</code> print in each?' + code(
              'git reset --soft  HEAD~1\n' +
              'git reset --mixed HEAD~1\n' +
              'git reset --hard  HEAD~1',
            ),
            'Commit C thêm một file mới toanh <code>b.txt</code>. Ba bản sao của kho mã, mỗi bản chạy một lệnh. <code>git status --short</code> in ra gì ở từng bản?' + code(
              'git reset --soft  HEAD~1\n' +
              'git reset --mixed HEAD~1\n' +
              'git reset --hard  HEAD~1',
            ),
          ),
          options: [
            B(
              'soft <code>?? b.txt</code> · mixed <code>A  b.txt</code> · hard nothing, and <code>b.txt</code> is deleted',
              'soft <code>?? b.txt</code> · mixed <code>A  b.txt</code> · hard không gì cả, và <code>b.txt</code> bị xoá',
            ),
            B(
              'soft <code>A  b.txt</code> · mixed <code>?? b.txt</code> · hard nothing, and <code>b.txt</code> is deleted from disk',
              'soft <code>A  b.txt</code> · mixed <code>?? b.txt</code> · hard không gì cả, và <code>b.txt</code> bị xoá khỏi đĩa',
            ),
            B(
              'All three print nothing — <code>reset</code> only moves the branch pointer, and the file is restored from the commit either way',
              'Cả ba đều không in gì — <code>reset</code> chỉ dời con trỏ nhánh, và file được khôi phục từ commit trong cả ba trường hợp',
            ),
            B(
              'soft <code>A  b.txt</code> · mixed <code>A  b.txt</code> · hard <code>?? b.txt</code>, because <code>--hard</code> untracks rather than deletes',
              'soft <code>A  b.txt</code> · mixed <code>A  b.txt</code> · hard <code>?? b.txt</code>, vì <code>--hard</code> chỉ thôi theo dõi chứ không xoá',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running all three on identical copies. <code>git reset</code> <b>always does the same first thing</b> — move the branch pointer — and the flag decides how far the change propagates down the three trees. <b>--soft</b> stops there, so the index still holds C’s content and the file shows as <em>staged</em> (<code>A</code> in the left column). <b>--mixed</b>, the default, also resets the index, so the content survives only on disk; since <code>b.txt</code> did not exist in the older commit, it comes back as <em>untracked</em> (<code>??</code>). <b>--hard</b> overwrites the working directory too, and the file is gone. Only that third one destroys anything: <code>--soft</code> and <code>--mixed</code> cannot lose work, which is why <code>git reset --soft HEAD~1</code> is the undo worth memorising.',
            'Đã chạy thật cả ba trên ba bản sao y hệt. <code>git reset</code> <b>luôn làm cùng một việc đầu tiên</b> — dời con trỏ nhánh — và cái cờ quyết định thay đổi ấy lan xuống ba cây tới đâu. <b>--soft</b> dừng ngay đó, nên index vẫn giữ nội dung của C và file hiện ra là <em>đã vào index</em> (<code>A</code> ở cột trái). <b>--mixed</b>, mặc định, đặt lại cả index, nên nội dung chỉ còn sống trên đĩa; vì <code>b.txt</code> không tồn tại trong commit cũ hơn, nó quay lại dưới dạng <em>chưa được theo dõi</em> (<code>??</code>). <b>--hard</b> ghi đè luôn thư mục làm việc, và file biến mất. Chỉ cái thứ ba phá huỷ thứ gì đó: <code>--soft</code> và <code>--mixed</code> không thể làm mất việc, và vì thế <code>git reset --soft HEAD~1</code> là phép hoàn tác đáng thuộc lòng.',
          ),
        }),

        mcq({
          prompt: B(
            'History is A, B, C (each adds one file). One repository runs <code>git revert HEAD~1</code>; an identical one runs <code>git reset --hard HEAD~1</code>. Which pair of results is correct?',
            'Lịch sử là A, B, C (mỗi commit thêm một file). Một kho chạy <code>git revert HEAD~1</code>; một kho y hệt chạy <code>git reset --hard HEAD~1</code>. Cặp kết quả nào đúng?',
          ),
          options: [
            B(
              'Both end with two commits and the same files — <code>revert</code> is just a safer spelling of <code>reset</code>',
              'Cả hai còn lại hai commit và cùng bộ file — <code>revert</code> chỉ là cách viết an toàn hơn của <code>reset</code>',
            ),
            B(
              'revert: 4 commits, top one named <code>Revert "B add b.txt"</code>, files <code>a.txt</code> and <code>c.txt</code> · reset: 2 commits, files <code>a.txt</code> and <code>b.txt</code>',
              'revert: 4 commit, commit trên cùng tên là <code>Revert "B add b.txt"</code>, còn <code>a.txt</code> và <code>c.txt</code> · reset: 2 commit, còn <code>a.txt</code> và <code>b.txt</code>',
            ),
            B(
              'revert: 3 commits with B rewritten in place, files <code>a.txt</code> and <code>c.txt</code> · reset: 2 commits, files <code>a.txt</code> and <code>b.txt</code>',
              'revert: 3 commit với B bị viết lại tại chỗ, còn <code>a.txt</code> và <code>c.txt</code> · reset: 2 commit, còn <code>a.txt</code> và <code>b.txt</code>',
            ),
            B(
              'revert: 4 commits, files <code>a.txt</code>, <code>b.txt</code> and <code>c.txt</code> — a revert records the intent but does not change the working tree until you commit again',
              'revert: 4 commit, còn <code>a.txt</code>, <code>b.txt</code> và <code>c.txt</code> — revert chỉ ghi nhận ý định chứ chưa đổi cây làm việc cho tới khi bạn commit lần nữa',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running both. This is the shape of the whole chapter. <b>revert goes forwards</b>: it computes the inverse of B and adds it as a <em>new</em> commit, so history grew from 3 to 4, <code>b.txt</code> disappeared, and C’s work is untouched. <b>reset goes backwards</b>: the branch stops pointing at B and C, so history shrank to 2 and <code>c.txt</code> is gone with it. The consequence for other people is the reason the distinction matters: reset rewrites history, so anyone who pulled C now disagrees with you, whereas revert changes nothing that already exists and every clone stays valid. On a shared branch, revert is not the polite option — it is the only correct one.',
            'Đã chạy thật cả hai. Đây là hình dáng của cả chương. <b>revert đi tới</b>: nó tính phần nghịch đảo của B rồi thêm vào như một commit <em>mới</em>, nên lịch sử tăng từ 3 lên 4, <code>b.txt</code> biến mất, và phần việc của C không hề bị đụng. <b>reset đi lùi</b>: nhánh thôi trỏ vào B và C, nên lịch sử co lại còn 2 và <code>c.txt</code> đi theo. Hệ quả với người khác chính là lý do phải phân biệt: reset viết lại lịch sử, nên ai đã pull C về giờ bất đồng với bạn, còn revert không đổi bất cứ thứ gì đã tồn tại nên mọi bản clone vẫn hợp lệ. Trên một nhánh dùng chung, revert không phải là phương án lịch sự — nó là phương án đúng duy nhất.',
          ),
        }),

        mcq({
          prompt: B(
            'You try to undo a merge commit and Git answers:' + code(
              'error: commit 9e96a30338d6452793bb78e4157b411c1ff301fd is a merge but no -m option was given.\n' +
              'fatal: revert failed',
            ) + 'What does <code>-m 1</code> mean, and what does the course warn you about afterwards?',
            'Bạn định hoàn tác một commit merge và Git trả lời:' + code(
              'error: commit 9e96a30338d6452793bb78e4157b411c1ff301fd is a merge but no -m option was given.\n' +
              'fatal: revert failed',
            ) + '<code>-m 1</code> nghĩa là gì, và giáo trình cảnh báo điều gì xảy ra sau đó?',
          ),
          options: [
            B(
              'It reverts only the first file listed in the merge, in the order Git printed them; afterwards you repeat the command with 2, 3 and so on until every file the merge touched has been undone one at a time',
              'Nó chỉ hoàn tác file đầu tiên trong phép merge, theo đúng thứ tự Git đã in ra; sau đó bạn lặp lại lệnh với 2, 3 và cứ thế cho tới khi mọi file mà phép merge đụng vào đều đã được hoàn tác từng cái một',
            ),
            B(
              'It sets how many parents the revert keeps, so <code>-m 1</code> keeps one of the two; afterwards the merge commit itself is deleted from history and the graph becomes linear again, as though the branch had never been merged',
              'Nó đặt số commit cha mà phép hoàn tác giữ lại, nên <code>-m 1</code> giữ một trong hai; sau đó chính commit merge bị xoá khỏi lịch sử và đồ thị trở lại thẳng hàng, như thể nhánh kia chưa từng được merge',
            ),
            B(
              'It names <b>parent 1 as the mainline</b> — keep the branch you were on, undo what was merged in; afterwards Git still considers those commits "already in main", so merging the branch again brings in only the newer commits and the feature ships half-missing unless you revert the revert',
              'Nó chỉ định <b>commit cha số 1 là dòng chính</b> — giữ nhánh bạn đang đứng, hoàn tác phần được merge vào; sau đó Git vẫn coi các commit ấy là "đã có trong main", nên merge lại nhánh đó chỉ mang về những commit mới hơn và tính năng lên thiếu một nửa, trừ khi bạn hoàn tác chính cái hoàn tác',
            ),
            B(
              'It reverts one commit inside the merged branch, the one at position 1 counting from the merge base; afterwards nothing special applies and you can merge the branch again at any time to bring the rest of it in',
              'Nó hoàn tác một commit bên trong nhánh đã merge, cái ở vị trí số 1 tính từ điểm tách nhánh; sau đó không có gì đặc biệt và bạn merge lại nhánh đó lúc nào cũng được để mang phần còn lại vào',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The error text is verbatim from git 2.51.1. A merge commit has two parents, so "undo it" is ambiguous until you say <em>relative to which side</em>: <code>-m 1</code> means treat parent 1 — the branch you were on when you merged, usually <code>main</code> — as the mainline, so Git keeps that line of history and undoes everything the merged branch brought in. Running it was verified: the feature’s files disappeared and the mainline file stayed. The long tail in lesson 4.3 is the part people are caught by: <b>ancestry does not change when content is reverted.</b> Those commits are still ancestors of <code>main</code>, so a second merge of the same branch brings in only what is new. The standard fix is to revert the revert before merging again.',
            'Đoạn lỗi trên là nguyên văn của git 2.51.1. Một commit merge có hai cha, nên "hoàn tác nó" là mơ hồ cho tới khi bạn nói rõ <em>so với phía nào</em>: <code>-m 1</code> nghĩa là coi cha số 1 — nhánh bạn đang đứng lúc merge, thường là <code>main</code> — là dòng chính, nên Git giữ đường lịch sử đó và hoàn tác mọi thứ nhánh kia mang vào. Đã chạy thật để kiểm: các file của nhánh tính năng biến mất, file của dòng chính ở lại. Cái đuôi dài ở bài 4.3 mới là chỗ người ta hay dính: <b>quan hệ tổ tiên không đổi khi nội dung bị hoàn tác.</b> Những commit ấy vẫn là tổ tiên của <code>main</code>, nên merge lần thứ hai cùng nhánh đó chỉ mang về phần mới. Cách sửa chuẩn là hoàn tác chính cái commit hoàn tác trước khi merge lại.',
          ),
        }),

        mcq({
          prompt: B(
            'Which of these can <code>git reflog</code> <b>not</b> get back?',
            '<code>git reflog</code> <b>KHÔNG</b> lấy lại được thứ nào sau đây?',
          ),
          options: [
            B('A branch deleted with <code>git branch -D</code> an hour ago', 'Một nhánh vừa bị xoá bằng <code>git branch -D</code> một tiếng trước'),
            B('Two hours of edits that were never committed, wiped by <code>git reset --hard</code>', 'Hai tiếng sửa code chưa từng được commit, bị <code>git reset --hard</code> quét sạch'),
            B('Commits abandoned by an interactive rebase that finished yesterday', 'Những commit bị một phiên rebase tương tác hôm qua bỏ lại'),
            B('The state of <code>main</code> before this morning’s <code>git pull</code>', 'Trạng thái của <code>main</code> trước lần <code>git pull</code> sáng nay'),
          ],
          correct: 1,
          explanation: EX(
            'This is the one real gap in Git’s safety net, and lesson 4.4 states it as a rule: <b>Git can recover anything it has seen; it cannot recover what it was never shown.</b> The reflog records <em>where <code>HEAD</code> has pointed</em>, so it is a list of commits — which is why the other three are all recoverable (<code>git switch -c rescue &lt;hash&gt;</code>, <code>git reset --hard HEAD@{n}</code>, <code>git diff main@{1} main</code>). Uncommitted edits were never given to Git, so there is no object and no entry. Two consequences worth carrying: only three commands routinely destroy uncommitted content — <code>restore &lt;file&gt;</code>, <code>reset --hard</code> and the old <code>checkout -- &lt;file&gt;</code> — and <code>git stash -u</code> before anything risky converts them from destructive to reversible.',
            'Đây đúng là lỗ hổng thật duy nhất trong lưới an toàn của Git, và bài 4.4 phát biểu nó thành luật: <b>Git lấy lại được mọi thứ nó đã từng thấy; nó không lấy lại được thứ chưa bao giờ được đưa cho nó.</b> Reflog ghi lại <em><code>HEAD</code> đã từng trỏ vào đâu</em>, nên nó là một danh sách commit — vì thế ba phương án còn lại đều cứu được (<code>git switch -c rescue &lt;hash&gt;</code>, <code>git reset --hard HEAD@{n}</code>, <code>git diff main@{1} main</code>). Những sửa đổi chưa commit thì chưa bao giờ được giao cho Git, nên không có đối tượng nào và không có mục nào. Hai hệ quả đáng mang theo: chỉ ba lệnh thường ngày phá huỷ nội dung chưa commit — <code>restore &lt;file&gt;</code>, <code>reset --hard</code> và cách viết cũ <code>checkout -- &lt;file&gt;</code> — và một lệnh <code>git stash -u</code> trước khi làm gì mạo hiểm biến chúng từ phá huỷ thành đảo ngược được.',
          ),
        }),

        mcq({
          prompt: B(
            'Your work in progress is an edit to <code>a.txt</code> plus a brand-new file <code>new.txt</code>. You run plain <code>git stash</code> and then switch branches. What happened?',
            'Việc dở dang của bạn gồm một sửa đổi trong <code>a.txt</code> cộng một file mới toanh <code>new.txt</code>. Bạn chạy <code>git stash</code> trần rồi chuyển nhánh. Chuyện gì đã xảy ra?',
          ),
          options: [
            B(
              'Both were stashed; the working directory is clean and switching is safe',
              'Cả hai đã vào stash; thư mục làm việc sạch và việc chuyển nhánh là an toàn',
            ),
            B(
              'Neither was stashed — plain <code>git stash</code> refuses to run while an untracked file is present',
              'Không cái nào vào stash — <code>git stash</code> trần từ chối chạy khi còn file chưa được theo dõi',
            ),
            B(
              'Only <code>new.txt</code> was stashed; tracked modifications stay in place so you do not lose them',
              'Chỉ <code>new.txt</code> vào stash; các sửa đổi trên file đang theo dõi ở nguyên chỗ để bạn khỏi mất',
            ),
            B(
              'Only the edit to <code>a.txt</code> was stashed; <code>new.txt</code> is untracked, so it stayed on disk and <b>came with you onto the other branch</b> — you needed <code>git stash -u</code>',
              'Chỉ sửa đổi trong <code>a.txt</code> vào stash; <code>new.txt</code> chưa được theo dõi nên nó ở lại trên đĩa và <b>đi theo bạn sang nhánh kia</b> — lẽ ra phải dùng <code>git stash -u</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Verified by running it: after plain <code>git stash</code> the status was <code>?? new.txt</code> and the file was still on disk; after <code>git stash -u</code> it was gone. Lesson 4.5 flags this precisely because of what happens next — the untracked file follows you onto the other branch, where it does not belong, and a careless <code>git add .</code> commits it there. <code>-u</code> also stashes untracked files; <code>-a</code> additionally stashes ignored ones, which is rarely what you want since that sweeps up <code>node_modules</code> and <code>.env</code>. Two more habits from the same lesson: always <code>git stash push -m "…"</code>, because the default message <code>WIP on &lt;branch&gt;</code> tells you nothing three days later; and remember a stash never leaves your machine, so it is not a backup.',
            'Đã chạy thật: sau <code>git stash</code> trần thì status là <code>?? new.txt</code> và file vẫn nằm trên đĩa; sau <code>git stash -u</code> thì nó biến mất. Bài 4.5 nêu chuyện này chính vì hệ quả tiếp theo — file chưa theo dõi ấy đi theo bạn sang nhánh kia, nơi nó không thuộc về, và một cái <code>git add .</code> lơ đãng sẽ commit nó ở đó. <code>-u</code> stash luôn cả file chưa theo dõi; <code>-a</code> stash thêm cả file bị bỏ qua, thứ hiếm khi bạn muốn vì nó hốt luôn <code>node_modules</code> và <code>.env</code>. Hai thói quen nữa cùng bài: luôn dùng <code>git stash push -m "…"</code>, vì lời nhắn mặc định <code>WIP on &lt;branch&gt;</code> ba ngày sau chẳng nói được gì; và nhớ rằng stash không bao giờ rời khỏi máy bạn, nên nó không phải một bản sao lưu.',
          ),
        }),

        // ── Chương 5 — Remote & GitHub ──────────────────────────────────
        mcq({
          prompt: B(
            'You have not run any network command for a week. What exactly is <code>origin/main</code> right now?',
            'Bạn chưa chạy lệnh mạng nào suốt một tuần. Ngay lúc này, <code>origin/main</code> chính xác là cái gì?',
          ),
          options: [
            B(
              'A live view of the server: reading it makes Git open a connection and ask GitHub where <code>main</code> currently points, which is why <code>git log origin/main</code> is slower than <code>git log main</code> and fails with no network',
              'Một cửa sổ nhìn thẳng vào máy chủ: đọc nó là Git mở kết nối và hỏi GitHub xem <code>main</code> đang trỏ vào đâu, và vì thế <code>git log origin/main</code> chậm hơn <code>git log main</code> và sẽ hỏng khi không có mạng',
            ),
            B(
              'A remote-tracking branch — your <b>local, cached</b> record of where <code>main</code> was on the server at your last fetch, so it is a week out of date and <code>git log origin/main</code> will confidently show stale information',
              'Một nhánh theo dõi từ xa — bản ghi <b>cục bộ, đã đệm sẵn</b> về chỗ <code>main</code> đứng trên máy chủ ở lần fetch gần nhất, nên nó lạc hậu một tuần và <code>git log origin/main</code> sẽ hiện thông tin cũ một cách rất tự tin',
            ),
            B(
              'A branch you can commit on, exactly like <code>main</code>, which Git then pushes automatically the next time you are online — that is what makes it a "tracking" branch',
              'Một nhánh bạn commit lên được, y hệt <code>main</code>, và Git sẽ tự đẩy nó lên lần kế tiếp bạn có mạng — đó chính là ý nghĩa của chữ "theo dõi"',
            ),
            B(
              'An alias for the URL stored in <code>.git/config</code>, resolved fresh each time you use it; it holds no commit hash of its own, which is why deleting it does not lose any work',
              'Một biệt danh cho URL lưu trong <code>.git/config</code>, được phân giải lại mỗi lần bạn dùng; bản thân nó không giữ mã băm commit nào, và vì thế xoá nó đi không làm mất phần việc nào',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Lesson 5.1 puts three things side by side: <code>main</code> is a local branch you commit on; <code>origin/main</code> is a remote-tracking branch that <b>you cannot commit on</b> and that Git updates for you; and the real <code>main</code> on the server, which you never see directly. The trap named in the same lesson is exactly this question — trusting <code>git log origin/main</code> without fetching first. It reads the local cache, so after a week away it shows a week-old picture <b>with no warning</b>, and decisions made from it (should I rebase? is my fix already upstream?) will be wrong. The fix is one habit: make <code>git fetch</code> the first command of every session. It is the only network command in Git that cannot possibly cause a problem — it moves remote-tracking refs and touches nothing else.',
            'Bài 5.1 đặt ba thứ cạnh nhau: <code>main</code> là nhánh cục bộ bạn commit lên; <code>origin/main</code> là nhánh theo dõi từ xa mà <b>bạn không commit lên được</b> và do Git tự cập nhật; và <code>main</code> thật trên máy chủ, thứ bạn không bao giờ nhìn thấy trực tiếp. Cái bẫy nêu trong cùng bài chính là câu hỏi này — tin vào <code>git log origin/main</code> mà chưa fetch. Nó đọc bộ đệm cục bộ, nên sau một tuần vắng mặt nó cho bạn xem bức tranh cũ một tuần <b>mà không cảnh báo gì</b>, và mọi quyết định dựa trên đó (có nên rebase không? bản vá của mình đã lên trên chưa?) đều sẽ sai. Cách sửa là một thói quen: để <code>git fetch</code> làm lệnh đầu tiên của mỗi phiên làm việc. Nó là lệnh mạng duy nhất trong Git không thể gây ra vấn đề gì — nó dời các ref theo dõi từ xa và không đụng vào gì khác.',
          ),
        }),

        mcq({
          prompt: B(
            'Your push is refused:' + code(
              'To ../srv\n' +
              ' ! [rejected]        main -> main (fetch first)\n' +
              "error: failed to push some refs to '../srv'",
            ) + 'What is the correct response?',
            'Lệnh push của bạn bị từ chối:' + code(
              'To ../srv\n' +
              ' ! [rejected]        main -> main (fetch first)\n' +
              "error: failed to push some refs to '../srv'",
            ) + 'Phản ứng đúng là gì?',
          ),
          options: [
            B(
              '<code>git push --force</code> — your local branch is the one you have tested, so it should win',
              '<code>git push --force</code> — nhánh cục bộ mới là nhánh bạn đã kiểm thử, nên nó phải thắng',
            ),
            B(
              '<code>git push --set-upstream origin main</code> — the branch has lost its upstream link',
              '<code>git push --set-upstream origin main</code> — nhánh đã mất liên kết upstream',
            ),
            B(
              '<code>git pull --rebase</code>, resolve anything that conflicts, run the tests, then push — the remote has commits you do not have',
              '<code>git pull --rebase</code>, xử lý xung đột nếu có, chạy test, rồi push — máy chủ đang có những commit mà bạn chưa có',
            ),
            B(
              '<code>git fetch --prune</code> — the rejection means your <code>origin/main</code> ref is stale and needs cleaning',
              '<code>git fetch --prune</code> — lời từ chối nghĩa là ref <code>origin/main</code> của bạn đã cũ và cần được dọn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The rejection text is verbatim from git 2.51.1, produced by having a second clone push first. Lesson 5.3 asks you to read it as <em>information</em> rather than an obstacle: the remote contains work you do not have, and Git is protecting a colleague’s commits. Integrate first — the course says <code>git pull --rebase && git push</code> is right nine times in ten — then push. Option 1 is the wrong response the same lesson calls the most destructive thing an ordinary Git user can do: <code>--force</code> tells the server "discard whatever you have and take mine", and what it had was your colleague’s commits. If their laptop no longer has them, that work is gone. Chapter 8.2 covers <code>--force-with-lease</code>, which refuses in exactly this situation.',
            'Đoạn từ chối trên là nguyên văn của git 2.51.1, dựng ra bằng cách cho một bản clone thứ hai push trước. Bài 5.3 bảo bạn hãy đọc nó như <em>thông tin</em> chứ không phải chướng ngại: máy chủ đang chứa phần việc bạn chưa có, và Git đang bảo vệ commit của một đồng nghiệp. Hãy gộp vào trước — giáo trình nói <code>git pull --rebase && git push</code> đúng chín trên mười lần — rồi mới push. Phương án 1 là phản ứng sai mà cũng bài ấy gọi là thứ phá hoại nhất một người dùng Git bình thường có thể làm: <code>--force</code> bảo máy chủ "vứt hết những gì anh có và lấy của tôi", mà thứ nó đang có là commit của đồng nghiệp bạn. Nếu máy họ cũng không còn giữ nữa thì phần việc đó mất hẳn. Chương 8.2 nói về <code>--force-with-lease</code>, thứ từ chối đúng trong tình huống này.',
          ),
        }),

        mcq({
          prompt: B(
            'You run <code>git tag -a v1.5.0 -m "Release 1.5.0"</code>, then <code>git push origin main</code>, which succeeds. The release workflow that triggers on <code>push: tags: [&#x27;v*.*.*&#x27;]</code> never fires. Why?',
            'Bạn chạy <code>git tag -a v1.5.0 -m "Release 1.5.0"</code>, rồi <code>git push origin main</code> và nó thành công. Workflow phát hành có trigger <code>push: tags: [&#x27;v*.*.*&#x27;]</code> lại không chạy. Vì sao?',
          ),
          options: [
            B(
              'A tag is a separate ref and is <b>never</b> pushed along with commits — you need <code>git push origin v1.5.0</code>, or <code>git push --follow-tags</code>',
              'Tag là một ref riêng và <b>không bao giờ</b> được đẩy lên kèm với commit — bạn cần <code>git push origin v1.5.0</code>, hoặc <code>git push --follow-tags</code>',
            ),
            B(
              'Annotated tags are pushed but lightweight ones are not; <code>-a</code> was the mistake',
              'Tag có chú giải thì được đẩy còn tag nhẹ thì không; sai lầm nằm ở chữ <code>-a</code>',
            ),
            B(
              'The tag was pushed, but GitHub Actions ignores tag pushes made in the same operation as a branch push',
              'Tag đã được đẩy lên, nhưng GitHub Actions bỏ qua các lượt đẩy tag nằm chung một thao tác với lượt đẩy nhánh',
            ),
            B(
              'The pattern is wrong: <code>v*.*.*</code> does not match <code>v1.5.0</code>, and it should be <code>v*</code>',
              'Mẫu bị sai: <code>v*.*.*</code> không khớp <code>v1.5.0</code>, phải viết là <code>v*</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Lessons 5.3 and 7.2 both call this the most common release-day confusion: you tagged, you pushed, and nothing happened, because the tag never left your machine. Tags live under <code>refs/tags/</code>, entirely separate from <code>refs/heads/</code>, and a branch push moves exactly one ref. Three ways forward: <code>git push origin v1.5.0</code> for one tag, <code>git push origin --tags</code> for every local tag including the junk ones, and <code>git push --follow-tags</code>, which the course calls the sane default for a release workflow — it pushes the annotated tags that point into what you are already pushing, and ignores stray local ones. Option 2 inverts a real fact: <code>--follow-tags</code> does only carry annotated tags, but a plain branch push carries neither kind.',
            'Bài 5.3 và 7.2 đều gọi đây là nhầm lẫn phổ biến nhất trong ngày phát hành: bạn đã tag, đã push, mà không có gì xảy ra, vì cái tag chưa hề rời khỏi máy bạn. Tag sống dưới <code>refs/tags/</code>, tách hẳn khỏi <code>refs/heads/</code>, và một lượt push nhánh chỉ dời đúng một ref. Ba cách đi tiếp: <code>git push origin v1.5.0</code> cho một tag, <code>git push origin --tags</code> cho mọi tag cục bộ kể cả rác, và <code>git push --follow-tags</code>, thứ giáo trình gọi là mặc định tỉnh táo cho quy trình phát hành — nó đẩy những tag có chú giải trỏ vào phần bạn đang push, và bỏ qua các tag lạc. Phương án 2 nói ngược một sự thật có thật: <code>--follow-tags</code> đúng là chỉ mang tag có chú giải, nhưng một lượt push nhánh trần thì không mang loại nào cả.',
          ),
        }),

        mcq({
          prompt: B(
            'You forked a project you cannot push to. After cloning your fork and adding the original as a second remote, which remote is which?',
            'Bạn fork một dự án mà bạn không push lên được. Sau khi clone bản fork của mình và thêm dự án gốc làm remote thứ hai, remote nào là gì?',
          ),
          options: [
            B(
              '<code>origin</code> is the original project and <code>upstream</code> is your fork — you push to <code>upstream</code> and open the pull request from there',
              '<code>origin</code> là dự án gốc còn <code>upstream</code> là bản fork của bạn — bạn push lên <code>upstream</code> rồi mở pull request từ đó',
            ),
            B(
              'Both point at your fork; the original is reached through the pull request UI and is never a Git remote',
              'Cả hai đều trỏ vào bản fork của bạn; dự án gốc chỉ tiếp cận qua giao diện pull request và không bao giờ là một remote Git',
            ),
            B(
              '<code>origin</code> is <b>your fork</b> — the one you push to — and <code>upstream</code> is the original project, which you only ever fetch from',
              '<code>origin</code> là <b>bản fork của bạn</b> — nơi bạn push lên — còn <code>upstream</code> là dự án gốc, nơi bạn chỉ fetch về',
            ),
            B(
              'It does not matter — Git treats the two names identically and picks whichever one accepts your credentials',
              'Không quan trọng — Git coi hai cái tên như nhau và tự chọn cái nào chấp nhận thông tin đăng nhập của bạn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Lesson 5.4. You clone your fork, so <code>origin</code> is your fork by default, and you add the original as <code>upstream</code> with <code>git remote add upstream …</code>. You push to <code>origin</code> and fetch from <code>upstream</code>; the course even suggests <code>git remote set-url --push upstream DISABLED</code> to make pushing there physically impossible. The habit that matters most is the one people skip: <b>a fork does not update itself.</b> Before every new contribution run <code>git fetch upstream</code> then <code>git merge --ff-only upstream/main</code>, so your branch starts from the current project rather than from the day you forked. Branching off a stale fork produces a pull request full of conflicts before anyone has read a line of it.',
            'Bài 5.4. Bạn clone bản fork của mình, nên <code>origin</code> mặc định là bản fork, và bạn thêm dự án gốc làm <code>upstream</code> bằng <code>git remote add upstream …</code>. Bạn push lên <code>origin</code> và fetch từ <code>upstream</code>; giáo trình còn gợi ý <code>git remote set-url --push upstream DISABLED</code> để việc push lên đó thành bất khả thi về mặt vật lý. Thói quen quan trọng nhất lại là thứ người ta hay bỏ qua: <b>bản fork không tự cập nhật.</b> Trước mỗi lần đóng góp mới, hãy chạy <code>git fetch upstream</code> rồi <code>git merge --ff-only upstream/main</code>, để nhánh của bạn xuất phát từ dự án hiện tại chứ không phải từ cái ngày bạn bấm nút fork. Tách nhánh từ một bản fork cũ sẽ đẻ ra một pull request đầy xung đột trước khi có ai kịp đọc một dòng nào.',
          ),
        }),

        // ── Chương 6 — Pull request & review ────────────────────────────
        mcq({
          prompt: B(
            'Your team uses <b>Squash and merge</b>. Your branch has six commits, the last three named "wip", "fix typo" and "address review". The pull request is titled <b>Fixes</b>. What ends up on <code>main</code>?',
            'Nhóm bạn dùng <b>Squash and merge</b>. Nhánh của bạn có sáu commit, ba cái cuối tên là "wip", "fix typo" và "address review". Pull request đặt tiêu đề là <b>Fixes</b>. Cái gì rơi xuống <code>main</code>?',
          ),
          options: [
            B(
              'One commit whose message is <b>Fixes</b> — the PR title becomes the permanent commit message, and the six branch commits do not survive on <code>main</code>',
              'Một commit có lời nhắn là <b>Fixes</b> — tiêu đề PR trở thành lời nhắn commit vĩnh viễn, và sáu commit của nhánh không sống sót trên <code>main</code>',
            ),
            B(
              'One commit whose message is the first commit’s subject, with the other five listed in the body',
              'Một commit có lời nhắn là tiêu đề commit đầu tiên, năm cái còn lại liệt kê trong phần thân',
            ),
            B(
              'Six commits replayed onto <code>main</code>, plus a merge commit titled <b>Fixes</b>',
              'Sáu commit được phát lại lên <code>main</code>, cộng thêm một commit merge tên là <b>Fixes</b>',
            ),
            B(
              'One commit with an empty message, because GitHub refuses to reuse a title that is not a Conventional Commit',
              'Một commit có lời nhắn rỗng, vì GitHub từ chối dùng lại một tiêu đề không đúng chuẩn Conventional Commits',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 6.3. Squash-merge collapses the branch into a single new commit on <code>main</code> and takes its message from the <b>pull request title</b>, with the PR number appended — so a PR called "Fixes" becomes a commit called "Fixes (#431)" that nobody will ever be able to interpret. The lesson’s prescription follows directly: if your team squashes, enforce Conventional Commits on <b>PR titles</b>, which is a ten-line CI check that pays for itself. The trade-off is worth knowing in both directions. Squash gives the cleanest <code>main</code> — one commit per reviewed change, and every commit on <code>main</code> passed CI as a unit, which is the best possible case for <code>git bisect</code>. The cost is that a 900-line PR becomes one 900-line commit that <code>blame</code> and <code>bisect</code> cannot narrow any further.',
            'Bài 6.3. Squash-merge nén cả nhánh thành một commit mới trên <code>main</code> và lấy lời nhắn từ <b>tiêu đề pull request</b>, có thêm số hiệu PR ở cuối — nên một PR tên "Fixes" thành một commit tên "Fixes (#431)" mà sau này không ai hiểu nổi. Đơn thuốc của bài suy ra ngay từ đó: nếu nhóm bạn squash thì hãy ép chuẩn Conventional Commits lên <b>tiêu đề PR</b>, một phép kiểm CI mười dòng và tự nó trả đủ vốn. Đánh đổi đáng biết theo cả hai chiều. Squash cho <code>main</code> sạch nhất — mỗi thay đổi đã review là một commit, và mọi commit trên <code>main</code> đều từng qua CI trọn gói, tức là điều kiện tốt nhất cho <code>git bisect</code>. Cái giá là một PR 900 dòng thành một commit 900 dòng mà <code>blame</code> lẫn <code>bisect</code> không thu hẹp thêm được nữa.',
          ),
        }),

        mcq({
          prompt: B(
            'Your team uses <b>Rebase and merge</b>. What specific risk does the course attach to it that squash and merge-commit do not have?',
            'Nhóm bạn dùng <b>Rebase and merge</b>. Giáo trình gán cho nó rủi ro cụ thể nào mà squash và merge commit không có?',
          ),
          options: [
            B(
              'The pull request loses its link to the issue, because rebased commits no longer carry the <code>Closes #412</code> keyword',
              'Pull request mất liên kết với issue, vì các commit đã rebase không còn mang từ khoá <code>Closes #412</code>',
            ),
            B(
              'Each branch commit lands on <code>main</code> having <b>never been tested in that position</b> — CI tested only the branch tip — so <code>git bisect</code> can stop at a commit that fails for an unrelated reason',
              'Từng commit của nhánh rơi xuống <code>main</code> mà <b>chưa từng được kiểm thử ở vị trí đó</b> — CI chỉ kiểm đầu nhánh — nên <code>git bisect</code> có thể dừng ở một commit gãy vì lý do chẳng liên quan',
            ),
            B(
              'The merge cannot be reverted at all, because there is no merge commit to pass to <code>git revert -m 1</code>',
              'Phép merge không hoàn tác được, vì không có commit merge nào để đưa cho <code>git revert -m 1</code>',
            ),
            B(
              'It rewrites <code>main</code>, so everyone on the team has to force-pull after every merged pull request',
              'Nó viết lại <code>main</code>, nên cả nhóm phải pull cưỡng bức sau mỗi pull request được merge',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Lesson 6.3 attaches a danger callout to exactly this: <b>CI tests the tip of the branch.</b> With rebase-and-merge every intermediate commit is replayed onto <code>main</code> in a position it was never built in, so a "wip" commit that only compiled because the next commit fixed it now sits on <code>main</code> as a broken revision. Months later a bisect can land on it and report a first-bad-commit that has nothing to do with the bug you are hunting. That is why the course recommends rebase-and-merge only for disciplined teams who curate their branch before review, and squash as the default otherwise. Option 3 is wrong but points at a real difference: with rebase-and-merge you revert individual commits instead of one merge, which is more work rather than impossible.',
            'Bài 6.3 gắn một khối cảnh báo đỏ vào đúng chỗ này: <b>CI kiểm đầu nhánh.</b> Với rebase-and-merge, mọi commit trung gian đều được phát lại lên <code>main</code> ở một vị trí mà nó chưa từng được dựng, nên một commit "wip" vốn chỉ biên dịch được nhờ commit kế sau sửa hộ thì giờ nằm trên <code>main</code> như một bản gãy. Vài tháng sau, một phiên bisect có thể đáp trúng nó và báo ra một "commit hỏng đầu tiên" chẳng liên quan gì tới con lỗi bạn đang truy. Vì thế giáo trình chỉ khuyên dùng rebase-and-merge cho nhóm có kỷ luật, biết dọn nhánh trước khi review, còn mặc định thì dùng squash. Phương án 3 sai nhưng chỉ vào một khác biệt có thật: với rebase-and-merge bạn phải hoàn tác từng commit thay vì một commit merge — vất vả hơn chứ không phải bất khả thi.',
          ),
        }),

        mcq({
          prompt: B(
            'A pull request touches only <code>README.md</code>. Its merge button is greyed out forever, waiting on the required check <b>Lint &amp; Type Check</b>, and no CI run appears at all. What is the cause?',
            'Một pull request chỉ đụng vào <code>README.md</code>. Nút merge bị xám vĩnh viễn, chờ phép kiểm bắt buộc <b>Lint &amp; Type Check</b>, và không có lượt chạy CI nào xuất hiện. Nguyên nhân là gì?',
          ),
          options: [
            B(
              'The check ran and failed silently; re-running it with <code>gh run rerun --failed</code> clears the block',
              'Phép kiểm đã chạy và hỏng âm thầm; chạy lại bằng <code>gh run rerun --failed</code> là hết chặn',
            ),
            B(
              'Documentation-only pull requests are exempt from checks, so GitHub is waiting for a human override',
              'Pull request chỉ sửa tài liệu được miễn kiểm, nên GitHub đang chờ một người bấm bỏ qua',
            ),
            B(
              'Branch protection only applies to branches that changed code, so the rule is misconfigured and must be deleted',
              'Bảo vệ nhánh chỉ áp dụng cho nhánh có đổi mã, nên luật đang bị cấu hình sai và phải xoá đi',
            ),
            B(
              'The workflow has a path filter such as <code>paths: [&#x27;src/**&#x27;]</code>, so the job never runs — and a required check that never runs never reports, so GitHub waits for a result that will not arrive',
              'Workflow có bộ lọc đường dẫn kiểu <code>paths: [&#x27;src/**&#x27;]</code>, nên job không chạy — mà một phép kiểm bắt buộc không chạy thì không báo cáo gì, nên GitHub cứ chờ một kết quả sẽ không bao giờ tới',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Lesson 6.4 marks this as one of the two most important things in the chapter, and 11.2 repeats it from the Actions side. Branch protection waits for a <em>report</em> from a named job. A skipped job reports nothing — it is not "passed" and not "failed", it is absent — so the pull request blocks indefinitely with no error to read. The other way to trigger it is renaming a job, since the protection rule matches the exact <code>name:</code> string. Two fixes are given: drop the path filter, or add a trivial companion job with the <b>same name</b> that reports success on the skipped paths. Note that the check is required precisely so that nobody has to remember it, which is what makes the silent-wait failure mode so confusing when it appears.',
            'Bài 6.4 xếp chuyện này vào hai điều quan trọng nhất của chương, và bài 11.2 nhắc lại từ phía Actions. Bảo vệ nhánh chờ một <em>báo cáo</em> từ một job có tên cụ thể. Một job bị bỏ qua thì không báo cáo gì — nó không "đạt" và cũng không "hỏng", nó vắng mặt — nên pull request bị chặn vô thời hạn mà chẳng có lỗi nào để đọc. Cách kích hoạt còn lại là đổi tên job, vì luật bảo vệ khớp đúng chuỗi trong <code>name:</code>. Giáo trình đưa hai cách sửa: bỏ bộ lọc đường dẫn, hoặc thêm một job phụ tầm thường <b>trùng tên</b> và báo thành công cho những đường dẫn bị bỏ qua. Chú ý là phép kiểm được đặt là bắt buộc chính để không ai phải nhớ tới nó, và đó là lý do kiểu hỏng "chờ im lặng" này gây bối rối đến thế khi nó xuất hiện.',
          ),
        }),

        mcq({
          prompt: B(
            'A <code>.github/CODEOWNERS</code> file contains, in this order:' + code(
              '*                       @an\n' +
              '/src/services/          @backend-team\n' +
              '/src/services/payment/  @finance-lead',
            ) + 'Who is requested for review on a change to <code>/src/services/payment/refund.ts</code>?',
            'Một file <code>.github/CODEOWNERS</code> chứa, theo đúng thứ tự này:' + code(
              '*                       @an\n' +
              '/src/services/          @backend-team\n' +
              '/src/services/payment/  @finance-lead',
            ) + 'Ai được mời review khi có thay đổi ở <code>/src/services/payment/refund.ts</code>?',
          ),
          options: [
            B('All three, because every rule matches and CODEOWNERS accumulates owners', 'Cả ba, vì cả ba luật đều khớp và CODEOWNERS cộng dồn chủ sở hữu'),
            B('<code>@finance-lead</code> only — like <code>.gitignore</code>, the <b>last matching rule wins</b>', 'Chỉ <code>@finance-lead</code> — giống <code>.gitignore</code>, <b>luật khớp CUỐI CÙNG thắng</b>'),
            B('<code>@an</code> only, because the first rule is the most general and therefore the default owner', 'Chỉ <code>@an</code>, vì luật đầu tiên tổng quát nhất nên nó là chủ sở hữu mặc định'),
            B('<code>@backend-team</code> and <code>@finance-lead</code>, because both directory rules match while the glob does not', 'Cả <code>@backend-team</code> và <code>@finance-lead</code>, vì hai luật thư mục đều khớp còn luật glob thì không'),
          ],
          correct: 1,
          explanation: EX(
            'Lesson 6.4 states the precedence explicitly and compares it to <code>.gitignore</code>: <b>the last matching rule wins</b>, so ordering the file from general to specific is not cosmetic, it is the mechanism. Combined with the "Require review from Code Owners" protection rule, this makes a knowledge requirement structural rather than something a person has to remember — a change under <code>payment/</code> simply cannot merge without <code>@finance-lead</code>. The same lesson attaches the cost: every entry is a potential bottleneck. If <code>@finance-lead</code> is one person on holiday, every payment pull request stops. Assign <em>teams</em> rather than individuals, and keep the file short — a CODEOWNERS with forty rules is a repository where nothing merges on a Friday.',
            'Bài 6.4 nói rõ thứ tự ưu tiên và so nó với <code>.gitignore</code>: <b>luật khớp cuối cùng thắng</b>, nên việc xếp file từ tổng quát tới cụ thể không phải chuyện hình thức mà chính là cơ chế. Kết hợp với luật bảo vệ "Require review from Code Owners", điều này biến một yêu cầu về kiến thức thành cấu trúc thay vì thành thứ ai đó phải nhớ — một thay đổi dưới <code>payment/</code> đơn giản là không merge được nếu thiếu <code>@finance-lead</code>. Cùng bài ấy nêu luôn cái giá: mỗi dòng là một nút thắt tiềm tàng. Nếu <code>@finance-lead</code> là một người và người đó đi nghỉ, mọi pull request về thanh toán đứng lại. Hãy gán <em>nhóm</em> thay vì cá nhân, và giữ file ngắn — một CODEOWNERS bốn mươi dòng là một kho mã mà thứ Sáu không có gì merge được.',
          ),
        }),

        // ── Chương 7 — Quy trình nhóm, tag & phát hành ──────────────────
        mcq({
          prompt: B(
            'Two tags are created on the same commit, then inspected:' + code(
              'git tag v1.0.0-light\n' +
              'git tag -a v1.0.0 -m "Release 1.0.0"\n' +
              'git cat-file -t v1.0.0-light\n' +
              'git cat-file -t v1.0.0',
            ) + 'What do the two <code>cat-file</code> calls print, and why?',
            'Hai tag được tạo trên cùng một commit, rồi được soi:' + code(
              'git tag v1.0.0-light\n' +
              'git tag -a v1.0.0 -m "Release 1.0.0"\n' +
              'git cat-file -t v1.0.0-light\n' +
              'git cat-file -t v1.0.0',
            ) + 'Hai lời gọi <code>cat-file</code> in ra gì, và vì sao?',
          ),
          options: [
            B(
              '<code>tag</code> then <code>tag</code> — both are tag objects; <code>-a</code> only adds a message to one of them',
              '<code>tag</code> rồi <code>tag</code> — cả hai đều là đối tượng tag; <code>-a</code> chỉ thêm lời nhắn cho một cái',
            ),
            B(
              '<code>commit</code> then <code>commit</code> — a tag is a ref, never an object, so both resolve straight through to the commit',
              '<code>commit</code> rồi <code>commit</code> — tag là một ref chứ không bao giờ là một đối tượng, nên cả hai đều dẫn thẳng tới commit',
            ),
            B(
              '<code>tag</code> then <code>commit</code> — the lightweight one is the real object and <code>-a</code> creates only a shortcut',
              '<code>tag</code> rồi <code>commit</code> — cái tag nhẹ mới là đối tượng thật còn <code>-a</code> chỉ tạo một lối tắt',
            ),
            B(
              '<code>commit</code> then <code>tag</code> — the lightweight tag is just a ref holding a commit hash, while <code>-a</code> writes a real tag object carrying tagger, date and message',
              '<code>commit</code> rồi <code>tag</code> — tag nhẹ chỉ là một ref giữ mã băm commit, còn <code>-a</code> ghi ra một đối tượng tag thật mang theo người tag, ngày và lời nhắn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Verified by running it. This is where lesson 7.2 and lesson 9.2 meet: the <b>annotated tag is the fourth object type</b>, alongside blob, tree and commit, and <code>git cat-file -p v1.0.0</code> shows its fields — <code>object</code>, <code>type</code>, <code>tag</code>, <code>tagger</code> and the message. A lightweight tag has no object at all; <code>refs/tags/v1.0.0-light</code> simply holds the commit hash, so <code>cat-file -t</code> reports what it points at. Three practical consequences follow: only an annotated tag records <em>who</em> released and <em>when</em>, only an annotated tag can be signed, and <b><code>git describe</code> uses annotated tags by default</b> — so a release cut with a lightweight tag is invisible to your version stamping, and the flag cannot be added afterwards without recreating the tag.',
            'Đã chạy thật. Đây là chỗ bài 7.2 gặp bài 9.2: <b>tag có chú giải chính là loại đối tượng thứ tư</b>, bên cạnh blob, tree và commit, và <code>git cat-file -p v1.0.0</code> hiện đủ các trường của nó — <code>object</code>, <code>type</code>, <code>tag</code>, <code>tagger</code> và lời nhắn. Tag nhẹ thì không có đối tượng nào cả; <code>refs/tags/v1.0.0-light</code> chỉ giữ mã băm commit, nên <code>cat-file -t</code> báo về thứ nó trỏ tới. Ba hệ quả thực tế: chỉ tag có chú giải mới ghi lại <em>ai</em> phát hành và <em>khi nào</em>, chỉ tag có chú giải mới ký được, và <b><code>git describe</code> mặc định chỉ dùng tag có chú giải</b> — nên một bản phát hành cắt bằng tag nhẹ là vô hình với việc đóng dấu phiên bản, mà cái cờ ấy thì không thêm sau được nếu không tạo lại tag.',
          ),
        }),

        mcq({
          prompt: B(
            'A repository has tags <code>v1.8.4</code>, <code>v1.9.0</code>, <code>v1.9.1</code>, <code>v1.9.2</code>, <code>v1.10.0</code>. A release script takes "the newest tag" as the last line of <code>git tag</code>. What goes wrong, and what fixes it?',
            'Một kho mã có các tag <code>v1.8.4</code>, <code>v1.9.0</code>, <code>v1.9.1</code>, <code>v1.9.2</code>, <code>v1.10.0</code>. Một script phát hành lấy "tag mới nhất" là dòng cuối cùng của <code>git tag</code>. Hỏng chỗ nào, và sửa bằng gì?',
          ),
          options: [
            B(
              'Bare <code>git tag</code> sorts alphabetically, so <code>v1.10.0</code> comes before <code>v1.8.4</code> and the script picks <code>v1.9.2</code>; <code>git tag --sort=-version:refname</code> sorts by version number instead',
              '<code>git tag</code> trần sắp theo thứ tự chữ cái, nên <code>v1.10.0</code> đứng trước <code>v1.8.4</code> và script chọn nhầm <code>v1.9.2</code>; <code>git tag --sort=-version:refname</code> sắp theo số hiệu phiên bản',
            ),
            B(
              'Bare <code>git tag</code> sorts by creation date, so a tag added later to an old commit lands last; <code>git tag --contains HEAD</code> restricts it to the current line',
              '<code>git tag</code> trần sắp theo ngày tạo, nên một tag gắn muộn vào commit cũ lại nằm cuối; <code>git tag --contains HEAD</code> giới hạn về đúng dòng hiện tại',
            ),
            B(
              'Nothing goes wrong — <code>git tag</code> has understood semantic versioning natively since Git 2.0, and the last line is already <code>v1.10.0</code>',
              'Không hỏng gì cả — <code>git tag</code> đã hiểu đánh phiên bản ngữ nghĩa từ Git 2.0, và dòng cuối vốn đã là <code>v1.10.0</code>',
            ),
            B(
              'The script picks a lightweight tag that <code>git describe</code> cannot see; adding <code>-a</code> to every tag makes the ordering correct',
              'Script chọn phải một tag nhẹ mà <code>git describe</code> không thấy; thêm <code>-a</code> vào mọi tag là thứ tự sẽ đúng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Verified by creating exactly those five tags. Bare <code>git tag</code> printed <code>v1.10.0</code> first, then <code>v1.8.4</code>, <code>v1.9.0</code>, <code>v1.9.1</code>, <code>v1.9.2</code> — because it is a plain alphabetical sort and the character "1" comes before "9". With <code>--sort=-version:refname</code> the order became <code>v1.10.0</code>, <code>v1.9.2</code>, <code>v1.9.1</code>, <code>v1.9.0</code>, <code>v1.8.4</code>, which is what a release script needs. Lesson 7.2 says this detail "has broken more release scripts than any other single detail here", and the reason it is so easy to miss is that everything looks fine for the first nine minor releases. The robust alternative is not to compute the latest tag by hand at all: <code>npm version minor</code> creates the commit and the tag together.',
            'Đã chạy thật: tạo đúng năm tag đó. <code>git tag</code> trần in <code>v1.10.0</code> trước, rồi <code>v1.8.4</code>, <code>v1.9.0</code>, <code>v1.9.1</code>, <code>v1.9.2</code> — vì đó là phép sắp theo chữ cái thuần tuý và ký tự "1" đứng trước "9". Với <code>--sort=-version:refname</code>, thứ tự thành <code>v1.10.0</code>, <code>v1.9.2</code>, <code>v1.9.1</code>, <code>v1.9.0</code>, <code>v1.8.4</code>, đúng thứ một script phát hành cần. Bài 7.2 nói chi tiết này "đã làm hỏng nhiều script phát hành hơn bất kỳ chi tiết đơn lẻ nào khác ở đây", và lý do nó dễ lọt là suốt chín bản minor đầu tiên mọi thứ trông vẫn ổn. Cách chắc chắn hơn là đừng tự tính tag mới nhất bằng tay: <code>npm version minor</code> tạo cả commit lẫn tag cùng lúc.',
          ),
        }),

        mcq({
          prompt: B(
            'Your API is at <code>2.4.1</code>. This release adds a new endpoint; nothing existing changes behaviour, and no caller has to touch their code. Under semantic versioning, what is the next version?',
            'API của bạn đang ở <code>2.4.1</code>. Bản này thêm một endpoint mới; không có gì đang tồn tại đổi hành vi, và không người dùng nào phải sửa mã của họ. Theo đánh phiên bản ngữ nghĩa, phiên bản kế tiếp là gì?',
          ),
          options: [
            B('<code>2.4.2</code> — nothing broke, so it is a patch', '<code>2.4.2</code> — không có gì gãy nên đây là bản vá'),
            B('<code>3.0.0</code> — the public surface changed, and any change to the public surface is a major bump', '<code>3.0.0</code> — bề mặt công khai đã đổi, mà mọi thay đổi bề mặt công khai đều là bước nhảy major'),
            B('<code>2.5.0</code> — new functionality that is backwards compatible is a MINOR bump, and PATCH resets to zero', '<code>2.5.0</code> — chức năng mới mà vẫn tương thích ngược là bước nhảy MINOR, và PATCH quay về không'),
            B('<code>2.4.1+1</code> — build metadata is the correct way to record an additive change', '<code>2.4.1+1</code> — siêu dữ liệu build là cách đúng để ghi nhận một thay đổi mang tính bổ sung'),
          ],
          correct: 2,
          explanation: EX(
            'Lesson 7.2. In <code>MAJOR.MINOR.PATCH</code>, MAJOR is a breaking change (existing users must edit their code), MINOR is new functionality that is backwards compatible, and PATCH is a backwards-compatible bug fix — and a MINOR bump resets PATCH to zero. Option 2 confuses "the public surface grew" with "the public surface broke"; adding is compatible, removing or changing is not. Option 4 misreads build metadata: <code>2.4.1+20260821.a7c2f91</code> is <b>ignored when comparing versions</b>, so it can never express a change in meaning. The payoff of Conventional Commits (lesson 1.4) is precisely here — <code>fix:</code> implies patch, <code>feat:</code> implies minor, <code>BREAKING CHANGE:</code> implies major — so the next version can be <em>computed</em> from the commits instead of argued about.',
            'Bài 7.2. Trong <code>MAJOR.MINOR.PATCH</code>, MAJOR là thay đổi phá vỡ (người dùng hiện tại phải sửa mã), MINOR là chức năng mới vẫn tương thích ngược, và PATCH là sửa lỗi tương thích ngược — và một bước nhảy MINOR đưa PATCH về không. Phương án 2 lẫn giữa "bề mặt công khai lớn ra" và "bề mặt công khai gãy"; thêm vào là tương thích, bỏ đi hay đổi đi thì không. Phương án 4 hiểu sai siêu dữ liệu build: <code>2.4.1+20260821.a7c2f91</code> bị <b>bỏ qua khi so sánh phiên bản</b>, nên nó không bao giờ diễn đạt được một thay đổi về ý nghĩa. Phần thưởng của Conventional Commits (bài 1.4) nằm đúng ở đây — <code>fix:</code> suy ra patch, <code>feat:</code> suy ra minor, <code>BREAKING CHANGE:</code> suy ra major — nên phiên bản kế tiếp được <em>tính ra</em> từ các commit thay vì phải tranh cãi.',
          ),
        }),

        mcq({
          prompt: B(
            '<code>v1.5.0</code> is live in production. <code>main</code> has moved on with three unreleased features. A payment timeout must be fixed now. What does the course prescribe?',
            '<code>v1.5.0</code> đang chạy trên production. <code>main</code> đã đi tiếp với ba tính năng chưa phát hành. Một lỗi hết giờ ở khâu thanh toán phải sửa ngay. Giáo trình kê đơn thế nào?',
          ),
          options: [
            B(
              'Fix on <code>main</code>, cut <code>v1.6.0</code> from it and ship — releasing everything at once is fewer moving parts during an incident',
              'Sửa trên <code>main</code>, cắt <code>v1.6.0</code> từ đó rồi phát hành — ra một lượt tất cả thì ít thứ phải lo hơn trong lúc có sự cố',
            ),
            B(
              'Fix on <code>main</code>, then <code>git revert</code> the three unreleased features, ship, then revert the reverts afterwards',
              'Sửa trên <code>main</code>, rồi <code>git revert</code> ba tính năng chưa phát hành, phát hành, xong hoàn tác lại các phép hoàn tác',
            ),
            B(
              'Branch from <code>main</code> but tag the result <code>v1.5.1</code>, so the version number reflects that only one fix was intended',
              'Tách nhánh từ <code>main</code> nhưng gắn tag <code>v1.5.1</code>, để số hiệu phiên bản phản ánh rằng chỉ có một bản vá được dự tính',
            ),
            B(
              'Branch from the <b>released tag</b> — <code>git switch -c hotfix/payment-timeout v1.5.0</code> — make the smallest possible fix, tag <code>v1.5.1</code>, ship, and then <b>merge the hotfix back into <code>main</code></b>',
              'Tách nhánh từ <b>tag đã phát hành</b> — <code>git switch -c hotfix/payment-timeout v1.5.0</code> — sửa nhỏ nhất có thể, gắn tag <code>v1.5.1</code>, phát hành, rồi <b>merge nhánh hotfix ngược lại vào <code>main</code></b>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Lesson 7.3, and it names two mistakes at once. First, hotfixing from <code>main</code> means your one-line emergency fix arrives bundled with three unreleased, production-untested features — if <em>they</em> break you are now debugging two incidents at the same time. Branching from the tag that is actually live keeps the change to exactly the line you meant. Option 3 makes it worse, not better: the tag would be a lie, since the code contains far more than <code>v1.5.0</code> plus one fix. Second, the last step is the one people skip, and lesson 7.1 calls the missing back-merge "the single most common post-incident regression": without it the fix lives only on the hotfix branch and the tag, and the next release cut from <code>main</code> silently ships without it — so the outage repeats. Put "merged back to main" on the incident checklist; human memory is not a mechanism.',
            'Bài 7.3, và nó gọi tên hai sai lầm cùng lúc. Một, sửa nóng từ <code>main</code> nghĩa là bản vá một dòng khẩn cấp của bạn đi kèm ba tính năng chưa phát hành và chưa được thử trên production — nếu <em>chúng</em> gãy thì bạn đang gỡ hai sự cố cùng một lúc. Tách nhánh từ đúng cái tag đang sống giữ thay đổi gọn đúng dòng bạn định sửa. Phương án 3 còn tệ hơn chứ không khá hơn: cái tag sẽ nói dối, vì mã trong đó chứa nhiều hơn hẳn <code>v1.5.0</code> cộng một bản vá. Hai, bước cuối là thứ người ta hay bỏ, và bài 7.1 gọi việc quên merge ngược là "hồi quy sau sự cố phổ biến nhất": thiếu nó thì bản vá chỉ sống trên nhánh hotfix và cái tag, còn bản phát hành kế tiếp cắt từ <code>main</code> sẽ âm thầm đi mà không có nó — và sự cố lặp lại. Hãy đưa "đã merge ngược vào main" vào danh mục kiểm sau sự cố; trí nhớ con người không phải một cơ chế.',
          ),
        }),

        // ── Chương 8 — Viết lại lịch sử an toàn ─────────────────────────
        mcq({
          prompt: B(
            'A commit with a typo in its message is fixed:' + code(
              'git commit -m "typo: add a"        # hash ee5aa97...\n' +
              'git commit --amend -m "fix: add a"\n' +
              'git rev-list --count HEAD          # -> 1\n' +
              'git cat-file -t ee5aa97            # -> commit',
            ) + 'What does this tell you about <code>--amend</code>?',
            'Một commit bị gõ sai lời nhắn được sửa lại:' + code(
              'git commit -m "typo: add a"        # mã băm ee5aa97...\n' +
              'git commit --amend -m "fix: add a"\n' +
              'git rev-list --count HEAD          # -> 1\n' +
              'git cat-file -t ee5aa97            # -> commit',
            ) + 'Điều này nói lên gì về <code>--amend</code>?',
          ),
          options: [
            B(
              'It does not edit the old commit: it builds a <b>new</b> commit with the same parent and moves the branch to it, so there is still one commit on the branch while the original survives in the database, unreferenced, findable through the reflog',
              'Nó không sửa commit cũ: nó dựng một commit <b>mới</b> có cùng commit cha rồi dời nhánh sang đó, nên nhánh vẫn chỉ có một commit trong khi bản gốc còn sống trong kho, không ai trỏ tới, và tìm lại được qua reflog',
            ),
            B(
              'It edits the commit in place, and <code>ee5aa97</code> still resolves because a commit hash covers only the tree, not the message',
              'Nó sửa commit tại chỗ, và <code>ee5aa97</code> vẫn tra được vì mã băm của commit chỉ bao gồm tree chứ không gồm lời nhắn',
            ),
            B(
              'It created a second commit that the count does not show because <code>rev-list</code> ignores amended commits by default',
              'Nó đã tạo commit thứ hai mà phép đếm không hiện ra vì <code>rev-list</code> mặc định bỏ qua các commit đã amend',
            ),
            B(
              'The old hash resolving proves nothing was rewritten, so amending a pushed commit is safe as long as the message is the only change',
              'Việc mã băm cũ vẫn tra được chứng minh không có gì bị viết lại, nên amend một commit đã push là an toàn miễn là chỉ đổi lời nhắn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it — the hash changed from <code>ee5aa97…</code> to <code>d26d9eb…</code>, the branch still held exactly one commit, and the old object was still there. Lesson 8.1 states it as the rule the whole chapter rests on: <b>commits are immutable, so amend does not edit anything.</b> That hash change is the entire risk profile of the command. Locally it is free. The moment the original was pushed, the server and every colleague still have <code>ee5aa97</code>, and pushing your replacement gets rejected as non-fast-forward because neither history contains the other. The check the course gives is one line: <code>git log --oneline @{u}..HEAD</code> — if the commit is listed, it has not been pushed and you may amend freely.',
            'Đã chạy thật — mã băm đổi từ <code>ee5aa97…</code> sang <code>d26d9eb…</code>, nhánh vẫn giữ đúng một commit, và đối tượng cũ vẫn còn đó. Bài 8.1 phát biểu thành cái luật mà cả chương dựng lên trên đó: <b>commit là bất biến, nên amend không sửa gì cả.</b> Chính việc đổi mã băm ấy là toàn bộ mức rủi ro của lệnh này. Ở cục bộ thì nó miễn phí. Nhưng ngay khi bản gốc đã được push, máy chủ và mọi đồng nghiệp vẫn đang giữ <code>ee5aa97</code>, và lượt push bản thay thế của bạn sẽ bị từ chối vì không fast-forward được — hai lịch sử không cái nào chứa cái nào. Phép kiểm giáo trình đưa ra chỉ một dòng: <code>git log --oneline @{u}..HEAD</code> — nếu commit còn được liệt kê thì nó chưa được push và bạn amend thoải mái.',
          ),
        }),

        mcq({
          prompt: B(
            'You rebase your own feature branch and push with <code>--force-with-lease</code>. It succeeds — but it silently overwrote a colleague’s commit that had been pushed twenty minutes earlier. How, and what closes the hole?',
            'Bạn rebase nhánh tính năng của mình rồi push bằng <code>--force-with-lease</code>. Nó thành công — nhưng đã âm thầm ghi đè một commit mà đồng nghiệp push lên hai mươi phút trước. Bằng cách nào, và bịt lỗ đó bằng gì?',
          ),
          options: [
            B(
              'The lease only protects the <code>main</code> branch; on any other branch it degrades to a plain <code>--force</code>, so protect feature branches with a ruleset',
              'Cơ chế "lease" chỉ bảo vệ nhánh <code>main</code>; trên nhánh khác nó tụt xuống thành <code>--force</code> thường, nên hãy bảo vệ nhánh tính năng bằng ruleset',
            ),
            B(
              'The lease expires after ten minutes; run <code>git fetch</code> immediately before pushing so the window cannot be missed',
              'Cơ chế "lease" hết hiệu lực sau mười phút; hãy chạy <code>git fetch</code> ngay trước khi push để không lỡ cửa sổ thời gian',
            ),
            B(
              'The rebase itself fetched, and a rebase always refreshes remote-tracking refs; use <code>git rebase --no-fetch</code> to keep the lease meaningful',
              'Chính phép rebase đã fetch, và rebase luôn làm mới các ref theo dõi từ xa; hãy dùng <code>git rebase --no-fetch</code> để cơ chế "lease" còn ý nghĩa',
            ),
            B(
              'The lease compares against your <b>remote-tracking ref</b>, not the server. Anything that quietly fetches — an IDE polling, a shell prompt — updates that ref without you seeing the commits, so the check compares the server against itself and passes. Add <code>--force-if-includes</code>',
              'Cơ chế "lease" so với <b>ref theo dõi từ xa của bạn</b> chứ không so trực tiếp với máy chủ. Bất cứ thứ gì lặng lẽ fetch — một IDE tự dò, một dấu nhắc shell — đều cập nhật ref ấy mà bạn chưa hề thấy commit mới, nên phép kiểm đem máy chủ so với chính nó và cho qua. Hãy thêm <code>--force-if-includes</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Lesson 8.2 names this as the thing that breaks the lease, and it is worth understanding rather than memorising. <code>--force-with-lease</code> asks "is the remote branch still exactly where my <code>origin/&lt;branch&gt;</code> says it is?" — and <code>origin/&lt;branch&gt;</code> is a local cache. Any background fetch updates that cache, so the comparison becomes "is the server where the server is?", which is trivially true. Verified separately: with a genuinely stale ref the push <em>is</em> refused, printing <code>! [rejected] main -&gt; main (stale info)</code>, and a plain <code>--force</code> then goes through with <code>+ 930ade1...0dd898c main -&gt; main (forced update)</code>. Since Git 2.30 the fix is to pass both flags — <code>--force-if-includes</code> additionally requires that your local branch actually contains everything you have fetched. The course suggests <code>git config --global alias.pushf "push --force-with-lease --force-if-includes"</code>, because there is no config setting that upgrades a bare <code>--force</code>.',
            'Bài 8.2 gọi tên đây là thứ phá vỡ cơ chế "lease", và nên hiểu chứ đừng học thuộc. <code>--force-with-lease</code> hỏi "nhánh trên máy chủ có còn đúng chỗ mà <code>origin/&lt;nhánh&gt;</code> của tôi ghi không?" — mà <code>origin/&lt;nhánh&gt;</code> là một bộ đệm cục bộ. Bất kỳ lượt fetch nền nào cũng cập nhật bộ đệm ấy, nên phép so trở thành "máy chủ có ở đúng chỗ của máy chủ không?", tất nhiên là đúng. Đã kiểm riêng: với một ref thật sự cũ thì lượt push <em>bị</em> từ chối, in ra <code>! [rejected] main -&gt; main (stale info)</code>, và một lệnh <code>--force</code> trần sau đó đi lọt với dòng <code>+ 930ade1...0dd898c main -&gt; main (forced update)</code>. Từ Git 2.30, cách sửa là đưa cả hai cờ — <code>--force-if-includes</code> đòi thêm rằng nhánh cục bộ của bạn thật sự chứa mọi thứ bạn đã fetch về. Giáo trình gợi ý <code>git config --global alias.pushf "push --force-with-lease --force-if-includes"</code>, vì không có thiết lập nào nâng cấp được một lệnh <code>--force</code> trần.',
          ),
        }),

        mcq({
          prompt: B(
            'A live API key was pushed to a <b>public</b> repository nine minutes ago. What is step one?',
            'Một khoá API đang hoạt động vừa được push lên một kho <b>công khai</b> chín phút trước. Bước một là gì?',
          ),
          options: [
            B(
              'Delete the line, commit, and force-push over the bad commit before anyone fetches it',
              'Xoá dòng đó, commit, rồi force-push đè lên commit hỏng trước khi có ai kịp fetch',
            ),
            B(
              '<b>Rotate the credential</b> — revoke it at the provider and issue a new one; bots scrape public GitHub for credential patterns continuously and act within minutes, so cleaning history on a still-valid key is theatre',
              '<b>Đổi khoá</b> — thu hồi ở nhà cung cấp và phát khoá mới; các bot quét GitHub công khai tìm mẫu thông tin xác thực liên tục và ra tay trong vài phút, nên dọn lịch sử trên một khoá còn hiệu lực chỉ là diễn trò',
            ),
            B(
              'Run <code>git filter-repo --invert-paths --path .env</code> on a mirror clone and force-push, then tell the team to re-clone',
              'Chạy <code>git filter-repo --invert-paths --path .env</code> trên một bản clone gương rồi force-push, xong bảo cả nhóm clone lại',
            ),
            B(
              'Make the repository private, which removes it from search indexes and from the bots’ reach',
              'Chuyển kho mã thành riêng tư, việc đó gỡ nó khỏi các chỉ mục tìm kiếm và khỏi tầm với của bot',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Lesson 8.3 opens with a danger callout headed "Step one is not Git", and repeats the point three separate times in the chapter. All the Git work — filter-repo, the force-push, everyone re-cloning — is <em>cleanup</em>, and it is genuinely incomplete for a while: after a force push the old commits are unreferenced but <b>still reachable on GitHub by full hash</b>, forks keep their own copies indefinitely, and having them actually purged means contacting GitHub Support. Option 4 fails for the same reason plus one more: the key was already public for nine minutes, and going private does not un-leak it. Option 1 is the misunderstanding the course calls the single most common in the whole course — deleting the line in a new commit leaves the secret in the old commit, one <code>git log -p</code> away for anyone with the repository. Cleaning history is expensive and never quite complete; rotation is cheap and total.',
            'Bài 8.3 mở đầu bằng một khối cảnh báo đỏ tiêu đề "Bước một không phải là Git", và nhắc lại ý đó ba lần riêng biệt trong chương. Toàn bộ phần việc Git — filter-repo, lượt force-push, cả nhóm clone lại — là <em>dọn dẹp</em>, và nó thật sự không trọn vẹn trong một thời gian: sau một lượt force push, các commit cũ không còn ai trỏ tới nhưng <b>vẫn với tới được trên GitHub bằng mã băm đầy đủ</b>, các bản fork giữ bản sao riêng vô thời hạn, và muốn xoá thật thì phải liên hệ GitHub Support. Phương án 4 hỏng vì cùng lý do và thêm một lý do nữa: khoá đã công khai suốt chín phút, chuyển sang riêng tư không rút lại được điều đó. Phương án 1 là hiểu nhầm mà giáo trình gọi là phổ biến nhất trong cả khoá — xoá dòng đó trong một commit mới thì bí mật vẫn nằm trong commit cũ, cách một lệnh <code>git log -p</code> với bất kỳ ai có kho mã. Dọn lịch sử thì đắt và không bao giờ trọn; đổi khoá thì rẻ và triệt để.',
          ),
        }),

        // ── Chương 9 — Ruột gan: kho đối tượng ──────────────────────────
        mcq({
          prompt: B(
            'These two commands print the same 40 characters. What does that prove about how Git computes an object id?' + code(
              "printf 'hello world\\n' | git hash-object --stdin\n" +
              "printf 'blob 12\\0hello world\\n' | shasum -a 1\n" +
              '# both -> 3b18e512dba79e4c8300dd08aeb37f8e728b8dad',
            ),
            'Hai lệnh sau in ra cùng 40 ký tự. Điều đó chứng minh gì về cách Git tính mã định danh của một đối tượng?' + code(
              "printf 'hello world\\n' | git hash-object --stdin\n" +
              "printf 'blob 12\\0hello world\\n' | shasum -a 1\n" +
              '# cả hai -> 3b18e512dba79e4c8300dd08aeb37f8e728b8dad',
            ),
          ),
          options: [
            B(
              'Git hashes a header — the object <b>type</b> and <b>size</b>, a NUL byte, then the content — which is why a blob and a commit with identical bytes get different ids, and why <code>cat-file -t</code> can report a type with no lookup table',
              'Git băm một phần đầu — <b>loại</b> và <b>kích thước</b> của đối tượng, một byte NUL, rồi mới tới nội dung — vì thế một blob và một commit có cùng dãy byte vẫn ra hai mã khác nhau, và vì thế <code>cat-file -t</code> báo được loại mà không cần bảng tra',
            ),
            B(
              'Git hashes the file path together with the content, which is how it detects that two files differ despite identical bytes',
              'Git băm đường dẫn file cùng với nội dung, và đó là cách nó phát hiện hai file khác nhau dù dãy byte y hệt',
            ),
            B(
              'Git hashes the zlib-compressed bytes, so the compression level is part of the object id and must never be changed',
              'Git băm phần byte đã nén zlib, nên mức nén là một phần của mã định danh đối tượng và không bao giờ được thay đổi',
            ),
            B(
              'Git hashes the content alone; the prefix in the second command is only there to make the two byte streams the same length',
              'Git chỉ băm mỗi nội dung; phần tiền tố ở lệnh thứ hai chỉ để hai luồng byte có cùng độ dài',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running both on git 2.51.1 — they printed the identical hash. Lesson 9.2 uses this to make the object database concrete: Git hashes <code>&lt;type&gt; &lt;size&gt;\\0&lt;content&gt;</code>, not the content alone. Two consequences fall out immediately. Because the type is inside the hash, the same twelve bytes stored as a blob and as some other object type would have different ids, so the id is a statement about <em>what</em> the object is, not only about its bytes. And because the size is inside it too, a truncated or corrupted object cannot silently pass as valid — which is the "guarantee integrity" design goal from lesson 0.2, the same goal that made everything in Git content-addressed in the first place. Option 3 has it backwards: compression happens after hashing, so it never affects the id.',
            'Đã chạy thật cả hai trên git 2.51.1 — chúng in ra cùng một mã băm. Bài 9.2 dùng đúng chỗ này để cụ thể hoá kho đối tượng: Git băm <code>&lt;loại&gt; &lt;kích thước&gt;\\0&lt;nội dung&gt;</code>, chứ không băm mỗi nội dung. Hai hệ quả rơi ra ngay. Vì loại nằm bên trong mã băm, cùng mười hai byte đó nếu lưu dưới dạng blob và dưới dạng một loại khác sẽ ra hai mã khác nhau, nên mã băm là một lời khẳng định về việc đối tượng ấy <em>là gì</em>, không chỉ về dãy byte của nó. Và vì kích thước cũng nằm trong đó, một đối tượng bị cắt cụt hay hỏng không thể âm thầm qua mặt như hợp lệ — đúng mục tiêu thiết kế "bảo đảm toàn vẹn" của bài 0.2, cũng chính mục tiêu khiến mọi thứ trong Git được định danh theo nội dung ngay từ đầu. Phương án 3 hiểu ngược: nén xảy ra sau khi băm, nên nó không bao giờ ảnh hưởng tới mã.',
          ),
        }),

        mcq({
          prompt: B(
            'Which object type records a file’s <b>name</b>, and what follows from that?',
            'Loại đối tượng nào ghi lại <b>tên</b> của một file, và điều đó dẫn tới hệ quả gì?',
          ),
          options: [
            B(
              'The blob, in a small header before the content — so renaming a file rewrites the blob and costs as much as re-adding it',
              'Blob, trong một phần đầu nhỏ trước nội dung — nên đổi tên một file là viết lại blob và tốn ngang việc thêm mới nó',
            ),
            B(
              'The index, which is why <code>git ls-files --stage</code> can list paths and the object database cannot',
              'Index, và vì thế <code>git ls-files --stage</code> liệt kê được đường dẫn còn kho đối tượng thì không',
            ),
            B(
              'The <b>tree</b> — a blob is bytes with no name — so a rename writes a new tree that reuses the identical blob, and Git never records a rename at all; every "rename detection" is a similarity heuristic computed on demand',
              '<b>Tree</b> — blob chỉ là các byte không tên — nên đổi tên là ghi ra một tree mới dùng lại đúng blob cũ, và Git chưa bao giờ ghi lại một phép đổi tên nào; mọi "phát hiện đổi tên" đều là một phép đoán độ giống nhau tính tại chỗ',
            ),
            B(
              'The commit, alongside the author and the message, which is why <code>git show --stat</code> can list file names without reading any tree',
              'Commit, nằm cạnh tác giả và lời nhắn, và vì thế <code>git show --stat</code> liệt kê được tên file mà không phải đọc tree nào',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Verified in two ways. First, three files with identical content shared one blob, so the blob clearly carries no name. Second, <code>git cat-file -p &lt;tree&gt;</code> printed <code>100644 blob ce01362…	f.txt</code> — mode, type, hash, <em>then</em> the name. Lesson 9.2 draws out the consequence that surprises people: renaming a 10 MB file costs almost nothing, because only a new tree is written and the blob is reused unchanged. The other consequence is the one you meet in daily work — because no rename was ever recorded, <code>git log --follow</code>, <code>git blame -C</code> and rename detection in a diff are all <em>inference</em>. They usually work, and they can be wrong when a file was renamed and heavily edited in the same commit. Option 2 is a real fact about the index that answers a different question: the index lists paths, but it is a cache of the next commit, not part of history.',
            'Đã kiểm bằng hai cách. Một, ba file có nội dung giống hệt dùng chung một blob, nên rõ ràng blob không mang tên nào. Hai, <code>git cat-file -p &lt;tree&gt;</code> in ra <code>100644 blob ce01362…	f.txt</code> — chế độ, loại, mã băm, <em>rồi mới</em> tới tên. Bài 9.2 rút ra hệ quả khiến người ta bất ngờ: đổi tên một file 10 MB gần như không tốn gì, vì chỉ có một tree mới được ghi ra còn blob thì dùng lại nguyên vẹn. Hệ quả còn lại là thứ bạn gặp hằng ngày — vì chưa từng có phép đổi tên nào được ghi lại, nên <code>git log --follow</code>, <code>git blame -C</code> và việc dò đổi tên trong một diff đều là <em>suy luận</em>. Chúng thường đúng, và chúng có thể sai khi một file vừa bị đổi tên vừa bị sửa gần hết trong cùng một commit. Phương án 2 nêu một sự thật có thật về index nhưng trả lời câu hỏi khác: index có liệt kê đường dẫn, nhưng nó là bộ đệm cho commit kế tiếp chứ không phải một phần của lịch sử.',
          ),
        }),

        mcq({
          prompt: B(
            'You just destroyed a branch with <code>reset --hard</code> and are about to recover it from the reflog. Someone suggests running <code>git gc --prune=now</code> first "to tidy up". What happens?',
            'Bạn vừa phá một nhánh bằng <code>reset --hard</code> và sắp cứu nó lại từ reflog. Có người bảo chạy <code>git gc --prune=now</code> trước "cho gọn". Chuyện gì xảy ra?',
          ),
          options: [
            B(
              'Nothing harmful — <code>gc</code> only repacks loose objects into a packfile, and packed objects are still reachable by hash',
              'Không có gì hại — <code>gc</code> chỉ gói các đối tượng rời vào một packfile, và đối tượng đã gói vẫn với tới được bằng mã băm',
            ),
            B(
              'The recovery gets faster, because <code>gc</code> also rebuilds the reflog index that <code>HEAD@{n}</code> reads',
              'Việc cứu sẽ nhanh hơn, vì <code>gc</code> dựng lại luôn chỉ mục reflog mà <code>HEAD@{n}</code> đọc',
            ),
            B(
              'Git refuses, printing a warning that unreachable objects are still referenced by the reflog',
              'Git từ chối và in cảnh báo rằng các đối tượng không với tới được vẫn đang được reflog tham chiếu',
            ),
            B(
              'It deletes unreachable objects <b>immediately, with no grace period</b> — including the very commits you were about to recover, since the safety net is exactly that expiry window',
              'Nó xoá các đối tượng không với tới được <b>ngay lập tức, không có thời gian ân hạn</b> — kể cả đúng những commit bạn sắp cứu, vì tấm lưới an toàn chính là cái khoảng ân hạn ấy',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Lesson 9.3 attaches a danger callout to this and says it plainly: never run <code>--prune=now</code> while you are trying to rescue something, because that is exactly backwards. Normal <code>git gc</code> does four things — pack loose objects, pack refs, expire reflog entries (reachable after 90 days, unreachable after 30), and delete objects that no ref and no reflog entry can reach. That last step is when a "deleted" commit truly disappears, and the two expiry windows are the whole reason chapter 4 can promise that anything committed is recoverable. <code>--prune=now</code> removes the grace period, so an object that is unreachable this second is gone this second. Option 1 describes the harmless half of <code>gc</code> correctly, which is why the suggestion sounds reasonable — repacking really is safe; it is the pruning that is not.',
            'Bài 9.3 gắn một khối cảnh báo đỏ vào đây và nói thẳng: đừng bao giờ chạy <code>--prune=now</code> trong lúc đang cố cứu thứ gì đó, vì làm thế là ngược hoàn toàn. <code>git gc</code> bình thường làm bốn việc — gói các đối tượng rời, gói các ref, cho hết hạn các mục reflog (với tới được thì 90 ngày, không với tới được thì 30 ngày), và xoá những đối tượng mà không ref nào và không mục reflog nào với tới. Bước cuối chính là lúc một commit "đã xoá" thật sự biến mất, và hai khoảng hết hạn ấy là toàn bộ lý do chương 4 dám hứa rằng thứ gì đã commit thì cứu được. <code>--prune=now</code> gỡ bỏ thời gian ân hạn, nên một đối tượng không với tới được vào giây này là mất luôn ở giây này. Phương án 1 mô tả đúng nửa vô hại của <code>gc</code>, và vì thế lời gợi ý nghe rất hợp lý — gói lại thì thật sự an toàn; chỉ có phần xoá là không.',
          ),
        }),

        // ── Chương 10 — Kho mã lớn ──────────────────────────────────────
        mcq({
          prompt: B(
            'A second worktree is checked out on branch <code>feature</code>. Back in the main worktree you run <code>git switch feature</code> and Git answers:' + code(
              "fatal: 'feature' is already used by worktree at '/…/wt-feature'",
            ) + 'Why does Git behave this way?',
            'Một worktree thứ hai đang checkout nhánh <code>feature</code>. Quay về worktree chính bạn chạy <code>git switch feature</code> và Git trả lời:' + code(
              "fatal: 'feature' is already used by worktree at '/…/wt-feature'",
            ) + 'Vì sao Git hành xử như vậy?',
          ),
          options: [
            B(
              'Each worktree has its own HEAD and index but they share refs, so two directories committing to one branch would leave it in a state neither of them expects — the refusal is protection, and <code>--detach</code> or another branch is the way round it',
              'Mỗi worktree có HEAD và index riêng nhưng dùng chung các ref, nên hai thư mục cùng commit lên một nhánh sẽ để nhánh ở một trạng thái mà không thư mục nào lường trước — lời từ chối là để bảo vệ, và lối đi vòng là <code>--detach</code> hoặc một nhánh khác',
            ),
            B(
              'Because the two worktrees have separate object databases, and checking out the same branch twice would duplicate every object on disk',
              'Vì hai worktree có hai kho đối tượng riêng, và checkout cùng một nhánh hai lần sẽ nhân đôi mọi đối tượng trên đĩa',
            ),
            B(
              'Because a branch is a 41-byte file and a file cannot be opened by two processes at once, which is what <code>cannot lock ref</code> means',
              'Vì một nhánh là một file 41 byte và một file thì không thể được hai tiến trình mở cùng lúc, đó chính là ý nghĩa của <code>cannot lock ref</code>',
            ),
            B(
              'It is a licensing restriction of the worktree feature, lifted by setting <code>worktree.allowSharedCheckout</code>',
              'Đó là một hạn chế về giấy phép của tính năng worktree, gỡ được bằng cách đặt <code>worktree.allowSharedCheckout</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it; that is the exact message. Lesson 10.1 is explicit that this is "protection, not an inconvenience". A linked worktree shares the <b>object database and the refs</b> with the main one — which is why a second worktree costs a checkout rather than a clone, and why a commit made in one is immediately visible from the other with no push or fetch. What it does <em>not</em> share is HEAD, the index and the working directory, and those are per-worktree state under <code>.git/worktrees/&lt;name&gt;/</code>. Option 2 inverts the central benefit. Two more gotchas from the same lesson are worth carrying: ignored files are not copied, so a new worktree has no <code>node_modules</code> and no <code>.env</code>; and stashes <em>are</em> shared, because <code>refs/stash</code> is a single ref for the whole repository.',
            'Đã chạy thật; đó đúng là thông báo máy in ra. Bài 10.1 nói rõ rằng đây là "sự bảo vệ, không phải sự bất tiện". Một worktree liên kết dùng chung <b>kho đối tượng và các ref</b> với worktree chính — vì thế một worktree thứ hai tốn một lượt checkout chứ không tốn một lượt clone, và vì thế một commit tạo ở bên này hiện ra ngay bên kia mà không cần push hay fetch. Thứ nó <em>không</em> dùng chung là HEAD, index và thư mục làm việc, và đó là trạng thái riêng của từng worktree nằm dưới <code>.git/worktrees/&lt;tên&gt;/</code>. Phương án 2 nói ngược đúng lợi ích cốt lõi. Hai cái bẫy nữa cùng bài đáng mang theo: file bị bỏ qua không được chép sang, nên worktree mới không có <code>node_modules</code> và không có <code>.env</code>; còn stash thì <em>có</em> dùng chung, vì <code>refs/stash</code> là một ref duy nhất cho cả kho.',
          ),
        }),

        mcq({
          prompt: B(
            'You changed code inside a submodule and committed in both the submodule and the parent repository. In which order must you push, and what goes wrong otherwise?',
            'Bạn sửa mã bên trong một submodule và đã commit ở cả submodule lẫn kho cha. Phải push theo thứ tự nào, và làm sai thì hỏng gì?',
          ),
          options: [
            B(
              'Parent first — the parent’s gitlink reserves the commit id on the server, and pushing the submodule afterwards fills in the objects behind it, which is why the parent is the one that must arrive first',
              'Kho cha trước — gitlink của kho cha giữ chỗ cho mã commit trên máy chủ, rồi push submodule sau sẽ điền các đối tượng nằm sau nó vào, và vì thế kho cha là thứ phải tới trước',
            ),
            B(
              'The order does not matter as long as both are pushed before anyone runs <code>git submodule update</code>, because that command fetches from both remotes and resolves whatever it finds',
              'Thứ tự không quan trọng, miễn cả hai được push trước khi có ai chạy <code>git submodule update</code>, vì lệnh đó fetch từ cả hai remote và tự phân giải bất cứ thứ gì nó tìm thấy',
            ),
            B(
              '<b>Submodule first, then the parent</b> — the parent stores only a commit id (a gitlink, mode <code>160000</code>), so pushing it first pins a commit that exists only on your machine and colleagues get <code>fatal: reference is not a tree</code>',
              '<b>Submodule trước, rồi mới tới kho cha</b> — kho cha chỉ lưu một mã commit (một gitlink, chế độ <code>160000</code>), nên push nó trước là ghim vào một commit chỉ tồn tại trên máy bạn, và đồng nghiệp nhận <code>fatal: reference is not a tree</code>',
            ),
            B(
              'Only the parent needs pushing — <code>git push</code> follows the gitlink and pushes the submodule automatically',
              'Chỉ cần push kho cha — <code>git push</code> đi theo gitlink và tự đẩy submodule lên',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Lesson 10.2. What makes submodules feel strange is exactly what makes this rule necessary: the parent repository does not contain the library’s code, it contains <b>forty characters</b>. <code>git ls-files --stage</code> shows mode <code>160000</code> for the path, which is neither a blob nor a tree but a <em>gitlink</em> — a pointer to one specific commit in another repository. Push the parent first and that pointer names a commit the server has never heard of, so every colleague’s <code>git submodule update</code> fails with an error that never mentions ordering. The course offers a way to stop having to remember: <code>git push --recurse-submodules=check</code> makes Git refuse the parent push while a pinned submodule commit is missing upstream. Option 4 describes <code>=on-demand</code>, which is a different setting and not the default.',
            'Bài 10.2. Cái làm submodule có cảm giác kỳ quặc chính là cái khiến luật này cần thiết: kho cha không chứa mã của thư viện, nó chứa <b>bốn mươi ký tự</b>. <code>git ls-files --stage</code> hiện chế độ <code>160000</code> cho đường dẫn đó — không phải blob cũng không phải tree, mà là một <em>gitlink</em>, con trỏ tới một commit cụ thể trong một kho khác. Push kho cha trước thì con trỏ ấy gọi tên một commit mà máy chủ chưa từng nghe tới, nên lệnh <code>git submodule update</code> của mọi đồng nghiệp đều gãy với một lỗi không hề nhắc gì tới thứ tự. Giáo trình đưa ra cách để khỏi phải nhớ: <code>git push --recurse-submodules=check</code> khiến Git từ chối lượt push kho cha chừng nào commit submodule được ghim còn thiếu ở trên máy chủ. Phương án 4 mô tả <code>=on-demand</code>, một thiết lập khác và không phải mặc định.',
          ),
        }),

        // ── Chương 11 — Nền tảng GitHub ─────────────────────────────────
        mcq({
          prompt: B(
            'You list issues through the API and get results that are clearly pull requests. Why, and what is the fix the course gives?' + code(
              'gh api repos/OWNER/REPO/issues --paginate \\\n' +
              "  --jq '.[] | \"\\(.number)\\t\\(.title)\"'",
            ),
            'Bạn liệt kê issue qua API và nhận về những kết quả rõ ràng là pull request. Vì sao, và giáo trình đưa cách sửa nào?' + code(
              'gh api repos/OWNER/REPO/issues --paginate \\\n' +
              "  --jq '.[] | \"\\(.number)\\t\\(.title)\"'",
            ),
          ),
          options: [
            B(
              'The <code>--paginate</code> flag crosses into the pulls endpoint after the first page; drop it and page manually',
              'Cờ <code>--paginate</code> lấn sang endpoint pulls sau trang đầu tiên; bỏ nó đi và tự phân trang bằng tay',
            ),
            B(
              'Issues and pull requests share a number sequence, so any renumbering shows the other kind; pass <code>--state open</code> to separate them',
              'Issue và pull request dùng chung một dãy số, nên bất kỳ lần đánh số lại nào cũng làm lộ loại kia; thêm <code>--state open</code> để tách ra',
            ),
            B(
              'The repository has issue templates enabled, which makes GitHub index pull requests as issues; disabling <code>blank_issues_enabled</code> fixes it',
              'Kho mã đang bật mẫu issue, khiến GitHub đánh chỉ mục pull request như issue; tắt <code>blank_issues_enabled</code> là hết',
            ),
            B(
              'In GitHub’s API <b>every pull request is also an issue</b>, so the issues endpoint returns both; filter with <code>select(.pull_request == null)</code>',
              'Trong API của GitHub, <b>mọi pull request đồng thời cũng là một issue</b>, nên endpoint issues trả về cả hai; hãy lọc bằng <code>select(.pull_request == null)</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Lesson 11.1. This is a data-model fact, not a bug: a pull request in GitHub <em>is</em> an issue with a diff attached, which is also why PRs and issues share one numbering sequence and why <code>Closes #412</code> works from either. The consequence is that the issues endpoint returns both kinds, and any script that counts open issues will over-count unless it filters. The <code>pull_request</code> key is present only on the ones that are pull requests, so <code>select(.pull_request == null)</code> keeps the real issues. The same lesson recommends <code>gh run view --log-failed</code> in the same spirit — it prints only the failing step instead of scrolling a browser through four thousand lines of green — and both are examples of why <code>gh</code> plus <code>--jq</code> is worth learning rather than clicking.',
            'Bài 11.1. Đây là một sự thật về mô hình dữ liệu, không phải lỗi: một pull request trên GitHub <em>chính là</em> một issue có kèm diff, và đó cũng là lý do PR và issue dùng chung một dãy số, cũng là lý do <code>Closes #412</code> viết ở đâu cũng chạy. Hệ quả là endpoint issues trả về cả hai loại, và mọi script đếm issue đang mở sẽ đếm dôi nếu không lọc. Khoá <code>pull_request</code> chỉ có mặt ở những mục là pull request, nên <code>select(.pull_request == null)</code> giữ lại đúng các issue thật. Cùng bài ấy khuyên dùng <code>gh run view --log-failed</code> theo đúng tinh thần đó — nó chỉ in bước hỏng thay vì phải cuộn trình duyệt qua bốn nghìn dòng màu xanh — và cả hai đều là ví dụ cho thấy vì sao <code>gh</code> cộng <code>--jq</code> đáng học hơn là đi bấm chuột.',
          ),
        }),

        mcq({
          prompt: B(
            'GitHub Actions masks secrets in logs. Which statement about that protection is correct?',
            'GitHub Actions che các secret trong log. Phát biểu nào về lớp bảo vệ đó là đúng?',
          ),
          options: [
            B(
              'Masking is a <b>string match</b> on the log output, so any transformation defeats it — <code>echo $SECRET | base64</code> prints the value in a form the masker does not recognise',
              'Che là một phép <b>so khớp chuỗi</b> trên đầu ra log, nên bất kỳ phép biến đổi nào cũng vô hiệu hoá nó — <code>echo $SECRET | base64</code> in ra giá trị dưới dạng mà bộ che không nhận ra',
            ),
            B(
              'Masking is applied at the process level, so a secret cannot leave the runner in any encoding, including through a network call',
              'Che được áp ở mức tiến trình, nên một secret không thể rời khỏi runner dưới bất kỳ mã hoá nào, kể cả qua một lời gọi mạng',
            ),
            B(
              'Masking covers everything under <code>secrets.</code> plus anything derived from it, because Actions tracks data flow through the shell',
              'Che bao trùm mọi thứ dưới <code>secrets.</code> cộng mọi thứ dẫn xuất từ đó, vì Actions theo dõi được luồng dữ liệu qua shell',
            ),
            B(
              'Masking only applies to workflows triggered by <code>push</code>; on <code>pull_request</code> secrets are not available at all, so nothing needs masking',
              'Che chỉ áp dụng cho workflow chạy bởi <code>push</code>; với <code>pull_request</code> thì secret không hề khả dụng nên không có gì cần che',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 11.2 puts this in a danger callout precisely because the protection feels stronger than it is. The masker scans log lines for the literal secret value and replaces it with asterisks; encode, reverse, split or hash it and the text no longer matches, so it prints in full. The rules that follow are the practical ones: never print a secret, never hand one to an unread third-party action, and <b>pin actions to a full commit SHA</b> rather than a moving tag when the action can see secrets — a compromised tag on a popular action is a supply-chain attack on everyone who wrote <code>@v4</code>. Prefer the automatic <code>GITHUB_TOKEN</code> over a stored PAT: it is minted per run, scoped to that repository and expires when the job ends, whereas a leaked PAT is your whole account.',
            'Bài 11.2 đặt điều này vào một khối cảnh báo đỏ, chính vì lớp bảo vệ ấy trông có vẻ mạnh hơn thực tế. Bộ che quét các dòng log tìm đúng giá trị secret rồi thay bằng dấu sao; mã hoá nó, đảo nó, cắt nó hay băm nó thì văn bản không còn khớp nữa, và nó in ra đầy đủ. Các luật suy ra đều rất thực dụng: không bao giờ in một secret, không bao giờ giao secret cho một action bên thứ ba mà bạn chưa đọc mã, và <b>ghim action theo mã băm commit đầy đủ</b> thay vì theo một tag di động khi action đó nhìn thấy secret — một tag bị chiếm trên một action phổ biến là một cuộc tấn công chuỗi cung ứng nhắm vào mọi người từng viết <code>@v4</code>. Hãy ưu tiên <code>GITHUB_TOKEN</code> tự sinh hơn một PAT lưu sẵn: nó được phát cho từng lượt chạy, giới hạn trong đúng kho đó và hết hạn khi job kết thúc, còn một PAT bị lộ là cả tài khoản của bạn.',
          ),
        }),

        // ── Chương 12 — Hook, ký & tự động hoá ──────────────────────────
        mcq({
          prompt: B(
            'You wrote a <code>pre-commit</code> hook that blocks secrets and it works perfectly on your machine. Your colleague clones the repository and commits a secret with no complaint. Why, and what is the course’s answer?',
            'Bạn viết một hook <code>pre-commit</code> chặn bí mật và nó chạy hoàn hảo trên máy bạn. Đồng nghiệp clone kho mã về rồi commit một bí mật mà không bị ai kêu. Vì sao, và giáo trình trả lời thế nào?',
          ),
          options: [
            B(
              'Their Git is older than 2.9 and ignores hooks written in bash; ask them to upgrade Git',
              'Git của họ cũ hơn bản 2.9 nên bỏ qua các hook viết bằng bash; bảo họ nâng cấp Git',
            ),
            B(
              'The hook ran but exited 0 because their staged diff was empty at the time; add <code>--diff-filter=ACM</code> and it will catch it',
              'Hook có chạy nhưng thoát 0 vì lúc đó diff trong index của họ rỗng; thêm <code>--diff-filter=ACM</code> là bắt được',
            ),
            B(
              '<code>.git/</code> is not part of the repository, so hooks are <b>never cloned</b> — the fix is a committed <code>.githooks/</code> directory plus <code>core.hooksPath</code>, or husky whose <code>prepare</code> script installs on <code>npm install</code>',
              '<code>.git/</code> không phải một phần của kho mã, nên hook <b>không bao giờ được clone theo</b> — cách sửa là một thư mục <code>.githooks/</code> có commit cộng với <code>core.hooksPath</code>, hoặc dùng husky với script <code>prepare</code> tự cài lúc <code>npm install</code>',
            ),
            B(
              'Hooks are cloned but arrive without the executable bit; a single <code>chmod +x .git/hooks/pre-commit</code> on their machine fixes it permanently',
              'Hook có được clone theo nhưng về mà mất bit thực thi; một lệnh <code>chmod +x .git/hooks/pre-commit</code> trên máy họ là xong vĩnh viễn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Lesson 12.1. Hooks live in <code>.git/hooks/</code>, and <code>.git/</code> is the repository’s <em>storage</em>, not its content — so nothing in it is ever cloned. A rule only you enforce is not a rule. Both fixes commit the hook into the tree: <code>core.hooksPath .githooks</code> points Git at a versioned directory, with the caveat that the setting itself must be run once per clone; or husky, whose <code>"prepare": "husky"</code> script runs automatically after <code>npm install</code>, so a fresh clone installs the hooks with no extra step. Option 4 names a real and very common failure — a hook file that is still <code>.sample</code> or lacks <code>chmod +x</code> does nothing with no error at all — but it cannot be the cause here, because the file was never there. And note the limit the same lesson insists on: hooks are a convenience, never a control. Anyone can pass <code>--no-verify</code>. Anything that must hold belongs in CI plus branch protection.',
            'Bài 12.1. Hook nằm trong <code>.git/hooks/</code>, mà <code>.git/</code> là <em>chỗ chứa</em> của kho mã chứ không phải nội dung của nó — nên không thứ gì trong đó được clone theo. Một luật chỉ mình bạn thi hành thì không phải luật. Cả hai cách sửa đều đưa hook vào cây mã: <code>core.hooksPath .githooks</code> trỏ Git vào một thư mục có phiên bản, kèm lưu ý là chính thiết lập ấy phải chạy một lần cho mỗi bản clone; hoặc dùng husky, với script <code>"prepare": "husky"</code> tự chạy sau <code>npm install</code>, nên một bản clone mới cài luôn hook mà không cần bước nào thêm. Phương án 4 nêu một kiểu hỏng có thật và rất phổ biến — một file hook còn đuôi <code>.sample</code> hoặc thiếu <code>chmod +x</code> thì không làm gì cả mà cũng chẳng báo lỗi — nhưng nó không thể là nguyên nhân ở đây, vì file đó chưa từng có mặt. Và nhớ giới hạn mà cùng bài ấy nhấn mạnh: hook là tiện lợi, không bao giờ là chốt kiểm soát. Ai cũng gõ được <code>--no-verify</code>. Thứ gì buộc phải giữ thì phải nằm ở CI cộng bảo vệ nhánh.',
          ),
        }),

        mcq({
          prompt: B(
            'Anyone can run <code>git config user.name "Linus Torvalds"</code> and commit under that name, and GitHub will even show his avatar because it matches on email. What actually makes authorship evidence?',
            'Ai cũng chạy được <code>git config user.name "Linus Torvalds"</code> rồi commit dưới tên đó, và GitHub còn hiện đúng ảnh đại diện của ông vì nó khớp theo địa chỉ email. Vậy cái gì mới biến quyền tác giả thành bằng chứng?',
          ),
          options: [
            B(
              'The commit hash — it is computed over the author and committer fields as well as the tree, so a forged name produces a hash that no longer matches what the server recomputes, and the push is rejected as corrupt',
              'Mã băm của commit — nó được tính trên cả trường tác giả và trường người commit lẫn tree, nên một cái tên giả sẽ cho ra mã băm không khớp với thứ máy chủ tính lại, và lượt push bị từ chối vì hỏng',
            ),
            B(
              'Pushing over SSH, since the key you authenticate with is registered to your GitHub account and the server stamps each commit it receives with the identity of the connection that delivered it',
              'Việc push qua SSH, vì cái khoá bạn dùng để xác thực đã đăng ký với tài khoản GitHub của bạn và máy chủ đóng dấu lên mỗi commit nó nhận được bằng danh tính của kết nối đã chuyển commit đó tới',
            ),
            B(
              'Branch protection with required reviews, which records who approved each commit that reached <code>main</code> and therefore ties every merged change to at least two named accounts in the audit log',
              'Bảo vệ nhánh kèm review bắt buộc, thứ ghi lại ai đã duyệt từng commit đi vào <code>main</code> và nhờ đó buộc mọi thay đổi được merge vào ít nhất hai tài khoản có tên trong nhật ký kiểm toán',
            ),
            B(
              'A <b>signature</b> — with <code>gpg.format ssh</code>, <code>user.signingkey</code> and <code>commit.gpgsign true</code>, the commit carries cryptographic proof that the holder of a specific private key produced that exact content; <code>git log --format=&#x27;%h %G? %s&#x27;</code> shows <code>G</code>, <code>U</code>, <code>B</code> or <code>N</code> per commit',
              'Một <b>chữ ký</b> — với <code>gpg.format ssh</code>, <code>user.signingkey</code> và <code>commit.gpgsign true</code>, commit mang theo bằng chứng mật mã rằng người giữ một khoá riêng cụ thể đã tạo ra đúng nội dung ấy; <code>git log --format=&#x27;%h %G? %s&#x27;</code> hiện <code>G</code>, <code>U</code>, <code>B</code> hay <code>N</code> cho từng commit',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Lesson 12.2. The author field is whatever <code>user.name</code> and <code>user.email</code> say, and Git cannot verify it — a distributed system has no central authority to ask. Option 1 mistakes integrity for identity: the hash does cover the author field, so it proves the <em>content</em> was not altered, and proves nothing about who wrote it. Option 2 confuses the two uses of one key: authenticating a push says who opened the connection, not who authored each commit, which is why GitHub makes you register the same public key a <b>second</b> time with type "Signing Key" — registering it only as an Authentication key is why the badge says <em>Unverified</em> rather than nothing at all. Know the limits too: rebase and squash create new commits, so the original signature does not survive them, and a Verified badge is an identity signal, not a quality one. If you sign only one thing, sign release tags.',
            'Bài 12.2. Trường tác giả là bất cứ thứ gì <code>user.name</code> và <code>user.email</code> ghi, và Git không kiểm chứng được — một hệ phân tán không có cơ quan trung ương nào để hỏi. Phương án 1 nhầm toàn vẹn với danh tính: mã băm đúng là bao gồm trường tác giả, nên nó chứng minh <em>nội dung</em> không bị sửa, và không chứng minh gì về việc ai viết. Phương án 2 lẫn hai công dụng của một cái khoá: xác thực lúc push cho biết ai mở kết nối, chứ không cho biết ai là tác giả từng commit — và vì thế GitHub bắt bạn đăng ký đúng cái khoá công khai ấy <b>lần thứ hai</b> với loại "Signing Key"; chỉ đăng ký nó như khoá xác thực chính là lý do phù hiệu ghi <em>Unverified</em> chứ không phải không hiện gì. Cũng nên biết giới hạn: rebase và squash tạo ra commit mới nên chữ ký gốc không sống sót, và phù hiệu Verified là tín hiệu về danh tính chứ không phải về chất lượng. Nếu chỉ ký được một thứ, hãy ký tag phát hành.',
          ),
        }),

        // ── Chương 13 — Cứu hộ & Git trong quy trình thật ───────────────
        mcq({
          prompt: B(
            'You checked out a commit directly, worked for an hour, made three commits, then ran <code>git switch main</code>. <code>git log</code> on <code>main</code> does not show them and <code>git branch --contains &lt;hash&gt;</code> prints nothing. What happened, and how do you get them back?',
            'Bạn checkout thẳng vào một commit, làm việc một tiếng, tạo ba commit, rồi chạy <code>git switch main</code>. <code>git log</code> trên <code>main</code> không thấy chúng và <code>git branch --contains &lt;mã băm&gt;</code> không in ra gì. Chuyện gì đã xảy ra, và lấy lại kiểu gì?',
          ),
          options: [
            B(
              'You committed on a detached <code>HEAD</code>, so no branch pointer moved and nothing refers to those commits now — they are alive and unreferenced; <code>git reflog</code> lists them and <code>git switch -c rescue &lt;hash&gt;</code> parks them on a branch',
              'Bạn đã commit khi <code>HEAD</code> lìa cành, nên không con trỏ nhánh nào nhúc nhích và giờ không có gì trỏ tới ba commit ấy — chúng còn sống và không ai tham chiếu; <code>git reflog</code> liệt kê chúng và <code>git switch -c rescue &lt;mã băm&gt;</code> neo chúng vào một nhánh',
            ),
            B(
              'Switching branches with uncommitted work discarded them; <code>git stash list</code> holds the automatic stash Git made',
              'Chuyển nhánh khi còn việc chưa commit đã làm mất chúng; <code>git stash list</code> đang giữ bản stash tự động mà Git tạo ra',
            ),
            B(
              'They went to the commit you checked out, which now has three children; <code>git log --all</code> shows them under that hash',
              'Chúng đi vào commit bạn đã checkout, và commit đó giờ có ba con; <code>git log --all</code> hiện chúng dưới mã băm ấy',
            ),
            B(
              'Git garbage-collected them on the switch, because a detached <code>HEAD</code> is explicitly excluded from the reflog',
              'Git đã dọn rác chúng ngay lúc chuyển nhánh, vì <code>HEAD</code> lìa cành bị loại trừ khỏi reflog một cách tường minh',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running exactly that sequence: after switching away, <code>git branch --contains</code> printed nothing, while <code>git reflog</code> still listed <code>commit: D on detached HEAD</code> at <code>HEAD@{1}</code>, and <code>git switch -c rescue &lt;hash&gt;</code> brought all of it back. The mechanism is lesson 3.1: "being on a branch" means new commits move that branch pointer. Detached, there is no pointer to move, so the commits exist in the object database with nothing referring to them. Option 4 gets the danger direction right but the timing wrong — they are not collected on the switch; unreachable objects survive about 30 days, which is the window lesson 4.4 relies on. Lesson 13.1 adds the habit that avoids the panic entirely: run <code>git switch -c rescue</code> <em>before</em> you switch away, while you can still see where you are.',
            'Đã chạy thật đúng chuỗi đó: sau khi chuyển đi, <code>git branch --contains</code> không in gì, trong khi <code>git reflog</code> vẫn liệt kê <code>commit: D on detached HEAD</code> ở <code>HEAD@{1}</code>, và <code>git switch -c rescue &lt;mã băm&gt;</code> mang tất cả trở lại. Cơ chế nằm ở bài 3.1: "đang ở trên một nhánh" nghĩa là commit mới sẽ dời con trỏ nhánh ấy. Khi lìa cành thì không có con trỏ nào để dời, nên các commit tồn tại trong kho đối tượng mà không có gì trỏ tới. Phương án 4 đoán đúng hướng nguy hiểm nhưng sai thời điểm — chúng không bị dọn ngay lúc chuyển nhánh; đối tượng không với tới được sống khoảng 30 ngày, và đó chính là khoảng thời gian mà bài 4.4 dựa vào. Bài 13.1 bổ sung thói quen tránh hẳn cơn hoảng loạn: hãy chạy <code>git switch -c rescue</code> <em>trước khi</em> chuyển đi, lúc còn nhìn thấy mình đang ở đâu.',
          ),
        }),

        mcq({
          prompt: B(
            'The course’s four-step "review your own diff" ritual runs <code>git log --oneline @{u}..HEAD</code>, then <code>git diff @{u}..HEAD --stat</code>, then the full diff, then <code>git diff --check</code>. Which step does it single out as catching the expensive mistakes, and why?',
            'Nghi thức bốn bước "tự review diff của mình" trong giáo trình chạy <code>git log --oneline @{u}..HEAD</code>, rồi <code>git diff @{u}..HEAD --stat</code>, rồi diff đầy đủ, rồi <code>git diff --check</code>. Bước nào được chỉ đích danh là bắt được những sai lầm đắt nhất, và vì sao?',
          ),
          options: [
            B(
              'Step 1, the commit list, because a stray "wip" subject is the clearest sign a branch is not ready for review',
              'Bước 1, danh sách commit, vì một tiêu đề "wip" sót lại là dấu hiệu rõ nhất cho thấy nhánh chưa sẵn sàng để review',
            ),
            B(
              'Step 3, reading the full diff as a stranger would, because it is the only step that can catch a logic error',
              'Bước 3, đọc diff đầy đủ bằng con mắt người lạ, vì đó là bước duy nhất bắt được lỗi logic',
            ),
            B(
              'Step 4, <code>git diff --check</code>, because it is the only mechanical check and mechanical checks beat human attention',
              'Bước 4, <code>git diff --check</code>, vì nó là phép kiểm máy móc duy nhất và kiểm máy móc thì hơn sự chú ý của con người',
            ),
            B(
              'Step 2, the <b>file list</b> — an unexpected file is almost always a secret, a build artefact or a lockfile you did not mean to regenerate, and ten seconds of reading it has caught more problems than any linter in the course',
              'Bước 2, <b>danh sách file</b> — một file lạ xuất hiện gần như luôn là một bí mật, một sản phẩm build, hoặc một lockfile bạn không định sinh lại, và mười giây đọc nó đã bắt được nhiều vấn đề hơn bất kỳ linter nào trong khoá',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Lesson 13.2 says this in as many words. The point is about cost, not about how clever the check is: a logic error is caught by review and by tests, and whitespace damage is caught by <code>--check</code>, but nothing downstream reliably catches <em>an extra file</em> — a linter has no opinion about <code>.env</code> being present, and a reviewer skims a file list at the top of a large diff. <code>@{u}</code> is the shorthand that makes the whole ritual cheap: it means the upstream branch, so <code>@{u}..HEAD</code> is exactly "what I have not pushed". The same lesson pairs this with the AI-agent rules for the same reason — <b>never <code>git add -A</code> while another session is running</b>, because it sweeps up whatever that session is midway through writing.',
            'Bài 13.2 nói đúng bằng chừng ấy chữ. Ý ở đây là về cái giá, không phải về việc phép kiểm thông minh tới đâu: lỗi logic thì review và test bắt được, hỏng khoảng trắng thì <code>--check</code> bắt được, nhưng không có gì ở phía sau bắt được một cách đáng tin <em>một file thừa</em> — linter không có ý kiến gì về việc <code>.env</code> có mặt, còn người review thì lướt qua danh sách file ở đầu một diff lớn. <code>@{u}</code> là cách viết tắt làm cả nghi thức này thành rẻ: nó nghĩa là nhánh upstream, nên <code>@{u}..HEAD</code> đúng là "những gì tôi chưa push". Cùng bài ấy ghép chuyện này với luật làm việc cùng agent AI vì đúng lý do đó — <b>đừng bao giờ <code>git add -A</code> khi một phiên khác đang chạy</b>, vì nó hốt luôn thứ mà phiên kia đang viết dở.',
          ),
        }),
      ],
    },
  ],
};
