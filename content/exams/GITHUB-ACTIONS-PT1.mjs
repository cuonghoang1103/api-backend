/**
 * GitHub Actions — Progress Test 1 (Mục 0 → Chương 3).
 *
 * Đề tự soạn, bám sát `content/courses/github-actions/s00-intro.mjs` …
 * `s03-bieu-thuc.mjs`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong
 * phòng thi. PT là đề GIỮA KỲ nên dễ hơn FE một bậc: câu hỏi bám vào MỘT cơ
 * chế mỗi câu, không bắt gộp ba tầng lại như đề cuối khoá.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ MỌI KẾT QUẢ TRONG ĐỀ ĐỀU CHẠY THẬT, KHÔNG ĐOÁN
 * ────────────────────────────────────────────────────────────────────────────
 * Đo 10/09/2026 trên macOS 26.6.2 (darwin-arm64) · Node **v22.21.0** ·
 * GNU bash **3.2.57**. Bộ đồ nghề cài trong một thư mục nháp NGOÀI kho này
 * (không thêm gói nào vào `package.json`):
 *
 *   • **@actions/expressions 0.3.61** — bộ phân tích và đánh giá biểu thức
 *     `${{ }}` do CHÍNH GitHub xuất bản (github/actions-expressions). Mọi kết
 *     quả biểu thức, mọi phép ép kiểu, mọi so sánh chuỗi trong đề này là đầu
 *     ra của bộ máy ấy — kể cả lời giải mẫu của câu 32, đã đối chiếu 20/20 ca.
 *   • **js-yaml 4.2.0** — đúng bản nằm trong `node_modules` của kho này. Mọi
 *     bảng "viết X → đọc ra Y" là `yaml.load()` in ra.
 *   • **minimatch 9.0.9** — bản kho này đang dùng; dùng cho mọi câu về glob của
 *     `paths:`.
 *   • Phép nở `strategy.matrix` mô phỏng bằng Node theo đúng thuật toán tài
 *     liệu hoá, rồi **XÁC THỰC bằng chính ví dụ fruit/animal/color/shape trong
 *     tài liệu GitHub** — bản mô phỏng cho ra ĐÚNG sáu job như tài liệu liệt kê
 *     (kể cả thứ tự). Đó là bản mô phỏng dùng cho câu 31.
 *
 * ⚠️ **KHÔNG có câu nào dựa vào số đo THỜI GIAN.** Máy soạn đề đang chạy nhiều
 * tác vụ song song; con số nào không ổn định qua ba lượt thì đề hỏi CƠ CHẾ chứ
 * không hỏi con số. Mọi con số về kho (số workflow, số dòng, số lần chạy) đều
 * ghi rõ là "theo số đo của giáo trình" vì cây mã đang được nhiều phiên sửa
 * cùng lúc — `git ls-files` sáng nay ra 7.551 tệp, giáo trình đo 7.477.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ SÁU CHỖ MÁY KHÁC GIÁO TRÌNH — ĐỀ THEO MÁY
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. **Khoá `on:` KHÔNG thành boolean với bộ đọc YAML 1.2.** Bài 1.1 dạy
 *    `d[True]` giữ khối trigger còn `d.get("on")` trả rỗng — đúng với PyYAML
 *    (YAML 1.1). Đo bằng js-yaml 4.2.0: `yaml.load('on:\n  push:\n    branches:
 *    [main]')` ra `{"on":{"push":{"branches":["main"]}}}`, tức khoá là **chuỗi
 *    `"on"`**. Đề FE đã ghi chỗ này; PT1 **không có câu nào** dựa vào nó.
 *
 * 2. **Cùng bảng 1.1: `08` và `010`.** Giáo trình ghi `08` → chuỗi `'08'`.
 *    js-yaml cho ra **số 8**; `010` js-yaml cho **10** còn PyYAML cho **8**
 *    (bát phân). Hai dòng này PHỤ THUỘC BỘ ĐỌC ⇒ đề không hỏi. Những dòng đúng
 *    với CẢ HAI bộ đọc và đề CÓ dùng: `1.20`→1.2, `3.10`→3.1, `18.20`→18.2,
 *    `"3.10"`→chuỗi, `1.2.3`→chuỗi, và toàn bộ khối `|` `>` `|-` `>-`.
 *
 * 3. **`no` / `off` / `yes` / `on` làm GIÁ TRỊ cũng phụ thuộc bộ đọc.** Bảng
 *    `if:` của bài 3.3 ghi `no`→False, `off`→False (PyYAML). js-yaml 4.2.0 đọc
 *    `a: no` ra **chuỗi `"no"`**, `d: off` ra **chuỗi `"off"`**. Hệ quả rất
 *    nặng và chính giáo trình đã cảnh báo: dưới YAML 1.2 thì `if: off` là một
 *    CHUỖI khác rỗng ⇒ **ĐÚNG** ⇒ bước **CHẠY**, ngược hẳn ý người viết. Đề
 *    không hỏi `off`; câu 24 hỏi `if:` bằng những giá trị hai bộ đọc đồng ý.
 *
 * 4. **Bảng ép kiểu của bài 3.3 là CHÉP TỪ TÀI LIỆU, giáo trình tự nói vậy.**
 *    Đã đo lại bằng bộ máy của GitHub và **nó ĐÚNG**: `'0x1' == 1` → true,
 *    `'123' == 123` → true, `'abc' == 0` → false, `'' == 0` → true,
 *    `null == 0` → true, mảng rỗng là ĐÚNG (`!fromJSON('[]')` → false). Ghi
 *    lại đây vì từ nay nó là số ĐO chứ không còn là số CHÉP.
 *
 * 5. **`startsWith` và `endsWith` cũng KHÔNG phân biệt hoa thường.** Đo:
 *    `startsWith('Refs/Heads/main', 'refs/heads/')` → **true**;
 *    `endsWith('MAIN.YML', '.yml')` → **true**; và phép so sánh thứ tự cũng
 *    vậy — `'a' < 'B'` → **true**, `'apple' < 'Banana'` → **true**. Chương 3
 *    dạy rất kỹ về ép kiểu nhưng KHÔNG nói điều này ở đâu cả, và đề FE cũng
 *    mới chỉ ghi nhận cho `==` với `contains`. Câu 27 hỏi đúng chỗ này.
 *
 * 6. **`'10' > '9'` là FALSE.** Khi HAI vế đều là chuỗi, bộ máy so theo thứ tự
 *    chữ (đã hạ hoa thường) chứ không ép về số; chỉ khi hai vế KHÁC kiểu nó mới
 *    ép số — `'2' > 1` → true, `'abc' > 1` → false. Giáo trình chỉ nói "`==`
 *    luôn ép kiểu" và không phân biệt hai trường hợp này. Câu 26 hỏi chỗ đó.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ HAI CHỖ KHÔNG ĐO ĐƯỢC (nói rõ để không ai tưởng là đã kiểm)
 * ────────────────────────────────────────────────────────────────────────────
 *   • `always()`, `success()`, `failure()`, `cancelled()`, `hashFiles()` KHÔNG
 *     có trong `@actions/expressions` — chúng do runtime của runner cắm vào,
 *     bộ máy trả `Unrecognized function`. Câu 30 vì thế hỏi LUẬT THAY THẾ
 *     `success()` ngầm định (thứ tài liệu hoá rõ ràng), không hỏi giá trị.
 *   • Giáo trình (bài 1.2 và 3.3) khẳng định tham số `type: boolean` của
 *     `workflow_dispatch` "tới nơi dưới dạng CHUỖI". Đó là hành vi của
 *     `github.event.inputs.*`; context `inputs` thì có kiểu. Không có cách nào
 *     đo từ ngoài GitHub ⇒ **đề không hỏi**. Câu 25 chỉ hỏi bộ máy làm gì với
 *     một chuỗi `'false'`, thứ đã đo.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Phân bố câu theo mục giáo trình (tổng 30 trắc nghiệm + 2 lập trình):
 *    Mục 0 — CI giải quyết gì ..................  3   (câu 1–3)
 *    Ch 1  — tệp workflow, YAML, trigger, lọc ..  9   (câu 4–12)
 *    Ch 2  — job, runner, bước, ma trận ........  9   (câu 13–21)
 *    Ch 3  — biểu thức và context ..............  9   (câu 22–30)
 *    Lập trình: câu 31 (ma trận, Ch2) · câu 32 (biểu thức, Ch3)
 *
 * Cân vị trí đáp án — 28 câu một đáp án + 2 câu "chọn HAI" = 32 lượt:
 *    A 8 · B 8 · C 8 · D 8
 *    node -e "import('./content/exams/GITHUB-ACTIONS-PT1.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>q.kind==='MCQ').forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/GITHUB-ACTIONS-PT1.mjs --apply
 */
import { B, EX, code, c, ptInstructions, mcq, codeQ } from './_lib/ghactions-exam-kit.mjs';

