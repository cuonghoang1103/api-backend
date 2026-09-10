/**
 * Tailwind CSS — Progress Test 2 (Chương 4 → Chương 7).
 *
 * Đề tự soạn, bám sát `content/courses/tailwind-css/s04-component.mjs`,
 * `s05-cau-hinh.mjs`, `s06-bien-css.mjs`, `s07-layer.mjs`.
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ PHIÊN BẢN: **Tailwind CSS 3.4.14 — v3, KHÔNG phải v4.**
 * ────────────────────────────────────────────────────────────────────────────
 * `frontend/package.json:108` ghi `"tailwindcss": "^3.4.14"`; hộp cát đo đề này
 * cài đúng `tailwindcss@3.4.14` và in ra `3.4.14`. Mọi đáp án là hành vi của
 * v3: `tailwind.config.js` + ba chỉ thị `@tailwind`, `@layer` là chỉ thị DI DỜI
 * lúc dựng (bị xoá khỏi đầu ra), và `<alpha-value>` là cách duy nhất cho bổ từ
 * độ mờ trên màu biến. v4 (`@theme`, `@import "tailwindcss"`, `@layer` thật
 * trong đầu ra, `color-mix()`) chỉ được nhắc như DẤU HIỆU PHÂN BIỆT.
 *
 * ⚠️ MỌI SỐ ĐO ĐỀU LẤY TỪ MÁY. Hộp cát NGOÀI kho api-backend
 * (`scratchpad/tailwind-pt/lab`); không gói nào thêm vào `package.json` của
 * kho. Dựng bằng `./node_modules/.bin/tailwindcss -c <config> -i in.css -o
 * out.css` rồi ĐỌC `out.css`. Đã chạy thật và trở thành đáp án:
 *   • `@apply btn hover:bg-blue-700 md:px-10` CHẠY ĐƯỢC và tách thành BA quy
 *     tắc — `.btn-hov` (dòng 581), `.btn-hov:hover` (593) và
 *     `@media (min-width:768px){ .btn-hov }` (598) — tất cả nằm TRƯỚC `.p-4`
 *     (605), nên một `p-4` trơn THẮNG cái `md:px-10` bên trong `@apply`;
 *   • `.btn-lg { @apply btn px-8 }` chép 7 trong 9 khai báo của `.btn`;
 *   • `grep -c '@layer' out.css` → **0**;
 *   • CSS tuỳ biến viết TRƯỚC ba chỉ thị: `.unlayered` ở dòng **1**, `.p-4` ở
 *     561 ⇒ tiện ích THẮNG. Cùng vị trí ấy nhưng bọc `@layer utilities` thì
 *     quy tắc bị DI DỜI xuống dòng **565** ⇒ nó THẮNG;
 *   • viết SAU ba chỉ thị: `.p-4` 557 · `.inlayer` 561 · `.unlayered` 565;
 *   • `@tailwind base` một mình: **555 dòng, 41 quy tắc**;
 *     `corePlugins: { preflight: false }` vẫn cho ra **111 dòng** (khối biến
 *     `*, ::before, ::after`), chứ không phải 0;
 *   • `theme.spacing` (ngoài extend) chỉ thay khoá `spacing` — `text-red-500`
 *     và cả 27 họ màu VẪN SỐNG, chỉ `p-4` chết;
 *   • màu: `#123456` → `--tw-bg-opacity: 1; background-color: rgb(18 52 86 /
 *     var(--tw-bg-opacity))`, `/50` → `rgb(18 52 86 / 0.5)`, `/5` → `0.05`;
 *     `var(--c)` trần → `background-color: var(--c)` và `/50` sinh SỐ 0 quy
 *     tắc; `rgb(var(--c) / <alpha-value>)` → cả hai dạng đều sinh đúng;
 *   • plugin `addVariant('hocus', ['&:hover','&:focus-visible'])` sinh HAI quy
 *     tắc cho mỗi tiện ích, và `hocus:md:p-2` lồng đúng trong `@media`;
 *   • tailwind-merge 2.5.4 (16 ca đối chiếu với lời giải mẫu câu 31, khớp
 *     16/16): `px-4 py-2 rounded px-8` → `py-2 rounded px-8`, `px-4 p-8` →
 *     `p-8`, `p-8 px-4` → GIỮ CẢ HAI, `pl-8 px-2` → `px-2`, `px-2 pl-8` → GIỮ
 *     CẢ HAI, `m-1 mx-2 mt-3` → GIỮ CẢ BA, `!p-8 p-2` → GIỮ CẢ HAI.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ MỘT CHỖ GIÁO TRÌNH SAI HẲN SO VỚI MÁY (đo 10/09/2026) — ĐỀ THEO MÁY
 * ────────────────────────────────────────────────────────────────────────────
 *
 * **Bài 5.1, mục "Trap": "extend một họ màu thì XOÁ trọn họ mặc định cùng tên,
 * kể cả khi bạn đang ở trong extend — muốn chỉnh hai sắc xám thì phải chép lại
 * cả mười một."** Trên 3.4.14 điều đó **KHÔNG đúng**. Đo thật:
 *
 *     theme: { extend: { colors: { gray: { 500: '#888888' } } } }
 *     → resolveConfig: gray có ĐỦ 11 khoá 50…950
 *     → dựng thật:  .bg-gray-500 = rgb(136 136 136)   (giá trị MỚI)
 *                   .bg-gray-700 = rgb(55 65 81)      (mặc định, CÒN SỐNG)
 *                   .bg-gray-950 = rgb(3 7 18)        (mặc định, CÒN SỐNG)
 *
 * `extend` trộn **SÂU** (đệ quy qua các object lồng nhau), nên chỉnh một bậc
 * chỉ đè đúng bậc đó. Cái ĐÚNG trong bài là nửa còn lại: viết `theme.colors`
 * NGOÀI `extend` thì thay trọn khoá `colors` — đo thật, lúc ấy chỉ còn đúng họ
 * bạn cung cấp. Câu 8 ra đề theo MÁY, và câu 32 bắt học viên cài đúng phép
 * trộn sâu ấy.
 *
 * (Ghi thêm, không phải lỗi: bài 7.1 nói `@layer` bị xoá sạch — đo lại đúng,
 * `grep -c '@layer'` trả 0. Bài 7.4 nói Preflight 555 dòng / 41 quy tắc — đo
 * lại đúng từng con số.)
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh dưới):  { '0': 7, '1': 8, '2': 8, '3': 7 }
 *   node -e "import('./content/exams/TAILWIND-CSS-PT2.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Số câu theo chương: Chương 4 → 7 · Chương 5 → 8 · Chương 6 → 8 · Chương 7 → 7.
 *
 * Kiểm: node scripts/exam-check.mjs content/exams/TAILWIND-CSS-PT2.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/TAILWIND-CSS-PT2.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/tailwind-exam-kit.mjs';

export default {
  course: { slug: 'tailwind-css' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 4 to 7 (components, config, CSS variables, layers)',
        'Kiểm tra tiến độ 2 — Chương 4 đến 7 (component, cấu hình, biến CSS, layer)',
      ),
      description: B(
        'The middle third of the Tailwind CSS course: where to reuse and why @apply is the wrong place, extending the config without deleting the defaults, CSS variables as the theme mechanism and the alpha trap they hide, and what @layer really is on version 3. 30 multiple-choice questions plus 2 coding questions you write here in the exam room, all measured against Tailwind CLI 3.4.14.',
        'Một phần ba giữa của khoá Tailwind CSS: tái sử dụng ở đâu và vì sao @apply là chỗ sai, mở rộng config mà không xoá mất giá trị mặc định, biến CSS làm cơ chế theme cùng cái bẫy độ mờ nó giấu bên trong, và @layer thật ra là gì trên bản 3. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi, tất cả đều đo trên Tailwind CLI 3.4.14.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '4–7'),
      questions: [
        // ── Chương 4 — Component ────────────────────────────────────────
        mcq({
          prompt: B(
            'A team adds a lint rule capping <code>className</code> at 120 characters, reasoning from the measured distribution (79% under 80, 4.4% over 160, longest 787). What does that rule actually produce?',
            'Một đội thêm luật lint chặn <code>className</code> ở 120 ký tự, lý lẽ dựa trên phân bố đo được (79% dưới 80, 4,4% vượt 160, dài nhất 787). Luật đó thật sự đẻ ra cái gì?',
          ),
          options: [
            B(
              'Exactly the intended effect: the 4.4% become components and the 79% are untouched, which is the cheapest possible enforcement of the extraction rule',
              'Đúng hiệu quả mong muốn: 4,4% kia thành component còn 79% không bị đụng tới, và đó là cách rẻ nhất để thực thi luật tách component',
            ),
            B(
              'Nothing, because a linter cannot see class attributes built from a template literal, so the rule is unenforceable in practice',
              'Không gì cả, vì bộ lint không thấy được thuộc tính lớp dựng từ chuỗi mẫu, nên luật này thực tế không thi hành được',
            ),
            B(
              'Two bad outcomes: genuine one-off layouts get split into meaningless sub-components, and people move classes into a variable — hiding the length without removing the duplication',
              'Hai hậu quả xấu: những bố cục dùng một lần chính đáng bị chẻ thành các component con vô nghĩa, và người ta dời lớp vào một biến — giấu độ dài đi mà không bỏ được sự trùng lặp',
            ),
            B(
              'A measurable size win, since shorter class attributes mean fewer distinct utilities and therefore a smaller generated stylesheet',
              'Một khoản lợi đo được về kích thước, vì thuộc tính lớp ngắn hơn nghĩa là ít tiện ích duy nhất hơn nên bảng kiểu phát sinh nhỏ hơn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Length is the wrong metric because it does not measure the thing that costs you. What costs you is <em>how many places must change together</em>: four copies of a 200-character class list means a design change touches four files and a reviewer must diff four nearly-identical strings. One 787-character hero section used once costs nothing and extracting it adds indirection while removing nothing. The usable rule is repetition — long and used once, leave it; long and used 2–3 times, extract if the copies are already drifting; long and used 4+ times, extract. And the size argument is backwards: the stylesheet tracks the vocabulary of distinct utilities, not the length of any attribute, so shortening attributes changes the output by zero bytes.',
            'Độ dài là phép đo sai vì nó không đo thứ làm bạn tốn kém. Thứ làm bạn tốn kém là <em>có bao nhiêu chỗ phải đổi cùng nhau</em>: bốn bản sao của một danh sách lớp 200 ký tự nghĩa là một thay đổi thiết kế phải chạm bốn file và người review phải so bốn chuỗi gần như giống hệt. Một khối hero 787 ký tự dùng đúng một lần thì chẳng tốn gì, và tách nó ra chỉ thêm một tầng gián tiếp mà không bỏ được thứ gì. Luật dùng được là SỰ LẶP LẠI — dài mà dùng một lần thì để yên; dài mà dùng 2–3 lần thì tách nếu các bản sao đã bắt đầu trôi khác nhau; dài mà dùng 4 lần trở lên thì tách. Còn lý lẽ về kích thước thì ngược: bảng kiểu bám theo VỐN TỪ tiện ích duy nhất chứ không theo độ dài của thuộc tính nào, nên rút ngắn thuộc tính làm đầu ra thay đổi đúng không byte.',
          ),
        }),

        mcq({
          prompt: B(
            'This is built, and these are the real line numbers from the output file:' + code(
              '@layer components {\n' +
              '  .btn     { @apply px-4 py-2 rounded bg-blue-500 text-white; }\n' +
              '  .btn-hov { @apply btn hover:bg-blue-700 md:px-10; }\n' +
              '}\n' +
              '\n' +
              '581:  .btn-hov { … padding-left: 1rem; padding-right: 1rem … }\n' +
              '593:  .btn-hov:hover { background-color: rgb(29 78 216 …) }\n' +
              '598:  @media (min-width: 768px) { .btn-hov { padding-left: 2.5rem … } }\n' +
              '605:  .p-4 { padding: 1rem }',
            ) + 'An element carries <code>class="btn-hov p-4"</code> on a 900px screen. What is its padding, and what did <code>@apply</code> do with the variants?',
            'Đoạn này được dựng, và đây là số dòng THẬT trong file đầu ra:' + code(
              '@layer components {\n' +
              '  .btn     { @apply px-4 py-2 rounded bg-blue-500 text-white; }\n' +
              '  .btn-hov { @apply btn hover:bg-blue-700 md:px-10; }\n' +
              '}\n' +
              '\n' +
              '581:  .btn-hov { … padding-left: 1rem; padding-right: 1rem … }\n' +
              '593:  .btn-hov:hover { background-color: rgb(29 78 216 …) }\n' +
              '598:  @media (min-width: 768px) { .btn-hov { padding-left: 2.5rem … } }\n' +
              '605:  .p-4 { padding: 1rem }',
            ) + 'Một thẻ mang <code>class="btn-hov p-4"</code> trên màn 900px. Padding của nó bằng bao nhiêu, và <code>@apply</code> đã làm gì với các biến thể?',
          ),
          options: [
            B(
              '1rem on all four sides: <code>@apply</code> splits variants into separate rules, and every one of them — including the <code>md:</code> block at 598 — is emitted BEFORE <code>.p-4</code> at 605, so the plain utility wins',
              '1rem cả bốn cạnh: <code>@apply</code> tách biến thể thành các quy tắc riêng, và mọi quy tắc ấy — kể cả khối <code>md:</code> ở dòng 598 — đều được sinh TRƯỚC <code>.p-4</code> ở 605, nên tiện ích trơn thắng',
            ),
            B(
              '2.5rem horizontally: a media query beats an unprefixed rule regardless of position, which is what makes responsive overrides work',
              '2,5rem theo chiều ngang: truy vấn media thắng một quy tắc không tiền tố bất kể vị trí, và đó là thứ làm cho phép ghi đè đáp ứng hoạt động',
            ),
            B(
              'Also 1rem, but for a different reason: <code>@apply</code> rejects variant utilities, so the <code>hover:</code> and <code>md:</code> parts were silently dropped at build time',
              'Cũng 1rem, nhưng vì lý do khác: <code>@apply</code> từ chối tiện ích có biến thể, nên hai phần <code>hover:</code> và <code>md:</code> bị âm thầm bỏ lúc dựng',
            ),
            B(
              '2.5rem horizontally: <code>.btn-hov</code> is a component class, and component classes always outrank utilities because they carry more declarations',
              '2,5rem theo chiều ngang: <code>.btn-hov</code> là lớp component, mà lớp component luôn xếp trên tiện ích vì nó mang nhiều khai báo hơn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Both halves are read off the build. <code>@apply</code> does accept variant utilities and expands them faithfully — one base rule, one <code>:hover</code> rule, one <code>@media</code> block, three rules from one line. But everything inside <code>@layer components</code> is relocated into the components band, which sits before the utilities band, so all three land in the 580s and 590s while <code>.p-4</code> lands at 605. A media query adds no specificity, so at 900px both <code>.btn-hov</code> inside the media block and <code>.p-4</code> score 0,1,0 and the later one wins: 1rem. That is the ordering you usually want — a caller\'s utility should beat a component class — but it means a responsive rule baked into a component class is weaker than a plain utility pasted at the call site, which is not obvious from the source and is one more reason the component belongs in JSX rather than in CSS.',
            'Cả hai nửa đều đọc ra từ bản dựng. <code>@apply</code> CÓ nhận tiện ích mang biến thể và bung chúng ra trung thực — một quy tắc nền, một quy tắc <code>:hover</code>, một khối <code>@media</code>, ba quy tắc từ một dòng. Nhưng mọi thứ trong <code>@layer components</code> đều bị dời vào dải components, mà dải ấy nằm trước dải utilities, nên cả ba rơi vào khoảng dòng 580–598 còn <code>.p-4</code> rơi xuống 605. Truy vấn media không thêm độ đặc hiệu, nên ở 900px thì cả <code>.btn-hov</code> bên trong khối media lẫn <code>.p-4</code> đều 0,1,0 và cái đứng sau thắng: 1rem. Thứ tự ấy thường là thứ bạn muốn — tiện ích của người gọi nên thắng lớp component — nhưng nó có nghĩa một quy tắc đáp ứng nướng sẵn trong lớp component lại yếu hơn một tiện ích trơn dán ở chỗ gọi, điều không nhìn ra được từ mã nguồn và là thêm một lý do nữa để component sống trong JSX chứ không phải trong CSS.',
          ),
        }),

        mcq({
          prompt: B(
            'A team replaces long class lists with <code>@apply</code>-built classes such as <code>.btn</code>. A caller then writes <code>cn(&quot;btn&quot;, &quot;px-8&quot;)</code> expecting the padding to change. What happens, and why?',
            'Một đội thay các danh sách lớp dài bằng những lớp dựng bằng <code>@apply</code>, ví dụ <code>.btn</code>. Người gọi sau đó viết <code>cn(&quot;btn&quot;, &quot;px-8&quot;)</code> mong padding đổi. Chuyện gì xảy ra, và vì sao?',
          ),
          options: [
            B(
              '<code>twMerge</code> resolves it correctly, because it reads the built stylesheet at runtime to learn which properties each class sets',
              '<code>twMerge</code> phân giải đúng, vì nó đọc bảng kiểu đã dựng lúc chạy để biết mỗi lớp đặt những thuộc tính nào',
            ),
            B(
              '<code>twMerge</code> knows nothing about <code>.btn</code>, so it passes both through — and whether <code>px-8</code> wins then depends on emit position, which is the conflict model Chapter 3 fixed being switched back off',
              '<code>twMerge</code> không biết gì về <code>.btn</code> nên nó cho cả hai đi qua — và <code>px-8</code> có thắng hay không lại phụ thuộc vị trí phát sinh, tức là mô hình xung đột mà chương 3 đã sửa nay bị tắt trở lại',
            ),
            B(
              '<code>cn()</code> throws at runtime on an unknown class, which is how the library protects you from exactly this mistake',
              '<code>cn()</code> ném lỗi lúc chạy khi gặp lớp lạ, và đó là cách thư viện bảo vệ bạn khỏi đúng sai lầm này',
            ),
            B(
              'It works: any class produced by <code>@apply</code> inherits the conflict groups of the utilities it inlined, so <code>.btn</code> registers as a padding class',
              'Nó chạy đúng: lớp nào do <code>@apply</code> sinh ra cũng thừa hưởng nhóm xung đột của các tiện ích nó nội tuyến, nên <code>.btn</code> được ghi nhận là một lớp padding',
            ),
          ],
          correct: 1,
          explanation: EX(
            '<code>tailwind-merge</code> works from a static model of Tailwind\'s own property taxonomy. It has never heard of <code>.btn</code>, cannot know that it happens to set padding, and correctly refuses to guess — so it returns both classes and the browser decides by position. Here <code>.btn</code> sits in the components band and <code>px-8</code> in the utilities band, so the override does happen to work; change <code>.btn</code> to <code>@layer utilities</code> or write it unlayered after the directives and the same call silently stops working. That unpredictability is one of five things <code>@apply</code> gives up, alongside deduplication (measured: <code>.btn-lg</code> copies 7 of <code>.btn</code>\'s 9 declarations), readability at the call site, safe deletion, and painless variants. <code>extendTailwindMerge()</code> can teach the library about custom classes, but that is a second registry to keep in sync — and in a codebase with a component layer, a component was the cheaper answer all along. This repository uses <code>@apply</code> zero times across 4,462 lines of CSS.',
            '<code>tailwind-merge</code> làm việc dựa trên một mô hình TĨNH về phân loại thuộc tính của chính Tailwind. Nó chưa từng nghe tới <code>.btn</code>, không thể biết cái lớp ấy tình cờ đặt padding, và nó từ chối đoán — hoàn toàn đúng — nên nó trả cả hai lớp và trình duyệt quyết định theo vị trí. Ở đây <code>.btn</code> nằm dải components còn <code>px-8</code> nằm dải utilities, nên phép ghi đè TÌNH CỜ chạy được; đổi <code>.btn</code> sang <code>@layer utilities</code> hoặc viết nó không-layer sau ba chỉ thị là đúng lời gọi ấy âm thầm ngừng chạy. Sự khó đoán đó là một trong năm thứ <code>@apply</code> đánh mất, cùng với phép khử trùng lặp (đo thật: <code>.btn-lg</code> chép 7 trên 9 khai báo của <code>.btn</code>), khả năng đọc ngay tại chỗ gọi, khả năng xoá an toàn, và biến thể không đau đớn. <code>extendTailwindMerge()</code> có thể dạy thư viện về lớp tuỳ biến, nhưng đó là một sổ đăng ký thứ hai phải giữ đồng bộ — mà trong một kho mã đã có tầng component thì component vốn dĩ vẫn là câu trả lời rẻ hơn. Kho này dùng <code>@apply</code> đúng KHÔNG lần trong 4.462 dòng CSS.',
          ),
        }),

        mcq({
          prompt: B(
            'Three levels of contract for a design-system primitive: no <code>className</code> prop at all, <code>className</code> merged last, or <code>className</code> concatenated. Which reading of the trade-off is right?',
            'Ba mức hợp đồng cho một component nền tảng của hệ thống thiết kế: không có thuộc tính <code>className</code>, <code>className</code> hợp nhất SAU CÙNG, hoặc <code>className</code> nối chuỗi. Cách đọc nào về sự đánh đổi là đúng?',
          ),
          options: [
            B(
              'Concatenation is the honest middle: it applies the caller\'s class without letting it override the design system, which is the balance a primitive wants',
              'Nối chuỗi là con đường giữa trung thực: nó áp lớp của người gọi mà không cho lớp ấy ghi đè hệ thống thiết kế, đúng thế cân bằng mà một component nền tảng muốn',
            ),
            B(
              'Omitting <code>className</code> is always wrong, since a component that cannot be positioned by its parent is unusable in any real layout',
              'Bỏ <code>className</code> luôn sai, vì một component mà cha nó không định vị được thì không dùng nổi trong bố cục thật nào',
            ),
            B(
              'Merged-last and concatenated are equivalent in behaviour and differ only in bundle size, so either is fine as long as the team is consistent',
              'Hợp nhất-sau-cùng và nối chuỗi có hành vi tương đương, chỉ khác nhau ở kích thước gói, nên chọn cách nào cũng được miễn cả đội nhất quán',
            ),
            B(
              'No prop is the strictest and often the right default; merged-last is a promise you can keep for every input; concatenated is a contract whose terms vary by input, which is not a contract',
              'Không có thuộc tính ấy là mức nghiêm nhất và thường là mặc định đúng; hợp nhất-sau-cùng là lời hứa giữ được với MỌI đầu vào; nối chuỗi là một hợp đồng mà điều khoản thay đổi theo đầu vào, tức là không phải hợp đồng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The concatenated form works for classes that do not collide and fails silently for ones that do, so its behaviour depends on which utilities the caller happens to choose — you cannot document it without caveats, and it passes the test someone wrote while failing the case someone else hits. Refusing the prop is a real option rather than a failure of imagination: a component that decides its own appearance and exposes named variants is what makes a design system a system. The open version means your <code>Button</code> does not actually control what buttons look like, and six months later an audit finds eleven visually distinct buttons all rendered by <code>&lt;Button&gt;</code>. A useful middle position exists — accept <code>className</code> for LAYOUT (margin, width, grid placement, which only the parent can know) and treat a request to change colours or padding as a request for a new variant.',
            'Dạng nối chuỗi chạy đúng với những lớp không đụng nhau và hỏng im lặng với những lớp có đụng, nên hành vi của nó phụ thuộc vào việc người gọi tình cờ chọn tiện ích nào — bạn không thể ghi tài liệu cho nó mà không kèm điều kiện, và nó qua được phép thử mà người này viết trong khi hỏng đúng ca mà người kia gặp. Từ chối thuộc tính ấy là một lựa chọn thật chứ không phải thiếu tưởng tượng: một component tự quyết diện mạo của mình và mở ra các biến thể có tên chính là thứ làm cho hệ thống thiết kế trở thành một HỆ THỐNG. Bản mở nghĩa là cái <code>Button</code> của bạn thật ra không kiểm soát nút trông thế nào, và sáu tháng sau một đợt rà sẽ tìm ra mười một cái nút khác nhau về mặt hình ảnh mà cùng do <code>&lt;Button&gt;</code> dựng ra. Có một vị trí trung dung hữu ích — nhận <code>className</code> cho BỐ CỤC (lề, chiều rộng, vị trí trong lưới, những thứ chỉ thẻ cha biết) và coi yêu cầu đổi màu hay đổi padding là yêu cầu thêm một biến thể mới.',
          ),
        }),

        mcq({
          prompt: B(
            'A caller passes <code>w-full</code> to a component and nothing changes. The class IS on an element in DevTools and the rule IS in the built CSS.' + code(
              'export function Field({ className, ...props }) {\n' +
              '  return (\n' +
              '    <div className={cn("mb-4", className)}>\n' +
              '      <label>…</label>\n' +
              '      <input {...props} />\n' +
              '    </div>\n' +
              '  );\n' +
              '}',
            ),
            'Người gọi truyền <code>w-full</code> vào một component và không có gì thay đổi. Lớp ấy CÓ trên một thẻ trong DevTools và quy tắc CÓ trong CSS đã dựng.' + code(
              'export function Field({ className, ...props }) {\n' +
              '  return (\n' +
              '    <div className={cn("mb-4", className)}>\n' +
              '      <label>…</label>\n' +
              '      <input {...props} />\n' +
              '    </div>\n' +
              '  );\n' +
              '}',
            ),
          ),
          options: [
            B(
              '<code>cn()</code> put the caller\'s class first internally, so <code>mb-4</code> wins; swapping the argument order fixes it',
              '<code>cn()</code> đã tự đặt lớp của người gọi lên trước ở bên trong nên <code>mb-4</code> thắng; đảo thứ tự đối số là xong',
            ),
            B(
              'The spread <code>{...props}</code> also forwards <code>className</code> onto the input, and the two copies cancel each other out',
              'Phép trải <code>{...props}</code> cũng chuyển tiếp <code>className</code> xuống input, và hai bản sao triệt tiêu nhau',
            ),
            B(
              'The class landed on the wrapper, which was already full width, and never reached the input the caller meant — a component with a wrapper must choose an element and document which',
              'Cái lớp rơi lên thẻ bọc vốn đã rộng hết cỡ, và không bao giờ tới được cái input mà người gọi nhắm — một component có thẻ bọc buộc phải CHỌN một thẻ và ghi rõ là thẻ nào',
            ),
            B(
              'The component is missing <code>forwardRef</code>, and without a forwarded ref React strips unknown layout classes during reconciliation',
              'Component thiếu <code>forwardRef</code>, và không có ref chuyển tiếp thì React gỡ bỏ những lớp bố cục lạ trong lúc đối chiếu cây',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Nothing errors and the class IS applied — just on the wrong element, which is why DevTools shows it "working". The merge is correct here (caller last), the ref question is separate, and React never touches class strings. This is the wrapper trap: a component rendering more than one DOM node has to decide where <code>className</code> lands, and whichever it picks, a caller has no way to know from the outside. Two honest fixes: put <code>className</code> on the element the component\'s NAME implies, or expose two explicitly named props such as <code>className</code> and <code>inputClassName</code>. Alongside it are the other three mechanical requirements when you accept the prop at all — merge it LAST through <code>cn()</code>, spread the remaining props so <code>aria-label</code> and <code>data-testid</code> get through, and forward the ref when you wrap a real DOM element, because adding it later is a breaking change for everyone who worked around its absence.',
            'Không có lỗi nào và cái lớp CÓ được áp — chỉ là áp nhầm thẻ, và vì thế DevTools trông như nó "đang chạy". Phép hợp nhất ở đây đúng (người gọi đứng sau), chuyện ref là chuyện khác, còn React thì không bao giờ đụng vào chuỗi lớp. Đây là cái bẫy thẻ bọc: một component dựng ra nhiều hơn một nút DOM buộc phải quyết <code>className</code> rơi vào đâu, và chọn cái nào thì người gọi đứng ngoài cũng không có cách nào biết. Hai cách sửa trung thực: đặt <code>className</code> lên đúng cái thẻ mà TÊN của component gợi ra, hoặc mở hai thuộc tính có tên rõ ràng như <code>className</code> và <code>inputClassName</code>. Đi kèm nó là ba yêu cầu cơ học còn lại khi đã nhận thuộc tính này — hợp nhất nó SAU CÙNG qua <code>cn()</code>, trải các props còn lại để <code>aria-label</code> và <code>data-testid</code> đi qua được, và chuyển tiếp ref khi bạn bọc một thẻ DOM thật, vì thêm nó về sau là một thay đổi phá vỡ với mọi người đã trót lách qua sự vắng mặt của nó.',
          ),
        }),

        mcq({
          prompt: B(
            'A component ends up with <code>variant: &quot;blue&quot; | &quot;red&quot; | &quot;grey&quot; | &quot;outline-blue&quot; | … </code> — eleven members. Two naming failures are in play. Which diagnosis is right?',
            'Một component cuối cùng có <code>variant: &quot;blue&quot; | &quot;red&quot; | &quot;grey&quot; | &quot;outline-blue&quot; | … </code> — mười một thành viên. Có hai lỗi đặt tên cùng lúc. Chẩn đoán nào đúng?',
          ),
          options: [
            B(
              'Named by APPEARANCE rather than by intent, so a rebrand makes every call site wrong with no mechanical rename — and eleven members means the component is doing several jobs that are probably different components',
              'Đặt tên theo DIỆN MẠO thay vì theo Ý ĐỊNH, nên một lần đổi nhận diện là mọi chỗ gọi đều sai mà không đổi tên máy móc được — và mười một thành viên nghĩa là component đang làm nhiều việc, mà mấy việc đó có lẽ là mấy component khác nhau',
            ),
            B(
              'Eleven is fine as long as the union is generated by <code>VariantProps</code>, since a derived type cannot drift from the config that produced it',
              'Mười một là ổn miễn là union được sinh bằng <code>VariantProps</code>, vì một kiểu suy ra không thể trôi lệch khỏi cái config sinh ra nó',
            ),
            B(
              'The only problem is the count; colour names are the clearest possible variant names because a reader can picture the result without opening the component',
              'Vấn đề duy nhất là số lượng; tên màu là tên biến thể rõ ràng nhất có thể vì người đọc hình dung được kết quả mà không cần mở component ra',
            ),
            B(
              'The fix is to remove the variant prop entirely and let callers pass <code>className</code>, which is the flexible form a growing design needs',
              'Cách sửa là bỏ hẳn thuộc tính variant rồi để người gọi truyền <code>className</code>, vì đó là dạng linh hoạt mà một thiết kế đang lớn cần tới',
            ),
          ],
          correct: 0,
          explanation: EX(
            '<code>variant=&quot;blue&quot;</code> records a pigment, not a role. When the brand moves from blue to green, every call site is wrong and the rename is not mechanical, because some blues meant "primary" and others just meant "blue" — the information needed to tell them apart was never written down. Name by intent (<code>primary</code>, <code>danger</code>, <code>ghost</code>) and the mapping to colour lives in one place. The second failure is the opposite of too few: a union with eleven members is a component doing eleven jobs, and a <code>Button</code> and an <code>IconButton</code> that share nothing but a border radius should not be one file. The two failures are connected — too few variants is what pushes callers to <code>className</code> until the design system stops constraining anything, and the overcorrection is a variant for every visual difference anyone ever needed.',
            '<code>variant=&quot;blue&quot;</code> ghi lại một sắc tố chứ không phải một VAI TRÒ. Khi nhận diện thương hiệu chuyển từ xanh lam sang xanh lá thì mọi chỗ gọi đều sai và phép đổi tên không máy móc được, vì có chỗ "blue" nghĩa là "hành động chính" còn chỗ khác chỉ nghĩa là "màu xanh lam" — cái thông tin phân biệt hai loại ấy chưa từng được ghi lại. Đặt tên theo ý định (<code>primary</code>, <code>danger</code>, <code>ghost</code>) thì phép ánh xạ sang màu chỉ nằm ở một chỗ. Lỗi thứ hai là mặt trái của "quá ít": một union mười một thành viên là một component làm mười một việc, và một <code>Button</code> với một <code>IconButton</code> chẳng chung gì ngoài bán kính bo góc thì không nên là một file. Hai lỗi ấy nối với nhau — quá ít biến thể chính là thứ đẩy người gọi sang <code>className</code> cho tới khi hệ thống thiết kế thôi ràng buộc được gì, rồi phản ứng thái quá là đẻ ra một biến thể cho mọi khác biệt hình ảnh mà từng có ai cần.',
          ),
        }),

        mcq({
          prompt: B(
            'The header of <code>components/settings/primitives.tsx</code> records three things: a bug ("the settings screen stayed pitch black in light mode"), a mechanism (CSS variables), and a constraint ("per CLAUDE.md, nothing here uses a <code>dark:</code> utility"). What made this extraction worth doing?',
            'Phần đầu file <code>components/settings/primitives.tsx</code> ghi lại ba thứ: một con bọ ("màn hình cài đặt vẫn đen kịt ở chế độ sáng"), một cơ chế (biến CSS), và một ràng buộc ("theo CLAUDE.md, không thứ gì ở đây dùng tiện ích <code>dark:</code>"). Điều gì làm cuộc tách này đáng làm?',
          ),
          options: [
            B(
              'The line count: twelve components in 390 lines is below the threshold at which a file should be split, which is the metric that decides an extraction',
              'Số dòng: mười hai component trong 390 dòng là dưới ngưỡng cần chẻ file, và đó chính là phép đo quyết định một cuộc tách',
            ),
            B(
              'The duplicated thing was WRONG — hardcoded <code>#0a0a14</code> in many places meant it was wrong in many places at once — so the extraction was a correctness fix, not a maintenance one',
              'Thứ bị trùng lặp là thứ SAI — <code>#0a0a14</code> đóng cứng ở nhiều chỗ nghĩa là nó sai ở nhiều chỗ cùng lúc — nên cuộc tách là một phép sửa TÍNH ĐÚNG chứ không phải sửa chi phí bảo trì',
            ),
            B(
              'It moved the components into a global <code>components/ui/</code> folder, which is what lets three feature areas share one <code>Button</code>',
              'Nó dời các component vào thư mục <code>components/ui/</code> dùng chung toàn cục, và đó là thứ cho phép ba khu vực tính năng chia nhau một cái <code>Button</code>',
            ),
            B(
              'It replaced the <code>dark:</code> utilities with <code>theme-dark:</code> ones, which is the variant this repository configures in place of the default',
              'Nó thay các tiện ích <code>dark:</code> bằng <code>theme-dark:</code>, biến thể mà kho này cấu hình để thay cho mặc định',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Duplication is a maintenance cost when the copies are correct and a correctness cost when they are not, and the second is a much better reason to extract — it is the one that shows up in incident reports. Every copy of <code>#0a0a14</code> was a place the light theme could not reach, and there was no single place to fix it. Two details of the fix are worth carrying. It is feature-scoped (<code>components/settings/primitives.tsx</code>, not a global <code>ui/</code> folder), a deliberate trade of some duplication for the ability to change the settings button without a regression sweep across finance and language. And it honours the repository rule from the 2026-07-02 incident: the global dark class is <code>theme-dark</code>, <code>.dark</code> is reserved for the Notes wrapper, and there is no <code>theme-dark:</code> variant — the file reads CSS variables instead, so it follows whichever theme is active with no second code path. The trap next door: extracting the components while leaving the hardcoded hex feels like progress and changes nothing a user can see.',
            'Sự trùng lặp là chi phí BẢO TRÌ khi các bản sao đúng, và là chi phí TÍNH ĐÚNG khi chúng sai — cái thứ hai là lý do tách hay hơn hẳn, và là cái xuất hiện trong các báo cáo sự cố. Mỗi bản sao của <code>#0a0a14</code> là một chỗ mà theme sáng không với tới được, và chẳng có một chỗ duy nhất nào để sửa. Hai chi tiết của cách sửa đáng mang theo. Nó bó theo TÍNH NĂNG (<code>components/settings/primitives.tsx</code> chứ không phải một thư mục <code>ui/</code> toàn cục), một sự đánh đổi có chủ ý: chịu chút trùng lặp để đổi lấy khả năng sửa cái nút của settings mà không phải quét hồi quy khắp finance với language. Và nó tôn trọng luật của kho từ sự cố 02/07/2026: lớp tối toàn cục là <code>theme-dark</code>, <code>.dark</code> để dành cho khung Notes, và KHÔNG hề có biến thể <code>theme-dark:</code> nào — file này đọc biến CSS thay thế, nên nó bám theo bất cứ theme nào đang bật mà không cần đường mã thứ hai. Cái bẫy ngay bên cạnh: tách component ra mà để nguyên mã hex đóng cứng thì cảm giác như đã tiến bộ, còn người dùng thì chẳng thấy gì đổi.',
          ),
        }),
        // ── Chương 5 — Cấu hình ─────────────────────────────────────────
        mcq({
          prompt: B(
            'A config adjusts one shade of grey. Built on 3.4.14, these are the real emitted values:' + code(
              'theme: { extend: { colors: { gray: { 500: "#888888" } } } }\n' +
              '\n' +
              '.bg-gray-500 { background-color: rgb(136 136 136 / …) }\n' +
              '.bg-gray-700 { background-color: rgb(55 65 81 / …) }\n' +
              '.bg-gray-950 { background-color: rgb(3 7 18 / …) }',
            ) + 'What does that show about how <code>extend</code> merges?',
            'Một config chỉnh một sắc xám. Dựng trên 3.4.14, đây là các giá trị THẬT được phát sinh:' + code(
              'theme: { extend: { colors: { gray: { 500: "#888888" } } } }\n' +
              '\n' +
              '.bg-gray-500 { background-color: rgb(136 136 136 / …) }\n' +
              '.bg-gray-700 { background-color: rgb(55 65 81 / …) }\n' +
              '.bg-gray-950 { background-color: rgb(3 7 18 / …) }',
            ) + 'Điều đó cho thấy gì về cách <code>extend</code> trộn?',
          ),
          options: [
            B(
              'The merge is one level deep, so the whole default <code>gray</code> family was replaced — the other shades only survive because Preflight re-declares them',
              'Phép trộn chỉ sâu một tầng nên trọn họ <code>gray</code> mặc định đã bị thay — các sắc còn lại chỉ sống sót vì Preflight khai lại chúng',
            ),
            B(
              'Nothing about merging: colour families are special-cased and always merged, while every other theme key inside <code>extend</code> replaces wholesale',
              'Không nói gì về phép trộn: họ màu được xử lý riêng và luôn được trộn, còn mọi khoá theme khác bên trong <code>extend</code> đều thay thế trọn gói',
            ),
            B(
              '<code>extend</code> merges DEEPLY: <code>gray</code> keeps all eleven steps and only 500 is overridden, so adjusting two shades does not mean respelling the family',
              '<code>extend</code> trộn SÂU: <code>gray</code> giữ đủ mười một bậc và chỉ 500 bị đè, nên chỉnh hai sắc không có nghĩa là phải chép lại cả họ',
            ),
            B(
              'It shows the build silently fell back to the default palette, because supplying a partial family is invalid and Tailwind discards the whole entry',
              'Nó cho thấy bản dựng âm thầm lùi về bảng màu mặc định, vì cung cấp một họ khuyết là không hợp lệ nên Tailwind vứt cả mục đó đi',
            ),
          ],
          correct: 2,
          explanation: EX(
            '⚠️ <b>The machine disagrees with the course here, and the exam follows the machine.</b> Lesson 5.1\'s trap says that extending a colour family "does not merge with Tailwind\'s gray — it replaces that family entirely, even though you are inside extend… if you want to adjust two shades of grey, you must respell all eleven". On 3.4.14 that is not what happens: <code>resolveConfig</code> reports all eleven keys 50…950 present, and the build emits <code>gray-700</code> and <code>gray-950</code> at their default values alongside the overridden <code>gray-500</code>. <code>extend</code> merges recursively through nested objects. The other half of the lesson IS correct and is the half that bites: a key written OUTSIDE <code>extend</code> replaces that key wholesale — measured, <code>theme: { colors: { gray: {…} } }</code> leaves exactly one family and deletes the other 26, while <code>theme: { spacing: {…} }</code> deletes the spacing scale and leaves the colours untouched. Replacement is per key, and it is the nesting level, not the family, that decides.',
            '⚠️ <b>Ở chỗ này máy khác giáo trình, và đề theo MÁY.</b> Mục "Trap" của bài 5.1 nói rằng mở rộng một họ màu thì "không trộn với gray của Tailwind — nó thay trọn họ ấy, kể cả khi bạn đang ở trong extend… muốn chỉnh hai sắc xám thì phải chép lại cả mười một". Trên 3.4.14 thì không phải vậy: <code>resolveConfig</code> báo đủ mười một khoá 50…950, và bản dựng phát sinh <code>gray-700</code> với <code>gray-950</code> ở giá trị mặc định của chúng bên cạnh <code>gray-500</code> đã bị đè. <code>extend</code> trộn ĐỆ QUY qua các object lồng nhau. Nửa còn lại của bài thì ĐÚNG, và đó mới là nửa cắn người: một khoá viết NGOÀI <code>extend</code> thay trọn khoá đó — đo thật, <code>theme: { colors: { gray: {…} } }</code> để lại đúng một họ và xoá 26 họ kia, còn <code>theme: { spacing: {…} }</code> xoá thang khoảng cách và để nguyên phần màu. Phép thay là THEO TỪNG KHOÁ, và thứ quyết định là bậc lồng nhau chứ không phải cái họ màu.',
          ),
        }),

        mcq({
          prompt: B(
            'A config key can be written as a function receiving the resolved theme. Why is this form worth the extra syntax?' + code(
              'extend: {\n' +
              "  maxHeight: ({ theme }) => ({ ...theme('spacing'), 'screen-1/2': '50vh' }),\n" +
              '}',
            ),
            'Một khoá config có thể viết dưới dạng hàm nhận theme đã giải. Vì sao dạng ấy đáng phần cú pháp phụ trội?' + code(
              'extend: {\n' +
              "  maxHeight: ({ theme }) => ({ ...theme('spacing'), 'screen-1/2': '50vh' }),\n" +
              '}',
            ),
          ),
          options: [
            B(
              'It defers evaluation to build time, so the values can read environment variables and differ between development and production',
              'Nó hoãn việc tính tới lúc dựng, nhờ đó các giá trị đọc được biến môi trường và khác nhau giữa môi trường phát triển với production',
            ),
            B(
              'It is the only way to add a key containing a slash, since a plain object literal cannot hold <code>screen-1/2</code> as a property name',
              'Đó là cách duy nhất để thêm một khoá có dấu gạch chéo, vì object literal thuần không giữ được <code>screen-1/2</code> làm tên thuộc tính',
            ),
            B(
              'It keeps ONE source of truth: hardcoding <code>2rem</code> in three config keys means a scale change silently misses two of them',
              'Nó giữ MỘT nguồn sự thật: đóng cứng <code>2rem</code> ở ba khoá config nghĩa là một lần đổi thang sẽ âm thầm bỏ sót hai khoá',
            ),
            B(
              'It makes the generated utilities respond to the viewport, because <code>theme()</code> is re-evaluated on resize in the browser',
              'Nó làm các tiện ích phát sinh phản ứng theo viewport, vì <code>theme()</code> được tính lại khi cửa sổ đổi cỡ trong trình duyệt',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The config is evaluated once at build time — nothing here reaches the browser and nothing re-evaluates on resize. What the function form buys is that one key can be DERIVED from another instead of duplicating it. <code>maxHeight</code> does not read the spacing scale by default, so without this you would repeat every spacing value in a second place; add a spacing key later and the copy quietly falls behind. This is the same argument as naming a repeated arbitrary value from Chapter 1: the cost of duplication is not the typing, it is that the copies drift and nothing tells you. It is also worth knowing which keys carry the most leverage — one added <code>spacing</code> key produces dozens of utilities at once (padding, margin, gap, width, height and more all read it), which is why extending spacing is the highest-leverage change in the whole config.',
            'Config được tính đúng một lần lúc dựng — không thứ gì ở đây tới được trình duyệt và không gì được tính lại khi đổi cỡ cửa sổ. Cái mà dạng hàm mua được là một khoá có thể được SUY RA từ khoá khác thay vì chép lại nó. <code>maxHeight</code> mặc định không đọc thang spacing, nên không có dạng này thì bạn phải lặp lại mọi giá trị khoảng cách ở chỗ thứ hai; thêm một khoá spacing về sau là bản chép lặng lẽ tụt lại. Vẫn đúng lý lẽ như việc đặt tên cho một giá trị tuỳ ý lặp nhiều lần ở chương 1: cái giá của trùng lặp không phải là công gõ, mà là các bản sao trôi lệch nhau và chẳng có gì báo cho bạn. Cũng đáng biết khoá nào có đòn bẩy lớn nhất — thêm một khoá <code>spacing</code> là đẻ ra hàng chục tiện ích cùng lúc (padding, margin, gap, width, height và nhiều nữa đều đọc nó), nên mở rộng spacing là thay đổi có đòn bẩy cao nhất trong cả file config.',
          ),
        }),

        mcq({
          prompt: B(
            'An audit greps for every literal use of four config colours and gets zero for all four. Before deleting them, what is the honest next step, and why?',
            'Một đợt rà grep mọi lượt dùng NGUYÊN VĂN của bốn màu trong config và nhận về số không cho cả bốn. Trước khi xoá chúng, bước tiếp theo trung thực là gì, và vì sao?',
          ),
          options: [
            B(
              'Nothing further: a class that appears nowhere in the source cannot be generated, so a zero from the scanner\'s own vocabulary is conclusive',
              'Không cần gì thêm: một lớp không xuất hiện ở đâu trong mã nguồn thì không thể được sinh ra, nên số không từ chính vốn từ của bộ quét là kết luận dứt điểm',
            ),
            B(
              'A plain-text search for the BARE name, because the grep only sees literal class names and misses anything reached through a template literal or assembled at runtime',
              'Tìm văn bản thuần cho CÁI TÊN TRẦN, vì phép grep chỉ thấy tên lớp nguyên văn và bỏ sót mọi thứ với tới qua chuỗi mẫu hoặc ghép lúc chạy',
            ),
            B(
              'Rebuild with <code>--minify</code> and diff the output size, since an unused colour costs bytes and the diff proves whether it was really unused',
              'Dựng lại với <code>--minify</code> rồi so kích thước đầu ra, vì một màu không dùng vẫn tốn byte và phép so ấy chứng minh nó có thật sự không dùng hay không',
            ),
            B(
              'Delete them immediately: a zero-use config entry is by definition dead weight, and leaving it is what let the count reach four in the first place',
              'Xoá ngay: một mục config không ai dùng thì theo định nghĩa là gánh nặng chết, và để nó lại chính là thứ khiến con số leo lên bốn ngay từ đầu',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The grep has the same blind spot as the linter from Chapter 3: it finds classes written literally and is structurally unable to see one composed at runtime. So a zero means "no LITERAL uses", not "no uses" — and deleting on that basis breaks whatever was reaching the colour the other way. On this codebase the bare-name search also returns nothing for the four light colours, which is why the conclusion stands there. The second half matters more than the procedure: a zero on one half of a matched pair is not tidiness debt, it is a design that did not take, and it usually points at a live bug. Here it points at the settings screen staying black in light mode, because 2,677 uses of theme-named colours had nothing to switch to. Deleting the four zero-use entries would tidy the symptom and leave the cause exactly where it was.',
            'Phép grep có đúng điểm mù của bộ lint ở chương 3: nó tìm được lớp viết nguyên văn và về mặt cấu trúc thì không thể thấy lớp ghép lúc chạy. Nên số không nghĩa là "không có lượt dùng NGUYÊN VĂN" chứ không phải "không có lượt dùng nào" — và xoá dựa trên đó là làm hỏng bất cứ thứ gì đang với tới cái màu ấy bằng đường kia. Trên kho này, phép tìm tên trần cũng trả về không cho bốn màu sáng, nên kết luận ở đó đứng vững. Nửa sau quan trọng hơn cái thủ tục: số không ở một nửa của một cặp không phải nợ dọn dẹp, mà là một thiết kế KHÔNG ĐƯỢC ĐÓN NHẬN, và nó thường chỉ vào một con bọ đang sống. Ở đây nó chỉ vào việc màn hình cài đặt vẫn đen ở chế độ sáng, vì 2.677 lượt dùng những màu đặt tên theo theme chẳng có gì để chuyển sang. Xoá bốn mục không ai dùng chỉ dọn được triệu chứng và để nguyên nguyên nhân ở đúng chỗ cũ.',
          ),
        }),

        mcq({
          prompt: B(
            'The paired palette failed here because using it correctly needed a second step at every call site. Which other config entries share that shape?',
            'Bảng màu theo cặp thất bại ở đây vì dùng nó cho đúng thì cần MỘT BƯỚC THỨ HAI ở mọi chỗ gọi. Những mục config nào khác cùng hình dạng ấy?',
          ),
          options: [
            B(
              'None: the failure was specific to colours, because only colours have a paired light/dark form and only colours are affected by a theme',
              'Không mục nào: thất bại ấy đặc thù cho màu sắc, vì chỉ màu mới có dạng cặp sáng/tối và chỉ màu mới chịu ảnh hưởng của theme',
            ),
            B(
              'Entries defined as functions, because the function form defers evaluation and the deferred value can disagree with what the developer read in the config',
              'Những mục định nghĩa bằng hàm, vì dạng hàm hoãn việc tính và giá trị bị hoãn có thể mâu thuẫn với thứ lập trình viên đọc thấy trong config',
            ),
            B(
              'Only entries that generate more than one utility, since a single-utility entry has no second step by construction',
              'Chỉ những mục sinh ra nhiều hơn một tiện ích, vì một mục chỉ sinh một tiện ích thì theo cấu tạo đã không có bước thứ hai nào',
            ),
            B(
              'Any entry whose correct use requires the developer to remember something else — a spacing value that only works with a matching gap, a shadow that assumes a particular background — because those get half-applied eventually',
              'Bất kỳ mục nào mà muốn dùng đúng thì lập trình viên phải NHỚ thêm thứ khác — một giá trị khoảng cách chỉ đúng khi đi kèm một gap tương ứng, một bóng đổ giả định một nền nhất định — vì rồi chúng sẽ bị áp NỬA VỜI',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The measured failure was 2,677 uses of the dark half against zero uses of the light half, and the cause was structural rather than about colour: choosing between a pair requires a variant at every use site, forgetting the second half is invisible until someone opens the other theme, and the repository forbids <code>dark:</code> outside Notes so there was no sanctioned mechanism for choosing at all. Generalise that and the rule is about MEMORY, not about hue: prefer entries that are correct on their own, because those cannot be forgotten halfway. The design that won in the same codebase is the one-name-per-role variable palette — <code>text-text-primary</code> is correct in both themes with nothing to remember, and it is used 5,558 times across the <code>text</code> family, more than any other custom family in the config.',
            'Thất bại đo được là 2.677 lượt dùng nửa tối so với không lượt nào của nửa sáng, và nguyên nhân mang tính cấu trúc chứ không phải chuyện màu mè: chọn giữa một cặp thì cần một biến thể ở mọi chỗ dùng, quên mất nửa thứ hai thì vô hình cho tới khi có ai mở theme kia ra, và kho này lại cấm <code>dark:</code> ngoài Notes nên chẳng có cơ chế chọn nào được phép cả. Khái quát lên thì luật này nói về TRÍ NHỚ chứ không nói về sắc độ: hãy ưu tiên những mục tự nó đã đúng, vì những mục ấy không thể bị quên nửa chừng. Thiết kế thắng cuộc trong cùng kho mã là bảng màu biến một-tên-cho-một-vai-trò — <code>text-text-primary</code> đúng ở cả hai theme mà chẳng phải nhớ gì, và họ <code>text</code> được dùng 5.558 lần, nhiều hơn mọi họ tuỳ biến khác trong config.',
          ),
        }),

        mcq({
          prompt: B(
            'Three layers of colour naming: primitive (<code>slate-900</code>, <code>#0f172a</code>), semantic (<code>--bg-card</code>, <code>--text-primary</code>) and component (the class a developer types). There is a one-question test for whether a name belongs to the semantic layer. What is it?',
            'Ba tầng đặt tên màu: nguyên thuỷ (<code>slate-900</code>, <code>#0f172a</code>), ngữ nghĩa (<code>--bg-card</code>, <code>--text-primary</code>) và component (cái lớp lập trình viên gõ). Có một câu hỏi duy nhất để kiểm một cái tên có thuộc tầng ngữ nghĩa hay không. Câu ấy là gì?',
          ),
          options: [
            B(
              '"Does the name appear in more than one file?" — a name used in one place is a local detail and belongs to the primitive layer wherever it is defined',
              '"Cái tên này có xuất hiện ở hơn một file không?" — tên chỉ dùng một chỗ là chi tiết cục bộ và thuộc tầng nguyên thuỷ, dù nó được định nghĩa ở đâu',
            ),
            B(
              '"If the design changed, would this name become a lie?" — <code>bg-blue-600</code> breaks on a rebrand and <code>bg-darkcard</code> breaks on adding a light theme; <code>bg-card</code> survives both',
              '"Nếu thiết kế đổi, cái tên này có thành một lời nói dối không?" — <code>bg-blue-600</code> vỡ khi đổi nhận diện và <code>bg-darkcard</code> vỡ khi thêm theme sáng; <code>bg-card</code> sống sót cả hai',
            ),
            B(
              '"Is the value a CSS variable?" — semantic names resolve at runtime by definition, so anything holding a literal hex is a primitive',
              '"Giá trị của nó có phải một biến CSS không?" — tên ngữ nghĩa theo định nghĩa là giải lúc chạy, nên thứ gì giữ một mã hex nguyên văn đều là nguyên thuỷ',
            ),
            B(
              '"Is it used more than a thousand times?" — heavy use is what promotes a name into the semantic layer, which is why <code>darkborder</code> at 1,409 uses qualifies',
              '"Nó có được dùng quá một nghìn lần không?" — mức dùng nặng là thứ nâng một cái tên lên tầng ngữ nghĩa, nên <code>darkborder</code> với 1.409 lượt dùng là đủ tiêu chuẩn',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The test is mechanical because it names the axis of change. Rebrand blue to green and <code>bg-blue-600</code> is wrong everywhere it meant "primary action" — and the rename is not mechanical, because some blues meant primary and others just meant blue. Add a light theme and <code>bg-darkcard</code> is wrong everywhere it meant "card surface". Both encoded something that turned out to be variable. Two more failing shapes are worth recognising: a name that encodes a PLACE (<code>sidebar-bg</code>) breaks when the same surface appears in a modal, and a semantic name that is secretly a pigment — <code>primary</code> used for backgrounds, borders, text and focus rings at once — cannot be changed independently and needs splitting into <code>bg-primary</code>, <code>text-on-primary</code> and <code>border-primary</code>. Being a CSS variable does not make a name semantic and 1,409 uses do not either; both of those are true of <code>darkborder</code>, which is the counter-example the codebase supplies.',
            'Phép kiểm này máy móc được vì nó gọi tên cái TRỤC thay đổi. Đổi nhận diện từ xanh lam sang xanh lá thì <code>bg-blue-600</code> sai ở mọi chỗ nó từng có nghĩa "hành động chính" — và phép đổi tên không máy móc được, vì có chỗ "blue" nghĩa là primary còn chỗ khác chỉ nghĩa là màu xanh lam. Thêm một theme sáng thì <code>bg-darkcard</code> sai ở mọi chỗ nó có nghĩa "mặt của thẻ bài". Cả hai đều mã hoá một thứ hoá ra lại biến thiên. Còn hai hình dạng hỏng nữa đáng nhận diện: cái tên mã hoá một NƠI CHỐN (<code>sidebar-bg</code>) vỡ khi cùng cái mặt ấy xuất hiện trong một hộp thoại, và một cái tên ngữ nghĩa mà thật ra là sắc tố — <code>primary</code> dùng cho nền, viền, chữ và vòng focus cùng lúc — thì không đổi độc lập được và cần chẻ thành <code>bg-primary</code>, <code>text-on-primary</code> và <code>border-primary</code>. Là biến CSS không làm một cái tên thành ngữ nghĩa, và 1.409 lượt dùng cũng không: cả hai điều đó đều đúng với <code>darkborder</code>, phản ví dụ mà chính kho mã này cung cấp.',
          ),
        }),

        mcq({
          prompt: B(
            'Renaming <code>darkbg</code> to a role name across 641 call sites has four steps. Step 2 is "point the new variable at the OLD value, so the two names render identically". Which step do people skip, and what does skipping it cost?',
            'Đổi tên <code>darkbg</code> thành một cái tên theo vai trò trên 641 chỗ gọi gồm bốn bước. Bước 2 là "trỏ biến mới vào GIÁ TRỊ CŨ, để hai cái tên dựng ra giống hệt nhau". Người ta hay bỏ bước nào, và bỏ nó thì mất gì?',
          ),
          options: [
            B(
              'Step 4 — actually setting the light value — because the migration feels finished once the call sites are renamed, and the light theme is never reached',
              'Bước 4 — thật sự đặt giá trị cho theme sáng — vì cuộc chuyển đổi có cảm giác đã xong khi các chỗ gọi được đổi tên, và theme sáng không bao giờ tới nơi',
            ),
            B(
              'Step 1 — adding the new name alongside the old one — because a config can only hold one name per colour and the old entry must go first',
              'Bước 1 — thêm tên mới song song với tên cũ — vì một config chỉ giữ được một tên cho mỗi màu nên mục cũ phải đi trước',
            ),
            B(
              'Step 2 itself: renaming and re-valuing in one commit makes every visual difference ambiguous — is that a rename bug or the intended new colour? — so a boring 641-site refactor becomes a risky one',
              'Chính bước 2: đổi tên và đổi giá trị trong cùng một commit làm mọi khác biệt hình ảnh trở nên mập mờ — đó là lỗi đổi tên hay là màu mới cố ý? — nên một cuộc tái cấu trúc 641 chỗ vốn nhàm chán thành ra rủi ro',
            ),
            B(
              'Step 3 — batching by feature area — because a single commit is faster to review than twenty, and the batches only add merge conflicts',
              'Bước 3 — chia lô theo khu vực tính năng — vì một commit duy nhất review nhanh hơn hai mươi commit, và việc chia lô chỉ đẻ thêm xung đột hợp nhất',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Making the new name a synonym FIRST is what turns a 641-site refactor into a boring one, and boring is the goal — every commit in step 3 changes nothing visually, so a reviewer only has to confirm the mapping is right, with no behaviour to reason about. Skip it and the two changes arrive together: now any pixel that moved could be either the rename going wrong or the new colour being applied, and there is no way to tell them apart across 641 sites. The full sequence is: (1) define <code>surface: "var(--bg-surface)"</code> alongside the existing <code>darkbg</code>, so both work and nothing breaks; (2) set <code>--bg-surface</code> to the same hex <code>darkbg</code> already was; (3) migrate call sites in independently verifiable batches; (4) only now set the light value, and every migrated site follows automatically. That fourth step is the payoff, and it was unreachable while the name said <code>dark</code>.',
            'Biến cái tên mới thành từ đồng nghĩa TRƯỚC chính là thứ làm cho cuộc tái cấu trúc 641 chỗ trở nên nhàm chán, và nhàm chán mới là mục tiêu — mọi commit ở bước 3 đều không đổi gì về hình ảnh, nên người review chỉ phải xác nhận phép ánh xạ có đúng không, chẳng có hành vi nào phải suy luận. Bỏ nó đi thì hai thay đổi ập đến cùng lúc: bây giờ bất kỳ pixel nào xê dịch cũng có thể là phép đổi tên sai, hoặc là màu mới đang được áp, và không có cách nào phân biệt trên 641 chỗ. Trình tự đủ là: (1) khai <code>surface: "var(--bg-surface)"</code> song song với <code>darkbg</code> đang có, để cả hai cùng chạy và không gì vỡ; (2) đặt <code>--bg-surface</code> bằng đúng mã hex mà <code>darkbg</code> vốn là; (3) chuyển các chỗ gọi theo từng lô kiểm chứng độc lập được; (4) tới lúc này mới đặt giá trị cho theme sáng, và mọi chỗ đã chuyển tự động đi theo. Bước thứ tư ấy là phần thưởng, và nó không với tới được chừng nào cái tên còn ghi <code>dark</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'An accessibility audit greps for <code>motion-reduce:animate-none</code> next to each animated class and reports six unguarded infinite animations. The finding was WRONG. What was the mistake, and what is the rule?',
            'Một đợt rà trợ năng grep tìm <code>motion-reduce:animate-none</code> bên cạnh từng lớp hoạt ảnh rồi báo sáu hoạt ảnh vô hạn không được canh chừng. Kết luận ấy SAI. Sai ở đâu, và luật rút ra là gì?',
          ),
          options: [
            B(
              'The grep matched the wrong quoting style, so it under-counted — always test a grep against a known-positive line before trusting its output',
              'Phép grep khớp sai kiểu dấu nháy nên nó đếm thiếu — luôn thử grep trên một dòng chắc chắn khớp trước khi tin kết quả của nó',
            ),
            B(
              'It checked ONE of two possible guarding mechanisms and missed the plain CSS <code>@media (prefers-reduced-motion: reduce)</code> block naming those classes — enumerate every way X could be handled before reporting X is not handled',
              'Nó kiểm MỘT trong hai cơ chế canh chừng có thể có và bỏ sót khối CSS thuần <code>@media (prefers-reduced-motion: reduce)</code> có nêu tên đúng những lớp ấy — hãy liệt kê mọi cách X CÓ THỂ được xử lý trước khi báo rằng X chưa được xử lý',
            ),
            B(
              'The animations are transform-only and therefore GPU-composited, which exempts them from reduced-motion requirements entirely',
              'Các hoạt ảnh ấy chỉ dùng transform nên được GPU tổng hợp, và điều đó miễn cho chúng khỏi mọi yêu cầu về giảm chuyển động',
            ),
            B(
              'Nine of the thirteen declared animations are unused, so six unguarded uses is impossible arithmetic and the audit contradicted itself',
              'Chín trong mười ba hoạt ảnh khai báo không ai dùng, nên "sáu lượt không canh chừng" là phép tính bất khả và bản rà tự mâu thuẫn',
            ),
          ],
          correct: 1,
          explanation: EX(
            'There are two ways to guard an animation and the audit checked one. The variant form <code>animate-float motion-reduce:animate-none</code> is visible at the call site and greppable, and must be repeated at every use — so the fifth use added six months later is the one that forgets. The CSS form is a single <code>@media (prefers-reduced-motion: reduce)</code> block naming the classes; it covers every use forever including ones added later, and it is invisible from the component, which is exactly what tripped the audit. This repository uses both, and all four of its live animations are named in the CSS block. A false negative in an audit is worse than no audit: acting on this one would have added a redundant variant to six elements, and the next reader would see the variant on some uses and not others and conclude the bare ones are bugs. A wrong audit does not stay wrong quietly — it propagates into the code as noise.',
            'Có HAI cách canh một hoạt ảnh và bản rà chỉ kiểm một. Dạng biến thể <code>animate-float motion-reduce:animate-none</code> nhìn thấy được ngay tại chỗ gọi và grep ra được, nhưng phải lặp lại ở MỌI lượt dùng — nên lượt thứ năm thêm vào sáu tháng sau chính là lượt bị quên. Dạng CSS là một khối <code>@media (prefers-reduced-motion: reduce)</code> duy nhất nêu tên các lớp; nó phủ mọi lượt dùng mãi mãi kể cả lượt thêm sau này, và nó VÔ HÌNH từ phía component — đúng thứ đã làm bản rà vấp. Kho này dùng cả hai, và cả bốn hoạt ảnh đang sống đều được nêu tên trong khối CSS. Một âm tính giả trong một bản rà còn tệ hơn không rà: hành động theo nó là thêm một biến thể thừa vào sáu thẻ, rồi người đọc sau thấy biến thể ấy ở vài chỗ mà không có ở chỗ khác sẽ kết luận mấy chỗ trơn là bọ. Một bản rà sai không nằm im mà sai — nó lan vào mã dưới dạng nhiễu.',
          ),
        }),

        mcq({
          prompt: B(
            'A plugin is measured on 3.4.14. This is the whole output for <code>class="hocus:p-4 text-balance hocus:md:p-2"</code>:' + code(
              "plugin(({ addVariant, addUtilities }) => {\n" +
              "  addVariant('hocus', ['&:hover', '&:focus-visible']);\n" +
              "  addUtilities({ '.text-balance': { 'text-wrap': 'balance' } });\n" +
              '})\n' +
              '\n' +
              '.text-balance          { text-wrap: balance }\n' +
              '.hocus\\:p-4:hover         { padding: 1rem }\n' +
              '.hocus\\:p-4:focus-visible { padding: 1rem }\n' +
              '@media (min-width: 768px) {\n' +
              '  .hocus\\:md\\:p-2:hover         { padding: 0.5rem }\n' +
              '  .hocus\\:md\\:p-2:focus-visible { padding: 0.5rem }\n' +
              '}',
            ) + 'Which half of this plugin earns the dependency, and which does not?',
            'Một plugin được đo trên 3.4.14. Đây là toàn bộ đầu ra cho <code>class="hocus:p-4 text-balance hocus:md:p-2"</code>:' + code(
              "plugin(({ addVariant, addUtilities }) => {\n" +
              "  addVariant('hocus', ['&:hover', '&:focus-visible']);\n" +
              "  addUtilities({ '.text-balance': { 'text-wrap': 'balance' } });\n" +
              '})\n' +
              '\n' +
              '.text-balance          { text-wrap: balance }\n' +
              '.hocus\\:p-4:hover         { padding: 1rem }\n' +
              '.hocus\\:p-4:focus-visible { padding: 1rem }\n' +
              '@media (min-width: 768px) {\n' +
              '  .hocus\\:md\\:p-2:hover         { padding: 0.5rem }\n' +
              '  .hocus\\:md\\:p-2:focus-visible { padding: 0.5rem }\n' +
              '}',
            ) + 'Nửa nào của plugin này xứng với một gói phụ thuộc, và nửa nào không?',
          ),
          options: [
            B(
              'Neither: both halves are expressible in a stylesheet, so the plugin API is only ever justified for reading the resolved theme',
              'Không nửa nào: cả hai đều viết được bằng bảng kiểu thuần, nên API plugin chỉ đáng dùng khi cần đọc theme đã giải',
            ),
            B(
              '<code>addVariant</code> earns it — it makes a variant available on EVERY utility, composes with <code>md:</code>, and cannot be reproduced by hand; <code>addUtilities</code> for one fixed rule is three lines in <code>@layer utilities</code>',
              '<code>addVariant</code> xứng — nó làm một biến thể dùng được trên MỌI tiện ích, kết hợp được với <code>md:</code>, và không tái tạo bằng tay được; còn <code>addUtilities</code> cho đúng một quy tắc cố định thì chỉ là ba dòng trong <code>@layer utilities</code>',
            ),
            B(
              '<code>addUtilities</code> earns it, because a plugin-registered utility is known to <code>tailwind-merge</code> automatically while a hand-written one is not',
              '<code>addUtilities</code> xứng, vì một tiện ích do plugin đăng ký thì <code>tailwind-merge</code> tự biết còn một tiện ích viết tay thì không',
            ),
            B(
              'Both equally: anything written as a plugin is tree-shaken and anything written in CSS always ships, so the plugin form is strictly smaller',
              'Cả hai như nhau: thứ gì viết dạng plugin cũng được rung cây loại bỏ còn thứ gì viết trong CSS thì luôn được xuất xưởng, nên dạng plugin luôn nhỏ hơn',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Read the output: one <code>addVariant</code> line produced two rules per utility, and the variant composed with <code>md:</code> to produce two more inside the media query — for every utility in the framework, present and future. Reproducing that by hand is not 300 lines, it is impossible. The utility half is the opposite: <code>.text-balance</code> is one static rule, and wrapping it in a build-time dependency buys nothing over three lines in <code>@layer utilities</code>. The third plugin form, not shown here, is the one that most justifies the machinery — generating a family of utilities FROM the resolved theme, so adding a spacing key automatically produces the matching utility instead of a parallel list to maintain. This repository ships <code>plugins: []</code> with the reason recorded next to the consequence: <code>@tailwindcss/typography</code> would force <code>.prose</code> colours the dark theme does not want, so the team chose roughly 300 hand-written lines it controls over a dependency plus an unbounded fight with its colour defaults. And note the general shape — a plugin brings DECISIONS, not just code, and you cannot take only half of them.',
            'Đọc đầu ra: một dòng <code>addVariant</code> đẻ ra hai quy tắc cho mỗi tiện ích, và cái biến thể ấy kết hợp được với <code>md:</code> để đẻ thêm hai quy tắc nữa bên trong truy vấn media — cho mọi tiện ích của khung, hiện tại lẫn tương lai. Tái tạo chuyện đó bằng tay không phải 300 dòng, mà là bất khả. Nửa tiện ích thì ngược lại: <code>.text-balance</code> là một quy tắc tĩnh, và bọc nó trong một gói phụ thuộc lúc dựng chẳng mua được gì so với ba dòng trong <code>@layer utilities</code>. Dạng plugin thứ ba, không có trong đầu ra này, mới là dạng biện minh mạnh nhất cho cả bộ máy — sinh cả một họ tiện ích TỪ theme đã giải, nên thêm một khoá spacing là tự động có tiện ích tương ứng thay vì phải nuôi một danh sách song song. Kho này xuất xưởng với <code>plugins: []</code> và lý do ghi ngay cạnh hệ quả: <code>@tailwindcss/typography</code> sẽ ép các màu <code>.prose</code> mà theme tối không muốn, nên đội ngũ chọn khoảng 300 dòng viết tay mà họ kiểm soát thay vì một gói phụ thuộc cộng một cuộc chiến không hồi kết với màu mặc định của nó. Và để ý hình dạng chung — một plugin mang theo QUYẾT ĐỊNH chứ không chỉ mã, và bạn không lấy được nửa này mà bỏ nửa kia.',
          ),
        }),

        // ── Chương 6 — Biến CSS ─────────────────────────────────────────
        mcq({
          prompt: B(
            'A preview pane must render in the opposite theme to the page around it, using the SAME component and the same class names. Both nested elements below write <code>bg-card text-text-primary</code>.' + code(
              '<div class="bg-card">                      <!-- page theme -->\n' +
              '  <div style="--bg-card:#18191a; --text-primary:#e4e6eb">\n' +
              '    <div class="bg-card text-text-primary">…</div>\n' +
              '  </div>\n' +
              '</div>',
            ) + 'Why does this work, and what could <code>dark:</code> not do here?',
            'Một khung xem trước phải hiển thị theo theme ngược với trang bao quanh nó, dùng CÙNG component và cùng tên lớp. Cả hai thẻ lồng nhau dưới đây đều viết <code>bg-card text-text-primary</code>.' + code(
              '<div class="bg-card">                      <!-- theme của trang -->\n' +
              '  <div style="--bg-card:#18191a; --text-primary:#e4e6eb">\n' +
              '    <div class="bg-card text-text-primary">…</div>\n' +
              '  </div>\n' +
              '</div>',
            ) + 'Vì sao cách này chạy được, và <code>dark:</code> không làm được gì ở đây?',
          ),
          options: [
            B(
              'It does not work: a custom property set in a <code>style</code> attribute is scoped to that element only and is not inherited by descendants',
              'Nó không chạy: một thuộc tính tuỳ chỉnh đặt trong thuộc tính <code>style</code> chỉ bó vào đúng thẻ đó và không được các thẻ con thừa hưởng',
            ),
            B(
              'Tailwind re-generates the two utilities once per theme block it finds, which is why the same class name can carry two values',
              'Tailwind sinh lại hai tiện ích ấy một lần cho mỗi khối theme nó tìm thấy, và vì thế cùng một tên lớp mang được hai giá trị',
            ),
            B(
              'Variables cascade, so redefining them on a subtree gives a SCOPED theme — while <code>dark:</code> compiles to <code>:is(.dark *)</code>, which has no scope limit and switches every such utility in the document at once',
              'Biến CSS lan theo cascade, nên định nghĩa lại chúng trên một nhánh cây là có ngay một theme CÓ PHẠM VI — còn <code>dark:</code> biên dịch thành <code>:is(.dark *)</code>, thứ không có giới hạn phạm vi nào và bật mọi tiện ích loại đó trong cả tài liệu một lượt',
            ),
            B(
              'Because <code>style</code> attributes beat stylesheet rules, the inline values override the utilities entirely and the class names are decorative',
              'Vì thuộc tính <code>style</code> thắng quy tắc trong bảng kiểu, các giá trị inline ghi đè hẳn lên tiện ích và mấy cái tên lớp chỉ là trang trí',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Tailwind emits <code>var(--bg-card)</code> literally and never resolves it; resolution happens in the browser, per element, at paint time, against whichever definition is nearest in the ancestor chain. So the inner element runs identical class names and renders differently — that is a scoped theme with no variant, no second class and no rebuild. Custom properties inherit like any other inherited property, which is what makes the <code>style</code> attribute on a container work for its whole subtree. This is precisely what the Notes feature needed in the 2026-07-02 incident and what <code>.dark</code> could not give it: <code>:is(.dark *)</code> matches any descendant of ANY <code>.dark</code> ancestor anywhere, so putting the class high in the tree activated all 786 <code>dark:</code> utilities at once. One guard worth keeping: an undefined variable is invalid at computed-value time, so the declaration is dropped and the element inherits its parent\'s colour — often close enough to look intentional. Supply a fallback for anything load-bearing: <code>var(--text-primary, #1c1e21)</code>.',
            'Tailwind phát sinh <code>var(--bg-card)</code> NGUYÊN VĂN và không bao giờ phân giải nó; việc phân giải diễn ra trong trình duyệt, theo từng thẻ, lúc vẽ, dựa vào định nghĩa gần nhất trên chuỗi tổ tiên. Nên thẻ bên trong chạy đúng những tên lớp ấy mà hiển thị khác đi — đó là một theme có phạm vi, không cần biến thể, không cần lớp thứ hai, không cần dựng lại. Thuộc tính tuỳ chỉnh được thừa hưởng như mọi thuộc tính kế thừa khác, và đó là thứ làm cho thuộc tính <code>style</code> trên một hộp chứa có hiệu lực cho cả nhánh cây bên dưới. Đây đúng là thứ tính năng Notes cần trong sự cố 02/07/2026 và là thứ <code>.dark</code> không cho được: <code>:is(.dark *)</code> khớp mọi con cháu của BẤT KỲ tổ tiên <code>.dark</code> nào ở bất kỳ đâu, nên đặt cái lớp ấy lên cao trong cây là bật một lượt cả 786 tiện ích <code>dark:</code>. Một lá chắn đáng giữ: biến chưa định nghĩa thì không hợp lệ ở thời điểm tính giá trị, nên khai báo bị vứt và thẻ thừa hưởng màu của cha — thường đủ gần để trông như cố ý. Hãy cho phương án dự phòng với những thứ chịu lực: <code>var(--text-primary, #1c1e21)</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Two ways to reach the same variable, compiling to identical CSS: a config entry used as <code>text-text-secondary</code>, or the bracket form <code>text-[var(--text-secondary)]</code>, which this repository writes 281 times. What is the real difference?',
            'Hai cách với tới cùng một biến, biên dịch ra CSS y hệt nhau: một mục config dùng dưới dạng <code>text-text-secondary</code>, hoặc dạng ngoặc <code>text-[var(--text-secondary)]</code> mà kho này viết 281 lần. Khác biệt thật sự là gì?',
          ),
          options: [
            B(
              'The bracket form is resolved at build time and the config form at runtime, so only the config form follows a theme toggle',
              'Dạng ngoặc được giải lúc dựng còn dạng config lúc chạy, nên chỉ dạng config mới đi theo công tắc theme',
            ),
            B(
              'Maintainability only: the variable name appears ONCE in the config versus 281 times at call sites, autocomplete works, and a typo in the bracket form generates fine and resolves to nothing, so the text silently inherits its parent colour',
              'Chỉ là khả năng bảo trì: tên biến xuất hiện MỘT lần trong config so với 281 lần ở các chỗ gọi, tự động hoàn thành hoạt động, và một lỗi gõ trong dạng ngoặc vẫn sinh ra quy tắc bình thường rồi phân giải thành không gì cả, nên chữ âm thầm thừa hưởng màu của thẻ cha',
            ),
            B(
              'The bracket form cannot take an opacity modifier at all, while the config form always can, which is why the 281 uses must be migrated before anything else',
              'Dạng ngoặc hoàn toàn không nhận được bổ từ độ mờ còn dạng config thì luôn nhận được, và vì thế 281 lượt kia phải được chuyển đổi trước mọi thứ khác',
            ),
            B(
              'Output size: 281 bracket classes each emit their own rule, while the config form emits one rule shared by every call site',
              'Kích thước đầu ra: 281 lớp dạng ngoặc mỗi cái sinh một quy tắc riêng, còn dạng config chỉ sinh một quy tắc dùng chung cho mọi chỗ gọi',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Both forms emit the same rule and both resolve in the browser, so nothing about behaviour or output size separates them — <code>text-[var(--x)]</code> written 281 times still deduplicates to one rule, because the generator emits the vocabulary, not the use sites. What differs is where the variable NAME lives. In the config it appears once, renaming <code>--text-secondary</code> is a one-line change, and the editor can autocomplete the class so a typo produces a visibly wrong class name. In the bracket form the name is repeated at every call site with no autocomplete, and a typo produces a class that generates perfectly and refers to an undefined variable — invalid at computed-value time, declaration dropped, text inherits the parent colour, no error at any stage. That is why the 281 uses are worth migrating even though nothing is broken today, and why the course orders that migration second: mechanical, byte-identical output, and stoppable half-done indefinitely.',
            'Cả hai dạng đều sinh cùng một quy tắc và cả hai đều phân giải trong trình duyệt, nên chẳng có gì về hành vi hay kích thước đầu ra phân biệt chúng — <code>text-[var(--x)]</code> viết 281 lần vẫn khử trùng lặp về một quy tắc, vì trình sinh phát sinh theo VỐN TỪ chứ không theo số chỗ dùng. Cái khác nhau là TÊN BIẾN sống ở đâu. Trong config nó xuất hiện một lần, đổi tên <code>--text-secondary</code> là sửa một dòng, và trình soạn thảo gợi ý được tên lớp nên gõ sai sẽ ra một tên lớp sai lồ lộ. Ở dạng ngoặc, cái tên bị lặp ở mọi chỗ gọi, không có gợi ý, và gõ sai thì sinh ra một lớp hoàn hảo trỏ tới một biến không tồn tại — không hợp lệ ở thời điểm tính giá trị, khai báo bị vứt, chữ thừa hưởng màu của cha, không lỗi ở khâu nào cả. Vì thế 281 lượt ấy đáng chuyển đổi dù hôm nay chẳng có gì hỏng, và vì thế giáo trình xếp cuộc chuyển đổi ấy ở vị trí thứ hai: máy móc, đầu ra giống hệt từng byte, và dừng giữa chừng bao lâu cũng được.',
          ),
        }),

        mcq({
          prompt: B(
            'The fix for the opacity trap is two changes — variables rewritten as space-separated channels, and the config wrapped in <code>rgb(… / &lt;alpha-value&gt;)</code>. Why must they ship in ONE commit?',
            'Cách sửa cái bẫy độ mờ gồm hai thay đổi — viết lại biến thành các kênh cách nhau bằng dấu cách, và bọc trong config bằng <code>rgb(… / &lt;alpha-value&gt;)</code>. Vì sao chúng phải đi trong MỘT commit?',
          ),
          options: [
            B(
              'Because half the change produces an invalid colour — config alone gives <code>rgb(#65676b / 1)</code>, variables alone give a value that is not a colour — so a partial deploy breaks all 4,304 uses of that colour, from a change meant to fix 91',
              'Vì nửa thay đổi cho ra một màu KHÔNG HỢP LỆ — chỉ đổi config thì được <code>rgb(#65676b / 1)</code>, chỉ đổi biến thì được một giá trị không phải màu — nên một lần triển khai nửa vời làm hỏng cả 4.304 lượt dùng màu ấy, từ một thay đổi vốn định sửa 91 chỗ',
            ),
            B(
              'Because Tailwind caches the resolved config, and two commits produce two cache entries that fight until the cache is cleared by hand',
              'Vì Tailwind lưu đệm config đã giải, và hai commit sinh ra hai mục đệm đánh nhau cho tới khi ai đó xoá đệm bằng tay',
            ),
            B(
              'They do not have to: the two halves are independent, and shipping the config first simply leaves the opacity modifiers broken for one more deploy',
              'Không nhất thiết: hai nửa độc lập nhau, và triển khai config trước chỉ đơn giản là để các bổ từ độ mờ hỏng thêm một lượt deploy nữa',
            ),
            B(
              'Because the channel form is only valid in a <code>:root</code> block, so the variables must be moved and rewritten together or the theme blocks stop matching',
              'Vì dạng kênh chỉ hợp lệ trong khối <code>:root</code>, nên các biến phải được dời và viết lại cùng lúc, không thì các khối theme thôi khớp nhau',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the migration hazard that makes the fix worse than the bug if it is split. Change only the config and the emitted value becomes <code>rgb(#65676b / 1)</code>, which is not valid CSS and renders nothing. Change only the variables and <code>var(--text-muted)</code> resolves to <code>101 103 107</code>, also not a colour. Either half alone turns a 91-class opacity defect into a 4,304-site invisible-text incident — and the danger is not carelessness but ordinary process: two commits that get reverted independently, or a config file that ships in a build the CSS file missed. Two more details from the same lesson: the channel format is genuinely unreadable, so keep the hex in a comment because there is no way to have both in the value; and only convert colours that actually take an opacity modifier, since a variable already holding <code>rgba(0,0,0,0.04)</code> cannot become three channels without someone deciding what its opacity should be.',
            'Đây là mối nguy chuyển đổi làm cho phép sửa còn tệ hơn con bọ nếu bị chẻ đôi. Chỉ đổi config thì giá trị phát sinh thành <code>rgb(#65676b / 1)</code>, không phải CSS hợp lệ và không dựng ra gì. Chỉ đổi biến thì <code>var(--text-muted)</code> giải ra <code>101 103 107</code>, cũng không phải một màu. Nửa nào đứng một mình cũng biến một khiếm khuyết độ mờ ở 91 lớp thành một sự cố chữ-vô-hình ở 4.304 chỗ — và nguy cơ không nằm ở sự cẩu thả mà ở quy trình bình thường: hai commit bị revert độc lập nhau, hoặc một file config lên bản dựng mà file CSS lỡ chuyến. Thêm hai chi tiết từ cùng bài học: dạng kênh thật sự không đọc nổi nên hãy giữ mã hex trong một chú thích, vì không có cách nào để cả hai cùng nằm trong giá trị; và chỉ chuyển những màu THẬT SỰ có dùng bổ từ độ mờ, vì một biến vốn đã mang <code>rgba(0,0,0,0.04)</code> thì không thành ba kênh được nếu chưa ai quyết độ mờ của nó nên là bao nhiêu.',
          ),
        }),

        mcq({
          prompt: B(
            'The opacity trap survived TypeScript, ESLint, the build, code review and visual regression tests. What kind of check catches it, and what is the general principle?' + code(
              '$ grep -rhoE \'[a-z-]+-(text|cat)-[a-z-]+/[0-9]+\' src --include="*.tsx" | sort -u \\\n' +
              '    | while read -r cls; do\n' +
              '        esc=$(echo "$cls" | sed \'s#/#\\\\\\\\/#\')\n' +
              '        grep -q "$esc" .next/static/css/*.css || echo "DEAD: $cls"\n' +
              '      done',
            ),
            'Cái bẫy độ mờ sống sót qua TypeScript, ESLint, bản dựng, review mã và cả kiểm hồi quy hình ảnh. Loại phép kiểm nào bắt được nó, và nguyên tắc chung là gì?' + code(
              '$ grep -rhoE \'[a-z-]+-(text|cat)-[a-z-]+/[0-9]+\' src --include="*.tsx" | sort -u \\\n' +
              '    | while read -r cls; do\n' +
              '        esc=$(echo "$cls" | sed \'s#/#\\\\\\\\/#\')\n' +
              '        grep -q "$esc" .next/static/css/*.css || echo "DEAD: $cls"\n' +
              '      done',
            ),
          ),
          options: [
            B(
              'A stricter type for class names, so an unknown utility becomes a compile error — the only durable fix, since a shell check can be skipped',
              'Một kiểu chặt hơn cho tên lớp, để một tiện ích lạ thành lỗi biên dịch — cách sửa bền duy nhất, vì một phép kiểm shell thì bỏ qua được',
            ),
            B(
              'A check against the ARTEFACT: assert that every opacity-modified class in the source actually reached the built CSS, because the interesting bugs are the ones that produce no error, so the check must look at what shipped rather than at an exit code',
              'Một phép kiểm trên HIỆN VẬT: khẳng định mọi lớp có bổ từ độ mờ trong mã nguồn đều thật sự tới được CSS đã dựng, vì những con bọ đáng sợ là những con không sinh ra lỗi nào, nên phép kiểm phải nhìn vào thứ đã xuất xưởng chứ không nhìn mã thoát',
            ),
            B(
              'A visual regression suite with a fresh baseline, since the difference between 60% and 100% opacity is exactly what pixel diffing is for',
              'Một bộ kiểm hồi quy hình ảnh với ảnh nền mới, vì khác biệt giữa 60% và 100% độ mờ đúng là thứ phép so pixel sinh ra để bắt',
            ),
            B(
              'Nothing automated can: the failure is a design judgement about how transparent text should be, so it needs a human reviewing the rendered page',
              'Không phép tự động nào bắt được: đây là một phán đoán thiết kế về việc chữ nên trong suốt tới đâu, nên nó cần một con người xem trang đã dựng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Every layer of tooling was happy for a structural reason. TypeScript never sees class strings. ESLint has no opinion about a class that does not exist. The build succeeds because a missing rule is not an error. Visual regression passes if the baseline was captured after the bug existed — which it was. And the rendered result, muted grey at 100% instead of 60%, reads as a design choice rather than a defect. Ten lines in CI turn that silent visual defect into a build failure, and the principle generalises past this bug: check the artefact, not the exit code. Note also the narrower lesson that makes people trust the broken class in the first place — the base class and its opacity variants are generated INDEPENDENTLY, so <code>text-text-muted</code> rendering perfectly says nothing about <code>text-text-muted/60</code>. One build and one grep settles it permanently for a given colour.',
            'Từng tầng công cụ đều hài lòng vì một lý do cấu trúc. TypeScript không bao giờ nhìn thấy chuỗi lớp. ESLint chẳng có ý kiến gì về một cái lớp không tồn tại. Bản dựng thành công vì thiếu một quy tắc không phải là lỗi. Kiểm hồi quy hình ảnh thì qua nếu ảnh nền được chụp SAU khi con bọ đã có — và nó đã được chụp sau. Còn kết quả hiển thị, chữ xám mờ ở 100% thay vì 60%, đọc ra như một lựa chọn thiết kế chứ không phải một khiếm khuyết. Mười dòng trong CI biến khiếm khuyết hình ảnh im lặng ấy thành một bản dựng đỏ, và nguyên tắc này khái quát vượt ra ngoài con bọ này: hãy kiểm HIỆN VẬT, đừng kiểm mã thoát. Cũng để ý bài học hẹp hơn — thứ khiến người ta tin tưởng cái lớp hỏng ngay từ đầu: lớp nền và các biến thể độ mờ của nó được sinh ĐỘC LẬP với nhau, nên <code>text-text-muted</code> hiển thị hoàn hảo chẳng nói lên điều gì về <code>text-text-muted/60</code>. Một lần dựng và một lần grep là dứt điểm vĩnh viễn cho một màu.',
          ),
        }),

        mcq({
          prompt: B(
            'This theme puts LIGHT in <code>:root</code> and overrides 40 of its 42 variables in <code>html.theme-dark</code>. Why does that direction matter, and why is 40 rather than 42 a good sign?',
            'Theme này đặt SÁNG trong <code>:root</code> rồi đè 40 trên 42 biến của nó trong <code>html.theme-dark</code>. Vì sao CHIỀU ấy quan trọng, và vì sao con số 40 chứ không phải 42 lại là dấu hiệu tốt?',
          ),
          options: [
            B(
              'Light must be the base because <code>color-scheme: light</code> can only be declared on <code>:root</code>, and the two un-overridden variables are the ones the dark block failed to define',
              'Sáng buộc phải là nền vì <code>color-scheme: light</code> chỉ khai được trên <code>:root</code>, và hai biến không bị đè là hai biến mà khối tối quên định nghĩa',
            ),
            B(
              'The direction is arbitrary; what matters is only that the override block has higher specificity, and 40 versus 42 is an accident of how the palette was authored',
              'Chiều nào cũng được; điều quan trọng chỉ là khối ghi đè có độ đặc hiệu cao hơn, còn 40 so với 42 là chuyện tình cờ của cách bảng màu được viết ra',
            ),
            B(
              'Dark must never be the base because dark values fail contrast checks when the theme class is missing, which is what makes the base choice a WCAG requirement',
              'Tối không bao giờ được làm nền vì giá trị tối trượt kiểm tương phản khi thiếu lớp theme, và đó là thứ biến lựa chọn nền thành một yêu cầu WCAG',
            ),
            B(
              '<code>:root</code> is what renders before the theme script runs or if it fails, so a light base fails readably — and two variables genuinely shared by both themes is healthier than a dark block overriding all 42',
              '<code>:root</code> là thứ được dựng trước khi script theme chạy hoặc khi nó hỏng, nên nền sáng thì hỏng vẫn đọc được — và hai biến thật sự dùng chung cho cả hai theme thì lành mạnh hơn một khối tối đè cả 42',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Whatever <code>:root</code> holds is what renders when no theme class is present: during the first paint before JavaScript runs, in a server-rendered response, or if the theme script throws. A light base means a failure produces a readable light page; a dark base would give a user who chose light a dark page at exactly the moment something else already went wrong. The 40-of-42 figure is a structural signal rather than an oddity: two values are deliberately theme-independent, such as an accent hue that is the brand colour in both modes. A dark block overriding all 42 would suggest the base block contains nothing shared, which usually means the two themes are really two unrelated palettes wearing one variable namespace. And the asymmetry has a trap of its own — a variable added only to <code>html.theme-dark</code> works in dark and renders as nothing in light, because an undefined variable is invalid at computed-value time. Add to <code>:root</code> first, then override.',
            'Thứ gì nằm trong <code>:root</code> là thứ được dựng khi không có lớp theme nào: ở lần vẽ đầu tiên trước khi JavaScript chạy, trong một phản hồi dựng ở máy chủ, hoặc khi script theme ném lỗi. Nền sáng nghĩa là hỏng thì ra một trang sáng đọc được; nền tối thì lại đưa một trang tối cho người dùng vốn đã chọn sáng, đúng vào lúc có thứ khác đã trục trặc. Con số 40 trên 42 là một tín hiệu cấu trúc chứ không phải chuyện lạ: hai giá trị cố ý không phụ thuộc theme, ví dụ một sắc nhấn vốn là màu thương hiệu ở cả hai chế độ. Một khối tối đè cả 42 sẽ ngụ ý khối nền chẳng chứa thứ gì dùng chung, mà điều đó thường nghĩa là hai theme thật ra là hai bảng màu chẳng liên quan gì, chỉ đội chung một không gian tên biến. Và sự bất đối xứng ấy có cái bẫy riêng — một biến chỉ thêm vào <code>html.theme-dark</code> thì chạy ở chế độ tối và dựng ra hư vô ở chế độ sáng, vì biến chưa định nghĩa là không hợp lệ ở thời điểm tính giá trị. Hãy thêm vào <code>:root</code> trước, rồi mới đè.',
          ),
        }),

        mcq({
          prompt: B(
            'Alongside <code>:root</code> (light) and <code>html.theme-dark</code>, this stylesheet has an <code>html.light</code> block whose nineteen variables repeat values already in <code>:root</code>. When is that not dead weight?',
            'Bên cạnh <code>:root</code> (sáng) và <code>html.theme-dark</code>, bảng kiểu này còn một khối <code>html.light</code> với mười chín biến lặp lại đúng những giá trị đã có trong <code>:root</code>. Khi nào đó không phải gánh nặng thừa?',
          ),
          options: [
            B(
              'Never — it is duplication by definition, and the fix is to delete the block and let the theme script remove the dark class instead',
              'Không bao giờ — theo định nghĩa đó là trùng lặp, và cách sửa là xoá khối ấy đi rồi để script theme gỡ lớp tối ra',
            ),
            B(
              'When any variable is used with an opacity modifier, since <code>:root</code> values cannot carry the channel format that <code>&lt;alpha-value&gt;</code> requires',
              'Khi có biến nào được dùng kèm bổ từ độ mờ, vì giá trị trong <code>:root</code> không mang được dạng kênh mà <code>&lt;alpha-value&gt;</code> đòi hỏi',
            ),
            B(
              'When the page is server-rendered, because <code>:root</code> is not applied until hydration completes and a class selector is needed before then',
              'Khi trang được dựng ở máy chủ, vì <code>:root</code> chưa được áp cho tới khi hydration xong nên cần một selector lớp trước lúc đó',
            ),
            B(
              'When the theme script SWAPS classes rather than removing one: light must then be defined explicitly, it beats <code>:root</code> on specificity, and it distinguishes "the user chose light" from "no choice has been made yet"',
              'Khi script theme HOÁN ĐỔI lớp chứ không gỡ bỏ: lúc ấy sáng phải được khai tường minh, nó thắng <code>:root</code> về độ đặc hiệu, và nó phân biệt "người dùng ĐÃ CHỌN sáng" với "chưa có lựa chọn nào"',
            ),
          ],
          correct: 3,
          explanation: EX(
            'It depends entirely on how the toggle is implemented, and both models are defensible. If the script only ever adds or removes <code>theme-dark</code>, then removing it falls back to <code>:root</code>, which is light, and the <code>html.light</code> block genuinely is unnecessary. If the script always sets SOME class, light must define the light values explicitly or the toggle has nothing to switch to. The swap model is more robust for a third reason worth planning around: it distinguishes an explicit user choice from the absence of one, which is what you need the day someone asks for a "follow the system" option — a codebase that only removes the dark class cannot express that difference and has to add a third state from scratch. The specificity point is a bonus: a class selector beats <code>:root</code>, so an explicit choice cannot be undercut by a stray base value.',
            'Chuyện này hoàn toàn phụ thuộc cách cài đặt công tắc, và cả hai mô hình đều bảo vệ được. Nếu script chỉ thêm hoặc gỡ <code>theme-dark</code> thì gỡ nó ra là rơi về <code>:root</code>, vốn là sáng, và khối <code>html.light</code> thật sự thừa. Nếu script LÚC NÀO CŨNG đặt MỘT lớp nào đó thì sáng buộc phải khai giá trị sáng tường minh, không thì công tắc chẳng có gì để chuyển sang. Mô hình hoán đổi vững hơn vì lý do thứ ba đáng tính trước: nó phân biệt một lựa chọn tường minh của người dùng với việc chưa hề có lựa chọn nào, và đó chính là thứ bạn cần vào ngày có người xin thêm tuỳ chọn "theo hệ thống" — một kho mã chỉ biết gỡ lớp tối thì không diễn đạt nổi khác biệt ấy và phải dựng trạng thái thứ ba từ đầu. Điểm về độ đặc hiệu là phần thưởng thêm: một selector lớp thắng <code>:root</code>, nên một lựa chọn tường minh không bị một giá trị nền lạc chỗ cắt ngang.',
          ),
        }),

        mcq({
          prompt: B(
            'A developer likes the theme-variable result so much they apply it per element. Two hundred cards render like this. What has that traded away?' + code(
              '{items.map((it) => (\n' +
              '  <div key={it.id} style={{ "--card-bg": it.colour }} className="bg-[var(--card-bg)] p-4">\n' +
              '    …\n' +
              '  </div>\n' +
              '))}',
            ),
            'Một lập trình viên thích kết quả của biến theme tới mức áp nó cho từng thẻ. Hai trăm thẻ bài dựng ra như thế này. Cách đó đánh đổi mất gì?' + code(
              '{items.map((it) => (\n' +
              '  <div key={it.id} style={{ "--card-bg": it.colour }} className="bg-[var(--card-bg)] p-4">\n' +
              '    …\n' +
              '  </div>\n' +
              '))}',
            ),
          ),
          options: [
            B(
              'The class <code>bg-[var(--card-bg)]</code> is generated once per distinct colour, so two hundred colours mean two hundred rules in the stylesheet',
              'Lớp <code>bg-[var(--card-bg)]</code> được sinh một lần cho mỗi màu khác nhau, nên hai trăm màu là hai trăm quy tắc trong bảng kiểu',
            ),
            B(
              'Nothing measurable: custom properties are cheap, and a value that comes from data has no other legal home in a utility-first codebase',
              'Không mất gì đo được: thuộc tính tuỳ chỉnh rất rẻ, và một giá trị đến từ dữ liệu thì trong kho mã utility-first cũng chẳng có chỗ hợp lệ nào khác',
            ),
            B(
              'The DEDUPLICATION: the class is emitted once, but every element now carries an inline <code>style</code> attribute, so the duplication has moved from the stylesheet — where it was deduplicated — into the markup, where it is not',
              'Phép KHỬ TRÙNG LẶP: cái lớp chỉ sinh một lần, nhưng giờ mỗi thẻ mang một thuộc tính <code>style</code> inline, nên sự trùng lặp đã dời từ bảng kiểu — nơi nó được khử — vào mã đánh dấu, nơi nó không được khử',
            ),
            B(
              'Theme support: a variable set in a <code>style</code> attribute cannot be overridden by <code>html.theme-dark</code>, so these cards ignore the theme entirely',
              'Khả năng theo theme: một biến đặt trong thuộc tính <code>style</code> không thể bị <code>html.theme-dark</code> ghi đè, nên mấy thẻ bài này bỏ qua theme hoàn toàn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The class really is generated once — that part is fine — but two hundred copies of the same <code>style</code> string ship in the HTML payload, which is exactly the duplication utility CSS removed and the same argument that ruled out <code>@apply</code>. The distinction is where the variable is SET: on an ancestor it is one declaration inherited by every descendant, which is the scoping that makes the whole technique worth it; on every element it is per-element data wearing a theme\'s clothes. Once you see it as data the honest choice reappears — if the value is genuinely dynamic, an inline <code>style</code> is correct and the variable adds nothing; if it is a fixed set of, say, six category colours, it should be six classes. The other three failure cases for a variable are the same shape: a value that never varies (use the utility), something a variant already expresses (you end up writing the media query anyway, to set the variable), and a class name — no variable can ever become one.',
            'Cái lớp thật sự chỉ được sinh một lần — phần đó không sao — nhưng hai trăm bản sao của cùng một chuỗi <code>style</code> đi theo phần HTML gửi xuống, và đó đúng là sự trùng lặp mà utility CSS đã bỏ được, vẫn đúng lý lẽ đã loại <code>@apply</code>. Điểm phân biệt nằm ở chỗ biến được ĐẶT ở đâu: đặt trên một tổ tiên thì đó là một khai báo được mọi con cháu thừa hưởng, và chính phép bó phạm vi ấy làm cả kỹ thuật này đáng giá; đặt trên từng thẻ thì đó là dữ liệu-theo-thẻ khoác áo theme. Một khi đã nhìn ra nó là dữ liệu thì lựa chọn trung thực hiện ra — nếu giá trị thật sự động thì một <code>style</code> inline là đúng và cái biến chẳng thêm được gì; nếu nó là một tập cố định, chẳng hạn sáu màu chuyên mục, thì nó nên là sáu cái lớp. Ba trường hợp hỏng còn lại của biến CSS cũng cùng hình dạng: một giá trị không bao giờ biến thiên (dùng tiện ích), một thứ mà biến thể đã diễn đạt được (rốt cuộc bạn vẫn phải viết truy vấn media, để đặt cái biến), và một tên lớp — không biến nào có thể trở thành tên lớp được.',
          ),
        }),

        mcq({
          prompt: B(
            'Three findings in the same theme system: (A) 91 dead opacity classes rendering fully opaque, (B) 767 bracket uses that should be config entries, (C) 2,677 theme-named colours that cannot be themed. Which order, and why is the tempting order wrong?',
            'Ba phát hiện trong cùng một hệ theme: (A) 91 lớp độ mờ chết đang hiển thị đục hoàn toàn, (B) 767 lượt dùng dạng ngoặc lẽ ra phải là mục config, (C) 2.677 màu đặt tên theo theme nên không đổi theme được. Thứ tự nào, và vì sao thứ tự hấp dẫn kia lại sai?',
          ),
          options: [
            B(
              'A, then B, then C — impact over risk: A is the only user-visible DEFECT and touches two files, B is mechanical with byte-identical output, C needs design decisions that B makes easier',
              'A, rồi B, rồi C — tác động chia cho rủi ro: A là KHIẾM KHUYẾT duy nhất người dùng thấy được và chỉ chạm hai file, B thì máy móc với đầu ra giống hệt từng byte, C cần những quyết định thiết kế mà B làm cho dễ hơn',
            ),
            B(
              'C, then B, then A — largest first, because the 2,677 renames set the naming pattern everything else must follow and doing them last means redoing work',
              'C, rồi B, rồi A — lớn nhất trước, vì 2.677 phép đổi tên đặt ra khuôn đặt tên mà mọi thứ khác phải theo, và làm nó sau cùng nghĩa là phải làm lại',
            ),
            B(
              'B, then A, then C — the config entries must exist before any colour can carry an <code>&lt;alpha-value&gt;</code> wrapper, so A is blocked until B lands',
              'B, rồi A, rồi C — các mục config phải tồn tại trước khi bất kỳ màu nào mang được lớp bọc <code>&lt;alpha-value&gt;</code>, nên A bị chặn cho tới khi B xong',
            ),
            B(
              'All three as one "theme migration" epic, since they share a subject and splitting them means three separate reviews of the same files',
              'Cả ba gộp thành một hạng mục "chuyển đổi theme", vì chúng cùng một chủ đề và chẻ ra nghĩa là ba lượt review riêng trên cùng những file ấy',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Ordering by size puts C first, and C is the one that changes nothing a user can see, needs design decisions before any code can move, and touches 2,677 sites — so starting there means weeks of churn while 91 actual defects stay broken. A is the opposite on every axis: it is a real user-visible bug, the change is confined to <code>globals.css</code> and the config, and the 91 call sites are not edited at all — they simply start working. B is genuinely mechanical: add config entries alongside what exists, replace bracket forms in batches, output byte-identical, and it can stop half-done indefinitely. Nothing blocks A on B, because the <code>&lt;alpha-value&gt;</code> wrapper goes on the colours that already have config entries. The deeper trap is treating the three as one epic: A is a bug fix, B is a refactor and C is a design change, and bundled together they block each other. Ship A this week on its own — with the CI guard in the same PR, or the fix has no way to stay fixed.',
            'Sắp theo kích thước là đẩy C lên đầu, mà C lại là thứ không đổi gì người dùng thấy được, cần quyết định thiết kế trước khi bất kỳ dòng mã nào nhúc nhích, và chạm tới 2.677 chỗ — nên bắt đầu ở đó nghĩa là mấy tuần khuấy động trong khi 91 khiếm khuyết thật vẫn hỏng. A thì ngược lại trên mọi trục: nó là con bọ thật mà người dùng thấy được, thay đổi gói gọn trong <code>globals.css</code> với file config, và 91 chỗ gọi không bị sửa gì cả — chúng chỉ đơn giản là bắt đầu chạy đúng. B thì máy móc thật sự: thêm mục config song song với thứ đang có, thay dạng ngoặc theo từng lô, đầu ra giống hệt từng byte, và dừng nửa chừng bao lâu cũng được. Không có gì chặn A phải chờ B, vì lớp bọc <code>&lt;alpha-value&gt;</code> đặt lên chính những màu đã có mục config. Cái bẫy sâu hơn là coi cả ba là một hạng mục: A là sửa bọ, B là tái cấu trúc, C là thay đổi thiết kế, gộp lại thì chúng chặn lẫn nhau. Hãy ship A ngay tuần này, một mình — kèm chốt kiểm CI trong cùng PR, không thì phép sửa chẳng có cách nào ở yên đã sửa.',
          ),
        }),

        // ── Chương 7 — @layer ───────────────────────────────────────────
        mcq({
          prompt: B(
            'Two custom rules sit in the SAME place in the entry file — both before the three <code>@tailwind</code> directives — and only one of them is wrapped. These are the real emitted line numbers:' + code(
              '.unlayered { padding: 99px; }\n' +
              '@layer utilities { .inlayer { padding: 77px; } }\n' +
              '@tailwind base;\n' +
              '@tailwind components;\n' +
              '@tailwind utilities;\n' +
              '\n' +
              '  1:  .unlayered\n' +
              '561:  .p-4\n' +
              '565:  .inlayer',
            ) + 'What does the pair prove?',
            'Hai quy tắc tuỳ biến nằm CÙNG MỘT CHỖ trong file đầu vào — đều trước ba chỉ thị <code>@tailwind</code> — và chỉ một trong hai được bọc. Đây là số dòng THẬT được phát sinh:' + code(
              '.unlayered { padding: 99px; }\n' +
              '@layer utilities { .inlayer { padding: 77px; } }\n' +
              '@tailwind base;\n' +
              '@tailwind components;\n' +
              '@tailwind utilities;\n' +
              '\n' +
              '  1:  .unlayered\n' +
              '561:  .p-4\n' +
              '565:  .inlayer',
            ) + 'Cặp ấy chứng minh điều gì?',
          ),
          options: [
            B(
              'Unlayered CSS stays exactly where you wrote it — so here it loses to <code>p-4</code> — while <code>@layer</code> RELOCATES its rule into the matching generated block, which is the entire feature',
              'CSS không-layer nằm ĐÚNG chỗ bạn viết — nên ở đây nó thua <code>p-4</code> — còn <code>@layer</code> DI DỜI quy tắc của nó vào đúng khối được phát sinh tương ứng, và đó chính là toàn bộ tính năng ấy',
            ),
            B(
              'Both rules were hoisted to the end of the file; the four-line gap between 561 and 565 is Preflight padding and carries no meaning',
              'Cả hai quy tắc đều bị nâng xuống cuối file; khoảng cách bốn dòng giữa 561 và 565 là phần đệm của Preflight và không mang ý nghĩa gì',
            ),
            B(
              'Cascade layers apply: <code>.inlayer</code> wins because layered rules outrank unlayered ones, which is the CSS <code>@layer</code> rule Tailwind implements faithfully',
              'Cascade layer có hiệu lực: <code>.inlayer</code> thắng vì quy tắc trong layer xếp trên quy tắc ngoài layer, đúng luật <code>@layer</code> của CSS mà Tailwind cài đặt trung thành',
            ),
            B(
              'Nothing about position: <code>.inlayer</code> wins on specificity, because wrapping a rule in <code>@layer utilities</code> adds an implicit class to its selector',
              'Không liên quan tới vị trí: <code>.inlayer</code> thắng nhờ độ đặc hiệu, vì bọc một quy tắc trong <code>@layer utilities</code> là thêm một lớp ngầm vào selector của nó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Same source position, opposite outcome, and the line numbers say why. <code>.unlayered</code> was never moved: it is emitted at line 1, before every utility, so <code>p-4</code> at 561 beats it. <code>.inlayer</code> was relocated into the generated utilities block at 565, after <code>p-4</code>, so it wins — and it would win from anywhere in the file, which is the real benefit: position-independence in a 4,462-line stylesheet that someone will eventually reorder or split. Note what this is NOT. Tailwind 3 strips the directive entirely; <code>grep -c "@layer" out.css</code> returns 0, so the output is flat CSS and the CSS cascade-layer rule "unlayered beats layered" — which is real, and verified in Chromium — never applies to it. And layering adds no specificity: a layered rule and a utility still tie at 0,1,0 and are decided by position. Two mechanisms, one spelling.',
            'Cùng vị trí trong nguồn, kết quả ngược nhau, và số dòng nói rõ vì sao. <code>.unlayered</code> không hề bị dời: nó được sinh ở dòng 1, trước mọi tiện ích, nên <code>p-4</code> ở 561 thắng nó. <code>.inlayer</code> thì bị DI DỜI vào khối utilities được phát sinh, xuống dòng 565, sau <code>p-4</code>, nên nó thắng — và nó sẽ thắng dù đặt ở đâu trong file, đó mới là lợi ích thật: độc lập với vị trí trong một bảng kiểu 4.462 dòng mà rồi sẽ có người sắp lại hoặc chẻ ra. Để ý cái này KHÔNG phải là gì. Tailwind 3 xoá sạch chỉ thị ấy; <code>grep -c "@layer" out.css</code> trả 0, nên đầu ra là CSS phẳng và luật cascade-layer của CSS "ngoài layer thắng trong layer" — luật ấy có thật và đã kiểm trên Chromium — không bao giờ áp vào nó. Và bọc layer KHÔNG thêm độ đặc hiệu: một quy tắc trong layer với một tiện ích vẫn hoà ở 0,1,0 và được phân định bằng vị trí. Hai cơ chế, một cách viết.',
          ),
        }),

        mcq({
          prompt: B(
            'Chapter 3 said hand-written CSS outside a layer beats utilities "structurally". Chapter 7 corrects that to source order. Why is the correction worth making rather than shrugging at?',
            'Chương 3 nói CSS viết tay nằm ngoài layer thắng tiện ích "về mặt cấu trúc". Chương 7 sửa lại thành thứ tự nguồn. Vì sao phép sửa ấy đáng làm chứ không phải nhún vai cho qua?',
          ),
          options: [
            B(
              'Because "structural" is simply the wrong word for a build-time behaviour, and precise vocabulary is what lets a team search the docs successfully',
              'Vì "cấu trúc" đơn giản là từ dùng sai cho một hành vi lúc dựng, và từ vựng chính xác mới giúp cả đội tra tài liệu thành công',
            ),
            B(
              'Because cascade layers do apply on Tailwind 4, so a project that upgrades will find the same rules suddenly losing, and only the corrected wording survives the upgrade',
              'Vì cascade layer CÓ hiệu lực trên Tailwind 4, nên một dự án nâng cấp sẽ thấy đúng những quy tắc ấy đột nhiên thua, và chỉ cách diễn đạt đã sửa mới sống sót qua bản nâng cấp',
            ),
            B(
              'Because the outcome was also wrong: measured, the unlayered rules in this repository do NOT beat utilities, so both the mechanism and the conclusion needed replacing',
              'Vì kết luận cũng sai luôn: đo thật thì các quy tắc ngoài layer trong kho này KHÔNG thắng tiện ích, nên cả cơ chế lẫn kết luận đều phải thay',
            ),
            B(
              'Because "structural" implies unfixable-without-restructuring while "source order" implies a ONE-LINE move — putting the three directives below the custom CSS would invert every one of those relationships, which is an option you cannot see if you believe the wrong mechanism',
              'Vì "cấu trúc" hàm ý không sửa được nếu không tái cấu trúc, còn "thứ tự nguồn" hàm ý chỉ cần DỜI MỘT DÒNG — đặt ba chỉ thị xuống dưới phần CSS tuỳ biến sẽ đảo ngược từng mối quan hệ ấy, một phương án bạn không nhìn ra nổi nếu tin vào cơ chế sai',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The outcome was right and stays right: this repository\'s three <code>@tailwind</code> directives are lines 1–3 of <code>globals.css</code>, so all ~630 remaining unlayered rules are emitted after every utility and do beat them. What was wrong was the reason, and the reason determines the size of the fix. If the cause were cascade layers, the remedy would be adopting layers throughout — weeks of work. Because the cause is position, moving three lines would invert every one of those relationships at once. That option only becomes visible once the mechanism is stated correctly, which is the whole value of the correction. Whether you should take it is a separate question, and Chapter 7 answers it with a classification rather than a slogan. The Tailwind 4 point in the last option is true and relevant to an upgrade — v4 does emit real <code>@layer</code> — but it is not why the v3 correction mattered.',
            'Kết luận thì đúng và vẫn đúng: ba chỉ thị <code>@tailwind</code> của kho này là dòng 1–3 của <code>globals.css</code>, nên toàn bộ khoảng 630 quy tắc ngoài layer còn lại đều được sinh SAU mọi tiện ích và thật sự thắng chúng. Cái sai là LÝ DO, và lý do quyết định kích cỡ của phép sửa. Nếu nguyên nhân là cascade layer thì thuốc chữa sẽ là áp dụng layer khắp nơi — hàng tuần công việc. Vì nguyên nhân là vị trí, dời ba dòng là đảo ngược từng mối quan hệ ấy trong một lượt. Phương án đó chỉ hiện ra khi cơ chế được phát biểu cho đúng, và đó là toàn bộ giá trị của phép sửa. Còn có nên làm hay không lại là câu hỏi khác, và chương 7 trả lời nó bằng một phép PHÂN LOẠI chứ không bằng một khẩu hiệu. Ý về Tailwind 4 trong phương án cuối là đúng và có liên quan khi nâng cấp — v4 CÓ phát sinh <code>@layer</code> thật — nhưng đó không phải lý do phép sửa cho v3 lại quan trọng.',
          ),
        }),

        mcq({
          prompt: B(
            'A team wraps <code>.rich-content h2 { font-size: 1.5rem }</code> in <code>@layer components</code>, expecting <code>text-3xl</code> on the element to start winning. What happens?',
            'Một đội bọc <code>.rich-content h2 { font-size: 1.5rem }</code> vào <code>@layer components</code>, mong <code>text-3xl</code> trên thẻ ấy bắt đầu thắng. Chuyện gì xảy ra?',
          ),
          options: [
            B(
              'Nothing changes: layering does NOT lower specificity, so a 0,1,1 descendant selector still beats a 0,1,0 utility — layers only decide the outcome when specificity TIES',
              'Không gì thay đổi: bọc layer KHÔNG hạ độ đặc hiệu, nên một selector con cháu 0,1,1 vẫn thắng một tiện ích 0,1,0 — layer chỉ quyết định kết quả khi độ đặc hiệu HOÀ nhau',
            ),
            B(
              'It works: rules in the components band are emitted before utilities, and being emitted earlier is what makes a rule overridable regardless of its selector',
              'Nó chạy: quy tắc trong dải components được sinh trước tiện ích, và được sinh sớm hơn chính là thứ làm một quy tắc bị ghi đè được, bất kể selector của nó',
            ),
            B(
              'The rule stops matching entirely, because <code>@layer components</code> only accepts single-class selectors and drops anything with a combinator',
              'Quy tắc thôi khớp hoàn toàn, vì <code>@layer components</code> chỉ nhận selector một lớp và loại bỏ mọi thứ có dấu kết hợp',
            ),
            B(
              'It works, but only for utilities that carry a variant, since an unprefixed utility and a layered rule remain at the same cascade level',
              'Nó chạy, nhưng chỉ với những tiện ích mang biến thể, vì một tiện ích không tiền tố và một quy tắc trong layer vẫn ở cùng một mức cascade',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the correction the chapter makes explicit, because "layering makes utilities able to override your CSS" is a tempting and wrong summary. The cascade compares specificity BEFORE source order, so a 0,1,1 selector wins from anywhere in the file and moving it changes nothing. Of this repository\'s 620 unlayered selectors, 358 are descendant and 92 are pseudo-state — 450 that win on specificity — and only 139 single-class rules are tied at 0,1,0 and therefore decided by position. Those 139 are the only ones layering can help. There is also a reason not to want this particular change even if it worked: <code>.rich-content</code> styles class-less HTML from the TipTap editor, elements that cannot carry a utility at all, so its specificity is not an accident — it is what makes the rules reach anything. Preflight stripped those headings of their size in the first place, and those 135 rules are what puts it back.',
            'Đây chính là phép sửa mà chương này nói thẳng ra, vì câu tóm tắt "bọc layer để tiện ích ghi đè được CSS của bạn" nghe hấp dẫn mà sai. Cascade so ĐỘ ĐẶC HIỆU TRƯỚC thứ tự nguồn, nên một selector 0,1,1 thắng từ bất kỳ đâu trong file và dời nó đi chẳng đổi gì. Trong 620 selector ngoài layer của kho này, 358 là con cháu và 92 là trạng thái giả — 450 cái thắng bằng độ đặc hiệu — và chỉ 139 quy tắc một-lớp là hoà ở 0,1,0 nên mới do vị trí quyết định. Đúng 139 cái ấy là những cái mà layer giúp được. Còn một lý do nữa để không muốn chính thay đổi này dù nó có chạy: <code>.rich-content</code> tạo kiểu cho HTML không có lớp do trình soạn TipTap sinh ra, những thẻ hoàn toàn không mang nổi một tiện ích nào, nên độ đặc hiệu của nó không phải tình cờ — đó là thứ làm cho các quy tắc ấy với tới được cái gì đó. Chính Preflight đã lột mất cỡ chữ của những tiêu đề ấy ngay từ đầu, và 135 quy tắc kia là thứ trả nó về.',
          ),
        }),

        mcq({
          prompt: B(
            'A <code>.card</code> class keeps losing to utilities, so someone moves it from <code>@layer components</code> to <code>@layer utilities</code>. It works. What did that cost?',
            'Một lớp <code>.card</code> cứ thua tiện ích, nên có người dời nó từ <code>@layer components</code> sang <code>@layer utilities</code>. Nó chạy. Cái giá là gì?',
          ),
          options: [
            B(
              'Nothing: the three bands are a convention rather than a mechanism, so which one a class sits in is a matter of taste as long as the result is right',
              'Không gì cả: ba cái dải chỉ là quy ước chứ không phải cơ chế, nên một lớp nằm dải nào cũng là chuyện khẩu vị miễn kết quả đúng',
            ),
            B(
              'Its specificity rose from 0,1,0 to 0,2,0, which is why it now wins — and that makes it beat hand-written descendant selectors it previously lost to',
              'Độ đặc hiệu của nó tăng từ 0,1,0 lên 0,2,0, và vì thế giờ nó thắng — thành ra nó thắng luôn cả những selector con cháu viết tay mà trước đây nó thua',
            ),
            B(
              'The rule is now tree-shaken, so it disappears from the output on any page where <code>.card</code> is applied conditionally at runtime',
              'Quy tắc ấy giờ bị rung cây loại bỏ, nên nó biến mất khỏi đầu ra ở mọi trang mà <code>.card</code> được áp có điều kiện lúc chạy',
            ),
            B(
              'Now NO utility can override it, so every call site needing a variation must reach for <code>!important</code> or an arbitrary value — the wall the layer system exists to prevent',
              'Bây giờ KHÔNG tiện ích nào ghi đè nó được, nên mọi chỗ gọi cần một biến tấu đều phải với tới <code>!important</code> hoặc một giá trị tuỳ ý — đúng bức tường mà hệ thống layer sinh ra để ngăn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The three bands encode who overrides whom: <code>base</code> for bare element defaults so everything can beat them, <code>components</code> for named classes utilities SHOULD be able to override, and <code>utilities</code> for your own single-purpose helpers that should beat component classes. Promoting <code>.card</code> to the utilities band inverts exactly the relationship that makes a component class composable, and the next person needing a different padding on one card has no tool left but escalation — the failure Chapter 3\'s ladder was built to avoid, arrived at from the other direction. Note also the two wrong mechanisms in the other options: layering never changes specificity, and it is not what tree-shakes a rule. If a component class keeps losing, the cause is almost never its band — it is that something else has higher specificity, and layers do not fix specificity.',
            'Ba cái dải mã hoá chuyện AI ghi đè AI: <code>base</code> cho các mặc định của thẻ trần để mọi thứ đều thắng được chúng, <code>components</code> cho các lớp có tên mà tiện ích NÊN ghi đè được, và <code>utilities</code> cho những trợ thủ một-mục-đích của riêng bạn, vốn nên thắng lớp component. Đẩy <code>.card</code> lên dải utilities là đảo ngược đúng cái quan hệ làm cho một lớp component soạn ghép được, và người kế tiếp cần một padding khác trên một cái thẻ sẽ chẳng còn công cụ nào ngoài leo thang — đúng thất bại mà cái thang ở chương 3 dựng ra để tránh, chỉ là đi tới từ hướng khác. Cũng để ý hai cơ chế sai trong các phương án kia: bọc layer không bao giờ đổi độ đặc hiệu, và nó cũng không phải thứ rung cây loại bỏ một quy tắc. Nếu một lớp component cứ thua thì nguyên nhân gần như không bao giờ là cái dải của nó — mà là có thứ khác độ đặc hiệu cao hơn, và layer không sửa được độ đặc hiệu.',
          ),
        }),

        mcq({
          prompt: B(
            'Two measurements about Preflight on 3.4.14. Which pair is the machine\'s, and what follows?' + code(
              '$ echo "@tailwind base;" > only-base.css && npx tailwindcss -i only-base.css -o out.css\n' +
              '$ wc -l out.css                       # ???\n' +
              '\n' +
              '# then, with corePlugins: { preflight: false } and the full entry file\n' +
              '$ wc -l out.css                       # ???',
            ),
            'Hai phép đo về Preflight trên 3.4.14. Cặp nào là của MÁY, và suy ra điều gì?' + code(
              '$ echo "@tailwind base;" > only-base.css && npx tailwindcss -i only-base.css -o out.css\n' +
              '$ wc -l out.css                       # ???\n' +
              '\n' +
              '# rồi, với corePlugins: { preflight: false } và file đầu vào đầy đủ\n' +
              '$ wc -l out.css                       # ???',
            ),
          ),
          options: [
            B(
              '555 lines then 0 lines — disabling Preflight empties the base layer completely, which is what makes it a clean opt-out for incremental adoption',
              '555 dòng rồi 0 dòng — tắt Preflight là dọn sạch hẳn dải base, và đó là thứ làm cho nó thành một lối rút lui gọn gàng khi đưa Tailwind vào dần',
            ),
            B(
              '41 lines then 41 lines — Preflight is 41 rules and disabling it only removes their declarations, leaving the selectors in place as no-ops',
              '41 dòng rồi 41 dòng — Preflight là 41 quy tắc, và tắt nó chỉ gỡ phần khai báo, để lại selector nằm đó như những quy tắc rỗng',
            ),
            B(
              '555 lines (41 rules) then 111 lines — a chunk of base survives, because the <code>*, ::before, ::after</code> block of custom-property defaults is not part of Preflight',
              '555 dòng (41 quy tắc) rồi 111 dòng — một mảng base vẫn sống sót, vì khối <code>*, ::before, ::after</code> chứa các giá trị mặc định của thuộc tính tuỳ chỉnh không thuộc Preflight',
            ),
            B(
              '2,048 lines then 555 lines — the first figure includes the full colour palette, and turning Preflight off leaves only the reset',
              '2.048 dòng rồi 555 dòng — con số đầu bao gồm cả bảng màu đầy đủ, và tắt Preflight thì chỉ còn phần reset',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Both numbers came off the build: 555 lines and 41 rules for Preflight alone, and 111 lines still emitted with <code>preflight: false</code> — the variable-defaults block that every transform, ring, shadow and filter utility depends on. That is why "turn Preflight off" is not the clean opt-out it sounds like, and why the line numbers in every measurement in this chapter start around 557. Four Preflight removals account for a whole category of "why does this element look wrong": headings lose their size and weight, lists lose their markers and indent, buttons lose border, background and font, and images become <code>display: block</code> with <code>max-width: 100%</code> (which silently fixes the inline-baseline gap under images). The trap is diagnosing a removal as a missing utility — a list with no bullets gets <code>list-disc</code> and the developer moves on, which is right for a list you author and useless for markdown or editor output where you cannot add a class. There the same symptom needs a scoped rule, which is exactly why <code>.rich-content</code> exists.',
            'Cả hai con số đều lấy từ bản dựng: 555 dòng và 41 quy tắc cho riêng Preflight, và vẫn còn 111 dòng được sinh khi để <code>preflight: false</code> — khối giá trị mặc định của các biến mà mọi tiện ích transform, ring, shadow và filter đều dựa vào. Vì thế "tắt Preflight đi" không phải lối rút lui gọn gàng như nghe tưởng, và cũng vì thế số dòng trong mọi phép đo của chương này đều bắt đầu quanh 557. Bốn thứ Preflight gỡ bỏ giải thích cả một họ câu hỏi "sao cái thẻ này trông sai sai": tiêu đề mất cỡ chữ và độ đậm, danh sách mất dấu đầu dòng và phần thụt, nút mất viền, mất nền và mất phông riêng, còn ảnh thành <code>display: block</code> kèm <code>max-width: 100%</code> (thứ âm thầm sửa cái khe hở dưới ảnh do đường cơ sở inline). Cái bẫy là chẩn một thứ bị gỡ thành một tiện ích bị quên — một danh sách không có dấu chấm thì được thêm <code>list-disc</code> rồi lập trình viên đi tiếp, cách đó đúng với danh sách bạn tự viết và vô dụng với đầu ra markdown hay trình soạn thảo, nơi bạn không thêm được lớp nào. Ở đó cùng triệu chứng ấy cần một quy tắc có phạm vi, và đó đúng là lý do <code>.rich-content</code> tồn tại.',
          ),
        }),

        mcq({
          prompt: B(
            'A worked diagnosis: <code>text-3xl</code> does nothing on a heading inside lesson content. These are the real greps.' + code(
              '$ grep -c "\\.text-3xl" out.css\n' +
              '1\n' +
              '$ grep -n "font-size" out.css | grep -E "text-3xl|rich-content h2"\n' +
              '1893: .rich-content h2 { font-size: 1.5rem }\n' +
              '2412: .text-3xl        { font-size: 1.875rem }',
            ) + 'Which reading is right?',
            'Một ca chẩn đoán làm mẫu: <code>text-3xl</code> chẳng có tác dụng gì trên một tiêu đề nằm trong nội dung bài học. Đây là các lệnh grep thật.' + code(
              '$ grep -c "\\.text-3xl" out.css\n' +
              '1\n' +
              '$ grep -n "font-size" out.css | grep -E "text-3xl|rich-content h2"\n' +
              '1893: .rich-content h2 { font-size: 1.5rem }\n' +
              '2412: .text-3xl        { font-size: 1.875rem }',
            ) + 'Cách đọc nào đúng?',
          ),
          options: [
            B(
              '<code>.text-3xl</code> is at 2412 and therefore later, so it wins — the heading must be failing for another reason, such as the class never reaching the element',
              '<code>.text-3xl</code> ở dòng 2412 nên đứng sau, vậy nó thắng — cái tiêu đề chắc hỏng vì lý do khác, chẳng hạn cái lớp không tới được thẻ',
            ),
            B(
              'Step 1 already answered it: <code>grep -c</code> returning 1 means one rule exists but only one, so the variant forms are missing and the class is half-generated',
              'Bước 1 đã trả lời rồi: <code>grep -c</code> trả 1 nghĩa là chỉ tồn tại đúng một quy tắc, nên các dạng biến thể bị thiếu và cái lớp mới sinh được một nửa',
            ),
            B(
              'Neither rule wins: two declarations for the same property on one element cancel, and the heading falls back to the Preflight default of <code>inherit</code>',
              'Không quy tắc nào thắng: hai khai báo cho cùng một thuộc tính trên một thẻ triệt tiêu nhau, và tiêu đề rơi về mặc định <code>inherit</code> của Preflight',
            ),
            B(
              'The rule exists, so this is a cascade question — and specificity is compared BEFORE position, so <code>.rich-content h2</code> at 0,1,1 wins over a 0,1,0 utility even though it is emitted 519 lines earlier',
              'Quy tắc có tồn tại, nên đây là câu hỏi về cascade — và độ đặc hiệu được so TRƯỚC vị trí, nên <code>.rich-content h2</code> ở mức 0,1,1 thắng một tiện ích 0,1,0 dù nó được sinh sớm hơn 519 dòng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The procedure has four steps and their ORDER is the cascade\'s own order, not a preference. First, does the rule exist at all? <code>grep -c</code> returns 1, so this is not a generation bug — no cascade reasoning applies until that returns non-zero, and an absent rule looks identical in DevTools to a rule that lost. Second, list the competitors with line numbers. Third, compare specificity: <code>.rich-content h2</code> is one class plus one element = 0,1,1 against a utility\'s 0,1,0, so it wins outright and the diagnosis ends here. Fourth — comparing line numbers — is never reached, and anyone who ran it first would predict the opposite answer, because <code>.text-3xl</code> IS emitted later. Getting the order wrong gives the wrong answer for 450 of this repository\'s 620 unlayered rules. And the diagnosis determines the fix: because this is a specificity loss, moving directives, wrapping in layers and reordering the file all change nothing. The real options are adding a class to the element, scoping the utility with <code>[&amp;_h2]:text-3xl</code>, or accepting that <code>.rich-content</code> owns its headings.',
            'Thủ tục có bốn bước và THỨ TỰ của chúng là thứ tự của chính cascade chứ không phải sở thích. Một, quy tắc có tồn tại không? <code>grep -c</code> trả 1, nên đây không phải lỗi phát sinh — chưa suy luận cascade được chừng nào con số ấy còn là 0, và một quy tắc VẮNG MẶT trông y hệt một quy tắc THUA khi nhìn trong DevTools. Hai, liệt kê các đối thủ kèm số dòng. Ba, so độ đặc hiệu: <code>.rich-content h2</code> là một lớp cộng một phần tử = 0,1,1 so với 0,1,0 của tiện ích, nên nó thắng dứt điểm và chẩn đoán kết thúc ngay đây. Bốn — so số dòng — không bao giờ tới lượt, và ai chạy bước này trước sẽ dự đoán ngược lại, vì <code>.text-3xl</code> ĐÚNG là được sinh sau. Đảo thứ tự là cho câu trả lời sai với 450 trong 620 quy tắc ngoài layer của kho này. Và chẩn đoán quyết định cách sửa: vì đây là thua về độ đặc hiệu nên dời chỉ thị, bọc layer hay sắp lại file đều không đổi gì. Các phương án thật là thêm một lớp vào thẻ, bó tiện ích lại bằng <code>[&amp;_h2]:text-3xl</code>, hoặc chấp nhận rằng <code>.rich-content</code> sở hữu các tiêu đề của nó.',
          ),
        }),

        mcq({
          prompt: B(
            'Trying to answer "what beats my class", a developer searches <code>globals.css</code> for a competing rule and finds nothing. Why is that search structurally unable to answer the question?',
            'Để trả lời "cái gì đang thắng lớp của tôi", một lập trình viên tìm trong <code>globals.css</code> một quy tắc cạnh tranh và không thấy gì. Vì sao phép tìm ấy về mặt cấu trúc không trả lời nổi câu hỏi?',
          ),
          options: [
            B(
              'Because the entry file is the INPUT: it contains none of Preflight\'s 555 lines and none of the utilities, which is most of what ships — the question can only be answered against the built artefact',
              'Vì file đầu vào là ĐẦU VÀO: nó không chứa 555 dòng Preflight lẫn bất kỳ tiện ích nào, mà đó lại là phần lớn thứ được xuất xưởng — câu hỏi ấy chỉ trả lời được trên HIỆN VẬT đã dựng',
            ),
            B(
              'Because PostCSS rewrites selectors during the build, so a rule in the source rarely matches its own text in the output',
              'Vì PostCSS viết lại selector trong lúc dựng, nên một quy tắc trong nguồn hiếm khi khớp với chính chữ của nó trong đầu ra',
            ),
            B(
              'Because <code>globals.css</code> is not the entry file in a Next.js project; the real entry is generated under <code>.next/</code> and the source is only a fragment of it',
              'Vì <code>globals.css</code> không phải file đầu vào trong một dự án Next.js; đầu vào thật được sinh dưới <code>.next/</code> và mã nguồn chỉ là một mẩu của nó',
            ),
            B(
              'It is not unable: every rule that can beat a utility must be hand-written, and hand-written rules by definition live in the source',
              'Nó không hề bất lực: mọi quy tắc thắng được một tiện ích đều phải do người viết, và quy tắc do người viết thì theo định nghĩa nằm trong mã nguồn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The entry file holds three directives and your own rules; everything else — Preflight\'s 555 lines and every utility Tailwind generated — exists only in the output. Searching the input therefore misses most of the file that actually ships, including the very rules you are competing with. This is the same principle as the CI guard in Chapter 6: check the artefact, not the input, because the interesting failures leave no error anywhere else. Three places to find the built CSS, each right for a different question: <code>.next/static/css/*.css</code> after a production build; <code>npx tailwindcss -i globals.css -o /tmp/out.css</code> directly, which is fastest for a pure cascade question and is what every measurement in this chapter used; and the browser\'s Network tab or <code>document.styleSheets</code>, which is the correct source when you suspect the deployed file differs from your local build. And the reason to read the file at all rather than staying in DevTools: DevTools cannot tell you whether a class was ever generated, and cannot tell you how far apart two competing rules are — two rules four lines apart are one reorder away from flipping, two rules 3,000 lines apart are stable.',
            'File đầu vào chỉ chứa ba chỉ thị và các quy tắc của chính bạn; mọi thứ còn lại — 555 dòng Preflight và mọi tiện ích Tailwind sinh ra — chỉ tồn tại trong đầu ra. Nên tìm trong đầu vào là bỏ sót phần lớn cái file thật sự được xuất xưởng, kể cả chính những quy tắc bạn đang phải đấu. Vẫn đúng nguyên tắc của chốt kiểm CI ở chương 6: kiểm HIỆN VẬT chứ không kiểm đầu vào, vì những thất bại đáng sợ không để lại lỗi ở đâu khác. Ba chỗ tìm CSS đã dựng, mỗi chỗ đúng cho một câu hỏi khác nhau: <code>.next/static/css/*.css</code> sau một bản dựng production; chạy thẳng <code>npx tailwindcss -i globals.css -o /tmp/out.css</code>, nhanh nhất cho một câu hỏi thuần về cascade và là thứ mọi phép đo trong chương này đã dùng; và tab Network của trình duyệt hoặc <code>document.styleSheets</code>, đúng nguồn khi bạn nghi file đã triển khai khác với bản dựng ở máy. Còn lý do phải đọc file thay vì ở lại trong DevTools: DevTools không nói được một cái lớp có từng được sinh ra hay không, và cũng không nói được hai quy tắc đối đầu cách nhau bao xa — hai quy tắc cách nhau bốn dòng thì chỉ một lần sắp lại là đảo chiều, còn hai quy tắc cách nhau 3.000 dòng thì ổn định.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q31 — Build <code>cn()</code> yourself (chapters 3 and 4).</b> The <code>className</code> prop is a promise that the caller\'s class takes effect, and the only implementation that keeps it for every input is <code>cn = (...i) =&gt; twMerge(clsx(i))</code>. Write both halves over the tables given to you — no libraries.</p>' +
            '<p><code>clsx(...inputs)</code> — flatten into one space-separated string. A string contributes itself, an array is flattened recursively, an object contributes each key whose value is truthy, and <code>false</code>, <code>null</code>, <code>undefined</code> and <code>&quot;&quot;</code> contribute nothing.</p>' +
            '<p><code>twMerge(str)</code> — drop the classes a later class supersedes, keeping the survivors in their original order. Three rules, and the third is the one people get wrong:</p>' +
            '<ul>' +
            '<li>A class\'s <b>group</b> comes from <code>NHOM</code> by <b>longest matching prefix</b> — <code>text-sm</code> must beat <code>text</code>. A class no prefix matches has no group and is always kept.</li>' +
            '<li>Its <b>context</b> is its variant prefix (everything up to and including the last <code>:</code>) plus a leading <code>!</code> if present. Two classes only conflict inside the SAME context, which is why <code>hover:p-2 p-8</code> and <code>!p-8 p-2</code> both keep both.</li>' +
            '<li>Walk the list from RIGHT to LEFT. A class is dropped if its context+group was already claimed by a class to its right. When you keep a class, it claims its own group AND every group listed for it in <code>NUOT</code> — which is why <code>px-4 p-8</code> collapses to <code>p-8</code> while <code>p-8 px-4</code> keeps both.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing block exactly as they are, and do not <code>require</code> anything.</p>',

            '<p><b>Câu 31 — Tự dựng <code>cn()</code> (chương 3 và 4).</b> Thuộc tính <code>className</code> là một lời hứa rằng lớp của người gọi sẽ có tác dụng, và bản cài đặt duy nhất giữ được lời hứa ấy với MỌI đầu vào là <code>cn = (...i) =&gt; twMerge(clsx(i))</code>. Hãy viết cả hai nửa dựa trên các bảng cho sẵn — không thư viện.</p>' +
            '<p><code>clsx(...inputs)</code> — dàn phẳng thành một chuỗi cách nhau bằng dấu cách. Một chuỗi đóng góp chính nó, một mảng được dàn phẳng đệ quy, một object đóng góp mỗi khoá có giá trị đúng, còn <code>false</code>, <code>null</code>, <code>undefined</code> và <code>&quot;&quot;</code> không đóng góp gì.</p>' +
            '<p><code>twMerge(str)</code> — bỏ đi những lớp bị một lớp đứng sau thay thế, giữ những cái sống sót theo ĐÚNG thứ tự ban đầu. Ba luật, và luật thứ ba là chỗ người ta hay hiểu sai:</p>' +
            '<ul>' +
            '<li><b>Nhóm</b> của một lớp tra từ <code>NHOM</code> theo <b>tiền tố khớp DÀI NHẤT</b> — <code>text-sm</code> phải thắng <code>text</code>. Lớp không tiền tố nào khớp thì không có nhóm và luôn được giữ.</li>' +
            '<li><b>Ngữ cảnh</b> của nó là tiền tố biến thể (toàn bộ phần tới hết dấu <code>:</code> cuối cùng) cộng dấu <code>!</code> đứng đầu nếu có. Hai lớp chỉ xung đột trong CÙNG một ngữ cảnh, và vì thế <code>hover:p-2 p-8</code> lẫn <code>!p-8 p-2</code> đều giữ cả hai.</li>' +
            '<li>Duyệt danh sách từ PHẢI sang TRÁI. Một lớp bị bỏ nếu cặp ngữ-cảnh+nhóm của nó đã bị một lớp bên phải chiếm mất. Khi giữ lại một lớp, nó chiếm nhóm của chính nó VÀ mọi nhóm được liệt kê cho nó trong <code>NUOT</code> — và vì thế <code>px-4 p-8</code> co lại còn <code>p-8</code> trong khi <code>p-8 px-4</code> giữ cả hai.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không <code>require</code> thứ gì.</p>',
          ),
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// Mỗi tiện ích thuộc đúng MỘT nhóm xung đột. Tra theo TIỀN TỐ DÀI NHẤT.\n' +
            'const NHOM = {\n' +
            "  p: 'p', px: 'px', py: 'py', pt: 'pt', pr: 'pr', pb: 'pb', pl: 'pl',\n" +
            "  m: 'm', mx: 'mx', my: 'my', mt: 'mt', mr: 'mr', mb: 'mb', ml: 'ml',\n" +
            "  gap: 'gap', w: 'w', h: 'h', size: 'size',\n" +
            "  rounded: 'rounded', block: 'display', flex: 'display', grid: 'display',\n" +
            "  'text-xs': 'font-size', 'text-sm': 'font-size', 'text-base': 'font-size',\n" +
            "  'text-lg': 'font-size', 'text-xl': 'font-size',\n" +
            "  'text-red-500': 'text-color', 'text-blue-500': 'text-color',\n" +
            "  'bg-red-500': 'bg-color', 'bg-blue-500': 'bg-color',\n" +
            '};\n' +
            '// Nhóm nào NUỐT nhóm nào khi nó đứng SAU.\n' +
            'const NUOT = {\n' +
            "  p: ['px', 'py', 'pt', 'pr', 'pb', 'pl'],\n" +
            "  px: ['pl', 'pr'], py: ['pt', 'pb'],\n" +
            "  m: ['mx', 'my', 'mt', 'mr', 'mb', 'ml'],\n" +
            "  mx: ['ml', 'mr'], my: ['mt', 'mb'],\n" +
            "  size: ['w', 'h'],\n" +
            '};\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function clsx(...dauVao) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function twMerge(chuoi) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const cn = (...i) => twMerge(clsx(...i));\n\n' +
            'const CA_MERGE = [\n' +
            "  'px-4 py-2 rounded px-8', 'p-2 p-8', 'px-4 p-8', 'p-8 px-4',\n" +
            "  'mt-4 mb-4 my-8', 'my-8 mt-4', 'text-sm text-lg', 'text-sm text-red-500',\n" +
            "  'block flex grid', 'hover:p-2 p-8', '!p-8 p-2', 'p-4 !p-8',\n" +
            "  'px-2 pl-8', 'pl-8 px-2', 'm-1 mx-2 mt-3', 'w-4 size-8',\n" +
            '];\n' +
            "for (const c of CA_MERGE) console.log(JSON.stringify(c) + ' -> ' + JSON.stringify(twMerge(c)));\n" +
            "console.log('clsx  : ' + JSON.stringify(clsx('px-4', ['py-2', null], { rounded: true, hidden: false }, undefined, '')));\n" +
            "console.log('cn A  : ' + JSON.stringify(cn('px-4 py-2 rounded', undefined, 'px-8')));\n" +
            "console.log('cn B  : ' + JSON.stringify(cn('px-8', 'px-4 py-2 rounded')));\n" +
            "console.log('cn C  : ' + JSON.stringify(cn('inline-flex', { 'bg-red-500': true, 'bg-blue-500': false }, ['p-2', ['p-8']])));\n",
          expectedOutput:
            '"px-4 py-2 rounded px-8" -> "py-2 rounded px-8"\n' +
            '"p-2 p-8" -> "p-8"\n' +
            '"px-4 p-8" -> "p-8"\n' +
            '"p-8 px-4" -> "p-8 px-4"\n' +
            '"mt-4 mb-4 my-8" -> "my-8"\n' +
            '"my-8 mt-4" -> "my-8 mt-4"\n' +
            '"text-sm text-lg" -> "text-lg"\n' +
            '"text-sm text-red-500" -> "text-sm text-red-500"\n' +
            '"block flex grid" -> "grid"\n' +
            '"hover:p-2 p-8" -> "hover:p-2 p-8"\n' +
            '"!p-8 p-2" -> "!p-8 p-2"\n' +
            '"p-4 !p-8" -> "p-4 !p-8"\n' +
            '"px-2 pl-8" -> "px-2 pl-8"\n' +
            '"pl-8 px-2" -> "px-2"\n' +
            '"m-1 mx-2 mt-3" -> "m-1 mx-2 mt-3"\n' +
            '"w-4 size-8" -> "size-8"\n' +
            'clsx  : "px-4 py-2 rounded"\n' +
            'cn A  : "py-2 rounded px-8"\n' +
            'cn B  : "px-4 py-2 rounded"\n' +
            'cn C  : "inline-flex bg-red-500 p-8"',
          sampleSolution:
            'function clsx(...dauVao) {\n' +
            '  const ra = [];\n' +
            '  const di = (v) => {\n' +
            '    if (!v) return;\n' +
            "    if (typeof v === 'string') { if (v.trim()) ra.push(v.trim()); return; }\n" +
            '    if (Array.isArray(v)) { v.forEach(di); return; }\n' +
            "    if (typeof v === 'object') {\n" +
            '      for (const [k, bat] of Object.entries(v)) if (bat) ra.push(k);\n' +
            '    }\n' +
            '  };\n' +
            '  dauVao.forEach(di);\n' +
            "  return ra.join(' ');\n" +
            '}\n\n' +
            'function tach(lop) {\n' +
            "  const i = lop.lastIndexOf(':');\n" +
            "  const bienThe = i < 0 ? '' : lop.slice(0, i + 1);\n" +
            '  let goc = i < 0 ? lop : lop.slice(i + 1);\n' +
            "  let quanTrong = '';\n" +
            "  if (goc.startsWith('!')) { quanTrong = '!'; goc = goc.slice(1); }\n" +
            "  // Tiền tố DÀI NHẤT khớp bảng: 'text-sm' phải thắng 'text'.\n" +
            '  let khop = null;\n' +
            '  for (const k of Object.keys(NHOM)) {\n' +
            "    if ((goc === k || goc.startsWith(k + '-')) && (khop === null || k.length > khop.length)) khop = k;\n" +
            '  }\n' +
            '  return { lop, khoa: bienThe + quanTrong, nhom: khop === null ? null : NHOM[khop] };\n' +
            '}\n\n' +
            'function twMerge(chuoi) {\n' +
            '  const lop = chuoi.split(/\\s+/).filter(Boolean).map(tach);\n' +
            '  const giu = [];\n' +
            '  const daChiem = new Set();\n' +
            '  // Đi từ PHẢI sang TRÁI: cái viết sau được quyền loại cái viết trước.\n' +
            '  for (let i = lop.length - 1; i >= 0; i--) {\n' +
            '    const t = lop[i];\n' +
            '    if (t.nhom === null) { giu.unshift(t.lop); continue; }\n' +
            "    const the = t.khoa + '|' + t.nhom;\n" +
            '    if (daChiem.has(the)) continue;\n' +
            '    giu.unshift(t.lop);\n' +
            '    daChiem.add(the);\n' +
            "    for (const n of (NUOT[t.nhom] ?? [])) daChiem.add(t.khoa + '|' + n);\n" +
            '  }\n' +
            "  return giu.join(' ');\n" +
            '}\n',
        }),

        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q32 — Resolve the config, then decide what generates (chapters 5 and 6).</b> Two config mistakes in this course are silent, and both are decided before a single rule is written: a key placed outside <code>extend</code> deletes a scale, and a colour written as a bare <code>var()</code> refuses to generate its opacity variants. Implement the resolver and the generator so both become visible.</p>' +
            '<p><code>giaiTheme(macDinh, config)</code> — the resolved theme. A key in <code>config.theme</code> that is NOT <code>extend</code> replaces that key wholesale and leaves the other keys alone. A key in <code>config.theme.extend</code> is merged into it with a <b>deep</b> merge: nested plain objects merge recursively, so overriding one shade of a colour family keeps the other shades. (Measured on 3.4.14 — the course says otherwise.)</p>' +
            '<p><code>phangMau(mau)</code> — flatten the colour tree into <code>{ &quot;gray-500&quot;: &quot;#6b7280&quot;, … }</code>, joining nesting levels with <code>-</code>.</p>' +
            '<p><code>phatSinh(theme, lop)</code> — the declarations Tailwind would emit for one class, as a string, or <code>null</code> when no rule is generated at all. The exact forms, all copied from a real build:</p>' +
            '<ul>' +
            '<li><code>p-&lt;k&gt;</code> → <code>padding: &lt;theme.spacing[k]&gt;</code>. Missing key → <code>null</code>.</li>' +
            '<li><code>text-&lt;k&gt;</code> where <code>k</code> is in <code>theme.fontSize</code> and there is no opacity modifier → <code>font-size: S; line-height: L</code> for the tuple form <code>[S, { lineHeight: L }]</code>, or <code>font-size: S</code> for a plain string.</li>' +
            '<li><code>bg-</code>, <code>text-</code> and <code>border-</code> otherwise look the name up in the flattened colours and set <code>background-color</code>, <code>color</code> or <code>border-color</code>. The opacity variable is <code>--tw-bg-opacity</code>, <code>--tw-text-opacity</code> or <code>--tw-border-opacity</code> to match.</li>' +
            '<li>A <code>#rrggbb</code> value: bare → <code>&lt;var&gt;: 1; &lt;prop&gt;: rgb(R G B / var(&lt;var&gt;))</code> with the channels in decimal; with <code>/NN</code> → <code>&lt;prop&gt;: rgb(R G B / &lt;NN/100&gt;)</code>.</li>' +
            '<li>A value containing <code>&lt;alpha-value&gt;</code>: bare → <code>&lt;var&gt;: 1; &lt;prop&gt;: &lt;value with &lt;alpha-value&gt; replaced by var(&lt;var&gt;)&gt;</code>; with <code>/NN</code> → the same substitution using the number.</li>' +
            '<li>A bare <code>var(--x)</code>: bare → <code>&lt;prop&gt;: var(--x)</code>; with <code>/NN</code> → <b><code>null</code></b>. This is the trap, and it is why the base class works while every opacity variant of it is dead.</li>' +
            '<li>An unknown colour name → <code>null</code>.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing loop exactly as they are, and do not <code>require</code> anything.</p>',

            '<p><b>Câu 32 — Giải config, rồi quyết xem cái gì được phát sinh (chương 5 và 6).</b> Hai lỗi cấu hình trong khoá này đều IM LẶNG, và cả hai được quyết trước khi có một quy tắc nào được viết ra: một khoá đặt ngoài <code>extend</code> xoá mất cả một thang, và một màu viết dưới dạng <code>var()</code> trần thì từ chối sinh các biến thể độ mờ của nó. Hãy cài đặt bộ giải và bộ sinh để cả hai lộ ra.</p>' +
            '<p><code>giaiTheme(macDinh, config)</code> — theme đã giải. Một khoá trong <code>config.theme</code> mà KHÔNG phải <code>extend</code> thì thay trọn khoá đó và để yên các khoá khác. Một khoá trong <code>config.theme.extend</code> thì được trộn vào theo kiểu <b>SÂU</b>: các object lồng nhau trộn đệ quy, nên đè một bậc của một họ màu vẫn giữ được các bậc còn lại. (Đo thật trên 3.4.14 — giáo trình nói khác.)</p>' +
            '<p><code>phangMau(mau)</code> — dàn phẳng cây màu thành <code>{ &quot;gray-500&quot;: &quot;#6b7280&quot;, … }</code>, nối các bậc lồng nhau bằng dấu <code>-</code>.</p>' +
            '<p><code>phatSinh(theme, lop)</code> — chuỗi khai báo mà Tailwind sẽ phát sinh cho một lớp, hoặc <code>null</code> khi không quy tắc nào được sinh ra. Các dạng chính xác, đều chép từ một bản dựng thật:</p>' +
            '<ul>' +
            '<li><code>p-&lt;k&gt;</code> → <code>padding: &lt;theme.spacing[k]&gt;</code>. Thiếu khoá → <code>null</code>.</li>' +
            '<li><code>text-&lt;k&gt;</code> khi <code>k</code> có trong <code>theme.fontSize</code> và không có bổ từ độ mờ → <code>font-size: S; line-height: L</code> với dạng bộ đôi <code>[S, { lineHeight: L }]</code>, hoặc <code>font-size: S</code> với chuỗi thuần.</li>' +
            '<li>Ngoài ra <code>bg-</code>, <code>text-</code> và <code>border-</code> tra tên trong bảng màu đã dàn phẳng rồi đặt <code>background-color</code>, <code>color</code> hoặc <code>border-color</code>. Biến độ mờ tương ứng là <code>--tw-bg-opacity</code>, <code>--tw-text-opacity</code> hoặc <code>--tw-border-opacity</code>.</li>' +
            '<li>Giá trị <code>#rrggbb</code>: dạng trần → <code>&lt;bien&gt;: 1; &lt;prop&gt;: rgb(R G B / var(&lt;bien&gt;))</code> với ba kênh hệ mười; kèm <code>/NN</code> → <code>&lt;prop&gt;: rgb(R G B / &lt;NN/100&gt;)</code>.</li>' +
            '<li>Giá trị có chứa <code>&lt;alpha-value&gt;</code>: dạng trần → <code>&lt;bien&gt;: 1; &lt;prop&gt;: &lt;giá trị, thay &lt;alpha-value&gt; bằng var(&lt;bien&gt;)&gt;</code>; kèm <code>/NN</code> → vẫn phép thay ấy nhưng bằng con số.</li>' +
            '<li>Giá trị <code>var(--x)</code> trần: dạng trần → <code>&lt;prop&gt;: var(--x)</code>; kèm <code>/NN</code> → <b><code>null</code></b>. Đây chính là cái bẫy, và là lý do lớp nền chạy tốt trong khi mọi biến thể độ mờ của nó đều chết.</li>' +
            '<li>Tên màu không biết → <code>null</code>.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và không <code>require</code> thứ gì.</p>',
          ),
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const MAC_DINH = {\n' +
            "  spacing: { 0: '0px', 1: '0.25rem', 2: '0.5rem', 4: '1rem', 8: '2rem', px: '1px' },\n" +
            "  fontSize: { sm: ['0.875rem', { lineHeight: '1.25rem' }], base: ['1rem', { lineHeight: '1.5rem' }] },\n" +
            '  colors: {\n' +
            "    white: '#ffffff',\n" +
            "    gray: { 50: '#f9fafb', 500: '#6b7280', 700: '#374151', 950: '#030712' },\n" +
            "    blue: { 500: '#3b82f6' },\n" +
            '  },\n' +
            '};\n\n' +
            'const CONFIGS = {\n' +
            "  A: { theme: { extend: { spacing: { brand: '7px' }, colors: { brand: '#123456' } } } },\n" +
            "  B: { theme: { spacing: { brand: '7px' } } },\n" +
            "  C: { theme: { extend: { colors: { gray: { 500: '#888888' } } } } },\n" +
            '  D: { theme: { extend: { colors: {\n' +
            "        naive: 'var(--c-naive)',\n" +
            "        smart: 'rgb(var(--c-smart) / <alpha-value>)',\n" +
            "        text: { muted: 'var(--text-muted)' },\n" +
            '      } } } },\n' +
            '};\n\n' +
            'const LOP = [\n' +
            "  'p-4', 'p-brand', 'p-13',\n" +
            "  'text-sm',\n" +
            "  'bg-gray-500', 'bg-gray-700', 'bg-gray-950',\n" +
            "  'bg-brand', 'bg-brand/50',\n" +
            "  'bg-naive', 'bg-naive/50',\n" +
            "  'bg-smart', 'bg-smart/50',\n" +
            "  'text-text-muted', 'text-text-muted/60',\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function giaiTheme(macDinh, config) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function phangMau(mau, tienTo) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function phatSinh(theme, lop) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "for (const ten of ['A', 'B', 'C', 'D']) {\n" +
            '  const theme = giaiTheme(MAC_DINH, CONFIGS[ten]);\n' +
            "  console.log('=== config ' + ten\n" +
            "    + ' | spacing=' + Object.keys(theme.spacing).join(',')\n" +
            "    + ' | mau=' + Object.keys(phangMau(theme.colors)).join(','));\n" +
            '  for (const l of LOP) {\n' +
            '    const css = phatSinh(theme, l);\n' +
            "    if (css) console.log('  .' + l + '  { ' + css + ' }');\n" +
            '  }\n' +
            "  console.log('  KHONG SINH: ' + JSON.stringify(LOP.filter((l) => phatSinh(theme, l) === null)));\n" +
            '}\n',
          expectedOutput:
            '=== config A | spacing=0,1,2,4,8,px,brand | mau=white,gray-50,gray-500,gray-700,gray-950,blue-500,brand\n' +
            '  .p-4  { padding: 1rem }\n' +
            '  .p-brand  { padding: 7px }\n' +
            '  .text-sm  { font-size: 0.875rem; line-height: 1.25rem }\n' +
            '  .bg-gray-500  { --tw-bg-opacity: 1; background-color: rgb(107 114 128 / var(--tw-bg-opacity)) }\n' +
            '  .bg-gray-700  { --tw-bg-opacity: 1; background-color: rgb(55 65 81 / var(--tw-bg-opacity)) }\n' +
            '  .bg-gray-950  { --tw-bg-opacity: 1; background-color: rgb(3 7 18 / var(--tw-bg-opacity)) }\n' +
            '  .bg-brand  { --tw-bg-opacity: 1; background-color: rgb(18 52 86 / var(--tw-bg-opacity)) }\n' +
            '  .bg-brand/50  { background-color: rgb(18 52 86 / 0.5) }\n' +
            '  KHONG SINH: ["p-13","bg-naive","bg-naive/50","bg-smart","bg-smart/50","text-text-muted","text-text-muted/60"]\n' +
            '=== config B | spacing=brand | mau=white,gray-50,gray-500,gray-700,gray-950,blue-500\n' +
            '  .p-brand  { padding: 7px }\n' +
            '  .text-sm  { font-size: 0.875rem; line-height: 1.25rem }\n' +
            '  .bg-gray-500  { --tw-bg-opacity: 1; background-color: rgb(107 114 128 / var(--tw-bg-opacity)) }\n' +
            '  .bg-gray-700  { --tw-bg-opacity: 1; background-color: rgb(55 65 81 / var(--tw-bg-opacity)) }\n' +
            '  .bg-gray-950  { --tw-bg-opacity: 1; background-color: rgb(3 7 18 / var(--tw-bg-opacity)) }\n' +
            '  KHONG SINH: ["p-4","p-13","bg-brand","bg-brand/50","bg-naive","bg-naive/50","bg-smart","bg-smart/50","text-text-muted","text-text-muted/60"]\n' +
            '=== config C | spacing=0,1,2,4,8,px | mau=white,gray-50,gray-500,gray-700,gray-950,blue-500\n' +
            '  .p-4  { padding: 1rem }\n' +
            '  .text-sm  { font-size: 0.875rem; line-height: 1.25rem }\n' +
            '  .bg-gray-500  { --tw-bg-opacity: 1; background-color: rgb(136 136 136 / var(--tw-bg-opacity)) }\n' +
            '  .bg-gray-700  { --tw-bg-opacity: 1; background-color: rgb(55 65 81 / var(--tw-bg-opacity)) }\n' +
            '  .bg-gray-950  { --tw-bg-opacity: 1; background-color: rgb(3 7 18 / var(--tw-bg-opacity)) }\n' +
            '  KHONG SINH: ["p-brand","p-13","bg-brand","bg-brand/50","bg-naive","bg-naive/50","bg-smart","bg-smart/50","text-text-muted","text-text-muted/60"]\n' +
            '=== config D | spacing=0,1,2,4,8,px | mau=white,gray-50,gray-500,gray-700,gray-950,blue-500,naive,smart,text-muted\n' +
            '  .p-4  { padding: 1rem }\n' +
            '  .text-sm  { font-size: 0.875rem; line-height: 1.25rem }\n' +
            '  .bg-gray-500  { --tw-bg-opacity: 1; background-color: rgb(107 114 128 / var(--tw-bg-opacity)) }\n' +
            '  .bg-gray-700  { --tw-bg-opacity: 1; background-color: rgb(55 65 81 / var(--tw-bg-opacity)) }\n' +
            '  .bg-gray-950  { --tw-bg-opacity: 1; background-color: rgb(3 7 18 / var(--tw-bg-opacity)) }\n' +
            '  .bg-naive  { background-color: var(--c-naive) }\n' +
            '  .bg-smart  { --tw-bg-opacity: 1; background-color: rgb(var(--c-smart) / var(--tw-bg-opacity)) }\n' +
            '  .bg-smart/50  { background-color: rgb(var(--c-smart) / 0.5) }\n' +
            '  .text-text-muted  { color: var(--text-muted) }\n' +
            '  KHONG SINH: ["p-brand","p-13","bg-brand","bg-brand/50","bg-naive/50","text-text-muted/60"]',
          sampleSolution:
            'function laObject(v) {\n' +
            "  return v !== null && typeof v === 'object' && !Array.isArray(v);\n" +
            '}\n\n' +
            'function tronSau(a, b) {\n' +
            '  const ra = { ...a };\n' +
            '  for (const [k, v] of Object.entries(b)) {\n' +
            '    ra[k] = laObject(v) && laObject(a[k]) ? tronSau(a[k], v) : v;\n' +
            '  }\n' +
            '  return ra;\n' +
            '}\n\n' +
            'function giaiTheme(macDinh, config) {\n' +
            '  const t = config.theme ?? {};\n' +
            '  const ra = { ...macDinh };\n' +
            '  // Ngoài `extend`: THAY THẾ trọn khoá đó, các khoá khác không đụng tới.\n' +
            "  for (const [k, v] of Object.entries(t)) if (k !== 'extend') ra[k] = v;\n" +
            '  // Trong `extend`: TRỘN SÂU — nên đè một bậc màu KHÔNG xoá mười bậc kia.\n' +
            '  for (const [k, v] of Object.entries(t.extend ?? {})) {\n' +
            '    ra[k] = laObject(v) && laObject(ra[k]) ? tronSau(ra[k], v) : v;\n' +
            '  }\n' +
            '  return ra;\n' +
            '}\n\n' +
            "function phangMau(mau, tienTo = '') {\n" +
            '  const ra = {};\n' +
            '  for (const [k, v] of Object.entries(mau ?? {})) {\n' +
            "    const ten = tienTo ? tienTo + '-' + k : k;\n" +
            '    if (laObject(v)) Object.assign(ra, phangMau(v, ten));\n' +
            '    else ra[ten] = v;\n' +
            '  }\n' +
            '  return ra;\n' +
            '}\n\n' +
            'function hexRaKenh(hex) {\n' +
            "  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ');\n" +
            '}\n\n' +
            'function phatSinh(theme, lop) {\n' +
            "  const [ten, doMo] = lop.split('/');\n" +
            '  const alpha = doMo === undefined ? null : String(Number(doMo) / 100);\n\n' +
            "  if (ten.startsWith('p-') && doMo === undefined) {\n" +
            '    const v = theme.spacing?.[ten.slice(2)];\n' +
            '    return v === undefined ? null : `padding: ${v}`;\n' +
            '  }\n' +
            "  const co = { 'bg-': 'background-color', 'text-': 'color', 'border-': 'border-color' };\n" +
            '  for (const [tienTo, prop] of Object.entries(co)) {\n' +
            '    if (!ten.startsWith(tienTo)) continue;\n' +
            '    const con = ten.slice(tienTo.length);\n' +
            '    // `text-sm` là CỠ CHỮ chứ không phải màu, và nó có thể mang line-height.\n' +
            "    if (tienTo === 'text-' && theme.fontSize?.[con] !== undefined && doMo === undefined) {\n" +
            '      const f = theme.fontSize[con];\n' +
            '      return Array.isArray(f) ? `font-size: ${f[0]}; line-height: ${f[1].lineHeight}` : `font-size: ${f}`;\n' +
            '    }\n' +
            '    const gia = phangMau(theme.colors)[con];\n' +
            '    if (gia === undefined) return null;\n' +
            "    const bien = prop === 'background-color' ? '--tw-bg-opacity'\n" +
            "      : prop === 'color' ? '--tw-text-opacity' : '--tw-border-opacity';\n" +
            "    if (gia.startsWith('#')) {\n" +
            '      const k = hexRaKenh(gia);\n' +
            '      return alpha === null\n' +
            '        ? `${bien}: 1; ${prop}: rgb(${k} / var(${bien}))`\n' +
            '        : `${prop}: rgb(${k} / ${alpha})`;\n' +
            '    }\n' +
            "    if (gia.includes('<alpha-value>')) {\n" +
            '      return alpha === null\n' +
            "        ? `${bien}: 1; ${prop}: ${gia.replace('<alpha-value>', `var(${bien})`)}`\n" +
            "        : `${prop}: ${gia.replace('<alpha-value>', alpha)}`;\n" +
            '    }\n' +
            '    // var() trần: bổ từ độ mờ KHÔNG chèn được kênh alpha ⇒ không sinh gì cả.\n' +
            '    return alpha === null ? `${prop}: ${gia}` : null;\n' +
            '  }\n' +
            '  return null;\n' +
            '}\n',
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
