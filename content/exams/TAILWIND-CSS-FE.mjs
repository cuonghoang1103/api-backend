/**
 * Tailwind CSS — Final Exam (FE): 50 câu trắc nghiệm phủ cả 11 mục (s00–s10).
 *
 * Đề tự soạn, bám sát `content/courses/tailwind-css/s00…s11`.
 *
 * ⚠️ PHIÊN BẢN: khoá này dạy **Tailwind CSS 3.4.x**, KHÔNG phải v4. Ba bằng
 * chứng độc lập, không phải suy đoán:
 *   • `frontend/package.json:108` ghi `"tailwindcss": "^3.4.14"`.
 *   • Giáo trình mở đầu bằng `@tailwind base; @tailwind components;
 *     @tailwind utilities;` và một `tailwind.config.js` — chứ không phải
 *     `@import "tailwindcss";` và khối `@theme` của v4. `s06` và `s07` còn nói
 *     thẳng "Tailwind 4 dùng `@theme`… trên Tailwind 3.4 thì đây là lựa chọn
 *     duy nhất".
 *   • `frontend/tailwind.config.ts` tồn tại và dựng được bằng CLI 3.4.14.
 * Vì thế MỌI đáp án trong đề đều là hành vi của v3. Cú pháp v4 (`@theme`,
 * `@import "tailwindcss"`, hậu tố `mt-4!`) chỉ xuất hiện ở đúng một chỗ và
 * theo đúng một vai: làm DẤU HIỆU PHÂN BIỆT hai phiên bản (câu 27), cộng hai
 * lần nhắc lại trong phần giải thích (câu 27 và câu 50). Không câu nào đòi
 * học viên biết v4 làm gì; chúng chỉ đòi biết v3 KHÔNG làm gì.
 *
 * ⚠️ MỌI SỐ ĐO TRONG ĐỀ ĐỀU LẤY TỪ MÁY, không chép từ tài liệu. Hộp cát:
 * `npm i tailwindcss@3.4.14` trong một thư mục trống ngoài kho, dựng bằng
 * `./node_modules/.bin/tailwindcss -i in.css -o out.css --content <file>` rồi
 * ĐỌC `out.css`. Những thứ đã chạy thật và được dùng làm đáp án:
 *   • thứ tự phát sinh `.mt-1 .mt-10 .mt-12 .mt-16 .mt-2 .mt-20 .mt-24 .mt-3
 *     .mt-32 .mt-4 .mt-8` (sắp theo CHUỖI) và `.m-1 .mx-1 .ml-1 .p-1 .px-1
 *     .py-1 .pb-1 .pt-1` (toàn phần → trục → cạnh theo abc);
 *   • `p-2 p-8` và `p-8 p-2` cho ra file GIỐNG HỆT nhau (diff rỗng);
 *   • `group-hover:` → `.group:hover .group-hover\:x`, `peer-checked:` →
 *     `.peer:checked ~ .x`, cả hai sinh ra kể cả khi mã nguồn KHÔNG có `.group`;
 *   • ba giá trị `darkMode`: `media` → `@media (prefers-color-scheme: dark)`,
 *     `class` → `:is(.dark *)`, `selector` → `:where(.dark, .dark *)`;
 *   • màu `var(--x)` trần: `bg-x` sinh ra, `bg-x/50` sinh ra SỐ 0 quy tắc; dạng
 *     kênh `rgb(var(--x) / <alpha-value>)` thì `text-x/30` sinh ra đúng;
 *   • `@layer` trong đầu ra: 0 lần — kể cả trên bản dựng THẬT của kho này;
 *   • `@tailwind base` một mình: 555 dòng, 41 quy tắc Preflight;
 *   • đảo thứ tự ba chỉ thị (`utilities` lên đầu) ⇒ Preflight ĐÈ tiện ích;
 *   • bỏ hẳn `@tailwind utilities` ⇒ không tiện ích nào, không lỗi, exit 0;
 *   • `content` trỏ sai ⇒ 10.491 byte, 41 quy tắc, 93 ms, exit 0;
 *   • tên lớp CHỈ nằm trong file CSS đầu vào thì KHÔNG được phát sinh;
 *   • `!mt-4` sinh ra `!important`; `mt-4!` (cú pháp v4) sinh ra SỐ 0 quy tắc;
 *   • `outline-none` = `outline: 2px solid transparent; outline-offset: 2px`;
 *   • `tailwind-merge` 2.5.4: `mt-1…mt-32` → `mt-32`, `px-8 p-4` → `p-4`,
 *     `p-4 px-8` → giữ CẢ HAI, `text-sm text-red-500` → giữ CẢ HAI.
 *
 * ⚠️ BA CHỖ GIÁO TRÌNH LỆCH VỚI MÁY HÔM NAY (08/09/2026) — ĐỀ THEO MÁY:
 *   • Chương 8 ghi bản dựng của kho này là 371.550 byte thô / 45.242 byte gzip
 *     / 3.664 quy tắc / tỉ số 8,52:1. Dựng LẠI hôm nay bằng chính
 *     `frontend/tailwind.config.ts` và `frontend/src/app/globals.css`:
 *     **626.723 byte thô, 105.779 byte gzip -9, 5.746 quy tắc, tỉ số 5,76:1**.
 *     Kho đã lớn thêm (814 file .tsx / 29.058 `className`, so với 793 / 26.343
 *     lúc soạn giáo trình). Nên đề KHÔNG có câu nào lấy bốn con số ấy làm đáp
 *     án; câu 41 chỉ hỏi cái vẫn đúng khi đo lại — CSS tiện ích nén tốt hơn
 *     hẳn CSS viết tay (5,76:1 so với 3,63:1 trên chính `globals.css`).
 *   • Chương 3.4 ghi `twMerge` tốn 1,26 µs một lượt. Đo lại trên máy này
 *     (tailwind-merge 2.5.4, 20.000 lượt): **0,13 µs**. Con số ấy phụ thuộc
 *     máy, nên đề chỉ hỏi twMerge LÀM GÌ, không hỏi nó tốn bao nhiêu.
 *   • Chương 5.1 nói bỏ `extend` thì `p-4` VÀ `text-red-500` cùng biến mất. Đo
 *     thật: `theme: { spacing: {...} }` chỉ thay khoá `spacing` — `p-4` biến
 *     mất còn `text-red-500` VẪN SỐNG. Câu 25 ra đề theo máy: phép thay là
 *     THEO TỪNG KHOÁ, không phải cả bảng.
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 12 · B 13 · C 13 · D 12.
 *   node -e "import('./content/exams/TAILWIND-CSS-FE.mjs').then(m=>{const d={};m.default.exams[0].questions.forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Kiểm: node scripts/exam-check.mjs ./content/exams/TAILWIND-CSS-FE.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/TAILWIND-CSS-FE.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/tailwind-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all eleven units, from "Tailwind is a generator, not a library" to a diagnosis cookbook for "this class does nothing". Many questions show real generated CSS and ask you to explain it; every one of those outputs came from actually running Tailwind CLI 3.4.14, so read the output rather than the intuition.</p>' +
  '<p>Three habits pay off here. First, separate <em>the class you wrote</em> from <em>the rule that was emitted</em> — most of the surprising behaviour in this course lives in the gap between them. Second, when two utilities collide, the winner is decided by position in the output file, and that position comes from Tailwind\'s sort, never from the order you typed. Third, when a question shows a selector, read its specificity: <code>.group:hover .x</code> is not the same weight as <code>.x</code>, and <code>:where()</code> is not the same weight as <code>:is()</code>.</p>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả mười một mục, từ "Tailwind là một trình sinh chứ không phải một thư viện" tới sách công thức chẩn đoán "cái lớp này chẳng làm gì cả". Nhiều câu cho sẵn phần CSS được phát sinh THẬT rồi hỏi bạn giải thích nó; mọi đoạn đầu ra loại đó đều lấy từ việc chạy thật Tailwind CLI 3.4.14, nên hãy đọc đầu ra thay vì đoán theo cảm tính.</p>' +
  '<p>Ba thói quen giúp ích ở đây. Một, tách bạch <em>cái lớp bạn viết</em> với <em>cái quy tắc được phát sinh</em> — gần hết những hành vi gây bất ngờ của khoá này nằm trong khe hở giữa hai thứ đó. Hai, khi hai tiện ích đụng nhau thì kẻ thắng được quyết bởi VỊ TRÍ trong file đầu ra, và vị trí ấy đến từ phép sắp của Tailwind chứ không bao giờ đến từ thứ tự bạn gõ. Ba, khi một câu cho sẵn một selector thì hãy đọc độ đặc hiệu của nó: <code>.group:hover .x</code> không cùng trọng lượng với <code>.x</code>, và <code>:where()</code> không cùng trọng lượng với <code>:is()</code>.</p>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'tailwind-css' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 4,
      title: B(
        'Final Exam — the whole Tailwind CSS course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá Tailwind CSS (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all eleven units: what a CSS generator is and why a class built at runtime does not exist, the value scale, what a variant prefix compiles into, why written order has no effect on which utility wins, where reuse belongs, extending the config, CSS variables as the theme mechanism, what Tailwind\'s @layer actually is, output size measured rather than guessed, accessibility measured on a real palette, and a decision tree for diagnosing a class that does nothing.',
        'Năm mươi câu trắc nghiệm phủ cả mười một mục: một trình sinh CSS là gì và vì sao một lớp ghép lúc chạy thì KHÔNG tồn tại, thang giá trị, một tiền tố biến thể biên dịch ra cái gì, vì sao thứ tự viết không quyết định tiện ích nào thắng, chỗ tái sử dụng thuộc về, mở rộng cấu hình, biến CSS làm cơ chế theme, @layer của Tailwind thật ra là cái gì, kích thước đầu ra đo được chứ không đoán, khả năng tiếp cận đo trên một bảng màu thật, và một cây quyết định để chẩn đoán một lớp không làm gì cả.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [

        /* ── Mục 0 — Tailwind thật ra là cái gì (4 câu) ─────────────────── */

        // q1 · đáp án 0
        mcq({
          prompt: B(
            'Which sentence describes what Tailwind CSS 3.4 actually <em>is</em>, in the sense that most of its surprising behaviour follows from it?',
            'Câu nào mô tả đúng bản chất của Tailwind CSS 3.4, theo nghĩa gần hết những hành vi gây bất ngờ của nó đều suy ra từ đó?',
          ),
          options: [
            B(
              'A generator: it reads your source files as plain text, collects every string that looks like a class name, and emits CSS only for the ones it found',
              'Một trình SINH: nó đọc các file mã nguồn của bạn như văn bản thuần, thu thập mọi chuỗi trông giống một tên lớp, rồi chỉ phát sinh CSS cho những cái nó tìm thấy',
            ),
            B(
              'A stylesheet: a large pre-written CSS file that ships every utility, which a minifier later strips down to the rules the page referenced',
              'Một bảng kiểu: một file CSS lớn viết sẵn chứa mọi tiện ích, rồi một trình rút gọn về sau lược bỏ còn đúng những quy tắc mà trang có nhắc tới',
            ),
            B(
              'A runtime: a small script that watches the DOM and injects the matching rule into a stylesheet the first time an element carrying that class appears',
              'Một thư viện lúc chạy: một đoạn script nhỏ theo dõi DOM và chèn quy tắc tương ứng vào bảng kiểu ngay lần đầu một phần tử mang lớp đó xuất hiện',
            ),
            B(
              'A preprocessor: a Sass-like language whose class names are macros expanded into declarations while the component itself is being compiled',
              'Một trình tiền xử lý: một ngôn ngữ kiểu Sass mà tên lớp là các macro được bung thành khai báo ngay lúc chính component được biên dịch',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Tailwind is a build-time generator, and the word to keep is <em>text</em>. It never parses your JSX, never evaluates an expression, never sees the DOM: it runs a set of regexes over whatever files <code>content</code> points at and keeps every candidate string. Three consequences follow immediately and account for most of this course. A class assembled at runtime — ' + c('`text-${color}-500`') + ' — never appears as a complete string in the file, so no rule is generated, and nothing warns you. The stylesheet grows with the number of <em>distinct</em> utilities, not with the number of components, which is why a 814-component app still ships a few hundred kilobytes before gzip. And "search the docs" often fails, because the class you are looking for was never written down anywhere — it was derived from the scale. Option 2 is what PurgeCSS-era tooling did, and it is the mental model people carry over incorrectly. Options 3 and 4 describe runtimes and preprocessors; Tailwind is neither, and if it were, dynamic class names would work.',
            'Tailwind là một trình sinh LÚC DỰNG, và chữ đáng nhớ là <em>văn bản</em>. Nó không bao giờ phân tích cú pháp JSX của bạn, không bao giờ định trị một biểu thức, không bao giờ nhìn thấy DOM: nó chạy một bộ biểu thức chính quy lên những file mà <code>content</code> trỏ tới và giữ lại mọi chuỗi ứng viên. Ba hệ quả xuất hiện ngay lập tức, và chúng giải thích phần lớn khoá học này. Một lớp ghép lúc chạy — ' + c('`text-${color}-500`') + ' — không bao giờ xuất hiện dưới dạng một chuỗi trọn vẹn trong file, nên không quy tắc nào được sinh ra, và chẳng có gì cảnh báo bạn. Bảng kiểu lớn lên theo số tiện ích KHÁC NHAU chứ không theo số component, đó là lý do một ứng dụng 814 component vẫn chỉ giao vài trăm kilobyte trước khi nén. Và "tìm trong tài liệu" thường thất bại, vì cái lớp bạn đang tìm chưa từng được viết ra ở đâu cả — nó được SUY RA từ cái thang. Phương án 2 là thứ các công cụ thời PurgeCSS đã làm, và đó chính là mô hình tinh thần người ta mang sang một cách sai lầm. Phương án 3 và 4 mô tả một thư viện lúc chạy và một trình tiền xử lý; Tailwind không phải cái nào, và nếu nó là thế thì tên lớp động đã chạy được.',
          ),
        }),

        // q2 · đáp án 2
        mcq({
          prompt: B(
            'This file is the only thing <code>content</code> points at. Which classes end up in the built CSS?' +
            code('const c = "blue";\n' +
                 'export const A = () => <div className={`text-${c}-500 mt-4`} />;\n' +
                 'export const D = () => <div className="text-green-700" />;'),
            'File này là thứ duy nhất mà <code>content</code> trỏ tới. Những lớp nào rốt cuộc có mặt trong CSS đầu ra?' +
            code('const c = "blue";\n' +
                 'export const A = () => <div className={`text-${c}-500 mt-4`} />;\n' +
                 'export const D = () => <div className="text-green-700" />;'),
          ),
          options: [
            B(
              'All three — <code>text-blue-500</code>, <code>mt-4</code> and <code>text-green-700</code> — because the scanner resolves the constant before extracting',
              'Cả ba — <code>text-blue-500</code>, <code>mt-4</code> và <code>text-green-700</code> — vì bộ quét phân giải hằng số trước khi trích xuất',
            ),
            B(
              'Only <code>text-green-700</code>, because everything inside a template literal is treated as an expression and skipped entirely',
              'Chỉ <code>text-green-700</code>, vì mọi thứ bên trong một template literal đều bị coi là biểu thức và bị bỏ qua hoàn toàn',
            ),
            B(
              'Only <code>mt-4</code> and <code>text-green-700</code>: the interpolated name is never a complete string, but the static fragment beside it still is',
              'Chỉ <code>mt-4</code> và <code>text-green-700</code>: cái tên bị nội suy không bao giờ là một chuỗi trọn vẹn, nhưng mẩu tĩnh nằm cạnh nó thì vẫn là',
            ),
            B(
              'None of them, because a file with no <code>class=</code> attribute in it is skipped by the extractor before any regex runs',
              'Không lớp nào, vì một file không có thuộc tính <code>class=</code> nào sẽ bị bộ trích xuất bỏ qua trước khi chạy biểu thức chính quy nào',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured on Tailwind CLI 3.4.14 with exactly this file: the output contains <code>.mt-4</code> and <code>.text-green-700</code>, and no blue at all. This is the most useful thing to understand about the scanner, because it explains a bug that looks like magic. The extractor is a regex over raw text; ' + c('text-${c}-500') + ' contains no substring that matches a real utility, so nothing is emitted — but <code>mt-4</code>, sitting in the same template literal, <em>is</em> a complete candidate string and survives. So a component can be half-styled: the margin arrives, the colour does not, and there is no error anywhere. Option 1 assumes evaluation the scanner does not do. Option 2 is the plausible-sounding overcorrection — the template literal is not skipped, only the interpolated part is unreadable. Option 4 is wrong because the extractor does not look for attributes at all; it reads every file <code>content</code> matches as text, which is also why a class name written in a comment gets generated.',
            'Đo bằng Tailwind CLI 3.4.14 trên đúng file này: đầu ra chứa <code>.mt-4</code> và <code>.text-green-700</code>, và không có màu xanh dương nào. Đây là thứ đáng hiểu nhất về bộ quét, vì nó giải thích một con bọ trông như phép thuật. Bộ trích xuất là một biểu thức chính quy chạy trên văn bản thô; ' + c('text-${c}-500') + ' không chứa chuỗi con nào khớp một tiện ích thật, nên không gì được phát sinh — nhưng <code>mt-4</code>, nằm ngay trong cùng template literal ấy, LẠI là một chuỗi ứng viên trọn vẹn và sống sót. Thế nên một component có thể được tạo kiểu một NỬA: lề thì tới, màu thì không, và chẳng có lỗi nào ở đâu cả. Phương án 1 giả định một phép định trị mà bộ quét không làm. Phương án 2 là cú sửa quá tay nghe rất hợp lý — template literal không bị bỏ qua, chỉ phần bị nội suy là không đọc được. Phương án 4 sai vì bộ trích xuất không hề tìm thuộc tính; nó đọc mọi file mà <code>content</code> khớp như văn bản, và đó cũng là lý do một tên lớp viết trong một dòng chú thích vẫn được phát sinh.',
          ),
        }),

        // q3 · đáp án 1
        mcq({
          prompt: B(
            'A build finishes in 93 ms with exit code 0, no warning, and an output file containing Preflight and your own hand-written rules but <b>not one utility class</b>. Which of the four moving parts is broken?',
            'Một lượt dựng xong trong 93 ms với mã thoát 0, không cảnh báo nào, và file đầu ra chứa Preflight cùng các quy tắc bạn tự viết nhưng KHÔNG có lấy một lớp tiện ích nào. Bộ phận nào trong bốn bộ phận đang hỏng?',
          ),
          options: [
            B(
              'PostCSS: the plugin never ran, so the whole file passed through untouched and only your literal CSS came out the other end',
              'PostCSS: plugin chưa từng chạy, nên cả file đi qua nguyên vẹn và chỉ phần CSS nguyên văn của bạn ló ra ở đầu kia',
            ),
            B(
              'The injection point: the input CSS is missing <code>@tailwind utilities</code>, so there is nowhere for the utility block to be written',
              'Điểm chèn: file CSS đầu vào thiếu <code>@tailwind utilities</code>, nên không có chỗ nào để khối tiện ích được ghi vào',
            ),
            B(
              'The config: <code>theme</code> was written without <code>extend</code>, which empties the scale and leaves no utilities to generate',
              'Cấu hình: <code>theme</code> được viết mà không có <code>extend</code>, thứ đó dọn sạch cái thang và không còn tiện ích nào để phát sinh',
            ),
            B(
              'The content glob: it matched nothing, so the scanner found no candidates and every utility was correctly omitted',
              'Mẫu <code>content</code>: nó không khớp gì cả, nên bộ quét không tìm được ứng viên nào và mọi tiện ích bị bỏ qua một cách đúng đắn',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The distinguishing evidence is that <b>Preflight is present</b>. Preflight is what <code>@tailwind base</code> expands into, so that directive ran and PostCSS clearly worked — which eliminates option 1. Measured: an input of ' + c('@tailwind base; @tailwind components;') + ' with no <code>@tailwind utilities</code> and a source file containing <code>mt-4</code> produces an output with zero occurrences of <code>mt-4</code>, no warning, exit 0. The utility block has no injection point, so it is simply never written. Option 4 is the other famous silent failure, and it is the reason to read the whole symptom rather than the headline: a broken glob also finishes fast and exits 0, but it takes Preflight <em>and</em> your rules with it only in the sense that it emits nothing else — the giveaway there is that a build with a good glob and a missing directive still contains your hand-written CSS in full, which it does here. Option 3 is wrong for a different reason: replacing <code>theme</code> keys removes the values behind them, but the other families keep generating, so you would still see utilities.',
            'Bằng chứng phân biệt là <b>Preflight CÓ MẶT</b>. Preflight chính là thứ mà <code>@tailwind base</code> nở ra, nên chỉ thị ấy đã chạy và PostCSS rõ ràng hoạt động — điều đó loại phương án 1. Đo thật: một đầu vào gồm ' + c('@tailwind base; @tailwind components;') + ' không có <code>@tailwind utilities</code>, cùng một file nguồn chứa <code>mt-4</code>, cho ra một đầu ra có SỐ 0 lần xuất hiện <code>mt-4</code>, không cảnh báo, mã thoát 0. Khối tiện ích không có điểm chèn nên nó đơn giản là không bao giờ được ghi ra. Phương án 4 là cú hỏng âm thầm nổi tiếng còn lại, và đó là lý do phải đọc TOÀN BỘ triệu chứng chứ không đọc mỗi cái tít: một mẫu glob hỏng cũng xong nhanh và cũng thoát 0, nhưng dấu hiệu phân biệt là bản dựng có glob tốt mà thiếu chỉ thị thì VẪN chứa đầy đủ phần CSS bạn tự viết — đúng như ở đây. Phương án 3 sai vì một lý do khác: thay các khoá <code>theme</code> thì gỡ mất giá trị đằng sau chúng, nhưng các họ còn lại vẫn tiếp tục phát sinh, nên bạn vẫn sẽ thấy tiện ích.',
          ),
        }),

        // q4 · đáp án 3
        mcq({
          prompt: B(
            '"Utility classes are just inline styles with extra steps." What does a built stylesheet show that <code>style={{}}</code> cannot express at all?',
            '"Lớp tiện ích chỉ là inline style thêm mấy bước rườm rà." Một bảng kiểu đã dựng cho thấy thứ gì mà <code>style={{}}</code> hoàn toàn KHÔNG diễn đạt nổi?',
          ),
          options: [
            B(
              'Shorthand properties: an inline style object can only set longhand declarations, so <code>padding</code> has to be written as four separate keys',
              'Thuộc tính viết tắt: một object inline style chỉ đặt được khai báo dạng dài, nên <code>padding</code> phải viết thành bốn khoá riêng',
            ),
            B(
              'CSS custom properties: variables cannot appear in an inline style, so any theme value has to be duplicated into every element that uses it',
              'Thuộc tính tuỳ chỉnh CSS: biến không xuất hiện được trong inline style, nên mọi giá trị theme phải được nhân bản vào từng phần tử dùng nó',
            ),
            B(
              'Numeric units: an inline style takes only unitless numbers, so <code>rem</code>-based spacing needs a conversion step that utilities do for you',
              'Đơn vị số: inline style chỉ nhận số không đơn vị, nên khoảng cách theo <code>rem</code> cần một bước quy đổi mà tiện ích làm hộ bạn',
            ),
            B(
              'Conditional rules: <code>hover:</code>, <code>md:</code>, <code>group-hover:</code> and <code>dark:</code> compile to pseudo-classes, media queries and descendant selectors, and the inline style attribute has no syntax for any of them',
              'Quy tắc có điều kiện: <code>hover:</code>, <code>md:</code>, <code>group-hover:</code> và <code>dark:</code> biên dịch ra lớp giả, truy vấn phương tiện và selector con cháu, mà thuộc tính inline style không có cú pháp nào cho bất kỳ cái nào trong số đó',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the objection worth answering with a measurement rather than an opinion, and the measurement is structural, not stylistic. The <code>style</code> attribute holds a declaration list — property and value, nothing more. It has no place to put a condition. Every variant in this course compiles to something that <em>is</em> a condition: <code>hover:p-2</code> becomes ' + c('.hover\\:p-2:hover') + ', <code>md:p-8</code> becomes a rule inside ' + c('@media (min-width: 768px)') + ', <code>group-hover:underline</code> becomes ' + c('.group:hover .group-hover\\:underline') + ', and with <code>darkMode: "selector"</code> a <code>dark:</code> utility becomes ' + c('.dark\\:bg-black:where(.dark, .dark *)') + '. None of those four can be written into a style object at all — not awkwardly, not verbosely: there is no syntax. Options 1 and 3 are simply false about the DOM API (shorthands work, and <code>padding: "1rem"</code> is a normal string). Option 2 is the trap, because it is <em>almost</em> right in spirit but wrong in fact: custom properties are perfectly legal in an inline style, and chapter 6 depends on exactly that.',
            'Đây là lời phản đối đáng trả lời bằng một phép đo chứ không bằng một ý kiến, và phép đo ấy mang tính CẤU TRÚC chứ không phải sở thích. Thuộc tính <code>style</code> chứa một danh sách khai báo — thuộc tính và giá trị, hết. Nó không có chỗ nào để đặt một ĐIỀU KIỆN. Mọi biến thể trong khoá này đều biên dịch ra một thứ CHÍNH LÀ điều kiện: <code>hover:p-2</code> thành ' + c('.hover\\:p-2:hover') + ', <code>md:p-8</code> thành một quy tắc nằm trong ' + c('@media (min-width: 768px)') + ', <code>group-hover:underline</code> thành ' + c('.group:hover .group-hover\\:underline') + ', và với <code>darkMode: "selector"</code> thì một tiện ích <code>dark:</code> thành ' + c('.dark\\:bg-black:where(.dark, .dark *)') + '. Không cái nào trong bốn cái đó viết được vào một object style — không phải vụng về, không phải dài dòng: đơn giản là KHÔNG CÓ cú pháp. Phương án 1 và 3 sai trắng về API của DOM (viết tắt vẫn chạy, và <code>padding: "1rem"</code> là một chuỗi bình thường). Phương án 2 là cái bẫy, vì nó GẦN đúng về tinh thần mà sai về sự thật: thuộc tính tuỳ chỉnh hoàn toàn hợp lệ trong inline style, và cả chương 6 dựa vào đúng điều đó.',
          ),
        }),

        /* ── Chương 1 — Cái thang (5 câu) ───────────────────────────────── */

        // q5 · đáp án 1
        mcq({
          prompt: B(
            'The default spacing scale has 35 keys. Which statement about it is <b>true</b> as resolved by <code>resolveConfig</code> on Tailwind 3.4.14?',
            'Thang khoảng cách mặc định có 35 khoá. Phát biểu nào về nó là ĐÚNG theo kết quả <code>resolveConfig</code> của Tailwind 3.4.14?',
          ),
          options: [
            B(
              'Every key equals the number times 4px without exception, so <code>p-0.5</code> is 2px and <code>p-px</code> is 4px, keeping the rule perfectly uniform',
              'Mọi khoá đều bằng con số nhân 4px không ngoại lệ, nên <code>p-0.5</code> là 2px và <code>p-px</code> là 4px, giữ luật hoàn toàn đồng nhất',
            ),
            B(
              'Numeric keys are the number times 4px — <code>p-4</code> is 1rem, <code>p-96</code> is 24rem — but <code>px</code> is the literal 1px and breaks the rule on purpose',
              'Các khoá SỐ bằng con số nhân 4px — <code>p-4</code> là 1rem, <code>p-96</code> là 24rem — nhưng <code>px</code> là 1px nguyên văn và cố ý phá luật',
            ),
            B(
              'The keys are pixel values throughout, so <code>p-4</code> emits <code>padding: 4px</code> and only the fractional keys such as <code>p-0.5</code> are expressed in rem',
              'Các khoá đều là giá trị pixel, nên <code>p-4</code> phát sinh <code>padding: 4px</code> và chỉ những khoá thập phân như <code>p-0.5</code> mới tính bằng rem',
            ),
            B(
              'The scale is generated on demand, so any integer works and <code>p-7</code>, <code>p-9</code> and <code>p-13</code> all resolve without an arbitrary value',
              'Cái thang được sinh theo yêu cầu, nên số nguyên nào cũng chạy và <code>p-7</code>, <code>p-9</code>, <code>p-13</code> đều phân giải được mà không cần giá trị tuỳ ý',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Read straight out of <code>resolveConfig</code>: 35 keys, <code>spacing["4"] === "1rem"</code>, <code>spacing["96"] === "24rem"</code>, <code>spacing["0.5"] === "0.125rem"</code> (2px), and <code>spacing["px"] === "1px"</code>. So the rule is "number × 4px", expressed in <code>rem</code> at a 16px root, and it holds for every numeric key including the halves — <code>3.5</code> is <code>0.875rem</code>, which is 14px, which is 3.5 × 4. The one deliberate exception is <code>px</code>, whose entire purpose is to give you a hairline that does <em>not</em> scale with the root font size, which is why borders and dividers use it. That single exception is what makes option 1 wrong. Option 3 gets the unit backwards and would make <code>p-4</code> a quarter of its real size. Option 4 describes the arbitrary-value syntax rather than the scale: <code>p-7</code> is genuinely absent, and asking for it gives you nothing unless you write <code>p-[1.75rem]</code>.',
            'Đọc thẳng từ <code>resolveConfig</code>: 35 khoá, <code>spacing["4"] === "1rem"</code>, <code>spacing["96"] === "24rem"</code>, <code>spacing["0.5"] === "0.125rem"</code> (2px), và <code>spacing["px"] === "1px"</code>. Vậy luật là "con số × 4px", biểu diễn bằng <code>rem</code> ở cỡ gốc 16px, và nó đúng cho mọi khoá số kể cả các khoá rưỡi — <code>3.5</code> là <code>0.875rem</code>, tức 14px, tức 3,5 × 4. Ngoại lệ CỐ Ý duy nhất là <code>px</code>, thứ sinh ra chỉ để cho bạn một đường mảnh KHÔNG co giãn theo cỡ chữ gốc, và đó là lý do viền với đường phân cách dùng nó. Đúng cái ngoại lệ duy nhất ấy làm phương án 1 sai. Phương án 3 đảo ngược đơn vị và sẽ làm <code>p-4</code> nhỏ đi bốn lần so với thật. Phương án 4 mô tả cú pháp giá trị tuỳ ý chứ không phải cái thang: <code>p-7</code> thật sự KHÔNG có, và gọi nó thì bạn chẳng được gì trừ khi viết <code>p-[1.75rem]</code>.',
          ),
        }),

        // q6 · đáp án 3
        mcq({
          prompt: B(
            'The default <code>fontSize</code> scale is <code>xs, sm, base, lg, xl, 2xl … 9xl</code>, with <code>xs</code> resolving to <code>0.75rem</code>. What does that fact predict about a real codebase?',
            'Thang <code>fontSize</code> mặc định là <code>xs, sm, base, lg, xl, 2xl … 9xl</code>, với <code>xs</code> phân giải thành <code>0.75rem</code>. Sự thật đó dự đoán điều gì về một kho mã thật?',
          ),
          options: [
            B(
              'Nothing in particular — the scale is open at both ends, so <code>text-3xs</code> and <code>text-10xl</code> resolve whenever a design needs them',
              'Chẳng dự đoán gì đặc biệt — cái thang mở ở cả hai đầu, nên <code>text-3xs</code> và <code>text-10xl</code> phân giải được bất cứ khi nào thiết kế cần',
            ),
            B(
              'That small text is impossible, so any design under 12px has to be done with <code>transform: scale()</code> on a wrapper element',
              'Rằng chữ nhỏ là bất khả, nên mọi thiết kế dưới 12px phải làm bằng <code>transform: scale()</code> lên một phần tử bọc ngoài',
            ),
            B(
              'That <code>text-xs</code> is the design system\'s minimum by policy, and Tailwind rejects a build that tries to go below it',
              'Rằng <code>text-xs</code> là mức tối thiểu do hệ thiết kế quy định, và Tailwind từ chối một bản dựng cố đi thấp hơn nó',
            ),
            B(
              'That anything below 12px must leave the scale, so 10px and 11px labels show up as arbitrary values such as <code>text-[10px]</code> — and a cluster of those marks a real gap in the scale',
              'Rằng mọi thứ dưới 12px đều phải THOÁT ra ngoài thang, nên nhãn 10px và 11px hiện ra dưới dạng giá trị tuỳ ý như <code>text-[10px]</code> — và một cụm những cái đó đánh dấu một lỗ hổng thật trong thang',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The measured scale starts at <code>xs = 0.75rem</code> = 12px and has nothing below it, while real interfaces routinely want a 10px or 11px caption, badge or table label. Since there is no key for those, every one of them has to be written as an arbitrary value, and that is exactly what shows up when you count: a large, repeated cluster of <code>text-[10px]</code> and <code>text-[11px]</code>. The point of counting is not to shame arbitrary values — it is that a <em>cluster</em> of them at one value is a message. One-off arbitrary values are fine; the same one appearing hundreds of times is the scale telling you it is missing a step, and the fix is a config entry (<code>fontSize: { "2xs": "0.625rem" }</code>) so the value gets a name and a single place to change. Option 1 is false: <code>text-3xs</code> generates nothing. Option 2 is a real technique for a different problem, but it is not required here and it breaks accessibility zoom. Option 3 invents an enforcement Tailwind does not have — going below the scale is silently allowed, which is precisely why it needs measuring.',
            'Cái thang đo được bắt đầu ở <code>xs = 0.75rem</code> = 12px và không có gì dưới nó, trong khi giao diện thật thường xuyên cần một dòng chú thích, một huy hiệu hay một nhãn bảng cỡ 10px hoặc 11px. Vì không có khoá nào cho chúng, từng cái một buộc phải viết dưới dạng giá trị tuỳ ý, và đó chính xác là thứ hiện ra khi bạn đếm: một cụm lớn, lặp đi lặp lại của <code>text-[10px]</code> và <code>text-[11px]</code>. Ý nghĩa của việc đếm không phải để chê giá trị tuỳ ý — mà là một CỤM chúng dồn vào cùng một giá trị chính là một thông điệp. Vài giá trị tuỳ ý lẻ tẻ thì ổn; cùng một giá trị xuất hiện hàng trăm lần là cái thang đang nói với bạn rằng nó thiếu một bậc, và cú vá là một mục cấu hình (<code>fontSize: { "2xs": "0.625rem" }</code>) để giá trị ấy có một cái tên và một chỗ duy nhất để sửa. Phương án 1 sai: <code>text-3xs</code> không sinh ra gì. Phương án 2 là một kỹ thuật thật cho một bài toán khác, nhưng ở đây không cần và nó phá luôn khả năng phóng to để tiếp cận. Phương án 3 bịa ra một sự cưỡng chế mà Tailwind không có — đi xuống dưới thang được cho phép trong IM LẶNG, và đó chính xác là lý do nó cần được ĐO.',
          ),
        }),

        // q7 · đáp án 0
        mcq({
          prompt: B(
            'Grey body text on a white card. Which step of the default <code>slate</code> family is the lowest one that passes WCAG AA for normal text, and what is its measured ratio?',
            'Chữ thân bài màu xám trên một thẻ trắng. Bậc nào của họ <code>slate</code> mặc định là bậc THẤP NHẤT đạt WCAG AA cho chữ thường, và tỉ số đo được của nó là bao nhiêu?',
          ),
          options: [
            B(
              '<code>slate-500</code> (#64748b) at 4.76:1 — <code>slate-400</code> measures 2.56:1 and fails the 4.5:1 threshold outright',
              '<code>slate-500</code> (#64748b) với 4,76:1 — <code>slate-400</code> đo được 2,56:1 và trượt thẳng ngưỡng 4,5:1',
            ),
            B(
              '<code>slate-400</code> (#94a3b8) at 4.61:1 — it clears 4.5:1, and 500 is only needed for text under 18px',
              '<code>slate-400</code> (#94a3b8) với 4,61:1 — nó vượt 4,5:1, và bậc 500 chỉ cần cho chữ dưới 18px',
            ),
            B(
              '<code>slate-300</code> (#cbd5e1) at 4.52:1 — the palette is tuned so every step from 300 up is AA-safe on white',
              '<code>slate-300</code> (#cbd5e1) với 4,52:1 — bảng màu được chỉnh sao cho mọi bậc từ 300 trở lên đều an toàn AA trên nền trắng',
            ),
            B(
              '<code>slate-700</code> (#334155) at 4.83:1 — steps below 700 are decorative and none of them reach the threshold',
              '<code>slate-700</code> (#334155) với 4,83:1 — các bậc dưới 700 mang tính trang trí và không bậc nào chạm ngưỡng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Computed from the resolved palette with the WCAG relative-luminance formula: <code>slate-400</code> #94a3b8 on #ffffff is <b>2.56:1</b>, <code>slate-500</code> #64748b is <b>4.76:1</b>, <code>slate-600</code> #475569 is 7.58:1, and <code>slate-300</code> #cbd5e1 is a decorative 1.48:1. AA for normal text asks 4.5:1, so 500 is the first step that clears it — with very little headroom, which is worth knowing before someone "softens" the text one step. This single number replaces a whole class of arguments: <b>step 500 is the floor for body text on white</b>, 400 and lighter belong to borders, dividers and disabled states, where WCAG 1.4.11 asks only 3:1 for meaningful UI boundaries and nothing at all for purely decorative rules. Option 2 quotes a ratio <code>slate-400</code> does not have and also misstates the large-text rule, which is 3:1 and applies at 18.66px bold or 24px regular. Options 3 and 4 are both off by enough steps to be visibly wrong on screen.',
            'Tính từ bảng màu đã phân giải bằng công thức độ chói tương đối của WCAG: <code>slate-400</code> #94a3b8 trên #ffffff là <b>2,56:1</b>, <code>slate-500</code> #64748b là <b>4,76:1</b>, <code>slate-600</code> #475569 là 7,58:1, còn <code>slate-300</code> #cbd5e1 là 1,48:1 thuần trang trí. AA cho chữ thường đòi 4,5:1, nên 500 là bậc đầu tiên vượt qua — với rất ít dư địa, điều đáng biết trước khi ai đó "làm dịu" chữ đi thêm một bậc. Đúng một con số này thay thế cả một loại tranh cãi: <b>bậc 500 là cái SÀN cho chữ thân bài trên nền trắng</b>, còn 400 và nhạt hơn thuộc về viền, đường phân cách và trạng thái vô hiệu, chỗ mà WCAG 1.4.11 chỉ đòi 3:1 cho ranh giới giao diện CÓ NGHĨA và không đòi gì cho đường thuần trang trí. Phương án 2 trích một tỉ số mà <code>slate-400</code> không có, đồng thời nói sai luật chữ lớn — luật ấy là 3:1 và áp cho 18,66px đậm hoặc 24px thường. Phương án 3 và 4 đều lệch đủ nhiều bậc để nhìn bằng mắt cũng thấy sai.',
          ),
        }),

        // q8 · đáp án 2
        mcq({
          prompt: B(
            'The resolved <code>width</code> theme has 70 keys while <code>spacing</code> has 35. What makes up the other 35, and why does it matter?',
            'Bảng <code>width</code> sau khi phân giải có 70 khoá trong khi <code>spacing</code> chỉ có 35. Ba mươi lăm khoá còn lại là gì, và vì sao điều đó quan trọng?',
          ),
          options: [
            B(
              'Negative counterparts of every spacing key, so <code>w--4</code> exists alongside <code>w-4</code> for pulling an element outside its container',
              'Bản âm của mọi khoá khoảng cách, nên <code>w--4</code> tồn tại song song với <code>w-4</code> để kéo một phần tử ra ngoài khung chứa nó',
            ),
            B(
              'A duplicate set in pixel units, so <code>w-4</code> is rem-based and <code>w-4px</code> is the pixel equivalent for borders and hairlines',
              'Một bộ nhân bản theo đơn vị pixel, nên <code>w-4</code> tính theo rem còn <code>w-4px</code> là bản pixel tương đương cho viền và đường mảnh',
            ),
            B(
              'Values that are not lengths at all — fractions such as <code>w-1/3</code>, plus <code>full</code>, <code>screen</code>, <code>min</code>, <code>max</code> and <code>fit</code>, which resolve against context rather than the root font size',
              'Những giá trị KHÔNG phải độ dài — phân số như <code>w-1/3</code>, cộng <code>full</code>, <code>screen</code>, <code>min</code>, <code>max</code> và <code>fit</code>, thứ phân giải theo NGỮ CẢNH chứ không theo cỡ chữ gốc',
            ),
            B(
              'Responsive variants baked into the key itself, one per breakpoint, which is why <code>w-4</code> silently changes value at each screen size',
              'Các biến thể đáp ứng nướng sẵn vào chính cái khoá, mỗi điểm ngắt một cái, và đó là lý do <code>w-4</code> âm thầm đổi giá trị ở mỗi cỡ màn hình',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<code>width</code> inherits the 35 spacing keys and adds 35 of a completely different kind: the fraction family (<code>1/2</code> through <code>11/12</code>), <code>auto</code>, <code>full</code>, <code>screen</code>, <code>svw/lvw/dvw</code>, <code>min</code>, <code>max</code> and <code>fit</code>. The second group is the one worth learning, because those values are not numbers at all — they are <em>relationships</em>. <code>w-1/3</code> is a percentage of the parent, <code>w-screen</code> is a percentage of the viewport, and <code>w-fit</code> is a function of the content. That difference is what makes a layout survive a narrow window: <code>w-96</code> is a promise you will break at 375px, while <code>w-full</code> and <code>w-fit</code> cannot be broken because they have no fixed number to break. Option 1 confuses the negative-value syntax, which is a leading minus on the class (<code>-mt-4</code>) and applies to margins, not widths. Options 2 and 4 both describe machinery Tailwind does not have — the pixel escape hatch is <code>w-[4px]</code>, and breakpoint behaviour comes from a prefix, never from the key.',
            '<code>width</code> kế thừa 35 khoá khoảng cách rồi thêm 35 khoá thuộc loại HOÀN TOÀN khác: họ phân số (<code>1/2</code> tới <code>11/12</code>), <code>auto</code>, <code>full</code>, <code>screen</code>, <code>svw/lvw/dvw</code>, <code>min</code>, <code>max</code> và <code>fit</code>. Nhóm thứ hai mới là nhóm đáng học, vì những giá trị ấy không phải con số — chúng là các QUAN HỆ. <code>w-1/3</code> là một phần trăm của phần tử cha, <code>w-screen</code> là một phần trăm của khung nhìn, còn <code>w-fit</code> là một hàm của nội dung. Đúng sự khác biệt đó làm một bố cục sống sót qua một cửa sổ hẹp: <code>w-96</code> là một lời hứa bạn sẽ phá ở 375px, trong khi <code>w-full</code> và <code>w-fit</code> không thể bị phá vì chúng không có con số cố định nào để mà phá. Phương án 1 nhầm với cú pháp giá trị âm, vốn là một dấu trừ đứng đầu tên lớp (<code>-mt-4</code>) và áp cho lề chứ không cho chiều rộng. Phương án 2 và 4 đều mô tả những cơ chế Tailwind không có — cửa thoát pixel là <code>w-[4px]</code>, còn hành vi theo điểm ngắt đến từ một tiền tố, không bao giờ đến từ cái khoá.',
          ),
        }),

        // q9 · đáp án 1
        mcq({
          prompt: B(
            'How is the default colour palette shaped, and what follows for guessing a class you have never used?',
            'Bảng màu mặc định có hình dạng thế nào, và từ đó suy ra gì cho việc ĐOÁN một lớp bạn chưa từng dùng?',
          ),
          options: [
            B(
              '8 families of 5 steps each, named by role (<code>primary</code>, <code>danger</code>…), so a colour you have not configured cannot be guessed at all',
              '8 họ mỗi họ 5 bậc, đặt tên theo vai trò (<code>primary</code>, <code>danger</code>…), nên một màu bạn chưa cấu hình thì không thể đoán được',
            ),
            B(
              '22 families of 11 steps (50, 100…900, 950), so <code>bg-<em>family</em>-<em>step</em></code> is derivable — <code>bg-teal-950</code> works without ever having seen it written',
              '22 họ, mỗi họ 11 bậc (50, 100…900, 950), nên <code>bg-<em>họ</em>-<em>bậc</em></code> là SUY RA ĐƯỢC — <code>bg-teal-950</code> chạy dù bạn chưa từng thấy ai viết nó',
            ),
            B(
              '22 families of 9 steps (100 through 900), with 50 and 950 available only after enabling them explicitly in the config',
              '22 họ, mỗi họ 9 bậc (100 tới 900), còn 50 và 950 chỉ dùng được sau khi bật tường minh trong cấu hình',
            ),
            B(
              'A continuous ramp, so any multiple of 50 resolves and <code>bg-blue-350</code> is interpolated between the neighbouring steps',
              'Một dải liên tục, nên mọi bội số của 50 đều phân giải được và <code>bg-blue-350</code> được nội suy giữa hai bậc kề nó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Read from <code>resolveConfig</code>: 22 object-valued families (<code>slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose</code>), each with the 11 keys <code>50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950</code>. That regularity is the whole point of the chapter: you are not memorising 242 class names, you are memorising one grammar plus 22 nouns, and everything else is derivable. It also means the answer to "is there a <code>bg-teal-950</code>?" is yes, without looking, and the answer to "is there a <code>bg-blue-350</code>?" is no, also without looking — option 4 fails because nothing is interpolated; a missing step generates nothing at all. Option 3 gets the shape almost right and is the most common stale belief, because 950 <em>was</em> added later (in 3.3) and plenty of tutorials predate it. Option 1 describes a role-named palette, which is what you build on top in chapter 5, not what ships.',
            'Đọc từ <code>resolveConfig</code>: 22 họ có giá trị là object (<code>slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose</code>), mỗi họ có 11 khoá <code>50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950</code>. Chính sự đều đặn ấy là toàn bộ thông điệp của chương: bạn không học thuộc 242 tên lớp, bạn học thuộc MỘT ngữ pháp cộng 22 danh từ, và mọi thứ còn lại suy ra được. Nó cũng có nghĩa câu trả lời cho "có <code>bg-teal-950</code> không?" là CÓ, khỏi tra, và câu trả lời cho "có <code>bg-blue-350</code> không?" là KHÔNG, cũng khỏi tra — phương án 4 sai vì chẳng có gì được nội suy cả; một bậc không tồn tại thì không sinh ra gì hết. Phương án 3 gần đúng về hình dạng và là niềm tin cũ phổ biến nhất, vì bậc 950 ĐÚNG LÀ được thêm sau (ở bản 3.3) và rất nhiều hướng dẫn ra đời trước đó. Phương án 1 mô tả một bảng màu đặt tên theo vai trò, thứ bạn tự dựng thêm ở chương 5, không phải thứ có sẵn.',
          ),
        }),

        /* ── Chương 2 — Biến thể (5 câu) ────────────────────────────────── */

        // q10 · đáp án 2
        mcq({
          prompt: B(
            'A source file contains <code>group-hover:text-red-500</code> and <b>no element anywhere carries the class <code>group</code></b>. What does the build produce?' +
            code('$ grep -A2 group out.css\n' +
                 '???'),
            'Một file mã nguồn chứa <code>group-hover:text-red-500</code> và KHÔNG phần tử nào ở đâu mang lớp <code>group</code>. Lượt dựng cho ra cái gì?' +
            code('$ grep -A2 group out.css\n' +
                 '???'),
          ),
          options: [
            B(
              'Nothing, and a build warning: Tailwind cross-checks group variants against the presence of a <code>group</code> class and drops the ones that cannot match',
              'Không gì cả, kèm một cảnh báo lúc dựng: Tailwind đối chiếu các biến thể group với sự hiện diện của lớp <code>group</code> và loại bỏ những cái không thể khớp',
            ),
            B(
              'A rule with the selector <code>.group-hover\\:text-red-500:hover</code>, because with no group present the variant degrades to a plain hover',
              'Một quy tắc với selector <code>.group-hover\\:text-red-500:hover</code>, vì khi không có group nào thì biến thể thoái lui thành một hover thường',
            ),
            B(
              'A perfectly valid rule, <code>.group:hover .group-hover\\:text-red-500</code>, that exists and can never match anything — a silent failure with no error to read',
              'Một quy tắc hoàn toàn hợp lệ, <code>.group:hover .group-hover\\:text-red-500</code>, tồn tại và không bao giờ khớp được với gì — một cú hỏng âm thầm không có lỗi nào để đọc',
            ),
            B(
              'A rule scoped to <code>:root</code>, so the style applies whenever the document itself is hovered, which is almost always',
              'Một quy tắc giới hạn vào <code>:root</code>, nên kiểu dáng áp mỗi khi chính tài liệu được rê chuột, tức gần như luôn luôn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured: with a single source file containing only <code>group-hover:text-red-500</code>, the output contains ' + c('.group:hover .group-hover\\:text-red-500 { --tw-text-opacity: 1; color: rgb(239 68 68 / var(--tw-text-opacity)); }') + ' — a complete, valid, correctly-generated descendant rule. Tailwind generates the utility half of the pair; the <code>group</code> marker class is your job on the ancestor, and nothing verifies you did it. That is the exact anatomy of the failure this variant is famous for: the class is spelled right, the CSS is right, DevTools shows the rule in the stylesheet, and the style never applies, because the left half of the selector matches no element. The diagnosis is not "is the rule generated" (it is) but "does the ancestor carry <code>group</code>". Note also the specificity: two classes, 0-2-0, which is why a group variant beats a plain utility that sets the same property regardless of emit order. Options 1 and 2 both invent a cross-check or a fallback; Tailwind has neither. Option 4 describes nothing in the output.',
            'Đo thật: với một file nguồn duy nhất chỉ chứa <code>group-hover:text-red-500</code>, đầu ra chứa ' + c('.group:hover .group-hover\\:text-red-500 { --tw-text-opacity: 1; color: rgb(239 68 68 / var(--tw-text-opacity)); }') + ' — một quy tắc con cháu trọn vẹn, hợp lệ, phát sinh đúng. Tailwind sinh ra NỬA tiện ích của cặp; lớp đánh dấu <code>group</code> trên phần tử tổ tiên là việc của bạn, và không có gì kiểm chứng bạn đã làm. Đó chính xác là giải phẫu của cú hỏng mà biến thể này nổi tiếng: tên lớp gõ đúng, CSS đúng, DevTools thấy quy tắc nằm trong bảng kiểu, và kiểu dáng không bao giờ áp, vì nửa TRÁI của selector không khớp phần tử nào. Câu chẩn đoán không phải "quy tắc có được sinh ra không" (có) mà là "phần tử tổ tiên có mang <code>group</code> không". Cũng để ý độ đặc hiệu: hai lớp, 0-2-0, đó là lý do một biến thể group thắng một tiện ích thường đặt cùng thuộc tính bất kể thứ tự phát sinh. Phương án 1 và 2 đều bịa ra một phép đối chiếu hoặc một cú thoái lui; Tailwind không có cái nào. Phương án 4 mô tả một thứ không có trong đầu ra.',
          ),
        }),

        // q11 · đáp án 0
        mcq({
          prompt: B(
            '<code>peer-checked:block</code> compiles to <code>.peer:checked ~ .peer-checked\\:block</code>. Which markup can that rule actually style?',
            '<code>peer-checked:block</code> biên dịch ra <code>.peer:checked ~ .peer-checked\\:block</code>. Quy tắc đó thật sự tạo kiểu được cho mã đánh dấu nào?',
          ),
          options: [
            B(
              'Only an element that is a <b>later sibling</b> of the checked input, inside the same parent — a parent, an ancestor or an earlier sibling can never be reached',
              'Chỉ một phần tử là ANH EM ĐỨNG SAU của cái input được tick, trong cùng một phần tử cha — cha, tổ tiên hay anh em đứng TRƯỚC thì không bao giờ với tới',
            ),
            B(
              'Any descendant of the checked input, the same way <code>group-checked:</code> reaches into a subtree',
              'Bất kỳ phần tử con cháu nào của cái input được tick, y như cách <code>group-checked:</code> với vào một cây con',
            ),
            B(
              'Any element in the document, since <code>~</code> is the general sibling combinator and Tailwind scopes it to the document root',
              'Bất kỳ phần tử nào trong tài liệu, vì <code>~</code> là bộ kết hợp anh em tổng quát và Tailwind giới hạn nó vào gốc tài liệu',
            ),
            B(
              'The checked input itself, because <code>~</code> in a Tailwind selector includes the subject element as well as its siblings',
              'Chính cái input được tick, vì <code>~</code> trong selector của Tailwind bao gồm cả phần tử chủ thể lẫn anh em của nó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The generated selector is ordinary CSS and it means exactly what CSS says: <code>~</code> is the subsequent-sibling combinator, so the styled element must share a parent with the <code>.peer</code> and must come <em>after</em> it in document order. This is the single most common way <code>peer-</code> fails in practice — the markup is written label-then-input or input-inside-label, and the rule is generated and correct but the target is in the wrong position, so nothing happens and there is nothing to read. The practical shape that always works is: input first, carrying <code>peer</code>; then the elements that react to it, as later siblings. When you genuinely need to style an ancestor or an earlier sibling, <code>peer-</code> is the wrong tool — use <code>group</code> on a common ancestor, or <code>has-[:checked]:</code>, which Tailwind 3.4 supports and which compiles to <code>:has()</code> on the parent. Option 2 swaps peer for group. Option 3 misreads <code>~</code> as a global selector. Option 4 would need <code>:checked</code> on the element itself, which is what a plain <code>checked:</code> variant does.',
            'Cái selector được phát sinh là CSS thuần và nó có nghĩa đúng như CSS nói: <code>~</code> là bộ kết hợp anh em ĐỨNG SAU, nên phần tử được tạo kiểu phải chung một cha với <code>.peer</code> và phải đứng SAU nó theo thứ tự tài liệu. Đây là cách <code>peer-</code> hỏng phổ biến nhất trong thực tế — mã đánh dấu viết nhãn-trước-input hoặc input-nằm-trong-nhãn, và quy tắc vẫn được sinh ra và vẫn đúng, nhưng đích ngắm nằm sai vị trí, nên chẳng có gì xảy ra và cũng chẳng có gì để đọc. Hình dạng luôn chạy trong thực tế là: input trước, mang lớp <code>peer</code>; rồi tới những phần tử phản ứng theo nó, dưới dạng anh em đứng sau. Khi bạn thật sự cần tạo kiểu cho một tổ tiên hay một anh em đứng trước thì <code>peer-</code> là công cụ sai — hãy dùng <code>group</code> trên một tổ tiên chung, hoặc <code>has-[:checked]:</code>, thứ Tailwind 3.4 có hỗ trợ và biên dịch thành <code>:has()</code> đặt trên phần tử cha. Phương án 2 đổi peer thành group. Phương án 3 đọc nhầm <code>~</code> thành một selector toàn cục. Phương án 4 sẽ cần <code>:checked</code> đặt trên chính phần tử đó, và đó là việc của biến thể <code>checked:</code> thường.',
          ),
        }),

        // q12 · đáp án 3
        mcq({
          prompt: B(
            'These classes are written in this deliberately scrambled order. What does the built CSS look like?' +
            code('<div class="2xl:p-1 sm:p-2 p-3 xl:p-4 md:p-5 lg:p-6 max-md:p-7 min-[900px]:p-8">'),
            'Những lớp này được viết theo đúng thứ tự lộn xộn cố ý này. CSS đầu ra trông ra sao?' +
            code('<div class="2xl:p-1 sm:p-2 p-3 xl:p-4 md:p-5 lg:p-6 max-md:p-7 min-[900px]:p-8">'),
          ),
          options: [
            B(
              'The blocks come out in the order written, which is why mixing breakpoint prefixes randomly is a real source of responsive bugs',
              'Các khối đi ra theo đúng thứ tự viết, và đó là lý do trộn lẫn tiền tố điểm ngắt một cách ngẫu nhiên là một nguồn lỗi đáp ứng có thật',
            ),
            B(
              'Every prefixed rule is emitted with an added <code>!important</code>, which is how a larger breakpoint overrides a smaller one',
              'Mọi quy tắc có tiền tố được phát sinh kèm thêm <code>!important</code>, và đó là cách một điểm ngắt lớn hơn đè lên một điểm ngắt nhỏ hơn',
            ),
            B(
              'Each prefix raises specificity by one class, so <code>2xl:</code> ends up at 0-6-0 and wins by weight rather than by position',
              'Mỗi tiền tố nâng độ đặc hiệu thêm một lớp, nên <code>2xl:</code> kết thúc ở 0-6-0 và thắng bằng TRỌNG LƯỢNG chứ không bằng vị trí',
            ),
            B(
              'Unprefixed first, then <code>max-md</code> as a <code>not all and (min-width: 768px)</code> block, then the min-width blocks in strictly ascending order with <code>min-[900px]</code> slotted between <code>md</code> and <code>lg</code>',
              'Không tiền tố trước, rồi <code>max-md</code> dưới dạng khối <code>not all and (min-width: 768px)</code>, rồi các khối min-width theo thứ tự TĂNG DẦN nghiêm ngặt với <code>min-[900px]</code> chèn vào giữa <code>md</code> và <code>lg</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured output, in file order: <code>.p-3</code>; then ' + c('@media not all and (min-width: 768px)') + ' holding <code>.max-md\\:p-7</code>; then min-width 640, 768, <b>900</b>, 1024, 1280, 1536. Two things are worth taking from that. First, the ascending sort is what makes mobile-first work at all: because every breakpoint block sits later in the file than every smaller one, and all of them have identical 0-1-0 specificity, the largest <em>matching</em> query wins on source order alone. You get that for free no matter how you type the classes. Second, an arbitrary breakpoint is sorted by its actual value, not appended at the end — <code>min-[900px]</code> lands between <code>md</code> (768) and <code>lg</code> (1024), exactly where a reader would expect it. The consequence to carry into chapter 7: because responsive utilities win by <em>position</em> and not by weight, any hand-written rule with two classes (0-2-0) beats all of them everywhere, and no amount of adding breakpoints will fix that. Options 2 and 3 both invent mechanisms Tailwind does not use — and if either were true, <code>md:p-5</code> would be unoverridable by a component-level rule.',
            'Đầu ra đo được, theo thứ tự trong file: <code>.p-3</code>; rồi ' + c('@media not all and (min-width: 768px)') + ' chứa <code>.max-md\\:p-7</code>; rồi min-width 640, 768, <b>900</b>, 1024, 1280, 1536. Có hai điều đáng rút ra. Một, phép sắp tăng dần chính là thứ làm cho lối mobile-first chạy được: vì mọi khối điểm ngắt đều nằm SAU mọi khối nhỏ hơn trong file, và tất cả đều có cùng độ đặc hiệu 0-1-0, nên truy vấn KHỚP lớn nhất thắng chỉ nhờ thứ tự nguồn. Bạn được thứ đó miễn phí bất kể bạn gõ các lớp theo thứ tự nào. Hai, một điểm ngắt tuỳ ý được sắp theo GIÁ TRỊ THẬT của nó chứ không bị nối vào cuối — <code>min-[900px]</code> rơi vào giữa <code>md</code> (768) và <code>lg</code> (1024), đúng chỗ người đọc mong đợi. Hệ quả cần mang sang chương 7: vì tiện ích đáp ứng thắng nhờ VỊ TRÍ chứ không nhờ trọng lượng, nên bất kỳ quy tắc viết tay nào có hai lớp (0-2-0) cũng thắng tất cả chúng ở mọi nơi, và thêm bao nhiêu điểm ngắt cũng không chữa được. Phương án 2 và 3 đều bịa ra cơ chế Tailwind không dùng — và nếu cái nào đúng thì <code>md:p-5</code> đã không thể bị một quy tắc cấp component đè lên.',
          ),
        }),

        // q13 · đáp án 1
        mcq({
          prompt: B(
            'Same class <code>dark:bg-black</code>, three values of <code>darkMode</code>. What is the practical difference between <code>"class"</code> and <code>"selector"</code>?' +
            code('darkMode: "class"    ->  .dark\\:bg-black:is(.dark *)\n' +
                 'darkMode: "selector" ->  .dark\\:bg-black:where(.dark, .dark *)'),
            'Cùng một lớp <code>dark:bg-black</code>, ba giá trị <code>darkMode</code>. Khác biệt thực tế giữa <code>"class"</code> và <code>"selector"</code> là gì?' +
            code('darkMode: "class"    ->  .dark\\:bg-black:is(.dark *)\n' +
                 'darkMode: "selector" ->  .dark\\:bg-black:where(.dark, .dark *)'),
          ),
          options: [
            B(
              'None that matters — <code>:is()</code> and <code>:where()</code> are aliases, and <code>"selector"</code> is only a clearer name for the same behaviour',
              'Không khác biệt gì đáng kể — <code>:is()</code> và <code>:where()</code> là bí danh của nhau, và <code>"selector"</code> chỉ là một cái tên rõ nghĩa hơn cho cùng hành vi',
            ),
            B(
              '<code>:where()</code> contributes zero specificity while <code>:is()</code> contributes its argument\'s, and the <code>"selector"</code> form also matches the marked element itself, not only its descendants',
              '<code>:where()</code> đóng góp độ đặc hiệu BẰNG KHÔNG còn <code>:is()</code> đóng góp độ đặc hiệu của đối số, và dạng <code>"selector"</code> còn khớp CHÍNH phần tử được đánh dấu chứ không chỉ con cháu của nó',
            ),
            B(
              '<code>"selector"</code> reads the OS preference as well, so it combines the class strategy with <code>prefers-color-scheme</code> in a single rule',
              '<code>"selector"</code> đọc thêm cả tuỳ chọn của hệ điều hành, nên nó gộp chiến lược lớp với <code>prefers-color-scheme</code> vào chung một quy tắc',
            ),
            B(
              '<code>"class"</code> emits the rules inside a media query and <code>"selector"</code> emits them at the top level, which changes where they land in the output file',
              '<code>"class"</code> phát sinh các quy tắc bên trong một truy vấn phương tiện còn <code>"selector"</code> phát sinh chúng ở cấp trên cùng, thứ đó đổi chỗ chúng rơi vào trong file đầu ra',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Both differences are visible in the two selectors and both bite in practice. <b>Specificity:</b> <code>:is(.dark *)</code> takes the weight of its most specific argument, so the whole selector is 0-2-0, while <code>:where(...)</code> is defined to contribute nothing, leaving 0-1-0 — the same weight as an ordinary utility. That matters because a 0-2-0 dark utility silently outranks the light-mode utility it is supposed to pair with, and conflicts stop behaving symmetrically. <b>Reach:</b> <code>.dark *</code> is a descendant combinator, so with <code>"class"</code> the element carrying <code>dark</code> is not itself styled; <code>:where(.dark, .dark *)</code> lists both, so the marked element is included. If you put the class on <code>&lt;html&gt;</code> you rarely notice, but scope the theme to a panel and the panel itself stays light under <code>"class"</code>. A separate hazard, unrelated to which form you choose: naming that marker class <code>dark</code> force-activates <em>every</em> <code>dark:</code> utility in the app, which is why this repository uses <code>theme-dark</code> for its global theme and reserves <code>dark</code> for one scoped subtree. Option 3 describes the <code>media</code> strategy fused with a class strategy, which is not what either value does.',
            'Cả hai khác biệt đều nhìn thấy được ngay trong hai selector và cả hai đều cắn trong thực tế. <b>Độ đặc hiệu:</b> <code>:is(.dark *)</code> lấy trọng lượng của đối số đặc hiệu nhất, nên cả selector là 0-2-0, trong khi <code>:where(...)</code> được định nghĩa là KHÔNG đóng góp gì, để lại 0-1-0 — bằng đúng trọng lượng một tiện ích thường. Điều đó quan trọng vì một tiện ích tối 0-2-0 âm thầm cao hơn cái tiện ích sáng mà nó lẽ ra phải cặp đôi, và các xung đột thôi cư xử đối xứng. <b>Tầm với:</b> <code>.dark *</code> là bộ kết hợp con cháu, nên với <code>"class"</code> thì chính phần tử mang lớp <code>dark</code> KHÔNG được tạo kiểu; còn <code>:where(.dark, .dark *)</code> liệt kê cả hai, nên phần tử được đánh dấu cũng nằm trong. Đặt lớp lên <code>&lt;html&gt;</code> thì hiếm khi nhận ra, nhưng thu theme vào phạm vi một panel thì chính panel ấy vẫn sáng dưới <code>"class"</code>. Một hiểm hoạ riêng, không liên quan tới việc bạn chọn dạng nào: đặt tên lớp đánh dấu ấy là <code>dark</code> sẽ ÉP KÍCH HOẠT MỌI tiện ích <code>dark:</code> trong cả ứng dụng, và đó là lý do kho này dùng <code>theme-dark</code> cho theme toàn cục và để dành <code>dark</code> cho đúng một cây con có phạm vi. Phương án 3 mô tả chiến lược <code>media</code> hoà với chiến lược lớp, không phải việc mà giá trị nào trong hai giá trị này làm.',
          ),
        }),

        // q14 · đáp án 2
        mcq({
          prompt: B(
            'A reviewer says <code>hover:md:p-8</code> is a bug and must be rewritten as <code>md:hover:p-8</code>. What does building both actually show?',
            'Một người review nói <code>hover:md:p-8</code> là một con bọ và phải viết lại thành <code>md:hover:p-8</code>. Dựng thật cả hai cho thấy điều gì?',
          ),
          options: [
            B(
              'The reviewer is right: <code>hover:md:</code> generates nothing, because a media-query variant may not appear after a pseudo-class variant',
              'Người review đúng: <code>hover:md:</code> không sinh ra gì, vì một biến thể truy vấn phương tiện không được đứng sau một biến thể lớp giả',
            ),
            B(
              'The reviewer is right: <code>hover:md:</code> compiles to <code>@media (hover: hover)</code> instead of a width query, so it fires on the wrong condition',
              'Người review đúng: <code>hover:md:</code> biên dịch thành <code>@media (hover: hover)</code> thay vì một truy vấn chiều rộng, nên nó kích hoạt sai điều kiện',
            ),
            B(
              'The reviewer is wrong: both compile to the same <code>:hover</code> rule inside the same <code>min-width: 768px</code> block, so they behave identically',
              'Người review sai: cả hai biên dịch ra cùng một quy tắc <code>:hover</code> nằm trong cùng khối <code>min-width: 768px</code>, nên chúng cư xử y hệt nhau',
            ),
            B(
              'The reviewer is wrong, but for a different reason: both work, and <code>hover:md:</code> is emitted later, so it wins any conflict between the two',
              'Người review sai, nhưng vì một lý do khác: cả hai đều chạy, và <code>hover:md:</code> được phát sinh sau, nên nó thắng mọi xung đột giữa hai cái',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Built with both classes in one file, the output holds ' + c('@media (min-width: 768px) { .hover\\:md\\:bg-blue-500:hover {…} .md\\:hover\\:bg-red-500:hover {…} }') + ' — same media query, same pseudo-class, same specificity. The order you stack variants changes the <em>text</em> of the selector, never the set of elements it matches, because <code>:focus:hover</code> and <code>:hover:focus</code> are the same condition and a media wrapper is a wrapper either way. This is worth knowing for two reasons. It stops a class of review comments that cost time and fix nothing. And it isolates the cases where stacking order <em>does</em> matter — arbitrary variants such as <code>[&amp;>svg]:hover:</code> versus <code>hover:[&amp;>svg]:</code>, where the combinator changes which element the pseudo-class lands on. Option 4 is the near-miss and deserves care: the emit order does differ (alphabetically, <code>hover\\:md\\:</code> sorts before <code>md\\:hover\\:</code>, so it comes <em>first</em>, not last), but since the two rules set the same property to the same value, no conflict exists to win. Options 1 and 2 both assert build behaviour that measurement contradicts.',
            'Dựng cả hai lớp trong một file, đầu ra chứa ' + c('@media (min-width: 768px) { .hover\\:md\\:bg-blue-500:hover {…} .md\\:hover\\:bg-red-500:hover {…} }') + ' — cùng truy vấn phương tiện, cùng lớp giả, cùng độ đặc hiệu. Thứ tự bạn xếp chồng các biến thể đổi VĂN BẢN của selector, không bao giờ đổi tập phần tử mà nó khớp, vì <code>:focus:hover</code> và <code>:hover:focus</code> là cùng một điều kiện, còn một lớp bọc media thì bọc kiểu nào cũng là bọc. Điều này đáng biết vì hai lẽ. Nó chấm dứt một loại nhận xét review tốn thời gian mà không sửa được gì. Và nó cô lập những ca mà thứ tự xếp chồng THẬT SỰ có ý nghĩa — các biến thể tuỳ ý như <code>[&amp;>svg]:hover:</code> so với <code>hover:[&amp;>svg]:</code>, chỗ mà bộ kết hợp đổi việc lớp giả rơi lên phần tử nào. Phương án 4 là cú suýt trúng và cần cẩn thận: thứ tự phát sinh ĐÚNG LÀ khác (theo abc, <code>hover\\:md\\:</code> đứng trước <code>md\\:hover\\:</code>, nên nó ra TRƯỚC chứ không phải sau), nhưng vì hai quy tắc đặt cùng một thuộc tính với cùng một giá trị nên không có xung đột nào để mà thắng. Phương án 1 và 2 đều khẳng định những hành vi dựng mà phép đo bác bỏ.',
          ),
        }),

        /* ── Chương 3 — Xung đột (5 câu) ────────────────────────────────── */

        // q15 · đáp án 3
        mcq({
          prompt: B(
            'Two files are built, and the outputs are compared with <code>diff</code>:' +
            code('a.html:  <div class="p-2 p-8">\n' +
                 'b.html:  <div class="p-8 p-2">\n' +
                 '$ diff a.css b.css\n' +
                 '$ echo $?\n' +
                 '0'),
            'Hai file được dựng, rồi đầu ra được so bằng <code>diff</code>:' +
            code('a.html:  <div class="p-2 p-8">\n' +
                 'b.html:  <div class="p-8 p-2">\n' +
                 '$ diff a.css b.css\n' +
                 '$ echo $?\n' +
                 '0'),
          ),
          options: [
            B(
              'The diff is empty because both files were minified to the same canonical form; the un-minified builds would differ',
              'Diff rỗng vì cả hai file đã được rút gọn về cùng một dạng chuẩn; hai bản dựng chưa rút gọn thì sẽ khác nhau',
            ),
            B(
              'The diff is empty because both classes set <code>padding</code>, so the generator emitted only the last-written one in each case',
              'Diff rỗng vì cả hai lớp cùng đặt <code>padding</code>, nên trình sinh chỉ phát sinh cái viết sau cùng trong mỗi trường hợp',
            ),
            B(
              'The diff is empty, and in both files <code>p-2</code> wins because a smaller value is emitted later and therefore overrides',
              'Diff rỗng, và ở cả hai file <code>p-2</code> thắng vì giá trị nhỏ hơn được phát sinh sau nên đè lên',
            ),
            B(
              'The diff is empty because the class attribute is an unordered set of candidates; both builds emit <code>.p-2</code> then <code>.p-8</code>, so <code>p-8</code> wins in both',
              'Diff rỗng vì thuộc tính class chỉ là một TẬP ứng viên không thứ tự; cả hai lượt dựng đều phát sinh <code>.p-2</code> rồi <code>.p-8</code>, nên <code>p-8</code> thắng ở cả hai',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the measurement the whole chapter rests on, and it was run: the two outputs are byte-identical, and in both of them <code>.p-2</code> appears at line 557 and <code>.p-8</code> at line 561. So <code>p-8</code> wins in both files, including the one where it was written first. The reason is that the thing you type is not a CSS rule — it is a list of <em>candidate names</em> that the generator collects into a set. The set has no order; the output does, and that order comes from Tailwind\'s sort. Which means the CSS intuition everyone brings ("the last one written wins") is not merely unreliable here, it is <em>inapplicable</em>: there is no "last one written" for the browser to see. The dangerous corollary is that reordering classes sometimes appears to fix a conflict — that is a coincidence, and believing it produces a habit that fails silently on the next pair. Options 1 and 2 both assume a step that does not happen: nothing is minified into a canonical order, and no candidate is discarded for colliding with another. Option 3 gets the winner backwards.',
            'Đây là phép đo mà cả chương này tựa lên, và nó đã được chạy: hai đầu ra giống nhau từng byte, và ở cả hai thì <code>.p-2</code> xuất hiện ở dòng 557 còn <code>.p-8</code> ở dòng 561. Vậy <code>p-8</code> thắng ở CẢ HAI file, kể cả file mà nó được viết TRƯỚC. Lý do là thứ bạn gõ không phải một quy tắc CSS — nó là một danh sách TÊN ỨNG VIÊN mà trình sinh gom vào một tập hợp. Tập hợp thì không có thứ tự; đầu ra thì có, và thứ tự ấy đến từ phép sắp của Tailwind. Nghĩa là cái trực giác CSS ai cũng mang theo ("cái viết sau thắng") ở đây không chỉ là không đáng tin, nó KHÔNG ÁP DỤNG ĐƯỢC: chẳng có "cái viết sau" nào để trình duyệt nhìn thấy. Hệ quả nguy hiểm là việc sắp xếp lại các lớp ĐÔI KHI có vẻ chữa được một xung đột — đó là trùng hợp, và tin vào nó tạo ra một thói quen sẽ hỏng âm thầm ở cặp lớp tiếp theo. Phương án 1 và 2 đều giả định một bước không hề xảy ra: không có gì được rút gọn về một thứ tự chuẩn, và không ứng viên nào bị vứt vì đụng với ứng viên khác. Phương án 3 đảo ngược kẻ thắng.',
          ),
        }),

        // q16 · đáp án 1
        mcq({
          prompt: B(
            'Eleven conflicting classes on one element. Which one wins, and why?' +
            code('<div class="mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32">'),
            'Mười một lớp xung đột trên một phần tử. Cái nào thắng, và vì sao?' +
            code('<div class="mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32">'),
          ),
          options: [
            B(
              '<code>mt-32</code>, because within one property group Tailwind sorts by numeric value and the largest is emitted last',
              '<code>mt-32</code>, vì trong một nhóm thuộc tính Tailwind sắp theo GIÁ TRỊ SỐ và cái lớn nhất được phát sinh sau cùng',
            ),
            B(
              '<code>mt-8</code>, because within one property group Tailwind sorts the keys as <b>strings</b>, giving 1, 10, 12, 16, 2, 20, 24, 3, 32, 4, 8',
              '<code>mt-8</code>, vì trong một nhóm thuộc tính Tailwind sắp các khoá như CHUỖI, cho ra 1, 10, 12, 16, 2, 20, 24, 3, 32, 4, 8',
            ),
            B(
              '<code>mt-1</code>, because the first candidate found in the source wins and the rest are dropped as duplicates',
              '<code>mt-1</code>, vì ứng viên đầu tiên tìm thấy trong mã nguồn thắng và số còn lại bị loại vì trùng lặp',
            ),
            B(
              'It is undefined: the sort is not stable across builds, which is why this pattern must never be relied on',
              'Không xác định: phép sắp không ổn định qua các lượt dựng, và đó là lý do không bao giờ được dựa vào khuôn này',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured emit order for exactly these eleven: <code>.mt-1 .mt-10 .mt-12 .mt-16 .mt-2 .mt-20 .mt-24 .mt-3 .mt-32 .mt-4 .mt-8</code>. That is lexicographic string order — <code>"10"</code> sorts before <code>"2"</code> because the character <code>1</code> is less than <code>2</code> — and the last one emitted is <code>mt-8</code>, so 32px wins. Look at what it is not: not the first written, not the last written, not the largest value. It is <code>mt-8</code> for the entirely incidental reason that <code>8</code> is the last single-character key in the sorted list. No mental model predicts this; only reading the sort does. The right lesson is not to memorise it — it is that emit order inside a group is an implementation detail you must never build on. When classes genuinely need to be composed and the last one must win, that is what <code>tailwind-merge</code> is for. Option 4 is the sympathetic-sounding wrong answer: the sort is entirely deterministic and stable, which is worse than instability, because it lets a broken assumption survive testing and fail on a different pair later.',
            'Thứ tự phát sinh đo được cho đúng mười một lớp này: <code>.mt-1 .mt-10 .mt-12 .mt-16 .mt-2 .mt-20 .mt-24 .mt-3 .mt-32 .mt-4 .mt-8</code>. Đó là thứ tự chuỗi từ điển — <code>"10"</code> đứng trước <code>"2"</code> vì ký tự <code>1</code> nhỏ hơn <code>2</code> — và cái phát sinh cuối cùng là <code>mt-8</code>, nên 32px thắng. Hãy nhìn xem nó KHÔNG phải cái gì: không phải cái viết đầu, không phải cái viết cuối, không phải giá trị lớn nhất. Nó là <code>mt-8</code> vì một lý do hoàn toàn tình cờ rằng <code>8</code> là khoá một-ký-tự cuối cùng trong danh sách đã sắp. Không mô hình tinh thần nào dự đoán được cái này; chỉ ĐỌC phép sắp mới ra. Bài học đúng không phải là học thuộc nó — mà là thứ tự phát sinh trong một nhóm là một chi tiết cài đặt bạn KHÔNG BAO GIỜ được xây lên trên. Khi các lớp thật sự cần được soạn lại và cái cuối phải thắng thì đó chính là việc của <code>tailwind-merge</code>. Phương án 4 là đáp án sai nghe rất thông cảm: phép sắp hoàn toàn tất định và ổn định, và điều đó còn TỆ HƠN sự bất ổn, vì nó để một giả định sai sống sót qua khâu kiểm thử rồi hỏng ở một cặp lớp khác về sau.',
          ),
        }),

        // q17 · đáp án 2
        mcq({
          prompt: B(
            'These eight classes come out of the generator in this order. What principle does the order encode?' +
            code('.m-1  .mx-1  .ml-1  .p-1  .px-1  .py-1  .pb-1  .pt-1'),
            'Tám lớp này đi ra khỏi trình sinh theo đúng thứ tự này. Thứ tự ấy mã hoá nguyên tắc nào?' +
            code('.m-1  .mx-1  .ml-1  .p-1  .px-1  .py-1  .pb-1  .pt-1'),
          ),
          options: [
            B(
              'Alphabetical order of the full class name throughout, which happens to put margin before padding',
              'Thứ tự abc của toàn bộ tên lớp, và điều đó tình cờ đặt margin trước padding',
            ),
            B(
              'Shortest class name first, so a one-letter prefix always precedes a two-letter one regardless of what it does',
              'Tên lớp ngắn nhất trước, nên một tiền tố một chữ cái luôn đứng trước tiền tố hai chữ cái bất kể nó làm gì',
            ),
            B(
              'Whole → axis → side: the more specific utility is emitted later, so <code>pt-1</code> reliably overrides <code>py-1</code>, which reliably overrides <code>p-1</code>',
              'Toàn phần → trục → cạnh: tiện ích hẹp hơn được phát sinh sau, nên <code>pt-1</code> đè được <code>py-1</code> một cách đáng tin, và <code>py-1</code> đè được <code>p-1</code>',
            ),
            B(
              'Specificity order: <code>p-1</code> is 0-1-0, <code>px-1</code> is 0-2-0 and <code>pt-1</code> is 0-3-0, so the cascade resolves it by weight',
              'Thứ tự độ đặc hiệu: <code>p-1</code> là 0-1-0, <code>px-1</code> là 0-2-0 và <code>pt-1</code> là 0-3-0, nên cascade phân giải bằng trọng lượng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the half of Tailwind\'s sort you <em>can</em> rely on. Across property groups the order is designed, not incidental: the utility that touches more sides comes first, and the narrower one comes later, so <code>p-4 pt-8</code> does what everyone expects — 8 on top, 4 elsewhere — without any merge helper. Within a group the sort is the arbitrary string order of question 16, which you must never build on. Keeping those two halves separate is the practical takeaway of the chapter: <b>trust the designed hierarchy across groups; distrust the string sort inside a group.</b> Option 4 is the tempting one because CSS people reach for specificity first, but every one of these selectors is a single class — 0-1-0 across the board — and you can confirm it by reading them. If specificity were doing the work, <code>tailwind-merge</code> would be unnecessary. Option 1 is falsified by the output itself (<code>mx-1</code> before <code>ml-1</code> is not alphabetical), and option 2 by <code>pb-1</code> and <code>pt-1</code> both being two letters yet sitting after <code>py-1</code>.',
            'Đây là NỬA phép sắp mà bạn CÓ THỂ dựa vào. Giữa các nhóm thuộc tính, thứ tự là được THIẾT KẾ chứ không tình cờ: tiện ích chạm nhiều cạnh hơn ra trước, cái hẹp hơn ra sau, nên <code>p-4 pt-8</code> làm đúng điều ai cũng mong — 8 ở trên, 4 ở các cạnh còn lại — mà không cần một hàm hợp nhất nào. Trong một nhóm thì phép sắp là thứ tự chuỗi tuỳ tiện ở câu 16, thứ bạn không bao giờ được xây lên trên. Giữ hai nửa ấy tách bạch chính là điều rút ra thực dụng của chương: <b>tin trật tự được thiết kế GIỮA các nhóm; đừng tin phép sắp chuỗi TRONG một nhóm.</b> Phương án 4 hấp dẫn vì người làm CSS với tay tới độ đặc hiệu trước tiên, nhưng mọi selector ở đây đều là MỘT lớp đơn — 0-1-0 tất cả — và bạn xác nhận được điều đó chỉ bằng cách đọc chúng. Nếu độ đặc hiệu đang làm việc đó thì <code>tailwind-merge</code> đã không cần thiết. Phương án 1 bị chính đầu ra bác bỏ (<code>mx-1</code> đứng trước <code>ml-1</code> không phải abc), còn phương án 2 bị bác bởi <code>pb-1</code> và <code>pt-1</code> cùng hai chữ cái mà lại nằm sau <code>py-1</code>.',
          ),
        }),

        // q18 · đáp án 0
        mcq({
          prompt: B(
            'Three calls to <code>twMerge</code> from tailwind-merge 2.5.4. Which set of results is the measured one?' +
            code('twMerge("px-8 p-4")            -> ?\n' +
                 'twMerge("p-4 px-8")            -> ?\n' +
                 'twMerge("text-sm text-red-500") -> ?'),
            'Ba lời gọi <code>twMerge</code> của tailwind-merge 2.5.4. Bộ kết quả nào là bộ đo được?' +
            code('twMerge("px-8 p-4")            -> ?\n' +
                 'twMerge("p-4 px-8")            -> ?\n' +
                 'twMerge("text-sm text-red-500") -> ?'),
          ),
          options: [
            B(
              '<code>"p-4"</code> · <code>"p-4 px-8"</code> · <code>"text-sm text-red-500"</code> — it knows <code>p</code> contains <code>px</code>, and that size and colour are different groups',
              '<code>"p-4"</code> · <code>"p-4 px-8"</code> · <code>"text-sm text-red-500"</code> — nó biết <code>p</code> BAO <code>px</code>, và biết cỡ chữ với màu chữ là hai nhóm khác nhau',
            ),
            B(
              '<code>"p-4"</code> · <code>"px-8"</code> · <code>"text-red-500"</code> — the last class always wins, which is the whole point of the helper',
              '<code>"p-4"</code> · <code>"px-8"</code> · <code>"text-red-500"</code> — lớp cuối luôn thắng, và đó là toàn bộ ý nghĩa của hàm này',
            ),
            B(
              '<code>"px-8 p-4"</code> · <code>"p-4 px-8"</code> · <code>"text-sm text-red-500"</code> — it only deduplicates exact repeats and leaves related classes alone',
              '<code>"px-8 p-4"</code> · <code>"p-4 px-8"</code> · <code>"text-sm text-red-500"</code> — nó chỉ khử trùng lặp y hệt và để yên các lớp có liên quan',
            ),
            B(
              '<code>"px-8"</code> · <code>"px-8"</code> · <code>"text-sm"</code> — it keeps the narrowest utility of each pair, mirroring Tailwind\'s own emit order',
              '<code>"px-8"</code> · <code>"px-8"</code> · <code>"text-sm"</code> — nó giữ tiện ích HẸP nhất của mỗi cặp, phản chiếu đúng thứ tự phát sinh của Tailwind',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Run against tailwind-merge 2.5.4: <code>"px-8 p-4"</code> collapses to <code>"p-4"</code>, <code>"p-4 px-8"</code> stays as both, and <code>"text-sm text-red-500"</code> stays as both. Two behaviours are on display and both are the reason to use the helper rather than write your own. First, <b>last-written wins</b> is restored — the intuition your code already looked like it had. Second, it knows the <em>taxonomy</em>: <code>p</code> is a superset of <code>px</code>, so a later <code>p-4</code> swallows an earlier <code>px-8</code>, while an earlier <code>p-4</code> does not swallow a later, narrower <code>px-8</code>; and <code>text-sm</code> and <code>text-red-500</code> share a prefix but set <code>font-size</code> and <code>color</code>, so both survive. Option 2 is the naive "last wins" model, and it is exactly the bug you would ship by writing the merge yourself with a prefix split. Option 4 inverts the rule. Option 3 describes plain deduplication, which would leave the original conflict unresolved. Two limits worth carrying: <code>twMerge</code> only knows classes it has a rule for — a custom <code>btn-primary</code> passes through untouched — and it costs a function call per render, which is why chapter 3 measures it rather than assuming.',
            'Chạy thật với tailwind-merge 2.5.4: <code>"px-8 p-4"</code> co lại thành <code>"p-4"</code>, <code>"p-4 px-8"</code> giữ CẢ HAI, và <code>"text-sm text-red-500"</code> giữ CẢ HAI. Hai hành vi lộ ra ở đây và cả hai đều là lý do nên dùng hàm này thay vì tự viết. Một, <b>viết-cuối-thắng</b> được KHÔI PHỤC — đúng cái trực giác mà mã của bạn vốn TRÔNG như đang có. Hai, nó hiểu PHÂN LOẠI: <code>p</code> là tập cha của <code>px</code>, nên một <code>p-4</code> đứng sau nuốt một <code>px-8</code> đứng trước, trong khi một <code>p-4</code> đứng trước KHÔNG nuốt một <code>px-8</code> hẹp hơn đứng sau; còn <code>text-sm</code> và <code>text-red-500</code> chung tiền tố nhưng đặt <code>font-size</code> với <code>color</code>, nên cả hai sống. Phương án 2 là mô hình "cái cuối thắng" ngây thơ, và nó đúng là con bọ bạn sẽ giao nếu tự viết phép hợp nhất bằng cách cắt tiền tố. Phương án 4 đảo ngược luật. Phương án 3 mô tả khử trùng lặp thuần, thứ sẽ để nguyên xung đột ban đầu. Hai giới hạn đáng mang theo: <code>twMerge</code> chỉ biết những lớp mà nó có luật — một <code>btn-primary</code> tự chế đi qua nguyên vẹn — và nó tốn một lời gọi hàm mỗi lượt render, đó là lý do chương 3 ĐO nó thay vì đoán.',
          ),
        }),

        // q19 · đáp án 3
        mcq({
          prompt: B(
            'A utility is not applying and the rule <em>is</em> in the built CSS. Which escalation order costs least and fixes most?',
            'Một tiện ích không ăn và quy tắc thì CÓ trong CSS đầu ra. Thứ tự leo thang nào rẻ nhất mà chữa được nhiều nhất?',
          ),
          options: [
            B(
              'Add <code>!</code> to the utility first — it is one character, it always works, and anything else is premature optimisation',
              'Thêm <code>!</code> vào tiện ích trước — đúng một ký tự, luôn chạy, và mọi cách khác đều là tối ưu sớm',
            ),
            B(
              'Raise specificity first by doubling the class or wrapping the component, then add <code>!</code> only if that fails',
              'Nâng độ đặc hiệu trước bằng cách nhân đôi tên lớp hoặc bọc thêm một tầng, rồi mới thêm <code>!</code> nếu cách đó không xong',
            ),
            B(
              'Set <code>important: true</code> in the config so the whole problem disappears once, for every utility, everywhere',
              'Đặt <code>important: true</code> trong cấu hình để cả bài toán biến mất một lần, cho mọi tiện ích, ở mọi nơi',
            ),
            B(
              'Find the winner and merge or move first — <code>cn()</code> for runtime composition, <code>@layer</code> for your own CSS — then specificity, and <code>!</code> only as a last resort',
              'Tìm kẻ đang thắng rồi HỢP NHẤT hoặc DI DỜI trước — <code>cn()</code> cho lớp soạn lúc chạy, <code>@layer</code> cho CSS của bạn — rồi mới tới độ đặc hiệu, và <code>!</code> chỉ là cứu cánh cuối',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The ladder is ordered by how much it explains, not by how fast it silences the symptom. Step one is diagnosis: read the built file and find which rule is actually winning, because the remaining steps depend on the answer. If the loser is a runtime-composed class string, the fix is <code>cn()</code> — it resolves the conflict at the source and restores last-wins for every future collision, not just this one. If the winner is your own hand-written CSS, the fix is to move that rule into <code>@layer components</code>, which relocates it <em>before</em> the utilities block so utilities can override it by position. Only when neither applies do you reach for specificity, and <code>!</code> last, because <code>!important</code> does not resolve the conflict, it just moves the argument to a higher tier where the next person has to escalate again. A measured asymmetry from this repository makes the point: 22 uses of the <code>!</code> prefix across 29,058 class attributes, against 38 uses of <code>!important</code> in <code>globals.css</code> — the real cascade pressure is between hand-written CSS and utilities, exactly the place <code>@layer</code> is for. Option 3 is the largest version of the same mistake: it makes every utility unoverridable, including by the next utility.',
            'Cái thang xếp theo mức độ nó GIẢI THÍCH được, chứ không theo tốc độ nó bịt được triệu chứng. Bậc một là chẩn đoán: đọc file đầu ra và tìm xem quy tắc nào đang thật sự thắng, vì các bậc còn lại phụ thuộc câu trả lời đó. Nếu kẻ thua là một chuỗi lớp soạn lúc chạy thì cú vá là <code>cn()</code> — nó giải quyết xung đột ngay tại nguồn và khôi phục luật viết-cuối-thắng cho mọi lần đụng độ về sau, không chỉ lần này. Nếu kẻ thắng là CSS bạn tự viết thì cú vá là dời quy tắc ấy vào <code>@layer components</code>, thứ đặt nó lại vị trí TRƯỚC khối tiện ích để tiện ích đè được nó bằng vị trí. Chỉ khi không cách nào áp dụng được thì bạn mới với tới độ đặc hiệu, và <code>!</code> sau cùng, vì <code>!important</code> KHÔNG giải quyết xung đột, nó chỉ dời cuộc cãi lên một tầng cao hơn nơi người sau lại phải leo thang tiếp. Một sự bất đối xứng đo được ở kho này nói lên điều đó: 22 lượt dùng tiền tố <code>!</code> trên 29.058 thuộc tính lớp, so với 38 lượt <code>!important</code> trong <code>globals.css</code> — áp lực cascade thật nằm giữa CSS viết tay và tiện ích, đúng chỗ mà <code>@layer</code> sinh ra để giải quyết. Phương án 3 là phiên bản to nhất của cùng một sai lầm: nó làm mọi tiện ích không thể bị đè, kể cả bởi tiện ích kế tiếp.',
          ),
        }),

        /* ── Chương 4 — Component và chỗ tái sử dụng (5 câu) ─────────────── */

        // q20 · đáp án 0
        mcq({
          prompt: B(
            'This CSS is built. What does the generated <code>.btn-lg</code> contain?' +
            code('@layer components {\n' +
                 '  .btn    { @apply px-4 py-2 rounded font-semibold; }\n' +
                 '  .btn-lg { @apply btn text-lg; }\n' +
                 '}'),
            'CSS này được dựng. Cái <code>.btn-lg</code> phát sinh ra chứa gì?' +
            code('@layer components {\n' +
                 '  .btn    { @apply px-4 py-2 rounded font-semibold; }\n' +
                 '  .btn-lg { @apply btn text-lg; }\n' +
                 '}'),
          ),
          options: [
            B(
              'A full copy of every declaration in <code>.btn</code> plus <code>font-size</code> — <code>@apply</code> inlines, it does not reference, so editing <code>.btn</code> later leaves the copy behind',
              'Một bản sao ĐẦY ĐỦ mọi khai báo trong <code>.btn</code> cộng <code>font-size</code> — <code>@apply</code> NỘI TUYẾN chứ không THAM CHIẾU, nên sửa <code>.btn</code> về sau thì bản sao ở lại y nguyên',
            ),
            B(
              'Only <code>font-size</code>, plus a generated <code>composes: btn</code> declaration that links the two rules at run time',
              'Chỉ <code>font-size</code>, cộng một khai báo <code>composes: btn</code> được phát sinh để nối hai quy tắc lúc chạy',
            ),
            B(
              'Nothing: <code>@apply</code> only accepts utility class names, so applying a component class is a build error',
              'Không gì cả: <code>@apply</code> chỉ nhận tên lớp tiện ích, nên áp một lớp component là một lỗi lúc dựng',
            ),
            B(
              'Only <code>font-size</code>, and <code>.btn-lg</code> is emitted before <code>.btn</code> so the two rules cascade together on an element carrying both',
              'Chỉ <code>font-size</code>, và <code>.btn-lg</code> được phát sinh trước <code>.btn</code> để hai quy tắc cùng cascade trên một phần tử mang cả hai lớp',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Built and read: <code>.btn-lg</code> comes out holding <code>border-radius</code>, <code>padding-left</code>, <code>padding-right</code>, <code>padding-top</code>, <code>padding-bottom</code>, <code>font-weight</code> <em>and</em> <code>font-size</code> — a verbatim copy of <code>.btn</code> with one line added. There is no link between the two rules. That is the measurement that decides where reuse belongs. <code>@apply</code> looks like the obvious answer to long class strings, but it reintroduces the exact problem utilities removed: two places that must be edited together, with nothing to tell you when you miss one. It also gives up the thing that made the class string worth reading, namely that you could see the whole style without opening another file. The alternative that does not have this property is a component — a React component, or a <code>cva</code> variant table — because a component genuinely has one definition and many call sites. Option 3 is worth knowing to be false: applying a component class is legal, and that is precisely how the copy happens. Options 2 and 4 describe CSS Modules <code>composes</code> and a cascade trick, neither of which Tailwind emits.',
            'Dựng ra rồi đọc: <code>.btn-lg</code> ló ra với <code>border-radius</code>, <code>padding-left</code>, <code>padding-right</code>, <code>padding-top</code>, <code>padding-bottom</code>, <code>font-weight</code> VÀ <code>font-size</code> — một bản sao nguyên văn của <code>.btn</code> cộng thêm một dòng. Không có mối liên kết nào giữa hai quy tắc. Đó là phép đo quyết định chỗ tái sử dụng thuộc về đâu. <code>@apply</code> trông như câu trả lời hiển nhiên cho những chuỗi lớp dài, nhưng nó mang trở lại đúng cái vấn đề mà tiện ích đã gỡ bỏ: hai chỗ phải sửa cùng nhau, và không có gì báo cho bạn khi bạn quên một chỗ. Nó cũng vứt luôn cái làm chuỗi lớp đáng đọc, tức là bạn nhìn thấy toàn bộ kiểu dáng mà không phải mở file khác. Cái thay thế không mang nhược điểm này là một COMPONENT — một component React, hoặc một bảng biến thể <code>cva</code> — vì một component thật sự có một định nghĩa và nhiều chỗ gọi. Phương án 3 đáng biết là SAI: áp một lớp component là hợp lệ, và đó chính xác là cách bản sao được tạo ra. Phương án 2 và 4 mô tả <code>composes</code> của CSS Modules và một mẹo cascade, Tailwind không phát sinh cái nào.',
          ),
        }),

        // q21 · đáp án 2
        mcq({
          prompt: B(
            'A component accepts a <code>className</code> prop. Which implementation actually keeps the promise that prop makes?' +
            code('A: cn(className, "px-4 py-2 rounded")\n' +
                 'B: `px-4 py-2 rounded ${className}`\n' +
                 'C: cn("px-4 py-2 rounded", className)'),
            'Một component nhận prop <code>className</code>. Cách cài đặt nào thật sự GIỮ ĐƯỢC lời hứa mà cái prop ấy đưa ra?' +
            code('A: cn(className, "px-4 py-2 rounded")\n' +
                 'B: `px-4 py-2 rounded ${className}`\n' +
                 'C: cn("px-4 py-2 rounded", className)'),
          ),
          options: [
            B(
              'A — putting the caller first guarantees the component\'s own defaults are applied on top and nothing the caller passes can break the design system',
              'A — đặt lớp của người gọi lên trước bảo đảm mặc định của chính component được áp lên trên và không gì người gọi truyền vào phá được hệ thiết kế',
            ),
            B(
              'B — plain concatenation is enough, because the browser applies the last class in the attribute and the caller\'s class is written last',
              'B — nối chuỗi thường là đủ, vì trình duyệt áp lớp CUỐI trong thuộc tính và lớp của người gọi được viết sau cùng',
            ),
            B(
              'C — the caller is merged last, so <code>twMerge</code> drops the component\'s conflicting utility and the override actually takes effect',
              'C — người gọi được hợp nhất SAU CÙNG, nên <code>twMerge</code> loại bỏ tiện ích đụng độ của component và cú ghi đè thật sự có hiệu lực',
            ),
            B(
              'Any of the three — <code>cn()</code> sorts its arguments internally, so argument order does not affect the result',
              'Cái nào cũng được — <code>cn()</code> tự sắp xếp các đối số bên trong, nên thứ tự đối số không ảnh hưởng kết quả',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A <code>className</code> prop is a contract: "give me classes and I will apply them". Only C keeps it. <code>twMerge</code> resolves conflicts in argument order with the later argument winning, so with the caller last, <code>&lt;Button className="px-8"&gt;</code> really produces <code>px-8</code>. In A the component\'s own <code>px-4</code> is merged after and wins, which silently reverses the meaning of the prop — the worst kind of bug, because the call site looks correct and the override just quietly does nothing. B is the version this repository writes most often, and it is the interesting failure: it emits <code>class="px-4 py-2 rounded px-8"</code>, both rules survive into the browser, and the winner is decided by Tailwind\'s emit order. Sometimes the caller wins, sometimes it does not, on the same code, depending on which two utilities collided — <code>px-8</code> loses to <code>px-4</code>, while <code>mt-8</code> beats <code>mt-32</code>. Option 4 is false and worth checking: <code>cn()</code> is <code>twMerge(clsx(...))</code>, and both halves are strictly order-sensitive.',
            'Một prop <code>className</code> là một HỢP ĐỒNG: "đưa lớp cho tôi và tôi sẽ áp chúng". Chỉ C giữ được nó. <code>twMerge</code> phân giải xung đột theo thứ tự đối số với đối số ĐỨNG SAU thắng, nên khi người gọi nằm cuối thì <code>&lt;Button className="px-8"&gt;</code> thật sự cho ra <code>px-8</code>. Ở A thì <code>px-4</code> của chính component được hợp nhất sau và thắng, thứ đó âm thầm ĐẢO NGƯỢC ý nghĩa của prop — loại bọ tệ nhất, vì chỗ gọi trông vẫn đúng còn cú ghi đè thì lặng lẽ không làm gì. B là bản mà kho này viết nhiều nhất, và nó là cú hỏng thú vị: nó phát ra <code>class="px-4 py-2 rounded px-8"</code>, cả hai quy tắc cùng sống tới trình duyệt, và kẻ thắng do thứ tự phát sinh của Tailwind quyết. Có lúc người gọi thắng, có lúc không, trên cùng một đoạn mã, tuỳ vào hai tiện ích nào tình cờ đụng nhau — <code>px-8</code> THUA <code>px-4</code>, còn <code>mt-8</code> lại THẮNG <code>mt-32</code>. Phương án 4 sai và đáng kiểm: <code>cn()</code> là <code>twMerge(clsx(...))</code>, và cả hai nửa đều nhạy cảm nghiêm ngặt với thứ tự.',
          ),
        }),

        // q22 · đáp án 1
        mcq({
          prompt: B(
            'The source says <code>@apply px-4 py-2 rounded font-semibold</code>, but the built rule lists <code>border-radius</code> first and <code>font-weight</code> last. Why?',
            'Mã nguồn ghi <code>@apply px-4 py-2 rounded font-semibold</code>, nhưng quy tắc dựng ra lại liệt kê <code>border-radius</code> đầu tiên và <code>font-weight</code> cuối cùng. Vì sao?',
          ),
          options: [
            B(
              'PostCSS alphabetises declarations inside every rule as a normalisation step before the file is written',
              'PostCSS sắp xếp abc các khai báo trong mọi quy tắc như một bước chuẩn hoá trước khi ghi file',
            ),
            B(
              '<code>@apply</code> resolves each name to a utility and emits them in Tailwind\'s own utility sort order, not the order you listed them',
              '<code>@apply</code> phân giải từng cái tên thành một tiện ích rồi phát sinh chúng theo THỨ TỰ SẮP TIỆN ÍCH của chính Tailwind, không theo thứ tự bạn liệt kê',
            ),
            B(
              'Declaration order inside a rule is not preserved by the CSS parser, so it is arbitrary and can change between builds',
              'Thứ tự khai báo bên trong một quy tắc không được bộ phân tích CSS giữ lại, nên nó tuỳ tiện và có thể đổi giữa các lượt dựng',
            ),
            B(
              'Shorthand properties are hoisted above longhands so a later longhand can override them, which puts <code>rounded</code> first',
              'Thuộc tính viết tắt được đẩy lên trên các thuộc tính dạng dài để một thuộc tính dài đứng sau đè được chúng, và điều đó đưa <code>rounded</code> lên đầu',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The names after <code>@apply</code> are not text to be pasted — each one is looked up as a utility, and the resulting declarations are emitted in the same order the generator would have used had you written the classes in markup. That is why the measured output is <code>border-radius</code>, then the four padding longhands, then <code>font-weight</code>, regardless of the order in the source. Two practical consequences. First, you cannot use <code>@apply</code> ordering to resolve a conflict between two applied utilities — writing the "winner" last has no effect, exactly as it has no effect in a class attribute. Second, this is one more reason the rule reads worse than the class string it replaced: the thing you wrote and the thing that comes out are no longer in correspondence, so a reviewer has to build the file to see what a rule does. Option 3 is false and matters: within one rule, declaration order <em>is</em> preserved by every CSS parser, and CSS semantics depend on it — it is simply not <em>your</em> order that got preserved here. Options 1 and 4 describe transformations nothing in this pipeline performs.',
            'Những cái tên đứng sau <code>@apply</code> không phải văn bản để dán vào — từng cái được TRA CỨU như một tiện ích, và các khai báo thu được được phát sinh theo đúng thứ tự mà trình sinh sẽ dùng nếu bạn viết các lớp ấy trong mã đánh dấu. Đó là lý do đầu ra đo được là <code>border-radius</code>, rồi bốn thuộc tính padding dạng dài, rồi <code>font-weight</code>, bất kể thứ tự trong mã nguồn. Hai hệ quả thực dụng. Một, bạn KHÔNG dùng được thứ tự trong <code>@apply</code> để phân giải xung đột giữa hai tiện ích được áp — viết "kẻ thắng" ở cuối chẳng có tác dụng gì, đúng như nó chẳng có tác dụng gì trong một thuộc tính class. Hai, đây là thêm một lý do quy tắc ấy đọc còn tệ hơn chuỗi lớp mà nó thay thế: thứ bạn viết và thứ ló ra không còn tương ứng với nhau, nên người review buộc phải dựng file lên mới biết một quy tắc làm gì. Phương án 3 sai và điều đó quan trọng: trong MỘT quy tắc, thứ tự khai báo LUÔN được mọi bộ phân tích CSS giữ lại, và ngữ nghĩa CSS phụ thuộc vào nó — chỉ là ở đây không phải thứ tự CỦA BẠN được giữ. Phương án 1 và 4 mô tả những phép biến đổi mà không khâu nào trong đường ống này thực hiện.',
          ),
        }),

        // q23 · đáp án 3
        mcq({
          prompt: B(
            'A button has 3 visual variants × 3 sizes. When does a declarative variant table (<code>cva</code>) earn its place over a plain <code>cn()</code> call with conditionals?',
            'Một cái nút có 3 biến thể thị giác × 3 kích cỡ. Khi nào một bảng biến thể khai báo (<code>cva</code>) xứng đáng chỗ của nó so với một lời gọi <code>cn()</code> thường kèm điều kiện?',
          ),
          options: [
            B(
              'Always — an if-chain over variants is an anti-pattern, and a project with any variants at all should adopt the table',
              'Luôn luôn — một chuỗi if trên các biến thể là phản khuôn mẫu, và một dự án có bất kỳ biến thể nào cũng nên áp dụng bảng',
            ),
            B(
              'Never — <code>cva</code> duplicates what <code>twMerge</code> already does, so adding it means resolving the same conflicts twice',
              'Không bao giờ — <code>cva</code> làm trùng việc mà <code>twMerge</code> đã làm, nên thêm nó nghĩa là phân giải cùng một xung đột hai lần',
            ),
            B(
              'Only when the component is exported from a package, because the table is what generates the public type for the variant props',
              'Chỉ khi component được xuất từ một gói thư viện, vì cái bảng là thứ sinh ra kiểu công khai cho các prop biến thể',
            ),
            B(
              'When the combinations are a real matrix with compound cases and defaults — otherwise a couple of conditionals inside <code>cn()</code> is smaller, and this repository uses <code>cva</code> zero times',
              'Khi các tổ hợp thật sự là một MA TRẬN có ca ghép và có mặc định — còn không thì vài điều kiện trong <code>cn()</code> gọn hơn, và kho này dùng <code>cva</code> ĐÚNG 0 lần',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Three variants and three sizes is nine combinations, and an if-chain can only express nine combinations by listing them — which is where compound cases ("destructive <em>and</em> small needs tighter tracking") turn into nested conditions nobody can read. A variant table turns that matrix into data: one entry per axis, an explicit <code>defaultVariants</code>, and <code>compoundVariants</code> for the handful of cells that are genuinely special. That is when it pays. What makes this question worth asking is the other half of the measurement: this repository has 62 components accepting a <code>className</code> prop and uses <code>cva</code> <b>zero</b> times, and most of them are right not to — a component with two states does not have a matrix, and importing a library to express two states costs more than it saves. Option 1 is the cargo-cult version. Option 2 is a real-sounding confusion: <code>cva</code> chooses <em>which</em> classes, <code>twMerge</code> resolves conflicts <em>among</em> them, and the standard setup composes the two rather than duplicating either. Option 3 invents a packaging rule.',
            'Ba biến thể và ba kích cỡ là chín tổ hợp, và một chuỗi if chỉ diễn đạt được chín tổ hợp bằng cách LIỆT KÊ chúng ra — và đó là chỗ mà các ca ghép ("destructive VÀ nhỏ thì cần giãn chữ chặt hơn") biến thành những điều kiện lồng nhau không ai đọc nổi. Một bảng biến thể biến ma trận ấy thành DỮ LIỆU: mỗi trục một mục, một <code>defaultVariants</code> tường minh, và <code>compoundVariants</code> cho dăm ba ô thật sự đặc biệt. Đó là lúc nó đáng giá. Cái làm câu hỏi này đáng hỏi là nửa còn lại của phép đo: kho này có 62 component nhận prop <code>className</code> và dùng <code>cva</code> ĐÚNG <b>0</b> lần, và phần lớn trong số đó đúng khi không dùng — một component có hai trạng thái thì không có ma trận nào, và nhập một thư viện để diễn đạt hai trạng thái thì tốn hơn là tiết kiệm. Phương án 1 là bản sùng bái hàng hoá. Phương án 2 là một nhầm lẫn nghe rất thật: <code>cva</code> chọn NHỮNG lớp nào, <code>twMerge</code> phân giải xung đột GIỮA chúng, và cách cắm chuẩn là ghép hai thứ chứ không làm trùng cái nào. Phương án 3 bịa ra một luật về đóng gói.',
          ),
        }),

        // q24 · đáp án 0
        mcq({
          prompt: B(
            'Class-attribute lengths across a real 814-component app: 79% under 80 characters, 4.4% over 160, longest 787. What should trigger extracting a component?',
            'Độ dài thuộc tính lớp trên một ứng dụng thật 814 component: 79% dưới 80 ký tự, 4,4% trên 160, dài nhất 787. Điều gì nên KÍCH HOẠT một cú tách component?',
          ),
          options: [
            B(
              'Repetition, not length: the same long string appearing in several files is a maintenance cost, while one long string in one place is just a specific element',
              'Sự LẶP LẠI, không phải độ dài: cùng một chuỗi dài xuất hiện ở nhiều file là một cái giá bảo trì, còn một chuỗi dài ở một chỗ thì chỉ là một phần tử đặc thù',
            ),
            B(
              'A hard character limit — 160 is the measured tail of the distribution, so any attribute over it should be extracted or moved to <code>@apply</code>',
              'Một hạn mức ký tự cứng — 160 là cái đuôi đo được của phân bố, nên mọi thuộc tính vượt nó nên được tách ra hoặc chuyển sang <code>@apply</code>',
            ),
            B(
              'Any element carrying a responsive or state variant, since those are the classes that make a string unreadable in review',
              'Bất kỳ phần tử nào mang một biến thể đáp ứng hay trạng thái, vì chính những lớp đó làm một chuỗi không đọc nổi lúc review',
            ),
            B(
              'Nothing should: the distribution shows the complaint is unfounded, and extracting components to shorten markup trades a real cost for a cosmetic one',
              'Chẳng cái gì nên cả: phân bố cho thấy lời phàn nàn là vô căn cứ, và tách component để rút ngắn mã đánh dấu là đánh đổi một cái giá thật lấy một cái giá hình thức',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The distribution settles the argument in both directions at once. The complaint about "class soup" is real — there is a 787-character attribute in this codebase, and nobody can review that — but it is real for 4.4% of cases, not for the 79% that fit in 80 characters. So a blanket rule keyed on length is aimed at the wrong variable. The variable that actually predicts cost is <b>duplication</b>: one long string in one place is a specific element and reads fine in context; the same string in eleven files is eleven places that must change together, and the failure mode is that ten of them change. That is also the stronger trigger for a different reason — when the duplicated thing turns out to be <em>wrong</em>, duplication means it is wrong in eleven places at once, which is how a hardcoded colour became a black-on-black settings screen in this repository. Option 2 turns a measurement into a rule it does not support. Option 4 overcorrects: the tail exists and the extractions it justifies are real, they are simply a minority.',
            'Phân bố dàn xếp cuộc tranh cãi theo cả hai chiều cùng lúc. Lời phàn nàn về "canh lớp" là CÓ THẬT — trong kho mã này có một thuộc tính dài 787 ký tự, và không ai review nổi thứ đó — nhưng nó có thật với 4,4% trường hợp, chứ không phải với 79% vừa gọn trong 80 ký tự. Nên một luật đánh đồng dựa trên ĐỘ DÀI đang nhắm sai biến số. Biến số thật sự dự đoán được cái giá là SỰ TRÙNG LẶP: một chuỗi dài ở một chỗ là một phần tử đặc thù và đọc trong ngữ cảnh vẫn ổn; cùng chuỗi ấy ở mười một file là mười một chỗ phải đổi cùng nhau, và kiểu hỏng là mười chỗ đổi được. Đó cũng là tác nhân MẠNH hơn vì một lẽ khác — khi cái bị trùng lặp hoá ra là SAI thì trùng lặp nghĩa là nó sai ở mười một chỗ cùng lúc, và đó chính là cách một mã màu đóng cứng biến màn Cài đặt của kho này thành đen trên đen. Phương án 2 biến một phép đo thành một luật mà phép đo ấy không chống đỡ. Phương án 4 sửa quá tay: cái đuôi có thật và những cú tách mà nó biện minh cũng có thật, chỉ là chúng thuộc thiểu số.',
          ),
        }),

        /* ── Chương 5 — Mở rộng cấu hình (5 câu) ────────────────────────── */

        // q25 · đáp án 1
        mcq({
          prompt: B(
            'Two configs differ by one keyword. What is actually generated for a source file containing <code>p-4</code> and <code>text-red-500</code>?' +
            code('A: theme: { extend: { spacing: { huge: "99px" } } }\n' +
                 'B: theme: {           spacing: { huge: "99px" }   }'),
            'Hai cấu hình khác nhau đúng một từ khoá. Với một file nguồn chứa <code>p-4</code> và <code>text-red-500</code> thì thật sự cái gì được phát sinh?' +
            code('A: theme: { extend: { spacing: { huge: "99px" } } }\n' +
                 'B: theme: {           spacing: { huge: "99px" }   }'),
          ),
          options: [
            B(
              'Identical output: <code>extend</code> is a readability convention and both forms merge into the default theme',
              'Đầu ra giống hệt: <code>extend</code> chỉ là quy ước cho dễ đọc và cả hai dạng đều hoà vào theme mặc định',
            ),
            B(
              'A emits all three; B emits <code>p-huge</code> and <code>text-red-500</code> but not <code>p-4</code> — replacement is per key, so only <code>spacing</code> was wiped',
              'A phát sinh cả ba; B phát sinh <code>p-huge</code> và <code>text-red-500</code> nhưng KHÔNG có <code>p-4</code> — phép thay là THEO TỪNG KHOÁ, nên chỉ <code>spacing</code> bị xoá',
            ),
            B(
              'A emits all three; B emits only <code>p-huge</code>, because writing any key outside <code>extend</code> discards the entire default theme',
              'A phát sinh cả ba; B chỉ phát sinh <code>p-huge</code>, vì viết bất kỳ khoá nào ngoài <code>extend</code> sẽ vứt bỏ TOÀN BỘ theme mặc định',
            ),
            B(
              'B fails the build with a validation error, which is how Tailwind prevents an accidental scale wipe',
              'B làm hỏng lượt dựng với một lỗi kiểm tra hợp lệ, và đó là cách Tailwind ngăn một cú xoá thang do sơ ý',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured with both configs on one source file. With <code>extend</code>: <code>.p-4</code>, <code>.p-huge</code>, <code>.text-red-500</code>. Without it: <code>.p-huge</code> and <code>.text-red-500</code> only — <code>p-4</code> is gone. So the rule is precise and worth stating exactly: a key written directly under <code>theme</code> <b>replaces that key</b>, and leaves every other key of the default theme intact. Colours survived because <code>colors</code> was not the key being replaced. This matters in both directions. It is a smaller disaster than "the whole theme disappears", so a misplaced indent is survivable; but it is also quieter, because the family you did not touch keeps working and the failure looks local. Nothing warns you either way, which is option 4\'s mistake — there is no validation for this, and there cannot be, since replacing a key is a legitimate thing to do when you genuinely want to constrain a design system to an exact set of values. Option 3 is the common overstatement and is precisely the claim this measurement corrects.',
            'Đo bằng cả hai cấu hình trên cùng một file nguồn. Có <code>extend</code>: <code>.p-4</code>, <code>.p-huge</code>, <code>.text-red-500</code>. Không có nó: chỉ <code>.p-huge</code> và <code>.text-red-500</code> — <code>p-4</code> biến mất. Vậy luật rất chính xác và đáng phát biểu đúng nguyên văn: một khoá viết trực tiếp dưới <code>theme</code> sẽ THAY THẾ ĐÚNG KHOÁ ĐÓ, và để nguyên mọi khoá khác của theme mặc định. Màu sống sót vì <code>colors</code> không phải cái khoá bị thay. Điều này quan trọng theo cả hai chiều. Nó là một thảm hoạ NHỎ hơn "cả theme biến mất", nên một cú thụt lề sai vẫn sống được; nhưng nó cũng ÂM THẦM hơn, vì cái họ bạn không đụng tới vẫn chạy và cú hỏng trông có vẻ cục bộ. Không có gì cảnh báo bạn theo chiều nào cả, và đó là chỗ sai của phương án 4 — không có phép kiểm hợp lệ nào cho việc này, và cũng không thể có, vì thay một khoá là việc chính đáng khi bạn thật sự muốn bó một hệ thiết kế vào đúng một tập giá trị. Phương án 3 là cách nói quá phổ biến và chính là khẳng định mà phép đo này sửa lại.',
          ),
        }),

        // q26 · đáp án 3
        mcq({
          prompt: B(
            'A team sets <code>important: "#app"</code> in the config. Building <code>mt-4</code> then produces the selector <code>#app .mt-4</code>. What did they buy and what did they pay?',
            'Một nhóm đặt <code>important: "#app"</code> trong cấu hình. Dựng <code>mt-4</code> khi đó cho ra selector <code>#app .mt-4</code>. Họ mua được gì và trả giá gì?',
          ),
          options: [
            B(
              'They bought nothing: an ID selector and a class selector have equal weight, so this changes only the text of the selector',
              'Họ chẳng mua được gì: một selector ID và một selector lớp có trọng lượng ngang nhau, nên cái này chỉ đổi phần văn bản của selector',
            ),
            B(
              'They bought scoping only — the rules now apply inside <code>#app</code> and nowhere else — with no effect at all on which rule wins a conflict',
              'Họ chỉ mua được phạm vi — các quy tắc giờ áp bên trong <code>#app</code> và không đâu khác — và hoàn toàn không ảnh hưởng tới việc quy tắc nào thắng khi xung đột',
            ),
            B(
              'They bought <code>!important</code> on every utility, since the string form is shorthand for <code>important: true</code> scoped to an element',
              'Họ mua được <code>!important</code> trên mọi tiện ích, vì dạng chuỗi là viết tắt của <code>important: true</code> giới hạn vào một phần tử',
            ),
            B(
              'They bought weight — 1-1-0 beats almost any hand-written rule — and paid with a hard dependency on that wrapper existing, plus utilities that now outrank each other\'s overrides in third-party markup',
              'Họ mua được TRỌNG LƯỢNG — 1-1-0 thắng gần như mọi quy tắc viết tay — và trả giá bằng một phụ thuộc cứng vào sự tồn tại của phần tử bọc đó, cộng những tiện ích giờ đè lên cả các cú ghi đè trong mã đánh dấu của bên thứ ba',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured: <code>important: true</code> appends <code>!important</code> to every declaration, while <code>important: "#app"</code> instead prefixes the selector, giving <code>#app .mt-4</code>. An ID contributes to the first specificity column, so the rule is 1-1-0 and beats every 0-<em>n</em>-0 selector in the project, including the 0-2-0 descendant rules that were previously winning. That is the point of the feature, and it is the gentler of the two options because <code>!important</code> is still available above it as a genuine last resort — with <code>important: true</code> you have already spent it. The costs are real. Every element you want styled must live inside <code>#app</code>, which breaks portals, modals and anything rendered to <code>document.body</code>. And a widget you embed can no longer override your utilities with its own classes, because it cannot outweigh an ID. Option 1 is false about specificity, option 2 describes only half the effect, and option 3 confuses the two config forms — worth distinguishing, because they fail differently.',
            'Đo thật: <code>important: true</code> nối <code>!important</code> vào mọi khai báo, còn <code>important: "#app"</code> thì THÊM TIỀN TỐ vào selector, cho ra <code>#app .mt-4</code>. Một ID đóng góp vào cột đầu tiên của độ đặc hiệu, nên quy tắc là 1-1-0 và thắng mọi selector 0-<em>n</em>-0 trong dự án, kể cả những quy tắc con cháu 0-2-0 vốn đang thắng trước đó. Đó là mục đích của tính năng này, và nó là lựa chọn NHẸ hơn trong hai lựa chọn, vì <code>!important</code> vẫn còn nằm phía trên như một cứu cánh cuối thật sự — với <code>important: true</code> thì bạn đã tiêu mất nó rồi. Cái giá thì có thật. Mọi phần tử bạn muốn tạo kiểu đều phải nằm bên trong <code>#app</code>, thứ đó làm hỏng portal, modal và mọi thứ render ra <code>document.body</code>. Và một widget bạn nhúng vào không còn đè được các tiện ích của bạn bằng lớp của chính nó, vì nó không thể nặng hơn một ID. Phương án 1 nói sai về độ đặc hiệu, phương án 2 chỉ mô tả một nửa hiệu ứng, còn phương án 3 lẫn lộn hai dạng cấu hình — đáng phân biệt, vì chúng hỏng theo hai kiểu khác nhau.',
          ),
        }),

        // q27 · đáp án 2
        mcq({
          prompt: B(
            'You inherit a project and need to know whether it is on Tailwind 3 or 4 before touching anything. Which single check settles it fastest and most reliably?',
            'Bạn tiếp quản một dự án và cần biết nó đang chạy Tailwind 3 hay 4 trước khi đụng vào bất cứ thứ gì. Phép kiểm đơn lẻ nào dứt điểm nhanh và chắc nhất?',
          ),
          options: [
            B(
              'Whether utilities such as <code>flex</code> and <code>p-4</code> exist, since v4 renamed the core scale and dropped the shorthand names',
              'Xem các tiện ích như <code>flex</code> và <code>p-4</code> có tồn tại không, vì v4 đã đổi tên thang lõi và bỏ các tên viết tắt',
            ),
            B(
              'Whether <code>hover:</code> and <code>md:</code> compile to pseudo-classes and media queries, because v4 replaced both with container queries',
              'Xem <code>hover:</code> và <code>md:</code> có biên dịch ra lớp giả và truy vấn phương tiện không, vì v4 đã thay cả hai bằng truy vấn container',
            ),
            B(
              'The entry CSS and the config: v3 uses <code>@tailwind base/components/utilities</code> with a <code>tailwind.config.js</code>, v4 uses <code>@import "tailwindcss"</code> with a <code>@theme</code> block in CSS',
              'File CSS đầu vào và cấu hình: v3 dùng <code>@tailwind base/components/utilities</code> với một <code>tailwind.config.js</code>, còn v4 dùng <code>@import "tailwindcss"</code> với một khối <code>@theme</code> trong CSS',
            ),
            B(
              'Whether <code>dark:</code> works without configuration, since v3 requires <code>darkMode</code> to be set and v4 always uses the OS preference',
              'Xem <code>dark:</code> có chạy mà không cần cấu hình không, vì v3 đòi phải đặt <code>darkMode</code> còn v4 luôn dùng tuỳ chọn của hệ điều hành',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The entry file is the fastest tell because the two versions cannot share one: v3 needs the three <code>@tailwind</code> directives and reads a JavaScript config, while v4 replaces both with <code>@import "tailwindcss"</code> and a CSS-native <code>@theme</code> block. Opening one file answers it. A second confirmation that costs one build: the important marker moved. On 3.4.14, measured, <code>!mt-4</code> emits <code>margin-top: 1rem !important</code> and <code>mt-4!</code> — the v4 suffix form — emits <b>nothing at all</b>, silently. Seeing <code>mt-4!</code> in a codebase whose build is v3 means those styles have never applied. This course, and the repository it is measured on (<code>tailwindcss: ^3.4.14</code>), are v3 throughout. Option 1 is false — the utility names in question are stable across both. Option 2 is false in both halves: v4 <em>added</em> container queries to core, it did not replace the variants. Option 4 misstates both versions: <code>dark:</code> works with no config in v3 too, defaulting to <code>media</code>.',
            'File CSS đầu vào là dấu hiệu nhanh nhất vì hai phiên bản không thể dùng chung một cái: v3 cần ba chỉ thị <code>@tailwind</code> và đọc một file cấu hình JavaScript, còn v4 thay cả hai bằng <code>@import "tailwindcss"</code> và một khối <code>@theme</code> viết bằng chính CSS. Mở một file là xong. Một phép xác nhận thứ hai tốn đúng một lượt dựng: dấu hiệu quan trọng đã ĐỔI CHỖ. Trên 3.4.14, đo thật, <code>!mt-4</code> phát sinh <code>margin-top: 1rem !important</code>, còn <code>mt-4!</code> — dạng hậu tố của v4 — phát sinh <b>KHÔNG GÌ CẢ</b>, trong im lặng. Thấy <code>mt-4!</code> trong một kho mã mà bản dựng là v3 nghĩa là những kiểu dáng ấy chưa từng có hiệu lực. Khoá này, và cái kho mà nó đo trên đó (<code>tailwindcss: ^3.4.14</code>), là v3 từ đầu đến cuối. Phương án 1 sai — những tên tiện ích được nhắc tới đều ổn định ở cả hai bản. Phương án 2 sai ở cả hai nửa: v4 THÊM truy vấn container vào lõi chứ không thay thế các biến thể. Phương án 4 nói sai cả hai bản: <code>dark:</code> chạy mà không cần cấu hình ở v3 luôn, với mặc định là <code>media</code>.',
          ),
        }),

        // q28 · đáp án 0
        mcq({
          prompt: B(
            'An audit counts usages of four colours declared in the config. <code>lightbg</code> 0, <code>lightcard</code> 0, <code>lightsurface</code> 0, <code>lightborder</code> 0 — while their four dark counterparts are used 2,677 times. What is the right reading?',
            'Một cuộc soát đếm lượt dùng bốn màu khai báo trong cấu hình. <code>lightbg</code> 0, <code>lightcard</code> 0, <code>lightsurface</code> 0, <code>lightborder</code> 0 — trong khi bốn màu tối tương ứng được dùng 2.677 lần. Cách đọc đúng là gì?',
          ),
          options: [
            B(
              'The paired-palette approach failed: writing <code>bg-darkcard dark:bg-lightcard</code> everywhere is too much friction, so the light half was never adopted and the app is dark-only in practice',
              'Lối bảng-màu-cặp đã THẤT BẠI: viết <code>bg-darkcard dark:bg-lightcard</code> ở mọi nơi là quá phiền, nên nửa sáng chưa bao giờ được dùng và ứng dụng trên thực tế chỉ có theme tối',
            ),
            B(
              'Dead config entries cost bytes, so the fix is to delete them and the audit is complete',
              'Các mục cấu hình chết tốn byte, nên cú vá là xoá chúng đi và cuộc soát coi như xong',
            ),
            B(
              'The count is meaningless because unused theme keys generate no CSS, so there is nothing to act on either way',
              'Con số này vô nghĩa vì các khoá theme không được dùng thì không sinh ra CSS nào, nên chẳng có gì để xử lý theo hướng nào cả',
            ),
            B(
              'The scanner missed them: theme keys are referenced from the config rather than from markup, so a source-text count cannot see them',
              'Bộ quét đã bỏ sót chúng: khoá theme được tham chiếu từ file cấu hình chứ không phải từ mã đánh dấu, nên một phép đếm trên văn bản nguồn không thể thấy chúng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'A zero next to a name that was deliberately added is a design verdict, not a tidiness issue. Somebody defined four light-theme colours intending the paired pattern — a base class for dark, a <code>dark:</code> or <code>light:</code> variant for the other theme — and then wrote 2,677 uses of the dark half and none of the light half. That is not an oversight repeated 2,677 times; it is the pattern being rejected in practice, because every themed element costs two classes that must be kept in sync by hand, and nothing catches you when they drift. Which is exactly the problem chapter 6 solves differently: put <code>var(--x)</code> in the config, let the value resolve at run time, and one class name is correct in both themes with no variant at all. Option 2 mistakes the symptom for the finding and would delete the evidence — unused theme keys generate nothing, so there are no bytes to save, which option 3 correctly observes and then draws the wrong conclusion from. Option 4 is false here: these are utility class names in markup, exactly what the scanner reads.',
            'Một con số 0 đứng cạnh một cái tên được thêm vào CÓ CHỦ Ý là một phán quyết về THIẾT KẾ, không phải chuyện dọn dẹp. Ai đó đã định nghĩa bốn màu theme sáng với ý định dùng khuôn cặp đôi — một lớp nền cho tối, một biến thể <code>dark:</code> hoặc <code>light:</code> cho theme kia — rồi viết 2.677 lượt dùng nửa tối và không lượt nào cho nửa sáng. Đó không phải một sự sơ suất lặp lại 2.677 lần; đó là cái khuôn ấy bị TỪ CHỐI trên thực tế, vì mỗi phần tử có theme tốn hai lớp phải giữ đồng bộ bằng tay, và không có gì bắt được bạn khi chúng trôi lệch. Và đó chính xác là bài toán mà chương 6 giải theo cách khác: đặt <code>var(--x)</code> vào cấu hình, để giá trị phân giải LÚC CHẠY, và một tên lớp duy nhất đúng ở cả hai theme mà không cần biến thể nào. Phương án 2 nhầm triệu chứng với phát hiện và sẽ xoá mất bằng chứng — khoá theme không được dùng thì không sinh ra gì, nên chẳng có byte nào để tiết kiệm, đúng như phương án 3 nhận xét rồi rút ra kết luận sai từ đó. Phương án 4 sai ở đây: đây là những tên lớp tiện ích nằm trong mã đánh dấu, đúng thứ bộ quét đọc.',
          ),
        }),

        // q29 · đáp án 1
        mcq({
          prompt: B(
            'Class names arrive from a CMS field and can be any of <code>bg-red-500</code>, <code>bg-red-600</code>, <code>bg-blue-500</code> or <code>bg-blue-600</code>. Which config change makes them work?',
            'Tên lớp đến từ một trường của CMS và có thể là một trong <code>bg-red-500</code>, <code>bg-red-600</code>, <code>bg-blue-500</code> hoặc <code>bg-blue-600</code>. Thay đổi cấu hình nào làm chúng chạy được?',
          ),
          options: [
            B(
              'Point <code>content</code> at the CMS export as well, since the scanner reads any file type and will find the strings there',
              'Trỏ <code>content</code> vào cả bản xuất của CMS, vì bộ quét đọc được mọi loại file và sẽ tìm thấy các chuỗi ở đó',
            ),
            B(
              '<code>safelist: [{ pattern: /^bg-(red|blue)-(500|600)$/ }]</code> — the safelist generates rules for names the scanner cannot possibly see',
              '<code>safelist: [{ pattern: /^bg-(red|blue)-(500|600)$/ }]</code> — safelist phát sinh quy tắc cho những cái tên mà bộ quét không tài nào thấy được',
            ),
            B(
              'Nothing in the config: write the four names in a CSS comment in the entry file, which the extractor also scans',
              'Không cần đổi gì trong cấu hình: viết bốn cái tên vào một chú thích CSS trong file đầu vào, thứ mà bộ trích xuất cũng quét',
            ),
            B(
              'Switch the value to an arbitrary one, <code>bg-[var(--cms-colour)]</code>, and let the CMS set the variable instead',
              'Đổi sang một giá trị tuỳ ý, <code>bg-[var(--cms-colour)]</code>, rồi để CMS đặt cái biến đó thay vì đặt tên lớp',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: with <code>safelist: ["text-red-500", { pattern: /^bg-(red|blue)-(500|600)$/ }]</code> and a source file that mentions none of them, the output contains <code>.bg-blue-500</code>, <code>.bg-blue-600</code>, <code>.bg-red-500</code>, <code>.bg-red-600</code> and <code>.text-red-500</code>. That is what the safelist is for: a small, explicit, enumerable set of names that exist at run time but not in any file the scanner can read. Two cautions come with it. Keep the pattern tight — a loose one such as <code>/^bg-/</code> generates the entire colour palette across every family and step, which is a large block of CSS nobody asked for. And prefer the safelist only when the set really is enumerable; if it is open-ended, the honest fix is to stop generating class names and pass a value instead, which is what option 4 does. Option 4 is not wrong as engineering, it is just not what the question asked, and it changes the data contract with the CMS. Option 1 is a real technique but not always available and does not help when the value is computed. Option 3 half-works by accident — a comment in a scanned <em>source</em> file is read, but the CSS entry file is not part of <code>content</code>, measured: a name mentioned only there is never generated.',
            'Đo thật: với <code>safelist: ["text-red-500", { pattern: /^bg-(red|blue)-(500|600)$/ }]</code> và một file nguồn không nhắc tới cái nào trong số đó, đầu ra vẫn chứa <code>.bg-blue-500</code>, <code>.bg-blue-600</code>, <code>.bg-red-500</code>, <code>.bg-red-600</code> và <code>.text-red-500</code>. Đó chính là việc của safelist: một tập tên NHỎ, TƯỜNG MINH, LIỆT KÊ ĐƯỢC, tồn tại lúc chạy nhưng không nằm trong file nào bộ quét đọc được. Kèm theo là hai lời dặn. Giữ mẫu cho CHẶT — một mẫu lỏng như <code>/^bg-/</code> sẽ phát sinh nguyên cả bảng màu qua mọi họ và mọi bậc, tức một khối CSS to đùng chẳng ai yêu cầu. Và chỉ ưu tiên safelist khi cái tập ấy thật sự liệt kê được; nếu nó mở vô hạn thì cú vá trung thực là NGỪNG sinh tên lớp và truyền một GIÁ TRỊ thay vào, đúng như phương án 4 làm. Phương án 4 không sai về mặt kỹ thuật, nó chỉ không phải điều câu hỏi hỏi, và nó đổi luôn hợp đồng dữ liệu với CMS. Phương án 1 là một kỹ thuật thật nhưng không phải lúc nào cũng có, và nó không giúp gì khi giá trị được TÍNH ra. Phương án 3 chạy được một nửa do tình cờ — một chú thích trong file NGUỒN được quét thì có đọc, nhưng file CSS đầu vào không thuộc <code>content</code>, đo thật: một cái tên chỉ nằm ở đó thì không bao giờ được phát sinh.',
          ),
        }),

        /* ── Chương 6 — Biến CSS làm cơ chế theme (5 câu) ────────────────── */

        // q30 · đáp án 2
        mcq({
          prompt: B(
            'The config declares <code>colors: { bad: "var(--c-bad)" }</code>. A component writes <code>bg-bad/50</code>. What does the built CSS contain?' +
            code('$ grep -c "bg-bad\\\\/50" out.css\n' +
                 '???'),
            'Cấu hình khai <code>colors: { bad: "var(--c-bad)" }</code>. Một component viết <code>bg-bad/50</code>. CSS đầu ra chứa gì?' +
            code('$ grep -c "bg-bad\\\\/50" out.css\n' +
                 '???'),
          ),
          options: [
            B(
              '<code>background-color: var(--c-bad); opacity: 0.5</code> — the modifier falls back to element opacity when the colour is not decomposable',
              '<code>background-color: var(--c-bad); opacity: 0.5</code> — bổ từ thoái lui về độ mờ của phần tử khi màu không phân tách được',
            ),
            B(
              '<code>background-color: color-mix(in srgb, var(--c-bad) 50%, transparent)</code>, which is how 3.4 handles opacity on a variable colour',
              '<code>background-color: color-mix(in srgb, var(--c-bad) 50%, transparent)</code>, đó là cách 3.4 xử lý độ mờ trên một màu biến',
            ),
            B(
              'Zero rules — the opacity modifier needs to inject an alpha channel into the value, and it cannot do that to an opaque <code>var()</code>, so the class silently does not exist',
              'SỐ 0 quy tắc — bổ từ độ mờ cần chèn một kênh alpha vào giá trị, và nó không làm được điều đó với một <code>var()</code> đục, nên cái lớp ấy âm thầm KHÔNG TỒN TẠI',
            ),
            B(
              '<code>background-color: var(--c-bad)</code> with the modifier ignored, so the element renders at the variable\'s own alpha',
              '<code>background-color: var(--c-bad)</code> với bổ từ bị bỏ qua, nên phần tử hiện ra ở đúng alpha của chính cái biến',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured on 3.4.14 with exactly that config: <code>bg-bad</code> is emitted as <code>background-color: var(--c-bad)</code>, and <code>bg-bad/50</code> is emitted <b>zero times</b>. The generator handles an opacity modifier by rebuilding the colour with an alpha channel, and it cannot see inside a <code>var()</code> to do that, so the candidate simply produces no rule. Everything about this failure is silent: the build succeeds, no warning appears, DevTools shows no struck-through declaration because there is no declaration, and the element renders fully opaque. It looks like a design choice rather than a bug. The fix is to declare the colour in channel form — <code>rgb(var(--c) / &lt;alpha-value&gt;)</code> — which is question 31. Option 4 is the plausible failure mode and is the one most people assume; the difference between "modifier ignored" and "class does not exist" matters, because only the second one is invisible to a search of the stylesheet. Options 1 and 2 describe fallbacks Tailwind 3.4 does not implement — <code>color-mix()</code> is the v4 mechanism.',
            'Đo trên 3.4.14 với đúng cấu hình đó: <code>bg-bad</code> phát sinh ra <code>background-color: var(--c-bad)</code>, còn <code>bg-bad/50</code> phát sinh <b>SỐ 0 lần</b>. Trình sinh xử lý bổ từ độ mờ bằng cách DỰNG LẠI cái màu kèm một kênh alpha, và nó không nhìn được vào bên trong một <code>var()</code> để làm điều đó, nên cái ứng viên ấy đơn giản là không sinh ra quy tắc nào. Mọi thứ ở cú hỏng này đều im lặng: bản dựng thành công, không cảnh báo nào, DevTools không hiện khai báo nào bị gạch vì chẳng có khai báo nào, và phần tử hiện ra đục hoàn toàn. Nó trông như một lựa chọn thiết kế chứ không như một con bọ. Cú vá là khai màu theo DẠNG KÊNH — <code>rgb(var(--c) / &lt;alpha-value&gt;)</code> — tức câu 31. Phương án 4 là kiểu hỏng nghe hợp lý và là cái đa số người ta mặc định; khác biệt giữa "bổ từ bị bỏ qua" và "cái lớp không tồn tại" rất quan trọng, vì chỉ cái thứ hai mới VÔ HÌNH với một phép tìm trong bảng kiểu. Phương án 1 và 2 mô tả những cú thoái lui mà Tailwind 3.4 không cài đặt — <code>color-mix()</code> là cơ chế của v4.',
          ),
        }),

        // q31 · đáp án 0
        mcq({
          prompt: B(
            'The fix for question 30. Which config form makes both <code>text-good</code> and <code>text-good/30</code> generate correctly on Tailwind 3.4?',
            'Cú vá cho câu 30. Dạng cấu hình nào làm cả <code>text-good</code> lẫn <code>text-good/30</code> phát sinh đúng trên Tailwind 3.4?',
          ),
          options: [
            B(
              '<code>good: "rgb(var(--c-good) / &lt;alpha-value&gt;)"</code>, with the variable holding bare channels such as <code>34 197 94</code>',
              '<code>good: "rgb(var(--c-good) / &lt;alpha-value&gt;)"</code>, với cái biến chứa các KÊNH trần như <code>34 197 94</code>',
            ),
            B(
              '<code>good: "var(--c-good, &lt;alpha-value&gt;)"</code>, passing the alpha as the variable\'s fallback argument',
              '<code>good: "var(--c-good, &lt;alpha-value&gt;)"</code>, truyền alpha vào làm đối số dự phòng của biến',
            ),
            B(
              '<code>good: ({ opacityValue }) =&gt; `var(--c-good)`</code> — the function form is required, and the modifier is applied to the returned string',
              '<code>good: ({ opacityValue }) =&gt; `var(--c-good)`</code> — bắt buộc phải dùng dạng hàm, và bổ từ được áp lên chuỗi trả về',
            ),
            B(
              '<code>good: "#22c55e"</code> plus a <code>dark:</code> variant at every call site, since variables and opacity modifiers cannot be combined at all',
              '<code>good: "#22c55e"</code> cộng một biến thể <code>dark:</code> ở mọi chỗ gọi, vì biến và bổ từ độ mờ hoàn toàn không kết hợp được',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured with <code>good: "rgb(var(--c-good) / &lt;alpha-value&gt;)"</code>: <code>text-good</code> emits <code>--tw-text-opacity: 1; color: rgb(var(--c-good) / var(--tw-text-opacity))</code>, and <code>text-good/30</code> emits <code>color: rgb(var(--c-good) / 0.3)</code>. Both work. The trick is that the generator is given a template with a hole in it — <code>&lt;alpha-value&gt;</code> — so it can substitute the modifier without ever needing to parse the colour. The price is a real one and worth stating plainly: the variable can no longer hold a colour. It must hold bare channels (<code>34 197 94</code>, no <code>rgb()</code>, no <code>#</code>), so it is unusable in any hand-written CSS that expects a colour value, and a designer pasting a hex into it breaks every utility in that family at once. Tailwind 4 removes the whole awkwardness with <code>@theme</code> and native <code>color-mix()</code>; on 3.4 the channel form is the only option, which is exactly why chapter 6 spends a lesson on it. Option 4 is the counsel of despair the measurement exists to refute, and it is also how you end up with the 2,677-to-0 paired palette of question 28.',
            'Đo với <code>good: "rgb(var(--c-good) / &lt;alpha-value&gt;)"</code>: <code>text-good</code> phát ra <code>--tw-text-opacity: 1; color: rgb(var(--c-good) / var(--tw-text-opacity))</code>, còn <code>text-good/30</code> phát ra <code>color: rgb(var(--c-good) / 0.3)</code>. Cả hai đều chạy. Mẹo ở chỗ trình sinh được đưa cho một cái KHUÔN có sẵn một lỗ trống — <code>&lt;alpha-value&gt;</code> — nên nó thay bổ từ vào được mà không cần phân tích cái màu bao giờ. Cái giá thì có thật và đáng nói thẳng: cái biến không còn được phép chứa một MÀU. Nó phải chứa các kênh TRẦN (<code>34 197 94</code>, không <code>rgb()</code>, không dấu <code>#</code>), nên nó vô dụng trong mọi đoạn CSS viết tay chờ một giá trị màu, và một nhà thiết kế dán một mã hex vào đó sẽ làm hỏng mọi tiện ích của cả họ màu đó cùng lúc. Tailwind 4 gỡ bỏ toàn bộ sự vụng về này bằng <code>@theme</code> và <code>color-mix()</code> nguyên bản; trên 3.4 thì dạng kênh là lựa chọn DUY NHẤT, và đó chính là lý do chương 6 dành hẳn một bài cho nó. Phương án 4 là lời khuyên đầu hàng mà phép đo này sinh ra để bác bỏ, và nó cũng chính là cách bạn kết thúc với bảng màu cặp tỉ số 2.677-trên-0 của câu 28.',
          ),
        }),

        // q32 · đáp án 3
        mcq({
          prompt: B(
            'What does putting <code>var(--surface)</code> in the config buy you that a paired <code>bg-darkcard dark:bg-lightcard</code> does not?',
            'Đặt <code>var(--surface)</code> vào cấu hình mua được cho bạn thứ gì mà một cặp <code>bg-darkcard dark:bg-lightcard</code> không có?',
          ),
          options: [
            B(
              'Smaller CSS: one variable-backed utility replaces two colour utilities, which halves the size of the colour section of the output',
              'CSS nhỏ hơn: một tiện ích tựa trên biến thay cho hai tiện ích màu, và điều đó giảm một nửa kích thước phần màu của đầu ra',
            ),
            B(
              'Runtime theming without a rebuild, which the paired form cannot do because <code>dark:</code> utilities are resolved at build time',
              'Đổi theme lúc chạy mà không cần dựng lại, thứ mà dạng cặp không làm được vì tiện ích <code>dark:</code> được phân giải lúc dựng',
            ),
            B(
              'Correct behaviour under <code>prefers-color-scheme</code>, since a variable follows the OS preference while a class-based variant does not',
              'Hành vi đúng dưới <code>prefers-color-scheme</code>, vì một biến đi theo tuỳ chọn của hệ điều hành còn biến thể theo lớp thì không',
            ),
            B(
              'One class name that is correct in every theme — the value resolves at run time from whichever block is in scope, so there is no second class to keep in sync and no way for the two to drift apart',
              'MỘT tên lớp đúng ở MỌI theme — giá trị phân giải lúc chạy từ khối nào đang có hiệu lực, nên không có lớp thứ hai phải giữ đồng bộ và cũng không có cách nào để hai cái trôi lệch nhau',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The mechanism is that the utility emits <code>background-color: var(--surface)</code> once, and the <em>value</em> is chosen by the cascade at run time from whichever block currently applies — <code>:root</code>, <code>html.theme-dark</code>, or a scoped wrapper. The win is not primarily bytes or performance; it is that a class of bug becomes impossible. With the paired form, every themed element carries two class names that encode the same decision twice, a human keeps them in sync, and when someone adds an element and forgets the <code>dark:</code> half, the result is invisible until a user switches themes. With a variable there is no second half to forget. This also scales past two themes at no extra cost, which is how the Notes area in this repository supports three. Option 2 is true and useful but secondary — you rarely need to retheme without a rebuild, and if that were the main benefit the paired form would be nearly as good. Option 3 is false: <code>dark:</code> under <code>darkMode: "media"</code> follows <code>prefers-color-scheme</code> exactly. Option 1 overstates a small effect.',
            'Cơ chế là tiện ích phát ra <code>background-color: var(--surface)</code> đúng một lần, và GIÁ TRỊ được cascade chọn lúc chạy từ khối nào đang áp — <code>:root</code>, <code>html.theme-dark</code>, hay một phần tử bọc có phạm vi. Cái được không chủ yếu là byte hay hiệu năng; nó là một LOẠI con bọ trở nên bất khả. Với dạng cặp, mỗi phần tử có theme mang hai tên lớp mã hoá cùng một quyết định hai lần, một con người giữ chúng đồng bộ, và khi ai đó thêm một phần tử rồi quên nửa <code>dark:</code> thì kết quả vô hình cho tới lúc một người dùng đổi theme. Với một biến thì chẳng có nửa thứ hai nào để mà quên. Cách này còn mở rộng quá hai theme mà không tốn thêm gì, và đó là cách vùng Notes của kho này hỗ trợ được ba theme. Phương án 2 đúng và hữu ích nhưng là thứ yếu — bạn hiếm khi cần đổi theme mà không dựng lại, và nếu đó là lợi ích chính thì dạng cặp đã gần tốt ngang. Phương án 3 sai: <code>dark:</code> dưới <code>darkMode: "media"</code> đi theo <code>prefers-color-scheme</code> chính xác. Phương án 1 nói quá một hiệu ứng nhỏ.',
          ),
        }),

        // q33 · đáp án 1
        mcq({
          prompt: B(
            'CSS variables solve theming so well that people start using them everywhere. In which case are they the <b>wrong</b> tool?',
            'Biến CSS giải quyết theme tốt tới mức người ta bắt đầu dùng chúng cho mọi thứ. Trong ca nào chúng là công cụ SAI?',
          ),
          options: [
            B(
              'For a colour that differs between light and dark mode — a variant pair is more explicit and easier to grep for',
              'Cho một màu khác nhau giữa theme sáng và tối — một cặp biến thể thì tường minh hơn và dễ grep hơn',
            ),
            B(
              'For a value that must be readable by the build — a breakpoint, a spacing step, or anything a utility name is derived from, since <code>@media (min-width: var(--bp))</code> is not valid CSS',
              'Cho một giá trị mà bản DỰNG phải đọc được — một điểm ngắt, một bậc khoảng cách, hay bất cứ thứ gì mà tên tiện ích được suy ra từ đó, vì <code>@media (min-width: var(--bp))</code> không phải CSS hợp lệ',
            ),
            B(
              'For a value that changes per component instance, because a variable set on an element cannot be read by its own declarations',
              'Cho một giá trị thay đổi theo từng thể hiện của component, vì một biến đặt trên một phần tử thì chính các khai báo của nó không đọc được',
            ),
            B(
              'For anything inside a <code>@layer</code> block, since Tailwind strips the layer and the variable loses the scope it was declared in',
              'Cho bất cứ thứ gì nằm trong một khối <code>@layer</code>, vì Tailwind xoá cái layer đi và biến mất phạm vi mà nó được khai báo trong đó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Custom properties are resolved by the browser at <em>computed-value</em> time, which is long after the build and, crucially, after at-rule conditions have already been evaluated. So a media query cannot read one: <code>@media (min-width: var(--bp))</code> is invalid and is dropped. The same limit applies to anything the generator must know in order to produce a class name — you cannot derive <code>p-4</code> from a value that only exists in the browser. Media features are the clean example, and the practical rule that follows is: values the <em>build</em> needs go in the config, values the <em>runtime</em> chooses go in variables. There is a second, subtler case worth knowing — a variable read inside a rule that is otherwise identical across elements defeats the deduplication utilities give you, because the declaration is shared but the computed result is not. Option 1 is exactly backwards; that is the case variables are best at. Option 3 is false: an element\'s own declarations read variables set on it, and that is a standard pattern. Option 4 is false: <code>@layer</code> is a build-time directive, and stripping it moves rules without changing any scope.',
            'Thuộc tính tuỳ chỉnh được trình duyệt phân giải ở thời điểm TÍNH GIÁ TRỊ, tức là rất lâu sau lượt dựng và, quan trọng hơn, sau khi các điều kiện at-rule đã được định trị xong. Nên một truy vấn phương tiện không đọc được nó: <code>@media (min-width: var(--bp))</code> không hợp lệ và bị vứt bỏ. Cùng giới hạn ấy áp cho mọi thứ mà trình sinh phải BIẾT mới tạo ra được một tên lớp — bạn không suy ra được <code>p-4</code> từ một giá trị chỉ tồn tại trong trình duyệt. Đặc trưng phương tiện là ví dụ sạch nhất, và luật thực dụng rút ra là: giá trị mà bản DỰNG cần thì để trong config, giá trị mà LÚC CHẠY chọn thì để trong biến. Còn một ca thứ hai tinh tế hơn cũng đáng biết — một biến đọc bên trong một quy tắc vốn giống hệt nhau giữa các phần tử sẽ phá luôn khả năng khử trùng lặp mà tiện ích cho bạn, vì khai báo thì dùng chung còn kết quả tính ra thì không. Phương án 1 đúng là ngược: đó chính là ca mà biến giỏi nhất. Phương án 3 sai: các khai báo của chính một phần tử đọc được biến đặt trên nó, và đó là một khuôn mẫu chuẩn. Phương án 4 sai: <code>@layer</code> là một chỉ thị lúc dựng, và việc xoá nó chỉ DI DỜI quy tắc chứ không đổi phạm vi nào.',
          ),
        }),

        // q34 · đáp án 2
        mcq({
          prompt: B(
            'Two greps against this repository\'s real built stylesheet. What does the pair prove?' +
            code('$ grep -c "^\\.bg-cat-vocab-bg {"  repo.css   ->  1\n' +
                 '$ grep -c "bg-cat-vocab-bg\\\\/"     repo.css   ->  0'),
            'Hai lệnh grep chạy trên chính bảng kiểu đã dựng thật của kho này. Cặp kết quả đó chứng minh điều gì?' +
            code('$ grep -c "^\\.bg-cat-vocab-bg {"  repo.css   ->  1\n' +
                 '$ grep -c "bg-cat-vocab-bg\\\\/"     repo.css   ->  0'),
          ),
          options: [
            B(
              'That the class is unused, so the generator emitted the base rule from the safelist and skipped the modifier variants nobody wrote',
              'Rằng cái lớp này không được dùng, nên trình sinh phát ra quy tắc nền từ safelist và bỏ qua các biến thể bổ từ không ai viết',
            ),
            B(
              'That the build is stale — a rebuild would emit the modifier variants alongside the base rule',
              'Rằng bản dựng đã cũ — dựng lại sẽ phát sinh các biến thể bổ từ cùng với quy tắc nền',
            ),
            B(
              'That the base class is alive and every opacity variant of it is dead: any <code>bg-cat-vocab-bg/70</code> written in a component renders at full opacity, with no error anywhere',
              'Rằng lớp nền thì SỐNG còn mọi biến thể độ mờ của nó thì CHẾT: bất kỳ <code>bg-cat-vocab-bg/70</code> nào viết trong một component đều hiện ra đục hoàn toàn, và không có lỗi ở đâu cả',
            ),
            B(
              'Nothing about the modifiers — <code>grep</code> cannot match them because the slash is escaped in the output, so the second count is a false negative',
              'Không chứng minh gì về các bổ từ — <code>grep</code> không khớp được chúng vì dấu gạch chéo bị thoát trong đầu ra, nên con số thứ hai là một âm tính giả',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is question 30 confirmed on production code rather than a sandbox. The repository declares <code>cat.vocab.bg: "var(--cat-vocab-bg)"</code> — the bare <code>var()</code> form — so the base utility generates (<code>background-color: var(--cat-vocab-bg)</code>, one match) and every opacity modifier of it generates nothing (zero matches). Any component that wrote <code>bg-cat-vocab-bg/70</code> intending a translucent tint is rendering it fully opaque, and nothing in the build, the type-checker or the browser console says so. The general lesson is the one the diagnosis chapter turns into a habit: <b>the first question about a class that "does nothing" is whether the rule exists at all</b>, and one <code>grep</code> against the built file answers it in a second — far faster than DevTools, which cannot show you a declaration that was never emitted. Option 4 deserves care because the escaping worry is legitimate; the second pattern accounts for it, matching the escaped <code>\\/</code> that the generator writes, which is why a zero here is a real zero. Option 1 has it backwards: the base rule is emitted <em>because</em> the class is used.',
            'Đây là câu 30 được xác nhận trên mã production chứ không phải trong hộp cát. Kho này khai <code>cat.vocab.bg: "var(--cat-vocab-bg)"</code> — dạng <code>var()</code> trần — nên tiện ích nền phát sinh được (<code>background-color: var(--cat-vocab-bg)</code>, một kết quả) còn mọi bổ từ độ mờ của nó thì không phát sinh gì (số 0 kết quả). Bất kỳ component nào đã viết <code>bg-cat-vocab-bg/70</code> với ý định một mảng màu trong suốt đều đang hiện ra ĐỤC HOÀN TOÀN, và không có gì trong bản dựng, trong bộ kiểm kiểu hay trong console trình duyệt nói ra điều đó. Bài học tổng quát chính là thứ mà chương chẩn đoán biến thành một thói quen: <b>câu hỏi ĐẦU TIÊN về một lớp "chẳng làm gì" là quy tắc ấy có TỒN TẠI không</b>, và một lệnh <code>grep</code> trên file đã dựng trả lời trong một giây — nhanh hơn hẳn DevTools, thứ không thể cho bạn xem một khai báo chưa từng được phát sinh. Phương án 4 đáng cẩn thận vì nỗi lo về ký tự thoát là chính đáng; mẫu thứ hai đã tính tới điều đó, nó khớp đúng dạng <code>\\/</code> đã thoát mà trình sinh ghi ra, nên số 0 ở đây là một số 0 THẬT. Phương án 1 nói ngược: quy tắc nền được phát sinh CHÍNH VÌ cái lớp có được dùng.',
          ),
        }),

        /* ── Chương 7 — @layer và Preflight (5 câu) ──────────────────────── */

        // q35 · đáp án 3
        mcq({
          prompt: B(
            'You write <code>@layer components { .btn { … } }</code> in your entry CSS, build, and run <code>grep -c "@layer" out.css</code>. What comes back, and what does it mean?',
            'Bạn viết <code>@layer components { .btn { … } }</code> trong file CSS đầu vào, dựng, rồi chạy <code>grep -c "@layer" out.css</code>. Kết quả là gì, và nó nghĩa là sao?',
          ),
          options: [
            B(
              'Three — one for each of <code>base</code>, <code>components</code> and <code>utilities</code>, declared at the top of the file in cascade-layer order',
              'Ba — mỗi cái cho <code>base</code>, <code>components</code> và <code>utilities</code>, khai ở đầu file theo thứ tự cascade layer',
            ),
            B(
              'One — only the layer you wrote survives, and the browser then ranks it below every un-layered rule in the file',
              'Một — chỉ cái layer bạn viết sống sót, rồi trình duyệt xếp nó dưới mọi quy tắc không-layer trong file',
            ),
            B(
              'Four — the three Tailwind layers plus yours, which is why your rule is guaranteed to lose to a utility',
              'Bốn — ba layer của Tailwind cộng cái của bạn, và đó là lý do quy tắc của bạn chắc chắn thua một tiện ích',
            ),
            B(
              'Zero — Tailwind 3 uses <code>@layer</code> as a build-time <em>relocation</em> directive and discards it, so the output is flat CSS and the CSS cascade-layer rules never apply to it',
              'SỐ 0 — Tailwind 3 dùng <code>@layer</code> như một chỉ thị DI DỜI lúc dựng rồi vứt nó đi, nên đầu ra là CSS PHẲNG và các luật cascade layer của CSS không bao giờ áp cho nó',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured twice — on a sandbox build and on this repository\'s real 626,723-byte stylesheet — and both times the count is <b>zero</b>. This is the central surprise of the chapter, and it turns on a name collision. Tailwind 3\'s <code>@layer</code> is <em>not</em> the CSS at-rule that shares its spelling. It is an instruction meaning "move this rule into the block that <code>@tailwind components</code> generates", and once the move is done the directive is thrown away. Two consequences follow immediately. Everything you know about CSS cascade layers — that a layered rule loses to an un-layered one regardless of specificity — is <b>irrelevant to Tailwind 3 output</b>, because there are no layers in it. And the thing <code>@layer</code> actually buys you is <em>position</em>: your rule ends up before the utilities block, so a utility with equal specificity can override it. That is a real and useful effect, just not the one the keyword suggests. Tailwind 4 does emit real <code>@layer</code>; on 3.4 the two mechanisms share one name and are otherwise unrelated. Options 1 and 3 assume the CSS feature; option 2 also inverts what layering would do if it were there.',
            'Đo hai lần — trên một bản dựng hộp cát và trên chính bảng kiểu thật 626.723 byte của kho này — và cả hai lần con số là <b>0</b>. Đây là cú bất ngờ trung tâm của chương, và nó xoay quanh một sự TRÙNG TÊN. <code>@layer</code> của Tailwind 3 KHÔNG PHẢI cái at-rule CSS viết giống hệt nó. Nó là một chỉ thị có nghĩa "DI DỜI quy tắc này vào cái khối mà <code>@tailwind components</code> phát sinh", và một khi cú dời xong thì chỉ thị bị vứt. Hai hệ quả tới ngay. Mọi thứ bạn biết về cascade layer của CSS — rằng một quy tắc có layer thua một quy tắc không layer bất kể độ đặc hiệu — đều <b>KHÔNG LIÊN QUAN tới đầu ra của Tailwind 3</b>, vì trong đó không có layer nào. Và thứ mà <code>@layer</code> thật sự mua cho bạn là VỊ TRÍ: quy tắc của bạn kết thúc ở phía trước khối tiện ích, nên một tiện ích cùng độ đặc hiệu đè được nó. Đó là một hiệu ứng thật và hữu ích, chỉ là không phải cái mà từ khoá kia gợi ra. Tailwind 4 CÓ phát sinh <code>@layer</code> thật; trên 3.4 thì hai cơ chế trùng một cái tên và ngoài ra không liên quan gì nhau. Phương án 1 và 3 giả định tính năng CSS; phương án 2 còn đảo ngược luôn việc mà layer sẽ làm nếu nó có ở đó.',
          ),
        }),

        // q36 · đáp án 1
        mcq({
          prompt: B(
            'This entry CSS is built against <code>class="px-4 hover:px-4 md:px-4 no-layer tap"</code>, and these are the measured line numbers. Which reading is right?' +
            code('@tailwind base;\n@tailwind components;\n@tailwind utilities;\n' +
                 '@layer utilities { .tap { -webkit-tap-highlight-color: transparent; } }\n' +
                 '.no-layer { padding-left: 3rem; }\n' +
                 '\n' +
                 '557 .px-4            562 .tap            566 .no-layer\n' +
                 '570 .hover\\:px-4:hover                    575 @media (min-width: 768px)'),
            'File CSS đầu vào này được dựng với <code>class="px-4 hover:px-4 md:px-4 no-layer tap"</code>, và đây là số dòng đo được. Cách đọc nào đúng?' +
            code('@tailwind base;\n@tailwind components;\n@tailwind utilities;\n' +
                 '@layer utilities { .tap { -webkit-tap-highlight-color: transparent; } }\n' +
                 '.no-layer { padding-left: 3rem; }\n' +
                 '\n' +
                 '557 .px-4            562 .tap            566 .no-layer\n' +
                 '570 .hover\\:px-4:hover                    575 @media (min-width: 768px)'),
          ),
          options: [
            B(
              'Un-layered rules are hoisted up to sit with the component styles, so <code>.px-4</code> comes after and wins every conflict with <code>.no-layer</code>',
              'Quy tắc không-layer bị đẩy lên nằm cùng phần kiểu component, nên <code>.px-4</code> đứng sau và thắng mọi xung đột với <code>.no-layer</code>',
            ),
            B(
              'It lands exactly where it was written relative to the directives: after the plain utilities, so it beats <code>px-4</code> — but <em>before</em> the variant utilities, so <code>hover:px-4</code> and <code>md:px-4</code> still beat it',
              'Nó rơi đúng chỗ nó được VIẾT so với các chỉ thị: sau các tiện ích thường, nên nó thắng <code>px-4</code> — nhưng TRƯỚC các tiện ích có biến thể, nên <code>hover:px-4</code> và <code>md:px-4</code> vẫn thắng nó',
            ),
            B(
              'It goes at the very end of the file after every utility, so <code>.no-layer</code> beats all three of <code>px-4</code>, <code>hover:px-4</code> and <code>md:px-4</code>',
              'Nó đi xuống CUỐI hẳn file sau mọi tiện ích, nên <code>.no-layer</code> thắng cả ba <code>px-4</code>, <code>hover:px-4</code> và <code>md:px-4</code>',
            ),
            B(
              'Nowhere — a rule outside any <code>@layer</code> is dropped, which is why every hand-written rule must be wrapped',
              'Không đâu cả — một quy tắc nằm ngoài mọi <code>@layer</code> bị vứt bỏ, và đó là lý do mọi quy tắc viết tay đều phải được bọc lại',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The <code>@tailwind</code> directives are literal injection points, and un-layered CSS keeps its position around them. Measured: writing <code>.no-layer</code> after <code>@tailwind utilities</code> puts it at 566, past <code>.px-4</code> (557) and past the hoisted <code>.tap</code> (562) — so it wins a 0-1-0 tie with a plain utility. But the variant utilities are emitted after it, at 570 and 575, so <code>hover:px-4</code> and <code>md:px-4</code> still win. A second build confirms the mechanism from the other side: move the same rule <em>above</em> <code>@tailwind utilities</code> and it comes out at 557 with <code>.px-4</code> at 561, losing to all three. This is the whole practical value of <code>@layer</code> on Tailwind 3 — wrapping the rule in <code>@layer components</code> relocates it before the utilities so they can override it, which is what you want for a <code>.btn</code> whose padding a caller should be able to change. Note what layering does <em>not</em> do: it does not touch specificity, so a hand-written <code>.card .title</code> at 0-2-0 beats every utility from any position and moving it is wasted effort. Option 3 is the near-miss most people carry, and it is exactly the belief that makes an override "work locally, fail at <code>md</code>".',
            'Các chỉ thị <code>@tailwind</code> là những điểm chèn NGUYÊN VĂN, và CSS không-layer giữ nguyên vị trí của nó quanh chúng. Đo thật: viết <code>.no-layer</code> SAU <code>@tailwind utilities</code> thì nó ra ở dòng 566, vượt qua <code>.px-4</code> (557) và qua cả <code>.tap</code> đã được hoisted (562) — nên nó thắng một thế hoà 0-1-0 với một tiện ích thường. Nhưng các tiện ích CÓ BIẾN THỂ được phát sinh SAU nó, ở dòng 570 và 575, nên <code>hover:px-4</code> và <code>md:px-4</code> vẫn thắng. Một lượt dựng thứ hai xác nhận cơ chế từ phía ngược lại: dời chính quy tắc ấy lên TRÊN <code>@tailwind utilities</code> thì nó ló ra ở 557 với <code>.px-4</code> ở 561, và thua cả ba. Đây chính là toàn bộ giá trị thực dụng của <code>@layer</code> trên Tailwind 3 — bọc quy tắc trong <code>@layer components</code> sẽ dời nó ra trước các tiện ích để chúng đè được nó, đúng thứ bạn muốn cho một <code>.btn</code> mà người gọi phải đổi được padding. Để ý cái mà layer KHÔNG làm: nó không đụng tới độ đặc hiệu, nên một <code>.card .title</code> viết tay ở mức 0-2-0 thắng mọi tiện ích từ mọi vị trí và dời nó là công cốc. Phương án 3 là cú suýt trúng mà đa số người ta mang theo, và nó chính là niềm tin làm một cú ghi đè "chạy ở màn hình nhỏ, hỏng ở <code>md</code>".',
          ),
        }),

        // q37 · đáp án 0
        mcq({
          prompt: B(
            'A file containing only <code>@tailwind base;</code> is built. What comes out, and why does it explain half the "why does this element look bare" questions?' +
            code('$ echo "@tailwind base;" > only-base.css\n' +
                 '$ tailwindcss -i only-base.css -o out.css\n' +
                 '$ wc -l < out.css\n' +
                 '???'),
            'Một file chỉ chứa <code>@tailwind base;</code> được dựng. Cái gì ló ra, và vì sao nó giải thích một nửa số câu hỏi "sao thẻ này trông trần trụi thế"?' +
            code('$ echo "@tailwind base;" > only-base.css\n' +
                 '$ tailwindcss -i only-base.css -o out.css\n' +
                 '$ wc -l < out.css\n' +
                 '???'),
          ),
          options: [
            B(
              '555 lines and 41 rules of Preflight — a reset that strips heading sizes, list markers and button appearance before anything you write',
              '555 dòng và 41 quy tắc Preflight — một bản reset lột bỏ cỡ tiêu đề, dấu đầu dòng của danh sách và diện mạo nút TRƯỚC bất cứ thứ gì bạn viết',
            ),
            B(
              'An empty file: <code>@tailwind base</code> only reserves an injection point, and the reset arrives with <code>@tailwind utilities</code>',
              'Một file rỗng: <code>@tailwind base</code> chỉ giữ chỗ một điểm chèn, còn bản reset đi kèm <code>@tailwind utilities</code>',
            ),
            B(
              'The full default theme as CSS variables, roughly 300 lines, with no rules until a utility is generated',
              'Toàn bộ theme mặc định dưới dạng biến CSS, khoảng 300 dòng, và không có quy tắc nào cho tới khi một tiện ích được sinh ra',
            ),
            B(
              'A normalize.css copy, unchanged, which preserves browser defaults rather than removing them',
              'Một bản sao normalize.css nguyên vẹn, thứ GIỮ LẠI mặc định của trình duyệt chứ không gỡ bỏ chúng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: 555 lines, 41 rules. Preflight is what <code>@tailwind base</code> expands into, and it is opinionated in a specific direction — it removes browser defaults so that every visual property on the page is one you asked for. <code>h1</code> loses its size and weight, <code>ul</code> loses its bullets and indent, <code>button</code> loses its border and background, images become <code>display: block</code>. That is coherent with the rest of Tailwind, and it is also why HTML you do not control looks broken: Markdown rendered from a CMS, an email preview, a third-party widget. Those need their styling restored explicitly, which is why this repository carries scoped rules doing exactly that. Knowing Preflight is there changes the diagnosis of a whole class of reports from "the CSS is missing" to "the CSS is present and it removed something". Option 4 names the right ancestor and the wrong behaviour — Preflight is <em>based</em> on modern-normalize but goes further, and the difference is precisely that normalize preserves defaults while Preflight removes them. Options 2 and 3 both misplace where the reset lives.',
            'Đo thật: 555 dòng, 41 quy tắc. Preflight chính là thứ <code>@tailwind base</code> nở ra, và nó có quan điểm rõ ràng theo một hướng cụ thể — nó GỠ BỎ mặc định của trình duyệt để mọi thuộc tính thị giác trên trang đều là thứ bạn yêu cầu. <code>h1</code> mất cỡ chữ và độ đậm, <code>ul</code> mất dấu đầu dòng và phần thụt lề, <code>button</code> mất viền và nền, ảnh chuyển thành <code>display: block</code>. Điều đó nhất quán với phần còn lại của Tailwind, và nó cũng là lý do phần HTML bạn KHÔNG kiểm soát trông như hỏng: Markdown render từ một CMS, một bản xem trước email, một widget của bên thứ ba. Những thứ đó cần được ĐẶT LẠI kiểu dáng một cách tường minh, và đó là lý do kho này mang theo những quy tắc có-phạm-vi làm đúng việc ấy. Biết Preflight có ở đó sẽ đổi cách chẩn đoán cả một loại báo cáo, từ "thiếu CSS" thành "CSS có đủ và nó đã GỠ mất một thứ". Phương án 4 gọi đúng tổ tiên nhưng sai hành vi — Preflight DỰA TRÊN modern-normalize nhưng đi xa hơn, và khác biệt đúng ở chỗ normalize GIỮ mặc định còn Preflight GỠ chúng. Phương án 2 và 3 đều đặt sai chỗ bản reset nằm.',
          ),
        }),

        // q38 · đáp án 2
        mcq({
          prompt: B(
            'Someone reorders the three directives in the entry file. Build succeeds, exit 0, no warning. What breaks?' +
            code('@tailwind utilities;\n@tailwind base;\n@tailwind components;'),
            'Ai đó đảo thứ tự ba chỉ thị trong file đầu vào. Dựng thành công, mã thoát 0, không cảnh báo. Cái gì hỏng?',
          ),
          options: [
            B(
              'Nothing: the three directives are independent injection points and their order in the input has no effect on the output',
              'Không gì cả: ba chỉ thị là ba điểm chèn độc lập và thứ tự của chúng trong đầu vào không ảnh hưởng tới đầu ra',
            ),
            B(
              'Only <code>@layer</code> placement: rules you wrote into <code>components</code> move to the top, while utilities and Preflight keep their relative order',
              'Chỉ vị trí <code>@layer</code>: các quy tắc bạn viết vào <code>components</code> dời lên đầu, còn tiện ích và Preflight giữ nguyên thứ tự tương đối',
            ),
            B(
              'Utilities are now emitted <em>before</em> Preflight, so the reset overrides them — <code>text-3xl</code> on an <code>h1</code> loses to Preflight\'s <code>font-size: inherit</code>',
              'Tiện ích giờ được phát sinh TRƯỚC Preflight, nên bản reset ĐÈ LÊN chúng — <code>text-3xl</code> trên một <code>h1</code> thua <code>font-size: inherit</code> của Preflight',
            ),
            B(
              'The build silently drops <code>@tailwind components</code>, because only the first two directives are honoured in a single file',
              'Bản dựng âm thầm vứt <code>@tailwind components</code>, vì chỉ hai chỉ thị đầu tiên được tôn trọng trong một file',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured on exactly this input: the output begins with <code>.mt-4</code> at line 1 and the Preflight block starts at line 5. The directives are literal injection points — each one is replaced in place by the block it names — so their order in the input <em>is</em> their order in the output, and the file is read top to bottom by the browser like any other. With utilities first, every Preflight rule that touches a property a utility also sets now wins on source order. The visible damage is exactly where Preflight is most opinionated: headings, lists and buttons. And the reason this is worth a question is that nothing tells you. The build is green, the class is in the HTML, the rule is in the CSS, DevTools shows it struck through by a <code>*</code> or element selector that looks like it came from the browser rather than from your own stylesheet. Option 1 is the belief that produces this bug. Option 4 invents a limit that does not exist. Option 2 describes a much smaller effect than the one that actually occurs.',
            'Đo trên đúng đầu vào này: đầu ra bắt đầu bằng <code>.mt-4</code> ở dòng 1 và khối Preflight bắt đầu ở dòng 5. Các chỉ thị là những ĐIỂM CHÈN nguyên văn — mỗi cái được thay tại chỗ bằng đúng cái khối nó gọi tên — nên thứ tự của chúng trong đầu vào CHÍNH LÀ thứ tự của chúng trong đầu ra, và file được trình duyệt đọc từ trên xuống như mọi file khác. Với tiện ích ra trước, mọi quy tắc Preflight chạm tới một thuộc tính mà tiện ích cũng đặt sẽ thắng nhờ thứ tự nguồn. Thiệt hại nhìn thấy được nằm đúng chỗ Preflight có quan điểm mạnh nhất: tiêu đề, danh sách và nút. Và lý do điều này đáng một câu hỏi là chẳng có gì báo cho bạn cả. Bản dựng xanh, cái lớp có trong HTML, quy tắc có trong CSS, DevTools hiện nó bị gạch bởi một selector <code>*</code> hay selector phần tử trông như tới từ trình duyệt chứ không phải từ chính bảng kiểu của bạn. Phương án 1 là niềm tin sinh ra con bọ này. Phương án 4 bịa ra một giới hạn không tồn tại. Phương án 2 mô tả một hiệu ứng nhỏ hơn nhiều so với thứ thật sự xảy ra.',
          ),
        }),

        // q39 · đáp án 3
        mcq({
          prompt: B(
            'An audit of 620 hand-written selectors finds that only 139 of them depend on position in the output file. What is true of the other 481?',
            'Một cuộc soát 620 selector viết tay tìm ra chỉ 139 cái phụ thuộc VỊ TRÍ trong file đầu ra. Điều gì đúng với 481 cái còn lại?',
          ),
          options: [
            B(
              'They are dead: a selector that does not depend on position is one no element matches, so the audit found 481 rules to delete',
              'Chúng đã chết: một selector không phụ thuộc vị trí là selector không phần tử nào khớp, nên cuộc soát tìm ra 481 quy tắc để xoá',
            ),
            B(
              'They already sit in <code>@layer components</code>, so their position is fixed and cannot be changed by editing the file',
              'Chúng vốn đã nằm trong <code>@layer components</code>, nên vị trí của chúng cố định và không đổi được bằng cách sửa file',
            ),
            B(
              'They conflict with no utility at all, so their position is irrelevant and the audit has nothing to say about them',
              'Chúng không đụng với tiện ích nào cả, nên vị trí của chúng không liên quan và cuộc soát chẳng nói được gì về chúng',
            ),
            B(
              'Most are descendant or compound selectors at 0-2-0 or higher, so they beat any 0-1-0 utility wherever they sit — moving them into a layer changes nothing and the fix must be something else',
              'Phần lớn là selector con cháu hoặc selector ghép ở mức 0-2-0 trở lên, nên chúng thắng mọi tiện ích 0-1-0 dù nằm ở đâu — dời chúng vào một layer chẳng đổi được gì và cú vá phải là thứ khác',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the measurement that stops a wasted refactor. "Wrap your CSS in <code>@layer components</code> so utilities can override it" is good advice, but it only does anything for rules that were losing on <em>position</em> — a single-class selector tying with a utility at 0-1-0 and winning because un-layered CSS is emitted last. Once a selector reaches 0-2-0, and most hand-written CSS does the moment it has a descendant combinator (<code>.card .title</code>) or a compound (<code>.btn.active</code>), specificity decides and position is irrelevant. Moving it costs a diff and changes nothing, and the class still will not apply. For those the real options are: reduce the selector\'s specificity, make the utility win with <code>!</code> at the call site, or accept that the component owns that property and stop passing a utility for it. Knowing which of the three categories a rule falls into before you edit is the difference between a fix and a churn. Option 1 misreads the criterion. Option 2 is false on Tailwind 3, where <code>@layer</code> is stripped entirely.',
            'Đây là phép đo chặn được một cuộc tái cấu trúc công cốc. "Bọc CSS của bạn trong <code>@layer components</code> để tiện ích đè được nó" là lời khuyên tốt, nhưng nó chỉ có tác dụng với những quy tắc đang thua vì VỊ TRÍ — một selector một-lớp hoà với tiện ích ở 0-1-0 và thắng nhờ CSS không-layer được phát sinh sau cùng. Một khi selector đạt 0-2-0, và phần lớn CSS viết tay đạt mức đó ngay khi nó có một bộ kết hợp con cháu (<code>.card .title</code>) hay một selector ghép (<code>.btn.active</code>), thì ĐỘ ĐẶC HIỆU quyết định và vị trí không còn liên quan. Dời nó tốn một cái diff mà chẳng đổi gì, và cái lớp vẫn không ăn. Với những cái đó thì lựa chọn thật là: giảm độ đặc hiệu của selector, cho tiện ích thắng bằng <code>!</code> ngay tại chỗ gọi, hoặc chấp nhận rằng component sở hữu thuộc tính ấy và thôi truyền một tiện ích cho nó. Biết một quy tắc rơi vào loại nào trong ba loại TRƯỚC KHI sửa chính là khác biệt giữa một cú vá và một vòng quay vô ích. Phương án 1 đọc sai tiêu chí. Phương án 2 sai trên Tailwind 3, nơi <code>@layer</code> bị xoá hoàn toàn.',
          ),
        }),

        /* ── Chương 8 — Kích thước đầu ra (4 câu) ────────────────────────── */

        // q40 · đáp án 0
        mcq({
          prompt: B(
            'A build that used to take about five seconds now finishes in 93 ms and produces a 10,491-byte file with exit code 0. What is the diagnosis?',
            'Một lượt dựng trước đây tốn khoảng năm giây giờ xong trong 93 ms và cho ra một file 10.491 byte với mã thoát 0. Chẩn đoán là gì?',
          ),
          options: [
            B(
              'The <code>content</code> glob matches nothing: fast, tiny, zero utility rules and exit 0 together are the signature of a scanner that found no files at all',
              'Mẫu <code>content</code> không khớp gì cả: nhanh, bé, không quy tắc tiện ích nào và mã thoát 0 gộp lại chính là chữ ký của một bộ quét không tìm thấy file nào',
            ),
            B(
              'The build cache is warm, which is the expected and desirable outcome after the first run',
              'Cache dựng đang nóng, đó là kết quả mong đợi và đáng mừng sau lượt chạy đầu tiên',
            ),
            B(
              'Minification was enabled, and 10 KB is the realistic minified size of a utility stylesheet for a medium application',
              'Chế độ rút gọn đã được bật, và 10 KB là kích thước thực tế sau rút gọn của một bảng kiểu tiện ích cho một ứng dụng cỡ trung',
            ),
            B(
              'A syntax error in the entry CSS: PostCSS aborted early but still wrote the part it had processed before failing',
              'Một lỗi cú pháp trong file CSS đầu vào: PostCSS dừng sớm nhưng vẫn ghi ra phần nó đã xử lý trước khi hỏng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured with <code>content: ["./sr/**/*.html"]</code> — one character wrong: 93 ms, 10,491 bytes, 41 rules, exit 0. All 41 are Preflight; not one utility. Compare with the same project built correctly: about 5 seconds and hundreds of kilobytes. The build got 50 times faster because it did nothing, and that is the point worth carrying — <b>a fast build is a symptom, not a win</b>. The three numbers together are the signature, and each alone is ambiguous: fast could be caching, small could be a small app, exit 0 is meaningless here since a scanner that finds no files has nothing to fail on. What makes this dangerous in practice is that it usually appears after a directory rename or a move to a monorepo, when everyone is expecting things to be different anyway, and the styles disappear on the deployed site rather than locally where the dev server may still be watching the old path. Option 4 is worth ruling out by reading the file: a syntax error would truncate mid-rule, whereas this output is complete and well-formed — it is simply missing an entire category of content.',
            'Đo với <code>content: ["./sr/**/*.html"]</code> — sai đúng một ký tự: 93 ms, 10.491 byte, 41 quy tắc, mã thoát 0. Cả 41 quy tắc đều là Preflight; không một tiện ích nào. So với cùng dự án dựng đúng: khoảng 5 giây và hàng trăm kilobyte. Lượt dựng nhanh gấp 50 lần vì nó KHÔNG LÀM GÌ, và đó là điều đáng mang theo — <b>một lượt dựng nhanh là một TRIỆU CHỨNG, không phải một chiến thắng</b>. Ba con số đi cùng nhau mới là chữ ký, còn từng con số một thì mơ hồ: nhanh có thể do cache, bé có thể do ứng dụng bé, mã thoát 0 thì vô nghĩa ở đây vì một bộ quét không tìm thấy file nào thì chẳng có gì để mà hỏng. Cái làm nó nguy hiểm trong thực tế là nó thường xuất hiện sau một cú đổi tên thư mục hoặc một cú chuyển sang monorepo, lúc mà ai cũng đang chờ đợi mọi thứ khác đi, và kiểu dáng biến mất trên trang đã triển khai chứ không phải ở máy cục bộ, nơi máy chủ phát triển có thể vẫn đang theo dõi đường dẫn cũ. Phương án 4 đáng loại bằng cách ĐỌC file: một lỗi cú pháp sẽ cắt cụt giữa một quy tắc, trong khi đầu ra này trọn vẹn và đúng khuôn — nó chỉ thiếu nguyên một chủng loại nội dung.',
          ),
        }),

        // q41 · đáp án 2
        mcq({
          prompt: B(
            'This repository\'s stylesheet, rebuilt and weighed today. Which comparison is the honest argument about output size?' +
            code('Tailwind output   626,723 B raw   105,779 B gzip -9\n' +
                 'globals.css       231,149 B raw    59,298 B gzip -9'),
            'Bảng kiểu của kho này, dựng lại và cân hôm nay. So sánh nào là lập luận TRUNG THỰC về kích thước đầu ra?' +
            code('Tailwind output   626.723 B tho   105.779 B gzip -9\n' +
                 'globals.css       231.149 B tho    59.298 B gzip -9'),
          ),
          options: [
            B(
              'Raw size is what matters, because the browser must parse the full 626 KB regardless of how it arrived over the wire',
              'Kích thước THÔ mới là thứ quan trọng, vì trình duyệt phải phân tích đủ 626 KB bất kể nó tới qua đường truyền thế nào',
            ),
            B(
              'Neither number is meaningful without a per-page measurement, since only the rules a page uses are ever downloaded',
              'Không con số nào có nghĩa nếu chưa đo theo TỪNG TRANG, vì chỉ những quy tắc mà một trang dùng mới được tải về',
            ),
            B(
              'Compression is the fair comparison: the utility output compresses 5.76:1 against 3.63:1 for the hand-written file, because sorted repetitive rules are what gzip is best at',
              'Nén mới là phép so công bằng: đầu ra tiện ích nén được 5,76:1 so với 3,63:1 của file viết tay, vì các quy tắc lặp lại và đã sắp xếp chính là thứ gzip giỏi nhất',
            ),
            B(
              'The hand-written file wins outright at 231 KB against 626 KB, and the ratio is a distraction from that gap',
              'File viết tay thắng dứt khoát với 231 KB so với 626 KB, và cái tỉ số chỉ là thứ đánh lạc hướng khỏi khoảng cách đó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Both files were rebuilt and gzipped today, and the ratios are the finding: 626,723 → 105,779 is <b>5.76:1</b>, while 231,149 → 59,298 is <b>3.63:1</b>. Utility CSS compresses better because it is exactly what a compressor wants — thousands of short rules, sorted, sharing long common substrings. Hand-written CSS is more varied per byte and therefore less compressible, so a file less than half the raw size transfers at more than half the cost. That is why raw size is the wrong number to argue about: it is the number people quote, and it exaggerates the difference by roughly the ratio between the two compression rates. Option 4 is the argument this measurement answers. Option 1 is not silly — parse cost is real — but it is second-order at these sizes and would need its own measurement, not a byte count. Option 2 describes per-route CSS splitting, which is a genuine technique and simply not what a single Tailwind build produces. Note also that these figures are a snapshot: the course text records 371,550 → 45,242 at 8.52:1 for an earlier state of the same repository, and it has since grown from 793 to 814 components. Re-measure before quoting.',
            'Cả hai file đều được dựng lại và nén gzip hôm nay, và chính các tỉ số mới là phát hiện: 626.723 → 105.779 là <b>5,76:1</b>, còn 231.149 → 59.298 là <b>3,63:1</b>. CSS tiện ích nén tốt hơn vì nó đúng là thứ một bộ nén mong muốn — hàng ngàn quy tắc ngắn, đã sắp xếp, chia sẻ những chuỗi con chung rất dài. CSS viết tay đa dạng hơn trên mỗi byte nên nén kém hơn, thành ra một file có kích thước thô chưa bằng một nửa lại truyền đi tốn hơn một nửa. Đó là lý do kích thước THÔ là con số sai để đem ra cãi nhau: nó là con số người ta hay trích, và nó phóng đại khoảng cách đúng bằng tỉ lệ giữa hai tốc độ nén. Phương án 4 là chính cái lập luận mà phép đo này trả lời. Phương án 1 không ngớ ngẩn — chi phí phân tích là có thật — nhưng ở cỡ này nó là thứ yếu và sẽ cần một phép đo riêng chứ không phải một phép đếm byte. Phương án 2 mô tả việc tách CSS theo tuyến, một kỹ thuật có thật nhưng đơn giản là không phải thứ một lượt dựng Tailwind đơn lẻ tạo ra. Cũng lưu ý các con số này là một ẢNH CHỤP: giáo trình ghi 371.550 → 45.242 ở tỉ số 8,52:1 cho một trạng thái sớm hơn của cùng kho ấy, và từ đó nó đã lớn từ 793 lên 814 component. Hãy đo lại trước khi trích dẫn.',
          ),
        }),

        // q42 · đáp án 1
        mcq({
          prompt: B(
            'To keep a dynamically-built class alive, a developer adds a comment to the <b>entry CSS file</b>. Does it work?' +
            code('/* keep: mt-9 */\n@tailwind base;\n@tailwind components;\n@tailwind utilities;'),
            'Để giữ cho một lớp ghép động sống được, một lập trình viên thêm một chú thích vào chính FILE CSS ĐẦU VÀO. Cách đó có chạy không?',
          ),
          options: [
            B(
              'Yes — the entry CSS is parsed by the same extractor, and a class name in a comment is a valid candidate string',
              'Có — file CSS đầu vào được chính bộ trích xuất phân tích, và một tên lớp trong chú thích là một chuỗi ứng viên hợp lệ',
            ),
            B(
              'No — the entry CSS is not part of <code>content</code>; the same comment placed in a scanned source file would work, and <code>safelist</code> is the intended mechanism',
              'Không — file CSS đầu vào KHÔNG thuộc <code>content</code>; chính chú thích đó đặt trong một file nguồn ĐƯỢC QUÉT thì lại chạy, và <code>safelist</code> mới là cơ chế dành cho việc này',
            ),
            B(
              'Yes, but only for utilities from the default theme; classes derived from <code>extend</code> need an explicit safelist entry as well',
              'Có, nhưng chỉ với tiện ích thuộc theme mặc định; các lớp suy ra từ <code>extend</code> thì vẫn cần thêm một mục safelist tường minh',
            ),
            B(
              'No, because comments are stripped by PostCSS before Tailwind runs, so no comment anywhere can ever safelist a class',
              'Không, vì chú thích bị PostCSS lược bỏ trước khi Tailwind chạy, nên không chú thích nào ở đâu có thể safelist được một lớp',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: with the comment in the entry CSS and <code>mt-7</code> in the scanned HTML, the output contains <code>.mt-7</code> once and <code>.mt-9</code> zero times. The reason is simple once stated: the extractor reads the files matched by <code>content</code>, and the CSS entry file is an <em>input to the compiler</em>, not a content source. Two things worth taking from this. First, the same trick <em>does</em> work in a scanned file — a class name in a JSX comment is generated, because the extractor is a regex over text and does not know what a comment is — which is why this misconception is so durable: people have seen it work, in a different file. Second, when you need to keep a name alive, use <code>safelist</code>: it is declared where a reader will look for it, it survives a refactor that deletes the file the comment was hiding in, and it accepts patterns. Option 4 makes a true-sounding claim about PostCSS that would also forbid the working case, so it is falsified by the same experiment.',
            'Đo thật: với chú thích nằm trong file CSS đầu vào và <code>mt-7</code> nằm trong file HTML được quét, đầu ra chứa <code>.mt-7</code> một lần và <code>.mt-9</code> SỐ 0 lần. Lý do đơn giản khi đã nói ra: bộ trích xuất đọc những file mà <code>content</code> khớp, còn file CSS đầu vào là ĐẦU VÀO CỦA TRÌNH BIÊN DỊCH chứ không phải một nguồn nội dung. Có hai điều đáng rút ra. Một, chính cái mẹo đó LẠI chạy trong một file được quét — một tên lớp nằm trong chú thích JSX vẫn được phát sinh, vì bộ trích xuất là một biểu thức chính quy chạy trên văn bản và không biết chú thích là gì — và đó là lý do ngộ nhận này dai dẳng đến thế: người ta ĐÃ thấy nó chạy, ở một file khác. Hai, khi bạn cần giữ một cái tên sống thì hãy dùng <code>safelist</code>: nó được khai ở chỗ người đọc sẽ tìm, nó sống sót qua một cú tái cấu trúc xoá mất file mà chú thích kia đang nấp trong đó, và nó nhận cả mẫu. Phương án 4 đưa ra một khẳng định nghe rất thật về PostCSS nhưng nó cũng sẽ cấm luôn cái ca CHẠY ĐƯỢC, nên nó bị bác bởi chính thí nghiệm ấy.',
          ),
        }),

        // q43 · đáp án 3
        mcq({
          prompt: B(
            'A stylesheet ships at about 105 KB gzipped. Which optimisation is worth doing first, and where should the work stop?',
            'Một bảng kiểu giao đi khoảng 105 KB sau gzip. Tối ưu nào đáng làm trước, và công việc nên DỪNG ở đâu?',
          ),
          options: [
            B(
              'Split the output per route so each page downloads only its own rules; stop when every route is under 20 KB',
              'Tách đầu ra theo từng tuyến để mỗi trang chỉ tải quy tắc của riêng nó; dừng khi mọi tuyến đều dưới 20 KB',
            ),
            B(
              'Trim the colour palette to the families actually used; stop when the config is smaller than the default',
              'Cắt bớt bảng màu còn đúng những họ thật sự dùng; dừng khi file cấu hình nhỏ hơn bản mặc định',
            ),
            B(
              'Replace arbitrary values with scale steps everywhere, since arbitrary values carry the heaviest per-rule cost',
              'Thay mọi giá trị tuỳ ý bằng bậc trên thang, vì giá trị tuỳ ý mang chi phí mỗi-quy-tắc nặng nhất',
            ),
            B(
              'Verify compression is on and the <code>content</code> glob is correct, then stop — at ~105 KB gzipped the remaining wins are small, and several popular "optimisations" make things worse',
              'Kiểm rằng nén đang bật và mẫu <code>content</code> đang đúng, rồi DỪNG — ở mức ~105 KB sau gzip thì phần thắng còn lại nhỏ, và vài cú "tối ưu" phổ biến còn làm mọi thứ TỆ ĐI',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Ordered by bytes saved per unit of effort, the first two steps dominate and the rest round to nothing. Step one is confirming compression is actually enabled on the server — measured here, that is the difference between 626 KB and 105 KB, larger than every other optimisation combined and available for free. Step two is checking the <code>content</code> glob, which protects you from the opposite failure of question 40: a glob that is too <em>wide</em>, sweeping in <code>node_modules</code> or a build directory, generates utilities nobody uses and is slow as well as large. After that, stop. Trimming the palette (option 2) saves little because unused theme keys generate no CSS at all — there is nothing there to remove. Per-route splitting (option 1) fragments a file that caches perfectly across the whole site and usually increases total bytes transferred. And option 3 is actively harmful twice over: it churns a large diff for a small gain, and it replaces exact design values with approximations, which is a visual regression paid for in bytes you would not have noticed. Knowing where to stop is the actual skill here.',
            'Xếp theo số byte tiết kiệm được trên mỗi đơn vị công sức, hai bước đầu áp đảo còn phần còn lại làm tròn thành số không. Bước một là xác nhận rằng nén THẬT SỰ đang bật trên máy chủ — đo ở đây, đó là khác biệt giữa 626 KB và 105 KB, lớn hơn mọi tối ưu khác cộng lại và có được MIỄN PHÍ. Bước hai là kiểm mẫu <code>content</code>, thứ bảo vệ bạn khỏi cú hỏng ngược với câu 40: một mẫu quá RỘNG, quét trúng <code>node_modules</code> hay một thư mục build, sẽ phát sinh những tiện ích không ai dùng và vừa chậm vừa nặng. Sau đó thì DỪNG. Cắt bảng màu (phương án 2) tiết kiệm được rất ít vì khoá theme không dùng thì không sinh ra CSS nào cả — chẳng có gì ở đó để mà gỡ. Tách theo tuyến (phương án 1) làm vỡ vụn một file vốn được cache hoàn hảo trên toàn trang và thường làm TĂNG tổng số byte truyền đi. Còn phương án 3 gây hại tới hai lần: nó tạo một cái diff to đùng để đổi lấy một cái lợi bé tí, và nó thay những giá trị thiết kế chính xác bằng các con số xấp xỉ, tức một cú thụt lùi về thị giác trả bằng những byte mà bạn vốn chẳng nhận ra. Biết chỗ DỪNG mới là kỹ năng thật ở đây.',
          ),
        }),

        /* ── Chương 9 — Khả năng tiếp cận (4 câu) ────────────────────────── */

        // q44 · đáp án 1
        mcq({
          prompt: B(
            'What does <code>outline-none</code> actually emit, and what follows for an <code>&lt;input&gt;</code> that carries it and nothing else?' +
            code('.outline-none {\n  ???\n}'),
            '<code>outline-none</code> thật sự phát sinh ra cái gì, và từ đó suy ra gì cho một <code>&lt;input&gt;</code> chỉ mang nó và không gì khác?',
          ),
          options: [
            B(
              '<code>outline: none</code> — and that is fine, because browsers substitute their own focus ring when an outline is removed from a form control',
              '<code>outline: none</code> — và như thế là ổn, vì trình duyệt tự thay bằng vòng focus của riêng nó khi outline bị gỡ khỏi một điều khiển biểu mẫu',
            ),
            B(
              '<code>outline: 2px solid transparent; outline-offset: 2px</code> — the ring stays for Windows high-contrast mode, but visually there is no focus indicator until you add one back',
              '<code>outline: 2px solid transparent; outline-offset: 2px</code> — vòng viền được giữ lại cho chế độ tương phản cao của Windows, nhưng về mặt thị giác thì KHÔNG còn chỉ báo focus nào cho tới khi bạn thêm lại',
            ),
            B(
              '<code>outline: none</code> plus a generated <code>:focus-visible</code> ring, so the accessible behaviour is restored automatically',
              '<code>outline: none</code> cộng một vòng <code>:focus-visible</code> được phát sinh kèm, nên hành vi tiếp cận được khôi phục tự động',
            ),
            B(
              'Nothing at all — <code>outline-none</code> is a no-op kept for compatibility, and removing an outline requires <code>outline-0</code>',
              'Không gì cả — <code>outline-none</code> là một lệnh rỗng giữ lại cho tương thích, và muốn gỡ outline thì phải dùng <code>outline-0</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: <code>.outline-none { outline: 2px solid transparent; outline-offset: 2px; }</code>. The choice is deliberate and clever — a fully transparent outline is invisible in normal rendering but is still <em>present</em>, so Windows high-contrast mode, which repaints outlines with its own colours, still has something to paint. That protects one group of users automatically. It protects nobody else. For everyone using a mouse-free workflow in a normal browser, the focus indicator is gone the moment you write this class, and the element is now indistinguishable from its unfocused state. The rule that follows is mechanical enough to review by grep: every <code>outline-none</code> needs a <code>focus:</code> or <code>focus-visible:</code> replacement on the same element. An audit of this repository finds 562 occurrences of <code>outline-none</code>, and the ones that matter are the minority with no replacement beside them — heavily concentrated on <code>&lt;input&gt;</code> and <code>&lt;textarea&gt;</code>, which is exactly where a keyboard user needs to know where they are. Option 3 describes something Tailwind does not generate, and believing it is how the missing rings get written.',
            'Đo thật: <code>.outline-none { outline: 2px solid transparent; outline-offset: 2px; }</code>. Lựa chọn này là cố ý và thông minh — một đường viền trong suốt hoàn toàn thì vô hình khi render bình thường nhưng vẫn TỒN TẠI, nên chế độ tương phản cao của Windows, thứ vẽ lại outline bằng màu của riêng nó, vẫn có cái để vẽ. Điều đó bảo vệ tự động một nhóm người dùng. Nó không bảo vệ ai khác. Với mọi người dùng bàn phím trong một trình duyệt bình thường, chỉ báo focus biến mất ngay khoảnh khắc bạn viết cái lớp này, và phần tử giờ không phân biệt được với trạng thái chưa focus của chính nó. Luật rút ra máy móc đủ để review bằng grep: mọi <code>outline-none</code> đều cần một cú thay thế <code>focus:</code> hoặc <code>focus-visible:</code> trên cùng phần tử đó. Một cuộc soát kho này tìm ra 562 lượt <code>outline-none</code>, và những lượt đáng lo là thiểu số KHÔNG có cú thay thế nào bên cạnh — tập trung dày đặc ở <code>&lt;input&gt;</code> và <code>&lt;textarea&gt;</code>, đúng chỗ mà người dùng bàn phím cần biết mình đang ở đâu. Phương án 3 mô tả một thứ Tailwind không phát sinh, và tin vào nó chính là cách những vòng focus bị thiếu được viết ra.',
          ),
        }),

        // q45 · đáp án 3
        mcq({
          prompt: B(
            'A sweep of 118,511 static class names finds 326 that resolve to no rule at all. What is the shared property of that whole category, and why does it matter more than the count?',
            'Một cuộc quét 118.511 tên lớp tĩnh tìm ra 326 cái không phân giải ra quy tắc nào. Tính chất chung của cả chủng loại ấy là gì, và vì sao nó quan trọng hơn con số?',
          ),
          options: [
            B(
              'They are all typos, so a spell-check against the generated class list at build time would eliminate the category entirely',
              'Tất cả đều là lỗi gõ nhầm, nên một phép kiểm chính tả đối chiếu danh sách lớp được sinh ra lúc dựng sẽ xoá sổ hoàn toàn chủng loại này',
            ),
            B(
              'They are all leftovers from deleted features, so they are harmless and only cost a few bytes of HTML',
              'Tất cả đều là tàn dư của các tính năng đã xoá, nên chúng vô hại và chỉ tốn vài byte HTML',
            ),
            B(
              'They all come from dynamic composition, so the fix is a single lint rule banning interpolation inside <code>className</code>',
              'Tất cả đến từ việc soạn lớp động, nên cú vá là một luật lint duy nhất cấm nội suy bên trong <code>className</code>',
            ),
            B(
              'They fail <em>silently</em> — no build error, no console warning, no struck-through declaration in DevTools, because there is no declaration — so their number is only knowable by deliberately sweeping for it',
              'Chúng hỏng trong IM LẶNG — không lỗi lúc dựng, không cảnh báo console, không khai báo nào bị gạch trong DevTools, vì làm gì có khai báo — nên số lượng của chúng chỉ biết được bằng cách CHỦ ĐỘNG đi quét',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The number is interesting; the mechanism is what you carry away. A class that generates no rule leaves no trace anywhere a developer normally looks. The build is green. The browser reports nothing, because from its point of view the element simply has an unknown class name, which is legal and common. DevTools shows no struck-through line, because a struck-through line means a declaration lost a conflict, and here no declaration exists. The element renders at its default and looks like a design decision. That is why the category has to be swept for on purpose, by generating the class list from the built CSS and diffing it against the class names found in source. The 326 also break down into causes that need different fixes, which is why option 3 is too narrow: some are opacity modifiers on <code>var()</code> colours (question 30), some are tokens that were renamed or never existed, and some are genuine typos. Option 1 describes a check worth building but assumes one cause. Option 2 is the comfortable reading, and it is wrong in the cases that matter — a dead <code>bg-elevated</code> is not a leftover, it is an element rendering the wrong colour today.',
            'Con số thì thú vị; CƠ CHẾ mới là thứ bạn mang về. Một lớp không sinh ra quy tắc nào thì không để lại dấu vết ở bất cứ chỗ nào một lập trình viên thường nhìn. Bản dựng xanh. Trình duyệt không báo gì, vì theo góc nhìn của nó thì phần tử chỉ đơn giản mang một tên lớp lạ, điều vốn hợp lệ và phổ biến. DevTools không hiện dòng nào bị gạch, vì một dòng bị gạch nghĩa là một khai báo đã THUA một xung đột, còn ở đây làm gì có khai báo nào. Phần tử hiện ra ở trạng thái mặc định và trông như một quyết định thiết kế. Đó là lý do chủng loại này phải được quét một cách CHỦ ĐỘNG, bằng cách sinh danh sách lớp từ CSS đã dựng rồi so nó với các tên lớp tìm thấy trong mã nguồn. Con số 326 còn tách ra thành các nguyên nhân cần những cú vá khác nhau, và đó là lý do phương án 3 quá hẹp: một số là bổ từ độ mờ trên màu <code>var()</code> (câu 30), một số là token bị đổi tên hoặc chưa từng tồn tại, và một số là gõ nhầm thật. Phương án 1 mô tả một phép kiểm đáng dựng nhưng giả định chỉ có một nguyên nhân. Phương án 2 là cách đọc dễ chịu, và nó SAI ở đúng những ca đáng lo — một <code>bg-elevated</code> chết không phải tàn dư, nó là một phần tử đang hiện ra sai màu ngay hôm nay.',
          ),
        }),

        // q46 · đáp án 2
        mcq({
          prompt: B(
            'A design token holds one hex value and is reused unchanged in both the light and the dark theme. Why is that the single most likely place a contrast audit will fail?',
            'Một token thiết kế giữ đúng một mã hex và được dùng lại y nguyên ở cả theme sáng lẫn theme tối. Vì sao đó là chỗ có xác suất trượt cao nhất trong một cuộc soát tương phản?',
          ),
          options: [
            B(
              'Because a hex value cannot be checked automatically, unlike a <code>var()</code> whose contrast the browser recomputes on every theme change',
              'Vì một giá trị hex không kiểm tự động được, khác với một <code>var()</code> mà trình duyệt tính lại tương phản mỗi lần đổi theme',
            ),
            B(
              'Because reused tokens are always mid-grey, and mid-grey is the one hue that cannot reach 4.5:1 against any background',
              'Vì token dùng lại luôn là xám trung tính, và xám trung tính là sắc độ duy nhất không thể đạt 4,5:1 với bất kỳ nền nào',
            ),
            B(
              'Because contrast is a ratio between two colours: a value tuned to pass on one background is measured against the opposite background in the other theme, and one of the two will be close to the limit or below it',
              'Vì tương phản là một TỈ SỐ giữa HAI màu: một giá trị chỉnh cho đạt trên một nền sẽ bị đo với nền NGƯỢC LẠI ở theme kia, và một trong hai lần đo sẽ sát ngưỡng hoặc dưới ngưỡng',
            ),
            B(
              'Because WCAG applies a stricter threshold in dark mode, so a value that passes at 4.5:1 on white needs 7:1 on a dark surface',
              'Vì WCAG áp một ngưỡng chặt hơn ở theme tối, nên một giá trị đạt 4,5:1 trên nền trắng thì cần tới 7:1 trên một bề mặt tối',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Contrast is never a property of a colour; it is a property of a <em>pair</em>. A token that changes with the theme gets two independent chances to be tuned — one value against the light surface, another against the dark one — and each can be checked on its own. A token that does not change is asked to satisfy two opposite constraints with one number, and the arithmetic rarely allows it: the same mid-tone that reads 4.8:1 on white might read 2.9:1 on #18191a. That is why a "muted" or "secondary" text token, the one people are most tempted to freeze because it is meant to look the same everywhere, is the reliable failure in an audit — and it is usually the token with the highest usage count, so one number decides thousands of elements. The method that finds it is mechanical: enumerate every text token against every surface token it can appear on, compute the ratio for both themes, and list the pairs under 4.5. Option 4 is a plausible-sounding invention — WCAG 2.x thresholds do not depend on which colour is the lighter one. Option 1 has the automation backwards: a hex is the <em>easier</em> value to check, since it needs no runtime resolution.',
            'Tương phản không bao giờ là tính chất của MỘT màu; nó là tính chất của một CẶP. Một token đổi theo theme được hai cơ hội độc lập để chỉnh — một giá trị đối với bề mặt sáng, một giá trị khác đối với bề mặt tối — và mỗi cái kiểm riêng được. Một token KHÔNG đổi thì bị bắt thoả mãn hai ràng buộc ngược nhau bằng đúng một con số, và số học hiếm khi cho phép: đúng cái tông trung gian đọc ra 4,8:1 trên nền trắng có thể đọc ra 2,9:1 trên nền #18191a. Đó là lý do một token chữ "mờ" hay "phụ" — cái mà người ta hay bị cám dỗ đóng băng nhất vì nó vốn được thiết kế để trông giống nhau ở mọi nơi — lại là chỗ trượt đáng tin cậy trong một cuộc soát, và nó thường là token có số lượt dùng cao nhất, nên một con số quyết định hàng ngàn phần tử. Phương pháp tìm ra nó thì máy móc: liệt kê mọi token chữ đối với mọi token bề mặt mà nó có thể xuất hiện lên, tính tỉ số cho cả hai theme, rồi liệt ra những cặp dưới 4,5. Phương án 4 là một sự bịa đặt nghe hợp lý — ngưỡng của WCAG 2.x không phụ thuộc màu nào sáng hơn. Phương án 1 nói ngược về khả năng tự động hoá: một mã hex là giá trị DỄ kiểm hơn, vì nó không cần phân giải lúc chạy.',
          ),
        }),

        // q47 · đáp án 0
        mcq({
          prompt: B(
            'What does <code>motion-reduce:transition-none</code> compile to, and what is the practical limit of relying on that variant alone?',
            '<code>motion-reduce:transition-none</code> biên dịch ra cái gì, và giới hạn thực tế của việc chỉ dựa vào biến thể đó là gì?',
          ),
          options: [
            B(
              'A rule inside <code>@media (prefers-reduced-motion: reduce)</code> — it only guards the elements you remember to mark, so animation defined in your own CSS needs its own media block',
              'Một quy tắc nằm trong <code>@media (prefers-reduced-motion: reduce)</code> — nó chỉ chắn được những phần tử bạn NHỚ đánh dấu, nên hoạt ảnh định nghĩa trong CSS của chính bạn cần một khối media riêng',
            ),
            B(
              'A rule with the selector <code>.motion-reduce\\:transition-none</code> and no wrapper, which JavaScript is expected to toggle by adding a class',
              'Một quy tắc với selector <code>.motion-reduce\\:transition-none</code> không có lớp bọc nào, và JavaScript được kỳ vọng bật tắt nó bằng cách thêm một lớp',
            ),
            B(
              'A global block that disables every transition and animation in the document whenever the preference is set',
              'Một khối toàn cục vô hiệu hoá mọi transition và animation trong tài liệu bất cứ khi nào tuỳ chọn đó được bật',
            ),
            B(
              'Nothing on its own — the variant requires the <code>@tailwindcss/motion</code> plugin, without which the class is silently dropped',
              'Không gì cả nếu đứng một mình — biến thể này đòi plugin <code>@tailwindcss/motion</code>, thiếu nó thì cái lớp bị vứt trong im lặng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: the utility is emitted inside ' + c('@media (prefers-reduced-motion: reduce) { .motion-reduce\\:transition-none { transition-property: none; } }') + '. It is a normal media-query variant, in core, no plugin required. The limit is the one that makes motion audits go wrong: the variant is <b>opt-in per element</b>. It guards the element that carries it and nothing else, so any animation defined outside your utility classes — a <code>@keyframes</code> in your own CSS, an ambient background effect, a library\'s transitions — is untouched by it and needs its own <code>@media (prefers-reduced-motion: reduce)</code> block. This is also why an audit that only greps the <code>.tsx</code> files reports "no guard" for animations that are, in fact, perfectly guarded a few hundred lines deep in <code>globals.css</code>. Checking one of the two places and concluding about both is how a clean feature gets reported as broken. Option 3 describes the belt-and-braces global block many projects add on purpose — a good idea, but not what this class does. Option 4 is worth ruling out: <code>motion-reduce:</code> and <code>motion-safe:</code> are both core variants.',
            'Đo thật: tiện ích được phát sinh bên trong ' + c('@media (prefers-reduced-motion: reduce) { .motion-reduce\\:transition-none { transition-property: none; } }') + '. Nó là một biến thể truy vấn phương tiện bình thường, nằm trong lõi, không cần plugin nào. Giới hạn của nó chính là thứ làm các cuộc soát chuyển động đi sai: biến thể này là <b>tự nguyện theo từng phần tử</b>. Nó chắn được đúng cái phần tử mang nó và không gì khác, nên mọi hoạt ảnh định nghĩa ngoài các lớp tiện ích của bạn — một <code>@keyframes</code> trong CSS của chính bạn, một hiệu ứng nền môi trường, các transition của một thư viện — đều không bị nó đụng tới và cần một khối <code>@media (prefers-reduced-motion: reduce)</code> của riêng chúng. Đây cũng là lý do một cuộc soát chỉ grep các file <code>.tsx</code> lại báo "KHÔNG CÓ CHỐT" cho những hoạt ảnh mà thực ra đang được chắn hoàn hảo ở một chỗ sâu vài trăm dòng trong <code>globals.css</code>. Kiểm MỘT trong HAI chỗ rồi kết luận cho cả hai chính là cách một tính năng lành lặn bị báo là hỏng. Phương án 3 mô tả cái khối toàn cục "chắc ăn kép" mà nhiều dự án chủ động thêm vào — một ý hay, nhưng không phải việc mà cái lớp này làm. Phương án 4 đáng loại: <code>motion-reduce:</code> và <code>motion-safe:</code> đều là biến thể lõi.',
          ),
        }),

        /* ── Chương 10 — Sách công thức chẩn đoán (3 câu) ─────────────────── */

        // q48 · đáp án 1
        mcq({
          prompt: B(
            'A class "does nothing". What is the first question of the decision tree, and what answers it fastest?',
            'Một cái lớp "chẳng làm gì". Câu hỏi ĐẦU TIÊN của cây quyết định là gì, và cái gì trả lời nó nhanh nhất?',
          ),
          options: [
            B(
              '"Is something else winning?" — open DevTools and look for a struck-through declaration on the element',
              '"Có thứ gì khác đang thắng không?" — mở DevTools và tìm một khai báo bị gạch ngang trên phần tử',
            ),
            B(
              '"Was the rule generated at all?" — <code>grep</code> the class name in the built CSS file; zero matches ends the investigation before DevTools is opened',
              '"Quy tắc có được PHÁT SINH không?" — <code>grep</code> tên lớp trong file CSS đã dựng; không kết quả nào là kết thúc cuộc điều tra trước cả khi mở DevTools',
            ),
            B(
              '"Is the specificity high enough?" — count the selector\'s classes and compare it with the competing rule',
              '"Độ đặc hiệu đã đủ cao chưa?" — đếm số lớp trong selector rồi so với quy tắc đang cạnh tranh',
            ),
            B(
              '"Is the element in the DOM?" — inspect the rendered markup and confirm the class attribute contains the name',
              '"Phần tử có nằm trong DOM không?" — soi mã đánh dấu đã render và xác nhận thuộc tính class có chứa cái tên đó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The order matters because the cheapest question also eliminates the largest category, and because every other tool in the list is <em>blind</em> to it. DevTools shows you rules that exist and lost; it has no way to show you a rule that was never emitted, so an investigation that starts there will spend its time on the cascade for a bug that has nothing to do with the cascade. One <code>grep</code> against the built file answers it in a second and splits the problem cleanly. Zero matches means the generator never saw the name, and the causes are a short list: a class composed at run time, a <code>content</code> glob that does not reach the file, an opacity modifier on a <code>var()</code> colour, a v4-style <code>mt-4!</code> in a v3 build, or a plain typo — all of which are fixed at the source, not in the cascade. One or more matches means the rule exists, the problem <em>is</em> the cascade, and only then are questions 2 through 4 worth asking: who is winning, by specificity or by position, and what is the cheapest way to change that. Options 1, 3 and 4 are all real steps of the tree, just not the first one.',
            'Thứ tự quan trọng vì câu hỏi RẺ nhất cũng đồng thời loại được chủng loại LỚN nhất, và vì mọi công cụ khác trong danh sách đều MÙ với nó. DevTools cho bạn xem những quy tắc TỒN TẠI và đã thua; nó không có cách nào cho bạn xem một quy tắc chưa từng được phát sinh, nên một cuộc điều tra bắt đầu từ đó sẽ tiêu thời gian vào cascade cho một con bọ chẳng liên quan gì tới cascade. Một lệnh <code>grep</code> trên file đã dựng trả lời trong một giây và chẻ bài toán ra rất gọn. Không kết quả nào nghĩa là trình sinh chưa bao giờ thấy cái tên đó, và các nguyên nhân là một danh sách ngắn: một lớp soạn lúc chạy, một mẫu <code>content</code> không với tới file, một bổ từ độ mờ trên màu <code>var()</code>, một <code>mt-4!</code> kiểu v4 trong một bản dựng v3, hoặc một lỗi gõ nhầm thuần tuý — tất cả đều được sửa ở NGUỒN chứ không ở cascade. Có từ một kết quả trở lên nghĩa là quy tắc tồn tại, vấn đề ĐÚNG LÀ cascade, và chỉ khi ấy câu hỏi 2 tới 4 mới đáng hỏi: ai đang thắng, thắng bằng độ đặc hiệu hay bằng vị trí, và cách rẻ nhất để đổi điều đó là gì. Phương án 1, 3 và 4 đều là những bậc THẬT của cái cây, chỉ là không phải bậc đầu tiên.',
          ),
        }),

        // q49 · đáp án 2
        mcq({
          prompt: B(
            'The rule exists in the built CSS and the style still does not apply. DevTools shows the declaration struck through. What can DevTools tell you, and what must you read the output file for?',
            'Quy tắc CÓ trong CSS đã dựng và kiểu dáng vẫn không áp. DevTools hiện khai báo bị gạch ngang. DevTools nói được cho bạn điều gì, và bạn phải đọc file đầu ra để biết điều gì?',
          ),
          options: [
            B(
              'DevTools tells you everything: the winning rule is listed above the struck-through one, so the output file adds nothing',
              'DevTools nói cho bạn tất cả: quy tắc thắng được liệt kê ngay trên cái bị gạch, nên file đầu ra chẳng thêm được gì',
            ),
            B(
              'DevTools tells you nothing reliable here, because it lists rules in specificity order and cannot represent a tie broken by source order',
              'DevTools chẳng nói được gì đáng tin ở đây, vì nó liệt kê quy tắc theo thứ tự độ đặc hiệu và không biểu diễn được một thế hoà phân định bằng thứ tự nguồn',
            ),
            B(
              'DevTools names the winner, which is usually enough; the output file is what tells you <em>why</em> it won when both selectors are 0-1-0 — that is a position question, and position is only visible as a line number',
              'DevTools gọi tên KẺ THẮNG, thường thế là đủ; file đầu ra mới nói cho bạn VÌ SAO nó thắng khi cả hai selector đều 0-1-0 — đó là câu hỏi về VỊ TRÍ, và vị trí chỉ nhìn thấy được dưới dạng số dòng',
            ),
            B(
              'DevTools shows the computed value only, so identifying the winning rule always requires diffing the built file against the previous build',
              'DevTools chỉ hiện giá trị đã tính, nên muốn xác định quy tắc thắng thì luôn phải diff file đã dựng với bản dựng trước',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Both tools are needed and they answer different questions. DevTools is excellent at the <em>what</em>: it strikes through the losing declaration and shows the winning rule with its selector and source file, which resolves most conflicts on the spot. What it does not make obvious is the <em>why</em> in the specific case this course keeps producing — two utilities, both a single class, both 0-1-0, no <code>!important</code> anywhere. Specificity is tied, so the winner is decided purely by which one appears later in the stylesheet, and "later" is a line number that no panel displays. That is when you open the built file and grep for both class names: <code>.mt-32</code> at 577, <code>.mt-8</code> at 589, question answered, and the answer also tells you that reordering the class attribute will not help. Option 1 is right about ordinary conflicts and wrong about exactly the case that sends people in circles. Option 2 overstates it in the other direction — DevTools does order the panel correctly, it just does not explain a tie. Option 4 describes a much more laborious method for something one grep answers.',
            'Cần cả hai công cụ và chúng trả lời hai câu hỏi khác nhau. DevTools rất giỏi ở phần CÁI GÌ: nó gạch ngang khai báo thua và hiện quy tắc thắng kèm selector với file nguồn, thứ giải quyết được hầu hết xung đột ngay tại chỗ. Cái nó KHÔNG làm rõ là phần VÌ SAO trong đúng cái ca mà khoá này liên tục tạo ra — hai tiện ích, cả hai đều một lớp đơn, cả hai đều 0-1-0, không có <code>!important</code> ở đâu. Độ đặc hiệu hoà, nên kẻ thắng được quyết thuần tuý bởi cái nào xuất hiện SAU HƠN trong bảng kiểu, và "sau hơn" là một SỐ DÒNG mà không bảng điều khiển nào hiển thị. Đó là lúc bạn mở file đã dựng và grep cả hai tên lớp: <code>.mt-32</code> ở 577, <code>.mt-8</code> ở 589, câu hỏi được trả lời, và câu trả lời còn nói luôn cho bạn rằng sắp xếp lại thuộc tính class sẽ chẳng giúp gì. Phương án 1 đúng với các xung đột thông thường và sai đúng ở cái ca làm người ta chạy vòng quanh. Phương án 2 nói quá theo chiều ngược lại — DevTools CÓ sắp bảng đúng thứ tự, nó chỉ không giải thích một thế hoà. Phương án 4 mô tả một phương pháp nhọc nhằn hơn nhiều cho thứ mà một lệnh grep trả lời xong.',
          ),
        }),

        // q50 · đáp án 0
        mcq({
          prompt: B(
            'Three class-composition patterns an AI assistant commonly produces. Which diagnosis is right for all three?' +
            code('A: className={`text-${tone}-500`}\n' +
                 'B: className={"px-4 py-2 " + className}\n' +
                 'C: className="!mt-4 mt-8"'),
            'Ba khuôn soạn lớp mà một trợ lý AI hay sinh ra. Chẩn đoán nào ĐÚNG cho cả ba?' +
            code('A: className={`text-${tone}-500`}\n' +
                 'B: className={"px-4 py-2 " + className}\n' +
                 'C: className="!mt-4 mt-8"'),
          ),
          options: [
            B(
              'A never generates a rule; B generates both and lets emit order pick the winner instead of the caller; C works but escalates a conflict that <code>cn()</code> would have resolved without <code>!important</code>',
              'A không bao giờ sinh ra quy tắc; B sinh ra cả hai rồi để THỨ TỰ PHÁT SINH chọn kẻ thắng thay vì người gọi; C thì chạy nhưng leo thang một xung đột mà <code>cn()</code> đã giải quyết được không cần <code>!important</code>',
            ),
            B(
              'All three fail at build time with an unknown-class error, which is why the generator is safe against AI-written markup',
              'Cả ba đều hỏng lúc dựng với lỗi lớp không xác định, và đó là lý do trình sinh an toàn trước mã đánh dấu do AI viết',
            ),
            B(
              'A works if <code>tone</code> is a literal union type; B is the recommended form; C is a build error because <code>!</code> may not be combined with a conflicting utility',
              'A chạy nếu <code>tone</code> có kiểu union chữ; B là dạng được khuyến nghị; C là một lỗi lúc dựng vì <code>!</code> không được kết hợp với một tiện ích đụng độ',
            ),
            B(
              'All three are equivalent once <code>tailwind-merge</code> is applied, so wrapping any of them in <code>cn()</code> is a complete fix',
              'Cả ba tương đương nhau một khi áp <code>tailwind-merge</code>, nên bọc bất cứ cái nào trong <code>cn()</code> đã là một cú vá trọn vẹn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Three different failures wearing the same shape, which is why one lint rule does not cover them. <b>A</b> is the generator failure: the string <code>text-red-500</code> never appears in any file, so no rule exists and the element renders unstyled — measured in question 2, and no type annotation changes it, because the type system runs in a different process from the scanner. The fix is a lookup table of complete class names, or a safelist. <b>B</b> is the contract failure of question 21: both classes reach the browser, and which one wins depends on Tailwind\'s emit order for that particular pair, so the same code honours the caller\'s override sometimes and silently ignores it other times. The fix is <code>cn(base, className)</code>. <b>C</b> is not broken — <code>!mt-4</code> does emit <code>margin-top: 1rem !important</code> and does beat <code>mt-8</code> — but it has spent the escalation ladder\'s last rung on a conflict that <code>twMerge</code> resolves for free, and it leaves the next person no move except another <code>!important</code>. Worth knowing precisely: <code>twMerge("mt-8 !mt-4")</code> keeps <em>both</em>, because the important modifier is a separate group, so wrapping C in <code>cn()</code> does not clean it up — which is what makes option 4 wrong.',
            'Ba cú hỏng KHÁC NHAU khoác cùng một hình dạng, và đó là lý do một luật lint không phủ nổi cả ba. <b>A</b> là cú hỏng ở TRÌNH SINH: chuỗi <code>text-red-500</code> không bao giờ xuất hiện trong file nào, nên không quy tắc nào tồn tại và phần tử hiện ra không có kiểu dáng — đo ở câu 2, và không chú thích kiểu nào đổi được điều đó, vì hệ thống kiểu chạy trong một tiến trình khác với bộ quét. Cú vá là một bảng tra cứu chứa các tên lớp TRỌN VẸN, hoặc một safelist. <b>B</b> là cú hỏng ở HỢP ĐỒNG của câu 21: cả hai lớp cùng tới trình duyệt, và cái nào thắng phụ thuộc thứ tự phát sinh của Tailwind cho đúng cặp đó, nên cùng một đoạn mã lúc thì tôn trọng cú ghi đè của người gọi, lúc thì âm thầm bỏ qua. Cú vá là <code>cn(nền, className)</code>. <b>C</b> thì KHÔNG hỏng — <code>!mt-4</code> đúng là phát ra <code>margin-top: 1rem !important</code> và đúng là thắng <code>mt-8</code> — nhưng nó đã tiêu mất bậc cuối của cái thang leo thang cho một xung đột mà <code>twMerge</code> giải quyết miễn phí, và nó không để lại cho người sau nước đi nào ngoài một <code>!important</code> nữa. Đáng biết chính xác: <code>twMerge("mt-8 !mt-4")</code> giữ CẢ HAI, vì bổ từ quan trọng là một nhóm riêng, nên bọc C vào <code>cn()</code> KHÔNG dọn dẹp được nó — và đó là chỗ làm phương án 4 sai.',
          ),
        }),
      ],
    },
  ],
};
