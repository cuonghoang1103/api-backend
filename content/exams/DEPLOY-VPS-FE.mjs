/**
 * Deploy VPS — Final Exam (FE): 50 câu trắc nghiệm phủ cả 12 chương (s00–s11).
 *
 * Đề tự soạn, bám sát `content/courses/deploy-vps/s00…s11`. Có cả câu lý thuyết
 * lẫn câu đọc terminal; MỌI đoạn output, mã thoát và số đo trong đề đều CHẠY
 * THẬT trong sân nháp cục bộ — KHÔNG có một byte nào chạm vào VPS thật, vào
 * `cuonghoangdev_db`, hay vào bất kỳ khoá/bí mật nào của dự án. Mọi giá trị
 * nhạy cảm trong đề là giá trị GIẢ, cố ý viết cho khác hẳn giá trị thật.
 *
 * ⚙️ SÂN ĐO (dựng rồi xoá bằng `docker rm -f`):
 *   • "VPS giả": container `debian:12` (Debian 12.15, aarch64) chạy privileged,
 *     bên trong có bash 5.2.15, rsync 3.2.7, OpenSSH_9.2p1, coreutils 9.1,
 *     curl 7.88.1, git 2.39.5, gzip 1.12, nginx 1.22.1, strace 6.1,
 *     e2fsprogs (mkfs.ext4/tune2fs), lsof, python3 3.11.2 (đóng vai ứng dụng).
 *   • PostgreSQL 16.14 trong container `postgres:16` riêng (cổng 55439, CSDL
 *     nháp tên `thu`) — dùng cho các câu chương 5, 6 và 10.
 *   • `node:22-slim` (Node v22.23.1) chỉ để đo `node --env-file` ở chương 4.
 *   • Docker Engine 29.5.3 / Compose v5.1.4 trên Docker Desktop, nhân
 *     6.12.76-linuxkit, linux/arm64 — dùng cho các câu về mã thoát 125/126/127,
 *     137, tầng ảnh, và `compose up -d --no-build`.
 *   • Hai container `debian:12` chạy `--memory=256m --memory-swap=256m` cho câu
 *     OOM killer (chương 8): một "cơ sở dữ liệu" 170 MB đã chạm hết trang nhớ
 *     cộng một "bản dựng" xin thêm 120 MB.
 *
 * ⚠️ MỘT CHỖ KHÔNG ĐO ĐƯỢC, và đề đã tránh: bên trong container trên Docker
 * Desktop KHÔNG đọc được vòng đệm log của nhân máy chủ, nên các dòng
 * `oom-kill:constraint=…` và `Killed process … anon-rss:…` mà giáo trình trích
 * từ `dmesg` thì tôi KHÔNG tái hiện được. Câu chương 8 vì thế dùng bộ đếm
 * cgroup v2 `memory.events` (`oom 1 oom_kill 1`) — thứ đo được thật — và chỉ
 * NÓI VỀ `dmesg` như một cơ chế, không trích một dòng output nào của nó.
 *
 * ⚠️ BỐN CHỖ MÁY KHÁC GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY:
 *   • Giáo trình (0.4, 7.2) nói `ln -sfn` "không nguyên tử — bên trong là một
 *     lần unlink rồi tạo lại". Trên coreutils 9.1 thì KHÔNG: strace cho thấy nó
 *     `symlinkat` ra một tên tạm ngẫu nhiên rồi `renameat` đè lên — tức là
 *     nguyên tử. Đề vì thế không hỏi "ln -sfn có nguyên tử không"; nó hỏi cái
 *     bẫy CÓ THẬT và đo được: `ln -sf` THIẾU `-n` khi đích là symlink trỏ vào
 *     thư mục thì tạo liên kết BÊN TRONG thư mục đó (`symlinkat(..., 3, "v1")`)
 *     và `hien-tai` không đổi.
 *   • Giáo trình (2.1) nói rsync gửi ~18 KB cho một tệp 20 MB bị dịch chuyển
 *     toàn bộ. Đo cục bộ thì mặc định của rsync là `--whole-file` (gửi lại đủ
 *     20.005.097 byte); phải thêm `--no-whole-file` mới thấy thuật toán chênh
 *     lệch (4.572 byte literal / 22.585 byte gửi đi). Đề nói rõ cờ ấy.
 *   • Giáo trình (10.2) nói thiếu `ANALYZE` sau khi phục hồi thì cùng một truy
 *     vấn chậm 2,5 lần. KHÔNG tái hiện được trên PostgreSQL 16.14: kế hoạch
 *     truy vấn giống hệt nhau trước và sau, và thời gian ba lượt là
 *     63,5 / 64,1 / 63,0 ms TRƯỚC so với 120,7 / 63,7 / 62,5 ms SAU — lượt đầu
 *     sau `ANALYZE` chậm hơn, gần như chắc chắn là hiệu ứng làm ấm bộ đệm chứ
 *     không phải kế hoạch. Nên ĐỀ KHÔNG HỎI CON SỐ NÀO về `ANALYZE`; nó chỉ
 *     hỏi cơ chế đo được: `pg_stats` có 0 dòng ngay sau `pg_restore` và 13 dòng
 *     sau `ANALYZE`.
 *   • Giáo trình (8.4) nói tệp một byte làm hết KHỐI trước khi hết inode. Trên
 *     ext4 mặc định của sân đo này thì ngược lại: dừng ở tệp thứ 43.989 vì
 *     `df -i` đạt 100% trong khi `df -h` mới 31%. Đề dùng số đo của máy.
 *
 * Phân bố câu theo chương:
 *   Mục 0 (s00) 3 · C1 (s01) 5 · C2 (s02) 4 · C3 (s03) 5 · C4 (s04) 5 ·
 *   C5 (s05) 5 · C6 (s06) 5 · C7 (s07) 5 · C8 (s08) 4 · C9 (s09) 4 ·
 *   C10 (s10) 3 · C11 (s11) 2  = 50 câu.
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 12 · B 13 · C 13 · D 12.
 *   node -e "import('./content/exams/DEPLOY-VPS-FE.mjs').then(m=>{const d={};m.default.exams[0].questions.forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/DEPLOY-VPS-FE.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/deployvps-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all twelve chapters, from "which bytes are actually shipping" to "the deploy said yes and the user is still on the old version". Many questions show a real terminal transcript and ask you to explain it; every one of those outputs came from actually running the command in a scratch Linux container, so read the transcript rather than the intuition.</p>' +
  '<p>Three habits pay off here. First, separate <em>the deploy reported success</em> from <em>the user is being served the new version</em> — nearly a third of this exam lives in the gap between those two sentences. Second, read exit codes as evidence: <code>0</code> from a script that refused is not the same as <code>0</code> from a script that worked, <code>137</code> is a kill nobody logged, and <code>255</code> is always ssh itself. Third, when a question shows a duration, use it — a 502 in a third of a millisecond and a 504 at exactly your configured timeout are two different problems in two different layers.</p>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả mười hai chương, từ "rốt cuộc những byte nào được gửi đi" tới "lần deploy báo xong mà người dùng vẫn đang ở bản cũ". Nhiều câu cho sẵn một đoạn terminal thật rồi hỏi bạn giải thích nó; mọi đoạn output loại đó đều lấy từ việc chạy thật câu lệnh trong một container Linux nháp, nên hãy đọc đoạn terminal thay vì đoán theo cảm tính.</p>' +
  '<p>Ba thói quen giúp ích ở đây. Một, tách bạch <em>lần deploy đã báo thành công</em> với <em>người dùng đang được phục vụ bản mới</em> — gần một phần ba đề này nằm đúng trong cái khe giữa hai câu ấy. Hai, đọc mã thoát như đọc bằng chứng: một cú <code>0</code> của script đã TỪ CHỐI khác hẳn một cú <code>0</code> của script đã CHẠY, <code>137</code> là một cú giết mà không ai ghi log, còn <code>255</code> thì luôn luôn là chính ssh. Ba, khi một câu cho sẵn con số thời gian thì hãy dùng nó — một cú 502 trong một phần ba mili giây và một cú 504 đúng bằng hạn giờ bạn đặt là hai vấn đề khác nhau ở hai tầng khác nhau.</p>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'deploy-vps' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Final Exam — the whole Deploy VPS course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá Deploy VPS (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all twelve chapters: the four steps of a deploy and the four ways each fails quietly, deciding which bytes ship, the three transports and what each leaves behind when it is cut in half, swapping versions without dropping a request, configuration and secrets outside the artifact, migrations and the window between code and schema, rollback and the changes that cannot be rolled back, a deploy script that refuses when it should, living on a small machine with the OOM killer and a full disk, the numbers that lie, backups that only count once restored, and a diagnosis order.',
        'Năm mươi câu trắc nghiệm phủ cả mười hai chương: bốn bước của một lần deploy và bốn kiểu hỏng âm thầm của chúng, quyết định những byte nào được gửi đi, ba đường vận chuyển và thứ mỗi đường để lại khi bị cắt ngang, tráo phiên bản mà không rơi request nào, cấu hình và bí mật sống ngoài tạo tác, migration và cái cửa sổ giữa mã với lược đồ, lùi bản và những thay đổi không lùi được, một script deploy biết TỪ CHỐI đúng lúc, sống trên một cái máy nhỏ với OOM killer và một cái đĩa đầy, những con số nói dối, sao lưu chỉ có giá trị khi đã phục hồi thử, và một thứ tự chẩn đoán.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [

        /* ── Mục 0 — một lần deploy thật ra là cái gì (3 câu) ─────────── */

        // q1 · đáp án 2
        mcq({
          prompt: B(
            'A deploy script runs the same four checks after swapping, measured on two builds — a good one, and one that starts perfectly and answers <code>500</code> to every request because a required environment variable is absent:' +
            code('════ A) trien khai mot ban TOT ════\n' +
                 '  a) script thoat ra 0?          → 0\n' +
                 '  b) tien trinh dang chay?       → 3432\n' +
                 '  c) cong 3000 co ai nghe?       → CO\n' +
                 '  d) tuyen THAT tra loi dung?    → 200\n\n' +
                 '════ C) ban KHOI DONG DUOC nhung moi request tra 500 ════\n' +
                 '  a) script thoat ra 0?          → 0\n' +
                 '  b) tien trinh dang chay?       → 3471\n' +
                 '  c) cong 3000 co ai nghe?       → CO\n' +
                 '  d) tuyen THAT tra loi dung?    → 500\n' +
                 '  $ curl http://127.0.0.1:3000/health\n' +
                 '     Loi cau hinh: thieu DATABASE_URL') +
            'Which check is the only one worth building a deploy gate on, and why?',
            'Một script deploy chạy cùng bốn phép kiểm sau khi tráo, đo trên hai bản — một bản tốt, và một bản khởi động hoàn hảo rồi trả <code>500</code> cho mọi request vì thiếu một biến môi trường bắt buộc:' +
            code('════ A) trien khai mot ban TOT ════\n' +
                 '  a) script thoat ra 0?          → 0\n' +
                 '  b) tien trinh dang chay?       → 3432\n' +
                 '  c) cong 3000 co ai nghe?       → CO\n' +
                 '  d) tuyen THAT tra loi dung?    → 200\n\n' +
                 '════ C) ban KHOI DONG DUOC nhung moi request tra 500 ════\n' +
                 '  a) script thoat ra 0?          → 0\n' +
                 '  b) tien trinh dang chay?       → 3471\n' +
                 '  c) cong 3000 co ai nghe?       → CO\n' +
                 '  d) tuyen THAT tra loi dung?    → 500\n' +
                 '  $ curl http://127.0.0.1:3000/health\n' +
                 '     Loi cau hinh: thieu DATABASE_URL') +
            'Phép kiểm nào là phép DUY NHẤT đáng dựng một cái chốt deploy lên trên, và vì sao?',
          ),
          options: [
            B(
              'Check (a), the exit code, because it is the only one that covers the whole script rather than one moment at the end of it, and because a wrapper or a CI job can act on it without extra tooling',
              'Phép (a), mã thoát, vì nó là phép duy nhất phủ cả script chứ không phải một khoảnh khắc ở cuối, và vì một script bọc ngoài hay một job CI có thể hành động theo nó mà không cần thêm công cụ gì',
            ),
            B(
              'Check (b) plus check (c) together, because a process that exists and a port that is bound is the standard definition of "the service is up", and adding an HTTP request only duplicates what the port check already established',
              'Phép (b) cộng phép (c), vì một tiến trình có tồn tại và một cổng đã được gắn chính là định nghĩa chuẩn của "dịch vụ đang lên", còn thêm một request HTTP thì chỉ lặp lại điều mà phép kiểm cổng đã xác lập',
            ),
            B(
              'Check (d), a real request to a route the application serves with the answer inspected, because it is the only one of the four that this transcript shows failing — and a gate whose result nothing acts on is decoration rather than a gate',
              'Phép (d), một request thật vào một tuyến mà ứng dụng thật sự phục vụ và có SOI câu trả lời, vì nó là phép duy nhất trong bốn phép mà đoạn terminal này cho thấy đã bắt được lỗi — và một cái chốt mà không ai hành động theo kết quả thì là đồ trang trí chứ không phải chốt',
            ),
            B(
              'None of them: the four checks all describe the machine, so the only reliable gate is a human opening the site in a browser after every deploy and confirming the pages render',
              'Không phép nào cả: cả bốn phép đều mô tả cái máy, nên cái chốt đáng tin duy nhất là một con người mở trang web trong trình duyệt sau mỗi lần deploy và xác nhận các trang hiện ra đúng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The transcript is the argument. The exit code was <code>0</code> on a deploy that shipped something broken, so (a) proves the commands ran and nothing else. (b) and (c) prove there is a process holding a socket — both are true of an application that answers <code>500</code> to everything, which is exactly what a missing environment variable produces. Only (d) crosses the boundary between "the machine looks alive" and "the thing users ask for comes back right", and it is the only check in the list that costs a round trip. Note the second half of the answer: a check whose failure cannot stop the deploy or start a rollback is decoration. Option 4 is the honest-sounding trap — a human in a browser is slower, unrepeatable, and cannot run inside the script, which is why the whole course automates (d) instead.',
            'Chính đoạn terminal là lập luận. Mã thoát là <code>0</code> trên một lần deploy đã gửi đi thứ hỏng, nên (a) chỉ chứng minh các câu lệnh ĐÃ CHẠY, không gì hơn. (b) và (c) chứng minh có một tiến trình đang giữ một socket — cả hai đều ĐÚNG với một ứng dụng trả <code>500</code> cho mọi thứ, mà đó chính là thứ một biến môi trường bị thiếu sinh ra. Chỉ (d) mới vượt qua ranh giới giữa "cái máy trông có vẻ sống" và "thứ người dùng hỏi tới trả về đúng", và nó cũng là phép kiểm duy nhất trong danh sách phải trả giá một lượt đi-về. Hãy để ý nửa sau của đáp án: một phép kiểm mà cú hỏng của nó không dừng được lần deploy hay không kích được cú lùi thì chỉ là trang trí. Phương án 4 là cái bẫy nghe rất thật thà — một con người ngồi trước trình duyệt thì chậm hơn, không lặp lại được, và không chạy được BÊN TRONG script, và đó là lý do cả khoá học này tự động hoá (d) thay vì thế.',
          ),
        }),

        // q2 · đáp án 0
        mcq({
          prompt: B(
            'On a fresh Debian 12 server, <code>sshd -T</code> prints the values the daemon will actually use:' +
            code('$ sshd -T | grep -iE \'permitroot|password|pubkey|maxauth\'\n' +
                 '  maxauthtries 6\n' +
                 '  permitrootlogin without-password\n' +
                 '  pubkeyauthentication yes\n' +
                 '  passwordauthentication yes\n' +
                 '  kbdinteractiveauthentication no') +
            'What does <code>permitrootlogin without-password</code> mean, and why read this instead of <code>/etc/ssh/sshd_config</code>?',
            'Trên một máy chủ Debian 12 mới toanh, <code>sshd -T</code> in ra những giá trị mà tiến trình nền THẬT SỰ sẽ dùng:' +
            code('$ sshd -T | grep -iE \'permitroot|password|pubkey|maxauth\'\n' +
                 '  maxauthtries 6\n' +
                 '  permitrootlogin without-password\n' +
                 '  pubkeyauthentication yes\n' +
                 '  passwordauthentication yes\n' +
                 '  kbdinteractiveauthentication no') +
            '<code>permitrootlogin without-password</code> nghĩa là gì, và vì sao phải đọc cái này thay vì <code>/etc/ssh/sshd_config</code>?',
          ),
          options: [
            B(
              'It means "any method except a password", so key-based root login is allowed — and <code>sshd -T</code> is the effective configuration after defaults, later overrides and every <code>Include</code> of <code>sshd_config.d/*.conf</code> have been resolved',
              'Nó nghĩa là "mọi phương thức TRỪ mật khẩu", nên đăng nhập root bằng khoá vẫn được phép — và <code>sshd -T</code> là cấu hình CÓ HIỆU LỰC sau khi đã phân giải xong mặc định, các dòng ghi đè phía sau và mọi <code>Include</code> của <code>sshd_config.d/*.conf</code>',
            ),
            B(
              'It means root can log in with no credential at all, which is why the very first change on any new server is to set it to <code>no</code> before the automated login attempts from the internet find the machine',
              'Nó nghĩa là root đăng nhập được mà không cần thông tin xác thực nào, và đó là lý do thay đổi đầu tiên trên mọi máy chủ mới là đặt nó thành <code>no</code> trước khi các lượt thử đăng nhập tự động từ internet tìm ra cái máy',
            ),
            B(
              'It means passwords are accepted for root but not for other accounts, so the line above is consistent with <code>passwordauthentication yes</code> and the two settings do not need to be changed together',
              'Nó nghĩa là mật khẩu được chấp nhận cho root nhưng không cho các tài khoản khác, nên dòng trên nhất quán với <code>passwordauthentication yes</code> và hai thiết lập đó không cần phải sửa cùng nhau',
            ),
            B(
              'It is a deprecated synonym that modern OpenSSH ignores entirely, so the line is inert; what actually decides root access on this machine is the <code>maxauthtries</code> value shown above it',
              'Đó là một từ đồng nghĩa đã lỗi thời mà OpenSSH hiện đại bỏ qua hoàn toàn, nên dòng đó trơ; thứ thật sự quyết định quyền truy cập root trên máy này là giá trị <code>maxauthtries</code> ở ngay trên nó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two separate points, and both matter. <b>The name is misleading</b>: <code>without-password</code> does not mean "no password needed", it means "every authentication method <em>other than</em> a password" — so a root login with a key is allowed and a root login with a password is not. Modern OpenSSH prints the clearer synonym <code>prohibit-password</code> for the same value. <b>And the file is a wish, not the state</b>: <code>sshd_config</code> carries commented-out defaults, <code>Include</code> directives that pull in a whole directory, and settings a later line silently overrides. <code>sshd -T</code> asks the daemon what it resolved to. The pairing worth noticing in this transcript is <code>passwordauthentication yes</code> with <code>kbdinteractiveauthentication no</code>: turning off only one of those two leaves a configuration that reads as hardened and measures as open, because keyboard-interactive reaches the same password through PAM on many distributions.',
            'Hai ý riêng biệt, và cả hai đều quan trọng. <b>Cái tên gây hiểu lầm</b>: <code>without-password</code> không có nghĩa "không cần mật khẩu", nó có nghĩa "mọi phương thức xác thực KHÁC mật khẩu" — nên đăng nhập root bằng KHOÁ thì được, còn bằng mật khẩu thì không. OpenSSH hiện đại in ra từ đồng nghĩa rõ nghĩa hơn là <code>prohibit-password</code> cho cùng giá trị ấy. <b>Và cái tệp là một điều ước, không phải trạng thái</b>: <code>sshd_config</code> mang theo các mặc định bị chú thích, các chỉ thị <code>Include</code> kéo vào cả một thư mục, và những thiết lập bị một dòng phía sau âm thầm ghi đè. <code>sshd -T</code> hỏi thẳng tiến trình nền xem nó đã phân giải ra cái gì. Cặp đôi đáng để ý trong đoạn này là <code>passwordauthentication yes</code> đi cùng <code>kbdinteractiveauthentication no</code>: chỉ tắt một trong hai để lại một cấu hình ĐỌC thì như đã gia cố mà ĐO thì vẫn mở, vì trên nhiều bản phân phối, keyboard-interactive với tới đúng cái mật khẩu ấy thông qua PAM.',
          ),
        }),

        // q3 · đáp án 3
        mcq({
          prompt: B(
            'A deploy key in <code>authorized_keys</code> is prefixed with <code>command="/srv/chi-duoc-deploy.sh",no-pty,no-port-forwarding</code>. Three attempts with that same key, measured against a real <code>sshd</code>:' +
            code('-- 1) chay dung viec cua no --\n' +
                 '  [deploy] lenh client YEU CAU: deploy\n' +
                 '  [deploy] dang trien khai...\n' +
                 '-- 2) cung khoa, doi lay mot SHELL --\n' +
                 '  [deploy] lenh client YEU CAU: <khong co>\n' +
                 '  [deploy] dang trien khai...\n' +
                 '-- 3) cung khoa, doi doc /etc/shadow --\n' +
                 '  [deploy] lenh client YEU CAU: cat /etc/shadow\n' +
                 '  [deploy] dang trien khai...') +
            'What does this arrangement actually guarantee?',
            'Một khoá deploy trong <code>authorized_keys</code> được đặt tiền tố <code>command="/srv/chi-duoc-deploy.sh",no-pty,no-port-forwarding</code>. Ba lần thử với đúng khoá đó, đo trên một <code>sshd</code> thật:' +
            code('-- 1) chay dung viec cua no --\n' +
                 '  [deploy] lenh client YEU CAU: deploy\n' +
                 '  [deploy] dang trien khai...\n' +
                 '-- 2) cung khoa, doi lay mot SHELL --\n' +
                 '  [deploy] lenh client YEU CAU: <khong co>\n' +
                 '  [deploy] dang trien khai...\n' +
                 '-- 3) cung khoa, doi doc /etc/shadow --\n' +
                 '  [deploy] lenh client YEU CAU: cat /etc/shadow\n' +
                 '  [deploy] dang trien khai...') +
            'Cách sắp xếp này THẬT SỰ bảo đảm điều gì?',
          ),
          options: [
            B(
              'That the three commands were each checked against an allow-list and rejected individually, which is why the same script ran three times instead of the shell and the <code>cat</code> the client asked for',
              'Rằng ba câu lệnh đó đều đã được đối chiếu với một danh sách cho phép và bị từ chối từng cái một, và đó là lý do cùng một script chạy ba lần thay vì cái shell và cái <code>cat</code> mà client yêu cầu',
            ),
            B(
              'That the key is now read-only on the server, so it can start the deploy script but any file the script itself writes will be refused by the kernel with a permission error',
              'Rằng khoá đó bây giờ chỉ-đọc trên máy chủ, nên nó khởi động được script deploy nhưng bất kỳ tệp nào chính script ghi ra đều bị nhân hệ điều hành từ chối bằng một lỗi quyền',
            ),
            B(
              'That the client request is discarded before it reaches the server, so nothing can be logged about what a stolen key attempted and the audit trail necessarily stops at "the key was used"',
              'Rằng yêu cầu của client bị vứt đi trước khi tới máy chủ, nên không ghi lại được gì về việc một cái khoá bị trộm đã thử làm cái gì và dấu vết kiểm toán buộc phải dừng ở mức "khoá đã được dùng"',
            ),
            B(
              'That this key can only ever run that one program, whatever the client asks for — and the request is not thrown away, it arrives in <code>$SSH_ORIGINAL_COMMAND</code>, which is both how the script can offer a small menu and how you log what a stolen key tried',
              'Rằng khoá này chỉ chạy được đúng một chương trình đó, bất kể client xin cái gì — và yêu cầu ấy KHÔNG bị vứt đi, nó tới nơi trong <code>$SSH_ORIGINAL_COMMAND</code>, thứ vừa cho phép script mở một cái thực đơn nhỏ vừa là cách bạn ghi lại một cái khoá bị trộm đã thử làm gì',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A forced command replaces whatever the client asked for. Asking for a shell got the deploy script; asking to read the shadow password file got the deploy script. There is no allow-list and no per-command decision — <code>sshd</code> simply executes the <code>command=</code> value, which is why option 1 is wrong about the mechanism even though it describes the outcome. The detail worth taking away is the third line of the transcript: the client string is <em>not</em> discarded. It arrives in <code>$SSH_ORIGINAL_COMMAND</code>, so the script can branch on it — <code>deploy</code> versus <code>lui-lai</code> versus <code>trang-thai</code> — and, more usefully during an incident, it can log it. That is how a stolen deploy key produces a line saying <code>cat /etc/shadow</code> in your log instead of silence. <code>no-pty</code> is the part that stops an interactive terminal being allocated at all, and the <code>no-*-forwarding</code> options stop the key being used as a tunnel into the private network behind the server.',
            'Một forced command THAY THẾ bất cứ thứ gì client xin. Xin một shell thì được script deploy; xin đọc tệp mật khẩu bóng thì cũng được script deploy. Không có danh sách cho phép nào và không có quyết định theo từng lệnh nào cả — <code>sshd</code> đơn giản là thực thi giá trị <code>command=</code>, và đó là lý do phương án 1 sai về CƠ CHẾ dù mô tả đúng kết cục. Chi tiết đáng mang về nằm ở dòng thứ ba của đoạn terminal: chuỗi lệnh của client KHÔNG bị vứt đi. Nó tới nơi trong <code>$SSH_ORIGINAL_COMMAND</code>, nên script rẽ nhánh được theo nó — <code>deploy</code> hay <code>lui-lai</code> hay <code>trang-thai</code> — và, hữu ích hơn nhiều khi đang có sự cố, nó GHI LẠI được. Đó là cách một khoá deploy bị trộm để lại một dòng ghi <code>cat /etc/shadow</code> trong log của bạn thay vì sự im lặng. <code>no-pty</code> mới là phần chặn hẳn việc cấp phát một terminal tương tác, còn các tuỳ chọn <code>no-*-forwarding</code> chặn việc dùng khoá đó làm đường hầm vào mạng riêng phía sau máy chủ.',
          ),
        }),

        /* ── Chương 1 — tạo tác: thứ gì được gửi đi (5 câu) ───────────── */

        // q4 · đáp án 1
        mcq({
          prompt: B(
            'A real working tree measured 3.3 MB. The same commit packaged two ways:' +
            code('=== git archive gui di bao nhieu? ===\n' +
                 '  git archive: 12K  (6 muc)\n' +
                 '  .env xuat hien: 0   node_modules: 0   tai-len: 0\n' +
                 '=== tar THO ca cay (khong loai tru gi) ===\n' +
                 '  tar tho:     3.3M  (63 muc)\n' +
                 '  .env xuat hien: 1\n' +
                 '  noi dung .env trong goi tho:\n' +
                 '    DATABASE_URL=postgres://user:sieubimat@db:5432/app') +
            'Why is shipping that <code>.env</code> a problem even when the server it is going to is yours?',
            'Một cây làm việc thật đo được 3,3 MB. Cùng một commit, đóng gói theo hai cách:' +
            code('=== git archive gui di bao nhieu? ===\n' +
                 '  git archive: 12K  (6 muc)\n' +
                 '  .env xuat hien: 0   node_modules: 0   tai-len: 0\n' +
                 '=== tar THO ca cay (khong loai tru gi) ===\n' +
                 '  tar tho:     3.3M  (63 muc)\n' +
                 '  .env xuat hien: 1\n' +
                 '  noi dung .env trong goi tho:\n' +
                 '    DATABASE_URL=postgres://user:sieubimat@db:5432/app') +
            'Vì sao gửi cái <code>.env</code> đó lên vẫn là vấn đề, ngay cả khi máy chủ nó đi tới là máy của chính bạn?',
          ),
          options: [
            B(
              'It is not really a problem for a private server; the practical objection is the 275-fold size difference, and once the package is under a megabyte the <code>.env</code> inside it costs nothing to ship',
              'Với một máy chủ riêng thì thật ra không phải vấn đề; phản đối thực tế là chênh lệch kích thước 275 lần, và một khi gói đã dưới một megabyte thì cái <code>.env</code> nằm trong đó chẳng tốn gì để gửi đi',
            ),
            B(
              'Because the artifact now contains the credential and an artifact gets copied — to a CI cache, a build log, a registry, a laptop, a backup — and because your local values will land on top of the server\'s own, pointing production at whatever your machine was configured for',
              'Vì TẠO TÁC bây giờ chứa thông tin đăng nhập, mà một tạo tác thì bị SAO CHÉP đi khắp nơi — vào cache của CI, vào nhật ký dựng, vào registry, vào một cái laptop, vào một bản sao lưu — và vì các giá trị cục bộ của bạn sẽ đè lên chính cấu hình của máy chủ, trỏ production vào bất cứ thứ gì máy bạn đang được cấu hình cho',
            ),
            B(
              'Because a <code>.env</code> inside a tarball is stored with mode <code>0644</code> rather than <code>0600</code>, and the fix is to correct the permissions after extracting rather than to keep the file out of the package',
              'Vì một tệp <code>.env</code> nằm trong tệp nén được lưu với quyền <code>0644</code> chứ không phải <code>0600</code>, và cách chữa là sửa lại quyền sau khi giải nén chứ không phải giữ tệp đó ngoài gói',
            ),
            B(
              'Because <code>tar</code> cannot represent a leading dot in a filename portably, so the file arrives with a mangled name that the application will not find, which is why the credential appears to be missing at run time',
              'Vì <code>tar</code> không biểu diễn được dấu chấm đứng đầu tên tệp một cách khả chuyển, nên tệp tới nơi với cái tên bị méo mà ứng dụng không tìm ra, và đó là lý do thông tin đăng nhập trông như bị thiếu lúc chạy',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Two independent harms, and the second one bites more often. <b>Copying:</b> the leak is not "the password reached my own server", it is that the password is now <em>inside an artifact</em>, and artifacts are the most-copied objects in a deploy pipeline — a CI cache, a build log line, a registry blob, someone reproducing a bug on a laptop, last night\'s backup. Every one of those is a place the credential now exists that nobody is tracking. <b>Overwriting:</b> your local <code>.env</code> describes a development database. Deploying it over the server\'s own file points production at your laptop\'s settings, or at nothing — which is the same shape as the deploy that passes three of four checks and returns 500 to everything. Option 1 is the seductive one: the size difference is real and it is not the argument. Options 3 and 4 invent mechanics that the measurement contradicts — the file arrived intact and readable, which is exactly the problem.',
            'Hai cái hại độc lập, và cái thứ hai cắn thường xuyên hơn. <b>Sự sao chép:</b> vụ rò rỉ không phải là "mật khẩu đã lên tới máy chủ của chính tôi", mà là mật khẩu bây giờ nằm BÊN TRONG một tạo tác, và tạo tác là thứ bị sao chép nhiều nhất trong một đường ống deploy — cache của CI, một dòng nhật ký dựng, một blob trong registry, một người tái hiện lỗi trên laptop, bản sao lưu tối qua. Mỗi chỗ đó là một nơi mà thông tin đăng nhập giờ TỒN TẠI mà không ai theo dõi. <b>Sự ghi đè:</b> tệp <code>.env</code> cục bộ của bạn mô tả một cơ sở dữ liệu phát triển. Deploy nó đè lên tệp của chính máy chủ là trỏ production vào cấu hình của laptop bạn, hoặc vào hư không — đúng cái hình dạng của lần deploy qua ba trên bốn phép kiểm mà trả 500 cho mọi thứ. Phương án 1 là cái quyến rũ: chênh lệch kích thước có thật và nó KHÔNG phải lập luận. Phương án 3 và 4 bịa ra cơ chế mà chính phép đo bác bỏ — tệp tới nơi nguyên vẹn và đọc được, và đó chính là vấn đề.',
          ),
        }),

        // q5 · đáp án 2
        mcq({
          prompt: B(
            'A project has this <code>.gitignore</code>, and its deploy is an <code>rsync</code> that excludes only <code>.git</code>. Measured on the server afterwards:' +
            code('# .gitignore\nnode_modules/\n.env\ntai-len/\nlogs/\n\n$ rsync -a --exclude .git ./ vps:/srv/app/\n' +
                 '  .env len may chu chua: CO\n' +
                 '  node_modules:          50 tep') +
            'What does this measurement establish about <code>.gitignore</code>?',
            'Một dự án có <code>.gitignore</code> như dưới, và quy trình deploy của nó là một lệnh <code>rsync</code> chỉ loại trừ <code>.git</code>. Đo trên máy chủ sau đó:' +
            code('# .gitignore\nnode_modules/\n.env\ntai-len/\nlogs/\n\n$ rsync -a --exclude .git ./ vps:/srv/app/\n' +
                 '  .env len may chu chua: CO\n' +
                 '  node_modules:          50 tep') +
            'Phép đo này xác lập điều gì về <code>.gitignore</code>?',
          ),
          options: [
            B(
              'That <code>.gitignore</code> was written with the wrong pattern syntax: rsync would have honoured it if the entries had been anchored with a leading slash, which is the difference between a git pattern and an rsync filter rule',
              'Rằng <code>.gitignore</code> đã viết sai cú pháp mẫu: rsync sẽ tôn trọng nó nếu các dòng được neo bằng một dấu gạch chéo đứng đầu, và đó là khác biệt giữa một mẫu của git với một luật lọc của rsync',
            ),
            B(
              'That rsync did honour it but only for directories, which is why <code>node_modules</code> arrived while the single-file entries were skipped, and adding <code>--exclude .env</code> is therefore redundant',
              'Rằng rsync CÓ tôn trọng nó nhưng chỉ với thư mục, và đó là lý do <code>node_modules</code> lên tới nơi trong khi các dòng chỉ một tệp thì bị bỏ qua, nên thêm <code>--exclude .env</code> là thừa',
            ),
            B(
              'That it governs what <em>git</em> tracks and nothing else: a raw <code>rsync</code> or <code>tar</code> never consults it, so the files nobody has ever reviewed — precisely because git was told to ignore them — are the ones that ship',
              'Rằng nó chỉ chi phối thứ mà GIT theo dõi, không gì khác: một lệnh <code>rsync</code> hay <code>tar</code> trần không bao giờ ngó tới nó, nên đúng những tệp chưa ai từng rà soát — chính vì git được bảo là hãy lờ chúng đi — lại là những tệp được gửi đi',
            ),
            B(
              'That the deploy should have used <code>git pull</code> on the server instead, since a working clone is the only transport that applies ignore rules at both ends and therefore removes this class of mistake entirely',
              'Rằng lẽ ra quy trình deploy nên dùng <code>git pull</code> ngay trên máy chủ, vì một bản sao làm việc là đường vận chuyển duy nhất áp luật bỏ qua ở cả hai đầu và vì thế loại bỏ hoàn toàn lớp sai lầm này',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Two exclusion lists exist and they are not the same list. <code>.gitignore</code> tells git what not to track; <code>rsync --exclude</code> tells rsync what not to send. Nothing connects them, and the measurement shows all four ignored paths arriving on the server. The sharp edge is the second sentence of the answer: something ignored by git is exactly the kind of thing most dangerous to ship, <em>because</em> nobody has ever reviewed it — it never appears in a diff or a pull request. Option 1 is wrong about the cause but points at a real fact (the two pattern syntaxes overlap rather than match, which is why <code>--exclude-from=.gitignore</code> is a useful approximation and not a translation). Option 4 mistakes the remedy: a working clone on the server develops its own local changes, hotfixes and merge conflicts, which is why the course prefers a bare repository plus a checkout into a fresh directory. The durable fix is to build the artifact from what is <em>included</em> — <code>git archive</code> starts from nothing and adds only committed files, so a directory you create next month is excluded by default rather than by memory.',
            'Có HAI danh sách loại trừ và chúng không phải một. <code>.gitignore</code> bảo git đừng theo dõi cái gì; <code>rsync --exclude</code> bảo rsync đừng gửi cái gì. Không có gì nối hai cái đó với nhau, và phép đo cho thấy cả bốn đường dẫn bị bỏ qua đều lên tới máy chủ. Chỗ sắc nằm ở câu thứ hai của đáp án: thứ bị git bỏ qua đúng là thứ nguy hiểm nhất để gửi đi, CHÍNH VÌ chưa ai từng rà soát nó — nó không bao giờ xuất hiện trong một cái diff hay một pull request. Phương án 1 sai về nguyên nhân nhưng chỉ vào một sự thật có thật (hai cú pháp mẫu GIAO NHAU chứ không TRÙNG nhau, và đó là lý do <code>--exclude-from=.gitignore</code> là một phép xấp xỉ hữu ích chứ không phải một phép dịch). Phương án 4 nhầm về thuốc chữa: một bản sao làm việc trên máy chủ sẽ tự sinh ra thay đổi cục bộ, bản vá nóng và xung đột merge, và đó là lý do khoá học chuộng một kho TRẦN cộng một lần checkout vào thư mục mới toanh. Cách chữa bền là dựng tạo tác từ thứ được BAO GỒM — <code>git archive</code> khởi đi từ số không và chỉ thêm các tệp đã commit, nên một thư mục bạn tạo ra tháng sau bị loại trừ theo mặc định chứ không phải theo trí nhớ.',
          ),
        }),

        // q6 · đáp án 0
        mcq({
          prompt: B(
            'The same commit, archived twice, then compressed two different ways. Measured with <code>md5sum</code> and <code>xxd</code>:' +
            code('git archive HEAD > t1.tar ; git archive HEAD > t2.tar\n' +
                 '  tar lan 1: 284ba335b4ac58ca2d1d758c7c764b9c\n' +
                 '  tar lan 2: 284ba335b4ac58ca2d1d758c7c764b9c\n\n' +
                 'cat t.tar | gzip > p.tgz       md5=2288524d  byte 5-8 = 00000000\n' +
                 'cat t.tar | gzip > p2.tgz      md5=2288524d  byte 5-8 = 00000000\n' +
                 'gzip -k n1.tar                 md5=baac8dc8  byte 5-8 = 0ac6a16a\n' +
                 'gzip -k n2.tar                 md5=d09b9c05  byte 5-8 = 0cc6a16a') +
            'Why do the last two differ, and what is the one-flag fix?',
            'Cùng một commit, đóng gói hai lần, rồi nén theo hai cách khác nhau. Đo bằng <code>md5sum</code> và <code>xxd</code>:' +
            code('git archive HEAD > t1.tar ; git archive HEAD > t2.tar\n' +
                 '  tar lan 1: 284ba335b4ac58ca2d1d758c7c764b9c\n' +
                 '  tar lan 2: 284ba335b4ac58ca2d1d758c7c764b9c\n\n' +
                 'cat t.tar | gzip > p.tgz       md5=2288524d  byte 5-8 = 00000000\n' +
                 'cat t.tar | gzip > p2.tgz      md5=2288524d  byte 5-8 = 00000000\n' +
                 'gzip -k n1.tar                 md5=baac8dc8  byte 5-8 = 0ac6a16a\n' +
                 'gzip -k n2.tar                 md5=d09b9c05  byte 5-8 = 0cc6a16a',
            ) +
            'Vì sao hai dòng cuối khác nhau, và cách chữa bằng MỘT cái cờ là gì?',
          ),
          options: [
            B(
              'Bytes 5–8 of a gzip stream are the MTIME field: compressing a <em>named file</em> records that file\'s modification time, while reading from a pipe there is no file to take a time from and gzip writes four zero bytes. <code>gzip -n</code> stops it storing the name and the timestamp',
              'Byte 5–8 của một luồng gzip là trường MTIME: nén một TỆP CÓ TÊN thì ghi lại thời điểm sửa của chính tệp đó, còn khi đọc từ một ống dẫn thì không có tệp nào để lấy thời gian nên gzip ghi bốn byte không. <code>gzip -n</code> bảo nó đừng lưu tên lẫn dấu thời gian',
            ),
            B(
              'Because compressing a named file lets gzip choose a larger dictionary window than it can when streaming, so the two outputs use different compression levels; passing <code>gzip -6</code> explicitly makes both paths agree',
              'Vì khi nén một tệp có tên, gzip chọn được một cửa sổ từ điển lớn hơn so với lúc chảy luồng, nên hai kết quả dùng mức nén khác nhau; truyền <code>gzip -6</code> tường minh sẽ làm hai đường đồng ý với nhau',
            ),
            B(
              'Because <code>git archive</code> is not deterministic when its output is redirected to a file rather than a pipe, so the difference is upstream of gzip entirely and the fix is <code>git -c core.autocrlf=false archive</code>',
              'Vì <code>git archive</code> không tất định khi kết quả của nó được chuyển hướng vào một tệp thay vì một ống dẫn, nên khác biệt nằm hoàn toàn ở phía trước gzip và cách chữa là <code>git -c core.autocrlf=false archive</code>',
            ),
            B(
              'Because the two tar files had different inode numbers on disk and gzip embeds the source inode in its header for integrity checking; the fix is to compress from a temporary filesystem where inodes are reused',
              'Vì hai tệp tar có số inode khác nhau trên đĩa và gzip nhúng inode nguồn vào header để kiểm toàn vẹn; cách chữa là nén từ một hệ tệp tạm nơi inode được dùng lại',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The tar files are byte-identical, which settles the first half: <code>git archive</code> is deterministic, because it takes contents, modes and paths from the commit object and stamps the <em>commit</em> time into the tar headers rather than the current time. The difference appears only under gzip, and only for the named-file form. Bytes 5–8 are the MTIME field defined in RFC 1952: <code>0ac6a16a</code> against <code>0cc6a16a</code>, two seconds apart in the third byte, on identical content. Reading from a pipe there is no file, so gzip writes <code>00000000</code> and the output is reproducible. Four bytes out of a whole archive is enough to break everything built on top of a checksum — a deploy that skips the upload when the hash matches re-uploads every time, a registry that deduplicates by digest stores a fresh copy of identical content per build, and an alert on "the artifact changed unexpectedly" becomes noise and then gets turned off. Options 2, 3 and 4 all invent a mechanism; the measurement names the real one in four hex bytes.',
            'Hai tệp tar giống nhau từng byte, và điều đó giải quyết xong nửa đầu: <code>git archive</code> là tất định, vì nó lấy nội dung, quyền và đường dẫn từ chính đối tượng commit, rồi đóng dấu thời điểm COMMIT vào header tar chứ không phải thời điểm hiện tại. Khác biệt chỉ xuất hiện dưới gzip, và chỉ với dạng nén tệp có tên. Byte 5–8 là trường MTIME định nghĩa trong RFC 1952: <code>0ac6a16a</code> so với <code>0cc6a16a</code>, lệch nhau hai giây ở byte thứ ba, trên nội dung y hệt. Khi đọc từ ống dẫn thì không có tệp nào, nên gzip ghi <code>00000000</code> và kết quả tái lập được. Bốn byte trên cả một kho nén là đủ để làm hỏng mọi thứ dựng trên một mã băm — một quy trình deploy bỏ qua bước tải lên khi mã băm khớp sẽ tải lên lại mỗi lần, một registry khử trùng lặp theo digest sẽ lưu một bản sao mới của đúng nội dung cũ sau mỗi lần dựng, và một cảnh báo kiểu "tạo tác đổi ngoài dự kiến" trở thành tiếng ồn rồi bị tắt đi. Phương án 2, 3 và 4 đều bịa ra một cơ chế; còn phép đo gọi tên cơ chế thật bằng bốn byte hệ mười sáu.',
          ),
        }),

        // q7 · đáp án 3
        mcq({
          prompt: B(
            'A <code>/version</code> endpoint reads <code>src/phien-ban.json</code>, which is committed to the repository and updated by hand before each release. Measured:' +
            code('  HEAD hien tai:                       22e61d6\n' +
                 '  commit ghi trong src/phien-ban.json: 682684f\n' +
                 '  cha cua HEAD:                        682684f\n' +
                 '    22e61d6 them /version\n' +
                 '    682684f bo export-ignore') +
            'Why is this skew structural rather than a mistake somebody made?',
            'Một endpoint <code>/version</code> đọc <code>src/phien-ban.json</code>, tệp này được commit vào kho và sửa tay trước mỗi lần phát hành. Đo được:' +
            code('  HEAD hien tai:                       22e61d6\n' +
                 '  commit ghi trong src/phien-ban.json: 682684f\n' +
                 '  cha cua HEAD:                        682684f\n' +
                 '    22e61d6 them /version\n' +
                 '    682684f bo export-ignore') +
            'Vì sao cú lệch này mang tính CẤU TRÚC chứ không phải một sai sót của ai đó?',
          ),
          options: [
            B(
              'Because the deploy shipped the parent commit rather than <code>HEAD</code>, which happens whenever the artifact is built before the last commit is pushed; the fix is to build after pushing rather than before',
              'Vì lần deploy đã gửi đi commit cha chứ không phải <code>HEAD</code>, chuyện xảy ra bất cứ khi nào tạo tác được dựng trước lúc commit cuối được đẩy lên; cách chữa là dựng SAU khi đẩy chứ không phải trước',
            ),
            B(
              'Because the process was never restarted after the swap, so it is still executing the previous release from memory; restarting the service makes the reported hash and the running hash agree again',
              'Vì tiến trình chưa từng được khởi động lại sau bước tráo, nên nó vẫn đang thực thi bản phát hành trước từ bộ nhớ; khởi động lại dịch vụ sẽ làm mã băm báo ra và mã băm đang chạy khớp lại với nhau',
            ),
            B(
              'Because <code>git rev-parse --short</code> returns an abbreviated hash whose length grows as the repository does, so the two values are the same commit displayed at different lengths and the mismatch is cosmetic',
              'Vì <code>git rev-parse --short</code> trả về một mã băm rút gọn có độ dài tăng theo kích thước kho, nên hai giá trị đó là cùng một commit hiển thị ở hai độ dài khác nhau và cú lệch chỉ là hình thức',
            ),
            B(
              'Because writing the file requires knowing the hash, and the hash is not decided until the file is committed — so a version file inside the repository can only ever name its own parent, on every commit, forever',
              'Vì muốn ghi tệp thì phải biết mã băm, mà mã băm chỉ được quyết định KHI tệp đã được commit — nên một tệp phiên bản nằm trong kho chỉ có thể gọi tên chính cái CHA của nó, ở mọi commit, mãi mãi',
            ),
          ],
          correct: 3,
          explanation: EX(
            'It is a chicken-and-egg problem, not carelessness: the content of a commit is part of what its hash is computed from, so no file inside a commit can contain that commit\'s own hash. Update the file with the current <code>HEAD</code> and commit it, and the commit you just made has a new hash that the file does not know about. The result is worse than reporting nothing, because it looks authoritative — someone comparing <code>/version</code> between staging and production would conclude the two match when they do not. The fix is to stamp the value <em>outside</em> the commit, during the build, after the artifact has been extracted: <code>git archive HEAD | tar x -C "$THUMUC"</code> and then write <code>phien-ban.json</code> into the extracted tree. Measured that way, <code>HEAD</code> and the artifact agreed. Add the generated file to <code>.gitignore</code> — it is derived, committing it guarantees the skew above, and it also produces a permanent stream of one-line diffs in every review. Option 2 describes a different real failure (files swapped, process not restarted) that this transcript rules out, since the running hash here is exactly the parent.',
            'Đây là bài toán con gà quả trứng, không phải sự cẩu thả: nội dung của một commit là một phần của thứ dùng để tính ra mã băm của nó, nên không tệp nào bên trong một commit có thể chứa mã băm của chính commit ấy. Cập nhật tệp theo <code>HEAD</code> hiện tại rồi commit, thì cái commit bạn vừa tạo có một mã băm mới mà tệp không hề biết. Kết quả còn TỆ HƠN việc không báo gì cả, vì nó trông có thẩm quyền — một người đem <code>/version</code> so giữa staging với production sẽ kết luận hai bên khớp trong khi không hề khớp. Cách chữa là đóng dấu giá trị ấy ở NGOÀI commit, trong lúc DỰNG, sau khi tạo tác đã được giải nén: <code>git archive HEAD | tar x -C "$THUMUC"</code> rồi mới ghi <code>phien-ban.json</code> vào cây vừa giải nén. Đo theo cách đó thì <code>HEAD</code> và tạo tác khớp nhau. Hãy thêm tệp sinh ra ấy vào <code>.gitignore</code> — nó là thứ dẫn xuất, commit nó là bảo đảm cú lệch ở trên, và nó còn sinh ra một dòng diff vô nghĩa trong mọi lần rà soát. Phương án 2 mô tả một cú hỏng thật KHÁC (tệp đã tráo, tiến trình chưa khởi động lại) mà chính đoạn terminal này loại trừ, vì mã băm đang chạy ở đây đúng là commit cha.',
          ),
        }),

        // q8 · đáp án 1
        mcq({
          prompt: B(
            'Five releases share unchanged files through hard links (<code>cp -al</code> measured 2 ms and 4.0K against <code>cp -r</code> at 15 ms and 26M). Then one file with two names is modified four ways:' +
            code('-- cp de len b --      a.txt: TU CP      (inode a=1652427 b=1652427)\n' +
                 '-- mv de len b --      a.txt: GOC        (inode a=1652427 b=1652456)\n' +
                 '-- rsync (mac dinh) -- a.txt: GOC        (inode a=1652427 b=1652463)\n' +
                 '-- rsync --inplace --  a.txt: TU RSYNC   (inode a=1652427 b=1652427)') +
            'Which rule does this transcript justify for a releases directory?',
            'Năm bản phát hành dùng chung các tệp không đổi qua liên kết cứng (<code>cp -al</code> đo được 2 ms và 4.0K, so với <code>cp -r</code> 15 ms và 26M). Rồi một tệp có hai tên được sửa theo bốn cách:' +
            code('-- cp de len b --      a.txt: TU CP      (inode a=1652427 b=1652427)\n' +
                 '-- mv de len b --      a.txt: GOC        (inode a=1652427 b=1652456)\n' +
                 '-- rsync (mac dinh) -- a.txt: GOC        (inode a=1652427 b=1652463)\n' +
                 '-- rsync --inplace --  a.txt: TU RSYNC   (inode a=1652427 b=1652427)') +
            'Đoạn terminal này biện minh cho luật nào đối với một thư mục chứa các bản phát hành?',
          ),
          options: [
            B(
              'Never use hard links between releases: the inode numbers show the sharing is unreliable, and the 6.5-fold disk saving is not worth a layout where two different releases can disagree about the contents of the same path',
              'Đừng bao giờ dùng liên kết cứng giữa các bản phát hành: các số inode cho thấy việc dùng chung là không đáng tin, và khoản tiết kiệm đĩa 6,5 lần không đáng đổi lấy một bố cục mà hai bản phát hành khác nhau có thể bất đồng về nội dung của cùng một đường dẫn',
            ),
            B(
              'Treat a release directory as read-only once created, and keep everything writable outside the releases entirely — because <code>cp</code> truncates in place and keeps the inode, so editing one file rewrites it inside every release that shares it, including your rollback target',
              'Coi một thư mục bản phát hành là CHỈ ĐỌC ngay khi nó được tạo ra, và giữ mọi thứ ghi được hoàn toàn ở NGOÀI các bản phát hành — vì <code>cp</code> cắt cụt TẠI CHỖ và giữ nguyên inode, nên sửa một tệp là ghi lại nó bên trong MỌI bản phát hành đang dùng chung nó, kể cả cái đích lùi bản của bạn',
            ),
            B(
              'Always edit release files with <code>cp</code> rather than an editor, since the transcript shows <code>cp</code> is the only one of the four that keeps the inode stable and therefore preserves the link count the layout depends on',
              'Hãy luôn sửa tệp trong bản phát hành bằng <code>cp</code> chứ không phải trình soạn thảo, vì đoạn terminal cho thấy <code>cp</code> là cái duy nhất trong bốn cách giữ inode ổn định và vì thế bảo toàn số liên kết mà bố cục này phụ thuộc vào',
            ),
            B(
              'Prefer <code>rsync --inplace</code> for every release copy, because writing directly into the destination avoids the temporary file and is therefore the only form safe to run while the application is reading the tree',
              'Hãy ưu tiên <code>rsync --inplace</code> cho mọi lần chép bản phát hành, vì ghi thẳng vào đích tránh được tệp tạm và vì thế là dạng DUY NHẤT an toàn khi chạy trong lúc ứng dụng đang đọc cái cây thư mục',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A hard link is not a copy: two names, one inode, one set of blocks. The inode column is the whole story. <code>cp</code> opens the destination and truncates it <em>in place</em> — both names still read <code>1652427</code>, so every other release sharing that file now contains your edit. <code>mv</code> and default <code>rsync</code> replace the directory entry instead (<code>1652456</code>, <code>1652463</code>), which breaks the link and leaves the other names holding the original. <code>rsync --inplace</code> deliberately does what <code>cp</code> does, and exists for cases where you want that. In a releases layout the practical consequence is that a "quick fix in production" inside the current release silently rewrites the same file inside every older release — so your rollback target is now carrying the change you were rolling back from, and nothing anywhere reports it. Two rules make the layout safe: a release directory is read-only once created, and everything that changes at run time (uploads, logs, caches, a SQLite file) lives outside the releases and is symlinked in. Option 1 throws away a real 6.5× saving over a hazard that two rules close; options 3 and 4 recommend precisely the two forms that cause the damage.',
            'Một liên kết cứng KHÔNG phải một bản sao: hai cái tên, MỘT inode, MỘT bộ khối dữ liệu. Cột inode là toàn bộ câu chuyện. <code>cp</code> mở tệp đích rồi cắt cụt nó TẠI CHỖ — cả hai tên vẫn đọc ra <code>1652427</code>, nên mọi bản phát hành khác đang dùng chung tệp đó giờ chứa cú sửa của bạn. <code>mv</code> và <code>rsync</code> mặc định thì thay MỤC THƯ MỤC (<code>1652456</code>, <code>1652463</code>), việc đó cắt đứt liên kết và để các tên còn lại giữ nguyên bản gốc. <code>rsync --inplace</code> cố ý làm đúng cái mà <code>cp</code> làm, và nó tồn tại cho những ca người ta MUỐN thế. Trong một bố cục bản phát hành, hệ quả thực tế là một cú "sửa nhanh trên production" bên trong bản hiện hành sẽ âm thầm ghi lại đúng tệp đó bên trong mọi bản cũ hơn — nên cái đích lùi bản của bạn giờ mang theo đúng cái thay đổi bạn định lùi khỏi, và không chỗ nào báo cả. Hai luật làm cho bố cục này an toàn: một thư mục bản phát hành là chỉ-đọc ngay khi được tạo, và mọi thứ thay đổi lúc chạy (tệp tải lên, log, cache, một tệp SQLite) sống ở NGOÀI các bản phát hành rồi được liên kết mềm vào. Phương án 1 vứt bỏ khoản tiết kiệm 6,5 lần có thật để né một mối nguy mà hai cái luật đã đóng lại; phương án 3 và 4 khuyên đúng hai dạng gây ra thiệt hại.',
          ),
        }),

        /* ── Chương 2 — vận chuyển (4 câu) ────────────────────────────── */

        // q9 · đáp án 2
        mcq({
          prompt: B(
            'A config file is edited and re-deployed <em>within the same second</em>, keeping exactly the same size. Measured on rsync 3.2.7:' +
            code('  a = PHIEN BAN 2   (11 byte, mtime 20:46:25.628301006)\n' +
                 '  b = PHIEN BAN 1   (11 byte, mtime 20:46:25.582301006)\n' +
                 '$ rsync -ai --stats a/ b/\n' +
                 '  Number of regular files transferred: 0\n' +
                 '  Total bytes sent: 78\n' +
                 '  SAU rsync -a:  b = PHIEN BAN 1\n' +
                 '$ rsync -aic --stats a/ b/\n' +
                 '  >fc........ cau-hinh.txt\n' +
                 '  SAU rsync -ac: b = PHIEN BAN 2') +
            'What happened, and what does it mean for a deploy?',
            'Một tệp cấu hình được sửa rồi deploy lại TRONG CÙNG MỘT GIÂY, giữ đúng nguyên kích thước. Đo trên rsync 3.2.7:' +
            code('  a = PHIEN BAN 2   (11 byte, mtime 20:46:25.628301006)\n' +
                 '  b = PHIEN BAN 1   (11 byte, mtime 20:46:25.582301006)\n' +
                 '$ rsync -ai --stats a/ b/\n' +
                 '  Number of regular files transferred: 0\n' +
                 '  Total bytes sent: 78\n' +
                 '  SAU rsync -a:  b = PHIEN BAN 1\n' +
                 '$ rsync -aic --stats a/ b/\n' +
                 '  >fc........ cau-hinh.txt\n' +
                 '  SAU rsync -ac: b = PHIEN BAN 2') +
            'Chuyện gì đã xảy ra, và nó có nghĩa gì với một lần deploy?',
          ),
          options: [
            B(
              'The two files were already identical when rsync ran and the second command re-sent one anyway, which is why <code>-c</code> costs a full read of both trees and should be avoided on anything larger than a configuration directory',
              'Hai tệp vốn đã giống hệt nhau lúc rsync chạy và câu lệnh thứ hai vẫn gửi lại một tệp, và đó là lý do <code>-c</code> tốn một lượt đọc đủ cả hai cây thư mục nên cần tránh với bất cứ thứ gì to hơn một thư mục cấu hình',
            ),
            B(
              'rsync refused the transfer because the destination file was newer than the source by sub-second precision; adding <code>--update</code> would have made the direction explicit and produced the same result as <code>-c</code>',
              'rsync từ chối chuyển vì tệp đích mới hơn tệp nguồn ở độ chính xác dưới giây; thêm <code>--update</code> sẽ làm rõ chiều và cho ra cùng kết quả như <code>-c</code>',
            ),
            B(
              'rsync\'s default quick check compares size and whole-second mtime, so a same-size change inside one second looks unchanged and is skipped; the deploy exits 0 having transferred nothing and the server keeps the old file until <code>-c</code> or <code>--checksum</code> forces a content comparison',
              'Phép kiểm nhanh mặc định của rsync so KÍCH THƯỚC và mtime tính theo GIÂY TRÒN, nên một thay đổi cùng kích thước trong vòng một giây trông như không đổi và bị bỏ qua; lần deploy thoát ra 0 mà không chuyển gì và máy chủ giữ nguyên tệp cũ cho tới khi <code>-c</code> hay <code>--checksum</code> ép một phép so nội dung',
            ),
            B(
              'The <code>-i</code> flag suppresses transfers so that changes can be itemized without applying them, so the first command was a dry run by construction and the file was never going to be updated by it',
              'Cờ <code>-i</code> chặn việc chuyển tệp để có thể liệt kê thay đổi mà không áp dụng chúng, nên câu lệnh đầu vốn là một lượt chạy thử theo thiết kế và tệp đó chẳng bao giờ được nó cập nhật',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the quiet one. rsync\'s default "quick check" decides a file is unchanged when its size and its modification time both match, and the mtime comparison is at <em>whole-second</em> granularity — the two timestamps here differ by 46 milliseconds inside the same second, so they compare equal. Same size, same second, different content: skipped. The deploy reported <code>Number of regular files transferred: 0</code>, exited 0, and left version 1 on the server. Nothing anywhere is red. Adding <code>-c</code> (<code>--checksum</code>) makes rsync compare a checksum of the contents instead, and the itemize column changes to <code>>fc</code> — the <code>c</code> meaning the checksum differed. That costs a full read of both sides, which is why it is not the default. Two practical consequences: an automated deploy that regenerates a config file and rsyncs it in the same second can silently ship nothing, and any "rsync said it was up to date" claim is a claim about size and seconds, not about content. Option 4 is wrong about the flag — <code>-i</code> is <code>--itemize-changes</code> and does transfer; <code>-n</code> is the dry run.',
            'Đây là ca âm thầm. Phép "kiểm nhanh" mặc định của rsync kết luận một tệp là KHÔNG ĐỔI khi kích thước và thời điểm sửa của nó cùng khớp, mà phép so mtime lại ở độ hạt GIÂY TRÒN — hai dấu thời gian ở đây lệch nhau 46 mili giây bên trong cùng một giây, nên chúng so ra bằng nhau. Cùng kích thước, cùng giây, khác nội dung: bỏ qua. Lần deploy báo <code>Number of regular files transferred: 0</code>, thoát ra 0, và để lại phiên bản 1 trên máy chủ. Không chỗ nào đỏ cả. Thêm <code>-c</code> (<code>--checksum</code>) thì rsync so mã băm của NỘI DUNG thay vào đó, và cột liệt kê đổi thành <code>&gt;fc</code> — chữ <code>c</code> nghĩa là mã băm khác nhau. Cái đó tốn một lượt đọc đủ cả hai phía, và đó là lý do nó không phải mặc định. Hai hệ quả thực tế: một quy trình deploy tự động sinh lại tệp cấu hình rồi rsync nó trong cùng một giây có thể âm thầm chẳng gửi gì cả, và mọi lời khẳng định kiểu "rsync bảo đã mới nhất rồi" là lời khẳng định về KÍCH THƯỚC và GIÂY, không phải về nội dung. Phương án 4 sai về cái cờ — <code>-i</code> là <code>--itemize-changes</code> và VẪN chuyển tệp; <code>-n</code> mới là lượt chạy thử.',
          ),
        }),

        // q10 · đáp án 0
        mcq({
          prompt: B(
            'A directory of 400 files, all on version 1, receives an rsync of version 2. The transfer is killed with <code>SIGKILL</code> partway:' +
            code('=== rsync bi giet giua chung ===\n' +
                 '  con PHIEN BAN 1:      382 tep\n' +
                 '  da thanh PHIEN BAN 2:  18 tep\n' +
                 '  tep tam con sot lai:    0\n' +
                 '  tep nua no nua kia:     0') +
            'What is the failure shape here, and what closes it?',
            'Một thư mục 400 tệp, tất cả đang ở phiên bản 1, nhận một lượt rsync của phiên bản 2. Lượt chuyển bị giết bằng <code>SIGKILL</code> giữa chừng:' +
            code('=== rsync bi giet giua chung ===\n' +
                 '  con PHIEN BAN 1:      382 tep\n' +
                 '  da thanh PHIEN BAN 2:  18 tep\n' +
                 '  tep tam con sot lai:    0\n' +
                 '  tep nua no nua kia:     0') +
            'Hình dạng của cú hỏng ở đây là gì, và cái gì đóng nó lại?',
          ),
          options: [
            B(
              'rsync is atomic per file but not per deploy, so every file is valid and the directory is a mixture of two releases that was never tested; the fix is structural — transfer into a new release directory nothing is serving from, then move the symlink',
              'rsync nguyên tử theo TỪNG TỆP chứ không theo cả lần deploy, nên mọi tệp đều hợp lệ còn cả thư mục là một hỗn hợp của hai bản phát hành chưa từng được kiểm thử; cách chữa mang tính cấu trúc — chuyển vào một thư mục bản phát hành MỚI mà không ai đang phục vụ từ đó, rồi mới dời symlink',
            ),
            B(
              'rsync left 18 partially written files that happen to start with valid version-2 content, so the count is misleading; the fix is <code>--partial-dir</code>, which keeps incomplete files out of the destination path',
              'rsync để lại 18 tệp viết dở mà tình cờ mở đầu bằng nội dung phiên bản 2 hợp lệ, nên con số đó gây hiểu lầm; cách chữa là <code>--partial-dir</code>, thứ giữ các tệp chưa hoàn tất ra ngoài đường dẫn đích',
            ),
            B(
              'The kill happened during rsync\'s file-list phase rather than its transfer phase, which is why so few files changed; running with <code>--delete-after</code> makes the phases explicit and the interruption harmless',
              'Cú giết rơi vào pha lập danh sách tệp của rsync chứ không phải pha chuyển, và đó là lý do rất ít tệp bị đổi; chạy kèm <code>--delete-after</code> làm các pha trở nên tường minh và cú cắt ngang trở nên vô hại',
            ),
            B(
              'Nothing is wrong: 382 of 400 files are still the tested version, so the deployment is 95% correct and simply re-running the same rsync converges it to a fully consistent state within one more attempt',
              'Chẳng có gì sai: 382 trên 400 tệp vẫn là phiên bản đã kiểm thử, nên lần triển khai đúng tới 95% và chỉ cần chạy lại đúng lệnh rsync đó là nó hội tụ về trạng thái nhất quán hoàn toàn trong một lượt nữa',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Read the last two lines of the transcript before the first two: <b>zero</b> temporary files and <b>zero</b> files containing half of one version and half of another. rsync writes each file to a hidden temporary name and renames it into place, so per-file atomicity holds even under <code>SIGKILL</code>. That is the good news, and it is also what makes the bad news hard to see: the directory now contains 382 files from one release and 18 from another, running together as a version that was never tested and exists in no commit. The failure this produces is not a crash — it is one module expecting a new database column while another still writes the old one, and bug reports describing code that does not exist anywhere. It also does not require a kill: a dropped connection, a laptop lid, a CI timeout each produce the same state. The fix cannot come from a transport flag, because no flag gives per-deploy atomicity; it comes from the releases layout. Transfer into a fresh directory nothing is serving from — an interrupted transfer then leaves a half-populated directory nobody is using and the live release untouched — and swap with a single <code>rename(2)</code>, which cannot half-happen. Option 4 is the dangerous reading: 95% of a release is not 95% working, it is an untested release.',
            'Hãy đọc hai dòng CUỐI của đoạn terminal trước hai dòng đầu: <b>không</b> tệp tạm nào và <b>không</b> tệp nào chứa nửa phiên bản này nửa phiên bản kia. rsync ghi mỗi tệp ra một tên tạm ẩn rồi đổi tên nó vào chỗ, nên tính nguyên tử THEO TỆP vẫn giữ được ngay cả dưới <code>SIGKILL</code>. Đó là tin tốt, và cũng chính là thứ làm tin xấu khó thấy: thư mục giờ chứa 382 tệp của một bản phát hành và 18 tệp của bản khác, chạy chung với nhau như một phiên bản chưa từng được kiểm thử và không tồn tại trong commit nào. Cú hỏng nó sinh ra không phải một cú sập — mà là một mô-đun trông chờ một cột cơ sở dữ liệu mới trong khi mô-đun khác vẫn ghi theo cột cũ, và những báo cáo lỗi mô tả một đoạn mã không tồn tại ở đâu cả. Nó cũng chẳng cần tới một cú giết: một kết nối rớt, một cái nắp laptop đóng lại, một job CI hết giờ đều sinh ra đúng trạng thái ấy. Cách chữa KHÔNG thể đến từ một cái cờ của đường vận chuyển, vì không cờ nào cho bạn tính nguyên tử THEO CẢ LẦN DEPLOY; nó đến từ bố cục bản phát hành. Hãy chuyển vào một thư mục mới toanh mà không ai đang phục vụ từ đó — một lượt chuyển bị cắt ngang khi ấy chỉ để lại một thư mục chưa đầy mà chẳng ai dùng, còn bản đang sống thì không hề bị đụng — rồi tráo bằng đúng MỘT lệnh <code>rename(2)</code>, thứ không thể xảy ra nửa vời. Phương án 4 là cách đọc nguy hiểm: 95% của một bản phát hành không phải là chạy được 95%, nó là một bản phát hành CHƯA ĐƯỢC KIỂM THỬ.',
          ),
        }),

        // q11 · đáp án 3
        mcq({
          prompt: B(
            'Two images built from the same Dockerfile, changing only one source file. Layer digests and packaged sizes, measured:' +
            code('  app2:v1  ded5352e…  fcc31361…  39a52b65…  280be402…\n' +
                 '  app2:v2  ded5352e…  fcc31361…  39a52b65…  b2a31c00…\n' +
                 '  docker save app2:v1        → 75M\n' +
                 '  docker save app2:v2        → 75M\n' +
                 '  docker save app2:v1 app2:v2 → 75M') +
            'Now the same project with <code>COPY . .</code> placed <em>before</em> the dependency step:' +
            code('  app3:v1  ded5352e…  fcc31361…  9cdf1c0b…  35148b83…\n' +
                 '  app3:v2  ded5352e…  fcc31361…  0dff880b…  69b069fa…\n' +
                 '  so buoc CACHED: 1     build lai mat 7172 ms') +
            'What did moving that one line cost?',
            'Hai ảnh dựng từ cùng một Dockerfile, chỉ đổi một tệp mã nguồn. Mã băm tầng và kích thước đóng gói, đo thật:' +
            code('  app2:v1  ded5352e…  fcc31361…  39a52b65…  280be402…\n' +
                 '  app2:v2  ded5352e…  fcc31361…  39a52b65…  b2a31c00…\n' +
                 '  docker save app2:v1        → 75M\n' +
                 '  docker save app2:v2        → 75M\n' +
                 '  docker save app2:v1 app2:v2 → 75M') +
            'Giờ cùng dự án đó nhưng đặt <code>COPY . .</code> TRƯỚC bước phụ thuộc:' +
            code('  app3:v1  ded5352e…  fcc31361…  9cdf1c0b…  35148b83…\n' +
                 '  app3:v2  ded5352e…  fcc31361…  0dff880b…  69b069fa…\n' +
                 '  so buoc CACHED: 1     build lai mat 7172 ms') +
            'Việc dời đúng một dòng đó đã tốn cái gì?',
          ),
          options: [
            B(
              'Nothing measurable: both Dockerfiles produce a working image of the same size, and the digests differ only because BuildKit salts every layer it creates, which is why comparing them across builds is not meaningful',
              'Không tốn gì đo được: cả hai Dockerfile đều cho ra một ảnh chạy được cùng kích thước, còn mã băm khác nhau chỉ vì BuildKit rắc muối vào mọi tầng nó tạo ra, và đó là lý do đem so chúng giữa các lần dựng là vô nghĩa',
            ),
            B(
              'The final image became larger, because <code>COPY . .</code> brings the whole working tree into the image while the ordered version copies only the two files the dependency step needs',
              'Ảnh cuối cùng to ra, vì <code>COPY . .</code> mang cả cây làm việc vào ảnh trong khi bản có thứ tự chỉ chép hai tệp mà bước phụ thuộc cần',
            ),
            B(
              'The build lost its cache but the transport did not, because a registry deduplicates by content rather than by digest, so the 30 MB dependency layer is still uploaded only once no matter how many times it is rebuilt',
              'Bản dựng mất cache nhưng đường vận chuyển thì không, vì registry khử trùng lặp theo NỘI DUNG chứ không theo digest, nên tầng phụ thuộc 30 MB vẫn chỉ được tải lên một lần dù nó bị dựng lại bao nhiêu lần',
            ),
            B(
              'Every deploy now moves the 30 MB dependency layer instead of the small source layer: in the ordered version v1 and v2 share three identical digests so both images package to the same 75 MB as one, while in the reordered version the dependency digest changed too, only one step was cached, and the rebuild took 7,172 ms',
              'Bây giờ mỗi lần deploy phải chuyển tầng phụ thuộc 30 MB thay vì tầng mã nguồn bé xíu: ở bản có thứ tự, v1 và v2 dùng chung ba digest y hệt nên đóng gói cả hai ảnh vẫn ra đúng 75 MB như một ảnh, còn ở bản đảo thứ tự thì digest của tầng phụ thuộc cũng đổi, chỉ có một bước được cache, và lần dựng lại tốn 7.172 ms',
            ),
          ],
          correct: 3,
          explanation: EX(
            'An image is not a file, it is a list of content-addressed layers. In the ordered build the base and dependency digests are byte-identical between v1 and v2 — <code>ded5352e</code> and <code>fcc31361</code> and <code>39a52b65</code> appear in both — so packaging the two images together produced <b>75 MB, not 150</b>: the shared blobs exist once and both manifests point at them. A registry does exactly this by digest, which is why pushing v2 to a registry that already holds v1 uploads only the layer that changed. Reordering broke it. A layer is invalidated when its inputs change, and every layer <em>below</em> it is rebuilt too; putting <code>COPY . .</code> above the dependency install means the install now sits after a layer that changes on every commit, so its digest changed as well (<code>9cdf1c0b</code> to <code>0dff880b</code>) and only one step was reused from cache. The Dockerfile still works — that is what makes it dangerous. It is simply thousands of times more expensive per deploy, and nothing warns you. Option 3 gets the registry backwards: deduplication is <em>by digest</em>, and the whole point is that the digest changed.',
            'Một ảnh không phải một tệp, nó là một DANH SÁCH các tầng định địa chỉ theo nội dung. Ở bản dựng có thứ tự, digest của tầng nền và tầng phụ thuộc giống hệt nhau từng byte giữa v1 và v2 — <code>ded5352e</code>, <code>fcc31361</code> và <code>39a52b65</code> đều xuất hiện ở cả hai — nên đóng gói hai ảnh cùng lúc cho ra <b>75 MB, không phải 150</b>: các blob dùng chung tồn tại MỘT lần và cả hai manifest đều trỏ vào chúng. Một registry làm đúng việc đó theo digest, và đó là lý do đẩy v2 lên một registry đã có v1 thì chỉ tải lên đúng cái tầng đã đổi. Đảo thứ tự làm hỏng chuyện đó. Một tầng bị vô hiệu hoá khi đầu vào của nó đổi, và mọi tầng NẰM DƯỚI nó cũng bị dựng lại; đặt <code>COPY . .</code> lên trên bước cài phụ thuộc nghĩa là bước cài giờ nằm SAU một tầng đổi ở mọi commit, nên digest của nó cũng đổi (<code>9cdf1c0b</code> thành <code>0dff880b</code>) và chỉ một bước được dùng lại từ cache. Cái Dockerfile vẫn CHẠY — chính điều đó làm nó nguy hiểm. Nó chỉ đơn giản là đắt hơn hàng nghìn lần mỗi lần deploy, và không có gì cảnh báo bạn. Phương án 3 hiểu ngược về registry: khử trùng lặp là THEO DIGEST, và toàn bộ vấn đề là digest đã đổi.',
          ),
        }),

        // q12 · đáp án 1
        mcq({
          prompt: B(
            'Two deploys overlap. B is started second and finishes first; A then overwrites it, and production ends up running A — the older change — with both scripts exiting 0 and both printing a success line. A lock is added, and with it two overlapping runs measured in a scratch container serialised correctly: A took the lock, B waited, and the front door ended on B.' +
            code('exec 9>/var/lock/deploy.lock\nflock -n 9 || { echo "co lan deploy khac dang chay" >&2; exit 1; }') +
            'What changes if <code>-n</code> is replaced by <code>-w 30</code>, and which do you usually want?',
            'Hai lần deploy chồng lên nhau. B khởi động SAU nhưng xong TRƯỚC; rồi A ghi đè lên nó, và production rốt cuộc chạy A — thay đổi CŨ hơn — trong khi cả hai script đều thoát ra 0 và cùng in ra một dòng báo thành công. Người ta thêm một cái khoá, và với nó thì hai lượt chạy chồng nhau đo trong một container nháp đã tuần tự hoá đúng: A lấy được khoá, B CHỜ, và cửa trước kết thúc ở B:' +
            code('exec 9>/var/lock/deploy.lock\nflock -n 9 || { echo "co lan deploy khac dang chay" >&2; exit 1; }') +
            'Thay <code>-n</code> bằng <code>-w 30</code> thì đổi cái gì, và bạn thường muốn cái nào?',
          ),
          options: [
            B(
              '<code>-w 30</code> makes the lock advisory rather than mandatory, so a second deploy proceeds anyway but is recorded in the lock file for later auditing; you usually want <code>-n</code> because only it actually prevents the overlap',
              '<code>-w 30</code> làm cho khoá thành khuyến nghị thay vì bắt buộc, nên lần deploy thứ hai vẫn cứ chạy nhưng được ghi lại trong tệp khoá để kiểm toán sau; bạn thường muốn <code>-n</code> vì chỉ nó mới thật sự ngăn được cú chồng lấn',
            ),
            B(
              '<code>-n</code> fails immediately so B refuses and exits non-zero, while <code>-w 30</code> makes B wait for A and then deploy — so the newest change wins, which is almost always what you actually wanted; either way only one deploy runs at a time',
              '<code>-n</code> hỏng ngay nên B từ chối và thoát ra khác 0, còn <code>-w 30</code> làm B CHỜ A rồi mới deploy — nên thay đổi MỚI NHẤT thắng, mà đó gần như luôn là thứ bạn thật sự muốn; đằng nào thì cũng chỉ có một lần deploy chạy tại một thời điểm',
            ),
            B(
              '<code>-w 30</code> holds the lock for thirty seconds after the script exits so a rapid second run is still blocked, which is the standard way to debounce a CI job that triggers twice on the same push',
              '<code>-w 30</code> giữ khoá thêm ba mươi giây sau khi script thoát nên một lượt chạy thứ hai ngay sau đó vẫn bị chặn, và đó là cách chuẩn để khử dội một job CI bị kích hai lần trên cùng một cú đẩy',
            ),
            B(
              'Nothing changes for correctness, only for reporting: both forms serialise the deploys, and the choice is purely about whether the rejected run appears as a failure or a success in the CI dashboard',
              'Về tính đúng đắn thì không đổi gì, chỉ đổi cách báo cáo: cả hai dạng đều tuần tự hoá các lần deploy, và lựa chọn hoàn toàn là chuyện lần chạy bị từ chối hiện ra là thất bại hay thành công trên bảng điều khiển CI',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Both forms serialise, and they differ in what happens to the loser. <code>-n</code> is non-blocking: B discovers the lock is held, prints its message and exits non-zero, so CI marks that run failed rather than silently doing nothing. <code>-w 30</code> waits up to thirty seconds; A finishes, releases, and B deploys — so the final state is B, the newest change, which is normally the intent. Two details make this lock trustworthy and are worth stating. The lock lives on a <em>file descriptor</em>, so the kernel drops it when the process exits, including on a crash, a kill or a dropped SSH session — a lock file you create and delete by hand has no such property and a stale one blocks deploys until a human removes it. And it must live on the machine being deployed to: a lock on your laptop knows nothing about the deploy running from CI. Two traps to carry: <code>flock file cmd</code> holds the lock only for that one command, which is useless for a multi-step deploy — the <code>exec 9&gt;file</code> form holds it for the life of the shell. And any long-lived process started inside the locked section inherits descriptor 9 and keeps the lock alive after the script exits, which deadlocks every later deploy; close it in the child with <code>9&gt;&amp;-</code>.',
            'Cả hai dạng đều tuần tự hoá, và chúng khác nhau ở chỗ kẻ thua bị gì. <code>-n</code> là không chặn: B phát hiện khoá đang bị giữ, in thông báo của nó rồi thoát ra khác 0, nên CI đánh dấu lần chạy ấy là THẤT BẠI chứ không phải im lặng chẳng làm gì. <code>-w 30</code> thì chờ tối đa ba mươi giây; A xong, nhả khoá, và B deploy — nên trạng thái cuối là B, thay đổi mới nhất, mà đó thường là ý định. Hai chi tiết làm cho cái khoá này đáng tin và rất đáng nói ra. Khoá nằm trên một MÔ TẢ TỆP, nên nhân hệ điều hành tự nhả nó khi tiến trình thoát, kể cả khi sập, bị giết hay rớt phiên SSH — một tệp khoá bạn tự tạo rồi tự xoá không có tính chất đó, và một tệp khoá cũ sót lại sẽ chặn mọi lần deploy cho tới khi có người xoá tay. Và nó phải nằm trên chính CÁI MÁY ĐANG ĐƯỢC DEPLOY: một cái khoá trên laptop của bạn chẳng biết gì về lần deploy đang chạy từ CI. Hai cái bẫy nên mang theo: <code>flock file cmd</code> chỉ giữ khoá trong đúng một câu lệnh đó, vô dụng với một lần deploy nhiều bước — dạng <code>exec 9&gt;file</code> giữ nó suốt đời cái shell. Và bất kỳ tiến trình sống lâu nào khởi động bên trong vùng đã khoá đều THỪA KẾ mô tả tệp 9 rồi giữ khoá sống tiếp sau khi script thoát, khoá chết mọi lần deploy sau; hãy đóng nó ở tiến trình con bằng <code>9&gt;&amp;-</code>.',
          ),
        }),

        /* ── Chương 3 — bước tráo (5 câu) ─────────────────────────────── */

        // q13 · đáp án 0
        mcq({
          prompt: B(
            'The same application (1.5 s to become ready) deployed two ways, with a client sending requests throughout:' +
            code('════ A) DUNG roi KHOI DONG LAI ════\n' +
                 '  200: 257   loi ket noi: 103   ma khac: 0\n' +
                 '  phan bo ban: {A: 89, B: 168}\n\n' +
                 '════ B) XANH-LAM (cung ung dung, cung 1,5s khoi dong) ════\n' +
                 '  ban B san sang sau 1556ms\n' +
                 '  da chuyen upstream sang 3422\n' +
                 '  200: 106   loi ket noi: 0   ma khac: 0\n' +
                 '  phan bo ban: {A: 46, B: 60}') +
            'Nothing about the application changed. What did?',
            'Cùng một ứng dụng (mất 1,5 giây để sẵn sàng) được triển khai theo hai cách, với một client bắn request suốt quá trình:' +
            code('════ A) DUNG roi KHOI DONG LAI ════\n' +
                 '  200: 257   loi ket noi: 103   ma khac: 0\n' +
                 '  phan bo ban: {A: 89, B: 168}\n\n' +
                 '════ B) XANH-LAM (cung ung dung, cung 1,5s khoi dong) ════\n' +
                 '  ban B san sang sau 1556ms\n' +
                 '  da chuyen upstream sang 3422\n' +
                 '  200: 106   loi ket noi: 0   ma khac: 0\n' +
                 '  phan bo ban: {A: 46, B: 60}') +
            'Không có gì về ứng dụng thay đổi cả. Vậy cái gì đã đổi?',
          ),
          options: [
            B(
              'Only the order of the four steps: start the new version alongside the old, wait until it genuinely answers, move traffic in one atomic action, and stop the old one last — the naive deploy does exactly these four in reverse',
              'Chỉ có THỨ TỰ của bốn bước: khởi động bản mới BÊN CẠNH bản cũ, chờ tới khi nó thật sự trả lời được, chuyển lưu lượng bằng một thao tác nguyên tử, rồi mới dừng bản cũ SAU CÙNG — quy trình ngây thơ làm đúng bốn bước ấy theo chiều ngược lại',
            ),
            B(
              'The second run used a proxy, and a proxy retries a refused connection against the same backend until it succeeds, so the 103 failures became 103 retries that are invisible in the success count',
              'Lượt thứ hai có dùng proxy, mà proxy thì thử lại một kết nối bị từ chối vào chính backend đó cho tới khi thành công, nên 103 cú hỏng trở thành 103 lượt thử lại vô hình trong con số thành công',
            ),
            B(
              'The second run was simply shorter — 106 requests against 360 — so the same failure rate had far fewer opportunities to occur, and repeating it for the same duration would show a proportional number of errors',
              'Lượt thứ hai đơn giản là NGẮN hơn — 106 request so với 360 — nên cùng tỷ lệ hỏng đó có ít cơ hội xảy ra hơn nhiều, và lặp lại nó trong cùng khoảng thời gian sẽ cho ra số lỗi tương ứng',
            ),
            B(
              'The application became faster to start: 1,556 ms is the measured readiness of version B, which is close enough to instant that the window with nothing listening was too short for the client to sample',
              'Ứng dụng khởi động nhanh hơn: 1.556 ms là thời gian sẵn sàng đo được của bản B, đủ gần với tức thì để cái cửa sổ không ai lắng nghe ngắn tới mức client không kịp lấy mẫu',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Read <code>ma khac: 0</code> in the first block. There were no 5xx responses at all — the 103 failures were connection errors, because for most of that window there was no process to produce a status code. That is the signature of window 2: the old process is dead and the new one has not bound the port yet, and its length is exactly your startup time. No amount of care inside the application closes it, which is why the fix has to be structural. The blue-green run kept something listening at every instant: version B was started on a second port while A was still serving, the script polled B\'s own health endpoint until it genuinely answered (1,556 ms — measured, not guessed), traffic moved with one proxy reload, and only then was A sent <code>SIGTERM</code>. The version distribution proves the handover happened with no gap: 46 answered by A, 60 by B, none by nobody. Option 4 misreads the number — 1,556 ms is how long B took to become ready, which is the same 1.5 s as before; the point is that nobody was sent to B during it. Option 3 is worth resisting: a failure <em>rate</em> of zero over 106 requests is not a smaller sample of 103 failures, it is a different outcome.',
            'Hãy đọc dòng <code>ma khac: 0</code> ở khối đầu. Không hề có một response 5xx nào — 103 cú hỏng là LỖI KẾT NỐI, vì trong phần lớn cái cửa sổ ấy không có tiến trình nào để mà sinh ra một mã trạng thái. Đó là chữ ký của cửa sổ số 2: tiến trình cũ đã chết còn tiến trình mới chưa gắn được cổng, và độ dài của nó ĐÚNG BẰNG thời gian khởi động của bạn. Không có sự cẩn thận nào bên trong ứng dụng đóng được nó lại, và đó là lý do cách chữa phải mang tính cấu trúc. Lượt xanh-lam giữ cho luôn có ai đó đang lắng nghe ở mọi thời điểm: bản B được khởi động trên một cổng thứ hai trong khi A vẫn đang phục vụ, script dò chính endpoint sức khoẻ của B cho tới khi nó thật sự trả lời (1.556 ms — đo được, không phải đoán), lưu lượng chuyển bằng một lần nạp lại proxy, và chỉ tới lúc đó A mới nhận <code>SIGTERM</code>. Phân bố phiên bản chứng minh cú bàn giao không có khe: 46 do A trả lời, 60 do B, không cái nào do không ai cả. Phương án 4 đọc sai con số — 1.556 ms là thời gian B cần để SẴN SÀNG, tức vẫn đúng 1,5 giây như trước; điểm mấu chốt là trong khoảng đó không ai bị gửi tới B. Phương án 3 đáng để cưỡng lại: một TỶ LỆ hỏng bằng không trên 106 request không phải là một mẫu nhỏ hơn của 103 cú hỏng, nó là một kết cục khác.',
          ),
        }),

        // q14 · đáp án 2
        mcq({
          prompt: B(
            'Ten requests are in flight, each taking 400 ms, when the process receives <code>SIGTERM</code>. Three implementations measured:' +
            code('════ SIGKILL ════\n' +
                 '  ma tra ve cho 10 request dang bay: 000 000 000 000 000 000 000 000 000 000\n' +
                 '  cong 3701 con ai nghe khong? socket: 0\n\n' +
                 '════ SIGTERM, ban DAU (co cai co 503) ════\n' +
                 '  ma tra ve cho 10 request dang bay: 503 503 503 503 503 503 503 503 503 503\n' +
                 '  cong 3702 con ai nghe khong? socket: 0\n' +
                 '  [co503] SIGTERM — thoi nhan ket noi moi, phuc vu not cai dang co\n' +
                 '  [co503] da dong sach\n\n' +
                 '════ SIGTERM, ban DA SUA ════\n' +
                 '  ma tra ve cho 10 request dang bay: 200 200 200 200 200 200 200 200 200 200\n' +
                 '  cong 3703 con ai nghe khong? socket: 0\n' +
                 '  [dung] SIGTERM — thoi nhan ket noi moi, phuc vu not cai dang co\n' +
                 '  [dung] da dong sach') +
            'The first <code>SIGTERM</code> implementation waited for all ten and closed cleanly. What was wrong with it?',
            'Mười request đang bay, mỗi cái mất 400 ms, thì tiến trình nhận <code>SIGTERM</code>. Ba cách triển khai, đo thật:' +
            code('════ SIGKILL ════\n' +
                 '  ma tra ve cho 10 request dang bay: 000 000 000 000 000 000 000 000 000 000\n' +
                 '  cong 3701 con ai nghe khong? socket: 0\n\n' +
                 '════ SIGTERM, ban DAU (co cai co 503) ════\n' +
                 '  ma tra ve cho 10 request dang bay: 503 503 503 503 503 503 503 503 503 503\n' +
                 '  cong 3702 con ai nghe khong? socket: 0\n' +
                 '  [co503] SIGTERM — thoi nhan ket noi moi, phuc vu not cai dang co\n' +
                 '  [co503] da dong sach\n\n' +
                 '════ SIGTERM, ban DA SUA ════\n' +
                 '  ma tra ve cho 10 request dang bay: 200 200 200 200 200 200 200 200 200 200\n' +
                 '  cong 3703 con ai nghe khong? socket: 0\n' +
                 '  [dung] SIGTERM — thoi nhan ket noi moi, phuc vu not cai dang co\n' +
                 '  [dung] da dong sach') +
            'Bản triển khai <code>SIGTERM</code> đầu tiên đã chờ đủ mười request và đóng sạch sẽ. Vậy nó sai ở đâu?',
          ),
          options: [
            B(
              'It called <code>server.close()</code> too late, after the handler had already accepted the ten requests; calling it in the signal handler before anything else would have let all ten finish with their real responses',
              'Nó gọi <code>server.close()</code> quá muộn, sau khi bộ xử lý đã nhận đủ mười request; gọi nó ngay đầu trình xử lý tín hiệu trước mọi thứ khác sẽ để cả mười hoàn tất với câu trả lời thật của chúng',
            ),
            B(
              'It had no deadline, so a request that never finished would hang the shutdown forever; the fixed version added a <code>setTimeout</code> that exits non-zero, and that timer is what turned the 503s into 200s',
              'Nó không có hạn chót, nên một request không bao giờ xong sẽ treo cả quá trình tắt mãi mãi; bản đã sửa thêm một <code>setTimeout</code> thoát ra khác 0, và chính cái hẹn giờ đó biến các cú 503 thành 200',
            ),
            B(
              'It let the request handler consult the shutdown flag <em>after</em> the request had been accepted and answered <code>503</code> instead of the response it had already computed — from the client\'s side that is a failed request, barely better than <code>SIGKILL</code>',
              'Nó để bộ xử lý request ngó tới cái cờ đang-tắt SAU KHI request đã được nhận, rồi trả về <code>503</code> thay cho câu trả lời mà nó vốn đã tính xong — từ phía client thì đó vẫn là một request HỎNG, hơn <code>SIGKILL</code> chẳng đáng bao nhiêu',
            ),
            B(
              'It returned 503 without a <code>Retry-After</code> header, so well-behaved clients gave up instead of retrying; adding that header is what makes a draining server correct under load',
              'Nó trả 503 mà không kèm header <code>Retry-After</code>, nên các client cư xử đúng mực bỏ cuộc thay vì thử lại; thêm header đó chính là thứ làm một máy chủ đang xả trở nên đúng đắn dưới tải',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The shutdown logic was correct and the outcome was still a failure for every user. <code>server.close()</code> stops accepting <em>new</em> connections immediately — the measurement confirms it, the listening socket was already gone while requests were still being answered — and it runs its callback when the last accepted connection finishes. The bug was one layer up, in the request handler: it checked a <code>dang_dong</code> flag and, finding it set, answered <code>503</code> to requests it had already accepted and could have answered normally. The log tells the truth about what it did ("waited for all ten", "closed cleanly") and says nothing about what the users got. The fix is that the flag must not decide the <em>response</em>. Serve every accepted request unchanged, and use the flag only to add <code>Connection: close</code>, which tells a client holding a keepalive connection not to send another request down it. That subtlety is why this bug survives review: the shutdown reads as careful and the handler reads as defensive. Option 2 names a real requirement — a shutdown does need a deadline, and one that hangs is worse than a fast one — but a timer is not what turned 503 into 200 here.',
            'Logic tắt máy thì ĐÚNG, mà kết cục vẫn là một cú hỏng với mọi người dùng. <code>server.close()</code> ngừng nhận kết nối MỚI ngay lập tức — phép đo xác nhận điều đó, socket lắng nghe đã biến mất trong khi các request vẫn đang được trả lời — và nó chạy hàm gọi lại khi kết nối đã nhận cuối cùng hoàn tất. Con bọ nằm ở tầng trên, trong bộ xử lý request: nó kiểm cờ <code>dang_dong</code>, thấy cờ đã bật, và trả <code>503</code> cho những request mà nó VỐN ĐÃ nhận và hoàn toàn có thể trả lời bình thường. Nhật ký nói thật về việc nó ĐÃ LÀM ("chờ đủ mười", "đóng sạch") và không nói gì về thứ người dùng NHẬN ĐƯỢC. Cách chữa là: cái cờ không được quyền quyết định NỘI DUNG TRẢ LỜI. Hãy phục vụ mọi request đã nhận y như bình thường, và chỉ dùng cờ để thêm <code>Connection: close</code>, thứ báo cho một client đang giữ kết nối keepalive rằng đừng gửi thêm request nào xuống đường đó nữa. Chính sự tinh tế ấy khiến con bọ này sống sót qua các lần rà soát: đoạn tắt máy đọc lên thì cẩn thận, còn bộ xử lý thì đọc lên như đang phòng thủ. Phương án 2 gọi tên một yêu cầu CÓ THẬT — một quy trình tắt đúng là cần hạn chót, và một quy trình treo thì tệ hơn một quy trình nhanh — nhưng một cái hẹn giờ không phải thứ đã biến 503 thành 200 ở đây.',
          ),
        }),

        // q15 · đáp án 3
        mcq({
          prompt: B(
            'Four containers, each stopped with <code>docker stop -t 5</code>. Measured on Docker Engine 29.5.3:' +
            code('  PID 1 = sleep 300                docker stop mat  5201 ms  ExitCode=137\n' +
                 '  PID 1 = bash CO handler TERM     docker stop mat   153 ms  ExitCode=0\n' +
                 '  PID 1 = bash -c "sleep 300"      docker stop mat  5223 ms  ExitCode=137\n' +
                 '  docker run --init … sleep 300    docker stop mat   167 ms  ExitCode=143') +
            'Why do rows one and three take exactly the grace period and exit 137?',
            'Bốn container, mỗi cái dừng bằng <code>docker stop -t 5</code>. Đo trên Docker Engine 29.5.3:' +
            code('  PID 1 = sleep 300                docker stop mat  5201 ms  ExitCode=137\n' +
                 '  PID 1 = bash CO handler TERM     docker stop mat   153 ms  ExitCode=0\n' +
                 '  PID 1 = bash -c "sleep 300"      docker stop mat  5223 ms  ExitCode=137\n' +
                 '  docker run --init … sleep 300    docker stop mat   167 ms  ExitCode=143') +
            'Vì sao dòng một và dòng ba tốn ĐÚNG khoảng ân hạn rồi thoát ra 137?',
          ),
          options: [
            B(
              'Because <code>docker stop</code> always waits the full grace period before checking whether the process is gone, so 5,201 ms is the normal cost and 137 is simply how the runtime reports a container that outlived its timer',
              'Vì <code>docker stop</code> luôn chờ hết khoảng ân hạn rồi mới kiểm xem tiến trình còn hay không, nên 5.201 ms là chi phí bình thường và 137 chỉ là cách runtime báo lại một container sống lâu hơn cái hẹn giờ của nó',
            ),
            B(
              'Because <code>sleep</code> blocks signals while it is sleeping and only checks for them when the interval elapses, which is a property of that particular binary rather than of PID 1, and any long-running server would behave differently',
              'Vì <code>sleep</code> chặn tín hiệu trong lúc nó đang ngủ và chỉ kiểm tín hiệu khi khoảng thời gian trôi hết, đó là tính chất của riêng cái chương trình ấy chứ không phải của PID 1, và một máy chủ chạy lâu bất kỳ sẽ cư xử khác',
            ),
            B(
              'Because the container had no TTY attached, so the signal was delivered to a session leader that no longer existed; adding <code>-t</code> to <code>docker run</code> restores the process group and the signal arrives',
              'Vì container không gắn TTY nào, nên tín hiệu được phát tới một trưởng phiên không còn tồn tại; thêm <code>-t</code> vào <code>docker run</code> khôi phục nhóm tiến trình và tín hiệu tới được nơi cần tới',
            ),
            B(
              'Because PID 1 in a namespace ignores signals that have a default action unless it installed a handler, so <code>SIGTERM</code> is discarded, Docker waits out the timeout and sends <code>SIGKILL</code> — 128+9 = 137; a real handler exits at once, and <code>--init</code> inserts a process that forwards the signal, giving 128+15 = 143',
              'Vì PID 1 trong một namespace LỜ ĐI những tín hiệu chỉ có hành vi mặc định trừ khi nó tự cài một trình xử lý, nên <code>SIGTERM</code> bị vứt bỏ, Docker chờ hết hạn rồi gửi <code>SIGKILL</code> — 128+9 = 137; một trình xử lý thật thì thoát ngay, còn <code>--init</code> chèn vào một tiến trình biết chuyển tiếp tín hiệu, cho ra 128+15 = 143',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The kernel treats PID 1 specially: signals whose disposition is the default action are simply not delivered to it. <code>sleep</code> installs no handler, so as PID 1 it never sees <code>SIGTERM</code>; Docker waits the whole <code>-t 5</code>, gives up, sends <code>SIGKILL</code>, and the exit code is 128+9 = <b>137</b>. Row three is the same thing wearing a shell: <code>bash -c "sleep 300"</code> without <code>exec</code> leaves bash as PID 1 with the real work in a child, and bash in non-interactive mode does not forward the signal either. Row two is the same image with an explicit <code>trap … TERM</code> — 153 ms and a clean exit. Row four is the standard fix: <code>--init</code> inserts a tiny init as PID 1 that forwards signals to the real process, so the exit code becomes 128+15 = <b>143</b>, the signature of a process that was asked politely and agreed. The diagnostic value is the pair 137/143: <code>143</code> means your shutdown handler ran and the process chose to exit; <code>137</code> means it was removed between one instruction and the next, with no chance to drain connections or flush anything. And "<code>docker stop</code> takes exactly ten seconds every time" is this bug, not a slow application.',
            'Nhân hệ điều hành đối xử đặc biệt với PID 1: những tín hiệu mà cách xử lý là HÀNH VI MẶC ĐỊNH thì đơn giản là không được phát tới nó. <code>sleep</code> không cài trình xử lý nào, nên khi làm PID 1 nó không bao giờ thấy <code>SIGTERM</code>; Docker chờ hết cả <code>-t 5</code>, bỏ cuộc, gửi <code>SIGKILL</code>, và mã thoát là 128+9 = <b>137</b>. Dòng ba là đúng chuyện đó khoác áo shell: <code>bash -c "sleep 300"</code> mà không có <code>exec</code> để bash làm PID 1 còn việc thật nằm ở tiến trình con, và bash ở chế độ không tương tác cũng chẳng chuyển tiếp tín hiệu. Dòng hai là cùng cái ảnh đó nhưng có <code>trap … TERM</code> tường minh — 153 ms và một cú thoát sạch. Dòng bốn là cách chữa chuẩn: <code>--init</code> chèn một init tí hon làm PID 1, và nó chuyển tiếp tín hiệu tới tiến trình thật, nên mã thoát thành 128+15 = <b>143</b>, chữ ký của một tiến trình được hỏi lịch sự và đã đồng ý. Giá trị chẩn đoán nằm ở cặp 137/143: <code>143</code> nghĩa là trình xử lý tắt máy của bạn ĐÃ CHẠY và tiến trình tự CHỌN việc thoát; <code>137</code> nghĩa là nó bị gỡ đi giữa hai lệnh máy, không có cơ hội xả kết nối hay đẩy nốt thứ gì ra. Còn câu "<code>docker stop</code> lần nào cũng tốn đúng mười giây" chính là con bọ này, không phải một ứng dụng chậm.',
          ),
        }),

        // q16 · đáp án 1
        mcq({
          prompt: B(
            'A release symlink is moved while the application keeps running, then the process is restarted. Measured:' +
            code('  dang phuc vu: v1\n' +
                 '=== doi symlink sang v2 (KHONG khoi dong lai tien trinh) ===\n' +
                 '  symlink -> /srv/lab/sw/v2\n' +
                 '  cua sau van tra: v1\n' +
                 '=== gio giet roi khoi dong lai ===\n' +
                 '  cua sau bay gio tra: v2') +
            'Which conclusion does this force on a rollback script?',
            'Một symlink bản phát hành được dời trong lúc ứng dụng vẫn chạy, rồi tiến trình mới được khởi động lại. Đo thật:' +
            code('  dang phuc vu: v1\n' +
                 '=== doi symlink sang v2 (KHONG khoi dong lai tien trinh) ===\n' +
                 '  symlink -> /srv/lab/sw/v2\n' +
                 '  cua sau van tra: v1\n' +
                 '=== gio giet roi khoi dong lai ===\n' +
                 '  cua sau bay gio tra: v2') +
            'Kết luận nào bị ép ra đối với một script lùi bản?',
          ),
          options: [
            B(
              'That the symlink move was not atomic, so the process kept a reference to the pre-move target; using <code>mv -Tf</code> instead of <code>ln -sfn</code> makes the change visible to the running process without a restart',
              'Rằng cú dời symlink không nguyên tử, nên tiến trình vẫn giữ một tham chiếu tới đích trước khi dời; dùng <code>mv -Tf</code> thay cho <code>ln -sfn</code> sẽ làm thay đổi đó hiện ra với tiến trình đang chạy mà không cần khởi động lại',
            ),
            B(
              'That a running process does not follow a symlink that changes — it resolved the path when it opened its files — so restoring the pointer is only half a rollback: the handler must also stop the bad process and start the target release, then wait for it to answer',
              'Rằng một tiến trình ĐANG CHẠY không đi theo một symlink bị đổi — nó đã phân giải đường dẫn ngay lúc mở tệp — nên khôi phục con trỏ mới chỉ là NỬA cú lùi: trình xử lý còn phải dừng tiến trình hỏng, khởi động bản phát hành đích, rồi CHỜ nó trả lời được',
            ),
            B(
              'That the symlink should point at a file rather than a directory, since the kernel caches directory symlinks for the lifetime of the mount while file symlinks are re-resolved on every open',
              'Rằng symlink nên trỏ vào một TỆP thay vì một thư mục, vì nhân hệ điều hành lưu đệm symlink thư mục suốt vòng đời của điểm gắn còn symlink tệp thì được phân giải lại ở mỗi lần mở',
            ),
            B(
              'That the application must be told to reload rather than restarted, because a restart drops in-flight requests while a reload re-resolves the symlink in place and keeps the listening socket open',
              'Rằng phải bảo ứng dụng NẠP LẠI thay vì khởi động lại, vì một lần khởi động lại làm rơi các request đang bay còn một lần nạp lại thì phân giải lại symlink tại chỗ và giữ nguyên socket đang lắng nghe',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Path resolution happens at <code>open()</code>. The process read its entry file when it started, and from that moment it holds an open file — not a path it re-checks. Moving the symlink changes what a <em>future</em> resolution would find and is entirely invisible to code already loaded in memory. This is not a defect of the swap; it is why every releases layout pairs the pointer move with a restart. The reason it matters here is that it is the most common bug in a hand-written cleanup handler: the handler restores <code>hien-tai</code> to the previous release, logs "rolled back to v2", exits with the right code — and the machine keeps serving the broken release, because the broken process was never killed. The variant is worse: if the deploy already killed the old process and the new one crashed, restoring the pointer leaves <em>nothing</em> listening at all. A correct handler does four things in order: move the pointer, kill whatever holds the port, start the target release, and poll until it actually answers. Option 1 is wrong on both halves — the swap in this measurement was atomic, and no form of pointer move reaches a process that has already opened its files.',
            'Việc phân giải đường dẫn xảy ra tại lời gọi <code>open()</code>. Tiến trình đã đọc tệp khởi điểm của nó lúc bắt đầu chạy, và từ khoảnh khắc đó nó giữ một TỆP ĐANG MỞ — chứ không phải một đường dẫn để kiểm lại. Dời symlink chỉ đổi thứ mà một lần phân giải TƯƠNG LAI sẽ tìm ra, và hoàn toàn vô hình với đoạn mã đã nạp sẵn trong bộ nhớ. Đây không phải khuyết tật của bước tráo; đây chính là lý do mọi bố cục bản phát hành đều ghép cú dời con trỏ với một lần khởi động lại. Lý do nó quan trọng ở đây là vì đó là con bọ phổ biến nhất trong một trình dọn dẹp viết tay: trình xử lý khôi phục <code>hien-tai</code> về bản trước, ghi nhật ký "đã lùi về v2", thoát ra với mã đúng — còn cái máy thì vẫn phục vụ bản HỎNG, vì tiến trình hỏng chưa từng bị giết. Biến thể còn tệ hơn: nếu lần deploy đã giết tiến trình cũ rồi mà tiến trình mới lại vỡ, thì khôi phục con trỏ để lại KHÔNG AI đang lắng nghe cả. Một trình xử lý đúng làm bốn việc theo thứ tự: dời con trỏ, giết bất cứ ai đang giữ cổng, khởi động bản phát hành đích, và dò cho tới khi nó thật sự trả lời. Phương án 1 sai cả hai nửa — cú tráo trong phép đo này VỐN đã nguyên tử, và không dạng dời con trỏ nào với tới được một tiến trình đã mở tệp xong.',
          ),
        }),

        // q17 · đáp án 0
        mcq({
          prompt: B(
            'Step 2 of a blue-green swap is written three ways. The application takes 1.5 s to become ready; the measured line was <code>ban B san sang sau 1556ms</code>. Which form is right, and why do the other two fail differently?' +
            code('# A\nsleep 1\n\n# B\nsleep 10\n\n# C\nfor i in $(seq 1 60); do\n' +
                 '  [ "$(curl -s -o /dev/null -w \'%{http_code}\' --max-time 1 \\\n' +
                 '        http://127.0.0.1:$MOI/health)" = "200" ] && break\n' +
                 '  sleep 0.1\ndone'),
            'Bước 2 của một cú tráo xanh-lam được viết theo ba cách. Ứng dụng mất 1,5 giây để sẵn sàng; dòng đo được là <code>ban B san sang sau 1556ms</code>. Dạng nào đúng, và hai dạng kia hỏng theo những kiểu khác nhau ra sao?' +
            code('# A\nsleep 1\n\n# B\nsleep 10\n\n# C\nfor i in $(seq 1 60); do\n' +
                 '  [ "$(curl -s -o /dev/null -w \'%{http_code}\' --max-time 1 \\\n' +
                 '        http://127.0.0.1:$MOI/health)" = "200" ] && break\n' +
                 '  sleep 0.1\ndone'),
          ),
          options: [
            B(
              'C. A switches traffic to a process that is listening but not ready, so the failures come back as 502s from the proxy instead of connection refusals; B works and makes every deploy 8 seconds slower for no reason; C adapts to whatever the startup time turns out to be and gives up after a bounded number of attempts',
              'C. Dạng A chuyển lưu lượng sang một tiến trình đã lắng nghe nhưng CHƯA sẵn sàng, nên các cú hỏng quay lại dưới dạng 502 từ proxy thay vì lỗi từ chối kết nối; dạng B thì chạy được nhưng làm mỗi lần deploy chậm thêm 8 giây chẳng vì cái gì; dạng C tự thích ứng với bất kỳ thời gian khởi động nào và bỏ cuộc sau một số lượt có giới hạn',
            ),
            B(
              'B. A fixed wait is the only form that is deterministic, and determinism is what a deploy script needs; C introduces a dependency on the health endpoint being correct, which the course has already shown to be an unreliable signal',
              'B. Một khoảng chờ cố định là dạng DUY NHẤT tất định, mà tất định đúng là thứ một script deploy cần; dạng C đưa vào một sự phụ thuộc rằng endpoint sức khoẻ phải đúng, mà khoá học đã cho thấy đó là một tín hiệu không đáng tin',
            ),
            B(
              'A. One second is enough because the proxy will retry any request that arrives too early against the other backend, so a short wait plus <code>proxy_next_upstream</code> covers the gap at no cost in deploy time',
              'A. Một giây là đủ vì proxy sẽ thử lại bất kỳ request nào tới quá sớm vào backend còn lại, nên một khoảng chờ ngắn cộng với <code>proxy_next_upstream</code> lấp được cái khe mà không tốn thêm thời gian deploy',
            ),
            B(
              'Neither: the readiness of the new version is irrelevant as long as the old one is still running, so step 2 can be removed entirely and traffic switched immediately after the new process is started',
              'Không dạng nào cả: mức sẵn sàng của bản mới là không liên quan chừng nào bản cũ vẫn còn chạy, nên bước 2 bỏ được hoàn toàn và chuyển lưu lượng ngay sau khi tiến trình mới được khởi động',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The three windows in a swap need three different fixes, and this step closes the third one: the port is open, connections are accepted, and the application cannot answer them properly yet — half-initialised pools, empty caches, config not read. <code>sleep 1</code> switches traffic into exactly that state; the failures do not disappear, they change shape from connection refusals to 502s, which is harder to attribute. <code>sleep 10</code> is correct and wasteful: it works, and it taxes every future deploy by the difference between your guess and the truth. The polling loop is the only form that costs what it needs to — the measurement shows 1,556 ms, which is the application\'s real startup — and it keeps working unchanged when a future release starts in 300 ms or in 30 seconds. Two details make the loop production-grade: bound it (<code>seq 1 60</code> plus <code>sleep 0.1</code> is a 6-second ceiling) so a version that never comes up fails the deploy instead of hanging it, and give the failure its own exit code so the caller can tell "did not come up" from "smoke test failed". Option 4 misses that the switch is the moment the old version stops receiving traffic — after it, an unready backend is the only backend.',
            'Ba cửa sổ trong một cú tráo cần ba cách chữa khác nhau, và bước này đóng cửa sổ THỨ BA: cổng đã mở, kết nối được nhận, nhưng ứng dụng chưa trả lời chúng cho tử tế được — hồ kết nối mới khởi tạo một nửa, bộ đệm rỗng, cấu hình chưa đọc xong. <code>sleep 1</code> chuyển lưu lượng vào ĐÚNG trạng thái đó; các cú hỏng không biến mất, chúng chỉ đổi hình dạng từ lỗi từ chối kết nối thành 502, thứ khó quy trách nhiệm hơn. <code>sleep 10</code> thì đúng mà lãng phí: nó chạy được, và nó đánh thuế lên mọi lần deploy tương lai đúng bằng phần chênh giữa con số bạn đoán với sự thật. Vòng lặp dò là dạng DUY NHẤT tốn đúng thứ nó cần — phép đo cho thấy 1.556 ms, tức thời gian khởi động THẬT của ứng dụng — và nó tiếp tục chạy đúng mà không cần sửa khi một bản phát hành tương lai khởi động trong 300 mili giây hay trong 30 giây. Hai chi tiết làm cho vòng lặp ấy đủ chuẩn production: hãy CHẶN nó lại (<code>seq 1 60</code> cộng <code>sleep 0.1</code> là một cái trần 6 giây) để một bản không bao giờ lên được sẽ làm HỎNG lần deploy chứ không treo nó, và hãy cho cú hỏng ấy một mã thoát riêng để phía gọi phân biệt được "không lên được" với "kiểm khói hỏng". Phương án 4 bỏ sót rằng cú chuyển CHÍNH LÀ khoảnh khắc bản cũ ngừng nhận lưu lượng — sau nó thì một backend chưa sẵn sàng là backend DUY NHẤT.',
          ),
        }),

        /* ── Chương 4 — cấu hình và bí mật (5 câu) ────────────────────── */

        // q18 · đáp án 2
        mcq({
          prompt: B(
            'One seven-line <code>.env</code>, read by two loaders. Measured on bash 5.2.15 and Node v22.23.1:' +
            code('CO_DAU_THANG=mat#khau\n\n' +
                 '  shell "source"     : CO_DAU_THANG = [mat#khau]\n' +
                 '  node --env-file    : CO_DAU_THANG = [mat]') +
            'A password generated as 32 characters arrives at the database as 3. What makes this class of bug so expensive to diagnose?',
            'Một tệp <code>.env</code> bảy dòng, đọc bởi hai bộ phân tích. Đo trên bash 5.2.15 và Node v22.23.1:' +
            code('CO_DAU_THANG=mat#khau\n\n' +
                 '  shell "source"     : CO_DAU_THANG = [mat#khau]\n' +
                 '  node --env-file    : CO_DAU_THANG = [mat]') +
            'Một mật khẩu sinh ra dài 32 ký tự tới cơ sở dữ liệu chỉ còn 3. Cái gì làm cho lớp lỗi này đắt đỏ đến thế khi chẩn đoán?',
          ),
          options: [
            B(
              'That the two loaders disagree at all: any difference between parsers is a configuration bug by definition, so the fix is to standardise on one loader across development and production and the specific characters involved do not matter',
              'Chính chuyện hai bộ phân tích bất đồng: mọi khác biệt giữa các bộ phân tích tự nó đã là một lỗi cấu hình, nên cách chữa là chuẩn hoá về MỘT bộ phân tích cho cả phát triển lẫn production, còn cụ thể là ký tự nào thì không quan trọng',
            ),
            B(
              'That Node is wrong and the shell is right, so a deploy that loads the file through <code>node --env-file</code> is broken by construction and every project should load environment through the service manager instead',
              'Rằng Node sai còn shell đúng, nên một quy trình deploy nạp tệp qua <code>node --env-file</code> là hỏng ngay từ thiết kế và mọi dự án nên nạp môi trường thông qua trình quản lý dịch vụ thay vào đó',
            ),
            B(
              'That it produces a <em>wrong value</em> rather than an error: the application starts, connects and is rejected, so the investigation goes to the database, the user and the network — while the file on disk still looks exactly right',
              'Rằng nó cho ra một GIÁ TRỊ SAI chứ không phải một cú lỗi: ứng dụng khởi động, kết nối, rồi bị từ chối, nên cuộc điều tra đi về phía cơ sở dữ liệu, tài khoản và mạng — trong khi cái tệp trên đĩa nhìn vẫn đúng y nguyên',
            ),
            B(
              'That the truncation happens at write time rather than read time, so the shortened value is what was persisted and re-reading the file with a different loader can no longer recover the original characters',
              'Rằng cú cắt cụt xảy ra lúc GHI chứ không phải lúc ĐỌC, nên giá trị bị rút ngắn chính là thứ đã được lưu lại và đọc lại tệp bằng một bộ phân tích khác cũng không khôi phục nổi các ký tự gốc nữa',
            ),
          ],
          correct: 2,
          explanation: EX(
            'There is no standard for <code>.env</code> files; every loader invented its own rules. Node treats <code>#</code> as starting a comment even mid-value, so <code>mat#khau</code> becomes <code>mat</code>. The shell keeps it, because an unquoted <code>#</code> after a non-space character is not a comment in shell. Neither is "wrong" — they are two dialects, which is why option 2 misses the point. What makes it expensive is the failure mode: no error, no warning, just a perfectly valid-looking string that is not the one you set. The application starts fine and authentication fails, so the investigation goes everywhere except the file, which reads correctly to a human. Base64 output and random password generators emit <code>#</code> and <code>$</code> regularly, so this is not exotic — it is why "the password works when I paste it manually" is a sentence people recognise. Two habits close it. Quote every value, always, not just the ones that look risky. And verify against the process rather than the file: <code>tr \'\\0\' \'\\n\' &lt; /proc/&lt;pid&gt;/environ</code> is what the process actually received, and printing the <em>length</em> of a secret rather than its value answers "was it truncated?" without putting the password into your shell history.',
            'Không có tiêu chuẩn nào cho tệp <code>.env</code>; mỗi bộ nạp tự bịa ra luật của riêng nó. Node coi <code>#</code> là bắt đầu một chú thích ngay cả khi nó nằm giữa giá trị, nên <code>mat#khau</code> thành <code>mat</code>. Shell thì giữ nguyên, vì một dấu <code>#</code> không nằm trong nháy và đi ngay sau một ký tự khác khoảng trắng thì không phải chú thích trong shell. Không cái nào "sai" cả — chúng là hai phương ngữ, và đó là chỗ phương án 2 trượt. Thứ làm cho nó ĐẮT là kiểu hỏng: không lỗi, không cảnh báo, chỉ là một chuỗi trông hoàn toàn hợp lệ mà không phải cái bạn đã đặt. Ứng dụng khởi động ngon lành rồi xác thực thất bại, nên cuộc điều tra đi khắp nơi TRỪ cái tệp, vì tệp ấy đọc lên với mắt người thì đúng. Kết quả base64 và các bộ sinh mật khẩu ngẫu nhiên nhả ra <code>#</code> và <code>$</code> đều đều, nên đây không phải chuyện hiếm — đó là lý do câu "mật khẩu dán tay vào thì chạy" là một câu ai cũng thấy quen. Hai thói quen đóng nó lại. Hãy đặt nháy cho MỌI giá trị, luôn luôn, không chỉ những cái trông có vẻ nguy hiểm. Và hãy kiểm chứng ở phía TIẾN TRÌNH chứ không phải phía tệp: <code>tr \'\\0\' \'\\n\' &lt; /proc/&lt;pid&gt;/environ</code> mới là thứ tiến trình THẬT SỰ nhận được, còn in ra ĐỘ DÀI của một bí mật thay vì giá trị của nó thì trả lời được câu "có bị cắt cụt không?" mà không đẩy mật khẩu vào lịch sử shell của bạn.',
          ),
        }),

        // q19 · đáp án 3
        mcq({
          prompt: B(
            'The same file, two more lines, same two loaders:' +
            code('CO_DOLLAR=$HOME/duong-dan\nNOI_CHUOI=${DON_GIAN}-them\n\n' +
                 '  shell "source"  : CO_DOLLAR = [/root/duong-dan]   NOI_CHUOI = [abc-them]\n' +
                 '  node --env-file : CO_DOLLAR = [$HOME/duong-dan]   NOI_CHUOI = [${DON_GIAN}-them]') +
            'Which rule genuinely survives every loader?',
            'Cùng tệp đó, thêm hai dòng nữa, vẫn hai bộ phân tích ấy:' +
            code('CO_DOLLAR=$HOME/duong-dan\nNOI_CHUOI=${DON_GIAN}-them\n\n' +
                 '  shell "source"  : CO_DOLLAR = [/root/duong-dan]   NOI_CHUOI = [abc-them]\n' +
                 '  node --env-file : CO_DOLLAR = [$HOME/duong-dan]   NOI_CHUOI = [${DON_GIAN}-them]') +
            'Luật nào THẬT SỰ sống sót qua mọi bộ phân tích?',
          ),
          options: [
            B(
              'Wrap values containing <code>$</code> in double quotes, which stops the shell expanding them while remaining transparent to loaders that do not expand at all',
              'Hãy bọc những giá trị có chứa <code>$</code> trong nháy KÉP, việc đó chặn shell khai triển chúng trong khi vẫn trong suốt với các bộ nạp vốn không khai triển gì cả',
            ),
            B(
              'Prefer interpolation to repetition: writing <code>${DON_GIAN}-them</code> once is less error-prone than repeating a value, and any loader that does not expand it can be told to with a wrapper that pre-processes the file',
              'Hãy chuộng nội suy hơn lặp lại: viết <code>${DON_GIAN}-them</code> một lần thì ít sai hơn là lặp lại một giá trị, và bộ nạp nào không khai triển nó thì có thể bắt nó làm bằng một lớp bọc tiền xử lý tệp',
            ),
            B(
              'Keep secrets out of <code>.env</code> entirely and pass them as command-line arguments to the service, since arguments are not parsed by any dialect and are therefore immune to the whole class of problem',
              'Hãy giữ bí mật hoàn toàn ra ngoài <code>.env</code> và truyền chúng làm tham số dòng lệnh cho dịch vụ, vì tham số không bị phương ngữ nào phân tích và vì thế miễn nhiễm với cả lớp vấn đề này',
            ),
            B(
              'Quote every value, never rely on interpolation, no spaces around <code>=</code>, nothing multi-line — and accept that double quotes do <em>not</em> stop the shell expanding <code>$</code>, so a value that must contain a literal dollar sign should not travel in a file something might <code>source</code>',
              'Đặt nháy cho MỌI giá trị, đừng bao giờ dựa vào nội suy, không có dấu cách quanh <code>=</code>, không có gì nhiều dòng — và hãy chấp nhận rằng nháy KÉP KHÔNG chặn được shell khai triển <code>$</code>, nên một giá trị buộc phải chứa dấu đô-la nguyên văn thì đừng đi trong một tệp mà thứ gì đó có thể <code>source</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Under <code>source</code>, <code>$HOME/duong-dan</code> became <code>/root/duong-dan</code> and <code>${DON_GIAN}-them</code> became <code>abc-them</code>; under Node both stayed literal. A generated password containing <code>$</code> is therefore silently rewritten into something else — or into nothing, if the name after it is undefined — and a value composed from another works on your machine and not on the server, or the reverse. The four rules in the correct answer are the ones that make every dialect agree, and the fourth clause is the honest caveat that option 1 gets wrong: <b>double quotes do not stop shell expansion</b>. <code>"$HOME/x"</code> still becomes <code>/root/x</code> under <code>source</code> — that is what double quotes <em>mean</em> in shell. Only single quotes prevent it, and single quotes are handled differently again elsewhere. So if a value must carry a literal <code>$</code>, the honest answer is to stop putting it in a <code>.env</code>. This matters concretely because the same file often has three readers: systemd\'s <code>EnvironmentFile</code> in production (a fourth dialect, with no shell expansion at all), <code>node --env-file</code> in development, and a developer typing <code>source .env</code> by hand. Option 3 trades one problem for a worse one — command-line arguments are visible in <code>ps</code> to every user on the machine.',
            'Dưới <code>source</code>, <code>$HOME/duong-dan</code> thành <code>/root/duong-dan</code> và <code>${DON_GIAN}-them</code> thành <code>abc-them</code>; dưới Node thì cả hai giữ nguyên văn. Một mật khẩu sinh ra có chứa <code>$</code> vì thế bị âm thầm viết lại thành thứ khác — hoặc thành rỗng, nếu cái tên đứng sau nó chưa được định nghĩa — còn một giá trị ghép từ giá trị khác thì chạy trên máy bạn mà không chạy trên máy chủ, hoặc ngược lại. Bốn cái luật trong đáp án đúng là những luật làm cho mọi phương ngữ đồng ý với nhau, và mệnh đề thứ tư là lời nói thẳng mà phương án 1 hiểu sai: <b>nháy kép KHÔNG chặn được khai triển của shell</b>. <code>"$HOME/x"</code> dưới <code>source</code> vẫn thành <code>/root/x</code> — đó chính là Ý NGHĨA của nháy kép trong shell. Chỉ nháy ĐƠN mới chặn được, mà nháy đơn thì lại được xử lý theo kiểu khác ở chỗ khác. Nên nếu một giá trị buộc phải mang dấu <code>$</code> nguyên văn, câu trả lời thật thà là đừng đặt nó vào <code>.env</code> nữa. Điều này cụ thể quan trọng vì cùng một tệp thường có BA người đọc: <code>EnvironmentFile</code> của systemd trên production (một phương ngữ thứ tư, hoàn toàn không khai triển shell), <code>node --env-file</code> lúc phát triển, và một lập trình viên gõ tay <code>source .env</code>. Phương án 3 đổi một vấn đề lấy một vấn đề tệ hơn — tham số dòng lệnh thì mọi người dùng trên máy đều thấy được qua <code>ps</code>.',
          ),
        }),

        // q20 · đáp án 1
        mcq({
          prompt: B(
            'One source file holds two values. Measured with Node v22.23.1:' +
            code('const luc_chay = process.env.API_URL;      // doc luc CHAY\n' +
                 'const luc_dung = "__API_URL__";            // thay luc DUNG\n\n' +
                 '=== DUNG voi API_URL=https://api.cu.com ===   trong dist: https://api.cu.com\n' +
                 '=== doi env roi CHAY LAI (khong dung lai) ===\n' +
                 '  doc luc chay:   https://api.MOI.com\n' +
                 '  nuong luc dung: https://api.cu.com\n' +
                 '=== chi khi DUNG LAI ===\n' +
                 '  nuong luc dung: https://api.MOI.com') +
            'A colleague changes <code>NEXT_PUBLIC_API_URL</code> on the server and restarts the container. What happens, and why?',
            'Một tệp mã nguồn giữ hai giá trị. Đo trên Node v22.23.1:' +
            code('const luc_chay = process.env.API_URL;      // doc luc CHAY\n' +
                 'const luc_dung = "__API_URL__";            // thay luc DUNG\n\n' +
                 '=== DUNG voi API_URL=https://api.cu.com ===   trong dist: https://api.cu.com\n' +
                 '=== doi env roi CHAY LAI (khong dung lai) ===\n' +
                 '  doc luc chay:   https://api.MOI.com\n' +
                 '  nuong luc dung: https://api.cu.com\n' +
                 '=== chi khi DUNG LAI ===\n' +
                 '  nuong luc dung: https://api.MOI.com') +
            'Một đồng nghiệp đổi <code>NEXT_PUBLIC_API_URL</code> trên máy chủ rồi khởi động lại container. Chuyện gì xảy ra, và vì sao?',
          ),
          options: [
            B(
              'The new value takes effect on the next request, because the framework re-reads <code>NEXT_PUBLIC_*</code> variables on every server render and only caches them for the lifetime of a single request',
              'Giá trị mới có hiệu lực ngay ở request kế tiếp, vì framework đọc lại các biến <code>NEXT_PUBLIC_*</code> ở mỗi lần dựng phía máy chủ và chỉ nhớ đệm chúng trong vòng đời của một request',
            ),
            B(
              'Nothing whatsoever happens: the value is a string already written into a JavaScript file the browser downloads, so it is no longer reading an environment variable at all — changing it requires a rebuild and a redeploy, not a restart',
              'Chẳng có gì xảy ra hết: giá trị đó là một chuỗi ĐÃ được viết sẵn vào một tệp JavaScript mà trình duyệt tải về, nên nó không còn ĐỌC một biến môi trường nào nữa — đổi nó đòi hỏi DỰNG LẠI rồi deploy lại, chứ không phải khởi động lại',
            ),
            B(
              'The application fails to start, because the framework validates that every <code>NEXT_PUBLIC_*</code> variable matches the value baked into the bundle and refuses to serve a mismatched pair',
              'Ứng dụng không khởi động được, vì framework kiểm rằng mọi biến <code>NEXT_PUBLIC_*</code> phải khớp với giá trị đã nướng vào gói và từ chối phục vụ một cặp lệch nhau',
            ),
            B(
              'The value changes for server-rendered pages and stays stale for client-side navigation, so the site is briefly inconsistent until every visitor has reloaded and picked up the new bundle',
              'Giá trị đổi với các trang dựng phía máy chủ và giữ nguyên bản cũ với điều hướng phía client, nên trang web bất nhất trong một lúc cho tới khi mọi khách đã tải lại và nhận gói mới',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The measurement isolates the two moments in one file. The run-time read followed the new value after a plain restart, which is what everyone expects configuration to do. The build-time value did not, because there is no variable left to read — the string was substituted into the output during the build, weeks ago, and restarting re-reads the same file and gets the same string. Only rebuilding changed it. Anything a browser runs has this property by necessity: a front-end bundle is a static file downloaded by a browser, and there is no server-side environment for it to consult, so every framework inlines these values during the build — <code>NEXT_PUBLIC_*</code>, <code>VITE_*</code>, <code>REACT_APP_*</code>. Nothing warns you; you edit, restart, test, see the old value, and conclude the restart did not take. Two consequences worth carrying. These values are <em>public</em>, permanently — the naming convention says so out loud — so a third-party API key must never be one; put a small authenticated backend route in front of it and read the key from run-time environment on the server, which also turns key rotation into a restart instead of a rebuild. And a value baked at build time makes one artifact per environment, so the thing you tested in staging is literally not the thing you deployed.',
            'Phép đo tách bạch hai thời điểm ngay trong một tệp. Giá trị ĐỌC LÚC CHẠY đi theo giá trị mới sau một lần khởi động lại bình thường, đúng thứ ai cũng trông đợi ở cấu hình. Giá trị NƯỚNG LÚC DỰNG thì không, vì chẳng còn biến nào để mà đọc — chuỗi ấy đã được thay vào kết quả trong lúc dựng, từ nhiều tuần trước, và khởi động lại chỉ là đọc lại đúng tệp đó và nhận đúng chuỗi đó. Chỉ DỰNG LẠI mới đổi được nó. Mọi thứ chạy trong trình duyệt đều mang tính chất này một cách tất yếu: một gói front-end là một tệp tĩnh mà trình duyệt tải về, và không có môi trường phía máy chủ nào để nó tra cứu, nên mọi framework đều nhúng thẳng các giá trị này vào lúc dựng — <code>NEXT_PUBLIC_*</code>, <code>VITE_*</code>, <code>REACT_APP_*</code>. Không có gì cảnh báo bạn; bạn sửa, khởi động lại, thử, thấy giá trị cũ, rồi kết luận là "cú restart chưa ăn". Hai hệ quả đáng mang theo. Những giá trị này là CÔNG KHAI, vĩnh viễn — chính quy ước đặt tên đã nói to điều đó — nên một khoá API của bên thứ ba tuyệt đối không được là một trong số chúng; hãy đặt một tuyến backend nhỏ có xác thực đứng trước nó và đọc khoá từ môi trường LÚC CHẠY trên máy chủ, việc đó cũng biến chuyện xoay khoá thành một lần khởi động lại thay vì một lần dựng lại. Và một giá trị nướng lúc dựng sinh ra MỖI MÔI TRƯỜNG MỘT TẠO TÁC, nên thứ bạn đã kiểm thử ở staging, theo nghĩa đen, không phải thứ bạn đã deploy.',
          ),
        }),

        // q21 · đáp án 0
        mcq({
          prompt: B(
            'A CI token is passed to a build with <code>--build-arg</code>. Afterwards, on the resulting image:' +
            code('$ docker history --no-trunc argleak:v1 --format \'{{.CreatedBy}}\' | grep -i token\n' +
                 '  RUN |1 TOKEN_CI=sk_live_GIA_LAP /bin/sh -c echo "dung voi token" > /tmp/x\n' +
                 '  ARG TOKEN_CI=sk_live_GIA_LAP\n\n' +
                 '$ docker inspect argleak:v1 --format \'{{json .Config.Env}}\' | grep -c TOKEN_CI\n' +
                 '  0') +
            'What do these two results together establish?',
            'Một token của CI được truyền vào lần dựng bằng <code>--build-arg</code>. Sau đó, trên cái ảnh vừa tạo ra:' +
            code('$ docker history --no-trunc argleak:v1 --format \'{{.CreatedBy}}\' | grep -i token\n' +
                 '  RUN |1 TOKEN_CI=sk_live_GIA_LAP /bin/sh -c echo "dung voi token" > /tmp/x\n' +
                 '  ARG TOKEN_CI=sk_live_GIA_LAP\n\n' +
                 '$ docker inspect argleak:v1 --format \'{{json .Config.Env}}\' | grep -c TOKEN_CI\n' +
                 '  0') +
            'Hai kết quả này gộp lại xác lập điều gì?',
          ),
          options: [
            B(
              'That <code>ARG</code> keeps the value out of the container\'s environment but not out of the image\'s build history, so anyone who can pull the image can read the token — <code>--build-arg</code> is not a secret mechanism, and a build that genuinely needs a credential should use <code>RUN --mount=type=secret</code>',
              'Rằng <code>ARG</code> giữ được giá trị ra ngoài MÔI TRƯỜNG của container nhưng không giữ được nó ra ngoài LỊCH SỬ DỰNG của ảnh, nên ai kéo được ảnh về là đọc được token — <code>--build-arg</code> KHÔNG phải một cơ chế bí mật, và một lần dựng thật sự cần thông tin xác thực thì nên dùng <code>RUN --mount=type=secret</code>',
            ),
            B(
              'That the token was correctly scrubbed, because the check that matters is <code>Config.Env</code> and it returned zero; <code>docker history</code> shows the build instructions as written rather than the values they resolved to at build time',
              'Rằng token đã được tẩy đúng cách, vì phép kiểm đáng kể là <code>Config.Env</code> và nó trả về không; còn <code>docker history</code> chỉ hiện các chỉ thị dựng NHƯ ĐÃ VIẾT chứ không phải giá trị mà chúng phân giải ra lúc dựng',
            ),
            B(
              'That the leak exists only in the local build cache, since history entries are stored on the machine that ran the build and are stripped by the registry when the image is pushed',
              'Rằng vụ rò rỉ chỉ tồn tại trong bộ đệm dựng cục bộ, vì các mục lịch sử được lưu trên máy đã chạy lần dựng và bị registry lột bỏ khi ảnh được đẩy lên',
            ),
            B(
              'That the problem is the <code>RUN</code> line rather than the <code>ARG</code>: writing the token into <code>/tmp/x</code> is what persisted it, and removing that file in a later layer removes the token from the image entirely',
              'Rằng vấn đề là dòng <code>RUN</code> chứ không phải <code>ARG</code>: chính việc ghi token vào <code>/tmp/x</code> đã lưu nó lại, và xoá tệp đó ở một tầng sau sẽ gỡ token khỏi ảnh hoàn toàn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Both halves of the measurement are needed. <code>Config.Env</code> returning zero means an <code>ARG</code> really does not become a container environment variable — that part of the intuition is right, and it is why people reach for <code>--build-arg</code> when they want a value that "goes away". But <code>docker history</code> prints the argument verbatim, twice, with its resolved value. Image history travels with the image: push it to a registry and anyone who can pull can run <code>docker history</code> and read the credential. That is the whole point of option 3 being wrong — nothing strips it. Option 4 is the seductive one, because deleting the file feels like it should help; it does not, since layers are additive and the earlier layer still contains what the later one removed, and in any case the value is in the <em>instruction</em>, not only in the file. The correct tool is a build secret — <code>RUN --mount=type=secret,id=token …</code> — which exposes the value to that one command through a mount that is not committed to any layer. Worth pairing with the neighbouring rule: <code>ENV</code> in a Dockerfile is baked into the image and readable by anyone who pulls it, which is fine for <code>NODE_ENV=production</code> and wrong for anything secret; run-time <code>env_file</code> in Compose is where secrets belong.',
            'Cần cả HAI nửa của phép đo. <code>Config.Env</code> trả về không nghĩa là một <code>ARG</code> thật sự KHÔNG trở thành biến môi trường của container — phần trực giác đó là đúng, và đó là lý do người ta với tay tới <code>--build-arg</code> khi muốn một giá trị "biến mất sau đó". Nhưng <code>docker history</code> in ra tham số ấy nguyên văn, tận HAI lần, kèm giá trị đã phân giải. Lịch sử ảnh ĐI THEO ảnh: đẩy nó lên registry thì bất cứ ai kéo được về đều chạy được <code>docker history</code> và đọc thông tin xác thực. Đó chính là chỗ phương án 3 sai — không có gì lột bỏ nó cả. Phương án 4 là cái quyến rũ, vì xoá tệp đi cảm giác như phải có tác dụng; nó không có, vì các tầng ảnh là CỘNG DỒN và tầng trước vẫn chứa thứ mà tầng sau xoá đi, và đằng nào thì giá trị ấy cũng nằm trong chính CHỈ THỊ chứ không riêng gì trong tệp. Công cụ đúng là một build secret — <code>RUN --mount=type=secret,id=token …</code> — thứ phơi giá trị cho đúng một câu lệnh đó qua một mount không được ghi vào tầng nào. Đáng ghép với luật hàng xóm: <code>ENV</code> trong Dockerfile bị nướng vào ảnh và ai kéo ảnh về cũng đọc được, chuyện đó ổn với <code>NODE_ENV=production</code> và sai với bất cứ thứ gì bí mật; chỗ của bí mật là <code>env_file</code> lúc CHẠY trong Compose.',
          ),
        }),

        // q22 · đáp án 2
        mcq({
          prompt: B(
            'Someone commits <code>.env</code>, notices, deletes it and adds a <code>.gitignore</code> in the next commit. Measured on the resulting repository:' +
            code('  cay lam viec bay gio: .gitignore app.js\n' +
                 '$ git show <commit-dau>:.env\n' +
                 '    DATABASE_URL=postgres://app:GIA_LAP_123@db:5432/prod\n' +
                 '    STRIPE_KEY=sk_live_GIA_LAP\n' +
                 '$ git rev-list --all --objects | grep -c \'\\.env$\'\n' +
                 '  1') +
            'What is the correct first action, and why is history rewriting not it?',
            'Có người commit nhầm <code>.env</code>, phát hiện ra, xoá nó đi và thêm <code>.gitignore</code> ở commit kế tiếp. Đo trên chính cái kho ấy:' +
            code('  cay lam viec bay gio: .gitignore app.js\n' +
                 '$ git show <commit-dau>:.env\n' +
                 '    DATABASE_URL=postgres://app:GIA_LAP_123@db:5432/prod\n' +
                 '    STRIPE_KEY=sk_live_GIA_LAP\n' +
                 '$ git rev-list --all --objects | grep -c \'\\.env$\'\n' +
                 '  1') +
            'Hành động ĐẦU TIÊN đúng đắn là gì, và vì sao viết lại lịch sử không phải hành động đó?',
          ),
          options: [
            B(
              'Force-push a rewritten branch immediately, because the window between the leak and the rewrite is the whole exposure and every minute the blob stays reachable multiplies the number of clones that carry it',
              'Đẩy ép ngay một nhánh đã viết lại, vì khoảng giữa lúc rò rỉ và lúc viết lại chính là toàn bộ mức phơi nhiễm và mỗi phút cái blob còn với tới được là số bản sao mang nó lại nhân lên',
            ),
            B(
              'Add the path to <code>.gitignore</code> on every branch and delete the remote branch that introduced it, since a blob that no ref points at is garbage-collected and therefore unreachable within the default grace period',
              'Thêm đường dẫn đó vào <code>.gitignore</code> trên mọi nhánh rồi xoá nhánh từ xa đã đưa nó vào, vì một blob không còn ref nào trỏ tới sẽ bị thu gom rác và vì thế không với tới được nữa trong khoảng ân hạn mặc định',
            ),
            B(
              'Rotate the credential, then verify the old value is refused — a leaked credential stops being dangerous when it stops being valid, not when it stops being visible, and every clone, fork, CI cache and backup already has the blob that a rewrite cannot reach',
              'XOAY thông tin xác thực, rồi kiểm chứng rằng giá trị cũ đã bị TỪ CHỐI — một thông tin xác thực bị lộ chỉ hết nguy hiểm khi nó hết HIỆU LỰC, không phải khi nó hết HIỆN RA, và mọi bản sao, bản rẽ nhánh, cache của CI và bản sao lưu đều đã có sẵn cái blob mà một lần viết lại không với tới được',
            ),
            B(
              'Open an incident and preserve the repository unchanged for forensics, because rewriting or rotating destroys the evidence needed to determine whether the credential was used before it was noticed',
              'Mở một sự cố và giữ nguyên kho mã cho việc điều tra, vì viết lại hay xoay khoá sẽ phá huỷ bằng chứng cần thiết để xác định thông tin xác thực có bị dùng trước khi bị phát hiện hay không',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<code>git show &lt;commit&gt;:.env</code> printed the credentials in full, after the file had been deleted, in one command. Git does not remove history when you remove a file: the commit that added it still exists, still contains the blob, and is still reachable by anyone with a clone. The <code>.gitignore</code> stops it happening <em>again</em> and does nothing about what already happened. The reason rewriting cannot be the first move is arithmetic, not principle — every laptop that cloned, every CI runner cache, every fork and every repository backup already holds those bytes, and rewriting history on one server reaches none of them. If the repository was ever public, assume it was scraped: well-known prefixes are scanned continuously and the interval between pushing and first use is often measured in minutes. So: rotate, and then <em>test the old value and confirm it is rejected</em>, because some providers keep an old key alive for a grace period and a rotation you did not verify is a rotation you hope happened. Then check the provider\'s access log for the window between the commit and the rotation — that is the question users eventually ask, and "we don\'t know" is a much worse answer than "we checked". Rewriting with <code>git filter-repo</code> comes third, and it is worth doing so the next person does not find a credential and wonder whether it is live. Option 4 inverts the priority: rotating destroys no evidence, and the provider log is where the forensics actually live.',
            'Câu lệnh <code>git show &lt;commit&gt;:.env</code> in ra đầy đủ thông tin xác thực, SAU KHI tệp đã bị xoá, chỉ trong một dòng. Git không gỡ lịch sử khi bạn gỡ một tệp: cái commit đã thêm nó vẫn còn đó, vẫn chứa cái blob, và vẫn với tới được bởi bất cứ ai có một bản sao. Tệp <code>.gitignore</code> chặn chuyện đó XẢY RA LẦN NỮA và không làm được gì với thứ ĐÃ xảy ra. Lý do viết lại lịch sử không thể là nước đi đầu tiên là chuyện SỐ HỌC, không phải nguyên tắc — mọi cái laptop đã clone, mọi cache của máy chạy CI, mọi bản rẽ nhánh và mọi bản sao lưu kho mã đều đã giữ sẵn những byte đó, và viết lại lịch sử trên một máy chủ chẳng với tới cái nào trong số ấy. Nếu kho từng công khai, hãy giả định là nó đã bị quét: những tiền tố nổi tiếng bị rà liên tục và khoảng cách từ lúc đẩy lên tới lần dùng đầu tiên thường tính bằng phút. Nên: XOAY khoá, rồi <em>thử lại giá trị cũ và xác nhận nó bị từ chối</em>, vì có nhà cung cấp giữ khoá cũ sống thêm một khoảng ân hạn, và một cú xoay bạn chưa kiểm chứng là một cú xoay bạn HY VỌNG đã xảy ra. Sau đó soi nhật ký truy cập của nhà cung cấp cho khoảng thời gian từ commit tới lúc xoay — đó là câu hỏi mà rốt cuộc người dùng sẽ hỏi, và "chúng tôi không biết" là câu trả lời tệ hơn nhiều so với "chúng tôi đã kiểm". Viết lại bằng <code>git filter-repo</code> xếp thứ ba, và vẫn đáng làm để người sau không nhặt được một thông tin xác thực rồi băn khoăn không biết nó còn sống không. Phương án 4 đảo ngược thứ tự ưu tiên: xoay khoá chẳng phá huỷ bằng chứng nào, và nhật ký của nhà cung cấp mới là nơi việc điều tra thật sự diễn ra.',
          ),
        }),

        /* ── Chương 5 — cơ sở dữ liệu và migration (5 câu) ────────────── */

        // q23 · đáp án 3
        mcq({
          prompt: B(
            'A migration renames <code>email</code> to <code>dia_chi_email</code> and the new code is deployed with the zero-downtime swap from Chapter 3. Why does that swap make this <em>more</em> dangerous than the naive stop-then-start?',
            'Một migration đổi tên cột <code>email</code> thành <code>dia_chi_email</code> và mã mới được deploy bằng cú tráo không-gián-đoạn ở Chương 3. Vì sao cú tráo ấy làm chuyện này NGUY HIỂM HƠN so với kiểu dừng-rồi-chạy-lại ngây thơ?',
          ),
          options: [
            B(
              'It does not: both approaches run the migration at the same point in the script, so the schema is identical at every instant and the choice of swap strategy is orthogonal to the schema question entirely',
              'Không hề: cả hai cách đều chạy migration ở cùng một điểm trong script, nên lược đồ giống hệt nhau ở mọi thời điểm và việc chọn chiến lược tráo hoàn toàn không liên quan gì tới câu chuyện lược đồ',
            ),
            B(
              'Because a proxy reload takes longer than a process restart, so the window during which the old code is still serving is measured in seconds rather than milliseconds and the error count scales with it',
              'Vì một lần nạp lại proxy lâu hơn một lần khởi động lại tiến trình, nên cái cửa sổ mà mã cũ vẫn còn phục vụ được tính bằng giây thay vì mili giây và số lỗi tăng theo nó',
            ),
            B(
              'Because the new version connects to the database before the old one disconnects, so the connection pool briefly holds twice as many sessions and the rename has to wait for a lock that the old pool is holding',
              'Vì bản mới kết nối tới cơ sở dữ liệu trước khi bản cũ ngắt kết nối, nên hồ kết nối trong chốc lát giữ gấp đôi số phiên và cú đổi tên phải chờ một cái khoá mà hồ cũ đang giữ',
            ),
            B(
              'Because its entire technique is running both versions at once — which is exactly the condition under which the old code hits a column that no longer exists — and a rollback re-opens the same window by putting old code in front of a new schema',
              'Vì toàn bộ kỹ thuật của nó là chạy CẢ HAI phiên bản CÙNG LÚC — mà đó chính xác là điều kiện để mã cũ đâm vào một cột không còn tồn tại — và một cú lùi bản mở lại đúng cái cửa sổ ấy bằng cách đặt mã cũ trước một lược đồ mới',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The naive swap has an accidental protection nobody designed: the old process is already dead when the schema changes, so nothing queries the old shape. You pay for that with the outage measured in Chapter 3, but you do not get a schema mismatch. Blue-green deliberately overlaps the two versions, and the overlap is the whole mechanism — so a rename that is invisible to the new code is fatal to the old one, on every request that touches the table, for as long as both run. The second clause matters just as much: rolling the code back does not roll the schema back, so the previous release now faces a database it cannot read, and that arrives at the worst possible moment. The rule the rest of the chapter follows falls straight out of this: <b>every migration must leave the database in a state where the previous release still works</b> — not the current one, the previous one. When that is impossible in a single step it takes more than one deploy, which is normal rather than a planning failure. Note also that no ordering rescues an unsafe migration: before the swap it breaks the old code, after the swap it breaks the new code, during it breaks both in turn. Ordering only starts to matter once every individual step already satisfies both versions.',
            'Cú tráo ngây thơ có một lớp bảo vệ TÌNH CỜ mà chẳng ai thiết kế: tiến trình cũ đã chết sẵn khi lược đồ đổi, nên không còn ai truy vấn theo hình dạng cũ. Cái giá là sự gián đoạn đã đo ở Chương 3, nhưng bạn không dính lệch lược đồ. Xanh-lam thì CỐ Ý cho hai phiên bản chồng lấn, và chính sự chồng lấn ấy là toàn bộ cơ chế — nên một cú đổi tên vô hình với mã mới lại là chí mạng với mã cũ, ở mọi request chạm tới bảng đó, suốt chừng nào cả hai còn chạy. Mệnh đề thứ hai cũng quan trọng ngang thế: lùi MÃ không lùi LƯỢC ĐỒ, nên bản phát hành trước giờ đối diện một cơ sở dữ liệu mà nó không đọc nổi, và chuyện đó ập tới đúng lúc tệ nhất. Cái luật mà phần còn lại của chương tuân theo rơi thẳng ra từ đây: <b>mọi migration phải để lại cơ sở dữ liệu ở một trạng thái mà bản phát hành TRƯỚC vẫn chạy được</b> — không phải bản hiện tại, mà bản trước. Khi điều đó không làm được trong một bước thì nó cần nhiều hơn một lần deploy, và đó là chuyện bình thường chứ không phải một thất bại về kế hoạch. Cũng nên để ý rằng không có thứ tự nào cứu nổi một migration không an toàn: đặt trước bước tráo thì vỡ mã cũ, đặt sau thì vỡ mã mới, đặt vào giữa thì vỡ lần lượt cả hai. Thứ tự chỉ bắt đầu có ý nghĩa khi từng bước một đã thoả mãn được cả hai phiên bản.',
          ),
        }),

        // q24 · đáp án 1
        mcq({
          prompt: B(
            'Three <code>ALTER TABLE</code> statements on the same 400,000-row / 139 MB table. Measured on PostgreSQL 16.14:' +
            code('ALTER TABLE lon ADD COLUMN c1 text;                            Time:    1.349 ms\n' +
                 'ALTER TABLE lon ADD COLUMN c2 text DEFAULT \'mac-dinh\';         Time:    0.828 ms\n' +
                 'ALTER TABLE lon ADD COLUMN c3 uuid DEFAULT gen_random_uuid();  Time:  994.106 ms') +
            'Why is the third one roughly a thousand times slower than the second?',
            'Ba câu <code>ALTER TABLE</code> trên cùng một bảng 400.000 dòng / 139 MB. Đo trên PostgreSQL 16.14:' +
            code('ALTER TABLE lon ADD COLUMN c1 text;                            Time:    1.349 ms\n' +
                 'ALTER TABLE lon ADD COLUMN c2 text DEFAULT \'mac-dinh\';         Time:    0.828 ms\n' +
                 'ALTER TABLE lon ADD COLUMN c3 uuid DEFAULT gen_random_uuid();  Time:  994.106 ms') +
            'Vì sao câu thứ ba chậm hơn câu thứ hai cỡ một nghìn lần?',
          ),
          options: [
            B(
              'Because <code>uuid</code> is a wider type than <code>text</code> and widening a row forces PostgreSQL to re-pack every page; adding the column as <code>text</code> and casting it afterwards keeps the operation metadata-only',
              'Vì <code>uuid</code> là kiểu rộng hơn <code>text</code> và việc nới rộng một dòng buộc PostgreSQL đóng gói lại mọi trang; thêm cột dưới dạng <code>text</code> rồi ép kiểu sau sẽ giữ cho thao tác chỉ đụng siêu dữ liệu',
            ),
            B(
              'Because a <em>volatile</em> default has to produce a different value for every row, so every row is rewritten — while a constant default is recorded in the catalogue once and applied on read, which is why table size is irrelevant to the first two',
              'Vì một giá trị mặc định BIẾN THIÊN phải sinh ra một giá trị khác nhau cho MỖI dòng, nên mọi dòng đều bị ghi lại — còn một mặc định HẰNG thì chỉ được ghi vào danh mục một lần rồi áp lúc ĐỌC, và đó là lý do kích thước bảng không liên quan gì tới hai câu đầu',
            ),
            B(
              'Because <code>gen_random_uuid()</code> lives in an extension, so the first call has to load <code>pgcrypto</code> into the backend; the cost is a one-off initialisation and a second identical statement would measure in microseconds',
              'Vì <code>gen_random_uuid()</code> nằm trong một extension, nên lời gọi đầu tiên phải nạp <code>pgcrypto</code> vào tiến trình nền; chi phí đó là một lần khởi tạo duy nhất và một câu lệnh y hệt lần thứ hai sẽ đo được ở mức micro giây',
            ),
            B(
              'Because the third statement was the only one that had to wait for a lock, since the first two had already been granted <code>ACCESS EXCLUSIVE</code> and released it, and lock acquisition dominates the measurement at this table size',
              'Vì câu thứ ba là câu duy nhất phải CHỜ khoá, do hai câu đầu đã được cấp <code>ACCESS EXCLUSIVE</code> rồi nhả ra, và việc giành khoá chi phối phép đo ở cỡ bảng này',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Since PostgreSQL 11, <code>ADD COLUMN … DEFAULT &lt;constant&gt;</code> stores the default in the catalogue and materialises it when a row is read, so no row is touched and the table can be any size — 0.828 ms on 139 MB proves it. <code>gen_random_uuid()</code> is volatile: each row needs its own value, so each row must actually be written, and the cost becomes a function of your data. Multiply by twenty-five for a ten-million-row table and that is a minute of the table being unavailable. The two statements look almost identical in a diff, which is what makes this worth memorising rather than deriving under pressure. Two related facts complete the picture. Advice written before 2018 says never to add a column with a default because it rewrites the table — that was true then and is false now for a <em>constant</em> default, so check your version rather than following a rule whose reason expired. And every one of these takes an <code>ACCESS EXCLUSIVE</code> lock, which conflicts with everything including <code>SELECT</code>; the fast ones hold it briefly, the slow one holds it for the whole rewrite. That is why <code>SET lock_timeout</code> belongs at the top of a migration file — without it, an <code>ALTER</code> that cannot get its lock waits indefinitely while blocking every query queued behind it.',
            'Từ PostgreSQL 11, <code>ADD COLUMN … DEFAULT &lt;hằng&gt;</code> lưu giá trị mặc định vào DANH MỤC rồi hiện thực hoá nó khi dòng được ĐỌC, nên không dòng nào bị đụng tới và bảng to bao nhiêu cũng được — 0,828 ms trên 139 MB chứng minh điều đó. <code>gen_random_uuid()</code> là hàm biến thiên: mỗi dòng cần một giá trị riêng, nên mỗi dòng phải thật sự được ghi, và chi phí trở thành một hàm của lượng dữ liệu bạn có. Nhân hai mươi lăm lần cho một bảng mười triệu dòng thì đó là một phút cái bảng không dùng được. Hai câu lệnh nhìn trong một cái diff thì gần như y hệt nhau, và chính điều đó khiến chuyện này đáng THUỘC LÒNG thay vì suy ra lúc đang căng thẳng. Hai sự thật liên quan hoàn tất bức tranh. Những lời khuyên viết trước 2018 bảo đừng bao giờ thêm cột có mặc định vì nó ghi lại cả bảng — hồi đó đúng, bây giờ SAI với một mặc định HẰNG, nên hãy kiểm phiên bản của mình thay vì theo một cái luật mà lý do của nó đã hết hạn. Và mỗi câu trong số đó đều lấy khoá <code>ACCESS EXCLUSIVE</code>, thứ xung đột với MỌI THỨ kể cả <code>SELECT</code>; hai câu nhanh giữ nó trong chớp mắt, câu chậm giữ nó suốt cả lượt ghi lại. Đó là lý do <code>SET lock_timeout</code> thuộc về dòng đầu của một tệp migration — không có nó, một câu <code>ALTER</code> không giành được khoá sẽ chờ vô hạn TRONG KHI chặn mọi truy vấn xếp hàng phía sau.',
          ),
        }),

        // q25 · đáp án 0
        mcq({
          prompt: B(
            'A three-statement migration whose third statement fails on data that already exists, applied with <code>psql</code> and no transaction:' +
            code('  CREATE TABLE\n  INSERT 0 3\n' +
                 '  ERROR:  could not create unique index "uq_ma"\n' +
                 '  DETAIL:  Key (ma)=(A) is duplicated.\n' +
                 '  (ma thoat that): 0\n\n' +
                 '  bang don_hang ton tai: 1\n  so dong da chen: 3\n' +
                 '  rang buoc unique: 0\n  so sach ghi: m001 xong=false\n\n' +
                 '  --- chay LAI migration ---\n  ERROR:  relation "don_hang" already exists') +
            'The obvious recovery is to run it again. Why is that the wrong instinct here?',
            'Một migration ba câu lệnh mà câu thứ ba hỏng trên dữ liệu đã có sẵn, áp bằng <code>psql</code> và không bọc giao dịch:' +
            code('  CREATE TABLE\n  INSERT 0 3\n' +
                 '  ERROR:  could not create unique index "uq_ma"\n' +
                 '  DETAIL:  Key (ma)=(A) is duplicated.\n' +
                 '  (ma thoat that): 0\n\n' +
                 '  bang don_hang ton tai: 1\n  so dong da chen: 3\n' +
                 '  rang buoc unique: 0\n  so sach ghi: m001 xong=false\n\n' +
                 '  --- chay LAI migration ---\n  ERROR:  relation "don_hang" already exists') +
            'Cách khôi phục hiển nhiên là chạy lại nó. Vì sao đó là trực giác SAI ở đây?',
          ),
          options: [
            B(
              'Because two of three statements already applied, so the database is in a shape no version of the schema ever intended; the re-run fails at statement one on a <em>different</em> error, which sends the investigation somewhere unhelpful, and the ledger says neither applied nor rolled back so every later deploy is blocked too',
              'Vì hai trên ba câu lệnh ĐÃ áp rồi, nên cơ sở dữ liệu đang ở một hình dạng mà không phiên bản lược đồ nào từng dự định; lượt chạy lại hỏng ngay câu ĐẦU với một lỗi KHÁC, thứ đẩy cuộc điều tra đi sai hướng, còn cuốn sổ thì ghi là chưa-áp-cũng-chưa-lùi nên mọi lần deploy sau cũng bị chặn theo',
            ),
            B(
              'Because <code>psql</code> exited 0, which means the migration is recorded as successful and re-running it would double-apply the two statements that did work, inserting the three rows a second time',
              'Vì <code>psql</code> thoát ra 0, nghĩa là migration được ghi nhận là thành công và chạy lại sẽ áp hai lần hai câu lệnh vốn đã chạy được, chèn ba dòng đó thêm một lần nữa',
            ),
            B(
              'Because the unique constraint was created but left in an <code>INVALID</code> state, so re-running tries to build it again on top of the broken index and PostgreSQL refuses until the invalid index is dropped concurrently',
              'Vì ràng buộc duy nhất đã được tạo nhưng để lại ở trạng thái <code>INVALID</code>, nên chạy lại sẽ thử dựng nó lần nữa đè lên chỉ mục hỏng và PostgreSQL từ chối cho tới khi chỉ mục hỏng bị bỏ đi theo kiểu concurrently',
            ),
            B(
              'Because the duplicate <code>A</code> was inserted by the migration itself, so re-running is guaranteed to reproduce the same failure; deleting the three rows and running it once more is the complete and safe recovery',
              'Vì giá trị <code>A</code> trùng lặp do chính migration chèn vào, nên chạy lại chắc chắn tái hiện đúng cú hỏng ấy; xoá ba dòng đó rồi chạy lại một lần nữa là cách khôi phục trọn vẹn và an toàn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Read the four state lines. The table exists, three rows are in it, the constraint does not exist, and the ledger records the migration as started and not finished. No version of your schema was ever supposed to look like that. Most migration tools treat <code>xong=false</code> as a hard stop: they will not run the next migration and they will not re-run this one, because they cannot know how much of it happened — so an unrelated urgent fix cannot ship either, which is what turns a schema problem into an outage. And the re-run fails on <code>relation "don_hang" already exists</code>, a different error from the original, which is exactly how an investigation ends up looking at the wrong statement. The recovery is a decision, not a command: read the migration statement by statement and check each one against the live schema, decide whether to finish it by hand or undo it by hand, and only then mark the ledger with <code>migrate resolve --applied</code> or <code>--rolled-back</code>. The instruction never to auto-resolve is an instruction against running that command <em>before</em> you know which of the two is true. Finish with a drift check — <code>prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "$DATABASE_URL" --script</code> — because a ledger that says "applied" over a schema missing a constraint deploys cleanly today and fails in three weeks when a later migration assumes the constraint exists.',
            'Hãy đọc bốn dòng trạng thái. Bảng TỒN TẠI, ba dòng đã nằm trong đó, ràng buộc KHÔNG có, và cuốn sổ ghi migration là đã bắt đầu và chưa xong. Không phiên bản lược đồ nào của bạn từng được cho là trông như thế. Phần lớn công cụ migration coi <code>xong=false</code> là một cú dừng cứng: chúng sẽ không chạy migration kế tiếp và cũng không chạy lại cái này, vì chúng không thể biết nó đã xảy ra tới đâu — nên một bản vá khẩn cấp chẳng liên quan gì cũng không ship được, và đó chính là thứ biến một vấn đề lược đồ thành một sự cố. Còn lượt chạy lại thì hỏng ở <code>relation "don_hang" already exists</code>, một lỗi KHÁC với lỗi ban đầu, và đó đúng là cách một cuộc điều tra rốt cuộc đi soi nhầm câu lệnh. Việc khôi phục là một QUYẾT ĐỊNH, không phải một câu lệnh: đọc migration theo từng câu lệnh và đối chiếu từng cái với lược đồ đang sống, quyết xem nên làm nốt bằng tay hay gỡ bỏ bằng tay, và chỉ tới lúc đó mới đánh dấu cuốn sổ bằng <code>migrate resolve --applied</code> hay <code>--rolled-back</code>. Cái chỉ dẫn "đừng bao giờ tự động giải quyết" là chỉ dẫn chống lại việc chạy câu lệnh ấy TRƯỚC KHI bạn biết cái nào trong hai điều đó là thật. Kết thúc bằng một phép kiểm trôi dạt — <code>prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "$DATABASE_URL" --script</code> — vì một cuốn sổ ghi "đã áp" đè lên một lược đồ thiếu ràng buộc thì hôm nay deploy sạch sẽ và ba tuần nữa mới vỡ, khi một migration sau đó giả định ràng buộc kia có tồn tại.',
          ),
        }),

        // q26 · đáp án 2
        mcq({
          prompt: B(
            'The identical migration, wrapped in <code>BEGIN</code>/<code>COMMIT</code>, plus two statements tried the same way:' +
            code('  BEGIN / CREATE TABLE / INSERT 0 3\n' +
                 '  ERROR:  could not create unique index "uq_ma"\n' +
                 '  ROLLBACK\n' +
                 '  bang don_hang ton tai: 0\n\n' +
                 '  ERROR:  CREATE INDEX CONCURRENTLY cannot run inside a transaction block\n' +
                 '  ERROR:  CREATE DATABASE cannot run inside a transaction block') +
            'What does this pair of results tell you about how to write migration files?',
            'Đúng migration đó, bọc trong <code>BEGIN</code>/<code>COMMIT</code>, cộng thêm hai câu lệnh thử theo cùng cách:' +
            code('  BEGIN / CREATE TABLE / INSERT 0 3\n' +
                 '  ERROR:  could not create unique index "uq_ma"\n' +
                 '  ROLLBACK\n' +
                 '  bang don_hang ton tai: 0\n\n' +
                 '  ERROR:  CREATE INDEX CONCURRENTLY cannot run inside a transaction block\n' +
                 '  ERROR:  CREATE DATABASE cannot run inside a transaction block') +
            'Cặp kết quả này nói gì với bạn về cách viết tệp migration?',
          ),
          options: [
            B(
              'That transactional DDL is unreliable in PostgreSQL and should not be depended on, since two of the statements a migration commonly needs cannot participate; the portable answer is to make every statement idempotent instead of wrapping anything',
              'Rằng DDL trong giao dịch là thứ không đáng tin ở PostgreSQL và không nên dựa vào, vì hai trong số các câu lệnh mà một migration thường cần lại không tham gia được; câu trả lời khả chuyển là làm cho mọi câu lệnh trở nên idempotent thay vì bọc thứ gì cả',
            ),
            B(
              'That the rollback only worked because the failure came from an index build, which PostgreSQL performs in memory before committing anything; a failure inside <code>INSERT</code> would have left the inserted rows behind exactly as in the untransacted run',
              'Rằng cú lùi chỉ chạy được vì cú hỏng đến từ việc dựng chỉ mục, thứ mà PostgreSQL thực hiện trong bộ nhớ trước khi commit bất cứ gì; một cú hỏng bên trong <code>INSERT</code> hẳn đã để lại các dòng đã chèn y như lượt chạy không giao dịch',
            ),
            B(
              'That wrapping is the default protection — the same failure left no trace at all and the file can be corrected and re-run at once — but the two statements that refuse a transaction must each live alone in their own file, made idempotent by hand',
              'Rằng BỌC GIAO DỊCH là lớp bảo vệ mặc định — đúng cú hỏng đó không để lại dấu vết nào và tệp có thể sửa rồi chạy lại ngay — nhưng hai câu lệnh từ chối giao dịch thì mỗi cái phải nằm MỘT MÌNH trong tệp riêng của nó, và được làm cho idempotent bằng tay',
            ),
            B(
              'That the migration tool should be configured to wrap each statement in its own transaction rather than the file, which keeps the two exceptional statements working while still rolling back any individual failure',
              'Rằng nên cấu hình công cụ migration để bọc TỪNG CÂU LỆNH trong giao dịch riêng của nó thay vì bọc cả tệp, cách đó giữ cho hai câu lệnh ngoại lệ vẫn chạy được mà vẫn lùi lại được bất kỳ cú hỏng đơn lẻ nào',
            ),
          ],
          correct: 2,
          explanation: EX(
            'PostgreSQL supports transactional DDL, which is a genuine advantage over databases where most DDL commits implicitly: <code>CREATE TABLE</code> and <code>ALTER TABLE</code> roll back like any other statement, so the identical failure that left a half-built table in the untransacted run left <em>nothing</em> here. Correct the data, re-run, done. That is why wrapping is the default protection rather than an optimisation. The second half is the sharp edge, and it bites precisely where you least want it: <code>CREATE INDEX CONCURRENTLY</code> — the very statement recommended for avoiding write locks on a busy table — is the one that cannot be made atomic, and neither can <code>CREATE DATABASE</code>. So each of those goes in its own file, alone, and that file must be idempotent by hand: <code>CREATE INDEX CONCURRENTLY IF NOT EXISTS</code>, plus a check for the <code>INVALID</code> index a failed concurrent build leaves behind (<code>select indexrelid::regclass from pg_index where not indisvalid</code>) — an invalid index is not used by the planner and still occupies space. Option 4 sounds reasonable and defeats the purpose: per-statement transactions reproduce exactly the half-applied state the wrapping was there to prevent. The other rules that fall out: one logical change per file, and check the data before adding a constraint — the failure here was a duplicate <code>A</code> that already existed, and a constraint migration should never be the thing that discovers your data is inconsistent.',
            'PostgreSQL hỗ trợ DDL trong giao dịch, và đó là một lợi thế thật so với những cơ sở dữ liệu mà phần lớn DDL tự động commit: <code>CREATE TABLE</code> và <code>ALTER TABLE</code> lùi lại được như mọi câu lệnh khác, nên đúng cú hỏng đã để lại một cái bảng dựng dở ở lượt không giao dịch thì ở đây KHÔNG để lại gì. Sửa dữ liệu, chạy lại, xong. Đó là lý do bọc giao dịch là lớp bảo vệ MẶC ĐỊNH chứ không phải một phép tối ưu. Nửa sau mới là chỗ sắc, và nó cắn đúng vào nơi bạn ít muốn nhất: <code>CREATE INDEX CONCURRENTLY</code> — chính câu lệnh được khuyên dùng để tránh khoá ghi trên một bảng bận — lại là câu KHÔNG thể làm cho nguyên tử, và <code>CREATE DATABASE</code> cũng vậy. Nên mỗi cái đó nằm trong tệp riêng của nó, một mình, và tệp ấy phải được làm cho idempotent bằng tay: <code>CREATE INDEX CONCURRENTLY IF NOT EXISTS</code>, cộng một phép kiểm cái chỉ mục <code>INVALID</code> mà một lượt dựng concurrently thất bại để lại (<code>select indexrelid::regclass from pg_index where not indisvalid</code>) — một chỉ mục invalid thì bộ lập kế hoạch không dùng mà vẫn chiếm chỗ. Phương án 4 nghe hợp lý và phá hỏng đúng mục đích: giao dịch theo từng câu lệnh tái tạo chính xác cái trạng thái nửa-vời mà việc bọc sinh ra để ngăn. Những luật khác rơi ra theo: mỗi tệp một thay đổi logic, và hãy kiểm DỮ LIỆU trước khi thêm ràng buộc — cú hỏng ở đây là một giá trị <code>A</code> trùng vốn đã tồn tại, và một migration thêm ràng buộc không bao giờ nên là thứ PHÁT HIỆN ra dữ liệu của bạn không nhất quán.',
          ),
        }),

        // q27 · đáp án 3
        mcq({
          prompt: B(
            'Phase 2 of an expand-and-contract rename has to copy several hundred thousand rows from the old column to the new one. A deploy script contains this line, and the deploy times out:' +
            code('UPDATE bai_viet SET tom_tat = left(tieu_de, 297) || \'...\';') +
            'What is wrong, and what replaces it?',
            'Giai đoạn 2 của một cú đổi tên kiểu mở-rộng-rồi-thu-hẹp phải chép vài trăm nghìn dòng từ cột cũ sang cột mới. Một script deploy chứa dòng này, và lần deploy hết giờ:' +
            code('UPDATE bai_viet SET tom_tat = left(tieu_de, 297) || \'...\';') +
            'Sai ở đâu, và cái gì thay thế nó?',
          ),
          options: [
            B(
              'The concatenation is the problem: building a string per row is what makes the statement slow, and precomputing the values into a temporary table before the update turns it back into a fast bulk copy',
              'Phép nối chuỗi mới là vấn đề: dựng một chuỗi cho mỗi dòng chính là thứ làm câu lệnh chậm, và tính trước các giá trị vào một bảng tạm rồi mới cập nhật sẽ biến nó lại thành một lượt chép hàng loạt nhanh chóng',
            ),
            B(
              'It needs a <code>WHERE tom_tat IS NULL</code> so the statement is idempotent; with that added it is safe to leave in the deploy script, because a re-run then touches only the rows that were missed',
              'Nó cần một mệnh đề <code>WHERE tom_tat IS NULL</code> để câu lệnh trở nên idempotent; thêm cái đó vào thì để nguyên nó trong script deploy là an toàn, vì lượt chạy lại khi ấy chỉ đụng tới những dòng bị bỏ sót',
            ),
            B(
              'Nothing is wrong with the statement; the timeout is a symptom of a missing index on <code>tieu_de</code>, and once that index exists the update completes inside the deploy window without further changes',
              'Câu lệnh chẳng có gì sai; cú hết giờ là triệu chứng của việc thiếu chỉ mục trên <code>tieu_de</code>, và một khi chỉ mục đó tồn tại thì lệnh cập nhật hoàn tất trong khung thời gian deploy mà không cần đổi gì thêm',
            ),
            B(
              'A single statement holds row locks and an open transaction for its whole duration and blocks <code>VACUUM</code> everywhere, so it belongs outside the deploy: batch it a few thousand rows at a time with <code>FOR UPDATE SKIP LOCKED</code>, run it as its own resumable job, and let the new code tolerate both the filled and unfilled shape until it finishes',
              'Một câu lệnh đơn giữ khoá dòng và một giao dịch mở suốt cả thời gian nó chạy, đồng thời chặn <code>VACUUM</code> ở khắp nơi, nên chỗ của nó là NGOÀI lần deploy: hãy chia lô vài nghìn dòng một lượt kèm <code>FOR UPDATE SKIP LOCKED</code>, chạy nó như một tác vụ riêng có thể tiếp tục được, và để mã mới chịu được cả hình dạng đã lấp lẫn chưa lấp cho tới khi nó xong',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Total time is what you pay; longest lock is what your users feel, and those are different numbers. One statement over the whole table holds row locks and an open transaction for its entire duration — and an open transaction prevents <code>VACUUM</code> from cleaning up <em>anywhere</em> in the database, so a long backfill degrades tables it never mentions. It also rewrites a row version per update, which grows the table until vacuum can reclaim the dead tuples, which it cannot while the transaction is open. Batching costs more wall-clock and holds each lock for a fraction of a second, with the database completely free between batches; a batch can be paused, and it is naturally resumable because it selects rows that are still null. <code>FOR UPDATE SKIP LOCKED</code> is what makes it safe alongside live traffic: without it, a batch that meets a row locked by a user\'s transaction waits behind ordinary traffic and the backfill stalls. The structural point is the last clause: a thirty-minute backfill inside a deploy script is a thirty-minute deploy holding the deploy lock, the health check times out, the orchestrator kills the deploy halfway, and you now have a partially backfilled table and a half-swapped release — with the log blaming the health check. Ship the schema change in the deploy, run the backfill afterwards as its own job. Option 2 is half right and dangerous: <code>WHERE tom_tat IS NULL</code> genuinely makes it resumable, and leaving it in the deploy is exactly the mistake being described.',
            'Tổng thời gian là thứ bạn TRẢ; cái khoá dài nhất mới là thứ người dùng CẢM THẤY, và đó là hai con số khác nhau. Một câu lệnh chạy trên cả bảng giữ khoá dòng và một giao dịch mở suốt cả thời gian nó chạy — mà một giao dịch mở thì ngăn <code>VACUUM</code> dọn dẹp ở KHẮP NƠI trong cơ sở dữ liệu, nên một lượt lấp dữ liệu dài làm suy giảm cả những bảng nó chẳng hề nhắc tới. Nó cũng ghi ra một phiên bản dòng mới cho mỗi lần cập nhật, làm bảng phình ra cho tới khi vacuum thu hồi được các tuple chết, mà vacuum thì không làm được chừng nào giao dịch còn mở. Chia lô thì tốn thêm thời gian đồng hồ và giữ mỗi cái khoá trong một phần nhỏ của giây, giữa các lô thì cơ sở dữ liệu hoàn toàn rảnh; một lượt chia lô có thể TẠM DỪNG, và nó tự nhiên TIẾP TỤC ĐƯỢC vì nó chọn đúng những dòng còn null. <code>FOR UPDATE SKIP LOCKED</code> là thứ làm nó an toàn khi chạy cạnh lưu lượng thật: không có nó, một lô gặp phải dòng đang bị giao dịch của người dùng khoá sẽ xếp hàng sau lưu lượng thường và cả lượt lấp đứng lại. Điểm mang tính cấu trúc nằm ở mệnh đề cuối: một lượt lấp ba mươi phút nằm trong script deploy là một lần deploy ba mươi phút đang giữ cái khoá deploy, chốt kiểm sức khoẻ hết giờ, bộ điều phối giết lần deploy giữa chừng, và bạn có một cái bảng lấp dở cộng một bản phát hành tráo dở — trong khi nhật ký thì đổ lỗi cho chốt kiểm sức khoẻ. Hãy gửi thay đổi lược đồ trong lần deploy, còn lượt lấp dữ liệu thì chạy sau như một tác vụ riêng. Phương án 2 đúng một nửa và nguy hiểm: <code>WHERE tom_tat IS NULL</code> thật sự làm nó tiếp tục được, còn việc GIỮ NÓ trong lần deploy đúng là cái sai lầm đang được mô tả.',
          ),
        }),

        /* ── Chương 6 — lùi bản (5 câu) ───────────────────────────────── */

        // q28 · đáp án 1
        mcq({
          prompt: B(
            'Version 2 shipped a migration renaming <code>ten</code> to <code>ho_ten</code>, plus the code that reads the new name. Twenty minutes later v2 turns out to have an unrelated bug, so the code is rolled back and the database is deliberately left alone. Measured afterwards:' +
            code('  /health = 200   ← chot kiem suc khoe noi: XANH\n' +
                 '  /don    = 500   than: ERROR:  column "ten" does not exist\n' +
                 '                        LINE 1: select ten from don order by id limit 1;\n' +
                 '  /tao    = 500   than: ERROR:  column "ten" of relation "don" does not exist\n' +
                 '                        LINE 1: insert into don(ten, so_tien) values (\'x\',1) …\n\n' +
                 '  --- va sau khi LUI CA LUOC DO (alter table … rename column ho_ten to ten) ---\n' +
                 '  /don    = 200   than: khach 1') +
            'Why can a health check not see this, and is making it deeper the fix?',
            'Bản 2 đã gửi kèm một migration đổi tên <code>ten</code> thành <code>ho_ten</code>, cộng đoạn mã đọc theo tên mới. Hai mươi phút sau v2 hoá ra có một lỗi chẳng liên quan, nên mã được lùi lại còn cơ sở dữ liệu thì cố ý để nguyên. Đo sau đó:' +
            code('  /health = 200   ← chot kiem suc khoe noi: XANH\n' +
                 '  /don    = 500   than: ERROR:  column "ten" does not exist\n' +
                 '                        LINE 1: select ten from don order by id limit 1;\n' +
                 '  /tao    = 500   than: ERROR:  column "ten" of relation "don" does not exist\n' +
                 '                        LINE 1: insert into don(ten, so_tien) values (\'x\',1) …\n\n' +
                 '  --- va sau khi LUI CA LUOC DO (alter table … rename column ho_ten to ten) ---\n' +
                 '  /don    = 200   than: khach 1') +
            'Vì sao một chốt kiểm sức khoẻ không thấy được chuyện này, và làm cho nó SÂU hơn có phải cách chữa không?',
          ),
          options: [
            B(
              'It can see it if configured correctly: the endpoint should return the schema version alongside its status, so a mismatch between that number and the release identifier fails the check automatically',
              'Nó thấy được nếu cấu hình đúng: endpoint nên trả về phiên bản lược đồ kèm theo trạng thái, để một cú lệch giữa con số đó với mã định danh bản phát hành làm phép kiểm tự động hỏng',
            ),
            B(
              'It answers before touching anything — deliberately, so a five-second database blip does not get the process killed and turned into a restart loop — so a shallow check cannot see a schema mismatch; making it run <code>SELECT 1</code> still misses this, because <code>SELECT 1</code> succeeds perfectly against a schema your code cannot read',
              'Nó trả lời TRƯỚC khi chạm vào bất cứ thứ gì — có chủ đích, để một cú nấc năm giây của cơ sở dữ liệu không làm tiến trình bị giết rồi biến thành một vòng lặp khởi động lại — nên một phép kiểm NÔNG không thấy được lệch lược đồ; bắt nó chạy <code>SELECT 1</code> thì vẫn trượt, vì <code>SELECT 1</code> chạy ngon lành trên một lược đồ mà mã của bạn không đọc nổi',
            ),
            B(
              'The health check was cached by the proxy from before the rollback, which is why it still reports the previous state; purging the cache would have made it return 500 alongside the other two routes',
              'Chốt kiểm sức khoẻ bị proxy đệm lại từ trước cú lùi, và đó là lý do nó vẫn báo trạng thái cũ; dọn bộ đệm đi thì nó đã trả 500 cùng với hai tuyến kia',
            ),
            B(
              'Because the rollback restored the pointer but not the process, so <code>/health</code> is being answered by the new version while the other routes are handled by the old one, and a restart resolves the disagreement',
              'Vì cú lùi khôi phục con trỏ mà không khôi phục tiến trình, nên <code>/health</code> đang được bản MỚI trả lời trong khi hai tuyến kia do bản CŨ xử lý, và một lần khởi động lại sẽ giải quyết sự bất đồng đó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A liveness endpoint is kept shallow on purpose. If it talks to the database, a five-second database hiccup reports the application as unhealthy, the supervisor kills it, and a brief blip becomes a restart loop — so the standard shape answers from memory and touches nothing. That design decision is exactly why it cannot detect a schema mismatch, and it is not a misconfiguration. The tempting fix does not work either: <code>SELECT 1</code> catches "the database is unreachable" and succeeds perfectly against a schema your code cannot read. To catch <em>this</em> you would need the check to exercise a real query on a real table — at which point it is no longer a health check, it is a smoke test, and it belongs in the deploy script rather than on an endpoint a load balancer polls every two seconds. The real remedy is upstream, in Chapter 5: had v2 shipped the expand phase — add <code>ho_ten</code>, keep <code>ten</code>, keep both in sync with a <code>BEFORE</code> trigger — rolling the code back would have been a non-event, because <code>ten</code> would still be there and still correct. The contract phase that actually drops the old column ships days later, when nobody is going to roll back that far.',
            'Một endpoint kiểm sự sống được giữ NÔNG một cách có chủ đích. Nếu nó nói chuyện với cơ sở dữ liệu, thì một cú nấc năm giây của cơ sở dữ liệu sẽ báo ứng dụng là không khoẻ, trình giám sát giết nó đi, và một cú nấc ngắn biến thành một vòng lặp khởi động lại — nên dạng chuẩn của nó trả lời từ bộ nhớ và không chạm vào gì cả. Chính quyết định thiết kế đó là lý do nó KHÔNG phát hiện được lệch lược đồ, và đây không phải một lỗi cấu hình. Cách chữa hấp dẫn cũng không ăn: <code>SELECT 1</code> bắt được "cơ sở dữ liệu không với tới được" và chạy trót lọt trên một lược đồ mà mã của bạn không đọc nổi. Muốn bắt được CHUYỆN NÀY thì phép kiểm phải chạy một truy vấn THẬT trên một bảng THẬT — mà tới lúc đó nó không còn là chốt kiểm sức khoẻ nữa, nó là một BỘ KIỂM KHÓI, và chỗ của nó là trong script deploy chứ không phải trên một endpoint mà bộ cân bằng tải dò hai giây một lần. Thuốc chữa thật nằm ở phía trước, tại Chương 5: giá như v2 gửi giai đoạn MỞ RỘNG — thêm <code>ho_ten</code>, GIỮ <code>ten</code>, đồng bộ cả hai bằng một trigger <code>BEFORE</code> — thì lùi mã lại đã là chuyện không có gì, vì <code>ten</code> vẫn còn đó và vẫn đúng. Giai đoạn thu hẹp, cái thật sự bỏ cột cũ đi, thì ship vài ngày sau, lúc chẳng ai còn định lùi xa tới thế.',
          ),
        }),

        // q29 · đáp án 0
        mcq({
          prompt: B(
            'A team keeps the ten most recent releases on disk, each a complete unpacked directory. How many releases can they actually roll back to?',
            'Một nhóm giữ mười bản phát hành gần nhất trên đĩa, mỗi bản là một thư mục hoàn chỉnh đã giải nén. Họ THẬT SỰ lùi về được bao nhiêu bản?',
          ),
          options: [
            B(
              'As far back as the oldest release that still works against <em>today\'s</em> schema — which is set by the gap between the expand and contract phases, not by disk retention; rename a column in place and the answer is zero, and the ten directories are decoration',
              'Xa tới đúng bản CŨ NHẤT còn chạy được với lược đồ của NGÀY HÔM NAY — con số đó do khoảng cách giữa giai đoạn mở rộng và giai đoạn thu hẹp quyết định, không phải do luật giữ bản trên đĩa; đổi tên một cột tại chỗ thì đáp số là KHÔNG, và mười cái thư mục kia là đồ trang trí',
            ),
            B(
              'Ten, by construction: each directory is a complete release that can be pointed at and started, and the schema is a separate axis that is rolled back with its own down-migrations when needed',
              'Mười, theo đúng cấu tạo: mỗi thư mục là một bản phát hành hoàn chỉnh có thể trỏ vào rồi khởi động, còn lược đồ là một trục riêng và được lùi bằng các migration đi xuống của chính nó khi cần',
            ),
            B(
              'One, because only the immediately previous release has been running against the current schema and every older one predates at least one migration by definition',
              'Một, vì chỉ bản ngay trước đó mới từng chạy với lược đồ hiện tại còn mọi bản cũ hơn thì theo định nghĩa đều có trước ít nhất một migration',
            ),
            B(
              'It depends on the disk: hard-linked releases share unchanged files, so the practical limit is how many distinct <code>node_modules</code> trees fit, and pruning by free space rather than by count is what sets the number',
              'Tuỳ vào đĩa: các bản phát hành liên kết cứng dùng chung các tệp không đổi, nên giới hạn thực tế là bao nhiêu cây <code>node_modules</code> khác biệt còn nhét vừa, và việc dọn theo chỗ trống thay vì theo số lượng mới là thứ ấn định con số đó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Disk retention sets how many releases you <em>have</em>; the schema sets how many you can <em>use</em>. A release older than the last destructive migration cannot run against the database you have now, whatever is sitting in the directory. So the real quantity — call it rollback distance — is the gap you leave between the expand phase and the contract phase: if you add the new column, keep the old one, deploy code that reads the new one, and only drop the old column a week later, then rollback distance is roughly a week. If you rename in place, it is zero the moment the migration commits, and the ten directories on disk are decoration you are paying for. Option 2 is the standard mistake, and its second half is where it goes wrong: down-migrations are not a general answer, because most schema changes are not reversible in the way the word suggests — a rename is, dropping a column is not, splitting a table is a data migration of its own. The useful part is that rollback distance is <em>testable before you need it</em>, and cheaply: start release N-1 against the current database and hit a real endpoint. That is the whole test, it takes one curl, and doing it once tells you the number you would otherwise be guessing at two in the morning.',
            'Luật giữ bản trên đĩa quyết định bạn CÓ bao nhiêu bản; lược đồ quyết định bạn DÙNG được bao nhiêu. Một bản phát hành cũ hơn cái migration phá huỷ gần nhất thì không chạy nổi với cơ sở dữ liệu bạn đang có, bất kể thư mục kia còn nằm đó hay không. Nên đại lượng thật — cứ gọi là TẦM LÙI — chính là cái khoảng bạn chừa ra giữa giai đoạn mở rộng và giai đoạn thu hẹp: nếu bạn thêm cột mới, giữ cột cũ, deploy mã đọc cột mới, rồi một tuần sau mới bỏ cột cũ, thì tầm lùi vào khoảng một tuần. Còn nếu bạn đổi tên tại chỗ, thì nó bằng KHÔNG ngay khoảnh khắc migration commit, và mười cái thư mục trên đĩa là món trang trí mà bạn đang trả tiền. Phương án 2 là sai lầm phổ biến, và chỗ nó trượt là nửa sau: migration đi xuống KHÔNG phải một câu trả lời tổng quát, vì phần lớn thay đổi lược đồ không lùi được theo cái nghĩa mà từ ấy gợi ra — đổi tên thì lùi được, bỏ một cột thì không, tách một bảng thì bản thân nó là một cuộc di trú dữ liệu. Phần hữu ích là tầm lùi KIỂM ĐƯỢC TRƯỚC KHI CẦN, và kiểm rất rẻ: khởi động bản phát hành N-1 với cơ sở dữ liệu hiện tại rồi gọi một endpoint thật. Đó là toàn bộ phép kiểm, nó tốn đúng một lệnh curl, và làm một lần là bạn biết được con số mà nếu không thì bạn sẽ phải đoán lúc hai giờ sáng.',
          ),
        }),

        // q30 · đáp án 2
        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14, on a 200,000-row table:' +
            code('  truoc:                                   20 MB\n' +
                 '  ALTER TABLE kh DROP COLUMN dien_thoai;   Time: 1.110 ms\n' +
                 '  sau_drop:                                20 MB\n\n' +
                 '            attname            | attnum | attisdropped\n' +
                 '  ---------------------------+--------+--------------\n' +
                 '   email                      |      2 | f\n' +
                 '   ........pg.dropped.3....... |      3 | t\n\n' +
                 '  ALTER TABLE kh ADD COLUMN dien_thoai text;   Time: 0.355 ms\n' +
                 '    tong  | con_du_lieu\n' +
                 '  --------+-------------\n' +
                 '   200000 |           0\n\n' +
                 '  vacuum full kh;   Time: 126.025 ms   → 19 MB') +
            'What is the right lesson to draw from the sub-millisecond timing?',
            'Đo trên PostgreSQL 16.14, trên một bảng 200.000 dòng:' +
            code('  truoc:                                   20 MB\n' +
                 '  ALTER TABLE kh DROP COLUMN dien_thoai;   Time: 1.110 ms\n' +
                 '  sau_drop:                                20 MB\n\n' +
                 '            attname            | attnum | attisdropped\n' +
                 '  ---------------------------+--------+--------------\n' +
                 '   email                      |      2 | f\n' +
                 '   ........pg.dropped.3....... |      3 | t\n\n' +
                 '  ALTER TABLE kh ADD COLUMN dien_thoai text;   Time: 0.355 ms\n' +
                 '    tong  | con_du_lieu\n' +
                 '  --------+-------------\n' +
                 '   200000 |           0\n\n' +
                 '  vacuum full kh;   Time: 126.025 ms   → 19 MB') +
            'Bài học ĐÚNG rút ra từ con số dưới một mili giây là gì?',
          ),
          options: [
            B(
              'That <code>DROP COLUMN</code> is cheap enough to run inside any deploy window, so the operation can be treated like an <code>ADD COLUMN</code> and scheduled with the release that stops using the column',
              'Rằng <code>DROP COLUMN</code> đủ rẻ để chạy trong bất kỳ khung deploy nào, nên có thể coi thao tác đó ngang với <code>ADD COLUMN</code> và xếp lịch nó cùng với bản phát hành ngừng dùng cột ấy',
            ),
            B(
              'That the data survives in the heap, so a dropped column is recoverable with <code>pageinspect</code> and the operation is effectively reversible on any table that has not been vacuumed since',
              'Rằng dữ liệu sống sót trong heap, nên một cột đã bỏ vẫn lấy lại được bằng <code>pageinspect</code> và thao tác đó trên thực tế là lùi được với bất kỳ bảng nào chưa bị vacuum kể từ lúc ấy',
            ),
            B(
              'That duration says nothing about damage: this is a catalogue edit — the column is marked dropped and hidden from SQL, the table does not shrink, and re-adding the same name produces a different column with no data — so a migration finishing instantly is no evidence it did little',
              'Rằng thời gian chẳng nói lên gì về mức thiệt hại: đây là một lần sửa DANH MỤC — cột bị đánh dấu đã bỏ và bị giấu khỏi SQL, bảng KHÔNG co lại, và thêm lại cùng cái tên thì ra một cột KHÁC không có dữ liệu — nên một migration xong tức thì hoàn toàn không phải bằng chứng rằng nó làm được ít',
            ),
            B(
              'That the table should be vacuumed immediately after every <code>DROP COLUMN</code>, because the drop from 20 MB to 19 MB shows the reclaimed space is real and most of a table is dead space and reclaiming it is what makes subsequent queries fast',
              'Rằng nên vacuum bảng ngay sau mỗi lần <code>DROP COLUMN</code>, vì mức giảm từ 20 MB xuống 19 MB cho thấy chỗ thu hồi được là có thật và phần lớn một cái bảng là chỗ chết và thu hồi nó chính là thứ làm các truy vấn sau đó nhanh lên',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Under a millisecond to make 200,000 phone numbers unreachable. Compare it with the harmless <code>ADD COLUMN … DEFAULT gen_random_uuid()</code> from the previous chapter, which took 994 ms on a 400,000-row table: the safe operation was nearly nine hundred times slower than the destructive one. There is no relationship between how long a migration takes and how much damage it does, and if your instinct is "it finished instantly so it cannot have done much", this is the measurement that should kill that instinct. The mechanism is a catalogue edit: <code>attisdropped = t</code> and the name replaced by a placeholder, so SQL stops showing the column while the old values stay in every row on disk — which is why the table is still 20 MB. Re-adding a column with the same name creates a <em>different</em> column (a new <code>attnum</code>) with 0 of 200,000 rows populated. Option 2 is the trap the leftover bytes invite: everything visible in the raw heap is diagnostic, not a recovery path — there is no supported way to read a dropped column back through SQL, the layout is undocumented as an interface, TOASTed values live in another table entirely, and any autovacuum-triggered rewrite erases them without warning. If you dropped a column you needed, the recovery is a restore from backup. The rule that follows: never drop a column in the same release that stops writing to it — stop writing, ship, wait out your rollback distance, and drop later.',
            'Chưa tới một mili giây để làm 200.000 số điện thoại trở nên không với tới được. Đem so với câu <code>ADD COLUMN … DEFAULT gen_random_uuid()</code> vô hại ở chương trước, thứ tốn 994 ms trên một bảng 400.000 dòng: thao tác AN TOÀN chậm hơn thao tác PHÁ HUỶ gần chín trăm lần. Không có mối liên hệ nào giữa việc một migration chạy mất bao lâu với mức thiệt hại nó gây ra, và nếu trực giác của bạn là "nó xong tức thì nên chắc chẳng làm gì nhiều", thì đây đúng là phép đo cần giết chết cái trực giác ấy. Cơ chế là một lần sửa danh mục: <code>attisdropped = t</code> và cái tên bị thay bằng một chỗ giữ, nên SQL thôi hiện cột đó ra trong khi các giá trị cũ vẫn nằm trong mọi dòng trên đĩa — và đó là lý do bảng vẫn 20 MB. Thêm lại một cột cùng tên thì tạo ra một cột KHÁC (một <code>attnum</code> mới) với 0 trên 200.000 dòng có dữ liệu. Phương án 2 là cái bẫy mà đám byte sót lại mời gọi: mọi thứ nhìn thấy trong heap thô đều là CHẨN ĐOÁN, không phải một đường phục hồi — không có cách nào được hỗ trợ để đọc ngược một cột đã bỏ qua SQL, bố cục đó không được ghi tài liệu như một giao diện, các giá trị TOAST nằm hẳn ở bảng khác, và bất kỳ lượt ghi lại nào do autovacuum kích hoạt cũng xoá chúng đi không báo trước. Nếu bạn lỡ bỏ một cột mà bạn cần, đường phục hồi là khôi phục từ bản sao lưu. Cái luật theo sau: đừng bao giờ bỏ một cột trong cùng bản phát hành ngừng ghi vào nó — hãy ngừng ghi, ship, chờ hết tầm lùi của bạn, rồi mới bỏ.',
          ),
        }),

        // q31 · đáp án 3
        mcq({
          prompt: B(
            'A bad version was live for a measured 18,180 ms and wrote 506 poisoned rows into a table two endpoints share. The rollback was fast and correct, and afterwards:' +
            code('=== ban HONG len song. Do luu luong THAT ===\n' +
                 '  cua so: 18180 ms\n' +
                 '  dong_hong | dong_dung | tong\n' +
                 ' -----------+-----------+------\n' +
                 '        506 |      1006 | 1512\n\n' +
                 '=== LUI: giet ban hong, dua ban dung len ===\n' +
                 '   so_tien  | count\n' +
                 ' -----------+-------\n' +
                 '     100000 |  1036\n' +
                 '  100000000 |   506') +
            'Cleaning up by time window over that span touched 1,011 rows to fix 506 — 505 of them written by the endpoint that was never broken. What is the cheap prevention?',
            'Một bản hỏng sống trên mạng đúng 18.180 mili giây đo được và đã ghi 506 dòng nhiễm độc vào một cái bảng mà hai endpoint dùng chung. Cú lùi bản thì nhanh và đúng, và sau đó:' +
            code('=== ban HONG len song. Do luu luong THAT ===\n' +
                 '  cua so: 18180 ms\n' +
                 '  dong_hong | dong_dung | tong\n' +
                 ' -----------+-----------+------\n' +
                 '        506 |      1006 | 1512\n\n' +
                 '=== LUI: giet ban hong, dua ban dung len ===\n' +
                 '   so_tien  | count\n' +
                 ' -----------+-------\n' +
                 '     100000 |  1036\n' +
                 '  100000000 |   506') +
            'Dọn theo cửa sổ thời gian trên khoảng đó đụng tới 1.011 dòng để sửa 506 — trong đó 505 dòng do chính cái endpoint chưa từng hỏng ghi ra. Cách phòng RẺ TIỀN là gì?',
          ),
          options: [
            B(
              'Narrow the time window using the exact deploy and rollback timestamps from the deploy log, which reduces the collateral to the rows written in the same milliseconds and is accurate enough in practice',
              'Thu hẹp cửa sổ thời gian bằng chính các dấu thời gian deploy và lùi bản lấy từ nhật ký deploy, việc đó giảm thiệt hại phụ xuống còn những dòng ghi trong cùng vài mili giây và trên thực tế là đủ chính xác',
            ),
            B(
              'Take a backup immediately before every deploy, so the pre-deploy state of any affected table can be restored selectively without having to identify individual rows at all',
              'Sao lưu ngay trước mỗi lần deploy, để trạng thái trước-deploy của bất kỳ bảng nào bị ảnh hưởng đều khôi phục lại được có chọn lọc mà chẳng cần nhận diện từng dòng',
            ),
            B(
              'Wrap every write path in a transaction that is only committed after the smoke test passes, so a failed deploy leaves no rows behind and the cleanup question never arises',
              'Bọc mọi đường ghi trong một giao dịch chỉ được commit sau khi bộ kiểm khói đạt, để một lần deploy hỏng không để lại dòng nào và câu hỏi dọn dẹp không bao giờ phát sinh',
            ),
            B(
              'A column on every row recording which release wrote it, so the cleanup targets exactly the writes of the bad version — the build already stamps the release identifier into the artifact, and carrying it into writes costs a few bytes per row',
              'Một cột trên mỗi dòng ghi lại BẢN PHÁT HÀNH nào đã ghi nó, để cú dọn nhắm chính xác vào các lệnh ghi của bản hỏng — lần dựng vốn đã đóng dấu mã bản phát hành vào tạo tác, và mang nó vào các lệnh ghi chỉ tốn vài byte mỗi dòng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A rollback changes which code runs. It has no opinion about rows, and all 506 stayed exactly where the bad version left them — while new writes came back correct, which is what the good count rising from 1,006 to 1,036 shows. So the number that decides how bad your day is is not "how fast can I roll back": it is <em>how long the bad version was live</em> multiplied by <em>how many writes per second it served</em>. Here that is 18.18 s × ~27.8/s = 506 rows on a load small enough that it never troubled the machine; a service doing 50 writes a second that goes bad at 09:00 and is noticed at 09:35 has written 105,000. Identifying them is the hard part. By <em>value</em> works only when the bug leaves a signature you can write in SQL, which real bugs rarely do. By <em>time window</em> is always available and always imprecise: on a table two endpoints share, the measurement caught 505 innocent rows to fix 506 — half of everything it touched, and whatever the cleanup does — delete, recalculate, flag for review — it does to those 505 too. A release-stamp column turns "everything in this window" into "everything written by v3", which is exactly the set you want and nothing else. Option 3 is impossible in general: a request commits when it commits, and holding transactions open across a smoke test would hold locks across the whole deploy. Option 2 is worth doing anyway and does not solve this, because restoring the table would also discard every legitimate write made since.',
            'Một cú lùi bản đổi việc MÃ NÀO CHẠY. Nó không có ý kiến gì về các DÒNG, và cả 506 dòng nằm nguyên chỗ bản hỏng để lại — trong khi các lệnh ghi MỚI thì trở lại đúng, và con số dòng ĐÚNG tăng từ 1.006 lên 1.036 cho thấy điều đó. Nên con số quyết định ngày hôm nay của bạn tệ tới đâu không phải là "tôi lùi nhanh cỡ nào": nó là <em>bản hỏng đã sống bao lâu</em> nhân với <em>nó phục vụ bao nhiêu lệnh ghi mỗi giây</em>. Ở đây là 18,18 giây × khoảng 27,8 = 506 dòng, trên một mức tải nhỏ tới nỗi chẳng làm phiền cái máy; một dịch vụ chạy 50 lệnh ghi mỗi giây mà hỏng lúc 09:00 và bị phát hiện lúc 09:35 thì đã ghi 105.000 dòng. Nhận diện chúng mới là phần khó. Nhận theo GIÁ TRỊ chỉ chạy khi con bọ để lại một chữ ký viết ra được bằng SQL, mà bọ thật thì hiếm khi tử tế thế. Nhận theo CỬA SỔ THỜI GIAN thì lúc nào cũng sẵn và lúc nào cũng thiếu chính xác: trên một bảng hai endpoint dùng chung, phép đo tóm 505 dòng vô tội để sửa 506 — tức một nửa mọi thứ nó đụng vào, và cú dọn làm gì với chúng — xoá, tính lại, đánh dấu để xem lại — thì nó cũng làm đúng thế với 505 dòng kia. Một cột đóng dấu bản phát hành biến "mọi thứ trong cửa sổ này" thành "mọi thứ do v3 ghi", đúng cái tập bạn muốn và không gì khác. Phương án 3 nói chung là bất khả: một request commit khi nó commit, còn giữ giao dịch mở xuyên qua một bộ kiểm khói thì sẽ giữ khoá xuyên suốt cả lần deploy. Phương án 2 vẫn đáng làm nhưng không giải quyết chuyện này, vì khôi phục cái bảng cũng sẽ vứt đi mọi lệnh ghi HỢP LỆ đã thực hiện từ lúc ấy.',
          ),
        }),

        // q32 · đáp án 1
        mcq({
          prompt: B(
            'A rollback runs correctly and the application confirms it. Then the front door is asked, through an nginx cache with <code>proxy_cache_valid 200 5m</code>:' +
            code('  cua SAU (thang app): v2\n' +
                 '=== cua TRUOC (qua bo dem) — nguoi dung thay gi? ===\n' +
                 '  x-ban: v1 X-Cache: HIT\n  x-ban: v1 X-Cache: HIT\n  x-ban: v1 X-Cache: HIT\n\n' +
                 '=== don bo dem roi nap lai nginx ===  mat 405 ms\n' +
                 '  cua truoc: x-ban: v2 X-Cache: MISS') +
            'What must a rollback script check so that this cannot be reported as success?',
            'Một cú lùi bản chạy đúng và ứng dụng xác nhận điều đó. Rồi người ta hỏi qua CỬA TRƯỚC, đi qua một bộ đệm nginx có <code>proxy_cache_valid 200 5m</code>:' +
            code('  cua SAU (thang app): v2\n' +
                 '=== cua TRUOC (qua bo dem) — nguoi dung thay gi? ===\n' +
                 '  x-ban: v1 X-Cache: HIT\n  x-ban: v1 X-Cache: HIT\n  x-ban: v1 X-Cache: HIT\n\n' +
                 '=== don bo dem roi nap lai nginx ===  mat 405 ms\n' +
                 '  cua truoc: x-ban: v2 X-Cache: MISS') +
            'Một script lùi bản phải kiểm cái gì để chuyện này không thể bị báo là THÀNH CÔNG?',
          ),
          options: [
            B(
              'That the health endpoint returns 200 twice, several seconds apart, so a response cached from before the rollback has expired between the two samples and the second reading reflects the new state',
              'Rằng endpoint sức khoẻ trả 200 HAI lần, cách nhau vài giây, để một response đã đệm từ trước cú lùi hết hạn giữa hai lần lấy mẫu và lần đọc thứ hai phản ánh trạng thái mới',
            ),
            B(
              'A final check made through the address users actually use, comparing the <em>version served</em> rather than the status code — and its failure has to carry its own exit code, so a forgotten cache purge fails the rollback instead of being invisible',
              'Một phép kiểm CUỐI đi qua đúng địa chỉ mà người dùng dùng, so PHIÊN BẢN ĐƯỢC PHỤC VỤ chứ không so mã trạng thái — và cú hỏng của nó phải mang mã thoát riêng, để một bước dọn bộ đệm bị quên làm HỎNG cú lùi thay vì trở nên vô hình',
            ),
            B(
              'That the release symlink and the running process agree, since the discrepancy here is between the pointer and the process and comparing the two is cheaper than an HTTP request',
              'Rằng symlink bản phát hành và tiến trình đang chạy phải khớp nhau, vì cú lệch ở đây là giữa con trỏ với tiến trình và so hai cái đó rẻ hơn một request HTTP',
            ),
            B(
              'That the proxy has been restarted rather than reloaded, because a reload keeps old worker processes alive and those workers hold their own copy of the cache index for the lifetime of the connection',
              'Rằng proxy phải được KHỞI ĐỘNG LẠI chứ không phải nạp lại, vì một lần nạp lại giữ các tiến trình worker cũ còn sống và những worker ấy giữ bản sao riêng của chỉ mục bộ đệm suốt vòng đời kết nối',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Everything the rollback script normally checks was true: the pointer moved, the process restarted, the application answered — and it answered <code>v2</code> when asked directly. Every user got <code>v1</code> for the next five minutes, which is the specific kind of bad that costs the most time, because the dashboard says the incident is over and you have stopped looking. The check that catches it has two properties, and both matter. It goes through the <em>user-facing address</em>, so it traverses the same cache the user does — a check against <code>127.0.0.1:&lt;app port&gt;</code> structurally cannot see this. And it compares the <em>version</em>, not the status: every response here was a perfectly healthy 200. When the same script was run with the purge step commented out, that final check exited 3 and printed both halves of the discrepancy — the app is serving v1, the users see v2 — which is the difference between a script that reports what it did and one that reports what happened. Two caveats worth carrying. The purge here was <code>rm -rf</code> on the cache directory plus a reload, crude but 405 ms, because open-source nginx has no purge command. And the cache in front of you may not be yours: a CDN needs its own purge API call, and an HTML page you served with <code>Cache-Control: max-age=3600</code> is in browsers no command on earth can reach — which is the argument for <code>no-store</code> on documents and long caching only on content-hashed assets.',
            'Mọi thứ mà một script lùi bản thường kiểm đều ĐÚNG: con trỏ đã dời, tiến trình đã khởi động lại, ứng dụng đã trả lời — và nó trả lời <code>v2</code> khi được hỏi thẳng. Mọi người dùng nhận <code>v1</code> suốt năm phút sau đó, và đó là kiểu tệ tốn nhiều thời gian nhất, vì bảng điều khiển nói sự cố đã xong và bạn thì đã thôi nhìn. Phép kiểm bắt được nó có hai tính chất, và cả hai đều quan trọng. Nó đi qua ĐỊA CHỈ HƯỚNG NGƯỜI DÙNG, nên nó băng qua đúng cái bộ đệm mà người dùng băng qua — một phép kiểm vào <code>127.0.0.1:&lt;cổng ứng dụng&gt;</code> thì về mặt cấu trúc là không thể thấy được chuyện này. Và nó so PHIÊN BẢN, không so trạng thái: mọi response ở đây đều là những cú 200 khoẻ mạnh hoàn hảo. Khi chạy chính cái script đó với bước dọn bộ đệm bị chú thích đi, phép kiểm cuối ấy thoát ra 3 và in ra CẢ HAI nửa của cú lệch — ứng dụng đang phục vụ v1, người dùng thấy v2 — và đó là khác biệt giữa một script báo cáo thứ nó ĐÃ LÀM với một script báo cáo thứ ĐÃ XẢY RA. Hai lời dặn đáng mang theo. Cú dọn ở đây là <code>rm -rf</code> lên thư mục bộ đệm cộng một lần nạp lại, thô thiển nhưng mất 405 ms, vì nginx bản mã nguồn mở không có lệnh purge. Và cái bộ đệm đứng trước bạn có thể không phải của bạn: một CDN cần lời gọi API purge của riêng nó, còn một trang HTML bạn đã phục vụ kèm <code>Cache-Control: max-age=3600</code> thì đang nằm trong trình duyệt mà không câu lệnh nào trên đời với tới — và đó là lập luận cho <code>no-store</code> trên các tài liệu và chỉ cache dài với những tài nguyên có băm nội dung trong tên.',
          ),
        }),

        /* ── Chương 7 — script deploy (5 câu) ─────────────────────────── */

        // q33 · đáp án 0
        mcq({
          prompt: B(
            'The same failing command written five ways, all under <code>set -euo pipefail</code>. Measured on bash 5.2.15:' +
            code('x=$(lenh-hong) o cap tren                         → ma 2\n' +
                 'local x=$(lenh-hong) trong ham                    → ma 0   QUA\n' +
                 'local x; x=$(lenh-hong) trong ham                 → ma 2\n' +
                 'y=$(lenh-hong; echo hi)  KHONG inherit_errexit    → ma 0   QUA\n' +
                 'y=$(lenh-hong; echo hi)  CO inherit_errexit       → ma 2') +
            'Why does the second line exit 0 in every configuration, including with <code>inherit_errexit</code>?',
            'Cùng một lệnh hỏng viết theo năm cách, tất cả đều dưới <code>set -euo pipefail</code>. Đo trên bash 5.2.15:' +
            code('x=$(lenh-hong) o cap tren                         → ma 2\n' +
                 'local x=$(lenh-hong) trong ham                    → ma 0   QUA\n' +
                 'local x; x=$(lenh-hong) trong ham                 → ma 2\n' +
                 'y=$(lenh-hong; echo hi)  KHONG inherit_errexit    → ma 0   QUA\n' +
                 'y=$(lenh-hong; echo hi)  CO inherit_errexit       → ma 2') +
            'Vì sao dòng thứ hai thoát ra 0 ở MỌI cấu hình, kể cả khi có <code>inherit_errexit</code>?',
          ),
          options: [
            B(
              '<code>local</code> is itself a command, and its own exit status — success, it declared a variable — overwrites the substitution\'s; there is no flag for this, and splitting into <code>local x; x=$(…)</code> is the fix',
              '<code>local</code> tự nó là một LỆNH, và trạng thái thoát của chính nó — thành công, nó vừa khai báo được một biến — GHI ĐÈ lên kết quả của phép thay thế; không có cái cờ nào cho chuyện này, và tách ra thành <code>local x; x=$(…)</code> mới là cách chữa',
            ),
            B(
              'Command substitution always swallows errors, which is why lines one and three only appear to work — they fail for an unrelated reason and the exit code 2 comes from the shell parsing the assignment rather than from the command inside it',
              'Phép thay thế lệnh LÚC NÀO cũng nuốt lỗi, và đó là lý do dòng một với dòng ba chỉ trông như chạy được — chúng hỏng vì một lý do chẳng liên quan và mã thoát 2 đến từ việc shell phân tích cú pháp phép gán chứ không phải từ lệnh bên trong',
            ),
            B(
              '<code>inherit_errexit</code> only applies to explicit subshells written with parentheses, so a substitution inside a function body is outside its scope; enabling <code>shopt -s extdebug</code> alongside it covers the remaining case',
              '<code>inherit_errexit</code> chỉ áp cho các shell con TƯỜNG MINH viết bằng dấu ngoặc, nên một phép thay thế bên trong thân hàm nằm ngoài tầm của nó; bật thêm <code>shopt -s extdebug</code> bên cạnh sẽ phủ nốt ca còn lại',
            ),
            B(
              'Variables declared <code>local</code> are scoped to the function, so an error inside the assignment is also scoped there and propagates only if the function\'s own return value is checked by the caller',
              'Biến khai báo bằng <code>local</code> có phạm vi trong hàm, nên một lỗi bên trong phép gán cũng chỉ có phạm vi ở đó và chỉ lan ra nếu giá trị trả về của chính hàm được phía gọi kiểm tra',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Line one settles a piece of folklore: <code>x=$(cmd)</code> <em>does</em> propagate the failure — command substitution does not always swallow errors, which is what makes option 2 wrong. <code>inherit_errexit</code> fixes the genuinely subshell-shaped case on line four, where the substitution runs several commands and only the last one\'s status would otherwise count. The one that survives every configuration is <code>local x=$(cmd)</code>, and the reason is grammatical rather than about scope: <code>local</code> is a builtin <em>command</em>, the assignment is its argument, and the exit status of the whole line is <code>local</code>\'s — which is 0, because it successfully declared a variable. The failure inside the substitution has already been discarded by the time errexit looks. Why this matters more than it looks: every non-trivial deploy script has functions, and inside functions people write <code>local</code> by reflex, correctly, because it stops variables leaking between functions. So the single most common line shape in a well-written bash script is also the one place <code>set -euo pipefail</code> silently stops working. The fix is two characters of punctuation — declare, then assign — and ShellCheck flags it as SC2155, which makes running ShellCheck over a deploy script the cheapest review in the whole course.',
            'Dòng một dập tắt một lời đồn: <code>x=$(cmd)</code> CÓ lan truyền cú hỏng — phép thay thế lệnh không phải lúc nào cũng nuốt lỗi, và đó là chỗ phương án 2 sai. <code>inherit_errexit</code> chữa được đúng cái ca mang hình dạng shell-con ở dòng bốn, nơi phép thay thế chạy nhiều lệnh và nếu không có nó thì chỉ trạng thái của lệnh cuối mới được tính. Cái sống sót qua MỌI cấu hình là <code>local x=$(cmd)</code>, và lý do thuộc về NGỮ PHÁP chứ không phải phạm vi biến: <code>local</code> là một LỆNH dựng sẵn, phép gán là THAM SỐ của nó, và trạng thái thoát của cả dòng là của <code>local</code> — tức là 0, vì nó đã khai báo biến thành công. Cú hỏng bên trong phép thay thế đã bị vứt đi từ trước lúc errexit ngó tới. Vì sao chuyện này quan trọng hơn vẻ ngoài của nó: mọi script deploy không tầm thường đều có hàm, và bên trong hàm thì người ta viết <code>local</code> theo phản xạ, một cách ĐÚNG ĐẮN, vì nó ngăn biến rò rỉ giữa các hàm. Nên cái hình dạng dòng lệnh phổ biến nhất trong một script bash viết tốt cũng chính là chỗ DUY NHẤT mà <code>set -euo pipefail</code> âm thầm thôi hoạt động. Cách chữa là hai ký tự dấu câu — khai báo, rồi mới gán — và ShellCheck gắn cờ nó là SC2155, việc đó khiến chạy ShellCheck lên một script deploy là cuộc rà soát rẻ nhất trong cả khoá học này.',
          ),
        }),

        // q34 · đáp án 2
        mcq({
          prompt: B(
            'A cleanup step in a deploy script is written as <code>rm -rf "$BO_DEM"/*</code>. Under <code>set -euo pipefail</code>, which form protects it and why is <code>${BO_DEM:-}</code> the wrong guard?',
            'Một bước dọn dẹp trong script deploy được viết là <code>rm -rf "$BO_DEM"/*</code>. Dưới <code>set -euo pipefail</code>, dạng nào bảo vệ được nó và vì sao <code>${BO_DEM:-}</code> là cái chốt SAI?',
          ),
          options: [
            B(
              'Quoting is what protects it: <code>"$BO_DEM"</code> already prevents word splitting on an empty value, so with <code>-u</code> active the line cannot expand to <code>rm -rf /*</code> and no further guard is needed',
              'Chính việc đặt nháy bảo vệ nó: <code>"$BO_DEM"</code> vốn đã ngăn việc tách từ trên một giá trị rỗng, nên khi <code>-u</code> đang bật thì dòng đó không thể khai triển thành <code>rm -rf /*</code> và không cần chốt nào nữa',
            ),
            B(
              '<code>${BO_DEM:-}</code> is correct and the danger is elsewhere: the real hazard is the trailing <code>/*</code>, which the shell expands before <code>rm</code> ever runs, so replacing it with <code>-r "$BO_DEM"</code> removes the class of problem',
              '<code>${BO_DEM:-}</code> là đúng và mối nguy nằm chỗ khác: hiểm hoạ thật là cái đuôi <code>/*</code>, thứ mà shell khai triển TRƯỚC khi <code>rm</code> kịp chạy, nên thay nó bằng <code>-r "$BO_DEM"</code> sẽ loại bỏ cả lớp vấn đề',
            ),
            B(
              '<code>${BO_DEM:?}</code>, which aborts with a message naming the variable — while <code>${BO_DEM:-}</code> explicitly defaults to empty and therefore <em>silences</em> <code>-u</code>, which is correct when you mean it and a disaster when it was copied from somewhere',
              '<code>${BO_DEM:?}</code>, thứ dừng hẳn kèm một thông báo GỌI TÊN cái biến — còn <code>${BO_DEM:-}</code> thì mặc định về rỗng một cách tường minh và vì thế LÀM CÂM <code>-u</code>, chuyện đó đúng khi bạn cố ý và là thảm hoạ khi nó được chép từ đâu đó về',
            ),
            B(
              'Neither: <code>-u</code> already aborts on an unset variable, so both forms are redundant and the only real protection is running the deploy as an unprivileged user who cannot write outside the release tree',
              'Không dạng nào cả: <code>-u</code> vốn đã dừng script khi gặp biến chưa đặt, nên cả hai dạng đều thừa và lớp bảo vệ thật sự duy nhất là chạy quy trình deploy dưới một người dùng không đặc quyền, kẻ không ghi được ra ngoài cây bản phát hành',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The reason <code>-u</code> earns its place is that its failure mode is not "the script stops early" — it is "the script does something catastrophic and reports success". A typo in a variable name, or a variable set only inside a branch of an <code>if</code> that did not run, expands to nothing, the constructed path is rooted at <code>/</code>, and the exit code is 0. That is the most famous class of shell disaster and <code>-u</code> is the one-word fix. But <code>-u</code> is only a default: <code>${X:-}</code> means "use empty if unset" and is a deliberate instruction to <em>not</em> abort. It is the right thing to write when a variable is genuinely optional, and it is disastrous when someone copied the idiom into a line that deletes things. <code>${X:?}</code> is the opposite instruction — abort, and print the variable\'s name so the message says which one — which is why it belongs on any path you are about to remove. Option 4 misreads what <code>-u</code> covers: with <code>${X:-}</code> present, <code>-u</code> never fires, and running as an unprivileged user limits the blast radius without preventing the bug. Option 1 confuses two problems: quoting stops word splitting, and an empty quoted value still concatenates into <code>/*</code>.',
            'Lý do <code>-u</code> xứng đáng có mặt là vì kiểu hỏng của nó không phải "script dừng sớm" — mà là "script làm một chuyện thảm hoạ rồi báo thành công". Một cú gõ sai tên biến, hay một biến chỉ được đặt bên trong một nhánh <code>if</code> đã không chạy, sẽ khai triển thành rỗng, đường dẫn ghép ra bị neo vào <code>/</code>, và mã thoát là 0. Đó là lớp thảm hoạ shell nổi tiếng nhất và <code>-u</code> là cách chữa gọn trong một chữ. Nhưng <code>-u</code> chỉ là một MẶC ĐỊNH: <code>${X:-}</code> nghĩa là "dùng rỗng nếu chưa đặt" và là một chỉ thị CỐ Ý bảo đừng dừng. Đó là thứ đáng viết khi một biến thật sự là tuỳ chọn, và là thảm hoạ khi ai đó chép cái thành ngữ ấy vào một dòng có xoá thứ gì. <code>${X:?}</code> là chỉ thị NGƯỢC LẠI — dừng hẳn, và in ra TÊN biến để thông báo nói rõ là biến nào — và đó là lý do chỗ của nó nằm trên mọi đường dẫn bạn sắp xoá. Phương án 4 hiểu sai về phạm vi của <code>-u</code>: khi có <code>${X:-}</code> thì <code>-u</code> không bao giờ nổ, còn chạy dưới người dùng không đặc quyền thì giới hạn bán kính nổ chứ không ngăn được con bọ. Phương án 1 lẫn hai vấn đề: đặt nháy chặn việc TÁCH TỪ, còn một giá trị rỗng đã đặt nháy thì vẫn nối vào thành <code>/*</code> như thường.',
          ),
        }),

        // q35 · đáp án 3
        mcq({
          prompt: B(
            'A deploy script asks for confirmation when the working tree is dirty. Run three ways with stdin redirected from <code>/dev/null</code>:' +
            code('read -rp "Van deploy? [y/N] " tl\n' +
                 '[[ "$tl" == "y" ]] || { echo "huy."; exit 0; }\n\n' +
                 'A) read dung mot minh, set -euo pipefail  → (im lang)  ma thoat: 1\n' +
                 'B) read co "|| true"                      → huy.       ma thoat: 0\n' +
                 'C) kiem [ ! -t 0 ] truoc                  → tu choi    ma thoat: 4') +
            'Which of these is the dangerous one, and what makes it dangerous?',
            'Một script deploy hỏi xác nhận khi cây làm việc còn bẩn. Chạy ba cách với stdin chuyển hướng từ <code>/dev/null</code>:' +
            code('read -rp "Van deploy? [y/N] " tl\n' +
                 '[[ "$tl" == "y" ]] || { echo "huy."; exit 0; }\n\n' +
                 'A) read dung mot minh, set -euo pipefail  → (im lang)  ma thoat: 1\n' +
                 'B) read co "|| true"                      → huy.       ma thoat: 0\n' +
                 'C) kiem [ ! -t 0 ] truoc                  → tu choi    ma thoat: 4') +
            'Cái nào trong ba cái này là cái NGUY HIỂM, và cái gì làm nó nguy hiểm?',
          ),
          options: [
            B(
              'A, because exiting 1 on a prompt that simply could not be answered is indistinguishable from a real deploy failure, so an operator investigating the run looks for a broken step that does not exist',
              'A, vì thoát ra 1 trên một lời hỏi đơn giản là không thể trả lời được thì không phân biệt nổi với một cú hỏng deploy thật, nên người vận hành đi soi lần chạy ấy sẽ tìm một bước hỏng không hề tồn tại',
            ),
            B(
              'C, because a refusal with a bespoke exit code has to be understood by every caller, and a script that invents its own numbering forces whoever wraps it to parse English out of the error message',
              'C, vì một lời từ chối kèm mã thoát tự chế thì mọi phía gọi đều phải hiểu được, và một script tự bịa hệ đánh số riêng sẽ buộc kẻ bọc ngoài nó phải đi phân tích tiếng Anh trong thông báo lỗi',
            ),
            B(
              'None of them: all three refuse to deploy, which is the correct behaviour when nobody can confirm, and the exit code only affects how the run is displayed rather than what was done to the machine',
              'Không cái nào cả: cả ba đều TỪ CHỐI deploy, đó là hành vi đúng khi không ai xác nhận được, và mã thoát chỉ ảnh hưởng tới cách lần chạy hiện ra chứ không ảnh hưởng tới thứ đã làm với cái máy',
            ),
            B(
              'B, because it exits <b>0</b> without deploying: run from cron, CI, a background job or an agent, the deploy never happens while every indicator says it did — and the fix is to test <code>[ ! -t 0 ]</code> first and refuse with a distinct code, with an explicit flag for automation to state its intent',
              'B, vì nó thoát ra <b>0</b> mà KHÔNG deploy: chạy từ cron, từ CI, từ một tác vụ nền hay từ một tác nhân, lần deploy chẳng bao giờ xảy ra trong khi mọi chỉ báo đều nói là đã xảy ra — và cách chữa là kiểm <code>[ ! -t 0 ]</code> trước rồi từ chối bằng một mã riêng, kèm một cái cờ tường minh để phía tự động hoá phát biểu ý định của nó',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Variant A is honest by accident: <code>read</code> hitting end-of-file returns non-zero and errexit kills the script, so the run fails visibly. Variant B is what people actually write, because <code>read</code> failing under <code>set -e</code> looks like a bug worth suppressing — and adding <code>|| true</code> suspends errexit for that command, so the script proceeds to the "huy." branch and exits <b>0</b>. From outside, answering <em>no</em>, having <em>nobody able to answer</em>, and <em>deploying successfully</em> are now the same observation. That is the failure this repository documents in its own notes: run the deploy in the background and it stops silently with exit 0 unless you pipe <code>echo y</code> into it. The fix is two lines. <code>[ -t 0 ]</code> asks whether standard input is a terminal; if it is not there is nobody to answer, so say so on stderr and exit with a code of your own rather than inferring consent from silence. The escape hatch is what makes it workable in automation: a <code>--dong-y</code> flag lets the caller state intent explicitly. Give every refusal its own exit code — 2 for "no such release", 3 for "user said no", 4 for "no terminal", 5 for "a required tool is missing" — so a wrapper can treat 3 as normal and 7 as an alert. And keep every check that can refuse <em>before</em> the lock and before the first file is written, so a refusal genuinely means the machine is untouched.',
            'Biến thể A thật thà một cách tình cờ: <code>read</code> gặp hết-tệp thì trả về khác 0 và errexit giết script, nên lần chạy hỏng một cách nhìn thấy được. Biến thể B mới là thứ người ta thật sự viết, vì <code>read</code> hỏng dưới <code>set -e</code> trông như một con bọ đáng dập đi — và thêm <code>|| true</code> thì treo errexit cho câu lệnh đó, nên script đi tiếp vào nhánh "huy." rồi thoát ra <b>0</b>. Từ bên ngoài nhìn vào, việc trả lời KHÔNG, việc KHÔNG AI TRẢ LỜI ĐƯỢC, và việc DEPLOY THÀNH CÔNG giờ là cùng một quan sát. Đó đúng là cú hỏng mà chính kho mã này ghi lại trong ghi chú của nó: chạy deploy ở chế độ nền thì nó dừng im lặng với mã thoát 0 trừ khi bạn bơm <code>echo y</code> vào. Cách chữa là hai dòng. <code>[ -t 0 ]</code> hỏi xem đầu vào chuẩn có phải một terminal không; nếu không thì chẳng có ai để mà trả lời, nên hãy nói thẳng ra stderr rồi thoát bằng một mã của riêng bạn thay vì suy ra sự đồng ý từ sự im lặng. Cái cửa thoát hiểm mới làm nó dùng được trong tự động hoá: một cờ <code>--dong-y</code> cho phía gọi phát biểu ý định một cách tường minh. Hãy cho mỗi lời từ chối một mã thoát riêng — 2 cho "không có bản phát hành đó", 3 cho "người dùng nói không", 4 cho "không có terminal", 5 cho "thiếu một công cụ bắt buộc" — để một script bọc ngoài có thể coi 3 là bình thường còn 7 là báo động. Và hãy giữ mọi phép kiểm CÓ THỂ TỪ CHỐI ở TRƯỚC cái khoá và trước tệp đầu tiên được ghi ra, để một lời từ chối thật sự có nghĩa là cái máy chưa hề bị đụng tới.',
          ),
        }),

        // q36 · đáp án 1
        mcq({
          prompt: B(
            'Two versions of the same deploy step. Measured:' +
            code('=== ban THO, chay hai lan ===\n' +
                 '  lan 1 ma thoat: 0\n' +
                 '  lan 2 ma thoat: 1\n' +
                 '    mkdir: cannot create directory \'…/ban-v1\': File exists\n\n' +
                 '=== ban SUA NUA VOI (mkdir -p, ln -sfn), chay nam lan ===\n' +
                 '  lan 1..5 ma thoat: 0\n' +
                 '  moi-truong bay gio:\n' +
                 '       1  PATH=/opt/ung-dung/bin:$PATH\n' +
                 '       …\n' +
                 '       5  PATH=/opt/ung-dung/bin:$PATH') +
            'Why is the second outcome worse than the first?',
            'Hai phiên bản của cùng một bước deploy. Đo thật:' +
            code('=== ban THO, chay hai lan ===\n' +
                 '  lan 1 ma thoat: 0\n' +
                 '  lan 2 ma thoat: 1\n' +
                 '    mkdir: cannot create directory \'…/ban-v1\': File exists\n\n' +
                 '=== ban SUA NUA VOI (mkdir -p, ln -sfn), chay nam lan ===\n' +
                 '  lan 1..5 ma thoat: 0\n' +
                 '  moi-truong bay gio:\n' +
                 '       1  PATH=/opt/ung-dung/bin:$PATH\n' +
                 '       …\n' +
                 '       5  PATH=/opt/ung-dung/bin:$PATH') +
            'Vì sao kết cục thứ hai TỆ HƠN kết cục thứ nhất?',
          ),
          options: [
            B(
              'It is not worse, only noisier: five identical <code>PATH</code> entries are harmless because the shell uses the first match, so the duplication is untidy rather than a defect and the crash is the real bug',
              'Nó không tệ hơn, chỉ ồn hơn: năm dòng <code>PATH</code> y hệt là vô hại vì shell dùng kết quả khớp đầu tiên, nên sự trùng lặp chỉ là luộm thuộm chứ không phải khuyết tật, và cú sập mới là con bọ thật',
            ),
            B(
              'The crash told the truth and changed nothing; the silent version reported success five times while corrupting a config file, and nothing surfaces it until something downstream chokes — a duplicated nginx block, a cron entry that now runs five times, a <code>PATH</code> long enough to hit <code>E2BIG</code>',
              'Cú sập nói THẬT và không đổi gì cả; bản im lặng báo thành công năm lần trong khi làm hỏng một tệp cấu hình, và chẳng gì phơi nó ra cho tới lúc có thứ ở phía sau nghẹn vì nó — một khối nginx bị nhân bản, một dòng cron giờ chạy năm lần, một <code>PATH</code> dài đủ để đâm vào <code>E2BIG</code>',
            ),
            B(
              'Because <code>mkdir -p</code> hides a real precondition failure: if the release directory already exists, the artifact from a previous attempt is still in it, so the deploy silently ships a mixture and the append is only a symptom',
              'Vì <code>mkdir -p</code> giấu đi một cú hỏng điều kiện tiên quyết thật: nếu thư mục bản phát hành đã tồn tại thì tạo tác của lần thử trước vẫn nằm trong đó, nên lần deploy âm thầm gửi đi một hỗn hợp, còn dòng nối thêm chỉ là triệu chứng',
            ),
            B(
              'Because five runs took five times as long as one, and a deploy script that is not idempotent is usually also slow — the wasted work is the cost, and the duplicated line is a side effect of repeating steps that had already succeeded',
              'Vì năm lượt chạy tốn thời gian gấp năm lần một lượt, và một script deploy không idempotent thì thường cũng chậm — công sức lãng phí mới là cái giá, còn dòng bị lặp chỉ là hệ quả phụ của việc lặp lại những bước vốn đã thành công',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The first thing anybody does when a deploy fails halfway is run it again — that is the correct instinct, and it is only safe if the script was written for it. The crude version fails loudly on the second run: it stops immediately, names the reason, exits non-zero, and changed nothing. Annoying, honest, harmless. The half-fixed version is the one to fear: <code>mkdir -p</code> and <code>ln -sfn</code> made the loud failures go away and left the append untouched, so five clean runs produced five copies of the same line with no exit code reporting it. Damage that is invisible until something downstream chokes on it is the expensive kind, because by then the connection to the deploy has been lost. The narrow fix is <code>grep -qxF "$L" file || echo "$L" &gt;&gt; file</code>, and all three flags earn their place: <code>-q</code> for quiet, <code>-x</code> so the whole line must match (without it a line that merely <em>contains</em> your string counts as present, measured), and <code>-F</code> so the pattern is a fixed string rather than a regex full of live metacharacters. Add <code>2&gt;/dev/null</code> too, because on the first run the file does not exist yet. The stronger fix is to stop editing a file whose current contents you did not write: generate it whole with <code>cat &gt; file &lt;&lt;EOF</code> every time. The constraint is that the script must then own the file completely — machine-owned files get generated, human-owned files get left alone, and nothing is both. And the test that proves it: run the deploy twice with no changes and diff the machine state.',
            'Việc đầu tiên ai cũng làm khi một lần deploy hỏng giữa chừng là chạy lại nó — đó là trực giác ĐÚNG, và nó chỉ an toàn nếu script được viết cho chuyện đó. Bản thô hỏng ỒN ÀO ở lượt chạy thứ hai: nó dừng ngay, gọi tên lý do, thoát ra khác 0, và không đổi gì cả. Khó chịu, thật thà, vô hại. Bản sửa nửa vời mới là bản đáng sợ: <code>mkdir -p</code> và <code>ln -sfn</code> làm biến mất mấy cú hỏng ồn ào và để nguyên dòng nối thêm, nên năm lượt chạy sạch sẽ sinh ra năm bản sao của cùng một dòng mà không mã thoát nào báo. Thiệt hại vô hình cho tới khi có thứ ở phía sau nghẹn vì nó là loại thiệt hại đắt tiền, vì tới lúc ấy thì mối liên hệ với lần deploy đã đứt mất rồi. Cách chữa hẹp là <code>grep -qxF "$L" file || echo "$L" &gt;&gt; file</code>, và cả ba cái cờ đều xứng đáng có mặt: <code>-q</code> cho im lặng, <code>-x</code> để phải khớp CẢ DÒNG (không có nó thì một dòng chỉ CHỨA chuỗi của bạn cũng được tính là đã có, đã đo), và <code>-F</code> để mẫu là một chuỗi cố định chứ không phải một biểu thức chính quy đầy ký tự đặc biệt còn sống. Thêm cả <code>2&gt;/dev/null</code> nữa, vì ở lượt chạy đầu thì tệp chưa tồn tại. Cách chữa mạnh hơn là thôi hẳn việc sửa một tệp mà nội dung hiện tại của nó không do bạn viết: hãy sinh ra nguyên cả tệp bằng <code>cat &gt; file &lt;&lt;EOF</code> mỗi lần. Ràng buộc là script khi ấy phải SỞ HỮU tệp đó hoàn toàn — tệp do máy sở hữu thì được sinh ra, tệp do người sở hữu thì để yên, và không tệp nào vừa là cả hai. Và phép kiểm chứng minh điều đó: chạy lần deploy hai lượt mà không đổi gì rồi so trạng thái cái máy.',
          ),
        }),

        // q37 · đáp án 0
        mcq({
          prompt: B(
            'A readiness check written with a tool that is not installed. The application was serving correctly on port 3391 throughout, measured:' +
            code('  xh: KHONG   curl: CO\n\n' +
                 'A) vong lap 6 lan goi "xh"          → "KHONG len duoc"  ma thoat: 0  | 3073 ms\n' +
                 '   → ung dung THAT SU dang chay: 200\n' +
                 'B) them: command -v xh || exit 5    → "thieu xh"        ma thoat: 5  |    1 ms\n' +
                 'C) cung bo kiem, dung curl, cong CHET → "KHONG len duoc" ma thoat: 6  | 3107 ms') +
            'What is the general lesson, given that B and C both took a "correct" amount of time for what they did?',
            'Một phép kiểm sẵn sàng viết bằng một công cụ chưa được cài. Ứng dụng vẫn phục vụ tốt trên cổng 3391 suốt quá trình, đo thật:' +
            code('  xh: KHONG   curl: CO\n\n' +
                 'A) vong lap 6 lan goi "xh"          → "KHONG len duoc"  ma thoat: 0  | 3073 ms\n' +
                 '   → ung dung THAT SU dang chay: 200\n' +
                 'B) them: command -v xh || exit 5    → "thieu xh"        ma thoat: 5  |    1 ms\n' +
                 'C) cung bo kiem, dung curl, cong CHET → "KHONG len duoc" ma thoat: 6  | 3107 ms') +
            'Bài học tổng quát là gì, biết rằng cả B lẫn C đều tốn một lượng thời gian ĐÚNG với việc chúng làm?',
          ),
          options: [
            B(
              '"The check cannot run" is a third outcome that needs its own exit code — otherwise it is indistinguishable from "the check failed", and a check that always fails gets ignored and then removed',
              '"Phép kiểm KHÔNG CHẠY ĐƯỢC" là một kết cục THỨ BA cần mã thoát riêng của nó — nếu không thì nó không phân biệt được với "phép kiểm HỎNG", và một phép kiểm lúc nào cũng hỏng thì bị làm ngơ rồi bị gỡ đi',
            ),
            B(
              'Retry loops should be much shorter: three seconds of a deploy spent on a readiness probe is wasteful whatever the outcome, and a single attempt with a longer <code>--max-time</code> gives the same information for less',
              'Vòng lặp thử lại nên ngắn hơn nhiều: ba giây của một lần deploy dành cho một phép thăm dò sẵn sàng là lãng phí bất kể kết cục ra sao, và một lượt thử duy nhất với <code>--max-time</code> dài hơn cho cùng thông tin đó mà tốn ít hơn',
            ),
            B(
              'Readiness should be checked through the health endpoint rather than by an external tool, because the application is the only component that knows whether its initialisation finished and no external probe can answer that question',
              'Nên kiểm mức sẵn sàng qua chính endpoint sức khoẻ thay vì bằng một công cụ ngoài, vì ứng dụng là thành phần DUY NHẤT biết việc khởi tạo của nó đã xong hay chưa và không phép thăm dò bên ngoài nào trả lời nổi câu hỏi đó',
            ),
            B(
              'Every deploy environment should install the same tool set, and pinning that set is what makes a check portable; the exit code is a secondary concern once the environment is guaranteed to have what the script calls',
              'Mọi môi trường deploy nên cài cùng một bộ công cụ, và việc ghim bộ đó lại chính là thứ làm một phép kiểm trở nên khả chuyển; mã thoát là mối bận tâm thứ yếu một khi môi trường đã được bảo đảm có đủ thứ script gọi tới',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Run A stacked two failures. The check could not run, and the check that could not run said nothing about it: six iterations, 3,073 ms burned on every deploy, a false report that the application was down while it was answering 200, and exit code <b>0</b> so nothing downstream acted on any of it. Compare it with C, which took almost exactly the same three seconds — but there the time was spent genuinely retrying a real connection to a real port, and the outcome was exit 6. Same duration, completely different information. The one-line guard in B costs 4 ms and turns an unexplainable non-result into a message naming the actual problem with a distinct code. This is not hypothetical: this repository\'s notes record a frontend readiness check calling <code>wget</code> <em>inside the frontend container</em>, an image that deliberately ships with neither <code>wget</code> nor <code>curl</code> because its compose healthcheck uses node\'s http module — so the loop ran its full six iterations on every deploy, cost about 25 seconds, and verified nothing. The habit that generalises: every check has three outcomes, not two, and the third one has to be made distinguishable on purpose. And a check nobody has ever seen fail is a check nobody has tested — cause the failure deliberately and confirm it goes red before you trust it.',
            'Lượt A chồng lên nhau HAI cú hỏng. Phép kiểm không chạy được, và cái phép kiểm không chạy được ấy chẳng nói gì về chuyện đó: sáu vòng lặp, 3.073 ms bị đốt ở mỗi lần deploy, một báo cáo SAI rằng ứng dụng đã chết trong khi nó đang trả 200, và mã thoát <b>0</b> nên không có gì ở phía sau hành động theo bất cứ điều nào trong số ấy. Đem so với lượt C, thứ tốn gần đúng cùng ba giây ấy — nhưng ở đó thời gian được tiêu vào việc thật sự thử lại một kết nối thật tới một cổng thật, và kết cục là mã thoát 6. Cùng thời lượng, thông tin hoàn toàn khác nhau. Cái chốt một dòng ở lượt B tốn 4 ms và biến một kết-quả-không-giải-thích-được thành một thông báo gọi tên đúng vấn đề kèm một mã riêng. Đây không phải chuyện giả định: ghi chú của chính kho mã này ghi lại một phép kiểm sẵn sàng của frontend gọi <code>wget</code> BÊN TRONG container frontend, một ảnh cố ý không cài <code>wget</code> lẫn <code>curl</code> vì healthcheck của compose dùng module http của node — nên vòng lặp quay đủ sáu vòng ở mọi lần deploy, tốn khoảng 25 giây, và chẳng kiểm được gì. Thói quen tổng quát hoá được: mọi phép kiểm có BA kết cục chứ không phải hai, và cái thứ ba phải được làm cho phân biệt được một cách CÓ CHỦ ĐÍCH. Và một phép kiểm chưa ai từng thấy nó HỎNG là một phép kiểm chưa ai kiểm thử — hãy cố ý gây ra cú hỏng và xác nhận nó đỏ lên trước khi bạn tin nó.',
          ),
        }),

        /* ── Chương 8 — sống trên một cái máy nhỏ (4 câu) ─────────────── */

        // q38 · đáp án 2
        mcq({
          prompt: B(
            'A container is given <code>--memory=64m --memory-swap=64m</code> and asked to allocate far more. Measured on Docker Engine 29.5.3:' +
            code('  ma thoat: 137\n' +
                 '  OOMKilled=true  ExitCode=137  Error=\n' +
                 '  docker ps -a: Exited (137) Less than a second ago\n' +
                 '  → nhat ky cua ung dung: dong cuoi la mot dong tien do binh thuong') +
            'Where is the explanation, and what distinguishes 137 from 143?',
            'Một container được cấp <code>--memory=64m --memory-swap=64m</code> rồi bị bắt cấp phát nhiều hơn hẳn. Đo trên Docker Engine 29.5.3:' +
            code('  ma thoat: 137\n' +
                 '  OOMKilled=true  ExitCode=137  Error=\n' +
                 '  docker ps -a: Exited (137) Less than a second ago\n' +
                 '  → nhat ky cua ung dung: dong cuoi la mot dong tien do binh thuong') +
            'Lời giải thích nằm ở đâu, và cái gì phân biệt 137 với 143?',
          ),
          options: [
            B(
              'In the application log at a higher verbosity level: the process does receive a signal it can observe, and most runtimes will print an out-of-memory diagnostic if logging is configured to capture it',
              'Trong nhật ký ứng dụng ở mức chi tiết cao hơn: tiến trình CÓ nhận một tín hiệu mà nó quan sát được, và phần lớn runtime sẽ in ra một chẩn đoán hết bộ nhớ nếu việc ghi log được cấu hình để bắt lấy nó',
            ),
            B(
              'In the exit code alone, since 137 and 143 both mean the runtime stopped the container and the difference is only which shutdown path Docker chose based on <code>stop_grace_period</code>',
              'Chỉ trong mã thoát, vì cả 137 lẫn 143 đều nghĩa là runtime đã dừng container và khác biệt chỉ là Docker chọn đường tắt nào dựa trên <code>stop_grace_period</code>',
            ),
            B(
              'In the kernel ring buffer — <code>dmesg</code> or <code>journalctl -k</code> — because <code>SIGKILL</code> cannot be caught, so the process ran no code at all; 137 is 128+9 and means it was removed between two instructions, while 143 is 128+15 and means the shutdown handler ran and the process chose to exit',
              'Trong vòng đệm log của nhân — <code>dmesg</code> hay <code>journalctl -k</code> — vì <code>SIGKILL</code> KHÔNG bắt được, nên tiến trình không chạy được một dòng mã nào; 137 là 128+9 và nghĩa là nó bị gỡ đi giữa hai lệnh máy, còn 143 là 128+15 và nghĩa là trình xử lý tắt máy ĐÃ chạy và tiến trình tự CHỌN việc thoát',
            ),
            B(
              'In <code>docker inspect</code>, whose <code>State.Error</code> field carries the reason; here it is empty because the container was limited by a cgroup rather than by the host, and a host-level kill would have populated it',
              'Trong <code>docker inspect</code>, nơi trường <code>State.Error</code> mang theo lý do; ở đây nó rỗng vì container bị giới hạn bởi một cgroup chứ không phải bởi máy chủ, còn một cú giết ở mức máy chủ thì đã điền vào đó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A shell reports a process killed by signal <em>N</em> as exit code 128+N. Signal 9 is <code>SIGKILL</code>, which cannot be caught, blocked or handled — so the process does not get to run any code: no flush, no close, no log line. That is why the last thing in the application log is whatever it happened to be doing, and why "the app just disappeared" is such a common bug report: if you go looking for the cause in the application log, the answer is not there and never will be. It is in the kernel ring buffer, which names the pid, the resident set, the <code>oom_score_adj</code>, and — the field that decides what you do next — the constraint: <code>CONSTRAINT_MEMCG</code> means a cgroup or container limit was hit and the machine may have gigabytes free, while <code>CONSTRAINT_NONE</code> means the machine genuinely ran out. The 137/143 pair is the diagnosis in two numbers, and option 2 erases exactly the distinction that matters: <code>143</code> means your handler ran, connections drained, the process exited on its own terms; <code>137</code> means none of that happened. One caveat: <code>dmesg</code> is a ring buffer with a fixed size, so on a busy machine this morning\'s OOM record can simply be gone by the afternoon, leaving a mystery restart with no explanation — <code>journalctl -k</code> reads the persisted copy where systemd is present.',
            'Một shell báo lại một tiến trình bị giết bởi tín hiệu N thành mã thoát 128+N. Tín hiệu 9 là <code>SIGKILL</code>, thứ không bắt được, không chặn được, không xử lý được — nên tiến trình không được chạy một dòng mã nào: không đẩy đệm ra, không đóng gì, không một dòng log. Đó là lý do thứ cuối cùng trong nhật ký ứng dụng là bất cứ việc gì nó tình cờ đang làm, và cũng là lý do "ứng dụng tự nhiên biến mất" là một báo cáo lỗi phổ biến đến thế: nếu bạn đi tìm nguyên nhân trong nhật ký ứng dụng thì câu trả lời không ở đó và sẽ không bao giờ ở đó. Nó nằm trong vòng đệm log của nhân, nơi gọi tên pid, kích thước bộ nhớ thường trú, giá trị <code>oom_score_adj</code>, và — cái trường quyết định bạn làm gì tiếp theo — RÀNG BUỘC: <code>CONSTRAINT_MEMCG</code> nghĩa là một giới hạn cgroup hay container bị chạm tới và cái máy có thể còn trống hàng gigabyte, còn <code>CONSTRAINT_NONE</code> nghĩa là cái máy thật sự hết bộ nhớ. Cặp 137/143 là cả một chẩn đoán gói trong hai con số, và phương án 2 xoá đúng cái phân biệt đáng giá: <code>143</code> nghĩa là trình xử lý của bạn ĐÃ chạy, kết nối đã xả xong, tiến trình thoát theo điều kiện của chính nó; <code>137</code> nghĩa là không điều nào trong số đó xảy ra. Một lời dặn: <code>dmesg</code> là một vòng đệm có kích thước cố định, nên trên một cái máy bận thì bản ghi OOM sáng nay có thể đơn giản là biến mất vào buổi chiều, để lại một cú khởi động lại bí ẩn không lời giải thích — <code>journalctl -k</code> đọc bản đã lưu bền ở những nơi có systemd.',
          ),
        }),

        // q39 · đáp án 3
        mcq({
          prompt: B(
            'A build script asks for 120 MB inside a 256 MB cgroup already holding a 170 MB database that has touched every page it allocated. Then the identical test with one line added to the build:' +
            code('  csdl pid=3154  oom_score=679  adj=0\n' +
                 '  cgroup dang dung: 255 MB / 256 MB\n' +
                 '--- ban dung xin 120 MB ---\n' +
                 '  build ma thoat : 0\n' +
                 '  csdl /proc/3154 : DA BI GIET\n' +
                 '  memory.events  : … oom 1 oom_kill 1 oom_group_kill 0\n\n' +
                 '--- CUNG phep thu, nhung ban dung TU NANG diem cua chinh no len 1000\n' +
                 '    truoc khi cap phat: echo 1000 > /proc/self/oom_score_adj ---\n' +
                 '  build ma thoat : 137\n' +
                 '  csdl /proc/3154 : CON SONG\n' +
                 '  memory.events  : … oom 1 oom_kill 1 oom_group_kill 0') +
            'Why does the kernel pick the database by default, and what does the one line change?',
            'Một script dựng xin 120 MB bên trong một cgroup 256 MB vốn đã chứa một cơ sở dữ liệu 170 MB đã chạm vào mọi trang nhớ nó cấp phát. Rồi cùng đúng phép thử đó với MỘT dòng thêm vào bản dựng:' +
            code('  csdl pid=3154  oom_score=679  adj=0\n' +
                 '  cgroup dang dung: 255 MB / 256 MB\n' +
                 '--- ban dung xin 120 MB ---\n' +
                 '  build ma thoat : 0\n' +
                 '  csdl /proc/3154 : DA BI GIET\n' +
                 '  memory.events  : … oom 1 oom_kill 1 oom_group_kill 0\n\n' +
                 '--- CUNG phep thu, nhung ban dung TU NANG diem cua chinh no len 1000\n' +
                 '    truoc khi cap phat: echo 1000 > /proc/self/oom_score_adj ---\n' +
                 '  build ma thoat : 137\n' +
                 '  csdl /proc/3154 : CON SONG\n' +
                 '  memory.events  : … oom 1 oom_kill 1 oom_group_kill 0') +
            'Vì sao theo mặc định nhân lại chọn cơ sở dữ liệu, và một dòng ấy đổi cái gì?',
          ),
          options: [
            B(
              'The kernel kills whichever process most recently requested memory it could not satisfy, and the database happened to be mid-allocation; raising the build\'s score changes the ordering of the allocation queue so the build reaches the ceiling first',
              'Nhân giết tiến trình nào GẦN ĐÂY NHẤT xin bộ nhớ mà nó không đáp ứng nổi, và cơ sở dữ liệu tình cờ đang giữa một lượt cấp phát; nâng điểm của bản dựng lên sẽ đổi thứ tự hàng đợi cấp phát để bản dựng chạm trần trước',
            ),
            B(
              'Databases are given a higher <code>oom_score_adj</code> by their packaging so that a corrupted shared buffer is discarded rather than persisted, and overriding that default is what the extra line does',
              'Cơ sở dữ liệu được gói cài đặt đặt cho một <code>oom_score_adj</code> cao hơn để một vùng đệm chung bị hỏng sẽ bị vứt đi thay vì lưu lại, và dòng thêm vào chính là để ghi đè cái mặc định đó',
            ),
            B(
              'Because the build had already exited by the time the group ran out, so it was not a candidate; the line makes it stay resident until the allocation completes, which is what puts it back in the running',
              'Vì bản dựng đã thoát xong từ trước lúc nhóm hết bộ nhớ, nên nó không phải một ứng viên; dòng đó làm nó nằm lại trong bộ nhớ cho tới khi lượt cấp phát hoàn tất, và đó là thứ đưa nó trở lại danh sách',
            ),
            B(
              'The OOM killer optimises for freeing the most pages at once, so it picks the <em>largest</em> process rather than the one that caused the shortage; <code>echo 1000 &gt; /proc/self/oom_score_adj</code> puts the build\'s thumb on its own side of the scale, needs no privilege, and converts "the database died" into "the batch job died"',
              'OOM killer tối ưu cho việc giải phóng NHIỀU TRANG NHẤT trong một lần, nên nó chọn tiến trình LỚN NHẤT chứ không phải kẻ gây ra sự thiếu hụt; <code>echo 1000 &gt; /proc/self/oom_score_adj</code> đặt ngón tay cái của bản dựng lên đúng phía của chính nó, không cần đặc quyền nào, và biến "cơ sở dữ liệu chết" thành "tác vụ lô chết"',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Read the two lines of the first block together: the build <b>succeeded</b> — exit 0, it got its memory, it finished its job — and the database was <b>killed</b>. The process that triggered the shortage walked away clean, and the process doing its job correctly, using memory exactly the way a database is supposed to, was the one removed. Nothing about that is a bug; it is the OOM killer working as designed, because when the kernel needs pages <em>now</em> it optimises for freeing the most at once, and that means the biggest resident set. On a small server the biggest process is almost always the database, so "somebody ran a build on the production box, their script exited 0, and twenty seconds later the site was down" is a complete and common incident with no obvious connection between cause and effect. The fix costs one line and no privileges, because raising your own score is always allowed while <em>lowering</em> another process\'s requires <code>CAP_SYS_RESOURCE</code> — which is why the database\'s protection belongs in its systemd unit (<code>OOMScoreAdjust=-500</code>) and the build\'s belongs in the build script. The measurement confirms the reversal exactly: the same cgroup, the same two workloads, the same single OOM kill in <code>memory.events</code> â and the victim swapped from the 170 MB database to the smaller build, purely because of that one number. Note the database’s <code>oom_score</code> of 679 against an <code>oom_score_adj</code> of 0: the score is derived mostly from how much memory a process uses as a proportion of what is available to it, and the adjustment is the only thumb you get on that scale. Worth pairing with <code>MemoryHigh=</code>, the gentle ceiling that throttles a process over the line instead of killing it, and with <code>StartLimitBurst</code>, because <code>Restart=always</code> plus an OOM turns a spike into a loop that degrades with every cycle.',
            'Hãy đọc hai dòng của khối đầu cùng nhau: bản dựng THÀNH CÔNG — mã thoát 0, nó xin được bộ nhớ, nó làm xong việc — còn cơ sở dữ liệu thì BỊ GIẾT. Kẻ gây ra sự thiếu hụt bước đi sạch sẽ, còn kẻ đang làm đúng việc của mình, dùng bộ nhớ đúng theo cách một cơ sở dữ liệu phải dùng, lại là kẻ bị gỡ bỏ. Chuyện đó chẳng có gì là con bọ cả; đó là OOM killer chạy đúng thiết kế, vì khi nhân cần trang nhớ NGAY BÂY GIỜ thì nó tối ưu cho việc giải phóng nhiều nhất trong một lần, và điều đó nghĩa là bộ nhớ thường trú lớn nhất. Trên một máy chủ nhỏ thì tiến trình lớn nhất gần như luôn là cơ sở dữ liệu, nên "có người chạy một lần dựng trên máy production, script của họ thoát ra 0, và hai mươi giây sau website chết" là một sự cố trọn vẹn và phổ biến mà không có mối liên hệ hiển nhiên nào giữa nguyên nhân với hậu quả. Cách chữa tốn một dòng và không cần đặc quyền, vì tự NÂNG điểm của chính mình thì luôn được phép còn HẠ điểm của tiến trình khác thì cần <code>CAP_SYS_RESOURCE</code> — và đó là lý do lớp bảo vệ cho cơ sở dữ liệu thuộc về unit systemd của nó (<code>OOMScoreAdjust=-500</code>) còn lớp của bản dựng thì thuộc về chính script dựng. Phép đo xác nhận cú đảo ngược chính xác: cùng một cgroup, cùng hai khối việc, cùng đúng MỘT lần giết trong <code>memory.events</code> — và nạn nhân đổi từ cơ sở dữ liệu 170 MB sang bản dựng NHỎ HƠN, thuần tuý vì một con số ấy. Hãy để ý <code>oom_score</code> 679 của cơ sở dữ liệu đi cùng <code>oom_score_adj</code> bằng 0: điểm số ấy suy chủ yếu từ việc một tiến trình dùng bao nhiêu bộ nhớ so với phần nó được phép dùng, và cái điều chỉnh kia là ngón tay cái DUY NHẤT bạn đặt được lên cán cân đó. Đáng ghép với <code>MemoryHigh=</code>, cái trần nhẹ nhàng bóp cho một tiến trình vượt vạch chậm lại thay vì giết nó, và với <code>StartLimitBurst</code>, vì <code>Restart=always</code> cộng một cú OOM biến một cơn tăng vọt thành một vòng lặp mà mỗi chu kỳ lại tệ hơn.',
          ),
        }),

        // q40 · đáp án 1
        mcq({
          prompt: B(
            'A build cache fills the filesystem the database is on. Measured on a 156 MB ext4:' +
            code('  dd: error writing \'/mnt/dia/x.bin\': No space left on device\n' +
                 '  /dev/loop0  156M  153M     0 100% /mnt/dia\n\n' +
                 '  echo "them mot dong" >> bo-dem.bin   → ma thoat: 0\n' +
                 '  dd … wal.bin bs=1M count=1          → 0 bytes copied\n\n' +
                 '  rm -f bo-dem.bin   ma thoat: 0   mat 14 ms\n' +
                 '  /dev/loop0  156M   14K  144M   1% /mnt/dia\n' +
                 '  ghi WAL 1 MB sau khi xoa: THANH CONG') +
            'What is the practical shape of a full disk, given that the small append succeeded?',
            'Một bộ đệm dựng làm đầy hệ tệp mà cơ sở dữ liệu đang nằm trên đó. Đo trên một ext4 156 MB:' +
            code('  dd: error writing \'/mnt/dia/x.bin\': No space left on device\n' +
                 '  /dev/loop0  156M  153M     0 100% /mnt/dia\n\n' +
                 '  echo "them mot dong" >> bo-dem.bin   → ma thoat: 0\n' +
                 '  dd … wal.bin bs=1M count=1          → 0 bytes copied\n\n' +
                 '  rm -f bo-dem.bin   ma thoat: 0   mat 14 ms\n' +
                 '  /dev/loop0  156M   14K  144M   1% /mnt/dia\n' +
                 '  ghi WAL 1 MB sau khi xoa: THANH CONG') +
            'Hình dạng thực tế của một cái đĩa đầy là gì, biết rằng lệnh nối thêm nhỏ vẫn THÀNH CÔNG?',
          ),
          options: [
            B(
              'A full disk stops all writes at once, and the successful append is an artifact of the shell buffering output — the bytes had not reached the filesystem yet when the exit code was reported, and they were lost',
              'Một cái đĩa đầy chặn MỌI lệnh ghi cùng một lúc, còn lệnh nối thêm thành công chỉ là ảo giác do shell đệm đầu ra — các byte đó chưa tới hệ tệp khi mã thoát được báo về, và chúng đã mất',
            ),
            B(
              'Not a clean stop but an arbitrary boundary: some writes succeed and some do not depending on size and where they land, so a full disk produces a scattering of unrelated-looking errors across every program on the machine — and it is recoverable in milliseconds, because deleting a directory entry needs no new block',
              'Không phải một cú dừng gọn ghẽ mà là một ranh giới TUỲ TIỆN: có lệnh ghi thành công có lệnh không, tuỳ vào kích thước và chỗ nó rơi vào, nên một cái đĩa đầy sinh ra một chùm lỗi trông chẳng liên quan gì nhau rải khắp mọi chương trình trên máy — và nó khôi phục được trong vài mili giây, vì xoá một mục thư mục thì không cần cấp khối mới',
            ),
            B(
              'The filesystem entered read-only mode after the first <code>ENOSPC</code>, which is why the 1 MB write failed; the <code>rm</code> succeeded because remounting happens automatically once free space is detected by the kernel',
              'Hệ tệp chuyển sang chế độ chỉ-đọc sau cú <code>ENOSPC</code> đầu tiên, và đó là lý do lệnh ghi 1 MB hỏng; lệnh <code>rm</code> chạy được vì việc gắn lại xảy ra tự động một khi nhân phát hiện có chỗ trống',
            ),
            B(
              'The 5% root reserve absorbed the small append, so the boundary is exactly that reserve; setting <code>tune2fs -m 0</code> on the data disk removes the ambiguity and makes the filesystem fail consistently for every writer',
              'Phần dự trữ 5% cho root đã hấp thụ lệnh nối thêm nhỏ, nên ranh giới chính là đúng phần dự trữ ấy; đặt <code>tune2fs -m 0</code> cho đĩa dữ liệu sẽ gỡ bỏ sự nhập nhằng và làm hệ tệp hỏng một cách nhất quán với mọi kẻ ghi',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Unlike memory pressure, a full disk does not kill the process — it stays alive and receives errors it very often does not handle, which is how a full disk becomes a corrupted database rather than a clean outage. And the boundary is ragged: the small append fitted inside an already-allocated block and returned 0, while the 1 MB write needed new blocks and failed with <code>ENOSPC</code>. Every program on the machine crosses that line at a different moment and for a different write, which is why the symptom is a scattering of unrelated-looking errors rather than one clear failure. The recovery is the reassuring half: <code>rm</code> works when writing does not, because removing a directory entry needs no new block, and the freed space is usable at once — 14 ms, and the write that failed a second earlier succeeded. A machine reporting 100% disk is almost never unrecoverable; it is one <code>rm</code> away from working. Option 4 misattributes the reserve, which is real (ext4 keeps 5% for root by default, and on the root filesystem it is exactly what lets you log in and delete something) but is not what made the append succeed. Two habits close this class: keep growth off the disk the database is on — build cache, images, logs, old releases all grow monotonically unless something removes them — and alert on the trend rather than the threshold, because "full in three days" arrives during office hours and "90% full" arrives at whatever hour it happens to.',
            'Khác với áp lực bộ nhớ, một cái đĩa đầy KHÔNG giết tiến trình — nó vẫn sống và nhận về những lỗi mà rất thường là nó không xử lý, và đó là cách một cái đĩa đầy trở thành một cơ sở dữ liệu hỏng thay vì một sự cố gọn gàng. Và cái ranh giới thì lởm chởm: lệnh nối thêm nhỏ vừa vặn trong một khối đã cấp sẵn nên trả về 0, còn lệnh ghi 1 MB cần khối mới nên hỏng với <code>ENOSPC</code>. Mọi chương trình trên máy vượt qua cái vạch ấy ở một thời điểm khác nhau và với một lệnh ghi khác nhau, và đó là lý do triệu chứng là một chùm lỗi trông chẳng liên quan gì nhau chứ không phải một cú hỏng rõ ràng. Phần khôi phục là nửa đáng an ủi: <code>rm</code> chạy được trong khi ghi thì không, vì gỡ một mục thư mục không cần cấp khối mới, và chỗ vừa giải phóng dùng được ngay — 14 mili giây, và lệnh ghi vừa hỏng một giây trước đó đã thành công. Một cái máy báo đĩa 100% gần như không bao giờ là không cứu được; nó chỉ cách chỗ chạy được đúng một lệnh <code>rm</code>. Phương án 4 quy sai cho phần dự trữ, thứ CÓ THẬT (ext4 mặc định giữ 5% cho root, và trên hệ tệp gốc thì đó đúng là thứ cho phép bạn đăng nhập vào rồi xoá bớt đi) nhưng không phải thứ đã làm lệnh nối thêm thành công. Hai thói quen đóng lớp vấn đề này lại: hãy giữ những thứ PHÌNH RA ra khỏi cái đĩa mà cơ sở dữ liệu đang nằm — bộ đệm dựng, ảnh container, log, bản phát hành cũ đều tăng đơn điệu trừ khi có thứ gì đó dọn chúng đi — và hãy báo động theo XU HƯỚNG thay vì theo ngưỡng, vì "ba ngày nữa đầy" thì tới trong giờ hành chính còn "đầy 90%" thì tới vào bất cứ giờ nào nó tình cờ tới.',
          ),
        }),

        // q41 · đáp án 0
        mcq({
          prompt: B(
            'Two filesystems refusing writes. Measured:' +
            code('=== A ===\n' +
                 '  df noi : 102M dung, 43M trong\n' +
                 '  du noi : 1.1M\n' +
                 '  lsof -nP +L1:\n' +
                 '    python3 9060 root 3w REG 104857600 0 12 /mnt/dia/log-lon.log (deleted)\n' +
                 '  : > /proc/9060/fd/3   → df dung/trong: 1.1M / 143M\n\n' +
                 '=== B ===\n' +
                 '  dung o tep thu 1925: No space left on device\n' +
                 '  df -h : 166M  2.0M  152M   2%\n' +
                 '  df -i :  1936  1936     0 100%') +
            'What separates these two cases, and which three commands distinguish them?',
            'Hai hệ tệp từ chối ghi. Đo thật:' +
            code('=== A ===\n' +
                 '  df noi : 102M dung, 43M trong\n' +
                 '  du noi : 1.1M\n' +
                 '  lsof -nP +L1:\n' +
                 '    python3 9060 root 3w REG 104857600 0 12 /mnt/dia/log-lon.log (deleted)\n' +
                 '  : > /proc/9060/fd/3   → df dung/trong: 1.1M / 143M\n\n' +
                 '=== B ===\n' +
                 '  dung o tep thu 1925: No space left on device\n' +
                 '  df -h : 166M  2.0M  152M   2%\n' +
                 '  df -i :  1936  1936     0 100%') +
            'Cái gì phân biệt hai ca này, và ba câu lệnh nào tách được chúng ra?',
          ),
          options: [
            B(
              'A is a deleted file a process still holds open, so the inode survives with no name and <code>du</code> cannot see it; B is inode exhaustion, where 152 MB is free and every block is available but no file can be created. <code>df -h</code>, <code>df -i</code> and <code>lsof -nP +L1</code> separate all three cases in three lines',
              'A là một tệp ĐÃ XOÁ mà một tiến trình vẫn đang MỞ, nên inode sống tiếp mà không còn tên và <code>du</code> không thấy nó; B là cạn INODE, nơi còn trống 152 MB và mọi khối đều sẵn sàng mà không tạo nổi một tệp nào. <code>df -h</code>, <code>df -i</code> và <code>lsof -nP +L1</code> tách được cả ba ca trong ba dòng',
            ),
            B(
              'Both are the same problem seen twice: a process holding a deleted file also holds the inodes that file used, so B is the later stage of A and truncating through <code>/proc</code> resolves either one',
              'Cả hai là cùng một vấn đề nhìn hai lần: một tiến trình đang giữ một tệp đã xoá thì cũng giữ luôn các inode mà tệp đó dùng, nên B là giai đoạn muộn hơn của A và cắt cụt qua <code>/proc</code> giải quyết được cả hai',
            ),
            B(
              'A is filesystem corruption, since <code>df</code> and <code>du</code> disagreeing is the classic signature of a damaged allocation table, and B is normal behaviour on a small filesystem; <code>fsck</code> resolves A and B needs no action',
              'A là hỏng hệ tệp, vì việc <code>df</code> và <code>du</code> bất đồng là chữ ký kinh điển của một bảng cấp phát bị hỏng, còn B là hành vi bình thường trên một hệ tệp nhỏ; <code>fsck</code> giải quyết A và B thì chẳng cần làm gì',
            ),
            B(
              'A is the 5% root reserve being visible to <code>df</code> and hidden from <code>du</code>, and B is the same reserve exhausted; <code>tune2fs -m 1</code> reclaims the space in both cases without touching any running process',
              'A là phần dự trữ 5% cho root hiện ra với <code>df</code> và bị giấu khỏi <code>du</code>, còn B là chính phần dự trữ ấy đã cạn; <code>tune2fs -m 1</code> thu hồi lại chỗ đó trong cả hai ca mà không đụng tới tiến trình nào đang chạy',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Case A is the one that wastes the most time, because the space is genuinely gone and there is nothing on the filesystem to point at. A process wrote a 100 MB log and kept it open; something — logrotate, a cleanup script, a person — deleted the file. The name is gone, so <code>du</code> walks the tree and reports 1.1 MB, while the inode survives as long as one descriptor still references it and <code>df</code> insists on 102 MB. <code>lsof -nP +L1</code> filters to files with a link count below 1 and names the holder and the descriptor. The important move is the fix: <code>: &gt; /proc/9060/fd/3</code> truncates through the still-open descriptor and returns the space <em>without restarting anything</em>, which matters enormously when the process holding it is your database. This is also why <code>rm big.log</code> during a disk emergency frees exactly zero bytes on a file a service has open — truncate instead, which is precisely what logrotate\'s <code>copytruncate</code> exists for. Case B has the same errno and the opposite reading: every file needs an inode, and running out of them makes the filesystem full while <code>df -h</code> cheerfully reports 2%. On a real server that comes from mail spools, session files or tiny cache entries. The three-line habit — <code>df -h; df -i; lsof -nP +L1 | head</code> — separates blocks exhausted, inodes exhausted and space held by a ghost, and explains a startling variety of unrelated-looking errors.',
            'Ca A là ca tốn nhiều thời gian nhất, vì chỗ đĩa mất thật mà trên hệ tệp lại chẳng có gì để mà chỉ vào. Một tiến trình ghi ra một tệp log 100 MB rồi giữ nó mở; một thứ gì đó — logrotate, một script dọn dẹp, một con người — đã xoá tệp ấy đi. Cái TÊN biến mất, nên <code>du</code> đi khắp cây thư mục và báo 1,1 MB, trong khi inode vẫn sống chừng nào còn một mô tả tệp tham chiếu tới nó và <code>df</code> thì khăng khăng 102 MB. <code>lsof -nP +L1</code> lọc ra những tệp có số liên kết dưới 1 rồi gọi tên kẻ đang giữ và cái mô tả tệp. Nước đi quan trọng là cách chữa: <code>: &gt; /proc/9060/fd/3</code> cắt cụt tệp THÔNG QUA chính cái mô tả còn mở và trả lại chỗ đĩa mà KHÔNG phải khởi động lại thứ gì, chuyện đó cực kỳ quan trọng khi kẻ đang giữ nó là cơ sở dữ liệu của bạn. Đây cũng là lý do <code>rm big.log</code> trong một cơn khẩn cấp về đĩa giải phóng đúng không byte nào với một tệp mà dịch vụ đang mở — hãy CẮT CỤT thay vào đó, và đó chính xác là lý do tồn tại của tuỳ chọn <code>copytruncate</code> trong logrotate. Ca B có cùng errno mà cách đọc thì ngược lại: mọi tệp đều cần một inode, và cạn inode làm hệ tệp trở nên ĐẦY trong khi <code>df -h</code> vẫn vui vẻ báo 2%. Trên một máy chủ thật thì chuyện đó tới từ hộp thư, tệp phiên, hoặc những mục cache tí hon. Thói quen ba dòng — <code>df -h; df -i; lsof -nP +L1 | head</code> — tách được ba ca cạn khối, cạn inode và chỗ bị một bóng ma giữ, và nó giải thích một lượng đáng ngạc nhiên những lỗi trông chẳng liên quan gì nhau.',
          ),
        }),

        /* ── Chương 9 — giám sát (4 câu) ──────────────────────────────── */

        // q42 · đáp án 2
        mcq({
          prompt: B(
            'A monitoring script needs the current CPU busy percentage. Measured on a 10-core machine:' +
            code('$ head -1 /proc/stat\n' +
                 '  cpu  14970 0 5222 2867314 1858 0 3954 0 0 0\n\n' +
                 '  may dang ranh : CPU ban  0.2%  (delta tong=1006, delta idle=1004)\n' +
                 '  ep hai nhan   : CPU ban 19.9%  (delta tong=1005, delta idle= 805)') +
            'What must the script do to get a meaningful number, and why is <code>/proc/loadavg</code> the wrong source for this?',
            'Một script giám sát cần tỷ lệ CPU đang bận HIỆN TẠI. Đo trên một máy 10 nhân:' +
            code('$ head -1 /proc/stat\n' +
                 '  cpu  14970 0 5222 2867314 1858 0 3954 0 0 0\n\n' +
                 '  may dang ranh : CPU ban  0.2%  (delta tong=1006, delta idle=1004)\n' +
                 '  ep hai nhan   : CPU ban 19.9%  (delta tong=1005, delta idle= 805)') +
            'Script phải làm gì để lấy được một con số CÓ NGHĨA, và vì sao <code>/proc/loadavg</code> là nguồn sai cho việc này?',
          ),
          options: [
            B(
              'Divide the first field by <code>getconf CLK_TCK</code> and then by the number of cores; <code>/proc/loadavg</code> is wrong because it counts threads rather than time and so cannot be converted into a percentage at all',
              'Chia trường đầu tiên cho <code>getconf CLK_TCK</code> rồi chia tiếp cho số nhân; <code>/proc/loadavg</code> sai vì nó đếm LUỒNG chứ không đếm thời gian nên không quy đổi ra tỷ lệ phần trăm được',
            ),
            B(
              'Read the file once and subtract the idle field from the total, which is what the two measured lines show; <code>/proc/loadavg</code> is wrong because it is only updated when a process is scheduled and can be stale for minutes on an idle machine',
              'Đọc tệp một lần rồi trừ trường idle khỏi tổng, đúng như hai dòng đo được cho thấy; <code>/proc/loadavg</code> sai vì nó chỉ được cập nhật khi có tiến trình được xếp lịch và có thể cũ tới vài phút trên một cái máy đang rảnh',
            ),
            B(
              'Take <em>two</em> readings and compute <code>100 × (Δtotal − Δidle) / Δtotal</code>, because every field is a counter cumulative since boot and a single reading is meaningless; <code>/proc/loadavg</code> is an exponentially-weighted moving average over 1, 5 and 15 minutes, so by construction it describes the past',
              'Lấy HAI lần đọc rồi tính <code>100 × (Δtổng − Δidle) / Δtổng</code>, vì mọi trường ở đó là bộ đếm CỘNG DỒN từ lúc khởi động và một lần đọc đơn lẻ thì vô nghĩa; <code>/proc/loadavg</code> là một trung bình động có trọng số mũ trên 1, 5 và 15 phút, nên theo cấu tạo nó mô tả QUÁ KHỨ',
            ),
            B(
              'Read <code>/proc/pressure/cpu</code> instead, since it reports a percentage directly and needs no arithmetic; <code>/proc/stat</code> and <code>/proc/loadavg</code> are both legacy interfaces kept only for compatibility with older tooling',
              'Đọc <code>/proc/pressure/cpu</code> thay vào đó, vì nó báo thẳng ra một tỷ lệ phần trăm và không cần tính toán gì; <code>/proc/stat</code> và <code>/proc/loadavg</code> đều là các giao diện cũ chỉ còn giữ lại để tương thích với công cụ đời trước',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The delta columns are the whole answer. Every field in <code>/proc/stat</code> is a total since boot measured in units of 1/100 second, so one reading tells you nothing at all — the numbers only become a rate when you subtract two of them and divide by the interval. The busy fraction is total minus idle over total, and the counters sum across all CPUs, which is why two busy cores out of ten read as 19.9% rather than 100%. This is the mistake people make writing their first monitoring script: read <code>/proc/diskstats</code>, see a huge number, report it as a rate. It is a total. And the interval has to be <em>measured</em> too, not assumed, because <code>sleep 1</code> does not sleep for exactly one second. The second half is why load average is the wrong tool for an incident rather than a broken one: it is a moving average with time constants of 1, 5 and 15 minutes, so it is a good number for "was yesterday busier than today" and useless for "is something wrong right now" — a machine can be completely saturated while the one-minute figure is still near zero, because a moving average is by construction a description of the past. Option 4 names something real — PSI in <code>/proc/pressure/*</code> is closer to "is this resource hurting me" than anything else available — but calling <code>/proc/stat</code> legacy is wrong, and the arithmetic above is what every tool including PSI-aware ones is built on.',
            'Mấy cột delta chính là toàn bộ câu trả lời. Mọi trường trong <code>/proc/stat</code> là một TỔNG kể từ lúc khởi động, tính theo đơn vị 1/100 giây, nên một lần đọc chẳng nói lên điều gì cả — những con số ấy chỉ trở thành một TỐC ĐỘ khi bạn lấy hai cái trừ đi nhau rồi chia cho khoảng thời gian. Phần bận là tổng trừ idle rồi chia cho tổng, và các bộ đếm cộng gộp trên MỌI CPU, và đó là lý do hai nhân bận trên mười nhân đọc ra 19,9% chứ không phải 100%. Đây là sai lầm người ta mắc khi viết script giám sát đầu tiên: đọc <code>/proc/diskstats</code>, thấy một con số to, rồi báo nó như một tốc độ. Nó là một TỔNG. Và cái khoảng thời gian cũng phải được ĐO chứ không phải giả định, vì <code>sleep 1</code> không ngủ đúng một giây. Nửa sau là lý do load average là công cụ SAI cho một sự cố chứ không phải một công cụ hỏng: nó là một trung bình động với hằng số thời gian 1, 5 và 15 phút, nên nó là con số tốt cho câu "hôm qua có bận hơn hôm nay không" và vô dụng với câu "ngay bây giờ có gì đang hỏng không" — một cái máy có thể đang bão hoà hoàn toàn trong khi con số một phút vẫn gần bằng không, vì một trung bình động, theo cấu tạo, là một mô tả về quá khứ. Phương án 4 gọi tên một thứ có thật — PSI trong <code>/proc/pressure/*</code> gần với câu "tài nguyên này có đang làm tôi đau không" hơn mọi thứ khác đang có — nhưng gọi <code>/proc/stat</code> là giao diện cũ thì sai, và chính phép tính ở trên là thứ mà mọi công cụ, kể cả những công cụ biết dùng PSI, được dựng lên trên đó.',
          ),
        }),

        // q43 · đáp án 3
        mcq({
          prompt: B(
            'The same four <code>/proc</code> files read 300 times, two ways. Measured:' +
            code('  cat /proc/stat  300 lan : 0.4340 ms/lan\n' +
                 '  doc trong tien trinh    : 0.0103 ms/lan') +
            'What is the 42-fold difference, and what does it imply for a monitoring loop on a small VPS?',
            'Cùng bốn tệp trong <code>/proc</code> đọc 300 lần, theo hai cách. Đo thật:' +
            code('  cat /proc/stat  300 lan : 0.4340 ms/lan\n' +
                 '  doc trong tien trinh    : 0.0103 ms/lan') +
            'Chênh lệch 42 lần đó là cái gì, và nó hàm ý gì với một vòng lặp giám sát trên một VPS nhỏ?',
          ),
          options: [
            B(
              'The difference is the kernel formatting the file twice — once for <code>cat</code> and once for the reader — so it grows with file size and disappears on <code>/proc/loadavg</code>, which is why only large <code>/proc</code> files should be read in-process',
              'Chênh lệch đó là việc nhân định dạng cái tệp hai lần — một lần cho <code>cat</code> và một lần cho kẻ đọc — nên nó tăng theo kích thước tệp và biến mất với <code>/proc/loadavg</code>, và đó là lý do chỉ nên đọc trong-tiến-trình với những tệp <code>/proc</code> lớn',
            ),
            B(
              'It is disk I/O: <code>cat</code> opens the file through the normal VFS path while an in-process read is served from the page cache, so the gap closes entirely once the file has been read a few times and the cache is warm',
              'Đó là vào-ra đĩa: <code>cat</code> mở tệp qua đường VFS thông thường còn một lần đọc trong tiến trình thì được phục vụ từ page cache, nên khoảng cách đóng lại hoàn toàn một khi tệp đã được đọc vài lần và bộ đệm đã ấm',
            ),
            B(
              'It is measurement error at this scale: 0.4 ms is close to the resolution of the shell\'s own timing, so the two figures are the same number reported by two tools with different overheads and neither should drive a design decision',
              'Đó là sai số phép đo ở cỡ này: 0,4 ms xấp xỉ độ phân giải của chính bộ đếm thời gian trong shell, nên hai con số ấy là cùng một con số do hai công cụ có mức tốn khác nhau báo lại, và không con số nào đáng để dẫn tới một quyết định thiết kế',
            ),
            B(
              'It is <code>fork</code> and <code>exec</code>: reading the file is essentially free and spawning a process to do it is not, so a shell loop that spawns a dozen processes every few seconds spends more effort on the measurement than on anything it measures — read the files from one long-lived process instead',
              'Đó là <code>fork</code> và <code>exec</code>: đọc cái tệp thì gần như miễn phí còn đẻ ra một tiến trình để làm việc đó thì không, nên một vòng lặp shell đẻ cả tá tiến trình mỗi vài giây sẽ tốn công cho PHÉP ĐO nhiều hơn cho thứ nó đo — hãy đọc các tệp ấy từ MỘT tiến trình sống lâu',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Reading a <code>/proc</code> file costs about ten microseconds; <code>cat</code>ting it costs about four hundred, and essentially all of the difference is process creation — <code>fork</code>, <code>exec</code>, dynamic linking, teardown. The file size is irrelevant, which is why option 1 is wrong: all four files measured showed the same ratio. The practical consequence is that a monitoring loop written the obvious shell way — a handful of <code>cat</code>, <code>grep</code>, <code>awk</code> and <code>df</code> invocations every five seconds — becomes a background load of its own, and on a 1 GB VPS that load competes with the thing it is watching. The honest guidance for a small server follows from this and from Chapter 8: a Prometheus server plus Grafana <em>on the box you are monitoring</em> is a memory-hungry way to guarantee your monitoring is one of the largest processes on the machine, and therefore the OOM killer\'s preferred victim at exactly the moment it becomes interesting. Either run a small exporter and scrape it from somewhere else, or write twenty lines that read <code>/proc</code> from one long-lived process, append a line to a file, and let a cron job look at the trend. For one small server the second option is genuinely enough — and it is the same file that then answers "was p95 worse this hour than the same hour last week".',
            'Đọc một tệp trong <code>/proc</code> tốn cỡ mười micro giây; <code>cat</code> nó ra thì tốn cỡ bốn trăm, và gần như toàn bộ chênh lệch là việc TẠO TIẾN TRÌNH — <code>fork</code>, <code>exec</code>, liên kết động, rồi dọn dẹp. Kích thước tệp không liên quan, và đó là lý do phương án 1 sai: cả bốn tệp được đo đều cho ra cùng một tỷ lệ. Hệ quả thực tế là một vòng lặp giám sát viết theo lối shell hiển nhiên — dăm bảy lời gọi <code>cat</code>, <code>grep</code>, <code>awk</code> và <code>df</code> mỗi năm giây — trở thành một tải nền của chính nó, và trên một VPS 1 GB thì cái tải đó cạnh tranh với đúng thứ mà nó đang canh. Lời khuyên thật thà cho một máy chủ nhỏ rơi ra từ đây và từ Chương 8: một máy chủ Prometheus cộng Grafana đặt NGAY TRÊN cái máy bạn đang giám sát là một cách ngốn bộ nhớ để bảo đảm rằng bộ giám sát của bạn là một trong những tiến trình lớn nhất trên máy, và vì thế là nạn nhân ưa thích của OOM killer đúng vào lúc nó trở nên thú vị. Hoặc chạy một bộ xuất chỉ số nhỏ rồi quét nó từ chỗ khác, hoặc viết hai mươi dòng đọc <code>/proc</code> từ một tiến trình sống lâu, nối thêm một dòng vào một tệp, rồi để một job cron nhìn vào xu hướng. Với một máy chủ nhỏ thì lựa chọn thứ hai thật sự là đủ — và chính cái tệp đó về sau sẽ trả lời được câu "giờ này tuần trước p95 có tệ hơn giờ này tuần này không".',
          ),
        }),

        // q44 · đáp án 1
        mcq({
          prompt: B(
            '200 real HTTP requests through a service with a slow tail. Measured with <code>curl</code>:' +
            code('  n = 200 request\n' +
                 '  trung binh :     59.5 ms   ← con so tren bang dieu khien\n' +
                 '  p50        :     14.6 ms\n' +
                 '  p90        :     17.0 ms\n' +
                 '  p95        :     25.0 ms\n' +
                 '  p99        :    906.6 ms\n' +
                 '  max        :    915.1 ms\n' +
                 '  so request > 500 ms: 10 (5%)') +
            'Two servers report p95 = 100 ms and p95 = 300 ms. What is the fleet p95?',
            '200 request HTTP thật qua một dịch vụ có cái đuôi chậm. Đo bằng <code>curl</code>:' +
            code('  n = 200 request\n' +
                 '  trung binh :     59.5 ms   ← con so tren bang dieu khien\n' +
                 '  p50        :     14.6 ms\n' +
                 '  p90        :     17.0 ms\n' +
                 '  p95        :     25.0 ms\n' +
                 '  p99        :    906.6 ms\n' +
                 '  max        :    915.1 ms\n' +
                 '  so request > 500 ms: 10 (5%)') +
            'Hai máy chủ báo p95 = 100 ms và p95 = 300 ms. Vậy p95 của cả cụm là bao nhiêu?',
          ),
          options: [
            B(
              '200 ms, provided the two servers carry equal traffic; with unequal traffic the correct figure is the request-count-weighted mean of the two values',
              '200 ms, với điều kiện hai máy chủ gánh lưu lượng bằng nhau; nếu lưu lượng lệch nhau thì con số đúng là trung bình có trọng số theo SỐ REQUEST của hai giá trị đó',
            ),
            B(
              'Unanswerable from those two numbers: a percentile is a property of a distribution, not a quantity you can combine arithmetically, which is why real metric systems ship histogram buckets rather than pre-computed percentiles',
              'Không trả lời được từ hai con số đó: một PHÂN VỊ là TÍNH CHẤT của một phân bố, không phải một đại lượng gộp lại được bằng số học, và đó là lý do các hệ đo chỉ số thật gửi đi các XÔ HISTOGRAM chứ không phải các phân vị đã tính sẵn',
            ),
            B(
              '300 ms, because a percentile over a union is bounded below by the maximum of the parts, and taking the worse of the two is the standard conservative summary',
              '300 ms, vì một phân vị trên hợp của hai tập bị chặn dưới bởi giá trị lớn nhất của các phần, và lấy cái tệ hơn trong hai cái là cách tóm tắt thận trọng chuẩn mực',
            ),
            B(
              'Somewhere between 100 and 300 ms, and the mean of the two is the best available estimate — which is exactly why dashboards display it and why the practice is standard despite being approximate',
              'Đâu đó giữa 100 và 300 ms, và trung bình của hai cái là ước lượng tốt nhất hiện có — và đó chính là lý do các bảng điều khiển hiển thị nó và vì sao cách làm ấy là chuẩn mực dù chỉ là xấp xỉ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Nobody waited 59.5 ms. Half the users got 14.6 ms — four times better than the mean — and one in twenty got over 900 ms, fifteen times worse. The mean sits in a gap between two populations and describes neither, and it is <em>reassuring</em>, which is the dangerous part: 59.5 ms looks like a healthy API. The percentiles make the shape obvious: the step from p95 (25.0 ms) to p99 (906.6 ms) is 36×, and a cliff like that is the signature of a bimodal distribution — two different code paths, not one path with variance. The averaging question is separate and just as important, because every dashboard invites the mistake. A percentile is defined by an ordering of the underlying observations; the mean of two p95 values corresponds to no percentile of the combined data, and can be arbitrarily far from the true one depending on the shapes. That is why histograms are shipped and percentiles computed at query time. Two reasons the tail matters more than 5% suggests. A page view is not one request: if loading a page makes twenty backend calls each with a 5% chance of being slow, the chance all twenty are fast is 0.95²⁰ ≈ 36%, so a "5% tail" is a majority experience at the page level. And slow requests hold resources — ten requests at 900 ms occupy connections and worker slots for as long as 600 at 15 ms — which is how a tail fills a connection pool and becomes an outage without the mean moving much at all.',
            'Không ai chờ 59,5 ms cả. Một nửa số người dùng nhận 14,6 ms — tốt gấp bốn lần con số trung bình — và một phần hai mươi nhận hơn 900 ms, tệ gấp mười lăm lần. Trung bình ngồi trong cái khe giữa hai đám và không mô tả đám nào, và nó lại còn NGHE RẤT YÊN TÂM, đó mới là phần nguy hiểm: 59,5 ms trông như một API khoẻ mạnh. Các phân vị làm cho hình dạng hiện ra rõ ràng: bước nhảy từ p95 (25,0 ms) lên p99 (906,6 ms) là 36 lần, và một cái vách như thế là chữ ký của một phân bố HAI ĐỈNH — hai đường mã khác nhau, chứ không phải một đường có độ tản. Câu hỏi về việc lấy trung bình là chuyện riêng và cũng quan trọng ngang thế, vì mọi bảng điều khiển đều mời gọi sai lầm ấy. Một phân vị được định nghĩa bởi một thứ tự sắp xếp của các quan sát nền; trung bình của hai giá trị p95 không tương ứng với phân vị nào của dữ liệu gộp, và có thể cách con số thật xa tuỳ ý, tuỳ vào hình dạng hai phân bố. Đó là lý do người ta gửi đi HISTOGRAM và tính phân vị lúc truy vấn. Hai lý do khiến cái đuôi quan trọng hơn con số 5% gợi ra. Một lượt xem trang không phải một request: nếu tải một trang gọi hai mươi lời gọi backend mà mỗi cái có 5% khả năng chậm, thì xác suất cả hai mươi đều nhanh là 0,95²⁰ ≈ 36%, nên một "cái đuôi 5%" ở mức request lại là trải nghiệm của ĐA SỐ ở mức trang. Và các request chậm thì GIỮ tài nguyên — mười request 900 ms chiếm kết nối và ô công nhân lâu bằng 600 request 15 ms — và đó là cách một cái đuôi làm đầy hồ kết nối rồi trở thành một sự cố mà con số trung bình gần như chẳng nhúc nhích.',
          ),
        }),

        // q45 · đáp án 0
        mcq({
          prompt: B(
            'An application on 3391 answers everything correctly. nginx on 3390 has two location blocks and one of them points at a port nobody is listening on. Measured:' +
            code('  location /health { proxy_pass http://127.0.0.1:3391; }   # dung\n' +
                 '  location /       { proxy_pass http://127.0.0.1:3399; }   # CONG SAI — trang chu\n\n' +
                 '=== kiem TU BEN TRONG (thang ung dung) ===\n' +
                 '  127.0.0.1:3391/health   → 200  0.000856s\n' +
                 '  127.0.0.1:3391/         → 200  0.000690s\n' +
                 '=== kiem TU BEN NGOAI (qua nginx, dung duong nguoi dung di) ===\n' +
                 '  127.0.0.1:3390/health   → 200  0.000812s\n' +
                 '  127.0.0.1:3390/         → 502  0.000240s') +
            'The check goes through the real proxy on the real port and is green. What does that prove about health checks?',
            'Một ứng dụng trên cổng 3391 trả lời mọi thứ đúng. nginx trên 3390 có hai khối location và một trong hai trỏ vào cổng chẳng ai lắng nghe. Đo thật:' +
            code('  location /health { proxy_pass http://127.0.0.1:3391; }   # dung\n' +
                 '  location /       { proxy_pass http://127.0.0.1:3399; }   # CONG SAI — trang chu\n\n' +
                 '=== kiem TU BEN TRONG (thang ung dung) ===\n' +
                 '  127.0.0.1:3391/health   → 200  0.000856s\n' +
                 '  127.0.0.1:3391/         → 200  0.000690s\n' +
                 '=== kiem TU BEN NGOAI (qua nginx, dung duong nguoi dung di) ===\n' +
                 '  127.0.0.1:3390/health   → 200  0.000812s\n' +
                 '  127.0.0.1:3390/         → 502  0.000240s') +
            'Phép kiểm đi qua đúng proxy trên đúng cổng và vẫn XANH. Điều đó chứng minh gì về các chốt kiểm sức khoẻ?',
          ),
          options: [
            B(
              'That a check only proves the exact path it exercises works: the check and the failure lived in different location blocks, so no amount of checking harder on <code>/health</code> finds it — the external check has to request a real page, inspect its <em>content</em>, use the real hostname, and run from another machine',
              'Rằng một phép kiểm chỉ chứng minh ĐÚNG cái đường nó đi qua là chạy được: phép kiểm và cú hỏng sống ở hai khối location KHÁC NHAU, nên kiểm <code>/health</code> kỹ tới đâu cũng không tìm ra — phép kiểm từ bên ngoài phải xin một TRANG THẬT, soi NỘI DUNG của nó, dùng tên miền thật, và chạy từ một cái máy khác',
            ),
            B(
              'That the check was too shallow and should exercise the database, since a deep health check is what distinguishes a process that is merely alive from one that can actually serve the pages users request',
              'Rằng phép kiểm quá NÔNG và nên đụng tới cơ sở dữ liệu, vì một chốt kiểm sức khoẻ SÂU mới là thứ phân biệt một tiến trình chỉ đang sống với một tiến trình thật sự phục vụ được các trang mà người dùng xin',
            ),
            B(
              'That nginx was misconfigured, which is a deployment problem rather than a monitoring one — no health check can be expected to catch a typo in a configuration file, and config validation belongs in the deploy script instead',
              'Rằng nginx bị cấu hình sai, và đó là vấn đề triển khai chứ không phải giám sát — không thể trông đợi một chốt kiểm sức khoẻ bắt được một cú gõ nhầm trong tệp cấu hình, và việc kiểm cấu hình thuộc về script deploy',
            ),
            B(
              'That the 502 was faster than the 200, so the proxy answered from cache; a health check must therefore send <code>Cache-Control: no-cache</code> to be trusted, and with that header both routes would have reported correctly',
              'Rằng cú 502 nhanh hơn cú 200, nên proxy đã trả lời từ bộ đệm; vì thế một chốt kiểm sức khoẻ phải gửi kèm <code>Cache-Control: no-cache</code> mới đáng tin, và với header đó thì cả hai tuyến đã báo đúng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is worse than the shallow-check case, because everything you would normally suspect is fine: the application really is healthy, the proxy really is running, and that URL really does return 200 through the user-facing port. The failure lives in a location block the check never enters. Making the check deeper does not help — a deep <code>/health</code> would still be routed by the correct block — which is why option 2 misses. The list of things that break between your process and your user, independently of your process, is longer than people expect: a location pointing at the wrong upstream, a TLS certificate that expired (an HTTP check on <code>127.0.0.1</code> never touches TLS and stays green through the whole outage), DNS pointing at an old address, a firewall closing 443, a cache serving a rolled-back version, and the machine losing its network — which is the argument in one line, because a monitor on the machine it monitors cannot report the failures that matter most. So an external check asks for a real page over the real hostname, and greps the body for something only the working page contains: a single-page app whose bundle 404s serves a perfectly valid 200 with an empty root div, and a backend returning <code>{"error":"database unavailable"}</code> with status 200 is invisible to a status-code check. The two checks are not interchangeable: the internal one is shallow, cheap, polled by the supervisor and allowed to restart the process; the external one is content-aware, runs elsewhere, and wakes a human.',
            'Ca này còn tệ hơn ca kiểm-nông, vì mọi thứ bạn thường nghi ngờ đều ổn cả: ứng dụng thật sự khoẻ, proxy thật sự đang chạy, và cái URL ấy thật sự trả 200 qua đúng cổng hướng người dùng. Cú hỏng sống trong một khối location mà phép kiểm không bao giờ bước vào. Làm cho phép kiểm SÂU hơn cũng chẳng ăn thua — một <code>/health</code> sâu thì vẫn được định tuyến bởi đúng cái khối đúng đắn kia — và đó là chỗ phương án 2 trượt. Danh sách những thứ có thể hỏng giữa tiến trình của bạn với người dùng của bạn, một cách độc lập với tiến trình ấy, dài hơn người ta tưởng: một location trỏ nhầm upstream, một chứng chỉ TLS hết hạn (một phép kiểm HTTP vào <code>127.0.0.1</code> chẳng bao giờ chạm tới TLS và cứ xanh suốt cả sự cố), DNS trỏ vào một địa chỉ cũ, một luật tường lửa đóng cổng 443, một bộ đệm đang phục vụ bản đã lùi, và cái máy mất mạng — đó là lập luận gói trong một dòng, vì một bộ giám sát nằm trên chính cái máy nó giám sát thì không báo được những cú hỏng quan trọng nhất. Nên một phép kiểm từ bên ngoài xin một TRANG THẬT qua TÊN MIỀN THẬT, rồi tìm trong thân trang một thứ mà chỉ trang chạy đúng mới có: một ứng dụng một trang mà gói JS của nó trả 404 vẫn phục vụ một cú 200 hoàn toàn hợp lệ với một thẻ div gốc rỗng, và một backend trả <code>{"error":"database unavailable"}</code> kèm trạng thái 200 thì vô hình với một phép kiểm chỉ soi mã trạng thái. Hai phép kiểm ấy KHÔNG thay thế cho nhau: cái bên trong thì nông, rẻ, do trình giám sát dò và được phép khởi động lại tiến trình; cái bên ngoài thì soi nội dung, chạy ở nơi khác, và đánh thức một con người.',
          ),
        }),

        /* ── Chương 10 — sao lưu và phục hồi (3 câu) ──────────────────── */

        // q46 · đáp án 2
        mcq({
          prompt: B(
            'The same 900,000-row database dumped and restored two ways. Measured on PostgreSQL 16.14:' +
            code('  pg_dump -Fp   291 ms   49.538.565 byte\n' +
                 '  pg_dump -Fc   954 ms   13.055.943 byte\n\n' +
                 '  psql -f sl.sql (plain)      : 766 ms\n' +
                 '  pg_restore (custom, 1 luong): 828 ms\n' +
                 '  pg_restore -j4              : 584 ms') +
            'Plain is three times faster to produce. Why is <code>-Fc</code> still the default worth adopting?',
            'Cùng một cơ sở dữ liệu 900.000 dòng, sao lưu và phục hồi theo hai cách. Đo trên PostgreSQL 16.14:' +
            code('  pg_dump -Fp   291 ms   49.538.565 byte\n' +
                 '  pg_dump -Fc   954 ms   13.055.943 byte\n\n' +
                 '  psql -f sl.sql (plain)      : 766 ms\n' +
                 '  pg_restore (custom, 1 luong): 828 ms\n' +
                 '  pg_restore -j4              : 584 ms') +
            'Bản plain nhanh gấp ba khi TẠO ra. Vậy vì sao <code>-Fc</code> vẫn là mặc định đáng chọn?',
          ),
          options: [
            B(
              'Because plain SQL cannot be compressed afterwards without losing the ability to inspect it, so the 3.8-fold size difference is permanent and disk is the binding constraint on a small VPS',
              'Vì SQL thuần không nén lại được sau đó mà vẫn giữ được khả năng đọc soi, nên chênh lệch kích thước 3,8 lần là vĩnh viễn và đĩa mới là ràng buộc quyết định trên một VPS nhỏ',
            ),
            B(
              'Because <code>psql</code> cannot restore into a database that already has objects in it, while <code>pg_restore</code> can merge, which is what makes selective recovery possible at all',
              'Vì <code>psql</code> không phục hồi được vào một cơ sở dữ liệu vốn đã có đối tượng bên trong, còn <code>pg_restore</code> thì trộn được, và đó chính là thứ làm cho việc phục hồi có chọn lọc trở nên khả thi',
            ),
            B(
              'Because nobody waits on a backup and everybody waits on a restore: the custom format has a table of contents, so it restores in parallel (<code>-j4</code> cut 828 ms to 584) and selectively (<code>-t</code> one table into a scratch database), neither of which a single ordered stream of SQL statements can do',
              'Vì chẳng ai chờ một bản SAO LƯU còn ai cũng chờ một cú PHỤC HỒI: định dạng custom có một mục lục, nên nó phục hồi SONG SONG được (<code>-j4</code> kéo 828 ms xuống 584) và CÓ CHỌN LỌC được (<code>-t</code> lấy một bảng vào một cơ sở dữ liệu nháp), hai thứ mà một dòng chảy SQL có thứ tự thì không làm nổi',
            ),
            B(
              'Because the plain format stores no checksums, so a truncated plain dump is undetectable, while the custom format verifies its own integrity on restore and refuses a damaged archive outright',
              'Vì định dạng plain không lưu mã kiểm tra nào, nên một bản plain bị cắt cụt là không phát hiện được, còn định dạng custom thì tự kiểm toàn vẹn lúc phục hồi và từ chối thẳng một kho lưu bị hỏng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Backup time is a number nobody is waiting on; restore time is a number somebody is waiting on with the site down. Plain SQL is one ordered stream of statements that has to be executed in order, so there is nothing to parallelise — <code>-j</code> works only on custom and directory formats, and here it took a third off. The table of contents buys more than speed: the most common real recovery is not "the server burned down", it is "somebody ran a DELETE without a WHERE at 14:20", and what you want then is <em>one table as of this morning, next to the current one</em> — <code>pg_restore -d cuu -t don sao-luu.dump</code> into a scratch database, compare, copy back only what is needed. With a plain dump the equivalent is grepping a 49 MB text file for the right <code>COPY</code> block. Keep a plain dump too if you like reading them; the one your restore procedure points at should be the custom one. Two related facts: compressing plain afterwards reaches the same size and costs more in total (291 + gzip against 954), so let <code>pg_dump</code> do it; and <code>--list</code> on a custom archive is <em>not</em> an integrity check, which is why option 4 is wrong in exactly the direction that gets people hurt. Finally, never restore over the live database — restore into a new one, look at it, and copy across only what you need, because a restore run directly over production replaces every row written since the backup with nothing.',
            'Thời gian SAO LƯU là con số chẳng ai đang chờ; thời gian PHỤC HỒI là con số có người đang chờ trong lúc website đang chết. SQL thuần là một dòng chảy các câu lệnh có thứ tự và buộc phải thực thi theo thứ tự, nên chẳng có gì để mà song song hoá — <code>-j</code> chỉ chạy với định dạng custom và directory, và ở đây nó cắt đi một phần ba. Cái mục lục mua được nhiều hơn là tốc độ: cuộc phục hồi thật phổ biến nhất không phải "máy chủ cháy rụi", mà là "có người chạy một lệnh DELETE thiếu WHERE lúc 14:20", và thứ bạn cần khi ấy là <em>một cái bảng ở trạng thái sáng nay, đặt cạnh cái bảng hiện tại</em> — <code>pg_restore -d cuu -t don sao-luu.dump</code> vào một cơ sở dữ liệu nháp, đối chiếu, rồi chép ngược lại đúng phần cần. Với một bản dump thuần thì việc tương đương là đi grep một tệp văn bản 49 MB để tìm đúng khối <code>COPY</code>. Cứ giữ thêm một bản plain nếu bạn thích đọc chúng; nhưng cái mà quy trình phục hồi của bạn TRỎ VÀO thì nên là bản custom. Hai sự thật liên quan: nén bản plain lại sau đó thì ra cùng kích thước mà tốn tổng cộng nhiều hơn (291 cộng thời gian gzip so với 954), nên hãy để <code>pg_dump</code> tự làm; và <code>--list</code> trên một kho custom KHÔNG phải một phép kiểm toàn vẹn, và đó là lý do phương án 4 sai đúng theo cái chiều làm người ta bị thương. Cuối cùng, đừng bao giờ phục hồi ĐÈ lên cơ sở dữ liệu đang sống — hãy phục hồi vào một cái mới, nhìn nó, rồi chỉ chép sang thứ bạn cần, vì một cú phục hồi chạy thẳng đè lên production sẽ thay mọi dòng đã ghi từ sau bản sao lưu bằng hư không.',
          ),
        }),

        // q47 · đáp án 3
        mcq({
          prompt: B(
            'A dump file is truncated (a full disk, an interrupted upload, a sync that copied a file still being written). Measured:' +
            code('$ psql -d ph1 -f sl-cut.sql            ma thoat: 0\n' +
                 '  loi cuoi: ERROR:  missing data for column "email"\n' +
                 '  goc:  lon=400000  kh=200000  bf=300000\n' +
                 '  ph1:  lon=0       kh=0       bf=300000\n\n' +
                 '$ psql -v ON_ERROR_STOP=1 -f sl-cut.sql   ma thoat: 3\n' +
                 '$ pg_restore --list sl-cut.dump           ma thoat: 0  (41 dong muc luc)\n' +
                 '$ pg_restore -d ph3 sl-cut.dump           ma thoat: 1  end of file') +
            'Which check is the only one that told the truth, and what follows from that?',
            'Một tệp sao lưu bị cắt cụt (đĩa đầy, một lượt tải lên bị ngắt, một lượt đồng bộ chép nhầm tệp đang được ghi dở). Đo thật:' +
            code('$ psql -d ph1 -f sl-cut.sql            ma thoat: 0\n' +
                 '  loi cuoi: ERROR:  missing data for column "email"\n' +
                 '  goc:  lon=400000  kh=200000  bf=300000\n' +
                 '  ph1:  lon=0       kh=0       bf=300000\n\n' +
                 '$ psql -v ON_ERROR_STOP=1 -f sl-cut.sql   ma thoat: 3\n' +
                 '$ pg_restore --list sl-cut.dump           ma thoat: 0  (41 dong muc luc)\n' +
                 '$ pg_restore -d ph3 sl-cut.dump           ma thoat: 1  end of file') +
            'Phép kiểm nào là phép DUY NHẤT nói thật, và từ đó suy ra điều gì?',
          ),
          options: [
            B(
              '<code>pg_restore</code>, whose exit code 1 detected the truncation; adding <code>--exit-on-error</code> to every restore is therefore the complete fix, since a format that can detect damage makes the row comparison redundant',
              '<code>pg_restore</code>, với mã thoát 1 đã phát hiện ra cú cắt cụt; nên thêm <code>--exit-on-error</code> vào mọi lần phục hồi là cách chữa TRỌN VẸN, vì một định dạng phát hiện được hư hỏng thì làm cho phép so số dòng trở nên thừa',
            ),
            B(
              '<code>ON_ERROR_STOP=1</code>, whose exit code 3 is the signal a backup script should act on; once that flag is set everywhere, a backup file that restores without error can be trusted and no further verification is required',
              '<code>ON_ERROR_STOP=1</code>, với mã thoát 3 là tín hiệu mà một script sao lưu nên hành động theo; một khi cờ đó được đặt ở khắp nơi thì một tệp sao lưu phục hồi không lỗi là đáng tin và không cần kiểm chứng gì thêm',
            ),
            B(
              '<code>pg_restore --list</code>, because it read the archive end to end and produced a complete table of contents, which is the cheapest evidence that the file is structurally intact',
              '<code>pg_restore --list</code>, vì nó đọc kho lưu từ đầu tới cuối và cho ra một mục lục đầy đủ, đó là bằng chứng rẻ nhất rằng tệp còn nguyên vẹn về mặt cấu trúc',
            ),
            B(
              'Counting rows against the source. <code>psql</code> exited <b>0</b> having lost 600,000 rows across two tables, and <code>--list</code> exited 0 on a half-missing file because the table of contents sits at the front of the archive — so a backup file is a claim, and only a restore compared against what should be there verifies it',
              'Đếm số DÒNG rồi đối chiếu với nguồn. <code>psql</code> thoát ra <b>0</b> sau khi làm mất 600.000 dòng ở hai bảng, còn <code>--list</code> thoát ra 0 trên một tệp mất một nửa vì cái mục lục nằm ở ĐẦU kho lưu — nên một tệp sao lưu là một LỜI KHẲNG ĐỊNH, và chỉ một cú phục hồi rồi đối chiếu với thứ ĐÁNG LẼ phải có mới kiểm chứng được nó',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Every individual behaviour here is defensible and the combination is a trap. <code>psql</code> by default treats a script as a sequence of independent statements, reports errors and keeps going — right for an interactive session, catastrophic for a restore — so it exited <b>0</b> while <code>lon</code> and <code>kh</code> came back with <em>zero</em> of 400,000 and 200,000 rows, and <code>bf</code> came back complete. Not partially: zero, because the truncated <code>COPY</code> block failed and its transaction rolled back while everything around it committed. <code>--list</code> is the worse trap, because running it feels like a validity check: the table of contents sits at the front of the archive, so reading it succeeds regardless of whether the data behind it survived, and you get a clean listing of tables that are not there. <code>ON_ERROR_STOP=1</code> and <code>pg_restore</code>\'s own exit 1 are genuine improvements and neither is sufficient — note that <code>pg_restore</code> detected the damage <em>and still left a partial database behind</em>. The only signal that cannot be fooled is counting rows against the source, and the verification script has to enumerate tables <em>from the source</em>: enumerating from the restored copy silently skips a table that is missing entirely and reports success because everything it found matched. Two extras worth carrying. The other ways this happens do not involve a full disk at all — an interrupted network copy, a cloud sync that uploaded a file still being written, or a dump taken with the wrong <code>PGDATABASE</code>, which is complete, valid, restorable and of the wrong database. And alert on the <em>absence</em> of a successful verification, because every check here fires on failure and nothing fires when the cron job stops running altogether.',
            'Từng hành vi riêng lẻ ở đây đều bào chữa được, còn tổ hợp của chúng là một cái bẫy. <code>psql</code> theo mặc định coi một script là một chuỗi các câu lệnh ĐỘC LẬP, báo lỗi rồi đi tiếp — đúng với một phiên tương tác, thảm hoạ với một cú phục hồi — nên nó thoát ra <b>0</b> trong khi <code>lon</code> và <code>kh</code> quay về với KHÔNG trên 400.000 và 200.000 dòng, còn <code>bf</code> thì về đủ. Không phải một phần: KHÔNG, vì khối <code>COPY</code> bị cắt cụt hỏng và giao dịch của nó lùi lại trong khi mọi thứ quanh nó đã commit. <code>--list</code> mới là cái bẫy tệ hơn, vì chạy nó CẢM GIÁC như một phép kiểm tính hợp lệ: mục lục nằm ở ĐẦU kho lưu, nên đọc nó thành công bất kể phần dữ liệu phía sau còn sống hay không, và bạn nhận được một danh sách sạch sẽ của những cái bảng không có ở đó. <code>ON_ERROR_STOP=1</code> và mã thoát 1 của chính <code>pg_restore</code> là những cải thiện THẬT và không cái nào là ĐỦ — hãy để ý rằng <code>pg_restore</code> phát hiện ra hư hỏng MÀ VẪN để lại một cơ sở dữ liệu dở dang. Tín hiệu duy nhất không đánh lừa được là ĐẾM DÒNG rồi đối chiếu với nguồn, và script kiểm chứng phải liệt kê bảng TỪ PHÍA NGUỒN: liệt kê từ bản đã phục hồi sẽ âm thầm bỏ qua một cái bảng mất hẳn rồi báo thành công vì mọi bảng nó tìm thấy đều khớp. Hai thứ thêm đáng mang theo. Những cách khác dẫn tới chuyện này chẳng liên quan gì tới đĩa đầy — một lượt chép qua mạng bị ngắt, một lượt đồng bộ lên đám mây tải lên một tệp đang được ghi dở, hay một bản dump lấy nhầm <code>PGDATABASE</code>, thứ hoàn chỉnh, hợp lệ, phục hồi được, và là của NHẦM cơ sở dữ liệu. Và hãy báo động khi VẮNG MẶT một lượt kiểm chứng thành công, vì mọi phép kiểm ở đây đều nổ khi HỎNG còn chẳng cái nào nổ khi job cron ngừng chạy hẳn.',
          ),
        }),

        // q48 · đáp án 1
        mcq({
          prompt: B(
            'A verified backup is restored onto a freshly built machine. Measured:' +
            code('  so dong nhac toi vai tro trong pg_dump: 1\n' +
                 '    GRANT SELECT ON TABLE public.lon TO ung_dung;\n' +
                 '  so dong "CREATE ROLE" trong pg_dump: 0\n\n' +
                 '  pg_restore ma thoat THAT: 1\n' +
                 '    pg_restore: error: could not execute query: ERROR:  role "ung_dung" does not exist\n' +
                 '    Command was: GRANT SELECT ON TABLE public.lon TO ung_dung;\n' +
                 '  lon = 400000') +
            'All the rows are back and the application cannot log in. What does this reveal about a row-count verification?',
            'Một bản sao lưu đã kiểm chứng được phục hồi lên một cái máy vừa dựng mới. Đo thật:' +
            code('  so dong nhac toi vai tro trong pg_dump: 1\n' +
                 '    GRANT SELECT ON TABLE public.lon TO ung_dung;\n' +
                 '  so dong "CREATE ROLE" trong pg_dump: 0\n\n' +
                 '  pg_restore ma thoat THAT: 1\n' +
                 '    pg_restore: error: could not execute query: ERROR:  role "ung_dung" does not exist\n' +
                 '    Command was: GRANT SELECT ON TABLE public.lon TO ung_dung;\n' +
                 '  lon = 400000') +
            'Mọi dòng đều đã về và ứng dụng thì không đăng nhập được. Chuyện này phơi ra điều gì về một phép kiểm chứng đếm dòng?',
          ),
          options: [
            B(
              'That the row count was taken too early, before <code>pg_restore</code> had finished replaying the grants; comparing counts only after the process exits removes the discrepancy and the check remains sufficient',
              'Rằng số dòng được đếm quá sớm, trước khi <code>pg_restore</code> phát lại xong các lệnh cấp quyền; chỉ so số dòng SAU KHI tiến trình thoát là gỡ được cú lệch đó và phép kiểm vẫn là đủ',
            ),
            B(
              'That it answers a narrower question than the one you have: <code>pg_dump</code> dumps one database while roles live at the cluster level, so it captured the grant and not the role — restore <code>pg_dumpall --roles-only</code> first, and remember that a check counting only rows passes this backup with a clean bill of health',
              'Rằng nó trả lời một câu hỏi HẸP hơn câu bạn thật sự có: <code>pg_dump</code> đổ MỘT cơ sở dữ liệu còn vai trò thì sống ở cấp CỤM, nên nó bắt được lệnh cấp quyền mà không bắt được vai trò — hãy phục hồi <code>pg_dumpall --roles-only</code> TRƯỚC, và hãy nhớ rằng một phép kiểm chỉ đếm dòng sẽ cho bản sao lưu này một giấy chứng nhận sức khoẻ sạch sẽ',
            ),
            B(
              'That <code>pg_restore</code> should always be run with <code>--no-owner --no-privileges</code>, since ownership is a property of the target machine rather than of the backup and reproducing it is what caused the failure',
              'Rằng <code>pg_restore</code> phải luôn chạy kèm <code>--no-owner --no-privileges</code>, vì quyền sở hữu là tính chất của MÁY ĐÍCH chứ không phải của bản sao lưu và việc tái tạo nó chính là thứ gây ra cú hỏng',
            ),
            B(
              'That the backup itself is damaged: an archive whose grants reference a role it does not define is internally inconsistent, and the correct response is to take a fresh dump rather than to patch the restore procedure',
              'Rằng chính bản sao lưu bị hỏng: một kho lưu mà các lệnh cấp quyền tham chiếu tới một vai trò nó không định nghĩa là thứ tự mâu thuẫn bên trong, và phản ứng đúng là lấy một bản dump mới chứ không phải vá quy trình phục hồi',
            ),
          ],
          correct: 1,
          explanation: EX(
            '<code>pg_dump</code> dumps one database; roles are cluster-level objects that live above any single database, so they are out of scope by design rather than by omission — which is why option 4 is wrong to call the archive damaged. The consequence is precise and easy to miss: all 400,000 rows restored perfectly and the permission did not, so the data is fine and the application cannot connect. Read the wording of the second error line too — <em>errors ignored on restore</em>: <code>pg_restore</code> continued past the failure, which means the verification script from the previous lesson, the one that restores and compares row counts, passes this backup with a clean bill of health. That is the real lesson: row counts answer "did the data come back", and the question you actually have is "can I rebuild the service". The fix is one more file, restored first: <code>pg_dumpall --roles-only &gt; vai-tro.sql</code>. Two cautions come with it. That file contains every role\'s SCRAM verifier in plain text — not the password, but the material an offline attack works against — so it is a secret under the same rules as anything in Chapter 4, and a great many people back roles up into a git repository because it is "just schema". And the list of things outside the dump is longer still: uploaded files (the database holds a path, the bytes live elsewhere), the <code>.env</code> that Chapter 4 deliberately placed outside every deploy, TLS certificates, DNS, cron jobs, systemd units, nginx config, firewall rules, and webhook URLs registered with third parties that all point at a machine that no longer exists. State gets backed up; configuration belongs in git.',
            '<code>pg_dump</code> đổ MỘT cơ sở dữ liệu; vai trò là đối tượng cấp CỤM sống ở trên mọi cơ sở dữ liệu đơn lẻ, nên chúng nằm ngoài phạm vi theo THIẾT KẾ chứ không phải do bỏ sót — và đó là lý do phương án 4 sai khi gọi cái kho lưu ấy là hỏng. Hệ quả thì chính xác và dễ trượt: cả 400.000 dòng phục hồi hoàn hảo còn cái QUYỀN thì không, nên dữ liệu ổn cả mà ứng dụng thì không kết nối nổi. Hãy đọc cả cách diễn đạt của dòng lỗi thứ hai — <em>errors ignored on restore</em>: <code>pg_restore</code> đi tiếp qua cú hỏng, nghĩa là cái script kiểm chứng ở bài trước, cái phục hồi rồi so số dòng, sẽ cho bản sao lưu này một giấy chứng nhận sức khoẻ sạch sẽ. Đó mới là bài học thật: đếm dòng trả lời câu "dữ liệu có về không", còn câu hỏi bạn THẬT SỰ có là "tôi dựng lại được dịch vụ không". Cách chữa là thêm một tệp nữa, và phục hồi nó TRƯỚC: <code>pg_dumpall --roles-only &gt; vai-tro.sql</code>. Kèm theo đó là hai lời dặn. Tệp ấy chứa bộ xác minh SCRAM của MỌI vai trò dưới dạng văn bản thuần — không phải mật khẩu, nhưng là thứ vật liệu mà một cuộc tấn công ngoại tuyến nhắm vào — nên nó là một BÍ MẬT chịu đúng những luật ở Chương 4, và rất nhiều người sao lưu vai trò vào một kho git vì nghĩ "chỉ là lược đồ thôi mà". Và cái danh sách những thứ NẰM NGOÀI bản dump còn dài hơn nữa: tệp người dùng tải lên (cơ sở dữ liệu giữ một đường dẫn, còn các byte thì sống ở chỗ khác), cái <code>.env</code> mà Chương 4 cố ý đặt ra ngoài mọi lần deploy, chứng chỉ TLS, DNS, các job cron, các unit systemd, cấu hình nginx, luật tường lửa, và những URL webhook đã đăng ký với bên thứ ba mà tất cả đều trỏ vào một cái máy không còn tồn tại. TRẠNG THÁI thì đem sao lưu; CẤU HÌNH thì thuộc về git.',
          ),
        }),

        /* ── Chương 11 — chẩn đoán (2 câu) ────────────────────────────── */

        // q49 · đáp án 1
        mcq({
          prompt: B(
            'Four deliberately different failures behind one nginx with <code>proxy_read_timeout 2s</code>. Measured:' +
            code('  /       → ma=404  0.000980s\n' +
                 '  /loi    → ma=500  0.001064s\n' +
                 '  /chet   → ma=502  0.000323s\n' +
                 '  /cham   → ma=504  2.012489s\n\n' +
                 '[error] connect() failed (111: Connection refused) while connecting to upstream …\n' +
                 '[error] upstream timed out (110: Connection timed out) while reading response header …') +
            'What do the durations tell you that the status codes alone do not?',
            'Bốn cú hỏng cố ý khác nhau nằm sau cùng một nginx có <code>proxy_read_timeout 2s</code>. Đo thật:' +
            code('  /       → ma=404  0.000980s\n' +
                 '  /loi    → ma=500  0.001064s\n' +
                 '  /chet   → ma=502  0.000323s\n' +
                 '  /cham   → ma=504  2.012489s\n\n' +
                 '[error] connect() failed (111: Connection refused) while connecting to upstream …\n' +
                 '[error] upstream timed out (110: Connection timed out) while reading response header …') +
            'Các con số THỜI GIAN nói cho bạn điều gì mà riêng mã trạng thái thì không?',
          ),
          options: [
            B(
              'That the 502 was served from cache, since 0.33 ms is faster than any network round trip; the other three reached the upstream and only the cached one did not, which is why it is the odd row out',
              'Rằng cú 502 được phục vụ từ bộ đệm, vì 0,33 ms nhanh hơn mọi lượt đi-về qua mạng; ba cú kia đều tới được upstream và chỉ cú được đệm là không, và đó là lý do nó là dòng lạc loài',
            ),
            B(
              'That a 502 in a third of a millisecond is a refused connection — nothing was attempted, so nothing is listening on the upstream port — while a 504 landing on exactly the configured timeout means the connection was accepted and the upstream then said nothing; a number matching a timeout you set is never a coincidence',
              'Rằng một cú 502 trong một phần ba mili giây là một kết nối BỊ TỪ CHỐI — chẳng có gì được thử cả, nên chẳng ai đang lắng nghe ở cổng upstream — còn một cú 504 rơi ĐÚNG vào hạn giờ đã cấu hình thì nghĩa là kết nối ĐÃ được chấp nhận rồi upstream im lặng; một con số trùng khớp với một hạn giờ bạn tự đặt thì không bao giờ là trùng hợp',
            ),
            B(
              'That the application is CPU-bound: three of the four responses arrived in around a millisecond, which is the scheduling quantum, so the 504 is the only one that actually did work and the others were queued',
              'Rằng ứng dụng đang nghẽn CPU: ba trong bốn response về trong khoảng một mili giây, tức đúng lượng tử xếp lịch, nên cú 504 là cái duy nhất thật sự làm việc còn ba cái kia thì bị xếp hàng',
            ),
            B(
              'That nothing useful can be read from timings at this scale, since all four are dominated by loopback overhead; the error log is the only reliable source and the durations should be ignored during diagnosis',
              'Rằng chẳng đọc được gì hữu ích từ thời gian ở cỡ này, vì cả bốn đều bị chi phối bởi chi phí của giao diện loopback; nhật ký lỗi là nguồn đáng tin duy nhất và nên bỏ qua các con số thời gian khi chẩn đoán',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A status code tells you which layer answered; the duration tells you which layer failed. The 502 came back <em>faster than the working route</em> — 0.33 ms against 0.98 ms — because nothing was attempted at all: the TCP connection was refused instantly, which the error log confirms as <code>connect() failed (111: Connection refused)</code>. That is "nothing is listening on the upstream port", and the next command is <code>ss -ltn</code>. The 504 landed at 2.0125 s against a <code>proxy_read_timeout</code> of 2 s; a number that matches a timeout you configured is never a coincidence, and the log names the other half — <code>ETIMEDOUT</code> while <em>reading the response header</em>, meaning the connection succeeded and the upstream then said nothing. That distinction saves you from restarting a process that was never the problem. The 500 in 1.06 ms means the application received the request, ran code, and chose to return an error: it is alive and it disagrees with you, and the stack trace is in the application log. Two refinements worth carrying. A 502 that takes several <em>seconds</em> is a different failure from a sub-millisecond one — the connection was accepted and then dropped, or the upstream died mid-response, so look at the app rather than the port. And "nothing is listening" and "listening on the wrong address" are indistinguishable from the proxy: both give <code>ECONNREFUSED</code> and a fast 502, and <code>ss -ltn</code> shows the address as well as the port, which is the column to read.',
            'Một mã trạng thái nói cho bạn biết TẦNG NÀO ĐÃ TRẢ LỜI; con số thời gian nói cho bạn biết TẦNG NÀO ĐÃ HỎNG. Cú 502 quay về NHANH HƠN cả tuyến chạy tốt — 0,33 ms so với 0,98 ms — vì chẳng có gì được thử cả: kết nối TCP bị từ chối tức thì, và nhật ký lỗi xác nhận điều đó bằng <code>connect() failed (111: Connection refused)</code>. Đó là "không ai đang lắng nghe ở cổng upstream", và câu lệnh kế tiếp là <code>ss -ltn</code>. Cú 504 rơi vào 2,0125 giây so với một <code>proxy_read_timeout</code> đặt 2 giây; một con số khớp với một hạn giờ do chính bạn cấu hình thì không bao giờ là trùng hợp, và nhật ký gọi tên nửa còn lại — <code>ETIMEDOUT</code> trong lúc ĐANG ĐỌC HEADER của response, nghĩa là kết nối ĐÃ thành công rồi upstream mới im lặng. Chính sự phân biệt ấy cứu bạn khỏi việc khởi động lại một tiến trình chưa từng là vấn đề. Cú 500 trong 1,06 ms nghĩa là ứng dụng đã nhận request, đã chạy mã, và đã CHỌN trả về một lỗi: nó còn sống và nó bất đồng với bạn, còn vết ngăn xếp thì nằm trong nhật ký ứng dụng. Hai điều tinh chỉnh đáng mang theo. Một cú 502 tốn vài GIÂY là một cú hỏng KHÁC với một cú 502 dưới mili giây — kết nối đã được nhận rồi bị bỏ, hoặc upstream chết giữa chừng response, nên hãy nhìn vào ứng dụng chứ đừng nhìn vào cổng. Và "không ai lắng nghe" với "lắng nghe nhầm địa chỉ" thì từ phía proxy nhìn vào là không phân biệt được: cả hai đều cho <code>ECONNREFUSED</code> và một cú 502 nhanh, còn <code>ss -ltn</code> thì hiện ra cả ĐỊA CHỈ lẫn cổng, và đó mới là cột đáng đọc.',
          ),
        }),

        // q50 · đáp án 2
        mcq({
          prompt: B(
            'A deploy reports success and the site is unchanged. Measured on Compose v5.1.4:' +
            code('  container dang chay: v1   imageID=f3ad4a6fc60a\n' +
                 '=== doi MA NGUON thanh v2, roi "up -d --no-build" ===\n' +
                 '  Container thudvps-ungdung-1  Running\n' +
                 '  container van dang chay: v1\n' +
                 '=== dung lai anh (cung the), roi "up -d --no-build" ===\n' +
                 '  imageID moi = f480fee717ce\n' +
                 '  Container thudvps-ungdung-1  Recreated / Starting / Started\n' +
                 '  container gio chay: v2') +
            'Why did the first <code>up -d</code> change nothing, and what does the word <code>Running</code> mean here?',
            'Một lần deploy báo thành công và trang web thì không đổi gì. Đo trên Compose v5.1.4:' +
            code('  container dang chay: v1   imageID=f3ad4a6fc60a\n' +
                 '=== doi MA NGUON thanh v2, roi "up -d --no-build" ===\n' +
                 '  Container thudvps-ungdung-1  Running\n' +
                 '  container van dang chay: v1\n' +
                 '=== dung lai anh (cung the), roi "up -d --no-build" ===\n' +
                 '  imageID moi = f480fee717ce\n' +
                 '  Container thudvps-ungdung-1  Recreated / Starting / Started\n' +
                 '  container gio chay: v2') +
            'Vì sao lần <code>up -d</code> đầu không đổi gì, và chữ <code>Running</code> ở đây nghĩa là gì?',
          ),
          options: [
            B(
              '<code>Running</code> means the container was restarted in place with the new source mounted, and the old code persisted only because the process had not been signalled; adding <code>--force-recreate</code> would have delivered v2 without rebuilding',
              '<code>Running</code> nghĩa là container đã được khởi động lại tại chỗ với mã nguồn mới gắn vào, và mã cũ còn lại chỉ vì tiến trình chưa được gửi tín hiệu; thêm <code>--force-recreate</code> sẽ đưa được v2 vào mà không cần dựng lại',
            ),
            B(
              'The image tag was unchanged, and Compose compares tags rather than image IDs, so any workflow that rebuilds under the same tag hits this; tagging each build with the commit hash is the only reliable fix',
              'Cái tag của ảnh không đổi, mà Compose thì so TAG chứ không so ID ảnh, nên mọi quy trình dựng lại dưới cùng một tag đều dính chuyện này; đánh tag mỗi lần dựng bằng mã băm commit là cách chữa đáng tin duy nhất',
            ),
            B(
              '<code>--no-build</code> skipped the build, so the image ID was unchanged and Compose correctly concluded the container was already up to date — it printed <code>Running</code>, recreated nothing, and the old code kept serving; only when a rebuild produced a new image ID did it recreate',
              '<code>--no-build</code> đã bỏ qua bước dựng, nên ID ảnh không đổi và Compose kết luận ĐÚNG rằng container vốn đã mới nhất — nó in ra <code>Running</code>, không tạo lại gì cả, và mã cũ tiếp tục phục vụ; chỉ khi một lần dựng lại sinh ra một ID ảnh MỚI thì nó mới tạo lại',
            ),
            B(
              'The compose file declared a bind mount for the source, so the new code was already inside the container and the discrepancy was a stale module cache in the running process rather than anything Compose did or did not do',
              'Tệp compose khai một bind mount cho mã nguồn, nên mã mới vốn đã nằm sẵn trong container và cú lệch là do bộ đệm mô-đun cũ trong tiến trình đang chạy chứ không phải do Compose làm hay không làm gì',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Compose recreates a container when something it depends on has changed, and the most important of those inputs is the image ID. <code>--no-build</code> means "do not build", so after editing the source the image on disk was byte-for-byte the one already running: nothing to do, and the honest report is <code>Running</code>. That word is the tell, and it is easy to read as good news in a green deploy log — the two words that mean your code actually shipped are <code>Recreated</code> and <code>Started</code>, which is exactly what the second run printed once a real rebuild produced <code>f480fee717ce</code>. This is the container form of the whole course\'s recurring failure: the deploy reported success and the user is on the old version. It also explains why "<code>--no-build</code> after changing code" is a rule rather than a preference — the container keeps running the old image, and on top of that a shortcut deploy usually skips the smoke test too, so the one check that would have caught it is not run either. The diagnosis is three commands and they generalise beyond Compose: ask the front door what version it is serving, ask the machine what the release pointer resolves to, and ask which process is holding the port. The four answers you can get are a pointer that never moved (the deploy exited before the swap), a new pointer with an old process (nothing was restarted), both new with an old front door (a cache), and nothing at all in the log with exit 0 (the script refused quietly). Option 2 is wrong in a useful direction: Compose does compare image IDs, which is why the rebuild under the <em>same</em> tag did trigger a recreate.',
            'Compose tạo lại một container khi có thứ gì đó mà nó phụ thuộc vào đã đổi, và quan trọng nhất trong đám đầu vào ấy là ID ẢNH. <code>--no-build</code> nghĩa là "đừng dựng", nên sau khi sửa mã nguồn thì cái ảnh trên đĩa vẫn đúng từng byte là cái đang chạy: chẳng có gì để làm, và báo cáo thật thà là <code>Running</code>. Chính chữ đó là dấu hiệu, và nó rất dễ bị đọc thành tin vui trong một nhật ký deploy xanh lè — hai chữ có nghĩa là mã của bạn thật sự đã lên là <code>Recreated</code> và <code>Started</code>, đúng những chữ mà lượt chạy thứ hai in ra khi một lần dựng lại thật sự sinh ra <code>f480fee717ce</code>. Đây là dạng container của cú hỏng lặp đi lặp lại suốt cả khoá học: lần deploy báo thành công còn người dùng thì đang ở bản cũ. Nó cũng giải thích vì sao "<code>--no-build</code> sau khi đổi mã" là một cái LUẬT chứ không phải một sở thích — container tiếp tục chạy ảnh cũ, và bên cạnh đó một lần deploy đi tắt thường bỏ qua luôn cả bộ kiểm khói, nên đúng cái phép kiểm lẽ ra bắt được nó thì cũng không chạy nốt. Việc chẩn đoán gồm ba câu lệnh và chúng tổng quát hoá ra ngoài Compose: hỏi CỬA TRƯỚC xem nó đang phục vụ phiên bản nào, hỏi cái máy xem con trỏ bản phát hành phân giải ra đâu, và hỏi tiến trình nào đang giữ cổng. Bốn câu trả lời có thể nhận được là: một con trỏ chưa hề dời (lần deploy thoát ra trước bước tráo), một con trỏ mới với một tiến trình cũ (chẳng ai khởi động lại), cả hai đều mới mà cửa trước thì cũ (một bộ đệm), và chẳng có gì trong nhật ký kèm mã thoát 0 (script đã lặng lẽ từ chối). Phương án 2 sai theo một hướng hữu ích: Compose CÓ so ID ảnh, và đó chính là lý do lần dựng lại dưới CÙNG một tag vẫn kích hoạt việc tạo lại container.',
          ),
        }),








      ],
    },
  ],
};
