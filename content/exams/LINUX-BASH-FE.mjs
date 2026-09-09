/**
 * Linux & Bash — Final Exam (FE): 50 câu trắc nghiệm phủ cả 13 chương (s00–s12).
 *
 * Đề tự soạn, bám sát `content/courses/linux-bash/s00…s12`. Có cả câu lý thuyết
 * lẫn câu đọc lệnh; MỌI câu hỏi "lệnh này in ra gì / trả về mã thoát nào" đều đã
 * CHẠY THẬT — và chạy trên LINUX THẬT, không phải macOS:
 *
 *   docker run --rm -v …:/w -w /w debian:bookworm-slim bash …
 *   bash 5.2.15 · GNU coreutils 9.1 · GNU sed 4.9 · GNU grep 3.8 · gawk 5.2.1
 *   · rsync 3.2.7 · curl 7.88.1
 *
 * Vì sao phải chạy trong container: máy soạn đề là macOS, ở đó /bin/bash là bản
 * 3.2 từ 2007 (không có `${var^^}`, không mảng liên kết) và sed/grep/stat/date
 * là bản BSD với hành vi khác GNU. Lấy output của macOS rồi ghi vào một đề dạy
 * Linux là cách chắc chắn nhất để phát đề sai. Hai câu duy nhất cố ý so sánh hai
 * nền (câu 15 về `sed -i`) đã chạy trên CẢ HAI và chép nguyên văn cả hai phía.
 *
 * ⚠️ Một phát hiện lúc soạn, ghi lại để người sau khỏi vấp: bài 4.3 của khoá nói
 * `chmod 775` trên một thư mục có setgid sẽ âm thầm xoá bit `s`. Đo thật với GNU
 * coreutils 9.1 thì KHÔNG: chmod của GNU cố ý GIỮ setuid/setgid trên thư mục kể
 * cả với mode số (`chmod 0775` cũng giữ) — chỉ `g-s` mới gỡ. Trên FILE thì
 * `chmod 755` đúng là xoá setgid, và bit dính trên thư mục thì `chmod 777` đúng
 * là xoá. Đề này vì thế KHÔNG hỏi câu ấy theo cách bài học viết.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/LINUX-BASH-FE.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/linux-bash-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all 13 chapters, from "what is a shell, exactly" to "diagnose a server you have never seen". Many questions show a command and ask what it prints or what exit code it returns; every one of those answers came from actually running it on a Linux box (Debian, bash 5.2, GNU coreutils), so read the command rather than the intuition.</p>' +
  '<p>Two habits pay off here. First, always ask <em>what did the shell turn this line into</em> before asking what the program does — a glob expanded, a variable split into words, a redirection applied left to right. Second, read exit codes: <code>0</code>, <code>1</code>, <code>7</code>, <code>22</code>, <code>126</code>, <code>127</code>, <code>137</code> each mean something specific, and several questions turn on <em>which</em> one comes back.</p>' +
  '<p>Unless a question says otherwise, assume a Linux machine with GNU coreutils and <code>bash</code> 5 — not macOS, whose <code>sed</code>, <code>date</code> and <code>/bin/bash</code> differ. You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả 13 chương, từ "shell rốt cuộc là cái gì" tới "chẩn đoán một máy chủ bạn chưa từng thấy". Nhiều câu cho sẵn một dòng lệnh rồi hỏi nó in ra gì hoặc trả về mã thoát nào; mọi đáp án loại đó đều lấy từ việc chạy thật trên một máy Linux (Debian, bash 5.2, GNU coreutils), nên hãy đọc dòng lệnh thay vì đoán theo cảm tính.</p>' +
  '<p>Hai thói quen giúp ích ở đây. Một là luôn hỏi <em>shell đã biến dòng này thành cái gì</em> trước khi hỏi chương trình làm gì — một glob vừa được khai triển, một biến vừa bị cắt thành nhiều từ, một phép chuyển hướng được áp dụng từ trái sang phải. Hai là đọc mã thoát: <code>0</code>, <code>1</code>, <code>7</code>, <code>22</code>, <code>126</code>, <code>127</code>, <code>137</code> mỗi số mang một nghĩa riêng, và nhiều câu ăn thua ở chỗ số NÀO quay về.</p>' +
  '<p>Nếu đề không nói gì khác, hãy giả định một máy Linux với GNU coreutils và <code>bash</code> 5 — không phải macOS, nơi <code>sed</code>, <code>date</code> và <code>/bin/bash</code> đều khác. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'linux-bash' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 4,
      title: B(
        'Final Exam — the whole Linux & Bash course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá Linux & Bash (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all thirteen chapters: what a shell is, paths and the filesystem, files, globs and find, streams, pipes, grep, sed and awk, permissions and users, processes and signals, variables, quoting and expansion, production scripts, PATH and the environment, networking, curl, SSH and rsync, disk, packages and logs, systemd and cron, and diagnosing a live server.',
        'Năm mươi câu trắc nghiệm phủ cả mười ba chương: shell là gì, đường dẫn và hệ thống file, file, glob và find, ba dòng chuẩn, ống dẫn, grep, sed và awk, quyền và người dùng, tiến trình và tín hiệu, biến, dấu nháy và khai triển, script chạy thật, PATH và môi trường, mạng, curl, SSH và rsync, đĩa, gói phần mềm và log, systemd và cron, và chẩn đoán một máy chủ đang chạy.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        // ══ Chương 0 — Giới thiệu, shell là gì ══════════════════════════
        // Q1 · 0.2 — vì sao cd phải là builtin
        mcq({
          prompt: B(
            'On a Linux box these two commands print exactly this. Why can <code>cd</code> not be a program in <code>/usr/bin</code> like <code>ls</code> is?' + code(
              '$ type cd\n' +
              'cd is a shell builtin\n' +
              '$ type ls\n' +
              'ls is /usr/bin/ls',
            ),
            'Trên một máy Linux, hai lệnh này in ra đúng như vậy. Vì sao <code>cd</code> không thể là một chương trình nằm trong <code>/usr/bin</code> giống <code>ls</code>?',
          ),
          options: [
            B('Because <code>cd</code> is too small to be worth a separate file, so the shell authors inlined it as an optimisation', 'Vì <code>cd</code> quá nhỏ, không đáng để thành một file riêng, nên tác giả shell nhét thẳng nó vào cho nhanh'),
            B('Because only a builtin is allowed to read the filesystem, and an external program would need root to look at a directory', 'Vì chỉ builtin mới được phép đọc hệ thống file, còn một chương trình bên ngoài thì phải là root mới nhìn được vào một thư mục'),
            B('Because a program runs in a child process, and changing directory means changing the state of the shell itself — a child cannot reach into its parent to do that', 'Vì một chương trình chạy trong tiến trình con, mà đổi thư mục nghĩa là đổi trạng thái của chính shell — tiến trình con không với vào tiến trình cha để làm việc đó được'),
            B('Because <code>/usr/bin</code> is read-only on most distributions, so no new command can be installed there', 'Vì <code>/usr/bin</code> chỉ đọc trên phần lớn bản phân phối, nên không cài thêm lệnh mới vào đó được'),
          ],
          correct: 2,
          explanation: EX(
            'Verified with <code>type</code> on Debian. When you run <code>ls</code>, the shell forks and the child <code>exec</code>s <code>/usr/bin/ls</code>; whatever that child changes about itself dies with it. The current working directory is per-process state, so a <code>cd</code> program would change its <em>own</em> directory, exit, and leave the shell exactly where it was — the command would appear to do nothing. That is why <code>cd</code>, and everything else that must mutate the shell (<code>export</code>, <code>alias</code>, <code>ulimit</code>, <code>trap</code>, <code>source</code>), is a builtin. Option 1 is a real motivation for builtins like <code>echo</code>, which exists both ways (<code>type -a echo</code> shows the builtin <em>and</em> <code>/usr/bin/echo</code>) — but speed is not why <code>cd</code> has no external version; correctness is.',
            'Đã kiểm bằng <code>type</code> trên Debian. Khi bạn chạy <code>ls</code>, shell tách đôi (fork) rồi tiến trình con nạp <code>/usr/bin/ls</code> bằng <code>exec</code>; con đổi gì về chính nó thì thứ đó chết theo nó. Thư mục làm việc hiện tại là trạng thái riêng của từng tiến trình, nên một chương trình <code>cd</code> sẽ đổi thư mục của <em>chính nó</em>, thoát ra, và để shell nằm nguyên chỗ cũ — lệnh trông như không làm gì cả. Đó là lý do <code>cd</code>, và mọi thứ phải thay đổi trạng thái của shell (<code>export</code>, <code>alias</code>, <code>ulimit</code>, <code>trap</code>, <code>source</code>), đều là builtin. Phương án 1 là một động cơ có thật với những builtin như <code>echo</code>, thứ tồn tại cả hai dạng (<code>type -a echo</code> cho thấy cả bản builtin <em>lẫn</em> <code>/usr/bin/echo</code>) — nhưng tốc độ không phải lý do <code>cd</code> không có bản ngoài; tính đúng đắn mới là.',
          ),
        }),

        // Q2 · 0.2 — kernel / shell / terminal
        mcq({
          prompt: B(
            'You are in a graphical desktop, you open GNOME Terminal, and you type <code>ls</code>. Which description of kernel, shell and terminal is correct?',
            'Bạn đang ở giao diện đồ hoạ, mở GNOME Terminal, rồi gõ <code>ls</code>. Mô tả nào về kernel, shell và terminal là đúng?',
          ),
          options: [
            B('The terminal only draws characters and forwards keystrokes; <code>bash</code> is a normal program running inside it that parses the line and asks the kernel to start <code>ls</code>; the kernel is what actually creates the process and reads the disk', 'Terminal chỉ vẽ ký tự và chuyển tiếp phím bấm; <code>bash</code> là một chương trình bình thường chạy bên trong nó, có nhiệm vụ phân tích dòng lệnh rồi nhờ kernel khởi động <code>ls</code>; còn kernel mới là thứ thật sự tạo ra tiến trình và đọc đĩa'),
            B('The terminal is the command interpreter; <code>bash</code> is the window that draws it; the kernel is the collection of programs in <code>/usr/bin</code>', 'Terminal là bộ thông dịch lệnh; <code>bash</code> là cửa sổ vẽ ra nó; còn kernel là tập hợp các chương trình nằm trong <code>/usr/bin</code>'),
            B('The kernel parses the command line and hands the parsed result to the shell, which draws the result in the terminal', 'Kernel phân tích dòng lệnh rồi đưa kết quả đã phân tích cho shell, và shell vẽ kết quả ra terminal'),
            B('They are three names for the same component, kept for historical reasons; on Linux <code>bash</code>, the kernel and the terminal are all part of one process', 'Chúng là ba tên gọi của cùng một thành phần, giữ lại vì lý do lịch sử; trên Linux thì <code>bash</code>, kernel và terminal đều nằm trong cùng một tiến trình'),
          ],
          correct: 0,
          explanation: EX(
            'Three separate layers, and lesson 0.2 exists because mixing them up makes everything later confusing. The <b>terminal</b> (GNOME Terminal, iTerm, the PuTTY window, a serial console) is a dumb display: it paints glyphs and sends your keystrokes onward. The <b>shell</b> (<code>bash</code>, <code>zsh</code>, <code>fish</code>) is an ordinary user-space program running inside it, whose job is to read a line, expand it, and ask for programs to be started. The <b>kernel</b> is the part of Linux that owns the hardware: it creates processes, schedules them, reads the disk, moves packets. Swap the terminal for a different one and nothing about your commands changes; swap the shell and the same keystrokes mean different things. That separation is also why an SSH session works at all — the terminal is on your laptop and the shell is on the server.',
            'Ba tầng riêng biệt, và bài 0.2 tồn tại bởi lẫn lộn chúng làm mọi thứ về sau rối tung. <b>Terminal</b> (GNOME Terminal, iTerm, cửa sổ PuTTY, một console nối tiếp) là một màn hình ngờ nghệch: nó vẽ ký tự và chuyển phím bấm đi tiếp. <b>Shell</b> (<code>bash</code>, <code>zsh</code>, <code>fish</code>) là một chương trình người dùng bình thường chạy bên trong đó, việc của nó là đọc một dòng, khai triển dòng ấy, rồi yêu cầu khởi động chương trình. <b>Kernel</b> là phần Linux nắm phần cứng: tạo tiến trình, xếp lịch chạy, đọc đĩa, đẩy gói tin. Đổi sang một terminal khác thì lệnh của bạn không đổi gì; đổi shell thì cùng những phím ấy lại mang nghĩa khác. Chính sự tách bạch đó cũng là lý do một phiên SSH chạy được — terminal nằm ở laptop của bạn còn shell nằm trên máy chủ.',
          ),
        }),

        // ══ Chương 1 — Shell & hệ thống file ════════════════════════════
        // Q3 · 1.2 — đường dẫn tương đối
        mcq({
          prompt: B(
            'Run on a stock Linux machine. What does the last line print?' + code(
              '$ cd /var/log\n' +
              '$ cd ../lib\n' +
              '$ pwd',
            ),
            'Chạy trên một máy Linux tiêu chuẩn. Dòng cuối in ra gì?' + code(
              '$ cd /var/log\n' +
              '$ cd ../lib\n' +
              '$ pwd',
            ),
          ),
          options: [
            B('<code>/var/log/lib</code> — <code>..</code> is ignored because <code>lib</code> follows it', '<code>/var/log/lib</code> — dấu <code>..</code> bị bỏ qua vì có <code>lib</code> đi sau'),
            B('<code>/lib</code> — <code>..</code> goes all the way back to the root before the next name is applied', '<code>/lib</code> — dấu <code>..</code> lùi thẳng về gốc trước khi tên kế tiếp được áp dụng'),
            B('An error: <code>cd: ../lib: No such file or directory</code>, and <code>pwd</code> still prints <code>/var/log</code>', 'Một lỗi: <code>cd: ../lib: No such file or directory</code>, và <code>pwd</code> vẫn in <code>/var/log</code>'),
            B('<code>/var/lib</code>', '<code>/var/lib</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Verified by running it: <code>/var/lib</code>. A relative path is resolved against the current directory one component at a time. From <code>/var/log</code>, <code>..</code> means <code>/var</code>, and then <code>lib</code> means <code>/var/lib</code> — one step up, one step sideways. The whole difference between a relative path and an absolute one is the leading slash: <code>/lib</code> would be option 2, a completely different directory holding the system\'s shared libraries. This is also why a script that works when you run it by hand breaks under <code>cron</code> or <code>systemd</code>: those start it from a different directory, so every relative path in it resolves somewhere else. Relative paths for typing, absolute paths for anything automated.',
            'Đã chạy thật: <code>/var/lib</code>. Một đường dẫn tương đối được giải quyết theo thư mục hiện tại, từng thành phần một. Từ <code>/var/log</code>, dấu <code>..</code> nghĩa là <code>/var</code>, rồi <code>lib</code> nghĩa là <code>/var/lib</code> — lùi một bước, rẽ ngang một bước. Toàn bộ khác biệt giữa đường dẫn tương đối và tuyệt đối nằm ở dấu gạch chéo đứng đầu: <code>/lib</code> chính là phương án 2, một thư mục hoàn toàn khác chứa thư viện dùng chung của hệ thống. Đây cũng là lý do một script chạy ngon khi bạn gõ tay lại vỡ dưới <code>cron</code> hay <code>systemd</code>: chúng khởi động nó từ một thư mục khác, nên mọi đường dẫn tương đối bên trong trỏ sang chỗ khác. Đường dẫn tương đối để gõ tay, đường dẫn tuyệt đối cho mọi thứ tự động.',
          ),
        }),

        // Q4 · 1.2 + 8.1 — vì sao ./script.sh cần dấu chấm
        mcq({
          prompt: B(
            'You have an executable <code>deploy.sh</code> in the current directory. Typing <code>deploy.sh</code> gives "command not found", while <code>./deploy.sh</code> works. Why is the current directory deliberately left out of <code>PATH</code>?',
            'Bạn có file <code>deploy.sh</code> đã cấp quyền chạy trong thư mục hiện tại. Gõ <code>deploy.sh</code> thì báo "command not found", còn <code>./deploy.sh</code> lại chạy. Vì sao thư mục hiện tại bị cố ý để ra ngoài <code>PATH</code>?',
          ),
          options: [
            B('Because <code>PATH</code> can only hold absolute paths, and <code>.</code> is relative, so the shell would refuse to parse it', 'Vì <code>PATH</code> chỉ chứa được đường dẫn tuyệt đối, mà <code>.</code> là tương đối, nên shell sẽ không phân tích nổi'),
            B('Because otherwise anyone who can write a file into a directory you visit could name it <code>ls</code> and have it run the moment you <code>cd</code> in and type <code>ls</code>', 'Vì nếu không, bất cứ ai ghi được một file vào một thư mục bạn ghé qua đều có thể đặt tên nó là <code>ls</code> và nó sẽ chạy ngay khi bạn <code>cd</code> vào rồi gõ <code>ls</code>'),
            B('Because the shell would then have to read the whole directory on every command, which is too slow on a large filesystem', 'Vì khi đó shell sẽ phải đọc cả thư mục mỗi lần gõ lệnh, quá chậm trên một hệ thống file lớn'),
            B('Because scripts in the current directory have not been signed, and modern kernels refuse to execute unsigned binaries', 'Vì script trong thư mục hiện tại chưa được ký, mà kernel hiện đại thì từ chối chạy các file nhị phân chưa ký'),
          ],
          correct: 1,
          explanation: EX(
            'It is a security boundary, not an inconvenience. If <code>.</code> were on <code>PATH</code>, a hostile or careless file dropped into a shared directory — <code>/tmp</code>, a downloads folder, an extracted archive — could be named after a command you type reflexively, and it would run as you, silently, the first time you used that command in that directory. The two extra characters make running something from the current directory a <em>deliberate</em> act. The same reasoning applies to an empty entry in <code>PATH</code>: a leading, trailing or doubled colon means "the current directory", so <code>PATH="$PATH:"</code> quietly reintroduces the hole. If you ever see <code>.</code> or an empty entry in a <code>PATH</code> on a server, treat it as a finding.',
            'Đó là một ranh giới an ninh, không phải một sự phiền phức. Nếu <code>.</code> nằm trong <code>PATH</code>, một file độc hại hay cẩu thả bị thả vào một thư mục dùng chung — <code>/tmp</code>, thư mục tải về, một kho nén vừa giải — có thể được đặt tên trùng một lệnh bạn gõ theo phản xạ, và nó sẽ chạy với danh nghĩa bạn, âm thầm, ngay lần đầu bạn dùng lệnh đó trong thư mục ấy. Hai ký tự thêm vào biến việc chạy một thứ từ thư mục hiện tại thành một hành động <em>có chủ ý</em>. Lý lẽ đó cũng áp dụng cho một mục rỗng trong <code>PATH</code>: một dấu hai chấm đứng đầu, đứng cuối hay lặp đôi đều nghĩa là "thư mục hiện tại", nên <code>PATH="$PATH:"</code> lặng lẽ mở lại cái lỗ ấy. Thấy <code>.</code> hoặc một mục rỗng trong <code>PATH</code> trên một máy chủ thì hãy coi đó là một phát hiện.',
          ),
        }),

        // Q5 · 1.4 — mtime vs ctime
        mcq({
          prompt: B(
            'A file was last written in January 2024 and has not been touched since. Today you run <code>chmod 600</code> on it and nothing else. Which timestamps changed?',
            'Một file được ghi lần cuối vào tháng 1/2024 và từ đó không ai đụng tới. Hôm nay bạn chạy <code>chmod 600</code> lên nó, không làm gì khác. Những dấu thời gian nào đã đổi?',
          ),
          options: [
            B('Both <code>mtime</code> and <code>ctime</code> move to now — any change to a file updates both', 'Cả <code>mtime</code> lẫn <code>ctime</code> nhảy về hiện tại — bất cứ thay đổi nào lên một file cũng cập nhật cả hai'),
            B('Neither — <code>chmod</code> only writes to the directory entry, not to the file', 'Không cái nào — <code>chmod</code> chỉ ghi vào mục thư mục, không ghi vào file'),
            B('<code>ctime</code> moves to now; <code>mtime</code> stays in January 2024, because <code>ctime</code> is inode-change time, not creation time', '<code>ctime</code> nhảy về hiện tại; <code>mtime</code> vẫn ở tháng 1/2024, vì <code>ctime</code> là thời điểm inode thay đổi, không phải thời điểm tạo file'),
            B('<code>mtime</code> moves to now and <code>ctime</code> stays, because <code>ctime</code> records when the file was created', '<code>mtime</code> nhảy về hiện tại còn <code>ctime</code> đứng yên, vì <code>ctime</code> ghi lại lúc file được tạo ra'),
          ],
          correct: 2,
          explanation: EX(
            'Verified with <code>stat -c \'%y %z\'</code> before and after: <code>mtime</code> stayed at <code>2024-01-15 10:00:00</code> while <code>ctime</code> jumped to the moment of the <code>chmod</code>. The <b>c</b> in <code>ctime</code> is <em>change</em>, not <em>creation</em> — it is the time the inode was last modified, and permissions, ownership and link count all live in the inode. There is no portable creation time on Linux; modern filesystems can record a birth time (<code>stat</code> shows <code>Birth:</code> on ext4 with newer tools) but nothing should depend on it. Practical consequence: <code>find -mtime</code> asks "when was the content last written", <code>find -ctime</code> asks "when was anything about this file last touched" — a mass <code>chown</code> resets every <code>ctime</code> on the tree and will wreck a cleanup job built on <code>-ctime</code>.',
            'Đã kiểm bằng <code>stat -c \'%y %z\'</code> trước và sau: <code>mtime</code> vẫn nằm ở <code>2024-01-15 10:00:00</code> trong khi <code>ctime</code> nhảy sang đúng lúc chạy <code>chmod</code>. Chữ <b>c</b> trong <code>ctime</code> là <em>change</em> (thay đổi), không phải <em>creation</em> (tạo ra) — nó là thời điểm inode được sửa lần cuối, mà quyền, chủ sở hữu và số liên kết đều nằm trong inode. Trên Linux không có thời điểm tạo file theo chuẩn chung; các hệ thống file hiện đại có thể ghi thời điểm khai sinh (<code>stat</code> hiện dòng <code>Birth:</code> trên ext4 với công cụ đủ mới) nhưng không nên phụ thuộc vào nó. Hệ quả thực tế: <code>find -mtime</code> hỏi "nội dung được ghi lần cuối khi nào", còn <code>find -ctime</code> hỏi "thứ gì đó về file này được đụng tới lần cuối khi nào" — một lần <code>chown</code> hàng loạt sẽ đặt lại toàn bộ <code>ctime</code> của cả cây và phá tan một job dọn dẹp xây trên <code>-ctime</code>.',
          ),
        }),

        // ══ Chương 2 — File & thư mục ═══════════════════════════════════
        // Q6 · 2.2 — thứ tự khai triển glob
        mcq({
          prompt: B(
            'A directory contains exactly <code>file1.txt</code>, <code>file2.txt</code> and <code>file10.txt</code>. What does <code>echo *.txt</code> print, and in what order?',
            'Một thư mục chứa đúng ba file <code>file1.txt</code>, <code>file2.txt</code> và <code>file10.txt</code>. Lệnh <code>echo *.txt</code> in ra gì, và theo thứ tự nào?',
          ),
          options: [
            B('<code>file1.txt file2.txt file10.txt</code> — the shell reads the digits inside each name and sorts them as numbers, which is why glob order is safe to rely on in a loop', '<code>file1.txt file2.txt file10.txt</code> — shell đọc các chữ số bên trong từng tên rồi sắp chúng như số, và vì thế thứ tự của glob là thứ đáng tin trong một vòng lặp'),
            B('<code>*.txt</code> — <code>echo</code> is a shell builtin, so the pattern reaches it untouched and it prints the literal text it was given', '<code>*.txt</code> — <code>echo</code> là một builtin của shell, nên cái mẫu tới tay nó nguyên vẹn và nó in ra đúng đoạn chữ được đưa'),
            B('The three names in whatever order the directory happens to store them on disk, which varies between runs and between filesystems', 'Ba cái tên theo thứ tự mà thư mục tình cờ lưu chúng trên đĩa, và thứ tự đó đổi giữa các lần chạy và giữa các hệ thống file'),
            B('<code>file1.txt file10.txt file2.txt</code> — the shell expands and sorts the names as text, so <code>1</code> then <code>0</code> comes before <code>2</code>', '<code>file1.txt file10.txt file2.txt</code> — shell khai triển rồi sắp các tên như chuỗi ký tự, nên <code>1</code> rồi <code>0</code> đứng trước <code>2</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Verified by running it: <code>file1.txt file10.txt file2.txt</code>. Two facts in one line. First, <code>echo</code> never sees a star — the <b>shell</b> expands <code>*.txt</code> against the real directory before <code>echo</code> starts, and hands it three separate arguments. That is why <code>rm *.log</code> receives filenames, not a pattern, and why prefixing a destructive command with <code>echo</code> is a free dry run. Second, the expansion is <b>sorted as text</b>, not numerically, so <code>file10</code> sits between <code>file1</code> and <code>file2</code> — exactly the same trap as <code>sort</code> without <code>-n</code> (lesson 3.4), in a different place. A <code>for f in *.txt</code> loop that assumes numeric order over log parts or page numbers processes them in the wrong sequence and nothing warns you.',
            'Đã chạy thật: <code>file1.txt file10.txt file2.txt</code>. Hai sự thật trong một dòng. Thứ nhất, <code>echo</code> không bao giờ nhìn thấy dấu sao — <b>shell</b> khai triển <code>*.txt</code> theo thư mục thật trước khi <code>echo</code> khởi động, rồi đưa cho nó ba tham số riêng biệt. Đó là lý do <code>rm *.log</code> nhận được các tên file chứ không phải một cái mẫu, và cũng là lý do đặt <code>echo</code> trước một lệnh nguy hiểm là một lần chạy thử miễn phí. Thứ hai, phép khai triển được <b>sắp như chuỗi ký tự</b>, không phải theo số, nên <code>file10</code> nằm giữa <code>file1</code> và <code>file2</code> — đúng cái bẫy của <code>sort</code> khi thiếu <code>-n</code> (bài 3.4), chỉ là ở một chỗ khác. Một vòng <code>for f in *.txt</code> mà tin rằng thứ tự là theo số, khi chạy trên các mảnh log hay số trang, sẽ xử lý sai thứ tự mà không có gì báo cho bạn.',
          ),
        }),

        // Q7 · 2.2 — glob không khớp
        mcq({
          prompt: B(
            'The current directory contains <code>a.txt</code> and no <code>.csv</code> file at all. In default bash, what does this loop print?' + code(
              'for f in *.csv; do\n' +
              '  echo "processing [$f]"\n' +
              'done',
            ),
            'Thư mục hiện tại có <code>a.txt</code> và tuyệt đối không có file <code>.csv</code> nào. Với bash mặc định, vòng lặp này in ra gì?' + code(
              'for f in *.csv; do\n' +
              '  echo "processing [$f]"\n' +
              'done',
            ),
          ),
          options: [
            B('<code>processing [*.csv]</code> — an unmatched glob is passed through literally, so the loop runs once on a filename that does not exist', '<code>processing [*.csv]</code> — một glob không khớp được truyền qua nguyên văn, nên vòng lặp chạy đúng một lần với một tên file không tồn tại'),
            B('Nothing — bash drops a glob that matches no file, so the loop body never runs', 'Không gì cả — bash bỏ đi một glob không khớp file nào, nên thân vòng lặp không chạy lần nào'),
            B('<code>processing []</code> — the variable is set to the empty string', '<code>processing []</code> — biến được đặt thành chuỗi rỗng'),
            B('An error, <code>bash: no match: *.csv</code>, and the script stops before the loop', 'Một lỗi, <code>bash: no match: *.csv</code>, và script dừng trước khi vào vòng lặp'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it: <code>processing [*.csv]</code>, once. In default bash a glob that matches nothing is left <b>unchanged</b> and passed to the command as literal text — so the loop body runs exactly once with <code>f</code> set to the pattern itself, and a script that then does <code>gzip "$f"</code> or <code>rm "$f"</code> fails on a file called <code>*.csv</code>. Option 2 is what happens with <code>shopt -s nullglob</code>, which is almost always what you want inside a script (verified: with <code>nullglob</code> set, the same loop printed nothing). Option 4 is <code>shopt -s failglob</code>, which is the better choice interactively, where an error is more useful than a surprise. Note <code>zsh</code> behaves like option 4 by default, which is why a loop copied from a <code>zsh</code> session can behave differently in a <code>bash</code> script.',
            'Đã chạy thật: <code>processing [*.csv]</code>, đúng một lần. Với bash mặc định, một glob không khớp gì được giữ <b>nguyên</b> và truyền cho lệnh dưới dạng chữ — nên thân vòng lặp chạy đúng một lần với <code>f</code> mang chính cái mẫu, và một script sau đó gọi <code>gzip "$f"</code> hay <code>rm "$f"</code> sẽ hỏng vì một file tên <code>*.csv</code>. Phương án 2 là chuyện xảy ra khi bật <code>shopt -s nullglob</code>, và đó gần như luôn là thứ bạn muốn bên trong một script (đã kiểm: bật <code>nullglob</code> thì đúng vòng lặp ấy không in gì). Phương án 4 là <code>shopt -s failglob</code>, lựa chọn tốt hơn khi gõ tay, vì lúc đó một lỗi có ích hơn một bất ngờ. Lưu ý <code>zsh</code> mặc định hành xử như phương án 4, nên một vòng lặp chép từ phiên <code>zsh</code> có thể chạy khác trong một script <code>bash</code>.',
          ),
        }),

        // Q8 · 2.3 — find -exec \; vs +
        mcq({
          prompt: B(
            'Three <code>.txt</code> files sit in the current directory. These two commands were run and their real output is shown. What is the difference between <code>\\;</code> and <code>+</code>?' + code(
              '$ find . -name \'*.txt\' -exec sh -c \'echo "got $# args"\' _ {} \\;\n' +
              'got 1 args\n' +
              'got 1 args\n' +
              'got 1 args\n' +
              '\n' +
              '$ find . -name \'*.txt\' -exec sh -c \'echo "got $# args"\' _ {} +\n' +
              'got 3 args',
            ),
            'Có ba file <code>.txt</code> trong thư mục hiện tại. Hai lệnh sau đã được chạy và kết quả thật hiện ở dưới. Khác biệt giữa <code>\\;</code> và <code>+</code> là gì?' + code(
              '$ find . -name \'*.txt\' -exec sh -c \'echo "got $# args"\' _ {} \\;\n' +
              'got 1 args\n' +
              'got 1 args\n' +
              'got 1 args\n' +
              '\n' +
              '$ find . -name \'*.txt\' -exec sh -c \'echo "got $# args"\' _ {} +\n' +
              'got 3 args',
            ),
          ),
          options: [
            B('<code>\\;</code> runs the command once with every path; <code>+</code> runs it once per file, which is why it is slower', '<code>\\;</code> chạy lệnh một lần với mọi đường dẫn; <code>+</code> chạy mỗi file một lần, và vì thế nó chậm hơn'),
            B('<code>\\;</code> starts one process per matched file; <code>+</code> batches as many paths as fit onto one command line, so on thousands of files it starts a handful of processes instead of thousands', '<code>\\;</code> khởi động một tiến trình cho mỗi file khớp; <code>+</code> gom được bao nhiêu đường dẫn vừa một dòng lệnh thì gom, nên với hàng nghìn file nó khởi động vài tiến trình thay vì hàng nghìn'),
            B('They are identical; <code>+</code> is only newer syntax that avoids having to escape the semicolon', 'Chúng y hệt nhau; <code>+</code> chỉ là cú pháp mới hơn, tránh phải thoát dấu chấm phẩy'),
            B('<code>+</code> only works together with <code>-delete</code>, and <code>\\;</code> only with external commands', '<code>+</code> chỉ chạy được cùng <code>-delete</code>, còn <code>\\;</code> chỉ chạy với lệnh bên ngoài'),
          ],
          correct: 1,
          explanation: EX(
            'The counts in the real output are the whole answer: <code>\\;</code> gave three invocations of one argument each, <code>+</code> gave one invocation of three. On three files nobody notices; on 50,000 files <code>\\;</code> means 50,000 <code>fork</code>+<code>exec</code> pairs and can take minutes where <code>+</code> takes seconds. Two caveats worth carrying: <code>+</code> requires <code>{}</code> to be the <em>last</em> thing before it, and it only works when the command accepts many paths at once (<code>gzip</code>, <code>chmod</code>, <code>grep</code> do; <code>mv src dst</code> does not). The semicolon needs escaping because <code>;</code> is a shell metacharacter — the shell would end the <code>find</code> command there; <code>\\;</code> and <code>\';\'</code> are equally valid.',
            'Chính hai con số trong output thật là toàn bộ câu trả lời: <code>\\;</code> cho ba lượt gọi, mỗi lượt một tham số; <code>+</code> cho một lượt gọi với ba tham số. Với ba file thì không ai để ý; với 50.000 file thì <code>\\;</code> nghĩa là 50.000 cặp <code>fork</code>+<code>exec</code> và có thể mất vài phút ở chỗ <code>+</code> chỉ mất vài giây. Hai lưu ý đáng mang theo: <code>+</code> đòi <code>{}</code> phải là thứ <em>cuối cùng</em> đứng trước nó, và nó chỉ dùng được khi lệnh nhận nhiều đường dẫn một lúc (<code>gzip</code>, <code>chmod</code>, <code>grep</code> thì được; <code>mv src dst</code> thì không). Dấu chấm phẩy phải thoát vì <code>;</code> là ký tự đặc biệt của shell — shell sẽ kết thúc lệnh <code>find</code> ngay tại đó; viết <code>\\;</code> hay <code>\';\'</code> đều đúng như nhau.',
          ),
        }),

        // Q9 · 2.4 — hard link vs symlink
        mcq({
          prompt: B(
            'This was run on Linux. Fill in the two blanks.' + code(
              '$ echo data > orig.txt\n' +
              '$ ln    orig.txt hard.txt      # hard link\n' +
              '$ ln -s orig.txt soft.txt      # symbolic link\n' +
              '$ rm orig.txt\n' +
              '$ cat hard.txt\n' +
              '???\n' +
              '$ cat soft.txt\n' +
              '???',
            ),
            'Đoạn này đã chạy trên Linux. Hãy điền vào hai chỗ trống.' + code(
              '$ echo data > orig.txt\n' +
              '$ ln    orig.txt hard.txt      # liên kết cứng\n' +
              '$ ln -s orig.txt soft.txt      # liên kết tượng trưng\n' +
              '$ rm orig.txt\n' +
              '$ cat hard.txt\n' +
              '???\n' +
              '$ cat soft.txt\n' +
              '???',
            ),
          ),
          options: [
            B('Both print <code>data</code> — <code>rm</code> only removed one of three names for the same file', 'Cả hai đều in <code>data</code> — <code>rm</code> chỉ gỡ một trong ba cái tên trỏ vào cùng một file'),
            B('Both fail with "No such file or directory" — deleting the original invalidates every link to it', 'Cả hai đều hỏng với "No such file or directory" — xoá bản gốc là vô hiệu hoá mọi liên kết tới nó'),
            B('<code>hard.txt</code> prints <code>data</code>; <code>soft.txt</code> fails with <code>cat: soft.txt: No such file or directory</code>', '<code>hard.txt</code> in ra <code>data</code>; <code>soft.txt</code> hỏng với <code>cat: soft.txt: No such file or directory</code>'),
            B('<code>hard.txt</code> fails; <code>soft.txt</code> prints <code>data</code>, because a symlink keeps its own copy of the content', '<code>hard.txt</code> hỏng; <code>soft.txt</code> in ra <code>data</code>, vì liên kết tượng trưng giữ bản sao nội dung của riêng nó'),
          ],
          correct: 2,
          explanation: EX(
            'Verified: <code>cat hard.txt</code> printed <code>data</code>, <code>cat soft.txt</code> printed <code>cat: soft.txt: No such file or directory</code>. A <b>hard link</b> is a second name for the same inode; <code>ls -l</code> showed link count <code>2</code> on both names, and <code>rm</code> calls <code>unlink()</code>, which removes a name and decrements that count. The data only disappears when the count reaches zero, so <code>hard.txt</code> keeps the file alive. A <b>symlink</b> is a tiny file whose content is the <em>text</em> <code>orig.txt</code>; nothing updates it when the target goes away, so it becomes a dangling link. One model explains three things you already met: why a deleted-but-still-open log keeps consuming disk (lesson 1.4), why <code>mv</code> within one filesystem is instant (2.1), and why a hard link cannot cross filesystems — inode numbers are only unique within one.',
            'Đã kiểm: <code>cat hard.txt</code> in ra <code>data</code>, <code>cat soft.txt</code> in ra <code>cat: soft.txt: No such file or directory</code>. <b>Liên kết cứng</b> là một cái tên thứ hai cho cùng một inode; <code>ls -l</code> cho thấy số liên kết là <code>2</code> ở cả hai tên, và <code>rm</code> gọi <code>unlink()</code>, tức gỡ một cái tên và giảm con số ấy đi một. Dữ liệu chỉ biến mất khi con số về không, nên <code>hard.txt</code> giữ cho file còn sống. <b>Liên kết tượng trưng</b> là một file tí hon mà nội dung của nó là <em>dòng chữ</em> <code>orig.txt</code>; chẳng có gì cập nhật nó khi đích biến mất, nên nó thành một liên kết trỏ hụt. Một mô hình giải thích ba thứ bạn đã gặp: vì sao một file log đã xoá mà còn được mở vẫn chiếm đĩa (bài 1.4), vì sao <code>mv</code> trong cùng một hệ thống file là tức thì (2.1), và vì sao liên kết cứng không vượt được sang hệ thống file khác — số inode chỉ duy nhất trong phạm vi một hệ thống file.',
          ),
        }),

        // Q10 · 2.4 + 2.2 — tar * bỏ sót dotfile
        mcq({
          prompt: B(
            'A project directory holds <code>src/</code>, <code>.env</code> and <code>.gitignore</code>. This was run for real; the listing is the actual output.' + code(
              '$ tar -czf backup.tar.gz *\n' +
              '$ tar -tzf backup.tar.gz\n' +
              'src/\n' +
              'src/app.js',
            ) + '<p>Why are <code>.env</code> and <code>.gitignore</code> missing, and what is the fix?</p>',
            'Một thư mục dự án chứa <code>src/</code>, <code>.env</code> và <code>.gitignore</code>. Đoạn này đã chạy thật; phần liệt kê là kết quả thật.' + code(
              '$ tar -czf backup.tar.gz *\n' +
              '$ tar -tzf backup.tar.gz\n' +
              'src/\n' +
              'src/app.js',
            ) + '<p>Vì sao <code>.env</code> và <code>.gitignore</code> biến mất, và sửa thế nào?</p>',
          ),
          options: [
            B('<code>tar</code> deliberately skips names beginning with a dot so that an archive never carries someone\'s private configuration by accident; the flag that turns that off is <code>--all</code>, and adding it fixes the backup', '<code>tar</code> cố ý bỏ qua các tên bắt đầu bằng dấu chấm để một kho nén không vô tình mang theo cấu hình riêng tư của ai đó; cờ tắt hành vi ấy là <code>--all</code>, thêm nó vào là bản sao lưu đầy đủ'),
            B('<code>gzip</code> cannot compress a file smaller than one filesystem block, so tiny dotfiles are dropped from the stream before they are ever written; archive without compression using <code>-cf</code> and they reappear', '<code>gzip</code> không nén nổi một file nhỏ hơn một block của hệ thống file, nên các dotfile tí hon bị loại khỏi dòng dữ liệu trước cả khi được ghi; nén không dùng compression bằng <code>-cf</code> là chúng hiện lại'),
            B('The <code>-z</code> flag must come after <code>-f</code>, because <code>tar</code> processes its flags strictly left to right; written in this order the compression stage started before the file list was complete and silently skipped part of the input', 'Cờ <code>-z</code> phải đứng sau <code>-f</code>, vì <code>tar</code> xử lý các cờ nghiêm ngặt từ trái sang phải; viết theo thứ tự trên thì khâu nén khởi động trước khi danh sách file hoàn tất và âm thầm bỏ sót một phần đầu vào'),
            B('The shell expanded <code>*</code> before <code>tar</code> started, and a glob never matches a leading dot — so <code>tar</code> was simply never told about them. Archive the directory itself: <code>tar -czf backup.tar.gz -C .. project</code>, or use <code>.</code> instead of <code>*</code>', 'Shell đã khai triển <code>*</code> trước khi <code>tar</code> khởi động, mà glob thì không bao giờ khớp một dấu chấm đứng đầu — nên <code>tar</code> đơn giản là chưa từng được cho biết về chúng. Hãy nén chính thư mục đó: <code>tar -czf backup.tar.gz -C .. project</code>, hoặc dùng <code>.</code> thay cho <code>*</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Verified: the archive really does contain only <code>src/</code> and <code>src/app.js</code>. This is lesson 2.2 biting in a new place. <code>tar</code> never saw a star — the shell expanded <code>*</code> into a list of names first, and glob expansion deliberately excludes names beginning with <code>.</code> so that <code>ls</code> and <code>rm *</code> do not sweep up configuration. <code>tar</code> archived exactly what it was handed, correctly, and reported success. Nothing warned, and the failure only appears at restore time, when the application will not start because its <code>.env</code> is gone. The fix is never to hand <code>tar</code> a glob: archive the directory (<code>tar -czf backup.tar.gz -C .. project</code>) or pass <code>.</code>, both of which include dotfiles. The same reasoning applies to <code>cp * dest/</code> and <code>rsync * host:</code>.',
            'Đã kiểm: kho nén đúng là chỉ chứa <code>src/</code> và <code>src/app.js</code>. Đây là bài 2.2 cắn ở một chỗ mới. <code>tar</code> chưa từng thấy dấu sao — shell đã khai triển <code>*</code> thành một danh sách tên trước, và phép khai triển glob cố ý loại các tên bắt đầu bằng <code>.</code> để <code>ls</code> hay <code>rm *</code> không quét trúng phần cấu hình. <code>tar</code> đã nén đúng thứ nó được đưa, làm đúng việc, và báo thành công. Không gì cảnh báo cả, và cái hỏng chỉ lộ ra lúc khôi phục, khi ứng dụng không khởi động nổi vì mất <code>.env</code>. Cách sửa là đừng bao giờ đưa một glob cho <code>tar</code>: hãy nén chính thư mục (<code>tar -czf backup.tar.gz -C .. project</code>) hoặc truyền <code>.</code>, cả hai đều bao gồm file ẩn. Lý lẽ đó cũng đúng với <code>cp * dest/</code> và <code>rsync * host:</code>.',
          ),
        }),

        // ══ Chương 3 — Văn bản & ống dẫn ════════════════════════════════
        // Q11 · 3.1 — thứ tự 2>&1
        mcq({
          prompt: B(
            'A script prints <code>OUT line</code> to stdout and <code>ERR line</code> to stderr. Both commands below were run for real. What ends up inside <code>log.txt</code> in each case?' + code(
              '$ ./gen.sh > log.txt 2>&1     # A\n' +
              '$ ./gen.sh 2>&1 > log.txt     # B',
            ),
            'Một script in <code>OUT line</code> ra stdout và <code>ERR line</code> ra stderr. Cả hai lệnh dưới đây đều đã được chạy thật. Rốt cuộc <code>log.txt</code> chứa gì trong từng trường hợp?' + code(
              '$ ./gen.sh > log.txt 2>&1     # A\n' +
              '$ ./gen.sh 2>&1 > log.txt     # B',
            ),
          ),
          options: [
            B('Both files contain both lines — redirections are collected and applied together, so order is irrelevant', 'Cả hai file đều chứa cả hai dòng — các phép chuyển hướng được gom lại rồi áp dụng cùng lúc, nên thứ tự không quan trọng'),
            B('A contains both lines; B contains only <code>OUT line</code>, and <code>ERR line</code> went to the terminal', 'A chứa cả hai dòng; B chỉ chứa <code>OUT line</code>, còn <code>ERR line</code> đi ra màn hình'),
            B('A contains only <code>OUT line</code>; B contains both, because <code>2>&1</code> must be written first', 'A chỉ chứa <code>OUT line</code>; B chứa cả hai, vì <code>2>&1</code> bắt buộc phải viết trước'),
            B('Both contain only <code>ERR line</code>, because stderr is unbuffered and wins the race', 'Cả hai chỉ chứa <code>ERR line</code>, vì stderr không đệm nên nó thắng cuộc đua'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running both. Redirections are applied strictly <b>left to right</b>, and <code>2>&1</code> means "make fd 2 point wherever fd 1 points <em>right now</em>" — it is a copy of the current destination, not a permanent link. In A, fd 1 is pointed at the file first, then fd 2 is copied onto it, so both land in <code>log.txt</code>. In B, fd 2 is copied onto fd 1 while fd 1 is still the terminal, and only afterwards is fd 1 moved to the file — so stderr keeps going to the screen, which is exactly what the real run showed. Both commands succeed and neither warns; the difference only appears when something fails, usually in CI at the moment you needed the error message. Rule: <code>2>&1</code> goes last — or sidestep it with <code>&></code>, which cannot be written in the wrong order.',
            'Đã chạy thật cả hai. Các phép chuyển hướng được áp dụng nghiêm ngặt <b>từ trái sang phải</b>, và <code>2>&1</code> nghĩa là "cho fd 2 trỏ tới chỗ mà fd 1 <em>đang</em> trỏ" — nó là một bản sao đích hiện tại, không phải một mối nối vĩnh viễn. Ở A, fd 1 được trỏ vào file trước, rồi fd 2 mới chép theo, nên cả hai cùng rơi vào <code>log.txt</code>. Ở B, fd 2 chép theo fd 1 lúc fd 1 vẫn còn là màn hình, và mãi sau đó fd 1 mới chuyển sang file — nên stderr vẫn đi ra màn hình, đúng như lần chạy thật cho thấy. Cả hai lệnh đều thành công và không cái nào cảnh báo; khác biệt chỉ lộ ra khi có thứ gì đó hỏng, thường là trong CI đúng lúc bạn cần thông báo lỗi. Luật: <code>2>&1</code> đặt sau cùng — hoặc né hẳn bằng <code>&></code>, thứ không thể viết sai thứ tự.',
          ),
        }),

        // Q12 · 3.2 — shell con nuốt biến
        mcq({
          prompt: B(
            'A file <code>lines.txt</code> holds three lines. These three ways of counting were run for real; two agree and one does not. Which is the odd one out, and why?' + code(
              'count=0; cat lines.txt | while read -r l; do count=$((count+1)); done; echo "$count"   # A\n' +
              'count=0; while read -r l; do count=$((count+1)); done < lines.txt;      echo "$count"   # B\n' +
              'count=0; while read -r l; do count=$((count+1)); done < <(cat lines.txt); echo "$count" # C',
            ),
            'File <code>lines.txt</code> có ba dòng. Ba cách đếm dưới đây đã được chạy thật; hai cách cho cùng kết quả, một cách thì không. Cách nào lạc lõng, và vì sao?' + code(
              'count=0; cat lines.txt | while read -r l; do count=$((count+1)); done; echo "$count"   # A\n' +
              'count=0; while read -r l; do count=$((count+1)); done < lines.txt;      echo "$count"   # B\n' +
              'count=0; while read -r l; do count=$((count+1)); done < <(cat lines.txt); echo "$count" # C',
            ),
          ),
          options: [
            B('A prints <code>0</code> while B and C print <code>3</code>: every stage of a pipeline runs in its own subshell, so the loop increments a copy of <code>count</code> that dies when the pipeline ends', 'A in ra <code>0</code> còn B và C in ra <code>3</code>: mỗi chặng của một ống dẫn chạy trong shell con của riêng nó, nên vòng lặp tăng một bản sao của <code>count</code>, và bản sao đó chết khi ống dẫn kết thúc'),
            B('C prints <code>0</code> while A and B print <code>3</code>: process substitution runs the loop in a subshell', 'C in ra <code>0</code> còn A và B in ra <code>3</code>: process substitution làm vòng lặp chạy trong shell con'),
            B('B prints <code>0</code> while A and C print <code>3</code>: input redirection closes stdin before the loop starts', 'B in ra <code>0</code> còn A và C in ra <code>3</code>: chuyển hướng đầu vào đóng stdin trước khi vòng lặp bắt đầu'),
            B('All three print <code>3</code>; <code>read</code> always runs in the current shell', 'Cả ba đều in <code>3</code>; <code>read</code> luôn chạy trong shell hiện tại'),
          ],
          correct: 0,
          explanation: EX(
            'Verified: A printed <code>0</code>, B printed <code>3</code>, C printed <code>3</code>. Bash runs each element of a pipeline in a separate process, so in A the whole <code>while</code> loop is a child; it dutifully counts to three and then exits, taking its copy of <code>count</code> with it. The parent never saw a change. Nothing errors, which is what makes this bug survive review — the symptom is a variable that is mysteriously empty after a loop that clearly ran. Two fixes, both shown: redirect the file directly (B), or read from a process substitution (C), which keeps the loop in the current shell while still letting an arbitrary command produce the input. <code>shopt -s lastpipe</code> is a third fix, but it only applies in non-interactive shells with job control off, so it is not the one to reach for.',
            'Đã kiểm: A in <code>0</code>, B in <code>3</code>, C in <code>3</code>. Bash chạy mỗi thành phần của một ống dẫn trong một tiến trình riêng, nên ở A cả vòng <code>while</code> là một tiến trình con; nó đếm đủ tới ba rồi thoát, mang theo bản sao <code>count</code> của nó. Tiến trình cha chưa từng thấy thay đổi nào. Không có lỗi nào, và chính vì thế con bug này sống sót qua các buổi review — triệu chứng là một biến rỗng một cách bí ẩn sau một vòng lặp rõ ràng đã chạy. Hai cách sửa, cả hai đều có ở trên: chuyển hướng thẳng từ file (B), hoặc đọc từ một process substitution (C), thứ giữ vòng lặp lại trong shell hiện tại mà vẫn cho phép một lệnh bất kỳ sinh ra đầu vào. <code>shopt -s lastpipe</code> là cách thứ ba, nhưng nó chỉ có tác dụng trong shell không tương tác và đã tắt job control, nên đó không phải cách nên với tới.',
          ),
        }),

        // Q13 · 3.3 — grep -F
        mcq({
          prompt: B(
            'A file contains these three lines. Two greps were run for real; the output is exact.' + code(
              '1.2.3\n' +
              '1x2y3\n' +
              'v1.2.3-beta',
            ) + code(
              '$ grep \'1.2.3\' vers.txt        $ grep -F \'1.2.3\' vers.txt\n' +
              '1.2.3                          1.2.3\n' +
              '1x2y3                          v1.2.3-beta\n' +
              'v1.2.3-beta',
            ) + '<p>Which explanation is right?</p>',
            'Một file chứa ba dòng sau. Hai lệnh grep đã được chạy thật; kết quả là nguyên văn.' + code(
              '1.2.3\n' +
              '1x2y3\n' +
              'v1.2.3-beta',
            ) + code(
              '$ grep \'1.2.3\' vers.txt        $ grep -F \'1.2.3\' vers.txt\n' +
              '1.2.3                          1.2.3\n' +
              '1x2y3                          v1.2.3-beta\n' +
              'v1.2.3-beta',
            ) + '<p>Lời giải thích nào đúng?</p>',
          ),
          options: [
            B('<code>-F</code> makes the search case-sensitive, and <code>1x2y3</code> only matched because the default is case-insensitive', '<code>-F</code> làm phép tìm phân biệt hoa thường, và <code>1x2y3</code> khớp chỉ vì mặc định là không phân biệt hoa thường'),
            B('<code>-F</code> anchors the pattern to the start of the line, so <code>1x2y3</code> no longer qualifies', '<code>-F</code> neo cái mẫu vào đầu dòng, nên <code>1x2y3</code> không còn đủ điều kiện'),
            B('Plain <code>grep</code> re-sorts its output, which is why the two lists differ in order rather than in content', '<code>grep</code> thường sắp xếp lại kết quả, nên hai danh sách khác nhau về thứ tự chứ không phải về nội dung'),
            B('Without <code>-F</code> the pattern is a regular expression, where <code>.</code> matches any character — so <code>1x2y3</code> matches. <code>-F</code> treats the pattern as literal text, and is also faster', 'Không có <code>-F</code> thì cái mẫu là một biểu thức chính quy, trong đó <code>.</code> khớp mọi ký tự — nên <code>1x2y3</code> khớp. <code>-F</code> coi cái mẫu là chữ nguyên văn, và cũng nhanh hơn'),
          ],
          correct: 3,
          explanation: EX(
            'Verified by running both. In a regular expression <code>.</code> is a wildcard for any single character, so the pattern <code>1.2.3</code> reads as "1, anything, 2, anything, 3" and happily matches <code>1x2y3</code>. That is not a corner case: searching a log for an IP address, a version number or a filename means searching for a string full of dots, and every one of them is a wildcard until you say otherwise. <code>-F</code> (fixed strings) turns the pattern into literal text — <code>1x2y3</code> drops out and <code>v1.2.3-beta</code> stays, because it really does contain the substring. <code>-F</code> is also measurably faster since there is no regex engine involved. The related habits from the lesson: <code>-E</code> when you want <code>+</code>, <code>?</code> and alternation without backslashes, and <code>-P</code> when you want <code>\\d</code> or lookahead.',
            'Đã chạy thật cả hai. Trong biểu thức chính quy, <code>.</code> là ký tự đại diện cho một ký tự bất kỳ, nên mẫu <code>1.2.3</code> được đọc thành "1, gì cũng được, 2, gì cũng được, 3" và khớp ngon lành với <code>1x2y3</code>. Đây không phải một ca hiếm: tìm một địa chỉ IP, một số phiên bản hay một tên file trong log đều là tìm một chuỗi đầy dấu chấm, và mỗi dấu chấm ấy là một ký tự đại diện cho tới khi bạn nói khác đi. <code>-F</code> (fixed strings) biến cái mẫu thành chữ nguyên văn — <code>1x2y3</code> rớt ra còn <code>v1.2.3-beta</code> ở lại, vì nó đúng là có chứa chuỗi con ấy. <code>-F</code> cũng nhanh hơn thấy rõ vì không cần tới bộ máy regex. Những thói quen liên quan trong bài: dùng <code>-E</code> khi cần <code>+</code>, <code>?</code> và phép hoặc mà không phải thoát, dùng <code>-P</code> khi cần <code>\\d</code> hay lookahead.',
          ),
        }),

        // Q14 · 3.4 — sort -n
        mcq({
          prompt: B(
            'The file <code>nums.txt</code> holds <code>9</code>, <code>10</code>, <code>2</code>, <code>100</code>, one per line. These are the real outputs. Which pair is correct?' + code(
              '$ sort nums.txt   | tr \'\\n\' \' \'     ->  ???\n' +
              '$ sort -n nums.txt | tr \'\\n\' \' \'    ->  ???',
            ),
            'File <code>nums.txt</code> chứa <code>9</code>, <code>10</code>, <code>2</code>, <code>100</code>, mỗi số một dòng. Dưới đây là kết quả thật. Cặp nào đúng?' + code(
              '$ sort nums.txt   | tr \'\\n\' \' \'     ->  ???\n' +
              '$ sort -n nums.txt | tr \'\\n\' \' \'    ->  ???',
            ),
          ),
          options: [
            B('<code>2 9 10 100</code> then <code>2 9 10 100</code> — <code>sort</code> detects that the input is numeric', '<code>2 9 10 100</code> rồi <code>2 9 10 100</code> — <code>sort</code> tự nhận ra đầu vào là số'),
            B('<code>100 10 2 9</code> then <code>100 10 9 2</code> — <code>sort</code> defaults to descending order', '<code>100 10 2 9</code> rồi <code>100 10 9 2</code> — <code>sort</code> mặc định sắp giảm dần'),
            B('<code>10 100 2 9</code> then <code>2 9 10 100</code> — without <code>-n</code>, <code>sort</code> compares the lines as text, character by character', '<code>10 100 2 9</code> rồi <code>2 9 10 100</code> — không có <code>-n</code> thì <code>sort</code> so các dòng như chuỗi ký tự, từng ký tự một'),
            B('<code>2 9 10 100</code> then an error, because <code>-n</code> needs a field selector such as <code>-k1,1n</code>', '<code>2 9 10 100</code> rồi một lỗi, vì <code>-n</code> cần một bộ chọn trường như <code>-k1,1n</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Verified: <code>10 100 2 9</code> and then <code>2 9 10 100</code>. Without <code>-n</code>, <code>sort</code> compares strings, so it looks at the first character — <code>1</code> before <code>2</code> before <code>9</code> — and <code>10</code> and <code>100</code> both come before <code>2</code>. Any time you sort sizes, counts, ports, PIDs or IDs, you need <code>-n</code>, and the failure is silent: the output looks sorted, so a <code>| head -5</code> on it gives you five plausible but wrong "largest" values. Two companions worth remembering from the same lesson: <code>-h</code> sorts human-readable sizes (<code>1K</code>, <code>2M</code>, <code>3G</code>) correctly, and <code>-k2,2</code> means "field 2 only" while a bare <code>-k2</code> means "from field 2 to the end of the line", which quietly gives different results.',
            'Đã kiểm: <code>10 100 2 9</code> rồi <code>2 9 10 100</code>. Không có <code>-n</code> thì <code>sort</code> so chuỗi, nên nó nhìn ký tự đầu tiên — <code>1</code> trước <code>2</code> trước <code>9</code> — và cả <code>10</code> lẫn <code>100</code> đều đứng trước <code>2</code>. Bất cứ khi nào bạn sắp kích thước, số đếm, cổng, PID hay ID, bạn đều cần <code>-n</code>, và cái hỏng thì im lặng: kết quả trông vẫn có sắp xếp, nên một cú <code>| head -5</code> lên đó cho bạn năm giá trị "lớn nhất" nghe rất hợp lý mà sai. Hai người bạn đáng nhớ trong cùng bài: <code>-h</code> sắp đúng các kích thước dạng người đọc (<code>1K</code>, <code>2M</code>, <code>3G</code>), và <code>-k2,2</code> nghĩa là "chỉ trường 2" trong khi <code>-k2</code> trơ trọi nghĩa là "từ trường 2 tới hết dòng", thứ lặng lẽ cho kết quả khác.',
          ),
        }),

        // Q15 · 3.5 — sed -i macOS vs Linux
        mcq({
          prompt: B(
            'The same two commands were run on Linux (GNU sed 4.9) and on macOS (BSD sed). These are the real results.' + code(
              'Linux:  sed -i    \'s/hello/bye/\' f.txt   -> exit 0, file edited\n' +
              'Linux:  sed -i \'\' \'s/hello/bye/\' f.txt   -> sed: can\'t read s/hello/bye/: No such file or directory\n' +
              'macOS:  sed -i    \'s/hello/bye/\' f.txt   -> sed: 1: "f.txt": invalid command code f\n' +
              'macOS:  sed -i \'\' \'s/hello/bye/\' f.txt   -> exit 0, file edited',
            ) + '<p>What is going on, and what should a script that must run on both do?</p>',
            'Cùng hai lệnh đó đã được chạy trên Linux (GNU sed 4.9) và trên macOS (BSD sed). Đây là kết quả thật.' + code(
              'Linux:  sed -i    \'s/hello/bye/\' f.txt   -> thoát 0, file được sửa\n' +
              'Linux:  sed -i \'\' \'s/hello/bye/\' f.txt   -> sed: can\'t read s/hello/bye/: No such file or directory\n' +
              'macOS:  sed -i    \'s/hello/bye/\' f.txt   -> sed: 1: "f.txt": invalid command code f\n' +
              'macOS:  sed -i \'\' \'s/hello/bye/\' f.txt   -> thoát 0, file được sửa',
            ) + '<p>Chuyện gì đang xảy ra, và một script phải chạy được trên cả hai thì nên làm gì?</p>',
          ),
          options: [
            B('macOS ships an older release of GNU sed whose <code>-i</code> still demanded a suffix argument, and Linux ships a newer one where that argument became optional; installing the current version with <code>brew install sed</code> makes <code>sed -i \'\'</code> the correct form on both platforms', 'macOS đi kèm một bản GNU sed cũ hơn, ở đó <code>-i</code> vẫn đòi một tham số hậu tố, còn Linux đi kèm bản mới hơn nơi tham số ấy thành tuỳ chọn; cài bản hiện tại bằng <code>brew install sed</code> sẽ khiến <code>sed -i \'\'</code> thành dạng đúng trên cả hai nền'),
            B('BSD <code>sed -i</code> requires a backup-suffix argument, so the empty string is that suffix; GNU <code>sed -i</code> takes the suffix glued on (<code>-i.bak</code>) and reads a separate word as the script. Neither form works on both — for a cross-platform script use <code>perl -pi -e</code>, which behaves identically everywhere', 'Bản BSD của <code>sed -i</code> đòi một tham số hậu tố sao lưu, nên chuỗi rỗng chính là hậu tố đó; còn GNU <code>sed -i</code> nhận hậu tố dán liền (<code>-i.bak</code>) và coi một từ riêng là đoạn script. Không dạng nào chạy được trên cả hai — với script đa nền hãy dùng <code>perl -pi -e</code>, thứ hành xử y hệt nhau ở mọi nơi'),
            B('The difference is the shell, not <code>sed</code>: macOS defaults to <code>zsh</code> while Linux defaults to <code>bash</code>, and <code>zsh</code> removes an empty argument from the command line before the program ever sees it, so the two <code>sed</code> binaries receive different argument counts', 'Khác biệt nằm ở shell chứ không phải <code>sed</code>: macOS mặc định dùng <code>zsh</code> còn Linux mặc định dùng <code>bash</code>, và <code>zsh</code> gỡ một tham số rỗng khỏi dòng lệnh trước khi chương trình kịp nhìn thấy, nên hai bản <code>sed</code> nhận được số tham số khác nhau'),
            B('There is no real difference between the two implementations; the macOS error is caused by the target file not existing yet, because BSD <code>sed -i</code> refuses to create one, and running <code>touch f.txt</code> first makes both forms work identically', 'Không có khác biệt thật nào giữa hai bản cài đặt; lỗi trên macOS là do file đích chưa tồn tại, bởi BSD <code>sed -i</code> từ chối tự tạo file, và chạy <code>touch f.txt</code> trước là cả hai dạng chạy y hệt nhau'),
          ],
          correct: 1,
          explanation: EX(
            'Both platforms were actually run, and the messages above are verbatim. BSD <code>sed</code> defines <code>-i</code> as taking a mandatory suffix argument, so on macOS the empty string is consumed as "no backup" and the next word is the script; write <code>sed -i \'s/…/…/\' f</code> and BSD sed reads <code>s/…/…/</code> as the suffix and <code>f.txt</code> as the script, which is why the error complains about a "command code f". GNU <code>sed</code> takes the suffix attached to the flag (<code>-i.bak</code>) and a bare <code>-i</code> means no backup, so the extra <code>\'\'</code> becomes an empty script and <code>s/hello/bye/</code> becomes a filename it cannot read. Both errors name something that looks like your own typo, which is why this costs people time. The portable answer really is <code>perl -pi -e \'s/a/b/\' file</code>; a second option is to test <code>sed --version</code> once and branch.',
            'Cả hai nền đều đã được chạy thật, và các thông báo ở trên là nguyên văn. BSD <code>sed</code> định nghĩa <code>-i</code> là nhận một tham số hậu tố bắt buộc, nên trên macOS chuỗi rỗng bị ăn mất với nghĩa "không sao lưu" và từ kế tiếp mới là đoạn script; viết <code>sed -i \'s/…/…/\' f</code> thì BSD sed đọc <code>s/…/…/</code> thành hậu tố và <code>f.txt</code> thành script, và đó là lý do lỗi than phiền về một "command code f". GNU <code>sed</code> nhận hậu tố dán liền vào cờ (<code>-i.bak</code>) còn <code>-i</code> trơ trọi nghĩa là không sao lưu, nên chữ <code>\'\'</code> thừa ra thành một script rỗng và <code>s/hello/bye/</code> thành một tên file nó không đọc nổi. Cả hai lỗi đều gọi tên một thứ trông như lỗi gõ của chính bạn, và vì thế nó ngốn thời gian của nhiều người. Câu trả lời chạy được mọi nơi đúng là <code>perl -pi -e \'s/a/b/\' file</code>; cách thứ hai là kiểm <code>sed --version</code> một lần rồi rẽ nhánh.',
          ),
        }),

        // Q16 · 3.6 — awk !seen[$0]++
        mcq({
          prompt: B(
            'The input file holds, in order: <code>b</code>, <code>a</code>, <code>b</code>, <code>c</code>, <code>a</code>. What does <code>awk \'!seen[$0]++\' file</code> print, and how does it work?',
            'File đầu vào chứa, theo thứ tự: <code>b</code>, <code>a</code>, <code>b</code>, <code>c</code>, <code>a</code>. Lệnh <code>awk \'!seen[$0]++\' file</code> in ra gì, và nó hoạt động thế nào?',
          ),
          options: [
            B('<code>b a c</code> — <code>seen[$0]++</code> returns the count <em>before</em> incrementing, so it is <code>0</code> (false) the first time a line appears; <code>!</code> makes that true, which triggers awk\'s implicit print. It is <code>sort -u</code> without the sorting, in one pass, keeping input order', '<code>b a c</code> — <code>seen[$0]++</code> trả về số đếm <em>trước khi</em> tăng, nên lần đầu một dòng xuất hiện thì nó là <code>0</code> (sai); dấu <code>!</code> biến cái đó thành đúng, và điều đó kích hoạt hành động in ngầm định của awk. Nó là <code>sort -u</code> mà không phải sắp xếp, chỉ một lượt đọc, giữ nguyên thứ tự đầu vào'),
            B('<code>a b c</code> — awk keeps the keys of an associative array in sorted order internally, so anything driven by such an array comes out alphabetically no matter what order the input arrived in', '<code>a b c</code> — awk giữ các khoá của một mảng liên kết theo thứ tự đã sắp ở bên trong, nên mọi thứ chạy theo một mảng như vậy đều ra theo thứ tự chữ cái bất kể đầu vào tới theo trình tự nào'),
            B('<code>b b a a c</code> — the <code>!</code> inverts the test, so the rule fires on every line whose counter is already non-zero and it prints exactly the duplicates, in the order they were encountered', '<code>b b a a c</code> — dấu <code>!</code> đảo phép kiểm, nên luật kích hoạt trên mọi dòng có bộ đếm đã khác 0 và nó in ra đúng những dòng trùng lặp, theo thứ tự gặp phải'),
            B('Nothing — the program has a pattern but no action block in braces, and awk requires an explicit <code>{ print }</code> before it will emit anything, so this reads the whole file and produces no output', 'Không gì cả — chương trình có mẫu mà không có khối hành động trong ngoặc nhọn, và awk đòi phải có <code>{ print }</code> tường minh thì mới xuất ra gì, nên nó đọc hết file rồi không sinh ra output nào'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it: <code>b a c</code>. Three ideas are packed into eleven characters. <code>seen</code> is an associative array indexed by <code>$0</code>, the whole line. The <b>post</b>-increment returns the old value, so the first time a line arrives the expression is <code>0</code>, which awk treats as false; <code>!</code> flips it to true. An awk rule with a pattern and no action block has the implicit action <code>{ print }</code>, so a true pattern prints the line — that is also why <code>awk \'NF\'</code> drops blank lines. Option 4 is the common misreading and is wrong for exactly that reason. Why this beats <code>sort -u</code>: it makes one pass, keeps the original order, and never spills to disk. Measured in the lesson on a 2.1 GB access log, the <code>sort | uniq -c</code> pipeline took 41 s and the awk equivalent 9 s.',
            'Đã chạy thật: <code>b a c</code>. Ba ý tưởng dồn trong mười một ký tự. <code>seen</code> là một mảng liên kết đánh chỉ số bằng <code>$0</code>, tức cả dòng. Phép tăng <b>hậu tố</b> trả về giá trị cũ, nên lần đầu một dòng đi tới thì biểu thức là <code>0</code>, thứ awk coi là sai; dấu <code>!</code> lật nó thành đúng. Một luật awk có mẫu mà không có khối hành động thì mang hành động ngầm định <code>{ print }</code>, nên một mẫu đúng sẽ in dòng ra — đó cũng là lý do <code>awk \'NF\'</code> loại được các dòng trống. Phương án 4 là cách đọc nhầm phổ biến và sai chính vì lẽ đó. Vì sao nó hơn <code>sort -u</code>: nó đọc một lượt, giữ nguyên thứ tự gốc, và không bao giờ phải đổ tạm ra đĩa. Bài học đo trên một access log 2,1 GB: ống dẫn <code>sort | uniq -c</code> mất 41 giây, bản awk tương đương mất 9 giây.',
          ),
        }),

        // ══ Chương 4 — Quyền & người dùng ═══════════════════════════════
        // Q17 · 4.1 — lớp quyền không cộng dồn
        mcq({
          prompt: B(
            'This was run for real on Linux. <code>alice</code> owns the file; <code>bob</code> does not and is not in the group.' + code(
              '$ ls -l f.txt\n' +
              '-r--rwxrwx 1 alice alice 7 f.txt\n' +
              '\n' +
              '$ su alice -c \'echo more >> f.txt\'    -> ???\n' +
              '$ su bob   -c \'echo more >> f.txt\'    -> ???',
            ) + '<p>What happened?</p>',
            'Đoạn này đã chạy thật trên Linux. <code>alice</code> sở hữu file; <code>bob</code> thì không, và cũng không thuộc nhóm.' + code(
              '$ ls -l f.txt\n' +
              '-r--rwxrwx 1 alice alice 7 f.txt\n' +
              '\n' +
              '$ su alice -c \'echo more >> f.txt\'    -> ???\n' +
              '$ su bob   -c \'echo more >> f.txt\'    -> ???',
            ) + '<p>Chuyện gì đã xảy ra?</p>',
          ),
          options: [
            B('Both succeed — permissions are cumulative, and the <code>rwx</code> in the "other" class applies to everyone including the owner', 'Cả hai đều thành công — quyền cộng dồn, và chữ <code>rwx</code> ở lớp "other" áp dụng cho mọi người, kể cả chủ sở hữu'),
            B('Both fail — the first class listed wins, and it says read-only for everybody', 'Cả hai đều hỏng — lớp đứng trước quyết định, và nó nói chỉ-đọc với tất cả'),
            B('<code>alice</code> gets "Permission denied"; <code>bob</code> writes successfully — the kernel picks exactly one class (owner, else group, else other) and only that class decides', '<code>alice</code> nhận "Permission denied"; <code>bob</code> ghi được — kernel chọn đúng MỘT lớp (chủ sở hữu, không thì nhóm, không thì other) và chỉ lớp đó quyết định'),
            B('<code>alice</code> writes successfully because she is the owner; <code>bob</code> gets "Permission denied"', '<code>alice</code> ghi được vì cô ấy là chủ sở hữu; <code>bob</code> nhận "Permission denied"'),
          ],
          correct: 2,
          explanation: EX(
            'Verified by running it: alice got <code>cannot create f.txt: Permission denied</code> and bob\'s write succeeded. The kernel walks the classes in a fixed order and stops at the first one that applies to you: if you are the owner, the <b>user</b> bits decide and nothing else is consulted; otherwise if you are in the group, the <b>group</b> bits decide; otherwise <b>other</b>. Permissions are not cumulative, and the most permissive class does not win — which is why <code>r--rwxrwx</code> locks out precisely the one person who could fix it. That ordering is also why "add the user to the group" sometimes changes nothing: if they already own the file, the group bits are never even looked at. Option 4 is the intuition most people have and it is exactly backwards here.',
            'Đã chạy thật: alice nhận <code>cannot create f.txt: Permission denied</code> còn bob ghi được. Kernel duyệt các lớp theo một thứ tự cố định và dừng ở lớp đầu tiên áp dụng cho bạn: nếu bạn là chủ sở hữu thì bộ bit <b>user</b> quyết định và không xét gì thêm; nếu không, và bạn thuộc nhóm, thì bộ bit <b>group</b> quyết định; còn lại là <b>other</b>. Quyền không cộng dồn, và lớp rộng rãi nhất không phải lớp thắng — vì thế <code>r--rwxrwx</code> khoá cửa đúng với người duy nhất có thể sửa nó. Thứ tự ấy cũng là lý do "thêm người dùng vào nhóm" đôi khi chẳng đổi gì: nếu họ vốn đã sở hữu file thì bộ bit nhóm còn không được ngó tới. Phương án 4 là trực giác của phần lớn mọi người, và ở đây nó đúng ngược lại.',
          ),
        }),

        // Q18 · 4.1 — xoá file chỉ-đọc
        mcq({
          prompt: B(
            'Also run for real: <code>alice</code> owns a directory <code>d</code> with mode <code>755</code>, and inside it a file <code>ro.txt</code> with mode <code>444</code> (read-only for everyone). She runs <code>rm d/ro.txt</code>. What happens, and why?',
            'Cũng đã chạy thật: <code>alice</code> sở hữu thư mục <code>d</code> với mode <code>755</code>, bên trong có file <code>ro.txt</code> mode <code>444</code> (chỉ đọc với mọi người). Cô ấy chạy <code>rm d/ro.txt</code>. Chuyện gì xảy ra, và vì sao?',
          ),
          options: [
            B('It fails: <code>rm</code> refuses to remove a file with no write bit, and only <code>rm -f</code> as root can override that', 'Nó hỏng: <code>rm</code> từ chối gỡ một file không có bit ghi, và chỉ <code>rm -f</code> chạy bằng root mới vượt qua được'),
            B('It fails with "Operation not permitted" — mode 444 sets the immutable flag on the file', 'Nó hỏng với "Operation not permitted" — mode 444 bật cờ bất biến trên file'),
            B('It succeeds, but only because she owns the file; a different user with the same directory permissions could not', 'Nó thành công, nhưng chỉ vì cô ấy sở hữu file; một người dùng khác với đúng quyền thư mục ấy thì không làm được'),
            B('It succeeds silently: deleting is a modification of the <b>directory</b>, not of the file, so the directory\'s write and execute bits are what the kernel checks', 'Nó thành công lặng lẽ: xoá là một phép sửa <b>thư mục</b>, không phải sửa file, nên kernel kiểm bit ghi và bit chạy của thư mục'),
          ],
          correct: 3,
          explanation: EX(
            'Verified: the <code>rm</code> succeeded and the file is gone. A directory is a list of names pointing at inodes, and removing a name edits <em>that list</em> — so the permission that matters is <code>w</code> plus <code>x</code> on the directory, not anything on the file. The file\'s own mode says who may read or write its <em>contents</em>, which is a different question. Interactively <code>rm</code> does prompt before removing a write-protected file, which is where option 1 comes from, but that is a courtesy from <code>rm</code>, not a kernel rule; it disappears with <code>-f</code>, and it never appears in a script where stdin is not a terminal. The real consequence: "make the config read-only so nothing can overwrite it" is not a safety measure — anyone with write access to the directory can delete it and create a new file with the same name. To actually protect a file, restrict the <em>directory</em>, or use <code>chattr +i</code>.',
            'Đã kiểm: lệnh <code>rm</code> thành công và file biến mất. Một thư mục là một danh sách tên trỏ tới các inode, và gỡ một cái tên là sửa <em>chính danh sách đó</em> — nên quyền có ý nghĩa ở đây là <code>w</code> cộng <code>x</code> trên thư mục, chứ không phải thứ gì trên file. Mode của bản thân file nói ai được đọc hay ghi <em>nội dung</em> của nó, một câu hỏi khác. Khi gõ tay thì <code>rm</code> có hỏi lại trước khi gỡ một file bị chặn ghi, và phương án 1 ra đời từ đó, nhưng đó là phép lịch sự của <code>rm</code> chứ không phải luật của kernel; nó biến mất với <code>-f</code>, và nó chưa từng xuất hiện trong một script nơi stdin không phải terminal. Hệ quả thật: "đặt file cấu hình thành chỉ-đọc cho không ai ghi đè được" không phải một biện pháp an toàn — ai ghi được vào thư mục đều xoá nó rồi tạo một file mới cùng tên. Muốn bảo vệ file thật thì phải siết <em>thư mục</em>, hoặc dùng <code>chattr +i</code>.',
          ),
        }),

        // Q19 · 4.1 — x mà không có r trên thư mục
        mcq({
          prompt: B(
            'A directory has mode <code>711</code> (<code>drwx--x--x</code>) and contains <code>known.txt</code>, readable by all. Run as an unprivileged user, this is the real result:' + code(
              '$ ls dx\n' +
              'ls: cannot open directory \'dx\': Permission denied\n' +
              '$ cat dx/known.txt\n' +
              'hi',
            ) + '<p>What do <code>r</code> and <code>x</code> mean on a directory?</p>',
            'Một thư mục có mode <code>711</code> (<code>drwx--x--x</code>) và chứa <code>known.txt</code>, ai cũng đọc được. Chạy bằng một người dùng thường, đây là kết quả thật:' + code(
              '$ ls dx\n' +
              'ls: cannot open directory \'dx\': Permission denied\n' +
              '$ cat dx/known.txt\n' +
              'hi',
            ) + '<p><code>r</code> và <code>x</code> trên một thư mục nghĩa là gì?</p>',
          ),
          options: [
            B('<code>r</code> means "read the files inside" and <code>x</code> means "execute the files inside"; here the files happen to be readable through a different path', '<code>r</code> nghĩa là "đọc các file bên trong" và <code>x</code> nghĩa là "chạy các file bên trong"; ở đây các file tình cờ đọc được qua một đường khác'),
            B('<code>r</code> is permission to LIST the names in the directory; <code>x</code> is permission to TRAVERSE it — to reach something inside whose name you already know. With <code>x</code> but no <code>r</code>, you can open <code>dx/known.txt</code> but cannot discover what else is there', '<code>r</code> là quyền LIỆT KÊ các tên trong thư mục; <code>x</code> là quyền ĐI XUYÊN qua nó — để với tới một thứ bên trong mà bạn đã biết tên. Có <code>x</code> mà không có <code>r</code> thì bạn mở được <code>dx/known.txt</code> nhưng không thể biết trong đó còn gì'),
            B('<code>x</code> on a directory is meaningless and is ignored by the kernel; the <code>ls</code> failure comes from the missing <code>r</code> alone', '<code>x</code> trên thư mục là vô nghĩa và bị kernel bỏ qua; lỗi của <code>ls</code> chỉ đến từ việc thiếu <code>r</code>'),
            B('<code>r</code> and <code>x</code> are equivalent on a directory; mode <code>711</code> is simply an unusual way to write <code>755</code>', '<code>r</code> và <code>x</code> tương đương nhau trên thư mục; mode <code>711</code> chỉ là một cách viết lạ của <code>755</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running both commands as a non-owner. <code>r</code> lets you enumerate the names; <code>x</code> lets you use a name to reach the inode behind it. They are genuinely independent, and <code>--x</code> is a real technique rather than a curiosity: it is how <code>/home</code> is often configured, so you can reach <code>/home/you</code> without being able to list who else has an account, and how upload directories are served — files fetchable by exact URL, directory not browsable. The other half of the rule is that <b>every component of a path is checked</b>: to open <code>/srv/app/config.yml</code> you need <code>x</code> on <code>/</code>, <code>/srv</code> and <code>/srv/app</code>, and a missing <code>x</code> on any one of them produces "Permission denied" on a file whose own mode looks perfectly fine. That is why lesson 4.5 says to read the whole path with <code>namei -l</code> before touching anything.',
            'Đã chạy thật cả hai lệnh bằng một người không sở hữu. <code>r</code> cho phép bạn liệt kê các tên; <code>x</code> cho phép bạn dùng một cái tên để với tới inode đằng sau nó. Chúng thật sự độc lập, và <code>--x</code> là một kỹ thuật có thật chứ không phải chuyện lạ: <code>/home</code> thường được cấu hình như vậy, để bạn vào được <code>/home/ban</code> mà không liệt kê nổi ai khác có tài khoản, và các thư mục tải lên cũng được phục vụ như thế — file lấy được bằng URL chính xác, thư mục thì không duyệt được. Nửa còn lại của luật là <b>mọi thành phần của đường dẫn đều bị kiểm</b>: để mở <code>/srv/app/config.yml</code> bạn cần <code>x</code> trên <code>/</code>, <code>/srv</code> và <code>/srv/app</code>, và thiếu <code>x</code> ở bất kỳ chỗ nào cũng cho ra "Permission denied" trên một file mà mode của chính nó trông hoàn toàn ổn. Đó là lý do bài 4.5 bảo hãy đọc cả đường dẫn bằng <code>namei -l</code> trước khi đụng vào bất cứ thứ gì.',
          ),
        }),

        // Q20 · 4.2 — umask
        mcq({
          prompt: B(
            'Real run, as a normal user in an empty directory:' + code(
              '$ umask 027\n' +
              '$ touch c\n' +
              '$ mkdir e\n' +
              '$ ls -l c   ;  ls -ld e',
            ) + '<p>What modes do <code>c</code> and <code>e</code> get?</p>',
            'Chạy thật, bằng một người dùng thường trong một thư mục rỗng:' + code(
              '$ umask 027\n' +
              '$ touch c\n' +
              '$ mkdir e\n' +
              '$ ls -l c   ;  ls -ld e',
            ) + '<p><code>c</code> và <code>e</code> nhận mode nào?</p>',
          ),
          options: [
            B('<code>-rw-r-----</code> (640) for the file and <code>drwxr-x---</code> (750) for the directory — the umask bits are subtracted from the base 666 for files and 777 for directories', '<code>-rw-r-----</code> (640) cho file và <code>drwxr-x---</code> (750) cho thư mục — các bit trong umask bị trừ khỏi nền 666 với file và 777 với thư mục'),
            B('<code>-r-x-w--wx</code> (027) for both — <code>umask</code> sets the mode directly', '<code>-r-x-w--wx</code> (027) cho cả hai — <code>umask</code> đặt thẳng mode'),
            B('<code>-rw-r-----</code> (640) for both, because <code>mkdir</code> and <code>touch</code> use the same base mode', '<code>-rw-r-----</code> (640) cho cả hai, vì <code>mkdir</code> và <code>touch</code> dùng chung một mode nền'),
            B('<code>-rwxr-x---</code> (750) for both — the execute bit is always granted to the owner of a new file', '<code>-rwxr-x---</code> (750) cho cả hai — bit chạy luôn được cấp cho chủ của một file mới'),
          ],
          correct: 0,
          explanation: EX(
            'Verified: <code>-rw-r----- c</code> and <code>drwxr-x--- e</code>. A <code>umask</code> is a mask of bits to <b>remove</b>, not a mode to set, and the base differs by object type: <code>666</code> for a regular file and <code>777</code> for a directory. <code>666 &amp; ~027 = 640</code>; <code>777 &amp; ~027 = 750</code>. Files never get the execute bit from the base, which is why a new script always needs <code>chmod +x</code> — that is deliberate, so that a downloaded data file is not accidentally runnable. Two operational notes from the lesson: the umask is a property of the <em>process</em> and is inherited by children, so setting it in one terminal affects only that terminal (make it permanent in <code>~/.bashrc</code>, or per-service with <code>UMask=0027</code> in a systemd unit); and a service that inherits the wrong umask silently creates world-readable files, with nothing to warn you.',
            'Đã kiểm: <code>-rw-r----- c</code> và <code>drwxr-x--- e</code>. <code>umask</code> là một mặt nạ các bit cần <b>gỡ đi</b>, không phải một mode để đặt vào, và mode nền thì khác nhau theo loại đối tượng: <code>666</code> cho file thường và <code>777</code> cho thư mục. <code>666 &amp; ~027 = 640</code>; <code>777 &amp; ~027 = 750</code>. File không bao giờ nhận bit chạy từ mode nền, và đó là lý do một script mới luôn cần <code>chmod +x</code> — cố ý như vậy, để một file dữ liệu vừa tải về không vô tình chạy được. Hai ghi chú vận hành từ bài học: umask là thuộc tính của <em>tiến trình</em> và được con thừa kế, nên đặt nó ở một terminal thì chỉ terminal đó chịu ảnh hưởng (muốn vĩnh viễn thì đặt trong <code>~/.bashrc</code>, muốn theo từng dịch vụ thì dùng <code>UMask=0027</code> trong unit của systemd); và một dịch vụ thừa kế nhầm umask sẽ âm thầm tạo ra các file cả thế giới đọc được, không có gì báo cho bạn.',
          ),
        }),

        // Q21 · 4.4 — usermod -aG
        mcq({
          prompt: B(
            'Real run. <code>alice</code> was in <code>sudo</code> and <code>devs</code>. Then one command was issued:' + code(
              '$ id alice\n' +
              'uid=1000(alice) gid=1000(alice) groups=1000(alice),27(sudo),1002(devs)\n' +
              '\n' +
              '$ sudo usermod -G devs alice\n' +
              '$ id alice\n' +
              'uid=1000(alice) gid=1000(alice) groups=1000(alice),1002(devs)',
            ) + '<p>What happened, and what should have been typed?</p>',
            'Chạy thật. <code>alice</code> đang ở trong <code>sudo</code> và <code>devs</code>. Rồi một lệnh được gõ:' + code(
              '$ id alice\n' +
              'uid=1000(alice) gid=1000(alice) groups=1000(alice),27(sudo),1002(devs)\n' +
              '\n' +
              '$ sudo usermod -G devs alice\n' +
              '$ id alice\n' +
              'uid=1000(alice) gid=1000(alice) groups=1000(alice),1002(devs)',
            ) + '<p>Chuyện gì đã xảy ra, và lẽ ra phải gõ gì?</p>',
          ),
          options: [
            B('Nothing was lost — <code>id</code> simply stopped printing <code>sudo</code> because that group has no members file entry; re-running <code>id</code> after a re-login shows it again', 'Không mất gì cả — <code>id</code> chỉ thôi in <code>sudo</code> vì nhóm đó không có mục thành viên trong file; chạy lại <code>id</code> sau khi đăng nhập lại là thấy nó trở lại'),
            B('<code>usermod</code> reordered the list; <code>sudo</code> is still there but is now the primary group and is therefore shown as <code>gid=</code>', '<code>usermod</code> sắp xếp lại danh sách; <code>sudo</code> vẫn còn nhưng giờ là nhóm chính nên được hiện ở phần <code>gid=</code>'),
            B('The <code>-G</code> flag only works with a comma-separated list, so the single group name was rejected and the previous list was cleared as a side effect', 'Cờ <code>-G</code> chỉ chạy với một danh sách ngăn bằng dấu phẩy, nên tên nhóm đơn lẻ bị từ chối và danh sách cũ bị xoá như một tác dụng phụ'),
            B('<code>-G</code> <b>replaces</b> the entire secondary group list, so alice was silently removed from <code>sudo</code>. The flag needed is <code>-aG</code>, which appends', '<code>-G</code> <b>thay thế</b> toàn bộ danh sách nhóm phụ, nên alice bị lặng lẽ gỡ khỏi <code>sudo</code>. Cờ cần dùng là <code>-aG</code>, tức thêm vào'),
          ],
          correct: 3,
          explanation: EX(
            'Verified: the <code>sudo</code> entry really is gone from the second <code>id</code>. <code>usermod -G</code> sets the secondary group list to exactly what you passed — anything not on that line is removed, with no confirmation and no warning. On a real server this is how administrators lock themselves out of their own machine: one <code>usermod -G docker deploy</code> and the account loses <code>sudo</code>, and the only way back is console access or a second sudo-capable account. Always <code>-aG</code>, and always check afterwards with <code>id</code>. A second, unrelated trap from the same lesson: after adding yourself to a group, the running shell keeps the credentials it was started with, so <code>id</code> (which reads the <em>process</em>) and <code>id yourname</code> (which reads <code>/etc/group</code>) disagree until you log in again — that is the whole answer to "I added myself to the docker group and it still says permission denied".',
            'Đã kiểm: mục <code>sudo</code> đúng là biến mất ở lần <code>id</code> thứ hai. <code>usermod -G</code> đặt danh sách nhóm phụ thành đúng thứ bạn truyền vào — mọi thứ không có trên dòng đó đều bị gỡ, không hỏi lại, không cảnh báo. Trên máy chủ thật, đây là cách các quản trị viên tự khoá mình khỏi chính máy mình: một lệnh <code>usermod -G docker deploy</code> là tài khoản mất <code>sudo</code>, và đường về duy nhất là console hoặc một tài khoản sudo thứ hai. Luôn dùng <code>-aG</code>, và luôn kiểm lại bằng <code>id</code>. Một cái bẫy thứ hai, không liên quan, trong cùng bài: sau khi tự thêm mình vào một nhóm, shell đang chạy vẫn giữ bộ chứng danh nó khởi động cùng, nên <code>id</code> (đọc <em>tiến trình</em>) và <code>id tencuaban</code> (đọc <code>/etc/group</code>) nói khác nhau cho tới khi bạn đăng nhập lại — đó là toàn bộ câu trả lời cho "tôi thêm mình vào nhóm docker rồi mà nó vẫn báo permission denied".',
          ),
        }),

        // ══ Chương 5 — Tiến trình & tín hiệu ════════════════════════════
        // Q22 · 5.3 — mã thoát 128+N
        mcq({
          prompt: B(
            'These exit codes were captured for real on Linux. What is the rule that explains the first three?' + code(
              '$ bash -c \'kill -9    $$\'; echo $?   ->  137\n' +
              '$ bash -c \'kill -TERM $$\'; echo $?   ->  143\n' +
              '$ bash -c \'kill -INT  $$\'; echo $?   ->  130\n' +
              '$ nosuchcommand         ; echo $?    ->  127\n' +
              '$ ./not-executable.sh   ; echo $?    ->  126',
            ),
            'Những mã thoát sau đã được lấy thật trên Linux. Luật nào giải thích ba số đầu?' + code(
              '$ bash -c \'kill -9    $$\'; echo $?   ->  137\n' +
              '$ bash -c \'kill -TERM $$\'; echo $?   ->  143\n' +
              '$ bash -c \'kill -INT  $$\'; echo $?   ->  130\n' +
              '$ nosuchcommand         ; echo $?    ->  127\n' +
              '$ ./not-executable.sh   ; echo $?    ->  126',
            ),
          ),
          options: [
            B('They are arbitrary values chosen by whichever program happened to exit, and bash simply passes them through; beyond the convention that zero means success and anything else means failure, the numbers carry no shared meaning across tools', 'Chúng là những giá trị tuỳ tiện do chương trình nào vừa thoát chọn ra, và bash chỉ chuyển tiếp lại; ngoài quy ước 0 là thành công còn khác 0 là thất bại, các con số không mang một ý nghĩa chung nào giữa các công cụ'),
            B('A process killed by signal N exits with <code>128 + N</code>: SIGKILL is 9 so 137, SIGTERM is 15 so 143, SIGINT is 2 so 130. Separately, 127 means "command not found" and 126 means "found but not executable"', 'Một tiến trình bị giết bởi tín hiệu N thoát với mã <code>128 + N</code>: SIGKILL là 9 nên ra 137, SIGTERM là 15 nên ra 143, SIGINT là 2 nên ra 130. Riêng ra, 127 nghĩa là "không tìm thấy lệnh" và 126 nghĩa là "tìm thấy nhưng không chạy được"'),
            B('They are the signal numbers multiplied by fifteen, which is why they cluster in the 130s and 140s; dividing an unexplained exit code by 15 recovers the signal that caused it', 'Chúng là số hiệu tín hiệu nhân với mười lăm, và vì thế chúng túm tụm ở khoảng 130 và 140; chia một mã thoát khó hiểu cho 15 là ra được tín hiệu đã gây nên nó'),
            B('They are HTTP-style status codes reused by the shell: anything at or above 128 means the kernel refused the operation, and the remainder identifies which permission check failed', 'Chúng là các mã trạng thái kiểu HTTP được shell dùng lại: bất cứ số nào từ 128 trở lên nghĩa là kernel từ chối thao tác, còn phần dư cho biết phép kiểm quyền nào đã trượt'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running each one. <code>128 + N</code> is the decoder ring for a whole class of confusing failures. <code>137</code> is <code>128 + 9</code> — SIGKILL, which on a server usually means the OOM killer or a <code>docker stop</code> that timed out and escalated. <code>143</code> is <code>128 + 15</code> — a normal <code>systemctl stop</code> or <code>docker stop</code>. <code>130</code> is Ctrl-C. <code>139</code> is <code>128 + 11</code>, a segfault. When CI reports "exited with code 137", it is not a mysterious application error: something ran out of memory or was force-killed, and <code>dmesg -T | grep -i \'killed process\'</code> takes five seconds to confirm it. This project\'s own history has the case: a parallel Docker build on a 6 GB VPS was OOM-killed and surfaced only as <code>Exited(137)</code>. The other two numbers are worth the same reflex — <code>127</code> sends you to <code>PATH</code> (chapter 8), <code>126</code> to the executable bit or a bad interpreter line.',
            'Đã chạy thật từng cái. <code>128 + N</code> là chiếc chìa khoá giải mã cho cả một lớp lỗi khó hiểu. <code>137</code> là <code>128 + 9</code> — SIGKILL, mà trên máy chủ thường nghĩa là kẻ giết OOM hoặc một lệnh <code>docker stop</code> hết giờ chờ rồi leo thang. <code>143</code> là <code>128 + 15</code> — một lần <code>systemctl stop</code> hay <code>docker stop</code> bình thường. <code>130</code> là Ctrl-C. <code>139</code> là <code>128 + 11</code>, lỗi segfault. Khi CI báo "exited with code 137", đó không phải một lỗi ứng dụng bí ẩn: có thứ gì đó hết bộ nhớ hoặc bị giết cưỡng bức, và <code>dmesg -T | grep -i \'killed process\'</code> mất năm giây để xác nhận. Lịch sử của chính dự án này có ca đó: một lượt build Docker song song trên VPS 6 GB bị OOM giết và chỉ lộ ra dưới dạng <code>Exited(137)</code>. Hai con số còn lại đáng có cùng một phản xạ — <code>127</code> đẩy bạn đi kiểm <code>PATH</code> (chương 8), <code>126</code> đẩy bạn đi kiểm bit chạy hoặc một dòng shebang hỏng.',
          ),
        }),

        // Q23 · 5.1 — trạng thái D
        mcq({
          prompt: B(
            'Load average is 8 on a 4-core box, <code>top</code> shows the CPU almost entirely idle, and several processes sit in state <code>D</code> in <code>ps aux</code>. <code>kill -9</code> on them does nothing at all. What is going on?',
            'Tải trung bình là 8 trên một máy 4 nhân, <code>top</code> cho thấy CPU gần như rảnh hoàn toàn, và vài tiến trình nằm ở trạng thái <code>D</code> trong <code>ps aux</code>. <code>kill -9</code> lên chúng chẳng có tác dụng gì. Chuyện gì đang xảy ra?',
          ),
          options: [
            B('They are zombies: each has finished but its parent has not called <code>wait()</code> to collect the exit status, so the entries linger in the process table, inflate the load average, and ignore signals because there is no longer a running process to receive one', 'Chúng là tiến trình xác sống: mỗi cái đã kết thúc nhưng tiến trình cha chưa gọi <code>wait()</code> để thu mã thoát, nên các mục ấy lởn vởn trong bảng tiến trình, làm phồng tải trung bình, và lờ tín hiệu đi vì không còn tiến trình nào đang chạy để nhận'),
            B('They are running at a very low <code>nice</code> priority, so the scheduler starves them in favour of everything else; the signal is queued and will be delivered as soon as they next get a slice of CPU, which on a loaded machine can be a long wait', 'Chúng đang chạy với độ ưu tiên <code>nice</code> rất thấp, nên bộ xếp lịch bỏ đói chúng để nhường cho mọi thứ khác; tín hiệu bị xếp hàng và sẽ được chuyển tới ngay khi chúng có lát CPU kế tiếp, mà trên một máy đang tải nặng thì đó là một khoảng chờ dài'),
            B('<code>D</code> is uninterruptible sleep: the process is blocked inside a system call waiting on hardware — usually a failing disk or a hung network filesystem — and the kernel will not deliver any signal, not even SIGKILL. Linux counts these in the load average, which is why load is high while CPU is idle', '<code>D</code> là trạng thái ngủ không ngắt được: tiến trình đang kẹt bên trong một lời gọi hệ thống chờ phần cứng — thường là một cái đĩa sắp hỏng hoặc một hệ thống file mạng treo — và kernel sẽ không chuyển tín hiệu nào tới, kể cả SIGKILL. Linux tính chúng vào tải trung bình, và đó là lý do tải cao trong khi CPU rảnh'),
            B('They have already exited; <code>ps</code> reads a snapshot that <code>/proc</code> refreshes only every few seconds, so the entries are stale and will disappear on their own, and the load average is lagging behind for the same reason', 'Chúng đã thoát rồi; <code>ps</code> đọc một bản chụp mà <code>/proc</code> chỉ làm mới sau vài giây, nên các mục ấy là cũ và sẽ tự biến mất, còn tải trung bình thì trễ nhịp cũng vì lẽ đó'),
          ],
          correct: 2,
          explanation: EX(
            'This combination — high load, idle CPU, processes in <code>D</code> — is the signature of failing storage or a dead NFS mount, not of a busy machine. Linux\'s load average counts runnable <em>plus</em> uninterruptible tasks, which is why it goes up when nothing is computing; that alone is why "load is 8" says nothing until you have also looked at <code>%wa</code> in <code>top</code> and divided by <code>nproc</code>. A <code>D</code> process cannot be killed because signals are delivered when a process returns from the kernel, and this one is not returning — so typing <code>kill -9</code> twenty times achieves nothing and only the underlying I/O finishing (or the machine rebooting) clears it. Zombies (option 1) are state <code>Z</code>, consume no resources beyond a process-table slot, and are a different problem entirely.',
            'Bộ ba này — tải cao, CPU rảnh, tiến trình ở <code>D</code> — là dấu hiệu đặc trưng của bộ nhớ lưu trữ sắp hỏng hoặc một mount NFS chết, chứ không phải của một máy đang bận. Tải trung bình của Linux đếm cả tiến trình sẵn sàng chạy <em>lẫn</em> tiến trình không ngắt được, và vì thế nó tăng lên khi chẳng có gì đang tính toán; riêng điều đó đã đủ để nói "tải là 8" chưa mang nghĩa gì cho tới khi bạn nhìn thêm cột <code>%wa</code> trong <code>top</code> và chia cho <code>nproc</code>. Một tiến trình <code>D</code> không giết được vì tín hiệu chỉ được chuyển tới khi tiến trình quay ra khỏi kernel, mà cái này thì không quay ra — nên gõ <code>kill -9</code> hai mươi lần cũng vô ích, chỉ có việc I/O bên dưới hoàn tất (hoặc khởi động lại máy) mới dọn được nó. Tiến trình xác sống (phương án 1) mang trạng thái <code>Z</code>, không tiêu tốn gì ngoài một ô trong bảng tiến trình, và là một vấn đề hoàn toàn khác.',
          ),
        }),

        // Q24 · 5.2 — free vs available
        mcq({
          prompt: B(
            'A healthy 8 GB server shows this. Should you buy more RAM?' + code(
              '              total   used    free   shared  buff/cache   available\n' +
              'Mem:          7.8Gi   1.9Gi   197Mi    12Mi       5.5Gi       5.3Gi\n' +
              'Swap:         2.0Gi      0B   2.0Gi',
            ),
            'Một máy chủ 8 GB khoẻ mạnh hiện ra thế này. Có nên mua thêm RAM không?' + code(
              '              total   used    free   shared  buff/cache   available\n' +
              'Mem:          7.8Gi   1.9Gi   197Mi    12Mi       5.5Gi       5.3Gi\n' +
              'Swap:         2.0Gi      0B   2.0Gi',
            ),
          ),
          options: [
            B('No. <code>free</code> is low because Linux uses spare RAM as page cache, and that 5.5Gi is handed back the instant a process asks for it. The honest number is <code>available</code> — 5.3Gi here — and swap is untouched, so the machine is using its memory correctly', 'Không. <code>free</code> thấp là vì Linux lấy RAM rỗi làm bộ nhớ đệm trang, và 5,5Gi đó được trả lại ngay khi một tiến trình cần. Con số thành thật là <code>available</code> — ở đây là 5,3Gi — và swap còn nguyên, nên cái máy đang dùng bộ nhớ đúng cách'),
            B('Yes. Only 197Mi is free out of 7.8Gi, so the machine is 97% full; the next process that asks for memory will either be refused or push the box into swap, and the OOM killer is one traffic spike away', 'Có. Chỉ còn 197Mi rỗi trên 7,8Gi, nên máy đã đầy 97%; tiến trình tiếp theo xin bộ nhớ sẽ hoặc bị từ chối hoặc đẩy máy vào swap, và kẻ giết OOM chỉ còn cách một đợt tăng lưu lượng'),
            B('Yes, but for a different reason: <code>buff/cache</code> sitting at 5.5Gi is a leak in the page cache, which the kernel does not reclaim on its own once it has grown that large, so only <code>echo 3 > /proc/sys/vm/drop_caches</code> or a reboot will return the memory', 'Có, nhưng vì lý do khác: <code>buff/cache</code> nằm ở 5,5Gi là một chỗ rò trong bộ nhớ đệm trang, thứ mà kernel không tự thu hồi một khi nó đã phình tới mức ấy, nên chỉ <code>echo 3 > /proc/sys/vm/drop_caches</code> hoặc khởi động lại mới trả lại bộ nhớ'),
            B('Impossible to tell from <code>free</code>, whose columns overlap and double-count; the only reliable figure is the sum of the <code>RSS</code> column across every row of <code>ps aux</code>, compared against the physical memory installed', 'Không thể biết được từ <code>free</code>, thứ có các cột chồng lấn và đếm trùng; con số đáng tin duy nhất là tổng cột <code>RSS</code> qua mọi dòng của <code>ps aux</code>, đem so với dung lượng bộ nhớ vật lý đang lắp'),
          ],
          correct: 0,
          explanation: EX(
            'Read <code>available</code>, never <code>free</code>. Unused RAM is wasted RAM, so Linux fills it with cached file contents; that cache is instantly reclaimable, and <code>available</code> is the kernel\'s own estimate of how much a new process could get without swapping. A monitoring alert built on "free memory below 10%" pages you every day on a perfectly healthy machine and stays silent on one that is genuinely about to be OOM-killed. Build alerts on <code>available</code> and on swap <em>activity</em> (<code>si</code>/<code>so</code> in <code>vmstat 1</code>) instead — steady swapping means thrashing, and a disk read that should have been a memory read is roughly a hundred thousand times slower. Option 4 is wrong for its own instructive reason: summing <code>RSS</code> double-counts shared pages, so it can exceed the physical memory installed.',
            'Hãy đọc <code>available</code>, đừng bao giờ đọc <code>free</code>. RAM không dùng là RAM phí, nên Linux nhét đầy nó bằng nội dung file đã đọc; phần đệm ấy thu hồi được tức thì, và <code>available</code> chính là ước lượng của kernel về việc một tiến trình mới có thể lấy được bao nhiêu mà không phải swap. Một cảnh báo giám sát xây trên "bộ nhớ rỗi dưới 10%" sẽ gọi bạn dậy mỗi ngày trên một cái máy hoàn toàn khoẻ, và im re trên một cái máy sắp bị OOM giết thật. Hãy dựng cảnh báo trên <code>available</code> và trên <em>hoạt động</em> swap (<code>si</code>/<code>so</code> trong <code>vmstat 1</code>) — swap đều đặn nghĩa là đang giày vò, và một lần đọc đĩa lẽ ra phải là đọc bộ nhớ thì chậm hơn cỡ một trăm nghìn lần. Phương án 4 sai vì một lý do cũng đáng học: cộng cột <code>RSS</code> lại là đếm trùng các trang dùng chung, nên tổng đó có thể vượt cả dung lượng bộ nhớ vật lý đang lắp.',
          ),
        }),

        // Q25 · 5.4 — & và SIGHUP
        mcq({
          prompt: B(
            'You SSH into a server and start <code>./build.sh &amp;</code>. You then close the terminal. What most likely happens to the build, and what is the right tool?',
            'Bạn SSH vào một máy chủ rồi chạy <code>./build.sh &amp;</code>. Sau đó bạn đóng terminal. Nhiều khả năng chuyện gì xảy ra với lượt build đó, và công cụ đúng là gì?',
          ),
          options: [
            B('It keeps running: <code>&amp;</code> reparents the process to <code>init</code> and detaches it from the session completely, which is exactly what backgrounding is for, so nothing further is required', 'Nó vẫn chạy: dấu <code>&amp;</code> gán tiến trình sang làm con của <code>init</code> và tách hẳn nó khỏi phiên, và đó chính là mục đích của việc cho chạy nền, nên không cần làm gì thêm'),
            B('It keeps running but its output is lost once the terminal is gone, and that is the only downside; adding <code>> build.log 2>&amp;1</code> captures the output and makes the arrangement production-ready', 'Nó vẫn chạy nhưng mất phần output khi terminal biến mất, và đó là nhược điểm duy nhất; thêm <code>> build.log 2>&amp;1</code> là hứng được output và cách làm này đủ dùng cho production'),
            B('It is suspended rather than killed, and resumes automatically the next time you SSH in, because the shell writes its job table into the user\'s home directory and reloads it on the next login', 'Nó bị treo lại chứ không bị giết, và tự chạy tiếp ở lần bạn SSH vào sau, vì shell ghi bảng job của nó vào thư mục nhà của người dùng rồi nạp lại ở lần đăng nhập kế tiếp'),
            B('It dies: closing the terminal sends SIGHUP to the session, and <code>&amp;</code> alone does not protect against that. Use <code>tmux</code> (or <code>nohup</code>, or <code>disown -h</code> after the fact) — and for anything that must survive a reboot, a systemd unit', 'Nó chết: đóng terminal là gửi SIGHUP cho cả phiên, và riêng dấu <code>&amp;</code> không chống được điều đó. Hãy dùng <code>tmux</code> (hoặc <code>nohup</code>, hoặc <code>disown -h</code> khi đã lỡ) — và với thứ phải sống qua một lần khởi động lại thì dùng một unit của systemd'),
          ],
          correct: 3,
          explanation: EX(
            'Backgrounding with <code>&amp;</code> only detaches the job from your <em>prompt</em>; it stays in the terminal\'s session, and when the terminal goes away the kernel sends SIGHUP to everything in it. The default action for SIGHUP is to terminate. <code>nohup cmd &amp;</code> makes the process ignore that signal in advance; <code>disown -h</code> does the same after the fact, which is the one to remember because it works when you are already an hour into a build and realise you need to close the laptop — Ctrl-Z, <code>bg</code>, <code>disown -h %1</code>. The habit the lesson actually recommends is <code>tmux attach || tmux new</code> the moment you connect, so nothing you start is ever at the mercy of your network. And note the boundary: <code>nohup node server.js &amp;</code> works right up until the machine reboots, after which nothing brings it back. If a process matters, it belongs in a systemd unit (chapter 11).',
            'Cho chạy nền bằng <code>&amp;</code> chỉ tách job ra khỏi <em>dấu nhắc</em> của bạn; nó vẫn nằm trong phiên của terminal, và khi terminal biến mất thì kernel gửi SIGHUP cho mọi thứ trong đó. Hành động mặc định với SIGHUP là kết thúc. <code>nohup cmd &amp;</code> làm tiến trình lờ tín hiệu ấy đi ngay từ đầu; <code>disown -h</code> làm y vậy nhưng sau khi đã lỡ, và đó mới là cái đáng nhớ vì nó cứu được lúc bạn đã build được một tiếng và chợt nhận ra phải gập laptop — Ctrl-Z, <code>bg</code>, <code>disown -h %1</code>. Thói quen mà bài học thật sự khuyên là gõ <code>tmux attach || tmux new</code> ngay khi vừa kết nối, để không lệnh nào bạn khởi động phải phó mặc cho đường mạng. Và hãy nhớ cái ranh giới: <code>nohup node server.js &amp;</code> chạy tốt cho tới lúc máy khởi động lại, sau đó chẳng có gì mang nó trở về. Nếu một tiến trình là quan trọng, chỗ của nó là một unit của systemd (chương 11).',
          ),
        }),

        // ══ Chương 6 — Biến, nháy & khai triển ══════════════════════════
        // Q26 · 6.1 — số học
        mcq({
          prompt: B(
            'Real output from bash 5.2. Which line explains both results?' + code(
              '$ echo $((10 / 3))\n' +
              '3\n' +
              '$ month=08\n' +
              '$ echo $((month))\n' +
              'bash: 08: value too great for base (error token is "08")',
            ),
            'Kết quả thật từ bash 5.2. Dòng nào giải thích được cả hai kết quả?' + code(
              '$ echo $((10 / 3))\n' +
              '3\n' +
              '$ month=08\n' +
              '$ echo $((month))\n' +
              'bash: 08: value too great for base (error token is "08")',
            ),
          ),
          options: [
            B('Bash rounds division to the nearest integer, and rejects any value with a leading zero as ambiguous', 'Bash làm tròn phép chia tới số nguyên gần nhất, và từ chối mọi giá trị có số 0 đứng đầu vì mơ hồ'),
            B('Both are locale problems: setting <code>LC_NUMERIC=C</code> makes division return <code>3.333</code> and accepts <code>08</code>', 'Cả hai là chuyện locale: đặt <code>LC_NUMERIC=C</code> thì phép chia trả về <code>3.333</code> và chấp nhận <code>08</code>'),
            B('Bash arithmetic is integer only and <b>truncates</b> (so <code>10/3</code> is 3 and <code>1/2</code> is 0), and a leading zero means octal, in which <code>8</code> is not a valid digit — force base 10 with <code>$((10#$month))</code>', 'Số học của bash chỉ làm việc với số nguyên và <b>cắt phần lẻ</b> (nên <code>10/3</code> ra 3 và <code>1/2</code> ra 0), còn số 0 đứng đầu nghĩa là hệ bát phân, mà trong đó <code>8</code> không phải chữ số hợp lệ — hãy ép về hệ 10 bằng <code>$((10#$month))</code>'),
            B('<code>$(( ))</code> only accepts literal numbers; a variable must be written <code>$month</code> inside it, and that also fixes the division', '<code>$(( ))</code> chỉ nhận số viết thẳng; bên trong nó biến phải viết là <code>$month</code>, và điều đó cũng sửa luôn phép chia'),
          ],
          correct: 2,
          explanation: EX(
            'Both verified. Bash has no floating point: <code>$((10/3))</code> is <code>3</code>, <code>$((1/2))</code> is <code>0</code>, and it truncates rather than rounding (<code>$((-7/2))</code> is <code>-3</code>). Nothing warns, so a script computing a percentage or an average silently produces wrong numbers — for decimals you need <code>bc</code> (<code>echo "scale=2; 10/3" | bc</code>) or <code>awk \'BEGIN {print 10/3}\'</code>. The second half is the sharper edge because it produces a hard error at 08:00 and 09:00 only: a leading zero makes bash read the literal as octal, and <code>08</code> and <code>09</code> are not octal numbers. This bites every script that builds a number out of a zero-padded date field from <code>date +%m</code> or <code>date +%d</code>. The fix is <code>$((10#$month))</code>, which forces base 10. Option 4 is wrong in an instructive way: inside <code>$(( ))</code> the <code>$</code> is optional, and both <code>$((month))</code> and <code>$(($month))</code> fail here for the same reason.',
            'Cả hai đều đã kiểm. Bash không có số thực: <code>$((10/3))</code> ra <code>3</code>, <code>$((1/2))</code> ra <code>0</code>, và nó cắt phần lẻ chứ không làm tròn (<code>$((-7/2))</code> ra <code>-3</code>). Không có gì cảnh báo, nên một script tính phần trăm hay trung bình sẽ âm thầm cho ra số sai — muốn số lẻ thì cần <code>bc</code> (<code>echo "scale=2; 10/3" | bc</code>) hoặc <code>awk \'BEGIN {print 10/3}\'</code>. Nửa thứ hai mới là cạnh sắc hơn vì nó sinh ra một lỗi cứng chỉ vào lúc 08 giờ và 09 giờ: số 0 đứng đầu khiến bash đọc con số ấy theo hệ bát phân, mà <code>08</code> và <code>09</code> không phải số bát phân. Nó cắn mọi script dựng một con số từ một trường ngày tháng đệm số 0 lấy bằng <code>date +%m</code> hay <code>date +%d</code>. Cách sửa là <code>$((10#$month))</code>, ép về hệ 10. Phương án 4 sai theo một cách đáng học: bên trong <code>$(( ))</code> thì dấu <code>$</code> là tuỳ chọn, và cả <code>$((month))</code> lẫn <code>$(($month))</code> đều hỏng ở đây vì cùng một lý do.',
          ),
        }),

        // Q27 · 6.2 — biến không đặt trong nháy
        mcq({
          prompt: B(
            'Real run in a directory containing <code>one.txt</code> and <code>two.txt</code>:' + code(
              'v=\'*\'\n' +
              'for a in $v;   do printf \'[%s]\' "$a"; done; echo   # A\n' +
              'for a in "$v"; do printf \'[%s]\' "$a"; done; echo   # B',
            ) + '<p>What did each line print?</p>',
            'Chạy thật trong một thư mục chứa <code>one.txt</code> và <code>two.txt</code>:' + code(
              'v=\'*\'\n' +
              'for a in $v;   do printf \'[%s]\' "$a"; done; echo   # A\n' +
              'for a in "$v"; do printf \'[%s]\' "$a"; done; echo   # B',
            ) + '<p>Mỗi dòng in ra gì?</p>',
          ),
          options: [
            B('A printed <code>[one.txt][two.txt]</code> and B printed <code>[*]</code> — an unquoted expansion is word-split AND glob-expanded, so the star in the variable turned into the directory listing', 'A in ra <code>[one.txt][two.txt]</code> còn B in ra <code>[*]</code> — một phép khai triển không đặt trong nháy bị cắt từ VÀ bị khai triển glob, nên dấu sao trong biến biến thành danh sách thư mục'),
            B('Both printed <code>[*]</code> — the single quotes at assignment time already made the value literal, permanently', 'Cả hai in ra <code>[*]</code> — dấu nháy đơn lúc gán đã làm giá trị thành chữ nguyên văn, vĩnh viễn'),
            B('Both printed <code>[one.txt][two.txt]</code> — double quotes stop word splitting but not globbing', 'Cả hai in ra <code>[one.txt][two.txt]</code> — nháy kép chặn phép cắt từ nhưng không chặn glob'),
            B('A printed <code>[*]</code> and B printed <code>[one.txt][two.txt]</code>, because quoting is what asks the shell to expand a value', 'A in ra <code>[*]</code> còn B in ra <code>[one.txt][two.txt]</code>, vì chính dấu nháy mới là thứ yêu cầu shell khai triển giá trị'),
          ],
          correct: 0,
          explanation: EX(
            'Verified exactly as written: <code>[one.txt][two.txt]</code> then <code>[*]</code>. The quotes at assignment time only stop the shell expanding the star <em>there</em>; the value stored is the character <code>*</code>, and every later unquoted expansion of that variable goes through word splitting and then pathname expansion again. This is the dangerous step, because the value can come from user input, a config file or an API response: <code>rm $userinput</code> with <code>userinput="*"</code> deletes everything in the directory and the script looks completely innocent in review. The same run showed the word-splitting half: with <code>s=\'a  b\'</code>, unquoted gives <code>[a][b]</code> and quoted gives <code>[a  b]</code> with both spaces intact. The rule is simply to write <code>"${var}"</code> everywhere — the only place quoting is optional is inside <code>[[ ]]</code> and <code>(( ))</code>, where bash does not word-split.',
            'Đã kiểm đúng như viết: <code>[one.txt][two.txt]</code> rồi <code>[*]</code>. Dấu nháy lúc gán chỉ ngăn shell khai triển dấu sao <em>ngay tại chỗ đó</em>; giá trị được cất là ký tự <code>*</code>, và mọi lần khai triển biến ấy về sau mà không đặt trong nháy đều đi qua phép cắt từ rồi lại tới phép khai triển đường dẫn. Đây mới là bước nguy hiểm, bởi giá trị có thể đến từ đầu vào người dùng, một file cấu hình hay một phản hồi API: <code>rm $userinput</code> với <code>userinput="*"</code> xoá sạch thư mục, mà script thì trông hoàn toàn vô hại lúc review. Cùng lần chạy đó cũng cho thấy nửa cắt từ: với <code>s=\'a  b\'</code>, không nháy cho <code>[a][b]</code> còn có nháy cho <code>[a  b]</code> giữ nguyên cả hai dấu cách. Luật đơn giản là viết <code>"${var}"</code> ở mọi nơi — chỗ duy nhất được phép bỏ nháy là bên trong <code>[[ ]]</code> và <code>(( ))</code>, nơi bash không cắt từ.',
          ),
        }),

        // Q28 · 6.2 — "$@" vs "$*"
        mcq({
          prompt: B(
            'A script is called as <code>./args.sh \'a b\' c</code> — two arguments, the first containing a space. A helper prints each argument in brackets. Real output:' + code(
              'with "$@"  ->  [a b][c]      (count=2)\n' +
              'with "$*"  ->  [a b c]       (count=1)\n' +
              'with  $@   ->  [a][b][c]     (count=3)',
            ) + '<p>Which form should a wrapper script use to pass its arguments on unchanged, and why?</p>',
            'Một script được gọi bằng <code>./args.sh \'a b\' c</code> — hai tham số, cái đầu có dấu cách. Một hàm phụ in từng tham số trong ngoặc vuông. Kết quả thật:' + code(
              'with "$@"  ->  [a b][c]      (count=2)\n' +
              'with "$*"  ->  [a b c]       (count=1)\n' +
              'with  $@   ->  [a][b][c]     (count=3)',
            ) + '<p>Một script bọc nên dùng dạng nào để chuyển tiếp tham số nguyên vẹn, và vì sao?</p>',
          ),
          options: [
            B('<code>"$*"</code>, because the quotes keep the whole list together as one safely quoted string, and the receiving command re-splits it back into the original arguments when it parses its own command line', '<code>"$*"</code>, vì dấu nháy giữ cả danh sách lại thành một chuỗi được bọc an toàn, và lệnh nhận sẽ cắt nó trở lại thành các tham số ban đầu khi tự phân tích dòng lệnh của nó'),
            B('<code>"$@"</code> — quoted, with the at sign — because it expands to one properly quoted word <em>per original argument</em>. <code>"$*"</code> joins them into a single string, and bare <code>$@</code> re-splits every argument on whitespace', '<code>"$@"</code> — có nháy, dùng dấu a còng — vì nó khai triển thành đúng một từ đã bọc nháy <em>cho mỗi tham số gốc</em>. <code>"$*"</code> nối chúng thành một chuỗi duy nhất, còn <code>$@</code> trơ trọi thì cắt lại từng tham số theo khoảng trắng'),
            B('Bare <code>$@</code>, because a count of 3 shows it preserved the most information of the three forms, and the quoted versions each collapsed something the caller had provided', '<code>$@</code> trơ trọi, vì con số 3 cho thấy nó giữ được nhiều thông tin nhất trong ba dạng, còn hai dạng có nháy thì mỗi cái đều làm bẹp mất thứ gì đó người gọi đã đưa vào'),
            B('Any of the three works identically in <code>bash</code>; the difference only appears in <code>zsh</code>, which quotes positional parameters differently, so a portable script should pick whichever reads most clearly', 'Trong <code>bash</code> thì dạng nào cũng chạy y hệt; khác biệt chỉ lộ ra trong <code>zsh</code>, thứ bọc nháy các tham số vị trí theo cách khác, nên một script đa nền cứ chọn dạng nào đọc rõ nhất'),
          ],
          correct: 1,
          explanation: EX(
            'The counts in the real output settle it. <code>"$@"</code> is special-cased by bash: it expands to <code>"$1" "$2" …</code>, one word each, so a filename with a space arrives as one argument exactly as the caller intended. <code>"$*"</code> joins the arguments with the first character of <code>IFS</code> into a single word — occasionally what you want for a log message, never what you want for passing arguments on. Bare <code>$@</code> looks correct until an argument contains whitespace, at which point <code>a b</code> silently becomes two arguments and a wrapper script mangles exactly the filenames people complain about. The same rule with the same reasoning applies to arrays: <code>"${arr[@]}"</code> is the only correct expansion, <code>"${arr[*]}"</code> flattens, and unquoted <code>${arr[@]}</code> re-splits.',
            'Chính mấy con số trong kết quả thật đã quyết định. <code>"$@"</code> được bash xử lý như một ca đặc biệt: nó khai triển thành <code>"$1" "$2" …</code>, mỗi thứ một từ, nên một tên file có dấu cách tới nơi vẫn là một tham số đúng như người gọi định. <code>"$*"</code> nối các tham số lại bằng ký tự đầu tiên của <code>IFS</code> thành một từ duy nhất — thỉnh thoảng đúng ý cho một dòng log, không bao giờ đúng ý để chuyển tiếp tham số. <code>$@</code> trơ trọi trông có vẻ đúng cho tới khi một tham số có khoảng trắng, và ngay lúc đó <code>a b</code> lặng lẽ thành hai tham số còn script bọc thì băm nát đúng những tên file mà người ta hay than phiền. Cùng luật ấy với cùng lý lẽ ấy cũng đúng với mảng: <code>"${arr[@]}"</code> là phép khai triển đúng duy nhất, <code>"${arr[*]}"</code> làm bẹp mảng, còn <code>${arr[@]}</code> không nháy thì cắt lại.',
          ),
        }),

        // Q29 · 6.3 — ${p##*/}
        mcq({
          prompt: B(
            'With <code>p=/srv/app/current/config.yml</code>, three of these four were run and gave the values shown. Which line is <b>wrong</b>?' + code(
              '${p##*/}   ->  config.yml\n' +
              '${p%/*}    ->  /srv/app/current\n' +
              '${p%%/*}   ->  (empty string)\n' +
              '${p#*/}    ->  app/current/config.yml',
            ),
            'Với <code>p=/srv/app/current/config.yml</code>, ba trong bốn dòng dưới đã được chạy và cho ra giá trị hiện ở đó. Dòng nào <b>sai</b>?' + code(
              '${p##*/}   ->  config.yml\n' +
              '${p%/*}    ->  /srv/app/current\n' +
              '${p%%/*}   ->  (chuỗi rỗng)\n' +
              '${p#*/}    ->  app/current/config.yml',
            ),
          ),
          options: [
            B('<code>${p##*/}</code> — the double hash removes from the right, so it should give <code>/srv/app/current</code>', '<code>${p##*/}</code> — hai dấu thăng cắt từ bên phải, nên nó phải cho ra <code>/srv/app/current</code>'),
            B('<code>${p%/*}</code> — <code>%</code> and <code>#</code> both trim from the left, so this should give <code>config.yml</code>', '<code>${p%/*}</code> — cả <code>%</code> lẫn <code>#</code> đều xén từ bên trái, nên dòng này phải cho ra <code>config.yml</code>'),
            B('<code>${p%%/*}</code> — an empty result is impossible; the greedy form always leaves at least the first component', '<code>${p%%/*}</code> — kết quả rỗng là không thể; dạng tham lam luôn để lại ít nhất thành phần đầu tiên'),
            B('<code>${p#*/}</code> — a single <code>#</code> removes the <b>shortest</b> match from the left, which here is just the leading slash, so the real result is <code>srv/app/current/config.yml</code>', '<code>${p#*/}</code> — một dấu <code>#</code> cắt phần khớp <b>ngắn nhất</b> từ bên trái, mà ở đây chỉ là dấu gạch chéo đầu tiên, nên kết quả thật là <code>srv/app/current/config.yml</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Verified: the real values are <code>config.yml</code>, <code>/srv/app/current</code>, the empty string, and <code>srv/app/current/config.yml</code> — so the fourth line as printed in the question is the wrong one. The system is small: <code>#</code> trims from the <b>left</b>, <code>%</code> from the <b>right</b>, and doubling the character makes the match <b>greedy</b>. So <code>#*/</code> eats the shortest run ending in a slash — just <code>/</code> — while <code>##*/</code> eats as much as possible while still ending in a slash, which is everything up to the last one, giving the basename. <code>%%/*</code> greedily removes everything from the first slash to the end, and since the path starts with a slash the result really is empty. These patterns are <b>globs, not regexes</b>: <code>*</code>, <code>?</code> and <code>[…]</code> work, <code>+</code> and <code>\\d</code> do not. One honest caveat: <code>${p##*/}</code> and <code>basename</code> disagree on a trailing slash — <code>/srv/app/</code> gives <code>app</code> from <code>basename</code> and an empty string from the expansion.',
            'Đã kiểm: giá trị thật lần lượt là <code>config.yml</code>, <code>/srv/app/current</code>, chuỗi rỗng, và <code>srv/app/current/config.yml</code> — nên dòng thứ tư như in trong đề mới là dòng sai. Cả hệ thống rất nhỏ: <code>#</code> xén từ <b>bên trái</b>, <code>%</code> từ <b>bên phải</b>, và nhân đôi ký tự thì phép khớp thành <b>tham lam</b>. Vậy <code>#*/</code> ăn đoạn ngắn nhất kết thúc bằng dấu gạch chéo — đúng một dấu <code>/</code> — còn <code>##*/</code> ăn nhiều nhất có thể mà vẫn kết thúc bằng gạch chéo, tức là mọi thứ tới dấu cuối cùng, cho ra tên file. <code>%%/*</code> tham lam gỡ mọi thứ từ dấu gạch chéo đầu tiên tới hết, và vì đường dẫn bắt đầu bằng một dấu gạch chéo nên kết quả đúng là rỗng. Các mẫu này là <b>glob, không phải regex</b>: <code>*</code>, <code>?</code> và <code>[…]</code> dùng được, còn <code>+</code> và <code>\\d</code> thì không. Một lưu ý thành thật: <code>${p##*/}</code> và <code>basename</code> bất đồng ở ca có dấu gạch chéo cuối — <code>/srv/app/</code> cho <code>app</code> qua <code>basename</code> và cho chuỗi rỗng qua phép khai triển.',
          ),
        }),

        // Q30 · 6.3 — ${s: -2} vs ${s:-2}
        mcq({
          prompt: B(
            'Real output, with <code>s=deploy-2026-09-08</code>:' + code(
              '$ echo "${s: -2}"\n' +
              '08\n' +
              '$ echo "${s:-2}"\n' +
              'deploy-2026-09-08',
            ) + '<p>Why does one space change the answer completely?</p>',
            'Kết quả thật, với <code>s=deploy-2026-09-08</code>:' + code(
              '$ echo "${s: -2}"\n' +
              '08\n' +
              '$ echo "${s:-2}"\n' +
              'deploy-2026-09-08',
            ) + '<p>Vì sao một dấu cách lại đổi hẳn câu trả lời?</p>',
          ),
          options: [
            B('The space is a typo that bash tolerates silently; both forms mean substring extraction, and the second returned the whole string only because an offset of 2 with no length given is treated as out of range and falls back to the original value', 'Dấu cách là một lỗi gõ mà bash lặng lẽ bỏ qua; cả hai dạng đều nghĩa là cắt chuỗi con, và dạng thứ hai trả về cả chuỗi chỉ vì độ lệch 2 mà không kèm độ dài bị coi là ngoài phạm vi rồi lùi về giá trị gốc'),
            B('The first is arithmetic — take the length and subtract 2 — while the second is a substring starting at position 2; they are two spellings of related operations whose defaults differ, and the space is what selects between them', 'Dạng đầu là số học — lấy độ dài rồi trừ 2 — còn dạng sau là chuỗi con bắt đầu từ vị trí 2; chúng là hai cách viết của những phép toán họ hàng có mặc định khác nhau, và dấu cách là thứ chọn giữa hai cái'),
            B('They are two <b>different operators</b>. <code>${s: -2}</code> is substring extraction with a negative offset — the last two characters. <code>${s:-2}</code> is the default-value operator: "use <code>2</code> if <code>s</code> is unset or empty", and since <code>s</code> is set it returns <code>s</code> untouched. The space is what tells them apart', 'Chúng là <b>hai toán tử khác nhau</b>. <code>${s: -2}</code> là phép cắt chuỗi con với độ lệch âm — hai ký tự cuối. <code>${s:-2}</code> là toán tử giá trị mặc định: "dùng <code>2</code> nếu <code>s</code> chưa đặt hoặc rỗng", và vì <code>s</code> đã có giá trị nên nó trả lại nguyên <code>s</code>. Dấu cách chính là thứ phân biệt hai cái'),
            B('Bash requires a space after every colon inside <code>${ }</code> so that the parser can tell an offset from an operator; writing it without one is a syntax error that older releases silently ignored, and bash 5 keeps accepting it only for backward compatibility', 'Bash bắt buộc phải có dấu cách sau mỗi dấu hai chấm bên trong <code>${ }</code> để bộ phân tích phân biệt được độ lệch với toán tử; viết thiếu nó là lỗi cú pháp mà các bản cũ lặng lẽ bỏ qua, và bash 5 vẫn chấp nhận chỉ vì tương thích ngược'),
          ],
          correct: 2,
          explanation: EX(
            'Verified both ways, including with an empty variable: <code>${e: -2}</code> gives the empty string while <code>${e:-2}</code> gives <code>2</code>. Two syntaxes one character apart, and neither errors — which is what makes the confusion expensive. The space exists because <code>:-</code> is itself an operator, so bash needs help deciding whether the <code>-</code> belongs to the operator or to the offset. Both are worth knowing well: negative-offset substring is how you take a suffix without calling an external tool, and the default-value family is the workhorse of script defaults. It has three relatives worth distinguishing: <code>${v:-d}</code> substitutes when unset <em>or empty</em>, <code>${v-d}</code> only when <em>unset</em>, and <code>${v:?msg}</code> aborts with your message — two of those lines at the top of a deploy script turn "the app started and failed three minutes later with an empty connection string" into "it refused to start and named the missing variable".',
            'Đã kiểm cả hai chiều, kể cả với biến rỗng: <code>${e: -2}</code> cho chuỗi rỗng trong khi <code>${e:-2}</code> cho <code>2</code>. Hai cú pháp cách nhau một ký tự, và không cái nào báo lỗi — chính điều đó làm sự nhầm lẫn trở nên đắt đỏ. Dấu cách tồn tại vì bản thân <code>:-</code> là một toán tử, nên bash cần được giúp để quyết định dấu <code>-</code> thuộc về toán tử hay thuộc về độ lệch. Cả hai đều đáng thuộc: cắt chuỗi con với độ lệch âm là cách lấy phần đuôi mà không phải gọi một công cụ bên ngoài, còn họ nhà giá-trị-mặc-định là con ngựa kéo của mọi giá trị mặc định trong script. Nó có ba anh em đáng phân biệt: <code>${v:-d}</code> thay thế khi chưa đặt <em>hoặc rỗng</em>, <code>${v-d}</code> chỉ khi <em>chưa đặt</em>, còn <code>${v:?msg}</code> thì dừng hẳn kèm thông báo của bạn — hai dòng loại đó ở đầu một script deploy biến "ứng dụng khởi động rồi ba phút sau chết vì một chuỗi kết nối rỗng" thành "nó từ chối khởi động và gọi đích danh cái biến còn thiếu".',
          ),
        }),

        // Q31 · 6.4 — [[ $a > $b ]]
        mcq({
          prompt: B(
            'Real output from bash 5.2 with <code>a=10</code> and <code>b=9</code>:' + code(
              '[[ $a >   $b ]]  ->  FALSE\n' +
              '[[ $a -gt $b ]]  ->  TRUE\n' +
              '((   a >   b ))  ->  TRUE',
            ) + '<p>Why is the first line false?</p>',
            'Kết quả thật từ bash 5.2 với <code>a=10</code> và <code>b=9</code>:' + code(
              '[[ $a >   $b ]]  ->  SAI\n' +
              '[[ $a -gt $b ]]  ->  ĐÚNG\n' +
              '((   a >   b ))  ->  ĐÚNG',
            ) + '<p>Vì sao dòng đầu tiên là sai?</p>',
          ),
          options: [
            B('Because <code>[[ ]]</code> requires the variables to be declared with <code>declare -i</code> before any comparison works', 'Vì <code>[[ ]]</code> đòi các biến phải được khai báo bằng <code>declare -i</code> thì mọi phép so sánh mới chạy'),
            B('Inside <code>[[ ]]</code>, <code>&gt;</code> is a <b>string</b> comparison, so it sorts lexicographically and <code>"10"</code> comes before <code>"9"</code>. Use <code>-gt</code>, or better <code>(( ))</code>, for anything numeric', 'Bên trong <code>[[ ]]</code>, dấu <code>&gt;</code> là phép so sánh <b>chuỗi</b>, nên nó sắp theo thứ tự từ điển và <code>"10"</code> đứng trước <code>"9"</code>. Hãy dùng <code>-gt</code>, hoặc tốt hơn là <code>(( ))</code>, cho mọi thứ liên quan tới số'),
            B('Because <code>&gt;</code> inside <code>[[ ]]</code> is a redirection, so the test created a file named <code>9</code> and returned its exit status', 'Vì dấu <code>&gt;</code> bên trong <code>[[ ]]</code> là một phép chuyển hướng, nên phép kiểm đã tạo ra một file tên <code>9</code> rồi trả về mã thoát của việc đó'),
            B('Because <code>$a</code> and <code>$b</code> are unquoted, so word splitting turned the test into a syntax error that bash reports as false', 'Vì <code>$a</code> và <code>$b</code> không đặt trong nháy, nên phép cắt từ biến phép kiểm thành một lỗi cú pháp mà bash báo về là sai'),
          ],
          correct: 1,
          explanation: EX(
            'Verified. It is the <code>sort</code> problem from lesson 3.4 in a new place: as text, <code>"10"</code> begins with <code>1</code>, which sorts before <code>9</code>, so <code>[[ 10 > 9 ]]</code> is genuinely false. Nothing errors, and a version check or a size threshold written this way is quietly wrong for exactly the inputs that matter. Option 3 is not the answer here but is a real and worse hazard one bracket away: inside single-bracket <code>[ ]</code>, a bare <code>&gt;</code> <em>is</em> a redirection, so <code>[ $a > $b ]</code> silently creates a file named <code>9</code> and tests only <code>$a</code> for non-emptiness. That is one of the reasons the lesson says to use <code>[[ ]]</code> in anything with a bash shebang — the other being that an empty variable cannot break its syntax: <code>[ $x = y ]</code> with <code>x</code> empty is a real error (verified: exit 2, "unary operator expected") while <code>[[ $x == y ]]</code> is simply false.',
            'Đã kiểm. Đây là bài toán <code>sort</code> của bài 3.4 đặt ở một chỗ mới: xét như chuỗi, <code>"10"</code> bắt đầu bằng <code>1</code>, thứ sắp trước <code>9</code>, nên <code>[[ 10 > 9 ]]</code> đúng là sai. Không có lỗi nào, và một phép kiểm phiên bản hay một ngưỡng kích thước viết như vậy sẽ âm thầm cho kết quả sai đúng với những đầu vào đáng quan tâm nhất. Phương án 3 không phải đáp án ở đây nhưng là một hiểm hoạ có thật và còn tệ hơn, chỉ cách một cặp ngoặc: bên trong <code>[ ]</code> một ngoặc, dấu <code>&gt;</code> trơ trọi <em>đúng là</em> một phép chuyển hướng, nên <code>[ $a > $b ]</code> lặng lẽ tạo ra một file tên <code>9</code> rồi chỉ kiểm xem <code>$a</code> có rỗng không. Đó là một trong những lý do bài học bảo hãy dùng <code>[[ ]]</code> trong mọi thứ có shebang bash — lý do còn lại là một biến rỗng không phá được cú pháp của nó: <code>[ $x = y ]</code> với <code>x</code> rỗng là một lỗi thật (đã kiểm: thoát 2, "unary operator expected") trong khi <code>[[ $x == y ]]</code> chỉ đơn giản là sai.',
          ),
        }),

        // Q32 · 6.5 — {1..$n}
        mcq({
          prompt: B(
            'Real output from bash 5.2 with <code>n=3</code>:' + code(
              'for i in {1..$n}; do printf \'[%s]\' "$i"; done   ->  [{1..3}]\n' +
              'for i in {1..3};  do printf \'[%s]\' "$i"; done   ->  [1][2][3]',
            ) + '<p>Why does the first loop run once with that literal value?</p>',
            'Kết quả thật từ bash 5.2 với <code>n=3</code>:' + code(
              'for i in {1..$n}; do printf \'[%s]\' "$i"; done   ->  [{1..3}]\n' +
              'for i in {1..3};  do printf \'[%s]\' "$i"; done   ->  [1][2][3]',
            ) + '<p>Vì sao vòng lặp đầu tiên chạy đúng một lần với giá trị nguyên văn đó?</p>',
          ),
          options: [
            B('Because a brace range accepts only single-digit endpoints, and bash cannot know in advance whether <code>$n</code> will expand to one digit or several, so it declines to expand the range at all and passes the text through', 'Vì một dải ngoặc nhọn chỉ nhận hai đầu mút một chữ số, mà bash thì không biết trước <code>$n</code> sẽ khai triển thành một chữ số hay nhiều, nên nó từ chối khai triển cái dải ấy và truyền đoạn chữ qua nguyên văn'),
            B('Because a brace range containing a variable must be written <code>${1..$n}</code> with the leading dollar sign, which tells bash to expand the variable first and only then build the range', 'Vì một dải ngoặc nhọn có chứa biến thì phải viết là <code>${1..$n}</code> với dấu đô la đứng trước, thứ bảo bash khai triển biến trước rồi mới dựng cái dải'),
            B('Because <code>for</code> evaluates its word list lazily, one item at a time, and a brace range is only expanded once the loop has entered its second iteration and knows how many items it needs', 'Vì <code>for</code> tính danh sách từ của nó một cách lười, mỗi lần một phần tử, và một dải ngoặc nhọn chỉ được khai triển khi vòng lặp đã bước sang lượt thứ hai và biết mình cần bao nhiêu phần tử'),
            B('Because brace expansion happens <b>before</b> variable expansion, so at brace time the text is literally <code>{1..$n}</code>, which is not a valid range and is passed through unchanged. Use <code>for ((i=1; i&lt;=n; i++))</code> or <code>seq</code> when the bound is a variable', 'Vì phép khai triển ngoặc nhọn diễn ra <b>trước</b> phép khai triển biến, nên tại thời điểm xử lý ngoặc nhọn thì đoạn chữ đúng là <code>{1..$n}</code>, không phải một dải hợp lệ, và được truyền qua nguyên văn. Hãy dùng <code>for ((i=1; i&lt;=n; i++))</code> hoặc <code>seq</code> khi cận là một biến'),
          ],
          correct: 3,
          explanation: EX(
            'Verified: the first loop printed <code>[{1..3}]</code> exactly once, and the C-style and <code>seq</code> forms both printed <code>[1][2][3]</code>. This is a pure ordering question. The shell expands a line in a fixed sequence — brace expansion, then tilde, then parameter and variable expansion, then command substitution, then arithmetic, then word splitting, then pathname expansion. Brace expansion runs first, sees the literal characters <code>{1..$n}</code>, decides that is not a numeric range, and leaves it alone; the variable is substituted afterwards, far too late to help. This trips people up precisely because the hard-coded version works perfectly, so the loop looks tested. Knowing the expansion order also explains the other results in this chapter: why <code>rm *.log</code> never sees a star, and why an unquoted variable containing <code>*</code> is glob-expanded (pathname expansion comes last, after the variable has been substituted).',
            'Đã kiểm: vòng lặp đầu in ra <code>[{1..3}]</code> đúng một lần, còn dạng C và dạng <code>seq</code> đều in ra <code>[1][2][3]</code>. Đây thuần tuý là một câu hỏi về thứ tự. Shell khai triển một dòng theo một trình tự cố định — ngoặc nhọn, rồi dấu ngã, rồi tham số và biến, rồi thay thế lệnh, rồi số học, rồi cắt từ, rồi khai triển đường dẫn. Khai triển ngoặc nhọn chạy trước nhất, nó nhìn thấy đúng các ký tự <code>{1..$n}</code>, kết luận đó không phải một dải số, và để nguyên; biến được thay vào sau đó, muộn quá xa để cứu vãn. Chuyện này bẫy người ta chính vì bản viết cứng số chạy hoàn hảo, nên vòng lặp trông như đã được thử. Biết thứ tự khai triển cũng giải thích các kết quả khác trong chương này: vì sao <code>rm *.log</code> không bao giờ thấy dấu sao, và vì sao một biến không nháy chứa <code>*</code> lại bị khai triển thành glob (khai triển đường dẫn đứng cuối, sau khi biến đã được thay vào).',
          ),
        }),

        // ══ Chương 7 — Viết script chạy thật ════════════════════════════
        // Q33 · 7.1 — set -e không kích hoạt ở đâu
        mcq({
          prompt: B(
            'This script starts with <code>set -euo pipefail</code>. It was run for real and printed lines A, B and C, then stopped with exit status 1.' + code(
              'set -euo pipefail\n' +
              'if false; then echo never; fi\n' +
              'echo "A"\n' +
              'false || echo "B"\n' +
              'false && echo never\n' +
              'echo "C"\n' +
              'false | true\n' +
              'echo "D"',
            ) + '<p>Which explanation matches that behaviour?</p>',
            'Script này mở đầu bằng <code>set -euo pipefail</code>. Nó đã được chạy thật và in ra các dòng A, B, C, rồi dừng với mã thoát 1.' + code(
              'set -euo pipefail\n' +
              'if false; then echo never; fi\n' +
              'echo "A"\n' +
              'false || echo "B"\n' +
              'false && echo never\n' +
              'echo "C"\n' +
              'false | true\n' +
              'echo "D"',
            ) + '<p>Lời giải thích nào khớp với hành vi đó?</p>',
          ),
          options: [
            B('<code>set -e</code> never fires on the builtin <code>false</code> at all, because a builtin returns a status rather than exiting a process; the script stopped further down only because <code>set -u</code> found an unset variable inside the pipeline', '<code>set -e</code> hoàn toàn không kích hoạt với builtin <code>false</code>, bởi một builtin trả về mã thoát chứ không kết thúc một tiến trình; script dừng ở phía dưới chỉ vì <code>set -u</code> gặp một biến chưa đặt bên trong ống dẫn'),
            B('<code>set -e</code> fired on the very first <code>false</code> and the shell began shutting down there; A, B and C still appeared because bash had buffered those <code>echo</code> calls and flushed them on the way out', '<code>set -e</code> đã kích hoạt ngay ở chữ <code>false</code> đầu tiên và shell bắt đầu tắt từ đó; A, B, C vẫn hiện ra vì bash đã gom đệm các lệnh <code>echo</code> ấy rồi xả chúng ra lúc thoát'),
            B('<code>set -e</code> deliberately ignores a failure used as a <b>condition</b>: inside an <code>if</code> test, and on the left of <code>||</code> or <code>&amp;&amp;</code>. It stopped at <code>false | true</code> because <code>pipefail</code> makes the pipeline\'s status the last non-zero one — without <code>pipefail</code> that line would have been survived too and D would have printed', '<code>set -e</code> cố ý bỏ qua một thất bại được dùng làm <b>điều kiện</b>: bên trong phép kiểm của <code>if</code>, và ở vế trái của <code>||</code> hay <code>&amp;&amp;</code>. Nó dừng ở <code>false | true</code> vì <code>pipefail</code> làm mã thoát của ống dẫn thành mã khác 0 cuối cùng — không có <code>pipefail</code> thì dòng đó cũng sống sót và D đã được in ra'),
            B('The script stopped at <code>false &amp;&amp; echo never</code>, because the left side of <code>&amp;&amp;</code> is the one place <code>set -e</code> is strictest; the line printing C came from an exit trap installed by <code>set -e</code> itself', 'Script dừng ở <code>false &amp;&amp; echo never</code>, vì vế trái của <code>&amp;&amp;</code> là chỗ <code>set -e</code> nghiêm khắc nhất; dòng in ra C là do một bẫy exit mà chính <code>set -e</code> cài vào'),
          ],
          correct: 2,
          explanation: EX(
            'Verified twice. The full run printed A, B, C and then exited 1 at the pipeline; a separate run of <code>bash -c \'set -e; false | true; echo reached\'</code> printed <code>reached</code>, and <code>bash -c \'set -eo pipefail; false | true; echo …\'</code> exited 1 without printing. <code>set -e</code> exempts any command whose status is being <em>examined</em> — an <code>if</code> or <code>while</code> condition, the left side of <code>&amp;&amp;</code> or <code>||</code>, and anything negated with <code>!</code> — because exiting there would make conditionals impossible. It also does not fire for a failing member in the middle of a pipeline unless <code>pipefail</code> is on, and it behaves surprisingly around functions called in a condition. The practical consequence from the lesson: treat strict mode as a net that catches the failures you did not think about, not as a replacement for checking the ones you did.',
            'Đã kiểm hai lần. Lần chạy đầy đủ in ra A, B, C rồi thoát với mã 1 tại ống dẫn; một lần chạy riêng <code>bash -c \'set -e; false | true; echo reached\'</code> in ra <code>reached</code>, còn <code>bash -c \'set -eo pipefail; false | true; echo …\'</code> thoát 1 mà không in gì. <code>set -e</code> miễn trừ mọi lệnh mà mã thoát của nó đang được <em>xem xét</em> — điều kiện của <code>if</code> hay <code>while</code>, vế trái của <code>&amp;&amp;</code> hoặc <code>||</code>, và bất cứ thứ gì bị phủ định bằng <code>!</code> — bởi thoát ra ở đó thì không viết được câu điều kiện nữa. Nó cũng không kích hoạt với một thành phần hỏng nằm giữa một ống dẫn trừ khi bật <code>pipefail</code>, và nó hành xử khá bất ngờ quanh các hàm được gọi trong một điều kiện. Hệ quả thực tế của bài học: hãy coi chế độ nghiêm ngặt là tấm lưới hứng những thất bại bạn không nghĩ tới, chứ không phải thứ thay thế việc kiểm những thất bại bạn đã nghĩ tới.',
          ),
        }),

        // Q34 · 7.4 + 6.1 — local nuốt mã thoát
        mcq({
          prompt: B(
            'Real output. <code>bad()</code> does nothing but <code>return 7</code>.' + code(
              'f1() { local v=$(bad); echo "$?"; }     ->  0\n' +
              'f2() { local v; v=$(bad); echo "$?"; }  ->  7',
            ) + '<p>Why does the one-line version report success?</p>',
            'Kết quả thật. Hàm <code>bad()</code> không làm gì ngoài <code>return 7</code>.' + code(
              'f1() { local v=$(bad); echo "$?"; }     ->  0\n' +
              'f2() { local v; v=$(bad); echo "$?"; }  ->  7',
            ) + '<p>Vì sao bản viết một dòng lại báo thành công?</p>',
          ),
          options: [
            B('Because <code>local</code> is itself a command, and on that line it is the <em>last</em> one to run — so <code>$?</code> is <code>local</code>\'s own status, which is always 0. Declare first, assign on the next line', 'Vì bản thân <code>local</code> là một lệnh, và trên dòng đó nó là lệnh chạy <em>sau cùng</em> — nên <code>$?</code> là mã thoát của chính <code>local</code>, và nó luôn bằng 0. Hãy khai báo trước, gán ở dòng kế tiếp'),
            B('Because command substitution always swallows the exit status of the command inside it, in both forms; <code>f2</code> reports 7 only because of the semicolon', 'Vì phép thay thế lệnh luôn nuốt mã thoát của lệnh bên trong, ở cả hai dạng; <code>f2</code> báo 7 chỉ nhờ dấu chấm phẩy'),
            B('Because <code>local</code> resets <code>$?</code> deliberately, as documented, to make functions idempotent', 'Vì <code>local</code> cố ý đặt lại <code>$?</code>, đúng như tài liệu, để làm cho các hàm trở nên bất biến khi chạy lại'),
            B('Because a function\'s <code>return</code> value is only visible outside the function, never inside a substitution', 'Vì giá trị <code>return</code> của một hàm chỉ nhìn thấy được ở ngoài hàm, không bao giờ thấy được bên trong một phép thay thế'),
          ],
          correct: 0,
          explanation: EX(
            'Verified: <code>0</code> then <code>7</code>. <code>local</code>, <code>declare</code>, <code>export</code> and <code>readonly</code> are builtins that <em>run</em>, and <code>$?</code> always belongs to the last command executed. On the <code>f1</code> line the substitution runs first, then <code>local</code> assigns and returns 0, overwriting the interesting status. The damage is real because this is where scripts check things: <code>local sha=$(git rev-parse HEAD) || return 1</code> never fires the <code>|| return 1</code>, so a failed <code>git</code> produces an empty variable that flows onward and the script deploys nothing, successfully. The same trap in plain form is <code>cmd; echo "done"; if [ $? -ne 0 ]</code> — verified: that reports success, because <code>$?</code> is <code>echo</code>\'s. Capture the status immediately (<code>rc=$?</code>) or, better, test the command directly with <code>if</code>. ShellCheck flags the <code>local</code> version as SC2155.',
            'Đã kiểm: <code>0</code> rồi <code>7</code>. <code>local</code>, <code>declare</code>, <code>export</code> và <code>readonly</code> là các builtin có <em>chạy</em>, và <code>$?</code> luôn thuộc về lệnh chạy sau cùng. Trên dòng của <code>f1</code>, phép thay thế chạy trước, rồi <code>local</code> gán xong và trả về 0, ghi đè mất cái mã thoát đáng quan tâm. Thiệt hại là có thật vì đây đúng là chỗ script đi kiểm mọi thứ: <code>local sha=$(git rev-parse HEAD) || return 1</code> không bao giờ kích hoạt được <code>|| return 1</code>, nên một lệnh <code>git</code> hỏng sinh ra một biến rỗng chảy tiếp đi, và script deploy ra hư không, một cách thành công. Cùng cái bẫy ấy ở dạng trần là <code>cmd; echo "done"; if [ $? -ne 0 ]</code> — đã kiểm: nó báo thành công, vì <code>$?</code> là của <code>echo</code>. Hãy chộp lấy mã thoát ngay lập tức (<code>rc=$?</code>) hoặc, tốt hơn, kiểm thẳng cái lệnh bằng <code>if</code>. ShellCheck bắt bản <code>local</code> này với mã SC2155.',
          ),
        }),

        // Q35 · 7.3 — trap EXIT
        mcq({
          prompt: B(
            'A script creates a temp file and must always remove it. Which trap is the right one, and why?' + code(
              'trap \'rm -f "$tmp"\' EXIT           # A\n' +
              'trap \'rm -f "$tmp"\' INT TERM       # B\n' +
              'trap \'rm -f "$tmp"\' KILL           # C',
            ),
            'Một script tạo ra một file tạm và bắt buộc phải xoá nó trong mọi trường hợp. Bẫy nào là bẫy đúng, và vì sao?' + code(
              'trap \'rm -f "$tmp"\' EXIT           # A\n' +
              'trap \'rm -f "$tmp"\' INT TERM       # B\n' +
              'trap \'rm -f "$tmp"\' KILL           # C',
            ),
          ),
          options: [
            B('A. <code>EXIT</code> is a pseudo-signal bash runs whenever the shell terminates for <em>any</em> reason — normal end, <code>exit 3</code>, a <code>set -e</code> abort, or after an INT/TERM handler has finished. One line covers every case except SIGKILL, which no handler can catch', 'A. <code>EXIT</code> là một tín hiệu giả mà bash chạy mỗi khi shell kết thúc vì <em>bất cứ</em> lý do gì — kết thúc bình thường, <code>exit 3</code>, một lần dừng do <code>set -e</code>, hay sau khi bộ xử lý INT/TERM đã xong. Một dòng phủ mọi trường hợp trừ SIGKILL, thứ không bộ xử lý nào bắt được'),
            B('B. <code>EXIT</code> only runs when the script reaches its last line or calls <code>exit 0</code>, so a script that dies on an interrupt or is aborted by <code>set -e</code> would leak the temp file; trapping the real signals is what covers those paths', 'B. <code>EXIT</code> chỉ chạy khi script đi tới dòng cuối hoặc gọi <code>exit 0</code>, nên một script chết vì bị ngắt hoặc bị <code>set -e</code> dừng lại sẽ để rò file tạm; bẫy các tín hiệu thật mới là thứ phủ được những lối đó'),
            B('C. Only <code>KILL</code> is guaranteed to be delivered no matter what the process is doing, so it is the one trap that cannot be skipped, and a handler on it therefore covers every other termination path as well', 'C. Chỉ có <code>KILL</code> là chắc chắn được chuyển tới bất kể tiến trình đang làm gì, nên đó là cái bẫy duy nhất không thể bị bỏ qua, và một bộ xử lý trên nó vì thế cũng phủ luôn mọi lối kết thúc khác'),
            B('All three are needed together: <code>EXIT</code> covers the normal path, <code>INT TERM</code> covers interruption, and <code>KILL</code> covers a forced stop; none of them overlaps, which is why cleanup code is usually written once and registered three times', 'Cần cả ba cùng lúc: <code>EXIT</code> phủ lối bình thường, <code>INT TERM</code> phủ lúc bị ngắt, và <code>KILL</code> phủ lúc bị dừng cưỡng bức; chúng không chồng lấn nhau, và vì thế đoạn mã dọn dẹp thường được viết một lần rồi đăng ký ba lần'),
          ],
          correct: 0,
          explanation: EX(
            'Verified: a script whose only trap is on <code>EXIT</code> ran its cleanup both when it ended with <code>exit 3</code> and when <code>set -e</code> aborted it on a failing command. That is the point — <code>EXIT</code> is not a real signal, it is "the shell is about to terminate", and bash runs it last on every path. Trapping <code>INT TERM</code> instead means writing the same cleanup three times and still missing the ordinary <code>exit 1</code> in the middle of your own error handling. Option 3 is impossible: SIGKILL cannot be caught, blocked or ignored by design, which is also why the lesson prefers <code>flock</code> to a hand-rolled PID-file lock — the kernel releases a <code>flock</code> when the process dies however it dies, while a PID file survives a <code>kill -9</code> and blocks every future run. Two practical notes: define the trap <em>before</em> the thing it cleans up exists, and use single quotes so the body is expanded when it fires, not when the <code>trap</code> line is read.',
            'Đã kiểm: một script chỉ có bẫy trên <code>EXIT</code> đã chạy phần dọn dẹp cả khi nó kết thúc bằng <code>exit 3</code> lẫn khi <code>set -e</code> dừng nó ở một lệnh hỏng. Đó chính là điểm mấu chốt — <code>EXIT</code> không phải một tín hiệu thật, nó là "shell sắp kết thúc", và bash chạy nó sau cùng trên mọi lối đi. Bẫy <code>INT TERM</code> thay vào đó nghĩa là viết cùng một đoạn dọn dẹp ba lần mà vẫn bỏ sót cái <code>exit 1</code> bình thường nằm giữa phần xử lý lỗi của chính bạn. Phương án 3 là bất khả: SIGKILL được thiết kế để không thể bắt, chặn hay lờ đi, và đó cũng là lý do bài học chuộng <code>flock</code> hơn một cái khoá tự chế bằng file PID — kernel nhả <code>flock</code> khi tiến trình chết, chết kiểu gì cũng vậy, còn một file PID thì sống sót qua <code>kill -9</code> và chặn mọi lượt chạy về sau. Hai lưu ý thực dụng: hãy đặt bẫy <em>trước</em> khi thứ nó dọn dẹp ra đời, và dùng nháy đơn để phần thân được khai triển lúc bẫy nổ chứ không phải lúc dòng <code>trap</code> được đọc.',
          ),
        }),

        // Q36 · 7.3 — mktemp
        mcq({
          prompt: B(
            'A backup script writes to <code>/tmp/backup.$$.sql</code>, using the PID for uniqueness. Why does the lesson call this a security bug and not just a style preference?',
            'Một script sao lưu ghi vào <code>/tmp/backup.$$.sql</code>, dùng PID để cho khỏi trùng. Vì sao bài học gọi đây là một lỗi bảo mật chứ không chỉ là chuyện phong cách?',
          ),
          options: [
            B('Because <code>$$</code> is empty in a non-interactive shell such as the one cron uses, so the path collapses to <code>/tmp/backup..sql</code> and two scheduled runs write to the same file and corrupt each other\'s dump', 'Vì <code>$$</code> rỗng trong một shell không tương tác như shell mà cron dùng, nên đường dẫn co lại thành <code>/tmp/backup..sql</code> và hai lượt chạy theo lịch cùng ghi vào một file rồi phá hỏng bản dump của nhau'),
            B('Because <code>/tmp</code> is world-writable and PIDs are predictable and reused, so another user can pre-create that exact path as a symlink pointing at a file <em>you</em> can write — and your script then overwrites their chosen target, as you. <code>mktemp</code> exists to prevent it: it creates the file atomically, mode 600, with an unpredictable name', 'Vì <code>/tmp</code> ai cũng ghi được còn PID thì đoán được và bị dùng lại, nên một người dùng khác có thể tạo sẵn đúng đường dẫn ấy dưới dạng một symlink trỏ tới một file mà <em>bạn</em> ghi được — và script của bạn sẽ ghi đè lên cái đích họ chọn, với danh nghĩa bạn. <code>mktemp</code> sinh ra để ngăn đúng chuyện đó: nó tạo file một cách nguyên tử, mode 600, với một cái tên không đoán được'),
            B('Because <code>systemd-tmpfiles</code> clears <code>/tmp</code> aggressively on most distributions — files untouched for ten minutes are removed — so a long-running dump can have its own output deleted out from under it mid-write', 'Vì <code>systemd-tmpfiles</code> dọn <code>/tmp</code> rất mạnh tay trên phần lớn bản phân phối — file không được đụng tới trong mười phút là bị gỡ — nên một lượt dump chạy lâu có thể bị xoá mất chính output của nó ngay giữa lúc đang ghi'),
            B('Because <code>/tmp</code> is usually mounted with <code>noexec</code> and <code>nosuid</code>, and those mount options also block ordinary reads of files created by another process, so the SQL file cannot be read back reliably', 'Vì <code>/tmp</code> thường được gắn với <code>noexec</code> và <code>nosuid</code>, mà những tuỳ chọn gắn kết đó cũng chặn cả việc đọc thông thường các file do một tiến trình khác tạo ra, nên file SQL không đọc lại được một cách đáng tin'),
          ],
          correct: 1,
          explanation: EX(
            'This is a named attack — a symlink attack — and it is the whole reason <code>mktemp</code> exists. Two ingredients make it work: <code>/tmp</code> is world-writable (that is what the sticky bit in lesson 4.3 is compensating for), and the target name is guessable, because PIDs are small, sequential and reused. An attacker pre-creates <code>/tmp/backup.12345.sql</code> as a symlink to something they want overwritten, waits for your script to reach that PID, and your process — possibly running with more privilege than theirs — does the writing. <code>mktemp</code> closes it by creating the file itself, atomically, with mode 600 and a random suffix, and printing the name it chose: <code>tmp=$(mktemp)</code>. Verified on Linux: the file it creates is <code>-rw-------</code>. Pair it with <code>trap \'rm -f "$tmp"\' EXIT</code> and the temp-file problem is fully solved in two lines.',
            'Đây là một kiểu tấn công có tên hẳn hoi — symlink attack — và nó chính là toàn bộ lý do <code>mktemp</code> tồn tại. Hai nguyên liệu làm nó chạy được: <code>/tmp</code> ai cũng ghi được (đó là thứ mà bit dính ở bài 4.3 đang bù đắp), và cái tên đích thì đoán được, bởi PID nhỏ, tăng dần và được dùng lại. Kẻ tấn công tạo sẵn <code>/tmp/backup.12345.sql</code> dưới dạng một symlink trỏ tới thứ họ muốn ghi đè, chờ script của bạn chạm tới PID đó, và tiến trình của bạn — có thể đang mang nhiều đặc quyền hơn họ — sẽ làm việc ghi ấy. <code>mktemp</code> bịt lại bằng cách tự tạo file, một cách nguyên tử, với mode 600 và một hậu tố ngẫu nhiên, rồi in ra cái tên nó chọn: <code>tmp=$(mktemp)</code>. Đã kiểm trên Linux: file nó tạo ra là <code>-rw-------</code>. Ghép nó với <code>trap \'rm -f "$tmp"\' EXIT</code> là bài toán file tạm được giải trọn vẹn trong hai dòng.',
          ),
        }),

        // ══ Chương 8 — Môi trường & PATH ════════════════════════════════
        // Q37 · 8.1 — bảng băm lệnh
        mcq({
          prompt: B(
            'Real run. <code>PATH</code> is <code>/tmp/binA:/tmp/binB:…</code> and both directories contain a <code>mytool</code>.' + code(
              '$ mytool\n' +
              'I am A\n' +
              '$ rm /tmp/binA/mytool\n' +
              '$ mytool\n' +
              'bash: /tmp/binA/mytool: No such file or directory\n' +
              '$ hash -r\n' +
              '$ mytool\n' +
              'I am B',
            ) + '<p>Why did the second call not simply fall through to <code>/tmp/binB</code>?</p>',
            'Chạy thật. <code>PATH</code> là <code>/tmp/binA:/tmp/binB:…</code> và cả hai thư mục đều có một file <code>mytool</code>.' + code(
              '$ mytool\n' +
              'I am A\n' +
              '$ rm /tmp/binA/mytool\n' +
              '$ mytool\n' +
              'bash: /tmp/binA/mytool: No such file or directory\n' +
              '$ hash -r\n' +
              '$ mytool\n' +
              'I am B',
            ) + '<p>Vì sao lần gọi thứ hai không tự rơi xuống <code>/tmp/binB</code>?</p>',
          ),
          options: [
            B('Because <code>PATH</code> is only read once when the shell starts, so the second entry was never available in this session', 'Vì <code>PATH</code> chỉ được đọc một lần lúc shell khởi động, nên mục thứ hai chưa từng khả dụng trong phiên này'),
            B('Because deleting a file leaves a dangling directory entry that must be cleared with <code>sync</code>', 'Vì xoá một file để lại một mục thư mục treo lơ lửng, phải dọn bằng <code>sync</code>'),
            B('Because bash caches the full path of every command it has resolved, in a hash table. The cached entry still pointed at the old path, so bash tried it directly and failed instead of searching again. <code>hash -r</code> clears that cache', 'Vì bash lưu sẵn đường dẫn đầy đủ của mọi lệnh nó đã tra ra, trong một bảng băm. Mục đã lưu vẫn trỏ vào đường dẫn cũ, nên bash thử thẳng đường đó rồi hỏng thay vì đi tra lại. <code>hash -r</code> xoá bộ nhớ đệm ấy'),
            B('Because a removed executable stays visible to the shell until the inode is freed, and <code>hash -r</code> forces the kernel to release it', 'Vì một file chạy được vừa bị gỡ vẫn hiện với shell cho tới khi inode được giải phóng, và <code>hash -r</code> ép kernel nhả nó ra'),
          ],
          correct: 2,
          explanation: EX(
            'Verified exactly as shown. Searching <code>PATH</code> on every command would mean a directory read per entry per command, so bash remembers where it found each one; <code>hash</code> with no arguments prints the table. The give-away in the error message is that it names a <b>full path</b> — <code>bash: /tmp/binA/mytool: No such file or directory</code> — rather than saying "command not found". That distinction is the diagnosis: a path in the message means a stale hash, so run <code>hash -r</code>; "command not found" means a <code>PATH</code> problem, so a new shell or re-sourcing your rc file is what you need. Knowing which of the two you have saves the reboot people reach for. The companion tools from the same lesson: <code>type</code> for humans (it reveals aliases, functions and builtins as well), <code>command -v</code> in scripts, and never <code>which</code>, which is an external program that cannot see aliases or functions and has inconsistent exit codes between distributions.',
            'Đã kiểm đúng như hiện ở trên. Tra <code>PATH</code> mỗi lần gõ lệnh nghĩa là phải đọc một thư mục cho mỗi mục, cho mỗi lệnh, nên bash ghi nhớ chỗ nó đã tìm ra từng cái; gõ <code>hash</code> không tham số sẽ in ra cái bảng đó. Dấu hiệu tố giác nằm trong thông báo lỗi: nó gọi tên một <b>đường dẫn đầy đủ</b> — <code>bash: /tmp/binA/mytool: No such file or directory</code> — chứ không nói "command not found". Chính sự phân biệt ấy là phép chẩn đoán: có đường dẫn trong thông báo nghĩa là bảng băm cũ, hãy chạy <code>hash -r</code>; còn "command not found" nghĩa là vấn đề ở <code>PATH</code>, và thứ bạn cần là một shell mới hoặc nạp lại file rc. Biết mình đang gặp cái nào trong hai cái đó tiết kiệm được lần khởi động lại máy mà người ta hay với tới. Bộ công cụ đi kèm trong cùng bài: <code>type</code> cho người đọc (nó lộ ra cả bí danh, hàm và builtin), <code>command -v</code> cho script, và đừng bao giờ dùng <code>which</code>, một chương trình bên ngoài không nhìn thấy bí danh hay hàm và có mã thoát không nhất quán giữa các bản phân phối.',
          ),
        }),

        // Q38 · 8.2 — shell không tương tác
        mcq({
          prompt: B(
            'Real run on the same machine, with <code>export FROM_RC=1</code> written in <code>~/.bashrc</code>:' + code(
              '$ bash -i -c \'echo "[$FROM_RC]"\'   ->  [1]\n' +
              '$ bash    -c \'echo "[$FROM_RC]"\'   ->  []',
            ) + '<p>Which real-world failure does this explain?</p>',
            'Chạy thật trên cùng một máy, với dòng <code>export FROM_RC=1</code> nằm trong <code>~/.bashrc</code>:' + code(
              '$ bash -i -c \'echo "[$FROM_RC]"\'   ->  [1]\n' +
              '$ bash    -c \'echo "[$FROM_RC]"\'   ->  []',
            ) + '<p>Nó giải thích được cái hỏng nào trong thực tế?</p>',
          ),
          options: [
            B('That <code>export</code> has no effect inside <code>~/.bashrc</code>, because that file is sourced into a sub-shell whose environment is discarded; a variable only becomes part of the real environment when it is exported from <code>~/.profile</code>, which is read by the login shell itself', 'Rằng <code>export</code> không có tác dụng bên trong <code>~/.bashrc</code>, bởi file đó được nạp vào một shell con mà môi trường của nó bị vứt đi; một biến chỉ thật sự vào môi trường khi được export từ <code>~/.profile</code>, file mà chính shell login đọc'),
            B('That environment variables belong to the terminal emulator rather than to the process tree, so anything set in one shell is invisible in another, and the <code>-i</code> flag simply asks bash to copy the terminal\'s variables into the new shell', 'Rằng biến môi trường thuộc về trình giả lập terminal chứ không thuộc về cây tiến trình, nên thứ gì đặt ở shell này thì shell khác không thấy, và cờ <code>-i</code> chỉ đơn giản là bảo bash chép các biến của terminal vào shell mới'),
            B('That bash keeps a parsed copy of <code>~/.bashrc</code> in memory and re-reads the file only when its <code>mtime</code> changes, so the second invocation reused a cached version recorded before the <code>export</code> line was added', 'Rằng bash giữ một bản đã phân tích của <code>~/.bashrc</code> trong bộ nhớ và chỉ đọc lại file khi <code>mtime</code> của nó đổi, nên lần gọi thứ hai đã dùng lại một bản đệm ghi từ trước khi dòng <code>export</code> được thêm vào'),
            B('That <code>ssh host \'some-command\'</code> starts a <b>non-interactive, non-login</b> shell, which reads no startup file — so a <code>PATH</code> added by nvm or pyenv in <code>~/.bashrc</code> is simply not there, and the remote command fails with "command not found" while the same command works after <code>ssh host</code>. Use an absolute path, or <code>bash -lc</code>', 'Rằng <code>ssh host \'lenh-nao-do\'</code> khởi động một shell <b>không tương tác, không login</b>, thứ không đọc file khởi động nào — nên một <code>PATH</code> do nvm hay pyenv thêm vào trong <code>~/.bashrc</code> đơn giản là không có ở đó, và lệnh từ xa hỏng với "command not found" trong khi đúng lệnh ấy chạy được sau khi <code>ssh host</code>. Hãy dùng đường dẫn tuyệt đối, hoặc <code>bash -lc</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Verified: the interactive shell printed <code>[1]</code>, the non-interactive one printed nothing. Bash decides which startup files to read from two independent properties — login or not, interactive or not. A login shell reads the <b>first</b> of <code>~/.bash_profile</code>, <code>~/.bash_login</code>, <code>~/.profile</code> that exists; an interactive non-login shell reads <code>~/.bashrc</code>; a non-interactive shell such as <code>ssh host \'cmd\'</code>, a cron job or a <code>systemd</code> <code>ExecStart</code> reads neither. That is why "it works when I SSH in and run it by hand" is not evidence that a deploy step will work. Two more consequences from the same lesson: a <code>~/.bash_profile</code> created by some installer silently stops <code>~/.profile</code> being read at all; and anything that <em>prints</em> must go below the interactive guard in <code>~/.bashrc</code>, because a stray <code>echo "Welcome back"</code> above it breaks <code>scp</code> and <code>sftp</code> with a protocol error while interactive logins look perfectly normal.',
            'Đã kiểm: shell tương tác in ra <code>[1]</code>, shell không tương tác không in gì. Bash quyết định đọc file khởi động nào dựa trên hai thuộc tính độc lập — có phải login hay không, có tương tác hay không. Một shell login đọc file <b>đầu tiên</b> trong số <code>~/.bash_profile</code>, <code>~/.bash_login</code>, <code>~/.profile</code> mà nó tìm thấy; một shell tương tác không login đọc <code>~/.bashrc</code>; còn một shell không tương tác như <code>ssh host \'cmd\'</code>, một job cron hay một dòng <code>ExecStart</code> của <code>systemd</code> thì không đọc cái nào. Vì thế câu "tôi SSH vào gõ tay thì chạy mà" không phải bằng chứng rằng một bước deploy sẽ chạy. Hai hệ quả nữa trong cùng bài: một file <code>~/.bash_profile</code> do một trình cài nào đó tạo ra sẽ lặng lẽ khiến <code>~/.profile</code> không còn được đọc nữa; và mọi thứ có <em>in ra màn hình</em> đều phải nằm dưới cái chốt tương tác trong <code>~/.bashrc</code>, bởi một dòng <code>echo "Welcome back"</code> lạc lên phía trên nó sẽ làm <code>scp</code> và <code>sftp</code> hỏng với lỗi giao thức trong khi đăng nhập tương tác trông vẫn hoàn toàn bình thường.',
          ),
        }),

        // Q39 · 8.3 — bí mật trong Dockerfile
        mcq({
          prompt: B(
            'A Dockerfile contains <code>ENV API_KEY=sk-live-…</code>. The team rotates the key a month later. What is the exposure?',
            'Một Dockerfile chứa dòng <code>ENV API_KEY=sk-live-…</code>. Một tháng sau đội ngũ xoay vòng khoá ấy. Mức phơi bày là gì?',
          ),
          options: [
            B('The old key is baked into an image layer forever: anyone who can pull that image reads it with <code>docker history</code>, and rotating the key does not remove it from any copy of the image that already exists. Secrets belong at <b>run</b> time — <code>-e</code>, <code>--env-file</code>, or a secrets mount', 'Khoá cũ bị nướng vĩnh viễn vào một lớp của ảnh: ai kéo được ảnh đó đều đọc ra bằng <code>docker history</code>, và việc xoay khoá không gỡ nó khỏi bất kỳ bản sao nào của ảnh đã tồn tại. Bí mật thuộc về lúc <b>chạy</b> — <code>-e</code>, <code>--env-file</code>, hoặc một secrets mount'),
            B('None, as long as the registry is private: values set with <code>ENV</code> are stored encrypted in the layer metadata and are decrypted only by the daemon that runs the container, which is why <code>docker history</code> shows them masked', 'Không có, miễn registry là riêng tư: các giá trị đặt bằng <code>ENV</code> được lưu mã hoá trong metadata của lớp và chỉ được daemon chạy container giải mã, và vì thế <code>docker history</code> hiện chúng dưới dạng che'),
            B('None after rotation: layers are addressed by the content hash of the instruction that produced them, so rebuilding with the new key overwrites the old layer in place and every existing copy of the image picks the change up on its next pull', 'Không còn gì sau khi xoay khoá: các lớp được định danh bằng mã băm nội dung của chỉ thị sinh ra chúng, nên dựng lại với khoá mới sẽ ghi đè lớp cũ tại chỗ và mọi bản sao của ảnh sẽ nhận thay đổi ở lần kéo về kế tiếp'),
            B('Only inside a running container: <code>ENV</code> lines are instructions evaluated when the container starts, not data written into the image, so the key exists in memory for the container\'s lifetime and is never stored on disk anywhere', 'Chỉ bên trong một container đang chạy: các dòng <code>ENV</code> là chỉ thị được tính lúc container khởi động chứ không phải dữ liệu ghi vào ảnh, nên cái khoá chỉ tồn tại trong bộ nhớ suốt đời container và không bao giờ được lưu xuống đĩa ở đâu cả'),
          ],
          correct: 0,
          explanation: EX(
            'An image is a stack of immutable layers plus the metadata that built them, and <code>docker history</code> prints that metadata — including every <code>ENV</code> line. Rebuilding creates a <em>new</em> image; it cannot reach into copies already pulled, pushed to a registry, or cached on a build machine. The same is true of <code>ARG</code> passed with <code>--build-arg</code>: it appears in the build history too. The correct place for a secret is at run time, where it lives in the container\'s environment and not in anything distributable. The lesson\'s wider point is worth keeping: environment variables protect a secret from <em>other users</em> on the machine, not from <em>other code running as you</em> — anything in your process can read <code>environ</code>, and a crash reporter that dumps the environment will ship it off-box. On this project, production runtime env lives in <code>/opt/&lt;app&gt;/.env</code> on the VPS, outside the deployment directory, precisely so no deploy can overwrite or leak it.',
            'Một ảnh là một chồng lớp bất biến cộng với phần metadata đã dựng ra chúng, và <code>docker history</code> in ra đúng phần metadata ấy — kể cả mọi dòng <code>ENV</code>. Dựng lại thì tạo ra một ảnh <em>mới</em>; nó không với tới được các bản sao đã kéo về, đã đẩy lên registry, hay đang nằm trong cache của một máy build. Điều đó cũng đúng với <code>ARG</code> truyền qua <code>--build-arg</code>: nó cũng hiện trong lịch sử build. Chỗ đúng cho một bí mật là lúc chạy, nơi nó nằm trong môi trường của container chứ không nằm trong thứ gì phát tán được. Ý rộng hơn của bài học đáng giữ lại: biến môi trường bảo vệ một bí mật khỏi <em>những người dùng khác</em> trên máy, chứ không khỏi <em>mã khác đang chạy với danh nghĩa bạn</em> — bất cứ thứ gì trong tiến trình của bạn đều đọc được <code>environ</code>, và một bộ báo lỗi có kèm dump môi trường sẽ gửi nó ra khỏi máy. Ở dự án này, môi trường chạy thật của production nằm ở <code>/opt/&lt;app&gt;/.env</code> trên VPS, ngoài thư mục deploy, chính là để không lần deploy nào ghi đè hay làm rò nó.',
          ),
        }),

        // ══ Chương 9 — Mạng & máy từ xa ═════════════════════════════════
        // Q40 · 9.2 — curl không có -f
        mcq({
          prompt: B(
            'Real run against a server that returns 404 for that path:' + code(
              '$ curl -s  http://127.0.0.1:8099/missing.json | head -1 ; echo "exit=$?"\n' +
              '&lt;!DOCTYPE HTML&gt;\n' +
              'exit=0\n' +
              '\n' +
              '$ curl -sf http://127.0.0.1:8099/missing.json ; echo "exit=$?"\n' +
              'exit=22',
            ) + '<p>Why does this matter in a script?</p>',
            'Chạy thật với một máy chủ trả 404 cho đường dẫn đó:' + code(
              '$ curl -s  http://127.0.0.1:8099/missing.json | head -1 ; echo "exit=$?"\n' +
              '&lt;!DOCTYPE HTML&gt;\n' +
              'exit=0\n' +
              '\n' +
              '$ curl -sf http://127.0.0.1:8099/missing.json ; echo "exit=$?"\n' +
              'exit=22',
            ) + '<p>Vì sao điều này quan trọng trong một script?</p>',
          ),
          options: [
            B('It does not matter in practice — exiting 0 with a 404 body is harmless, because whatever consumes the output next, whether <code>jq</code>, <code>grep</code> or a JSON parser in the application, will fail on the unexpected content and stop the script for you at that point', 'Trên thực tế không quan trọng — thoát 0 với thân 404 là vô hại, vì thứ tiêu thụ output ở bước sau, dù là <code>jq</code>, <code>grep</code> hay một bộ phân tích JSON trong ứng dụng, đều sẽ hỏng vì nội dung bất ngờ và dừng script hộ bạn ngay tại đó'),
            B('Without <code>-f</code>, curl treats "the HTTP transaction completed" as success and exits 0 even on 404 or 500, printing the error page as if it were data. The script then feeds an HTML error page to <code>jq</code> — and because a pipeline\'s status is the LAST command\'s, the failure can be invisible. <code>-sSf</code> plus <code>set -o pipefail</code> is the habit', 'Không có <code>-f</code> thì curl coi "giao dịch HTTP đã hoàn tất" là thành công và thoát 0 kể cả với 404 hay 500, in trang lỗi ra như thể đó là dữ liệu. Script sau đó đem một trang lỗi HTML nhét vào <code>jq</code> — và vì mã thoát của một ống dẫn là của lệnh CUỐI, cái hỏng có thể vô hình. Thói quen cần có là <code>-sSf</code> cộng với <code>set -o pipefail</code>'),
            B('<code>-f</code> stands for "force" and makes curl retry the request until it either succeeds or exhausts its attempts, which is why the second run had time to establish that the resource really was missing and report a proper failure', '<code>-f</code> là viết tắt của "force", nó khiến curl thử lại yêu cầu cho tới khi thành công hoặc hết số lượt, và vì thế lần chạy thứ hai mới có thời gian xác định rằng tài nguyên đó thật sự không có và báo một thất bại đúng nghĩa'),
            B('The only difference is the printed body, which <code>-f</code> suppresses; both commands exit 0 as far as curl is concerned, and the 22 in the second case is <code>head</code> closing the pipe early and sending SIGPIPE back up the pipeline', 'Khác biệt duy nhất là phần thân được in ra, thứ mà <code>-f</code> chặn lại; xét từ phía curl thì cả hai lệnh đều thoát 0, và số 22 ở trường hợp sau là do <code>head</code> đóng ống dẫn sớm rồi gửi SIGPIPE ngược lên'),
          ],
          correct: 1,
          explanation: EX(
            'Verified, including the exit codes: <code>0</code> without <code>-f</code> and <code>22</code> with it. Curl\'s default view is transport-level — it connected, it spoke HTTP, it got a complete response, so the request succeeded. Whether the response <em>means</em> success is an application question it declines to answer until you ask with <code>-f</code>. In a script the consequences stack: the error page flows into <code>jq</code>, which fails with a confusing parse error about unexpected <code>&lt;</code>, and if that is the middle of a pipeline the status is discarded entirely. <code>-sSf</code> is the muscle memory worth building — <code>-s</code> quiet, <code>-S</code> still show real errors, <code>-f</code> fail on HTTP errors — with <code>--max-time</code> so a hung endpoint cannot pile up processes. Two neighbouring exit codes are worth knowing from the same lesson: <code>7</code> is "connection refused" and <code>28</code> is "timed out", which map onto genuinely different causes (chapter 12).',
            'Đã kiểm, kể cả mã thoát: <code>0</code> khi không có <code>-f</code> và <code>22</code> khi có. Góc nhìn mặc định của curl là ở tầng vận chuyển — nó đã kết nối được, đã nói HTTP, đã nhận một phản hồi hoàn chỉnh, vậy là yêu cầu thành công. Còn phản hồi đó <em>có nghĩa</em> là thành công hay không thì là câu hỏi của ứng dụng, và nó từ chối trả lời cho tới khi bạn hỏi bằng <code>-f</code>. Trong một script, hậu quả chồng lên nhau: trang lỗi chảy vào <code>jq</code>, thứ này hỏng với một thông báo phân tích khó hiểu về ký tự <code>&lt;</code> bất ngờ, và nếu đó là khúc giữa một ống dẫn thì mã thoát bị vứt đi hoàn toàn. <code>-sSf</code> là phản xạ đáng luyện — <code>-s</code> im lặng, <code>-S</code> vẫn hiện lỗi thật, <code>-f</code> thất bại khi HTTP lỗi — kèm <code>--max-time</code> để một endpoint treo không chồng chất tiến trình. Hai mã thoát hàng xóm đáng nhớ trong cùng bài: <code>7</code> là "connection refused" và <code>28</code> là "hết giờ chờ", hai thứ ứng với những nguyên nhân thật sự khác nhau (chương 12).',
          ),
        }),

        // Q41 · 9.4 — rsync dấu gạch chéo cuối
        mcq({
          prompt: B(
            'Real run. Directory <code>A</code> contains <code>f.txt</code> and <code>sub/g.txt</code>.' + code(
              '$ rsync -a A  B1/    ->  B1/A/f.txt   B1/A/sub/g.txt\n' +
              '$ rsync -a A/ B2/    ->  B2/f.txt     B2/sub/g.txt',
            ) + '<p>What does the trailing slash on the SOURCE mean?</p>',
            'Chạy thật. Thư mục <code>A</code> chứa <code>f.txt</code> và <code>sub/g.txt</code>.' + code(
              '$ rsync -a A  B1/    ->  B1/A/f.txt   B1/A/sub/g.txt\n' +
              '$ rsync -a A/ B2/    ->  B2/f.txt     B2/sub/g.txt',
            ) + '<p>Dấu gạch chéo cuối ở phía NGUỒN nghĩa là gì?</p>',
          ),
          options: [
            B('It forces recursion; without it only the top-level files are copied, which is why <code>B1</code> has a nested directory', 'Nó ép đệ quy; không có nó thì chỉ file ở tầng trên cùng được chép, và vì thế <code>B1</code> có một thư mục lồng'),
            B('It marks the destination as a directory rather than a file, so the meaning belongs to the second argument, not the first', 'Nó đánh dấu đích là một thư mục chứ không phải một file, nên ý nghĩa thuộc về tham số thứ hai chứ không phải tham số đầu'),
            B('Without it, rsync copies the directory <b>itself</b> into the destination; with it, rsync copies the <b>contents</b> of the directory. One character decides between <code>B/A/f.txt</code> and <code>B/f.txt</code>', 'Không có nó thì rsync chép <b>chính thư mục</b> vào bên trong đích; có nó thì rsync chép <b>nội dung</b> của thư mục. Một ký tự quyết định giữa <code>B/A/f.txt</code> và <code>B/f.txt</code>'),
            B('It is cosmetic on the source; only the trailing slash on the destination changes anything', 'Ở phía nguồn nó chỉ là hình thức; chỉ dấu gạch chéo cuối ở phía đích mới thay đổi được điều gì'),
          ],
          correct: 2,
          explanation: EX(
            'Verified with <code>find</code> on both destinations, and the paths above are the real listing. This single character is the most common way a deploy lands in the wrong place: <code>rsync -a dist app@host:/srv/app/</code> produces <code>/srv/app/dist/…</code> while <code>rsync -a dist/ app@host:/srv/app/</code> produces <code>/srv/app/…</code>, and the site serves a 404 for everything because the files are one directory too deep. The habit the lesson recommends removes the whole class of bug: run it once with <code>--dry-run</code> and read the paths it prints, exactly as you would <code>find … -print</code> before <code>find … -delete</code>. Three companions worth carrying into a real deploy command: <code>--exclude=\'.env*\'</code> so you never overwrite production environment with local values, <code>--delete-after</code> so deletions happen only once the transfer has succeeded, and <code>--max-delete=50</code> so an empty or wrong source aborts instead of emptying the server.',
            'Đã kiểm bằng <code>find</code> trên cả hai đích, và các đường dẫn ở trên là danh sách thật. Đúng một ký tự này là cách phổ biến nhất khiến một lần deploy đáp xuống sai chỗ: <code>rsync -a dist app@host:/srv/app/</code> cho ra <code>/srv/app/dist/…</code> trong khi <code>rsync -a dist/ app@host:/srv/app/</code> cho ra <code>/srv/app/…</code>, và trang web trả 404 cho mọi thứ vì các file nằm sâu hơn một tầng. Thói quen mà bài học khuyên gỡ bỏ được cả lớp lỗi này: chạy một lượt với <code>--dry-run</code> rồi đọc các đường dẫn nó in ra, đúng như bạn sẽ chạy <code>find … -print</code> trước <code>find … -delete</code>. Ba người bạn đáng mang theo vào một lệnh deploy thật: <code>--exclude=\'.env*\'</code> để không bao giờ ghi đè môi trường production bằng giá trị máy bạn, <code>--delete-after</code> để việc xoá chỉ xảy ra sau khi truyền xong, và <code>--max-delete=50</code> để một nguồn rỗng hay sai thì dừng lại thay vì dọn sạch máy chủ.',
          ),
        }),

        // Q42 · 9.1 + 9.5 — 127.0.0.1 vs 0.0.0.0 và Docker
        mcq({
          prompt: B(
            'On a cloud VPS, <code>sudo ss -tulpn</code> shows this, and <code>ufw status</code> lists only 22, 80 and 443 as allowed. Is the database reachable from the internet?' + code(
              'LISTEN  0  244  0.0.0.0:5432  0.0.0.0:*  users:(("docker-proxy",pid=812,fd=4))',
            ),
            'Trên một VPS đám mây, <code>sudo ss -tulpn</code> hiện ra thế này, và <code>ufw status</code> chỉ liệt kê 22, 80 và 443 là được phép. Cơ sở dữ liệu có với tới được từ internet không?' + code(
              'LISTEN  0  244  0.0.0.0:5432  0.0.0.0:*  users:(("docker-proxy",pid=812,fd=4))',
            ),
          ),
          options: [
            B('No — <code>0.0.0.0</code> in the Local Address column is a placeholder meaning "no interface chosen yet"; the kernel binds the socket to a concrete address only when a client connects, and until then nothing is reachable from outside', 'Không — <code>0.0.0.0</code> ở cột Local Address là một chỗ giữ chỗ nghĩa là "chưa chọn giao diện nào"; kernel chỉ gắn socket vào một địa chỉ cụ thể khi có client kết nối, và trước đó thì bên ngoài không với tới được gì'),
            B('No — <code>ufw</code> has a default-deny policy for anything not explicitly listed, and its rules live in the <code>filter</code> table, which iptables evaluates before any table a container runtime can write to', 'Không — <code>ufw</code> có chính sách mặc định từ chối với mọi thứ không được liệt kê tường minh, và các luật của nó nằm trong bảng <code>filter</code>, thứ mà iptables xét trước mọi bảng mà một runtime container ghi được vào'),
            B('Yes, but only from other containers on the same bridge network, because <code>docker-proxy</code> listens inside the container namespace and forwards only traffic that already arrived on the internal bridge interface', 'Có, nhưng chỉ từ các container khác trên cùng mạng cầu nối, vì <code>docker-proxy</code> lắng nghe bên trong namespace của container và chỉ chuyển tiếp lưu lượng vốn đã tới trên giao diện cầu nội bộ'),
            B('Yes. <code>0.0.0.0</code> means "every interface, including the public one", and Docker writes its published-port rules into a chain that is consulted <b>before</b> ufw\'s — so <code>ufw status</code> looks clean while the world can connect. Bind it as <code>-p 127.0.0.1:5432:5432</code> instead', 'Có. <code>0.0.0.0</code> nghĩa là "mọi giao diện, kể cả giao diện công cộng", và Docker ghi luật cổng đã công bố của nó vào một chuỗi được xét <b>trước</b> chuỗi của ufw — nên <code>ufw status</code> trông sạch sẽ trong khi cả thế giới kết nối được. Hãy gắn nó thành <code>-p 127.0.0.1:5432:5432</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Two of the chapter\'s sharpest edges in one line of output. First, the bind address: <code>127.0.0.1:5432</code> is reachable only from the machine itself, while <code>0.0.0.0:5432</code> is every interface the box has, public ones included. That distinction costs hours in both directions — an app bound to <code>127.0.0.1</code> that a reverse proxy on another host cannot reach, and a development database bound to <code>0.0.0.0</code> that the whole internet can. Second, Docker: publishing a port with <code>-p</code> inserts a rule into the <code>DOCKER</code> chain, which iptables evaluates before the filter chain ufw manages, so ufw\'s view and reality disagree and nothing warns you. The rule the lesson gives: publish nothing to <code>0.0.0.0</code> except the reverse proxy\'s 80 and 443; everything else gets <code>127.0.0.1:</code> in front of the port, or uses <code>expose</code> so only other containers on the network can reach it. Then <code>sudo ss -tulpn | grep \'0.0.0.0\'</code> becomes a thirty-second audit that means something.',
            'Hai cạnh sắc nhất của chương gói trong một dòng output. Thứ nhất, địa chỉ gắn: <code>127.0.0.1:5432</code> chỉ với tới được từ chính cái máy đó, còn <code>0.0.0.0:5432</code> là mọi giao diện mà máy có, kể cả giao diện công cộng. Sự phân biệt ấy ngốn hàng giờ theo cả hai chiều — một ứng dụng gắn vào <code>127.0.0.1</code> mà một reverse proxy ở máy khác không với tới, và một cơ sở dữ liệu phát triển gắn vào <code>0.0.0.0</code> mà cả internet với tới được. Thứ hai, Docker: công bố một cổng bằng <code>-p</code> là chèn một luật vào chuỗi <code>DOCKER</code>, thứ mà iptables xét trước chuỗi filter do ufw quản, nên góc nhìn của ufw và thực tế nói khác nhau mà không có gì cảnh báo. Luật bài học đưa ra: đừng công bố gì ra <code>0.0.0.0</code> ngoài cổng 80 và 443 của reverse proxy; mọi thứ khác phải có <code>127.0.0.1:</code> đứng trước số cổng, hoặc dùng <code>expose</code> để chỉ các container cùng mạng với tới được. Khi đó <code>sudo ss -tulpn | grep \'0.0.0.0\'</code> trở thành một phép rà ba mươi giây có ý nghĩa thật.',
          ),
        }),

        // Q43 · 9.3 — ssh -A vs ProxyJump
        mcq({
          prompt: B(
            'You need to reach a private server that has no public address, through a bastion host. A colleague suggests <code>ssh -A bastion</code> and then <code>ssh private</code> from there. Why does the lesson prefer <code>ProxyJump</code>?',
            'Bạn cần với tới một máy chủ nội bộ không có địa chỉ công cộng, thông qua một máy bastion. Một đồng nghiệp gợi ý <code>ssh -A bastion</code> rồi từ đó <code>ssh private</code>. Vì sao bài học chuộng <code>ProxyJump</code> hơn?',
          ),
          options: [
            B('Because agent forwarding is measurably slower: every signature operation makes a round trip back to your laptop over the first hop, so on a high-latency link each authentication takes noticeably longer and interactive keystrokes on the second hop feel sluggish', 'Vì chuyển tiếp agent chậm hơn thấy rõ: mỗi lần ký là một vòng quay ngược về laptop của bạn qua chặng đầu, nên trên một đường trễ cao thì mỗi lần xác thực lâu hơn hẳn và gõ phím tương tác ở chặng thứ hai cảm giác ì ạch'),
            B('Because <code>-A</code> lets any process on the bastion use your keys while you are connected — root there, or anyone who has compromised it, can authenticate as you to every server your agent holds a key for, leaving no trace on your machine. <code>ProxyJump</code> tunnels <em>through</em> the bastion without exposing the agent to it', 'Vì <code>-A</code> cho phép bất kỳ tiến trình nào trên bastion dùng khoá của bạn trong lúc bạn còn kết nối — root ở đó, hoặc bất cứ ai đã chiếm được nó, đều xác thực được với danh nghĩa bạn tới mọi máy chủ mà agent của bạn giữ khoá, và không để lại dấu vết nào trên máy bạn. <code>ProxyJump</code> đào hầm <em>xuyên qua</em> bastion mà không phơi agent ra cho nó'),
            B('Because <code>-A</code> copies your private key file itself onto the bastion so the second hop can sign with it, and the copy is written under <code>/tmp</code> where it stays on disk after you disconnect unless the session shuts down cleanly', 'Vì <code>-A</code> chép chính file khoá riêng của bạn lên bastion để chặng thứ hai ký được bằng nó, và bản sao ấy được ghi dưới <code>/tmp</code>, nơi nó nằm lại trên đĩa sau khi bạn ngắt kết nối trừ khi phiên đóng lại một cách sạch sẽ'),
            B('Because <code>ProxyJump</code> wraps the second hop in its own encrypted channel, while agent forwarding relays that hop in clear text across the bastion\'s loopback interface, where anyone with <code>tcpdump</code> on that host can read the session', 'Vì <code>ProxyJump</code> bọc chặng thứ hai trong một kênh mã hoá riêng, còn chuyển tiếp agent thì tiếp sức chặng ấy dưới dạng rõ qua giao diện loopback của bastion, nơi bất cứ ai có <code>tcpdump</code> trên máy đó đều đọc được cả phiên'),
          ],
          correct: 1,
          explanation: EX(
            'Agent forwarding does not copy the key (option 3 is the common misconception) — it forwards a <em>socket</em>, so signing still happens on your laptop. That sounds safe and is exactly why it is risky: anyone with root on the intermediate host can use that socket while you are connected, and the servers they reach see your identity, not theirs, with nothing recorded on your side. <code>ProxyJump</code> (<code>ssh -J bastion private</code>, or <code>ProxyJump bastion</code> in <code>~/.ssh/config</code>) opens the connection through the bastion at the transport level, so the private server is authenticated directly by your laptop and the bastion never sees a usable credential. <code>scp</code> and <code>rsync</code> understand it too. If you must forward an agent, forward it only to hosts you administer, and never with <code>ForwardAgent yes</code> under <code>Host *</code>. Two neighbours from the same lesson: <code>ControlMaster</code> makes repeated connections instant, and <code>IdentitiesOnly yes</code> stops SSH offering every key you own to every server and hitting "Too many authentication failures".',
            'Chuyển tiếp agent không chép khoá đi (phương án 3 là hiểu lầm phổ biến) — nó chuyển tiếp một <em>socket</em>, nên việc ký vẫn diễn ra trên laptop của bạn. Nghe thì an toàn, và chính vì thế nó mới nguy hiểm: bất cứ ai có root trên máy trung gian đều dùng được cái socket ấy trong lúc bạn còn kết nối, và các máy chủ họ với tới sẽ thấy danh tính của bạn chứ không phải của họ, mà bên bạn thì không ghi lại gì. <code>ProxyJump</code> (<code>ssh -J bastion private</code>, hoặc dòng <code>ProxyJump bastion</code> trong <code>~/.ssh/config</code>) mở kết nối xuyên qua bastion ở tầng vận chuyển, nên máy chủ nội bộ được chính laptop của bạn xác thực trực tiếp và bastion không bao giờ nhìn thấy một chứng danh dùng được. <code>scp</code> và <code>rsync</code> cũng hiểu nó. Nếu buộc phải chuyển tiếp agent thì chỉ chuyển tới những máy bạn tự quản, và đừng bao giờ đặt <code>ForwardAgent yes</code> dưới <code>Host *</code>. Hai người hàng xóm trong cùng bài: <code>ControlMaster</code> làm các lần kết nối sau tức thì, còn <code>IdentitiesOnly yes</code> ngăn SSH chìa mọi khoá bạn có cho mọi máy chủ rồi đâm vào lỗi "Too many authentication failures".',
          ),
        }),

        // ══ Chương 10 — Đĩa, gói & log ══════════════════════════════════
        // Q44 · 10.1 — rm trên log đang mở
        mcq({
          prompt: B(
            'Real run: a process is writing to a 20 MB log file, still open. The file is deleted, and then:' + code(
              '$ du -sh /tmp/t10\n' +
              '4.0K    /tmp/t10\n' +
              '$ ls -l /proc/*/fd/* | grep deleted\n' +
              'l-wx------ 1 root root 64 /proc/3976/fd/3 -> /tmp/t10/big.log (deleted)',
            ) + '<p>Was 20 MB of disk reclaimed, and what should have been done instead?</p>',
            'Chạy thật: một tiến trình đang ghi vào một file log 20 MB, vẫn đang mở. File bị xoá, rồi:' + code(
              '$ du -sh /tmp/t10\n' +
              '4.0K    /tmp/t10\n' +
              '$ ls -l /proc/*/fd/* | grep deleted\n' +
              'l-wx------ 1 root root 64 /proc/3976/fd/3 -> /tmp/t10/big.log (deleted)',
            ) + '<p>20 MB đĩa đã được thu hồi chưa, và lẽ ra nên làm gì?</p>',
          ),
          options: [
            B('No. <code>rm</code> only removed the name; the inode survives while a process holds it open, so <code>df</code> still shows the space used while <code>du</code> cannot see the file at all. Truncate instead: <code>truncate -s 0 /var/log/app.log</code> — or let <code>logrotate</code> handle it', 'Chưa. <code>rm</code> chỉ gỡ cái tên; inode vẫn sống chừng nào còn một tiến trình giữ nó mở, nên <code>df</code> vẫn báo phần dung lượng đó đang dùng trong khi <code>du</code> không còn nhìn thấy file nữa. Hãy cắt cụt thay vì xoá: <code>truncate -s 0 /var/log/app.log</code> — hoặc để <code>logrotate</code> lo'),
            B('Yes. <code>du</code> reporting 4.0K for the directory proves the blocks are back in the free list; the entry under <code>/proc</code> is only a stale symlink that the kernel garbage-collects lazily and it does not correspond to any allocated space', 'Rồi. Việc <code>du</code> báo thư mục còn 4,0K chứng tỏ các block đã trở lại danh sách rỗi; mục dưới <code>/proc</code> chỉ là một symlink cũ mà kernel dọn dần, và nó không ứng với phần dung lượng nào đang được cấp phát'),
            B('Yes, but only once <code>sync</code> has flushed the pending metadata; until that happens both <code>df</code> and <code>du</code> report numbers left over from before the deletion, which is why the two commands can disagree for a few seconds', 'Rồi, nhưng phải đợi <code>sync</code> xả xong phần metadata đang chờ; trước lúc đó cả <code>df</code> lẫn <code>du</code> đều báo những con số còn sót từ trước khi xoá, và vì thế hai lệnh có thể nói khác nhau trong vài giây'),
            B('No, and the only remedy is to reboot the machine, because an inode that has been unlinked while still open cannot be released by any means while the system is running — the kernel has no interface for forcing a descriptor closed', 'Chưa, và cách chữa duy nhất là khởi động lại máy, vì một inode đã bị gỡ liên kết trong lúc còn mở thì không cách nào giải phóng được khi hệ thống đang chạy — kernel không có giao diện nào để ép đóng một descriptor'),
          ],
          correct: 0,
          explanation: EX(
            'Verified: after the <code>rm</code>, <code>du</code> reported 4.0K for the directory while <code>/proc/3976/fd/3</code> still pointed at <code>/tmp/t10/big.log (deleted)</code>. This is the inode model from lesson 2.4 doing exactly what it says: <code>rm</code> calls <code>unlink()</code>, which removes a name and decrements the link count, and the data is freed only when the count reaches zero <b>and</b> no process holds the file open. The writer keeps writing into a file nobody can read any more, and the space stays gone. That is also the explanation for the classic "<code>df</code> says 75 GB used, <code>du</code> totals 40 GB" gap: <code>ls -l /proc/*/fd/* 2>/dev/null | grep deleted</code> finds every case on the machine, and restarting that one process frees the space without a reboot. <code>truncate -s 0</code> is the correct move on a live log — it frees the bytes immediately, keeps the inode, and the writer carries on with no reload and no gap.',
            'Đã kiểm: sau lệnh <code>rm</code>, <code>du</code> báo thư mục còn 4,0K trong khi <code>/proc/3976/fd/3</code> vẫn trỏ vào <code>/tmp/t10/big.log (deleted)</code>. Đây là mô hình inode ở bài 2.4 đang làm đúng những gì nó nói: <code>rm</code> gọi <code>unlink()</code>, tức gỡ một cái tên và giảm số liên kết, và dữ liệu chỉ được giải phóng khi con số ấy về không <b>và</b> không tiến trình nào còn giữ file mở. Bên ghi vẫn ghi tiếp vào một file không ai đọc được nữa, còn dung lượng thì mất luôn. Đó cũng là lời giải thích cho khoảng vênh kinh điển "<code>df</code> bảo dùng 75 GB, <code>du</code> cộng lại chỉ 40 GB": <code>ls -l /proc/*/fd/* 2>/dev/null | grep deleted</code> tìm ra mọi ca như vậy trên máy, và khởi động lại đúng một tiến trình đó là giải phóng được chỗ mà không cần khởi động lại máy. <code>truncate -s 0</code> mới là nước đi đúng với một file log đang sống — nó trả lại byte ngay lập tức, giữ nguyên inode, và bên ghi chạy tiếp mà không cần nạp lại, không đứt quãng.',
          ),
        }),

        // Q45 · 10.1 — df -i
        mcq({
          prompt: B(
            'A server refuses every write with "No space left on device", but <code>df -h</code> shows the filesystem at 42% used. What should you check first, and what is the likely cause?',
            'Một máy chủ từ chối mọi lệnh ghi với "No space left on device", nhưng <code>df -h</code> lại cho thấy hệ thống file mới dùng 42%. Bạn nên kiểm gì trước, và nguyên nhân nhiều khả năng là gì?',
          ),
          options: [
            B('Check <code>du -sh /</code> instead — <code>df</code> reads the superblock, which is unreliable on overlay and network filesystems where the accounting is maintained by a layer above the kernel, while <code>du</code> walks the tree and gives the real figure', 'Kiểm <code>du -sh /</code> thay vào đó — <code>df</code> đọc superblock, thứ không đáng tin trên các hệ thống file overlay và hệ thống file mạng nơi việc hạch toán do một tầng phía trên kernel giữ, còn <code>du</code> thì duyệt cả cây và cho con số thật'),
            B('Check the swap file — once swap is exhausted the kernel starts returning ENOSPC for ordinary writes as well, because dirty pages can no longer be parked anywhere, and <code>df -h</code> knows nothing about swap so it keeps looking healthy', 'Kiểm file swap — một khi swap cạn thì kernel bắt đầu trả về ENOSPC cho cả những lệnh ghi thông thường, bởi các trang bẩn không còn chỗ nào để gửi tạm, mà <code>df -h</code> lại không biết gì về swap nên nó vẫn trông khoẻ mạnh'),
            B('Check <code>df -i</code>: the filesystem has run out of <b>inodes</b>, not bytes. Millions of tiny files — a session directory, a mail queue, a cache — exhaust the fixed inode table while using almost no space, and <code>df -h</code> keeps looking healthy. The fix is deleting many files, not a few large ones', 'Kiểm <code>df -i</code>: hệ thống file đã hết <b>inode</b>, không phải hết byte. Hàng triệu file tí hon — một thư mục phiên, một hàng đợi thư, một cache — làm cạn bảng inode cố định trong khi gần như không tốn dung lượng, và <code>df -h</code> vẫn trông khoẻ mạnh. Cách chữa là xoá thật nhiều file, không phải xoá vài file lớn'),
            B('Check the permissions and mount options on the mount point — 42% used means the disk itself is fine, so this is a read-only remount or a permission error that the C library reports with the closest matching errno, which happens to be ENOSPC', 'Kiểm quyền và các tuỳ chọn gắn kết trên điểm gắn — dùng 42% nghĩa là bản thân cái đĩa vẫn ổn, nên đây là một lần gắn lại ở chế độ chỉ đọc hoặc một lỗi quyền mà thư viện C báo bằng errno gần đúng nhất, và số đó tình cờ là ENOSPC'),
          ],
          correct: 2,
          explanation: EX(
            'Whenever a write fails with "no space" and <code>df -h</code> looks fine, <code>df -i</code> is the next command, and it takes one second. An ext4 filesystem allocates its inode table when it is created; each file, directory and symlink consumes one entry regardless of size, so a runaway process writing millions of 40-byte session files can hit <code>IUse% 100</code> while <code>Use%</code> sits below half. Deleting a few large files reclaims bytes and changes nothing — you have to delete <em>many files</em>, or recreate the filesystem with a higher inode count. This is a case where <code>df -h</code> actively misleads, which is why the lesson says to make <code>df -i</code> part of the reflex. The neighbouring cause worth knowing is the opposite gap: <code>df</code> reporting far more used than <code>du</code> totals usually means a deleted-but-open file, or a filesystem mounted over a directory that still holds data underneath.',
            'Bất cứ khi nào một lệnh ghi hỏng với "no space" mà <code>df -h</code> trông vẫn ổn thì lệnh tiếp theo là <code>df -i</code>, và nó mất một giây. Một hệ thống file ext4 cấp phát bảng inode ngay lúc nó được tạo ra; mỗi file, thư mục và symlink chiếm một mục bất kể kích thước, nên một tiến trình mất kiểm soát ghi ra hàng triệu file phiên 40 byte có thể chạm <code>IUse% 100</code> trong khi <code>Use%</code> còn chưa tới một nửa. Xoá vài file lớn thì thu hồi được byte và chẳng thay đổi gì — bạn phải xoá <em>thật nhiều file</em>, hoặc tạo lại hệ thống file với số inode cao hơn. Đây là một ca mà <code>df -h</code> chủ động đánh lừa, và vì thế bài học bảo hãy đưa <code>df -i</code> vào phản xạ. Nguyên nhân hàng xóm đáng biết là khoảng vênh ngược lại: <code>df</code> báo dùng nhiều hơn hẳn tổng của <code>du</code> thì thường nghĩa là có file đã xoá mà còn mở, hoặc có một hệ thống file được gắn đè lên một thư mục vốn đã có dữ liệu bên dưới.',
          ),
        }),

        // Q46 · 10.3 — logrotate
        mcq({
          prompt: B(
            'After adding a <code>logrotate</code> rule for your own application, the rotation happens on schedule but <code>app.log</code> stays empty forever while <code>app.log.1</code> keeps growing. What is wrong?',
            'Sau khi thêm một luật <code>logrotate</code> cho ứng dụng của chính bạn, việc xoay vòng diễn ra đúng lịch nhưng <code>app.log</code> mãi mãi rỗng còn <code>app.log.1</code> thì cứ phình to. Sai ở đâu?',
          ),
          options: [
            B('<code>logrotate</code> ran as the wrong user, so the fresh <code>app.log</code> it created is owned by root with no write permission for your application; the writes are being refused and the application is falling back to appending to the file it still has open', '<code>logrotate</code> chạy bằng sai người dùng, nên file <code>app.log</code> mới mà nó tạo ra thuộc về root và ứng dụng của bạn không có quyền ghi; các lệnh ghi bị từ chối và ứng dụng lùi về nối tiếp vào file nó vẫn còn mở'),
            B('The <code>compress</code> directive is missing from the rule, and without it logrotate never finalises the rotated file, so it stays open in append mode and the application keeps writing into it while the new file waits unused', 'Luật thiếu chỉ thị <code>compress</code>, và không có nó thì logrotate không bao giờ hoàn tất file đã xoay, nên file ấy vẫn mở ở chế độ nối thêm và ứng dụng cứ ghi vào đó trong khi file mới nằm không'),
            B('The rotation interval is shorter than the application\'s own log flush interval, so every buffered line is written after the rename has happened and lands in the previous file; lengthening the interval or shortening the flush would line them up again', 'Chu kỳ xoay vòng ngắn hơn chu kỳ xả đệm log của chính ứng dụng, nên mọi dòng trong bộ đệm đều được ghi sau khi việc đổi tên đã xảy ra và rơi vào file trước đó; kéo dài chu kỳ hoặc rút ngắn nhịp xả là chúng khớp lại'),
            B('Rotation renames the file, and a process that already has it open keeps writing into the same <b>inode</b> — now called <code>app.log.1</code>. The rule needs a <code>postrotate</code> block that signals the app to reopen its log (or <code>copytruncate</code>, at the cost of a small race) — or the app should log to stdout and let journald handle it', 'Xoay vòng là đổi tên file, và một tiến trình đã mở sẵn file đó sẽ tiếp tục ghi vào đúng <b>inode</b> cũ — giờ mang tên <code>app.log.1</code>. Luật cần một khối <code>postrotate</code> ra tín hiệu cho ứng dụng mở lại file log của nó (hoặc dùng <code>copytruncate</code>, đổi lại là một khe hở nhỏ) — hoặc ứng dụng nên ghi log ra stdout và để journald lo'),
          ],
          correct: 3,
          explanation: EX(
            'Same inode model as question 44, one layer up. A process does not hold a <em>filename</em> open, it holds a file descriptor pointing at an inode, and <code>mv app.log app.log.1</code> changes only the name in the directory. The application never notices, so the new empty <code>app.log</code> that logrotate creates is written to by nobody. <code>postrotate</code> fixes it properly: it runs a command after the rename — typically <code>systemctl reload</code>, or <code>kill -USR1</code> for nginx — that tells the process to close and reopen its log by name. <code>copytruncate</code> avoids the question by copying the contents and truncating the original in place, at the cost of losing whatever is written between the copy and the truncate. Well-behaved daemons handle <code>SIGHUP</code> or <code>SIGUSR1</code> for exactly this reason; the modern alternative is to log to stdout and let <code>systemd</code> capture it, at which point rotation is <code>SystemMaxUse</code> in <code>journald.conf</code> and the whole problem disappears.',
            'Vẫn là mô hình inode của câu 44, chỉ dịch lên một tầng. Một tiến trình không giữ một <em>tên file</em>, nó giữ một file descriptor trỏ vào một inode, và <code>mv app.log app.log.1</code> chỉ đổi cái tên trong thư mục. Ứng dụng không hề hay biết, nên file <code>app.log</code> rỗng mà logrotate vừa tạo ra chẳng có ai ghi vào. <code>postrotate</code> sửa đúng cách: nó chạy một lệnh sau khi đổi tên — thường là <code>systemctl reload</code>, hoặc <code>kill -USR1</code> với nginx — để bảo tiến trình đóng rồi mở lại file log theo tên. <code>copytruncate</code> né câu hỏi bằng cách chép nội dung ra rồi cắt cụt file gốc tại chỗ, đổi lại là mất những gì được ghi trong khoảng giữa lúc chép và lúc cắt. Các daemon viết tử tế đều xử lý <code>SIGHUP</code> hoặc <code>SIGUSR1</code> chính vì lẽ đó; phương án hiện đại là ghi log ra stdout và để <code>systemd</code> hứng, khi ấy việc xoay vòng chỉ còn là <code>SystemMaxUse</code> trong <code>journald.conf</code> và cả bài toán biến mất.',
          ),
        }),

        // ══ Chương 11 — systemd & cron ══════════════════════════════════
        // Q47 · 11.1 — daemon-reload
        mcq({
          prompt: B(
            'You edit <code>/etc/systemd/system/myapp.service</code> to add <code>Environment=NODE_ENV=production</code>, then run <code>systemctl restart myapp</code>. The service comes up with the old environment. You edit again, restart again, same result. What is missing?',
            'Bạn sửa <code>/etc/systemd/system/myapp.service</code> để thêm <code>Environment=NODE_ENV=production</code>, rồi chạy <code>systemctl restart myapp</code>. Dịch vụ lên với môi trường cũ. Bạn sửa lại, khởi động lại, vẫn thế. Thiếu cái gì?',
          ),
          options: [
            B('<code>sudo systemctl daemon-reload</code>. systemd caches unit files in memory, so <code>restart</code> starts the definition it already had — the symptom is indistinguishable from "my change does not work", which is why this is the most common systemd mistake', '<code>sudo systemctl daemon-reload</code>. systemd giữ các file unit trong bộ nhớ đệm, nên <code>restart</code> khởi động lại đúng cái định nghĩa nó đang có sẵn — triệu chứng không phân biệt được với "thay đổi của tôi không ăn", và vì thế đây là lỗi systemd phổ biến nhất'),
            B('<code>systemctl enable myapp</code> — a unit that has never been enabled is started from the copy systemd snapshotted at boot rather than from the file on disk, and enabling it is what registers the current version with the manager', '<code>systemctl enable myapp</code> — một unit chưa từng được bật thì được khởi động từ bản mà systemd chụp lại lúc máy lên chứ không phải từ file trên đĩa, và bật nó chính là thao tác đăng ký phiên bản hiện tại với trình quản lý'),
            B('A reboot: <code>Environment=</code> directives are read by PID 1 only during early boot, before the filesystem is remounted read-write, so a value added afterwards cannot take effect until the machine starts again', 'Khởi động lại máy: các chỉ thị <code>Environment=</code> chỉ được PID 1 đọc trong giai đoạn khởi động sớm, trước khi hệ thống file được gắn lại ở chế độ đọc-ghi, nên một giá trị thêm vào sau đó không thể có hiệu lực cho tới lần máy lên kế tiếp'),
            B('Nothing is missing; <code>Environment=</code> is not a valid directive in a service unit and systemd ignores unknown keys silently, so the value has to be placed in <code>/etc/environment</code> or passed through an <code>EnvironmentFile=</code> instead', 'Không thiếu gì cả; <code>Environment=</code> không phải một chỉ thị hợp lệ trong unit dịch vụ và systemd lặng lẽ bỏ qua các khoá lạ, nên giá trị đó phải đặt vào <code>/etc/environment</code> hoặc truyền qua một dòng <code>EnvironmentFile=</code>'),
          ],
          correct: 0,
          explanation: EX(
            'systemd parses unit files once and keeps them in memory; nothing on disk is re-read until you ask. <code>daemon-reload</code> is that ask, and forgetting it produces exactly this loop — edit, restart, no change, conclude the directive is being ignored, edit differently, repeat. Make it part of the muscle memory: edit, <code>daemon-reload</code>, <code>restart</code>, then <code>systemctl status</code> to confirm. Three companions from the same lesson worth carrying: <code>systemctl cat myapp</code> prints the unit as systemd currently understands it, including drop-ins, which is the fastest way to see whether your edit is live; never edit a unit that came from a package — put a drop-in in <code>/etc/systemd/system/&lt;unit&gt;.d/</code> so the next <code>apt upgrade</code> cannot replace it; and <code>enabled</code> and <code>active</code> are independent, so a service can be running now and still not come back after a 4am reboot.',
            'systemd phân tích các file unit một lần rồi giữ chúng trong bộ nhớ; không có gì trên đĩa được đọc lại cho tới khi bạn yêu cầu. <code>daemon-reload</code> chính là lời yêu cầu ấy, và quên nó thì sinh ra đúng cái vòng lặp này — sửa, khởi động lại, không đổi gì, kết luận rằng chỉ thị đó bị lờ đi, sửa theo kiểu khác, lặp lại. Hãy biến nó thành phản xạ: sửa, <code>daemon-reload</code>, <code>restart</code>, rồi <code>systemctl status</code> để xác nhận. Ba người bạn trong cùng bài đáng mang theo: <code>systemctl cat myapp</code> in ra unit đúng như systemd đang hiểu, kể cả các drop-in, và đó là cách nhanh nhất để biết thay đổi của bạn đã sống chưa; đừng bao giờ sửa một unit đến từ một gói phần mềm — hãy đặt một drop-in vào <code>/etc/systemd/system/&lt;unit&gt;.d/</code> để lần <code>apt upgrade</code> sau không thay mất nó; và <code>enabled</code> với <code>active</code> là hai chuyện độc lập, nên một dịch vụ có thể đang chạy ngay lúc này mà vẫn không trở lại sau một lần khởi động lại lúc 4 giờ sáng.',
          ),
        }),

        // Q48 · 11.2 — cron spec
        mcq({
          prompt: B(
            'Two crontab lines, one character apart. How often does each run?' + code(
              '0 */6 * * *  /usr/local/bin/backup     # A\n' +
              '*/6 * * * *  /usr/local/bin/backup     # B',
            ),
            'Hai dòng crontab, cách nhau một ký tự. Mỗi dòng chạy bao nhiêu lần?' + code(
              '0 */6 * * *  /usr/local/bin/backup     # A\n' +
              '*/6 * * * *  /usr/local/bin/backup     # B',
            ),
          ),
          options: [
            B('A runs every 6 minutes, B runs 4 times a day — the fields are minute-last, so the leading <code>0</code> in A is the hour', 'A chạy mỗi 6 phút, B chạy 4 lần một ngày — các trường xếp phút ở cuối, nên số <code>0</code> đứng đầu ở A là giờ'),
            B('Both run four times a day; <code>*/6</code> means "every 6 hours" in either position', 'Cả hai chạy bốn lần một ngày; <code>*/6</code> nghĩa là "mỗi 6 tiếng" ở vị trí nào cũng vậy'),
            B('A is "minute 0 of every 6th hour" — 4 times a day. B is "every 6th minute of every hour" — 240 times a day. The five fields are minute, hour, day-of-month, month, day-of-week', 'A là "phút 0 của mỗi 6 tiếng" — 4 lần một ngày. B là "mỗi phút thứ 6 của mọi giờ" — 240 lần một ngày. Năm trường lần lượt là phút, giờ, ngày trong tháng, tháng, thứ trong tuần'),
            B('A is invalid — a step value is not allowed in the hour field — and B runs hourly', 'A không hợp lệ — trường giờ không cho phép giá trị bước nhảy — còn B chạy mỗi tiếng'),
          ],
          correct: 2,
          explanation: EX(
            'One character apart, forty times the load — and a backup script that suddenly runs 240 times a day will fill a disk or hammer a database before anyone reads a log. The five fields are minute, hour, day-of-month, month, day-of-week; a bare <code>*</code> means every value, and <code>*/n</code> means every nth value <em>within that field</em>. Read a schedule line out loud before trusting it, or paste it into <code>systemd-analyze calendar</code>. Three more things the lesson insists on, all of which cause "it works by hand but not on a schedule": cron runs with a minimal environment and a <code>PATH</code> of roughly <code>/usr/bin:/bin</code>, so use absolute paths or set <code>PATH</code> at the top of the script; <code>&gt;/dev/null 2&gt;&amp;1</code> is how monitoring dies, because it throws away the error along with the noise; and two copies of a slow job will eventually overlap, so wrap it in <code>flock</code>. For a systemd timer, the equivalent trap is enabling the <code>.service</code> instead of the <code>.timer</code> — that makes it run once at every boot and never again.',
            'Cách nhau một ký tự, gấp bốn mươi lần tải — và một script sao lưu đột nhiên chạy 240 lần một ngày sẽ làm đầy đĩa hoặc quần cho cơ sở dữ liệu tơi tả trước khi có ai kịp đọc log. Năm trường lần lượt là phút, giờ, ngày trong tháng, tháng, thứ trong tuần; một dấu <code>*</code> trơ trọi nghĩa là mọi giá trị, còn <code>*/n</code> nghĩa là mỗi giá trị thứ n <em>trong chính trường đó</em>. Hãy đọc to một dòng lịch lên trước khi tin nó, hoặc dán nó vào <code>systemd-analyze calendar</code>. Ba điều nữa mà bài học nhấn mạnh, tất cả đều gây ra chuyện "gõ tay thì chạy mà theo lịch thì không": cron chạy với một môi trường tối giản và một <code>PATH</code> đại khái là <code>/usr/bin:/bin</code>, nên hãy dùng đường dẫn tuyệt đối hoặc đặt <code>PATH</code> ở đầu script; <code>&gt;/dev/null 2&gt;&amp;1</code> là cách giám sát chết đi, vì nó vứt cả lỗi lẫn tiếng ồn; và hai bản của một job chạy chậm rồi sẽ có lúc chồng lên nhau, nên hãy bọc nó trong <code>flock</code>. Với một timer của systemd, cái bẫy tương đương là bật <code>.service</code> thay vì bật <code>.timer</code> — làm thế thì nó chạy một lần mỗi khi máy khởi động rồi thôi hẳn.',
          ),
        }),

        // ══ Chương 12 — Chẩn đoán máy chủ ═══════════════════════════════
        // Q49 · 12.2 — refused vs timeout
        mcq({
          prompt: B(
            'Two health checks from the same laptop, both real:' + code(
              '$ curl -s --max-time 3 http://host-a:8098/ ; echo "exit=$?"   ->  exit=7\n' +
              '$ curl -s --max-time 3 http://host-b:80/   ; echo "exit=$?"   ->  exit=28',
            ) + '<p>What do the two results tell you, and where should you look first in each case?</p>',
            'Hai phép kiểm sức khoẻ từ cùng một laptop, cả hai đều thật:' + code(
              '$ curl -s --max-time 3 http://host-a:8098/ ; echo "exit=$?"   ->  exit=7\n' +
              '$ curl -s --max-time 3 http://host-b:80/   ; echo "exit=$?"   ->  exit=28',
            ) + '<p>Hai kết quả đó nói lên điều gì, và mỗi trường hợp nên nhìn vào đâu trước?</p>',
          ),
          options: [
            B('Both mean the same thing — the service on the other end is down — and the only difference is how long curl was willing to wait before giving up, which depends on the route and on whether the DNS answer was already cached locally', 'Cả hai nghĩa như nhau — dịch vụ ở đầu bên kia đã chết — và khác biệt duy nhất là curl chịu chờ bao lâu trước khi bỏ cuộc, thứ phụ thuộc vào đường đi và vào việc câu trả lời DNS đã nằm sẵn trong cache cục bộ hay chưa'),
            B('Exit 7 is <b>refused</b>: the packet arrived and something actively said "nothing is listening here", so the host is up and reachable and the problem is the service — check <code>ss -tulpn</code> and the unit. Exit 28 is a <b>timeout</b>: no answer at all, which points at a firewall, a security group or a wrong address, because a filtered packet is dropped silently', 'Mã 7 là <b>bị từ chối</b>: gói tin đã tới nơi và có thứ gì đó chủ động nói "ở đây không có ai lắng nghe", nên máy vẫn sống và với tới được, còn vấn đề nằm ở dịch vụ — hãy kiểm <code>ss -tulpn</code> và unit. Mã 28 là <b>hết giờ chờ</b>: không có câu trả lời nào cả, và điều đó chỉ về tường lửa, một security group, hoặc một địa chỉ sai, vì một gói tin bị lọc thì bị vứt lặng lẽ'),
            B('Exit 7 means the name could not be resolved and exit 28 means the TLS handshake never completed; both failures happen before curl has spoken to the application at all, so neither result says anything about whether the remote service is healthy', 'Mã 7 nghĩa là không phân giải được tên còn mã 28 nghĩa là cái bắt tay TLS không bao giờ hoàn tất; cả hai đều hỏng trước khi curl kịp nói chuyện với ứng dụng, nên không kết quả nào nói được gì về việc dịch vụ ở đầu kia có khoẻ hay không'),
            B('Exit 28 is the more benign of the two: a timeout means the server is merely slow, so retrying with a longer <code>--max-time</code> is the correct first step', 'Mã 28 là cái lành hơn trong hai: hết giờ chờ nghĩa là máy chủ chỉ chậm thôi, nên thử lại với <code>--max-time</code> dài hơn là bước đầu tiên đúng đắn'),
          ],
          correct: 1,
          explanation: EX(
            'Verified: a port with nothing listening on a reachable host gave exit 7 in milliseconds; a blackhole address gave exit 28 after the full three seconds. Telling these two apart is the single most useful distinction in the diagnosis chapter, because they point in opposite directions. <b>Refused</b> means the TCP handshake got an RST — the network worked end to end, and the machine is up; you are now debugging a process, so <code>sudo ss -tulpn</code> and <code>systemctl status</code>. <b>Timed out</b> means nothing came back at all, which is what a firewall does with a filtered packet by design, so you are debugging the path: a cloud security group, a network ACL, <code>ufw</code>, or simply the wrong host. The lesson\'s follow-up is to run <code>tcpdump</code> on the server — if the SYN never appears while a client is actively trying, the block is upstream and no amount of local firewall configuration will change it.',
            'Đã kiểm: một cổng không có ai lắng nghe trên một máy với tới được cho mã 7 trong vài mili giây; một địa chỉ hố đen cho mã 28 sau trọn ba giây. Phân biệt được hai cái này là sự phân biệt hữu ích nhất trong cả chương chẩn đoán, bởi chúng chỉ về hai hướng ngược nhau. <b>Bị từ chối</b> nghĩa là cái bắt tay TCP nhận được một gói RST — mạng đã thông suốt từ đầu này tới đầu kia, và cái máy vẫn sống; giờ bạn đang gỡ lỗi một tiến trình, nên hãy dùng <code>sudo ss -tulpn</code> và <code>systemctl status</code>. <b>Hết giờ chờ</b> nghĩa là chẳng có gì quay về cả, mà đó đúng là điều một tường lửa cố ý làm với một gói tin bị lọc, nên bạn đang gỡ lỗi con đường: một security group của nhà cung cấp đám mây, một ACL mạng, <code>ufw</code>, hay đơn giản là sai địa chỉ máy. Bước tiếp theo bài học đưa ra là chạy <code>tcpdump</code> trên máy chủ — nếu gói SYN không bao giờ xuất hiện trong lúc một client đang cố kết nối thì chỗ chặn nằm ở phía trên, và cấu hình tường lửa cục bộ bao nhiêu cũng vô ích.',
          ),
        }),

        // Q50 · 12.4 — 404 = build cũ
        mcq({
          prompt: B(
            'A new API route was deployed. In the browser it 404s. From the server, an unauthenticated <code>curl</code> against the running backend gives:' + code(
              '$ curl -s -o /dev/null -w \'%{http_code}\\n\' http://127.0.0.1:3000/api/v1/gifs\n' +
              '404\n' +
              '$ curl -s -o /dev/null -w \'%{http_code}\\n\' http://127.0.0.1:3000/api/v1/messages/threads\n' +
              '401',
            ) + '<p>What do those two numbers prove?</p>',
            'Một route API mới vừa được deploy. Trên trình duyệt nó trả 404. Từ phía máy chủ, một lệnh <code>curl</code> không xác thực nhắm vào backend đang chạy cho ra:' + code(
              '$ curl -s -o /dev/null -w \'%{http_code}\\n\' http://127.0.0.1:3000/api/v1/gifs\n' +
              '404\n' +
              '$ curl -s -o /dev/null -w \'%{http_code}\\n\' http://127.0.0.1:3000/api/v1/messages/threads\n' +
              '401',
            ) + '<p>Hai con số đó chứng minh điều gì?</p>',
          ),
          options: [
            B('Nothing conclusive yet — a well-behaved API hides protected routes from anonymous callers by returning 404 rather than 401, so an unauthenticated request cannot tell a missing route from a protected one and you have to log in and retry with a token', 'Chưa kết luận được gì — một API viết tử tế sẽ giấu các route được bảo vệ khỏi người gọi ẩn danh bằng cách trả 404 thay vì 401, nên một yêu cầu không xác thực thì không phân biệt được route thiếu với route được bảo vệ, và bạn phải đăng nhập rồi thử lại kèm token'),
            B('That authentication is what broke: a 401 coming back from a route which should have been reachable means the session middleware is now rejecting every request, and the 404 on the other route is the same middleware failing earlier in the chain', 'Rằng chính phần xác thực đã hỏng: một mã 401 quay về từ một route lẽ ra với tới được nghĩa là middleware phiên giờ đang từ chối mọi yêu cầu, còn mã 404 ở route kia là cũng middleware ấy hỏng sớm hơn trong chuỗi'),
            B('That the browser is at fault — a service worker cached the 404 from before the route existed and keeps replaying it, which is why a request made from the server looks the same; a hard refresh with the cache disabled will clear it', 'Rằng lỗi ở trình duyệt — một service worker đã lưu đệm mã 404 từ hồi route chưa tồn tại và cứ phát lại nó, và đó là lý do một yêu cầu gửi từ máy chủ trông cũng y vậy; tải lại kiểu cứng với cache tắt là xong'),
            B('That the process is alive and routing normally (the 401 proves the router is mounted and asking for auth), but the new route does not exist in the code it is executing — a stale or partial build. Rebuild and redeploy properly rather than debugging the route', 'Rằng tiến trình vẫn sống và định tuyến bình thường (mã 401 chứng tỏ router đã được gắn và đang đòi xác thực), nhưng route mới không tồn tại trong đoạn mã nó đang chạy — một bản build cũ hoặc dở dang. Hãy dựng lại và deploy lại cho tử tế thay vì đi gỡ lỗi cái route'),
          ],
          correct: 3,
          explanation: EX(
            'The 401 is the control. It proves the process is up, the HTTP server is answering, and the router is mounted and doing its job — so the 404 next to it is not a network, proxy or auth problem, it is the running code not containing that route. That is the signature of a stale or partial build: the file exists on disk, the deploy reported success, and the process is executing an older image. This project has the incident in its own history — a GIF picker "broken" for a day because production ran a <code>dist/index.js</code> that never mounted <code>/api/v1/gifs</code>, diagnosed in seconds once someone ran the unauthenticated <code>curl</code> instead of looking at the browser. The rule the lesson gives: <b>401 or 200 means mounted, 404 means not in the running process</b>. Use <code>curl</code>, not the browser, which adds caches, service workers and cookies to a question that has a one-word answer.',
            'Mã 401 chính là phép đối chứng. Nó chứng minh tiến trình vẫn sống, máy chủ HTTP vẫn trả lời, và router đã được gắn và đang làm việc — nên mã 404 nằm cạnh nó không phải chuyện mạng, proxy hay xác thực, mà là chuyện đoạn mã đang chạy không chứa cái route đó. Đó là dấu hiệu đặc trưng của một bản build cũ hoặc dở dang: file có trên đĩa, lần deploy báo thành công, còn tiến trình thì đang chạy một ảnh cũ hơn. Chính dự án này có sự cố ấy trong lịch sử của mình — bộ chọn ảnh GIF "hỏng" suốt một ngày vì production chạy một file <code>dist/index.js</code> chưa từng gắn <code>/api/v1/gifs</code>, và chẩn đoán ra trong vài giây ngay khi có người chạy lệnh <code>curl</code> không xác thực thay vì ngồi nhìn trình duyệt. Luật bài học đưa ra: <b>401 hoặc 200 nghĩa là đã gắn, 404 nghĩa là không có trong tiến trình đang chạy</b>. Hãy dùng <code>curl</code>, đừng dùng trình duyệt, thứ thêm cache, service worker và cookie vào một câu hỏi vốn chỉ cần một từ để trả lời.',
          ),
        }),
      ],
    },
  ],
};
