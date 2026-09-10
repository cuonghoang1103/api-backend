/**
 * GitHub Actions — Progress Test 2 (Chương 4 → 7).
 *
 * Đề tự soạn, bám sát `content/courses/github-actions/s04-action.mjs` …
 * `s07-toc-do.mjs`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng
 * thi. PT là đề GIỮA KỲ nên dễ hơn FE một bậc: mỗi câu bám vào MỘT cơ chế.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ MỌI KẾT QUẢ TRONG ĐỀ ĐỀU CHẠY THẬT, KHÔNG ĐOÁN
 * ────────────────────────────────────────────────────────────────────────────
 * Đo 10/09/2026 trên macOS 26.6.2 (darwin-arm64) · Node **v22.21.0** ·
 * GNU bash **3.2.57**. Bộ đồ nghề cài trong một thư mục nháp NGOÀI kho này
 * (không thêm gói nào vào `package.json`): **@actions/expressions 0.3.61**
 * (bộ đánh giá biểu thức của chính GitHub), **js-yaml 4.2.0**,
 * **minimatch 9.0.9** — đúng ba bản mà đề FE của khoá đã dùng.
 *
 * Hai câu lập trình của đề này đều là mô hình THUẦN DỮ LIỆU, chạy được bằng
 * `node` trong một thư mục không có `node_modules`:
 *   • Câu 31 phát lại luật khôi phục/lưu của `actions/cache` (khớp chính xác →
 *     `restore-keys` trượt tiền tố → tính bất biến của một mục cache → khoanh
 *     vùng theo nhánh). Bản mẫu đã chạy và mười lượt cho ra đúng bảng in trong
 *     `expectedOutput`.
 *   • Câu 32 giải đồ thị `needs:` ra các tầng chạy, đường tới hạn và trạng thái
 *     job khi có job hỏng, cộng phát hiện chu trình.
 *
 * ⚠️ **KHÔNG có câu nào bắt học viên nhớ một số đo THỜI GIAN của máy soạn đề.**
 * Máy đang chạy nhiều tác vụ song song. Những con số THỜI GIAN xuất hiện trong
 * đề đều là số của GIÁO TRÌNH, in ngay trong câu hỏi để học viên ĐỌC chứ không
 * phải để nhớ.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ NĂM CHỖ GIÁO TRÌNH TỰ MÂU THUẪN — ĐỀ THEO SỐ, KHÔNG THEO CÂU KẾT LUẬN
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. **Bài 5.1 kết luận zstd "nhanh hơn 6,4 lần VÀ nhỏ hơn" — chỉ đúng NỬA.**
 *    Trong chính bảng của bài: nén `gzip -1` mất 11.040 ms cho 192 MB, `zstd -3`
 *    mất 1.727 ms cho 152 MB (đúng, 6,4× và nhỏ hơn). Nhưng cột KHÔI PHỤC thì
 *    gzip **13.076 ms** còn zstd **14.712 ms** — zstd **CHẬM HƠN khi khôi
 *    phục**. Câu 16 in nguyên bảng ấy và hỏi học viên ĐỌC bảng thay vì đọc câu
 *    kết luận; đó cũng là luật vận hành A của Chương 11.
 *
 * 2. **Bài 6.4 tóm tắt "Bốn xanh, ba vàng" — đếm sai bảng của chính nó.** Bảng
 *    chấm điểm 7 hàng có 3 hàng ✅ (biểu thức sự kiện trong `run:` = 0 chỗ;
 *    `pull_request_target` = 0/11; bí mật biến đổi bị in ra = không) và 4 hàng
 *    ⚠️ (ghim SHA 0/21; `permissions:` 1/11; `environment:` 0/11; bí mật sống
 *    lâu 2/8). Là **ba xanh, bốn vàng**. Đề KHÔNG hỏi phép đếm này.
 *
 * 3. **Bài 5.4 viết "macOS gấp 3,4 lần Windows cho cùng một đầu ra" — sai
 *    mốc.** Số đo là macOS 27 s, Windows 6 s ⇒ **4,5×**. Con số 3,4× là macOS
 *    so với **Linux** (27/8), và bài 7.1 dùng nó đúng như thế. Đề không hỏi tỉ
 *    lệ này; câu 18 chỉ dùng ba con số 8/6/27 và 12 nguyên văn.
 *
 * 4. **Bài 7.5 viết "workflow phát hành chiếm 16% số lần chạy"** — 85/(526+85)
 *    = 13,9%, còn 85/2.343 = 3,6%. Không phép chia nào ra 16%. Con số **76%
 *    hoá đơn** (8.500/11.130) thì đúng, và câu 30 chỉ dùng con số ấy.
 *
 * 5. **Bài 7.4 viết "áp cả hai thì 543 → 471 giây"** — 543 − 72 = 471, tức chỉ
 *    áp một phép. Phép thứ hai (bước có điều kiện, 24 s) chính bài mô tả là
 *    "một điều kiện VỐN ĐÃ có sẵn" nên không phải khoản tiết kiệm cộng thêm.
 *    Câu 28 chỉ dùng cặp 72 giây / 13%.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BỐN CHỖ KHÔNG ĐO ĐƯỢC (nói rõ để không ai tưởng đã kiểm)
 * ────────────────────────────────────────────────────────────────────────────
 *   • Mọi số đo cache của bài 5.1 và 5.5 chạy trên **ĐĨA CỤC BỘ, không có
 *     thời gian mạng** — chính vì thế bài 5.5 nêu phần truyền dưới dạng KHOẢNG
 *     (1,5–6,1 s ở 200/100/50 MB/s) chứ không nêu một con số. Kết luận "cache
 *     `node_modules` có DẤU không đoán được" là hệ quả của khoảng ấy.
 *   • Giới hạn **10 GB mỗi kho, thu hồi LRU, 7 ngày không dùng**, retention
 *     artifact **90 ngày**, trần **6 tiếng một job**: giáo trình ghi rõ là
 *     "theo TÀI LIỆU", không phải đo. Đây là chính sách của GitHub và đổi được.
 *   • Quyền mặc định của `GITHUB_TOKEN` là một **THIẾT LẬP của kho**, không đọc
 *     được từ tệp workflow ⇒ đề chỉ hỏi CƠ CHẾ (nêu một phạm vi thì mọi phạm vi
 *     khác về `none`; khối mức job THAY THẾ khối mức workflow), không hỏi "mặc
 *     định là gì".
 *   • Tập các dạng mã hoá mà runner tự đăng ký để che: giáo trình tự cảnh báo
 *     "ĐỪNG dựa vào việc đó là những dạng nào — tập ấy không được ghi thành một
 *     cam kết". Đề không hỏi.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Phân bố câu theo chương (tổng 30 trắc nghiệm + 2 lập trình):
 *    Ch 4 — action và mã của người khác ........  8   (câu 1–8)
 *    Ch 5 — cache và artifact ..................  8   (câu 9–16)
 *    Ch 6 — bí mật, quyền, token ...............  7   (câu 17–23)
 *    Ch 7 — tốc độ, concurrency, chi phí .......  7   (câu 24–30)
 *    Lập trình: câu 31 (cache, Ch5) · câu 32 (đường tới hạn, Ch7)
 *
 * Cân vị trí đáp án — 28 câu một đáp án + 2 câu "chọn HAI" = 32 lượt:
 *    A 8 · B 8 · C 8 · D 8
 *    node -e "import('./content/exams/GITHUB-ACTIONS-PT2.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>q.kind==='MCQ').forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/GITHUB-ACTIONS-PT2.mjs --apply
 */
import { B, EX, code, ptInstructions, mcq, codeQ } from './_lib/ghactions-exam-kit.mjs';

