/**
 * Linux & Bash — Progress Test 2 (chương 5–8).
 *
 * Đề tự soạn, bám sát `content/courses/linux-bash/s05-tien-trinh-tin-hieu.mjs`,
 * `s06-bien-nhay-khai-trien.mjs`, `s07-viet-script-production.mjs` và
 * `s08-moi-truong-path.mjs`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay
 * trong phòng thi.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ MỌI TRANSCRIPT TRONG ĐỀ ĐỀU CHẠY THẬT TRÊN LINUX — KHÔNG PHẢI macOS
 * ────────────────────────────────────────────────────────────────────────────
 * Ảnh nền và phiên bản công cụ đã dùng để đo:
 *
 *   docker run debian:12  (Debian GNU/Linux 12.15, linux/amd64)
 *   bash 5.2.15(1)-release · GNU coreutils 9.1 · GNU grep 3.8 · GNU sed 4.9
 *   · GNU findutils 4.9.0 · gawk 5.2.1 (/usr/bin/awk → gawk) · systemd 252
 *   · procps (ps/pgrep/top) · iproute2 · curl · dash 0.5.12 làm /bin/sh
 *
 * Máy soạn đề là macOS 26.6 (bash 3.2.57, coreutils/sed/awk bản BSD). Không có
 * một dòng output nào trong đề này được chép từ đó: `ps` của macOS là bản BSD,
 * `/proc` không tồn tại, `/bin/sh` không phải dash, và bash 3.2 thiếu hẳn
 * `${x^^}`, `declare -A`, `mapfile`. Đo ở đó rồi chép vào đây là cách chắc
 * chắn để phát đề sai.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BA CHỖ MÁY KHÁC GIÁO TRÌNH (đo 10/09/2026 — ĐỀ THEO MÁY)
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. Bài 7.1 nói `/bin/sh` trên Debian là dash nên "không có `[[ ]]`, không có
 *    mảng, KHÔNG CÓ `local`, không có `${var^^}`". Ba cái kia đúng, riêng
 *    `local` thì SAI — dash 0.5.12 có `local` như một phần mở rộng ngoài POSIX:
 *        $ sh -c 'f() { local v=inside; echo "$v"; }; v=outside; f; echo "$v"'
 *        inside
 *        outside
 *    Phạm vi hoạt động đúng. Câu 17 của đề chép nguyên văn phép đo này và hỏi
 *    theo MÁY, không theo giáo trình.
 *
 * 2. Bài 7.1 nói bọc thân script trong `main "$@"` khiến "không có gì chạy cho
 *    tới khi cả file được phân tích xong — nên một lỗi cú pháp gần cuối file
 *    KHÔNG THỂ để lại một script chạy dở". Vế sau quá mạnh. Bash đọc và chạy
 *    script theo TỪNG LỆNH, nên một lỗi cú pháp nằm SAU dòng `main "$@"` vẫn
 *    để `main` chạy trọn vẹn — đo thật, cả hai bản đều in step 1 và step 2 rồi
 *    mới báo `syntax error: unexpected end of file`, exit 2. Thứ `main "$@"`
 *    thật sự chặn được là file bị CẮT CỤT / còn nháy chưa đóng, vì khi đó
 *    dòng gọi `main` không bao giờ được đọc tới:
 *        (script phẳng, bị cắt) step 1 … step 2 … unexpected EOF, exit 2
 *        (cùng thân, trong main) unexpected EOF, exit 2  ← không chạy gì cả
 *    Câu 24 hỏi đúng ca CẮT CỤT — ca mà cơ chế này thật sự có tác dụng.
 *
 * 3. Bài 8.3 gọi `set -a; source .env; set +a` là "cách đọc ĐÚNG, vì `source`
 *    dùng chính bộ phân tích của shell", và chỉ chê dạng
 *    `env $(grep -v '^#' .env | xargs)` là mong manh. Đo thật với một file
 *    chứa `GREETING=hello world` (giá trị có dấu cách, KHÔNG đặt nháy trong
 *    file) thì CẢ HAI dạng đều vỡ:
 *        env $(… | xargs) …  → env: 'world': No such file or directory
 *        set -a; . ./u.env   → ./u.env: line 1: world: command not found
 *                              rồi GREETING rỗng
 *    `source` chạy file như MÃ SHELL, nên `KEY=hello world` là một phép gán
 *    cộng một lệnh. Nó chỉ đúng khi CHÍNH FILE đặt nháy: `GREETING="hello
 *    world"` → `[hello world]`. Câu 29 chép nguyên văn cả hai lần đo.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ HAI CÂU LẬP TRÌNH CHẠY ĐƯỢC TRÊN CẢ HAI SHELL
 * ────────────────────────────────────────────────────────────────────────────
 * `scripts/exam-check.mjs` ghép `starterCode` + `sampleSolution` rồi chạy bằng
 * `/bin/bash` CỦA MÁY CHẤM — tức bash 3.2.57 của macOS, với coreutils/sed/awk
 * bản BSD. Vì thế hai lời giải mẫu dưới đây cố ý KHÔNG dùng `declare -A`,
 * `${x^^}`, `mapfile`, `local -n`, `&>>`, `;&`, `[[ =~ ]]` (bash 3.2 đổi
 * ngữ nghĩa nháy của `=~`), và KHÔNG dùng cờ GNU (`stat -c`, `sed -i` không
 * đối số, `date -d`, `grep -P`, `readlink -f`, `find -printf`, `timeout`).
 * Chúng chỉ dùng POSIX + `case` + mảng chỉ số + `${var#pat}` + `printf`.
 * Đã chạy CẢ HAI nơi và so từng byte, kết quả giống hệt:
 *     /bin/bash q31.full.sh   (macOS, bash 3.2.57)   → khớp expectedOutput
 *     docker exec … bash q31.full.sh  (Debian 12, bash 5.2.15) → y hệt
 * (tương tự cho câu 32).
 *
 * Luật phân xử của câu 31 KHÔNG phải suy đoán — nó là hành vi đo được của
 * chính bash khi tra PATH:
 *     • file có bit x  → chạy, rc 0
 *     • file KHÔNG có bit x → BỎ QUA, đi tiếp; chỉ khi hết PATH mà không tìm
 *       được file chạy được thì mới báo `Permission denied` và rc 126, và
 *       đường dẫn báo ra là file KHÔNG-CHẠY-ĐƯỢC ĐẦU TIÊN gặp phải
 *     • trùng tên với một THƯ MỤC → không phải ứng viên, coi như không có
 *     • lệnh dựng sẵn thắng trước cả PATH
 * Đo thật: một `mytool` mode 644 ở thư mục đầu + một `mytool` mode 755 ở thư
 * mục sau ⇒ `I am B`, rc 0. Bỏ thư mục sau đi ⇒ `Permission denied`, rc 126.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (chỉ đếm câu trắc nghiệm):
 *     { '0': 7, '1': 8, '2': 8, '3': 7 }   → A 7 · B 8 · C 8 · D 7
 *   node -e "import('./content/exams/LINUX-BASH-PT2.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Không trùng câu nào với LINUX-BASH-FE.mjs (đã đối chiếu cả 50 câu) và không
 * trùng với các bài quiz cuối chương 5–8 của giáo trình.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/LINUX-BASH-PT2.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/linux-bash-exam-kit.mjs';

export default {
  course: { slug: 'linux-bash' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 5–8 (processes and signals, variables and quoting, production scripts, environment and PATH)',
        'Kiểm tra tiến độ 2 — Chương 5–8 (tiến trình và tín hiệu, biến và dấu nháy, script cho production, môi trường và PATH)',
      ),
      description: B(
        'The middle third of the Linux & Bash course: what a process is and how to signal one, jobs and detaching, variables, quoting and parameter expansion, exit codes and conditions, loops and functions, the production script skeleton with strict mode and traps, and how PATH, startup files and environment variables really behave. 30 multiple-choice questions plus 2 scripting questions you write here in the exam room.',
        'Một phần ba giữa của khoá Linux & Bash: tiến trình là gì và gửi tín hiệu cho nó ra sao, job và việc tách rời, biến, dấu nháy và khai triển tham số, mã thoát và điều kiện, vòng lặp và hàm, bộ khung script cho production với chế độ nghiêm ngặt và trap, và PATH, file khởi động, biến môi trường thật sự hành xử thế nào. 30 câu trắc nghiệm và 2 câu viết script làm ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '5–8'),
      questions: [
        // ── Chương 5 — Tiến trình, job & tín hiệu ───────────────────────
        mcq({
          prompt: B(
            'A background <code>tail</code> is running. These three commands were run for real, one after the other. Why does the first one list a process the other two do not?' + code(
              '$ ps -eo pid,comm,args | grep tail\n' +
              ' 5230 tail            tail -f /dev/null\n' +
              ' 5233 grep            grep tail\n' +
              '\n' +
              '$ ps -eo pid,comm,args | grep "[t]ail"\n' +
              ' 5230 tail            tail -f /dev/null\n' +
              '\n' +
              '$ pgrep -a tail\n' +
              '5230 tail -f /dev/null',
            ),
            'Một tiến trình <code>tail</code> đang chạy nền. Ba lệnh sau được chạy thật, lần lượt. Vì sao lệnh đầu liệt kê ra một tiến trình mà hai lệnh kia không có?' + code(
              '$ ps -eo pid,comm,args | grep tail\n' +
              ' 5230 tail            tail -f /dev/null\n' +
              ' 5233 grep            grep tail\n' +
              '\n' +
              '$ ps -eo pid,comm,args | grep "[t]ail"\n' +
              ' 5230 tail            tail -f /dev/null\n' +
              '\n' +
              '$ pgrep -a tail\n' +
              '5230 tail -f /dev/null',
            ),
          ),
          options: [
            B(
              'PID 5233 is a leftover zombie of a previous <code>tail</code>; the bracket pattern skips processes in state Z, and <code>pgrep</code> skips them for the same reason',
              'PID 5233 là một xác sống còn sót lại của lần <code>tail</code> trước; mẫu có ngoặc vuông bỏ qua tiến trình trạng thái Z, và <code>pgrep</code> bỏ qua vì đúng lý do đó',
            ),
            B(
              'The two sides of a pipe do not start at the same time: <code>ps</code> finishes before <code>grep</code> is created, so only a slow first run can catch the grep, and the other two forms simply ran faster',
              'Hai vế của một ống dẫn không khởi động cùng lúc: <code>ps</code> chạy xong trước khi <code>grep</code> được tạo ra, nên chỉ lần chạy chậm mới bắt được cái grep, còn hai dạng kia đơn giản là chạy nhanh hơn',
            ),
            B(
              'Both sides of the pipe start together, so <code>ps</code> sees the <code>grep</code> process itself and its argument list contains the word <code>tail</code>; writing the pattern as <code>[t]ail</code> means grep\'s own command line no longer matches the pattern, and <code>pgrep</code> avoids the whole problem because it never appears in a process list of its own making',
              'Cả hai vế của ống dẫn khởi động cùng lúc, nên <code>ps</code> nhìn thấy chính tiến trình <code>grep</code> và dòng tham số của nó có chứa chữ <code>tail</code>; viết mẫu thành <code>[t]ail</code> làm dòng lệnh của chính grep không còn khớp mẫu nữa, còn <code>pgrep</code> tránh hẳn vấn đề vì nó không bao giờ xuất hiện trong một danh sách tiến trình do chính nó tạo ra',
            ),
            B(
              'The square brackets turn the pattern into an extended regular expression, and extended mode makes <code>grep</code> match whole words only, so the partial match inside <code>grep tail</code> is discarded',
              'Cặp ngoặc vuông biến cái mẫu thành một biểu thức chính quy mở rộng, và chế độ mở rộng làm <code>grep</code> chỉ khớp trọn từ, nên chỗ khớp một phần bên trong <code>grep tail</code> bị loại bỏ',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured on Debian 12. A pipeline starts every stage as a process at the same moment (Lesson 3.2), so by the time <code>ps</code> walks the process table the <code>grep</code> is already there — with <code>tail</code> in its own argument list. <code>[t]ail</code> is a character class matching exactly one <code>t</code>, so it matches the text <code>tail</code> but not the literal string <code>[t]ail</code> that grep itself was started with. The habit to build is the third line: <code>pgrep -a</code> takes the same arguments as <code>pkill</code>, so the list you read is exactly the list <code>pkill</code> would kill — always run <code>pgrep -af &lt;pattern&gt;</code> before <code>pkill -f &lt;pattern&gt;</code>.',
            'Đo thật trên Debian 12. Một ống dẫn khởi động MỌI chặng thành tiến trình cùng một lúc (bài 3.2), nên khi <code>ps</code> đi duyệt bảng tiến trình thì cái <code>grep</code> đã nằm sẵn ở đó — với chữ <code>tail</code> trong chính dòng tham số của nó. <code>[t]ail</code> là một lớp ký tự khớp đúng một chữ <code>t</code>, nên nó khớp với chữ <code>tail</code> nhưng không khớp với chuỗi <code>[t]ail</code> mà bản thân grep được khởi động cùng. Thói quen đáng xây là dòng thứ ba: <code>pgrep -a</code> nhận đúng bộ tham số như <code>pkill</code>, nên danh sách bạn đọc chính là danh sách <code>pkill</code> sẽ giết — hãy luôn chạy <code>pgrep -af &lt;mẫu&gt;</code> trước khi gõ <code>pkill -f &lt;mẫu&gt;</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Real output for a single <code>tail -f /dev/null</code> on a Debian 12 box. What do the two memory columns mean?' + code(
              '$ ps -o pid,vsz,rss,stat,comm -p 5659\n' +
              '  PID    VSZ   RSS STAT COMMAND\n' +
              ' 5659 289060  4468 S    tail',
            ),
            'Output thật của đúng một tiến trình <code>tail -f /dev/null</code> trên máy Debian 12. Hai cột bộ nhớ đó nghĩa là gì?' + code(
              '$ ps -o pid,vsz,rss,stat,comm -p 5659\n' +
              '  PID    VSZ   RSS STAT COMMAND\n' +
              ' 5659 289060  4468 S    tail',
            ),
          ),
          options: [
            B(
              '<code>VSZ</code> is everything the process has mapped into its address space — shared libraries and memory it has never touched included — so 289 MB here is mostly bookkeeping; <code>RSS</code> is the physical RAM actually resident, 4.4 MB, and that is the number to read. Summing RSS across processes still overcounts, because a shared library is charged to every process that maps it',
              '<code>VSZ</code> là mọi thứ tiến trình đã ÁNH XẠ vào không gian địa chỉ — kể cả thư viện dùng chung và phần bộ nhớ nó chưa hề chạm tới — nên 289 MB ở đây phần lớn là sổ sách; <code>RSS</code> là RAM vật lý đang thật sự nằm trong máy, 4,4 MB, và đó mới là con số cần đọc. Cộng dồn RSS của nhiều tiến trình vẫn đếm thừa, vì một thư viện dùng chung bị tính cho mọi tiến trình có ánh xạ nó',
            ),
            B(
              '<code>VSZ</code> is the peak memory the process has ever reached and <code>RSS</code> is what it holds right now, so the gap says this <code>tail</code> once used 289 MB and has since released almost all of it back to the kernel',
              '<code>VSZ</code> là đỉnh bộ nhớ tiến trình từng đạt tới còn <code>RSS</code> là phần nó đang giữ, nên khoảng cách đó nói rằng <code>tail</code> này từng dùng tới 289 MB rồi trả lại gần hết cho nhân',
            ),
            B(
              '<code>VSZ</code> counts kilobytes and <code>RSS</code> counts pages of 4 kB, so the two numbers describe the same amount of memory expressed in different units and there is no real gap at all',
              '<code>VSZ</code> đếm theo kilobyte còn <code>RSS</code> đếm theo trang 4 kB, nên hai con số mô tả cùng một lượng bộ nhớ chỉ khác đơn vị, và thật ra chẳng có khoảng cách nào cả',
            ),
            B(
              '<code>VSZ</code> is memory in RAM and <code>RSS</code> is memory that has been swapped out to disk, so a large VSZ with a small RSS means the machine is healthy and nothing has been swapped',
              '<code>VSZ</code> là bộ nhớ nằm trong RAM còn <code>RSS</code> là phần đã bị tráo ra đĩa, nên VSZ lớn kèm RSS nhỏ nghĩa là máy đang khoẻ và chưa có gì bị tráo ra',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured. A <code>tail</code> doing nothing shows 289 MB of VSZ — address space it reserved and libraries it mapped — against 4.4 MB genuinely resident. That is why VSZ is almost always the wrong column to alert on. For honest per-process attribution the tool is <code>smem</code> and its <code>PSS</code> column, which divides each shared page among the processes mapping it, so the column really does sum to something meaningful. The <code>STAT</code> field is the other half of this line: <code>S</code> sleeping, <code>R</code> running, <code>D</code> uninterruptible, <code>T</code> stopped, <code>Z</code> zombie, with <code>s</code> for session leader and <code>+</code> for foreground.',
            'Đã đo thật. Một <code>tail</code> không làm gì cả hiện 289 MB VSZ — không gian địa chỉ nó đặt chỗ cộng các thư viện nó ánh xạ — so với 4,4 MB thật sự nằm trong RAM. Đó là lý do VSZ gần như luôn là cột SAI để dựng cảnh báo. Muốn quy trách nhiệm bộ nhớ cho từng tiến trình một cách trung thực thì công cụ là <code>smem</code> với cột <code>PSS</code>, thứ chia mỗi trang dùng chung cho các tiến trình có ánh xạ nó, nên cột đó cộng lại mới ra một con số có nghĩa. Trường <code>STAT</code> là nửa còn lại của dòng này: <code>S</code> đang ngủ, <code>R</code> đang chạy, <code>D</code> ngủ không ngắt được, <code>T</code> đã dừng, <code>Z</code> xác sống, kèm <code>s</code> là trưởng phiên và <code>+</code> là ở tiền cảnh.',
          ),
        }),

        mcq({
          prompt: B(
            'Two nearly identical scripts were run for real. Why did the first one print nothing from its handler?' + code(
              '# k.sh                                    # t.sh\n' +
              'trap HANDLER KILL                         trap HANDLER TERM\n' +
              'kill -KILL $$                             kill -TERM $$\n' +
              'echo "never reached"                      sleep 1\n' +
              '\n' +
              '# HANDLER is the same text in both files:  echo "cleanup ran"; exit 0\n' +
              '\n' +
              '$ bash k.sh; echo "exit=$?"\n' +
              '/tmp/pt2/run.sh: line 13:  6485 Killed                  bash k.sh\n' +
              'exit=137\n' +
              '\n' +
              '$ bash t.sh; echo "exit=$?"\n' +
              'cleanup ran\n' +
              'exit=0',
            ),
            'Hai script gần như giống hệt nhau đã được chạy thật. Vì sao script đầu không in ra gì từ bộ xử lý của nó?' + code(
              '# k.sh                                    # t.sh\n' +
              'trap HANDLER KILL                         trap HANDLER TERM\n' +
              'kill -KILL $$                             kill -TERM $$\n' +
              'echo "never reached"                      sleep 1\n' +
              '\n' +
              '# HANDLER is the same text in both files:  echo "cleanup ran"; exit 0\n' +
              '\n' +
              '$ bash k.sh; echo "exit=$?"\n' +
              '/tmp/pt2/run.sh: line 13:  6485 Killed                  bash k.sh\n' +
              'exit=137\n' +
              '\n' +
              '$ bash t.sh; echo "exit=$?"\n' +
              'cleanup ran\n' +
              'exit=0',
            ),
          ),
          options: [
            B(
              'Because the handler body has to be in double quotes for <code>KILL</code>: single quotes stop <code>$</code> expanding, and an unexpanded handler is discarded by <code>trap</code> at registration time rather than at delivery time',
              'Vì thân bộ xử lý bắt buộc phải nằm trong nháy kép với <code>KILL</code>: nháy đơn chặn <code>$</code> khai triển, và một bộ xử lý chưa khai triển sẽ bị <code>trap</code> vứt đi ngay lúc đăng ký chứ không phải lúc tín hiệu tới',
            ),
            B(
              'Because a script can only register one trap at a time, and <code>kill -KILL $$</code> on the very next line replaces the handler with the default action before the signal is ever delivered',
              'Vì một script chỉ đăng ký được một trap tại một thời điểm, và <code>kill -KILL $$</code> ngay dòng sau đã thay bộ xử lý bằng hành động mặc định trước khi tín hiệu kịp được gửi tới',
            ),
            B(
              'Because <code>$$</code> inside a script expands to the PID of the parent shell rather than the script itself, so the signal went to the wrong process and the script was later killed by the terminal driver instead',
              'Vì <code>$$</code> bên trong một script khai triển thành PID của shell cha chứ không phải chính script, nên tín hiệu đi nhầm tiến trình và script sau đó bị trình điều khiển terminal giết thay',
            ),
            B(
              '<code>SIGKILL</code> cannot be caught, blocked or ignored — the kernel destroys the process without ever running user code. <code>trap</code> accepts the line silently and returns 0, so nothing warns you; the process simply dies, the shell reports <code>Killed</code>, and the status is 137 because 128 + 9 = 137. <code>SIGTERM</code> is catchable, which is why the second script cleaned up and exited 0',
              '<code>SIGKILL</code> không bắt được, không chặn được, không lờ được — nhân huỷ tiến trình mà không chạy một dòng mã nào của người dùng. <code>trap</code> nhận dòng lệnh đó trong im lặng và trả về 0, nên chẳng có gì cảnh báo bạn; tiến trình cứ thế chết, shell báo <code>Killed</code>, và mã thoát là 137 vì 128 + 9 = 137. <code>SIGTERM</code> thì bắt được, và đó là lý do script thứ hai dọn dẹp xong rồi thoát 0',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured on bash 5.2.15. The dangerous half is that <code>trap \'…\' KILL</code> is <em>not</em> an error: bash returns 0 and the line looks like working cleanup code in review. The two uncatchable signals are <code>SIGKILL</code> (9) and <code>SIGSTOP</code> (19); everything else can be handled. This is also the one gap in <code>trap … EXIT</code> cleanup — a <code>kill -9</code> or the OOM killer leaves your temp files behind, and no shell construct can prevent it. Which is the practical argument for escalating: <code>kill</code>, wait a few seconds, check with <code>kill -0</code>, and only then <code>-9</code>.',
            'Đo trên bash 5.2.15. Nửa nguy hiểm là <code>trap \'…\' KILL</code> KHÔNG hề báo lỗi: bash trả về 0 và dòng đó trông y như mã dọn dẹp đang hoạt động khi đọc lại. Hai tín hiệu không bắt được là <code>SIGKILL</code> (9) và <code>SIGSTOP</code> (19); mọi tín hiệu khác đều xử lý được. Đây cũng chính là lỗ hổng duy nhất của việc dọn dẹp bằng <code>trap … EXIT</code> — một lệnh <code>kill -9</code> hay OOM killer sẽ để lại file tạm của bạn, và không cấu trúc shell nào ngăn được. Và đó là lập luận thực tế cho việc leo thang từ từ: <code>kill</code>, chờ vài giây, kiểm bằng <code>kill -0</code>, rồi mới tới <code>-9</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A script starts a background job that fails. Real output from both forms:' + code(
              '# form A                          # form B\n' +
              "bash -c 'exit 7' &                bash -c 'exit 7' &\n" +
              'p=$!                              p=$!\n' +
              'wait                              wait "$p"\n' +
              'echo "$?"                         echo "$?"\n' +
              '\n' +
              'A prints  0\n' +
              'B prints  7',
            ),
            'Một script khởi động một job nền và job đó hỏng. Output thật của cả hai dạng:' + code(
              '# dạng A                          # dạng B\n' +
              "bash -c 'exit 7' &                bash -c 'exit 7' &\n" +
              'p=$!                              p=$!\n' +
              'wait                              wait "$p"\n' +
              'echo "$?"                         echo "$?"\n' +
              '\n' +
              'A in ra  0\n' +
              'B in ra  7',
            ),
          ),
          options: [
            B(
              'A returns 0 because <code>wait</code> with no argument only waits for jobs started in the current line, and the job had already finished before <code>wait</code> ran, so there was nothing left to report',
              'A trả 0 vì <code>wait</code> không tham số chỉ chờ những job khởi động trên chính dòng hiện tại, mà job đó đã xong trước khi <code>wait</code> chạy nên chẳng còn gì để báo',
            ),
            B(
              'A bare <code>wait</code> waits for <b>every</b> background job and then returns 0 regardless of what any of them did; only <code>wait &lt;pid&gt;</code> reports that job\'s real exit code. A parallel loop that ends with a bare <code>wait</code> therefore reports success even when every task failed — you have to collect each PID and wait on it individually',
              'Một lệnh <code>wait</code> trơ trọi chờ <b>mọi</b> job nền rồi trả về 0 bất kể chúng làm gì; chỉ <code>wait &lt;pid&gt;</code> mới báo đúng mã thoát của job đó. Vì thế một vòng lặp song song kết thúc bằng <code>wait</code> trơ trọi vẫn báo thành công ngay cả khi mọi tác vụ đều hỏng — bạn phải hứng từng PID rồi chờ riêng từng cái',
            ),
            B(
              'A returns 0 because <code>$!</code> was read into <code>p</code> first, and reading <code>$!</code> consumes the job\'s exit status, leaving nothing for the later <code>wait</code> to pick up',
              'A trả 0 vì <code>$!</code> đã được đọc vào <code>p</code> trước, mà việc đọc <code>$!</code> tiêu mất trạng thái thoát của job, không còn gì cho lệnh <code>wait</code> phía sau nhặt lên',
            ),
            B(
              'A returns 0 because exit codes above 5 are reserved for signals and get clamped to 0 when they cross a job-control boundary; B avoids the clamp by naming the PID explicitly',
              'A trả 0 vì các mã thoát lớn hơn 5 được dành cho tín hiệu và bị kẹp về 0 khi đi qua ranh giới điều khiển job; B tránh được việc kẹp đó nhờ nêu đích danh PID',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured. This is the trap hiding inside the nice three-line parallelism pattern <code>a & b & c & wait</code>: it runs everything at once, but it cannot tell you whether anything worked. The correct shape collects the PIDs and waits on each — <code>pids=(); cmd1 & pids+=($!); cmd2 & pids+=($!); rc=0; for p in "${pids[@]}"; do wait "$p" || rc=1; done</code>. If you only need bounded parallelism over a list, <code>xargs -P</code> does the accounting for you and returns non-zero when any command failed.',
            'Đã đo thật. Đây là cái bẫy nấp bên trong khuôn song song ba dòng rất gọn <code>a & b & c & wait</code>: nó chạy mọi thứ cùng lúc, nhưng nó không cho bạn biết có cái nào chạy được hay không. Dạng đúng là hứng lấy các PID rồi chờ từng cái — <code>pids=(); cmd1 & pids+=($!); cmd2 & pids+=($!); rc=0; for p in "${pids[@]}"; do wait "$p" || rc=1; done</code>. Nếu bạn chỉ cần chạy song song có giới hạn trên một danh sách thì <code>xargs -P</code> tự lo phần sổ sách đó và trả về khác 0 khi có lệnh nào hỏng.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. What is <code>kill -0</code> for?' + code(
              '$ tail -f /dev/null >/dev/null 2>&1 &\n' +
              '$ pid=$!\n' +
              '$ kill -0 "$pid"; echo "rc=$?"\n' +
              'rc=0\n' +
              '$ kill -TERM "$pid"; wait "$pid" 2>/dev/null\n' +
              '$ kill -0 "$pid"; echo "rc=$?"\n' +
              'bash: kill: (5279) - No such process\n' +
              'rc=1',
            ),
            'Chạy thật. <code>kill -0</code> dùng để làm gì?' + code(
              '$ tail -f /dev/null >/dev/null 2>&1 &\n' +
              '$ pid=$!\n' +
              '$ kill -0 "$pid"; echo "rc=$?"\n' +
              'rc=0\n' +
              '$ kill -TERM "$pid"; wait "$pid" 2>/dev/null\n' +
              '$ kill -0 "$pid"; echo "rc=$?"\n' +
              'bash: kill: (5279) - No such process\n' +
              'rc=1',
            ),
          ),
          options: [
            B(
              'Signal 0 is <code>SIGHUP</code> under a different name, so the first call quietly told the process to reload its configuration and the second found it already gone',
              'Tín hiệu 0 là <code>SIGHUP</code> dưới một cái tên khác, nên lời gọi đầu đã lặng lẽ bảo tiến trình nạp lại cấu hình, còn lời gọi sau thì thấy nó đã biến mất',
            ),
            B(
              'Signal 0 resets the process\'s signal mask so that a later <code>kill -TERM</code> cannot be ignored; it is the standard preparation step before terminating a daemon',
              'Tín hiệu 0 đặt lại mặt nạ tín hiệu của tiến trình để lệnh <code>kill -TERM</code> sau đó không thể bị lờ đi; đó là bước chuẩn bị chuẩn trước khi kết thúc một daemon',
            ),
            B(
              'Signal 0 sends nothing at all. The kernel performs only the existence-and-permission check that any <code>kill</code> would do first, so the exit code answers "is this PID alive and may I signal it?" — 0 yes, 1 no. It is the safe way for a script to poll after a <code>SIGTERM</code> before escalating to <code>-9</code>',
              'Tín hiệu 0 KHÔNG gửi gì cả. Nhân chỉ làm đúng phép kiểm tồn-tại-và-quyền mà mọi lệnh <code>kill</code> đều làm trước tiên, nên mã thoát trả lời câu "PID này còn sống và tôi có quyền gửi tín hiệu cho nó không?" — 0 là có, 1 là không. Đây là cách an toàn để một script thăm dò sau khi đã gửi <code>SIGTERM</code>, trước khi leo thang lên <code>-9</code>',
            ),
            B(
              'Signal 0 means "the default signal", so it behaves exactly like a bare <code>kill</code> and therefore sends <code>SIGTERM</code>; the process in the transcript died from that first call rather than from the explicit <code>-TERM</code>',
              'Tín hiệu 0 nghĩa là "tín hiệu mặc định", nên nó hành xử y như <code>kill</code> trơ trọi và vì thế gửi <code>SIGTERM</code>; tiến trình trong đoạn ghi đã chết vì lời gọi đầu tiên đó chứ không phải vì lệnh <code>-TERM</code> tường minh',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured. This is the escalation ladder in a form a script can use: <code>kill "$pid"; sleep 5; kill -0 "$pid" 2&gt;/dev/null &amp;&amp; kill -9 "$pid"</code>. Two details worth keeping. A return of 1 does not strictly prove the process is dead — it can also mean you lack permission to signal it, though then the message is <code>Operation not permitted</code> rather than <code>No such process</code>. And a PID can be recycled, so polling a PID you did not start yourself is only ever an approximation; inside a script, wait on your own <code>$!</code> instead.',
            'Đã đo thật. Đây chính là cái thang leo dần, ở dạng một script dùng được: <code>kill "$pid"; sleep 5; kill -0 "$pid" 2&gt;/dev/null &amp;&amp; kill -9 "$pid"</code>. Hai chi tiết đáng giữ. Trả về 1 không chứng minh chắc chắn rằng tiến trình đã chết — nó cũng có thể nghĩa là bạn không có quyền gửi tín hiệu cho nó, tuy khi đó thông báo sẽ là <code>Operation not permitted</code> chứ không phải <code>No such process</code>. Và một PID có thể được cấp lại cho tiến trình khác, nên thăm dò một PID không do bạn khởi động chỉ là phép gần đúng; trong một script, hãy chờ trên chính <code>$!</code> của mình.',
          ),
        }),

        mcq({
          prompt: B(
            'A shell script started a background job and then exited. Real output afterwards:' + code(
              '# o.sh\n' +
              'tail -f /dev/null >/dev/null 2>&1 &\n' +
              'echo "shell pid = $$ , child pid = $!"\n' +
              '\n' +
              '$ bash o.sh\n' +
              'shell pid = 5653 , child pid = 5654\n' +
              '$ ps -o pid,ppid,stat,comm -p 5654\n' +
              '  PID  PPID STAT COMMAND\n' +
              ' 5654     1 S    tail',
            ),
            'Một script shell khởi động một job nền rồi thoát. Output thật sau đó:' + code(
              '# o.sh\n' +
              'tail -f /dev/null >/dev/null 2>&1 &\n' +
              'echo "shell pid = $$ , child pid = $!"\n' +
              '\n' +
              '$ bash o.sh\n' +
              'shell pid = 5653 , child pid = 5654\n' +
              '$ ps -o pid,ppid,stat,comm -p 5654\n' +
              '  PID  PPID STAT COMMAND\n' +
              ' 5654     1 S    tail',
            ),
          ),
          options: [
            B(
              'PID 5654 is now a zombie: its parent 5653 exited without calling <code>wait()</code>, so the kernel kept the entry and rewrote the parent to 1 as a placeholder. It uses no CPU and cannot be killed',
              'PID 5654 giờ là một xác sống: tiến trình cha 5653 thoát mà không gọi <code>wait()</code>, nên nhân giữ lại cái mục đó và ghi cha thành 1 làm chỗ giữ chỗ. Nó không tốn CPU và không giết được',
            ),
            B(
              'It is an <b>orphan</b>: its parent died first, so the kernel immediately re-parented it to PID 1, which will reap it correctly when it eventually exits. State <code>S</code> means it is alive and sleeping, so it is still doing its job — this is exactly how a daemon is traditionally created, and it is harmless',
              'Nó là một tiến trình <b>mồ côi</b>: cha nó chết trước, nên nhân lập tức nhận nó về làm con của PID 1, và PID 1 sẽ thu dọn nó đúng cách khi tới lúc nó thoát. Trạng thái <code>S</code> nghĩa là nó vẫn sống và đang ngủ, tức là vẫn đang làm việc của mình — đây đúng là cách truyền thống để tạo ra một daemon, và nó vô hại',
            ),
            B(
              'The shell forwarded <code>SIGHUP</code> to the job as it exited, so PID 5654 is in the middle of dying and PPID 1 is the transient state it passes through on its way out of the process table',
              'Shell đã chuyển tiếp <code>SIGHUP</code> tới job đó khi nó thoát, nên PID 5654 đang trong quá trình chết và PPID 1 là trạng thái thoáng qua mà nó đi ngang trên đường rời khỏi bảng tiến trình',
            ),
            B(
              'PPID 1 proves the job was started with <code>setsid</code> semantics because of the redirections on the line; without <code>&gt;/dev/null</code> the job would have kept its original parent and died with the script',
              'PPID 1 chứng tỏ job đó đã được khởi động theo ngữ nghĩa <code>setsid</code> nhờ các phép chuyển hướng trên dòng lệnh; không có <code>&gt;/dev/null</code> thì job sẽ giữ nguyên cha ban đầu và chết theo script',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured. Two things are worth separating here. An <b>orphan</b> is alive and re-parented to PID 1 — completely normal. A <b>zombie</b> (<code>Z</code>, <code>&lt;defunct&gt;</code>) has already exited and is waiting for a parent that never calls <code>wait()</code>; you cannot kill it because it is already dead, and the fix is to deal with the parent (<code>ps -o ppid= -p &lt;zombie&gt;</code>, then fix or restart it). Note also why this job survived at all: the script exited normally rather than the terminal closing, so no <code>SIGHUP</code> was ever sent. That is a different question from "will it survive me closing the SSH session".',
            'Đã đo thật. Có hai thứ cần tách bạch ở đây. Tiến trình <b>mồ côi</b> thì còn sống và được nhận về làm con của PID 1 — hoàn toàn bình thường. Tiến trình <b>xác sống</b> (<code>Z</code>, <code>&lt;defunct&gt;</code>) thì đã thoát rồi và đang chờ một tiến trình cha không bao giờ gọi <code>wait()</code>; bạn không giết nó được vì nó chết rồi, và cách chữa là xử lý cái CHA (<code>ps -o ppid= -p &lt;pid-xác-sống&gt;</code>, rồi sửa hoặc khởi động lại nó). Cũng chú ý vì sao job này sống sót được: script thoát một cách bình thường chứ không phải terminal đóng lại, nên chẳng có <code>SIGHUP</code> nào được gửi cả. Đó là một câu hỏi khác với câu "nó có sống sót khi tôi đóng phiên SSH không".',
          ),
        }),

        mcq({
          prompt: B(
            'You are an hour into a build you started with <code>./build.sh &amp;</code> over SSH. You now need to close the laptop, and it is far too late to have used <code>nohup</code>. Which sequence rescues the running job?',
            'Bạn đã chạy được một tiếng một bản dựng khởi động bằng <code>./build.sh &amp;</code> qua SSH. Giờ bạn cần gập laptop lại, và đã quá muộn để dùng <code>nohup</code>. Chuỗi thao tác nào cứu được job đang chạy?',
          ),
          options: [
            B(
              '<code>Ctrl-Z</code> to suspend it, <code>bg</code> to resume it in the background, then <code>disown -h %1</code> — which removes the job from the shell\'s SIGHUP list, so the shell never forwards the signal when the terminal goes away. <code>disown</code> is the only one of the three tools that works on something already running',
              '<code>Ctrl-Z</code> để treo nó lại, <code>bg</code> để cho nó chạy tiếp ở nền, rồi <code>disown -h %1</code> — thao tác gỡ job khỏi danh sách nhận SIGHUP của shell, nên shell không bao giờ chuyển tiếp tín hiệu đó khi terminal biến mất. <code>disown</code> là công cụ DUY NHẤT trong ba cái làm được việc với thứ đang chạy dở',
            ),
            B(
              '<code>Ctrl-Z</code> to suspend it, then <code>nohup %1 &amp;</code> to restart it under <code>nohup</code>, which re-attaches the running process to a new session that ignores SIGHUP',
              '<code>Ctrl-Z</code> để treo nó lại, rồi <code>nohup %1 &amp;</code> để cho nó chạy lại dưới <code>nohup</code>, lệnh này gắn tiến trình đang chạy vào một phiên mới có lờ SIGHUP',
            ),
            B(
              '<code>tmux attach</code> to move the running job into a tmux session, then <code>Ctrl-B D</code> to detach — tmux adopts any job of the current shell when you attach',
              '<code>tmux attach</code> để chuyển job đang chạy vào một phiên tmux, rồi <code>Ctrl-B D</code> để tách ra — tmux nhận nuôi mọi job của shell hiện tại khi bạn gắn vào',
            ),
            B(
              'Nothing is needed: <code>&amp;</code> already detached the job from the terminal, so closing the laptop cannot affect it; the only real risk would be a reboot of the server',
              'Không cần làm gì cả: dấu <code>&amp;</code> đã tách job khỏi terminal rồi, nên gập laptop lại không ảnh hưởng gì; rủi ro thật sự chỉ là máy chủ khởi động lại',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The three tools solve the same problem at different moments. <code>nohup cmd &amp;</code> is decided <em>before</em> you start; <code>setsid</code> starts the process in a brand-new session with no controlling terminal; <code>disown -h %1</code> is the only one that works <em>after the fact</em>, which is exactly the situation here. All three share one flaw, though: once you disconnect you can read the log file but you can never get back to the program to answer a prompt or scroll its output. That is why the habit worth building is <code>tmux attach || tmux new</code> as the first command after every SSH login — and why anything that must survive a <b>reboot</b> belongs in a systemd unit instead, since all three of these die with the machine.',
            'Ba công cụ giải cùng một bài toán nhưng ở ba thời điểm khác nhau. <code>nohup cmd &amp;</code> phải quyết định TRƯỚC khi khởi động; <code>setsid</code> khởi động tiến trình trong một phiên hoàn toàn mới, không có terminal điều khiển; còn <code>disown -h %1</code> là cái DUY NHẤT dùng được SAU KHI mọi thứ đã chạy, đúng tình huống ở đây. Cả ba đều chung một khuyết điểm: sau khi ngắt kết nối bạn đọc được file log nhưng không bao giờ quay lại được với chương trình để trả lời một câu hỏi của nó hay cuộn lại output. Vì thế thói quen đáng xây là gõ <code>tmux attach || tmux new</code> ngay sau mỗi lần đăng nhập SSH — và thứ gì phải sống sót qua một lần KHỞI ĐỘNG LẠI MÁY thì thuộc về một unit của systemd, vì cả ba công cụ trên đều chết theo máy.',
          ),
        }),

        // ── Chương 6 — Biến, dấu nháy & khai triển ───────────────────────
        mcq({
          prompt: B(
            'Real output on bash 5.2.15 with <code>name=deploy</code>. Explain line 2.' + code(
              'echo "1: ${name}_backup.txt"   ->  1: deploy_backup.txt\n' +
              'echo "2: $name_backup.txt"     ->  2: .txt\n' +
              'echo "3: ${name}-backup.txt"   ->  3: deploy-backup.txt',
            ),
            'Output thật trên bash 5.2.15 với <code>name=deploy</code>. Hãy giải thích dòng 2.' + code(
              'echo "1: ${name}_backup.txt"   ->  1: deploy_backup.txt\n' +
              'echo "2: $name_backup.txt"     ->  2: .txt\n' +
              'echo "3: ${name}-backup.txt"   ->  3: deploy-backup.txt',
            ),
          ),
          options: [
            B(
              'Line 2 lost the value because an underscore is a special character inside double quotes and has to be escaped; the braces on lines 1 and 3 happen to protect it as a side effect',
              'Dòng 2 mất giá trị vì dấu gạch dưới là ký tự đặc biệt bên trong nháy kép và phải được thoát; cặp ngoặc nhọn ở dòng 1 và 3 tình cờ bảo vệ được nó như một tác dụng phụ',
            ),
            B(
              'The shell reads a variable name as far as it legally can, and <code>_</code> is a legal name character — so line 2 looks up a variable called <code>name_backup</code>, finds nothing, and substitutes the empty string, leaving <code>.txt</code>. Line 3 needs no braces because <code>-</code> cannot be part of a name, so the name ends by itself',
              'Shell đọc tên biến xa hết mức nó được phép, mà <code>_</code> là ký tự hợp lệ trong tên biến — nên dòng 2 đi tìm một biến tên <code>name_backup</code>, không thấy, thay vào chuỗi rỗng, còn lại <code>.txt</code>. Dòng 3 không cần ngoặc nhọn vì <code>-</code> không thể là một phần của tên, nên cái tên tự nó kết thúc',
            ),
            B(
              'Line 2 printed <code>.txt</code> because bash strips everything before the last dot when a variable expansion is immediately followed by more text, which is the same greedy rule as <code>${var##*.}</code>',
              'Dòng 2 in ra <code>.txt</code> vì bash cắt bỏ mọi thứ trước dấu chấm cuối cùng khi một phép khai triển biến bị nối liền ngay bởi văn bản khác, đúng cái luật tham lam của <code>${var##*.}</code>',
            ),
            B(
              'With <code>set -u</code> unset it silently, but without braces bash treats <code>$name_backup.txt</code> as a filename glob first, and since no such file exists the pattern collapses to its shortest literal suffix',
              'Khi chưa bật <code>set -u</code> thì nó im lặng, còn không có ngoặc nhọn thì bash coi <code>$name_backup.txt</code> là một mẫu glob tên file trước đã, và vì không có file nào như vậy nên mẫu co lại thành hậu tố văn bản ngắn nhất của nó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured. Variable names may contain letters, digits and underscores, so the parser cannot know you meant <code>${name}_backup</code> — it takes the longest legal name it can see. Nothing warns you: an unset variable expands to the empty string, so the bug is a filename quietly missing its prefix, and under <code>set -u</code> it becomes <code>name_backup: unbound variable</code> instead, which is far better. This is why the recommended default is to write <code>"${var}"</code> with both the braces and the quotes every time rather than deciding case by case.',
            'Đã đo thật. Tên biến được phép chứa chữ cái, chữ số và dấu gạch dưới, nên bộ phân tích không thể biết bạn định viết <code>${name}_backup</code> — nó lấy cái tên hợp lệ DÀI NHẤT mà nó nhìn thấy. Không có gì cảnh báo cả: một biến chưa đặt khai triển thành chuỗi rỗng, nên lỗi ở đây là một cái tên file lặng lẽ mất phần đầu, còn nếu có <code>set -u</code> thì nó thành <code>name_backup: unbound variable</code>, tốt hơn hẳn. Đó là lý do mặc định được khuyên là luôn viết <code>"${var}"</code> với cả ngoặc nhọn lẫn dấu nháy, thay vì cân nhắc từng lần một.',
          ),
        }),

        mcq({
          prompt: B(
            'Real output with <code>files=("report one.txt" "report two.txt" "notes.md")</code>. Which line is which?' + code(
              'A:  for f in "${files[@]}"; do printf "[%s]" "$f"; done\n' +
              '    [report one.txt][report two.txt][notes.md]\n' +
              'B:  for f in "${files[*]}"; do printf "[%s]" "$f"; done\n' +
              '    [report one.txt report two.txt notes.md]\n' +
              'C:  for f in ${files[@]};   do printf "[%s]" "$f"; done\n' +
              '    [report][one.txt][report][two.txt][notes.md]',
            ),
            'Output thật với <code>files=("report one.txt" "report two.txt" "notes.md")</code>. Dòng nào ra dòng nào?' + code(
              'A:  for f in "${files[@]}"; do printf "[%s]" "$f"; done\n' +
              '    [report one.txt][report two.txt][notes.md]\n' +
              'B:  for f in "${files[*]}"; do printf "[%s]" "$f"; done\n' +
              '    [report one.txt report two.txt notes.md]\n' +
              'C:  for f in ${files[@]};   do printf "[%s]" "$f"; done\n' +
              '    [report][one.txt][report][two.txt][notes.md]',
            ),
          ),
          options: [
            B(
              'B is correct for looping: <code>*</code> keeps the array intact as one safe string, and the loop then splits it back into the original three elements on the array separator rather than on whitespace',
              'B mới là dạng đúng để lặp: <code>*</code> giữ mảng nguyên vẹn thành một chuỗi an toàn, rồi vòng lặp tách nó trở lại đúng ba phần tử ban đầu theo dấu phân cách của mảng chứ không theo khoảng trắng',
            ),
            B(
              'C is correct for looping: dropping the quotes is what lets the loop see the elements separately, and A only works because those particular filenames happen to be short',
              'C mới là dạng đúng để lặp: bỏ dấu nháy đi chính là thứ giúp vòng lặp nhìn thấy từng phần tử riêng, còn A chỉ chạy được vì mấy cái tên file cụ thể đó tình cờ ngắn',
            ),
            B(
              'A is the only correct form: quoted, with <code>@</code>, one iteration per element with spaces preserved. <code>"${files[*]}"</code> joins everything into a single string separated by the first character of <code>IFS</code>, so the loop runs once; unquoted <code>${files[@]}</code> re-splits every element on whitespace, so two filenames become four words and the count is wrong',
              'A là dạng đúng DUY NHẤT: có nháy, dùng <code>@</code>, mỗi phần tử một vòng lặp và dấu cách được giữ nguyên. <code>"${files[*]}"</code> nối tất cả thành một chuỗi duy nhất, ngăn nhau bằng ký tự đầu tiên của <code>IFS</code>, nên vòng lặp chạy đúng một lần; còn <code>${files[@]}</code> không nháy thì cắt lại từng phần tử theo khoảng trắng, nên hai tên file thành bốn từ và số lượng sai bét',
            ),
            B(
              'All three are equivalent in bash 5 and the difference shown here comes from <code>printf</code> reusing its format string, not from the expansions themselves',
              'Cả ba đều tương đương trong bash 5, và khác biệt thấy ở đây đến từ việc <code>printf</code> dùng lại chuỗi định dạng của nó chứ không phải từ bản thân các phép khai triển',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured. <code>"${arr[@]}"</code> — quoted, with the at sign — is the only expansion that preserves the array as a list of separate words. The difference is invisible until an element contains a space, which is why this bug reproduces on some inputs and not others. The same rule with the same reasoning applies to <code>"$@"</code> for a script\'s arguments, and to <code>"${#arr[@]}"</code> for the count, which stayed 3 here. Where an array really earns its keep is building a command incrementally: <code>args=(--output "/tmp/my output.log"); [[ -n $filter ]] &amp;&amp; args+=(--filter "$filter"); mycmd "${args[@]}"</code> — a plain string simply cannot represent "an argument containing a space".',
            'Đã đo thật. <code>"${arr[@]}"</code> — có nháy, dùng dấu a còng — là phép khai triển DUY NHẤT giữ được mảng dưới dạng một danh sách các từ riêng biệt. Khác biệt này vô hình cho tới khi có một phần tử chứa dấu cách, và đó là lý do lỗi kiểu này tái hiện với đầu vào này mà không tái hiện với đầu vào khác. Cùng một luật và cùng một lý lẽ áp dụng cho <code>"$@"</code> với tham số của script, và cho <code>"${#arr[@]}"</code> để đếm, ở đây vẫn là 3. Chỗ mảng thật sự đáng giá là khi dựng dần một câu lệnh: <code>args=(--output "/tmp/my output.log"); [[ -n $filter ]] &amp;&amp; args+=(--filter "$filter"); mycmd "${args[@]}"</code> — một chuỗi trơn đơn giản là không biểu diễn nổi "một tham số có chứa dấu cách".',
          ),
        }),

        mcq({
          prompt: B(
            'Real output. <code>empty</code> is set to the empty string; <code>missing</code> was never set at all.' + code(
              'echo "1: [${empty:-fallback}]"     ->  1: [fallback]\n' +
              'echo "2: [${empty-fallback}]"      ->  2: []\n' +
              'echo "3: [${missing:-fallback}]"   ->  3: [fallback]\n' +
              'echo "4: [${missing-fallback}]"    ->  4: [fallback]',
            ),
            'Output thật. <code>empty</code> được gán chuỗi rỗng; <code>missing</code> thì chưa từng được đặt.' + code(
              'echo "1: [${empty:-fallback}]"     ->  1: [fallback]\n' +
              'echo "2: [${empty-fallback}]"      ->  2: []\n' +
              'echo "3: [${missing:-fallback}]"   ->  3: [fallback]\n' +
              'echo "4: [${missing-fallback}]"    ->  4: [fallback]',
            ),
          ),
          options: [
            B(
              'The colon widens the test from "unset" to "unset <b>or</b> empty". Without it, a variable that exists but holds an empty string is considered set, so the fallback is skipped — which is why <code>:-</code> is nearly always the form you want for configuration, where an empty value is just as useless as a missing one',
              'Dấu hai chấm nới phép kiểm từ "chưa đặt" thành "chưa đặt <b>hoặc</b> rỗng". Không có nó thì một biến tồn tại nhưng giữ chuỗi rỗng vẫn được coi là đã đặt, nên phần dự phòng bị bỏ qua — và đó là lý do <code>:-</code> gần như luôn là dạng bạn cần khi xử lý cấu hình, nơi một giá trị rỗng cũng vô dụng y như một giá trị thiếu',
            ),
            B(
              'The colon makes the expansion assign the fallback back into the variable, so line 1 also left <code>empty=fallback</code> behind while line 2 left the variable untouched',
              'Dấu hai chấm khiến phép khai triển gán luôn giá trị dự phòng ngược vào biến, nên dòng 1 còn để lại <code>empty=fallback</code> trong khi dòng 2 không đụng tới biến',
            ),
            B(
              'The colon is required whenever the fallback contains letters; without it bash treats <code>fallback</code> as a command to run, and an empty result is what you get when that command produces no output',
              'Dấu hai chấm là bắt buộc mỗi khi giá trị dự phòng có chứa chữ cái; không có nó thì bash coi <code>fallback</code> là một lệnh cần chạy, và kết quả rỗng chính là thứ bạn nhận được khi lệnh đó không in ra gì',
            ),
            B(
              'There is no difference between the two operators; lines 1 and 2 differ only because <code>empty=</code> and <code>empty=""</code> are stored differently, the first as unset and the second as a real empty value',
              'Hai toán tử đó không khác gì nhau; dòng 1 và dòng 2 khác nhau chỉ vì <code>empty=</code> và <code>empty=""</code> được lưu khác nhau, cái đầu là chưa đặt còn cái sau là một giá trị rỗng thật sự',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured. The same colon rule runs through the whole family: <code>${var:=x}</code> assigns the default as a side effect (usually written <code>: "${var:=x}"</code> so it can stand as a statement), <code>${var:+x}</code> is the inverse and yields <code>x</code> only when the variable <em>is</em> set, and <code>${var:?msg}</code> aborts with that message on stderr and a non-zero status. Two lines of <code>: "${DATABASE_URL:?DATABASE_URL is required}"</code> at the top of a deploy script turn "it started and then failed strangely three minutes later" into "it refused to start and named the missing variable".',
            'Đã đo thật. Cùng cái luật dấu hai chấm ấy chạy suốt cả họ toán tử: <code>${var:=x}</code> gán luôn giá trị mặc định như một tác dụng phụ (thường viết <code>: "${var:=x}"</code> để nó đứng được thành một câu lệnh), <code>${var:+x}</code> là chiều ngược lại và chỉ cho ra <code>x</code> khi biến ĐÃ được đặt, còn <code>${var:?msg}</code> thì dừng hẳn với thông điệp đó trên stderr và một mã thoát khác 0. Hai dòng <code>: "${DATABASE_URL:?DATABASE_URL là bắt buộc}"</code> ở đầu một script deploy biến "nó khởi động rồi ba phút sau hỏng một cách kỳ lạ" thành "nó từ chối khởi động và nêu đích danh biến còn thiếu".',
          ),
        }),

        mcq({
          prompt: B(
            'Real output with <code>s="hello world world"</code>. Why did line 6 change nothing?' + code(
              '1: ${s/world/there}     ->  hello there world\n' +
              '2: ${s//world/there}    ->  hello there there\n' +
              '3: ${s//o/}             ->  hell wrld wrld\n' +
              '4: ${s/#hello/HI}       ->  HI world world\n' +
              '5: ${s/%world/WORLD}    ->  hello world WORLD\n' +
              '6: ${s/#world/HI}       ->  hello world world',
            ),
            'Output thật với <code>s="hello world world"</code>. Vì sao dòng 6 không đổi gì cả?' + code(
              '1: ${s/world/there}     ->  hello there world\n' +
              '2: ${s//world/there}    ->  hello there there\n' +
              '3: ${s//o/}             ->  hell wrld wrld\n' +
              '4: ${s/#hello/HI}       ->  HI world world\n' +
              '5: ${s/%world/WORLD}    ->  hello world WORLD\n' +
              '6: ${s/#world/HI}       ->  hello world world',
            ),
          ),
          options: [
            B(
              'Because <code>#</code> after the slash means "comment out the rest of the expansion", so line 6 is really <code>${s}</code> and the replacement text is ignored entirely',
              'Vì dấu <code>#</code> sau dấu gạch chéo nghĩa là "biến phần còn lại của phép khai triển thành chú thích", nên dòng 6 thật ra là <code>${s}</code> và phần văn bản thay thế bị bỏ qua hoàn toàn',
            ),
            B(
              'Because <code>world</code> appears twice, and an anchored replacement refuses to act when the pattern is ambiguous; you would need <code>//#</code> to make it replace the first occurrence anyway',
              'Vì chữ <code>world</code> xuất hiện hai lần, và một phép thay thế có neo sẽ từ chối hành động khi mẫu bị nhập nhằng; bạn sẽ phải dùng <code>//#</code> để nó vẫn thay chỗ đầu tiên',
            ),
            B(
              'Because <code>#</code> only strips prefixes and never substitutes, so line 4 also did nothing and the <code>HI</code> shown there came from the earlier assignment rather than from the expansion',
              'Vì <code>#</code> chỉ xén tiền tố chứ không bao giờ thay thế, nên dòng 4 cũng chẳng làm gì và chữ <code>HI</code> hiện ở đó đến từ phép gán trước đó chứ không phải từ phép khai triển',
            ),
            B(
              '<code>/#</code> anchors the pattern to the <b>start</b> of the string, and the string starts with <code>hello</code>, not <code>world</code> — so there is no match and the value comes back unchanged, with no error. <code>/%</code> anchors to the end, a single <code>/</code> replaces the first match anywhere, and a doubled <code>//</code> replaces every match',
              '<code>/#</code> neo cái mẫu vào ĐẦU chuỗi, mà chuỗi thì bắt đầu bằng <code>hello</code> chứ không phải <code>world</code> — nên không khớp và giá trị trả về nguyên xi, không báo lỗi gì. <code>/%</code> neo vào cuối, một dấu <code>/</code> đơn thay chỗ khớp đầu tiên ở bất kỳ đâu, còn <code>//</code> đôi thì thay mọi chỗ khớp',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured. The silent no-match is the real lesson: a parameter expansion that does not match simply returns the original value, so a broken pattern looks exactly like a working one that had nothing to do. The other half is that these patterns are <b>globs, not regexes</b> — <code>*</code>, <code>?</code> and <code>[…]</code> work, while <code>+</code>, <code>|</code> and <code>\\d</code> do not and quietly match nothing. A useful practical case is line 3\'s empty replacement for deletion, and normalising a branch into a Docker tag: <code>tag="${branch//\\//-}"</code>, where the slash in the pattern has to be escaped.',
            'Đã đo thật. Chuyện không-khớp-trong-im-lặng mới là bài học thật: một phép khai triển tham số không khớp thì đơn giản trả về giá trị gốc, nên một cái mẫu viết sai trông y hệt một cái mẫu chạy đúng mà không có gì để làm. Nửa còn lại là những mẫu này là <b>glob, không phải regex</b> — <code>*</code>, <code>?</code> và <code>[…]</code> thì chạy, còn <code>+</code>, <code>|</code> và <code>\\d</code> thì không, và chúng lặng lẽ không khớp gì cả. Một ca dùng thật đáng chú ý là phần thay thế rỗng ở dòng 3 để XOÁ, và việc chuẩn hoá tên nhánh thành tag Docker: <code>tag="${branch//\\//-}"</code>, chỗ dấu gạch chéo trong mẫu phải được thoát.',
          ),
        }),

        mcq({
          prompt: B(
            'Real output. What does the <code>IFS=\':\'</code> prefix do, and what is <code>_</code>?' + code(
              'line="alice:x:1001:1001::/home/alice:/bin/bash"\n' +
              "IFS=':' read -r user _ uid gid _ home shell <<< \"$line\"\n" +
              'echo "user=$user uid=$uid home=$home shell=$shell"\n' +
              '\n' +
              'user=alice uid=1001 home=/home/alice shell=/bin/bash',
            ),
            'Output thật. Tiền tố <code>IFS=\':\'</code> làm gì, và <code>_</code> là gì?' + code(
              'line="alice:x:1001:1001::/home/alice:/bin/bash"\n' +
              "IFS=':' read -r user _ uid gid _ home shell <<< \"$line\"\n" +
              'echo "user=$user uid=$uid home=$home shell=$shell"\n' +
              '\n' +
              'user=alice uid=1001 home=/home/alice shell=/bin/bash',
            ),
          ),
          options: [
            B(
              '<code>IFS</code> is exported to <code>read</code> as an environment variable, so it stays changed for the rest of the script; <code>_</code> is a bash keyword meaning "stop assigning here", which is why only four of the seven names got values',
              '<code>IFS</code> được export sang <code>read</code> dưới dạng biến môi trường nên nó vẫn đổi cho tới hết script; <code>_</code> là một từ khoá của bash nghĩa là "dừng gán từ đây", và đó là lý do chỉ bốn trong bảy cái tên nhận được giá trị',
            ),
            B(
              'It sets the separator globally, and <code>_</code> holds the last argument of the previous command — so reusing it here would have clobbered that value if the script had needed it',
              'Nó đặt dấu phân cách ở phạm vi toàn cục, còn <code>_</code> giữ tham số cuối cùng của lệnh trước — nên dùng lại nó ở đây sẽ đè mất giá trị ấy nếu script có cần tới',
            ),
            B(
              'The prefix tells <code>read</code> to keep reading until it has seen a colon, which is why the empty fifth field did not shift the remaining values; <code>_</code> marks a field that is allowed to be empty',
              'Tiền tố đó bảo <code>read</code> đọc tiếp cho tới khi gặp một dấu hai chấm, và đó là lý do trường thứ năm rỗng không làm lệch các giá trị còn lại; <code>_</code> đánh dấu một trường được phép rỗng',
            ),
            B(
              '<code>IFS=\':\'</code> is a per-command assignment, so the field separator is a colon for this <code>read</code> only and the shell\'s own <code>IFS</code> is untouched afterwards; <code>_</code> is nothing special to bash, just the conventional name for a field you are discarding, and it is written twice here because two fields are unwanted',
              '<code>IFS=\':\'</code> là một phép gán chỉ dành cho lệnh này, nên dấu phân cách trường là dấu hai chấm CHỈ với lệnh <code>read</code> đó, còn <code>IFS</code> của chính shell thì không hề bị đụng tới; <code>_</code> chẳng có gì đặc biệt với bash cả, chỉ là cái tên quy ước cho một trường bạn muốn vứt đi, và nó được viết hai lần vì có hai trường không cần dùng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured. A <code>KEY=value</code> prefix applies to exactly one command, which is the clean way to change <code>IFS</code> without breaking everything downstream — setting it globally is a known way to make a script fail in confusing places. Two related habits from the same line: always <code>read -r</code>, because without it a backslash in the data is silently eaten; and when reading <em>lines</em> rather than fields, write <code>while IFS= read -r line</code> with <code>IFS</code> set to nothing, which is what preserves leading and trailing whitespace — measured on the same box, a line of <code>"    indented line  "</code> came back intact with <code>IFS=</code> and trimmed to <code>indented line</code> without it.',
            'Đã đo thật. Một tiền tố <code>KEY=value</code> chỉ áp dụng cho đúng một lệnh, và đó là cách sạch sẽ để đổi <code>IFS</code> mà không phá mọi thứ phía sau — đặt nó ở phạm vi toàn cục là một cách nổi tiếng làm script hỏng ở những chỗ khó hiểu. Hai thói quen liên quan từ chính dòng lệnh đó: luôn dùng <code>read -r</code>, vì thiếu nó thì một dấu gạch chéo ngược trong dữ liệu bị nuốt mất trong im lặng; và khi đọc TỪNG DÒNG chứ không phải từng trường thì viết <code>while IFS= read -r line</code> với <code>IFS</code> đặt rỗng, chính nó mới giữ được khoảng trắng ở đầu và cuối dòng — đo trên cùng cái máy, một dòng <code>"    indented line  "</code> trở về nguyên vẹn khi có <code>IFS=</code> và bị xén thành <code>indented line</code> khi không có.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. The file contains only <code>a</code> and <code>b</code>, so <code>grep -q zzz</code> genuinely fails. Why does the script report success?' + code(
              '$ grep -q zzz f.txt\n' +
              '$ echo "done"\n' +
              'done\n' +
              '$ if [ $? -ne 0 ]; then echo "grep failed"; else echo "grep succeeded"; fi\n' +
              'grep succeeded\n' +
              '\n' +
              '$ grep -q zzz f.txt\n' +
              '$ rc=$?\n' +
              '$ echo "captured rc=$rc"\n' +
              'captured rc=1',
            ),
            'Chạy thật. File chỉ chứa <code>a</code> và <code>b</code> nên <code>grep -q zzz</code> thật sự thất bại. Vì sao script lại báo thành công?' + code(
              '$ grep -q zzz f.txt\n' +
              '$ echo "done"\n' +
              'done\n' +
              '$ if [ $? -ne 0 ]; then echo "grep failed"; else echo "grep succeeded"; fi\n' +
              'grep succeeded\n' +
              '\n' +
              '$ grep -q zzz f.txt\n' +
              '$ rc=$?\n' +
              '$ echo "captured rc=$rc"\n' +
              'captured rc=1',
            ),
          ),
          options: [
            B(
              'Because <code>grep -q</code> suppresses its exit code along with its output, so <code>$?</code> is 0 until you ask for the status explicitly by assigning it to a variable',
              'Vì <code>grep -q</code> chặn luôn cả mã thoát cùng với output của nó, nên <code>$?</code> là 0 cho tới khi bạn hỏi trạng thái một cách tường minh bằng cách gán nó vào một biến',
            ),
            B(
              'Because <code>[ ]</code> compares numbers as strings, so <code>-ne</code> saw "1" and "0" as equal-length text and took the else branch; <code>[[ ]]</code> would have got it right',
              'Vì <code>[ ]</code> so sánh số như chuỗi, nên <code>-ne</code> thấy "1" và "0" là văn bản dài bằng nhau rồi rẽ vào nhánh else; <code>[[ ]]</code> thì đã làm đúng',
            ),
            B(
              '<code>$?</code> holds the status of the <b>immediately preceding</b> command, and that command was <code>echo</code>, which always succeeds. The <code>grep</code> status was overwritten one line earlier. Either capture it at once with <code>rc=$?</code>, or — better — drop <code>$?</code> altogether and test the command directly: <code>if grep -q zzz f.txt; then …</code>',
              '<code>$?</code> giữ trạng thái của lệnh <b>ngay liền trước</b>, mà lệnh đó là <code>echo</code>, thứ luôn thành công. Trạng thái của <code>grep</code> đã bị đè mất từ một dòng trước. Hoặc hứng nó ngay lập tức bằng <code>rc=$?</code>, hoặc — tốt hơn — bỏ hẳn <code>$?</code> đi và kiểm thẳng cái lệnh: <code>if grep -q zzz f.txt; then …</code>',
            ),
            B(
              'Because a failed <code>grep</code> writes its status to stderr rather than to <code>$?</code>, and the redirection needed to capture it (<code>2&gt;&amp;1</code>) is missing from both blocks',
              'Vì một lệnh <code>grep</code> thất bại ghi trạng thái của nó ra stderr chứ không phải vào <code>$?</code>, và phép chuyển hướng cần để hứng nó (<code>2&gt;&amp;1</code>) đang thiếu ở cả hai khối',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured. Everything overwrites <code>$?</code> — <code>echo</code>, a <code>[</code> test, a log line, even a comment-looking <code>:</code> command. The second block shows the fix and also the honest value: <code>grep</code> really did exit 1. Note that 1 from <code>grep</code> means "no match found", which is a <em>result</em> rather than an error (an actual error is 2), so under <code>set -e</code> a bare <code>grep -q</code> would abort the script — which is what <code>|| true</code>, or better an <code>if</code>, is for.',
            'Đã đo thật. Mọi thứ đều đè lên <code>$?</code> — <code>echo</code>, một phép kiểm <code>[</code>, một dòng ghi log, thậm chí một lệnh <code>:</code> trông như chú thích. Khối thứ hai cho thấy cách sửa và cả giá trị thật: <code>grep</code> đúng là đã thoát với mã 1. Lưu ý rằng mã 1 của <code>grep</code> nghĩa là "không tìm thấy chỗ nào khớp", một KẾT QUẢ chứ không phải lỗi (lỗi thật là mã 2), nên dưới <code>set -e</code> thì một lệnh <code>grep -q</code> trơ trọi sẽ làm dừng cả script — và đó là việc của <code>|| true</code>, hoặc tốt hơn là một câu <code>if</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'The log file contains exactly two lines matching ERROR. Real output from both forms:' + code(
              'count=0\n' +
              'grep ERROR app.log | while IFS= read -r l; do count=$((count+1)); done\n' +
              'echo "after pipe:  count=$count"      ->  after pipe:  count=0\n' +
              '\n' +
              'count=0\n' +
              'while IFS= read -r l; do count=$((count+1)); done < <(grep ERROR app.log)\n' +
              'echo "after < <(): count=$count"      ->  after < <(): count=2',
            ),
            'File log chứa đúng hai dòng khớp ERROR. Output thật của cả hai dạng:' + code(
              'count=0\n' +
              'grep ERROR app.log | while IFS= read -r l; do count=$((count+1)); done\n' +
              'echo "after pipe:  count=$count"      ->  after pipe:  count=0\n' +
              '\n' +
              'count=0\n' +
              'while IFS= read -r l; do count=$((count+1)); done < <(grep ERROR app.log)\n' +
              'echo "after < <(): count=$count"      ->  after < <(): count=2',
            ),
          ),
          options: [
            B(
              'Every stage of a pipeline runs in its own <b>subshell</b>, so the loop incremented a copy of <code>count</code> that vanished when the subshell exited. Process substitution <code>&lt; &lt;(cmd)</code> makes the command the loop\'s <em>input file</em> instead, leaving the loop itself in the current shell — so the variable survives',
              'Mọi chặng của một ống dẫn đều chạy trong <b>shell con</b> của riêng nó, nên vòng lặp đã tăng một BẢN SAO của <code>count</code>, và bản sao đó biến mất khi shell con thoát. Thay thế tiến trình <code>&lt; &lt;(cmd)</code> biến câu lệnh thành FILE ĐẦU VÀO của vòng lặp, để bản thân vòng lặp nằm lại trong shell hiện tại — nhờ đó biến sống sót',
            ),
            B(
              'The pipe delivered the lines too late: <code>grep</code> had not finished writing when <code>echo</code> ran, so the count was read before the loop had processed anything. Adding <code>wait</code> after the pipeline would fix it',
              'Ống dẫn giao các dòng tới quá muộn: <code>grep</code> chưa ghi xong thì <code>echo</code> đã chạy, nên số đếm bị đọc trước khi vòng lặp kịp xử lý gì. Thêm <code>wait</code> sau chuỗi ống là sửa được',
            ),
            B(
              '<code>read</code> cannot see data arriving on a pipe unless you pass <code>-u 0</code>, so the loop body never executed once; the second form works because a file redirection sets file descriptor 0 explicitly',
              '<code>read</code> không nhìn thấy dữ liệu tới qua ống dẫn trừ phi bạn truyền <code>-u 0</code>, nên thân vòng lặp không chạy lần nào; dạng thứ hai chạy được vì phép chuyển hướng file đặt bộ mô tả file 0 một cách tường minh',
            ),
            B(
              '<code>IFS=</code> on the <code>read</code> resets <code>count</code> on every iteration because the assignment prefix applies to the whole compound command; removing <code>IFS=</code> from the first form would make it print 2',
              '<code>IFS=</code> trên lệnh <code>read</code> đặt lại <code>count</code> ở mỗi vòng vì tiền tố gán áp dụng cho cả câu lệnh phức hợp; bỏ <code>IFS=</code> khỏi dạng đầu là nó in ra 2',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured. The subshell is invisible — no error, no warning, just a counter that stays at its initial value — and it is the single most common reason a shell loop "does not work". The three correct shapes to memorise are: <code>done &lt; file</code> for a file, <code>done &lt; &lt;(cmd)</code> for a command, and <code>for f in *.log</code> for files in a directory. Anything of the form <code>cmd | while read</code> puts the loop in a child process. (A tidy alternative when you only need the number is to let the tool count: <code>count=$(grep -c ERROR app.log)</code>.)',
            'Đã đo thật. Cái shell con đó vô hình — không lỗi, không cảnh báo, chỉ có một bộ đếm nằm im ở giá trị ban đầu — và nó là lý do phổ biến số một khiến một vòng lặp shell "không chạy". Ba dạng đúng cần thuộc là: <code>done &lt; file</code> cho một file, <code>done &lt; &lt;(cmd)</code> cho một câu lệnh, và <code>for f in *.log</code> cho các file trong một thư mục. Bất cứ thứ gì có dạng <code>cmd | while read</code> đều đẩy vòng lặp vào một tiến trình con. (Một cách gọn hơn khi bạn chỉ cần con số là để chính công cụ đếm: <code>count=$(grep -c ERROR app.log)</code>.)',
          ),
        }),

        mcq({
          prompt: B(
            'Real run of <code>check.sh</code> on bash 5.2.15, where <code>answer</code> was set to the empty string:' + code(
              '#!/usr/bin/env bash\n' +
              'answer=""\n' +
              'if [ $answer = yes ]; then echo "single: yes"; else echo "single: no"; fi\n' +
              'if [[ $answer == yes ]]; then echo "double: yes"; else echo "double: no"; fi\n' +
              '\n' +
              '$ bash check.sh; echo "exit=$?"\n' +
              'check.sh: line 3: [: =: unary operator expected\n' +
              'single: no\n' +
              'double: no\n' +
              'exit=0',
            ),
            'Chạy thật <code>check.sh</code> trên bash 5.2.15, với <code>answer</code> được gán chuỗi rỗng:' + code(
              '#!/usr/bin/env bash\n' +
              'answer=""\n' +
              'if [ $answer = yes ]; then echo "single: yes"; else echo "single: no"; fi\n' +
              'if [[ $answer == yes ]]; then echo "double: yes"; else echo "double: no"; fi\n' +
              '\n' +
              '$ bash check.sh; echo "exit=$?"\n' +
              'check.sh: line 3: [: =: unary operator expected\n' +
              'single: no\n' +
              'double: no\n' +
              'exit=0',
            ),
          ),
          options: [
            B(
              'Line 3 errored because <code>[</code> requires <code>==</code> like line 4 does; a single <code>=</code> is only valid inside <code>[[ ]]</code>, and the error names the operator it could not accept',
              'Dòng 3 lỗi vì <code>[</code> đòi <code>==</code> giống dòng 4; một dấu <code>=</code> đơn chỉ hợp lệ bên trong <code>[[ ]]</code>, và thông báo lỗi nêu đích danh cái toán tử nó không nhận được',
            ),
            B(
              'Line 3 errored because an empty variable is only an error under <code>set -u</code>, which <code>[</code> enables implicitly for the duration of the test while <code>[[ ]]</code> does not',
              'Dòng 3 lỗi vì một biến rỗng chỉ là lỗi khi có <code>set -u</code>, thứ mà <code>[</code> tự bật ngầm trong suốt phép kiểm còn <code>[[ ]]</code> thì không',
            ),
            B(
              'Both lines are wrong and both should have quoted the variable; the reason only line 3 complained is that <code>[[ ]]</code> writes its diagnostics to stdout, where they were mixed into the normal output and are invisible in this transcript',
              'Cả hai dòng đều sai và cả hai đều đáng lẽ phải đặt biến trong nháy; sở dĩ chỉ dòng 3 kêu ca là vì <code>[[ ]]</code> ghi thông báo của nó ra stdout, chúng bị trộn vào output bình thường và không nhìn thấy được trong đoạn ghi này',
            ),
            B(
              '<code>[</code> is an ordinary command whose arguments the shell builds first, so an unquoted empty variable simply disappears and <code>[</code> receives only <code>= yes</code> — two arguments, which it reads as a unary test with a missing operand. Inside <code>[[ ]]</code> bash does no word splitting at all, so the empty value stays one (empty) operand and the test is just false',
              '<code>[</code> là một câu lệnh bình thường mà shell dựng tham số cho nó trước, nên một biến rỗng không đặt trong nháy đơn giản là biến mất và <code>[</code> chỉ nhận được <code>= yes</code> — hai tham số, và nó đọc thành một phép kiểm một ngôi bị thiếu toán hạng. Bên trong <code>[[ ]]</code> thì bash không cắt từ chút nào, nên giá trị rỗng vẫn là một toán hạng (rỗng) và phép kiểm chỉ đơn giản là sai',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured. There really is a program at <code>/usr/bin/[</code>, which is why every token inside it needs spaces around it — they are arguments. The old portable workaround you will still see in <code>sh</code> scripts is <code>[ "x$var" = "xyes" ]</code>; in bash the answer is simply <code>[[ ]]</code>, where an empty variable cannot break the syntax. Note also that the script still exited 0: the failed test took the else branch and the script carried on, so this class of bug does not stop anything — it just quietly takes the wrong branch on the one input you did not test with.',
            'Đã đo thật. Thật sự có một chương trình nằm ở <code>/usr/bin/[</code>, và đó là lý do mọi ký hiệu bên trong nó đều cần dấu cách bao quanh — chúng là THAM SỐ. Mẹo cũ mang tính khả chuyển mà bạn vẫn còn gặp trong script <code>sh</code> là <code>[ "x$var" = "xyes" ]</code>; trong bash thì câu trả lời đơn giản là <code>[[ ]]</code>, nơi một biến rỗng không thể làm vỡ cú pháp. Cũng lưu ý script vẫn thoát với mã 0: phép kiểm hỏng rẽ vào nhánh else và script chạy tiếp, nên loại lỗi này không chặn thứ gì cả — nó chỉ lặng lẽ rẽ nhầm nhánh, đúng vào cái đầu vào mà bạn không mang ra thử.',
          ),
        }),

        mcq({
          prompt: B(
            '<code>present.txt</code> exists but does not contain the word NOPE. Real output:' + code(
              '$ [[ -f present.txt ]] && grep -q NOPE present.txt || echo "no file"\n' +
              'no file',
            ) + 'Why did it print that, and what should have been written?',
            '<code>present.txt</code> có tồn tại nhưng không chứa chữ NOPE. Output thật:' + code(
              '$ [[ -f present.txt ]] && grep -q NOPE present.txt || echo "no file"\n' +
              'no file',
            ) + 'Vì sao nó in ra như vậy, và đáng lẽ phải viết thế nào?',
          ),
          options: [
            B(
              'Because <code>[[ -f ]]</code> is false for a file created by <code>touch</code> until something writes to it; the fix is <code>[[ -e present.txt ]]</code>, which does not require the file to be a regular file with content',
              'Vì <code>[[ -f ]]</code> là sai với một file vừa tạo bằng <code>touch</code> cho tới khi có gì đó ghi vào nó; cách sửa là <code>[[ -e present.txt ]]</code>, thứ không đòi file phải là file thường có nội dung',
            ),
            B(
              '<code>a &amp;&amp; b || c</code> is <b>not</b> if-then-else. It is two independent short-circuits: <code>b</code> ran, <code>b</code> failed (grep found nothing, so exit 1), and <code>||</code> then fired <code>c</code> — even though the file was there. Use a real <code>if</code> whenever the middle command can fail',
              '<code>a &amp;&amp; b || c</code> <b>KHÔNG</b> phải if-then-else. Nó là hai phép đoản mạch độc lập: <code>b</code> đã chạy, <code>b</code> thất bại (grep không tìm thấy gì nên thoát 1), rồi <code>||</code> kích hoạt <code>c</code> — dù file vẫn nằm đó. Hãy dùng một câu <code>if</code> thật sự mỗi khi lệnh ở giữa có thể thất bại',
            ),
            B(
              'Because <code>grep -q</code> produces no output, and <code>||</code> in bash tests whether the previous command <em>printed</em> anything rather than its exit code; redirecting grep to a file would make the line behave',
              'Vì <code>grep -q</code> không in ra gì, và <code>||</code> trong bash kiểm xem lệnh trước có IN RA gì không chứ không kiểm mã thoát; chuyển hướng grep vào một file là dòng lệnh hành xử đúng ngay',
            ),
            B(
              'Because <code>&amp;&amp;</code> binds more loosely than <code>||</code> in bash, so the line parsed as <code>[[ -f present.txt ]] &amp;&amp; (grep -q NOPE present.txt || echo "no file")</code> and the echo belonged to the true branch all along',
              'Vì <code>&amp;&amp;</code> kết hợp lỏng hơn <code>||</code> trong bash, nên dòng lệnh được phân tích thành <code>[[ -f present.txt ]] &amp;&amp; (grep -q NOPE present.txt || echo "no file")</code> và lệnh echo xưa nay vẫn thuộc nhánh đúng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured. The pattern is only safe when the middle command cannot fail — which is rarely something you can guarantee, and never something a reader can check at a glance. The equivalent <code>if</code> printed nothing in the same run, which is the behaviour that was wanted. This matters twice over under <code>set -e</code>: a command on the left of <code>&amp;&amp;</code> or <code>||</code> has its status <em>tested</em>, so strict mode deliberately does not abort there — meaning a failure inside such a chain is silent in both directions.',
            'Đã đo thật. Khuôn này chỉ an toàn khi lệnh ở giữa không thể thất bại — điều hiếm khi bạn bảo đảm được, và không bao giờ là thứ người đọc kiểm ra được chỉ bằng một cái liếc. Câu <code>if</code> tương đương đã không in gì trong cùng lần chạy đó, và đấy mới là hành vi mong muốn. Chuyện này còn quan trọng gấp đôi dưới <code>set -e</code>: một lệnh nằm bên trái <code>&amp;&amp;</code> hay <code>||</code> thì trạng thái của nó đang được KIỂM, nên chế độ nghiêm ngặt cố ý không dừng ở đó — nghĩa là một thất bại bên trong chuỗi như vậy im lặng theo cả hai chiều.',
          ),
        }),

        // ── Chương 7 — Viết script cho production ────────────────────────
        mcq({
          prompt: B(
            'On Debian 12, <code>/bin/sh</code> is dash. Real probe of four bash features through <code>sh -c</code>:' + code(
              '$ ls -l /bin/sh\n' +
              'lrwxrwxrwx 1 root root 4 Jan  5  2023 /bin/sh -> dash\n' +
              '\n' +
              "$ sh -c '[[ 1 == 1 ]] && echo yes'\n" +
              'sh: 1: [[: not found\n' +
              "$ sh -c 'a=(1 2); echo \"${a[0]}\"'\n" +
              'sh: 1: Syntax error: "(" unexpected\n' +
              "$ sh -c 'v=abc; echo \"${v^^}\"'\n" +
              'sh: 1: Bad substitution\n' +
              "$ sh -c 'f() { local v=inside; echo \"$v\"; }; v=outside; f; echo \"$v\"'\n" +
              'inside\n' +
              'outside',
            ),
            'Trên Debian 12, <code>/bin/sh</code> là dash. Phép thăm dò thật bốn tính năng của bash qua <code>sh -c</code>:' + code(
              '$ ls -l /bin/sh\n' +
              'lrwxrwxrwx 1 root root 4 Jan  5  2023 /bin/sh -> dash\n' +
              '\n' +
              "$ sh -c '[[ 1 == 1 ]] && echo yes'\n" +
              'sh: 1: [[: not found\n' +
              "$ sh -c 'a=(1 2); echo \"${a[0]}\"'\n" +
              'sh: 1: Syntax error: "(" unexpected\n' +
              "$ sh -c 'v=abc; echo \"${v^^}\"'\n" +
              'sh: 1: Bad substitution\n' +
              "$ sh -c 'f() { local v=inside; echo \"$v\"; }; v=outside; f; echo \"$v\"'\n" +
              'inside\n' +
              'outside',
            ),
          ),
          options: [
            B(
              'All four probes failed, and the last one only appears to work because <code>local</code> was silently ignored — <code>v</code> was global throughout, which is why the outer value printed afterwards',
              'Cả bốn phép thăm dò đều hỏng, và cái cuối chỉ có VẺ chạy được vì <code>local</code> bị lờ đi trong im lặng — <code>v</code> vẫn là biến toàn cục suốt, và đó là lý do giá trị ở ngoài được in ra sau đó',
            ),
            B(
              'The first three failures prove dash is a different shell, but the fourth proves it is bash in disguise: only bash implements <code>local</code>, so Debian must symlink <code>/bin/sh</code> to a reduced bash rather than to a separate program',
              'Ba thất bại đầu chứng tỏ dash là một shell khác, nhưng cái thứ tư chứng tỏ nó là bash trá hình: chỉ bash mới cài đặt <code>local</code>, nên Debian hẳn đã trỏ <code>/bin/sh</code> vào một bản bash rút gọn chứ không phải một chương trình riêng',
            ),
            B(
              'Writing <code>#!/bin/sh</code> on top of a bash script really does cost you <code>[[ ]]</code>, arrays and <code>${var^^}</code> — but <b>not</b> <code>local</code>: dash supports it as a non-POSIX extension and the scoping works, as the <code>inside</code> / <code>outside</code> pair shows. The lesson text lists <code>local</code> among the missing features; the machine disagrees, and the exam follows the machine',
              'Viết <code>#!/bin/sh</code> lên đầu một script bash đúng là làm bạn mất <code>[[ ]]</code>, mảng và <code>${var^^}</code> — nhưng <b>KHÔNG</b> mất <code>local</code>: dash có hỗ trợ nó như một phần mở rộng ngoài POSIX và phạm vi hoạt động đúng, như cặp <code>inside</code> / <code>outside</code> cho thấy. Bài học liệt kê <code>local</code> vào nhóm tính năng thiếu; máy thì nói ngược lại, và đề bám theo MÁY',
            ),
            B(
              'The probes say nothing about dash: <code>sh -c</code> always runs the string through <code>/bin/sh</code> in POSIX mode, so the same four lines would fail identically if <code>/bin/sh</code> pointed at bash',
              'Mấy phép thăm dò đó chẳng nói gì về dash cả: <code>sh -c</code> luôn chạy chuỗi lệnh qua <code>/bin/sh</code> ở chế độ POSIX, nên đúng bốn dòng đó vẫn hỏng y hệt nếu <code>/bin/sh</code> trỏ vào bash',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured on Debian 12 with dash 0.5.12 — and it is the reason the shebang matters. <code>#!/usr/bin/env bash</code> looks bash up in <code>PATH</code>, which finds a Homebrew bash 5 on a machine whose <code>/bin/bash</code> is still the 3.2 that macOS ships. <code>#!/bin/sh</code> is a different language, and the failures are not always loud: a script that uses <code>[[ ]]</code> dies immediately, but one that relies on <code>${var^^}</code> only breaks on the line that uses it, possibly halfway through the job. Do not read a single working feature as proof the shell is compatible — <code>local</code> works here and three other things do not.',
            'Đo trên Debian 12 với dash 0.5.12 — và đó chính là lý do dòng shebang quan trọng. <code>#!/usr/bin/env bash</code> tra bash trong <code>PATH</code>, nên nó tìm ra bản bash 5 của Homebrew trên một máy mà <code>/bin/bash</code> vẫn là bản 3.2 macOS phát kèm. Còn <code>#!/bin/sh</code> là một ngôn ngữ khác, và những thất bại của nó không phải lúc nào cũng ồn ào: một script dùng <code>[[ ]]</code> thì chết ngay, còn một script trông cậy vào <code>${var^^}</code> thì chỉ vỡ đúng ở dòng dùng tới nó, có thể là giữa chừng công việc. Đừng đọc một tính năng chạy được thành bằng chứng rằng shell tương thích — <code>local</code> chạy được ở đây trong khi ba thứ khác thì không.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run of <code>u.sh</code>. Note the typo on line 4 — <code>PREFX</code>, not <code>PREFIX</code>.' + code(
              '#!/usr/bin/env bash\n' +
              'set -euo pipefail\n' +
              'PREFIX=/srv/app\n' +
              'echo "about to remove: $PREFX/data"\n' +
              'echo "never reached"\n' +
              '\n' +
              '$ bash u.sh; echo "exit=$?"\n' +
              'u.sh: line 4: PREFX: unbound variable\n' +
              'exit=1',
            ),
            'Chạy thật <code>u.sh</code>. Chú ý lỗi gõ nhầm ở dòng 4 — <code>PREFX</code> chứ không phải <code>PREFIX</code>.' + code(
              '#!/usr/bin/env bash\n' +
              'set -euo pipefail\n' +
              'PREFIX=/srv/app\n' +
              'echo "about to remove: $PREFX/data"\n' +
              'echo "never reached"\n' +
              '\n' +
              '$ bash u.sh; echo "exit=$?"\n' +
              'u.sh: line 4: PREFX: unbound variable\n' +
              'exit=1',
            ),
          ),
          options: [
            B(
              'The <code>-u</code> flag is doing the work: without it a misspelled variable expands to the empty string and the script carries on happily — which turns <code>rm -rf "$PREFX/data"</code> into <code>rm -rf "/data"</code>. Here it becomes a fatal error naming the exact variable and line, and the script stops before doing anything',
              'Cờ <code>-u</code> mới là thứ đang làm việc: thiếu nó thì một biến gõ sai khai triển thành chuỗi rỗng và script vui vẻ chạy tiếp — biến <code>rm -rf "$PREFX/data"</code> thành <code>rm -rf "/data"</code>. Ở đây nó thành một lỗi chí mạng nêu đích danh biến và số dòng, và script dừng lại trước khi làm bất cứ việc gì',
            ),
            B(
              'The <code>-e</code> flag is doing the work: <code>echo</code> returned non-zero because its argument could not be built, and <code>-e</code> stopped the script on that failure. With only <code>-u</code> the message would still appear but the script would continue to the last line',
              'Cờ <code>-e</code> mới là thứ đang làm việc: <code>echo</code> trả về khác 0 vì không dựng nổi tham số của nó, và <code>-e</code> dừng script ngay ở thất bại đó. Nếu chỉ có <code>-u</code> thì thông báo vẫn hiện nhưng script vẫn chạy tiếp tới dòng cuối',
            ),
            B(
              'The <code>-o pipefail</code> flag is doing the work: an unbound variable makes the implicit pipeline behind <code>echo</code> report a non-zero status, which is precisely the case <code>pipefail</code> exists to catch',
              'Cờ <code>-o pipefail</code> mới là thứ đang làm việc: một biến chưa đặt làm cái ống dẫn ngầm phía sau <code>echo</code> báo trạng thái khác 0, và đó chính là trường hợp mà <code>pipefail</code> sinh ra để bắt',
            ),
            B(
              'None of the flags matter here — bash always treats an unset variable inside double quotes as fatal, and <code>set -euo pipefail</code> only changes the exit code from 2 to 1',
              'Không cờ nào quan trọng ở đây cả — bash xưa nay luôn coi một biến chưa đặt nằm trong nháy kép là lỗi chí mạng, và <code>set -euo pipefail</code> chỉ đổi mã thoát từ 2 thành 1',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured. Each of the three flags covers a different failure: <code>-e</code> stops on the first failing command, <code>-u</code> turns a typo into an error instead of an empty string, and <code>-o pipefail</code> stops a pipeline from reporting the status of its last stage only. The one thing to remember about <code>-u</code> is that it also fires on variables you legitimately expect to be missing — so inside a cleanup handler, write <code>${tmpdir:-}</code>, or the handler itself becomes a second error that hides the first.',
            'Đã đo thật. Mỗi cờ trong ba cờ đó lo một kiểu hỏng khác nhau: <code>-e</code> dừng ở lệnh hỏng đầu tiên, <code>-u</code> biến một lỗi gõ nhầm thành lỗi thật thay vì thành chuỗi rỗng, và <code>-o pipefail</code> chặn một chuỗi ống chỉ báo trạng thái của chặng cuối. Điều duy nhất cần nhớ về <code>-u</code> là nó cũng nổ với những biến mà bạn hoàn toàn có lý do để chờ đợi chúng vắng mặt — nên bên trong một bộ xử lý dọn dẹp, hãy viết <code>${tmpdir:-}</code>, không thì chính bộ dọn dẹp trở thành lỗi thứ hai che mất lỗi thứ nhất.',
          ),
        }),

        mcq({
          prompt: B(
            'Real output. The first stage of the pipeline fails; the last two succeed.' + code(
              'false | true | true\n' +
              'echo "plain    : \\$?=$? PIPESTATUS=(${PIPESTATUS[@]})"\n' +
              'set -o pipefail\n' +
              'false | true | true\n' +
              'echo "pipefail : \\$?=$? PIPESTATUS=(${PIPESTATUS[@]})"\n' +
              '\n' +
              'plain    : $?=0 PIPESTATUS=(1 0 0)\n' +
              'pipefail : $?=1 PIPESTATUS=(1 0 0)',
            ),
            'Output thật. Chặng đầu của ống dẫn thất bại; hai chặng sau thành công.' + code(
              'false | true | true\n' +
              'echo "plain    : \\$?=$? PIPESTATUS=(${PIPESTATUS[@]})"\n' +
              'set -o pipefail\n' +
              'false | true | true\n' +
              'echo "pipefail : \\$?=$? PIPESTATUS=(${PIPESTATUS[@]})"\n' +
              '\n' +
              'plain    : $?=0 PIPESTATUS=(1 0 0)\n' +
              'pipefail : $?=1 PIPESTATUS=(1 0 0)',
            ),
          ),
          options: [
            B(
              '<code>pipefail</code> re-runs the pipeline so that the failing stage is executed last, which is how its status reaches <code>$?</code>; <code>PIPESTATUS</code> is unchanged because it records the original run',
              '<code>pipefail</code> chạy lại chuỗi ống sao cho chặng hỏng được thực thi sau cùng, và đó là cách trạng thái của nó tới được <code>$?</code>; <code>PIPESTATUS</code> không đổi vì nó ghi lại lần chạy gốc',
            ),
            B(
              'By default a pipeline\'s status is the status of its <b>last</b> stage only, so a failure anywhere earlier is invisible in <code>$?</code>. <code>pipefail</code> changes that to "the rightmost non-zero status, or 0 if none". <code>PIPESTATUS</code> is unaffected by the option — it always holds one status per stage, and it is how you find out <em>which</em> stage failed',
              'Mặc định thì trạng thái của một chuỗi ống là trạng thái của chặng <b>CUỐI</b> mà thôi, nên một thất bại ở bất kỳ chặng nào trước đó đều vô hình trong <code>$?</code>. <code>pipefail</code> đổi luật đó thành "trạng thái khác 0 nằm bên phải nhất, hoặc 0 nếu không có". <code>PIPESTATUS</code> không chịu ảnh hưởng của tuỳ chọn này — nó luôn giữ một trạng thái cho mỗi chặng, và đó là cách bạn tìm ra chặng NÀO đã hỏng',
            ),
            B(
              '<code>PIPESTATUS</code> is only populated when <code>pipefail</code> is on; the first line printed <code>(1 0 0)</code> because the array still held the values from a previous pipeline in the same shell',
              '<code>PIPESTATUS</code> chỉ được điền khi <code>pipefail</code> bật; dòng đầu in ra <code>(1 0 0)</code> vì cái mảng vẫn còn giữ giá trị của một chuỗi ống trước đó trong cùng shell',
            ),
            B(
              'Both lines report the same underlying value and the difference is cosmetic: <code>pipefail</code> makes <code>$?</code> print the count of failed stages, which happens to be 1 here because exactly one stage failed',
              'Cả hai dòng đều báo cùng một giá trị nền và khác biệt chỉ là hình thức: <code>pipefail</code> làm <code>$?</code> in ra SỐ LƯỢNG chặng đã hỏng, ở đây tình cờ là 1 vì đúng một chặng hỏng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured. This is why <code>curl -sf https://bad-url/ | jq .</code> "succeeds" in a plain script: <code>jq</code> was perfectly happy processing nothing. Two practical notes. Under <code>set -e</code>, <code>pipefail</code> is what makes such a pipeline actually stop the script — the three flags of strict mode are a set, not three independent conveniences. And <code>PIPESTATUS</code> is volatile: it is rebuilt by the very next command, so capture it in one go — <code>rc=("${PIPESTATUS[@]}")</code> on the line immediately after the pipeline.',
            'Đã đo thật. Đây là lý do <code>curl -sf https://bad-url/ | jq .</code> "thành công" trong một script thường: <code>jq</code> hoàn toàn vui vẻ khi xử lý một mớ rỗng. Hai lưu ý thực tế. Dưới <code>set -e</code> thì chính <code>pipefail</code> mới làm một chuỗi ống như vậy thật sự dừng được script — ba cờ của chế độ nghiêm ngặt là một BỘ, không phải ba tiện ích độc lập. Và <code>PIPESTATUS</code> rất dễ bay: nó bị dựng lại ngay bởi câu lệnh kế tiếp, nên hãy hứng nó một lần — <code>rc=("${PIPESTATUS[@]}")</code> ở đúng dòng ngay sau chuỗi ống.',
          ),
        }),

        mcq({
          prompt: B(
            'Two scripts differ only in the quotes around the trap handler. Both were run for real; the failing command is on the last line of each.' + code(
              '# e1.sh                                    # e3.sh\n' +
              'set -e                                     set -e\n' +
              "trap 'echo \"ERR at line $LINENO\"' ERR      trap \"echo ERR at line $LINENO\" ERR\n" +
              'true                                       true\n' +
              'false                                      true\n' +
              '                                           false\n' +
              '\n' +
              '$ bash e1.sh   ->  ERR at line 5\n' +
              '$ bash e3.sh   ->  ERR at line 3',
            ),
            'Hai script chỉ khác nhau ở loại nháy bao quanh thân trap. Cả hai đều đã chạy thật; lệnh gây lỗi nằm ở dòng cuối của mỗi file.' + code(
              '# e1.sh                                    # e3.sh\n' +
              'set -e                                     set -e\n' +
              "trap 'echo \"ERR at line $LINENO\"' ERR      trap \"echo ERR at line $LINENO\" ERR\n" +
              'true                                       true\n' +
              'false                                      true\n' +
              '                                           false\n' +
              '\n' +
              '$ bash e1.sh   ->  ERR at line 5\n' +
              '$ bash e3.sh   ->  ERR at line 3',
            ),
          ),
          options: [
            B(
              'e3 reported 3 because <code>set -e</code> counts lines from the last successful command, and the two <code>true</code> lines reset that counter; single quotes make the trap report absolute line numbers instead',
              'e3 báo 3 vì <code>set -e</code> đếm dòng kể từ lệnh thành công gần nhất, và hai dòng <code>true</code> đã đặt lại bộ đếm đó; nháy đơn làm trap báo số dòng tuyệt đối',
            ),
            B(
              'e3 reported 3 because a double-quoted trap body is registered as a string that bash re-parses on every signal, and re-parsing restarts <code>LINENO</code> from the trap statement each time',
              'e3 báo 3 vì thân trap trong nháy kép được đăng ký thành một chuỗi mà bash phân tích lại ở mỗi lần có tín hiệu, và việc phân tích lại đó khởi động <code>LINENO</code> từ chính câu lệnh trap mỗi lần',
            ),
            B(
              'The handler body is an ordinary string argument, so double quotes let the shell expand <code>$LINENO</code> <b>once</b> — when the <code>trap</code> line itself runs, which is line 3. Single quotes keep the text unexpanded until the trap actually fires, so <code>$LINENO</code> is then the line that failed. Handler bodies belong in single quotes for exactly this reason',
              'Thân bộ xử lý là một tham số chuỗi bình thường, nên nháy kép để shell khai triển <code>$LINENO</code> <b>một lần duy nhất</b> — vào lúc chính dòng <code>trap</code> chạy, tức dòng 3. Nháy đơn giữ nguyên văn bản chưa khai triển cho tới khi trap thật sự nổ, và lúc đó <code>$LINENO</code> mới là dòng bị hỏng. Thân bộ xử lý phải nằm trong nháy ĐƠN đúng vì lý do này',
            ),
            B(
              'The two files simply have their failing lines in different places — 5 and 3 — and the quoting makes no difference at all; the transcript shows two correct reports of two different scripts',
              'Hai file chỉ đơn giản là có dòng hỏng ở hai vị trí khác nhau — 5 và 3 — và loại nháy chẳng khác gì nhau cả; đoạn ghi cho thấy hai báo cáo đúng của hai script khác nhau',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured — and note that in e3 the failing command really is on line 6, yet the handler insists it was line 3, which is worse than no message at all because it sends you to the wrong place. The full-strength version is <code>trap \'on_error $LINENO\' ERR</code> with a handler that also reads <code>$?</code> and <code>$BASH_COMMAND</code>, giving you "line 42 exited with 22: curl -sSf https://api.example.com/data". The same single-quote rule applies to <code>trap \'rm -rf "$tmpdir"\' EXIT</code>: with double quotes the path is baked in at registration time, so a <code>tmpdir</code> assigned afterwards is never cleaned up.',
            'Đã đo thật — và hãy chú ý rằng trong e3 thì lệnh hỏng thật ra nằm ở dòng 6, vậy mà bộ xử lý một mực khẳng định là dòng 3, thứ còn tệ hơn cả không có thông báo nào vì nó đẩy bạn tới nhầm chỗ. Bản đầy đủ là <code>trap \'on_error $LINENO\' ERR</code> với một bộ xử lý đọc thêm <code>$?</code> và <code>$BASH_COMMAND</code>, cho bạn dòng "line 42 exited with 22: curl -sSf https://api.example.com/data". Cùng cái luật nháy đơn ấy áp dụng cho <code>trap \'rm -rf "$tmpdir"\' EXIT</code>: dùng nháy kép là đường dẫn bị nướng cứng ngay lúc đăng ký, nên một <code>tmpdir</code> gán sau đó sẽ không bao giờ được dọn.',
          ),
        }),

        mcq({
          prompt: B(
            'Two cleanup handlers, both on <code>trap cleanup EXIT</code>, in scripts that end with <code>exit 3</code>. Real output:' + code(
              '# c1.sh\n' +
              'cleanup() { rm -f /tmp/gone 2>/dev/null; echo "rc seen = $?"; }\n' +
              '$ bash c1.sh; echo "script exit=$?"\n' +
              'rc seen = 0\n' +
              'script exit=3\n' +
              '\n' +
              '# c2.sh\n' +
              'cleanup() { local rc=$?; rm -f /tmp/gone 2>/dev/null; echo "rc seen = $rc"; }\n' +
              '$ bash c2.sh; echo "script exit=$?"\n' +
              'rc seen = 3\n' +
              'script exit=3',
            ),
            'Hai bộ xử lý dọn dẹp, cả hai cùng gắn bằng <code>trap cleanup EXIT</code>, trong những script kết thúc bằng <code>exit 3</code>. Output thật:' + code(
              '# c1.sh\n' +
              'cleanup() { rm -f /tmp/gone 2>/dev/null; echo "rc seen = $?"; }\n' +
              '$ bash c1.sh; echo "script exit=$?"\n' +
              'rc seen = 0\n' +
              'script exit=3\n' +
              '\n' +
              '# c2.sh\n' +
              'cleanup() { local rc=$?; rm -f /tmp/gone 2>/dev/null; echo "rc seen = $rc"; }\n' +
              '$ bash c2.sh; echo "script exit=$?"\n' +
              'rc seen = 3\n' +
              'script exit=3',
            ),
          ),
          options: [
            B(
              'The handler starts with <code>$?</code> holding the script\'s exit code, but <b>every</b> command inside it overwrites that value — here the <code>rm</code>, which succeeded. Capturing it on the very first line is the only way to still have it later, which is why a cleanup handler that reports "failed with code N" must begin with <code>local rc=$?</code>',
              'Bộ xử lý bắt đầu với <code>$?</code> đang giữ mã thoát của script, nhưng <b>MỌI</b> lệnh bên trong nó đều đè lên giá trị đó — ở đây là lệnh <code>rm</code>, thứ đã chạy thành công. Hứng nó ngay ở dòng đầu tiên là cách duy nhất để về sau vẫn còn nó, và đó là lý do một bộ xử lý dọn dẹp muốn báo "hỏng với mã N" thì phải mở đầu bằng <code>local rc=$?</code>',
            ),
            B(
              'The difference is <code>local</code>: without it <code>rc</code> would be global, and a global variable is reset to 0 when the EXIT trap fires. Writing <code>rc=$?</code> without <code>local</code> on the first line would print 0 just like c1',
              'Khác biệt nằm ở <code>local</code>: thiếu nó thì <code>rc</code> là biến toàn cục, mà biến toàn cục bị đặt lại về 0 khi trap EXIT nổ. Viết <code>rc=$?</code> không có <code>local</code> ở dòng đầu thì vẫn in ra 0 y như c1',
            ),
            B(
              'c1 printed 0 because <code>rm -f</code> never fails, and <code>-f</code> is what suppressed the real status; using plain <code>rm</code> with the error redirected would have let the 3 through unchanged',
              'c1 in ra 0 vì <code>rm -f</code> không bao giờ hỏng, và chính cờ <code>-f</code> đã chặn mất trạng thái thật; dùng <code>rm</code> trơn với lỗi được chuyển hướng thì số 3 đã đi qua nguyên vẹn',
            ),
            B(
              'An EXIT trap always sees <code>$?</code> as 0 by design, because the trap runs after the exit status has been handed to the parent; c2 works only because <code>local</code> reads a separate copy that bash keeps for handlers',
              'Một trap EXIT xưa nay luôn thấy <code>$?</code> bằng 0 theo thiết kế, vì trap chạy sau khi mã thoát đã được giao cho tiến trình cha; c2 chạy được chỉ vì <code>local</code> đọc một bản sao riêng mà bash giữ lại cho các bộ xử lý',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured. Note that the script itself still exited 3 in both cases — the handler misreporting the code does not change it. Two more rules for the same handler. Guard every variable with <code>${var:-}</code>, because under <code>set -u</code> the trap can fire <em>before</em> those variables were ever assigned, if the script died early. And never let cleanup fail: redirect its errors and tolerate them, since a handler that itself errors under <code>set -e</code> masks the original problem entirely.',
            'Đã đo thật. Chú ý rằng bản thân script vẫn thoát với mã 3 trong cả hai trường hợp — bộ xử lý báo sai mã không làm đổi mã đó. Thêm hai luật nữa cho cùng bộ xử lý ấy. Hãy bọc mọi biến bằng <code>${var:-}</code>, vì dưới <code>set -u</code> thì trap có thể nổ TRƯỚC khi những biến đó kịp được gán, nếu script chết sớm. Và đừng bao giờ để phần dọn dẹp thất bại: chuyển hướng lỗi của nó đi và chấp nhận nó hỏng, vì một bộ xử lý tự nó báo lỗi dưới <code>set -e</code> sẽ che mất hoàn toàn vấn đề gốc.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run of a script whose option loop is <code>while getopts ":vo:" opt; do … done</code>, with <code>\\?)</code> and <code>:)</code> branches that print their own messages and <code>exit 2</code>.' + code(
              '$ ./g.sh -v -o out.txt a b\n' +
              'verbose\n' +
              'output=out.txt\n' +
              'remaining=[a b]\n' +
              'exit=0\n' +
              '\n' +
              '$ ./g.sh -o\n' +
              'option -o needs a value\n' +
              'exit=2\n' +
              '\n' +
              '$ ./g.sh -z\n' +
              'unknown option: -z\n' +
              'exit=2',
            ),
            'Chạy thật một script có vòng lặp tuỳ chọn là <code>while getopts ":vo:" opt; do … done</code>, với hai nhánh <code>\\?)</code> và <code>:)</code> tự in thông báo riêng rồi <code>exit 2</code>.' + code(
              '$ ./g.sh -v -o out.txt a b\n' +
              'verbose\n' +
              'output=out.txt\n' +
              'remaining=[a b]\n' +
              'exit=0\n' +
              '\n' +
              '$ ./g.sh -o\n' +
              'option -o needs a value\n' +
              'exit=2\n' +
              '\n' +
              '$ ./g.sh -z\n' +
              'unknown option: -z\n' +
              'exit=2',
            ),
          ),
          options: [
            B(
              'The leading colon makes every option optional, which is why <code>-o</code> with no value reached the <code>:)</code> branch instead of aborting; the colon after <code>o</code> is what supplies the default value found in <code>$OPTARG</code>',
              'Dấu hai chấm đứng đầu làm mọi tuỳ chọn thành không bắt buộc, và đó là lý do <code>-o</code> không kèm giá trị lại rẽ vào nhánh <code>:)</code> thay vì dừng hẳn; dấu hai chấm sau chữ <code>o</code> mới là thứ cung cấp giá trị mặc định tìm thấy trong <code>$OPTARG</code>',
            ),
            B(
              'The leading colon enables long options, so this same loop would also accept <code>--verbose</code>; the two error branches exist to catch the GNU-style forms that <code>getopts</code> cannot map to a single letter',
              'Dấu hai chấm đứng đầu bật hỗ trợ tuỳ chọn dài, nên chính vòng lặp đó cũng nhận được <code>--verbose</code>; hai nhánh lỗi tồn tại để bắt các dạng kiểu GNU mà <code>getopts</code> không ánh xạ được về một chữ cái đơn',
            ),
            B(
              'The leading colon is only a separator between the option letters and has no effect at all; the two branches work because <code>\\?</code> and <code>:</code> are ordinary patterns matching the literal option characters typed by the user',
              'Dấu hai chấm đứng đầu chỉ là dấu ngăn giữa các chữ cái tuỳ chọn và hoàn toàn không có tác dụng gì; hai nhánh đó chạy được vì <code>\\?</code> và <code>:</code> là những mẫu bình thường khớp với đúng ký tự tuỳ chọn mà người dùng gõ vào',
            ),
            B(
              'The leading colon turns on <b>silent error handling</b>: instead of <code>getopts</code> printing its own message, it sets <code>opt</code> to <code>?</code> for an unknown option or <code>:</code> for a missing value, puts the offending letter in <code>OPTARG</code>, and leaves the wording and the exit code to you. The colon <em>after</em> a letter is separate — it declares that the option takes a value',
              'Dấu hai chấm đứng đầu bật <b>chế độ báo lỗi im lặng</b>: thay vì <code>getopts</code> tự in thông báo của nó, nó đặt <code>opt</code> thành <code>?</code> khi gặp tuỳ chọn lạ hoặc thành <code>:</code> khi thiếu giá trị, bỏ chữ cái gây lỗi vào <code>OPTARG</code>, và để phần câu chữ lẫn mã thoát cho bạn quyết. Dấu hai chấm đứng SAU một chữ cái thì là chuyện khác — nó khai rằng tuỳ chọn đó nhận một giá trị',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured. Two things this transcript also shows. <code>remaining=[a b]</code> proves the loop was followed by <code>shift $((OPTIND - 1))</code> — without it the positional arguments would still contain <code>-v</code> and <code>-o</code>, and the script would go looking for a file called <code>-v</code>. And option bundling comes free: <code>-vo out.txt</code> behaves exactly like <code>-v -o out.txt</code>. The limitation to remember is that <code>getopts</code> handles <b>short options only</b> — there is no way to add <code>--dry-run</code> to it, which is why long options need a hand-written <code>while [[ $# -gt 0 ]]; do case $1 in …</code> loop instead. (Do not reach for <code>getopt</code> without the s: it is a separate external program with real portability problems.)',
            'Đã đo thật. Đoạn ghi này còn cho thấy hai điều nữa. Dòng <code>remaining=[a b]</code> chứng tỏ sau vòng lặp có <code>shift $((OPTIND - 1))</code> — thiếu nó thì các tham số vị trí vẫn còn chứa <code>-v</code> và <code>-o</code>, và script sẽ đi tìm một file tên là <code>-v</code>. Và việc gộp tuỳ chọn thì có sẵn miễn phí: <code>-vo out.txt</code> hành xử y hệt <code>-v -o out.txt</code>. Giới hạn cần nhớ là <code>getopts</code> chỉ xử lý <b>tuỳ chọn ngắn</b> — không có cách nào thêm <code>--dry-run</code> vào nó, và đó là lý do tuỳ chọn dài cần một vòng lặp tự viết <code>while [[ $# -gt 0 ]]; do case $1 in …</code>. (Đừng với tay lấy <code>getopt</code> không có chữ s: đó là một chương trình ngoài riêng biệt với những vấn đề khả chuyển thật sự.)',
          ),
        }),

        mcq({
          prompt: B(
            'Real output. <code>NAME</code> holds <code>deploy.sh</code>. The two heredocs differ only in the quotes around the delimiter.' + code(
              '$ cat <<EOF\n' +
              'usage: $NAME [options]\n' +
              'EOF\n' +
              'usage: deploy.sh [options]\n' +
              '\n' +
              "$ cat <<'EOF'\n" +
              'usage: $NAME [options]\n' +
              'EOF\n' +
              'usage: $NAME [options]',
            ),
            'Output thật. <code>NAME</code> giữ giá trị <code>deploy.sh</code>. Hai heredoc chỉ khác nhau ở dấu nháy quanh từ kết thúc.' + code(
              '$ cat <<EOF\n' +
              'usage: $NAME [options]\n' +
              'EOF\n' +
              'usage: deploy.sh [options]\n' +
              '\n' +
              "$ cat <<'EOF'\n" +
              'usage: $NAME [options]\n' +
              'EOF\n' +
              'usage: $NAME [options]',
            ),
          ),
          options: [
            B(
              'Quoting the delimiter makes the heredoc read from a file called <code>EOF</code> instead of from the following lines, and the second block printed the literal text because no such file existed',
              'Đặt từ kết thúc trong nháy làm heredoc đọc từ một file tên là <code>EOF</code> thay vì từ các dòng phía sau, và khối thứ hai in ra đúng nguyên văn vì không có file nào như thế',
            ),
            B(
              'An unquoted delimiter lets the body behave like a double-quoted string — <code>$var</code>, <code>$(cmd)</code> and <code>$((math))</code> all expand — while quoting the delimiter (<code>&lt;&lt;\'EOF\'</code>) makes every character literal, like single quotes. For a <code>usage()</code> function you want the unquoted form, so the help text always shows the name the script was really invoked as',
              'Từ kết thúc KHÔNG đặt nháy cho phép phần thân hành xử như một chuỗi trong nháy kép — <code>$var</code>, <code>$(cmd)</code> và <code>$((math))</code> đều khai triển — còn đặt từ kết thúc trong nháy (<code>&lt;&lt;\'EOF\'</code>) làm mọi ký tự thành nguyên văn, giống nháy đơn. Với một hàm <code>usage()</code> thì bạn cần dạng KHÔNG nháy, để phần trợ giúp luôn hiện đúng cái tên mà script thật sự được gọi',
            ),
            B(
              'The quotes change which command reads the block: an unquoted delimiter hands the text to <code>cat</code>, a quoted one hands it to the shell, and the shell prints variables by name rather than by value',
              'Dấu nháy đổi xem lệnh nào đọc cái khối đó: từ kết thúc không nháy thì giao văn bản cho <code>cat</code>, có nháy thì giao cho shell, và shell in biến ra theo TÊN chứ không theo giá trị',
            ),
            B(
              'The difference only affects backslashes and backticks; <code>$NAME</code> printed literally in the second block because <code>cat</code> received it after the variable had already been unset by the first heredoc',
              'Khác biệt chỉ ảnh hưởng tới dấu gạch chéo ngược và dấu huyền; <code>$NAME</code> in ra nguyên văn ở khối thứ hai vì <code>cat</code> nhận được nó sau khi biến đã bị xoá bởi heredoc thứ nhất',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured. The rule is worth stating as a pair, because you need both forms in the same script. Use <code>&lt;&lt;EOF</code> for a usage block or a generated config, where you <em>want</em> the values filled in. Use <code>&lt;&lt;\'EOF\'</code> for anything containing literal <code>$</code> — an awk program, a systemd unit template, a <code>.env</code> file you are writing out, a snippet of shell to be run on another machine. Getting it backwards on the last of those is how a deploy script accidentally expands a remote variable locally, sending an empty string across the wire.',
            'Đã đo thật. Cái luật này đáng phát biểu thành một cặp, vì bạn cần cả hai dạng trong cùng một script. Dùng <code>&lt;&lt;EOF</code> cho một khối hướng dẫn dùng lệnh hay một file cấu hình sinh ra tự động, chỗ bạn MUỐN các giá trị được điền vào. Dùng <code>&lt;&lt;\'EOF\'</code> cho bất cứ thứ gì chứa dấu <code>$</code> nguyên văn — một chương trình awk, một khuôn unit của systemd, một file <code>.env</code> bạn đang ghi ra, một mẩu shell sẽ được chạy trên máy khác. Nhầm chiều ở cái cuối cùng chính là cách một script deploy vô tình khai triển một biến của máy ở xa ngay tại máy mình, rồi gửi một chuỗi rỗng qua đường truyền.',
          ),
        }),

        mcq({
          prompt: B(
            'The same three steps, written two ways. In both files the last line is <b>truncated</b> — the closing quote is missing, as if the file had been cut off mid-transfer. Real output:' + code(
              '# t1.sh — flat                       # t2.sh — wrapped\n' +
              '#!/usr/bin/env bash                  #!/usr/bin/env bash\n' +
              'echo "step 1: deleting"             main() {\n' +
              'echo "step 2: unpacking"              echo "step 1: deleting"\n' +
              'echo "step 3: restarting              echo "step 2: unpacking"\n' +
              '                                      echo "step 3: restarting\n' +
              '                                    }\n' +
              '                                    main "$@"\n' +
              '\n' +
              '$ bash t1.sh; echo "exit=$?"\n' +
              'step 1: deleting\n' +
              'step 2: unpacking\n' +
              "t1.sh: line 4: unexpected EOF while looking for matching `\"'\n" +
              'exit=2\n' +
              '\n' +
              '$ bash t2.sh; echo "exit=$?"\n' +
              "t2.sh: line 7: unexpected EOF while looking for matching `\"'\n" +
              'exit=2',
            ),
            'Cùng ba bước, viết theo hai cách. Ở cả hai file, dòng cuối bị <b>cắt cụt</b> — thiếu dấu nháy đóng, như thể file bị đứt giữa chừng lúc truyền. Output thật:' + code(
              '# t1.sh — phẳng                      # t2.sh — bọc trong hàm\n' +
              '#!/usr/bin/env bash                  #!/usr/bin/env bash\n' +
              'echo "step 1: deleting"             main() {\n' +
              'echo "step 2: unpacking"              echo "step 1: deleting"\n' +
              'echo "step 3: restarting              echo "step 2: unpacking"\n' +
              '                                      echo "step 3: restarting\n' +
              '                                    }\n' +
              '                                    main "$@"\n' +
              '\n' +
              '$ bash t1.sh; echo "exit=$?"\n' +
              'step 1: deleting\n' +
              'step 2: unpacking\n' +
              "t1.sh: line 4: unexpected EOF while looking for matching `\"'\n" +
              'exit=2\n' +
              '\n' +
              '$ bash t2.sh; echo "exit=$?"\n' +
              "t2.sh: line 7: unexpected EOF while looking for matching `\"'\n" +
              'exit=2',
            ),
          ),
          options: [
            B(
              'The flat script survived further because bash validates a script fully before running it and only aborts at the first <em>unrecoverable</em> construct; the function form failed earlier because a function body is parsed more strictly than top-level code',
              'Script phẳng đi được xa hơn vì bash kiểm tra toàn bộ script trước khi chạy và chỉ dừng ở cấu trúc KHÔNG CỨU VÃN được đầu tiên; dạng hàm hỏng sớm hơn vì thân hàm được phân tích chặt hơn mã ở cấp cao nhất',
            ),
            B(
              'Both behaved identically and the difference in output is only about buffering: <code>t2.sh</code> also ran the two echoes, but their output was still in the pipe when the shell aborted and was therefore discarded',
              'Cả hai hành xử y hệt nhau, khác biệt trong output chỉ là chuyện đệm: <code>t2.sh</code> cũng đã chạy hai lệnh echo, nhưng output của chúng vẫn còn nằm trong ống khi shell dừng lại nên bị vứt đi',
            ),
            B(
              'Bash reads and executes a script <b>incrementally</b>, so the flat version had already run two commands before the parser hit the end of the file. In the wrapped version the whole body lives inside a function definition, and the <code>main "$@"</code> that would invoke it sits after the broken line — so the parse fails before anything is ever called, and the machine is left untouched',
              'Bash đọc và chạy script <b>từng phần một</b>, nên bản phẳng đã kịp chạy hai câu lệnh trước khi bộ phân tích đụng phải chỗ cuối file. Ở bản bọc trong hàm thì cả thân nằm bên trong một định nghĩa hàm, và dòng <code>main "$@"</code> đáng lẽ gọi nó lại nằm sau dòng bị hỏng — nên việc phân tích hỏng trước khi có gì được gọi, và cái máy không hề bị đụng tới',
            ),
            B(
              'The wrapped version printed nothing because a function whose body contains a syntax error is silently defined as an empty function, so <code>main "$@"</code> ran and did nothing at all — which is why the exit code is 2 rather than 0',
              'Bản bọc trong hàm không in gì vì một hàm có thân chứa lỗi cú pháp sẽ được định nghĩa lặng lẽ thành hàm rỗng, nên <code>main "$@"</code> vẫn chạy và chẳng làm gì cả — và đó là lý do mã thoát là 2 chứ không phải 0',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured on bash 5.2.15 — and it is worth being precise about what <code>main "$@"</code> does and does not buy you. It protects against a file that ends early: a truncated download, an interrupted <code>scp</code>, a <code>curl … | bash</code> whose connection dropped. It does <b>not</b> protect against a syntax error that happens to sit after the <code>main "$@"</code> line; measured separately, a broken <code>if</code> appended below the call still let the whole body run before the parser complained. So the real value is "either the whole file arrived or nothing runs" — worth having, and worth pairing with <code>bash -n script.sh</code>, which parses without executing and is the shell\'s equivalent of a type check.',
            'Đo trên bash 5.2.15 — và đáng nói cho chính xác <code>main "$@"</code> mua cho bạn cái gì và không mua cái gì. Nó bảo vệ trước một file KẾT THÚC SỚM: một lần tải về bị cắt cụt, một lệnh <code>scp</code> đứt giữa chừng, một cú <code>curl … | bash</code> rớt kết nối. Nó <b>KHÔNG</b> bảo vệ trước một lỗi cú pháp tình cờ nằm SAU dòng <code>main "$@"</code>; đo riêng chuyện đó thì một câu <code>if</code> hỏng nối thêm phía dưới lời gọi vẫn để cả thân hàm chạy xong rồi bộ phân tích mới kêu. Vậy giá trị thật của nó là "hoặc cả file tới nơi, hoặc không gì chạy cả" — đáng có, và đáng đi kèm với <code>bash -n script.sh</code>, thứ phân tích mà không thực thi và là tương đương của một phép kiểm kiểu trong thế giới shell.',
          ),
        }),

        // ── Chương 8 — Môi trường, PATH & file khởi động ─────────────────
        mcq({
          prompt: B(
            'Real output on Debian 12. Read the three lines carefully.' + code(
              '$ type -a echo\n' +
              'echo is a shell builtin\n' +
              'echo is /usr/bin/echo\n' +
              'echo is /bin/echo\n' +
              '\n' +
              '$ type -t echo\n' +
              'builtin\n' +
              '\n' +
              '$ command -v echo\n' +
              'echo',
            ),
            'Output thật trên Debian 12. Hãy đọc kỹ ba dòng.' + code(
              '$ type -a echo\n' +
              'echo is a shell builtin\n' +
              'echo is /usr/bin/echo\n' +
              'echo is /bin/echo\n' +
              '\n' +
              '$ type -t echo\n' +
              'builtin\n' +
              '\n' +
              '$ command -v echo\n' +
              'echo',
            ),
          ),
          options: [
            B(
              'There are three separate <code>echo</code> programs and bash runs whichever appears first in <code>PATH</code>, so <code>/usr/bin/echo</code> is what actually executes; <code>type -t</code> says <code>builtin</code> only because it reports the <em>category</em> of the command name rather than of the winner',
              'Có ba chương trình <code>echo</code> riêng biệt và bash chạy cái xuất hiện trước nhất trong <code>PATH</code>, nên <code>/usr/bin/echo</code> mới là thứ thật sự thực thi; <code>type -t</code> nói <code>builtin</code> chỉ vì nó báo LOẠI của cái tên lệnh chứ không phải của cái thắng cuộc',
            ),
            B(
              '<code>type -a</code> lists every candidate in lookup order, and the builtin is listed first because a builtin beats any file on <code>PATH</code> — so the builtin is what runs. <code>command -v</code> confirms it by printing the bare word <code>echo</code> rather than a path, which is exactly how it reports a builtin, a function or an alias',
              '<code>type -a</code> liệt kê mọi ứng viên theo THỨ TỰ TRA CỨU, và lệnh dựng sẵn đứng đầu vì một lệnh dựng sẵn thắng mọi file nằm trên <code>PATH</code> — nên thứ chạy là lệnh dựng sẵn. <code>command -v</code> xác nhận điều đó bằng cách in ra chữ <code>echo</code> trơ trọi thay vì một đường dẫn, đúng như cách nó báo một lệnh dựng sẵn, một hàm hay một bí danh',
            ),
            B(
              'The listing is alphabetical rather than ordered, and <code>command -v</code> printed <code>echo</code> because the command was not found on <code>PATH</code> at all — the two files shown are hardlinks that <code>type</code> found by scanning the filesystem directly',
              'Danh sách đó xếp theo bảng chữ cái chứ không theo thứ tự, và <code>command -v</code> in ra <code>echo</code> vì lệnh đó hoàn toàn không tìm thấy trên <code>PATH</code> — hai file hiện ra là liên kết cứng mà <code>type</code> tìm được nhờ quét thẳng hệ thống file',
            ),
            B(
              'Bash consults the hash table before anything else, so the real winner is whichever <code>echo</code> was resolved most recently; <code>type -a</code> shows the builtin first only because the hash table was empty in this shell',
              'Bash tra bảng băm trước tất cả mọi thứ, nên kẻ thắng thật sự là cái <code>echo</code> nào được phân giải gần đây nhất; <code>type -a</code> hiện lệnh dựng sẵn lên đầu chỉ vì bảng băm rỗng trong shell này',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured. The full order is alias, then function, then builtin, then the hash table of previously resolved paths, then a left-to-right <code>PATH</code> search. Because the builtin wins, a portable script cannot rely on <code>echo</code>\'s flags — bash\'s builtin and <code>/usr/bin/echo</code> disagree about <code>-e</code> and <code>-n</code>, and dash\'s <code>echo</code> disagrees with both, which is why <code>printf</code> is the portable choice. The tool habit is worth stating flatly: <code>type</code> for humans because it tells the whole truth including aliases and functions, <code>command -v</code> in scripts because it is a builtin that works everywhere, and never <code>which</code> — an external program that cannot see aliases or functions and has inconsistent exit codes between distributions.',
            'Đã đo thật. Thứ tự đầy đủ là bí danh, rồi hàm, rồi lệnh dựng sẵn, rồi bảng băm các đường dẫn đã phân giải trước đó, rồi mới tới việc quét <code>PATH</code> từ trái sang phải. Vì lệnh dựng sẵn thắng, một script mang tính khả chuyển không thể trông cậy vào các cờ của <code>echo</code> — lệnh dựng sẵn của bash và <code>/usr/bin/echo</code> bất đồng về <code>-e</code> và <code>-n</code>, còn <code>echo</code> của dash thì bất đồng với cả hai, và đó là lý do <code>printf</code> mới là lựa chọn khả chuyển. Thói quen công cụ đáng nói thẳng: <code>type</code> cho con người vì nó nói toàn bộ sự thật kể cả bí danh và hàm, <code>command -v</code> trong script vì nó là lệnh dựng sẵn và chạy được ở mọi nơi, và đừng bao giờ dùng <code>which</code> — một chương trình ngoài không nhìn thấy bí danh lẫn hàm và có mã thoát không nhất quán giữa các bản phân phối.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run of three subshells on Debian 12:' + code(
              '$ bash -c \'PATH="/opt/bin"; ls /tmp >/dev/null; echo "ls rc=$?"\'\n' +
              'bash: line 1: ls: command not found\n' +
              'ls rc=127\n' +
              '\n' +
              '$ bash -c \'PATH="/opt/bin"; grep --version >/dev/null; echo "grep rc=$?"\'\n' +
              'bash: line 1: grep: command not found\n' +
              'grep rc=127\n' +
              '\n' +
              '$ bash -c \'PATH="/opt/bin:$PATH"; ls /tmp >/dev/null; echo "rc=$?"\'\n' +
              'rc=0',
            ),
            'Chạy thật ba shell con trên Debian 12:' + code(
              '$ bash -c \'PATH="/opt/bin"; ls /tmp >/dev/null; echo "ls rc=$?"\'\n' +
              'bash: line 1: ls: command not found\n' +
              'ls rc=127\n' +
              '\n' +
              '$ bash -c \'PATH="/opt/bin"; grep --version >/dev/null; echo "grep rc=$?"\'\n' +
              'bash: line 1: grep: command not found\n' +
              'grep rc=127\n' +
              '\n' +
              '$ bash -c \'PATH="/opt/bin:$PATH"; ls /tmp >/dev/null; echo "rc=$?"\'\n' +
              'rc=0',
            ),
          ),
          options: [
            B(
              'Assigning <code>PATH</code> without including <code>$PATH</code> <b>replaces</b> the whole list rather than adding to it, so every external command is gone at once — 127 is "command not found". The last line shows the fix: <code>$PATH</code> has to appear on one side of the new value',
              'Gán <code>PATH</code> mà không kèm <code>$PATH</code> là <b>THAY</b> cả danh sách chứ không phải thêm vào, nên mọi lệnh ngoài biến mất cùng lúc — 127 nghĩa là "không tìm thấy lệnh". Dòng cuối cho thấy cách sửa: <code>$PATH</code> phải xuất hiện ở một trong hai phía của giá trị mới',
            ),
            B(
              'The first two failed because <code>PATH</code> was assigned without <code>export</code>, so the value never reached the command lookup; the third worked because interpolating <code>$PATH</code> marks the variable as exported automatically',
              'Hai lệnh đầu hỏng vì <code>PATH</code> được gán mà không <code>export</code>, nên giá trị đó không bao giờ tới được bước tra cứu lệnh; lệnh thứ ba chạy được vì việc chèn <code>$PATH</code> vào tự động đánh dấu biến là đã export',
            ),
            B(
              'The first two failed because <code>/opt/bin</code> does not exist, and bash refuses to search a <code>PATH</code> containing a missing directory; adding the real directories in the third line gave it something valid to scan',
              'Hai lệnh đầu hỏng vì <code>/opt/bin</code> không tồn tại, và bash từ chối quét một <code>PATH</code> có chứa thư mục không có thật; thêm các thư mục thật vào ở dòng thứ ba là nó có chỗ hợp lệ để quét',
            ),
            B(
              'The first two failed because a quoted assignment to <code>PATH</code> is treated as a literal single directory name including the quotes; writing <code>PATH=/opt/bin</code> without quotes would have kept the system directories intact',
              'Hai lệnh đầu hỏng vì một phép gán có nháy vào <code>PATH</code> bị coi là một cái tên thư mục nguyên văn kể cả dấu nháy; viết <code>PATH=/opt/bin</code> không nháy thì các thư mục hệ thống đã còn nguyên',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured. What makes this worth memorising is the recovery: in a live shell every command you would reach for is now gone too, including the ones that would tell you what happened. The way out is <code>export PATH=/usr/bin:/bin</code> typed from memory, or simply opening a new shell. Two related habits. <b>Prepend</b> (<code>PATH="$HOME/.local/bin:$PATH"</code>) when you deliberately want to shadow a system version — that is how nvm and pyenv work; <b>append</b> (<code>PATH="$PATH:/opt/tools/bin"</code>) for third-party tools that must never override a system command. And in a script that needs a specific tool, do not assume <code>PATH</code> at all: check with <code>command -v docker &gt;/dev/null || die "docker not installed"</code>.',
            'Đã đo thật. Điều làm chuyện này đáng thuộc nằm ở khâu cứu vãn: trong một shell đang dùng thì mọi lệnh bạn định với tay lấy giờ cũng biến mất, kể cả những lệnh có thể cho bạn biết chuyện gì đã xảy ra. Đường ra là gõ <code>export PATH=/usr/bin:/bin</code> từ trí nhớ, hoặc đơn giản là mở một shell mới. Hai thói quen liên quan. <b>Thêm vào đầu</b> (<code>PATH="$HOME/.local/bin:$PATH"</code>) khi bạn CỐ Ý muốn che bản của hệ thống — nvm và pyenv làm đúng thế; <b>thêm vào cuối</b> (<code>PATH="$PATH:/opt/tools/bin"</code>) cho công cụ bên thứ ba không bao giờ được đè lên một lệnh hệ thống. Và trong một script cần một công cụ cụ thể thì đừng giả định gì về <code>PATH</code> cả: hãy kiểm bằng <code>command -v docker &gt;/dev/null || die "docker chưa được cài"</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. <code>BAR</code> was exported in the parent shell; <code>FOO</code> was never assigned there.' + code(
              '$ FOO=one bash -c \'echo "child sees: [$FOO]"\'\n' +
              'child sees: [one]\n' +
              '$ echo "parent sees: [${FOO:-<unset>}]"\n' +
              'parent sees: [<unset>]\n' +
              '\n' +
              '$ export BAR=keepme\n' +
              '$ env -u BAR bash -c \'echo "with env -u: [${BAR:-<unset>}]"\'\n' +
              'with env -u: [<unset>]\n' +
              '$ bash -c \'echo "without:     [$BAR]"\'\n' +
              'without:     [keepme]',
            ),
            'Chạy thật. <code>BAR</code> đã được export ở shell cha; <code>FOO</code> thì chưa từng được gán ở đó.' + code(
              '$ FOO=one bash -c \'echo "child sees: [$FOO]"\'\n' +
              'child sees: [one]\n' +
              '$ echo "parent sees: [${FOO:-<unset>}]"\n' +
              'parent sees: [<unset>]\n' +
              '\n' +
              '$ export BAR=keepme\n' +
              '$ env -u BAR bash -c \'echo "with env -u: [${BAR:-<unset>}]"\'\n' +
              'with env -u: [<unset>]\n' +
              '$ bash -c \'echo "without:     [$BAR]"\'\n' +
              'without:     [keepme]',
            ),
          ),
          options: [
            B(
              'A <code>KEY=value</code> prefix sets the variable in the current shell first and then unsets it again once the command returns, which is why the parent momentarily had it; <code>env -u</code> does the same thing in the opposite direction',
              'Một tiền tố <code>KEY=value</code> đặt biến vào shell hiện tại trước rồi bỏ đặt lại sau khi lệnh trả về, và đó là lý do shell cha đã từng có nó trong chốc lát; <code>env -u</code> làm đúng chuyện đó theo chiều ngược lại',
            ),
            B(
              'The prefix works only because <code>bash -c</code> was the command; with any other program the assignment would be passed as a normal argument, and <code>env -u</code> exists precisely to cover that case',
              'Tiền tố đó chạy được chỉ vì câu lệnh là <code>bash -c</code>; với bất kỳ chương trình nào khác thì phép gán sẽ được truyền vào như một tham số bình thường, và <code>env -u</code> tồn tại chính là để lo trường hợp đó',
            ),
            B(
              'A <code>KEY=value</code> prefix puts the variable into the environment of <b>that one command</b> and nothing else — the parent shell never had it, which makes it the safest way to try a setting. <code>env -u NAME</code> is the mirror image: it <em>removes</em> a variable for one command, leaving the parent\'s export intact, as the last line proves',
              'Một tiền tố <code>KEY=value</code> đưa biến vào môi trường của <b>đúng một câu lệnh đó</b> và không gì khác — shell cha chưa bao giờ có nó, và đó là điều làm cho đây là cách an toàn nhất để thử một thiết lập. <code>env -u TÊN</code> là hình ảnh phản chiếu: nó GỠ một biến cho đúng một lệnh, còn phần export của shell cha vẫn nguyên vẹn, như dòng cuối chứng minh',
            ),
            B(
              'Both forms edit the parent\'s environment permanently; the parent appeared to be unset only because <code>${FOO:-<unset>}</code> substitutes the fallback whenever the value came from a prefix rather than from <code>export</code>',
              'Cả hai dạng đều sửa môi trường của shell cha vĩnh viễn; shell cha có VẺ chưa đặt chỉ vì <code>${FOO:-<unset>}</code> thay giá trị dự phòng vào mỗi khi giá trị đó đến từ một tiền tố chứ không phải từ <code>export</code>',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured. The mental model that makes all of Chapter 8 fall into place is that a variable is not set on a machine or on a user — it is set on a <em>process</em>, copied to children at <code>fork</code>, and frozen from that moment. Nothing a child sets ever comes back. That is why "the script cannot see my variable" is nearly always a missing <code>export</code>, and why appending a line to a production <code>.env</code> while a container is already running changes nothing until the container is recreated. When an application insists a variable is missing, do not reason about which file should have set it — read what the process actually received: <code>tr \'\\0\' \'\\n\' &lt; /proc/&lt;pid&gt;/environ</code>.',
            'Đã đo thật. Mô hình tư duy làm cả Chương 8 rơi vào đúng chỗ là: một biến không được đặt lên một cái MÁY hay lên một NGƯỜI DÙNG — nó được đặt lên một TIẾN TRÌNH, được chép sang các tiến trình con lúc <code>fork</code>, và đóng băng từ khoảnh khắc đó. Không có gì tiến trình con đặt mà quay ngược lại được. Đó là lý do câu "script không thấy biến của tôi" gần như luôn là thiếu một lệnh <code>export</code>, và là lý do việc nối thêm một dòng vào file <code>.env</code> trên production trong khi container đã chạy chẳng thay đổi gì cho tới khi container được dựng lại. Khi một ứng dụng một mực nói rằng thiếu biến, đừng ngồi suy luận xem file nào đáng lẽ phải đặt nó — hãy đọc thứ tiến trình THẬT SỰ đã nhận: <code>tr \'\\0\' \'\\n\' &lt; /proc/&lt;pid&gt;/environ</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run of the same idea written twice — first as an alias, then as a function.' + code(
              "$ alias mkcd='mkdir -p $1 && cd $1'\n" +
              '$ mkcd newdir\n' +
              'mkdir: missing operand\n' +
              "Try 'mkdir --help' for more information.\n" +
              '\n' +
              '$ mkcd() { mkdir -p -- "$1" && cd -- "$1"; }\n' +
              "$ mkcd 'new dir'\n" +
              '$ pwd\n' +
              '/tmp/pt2/new dir',
            ),
            'Chạy thật cùng một ý tưởng viết theo hai cách — đầu tiên là bí danh, sau đó là hàm.' + code(
              "$ alias mkcd='mkdir -p $1 && cd $1'\n" +
              '$ mkcd newdir\n' +
              'mkdir: missing operand\n' +
              "Try 'mkdir --help' for more information.\n" +
              '\n' +
              '$ mkcd() { mkdir -p -- "$1" && cd -- "$1"; }\n' +
              "$ mkcd 'new dir'\n" +
              '$ pwd\n' +
              '/tmp/pt2/new dir',
            ),
          ),
          options: [
            B(
              'The alias failed because it used single quotes: <code>$1</code> never expanded, so <code>mkdir</code> received the literal two characters. Double quotes around the alias body would have made it work exactly like the function',
              'Bí danh hỏng vì nó dùng nháy đơn: <code>$1</code> không bao giờ khai triển, nên <code>mkdir</code> nhận đúng hai ký tự nguyên văn. Đổi sang nháy kép quanh thân bí danh là nó chạy y hệt cái hàm',
            ),
            B(
              'An alias is plain text substitution at the <b>start</b> of a command and has no parameters at all: <code>$1</code> is empty, so <code>mkdir -p</code> ran with no operand and the word <code>newdir</code> was appended to the very end of the expanded line. Anything that needs <code>$1</code>, a conditional or more than one command has to be a function',
              'Bí danh là phép thay văn bản thuần ở <b>ĐẦU</b> một câu lệnh và hoàn toàn không có tham số: <code>$1</code> là rỗng, nên <code>mkdir -p</code> chạy mà không có toán hạng nào, còn chữ <code>newdir</code> bị nối vào tận cuối dòng lệnh sau khi khai triển. Bất cứ thứ gì cần <code>$1</code>, một điều kiện, hay nhiều hơn một câu lệnh, đều phải là một HÀM',
            ),
            B(
              'The alias failed because <code>&amp;&amp;</code> is not allowed inside an alias body — bash stops the substitution at the first control operator, so only <code>mkdir -p</code> survived and everything after it was dropped',
              'Bí danh hỏng vì <code>&amp;&amp;</code> không được phép nằm trong thân bí danh — bash dừng phép thay thế ở toán tử điều khiển đầu tiên, nên chỉ <code>mkdir -p</code> sống sót còn mọi thứ sau nó bị bỏ',
            ),
            B(
              'Both forms are equivalent, and the alias only failed because it was defined and used in the same shell; sourcing it from <code>~/.bashrc</code> instead would have given the same result as the function',
              'Hai dạng là tương đương, và bí danh chỉ hỏng vì nó được định nghĩa và dùng trong cùng một shell; nạp nó từ <code>~/.bashrc</code> thì đã cho kết quả y như cái hàm',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured. The alias expanded to <code>mkdir -p  &amp;&amp; cd  newdir</code>, which is why the error names <code>mkdir</code>. Aliases have exactly one shape that works — pure shorthand where the arguments naturally land at the end, like <code>alias gs=\'git status -sb\'</code>. Two more limits worth knowing: aliases are <b>disabled in non-interactive shells</b>, so one you defined in <code>~/.bashrc</code> simply does not exist inside a script; and a function can be <code>source</code>d and reused by scripts, which an alias effectively cannot. Note also the function\'s <code>--</code> and its quotes: they are what let it handle <code>new dir</code>, and would let it handle a directory named <code>-rf</code>.',
            'Đã đo thật. Bí danh đó khai triển thành <code>mkdir -p  &amp;&amp; cd  newdir</code>, và đó là lý do thông báo lỗi nêu tên <code>mkdir</code>. Bí danh chỉ có đúng một hình dạng chạy được — viết tắt thuần tuý, nơi các tham số tự nhiên rơi xuống cuối, kiểu <code>alias gs=\'git status -sb\'</code>. Thêm hai giới hạn đáng biết: bí danh bị <b>TẮT trong shell không tương tác</b>, nên một cái bạn định nghĩa trong <code>~/.bashrc</code> đơn giản là không tồn tại bên trong một script; và một hàm thì <code>source</code> được rồi script dùng lại được, còn bí danh thì trên thực tế là không. Cũng để ý dấu <code>--</code> và các dấu nháy của cái hàm: chính chúng cho phép nó xử lý được <code>new dir</code>, và cũng sẽ xử lý được một thư mục tên là <code>-rf</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A <code>.env</code> file contains one line with an <b>unquoted</b> value that has a space in it. Both of the usual ways to load it were run for real:' + code(
              '$ cat u.env\n' +
              'GREETING=hello world\n' +
              '\n' +
              "$ env $(grep -v '^#' u.env | xargs) bash -c 'echo \"[$GREETING]\"'\n" +
              "env: 'world': No such file or directory\n" +
              '\n' +
              "$ ( set -a; . ./u.env; set +a; bash -c 'echo \"[$GREETING]\"' )\n" +
              './u.env: line 1: world: command not found\n' +
              '[]\n' +
              '\n' +
              '$ cat q.env\n' +
              'GREETING="hello world"\n' +
              "$ ( set -a; . ./q.env; set +a; bash -c 'echo \"[$GREETING]\"' )\n" +
              '[hello world]',
            ),
            'Một file <code>.env</code> chứa một dòng có giá trị <b>KHÔNG đặt nháy</b> và bên trong có dấu cách. Cả hai cách nạp quen thuộc đều đã được chạy thật:' + code(
              '$ cat u.env\n' +
              'GREETING=hello world\n' +
              '\n' +
              "$ env $(grep -v '^#' u.env | xargs) bash -c 'echo \"[$GREETING]\"'\n" +
              "env: 'world': No such file or directory\n" +
              '\n' +
              "$ ( set -a; . ./u.env; set +a; bash -c 'echo \"[$GREETING]\"' )\n" +
              './u.env: line 1: world: command not found\n' +
              '[]\n' +
              '\n' +
              '$ cat q.env\n' +
              'GREETING="hello world"\n' +
              "$ ( set -a; . ./q.env; set +a; bash -c 'echo \"[$GREETING]\"' )\n" +
              '[hello world]',
            ),
          ),
          options: [
            B(
              'Only the <code>xargs</code> form is broken, as the lesson says; the <code>set -a</code> form failed here purely because it was run inside a subshell, and removing the surrounding parentheses would make it work on the unquoted file too. The parentheses are what threw the assignment away before <code>bash -c</code> could inherit it',
              'Chỉ dạng <code>xargs</code> là hỏng, đúng như bài học nói; dạng <code>set -a</code> hỏng ở đây thuần tuý vì nó chạy bên trong một shell con, bỏ cặp ngoặc bao quanh đi là nó chạy được cả với file không nháy. Chính cặp ngoặc đó đã vứt phép gán đi trước khi <code>bash -c</code> kịp thừa kế nó',
            ),
            B(
              '<code>set -a</code> only exports variables that were already defined before it was turned on, so <code>GREETING</code> was never exported; the quoted file worked because quoting a value also marks it for export, which is the behaviour the <code>allexport</code> option is named after',
              '<code>set -a</code> chỉ export những biến đã được định nghĩa trước khi nó được bật, nên <code>GREETING</code> chưa bao giờ được export; file có nháy chạy được vì việc đặt giá trị trong nháy cũng đánh dấu nó để export, và đó chính là hành vi mà tuỳ chọn <code>allexport</code> được đặt tên theo',
            ),
            B(
              'Both failures come from <code>grep</code>: it strips the quotes from values as it filters comments, and the <code>set -a</code> form inherited the damaged line because <code>source</code> re-reads whatever <code>grep</code> last produced; feeding the file straight to <code>source</code> without the filter would have kept both words together',
              'Cả hai thất bại đều do <code>grep</code>: nó bóc dấu nháy khỏi giá trị trong lúc lọc chú thích, và dạng <code>set -a</code> thừa hưởng cái dòng đã hỏng đó vì <code>source</code> đọc lại thứ mà <code>grep</code> vừa tạo ra; đưa thẳng file cho <code>source</code> mà không qua bộ lọc thì hai chữ đã dính liền nhau',
            ),
            B(
              'Both forms break on the same file, for two different reasons. The <code>xargs</code> form goes through word splitting, so <code>hello</code> and <code>world</code> arrive as separate arguments and <code>env</code> tries to run <code>world</code>. And <code>source</code> does not parse key–value pairs at all — it executes the file as <b>shell code</b>, so <code>GREETING=hello world</code> is an assignment <em>plus a command</em>. Neither is safe unless the file itself quotes the value, as <code>q.env</code> does',
              'Cả hai dạng đều vỡ trên cùng một file, vì hai lý do khác nhau. Dạng <code>xargs</code> đi qua phép cắt từ, nên <code>hello</code> và <code>world</code> tới nơi thành hai tham số riêng và <code>env</code> cố chạy <code>world</code>. Còn <code>source</code> thì hoàn toàn không phân tích cặp khoá–giá trị — nó THỰC THI file như <b>mã shell</b>, nên <code>GREETING=hello world</code> là một phép gán CỘNG THÊM một câu lệnh. Không dạng nào an toàn trừ phi chính cái file đặt giá trị trong nháy, như <code>q.env</code> làm',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured — and this is a place where the lesson text is too generous: it calls <code>set -a; source .env; set +a</code> "the correct incantation" and only warns about the <code>xargs</code> form. On an unquoted value with a space, <b>both</b> fail, and the <code>source</code> version fails in the more alarming way — it printed an error and then carried on with <code>GREETING</code> empty. That last point is the security half of the same fact: <code>source</code> runs the file, so a <code>.env</code> that arrived from a colleague, a CI artefact or an unfamiliar repository is code you are about to execute as yourself. A line of <code>rm -rf /tmp/important</code> in it simply runs. The safe answer is to let the application parse the file — dotenv, Prisma and Compose all read it themselves and handle quoting and <code>#</code> properly.',
            'Đã đo thật — và đây là chỗ giáo trình rộng lượng quá tay: nó gọi <code>set -a; source .env; set +a</code> là "cách đọc đúng" và chỉ cảnh báo về dạng <code>xargs</code>. Với một giá trị không nháy có dấu cách thì <b>CẢ HAI</b> đều hỏng, và bản <code>source</code> hỏng theo kiểu đáng lo hơn — nó in ra một lỗi rồi vẫn chạy tiếp với <code>GREETING</code> rỗng. Ý cuối đó chính là nửa an ninh của cùng một sự thật: <code>source</code> CHẠY cái file, nên một file <code>.env</code> đến từ đồng nghiệp, từ một hiện vật CI hay từ một kho mã lạ là mã mà bạn sắp thực thi với danh nghĩa của chính mình. Một dòng <code>rm -rf /tmp/important</code> nằm trong đó sẽ cứ thế chạy. Câu trả lời an toàn là để chính ứng dụng phân tích file — dotenv, Prisma và Compose đều tự đọc và xử lý đúng cả dấu nháy lẫn dấu <code>#</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. A process was started with a secret in its environment, and then its environment was read back from another shell:' + code(
              '$ env SECRET_TOKEN=sk-live-abc123 tail -f /dev/null >/dev/null 2>&1 &\n' +
              "$ tr '\\0' '\\n' < /proc/$!/environ | grep SECRET\n" +
              'SECRET_TOKEN=sk-live-abc123',
            ) + 'What does this say about keeping secrets in environment variables?',
            'Chạy thật. Một tiến trình được khởi động với một bí mật trong môi trường của nó, rồi môi trường đó được đọc lại từ một shell khác:' + code(
              '$ env SECRET_TOKEN=sk-live-abc123 tail -f /dev/null >/dev/null 2>&1 &\n' +
              "$ tr '\\0' '\\n' < /proc/$!/environ | grep SECRET\n" +
              'SECRET_TOKEN=sk-live-abc123',
            ) + 'Điều này nói lên gì về việc giữ bí mật trong biến môi trường?',
          ),
          options: [
            B(
              'It proves the secret leaked because <code>env</code> was used: passing the value as a command prefix writes it into <code>/proc</code>, whereas an <code>export</code> in the parent shell would have kept it out of the child\'s environ file, since exported values are copied into private memory rather than published by the kernel',
              'Nó chứng tỏ bí mật rò ra vì đã dùng <code>env</code>: truyền giá trị như một tiền tố lệnh sẽ ghi nó vào <code>/proc</code>, còn một lệnh <code>export</code> ở shell cha thì đã giữ nó ngoài file environ của tiến trình con, vì giá trị đã export được chép vào vùng nhớ riêng chứ không được nhân công bố ra ngoài',
            ),
            B(
              'It proves environment variables are unsafe on any machine and should be replaced by command-line arguments, which are held in kernel memory rather than exposed through the filesystem, so a value passed as an argument is visible only to the process that received it',
              'Nó chứng tỏ biến môi trường không an toàn trên mọi loại máy và nên được thay bằng tham số dòng lệnh, thứ được giữ trong bộ nhớ nhân chứ không phơi ra qua hệ thống file, nên một giá trị truyền vào dạng tham số chỉ tiến trình nhận nó mới nhìn thấy',
            ),
            B(
              'It only matters for background jobs: a foreground process keeps its environment private because <code>/proc/&lt;pid&gt;/environ</code> is written when a process is detached from the terminal, which is why the transcript had to background the job with <code>&amp;</code> before the secret could be read back',
              'Nó chỉ quan trọng với job chạy nền: một tiến trình ở tiền cảnh giữ môi trường của nó riêng tư vì <code>/proc/&lt;pid&gt;/environ</code> chỉ được ghi khi tiến trình bị tách khỏi terminal, và đó là lý do đoạn ghi phải đẩy job xuống nền bằng dấu <code>&amp;</code> thì mới đọc lại được bí mật',
            ),
            B(
              'The environment is readable by the process owner and by root, and it is inherited by every child the process starts — a crash reporter, a build tool, a package\'s postinstall script. So environment variables protect a secret from <em>other users</em>, not from <em>other code running as you</em>. They are still far better than committing a key to git; the point is to know the exposure and prefer a mode-600 file, a systemd <code>EnvironmentFile</code>, or a secrets manager where it matters',
              'Môi trường đọc được bởi chủ sở hữu tiến trình và bởi root, và nó được thừa kế bởi mọi tiến trình con mà tiến trình đó khởi động — một trình báo lỗi, một công cụ dựng, một script postinstall của một gói nào đó. Vậy biến môi trường bảo vệ bí mật khỏi <em>người dùng khác</em>, chứ không bảo vệ khỏi <em>mã khác đang chạy với danh nghĩa của bạn</em>. Chúng vẫn tốt hơn hẳn việc commit một cái khoá vào git; vấn đề là biết rõ mức phơi bày và ưu tiên một file mode 600, một <code>EnvironmentFile</code> của systemd, hoặc một trình quản lý bí mật ở những chỗ thật sự quan trọng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured. Two neighbouring exposures are worse and worth naming. A credential on a <b>command line</b> is visible to <em>every</em> user on the machine through <code>ps</code> — which is why <code>mysql -p&lt;password&gt;</code> is a mistake and why database clients read <code>~/.my.cnf</code> or <code>~/.pgpass</code> instead. And <code>set -x</code> left on in a service prints <em>expanded</em> values to stderr, so a token lands in the journal or in a cron email on every run, in plain text, and is then backed up. The practical shape for one server is a file owned by the service user with mode 600, kept <em>outside</em> the deployment directory so a deploy cannot overwrite it, referenced from the unit with <code>EnvironmentFile=</code>.',
            'Đã đo thật. Có hai mức phơi bày lân cận còn tệ hơn và đáng gọi tên. Một thông tin đăng nhập nằm trên <b>dòng lệnh</b> thì MỌI người dùng trên máy đều nhìn thấy qua <code>ps</code> — đó là lý do <code>mysql -p&lt;mật khẩu&gt;</code> là một sai lầm và là lý do các client cơ sở dữ liệu đọc <code>~/.my.cnf</code> hay <code>~/.pgpass</code> thay vào đó. Và <code>set -x</code> để quên trên một dịch vụ sẽ in các giá trị ĐÃ KHAI TRIỂN ra stderr, nên một token rơi vào journal hoặc vào email của cron ở mỗi lần chạy, dưới dạng chữ thường, rồi được sao lưu lại. Dạng thực dụng cho một máy chủ đơn lẻ là một file thuộc sở hữu của người dùng chạy dịch vụ với mode 600, đặt NGOÀI thư mục triển khai để một lần deploy không ghi đè được nó, và được unit tham chiếu tới bằng <code>EnvironmentFile=</code>.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          language: 'bash',
          prompt: B(
            '<p><b>Q31 — Resolve a command the way the shell does (chapters 8.1 and 6.4).</b> Implement <code>resolve()</code>, which takes one command name and prints exactly one line saying what would run and with which exit status.</p>' +
            '<p>The given data models a machine: <code>BUILTINS</code> is a space-separated list of shell builtins, <code>DIRS</code> is <code>PATH</code> already split into directories in order, and <code>TABLE</code> has one line per file that exists, as <code>&lt;full path&gt; &lt;kind&gt;</code> where the kind is <code>x</code> executable, <code>-</code> present but not executable, or <code>d</code> a directory with that name.</p>' +
            '<p>The rules are the ones bash really follows — each was measured on Debian 12, not guessed:</p>' +
            '<ul>' +
            '<li>A <b>builtin</b> wins before <code>PATH</code> is searched at all. Print ' + c('<cmd> -> builtin (rc=0)') + ' and return 0.</li>' +
            '<li>Otherwise walk <code>DIRS</code> <b>left to right</b>. The first <code>x</code> entry wins: print ' + c('<cmd> -> <full path> (rc=0)') + ' and return 0.</li>' +
            '<li>A <code>-</code> entry does <b>not</b> stop the search — bash skips it and keeps looking. Remember the <b>first</b> one you saw.</li>' +
            '<li>A <code>d</code> entry is not a candidate at all: a directory with the right name is simply ignored.</li>' +
            '<li>If the walk ends with no <code>x</code> but at least one <code>-</code> was seen, print ' + c('<cmd> -> <first denied path>: Permission denied (rc=126)') + ' and return 126.</li>' +
            '<li>If nothing at all matched, print ' + c('<cmd> -> command not found (rc=127)') + ' and return 127.</li>' +
            '</ul>' +
            '<p>Six commands are resolved by the given loop, and between them they exercise every rule: one shadowed by an earlier directory, one skipping a non-executable entry to reach a working one, one that is only ever a directory or a non-executable file, two builtins (one of which also exists on disk), and one that does not exist anywhere.</p>' +
            '<p>Keep the given data and the printing loop exactly as they are. Plain bash only — no external tools beyond <code>printf</code>.</p>',

            '<p><b>Câu 31 — Phân giải một câu lệnh đúng như shell làm (chương 8.1 và 6.4).</b> Cài đặt <code>resolve()</code>, nhận vào một tên lệnh và in ra đúng một dòng cho biết cái gì sẽ chạy và với mã thoát nào.</p>' +
            '<p>Phần dữ liệu cho sẵn mô hình hoá một cái máy: <code>BUILTINS</code> là danh sách các lệnh dựng sẵn ngăn nhau bằng dấu cách, <code>DIRS</code> là <code>PATH</code> đã tách sẵn thành các thư mục theo thứ tự, còn <code>TABLE</code> có một dòng cho mỗi file đang tồn tại, dạng <code>&lt;đường dẫn đầy đủ&gt; &lt;loại&gt;</code> với loại là <code>x</code> chạy được, <code>-</code> có mà không chạy được, hoặc <code>d</code> là một thư mục mang cái tên đó.</p>' +
            '<p>Các luật dưới đây là luật bash thật sự tuân theo — mỗi luật đều đã ĐO trên Debian 12 chứ không phải đoán:</p>' +
            '<ul>' +
            '<li>Một <b>lệnh dựng sẵn</b> thắng trước cả khi <code>PATH</code> được quét. In ' + c('<lệnh> -> builtin (rc=0)') + ' rồi trả về 0.</li>' +
            '<li>Nếu không, duyệt <code>DIRS</code> <b>từ trái sang phải</b>. Mục <code>x</code> đầu tiên thắng: in ' + c('<lệnh> -> <đường dẫn đầy đủ> (rc=0)') + ' rồi trả về 0.</li>' +
            '<li>Một mục <code>-</code> <b>KHÔNG</b> làm dừng việc tìm — bash bỏ qua nó và đi tiếp. Hãy nhớ lấy cái <b>đầu tiên</b> bạn gặp.</li>' +
            '<li>Một mục <code>d</code> hoàn toàn không phải ứng viên: một thư mục trùng tên thì đơn giản là bị lờ đi.</li>' +
            '<li>Nếu duyệt hết mà không có <code>x</code> nào nhưng đã thấy ít nhất một <code>-</code>, in ' + c('<lệnh> -> <đường dẫn bị từ chối đầu tiên>: Permission denied (rc=126)') + ' rồi trả về 126.</li>' +
            '<li>Nếu chẳng khớp gì cả, in ' + c('<lệnh> -> command not found (rc=127)') + ' rồi trả về 127.</li>' +
            '</ul>' +
            '<p>Vòng lặp cho sẵn phân giải sáu câu lệnh, và cả sáu gộp lại chạm tới mọi luật: một cái bị thư mục đứng trước che, một cái phải bỏ qua mục không chạy được để tới cái chạy được, một cái chỉ toàn là thư mục hoặc file không chạy được, hai lệnh dựng sẵn (một trong đó còn tồn tại cả trên đĩa), và một cái không có ở đâu cả.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả. Chỉ dùng bash thuần — không công cụ ngoài nào ngoài <code>printf</code>.</p>',
          ),
          starterCode:
            "#!/usr/bin/env bash\n" +
            "# \u2500\u2500 \u0110\u1ec0 CHO S\u1eb4N \u2014 KH\u00d4NG S\u1eecA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n" +
            "BUILTINS=\"cd echo test\"\n" +
            "\n" +
            "DIRS=\"/home/an/.local/bin /usr/local/bin /usr/bin /bin\"\n" +
            "\n" +
            "TABLE=$(cat <<'EOF'\n" +
            "/home/an/.local/bin/node x\n" +
            "/home/an/.local/bin/report d\n" +
            "/usr/local/bin/node x\n" +
            "/usr/local/bin/deploy -\n" +
            "/usr/bin/deploy x\n" +
            "/usr/bin/echo x\n" +
            "/usr/bin/report -\n" +
            "/bin/report -\n" +
            "/bin/cd x\n" +
            "EOF\n" +
            ")\n" +
            "\n" +
            "# \u2500\u2500 VI\u1ebeT L\u1edcI GI\u1ea2I C\u1ee6A B\u1ea0N \u1ede \u0110\u00c2Y \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n" +
            "resolve() {\n" +
            "  printf 'chua cai dat\\n' >&2\n" +
            "  return 1\n" +
            "}\n" +
            "\n" +
            "# \u2500\u2500 \u0110\u1ec0 CHO S\u1eb4N \u2014 KH\u00d4NG S\u1eecA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n" +
            "for cmd in node deploy report echo cd missing; do\n" +
            "  resolve \"$cmd\"\n" +
            "done\n" +
            "exit 0\n",
          expectedOutput:
            "node -> /home/an/.local/bin/node (rc=0)\n" +
            "deploy -> /usr/bin/deploy (rc=0)\n" +
            "report -> /usr/bin/report: Permission denied (rc=126)\n" +
            "echo -> builtin (rc=0)\n" +
            "cd -> builtin (rc=0)\n" +
            "missing -> command not found (rc=127)\n",
          sampleSolution:
            "resolve() {\n" +
            "  local cmd=$1 dir path kind first_denied=\"\"\n" +
            "\n" +
            "  # 1. L\u1ec7nh d\u1ef1ng s\u1eb5n th\u1eafng tr\u01b0\u1edbc c\u1ea3 PATH (b\u00e0i 8.1).\n" +
            "  for b in $BUILTINS; do\n" +
            "    if [ \"$b\" = \"$cmd\" ]; then\n" +
            "      printf '%s -> builtin (rc=0)\\n' \"$cmd\"\n" +
            "      return 0\n" +
            "    fi\n" +
            "  done\n" +
            "\n" +
            "  # 2. Duy\u1ec7t PATH TR\u00c1I SANG PH\u1ea2I.\n" +
            "  for dir in $DIRS; do\n" +
            "    path=$dir/$cmd\n" +
            "    kind=$(printf '%s\\n' \"$TABLE\" | while IFS=' ' read -r p k; do\n" +
            "             [ \"$p\" = \"$path\" ] && printf '%s' \"$k\"\n" +
            "           done)\n" +
            "    case $kind in\n" +
            "      x) printf '%s -> %s (rc=0)\\n' \"$cmd\" \"$path\"; return 0 ;;\n" +
            "      -) [ -z \"$first_denied\" ] && first_denied=$path ;;\n" +
            "      *) ;;                       # 'd' hoac khong co: khong phai ung vien\n" +
            "    esac\n" +
            "  done\n" +
            "\n" +
            "  # 3. Khong co file chay duoc nao: co file khong chay duoc thi 126, khong thi 127.\n" +
            "  if [ -n \"$first_denied\" ]; then\n" +
            "    printf '%s -> %s: Permission denied (rc=126)\\n' \"$cmd\" \"$first_denied\"\n" +
            "    return 126\n" +
            "  fi\n" +
            "  printf '%s -> command not found (rc=127)\\n' \"$cmd\"\n" +
            "  return 127\n" +
            "}\n",
          rubric: RUBRIC_CODE,
        }),

        codeQ({
          points: 5,
          language: 'bash',
          prompt: B(
            '<p><b>Q32 — The front door of a deploy script (chapters 7.2, 6.4 and 6.3).</b> Implement <code>check()</code>, which parses an argument list, validates it, and reports the outcome. It must <b>print one line and return a distinct exit code</b> for each kind of failure — nothing is deployed here, the whole question is the guard.</p>' +
            '<p>Options to accept, in a ' + c('while [ $# -gt 0 ]') + ' loop over ' + c('case $1 in') + ':</p>' +
            '<ul>' +
            '<li>' + c('-h') + ' / ' + c('--help') + ' &mdash; print ' + c('usage: deploy.sh [-n] [-t TAG] <staging|production>') + ' and return <b>0</b> immediately.</li>' +
            '<li>' + c('-n') + ' / ' + c('--dry-run') + ' &mdash; set the dry-run flag to 1.</li>' +
            '<li>' + c('-t TAG') + ' / ' + c('--tag TAG') + ' &mdash; takes a value in the <em>next</em> argument. If there is no next argument, print ' + c('ERROR --tag needs a value') + ' and return <b>2</b>.</li>' +
            '<li>' + c('--tag=TAG') + ' &mdash; the same option with the value attached.</li>' +
            '<li>' + c('--') + ' &mdash; end of options: whatever follows is the environment even if it starts with a dash.</li>' +
            '<li>Anything else starting with a dash &mdash; print ' + c('ERROR unknown option: <arg>') + ' and return <b>2</b>.</li>' +
            '<li>Anything else &mdash; the environment name.</li>' +
            '</ul>' +
            '<p>Then validate, in this order, and stop at the first failure:</p>' +
            '<ul>' +
            '<li>No environment given &rarr; ' + c('ERROR environment is required') + ', return <b>2</b>.</li>' +
            '<li>Environment not <code>staging</code> or <code>production</code> &rarr; ' + c('ERROR unknown environment: <env>') + ', return <b>3</b>.</li>' +
            '<li>Tag empty, or containing anything outside letters, digits, <code>.</code>, <code>_</code> and <code>-</code> &rarr; ' + c('ERROR invalid tag: <tag>') + ', return <b>4</b>.</li>' +
            '<li>Tag not present in <code>RELEASED</code> &rarr; ' + c('ERROR tag was never released: <tag>') + ', return <b>6</b>.</li>' +
            '<li>Environment <code>production</code> with tag <code>latest</code> &rarr; ' + c('ERROR refusing to deploy latest to production') + ', return <b>5</b>. This one encodes a policy as a check rather than as a rule people are asked to remember.</li>' +
            '<li>Otherwise print ' + c('OK env=<env> tag=<tag> dry=<0 or 1>') + ' and return <b>0</b>. The tag defaults to <code>latest</code> and dry-run defaults to 0.</li>' +
            '</ul>' +
            '<p>Two traps are deliberate. <code>--tag</code> as the very last argument must not run <code>shift 2</code> past the end of the list; and a tag containing a space has to be rejected rather than silently truncated, so every expansion needs quoting. Print with <code>printf</code> and <b>no trailing newline</b> &mdash; the given <code>run_case</code> adds the formatting.</p>' +
            '<p>Keep the given data and the test block exactly as they are. Plain bash only, and note that the grader may run an older bash: use <code>case</code> globs rather than <code>[[ =~ ]]</code>, and no bash-4-only syntax.</p>',

            '<p><b>Câu 32 — Cửa trước của một script deploy (chương 7.2, 6.4 và 6.3).</b> Cài đặt <code>check()</code>: phân tích một danh sách tham số, kiểm tính hợp lệ, rồi báo kết quả. Nó phải <b>in ra một dòng và trả về một mã thoát riêng</b> cho từng loại lỗi &mdash; ở đây không deploy gì cả, cả câu hỏi chính là cái chốt chặn.</p>' +
            '<p>Các tuỳ chọn phải nhận, trong một vòng ' + c('while [ $# -gt 0 ]') + ' duyệt ' + c('case $1 in') + ':</p>' +
            '<ul>' +
            '<li>' + c('-h') + ' / ' + c('--help') + ' &mdash; in ' + c('usage: deploy.sh [-n] [-t TAG] <staging|production>') + ' rồi trả về <b>0</b> ngay lập tức.</li>' +
            '<li>' + c('-n') + ' / ' + c('--dry-run') + ' &mdash; bật cờ chạy thử lên 1.</li>' +
            '<li>' + c('-t TAG') + ' / ' + c('--tag TAG') + ' &mdash; nhận giá trị ở tham số KẾ TIẾP. Nếu không có tham số kế tiếp thì in ' + c('ERROR --tag needs a value') + ' rồi trả về <b>2</b>.</li>' +
            '<li>' + c('--tag=TAG') + ' &mdash; cùng tuỳ chọn đó nhưng giá trị dính liền.</li>' +
            '<li>' + c('--') + ' &mdash; hết phần tuỳ chọn: thứ đứng sau là tên môi trường, kể cả khi nó bắt đầu bằng dấu gạch ngang.</li>' +
            '<li>Mọi thứ khác bắt đầu bằng dấu gạch ngang &mdash; in ' + c('ERROR unknown option: <tham số>') + ' rồi trả về <b>2</b>.</li>' +
            '<li>Mọi thứ khác &mdash; là tên môi trường.</li>' +
            '</ul>' +
            '<p>Sau đó kiểm tính hợp lệ, theo đúng thứ tự này, và dừng ở lỗi đầu tiên:</p>' +
            '<ul>' +
            '<li>Không có môi trường &rarr; ' + c('ERROR environment is required') + ', trả về <b>2</b>.</li>' +
            '<li>Môi trường không phải <code>staging</code> hay <code>production</code> &rarr; ' + c('ERROR unknown environment: <môi trường>') + ', trả về <b>3</b>.</li>' +
            '<li>Tag rỗng, hoặc có chứa bất kỳ ký tự nào ngoài chữ cái, chữ số, <code>.</code>, <code>_</code> và <code>-</code> &rarr; ' + c('ERROR invalid tag: <tag>') + ', trả về <b>4</b>.</li>' +
            '<li>Tag không có trong <code>RELEASED</code> &rarr; ' + c('ERROR tag was never released: <tag>') + ', trả về <b>6</b>.</li>' +
            '<li>Môi trường <code>production</code> với tag <code>latest</code> &rarr; ' + c('ERROR refusing to deploy latest to production') + ', trả về <b>5</b>. Câu này mã hoá một chính sách thành một phép kiểm, thay vì thành một điều luật mà người ta được yêu cầu phải nhớ.</li>' +
            '<li>Còn lại thì in ' + c('OK env=<môi trường> tag=<tag> dry=<0 hoặc 1>') + ' rồi trả về <b>0</b>. Tag mặc định là <code>latest</code> và cờ chạy thử mặc định là 0.</li>' +
            '</ul>' +
            '<p>Có hai cái bẫy cố ý. <code>--tag</code> đứng ở vị trí tham số cuối cùng thì không được để <code>shift 2</code> nhảy quá cuối danh sách; và một tag có chứa dấu cách phải bị TỪ CHỐI chứ không được lặng lẽ cắt cụt, nên mọi phép khai triển đều cần đặt trong nháy. Hãy in bằng <code>printf</code> và <b>không kèm ký tự xuống dòng</b> &mdash; hàm <code>run_case</code> cho sẵn lo phần định dạng.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối kiểm thử. Chỉ dùng bash thuần, và lưu ý rằng máy chấm có thể chạy một bản bash cũ: hãy dùng glob trong <code>case</code> thay cho <code>[[ =~ ]]</code>, và không dùng cú pháp chỉ có từ bash 4.</p>',
          ),
          starterCode:
            "#!/usr/bin/env bash\n" +
            "# \u2500\u2500 \u0110\u1ec0 CHO S\u1eb4N \u2014 KH\u00d4NG S\u1eecA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n" +
            "RELEASED=\"v1.4.0 v1.3.2 latest\"\n" +
            "\n" +
            "# \u2500\u2500 VI\u1ebeT L\u1edcI GI\u1ea2I C\u1ee6A B\u1ea0N \u1ede \u0110\u00c2Y \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n" +
            "check() {\n" +
            "  printf 'chua cai dat\\n' >&2\n" +
            "  return 1\n" +
            "}\n" +
            "\n" +
            "# \u2500\u2500 \u0110\u1ec0 CHO S\u1eb4N \u2014 KH\u00d4NG S\u1eecA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n" +
            "run_case() {\n" +
            "  local label=$1; shift\n" +
            "  local out\n" +
            "  out=$(check \"$@\")\n" +
            "  printf '%-34s %s (rc=%s)\\n' \"$label\" \"$out\" \"$?\"\n" +
            "}\n" +
            "run_case '(no argument)'\n" +
            "run_case '--help'                       --help\n" +
            "run_case 'staging'                      staging\n" +
            "run_case '--tag v1.4.0 production'      --tag v1.4.0 production\n" +
            "run_case '--tag=v1.3.2 -n staging'      --tag=v1.3.2 -n staging\n" +
            "run_case 'production'                   production\n" +
            "run_case 'prod'                         prod\n" +
            "run_case '--tag \"v1 4\" staging'         --tag 'v1 4' staging\n" +
            "run_case '--tag'                        --tag\n" +
            "run_case '-x staging'                   -x staging\n" +
            "run_case '--tag v9.9.9 staging'         --tag v9.9.9 staging\n" +
            "run_case '-- --weird'                   -- --weird\n" +
            "exit 0\n",
          expectedOutput:
            "(no argument)                      ERROR environment is required (rc=2)\n" +
            "--help                             usage: deploy.sh [-n] [-t TAG] <staging|production> (rc=0)\n" +
            "staging                            OK env=staging tag=latest dry=0 (rc=0)\n" +
            "--tag v1.4.0 production            OK env=production tag=v1.4.0 dry=0 (rc=0)\n" +
            "--tag=v1.3.2 -n staging            OK env=staging tag=v1.3.2 dry=1 (rc=0)\n" +
            "production                         ERROR refusing to deploy latest to production (rc=5)\n" +
            "prod                               ERROR unknown environment: prod (rc=3)\n" +
            "--tag \"v1 4\" staging               ERROR invalid tag: v1 4 (rc=4)\n" +
            "--tag                              ERROR --tag needs a value (rc=2)\n" +
            "-x staging                         ERROR unknown option: -x (rc=2)\n" +
            "--tag v9.9.9 staging               ERROR tag was never released: v9.9.9 (rc=6)\n" +
            "-- --weird                         ERROR unknown environment: --weird (rc=3)\n",
          sampleSolution:
            "check() {\n" +
            "  local env=\"\" tag=\"latest\" dry=0\n" +
            "\n" +
            "  while [ $# -gt 0 ]; do\n" +
            "    case $1 in\n" +
            "      -h|--help)    printf 'usage: deploy.sh [-n] [-t TAG] <staging|production>'; return 0 ;;\n" +
            "      -n|--dry-run) dry=1; shift ;;\n" +
            "      -t|--tag)\n" +
            "        # $2 co the KHONG ton tai: khong duoc de shift 2 chay khi thieu gia tri.\n" +
            "        if [ $# -lt 2 ]; then printf 'ERROR --tag needs a value'; return 2; fi\n" +
            "        tag=$2; shift 2 ;;\n" +
            "      --tag=*)      tag=${1#*=}; shift ;;\n" +
            "      --)           shift; env=${1:-$env}; break ;;\n" +
            "      -*)           printf 'ERROR unknown option: %s' \"$1\"; return 2 ;;\n" +
            "      *)            env=$1; shift ;;\n" +
            "    esac\n" +
            "  done\n" +
            "\n" +
            "  [ -n \"$env\" ] || { printf 'ERROR environment is required'; return 2; }\n" +
            "\n" +
            "  case $env in\n" +
            "    staging|production) ;;\n" +
            "    *) printf 'ERROR unknown environment: %s' \"$env\"; return 3 ;;\n" +
            "  esac\n" +
            "\n" +
            "  # Glob thay cho regex: chi cho phep chu, so, cham, gach duoi, gach ngang.\n" +
            "  case $tag in\n" +
            "    ''|*[!a-zA-Z0-9._-]*) printf 'ERROR invalid tag: %s' \"$tag\"; return 4 ;;\n" +
            "  esac\n" +
            "\n" +
            "  case \" $RELEASED \" in\n" +
            "    *\" $tag \"*) ;;\n" +
            "    *) printf 'ERROR tag was never released: %s' \"$tag\"; return 6 ;;\n" +
            "  esac\n" +
            "\n" +
            "  if [ \"$env\" = production ] && [ \"$tag\" = latest ]; then\n" +
            "    printf 'ERROR refusing to deploy latest to production'\n" +
            "    return 5\n" +
            "  fi\n" +
            "\n" +
            "  printf 'OK env=%s tag=%s dry=%s' \"$env\" \"$tag\" \"$dry\"\n" +
            "  return 0\n" +
            "}\n",
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