export default {
  course: { slug: 'github-actions' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Sections 0–3 (the workflow file, triggers and filters, jobs and runners, expressions)',
        'Kiểm tra tiến độ 1 — Mục 0–3 (tệp workflow, kích hoạt và bộ lọc, job và runner, biểu thức)',
      ),
      description: B(
        'The first third of the GitHub Actions course: what a green run actually claims, the workflow file and the traps that come from it being YAML, what starts a run and what silently starts nothing, a job as a whole machine, steps and exit codes, the matrix, and the expression language that runs before the shell exists. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba đầu của khoá GitHub Actions: một lần chạy xanh thật sự khẳng định gì, tệp workflow và những cái bẫy tới từ chuyện nó là YAML, cái gì khởi động một lần chạy và cái gì âm thầm không khởi động gì, một job như cả một cỗ máy, bước và mã thoát, ma trận, và ngôn ngữ biểu thức chạy trước khi shell tồn tại. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–3'),
      questions: [

        /* ── Mục 0 — CI thật ra giải quyết vấn đề gì (3 câu) ──────────── */

        // q1 · đáp án C (2)
        mcq({
          prompt: B(
            'A desktop build is green on the developer\'s own machine in 20 seconds. The same commit, on a GitHub runner, exits 134 on the macOS leg only, with ' + c('FATAL ERROR: Reached heap limit') + '. Which statement best describes what the local run was unable to establish?',
            'Một bản dựng desktop xanh trên máy của chính người viết trong 20 giây. Vẫn commit ấy, trên runner của GitHub, thoát 134 và chỉ ở nhánh macOS, kèm ' + c('FATAL ERROR: Reached heap limit') + '. Phát biểu nào mô tả đúng nhất cái mà lần chạy ở máy KHÔNG thể xác lập?',
          ),
          options: [
            B(
              'Nothing was missed: a local build and a CI build execute the same commands, so a green local build and a red CI build can only mean the runner image is faulty and should be pinned to an older version',
              'Không bỏ sót gì: dựng ở máy và dựng trên CI chạy cùng những câu lệnh, nên máy xanh mà CI đỏ chỉ có thể nghĩa là ảnh runner bị lỗi và nên ghim về một bản cũ hơn',
            ),
            B(
              'Only the missing step: the local build skipped a step the workflow runs, and adding that step locally would reproduce every difference between the two environments',
              'Chỉ mỗi bước bị bỏ: bản dựng ở máy đã bỏ qua một bước mà workflow có chạy, và thêm bước ấy vào máy là tái lập được mọi khác biệt giữa hai môi trường',
            ),
            B(
              'That the build survives on a DIFFERENT machine — one with different memory, and with none of the uncommitted files or globally installed tools the developer\'s machine happens to have',
              'Rằng bản dựng sống nổi trên một cái MÁY KHÁC — một cái có bộ nhớ khác, và không có file chưa commit lẫn công cụ cài toàn cục mà máy của người viết tình cờ đang có',
            ),
            B(
              'That the code is correct: exit 134 is a memory signal rather than a test failure, so the only thing left unproven is whether the program produces the right answers',
              'Rằng mã ĐÚNG: 134 là tín hiệu bộ nhớ chứ không phải test hỏng, nên thứ duy nhất còn chưa được chứng minh là chương trình có ra kết quả đúng hay không',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Lesson 0.1 names four things a local check cannot see: files you have not committed, a dependency you installed globally once, <b>a different machine</b>, and a step you skipped. Exit 134 is V8 aborting on its own heap ceiling, and the ceiling is a property of the MACHINE — which is why the same commit is green in 20 seconds at home and red on the leg with the least memory. The cure needed two changes at once: <code>node --max-old-space-size=6144</code> for the renderer build, and <code>sourcemap: !process.env.CI</code>. Reproduced under a heap squeezed to 1600 MB: with sourcemaps exit 134, without them exit 0.',
            'Bài 0.1 gọi tên bốn thứ một phép kiểm ở máy không nhìn thấy: file bạn chưa commit, một phụ thuộc bạn cài toàn cục một lần, <b>một cái máy KHÁC</b>, và một bước bạn bỏ qua. Mã 134 là V8 tự bỏ cuộc ở trần heap của chính nó, mà cái trần ấy là tính chất của CỖ MÁY — nên cùng một commit xanh trong 20 giây ở nhà và đỏ ở đúng nhánh ít bộ nhớ nhất. Cách chữa cần hai thay đổi cùng lúc: <code>node --max-old-space-size=6144</code> cho bản dựng renderer, và <code>sourcemap: !process.env.CI</code>. Tái lập với heap bóp còn 1600 MB: có sourcemap thoát 134, không có thoát 0.',
          ),
        }),

        // q2 · đáp án B (1)
        mcq({
          prompt: B(
            'A job runs a 9-second type-check, a 12-second linter and a 90-second test suite. Which ordering does the course argue for, and on what ground?',
            'Một job chạy một phép kiểm kiểu 9 giây, một bộ lint 12 giây và một bộ test 90 giây. Khoá học lập luận cho thứ tự nào, và dựa trên căn cứ gì?',
          ),
          options: [
            B(
              'Tests first, because they are the only check that says anything about behaviour, and a type error found afterwards is cheap to fix anyway once you already know the tests pass',
              'Test trước, vì đó là phép kiểm duy nhất nói được điều gì đó về hành vi, và một lỗi kiểu tìm ra sau đó thì dù sao cũng rẻ để sửa một khi đã biết test qua',
            ),
            B(
              'Cheapest and most likely to fail first, because steps run in order and stop at the first failure — so a 9-second answer should never be sitting behind a 90-second one',
              'Rẻ nhất và dễ hỏng nhất trước, vì các bước chạy tuần tự và dừng ở cú hỏng đầu tiên — nên một câu trả lời 9 giây không đáng ngồi sau một câu 90 giây',
            ),
            B(
              'Any order at all, because the steps of a job run in parallel on the same runner and the job\'s total duration is the duration of its slowest step regardless of how you list them',
              'Thứ tự nào cũng được, vì các bước của một job chạy song song trên cùng runner và tổng thời gian của job bằng bước chậm nhất bất kể bạn liệt kê thế nào',
            ),
            B(
              'Slowest first, so the expensive work starts while the runner is still warm, and the quick checks fill the time that the long one would otherwise leave idle at the end',
              'Chậm nhất trước, để việc tốn kém bắt đầu lúc runner còn ấm, còn các phép kiểm nhanh lấp vào khoảng thời gian mà việc dài kia sẽ bỏ trống ở cuối',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Steps inside a job are <b>sequential</b> on one machine and the job <b>stops at the first failure</b> — that is the whole reason order matters. Lesson 0.2 states it plainly: a type error that costs nine seconds to find should not be queued behind a test suite that costs ninety. This is also why <code>actions/checkout</code> and <code>setup-node</code> come first: everything else depends on them, so a failure there is worth finding immediately.',
            'Các bước bên trong một job chạy <b>tuần tự</b> trên một cỗ máy và job <b>dừng ở cú hỏng đầu tiên</b> — đó chính là lý do thứ tự quan trọng. Bài 0.2 nói thẳng: một lỗi kiểu tốn chín giây để tìm ra thì không nên xếp sau một bộ test tốn chín mươi giây. Đây cũng là lý do <code>actions/checkout</code> và <code>setup-node</code> đứng đầu: mọi thứ khác phụ thuộc chúng, nên hỏng ở đó thì đáng biết ngay.',
          ),
        }),

        // q3 · đáp án D (3)
        mcq({
          prompt: B(
            'The numbers in this course come from one repository — 11 workflows, and every timing read back from real runs through the API. What does the course say actually transfers to a repository you have never seen?',
            'Các con số trong khoá này tới từ một kho — 11 workflow, và mọi số đo đọc ngược từ các lần chạy thật qua API. Khoá học nói cái gì mới THẬT SỰ chuyển được sang một kho bạn chưa từng thấy?',
          ),
          options: [
            B(
              'The absolute numbers, because they were measured on GitHub-hosted runners, and GitHub-hosted runners are identical for every repository on the platform',
              'Các con số tuyệt đối, vì chúng được đo trên runner do GitHub cấp, mà runner do GitHub cấp thì giống hệt nhau với mọi kho trên nền tảng',
            ),
            B(
              'Nothing measurable: numbers from one repository are anecdotes, so the only transferable material in the course is the YAML syntax and the documented defaults',
              'Không có gì đo được: số của một kho là giai thoại, nên thứ duy nhất chuyển được trong khoá là cú pháp YAML và các giá trị mặc định đã tài liệu hoá',
            ),
            B(
              'The ranking of the platforms, because Windows is always about three times Linux and macOS always about twice Linux, in every step of every workflow',
              'Thứ hạng của các nền tảng, vì Windows luôn khoảng ba lần Linux và macOS luôn khoảng hai lần Linux, ở mọi bước của mọi workflow',
            ),
            B(
              'The RELATIONS between the numbers — which step dominates, which job sits on the critical path, which cost grows by multiplication — plus the method for measuring them again on your own repository',
              'Các QUAN HỆ giữa những con số — bước nào chiếm phần lớn, job nào nằm trên đường tới hạn, chi phí nào lớn lên bằng phép nhân — cộng với cách đo lại chúng trên chính kho của bạn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Lesson 0.4 states the trap directly: the numbers belong to ONE repository, and what transfers is the RELATION, not the number. The course backs this up itself — the same platform is 3.2× Linux at <code>npm ci</code> and 1.1× at the build step, so "Windows is three times slower" is not even true within one workflow. The method transfers too: <code>GET /repos/{owner}/{repo}/actions/runs/{id}/jobs</code> returns per-step timestamps for any repository you can read.',
            'Bài 0.4 nói thẳng cái bẫy: các con số thuộc về MỘT kho, và thứ chuyển được là QUAN HỆ, không phải con số. Chính khoá học tự chứng minh điều đó — cùng một nền tảng là 3,2× Linux ở <code>npm ci</code> nhưng 1,1× ở bước dựng, nên câu "Windows chậm gấp ba" thậm chí không đúng trong phạm vi một workflow. Phương pháp cũng chuyển được: <code>GET /repos/{owner}/{repo}/actions/runs/{id}/jobs</code> trả về dấu thời gian từng bước cho bất kỳ kho nào bạn đọc được.',
          ),
        }),

        /* ── Chương 1 — tệp workflow, YAML, kích hoạt, bộ lọc (9 câu) ──── */

        // q4 · đáp án A (0)
        mcq({
          prompt: B(
            'These three lines were parsed with js-yaml 4.2.0. What are the three values?' + code(
              'a: deploy #prod\n' +
              'b: "deploy #prod"\n' +
              'c: deploy#prod',
            ),
            'Ba dòng sau được phân giải bằng js-yaml 4.2.0. Ba giá trị là gì?' + code(
              'a: deploy #prod\n' +
              'b: "deploy #prod"\n' +
              'c: deploy#prod',
            ),
          ),
          options: [
            B(
              'a = "deploy" · b = "deploy #prod" · c = "deploy#prod"',
              'a = "deploy" · b = "deploy #prod" · c = "deploy#prod"',
            ),
            B(
              'a = "deploy #prod" · b = "deploy #prod" · c = "deploy#prod" — a comment needs its own line',
              'a = "deploy #prod" · b = "deploy #prod" · c = "deploy#prod" — chú thích phải nằm trên dòng riêng',
            ),
            B(
              'a = "deploy" · b = "deploy" · c = "deploy" — the parser strips from the hash in all three cases',
              'a = "deploy" · b = "deploy" · c = "deploy" — bộ đọc cắt từ dấu thăng trong cả ba trường hợp',
            ),
            B(
              'a = "deploy" · b = "deploy #prod" · c = "deploy" — an unquoted hash always starts a comment',
              'a = "deploy" · b = "deploy #prod" · c = "deploy" — một dấu thăng không nháy thì luôn mở đầu chú thích',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured with js-yaml 4.2.0, and the same three lines give the same three values under a YAML 1.1 reader. A <code>#</code> starts a comment only when it is <b>preceded by whitespace</b>; <code>deploy#prod</code> has no space, so the hash is an ordinary character in the scalar. Inside quotes the hash is always literal. And the important consequence for this course: inside a <code>run: |</code> block the hash is not a YAML comment at all — the SHELL sees it, which is a different reader with different rules.',
            'Đo bằng js-yaml 4.2.0, và ba dòng ấy cho ba giá trị y hệt dưới một bộ đọc YAML 1.1. Dấu <code>#</code> chỉ mở đầu chú thích khi nó <b>đứng sau một khoảng trắng</b>; <code>deploy#prod</code> không có dấu cách nên dấu thăng chỉ là một ký tự bình thường trong chuỗi. Nằm trong nháy thì dấu thăng luôn là chữ. Và hệ quả quan trọng cho khoá này: bên trong khối <code>run: |</code> thì dấu thăng KHÔNG phải chú thích YAML nữa — SHELL nhìn thấy nó, và đó là một bộ đọc khác với luật khác.',
          ),
        }),

        // q5 · đáp án C (2)
        mcq({
          prompt: B(
            'A folded block scalar, parsed with js-yaml 4.2.0. Note the middle line is indented two spaces deeper than the others. What string does <code>run</code> hold?' + code(
              'run: >\n' +
              '  npm ci\n' +
              '    npm run build\n' +
              '  npm test',
            ),
            'Một khối gấp dòng, phân giải bằng js-yaml 4.2.0. Chú ý dòng giữa thụt sâu hơn hai dòng kia hai dấu cách. Chuỗi trong <code>run</code> là gì?' + code(
              'run: >\n' +
              '  npm ci\n' +
              '    npm run build\n' +
              '  npm test',
            ),
          ),
          options: [
            B(
              '"npm ci npm run build npm test\\n" — a folded block joins every line with a space, and extra indentation is trimmed away like any other leading whitespace',
              '"npm ci npm run build npm test\\n" — khối gấp nối mọi dòng bằng dấu cách, còn phần thụt thừa bị cắt đi như mọi khoảng trắng đầu dòng khác',
            ),
            B(
              '"npm ci\\nnpm run build\\nnpm test\\n" — the deeper indentation makes js-yaml fall back to literal handling for the whole block',
              '"npm ci\\nnpm run build\\nnpm test\\n" — phần thụt sâu hơn khiến js-yaml quay về xử lý nguyên văn cho cả khối',
            ),
            B(
              '"npm ci\\n  npm run build\\nnpm test\\n" — a MORE-indented line is kept on its own line, with its extra indentation',
              '"npm ci\\n  npm run build\\nnpm test\\n" — dòng thụt SÂU HƠN được giữ trên dòng riêng, kèm cả phần thụt thừa',
            ),
            B(
              'A parse error: inside a folded block every line must sit at exactly the same indentation, so the deeper line is rejected',
              'Lỗi phân giải: bên trong một khối gấp mọi dòng phải nằm đúng cùng một mức thụt, nên dòng sâu hơn bị từ chối',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured: <code>yaml.load()</code> returns <code>"npm ci\\n  npm run build\\nnpm test\\n"</code>. Folding joins lines with a space, but a <b>more-indented line is exempt</b> — it keeps its own line and its extra indentation. So this block runs three commands, not one, purely by accident of whitespace. That is the second reason lesson 1.1 says never to use <code>&gt;</code> for <code>run:</code>; the first is that a plain folded block turns two commands into one <code>echo</code> with four arguments, which exits 0 and leaves CI green.',
            'Đo thật: <code>yaml.load()</code> trả về <code>"npm ci\\n  npm run build\\nnpm test\\n"</code>. Phép gấp nối các dòng bằng dấu cách, nhưng một <b>dòng thụt SÂU HƠN thì được miễn</b> — nó giữ dòng riêng và giữ luôn phần thụt thừa. Vậy khối này chạy ba câu lệnh chứ không phải một, thuần tuý do may rủi của khoảng trắng. Đó là lý do THỨ HAI khiến bài 1.1 nói đừng bao giờ dùng <code>&gt;</code> cho <code>run:</code>; lý do thứ nhất là một khối gấp bình thường biến hai câu lệnh thành một lệnh <code>echo</code> với bốn tham số, thoát 0 và để CI xanh.',
          ),
        }),

        // q6 · đáp án B (1)
        mcq({
          prompt: B(
            'A workflow author wants a branch filter that matches everything and writes it like this. What happens when the file is parsed?' + code(
              'on:\n' +
              '  push:\n' +
              '    branches:\n' +
              '      - *',
            ),
            'Một người viết workflow muốn một bộ lọc nhánh khớp mọi thứ và viết như sau. Chuyện gì xảy ra lúc phân giải tệp?' + code(
              'on:\n' +
              '  push:\n' +
              '    branches:\n' +
              '      - *',
            ),
          ),
          options: [
            B(
              'It parses to the string "*" and behaves as intended; quoting a lone asterisk is a style preference and changes nothing about the result',
              'Nó phân giải thành chuỗi "*" và chạy đúng ý; đặt nháy cho một dấu sao đơn độc là chuyện phong cách và không đổi kết quả gì',
            ),
            B(
              'The whole file fails to parse: a bare <code>*</code> starts a YAML ALIAS, and there is no anchor name after it',
              'Cả tệp không phân giải được: một dấu <code>*</code> trần mở đầu một ALIAS của YAML, mà phía sau nó không có tên anchor nào',
            ),
            B(
              'It parses to an empty list, so the filter matches no branch at all and the workflow silently stops running on every push',
              'Nó phân giải thành một danh sách rỗng, nên bộ lọc không khớp nhánh nào và workflow âm thầm thôi chạy ở mọi lần push',
            ),
            B(
              'It parses to null, and GitHub treats a null branch filter the same as omitting <code>branches:</code>, so the workflow runs on every branch',
              'Nó phân giải thành null, và GitHub coi bộ lọc nhánh null giống như bỏ hẳn <code>branches:</code>, nên workflow chạy trên mọi nhánh',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured with js-yaml 4.2.0: <code>name of an alias node must contain at least one character</code>. In YAML <code>&amp;</code> declares an anchor and <code>*</code> references one, so a bare asterisk is a reference to nothing. The same trap catches a negated pattern: <code>- !docs/**</code> unquoted gives <code>unknown tag</code>, because <code>!</code> introduces a tag. Both are cured the same way — quote it: <code>- \'*\'</code>, <code>- \'!docs/**\'</code>. This is the general rule from lesson 1.1 in its sharpest form: if a scalar could be read as something other than the string you meant, quote it.',
            'Đo bằng js-yaml 4.2.0: <code>name of an alias node must contain at least one character</code>. Trong YAML, <code>&amp;</code> khai một anchor còn <code>*</code> tham chiếu tới nó, nên một dấu sao trần là một tham chiếu tới hư không. Cùng cái bẫy đó bắt luôn mẫu phủ định: <code>- !docs/**</code> không nháy cho ra <code>unknown tag</code>, vì <code>!</code> mở đầu một tag. Cả hai chữa như nhau — đặt nháy: <code>- \'*\'</code>, <code>- \'!docs/**\'</code>. Đây chính là quy tắc chung của bài 1.1 ở dạng sắc nhất: nếu một vô hướng CÓ THỂ bị đọc thành thứ khác ngoài chuỗi bạn định nói, hãy đặt nháy.',
          ),
        }),

        // q7 · đáp án [1, 3] — chọn HAI
        mcq({
          prompt: B(
            'You add a workflow on a feature branch and push it. Choose TWO statements that are correct about what does and does not start.',
            'Bạn thêm một workflow trên một nhánh tính năng rồi push. Chọn HAI phát biểu ĐÚNG về cái gì khởi động và cái gì không.',
          ),
          options: [
            B(
              'A <code>schedule:</code> block in that file starts running on its cron immediately, because the schedule belongs to the file rather than to a branch',
              'Một khối <code>schedule:</code> trong tệp ấy bắt đầu chạy theo cron của nó ngay, vì cái lịch thuộc về tệp chứ không thuộc về một nhánh',
            ),
            B(
              'A <code>push:</code> trigger in that file does fire, because for push and pull_request GitHub uses the workflow file FROM the branch being pushed',
              'Một trigger <code>push:</code> trong tệp ấy CÓ nổ, vì với push và pull_request thì GitHub dùng tệp workflow LẤY TỪ chính nhánh đang được push',
            ),
            B(
              'A <code>workflow_dispatch:</code> block gives you a Run workflow button on that branch straight away, since dispatch reads whichever branch you select in the dropdown',
              'Một khối <code>workflow_dispatch:</code> cho bạn nút Run workflow trên nhánh ấy ngay lập tức, vì dispatch đọc bất kỳ nhánh nào bạn chọn trong dropdown',
            ),
            B(
              'A <code>schedule:</code> block does nothing at all until the file reaches the DEFAULT branch — no run, no warning, and nothing in the Actions tab to look at',
              'Một khối <code>schedule:</code> không làm gì hết cho tới khi tệp lên tới nhánh MẶC ĐỊNH — không lần chạy, không cảnh báo, và không có gì trong tab Actions để mà xem',
            ),
          ],
          correct: [1, 3],
          explanation: EX(
            'Lesson 1.2 splits the triggers by where GitHub reads the file from. <code>push</code> and <code>pull_request</code> read it from the branch in the event, so a new workflow tests itself on the very push that adds it. <code>schedule</code> and <code>workflow_dispatch</code> are read from the DEFAULT branch only: a cron on a feature branch never queues anything, and a dispatch button does not appear until the file is merged. The schedule case is the dangerous one, because there is no run to be missing from — you cannot notice the absence of something that was never queued.',
            'Bài 1.2 chia các trigger theo chỗ GitHub đọc tệp. <code>push</code> và <code>pull_request</code> đọc từ chính nhánh trong sự kiện, nên một workflow mới tự kiểm mình ngay ở cú push thêm nó vào. <code>schedule</code> và <code>workflow_dispatch</code> chỉ đọc từ nhánh MẶC ĐỊNH: một cron trên nhánh tính năng không bao giờ xếp hàng cái gì, còn nút dispatch không hiện ra cho tới khi tệp được gộp. Ca lịch mới là ca nguy hiểm, vì không có lần chạy nào để mà thiếu — bạn không thể nhận ra sự vắng mặt của một thứ chưa từng được xếp hàng.',
          ),
        }),

        // q8 · đáp án D (3)
        mcq({
          prompt: B(
            'This repository is in Vietnam (UTC+7, no daylight saving). You want a scheduled job to start at 03:00 Vietnam time. Which cron expression is right, and why?',
            'Kho này ở Việt Nam (UTC+7, không có giờ mùa hè). Bạn muốn một job theo lịch khởi động lúc 03:00 giờ Việt Nam. Biểu thức cron nào đúng, và vì sao?',
          ),
          options: [
            B(
              '<code>\'0 3 * * *\'</code> — GitHub reads the repository\'s timezone setting and converts the expression for you before scheduling',
              '<code>\'0 3 * * *\'</code> — GitHub đọc thiết lập múi giờ của kho rồi tự quy đổi biểu thức trước khi lên lịch',
            ),
            B(
              '<code>\'0 10 * * *\'</code> — you add the offset, because the runner is provisioned in the region closest to the repository owner',
              '<code>\'0 10 * * *\'</code> — cộng thêm độ lệch, vì runner được cấp ở vùng gần chủ kho nhất',
            ),
            B(
              '<code>\'0 3 * * *\'</code> with a <code>TZ:</code> key beside it, which is how cron expressions carry a timezone in GitHub Actions',
              '<code>\'0 3 * * *\'</code> kèm một khoá <code>TZ:</code> bên cạnh, đó là cách biểu thức cron mang theo múi giờ trong GitHub Actions',
            ),
            B(
              '<code>\'0 20 * * *\'</code> — cron is evaluated in UTC only, so 03:00 in UTC+7 is 20:00 UTC on the PREVIOUS day',
              '<code>\'0 20 * * *\'</code> — cron chỉ được tính theo UTC, nên 03:00 ở UTC+7 là 20:00 UTC của NGÀY HÔM TRƯỚC',
            ),
          ],
          correct: 3,
          explanation: EX(
            'GitHub evaluates <code>schedule:</code> in UTC — not the owner\'s timezone, not the runner\'s, and with no daylight-saving adjustment. Lesson 1.3 gives the conversions: <code>\'0 0 * * *\'</code> is 07:00 in Vietnam, <code>\'0 3 * * *\'</code> is 10:00, and <code>\'0 17 * * *\'</code> is midnight the NEXT day. Two more rules from the same lesson: the shortest interval GitHub accepts is 5 minutes, and a scheduled workflow in a public repository is disabled after 60 days with no activity.',
            'GitHub tính <code>schedule:</code> theo UTC — không theo múi giờ của chủ kho, không theo runner, và không chỉnh theo giờ mùa hè. Bài 1.3 cho sẵn phép quy đổi: <code>\'0 0 * * *\'</code> là 07:00 giờ Việt Nam, <code>\'0 3 * * *\'</code> là 10:00, còn <code>\'0 17 * * *\'</code> là nửa đêm HÔM SAU. Hai luật nữa từ cùng bài: khoảng ngắn nhất GitHub nhận là 5 phút, và một workflow theo lịch ở kho công khai bị tắt sau 60 ngày không hoạt động.',
          ),
        }),

        // q9 · đáp án A (0)
        mcq({
          prompt: B(
            'Inside a job triggered by <code>pull_request</code>, you need the SHA of the tip of the contributor\'s own branch — not the merge commit that <code>actions/checkout</code> takes by default. Which expression gives it?',
            'Bên trong một job kích hoạt bằng <code>pull_request</code>, bạn cần mã băm của ĐẦU nhánh của chính người đóng góp — không phải merge commit mà <code>actions/checkout</code> lấy theo mặc định. Biểu thức nào cho ra nó?',
          ),
          options: [
            B(
              '<code>github.event.pull_request.head.sha</code>',
              '<code>github.event.pull_request.head.sha</code>',
            ),
            B(
              '<code>github.sha</code>, which on a pull_request run already points at the branch head rather than at the merge commit',
              '<code>github.sha</code>, thứ mà trong một lần chạy pull_request vốn đã trỏ vào đầu nhánh chứ không phải merge commit',
            ),
            B(
              '<code>github.ref</code>, because on a pull_request run it resolves to the contributor\'s branch and its tip commit',
              '<code>github.ref</code>, vì trong một lần chạy pull_request nó phân giải ra nhánh của người đóng góp và commit đầu nhánh ấy',
            ),
            B(
              '<code>github.head_ref</code>, the standard way to read the tip commit of the source branch of a pull request',
              '<code>github.head_ref</code>, cách chuẩn để đọc commit đầu nhánh nguồn của một pull request',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 1.4 gives the whole table. <code>github.sha</code> on a pull_request run is the <b>merge commit</b> that GitHub computed at <code>refs/pull/&lt;N&gt;/merge</code> — a commit that exists on no branch and can never be reproduced. <code>github.ref</code> is that same merge ref, which is why <code>github.ref == \'main\'</code> is one of the conditions that never fires. <code>github.head_ref</code> is the branch NAME, a string, not a SHA. Only <code>github.event.pull_request.head.sha</code> names the contributor\'s own commit — and it is what you pass to <code>ref:</code> when you deliberately want it, which is exactly what makes <code>pull_request_target</code> dangerous.',
            'Bài 1.4 cho cả bảng. <code>github.sha</code> trong một lần chạy pull_request là <b>merge commit</b> mà GitHub đã tính ở <code>refs/pull/&lt;N&gt;/merge</code> — một commit không nằm trên nhánh nào và không bao giờ tái lập được. <code>github.ref</code> chính là cái merge ref ấy, và đó là lý do <code>github.ref == \'main\'</code> nằm trong nhóm điều kiện không bao giờ nổ. <code>github.head_ref</code> là TÊN nhánh, một chuỗi, không phải mã băm. Chỉ <code>github.event.pull_request.head.sha</code> mới gọi tên commit của chính người đóng góp — và đó là thứ bạn truyền vào <code>ref:</code> khi cố ý muốn nó, đúng cái làm cho <code>pull_request_target</code> trở nên nguy hiểm.',
          ),
        }),

        // q10 · đáp án C (2)
        mcq({
          prompt: B(
            'Twelve tracked paths were matched against four patterns with minimatch 9.0.9 (the matcher this repository uses). Read the result:' + code(
              'cac duong dan:\n' +
              '  README.md            package.json          package-lock.json\n' +
              '  src/index.ts         src/routes/gifs.ts    src/services/llm/gateway.ts\n' +
              '  docs/README.md       docs/adr/0001-ci.md   frontend/package.json\n' +
              '  frontend/src/app/page.tsx  .github/workflows/ci-lint.yml  prisma/schema.prisma\n' +
              '\n' +
              'mau              so duong dan khop\n' +
              '-------------------------------------\n' +
              'src/**                        3\n' +
              'src/*                         1\n' +
              '**/*.json                     3\n' +
              '*.json                        2',
            ) + 'Which reading of the last three rows is correct?',
            'Mười hai đường dẫn được so khớp với bốn mẫu bằng minimatch 9.0.9 (bộ so khớp kho này đang dùng). Đọc kết quả:' + code(
              'cac duong dan:\n' +
              '  README.md            package.json          package-lock.json\n' +
              '  src/index.ts         src/routes/gifs.ts    src/services/llm/gateway.ts\n' +
              '  docs/README.md       docs/adr/0001-ci.md   frontend/package.json\n' +
              '  frontend/src/app/page.tsx  .github/workflows/ci-lint.yml  prisma/schema.prisma\n' +
              '\n' +
              'mau              so duong dan khop\n' +
              '-------------------------------------\n' +
              'src/**                        3\n' +
              'src/*                         1\n' +
              '**/*.json                     3\n' +
              '*.json                        2',
            ) + 'Cách đọc nào về ba dòng cuối là ĐÚNG?',
          ),
          options: [
            B(
              '<code>src/*</code> matched once because only one file under <code>src/</code> has an extension the pattern accepts; adding <code>.ts</code> to the pattern would raise the count to three',
              '<code>src/*</code> khớp một lần vì chỉ một tệp dưới <code>src/</code> có phần mở rộng mà mẫu chấp nhận; thêm <code>.ts</code> vào mẫu sẽ nâng số khớp lên ba',
            ),
            B(
              '<code>*.json</code> matched two because minimatch caps a single-star pattern at two results; <code>**</code> removes the cap, which is why the row above it reads three',
              '<code>*.json</code> khớp hai vì minimatch giới hạn một mẫu một-sao ở hai kết quả; <code>**</code> gỡ giới hạn ấy, nên dòng trên nó ghi ba',
            ),
            B(
              'A single <code>*</code> does not cross a <code>/</code>: <code>src/*</code> reaches only the one file directly in <code>src/</code>, and <code>*.json</code> reaches only the two at the repository root',
              'Một dấu <code>*</code> KHÔNG vượt qua dấu <code>/</code>: <code>src/*</code> chỉ với tới một tệp nằm thẳng trong <code>src/</code>, còn <code>*.json</code> chỉ với tới hai tệp ở gốc kho',
            ),
            B(
              '<code>**/*.json</code> matched three and <code>*.json</code> matched two because <code>**</code> also matches dotted directories, and the difference between the rows is <code>.github/</code>',
              '<code>**/*.json</code> khớp ba còn <code>*.json</code> khớp hai vì <code>**</code> khớp cả thư mục có dấu chấm, và khác biệt giữa hai dòng là <code>.github/</code>',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured, not reasoned. One star stops at the separator: <code>src/*</code> matches <code>src/index.ts</code> and nothing deeper, and <code>*.json</code> matches <code>package.json</code> and <code>package-lock.json</code> but not <code>frontend/package.json</code>. Two stars cross it, so <code>src/**</code> reaches all three files under <code>src/</code> and <code>**/*.json</code> reaches the frontend one too. Lesson 1.5 measured the same rule on the whole repository, where <code>src/**</code> matched hundreds of files and <code>src/*</code> matched exactly one — writing <code>src/*</code> in a <code>paths:</code> filter takes CI away from everything but the entry point, with no error and no warning. The <code>.github/</code> row is a red herring here: <code>ci-lint.yml</code> is not a <code>.json</code> file.',
            'Đo thật, không suy luận. Một dấu sao dừng ở dấu phân cách: <code>src/*</code> khớp <code>src/index.ts</code> và không gì sâu hơn, còn <code>*.json</code> khớp <code>package.json</code> với <code>package-lock.json</code> nhưng không khớp <code>frontend/package.json</code>. Hai dấu sao thì vượt qua được, nên <code>src/**</code> với tới cả ba tệp dưới <code>src/</code> và <code>**/*.json</code> với luôn tệp bên frontend. Bài 1.5 đo cùng cái luật ấy trên cả kho, ở đó <code>src/**</code> khớp hàng trăm tệp còn <code>src/*</code> khớp đúng một — viết <code>src/*</code> trong một bộ lọc <code>paths:</code> là gỡ CI khỏi mọi thứ trừ điểm vào, không lỗi, không cảnh báo. Dòng <code>.github/</code> ở đây là mồi nhử: <code>ci-lint.yml</code> đâu phải tệp <code>.json</code>.',
          ),
        }),

        // q11 · đáp án B (1)
        mcq({
          prompt: B(
            'Someone audits this repository with one command and reports that a workflow is triggered by tags:' + code(
              '$ grep -l "tags:" .github/workflows/*.yml\n' +
              '.github/workflows/deploy-ghcr.yml',
            ) + 'The real count of tag-triggered workflows is zero. What went wrong, and what is the general lesson?',
            'Ai đó soi kho này bằng một câu lệnh và báo rằng có một workflow được kích hoạt theo tag:' + code(
              '$ grep -l "tags:" .github/workflows/*.yml\n' +
              '.github/workflows/deploy-ghcr.yml',
            ) + 'Số workflow kích hoạt theo tag thật ra là không. Sai ở đâu, và bài học chung là gì?',
          ),
          options: [
            B(
              '<code>grep -l</code> lists a file on the first match only; the audit should have used <code>grep -c</code> to see that the count was too low to be a real trigger block',
              '<code>grep -l</code> chỉ liệt kê tệp ở lần khớp đầu tiên; lẽ ra phải dùng <code>grep -c</code> để thấy số đếm quá thấp để là một khối trigger thật',
            ),
            B(
              'The match is a <code>tags:</code> key inside a <code>docker/build-push-action</code> step, where it names Docker image tags — the same key name is valid at several depths with different meanings',
              'Chỗ khớp là một khoá <code>tags:</code> nằm trong một bước <code>docker/build-push-action</code>, ở đó nó đặt tên nhãn ảnh Docker — cùng một tên khoá hợp lệ ở nhiều độ sâu với nghĩa khác nhau',
            ),
            B(
              'The file contains <code>tags-ignore:</code> and grep matched its prefix; searching for a key must always anchor the end of the word as well as the start',
              'Tệp ấy chứa <code>tags-ignore:</code> và grep khớp phần đầu của nó; tìm một khoá thì luôn phải neo cả cuối từ chứ không chỉ đầu từ',
            ),
            B(
              'The workflow is <code>workflow_dispatch</code>-only, and grep cannot know that a trigger block is inert; the fix is to check the Actions tab rather than the file',
              'Workflow ấy chỉ chạy bằng <code>workflow_dispatch</code>, và grep không thể biết một khối trigger là vô hiệu; cách sửa là xem tab Actions thay vì xem tệp',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Lesson 1.5 measures this exact false positive. YAML is nested, and <code>tags:</code>, <code>name:</code>, <code>env:</code>, <code>if:</code> and <code>permissions:</code> are all legal at several depths with entirely different meanings. A grep that ignores nesting answers a different question from the one you asked. Counting <b>inside the <code>on:</code> block</b> gives the real answer: zero of eleven workflows fire on a tag. The same trap has a sibling in this course — a script that counted <code>secrets.*</code> references with <code>grep -c</code> counted LINES and came up nine short.',
            'Bài 1.5 đo đúng cú dương tính giả này. YAML lồng nhau, và <code>tags:</code>, <code>name:</code>, <code>env:</code>, <code>if:</code>, <code>permissions:</code> đều hợp lệ ở nhiều độ sâu với nghĩa hoàn toàn khác. Một lệnh grep bỏ qua độ lồng thì trả lời một câu hỏi khác câu bạn hỏi. Đếm <b>bên trong khối <code>on:</code></b> mới ra đáp án thật: không trên mười một workflow kích hoạt theo tag. Cái bẫy ấy có một người anh em trong khoá này — một script đếm số lượt tham chiếu <code>secrets.*</code> bằng <code>grep -c</code> đã đếm theo DÒNG và hụt mất chín.',
          ),
        }),

        // q12 · đáp án A (0)
        mcq({
          prompt: B(
            'A required status check on a pull request sits at "Expected — Waiting for status to be reported" and never turns red or green. According to the course, which set of causes should you work through?',
            'Một required status check trên một pull request nằm ở "Expected — Waiting for status to be reported" và không bao giờ đỏ cũng không bao giờ xanh. Theo khoá học, bạn nên rà qua nhóm nguyên nhân nào?',
          ),
          options: [
            B(
              'The merge is conflicted, or a path/branch filter excluded this PR, or the required check names a workflow that no longer exists — all three are configuration and none of them produces a log',
              'Bản gộp bị xung đột, hoặc một bộ lọc đường dẫn/nhánh đã loại PR này ra, hoặc required check gọi tên một workflow không còn tồn tại — cả ba đều là cấu hình và không cái nào đẻ ra log',
            ),
            B(
              'The runner pool is saturated, the workflow hit the 256-job cap, or the repository is over its Actions minutes — all three are quota problems and all three clear by themselves',
              'Hồ runner đã bão hoà, workflow chạm trần 256 job, hoặc kho vượt hạn mức phút Actions — cả ba đều là vấn đề hạn mức và cả ba tự hết',
            ),
            B(
              'A step is hanging without a timeout, a job is waiting on an environment approval, or a matrix leg was cancelled by fail-fast — open the run and read the last log group',
              'Một bước treo mà không có timeout, một job đang chờ phê duyệt environment, hoặc một nhánh ma trận bị fail-fast huỷ — hãy mở lần chạy và đọc nhóm log cuối',
            ),
            B(
              'The check ran and passed but the API has not caught up, so the fix is to close and reopen the pull request, which re-requests every status from GitHub',
              'Phép kiểm đã chạy và đã qua nhưng API chưa kịp cập nhật, nên cách sửa là đóng rồi mở lại pull request, việc đó xin lại mọi trạng thái từ GitHub',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 1.4 names exactly three causes for a permanently pending check, and the useful part is what they have in common: <b>all three are configuration, and none of them produces a run</b>. There is no log to open, no red step to click, and the PR is unmergeable. The filter case is the one teams create for themselves — putting <code>paths:</code> on a <code>pull_request</code> trigger while the job is a required check makes every documentation-only PR permanently unmergeable. GitHub does not treat "filtered out" as a pass; it treats it as a result that has not arrived. The cure is to drop <code>paths:</code> from the trigger and put the condition INSIDE the job, so the job always runs and always reports.',
            'Bài 1.4 gọi tên đúng ba nguyên nhân của một ô kiểm treo vĩnh viễn, và phần hữu ích là điểm chung của chúng: <b>cả ba đều là cấu hình, và không cái nào đẻ ra một lần chạy</b>. Không có log để mở, không có bước đỏ để bấm, và PR thì không gộp được. Ca bộ lọc là ca các nhóm tự tạo ra cho mình — đặt <code>paths:</code> lên trigger <code>pull_request</code> trong khi job đó là một required check thì mọi PR chỉ sửa tài liệu đều vĩnh viễn không gộp được. GitHub KHÔNG coi "bị lọc ra" là một lần qua; nó coi là một kết quả CHƯA TỚI. Cách chữa là bỏ <code>paths:</code> khỏi trigger và đưa điều kiện vào BÊN TRONG job, để job luôn chạy và luôn báo cáo.',
          ),
        }),

        /* ── Chương 2 — job, runner, bước, ma trận (9 câu) ─────────────── */

        // q13 · đáp án C (2)
        mcq({
          prompt: B(
            'A job has these three steps in this order. What does each of them print?' + code(
              '- run: |\n' +
              '    echo "VERSION=1.2.3" >> $GITHUB_ENV\n' +
              '    echo "buoc 1: [$VERSION]"\n' +
              '- run: echo "buoc 2: [$VERSION]"\n' +
              '- run: |\n' +
              '    export OTHER=x\n' +
              '- run: echo "buoc 4: [$OTHER]"',
            ),
            'Một job có ba bước sau, theo thứ tự này. Mỗi bước in ra gì?' + code(
              '- run: |\n' +
              '    echo "VERSION=1.2.3" >> $GITHUB_ENV\n' +
              '    echo "buoc 1: [$VERSION]"\n' +
              '- run: echo "buoc 2: [$VERSION]"\n' +
              '- run: |\n' +
              '    export OTHER=x\n' +
              '- run: echo "buoc 4: [$OTHER]"',
            ),
          ),
          options: [
            B(
              'buoc 1: [1.2.3] · buoc 2: [1.2.3] · buoc 4: [x] — writing to <code>$GITHUB_ENV</code> and exporting are two spellings of the same mechanism',
              'buoc 1: [1.2.3] · buoc 2: [1.2.3] · buoc 4: [x] — ghi vào <code>$GITHUB_ENV</code> và export là hai cách viết của cùng một cơ chế',
            ),
            B(
              'buoc 1: [1.2.3] · buoc 2: [1.2.3] · buoc 4: [] — the variable is live from the moment it is written, but <code>export</code> is confined to its own step',
              'buoc 1: [1.2.3] · buoc 2: [1.2.3] · buoc 4: [] — biến sống ngay từ lúc được ghi, nhưng <code>export</code> chỉ quẩn quanh trong bước của nó',
            ),
            B(
              'buoc 1: [] · buoc 2: [1.2.3] · buoc 4: [] — <code>$GITHUB_ENV</code> reaches every LATER step but not the step that wrote it, and <code>export</code> reaches nothing',
              'buoc 1: [] · buoc 2: [1.2.3] · buoc 4: [] — <code>$GITHUB_ENV</code> tới được mọi bước SAU nhưng không tới bước vừa ghi nó, còn <code>export</code> thì không tới đâu cả',
            ),
            B(
              'buoc 1: [] · buoc 2: [] · buoc 4: [] — a value only crosses a step boundary through <code>$GITHUB_OUTPUT</code> together with an <code>id:</code> on the step',
              'buoc 1: [] · buoc 2: [] · buoc 4: [] — một giá trị chỉ vượt được ranh giới bước qua <code>$GITHUB_OUTPUT</code> kèm một <code>id:</code> trên bước',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Every <code>run:</code> block is a separate process with a fresh shell, so <code>export</code>, shell functions, <code>cd</code> and <code>set -x</code> all die at the end of the step. The supported channel is <code>echo "K=V" &gt;&gt; $GITHUB_ENV</code> — the runner reads that file <b>between</b> steps, which is exactly why the value is missing in the step that wrote it and present in every step after. The sibling channel is <code>echo "k=v" &gt;&gt; $GITHUB_OUTPUT</code> with an <code>id:</code> on the step, read as <code>steps.&lt;id&gt;.outputs.k</code>. Neither crosses a JOB boundary: a job boundary is a machine boundary.',
            'Mỗi khối <code>run:</code> là một tiến trình riêng với một shell mới, nên <code>export</code>, hàm shell, <code>cd</code> và <code>set -x</code> đều chết ở cuối bước. Kênh được hỗ trợ là <code>echo "K=V" &gt;&gt; $GITHUB_ENV</code> — runner đọc tệp ấy <b>GIỮA</b> các bước, và đó chính là lý do giá trị vắng mặt ở bước vừa ghi nó và có mặt ở mọi bước sau. Kênh anh em là <code>echo "k=v" &gt;&gt; $GITHUB_OUTPUT</code> kèm một <code>id:</code> trên bước, đọc bằng <code>steps.&lt;id&gt;.outputs.k</code>. Không kênh nào vượt được ranh giới JOB: ranh giới job là ranh giới MÁY.',
          ),
        }),

        // q14 · đáp án A (0)
        mcq({
          prompt: B(
            'A pipeline is wired <code>lint</code> → <code>build</code> → <code>deploy</code>, and a fourth job <code>notify</code> declares <code>needs: [build, deploy]</code>. The <code>lint</code> job is skipped because its <code>if:</code> is false. What is the state of the other three?',
            'Một đường ống nối <code>lint</code> → <code>build</code> → <code>deploy</code>, và một job thứ tư <code>notify</code> khai <code>needs: [build, deploy]</code>. Job <code>lint</code> bị bỏ qua vì <code>if:</code> của nó sai. Ba job kia ở trạng thái nào?',
          ),
          options: [
            B(
              'All three are skipped: skipping propagates down the whole chain, and a conditional job in the middle disables everything behind it',
              'Cả ba đều bị bỏ qua: việc bỏ qua LAN TRUYỀN xuống cả chuỗi, và một job có điều kiện nằm giữa vô hiệu hoá mọi thứ phía sau nó',
            ),
            B(
              'build fails with a dependency error, and deploy and notify are skipped, because a job may not depend on a job that did not run',
              'build hỏng với một lỗi phụ thuộc, còn deploy và notify bị bỏ qua, vì một job không được phép phụ thuộc vào một job đã không chạy',
            ),
            B(
              'All three run normally, because a SKIPPED dependency counts as satisfied — only a FAILED dependency stops the jobs behind it',
              'Cả ba chạy bình thường, vì một phụ thuộc BỊ BỎ QUA được tính là đã thoả — chỉ một phụ thuộc HỎNG mới chặn các job phía sau',
            ),
            B(
              'build and deploy are skipped but notify still runs, because a job with two dependencies only needs one of them to have finished',
              'build và deploy bị bỏ qua nhưng notify vẫn chạy, vì một job có hai phụ thuộc thì chỉ cần một trong hai xong là đủ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 2.2 states both halves. A job whose dependency FAILED is <b>skipped</b>, not failed — the run is red because of the original failure, not because of the jobs behind it, which is why "one job announced red with three red build jobs upstream" is ONE failure and not four. And a job whose dependency was SKIPPED is skipped too: the skip propagates. <code>needs: [a, b]</code> waits for BOTH and there is no "wait for a, tolerate b" without an explicit <code>if:</code>. The escape hatches are <code>if: always()</code> and <code>if: ${{ !cancelled() }}</code> — correct for a reporting or clean-up job, and never correct for a deploy.',
            'Bài 2.2 phát biểu cả hai nửa. Một job có phụ thuộc HỎNG thì <b>bị bỏ qua</b>, không phải hỏng — lần chạy đỏ vì cú hỏng gốc chứ không vì các job phía sau, và đó là lý do "một job công bố đỏ với ba job dựng đỏ ở thượng nguồn" là MỘT cú hỏng chứ không phải bốn. Còn một job có phụ thuộc BỊ BỎ QUA thì cũng bị bỏ qua: việc bỏ qua lan truyền. <code>needs: [a, b]</code> đợi CẢ HAI và không có kiểu "đợi a, chịu đựng b" nếu không viết <code>if:</code> tường minh. Hai cửa thoát là <code>if: always()</code> và <code>if: ${{ !cancelled() }}</code> — đúng cho một job báo cáo hay dọn dẹp, và không bao giờ đúng cho một cuộc deploy.',
          ),
        }),

        // q15 · đáp án D (3)
        mcq({
          prompt: B(
            'A matrix job runs the same steps on <code>ubuntu-latest</code>, <code>macos-latest</code> and <code>windows-latest</code>. Which portability problem is described correctly?',
            'Một job ma trận chạy cùng những bước trên <code>ubuntu-latest</code>, <code>macos-latest</code> và <code>windows-latest</code>. Vấn đề tương thích nào được mô tả ĐÚNG?',
          ),
          options: [
            B(
              'The default shell is bash everywhere, so a <code>run:</code> block behaves identically; only the path separator differs, and Windows accepts forward slashes anyway',
              'Shell mặc định là bash ở mọi nơi, nên một khối <code>run:</code> cư xử y hệt; chỉ dấu phân cách đường dẫn khác nhau, mà Windows thì dù sao cũng chấp nhận gạch chéo xuôi',
            ),
            B(
              'Filename case matters on macOS and Windows but not on Linux, so <code>require(\'./Utils\')</code> for a file named <code>utils.ts</code> fails on two legs and passes on Linux',
              'Chữ hoa chữ thường trong tên tệp có phân biệt trên macOS và Windows nhưng không trên Linux, nên <code>require(\'./Utils\')</code> cho tệp tên <code>utils.ts</code> hỏng ở hai nhánh và qua ở Linux',
            ),
            B(
              'Line endings are normalised by <code>actions/checkout</code> on every platform, so a script can never arrive carrying CRLF and the <code>\\r</code> class of failure cannot occur in Actions',
              'Ký tự xuống dòng được <code>actions/checkout</code> chuẩn hoá trên mọi nền tảng, nên một script không bao giờ tới nơi mang CRLF và lớp lỗi <code>\\r</code> không thể xảy ra trong Actions',
            ),
            B(
              'The default shell on Windows is PowerShell, so <code>export FOO=1</code>, <code>$(...)</code> and single quotes behave differently there — the cure is <code>shell: bash</code> on the step or <code>defaults.run.shell: bash</code> on the job',
              'Shell mặc định trên Windows là PowerShell, nên <code>export FOO=1</code>, <code>$(...)</code> và nháy đơn cư xử khác ở đó — cách chữa là <code>shell: bash</code> trên bước hoặc <code>defaults.run.shell: bash</code> trên job',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Lesson 2.3 lists five portability traps and this is the first one. The default shell is bash on Linux and macOS and <b>PowerShell on Windows</b>, so a <code>run:</code> block written in bash idiom quietly means something else on one leg; Git Bash ships on the Windows runner, so <code>shell: bash</code> costs nothing. On case: Linux is the one that DOES distinguish, and it is also the one that is right — <code>require(\'./Utils\')</code> for <code>utils.ts</code> passes on macOS and Windows and fails on Linux. Line endings are not normalised for you: checkout on Windows may apply <code>core.autocrlf</code>, and the resulting failure mentions <code>\\r</code> without naming a file.',
            'Bài 2.3 liệt kê năm cái bẫy tương thích và đây là cái đầu tiên. Shell mặc định là bash trên Linux với macOS và <b>PowerShell trên Windows</b>, nên một khối <code>run:</code> viết theo lối bash âm thầm mang nghĩa khác ở một nhánh; Git Bash có sẵn trên runner Windows nên <code>shell: bash</code> chẳng tốn gì. Về hoa thường: Linux mới là cái CÓ phân biệt, và nó cũng là cái ĐÚNG — <code>require(\'./Utils\')</code> cho <code>utils.ts</code> qua ở macOS với Windows và hỏng ở Linux. Ký tự xuống dòng thì không được chuẩn hoá hộ bạn: checkout trên Windows có thể áp <code>core.autocrlf</code>, và cú hỏng sinh ra nhắc tới <code>\\r</code> mà chẳng gọi tên tệp nào.',
          ),
        }),

        // q16 · đáp án A (0)
        mcq({
          prompt: B(
            'Under the default shell (<code>bash -e {0}</code>), lesson 2.4 measured five places where a failing command does NOT abort the script. Which one is the surprise?' + code(
              'kiem() { lenh-khong-ton-tai; echo "trong ham, sau cu hong"; }\n' +
              'if kiem; then echo "nhanh dung"; else echo "nhanh sai"; fi\n' +
              'echo "sau if"',
            ),
            'Dưới shell mặc định (<code>bash -e {0}</code>), bài 2.4 đo được năm chỗ mà một câu lệnh hỏng KHÔNG làm script bỏ dở. Chỗ nào là chỗ bất ngờ?' + code(
              'kiem() { lenh-khong-ton-tai; echo "trong ham, sau cu hong"; }\n' +
              'if kiem; then echo "nhanh dung"; else echo "nhanh sai"; fi\n' +
              'echo "sau if"',
            ),
          ),
          options: [
            B(
              'Calling a function from inside an <code>if</code> exempts EVERY command inside that function too — the exemption is inherited, so the echo after the failure still runs',
              'Gọi một hàm từ bên trong một <code>if</code> miễn trừ luôn MỌI câu lệnh bên trong hàm ấy — sự miễn trừ được THỪA KẾ, nên lệnh echo sau cú hỏng vẫn chạy',
            ),
            B(
              'A function body is a separate shell, so <code>set -e</code> is reset at the function boundary and has to be re-enabled inside every function you define',
              'Thân hàm là một shell riêng, nên <code>set -e</code> bị đặt lại ở ranh giới hàm và phải bật lại bên trong mỗi hàm bạn định nghĩa',
            ),
            B(
              'A command that is not found returns 127, and <code>set -e</code> only aborts on exit codes 1 and 2, so 127 passes straight through the guard',
              'Một câu lệnh không tìm thấy trả 127, mà <code>set -e</code> chỉ bỏ dở với mã thoát 1 và 2, nên 127 đi thẳng qua cái chốt',
            ),
            B(
              'The <code>if</code> keyword suppresses failures only for the LAST command of its condition, so the failing command aborts the script and neither branch is reached',
              'Từ khoá <code>if</code> chỉ chặn cú hỏng cho câu lệnh CUỐI của điều kiện, nên câu lệnh hỏng làm script bỏ dở và không nhánh nào được tới',
            ),
          ],
          correct: 0,
          explanation: EX(
            '<code>set -e</code> stands down whenever a command\'s failure is already being tested: inside an <code>if</code> condition, on the left of <code>&amp;&amp;</code>, behind a <code>!</code>, and — the surprise — throughout the body of a function called from any of those places. The exemption is <b>inherited</b>, so a failure buried three lines into a helper is invisible. The fifth place is the only one that does abort: a bare call at the top level. This matters because the same lesson measured its own trap — the very command used to test the exemptions piped its output through <code>grep</code>, and <code>$?</code> then reported grep\'s status instead. <code>shell: bash</code> adds <code>pipefail</code> and closes that one.',
            '<code>set -e</code> đứng sang một bên bất cứ khi nào cú hỏng của một câu lệnh vốn đã đang được kiểm: bên trong điều kiện <code>if</code>, bên trái <code>&amp;&amp;</code>, sau một dấu <code>!</code>, và — chỗ bất ngờ — xuyên suốt thân của một hàm được gọi từ bất kỳ chỗ nào trong số đó. Sự miễn trừ được <b>THỪA KẾ</b>, nên một cú hỏng chôn ở dòng thứ ba của một hàm phụ trợ là vô hình. Chỗ thứ năm là chỗ duy nhất thật sự bỏ dở: một lời gọi trần ở cấp cao nhất. Điều này quan trọng vì chính bài học ấy đã bị cái bẫy của mình cắn — đúng cái lệnh dùng để đo các miễn trừ lại đẩy đầu ra qua <code>grep</code>, và <code>$?</code> khi đó báo trạng thái của grep. <code>shell: bash</code> thêm <code>pipefail</code> và bịt chỗ ấy.',
          ),
        }),

        // q17 · đáp án C (2)
        mcq({
          prompt: B(
            'This repository uses <code>continue-on-error: true</code> exactly twice, and both steps are named the same way:' + code(
              '- name: ESLint (informational)\n' +
              '  continue-on-error: true\n' +
              '- name: Next.js ESLint (informational)\n' +
              '  continue-on-error: true\n' +
              '- name: TypeScript type-check (required)\n' +
              '- name: Unit tests (required)',
            ) + 'What is the point the course draws from this naming convention?',
            'Kho này dùng <code>continue-on-error: true</code> đúng hai lần, và cả hai bước đều được đặt tên theo cùng một kiểu:' + code(
              '- name: ESLint (informational)\n' +
              '  continue-on-error: true\n' +
              '- name: Next.js ESLint (informational)\n' +
              '  continue-on-error: true\n' +
              '- name: TypeScript type-check (required)\n' +
              '- name: Unit tests (required)',
            ) + 'Khoá học rút ra điểm gì từ quy ước đặt tên này?',
          ),
          options: [
            B(
              'The suffix is what activates the tolerance: GitHub reads "(informational)" in the step name and treats the step as non-blocking even without the flag',
              'Hậu tố mới là thứ kích hoạt sự dung thứ: GitHub đọc "(informational)" trong tên bước và coi bước ấy là không chặn dù không có cờ',
            ),
            B(
              'The convention is decorative: since <code>continue-on-error</code> already makes the job green, the name changes nothing that a reader of the run page can see',
              'Quy ước ấy chỉ để trang trí: vì <code>continue-on-error</code> vốn đã làm job xanh, cái tên không đổi thứ gì mà người đọc trang lần chạy nhìn thấy',
            ),
            B(
              'The classification is declared in the NAME, so the run page shows which failures are tolerated on purpose — and a green tick keeps its meaning',
              'Sự phân loại được KHAI BÁO NGAY TRONG TÊN, nên trang lần chạy cho thấy cú hỏng nào được dung thứ có chủ ý — và dấu tick xanh giữ được nghĩa của nó',
            ),
            B(
              'Two tolerated steps out of a whole repository is below the recommended ratio, and the course suggests raising it so that fewer pull requests are blocked by style issues',
              'Hai bước được dung thứ trên cả một kho là dưới tỉ lệ khuyến nghị, và khoá học đề nghị nâng nó lên để bớt pull request bị chặn vì chuyện phong cách',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The flag is a decision about what a green tick means, and lesson 2.4 argues that the decision has to be visible where people read results, not only where people read YAML. Put <code>continue-on-error</code> on a correctness check and the green tick quietly stops meaning anything — with no warning anywhere. The course names three honest options for a noisy step: fix it, delete it, or mark it informational in the name. Note also that the flag does not erase the failure from the data: <code>steps.&lt;id&gt;.outcome</code> still says <code>failure</code> while <code>conclusion</code> says <code>success</code>.',
            'Cái cờ ấy là một quyết định về việc dấu tick xanh có nghĩa gì, và bài 2.4 lập luận rằng quyết định đó phải nhìn thấy được ở chỗ người ta đọc kết quả, chứ không chỉ ở chỗ người ta đọc YAML. Đặt <code>continue-on-error</code> lên một phép kiểm tính đúng đắn thì dấu tick xanh âm thầm thôi mang nghĩa gì — mà chẳng có cảnh báo nào ở đâu. Khoá học gọi tên ba lựa chọn trung thực cho một bước ồn ào: vá nó, xoá nó, hoặc đánh dấu informational ngay trong tên. Cũng lưu ý cái cờ không xoá cú hỏng khỏi dữ liệu: <code>steps.&lt;id&gt;.outcome</code> vẫn nói <code>failure</code> trong khi <code>conclusion</code> nói <code>success</code>.',
          ),
        }),

        // q18 · đáp án [1, 2] — chọn HAI
        mcq({
          prompt: B(
            'A job ends with a step that uploads diagnostic logs. Choose TWO statements that correctly describe the conditions available for it.',
            'Một job kết thúc bằng một bước tải log chẩn đoán lên. Chọn HAI phát biểu mô tả ĐÚNG các điều kiện dùng được cho nó.',
          ),
          options: [
            B(
              '<code>if: failure()</code> is the right choice for collecting logs, because a successful run has nothing worth uploading',
              '<code>if: failure()</code> là lựa chọn đúng để thu thập log, vì một lần chạy thành công thì chẳng có gì đáng tải lên',
            ),
            B(
              '<code>if: always()</code> also runs after the run has been CANCELLED, which makes it right for collecting evidence and wrong for anything that acts on the outside world',
              '<code>if: always()</code> chạy cả sau khi lần chạy đã bị HUỶ, điều đó làm nó đúng cho việc thu thập bằng chứng và sai cho bất cứ thứ gì tác động ra thế giới bên ngoài',
            ),
            B(
              '<code>if: ${{ !cancelled() }}</code> runs after a failure but not after a cancellation, and is usually what people actually mean when they reach for <code>always()</code>',
              '<code>if: ${{ !cancelled() }}</code> chạy sau một cú hỏng nhưng không chạy sau một cú huỷ, và thường là thứ người ta THẬT SỰ muốn khi với tay tới <code>always()</code>',
            ),
            B(
              'With no <code>if:</code> at all the step still runs after a failure, because the implicit condition on a step is <code>always()</code> unless you write something else',
              'Không có <code>if:</code> gì thì bước vẫn chạy sau một cú hỏng, vì điều kiện ngầm định trên một bước là <code>always()</code> trừ khi bạn viết thứ khác',
            ),
          ],
          correct: [1, 2],
          explanation: EX(
            'The implicit condition is <code>success()</code>, not <code>always()</code> — that is why every step after a failure is skipped by default, and it is the whole reason the log-upload step needs a condition at all. <code>failure()</code> is wrong here for a reason worth remembering: you want the logs in BOTH cases, and a step that only fires on failure gives you nothing to compare against. That leaves the pair the course draws a line between: <code>always()</code> is unconditional and survives a cancellation, while <code>!cancelled()</code> stops when a human stops the run. Collecting evidence is fine under either; anything that touches the outside world belongs under neither.',
            'Điều kiện ngầm định là <code>success()</code> chứ không phải <code>always()</code> — đó là lý do mọi bước sau một cú hỏng đều bị bỏ qua theo mặc định, và cũng là toàn bộ lý do bước tải log cần một điều kiện. <code>failure()</code> sai ở đây vì một lẽ đáng nhớ: bạn muốn có log trong CẢ HAI trường hợp, và một bước chỉ nổ khi hỏng thì chẳng cho bạn cái gì để đối chiếu. Còn lại là cặp mà khoá học vạch một ranh giới giữa chúng: <code>always()</code> là vô điều kiện và sống sót qua một cú huỷ, còn <code>!cancelled()</code> thì dừng lại khi có người dừng lần chạy. Thu thập bằng chứng thì cái nào cũng được; thứ gì chạm ra thế giới bên ngoài thì không thuộc cái nào.',
          ),
        }),

        // q19 · đáp án D (3)
        mcq({
          prompt: B(
            'A three-leg build matrix (Linux 241 s, Windows 323 s, macOS 437 s) has <code>fail-fast</code> at its default. macOS fails 60 seconds in. You fix the bug and run the whole thing again. What did the DEFAULT cost you compared with <code>fail-fast: false</code>?',
            'Một ma trận dựng ba nhánh (Linux 241 s, Windows 323 s, macOS 437 s) để <code>fail-fast</code> ở mặc định. macOS hỏng ở giây thứ 60. Bạn vá lỗi rồi chạy lại toàn bộ. So với <code>fail-fast: false</code>, MẶC ĐỊNH đã khiến bạn tốn thêm gì?',
          ),
          options: [
            B(
              'Nothing measurable: cancelling the two healthy legs at 60 seconds saves machine time, and the rebuild costs the same either way because a fixed bug has to be verified on all three legs regardless',
              'Không tốn gì đo được: huỷ hai nhánh khoẻ ở giây 60 là tiết kiệm thời gian máy, và lần dựng lại tốn như nhau vì một lỗi đã vá thì dù sao cũng phải kiểm trên cả ba nhánh',
            ),
            B(
              'The whole run was marked cancelled rather than failed, so the failure did not appear in the run history and the bug went unnoticed for another release cycle',
              'Cả lần chạy bị đánh dấu là bị huỷ chứ không phải hỏng, nên cú hỏng không hiện trong lịch sử lần chạy và cái lỗi trôi qua thêm một chu kỳ phát hành nữa',
            ),
            B(
              'The two healthy legs kept running to completion — the default only stops legs that have not started yet, so the cost is limited to the queue time of any leg still waiting',
              'Hai nhánh khoẻ vẫn chạy tới xong — mặc định chỉ chặn những nhánh chưa khởi động, nên cái giá chỉ giới hạn ở thời gian xếp hàng của nhánh nào còn đang chờ',
            ),
            B(
              'The first run burned 180 machine-seconds and produced zero installers; the re-run then had to rebuild all three legs instead of only macOS, so about 564 machine-seconds went nowhere',
              'Lần chạy đầu đốt 180 máy-giây và cho ra không bản cài nào; rồi lần chạy lại phải dựng lại cả ba nhánh thay vì chỉ macOS, nên khoảng 564 máy-giây đi vào hư không',
            ),
          ],
          correct: 3,
          explanation: EX(
            '<code>fail-fast</code> defaults to <b>true</b>: the moment any leg fails, GitHub cancels every leg still running. Lesson 2.5 works the arithmetic through. First run under the default: three legs × 60 seconds = 180 machine-seconds spent, zero installers produced. Under <code>fail-fast: false</code> the same run costs 60 + 241 + 323 = 624 machine-seconds and yields two of three installers. Then the re-run after the fix: the default forces all three again (1001 machine-seconds) while <code>false</code> needs only macOS (437) — a saving of 564. The default is right for a version matrix, where one red leg blocks release regardless; it is wrong for a build matrix, where each leg produces something useful on its own.',
            '<code>fail-fast</code> mặc định là <b>true</b>: ngay khoảnh khắc bất kỳ nhánh nào hỏng, GitHub huỷ mọi nhánh còn đang chạy. Bài 2.5 tính hết phép tính. Lần chạy đầu dưới mặc định: ba nhánh × 60 giây = 180 máy-giây bỏ ra, không bản cài nào thu về. Dưới <code>fail-fast: false</code> cùng lần chạy ấy tốn 60 + 241 + 323 = 624 máy-giây và cho ra hai trên ba bản cài. Rồi lần chạy lại sau khi vá: mặc định bắt dựng lại cả ba (1001 máy-giây) trong khi <code>false</code> chỉ cần macOS (437) — tiết kiệm 564. Mặc định đúng cho một ma trận phiên bản, nơi một nhánh đỏ là không phát hành bất kể thế nào; nó sai cho một ma trận dựng, nơi mỗi nhánh tự nó cho ra một thứ hữu ích.',
          ),
        }),

        // q20 · đáp án D (3)
        mcq({
          prompt: B(
            'A workflow has <code>matrix: {os: [ubuntu, macos, windows], node: [18, 20]}</code> and someone adds one more Node version. Which statement about the change and about <code>max-parallel</code> is correct?',
            'Một workflow có <code>matrix: {os: [ubuntu, macos, windows], node: [18, 20]}</code> và ai đó thêm một phiên bản Node nữa. Phát biểu nào về thay đổi đó và về <code>max-parallel</code> là ĐÚNG?',
          ),
          options: [
            B(
              'The job count goes from 6 to 7, and <code>max-parallel: 3</code> would cut the billed minutes in half by running fewer legs at once',
              'Số job đi từ 6 lên 7, và <code>max-parallel: 3</code> sẽ cắt một nửa số phút tính tiền nhờ chạy ít nhánh cùng lúc hơn',
            ),
            B(
              'The job count goes from 6 to 9, and <code>max-parallel</code> is the supported way to stay under the per-run job cap, which the docs put at 20',
              'Số job đi từ 6 lên 9, và <code>max-parallel</code> là cách được hỗ trợ để nằm dưới trần số job mỗi lần chạy, mà tài liệu ghi là 20',
            ),
            B(
              'The job count stays at 6 because a cross product only expands the FIRST key; the extra Node version needs an <code>include:</code> entry before it produces any job',
              'Số job vẫn là 6 vì tích chéo chỉ nở theo khoá ĐẦU TIÊN; phiên bản Node thêm vào cần một mục <code>include:</code> mới sinh ra job',
            ),
            B(
              'The job count goes from 6 to 9, and <code>max-parallel</code> caps how many legs run at once without changing the total work — the reason to use it is contention for a shared external resource',
              'Số job đi từ 6 lên 9, và <code>max-parallel</code> chặn số nhánh chạy cùng lúc mà không đổi tổng khối lượng việc — lý do dùng nó là sự tranh chấp một tài nguyên bên ngoài dùng chung',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A cross product multiplies: 3 × 2 = 6 becomes 3 × 3 = 9. Lesson 2.5 puts it as the shape of the trap — the matrix grows by MULTIPLICATION while the configuration grows by ADDITION, so a one-line edit adds three jobs. <code>max-parallel</code> throttles concurrency, not volume: the same total work still happens, just less of it at once, so it saves nothing on the bill. The reason to reach for it is a shared external resource the legs would fight over — one test database, an API rate limit. The documented cap is 256 jobs per workflow run.',
            'Một tích chéo thì NHÂN: 3 × 2 = 6 thành 3 × 3 = 9. Bài 2.5 gọi tên đúng hình dạng cái bẫy — ma trận lớn lên bằng phép NHÂN trong khi cấu hình lớn lên bằng phép CỘNG, nên một thay đổi một dòng thêm ba job. <code>max-parallel</code> bóp mức đồng thời chứ không bóp khối lượng: vẫn từng ấy việc, chỉ là ít hơn tại một thời điểm, nên nó chẳng tiết kiệm gì trên hoá đơn. Lý do với tay tới nó là một tài nguyên bên ngoài dùng chung mà các nhánh sẽ tranh nhau — một cơ sở dữ liệu test, một trần gọi API. Trần đã tài liệu hoá là 256 job cho mỗi lần chạy workflow.',
          ),
        }),

        // q21 · đáp án A (0)
        mcq({
          prompt: B(
            'A macOS build job hangs on a network call and never finishes. The job declares no <code>timeout-minutes</code>. What is the default, and why does it matter most on this particular leg?',
            'Một job dựng macOS treo ở một lời gọi mạng và không bao giờ xong. Job ấy không khai <code>timeout-minutes</code>. Mặc định là bao nhiêu, và vì sao nó quan trọng nhất ở đúng nhánh này?',
          ),
          options: [
            B(
              '360 minutes — six hours — and on a private repository the macOS multiplier of 10× turns that into 3,600 billed minutes for a job that produced nothing',
              '360 phút — sáu tiếng — và ở một kho riêng tư thì hệ số macOS 10× biến nó thành 3.600 phút tính tiền cho một job chẳng tạo ra gì',
            ),
            B(
              '60 minutes, after which the job is cancelled with exit 143, and the macOS multiplier does not apply to cancelled jobs so the cost stops at one hour',
              '60 phút, sau đó job bị huỷ với mã thoát 143, và hệ số macOS không áp cho job bị huỷ nên chi phí dừng ở một tiếng',
            ),
            B(
              'There is no default: a job with no <code>timeout-minutes</code> runs until the runner is reclaimed, which is why every workflow in this repository declares one',
              'Không có mặc định: một job không khai <code>timeout-minutes</code> chạy tới khi runner bị thu hồi, và đó là lý do mọi workflow trong kho này đều khai một cái',
            ),
            B(
              '30 minutes for a matrix leg and 360 for a standalone job, because a matrix leg inherits the shorter of the two limits GitHub applies',
              '30 phút cho một nhánh ma trận và 360 cho một job đứng riêng, vì nhánh ma trận thừa hưởng giới hạn ngắn hơn trong hai giới hạn GitHub áp',
            ),
          ],
          correct: 0,
          explanation: EX(
            '<code>timeout-minutes</code> defaults to <b>360</b>, and lesson 0.3 calls it the least-used key in the file for a reason: nobody sets it until the day something hangs. The macOS multiplier is 10× against 1× for Linux and 2× for Windows, and GitHub rounds each job UP to the minute — which is why the same release run costs 5 Linux minutes, 12 Windows minutes and 80 macOS minutes, with macOS carrying 82% of the bill. Six hours of a hung macOS job is 3,600 billed minutes for nothing. Six of this repository\'s workflows declare a timeout explicitly; the matrix build job uses <code>timeout-minutes: 40</code>.',
            '<code>timeout-minutes</code> mặc định là <b>360</b>, và bài 0.3 gọi nó là khoá ít được dùng nhất trong tệp vì một lẽ: chẳng ai đặt nó cho tới cái ngày có thứ gì đó treo. Hệ số macOS là 10× so với 1× của Linux và 2× của Windows, và GitHub làm tròn LÊN phút cho mỗi job — nên cùng một lần chạy phát hành tốn 5 phút Linux, 12 phút Windows và 80 phút macOS, với macOS gánh 82% hoá đơn. Sáu tiếng của một job macOS treo là 3.600 phút tính tiền cho hư không. Sáu workflow của kho này khai timeout tường minh; job dựng ma trận dùng <code>timeout-minutes: 40</code>.',
          ),
        }),

        /* ── Chương 3 — biểu thức và context (9 câu) ───────────────────── */

        // q22 · đáp án C (2)
        mcq({
          prompt: B(
            'Where may a <code>${{ }}</code> expression appear? Pick the correct description.',
            'Một biểu thức <code>${{ }}</code> được phép xuất hiện ở đâu? Chọn mô tả ĐÚNG.',
          ),
          options: [
            B(
              'Anywhere in the file, including <code>on:</code> — that is how a workflow computes its own cron schedule from a repository variable at read time',
              'Bất cứ đâu trong tệp, kể cả <code>on:</code> — đó là cách một workflow tính lịch cron của chính nó từ một biến của kho lúc đọc tệp',
            ),
            B(
              'Only in <code>run:</code> and <code>with:</code>; keys such as <code>env:</code>, <code>name:</code> and <code>runs-on:</code> take literal values because they are read before any job exists',
              'Chỉ trong <code>run:</code> và <code>with:</code>; các khoá như <code>env:</code>, <code>name:</code>, <code>runs-on:</code> nhận giá trị nguyên văn vì chúng được đọc trước khi có job nào',
            ),
            B(
              'In most places — <code>run:</code>, <code>with:</code>, <code>env:</code>, <code>name:</code>, <code>runs-on:</code>, a cache <code>key:</code> — but NOT inside the <code>on:</code> block, and <code>if:</code> is already an expression so the braces are optional there',
              'Ở phần lớn các chỗ — <code>run:</code>, <code>with:</code>, <code>env:</code>, <code>name:</code>, <code>runs-on:</code>, <code>key:</code> của cache — nhưng KHÔNG trong khối <code>on:</code>, và <code>if:</code> vốn đã là một biểu thức nên ở đó ngoặc là tuỳ chọn',
            ),
            B(
              'Everywhere except <code>if:</code>, where a bare expression is required and the braces are a syntax error that <code>actionlint</code> reports as an unresolved template',
              'Ở mọi nơi trừ <code>if:</code>, chỗ đó bắt buộc phải viết biểu thức trần và cặp ngoặc là lỗi cú pháp mà <code>actionlint</code> báo là template chưa phân giải',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Lesson 3.1 draws the boundary in both directions. The <code>on:</code> block is read before there is an event, a job or a runner, so no context exists yet and no expression is allowed — you cannot compute a trigger, a branch filter or a cron schedule. In the other direction, <code>if:</code> IS an expression already: <code>if: github.event_name == \'push\'</code> works with no braces, and adding them is harmless but unnecessary. One more detail worth carrying: the expression language accepts SINGLE quotes only, so <code>if: github.ref == "refs/heads/main"</code> is a lexer error, and a literal single quote inside a string is doubled — <code>format(\'it\'\'s fine\')</code>.',
            'Bài 3.1 vạch ranh giới theo cả hai chiều. Khối <code>on:</code> được đọc trước khi có sự kiện, job hay runner nào, nên chưa có context nào tồn tại và không biểu thức nào được phép — bạn không tính ra được một trigger, một bộ lọc nhánh hay một lịch cron. Chiều ngược lại, <code>if:</code> VỐN ĐÃ là một biểu thức: <code>if: github.event_name == \'push\'</code> chạy được không cần ngoặc, thêm vào thì vô hại nhưng không cần thiết. Thêm một chi tiết đáng mang theo: ngôn ngữ biểu thức chỉ nhận NHÁY ĐƠN, nên <code>if: github.ref == "refs/heads/main"</code> là một lỗi từ vựng, và một dấu nháy đơn nằm trong chuỗi thì viết đôi lên — <code>format(\'it\'\'s fine\')</code>.',
          ),
        }),

        // q23 · đáp án B (1)
        mcq({
          prompt: B(
            'Which of these four lines works, and which is the exception the course warns about?' + code(
              'A.  runs-on: ${{ matrix.os }}\n' +
              'B.  runs-on: ${{ env.RUNNER_LABEL }}\n' +
              'C.  key: build-${{ runner.os }}\n' +
              'D.  name: Dung ${{ matrix.ten }}',
            ),
            'Trong bốn dòng sau, dòng nào chạy được, và dòng nào là ngoại lệ mà khoá học cảnh báo?' + code(
              'A.  runs-on: ${{ matrix.os }}\n' +
              'B.  runs-on: ${{ env.RUNNER_LABEL }}\n' +
              'C.  key: build-${{ runner.os }}\n' +
              'D.  name: Dung ${{ matrix.ten }}',
            ),
          ),
          options: [
            B(
              'C is the exception: <code>runner</code> is not available in a cache key because the key is computed before the runner is assigned',
              'C là ngoại lệ: <code>runner</code> không dùng được trong khoá cache vì khoá được tính trước khi runner được cấp',
            ),
            B(
              'B is the exception: <code>matrix</code> works in <code>runs-on:</code> at job level but <code>env</code> does not',
              'B là ngoại lệ: <code>matrix</code> chạy được trong <code>runs-on:</code> ở mức job nhưng <code>env</code> thì không',
            ),
            B(
              'D is the exception: <code>name:</code> is a display string read at parse time, so no context is available in it',
              'D là ngoại lệ: <code>name:</code> là một chuỗi hiển thị đọc lúc phân giải, nên không context nào dùng được trong đó',
            ),
            B(
              'A is the exception: <code>matrix</code> exists only inside steps, so <code>runs-on:</code> has to name a literal label or read a repository variable',
              'A là ngoại lệ: <code>matrix</code> chỉ tồn tại bên trong các bước, nên <code>runs-on:</code> phải ghi thẳng một nhãn hoặc đọc một biến của kho',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Lesson 3.2 lists this as one of four places a context is not there. <code>runs-on:</code> at job level is evaluated early, and at that point <code>matrix</code> has been expanded but the job\'s <code>env</code> has not — so <code>${{ matrix.os }}</code> works and <code>${{ env.X }}</code> does not. A cache <code>key:</code> is fine with <code>runner.os</code>: the key is evaluated inside the job, on the machine, which is precisely why it can carry the platform. The golden rule behind all of this: an unavailable context does not raise an error, it evaluates to an empty string — so when an expression misbehaves, suspect AVAILABILITY before you suspect the value.',
            'Bài 3.2 liệt kê đây là một trong bốn chỗ context không tồn tại. <code>runs-on:</code> ở mức job được tính sớm, và tại thời điểm ấy <code>matrix</code> đã nở ra rồi còn <code>env</code> của job thì chưa — nên <code>${{ matrix.os }}</code> chạy được và <code>${{ env.X }}</code> thì không. Một <code>key:</code> của cache thì dùng <code>runner.os</code> thoải mái: khoá được tính bên trong job, trên cỗ máy, và đó chính là lý do nó mang được nền tảng vào. Quy tắc vàng đứng sau tất cả những chuyện này: một context không dùng được thì KHÔNG báo lỗi, nó tính ra chuỗi rỗng — nên khi một biểu thức cư xử lạ, hãy nghi TÍNH KHẢ DỤNG trước khi nghi giá trị.',
          ),
        }),

        // q24 · đáp án D (3)
        mcq({
          prompt: B(
            'A workflow has jobs <code>lint</code>, <code>build</code> and <code>deploy</code>. The <code>deploy</code> job declares <code>needs: build</code> and this condition:' + code(
              "deploy:\n" +
              '  needs: build\n' +
              "  if: needs.lint.result == 'success'",
            ) + 'What does that condition evaluate to, and why?',
            'Một workflow có các job <code>lint</code>, <code>build</code> và <code>deploy</code>. Job <code>deploy</code> khai <code>needs: build</code> và điều kiện sau:' + code(
              "deploy:\n" +
              '  needs: build\n' +
              "  if: needs.lint.result == 'success'",
            ) + 'Điều kiện ấy tính ra gì, và vì sao?',
          ),
          options: [
            B(
              'True whenever lint succeeded, because the <code>needs</code> context exposes every job in the workflow and <code>needs:</code> only controls ORDER',
              'Đúng bất cứ khi nào lint thành công, vì context <code>needs</code> phơi ra mọi job trong workflow còn <code>needs:</code> chỉ điều khiển THỨ TỰ',
            ),
            B(
              'A workflow validation error at parse time: referencing a job that is not in <code>needs:</code> is rejected before the run is queued',
              'Một lỗi kiểm tra workflow lúc phân giải: tham chiếu một job không có trong <code>needs:</code> bị từ chối trước khi lần chạy được xếp hàng',
            ),
            B(
              'True, because an unavailable context evaluates to an empty string and the comparison of an empty string with a non-empty one is loose enough to pass',
              'Đúng, vì một context không dùng được sẽ tính ra chuỗi rỗng và phép so sánh chuỗi rỗng với một chuỗi khác rỗng đủ lỏng để qua',
            ),
            B(
              'Always false: the <code>needs</code> context holds only the jobs this job actually declared, so <code>needs.lint</code> is empty and <code>\'\' == \'success\'</code> is false — the deploy is skipped every time, silently',
              'Luôn SAI: context <code>needs</code> chỉ chứa những job mà job này thật sự đã khai, nên <code>needs.lint</code> rỗng và <code>\'\' == \'success\'</code> là sai — cuộc deploy bị bỏ qua mọi lần, một cách âm thầm',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is one of the four conditions lesson 3.5 lists as never firing, and it fails in the quietest way available: no error, no warning, just a job marked "skipped" on the run page, which looks identical to a job that was SUPPOSED to be skipped. Measured with GitHub\'s own evaluator: a reference into a context that is not there returns <code>Null</code>, which coerces to <code>""</code>, and <code>"" == "success"</code> is <code>false</code>. The other three in the same family are <code>if: \'false\'</code> (which fires when it should not), <code>if: steps.x.conclusion == \'failure\'</code> on a tolerated step, and <code>if: github.ref == \'main\'</code>. Three of the four fail closed; the first fails OPEN, which is worse.',
            'Đây là một trong bốn điều kiện mà bài 3.5 liệt kê là không bao giờ nổ, và nó hỏng theo cách im lặng nhất có thể: không lỗi, không cảnh báo, chỉ một job đánh dấu "skipped" trên trang lần chạy, trông y hệt một job ĐÁNG LẼ phải bị bỏ qua. Đo bằng chính bộ máy của GitHub: một tham chiếu vào context không tồn tại trả về <code>Null</code>, ép về chuỗi thành <code>""</code>, và <code>"" == "success"</code> là <code>false</code>. Ba cái còn lại trong cùng họ là <code>if: \'false\'</code> (nổ đúng lúc lẽ ra không được nổ), <code>if: steps.x.conclusion == \'failure\'</code> trên một bước được dung thứ, và <code>if: github.ref == \'main\'</code>. Ba trong bốn hỏng theo hướng ĐÓNG; cái đầu tiên hỏng theo hướng MỞ, và đó mới là cái tệ hơn.',
          ),
        }),

        // q25 · đáp án A (0)
        mcq({
          prompt: B(
            'Evaluated with GitHub\'s own expression evaluator (@actions/expressions 0.3.61). Read the measured results:' + code(
              "'true' == true    ->  false\n" +
              "'1' == true       ->  true\n" +
              "'' == 0           ->  true\n" +
              "null == 0         ->  true\n" +
              "'abc' == 0        ->  false\n" +
              "'0x1' == 1        ->  true",
            ) + 'Which rule explains all six lines at once?',
            'Đánh giá bằng chính bộ máy biểu thức của GitHub (@actions/expressions 0.3.61). Đọc kết quả đã đo:' + code(
              "'true' == true    ->  false\n" +
              "'1' == true       ->  true\n" +
              "'' == 0           ->  true\n" +
              "null == 0         ->  true\n" +
              "'abc' == 0        ->  false\n" +
              "'0x1' == 1        ->  true",
            ) + 'Luật nào giải thích cả sáu dòng cùng một lúc?',
          ),
          options: [
            B(
              'When the two sides have different types both are coerced to NUMBER — null and empty string become 0, true becomes 1, a numeric-looking string becomes its number, and anything else becomes NaN, which never equals anything',
              'Khi hai vế khác kiểu thì cả hai bị ép về SỐ — null và chuỗi rỗng thành 0, true thành 1, một chuỗi trông như số thành chính số đó, còn thứ khác thành NaN mà NaN thì không bằng gì cả',
            ),
            B(
              'Both sides are coerced to STRING, so <code>true</code> becomes "true" and matches the first line, while <code>\'abc\'</code> and <code>0</code> differ as text on the fifth',
              'Cả hai vế bị ép về CHUỖI, nên <code>true</code> thành "true" và khớp ở dòng đầu, còn <code>\'abc\'</code> với <code>0</code> khác nhau về mặt chữ ở dòng thứ năm',
            ),
            B(
              'The evaluator compares types first and only falls back to a value comparison when both sides are primitives of the same family, which is why the boolean lines behave differently from the numeric ones',
              'Bộ máy so kiểu trước rồi mới lùi về so giá trị khi hai vế là nguyên thuỷ cùng họ, đó là lý do các dòng boolean cư xử khác các dòng số',
            ),
            B(
              'There is a strict-equality operator underneath: <code>==</code> is strict for booleans and loose for numbers, which produces exactly this mixture of results',
              'Bên dưới có một toán tử so sánh nghiêm ngặt: <code>==</code> nghiêm ngặt với boolean và lỏng với số, và nó cho ra đúng cái hỗn hợp kết quả này',
            ),
          ],
          correct: 0,
          explanation: EX(
            'There is no strict-equality operator in this language: <code>==</code> coerces whenever the two sides differ in type, and it coerces to NUMBER. That single rule produces every line. <code>\'true\'</code> is not numeric so it becomes NaN, and NaN equals nothing — which is why the most natural-looking comparison on the list is the one that is false, and why a condition written <code>inputs.flag == \'true\'</code> and a condition written <code>inputs.flag == true</code> are not the same test. Coercion only happens ACROSS types: <code>\'abc\' == \'abc\'</code> is a plain string comparison and is true. Lesson 3.3 published this table from the documentation; the six lines above are the same table re-measured on GitHub\'s evaluator, and it holds.',
            'Ngôn ngữ này không có toán tử so sánh nghiêm ngặt: <code>==</code> ép kiểu bất cứ khi nào hai vế khác kiểu, và nó ép về SỐ. Chỉ một luật ấy sinh ra mọi dòng. <code>\'true\'</code> không phải dạng số nên nó thành NaN, mà NaN thì không bằng cái gì — đó là lý do phép so sánh trông tự nhiên nhất trong danh sách lại là cái SAI, và là lý do một điều kiện viết <code>inputs.flag == \'true\'</code> với một điều kiện viết <code>inputs.flag == true</code> không phải cùng một phép kiểm. Ép kiểu chỉ xảy ra khi KHÁC kiểu: <code>\'abc\' == \'abc\'</code> là so chuỗi thuần và ĐÚNG. Bài 3.3 công bố bảng này lấy từ tài liệu; sáu dòng trên là chính bảng ấy đo lại trên bộ máy của GitHub, và nó đứng vững.',
          ),
        }),

        // q26 · đáp án B (1)
        mcq({
          prompt: B(
            'Three ordering comparisons, measured on GitHub\'s evaluator:' + code(
              "'10' > '9'   ->  false\n" +
              "'2'  > 1     ->  true\n" +
              "'abc' > 1    ->  false",
            ) + 'What distinguishes the first line from the second?',
            'Ba phép so sánh thứ tự, đo trên bộ máy của GitHub:' + code(
              "'10' > '9'   ->  false\n" +
              "'2'  > 1     ->  true\n" +
              "'abc' > 1    ->  false",
            ) + 'Cái gì phân biệt dòng đầu với dòng thứ hai?',
          ),
          options: [
            B(
              'The first line overflows: a two-character string is compared by length before content, so <code>\'10\'</code> loses to <code>\'9\'</code> on the first character and the result is decided there',
              'Dòng đầu bị tràn: một chuỗi hai ký tự được so theo độ dài trước rồi mới tới nội dung, nên <code>\'10\'</code> thua <code>\'9\'</code> ngay ký tự đầu và kết quả được quyết ở đó',
            ),
            B(
              'When BOTH sides are strings the evaluator compares them as text, so <code>\'10\'</code> sorts before <code>\'9\'</code>; only a MIXED pair is coerced to number, and a non-numeric string then becomes NaN so every comparison with it is false',
              'Khi CẢ HAI vế là chuỗi thì bộ máy so chúng như văn bản, nên <code>\'10\'</code> đứng trước <code>\'9\'</code>; chỉ một cặp KHÁC kiểu mới bị ép về số, và khi đó một chuỗi không phải số thành NaN nên mọi phép so sánh với nó đều sai',
            ),
            B(
              'The comparison operators never coerce at all; all three lines are text comparisons, and the second is true only because the character <code>\'2\'</code> sorts after the character <code>\'1\'</code>',
              'Các toán tử so sánh không bao giờ ép kiểu; cả ba dòng đều là so văn bản, và dòng thứ hai đúng chỉ vì ký tự <code>\'2\'</code> đứng sau ký tự <code>\'1\'</code>',
            ),
            B(
              'The first line is false because ordering operators reject a quoted operand outright and return false rather than raising, which is also what happens on the third line',
              'Dòng đầu sai vì các toán tử thứ tự từ chối thẳng một toán hạng có nháy và trả về false thay vì báo lỗi, và đó cũng là chuyện xảy ra ở dòng thứ ba',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured on the real evaluator. Two strings are compared as text — and, as it happens, case-insensitively: <code>\'a\' &lt; \'B\'</code> is true and <code>\'apple\' &lt; \'Banana\'</code> is true. A mixed pair goes through the same number coercion as <code>==</code>, so <code>\'2\' &gt; 1</code> is 2 &gt; 1, and <code>\'abc\' &gt; 1</code> is NaN &gt; 1, which is false. The practical consequence is that a version check written as a string comparison is a trap: <code>matrix.node &gt;= 18</code> works because one side is a number, while <code>matrix.node &gt;= \'18\'</code> would be sorting text. Note the language has no arithmetic at all — <code>1 + 1</code> is a parse error, <code>Unexpected symbol: \'+\'</code>.',
            'Đo trên bộ máy thật. Hai chuỗi thì so như văn bản — và tiện thể, KHÔNG phân biệt hoa thường: <code>\'a\' &lt; \'B\'</code> đúng và <code>\'apple\' &lt; \'Banana\'</code> cũng đúng. Một cặp khác kiểu thì đi qua đúng phép ép số như <code>==</code>, nên <code>\'2\' &gt; 1</code> là 2 &gt; 1, còn <code>\'abc\' &gt; 1</code> là NaN &gt; 1, tức sai. Hệ quả thực tiễn là một phép kiểm phiên bản viết dưới dạng so chuỗi là một cái bẫy: <code>matrix.node &gt;= 18</code> chạy được vì một vế là số, còn <code>matrix.node &gt;= \'18\'</code> thì đang sắp xếp văn bản. Cũng lưu ý ngôn ngữ này KHÔNG có số học gì cả — <code>1 + 1</code> là lỗi phân giải, <code>Unexpected symbol: \'+\'</code>.',
          ),
        }),

        // q27 · đáp án D (3)
        mcq({
          prompt: B(
            'A workflow gates a deploy on a pull request label:' + code(
              "if: contains(github.event.pull_request.labels.*.name, 'deploy')",
            ) + 'A contributor adds the label <code>DEPLOY</code> in capitals. Measured on GitHub\'s evaluator, what happens, and what is the general rule?',
            'Một workflow chặn một cuộc deploy sau một nhãn của pull request:' + code(
              "if: contains(github.event.pull_request.labels.*.name, 'deploy')",
            ) + 'Một người đóng góp gắn nhãn <code>DEPLOY</code> viết hoa. Đo trên bộ máy của GitHub, chuyện gì xảy ra, và luật chung là gì?',
          ),
          options: [
            B(
              'The condition is false, so the deploy is skipped; string functions are case-sensitive and the fix is <code>contains(..., \'deploy\') || contains(..., \'DEPLOY\')</code>',
              'Điều kiện sai nên cuộc deploy bị bỏ qua; các hàm chuỗi phân biệt hoa thường và cách chữa là <code>contains(..., \'deploy\') || contains(..., \'DEPLOY\')</code>',
            ),
            B(
              'The expression raises an error, because <code>.*.name</code> produces an array and <code>contains</code> only accepts a string as its first argument',
              'Biểu thức báo lỗi, vì <code>.*.name</code> cho ra một mảng còn <code>contains</code> chỉ nhận một chuỗi làm tham số đầu',
            ),
            B(
              'The condition is false on the array form but would be true on the string form, because the filter operator <code>.*</code> lowercases nothing while <code>join()</code> does',
              'Điều kiện sai ở dạng mảng nhưng sẽ đúng ở dạng chuỗi, vì toán tử lọc <code>.*</code> không hạ hoa thường còn <code>join()</code> thì có',
            ),
            B(
              'The condition is TRUE and the deploy runs: <code>contains</code> compares without regard to case, and so do <code>==</code>, <code>startsWith</code> and <code>endsWith</code>',
              'Điều kiện ĐÚNG và cuộc deploy chạy: <code>contains</code> so sánh không phân biệt hoa thường, và <code>==</code>, <code>startsWith</code>, <code>endsWith</code> cũng vậy',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured: <code>contains(\'Hello world\', \'WORLD\')</code> is true, and on an array built by the filter operator <code>contains(labels.*.name, \'DEPLOY\')</code> is true as well. The same holds for <code>\'abc\' == \'ABC\'</code>, for <code>startsWith(\'Refs/Heads/main\', \'refs/heads/\')</code> and for <code>endsWith(\'MAIN.YML\', \'.yml\')</code>. The course teaches coercion in detail and leaves this out, so it is worth stating plainly: <b>string comparison in this language ignores case, everywhere</b>. That is convenient for a label gate and dangerous for anything that is actually a security boundary — a branch name check written with <code>==</code> will accept <code>Main</code> and <code>MAIN</code> too.',
            'Đo thật: <code>contains(\'Hello world\', \'WORLD\')</code> ra true, và trên một mảng dựng bằng toán tử lọc thì <code>contains(labels.*.name, \'DEPLOY\')</code> cũng ra true. Điều tương tự đúng với <code>\'abc\' == \'ABC\'</code>, với <code>startsWith(\'Refs/Heads/main\', \'refs/heads/\')</code> và với <code>endsWith(\'MAIN.YML\', \'.yml\')</code>. Khoá học dạy rất kỹ về ép kiểu mà bỏ trống chỗ này, nên đáng nói thẳng: <b>phép so sánh chuỗi trong ngôn ngữ này BỎ QUA hoa thường, ở mọi nơi</b>. Điều đó tiện cho một cái chốt bằng nhãn và nguy hiểm cho bất cứ thứ gì thật sự là một ranh giới an toàn — một phép kiểm tên nhánh viết bằng <code>==</code> sẽ chấp nhận cả <code>Main</code> lẫn <code>MAIN</code>.',
          ),
        }),

        // q28 · đáp án A (0)
        mcq({
          prompt: B(
            'A workflow uses the ternary idiom to pick an environment, and a second one uses it to pick a build flag:' + code(
              "A:  ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}\n" +
              "B:  ${{ inputs.debug && '--verbose' || '--quiet' }}\n" +
              "C:  ${{ inputs.debug && '' || '--quiet' }}",
            ) + 'Line C misbehaves. What is wrong with it?',
            'Một workflow dùng lối viết ba ngôi để chọn môi trường, và một cái khác dùng nó để chọn cờ dựng:' + code(
              "A:  ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}\n" +
              "B:  ${{ inputs.debug && '--verbose' || '--quiet' }}\n" +
              "C:  ${{ inputs.debug && '' || '--quiet' }}",
            ) + 'Dòng C cư xử sai. Nó sai ở đâu?',
          ),
          options: [
            B(
              'The idiom behaves like a ternary only while the true-branch value is itself truthy; an empty string is falsy, so C yields <code>--quiet</code> no matter what <code>inputs.debug</code> is',
              'Lối viết ấy chỉ cư xử như ba ngôi khi giá trị nhánh-đúng tự nó là ĐÚNG; chuỗi rỗng là SAI, nên C cho ra <code>--quiet</code> bất kể <code>inputs.debug</code> là gì',
            ),
            B(
              'The operators bind the wrong way round: <code>||</code> is evaluated before <code>&amp;&amp;</code>, so C is parsed as <code>inputs.debug &amp;&amp; (&#39;&#39; || &#39;--quiet&#39;)</code> and always yields <code>--quiet</code>',
              'Các toán tử gắn ngược: <code>||</code> được tính trước <code>&amp;&amp;</code>, nên C được phân giải thành <code>inputs.debug &amp;&amp; (&#39;&#39; || &#39;--quiet&#39;)</code> và luôn cho <code>--quiet</code>',
            ),
            B(
              'An empty string is not a legal operand for <code>&amp;&amp;</code>, so C raises an evaluation error and the step it belongs to is skipped with an empty value',
              'Chuỗi rỗng không phải toán hạng hợp lệ của <code>&amp;&amp;</code>, nên C ném lỗi đánh giá và bước chứa nó bị bỏ qua với một giá trị rỗng',
            ),
            B(
              'C returns a boolean rather than a string, because a logical operator whose operands have different types falls back to returning the result of the truthiness test',
              'C trả về boolean chứ không phải chuỗi, vì một toán tử logic có các toán hạng khác kiểu thì lùi về trả kết quả của phép thử đúng-sai',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: <code>true && \'\' || \'x\'</code> gives <code>"x"</code>, and so do <code>true && 0 || \'x\'</code> and <code>true && false || \'x\'</code>. The logical operators return an OPERAND, not a boolean — <code>&amp;&amp;</code> returns the first falsy operand or the last one, <code>||</code> returns the first truthy operand or the last one. Chain them and the idiom only reproduces a ternary while the middle value is truthy. Lines A and B are safe because <code>\'production\'</code> and <code>\'--verbose\'</code> are non-empty strings. Precedence is not the problem: <code>&amp;&amp;</code> does bind tighter than <code>||</code>. When the true-branch value can legitimately be empty, zero or false, write an explicit <code>if:</code> instead.',
            'Đo thật: <code>true && \'\' || \'x\'</code> cho <code>"x"</code>, và <code>true && 0 || \'x\'</code> với <code>true && false || \'x\'</code> cũng vậy. Các toán tử logic trả về một TOÁN HẠNG chứ không phải boolean — <code>&amp;&amp;</code> trả toán hạng SAI đầu tiên hoặc toán hạng cuối, <code>||</code> trả toán hạng ĐÚNG đầu tiên hoặc toán hạng cuối. Nối chúng lại thì lối viết ấy chỉ tái hiện được một phép ba ngôi CHỪNG NÀO giá trị ở giữa còn đúng. Dòng A và B an toàn vì <code>\'production\'</code> và <code>\'--verbose\'</code> là chuỗi khác rỗng. Độ ưu tiên không phải vấn đề: <code>&amp;&amp;</code> ĐÚNG là gắn chặt hơn <code>||</code>. Khi giá trị nhánh-đúng hoàn toàn có thể rỗng, bằng không hay bằng false, hãy viết một <code>if:</code> tường minh.',
          ),
        }),

        // q29 · đáp án B (1)
        mcq({
          prompt: B(
            'Two facts about <code>hashFiles()</code>, both verified by reimplementing the documented algorithm:' + code(
              "hashFiles('desktop/package-lock.json', 'frontend/package-lock.json')\n" +
              "hashFiles('frontend/package-lock.json', 'desktop/package-lock.json')\n" +
              '   -> the two calls return the SAME hex string\n' +
              '   -> the algorithm carries no repository-specific salt',
            ) + 'What follows for a cache key?',
            'Hai sự thật về <code>hashFiles()</code>, cả hai đều được kiểm bằng cách hiện thực lại thuật toán đã tài liệu hoá:' + code(
              "hashFiles('desktop/package-lock.json', 'frontend/package-lock.json')\n" +
              "hashFiles('frontend/package-lock.json', 'desktop/package-lock.json')\n" +
              '   -> hai loi goi tra ve CUNG mot chuoi hex\n' +
              '   -> thuat toan khong mang muoi rieng theo kho',
            ) + 'Suy ra được gì cho một khoá cache?',
          ),
          options: [
            B(
              'Argument order is significant elsewhere but not here, and the missing salt means a cache key is scoped to the repository automatically, so the platform never needs to appear in it',
              'Thứ tự tham số quan trọng ở chỗ khác nhưng không ở đây, và việc thiếu muối nghĩa là một khoá cache tự động khoanh theo kho, nên nền tảng không bao giờ cần xuất hiện trong khoá',
            ),
            B(
              'The file list is SORTED before hashing, so argument order cannot change the key — and because there is no salt, identical file contents give an identical key, which is why the key must carry <code>runner.os</code> itself',
              'Danh sách tệp được SẮP XẾP trước khi băm, nên thứ tự tham số không đổi được khoá — và vì không có muối, nội dung tệp giống nhau cho khoá giống nhau, nên chính khoá phải mang <code>runner.os</code> vào',
            ),
            B(
              'Both calls hash the concatenated hex strings rather than the binary digests, which is why order does not matter; the salt is added later by the cache service using the branch name',
              'Cả hai lời gọi băm các chuỗi hex nối lại chứ không băm các bản băm nhị phân, và đó là lý do thứ tự không quan trọng; muối được dịch vụ cache thêm vào sau bằng tên nhánh',
            ),
            B(
              'Neither fact matters for a key, because <code>actions/cache</code> prefixes every key with the workflow name and the runner label before it stores anything',
              'Không sự thật nào quan trọng với một khoá, vì <code>actions/cache</code> gắn tên workflow và nhãn runner vào đầu mọi khoá trước khi lưu bất cứ thứ gì',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The documented algorithm is: SHA-256 each matching file, concatenate those digests <b>as binary</b> in SORTED path order, SHA-256 the result. Lesson 3.4 reimplemented it in six lines and got a 64-character hex string that matched a real cache key in a real run log, byte for byte — which establishes the sorting, the binary concatenation, and the absence of any repository-specific ingredient all at once. The last of those is what bites: two different repositories with the same lockfile produce the same hash, and so do a Linux runner and a macOS runner. That is why the recommended key is <code>&lt;prefix&gt;-${{ runner.os }}-&lt;name&gt;-${{ hashFiles(...) }}</code> — the platform has to be in the key, because the hash will not put it there.',
            'Thuật toán đã tài liệu hoá là: SHA-256 từng tệp khớp mẫu, nối các bản băm ấy <b>dạng NHỊ PHÂN</b> theo thứ tự đường dẫn ĐÃ SẮP, rồi SHA-256 kết quả. Bài 3.4 hiện thực lại nó trong sáu dòng và ra một chuỗi hex 64 ký tự khớp với một khoá cache thật trong một log chạy thật, từng byte một — điều đó xác lập cùng lúc cả phép sắp xếp, phép nối nhị phân, lẫn sự vắng mặt của mọi thành phần riêng theo kho. Cái cuối mới là cái cắn: hai kho khác nhau có cùng lockfile cho ra cùng một bản băm, và một runner Linux với một runner macOS cũng vậy. Đó là lý do khoá khuyến nghị là <code>&lt;tiền tố&gt;-${{ runner.os }}-&lt;tên&gt;-${{ hashFiles(...) }}</code> — nền tảng PHẢI nằm trong khoá, vì bản băm sẽ không đặt nó vào đó hộ bạn.',
          ),
        }),

        // q30 · đáp án C (2)
        mcq({
          prompt: B(
            'A step is written to notify only on the main branch:' + code(
              "- name: Bao Slack\n" +
              "  if: always() && github.ref == 'refs/heads/main'\n" +
              '  run: ./bao.sh',
            ) + 'An earlier step in the same job has already failed. What does the notification step do, and what is the rule?',
            'Một bước được viết để chỉ báo trên nhánh chính:' + code(
              "- name: Bao Slack\n" +
              "  if: always() && github.ref == 'refs/heads/main'\n" +
              '  run: ./bao.sh',
            ) + 'Một bước trước đó trong cùng job đã hỏng. Bước thông báo làm gì, và luật là gì?',
          ),
          options: [
            B(
              'It is skipped: once a step has failed, every later step is skipped regardless of its condition, and only <code>continue-on-error</code> on the FAILING step can change that',
              'Nó bị bỏ qua: một khi có bước hỏng thì mọi bước sau đều bị bỏ qua bất kể điều kiện của chúng, và chỉ <code>continue-on-error</code> trên bước ĐANG HỎNG mới đổi được điều đó',
            ),
            B(
              'It runs, but only because <code>always()</code> and the branch test are joined with <code>&amp;&amp;</code>; written with <code>||</code> the implicit <code>success()</code> would come back and skip the step',
              'Nó chạy, nhưng chỉ vì <code>always()</code> và phép kiểm nhánh được nối bằng <code>&amp;&amp;</code>; nếu viết bằng <code>||</code> thì <code>success()</code> ngầm định sẽ quay lại và bỏ qua bước',
            ),
            B(
              'It runs, because ANY status function in a condition REPLACES the implicit <code>success()</code> — which is usually not what the author wanted, and dropping <code>always()</code> gives the intended behaviour',
              'Nó CHẠY, vì BẤT KỲ hàm trạng thái nào trong một điều kiện đều THAY THẾ <code>success()</code> ngầm định — thường không phải điều tác giả muốn, và bỏ <code>always()</code> đi thì được đúng hành vi mong đợi',
            ),
            B(
              'It runs on every branch, because <code>always()</code> short-circuits the whole condition and the branch comparison after it is never evaluated',
              'Nó chạy trên mọi nhánh, vì <code>always()</code> làm cả điều kiện đoản mạch và phép so sánh nhánh phía sau không bao giờ được tính',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Every step and every job carries an implicit <code>success()</code>, and lesson 3.3 states the rule that follows: <b>any status function you write REPLACES it</b>. So <code>always() && github.ref == \'refs/heads/main\'</code> reads as "on main, whatever happened" — including after a failure, and including after a cancellation. For "on main, and only if everything is fine", the condition is just <code>github.ref == \'refs/heads/main\'</code> and nothing else. For a notification you actually want the opposite: <code>failure() && github.ref == \'refs/heads/main\'</code>, two conditions, because without the second one every failed pull request pings the channel. These four functions are supplied by the runner rather than by the expression language itself, so they cannot be evaluated outside a run — this answer rests on the documented rule, not on a measurement.',
            'Mọi bước và mọi job đều mang một <code>success()</code> ngầm định, và bài 3.3 phát biểu cái luật đi theo: <b>bất kỳ hàm trạng thái nào bạn viết ra đều THAY THẾ nó</b>. Nên <code>always() && github.ref == \'refs/heads/main\'</code> đọc thành "trên main, chuyện gì cũng mặc" — kể cả sau một cú hỏng, và kể cả sau một cú huỷ. Muốn "trên main, và chỉ khi mọi thứ ổn" thì điều kiện chỉ là <code>github.ref == \'refs/heads/main\'</code>, không gì thêm. Còn với một thông báo thì bạn muốn điều ngược lại: <code>failure() && github.ref == \'refs/heads/main\'</code>, hai điều kiện, vì thiếu cái thứ hai thì mọi pull request hỏng đều ping cả kênh. Bốn hàm này do runner cấp chứ không thuộc chính ngôn ngữ biểu thức, nên không đánh giá được ở ngoài một lần chạy — đáp án này dựa trên luật đã tài liệu hoá, không dựa trên một phép đo.',
          ),
        }),

        /* ── 2 câu lập trình ───────────────────────────────────────────── */

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Expand a matrix by hand (chapter 2).</b> A matrix in <code>strategy.matrix</code> is a cross product, then <code>exclude:</code>, then <code>include:</code>. Implement <code>expand(matrix)</code>, which returns the list of job configurations <b>in the order GitHub produces them</b>.</p>' +
            '<p>The rules, exactly as documented:</p>' +
            '<ol>' +
            '<li>Every key other than <code>include</code> and <code>exclude</code> is a matrix key. Build the <b>cross product</b> of their value lists, with the FIRST key varying slowest.</li>' +
            '<li><code>exclude:</code> is applied next. An exclude entry is a <b>partial</b> match: a combination is removed when every key:value pair in the entry matches it. An entry may name only some of the keys.</li>' +
            '<li><code>include:</code> is applied last, one entry at a time, in order. For each entry, look at the keys it shares with the <b>original matrix keys</b>. If those all match a combination, the entry is merged INTO that combination — but only the keys that are <b>not</b> original matrix keys are written, so an original matrix value is never overwritten. One entry may merge into several combinations.</li>' +
            '<li>If an entry merges into NO combination, it is appended as a <b>new</b> combination of its own, exactly as written.</li>' +
            '</ol>' +
            '<p>The last case in the data is the fruit/animal/color/shape example straight out of GitHub\'s documentation; your function must produce the six jobs it lists, in order. Keep the given data and the printing loop exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 31 — Nở một ma trận bằng tay (chương 2).</b> Một ma trận trong <code>strategy.matrix</code> là một tích chéo, rồi tới <code>exclude:</code>, rồi tới <code>include:</code>. Hãy cài đặt <code>expand(matrix)</code>, trả về danh sách cấu hình job <b>theo đúng thứ tự GitHub sinh ra</b>.</p>' +
            '<p>Các luật, đúng như tài liệu:</p>' +
            '<ol>' +
            '<li>Mọi khoá khác <code>include</code> và <code>exclude</code> đều là khoá ma trận. Dựng <b>tích chéo</b> các danh sách giá trị của chúng, với khoá ĐẦU TIÊN biến chậm nhất.</li>' +
            '<li><code>exclude:</code> áp tiếp theo. Một mục exclude khớp <b>MỘT PHẦN</b> là đủ: một tổ hợp bị gỡ khi mọi cặp khoá:giá-trị trong mục ấy đều khớp nó. Một mục có thể chỉ gọi tên vài khoá.</li>' +
            '<li><code>include:</code> áp cuối cùng, lần lượt từng mục, theo thứ tự. Với mỗi mục, xét những khoá nó dùng chung với <b>khoá ma trận GỐC</b>. Nếu tất cả những khoá ấy khớp một tổ hợp thì mục được ghép VÀO tổ hợp đó — nhưng chỉ những khoá <b>KHÔNG</b> phải khoá ma trận gốc mới được ghi, nên một giá trị của ma trận gốc không bao giờ bị ghi đè. Một mục có thể ghép vào nhiều tổ hợp.</li>' +
            '<li>Nếu một mục KHÔNG ghép được vào tổ hợp nào, nó được thêm vào cuối như một tổ hợp <b>MỚI</b>, đúng nguyên văn.</li>' +
            '</ol>' +
            '<p>Ca cuối trong dữ liệu là ví dụ fruit/animal/color/shape lấy thẳng từ tài liệu của GitHub; hàm của bạn phải cho ra đúng sáu job mà tài liệu liệt kê, đúng thứ tự. Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const MATRICES = [\n' +
            "  { ten: 'don-gian', m: { os: ['ubuntu-latest', 'windows-latest'], node: ['18', '20'] } },\n" +
            "  { ten: 'exc-mot-phan', m: { os: ['ubuntu-latest', 'macos-latest', 'windows-latest'], node: ['18', '20', '22'],\n" +
            "      exclude: [{ os: 'windows-latest', node: '18' }, { os: 'macos-latest' }] } },\n" +
            "  { ten: 'inc-them-khoa', m: { os: ['ubuntu-latest', 'windows-latest'],\n" +
            "      include: [{ npm: '10' }] } },\n" +
            "  { ten: 'inc-loc-mot-phan', m: { os: ['ubuntu-latest', 'windows-latest'], node: ['18', '20'],\n" +
            "      include: [{ os: 'ubuntu-latest', bao: 'true' }] } },\n" +
            "  { ten: 'inc-khong-khop', m: { os: ['ubuntu-latest'], node: ['18'],\n" +
            "      include: [{ os: 'macos-latest', node: '22' }] } },\n" +
            "  { ten: 'exc-roi-inc', m: { os: ['ubuntu-latest', 'windows-latest'],\n" +
            "      exclude: [{ os: 'windows-latest' }], include: [{ os: 'windows-latest', node: '22' }] } },\n" +
            "  { ten: 'tai-lieu-github', m: { fruit: ['apple', 'pear'], animal: ['cat', 'dog'],\n" +
            "      include: [{ color: 'green' }, { color: 'pink', animal: 'cat' },\n" +
            "                { fruit: 'apple', shape: 'circle' }, { fruit: 'banana' },\n" +
            "                { fruit: 'banana', animal: 'cat' }] } },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function expand(matrix) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const { ten, m } of MATRICES) {\n' +
            '  const out = expand(m);\n' +
            "  console.log(ten + ' -> ' + out.length + ' job');\n" +
            "  for (const cf of out) console.log('   ' + JSON.stringify(cf));\n" +
            '}\n',
          expectedOutput:
            'don-gian -> 4 job\n' +
            '   {"os":"ubuntu-latest","node":"18"}\n' +
            '   {"os":"ubuntu-latest","node":"20"}\n' +
            '   {"os":"windows-latest","node":"18"}\n' +
            '   {"os":"windows-latest","node":"20"}\n' +
            'exc-mot-phan -> 5 job\n' +
            '   {"os":"ubuntu-latest","node":"18"}\n' +
            '   {"os":"ubuntu-latest","node":"20"}\n' +
            '   {"os":"ubuntu-latest","node":"22"}\n' +
            '   {"os":"windows-latest","node":"20"}\n' +
            '   {"os":"windows-latest","node":"22"}\n' +
            'inc-them-khoa -> 2 job\n' +
            '   {"os":"ubuntu-latest","npm":"10"}\n' +
            '   {"os":"windows-latest","npm":"10"}\n' +
            'inc-loc-mot-phan -> 4 job\n' +
            '   {"os":"ubuntu-latest","node":"18","bao":"true"}\n' +
            '   {"os":"ubuntu-latest","node":"20","bao":"true"}\n' +
            '   {"os":"windows-latest","node":"18"}\n' +
            '   {"os":"windows-latest","node":"20"}\n' +
            'inc-khong-khop -> 2 job\n' +
            '   {"os":"ubuntu-latest","node":"18"}\n' +
            '   {"os":"macos-latest","node":"22"}\n' +
            'exc-roi-inc -> 2 job\n' +
            '   {"os":"ubuntu-latest"}\n' +
            '   {"os":"windows-latest","node":"22"}\n' +
            'tai-lieu-github -> 6 job\n' +
            '   {"fruit":"apple","animal":"cat","color":"pink","shape":"circle"}\n' +
            '   {"fruit":"apple","animal":"dog","color":"green","shape":"circle"}\n' +
            '   {"fruit":"pear","animal":"cat","color":"pink"}\n' +
            '   {"fruit":"pear","animal":"dog","color":"green"}\n' +
            '   {"fruit":"banana"}\n' +
            '   {"fruit":"banana","animal":"cat"}',
          sampleSolution:
            'function expand(matrix) {\n' +
            '  const { include = [], exclude = [], ...base } = matrix;\n' +
            '  const keys = Object.keys(base);\n\n' +
            '  // 1. Tích chéo. Khoá ĐẦU biến chậm nhất, nên nó là vòng ngoài.\n' +
            '  let combos = [{}];\n' +
            '  for (const k of keys) {\n' +
            '    const next = [];\n' +
            '    for (const cf of combos) for (const v of base[k]) next.push({ ...cf, [k]: v });\n' +
            '    combos = next;\n' +
            '  }\n\n' +
            '  // 2. exclude — khớp MỘT PHẦN là loại.\n' +
            '  combos = combos.filter((cf) => !exclude.some((ex) =>\n' +
            '    Object.entries(ex).every(([k, v]) => cf[k] === v)));\n\n' +
            '  // 3. include — ghép vào, không ghi đè khoá của ma trận gốc.\n' +
            '  for (const inc of include) {\n' +
            '    let ghepDuoc = false;\n' +
            '    for (const cf of combos) {\n' +
            '      const lech = Object.entries(inc).some(([k, v]) => keys.includes(k) && cf[k] !== v);\n' +
            '      if (lech) continue;\n' +
            '      ghepDuoc = true;\n' +
            '      for (const [k, v] of Object.entries(inc)) if (!keys.includes(k)) cf[k] = v;\n' +
            '    }\n' +
            '    // 4. Không ghép được vào đâu thì nó tự thành một job mới.\n' +
            '    if (!ghepDuoc) combos.push({ ...inc });\n' +
            '  }\n' +
            '  return combos;\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — A small <code>${{ }}</code> evaluator (chapter 3).</b> The expression language runs before the shell exists, and almost every surprising condition in this course comes from three of its rules. Implement them.</p>' +
            '<p>You are given each expression already parsed into a tiny tree. A node is one of:</p>' +
            code('{ lit: <giá trị> }               // chuỗi, số, boolean hoặc null\n' +
              '{ ctx: "a.b.c" }                // đọc theo đường dẫn trong CTX\n' +
              '{ not: <nút> }\n' +
              '{ op: "==" | "!=" | "<" | ">", l: <nút>, r: <nút> }\n' +
              '{ op: "&&" | "||", l: <nút>, r: <nút> }\n' +
              '{ fn: "contains" | "format", args: [<nút>, ...] }') +
            '<p>Write three functions:</p>' +
            '<ul>' +
            '<li><code>epChuoi(v)</code> — coerce to string: <code>null</code> becomes <code>""</code>, booleans become <code>"true"</code> or <code>"false"</code>, numbers become their digits, a string stays itself.</li>' +
            '<li><code>dungKhong(v)</code> — truthiness. Exactly five values are FALSE: <code>false</code>, the number <code>0</code>, the empty string, and <code>null</code>. Everything else is true, <b>including the strings <code>"false"</code> and <code>"0"</code></b>.</li>' +
            '<li><code>danhGia(node, ctx)</code> — evaluate. The rules that matter:<br>' +
            '<b>Path lookup:</b> any missing segment yields <code>null</code>.<br>' +
            '<b><code>==</code> and <code>!=</code>:</b> same type compares directly, except that two STRINGS compare <b>case-insensitively</b>. Different types are both coerced to NUMBER — <code>null</code> and a blank string become 0, <code>true</code>/<code>false</code> become 1/0, a numeric-looking string becomes its number, anything else becomes NaN and NaN equals nothing.<br>' +
            '<b><code>&lt;</code> and <code>&gt;</code>:</b> two strings compare as text, again case-insensitively. Any other pair is coerced to number, and a NaN on either side makes the result <code>false</code>.<br>' +
            '<b><code>&amp;&amp;</code> and <code>||</code>:</b> these return an OPERAND, not a boolean. <code>&amp;&amp;</code> gives the left value when it is falsy, otherwise the right value. <code>||</code> gives the left value when it is truthy, otherwise the right value. Do not evaluate the right node when the left already decides it.<br>' +
            '<b><code>contains(a, b)</code>:</b> if <code>a</code> is an array, true when any element equals <code>b</code> under the <code>==</code> rules; otherwise a case-insensitive substring test on the string forms. Returns a real boolean.<br>' +
            '<b><code>format(s, ...)</code>:</b> replace <code>{0}</code>, <code>{1}</code> … with the string form of the corresponding argument; a missing argument contributes the empty string.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing loop exactly as they are, and do not install anything. Every expected line was cross-checked against <code>@actions/expressions</code>, GitHub\'s own evaluator.</p>',

            '<p><b>Câu 32 — Một bộ đánh giá <code>${{ }}</code> rút gọn (chương 3).</b> Ngôn ngữ biểu thức chạy TRƯỚC khi shell tồn tại, và gần như mọi điều kiện gây bất ngờ trong khoá này đều tới từ ba luật của nó. Hãy cài đặt chúng.</p>' +
            '<p>Mỗi biểu thức đã được phân giải sẵn thành một cây nhỏ. Một nút là một trong các dạng:</p>' +
            code('{ lit: <giá trị> }               // chuỗi, số, boolean hoặc null\n' +
              '{ ctx: "a.b.c" }                // đọc theo đường dẫn trong CTX\n' +
              '{ not: <nút> }\n' +
              '{ op: "==" | "!=" | "<" | ">", l: <nút>, r: <nút> }\n' +
              '{ op: "&&" | "||", l: <nút>, r: <nút> }\n' +
              '{ fn: "contains" | "format", args: [<nút>, ...] }') +
            '<p>Viết ba hàm:</p>' +
            '<ul>' +
            '<li><code>epChuoi(v)</code> — ép về chuỗi: <code>null</code> thành <code>""</code>, boolean thành <code>"true"</code> hoặc <code>"false"</code>, số thành các chữ số của nó, chuỗi giữ nguyên.</li>' +
            '<li><code>dungKhong(v)</code> — tính đúng-sai. Đúng năm giá trị là SAI: <code>false</code>, số <code>0</code>, chuỗi rỗng, và <code>null</code>. Mọi thứ khác là ĐÚNG, <b>kể cả chuỗi <code>"false"</code> và chuỗi <code>"0"</code></b>.</li>' +
            '<li><code>danhGia(node, ctx)</code> — đánh giá. Những luật quan trọng:<br>' +
            '<b>Tra đường dẫn:</b> thiếu bất kỳ đoạn nào thì trả <code>null</code>.<br>' +
            '<b><code>==</code> và <code>!=</code>:</b> cùng kiểu thì so trực tiếp, riêng hai CHUỖI thì so <b>không phân biệt hoa thường</b>. Khác kiểu thì ép cả hai về SỐ — <code>null</code> và chuỗi trắng thành 0, <code>true</code>/<code>false</code> thành 1/0, chuỗi trông như số thành chính số đó, thứ khác thành NaN và NaN không bằng gì cả.<br>' +
            '<b><code>&lt;</code> và <code>&gt;</code>:</b> hai chuỗi thì so như văn bản, cũng không phân biệt hoa thường. Cặp khác thì ép về số, và có NaN ở bất kỳ vế nào thì kết quả là <code>false</code>.<br>' +
            '<b><code>&amp;&amp;</code> và <code>||</code>:</b> hai toán tử này trả về một TOÁN HẠNG, không phải boolean. <code>&amp;&amp;</code> cho giá trị bên trái khi nó SAI, ngược lại cho giá trị bên phải. <code>||</code> cho giá trị bên trái khi nó ĐÚNG, ngược lại cho giá trị bên phải. Đừng đánh giá nút bên phải khi bên trái đã quyết định xong.<br>' +
            '<b><code>contains(a, b)</code>:</b> nếu <code>a</code> là mảng thì đúng khi có phần tử nào bằng <code>b</code> theo luật của <code>==</code>; ngược lại là phép kiểm chuỗi con không phân biệt hoa thường trên dạng chuỗi của hai vế. Trả về boolean thật.<br>' +
            '<b><code>format(s, ...)</code>:</b> thay <code>{0}</code>, <code>{1}</code> … bằng dạng chuỗi của tham số tương ứng; tham số thiếu thì đóng góp chuỗi rỗng.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và không cài thêm thư viện nào. Mọi dòng kết quả mong đợi đều đã đối chiếu với <code>@actions/expressions</code>, bộ đánh giá của chính GitHub.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const CTX = {\n' +
            "  inputs: { bo_qua_test: 'false', version: '' },\n" +
            "  runner: { os: 'Linux' },\n" +
            "  matrix: { node: '18' },\n" +
            "  steps: { tag: { outputs: { version: '1.2.3' } } },\n" +
            "  nhan: ['deploy', 'urgent'],\n" +
            '};\n' +
            'const CAS = [\n' +
            "  ['inputs.bo_qua_test',            { ctx: 'inputs.bo_qua_test' }],\n" +
            "  ['!inputs.bo_qua_test',           { not: { ctx: 'inputs.bo_qua_test' } }],\n" +
            '  ["inputs.version || \'latest\'",    { op: \'||\', l: { ctx: \'inputs.version\' }, r: { lit: \'latest\' } }],\n' +
            '  ["\'0\' || \'a\'",                    { op: \'||\', l: { lit: \'0\' }, r: { lit: \'a\' } }],\n' +
            '  ["0 && \'b\'",                      { op: \'&&\', l: { lit: 0 }, r: { lit: \'b\' } }],\n' +
            '  ["\'a\' && \'b\'",                    { op: \'&&\', l: { lit: \'a\' }, r: { lit: \'b\' } }],\n' +
            '  ["\'true\' == true",                { op: \'==\', l: { lit: \'true\' }, r: { lit: true } }],\n' +
            '  ["\'\' == 0",                       { op: \'==\', l: { lit: \'\' }, r: { lit: 0 } }],\n' +
            "  ['null == 0',                     { op: '==', l: { lit: null }, r: { lit: 0 } }],\n" +
            '  ["\'abc\' == \'ABC\'",                { op: \'==\', l: { lit: \'abc\' }, r: { lit: \'ABC\' } }],\n' +
            '  ["\'10\' > \'9\'",                    { op: \'>\', l: { lit: \'10\' }, r: { lit: \'9\' } }],\n' +
            '  ["\'2\' > 1",                       { op: \'>\', l: { lit: \'2\' }, r: { lit: 1 } }],\n' +
            '  ["\'abc\' > 1",                     { op: \'>\', l: { lit: \'abc\' }, r: { lit: 1 } }],\n' +
            '  ["\'a\' < \'B\'",                     { op: \'<\', l: { lit: \'a\' }, r: { lit: \'B\' } }],\n' +
            "  ['matrix.node == 18',             { op: '==', l: { ctx: 'matrix.node' }, r: { lit: 18 } }],\n" +
            '  ["contains(\'Hello world\',\'WORLD\')", { fn: \'contains\', args: [{ lit: \'Hello world\' }, { lit: \'WORLD\' }] }],\n' +
            '  ["contains(nhan, \'DEPLOY\')",      { fn: \'contains\', args: [{ ctx: \'nhan\' }, { lit: \'DEPLOY\' }] }],\n' +
            "  ['steps.khong_co.outputs.version', { ctx: 'steps.khong_co.outputs.version' }],\n" +
            '  ["format(\'v{0}-{1}\', <vang>, runner.os)",\n' +
            '    { fn: \'format\', args: [{ lit: \'v{0}-{1}\' }, { ctx: \'steps.khong_co.outputs.version\' }, { ctx: \'runner.os\' }] }],\n' +
            '  ["steps.tag.outputs.version != \'\'", { op: \'!=\', l: { ctx: \'steps.tag.outputs.version\' }, r: { lit: \'\' } }],\n' +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function epChuoi(v) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function dungKhong(v) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function danhGia(n, ctx) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const [nhan, cay] of CAS) {\n' +
            '  const kq = danhGia(cay, CTX);\n' +
            "  console.log(nhan.padEnd(38) + ' -> ' + JSON.stringify(epChuoi(kq)).padEnd(10)\n" +
            "    + ' dung=' + dungKhong(kq) + ' kieu=' + (kq === null ? 'null' : Array.isArray(kq) ? 'array' : typeof kq));\n" +
            '}\n',
          expectedOutput:
            'inputs.bo_qua_test                     -> "false"    dung=true kieu=string\n' +
            '!inputs.bo_qua_test                    -> "false"    dung=false kieu=boolean\n' +
            "inputs.version || 'latest'             -> \"latest\"   dung=true kieu=string\n" +
            "'0' || 'a'                             -> \"0\"        dung=true kieu=string\n" +
            "0 && 'b'                               -> \"0\"        dung=false kieu=number\n" +
            "'a' && 'b'                             -> \"b\"        dung=true kieu=string\n" +
            "'true' == true                         -> \"false\"    dung=false kieu=boolean\n" +
            "'' == 0                                -> \"true\"     dung=true kieu=boolean\n" +
            'null == 0                              -> "true"     dung=true kieu=boolean\n' +
            "'abc' == 'ABC'                         -> \"true\"     dung=true kieu=boolean\n" +
            "'10' > '9'                             -> \"false\"    dung=false kieu=boolean\n" +
            "'2' > 1                                -> \"true\"     dung=true kieu=boolean\n" +
            "'abc' > 1                              -> \"false\"    dung=false kieu=boolean\n" +
            "'a' < 'B'                              -> \"true\"     dung=true kieu=boolean\n" +
            'matrix.node == 18                      -> "true"     dung=true kieu=boolean\n' +
            "contains('Hello world','WORLD')        -> \"true\"     dung=true kieu=boolean\n" +
            "contains(nhan, 'DEPLOY')               -> \"true\"     dung=true kieu=boolean\n" +
            'steps.khong_co.outputs.version         -> ""         dung=false kieu=null\n' +
            "format('v{0}-{1}', <vang>, runner.os)  -> \"v-Linux\"  dung=true kieu=string\n" +
            "steps.tag.outputs.version != ''        -> \"true\"     dung=true kieu=boolean",
          sampleSolution:
            'function epChuoi(v) {\n' +
            "  if (v === null) return '';\n" +
            "  if (typeof v === 'boolean') return v ? 'true' : 'false';\n" +
            '  return String(v);\n' +
            '}\n\n' +
            'function dungKhong(v) {\n' +
            "  // Đúng năm giá trị SAI. Chuỗi 'false' và chuỗi '0' KHÔNG nằm trong đó.\n" +
            "  return !(v === null || v === false || v === 0 || v === '');\n" +
            '}\n\n' +
            'function epSo(v) {\n' +
            '  if (v === null) return 0;\n' +
            "  if (typeof v === 'boolean') return v ? 1 : 0;\n" +
            "  if (typeof v === 'number') return v;\n" +
            "  if (String(v).trim() === '') return 0;\n" +
            '  return Number(v);\n' +
            '}\n\n' +
            'function bang(a, b) {\n' +
            '  if (a === null && b === null) return true;\n' +
            '  const cungKieu = a !== null && b !== null && typeof a === typeof b;\n' +
            '  if (cungKieu) {\n' +
            "    if (typeof a === 'string') return a.toLowerCase() === b.toLowerCase();\n" +
            '    return a === b;\n' +
            '  }\n' +
            '  const x = epSo(a), y = epSo(b);\n' +
            '  return Number.isNaN(x) || Number.isNaN(y) ? false : x === y;\n' +
            '}\n\n' +
            'function danhGia(n, ctx) {\n' +
            "  if ('lit' in n) return n.lit;\n" +
            "  if ('ctx' in n) {\n" +
            '    let cur = ctx;\n' +
            "    for (const k of n.ctx.split('.')) {\n" +
            "      if (cur === null || typeof cur !== 'object' || !(k in cur)) return null;\n" +
            '      cur = cur[k];\n' +
            '    }\n' +
            '    return cur === undefined ? null : cur;\n' +
            '  }\n' +
            "  if ('not' in n) return !dungKhong(danhGia(n.not, ctx));\n" +
            "  if (n.fn === 'contains') {\n" +
            '    const [h, k] = n.args.map((a) => danhGia(a, ctx));\n' +
            '    if (Array.isArray(h)) return h.some((it) => bang(it, k));\n' +
            '    return epChuoi(h).toLowerCase().includes(epChuoi(k).toLowerCase());\n' +
            '  }\n' +
            "  if (n.fn === 'format') {\n" +
            '    const [mau, ...rest] = n.args.map((a) => danhGia(a, ctx));\n' +
            '    return epChuoi(mau).replace(/\\{(\\d+)\\}/g, (_, i) => epChuoi(rest[Number(i)] ?? null));\n' +
            '  }\n' +
            '  const l = danhGia(n.l, ctx);\n' +
            '  // Hai toán tử này trả về TOÁN HẠNG, nên không đánh giá vế phải khi không cần.\n' +
            "  if (n.op === '&&') return dungKhong(l) ? danhGia(n.r, ctx) : l;\n" +
            "  if (n.op === '||') return dungKhong(l) ? l : danhGia(n.r, ctx);\n" +
            '  const r = danhGia(n.r, ctx);\n' +
            "  if (n.op === '==') return bang(l, r);\n" +
            "  if (n.op === '!=') return !bang(l, r);\n" +
            '  let x, y;\n' +
            "  if (typeof l === 'string' && typeof r === 'string') { x = l.toLowerCase(); y = r.toLowerCase(); }\n" +
            '  else {\n' +
            '    x = epSo(l); y = epSo(r);\n' +
            '    if (Number.isNaN(x) || Number.isNaN(y)) return false;\n' +
            '  }\n' +
            "  return n.op === '<' ? x < y : x > y;\n" +
            '}\n',
        }),
      ],
    },
  ],
};
