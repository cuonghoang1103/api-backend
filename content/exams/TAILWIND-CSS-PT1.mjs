/**
 * Tailwind CSS — Progress Test 1 (Mục 0 → Chương 3).
 *
 * Đề tự soạn, bám sát `content/courses/tailwind-css/s00-intro.mjs`,
 * `s01-thang.mjs`, `s02-bien-the.mjs`, `s03-xung-dot.mjs`.
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ PHIÊN BẢN: **Tailwind CSS 3.4.14 — tức là v3, KHÔNG phải v4.**
 * ────────────────────────────────────────────────────────────────────────────
 * Kiểm bằng máy, không suy đoán: `frontend/package.json:108` ghi
 * `"tailwindcss": "^3.4.14"`, và hộp cát đo đề này cài đúng
 * `npm i tailwindcss@3.4.14` rồi in ra `3.4.14`. Vì thế mọi đáp án dưới đây là
 * hành vi của **v3**: `tailwind.config.js` + ba chỉ thị `@tailwind`, dấu quan
 * trọng là TIỀN TỐ `!p-8`, và KHÔNG có `@theme` / `@import "tailwindcss"` của
 * v4. Không câu nào đòi học viên biết v4 làm gì.
 *
 * ⚠️ MỌI SỐ ĐO TRONG ĐỀ ĐỀU LẤY TỪ MÁY. Hộp cát nằm NGOÀI kho api-backend
 * (`scratchpad/tailwind-pt/lab`), không gói nào được thêm vào `package.json`
 * của kho. Cách dựng: `./node_modules/.bin/tailwindcss -c tw.config.js
 * -i in.css -o out.css` rồi ĐỌC `out.css`. Những thứ đã chạy thật và trở thành
 * đáp án:
 *   • thứ tự phát sinh khi trộn biến thể với nhóm: BIẾN THỂ Ở NGOÀI —
 *     `mt-8 · p-2 · hover:mt-4 · hover:p-3 · focus:m-1 · @media 640 · @media 768`;
 *   • thứ tự biến thể lớp giả: `(trơn) · first · last · hover · focus ·
 *     focus-visible · active · disabled · group-hover`;
 *   • thứ tự truy vấn media: `motion-reduce · sm · md · lg · xl · 2xl ·
 *     prefers-color-scheme:dark · print`;
 *   • thứ tự nhóm khoảng cách: `m · mx · my · mb · me · ml · mr · ms · mt ·
 *     p · px · py · pb · pe · pl · pr · ps · pt` (cạnh sắp theo abc);
 *   • trong một nhóm: sắp theo CHUỖI — `.mt-0.5 .mt-1 .mt-1.5 .mt-10 .mt-12
 *     .mt-16 .mt-2 .mt-20 .mt-24 .mt-3 .mt-32 .mt-4 .mt-8 .mt-px`, nên thêm
 *     `mt-px` vào là NÓ thắng chứ không còn `mt-8`;
 *   • `.text-[11px] .text-[13px] .text-base .text-sm` — `[` sắp TRƯỚC chữ cái,
 *     nên `text-sm` phát sinh sau và thắng `text-[11px]`;
 *   • `class="px-4 p-8"` phát sinh `.p-8` rồi `.px-4`; `twMerge("px-4 p-8")`
 *     trả `"p-8"` — HAI KẾT QUẢ KHÁC NHAU trên cùng một cặp lớp;
 *   • biến thể tuỳ ý `[&>svg]:h-4` → `.\[\&\>svg\]\:h-4>svg` (KHÔNG có dấu
 *     cách quanh `>`) và `[&_p]:mt-2` → `.\[\&_p\]\:mt-2 p`, cả hai phát sinh
 *     SAU MỌI khối `@media`;
 *   • `md:max-lg:p-5` phát sinh thành `@media (min-width:768px)` LỒNG một
 *     `@media not all and (min-width:1024px)` bên trong;
 *   • ba giá trị `darkMode`: `media` → `@media (prefers-color-scheme: dark)`,
 *     `class` → `:is(.dark *)`, `['selector','.theme-dark']` →
 *     `:where(.theme-dark, .theme-dark *)`;
 *   • `!p-8` phát sinh TRƯỚC `.p-2` trong file mà vẫn thắng — vì `!important`
 *     đổi cội cascade chứ không đổi vị trí;
 *   • `prefix: 'tw-'`: `tw-p-4` ✅ · `hover:tw-p-8` ✅ · `p-4` ❌ ·
 *     `tw-hover:p-8` ❌ (0 quy tắc);
 *   • bộ quét đọc VĂN BẢN: một chú thích dòng `// keep: mt-9`, một chú thích
 *     khối chứa `rounded-3xl`, `const dead = 'text-3xl'` và
 *     `{ ok: 'bg-green-100' }` ĐỀU phát sinh;
 *     `` `text-${c}-500` `` và `'px-' + n` thì KHÔNG;
 *   • `resolveConfig`: spacing 35 khoá (có 7, 9, 11 — KHÔNG có 13), width 70
 *     khoá, height 59, screens 640/768/1024/1280/1536, `rounded` = 0.25rem,
 *     `max-w-prose` = 65ch, 22 họ màu × 11 bậc + 5 từ khoá phẳng;
 *   • tailwind-merge 2.5.4: `p-8 px-4` → GIỮ CẢ HAI, `px-4 p-8` → `p-8`,
 *     `mt-32 mt-px` → `mt-px`, `!p-8 p-2` → GIỮ CẢ HAI, `hover:p-2 focus:p-3`
 *     → GIỮ CẢ HAI, `text-sm text-[11px]` → `text-[11px]`.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ HAI CHỖ GIÁO TRÌNH LỆCH VỚI MÁY (đo 10/09/2026) — ĐỀ THEO MÁY
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. **Bài 1.3 nói `text-blue-500` trên nền trắng là "fine". Máy nói KHÔNG.**
 *    Cái bẫy về sắc độ trong bài viết: "text-yellow-500 on white is unreadable
 *    while text-blue-500 on white is fine, and both are step 500". Tính lại tỉ
 *    số tương phản theo đúng công thức WCAG trên chính bảng màu 3.4.14:
 *        yellow-500 #eab308 → 1,92   (trượt cả 3:1)
 *        blue-500   #3b82f6 → 3,68   (TRƯỢT 4,5:1 của chữ thường,
 *                                     chỉ đạt 3:1 của chữ lớn)
 *        red-500    #ef4444 → 3,76 · sky-500 2,77 · green-500 2,28 ·
 *        emerald-500 2,54 · amber-500 2,15
 *    Ý CHÍNH của bài (đừng khái quát một bậc số qua các họ màu) vẫn đúng và
 *    còn mạnh hơn — nhưng KHÔNG có họ nào trong bảy họ đo được ở bậc 500 đạt
 *    4,5:1 trên nền trắng. Câu 11 ra đề theo MÁY và nói thẳng con số 3,68.
 *
 * 2. **Bài 1.1 in thang spacing dạng RÚT GỌN, dễ đọc nhầm là thang có lỗ.**
 *    Khối `OUT` của bài nhảy 6 → 8 → 10 → 12 → 16 → 20 → 24 → 32 → … → 96, nên
 *    người đọc kết luận `p-7`, `p-9`, `p-11` không tồn tại. Đọc thẳng
 *    `resolveConfig` trên 3.4.14 thì 35 khoá là:
 *        0 1 2 3 4 5 6 7 8 9 10 11 12 14 16 20 24 28 32 36 40 44 48 52 56 60
 *        64 72 80 96 px 0.5 1.5 2.5 3.5
 *    `p-7` (1,75rem = 28px) CÓ; `p-13` thì KHÔNG (dựng thật: 0 quy tắc). Câu 7
 *    ra đề theo danh sách máy in ra.
 *
 * Ngoài ra một chi tiết trình bày: bài 2.5 in `[&>svg]:h-4` thành
 * `.\[\&\>svg\]\:h-4 > svg` (có dấu cách). Máy in `.\[\&\>svg\]\:h-4>svg`
 * (không dấu cách). Vô hại về ngữ nghĩa, nhưng đề chép đúng bản của máy.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh dưới):  { '0': 7, '1': 8, '2': 8, '3': 7 }
 *   node -e "import('./content/exams/TAILWIND-CSS-PT1.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Số câu theo chương: Mục 0 → 6 · Chương 1 → 8 · Chương 2 → 8 · Chương 3 → 8.
 *
 * Kiểm: node scripts/exam-check.mjs content/exams/TAILWIND-CSS-PT1.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/TAILWIND-CSS-PT1.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/tailwind-exam-kit.mjs';

export default {
  course: { slug: 'tailwind-css' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Section 0 to Chapter 3 (the generator, the scale, variants, conflicts)',
        'Kiểm tra tiến độ 1 — Mục 0 đến Chương 3 (trình sinh, thang giá trị, biến thể, xung đột)',
      ),
      description: B(
        'The first third of the Tailwind CSS course: what a generator is and how it fails, the value scale, what a variant prefix compiles to, and who wins when two utilities collide. 30 multiple-choice questions plus 2 coding questions you write here in the exam room. Every number and every fragment of CSS below came out of Tailwind CLI 3.4.14 running for real.',
        'Một phần ba đầu của khoá Tailwind CSS: trình sinh là gì và nó hỏng ra sao, thang giá trị, một tiền tố biến thể biên dịch ra cái gì, và ai thắng khi hai tiện ích đụng nhau. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi. Mọi con số và mọi mẩu CSS dưới đây đều lấy từ Tailwind CLI 3.4.14 chạy thật.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–3'),
      questions: [
        // ── Mục 0 — Tailwind thật ra là cái gì ──────────────────────────
        mcq({
          prompt: B(
            'This whole file is inside the <code>content</code> globs and nothing else is. Which classes end up in the built CSS?' + code(
              '// keep: mt-9\n' +
              "const dead = 'text-3xl';\n" +
              "const map = { ok: 'bg-green-100' };\n" +
              'export const A = () => <div className={`text-${c}-500 mt-4`} />;\n' +
              "export const B = () => <div className={'px-' + n} />;\n" +
              '/* rounded-3xl */',
            ),
            'Cả file này nằm trong glob <code>content</code> và không còn file nào khác. Những lớp nào có mặt trong CSS đầu ra?' + code(
              '// keep: mt-9\n' +
              "const dead = 'text-3xl';\n" +
              "const map = { ok: 'bg-green-100' };\n" +
              'export const A = () => <div className={`text-${c}-500 mt-4`} />;\n' +
              "export const B = () => <div className={'px-' + n} />;\n" +
              '/* rounded-3xl */',
            ),
          ),
          options: [
            B(
              'Only <code>mt-4</code> — it is the one class that is really rendered into markup; the rest are comments, dead variables or interpolations',
              'Chỉ <code>mt-4</code> — nó là lớp duy nhất thật sự được dựng ra mã đánh dấu; số còn lại là chú thích, biến chết hoặc chuỗi nội suy',
            ),
            B(
              '<code>mt-4</code>, <code>text-red-500</code> and <code>px-4</code> — the scanner resolves the interpolations against the values in scope',
              '<code>mt-4</code>, <code>text-red-500</code> và <code>px-4</code> — bộ quét giải các chuỗi nội suy theo giá trị đang có trong tầm vực',
            ),
            B(
              '<code>mt-9</code>, <code>text-3xl</code>, <code>bg-green-100</code>, <code>mt-4</code> and <code>rounded-3xl</code> — but nothing from the two interpolated strings',
              '<code>mt-9</code>, <code>text-3xl</code>, <code>bg-green-100</code>, <code>mt-4</code> và <code>rounded-3xl</code> — nhưng không có gì từ hai chuỗi nội suy',
            ),
            B(
              'Everything named in the file, because Tailwind parses the module and evaluates both the template literal and the concatenation',
              'Mọi thứ được nhắc trong file, vì Tailwind phân tích module rồi tính cả chuỗi mẫu lẫn phép nối chuỗi',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Built for real on 3.4.14: the output contains <code>.mt-9</code>, <code>.text-3xl</code>, <code>.bg-green-100</code>, <code>.mt-4</code> and <code>.rounded-3xl</code>, and no rule for the two dynamic ones. The scanner reads the file as TEXT — it never parses JavaScript, so it cannot tell a comment from live code, and a class name sitting in a comment or in a variable nobody uses is generated exactly like one in real markup. The same blindness cuts the other way: <code>`text-${c}-500`</code> yields the fragments <code>text-</code> and <code>-500</code>, neither of which is a class, and <code>&quot;px-&quot; + n</code> yields only <code>px-</code>. Note the practical corollary — a comment IS a valid way to keep a class alive, but only in a file the globs actually scan; the same comment in your entry CSS file does nothing, because that file is the input, not content.',
            'Dựng thật trên 3.4.14: đầu ra có <code>.mt-9</code>, <code>.text-3xl</code>, <code>.bg-green-100</code>, <code>.mt-4</code> và <code>.rounded-3xl</code>, và không có quy tắc nào cho hai lớp động. Bộ quét đọc file như VĂN BẢN — nó không hề phân tích JavaScript, nên không phân biệt được chú thích với mã sống, và một tên lớp nằm trong chú thích hay trong một biến chẳng ai dùng vẫn được sinh y như một lớp trong mã đánh dấu thật. Sự mù ấy cắt cả hai chiều: <code>`text-${c}-500`</code> chỉ cho ra hai mẩu <code>text-</code> và <code>-500</code>, chẳng mẩu nào là một lớp, còn <code>&quot;px-&quot; + n</code> chỉ cho ra <code>px-</code>. Lưu ý hệ quả thực dụng — một chú thích LÀ cách hợp lệ để giữ một lớp sống, nhưng chỉ trong file mà glob thật sự quét tới; đúng chú thích ấy đặt trong file CSS đầu vào thì vô nghĩa, vì file đó là đầu vào chứ không phải content.',
          ),
        }),

        mcq({
          prompt: B(
            'A project sets <code>prefix: &quot;tw-&quot;</code> in the config. Of these four classes, which ones generate a rule?' + code(
              '<div class="tw-p-4  p-4  hover:tw-p-8  tw-hover:p-8"></div>',
            ),
            'Một dự án đặt <code>prefix: &quot;tw-&quot;</code> trong config. Trong bốn lớp sau, những lớp nào phát sinh ra quy tắc?' + code(
              '<div class="tw-p-4  p-4  hover:tw-p-8  tw-hover:p-8"></div>',
            ),
          ),
          options: [
            B(
              'All four — a prefix is a rename, so both the prefixed and the original spelling keep working',
              'Cả bốn — tiền tố chỉ là một phép đổi tên, nên cả cách viết có tiền tố lẫn cách viết gốc đều còn dùng được',
            ),
            B(
              '<code>tw-p-4</code> and <code>hover:tw-p-8</code>: the prefix goes on the UTILITY, after the variant, and the unprefixed forms generate nothing',
              '<code>tw-p-4</code> và <code>hover:tw-p-8</code>: tiền tố dán vào TIỆN ÍCH, đứng sau biến thể, còn hai dạng không tiền tố phát sinh số 0 quy tắc',
            ),
            B(
              '<code>tw-p-4</code> and <code>tw-hover:p-8</code>: the prefix goes at the very front of the whole class, before any variant',
              '<code>tw-p-4</code> và <code>tw-hover:p-8</code>: tiền tố đứng ngay đầu cả cái lớp, trước mọi biến thể',
            ),
            B(
              'Only <code>tw-p-4</code>: a prefixed project cannot use variants at all until the prefix is removed',
              'Chỉ <code>tw-p-4</code>: dự án có tiền tố không dùng được biến thể nào cho tới khi bỏ tiền tố đi',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured on 3.4.14 with that exact config: the output holds <code>.tw-p-4</code> and <code>.hover\\:tw-p-8:hover</code>, and nothing at all for <code>p-4</code> or <code>tw-hover:p-8</code>. The prefix attaches to the utility name, so the variant prefix stays outermost — read it as "hover, then the tw- utility". Two consequences worth carrying: a prefix makes every snippet you copy from the docs or from an AI silently dead, since none of them are prefixed; and <code>tailwind-merge</code> does not know about your prefix either until you configure it, so <code>cn()</code> stops resolving conflicts at the same moment.',
            'Đo trên 3.4.14 với đúng config ấy: đầu ra có <code>.tw-p-4</code> và <code>.hover\\:tw-p-8:hover</code>, và tuyệt đối không có gì cho <code>p-4</code> hay <code>tw-hover:p-8</code>. Tiền tố dán vào TÊN TIỆN ÍCH, nên tiền tố biến thể vẫn nằm ngoài cùng — đọc là "hover, rồi tới tiện ích tw-". Hai hệ quả đáng nhớ: có tiền tố thì mọi đoạn mã bạn chép từ tài liệu hay từ AI đều chết câm vì chẳng đoạn nào mang tiền tố; và <code>tailwind-merge</code> cũng không biết tiền tố của bạn cho tới khi bạn khai báo, nên <code>cn()</code> ngừng phân giải xung đột ngay từ lúc ấy.',
          ),
        }),

        mcq({
          prompt: B(
            'A component looks correct with <code>npm run dev</code> and loses all of its styling in the production build. No error, no warning, exit code 0. Which of the four moving parts is the suspect, and why does the symptom split that way?',
            'Một component nhìn đúng khi chạy <code>npm run dev</code> và mất sạch kiểu khi dựng bản production. Không lỗi, không cảnh báo, mã thoát 0. Bộ phận nào trong bốn bộ phận là thủ phạm, và vì sao triệu chứng lại chia ra như thế?',
          ),
          options: [
            B(
              'PostCSS: the dev server has it built in, while a production build needs <code>postcss.config.js</code> to exist',
              'PostCSS: máy chủ dev có sẵn nó bên trong, còn bản dựng production thì cần <code>postcss.config.js</code> tồn tại',
            ),
            B(
              'The theme: production resolves the config strictly, so a scale value missing from <code>theme.extend</code> is dropped',
              'Theme: bản production giải config nghiêm ngặt hơn, nên giá trị nào thiếu trong <code>theme.extend</code> sẽ bị bỏ',
            ),
            B(
              'The <code>@tailwind</code> directives: the production minifier reorders them, so utilities land before Preflight',
              'Các chỉ thị <code>@tailwind</code>: bộ nén của bản production sắp lại chúng, nên tiện ích rơi xuống trước Preflight',
            ),
            B(
              '<code>content</code>: the file sits outside the globs, and only the production build does a single strict pass over them',
              '<code>content</code>: file nằm ngoài glob, và chỉ bản dựng production mới quét chúng đúng một lượt nghiêm ngặt',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the "works in dev, breaks in prod" row of the diagnostic table, and it is always part 1. Dev servers scan loosely and rebuild on demand, so a file reachable by some path the globs do not name can still get its classes emitted; a production build does one strict pass and the file is simply invisible. The tell is scope — EVERY class in ONE file dies while its neighbours are fine. If a single class dies and its neighbours live, <code>content</code> is innocent: that is a typo, a dynamically-built name, or a lost conflict. If everything everywhere dies, look at the directives or at PostCSS instead. Diagnose by scope before you touch anything.',
            'Đây đúng là hàng "chạy được ở dev, vỡ ở prod" trong bảng chẩn đoán, và nó luôn là bộ phận 1. Máy chủ dev quét lỏng và dựng lại theo yêu cầu, nên một file với tới được bằng con đường nào đó mà glob không gọi tên vẫn có thể được sinh lớp; bản dựng production quét đúng một lượt nghiêm ngặt và file ấy đơn giản là vô hình. Dấu hiệu nhận biết là PHẠM VI — MỌI lớp trong MỘT file chết trong khi hàng xóm vẫn sống. Nếu chỉ một lớp chết còn hàng xóm sống thì <code>content</code> vô can: đó là gõ sai, là tên lớp ghép lúc chạy, hoặc là thua một cuộc xung đột. Nếu mọi thứ ở mọi nơi cùng chết thì hãy nhìn sang các chỉ thị hoặc PostCSS. Chẩn theo phạm vi trước khi đụng vào bất cứ thứ gì.',
          ),
        }),

        mcq({
          prompt: B(
            'A class shipped inside an npm dependency does not apply. Someone proposes adding <code>&quot;./node_modules/**/*.js&quot;</code> to <code>content</code>. What is wrong with that, and what is the measured alternative?',
            'Một lớp đi kèm trong một gói npm không có tác dụng. Có người đề nghị thêm <code>&quot;./node_modules/**/*.js&quot;</code> vào <code>content</code>. Đề nghị đó sai ở đâu, và phương án thay thế là gì?',
          ),
          options: [
            B(
              'It makes the scanner read tens of thousands of files on every rebuild; name the ONE package path instead',
              'Nó bắt bộ quét đọc hàng chục nghìn file mỗi lần dựng lại; hãy chỉ đích danh đường dẫn của ĐÚNG MỘT gói',
            ),
            B(
              'Tailwind refuses globs pointing into <code>node_modules</code> and fails the build with a configuration error',
              'Tailwind từ chối glob trỏ vào <code>node_modules</code> và làm hỏng bản dựng kèm một lỗi cấu hình',
            ),
            B(
              'It works but doubles the output CSS, because every utility in every dependency is emitted whether used or not',
              'Nó chạy được nhưng làm CSS đầu ra to gấp đôi, vì mọi tiện ích trong mọi gói phụ thuộc đều được sinh dù dùng hay không',
            ),
            B(
              'Nothing is wrong: this is the documented way to pick up classes from dependencies, and rebuild time is unaffected',
              'Không sai gì cả: đây chính là cách được tài liệu hoá để lấy lớp từ gói phụ thuộc, và thời gian dựng lại không đổi',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The build still succeeds, which is exactly why this one survives review. What changes is that every rebuild now walks the whole dependency tree, so dev-server rebuilds go from milliseconds to seconds — and nobody connects that to a config line edited weeks earlier. The output does not double, because Tailwind still emits only the classes it found; the cost is scan time, not bytes. The correct move is to add the single package that needs it, e.g. <code>&quot;./node_modules/some-ui/dist/**/*.js&quot;</code>, or to safelist the handful of class names involved.',
            'Bản dựng vẫn thành công, và chính vì thế mà chỗ này sống sót qua review. Cái thay đổi là mỗi lần dựng lại bây giờ phải đi bộ khắp cây phụ thuộc, nên máy chủ dev dựng lại từ mili-giây thành vài giây — và không ai nối chuyện đó với một dòng config sửa từ mấy tuần trước. Đầu ra KHÔNG to gấp đôi, vì Tailwind vẫn chỉ sinh những lớp nó tìm thấy; cái giá là thời gian quét chứ không phải số byte. Cách đúng là thêm đúng một gói cần tới, ví dụ <code>&quot;./node_modules/some-ui/dist/**/*.js&quot;</code>, hoặc safelist vài tên lớp có liên quan.',
          ),
        }),

        mcq({
          prompt: B(
            'This repository ships <code>plugins: []</code> and hand-writes about 300 lines of <code>.rich-content</code> CSS instead of installing <code>@tailwindcss/typography</code>. The reason is recorded in <code>globals.css</code>. What does that pattern actually teach?',
            'Kho này khai <code>plugins: []</code> và tự viết tay khoảng 300 dòng CSS <code>.rich-content</code> thay vì cài <code>@tailwindcss/typography</code>. Lý do được ghi ngay trong <code>globals.css</code>. Nếp làm ấy dạy được điều gì?',
          ),
          options: [
            B(
              'Tailwind plugins are incompatible with a custom <code>darkMode</code> strategy, so any themed project must ship an empty plugin array',
              'Plugin của Tailwind không tương thích với chiến lược <code>darkMode</code> tuỳ chỉnh, nên dự án nào có theme riêng cũng phải để mảng plugin rỗng',
            ),
            B(
              'The plugin would force <code>.prose</code> colours the dark theme does not want, and the decision was written down so nobody "helpfully" reinstalls it',
              'Plugin sẽ ép các màu <code>.prose</code> mà theme tối không muốn, và quyết định ấy được ghi lại để không ai "giúp đỡ" bằng cách cài lại nó',
            ),
            B(
              'Hand-written CSS is always cheaper than a plugin, because a plugin is generated on every rebuild while a stylesheet is read once',
              'CSS viết tay luôn rẻ hơn plugin, vì plugin được sinh lại mỗi lần dựng còn bảng kiểu thì chỉ đọc một lần',
            ),
            B(
              'An empty plugin array is required for <code>content</code> globs to be honoured; a non-empty one makes Tailwind scan every file',
              'Mảng plugin rỗng là điều kiện để glob <code>content</code> được tôn trọng; mảng khác rỗng làm Tailwind quét mọi file',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The comment in <code>globals.css</code> says it directly: the team does not depend on the typography plugin because it would force <code>.prose</code> colours they do not want in the dark theme. Neither choice is universally right — the plugin saves real work in a project with a plain light theme. What is right is that the reason lives next to the code, so the empty array reads as a decision rather than as an omission somebody should fix. An undocumented <code>plugins: []</code> gets "improved" within a quarter, and the theme breaks in a way nobody traces back to the install.',
            'Chú thích trong <code>globals.css</code> nói thẳng: đội ngũ không phụ thuộc plugin typography vì nó sẽ ép các màu <code>.prose</code> mà họ không muốn trong theme tối. Không lựa chọn nào đúng phổ quát — plugin tiết kiệm công thật trong một dự án chỉ có theme sáng thuần. Cái đúng là LÝ DO nằm ngay cạnh mã, nên mảng rỗng đọc ra như một quyết định chứ không phải một thiếu sót cần ai đó vá. Một <code>plugins: []</code> không ghi lý do sẽ bị "cải tiến" trong vòng một quý, và theme vỡ theo cách không ai lần ngược về được lệnh cài.',
          ),
        }),

        mcq({
          prompt: B(
            'The same app carries 7,758 utilities that use a state or a breakpoint variant AND 3,128 remaining <code>style={{}}</code> attributes. Which pair of jobs is split correctly between the two?',
            'Cùng một ứng dụng mang 7.758 tiện ích dùng biến thể trạng thái hoặc điểm ngắt VÀ 3.128 thuộc tính <code>style={{}}</code> còn lại. Cặp công việc nào được chia đúng giữa hai bên?',
          ),
          options: [
            B(
              'Utility for a progress bar width from a percentage; inline style for a hover colour, because hover needs the higher priority of an attribute',
              'Tiện ích cho chiều rộng thanh tiến trình tính theo phần trăm; inline style cho màu hover, vì hover cần độ ưu tiên cao hơn của một thuộc tính',
            ),
            B(
              'Utility for everything, inline style for nothing: the 3,128 remaining ones are legacy code that should be migrated',
              'Tiện ích cho mọi thứ, inline style cho không gì cả: 3.128 chỗ còn lại là mã cũ cần được chuyển đổi',
            ),
            B(
              'Utility for a hover colour from the palette; inline style for a chart bar height computed from data at runtime',
              'Tiện ích cho màu hover lấy từ bảng màu; inline style cho chiều cao cột biểu đồ tính từ dữ liệu lúc chạy',
            ),
            B(
              'Inline style for both, since an attribute is resolved at render time and therefore always beats a generated rule',
              'Inline style cho cả hai, vì một thuộc tính được giải lúc dựng nên luôn thắng một quy tắc được phát sinh',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The split is not about priority, it is about whether the value is known at build time. <code>style</code> has no grammar for a selector at all — no pseudo-class, no media query — so the 7,758 conditional utilities have no inline equivalent to migrate to. In the other direction a value computed at runtime from data can never be a class, because the generator never saw the string: a bar height of <code>68.4%</code> must go through <code>style</code>. If you need a hover on a runtime value, the third path is a CSS variable set inline and consumed by a utility.',
            'Ranh giới không nằm ở độ ưu tiên mà nằm ở chỗ giá trị có biết trước lúc dựng hay không. <code>style</code> hoàn toàn không có ngữ pháp cho selector — không lớp giả, không truy vấn media — nên 7.758 tiện ích có điều kiện kia chẳng có bản inline tương đương nào để chuyển sang. Chiều ngược lại, một giá trị tính lúc chạy từ dữ liệu thì không bao giờ thành lớp được, vì trình sinh chưa từng thấy chuỗi ấy: chiều cao cột <code>68,4%</code> buộc phải đi qua <code>style</code>. Nếu cần hover trên một giá trị tính lúc chạy thì con đường thứ ba là đặt một biến CSS ngay trong inline rồi cho một tiện ích tiêu thụ nó.',
          ),
        }),

        // ── Chương 1 — Thang giá trị ────────────────────────────────────
        mcq({
          prompt: B(
            'These four classes are built together. Reading the default spacing scale out of <code>resolveConfig</code> on 3.4.14, which statement matches what comes out?' + code(
              '<div class="gap-7  p-9  mt-11  mt-13"></div>',
            ),
            'Bốn lớp này được dựng cùng nhau. Đọc thang spacing mặc định từ <code>resolveConfig</code> trên 3.4.14, phát biểu nào khớp với thứ đi ra?' + code(
              '<div class="gap-7  p-9  mt-11  mt-13"></div>',
            ),
          ),
          options: [
            B(
              'All four are emitted; the scale is continuous from 0 to 96, so any integer key resolves',
              'Cả bốn đều được sinh; thang liên tục từ 0 tới 96 nên khoá số nguyên nào cũng giải được',
            ),
            B(
              'Only <code>p-9</code> is emitted; the scale skips every odd key above 5 and <code>gap</code> uses a scale of its own',
              'Chỉ <code>p-9</code> được sinh; thang bỏ qua mọi khoá lẻ trên 5 và <code>gap</code> dùng thang riêng của nó',
            ),
            B(
              'None is emitted, and the build fails with an "unknown value" error naming the four keys',
              'Không cái nào được sinh, và bản dựng hỏng kèm lỗi "unknown value" nêu tên cả bốn khoá',
            ),
            B(
              'Three are emitted — <code>gap-7</code> = 28px, <code>p-9</code> = 36px, <code>mt-11</code> = 44px — and <code>mt-13</code> produces no rule at all',
              'Ba cái được sinh — <code>gap-7</code> = 28px, <code>p-9</code> = 36px, <code>mt-11</code> = 44px — còn <code>mt-13</code> không sinh ra quy tắc nào',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Built for real: <code>.gap-7</code>, <code>.p-9</code> and <code>.mt-11</code> are in the output and there is no <code>.mt-13</code>. The full 35 keys read out of <code>resolveConfig</code> are 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96, plus <code>px</code>, 0.5, 1.5, 2.5 and 3.5. The × 4px rule holds on every one of them, so 7 is 28px and 11 is 44px. Above 12 the scale thins out to steps of 4 keys, which is where the holes start: 13, 15, 17… are gone, and so are 13 through 15 in the middle. Derive with the multiplication, but check the key exists — an invented key fails exactly the way a typo does, silently.',
            'Dựng thật: <code>.gap-7</code>, <code>.p-9</code> và <code>.mt-11</code> có trong đầu ra, và không hề có <code>.mt-13</code>. Đủ 35 khoá đọc từ <code>resolveConfig</code> là 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96, cộng <code>px</code>, 0.5, 1.5, 2.5 và 3.5. Luật × 4px đúng với từng khoá một, nên 7 là 28px và 11 là 44px. Trên mức 12 thì thang thưa dần theo bước 4 khoá, và đó là chỗ bắt đầu có lỗ: 13, 15, 17… biến mất. Hãy suy ra bằng phép nhân, nhưng phải kiểm khoá có tồn tại không — một khoá bịa ra hỏng đúng theo kiểu của một lỗi gõ sai: im lặng.',
          ),
        }),

        mcq({
          prompt: B(
            'A reviewer replaces <code>p-4</code> with <code>p-[16px]</code> arguing they are the same thing. On the machine, <code>.p-4</code> emits <code>padding: 1rem</code>. What does the substitution actually change?',
            'Một người review thay <code>p-4</code> bằng <code>p-[16px]</code> với lý lẽ hai cái là một. Trên máy, <code>.p-4</code> phát sinh <code>padding: 1rem</code>. Phép thay ấy thật sự đổi cái gì?',
          ),
          options: [
            B(
              'A reader who raises the browser root font size to 20px gets 20px of padding from <code>p-4</code> and a frozen 16px from <code>p-[16px]</code>',
              'Người đọc nâng cỡ chữ gốc của trình duyệt lên 20px sẽ nhận 20px padding từ <code>p-4</code> và một con số 16px đông cứng từ <code>p-[16px]</code>',
            ),
            B(
              'Nothing at render time; the only cost is that the arbitrary value takes one extra character in the output file',
              'Không đổi gì lúc dựng hình; cái giá duy nhất là giá trị tuỳ ý tốn thêm một ký tự trong file đầu ra',
            ),
            B(
              'The arbitrary value is emitted later in the file, so it now beats every other padding utility on the element',
              'Giá trị tuỳ ý được sinh muộn hơn trong file, nên bây giờ nó thắng mọi tiện ích padding khác trên thẻ đó',
            ),
            B(
              '<code>p-[16px]</code> is rejected by the generator, because arbitrary values may only be used for properties absent from the theme',
              '<code>p-[16px]</code> bị trình sinh từ chối, vì giá trị tuỳ ý chỉ được dùng cho thuộc tính không có trong theme',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The pixel figure is a consequence of <code>1rem</code> at the default 16px root, not the stored value. Someone who sets their browser base font to 20px for readability scales the whole layout with the text under <code>p-4</code>, and gets text that grew inside padding that did not under <code>p-[16px]</code> — the classic cramped-at-zoom bug. This is the accessibility argument for a rem scale, and it is why "it is the same 16px" is only true for the default reader. Arbitrary values are a legitimate escape hatch, but not for a value the scale already has.',
            'Con số pixel là hệ quả của <code>1rem</code> ở cỡ gốc mặc định 16px, chứ không phải giá trị được lưu. Người đặt cỡ chữ nền của trình duyệt lên 20px cho dễ đọc sẽ được cả bố cục phóng theo phần chữ nếu dùng <code>p-4</code>, còn với <code>p-[16px]</code> thì chữ to lên trong một khoảng đệm đứng yên — đúng con bọ "chật cứng khi phóng to" kinh điển. Đây là lý lẽ về khả năng tiếp cận của một thang tính bằng rem, và cũng là lý do câu "vẫn 16px chứ có khác gì" chỉ đúng với người đọc mặc định. Giá trị tuỳ ý là lối thoát chính đáng, nhưng không phải cho một giá trị mà thang đã có sẵn.',
          ),
        }),

        mcq({
          prompt: B(
            'Two arbitrary values in one codebase: <code>top-[37px]</code> appears twice (aligning with a third-party widget) and <code>text-[11px]</code> appears 803 times. What does the counting rule say about each?',
            'Hai giá trị tuỳ ý trong cùng một kho: <code>top-[37px]</code> xuất hiện hai lần (để canh với một widget bên thứ ba) và <code>text-[11px]</code> xuất hiện 803 lần. Luật ĐẾM nói gì về từng cái?',
          ),
          options: [
            B(
              'Both should be named in the config: any repeated arbitrary value is a design token that has not been declared yet',
              'Cả hai đều nên được đặt tên trong config: giá trị tuỳ ý nào lặp lại cũng là một token thiết kế chưa được khai báo',
            ),
            B(
              'Leave <code>top-[37px]</code> alone; name <code>text-[11px]</code> in <code>theme.extend.fontSize</code>, because at 803 uses it IS a system value without a name',
              'Để yên <code>top-[37px]</code>; đặt tên <code>text-[11px]</code> trong <code>theme.extend.fontSize</code>, vì ở mức 803 lượt dùng thì nó ĐÃ LÀ một giá trị hệ thống chưa có tên',
            ),
            B(
              'Round both to the scale: <code>top-9</code> and <code>text-xs</code>, since an escape hatch used more than once means the scale was misread',
              'Làm tròn cả hai về thang: <code>top-9</code> và <code>text-xs</code>, vì lối thoát dùng quá một lần nghĩa là đã đọc sai thang',
            ),
            B(
              'Leave both alone: arbitrary values compile to identical CSS, so naming them changes nothing that a build can measure',
              'Để yên cả hai: giá trị tuỳ ý biên dịch ra CSS y hệt, nên đặt tên cho chúng không đổi thứ gì mà một bản dựng đo được',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The threshold is a count, not a taste: 1–3 uses stay arbitrary because a name implies a design decision nobody actually made; 4–10 is a judgement call that turns on whether the uses are spread across features; 10+ means it is already part of the system. The cost of never crossing the line shows up the day the design team moves badge text from 11px to 12px — one config line versus 803 find-and-replaces that can no longer distinguish "11px because badge" from "11px because of a one-off alignment". Rounding <code>top-[37px]</code> to the scale would leave the button 5px out of alignment with the widget forever, which is why the rule is not "never".',
            'Ngưỡng là một PHÉP ĐẾM chứ không phải khẩu vị: 1–3 lượt thì để tuỳ ý, vì một cái tên hàm ý một quyết định thiết kế mà thật ra chưa ai đưa ra; 4–10 là chỗ phải cân nhắc, tuỳ các lượt dùng có rải ra nhiều tính năng hay không; từ 10 trở lên thì nó đã là một phần của hệ thống rồi. Cái giá của việc không bao giờ bước qua vạch lộ ra vào ngày đội thiết kế đổi chữ huy hiệu từ 11px sang 12px — một dòng config so với 803 lần tìm-và-thay, mà lúc ấy đã không còn phân biệt được "11px vì là huy hiệu" với "11px vì một chỗ canh lề riêng lẻ". Làm tròn <code>top-[37px]</code> về thang thì cái nút lệch 5px so với widget mãi mãi, nên luật này không phải là "cấm tiệt".',
          ),
        }),

        mcq({
          prompt: B(
            'The default <code>fontSize</code> scale runs <code>xs</code> 0.75rem (12px), <code>sm</code> 0.875rem (14px), <code>base</code> 1rem, and up to <code>9xl</code>. What does the shape of the bottom of that scale predict about a dense information UI?',
            'Thang <code>fontSize</code> mặc định chạy <code>xs</code> 0.75rem (12px), <code>sm</code> 0.875rem (14px), <code>base</code> 1rem, lên tới <code>9xl</code>. Hình dạng phần ĐÁY của thang ấy dự đoán điều gì về một giao diện dày đặc thông tin?',
          ),
          options: [
            B(
              'Nothing: the scale is complete at the bottom, and any app needing smaller text has an accessibility problem rather than a scale problem',
              'Không dự đoán gì: phần đáy của thang đã đầy đủ, và ứng dụng nào cần chữ nhỏ hơn là đang có vấn đề tiếp cận chứ không phải vấn đề thang',
            ),
            B(
              'Badges and timestamps will use <code>text-xs</code> everywhere, so the scale fits and no arbitrary values appear at all',
              'Huy hiệu và dấu thời gian sẽ dùng <code>text-xs</code> khắp nơi, nên thang vừa khít và không có giá trị tuỳ ý nào xuất hiện',
            ),
            B(
              'It has two holes — nothing under 12px and nothing between 12 and 14 — so badges, metadata and table cells escape into <code>text-[10px]</code>, <code>text-[11px]</code>, <code>text-[13px]</code>',
              'Nó có hai cái lỗ — không có gì dưới 12px và không có gì giữa 12 với 14 — nên huy hiệu, siêu dữ liệu và ô bảng phải chạy sang <code>text-[10px]</code>, <code>text-[11px]</code>, <code>text-[13px]</code>',
            ),
            B(
              'It predicts heavy use of <code>text-sm</code> with a <code>scale-90</code> transform, which is the documented way to reach sizes below the scale',
              'Nó dự đoán việc dùng nhiều <code>text-sm</code> kèm biến đổi <code>scale-90</code>, vốn là cách được tài liệu hoá để với tới cỡ dưới thang',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Read the two facts about the bottom of the list and the prediction falls out: 12px is the floor, and the first step is 12 → 14, so 10px, 11px and 13px are all inexpressible. Counting this repository confirms it — 595 uses of <code>text-[10px]</code>, 803 of <code>text-[11px]</code>, 240 of <code>text-[13px]</code>, 1,638 escapes caused by exactly those two holes. Neither party is wrong: the scale was tuned for content sites where 12px is a sensible floor, and this is a dense information UI. The measured mismatch is data about your domain, and 1,638 is the number that says it belongs in the config.',
            'Đọc hai sự thật về phần đáy danh sách là dự đoán tự rơi ra: 12px là sàn, và bước đầu tiên là 12 → 14, nên 10px, 11px và 13px đều không diễn đạt được. Đếm trong kho này thì đúng vậy — 595 lượt <code>text-[10px]</code>, 803 lượt <code>text-[11px]</code>, 240 lượt <code>text-[13px]</code>, tổng 1.638 lần thoát ra chỉ vì đúng hai cái lỗ ấy. Không bên nào sai: thang được chỉnh cho các trang nội dung nơi 12px là cái sàn hợp lý, còn đây là một giao diện dày đặc thông tin. Độ lệch đo được ấy là dữ liệu về lĩnh vực của bạn, và con số 1.638 chính là thứ nói rằng nó thuộc về file config.',
          ),
        }),

        mcq({
          prompt: B(
            'Contrast ratios computed with the WCAG formula against the real 3.4.14 palette, all on a white background. Which row is the machine\'s answer?' + code(
              'yellow-500 #eab308   ?\n' +
              'blue-500   #3b82f6   ?\n' +
              'red-500    #ef4444   ?\n' +
              'AA needs 4.5:1 for normal text, 3:1 for large text',
            ),
            'Tỉ số tương phản tính bằng công thức WCAG trên đúng bảng màu 3.4.14, tất cả trên nền trắng. Hàng nào là câu trả lời của MÁY?' + code(
              'yellow-500 #eab308   ?\n' +
              'blue-500   #3b82f6   ?\n' +
              'red-500    #ef4444   ?\n' +
              'AA cần 4,5:1 cho chữ thường, 3:1 cho chữ lớn',
            ),
          ),
          options: [
            B(
              'yellow 1.92 fails, blue 5.14 passes AA for body text, red 4.61 passes AA for body text',
              'yellow 1,92 trượt, blue 5,14 đạt AA cho chữ thường, red 4,61 đạt AA cho chữ thường',
            ),
            B(
              'All three pass: step 500 is defined as the first step of every family that clears 4.5:1 on white',
              'Cả ba đều đạt: bậc 500 được định nghĩa là bậc đầu tiên của mọi họ màu vượt 4,5:1 trên nền trắng',
            ),
            B(
              'All three fail even the 3:1 large-text threshold, which is why coloured text on white is never allowed',
              'Cả ba trượt cả ngưỡng 3:1 của chữ lớn, nên chữ màu trên nền trắng không bao giờ được phép',
            ),
            B(
              'yellow 1.92, blue 3.68, red 3.76 — none reaches 4.5, so blue and red are legal for large text only',
              'yellow 1,92, blue 3,68, red 3,76 — không cái nào tới 4,5, nên blue và red chỉ hợp lệ cho chữ lớn',
            ),
          ],
          correct: 3,
          explanation: EX(
            '⚠️ <b>The machine disagrees with the course here, and the exam follows the machine.</b> Lesson 1.3 writes that "text-yellow-500 on white is unreadable while text-blue-500 on white is fine". Computing the WCAG relative luminance over the real palette gives yellow-500 = 1.92, blue-500 = 3.68, red-500 = 3.76, sky-500 = 2.77, green-500 = 2.28, emerald-500 = 2.54, amber-500 = 2.15 — <em>not one</em> of the seven reaches 4.5:1 on white. Blue only looks fine next to yellow. The lesson\'s real point survives intact and gets stronger: luminance is dominated by the green channel (weight 0.7152 against 0.0722 for blue), so a step number tells you nothing across families. The usable rule is that coloured text at step 500 on white is a large-text or UI-accent colour, and body copy needs 600 or darker — computed per family, never generalised.',
            '⚠️ <b>Ở chỗ này máy khác giáo trình, và đề theo MÁY.</b> Bài 1.3 viết rằng "text-yellow-500 trên nền trắng thì không đọc nổi còn text-blue-500 trên nền trắng thì ổn". Tính độ chói tương đối theo WCAG trên đúng bảng màu thật thì yellow-500 = 1,92, blue-500 = 3,68, red-500 = 3,76, sky-500 = 2,77, green-500 = 2,28, emerald-500 = 2,54, amber-500 = 2,15 — <em>không một</em> họ nào trong bảy họ chạm tới 4,5:1 trên nền trắng. Blue chỉ trông có vẻ ổn khi đứng cạnh yellow. Ý chính của bài vẫn nguyên vẹn và còn mạnh hơn: độ chói bị kênh xanh lá chi phối (trọng số 0,7152 so với 0,0722 của xanh lam), nên một con số bậc chẳng nói lên điều gì khi đổi họ màu. Luật dùng được là: chữ màu ở bậc 500 trên nền trắng là màu cho chữ LỚN hoặc cho điểm nhấn giao diện, còn chữ thân bài cần bậc 600 trở lên — tính riêng cho từng họ, không bao giờ khái quát.',
          ),
        }),

        mcq({
          prompt: B(
            'Same slate family, dark background this time: text on <code>bg-slate-900</code>. Which steps pass AA 4.5:1 for body text, and what does the pattern say?',
            'Vẫn họ slate, lần này nền tối: chữ trên <code>bg-slate-900</code>. Bậc nào đạt AA 4,5:1 cho chữ thân bài, và quy luật ấy nói gì?',
          ),
          options: [
            B(
              'slate-300 (12.02) and slate-400 (6.96) pass; slate-500 (3.75) fails — the mid steps are the dangerous ones because they are far from both ends',
              'slate-300 (12,02) và slate-400 (6,96) đạt; slate-500 (3,75) trượt — các bậc giữa mới là chỗ nguy hiểm vì chúng xa cả hai đầu',
            ),
            B(
              'The same steps pass as on white: contrast is a property of the colour, so slate-500 upward is safe on any background',
              'Vẫn đúng những bậc đạt trên nền trắng: tương phản là thuộc tính của màu, nên từ slate-500 trở lên là an toàn trên mọi nền',
            ),
            B(
              'Only slate-50 and slate-100 pass; anything with a step number is too dark to read on a 900 background',
              'Chỉ slate-50 và slate-100 đạt; bất cứ thứ gì có số bậc đều quá tối để đọc trên nền 900',
            ),
            B(
              'slate-600 (7.58) and darker pass, exactly as on white, because the ratio formula is symmetric in its two arguments',
              'slate-600 (7,58) trở lên đạt, y hệt như trên nền trắng, vì công thức tỉ số đối xứng với hai đối số của nó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured on the real palette: against <code>#0f172a</code>, slate-300 gives 12.02, slate-400 gives 6.96, slate-500 gives 3.75, slate-600 gives 2.36. The arithmetic mirrors, and that is the useful shape — the steps that are safe on white (500 and darker) are exactly the ones that fail on a dark surface, and the ones that fail on white (400 and lighter) are the safe ones there. The formula being symmetric is what makes a MIDDLE step dangerous rather than universally safe: slate-500 is far from both #ffffff and #0f172a in step number and close to neither in luminance. This is why a light/dark theme cannot reuse one hard-coded grey for "muted text" — the value has to resolve per theme, which is what chapter 6 is for.',
            'Đo trên bảng màu thật: đối với <code>#0f172a</code>, slate-300 cho 12,02, slate-400 cho 6,96, slate-500 cho 3,75, slate-600 cho 2,36. Phép tính soi gương lại, và đó mới là hình dạng hữu ích — những bậc an toàn trên nền trắng (500 trở xuống tối) đúng là những bậc trượt trên nền tối, còn những bậc trượt trên nền trắng (400 trở lên sáng) lại là những bậc an toàn ở đó. Việc công thức đối xứng chính là thứ làm cho một bậc GIỮA thành nguy hiểm chứ không phải an toàn phổ quát: slate-500 xa cả #ffffff lẫn #0f172a về số bậc và chẳng gần cái nào về độ chói. Vì thế một theme sáng/tối không thể dùng lại một mã xám đóng cứng cho "chữ mờ" — giá trị phải giải theo từng theme, và đó là việc của chương 6.',
          ),
        }),

        mcq({
          prompt: B(
            'An icon inside a flex row is squashed into an oval on narrow screens. The markup already sets an explicit size.' + code(
              '<div class="flex items-center gap-2">\n' +
              '  <Icon class="h-4 w-4" />\n' +
              '  <span>A long label that takes all the available space…</span>\n' +
              '</div>',
            ) + 'Why does <code>w-4</code> not hold, and what does the repository\'s 987 uses of <code>shrink-0</code> record?',
            'Một biểu tượng trong hàng flex bị bóp thành hình bầu dục ở màn hình hẹp. Mã đánh dấu đã đặt kích thước tường minh.' + code(
              '<div class="flex items-center gap-2">\n' +
              '  <Icon class="h-4 w-4" />\n' +
              '  <span>Một nhãn dài chiếm hết chỗ còn lại…</span>\n' +
              '</div>',
            ) + 'Vì sao <code>w-4</code> không giữ được, và 987 lượt dùng <code>shrink-0</code> của kho này ghi lại điều gì?',
          ),
          options: [
            B(
              '<code>items-center</code> overrides the width when the cross axis is constrained; removing it restores the icon box',
              '<code>items-center</code> ghi đè chiều rộng khi trục ngang bị bó; bỏ nó đi là hộp biểu tượng trở lại',
            ),
            B(
              'A flex child defaults to <code>flex-shrink: 1</code>, so width is a starting size and not a floor — only <code>shrink-0</code> (or a <code>min-w-</code>) makes it binding',
              'Con của flex mặc định <code>flex-shrink: 1</code>, nên chiều rộng chỉ là kích thước KHỞI ĐIỂM chứ không phải sàn — chỉ <code>shrink-0</code> (hoặc một <code>min-w-</code>) mới làm nó ràng buộc',
            ),
            B(
              '<code>gap-2</code> is subtracted from the children rather than from the container, so the icon absorbs the gap at narrow widths',
              '<code>gap-2</code> bị trừ vào các con thay vì vào hộp chứa, nên biểu tượng nuốt phần khe hở khi bề ngang hẹp',
            ),
            B(
              'The SVG has no intrinsic size, so <code>w-4</code> never generates a rule for it; the fix is an explicit <code>viewBox</code>',
              'SVG không có kích thước nội tại nên <code>w-4</code> không sinh ra quy tắc nào cho nó; cách sửa là một <code>viewBox</code> tường minh',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The rule is plain flexbox, not Tailwind: <code>flex-shrink</code> defaults to 1, so every child may be compressed below its content and below its declared width when space runs short. For text that is usually fine; for a 16×16 icon it produces an oval, and only at narrow widths, which is why it survives desktop testing and appears on phones. <code>shrink-0</code> is used 987 times in this repository — more than <code>grid</code>, more than <code>block</code> and <code>hidden</code> combined — and that number is a bug report about the default rather than a style preference. Read it as: "I set the width" feels binding and is not.',
            'Luật này là flexbox thuần chứ không phải Tailwind: <code>flex-shrink</code> mặc định bằng 1, nên mọi thẻ con đều có thể bị nén xuống dưới nội dung của nó và dưới cả chiều rộng đã khai khi hết chỗ. Với chữ thì thường không sao; với một biểu tượng 16×16 thì ra hình bầu dục, và chỉ ở bề ngang hẹp, nên nó sống sót qua vòng thử trên desktop rồi hiện ra trên điện thoại. <code>shrink-0</code> được dùng 987 lần trong kho này — nhiều hơn <code>grid</code>, nhiều hơn <code>block</code> cộng <code>hidden</code> — và con số ấy là một BÁO CÁO LỖI về giá trị mặc định chứ không phải một sở thích phong cách. Đọc nó là: cảm giác "tôi đã đặt chiều rộng rồi" nghe như ràng buộc, mà không phải.',
          ),
        }),

        mcq({
          prompt: B(
            'Two sizing bugs with the same root cause. A banner with <code>w-screen</code> inside a 400px sidebar bursts out of it (and vanishes if the parent has <code>overflow-hidden</code>), and a mobile app shell with <code>h-screen</code> hides its footer under the browser bar. What is the shared diagnosis?',
            'Hai con bọ về kích thước cùng một gốc. Một dải băng dùng <code>w-screen</code> trong thanh bên rộng 400px thì bung ra khỏi nó (và biến mất nếu cha có <code>overflow-hidden</code>), còn một khung ứng dụng di động dùng <code>h-screen</code> thì giấu chân trang xuống dưới thanh trình duyệt. Chẩn đoán chung là gì?',
          ),
          options: [
            B(
              'Both classes were dropped by the generator because viewport units cannot be represented in the spacing scale',
              'Cả hai lớp bị trình sinh bỏ qua vì đơn vị viewport không biểu diễn được trong thang spacing',
            ),
            B(
              'Both need an explicit <code>box-border</code>; viewport units include padding and border unless the box model is reset',
              'Cả hai cần một <code>box-border</code> tường minh; đơn vị viewport bao gồm cả padding và viền trừ khi mô hình hộp được đặt lại',
            ),
            B(
              'Both resolve against the WINDOW, not the parent — <code>w-full</code> for the sidebar, and <code>min-h-screen</code> or <code>h-dvh</code> for the shell',
              'Cả hai giải theo CỬA SỔ chứ không theo cha — <code>w-full</code> cho thanh bên, và <code>min-h-screen</code> hoặc <code>h-dvh</code> cho khung ứng dụng',
            ),
            B(
              'Both are caused by the parent missing <code>relative</code>, which is what anchors a viewport-sized child to its container',
              'Cả hai do cha thiếu <code>relative</code>, thứ neo một thẻ con cỡ viewport vào hộp chứa của nó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Of the 70 keys on the width scale, exactly half are not lengths: fractions resolve against the PARENT (<code>w-1/2</code> emits <code>width: 50%</code>), viewport units resolve against the WINDOW (<code>w-screen</code> emits <code>width: 100vw</code>), and <code>min</code>/<code>max</code>/<code>fit</code>/<code>auto</code> are computed from the content. Mixing up the reference frame is what produces both symptoms. The mobile one has an extra wrinkle: on phones the address bar hides as you scroll, so <code>100vh</code> resolves against the LARGEST viewport — hence three unit families, with <code>dvh</code> tracking the current size and <code>svh</code> the smallest. For an app shell you usually want <code>min-h-screen</code> anyway, because <code>h-screen</code> also clips content longer than the viewport instead of scrolling it.',
            'Trong 70 khoá của thang chiều rộng, đúng một nửa KHÔNG phải độ dài: phân số giải theo CHA (<code>w-1/2</code> phát sinh <code>width: 50%</code>), đơn vị viewport giải theo CỬA SỔ (<code>w-screen</code> phát sinh <code>width: 100vw</code>), còn <code>min</code>/<code>max</code>/<code>fit</code>/<code>auto</code> được tính từ nội dung. Lẫn lộn hệ quy chiếu chính là thứ đẻ ra cả hai triệu chứng. Cái trên di động có thêm một nếp gấp: trên điện thoại thanh địa chỉ ẩn đi khi cuộn, nên <code>100vh</code> giải theo viewport LỚN NHẤT — vì thế mới có ba họ đơn vị, với <code>dvh</code> bám theo cỡ hiện tại và <code>svh</code> bám cỡ nhỏ nhất. Với một khung ứng dụng thì dù sao bạn cũng thường muốn <code>min-h-screen</code>, vì <code>h-screen</code> còn cắt cụt nội dung dài hơn viewport thay vì cho cuộn.',
          ),
        }),

        // ── Chương 2 — Biến thể ─────────────────────────────────────────
        mcq({
          prompt: B(
            'Four of these five variant prefixes make the rule more specific than a plain utility. Which one does NOT, and what follows from that asymmetry?' + code(
              'hover:   →  .hover\\:x:hover\n' +
              'group-hover: →  .group:hover .group-hover\\:x\n' +
              'peer-checked: →  .peer:checked ~ .peer-checked\\:x\n' +
              'dark: (class) →  .dark\\:x:is(.dark *)\n' +
              'md:      →  @media (min-width: 768px) { .md\\:x }',
            ),
            'Bốn trong năm tiền tố biến thể này làm quy tắc đặc hiệu hơn một tiện ích trơn. Cái nào KHÔNG, và độ lệch ấy dẫn tới điều gì?' + code(
              'hover:   →  .hover\\:x:hover\n' +
              'group-hover: →  .group:hover .group-hover\\:x\n' +
              'peer-checked: →  .peer:checked ~ .peer-checked\\:x\n' +
              'dark: (class) →  .dark\\:x:is(.dark *)\n' +
              'md:      →  @media (min-width: 768px) { .md\\:x }',
            ),
          ),
          options: [
            B(
              '<code>group-hover:</code> — a descendant combinator adds no weight of its own, so it ties with a plain utility',
              '<code>group-hover:</code> — dấu kết hợp con cháu không tự thêm trọng lượng nào, nên nó hoà với một tiện ích trơn',
            ),
            B(
              '<code>dark:</code> — <code>:is()</code> is a functional pseudo-class and functional pseudo-classes are always weightless',
              '<code>dark:</code> — <code>:is()</code> là lớp giả dạng hàm, mà lớp giả dạng hàm thì luôn không có trọng lượng',
            ),
            B(
              '<code>peer-checked:</code> — the sibling combinator resets the selector\'s weight to that of its rightmost simple selector',
              '<code>peer-checked:</code> — dấu kết hợp anh em đặt lại trọng lượng selector về trọng lượng của selector đơn ngoài cùng bên phải',
            ),
            B(
              '<code>md:</code> — a media query is a wrapper, so the selector stays 0,1,0 and it wins only by being emitted later',
              '<code>md:</code> — truy vấn media chỉ là lớp bọc, nên selector vẫn 0,1,0 và nó chỉ thắng nhờ được phát sinh muộn hơn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Read the five outputs: four of them change the SELECTOR (append a pseudo-class, add a descendant or sibling combinator, wrap in <code>:is()</code> — and <code>:is()</code> takes the specificity of its most specific argument, so <code>dark:</code> scores 0,2,0 too). The media query changes nothing about the selector; it only wraps the rule, and a media query contributes zero specificity. So <code>md:flex</code> is exactly as weak as <code>flex</code>. The practical consequence is sharp: a hand-written rule like <code>.card .title</code> at 0,2,0 beats <code>md:flex</code> at every screen size while losing to <code>hover:flex</code> on the same element. When a responsive class does nothing at any breakpoint and a hover class beside it works, that asymmetry is the first thing to check — and it is invisible from the syntax.',
            'Đọc năm đầu ra: bốn cái đổi SELECTOR (nối thêm một lớp giả, thêm dấu kết hợp con cháu hoặc anh em, bọc trong <code>:is()</code> — mà <code>:is()</code> lấy độ đặc hiệu của đối số đặc hiệu nhất, nên <code>dark:</code> cũng ăn 0,2,0). Truy vấn media thì không đổi gì ở selector; nó chỉ bọc lấy quy tắc, và một truy vấn media đóng góp độ đặc hiệu bằng KHÔNG. Nên <code>md:flex</code> yếu đúng bằng <code>flex</code>. Hệ quả thực dụng rất sắc: một quy tắc viết tay kiểu <code>.card .title</code> ở mức 0,2,0 thắng <code>md:flex</code> ở MỌI cỡ màn hình mà vẫn thua <code>hover:flex</code> trên cùng thẻ đó. Khi một lớp đáp ứng chẳng làm gì ở mọi điểm ngắt trong khi lớp hover bên cạnh vẫn chạy, độ lệch ấy là thứ phải kiểm đầu tiên — và nhìn cú pháp thì không thấy được.',
          ),
        }),

        mcq({
          prompt: B(
            'One element carries an arbitrary variant and a breakpoint variant. This is the built output, with the line numbers the machine printed:' + code(
              '613:  @media (min-width: 768px) {\n' +
              '614:    .md\\:p-8 { padding: 2rem }\n' +
              '615:  }\n' +
              '632:  .\\[\\&\\>svg\\]\\:h-4>svg { height: 1rem }\n' +
              '636:  .\\[\\&_p\\]\\:mt-2 p { margin-top: 0.5rem }',
            ) + 'What do those positions and those selectors tell you?',
            'Một thẻ mang một biến thể tuỳ ý và một biến thể điểm ngắt. Đây là đầu ra đã dựng, kèm số dòng máy in ra:' + code(
              '613:  @media (min-width: 768px) {\n' +
              '614:    .md\\:p-8 { padding: 2rem }\n' +
              '615:  }\n' +
              '632:  .\\[\\&\\>svg\\]\\:h-4>svg { height: 1rem }\n' +
              '636:  .\\[\\&_p\\]\\:mt-2 p { margin-top: 0.5rem }',
            ) + 'Những vị trí và những selector ấy nói lên điều gì?',
          ),
          options: [
            B(
              'Arbitrary variants are emitted AFTER every media query, <code>&amp;</code> is the element itself, and <code>_</code> stands for a space — so these style CHILDREN, not the element',
              'Biến thể tuỳ ý được phát sinh SAU mọi truy vấn media, <code>&amp;</code> là chính thẻ mang lớp, và <code>_</code> thay cho dấu cách — nên chúng tạo kiểu cho thẻ CON chứ không cho chính thẻ đó',
            ),
            B(
              'The arbitrary variants come last because they are alphabetically last; renaming them to <code>[&amp;>a]</code> would move them before the media query',
              'Biến thể tuỳ ý xuống cuối vì chúng đứng cuối theo bảng chữ cái; đổi tên thành <code>[&amp;>a]</code> sẽ đẩy chúng lên trước truy vấn media',
            ),
            B(
              'They are emitted last because Tailwind cannot compute their specificity, so it defers them to a fallback block at the end of the file',
              'Chúng bị đẩy xuống cuối vì Tailwind không tính được độ đặc hiệu của chúng, nên nó dời sang một khối dự phòng ở cuối file',
            ),
            B(
              '<code>&amp;</code> is a placeholder for the child selector and <code>_</code> is a wildcard, so both rules style the element itself with a fallback for children',
              '<code>&amp;</code> là chỗ giữ chỗ cho selector con và <code>_</code> là ký tự đại diện, nên cả hai quy tắc tạo kiểu cho chính thẻ đó kèm phương án dự phòng cho các con',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Both facts come straight off the build. First the compilation: <code>&amp;</code> stands for the element carrying the class, exactly as in Sass, and everything after it is literal selector syntax — so <code>[&amp;>svg]:h-4</code> sets the height of a direct <code>&lt;svg&gt;</code> CHILD, not of the element. <code>_</code> is a space, because a real space would end the class attribute, so <code>[&amp;_p]:mt-2</code> becomes a descendant selector. Second the position: on 3.4.14 these land after every <code>@media</code> block in the file, so at equal specificity an arbitrary variant beats a responsive one. That is the completeness escape hatch for markup you do not author — markdown output, an icon library, a third-party widget. The trap is using it on markup you DO control: <code>[&amp;>div>span:nth-child(2)]:text-red-500</code> is legal, generated, and unreadable, and the class belongs on the element instead.',
            'Cả hai sự thật đều lấy thẳng từ bản dựng. Thứ nhất là phép biên dịch: <code>&amp;</code> đại diện cho chính thẻ mang lớp, y như trong Sass, và mọi thứ sau nó là cú pháp selector nguyên văn — nên <code>[&amp;>svg]:h-4</code> đặt chiều cao cho thẻ <code>&lt;svg&gt;</code> CON trực tiếp chứ không phải cho thẻ đó. <code>_</code> là dấu cách, vì một dấu cách thật sẽ kết thúc thuộc tính lớp, nên <code>[&amp;_p]:mt-2</code> thành một selector con cháu. Thứ hai là vị trí: trên 3.4.14 chúng rơi xuống SAU mọi khối <code>@media</code> trong file, nên ở cùng độ đặc hiệu thì một biến thể tuỳ ý thắng một biến thể đáp ứng. Đó là lối thoát làm cho utility CSS trở nên đầy đủ, dành cho mã đánh dấu bạn không viết ra — đầu ra markdown, một thư viện biểu tượng, một widget bên thứ ba. Cái bẫy là dùng nó lên mã bạn CÓ quyền sửa: <code>[&amp;>div>span:nth-child(2)]:text-red-500</code> hợp lệ, sinh ra được, và không đọc nổi — chỗ đúng của cái lớp ấy là ngay trên thẻ kia.',
          ),
        }),

        mcq({
          prompt: B(
            'A CSS-only floating label never activates. The build is clean and the rule <code>.peer:focus ~ .peer-focus\\:-top-2</code> is in the output.' + code(
              '<label class="peer-focus:-top-2 absolute top-3">Email</label>\n' +
              '<input class="peer" />',
            ),
            'Một nhãn nổi thuần CSS không bao giờ kích hoạt. Bản dựng sạch và quy tắc <code>.peer:focus ~ .peer-focus\\:-top-2</code> có trong đầu ra.' + code(
              '<label class="peer-focus:-top-2 absolute top-3">Email</label>\n' +
              '<input class="peer" />',
            ),
          ),
          options: [
            B(
              'The label needs <code>peer</code> too, because both ends of the pair must carry the marker class',
              'Cái nhãn cũng cần <code>peer</code>, vì cả hai đầu của cặp đều phải mang lớp đánh dấu',
            ),
            B(
              '<code>~</code> is the SUBSEQUENT-sibling combinator, so the peer must come BEFORE the styled element — put the input first and move the label visually',
              '<code>~</code> là dấu kết hợp anh em ĐỨNG SAU, nên cái peer phải nằm TRƯỚC thẻ được tạo kiểu — hãy đặt input lên trước rồi dời nhãn bằng định vị',
            ),
            B(
              '<code>peer-focus:</code> only works on form controls; a <code>&lt;label&gt;</code> must use <code>group-focus:</code> instead',
              '<code>peer-focus:</code> chỉ chạy trên phần tử biểu mẫu; một <code>&lt;label&gt;</code> phải dùng <code>group-focus:</code> thay thế',
            ),
            B(
              'The negative utility <code>-top-2</code> cannot be combined with a variant prefix, so the rule is emitted but never matched',
              'Tiện ích âm <code>-top-2</code> không kết hợp được với tiền tố biến thể, nên quy tắc được sinh ra mà không bao giờ khớp',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The generated selector is the whole answer, and it is worth reading it literally: <code>.peer:focus ~ .peer-focus\\:-top-2</code> matches an element with the variant class that is a LATER sibling of a focused <code>.peer</code>. Here the label is earlier, so nothing matches — valid CSS, emitted correctly, permanently inert. And this is not a Tailwind limitation: CSS has no previous-sibling combinator at all. That single fact explains why every floating-label implementation you will ever read puts the input first in the DOM and moves the label up with absolute positioning. It looks like an eccentric choice until you know what <code>~</code> can reach.',
            'Selector được phát sinh chính là toàn bộ câu trả lời, và nên đọc nó theo đúng nghĩa đen: <code>.peer:focus ~ .peer-focus\\:-top-2</code> khớp với một thẻ mang lớp biến thể và là anh em ĐỨNG SAU một <code>.peer</code> đang được focus. Ở đây cái nhãn đứng trước, nên chẳng khớp gì — CSS hợp lệ, sinh ra đúng, và bất động vĩnh viễn. Và đây không phải giới hạn của Tailwind: CSS hoàn toàn không có dấu kết hợp anh-em-đứng-trước. Riêng sự thật ấy giải thích vì sao mọi bản cài đặt nhãn nổi mà bạn từng đọc đều đặt input trước trong DOM rồi đẩy nhãn lên bằng định vị tuyệt đối. Nhìn thì tưởng một lựa chọn kỳ quặc, cho tới khi biết <code>~</code> với tới được những đâu.',
          ),
        }),

        mcq({
          prompt: B(
            'Someone writes both classes on the same element and reports that <code>group-hover:</code> is broken.' + code(
              '<div class="group group-hover:bg-slate-100">Hover me</div>',
            ) + 'What is actually happening?',
            'Có người viết cả hai lớp lên cùng một thẻ rồi báo rằng <code>group-hover:</code> bị hỏng.' + code(
              '<div class="group group-hover:bg-slate-100">Rê chuột vào tôi</div>',
            ) + 'Thực chất chuyện gì đang xảy ra?',
          ),
          options: [
            B(
              'The two classes cancel out: Tailwind detects the pair and skips the rule to avoid an infinite selector',
              'Hai lớp triệt tiêu nhau: Tailwind phát hiện cặp này rồi bỏ qua quy tắc để tránh một selector vô hạn',
            ),
            B(
              'It works, but only after the first hover, because the group state is initialised on the first pointer event',
              'Nó có chạy, nhưng chỉ sau lần rê chuột đầu tiên, vì trạng thái group được khởi tạo ở sự kiện con trỏ đầu tiên',
            ),
            B(
              'The selector is <code>.group:hover .group-hover\\:bg-slate-100</code> — a descendant space — so it asks the element to be its own ancestor, and nothing satisfies that',
              'Selector là <code>.group:hover .group-hover\\:bg-slate-100</code> — có dấu cách con cháu — nên nó đòi thẻ đó phải là tổ tiên của chính nó, và không gì thoả điều đó',
            ),
            B(
              'Nothing is wrong; the rule matches, and the missing background comes from <code>bg-slate-100</code> losing a conflict to Preflight',
              'Không có gì sai; quy tắc vẫn khớp, và cái nền bị thiếu là do <code>bg-slate-100</code> thua một cuộc xung đột với Preflight',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The space in the compiled selector is the entire story: it is a descendant combinator, so the two classes must be on DIFFERENT elements. Putting both on one asks for an element inside itself, which nothing in any document satisfies. The build succeeds, the rule is emitted, DevTools shows both classes on the element, and nothing ever happens — the same silent failure as forgetting <code>group</code> altogether, but harder to spot because the marker class is right there. The diagnostic is always the same: read the generated selector and ask which SECOND element it is waiting for. Related design point — a component using <code>group-hover:</code> has an invisible dependency on a parent it does not own, so either put <code>group</code> on the component\'s own root or write the requirement down.',
            'Dấu cách trong selector đã biên dịch là toàn bộ câu chuyện: đó là dấu kết hợp con cháu, nên hai lớp phải nằm trên HAI thẻ KHÁC NHAU. Đặt cả hai lên một thẻ là đòi một thẻ nằm bên trong chính nó, thứ không văn bản nào thoả được. Bản dựng vẫn thành công, quy tắc vẫn được sinh, DevTools vẫn thấy cả hai lớp trên thẻ, và chẳng bao giờ có gì xảy ra — vẫn kiểu hỏng im lặng như khi quên hẳn <code>group</code>, nhưng khó thấy hơn vì lớp đánh dấu nằm ngay đó. Phép chẩn luôn giống nhau: đọc selector được phát sinh rồi hỏi nó đang chờ THẺ THỨ HAI nào. Một ý về thiết kế đi kèm — component dùng <code>group-hover:</code> có một phụ thuộc vô hình vào thẻ cha mà nó không sở hữu, nên hoặc đặt <code>group</code> lên chính thẻ gốc của component, hoặc ghi rõ yêu cầu ấy ra.',
          ),
        }),

        mcq({
          prompt: B(
            'A card contains rows. Hovering anywhere on the card underlines every row at once. Both the card and each row carry <code>group</code>, and the rows use <code>group-hover:underline</code>. What is the fix?',
            'Một thẻ bài chứa nhiều hàng. Rê chuột vào bất cứ đâu trên thẻ bài là mọi hàng cùng gạch chân một lượt. Cả thẻ bài lẫn từng hàng đều mang <code>group</code>, và các hàng dùng <code>group-hover:underline</code>. Cách sửa là gì?',
          ),
          options: [
            B(
              'Remove <code>group</code> from the card; a group may only be declared once per component tree',
              'Bỏ <code>group</code> khỏi thẻ bài; mỗi cây component chỉ được khai báo một group',
            ),
            B(
              'Add <code>relative</code> to each row, which scopes the descendant selector to the nearest positioned ancestor',
              'Thêm <code>relative</code> vào từng hàng, thứ sẽ bó selector con cháu về tổ tiên được định vị gần nhất',
            ),
            B(
              'Swap to <code>peer</code>, whose sibling combinator cannot cross a nesting boundary',
              'Đổi sang <code>peer</code>, vì dấu kết hợp anh em của nó không vượt được ranh giới lồng nhau',
            ),
            B(
              'Name the groups: <code>group/row</code> on the row and <code>group-hover/row:underline</code> on the target, so the selector only pairs matching names',
              'Đặt tên cho group: <code>group/row</code> ở hàng và <code>group-hover/row:underline</code> ở thẻ đích, để selector chỉ ghép những cái cùng tên',
            ),
          ],
          correct: 3,
          explanation: EX(
            'An unnamed <code>group-hover:</code> compiles to <code>.group:hover .group-hover\\:underline</code>, which matches under ANY hovered ancestor with the class — so with nested groups the outer card triggers the inner rows too. The suffix becomes part of both class names: measured, <code>group/item</code> plus <code>group-hover/item:underline</code> compiles to <code>.group\\/item:hover .group-hover\\/item\\:underline</code>, and the same works for <code>peer\\/x</code>. Use names the moment groups nest, because the ambiguous version reads as "hover is broken" rather than as "my groups are ambiguous", which is a much longer debugging session.',
            'Một <code>group-hover:</code> không tên biên dịch thành <code>.group:hover .group-hover\\:underline</code>, thứ khớp dưới BẤT KỲ tổ tiên nào đang được rê chuột mà mang lớp ấy — nên với group lồng nhau thì thẻ bài ngoài kích hoạt luôn các hàng bên trong. Hậu tố trở thành một phần của cả hai tên lớp: đo thật, <code>group/item</code> cộng <code>group-hover/item:underline</code> biên dịch thành <code>.group\\/item:hover .group-hover\\/item\\:underline</code>, và <code>peer\\/x</code> cũng vậy. Hãy đặt tên ngay khi group bắt đầu lồng nhau, vì bản nhập nhằng đọc ra như "hover bị hỏng" chứ không phải "group của tôi nhập nhằng", và đó là một buổi gỡ lỗi dài hơn hẳn.',
          ),
        }),

        mcq({
          prompt: B(
            'These classes are built together and this is the real emit order, read out of the output file:' + code(
              '.p-1\n' +
              '@media not all and (min-width: 1024px)   { .max-lg\\:p-6 }\n' +
              '@media not all and (min-width: 768px)    { .max-md\\:p-7 }\n' +
              '@media (min-width: 768px) {\n' +
              '  .md\\:p-2\n' +
              '  @media not all and (min-width: 1024px) { .md\\:max-lg\\:p-5 }\n' +
              '}\n' +
              '@media (min-width: 1024px)               { .lg\\:p-3 }',
            ) + 'At a viewport of 800px, what is the padding, and which reading of the order is right?',
            'Các lớp này được dựng cùng nhau và đây là thứ tự phát sinh THẬT, đọc từ file đầu ra:' + code(
              '.p-1\n' +
              '@media not all and (min-width: 1024px)   { .max-lg\\:p-6 }\n' +
              '@media not all and (min-width: 768px)    { .max-md\\:p-7 }\n' +
              '@media (min-width: 768px) {\n' +
              '  .md\\:p-2\n' +
              '  @media not all and (min-width: 1024px) { .md\\:max-lg\\:p-5 }\n' +
              '}\n' +
              '@media (min-width: 1024px)               { .lg\\:p-3 }',
            ) + 'Ở viewport 800px thì padding bằng bao nhiêu, và cách đọc thứ tự nào là đúng?',
          ),
          options: [
            B(
              '1.25rem from <code>md:max-lg:p-5</code>: all <code>max-*</code> blocks are emitted BEFORE all <code>min-*</code> blocks, and the two-sided form nests inside the <code>md</code> block, so it lands last among the matching rules',
              '1,25rem từ <code>md:max-lg:p-5</code>: mọi khối <code>max-*</code> được sinh TRƯỚC mọi khối <code>min-*</code>, và dạng hai đầu nằm LỒNG trong khối <code>md</code>, nên nó rơi xuống cuối trong số các quy tắc khớp',
            ),
            B(
              '1.5rem from <code>max-lg:p-6</code>: a ceiling constraint is the more specific intent, so Tailwind gives <code>max-*</code> priority over <code>min-*</code>',
              '1,5rem từ <code>max-lg:p-6</code>: ràng buộc trần là ý định cụ thể hơn, nên Tailwind ưu tiên <code>max-*</code> hơn <code>min-*</code>',
            ),
            B(
              '0.5rem from <code>md:p-2</code>: nested media queries are not supported, so the inner block is discarded at build time',
              '0,5rem từ <code>md:p-2</code>: truy vấn media lồng nhau không được hỗ trợ, nên khối bên trong bị bỏ lúc dựng',
            ),
            B(
              '0.25rem from <code>p-1</code>: at 800px both a floor and a ceiling match, they cancel, and the unprefixed base value applies',
              '0,25rem từ <code>p-1</code>: ở 800px cả một sàn lẫn một trần cùng khớp, chúng triệt tiêu nhau, và giá trị nền không tiền tố được áp',
            ),
          ],
          correct: 0,
          explanation: EX(
            'At 800px the matching rules are <code>p-1</code>, <code>max-lg:p-6</code>, <code>md:p-2</code> and <code>md:max-lg:p-5</code> — four rules, all at 0,1,0, so the last one in the file wins, and the output above says that is <code>md:max-lg:p-5</code>. Two structural facts produce that layout. <code>min-*</code> queries are emitted ascending and <code>max-*</code> descending, each so the narrowest matching constraint lands last within its own family; and every <code>max-*</code> block sits before every <code>min-*</code> block, which is why a lone <code>max-lg:p-6</code> LOSES to <code>md:p-2</code> at 800px even though the ceiling looks like the more specific intent. The two-sided <code>md:max-lg:</code> form is the only reliable way to target a band, and it compiles to a genuine nested <code>@media</code>, not to two separate blocks you hope will combine. One more detail worth keeping: a ceiling compiles to <code>not all and (min-width: 1024px)</code> rather than <code>max-width: 1023px</code>, which sidesteps the fractional-pixel gap between the two.',
            'Ở 800px thì các quy tắc khớp là <code>p-1</code>, <code>max-lg:p-6</code>, <code>md:p-2</code> và <code>md:max-lg:p-5</code> — bốn quy tắc, đều 0,1,0, nên cái cuối cùng trong file thắng, và đầu ra trên nói đó là <code>md:max-lg:p-5</code>. Hai sự thật về cấu trúc tạo ra cách xếp ấy. Truy vấn <code>min-*</code> được sinh theo thứ tự TĂNG còn <code>max-*</code> theo thứ tự GIẢM, mỗi họ sắp sao cho ràng buộc hẹp nhất đang khớp rơi xuống cuối trong họ của mình; và mọi khối <code>max-*</code> nằm trước mọi khối <code>min-*</code>, nên một <code>max-lg:p-6</code> đứng riêng sẽ THUA <code>md:p-2</code> ở 800px dù cái trần trông có vẻ là ý định cụ thể hơn. Dạng hai đầu <code>md:max-lg:</code> là cách đáng tin duy nhất để nhắm vào một DẢI, và nó biên dịch ra một <code>@media</code> lồng nhau thật sự chứ không phải hai khối rời mà bạn hy vọng chúng sẽ kết hợp. Thêm một chi tiết đáng giữ: một cái trần biên dịch thành <code>not all and (min-width: 1024px)</code> chứ không phải <code>max-width: 1023px</code>, nhờ đó tránh được khe hở pixel lẻ giữa hai cách viết.',
          ),
        }),

        mcq({
          prompt: B(
            'In THIS repository you need a heading that is near-black in the light theme and near-white in the global dark theme. <code>CLAUDE.md</code> records why one of these is forbidden. Which approach is correct here?',
            'Trong CHÍNH kho này bạn cần một tiêu đề gần như đen ở theme sáng và gần như trắng ở theme tối toàn cục. <code>CLAUDE.md</code> ghi lại lý do một trong các cách sau bị cấm. Cách nào đúng ở đây?',
          ),
          options: [
            B(
              '<code>class="text-slate-900 dark:text-slate-50"</code> — the standard Tailwind idiom, and the one the config\'s <code>darkMode</code> setting exists to serve',
              '<code>class="text-slate-900 dark:text-slate-50"</code> — thành ngữ Tailwind chuẩn, và cũng là thứ mà thiết lập <code>darkMode</code> trong config sinh ra để phục vụ',
            ),
            B(
              'A theme CSS variable such as <code>text-text-primary</code>, or an <code>html.theme-dark …</code> rule — because <code>dark:</code> and the class <code>.dark</code> are RESERVED for the Notes wrapper',
              'Một biến CSS của theme, ví dụ <code>text-text-primary</code>, hoặc một quy tắc <code>html.theme-dark …</code> — vì <code>dark:</code> và lớp <code>.dark</code> được DÀNH RIÊNG cho khung Notes',
            ),
            B(
              'Put <code>.dark</code> on <code>&lt;html&gt;</code> from the global theme toggle and keep using <code>dark:</code>, which is what the class strategy is designed for',
              'Đặt <code>.dark</code> lên <code>&lt;html&gt;</code> từ công tắc theme toàn cục rồi cứ dùng <code>dark:</code>, đúng như chiến lược class được thiết kế để làm',
            ),
            B(
              'Switch the config to <code>darkMode: &quot;media&quot;</code> so the OS decides, which removes the class collision entirely',
              'Đổi config sang <code>darkMode: &quot;media&quot;</code> để hệ điều hành quyết định, nhờ đó xoá hẳn cuộc va chạm về tên lớp',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The mechanism is in the compiled selector. Under <code>darkMode: &quot;class&quot;</code> every <code>dark:</code> utility becomes <code>:is(.dark *)</code> — "any descendant of anything with class <code>dark</code>", with no scope limit at all. On 2026-07-02 the global theme put <code>.dark</code> on <code>&lt;html&gt;</code>, which made every element in the document a descendant of <code>.dark</code> and force-activated all 786 <code>dark:</code> utilities at once, including the 722 inside Notes that belonged to its own three-theme (light/dark/brown) switcher. The resolution was a naming fix, not a code fix: the global theme class is <code>theme-dark</code>, NEVER <code>dark</code>; <code>dark:</code> stays reserved for the Notes wrapper, where <code>NotesThemeProvider</code> puts <code>.dark</code> on <code>.notes-theme-root</code>; and global theme-dependent styles use <code>html.theme-dark …</code> CSS or the theme variables such as <code>var(--text-primary)</code>. Switching to <code>media</code> would be worse, not better — it removes the user\'s ability to override the OS in your own UI.',
            'Cơ chế nằm ngay trong selector đã biên dịch. Với <code>darkMode: &quot;class&quot;</code> thì mọi tiện ích <code>dark:</code> thành <code>:is(.dark *)</code> — "bất kỳ con cháu nào của bất kỳ thứ gì mang lớp <code>dark</code>", hoàn toàn không có giới hạn phạm vi. Ngày 02/07/2026 theme toàn cục đặt <code>.dark</code> lên <code>&lt;html&gt;</code>, thế là mọi thẻ trong tài liệu thành con cháu của <code>.dark</code> và toàn bộ 786 tiện ích <code>dark:</code> bật một lượt, kể cả 722 cái trong Notes vốn thuộc về công tắc ba theme (sáng/tối/nâu) của riêng nó. Cách giải quyết là một phép SỬA TÊN chứ không phải sửa mã: lớp theme tối toàn cục là <code>theme-dark</code>, KHÔNG BAO GIỜ là <code>dark</code>; <code>dark:</code> để dành cho khung Notes, nơi <code>NotesThemeProvider</code> đặt <code>.dark</code> lên <code>.notes-theme-root</code>; còn kiểu phụ thuộc theme ở tầm toàn cục thì dùng CSS <code>html.theme-dark …</code> hoặc các biến theme như <code>var(--text-primary)</code>. Đổi sang <code>media</code> còn tệ hơn chứ không tốt hơn — nó tước mất khả năng người dùng tự ghi đè hệ điều hành ngay trong giao diện của bạn.',
          ),
        }),

        mcq({
          prompt: B(
            'An accordion chevron uses <code>aria-expanded:rotate-180</code>, which compiles to <code>[aria-expanded=&quot;true&quot;]</code>. The panel opens and the chevron does not turn. What does that tell you, and why is it the point of the variant?',
            'Mũi tên của một accordion dùng <code>aria-expanded:rotate-180</code>, biên dịch thành <code>[aria-expanded=&quot;true&quot;]</code>. Bảng nội dung mở ra mà mũi tên không xoay. Điều đó cho bạn biết gì, và vì sao đó chính là mục đích của biến thể này?',
          ),
          options: [
            B(
              'The variant needs a transition utility to be visible; add <code>transition-transform</code> and the rotation appears',
              'Biến thể này cần một tiện ích chuyển tiếp mới thấy được; thêm <code>transition-transform</code> là phép xoay hiện ra',
            ),
            B(
              'The attribute selector only matches static HTML, so a React-controlled attribute needs <code>data-[state=open]:</code> instead',
              'Selector thuộc tính chỉ khớp HTML tĩnh, nên một thuộc tính do React điều khiển phải dùng <code>data-[state=open]:</code>',
            ),
            B(
              'The component never sets <code>aria-expanded="true"</code> — so a visual bug is announcing a real screen-reader bug, which is exactly why <code>aria-*</code> beats <code>data-*</code> when a real ARIA attribute exists',
              'Component không hề đặt <code>aria-expanded="true"</code> — nên một lỗi hình ảnh đang tố cáo một lỗi trình đọc màn hình thật, và đó chính là lý do <code>aria-*</code> hơn <code>data-*</code> khi đã có sẵn một thuộc tính ARIA thật',
            ),
            B(
              'ARIA variants are compiled but never matched in the browser, because ARIA attributes live in the accessibility tree rather than the DOM',
              'Biến thể ARIA có được biên dịch nhưng không bao giờ khớp trong trình duyệt, vì thuộc tính ARIA sống trong cây trợ năng chứ không phải DOM',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The selector is a plain attribute selector on a plain DOM attribute, so it matches whenever the attribute really says <code>&quot;true&quot;</code> and never otherwise. A chevron that will not turn is therefore proof that the accessibility state is missing or stale. That inversion is the whole argument for <code>aria-*</code> over <code>data-*</code>: with a data attribute you can ship a visually perfect, screen-reader-broken accordion, because the two states run alongside each other; drive the visual from the ARIA attribute and forgetting it produces an obvious visual bug. This is the rare case where the convenient path and the accessible path are the same path. Where no real ARIA attribute exists, <code>data-[state=open]:</code> is the right tool, and every headless library — Radix included, which this repo uses — already sets those for you.',
            'Selector ở đây là một selector thuộc tính thuần trên một thuộc tính DOM thuần, nên nó khớp đúng khi thuộc tính thật sự ghi <code>&quot;true&quot;</code> và không khớp trong mọi trường hợp khác. Vậy một mũi tên không chịu xoay chính là bằng chứng rằng trạng thái trợ năng đang thiếu hoặc đang cũ. Phép đảo ngược ấy là toàn bộ lý lẽ chọn <code>aria-*</code> thay vì <code>data-*</code>: với một thuộc tính data thì bạn hoàn toàn có thể xuất xưởng một accordion đẹp mắt mà hỏng với trình đọc màn hình, vì hai trạng thái chạy song song nhau; còn khi lấy thuộc tính ARIA làm nguồn cho phần nhìn thì quên nó đi là ra một lỗi hình ảnh lồ lộ. Đây là trường hợp hiếm hoi mà con đường tiện tay và con đường tiếp cận được là cùng một con đường. Chỗ nào không có thuộc tính ARIA thật thì <code>data-[state=open]:</code> mới là công cụ đúng, và mọi thư viện headless — kể cả Radix mà kho này dùng — đều đã đặt sẵn chúng cho bạn.',
          ),
        }),

        // ── Chương 3 — Xung đột ─────────────────────────────────────────
        mcq({
          prompt: B(
            'Written in this order, these two are emitted in this order:' + code(
              'source:  <button class="focus:p-3 hover:p-2">\n' +
              'output:  .hover\\:p-2:hover { padding: 0.5rem }\n' +
              '         .focus\\:p-3:focus { padding: 0.75rem }',
            ) + 'A user tabs to the button and then hovers it, so both states are active. What padding do they see?',
            'Viết theo thứ tự này, hai lớp được phát sinh theo thứ tự này:' + code(
              'nguồn:   <button class="focus:p-3 hover:p-2">\n' +
              'đầu ra:  .hover\\:p-2:hover { padding: 0.5rem }\n' +
              '         .focus\\:p-3:focus { padding: 0.75rem }',
            ) + 'Người dùng dùng phím Tab tới cái nút rồi rê chuột lên, nên cả hai trạng thái cùng đang bật. Họ thấy padding bằng bao nhiêu?',
          ),
          options: [
            B(
              '0.5rem — <code>hover:</code> is written last in the class attribute, and for equal specificity the last class written wins',
              '0,5rem — <code>hover:</code> được viết cuối trong thuộc tính lớp, và ở cùng độ đặc hiệu thì lớp viết cuối thắng',
            ),
            B(
              '0.5rem — pointer states outrank keyboard states in the cascade, so hover beats focus whenever both apply',
              '0,5rem — trạng thái con trỏ xếp trên trạng thái bàn phím trong cascade, nên hover thắng focus mỗi khi cả hai cùng áp',
            ),
            B(
              'Neither: two active pseudo-class variants of the same property cancel, and the element falls back to its unprefixed padding',
              'Không cái nào: hai biến thể lớp giả cùng thuộc tính đang bật sẽ triệt tiêu nhau, và thẻ rơi về padding không tiền tố của nó',
            ),
            B(
              '0.75rem — both score 0,2,0, so position in the OUTPUT file decides, and Tailwind emits <code>focus</code> after <code>hover</code> whatever you type',
              '0,75rem — cả hai đều 0,2,0, nên vị trí trong file ĐẦU RA quyết định, và Tailwind phát sinh <code>focus</code> sau <code>hover</code> bất kể bạn gõ thế nào',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Both compile to one class plus one pseudo-class, so both score 0,2,0 and neither can win on specificity — which throws the decision to source order in the stylesheet, and that order is Tailwind\'s. The measured variant sequence on 3.4.14 is: unprefixed, then <code>first</code>, <code>last</code>, <code>hover</code>, <code>focus</code>, <code>focus-visible</code>, <code>active</code>, <code>disabled</code>, <code>group-hover</code>. It is not alphabetical and it is not the order you typed; the build above shows <code>focus</code> after <code>hover</code> even though <code>focus:p-3</code> was written first. That is usually the behaviour you want — a focused control keeping its focus styling while the pointer passes over it — but it is a fact to read out of the file, not to guess. And note the general shape of chapter 3 here: same property, same scope, two utilities. That is a bug to resolve deliberately, not an override.',
            'Cả hai biên dịch thành một lớp cộng một lớp giả, nên cả hai đều 0,2,0 và không cái nào thắng được bằng độ đặc hiệu — thế là quyết định rơi về thứ tự nguồn trong bảng kiểu, mà thứ tự ấy là của Tailwind. Chuỗi biến thể đo được trên 3.4.14 là: không tiền tố, rồi <code>first</code>, <code>last</code>, <code>hover</code>, <code>focus</code>, <code>focus-visible</code>, <code>active</code>, <code>disabled</code>, <code>group-hover</code>. Nó không theo bảng chữ cái và cũng không theo thứ tự bạn gõ; bản dựng trên cho thấy <code>focus</code> nằm sau <code>hover</code> dù <code>focus:p-3</code> được viết trước. Thường thì đó đúng là hành vi bạn muốn — một điều khiển đang được focus giữ nguyên kiểu focus khi con trỏ lướt qua — nhưng đó là một sự thật phải đọc ra từ file chứ không phải để đoán. Và để ý hình dạng chung của chương 3 ở đây: cùng thuộc tính, cùng phạm vi, hai tiện ích. Đó là một con bọ cần giải quyết có chủ ý chứ không phải một phép ghi đè.',
          ),
        }),

        mcq({
          prompt: B(
            'The eleven-way <code>mt-*</code> collision is famous: written <code>mt-1 … mt-32</code>, the emitted order is lexicographic and <code>mt-8</code> wins. Now add one more class and rebuild:' + code(
              '<div class="mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32 mt-px"></div>',
            ),
            'Cuộc đụng độ mười một chiều của <code>mt-*</code> thì đã nổi tiếng: viết <code>mt-1 … mt-32</code>, thứ tự phát sinh là từ điển và <code>mt-8</code> thắng. Giờ thêm một lớp nữa rồi dựng lại:' + code(
              '<div class="mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32 mt-px"></div>',
            ),
          ),
          options: [
            B(
              '<code>mt-px</code> wins — 1px of margin — because "p" sorts after every digit, so it is now the last rule in the group',
              '<code>mt-px</code> thắng — 1px margin — vì "p" sắp sau mọi chữ số, nên bây giờ nó là quy tắc cuối cùng của nhóm',
            ),
            B(
              '<code>mt-8</code> still wins: named keys such as <code>px</code> are emitted in a separate earlier block from numeric keys',
              '<code>mt-8</code> vẫn thắng: các khoá có tên như <code>px</code> được sinh trong một khối riêng nằm trước khối khoá số',
            ),
            B(
              '<code>mt-32</code> wins: adding a non-numeric key makes Tailwind fall back to numeric sorting for the rest of the group',
              '<code>mt-32</code> thắng: thêm một khoá không phải số làm Tailwind lùi về phép sắp theo SỐ cho phần còn lại của nhóm',
            ),
            B(
              'The build fails: a spacing group may not mix the <code>px</code> literal with numeric keys on one element',
              'Bản dựng hỏng: một nhóm khoảng cách không được trộn từ khoá <code>px</code> với các khoá số trên cùng một thẻ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Rebuilt for real, the group comes out as <code>.mt-0.5 .mt-1 .mt-1.5 .mt-10 .mt-12 .mt-16 .mt-2 .mt-20 .mt-24 .mt-3 .mt-32 .mt-4 .mt-8 .mt-px</code> — plain string sort, and <code>p</code> is after every digit, so <code>mt-px</code> is last and wins with a majestic 1 pixel. This is the sharpest possible demonstration of why the within-group order must never be relied on: adding one more class changed the winner from 32px to 1px, and nothing about the intent changed. The sort is lexicographic because the scale mixes <code>px</code>, <code>0.5</code> and <code>32</code>, and string order is the only ordering defined over all of them. It is arbitrary from your point of view but perfectly deterministic, which is exactly what makes it look like intended behaviour. Two utilities of the same property at the same scope is a bug — and if the classes are composed at runtime, <code>cn()</code> is what turns it back into last-written-wins (<code>twMerge(&quot;mt-32 mt-px&quot;)</code> = <code>mt-px</code>, but <code>twMerge(&quot;mt-px mt-32&quot;)</code> = <code>mt-32</code>).',
            'Dựng lại thật thì cả nhóm đi ra là <code>.mt-0.5 .mt-1 .mt-1.5 .mt-10 .mt-12 .mt-16 .mt-2 .mt-20 .mt-24 .mt-3 .mt-32 .mt-4 .mt-8 .mt-px</code> — sắp chuỗi thuần, và <code>p</code> đứng sau mọi chữ số, nên <code>mt-px</code> nằm cuối và thắng với một pixel oai vệ. Đây là minh hoạ sắc nhất cho việc vì sao KHÔNG BAO GIỜ được dựa vào thứ tự trong một nhóm: thêm đúng một lớp nữa là kẻ thắng đổi từ 32px thành 1px, mà chẳng có ý định nào thay đổi cả. Phép sắp theo từ điển vì thang trộn lẫn <code>px</code>, <code>0.5</code> và <code>32</code>, và thứ tự chuỗi là thứ tự duy nhất định nghĩa được trên tất cả chúng. Nó tuỳ tiện dưới góc nhìn của bạn nhưng lại xác định hoàn hảo, và chính điều đó làm nó trông như hành vi cố ý. Hai tiện ích cùng thuộc tính ở cùng phạm vi là một con bọ — và nếu chuỗi lớp được ghép lúc chạy thì <code>cn()</code> mới là thứ trả nó về luật viết-cuối-thắng (<code>twMerge(&quot;mt-32 mt-px&quot;)</code> = <code>mt-px</code>, còn <code>twMerge(&quot;mt-px mt-32&quot;)</code> = <code>mt-32</code>).',
          ),
        }),

        mcq({
          prompt: B(
            'A component sets <code>text-sm</code> and a caller adds <code>text-[11px]</code>. Both reach the same element. Two mechanisms, two answers:' + code(
              'emit order:  .text-[11px]  .text-[13px]  .text-base  .text-sm\n' +
              'twMerge("text-sm text-[11px]")  ->  ?',
            ),
            'Một component đặt <code>text-sm</code> và người gọi thêm <code>text-[11px]</code>. Cả hai tới cùng một thẻ. Hai cơ chế, hai câu trả lời:' + code(
              'thứ tự phát sinh:  .text-[11px]  .text-[13px]  .text-base  .text-sm\n' +
              'twMerge("text-sm text-[11px]")  ->  ?',
            ),
          ),
          options: [
            B(
              'Raw string: <code>text-[11px]</code> renders, because an arbitrary value is always more specific than a scale value. Through <code>cn()</code>: the same',
              'Chuỗi thô: <code>text-[11px]</code> hiển thị, vì giá trị tuỳ ý luôn đặc hiệu hơn giá trị lấy từ thang. Qua <code>cn()</code>: y hệt',
            ),
            B(
              'Raw string: <code>text-sm</code> renders (14px), because <code>[</code> sorts before letters so <code>.text-sm</code> is emitted later. Through <code>cn()</code>: <code>text-[11px]</code>, because twMerge keeps the one written last',
              'Chuỗi thô: <code>text-sm</code> hiển thị (14px), vì <code>[</code> sắp trước chữ cái nên <code>.text-sm</code> được sinh muộn hơn. Qua <code>cn()</code>: <code>text-[11px]</code>, vì twMerge giữ cái viết sau cùng',
            ),
            B(
              'Both render: <code>text-sm</code> sets <code>font-size</code> and <code>text-[11px]</code> sets a separate custom property, so there is no conflict to resolve',
              'Cả hai cùng hiển thị: <code>text-sm</code> đặt <code>font-size</code> còn <code>text-[11px]</code> đặt một thuộc tính tuỳ chỉnh riêng, nên chẳng có xung đột nào để phân giải',
            ),
            B(
              'Raw string: <code>text-[11px]</code>. Through <code>cn()</code>: <code>text-sm</code>, because twMerge always prefers a named scale value over an arbitrary one',
              'Chuỗi thô: <code>text-[11px]</code>. Qua <code>cn()</code>: <code>text-sm</code>, vì twMerge luôn ưu tiên giá trị có tên trong thang hơn giá trị tuỳ ý',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Both halves are measured. The generator sorts the <code>text-*</code> font-size group as a plain string, and <code>[</code> (character 91) comes before <code>b</code> and <code>s</code>, so every bracketed value is emitted before every named one and <code>.text-sm</code> lands last — the caller\'s override loses, silently, and the element renders at 14px. <code>tailwind-merge</code> 2.5.4 knows both classes set <code>font-size</code> and keeps the last one written, giving <code>text-[11px]</code>. So routing the string through <code>cn()</code> does not merely tidy it: it CHANGES what the user sees, from 14px to 11px, and it changes it to the thing the caller asked for. That is the point of the merge — the <code>className</code> prop only keeps its promise if the component applies it last through <code>cn()</code>. Two details to keep separate: <code>text-sm</code> and <code>text-red-500</code> share a prefix but set different properties, and twMerge correctly keeps BOTH.',
            'Cả hai nửa đều đo được. Trình sinh sắp nhóm cỡ chữ <code>text-*</code> theo chuỗi thuần, mà <code>[</code> (ký tự 91) đứng trước <code>b</code> và <code>s</code>, nên mọi giá trị trong ngoặc vuông được sinh trước mọi giá trị có tên và <code>.text-sm</code> rơi xuống cuối — phép ghi đè của người gọi thua, im lặng, và thẻ hiển thị ở 14px. <code>tailwind-merge</code> 2.5.4 biết cả hai lớp cùng đặt <code>font-size</code> và giữ cái viết sau, cho ra <code>text-[11px]</code>. Vậy đưa chuỗi qua <code>cn()</code> không chỉ là dọn dẹp: nó ĐỔI thứ người dùng nhìn thấy, từ 14px thành 11px, và đổi thành đúng thứ người gọi yêu cầu. Đó mới là mục đích của phép hợp nhất — thuộc tính <code>className</code> chỉ giữ được lời hứa nếu component áp nó SAU CÙNG qua <code>cn()</code>. Hai chi tiết cần tách bạch: <code>text-sm</code> và <code>text-red-500</code> chung tiền tố nhưng đặt hai thuộc tính khác nhau, và twMerge giữ đúng CẢ HAI.',
          ),
        }),

        mcq({
          prompt: B(
            'The same two utilities, two paths to the DOM. What is the difference in what the user sees?' + code(
              'A:  <div class="px-4 p-8">          (a plain class attribute)\n' +
              'B:  <div className={cn("px-4", "p-8")}>   (cn = twMerge(clsx(...)))\n' +
              '\n' +
              'emit order:  .p-8   then   .px-4\n' +
              'twMerge("px-4 p-8")  ->  "p-8"',
            ),
            'Vẫn hai tiện ích ấy, hai đường tới DOM. Người dùng nhìn thấy khác nhau ở đâu?' + code(
              'A:  <div class="px-4 p-8">          (thuộc tính lớp thuần)\n' +
              'B:  <div className={cn("px-4", "p-8")}>   (cn = twMerge(clsx(...)))\n' +
              '\n' +
              'thứ tự phát sinh:  .p-8   rồi   .px-4\n' +
              'twMerge("px-4 p-8")  ->  "p-8"',
            ),
          ),
          options: [
            B(
              'No difference: <code>cn()</code> only removes redundant tokens from the string, and a removed token was never going to apply anyway',
              'Không khác gì: <code>cn()</code> chỉ bỏ những mẩu thừa khỏi chuỗi, mà mẩu bị bỏ thì vốn dĩ cũng không áp được',
            ),
            B(
              'A gives 2rem on all four sides and B gives 1rem on all four, because twMerge keeps the narrower utility',
              'A cho 2rem cả bốn cạnh còn B cho 1rem cả bốn, vì twMerge giữ lại tiện ích hẹp hơn',
            ),
            B(
              'A gives 1rem horizontally and 2rem vertically; B gives 2rem on all four sides — the merge deleted <code>px-4</code> as superseded by the later, broader <code>p-8</code>',
              'A cho 1rem theo chiều ngang và 2rem theo chiều dọc; B cho 2rem cả bốn cạnh — phép hợp nhất đã xoá <code>px-4</code> vì nó bị <code>p-8</code> rộng hơn và viết sau thay thế',
            ),
            B(
              'A is undefined behaviour that varies per build; B is deterministic, which is the only difference worth caring about',
              'A là hành vi không xác định, thay đổi theo mỗi lần dựng; B thì xác định, và đó là khác biệt duy nhất đáng quan tâm',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the case where the two mechanisms genuinely disagree, and it is worth knowing before you mass-migrate a codebase to <code>cn()</code>. Path A is the cascade: Tailwind emits the broad utility first and the axis utility second — <code>.p-8</code> then <code>.px-4</code> — so the narrower one wins on the horizontal axis only, leaving 1rem left/right and 2rem top/bottom. That is the designed semantic hierarchy (whole → axis → side) and it does what anyone would intend. Path B is <code>tailwind-merge</code>: it reads the string left to right, sees that the later <code>p-8</code> supersedes the earlier <code>px-4</code>, and drops <code>px-4</code> entirely, leaving 2rem everywhere. Note that the reverse order behaves differently again — <code>twMerge(&quot;p-8 px-4&quot;)</code> keeps BOTH, because there the narrower utility is the later one. The lesson is not "cn() is wrong"; it is that a merge implements last-written-wins, so with <code>cn()</code> the ORDER of your arguments starts to matter, exactly where a raw class attribute ignored it.',
            'Đây là trường hợp hai cơ chế thật sự bất đồng, và nên biết trước khi chuyển hàng loạt một kho mã sang <code>cn()</code>. Đường A là cascade: Tailwind sinh tiện ích rộng trước rồi tiện ích trục sau — <code>.p-8</code> rồi <code>.px-4</code> — nên cái hẹp hơn thắng CHỈ trên trục ngang, để lại 1rem trái/phải và 2rem trên/dưới. Đó là thứ bậc ngữ nghĩa được thiết kế (toàn phần → trục → cạnh) và nó làm đúng thứ ai cũng có ý định. Đường B là <code>tailwind-merge</code>: nó đọc chuỗi từ trái sang phải, thấy <code>p-8</code> đứng sau thay thế được <code>px-4</code> đứng trước, thế là xoá hẳn <code>px-4</code>, để lại 2rem khắp bốn cạnh. Lưu ý thứ tự ngược lại thì lại khác nữa — <code>twMerge(&quot;p-8 px-4&quot;)</code> giữ CẢ HAI, vì ở đó tiện ích hẹp hơn mới là cái đứng sau. Bài học không phải "cn() sai"; bài học là phép hợp nhất cài đặt luật viết-cuối-thắng, nên với <code>cn()</code> thì THỨ TỰ các đối số bắt đầu có ý nghĩa, đúng chỗ mà một thuộc tính lớp thô bỏ qua nó.',
          ),
        }),

        mcq({
          prompt: B(
            'An audit of this frontend counts 197 <code>cn()</code> calls, 633 template literals in <code>className</code> of which 631 contain a real <code>${…}</code>, and 62 components declaring a <code>className</code> prop. What does the resulting "76% unprotected" actually measure?',
            'Một đợt rà frontend này đếm được 197 lời gọi <code>cn()</code>, 633 chuỗi mẫu trong <code>className</code> mà 631 cái có nội suy <code>${…}</code> thật, và 62 component khai một thuộc tính <code>className</code>. Con số "76% không được bảo vệ" thật ra đo cái gì?',
          ),
          options: [
            B(
              '631 confirmed rendering bugs, one per interpolation, each of which a screenshot test would catch',
              '631 lỗi hiển thị đã xác nhận, mỗi chỗ nội suy một lỗi, và mỗi cái đều bị một bài kiểm ảnh chụp bắt được',
            ),
            B(
              'The share of the bundle that <code>tailwind-merge</code> would shrink, since unmerged strings ship duplicate class names',
              'Phần gói mã mà <code>tailwind-merge</code> sẽ làm nhỏ lại, vì chuỗi chưa hợp nhất còn mang theo tên lớp trùng lặp',
            ),
            B(
              'How much of the app is untyped, since a template literal in <code>className</code> defeats the TypeScript checker',
              'Phần ứng dụng chưa được gán kiểu, vì một chuỗi mẫu trong <code>className</code> vô hiệu hoá bộ kiểm kiểu TypeScript',
            ),
            B(
              'EXPOSURE, not defects: 631 places where a future edit adding a competing utility fails silently, with no build error, no lint error and no test failure',
              'PHƠI NHIỄM chứ không phải khiếm khuyết: 631 chỗ mà một lần sửa sau này thêm vào một tiện ích cạnh tranh sẽ hỏng im lặng, không lỗi dựng, không lỗi lint, không test nào trượt',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Most of those 631 interpolations append a class nothing else competes with, so they are fine today. What the number measures is how much of the codebase is one edit away from a failure with no signal: the template literal is valid TypeScript and valid JSX so <code>tsc</code> is happy; the conflict only exists after interpolation at runtime so <code>eslint-plugin-tailwindcss</code> is structurally unable to see it; the DOM renders exactly as written so the class IS on the element in DevTools; and it is intermittent by input, working for <code>mt-4</code> and failing for <code>px-8</code>. The 62 <code>className</code>-prop components are the priority because that is where a caller supplies a class the author never saw. The migration is unusually safe — replacing <code>`a b ${c}`</code> with <code>cn(&quot;a b&quot;, c)</code> is behaviour-preserving where no conflict exists and behaviour-CORRECTING where one does, so there is no case where the template literal was right.',
            'Phần lớn trong 631 chỗ nội suy ấy chỉ nối thêm một lớp mà chẳng có gì cạnh tranh, nên hôm nay chúng vẫn ổn. Cái con số ấy đo là bao nhiêu phần của kho mã chỉ cách một lần sửa nữa là hỏng mà không có tín hiệu nào: chuỗi mẫu là TypeScript hợp lệ và JSX hợp lệ nên <code>tsc</code> hài lòng; xung đột chỉ tồn tại SAU khi nội suy lúc chạy nên <code>eslint-plugin-tailwindcss</code> về mặt cấu trúc không thể thấy nó; DOM dựng ra đúng y như viết nên lớp VẪN nằm trên thẻ trong DevTools; và nó chập chờn theo đầu vào, chạy được với <code>mt-4</code> và hỏng với <code>px-8</code>. 62 component có thuộc tính <code>className</code> là ưu tiên số một, vì đó là chỗ người gọi đưa vào một lớp mà tác giả chưa từng thấy. Cuộc chuyển đổi này an toàn khác thường — thay <code>`a b ${c}`</code> bằng <code>cn(&quot;a b&quot;, c)</code> giữ nguyên hành vi ở chỗ không có xung đột và SỬA ĐÚNG hành vi ở chỗ có, nên không có trường hợp nào chuỗi mẫu là cái đúng.',
          ),
        }),

        mcq({
          prompt: B(
            'Four calls to <code>tailwind-merge</code> 2.5.4. Which set of results is the measured one?' + code(
              'twMerge("!p-8 p-2")            ->  ?\n' +
              'twMerge("hover:p-2 focus:p-3") ->  ?\n' +
              'twMerge("md:p-4 p-8")          ->  ?\n' +
              'twMerge("w-4 size-8")          ->  ?',
            ),
            'Bốn lời gọi <code>tailwind-merge</code> 2.5.4. Bộ kết quả nào là bộ ĐO ĐƯỢC?' + code(
              'twMerge("!p-8 p-2")            ->  ?\n' +
              'twMerge("hover:p-2 focus:p-3") ->  ?\n' +
              'twMerge("md:p-4 p-8")          ->  ?\n' +
              'twMerge("w-4 size-8")          ->  ?',
            ),
          ),
          options: [
            B(
              '<code>"!p-8 p-2"</code> · <code>"hover:p-2 focus:p-3"</code> · <code>"md:p-4 p-8"</code> · <code>"size-8"</code>',
              '<code>"!p-8 p-2"</code> · <code>"hover:p-2 focus:p-3"</code> · <code>"md:p-4 p-8"</code> · <code>"size-8"</code>',
            ),
            B(
              '<code>"p-2"</code> · <code>"focus:p-3"</code> · <code>"p-8"</code> · <code>"size-8"</code>',
              '<code>"p-2"</code> · <code>"focus:p-3"</code> · <code>"p-8"</code> · <code>"size-8"</code>',
            ),
            B(
              '<code>"!p-8"</code> · <code>"focus:p-3"</code> · <code>"md:p-4 p-8"</code> · <code>"w-4 size-8"</code>',
              '<code>"!p-8"</code> · <code>"focus:p-3"</code> · <code>"md:p-4 p-8"</code> · <code>"w-4 size-8"</code>',
            ),
            B(
              '<code>"p-2"</code> · <code>"hover:p-2 focus:p-3"</code> · <code>"p-8"</code> · <code>"w-4 size-8"</code>',
              '<code>"p-2"</code> · <code>"hover:p-2 focus:p-3"</code> · <code>"p-8"</code> · <code>"w-4 size-8"</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Three of the four keep both classes, and the reason is the same each time: <code>tailwind-merge</code> only discards a class when the two would set the same property IN THE SAME CONTEXT. An <code>!</code> modifier is a different context (it lands in a different cascade origin), <code>hover:</code> and <code>focus:</code> are different states, and <code>md:</code> applies at a different width — so in all three cases both classes can legitimately be live at once and dropping either would be wrong. Only <code>w-4 size-8</code> is a genuine collision, and the merge knows that <code>size</code> covers <code>w</code>, so it keeps the later one. This is why the library cannot be a regex over prefixes: it carries a real model of Tailwind\'s property taxonomy, which is also why it must be kept in step with your Tailwind version, and why custom utilities from a plugin are invisible to it until you register them with <code>extendTailwindMerge()</code>.',
            'Ba trong bốn trường hợp giữ lại cả hai lớp, và lý do lần nào cũng như nhau: <code>tailwind-merge</code> chỉ vứt bỏ một lớp khi hai lớp đặt cùng một thuộc tính TRONG CÙNG MỘT NGỮ CẢNH. Dấu <code>!</code> là một ngữ cảnh khác (nó rơi vào một cội cascade khác), <code>hover:</code> và <code>focus:</code> là hai trạng thái khác nhau, còn <code>md:</code> áp ở một bề ngang khác — nên cả ba trường hợp đều có thể có cả hai lớp cùng sống một cách chính đáng, và bỏ cái nào cũng sai. Chỉ <code>w-4 size-8</code> mới là đụng độ thật, và phép hợp nhất biết <code>size</code> bao trùm <code>w</code> nên nó giữ cái đứng sau. Đây là lý do thư viện này không thể chỉ là một regex trên tiền tố: nó mang theo một mô hình thật về phân loại thuộc tính của Tailwind, cũng là lý do nó phải đi cùng nhịp với phiên bản Tailwind của bạn, và là lý do các tiện ích tuỳ chỉnh từ plugin vô hình với nó cho tới khi bạn khai báo bằng <code>extendTailwindMerge()</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'This is the built output, in file order. The element carries both classes.' + code(
              '.\\!p-8 { padding: 2rem !important }\n' +
              '.p-2   { padding: 0.5rem }',
            ) + 'Chapter 3 says the later rule wins at equal specificity. <code>.p-2</code> is later. Which padding renders, and why is that consistent?',
            'Đây là đầu ra đã dựng, theo đúng thứ tự trong file. Thẻ mang cả hai lớp.' + code(
              '.\\!p-8 { padding: 2rem !important }\n' +
              '.p-2   { padding: 0.5rem }',
            ) + 'Chương 3 nói ở cùng độ đặc hiệu thì quy tắc đứng sau thắng. <code>.p-2</code> đứng sau. Padding nào được dựng, và vì sao điều đó vẫn nhất quán?',
          ),
          options: [
            B(
              '0.5rem: position always decides between two single-class selectors, and <code>!important</code> only matters against inline styles',
              '0,5rem: vị trí luôn quyết định giữa hai selector một lớp, còn <code>!important</code> chỉ có tác dụng khi đấu với inline style',
            ),
            B(
              '2rem: <code>!important</code> moves the declaration into a HIGHER CASCADE ORIGIN, which is resolved before specificity and order are ever consulted',
              '2rem: <code>!important</code> đẩy khai báo lên một CỘI CASCADE CAO HƠN, được phân giải trước khi độ đặc hiệu và thứ tự được đem ra xét',
            ),
            B(
              '2rem: the <code>!</code> prefix raises specificity to 1,0,0, which is the equivalent of adding an ID to the selector',
              '2rem: tiền tố <code>!</code> nâng độ đặc hiệu lên 1,0,0, tương đương thêm một ID vào selector',
            ),
            B(
              '0.5rem, and this is a known Tailwind bug: the generator should emit important utilities last but sorts them by name',
              '0,5rem, và đây là một lỗi đã biết của Tailwind: trình sinh đáng lẽ phải phát sinh tiện ích quan trọng ở cuối nhưng lại sắp chúng theo tên',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The output really is in that order — <code>.\\!p-8</code> comes before <code>.p-2</code> on 3.4.14 — and 2rem is what renders. There is no contradiction, because "later wins" is only the LAST tie-break in the cascade, and it is never reached here: the cascade compares origin first, then specificity, then order, and <code>!important</code> promotes the declaration to a higher origin that beats every normal declaration regardless of how specific or how late they are. Note what that also means: <code>!important</code> does NOT raise specificity, so the only thing that can beat it is another <code>!important</code> with higher specificity, and there is no rung above that. Note too that a utility emitting several declarations gets <code>!important</code> on all of them, and that the prefix goes after the variant — <code>hover:!text-red-500</code>, never <code>!hover:text-red-500</code>.',
            'Đầu ra đúng là theo thứ tự ấy — <code>.\\!p-8</code> nằm trước <code>.p-2</code> trên 3.4.14 — và 2rem mới là thứ được dựng. Không hề mâu thuẫn, vì "đứng sau thì thắng" chỉ là phép phân định CUỐI CÙNG trong cascade, và ở đây nó không bao giờ được dùng tới: cascade so cội trước, rồi mới tới độ đặc hiệu, rồi mới tới thứ tự, mà <code>!important</code> đẩy khai báo lên một cội cao hơn, thắng mọi khai báo thường bất kể chúng đặc hiệu tới đâu hay muộn tới đâu. Để ý điều đó còn có nghĩa: <code>!important</code> KHÔNG nâng độ đặc hiệu, nên thứ duy nhất thắng được nó là một <code>!important</code> khác có độ đặc hiệu cao hơn, và trên nấc đó thì hết thang. Cũng để ý một tiện ích sinh ra nhiều khai báo thì cả loạt đều được gắn <code>!important</code>, và tiền tố đứng SAU biến thể — <code>hover:!text-red-500</code>, không bao giờ là <code>!hover:text-red-500</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A team is fighting a large legacy stylesheet and proposes <code>important: true</code> in the Tailwind config, so that every utility is emitted with <code>!important</code>. When is that the right call, and what does it cost?',
            'Một đội đang vật lộn với một bảng kiểu cũ đồ sộ và đề nghị đặt <code>important: true</code> trong config Tailwind, để mọi tiện ích đều được sinh kèm <code>!important</code>. Khi nào đó là quyết định đúng, và cái giá là gì?',
          ),
          options: [
            B(
              'Always: it removes a whole class of conflicts, and <code>cn()</code> still resolves the rest at runtime, so nothing is lost',
              'Luôn luôn: nó xoá hẳn một lớp xung đột, và <code>cn()</code> vẫn phân giải phần còn lại lúc chạy, nên chẳng mất gì',
            ),
            B(
              'Never: Tailwind rejects the option outside a migration and the build fails with a configuration error',
              'Không bao giờ: Tailwind từ chối tuỳ chọn này ngoài bối cảnh chuyển đổi và bản dựng hỏng kèm lỗi cấu hình',
            ),
            B(
              'Only while incrementally adopting Tailwind inside an app whose legacy CSS cannot be removed — after that it makes every utility unoverridable, so component composition stops working',
              'Chỉ trong lúc đưa dần Tailwind vào một ứng dụng mà CSS cũ chưa gỡ bỏ được — sau đó nó làm mọi tiện ích không thể bị ghi đè, và việc soạn component ngừng hoạt động',
            ),
            B(
              'Whenever a project also uses <code>@layer components</code>, since layered rules would otherwise always lose to unlayered legacy CSS',
              'Bất cứ khi nào dự án cũng dùng <code>@layer components</code>, vì nếu không thì quy tắc trong layer luôn thua CSS cũ ngoài layer',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The option exists for exactly one scenario, and it is a real one: you are dropping Tailwind into an app with thousands of lines of legacy CSS you cannot delete this quarter, and you need utilities to win by default. Outside that migration it is a trap, because it removes the top rung of the ladder for everyone: once every utility carries <code>!important</code>, a caller\'s <code>className</code> can no longer override a component\'s own class (both are important, so specificity decides and they tie), variants stop composing cleanly, and the only remaining tool is an inline style. A narrower version of the same idea, <code>important: &quot;#app&quot;</code>, wraps every utility in an ID selector instead — it buys the same win against legacy CSS at 1,1,0 while leaving <code>!important</code> itself free as an escape hatch. Both are migration instruments. The ordinary ladder is: remove the conflict, merge with <code>cn()</code>, check the layer, and only then escalate on the single class that needs it.',
            'Tuỳ chọn này sinh ra cho đúng một tình huống, và tình huống ấy có thật: bạn đang thả Tailwind vào một ứng dụng có hàng nghìn dòng CSS cũ mà quý này chưa xoá được, và bạn cần tiện ích thắng theo mặc định. Ngoài cuộc chuyển đổi ấy thì nó là cái bẫy, vì nó rút mất nấc thang trên cùng của tất cả mọi người: khi mọi tiện ích đều mang <code>!important</code> thì <code>className</code> của người gọi không còn ghi đè nổi lớp của chính component (cả hai đều quan trọng, nên độ đặc hiệu quyết định và chúng hoà), biến thể thôi soạn được gọn gàng, và công cụ duy nhất còn lại là inline style. Một bản hẹp hơn của cùng ý tưởng, <code>important: &quot;#app&quot;</code>, bọc mọi tiện ích trong một selector ID — nó mua được đúng phần thắng trước CSS cũ ở mức 1,1,0 mà vẫn để <code>!important</code> tự do làm lối thoát. Cả hai đều là dụng cụ chuyển đổi. Cái thang thông thường là: bỏ xung đột đi, hợp nhất bằng <code>cn()</code>, kiểm layer, rồi mới leo thang trên đúng cái lớp cần tới.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q31 — Be the content scanner (Section 0).</b> Tailwind reads your source files as <b>text</b>: it never parses JavaScript, never evaluates an expression, and only emits a rule for a string it recognises as a utility. Implement that pipeline over plain data — no Tailwind, no libraries.</p>' +
            '<p>Two functions:</p>' +
            '<ul>' +
            '<li><code>khopGlob(duongDan, mau)</code> — does one path match one <code>content</code> glob? Support exactly three constructs: <code>**</code> spans any number of path segments <b>including none</b> (so <code>./src/**/*.tsx</code> matches <code>./src/a.tsx</code>), a single <code>*</code> matches any run of characters <b>within one segment</b> (never a <code>/</code>), and <code>{a,b,c}</code> is a one-of alternation. Everything else is literal.</li>' +
            '<li><code>sinhRa(files, globs, tuVung)</code> — the classes that end up in the built CSS, as a <b>sorted, de-duplicated</b> array. Skip any file no glob matches. In the files that survive, cut the text into candidate tokens: a candidate is a maximal run of the characters <code>A-Z a-z 0-9 : _ / [ ] ! . -</code> and nothing else. Keep a candidate only if it appears verbatim in <code>tuVung</code>, the list of names this build knows how to generate.</li>' +
            '</ul>' +
            '<p>The character rule is the whole exercise. It is why a class name inside a comment IS generated, and why <code>`text-${c}-500`</code> is not — the <code>$</code> and the braces split it into <code>text-</code> and <code>-500</code>, neither of which is a class.</p>' +
            '<p>Keep the given data and the printing loop exactly as they are, and do not <code>require</code> anything.</p>',

            '<p><b>Câu 31 — Hãy làm bộ quét nội dung (Mục 0).</b> Tailwind đọc file nguồn của bạn như <b>văn bản</b>: nó không hề phân tích JavaScript, không tính biểu thức nào, và chỉ sinh quy tắc cho chuỗi nào nó nhận ra là một tiện ích. Hãy cài đặt đúng dây chuyền ấy trên dữ liệu thuần — không Tailwind, không thư viện.</p>' +
            '<p>Hai hàm:</p>' +
            '<ul>' +
            '<li><code>khopGlob(duongDan, mau)</code> — một đường dẫn có khớp một glob <code>content</code> không? Chỉ cần đúng ba cấu trúc: <code>**</code> trải qua số đoạn đường dẫn bất kỳ, <b>kể cả không đoạn nào</b> (nên <code>./src/**/*.tsx</code> khớp <code>./src/a.tsx</code>), một dấu <code>*</code> đơn khớp chuỗi ký tự bất kỳ <b>trong MỘT đoạn</b> (không bao giờ nuốt <code>/</code>), và <code>{a,b,c}</code> là một phép chọn-một. Mọi thứ khác là nguyên văn.</li>' +
            '<li><code>sinhRa(files, globs, tuVung)</code> — những lớp thật sự có mặt trong CSS đầu ra, trả về mảng đã <b>sắp xếp và bỏ trùng</b>. Bỏ qua file nào không glob nào khớp. Trong những file còn lại, cắt văn bản thành các ứng viên: một ứng viên là một đoạn dài nhất gồm các ký tự <code>A-Z a-z 0-9 : _ / [ ] ! . -</code> và không gì khác. Chỉ giữ ứng viên nào xuất hiện nguyên văn trong <code>tuVung</code>, danh sách những cái tên mà bản dựng này biết cách sinh ra.</li>' +
            '</ul>' +
            '<p>Luật về tập ký tự chính là toàn bộ bài tập. Nó là lý do một tên lớp nằm trong chú thích VẪN được sinh, và là lý do <code>`text-${c}-500`</code> thì không — dấu <code>$</code> và cặp ngoặc nhọn cắt nó thành <code>text-</code> với <code>-500</code>, chẳng mẩu nào là một lớp.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và không <code>require</code> thứ gì.</p>',
          ),
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const GLOBS = [\n' +
            "  './src/app/**/*.{js,ts,jsx,tsx}',\n" +
            "  './src/components/**/*.tsx',\n" +
            '];\n\n' +
            'const FILES = [\n' +
            '  {\n' +
            "    path: './src/app/page.tsx',\n" +
            '    text: [\n' +
            '      "// keep: mt-9",\n' +
            '      "const dead = \'text-3xl\';",\n' +
            '      "const cls = ok ? \'text-green-500\' : \'text-red-500\';",\n' +
            '      "export const A = () => <div className={`text-${c}-500 mt-4`} />;",\n' +
            '      "export const B = () => <div className={\'px-\' + n} />;",\n' +
            '      "/* rounded-3xl */",\n' +
            "    ].join('\\n'),\n" +
            '  },\n' +
            '  {\n' +
            "    path: './src/components/Card.tsx',\n" +
            '    text: \'<div className="p-4 mt-0.5 hover:mt-0.5 text-[11px] p-4" />\',\n' +
            '  },\n' +
            "  { path: './src/lib/utils.ts',    text: 'export const pad = \"p-96\";' },\n" +
            "  { path: './scripts/seed.mjs',    text: 'const banner = \"bg-red-500 mt-9\";' },\n" +
            "  { path: './src/app/api/route.ts', text: 'const x = \"gap-7\"; const y = \"gap-13\";' },\n" +
            '];\n\n' +
            '// Những tên mà bản dựng này biết sinh ra. `text-500` và `px-4` là mồi:\n' +
            '// chúng CÓ trong từ vựng, nhưng không nguồn nào chứa chúng nguyên văn.\n' +
            'const TU_VUNG = [\n' +
            "  'mt-4', 'mt-9', 'mt-0.5', 'hover:mt-0.5', 'text-3xl', 'text-green-500',\n" +
            "  'text-red-500', 'text-[11px]', 'rounded-3xl', 'p-4', 'p-96', 'gap-7',\n" +
            "  'bg-red-500', 'px-4', 'text-500',\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function khopGlob(duongDan, mau) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function sinhRa(files, globs, tuVung) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const f of FILES) {\n' +
            "  console.log((GLOBS.some((g) => khopGlob(f.path, g)) ? 'QUET  ' : 'BO QUA') + ' ' + f.path);\n" +
            '}\n' +
            "console.log('sinh ra      : ' + JSON.stringify(sinhRa(FILES, GLOBS, TU_VUNG)));\n" +
            "console.log('chi Card     : ' + JSON.stringify(sinhRa([FILES[1]], GLOBS, TU_VUNG)));\n" +
            "console.log('them glob lib: ' + JSON.stringify(sinhRa(FILES, [...GLOBS, './src/lib/*.ts'], TU_VUNG)));\n" +
            "console.log('glob rong    : ' + JSON.stringify(sinhRa(FILES, ['./**/*.{ts,tsx,mjs}'], TU_VUNG)));\n",
          expectedOutput:
            'QUET   ./src/app/page.tsx\n' +
            'QUET   ./src/components/Card.tsx\n' +
            'BO QUA ./src/lib/utils.ts\n' +
            'BO QUA ./scripts/seed.mjs\n' +
            'QUET   ./src/app/api/route.ts\n' +
            'sinh ra      : ["gap-7","hover:mt-0.5","mt-0.5","mt-4","mt-9","p-4","rounded-3xl","text-3xl","text-[11px]","text-green-500","text-red-500"]\n' +
            'chi Card     : ["hover:mt-0.5","mt-0.5","p-4","text-[11px]"]\n' +
            'them glob lib: ["gap-7","hover:mt-0.5","mt-0.5","mt-4","mt-9","p-4","p-96","rounded-3xl","text-3xl","text-[11px]","text-green-500","text-red-500"]\n' +
            'glob rong    : ["bg-red-500","gap-7","hover:mt-0.5","mt-0.5","mt-4","mt-9","p-4","p-96","rounded-3xl","text-3xl","text-[11px]","text-green-500","text-red-500"]',
          sampleSolution:
            'function khopGlob(duongDan, mau) {\n' +
            "  const thoat = (s) => s.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');\n" +
            "  let re = '^';\n" +
            '  for (let i = 0; i < mau.length; i++) {\n' +
            '    const ch = mau[i];\n' +
            "    if (ch === '*') {\n" +
            "      if (mau[i + 1] === '*') {\n" +
            '        i++;\n' +
            '        // `**/` phải nuốt được CẢ trường hợp không có đoạn nào,\n' +
            "        // nên dấu `/` đi sau nó là tuỳ chọn: './src/**/*.tsx' khớp './src/a.tsx'.\n" +
            "        if (mau[i + 1] === '/') { i++; re += '(?:.*/)?'; } else re += '.*';\n" +
            "      } else re += '[^/]*';\n" +
            "    } else if (ch === '{') {\n" +
            "      const dong = mau.indexOf('}', i);\n" +
            "      re += '(?:' + mau.slice(i + 1, dong).split(',').map(thoat).join('|') + ')';\n" +
            '      i = dong;\n' +
            '    } else {\n' +
            '      re += thoat(ch);\n' +
            '    }\n' +
            '  }\n' +
            "  return new RegExp(re + '$').test(duongDan);\n" +
            '}\n\n' +
            'function sinhRa(files, globs, tuVung) {\n' +
            '  const von = new Set(tuVung);\n' +
            '  const ra = new Set();\n' +
            '  for (const f of files) {\n' +
            '    if (!globs.some((g) => khopGlob(f.path, g))) continue;\n' +
            '    // Bộ quét đọc VĂN BẢN: nó không biết đâu là chú thích, đâu là mã sống.\n' +
            '    for (const t of f.text.match(/[A-Za-z0-9:_/[\\]!.-]+/g) ?? []) {\n' +
            '      if (von.has(t)) ra.add(t);\n' +
            '    }\n' +
            '  }\n' +
            '  return [...ra].sort();\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q32 — Emit order, and who actually wins (chapters 2 and 3).</b> The class attribute is an unordered set of references; the winner is decided by the order Tailwind wrote the rules, corrected by specificity and by <code>!important</code>. Implement that decision procedure. The three tables it needs are given to you, and every one of them was read out of a real 3.4.14 build.</p>' +
            '<p><code>sapXep(danhSach)</code> — return the classes in the order Tailwind emits them. Sort on three keys in this order:</p>' +
            '<ol>' +
            '<li><b>variant</b>, by its position in <code>THU_TU_BIEN_THE</code> (the unprefixed class has variant <code>&quot;&quot;</code> and comes first). The variant is everything before the last <code>:</code>.</li>' +
            '<li><b>utility group</b>, by its position in <code>NHOM</code>. The group is the class name up to its last <code>-</code>, after stripping the variant and any leading <code>!</code>.</li>' +
            '<li>the stripped class name, compared as a plain <b>string</b> — which is why <code>mt-10</code> comes before <code>mt-2</code>.</li>' +
            '</ol>' +
            '<p><code>aiThang(danhSach, boiCanh)</code> — the class that finally applies to each CSS long-hand property, as an object with the property names <b>sorted</b>. Steps:</p>' +
            '<ul>' +
            '<li>Drop any class whose variant is not live in <code>boiCanh</code>: a pseudo-class variant is live when its name is in <code>boiCanh.trangThai</code>; <code>motion-reduce</code> when <code>boiCanh.giamChuyenDong</code>; <code>print</code> when <code>boiCanh.inGiay</code>; a breakpoint when <code>boiCanh.rongMan</code> (default 0) is <b>at least</b> its width in <code>BE_RONG</code>. The unprefixed class is always live.</li>' +
            '<li>Give each survivor a tier: <b>3</b> if it carries <code>!</code> (a higher cascade origin), <b>2</b> if its variant is in <code>LOP_GIA</code> (0,2,0), otherwise <b>1</b> — a media query adds no specificity.</li>' +
            '<li>For every property the class\'s group sets, the higher tier wins; on a tie, the one later in <code>sapXep</code> order wins.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing loop exactly as they are, and do not <code>require</code> anything.</p>',

            '<p><b>Câu 32 — Thứ tự phát sinh, và ai thật sự thắng (chương 2 và 3).</b> Thuộc tính lớp là một TẬP tham chiếu không thứ tự; kẻ thắng do thứ tự Tailwind ghi các quy tắc quyết định, có hiệu chỉnh bởi độ đặc hiệu và bởi <code>!important</code>. Hãy cài đặt đúng thủ tục quyết định ấy. Ba cái bảng nó cần đã cho sẵn, và cả ba đều đọc ra từ một bản dựng 3.4.14 thật.</p>' +
            '<p><code>sapXep(danhSach)</code> — trả về các lớp theo đúng thứ tự Tailwind phát sinh. Sắp theo ba khoá, đúng thứ tự này:</p>' +
            '<ol>' +
            '<li><b>biến thể</b>, theo vị trí trong <code>THU_TU_BIEN_THE</code> (lớp không tiền tố có biến thể <code>&quot;&quot;</code> và đứng đầu). Biến thể là toàn bộ phần trước dấu <code>:</code> cuối cùng.</li>' +
            '<li><b>nhóm tiện ích</b>, theo vị trí trong <code>NHOM</code>. Nhóm là tên lớp tính tới dấu <code>-</code> cuối cùng, sau khi đã bỏ biến thể và bỏ dấu <code>!</code> đứng đầu nếu có.</li>' +
            '<li>tên lớp đã bỏ tiền tố, so sánh như một <b>chuỗi</b> thuần — và đó là lý do <code>mt-10</code> đứng trước <code>mt-2</code>.</li>' +
            '</ol>' +
            '<p><code>aiThang(danhSach, boiCanh)</code> — lớp cuối cùng có tác dụng lên từng thuộc tính CSS dạng dài, trả về một object có tên thuộc tính đã <b>sắp xếp</b>. Các bước:</p>' +
            '<ul>' +
            '<li>Bỏ mọi lớp có biến thể không SỐNG trong <code>boiCanh</code>: biến thể lớp giả sống khi tên nó nằm trong <code>boiCanh.trangThai</code>; <code>motion-reduce</code> khi <code>boiCanh.giamChuyenDong</code>; <code>print</code> khi <code>boiCanh.inGiay</code>; một điểm ngắt khi <code>boiCanh.rongMan</code> (mặc định 0) <b>lớn hơn hoặc bằng</b> bề ngang của nó trong <code>BE_RONG</code>. Lớp không tiền tố thì luôn sống.</li>' +
            '<li>Gán cho mỗi lớp còn sống một BẬC: <b>3</b> nếu nó mang <code>!</code> (một cội cascade cao hơn), <b>2</b> nếu biến thể của nó nằm trong <code>LOP_GIA</code> (0,2,0), còn lại là <b>1</b> — truy vấn media không thêm độ đặc hiệu nào.</li>' +
            '<li>Với mỗi thuộc tính mà nhóm của lớp đó đặt, bậc cao hơn thắng; hoà bậc thì cái đứng sau trong thứ tự <code>sapXep</code> thắng.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và không <code>require</code> thứ gì.</p>',
          ),
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// Thứ tự BIẾN THỂ mà Tailwind 3.4.14 phát sinh (đo thật trên bản dựng).\n' +
            'const THU_TU_BIEN_THE = [\n' +
            "  '', 'first', 'last', 'hover', 'focus', 'focus-visible', 'active', 'disabled',\n" +
            "  'motion-reduce', 'sm', 'md', 'lg', 'xl', '2xl', 'print',\n" +
            '];\n' +
            '// Biến thể nào là LỚP GIẢ (0,2,0). Phần còn lại là truy vấn @media (0,1,0).\n' +
            "const LOP_GIA = ['first', 'last', 'hover', 'focus', 'focus-visible', 'active', 'disabled'];\n" +
            '// Thứ tự NHÓM tiện ích, và các thuộc tính CSS dạng dài mà mỗi nhóm đặt.\n' +
            'const NHOM = [\n' +
            "  ['m',  ['margin-top', 'margin-right', 'margin-bottom', 'margin-left']],\n" +
            "  ['mx', ['margin-left', 'margin-right']],\n" +
            "  ['my', ['margin-top', 'margin-bottom']],\n" +
            "  ['mb', ['margin-bottom']],\n" +
            "  ['ml', ['margin-left']],\n" +
            "  ['mr', ['margin-right']],\n" +
            "  ['mt', ['margin-top']],\n" +
            "  ['p',  ['padding-top', 'padding-right', 'padding-bottom', 'padding-left']],\n" +
            "  ['px', ['padding-left', 'padding-right']],\n" +
            "  ['py', ['padding-top', 'padding-bottom']],\n" +
            "  ['pb', ['padding-bottom']],\n" +
            "  ['pl', ['padding-left']],\n" +
            "  ['pr', ['padding-right']],\n" +
            "  ['pt', ['padding-top']],\n" +
            '];\n' +
            "const BE_RONG = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };\n\n" +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function sapXep(danhSach) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function aiThang(danhSach, boiCanh) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const CA = [\n' +
            "  [['mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-8', 'mt-10', 'mt-12', 'mt-16', 'mt-20', 'mt-24', 'mt-32'], {}],\n" +
            "  [['mt-32', 'mt-px', 'mt-0.5'], {}],\n" +
            "  [['px-4', 'p-8'], {}],\n" +
            "  [['p-8', 'px-4'], {}],\n" +
            "  [['p-2', 'md:p-9'], { rongMan: 900 }],\n" +
            "  [['p-2', 'md:p-9'], { rongMan: 700 }],\n" +
            "  [['hover:p-2', 'md:p-9'], { rongMan: 900, trangThai: ['hover'] }],\n" +
            "  [['hover:p-2', 'focus:p-3'], { trangThai: ['hover', 'focus'] }],\n" +
            "  [['!p-8', 'p-2', 'lg:p-1'], { rongMan: 1400 }],\n" +
            "  [['m-2', 'mx-3', 'my-4', 'ml-5', 'mt-1'], {}],\n" +
            '];\n' +
            'for (const [lop, bc] of CA) {\n' +
            "  console.log('sap  : ' + sapXep(lop).join(' '));\n" +
            "  console.log('thang: ' + JSON.stringify(aiThang(lop, bc)));\n" +
            '}\n',
          expectedOutput:
            'sap  : mt-1 mt-10 mt-12 mt-16 mt-2 mt-20 mt-24 mt-3 mt-32 mt-4 mt-8\n' +
            'thang: {"margin-top":"mt-8"}\n' +
            'sap  : mt-0.5 mt-32 mt-px\n' +
            'thang: {"margin-top":"mt-px"}\n' +
            'sap  : p-8 px-4\n' +
            'thang: {"padding-bottom":"p-8","padding-left":"px-4","padding-right":"px-4","padding-top":"p-8"}\n' +
            'sap  : p-8 px-4\n' +
            'thang: {"padding-bottom":"p-8","padding-left":"px-4","padding-right":"px-4","padding-top":"p-8"}\n' +
            'sap  : p-2 md:p-9\n' +
            'thang: {"padding-bottom":"md:p-9","padding-left":"md:p-9","padding-right":"md:p-9","padding-top":"md:p-9"}\n' +
            'sap  : p-2 md:p-9\n' +
            'thang: {"padding-bottom":"p-2","padding-left":"p-2","padding-right":"p-2","padding-top":"p-2"}\n' +
            'sap  : hover:p-2 md:p-9\n' +
            'thang: {"padding-bottom":"hover:p-2","padding-left":"hover:p-2","padding-right":"hover:p-2","padding-top":"hover:p-2"}\n' +
            'sap  : hover:p-2 focus:p-3\n' +
            'thang: {"padding-bottom":"focus:p-3","padding-left":"focus:p-3","padding-right":"focus:p-3","padding-top":"focus:p-3"}\n' +
            'sap  : p-2 !p-8 lg:p-1\n' +
            'thang: {"padding-bottom":"!p-8","padding-left":"!p-8","padding-right":"!p-8","padding-top":"!p-8"}\n' +
            'sap  : m-2 mx-3 my-4 ml-5 mt-1\n' +
            'thang: {"margin-bottom":"my-4","margin-left":"ml-5","margin-right":"mx-3","margin-top":"mt-1"}',
          sampleSolution:
            'function tach(lop) {\n' +
            "  const i = lop.lastIndexOf(':');\n" +
            "  const bienThe = i < 0 ? '' : lop.slice(0, i);\n" +
            '  let goc = i < 0 ? lop : lop.slice(i + 1);\n' +
            '  let quanTrong = false;\n' +
            "  if (goc.startsWith('!')) { quanTrong = true; goc = goc.slice(1); }\n" +
            "  return { lop, bienThe, goc, quanTrong, nhom: goc.slice(0, goc.lastIndexOf('-')) };\n" +
            '}\n\n' +
            'function sapXep(danhSach) {\n' +
            '  const rankBT = (v) => THU_TU_BIEN_THE.indexOf(v);\n' +
            '  const rankN = (n) => NHOM.findIndex(([k]) => k === n);\n' +
            '  return [...danhSach].sort((a, b) => {\n' +
            '    const A = tach(a), B = tach(b);\n' +
            '    if (rankBT(A.bienThe) !== rankBT(B.bienThe)) return rankBT(A.bienThe) - rankBT(B.bienThe);\n' +
            '    if (rankN(A.nhom) !== rankN(B.nhom)) return rankN(A.nhom) - rankN(B.nhom);\n' +
            '    // Trong một nhóm: sắp theo CHUỖI, không theo SỐ. Đây là chỗ mt-8 thắng mt-32.\n' +
            '    return A.goc < B.goc ? -1 : A.goc > B.goc ? 1 : 0;\n' +
            '  });\n' +
            '}\n\n' +
            'function aiThang(danhSach, boiCanh) {\n' +
            '  const trangThai = new Set(boiCanh.trangThai ?? []);\n' +
            '  const rong = boiCanh.rongMan ?? 0;\n' +
            '  const song = (v) => {\n' +
            "    if (v === '') return true;\n" +
            '    if (LOP_GIA.includes(v)) return trangThai.has(v);\n' +
            "    if (v === 'motion-reduce') return Boolean(boiCanh.giamChuyenDong);\n" +
            "    if (v === 'print') return Boolean(boiCanh.inGiay);\n" +
            '    return rong >= BE_RONG[v];\n' +
            '  };\n' +
            '  // Bậc 3 = cội cascade cao hơn (!important), 2 = 0,2,0, 1 = 0,1,0.\n' +
            '  const bac = (t) => (t.quanTrong ? 3 : LOP_GIA.includes(t.bienThe) ? 2 : 1);\n\n' +
            '  const ket = {};\n' +
            '  const conSong = sapXep(danhSach).map(tach).filter((t) => song(t.bienThe));\n' +
            '  for (const [i, t] of conSong.entries()) {\n' +
            '    const nhom = NHOM.find(([k]) => k === t.nhom);\n' +
            '    if (!nhom) continue;\n' +
            '    for (const prop of nhom[1]) {\n' +
            '      const cu = ket[prop];\n' +
            '      if (!cu || bac(t) > cu.bac || (bac(t) === cu.bac && i > cu.i)) {\n' +
            '        ket[prop] = { lop: t.lop, bac: bac(t), i };\n' +
            '      }\n' +
            '    }\n' +
            '  }\n' +
            '  return Object.fromEntries(Object.keys(ket).sort().map((k) => [k, ket[k].lop]));\n' +
            '}\n',
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
