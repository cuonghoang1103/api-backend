/**
 * GitHub Actions — Progress Test 3 (Chương 8 → 11).
 *
 * Đề tự soạn, bám sát `content/courses/github-actions/s08-do.mjs` …
 * `s11-on-thi.mjs`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng
 * thi. PT là đề GIỮA KỲ nên dễ hơn FE một bậc: mỗi câu bám vào MỘT cơ chế.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ MỌI KẾT QUẢ TRONG ĐỀ ĐỀU CHẠY THẬT, KHÔNG ĐOÁN
 * ────────────────────────────────────────────────────────────────────────────
 * Đo 10/09/2026 trên macOS 26.6.2 (darwin-arm64) · Node **v22.21.0** ·
 * GNU bash **3.2.57** (`/bin/bash`). Bộ đồ nghề cài trong một thư mục nháp
 * NGOÀI kho này (không thêm gói nào vào `package.json`):
 * **@actions/expressions 0.3.61**, **js-yaml 4.2.0**, **minimatch 9.0.9** —
 * đúng ba bản mà đề FE của khoá đã dùng.
 *
 * Mọi mã thoát và mọi hành vi của đường ống trong đề này đều chạy thật bằng
 * `/bin/bash` trên máy soạn đề:
 *   • `false` → 1 · `lenh-khong-ton-tai` → **127** · chạy một thư mục → **126**
 *   • `kill -9 $$` → **137** · `-TERM` → **143** · `-INT` → **130** ·
 *     `-ABRT` → **134** — tức đúng 128 + số hiệu tín hiệu
 *   • `false | true` → **0** (mặc định), → **1** khi `set -o pipefail`
 *   • `(exit 3) | (exit 5) | (exit 0)` → **0** mặc định, → **5** với pipefail,
 *     `PIPESTATUS` = `3 5 0`. Tức pipefail trả mã của chặng **KHÔNG-BẰNG-0
 *     NẰM BÊN PHẢI NHẤT**, không phải chặng hỏng ĐẦU TIÊN. Câu 4 và câu 31 dựa
 *     vào phép đo này.
 *
 * ⚠️ **KHÔNG có câu nào bắt nhớ một số đo THỜI GIAN của máy soạn đề.** Máy đang
 * chạy nhiều tác vụ song song. Những con số thời gian trong đề đều là số của
 * GIÁO TRÌNH, in ngay trong câu hỏi để học viên ĐỌC chứ không phải để nhớ.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BỐN CHỖ GIÁO TRÌNH TỰ MÂU THUẪN — ĐỀ KHÔNG HỎI VÀO ĐÓ
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. **Bài 8.2 và bài 11.1 nói NGƯỢC NHAU về việc chạy lại.** Bài 8.2 chứng
 *    minh bằng số học rằng MỘT lần chạy lại không nói lên điều gì: với một bài
 *    test hỏng 20% thì "hỏng rồi qua" là kết cục NHIỀU KHẢ NĂNG NHẤT, và cần
 *    **14 lần xanh liên tiếp** mới tin được 95%. Nhưng cột 2 của bài 11.1 lại
 *    viết "chạy lại một lần để xác nhận; cú hỏng lần hai là thật". Hai chỗ
 *    không nhất quán. Câu 6 neo vào bài 8.2 — chỗ CÓ phép tính — và dùng chính
 *    câu của 11.1 làm một phương án nhiễu.
 *
 * 2. **Bài 8.3 đo trần heap V8 ra 8.240 MB rồi gọi "truyền thuyết 4 GB" là
 *    cũ.** Đề FE đo lại trên máy khác và ra **4.144 MB**. Trần này là hàm của
 *    MÁY (RAM + bản Node), không phải một hằng số của Node — chính bài 8.3 cũng
 *    ghi cấu hình máy đo bên cạnh con số. Đề **không hỏi con số**, chỉ hỏi CƠ
 *    CHẾ (134 = 128 + 6 = SIGABRT, V8 tự gọi `abort()`), và câu 8 hỏi thẳng vì
 *    sao con số ấy không chuyển được sang máy khác.
 *
 * 3. **Mô tả Chương 10 và bài 11.1 đều nói "SÁU sự cố có ngày tháng"** — chương
 *    chỉ có **NĂM** ca (10.1 tới 10.5) và 11.1 cũng chỉ liệt kê năm lớp hỏng.
 *    Đề không hỏi phép đếm này.
 *
 * 4. **Bảng cấu hình runner ở bài 8.3** (Linux 4 nhân/16 GB, Windows 4/16,
 *    macOS 3 nhân/7 GB) — chính bài ghi rõ đây là **TÀI LIỆU, không phải phép
 *    đo** ("khoá này không soi được một runner của GitHub từ bên ngoài"), và
 *    giả thuyết "macOS ít RAM nên nó hỏng ở đó" được nêu là GIẢ THUYẾT. Đề
 *    không hỏi cấu hình runner như một sự thật đã đo.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ HAI CHỖ KHÔNG ĐO ĐƯỢC (nói rõ để không ai tưởng đã kiểm)
 * ────────────────────────────────────────────────────────────────────────────
 *   • `always()`, `success()`, `failure()`, `cancelled()`, `hashFiles()` KHÔNG
 *     nằm trong `@actions/expressions` — chúng do runtime của runner cắm vào,
 *     bộ máy trả `Unrecognized function`. Chỗ nào đề dùng tới chúng thì dựa
 *     trên luật đã tài liệu hoá, và đề nói rõ điều đó.
 *   • `xargs -r` (`--no-run-if-empty`) là cờ của GNU findutils; `xargs` của
 *     BSD/macOS **không có `-r`** (dù nó cũng không chạy lệnh khi đầu vào
 *     rỗng). Câu 22 vì thế hỏi HẬU-ĐIỀU-KIỆN (`lsof -ti:PORT` không in gì) chứ
 *     không hỏi cú pháp một dòng ấy có chạy ở mọi nơi hay không.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Phân bố câu theo chương (tổng 30 trắc nghiệm + 2 lập trình):
 *    Ch 8  — khi CI đỏ ......................... 10   (câu 1–10)
 *    Ch 9  — deploy từ CI ......................  8   (câu 11–18)
 *    Ch 10 — chẩn đoán bằng ca thật ............  8   (câu 19–26)
 *    Ch 11 — cái sống sót qua đo đạc ...........  4   (câu 27–30)
 *    Lập trình: câu 31 (mã thoát, Ch8) · câu 32 (thứ tự deploy, Ch9)
 *
 * Cân vị trí đáp án — 28 câu một đáp án + 2 câu "chọn HAI" = 32 lượt:
 *    A 8 · B 8 · C 8 · D 8
 *    node -e "import('./content/exams/GITHUB-ACTIONS-PT3.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>q.kind==='MCQ').forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/GITHUB-ACTIONS-PT3.mjs --apply
 */
import { B, EX, code, ptInstructions, mcq, codeQ } from './_lib/ghactions-exam-kit.mjs';

