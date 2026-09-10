/**
 * Tailwind CSS — Progress Test 3 (Chương 8 → Chương 11).
 *
 * Đề tự soạn, bám sát `content/courses/tailwind-css/s08-kich-thuoc.mjs`,
 * `s09-tiep-can.mjs`, `s10-chan-doan.mjs`, `s11-on-thi.mjs`.
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ PHIÊN BẢN: **Tailwind CSS 3.4.14 — v3, KHÔNG phải v4.**
 * ────────────────────────────────────────────────────────────────────────────
 * `frontend/package.json:108` ghi `"tailwindcss": "^3.4.14"`; hộp cát đo đề này
 * cài đúng `tailwindcss@3.4.14` và in ra `3.4.14`. Ba chương cuối bàn về ĐO
 * ĐẠC, nên chỗ nào cũng cần nói rõ số ấy đo trên bản nào: `@layer` bị XOÁ khỏi
 * đầu ra (v4 thì không), dấu quan trọng là TIỀN TỐ `!mt-4` (v4 là hậu tố
 * `mt-4!`), và bổ từ độ mờ trên màu biến cần `<alpha-value>` (v4 dùng
 * `color-mix()`).
 *
 * ⚠️ SỐ ĐO. Hộp cát NGOÀI kho api-backend (`scratchpad/tailwind-pt/lab`);
 * không gói nào thêm vào `package.json` của kho. Những thứ đã CHẠY THẬT:
 *   • lớp CHẾT, dựng thật rồi grep đầu ra — `w-4.5` · `h-4.5` · `w-5.5` ·
 *     `border-white/12` · `duration-3000` · `prose-invert` · `prose` ·
 *     `scrollbar-hide` · `opacity-12` · `bg-black/12` đều sinh **0 quy tắc**;
 *     còn `w-[18px]` · `border-white/10` · `border-white/[12%]` ·
 *     `duration-1000` · `py-0.5` · `text-[10px]` thì sinh đúng;
 *   • thang thật đọc từ `resolveConfig`: `opacity` chạy theo bước 5
 *     (0,5,10,…,100) nên **không có 12**; `transitionDuration` chỉ tới
 *     **1000**; `spacing` có 0.5/1.5/2.5/3.5 nhưng **không có 4.5**;
 *   • selector bóng tuỳ ý thoát dấu phẩy bằng `\2c ` (sáu ký tự kèm một dấu
 *     cách): `.shadow-\[0_24px_80px_rgba\(0\2c 0\2c 0\2c 0\.65\)\]`;
 *   • `hocus:p-4` sinh 0 quy tắc khi không có plugin `addVariant`;
 *   • `@tailwind base` một mình: **555 dòng, 41 quy tắc**;
 *   • glob trỏ sai: đầu ra chỉ còn Preflight, **0 quy tắc bắt đầu bằng `.`**;
 *   • nén (gzip mức 9, đo hôm nay): đầu ra Tailwind của hộp cát
 *     **143.575 → 15.997 byte = 8,98:1**; `frontend/src/app/globals.css` viết
 *     tay **233.649 → 60.162 byte = 3,88:1**. Tỉ số hơn nhau **2,31 lần**;
 *   • `globals.css` hôm nay: 5.974 dòng · **0 lần `@apply`** · 44 lần
 *     `!important` · 13 khối `prefers-reduced-motion` · 219 biến `--`;
 *   • tương phản WCAG tính lại trên đúng token của kho: 12 tổ hợp, **3 trượt
 *     AA-thường và cả 3 đều là `--text-muted`** — light/card 3,33 ·
 *     light/surface 2,97 · dark/surface 3,95; sự cố 1,16 tái hiện đúng
 *     (`#050505` trên `#18191a`);
 *   • xám trung tính sát ngưỡng 4,5: **#6e6e6e** trên `#f0f2f5`,
 *     **#767676** trên `#ffffff`, **#979797** trên `#303031`.
 *
 * ⚠️ **KHÔNG câu nào lấy thời gian dựng hay kích thước gói làm ĐÁP ÁN.** Máy
 * này đang chạy nhiều tiến trình song song; một phép đo thời gian không tái
 * hiện được qua ba lượt thì chỉ dùng để hỏi CƠ CHẾ (xem câu 2), không dùng làm
 * con số phải nhớ.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BỐN CHỖ GIÁO TRÌNH LỆCH VỚI MÁY HÔM NAY (10/09/2026) — ĐỀ THEO MÁY
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. **Bài 9.1 nói thay `--text-muted` bằng `#6e6e6e` thì "nó ăn 5,4 trên nền
 *    trắng".** Tính lại bằng đúng công thức WCAG: **5,10**, không phải 5,4.
 *    Kết luận của bài vẫn đứng (một giá trị phủ được cả hai chỗ đặt), chỉ con
 *    số là sai. Câu 10 dùng 5,10.
 *
 * 2. **Bài 8.2 báo `globals.css` là 166.234 byte thô / tỉ số 3,68:1.** Cân lại
 *    hôm nay: **233.649 byte / 3,88:1**. File đã lớn thêm 40% kể từ lúc soạn
 *    giáo trình (5.974 dòng, 219 biến, 44 `!important`, 13 khối
 *    `prefers-reduced-motion` — bài 6.3 ghi 197 biến, bài 3.5 ghi 38
 *    `!important`, bài 9.5 ghi 9 khối). Nên đề KHÔNG hỏi con số tuyệt đối
 *    nào của kho; câu 4 hỏi cái vẫn đúng khi đo lại — TỈ SỐ nén của CSS tiện
 *    ích cao hơn hẳn CSS viết tay (8,98:1 so với 3,88:1, hơn 2,31 lần).
 *
 * 3. **Bài 9.3 nói kho có "bốn file CSS viết tay".** Chỉ đúng ở thời điểm ấy;
 *    đề không dựa vào con số đó. Cái vẫn đúng và đã kiểm lại: `--bg-elevated`
 *    **vẫn KHÔNG được khai ở đâu cả** (`grep -c 'bg-elevated'` trả 0 trên cả
 *    `globals.css` lẫn `tailwind.config.ts`), nên nhóm B của bài 9.3 vẫn là
 *    một khiếm khuyết sống. Câu 15 ra đề trên chỗ đã kiểm lại.
 *
 * 4. **Bài 9.1 nói `--text-muted` là token chữ duy nhất giữ một mã hex ở cả
 *    hai theme.** Kiểm lại hôm nay: vẫn đúng — `--text-muted: #8a8d91` ở cả
 *    `:root` (dòng 23) lẫn `html.theme-dark` (dòng 93), trong khi
 *    `--text-primary` và `--text-secondary` đều lật. Khiếm khuyết CHƯA được
 *    vá. Đề ra theo trạng thái hôm nay chứ không giả định nó đã xong.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh dưới):  { '0': 7, '1': 8, '2': 8, '3': 7 }
 *   node -e "import('./content/exams/TAILWIND-CSS-PT3.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Số câu theo chương: Chương 8 → 8 · Chương 9 → 9 · Chương 10 → 8 · Chương 11 → 5.
 *
 * Kiểm: node scripts/exam-check.mjs content/exams/TAILWIND-CSS-PT3.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/TAILWIND-CSS-PT3.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/tailwind-exam-kit.mjs';

export default {
  course: { slug: 'tailwind-css' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 8 to 11 (size, accessibility, diagnosis, what survived measurement)',
        'Kiểm tra tiến độ 3 — Chương 8 đến 11 (kích thước, khả năng tiếp cận, chẩn đoán, điều gì sống sót qua phép đo)',
      ),
      description: B(
        'The last third of the Tailwind CSS course, and the part that is entirely about measuring rather than believing: what the stylesheet actually weighs and where the bytes sit, what the palette scores against WCAG, a four-question tree for "my class does not apply", and the three-column table separating Tailwind laws from this repository\'s numbers from intuitions that lost. 30 multiple-choice questions plus 2 coding questions, every figure re-measured on Tailwind CLI 3.4.14.',
        'Một phần ba cuối của khoá Tailwind CSS, và là phần hoàn toàn nói về ĐO thay vì TIN: bảng kiểu thật sự nặng bao nhiêu và byte nằm ở đâu, bảng màu ăn bao nhiêu điểm so với WCAG, cây bốn câu hỏi cho "lớp của tôi không có tác dụng", và bảng ba cột tách bạch luật của Tailwind với số đo của riêng kho này với những trực giác đã thua. 30 câu trắc nghiệm và 2 câu lập trình, mọi con số đều đo lại trên Tailwind CLI 3.4.14.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '8–11'),
      questions: [
        // ── Chương 8 — Kích thước ───────────────────────────────────────
        mcq({
          prompt: B(
            'A build reports 371,550 bytes of CSS and 3,664 rules. Section 0 had separately counted 3,683 distinct utility classes by grepping the source text. Why is the agreement between those two numbers worth more than either of them?',
            'Một bản dựng báo 371.550 byte CSS và 3.664 quy tắc. Mục 0 thì đã đếm riêng được 3.683 lớp tiện ích khác nhau bằng cách grep văn bản nguồn. Vì sao việc HAI con số ấy khớp nhau lại đáng giá hơn từng con số một?',
          ),
          options: [
            B(
              'It proves the minifier is not dropping rules, which is the failure mode a byte count cannot detect and a rule count can',
              'Nó chứng minh bộ rút gọn không làm rơi quy tắc nào, thứ mà một phép đếm byte không phát hiện được còn phép đếm quy tắc thì có',
            ),
            B(
              'Two completely different methods — reading source text, and reading generated CSS — agree to within 0.5%, which is the strongest available confirmation that the generator model is accurate',
              'Hai phương pháp HOÀN TOÀN khác nhau — đọc văn bản nguồn, và đọc CSS phát sinh — khớp nhau trong 0,5%, và đó là bằng chứng mạnh nhất có được rằng mô hình về trình sinh là đúng',
            ),
            B(
              'Rule count is what browsers spend time parsing, so it is the number that predicts rendering performance while bytes only predict transfer time',
              'Số quy tắc là thứ trình duyệt tốn thời gian phân tích, nên nó mới là con số dự đoán hiệu năng dựng hình, còn byte chỉ dự đoán thời gian truyền',
            ),
            B(
              'Tailwind guarantees exactly one rule per class in the config, so any disagreement would mean the config and the source had drifted apart',
              'Tailwind bảo đảm mỗi lớp trong config cho đúng một quy tắc, nên hễ hai con số lệch nhau là config với mã nguồn đã trôi khỏi nhau',
            ),
          ],
          correct: 1,
          explanation: EX(
            'One measurement is a claim; two independent measurements that agree is evidence. The source count came from grepping <code>className</code> attributes and de-duplicating tokens; the rule count came from parsing the generated stylesheet. Nothing links them except the generator itself, so agreeing to within 0.5% is a direct check on "Tailwind emits exactly the utilities it found in your source" — the sentence the whole course rests on. The other options each assert something false: the third guarantee does not exist (a class can emit several rules — variants, or a utility setting multiple declarations — and a class in the config emits nothing at all unless it is used), and rule count is a poor predictor of parse cost compared with total bytes. When you re-run this on your own repo, the two numbers agreeing is what tells you the measurement is trustworthy before you start drawing conclusions from it.',
            'Một phép đo là một lời tuyên bố; HAI phép đo độc lập mà khớp nhau mới là bằng chứng. Con số từ nguồn lấy bằng cách grep thuộc tính <code>className</code> rồi khử trùng; con số quy tắc lấy bằng cách đọc bảng kiểu đã phát sinh. Chẳng có gì nối hai bên lại ngoài chính trình sinh, nên khớp nhau trong 0,5% là một phép kiểm trực tiếp cho câu "Tailwind phát sinh đúng những tiện ích nó tìm thấy trong mã nguồn của bạn" — cái câu mà cả khoá học dựa vào. Các phương án còn lại đều khẳng định một điều sai: cái bảo đảm ở phương án bốn không tồn tại (một lớp có thể sinh ra nhiều quy tắc — biến thể, hoặc một tiện ích đặt nhiều khai báo — còn một lớp nằm trong config mà không ai dùng thì chẳng sinh gì cả), và số quy tắc dự đoán chi phí phân tích kém hơn hẳn tổng số byte. Khi bạn chạy lại phép này trên kho của mình, việc hai con số khớp nhau chính là thứ cho biết phép đo đáng tin trước khi bạn bắt đầu rút ra kết luận từ nó.',
          ),
        }),

        mcq({
          prompt: B(
            'A build is timed once at 8,437 ms. Re-run three times it gives 5,415 ms, 5,257 ms and 5,205 ms. What is the right handling, and what does the gap represent?',
            'Một bản dựng đo một lần được 8.437 ms. Chạy lại ba lượt thì ra 5.415 ms, 5.257 ms và 5.205 ms. Xử lý đúng là gì, và khoảng chênh ấy đại diện cho cái gì?',
          ),
          options: [
            B(
              'Report the first run: a cold start is what a CI machine experiences, so 8,437 ms is the honest production figure and the warm runs are optimistic',
              'Báo lượt đầu: khởi động nguội là thứ một máy CI gặp phải, nên 8.437 ms mới là con số production trung thực còn các lượt ấm thì lạc quan',
            ),
            B(
              'Report the mean of all four, since discarding a measurement because it is inconvenient is how a benchmark becomes marketing',
              'Báo trung bình của cả bốn, vì loại một phép đo chỉ vì nó bất tiện là cách một phép đo hiệu năng biến thành quảng cáo',
            ),
            B(
              'Report the range and note that a single timing is unreliable — the first run carried process startup and a cold filesystem cache, so the useful figure is the steady state across several runs',
              'Báo khoảng giá trị và ghi rõ rằng một phép đo thời gian đơn lẻ là không đáng tin — lượt đầu gánh cả việc khởi động tiến trình và bộ đệm hệ thống file còn nguội, nên con số hữu ích là trạng thái ổn định qua vài lượt',
            ),
            B(
              'Discard the timing entirely: build duration is not a property of Tailwind, so it should never appear in a measurement at all',
              'Bỏ hẳn phép đo thời gian: thời lượng dựng không phải thuộc tính của Tailwind nên nó không bao giờ nên xuất hiện trong một phép đo nào',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The 3.2-second gap is startup plus a cold filesystem cache, and it is not a property of the build — it is a property of that particular first run. Averaging it in buries a known artefact inside a number that then looks precise; quoting it alone overstates the cost by 60%. Report the steady state and say how many runs it came from. This is the same discipline as re-running a flaky CI job before believing it, and it matters most on a shared machine where other processes are competing for the same disk and cores. Note also what the steady state itself teaches: scanning is 97% of the work — the same build with globs that match nothing finishes in 147 ms — so if a build is ever genuinely too slow, the lever is narrower globs, not fewer utilities.',
            'Khoảng chênh 3,2 giây là phần khởi động cộng bộ đệm hệ thống file còn nguội, và nó không phải thuộc tính của bản dựng — nó là thuộc tính của riêng lượt chạy đầu tiên ấy. Lấy trung bình là chôn một hiện vật đã biết vào trong một con số rồi trông có vẻ chính xác; trích riêng nó là thổi phồng chi phí lên 60%. Hãy báo trạng thái ổn định và nói rõ nó đến từ mấy lượt. Vẫn là kỷ luật chạy lại một job CI chập chờn trước khi tin nó, và nó quan trọng nhất trên một cái máy dùng chung nơi các tiến trình khác đang tranh nhau cùng cái đĩa và cùng số nhân. Cũng để ý bản thân trạng thái ổn định dạy điều gì: QUÉT chiếm 97% công việc — chính bản dựng ấy với glob không khớp file nào thì xong trong 147 ms — nên nếu một bản dựng thật sự chậm thì đòn bẩy là thu hẹp glob chứ không phải bớt tiện ích.',
          ),
        }),

        mcq({
          prompt: B(
            'The same output file is reported as 45,242 bytes gzipped in one lesson and 43,623 in the next. Which explanation is right, and what follows for the number you should quote?',
            'Cùng một file đầu ra được báo là 45.242 byte gzip ở bài này và 43.623 ở bài kế tiếp. Giải thích nào đúng, và suy ra bạn nên trích con số nào?',
          ),
          options: [
            B(
              'Different compression LEVELS — level 6 versus level 9 — so both are correct; and since your server picks its own level, the number to quote is the transferred size in the Network tab',
              'Khác MỨC NÉN — mức 6 so với mức 9 — nên cả hai đều đúng; và vì máy chủ của bạn tự chọn mức của nó, con số nên trích là kích thước truyền trong tab Network',
            ),
            B(
              'One measurement included the minifier and the other did not, so the 1,619-byte gap is exactly what minification saves on this file',
              'Một phép đo có chạy bộ rút gọn còn phép kia thì không, nên khoảng chênh 1.619 byte đúng bằng phần bộ rút gọn tiết kiệm trên file này',
            ),
            B(
              'Gzip is non-deterministic, so any two runs differ slightly and the only reliable figure is an average over many compressions',
              'Gzip không tất định nên hai lượt chạy bất kỳ đều lệch nhau chút ít, và con số đáng tin duy nhất là trung bình của nhiều lần nén',
            ),
            B(
              'The file changed between the two lessons; a 1,619-byte difference is exactly one added utility rule, so the second figure supersedes the first',
              'File đã thay đổi giữa hai bài; chênh 1.619 byte đúng bằng một quy tắc tiện ích được thêm vào, nên con số thứ hai thay thế con số thứ nhất',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Both figures are real: <code>gzip -c</code> defaults to level 6 and the second measurement asked for level 9. Naming the level is what keeps two different numbers for the same file from looking like sloppiness — reporting them without explanation is how a set of measurements loses credibility all at once. And the practical point is that neither is "the" answer, because the level is a property of your infrastructure: nginx defaults to level 1 for CPU reasons, a CDN often pre-compresses at 9 or 11, and brotli beats gzip on a file this repetitive by another 15–20%. Measure the response rather than the file. Note gzip is deterministic for a given level and implementation, so run-to-run variance is not the explanation here.',
            'Cả hai con số đều thật: <code>gzip -c</code> mặc định mức 6, còn phép đo thứ hai yêu cầu mức 9. Nói rõ MỨC là thứ giữ cho hai con số khác nhau của cùng một file khỏi trông như sự cẩu thả — báo chúng mà không giải thích là cách cả một bộ phép đo mất uy tín cùng một lúc. Và điểm thực dụng là chẳng con số nào là "câu trả lời", vì mức nén là thuộc tính hạ tầng của bạn: nginx mặc định mức 1 vì lý do CPU, một CDN thường nén sẵn ở mức 9 hoặc 11, còn brotli thì vượt gzip thêm 15–20% nữa trên một file lặp lại nhiều như thế. Hãy đo PHẢN HỒI chứ đừng đo file. Để ý gzip là tất định với một mức và một bản cài đặt cho trước, nên biến thiên giữa các lượt chạy không phải lời giải thích ở đây.',
          ),
        }),

        mcq({
          prompt: B(
            'Two files weighed today with gzip level 9. Which reading is right?' + code(
              'Tailwind output (sandbox build)   143,575 B  ->  15,997 B   8.98:1\n' +
              'frontend/src/app/globals.css      233,649 B  ->  60,162 B   3.88:1',
            ),
            'Hai file được cân hôm nay bằng gzip mức 9. Cách đọc nào đúng?' + code(
              'Đầu ra Tailwind (bản dựng hộp cát)  143.575 B  ->  15.997 B   8,98:1\n' +
              'frontend/src/app/globals.css        233.649 B  ->  60.162 B   3,88:1',
            ),
          ),
          options: [
            B(
              'Utility CSS is smaller than hand-written CSS, which the raw column already shows and the gzip column merely confirms',
              'CSS tiện ích nhỏ hơn CSS viết tay, điều mà cột thô đã cho thấy còn cột gzip chỉ xác nhận lại',
            ),
            B(
              'The ratios are an artefact of file size: any larger text file compresses better, so the comparison says nothing about the two styles of CSS',
              'Hai tỉ số là hệ quả của kích thước file: file văn bản nào to hơn cũng nén tốt hơn, nên phép so sánh này chẳng nói gì về hai lối viết CSS',
            ),
            B(
              'Utility output compresses 2.3× better, because gzip replaces repeated byte sequences and sorted rules of identical shape are exactly what it is best at — so ranking two stylesheets by raw size can invert the ranking by transfer size',
              'Đầu ra tiện ích nén tốt hơn 2,3 lần, vì gzip thay các đoạn byte lặp lại bằng tham chiếu ngược, mà những quy tắc cùng hình dạng nằm sát nhau theo thứ tự sắp chính là thứ nó giỏi nhất — nên xếp hạng hai bảng kiểu theo kích thước THÔ có thể ĐẢO NGƯỢC xếp hạng theo kích thước TRUYỀN',
            ),
            B(
              'The hand-written file is badly written: a 3.88:1 ratio means it contains almost no repetition and should be refactored to share more declarations',
              'File viết tay được viết tệ: tỉ số 3,88:1 nghĩa là nó gần như không có sự lặp lại nào và nên được tái cấu trúc để chia sẻ nhiều khai báo hơn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The mechanism is what makes the ratio meaningful rather than incidental. gzip works by replacing a repeated byte sequence with a back-reference to an earlier occurrence, and it only reaches back a limited distance — so what matters is repetition that is also ADJACENT. Utility output is pathologically both: thousands of rules with the same shape, the same property names, values drawn from a small scale, emitted in sorted order so near-identical rules sit next to each other. <code>.mt-1{margin-top:0.25rem}.mt-2{margin-top:0.5rem}</code> gives the compressor <code>margin-top:0.</code> over and over. Hand-written CSS is more varied and therefore less compressible; that is the trade, not a defect in either file. The consequence worth carrying is the inversion: in the course\'s own measurement, <code>globals.css</code> was less than half the raw size of the Tailwind output and cost MORE bytes on the wire. Anyone comparing two stylesheets with <code>ls -l</code> can reach the opposite of the truth.',
            'Chính CƠ CHẾ làm cho tỉ số này có nghĩa chứ không phải ngẫu nhiên. gzip hoạt động bằng cách thay một đoạn byte lặp lại bằng một tham chiếu ngược tới lần xuất hiện trước, và nó chỉ với ngược lại được một khoảng giới hạn — nên thứ quan trọng là sự lặp lại mà lại còn NẰM KỀ NHAU. Đầu ra tiện ích thoả cả hai tới mức bệnh hoạn: hàng nghìn quy tắc cùng hình dạng, cùng tên thuộc tính, giá trị rút từ một cái thang nhỏ, được phát sinh theo thứ tự đã sắp nên các quy tắc gần giống nhau nằm sát nhau. <code>.mt-1{margin-top:0.25rem}.mt-2{margin-top:0.5rem}</code> đưa cho bộ nén cái chuỗi <code>margin-top:0.</code> lặp đi lặp lại. CSS viết tay đa dạng hơn nên khó nén hơn; đó là sự đánh đổi chứ không phải khiếm khuyết của file nào. Hệ quả đáng mang theo là phép ĐẢO NGƯỢC: trong chính phép đo của giáo trình, <code>globals.css</code> chưa bằng một nửa kích thước thô của đầu ra Tailwind mà lại tốn NHIỀU byte hơn qua mạng. Ai so hai bảng kiểu bằng <code>ls -l</code> đều có thể đi tới điều ngược hẳn với sự thật.',
          ),
        }),

        mcq({
          prompt: B(
            'Bytes by family in a real build. Which conclusion follows?' + code(
              'family      rules    bytes     % bytes\n' +
              'other        2993   193,143    60.8%\n' +
              'gradient      282    49,656    15.6%\n' +
              'shadow        152    40,474    12.7%\n' +
              'transform      69    17,573     5.5%\n' +
              'ring          134    13,310     4.2%\n' +
              '            -----   -------\n' +
              'total        3664   317,448',
            ),
            'Byte theo nhóm trong một bản dựng thật. Kết luận nào rút ra được?' + code(
              'nhóm        quy tắc   byte      % byte\n' +
              'other        2993   193.143    60,8%\n' +
              'gradient      282    49.656    15,6%\n' +
              'shadow        152    40.474    12,7%\n' +
              'transform      69    17.573     5,5%\n' +
              'ring          134    13.310     4,2%\n' +
              '            -----   -------\n' +
              'tổng         3664   317.448',
            ),
          ),
          options: [
            B(
              'The 2,993 "other" rules are the problem, since they are 60.8% of the bytes — so reducing the number of utilities used is the highest-leverage change available',
              '2.993 quy tắc "other" mới là vấn đề, vì chúng chiếm 60,8% số byte — nên giảm số tiện ích đang dùng là thay đổi có đòn bẩy cao nhất',
            ),
            B(
              'Gradients and shadows are 11.8% of the rules but 28.4% of the bytes — 2.4× heavier per rule — so any optimisation reasoned from RULE COUNTS targets the cheap majority and misses the expensive minority',
              'Gradient và shadow chiếm 11,8% số quy tắc mà tới 28,4% số byte — nặng gấp 2,4 lần trung bình mỗi quy tắc — nên bất kỳ phép tối ưu nào suy từ SỐ QUY TẮC đều nhắm vào phần đa số rẻ tiền và bỏ sót phần thiểu số đắt đỏ',
            ),
            B(
              'The distribution is essentially uniform once you account for rule count, so there is no targeted optimisation available and only total volume matters',
              'Phân bố về cơ bản là đồng đều một khi đã tính tới số quy tắc, nên không có phép tối ưu nhắm đích nào cả và chỉ tổng khối lượng mới đáng kể',
            ),
            B(
              'Ring and transform should go first: at 9.7% of bytes between them they are the cheapest rules to delete because almost nothing depends on them',
              'Ring và transform nên đi trước: cộng lại chiếm 9,7% số byte, chúng là những quy tắc rẻ nhất để xoá vì gần như chẳng có gì phụ thuộc vào chúng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Divide each row: 434 gradient and shadow rules carry 90,130 bytes, about 208 bytes each, against an average of 87. Both families emit long multi-part values, and the shadows in this repository stack four layers apiece — an inset highlight, a hairline, a drop shadow and a ring — so the longest single rule in the file is 507 bytes. The 2,993 "other" rules average 65 bytes and are exactly the ones that compress hardest, because a spacing utility sits in a family of near-identical siblings the compressor can back-reference almost entirely. So the ranking by count and the ranking by bytes are different rankings, and only one of them is what you pay for. What this licenses is narrow: not deleting shadows (40 KB raw is roughly 5 KB gzipped on a page that ships fonts and images), but naming a repeated arbitrary shadow in the config — a four-layer shadow used five times as an arbitrary value is 2,500 unique bytes with no siblings, and one config entry plus five short class names instead.',
            'Chia từng hàng ra: 434 quy tắc gradient và shadow gánh 90.130 byte, khoảng 208 byte mỗi cái, so với trung bình 87. Cả hai họ đều phát sinh những giá trị dài nhiều phần, và bóng đổ trong kho này chồng bốn lớp một cái — một vệt sáng bên trong, một đường tóc, một bóng đổ và một vòng viền — nên quy tắc đơn dài nhất trong file là 507 byte. 2.993 quy tắc "other" trung bình 65 byte và đúng là những cái nén giỏi nhất, vì một tiện ích khoảng cách nằm trong một họ anh em gần như giống hệt mà bộ nén tham chiếu ngược được gần hết. Vậy xếp hạng theo SỐ LƯỢNG và xếp hạng theo BYTE là hai xếp hạng khác nhau, và chỉ một trong hai là thứ bạn phải trả. Điều này cho phép một việc rất hẹp: không phải xoá bóng đổ (40 KB thô chỉ còn khoảng 5 KB gzip, trên một trang vốn đã gửi phông chữ và ảnh), mà là ĐẶT TÊN cho một bóng tuỳ ý bị lặp trong config — một bóng bốn lớp dùng năm lần dưới dạng giá trị tuỳ ý là 2.500 byte duy nhất không có anh em nào, thay bằng một mục config cộng năm cái tên lớp ngắn.',
          ),
        }),

        mcq({
          prompt: B(
            'Arbitrary values are 29.6% of the rules in this build and 33.1% of the bytes. Why do they take a disproportionate share, and what does that say about the counting rule from Chapter 1?',
            'Giá trị tuỳ ý chiếm 29,6% số quy tắc trong bản dựng này và 33,1% số byte. Vì sao chúng chiếm phần lớn hơn tỉ lệ, và điều đó nói gì về luật ĐẾM ở chương 1?',
          ),
          options: [
            B(
              'The escaped selectors are longer — brackets, parentheses and commas all become escape sequences — and that escaping is where the extra bytes go',
              'Selector đã thoát thì dài hơn — dấu ngoặc vuông, ngoặc tròn và dấu phẩy đều thành chuỗi thoát — và phần thoát ấy là chỗ số byte dôi ra',
            ),
            B(
              'They are generated twice: once for the arbitrary value and once for the nearest scale value, as a fallback for browsers that reject the arbitrary syntax',
              'Chúng được sinh hai lần: một cho giá trị tuỳ ý và một cho giá trị gần nhất trên thang, làm phương án dự phòng cho trình duyệt từ chối cú pháp tuỳ ý',
            ),
            B(
              'Tailwind cannot sort arbitrary values, so they are appended at the end of the file where the compressor has already exhausted its back-reference window',
              'Tailwind không sắp được giá trị tuỳ ý nên chúng bị nối vào cuối file, chỗ mà bộ nén đã dùng hết cửa sổ tham chiếu ngược của nó',
            ),
            B(
              'A one-off value has no SIBLINGS for the compressor to reference, while a scale value sits in a family of near-identical rules — so the counting rule restated in bytes is that recurring values are nearly free and single-use values are not',
              'Một giá trị dùng một lần thì không có ANH EM nào để bộ nén tham chiếu tới, còn một giá trị lấy từ thang thì nằm trong một họ quy tắc gần như giống hệt — nên luật ĐẾM phát biểu lại theo byte là: giá trị lặp lại gần như miễn phí, còn giá trị dùng một lần thì không',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The escaping does add characters, but it is not where the cost lives — <code>mt-[7px]</code> escapes to something barely longer than <code>mt-7</code>. The cost is compressibility. A scale value like <code>mt-2</code> is emitted next to <code>mt-1</code>, <code>mt-3</code> and thirty more of the same shape, so gzip encodes nearly all of it as a back-reference. A one-off <code>shadow-[0_24px_80px_rgba(0,0,0,0.65)]</code> is 507 unique bytes with nothing to reference. That gives Chapter 1\'s threshold a second, independent justification: naming a value used ten times converts ten unique long rules into one rule plus ten short class names, and the saving is bytes as well as maintainability. Note the reverse also holds — the 1,398 uses of <code>text-[10px]</code> and <code>text-[11px]</code> are cheap in bytes precisely because they recur, so the byte argument and the naming argument point at DIFFERENT arbitrary values: bytes point at the long one-offs, maintainability at the short repeats.',
            'Phép thoát ký tự có thêm ký tự thật, nhưng chi phí không nằm ở đó — <code>mt-[7px]</code> thoát ra chỉ dài hơn <code>mt-7</code> một chút. Chi phí nằm ở KHẢ NĂNG NÉN. Một giá trị trên thang như <code>mt-2</code> được sinh ngay cạnh <code>mt-1</code>, <code>mt-3</code> và ba chục cái cùng hình dạng, nên gzip mã hoá gần hết nó thành một tham chiếu ngược. Một cái <code>shadow-[0_24px_80px_rgba(0,0,0,0.65)]</code> dùng một lần thì là 507 byte duy nhất chẳng có gì để tham chiếu. Điều đó cho ngưỡng ở chương 1 một lý lẽ thứ hai, độc lập: đặt tên cho một giá trị dùng mười lần là biến mười quy tắc dài duy nhất thành một quy tắc cộng mười tên lớp ngắn, và khoản tiết kiệm là byte chứ không chỉ là công bảo trì. Để ý chiều ngược lại cũng đúng — 1.398 lượt dùng <code>text-[10px]</code> với <code>text-[11px]</code> rẻ về byte chính vì chúng LẶP LẠI, nên lý lẽ về byte và lý lẽ về đặt tên chỉ vào NHỮNG giá trị tuỳ ý KHÁC NHAU: byte chỉ vào những cái dài dùng một lần, còn bảo trì chỉ vào những cái ngắn lặp nhiều.',
          ),
        }),

        mcq({
          prompt: B(
            'A team wants CI to catch the broken-content-glob failure. Which guard actually catches it, and which direction should the size alert point?',
            'Một đội muốn CI bắt được lỗi glob content hỏng. Chốt kiểm nào thật sự bắt được nó, và cảnh báo về kích thước nên hướng về phía nào?',
          ),
          options: [
            B(
              'Assert a FLOOR on the rule count — <code>grep -c "^\\." out.css</code> under 100 fails the build — and alert when the output SHRINKS, because a build that got dramatically faster and smaller is the fingerprint of the failure',
              'Khẳng định một SÀN cho số quy tắc — <code>grep -c "^\\." out.css</code> dưới 100 là làm hỏng bản dựng — và cảnh báo khi đầu ra CO LẠI, vì một bản dựng đột nhiên nhanh hơn và nhỏ hơn hẳn chính là dấu vân tay của lỗi này',
            ),
            B(
              'Assert a CEILING on gzipped size, since a broken glob is one of several causes of unexpected output size and a single threshold covers them all',
              'Khẳng định một TRẦN cho kích thước gzip, vì glob hỏng là một trong nhiều nguyên nhân làm kích thước đầu ra bất thường và một ngưỡng duy nhất bao được tất cả',
            ),
            B(
              'Check the exit code of the Tailwind CLI, which is the standard way a build tool reports that its input configuration matched nothing',
              'Kiểm mã thoát của Tailwind CLI, cách chuẩn để một công cụ dựng báo rằng cấu hình đầu vào của nó không khớp gì cả',
            ),
            B(
              'Track build duration and fail when it improves by more than 50%, since the speedup is the primary signal and it is the cheapest thing to measure in CI',
              'Theo dõi thời lượng dựng và làm hỏng bản dựng khi nó cải thiện quá 50%, vì tốc độ tăng mới là tín hiệu chính và đó là thứ rẻ nhất để đo trong CI',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The exit code is exactly what cannot help: a glob matching nothing is not an error, so the CLI exits zero, CI passes, the deploy succeeds, and the site ships a stylesheet containing a browser reset and no styling at all. Measured, the broken build emits about 10 KB with ZERO rules starting with a class selector — Preflight and nothing else — so the rule count is unambiguous, and 100 is a deliberately loose threshold because any real project generates thousands. The direction of the size alert is the counter-intuitive half. The instinct is to alert when CSS grows, but growth is usually a legitimate feature and the reflex is to raise the threshold until it never fires again. The failure that actually ships broken is CSS SHRINKING, after a directory rename stops a glob matching. Build duration is a bad gate for a different reason: it is noisy on a shared machine, and here it moves in the direction everyone celebrates — the broken build is 36× faster, because scanning is 97% of the work and it did not scan.',
            'Mã thoát đúng là thứ KHÔNG giúp được: một glob không khớp gì cả không phải lỗi, nên CLI thoát 0, CI xanh, deploy thành công, và trang web xuất xưởng với một bảng kiểu chỉ có phần reset trình duyệt và không có kiểu dáng nào. Đo thật, bản dựng hỏng phát sinh khoảng 10 KB với KHÔNG quy tắc nào bắt đầu bằng selector lớp — chỉ Preflight và hết — nên số quy tắc là dấu hiệu không thể nhầm, và ngưỡng 100 cố tình để lỏng vì dự án thật nào cũng sinh hàng nghìn. Chiều của cảnh báo kích thước mới là nửa phản trực giác. Bản năng là cảnh báo khi CSS PHÌNH, nhưng phình thường là một tính năng chính đáng và phản xạ tiếp theo là nâng ngưỡng lên cho tới khi nó không bao giờ kêu nữa. Cái lỗi thật sự xuất xưởng hỏng là CSS TEO LẠI, sau khi một lần đổi tên thư mục làm một glob thôi khớp. Thời lượng dựng là một cái cổng tồi vì lý do khác: nó nhiễu trên máy dùng chung, và ở đây nó chạy về đúng hướng mà ai cũng ăn mừng — bản dựng hỏng nhanh gấp 36 lần, vì quét chiếm 97% công việc mà nó thì không quét.',
          ),
        }),

        mcq({
          prompt: B(
            'Three CSS-size optimisations that make things worse. Which set is it?',
            'Ba phép tối ưu kích thước CSS làm mọi thứ TỆ ĐI. Bộ nào?',
          ),
          options: [
            B(
              'Enabling brotli, setting immutable cache headers, and logging raw/gzip/rule counts per build',
              'Bật brotli, đặt header cache immutable, và ghi lại số byte thô/gzip/quy tắc mỗi lần dựng',
            ),
            B(
              'Naming repeated arbitrary shadows in the config, tightening the content globs, and pruning declared-but-unused animations',
              'Đặt tên trong config cho các bóng tuỳ ý bị lặp, thu hẹp glob content, và dọn các hoạt ảnh khai mà không dùng',
            ),
            B(
              'Disabling Preflight to recover 6.5%, splitting CSS per route, and adding a precautionary safelist',
              'Tắt Preflight để lấy lại 6,5%, chẻ CSS theo từng route, và thêm một safelist phòng xa',
            ),
            B(
              'Minifying the output, removing unused config colours, and switching the entry file to a single <code>@tailwind utilities</code> directive',
              'Rút gọn đầu ra, xoá các màu không dùng trong config, và đổi file đầu vào thành một chỉ thị <code>@tailwind utilities</code> duy nhất',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Each of the three is locally plausible and globally wrong. Disabling Preflight recovers 2,966 gzipped bytes — 6.5% of the payload — in exchange for every element losing its normalisation, so headings, lists and buttons revert to defaults that differ per browser and every utility then composes on top of styling you did not choose. Splitting CSS per route fights the nature of utility output: the same <code>flex</code> serves every page, so splitting duplicates the common utilities across bundles and destroys the caching that was the single largest win available. A precautionary safelist is the only way to make the output genuinely and permanently larger, because it generates rules no source file references; safelisting is for classes assembled at runtime, and the correct fix for those is writing complete class names. The first two options are the actual recommended work, in order — compression and cache headers are two config lines worth 99% of the available win, and naming repeated shadows is the justified third step only if CSS is your largest payload.',
            'Cả ba đều nghe hợp lý tại chỗ và sai trên tổng thể. Tắt Preflight lấy lại 2.966 byte gzip — 6,5% khối lượng — đổi lấy việc mọi thẻ mất phần chuẩn hoá, nên tiêu đề, danh sách và nút quay về mặc định vốn khác nhau theo trình duyệt, rồi mọi tiện ích lại soạn chồng lên một nền kiểu dáng bạn không chọn. Chẻ CSS theo route thì chống lại chính bản chất của đầu ra tiện ích: cùng một <code>flex</code> phục vụ mọi trang, nên chẻ ra là nhân bản các tiện ích chung khắp các gói và phá luôn phần cache vốn là khoản lợi lớn nhất có được. Một safelist phòng xa là cách duy nhất làm đầu ra to lên thật sự và vĩnh viễn, vì nó sinh ra những quy tắc không file nguồn nào nhắc tới; safelist là để dành cho những lớp ghép lúc chạy, mà cách sửa đúng cho chúng là viết tên lớp đầy đủ. Hai phương án đầu chính là phần việc nên làm, theo thứ tự — nén và header cache là hai dòng config đáng 99% khoản lợi có được, còn đặt tên cho các bóng lặp là bước thứ ba chỉ chính đáng khi CSS là khối lượng lớn nhất của trang bạn.',
          ),
        }),

        // ── Chương 9 — Khả năng tiếp cận ────────────────────────────────
        mcq({
          prompt: B(
            'The failing <code>--text-muted</code> needs a replacement. Computed against the real backgrounds today, which choice is right and why?' + code(
              'darkest neutral grey reaching 4.5:1 on #f0f2f5 (light surface) -> #6e6e6e (4.55)\n' +
              'darkest neutral grey reaching 4.5:1 on #ffffff (light card)    -> #767676 (4.54)\n' +
              '\n' +
              '#6e6e6e on #ffffff -> 5.10        #767676 on #f0f2f5 -> 4.05',
            ),
            'Cái <code>--text-muted</code> đang trượt cần một giá trị thay thế. Tính trên đúng các nền thật hôm nay, lựa chọn nào đúng và vì sao?' + code(
              'xám trung tính TỐI NHẤT còn đạt 4,5:1 trên #f0f2f5 (surface sáng) -> #6e6e6e (4,55)\n' +
              'xám trung tính TỐI NHẤT còn đạt 4,5:1 trên #ffffff (card sáng)    -> #767676 (4,54)\n' +
              '\n' +
              '#6e6e6e trên #ffffff -> 5,10        #767676 trên #f0f2f5 -> 4,05',
            ),
          ),
          options: [
            B(
              'Measure against the SURFACE and take <code>#6e6e6e</code>: the surface is the harder background, and that value then scores 5.10 on the card, so one hex covers both placements — while tuning against the card gives <code>#767676</code>, which drops to 4.05 on the surface and still fails',
              'Đo theo SURFACE và lấy <code>#6e6e6e</code>: surface là nền khó hơn, và giá trị ấy khi lên card ăn 5,10, nên một mã hex phủ được cả hai chỗ đặt — còn chỉnh theo card thì ra <code>#767676</code>, tụt xuống 4,05 trên surface và vẫn trượt',
            ),
            B(
              'Take the average of the two, <code>#727272</code>, which is the only value that treats both backgrounds fairly and therefore passes on both',
              'Lấy trung bình hai giá trị, <code>#727272</code>, giá trị duy nhất đối xử công bằng với cả hai nền nên đạt trên cả hai',
            ),
            B(
              'Keep one hex for both themes and instead raise the font size to 24px everywhere the token appears, which moves the threshold from 4.5 to 3.0',
              'Giữ một mã hex cho cả hai theme rồi thay vào đó nâng cỡ chữ lên 24px ở mọi chỗ token xuất hiện, cách này kéo ngưỡng từ 4,5 xuống 3,0',
            ),
            B(
              'Neither: a neutral grey can never pass on both a card and a surface, so the token must be split into <code>--text-muted-card</code> and <code>--text-muted-surface</code>',
              'Không cái nào: một màu xám trung tính không bao giờ đạt được trên cả card lẫn surface, nên token phải chẻ thành <code>--text-muted-card</code> và <code>--text-muted-surface</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Tune against the harder background and the easier one comes free; tune against the easier one and the harder one still fails. That asymmetry is why the search is run against <code>#f0f2f5</code> rather than <code>#ffffff</code>, and the two numbers on the second line are the proof: <code>#6e6e6e</code> clears both at 4.55 and 5.10, while <code>#767676</code> clears only the card and lands at 4.05 on the surface. Averaging is not a method — the ratio is not linear in the hex value, so a midpoint has no guaranteed property at all. Raising every use to 24px is not available either: this token is paired with <code>text-xs</code> and <code>text-sm</code> in 46% of its uses, 12px and 14px, and those are normal text by the standard\'s own definition. The real defect is upstream of the value: the token holds ONE hex across both themes, and its lightness has to move in opposite directions for a light background and a dark one, so no single value can serve both. The dark theme needs <code>#979797</code> separately. What makes the fix cheap is Chapter 6\'s mechanism — every one of the 2,537 call sites reads <code>var(--text-muted)</code>, so two lines in <code>globals.css</code> reach all of them and no <code>.tsx</code> file changes.',
            'Chỉnh theo nền KHÓ hơn thì nền dễ được cho không; chỉnh theo nền dễ thì nền khó vẫn trượt. Chính sự bất đối xứng ấy là lý do phép quét chạy trên <code>#f0f2f5</code> chứ không phải <code>#ffffff</code>, và hai con số ở dòng thứ hai là bằng chứng: <code>#6e6e6e</code> vượt cả hai với 4,55 và 5,10, còn <code>#767676</code> chỉ vượt được card và rơi xuống 4,05 trên surface. Lấy trung bình không phải một phương pháp — tỉ số không tuyến tính theo giá trị hex, nên một điểm giữa chẳng bảo đảm được tính chất nào. Nâng mọi chỗ lên 24px cũng không khả dĩ: token này đi kèm <code>text-xs</code> và <code>text-sm</code> ở 46% số lượt dùng, tức 12px và 14px, và theo đúng định nghĩa của tiêu chuẩn thì đó là chữ THƯỜNG. Khiếm khuyết thật nằm ở phía trên giá trị: token giữ MỘT mã hex cho cả hai theme, mà độ sáng của nó phải đi theo hai hướng ngược nhau với nền sáng và nền tối, nên không một giá trị nào phục vụ được cả hai. Theme tối cần riêng <code>#979797</code>. Thứ làm cho phép sửa rẻ là cơ chế của chương 6 — cả 2.537 chỗ gọi đều đọc <code>var(--text-muted)</code>, nên hai dòng trong <code>globals.css</code> tới được hết và không file <code>.tsx</code> nào phải đổi.',
          ),
        }),

        mcq({
          prompt: B(
            'A reviewer argues that <code>--text-muted</code> is exempt from the 4.5:1 requirement because it is deliberately faint — it is "muted" by design. Is that reasoning sound?',
            'Một người review lập luận rằng <code>--text-muted</code> được miễn yêu cầu 4,5:1 vì nó cố ý mờ — nó "muted" theo thiết kế. Lập luận ấy có vững không?',
          ),
          options: [
            B(
              'Yes: WCAG applies to primary content, and a token whose name declares it secondary is outside the scope of 1.4.3 by definition',
              'Có: WCAG áp cho nội dung chính, và một token mà cái tên đã tuyên bố nó là phụ thì theo định nghĩa nằm ngoài phạm vi của 1.4.3',
            ),
            B(
              'Yes, provided the same information is available elsewhere on the page, which is the standard\'s own escape clause for redundant content',
              'Có, miễn là cùng thông tin ấy có sẵn ở chỗ khác trên trang, đúng điều khoản thoát của tiêu chuẩn dành cho nội dung dư thừa',
            ),
            B(
              'No: WCAG exempts decorative text and disabled controls, not secondary information — timestamps, counts, helper text and empty-state messages all carry meaning',
              'Không: WCAG miễn cho chữ TRANG TRÍ và điều khiển BỊ VÔ HIỆU, chứ không miễn cho thông tin phụ — dấu thời gian, số đếm, chữ gợi ý và thông báo trạng thái rỗng đều mang nghĩa',
            ),
            B(
              'No, but only in the light theme: on a dark background a faint grey is perceptually brighter, so the exemption argument holds there',
              'Không, nhưng chỉ ở theme sáng: trên nền tối thì một màu xám nhạt trông sáng hơn về mặt cảm nhận, nên lập luận miễn trừ vẫn đứng vững ở đó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the reasoning that produces the defect in the first place, and the standard does not recognise it. The exemptions in 1.4.3 are narrow and specific: text that is purely decorative, text that is part of a logo, and text in a disabled control. "Secondary" is not on the list, and for good reason — a timestamp, a comment count, the helper line under a form field and an empty-state message all carry information a user needs, and the fact that a designer wanted them de-emphasised says nothing about whether they can be read. There is no perceptual escape hatch on a dark background either: the ratio is computed from relative luminance and it is symmetric, which is exactly why the same <code>#8a8d91</code> scores 4.61 on the dark card and 3.95 on the dark surface. And note the sharpest number in the audit: the worst case, 2.97 on the light surface, is below even the 3.0 threshold that large text is allowed — so there is no font size at which that pairing conforms.',
            'Đây chính là lối lập luận đẻ ra khiếm khuyết ngay từ đầu, và tiêu chuẩn không công nhận nó. Các miễn trừ trong 1.4.3 rất hẹp và cụ thể: chữ thuần trang trí, chữ nằm trong logo, và chữ trong một điều khiển đã bị vô hiệu. "Phụ" không có trong danh sách, và có lý do chính đáng — một dấu thời gian, một con số đếm bình luận, dòng gợi ý dưới một ô nhập và một thông báo trạng thái rỗng đều mang thông tin người dùng cần, còn việc nhà thiết kế muốn chúng nhạt bớt thì chẳng nói gì về chuyện chúng có đọc được hay không. Trên nền tối cũng không có lối thoát nào về mặt cảm nhận: tỉ số được tính từ độ chói tương đối và nó ĐỐI XỨNG, đúng vì thế mà cùng một <code>#8a8d91</code> ăn 4,61 trên card tối và 3,95 trên surface tối. Và để ý con số sắc nhất trong bản rà: ca tệ nhất, 2,97 trên surface sáng, còn dưới cả ngưỡng 3,0 vốn dành cho chữ LỚN — nên không có cỡ chữ nào làm cặp ấy đạt chuẩn được.',
          ),
        }),

        mcq({
          prompt: B(
            'The 1.16 incident: a region paints a fixed dark background with <code>bg-darkbg</code> (<code>#18191a</code>, hardcoded in the config) and the text inside it uses <code>text-text-primary</code> (<code>var(--text-primary)</code>, which follows the theme). In the light theme that resolves to <code>#050505</code> — near-black on near-black, ratio 1.16, across 142 files. What is the structural lesson?',
            'Sự cố 1,16: một vùng vẽ nền tối CỐ ĐỊNH bằng <code>bg-darkbg</code> (<code>#18191a</code>, đóng cứng trong config) còn chữ bên trong dùng <code>text-text-primary</code> (<code>var(--text-primary)</code>, đi theo theme). Ở theme sáng nó giải ra <code>#050505</code> — gần đen trên gần đen, tỉ số 1,16, trải 142 file. Bài học về mặt cấu trúc là gì?',
          ),
          options: [
            B(
              'Fixed dark regions are always a mistake: any background that does not follow the theme will eventually collide with theme-aware text, so the config should never hold a literal dark hex',
              'Vùng tối cố định luôn là sai lầm: nền nào không đi theo theme thì rồi cũng va vào chữ theo theme, nên config không bao giờ nên giữ một mã hex tối nguyên văn',
            ),
            B(
              'Theme-aware text tokens are the mistake: a colour that changes underneath a component is unpredictable, and components should name the colour they want',
              'Token chữ theo theme mới là sai lầm: một màu tự đổi bên dưới một component thì không lường được, và component nên gọi tên đúng cái màu nó muốn',
            ),
            B(
              'Neither half is wrong on its own — the defect lives in the INTERACTION, so no reviewer reading either file in isolation and no linter checking one class at a time can catch it',
              'Không nửa nào tự nó sai — khiếm khuyết nằm ở chỗ HAI THỨ GẶP NHAU, nên không người review nào đọc riêng từng file và không bộ lint nào kiểm từng lớp một bắt được nó',
            ),
            B(
              'It is a specificity bug: the fixed background wins over the theme block because a Tailwind utility outranks a <code>:root</code> declaration, and the fix is to raise the theme block\'s specificity',
              'Đó là lỗi độ đặc hiệu: cái nền cố định thắng khối theme vì một tiện ích Tailwind xếp trên một khai báo <code>:root</code>, và cách sửa là nâng độ đặc hiệu của khối theme',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A fixed dark region is a legitimate design — parts of a site are meant to look like a console. A theme-aware text token is the correct default and the rule the rest of the codebase is supposed to follow. Put them on the same element and you get near-black on near-black in one of the two themes, and nothing in either source file hints at it: the background comes from one component and the colour from a token defined three files away. That is the failure mode utility CSS makes easy, and it is why the audit had to compute ratios over actual token PAIRS rather than review classes one at a time. Note it is not a cascade problem at all — both declarations apply exactly as written, and specificity never enters into it. How it surfaced is worth remembering too: the login form, which is the one screen every user meets. 142 files were affected and the ones behind a login could have stayed broken indefinitely, so the discovery was luck rather than process.',
            'Một vùng tối cố định là thiết kế chính đáng — có những phần của trang cố ý trông như một cửa sổ dòng lệnh. Một token chữ theo theme là mặc định đúng và là luật mà phần còn lại của kho mã phải theo. Đặt hai thứ ấy lên cùng một thẻ là ra gần-đen trên gần-đen ở một trong hai theme, mà chẳng file nguồn nào hé lộ điều đó: cái nền đến từ một component còn cái màu đến từ một token định nghĩa cách đó ba file. Đó là kiểu hỏng mà utility CSS làm cho dễ xảy ra, và vì thế bản rà buộc phải tính tỉ số trên các CẶP token thật chứ không review từng lớp một. Để ý nó hoàn toàn không phải vấn đề cascade — cả hai khai báo đều áp đúng như đã viết, và độ đặc hiệu chẳng dính dáng gì. Cách nó lộ ra cũng đáng nhớ: qua biểu mẫu đăng nhập, màn hình duy nhất mà người dùng nào cũng gặp. 142 file bị ảnh hưởng và những chỗ nằm sau lớp đăng nhập lẽ ra có thể hỏng vô thời hạn, nên việc phát hiện ra là may chứ không phải quy trình.',
          ),
        }),

        mcq({
          prompt: B(
            'The fix for the 1.16 incident was not to edit the 142 affected files. What was it, and why is it stronger than editing them?' + code(
              '.dark-surface,\n' +
              '.bg-darkbg,\n' +
              '.bg-darkcard,\n' +
              '.bg-darksurface {\n' +
              '  /* copied verbatim from html.theme-dark above */\n' +
              '  --text-primary: #e4e6eb;\n' +
              '  --text-secondary: #b0b3b8;\n' +
              '}',
            ),
            'Cách sửa sự cố 1,16 KHÔNG phải là sửa 142 file bị ảnh hưởng. Vậy nó là gì, và vì sao nó mạnh hơn việc sửa từng file?' + code(
              '.dark-surface,\n' +
              '.bg-darkbg,\n' +
              '.bg-darkcard,\n' +
              '.bg-darksurface {\n' +
              '  /* chép nguyên văn từ html.theme-dark ở trên */\n' +
              '  --text-primary: #e4e6eb;\n' +
              '  --text-secondary: #b0b3b8;\n' +
              '}',
            ),
          ),
          options: [
            B(
              'It raises the specificity of the dark palette so it beats the light one, which is what stops the theme block from reaching inside those regions',
              'Nó nâng độ đặc hiệu của bảng màu tối để thắng bảng màu sáng, và đó là thứ chặn khối theme với vào bên trong những vùng ấy',
            ),
            B(
              'It adds a build-time check that any element carrying one of those four classes also carries a dark text utility, failing the build otherwise',
              'Nó thêm một phép kiểm lúc dựng rằng thẻ nào mang một trong bốn lớp đó cũng phải mang một tiện ích chữ tối, không thì làm hỏng bản dựng',
            ),
            B(
              'It re-declares the theme variables ON the dark surfaces themselves, so inheritance carries a readable palette to every descendant — self-enforcing for future code, with zero blast radius on the dark theme where those values already applied',
              'Nó khai lại các biến theme NGAY TRÊN chính những mặt nền tối, để phép kế thừa mang một bảng màu đọc được xuống mọi thẻ con — tự thực thi cho mã viết sau, và bán kính ảnh hưởng bằng KHÔNG ở theme tối nơi những giá trị ấy vốn đã áp',
            ),
            B(
              'It replaces the four hardcoded colours with theme-aware ones, so the regions stop being dark in the light theme and the contrast problem disappears',
              'Nó thay bốn màu đóng cứng bằng màu theo theme, nên các vùng ấy thôi tối ở theme sáng và vấn đề tương phản biến mất',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Three properties make this the better repair. It is self-enforcing: any FUTURE element carrying <code>bg-darkbg</code> gets a readable palette automatically, so there is no rule for the next person to remember and no 143rd file to miss — the invariant is enforced by the same class that creates the hazard. Its blast radius on working code is zero, because under <code>html.theme-dark</code> those exact values already applied, so the only behavioural difference is in the light theme where the regions were unreadable. And it costs nothing to reach every descendant, because custom properties INHERIT — setting them on the container reaches any depth without a single descendant selector, which is the one place CSS variables beat utilities outright. The <code>.dark-surface</code> entry is the opt-in for a dark region whose background comes from something else. Note the fourth option describes a different product: those regions are MEANT to stay dark in both themes.',
            'Ba tính chất làm cho đây là phép sửa tốt hơn. Nó TỰ THỰC THI: bất kỳ thẻ nào SAU NÀY mang <code>bg-darkbg</code> cũng tự có một bảng màu đọc được, nên chẳng có luật nào để người sau phải nhớ và chẳng có cái file thứ 143 nào để bỏ sót — bất biến được thực thi bởi chính cái lớp tạo ra mối nguy. Bán kính ảnh hưởng lên mã đang chạy bằng KHÔNG, vì dưới <code>html.theme-dark</code> thì đúng những giá trị ấy vốn đã áp rồi, nên khác biệt hành vi duy nhất nằm ở theme sáng, chỗ các vùng kia không đọc nổi. Và nó không tốn gì để với tới mọi thẻ con, vì thuộc tính tuỳ chỉnh KẾ THỪA — đặt chúng trên hộp chứa là với tới mọi độ sâu mà không cần một selector con cháu nào, đúng chỗ duy nhất mà biến CSS thắng tiện ích một cách dứt khoát. Mục <code>.dark-surface</code> là lối đăng ký tự nguyện cho một vùng tối mà nền đến từ thứ khác. Để ý phương án thứ tư mô tả một sản phẩm khác: những vùng ấy CỐ Ý tối ở cả hai theme.',
          ),
        }),

        mcq({
          prompt: B(
            'The same guard enumerates 51 arbitrary dark hexes by hand, e.g. <code>.bg-\\[\\#0e1218\\]</code>. An audit found zero gaps and zero stale entries — yet one structural leak remains. Where is it?',
            'Chính chốt chặn ấy liệt kê tay 51 mã hex tối tuỳ ý, ví dụ <code>.bg-\\[\\#0e1218\\]</code>. Một đợt rà tìm thấy không lỗ hổng nào và không mục nào lỗi thời — vậy mà vẫn còn một chỗ rò về mặt cấu trúc. Nó ở đâu?',
          ),
          options: [
            B(
              'In the escaping: <code>\\#</code> and <code>\\[</code> are not valid CSS escapes, so those 51 selectors never matched anything and the audit was measuring its own regex',
              'Ở phép thoát ký tự: <code>\\#</code> và <code>\\[</code> không phải chuỗi thoát CSS hợp lệ, nên 51 selector ấy chưa từng khớp gì cả và bản rà chỉ đang đo chính cái regex của nó',
            ),
            B(
              'A variant prefix makes a DIFFERENT class name — <code>lg:bg-[#0e1218]</code> compiles to <code>.lg\\:bg-\\[\\#0e1218\\]</code>, which the guard selector does not match',
              'Một tiền tố biến thể làm ra một TÊN LỚP KHÁC — <code>lg:bg-[#0e1218]</code> biên dịch thành <code>.lg\\:bg-\\[\\#0e1218\\]</code>, thứ mà selector của chốt chặn không khớp',
            ),
            B(
              'In the opacity modifier: <code>bg-[#0e1218]/80</code> generates a rule the guard covers, but the resulting translucent background changes the effective contrast the audit computed',
              'Ở bổ từ độ mờ: <code>bg-[#0e1218]/80</code> sinh ra một quy tắc mà chốt chặn có phủ, nhưng cái nền bán trong suốt sinh ra lại làm đổi tương phản thực tế mà bản rà đã tính',
            ),
            B(
              'Nowhere structural: a hand-maintained list is complete or it is not, and this one is complete, so the only risk is somebody adding a 52nd hex later',
              'Không có chỗ nào về cấu trúc: một danh sách bảo trì tay thì hoặc đủ hoặc không, và cái này đang đủ, nên rủi ro duy nhất là sau này có ai thêm mã hex thứ 52',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The guard is a selector, and a selector matches a class NAME. Adding a variant prefix produces a different name — Tailwind escapes the colon, so <code>lg:bg-[#0e1218]</code> becomes <code>.lg\\:bg-\\[\\#0e1218\\]</code> — and <code>.bg-\\[\\#0e1218\\]</code> does not match it. That is invisible to an audit that only enumerates bare <code>bg-[#hex]</code> tokens, which is why it has to be looked for deliberately. When it was, 18 prefixed dark hexes turned up: 17 were <code>dark:</code>, which only apply inside the Notes region where the palette is already dark — correct by construction rather than by luck — and one was a genuine escape, a single <code>hover:bg-[#0c0f14]</code> where an element turns dark on hover while its text palette does not follow. The right fix for that one is adding <code>dark-surface</code>, not extending the hex list. The deeper cost is the one the pitfall names: 51 hexes had to be listed by hand because none of them has a NAME. Had they been <code>bg-darkbg</code>, the self-enforcing branch would have covered them and the list would not exist — Chapter 5\'s naming argument arriving as an accessibility cost.',
            'Chốt chặn là một SELECTOR, và selector thì khớp theo TÊN LỚP. Thêm một tiền tố biến thể là ra một cái tên khác — Tailwind thoát dấu hai chấm, nên <code>lg:bg-[#0e1218]</code> thành <code>.lg\\:bg-\\[\\#0e1218\\]</code> — và <code>.bg-\\[\\#0e1218\\]</code> không khớp nó. Chuyện đó vô hình với một bản rà chỉ liệt kê các token <code>bg-[#hex]</code> trần, nên phải cố ý đi tìm mới thấy. Khi đi tìm thật thì ra 18 mã hex tối có tiền tố: 17 cái là <code>dark:</code>, vốn chỉ áp bên trong vùng Notes nơi bảng màu đã tối sẵn — đúng theo cấu tạo chứ không phải nhờ may — và một cái là chỗ rò thật, đúng một <code>hover:bg-[#0c0f14]</code> nơi một thẻ chuyển sang tối khi rê chuột mà bảng màu chữ của nó không đi theo. Cách sửa đúng cho cái đó là thêm <code>dark-surface</code> chứ không phải nối dài danh sách hex. Cái giá sâu hơn chính là điều mà mục cạm bẫy gọi tên: 51 mã hex phải liệt kê bằng tay vì chẳng cái nào có TÊN. Nếu chúng đã là <code>bg-darkbg</code> thì nhánh tự-thực-thi đã phủ hết và cái danh sách kia không tồn tại — lý lẽ đặt tên của chương 5 quay lại dưới dạng một cái giá về khả năng tiếp cận.',
          ),
        }),

        mcq({
          prompt: B(
            'A first pass of the dead-class audit reported that every arbitrary shadow in the repo was missing from the built CSS. It was a false alarm. What was wrong, given the real selector below?' + code(
              '.shadow-\\[0_24px_80px_rgba\\(0\\2c 0\\2c 0\\2c 0\\.65\\)\\]',
            ),
            'Lượt rà lớp chết đầu tiên báo rằng mọi bóng đổ tuỳ ý trong kho đều thiếu trong CSS đã dựng. Đó là báo động giả. Sai ở đâu, biết selector THẬT như dưới đây?' + code(
              '.shadow-\\[0_24px_80px_rgba\\(0\\2c 0\\2c 0\\2c 0\\.65\\)\\]',
            ),
          ),
          options: [
            B(
              'The extraction pattern did not decode CSS numeric escapes: a comma is written <code>\\2c</code> plus a terminating space, so the harvested name never matched the token written in the source',
              'Khuôn rút trích không giải mã chuỗi thoát số của CSS: một dấu phẩy được viết là <code>\\2c</code> kèm một dấu cách kết thúc, nên cái tên thu về không bao giờ khớp với token viết trong mã nguồn',
            ),
            B(
              'The audit read the source stylesheet rather than the built one, and arbitrary shadows only exist after the build',
              'Bản rà đọc bảng kiểu NGUỒN chứ không đọc bản đã dựng, mà bóng tuỳ ý thì chỉ tồn tại sau khi dựng',
            ),
            B(
              'Arbitrary shadows really are dropped: Tailwind refuses values containing commas because they are ambiguous with the class separator',
              'Bóng tuỳ ý bị bỏ thật: Tailwind từ chối giá trị có dấu phẩy vì chúng nhập nhằng với dấu ngăn cách giữa các lớp',
            ),
            B(
              'The shadows were behind a variant prefix, and the audit only harvested unprefixed class names from the output',
              'Các bóng ấy nằm sau một tiền tố biến thể, còn bản rà chỉ thu các tên lớp không tiền tố từ đầu ra',
            ),
          ],
          correct: 0,
          explanation: EX(
            'CSS escapes a character it cannot use literally in an identifier as a backslash, its hex code point, and a terminating space — so one comma becomes the six characters <code>\\2c</code> plus a space. An extraction regex that only unescapes <code>\\.</code>-style single-character escapes reads that selector as containing the literal text <code>2c</code> and concludes the class is absent, when the build was perfectly correct. The general shape is the one this course keeps returning to: verify the checker before the content. A first-pass audit reporting that a whole CATEGORY is broken is far more likely to be a bug in the extraction than a catastrophe in the build, and the cheap test is to run the audit against one class you can confirm by hand. The real audit, once fixed, found 326 dead uses out of 118,511 tokens — 0.28% — but concentrated: 81 uses are opacity modifiers on bare <code>var()</code> colours, 76 are a token that was never declared, 13 need an uninstalled plugin, 18 are off-scale values and 25 are Tailwind syntax wrong by a single digit.',
            'CSS thoát một ký tự nó không dùng nguyên văn được trong định danh bằng một dấu chéo ngược, mã điểm hệ mười sáu của nó, và một dấu cách kết thúc — nên một dấu phẩy thành sáu ký tự <code>\\2c</code> cộng một dấu cách. Một regex rút trích chỉ biết bỏ thoát kiểu <code>\\.</code> một-ký-tự sẽ đọc cái selector ấy như đang chứa chữ <code>2c</code> nguyên văn rồi kết luận cái lớp vắng mặt, trong khi bản dựng hoàn toàn đúng. Hình dạng chung là thứ khoá này cứ quay lại mãi: KIỂM BỘ KIỂM trước khi kiểm nội dung. Một lượt rà đầu tiên báo rằng cả một HỌ bị hỏng thì khả năng là lỗi ở khâu rút trích cao hơn nhiều so với một thảm hoạ trong bản dựng, và phép thử rẻ tiền là chạy bản rà trên đúng một cái lớp mà bạn xác nhận được bằng tay. Bản rà thật, sau khi sửa, tìm ra 326 lượt chết trên 118.511 token — 0,28% — nhưng TẬP TRUNG: 81 lượt là bổ từ độ mờ trên màu <code>var()</code> trần, 76 lượt là một token chưa từng được khai, 13 lượt cần một plugin chưa cài, 18 lượt là giá trị ngoài thang và 25 lượt là cú pháp Tailwind sai đúng một chữ số.',
          ),
        }),

        mcq({
          prompt: B(
            'The audit\'s second-largest bucket is 76 uses of <code>bg-bg-elevated/60</code>, <code>bg-bg-elevated/40</code> and friends across 14 files. Re-checked today, <code>grep -c bg-elevated</code> returns 0 in both <code>globals.css</code> and <code>tailwind.config.ts</code>. What is actually happening on those elements?',
            'Nhóm lớn thứ hai của bản rà là 76 lượt dùng <code>bg-bg-elevated/60</code>, <code>bg-bg-elevated/40</code> và bạn bè trải 14 file. Kiểm lại hôm nay, <code>grep -c bg-elevated</code> trả 0 ở cả <code>globals.css</code> lẫn <code>tailwind.config.ts</code>. Thực tế đang xảy ra gì trên những thẻ ấy?',
          ),
          options: [
            B(
              'No rule is generated at all, so those elements render fully TRANSPARENT instead of carrying a raised surface — and nothing errors, because <code>className</code> is typed <code>string</code> and only Tailwind knows what the string means',
              'Không quy tắc nào được sinh cả, nên các thẻ ấy hiển thị HOÀN TOÀN TRONG SUỐT thay vì mang một mặt nổi — và không có lỗi nào, vì <code>className</code> được gán kiểu <code>string</code> và chỉ Tailwind mới biết cái chuỗi ấy nghĩa là gì',
            ),
            B(
              'The base class generates and only the opacity modifier is dropped, so the surfaces render at full opacity — the same failure as the <code>var()</code> alpha trap',
              'Lớp nền vẫn sinh và chỉ bổ từ độ mờ bị bỏ, nên các mặt nền hiển thị ở độ đục hoàn toàn — vẫn đúng kiểu hỏng của cái bẫy alpha trên <code>var()</code>',
            ),
            B(
              'Tailwind falls back to the nearest matching token, <code>bg-bg-surface</code>, so the elements look almost right and the defect is cosmetic',
              'Tailwind lùi về token khớp gần nhất là <code>bg-bg-surface</code>, nên các thẻ trông gần đúng và khiếm khuyết chỉ là chuyện thẩm mỹ',
            ),
            B(
              'The double <code>bg-bg-</code> prefix is the bug: Tailwind strips the duplicated prefix and generates <code>bg-elevated</code>, which is why grep for the full name finds nothing',
              'Tiền tố kép <code>bg-bg-</code> mới là lỗi: Tailwind bỏ bớt tiền tố lặp và sinh ra <code>bg-elevated</code>, và vì thế grep theo tên đầy đủ chẳng thấy gì',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The name looked entirely plausible — <code>bg-bg-elevated</code> follows the pattern <code>bg-&lt;colour-token&gt;</code>, and colour tokens like <code>bg-darkbg</code> do exist — but no such token was ever declared, so there is nothing for Tailwind to compose a rule from. There is no fallback and no prefix-stripping; a generator that does not recognise a string emits nothing. This is a different failure from the alpha trap, and the distinction matters for the fix: in the alpha case the BASE class works and only the modifier is dead, so you change the variable format and the config wrapper; here nothing works at all and the fix is to declare the token. TypeScript, ESLint and Prettier all stay silent because all three see an ordinary string. Note the re-check is the point: the course measured this once, and a claim about DATA has a shelf life — asking the repository again today is what turns "was true when written" into "is true now".',
            'Cái tên trông hoàn toàn hợp lý — <code>bg-bg-elevated</code> theo đúng khuôn <code>bg-&lt;token-màu&gt;</code>, và những token màu như <code>bg-darkbg</code> thì có thật — nhưng chẳng có token nào như thế từng được khai, nên Tailwind không có gì để soạn ra một quy tắc. Không có phương án lùi nào và cũng không có chuyện bỏ bớt tiền tố; một trình sinh không nhận ra một chuỗi thì nó phát sinh SỐ KHÔNG. Đây là kiểu hỏng KHÁC với cái bẫy alpha, và sự phân biệt ấy quan trọng cho cách sửa: ở ca alpha thì lớp NỀN vẫn chạy và chỉ bổ từ chết, nên bạn đổi định dạng biến và lớp bọc trong config; ở đây thì chẳng gì chạy cả và cách sửa là KHAI cái token. TypeScript, ESLint và Prettier đều im lặng vì cả ba đều chỉ thấy một chuỗi bình thường. Để ý việc KIỂM LẠI mới là điểm chính: giáo trình đo chuyện này một lần, và một tuyên bố về DỮ LIỆU thì có hạn sử dụng — hỏi lại kho mã ngày hôm nay là thứ biến "đúng lúc viết" thành "đúng lúc này".',
          ),
        }),

        mcq({
          prompt: B(
            '526 class strings in this repo contain <code>outline-none</code>; 454 of them (86%) also contain a <code>focus:*</code> or <code>focus-visible:*</code> replacement and 72 do not. Which reading of those 72 is right?',
            '526 chuỗi lớp trong kho này có chứa <code>outline-none</code>; 454 cái (86%) có kèm một lớp thay thế <code>focus:*</code> hoặc <code>focus-visible:*</code> còn 72 cái thì không. Cách đọc nào về 72 cái ấy là đúng?',
          ),
          options: [
            B(
              'They are all equally bad: removing the focus ring is a WCAG 2.4.7 failure wherever it happens, so the tag distribution is irrelevant and all 72 are the same defect',
              'Cả 72 đều tệ như nhau: gỡ vòng focus là trượt WCAG 2.4.7 ở bất cứ đâu, nên phân bố theo loại thẻ không liên quan và cả 72 là cùng một khiếm khuyết',
            ),
            B(
              '<code>outline-none</code> is always a bug, and the real finding is that 526 uses exist at all — the 86% that "replace" it are also failures because a custom ring is not the browser default',
              '<code>outline-none</code> luôn là một con bọ, và phát hiện thật là việc TỒN TẠI tới 526 lượt dùng — 86% cái "thay thế" cũng trượt, vì một vòng tự vẽ không phải mặc định của trình duyệt',
            ),
            B(
              '58 of the 72 are <code>input</code>, <code>textarea</code>, <code>select</code> or <code>Command.Input</code> — exactly where a keyboard user must see where they are typing — so the fix should start there, with one shared focus constant',
              '58 trong 72 cái là <code>input</code>, <code>textarea</code>, <code>select</code> hoặc <code>Command.Input</code> — đúng chỗ mà người dùng bàn phím phải thấy mình đang gõ ở đâu — nên phép sửa nên bắt đầu từ đó, bằng một hằng số focus dùng chung',
            ),
            B(
              'They are false positives: a component using <code>cn()</code> can receive its focus ring from a caller, so a static grep of one string cannot conclude anything',
              'Chúng là dương tính giả: một component dùng <code>cn()</code> có thể nhận vòng focus từ người gọi, nên một phép grep tĩnh trên một chuỗi không kết luận được gì',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The percentage on its own says the team mostly does the right thing; placing the remainder is what turns it into work. A missing ring on a <code>div</code> is an eyesore, while a missing ring on an input means tabbing through a three-field form gives a keyboard user no indication of where they are at all — and 58 of the 72 are form controls. Nor is <code>outline-none</code> itself the villain: the browser default ring is a 2px frame that genuinely fights many designs, and removing it to draw a replacement matching the palette is the correct move, which 86% of the uses do. The proposed fix is one shared constant — <code>outline-none focus-visible:ring-2 focus-visible:ring-... focus-visible:ring-offset-2</code> — appended through <code>cn()</code>, with blast radius zero on the unfocused appearance, plus a regex lint rule so 72 can only fall. Worth knowing the finer distinction too: <code>focus-visible:</code> draws no ring when a mouse user clicks and does draw one when they tab, which is why it is the better default; this repo uses it 211 times against 854 plain <code>focus:</code>, and the plain form is unpolished rather than an accessibility defect.',
            'Bản thân cái tỉ lệ chỉ nói rằng đội ngũ phần lớn làm đúng; ĐỊNH VỊ phần còn lại mới biến nó thành công việc. Thiếu vòng focus trên một <code>div</code> là gai mắt, còn thiếu vòng focus trên một ô nhập nghĩa là bấm Tab qua một biểu mẫu ba trường thì người dùng bàn phím hoàn toàn không biết mình đang ở đâu — và 58 trong 72 cái là điều khiển biểu mẫu. <code>outline-none</code> tự nó cũng không phải kẻ xấu: vòng mặc định của trình duyệt là một khung 2px thật sự chỏi với nhiều thiết kế, và gỡ nó ra để vẽ một cái thay thế hợp bảng màu mới là nước đi đúng, đúng thứ mà 86% số lượt dùng đang làm. Phép sửa được đề xuất là một hằng số dùng chung — <code>outline-none focus-visible:ring-2 focus-visible:ring-... focus-visible:ring-offset-2</code> — nối vào qua <code>cn()</code>, bán kính ảnh hưởng bằng không lên diện mạo lúc chưa focus, cộng một luật lint bằng regex để con số 72 chỉ có thể giảm. Cũng nên biết chỗ phân biệt tinh hơn: <code>focus-visible:</code> không vẽ vòng khi người dùng bấm chuột và có vẽ khi họ bấm Tab, nên nó là mặc định tốt hơn; kho này dùng nó 211 lần so với 854 lần <code>focus:</code> trơn, và dạng trơn chỉ là chưa trau chuốt chứ không phải khiếm khuyết tiếp cận.',
          ),
        }),

        mcq({
          prompt: B(
            'This repository imports <code>framer-motion</code> in 34 files and calls <code>useReducedMotion()</code> in zero of them. How much of a problem is that, and why?',
            'Kho này import <code>framer-motion</code> ở 34 file và gọi <code>useReducedMotion()</code> ở KHÔNG file nào. Chuyện đó nghiêm trọng tới đâu, và vì sao?',
          ),
          options: [
            B(
              'None: framer-motion reads <code>prefers-reduced-motion</code> internally and disables animations on the user\'s behalf, which is why the hook is optional',
              'Không nghiêm trọng: framer-motion tự đọc <code>prefers-reduced-motion</code> bên trong và tắt hoạt ảnh thay cho người dùng, nên cái hook ấy là tuỳ chọn',
            ),
            B(
              'Mostly fine today — those animations are short and meaningful — but the hook only lets you CHECK and decide, so an infinitely looping <code>motion.div</code> added later would run regardless of the setting',
              'Hôm nay thì phần lớn ổn — các hoạt ảnh ấy ngắn và có ý nghĩa — nhưng cái hook chỉ cho bạn KIỂM rồi tự quyết, nên một <code>motion.div</code> lặp vô hạn thêm vào sau này sẽ chạy bất kể thiết lập ra sao',
            ),
            B(
              'Critical: WCAG 2.3.3 requires every animation to be suppressible, so 34 unguarded files is 34 conformance failures regardless of the animations\' duration',
              'Nghiêm trọng: WCAG 2.3.3 đòi mọi hoạt ảnh đều phải tắt được, nên 34 file không canh chừng là 34 lần trượt chuẩn, bất kể hoạt ảnh dài bao lâu',
            ),
            B(
              'None: the <code>@media (prefers-reduced-motion: reduce)</code> blocks in <code>globals.css</code> already suppress every animation on the page, including the JavaScript-driven ones',
              'Không nghiêm trọng: các khối <code>@media (prefers-reduced-motion: reduce)</code> trong <code>globals.css</code> đã tắt mọi hoạt ảnh trên trang, kể cả những cái do JavaScript điều khiển',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The library supplies the tool, not the policy: <code>useReducedMotion()</code> returns <code>true</code> when the user has the setting on, and it is up to you to branch on it. Nothing is disabled on your behalf, so an infinite <code>animate={{ opacity: [0, 1] }}</code> will run forever whether the preference is set or not. Today the exposure is small because these are enter/exit transitions of 150–400 ms that tell the user a modal just opened — meaningful, short motion that the standard is not aimed at. The CSS blocks do not cover it either: a <code>@media</code> rule can set <code>animation: none</code> on a class, but framer-motion drives inline styles from JavaScript on every frame, so the guard has to live in the component. That is the same shape as the mistake Chapter 5 records — enumerate every way the thing could be handled before concluding it is or is not — applied in the other direction. And it is worth being precise about the standard: 2.3.3 concerns non-essential motion triggered by interaction, so a 200 ms fade is not a failure and a 44-second drifting gradient is exactly what it exists for.',
            'Thư viện cung cấp CÔNG CỤ chứ không cung cấp CHÍNH SÁCH: <code>useReducedMotion()</code> trả <code>true</code> khi người dùng bật thiết lập ấy, còn rẽ nhánh theo nó là việc của bạn. Không gì bị tắt thay cho bạn cả, nên một <code>animate={{ opacity: [0, 1] }}</code> vô hạn sẽ chạy mãi bất kể sở thích ấy có bật hay không. Hôm nay mức phơi nhiễm nhỏ vì đây là các chuyển tiếp vào/ra dài 150–400 ms báo cho người dùng biết một hộp thoại vừa mở — chuyển động ngắn và có nghĩa, không phải thứ tiêu chuẩn nhắm tới. Các khối CSS cũng không phủ được nó: một quy tắc <code>@media</code> đặt được <code>animation: none</code> lên một cái lớp, nhưng framer-motion điều khiển style inline từ JavaScript ở từng khung hình, nên lá chắn buộc phải nằm trong component. Vẫn đúng hình dạng của sai lầm mà chương 5 ghi lại — liệt kê MỌI cách thứ đó có thể được xử lý trước khi kết luận nó đã hay chưa được xử lý — chỉ là áp theo chiều ngược. Và nên nói chính xác về tiêu chuẩn: 2.3.3 nói về chuyển động KHÔNG THIẾT YẾU do tương tác kích hoạt, nên một cú mờ dần 200 ms không phải là trượt, còn một dải màu trôi 44 giây thì đúng là thứ nó sinh ra để trị.',
          ),
        }),

        // ── Chương 10 — Sách công thức chẩn đoán ────────────────────────
        mcq({
          prompt: B(
            'The default reaction to a class that does not apply is to make it stronger — <code>!important</code>, or a longer selector. Beyond the cascade cost, what does that reflex do to the DEBUGGING?',
            'Phản ứng mặc định với một cái lớp không có tác dụng là làm nó mạnh hơn — <code>!important</code>, hoặc một selector dài hơn. Ngoài cái giá về cascade, phản xạ ấy làm gì với việc GỠ LỖI?',
          ),
          options: [
            B(
              'Nothing: the bug is fixed either way, and which of the four questions was YES is an academic distinction once the element renders correctly',
              'Không làm gì: con bọ vẫn được sửa theo cả hai đường, và câu nào trong bốn câu hỏi là CÓ chỉ là phân biệt hàn lâm một khi cái thẻ đã hiển thị đúng',
            ),
            B(
              'It stops the current bug and prevents you from learning which question was YES — so the next bug in the same area repeats, and now the fix has to route AROUND an <code>!important</code>, which usually means adding another',
              'Nó chặn con bọ hiện tại và ngăn bạn học được câu nào là CÓ — nên con bọ kế tiếp ở cùng khu vực lặp lại, và giờ phép sửa phải VÒNG QUA một <code>!important</code>, thường bằng cách thêm một cái nữa',
            ),
            B(
              'It makes the class unmergeable, because <code>tailwind-merge</code> refuses to resolve conflicts between two classes when either carries the important modifier',
              'Nó làm cái lớp không hợp nhất được, vì <code>tailwind-merge</code> từ chối phân giải xung đột giữa hai lớp khi một trong hai mang dấu quan trọng',
            ),
            B(
              'It only matters in Tailwind 3: on v4 the emitted cascade layers absorb the escalation, so the reflex is harmless there',
              'Nó chỉ quan trọng ở Tailwind 3: trên v4 các cascade layer được phát sinh sẽ hấp thụ cú leo thang ấy, nên phản xạ này vô hại ở đó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Winning the round is not the same as learning the answer. The four questions — was the rule generated, is something overriding it, does the competitor have higher specificity, and which appears later — each point at a different fix, and the escalation short-circuits the diagnosis before any of them is answered. The compounding is what kills a codebase: week 1 a rule, week 3 an <code>!important</code> "because the utility was winning", week 7 a more specific <code>!important</code> "because week 3 broke modals", week 12 nobody can predict any element\'s padding without opening DevTools. Each step is locally reasonable. Note the third option is a real but different fact — <code>twMerge("!p-8 p-2")</code> keeps both, deliberately, because the two live in different cascade origins — and the fourth is wrong in an instructive way: v4 emits genuine layers, but <code>!important</code> REVERSES layer priority, so the escalation is no gentler there.',
            'Thắng một hiệp không đồng nghĩa với học được câu trả lời. Bốn câu hỏi — quy tắc có được sinh không, có gì đang đè nó không, đối thủ có độ đặc hiệu cao hơn không, và cái nào đứng sau — mỗi câu chỉ vào một cách sửa khác nhau, mà cú leo thang thì cắt ngắn cuộc chẩn đoán trước khi câu nào được trả lời. Chính sự dồn tích mới giết một kho mã: tuần 1 một quy tắc, tuần 3 một <code>!important</code> "vì cái tiện ích đang thắng", tuần 7 một <code>!important</code> đặc hiệu hơn "vì tuần 3 làm hỏng hộp thoại", tuần 12 không ai đoán nổi padding của bất kỳ thẻ nào mà không mở DevTools. Từng bước đều hợp lý tại chỗ. Để ý phương án thứ ba là một sự thật có thật nhưng khác chuyện — <code>twMerge("!p-8 p-2")</code> giữ cả hai, một cách cố ý, vì hai cái sống ở hai cội cascade khác nhau — còn phương án thứ tư sai theo một cách đáng học: v4 có phát sinh layer thật, nhưng <code>!important</code> ĐẢO NGƯỢC thứ tự ưu tiên của layer, nên cú leo thang ở đó chẳng dịu hơn chút nào.',
          ),
        }),

        mcq({
          prompt: B(
            'A developer pastes a class into an online "is this a valid Tailwind class?" checker, which says it is valid. The class still produces no rule in their project. Why is the tool structurally unable to help?',
            'Một lập trình viên dán một cái lớp vào công cụ trực tuyến kiểu "lớp Tailwind này có hợp lệ không?", và nó báo hợp lệ. Cái lớp ấy vẫn không sinh ra quy tắc nào trong dự án của họ. Vì sao công cụ ấy về mặt cấu trúc không giúp được?',
          ),
          options: [
            B(
              'Those tools validate syntax only, and the class is syntactically fine — the failure is always in the content globs, which no tool can see',
              'Các công cụ ấy chỉ kiểm cú pháp, mà cái lớp thì đúng cú pháp — thất bại luôn nằm ở glob content, thứ không công cụ nào thấy được',
            ),
            B(
              'It runs a DEFAULT Tailwind build without YOUR config, so a class that depends on a token you declared is reported wrong — and a wrong answer from it is very hard to tell apart from a right one',
              'Nó chạy một bản dựng Tailwind MẶC ĐỊNH mà không có config CỦA BẠN, nên một cái lớp phụ thuộc vào token bạn tự khai sẽ bị báo sai — và một câu trả lời sai của nó rất khó phân biệt với một câu đúng',
            ),
            B(
              'It runs a newer Tailwind version, so v4 syntax such as the <code>mt-4!</code> suffix validates while your v3 build rejects it',
              'Nó chạy một bản Tailwind mới hơn, nên cú pháp v4 như hậu tố <code>mt-4!</code> thì hợp lệ trong khi bản dựng v3 của bạn từ chối',
            ),
            B(
              'It cannot see variants, so anything with a prefix is reported as invalid and the developer stops trusting it for the wrong reason',
              'Nó không thấy được biến thể, nên thứ gì có tiền tố cũng bị báo là không hợp lệ và lập trình viên thôi tin nó vì một lý do sai',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Whether a class exists is a question about YOUR build. <code>bg-bg-elevated/60</code> is perfectly valid if you declare <code>--bg-elevated</code> and wire it into the config — and completely dead if you do not, which is the case in this repository. A remote checker has no access to that, so it answers a question you did not ask, and its answer is indistinguishable in form from a correct one. You can lose an evening fixing something that is broken by config rather than by the class. The three checks that do answer it, in order: <code>grep -c</code> the built CSS for the exact class; if no build output is handy, generate a probe with YOUR config against a one-line HTML file; and finally paste the class onto an element in the browser and read <code>getComputedStyle</code>. The last one is unfalsifiable because it reads the stylesheet the browser actually applied — in the measured case it returned the full colour rather than 70% of it, confirming the base class applies and the opacity variant does not.',
            'Việc một cái lớp có tồn tại hay không là câu hỏi về BẢN DỰNG CỦA BẠN. <code>bg-bg-elevated/60</code> hoàn toàn hợp lệ nếu bạn khai <code>--bg-elevated</code> và nối nó vào config — và chết hẳn nếu không, đúng tình trạng của kho này. Một công cụ ở xa không tiếp cận được thứ đó, nên nó trả lời một câu hỏi bạn không hỏi, và câu trả lời của nó nhìn hình thức thì không phân biệt được với một câu đúng. Bạn có thể mất cả một buổi tối để sửa thứ hỏng vì CONFIG chứ không phải vì cái lớp. Ba phép kiểm thật sự trả lời được, theo thứ tự: <code>grep -c</code> tìm đúng cái lớp trong CSS đã dựng; nếu không sẵn đầu ra thì dựng một file thăm dò bằng chính config CỦA BẠN trên một file HTML một dòng; và cuối cùng dán cái lớp lên một thẻ trong trình duyệt rồi đọc <code>getComputedStyle</code>. Phép cuối không bác được vì nó đọc chính bảng kiểu trình duyệt đã áp — trong ca đo thật nó trả về màu ĐẦY chứ không phải 70%, xác nhận lớp nền có áp còn biến thể độ mờ thì không.',
          ),
        }),

        mcq({
          prompt: B(
            'Four classes an audit flagged. Built for real on 3.4.14, which set produces NO rule at all?' + code(
              'w-4.5          border-white/12          duration-3000          prose-invert\n' +
              'w-[18px]       border-white/[12%]       duration-1000          text-[10px]',
            ),
            'Bốn cái lớp bị một bản rà đánh dấu. Dựng thật trên 3.4.14, bộ nào KHÔNG sinh ra quy tắc nào cả?' + code(
              'w-4.5          border-white/12          duration-3000          prose-invert\n' +
              'w-[18px]       border-white/[12%]       duration-1000          text-[10px]',
            ),
          ),
          options: [
            B(
              'Only <code>prose-invert</code> — the other three are on documented scales and generate normally',
              'Chỉ <code>prose-invert</code> — ba cái kia đều nằm trên thang có tài liệu và sinh ra bình thường',
            ),
            B(
              'Only <code>w-4.5</code> and <code>prose-invert</code>: an opacity modifier and a duration accept any integer, so <code>/12</code> and <code>3000</code> are fine',
              'Chỉ <code>w-4.5</code> và <code>prose-invert</code>: bổ từ độ mờ và thời lượng nhận mọi số nguyên, nên <code>/12</code> với <code>3000</code> đều ổn',
            ),
            B(
              'All eight of the classes shown: the second row uses arbitrary syntax, which needs a safelist entry before it will generate',
              'Cả tám cái lớp hiển thị: hàng thứ hai dùng cú pháp tuỳ ý, thứ cần một mục safelist thì mới sinh ra',
            ),
            B(
              'All four of the top row — the spacing scale has no 4.5, the opacity scale steps by 5 so there is no 12, durations stop at 1000, and <code>prose-invert</code> needs an uninstalled plugin — while all four below generate correctly',
              'Cả bốn cái hàng trên — thang spacing không có 4.5, thang opacity nhảy bước 5 nên không có 12, thời lượng dừng ở 1000, và <code>prose-invert</code> cần một plugin chưa cài — còn cả bốn cái dưới thì sinh đúng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Built and grepped: the output contains <code>.w-\\[18px\\]</code>, <code>.border-white\\/10</code>, <code>.border-white\\/\\[12\\%\\]</code>, <code>.duration-1000</code> and <code>.text-\\[10px\\]</code>, and nothing at all for the top row. Read out of <code>resolveConfig</code>, the reasons are all "the key does not exist": spacing has 0.5, 1.5, 2.5 and 3.5 but stops there, so <code>w-4.5</code> and <code>h-4.5</code> silently give an icon no size at all; <code>opacity</code> runs 0, 5, 10, 15 … 100, so <code>/12</code> misses by one step and the way to write 12% is <code>border-white/[12%]</code>; <code>transitionDuration</code> ends at 1000; and <code>prose-*</code> belongs to <code>@tailwindcss/typography</code>, which this repo deliberately does not install. Four different causes, one identical symptom — nothing in the output and no error anywhere. That is what makes the audit worth running as a batch rather than reacting to each class as it is noticed, and note how near-miss the syntax errors are: <code>border-white/12</code> differs from <code>border-white/10</code> by a single digit.',
            'Dựng rồi grep: đầu ra có <code>.w-\\[18px\\]</code>, <code>.border-white\\/10</code>, <code>.border-white\\/\\[12\\%\\]</code>, <code>.duration-1000</code> và <code>.text-\\[10px\\]</code>, và tuyệt đối không có gì cho hàng trên. Đọc từ <code>resolveConfig</code> thì lý do đều là "khoá ấy không tồn tại": spacing có 0.5, 1.5, 2.5 và 3.5 rồi dừng, nên <code>w-4.5</code> với <code>h-4.5</code> âm thầm cho ra một biểu tượng không kích thước; <code>opacity</code> chạy 0, 5, 10, 15 … 100, nên <code>/12</code> hụt đúng một bước và cách viết 12% là <code>border-white/[12%]</code>; <code>transitionDuration</code> dừng ở 1000; còn <code>prose-*</code> thuộc về <code>@tailwindcss/typography</code>, thứ kho này CỐ Ý không cài. Bốn nguyên nhân khác nhau, một triệu chứng y hệt — không có gì trong đầu ra và không lỗi ở đâu cả. Đó là thứ làm cho bản rà đáng chạy theo LÔ thay vì phản ứng với từng cái lớp lúc tình cờ để ý, và hãy nhìn xem mấy lỗi cú pháp sát sạt tới mức nào: <code>border-white/12</code> khác <code>border-white/10</code> đúng một chữ số.',
          ),
        }),

        mcq({
          prompt: B(
            'An element\'s computed <code>margin-top</code> is not what you expected, and the DevTools Styles panel strikes NOTHING through. What does that tell you?',
            '<code>margin-top</code> tính ra của một thẻ không như bạn nghĩ, và bảng Styles của DevTools KHÔNG gạch ngang cái nào cả. Điều đó nói gì?',
          ),
          options: [
            B(
              'No rule is winning because none matched: the property is INHERITED from a parent, or it is the browser default, and the fix is to set it explicitly on the element',
              'Không quy tắc nào thắng vì chẳng cái nào khớp: thuộc tính ấy được KẾ THỪA từ thẻ cha, hoặc là mặc định của trình duyệt, và cách sửa là đặt nó tường minh lên chính thẻ đó',
            ),
            B(
              'Exactly one rule matched and won cleanly, so the value you see is the one you wrote and the surprise is in your expectation rather than in the cascade',
              'Đúng một quy tắc khớp và thắng gọn, nên giá trị bạn thấy chính là giá trị bạn viết và điều bất ngờ nằm ở kỳ vọng của bạn chứ không ở cascade',
            ),
            B(
              'DevTools only strikes through rules from the same stylesheet, so a conflict between a Tailwind rule and a hand-written one is never shown that way',
              'DevTools chỉ gạch ngang các quy tắc trong cùng một bảng kiểu, nên xung đột giữa một quy tắc Tailwind và một quy tắc viết tay không bao giờ hiện ra kiểu đó',
            ),
            B(
              'The rule was never generated, which is the only state in which the panel has nothing to strike through',
              'Quy tắc chưa từng được sinh ra, và đó là trạng thái duy nhất mà bảng Styles không có gì để gạch',
            ),
          ],
          correct: 0,
          explanation: EX(
            'A strikethrough means "this declaration matched and lost". No strikethrough anywhere, combined with a computed value you did not ask for, means nothing matched at all — so the value arrived by inheritance or as a browser default. <code>color</code> and <code>font-family</code> inherit, so this is the common shape for text colour surprises. Note the fourth option is a real state too, but it produces a different display: an ungenerated class shows on the element in the Elements panel with no corresponding rule in Styles, whereas an inherited value typically appears in the Computed panel with the parent named as its source. That is the distinction worth learning, because it separates a Q1 failure (write the class differently, or declare the token) from an inheritance question (set the property explicitly). And it is exactly why the Styles panel beats the Computed panel for diagnosis: Computed gives you the number that applied but never tells you WHO applied it, so you cannot tell a utility from a hand-written rule from a default.',
            'Một dấu gạch ngang nghĩa là "khai báo này có khớp và đã thua". Không có dấu gạch nào ở đâu cả, cộng với một giá trị tính ra mà bạn không hề yêu cầu, nghĩa là chẳng có gì khớp — nên giá trị ấy tới bằng kế thừa hoặc là mặc định của trình duyệt. <code>color</code> và <code>font-family</code> thì kế thừa, nên đây là hình dạng phổ biến của những bất ngờ về màu chữ. Để ý phương án thứ tư cũng là một trạng thái có thật, nhưng nó hiện ra khác: một cái lớp chưa được sinh thì vẫn hiện trên thẻ ở bảng Elements mà không có quy tắc tương ứng nào trong Styles, còn một giá trị kế thừa thì thường hiện ở bảng Computed kèm tên thẻ cha làm nguồn. Đó là chỗ phân biệt đáng học, vì nó tách một thất bại Q1 (viết lại cái lớp, hoặc khai cái token) khỏi một câu hỏi về kế thừa (đặt thuộc tính tường minh). Và đó cũng đúng là lý do bảng Styles hơn bảng Computed khi chẩn đoán: Computed cho bạn con số đã áp nhưng không bao giờ nói AI đã áp nó, nên bạn không phân biệt được một tiện ích với một quy tắc viết tay với một giá trị mặc định.',
          ),
        }),

        mcq({
          prompt: B(
            'The Styles panel lists the losers of the eleven-way <code>mt-*</code> collision in this order, which is not the order they were written. What ordering is it, and why is that useful?' + code(
              'written:  mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32\n' +
              'panel  :  mt-8  (winner, no strikethrough)\n' +
              '          mt-1 mt-10 mt-12 mt-16 mt-2 mt-20 mt-24 mt-3 mt-32 mt-4',
            ),
            'Bảng Styles liệt kê những kẻ thua trong cuộc đụng độ mười một chiều của <code>mt-*</code> theo thứ tự này, và đó không phải thứ tự chúng được viết. Đó là thứ tự nào, và vì sao nó hữu ích?' + code(
              'viết  :  mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32\n' +
              'bảng  :  mt-8  (kẻ thắng, không gạch)\n' +
              '          mt-1 mt-10 mt-12 mt-16 mt-2 mt-20 mt-24 mt-3 mt-32 mt-4',
            ),
          ),
          options: [
            B(
              'Alphabetical by class name, which the browser applies for display only — the actual cascade order is the written order and is not shown anywhere',
              'Theo bảng chữ cái của tên lớp, thứ trình duyệt chỉ dùng để HIỂN THỊ — thứ tự cascade thật là thứ tự viết và không hiện ở đâu cả',
            ),
            B(
              'It is the order the rules appear in the GENERATED CSS, so the panel is showing you Tailwind\'s string sort directly — and the winner is simply the last of them, which is why reading the panel beats reasoning about it',
              'Đó là thứ tự các quy tắc xuất hiện trong CSS ĐÃ PHÁT SINH, nên bảng ấy đang cho bạn xem thẳng phép sắp theo chuỗi của Tailwind — và kẻ thắng đơn giản là cái cuối cùng trong số đó, nên ĐỌC bảng nhanh hơn SUY LUẬN về bảng',
            ),
            B(
              'It is descending by specificity, which is why the winner is at the top and the rest follow in decreasing weight',
              'Đó là thứ tự giảm dần theo độ đặc hiệu, và vì thế kẻ thắng nằm trên cùng còn phần còn lại theo sau với trọng lượng giảm dần',
            ),
            B(
              'It is the DOM order of the elements the rules match, which is meaningless here because all eleven match the same element',
              'Đó là thứ tự DOM của các thẻ mà các quy tắc khớp tới, thứ vô nghĩa ở đây vì cả mười một cái đều khớp cùng một thẻ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The panel is ordered by outcome — the winner at the top without a strikethrough, then the losers in the order they appear in the stylesheet. Read the loser list and you are reading Tailwind\'s emit order for that group: 1, 10, 12, 16, 2, 20, 24, 3, 32, 4, and then <code>mt-8</code> which was hoisted to the top because it won. That is a plain string sort, so "8" lands last among those eleven and takes the tie at equal specificity. Specificity is not the ordering here — all eleven are single-class selectors at 0,1,0, which is exactly why the tie fell through to position. The practical value is that the browser has already run the cascade algorithm for you: the answer is at the top, and you need no model of the sort to use it. Knowing the sort only explains WHY, which matters when you are reading a diff rather than an element — two utilities of the same property at the same scope is a bug to remove, not an override to preserve.',
            'Bảng ấy được sắp theo KẾT QUẢ — kẻ thắng ở trên cùng không bị gạch, rồi tới những kẻ thua theo thứ tự chúng xuất hiện trong bảng kiểu. Đọc danh sách kẻ thua là bạn đang đọc thẳng thứ tự phát sinh của Tailwind cho nhóm ấy: 1, 10, 12, 16, 2, 20, 24, 3, 32, 4, rồi <code>mt-8</code> bị nhấc lên đầu vì nó thắng. Đó là một phép sắp chuỗi thuần, nên "8" rơi xuống cuối trong mười một cái ấy và ăn phần thắng ở thế hoà độ đặc hiệu. Độ đặc hiệu không phải thứ tự ở đây — cả mười một đều là selector một lớp ở mức 0,1,0, và chính vì thế thế hoà mới rơi xuống VỊ TRÍ. Giá trị thực dụng là trình duyệt đã chạy sẵn thuật toán cascade cho bạn: câu trả lời nằm ở trên cùng, và bạn không cần mô hình nào về phép sắp để dùng nó. Biết phép sắp chỉ giải thích VÌ SAO, và điều đó quan trọng khi bạn đang đọc một bản diff chứ không phải một cái thẻ — hai tiện ích cùng thuộc tính ở cùng phạm vi là một con bọ cần bỏ đi chứ không phải một phép ghi đè cần giữ.',
          ),
        }),

        mcq({
          prompt: B(
            'Four ways to break a cascade tie, ordered by cost: reorder the source, wrap in <code>@layer</code>, raise the specificity, then <code>!important</code>. Which situation is the ONE legitimate case for the fourth?',
            'Bốn cách phá thế hoà trong cascade, xếp theo giá: sắp lại nguồn, bọc <code>@layer</code>, nâng độ đặc hiệu, rồi <code>!important</code>. Tình huống nào là ca chính đáng DUY NHẤT cho cách thứ tư?',
          ),
          options: [
            B(
              'A hand-written descendant selector at 0,2,1 beating your utility, because raising a utility\'s specificity is impossible and the bang is the only tool left',
              'Một selector con cháu viết tay ở mức 0,2,1 đang thắng tiện ích của bạn, vì không thể nâng độ đặc hiệu của một tiện ích và dấu chấm than là công cụ duy nhất còn lại',
            ),
            B(
              'Two utilities of the same property in one string, because the emit order is not something you can change and the bang settles it deterministically',
              'Hai tiện ích cùng thuộc tính trong một chuỗi, vì thứ tự phát sinh không phải thứ bạn đổi được và dấu chấm than phân định nó một cách xác định',
            ),
            B(
              'Any rule inside <code>@layer base</code>, since the base band is emitted first and nothing else can be placed before it',
              'Bất kỳ quy tắc nào trong <code>@layer base</code>, vì dải base được sinh trước tiên và không gì khác đặt trước nó được',
            ),
            B(
              'A third-party component setting an INLINE style from JavaScript, because inline styles beat every normal rule and you cannot edit the losing side',
              'Một component của bên thứ ba đặt style INLINE từ JavaScript, vì style inline thắng mọi quy tắc thường mà bạn lại không sửa được phía đang thua',
            ),
          ],
          correct: 3,
          explanation: EX(
            'An inline style is a higher cascade origin than any normal declaration, so no selector, no layer and no reordering can beat it — and <code>!important</code> in a stylesheet is the only thing that can. That is the textbook case the feature exists for, and it fits the precondition the ladder states: you do not own the losing side. The other three all have cheaper fixes. Two utilities in one string is a merge problem, and <code>cn()</code> costs nothing. A 0,2,1 descendant selector beating your utility is not a tie at all, so the bang would be treating a specificity loss as an ordering problem — the honest options are adding a class to the element, scoping the utility with an arbitrary variant such as <code>[&amp;_h2]:text-3xl</code>, or accepting that the region owns its headings. And a rule in <code>@layer base</code> is the easiest thing in the file to override, not the hardest. Measured on this repository\'s 620 hand-written <code>.rich-content</code> rules, only 40 sit at 0,1,0 where a utility could ever tie — 6.5% — so "override rich-content with a utility" is the wrong model 93.5% of the time, and no amount of escalation makes it the right one.',
            'Một style inline nằm ở cội cascade cao hơn mọi khai báo thường, nên không selector nào, không layer nào và không phép sắp lại nào thắng nổi nó — và <code>!important</code> trong một bảng kiểu là thứ duy nhất làm được. Đó đúng là ca sách giáo khoa mà tính năng ấy sinh ra để phục vụ, và nó khớp điều kiện tiên quyết mà cái thang nêu ra: bạn KHÔNG sở hữu phía đang thua. Ba cái kia đều có cách sửa rẻ hơn. Hai tiện ích trong một chuỗi là vấn đề hợp nhất, và <code>cn()</code> chẳng tốn gì. Một selector con cháu 0,2,1 thắng tiện ích của bạn thì hoàn toàn không phải thế hoà, nên dấu chấm than là đang xử một thất bại về ĐỘ ĐẶC HIỆU như thể một vấn đề về THỨ TỰ — lựa chọn trung thực là thêm một lớp vào thẻ, bó tiện ích lại bằng một biến thể tuỳ ý như <code>[&amp;_h2]:text-3xl</code>, hoặc chấp nhận rằng cái vùng ấy sở hữu các tiêu đề của nó. Còn một quy tắc trong <code>@layer base</code> là thứ dễ ghi đè nhất trong file chứ không phải khó nhất. Đo trên 620 quy tắc <code>.rich-content</code> viết tay của kho này, chỉ 40 cái nằm ở mức 0,1,0 nơi một tiện ích có cơ hoà — 6,5% — nên "ghi đè rich-content bằng một tiện ích" là mô hình SAI trong 93,5% trường hợp, và leo thang bao nhiêu cũng không làm nó thành đúng.',
          ),
        }),

        mcq({
          prompt: B(
            'Specificity distribution of the 620 hand-written <code>.rich-content</code> rules. What does the shape license?' + code(
              '0,1,0  (one class)                 40\n' +
              '0,2,0  (two classes, or class+attr) 87\n' +
              '0,1,1  (class + element)           128\n' +
              '0,2,1  (descendant + element)      232\n' +
              'higher                             133',
            ),
            'Phân bố độ đặc hiệu của 620 quy tắc <code>.rich-content</code> viết tay. Hình dạng ấy cho phép làm gì?' + code(
              '0,1,0  (một lớp)                    40\n' +
              '0,2,0  (hai lớp, hoặc lớp+thuộc tính) 87\n' +
              '0,1,1  (lớp + phần tử)              128\n' +
              '0,2,1  (con cháu + phần tử)         232\n' +
              'cao hơn                             133',
            ),
          ),
          options: [
            B(
              'Nothing yet: specificity says who wins a tie, and a tie only exists once you know both rules set the same property, which this table does not record',
              'Chưa cho phép gì: độ đặc hiệu nói ai thắng khi hoà, mà thế hoà chỉ tồn tại khi đã biết hai quy tắc cùng đặt một thuộc tính, điều bảng này không ghi lại',
            ),
            B(
              'That the block should be wrapped in <code>@layer components</code>: 580 of the 620 out-specify a utility, and layering is what lowers a rule below the utilities band',
              'Rằng cả khối nên được bọc trong <code>@layer components</code>: 580 trên 620 cái đặc hiệu hơn một tiện ích, và bọc layer là thứ hạ một quy tắc xuống dưới dải utilities',
            ),
            B(
              'That only 40 rules — 6.5% — can ever be tied by a single-class utility, so "override this with a utility" is the wrong model for the other 93.5%, and the right move is to fix the rules or use a wrapper without <code>.rich-content</code>',
              'Rằng chỉ 40 quy tắc — 6,5% — mới có thể bị một tiện ích một-lớp hoà, nên "ghi đè cái này bằng một tiện ích" là mô hình SAI với 93,5% còn lại, và nước đi đúng là sửa chính các quy tắc ấy hoặc dùng một khung bọc không có <code>.rich-content</code>',
            ),
            B(
              'That the 133 rules above 0,2,1 are the problem and should be flattened, since anything beyond two classes is a code smell regardless of what it styles',
              'Rằng 133 quy tắc trên mức 0,2,1 mới là vấn đề và nên được làm phẳng, vì bất cứ thứ gì quá hai lớp đều là mùi mã tệ bất kể nó tạo kiểu cho cái gì',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A utility is a single class at 0,1,0, so it can only ever TIE with the 40, and a tie is the only situation where source order or a layer decides anything. Against the other 580 the utility loses outright from anywhere in the file, which means reordering, layering and escalating are all beside the point. And the high specificity is not a defect here: <code>.rich-content</code> styles class-less HTML produced by the TipTap editor, so descendant selectors are the only way to reach those elements at all — Preflight stripped their heading sizes and list markers in the first place, and these 135-odd rules are what puts the styling back. The second option gets the mechanism backwards: layering does not change specificity, so wrapping a 0,2,1 rule in <code>@layer components</code> leaves it beating utilities exactly as before. The first option is a fair objection to a raw count in general, but the table is already scoped to the rules a utility might compete with, and the conclusion it supports is about which fix to reach for rather than about how many conflicts exist.',
            'Một tiện ích là một lớp đơn ở mức 0,1,0, nên nó chỉ có thể HOÀ với 40 cái kia, mà thế hoà lại là tình huống DUY NHẤT để thứ tự nguồn hay một cái layer quyết định được điều gì. Trước 580 cái còn lại thì tiện ích thua dứt điểm từ bất kỳ đâu trong file, nghĩa là sắp lại, bọc layer và leo thang đều lạc đề. Và độ đặc hiệu cao ở đây không phải khiếm khuyết: <code>.rich-content</code> tạo kiểu cho HTML không lớp do trình soạn TipTap sinh ra, nên selector con cháu là cách DUY NHẤT với tới được những thẻ ấy — chính Preflight đã lột mất cỡ tiêu đề và dấu đầu dòng của chúng ngay từ đầu, và khoảng 135 quy tắc này là thứ trả kiểu dáng về. Phương án thứ hai hiểu ngược cơ chế: bọc layer không đổi độ đặc hiệu, nên gói một quy tắc 0,2,1 vào <code>@layer components</code> thì nó vẫn thắng tiện ích y như trước. Phương án đầu là một phản đối công bằng với một phép đếm thô nói chung, nhưng cái bảng này đã được bó vào đúng những quy tắc mà một tiện ích có thể tranh chấp, và kết luận nó chống đỡ là về việc NÊN VỚI TỚI cách sửa nào chứ không phải về việc có bao nhiêu xung đột.',
          ),
        }),

        mcq({
          prompt: B(
            'A component builds its class string with <code>cva()</code> and applies it directly. A caller passes <code>className="p-8"</code> to override the size variant\'s <code>px-3 py-2</code> and it does not take effect. Why?' + code(
              "const button = cva('inline-flex items-center rounded-md', {\n" +
              "  variants: { size: { sm: 'px-2 py-1', md: 'px-3 py-2' } },\n" +
              '});\n' +
              '\n' +
              '<button className={button({ size })} {...props} />',
            ),
            'Một component dựng chuỗi lớp của nó bằng <code>cva()</code> rồi áp thẳng. Người gọi truyền <code>className="p-8"</code> để ghi đè <code>px-3 py-2</code> của biến thể cỡ, và nó không ăn. Vì sao?' + code(
              "const button = cva('inline-flex items-center rounded-md', {\n" +
              "  variants: { size: { sm: 'px-2 py-1', md: 'px-3 py-2' } },\n" +
              '});\n' +
              '\n' +
              '<button className={button({ size })} {...props} />',
            ),
          ),
          options: [
            B(
              'The caller\'s class never reaches the element at all: <code>cva()</code> returns a fixed string, and the spread cannot add to a <code>className</code> the component already set',
              'Lớp của người gọi hoàn toàn không tới được cái thẻ: <code>cva()</code> trả về một chuỗi cố định, và phép trải không thêm được vào một <code>className</code> mà component đã đặt',
            ),
            B(
              '<code>cva()</code> does NOT run <code>twMerge</code> by default — the call has to be <code>cn(button({ size }), className)</code>, and without it both classes are emitted and emit order picks the winner instead of the caller',
              '<code>cva()</code> KHÔNG tự chạy <code>twMerge</code> — lời gọi phải là <code>cn(button({ size }), className)</code>, và thiếu nó thì cả hai lớp cùng được sinh và THỨ TỰ PHÁT SINH chọn kẻ thắng thay cho người gọi',
            ),
            B(
              'Compound variants are missing, so <code>cva()</code> falls back to the base string and drops both the size variant and anything the caller passes',
              'Thiếu compound variant nên <code>cva()</code> lùi về chuỗi nền và bỏ cả biến thể cỡ lẫn mọi thứ người gọi truyền vào',
            ),
            B(
              '<code>p-8</code> and <code>px-3 py-2</code> do not conflict, because the axis utilities are narrower and are always emitted after the whole-box one',
              '<code>p-8</code> và <code>px-3 py-2</code> không xung đột, vì tiện ích theo trục hẹp hơn và luôn được sinh sau tiện ích toàn hộp',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The library\'s own documentation says it in the middle of a page that is easy to skim past: cva performs no Tailwind-specific merging. It SELECTS a string from the variant matrix; resolving conflicts inside that string is a separate job, and <code>twMerge</code> is what does it. Without the wrapper, both <code>px-3 py-2</code> and <code>p-8</code> reach the element and the winner is decided by emit order — <code>.p-8</code> is emitted before <code>.px-3</code>, so the horizontal padding stays at the component\'s value and only the vertical changes. That is worse than a clean failure, because it half-works and looks like a rendering glitch. Two things follow. The complete call is <code>cn(button({ size }), className)</code>: cva selects, twMerge resolves, and the caller\'s class is still last so it still wins. And this is one of three patterns AI code generators reproduce from public samples — alongside splitting class names across a template literal, which is a Q1 failure no merge can rescue, and variant objects applied without <code>cn()</code>. The durable fix is a lint rule at commit time, not an instruction in a system prompt that the model forgets by the third reply.',
            'Tài liệu của chính thư viện nói điều đó ở giữa một trang rất dễ lướt qua: cva KHÔNG thực hiện phép hợp nhất riêng của Tailwind. Nó CHỌN một chuỗi từ ma trận biến thể; phân giải xung đột bên trong chuỗi ấy là việc khác, và <code>twMerge</code> mới là thứ làm việc đó. Thiếu lớp bọc thì cả <code>px-3 py-2</code> lẫn <code>p-8</code> đều tới cái thẻ và kẻ thắng do THỨ TỰ PHÁT SINH quyết — <code>.p-8</code> được sinh TRƯỚC <code>.px-3</code>, nên padding ngang giữ nguyên giá trị của component còn chỉ padding dọc đổi. Thế còn tệ hơn hỏng hẳn, vì nó chạy được một nửa và trông như một trục trặc hiển thị. Hai điều rút ra. Lời gọi đầy đủ là <code>cn(button({ size }), className)</code>: cva chọn, twMerge phân giải, và lớp của người gọi vẫn đứng sau nên vẫn thắng. Và đây là một trong ba khuôn mẫu mà các bộ sinh mã AI chép lại từ ví dụ công khai — cùng với việc chẻ tên lớp ngang một chuỗi mẫu, vốn là thất bại Q1 mà không phép hợp nhất nào cứu được, và những object biến thể áp mà không qua <code>cn()</code>. Cách sửa bền là một luật lint ở thời điểm commit, chứ không phải một câu dặn trong system prompt mà mô hình quên mất từ lượt trả lời thứ ba.',
          ),
        }),

        // ── Chương 11 — Điều gì sống sót qua phép đo ────────────────────
        mcq({
          prompt: B(
            'The course sorts its findings into three columns: A = always true of Tailwind, B = true of THIS repository once measured, C = intuitions that lost to measurement. Which pair is filed correctly?',
            'Giáo trình xếp các phát hiện của nó vào ba cột: A = luôn đúng với Tailwind, B = đúng với CHÍNH kho này sau khi đo, C = những trực giác đã thua phép đo. Cặp nào được xếp đúng?',
          ),
          options: [
            B(
              'A: "CSS variables inherit and utilities do not". B: "3,664 rules, 45 KB gzipped, 91 dead opacity classes" — the first holds in any project, the second is this codebase and must be re-measured on yours',
              'A: "biến CSS kế thừa còn tiện ích thì không". B: "3.664 quy tắc, 45 KB gzip, 91 lớp độ mờ chết" — cái đầu đúng ở mọi dự án, cái sau là của riêng kho này và phải đo lại trên kho của bạn',
            ),
            B(
              'A: "3,664 rules and 45 KB gzipped". B: "Tailwind sorts utilities as strings". Both are stable facts about the tool once you have measured them once',
              'A: "3.664 quy tắc và 45 KB gzip". B: "Tailwind sắp tiện ích theo chuỗi". Cả hai đều là sự thật ổn định về công cụ một khi bạn đã đo một lần',
            ),
            B(
              'A: "the class written last wins". C: "Tailwind 3 strips <code>@layer</code> from the output" — the first is the documented behaviour and the second is a widely believed myth',
              'A: "lớp viết cuối thì thắng". C: "Tailwind 3 xoá <code>@layer</code> khỏi đầu ra" — cái đầu là hành vi có tài liệu còn cái sau là một huyền thoại nhiều người tin',
            ),
            B(
              'C: "<code>outline-none</code> is always a bug". A: "76.3% of dynamic strings bypass twMerge" — the first is a myth and the second is a law of the ecosystem',
              'C: "<code>outline-none</code> luôn là một con bọ". A: "76,3% chuỗi động bỏ qua twMerge" — cái đầu là huyền thoại còn cái sau là một quy luật của hệ sinh thái',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The split is about what transfers. Column A holds wherever Tailwind 3 is the tool: it is a generator that emits only what it found; it sorts utilities as strings so <code>mt-8</code> beats <code>mt-32</code>; layers never change specificity; version 3 strips <code>@layer</code> from the output; custom properties inherit and utilities do not; and <code>@apply</code> copies declarations rather than sharing them. Column B is arithmetic about one codebase — file counts, byte counts, rule counts, the 91 dead opacity classes, a <code>--text-muted</code> that holds one hex in both themes — and every line of it needs re-running on yours. The traps in the wrong options are worth naming: "the class written last wins" is column C (it is false — <code>text-red-500 text-blue-500</code> renders RED, because "b" sorts before "r" so the red rule is emitted later); "<code>outline-none</code> is always a bug" is also column C but false in the other direction, since 86% of its uses here do draw a replacement ring; and 76.3% is plainly a measurement of one repo, not a law.',
            'Ranh giới nằm ở chỗ điều gì CHUYỂN được sang nơi khác. Cột A đúng ở bất cứ đâu dùng Tailwind 3: nó là một trình sinh chỉ phát ra thứ nó tìm thấy; nó sắp tiện ích theo chuỗi nên <code>mt-8</code> thắng <code>mt-32</code>; layer không bao giờ đổi độ đặc hiệu; bản 3 xoá <code>@layer</code> khỏi đầu ra; thuộc tính tuỳ chỉnh thì kế thừa còn tiện ích thì không; và <code>@apply</code> CHÉP khai báo chứ không chia sẻ. Cột B là số học về MỘT kho mã — số file, số byte, số quy tắc, 91 lớp độ mờ chết, một <code>--text-muted</code> giữ một mã hex ở cả hai theme — và từng dòng của nó cần chạy lại trên kho của bạn. Các cái bẫy trong những phương án sai đáng gọi tên: "lớp viết cuối thì thắng" thuộc cột C (nó SAI — <code>text-red-500 text-blue-500</code> hiển thị màu ĐỎ, vì "b" sắp trước "r" nên quy tắc đỏ được sinh sau); "<code>outline-none</code> luôn là con bọ" cũng thuộc cột C nhưng sai theo chiều ngược, vì 86% số lượt dùng ở đây CÓ vẽ vòng thay thế; còn 76,3% thì rõ ràng là phép đo của một kho chứ không phải một quy luật.',
          ),
        }),

        mcq({
          prompt: B(
            'An element carries both. Which colour renders, and what general rule does it illustrate?' + code(
              '<span class="text-red-500 text-blue-500">…</span>',
            ),
            'Một thẻ mang cả hai lớp. Màu nào hiển thị, và nó minh hoạ quy luật chung nào?' + code(
              '<span class="text-red-500 text-blue-500">…</span>',
            ),
          ),
          options: [
            B(
              'Blue, because the class written last wins — the class attribute is read left to right and the browser applies the tokens in that order',
              'Xanh lam, vì lớp viết cuối thì thắng — thuộc tính lớp được đọc từ trái sang phải và trình duyệt áp các mẩu theo thứ tự ấy',
            ),
            B(
              'Neither: two colour utilities on one element cancel each other out and the text inherits its parent colour, which is why the linter flags the pair',
              'Không màu nào: hai tiện ích màu trên một thẻ triệt tiêu nhau và chữ thừa hưởng màu của thẻ cha, và vì thế bộ lint đánh dấu cặp này',
            ),
            B(
              'Blue, because <code>blue</code> is later in Tailwind\'s palette ordering — colour families are emitted in the order they appear in the default config',
              'Xanh lam, vì <code>blue</code> đứng sau trong thứ tự bảng màu của Tailwind — các họ màu được sinh theo thứ tự chúng xuất hiện trong config mặc định',
            ),
            B(
              'RED, because the group is sorted as a STRING and "b" sorts before "r", so <code>.text-red-500</code> is emitted later — the one written FIRST wins here, which is the exact opposite of the intuition',
              'ĐỎ, vì cả nhóm được sắp theo CHUỖI và "b" sắp trước "r", nên <code>.text-red-500</code> được sinh MUỘN hơn — cái viết TRƯỚC lại thắng ở đây, đúng ngược với trực giác',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the cleanest demonstration in the course that written order carries no information at all. The class attribute is an unordered SET of references, and the two rules tie at 0,1,0 specificity, so the cascade falls through to position in the STYLESHEET — which is Tailwind\'s sort, and that sort is lexicographic on the class name. <code>.text-blue-500</code> comes before <code>.text-red-500</code> because "b" < "r", so the red rule is emitted later and wins. Swap the two in the markup and the output file is byte-identical; the element still renders red. Note the third option is wrong for an instructive reason — the emit order comes from a string sort, not from the order families appear in the config, which is why adding a custom colour can change which of two existing classes wins. The usable conclusion is the one Chapter 3 states: two utilities setting the same property at the same scope is a BUG to remove, not an override to preserve — and if the string is composed at runtime, <code>cn()</code> restores last-written-wins.',
            'Đây là minh hoạ sạch nhất trong cả khoá cho việc thứ tự VIẾT không mang thông tin nào cả. Thuộc tính lớp là một TẬP tham chiếu không thứ tự, và hai quy tắc hoà nhau ở độ đặc hiệu 0,1,0, nên cascade rơi xuống VỊ TRÍ trong BẢNG KIỂU — tức là phép sắp của Tailwind, mà phép sắp ấy là theo từ điển trên tên lớp. <code>.text-blue-500</code> đứng trước <code>.text-red-500</code> vì "b" < "r", nên quy tắc đỏ được sinh sau và thắng. Đổi chỗ hai cái trong mã đánh dấu thì file đầu ra giống hệt từng byte; cái thẻ vẫn hiển thị màu đỏ. Để ý phương án thứ ba sai theo một cách đáng học — thứ tự phát sinh đến từ một phép sắp CHUỖI chứ không từ thứ tự các họ màu xuất hiện trong config, và vì thế thêm một màu tuỳ biến CÓ THỂ đổi kẻ thắng giữa hai lớp đang có. Kết luận dùng được vẫn là điều chương 3 nói: hai tiện ích cùng đặt một thuộc tính ở cùng phạm vi là một CON BỌ cần bỏ chứ không phải một phép ghi đè cần giữ — và nếu chuỗi được ghép lúc chạy thì <code>cn()</code> trả lại luật viết-cuối-thắng.',
          ),
        }),

        mcq({
          prompt: B(
            'One of the course\'s own measurement errors: the three <code>@layer</code> blocks in <code>globals.css</code> were first reported as spanning 4,143 lines instead of 219, an error of 18.9×. What produced it, and what is the rule?',
            'Một trong những sai lầm ĐO ĐẠC của chính giáo trình: ba khối <code>@layer</code> trong <code>globals.css</code> lúc đầu bị báo là trải 4.143 dòng thay vì 219, sai 18,9 lần. Cái gì gây ra nó, và luật rút ra là gì?',
          ),
          options: [
            B(
              'The file was read before the build, so nested at-rules had not been flattened yet — always measure the artefact rather than the input',
              'File được đọc trước khi dựng nên các at-rule lồng nhau chưa được làm phẳng — luôn đo hiện vật chứ đừng đo đầu vào',
            ),
            B(
              'Line endings: the file uses CRLF, so a naive line count double-counts — always normalise newlines before counting anything',
              'Ký tự xuống dòng: file dùng CRLF nên phép đếm dòng ngây thơ đếm đôi — luôn chuẩn hoá xuống dòng trước khi đếm bất cứ thứ gì',
            ),
            B(
              'Comments were counted as code, and the file is heavily commented — always strip comments before measuring a structural property',
              'Chú thích bị đếm như mã, mà file thì nhiều chú thích — luôn bỏ chú thích trước khi đo một tính chất cấu trúc',
            ),
            B(
              'The distance between consecutive <code>@layer</code> markers was taken as each block\'s length, and the last one was assumed to run to the end of the file — measuring a nested structure means MATCHING BRACES, not counting lines',
              'Khoảng cách giữa hai dấu <code>@layer</code> liên tiếp bị lấy làm độ dài mỗi khối, và khối cuối bị giả định là chạy tới hết file — đo một cấu trúc LỒNG NHAU nghĩa là KHỚP NGOẶC, không phải đếm dòng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Marker-to-marker distance is only the block length if the blocks are adjacent and nothing sits between them, and in a 5,974-line stylesheet with roughly 630 unlayered rules that assumption is badly wrong — most of the file is BETWEEN the layers rather than inside them. Assuming the final block runs to EOF then swallows everything after it. The correct method is to walk forward from the opening brace tracking depth, incrementing on <code>{</code> and decrementing on <code>}</code>, and stop at zero. This is the same technique the reduced-motion audit used to read the <code>@media</code> blocks correctly, and it is worth internalising because line arithmetic feels precise and gives no warning when it is wrong. The course keeps three such errors in the record on purpose — this one, a <code>grep</code> whose escaped brackets inside a character class silently matched nothing, and an audit that checked one of two possible guarding mechanisms — because each is a common trap and knowing how the stumble happens is what stops it recurring.',
            'Khoảng cách giữa hai dấu chỉ bằng độ dài khối khi các khối nằm liền nhau và không có gì chen giữa, mà trong một bảng kiểu 5.974 dòng với khoảng 630 quy tắc ngoài layer thì giả định ấy sai nặng — phần lớn cái file nằm GIỮA các layer chứ không nằm trong chúng. Rồi giả định khối cuối chạy tới hết file thì nuốt luôn mọi thứ phía sau. Phương pháp đúng là đi tới từ dấu ngoặc mở mà đếm ĐỘ SÂU, tăng khi gặp <code>{</code> và giảm khi gặp <code>}</code>, dừng ở 0. Vẫn đúng kỹ thuật mà bản rà giảm-chuyển-động đã dùng để đọc các khối <code>@media</code> cho đúng, và nó đáng thuộc nằm lòng vì phép tính theo dòng có cảm giác chính xác mà lại không cảnh báo gì khi nó sai. Giáo trình CỐ Ý giữ lại ba sai lầm loại này — cái này, một lệnh <code>grep</code> mà dấu ngoặc vuông thoát bên trong lớp ký tự làm nó âm thầm không khớp gì, và một bản rà chỉ kiểm một trong hai cơ chế canh chừng có thể có — vì mỗi cái là một cái bẫy phổ biến, và biết cú vấp xảy ra thế nào mới là thứ ngăn nó lặp lại.',
          ),
        }),

        mcq({
          prompt: B(
            'A grep for <code>dark:</code> usages returned 0 against a known baseline of 786. What made the error catchable, and what is the general rule?' + code(
              "$ grep -o 'dark:[a-z0-9/\\[\\]#.-]*' src -r --include=\"*.tsx\" | wc -l\n" +
              '0',
            ),
            'Một lệnh grep tìm các lượt dùng <code>dark:</code> trả về 0 trong khi đường cơ sở đã biết là 786. Điều gì làm cho sai lầm ấy bắt được, và luật chung là gì?' + code(
              "$ grep -o 'dark:[a-z0-9/\\[\\]#.-]*' src -r --include=\"*.tsx\" | wc -l\n" +
              '0',
            ),
          ),
          options: [
            B(
              'The <code>--include</code> filter excluded the files that use the variant, so widening the glob is the fix and the lesson is to check what a search actually scanned',
              'Bộ lọc <code>--include</code> đã loại đúng những file dùng biến thể ấy, nên nới glob là cách sửa và bài học là kiểm xem một phép tìm thật sự đã quét những gì',
            ),
            B(
              'Nothing made it catchable: a zero is a legitimate result, and the only defence is to run every measurement twice with two different tools',
              'Không gì làm nó bắt được cả: số không là một kết quả chính đáng, và phòng thủ duy nhất là chạy mọi phép đo hai lần bằng hai công cụ khác nhau',
            ),
            B(
              'The variant only exists inside the Notes region, so a repo-wide grep correctly returns 0 and the baseline of 786 was the wrong number',
              'Biến thể ấy chỉ tồn tại trong vùng Notes, nên grep toàn kho trả 0 là đúng và con số cơ sở 786 mới là con số sai',
            ),
            B(
              'The BASELINE did: escaped brackets inside a character class broke the class so it matched nothing, and a result of 0 against a known non-zero baseline is what exposed it immediately — a measurement returning zero deserves more suspicion than one returning a surprising number',
              'ĐƯỜNG CƠ SỞ làm được: dấu ngoặc vuông thoát bên trong một lớp ký tự làm hỏng chính cái lớp ấy nên nó không khớp gì, và kết quả 0 đặt cạnh một đường cơ sở khác 0 đã biết là thứ phơi bày nó ngay lập tức — một phép đo trả về KHÔNG đáng nghi hơn một phép đo trả về con số bất ngờ',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Without the baseline the zero would have read as good news — "the repository rule is perfectly followed" — and the audit would have moved on having verified nothing. That is the asymmetry worth carrying: a surprising non-zero number invites a second look on its own, while a zero looks like an answer. Zero is the value a broken measurement returns most often, so it earns the most suspicion, and the cheap defence is a baseline you already trust or a positive control the search MUST match. The real count was 786, of which 722 sat inside <code>components/notes/</code> and obeyed the repository rule, leaving 64 across 32 files that drifted from it. Those 64 do not misbehave today, precisely because <code>.dark</code> is not placed above them — which makes them dead styles: harmless now, and a trap the moment someone puts <code>.dark</code> higher in the tree again. A documented rule at 91.9% compliance looks like a success and is also a live liability, and neither fact is visible unless someone counts.',
            'Không có đường cơ sở thì con số 0 kia đã được đọc như tin vui — "luật của kho được tuân thủ hoàn hảo" — và bản rà đã đi tiếp mà chẳng kiểm chứng được gì. Đó là sự bất đối xứng đáng mang theo: một con số khác 0 gây bất ngờ thì tự nó mời gọi nhìn lại, còn một con số 0 thì trông như một câu trả lời. Số 0 lại là giá trị mà một phép đo hỏng trả về thường xuyên nhất, nên nó xứng đáng bị nghi ngờ nhất, và phòng thủ rẻ tiền là một đường cơ sở bạn đã tin hoặc một ca đối chứng dương mà phép tìm BẮT BUỘC phải khớp. Con số thật là 786, trong đó 722 nằm trong <code>components/notes/</code> và tuân thủ luật của kho, còn lại 64 trải 32 file đã trôi khỏi luật. 64 cái ấy hôm nay không gây hại, chính vì <code>.dark</code> không được đặt phía trên chúng — điều đó biến chúng thành kiểu dáng CHẾT: vô hại lúc này, và là một cái bẫy ngay khi có ai đặt lại <code>.dark</code> cao hơn trong cây. Một luật đã ghi thành văn với 91,9% tuân thủ trông như một thành công và đồng thời là một khoản nợ đang sống, và cả hai sự thật ấy đều không thấy được trừ khi có người đi ĐẾM.',
          ),
        }),

        mcq({
          prompt: B(
            'A reader finishes the course and concludes: "my palette probably has about three AA failures too, and my stylesheet is probably around 45 KB gzipped." What is wrong with that, and what is the right use of the three-column table?',
            'Một người đọc học xong khoá này rồi kết luận: "bảng màu của tôi chắc cũng có khoảng ba chỗ trượt AA, và bảng kiểu của tôi chắc cũng cỡ 45 KB gzip". Sai ở đâu, và dùng bảng ba cột cho đúng là dùng thế nào?',
          ),
          options: [
            B(
              'Nothing is wrong for the size figure — output size is dominated by Tailwind\'s own defaults, so 45 KB is a reasonable prior for any project — but the contrast conclusion does not transfer',
              'Con số kích thước thì không sai — kích thước đầu ra bị chi phối bởi chính các giá trị mặc định của Tailwind, nên 45 KB là một ước lượng ban đầu hợp lý cho mọi dự án — nhưng kết luận về tương phản thì không chuyển được',
            ),
            B(
              'The conclusion is fine as a starting hypothesis: both figures come from a large real codebase, so they are the best available estimate until someone measures something better',
              'Kết luận ấy ổn với vai trò một giả thuyết khởi điểm: cả hai con số đều đến từ một kho mã thật và lớn, nên chúng là ước lượng tốt nhất hiện có cho tới khi ai đó đo được thứ khá hơn',
            ),
            B(
              'Only the ORDER is wrong: measure size first because it is cheap, then contrast, and the two numbers will converge on this repository\'s within a factor of two',
              'Chỉ THỨ TỰ là sai: hãy đo kích thước trước vì nó rẻ, rồi mới tới tương phản, và hai con số sẽ hội tụ về con số của kho này trong khoảng chênh gấp đôi',
            ),
            B(
              'Both are column B — this repository\'s measurements, not Tailwind\'s properties — so importing either as a prediction is exactly the mistake the table exists to prevent; column A transfers, column B must be re-run, and column C is the checklist to consult when you are unsure',
              'Cả hai đều thuộc cột B — số đo của riêng kho này chứ không phải tính chất của Tailwind — nên bê cái nào sang làm dự đoán chính là sai lầm mà cái bảng ấy sinh ra để ngăn; cột A chuyển được, cột B phải chạy lại, còn cột C là danh sách để tra khi bạn không chắc',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Both figures are arithmetic about one codebase and both depend on things the reader\'s project does not share: the size scales with the vocabulary of utilities actually used, and the three contrast failures are one tuning mistake in one token — a mid-grey reused unchanged across both themes. Nothing about Tailwind predicts either. What DOES transfer is the method: run the build and weigh it, run the class audit, compute the contrast ratios over your own tokens. Column A is the part you can rely on without re-measuring — generator semantics, string sorting, layers not changing specificity, <code>@layer</code> stripped on v3, variables inheriting, <code>@apply</code> copying. Column C is the one to consult before writing a mental model into a PR description: if your claim matches a line there, it has already lost to a measurement once. And the honest reading of this course is not that these numbers are yours; it is that the numbers exist at all because somebody ran the command, which is the habit the whole thing is trying to transfer.',
            'Cả hai con số đều là số học về MỘT kho mã và cả hai đều phụ thuộc vào những thứ mà dự án của người đọc không chia sẻ: kích thước tỉ lệ với VỐN TỪ tiện ích thật sự được dùng, còn ba chỗ trượt tương phản là MỘT lỗi tinh chỉnh ở MỘT token — một màu xám giữa dùng lại y nguyên cho cả hai theme. Chẳng có gì thuộc về Tailwind dự đoán được cái nào. Thứ CHUYỂN được là PHƯƠNG PHÁP: chạy bản dựng rồi cân nó, chạy bản rà lớp, tính tỉ số tương phản trên chính các token của bạn. Cột A là phần bạn dựa vào được mà không cần đo lại — ngữ nghĩa của trình sinh, phép sắp theo chuỗi, layer không đổi độ đặc hiệu, <code>@layer</code> bị xoá ở v3, biến CSS kế thừa, <code>@apply</code> chép chứ không chia sẻ. Cột C là cột nên tra trước khi viết một mô hình tinh thần vào phần mô tả một PR: nếu điều bạn khẳng định trùng một dòng ở đó thì nó đã từng thua một phép đo rồi. Và cách đọc trung thực về khoá này không phải là "mấy con số ấy là của bạn"; mà là mấy con số ấy TỒN TẠI được chỉ vì đã có người chạy lệnh — và đó mới là thói quen mà cả khoá đang cố truyền lại.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q31 — Take a class apart, then answer Q1 (chapters 9 and 10).</b> The first question of the diagnosis tree is "was the rule generated at all", and answering it means knowing exactly what the pieces of a class name are. Implement <code>phanTich(lop)</code>, which decomposes one class and decides whether this build could generate it. No Tailwind, no libraries.</p>' +
            '<p>Return an object with these fields:</p>' +
            '<ul>' +
            '<li><code>bienThe</code> — the state variants, in written order, as an array. <code>diemNgat</code> — the breakpoint, or <code>null</code>. Both come from the parts before the last <code>:</code>; a part is a breakpoint if it is in <code>DIEM_NGAT</code>, otherwise it is a state variant. Strip any <code>/name</code> suffix from a variant first, so <code>group-hover/item</code> counts as <code>group-hover</code>.</li>' +
            '<li><code>quanTrong</code> — <code>true</code> when the utility carries a leading <code>!</code>. The <code>!</code> sits AFTER the variants: <code>md:!mt-2</code>.</li>' +
            '<li><code>doMo</code> — the opacity modifier as a string, or <code>null</code>. It is whatever follows the last <code>/</code>.</li>' +
            '<li><code>tienIch</code> and <code>giaTri</code> — the utility name up to its FIRST <code>-</code>, and the rest. <code>thuocTinh</code> — the CSS property from <code>TIEN_ICH</code>. An unknown utility leaves all three <code>null</code>.</li>' +
            '<li><code>tuyY</code> — <code>true</code> when the value is wrapped in square brackets.</li>' +
            '<li><code>hopLe</code> — <code>true</code> only when every state variant is in <code>LOP_GIA</code>, AND the value is either arbitrary or a key of the utility\'s scale, AND the modifier is absent, arbitrary, or a key of the opacity scale.</li>' +
            '</ul>' +
            '<p>⚠️ A <code>:</code> or a <code>/</code> INSIDE square brackets belongs to the value, not to the syntax — <code>border-white/[12%]</code> and <code>bg-[url(a:b)]</code> must survive. Split only at delimiters outside the brackets.</p>' +
            '<p>Keep the given data and the printing loop exactly as they are, and do not <code>require</code> anything.</p>',

            '<p><b>Câu 31 — Tháo rời một cái lớp, rồi trả lời Q1 (chương 9 và 10).</b> Câu hỏi đầu tiên của cây chẩn đoán là "quy tắc có được phát sinh không", và trả lời được nó nghĩa là biết chính xác một tên lớp gồm những mảnh gì. Hãy cài đặt <code>phanTich(lop)</code>: phân rã một cái lớp và quyết xem bản dựng này có sinh ra nó được không. Không Tailwind, không thư viện.</p>' +
            '<p>Trả về một object với các trường sau:</p>' +
            '<ul>' +
            '<li><code>bienThe</code> — các biến thể trạng thái, theo thứ tự viết, dạng mảng. <code>diemNgat</code> — điểm ngắt, hoặc <code>null</code>. Cả hai lấy từ các phần trước dấu <code>:</code> cuối cùng; một phần là điểm ngắt nếu nó nằm trong <code>DIEM_NGAT</code>, không thì là biến thể trạng thái. Hãy bỏ hậu tố <code>/tên</code> của biến thể trước đã, để <code>group-hover/item</code> tính là <code>group-hover</code>.</li>' +
            '<li><code>quanTrong</code> — <code>true</code> khi tiện ích mang dấu <code>!</code> đứng đầu. Dấu <code>!</code> nằm SAU các biến thể: <code>md:!mt-2</code>.</li>' +
            '<li><code>doMo</code> — bổ từ độ mờ dạng chuỗi, hoặc <code>null</code>. Nó là phần theo sau dấu <code>/</code> cuối cùng.</li>' +
            '<li><code>tienIch</code> và <code>giaTri</code> — tên tiện ích tính tới dấu <code>-</code> ĐẦU TIÊN, và phần còn lại. <code>thuocTinh</code> — thuộc tính CSS tra từ <code>TIEN_ICH</code>. Tiện ích lạ thì cả ba đều <code>null</code>.</li>' +
            '<li><code>tuyY</code> — <code>true</code> khi giá trị được bọc trong ngoặc vuông.</li>' +
            '<li><code>hopLe</code> — <code>true</code> chỉ khi mọi biến thể trạng thái đều nằm trong <code>LOP_GIA</code>, VÀ giá trị hoặc là tuỳ ý hoặc là một khoá của thang thuộc tiện ích ấy, VÀ bổ từ hoặc vắng mặt, hoặc tuỳ ý, hoặc là một khoá của thang opacity.</li>' +
            '</ul>' +
            '<p>⚠️ Một dấu <code>:</code> hay <code>/</code> NẰM TRONG ngoặc vuông là thuộc về GIÁ TRỊ chứ không phải cú pháp — <code>border-white/[12%]</code> và <code>bg-[url(a:b)]</code> phải sống sót. Chỉ cắt ở những dấu nằm NGOÀI ngoặc.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và không <code>require</code> thứ gì.</p>',
          ),
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const DIEM_NGAT = ['sm', 'md', 'lg', 'xl', '2xl'];\n" +
            "const LOP_GIA = ['hover', 'focus', 'focus-visible', 'active', 'disabled',\n" +
            "  'group-hover', 'peer-checked', 'motion-reduce', 'print', 'dark'];\n\n" +
            '// Thang giá trị — rút gọn, nhưng đúng khoá thật của 3.4.14.\n' +
            'const THANG = {\n' +
            "  spacing: ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '8', '10', '12', 'px'],\n" +
            "  duration: ['0', '75', '100', '150', '200', '300', '500', '700', '1000'],\n" +
            "  opacity: ['0', '5', '10', '15', '20', '25', '30', '40', '50', '60', '70', '75', '80', '90', '100'],\n" +
            "  color: ['white', 'black', 'red-500', 'blue-500', 'slate-400', 'slate-500'],\n" +
            '};\n\n' +
            '// Tiện ích → [tên thang, thuộc tính CSS].\n' +
            'const TIEN_ICH = {\n' +
            "  p: ['spacing', 'padding'], px: ['spacing', 'padding-inline'], py: ['spacing', 'padding-block'],\n" +
            "  m: ['spacing', 'margin'], mt: ['spacing', 'margin-top'],\n" +
            "  w: ['spacing', 'width'], h: ['spacing', 'height'], gap: ['spacing', 'gap'],\n" +
            "  bg: ['color', 'background-color'], text: ['color', 'color'], border: ['color', 'border-color'],\n" +
            "  duration: ['duration', 'transition-duration'], opacity: ['opacity', 'opacity'],\n" +
            '};\n\n' +
            'const LOP = [\n' +
            "  'p-4', 'mt-0.5', 'w-4.5', 'gap-12',\n" +
            "  'hover:bg-red-500', 'md:p-8', 'lg:hover:p-2', 'dark:md:text-white',\n" +
            "  '!p-4', 'md:!mt-2',\n" +
            "  'border-white/10', 'border-white/12', 'border-white/[12%]',\n" +
            "  'duration-1000', 'duration-3000',\n" +
            "  'text-slate-400', 'bg-[#0d1117]', 'w-[18px]',\n" +
            "  'group-hover/item:opacity-50', 'hocus:p-4', 'prose-invert',\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function phanTich(lop) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const l of LOP) {\n' +
            '  const r = phanTich(l);\n' +
            '  console.log(\n' +
            "    (r.hopLe ? 'OK  ' : 'CHET') + ' ' + l.padEnd(28)\n" +
            "    + 'bt=' + JSON.stringify(r.bienThe)\n" +
            "    + ' dn=' + JSON.stringify(r.diemNgat)\n" +
            "    + ' qt=' + r.quanTrong\n" +
            "    + ' tt=' + JSON.stringify(r.thuocTinh)\n" +
            "    + ' gt=' + JSON.stringify(r.giaTri)\n" +
            "    + ' dm=' + JSON.stringify(r.doMo),\n" +
            '  );\n' +
            '}\n' +
            "console.log('CHET: ' + JSON.stringify(LOP.filter((l) => !phanTich(l).hopLe)));\n",
          expectedOutput:
            'OK   p-4                         bt=[] dn=null qt=false tt="padding" gt="4" dm=null\n' +
            'OK   mt-0.5                      bt=[] dn=null qt=false tt="margin-top" gt="0.5" dm=null\n' +
            'CHET w-4.5                       bt=[] dn=null qt=false tt="width" gt="4.5" dm=null\n' +
            'OK   gap-12                      bt=[] dn=null qt=false tt="gap" gt="12" dm=null\n' +
            'OK   hover:bg-red-500            bt=["hover"] dn=null qt=false tt="background-color" gt="red-500" dm=null\n' +
            'OK   md:p-8                      bt=[] dn="md" qt=false tt="padding" gt="8" dm=null\n' +
            'OK   lg:hover:p-2                bt=["hover"] dn="lg" qt=false tt="padding" gt="2" dm=null\n' +
            'OK   dark:md:text-white          bt=["dark"] dn="md" qt=false tt="color" gt="white" dm=null\n' +
            'OK   !p-4                        bt=[] dn=null qt=true tt="padding" gt="4" dm=null\n' +
            'OK   md:!mt-2                    bt=[] dn="md" qt=true tt="margin-top" gt="2" dm=null\n' +
            'OK   border-white/10             bt=[] dn=null qt=false tt="border-color" gt="white" dm="10"\n' +
            'CHET border-white/12             bt=[] dn=null qt=false tt="border-color" gt="white" dm="12"\n' +
            'OK   border-white/[12%]          bt=[] dn=null qt=false tt="border-color" gt="white" dm="[12%]"\n' +
            'OK   duration-1000               bt=[] dn=null qt=false tt="transition-duration" gt="1000" dm=null\n' +
            'CHET duration-3000               bt=[] dn=null qt=false tt="transition-duration" gt="3000" dm=null\n' +
            'OK   text-slate-400              bt=[] dn=null qt=false tt="color" gt="slate-400" dm=null\n' +
            'OK   bg-[#0d1117]                bt=[] dn=null qt=false tt="background-color" gt="[#0d1117]" dm=null\n' +
            'OK   w-[18px]                    bt=[] dn=null qt=false tt="width" gt="[18px]" dm=null\n' +
            'OK   group-hover/item:opacity-50 bt=["group-hover"] dn=null qt=false tt="opacity" gt="50" dm=null\n' +
            'CHET hocus:p-4                   bt=["hocus"] dn=null qt=false tt="padding" gt="4" dm=null\n' +
            'CHET prose-invert                bt=[] dn=null qt=false tt=null gt=null dm=null\n' +
            'CHET: ["w-4.5","border-white/12","duration-3000","hocus:p-4","prose-invert"]',
          sampleSolution:
            'function phanTich(lop) {\n' +
            '  const ra = {\n' +
            '    lop, bienThe: [], diemNgat: null, quanTrong: false,\n' +
            '    tienIch: null, thuocTinh: null, giaTri: null, doMo: null, tuyY: false, hopLe: false,\n' +
            '  };\n\n' +
            "  // Cắt biến thể ở mỗi dấu ':' NGOÀI cặp ngoặc vuông.\n" +
            '  const phan = [];\n' +
            '  let sau = 0, trongNgoac = 0;\n' +
            '  for (let i = 0; i < lop.length; i++) {\n' +
            "    if (lop[i] === '[') trongNgoac++;\n" +
            "    else if (lop[i] === ']') trongNgoac--;\n" +
            "    else if (lop[i] === ':' && trongNgoac === 0) { phan.push(lop.slice(sau, i)); sau = i + 1; }\n" +
            '  }\n' +
            '  phan.push(lop.slice(sau));\n' +
            '  let goc = phan.pop();\n\n' +
            '  for (const v of phan) {\n' +
            "    const ten = v.split('/')[0];          // group-hover/item -> group-hover\n" +
            '    if (DIEM_NGAT.includes(ten)) ra.diemNgat = ten;\n' +
            '    else ra.bienThe.push(ten);\n' +
            '  }\n' +
            "  if (goc.startsWith('!')) { ra.quanTrong = true; goc = goc.slice(1); }\n\n" +
            "  // Bổ từ độ mờ: dấu '/' cuối cùng NGOÀI ngoặc vuông.\n" +
            '  let cat = -1; trongNgoac = 0;\n' +
            '  for (let i = 0; i < goc.length; i++) {\n' +
            "    if (goc[i] === '[') trongNgoac++;\n" +
            "    else if (goc[i] === ']') trongNgoac--;\n" +
            "    else if (goc[i] === '/' && trongNgoac === 0) cat = i;\n" +
            '  }\n' +
            '  if (cat >= 0) { ra.doMo = goc.slice(cat + 1); goc = goc.slice(0, cat); }\n\n' +
            "  const gach = goc.indexOf('-');\n" +
            '  if (gach < 0) return ra;\n' +
            '  ra.tienIch = goc.slice(0, gach);\n' +
            '  ra.giaTri = goc.slice(gach + 1);\n' +
            '  const dinhNghia = TIEN_ICH[ra.tienIch];\n' +
            '  if (!dinhNghia) { ra.tienIch = null; ra.giaTri = null; return ra; }\n' +
            '  ra.thuocTinh = dinhNghia[1];\n' +
            "  ra.tuyY = ra.giaTri.startsWith('[') && ra.giaTri.endsWith(']');\n\n" +
            '  const bienTheOk = ra.bienThe.every((v) => LOP_GIA.includes(v));\n' +
            '  const giaTriOk = ra.tuyY || THANG[dinhNghia[0]].includes(ra.giaTri);\n' +
            '  const doMoOk = ra.doMo === null\n' +
            "    || (ra.doMo.startsWith('[') && ra.doMo.endsWith(']'))\n" +
            '    || THANG.opacity.includes(ra.doMo);\n' +
            '  ra.hopLe = bienTheOk && giaTriOk && doMoOk;\n' +
            '  return ra;\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q32 — The contrast audit, computed rather than eyeballed (chapter 9).</b> Whether a colour pair is readable is not a matter of taste: WCAG defines relative luminance and a contrast ratio, and both are short enough to implement. Write the audit over this repository\'s real tokens. No libraries.</p>' +
            '<p>Four functions:</p>' +
            '<ul>' +
            '<li><code>doChoi(hex)</code> — relative luminance of <code>#rrggbb</code>. Each channel is divided by 255, then linearised: <code>c / 12.92</code> when <code>c &lt;= 0.03928</code>, otherwise <code>((c + 0.055) / 1.055) ** 2.4</code>. Weight them <code>0.2126 R + 0.7152 G + 0.0722 B</code>.</li>' +
            '<li><code>tiSo(a, b)</code> — <code>(L_lighter + 0.05) / (L_darker + 0.05)</code>, <b>rounded to two decimals</b>, and order-independent.</li>' +
            '<li><code>xepHang(r)</code> — <code>&quot;PASS&quot;</code> at 4.5 or more, <code>&quot;LARGE-ONLY&quot;</code> at 3 or more, else <code>&quot;FAIL&quot;</code>.</li>' +
            '<li><code>raSoat(chu, nen)</code> — every text token against every background of its OWN theme, as an array of <code>{ theme, chu, nen, hex, bg, tiSo, hang }</code>, ordered light before dark, then by token, then by background, following the insertion order of the two objects.</li>' +
            '<li><code>xamGanNhat(bg, toiDan)</code> — scan all 256 neutral greys <code>#vvvvvv</code> and return the one closest to the 4.5 threshold: the DARKEST that still passes when <code>toiDan</code> is true, the LIGHTEST that still passes when it is false. Return <code>null</code> if none passes.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing block exactly as they are, and do not <code>require</code> anything.</p>',

            '<p><b>Câu 32 — Bản rà tương phản, TÍNH ra chứ không ướm mắt (chương 9).</b> Một cặp màu có đọc được hay không không phải chuyện khẩu vị: WCAG định nghĩa độ chói tương đối và tỉ số tương phản, và cả hai đều đủ ngắn để tự cài. Hãy viết bản rà trên đúng các token thật của kho này. Không thư viện.</p>' +
            '<p>Bốn hàm:</p>' +
            '<ul>' +
            '<li><code>doChoi(hex)</code> — độ chói tương đối của <code>#rrggbb</code>. Mỗi kênh chia cho 255 rồi tuyến tính hoá: <code>c / 12.92</code> khi <code>c &lt;= 0.03928</code>, ngược lại <code>((c + 0.055) / 1.055) ** 2.4</code>. Trọng số <code>0.2126 R + 0.7152 G + 0.0722 B</code>.</li>' +
            '<li><code>tiSo(a, b)</code> — <code>(L_sáng + 0.05) / (L_tối + 0.05)</code>, <b>làm tròn hai chữ số thập phân</b>, và không phụ thuộc thứ tự hai đối số.</li>' +
            '<li><code>xepHang(r)</code> — <code>&quot;PASS&quot;</code> từ 4,5 trở lên, <code>&quot;LARGE-ONLY&quot;</code> từ 3 trở lên, còn lại <code>&quot;FAIL&quot;</code>.</li>' +
            '<li><code>raSoat(chu, nen)</code> — mọi token chữ đấu với mọi nền của CHÍNH theme nó, trả về mảng <code>{ theme, chu, nen, hex, bg, tiSo, hang }</code>, xếp light trước dark, rồi theo token, rồi theo nền, theo đúng thứ tự khai báo trong hai object.</li>' +
            '<li><code>xamGanNhat(bg, toiDan)</code> — quét cả 256 màu xám trung tính <code>#vvvvvv</code> và trả về cái SÁT ngưỡng 4,5 nhất: cái TỐI NHẤT còn đạt khi <code>toiDan</code> là true, cái SÁNG NHẤT còn đạt khi nó là false. Trả <code>null</code> nếu không cái nào đạt.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không <code>require</code> thứ gì.</p>',
          ),
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// Token chữ và nền, chép nguyên văn từ globals.css của kho này.\n' +
            'const CHU = {\n' +
            "  primary:   { light: '#050505', dark: '#e4e6eb' },\n" +
            "  secondary: { light: '#65676b', dark: '#b0b3b8' },\n" +
            "  muted:     { light: '#8a8d91', dark: '#8a8d91' },   // MỘT mã hex cho cả hai theme\n" +
            '};\n' +
            'const NEN = {\n' +
            "  light: { card: '#ffffff', surface: '#f0f2f5' },\n" +
            "  dark:  { card: '#242526', surface: '#303031' },\n" +
            '};\n' +
            '// Nền tối CỐ ĐỊNH, không đổi theo theme — nửa còn lại của sự cố 1,16.\n' +
            "const NEN_TOI_CO_DINH = { darkbg: '#18191a', darkcard: '#242526', darksurface: '#303031' };\n\n" +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function doChoi(hex) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function tiSo(a, b) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function xepHang(r) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function raSoat(chu, nen) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function xamGanNhat(bg, toiDan) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const bang = raSoat(CHU, NEN);\n' +
            'for (const d of bang) {\n' +
            "  console.log(d.theme.padEnd(6) + d.chu.padEnd(10) + d.nen.padEnd(8)\n" +
            "    + d.hex + ' tren ' + d.bg + '  ' + d.tiSo.toFixed(2).padStart(5) + '  ' + d.hang);\n" +
            '}\n' +
            "const truot = bang.filter((d) => d.hang !== 'PASS');\n" +
            "console.log('truot AA-thuong: ' + truot.length + '/' + bang.length\n" +
            "  + ' -> ' + JSON.stringify([...new Set(truot.map((d) => d.chu))]));\n" +
            "console.log('truot ca AA-lon : ' + JSON.stringify(bang.filter((d) => d.hang === 'FAIL')\n" +
            "  .map((d) => d.theme + '/' + d.chu + '/' + d.nen)));\n" +
            "console.log('--- su co 1,16: chu theme SANG tren nen toi CO DINH ---');\n" +
            'for (const [ten, bg] of Object.entries(NEN_TOI_CO_DINH)) {\n' +
            '  const r = tiSo(CHU.primary.light, bg);\n' +
            "  console.log('  text-primary(light) ' + CHU.primary.light + ' tren ' + ten.padEnd(12) + bg\n" +
            "    + '  ' + r.toFixed(2) + '  ' + xepHang(r));\n" +
            '}\n' +
            "console.log('--- gia tri thay the ---');\n" +
            "console.log('  light, do theo SURFACE #f0f2f5 -> ' + xamGanNhat('#f0f2f5', true)\n" +
            "  + ' (tren surface ' + tiSo(xamGanNhat('#f0f2f5', true), '#f0f2f5').toFixed(2)\n" +
            "  + ', tren card ' + tiSo(xamGanNhat('#f0f2f5', true), '#ffffff').toFixed(2) + ')');\n" +
            "console.log('  light, do theo CARD    #ffffff -> ' + xamGanNhat('#ffffff', true)\n" +
            "  + ' (tren surface ' + tiSo(xamGanNhat('#ffffff', true), '#f0f2f5').toFixed(2) + ')');\n" +
            "console.log('  dark,  do theo SURFACE #303031 -> ' + xamGanNhat('#303031', false)\n" +
            "  + ' (tren surface ' + tiSo(xamGanNhat('#303031', false), '#303031').toFixed(2) + ')');\n",
          expectedOutput:
            'light primary   card    #050505 tren #ffffff  20.38  PASS\n' +
            'light primary   surface #050505 tren #f0f2f5  18.17  PASS\n' +
            'light secondary card    #65676b tren #ffffff   5.67  PASS\n' +
            'light secondary surface #65676b tren #f0f2f5   5.05  PASS\n' +
            'light muted     card    #8a8d91 tren #ffffff   3.33  LARGE-ONLY\n' +
            'light muted     surface #8a8d91 tren #f0f2f5   2.97  FAIL\n' +
            'dark  primary   card    #e4e6eb tren #242526  12.30  PASS\n' +
            'dark  primary   surface #e4e6eb tren #303031  10.56  PASS\n' +
            'dark  secondary card    #b0b3b8 tren #242526   7.30  PASS\n' +
            'dark  secondary surface #b0b3b8 tren #303031   6.27  PASS\n' +
            'dark  muted     card    #8a8d91 tren #242526   4.61  PASS\n' +
            'dark  muted     surface #8a8d91 tren #303031   3.95  LARGE-ONLY\n' +
            'truot AA-thuong: 3/12 -> ["muted"]\n' +
            'truot ca AA-lon : ["light/muted/surface"]\n' +
            '--- su co 1,16: chu theme SANG tren nen toi CO DINH ---\n' +
            '  text-primary(light) #050505 tren darkbg      #18191a  1.16  FAIL\n' +
            '  text-primary(light) #050505 tren darkcard    #242526  1.33  FAIL\n' +
            '  text-primary(light) #050505 tren darksurface #303031  1.55  FAIL\n' +
            '--- gia tri thay the ---\n' +
            '  light, do theo SURFACE #f0f2f5 -> #6e6e6e (tren surface 4.55, tren card 5.10)\n' +
            '  light, do theo CARD    #ffffff -> #767676 (tren surface 4.05)\n' +
            '  dark,  do theo SURFACE #303031 -> #979797 (tren surface 4.51)',
          sampleSolution:
            'function doChoi(hex) {\n' +
            '  const kenh = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);\n' +
            '  const [r, g, b] = kenh.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));\n' +
            '  return 0.2126 * r + 0.7152 * g + 0.0722 * b;\n' +
            '}\n\n' +
            'function tiSo(a, b) {\n' +
            '  const [sang, toi] = [doChoi(a), doChoi(b)].sort((x, y) => y - x);\n' +
            '  return Math.round(((sang + 0.05) / (toi + 0.05)) * 100) / 100;\n' +
            '}\n\n' +
            'function xepHang(r) {\n' +
            "  if (r >= 4.5) return 'PASS';\n" +
            "  if (r >= 3) return 'LARGE-ONLY';\n" +
            "  return 'FAIL';\n" +
            '}\n\n' +
            'function raSoat(chu, nen) {\n' +
            '  const ra = [];\n' +
            "  for (const theme of ['light', 'dark']) {\n" +
            '    for (const [tenChu, v] of Object.entries(chu)) {\n' +
            '      for (const [tenNen, bg] of Object.entries(nen[theme])) {\n' +
            '        const r = tiSo(v[theme], bg);\n' +
            '        ra.push({ theme, chu: tenChu, nen: tenNen, hex: v[theme], bg, tiSo: r, hang: xepHang(r) });\n' +
            '      }\n' +
            '    }\n' +
            '  }\n' +
            '  return ra;\n' +
            '}\n\n' +
            'function xamGanNhat(bg, toiDan) {\n' +
            '  // Quét cả 256 mức xám; giữ cái CUỐI CÙNG còn đạt theo hướng đang đi,\n' +
            '  // nên nó chính là cái SÁT ngưỡng nhất.\n' +
            '  let tot = null;\n' +
            '  const day = [...Array(256).keys()];\n' +
            '  for (const v of (toiDan ? day : day.reverse())) {\n' +
            "    const h = '#' + v.toString(16).padStart(2, '0').repeat(3);\n" +
            '    if (tiSo(h, bg) >= 4.5) tot = h;\n' +
            '  }\n' +
            '  return tot;\n' +
            '}\n',
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