export default {
  course: { slug: 'github-actions' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 4–7 (actions, caches and artifacts, secrets and permissions, speed)',
        'Kiểm tra tiến độ 2 — Chương 4–7 (action, cache và artifact, bí mật và quyền, tốc độ)',
      ),
      description: B(
        'The middle third of the GitHub Actions course: what running someone else\'s code in your job actually means, what a tag pins and what it does not, caches that pay for themselves and caches that never saved a byte, artifacts as deliverables, secret masking and the token, and where the wall-clock time of a run really goes. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba giữa của khoá GitHub Actions: chạy mã của người khác trong job của mình thật ra nghĩa là gì, một cái thẻ ghim được gì và không ghim được gì, cache có lãi và cache chưa từng lưu nổi một byte, artifact như một sản phẩm bàn giao, che bí mật và cái token, và thời gian đồng hồ của một lần chạy thật ra đi đâu. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '4–7'),
      questions: [

        /* ── Chương 4 — action và mã của người khác (8 câu) ────────────── */

        // q1 · đáp án C (2)
        mcq({
          prompt: B(
            'A workflow pins its toolchain like this, and the build silently uses the wrong Node version for weeks:' + code(
              '- uses: actions/setup-node@v4\n' +
              '  with:\n' +
              "    node_version: '22'",
            ) + 'What happened, and why was there no error?',
            'Một workflow ghim bộ công cụ như sau, và bản dựng âm thầm dùng sai phiên bản Node suốt nhiều tuần:' + code(
              '- uses: actions/setup-node@v4\n' +
              '  with:\n' +
              "    node_version: '22'",
            ) + 'Chuyện gì đã xảy ra, và vì sao không có lỗi nào?',
          ),
          options: [
            B(
              'Underscores and hyphens are interchangeable in <code>with:</code>, so the key was accepted; the version was ignored because it was quoted and the action wanted a number',
              'Gạch dưới và gạch ngang thay nhau được trong <code>with:</code> nên khoá vẫn được nhận; phiên bản bị bỏ qua vì nó có nháy trong khi action muốn một con số',
            ),
            B(
              'The action failed to start and the job continued because <code>uses:</code> steps carry an implicit <code>continue-on-error</code>, so nothing was reported',
              'Action không khởi động được và job vẫn chạy tiếp vì các bước <code>uses:</code> mang sẵn một <code>continue-on-error</code> ngầm định, nên không có gì được báo cáo',
            ),
            B(
              'The correct key is <code>node-version</code>. Every <code>with:</code> key just becomes an <code>INPUT_&lt;KEY&gt;</code> environment variable, so a misspelled key is simply an unused variable — the action reads nothing and falls back to its DEFAULT version',
              'Khoá đúng là <code>node-version</code>. Mỗi khoá <code>with:</code> chỉ trở thành một biến môi trường <code>INPUT_&lt;KHOÁ&gt;</code>, nên một khoá gõ sai chỉ là một biến không ai dùng — action không đọc được gì và rơi về phiên bản MẶC ĐỊNH của nó',
            ),
            B(
              'GitHub validates <code>with:</code> against the action\'s <code>action.yml</code> at parse time and rewrote the key to the closest legal name, which happened to be a different input',
              'GitHub đối chiếu <code>with:</code> với <code>action.yml</code> của action lúc phân giải và đã viết lại khoá thành tên hợp lệ gần nhất, mà cái đó lại tình cờ là một input khác',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Lesson 4.1 spells out the whole mechanism: a <code>with:</code> key becomes <code>INPUT_&lt;KEY&gt;</code>, upper-cased, in the environment of that step. That is all it is. Nothing validates the name, so a typo is <b>silently ignored</b> — no error, no warning — and you get whatever the action does when the input is absent. The symptom is a green build on the wrong toolchain, which surfaces weeks later as a runtime difference nobody can place. The same mechanism is the reason <code>with:</code> is safe against shell injection: the action receives the value as DATA in an environment variable, never as text spliced into a script. Read <code>action.yml</code>, not the README.',
            'Bài 4.1 nói rõ toàn bộ cơ chế: một khoá <code>with:</code> trở thành <code>INPUT_&lt;KHOÁ&gt;</code>, viết hoa, trong môi trường của bước ấy. Chỉ có thế. Không gì kiểm tên cả, nên một chỗ gõ sai bị <b>BỎ QUA im lặng</b> — không lỗi, không cảnh báo — và bạn nhận về bất cứ thứ gì action làm khi thiếu input. Triệu chứng là một bản dựng xanh trên sai bộ công cụ, và nó lộ ra vài tuần sau dưới dạng một khác biệt lúc chạy mà chẳng ai đặt tên được. Cũng chính cơ chế ấy là lý do <code>with:</code> an toàn trước shell injection: action nhận giá trị dưới dạng DỮ LIỆU trong một biến môi trường, không bao giờ dưới dạng chữ ghép vào một script. Hãy đọc <code>action.yml</code>, đừng đọc README.',
          ),
        }),

        // q2 · đáp án A (0)
        mcq({
          prompt: B(
            'A matrix job runs on Linux, macOS and Windows, and someone proposes replacing a <code>run:</code> block with a Docker action (<code>runs: {using: docker, image: ...}</code>). What are the two consequences?',
            'Một job ma trận chạy trên Linux, macOS và Windows, và có người đề nghị thay một khối <code>run:</code> bằng một Docker action (<code>runs: {using: docker, image: ...}</code>). Hai hệ quả là gì?',
          ),
          options: [
            B(
              'It runs on Linux only, so two of the three legs break — and where it does run, the image pull is paid for once PER JOB',
              'Nó chỉ chạy được trên Linux nên hai trong ba nhánh vỡ — và ở chỗ nó chạy được thì lượt kéo ảnh phải trả TỪNG JOB một',
            ),
            B(
              'It runs everywhere but starts a Linux container on macOS and Windows through a compatibility layer, which costs about a minute per leg on the two non-Linux runners',
              'Nó chạy được ở mọi nơi nhưng khởi động một container Linux trên macOS và Windows qua một lớp tương thích, tốn khoảng một phút mỗi nhánh trên hai runner không phải Linux',
            ),
            B(
              'It runs everywhere and the image is cached in the runner tool cache, so the pull is paid for once per repository and then reused across runs',
              'Nó chạy được ở mọi nơi và ảnh được cache trong tool cache của runner, nên lượt kéo chỉ trả một lần cho mỗi kho rồi dùng lại qua các lần chạy',
            ),
            B(
              'It runs on Linux and Windows but not macOS, and it is the only action type that can install system packages, which is why it is the right choice for a build step',
              'Nó chạy được trên Linux và Windows nhưng không trên macOS, và đó là loại action duy nhất cài được gói hệ thống, nên nó là lựa chọn đúng cho một bước dựng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 4.1 splits actions into three kinds and the differences are real. A <b>JavaScript</b> action (<code>using: node20</code>) runs on all three platforms, on the runner\'s own Node — all eight actions this repository uses are of this kind. A <b>Docker</b> action brings its own toolchain, which is the appeal, but it is <b>Linux only</b> and the image is pulled <b>per job</b>, so it is the wrong choice inside a matrix that includes macOS or Windows. A <b>composite</b> action adds no new capability at all — it is a way to package steps you could already write, and every <code>run:</code> inside it must name a <code>shell:</code>.',
            'Bài 4.1 chia action thành ba loại và khác biệt là thật. Một action <b>JavaScript</b> (<code>using: node20</code>) chạy được cả ba nền tảng, trên chính Node của runner — cả tám action kho này dùng đều thuộc loại này. Một action <b>Docker</b> mang theo bộ công cụ riêng, đó là chỗ hấp dẫn của nó, nhưng nó <b>CHỈ Linux</b> và ảnh bị kéo <b>theo TỪNG JOB</b>, nên nó là lựa chọn sai bên trong một ma trận có macOS hay Windows. Một action <b>composite</b> thì không thêm năng lực mới nào cả — nó là cách đóng gói những bước bạn vốn đã viết được, và mọi <code>run:</code> bên trong nó phải nêu một <code>shell:</code>.',
          ),
        }),

        // q3 · đáp án D (3)
        mcq({
          prompt: B(
            'A job that uses eight actions shows this step numbering in its log:' + code(
              'dung : checkout(2) setup-node(3) cache-SWC(4) cache-backend(5)\n' +
              '       buildx(10) ghcr-login(11) anh-backend(14) anh-frontend(15)\n' +
              'don  : anh-frontend(43) anh-backend(44) ghcr-login(45) buildx(46)\n' +
              '       cache-backend(47) cache-SWC(48) setup-node(49) checkout(50)',
            ) + 'What is happening in the second block, and why does it matter?',
            'Một job dùng tám action hiện cách đánh số bước như sau trong log:' + code(
              'dung : checkout(2) setup-node(3) cache-SWC(4) cache-backend(5)\n' +
              '       buildx(10) ghcr-login(11) anh-backend(14) anh-frontend(15)\n' +
              'don  : anh-frontend(43) anh-backend(44) ghcr-login(45) buildx(46)\n' +
              '       cache-backend(47) cache-SWC(48) setup-node(49) checkout(50)',
            ) + 'Khối thứ hai đang làm gì, và vì sao nó quan trọng?',
          ),
          options: [
            B(
              'It is a retry pass: the runner replays every <code>uses:</code> step in reverse to confirm each one is still healthy before the job is marked green',
              'Đó là một lượt thử lại: runner phát lại mọi bước <code>uses:</code> theo thứ tự ngược để xác nhận từng cái vẫn khoẻ trước khi job được đánh dấu xanh',
            ),
            B(
              'It is the matrix expansion: the eight actions are re-run once per matrix leg, and the numbering restarts high because each leg reserves its own block of step numbers',
              'Đó là phép nở ma trận: tám action được chạy lại một lượt cho mỗi nhánh ma trận, và số hiệu bắt đầu lại ở mức cao vì mỗi nhánh giữ riêng một khối số hiệu',
            ),
            B(
              'It is the cleanup of a CANCELLED job only; on a successful job the post steps are skipped, which is why their numbers are not contiguous with the setup steps',
              'Đó là phần dọn dẹp CHỈ dành cho job bị huỷ; ở một job thành công thì các post step bị bỏ qua, và đó là lý do số hiệu của chúng không liền mạch với các bước dựng',
            ),
            B(
              'It is the post phase, running in EXACT reverse order — and it is where <code>actions/cache</code> actually saves the cache and <code>actions/checkout</code> removes the credentials it wrote into <code>.git/config</code>',
              'Đó là pha post, chạy theo thứ tự NGƯỢC CHÍNH XÁC — và đó chính là chỗ <code>actions/cache</code> THẬT SỰ lưu cache và <code>actions/checkout</code> gỡ thông tin đăng nhập nó đã ghi vào <code>.git/config</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Eight actions set up, eight torn down, last-in-first-out — the same discipline as a stack. The consequence you have to carry around is that <b>a cache is not saved when the cache step runs; it is saved at the end of the job</b>, which is why a cancelled job saves nothing and why the "Path Validation Error" that means a cache is dead only ever appears in the post phase. Same for <code>docker/login-action</code> logging out, and for <code>actions/checkout</code> unsetting <code>http.https://github.com/.extraheader</code>. The gaps in the numbering are the runner reserving slots for these post steps in advance — observable and harmless.',
            'Tám action dựng lên, tám cái tháo xuống, vào sau ra trước — đúng kỷ luật của một ngăn xếp. Hệ quả bạn phải mang theo là <b>một cái cache KHÔNG được lưu lúc bước cache chạy; nó được lưu ở CUỐI job</b>, và đó là lý do một job bị huỷ chẳng lưu được gì, cũng là lý do cái "Path Validation Error" báo một cache đã chết chỉ xuất hiện ở pha post. Tương tự với <code>docker/login-action</code> lúc đăng xuất, và với <code>actions/checkout</code> lúc gỡ <code>http.https://github.com/.extraheader</code>. Những khoảng trống trong đánh số là runner dành sẵn chỗ cho các post step ấy — quan sát được và vô hại.',
          ),
        }),

        // q4 · đáp án B (1)
        mcq({
          prompt: B(
            'A team hardens their workflows by replacing every <code>@v4</code> with a full 40-character commit SHA. Which statement about what that buys is correct?',
            'Một nhóm gia cố workflow của họ bằng cách thay mọi <code>@v4</code> bằng một mã băm commit 40 ký tự đầy đủ. Phát biểu nào về thứ họ mua được là ĐÚNG?',
          ),
          options: [
            B(
              'It also freezes what the action downloads, which is the point: <code>setup-node</code> pinned by SHA will reuse the exact Node distribution it fetched on the first run',
              'Nó cũng đóng băng luôn thứ action tải về, và đó là điểm chính: <code>setup-node</code> ghim bằng SHA sẽ dùng lại đúng bản Node nó đã kéo về ở lần chạy đầu',
            ),
            B(
              'It freezes the CODE that runs, and nothing else: <code>setup-node</code> still fetches a Node distribution over the network and <code>checkout</code> still fetches the repository, so pinning must be paired with an update mechanism such as Dependabot',
              'Nó đóng băng MÃ đang chạy, và không gì khác: <code>setup-node</code> vẫn kéo một bản phân phối Node qua mạng và <code>checkout</code> vẫn kéo kho về, nên ghim phải đi kèm một cơ chế cập nhật, chẳng hạn Dependabot',
            ),
            B(
              'A full version tag such as <code>@v4.2.1</code> gives the same guarantee at lower maintenance cost, because a released tag cannot be moved once it has been published',
              'Một thẻ phiên bản đầy đủ như <code>@v4.2.1</code> cho cùng bảo đảm ấy với chi phí bảo trì thấp hơn, vì một thẻ đã phát hành thì không dời được nữa',
            ),
            B(
              'It has no effect on supply-chain risk, because GitHub resolves a SHA to the tag that contains it before downloading, so the two forms are equivalent at run time',
              'Nó không ảnh hưởng gì tới rủi ro chuỗi cung ứng, vì GitHub phân giải một mã băm về cái thẻ chứa nó trước khi tải, nên hai dạng tương đương lúc chạy',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Lesson 4.2 names the trap exactly: pinning fixes <i>the code that runs</i>, not <i>everything that code brings in</i>. A SHA-pinned <code>setup-node</code> still reaches out for a Node distribution; a SHA-pinned <code>checkout</code> still clones. A full version tag is better than a major tag but is still a TAG — anyone with write access can force-move it, so it is a convention, not a guarantee. And a pin with nobody watching it becomes an unpatched dependency, which is why the workable answer is <b>SHA plus an update bot</b>: Dependabot understands Actions pinning and bumps the SHA while leaving the version number in a comment.',
            'Bài 4.2 gọi tên chính xác cái bẫy: ghim cố định <i>mã đang chạy</i>, không cố định <i>mọi thứ mã ấy mang vào</i>. Một <code>setup-node</code> ghim SHA vẫn với tay ra mạng lấy một bản phân phối Node; một <code>checkout</code> ghim SHA vẫn clone. Một thẻ phiên bản đầy đủ thì tốt hơn thẻ major nhưng vẫn là một THẺ — ai có quyền ghi cũng dời cưỡng bức được, nên nó là quy ước chứ không phải bảo đảm. Và một cái ghim không ai trông thì thành một phụ thuộc chưa vá, vì thế đáp án làm được là <b>SHA CỘNG một bot cập nhật</b>: Dependabot hiểu cách ghim của Actions và sẽ nâng SHA kèm số phiên bản trong bình luận.',
          ),
        }),

        // q5 · đáp án [0, 3] — chọn HAI
        mcq({
          prompt: B(
            '<code>actions/checkout</code> defaults to <code>fetch-depth: 1</code>. Choose TWO things that default costs you.',
            '<code>actions/checkout</code> mặc định là <code>fetch-depth: 1</code>. Chọn HAI thứ mà mặc định ấy khiến bạn mất.',
          ),
          options: [
            B(
              'There is no merge base, so <code>git diff origin/main...HEAD</code> fails with <code>unknown revision</code> — the usual reason a hand-written "which files changed" step does not work first time',
              'Không có merge base, nên <code>git diff origin/main...HEAD</code> hỏng với <code>unknown revision</code> — lý do thường gặp nhất khiến một bước "file nào đã đổi" viết tay không chạy được ngay lần đầu',
            ),
            B(
              'The working tree is incomplete: only files touched by the last commit are written to disk, so a build that reads an untouched file fails with a missing-file error',
              'Cây làm việc không đầy đủ: chỉ những tệp mà commit cuối đụng tới mới được ghi xuống đĩa, nên một bản dựng đọc một tệp không bị đụng sẽ hỏng với lỗi thiếu tệp',
            ),
            B(
              'The checkout is read-only, so a later <code>git push</code> step fails with a permissions error until you set <code>persist-credentials: true</code>',
              'Bản checkout là chỉ-đọc, nên một bước <code>git push</code> phía sau hỏng với lỗi quyền cho tới khi bạn đặt <code>persist-credentials: true</code>',
            ),
            B(
              'Submodules are skipped SILENTLY — you get empty directories with no error — and tags are absent, so <code>git describe</code> is useless',
              'Submodule bị bỏ qua ÂM THẦM — bạn nhận về những thư mục rỗng mà không có lỗi nào — và tag cũng vắng mặt, nên <code>git describe</code> vô dụng',
            ),
          ],
          correct: [0, 3],
          explanation: EX(
            'A shallow clone gives you the full working tree at one commit — the FILES are all there, which is why option B is wrong. What is missing is HISTORY: no merge base, no other branches, no tags, and no submodules (that last one is a separate default, and it fails by leaving empty directories rather than by raising). Cures: <code>fetch-depth: 0</code>, or <code>fetch-tags: true</code>, or <code>submodules: recursive</code>. Lesson 4.3 also measured that on this repository the full history costs only about two seconds and forty megabytes, because a 440 MB working tree dwarfs 2,515 commits of history — so "shallow is faster" is a rule worth measuring rather than assuming.',
            'Một bản clone nông cho bạn trọn cây làm việc tại một commit — các TỆP đều có đủ, và đó là lý do phương án B sai. Thứ thiếu là LỊCH SỬ: không merge base, không nhánh nào khác, không tag, và không submodule (cái cuối là một mặc định riêng, và nó hỏng bằng cách để lại thư mục rỗng chứ không bằng cách báo lỗi). Cách chữa: <code>fetch-depth: 0</code>, hoặc <code>fetch-tags: true</code>, hoặc <code>submodules: recursive</code>. Bài 4.3 cũng đo được rằng trên kho này trọn lịch sử chỉ tốn khoảng hai giây và bốn mươi megabyte, vì một cây làm việc 440 MB át hẳn 2.515 commit lịch sử — nên "nông thì nhanh hơn" là một quy tắc đáng ĐO chứ không đáng giả định.',
          ),
        }),

        // q6 · đáp án C (2)
        mcq({
          prompt: B(
            'A workflow declares <code>cache: \'npm\'</code> on <code>actions/setup-node</code>, and the cache is confirmed to be hitting. <code>npm ci</code> still takes between 38 and 107 seconds depending on the platform. Why?',
            'Một workflow khai <code>cache: \'npm\'</code> trên <code>actions/setup-node</code>, và cache đã được xác nhận là đang trúng. <code>npm ci</code> vẫn mất từ 38 tới 107 giây tuỳ nền tảng. Vì sao?',
          ),
          options: [
            B(
              'The hit is partial: <code>setup-node</code> restores only the packages whose versions are unchanged since the previous run, so a lockfile edit forces most of the install to happen anyway',
              'Cú trúng chỉ một phần: <code>setup-node</code> chỉ khôi phục những gói có phiên bản không đổi so với lần chạy trước, nên một chỗ sửa lockfile buộc phần lớn lượt cài vẫn phải chạy',
            ),
            B(
              'The cache is restored after <code>npm ci</code> has already started, because <code>setup-node</code> defers its restore to the post phase, so the first install of each run never benefits',
              'Cache được khôi phục sau khi <code>npm ci</code> đã bắt đầu, vì <code>setup-node</code> hoãn lượt khôi phục sang pha post, nên lượt cài đầu tiên của mỗi lần chạy không bao giờ hưởng lợi',
            ),
            B(
              'It caches <code>~/.npm</code>, the package manager\'s DOWNLOAD directory — not <code>node_modules</code>. <code>npm ci</code> still deletes and rebuilds the tree, so the cache removes the network fetch and nothing else',
              'Nó cache <code>~/.npm</code>, thư mục TẢI VỀ của trình quản lý gói — chứ không cache <code>node_modules</code>. <code>npm ci</code> vẫn xoá và dựng lại cả cây, nên cache gỡ bỏ lượt tải qua mạng và không gì khác',
            ),
            B(
              'The cache is scoped per platform, so on a three-leg matrix only the Linux leg can hit it and the other two always install cold from the registry',
              'Cache được khoanh theo nền tảng, nên trên một ma trận ba nhánh chỉ nhánh Linux trúng được còn hai nhánh kia luôn cài lạnh từ registry',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the single most commonly misread line in a workflow file. Lesson 4.4 states it and lesson 5.1 measures it: a cold <code>npm ci</code> took 31,409 ms and a warm one 18,757 ms, so the cache is worth about 40% — real, and worth the one line — but the remaining 60% is unpacking, linking and install scripts across 38,909 files, and no download cache touches that. Anyone who reads "dependencies are cached" as "there is no install step" is expecting the other 60%. Caching <code>node_modules</code> directly is the thing that would remove it, and lesson 5.5 shows that trade has an unknown SIGN once you count the transfer.',
            'Đây là dòng bị đọc nhầm nhiều nhất trong một tệp workflow. Bài 4.4 phát biểu nó và bài 5.1 đo nó: một lượt <code>npm ci</code> lạnh mất 31.409 ms còn lượt ấm mất 18.757 ms, nên cache đáng khoảng 40% — thật, và đáng cái một dòng ấy — nhưng 60% còn lại là giải nén, liên kết và script cài đặt trên 38.909 tệp, mà không cache tải-về nào đụng tới chỗ đó. Ai đọc "phụ thuộc đã được cache" thành "không có bước cài" là đang trông đợi 60% kia. Cache thẳng <code>node_modules</code> mới là thứ gỡ bỏ được nó, và bài 5.5 cho thấy phép đánh đổi ấy có DẤU không xác định một khi tính cả phần truyền.',
          ),
        }),

        // q7 · đáp án A (0)
        mcq({
          prompt: B(
            'The course tried to reproduce the cache key that <code>actions/setup-node</code> generates. Eight candidate algorithms were computed and compared with the key in a real run log:' + code(
              'khoa THAT trong log:\n' +
              '  node-cache-Linux-x64-npm-699ec67c02f94027efff6b4cd1c7f842cbaa689063c4d900c963e39ac11c4c6a\n' +
              '\n' +
              '8 ung vien tinh ngoai tuyen  ->  0 cai khop',
            ) + 'What is the usable conclusion?',
            'Khoá học đã thử tái lập khoá cache mà <code>actions/setup-node</code> sinh ra. Tám thuật toán ứng viên được tính rồi so với khoá trong một log chạy thật:' + code(
              'khoa THAT trong log:\n' +
              '  node-cache-Linux-x64-npm-699ec67c02f94027efff6b4cd1c7f842cbaa689063c4d900c963e39ac11c4c6a\n' +
              '\n' +
              '8 ung vien tinh ngoai tuyen  ->  0 cai khop',
            ) + 'Kết luận dùng được là gì?',
          ),
          options: [
            B(
              'A key you write yourself is predictable — you can compute it offline and check it exactly — while a built-in key is OPAQUE and only visible in the log AFTER a run; so reach for an explicit <code>actions/cache</code> when the caching behaviour is itself the question',
              'Khoá bạn TỰ viết thì đoán trước được — tính ngoại tuyến và đối chiếu chính xác được — còn khoá dựng sẵn thì ĐỤC và chỉ thấy trong log SAU khi chạy; vậy nên hãy với tay tới một <code>actions/cache</code> tường minh khi chính hành vi cache là câu hỏi',
            ),
            B(
              'The reproduction of <code>hashFiles()</code> used in the experiment must be wrong, because a 64-character hex string that does not match can only mean the hashing step differs',
              'Bản tái lập <code>hashFiles()</code> dùng trong thí nghiệm chắc chắn sai, vì một chuỗi hex 64 ký tự không khớp thì chỉ có thể nghĩa là bước băm khác nhau',
            ),
            B(
              'Built-in keys include a per-repository salt, which is why they cannot be computed anywhere else; adding the repository name to a candidate would have matched',
              'Khoá dựng sẵn có kèm một hạt muối riêng theo kho, và đó là lý do không tính được ở nơi khác; thêm tên kho vào một ứng viên là sẽ khớp',
            ),
            B(
              'Nothing usable: an unmatched key is a null result, and a null result is exactly the kind of finding that should be dropped from a course rather than written up',
              'Không có gì dùng được: một khoá không khớp là một kết quả rỗng, và kết quả rỗng đúng là loại phát hiện nên bỏ khỏi một khoá học chứ không nên viết ra',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The <code>hashFiles()</code> reimplementation is not in doubt — lesson 3.4 matched a real <code>actions/cache</code> key with it, all 64 characters. So the difference is not in the hashing; <code>setup-node</code> simply builds its key some other way. That is a null result, and the course writes it up rather than hiding it, because the conclusion is practical: <b>predictability is a property of the key you wrote</b>. When you need to reason about hits and misses — the three-run rule, a restore-key ladder, an eviction question — use an explicit <code>actions/cache</code> whose key you can compute on your own machine.',
            'Bản tái lập <code>hashFiles()</code> thì không có gì phải nghi ngờ — bài 3.4 đã khớp một khoá <code>actions/cache</code> thật bằng nó, đủ cả 64 ký tự. Vậy khác biệt không nằm ở phép băm; <code>setup-node</code> đơn giản là dựng khoá của nó theo cách khác. Đó là một kết quả rỗng, và khoá học viết nó ra thay vì giấu đi, vì kết luận thì rất thực dụng: <b>tính đoán trước được là tính chất của cái khoá BẠN viết</b>. Khi cần lập luận về trúng và trượt — quy tắc ba lần chạy, một thang restore-key, một câu hỏi về thu hồi — hãy dùng một <code>actions/cache</code> tường minh mà bạn tính được khoá của nó ngay trên máy mình.',
          ),
        }),

        // q8 · đáp án D (3)
        mcq({
          prompt: B(
            'A deploy job is factored into a reusable workflow and called like this. The deploy then fails somewhere deep inside an SSH step, with a message about something else entirely.' + code(
              'jobs:\n' +
              '  goi:\n' +
              '    uses: ./.github/workflows/dung-chung.yml\n' +
              '    with:\n' +
              '      moi_truong: production',
            ) + 'What is wrong?',
            'Một job deploy được rút thành một workflow dùng lại và được gọi như sau. Cuộc deploy rồi hỏng ở đâu đó sâu trong một bước SSH, với một thông báo về một chuyện hoàn toàn khác.' + code(
              'jobs:\n' +
              '  goi:\n' +
              '    uses: ./.github/workflows/dung-chung.yml\n' +
              '    with:\n' +
              '      moi_truong: production',
            ) + 'Sai ở đâu?',
          ),
          options: [
            B(
              'A reusable workflow may not be referenced by a local path; <code>uses:</code> at job level requires <code>owner/repo/.github/workflows/file.yml@ref</code>, and the local form silently resolves to an empty workflow',
              'Một workflow dùng lại không được tham chiếu bằng đường dẫn cục bộ; <code>uses:</code> ở mức job đòi <code>owner/repo/.github/workflows/file.yml@ref</code>, còn dạng cục bộ âm thầm phân giải ra một workflow rỗng',
            ),
            B(
              'The called workflow runs on the caller\'s runner and inherits its filesystem, so it needs its own <code>actions/checkout</code>, and without one every path it reads is empty',
              'Workflow được gọi chạy trên runner của bên gọi và thừa hưởng hệ tệp của nó, nên nó cần một <code>actions/checkout</code> riêng, thiếu cái đó thì mọi đường dẫn nó đọc đều rỗng',
            ),
            B(
              'The <code>with:</code> block may only carry strings, so <code>moi_truong</code> arrives as the literal text <code>production</code> instead of resolving to the environment of that name',
              'Khối <code>with:</code> chỉ mang được chuỗi, nên <code>moi_truong</code> tới nơi dưới dạng chữ <code>production</code> chứ không phân giải thành environment mang tên ấy',
            ),
            B(
              'There is no <code>secrets:</code> block, so the called workflow receives NO secrets — and it receives them as EMPTY STRINGS rather than as an error, so the deploy runs with a blank host and a blank key and fails later',
              'Không có khối <code>secrets:</code>, nên workflow được gọi KHÔNG nhận bí mật nào — và nó nhận chúng dưới dạng CHUỖI RỖNG chứ không phải một lỗi, nên cuộc deploy chạy với host trống và khoá trống rồi hỏng ở đâu đó phía sau',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A reusable workflow does not inherit <code>secrets</code>. It gets what you pass under <code>secrets:</code>, or everything with <code>secrets: inherit</code> — and passing nothing is not an error, because a missing context evaluates to an empty string. That is what makes the failure so hard to read: the SSH step runs, with no host and no key, and reports a problem about something else. Lesson 4.5 recommends listing the secrets explicitly rather than using <code>inherit</code>, on the grounds that the explicit list is a DECLARATION of what the workflow needs. Local paths are legal here: <code>uses: ./.github/workflows/x.yml</code> at job level works, and unlike a local composite action it does not need a prior checkout — but a reusable workflow does take its own runner, which is the real cost difference against a composite.',
            'Một workflow dùng lại KHÔNG thừa kế <code>secrets</code>. Nó nhận thứ bạn truyền dưới <code>secrets:</code>, hoặc nhận tất cả với <code>secrets: inherit</code> — và truyền-không-gì thì KHÔNG phải một lỗi, vì một context vắng mặt tính ra chuỗi rỗng. Đó là thứ làm cú hỏng khó đọc đến thế: bước SSH có chạy, với host trống và khoá trống, rồi báo về một vấn đề khác. Bài 4.5 khuyên liệt kê bí mật tường minh thay vì dùng <code>inherit</code>, với lý lẽ rằng danh sách tường minh chính là bản KHAI RA workflow ấy cần gì. Đường dẫn cục bộ thì hợp lệ ở đây: <code>uses: ./.github/workflows/x.yml</code> ở mức job chạy được, và khác với một composite action cục bộ, nó không cần checkout trước — nhưng một workflow dùng lại thì nhận một runner riêng, và đó mới là khác biệt chi phí thật so với composite.',
          ),
        }),

        /* ── Chương 5 — cache và artifact (8 câu) ──────────────────────── */

        // q9 · đáp án B (1)
        mcq({
          prompt: B(
            'A developer warms a big dependency cache on <code>feature/a</code>, then opens a pull request from <code>feature/b</code> and finds the cache never hits. Which description of cache scoping is correct?',
            'Một người hâm nóng một cache phụ thuộc lớn trên <code>feature/a</code>, rồi mở một pull request từ <code>feature/b</code> và thấy cache không bao giờ trúng. Mô tả nào về cách khoanh vùng cache là ĐÚNG?',
          ),
          options: [
            B(
              'Caches are scoped per WORKFLOW, not per branch, so the miss means the two branches run different workflow files and the keys therefore differ',
              'Cache được khoanh theo WORKFLOW chứ không theo nhánh, nên cú trượt nghĩa là hai nhánh chạy hai tệp workflow khác nhau và vì thế khoá khác nhau',
            ),
            B(
              'A branch reads its own caches and those of its BASE branch, but two feature branches cannot read each other\'s — so the way to help every PR is to warm the DEFAULT branch, and note that a cache written during a <code>pull_request</code> run does NOT warm main',
              'Một nhánh đọc được cache của chính nó và của nhánh GỐC, nhưng hai nhánh tính năng không đọc được của nhau — nên cách giúp mọi PR là hâm nóng nhánh MẶC ĐỊNH, và lưu ý một cache ghi trong một lần chạy <code>pull_request</code> KHÔNG hâm nóng main',
            ),
            B(
              'Caches are global to the repository and any branch can read any of them; a miss between two branches can only be an eviction under the 10 GB limit',
              'Cache là toàn cục trong kho và nhánh nào cũng đọc được của nhánh nào; một cú trượt giữa hai nhánh chỉ có thể là do thu hồi dưới giới hạn 10 GB',
            ),
            B(
              'Reads flow from a feature branch UP to the default branch: <code>main</code> can restore what a feature branch saved, but not the other way round, which is how a PR warms the trunk',
              'Chiều đọc đi từ nhánh tính năng LÊN nhánh mặc định: <code>main</code> khôi phục được thứ một nhánh tính năng đã lưu, nhưng không có chiều ngược lại, và đó là cách một PR hâm nóng nhánh chính',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The visibility rule has a direction, and lesson 5.2 points it the way people usually do not expect: <b>down from the base branch, never sideways and never up</b>. So the useful move is a scheduled or push job on <code>main</code> that writes the cache every branch can then restore. The corollary bites teams that try to warm the cache from a PR: a <code>pull_request</code> run writes into the PR\'s own scope, so the trunk stays cold no matter how many times the PR runs. Combine this with the seven-day eviction of unused entries and a quiet repository\'s PR builds are cold as a matter of course.',
            'Luật tầm nhìn có một chiều, và bài 5.2 chỉ nó theo hướng người ta thường không ngờ tới: <b>XUỐNG từ nhánh gốc, không bao giờ ngang và không bao giờ lên</b>. Nên nước đi hữu ích là một job theo lịch hoặc theo push trên <code>main</code>, ghi ra cái cache mà mọi nhánh sau đó khôi phục được. Hệ quả cắn đúng những nhóm cố hâm nóng cache từ một PR: một lần chạy <code>pull_request</code> ghi vào phạm vi của CHÍNH PR ấy, nên nhánh chính vẫn lạnh bất kể PR chạy bao nhiêu lần. Ghép chuyện này với luật thu hồi sau bảy ngày không dùng thì các bản dựng PR của một kho im ắng lạnh là chuyện đương nhiên.',
          ),
        }),

        // q10 · đáp án C (2)
        mcq({
          prompt: B(
            'Two cache steps both carry <code>restore-keys</code>. One caches a build output directory that the build tool re-validates every run; the other caches <code>node_modules</code> and the job skips <code>npm ci</code> whenever anything was restored. Which is the dangerous one, and what is the rule?',
            'Hai bước cache đều có <code>restore-keys</code>. Một cái cache một thư mục đầu ra mà công cụ dựng tự kiểm lại ở mỗi lần chạy; cái kia cache <code>node_modules</code> và job bỏ qua <code>npm ci</code> mỗi khi có thứ gì được khôi phục. Cái nào nguy hiểm, và luật là gì?',
          ),
          options: [
            B(
              'Both are equally safe: a restore-key hit always restores the most recently created matching entry, so the content can be at most one run out of date',
              'Cả hai an toàn như nhau: một cú trúng restore-key luôn khôi phục mục khớp được tạo GẦN NHẤT, nên nội dung cũ nhất cũng chỉ lệch một lần chạy',
            ),
            B(
              'The build-output one is dangerous, because a build tool that re-validates will rebuild everything anyway and the restore was pure cost with no benefit',
              'Cái cache đầu ra dựng mới nguy hiểm, vì một công cụ dựng có tự kiểm lại thì dù sao cũng dựng lại tất, và lượt khôi phục là chi phí thuần không thu về gì',
            ),
            B(
              'The <code>node_modules</code> one is dangerous. Use <code>restore-keys</code> when an old hit is a SPEED-UP sitting on top of a correctness step that still runs; do not use it when an old hit REPLACES that step',
              'Cái <code>node_modules</code> mới nguy hiểm. Dùng <code>restore-keys</code> khi một cú trúng cũ là một PHÉP TĂNG TỐC nằm trên một bước đúng đắn VẪN CHẠY; đừng dùng khi một cú trúng cũ THAY THẾ bước ấy',
            ),
            B(
              'The <code>node_modules</code> one is dangerous only when the lockfile has changed; if the lockfile is unchanged the primary key hits and <code>restore-keys</code> is never consulted, so the risk is confined to lockfile edits',
              'Cái <code>node_modules</code> chỉ nguy hiểm khi lockfile đã đổi; nếu lockfile không đổi thì khoá chính trúng và <code>restore-keys</code> không bao giờ được hỏi tới, nên rủi ro chỉ giới hạn ở những lần sửa lockfile',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A <code>restore-keys</code> hit is by definition content from a DIFFERENT lockfile — that is what a prefix match means. Restore that tree and then skip the install, and you are building against versions the lockfile does not name, which is a correctness bug wearing a performance costume. Option D reads plausibly but misses the point: the only time <code>restore-keys</code> fires is exactly when the lockfile changed, so "the risk is confined to lockfile edits" is the whole risk, not a limit on it. The clean formulation from lesson 5.2 is the one to memorise, and it is about what the hit REPLACES.',
            'Một cú trúng <code>restore-keys</code> theo định nghĩa là nội dung của một lockfile KHÁC — đó chính là nghĩa của một cú khớp tiền tố. Khôi phục cái cây ấy rồi bỏ qua bước cài là bạn đang dựng trên những phiên bản mà lockfile không hề gọi tên, tức một lỗi tính đúng đắn mặc bộ đồ hiệu năng. Phương án D nghe có lý nhưng trượt mất trọng tâm: lúc DUY NHẤT <code>restore-keys</code> nổ chính là lúc lockfile đã đổi, nên "rủi ro chỉ giới hạn ở những lần sửa lockfile" là TOÀN BỘ rủi ro chứ không phải một giới hạn của nó. Công thức gọn của bài 5.2 mới là thứ đáng thuộc, và nó nói về việc cú trúng ấy THAY THẾ cái gì.',
          ),
        }),

        // q11 · đáp án A (0)
        mcq({
          prompt: B(
            'Three cache log lines, from three different workflows:' + code(
              'A. Cache hit occurred on the primary key nextjs-..., not saving cache.\n' +
              'B. Cache not found for input keys: build-a1b2c3, build-\n' +
              'C. [warning]Path Validation Error: Path(s) specified in the action\n' +
              '   for caching do(es) not exist, hence no cache is being saved.',
            ) + 'Line B appears on EVERY run of its workflow, never once followed by a hit. Which reading is correct?',
            'Ba dòng log cache, từ ba workflow khác nhau:' + code(
              'A. Cache hit occurred on the primary key nextjs-..., not saving cache.\n' +
              'B. Cache not found for input keys: build-a1b2c3, build-\n' +
              'C. [warning]Path Validation Error: Path(s) specified in the action\n' +
              '   for caching do(es) not exist, hence no cache is being saved.',
            ) + 'Dòng B xuất hiện ở MỌI lần chạy của workflow ấy, không lần nào theo sau là một cú trúng. Cách đọc nào ĐÚNG?',
          ),
          options: [
            B(
              'B is worse than C in one respect: the key changes every run — a commit SHA or a timestamp in it — so the job pays to UPLOAD a new entry every time and never restores one, and unlike C it prints nothing that looks abnormal',
              'B tệ hơn C ở một điểm: khoá đổi mỗi lần chạy — có mã commit hay dấu thời gian trong đó — nên job trả tiền TẢI LÊN một mục mới mỗi lần mà không bao giờ khôi phục được cái nào, và khác với C, nó chẳng in ra thứ gì trông bất thường',
            ),
            B(
              'B is normal and self-correcting: a miss on run N is always followed by a hit on run N+1, so a run of misses only means the workflow has not been triggered twice on the same branch yet',
              'B là bình thường và tự chữa: trượt ở lần N thì luôn có trúng ở lần N+1, nên một chuỗi trượt chỉ nghĩa là workflow chưa được kích hoạt hai lần trên cùng một nhánh',
            ),
            B(
              'B means the <code>restore-keys</code> ladder is misconfigured; the fix is to remove the prefix entry, because listing a prefix that also misses suppresses the save in the post phase',
              'B nghĩa là thang <code>restore-keys</code> bị cấu hình sai; cách sửa là bỏ mục tiền tố đi, vì liệt kê một tiền tố cũng trượt sẽ chặn lượt lưu ở pha post',
            ),
            B(
              'B is the healthiest of the three, because a miss is the only state in which the post phase writes a fresh entry; A and C both end with nothing saved and are therefore equivalent',
              'B là trạng thái khoẻ nhất trong ba, vì trượt là trạng thái duy nhất mà pha post ghi được một mục mới; A và C đều kết thúc mà không lưu gì nên chúng tương đương nhau',
            ),
          ],
          correct: 0,
          explanation: EX(
            'A is a cache that is WORKING — the key is stable and the content has not changed, so there is nothing to save. C is a cache that is DEAD and at least says so in a warning. B is the quiet one: a key that changes on every run misses on every run, saves on every run, and prints a line that is completely normal the first time you see it. That is why lesson 5.3 gives the <b>three-run rule</b>: after adding or changing a cache, read the logs of three consecutive runs on the same branch. Run one should miss then save; runs two and three should hit. Any other shape is a defect.',
            'A là một cache ĐANG CHẠY — khoá ổn định, nội dung không đổi nên chẳng có gì để lưu. C là một cache đã CHẾT và ít nhất còn nói ra bằng một cảnh báo. B mới là cái im lặng: một khoá đổi ở mọi lần chạy thì trượt ở mọi lần chạy, lưu ở mọi lần chạy, và in ra một dòng hoàn toàn bình thường nếu bạn mới thấy nó lần đầu. Đó là lý do bài 5.3 đưa ra <b>quy tắc ba lần chạy</b>: sau khi thêm hoặc đổi một cache, hãy đọc log của ba lần chạy LIÊN TIẾP trên cùng một nhánh. Lần một phải trượt rồi lưu; lần hai và ba phải trúng. Mọi khuôn hình khác đều là lỗi.',
          ),
        }),

        // q12 · đáp án D (3)
        mcq({
          prompt: B(
            'A three-leg build matrix uploads its installers with <code>actions/upload-artifact@v4</code>. The author writes <code>name: ban-cai</code> on all three legs, as they used to under v3. What happens?',
            'Một ma trận dựng ba nhánh tải các bản cài lên bằng <code>actions/upload-artifact@v4</code>. Tác giả viết <code>name: ban-cai</code> ở cả ba nhánh, như họ vẫn làm hồi v3. Chuyện gì xảy ra?',
          ),
          options: [
            B(
              'The three uploads are merged into one artifact, exactly as under v3, and the only change in v4 is that the merged artifact appears on the run page sooner',
              'Ba lượt tải lên được gộp thành một artifact, y hệt v3, và thay đổi duy nhất ở v4 là artifact gộp hiện lên trang lần chạy sớm hơn',
            ),
            B(
              'The last leg to finish silently overwrites the other two, so the artifact contains only the macOS installer and the run page gives no sign that two were lost',
              'Nhánh xong sau cùng âm thầm ghi đè hai nhánh kia, nên artifact chỉ chứa bản cài macOS còn trang lần chạy không có dấu hiệu nào cho thấy hai cái đã mất',
            ),
            B(
              'All three succeed and the artifact is versioned automatically as <code>ban-cai</code>, <code>ban-cai-1</code>, <code>ban-cai-2</code>, which is why the download step needs a wildcard pattern',
              'Cả ba thành công và artifact được đánh phiên bản tự động thành <code>ban-cai</code>, <code>ban-cai-1</code>, <code>ban-cai-2</code>, và đó là lý do bước tải về cần một mẫu ký tự đại diện',
            ),
            B(
              'From v4 an artifact name may be written only ONCE per run, so the second and third uploads fail — the fix is a distinct name per leg, such as <code>ban-cai-${{ matrix.ten }}</code>',
              'Từ v4 một tên artifact chỉ được ghi MỘT lần trong mỗi lần chạy, nên lượt tải lên thứ hai và thứ ba hỏng — cách sửa là mỗi nhánh một tên riêng, chẳng hạn <code>ban-cai-${{ matrix.ten }}</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Immutability is the change v4 makes that breaks existing workflows: a name is written once, and the old pattern of several matrix legs appending into one shared artifact stops working outright. This repository names its uploads <code>ban-cai-macOS</code>, <code>ban-cai-Windows</code>, <code>ban-cai-Linux</code>, one per leg, and the publish job downloads all of them. Worth pairing with the check that job runs afterwards: it counts the files it received, because a missing <code>latest-mac.yml</code> leaves a release page that looks complete while auto-update quietly stops working.',
            'Tính bất biến là thay đổi mà v4 mang lại và nó làm vỡ các workflow có sẵn: một cái tên chỉ được ghi một lần, và khuôn mẫu cũ "nhiều nhánh ma trận cùng nối thêm vào một artifact chung" hỏng thẳng. Kho này đặt tên các lượt tải lên là <code>ban-cai-macOS</code>, <code>ban-cai-Windows</code>, <code>ban-cai-Linux</code>, mỗi nhánh một cái, và job công bố tải cả ba về. Đáng ghép với phép kiểm mà job ấy chạy ngay sau đó: nó ĐẾM số tệp nhận được, vì thiếu một <code>latest-mac.yml</code> sẽ để lại một trang phát hành trông vẫn đầy đủ trong khi tự-cập-nhật âm thầm thôi hoạt động.',
          ),
        }),

        // q13 · đáp án B (1)
        mcq({
          prompt: B(
            'A build job ends with this step. Two design decisions in it are deliberate — which pair, and why?' + code(
              '- name: Luu ban cai lam artifact\n' +
              '  if: always()\n' +
              '  uses: actions/upload-artifact@v4\n' +
              '  with:\n' +
              '    name: ban-cai-${{ matrix.ten }}\n' +
              '    retention-days: 5\n' +
              '    path: desktop/dist/*.zip',
            ),
            'Một job dựng kết thúc bằng bước sau. Hai quyết định thiết kế trong đó là có chủ ý — cặp nào, và vì sao?' + code(
              '- name: Luu ban cai lam artifact\n' +
              '  if: always()\n' +
              '  uses: actions/upload-artifact@v4\n' +
              '  with:\n' +
              '    name: ban-cai-${{ matrix.ten }}\n' +
              '    retention-days: 5\n' +
              '    path: desktop/dist/*.zip',
            ),
          ),
          options: [
            B(
              '<code>if: always()</code> is required by <code>upload-artifact@v4</code>, and <code>retention-days</code> is required because v4 removed the repository-wide default',
              '<code>if: always()</code> là bắt buộc với <code>upload-artifact@v4</code>, và <code>retention-days</code> bắt buộc vì v4 đã bỏ giá trị mặc định ở mức kho',
            ),
            B(
              '<code>if: always()</code> uploads the partial output even when the build failed, which is exactly when you want to look at it — the implicit <code>success()</code> would skip the step; and <code>retention-days: 5</code> overrides the 90-day default, because artifacts count against the repository\'s storage',
              '<code>if: always()</code> tải phần đầu ra dở dang lên cả khi bản dựng hỏng, mà đó đúng là lúc bạn muốn xem nó — <code>success()</code> ngầm định sẽ bỏ qua bước; còn <code>retention-days: 5</code> ghi đè mặc định 90 ngày, vì artifact tính vào dung lượng lưu trữ của kho',
            ),
            B(
              '<code>if: always()</code> makes the step survive a cancellation, which is the only scenario it changes; and <code>retention-days: 5</code> is what makes the artifact restorable by a later run, since anything longer is treated as a cache',
              '<code>if: always()</code> làm bước sống sót qua một cú huỷ, và đó là tình huống duy nhất nó thay đổi; còn <code>retention-days: 5</code> là thứ khiến artifact khôi phục được ở một lần chạy sau, vì bất cứ giá trị nào dài hơn sẽ bị coi là một cache',
            ),
            B(
              'Neither is deliberate: <code>if: always()</code> duplicates the default behaviour of upload steps, and <code>retention-days</code> below 7 is clamped up to 7 to match the cache eviction window',
              'Không cái nào là chủ ý: <code>if: always()</code> lặp lại hành vi mặc định của các bước tải lên, còn <code>retention-days</code> dưới 7 bị kẹp lên 7 cho khớp cửa sổ thu hồi cache',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Every step carries an implicit <code>success()</code>, so without <code>if: always()</code> the upload is skipped precisely on the runs whose output you most want to inspect. That is the same reasoning as the log-collection step in chapter 3, and it is the one place where <code>always()</code> is unambiguously right, because uploading a file does not act on the outside world. Retention defaults to 90 days and can be set per artifact or repository-wide; a sensible split is long retention for release artifacts and something like five days for PR builds. And note what <code>retention-days</code> does NOT do: an artifact is scoped to its own RUN, and a later run cannot restore it by name from inside a workflow. Needing that is the signal you actually wanted a cache.',
            'Mọi bước đều mang một <code>success()</code> ngầm định, nên nếu không có <code>if: always()</code> thì lượt tải lên bị bỏ qua đúng ở những lần chạy mà bạn muốn soi đầu ra nhất. Đó cũng chính là lập luận của bước thu thập log ở chương 3, và đây là chỗ duy nhất mà <code>always()</code> đúng không cãi được, vì tải một tệp lên thì không tác động ra thế giới bên ngoài. Thời hạn giữ mặc định là 90 ngày và đặt được theo từng artifact hoặc theo cả kho; cách chia hợp lý là giữ lâu cho artifact phát hành và chừng năm ngày cho bản dựng PR. Và hãy để ý thứ <code>retention-days</code> KHÔNG làm: một artifact được khoanh theo chính LẦN CHẠY của nó, và một lần chạy sau không khôi phục nó theo tên từ bên trong một workflow được. Cần điều đó chính là tín hiệu bạn thật ra muốn một cache.',
          ),
        }),

        // q14 · đáp án C (2)
        mcq({
          prompt: B(
            'Lesson 5.5 measures the fixed cost of one cache round trip and then gives three thresholds. Which set is right?' + code(
              'nen  (zstd -3, o post-step):     1.727 ms  cho 667 MB node_modules\n' +
              'giai nen (luc restore):        14.712 ms\n' +
              'phan TINH TOAN:                 ~16,4 s\n' +
              'phan TRUYEN (tarball 152 MB):   1,5 s @200MB/s … 6,1 s @50MB/s',
            ),
            'Bài 5.5 đo chi phí cố định của một vòng cache rồi đưa ra ba ngưỡng. Bộ ngưỡng nào ĐÚNG?' + code(
              'nen  (zstd -3, o post-step):     1.727 ms  cho 667 MB node_modules\n' +
              'giai nen (luc restore):        14.712 ms\n' +
              'phan TINH TOAN:                 ~16,4 s\n' +
              'phan TRUYEN (tarball 152 MB):   1,5 s @200MB/s … 6,1 s @50MB/s',
            ),
          ),
          options: [
            B(
              'Under 30 seconds of saving is never worth it; between 30 seconds and 2 minutes you should measure; over 2 minutes it is always worth it',
              'Tiết kiệm dưới 30 giây thì không bao giờ đáng; từ 30 giây tới 2 phút thì nên đo; trên 2 phút thì luôn đáng',
            ),
            B(
              'Any saving is worth it as long as the cached directory is under the 10 GB repository limit, because the compute cost is paid in the post phase and therefore outside the job\'s critical path',
              'Tiết kiệm bao nhiêu cũng đáng miễn thư mục được cache nằm dưới giới hạn 10 GB của kho, vì phần tính toán trả ở pha post nên nằm ngoài đường tới hạn của job',
            ),
            B(
              'Under about 5 seconds of saving it is almost certainly not worth it; between about 5 and 30 seconds you have to measure it yourself; over about 30 seconds it almost certainly is',
              'Tiết kiệm dưới khoảng 5 giây thì gần như chắc chắn không đáng; từ khoảng 5 tới 30 giây thì phải tự đo lấy; trên khoảng 30 giây thì gần như chắc chắn đáng',
            ),
            B(
              'The thresholds are stated in megabytes rather than seconds: under 100 MB always cache, 100 MB to 1 GB measure, over 1 GB never cache because eviction pressure dominates',
              'Các ngưỡng được nêu theo megabyte chứ không theo giây: dưới 100 MB thì luôn cache, từ 100 MB tới 1 GB thì đo, trên 1 GB thì đừng cache vì áp lực thu hồi lấn át',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The point of the thresholds is that the middle band is where honest work lives. Caching <code>node_modules</code> on top of a warm <code>~/.npm</code> saves 4.1 seconds of compute and costs 1.5 to 6.1 seconds of transfer, so it is worth somewhere between plus three seconds and MINUS two — a change whose SIGN you cannot predict, which is the course\'s way of saying it is not an optimisation at all until someone measures it on their own runners. Meanwhile the <code>cache: \'npm\'</code> line saves 12.6 seconds and is positive at every bandwidth in the table. Note the transfer figures are a RANGE and not a measurement: all the cache timings were taken on local disk, with no network in them.',
            'Điểm của mấy cái ngưỡng là dải GIỮA mới là chỗ có việc tử tế phải làm. Cache <code>node_modules</code> chồng lên một <code>~/.npm</code> đã ấm thì tiết kiệm 4,1 giây tính toán và tốn 1,5 tới 6,1 giây truyền, nên nó đáng đâu đó giữa cộng ba giây và ÂM hai — một thay đổi mà bạn không đoán trước được DẤU của nó, và đó là cách khoá học nói rằng nó chưa phải một phép tối ưu chừng nào chưa có ai đo trên chính runner của mình. Trong khi đó dòng <code>cache: \'npm\'</code> tiết kiệm 12,6 giây và DƯƠNG ở mọi mức băng thông trong bảng. Lưu ý các con số truyền là một KHOẢNG chứ không phải một phép đo: mọi số đo cache đều lấy trên đĩa cục bộ, không có mạng trong đó.',
          ),
        }),

        // q15 · đáp án A (0)
        mcq({
          prompt: B(
            'A team adds a 4 GB per-branch <code>node_modules</code> cache to one workflow. Over the following weeks OTHER workflows in the same repository get slower, and no log connects the two events. What is the mechanism?',
            'Một nhóm thêm một cache <code>node_modules</code> 4 GB theo từng nhánh vào một workflow. Vài tuần sau đó những workflow KHÁC trong cùng kho chậm đi, và không log nào nối hai chuyện lại. Cơ chế là gì?',
          ),
          options: [
            B(
              'The repository cache limit is 10 GB and GitHub evicts the LEAST RECENTLY USED entries to stay under it, so a large per-branch cache quietly pushes out the small caches that were hitting all the time',
              'Giới hạn cache của một kho là 10 GB và GitHub thu hồi những mục ÍT DÙNG NHẤT để nằm dưới nó, nên một cache lớn theo từng nhánh âm thầm đẩy ra ngoài những cache nhỏ vốn vẫn trúng liên tục',
            ),
            B(
              'Caches above 2 GB are stored on slower cold storage, so every workflow that shares the repository\'s cache service inherits the higher latency of the largest entry',
              'Cache trên 2 GB được lưu ở tầng lưu trữ nguội chậm hơn, nên mọi workflow dùng chung dịch vụ cache của kho đều thừa hưởng độ trễ cao hơn của mục lớn nhất',
            ),
            B(
              'A cache that large exceeds the per-entry limit and is rejected, and the rejected upload is retried on every run, consuming the concurrency slots the other workflows would have used',
              'Một cache lớn như thế vượt trần dung lượng từng mục và bị từ chối, rồi lượt tải lên bị từ chối ấy được thử lại ở mọi lần chạy, ngốn mất những suất đồng thời mà các workflow kia đáng ra dùng',
            ),
            B(
              'Nothing about the cache is responsible: caches are isolated per workflow, so the slowdown must be an unrelated change to the runner image in the same period',
              'Cache không chịu trách nhiệm gì cả: cache được cô lập theo từng workflow, nên chuyện chậm đi phải là một thay đổi không liên quan của ảnh runner trong cùng giai đoạn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The limit is a repository total, not a per-entry ceiling, and eviction is LRU. So the failure mode is displacement: nothing errors, nothing warns, and the caches that were quietly earning their keep stop hitting. Lesson 5.5 names this the symptom to recognise — <b>other workflows get slower after someone optimises ONE</b> — precisely because no single log line connects cause to effect. The second eviction rule is time-based: an entry unused for seven days is removed, which means a monthly workflow effectively never has a cache no matter how well its key is designed. Both limits come from GitHub\'s documentation rather than from a measurement, and GitHub can change them.',
            'Giới hạn là TỔNG của một kho chứ không phải trần của từng mục, và phép thu hồi là LRU. Nên kiểu hỏng ở đây là sự CHÈN ÉP: không có lỗi nào, không có cảnh báo nào, và những cache vốn lặng lẽ làm tốt việc của mình thì thôi trúng. Bài 5.5 gọi tên đúng cái triệu chứng cần nhận ra — <b>các workflow khác chậm đi sau khi có người tối ưu MỘT cái</b> — chính vì không dòng log nào nối nguyên nhân với kết quả. Luật thu hồi thứ hai thì theo thời gian: một mục không dùng suốt bảy ngày sẽ bị gỡ, nghĩa là một workflow chạy hằng tháng thực tế KHÔNG BAO GIỜ có cache, dù khoá của nó thiết kế khéo tới đâu. Cả hai giới hạn đều lấy từ tài liệu của GitHub chứ không từ một phép đo, và GitHub đổi được chúng.',
          ),
        }),

        // q16 · đáp án D (3)
        mcq({
          prompt: B(
            'Read the measured table, then read the sentence the lesson draws from it:' + code(
              'thuat toan    NEN (post-step)   dung luong   KHOI PHUC (restore)\n' +
              '---------------------------------------------------------------\n' +
              'gzip -1            11.040 ms        192 MB          13.076 ms\n' +
              'zstd -3             1.727 ms        152 MB          14.712 ms\n' +
              '\n' +
              'cau ket luan cua bai: "6,4x nhanh hon, va NHO HON"',
            ) + 'Which reading of the table is accurate?',
            'Đọc bảng đo, rồi đọc câu mà bài học rút ra từ nó:' + code(
              'thuat toan    NEN (post-step)   dung luong   KHOI PHUC (restore)\n' +
              '---------------------------------------------------------------\n' +
              'gzip -1            11.040 ms        192 MB          13.076 ms\n' +
              'zstd -3             1.727 ms        152 MB          14.712 ms\n' +
              '\n' +
              'cau ket luan cua bai: "6,4x nhanh hon, va NHO HON"',
            ) + 'Cách đọc nào về bảng này là CHÍNH XÁC?',
          ),
          options: [
            B(
              'The sentence understates the result: zstd wins on all three columns, and the 6.4× figure is the smallest of the three advantages rather than the largest',
              'Câu kết luận nói còn khiêm tốn: zstd thắng ở cả ba cột, và con số 6,4× là lợi thế NHỎ nhất trong ba chứ không phải lớn nhất',
            ),
            B(
              'The table cannot support any comparison, because compression and restore were timed on different sized inputs — 192 MB against 152 MB — so no column is like for like',
              'Bảng này không đỡ được phép so sánh nào, vì lượt nén và lượt khôi phục được bấm giờ trên hai đầu vào khác cỡ — 192 MB so với 152 MB — nên không cột nào so được ngang bằng',
            ),
            B(
              'The sentence is right and the restore column confirms it: 14.712 ms for a smaller archive is a better throughput than 13.076 ms for a larger one, so zstd is faster there too',
              'Câu kết luận đúng và cột khôi phục xác nhận nó: 14.712 ms cho một kho nén nhỏ hơn là thông lượng tốt hơn 13.076 ms cho một kho lớn hơn, nên zstd cũng nhanh hơn ở đó',
            ),
            B(
              'The sentence holds only for the COMPRESS column and the size column. On RESTORE, zstd is measurably SLOWER — 14.712 ms against 13.076 ms — so "faster and smaller" is true where it was measured and not true across the board',
              'Câu kết luận chỉ đúng ở cột NÉN và cột dung lượng. Ở lượt KHÔI PHỤC, zstd chậm hơn thấy rõ — 14.712 ms so với 13.076 ms — nên "nhanh hơn và nhỏ hơn" đúng ở chỗ nó được đo và không đúng trên toàn bảng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This one is a reading exercise, and the answer is in the table the lesson itself printed. The 6.4× is real and it matters, because compression happens in the POST phase and therefore comes off the tail of every job that saves a cache — nine seconds cut from the end of a run. But the restore column goes the other way by about 1.6 seconds, and restore is the half that sits at the START of the job, where a developer is waiting. Neither figure is a reason to change anything: <code>actions/cache</code> chooses the algorithm, not you. The reason to notice is the habit the course keeps insisting on — read the measurement, not the sentence someone wrote under it.',
            'Câu này là một bài tập ĐỌC, và đáp án nằm ngay trong cái bảng mà chính bài học đã in ra. Con số 6,4× là thật và nó có nghĩa, vì phép nén xảy ra ở pha POST nên nó cắt vào ĐUÔI của mọi job có lưu cache — chín giây gỡ khỏi phần cuối một lần chạy. Nhưng cột khôi phục lại đi theo chiều ngược, chênh khoảng 1,6 giây, mà khôi phục mới là nửa nằm ở ĐẦU job, chỗ có một người đang chờ. Không con số nào là lý do để đổi cái gì: <code>actions/cache</code> tự chọn thuật toán, không phải bạn. Lý do đáng để ý là cái thói quen mà khoá học nhắc đi nhắc lại — hãy đọc SỐ ĐO, đừng đọc câu ai đó viết bên dưới nó.',
          ),
        }),

        /* ── Chương 6 — bí mật, quyền, token (7 câu) ───────────────────── */

        // q17 · đáp án B (1)
        mcq({
          prompt: B(
            'A step decodes a secret and wants the decoded value masked too:' + code(
              '- run: |\n' +
              '    KHOA=$(echo "$B64" | base64 -d)\n' +
              '    echo "dang dung khoa: $KHOA"\n' +
              '    echo "::add-mask::$KHOA"\n' +
              '  env:\n' +
              '    B64: ${{ secrets.VPS_SSH_PRIVATE_KEY }}',
            ) + 'What is wrong, and what is the general rule about <code>::add-mask::</code>?',
            'Một bước giải mã một bí mật và muốn giá trị đã giải mã cũng được che:' + code(
              '- run: |\n' +
              '    KHOA=$(echo "$B64" | base64 -d)\n' +
              '    echo "dang dung khoa: $KHOA"\n' +
              '    echo "::add-mask::$KHOA"\n' +
              '  env:\n' +
              '    B64: ${{ secrets.VPS_SSH_PRIVATE_KEY }}',
            ) + 'Sai ở đâu, và luật chung về <code>::add-mask::</code> là gì?',
          ),
          options: [
            B(
              '<code>::add-mask::</code> cannot be used on a multi-line value, so the key is registered as one line and the rest of it stays in the clear regardless of ordering',
              '<code>::add-mask::</code> không dùng được cho một giá trị nhiều dòng, nên khoá chỉ được đăng ký một dòng còn phần còn lại vẫn nằm phơi ra bất kể thứ tự',
            ),
            B(
              'The two lines are in the wrong order: the mask only protects output printed AFTER it runs and never scans backwards, so the key is already in the log — the rule is compute, then mask, then use, and the registration does not survive into another job',
              'Hai dòng bị đảo thứ tự: phép che chỉ bảo vệ đầu ra in ra SAU khi nó chạy và không bao giờ quét ngược lại, nên cái khoá đã nằm trong log rồi — luật là tính, rồi che, rồi dùng, và lượt đăng ký ấy không sống sót sang một job khác',
            ),
            B(
              'Nothing is wrong: the runner buffers a step\'s output and applies every mask registered during that step before writing the log, so the ordering inside one step does not matter',
              'Không sai gì cả: runner đệm đầu ra của một bước và áp mọi phép che đăng ký trong bước ấy trước khi ghi log, nên thứ tự bên trong một bước không quan trọng',
            ),
            B(
              'The mistake is passing the secret through <code>env:</code> at all — <code>::add-mask::</code> only recognises values that were interpolated directly into <code>run:</code>, where the runner can see them being substituted',
              'Chỗ sai là đã truyền bí mật qua <code>env:</code> — <code>::add-mask::</code> chỉ nhận ra những giá trị được nội suy thẳng vào <code>run:</code>, nơi runner nhìn thấy chúng được thay vào',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Masking covers the STORED value byte for byte, and every transformation of a secret produces a value outside that cover — decoding base64, parsing JSON, taking a substring, changing case, URL-encoding. <code>::add-mask::</code> is how you bring a derived value back under it, and it is strictly forward-looking: it does not re-scan output already written, and a value masked in one job is not masked in the next. That last point has a design consequence worth keeping: <b>derive a secret at the point of use</b> rather than passing a derived value between jobs. And remember masking is a display filter on the LOG — it does not cover a file you wrote, an artifact you uploaded, or a request you sent.',
            'Phép che phủ giá trị ĐÃ LƯU, từng byte một, và mọi phép BIẾN ĐỔI một bí mật đều đẻ ra một giá trị nằm ngoài vùng phủ ấy — giải mã base64, phân tích JSON, cắt chuỗi con, đổi hoa thường, mã hoá URL. <code>::add-mask::</code> là cách đưa một giá trị suy ra quay lại dưới vùng phủ, và nó chỉ nhìn về phía TRƯỚC: nó không quét lại đầu ra đã ghi, và một giá trị được che ở job này thì không được che ở job kế. Điểm cuối ấy có một hệ quả thiết kế đáng giữ: <b>hãy SUY RA bí mật ngay tại chỗ dùng</b> thay vì truyền một giá trị đã suy ra giữa các job. Và nhớ rằng che là một bộ lọc HIỂN THỊ trên LOG — nó không phủ một tệp bạn vừa ghi, một artifact bạn vừa tải lên, hay một request bạn vừa gửi.',
          ),
        }),

        // q18 · đáp án C (2)
        mcq({
          prompt: B(
            'After someone adds a new repository secret, the logs of every workflow become hard to read: ordinary words and numbers are replaced by <code>***</code> in places that have nothing to do with credentials. What is the most likely cause?',
            'Sau khi có người thêm một bí mật mới cho kho, log của mọi workflow trở nên khó đọc: những từ và con số bình thường bị thay bằng <code>***</code> ở những chỗ chẳng liên quan gì tới thông tin đăng nhập. Nguyên nhân khả dĩ nhất là gì?',
          ),
          options: [
            B(
              'The secret was added at the organisation level rather than the repository level, and organisation secrets are masked across every log line rather than only where they are referenced',
              'Bí mật được thêm ở mức tổ chức chứ không phải mức kho, và bí mật của tổ chức bị che trên mọi dòng log chứ không chỉ ở chỗ nó được tham chiếu',
            ),
            B(
              'The secret contains a regular-expression metacharacter, so the masking pattern matches far more than the literal value it was built from',
              'Bí mật chứa một ký tự đặc biệt của biểu thức chính quy, nên mẫu che khớp nhiều hơn hẳn cái giá trị nguyên văn nó được dựng từ đó',
            ),
            B(
              'The secret\'s VALUE is a short or very common string — something like <code>true</code>, <code>8080</code> or <code>admin</code> — so every occurrence of that string anywhere in any log gets masked',
              'GIÁ TRỊ của bí mật là một chuỗi ngắn hoặc rất thông dụng — kiểu <code>true</code>, <code>8080</code> hay <code>admin</code> — nên mọi chỗ xuất hiện của chuỗi ấy ở bất kỳ log nào cũng bị che',
            ),
            B(
              'Masking is applied per repository and rebuilt whenever the secret list changes, so the rebuild temporarily masks the previous list as well until the next run refreshes it',
              'Phép che được áp theo kho và dựng lại mỗi khi danh sách bí mật thay đổi, nên lượt dựng lại tạm thời che luôn cả danh sách cũ cho tới khi lần chạy kế làm mới nó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The masking engine scans output for the exact strings it holds, with no notion of context, so a secret whose value happens to be <code>true</code> blacks out the word <code>true</code> everywhere it appears. Lesson 6.1 lists this as one of four surprises about masking, and the diagnostic is memorable: <b>if the logs stop being readable, go looking for a secret with a short value</b>. The other three are worth carrying with it — masking is not a security boundary (anyone who can edit the workflow can print a secret in any shape they like), it only protects against ACCIDENTAL exposure, and if a secret might have been printed the real answer is to rotate it, not to decide it probably was not.',
            'Bộ máy che quét đầu ra tìm ĐÚNG những chuỗi nó đang giữ, không có khái niệm ngữ cảnh, nên một bí mật có giá trị tình cờ là <code>true</code> sẽ bôi đen chữ <code>true</code> ở mọi chỗ nó xuất hiện. Bài 6.1 liệt kê đây là một trong bốn chuyện bất ngờ về phép che, và cách chẩn thì dễ nhớ: <b>nếu log thôi đọc nổi, hãy đi tìm một bí mật có giá trị ngắn</b>. Ba chuyện còn lại cũng đáng mang theo cùng — che KHÔNG phải một ranh giới bảo mật (ai sửa được workflow thì in bí mật ra dưới hình dạng nào tuỳ thích), nó chỉ chống lộ DO TAI NẠN, và nếu một bí mật CÓ THỂ đã bị in ra thì đáp án thật là xoay khoá chứ không phải là kết luận rằng chắc là chưa.',
          ),
        }),

        // q19 · đáp án A (0)
        mcq({
          prompt: B(
            'Of 44 secret references in this repository, 27 are interpolated directly into <code>run:</code> — for example <code>ssh-keyscan -H "${{ secrets.VPS_HOST }}"</code> — while the SSH private key goes through <code>env:</code>. Is the direct form a defect, and what is the underlying rule?',
            'Trong 44 lượt tham chiếu bí mật của kho này, 27 lượt được nội suy thẳng vào <code>run:</code> — ví dụ <code>ssh-keyscan -H "${{ secrets.VPS_HOST }}"</code> — trong khi khoá riêng SSH thì đi qua <code>env:</code>. Dạng nội suy thẳng có phải một khuyết tật không, và luật nằm dưới là gì?',
          ),
          options: [
            B(
              'It is not a defect. The rule is about CONTROL, not secrecy: never interpolate a value SOMEBODY ELSE controls. A host name the repository owner typed is safe; a pull request title is not, whether or not it is a secret',
              'Không phải khuyết tật. Luật nói về QUYỀN KIỂM SOÁT chứ không nói về sự bí mật: đừng bao giờ nội suy một giá trị do NGƯỜI KHÁC kiểm soát. Một tên host do chủ kho gõ vào thì an toàn; một tiêu đề pull request thì không, dù nó có phải bí mật hay không',
            ),
            B(
              'It is a defect in all 27 cases: any <code>secrets.*</code> reference inside <code>run:</code> is spliced into the script as text and can therefore be read out of the expanded command in the log',
              'Là khuyết tật ở cả 27 chỗ: bất kỳ tham chiếu <code>secrets.*</code> nào bên trong <code>run:</code> đều bị ghép vào script dưới dạng chữ nên đọc ra được từ câu lệnh đã nở trong log',
            ),
            B(
              'It is a defect only for the 9 references inside a <code>printf</code>, because a format string is re-parsed by the shell and a secret containing a percent sign would be reinterpreted',
              'Chỉ là khuyết tật với 9 lượt nằm trong một <code>printf</code>, vì chuỗi định dạng bị shell phân giải lại và một bí mật chứa dấu phần trăm sẽ bị hiểu lại',
            ),
            B(
              'It is not a defect because secrets are masked, and masking is what makes interpolation into <code>run:</code> safe — which is why the private key could have used the same form',
              'Không phải khuyết tật vì bí mật đã được che, và chính phép che khiến việc nội suy vào <code>run:</code> trở nên an toàn — nên khoá riêng lẽ ra cũng dùng được cùng dạng ấy',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Expressions are substituted into the script before the shell exists, so an interpolated value is CODE. The danger is therefore a function of who writes the value, not of how sensitive it is. A host name and a user name chosen by the repository owner cannot be turned into a command by anyone else; a pull request title can, and that is the case chapter 3 measured. Lesson 6.1 is blunt about the cost of getting this backwards: <b>the sloppy version of the rule teaches a wrong reflex</b> — people route harmless configuration through <code>env:</code> while cheerfully interpolating attacker-controlled text. Masking is irrelevant to the question: the expanded script does appear in the log group header, and secrets in it show as <code>***</code>, but that is a display filter and not what makes anything safe.',
            'Biểu thức bị thay vào script TRƯỚC khi shell tồn tại, nên một giá trị được nội suy là MÃ. Vì thế mức nguy hiểm là hàm của việc AI viết ra giá trị ấy, không phải của việc nó nhạy cảm tới đâu. Một tên host và một tên người dùng do chủ kho chọn thì không ai khác biến thành câu lệnh được; một tiêu đề pull request thì có, và đó chính là ca chương 3 đã đo. Bài 6.1 nói thẳng cái giá của việc hiểu ngược: <b>bản luộm thuộm của quy tắc dạy ra một PHẢN XẠ SAI</b> — người ta vòng cấu hình vô hại qua <code>env:</code> trong khi vẫn vui vẻ nội suy chữ do kẻ tấn công kiểm soát. Phép che không liên quan tới câu hỏi: script đã nở CÓ hiện trong tiêu đề nhóm của log và bí mật trong đó hiện là <code>***</code>, nhưng đó là một bộ lọc hiển thị chứ không phải thứ làm cho cái gì trở nên an toàn.',
          ),
        }),

        // q20 · đáp án [1, 2] — chọn HAI
        mcq({
          prompt: B(
            'Choose TWO correct statements about <code>GITHUB_TOKEN</code>.',
            'Chọn HAI phát biểu ĐÚNG về <code>GITHUB_TOKEN</code>.',
          ),
          options: [
            B(
              'It is a repository secret like any other: you create it in Settings, and a workflow that does not reference <code>secrets.GITHUB_TOKEN</code> has no token available to it',
              'Nó là một bí mật của kho như mọi bí mật khác: bạn tạo nó trong Settings, và một workflow không tham chiếu <code>secrets.GITHUB_TOKEN</code> thì không có token nào để dùng',
            ),
            B(
              'It is created when the job starts and EXPIRES when the job ends, and it is scoped to exactly one repository — the one running the workflow',
              'Nó được tạo lúc job bắt đầu và HẾT HẠN lúc job kết thúc, và nó được khoanh vào đúng MỘT kho — cái kho đang chạy workflow',
            ),
            B(
              'A job-level <code>permissions:</code> block REPLACES the workflow-level one rather than adding to it, so a job that raises one scope must re-list the scopes it still needs',
              'Một khối <code>permissions:</code> ở mức job THAY THẾ khối ở mức workflow chứ không cộng vào, nên một job nâng một phạm vi thì phải LIỆT KÊ LẠI những phạm vi nó vẫn cần',
            ),
            B(
              'Its default permissions are declared in the workflow file, so reading the file tells you the damage radius of any action running in that job',
              'Quyền mặc định của nó được khai trong tệp workflow, nên đọc tệp là biết được bán kính thiệt hại của mọi action chạy trong job ấy',
            ),
          ],
          correct: [1, 2],
          explanation: EX(
            'The token is automatic: it exists in every job whether or not you reference it, which is exactly why narrowing it matters — 11.3% of step time in this repository is third-party code running with that token in its environment. Its two hard boundaries are TIME (it dies with the job) and SCOPE (one repository). Crossing the second is the one legitimate reason to reach for a PAT, and this repository has exactly that case: the desktop release publishes to a different repository. The replacement rule for job-level blocks is the sharp edge people cut themselves on: raise <code>packages: write</code> on a job and forget to re-list <code>contents: read</code>, and checkout stops working. And the default level is a repository SETTING, not readable from the file — which is the argument for declaring <code>permissions:</code> explicitly, since an unknown damage radius is worse than a known large one.',
            'Cái token là tự động: nó tồn tại trong mọi job dù bạn có tham chiếu hay không, và đó chính là lý do việc thu hẹp nó quan trọng — 11,3% thời gian bước ở kho này là mã bên thứ ba chạy với cái token ấy trong môi trường của nó. Hai ranh giới cứng của nó là THỜI GIAN (nó chết cùng job) và PHẠM VI (một kho). Vượt cái thứ hai là lý do CHÍNH ĐÁNG duy nhất để với tay tới một PAT, và kho này có đúng ca ấy: bản phát hành desktop công bố sang một kho khác. Luật THAY THẾ của khối mức job là cạnh sắc mà người ta hay đứt tay: nâng <code>packages: write</code> lên một job rồi quên liệt kê lại <code>contents: read</code> là checkout thôi chạy. Còn mức mặc định là một THIẾT LẬP của kho, không đọc được từ tệp — và đó là lập luận cho việc khai <code>permissions:</code> tường minh, vì một bán kính thiệt hại KHÔNG BIẾT còn tệ hơn một bán kính lớn đã biết.',
          ),
        }),

        // q21 · đáp án D (3)
        mcq({
          prompt: B(
            'A lint workflow on a PUBLIC repository runs only on <code>pull_request</code> and needs no write access at all. Someone proposes <code>permissions: {}</code>. Which pair of statements is correct?',
            'Một workflow lint trên một kho CÔNG KHAI chỉ chạy trên <code>pull_request</code> và không cần quyền ghi nào. Có người đề nghị <code>permissions: {}</code>. Cặp phát biểu nào ĐÚNG?',
          ),
          options: [
            B(
              '<code>permissions: {}</code> is a syntax error — an empty mapping is rejected and you must write <code>contents: none</code> — and in any case a fork pull request already receives a write token unless an environment restricts it',
              '<code>permissions: {}</code> là lỗi cú pháp — một ánh xạ rỗng bị từ chối và phải viết <code>contents: none</code> — và dù sao thì một pull request từ fork vốn đã nhận một token ghi trừ khi có environment hạn chế nó',
            ),
            B(
              '<code>permissions: {}</code> is valid but <code>actions/checkout</code> will fail on a public repository, so the minimum workable declaration is <code>contents: read</code> in every case',
              '<code>permissions: {}</code> hợp lệ nhưng <code>actions/checkout</code> sẽ hỏng trên một kho công khai, nên khai báo tối thiểu chạy được luôn luôn là <code>contents: read</code>',
            ),
            B(
              '<code>permissions: {}</code> is valid and it is also what protects the workflow from a fork contributor, which is the main reason to add it to a <code>pull_request</code> workflow',
              '<code>permissions: {}</code> hợp lệ và nó cũng chính là thứ bảo vệ workflow trước một người đóng góp từ fork, và đó là lý do chính để thêm nó vào một workflow <code>pull_request</code>',
            ),
            B(
              '<code>permissions: {}</code> is valid — no scopes at all — and checkout still works because the repository is public; and a fork pull request is read-only ALREADY, so the block protects you from your own actions rather than from the contributor',
              '<code>permissions: {}</code> hợp lệ — không phạm vi nào cả — và checkout vẫn chạy được vì kho là công khai; còn một pull request từ fork thì VỐN ĐÃ chỉ-đọc, nên khối ấy bảo vệ bạn trước chính các action của bạn chứ không phải trước người đóng góp',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Two independent facts, and mixing them up is the common error. First, a fork pull request gets a read-only token no matter what the workflow declares — that protection is GitHub\'s and you cannot weaken or strengthen it from the file. Second, <code>permissions: {}</code> is legal and useful on a public repository precisely because cloning a public repository needs no token at all. So what the block buys you is protection against the code running INSIDE your job: eight third-party actions, all pinned to movable major tags. That is the argument stated as a number rather than as a principle. On a private repository the same block would break checkout, and <code>contents: read</code> is the floor.',
            'Hai sự thật độc lập, và trộn lẫn chúng là lỗi phổ biến. Một, một pull request từ fork nhận một token chỉ-đọc bất kể workflow khai gì — biện pháp ấy là của GitHub và bạn không làm nó yếu đi hay mạnh lên từ tệp được. Hai, <code>permissions: {}</code> hợp lệ và hữu ích trên một kho công khai, chính vì clone một kho công khai không cần token nào cả. Vậy thứ cái khối ấy mua cho bạn là sự bảo vệ trước mã chạy BÊN TRONG job của bạn: tám action bên thứ ba, tất cả ghim vào những thẻ major dời được. Đó là lập luận phát biểu bằng một CON SỐ chứ không bằng một nguyên tắc. Trên một kho riêng tư thì cùng cái khối ấy sẽ làm vỡ checkout, và <code>contents: read</code> là sàn.',
          ),
        }),

        // q22 · đáp án C (2)
        mcq({
          prompt: B(
            'The chapter models three actors around a workflow: a stranger opening a pull request from a fork, a third-party action, and a person with write access to the repository. Which one is bounded by NO Actions setting?',
            'Chương này mô hình hoá ba nhân vật quanh một workflow: một người lạ mở pull request từ một fork, một action bên thứ ba, và một người có quyền ghi vào kho. Nhân vật nào KHÔNG bị bất kỳ thiết lập nào của Actions ràng buộc?',
          ),
          options: [
            B(
              'The fork contributor, because the code they push runs on your runner and no permissions block can stop a script from reading the working directory',
              'Người đóng góp từ fork, vì mã họ đẩy lên chạy trên runner của bạn và không khối permissions nào ngăn được một script đọc thư mục làm việc',
            ),
            B(
              'The third-party action, because <code>uses:</code> runs code you did not write and the only control available is a version tag, which is not a control at all',
              'Action bên thứ ba, vì <code>uses:</code> chạy mã bạn không viết và biện pháp duy nhất sẵn có là một cái thẻ phiên bản, mà cái đó thì không phải một biện pháp',
            ),
            B(
              'The person with write access, because they control the workflow FILE — masking, permissions and environments all assume the workflow author is trusted',
              'Người có quyền ghi, vì họ kiểm soát chính TỆP workflow — che bí mật, quyền và environment đều giả định rằng tác giả workflow là ĐÁNG TIN',
            ),
            B(
              'None of the three: branch protection plus required reviews plus a restricted default token together bound all three actors, which is why the repository scores four green rows',
              'Không nhân vật nào: branch protection cộng required review cộng một token mặc định hạn chế, ba cái đó ràng buộc được cả ba, và đó là lý do kho này đạt bốn hàng xanh',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The fork contributor is the best-bounded of the three: measured in chapter 1, a pull_request run from a fork sees no secrets and gets a read-only token. A third-party action is genuinely dangerous but it IS bounded — by <code>permissions:</code>, by what you pass in <code>with:</code> and <code>env:</code>, and by pinning. The person with write access is bounded by none of it, because every one of those controls is written in the file they can edit. That moves the real question out of Actions settings entirely and into branch protection and review. Worth adding: almost every real incident is a second-actor problem, or a mistake that PROMOTES a first-actor into a second — which is what <code>pull_request_target</code> plus <code>ref: head.sha</code> does in one line.',
            'Người đóng góp từ fork lại là nhân vật bị ràng buộc chặt nhất trong ba: đo ở chương 1, một lần chạy pull_request từ fork không thấy bí mật nào và nhận một token chỉ-đọc. Một action bên thứ ba thì nguy hiểm thật nhưng nó CÓ bị ràng buộc — bởi <code>permissions:</code>, bởi những gì bạn truyền trong <code>with:</code> và <code>env:</code>, và bởi việc ghim. Người có quyền ghi thì chẳng bị cái nào ràng buộc, vì mọi biện pháp trong số đó đều được VIẾT trong cái tệp mà họ sửa được. Điều đó đưa câu hỏi thật ra hẳn khỏi phần thiết lập Actions và vào branch protection với review. Đáng nói thêm: gần như mọi sự cố thật đều là chuyện của nhân vật hàng hai, hoặc là một sai lầm NÂNG một nhân vật hàng một lên hàng hai — và đó đúng là thứ <code>pull_request_target</code> cộng <code>ref: head.sha</code> làm trong một dòng.',
          ),
        }),

        // q23 · đáp án A (0)
        mcq({
          prompt: B(
            'A team converts a deploy to OIDC. The cloud provider\'s trust policy matches on this claim:' + code(
              'sub:  repo:cuonghoang1103/api-backend:*',
            ) + 'The role ARN is right and the deploy works. What has the wildcard actually authorised?',
            'Một nhóm chuyển một cuộc deploy sang OIDC. Chính sách tin cậy của nhà cung cấp đám mây khớp trên claim sau:' + code(
              'sub:  repo:cuonghoang1103/api-backend:*',
            ) + 'ARN của role thì đúng và cuộc deploy chạy được. Cái ký tự đại diện ấy thật ra đã cho phép cái gì?',
          ),
          options: [
            B(
              'A token minted by a run on ANY ref of that repository, including a branch a contributor just pushed — the narrower forms match on <code>ref:refs/heads/main</code> or on <code>environment</code>',
              'Một token đúc ra bởi một lần chạy trên BẤT KỲ ref nào của kho ấy, kể cả một nhánh mà ai đó vừa đẩy lên — các dạng hẹp hơn khớp trên <code>ref:refs/heads/main</code> hoặc trên <code>environment</code>',
            ),
            B(
              'Any repository owned by <code>cuonghoang1103</code>, because the wildcard replaces the last path segment and the repository name is not anchored',
              'Bất kỳ kho nào thuộc sở hữu của <code>cuonghoang1103</code>, vì ký tự đại diện thay cho đoạn cuối của đường dẫn và tên kho không được neo',
            ),
            B(
              'Nothing extra: the wildcard only covers the workflow file path, and GitHub always pins <code>sub</code> to the default branch regardless of which ref requested the token',
              'Không thêm gì cả: ký tự đại diện chỉ phủ phần đường dẫn tệp workflow, và GitHub luôn ghim <code>sub</code> vào nhánh mặc định bất kể ref nào xin token',
            ),
            B(
              'Any run in that repository that also declares <code>id-token: write</code>, which is itself the control — so the wildcard is safe as long as only the deploy workflow declares that permission',
              'Bất kỳ lần chạy nào trong kho ấy mà cũng khai <code>id-token: write</code>, và chính cái đó là biện pháp — nên ký tự đại diện an toàn miễn là chỉ workflow deploy khai quyền đó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'OIDC changes the shape of the problem from "store a credential and hand it over" to "prove who you are and be handed a short-lived one" — you store nothing, and the trust lives in the PROVIDER\'s configuration. Which makes the <code>sub</code> claim the actual security boundary, and <code>repo:org/name:*</code> the broad form that gets copied out of blog posts. Narrower: <code>...:ref:refs/heads/main</code>, or a match on <code>environment</code>, which is tightest because an environment can also require a human approval. Option D inverts the model: <code>id-token: write</code> is a permission YOU write in a file, so it is a control over your own workflows, not over who the provider will trust.',
            'OIDC đổi hình dạng bài toán từ "lưu một thông tin đăng nhập rồi trao tay" thành "chứng minh mình là ai rồi được trao một cái sống ngắn" — bạn lưu KHÔNG GÌ CẢ, và sự tin cậy sống trong CẤU HÌNH của nhà cung cấp. Điều đó khiến claim <code>sub</code> trở thành ranh giới bảo mật thật sự, và <code>repo:org/name:*</code> là cái dạng rộng hay bị chép từ một bài blog. Hẹp hơn: <code>...:ref:refs/heads/main</code>, hoặc khớp trên <code>environment</code>, và cái này chặt nhất vì một environment còn đòi được một con người phê duyệt. Phương án D đảo ngược mô hình: <code>id-token: write</code> là một quyền BẠN viết trong một tệp, nên nó là biện pháp với chính workflow của bạn chứ không phải với việc nhà cung cấp sẽ tin ai.',
          ),
        }),

        /* ── Chương 7 — tốc độ, concurrency, chi phí (7 câu) ───────────── */

        // q24 · đáp án B (1)
        mcq({
          prompt: B(
            'A workflow\'s jobs form a fan-out: one job runs first, three run in parallel after it, and one runs after all three. Their durations are 72, 241, 437, 323 and 34 seconds. How do you compute the critical path, and what sanity check goes with it?',
            'Các job của một workflow tạo thành hình toả ra: một job chạy trước, ba job chạy song song sau nó, và một job chạy sau cả ba. Thời lượng của chúng là 72, 241, 437, 323 và 34 giây. Tính đường tới hạn ra sao, và phép kiểm tỉnh táo đi kèm là gì?',
          ),
          options: [
            B(
              'Add every job: 1.107 seconds. If the run took less than that, some jobs were reported with overlapping timestamps and the API figures cannot be trusted',
              'Cộng mọi job: 1.107 giây. Nếu lần chạy ngắn hơn thế thì một số job được báo với dấu thời gian chồng nhau và các con số của API không tin được',
            ),
            B(
              'Before + max(parallel legs) + after = 72 + 437 + 34 = 543 seconds. If the wall-clock time is much LARGER than that, the jobs were waiting for RUNNERS rather than waiting for each other',
              'Trước + max(các nhánh song song) + sau = 72 + 437 + 34 = 543 giây. Nếu thời gian đồng hồ LỚN HƠN nó nhiều thì các job đang chờ RUNNER chứ không chờ nhau',
            ),
            B(
              'Take the slowest job alone: 437 seconds. The other jobs are on the critical path only if they declare <code>needs:</code> on each other, and a fan-out means none of them does',
              'Lấy riêng job chậm nhất: 437 giây. Các job khác chỉ nằm trên đường tới hạn nếu chúng khai <code>needs:</code> lẫn nhau, mà hình toả ra thì không cái nào khai cả',
            ),
            B(
              'Average the three parallel legs and add the two serial jobs: 72 + 334 + 34 = 440 seconds. Using the maximum would double-count the queue time the three legs share',
              'Lấy trung bình ba nhánh song song rồi cộng hai job tuần tự: 72 + 334 + 34 = 440 giây. Dùng giá trị lớn nhất là tính trùng phần thời gian xếp hàng mà ba nhánh dùng chung',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The three numbers a run has are different things and lesson 7.1 keeps them apart: <b>machine-seconds</b> (1,107 here) is what you pay for, <b>wall-clock</b> (555) is what a person waits, and the <b>critical path</b> (543) is the longest chain of dependent jobs — the floor that wall-clock cannot go below without a structural change. In a fan-out only the slowest leg counts, which is why the two faster legs contributed 564 machine-seconds and zero seconds of waiting: halving the Linux build would change the run duration by nothing at all. The sanity check catches the other failure mode: when wall-clock sits well above the critical path, the delay is queueing for runners, not the graph. In this repository queueing was measured at 2–3 seconds, so it is rarely the answer.',
            'Ba con số của một lần chạy là ba thứ khác nhau và bài 7.1 giữ chúng tách bạch: <b>máy-giây</b> (ở đây là 1.107) là thứ bạn TRẢ TIỀN, <b>thời gian đồng hồ</b> (555) là thứ một người NGỒI CHỜ, và <b>đường tới hạn</b> (543) là chuỗi job phụ thuộc DÀI NHẤT — cái sàn mà thời gian đồng hồ không xuống dưới được nếu không đổi CẤU TRÚC. Trong một hình toả ra thì chỉ nhánh chậm nhất được tính, và đó là lý do hai nhánh nhanh hơn đóng góp 564 máy-giây và KHÔNG giây chờ nào: giảm một nửa bản dựng Linux sẽ đổi thời lượng lần chạy đúng không giây. Phép kiểm tỉnh táo bắt kiểu hỏng còn lại: khi thời gian đồng hồ nằm cao hơn hẳn đường tới hạn thì độ trễ là do xếp hàng chờ runner chứ không do đồ thị. Ở kho này thời gian xếp hàng đo được là 2–3 giây, nên nó hiếm khi là đáp án.',
          ),
        }),

        // q25 · đáp án C (2)
        mcq({
          prompt: B(
            'Someone adds <code>needs: lint</code> to a build job "so the order reads sensibly". What test does the course give for whether a <code>needs:</code> edge belongs there?',
            'Có người thêm <code>needs: lint</code> vào một job dựng "cho thứ tự đọc lên nghe hợp lý". Khoá học đưa ra phép thử nào để biết một cạnh <code>needs:</code> có đáng nằm đó không?',
          ),
          options: [
            B(
              'Whether the two jobs run on the same runner label: if they do, the edge costs nothing because the runner is reused and only the queue time is added',
              'Hai job có chạy trên cùng một nhãn runner không: nếu có thì cạnh ấy chẳng tốn gì, vì runner được dùng lại và chỉ cộng thêm thời gian xếp hàng',
            ),
            B(
              'Whether the upstream job is faster than the downstream one: an edge from a short job to a long job is free, since the long job dominates the critical path either way',
              'Job thượng nguồn có nhanh hơn job hạ nguồn không: một cạnh đi từ một job ngắn tới một job dài là miễn phí, vì job dài dù sao cũng át đường tới hạn',
            ),
            B(
              'Whether job B would still produce the RIGHT RESULT if job A failed. If it would, the edge is not a data dependency, and it is costing you the whole of A on every run, forever',
              'Job B có còn cho ra KẾT QUẢ ĐÚNG không nếu job A hỏng. Nếu có thì cạnh ấy không phải một phụ thuộc DỮ LIỆU, và nó đang tốn của bạn trọn cái A ở MỌI lần chạy, vĩnh viễn',
            ),
            B(
              'Whether the downstream job reads an artifact: if it does not download anything, the edge is free because GitHub schedules the two jobs concurrently anyway',
              'Job hạ nguồn có đọc một artifact không: nếu nó không tải gì về thì cạnh ấy miễn phí, vì GitHub dù sao cũng xếp hai job chạy đồng thời',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A <code>needs:</code> edge is a promise that job B consumes something job A produced. Added for tidiness, it turns two parallel jobs into a chain and adds the full duration of the first one to the critical path on every run from then on. Lesson 7.4 measured exactly this in the release workflow: the check job costs 72 seconds and everything waits for it, so moving it off the chain is the single largest speed-up available — 543 down to 471 seconds, 13% of the run, with no code changed and no machine-seconds saved or spent. The course puts it as a slogan worth keeping: <b>restructuring beats optimising</b>, and the question is never "which step is slowest" but "which job sits on the longest chain".',
            'Một cạnh <code>needs:</code> là một LỜI HỨA rằng job B tiêu thụ thứ job A sinh ra. Thêm vào cho ngăn nắp thì nó biến hai job song song thành một chuỗi và cộng trọn thời lượng của cái đầu vào đường tới hạn ở mọi lần chạy từ đó về sau. Bài 7.4 đo đúng chuyện này trong workflow phát hành: job kiểm tốn 72 giây và mọi thứ đợi nó, nên nhấc nó ra khỏi chuỗi là phép tăng tốc lớn nhất sẵn có — 543 xuống 471 giây, 13% lần chạy, không đổi dòng mã nào và không tiết kiệm cũng không tiêu thêm máy-giây nào. Khoá học đóng nó thành một câu đáng giữ: <b>TÁI CẤU TRÚC thắng TỐI ƯU</b>, và câu hỏi không bao giờ là "bước nào chậm nhất" mà là "job nào nằm trên chuỗi dài nhất".',
          ),
        }),

        // q26 · đáp án D (3)
        mcq({
          prompt: B(
            'A team adds this to every workflow in the repository, and afterwards people complain that CI "randomly cancels itself":' + code(
              'concurrency:\n' +
              '  group: ci\n' +
              '  cancel-in-progress: true',
            ) + 'What went wrong, and what is the safe general form?',
            'Một nhóm thêm đoạn sau vào mọi workflow trong kho, và sau đó mọi người kêu là CI "tự dưng huỷ chính nó":' + code(
              'concurrency:\n' +
              '  group: ci\n' +
              '  cancel-in-progress: true',
            ) + 'Sai ở đâu, và dạng tổng quát an toàn là gì?',
          ),
          options: [
            B(
              'The group name must be unique per workflow file or GitHub rejects the configuration at parse time; the safe form is <code>group: ${{ github.workflow }}</code> and nothing else',
              'Tên nhóm phải là duy nhất theo từng tệp workflow nếu không GitHub từ chối cấu hình lúc phân giải; dạng an toàn là <code>group: ${{ github.workflow }}</code> và không gì khác',
            ),
            B(
              '<code>cancel-in-progress: true</code> is never correct — it is the flag that cancels runs — and the safe form always sets it to <code>false</code> and relies on queueing alone',
              '<code>cancel-in-progress: true</code> không bao giờ đúng — đó là cái cờ huỷ các lần chạy — và dạng an toàn luôn đặt nó là <code>false</code> rồi chỉ dựa vào việc xếp hàng',
            ),
            B(
              'Nothing is wrong with the group; the cancellations come from <code>fail-fast</code> in a matrix elsewhere in the same workflow, and the two features are commonly confused',
              'Cái nhóm không sai gì; các cú huỷ tới từ <code>fail-fast</code> của một ma trận ở chỗ khác trong cùng workflow, và hai tính năng này hay bị lẫn với nhau',
            ),
            B(
              'A constant group name means ONE run at a time across the whole repository, so every pull request cancels every other pull request\'s checks — the standard form for PR checks is <code>group: ${{ github.workflow }}-${{ github.ref }}</code>',
              'Một tên nhóm HẰNG nghĩa là một lần chạy tại một thời điểm trên TOÀN kho, nên mọi pull request huỷ phép kiểm của mọi pull request khác — dạng chuẩn cho phép kiểm PR là <code>group: ${{ github.workflow }}-${{ github.ref }}</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The group name is the whole design decision. A constant is right when the workflow touches something genuinely singular — the production server, a registry tag, a release — and this repository uses exactly that for <code>deploy-ghcr</code>. For checks it is far too wide: everything lands in one group and the newest push wins, across unrelated branches. Including the ref separates them, and including the workflow name as well is the safe default. One more rule worth carrying: a group holds only ONE pending run, so a third queued run REPLACES the second rather than joining a queue behind it.',
            'Tên nhóm chính là toàn bộ quyết định thiết kế. Một hằng số là đúng khi workflow chạm vào một thứ thật sự ĐƠN NHẤT — máy chủ production, một nhãn registry, một bản phát hành — và kho này dùng đúng như thế cho <code>deploy-ghcr</code>. Với các phép kiểm thì nó rộng quá đáng: mọi thứ rơi vào một nhóm và cú push mới nhất thắng, xuyên qua cả những nhánh chẳng liên quan gì nhau. Đưa ref vào là tách chúng ra, và đưa thêm tên workflow vào nữa là mặc định an toàn. Thêm một luật đáng mang theo: mỗi nhóm chỉ giữ MỘT lần chạy đang treo, nên một lượt thứ ba xếp hàng sẽ THAY THẾ lượt thứ hai chứ không nối vào sau nó.',
          ),
        }),

        // q27 · đáp án A (0)
        mcq({
          prompt: B(
            'A release workflow already declares <code>concurrency: {group: desktop-release, cancel-in-progress: false}</code>. Version 0.5.40 was still built TWICE — run A published at 18:08:17, run B finished at 18:15:37 and uploaded over the same release. Why did the concurrency block not prevent this?',
            'Một workflow phát hành vốn đã khai <code>concurrency: {group: desktop-release, cancel-in-progress: false}</code>. Phiên bản 0.5.40 vẫn bị dựng HAI lượt — lượt A công bố lúc 18:08:17, lượt B xong lúc 18:15:37 và tải đè lên đúng bản phát hành đó. Vì sao khối concurrency không ngăn được chuyện này?',
          ),
          options: [
            B(
              '<code>concurrency</code> only SERIALISES: it made run B wait for run A and then let it run, exactly as asked. "This version already exists" is a question about STATE, and ordering is a property of SCHEDULING',
              '<code>concurrency</code> chỉ TUẦN TỰ HOÁ: nó bắt lượt B đợi lượt A xong rồi cho chạy, đúng như được yêu cầu. "Phiên bản này ĐÃ tồn tại" là câu hỏi về TRẠNG THÁI, còn thứ tự là tính chất của việc XẾP LỊCH',
            ),
            B(
              '<code>cancel-in-progress: false</code> disables the group entirely, so the two runs were never in the same group; setting it to <code>true</code> would have cancelled run B',
              '<code>cancel-in-progress: false</code> vô hiệu hoá hẳn cái nhóm nên hai lượt chạy chưa từng ở chung một nhóm; đặt nó thành <code>true</code> là đã huỷ được lượt B',
            ),
            B(
              'The two runs were started from different refs, and a concurrency group is implicitly scoped per ref, so they landed in two separate groups despite the constant name',
              'Hai lượt được khởi động từ hai ref khác nhau, mà một nhóm concurrency được khoanh ngầm theo ref, nên chúng rơi vào hai nhóm riêng bất chấp cái tên hằng',
            ),
            B(
              'A group holds only one pending run, so the second run was dropped and the release was actually built once — the duplicate timestamps come from the publish step retrying',
              'Một nhóm chỉ giữ được một lần chạy đang treo nên lượt thứ hai bị bỏ, và bản phát hành thật ra chỉ được dựng một lần — hai dấu thời gian trùng tới từ việc bước công bố thử lại',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the sharpest lesson in chapter 7 because the configuration was already correct for what it does. Queueing kept the two runs from overlapping, and then the second one ran and overwrote the release the first had published. That time it was harmless — same commit — but a different commit would have shipped an installer carrying another version\'s number, and that failure is silent: the release page looks complete. The fix is not a concurrency setting. It is a state check: refuse to start while a build is already running, and refuse to build over a version that has already been published. <code>concurrency</code> is the wrong tool for run-count invariance and always was.',
            'Đây là bài học sắc nhất của chương 7, vì cấu hình vốn ĐÃ đúng với thứ nó làm. Việc xếp hàng giữ cho hai lượt chạy không chồng lên nhau, rồi lượt thứ hai chạy và ghi đè lên bản phát hành mà lượt đầu vừa công bố. Lần ấy vô hại — cùng một commit — nhưng một commit khác thì đã ship một bản cài mang số hiệu của phiên bản khác, và kiểu hỏng ấy ÂM THẦM: trang phát hành nhìn vẫn đầy đủ. Cách vá không phải một thiết lập concurrency. Nó là một phép kiểm TRẠNG THÁI: từ chối khởi động khi đang có một lượt dựng chạy, và từ chối dựng đè lên một phiên bản đã công bố. <code>concurrency</code> là công cụ SAI cho tính bất biến-theo-số-lần-chạy, và xưa nay vẫn thế.',
          ),
        }),

        // q28 · đáp án B (1)
        mcq({
          prompt: B(
            'Two workflows, each run ten times with nothing changed between runs:' + code(
              'ci-lint (giay):        135 155 140 160 144 144 100 144 141 145\n' +
              '  TB 141 · trung vi 144 · do lech 15,2 · bien do max/min 1,60x\n' +
              '\n' +
              'desktop-release (giay): 555 470 409 470 420 425 476 525 403 429\n' +
              '  TB 458 · do lech 48,3 · bien do max/min 1,38x',
            ) + 'What follows for measuring an optimisation?',
            'Hai workflow, mỗi cái chạy mười lần mà giữa các lần không thay đổi gì:' + code(
              'ci-lint (giay):        135 155 140 160 144 144 100 144 141 145\n' +
              '  TB 141 · trung vi 144 · do lech 15,2 · bien do max/min 1,60x\n' +
              '\n' +
              'desktop-release (giay): 555 470 409 470 420 425 476 525 403 429\n' +
              '  TB 458 · do lech 48,3 · bien do max/min 1,38x',
            ) + 'Suy ra được gì cho việc đo một phép tối ưu?',
          ),
          options: [
            B(
              'The release workflow is the noisier of the two, since its standard deviation is more than three times larger; measure optimisations on the lint workflow, where a 15-second effect is already visible',
              'Workflow phát hành mới là cái nhiễu hơn, vì độ lệch chuẩn của nó lớn hơn ba lần; hãy đo các phép tối ưu trên workflow lint, ở đó một hiệu ứng 15 giây đã nhìn thấy được',
            ),
            B(
              'The SHORTER workflow is noisier in relative terms — 1.60× against 1.38× — so a shorter workflow needs MORE runs to say anything; and on <code>ci-lint</code> a saving under about 30 seconds is indistinguishable from noise in a single run',
              'Workflow NGẮN hơn thì nhiễu hơn theo TỈ LỆ — 1,60× so với 1,38× — nên một workflow càng ngắn càng cần NHIỀU lần chạy mới nói được điều gì; và trên <code>ci-lint</code> thì một khoản tiết kiệm dưới khoảng 30 giây không phân biệt được với tiếng ồn nếu chỉ chạy một lần',
            ),
            B(
              'The 100-second run in the lint series is an outlier caused by a change that was later reverted, so it should be dropped before computing the spread',
              'Lần chạy 100 giây trong dãy lint là một ngoại lai do một thay đổi sau đó bị hoàn tác, nên phải bỏ nó ra trước khi tính độ phân tán',
            ),
            B(
              'Both series are tight enough to compare single runs, because the median is within a few seconds of the mean in each — the useful signal is the mean, and the spread only matters for alerting',
              'Cả hai dãy đều đủ chụm để so từng lần chạy một, vì trung vị chỉ lệch trung bình vài giây ở cả hai — tín hiệu hữu ích là trung bình, còn độ phân tán chỉ quan trọng với việc báo động',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Absolute spread and relative spread rank the two workflows in opposite directions, and the relative one is what governs whether you can see an effect. The consequence is uncomfortable: chapter 5 measured the <code>cache: \'npm\'</code> saving at 12.6 seconds, which on <code>ci-lint</code> is under one standard deviation — so the honest way to confirm it is to time the STEP, not the run. Step timings drop the queueing, the image variation and the inter-job gaps, and they are much quieter. And the 100-second run is not an outlier to discard; it happened with nothing changed, which is exactly the point — "this run was fast, so the fix worked" is the conclusion the data forbids.',
            'Độ phân tán tuyệt đối và độ phân tán tương đối xếp hạng hai workflow theo hai chiều ngược nhau, và cái tương đối mới là thứ quyết định bạn có thấy được một hiệu ứng hay không. Hệ quả thì khó chịu: chương 5 đo khoản tiết kiệm của <code>cache: \'npm\'</code> là 12,6 giây, mà trên <code>ci-lint</code> thì con số ấy chưa tới một độ lệch chuẩn — nên cách trung thực để xác nhận nó là bấm giờ cái BƯỚC chứ không bấm giờ cả lần chạy. Nhịp thời gian theo bước loại được phần xếp hàng, biến thiên ảnh máy và các khoảng giao giữa job, nên nó lặng hơn hẳn. Còn lần chạy 100 giây không phải một ngoại lai để vứt đi; nó xảy ra mà chẳng có gì thay đổi, và đó đúng là trọng tâm — "lần này chạy nhanh, vậy bản vá có tác dụng" là kết luận mà dữ liệu cấm bạn rút ra.',
          ),
        }),

        // q29 · đáp án B (1)
        mcq({
          prompt: B(
            'The release workflow has five jobs: check 72 s (Linux), build Linux 241 s, build macOS 437 s, build Windows 323 s, publish 34 s. Compare two proposals.' + code(
              'de xuat 1: lam ban dung Linux nhanh gap doi (241 -> 120s)\n' +
              'de xuat 2: lam ban dung macOS nhanh hon 20%  (437 -> 350s)',
            ),
            'Workflow phát hành có năm job: kiểm 72 s (Linux), dựng Linux 241 s, dựng macOS 437 s, dựng Windows 323 s, công bố 34 s. So sánh hai đề xuất.' + code(
              'de xuat 1: lam ban dung Linux nhanh gap doi (241 -> 120s)\n' +
              'de xuat 2: lam ban dung macOS nhanh hon 20%  (437 -> 350s)',
            ),
          ),
          options: [
            B(
              'Proposal 1 saves 121 seconds of wall-clock and proposal 2 saves 87, so halving the Linux build is the better change and it is also the easier one to implement',
              'Đề xuất 1 tiết kiệm 121 giây đồng hồ còn đề xuất 2 tiết kiệm 87, nên giảm nửa bản dựng Linux là thay đổi tốt hơn và cũng dễ làm hơn',
            ),
            B(
              'Proposal 1 saves ZERO seconds of wall-clock — Linux is not on the critical path — while proposal 2 saves 87. Which job you optimise matters more than how well you optimise it',
              'Đề xuất 1 tiết kiệm KHÔNG giây đồng hồ nào — Linux không nằm trên đường tới hạn — còn đề xuất 2 tiết kiệm 87. Bạn tối ưu JOB NÀO quan trọng hơn bạn tối ưu GIỎI tới đâu',
            ),
            B(
              'Both save nothing, because the publish job waits for all three legs and the critical path is fixed by the fan-in rather than by any individual leg',
              'Cả hai đều không tiết kiệm gì, vì job công bố đợi cả ba nhánh và đường tới hạn bị cố định bởi chỗ gộp lại chứ không bởi bất kỳ nhánh riêng lẻ nào',
            ),
            B(
              'Proposal 1 saves 121 seconds of machine-time and therefore 121 seconds of wall-clock, because the three legs share one runner pool and time returned to the pool shortens the run',
              'Đề xuất 1 tiết kiệm 121 giây thời gian máy nên cũng tiết kiệm 121 giây đồng hồ, vì ba nhánh dùng chung một hồ runner và thời gian trả lại hồ sẽ rút ngắn lần chạy',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The critical path is 72 + 437 + 34 = 543 seconds, and the Linux leg finishes 3 minutes 17 seconds before macOS does — it has that much slack. Halving it returns 121 machine-seconds and nothing a person can feel. Twenty per cent off macOS comes straight off the path. The irony lesson 7.4 points out is that the Linux job is the one a developer is most likely to have open, so it is the one that feels slow and attracts the attention. The working order is: read the per-job timings FIRST (two API calls), remove <code>needs:</code> edges that are not data dependencies, attack the slowest job ON the path, and only then reach for the cheap one-liners.',
            'Đường tới hạn là 72 + 437 + 34 = 543 giây, và nhánh Linux xong trước macOS 3 phút 17 giây — nó có ngần ấy độ chùng. Giảm một nửa nó trả về 121 máy-giây và không giây nào mà một con người cảm thấy được. Bớt hai mươi phần trăm của macOS thì trừ thẳng vào đường tới hạn. Chỗ trớ trêu mà bài 7.4 chỉ ra là job Linux lại chính là cái lập trình viên nhiều khả năng đang mở nhất, nên nó là cái CẢM GIÁC chậm và hút lấy sự chú ý. Thứ tự làm việc là: đọc nhịp thời gian TỪNG JOB TRƯỚC (hai lời gọi API), gỡ những cạnh <code>needs:</code> không phải phụ thuộc dữ liệu, đánh vào job chậm nhất NẰM TRÊN đường, và chỉ sau đó mới với tay tới mấy dòng lẻ rẻ tiền.',
          ),
        }),

        // q30 · đáp án D (3)
        mcq({
          prompt: B(
            'This repository is public, so its runs bill zero. Modelled as if it were private, over its whole history:' + code(
              'ci-lint          526 lan chay  x    5 phut-tinh-tien  =  2.630 phut\n' +
              'desktop-release   85 lan chay  x  100 phut-tinh-tien  =  8.500 phut\n' +
              '                                              TONG    = 11.130 phut',
            ) + 'Where do the 100 minutes per release run come from, and how should the total be read?',
            'Kho này là công khai nên các lần chạy tính tiền bằng không. Mô hình hoá như thể nó riêng tư, trên trọn lịch sử của nó:' + code(
              'ci-lint          526 lan chay  x    5 phut-tinh-tien  =  2.630 phut\n' +
              'desktop-release   85 lan chay  x  100 phut-tinh-tien  =  8.500 phut\n' +
              '                                              TONG    = 11.130 phut',
            ) + '100 phút mỗi lần chạy phát hành tới từ đâu, và nên đọc con số tổng thế nào?',
          ),
          options: [
            B(
              'The 100 minutes is the wall-clock duration of the run rounded up, and the total can be compared directly against a monthly included-minutes allowance to see whether the repository would fit',
              '100 phút là thời lượng đồng hồ của lần chạy làm tròn lên, và con số tổng so trực tiếp được với hạn mức phút hằng tháng để xem kho này có vừa không',
            ),
            B(
              'It is the sum of the five jobs in machine-minutes, 1,107 seconds rounded to 19 minutes and then multiplied by the number of platforms in the matrix',
              'Nó là tổng của năm job tính theo máy-phút, 1.107 giây làm tròn thành 19 phút rồi nhân với số nền tảng trong ma trận',
            ),
            B(
              'The macOS multiplier applies to the whole run rather than to one job, so the 555-second run becomes 10 minutes at 10× — the other jobs are already counted inside it',
              'Hệ số macOS áp cho cả lần chạy chứ không cho một job, nên lần chạy 555 giây thành 10 phút ở mức 10× — các job khác đã được tính bên trong đó rồi',
            ),
            B(
              'Each JOB is rounded up to the minute and multiplied by its platform factor — the 437-second macOS job becomes 8 minutes at 10× = 80, and everything else adds 20 — and the total spans the repository\'s whole history rather than a month, so it is a SHAPE (one workflow carrying 76% of the bill), not a bill',
              'MỖI JOB được làm tròn lên phút rồi nhân hệ số nền tảng của nó — job macOS 437 giây thành 8 phút ở mức 10× = 80, và mọi thứ còn lại cộng thêm 20 — và con số tổng trải TRỌN lịch sử kho chứ không phải một tháng, nên nó là một HÌNH DẠNG (một workflow gánh 76% hoá đơn), không phải một hoá đơn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Two mechanics do all the work here: rounding is per JOB, and the multiplier is per platform (Linux 1×, Windows 2×, macOS 10×). So a macOS job that runs 437 seconds bills 8 minutes at 10× = 80, while check, Linux, Windows and publish together add 20. The consequence to carry is that a SHORT macOS job is disproportionately expensive — a 30-second macOS step still bills a whole minute at 10× — which makes lifting platform-independent work out of a matrix the largest cost lever available. And read the total honestly: lesson 7.5 says outright that it is an estimate spanning the repository\'s whole history, so it does not compare with a monthly allowance. What survives is the shape.',
            'Hai cơ chế làm hết việc ở đây: phép làm tròn là theo TỪNG JOB, và hệ số là theo nền tảng (Linux 1×, Windows 2×, macOS 10×). Nên một job macOS chạy 437 giây tính 8 phút ở mức 10× = 80, còn kiểm, Linux, Windows và công bố cộng lại thêm 20. Hệ quả cần mang theo là một job macOS NGẮN thì đắt không cân xứng — một bước macOS 30 giây vẫn tính trọn một phút ở mức 10× — điều đó khiến việc nhấc phần việc không phụ thuộc nền tảng ra khỏi một ma trận trở thành đòn bẩy chi phí lớn nhất sẵn có. Và hãy đọc con số tổng cho trung thực: bài 7.5 nói thẳng rằng đó là một ƯỚC LƯỢNG trải trọn lịch sử của kho, nên nó không so được với một hạn mức hằng tháng. Thứ sống sót là cái HÌNH DẠNG.',
          ),
        }),

        /* ── 2 câu lập trình ───────────────────────────────────────────── */

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Replay the cache rules (chapter 5).</b> <code>actions/cache</code> has four behaviours that decide every hit and every miss. Implement <code>motLuot(kho, luot, dongHo)</code>, which plays ONE run against a store of cache entries and returns what the log would say.</p>' +
            '<p>The store is an array of <code>{ khoa, nhanh, tao }</code>: the key, the branch that wrote it, and a creation clock (larger is newer). A run is <code>{ nhanh, key, rk }</code> — the branch, the primary key, and the <code>restore-keys</code> list <b>in order</b>. Your function must MUTATE the store when the run saves.</p>' +
            '<ol>' +
            '<li><b>Visibility.</b> The run may only see entries written by its own branch or by <code>main</code>, the default branch. Two feature branches never see each other.</li>' +
            '<li><b>Exact hit.</b> If a visible entry has exactly this key, restore it, report <code>cache-hit=true</code>, and <b>save nothing</b> — an entry is immutable, so a hit never rewrites it.</li>' +
            '<li><b>Restore-keys.</b> Otherwise walk <code>rk</code> in order. For each prefix, take the visible entries whose key STARTS WITH it; if any exist, restore the one with the LARGEST <code>tao</code> and stop walking. Report <code>cache-hit=false</code> either way.</li>' +
            '<li><b>Save.</b> Any run that did not hit the exact key appends <code>{ khoa: key, nhanh, tao: dongHo }</code> to the store — including a run that only hit a restore key. That is how a cache rolls forward.</li>' +
            '</ol>' +
            '<p>Return <code>{ khoiPhuc, hit, luu }</code>: the key restored or <code>null</code>, the boolean, and the key saved or <code>null</code>. Watch run 5 — it is a macOS job that restores a Linux cache, which is what a key without <code>runner.os</code> in it does. Keep the given data and the printing loop exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 31 — Phát lại luật của cache (chương 5).</b> <code>actions/cache</code> có bốn hành vi quyết định mọi cú trúng và mọi cú trượt. Hãy cài đặt <code>motLuot(kho, luot, dongHo)</code>: phát MỘT lượt chạy trên một kho các mục cache và trả về đúng thứ log sẽ nói.</p>' +
            '<p>Kho là một mảng <code>{ khoa, nhanh, tao }</code>: khoá, nhánh đã ghi nó, và một đồng hồ tạo (lớn hơn là mới hơn). Một lượt chạy là <code>{ nhanh, key, rk }</code> — nhánh, khoá chính, và danh sách <code>restore-keys</code> <b>theo thứ tự</b>. Hàm của bạn phải LÀM THAY ĐỔI kho khi lượt chạy có lưu.</p>' +
            '<ol>' +
            '<li><b>Tầm nhìn.</b> Lượt chạy chỉ thấy được những mục do chính nhánh của nó ghi hoặc do <code>main</code> — nhánh mặc định — ghi. Hai nhánh tính năng không bao giờ thấy nhau.</li>' +
            '<li><b>Trúng chính xác.</b> Nếu một mục nhìn thấy được có ĐÚNG khoá này thì khôi phục nó, báo <code>cache-hit=true</code>, và <b>KHÔNG lưu gì</b> — một mục là bất biến, nên một cú trúng không bao giờ ghi lại nó.</li>' +
            '<li><b>Restore-keys.</b> Ngược lại thì duyệt <code>rk</code> theo thứ tự. Với mỗi tiền tố, lấy những mục nhìn thấy được có khoá BẮT ĐẦU BẰNG nó; nếu có thì khôi phục cái có <code>tao</code> LỚN NHẤT rồi dừng duyệt. Dù thế nào cũng báo <code>cache-hit=false</code>.</li>' +
            '<li><b>Lưu.</b> Mọi lượt chạy KHÔNG trúng khoá chính đều nối <code>{ khoa: key, nhanh, tao: dongHo }</code> vào kho — kể cả lượt chỉ trúng một restore key. Đó là cách một cái cache tự lăn về phía trước.</li>' +
            '</ol>' +
            '<p>Trả về <code>{ khoiPhuc, hit, luu }</code>: khoá đã khôi phục hoặc <code>null</code>, giá trị boolean, và khoá đã lưu hoặc <code>null</code>. Để ý lượt 5 — đó là một job macOS khôi phục một cache Linux, đúng thứ xảy ra khi khoá không có <code>runner.os</code> trong đó. Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const LUOT = [\n' +
            "  { nhanh: 'main',      key: 'npm-Linux-aaa', rk: ['npm-Linux-', 'npm-'] },\n" +
            "  { nhanh: 'main',      key: 'npm-Linux-aaa', rk: ['npm-Linux-', 'npm-'] },\n" +
            "  { nhanh: 'main',      key: 'npm-Linux-bbb', rk: ['npm-Linux-', 'npm-'] },\n" +
            "  { nhanh: 'main',      key: 'npm-Linux-ccc', rk: ['npm-Linux-'] },\n" +
            "  { nhanh: 'main',      key: 'npm-macOS-xxx', rk: ['npm-macOS-', 'npm-'] },\n" +
            "  { nhanh: 'feature/a', key: 'npm-Linux-ddd', rk: ['npm-Linux-'] },\n" +
            "  { nhanh: 'feature/b', key: 'npm-Linux-eee', rk: ['npm-Linux-'] },\n" +
            "  { nhanh: 'main',      key: 'npm-Linux-aaa', rk: ['npm-Linux-'] },\n" +
            "  { nhanh: 'main',      key: 'npm-Linux-zzz', rk: [] },\n" +
            "  { nhanh: 'feature/a', key: 'npm-Linux-ccc', rk: ['npm-Linux-'] },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function motLuot(kho, luot, dongHo) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const kho = [];\n' +
            'LUOT.forEach((l, i) => {\n' +
            '  const r = motLuot(kho, l, i + 1);\n' +
            "  console.log(String(i + 1).padStart(2) + '. ' + l.nhanh.padEnd(10) + l.key.padEnd(15)\n" +
            "    + ' khoiPhuc=' + String(r.khoiPhuc ?? '-').padEnd(15)\n" +
            "    + ' cache-hit=' + String(r.hit).padEnd(6) + ' luu=' + (r.luu ?? '-'));\n" +
            '});\n' +
            "console.log('kho cuoi: ' + kho.map((e) => e.khoa + '@' + e.nhanh).join(', '));\n",
          expectedOutput:
            ' 1. main      npm-Linux-aaa   khoiPhuc=-               cache-hit=false  luu=npm-Linux-aaa\n' +
            ' 2. main      npm-Linux-aaa   khoiPhuc=npm-Linux-aaa   cache-hit=true   luu=-\n' +
            ' 3. main      npm-Linux-bbb   khoiPhuc=npm-Linux-aaa   cache-hit=false  luu=npm-Linux-bbb\n' +
            ' 4. main      npm-Linux-ccc   khoiPhuc=npm-Linux-bbb   cache-hit=false  luu=npm-Linux-ccc\n' +
            ' 5. main      npm-macOS-xxx   khoiPhuc=npm-Linux-ccc   cache-hit=false  luu=npm-macOS-xxx\n' +
            ' 6. feature/a npm-Linux-ddd   khoiPhuc=npm-Linux-ccc   cache-hit=false  luu=npm-Linux-ddd\n' +
            ' 7. feature/b npm-Linux-eee   khoiPhuc=npm-Linux-ccc   cache-hit=false  luu=npm-Linux-eee\n' +
            ' 8. main      npm-Linux-aaa   khoiPhuc=npm-Linux-aaa   cache-hit=true   luu=-\n' +
            ' 9. main      npm-Linux-zzz   khoiPhuc=-               cache-hit=false  luu=npm-Linux-zzz\n' +
            '10. feature/a npm-Linux-ccc   khoiPhuc=npm-Linux-ccc   cache-hit=true   luu=-\n' +
            'kho cuoi: npm-Linux-aaa@main, npm-Linux-bbb@main, npm-Linux-ccc@main, npm-macOS-xxx@main, npm-Linux-ddd@feature/a, npm-Linux-eee@feature/b, npm-Linux-zzz@main',
          sampleSolution:
            'function motLuot(kho, luot, dongHo) {\n' +
            '  // 1. Tầm nhìn: nhánh của chính mình, cộng nhánh mặc định.\n' +
            "  const thay = kho.filter((e) => e.nhanh === luot.nhanh || e.nhanh === 'main');\n\n" +
            '  // 2. Khớp CHÍNH XÁC — trúng thì KHÔNG lưu, vì một mục cache là bất biến.\n' +
            '  const dung = thay.find((e) => e.khoa === luot.key);\n' +
            '  if (dung) return { khoiPhuc: luot.key, hit: true, luu: null };\n\n' +
            '  // 3. restore-keys: duyệt THEO THỨ TỰ, mỗi tiền tố lấy mục MỚI NHẤT.\n' +
            '  let khoiPhuc = null;\n' +
            '  for (const tien of luot.rk) {\n' +
            '    const ung = thay.filter((e) => e.khoa.startsWith(tien));\n' +
            '    if (!ung.length) continue;\n' +
            '    khoiPhuc = ung.reduce((a, b) => (b.tao > a.tao ? b : a)).khoa;\n' +
            '    break;\n' +
            '  }\n\n' +
            '  // 4. Trượt khoá chính ⇒ VẪN LƯU, kể cả khi đã trúng một restore key.\n' +
            '  kho.push({ khoa: luot.key, nhanh: luot.nhanh, tao: dongHo });\n' +
            '  return { khoiPhuc, hit: false, luu: luot.key };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Read a <code>needs:</code> graph the way GitHub does (chapter 7).</b> Given a list of jobs as plain data, work out what runs when, what the run costs, and what happens when something fails. Implement three functions.</p>' +
            '<p>A job is <code>{ ten, needs: [...], giay }</code>.</p>' +
            '<ul>' +
            '<li><code>tang(jobs)</code> — the waves. Repeatedly take every remaining job whose dependencies have all finished, sorted alphabetically, and emit that group. Return <code>{ tang: [[...], ...] }</code>. If a round produces no ready job while jobs remain, the graph has a CYCLE: return <code>{ loi: \'chu trinh\', con: [names of the jobs still stuck, sorted] }</code> instead.</li>' +
            '<li><code>duongToiHan(jobs)</code> — the longest chain by duration. Return <code>{ giay, duong: [names in order] }</code>. Walk dependencies in alphabetical order and keep a strictly LONGER path, so ties resolve to the first one found.</li>' +
            '<li><code>ketQua(jobs, hong)</code> — a <code>Map</code> from job name to <code>\'success\'</code>, <code>\'failure\'</code> or <code>\'skipped\'</code>. <code>hong</code> lists the jobs that fail on their own. Process the waves in order: a job named in <code>hong</code> is <code>failure</code>; otherwise a job with ANY dependency that is not <code>success</code> is <code>skipped</code> — the skip propagates down the chain — and everything else is <code>success</code>.</li>' +
            '</ul>' +
            '<p>Compare the last two graphs: same five hundred and forty machine-seconds, two different critical paths. Keep the given data and the printing loop exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 32 — Đọc một đồ thị <code>needs:</code> theo đúng cách GitHub đọc (chương 7).</b> Cho một danh sách job dưới dạng dữ liệu thuần, hãy tính xem cái gì chạy lúc nào, lần chạy tốn gì, và chuyện gì xảy ra khi có thứ hỏng. Cài đặt ba hàm.</p>' +
            '<p>Một job là <code>{ ten, needs: [...], giay }</code>.</p>' +
            '<ul>' +
            '<li><code>tang(jobs)</code> — các TẦNG. Lặp đi lặp lại: lấy mọi job còn lại mà các phụ thuộc đều đã xong, sắp theo bảng chữ cái, rồi phát ra nhóm ấy. Trả về <code>{ tang: [[...], ...] }</code>. Nếu một vòng không sinh ra job nào sẵn sàng trong khi vẫn còn job, thì đồ thị có CHU TRÌNH: trả về <code>{ loi: \'chu trinh\', con: [tên các job còn kẹt, đã sắp] }</code> thay vào đó.</li>' +
            '<li><code>duongToiHan(jobs)</code> — chuỗi dài nhất tính theo thời lượng. Trả về <code>{ giay, duong: [tên theo thứ tự] }</code>. Duyệt phụ thuộc theo thứ tự bảng chữ cái và chỉ giữ đường DÀI HƠN thực sự, nên khi hoà thì lấy cái tìm thấy trước.</li>' +
            '<li><code>ketQua(jobs, hong)</code> — một <code>Map</code> từ tên job sang <code>\'success\'</code>, <code>\'failure\'</code> hoặc <code>\'skipped\'</code>. <code>hong</code> liệt kê những job tự nó hỏng. Xử lý các tầng theo thứ tự: một job có tên trong <code>hong</code> là <code>failure</code>; ngược lại một job có BẤT KỲ phụ thuộc nào không phải <code>success</code> thì là <code>skipped</code> — việc bỏ qua LAN TRUYỀN xuống cả chuỗi — còn lại là <code>success</code>.</li>' +
            '</ul>' +
            '<p>Hãy so hai đồ thị cuối: cùng năm trăm bốn mươi máy-giây, hai đường tới hạn khác nhau. Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const DO_THI = {\n' +
            "  'noi-tiep': [\n" +
            "    { ten: 'lint',   needs: [],                    giay: 40 },\n" +
            "    { ten: 'build',  needs: ['lint'],              giay: 300 },\n" +
            "    { ten: 'test',   needs: ['build'],             giay: 200 },\n" +
            "    { ten: 'deploy', needs: ['test'],              giay: 60 },\n" +
            '  ],\n' +
            "  'quat-ra-quat-vao': [\n" +
            "    { ten: 'setup',  needs: [],                    giay: 30 },\n" +
            "    { ten: 'lint',   needs: ['setup'],             giay: 40 },\n" +
            "    { ten: 'unit',   needs: ['setup'],             giay: 250 },\n" +
            "    { ten: 'e2e',    needs: ['setup'],             giay: 180 },\n" +
            "    { ten: 'deploy', needs: ['lint','unit','e2e'], giay: 60 },\n" +
            '  ],\n' +
            "  'lint-tren-duong': [\n" +
            "    { ten: 'lint',   needs: [],                    giay: 40 },\n" +
            "    { ten: 'build',  needs: ['lint'],              giay: 300 },\n" +
            "    { ten: 'test',   needs: ['build'],             giay: 200 },\n" +
            '  ],\n' +
            "  'lint-song-song': [\n" +
            "    { ten: 'lint',   needs: [],                    giay: 40 },\n" +
            "    { ten: 'build',  needs: [],                    giay: 300 },\n" +
            "    { ten: 'test',   needs: ['build'],             giay: 200 },\n" +
            '  ],\n' +
            "  'chu-trinh': [\n" +
            "    { ten: 'a',       needs: ['c'],                giay: 10 },\n" +
            "    { ten: 'b',       needs: ['a'],                giay: 10 },\n" +
            "    { ten: 'c',       needs: ['b'],                giay: 10 },\n" +
            "    { ten: 'doc-lap', needs: [],                   giay: 10 },\n" +
            '  ],\n' +
            '};\n' +
            "const HONG = { 'noi-tiep': ['build'], 'quat-ra-quat-vao': ['unit'],\n" +
            "               'lint-tren-duong': [], 'lint-song-song': ['lint'] };\n\n" +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function tang(jobs) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function duongToiHan(jobs) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function ketQua(jobs, hong) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const [ten, jobs] of Object.entries(DO_THI)) {\n' +
            '  const t = tang(jobs);\n' +
            "  if (t.loi) { console.log(ten + ' -> LOI ' + t.loi + ': ' + t.con.join(',')); continue; }\n" +
            '  const d = duongToiHan(jobs);\n' +
            '  const tong = jobs.reduce((s, j) => s + j.giay, 0);\n' +
            "  console.log(ten + ' -> tang=[' + t.tang.map((l) => l.join('+')).join('] [') + ']');\n" +
            "  console.log('    duong toi han = ' + d.giay + 's (' + d.duong.join(' -> ')\n" +
            "    + ')  tong may-giay = ' + tong + 's');\n" +
            '  const r = ketQua(jobs, HONG[ten]);\n' +
            "  console.log('    hong=[' + HONG[ten].join(',') + '] -> '\n" +
            "    + [...r].map(([k, v]) => k + ':' + v).join(' '));\n" +
            '}\n',
          expectedOutput:
            'noi-tiep -> tang=[lint] [build] [test] [deploy]\n' +
            '    duong toi han = 600s (lint -> build -> test -> deploy)  tong may-giay = 600s\n' +
            '    hong=[build] -> lint:success build:failure test:skipped deploy:skipped\n' +
            'quat-ra-quat-vao -> tang=[setup] [e2e+lint+unit] [deploy]\n' +
            '    duong toi han = 340s (setup -> unit -> deploy)  tong may-giay = 560s\n' +
            '    hong=[unit] -> setup:success e2e:success lint:success unit:failure deploy:skipped\n' +
            'lint-tren-duong -> tang=[lint] [build] [test]\n' +
            '    duong toi han = 540s (lint -> build -> test)  tong may-giay = 540s\n' +
            '    hong=[] -> lint:success build:success test:success\n' +
            'lint-song-song -> tang=[build+lint] [test]\n' +
            '    duong toi han = 500s (build -> test)  tong may-giay = 540s\n' +
            '    hong=[lint] -> build:success lint:failure test:success\n' +
            'chu-trinh -> LOI chu trinh: a,b,c',
          sampleSolution:
            'function tang(jobs) {\n' +
            '  const conLai = new Map(jobs.map((j) => [j.ten, j]));\n' +
            '  const xong = new Set();\n' +
            '  const ra = [];\n' +
            '  while (conLai.size) {\n' +
            '    const lop = [...conLai.values()]\n' +
            '      .filter((j) => j.needs.every((n) => xong.has(n)))\n' +
            '      .map((j) => j.ten).sort();\n' +
            '    // Không job nào sẵn sàng mà vẫn còn job ⇒ những cái còn lại kẹt trong một chu trình.\n' +
            "    if (!lop.length) return { loi: 'chu trinh', con: [...conLai.keys()].sort() };\n" +
            '    for (const t of lop) { xong.add(t); conLai.delete(t); }\n' +
            '    ra.push(lop);\n' +
            '  }\n' +
            '  return { tang: ra };\n' +
            '}\n\n' +
            'function duongToiHan(jobs) {\n' +
            '  const by = new Map(jobs.map((j) => [j.ten, j]));\n' +
            '  const nho = new Map();\n' +
            '  const di = (ten) => {\n' +
            '    if (nho.has(ten)) return nho.get(ten);\n' +
            '    const j = by.get(ten);\n' +
            '    let tot = { giay: 0, duong: [] };\n' +
            '    for (const n of [...j.needs].sort()) {\n' +
            '      const r = di(n);\n' +
            '      if (r.giay > tot.giay) tot = r;\n' +
            '    }\n' +
            '    const kq = { giay: tot.giay + j.giay, duong: [...tot.duong, ten] };\n' +
            '    nho.set(ten, kq);\n' +
            '    return kq;\n' +
            '  };\n' +
            '  let tot = { giay: 0, duong: [] };\n' +
            '  for (const j of [...jobs].sort((a, b) => (a.ten < b.ten ? -1 : 1))) {\n' +
            '    const r = di(j.ten);\n' +
            '    if (r.giay > tot.giay) tot = r;\n' +
            '  }\n' +
            '  return tot;\n' +
            '}\n\n' +
            'function ketQua(jobs, hong) {\n' +
            '  const by = new Map(jobs.map((j) => [j.ten, j]));\n' +
            '  const kq = new Map();\n' +
            '  const lop = tang(jobs).tang ?? [];\n' +
            '  for (const l of lop) for (const t of l) {\n' +
            "    if (hong.includes(t)) { kq.set(t, 'failure'); continue; }\n" +
            '    // Một phụ thuộc HỎNG hay BỊ BỎ QUA đều làm job này bị bỏ qua — việc bỏ qua lan truyền.\n' +
            "    const chaTruot = by.get(t).needs.some((n) => kq.get(n) !== 'success');\n" +
            "    kq.set(t, chaTruot ? 'skipped' : 'success');\n" +
            '  }\n' +
            '  return kq;\n' +
            '}\n',
        }),
      ],
    },
  ],
};