export default {
  course: { slug: 'github-actions' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 8–11 (reading a red run, deploying from CI, five dated diagnoses, what survived)',
        'Kiểm tra tiến độ 3 — Chương 8–11 (đọc một lần chạy đỏ, deploy từ CI, năm ca chẩn đoán có ngày tháng, cái sống sót)',
      ),
      description: B(
        'The last third of the GitHub Actions course: exit codes read as evidence, flaky tests settled with arithmetic rather than opinion, reproducing a failure by making your own machine worse, deploying without racing yourself, rollback that actually works, five dated diagnoses from this repository, and the rules that survived measurement. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba cuối của khoá GitHub Actions: đọc mã thoát như đọc bằng chứng, phân xử test chập chờn bằng số học chứ không bằng ý kiến, tái lập một cú hỏng bằng cách làm máy mình TỆ ĐI, deploy mà không tự đua với chính mình, rollback thật sự chạy được, năm ca chẩn đoán có ngày tháng của kho này, và những luật sống sót qua đo đạc. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '8–11'),
      questions: [

        /* ── Chương 8 — khi CI đỏ (10 câu) ─────────────────────────────── */

        // q1 · đáp án C (2)
        mcq({
          prompt: B(
            'Two build jobs fail. One exits <b>134</b>, one exits <b>137</b>. Why does the same fix not work for both?',
            'Hai job dựng cùng hỏng. Một cái thoát <b>134</b>, một cái thoát <b>137</b>. Vì sao cùng một cách chữa không dùng được cho cả hai?',
          ),
          options: [
            B(
              'They are the same failure reported by two different layers — 134 by the process and 137 by the runner — so raising the heap limit fixes both and the difference is cosmetic',
              'Chúng là cùng một cú hỏng do hai tầng khác nhau báo lên — 134 do tiến trình và 137 do runner — nên nâng trần heap chữa được cả hai và khác biệt chỉ là hình thức',
            ),
            B(
              '134 is a disk problem and 137 is a memory problem, so one needs more free space on the runner and the other needs a larger machine',
              '134 là vấn đề đĩa còn 137 là vấn đề bộ nhớ, nên một cái cần thêm chỗ trống trên runner còn cái kia cần một cỗ máy lớn hơn',
            ),
            B(
              '134 is SIGABRT — the process hit a ceiling IT knows about and called <code>abort()</code>, so raising <code>--max-old-space-size</code> is the right lever. 137 is SIGKILL — something OUTSIDE killed it because the machine ran out of real memory, and raising V8\'s ceiling there makes it WORSE',
              '134 là SIGABRT — tiến trình chạm một cái trần mà CHÍNH NÓ biết rồi gọi <code>abort()</code>, nên nâng <code>--max-old-space-size</code> là đúng đòn bẩy. 137 là SIGKILL — thứ BÊN NGOÀI giết nó vì máy cạn bộ nhớ thật, và nâng trần của V8 ở đó làm nó TỆ HƠN',
            ),
            B(
              '134 means the job was cancelled by <code>fail-fast</code> and 137 means it hit <code>timeout-minutes</code>, so neither is a memory problem and the fix is a scheduling change',
              '134 nghĩa là job bị <code>fail-fast</code> huỷ còn 137 nghĩa là nó chạm <code>timeout-minutes</code>, nên không cái nào là vấn đề bộ nhớ và cách chữa là một thay đổi về xếp lịch',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Both are <code>128 + n</code>, so both mean a signal ended the process — but the two signals point in opposite directions. SIGABRT (6) is the process giving up on itself: V8 could not allocate inside its own heap limit and called <code>abort()</code>, which is why the log carries <code>FATAL ERROR: Reached heap limit</code>. SIGKILL (9) comes from outside — the OOM killer, or a container limit — and the process never got to say anything. So 134 says "let me use more", while 137 says "there was no more"; raise V8\'s ceiling on a 137 and it will simply reach further before the kernel kills it again. Reproducing them needs different tools too: <code>node --max-old-space-size=&lt;MB&gt;</code> gives you a 134, and <code>docker run -m 512m</code> gives you a 137.',
            'Cả hai đều là <code>128 + n</code>, nên cả hai đều nghĩa là một tín hiệu đã kết liễu tiến trình — nhưng hai tín hiệu ấy chỉ về hai hướng ngược nhau. SIGABRT (6) là tiến trình tự bỏ cuộc: V8 không cấp phát nổi trong chính cái trần heap của nó và gọi <code>abort()</code>, và đó là lý do log mang dòng <code>FATAL ERROR: Reached heap limit</code>. SIGKILL (9) tới từ bên ngoài — OOM killer, hoặc một giới hạn container — và tiến trình chưa kịp nói gì. Vậy 134 nói "cho tôi dùng thêm", còn 137 nói "chẳng còn gì mà thêm"; nâng trần V8 khi gặp 137 thì nó chỉ với xa hơn một chút trước khi nhân bị giết lại. Tái lập chúng cũng cần hai công cụ khác nhau: <code>node --max-old-space-size=&lt;MB&gt;</code> cho bạn một cú 134, còn <code>docker run -m 512m</code> cho bạn một cú 137.',
          ),
        }),

        // q2 · đáp án A (0)
        mcq({
          prompt: B(
            'A matrix job passes on Linux and Windows and exits <b>139</b> on macOS. The step that fails is <code>npm ci</code> followed by a build. What does 139 point at first?',
            'Một job ma trận qua trên Linux và Windows rồi thoát <b>139</b> trên macOS. Bước hỏng là <code>npm ci</code> rồi tới một bước dựng. 139 chỉ vào đâu trước tiên?',
          ),
          options: [
            B(
              'A segmentation fault — 128 + 11 — which is rare in JavaScript itself, so the strong hypothesis is a NATIVE module whose prebuilt binary does not match this platform',
              'Một lỗi truy cập bộ nhớ — 128 + 11 — mà chuyện đó hiếm trong JavaScript thuần, nên giả thuyết mạnh là một module GỐC có bản nhị phân dựng sẵn không khớp nền tảng này',
            ),
            B(
              'A syntax error in the script — 139 is the code bash uses for a malformed command list — so the script is being parsed differently by the macOS shell',
              'Một lỗi cú pháp trong script — 139 là mã bash dùng cho một danh sách lệnh dị dạng — nên script đang bị shell của macOS phân giải khác đi',
            ),
            B(
              'A network failure during install: 139 is the exit code npm uses when the registry connection drops midway, and macOS runners sit behind a different egress path',
              'Một cú hỏng mạng lúc cài: 139 là mã thoát npm dùng khi kết nối tới registry đứt giữa chừng, và runner macOS nằm sau một đường ra khác',
            ),
            B(
              'The job was cancelled: 139 is what a leg reports when <code>fail-fast</code> stops it, and the other two legs finished before the cancellation reached them',
              'Job bị huỷ: 139 là thứ một nhánh báo về khi <code>fail-fast</code> dừng nó, và hai nhánh kia đã xong trước khi cú huỷ tới nơi',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Read it as <code>128 + n</code> and n is 11, SIGSEGV. Pure JavaScript does not segfault — V8 turns memory trouble into an abort, which is the 134 case — so a segfault almost always comes from compiled code loaded into the process, and the usual reason a native module misbehaves on exactly one leg is that the prebuilt binary it downloaded is for a different platform or architecture. Chapter 2 measured the same class from the other side: a Prisma engine built for glibc inside a musl image produced a container that restarted forever. The general habit is what matters — an exit code names the CLASS of the cause before you open any log, and 126, 127, 134, 137, 139 and 143 each say something different.',
            'Đọc nó là <code>128 + n</code> thì n là 11, tức SIGSEGV. JavaScript thuần thì không segfault — V8 biến chuyện bộ nhớ thành một cú abort, và đó là ca 134 — nên một cú segfault gần như luôn tới từ mã đã biên dịch được nạp vào tiến trình, và lý do thường gặp khiến một module gốc cư xử lạ ở đúng một nhánh là bản nhị phân dựng sẵn nó tải về dành cho một nền tảng hoặc kiến trúc khác. Chương 2 đo cùng lớp lỗi ấy từ phía bên kia: một engine Prisma dựng cho glibc nằm trong một ảnh musl đẻ ra một container restart vô tận. Cái thói quen mới là thứ quan trọng — một mã thoát gọi tên LỚP của nguyên nhân trước khi bạn mở bất kỳ cái log nào, và 126, 127, 134, 137, 139, 143 mỗi cái nói một chuyện khác nhau.',
          ),
        }),

        // q3 · đáp án B (1)
        mcq({
          prompt: B(
            'A step wants to record the exit code of a command that runs through a pipe:' + code(
              'npm run build 2>&1 | tee build.log\n' +
              'echo "da dung xong"\n' +
              'RC=$?\n' +
              'echo "ma thoat: $RC"',
            ) + 'The step reports <code>0</code> even when the build fails. Name BOTH defects.',
            'Một bước muốn ghi lại mã thoát của một câu lệnh chạy qua một đường ống:' + code(
              'npm run build 2>&1 | tee build.log\n' +
              'echo "da dung xong"\n' +
              'RC=$?\n' +
              'echo "ma thoat: $RC"',
            ) + 'Hãy gọi tên CẢ HAI khuyết tật.',
          ),
          options: [
            B(
              '<code>2>&1</code> merges stderr into the pipe so the build\'s error output is lost, and <code>tee</code> buffers the stream so the log file is written after <code>$?</code> is read',
              '<code>2>&1</code> gộp stderr vào đường ống nên đầu ra lỗi của bản dựng bị mất, và <code>tee</code> đệm luồng nên tệp log được ghi sau khi <code>$?</code> đã được đọc',
            ),
            B(
              'The pipe makes <code>$?</code> report <code>tee</code>, which almost always succeeds; and <code>$?</code> is read one line too late — the <code>echo</code> in between replaced it. Fix with <code>set -o pipefail</code> (or <code>${PIPESTATUS[@]}</code>) and by reading <code>$?</code> on the very NEXT line',
              'Đường ống làm <code>$?</code> báo về <code>tee</code>, mà cái đó gần như luôn thành công; và <code>$?</code> bị đọc trễ một dòng — lệnh <code>echo</code> chen giữa đã thay thế nó. Chữa bằng <code>set -o pipefail</code> (hoặc <code>${PIPESTATUS[@]}</code>) và bằng cách đọc <code>$?</code> ở ngay dòng KẾ TIẾP',
            ),
            B(
              'Only one defect: <code>$?</code> is read too late. The pipe is harmless because bash propagates the highest exit code of any stage by default, so <code>tee</code> cannot mask a failure',
              'Chỉ một khuyết tật: <code>$?</code> bị đọc quá trễ. Đường ống thì vô hại vì bash mặc định lan truyền mã thoát cao nhất trong các chặng, nên <code>tee</code> không che được một cú hỏng',
            ),
            B(
              'Only one defect: the pipe. <code>$?</code> survives any number of intervening commands because bash stores the last FAILING status, not the last status',
              'Chỉ một khuyết tật: đường ống. <code>$?</code> sống sót qua bất kỳ số lệnh chen giữa nào vì bash lưu trạng thái HỎNG cuối cùng chứ không lưu trạng thái cuối cùng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Both defects are the same mistake in two costumes: something else answered the question you asked. A pipeline reports the exit code of its LAST stage, and <code>tee</code> succeeds whatever it was fed — that is the trap chapter 8 says has now bitten this course three separate times. And <code>$?</code> holds the status of the command that ran immediately before it, so anything at all in between — an <code>echo</code>, another pipe — overwrites it. Two cures worth having both of: <code>shell: bash</code> adds <code>-o pipefail</code> to the step and is the single most valuable one-line change in most workflow files, and <code>${PIPESTATUS[@]}</code> keeps every stage\'s code by hand when you need them individually.',
            'Cả hai khuyết tật đều là cùng một sai lầm mặc hai bộ đồ: một thứ khác đã trả lời cái câu hỏi bạn hỏi. Một đường ống báo về mã thoát của chặng CUỐI, và <code>tee</code> thì thành công bất kể nó được cho ăn cái gì — đó chính là cái bẫy mà chương 8 nói đã cắn khoá học này ba lần riêng biệt. Còn <code>$?</code> giữ trạng thái của câu lệnh chạy ngay TRƯỚC nó, nên bất cứ thứ gì chen vào giữa — một <code>echo</code>, một cái ống nữa — đều ghi đè lên. Hai cách chữa đáng có cả hai: <code>shell: bash</code> thêm <code>-o pipefail</code> cho bước và là thay đổi một dòng đáng giá nhất trong hầu hết các tệp workflow, còn <code>${PIPESTATUS[@]}</code> giữ lại mã của MỌI chặng bằng tay khi bạn cần từng cái một.',
          ),
        }),

        // q4 · đáp án D (3)
        mcq({
          prompt: B(
            'Measured on GNU bash 3.2.57, three pipelines run with <code>set -o pipefail</code> on:' + code(
              '$ set -o pipefail\n' +
              '$ (exit 3) | (exit 5) | (exit 0) ; echo $?\n' +
              '5\n' +
              '$ (exit 3) | (exit 0) | (exit 4) ; echo $?\n' +
              '4\n' +
              '$ false | (exit 2) | true ; echo $?\n' +
              '2',
            ) + 'What rule does <code>pipefail</code> follow?',
            'Đo trên GNU bash 3.2.57, ba đường ống chạy với <code>set -o pipefail</code> đang bật:' + code(
              '$ set -o pipefail\n' +
              '$ (exit 3) | (exit 5) | (exit 0) ; echo $?\n' +
              '5\n' +
              '$ (exit 3) | (exit 0) | (exit 4) ; echo $?\n' +
              '4\n' +
              '$ false | (exit 2) | true ; echo $?\n' +
              '2',
            ) + '<code>pipefail</code> theo luật nào?',
          ),
          options: [
            B(
              'It returns the LARGEST non-zero code in the pipeline, which is why the first line gives 5 and the second gives 4',
              'Nó trả về mã khác không LỚN NHẤT trong đường ống, và đó là lý do dòng đầu ra 5 còn dòng thứ hai ra 4',
            ),
            B(
              'It returns the code of the FIRST stage that failed, so a failure early in the pipeline always wins over a later one',
              'Nó trả về mã của chặng hỏng ĐẦU TIÊN, nên một cú hỏng sớm trong đường ống luôn thắng một cú hỏng sau',
            ),
            B(
              'It returns 1 whenever any stage failed, and the specific numbers here come from bash 3.2 rather than from <code>pipefail</code> itself',
              'Nó trả về 1 mỗi khi có chặng nào hỏng, còn những con số cụ thể ở đây tới từ bash 3.2 chứ không tới từ chính <code>pipefail</code>',
            ),
            B(
              'It returns the code of the RIGHTMOST stage that exited non-zero — line one gives 5 (not 3), line two gives 4, line three gives 2 — and without it the pipeline would report the last stage and give 0, 4 and 0',
              'Nó trả về mã của chặng khác-không nằm BÊN PHẢI NHẤT — dòng một ra 5 (không phải 3), dòng hai ra 4, dòng ba ra 2 — và nếu không có nó thì đường ống báo về chặng cuối và cho 0, 4, 0',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Line one settles it: the stages exit 3, 5 and 0, and the answer is 5 — not 3, so it is not the first failure, and not the largest by coincidence either, because line two gives 4 where the alternatives were 3 and 4. The rule is positional: the rightmost non-zero. Line three confirms it against a pipeline whose last stage succeeds. This matters because the reason to turn <code>pipefail</code> on is to stop a pipeline from swallowing a failure, and knowing WHICH code survives tells you what your diagnosis will be working from — a 137 that reaches your log through a pipe still reads as 137 under <code>pipefail</code>, and reads as 0 without it. In GitHub Actions you get this by writing <code>shell: bash</code>, which runs <code>bash --noprofile --norc -eo pipefail</code> instead of the default <code>bash -e</code>.',
            'Dòng đầu phân xử luôn: các chặng thoát 3, 5 và 0, và đáp án là 5 — không phải 3, nên nó không phải cú hỏng đầu tiên, mà cũng không phải "lớn nhất" một cách tình cờ, vì dòng hai ra 4 trong khi hai ứng viên là 3 và 4. Luật là theo VỊ TRÍ: khác-không nằm bên phải nhất. Dòng ba xác nhận điều đó trên một đường ống mà chặng cuối thành công. Chuyện này quan trọng vì lý do bật <code>pipefail</code> là để một đường ống thôi nuốt mất một cú hỏng, và biết mã NÀO sống sót là biết phần chẩn đoán của bạn sẽ làm việc trên cái gì — một cú 137 đi tới log qua một đường ống thì dưới <code>pipefail</code> vẫn đọc ra 137, còn không có nó thì đọc ra 0. Trong GitHub Actions bạn có được chuyện đó bằng cách viết <code>shell: bash</code>, thứ chạy <code>bash --noprofile --norc -eo pipefail</code> thay cho mặc định <code>bash -e</code>.',
          ),
        }),

        // q5 · đáp án A (0)
        mcq({
          prompt: B(
            'A test is green when run alone and red when run after another test in the same suite. The team labels it flaky and adds a retry. What is the correct classification?',
            'Một bài test xanh khi chạy một mình và đỏ khi chạy SAU một bài khác trong cùng bộ. Nhóm gắn nhãn nó là chập chờn rồi thêm một lượt thử lại. Phân loại ĐÚNG là gì?',
          ),
          options: [
            B(
              'It is not flaky at all: it is ORDER-DEPENDENT, which is fully deterministic — it has a PRECONDITION, not a failure rate — and it looks random only because the order changes between runs',
              'Nó chẳng chập chờn gì cả: nó PHỤ THUỘC THỨ TỰ, và chuyện đó hoàn toàn có tính quyết định — nó có một ĐIỀU KIỆN TIÊN QUYẾT chứ không có một tỉ lệ hỏng — và nó trông ngẫu nhiên chỉ vì thứ tự thay đổi giữa các lần chạy',
            ),
            B(
              'It is flaky with a rate near 50%, since it passes in one arrangement and fails in the other, and a retry is therefore the appropriate mitigation',
              'Nó chập chờn với tỉ lệ gần 50%, vì nó qua ở một cách sắp xếp và hỏng ở cách kia, nên thêm một lượt thử lại là biện pháp giảm nhẹ hợp lý',
            ),
            B(
              'It is an infrastructure problem: running a test after another one only changes timing, so the failure must come from a slower machine under load',
              'Đó là vấn đề hạ tầng: chạy một test sau một test khác chỉ đổi nhịp thời gian, nên cú hỏng phải tới từ một cỗ máy chậm hơn do đang tải nặng',
            ),
            B(
              'It is a real failure with a 100% rate, because a single green run cannot refute a real failure and the green run alone was therefore a false negative',
              'Đó là một cú hỏng thật với tỉ lệ 100%, vì một lần xanh không bác bỏ nổi một cú hỏng thật nên lần xanh chạy một mình chính là một âm tính giả',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Chapter 8 separates three kinds of failure and this is the one that gets mislabelled most often. A real failure fails 100% of the time, so ONE green run refutes it entirely. A probabilistic flake has a rate, and the rate is a property of the test that you can MEASURE. Order dependence has neither: it fails whenever its precondition is met, which makes it perfectly deterministic and completely invisible to a retry. It looks random because the order moves — a parallel runner, a matrix leg, a directory listing that came back in a different sequence. The diagnosis is one command: run the test on its own. A local loop settles it faster still — fifty runs of one test takes seconds, while fifty CI runs takes an afternoon.',
            'Chương 8 tách ba kiểu hỏng và đây là kiểu bị gắn nhầm nhãn nhiều nhất. Một cú hỏng thật thì hỏng 100% số lần, nên MỘT lần xanh bác bỏ nó hoàn toàn. Một cú chập chờn theo xác suất thì có một tỉ lệ, và tỉ lệ ấy là tính chất của bài test mà bạn ĐO được. Phụ thuộc thứ tự thì không có cái nào trong hai: nó hỏng mỗi khi điều kiện tiên quyết của nó được thoả, điều đó khiến nó hoàn toàn có tính quyết định và hoàn toàn vô hình với một lượt thử lại. Nó trông ngẫu nhiên vì thứ tự dịch chuyển — một bộ chạy song song, một nhánh ma trận, một danh sách thư mục trả về theo trình tự khác. Cách chẩn là MỘT câu lệnh: chạy bài test ấy một mình. Một vòng lặp ở máy còn phân xử nhanh hơn nữa — năm mươi lượt chạy một bài mất vài giây, còn năm mươi lượt chạy CI mất một buổi chiều.',
          ),
        }),

        // q6 · đáp án C (2)
        mcq({
          prompt: B(
            'A test is known to fail about 20% of the time. From the course:' + code(
              'p (ty le hong that)   P(hong roi xanh)   P(xanh 2 lan lien)\n' +
              '------------------------------------------------------------\n' +
              '        20%                 16,0%                64,0%\n' +
              '         5%                  4,8%                90,2%\n' +
              '\n' +
              'neu ty le hong that la 20%: can 14 lan xanh lien tiep de tin 95%\n' +
              'neu ty le hong that la  5%: can 59 lan xanh lien tiep de tin 95%',
            ) + 'What does this arithmetic establish about the re-run button?',
            'Một bài test được biết là hỏng khoảng 20% số lần. Từ khoá học:' + code(
              'p (ty le hong that)   P(hong roi xanh)   P(xanh 2 lan lien)\n' +
              '------------------------------------------------------------\n' +
              '        20%                 16,0%                64,0%\n' +
              '         5%                  4,8%                90,2%\n' +
              '\n' +
              'neu ty le hong that la 20%: can 14 lan xanh lien tiep de tin 95%\n' +
              'neu ty le hong that la  5%: can 59 lan xanh lien tiep de tin 95%',
            ) + 'Phép tính này xác lập điều gì về cái nút chạy lại?',
          ),
          options: [
            B(
              'Re-running once is enough to confirm a fix, because a second failure would be real — the numbers only say that a single GREEN is weak evidence, not that a single RED is',
              'Chạy lại một lần là đủ để xác nhận một bản vá, vì một cú hỏng lần hai sẽ là thật — các con số chỉ nói rằng một lần XANH là bằng chứng yếu chứ không nói một lần ĐỎ cũng vậy',
            ),
            B(
              'Fourteen re-runs is the recommended confirmation procedure, and teams that skip it are the ones whose flaky tests never get fixed',
              'Mười bốn lượt chạy lại là quy trình xác nhận được khuyến nghị, và những nhóm bỏ qua nó chính là những nhóm có test chập chờn không bao giờ được vá',
            ),
            B(
              'Confirming a fix BY RE-RUNNING is not feasible: at a true 20% rate a re-run passes 80% of the time, and 14 consecutive greens would be needed for 95% confidence — the button is a REPAIR tool, not a measurement',
              'Xác nhận một bản vá BẰNG CÁCH CHẠY LẠI là KHÔNG khả thi: với tỉ lệ thật 20% thì một lượt chạy lại qua 80% số lần, và cần 14 lần xanh liên tiếp mới tin được 95% — cái nút ấy là công cụ SỬA CHỮA chứ không phải một phép ĐO',
            ),
            B(
              'A 20% flake and a 5% flake can be told apart in two runs, because their "failed then passed" probabilities differ by more than three times',
              'Một cú chập chờn 20% và một cú 5% phân biệt được trong hai lần chạy, vì xác suất "hỏng rồi xanh" của chúng chênh nhau hơn ba lần',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The number that does the work is 80%: at a true rate of 20%, the single most likely thing to happen when you press re-run is that it goes green — and it goes green whether or not anything was fixed. That is why the conclusion is not "re-run fourteen times" but "you cannot confirm a fix this way at all". Note the compound cost the same lesson computes: a 20% test across 100 CI runs is 20 red builds, each of which re-runs green 80% of the time, so each individual decision to shrug is locally reasonable and the defect is never fixed — while being a REAL defect that surfaces once a year. The wrap-up chapter contains a line that reads the other way ("re-run once to confirm; the second failure is real"); the chapter with the arithmetic in it is the one to trust.',
            'Con số làm hết việc ở đây là 80%: với tỉ lệ thật 20%, thứ nhiều khả năng xảy ra nhất khi bạn bấm chạy lại là nó xanh — và nó xanh bất kể có vá được gì hay không. Đó là lý do kết luận KHÔNG phải "chạy lại mười bốn lần" mà là "bạn không xác nhận được một bản vá theo cách này". Để ý cái giá cộng dồn mà chính bài học tính ra: một bài test 20% qua 100 lần chạy CI là 20 bản dựng đỏ, mỗi cái chạy lại thấy xanh 80% số lần, nên từng quyết định nhún vai một là hợp lý cục bộ và khuyết tật thì không bao giờ được vá — trong khi nó là một khuyết tật THẬT, lộ ra một lần trong năm. Bài ôn tổng có một dòng đọc theo chiều ngược ("chạy lại một lần để xác nhận; cú hỏng lần hai là thật"); cái chương có phép tính trong đó mới là cái đáng tin.',
          ),
        }),

        // q7 · đáp án [0, 2] — chọn HAI
        mcq({
          prompt: B(
            'You want to reproduce a CI failure on your own machine by making that machine WORSE. Choose TWO correct pairings of constraint and symptom.',
            'Bạn muốn tái lập một cú hỏng CI trên máy của mình bằng cách làm cái máy ấy TỆ ĐI. Chọn HAI cặp ràng buộc-triệu chứng ĐÚNG.',
          ),
          options: [
            B(
              '<code>node --max-old-space-size=1600</code> reproduces a <b>134</b>, because the process hits a limit it set for itself and aborts',
              '<code>node --max-old-space-size=1600</code> tái lập một cú <b>134</b>, vì tiến trình chạm một giới hạn do chính nó đặt ra rồi tự bỏ cuộc',
            ),
            B(
              '<code>docker run -m 512m</code> reproduces a <b>134</b> as well, because a container memory limit is enforced by the same mechanism as the V8 heap ceiling',
              '<code>docker run -m 512m</code> cũng tái lập một cú <b>134</b>, vì giới hạn bộ nhớ của container được cưỡng chế bằng đúng cơ chế của trần heap V8',
            ),
            B(
              '<code>docker run -m 512m</code> reproduces a <b>137</b>, because the kernel\'s OOM killer ends the process from outside',
              '<code>docker run -m 512m</code> tái lập một cú <b>137</b>, vì OOM killer của nhân kết liễu tiến trình từ bên ngoài',
            ),
            B(
              'A Linux container reproduces a macOS-only failure, since the runner images share a base layer and differ only in the installed toolchain',
              'Một container Linux tái lập được một cú hỏng chỉ-có-trên-macOS, vì các ảnh runner dùng chung một tầng nền và chỉ khác nhau ở bộ công cụ đã cài',
            ),
          ],
          correct: [0, 2],
          explanation: EX(
            'The technique is to name the difference between the two machines and then squeeze your own until it matches: memory, cores, disk, OS, tool versions. Which one it is shows up in the exit code — 134 is the process\'s own ceiling, 137 is the machine\'s, 139 is a native binary. So the two levers are different tools deliberately: <code>--max-old-space-size</code> squeezes V8 and gives you a 134, while a container memory limit squeezes the whole process and gives you a 137. The OS is the one thing on the list you cannot fake, which is why a macOS-only failure is not reproducible in a Linux container — and why <code>act</code> is useful for workflow SYNTAX and useless for this chapter\'s failures. The alternative — adding log lines to CI and pushing — costs a full run each time and CHANGES the thing being debugged.',
            'Kỹ thuật ở đây là gọi tên khác biệt giữa hai cỗ máy rồi bóp cái máy của bạn cho tới khi nó khớp: bộ nhớ, số nhân, đĩa, hệ điều hành, phiên bản công cụ. Là cái nào thì mã thoát chỉ ra — 134 là cái trần của chính tiến trình, 137 là cái trần của cỗ máy, 139 là một bản nhị phân gốc. Nên hai cái đòn bẩy là hai công cụ khác nhau một cách có chủ ý: <code>--max-old-space-size</code> bóp V8 và cho bạn một cú 134, còn một giới hạn bộ nhớ container bóp cả tiến trình và cho bạn một cú 137. Hệ điều hành là thứ DUY NHẤT trong danh sách mà bạn không giả được, và đó là lý do một cú hỏng chỉ-có-trên-macOS không tái lập được trong một container Linux — cũng là lý do <code>act</code> hữu ích cho CÚ PHÁP workflow và vô dụng với những cú hỏng của chương này. Cách còn lại — thêm dòng log vào CI rồi đẩy — tốn một lần chạy đầy đủ mỗi vòng và LÀM THAY ĐỔI chính cái thứ đang được gỡ lỗi.',
          ),
        }),

        // q8 · đáp án B (1)
        mcq({
          prompt: B(
            'The course measured V8\'s default heap ceiling on the machine the lessons were written on:' + code(
              "$ node -e 'console.log(require(\"v8\").getHeapStatistics().heap_size_limit)'\n" +
              'heap_size_limit = 8.240 MB\n' +
              '\n' +
              'may do: 4 nhan · RAM 15Gi · node v22.22.2',
            ) + 'How should that number be used?',
            'Khoá học đã đo trần heap mặc định của V8 trên chính cỗ máy soạn bài:' + code(
              "$ node -e 'console.log(require(\"v8\").getHeapStatistics().heap_size_limit)'\n" +
              'heap_size_limit = 8.240 MB\n' +
              '\n' +
              'may do: 4 nhan · RAM 15Gi · node v22.22.2',
            ) + 'Con số đó nên được dùng thế nào?',
          ),
          options: [
            B(
              'As a constant of Node 22: the old 4 GB figure belonged to Node 16 and earlier, and any Node 22 process anywhere now gets about 8 GB',
              'Như một hằng số của Node 22: con số 4 GB cũ thuộc về Node 16 trở về trước, còn giờ mọi tiến trình Node 22 ở bất cứ đâu đều nhận khoảng 8 GB',
            ),
            B(
              'As a measurement OF THAT MACHINE: V8 sizes the ceiling from the machine\'s memory and the Node build, so it moves — the transferable part is the diagnostic step that PRINTS it, which then answers "did the ceiling move, or did the build grow?" on the day something exits 134',
              'Như một phép đo CỦA CHÍNH CỖ MÁY ẤY: V8 định cỡ cái trần theo bộ nhớ của máy và bản Node, nên nó dịch chuyển — phần chuyển được là cái BƯỚC CHẨN ĐOÁN IN nó ra, và bước ấy trả lời được "cái trần đã dịch, hay bản dựng đã phình?" vào cái ngày có thứ gì thoát 134',
            ),
            B(
              'As an upper bound for CI: a job that needs more than 8,240 MB cannot run on a GitHub-hosted runner, so the number is the budget every build has to fit inside',
              'Như một cận trên cho CI: một job cần hơn 8.240 MB thì không chạy được trên runner do GitHub cấp, nên con số ấy là ngân sách mà mọi bản dựng phải nằm vừa',
            ),
            B(
              'As proof that <code>--max-old-space-size</code> is unnecessary on Node 22, since the default already exceeds what any realistic front-end build requires',
              'Như bằng chứng rằng <code>--max-old-space-size</code> là không cần thiết trên Node 22, vì mặc định vốn đã vượt thứ mà mọi bản dựng front-end thực tế cần tới',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The lesson is careful enough to print the machine spec beside the number, and that is the tell. Measure the same thing on a different machine with a different Node build and you get a different ceiling — the exam authors got 4,144 MB, which is the very "myth" the lesson set out to retire. So neither number is a fact about Node; both are facts about a machine. What transfers is the habit: put the heap-limit print into a diagnostic step and leave it there permanently, because on the day a build exits 134 you want to know immediately whether the ceiling moved under you or your bundle grew into it. The same step is worth carrying <code>uname -a</code>, the runner OS and arch, core count, free memory and disk.',
            'Bài học cẩn thận in cấu hình máy ngay bên cạnh con số, và đó chính là chỗ để ý. Đo cùng một thứ trên một máy khác với một bản Node khác thì ra một cái trần khác — người soạn đề này đo được 4.144 MB, đúng cái "truyền thuyết" mà bài học định cho về hưu. Vậy không con số nào là sự thật về Node; cả hai đều là sự thật về một cỗ máy. Thứ chuyển được là cái thói quen: đưa dòng in trần heap vào một bước chẩn đoán rồi để nó ở đó VĨNH VIỄN, vì vào cái ngày một bản dựng thoát 134 thì bạn muốn biết ngay là cái trần đã dịch dưới chân bạn hay gói của bạn đã phình lên tới nó. Cũng bước ấy đáng mang theo <code>uname -a</code>, hệ điều hành và kiến trúc của runner, số nhân, bộ nhớ trống và đĩa.',
          ),
        }),

        // q9 · đáp án D (3)
        mcq({
          prompt: B(
            'The chapter gives a six-step triage order, with reading the log LAST. It also names four shortcuts that break it. Which of these is one of them, and why does it fail?',
            'Chương này đưa ra một thứ tự phân loại sáu bước, với việc đọc log ở CUỐI. Nó cũng gọi tên bốn lối tắt phá vỡ thứ tự ấy. Cái nào dưới đây là một trong số đó, và vì sao nó hỏng?',
          ),
          options: [
            B(
              'Comparing the run duration against the median of the last ten runs — the median is dragged around by cancelled runs, so the comparison needs the mean instead',
              'So thời lượng lần chạy với trung vị của mười lần gần nhất — trung vị bị các lần chạy bị huỷ kéo đi, nên phép so cần dùng trung bình thay thế',
            ),
            B(
              'Counting failed and skipped jobs separately — the two symbols mean the same thing on the run summary, so counting them apart invents a distinction that is not there',
              'Đếm riêng job hỏng và job bị bỏ qua — hai ký hiệu ấy mang cùng một nghĩa trên trang tóm tắt, nên đếm tách chúng là bịa ra một sự phân biệt không tồn tại',
            ),
            B(
              'Reading the log from the bottom up — the real error is near the top, because the runner writes the fatal message before it unwinds the rest of the job',
              'Đọc log từ dưới lên — lỗi thật nằm gần đầu, vì runner ghi thông báo chí mạng trước khi nó tháo dỡ phần còn lại của job',
            ),
            B(
              'Searching the log for the word "error" — plenty of GREEN steps print that word, so the search returns noise; the string that actually marks a failure is <code>##[error]</code>',
              'Tìm chữ "error" trong log — rất nhiều bước XANH cũng in ra chữ ấy nên phép tìm trả về nhiễu; chuỗi thật sự đánh dấu một cú hỏng là <code>##[error]</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The other three shortcuts are worth knowing too: opening the log first, which is how somebody spends fifteen minutes on the stack trace of a job that was only SKIPPED; re-running before reading, which chapter 8 has already shown says nothing; and reading someone else\'s log before your own, which imports their diagnosis into yours. The rest of the order is exactly what the distractors get wrong: duration is compared against the MEDIAN of the last ten runs rather than against memory, failed and skipped ARE different symbols and counting each separately is how you see how far a failure propagated, and a log is read from the BOTTOM UP because the real error is near the end while the top is setup and billing.',
            'Ba lối tắt còn lại cũng đáng biết: mở log ngay, và đó là cách một người bỏ mười lăm phút vào stack trace của một job vốn chỉ BỊ BỎ QUA; chạy lại trước khi đọc, mà chương 8 đã cho thấy là chẳng nói lên gì; và đọc log của người khác trước log của mình, việc đó nhập chẩn đoán của họ vào chẩn đoán của bạn. Phần còn lại của thứ tự đúng là chỗ mấy phương án nhiễu nói sai: thời lượng được so với TRUNG VỊ của mười lần chạy gần nhất chứ không so với trí nhớ, hỏng và bị bỏ qua LÀ hai ký hiệu khác nhau và đếm riêng từng loại chính là cách bạn thấy một cú hỏng lan sâu tới đâu, còn log thì đọc TỪ DƯỚI LÊN vì lỗi thật nằm gần cuối trong khi phần đầu là thiết lập và hoá đơn.',
          ),
        }),

        // q10 · đáp án A (0)
        mcq({
          prompt: B(
            'A build kept exiting 134 under a squeezed heap. The team applies <code>NODE_OPTIONS=--max-old-space-size=8192</code> and the build turns green. Which critique does the chapter make of that patch?',
            'Một bản dựng cứ thoát 134 dưới một cái heap bị bóp. Nhóm áp <code>NODE_OPTIONS=--max-old-space-size=8192</code> và bản dựng chuyển xanh. Chương này phê bình bản vá ấy thế nào?',
          ),
          options: [
            B(
              'It RAISES the ceiling instead of RESTORING the margin. Both are legitimate moves, but mixing them is how the failure class comes back — the next dependency that adds 400 MB of peak usage puts you straight back where you were',
              'Nó NÂNG cái trần thay vì KHÔI PHỤC cái lề. Cả hai đều là nước đi chính đáng, nhưng TRỘN chúng lại chính là cách lớp lỗi ấy quay về — cái phụ thuộc kế tiếp làm đỉnh bộ nhớ tăng thêm 400 MB sẽ đưa bạn về đúng chỗ cũ',
            ),
            B(
              'It is the wrong lever entirely: <code>NODE_OPTIONS</code> is ignored by build tools that spawn their own child processes, so the green run must be explained by something else',
              'Đó là hoàn toàn sai đòn bẩy: <code>NODE_OPTIONS</code> bị các công cụ dựng có sinh tiến trình con bỏ qua, nên lần chạy xanh phải được giải thích bằng thứ khác',
            ),
            B(
              'It converts a 134 into a 137, because a heap larger than the machine\'s real memory guarantees the OOM killer will step in on the next run',
              'Nó biến một cú 134 thành một cú 137, vì một cái heap lớn hơn bộ nhớ thật của máy đảm bảo OOM killer sẽ ra tay ở lần chạy kế',
            ),
            B(
              'It cannot be verified: a green run under the raised ceiling proves nothing, and there is no way to test a memory patch short of shipping it and waiting',
              'Nó không kiểm chứng được: một lần chạy xanh dưới cái trần đã nâng chẳng chứng minh gì, và không có cách nào kiểm một bản vá bộ nhớ ngoài việc ship nó rồi chờ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The two moves answer different questions. Raising the ceiling says "this build legitimately needs more room"; restoring the margin says "this build started needing more room and should not have". The course\'s own case needed BOTH and kept them distinct: <code>--max-old-space-size=6144</code> for the renderer build, plus <code>sourcemap: !process.env.CI</code> to bring peak usage back down. And the verification is perfectly possible, which is what makes the third state of a patch reachable: reproduce under a constraint, apply the fix under the SAME constraint, then bake that constraint into CI as an acceptance test — <code>NODE_OPTIONS=--max-old-space-size=2048</code> on the build step asserts a property of the BUILD rather than a fact about the hardware. Then deliberately break something else and confirm the test goes red, because a check you have never seen fail is a check you have not tested.',
            'Hai nước đi trả lời hai câu hỏi khác nhau. Nâng cái trần là nói "bản dựng này thật sự cần thêm chỗ"; khôi phục cái lề là nói "bản dựng này bắt đầu cần thêm chỗ, và đáng lẽ nó không nên thế". Chính ca của khoá học cần CẢ HAI và giữ chúng tách bạch: <code>--max-old-space-size=6144</code> cho bản dựng renderer, cộng <code>sourcemap: !process.env.CI</code> để kéo đỉnh bộ nhớ xuống. Và việc kiểm chứng thì hoàn toàn làm được, đó là thứ khiến trạng thái THỨ BA của một bản vá với tới được: tái lập dưới một ràng buộc, áp bản vá dưới CÙNG ràng buộc ấy, rồi nướng ràng buộc đó vào CI thành một bài nghiệm thu — <code>NODE_OPTIONS=--max-old-space-size=2048</code> trên bước dựng khẳng định một tính chất của BẢN DỰNG chứ không phải một sự thật về phần cứng. Rồi CỐ Ý phá một thứ khác và xác nhận phép kiểm chuyển đỏ, vì một phép kiểm bạn chưa bao giờ thấy nó hỏng là một phép kiểm bạn chưa kiểm thử.',
          ),
        }),

        /* ── Chương 9 — deploy từ CI (8 câu) ───────────────────────────── */

        // q11 · đáp án B (1)
        mcq({
          prompt: B(
            'Two workflows both deployed on <code>push</code> to <code>main</code>, and they raced each other into two outages in one week. A team proposes adding <code>concurrency:</code> to each of them and keeping the push trigger. Why is that not enough?',
            'Hai workflow cùng deploy khi <code>push</code> lên <code>main</code>, và chúng đua nhau vào hai sự cố trong một tuần. Một nhóm đề nghị thêm <code>concurrency:</code> vào từng cái rồi giữ nguyên trigger push. Vì sao thế là chưa đủ?',
          ),
          options: [
            B(
              'A per-workflow <code>concurrency:</code> block is ignored when the trigger is <code>push</code>, because push runs are queued by the ref rather than by the group name',
              'Một khối <code>concurrency:</code> theo từng workflow bị bỏ qua khi trigger là <code>push</code>, vì các lần chạy push được xếp hàng theo ref chứ không theo tên nhóm',
            ),
            B(
              'The two outages involved TWO DIFFERENT workflows, and a per-workflow block does not order them against each other unless they share a group — and queueing does not make a deploy idempotent in any case',
              'Hai sự cố ấy dính TỚI HAI WORKFLOW KHÁC NHAU, và một khối theo từng workflow không sắp thứ tự chúng với nhau trừ khi chúng chung một nhóm — mà xếp hàng thì dù sao cũng không làm một cuộc deploy trở nên bất biến',
            ),
            B(
              'It is enough: sharing one group name across both files serialises them, which is exactly what the two outages needed, and no other change is required',
              'Thế là đủ: cho hai tệp dùng chung một tên nhóm là tuần tự hoá chúng, và đó đúng là thứ hai sự cố ấy cần, không cần thay đổi nào khác',
            ),
            B(
              '<code>concurrency:</code> only applies to jobs, not workflows, so the block has to be repeated on every job in both files before it has any effect',
              '<code>concurrency:</code> chỉ áp cho job chứ không cho workflow, nên khối ấy phải được lặp lại trên mọi job của cả hai tệp thì mới có tác dụng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Chapter 9 lists three properties push-to-deploy demands, and this repository had none of them in July. First, exactly ONE deploy workflow — not one per environment, because two workflows deploying to the same place are two workflows racing. Second, a deploy that is IDEMPOTENT, not one that "usually converges"; <code>concurrency:</code> serialises, and serialising two operations that fight over the same container name just moves the collision. Third, rollback ON the deploy path and automatic, or else every failed deploy is an incident. The obvious measures were tried. What actually worked was removing the automatic trigger — <code>deploy stays a script you run, never a side effect of pushing</code> — and today ten of eleven workflows are dispatch-only, with only <code>ci-lint.yml</code> running on push.',
            'Chương 9 liệt kê ba tính chất mà push-để-deploy ĐÒI, và kho này hồi tháng Bảy không có cái nào. Một, đúng MỘT workflow deploy — không phải một cái cho mỗi môi trường, vì hai workflow deploy vào cùng một chỗ là hai workflow đua nhau. Hai, một cuộc deploy BẤT BIẾN, không phải một cuộc "thường thì hội tụ"; <code>concurrency:</code> tuần tự hoá, và tuần tự hoá hai thao tác tranh nhau cùng một tên container thì chỉ dời chỗ va chạm đi. Ba, rollback nằm TRÊN đường deploy và tự động, nếu không thì mọi cuộc deploy hỏng đều là một sự cố. Các biện pháp hiển nhiên đã được thử. Thứ THẬT SỰ có tác dụng là gỡ cái trigger tự động — <code>deploy vẫn là một script BẠN chạy, không bao giờ là tác dụng phụ của việc push</code> — và hôm nay mười trên mười một workflow chỉ chạy tay, chỉ còn <code>ci-lint.yml</code> chạy theo push.',
          ),
        }),

        // q12 · đáp án D (3)
        mcq({
          prompt: B(
            'A team is deciding where to build their images: on the CI runner, on a dedicated build machine, or on the target VPS. Which question does the chapter tell them to ask?',
            'Một nhóm đang quyết định dựng ảnh ở đâu: trên runner CI, trên một máy dựng riêng, hay trên chính VPS đích. Chương này bảo họ hỏi câu nào?',
          ),
          options: [
            B(
              'Which location has the most cores, since a build is CPU-bound and everything else follows from throughput',
              'Chỗ nào nhiều nhân nhất, vì một bản dựng bị giới hạn bởi CPU và mọi thứ khác suy ra từ thông lượng',
            ),
            B(
              'Which location is cheapest per minute, since build time is the dominant cost of a deploy pipeline and the other factors are second-order',
              'Chỗ nào rẻ nhất tính theo phút, vì thời gian dựng là chi phí áp đảo của một đường ống deploy và các yếu tố khác chỉ là thứ yếu',
            ),
            B(
              'Which location already has a warm cache, because a cold build is the single largest avoidable cost and cache locality decides everything else',
              'Chỗ nào đã có sẵn cache ấm, vì một bản dựng lạnh là chi phí tránh được lớn nhất và tính cục bộ của cache quyết định mọi thứ còn lại',
            ),
            B(
              '"What does this step need that exists in only ONE place?" — a specific Xcode, the production database, a signed certificate, a warm cache. Put that step THERE, and run everything else somewhere disposable',
              '"Bước này cần cái gì mà chỉ tồn tại ở MỘT CHỖ?" — một bản Xcode cụ thể, cơ sở dữ liệu production, một chứng chỉ đã ký, một cache ấm. Đặt bước ấy Ở ĐÓ, và chạy mọi thứ khác ở chỗ dùng-một-lần',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The question generalises past this repository\'s particular answer. Here the build machine wins on time — parallel builds at home take three to six minutes while the VPS is forced to build sequentially because parallel cold builds were OOM-killed — but the sentence that matters is about the VPS\'s DISK: the build cache once grew to 7.6 GB on the same disk that holds Postgres, and on one deploy the disk fell to 1.8 GB free in the middle of <code>next build</code>. That is not a speed problem. Meanwhile the target should be doing as little as possible, which is what <code>--no-build</code> is for: without it <code>docker compose up</code> is permitted to build, and the destination quietly becomes a build machine competing with its own disk.',
            'Câu hỏi ấy khái quát vượt qua đáp án cụ thể của kho này. Ở đây cỗ máy dựng thắng về thời gian — dựng song song ở nhà mất ba tới sáu phút trong khi VPS buộc phải dựng tuần tự vì dựng song song lạnh từng bị OOM giết — nhưng câu đáng chú ý lại nói về cái ĐĨA của VPS: cache dựng từng phình lên 7,6 GB trên đúng cái đĩa chứa Postgres, và trong một lần deploy đĩa tụt xuống còn 1,8 GB trống giữa lúc <code>next build</code> đang chạy. Đó không phải một vấn đề tốc độ. Trong khi đó cái đích nên làm càng ít càng tốt, và đó là công dụng của <code>--no-build</code>: thiếu nó thì <code>docker compose up</code> được phép DỰNG, và cái đích âm thầm trở thành một máy dựng tranh đĩa với chính nó.',
          ),
        }),

        // q13 · đáp án A (0)
        mcq({
          prompt: B(
            'A deploy script ends with these lines. Which flag is doing real work, and what class of failure does it remove?' + code(
              'docker pull ghcr.io/<owner>/backend:$SHA\n' +
              'docker compose up -d --no-deps --no-build backend frontend\n' +
              'docker exec backend npx prisma migrate deploy\n' +
              'curl -f https://api/health || rollback',
            ),
            'Một script deploy kết thúc bằng những dòng sau. Cái cờ nào đang làm việc thật, và nó gỡ bỏ lớp lỗi nào?' + code(
              'docker pull ghcr.io/<owner>/backend:$SHA\n' +
              'docker compose up -d --no-deps --no-build backend frontend\n' +
              'docker exec backend npx prisma migrate deploy\n' +
              'curl -f https://api/health || rollback',
            ),
          ),
          options: [
            B(
              '<code>--no-build</code>: without it <code>docker compose up</code> is allowed to BUILD, so the deployment target turns into a build machine competing with its own disk — one word that removes an entire class of failure',
              '<code>--no-build</code>: thiếu nó thì <code>docker compose up</code> được phép DỰNG, nên cái đích deploy biến thành một máy dựng tranh đĩa với chính nó — một từ gỡ bỏ trọn một lớp lỗi',
            ),
            B(
              '<code>--no-deps</code>: without it compose would restart the database alongside the application, which is what causes the connection storms after a deploy',
              '<code>--no-deps</code>: thiếu nó thì compose sẽ khởi động lại cơ sở dữ liệu cùng với ứng dụng, và đó là thứ gây ra bão kết nối sau một cuộc deploy',
            ),
            B(
              '<code>-f</code> on <code>curl</code>: without it a 500 response still exits 0, so the rollback branch would never fire and a broken deploy would be reported as successful',
              '<code>-f</code> của <code>curl</code>: thiếu nó thì một phản hồi 500 vẫn thoát 0, nên nhánh rollback không bao giờ nổ và một cuộc deploy hỏng sẽ được báo là thành công',
            ),
            B(
              '<code>-d</code>: without it compose runs in the foreground and the SSH session holds the containers, so they die when the deploy script disconnects',
              '<code>-d</code>: thiếu nó thì compose chạy ở tiền cảnh và phiên SSH giữ các container, nên chúng chết khi script deploy ngắt kết nối',
            ),
          ],
          correct: 0,
          explanation: EX(
            'All four flags are doing something, and the <code>curl -f</code> point in option C is genuinely true — but the chapter singles out <code>--no-build</code> because of what it prevents rather than what it does: it stops the deployment target from ever becoming a build machine. That is the difference between a VPS that pulls an image in seconds and a VPS that fills the disk holding Postgres. The health check has its own limit worth remembering: <code>/health</code> returning 200 proves the ROUTER mounted, not that the route this deploy changed works. On 2026-07-02 an entire router was missing from the shipped image while <code>/health</code> answered fine — which is why the smoke test checks core routes for a non-404 rather than checking one endpoint for a 200.',
            'Cả bốn cái cờ đều đang làm việc gì đó, và ý về <code>curl -f</code> ở phương án C thì đúng thật — nhưng chương này chỉ đích danh <code>--no-build</code> vì thứ nó NGĂN chứ không vì thứ nó làm: nó ngăn cái đích deploy trở thành một cỗ máy dựng. Đó là khác biệt giữa một VPS kéo ảnh về trong vài giây và một VPS làm đầy cái đĩa đang chứa Postgres. Phép kiểm sức khoẻ có giới hạn riêng đáng nhớ: <code>/health</code> trả 200 chứng minh ROUTER đã mount, không chứng minh cái route mà cuộc deploy này vừa đổi là chạy được. Ngày 02/07/2026 nguyên một router vắng mặt khỏi ảnh đã ship trong khi <code>/health</code> vẫn trả lời ngon lành — và đó là lý do bộ smoke test kiểm các route lõi xem có KHÁC 404 không, thay vì kiểm một endpoint xem có 200 không.',
          ),
        }),

        // q14 · đáp án C (2)
        mcq({
          prompt: B(
            'A deploy that included a column rename goes bad. Which rollback shape applies, and what is the constraint?',
            'Một cuộc deploy có kèm việc đổi tên một cột thì hỏng. Hình dạng rollback nào áp dụng được, và ràng buộc là gì?',
          ),
          options: [
            B(
              'Re-tag the previous image and restart: the image carries the code, and a column rename is invisible to the container because the ORM resolves names at query time',
              'Gắn lại thẻ cho ảnh trước rồi khởi động lại: cái ảnh mang theo mã, và việc đổi tên một cột thì vô hình với container vì ORM phân giải tên lúc truy vấn',
            ),
            B(
              '<code>git revert</code> the deploy commit: reverting the code reverts the migration too, because the migration file is part of the same commit',
              '<code>git revert</code> commit deploy: hoàn tác mã là hoàn tác luôn migration, vì tệp migration nằm trong cùng commit ấy',
            ),
            B(
              'Only a snapshot restore, because reverting the code does not revert the database — which is why a rename inside ONE deploy is a one-way door, and why the two-migration shape exists',
              'Chỉ có khôi phục snapshot, vì hoàn tác mã KHÔNG hoàn tác cơ sở dữ liệu — đó là lý do một cú đổi tên gói trong MỘT cuộc deploy là một cánh cửa MỘT CHIỀU, và là lý do khuôn mẫu hai-migration tồn tại',
            ),
            B(
              'Any of the three: rollback shape is a matter of team preference, and the three options differ only in how long they take rather than in what they can undo',
              'Cái nào cũng được trong ba: hình dạng rollback là chuyện sở thích của nhóm, và ba lựa chọn chỉ khác nhau ở chỗ mất bao lâu chứ không khác ở chỗ hoàn tác được cái gì',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The three shapes undo different things. Re-tagging an image undoes CODE and is fast — the course documents a forty-second recovery using a dangling image against fifteen minutes to rebuild. <code>git revert</code> also undoes code, and works when code is the only thing that broke. Neither touches state, so a schema change that is not backward compatible within one deploy leaves only the snapshot, which is slow and lossy. The two-migration shape is what keeps the door two-way: add a nullable column, deploy code that writes it, backfill, make it not-null, deploy code that reads it, and drop the old column in a SEPARATE deploy. Every intermediate state is a valid code-plus-schema pair, so every step\'s rollback is just "deploy the previous code".',
            'Ba hình dạng ấy hoàn tác ba thứ khác nhau. Gắn lại thẻ cho một cái ảnh thì hoàn tác MÃ và nhanh — khoá học ghi lại một lượt khôi phục bốn mươi giây bằng một ảnh mồ côi, so với mười lăm phút để dựng lại. <code>git revert</code> cũng hoàn tác mã, và chạy được khi mã là thứ duy nhất hỏng. Không cái nào đụng tới TRẠNG THÁI, nên một thay đổi lược đồ không tương thích ngược trong phạm vi một cuộc deploy chỉ còn đường snapshot, mà cái đó thì chậm và mất mát. Khuôn mẫu hai-migration mới là thứ giữ cho cánh cửa hai chiều: thêm một cột nullable, deploy mã ghi vào nó, backfill, bật not-null, deploy mã đọc nó, rồi bỏ cột cũ ở một cuộc deploy RIÊNG. Mọi trạng thái trung gian đều là một CẶP mã-cộng-lược-đồ hợp lệ, nên rollback ở mỗi bước chỉ là "deploy lại mã trước đó".',
          ),
        }),

        // q15 · đáp án B (1)
        mcq({
          prompt: B(
            'A team documents a rollback procedure and considers the matter closed. The chapter lists four conditions for a rollback to actually work when it is needed. Which set is right?',
            'Một nhóm viết tài liệu cho một quy trình rollback rồi coi như xong chuyện. Chương này liệt kê bốn điều kiện để một cuộc rollback THẬT SỰ chạy được vào lúc cần. Bộ nào ĐÚNG?',
          ),
          options: [
            B(
              'A staging environment, a database replica, an on-call rota, and a post-mortem template',
              'Một môi trường staging, một bản sao cơ sở dữ liệu, một lịch trực, và một khuôn bản khám nghiệm sự cố',
            ),
            B(
              'The previous version still EXISTS (tag by SHA and keep several recent images), the schema change is backward compatible within one deploy, the runbook fits on ONE card, and the procedure has been REHEARSED',
              'Phiên bản trước vẫn còn TỒN TẠI (gắn thẻ theo SHA và giữ vài ảnh gần nhất), thay đổi lược đồ tương thích ngược trong phạm vi một cuộc deploy, sổ tay vừa MỘT TẤM THẺ, và quy trình ĐÃ ĐƯỢC DIỄN TẬP',
            ),
            B(
              'Automated tests on the previous version, a feature flag around every change, a canary deployment, and a traffic-shifting proxy',
              'Test tự động trên phiên bản trước, một cờ tính năng bọc quanh mọi thay đổi, một cuộc deploy canary, và một proxy dịch chuyển lưu lượng',
            ),
            B(
              'Monitoring, alerting, an incident channel, and a documented escalation path — rollback is an organisational capability rather than a technical one',
              'Giám sát, báo động, một kênh sự cố, và một đường leo thang có tài liệu — rollback là một năng lực TỔ CHỨC chứ không phải một năng lực kỹ thuật',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Each condition removes a specific way the rollback fails at the moment you need it. The image has to still exist, which means tagging by SHA rather than relying on a mutable tag and keeping a few recent images regardless of what the registry\'s garbage collection would prefer. The schema has to be compatible or the previous code cannot run. The runbook has to be three commands in the order they must run — "two paragraphs of prose is not a rollback". And it has to have been rehearsed, because rollback also assumes a human who is AWAKE, who has SSH, and who has the runbook, and all three break exactly when rollback is most needed. The cheapest rehearsal is inside the deploy itself: capture <code>PREV_SHA</code> BEFORE swapping, so rollback becomes an <code>else</code> branch rather than a separate document.',
            'Mỗi điều kiện gỡ bỏ một cách cụ thể mà cuộc rollback hỏng đúng vào lúc bạn cần nó. Cái ảnh phải còn tồn tại, nghĩa là gắn thẻ theo SHA thay vì dựa vào một cái thẻ dời được, và giữ lại vài ảnh gần nhất bất kể chính sách thu gom rác của registry muốn gì. Lược đồ phải tương thích, không thì mã trước đó không chạy nổi. Sổ tay phải là ba câu lệnh theo đúng thứ tự phải chạy — "hai đoạn văn xuôi thì KHÔNG phải một cuộc rollback". Và nó phải đã được diễn tập, vì rollback còn giả định một con người đang TỈNH, có SSH, và có sổ tay trong tay, mà cả ba đều VỠ đúng vào lúc rollback cần nhất. Lượt diễn tập rẻ nhất nằm ngay trong chính cuộc deploy: bắt lấy <code>PREV_SHA</code> TRƯỚC khi tráo, để rollback trở thành một nhánh <code>else</code> chứ không phải một tài liệu riêng.',
          ),
        }),

        // q16 · đáp án D (3)
        mcq({
          prompt: B(
            'A repository\'s deploy workflows are all <code>workflow_dispatch</code>. Someone proposes adding an <code>environment:</code> block. Which control is the one worth adding FIRST, and why?',
            'Các workflow deploy của một kho đều là <code>workflow_dispatch</code>. Có người đề nghị thêm một khối <code>environment:</code>. Biện pháp nào đáng thêm TRƯỚC TIÊN, và vì sao?',
          ),
          options: [
            B(
              'The wait timer, because a delay of a few minutes gives someone the chance to cancel a deploy that was started by mistake, and it needs no reviewer to be on duty',
              'Bộ hẹn chờ, vì một khoảng trễ vài phút cho ai đó cơ hội huỷ một cuộc deploy khởi động nhầm, và nó không cần một người duyệt phải đang trực',
            ),
            B(
              'Environment-scoped secrets, because they are the only control that keeps working when the workflow file itself is edited by someone with write access',
              'Bí mật khoanh theo environment, vì đó là biện pháp duy nhất còn tác dụng khi chính tệp workflow bị một người có quyền ghi sửa đổi',
            ),
            B(
              'Required reviewers, because a human approving each deploy is the strongest available control and every other setting is a weaker approximation of it',
              'Người duyệt bắt buộc, vì một con người phê duyệt từng cuộc deploy là biện pháp mạnh nhất sẵn có và mọi thiết lập khác chỉ là một xấp xỉ yếu hơn của nó',
            ),
            B(
              'The deployment BRANCH policy. Without it the dispatch UI shows a branch dropdown, someone picks a feature branch and presses Run, and production gets a feature branch. With it, the same click FAILS at the gate — no deploy, no rollback needed',
              'Chính sách NHÁNH deploy. Không có nó thì giao diện dispatch hiện một dropdown nhánh, ai đó chọn một nhánh tính năng rồi bấm Run, và production nhận một nhánh tính năng. Có nó thì đúng cú click ấy HỎNG ở cổng — không deploy, không cần rollback',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The branch policy is first because it removes a whole failure mode with no ongoing human cost, while a reviewer requirement only helps if reviewers actually review. The chapter is blunt about that: <b>an approver who always approves produces paperwork, not a gate</b> — and if the workflow does not surface the commit range, the changed files and the migrations, they are approving something they cannot see, which is worse than no approval at all. The other properties an environment brings are worth knowing: a wait timer from 5 to 43,200 minutes, environment-scoped secrets, and the reviewer requirement itself. And the argument that makes it worth doing today, while the trigger is still manual: the gate SURVIVES the day someone changes <code>workflow_dispatch</code> to <code>push</code>, whereas "a human presses the button" does not.',
            'Chính sách nhánh đứng đầu vì nó gỡ bỏ trọn một kiểu hỏng mà không tốn chi phí con người thường trực, trong khi việc bắt có người duyệt chỉ giúp ích nếu người duyệt THẬT SỰ duyệt. Chương này nói thẳng chuyện đó: <b>một người duyệt LUÔN LUÔN duyệt thì đẻ ra giấy tờ, không đẻ ra một cái cổng</b> — và nếu workflow không phơi ra khoảng commit, các tệp đã đổi và các migration thì họ đang duyệt một thứ họ không nhìn thấy, và như thế còn tệ hơn là không có phê duyệt. Các tính chất khác mà một environment mang lại cũng đáng biết: một bộ hẹn chờ từ 5 tới 43.200 phút, bí mật khoanh theo environment, và chính cái yêu cầu người duyệt. Còn lập luận khiến việc này đáng làm ngay hôm nay, trong khi trigger vẫn còn thủ công: cái cổng ấy SỐNG SÓT được cái ngày có người đổi <code>workflow_dispatch</code> thành <code>push</code>, còn "một con người bấm nút" thì không.',
          ),
        }),

        // q17 · đáp án A (0)
        mcq({
          prompt: B(
            'A notification step is added to a deploy workflow:' + code(
              "- name: Bao Slack neu deploy hong\n" +
              "  if: failure() && github.ref == 'refs/heads/main'\n" +
              '  uses: rtCamp/action-slack-notify@v2',
            ) + 'Why are there TWO conditions rather than one?',
            'Một bước thông báo được thêm vào một workflow deploy:' + code(
              "- name: Bao Slack neu deploy hong\n" +
              "  if: failure() && github.ref == 'refs/heads/main'\n" +
              '  uses: rtCamp/action-slack-notify@v2',
            ) + 'Vì sao có HAI điều kiện chứ không phải một?',
          ),
          options: [
            B(
              'Because CI failing on <code>main</code> is a real signal while CI failing on a pull request is not — the PR is already the notification — so without the branch test every failed PR pings the whole channel',
              'Vì CI đỏ trên <code>main</code> là một tín hiệu thật còn CI đỏ trên một pull request thì không — cái PR đã là thông báo rồi — nên thiếu phép kiểm nhánh thì mọi PR hỏng đều ping cả kênh',
            ),
            B(
              'Because <code>failure()</code> alone would also fire on a cancelled run, and the branch comparison is what excludes cancellations from the notification',
              'Vì riêng <code>failure()</code> cũng nổ khi lần chạy bị huỷ, và phép so nhánh mới là thứ loại các cú huỷ ra khỏi thông báo',
            ),
            B(
              'Because a status function on its own is not a valid <code>if:</code> expression — it must be combined with a comparison before the runner will evaluate it',
              'Vì một hàm trạng thái đứng một mình không phải một biểu thức <code>if:</code> hợp lệ — nó phải được ghép với một phép so sánh thì runner mới đánh giá',
            ),
            B(
              'Because <code>github.ref</code> is empty during a failure, so the comparison acts as a guard that stops the step running before the context is populated',
              'Vì <code>github.ref</code> rỗng trong lúc có cú hỏng, nên phép so sánh đóng vai một cái chốt chặn bước chạy trước khi context được điền',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The chapter sorts events into what deserves a message and what does not, and the boundary between a red <code>main</code> and a red PR is one of the sharpest: on a pull request the failure is already attached to the thing the author is looking at. Without the second condition the channel fills with noise and then gets muted, which is how a channel stops being a control. The scale argument is the same lesson from the other side: this repository has 2,343 runs, so one message per run works out at roughly ten a day before you have even distinguished green from red. And a message with no context — "CI failed on main" plus a URL — makes the recipient open a browser and read a log, which is exactly what the notification was supposed to save them; carry the failing step name, the exit code and the commit URL.',
            'Chương này xếp các sự kiện thành thứ xứng đáng một tin nhắn và thứ không, và ranh giới giữa một <code>main</code> đỏ với một PR đỏ là một trong những ranh giới sắc nhất: trên một pull request thì cú hỏng vốn đã gắn liền với đúng cái thứ mà tác giả đang nhìn. Thiếu điều kiện thứ hai thì cái kênh đầy tiếng ồn rồi bị tắt tiếng, và đó là cách một cái kênh thôi làm một biện pháp. Lập luận về quy mô là cùng bài học ấy nhìn từ phía bên kia: kho này có 2.343 lần chạy, nên một tin mỗi lần chạy ra khoảng mười tin một ngày, mà đó là còn chưa phân biệt xanh với đỏ. Và một tin nhắn KHÔNG có ngữ cảnh — "CI hỏng trên main" kèm một URL — buộc người nhận mở trình duyệt rồi đọc log, đúng cái việc mà thông báo lẽ ra phải tiết kiệm cho họ; hãy mang theo tên bước hỏng, mã thoát và URL của commit.',
          ),
        }),

        // q18 · đáp án C (2)
        mcq({
          prompt: B(
            'This repository sends no notifications at all — a grep for SLACK, DISCORD, EMAIL and notif across its workflows returns nothing. Is that defensible?',
            'Kho này không gửi thông báo nào cả — grep SLACK, DISCORD, EMAIL và notif trên các workflow của nó trả về không kết quả. Có bảo vệ được không?',
          ),
          options: [
            B(
              'No: any repository that deploys to production needs an alerting path, and the absence of one is an unconditional defect regardless of how deploys are triggered',
              'Không: bất kỳ kho nào deploy lên production đều cần một đường báo động, và việc thiếu nó là một khuyết tật vô điều kiện bất kể deploy được kích hoạt thế nào',
            ),
            B(
              'Yes, permanently: the operator reads the deploy script\'s output, and a script that prints its result is strictly better than a channel because it cannot be muted',
              'Được, và vĩnh viễn: người vận hành đọc đầu ra của script deploy, và một script in ra kết quả của nó thì tốt hơn hẳn một cái kênh vì nó không bị tắt tiếng được',
            ),
            B(
              'Yes, but CONDITIONALLY: it holds while no workflow deploys automatically, because the deploy script IS the notification channel — and it stops holding the day a schedule fires a deploy at 3 a.m., or two people deploy at once',
              'Được, nhưng CÓ ĐIỀU KIỆN: nó đứng vững chừng nào không workflow nào deploy tự động, vì chính script deploy LÀ kênh thông báo — và nó thôi đứng vững vào cái ngày một cái lịch nổ một cuộc deploy lúc 3 giờ sáng, hay hai người cùng deploy một lúc',
            ),
            B(
              'The question is moot: GitHub already emails the actor on every failed run, so an explicit notification step would only duplicate a notification that already exists',
              'Câu hỏi này vô nghĩa: GitHub vốn đã gửi email cho người khởi động ở mọi lần chạy hỏng, nên một bước thông báo tường minh chỉ nhân đôi một thông báo vốn đã có',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The shape of this answer is the same one the course keeps arriving at: a control that is really a PRECONDITION in disguise. Ten of eleven workflows are dispatch-only, so a human started every deploy and is watching its output — the script is the channel, and it cannot be missed because the person is already looking at it. That reasoning is sound and it is also fragile: it depends entirely on "a human started it", which is the assumption that dies the moment a schedule, a second operator or a push trigger enters the picture. Note that one workflow in this repository already carries both a cron and a dispatch trigger, so a scheduled run and a manual run genuinely can overlap. The honest formulation is not "we do not need notifications" but "we do not need them YET, and here is the condition".',
            'Hình dạng của đáp án này chính là hình dạng mà khoá học cứ đi tới: một biện pháp thật ra là một ĐIỀU KIỆN TIÊN QUYẾT trá hình. Mười trên mười một workflow chỉ chạy tay, nên một con người đã khởi động mọi cuộc deploy và đang xem đầu ra của nó — script chính là cái kênh, và nó không thể bị bỏ lỡ vì người ta vốn đã đang nhìn vào đó. Lập luận ấy vững, và nó cũng mong manh: nó phụ thuộc hoàn toàn vào vế "một con người đã khởi động nó", đúng cái giả định chết đi ngay khoảnh khắc một cái lịch, một người vận hành thứ hai hay một trigger push bước vào khung hình. Để ý rằng một workflow của kho này vốn đã mang cả cron lẫn dispatch, nên một lượt chạy theo lịch và một lượt chạy tay THẬT SỰ chồng lên nhau được. Cách phát biểu trung thực không phải "chúng ta không cần thông báo" mà là "chúng ta CHƯA cần, và đây là điều kiện".',
          ),
        }),

        /* ── Chương 10 — chẩn đoán bằng ca thật (8 câu) ─────────────────── */

        // q19 · đáp án B (1)
        mcq({
          prompt: B(
            'After a deploy, three routes are probed with an UNAUTHENTICATED <code>curl</code>:' + code(
              '/api/v1/gifs      -> 404\n' +
              '/api/v1/messages  -> 401\n' +
              '/api/v1/admin     -> 403',
            ) + 'What does each answer establish?',
            'Sau một cuộc deploy, ba route được thăm dò bằng <code>curl</code> KHÔNG XÁC THỰC:' + code(
              '/api/v1/gifs      -> 404\n' +
              '/api/v1/messages  -> 401\n' +
              '/api/v1/admin     -> 403',
            ) + 'Mỗi câu trả lời xác lập điều gì?',
          ),
          options: [
            B(
              '404 and 403 both mean the route is missing — one hides the absence behind a permission check — while 401 is the only answer that proves anything was deployed',
              '404 và 403 đều nghĩa là route vắng mặt — một cái giấu sự vắng mặt sau một phép kiểm quyền — còn 401 là câu trả lời duy nhất chứng minh có thứ gì đó đã được deploy',
            ),
            B(
              '404 = the route is NOT mounted, the fingerprint of a stale build. 401 = mounted and demanding auth, so this deploy DID ship it. 403 = mounted, you are authenticated, and you were refused — a PERMISSIONS problem, not a deploy problem',
              '404 = route CHƯA mount, dấu vân tay của một bản dựng cũ. 401 = đã mount và đang đòi xác thực, nên cuộc deploy này CÓ ship nó. 403 = đã mount, bạn đã xác thực, và bị từ chối — một vấn đề QUYỀN, không phải vấn đề deploy',
            ),
            B(
              'All three prove the deploy succeeded, since any HTTP response at all means the container is running and serving; only a connection refusal would indicate a bad deploy',
              'Cả ba đều chứng minh cuộc deploy thành công, vì bất kỳ phản hồi HTTP nào cũng nghĩa là container đang chạy và đang phục vụ; chỉ một cú từ chối kết nối mới cho thấy một cuộc deploy hỏng',
            ),
            B(
              'Only the 401 is informative; 404 and 403 both depend on middleware ordering and therefore cannot distinguish a missing route from a protected one',
              'Chỉ 401 là có thông tin; 404 và 403 đều phụ thuộc thứ tự middleware nên không phân biệt được một route vắng mặt với một route được bảo vệ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'On 2026-07-02 two features broke at once, both survived a fresh login, and the obvious hypothesis was a shared auth bug — two hours went into the auth code and found nothing wrong with it. Two unauthenticated requests settled it in seconds: one route answered 404 and the other 401, which are two DIFFERENT failures wearing the same costume. The 404 was a stale image that never mounted <code>/api/v1/gifs</code>; the other was a per-viewer <code>deletedAt</code> filter working exactly as designed. That is why <code>deploy.sh</code> now smoke-tests core routes and FAILS the deploy on any 404. And note the tool: a browser retries, follows redirects, applies cookies, runs JavaScript and shows an error page for everything — the worst possible instrument for isolating a break, and the default one for reporting it.',
            'Ngày 02/07/2026 hai tính năng cùng hỏng, cả hai đều sống sót qua một lần đăng nhập lại, và giả thuyết hiển nhiên là một lỗi auth dùng chung — hai tiếng đồng hồ đổ vào mã auth và chẳng tìm ra gì sai. Hai request không xác thực phân xử chuyện đó trong vài giây: một route trả 404 còn cái kia trả 401, tức HAI cú hỏng KHÁC NHAU mặc cùng một bộ đồ. Cú 404 là một cái ảnh cũ chưa từng mount <code>/api/v1/gifs</code>; cú kia là bộ lọc <code>deletedAt</code> theo từng người xem chạy đúng như thiết kế. Đó là lý do <code>deploy.sh</code> bây giờ smoke-test các route lõi và LÀM HỎNG cuộc deploy nếu có bất kỳ cú 404 nào. Và để ý cái công cụ: một trình duyệt thì thử lại, đi theo redirect, áp cookie, chạy JavaScript và hiện một trang lỗi cho mọi thứ — công cụ tệ nhất có thể để cô lập một cú vỡ, và là công cụ mặc định để BÁO CÁO một cú vỡ.',
          ),
        }),

        // q20 · đáp án D (3)
        mcq({
          prompt: B(
            'A schema change passed every item of a pre-push checklist and then broke on production. The chapter turns the case into four audit questions. Which set is right?',
            'Một thay đổi lược đồ qua sạch mọi mục của một checklist trước khi push rồi vỡ trên production. Chương này biến ca ấy thành bốn câu hỏi soát. Bộ nào ĐÚNG?',
          ),
          options: [
            B(
              'Which tests are slowest, which are flakiest, which are skipped, and which have never failed — the four questions that identify a checklist nobody trusts',
              'Test nào chậm nhất, cái nào chập chờn nhất, cái nào bị bỏ qua, và cái nào chưa bao giờ hỏng — bốn câu hỏi nhận ra một checklist chẳng ai tin',
            ),
            B(
              'Who wrote the checklist, when it was last reviewed, who signs off on changes to it, and whether it is enforced by branch protection',
              'Ai viết cái checklist, lần rà gần nhất là khi nào, ai duyệt các thay đổi của nó, và nó có được branch protection cưỡng chế không',
            ),
            B(
              'Which step is most expensive, which can be parallelised, which can be cached, and which can be moved off the critical path — the four questions that make a checklist affordable enough to keep',
              'Bước nào tốn kém nhất, cái nào song song hoá được, cái nào cache được, và cái nào nhấc khỏi đường tới hạn được — bốn câu hỏi khiến một checklist đủ rẻ để giữ lại',
            ),
            B(
              'What does the checklist LITERALLY include (read the <code>include</code> and <code>exclude</code> lines), what code is COPIED across a boundary, what code runs against production data at deploy time, and has anything ever actually RUN that file',
              'Checklist bao gồm gì theo NGHĨA ĐEN (đọc các dòng <code>include</code> và <code>exclude</code>), mã nào bị CHÉP xuyên qua một ranh giới, mã nào chạy với dữ liệu production lúc deploy, và đã có gì thật sự CHẠY cái tệp đó bao giờ chưa',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The failure came from two individually defensible configuration decisions meeting: the type-checker\'s <code>rootDir</code> forced <code>prisma/**</code> out of its scope, and the seed script carried a hand-copied union of the enum, so it type-checked against ITSELF. Rename a value in the schema and both halves stayed perfectly consistent with each other while diverging from the database. Two generalisations come out of it: a checklist has COVERAGE and a codebase has SURFACE, and the gap between them is where surprises live; and <b>a type that is COPIED is a type nobody checks</b>. The fourth question is the one that would have caught it fastest — type-checking is not RUNNING, and one <code>db seed</code> against a local database finds it in seconds.',
            'Cú hỏng tới từ hai quyết định cấu hình mà xét riêng ra thì đều bảo vệ được, gặp nhau: <code>rootDir</code> của bộ kiểm kiểu đẩy <code>prisma/**</code> ra khỏi phạm vi của nó, và script seed lại mang một bản CHÉP TAY của cái union enum, nên nó tự kiểm với CHÍNH NÓ. Đổi tên một giá trị trong lược đồ thì hai nửa ấy vẫn nhất quán hoàn hảo với nhau trong khi cùng lệch khỏi cơ sở dữ liệu. Hai điều khái quát rút ra: một checklist có ĐỘ PHỦ còn một codebase có BỀ MẶT, và khoảng cách giữa hai cái là chỗ những bất ngờ sống; và <b>một kiểu ĐƯỢC CHÉP là một kiểu KHÔNG AI kiểm</b>. Câu hỏi thứ tư là câu bắt được nó nhanh nhất — kiểm kiểu KHÔNG phải chạy, và một lệnh <code>db seed</code> trên một cơ sở dữ liệu cục bộ tìm ra nó trong vài giây.',
          ),
        }),

        // q21 · đáp án D (3)
        mcq({
          prompt: B(
            'A deploy script has carried this frontend health check for weeks:' + code(
              'for i in 1..6; do\n' +
              '  docker exec frontend wget -q -O - localhost:3000/ || sleep 5\n' +
              'done',
            ) + 'The frontend image deliberately ships neither <code>wget</code> nor <code>curl</code>. What was actually happening, and what is the meta-fix?',
            'Một script deploy đã mang phép kiểm sức khoẻ frontend này suốt nhiều tuần:' + code(
              'for i in 1..6; do\n' +
              '  docker exec frontend wget -q -O - localhost:3000/ || sleep 5\n' +
              'done',
            ) + 'Chuyện gì thật sự đang xảy ra, và bản vá META là gì?',
          ),
          options: [
            B(
              'The check failed the deploy every time, and the team had been re-running deploys until one happened to pass — which is why the problem stayed invisible for weeks',
              'Phép kiểm làm hỏng cuộc deploy mọi lần, và nhóm đã cứ chạy lại deploy tới khi tình cờ có lượt qua — và đó là lý do vấn đề ẩn mình suốt nhiều tuần',
            ),
            B(
              'The check never ran at all, because <code>docker exec</code> against a container without a shell exits before the command is parsed, so the loop was a no-op costing nothing',
              'Phép kiểm chưa từng chạy, vì <code>docker exec</code> vào một container không có shell thì thoát trước khi câu lệnh được phân giải, nên vòng lặp là một lệnh rỗng chẳng tốn gì',
            ),
            B(
              'The check worked as intended: <code>|| sleep 5</code> is the standard retry idiom, and six attempts with a five-second gap is a reasonable readiness probe for a Next.js server',
              'Phép kiểm chạy đúng ý: <code>|| sleep 5</code> là lối viết thử-lại chuẩn, và sáu lượt cách nhau năm giây là một phép thăm dò sẵn-sàng hợp lý cho một máy chủ Next.js',
            ),
            B(
              'The check RAN, FAILED every iteration, and did not fail the deploy — <code>|| sleep 5</code> swallowed it, so it burned about 25 seconds per deploy while being unable to catch anything. The meta-fix is to verify the CHECKER before trusting it: deploy a commit that breaks the smoke path and confirm the check goes RED',
              'Phép kiểm CÓ chạy, CÓ hỏng ở mọi vòng lặp, và KHÔNG làm hỏng cuộc deploy — <code>|| sleep 5</code> đã nuốt nó, nên nó đốt khoảng 25 giây mỗi lần deploy trong khi không bắt được gì. Bản vá META là kiểm BỘ KIỂM trước khi tin nó: deploy một commit làm hỏng đường smoke rồi xác nhận phép kiểm chuyển ĐỎ',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The Dockerfile leaves both tools out on purpose — compose\'s healthcheck uses Node\'s own <code>http</code> module — so <code>wget: not found</code> was the outcome every single time. The concrete fix is to use what the image definitely has: <code>docker exec frontend node -e "require(\'http\').get(...)"</code>. The meta-fix is the one that generalises, and the chapter shows the same shape four more times in this course: a cache pointed at a directory that never existed, a <code>grep -c</code> that counted lines instead of matches, an exit code destroyed by a pipe three separate times, nine drifted copies of a block with nothing asserting they matched. Four rules follow — test the check with FAILING input, make it fail LOUDLY (never <code>|| sleep</code> or <code>|| true</code> on evidence), refuse a check whose absence is invisible, and watch three consecutive runs before believing it.',
            'Dockerfile cố ý bỏ cả hai công cụ — healthcheck của compose dùng chính module <code>http</code> của Node — nên <code>wget: not found</code> là kết cục ở mọi lần, không sót lần nào. Bản vá cụ thể là dùng thứ mà cái ảnh chắc chắn có: <code>docker exec frontend node -e "require(\'http\').get(...)"</code>. Bản vá META mới là cái khái quát được, và chương này chỉ ra cùng hình dạng ấy thêm bốn lần nữa trong khoá: một cái cache trỏ vào một thư mục chưa từng tồn tại, một lệnh <code>grep -c</code> đếm dòng thay vì đếm chỗ khớp, một mã thoát bị đường ống xoá sạch ba lần riêng biệt, chín bản chép đã trôi dạt của một khối mà không có gì khẳng định chúng giống nhau. Bốn quy tắc đi theo — kiểm phép kiểm bằng đầu vào HỎNG, bắt nó hỏng TO (đừng bao giờ <code>|| sleep</code> hay <code>|| true</code> trên một bằng chứng), từ chối một phép kiểm mà sự vắng mặt của nó vô hình, và xem ba lần chạy liên tiếp trước khi tin nó.',
          ),
        }),

        // q22 · đáp án C (2)
        mcq({
          prompt: B(
            'A restart script cannot free port 3000. Measured on the machine:' + code(
              '$ pkill -f "next start" ; echo "exit: $?"\n' +
              'exit: 0\n' +
              '$ lsof -ti:3000\n' +
              '14905\n' +
              '$ npm start\n' +
              'Error: listen EADDRINUSE: address already in use :::3000',
            ) + 'Why did a command that exited 0 leave the port busy?',
            'Một script khởi động lại không giải phóng nổi cổng 3000. Đo trên máy:' + code(
              '$ pkill -f "next start" ; echo "exit: $?"\n' +
              'exit: 0\n' +
              '$ lsof -ti:3000\n' +
              '14905\n' +
              '$ npm start\n' +
              'Error: listen EADDRINUSE: address already in use :::3000',
            ) + 'Vì sao một câu lệnh thoát 0 lại để cổng vẫn bận?',
          ),
          options: [
            B(
              '<code>pkill</code> sent the signal but the process ignores SIGTERM, so it needs <code>pkill -9 -f "next start"</code> to be killed — the exit code was reporting a successful SIGNAL, not a successful kill',
              '<code>pkill</code> có gửi tín hiệu nhưng tiến trình bỏ qua SIGTERM, nên phải <code>pkill -9 -f "next start"</code> mới giết được — mã thoát đang báo một cú GỬI TÍN HIỆU thành công, không phải một cú giết thành công',
            ),
            B(
              'The port is held by a socket in TIME_WAIT after the process died, so nothing was still running and the fix is to wait or set <code>SO_REUSEADDR</code>',
              'Cổng bị một socket ở trạng thái TIME_WAIT giữ sau khi tiến trình chết, nên chẳng có gì còn chạy và cách chữa là chờ hoặc đặt <code>SO_REUSEADDR</code>',
            ),
            B(
              'Node renamed the real server process to <code>next-server</code>, so the pattern matched only the LAUNCHER — that died, the server was reparented to init and kept the port, and <code>pkill</code> exited 0 because it did match something',
              'Node đã đổi tên tiến trình máy chủ thật thành <code>next-server</code>, nên mẫu chỉ khớp BỘ KHỞI ĐỘNG — cái đó chết, máy chủ được init nhận nuôi và vẫn giữ cổng, còn <code>pkill</code> thoát 0 vì nó CÓ khớp một thứ gì đó',
            ),
            B(
              '<code>lsof -ti:3000</code> reports the PID of the process that most recently bound the port, including one that has already exited, so 14905 is a stale entry and the real problem is elsewhere',
              '<code>lsof -ti:3000</code> báo PID của tiến trình gần nhất đã gắn vào cổng, kể cả một cái đã thoát, nên 14905 là một mục cũ và vấn đề thật nằm ở chỗ khác',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Three processes were involved — <code>npm start</code>, the <code>next</code> binary, and the actual server, whose <code>comm</code> Node had overwritten to <code>next-server (v15.3.4)</code>. A pattern written against the command line the human typed matches the launcher and nothing else. Kill it and the child is reparented and carries on holding the port, and <code>pkill</code> reports 0 because "at least one process was matched and signalled" is all a 0 ever meant. The trap generalises past this one command: <b>exit 0 is not a post-condition</b>. The right post-condition here is that <code>lsof -ti:3000</code> prints nothing, and the right way to kill is by the INVARIANT — the port for a daemon, the container name for a service, a PID for a supervised process. In production none of this bites, because a restart there REPLACES the container rather than killing a process by name.',
            'Có ba tiến trình dính vào — <code>npm start</code>, tệp nhị phân <code>next</code>, và cái máy chủ thật, mà Node đã ghi đè <code>comm</code> của nó thành <code>next-server (v15.3.4)</code>. Một mẫu viết theo dòng lệnh mà con người gõ ra thì khớp bộ khởi động và không khớp gì khác. Giết nó thì đứa con được nhận nuôi và tiếp tục giữ cổng, còn <code>pkill</code> báo 0 vì "ít nhất một tiến trình đã được khớp và được gửi tín hiệu" là tất cả những gì một số 0 từng có nghĩa. Cái bẫy ấy khái quát vượt qua một câu lệnh: <b>thoát 0 KHÔNG phải một hậu-điều-kiện</b>. Hậu-điều-kiện đúng ở đây là <code>lsof -ti:3000</code> không in gì, và cách giết đúng là giết theo BẤT BIẾN — cổng cho một daemon, tên container cho một service, một PID cho một tiến trình được theo dõi. Trên production thì chẳng cái nào cắn, vì một cú khởi động lại ở đó THAY container chứ không giết một tiến trình theo tên.',
          ),
        }),

        // q23 · đáp án B (1)
        mcq({
          prompt: B(
            'A page shows a loading spinner forever with no error anywhere. Its JavaScript bundle 404s, but the file is on disk:' + code(
              '$ curl -sI localhost:3000/_next/static/chunks/app/playground-a7c8f2.js\n' +
              'HTTP/1.1 404 Not Found\n' +
              '$ ls -la frontend/public/_next/static/chunks/app/playground-a7c8f2.js\n' +
              '-rw-r--r--  187294  Jul 30 14:22  playground-a7c8f2.js',
            ) + 'What does that pair of observations prove, as a general rule?',
            'Một trang quay vòng tải mãi mà không có lỗi nào ở đâu cả. Gói JavaScript của nó trả 404, nhưng tệp thì nằm trên đĩa:' + code(
              '$ curl -sI localhost:3000/_next/static/chunks/app/playground-a7c8f2.js\n' +
              'HTTP/1.1 404 Not Found\n' +
              '$ ls -la frontend/public/_next/static/chunks/app/playground-a7c8f2.js\n' +
              '-rw-r--r--  187294  Jul 30 14:22  playground-a7c8f2.js',
            ) + 'Cặp quan sát ấy chứng minh điều gì, dưới dạng một quy tắc chung?',
          ),
          options: [
            B(
              'The browser cached a 404 from an earlier request, so the file is being served correctly and the fix is a hard reload or a cache-busting query string',
              'Trình duyệt đã cache một cú 404 từ một request trước đó, nên tệp vẫn đang được phục vụ đúng và cách chữa là một lượt tải lại cứng hoặc một chuỗi truy vấn phá cache',
            ),
            B(
              'The process serving the file is answering from a SNAPSHOT taken before the file existed — Next reads the list of files in <code>public/</code> once at server START — so the cure is to restart the server, not to investigate further',
              'Tiến trình phục vụ tệp ấy đang trả lời từ một ẢNH CHỤP lấy trước khi tệp tồn tại — Next đọc danh sách tệp trong <code>public/</code> MỘT LẦN lúc server KHỞI ĐỘNG — nên cách chữa là khởi động lại server, chứ không phải điều tra tiếp',
            ),
            B(
              'File permissions are wrong: the server process cannot read a file the shell can, which is the only way a 404 and a successful <code>ls</code> can coexist',
              'Quyền tệp bị sai: tiến trình server không đọc được một tệp mà shell đọc được, và đó là cách duy nhất để một cú 404 và một lệnh <code>ls</code> thành công cùng tồn tại',
            ),
            B(
              'The content hash in the filename no longer matches the one in the HTML, so the page is requesting a bundle from a previous build and the file on disk belongs to the new one',
              'Mã băm nội dung trong tên tệp không còn khớp cái trong HTML, nên trang đang xin một gói của bản dựng trước còn tệp trên đĩa thuộc về bản mới',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Two false trails ate ninety minutes across two sessions, and both were fed by 200 OK responses: the HTML returned 200, and a preloaded <code>.ktx</code> asset returned 200 too, because its filename is fixed in source and does not change between builds. The bundle name, being content-hashed, DID change — and the running server was answering from a file list it built at startup, so a file created afterwards is on disk and not on the map. The rule is worth memorising in that shape: <b>a static asset 404s while <code>ls</code> shows it exists ⇒ the serving process holds a snapshot from before the file was created</b>. Nginx does the same thing with a <code>root</code> or <code>alias</code> resolved once. Production is immune here for a structural reason: the Dockerfile does <code>COPY . .</code> and only then <code>next build</code>, and every deploy is a fresh container.',
            'Hai lối mòn sai ăn mất chín mươi phút qua hai phiên, và cả hai đều được nuôi bằng những phản hồi 200 OK: HTML trả 200, và một tài sản <code>.ktx</code> được preload cũng trả 200, vì tên tệp của nó cố định trong mã nguồn và không đổi qua các lần dựng. Tên gói JS thì có mã băm nội dung nên nó CÓ đổi — và cái server đang chạy trả lời từ một danh sách tệp nó dựng lúc khởi động, nên một tệp tạo ra sau đó thì có trên đĩa mà không có trên bản đồ. Quy tắc đáng thuộc theo đúng hình dạng ấy: <b>một tài sản tĩnh trả 404 trong khi <code>ls</code> cho thấy nó tồn tại ⇒ tiến trình phục vụ nó đang giữ một ảnh chụp từ TRƯỚC khi tệp được tạo</b>. Nginx làm y hệt với một <code>root</code> hay <code>alias</code> đã phân giải một lần. Production miễn nhiễm ở đây vì một lý do cấu trúc: Dockerfile chạy <code>COPY . .</code> rồi mới <code>next build</code>, và mỗi cuộc deploy là một container mới tinh.',
          ),
        }),

        // q24 · đáp án A (0)
        mcq({
          prompt: B(
            'A migration failed part-way through on production and every subsequent deploy now exits with <code>P3009</code>:' + code(
              'STEP 1 (CREATE TABLE):  OK\n' +
              'STEP 2 (CREATE UNIQUE): OK\n' +
              'STEP 3 (ALTER TABLE):   ERROR — column already exists\n' +
              'STEP 4 (CREATE INDEX):  not run\n' +
              'STEP 5 (INSERT):        not run',
            ) + 'Which <code>prisma migrate resolve</code> flag is safe here?',
            'Một migration hỏng giữa chừng trên production và giờ mọi cuộc deploy tiếp theo đều thoát với <code>P3009</code>:' + code(
              'STEP 1 (CREATE TABLE):  OK\n' +
              'STEP 2 (CREATE UNIQUE): OK\n' +
              'STEP 3 (ALTER TABLE):   ERROR — column already exists\n' +
              'STEP 4 (CREATE INDEX):  not run\n' +
              'STEP 5 (INSERT):        not run',
            ) + 'Cờ <code>prisma migrate resolve</code> nào an toàn ở đây?',
          ),
          options: [
            B(
              'NEITHER. <code>--rolled-back</code> is correct only if the database is in its state BEFORE step 1, and <code>--applied</code> only if it is in its state AFTER step 5; a 3-of-5 state satisfies neither, so the first move is <code>prisma migrate diff</code> to MEASURE the drift',
              'KHÔNG CÁI NÀO. <code>--rolled-back</code> chỉ đúng nếu cơ sở dữ liệu đang ở trạng thái TRƯỚC bước 1, còn <code>--applied</code> chỉ đúng nếu nó ở trạng thái SAU bước 5; một trạng thái 3-trên-5 chẳng thoả cái nào, nên nước đi đầu tiên là <code>prisma migrate diff</code> để ĐO độ lệch',
            ),
            B(
              '<code>--rolled-back</code>, because the migration is recorded as failed and marking it rolled back lets the next deploy replay it from a clean slate',
              '<code>--rolled-back</code>, vì migration được ghi nhận là hỏng và đánh dấu nó đã hoàn tác sẽ cho cuộc deploy kế phát lại nó từ một tờ giấy trắng',
            ),
            B(
              '<code>--applied</code>, because three of the five statements succeeded and the remaining two are additive, so recording it as applied is the least destructive option',
              '<code>--applied</code>, vì ba trên năm câu lệnh đã thành công và hai câu còn lại chỉ là thêm vào, nên ghi nhận nó đã áp dụng là lựa chọn ít phá huỷ nhất',
            ),
            B(
              'Either one, as long as it is followed by <code>prisma migrate deploy</code> — the flag only edits the migration history table, and the next deploy reconciles the schema either way',
              'Cái nào cũng được, miễn là sau đó chạy <code>prisma migrate deploy</code> — cái cờ ấy chỉ sửa bảng lịch sử migration, và cuộc deploy kế hoà giải lược đồ theo cả hai đường',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Each flag asserts a STATE, and each is correct in exactly one. Mark it rolled back when steps 1 and 2 already ran and the replay hits <code>CREATE TABLE</code> on a table that exists — a shorter loop of the same P3009. Mark it applied when steps 3 to 5 never ran and the schema now disagrees with the code, first quietly and then loudly as later migrations pile onto it. The measurement is one command and it decides between them: <code>prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "$DATABASE_URL" --script</code> printed exactly two statements in the real case, which says steps 1 and 2 ran and 3 to 5 did not. Both repairs are then defensible; what is not defensible is choosing without measuring. And <code>P3009</code> is not a bug — it is Prisma refusing to make things worse.',
            'Mỗi cái cờ KHẲNG ĐỊNH một TRẠNG THÁI, và mỗi cái đúng ở đúng một trạng thái. Đánh dấu đã hoàn tác khi bước 1 và 2 vốn đã chạy thì lượt phát lại sẽ đâm vào <code>CREATE TABLE</code> trên một bảng đã tồn tại — một vòng lặp NGẮN HƠN của cùng cái P3009. Đánh dấu đã áp dụng khi bước 3 tới 5 chưa từng chạy thì lược đồ giờ không khớp mã, âm thầm trước rồi ồn ào sau khi các migration kế chồng lên. Phép đo chỉ là MỘT câu lệnh và nó phân xử giữa hai đường: <code>prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "$DATABASE_URL" --script</code> in ra đúng HAI câu lệnh trong ca thật, và điều đó nói rằng bước 1 với 2 đã chạy còn 3 tới 5 thì chưa. Khi ấy cả hai cách vá đều biện hộ được; thứ KHÔNG biện hộ được là chọn mà không đo. Và <code>P3009</code> không phải một cái lỗi — nó là Prisma từ chối làm mọi thứ tệ hơn.',
          ),
        }),

        // q25 · đáp án C (2)
        mcq({
          prompt: B(
            'To get past a blocked deploy, someone rewrites the failed migration\'s SQL with <code>CREATE TABLE IF NOT EXISTS</code> and re-deploys. The deploy completes and CI goes green. Why is this the silently-wrong fix?',
            'Để đi qua một cuộc deploy đang bị chặn, có người viết lại SQL của migration hỏng bằng <code>CREATE TABLE IF NOT EXISTS</code> rồi deploy lại. Cuộc deploy hoàn thành và CI chuyển xanh. Vì sao đây là bản vá SAI-ÂM-THẦM?',
          ),
          options: [
            B(
              'Because <code>IF NOT EXISTS</code> is not supported inside a Prisma migration, so the statement is skipped entirely and the table is never created on a fresh database',
              'Vì <code>IF NOT EXISTS</code> không được hỗ trợ bên trong một migration của Prisma, nên câu lệnh bị bỏ qua hoàn toàn và cái bảng không bao giờ được tạo trên một cơ sở dữ liệu mới',
            ),
            B(
              'Because idempotent DDL runs more slowly, and on a large table the extra existence check turns a fast migration into a long lock that blocks writes',
              'Vì DDL bất biến chạy chậm hơn, và trên một bảng lớn thì phép kiểm tồn tại thêm vào biến một migration nhanh thành một cú khoá dài chặn mọi lượt ghi',
            ),
            B(
              'Because the migration FILE in git now differs from the SQL that Prisma has already marked applied in other environments — so an environment rebuilt from scratch or restored from a backup applies the NEW file and ends up with a DIFFERENT schema from production',
              'Vì TỆP migration trong git giờ khác với cái SQL mà Prisma đã đánh dấu là đã áp dụng ở các môi trường khác — nên một môi trường dựng lại từ đầu hoặc phục hồi từ backup sẽ áp tệp MỚI và kết thúc với một lược đồ KHÁC production',
            ),
            B(
              'Because rewriting a migration invalidates its checksum, so Prisma refuses to run any later migration and the block simply moves to the next deploy',
              'Vì viết lại một migration làm hỏng checksum của nó, nên Prisma từ chối chạy mọi migration sau đó và cái chặn chỉ dời sang cuộc deploy kế',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The reason it is dangerous is precisely that it WORKS: the deploy finishes, CI is green, and everybody moves on. What has changed is the relationship between the file and the history — production carries a record saying "this migration was applied" that now points at SQL nobody ran there, and a staging environment rebuilt next month applies the edited file instead. You have introduced an ENVIRONMENT-DEPENDENT schema without noticing. The other tempting shortcut is worse and has a rule of its own: <code>prisma migrate reset</code> works on a laptop and means losing all the data on production. The six-step procedure in its place starts with STOP and ends with running the repair under approval, and the reason it belongs to CI at all is that a step running <code>prisma migrate deploy</code> re-runs on every subsequent deploy — which is how one failure becomes a lasting block.',
            'Lý do nó nguy hiểm chính là ở chỗ nó CHẠY ĐƯỢC: cuộc deploy hoàn thành, CI xanh, và mọi người đi tiếp. Thứ đã thay đổi là quan hệ giữa tệp và lịch sử — production mang một bản ghi nói "migration này đã được áp dụng" mà giờ nó trỏ vào một đoạn SQL chưa từng ai chạy ở đó, còn một môi trường staging dựng lại vào tháng sau sẽ áp cái tệp đã sửa. Bạn vừa đưa vào một lược đồ PHỤ THUỘC MÔI TRƯỜNG mà không nhận ra. Lối tắt cám dỗ còn lại thì tệ hơn và có luật riêng của nó: <code>prisma migrate reset</code> chạy tốt trên một cái laptop và nghĩa là MẤT SẠCH dữ liệu trên production. Quy trình sáu bước thay thế bắt đầu bằng DỪNG và kết thúc bằng việc chạy bản vá dưới sự phê duyệt, còn lý do chuyện này thuộc về CI là vì một bước chạy <code>prisma migrate deploy</code> sẽ chạy lại ở MỌI cuộc deploy sau — và đó là cách một cú hỏng trở thành một cái chặn kéo dài.',
          ),
        }),

        // q26 · đáp án D (3)
        mcq({
          prompt: B(
            'A workflow step that runs migrations is written like this. Two decisions in it are deliberate — which pair?' + code(
              '- name: Prisma migrate\n' +
              '  run: npx prisma migrate deploy\n' +
              '\n' +
              '- name: Halt if migrate failed\n' +
              '  if: failure()\n' +
              '  run: |\n' +
              '    echo "::error::Migration failed. Do NOT auto-resolve."\n' +
              '    exit 1',
            ),
            'Một bước workflow chạy migration được viết như sau. Hai quyết định trong đó là có chủ ý — cặp nào?' + code(
              '- name: Prisma migrate\n' +
              '  run: npx prisma migrate deploy\n' +
              '\n' +
              '- name: Halt if migrate failed\n' +
              '  if: failure()\n' +
              '  run: |\n' +
              '    echo "::error::Migration failed. Do NOT auto-resolve."\n' +
              '    exit 1',
            ),
          ),
          options: [
            B(
              '<code>::error::</code> is required for <code>if: failure()</code> to fire, and the explicit <code>exit 1</code> is what stops the remaining steps from running',
              '<code>::error::</code> là bắt buộc để <code>if: failure()</code> nổ, còn lệnh <code>exit 1</code> tường minh là thứ chặn các bước còn lại chạy tiếp',
            ),
            B(
              'The two steps are split so the migration can be retried independently, and <code>if: failure()</code> makes the second step the retry trigger',
              'Hai bước được tách ra để migration có thể thử lại độc lập, và <code>if: failure()</code> biến bước thứ hai thành cái kích hoạt lượt thử lại',
            ),
            B(
              '<code>exit 1</code> is redundant because the step already failed, and <code>if: failure()</code> is redundant because the implicit condition on every step is <code>always()</code>',
              '<code>exit 1</code> là thừa vì bước ấy vốn đã hỏng, và <code>if: failure()</code> cũng thừa vì điều kiện ngầm định trên mọi bước là <code>always()</code>',
            ),
            B(
              'The ABSENCE of <code>continue-on-error</code> on the migrate step — a tolerated migration failure would be exactly the wrong thing — and <code>::error::</code>, which lifts the message to the top of the run summary in red where a person will actually read it',
              'Sự VẮNG MẶT của <code>continue-on-error</code> trên bước migrate — một cú hỏng migration được dung thứ đúng là thứ sai nhất có thể — và <code>::error::</code>, thứ đưa thông báo lên đầu trang tóm tắt lần chạy bằng màu đỏ, chỗ mà một con người thật sự sẽ đọc',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A halt step only makes sense if nothing above it swallows the failure, which is why the absence of <code>continue-on-error</code> is a decision rather than an omission — and why the same file carries a comment saying never to add it, and never to chain <code>|| npx prisma migrate resolve --rolled-back</code> either. The purpose of halting is that the NEXT deploy stops too: a step running <code>prisma migrate deploy</code> re-runs by default on every deploy afterwards, so without a halt each new commit walks into the same failure and stops there. <code>::error::</code> is the workflow command that puts a message at the top of the run summary in red, which is where a human looking at a red run actually starts. And the implicit condition on a step is <code>success()</code>, not <code>always()</code> — without <code>if: failure()</code> the halt step would simply be skipped.',
            'Một bước dừng chỉ có nghĩa nếu không có gì phía trên nó nuốt mất cú hỏng, và đó là lý do sự VẮNG MẶT của <code>continue-on-error</code> là một quyết định chứ không phải một chỗ bỏ sót — cũng là lý do chính tệp ấy mang một chú thích dặn đừng bao giờ thêm nó vào, và cũng đừng bao giờ nối thêm <code>|| npx prisma migrate resolve --rolled-back</code>. Mục đích của việc dừng là cuộc deploy KẾ TIẾP cũng dừng: một bước chạy <code>prisma migrate deploy</code> mặc định sẽ chạy lại ở mọi cuộc deploy sau đó, nên nếu không dừng thì mỗi commit mới lại đâm vào đúng cú hỏng ấy rồi đứng lại. <code>::error::</code> là lệnh workflow đưa một thông báo lên đầu trang tóm tắt lần chạy bằng màu đỏ, đúng chỗ một con người nhìn vào một lần chạy đỏ bắt đầu đọc. Còn điều kiện ngầm định trên một bước là <code>success()</code> chứ không phải <code>always()</code> — thiếu <code>if: failure()</code> thì bước dừng ấy sẽ bị bỏ qua.',
          ),
        }),

        /* ── Chương 11 — cái sống sót qua đo đạc (4 câu) ────────────────── */

        // q27 · đáp án A (0)
        mcq({
          prompt: B(
            'The wrap-up sorts the course\'s rules into three columns. Which of these belongs in column one, "always true", and on what evidence?',
            'Bài ôn tổng xếp các luật của khoá vào ba cột. Mục nào dưới đây thuộc cột một, "LUÔN ĐÚNG", và dựa trên bằng chứng gì?',
          ),
          options: [
            B(
              '"A check that has never been RED is not a check" — evidenced by a smoke test that ran for weeks, failed every time, and could not fail the deploy because its failure was swallowed',
              '"Một phép kiểm CHƯA TỪNG ĐỎ thì không phải một phép kiểm" — bằng chứng là một smoke test chạy suốt nhiều tuần, hỏng mọi lần, và không làm hỏng nổi cuộc deploy vì cú hỏng của nó bị nuốt mất',
            ),
            B(
              '"A cache hit saves time" — evidenced by the 40% reduction measured on a cold versus warm <code>npm ci</code> in this repository',
              '"Một cú trúng cache thì tiết kiệm thời gian" — bằng chứng là mức giảm 40% đo được giữa một lượt <code>npm ci</code> lạnh và một lượt ấm trong kho này',
            ),
            B(
              '"Matrix jobs finish sooner than sequential ones" — evidenced by three platform builds starting within the same second of each other',
              '"Job ma trận xong sớm hơn job tuần tự" — bằng chứng là ba bản dựng nền tảng khởi động trong cùng một giây',
            ),
            B(
              '"A flaky test is infrastructure noise" — evidenced by the measured 20% failure rate that no code change was able to influence',
              '"Một bài test chập chờn là tiếng ồn hạ tầng" — bằng chứng là tỉ lệ hỏng 20% đo được mà không thay đổi mã nào tác động nổi',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The three distractors are all column TWO entries — things that are true only once you have measured them on the repository in front of you. A cache hit saves time SOMETIMES: this repository has a cache step pointed at a directory that has never existed. A matrix is faster when the work parallelises, and slower AND costlier when the legs contend for something shared, which is why you measure wall-clock rather than CPU time. A flake is more often a race in the test than noise in the infrastructure. Column one holds the rules that held everywhere they were tested: a workflow is only what its YAML says; both <code>@main</code> and <code>@v3</code> are movable references; a secret in an <code>echo</code> is a secret in the log; a check that has never been red is not a check; and a deploy is not a side effect of a push.',
            'Ba phương án nhiễu đều là các mục của cột HAI — những thứ chỉ đúng một khi bạn đã đo chúng trên chính cái kho trước mặt. Một cú trúng cache tiết kiệm thời gian ĐÔI KHI: kho này có một bước cache trỏ vào một thư mục chưa từng tồn tại. Một ma trận nhanh hơn khi công việc song song hoá được, và CHẬM HƠN cùng ĐẮT HƠN khi các nhánh tranh nhau một thứ dùng chung, và đó là lý do bạn đo thời gian ĐỒNG HỒ chứ không đo thời gian CPU. Một cú chập chờn thường là một cuộc đua trong chính bài test hơn là tiếng ồn của hạ tầng. Cột một giữ những luật đứng vững ở mọi nơi chúng được thử: một workflow chỉ là thứ YAML của nó nói; cả <code>@main</code> lẫn <code>@v3</code> đều là tham chiếu DI ĐỘNG; một bí mật trong một lệnh <code>echo</code> là một bí mật trong log; một phép kiểm chưa từng đỏ thì không phải một phép kiểm; và một cuộc deploy không phải hệ quả phụ của một cú push.',
          ),
        }),

        // q28 · đáp án C (2)
        mcq({
          prompt: B(
            'Column two of the wrap-up is headed "only true once you have measured it". One entry reads "matrix jobs are faster". What is the measured caveat?',
            'Cột hai của bài ôn tổng mang tiêu đề "chỉ đúng khi đã ĐO". Một mục ghi "job ma trận thì nhanh hơn". Chỗ dè dặt đã đo được là gì?',
          ),
          options: [
            B(
              'It is only true above four legs, because below that the per-job queue time dominates and a sequential run avoids paying it repeatedly',
              'Nó chỉ đúng khi có trên bốn nhánh, vì dưới mức đó thì thời gian xếp hàng của từng job lấn át và một lượt chạy tuần tự tránh được việc trả nó nhiều lần',
            ),
            B(
              'It is only true when <code>fail-fast</code> is disabled, since a cancelled leg has to be repeated and the repetition cancels out the parallel gain',
              'Nó chỉ đúng khi <code>fail-fast</code> bị tắt, vì một nhánh bị huỷ phải làm lại và lượt làm lại triệt tiêu phần lợi từ chạy song song',
            ),
            B(
              'It holds for work that parallelises cleanly, but legs that contend for a SHARED bottleneck — the npm registry, a docker layer upload — can be slower AND more expensive; measure WALL-CLOCK, not CPU time',
              'Nó đúng với việc song song hoá sạch sẽ, nhưng những nhánh tranh nhau một NÚT THẮT CHUNG — registry npm, một lượt tải lên tầng docker — có thể vừa CHẬM HƠN vừa đắt hơn; hãy đo thời gian ĐỒNG HỒ, không đo thời gian CPU',
            ),
            B(
              'It is never true on GitHub-hosted runners, because the concurrency limit serialises the legs anyway and the apparent parallelism is an artefact of the run summary',
              'Nó không bao giờ đúng trên runner do GitHub cấp, vì giới hạn đồng thời dù sao cũng tuần tự hoá các nhánh và cái vẻ song song chỉ là ảo giác của trang tóm tắt',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The distinction column two keeps drawing is between a belief and a measurement of THIS repository. Parallel legs help when they are genuinely independent; when they queue behind the same external resource they add cost — every leg is billed — without buying back wall-clock. Which is why the unit matters: CPU time will happily say a matrix is efficient while a person is still waiting. The same column holds three more entries with the same shape, and the operating law behind all of them is worth stating on its own: <b>measure before believing, because most "obvious" optimisations turn out to be wrong on the specific repository in front of you</b> — and the measurement is usually one command.',
            'Sự phân biệt mà cột hai cứ vạch ra là giữa một NIỀM TIN và một PHÉP ĐO trên CHÍNH cái kho này. Các nhánh song song giúp ích khi chúng thật sự độc lập; khi chúng xếp hàng sau cùng một tài nguyên bên ngoài thì chúng cộng thêm chi phí — mỗi nhánh đều bị tính tiền — mà không mua lại được thời gian đồng hồ. Và đó là lý do ĐƠN VỊ quan trọng: thời gian CPU sẽ vui vẻ nói rằng một ma trận là hiệu quả trong khi một con người vẫn đang ngồi chờ. Cùng cột ấy còn ba mục nữa cùng hình dạng, và cái luật vận hành đứng sau tất cả đáng phát biểu riêng ra: <b>hãy ĐO trước khi tin, vì hầu hết các phép tối ưu "hiển nhiên" đều hoá ra là SAI trên chính cái kho cụ thể trước mặt bạn</b> — và phép đo thường chỉ là một câu lệnh.',
          ),
        }),

        // q29 · đáp án [1, 3] — chọn HAI
        mcq({
          prompt: B(
            'The wrap-up names five CLASSES of failure so you can recognise them on a repository you have never seen. Choose TWO pairings of class and diagnostic handle that are correct.',
            'Bài ôn tổng gọi tên năm LỚP hỏng để bạn nhận ra chúng trên một kho chưa từng thấy. Chọn HAI cặp lớp-hỏng và cách-chẩn ĐÚNG.',
          ),
          options: [
            B(
              'Stale asset: the code you are looking at is not the code that ran — diagnose by reading the deploy log for the image digest',
              'Tài sản cũ: mã bạn đang nhìn không phải mã đã chạy — chẩn bằng cách đọc log deploy tìm mã băm của ảnh',
            ),
            B(
              'A name-based signal in a process that renames itself: match on an INVARIANT instead — the port for a daemon, the container name for a service, a PID for a supervised process',
              'Tín hiệu theo TÊN trong một tiến trình tự đổi tên: hãy khớp bằng một BẤT BIẾN — cổng cho một daemon, tên container cho một service, một PID cho một tiến trình được theo dõi',
            ),
            B(
              'A check that cannot fail: diagnose by counting how often it has failed in the last fifty runs — a check that has failed at least once is proven to work',
              'Một phép kiểm không thể hỏng: chẩn bằng cách đếm xem nó đã hỏng bao nhiêu lần trong năm mươi lần chạy gần nhất — một phép kiểm đã hỏng ít nhất một lần là đã chứng minh được nó chạy',
            ),
            B(
              'A STATE error mistaken for a COMMAND error: measure the drift with <code>migrate diff</code> BEFORE choosing which resolve action to take',
              'Một lỗi TRẠNG THÁI bị nhầm thành lỗi LỆNH: đo độ lệch bằng <code>migrate diff</code> TRƯỚC khi chọn hành động resolve nào',
            ),
          ],
          correct: [1, 3],
          explanation: EX(
            'Five classes, five handles. Stale asset — the code you see is not the code that ran; diagnose with an UNAUTHENTICATED <code>curl</code>, because a 404 where the file exists on disk is the fingerprint, and an image digest in a deploy log tells you which image shipped but not whether it contains the route. Checklist gap — the checklist runs what it is CONFIGURED to run and the failure is in what it excludes; read the <code>include</code> and <code>exclude</code> lines literally. A check that cannot fail — the handle is to BREAK the thing it checks and watch it go red, not to count past failures, because a check that failed for the wrong reason is still not a check. Name-based signal in a renaming process — match on the invariant. State error read as a command error — measure the drift first. The second operating law sits underneath two of these: <b>the self-fix that MATCHES the error message is usually wrong</b>, because the tool printed a solution that assumes it understood the problem, and it did not.',
            'Năm lớp, năm cái tay nắm. Tài sản cũ — mã bạn thấy không phải mã đã chạy; chẩn bằng một lệnh <code>curl</code> KHÔNG XÁC THỰC, vì một cú 404 ở chỗ tệp có thật trên đĩa mới là dấu vân tay, còn một mã băm ảnh trong log deploy chỉ cho biết ảnh nào đã ship chứ không cho biết nó có chứa cái route hay không. Lỗ hổng checklist — checklist chạy đúng thứ nó ĐƯỢC CẤU HÌNH chạy và cú hỏng nằm ở thứ nó loại trừ; hãy đọc các dòng <code>include</code> và <code>exclude</code> theo nghĩa đen. Một phép kiểm không thể hỏng — cái tay nắm là LÀM HỎNG thứ nó kiểm rồi xem nó có đỏ không, chứ không phải đếm những lần hỏng đã qua, vì một phép kiểm hỏng vì lý do sai thì vẫn không phải một phép kiểm. Tín hiệu theo tên trong một tiến trình tự đổi tên — khớp bằng bất biến. Lỗi trạng thái bị đọc thành lỗi lệnh — đo độ lệch trước. Luật vận hành thứ hai nằm dưới hai trong số đó: <b>cú TỰ-VÁ KHỚP với thông báo lỗi thường là SAI</b>, vì công cụ vừa in ra một giải pháp giả định rằng nó đã HIỂU vấn đề, mà nó thì không.',
          ),
        }),

        // q30 · đáp án B (1)
        mcq({
          prompt: B(
            'You inherit a repository you have never seen. The wrap-up gives a five-step opening checklist. Which step is described correctly?',
            'Bạn tiếp quản một kho chưa từng thấy. Bài ôn tổng đưa ra một checklist năm bước để mở màn. Bước nào được mô tả ĐÚNG?',
          ),
          options: [
            B(
              'Read the README first to learn the intended workflow, then compare it against the workflow files to find where documentation and reality have diverged',
              'Đọc README trước để biết quy trình dự kiến, rồi đối chiếu nó với các tệp workflow để tìm chỗ tài liệu và thực tế đã lệch nhau',
            ),
            B(
              'Measure ONE build\'s cache hit rate by turning on <code>ACTIONS_STEP_DEBUG</code> for a single run and reading the REAL cache-miss lines — trust those, not what the YAML intended',
              'Đo tỉ lệ trúng cache của MỘT bản dựng bằng cách bật <code>ACTIONS_STEP_DEBUG</code> cho một lần chạy rồi đọc các dòng cache-miss THẬT — hãy tin những dòng ấy, đừng tin ý định của cái YAML',
            ),
            B(
              'Count how many workflows declare <code>timeout-minutes</code>, since a repository below 50% on that measure will eventually bill six hours for a hung job',
              'Đếm xem bao nhiêu workflow khai <code>timeout-minutes</code>, vì một kho dưới 50% ở chỉ số đó sớm muộn cũng bị tính tiền sáu tiếng cho một job treo',
            ),
            B(
              'Run <code>gh run list</code> with no filter and read the ten most recent runs, because the pass rate over a fixed window is the single most informative number about a repository',
              'Chạy <code>gh run list</code> không lọc gì rồi đọc mười lần chạy gần nhất, vì tỉ lệ qua trên một cửa sổ cố định là con số nhiều thông tin nhất về một kho',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Every step in the list has the same character: go to the artefact that cannot lie to you. Read the WORKFLOW FILES before the README, and grep them for <code>secrets.</code>, <code>uses:</code> and <code>run: |</code>. Count SHA-pinned against branch-pinned actions — below 50% is unusual. Grep for <code>|| true</code>, <code>continue-on-error</code> and <code>|| sleep</code>, which are the shapes a silent pass takes. Run <code>gh run list --status failure --limit 5</code> — filtered, because the question is whether the recent failures are the SAME one (something is being ignored) or all different (people are pushing broken code and cleaning up afterwards), and either way measure the frequency. And read the real cache-miss lines rather than the intent of the key. The trap at the end of the chapter is worth carrying too: treating the book as finished. The second time you diagnose a new failure, write it into your own notes with a DATE and a MEASUREMENT.',
            'Mọi bước trong danh sách đều có cùng một tính cách: đi tới cái hiện vật không nói dối bạn được. Đọc CÁC TỆP WORKFLOW trước khi đọc README, và grep chúng tìm <code>secrets.</code>, <code>uses:</code> và <code>run: |</code>. Đếm action ghim SHA so với action ghim nhánh — dưới 50% là bất thường. Grep tìm <code>|| true</code>, <code>continue-on-error</code> và <code>|| sleep</code>, đó là những hình dạng mà một cú qua-âm-thầm hay mặc. Chạy <code>gh run list --status failure --limit 5</code> — CÓ LỌC, vì câu hỏi là những cú hỏng gần đây có phải CÙNG MỘT cú không (tức có thứ gì đang bị bỏ qua) hay khác nhau cả (tức người ta đang đẩy mã vỡ lên rồi dọn sau), và đằng nào cũng phải đo TẦN SUẤT. Và hãy đọc các dòng cache-miss THẬT thay vì đọc ý định của cái khoá. Cái bẫy ở cuối chương cũng đáng mang theo: coi cuốn này là XONG. Lần THỨ HAI bạn chẩn đoán một cú hỏng mới, hãy viết nó vào ghi chú của chính bạn, kèm một NGÀY và một SỐ ĐO.',
          ),
        }),

        /* ── 2 câu lập trình ───────────────────────────────────────────── */

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Read a red run from its exit codes (chapter 8).</b> An exit code names the CLASS of a failure before you open any log — and a pipe destroys it. Model that. Each step is given as data:</p>' +
            code('{ ten, ong: [ma thoat cua tung chang], pipefail, orTrue, coe }') +
            '<p><code>ong</code> is the pipeline\'s <code>PIPESTATUS</code>, left to right. <code>orTrue</code> means the whole pipeline was suffixed with <code>|| true</code>. <code>coe</code> means the step declares <code>continue-on-error: true</code>. Write four functions.</p>' +
            '<ul>' +
            '<li><code>maOng(ong, pipefail)</code> — the pipeline\'s exit code. Without <code>pipefail</code> that is the LAST stage. With it, the RIGHTMOST stage that exited non-zero, or 0 when every stage succeeded. (Measured on GNU bash 3.2.57: <code>(exit 3) | (exit 5) | (exit 0)</code> gives 5, not 3.)</li>' +
            '<li><code>chanDoan(ma)</code> — the diagnosis string. <code>0</code> → <code>thanh cong</code>. <code>126</code> → <code>tim thay nhung khong chay duoc</code>. <code>127</code> → <code>khong tim thay lenh</code>. Anything strictly between 128 and 165 is a signal <code>n = ma - 128</code>: name it <code>bi tin hieu SIGINT</code> / <code>SIGABRT</code> / <code>SIGKILL</code> / <code>SIGTERM</code> for n = 2, 6, 9, 15 and <code>bi tin hieu so &lt;n&gt;</code> otherwise, then append <code> (tu bo cuoc)</code> when n is 6 and <code> (thu khac giet no)</code> when n is 9. Everything else → <code>loi cua chinh chuong trinh</code>.</li>' +
            '<li><code>maBuoc(maOng, orTrue)</code> — what the runner sees: <code>|| true</code> turns any code into 0.</li>' +
            '<li><code>ketQua(b)</code> — return <code>{ ma, maBuoc, outcome, conclusion, chanDoan }</code>. <code>outcome</code> is <code>success</code> when the step\'s code is 0 and <code>failure</code> otherwise; <code>conclusion</code> is the same EXCEPT that <code>continue-on-error</code> rewrites a <code>failure</code> into <code>success</code>. Note <code>chanDoan</code> reads the PIPELINE code, not the step code — that is the whole point: <code>|| true</code> hides the failure from the runner while the diagnosis is still there to be read.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing loop exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 31 — Đọc một lần chạy đỏ từ các mã thoát của nó (chương 8).</b> Một mã thoát gọi tên LỚP của cú hỏng trước khi bạn mở bất kỳ cái log nào — và một đường ống xoá sạch nó. Hãy mô hình hoá chuyện đó. Mỗi bước được cho dưới dạng dữ liệu:</p>' +
            code('{ ten, ong: [ma thoat cua tung chang], pipefail, orTrue, coe }') +
            '<p><code>ong</code> là <code>PIPESTATUS</code> của đường ống, từ trái sang phải. <code>orTrue</code> nghĩa là cả đường ống được gắn thêm <code>|| true</code> ở cuối. <code>coe</code> nghĩa là bước ấy khai <code>continue-on-error: true</code>. Hãy viết bốn hàm.</p>' +
            '<ul>' +
            '<li><code>maOng(ong, pipefail)</code> — mã thoát của đường ống. Không có <code>pipefail</code> thì đó là chặng CUỐI. Có nó thì là chặng khác-không nằm BÊN PHẢI NHẤT, hoặc 0 nếu mọi chặng đều thành công. (Đo trên GNU bash 3.2.57: <code>(exit 3) | (exit 5) | (exit 0)</code> ra 5, không phải 3.)</li>' +
            '<li><code>chanDoan(ma)</code> — chuỗi chẩn đoán. <code>0</code> → <code>thanh cong</code>. <code>126</code> → <code>tim thay nhung khong chay duoc</code>. <code>127</code> → <code>khong tim thay lenh</code>. Bất cứ giá trị nào lớn hơn 128 và nhỏ hơn 165 là một tín hiệu <code>n = ma - 128</code>: gọi tên nó là <code>bi tin hieu SIGINT</code> / <code>SIGABRT</code> / <code>SIGKILL</code> / <code>SIGTERM</code> với n = 2, 6, 9, 15 và <code>bi tin hieu so &lt;n&gt;</code> nếu khác, rồi nối thêm <code> (tu bo cuoc)</code> khi n bằng 6 và <code> (thu khac giet no)</code> khi n bằng 9. Còn lại → <code>loi cua chinh chuong trinh</code>.</li>' +
            '<li><code>maBuoc(maOng, orTrue)</code> — thứ runner nhìn thấy: <code>|| true</code> biến mọi mã thành 0.</li>' +
            '<li><code>ketQua(b)</code> — trả về <code>{ ma, maBuoc, outcome, conclusion, chanDoan }</code>. <code>outcome</code> là <code>success</code> khi mã của bước bằng 0 và <code>failure</code> nếu khác; <code>conclusion</code> giống hệt TRỪ chuyện <code>continue-on-error</code> viết lại một <code>failure</code> thành <code>success</code>. Lưu ý <code>chanDoan</code> đọc mã của ĐƯỜNG ỐNG chứ không đọc mã của bước — và đó chính là trọng tâm: <code>|| true</code> giấu cú hỏng khỏi runner trong khi phần chẩn đoán vẫn còn nguyên đó để mà đọc.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const BUOC = [\n' +
            "  { ten: 'npm test dat',            ong: [0],        pipefail: false, orTrue: false, coe: false },\n" +
            "  { ten: 'npm test truot',          ong: [1],        pipefail: false, orTrue: false, coe: false },\n" +
            "  { ten: 'go sai ten lenh',         ong: [127],      pipefail: false, orTrue: false, coe: false },\n" +
            "  { ten: 'chay mot thu muc',        ong: [126],      pipefail: false, orTrue: false, coe: false },\n" +
            "  { ten: 'node het bo nho (V8)',    ong: [134],      pipefail: false, orTrue: false, coe: false },\n" +
            "  { ten: 'runner giet vi OOM',      ong: [137],      pipefail: false, orTrue: false, coe: false },\n" +
            "  { ten: 'huy lan chay',            ong: [143],      pipefail: false, orTrue: false, coe: false },\n" +
            "  { ten: 'ong nuot loi (mac dinh)', ong: [137, 0],   pipefail: false, orTrue: false, coe: false },\n" +
            "  { ten: 'ong + pipefail',          ong: [137, 0],   pipefail: true,  orTrue: false, coe: false },\n" +
            "  { ten: 'ong ba nhanh, pipefail',  ong: [3, 5, 0],  pipefail: true,  orTrue: false, coe: false },\n" +
            "  { ten: 'ong ba nhanh, mac dinh',  ong: [3, 5, 0],  pipefail: false, orTrue: false, coe: false },\n" +
            "  { ten: 'ong 3|0|4, pipefail',     ong: [3, 0, 4],  pipefail: true,  orTrue: false, coe: false },\n" +
            "  { ten: 'ket thuc bang SIGSEGV',   ong: [139],      pipefail: false, orTrue: false, coe: false },\n" +
            "  { ten: 'bam Ctrl-C',              ong: [130],      pipefail: false, orTrue: false, coe: false },\n" +
            "  { ten: '|| true che mat loi',     ong: [1],        pipefail: false, orTrue: true,  coe: false },\n" +
            "  { ten: '|| true tren ong pipefail', ong: [137, 0], pipefail: true,  orTrue: true,  coe: false },\n" +
            "  { ten: 'continue-on-error',       ong: [1],        pipefail: false, orTrue: false, coe: true },\n" +
            "  { ten: 'continue-on-error ma dat', ong: [0],       pipefail: false, orTrue: false, coe: true },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function maOng(ong, pipefail) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function chanDoan(ma) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function maBuoc(ma, orTrue) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function ketQua(b) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const b of BUOC) {\n' +
            '  const r = ketQua(b);\n' +
            "  console.log(b.ten.padEnd(26) + 'PIPESTATUS=' + b.ong.join(' ').padEnd(8)\n" +
            "    + ' ong=' + String(r.ma).padEnd(4) + ' buoc=' + String(r.maBuoc).padEnd(4)\n" +
            "    + ' ' + r.outcome.padEnd(8) + '/' + r.conclusion.padEnd(8) + ' ' + r.chanDoan);\n" +
            '}\n',
          expectedOutput:
            'npm test dat              PIPESTATUS=0        ong=0    buoc=0    success /success  thanh cong\n' +
            'npm test truot            PIPESTATUS=1        ong=1    buoc=1    failure /failure  loi cua chinh chuong trinh\n' +
            'go sai ten lenh           PIPESTATUS=127      ong=127  buoc=127  failure /failure  khong tim thay lenh\n' +
            'chay mot thu muc          PIPESTATUS=126      ong=126  buoc=126  failure /failure  tim thay nhung khong chay duoc\n' +
            'node het bo nho (V8)      PIPESTATUS=134      ong=134  buoc=134  failure /failure  bi tin hieu SIGABRT (tu bo cuoc)\n' +
            'runner giet vi OOM        PIPESTATUS=137      ong=137  buoc=137  failure /failure  bi tin hieu SIGKILL (thu khac giet no)\n' +
            'huy lan chay              PIPESTATUS=143      ong=143  buoc=143  failure /failure  bi tin hieu SIGTERM\n' +
            'ong nuot loi (mac dinh)   PIPESTATUS=137 0    ong=0    buoc=0    success /success  thanh cong\n' +
            'ong + pipefail            PIPESTATUS=137 0    ong=137  buoc=137  failure /failure  bi tin hieu SIGKILL (thu khac giet no)\n' +
            'ong ba nhanh, pipefail    PIPESTATUS=3 5 0    ong=5    buoc=5    failure /failure  loi cua chinh chuong trinh\n' +
            'ong ba nhanh, mac dinh    PIPESTATUS=3 5 0    ong=0    buoc=0    success /success  thanh cong\n' +
            'ong 3|0|4, pipefail       PIPESTATUS=3 0 4    ong=4    buoc=4    failure /failure  loi cua chinh chuong trinh\n' +
            'ket thuc bang SIGSEGV     PIPESTATUS=139      ong=139  buoc=139  failure /failure  bi tin hieu so 11\n' +
            'bam Ctrl-C                PIPESTATUS=130      ong=130  buoc=130  failure /failure  bi tin hieu SIGINT\n' +
            '|| true che mat loi       PIPESTATUS=1        ong=1    buoc=0    success /success  loi cua chinh chuong trinh\n' +
            '|| true tren ong pipefail PIPESTATUS=137 0    ong=137  buoc=0    success /success  bi tin hieu SIGKILL (thu khac giet no)\n' +
            'continue-on-error         PIPESTATUS=1        ong=1    buoc=1    failure /success  loi cua chinh chuong trinh\n' +
            'continue-on-error ma dat  PIPESTATUS=0        ong=0    buoc=0    success /success  thanh cong',
          sampleSolution:
            "const TINHIEU = { 2: 'SIGINT', 6: 'SIGABRT', 9: 'SIGKILL', 15: 'SIGTERM' };\n\n" +
            'function maOng(ong, pipefail) {\n' +
            '  // Không pipefail: mã của chặng CUỐI — đây là chỗ một cú hỏng biến mất.\n' +
            '  if (!pipefail) return ong[ong.length - 1];\n' +
            '  // Có pipefail: chặng khác-không nằm BÊN PHẢI NHẤT (đo trên bash 3.2.57).\n' +
            '  for (let i = ong.length - 1; i >= 0; i--) if (ong[i] !== 0) return ong[i];\n' +
            '  return 0;\n' +
            '}\n\n' +
            'function chanDoan(ma) {\n' +
            "  if (ma === 0) return 'thanh cong';\n" +
            "  if (ma === 126) return 'tim thay nhung khong chay duoc';\n" +
            "  if (ma === 127) return 'khong tim thay lenh';\n" +
            '  if (ma > 128 && ma < 165) {\n' +
            '    const n = ma - 128;\n' +
            "    const ten = TINHIEU[n] ?? 'so ' + n;\n" +
            "    const them = n === 9 ? ' (thu khac giet no)' : n === 6 ? ' (tu bo cuoc)' : '';\n" +
            "    return 'bi tin hieu ' + ten + them;\n" +
            '  }\n' +
            "  return 'loi cua chinh chuong trinh';\n" +
            '}\n\n' +
            'function maBuoc(ma, orTrue) {\n' +
            '  return orTrue ? 0 : ma;\n' +
            '}\n\n' +
            'function ketQua(b) {\n' +
            '  const ma = maOng(b.ong, b.pipefail);\n' +
            '  const buoc = maBuoc(ma, b.orTrue);\n' +
            "  const outcome = buoc === 0 ? 'success' : 'failure';\n" +
            '  // continue-on-error viết lại conclusion, KHÔNG viết lại outcome.\n' +
            "  const conclusion = outcome === 'failure' && b.coe ? 'success' : outcome;\n" +
            '  // Chẩn đoán đọc mã của ĐƯỜNG ỐNG, nên nó vẫn đọc được qua một cái `|| true`.\n' +
            '  return { ma, maBuoc: buoc, outcome, conclusion, chanDoan: chanDoan(ma) };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Order a deploy so rollback stays possible (chapter 9).</b> A deploy swaps an image and applies a migration. Get the order wrong and the running image meets a schema it cannot use — which is the shape of the 2026-07-03 outage. Decide the order mechanically.</p>' +
            '<p>A schema is a list of columns <code>{ ten, batBuoc }</code>, where <code>batBuoc</code> means NOT NULL with no default. An image is <code>{ doc: [...], ghi: [...] }</code> — the columns it reads and the columns it writes. A change is one of <code>{ op: \'them\', cot }</code>, <code>{ op: \'xoa\', cot }</code>, <code>{ op: \'batBuoc\', cot }</code>. Write three functions.</p>' +
            '<ul>' +
            '<li><code>apDung(truoc, thayDoi)</code> — the schema after the changes, in order: <code>them</code> appends the column, <code>xoa</code> removes the column with that name, <code>batBuoc</code> sets <code>batBuoc: true</code> on the existing column of that name. Do not mutate the input.</li>' +
            '<li><code>songDuoc(anh, schema)</code> — can that image run against that schema? Every column it reads or writes must exist, AND every <code>batBuoc</code> column in the schema must be one the image writes (otherwise its inserts fail).</li>' +
            '<li><code>keHoach(ca)</code> — return <code>{ thuTu, rollbackDuoc, cotSau }</code>. Migrate-first is safe when the OLD image survives the NEW schema; swap-first is safe when the NEW image survives the OLD schema. Report <code>thu tu nao cung duoc</code> when both hold, <code>migrate truoc, roi trao anh</code> or <code>trao anh truoc, roi migrate</code> when exactly one does, and <code>TACH HAI LAN DEPLOY</code> when neither does. <code>rollbackDuoc</code> — can you go back to the old image once the migration has been applied? — is the migrate-first condition again, which is the point of the question. <code>cotSau</code> is the list of column names after the change, each with <code>!</code> appended when the column is <code>batBuoc</code>.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing loop exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 32 — Sắp thứ tự một cuộc deploy sao cho rollback vẫn còn khả thi (chương 9).</b> Một cuộc deploy tráo một cái ảnh và áp một migration. Sai thứ tự là cái ảnh đang chạy gặp một lược đồ nó dùng không được — đúng hình dạng của sự cố 03/07/2026. Hãy quyết định thứ tự ấy một cách MÁY MÓC.</p>' +
            '<p>Một lược đồ là một danh sách cột <code>{ ten, batBuoc }</code>, với <code>batBuoc</code> nghĩa là NOT NULL và không có giá trị mặc định. Một cái ảnh là <code>{ doc: [...], ghi: [...] }</code> — những cột nó đọc và những cột nó ghi. Một thay đổi là một trong <code>{ op: \'them\', cot }</code>, <code>{ op: \'xoa\', cot }</code>, <code>{ op: \'batBuoc\', cot }</code>. Hãy viết ba hàm.</p>' +
            '<ul>' +
            '<li><code>apDung(truoc, thayDoi)</code> — lược đồ SAU các thay đổi, theo thứ tự: <code>them</code> nối cột vào cuối, <code>xoa</code> gỡ cột mang tên ấy, <code>batBuoc</code> đặt <code>batBuoc: true</code> cho cột đang có mang tên ấy. Đừng làm thay đổi đầu vào.</li>' +
            '<li><code>songDuoc(anh, schema)</code> — cái ảnh ấy chạy được trên lược đồ ấy không? Mọi cột nó đọc hoặc ghi đều phải tồn tại, VÀ mọi cột <code>batBuoc</code> trong lược đồ đều phải nằm trong số cột mà ảnh có ghi (nếu không thì các lệnh chèn của nó hỏng).</li>' +
            '<li><code>keHoach(ca)</code> — trả về <code>{ thuTu, rollbackDuoc, cotSau }</code>. Migrate-trước an toàn khi ảnh CŨ sống nổi trên lược đồ MỚI; tráo-trước an toàn khi ảnh MỚI sống nổi trên lược đồ CŨ. Báo <code>thu tu nao cung duoc</code> khi cả hai đều thoả, <code>migrate truoc, roi trao anh</code> hoặc <code>trao anh truoc, roi migrate</code> khi đúng một cái thoả, và <code>TACH HAI LAN DEPLOY</code> khi không cái nào thoả. <code>rollbackDuoc</code> — quay về ảnh cũ được không, một khi migration đã áp? — chính là điều kiện migrate-trước một lần nữa, và đó là trọng tâm của câu hỏi. <code>cotSau</code> là danh sách tên cột sau thay đổi, mỗi cái nối thêm <code>!</code> khi cột ấy là <code>batBuoc</code>.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// Moi cot: { ten, batBuoc } — batBuoc = NOT NULL va KHONG co gia tri mac dinh.\n' +
            'const CA = [\n' +
            "  { ten: 'them cot nullable',\n" +
            "    truoc: [{ ten: 'id' }, { ten: 'name' }],\n" +
            "    thayDoi: [{ op: 'them', cot: { ten: 'bio' } }],\n" +
            "    cu:  { doc: ['id', 'name'], ghi: ['id', 'name'] },\n" +
            "    moi: { doc: ['id', 'name', 'bio'], ghi: ['id', 'name', 'bio'] } },\n\n" +
            "  { ten: 'them cot NOT NULL khong mac dinh',\n" +
            "    truoc: [{ ten: 'id' }, { ten: 'name' }],\n" +
            "    thayDoi: [{ op: 'them', cot: { ten: 'slug', batBuoc: true } }],\n" +
            "    cu:  { doc: ['id', 'name'], ghi: ['id', 'name'] },\n" +
            "    moi: { doc: ['id', 'name', 'slug'], ghi: ['id', 'name', 'slug'] } },\n\n" +
            "  { ten: 'xoa cot ma chi anh CU doc',\n" +
            "    truoc: [{ ten: 'id' }, { ten: 'legacy' }],\n" +
            "    thayDoi: [{ op: 'xoa', cot: { ten: 'legacy' } }],\n" +
            "    cu:  { doc: ['id', 'legacy'], ghi: ['id', 'legacy'] },\n" +
            "    moi: { doc: ['id'], ghi: ['id'] } },\n\n" +
            "  { ten: 'doi ten A -> B trong MOT lan',\n" +
            "    truoc: [{ ten: 'id' }, { ten: 'a' }],\n" +
            "    thayDoi: [{ op: 'xoa', cot: { ten: 'a' } }, { op: 'them', cot: { ten: 'b' } }],\n" +
            "    cu:  { doc: ['id', 'a'], ghi: ['id', 'a'] },\n" +
            "    moi: { doc: ['id', 'b'], ghi: ['id', 'b'] } },\n\n" +
            "  { ten: 'chuan bi truoc: them cot chua ai doc',\n" +
            "    truoc: [{ ten: 'id' }],\n" +
            "    thayDoi: [{ op: 'them', cot: { ten: 'b' } }],\n" +
            "    cu:  { doc: ['id'], ghi: ['id'] },\n" +
            "    moi: { doc: ['id'], ghi: ['id'] } },\n\n" +
            "  { ten: 'buoc 3 expand: bat NOT NULL sau backfill',\n" +
            "    truoc: [{ ten: 'id' }, { ten: 'b' }],\n" +
            "    thayDoi: [{ op: 'batBuoc', cot: { ten: 'b' } }],\n" +
            "    cu:  { doc: ['id', 'b'], ghi: ['id', 'b'] },\n" +
            "    moi: { doc: ['id', 'b'], ghi: ['id', 'b'] } },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function apDung(truoc, thayDoi) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function songDuoc(anh, schema) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function keHoach(ca) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const ca of CA) {\n' +
            '  const k = keHoach(ca);\n' +
            "  console.log(ca.ten.padEnd(46) + k.thuTu.padEnd(28)\n" +
            "    + ' rollback=' + String(k.rollbackDuoc).padEnd(6)\n" +
            "    + ' schema sau=[' + k.cotSau.join(',') + ']');\n" +
            '}\n',
          expectedOutput:
            'them cot nullable                             migrate truoc, roi trao anh  rollback=true   schema sau=[id,name,bio]\n' +
            'them cot NOT NULL khong mac dinh              TACH HAI LAN DEPLOY          rollback=false  schema sau=[id,name,slug!]\n' +
            'xoa cot ma chi anh CU doc                     trao anh truoc, roi migrate  rollback=false  schema sau=[id]\n' +
            'doi ten A -> B trong MOT lan                  TACH HAI LAN DEPLOY          rollback=false  schema sau=[id,b]\n' +
            'chuan bi truoc: them cot chua ai doc          thu tu nao cung duoc         rollback=true   schema sau=[id,b]\n' +
            'buoc 3 expand: bat NOT NULL sau backfill      thu tu nao cung duoc         rollback=true   schema sau=[id,b!]',
          sampleSolution:
            'function apDung(truoc, thayDoi) {\n' +
            '  let sau = truoc.map((cot) => ({ ...cot }));\n' +
            '  for (const t of thayDoi) {\n' +
            "    if (t.op === 'them') sau.push({ ...t.cot });\n" +
            "    else if (t.op === 'xoa') sau = sau.filter((cot) => cot.ten !== t.cot.ten);\n" +
            "    else if (t.op === 'batBuoc') {\n" +
            '      sau = sau.map((cot) => (cot.ten === t.cot.ten ? { ...cot, batBuoc: true } : cot));\n' +
            '    }\n' +
            '  }\n' +
            '  return sau;\n' +
            '}\n\n' +
            'function songDuoc(anh, schema) {\n' +
            '  const co = new Set(schema.map((cot) => cot.ten));\n' +
            '  for (const t of [...anh.doc, ...anh.ghi]) if (!co.has(t)) return false;\n' +
            '  // Một cột NOT NULL không mặc định mà ảnh KHÔNG ghi thì mọi lệnh chèn của nó hỏng.\n' +
            '  const ghi = new Set(anh.ghi);\n' +
            '  for (const cot of schema) if (cot.batBuoc && !ghi.has(cot.ten)) return false;\n' +
            '  return true;\n' +
            '}\n\n' +
            'function keHoach(ca) {\n' +
            '  const sau = apDung(ca.truoc, ca.thayDoi);\n' +
            '  const migrateTruoc = songDuoc(ca.cu, sau);    // ảnh CŨ phải sống qua lược đồ MỚI\n' +
            '  const traoTruoc = songDuoc(ca.moi, ca.truoc); // ảnh MỚI phải sống trên lược đồ CŨ\n' +
            '  let thuTu;\n' +
            "  if (migrateTruoc && traoTruoc) thuTu = 'thu tu nao cung duoc';\n" +
            "  else if (migrateTruoc) thuTu = 'migrate truoc, roi trao anh';\n" +
            "  else if (traoTruoc) thuTu = 'trao anh truoc, roi migrate';\n" +
            "  else thuTu = 'TACH HAI LAN DEPLOY';\n" +
            '  return {\n' +
            '    thuTu,\n' +
            '    // Quay về ảnh cũ SAU khi migration đã áp = đúng điều kiện migrate-trước.\n' +
            '    rollbackDuoc: migrateTruoc,\n' +
            "    cotSau: sau.map((cot) => cot.ten + (cot.batBuoc ? '!' : '')),\n" +
            '  };\n' +
            '}\n',
        }),
      ],
    },
  ],
};
