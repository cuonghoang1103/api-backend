/**
 * Tailwind CSS — Practical Exam (PE): 5 câu thực hành, nộp .zip.
 *
 * Đề tự soạn, bám sát `content/courses/tailwind-css/s00…s11`. Khác đề FE (50
 * câu trắc nghiệm, đọc CSS phát sinh), đề này bắt VIẾT hiện vật: một cấu hình
 * theme bằng biến CSS mà bổ từ độ mờ vẫn sống, một file CSS đầu vào xếp đúng ba
 * dải, một component giữ được hợp đồng `className`, và hai script ĐO — một cái
 * tìm lớp chết, một cái trả lời "ai thắng".
 *
 * ⚠️ PHIÊN BẢN: **Tailwind 3.4.14**, giống hệt `frontend/package.json:108` của
 * kho này (`"tailwindcss": "^3.4.14"`). Mọi thứ dưới đây viết theo v3 —
 * `tailwind.config.js` + ba chỉ thị `@tailwind`, KHÔNG phải `@theme` và
 * `@import "tailwindcss"` của v4, và dấu quan trọng là TIỀN TỐ `!mt-4` chứ
 * không phải hậu tố `mt-4!` (đo thật: hậu tố sinh ra SỐ 0 quy tắc trên 3.4.14).
 *
 * ⚠️ MỌI `sampleSolution` VÀ MỌI `expectedOutput` DƯỚI ĐÂY ĐÃ CHẠY THẬT:
 *   • Q1: dựng bằng `tailwindcss@3.4.14` CLI với đúng config và đúng file CSS
 *     trong lời giải. `bg-surface`, `text-2xs`, `text-muted/70`,
 *     `border-brand/30` và `dark:bg-brand` đều phát sinh; `grep -c '@layer'`
 *     trả 0. Đoạn CSS trong `expectedOutput` là nguyên văn máy in ra.
 *   • Q2: dựng thật; số dòng trong `expectedOutput` là số dòng thật của file
 *     đầu ra (`.rich-text h1` 557 → `.btn` 570 → `.px-8` 591 → `.tap-none` 601
 *     → khối `prefers-reduced-motion` không-layer 613).
 *   • Q3: bốn chuỗi lớp trong `expectedOutput` là đầu ra thật của
 *     `twMerge(clsx(...))` với `tailwind-merge@2.5.4` + `clsx`, chạy trên đúng
 *     bảng biến thể trong lời giải.
 *   • Q4 và Q5: lời giải là chương trình Node độc lập, và
 *     `node scripts/exam-check.mjs` CHẠY LẠI chúng rồi so từng dòng với
 *     `expectedOutput` — hai câu này tự kiểm được, không cần tin đề.
 *
 * ⚠️ BA CÂU ĐẦU KHÔNG CHẠY ĐƯỢC TRONG BỘ KIỂM, VÀ ĐÓ LÀ GIỚI HẠN CỦA BỘ KIỂM
 * CHỨ KHÔNG PHẢI LỖI CỦA ĐỀ. Bộ kiểm chỉ có `node` và `bash`; Q1 là một module
 * cấu hình không in ra gì, Q2 là CSS, Q3 là một component React. Cả ba khai
 * `khongChayDuoc` với lý do bằng chữ (cơ chế đã có sẵn trong
 * `scripts/exam-check.mjs`, dòng 221), nên bộ kiểm in một dòng `ℹ` và KHÔNG
 * đếm là lỗi. Cách kiểm chứng thật của ba câu đó là chạy Tailwind CLI theo đúng
 * các lệnh in trong từng `expectedOutput` — mọi lượt chạy đã ghi ở trên.
 *
 * Kiểm: node scripts/exam-check.mjs ./content/exams/TAILWIND-CSS-PE.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/TAILWIND-CSS-PE.mjs --apply
 */
import { B, c, codeQ } from './_lib/tailwind-exam-kit.mjs';

/**
 * Rubric riêng cho từng câu: tổng `maxScore` đúng bằng `points` của câu, nên
 * điểm từng tiêu chí cộng lại ra thẳng điểm câu — không phải quy đổi.
 */
const rubric = (rows) => rows.map(([id, en, vi, maxScore]) => ({
  id,
  criterion: B(en, vi),
  weight: maxScore,
  maxScore,
}));

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>How to take this exam.</b></p>' +
  '<ol>' +
  '<li>Create five folders named <code>Q1 … Q5</code> on your own machine. Each question names the exact files it wants inside its folder and shows a <b>Starter</b> block — copy it in <b>verbatim</b> and write your answer only between the two <code>ĐỀ CHO SẴN</code> markers. The given data and the printing loop are part of the grading; changing them is how you fail a question you actually solved.</li>' +
  '<li><b>Tailwind 3.4.x only</b>, installed with <code>npm i -D tailwindcss@3.4.14</code>. For Q3 you may also use <code>clsx</code> and <code>tailwind-merge</code>. Nothing else — no plugin, no component library, no PostCSS preset.</li>' +
  '<li><b>Build it before you submit.</b> Q1 and Q2 are checked by running the CLI and <em>reading the generated CSS</em>, with the exact commands printed in the "expected output" block. A class you wrote is not a rule that exists; only the output file settles that. Q3 is checked by printing the resolved class string for each call site. Q4 and Q5 are plain Node scripts — run them with <code>node Q4.js</code> and compare line for line.</li>' +
  '<li>Zip the five folders into <b>one .zip</b> and upload it in the submit box.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> Behaviour first — a config that does not build, or a script that prints the wrong lines, cannot pass. But this is a Tailwind exam, so the <b>shape</b> of the artifact is graded too: a colour declared as a bare <code>var()</code> so its opacity modifiers silently do not exist, a <code>theme</code> key written outside <code>extend</code>, a class name assembled by string interpolation, a <code>className</code> prop merged anywhere but last, an <code>outline-none</code> with no focus ring put back, or an <code>!important</code> reached for before a merge all cost marks <em>even when the page looks right</em>. If in doubt, ask of every class: will this rule be generated, and if two rules collide, did I decide which one wins or did the sort decide for me?</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài thi.</b></p>' +
  '<ol>' +
  '<li>Tạo năm thư mục tên <code>Q1 … Q5</code> trên máy của bạn. Mỗi câu ghi rõ những file nào phải nằm trong thư mục của nó và có một khối <b>Mã cho sẵn</b> — chép <b>nguyên văn</b> vào rồi chỉ viết lời giải ở vùng giữa hai mốc <code>ĐỀ CHO SẴN</code>. Phần dữ liệu cho sẵn và vòng lặp in kết quả là một phần của việc chấm; sửa chúng là cách trượt một câu mà bạn thật ra đã làm được.</li>' +
  '<li><b>Chỉ Tailwind 3.4.x</b>, cài bằng <code>npm i -D tailwindcss@3.4.14</code>. Riêng câu 3 bạn được dùng thêm <code>clsx</code> và <code>tailwind-merge</code>. Ngoài ra không gì nữa — không plugin, không thư viện component, không preset PostCSS.</li>' +
  '<li><b>Dựng thử trước khi nộp.</b> Câu 1 và câu 2 được kiểm bằng cách chạy CLI rồi ĐỌC phần CSS phát sinh, với đúng những câu lệnh in trong khối "kết quả mong đợi". Một lớp bạn VIẾT không phải một quy tắc TỒN TẠI; chỉ file đầu ra mới dàn xếp được chuyện đó. Câu 3 được kiểm bằng cách in chuỗi lớp đã phân giải cho từng chỗ gọi. Câu 4 và câu 5 là script Node thuần — chạy bằng <code>node Q4.js</code> rồi đối chiếu từng dòng.</li>' +
  '<li>Nén năm thư mục thành <b>một file .zip</b> rồi tải lên ô nộp bài.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Hành vi trước — một cấu hình không dựng được, hay một script in sai dòng, thì không thể qua. Nhưng đây là bài thi Tailwind, nên <b>hình dạng</b> của hiện vật cũng bị chấm: một màu khai bằng <code>var()</code> trần khiến mọi bổ từ độ mờ của nó âm thầm không tồn tại, một khoá <code>theme</code> viết ngoài <code>extend</code>, một tên lớp ghép bằng nội suy chuỗi, một prop <code>className</code> hợp nhất ở bất cứ đâu ngoài vị trí cuối, một <code>outline-none</code> không trả lại vòng focus, hay một <code>!important</code> với tay tới trước khi thử hợp nhất — tất cả đều bị trừ điểm <em>ngay cả khi trang trông vẫn đúng</em>. Lúc phân vân, hãy hỏi từng lớp một: quy tắc này có được PHÁT SINH không, và nếu hai quy tắc đụng nhau thì TÔI quyết ai thắng hay để phép sắp quyết hộ?</p>' +
  '</div>';

/* ─────────────────────────── Câu 1 ─────────────────────────── */

const Q1_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Q1/src/index.html  (cho sẵn, KHÔNG sửa)\n' +
  '//   <div class="bg-surface text-ink text-2xs">\n' +
  '//     <p class="text-muted/70 border-brand/30">x</p>\n' +
  '//     <p class="dark:bg-brand">y</p>\n' +
  '//   </div>\n' +
  '//\n' +
  '// Viết HAI file: Q1/tailwind.config.js và Q1/theme.css\n' +
  '// Dựng bằng:\n' +
  '//   npx tailwindcss -c tailwind.config.js -i theme.css -o out.css\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '// tailwind.config.js\n' +
  '\n' +
  '// theme.css\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Lớp đánh dấu theme tối PHẢI là `theme-dark`, KHÔNG được là `dark`.\n';

const Q1_SOLUTION =
  '// ── tailwind.config.js ─────────────────────────────────────────────────\n' +
  '/** @type {import("tailwindcss").Config} */\n' +
  'module.exports = {\n' +
  '  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],\n' +
  '  // Dạng ["selector", "<selector>"] cho phép chọn TÊN LỚP đánh dấu. Đặt tên\n' +
  '  // nó là `dark` sẽ ép kích hoạt mọi tiện ích `dark:` của cả ứng dụng —\n' +
  '  // đúng sự cố 02/07/2026 của kho này. Và `selector` sinh ra `:where(...)`,\n' +
  '  // đóng góp độ đặc hiệu BẰNG KHÔNG, nên tiện ích tối và tiện ích sáng vẫn\n' +
  '  // cùng trọng lượng 0-1-0.\n' +
  '  darkMode: ["selector", "html.theme-dark"],\n' +
  '  theme: {\n' +
  '    // `extend`, KHÔNG phải `theme` trần: viết thẳng `colors` ở đây sẽ thay\n' +
  '    // sạch 22 họ màu mặc định mà không báo một lỗi nào.\n' +
  '    extend: {\n' +
  '      colors: {\n' +
  '        // DẠNG KÊNH + <alpha-value>. Nếu viết "var(--c-surface)" trần thì\n' +
  '        // `bg-surface` vẫn sinh ra, còn `bg-surface/70` sinh ra SỐ 0 quy tắc\n' +
  '        // — im lặng, không cảnh báo, chữ hiện ra đặc 100%.\n' +
  '        surface: "rgb(var(--c-surface) / <alpha-value>)",\n' +
  '        ink:     "rgb(var(--c-ink) / <alpha-value>)",\n' +
  '        muted:   "rgb(var(--c-muted) / <alpha-value>)",\n' +
  '        brand:   "rgb(var(--c-brand) / <alpha-value>)",\n' +
  '      },\n' +
  '      // Thang chữ mặc định dừng ở xs = 12px. Nhãn 10px vì thế phải thoát ra\n' +
  '      // ngoài thang bằng text-[10px]; đặt cho nó một cái tên là dọn đúng chỗ.\n' +
  '      fontSize: {\n' +
  '        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],\n' +
  '      },\n' +
  '    },\n' +
  '  },\n' +
  '  plugins: [],\n' +
  '};\n' +
  '\n' +
  '/* ── theme.css ─────────────────────────────────────────────────────────\n' +
  '@tailwind base;\n' +
  '@tailwind components;\n' +
  '@tailwind utilities;\n' +
  '\n' +
  ':root {\n' +
  '  --c-surface: 255 255 255;\n' +
  '  --c-ink:      15  23  42;\n' +
  '  --c-muted:   100 116 139;\n' +
  '  --c-brand:    37  99 235;\n' +
  '}\n' +
  '\n' +
  'html.theme-dark {\n' +
  '  --c-surface: 24 25 26;\n' +
  '  --c-ink:    241 245 249;\n' +
  '  --c-muted:  148 163 184;\n' +
  '  --c-brand:   96 165 250;\n' +
  '}\n' +
  '── hết theme.css ───────────────────────────────────────────────────── */\n';

const Q1_OUTPUT =
  '$ npx tailwindcss -c tailwind.config.js -i theme.css -o out.css\n' +
  'Done in <n>ms.\n' +
  '\n' +
  '$ grep -A3 "^.bg-surface" out.css\n' +
  '.bg-surface {\n' +
  '  --tw-bg-opacity: 1;\n' +
  '  background-color: rgb(var(--c-surface) / var(--tw-bg-opacity));\n' +
  '}\n' +
  '\n' +
  '$ grep -A2 "^.text-muted" out.css\n' +
  '.text-muted\\/70 {\n' +
  '  color: rgb(var(--c-muted) / 0.7);\n' +
  '}\n' +
  '\n' +
  '$ grep -A2 "^.border-brand" out.css\n' +
  '.border-brand\\/30 {\n' +
  '  border-color: rgb(var(--c-brand) / 0.3);\n' +
  '}\n' +
  '\n' +
  '$ grep -A3 "^.text-2xs" out.css\n' +
  '.text-2xs {\n' +
  '  font-size: 0.625rem;\n' +
  '  line-height: 0.875rem;\n' +
  '}\n' +
  '\n' +
  '$ grep -A1 "dark..bg-brand" out.css\n' +
  '.dark\\:bg-brand:where(html.theme-dark, html.theme-dark *) {\n' +
  '  --tw-bg-opacity: 1;\n' +
  '\n' +
  '$ grep -c "@layer" out.css\n' +
  '0\n' +
  '\n' +
  '# Chốt cuối: thang mặc định PHẢI còn sống (dấu hiệu đã dùng `extend`).\n' +
  '$ grep -c "^.text-sm {" out.css   # sau khi thêm text-sm vào index.html\n' +
  '1';

/* ─────────────────────────── Câu 2 ─────────────────────────── */

const Q2_STARTER =
  '/* ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '   Q2/src/index.html  (cho sẵn, KHÔNG sửa)\n' +
  '     <button class="btn px-8">a</button>\n' +
  '     <div class="rich-text tap-none outline-none focus-visible:ring-2\n' +
  '                 motion-safe:animate-pulse">\n' +
  '       <h1>t</h1><ul><li>i</li></ul>\n' +
  '     </div>\n' +
  '\n' +
  '   `.rich-text` bọc HTML đến từ CMS — bạn KHÔNG đặt được lớp tiện ích lên\n' +
  '   các thẻ bên trong nó.\n' +
  '\n' +
  '   Viết MỘT file: Q2/globals.css. Dựng bằng:\n' +
  '     npx tailwindcss -i globals.css -o out.css --content "./src/index.html"\n' +
  '   ───────────────────────────────────────────────────────────────────── */\n' +
  '\n' +
  '/* ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ──────────────────────────────────────── */\n' +
  '\n' +
  '/* ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '   `.btn` PHẢI bị `px-8` của người gọi đè được. Kiểm bằng số dòng, không\n' +
  '   bằng cảm giác.\n' +
  '   ───────────────────────────────────────────────────────────────────── */\n';

const Q2_SOLUTION =
  '/* 1. Ba chỉ thị, ĐÚNG thứ tự. Chúng là ĐIỂM CHÈN nguyên văn: đảo\n' +
  '      `utilities` lên đầu thì Preflight ĐÈ tiện ích, dựng vẫn xanh, exit 0. */\n' +
  '@tailwind base;\n' +
  '@tailwind components;\n' +
  '@tailwind utilities;\n' +
  '\n' +
  '/* 2. base — trả lại thứ Preflight đã lột, và CHỈ trong vùng HTML ta không\n' +
  '      kiểm soát. Preflight gỡ cỡ h1 và dấu đầu dòng của ul (555 dòng, 41 quy\n' +
  '      tắc); nội dung CMS vì thế trông trần trụi cho tới khi được đặt lại. */\n' +
  '@layer base {\n' +
  '  .rich-text h1 { @apply text-3xl font-bold mb-4; }\n' +
  '  .rich-text ul { @apply list-disc pl-6 mb-4; }\n' +
  '}\n' +
  '\n' +
  '/* 3. components — lớp mà tiện ích PHẢI đè được. Nằm ở dải này nghĩa là nó\n' +
  '      được phát sinh TRƯỚC khối tiện ích, nên `px-8` cùng 0-1-0 vẫn thắng.\n' +
  '      `outline-none` ở đây luôn đi kèm vòng focus thay thế, không bao giờ\n' +
  '      đứng một mình. */\n' +
  '@layer components {\n' +
  '  .btn {\n' +
  '    @apply inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold;\n' +
  '    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2;\n' +
  '  }\n' +
  '}\n' +
  '\n' +
  '/* 4. utilities — tiện ích của riêng ta, thứ phải thắng được component. */\n' +
  '@layer utilities {\n' +
  '  .tap-none { -webkit-tap-highlight-color: transparent; }\n' +
  '}\n' +
  '\n' +
  '/* 5. Chốt chuyển động cho hoạt ảnh KHÔNG đi qua lớp tiện ích. Biến thể\n' +
  '      `motion-reduce:` chỉ chắn được phần tử MANG nó; hoạt ảnh của HTML từ\n' +
  '      CMS không mang lớp nào, nên nó cần khối media của riêng nó. Để NGOÀI\n' +
  '      mọi dải là cố ý: viết sau `@tailwind utilities` thì nó nằm sau khối\n' +
  '      tiện ích thường, đúng chỗ một cú chắn cần đứng.\n' +
  '      (Chú thích ở đây cố tình KHÔNG gõ tên cái chỉ thị dải: chú thích được\n' +
  '       giữ nguyên trong đầu ra, nên một dòng chữ nhắc tới nó sẽ làm chính\n' +
  '       phép đếm bên dưới trả về 1 và bộ kiểm nói dối về đề của bạn.) */\n' +
  '@media (prefers-reduced-motion: reduce) {\n' +
  '  .rich-text * {\n' +
  '    animation: none !important;\n' +
  '    transition: none !important;\n' +
  '  }\n' +
  '}\n';

const Q2_OUTPUT =
  '$ npx tailwindcss -i globals.css -o out.css --content "./src/index.html"\n' +
  'Done in <n>ms.\n' +
  '\n' +
  '# Thứ tự ba dải, đọc bằng SỐ DÒNG chứ không bằng cảm giác:\n' +
  '$ grep -n "^.rich-text h1\\|^.btn {\\|^.px-8 {\\|^.tap-none\\|prefers-reduced-motion" out.css\n' +
  '558:.rich-text h1 {\n' +
  '571:.btn {\n' +
  '592:.px-8 {\n' +
  '602:.tap-none {\n' +
  '626:@media (prefers-reduced-motion: reduce) {\n' +
  '639:@media (prefers-reduced-motion: no-preference) {\n' +
  '\n' +
  '# 571 < 592  =>  `px-8` cua nguoi goi DE duoc `px-4` cua .btn. Dat chinh\n' +
  '#               .btn ra ngoai moi dai thi no roi xuong sau 592 va cu ghi\n' +
  '#               de im lang khong con tac dung.\n' +
  '\n' +
  '$ grep -c "@layer" out.css\n' +
  '0\n' +
  '# Chi thi dai cua Tailwind 3 la chi thi DI DOI luc dung, khong phai\n' +
  '# cascade layer cua CSS. No bi vut sau khi doi xong.\n' +
  '# CANH BAO: chu thich CSS duoc GIU NGUYEN trong dau ra, nen mot dong\n' +
  '# chu nhac ten chi thi ay se lam chinh phep dem nay tra ve 1. So dong\n' +
  '# ben tren cung dich len xuong theo so dong chu thich ban viet — hay\n' +
  '# doc THU TU, dung hoc thuoc con so.\n' +
  '\n' +
  '$ wc -l < out.css\n' +
  '649';

/* ─────────────────────────── Câu 3 ─────────────────────────── */

const Q3_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Q3/cn.ts  (cho sẵn)\n' +
  '//   import clsx, { type ClassValue } from "clsx";\n' +
  '//   import { twMerge } from "tailwind-merge";\n' +
  '//   export const cn = (...i: ClassValue[]) => twMerge(clsx(i));\n' +
  '//\n' +
  '// Viết Q3/Button.tsx. Component nhận: variant "primary" | "ghost" | "danger",\n' +
  '// size "sm" | "md" | "lg", và một prop className.\n' +
  '//\n' +
  '// Q3/in-lop.ts  (cho sẵn, KHÔNG sửa) in ra chuỗi lớp đã phân giải:\n' +
  '//   const CA = [\n' +
  '//     ["mac dinh",         {}],\n' +
  '//     ["danger lg",        { variant: "danger", size: "lg" }],\n' +
  '//     ["ghost + ghi de co",{ variant: "ghost", className: "px-8 text-base" }],\n' +
  '//     ["ghi de mau nen",   { className: "bg-emerald-600" }],\n' +
  '//   ];\n' +
  '//   for (const [nhan, p] of CA) console.log(nhan + "\\n  " + lopCuaNut(p));\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '// Button.tsx — export ca `lopCuaNut` lan component `Button`\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Cac lop nen dung DUNG bang the nay, khong duoc doi:\n' +
  '//   nen    inline-flex items-center justify-center rounded-lg font-semibold\n' +
  '//          focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50\n' +
  '//   sm     h-8 px-3 text-xs        md  h-10 px-4 text-sm   lg  h-12 px-6 text-base\n';

const Q3_SOLUTION =
  'import * as React from "react";\n' +
  'import { cn } from "./cn";\n' +
  '\n' +
  '// Bảng biến thể là DỮ LIỆU, không phải một chuỗi if. Mỗi tên lớp ở đây là\n' +
  '// một chuỗi HOÀN CHỈNH — không có `bg-${x}-600` nào, vì một tên ghép lúc\n' +
  '// chạy không bao giờ xuất hiện trong file mà `content` quét, nên quy tắc\n' +
  '// KHÔNG được phát sinh và phần tử hiện ra không có kiểu dáng, im lặng.\n' +
  'const NEN =\n' +
  '  "inline-flex items-center justify-center rounded-lg font-semibold " +\n' +
  '  // outline-none phát sinh `outline: 2px solid transparent` (giữ cho chế độ\n' +
  '  // tương phản cao của Windows), nhưng về mặt thị giác nó XOÁ chỉ báo focus.\n' +
  '  // Nên nó chỉ được đi kèm một vòng thay thế, ngay tại đây.\n' +
  '  "focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50";\n' +
  '\n' +
  'const KIEU = {\n' +
  '  primary: "bg-brand text-white hover:bg-brand/90",\n' +
  '  ghost:   "bg-transparent text-ink hover:bg-ink/10",\n' +
  '  danger:  "bg-red-600 text-white hover:bg-red-700",\n' +
  '} as const;\n' +
  '\n' +
  'const CO = {\n' +
  '  sm: "h-8 px-3 text-xs",\n' +
  '  md: "h-10 px-4 text-sm",\n' +
  '  lg: "h-12 px-6 text-base",\n' +
  '} as const;\n' +
  '\n' +
  'export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {\n' +
  '  variant?: keyof typeof KIEU;\n' +
  '  size?: keyof typeof CO;\n' +
  '};\n' +
  '\n' +
  '// className của người gọi là ĐỐI SỐ CUỐI. twMerge phân giải theo thứ tự đối\n' +
  '// số với cái sau thắng; đặt nó ở bất kỳ chỗ nào khác thì lớp của chính\n' +
  '// component thắng lớp của người gọi và cái prop âm thầm mất tác dụng.\n' +
  'export function lopCuaNut({\n' +
  '  variant = "primary",\n' +
  '  size = "md",\n' +
  '  className,\n' +
  '}: Pick<ButtonProps, "variant" | "size" | "className">) {\n' +
  '  return cn(NEN, KIEU[variant], CO[size], className);\n' +
  '}\n' +
  '\n' +
  'export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(\n' +
  '  function Button({ variant, size, className, type, ...rest }, ref) {\n' +
  '    return (\n' +
  '      <button\n' +
  '        ref={ref}\n' +
  '        // Mặc định "button": một <button> trong <form> mà thiếu nó sẽ submit.\n' +
  '        type={type ?? "button"}\n' +
  '        className={lopCuaNut({ variant, size, className })}\n' +
  '        {...rest}\n' +
  '      />\n' +
  '    );\n' +
  '  },\n' +
  ');\n';

const Q3_OUTPUT =
  '$ npx tsx in-lop.ts\n' +
  'mac dinh\n' +
  '  inline-flex items-center justify-center rounded-lg font-semibold ' +
  'focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 ' +
  'bg-brand text-white hover:bg-brand/90 h-10 px-4 text-sm\n' +
  'danger lg\n' +
  '  inline-flex items-center justify-center rounded-lg font-semibold ' +
  'focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 ' +
  'bg-red-600 text-white hover:bg-red-700 h-12 px-6 text-base\n' +
  'ghost + ghi de co\n' +
  '  inline-flex items-center justify-center rounded-lg font-semibold ' +
  'focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 ' +
  'bg-transparent text-ink hover:bg-ink/10 h-10 px-8 text-base\n' +
  'ghi de mau nen\n' +
  '  inline-flex items-center justify-center rounded-lg font-semibold ' +
  'focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 ' +
  'text-white hover:bg-brand/90 h-10 px-4 text-sm bg-emerald-600\n' +
  '\n' +
  '# Doc ky hai dong cuoi cung:\n' +
  '#   "ghost + ghi de co" -> px-4 BIEN MAT, px-8 dung dung cho no; text-sm\n' +
  '#      bien mat, text-base thay vao. Do la hop dong className duoc giu.\n' +
  '#   "ghi de mau nen"    -> bg-brand bien mat, bg-emerald-600 noi vao CUOI,\n' +
  '#      nhung hover:bg-brand/90 VAN CON. Bien the la mot phan cua khoa nhom,\n' +
  '#      nen de mau nen KHONG de mau hover. Do khong phai bo bi kip; do la\n' +
  '#      thu ban phai biet truoc khi hua voi nguoi goi rang ho ghi de duoc.';

/* ─────────────────────────── Câu 4 ─────────────────────────── */

const Q4_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// CSS là bản đã dựng. THE là các thuộc tính class rút từ component.\n' +
  '// Trong CSS đã dựng, ký tự đặc biệt của tên lớp bị THOÁT bằng dấu chéo\n' +
  '// ngược: `mt-0.5` ra `.mt-0\\.5`, `bg-red-500/50` ra `.bg-red-500\\/50`.\n' +
  'const CSS = [\n' +
  '  ".mt-4 { margin-top: 1rem; }",\n' +
  '  ".bg-cat-vocab-bg { background-color: var(--cat-vocab-bg); }",\n' +
  '  ".bg-red-500 { background-color: rgb(239 68 68 / var(--tw-bg-opacity)); }",\n' +
  '  ".bg-red-500\\\\/50 { background-color: rgb(239 68 68 / 0.5); }",\n' +
  '  ".mt-0\\\\.5 { margin-top: 0.125rem; }",\n' +
  '  ".text-\\\\[10px\\\\] { font-size: 10px; }",\n' +
  '  "@media (min-width: 768px) {",\n' +
  '  "  .md\\\\:p-8 { padding: 2rem; }",\n' +
  '  "}",\n' +
  '].join("\\n");\n' +
  '\n' +
  'const THE = [\n' +
  '  { file: "Card.tsx",  classes: "mt-4 bg-cat-vocab-bg/70 md:p-8" },\n' +
  '  { file: "Badge.tsx", classes: "text-[10px] bg-elevated mt-0.5" },\n' +
  '  { file: "Alert.tsx", classes: "bg-red-500/50 mt-4! bg-red-500" },\n' +
  '];\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'function soat(css, the) {\n' +
  '  throw new Error("chưa cài đặt");\n' +
  '}\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'for (const dong of soat(CSS, THE)) console.log(dong);\n';

const Q4_SOLUTION =
  'function soat(css, the) {\n' +
  '  // 1. Tập tên lớp THẬT SỰ được phát sinh. Một selector là `.<tên> {` ở đầu\n' +
  '  //    dòng hoặc thụt vào trong một at-rule; bỏ dấu thoát để lấy tên gốc.\n' +
  '  const sinhRa = new Set();\n' +
  '  for (const m of css.matchAll(/^\\s*\\.((?:\\\\.|[^\\\\{\\s])+)\\s*\\{/gm)) {\n' +
  '    sinhRa.add(m[1].replace(/\\\\(.)/g, "$1"));\n' +
  '  }\n' +
  '\n' +
  '  // 2. Mọi lớp trong mã đánh dấu mà KHÔNG có quy tắc nào. Đây là chủng loại\n' +
  '  //    hỏng trong im lặng: dựng xanh, console sạch, DevTools không gạch dòng\n' +
  '  //    nào (muốn bị gạch thì phải có một khai báo đã THUA, mà ở đây không có\n' +
  '  //    khai báo nào cả), và phần tử hiện ra như một lựa chọn thiết kế.\n' +
  '  const dong = [];\n' +
  '  const dem = { ALPHA: 0, "CU-PHAP-V4": 0, "KHONG-CO": 0 };\n' +
  '  for (const { file, classes } of the) {\n' +
  '    for (const ten of classes.split(/\\s+/).filter(Boolean)) {\n' +
  '      if (sinhRa.has(ten)) continue;\n' +
  '      // 3. Ba nguyên nhân, ba cú vá khác nhau — nên phải phân loại, không\n' +
  '      //    phải chỉ đếm.\n' +
  '      //    ALPHA: lớp NỀN có sinh ra, chỉ bổ từ độ mờ là chết. Dấu hiệu chắc\n' +
  '      //      chắn của một màu khai bằng `var(--x)` trần trong config; vá\n' +
  '      //      bằng dạng kênh `rgb(var(--x) / <alpha-value>)`.\n' +
  '      //    CU-PHAP-V4: hậu tố `!` là cú pháp quan trọng của Tailwind 4. Trên\n' +
  '      //      3.4 nó sinh ra SỐ 0 quy tắc; tiền tố `!mt-4` mới là dạng đúng.\n' +
  '      //    KHONG-CO: token chưa từng tồn tại, bị đổi tên, hoặc gõ nhầm.\n' +
  '      const cat = ten.endsWith("!")\n' +
  '        ? "CU-PHAP-V4"\n' +
  '        : (ten.includes("/") && sinhRa.has(ten.slice(0, ten.lastIndexOf("/"))))\n' +
  '          ? "ALPHA"\n' +
  '          : "KHONG-CO";\n' +
  '      dem[cat] += 1;\n' +
  '      dong.push(`${cat} ${ten} (${file})`);\n' +
  '    }\n' +
  '  }\n' +
  '\n' +
  '  // 4. Sắp để hai lượt chạy khác nhau so được với nhau bằng diff.\n' +
  '  dong.sort();\n' +
  '  return [\n' +
  '    ...dong,\n' +
  '    `TONG ${dong.length} lop chet`,\n' +
  '    `ALPHA=${dem.ALPHA} CU-PHAP-V4=${dem["CU-PHAP-V4"]} KHONG-CO=${dem["KHONG-CO"]}`,\n' +
  '  ];\n' +
  '}\n';

const Q4_OUTPUT =
  'ALPHA bg-cat-vocab-bg/70 (Card.tsx)\n' +
  'CU-PHAP-V4 mt-4! (Alert.tsx)\n' +
  'KHONG-CO bg-elevated (Badge.tsx)\n' +
  'TONG 3 lop chet\n' +
  'ALPHA=1 CU-PHAP-V4=1 KHONG-CO=1';

/* ─────────────────────────── Câu 5 ─────────────────────────── */

const Q5_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// CSS là bản đã dựng, các quy tắc nằm ĐÚNG thứ tự Tailwind phát sinh.\n' +
  '// Chú ý: `.px-4` đứng TRƯỚC `.px-8`, và `.mt-32` đứng TRƯỚC `.mt-8` — đó là\n' +
  '// phép sắp CHUỖI, không phải phép sắp số.\n' +
  'const CSS = [\n' +
  '  ".\\\\!mt-2 { margin-top: 0.5rem !important; }",\n' +
  '  ".mt-1 { margin-top: 0.25rem; }",\n' +
  '  ".mt-32 { margin-top: 8rem; }",\n' +
  '  ".mt-4 { margin-top: 1rem; }",\n' +
  '  ".mt-8 { margin-top: 2rem; }",\n' +
  '  ".px-4 { padding-left: 1rem; padding-right: 1rem; }",\n' +
  '  ".px-8 { padding-left: 2rem; padding-right: 2rem; }",\n' +
  '  ".text-sm { font-size: 0.875rem; }",\n' +
  '  ".group:hover .group-hover\\\\:mt-96 { margin-top: 24rem; }",\n' +
  '  "@media (min-width: 768px) {",\n' +
  '  "  .md\\\\:px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }",\n' +
  '  "}",\n' +
  '].join("\\n");\n' +
  '\n' +
  'const THE = [\n' +
  '  { ten: "Card",  classes: "mt-1 mt-32 mt-8 mt-4 px-8 px-4 text-sm" },\n' +
  '  { ten: "Panel", classes: "mt-32 !mt-2 group-hover:mt-96 md:px-2 bg-elevated" },\n' +
  '];\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'function aiThang(css, the) {\n' +
  '  throw new Error("chưa cài đặt");\n' +
  '}\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'for (const dong of aiThang(CSS, THE)) console.log(dong);\n';

const Q5_SOLUTION =
  'const go = (s) => s.replace(/\\\\(.)/g, "$1");\n' +
  '\n' +
  'function docCss(css) {\n' +
  '  // `don`: các quy tắc mà selector là ĐÚNG MỘT tên lớp và nằm ở đầu dòng —\n' +
  '  // tức không ở trong at-rule nào. Chỉ những quy tắc này mới so được với\n' +
  '  // nhau bằng THỨ TỰ NGUỒN, vì chúng cùng độ đặc hiệu 0-1-0 và cùng áp vô\n' +
  '  // điều kiện. `thuTu` chính là "dòng thứ mấy" — thứ mà DevTools không hiện.\n' +
  '  const don = new Map();\n' +
  '  let thuTu = 0;\n' +
  '  for (const m of css.matchAll(/^\\.((?:\\\\.|[A-Za-z0-9_-])+)\\s*\\{([^}]*)\\}/gm)) {\n' +
  '    thuTu += 1;\n' +
  '    const kb = [];\n' +
  '    for (const doan of m[2].split(";")) {\n' +
  '      const p = doan.indexOf(":");\n' +
  '      if (p < 0) continue;\n' +
  '      let val = doan.slice(p + 1).trim();\n' +
  '      const quan = val.endsWith("!important");\n' +
  '      if (quan) val = val.replace(/\\s*!important$/, "");\n' +
  '      kb.push({ prop: doan.slice(0, p).trim(), val, quan });\n' +
  '    }\n' +
  '    don.set(go(m[1]), { thuTu, kb });\n' +
  '  }\n' +
  '  // `moi`: MỌI tên lớp xuất hiện ở bất kỳ selector nào — kể cả trong at-rule\n' +
  '  // và kể cả trong selector con cháu. Hiệu của hai tập là chỗ phân biệt\n' +
  '  // "có điều kiện" với "chưa từng được phát sinh".\n' +
  '  const moi = new Set();\n' +
  '  for (const m of css.matchAll(/\\.((?:\\\\.|[A-Za-z0-9_-])+)/g)) moi.add(go(m[1]));\n' +
  '  return { don, moi };\n' +
  '}\n' +
  '\n' +
  'function aiThang(css, the) {\n' +
  '  const { don, moi } = docCss(css);\n' +
  '  const ra = [];\n' +
  '  for (const { ten, classes } of the) {\n' +
  '    const co = classes.split(/\\s+/).filter(Boolean);\n' +
  '    const thang = new Map();\n' +
  '    for (const lop of co) {\n' +
  '      const r = don.get(lop);\n' +
  '      if (!r) continue;\n' +
  '      for (const d of r.kb) {\n' +
  '        const cu = thang.get(d.prop);\n' +
  '        // Luật cascade, đúng ba nhánh và đúng thứ tự này: quan trọng thắng\n' +
  '        // không quan trọng; cùng mức quan trọng thì cái phát sinh SAU thắng.\n' +
  '        // Thứ tự VIẾT trong thuộc tính class không xuất hiện ở đâu cả — vì\n' +
  '        // trình duyệt không bao giờ nhìn thấy nó.\n' +
  '        if (!cu || (d.quan && !cu.quan) || (d.quan === cu.quan && r.thuTu > cu.thuTu)) {\n' +
  '          thang.set(d.prop, { lop, val: d.val, quan: d.quan, thuTu: r.thuTu });\n' +
  '        }\n' +
  '      }\n' +
  '    }\n' +
  '    const nguoiThang = new Set([...thang.values()].map((w) => w.lop));\n' +
  '    ra.push(`# ${ten}`);\n' +
  '    for (const prop of [...thang.keys()].sort()) {\n' +
  '      const w = thang.get(prop);\n' +
  '      ra.push(`  ${prop} <- ${w.lop} = ${w.val}${w.quan ? " !" : ""}`);\n' +
  '    }\n' +
  '    // Ba rổ, ba cú vá khác nhau — gộp chúng lại là mất hết thông tin.\n' +
  '    const thua = co.filter((x) => don.has(x) && !nguoiThang.has(x)).sort();\n' +
  '    const dk = co.filter((x) => !don.has(x) && moi.has(x)).sort();\n' +
  '    const chet = co.filter((x) => !moi.has(x)).sort();\n' +
  '    if (thua.length) ra.push(`  THUA ${thua.join(" ")}`);\n' +
  '    if (dk.length) ra.push(`  CO DIEU KIEN ${dk.join(" ")}`);\n' +
  '    if (chet.length) ra.push(`  KHONG SINH ${chet.join(" ")}`);\n' +
  '  }\n' +
  '  return ra;\n' +
  '}\n';

const Q5_OUTPUT =
  '# Card\n' +
  '  font-size <- text-sm = 0.875rem\n' +
  '  margin-top <- mt-8 = 2rem\n' +
  '  padding-left <- px-8 = 2rem\n' +
  '  padding-right <- px-8 = 2rem\n' +
  '  THUA mt-1 mt-32 mt-4 px-4\n' +
  '# Panel\n' +
  '  margin-top <- !mt-2 = 0.5rem !\n' +
  '  THUA mt-32\n' +
  '  CO DIEU KIEN group-hover:mt-96 md:px-2\n' +
  '  KHONG SINH bg-elevated';

export default {
  course: { slug: 'tailwind-css' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — write it, build it, then read the CSS it produced',
        'Thi thực hành — viết nó, dựng nó, rồi ĐỌC phần CSS nó sinh ra',
      ),
      description: B(
        'Five practical questions, submitted as a .zip. A theme config built on CSS variables whose opacity modifiers survive, an entry stylesheet whose three bands are provable by line number, a button component that keeps the className contract, a dead-class auditor, and a "who wins" reader over a built stylesheet — units 0 and chapters 1 through 10.',
        'Năm câu thực hành, nộp dưới dạng .zip. Một cấu hình theme dựng trên biến CSS mà bổ từ độ mờ vẫn sống, một file CSS đầu vào có ba dải chứng minh được bằng số dòng, một component nút giữ được hợp đồng className, một bộ soát lớp chết, và một bộ đọc "ai thắng" trên bảng kiểu đã dựng — mục 0 và các chương 1 tới 10.',
      ),
      durationMinutes: 120,
      totalPoints: 10,
      passMark: 5,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ── Q1 · mục 0, chương 1, 2, 5, 6 ────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          khongChayDuoc: 'lời giải là một module cấu hình Tailwind cộng một file CSS — nó không in ra gì; muốn kiểm phải cài tailwindcss@3.4.14, chạy CLI rồi đọc CSS phát sinh, đúng các lệnh trong khối kết quả mong đợi',
          prompt: B(
            '<p><b>Q1 — A theme one class name can serve (units 0, and chapters 1, 2, 5 and 6).</b> The <code>Q1/src/index.html</code> given to you uses four semantic colours, two of them with an opacity modifier, one size below the default text scale, and one <code>dark:</code> utility. Write <code>Q1/tailwind.config.js</code> and <code>Q1/theme.css</code> so that every class in that file generates a rule.</p>' +
            '<p>Five things are graded, and each is checkable with one <code>grep</code> against the output:</p>' +
            '<ul>' +
            '<li><b>One class, both themes.</b> The colours must resolve at run time from CSS variables, so <code>bg-surface</code> is correct in light and dark without a paired <code>dark:</code> class beside it.</li>' +
            '<li><b>The opacity modifier must survive.</b> ' + c('text-muted/70') + ' and ' + c('border-brand/30') + ' must appear in the output. Declaring a colour as a bare ' + c('var(--x)') + ' generates the base class and <em>zero</em> rules for its modifiers — silently.</li>' +
            '<li><b>Extend, do not replace.</b> The default scale must survive: after adding <code>text-sm</code> to the markup, ' + c('grep -c "^.text-sm {"') + ' must return 1.</li>' +
            '<li><b>A named step for the gap.</b> The default <code>fontSize</code> scale stops at <code>xs</code> = 12px. Add a <code>2xs</code> of 10px with a line height, so a caption has a name instead of an arbitrary value.</li>' +
            '<li><b>The dark marker must not be <code>dark</code>.</b> Use <code>theme-dark</code>. Naming it <code>dark</code> force-activates every <code>dark:</code> utility in an app and is a real outage in this repository\'s history.</li>' +
            '</ul>',

            '<p><b>Câu 1 — Một theme mà MỘT tên lớp phục vụ được (mục 0, và các chương 1, 2, 5, 6).</b> File <code>Q1/src/index.html</code> cho sẵn dùng bốn màu ngữ nghĩa, hai trong số đó kèm bổ từ độ mờ, một cỡ chữ nằm dưới thang mặc định, và một tiện ích <code>dark:</code>. Hãy viết <code>Q1/tailwind.config.js</code> và <code>Q1/theme.css</code> sao cho MỌI lớp trong file đó đều phát sinh ra một quy tắc.</p>' +
            '<p>Năm thứ bị chấm, và mỗi thứ đều kiểm được bằng đúng một lệnh <code>grep</code> lên đầu ra:</p>' +
            '<ul>' +
            '<li><b>Một lớp, cả hai theme.</b> Các màu phải phân giải LÚC CHẠY từ biến CSS, để <code>bg-surface</code> đúng ở cả theme sáng lẫn tối mà không cần một lớp <code>dark:</code> cặp đôi bên cạnh.</li>' +
            '<li><b>Bổ từ độ mờ phải SỐNG.</b> ' + c('text-muted/70') + ' và ' + c('border-brand/30') + ' phải có mặt trong đầu ra. Khai một màu bằng ' + c('var(--x)') + ' trần thì lớp nền sinh ra còn bổ từ của nó sinh ra SỐ KHÔNG quy tắc — trong im lặng.</li>' +
            '<li><b>Mở rộng, đừng thay thế.</b> Thang mặc định phải sống sót: sau khi thêm <code>text-sm</code> vào mã đánh dấu, ' + c('grep -c "^.text-sm {"') + ' phải trả về 1.</li>' +
            '<li><b>Một bậc CÓ TÊN cho cái lỗ hổng.</b> Thang <code>fontSize</code> mặc định dừng ở <code>xs</code> = 12px. Hãy thêm một bậc <code>2xs</code> 10px kèm chiều cao dòng, để một dòng chú thích có một cái TÊN thay vì một giá trị tuỳ ý.</li>' +
            '<li><b>Lớp đánh dấu theme tối KHÔNG được là <code>dark</code>.</b> Hãy dùng <code>theme-dark</code>. Đặt tên nó là <code>dark</code> sẽ ép kích hoạt mọi tiện ích <code>dark:</code> trong cả ứng dụng, và đó là một sự cố có thật trong lịch sử kho này.</li>' +
            '</ul>',
          ),
          starterCode: Q1_STARTER,
          expectedOutput: Q1_OUTPUT,
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['alpha',
              'Colours declared in channel form with <code>&lt;alpha-value&gt;</code>, so both the base class and its opacity modifiers appear in the built CSS.',
              'Màu được khai theo dạng kênh kèm <code>&lt;alpha-value&gt;</code>, nên cả lớp nền lẫn các bổ từ độ mờ của nó đều có mặt trong CSS đầu ra.',
              0.6],
            ['themes',
              'Two variable blocks — a light default and a dark override on the marker class — so one utility is correct in both, with no paired <code>dark:</code> class.',
              'Hai khối biến — một mặc định sáng và một khối đè theo lớp đánh dấu cho theme tối — để một tiện ích đúng ở cả hai, không cần lớp <code>dark:</code> cặp đôi.',
              0.5],
            ['extend',
              'Everything added under <code>extend</code>, verified by the default scale still generating; <code>content</code> reaches the markup.',
              'Mọi thứ thêm vào đều nằm dưới <code>extend</code>, kiểm chứng bằng việc thang mặc định vẫn phát sinh; <code>content</code> với tới được mã đánh dấu.',
              0.5],
            ['marker',
              'A <code>darkMode</code> selector on <code>theme-dark</code>, not on <code>dark</code>, plus a <code>2xs</code> step with a line height.',
              'Một selector <code>darkMode</code> đặt trên <code>theme-dark</code> chứ không phải <code>dark</code>, cộng một bậc <code>2xs</code> có chiều cao dòng.',
              0.4],
          ]),
        }),

        /* ── Q2 · chương 4, 7, 9 ──────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'css',
          khongChayDuoc: 'lời giải là một file CSS — bộ kiểm chỉ có node và bash; muốn kiểm phải chạy Tailwind CLI rồi đối chiếu SỐ DÒNG trong file đầu ra, đúng các lệnh trong khối kết quả mong đợi',
          prompt: B(
            '<p><b>Q2 — An entry stylesheet whose order you can prove (chapters 4, 7 and 9).</b> Write <code>Q2/globals.css</code>. The markup is given and you cannot change it: a <code>.btn</code> that a caller styles with <code>px-8</code>, and a <code>.rich-text</code> region holding HTML from a CMS that you cannot put utility classes on.</p>' +
            '<p>Four things are graded, and every one of them is settled by a line number in the output, not by opinion:</p>' +
            '<ul>' +
            '<li><b>The three directives, in order.</b> They are literal injection points. Put <code>@tailwind utilities</code> first and Preflight overrides your utilities, with a green build and exit 0.</li>' +
            '<li><b>Restore what Preflight stripped, scoped.</b> ' + c('@tailwind base') + ' injects 555 lines that remove the size of <code>h1</code> and the markers of <code>ul</code>. Put those back for <code>.rich-text</code> only, in the right band.</li>' +
            '<li><b>A <code>.btn</code> the caller can override.</b> Its rule must be emitted <em>before</em> <code>.px-8</code>. Prove it with ' + c('grep -n') + ': the two line numbers are the whole answer.</li>' +
            '<li><b>Accessibility that does not depend on remembering.</b> Any <code>outline-none</code> comes with a focus ring beside it, and the CMS animations — which carry no utility class, so <code>motion-reduce:</code> cannot reach them — need their own reduced-motion block.</li>' +
            '</ul>',

            '<p><b>Câu 2 — Một file CSS đầu vào mà bạn CHỨNG MINH được thứ tự của nó (chương 4, 7 và 9).</b> Hãy viết <code>Q2/globals.css</code>. Mã đánh dấu cho sẵn và bạn không đổi được: một <code>.btn</code> mà người gọi tạo kiểu bằng <code>px-8</code>, và một vùng <code>.rich-text</code> chứa HTML đến từ CMS mà bạn không đặt lớp tiện ích lên được.</p>' +
            '<p>Bốn thứ bị chấm, và mọi thứ đều được dàn xếp bằng một SỐ DÒNG trong đầu ra chứ không bằng ý kiến:</p>' +
            '<ul>' +
            '<li><b>Ba chỉ thị, đúng thứ tự.</b> Chúng là những điểm chèn nguyên văn. Đặt <code>@tailwind utilities</code> lên đầu thì Preflight đè lên tiện ích của bạn, với một bản dựng xanh và mã thoát 0.</li>' +
            '<li><b>Trả lại thứ Preflight đã lột, CÓ PHẠM VI.</b> ' + c('@tailwind base') + ' chèn 555 dòng gỡ cỡ chữ của <code>h1</code> và dấu đầu dòng của <code>ul</code>. Hãy đặt chúng lại CHỈ cho <code>.rich-text</code>, ở đúng dải.</li>' +
            '<li><b>Một <code>.btn</code> mà người gọi đè được.</b> Quy tắc của nó phải được phát sinh TRƯỚC <code>.px-8</code>. Hãy chứng minh bằng ' + c('grep -n') + ': hai con số dòng chính là toàn bộ câu trả lời.</li>' +
            '<li><b>Trợ năng không phụ thuộc vào trí nhớ.</b> Mọi <code>outline-none</code> đều có một vòng focus đi kèm ngay bên cạnh, và các hoạt ảnh của CMS — vốn không mang lớp tiện ích nào nên <code>motion-reduce:</code> không với tới được — cần khối giảm-chuyển-động của riêng chúng.</li>' +
            '</ul>',
          ),
          starterCode: Q2_STARTER,
          expectedOutput: Q2_OUTPUT,
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['bands',
              'The three directives in the correct order, and each hand-written rule in the band that matches its job: element restoration in <code>base</code>, overridable classes in <code>components</code>, custom utilities in <code>utilities</code>.',
              'Ba chỉ thị đúng thứ tự, và mỗi quy tắc viết tay nằm ở đúng cái dải khớp với việc của nó: phục hồi kiểu phần tử vào <code>base</code>, lớp đè được vào <code>components</code>, tiện ích tự chế vào <code>utilities</code>.',
              0.7],
            ['override',
              'The <code>.btn</code> rule is emitted before <code>.px-8</code>, demonstrated with two line numbers rather than asserted.',
              'Quy tắc <code>.btn</code> được phát sinh trước <code>.px-8</code>, được CHỨNG MINH bằng hai số dòng chứ không phải khẳng định suông.',
              0.5],
            ['scoped',
              'Preflight restoration is scoped to <code>.rich-text</code> and does not reset <code>h1</code> or <code>ul</code> globally.',
              'Phần phục hồi Preflight được giới hạn trong <code>.rich-text</code> và không đặt lại <code>h1</code> hay <code>ul</code> trên toàn cục.',
              0.4],
            ['a11y',
              'A focus ring accompanies every removed outline, and a <code>prefers-reduced-motion</code> block covers the animations no utility variant can reach.',
              'Một vòng focus đi kèm mọi cú gỡ outline, và một khối <code>prefers-reduced-motion</code> phủ những hoạt ảnh mà không biến thể tiện ích nào với tới được.',
              0.4],
          ]),
        }),

        /* ── Q3 · chương 3, 4, 9 ──────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'tsx',
          khongChayDuoc: 'lời giải là một component React (JSX + kiểu TypeScript) cần React, clsx và tailwind-merge; bộ kiểm chạy nó bằng node trong một thư mục tạm không có node_modules, nên phải kiểm bằng cách chạy `npx tsx in-lop.ts` trong thư mục câu này',
          prompt: B(
            '<p><b>Q3 — A component that keeps the promise its props make (chapters 3, 4 and 9).</b> Write <code>Q3/Button.tsx</code>, exporting both a <code>Button</code> component and the pure function <code>lopCuaNut</code> that computes its class string, so the given printer can show what each call site resolves to.</p>' +
            '<p>Four things are graded:</p>' +
            '<ul>' +
            '<li><b>The <code>className</code> prop is a contract.</b> Merge it <b>last</b>. Anywhere else and the component\'s own utility wins, silently reversing the meaning of the prop — the printed output must show <code>px-8</code> replacing <code>px-4</code>, not sitting beside it.</li>' +
            '<li><b>Variants as data, not an if-chain.</b> Three visual variants and three sizes are a matrix; write it as two lookup objects with defaults, and let the type come from the objects rather than a hand-written union that can drift.</li>' +
            '<li><b>No class name may be assembled by interpolation.</b> Every entry in those objects is a complete string. ' + c('`bg-${variant}-600`') + ' generates nothing and fails without an error.</li>' +
            '<li><b>Accessible by construction.</b> The base classes carry a <code>focus-visible</code> ring and a disabled state, and <code>type</code> defaults to <code>"button"</code> so an instance inside a form does not submit it.</li>' +
            '</ul>' +
            '<p>Read the last line of the expected output before you write anything: overriding the background colour leaves the <em>hover</em> background untouched, because a variant is part of the merge key. That is the behaviour, not a bug — and it is what you have to know before promising a caller they can override.</p>',

            '<p><b>Câu 3 — Một component GIỮ ĐƯỢC lời hứa mà prop của nó đưa ra (chương 3, 4 và 9).</b> Hãy viết <code>Q3/Button.tsx</code>, xuất ra cả component <code>Button</code> lẫn hàm thuần <code>lopCuaNut</code> tính chuỗi lớp của nó, để đoạn in cho sẵn hiện ra được từng chỗ gọi phân giải thành gì.</p>' +
            '<p>Bốn thứ bị chấm:</p>' +
            '<ul>' +
            '<li><b>Prop <code>className</code> là một HỢP ĐỒNG.</b> Hãy hợp nhất nó SAU CÙNG. Đặt ở bất kỳ chỗ nào khác thì tiện ích của chính component thắng, âm thầm đảo ngược ý nghĩa của cái prop — kết quả in ra phải cho thấy <code>px-8</code> THAY THẾ <code>px-4</code> chứ không phải nằm cạnh nó.</li>' +
            '<li><b>Biến thể là DỮ LIỆU, không phải một chuỗi if.</b> Ba biến thể thị giác và ba kích cỡ là một ma trận; hãy viết nó thành hai object tra cứu kèm giá trị mặc định, và để KIỂU suy ra từ chính object thay vì một union gõ tay có thể trôi lệch.</li>' +
            '<li><b>Không tên lớp nào được ghép bằng nội suy.</b> Mọi mục trong hai object ấy đều là một chuỗi HOÀN CHỈNH. ' + c('`bg-${variant}-600`') + ' không sinh ra gì và hỏng mà không báo lỗi.</li>' +
            '<li><b>Tiếp cận được ngay từ cấu trúc.</b> Nhóm lớp nền mang sẵn một vòng <code>focus-visible</code> và một trạng thái vô hiệu, còn <code>type</code> mặc định là <code>"button"</code> để một thể hiện nằm trong form không submit form đó.</li>' +
            '</ul>' +
            '<p>Hãy đọc dòng cuối của khối kết quả mong đợi trước khi viết bất cứ thứ gì: ghi đè màu nền KHÔNG đụng tới màu nền lúc rê chuột, vì một biến thể là một phần của khoá hợp nhất. Đó là HÀNH VI chứ không phải một con bọ — và đó là thứ bạn phải biết trước khi hứa với người gọi rằng họ ghi đè được.</p>',
          ),
          starterCode: Q3_STARTER,
          expectedOutput: Q3_OUTPUT,
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['contract',
              'The <code>className</code> prop is the last argument to the merge, and the printed output shows the caller\'s utility replacing the component\'s rather than joining it.',
              'Prop <code>className</code> là đối số CUỐI của phép hợp nhất, và kết quả in ra cho thấy tiện ích của người gọi THAY THẾ tiện ích của component chứ không nối thêm vào.',
              0.7],
            ['static',
              'Every class name is a complete literal string; no template interpolation and no concatenation builds a utility name.',
              'Mọi tên lớp đều là một chuỗi nguyên văn hoàn chỉnh; không nội suy template và không phép nối chuỗi nào dựng ra một tên tiện ích.',
              0.5],
            ['matrix',
              'Variants and sizes are declarative lookup tables with defaults, and the prop types are derived from them rather than duplicated by hand.',
              'Biến thể và kích cỡ là các bảng tra cứu khai báo có giá trị mặc định, và kiểu của prop được SUY RA từ chúng chứ không chép tay lại.',
              0.4],
            ['a11y',
              'A <code>focus-visible</code> ring and a disabled state in the base classes, and <code>type</code> defaulting to <code>"button"</code>.',
              'Một vòng <code>focus-visible</code> và một trạng thái vô hiệu nằm trong nhóm lớp nền, và <code>type</code> mặc định là <code>"button"</code>.',
              0.4],
          ]),
        }),

        /* ── Q4 · mục 0, chương 6, 9, 10 ──────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q4 — The dead-class auditor (unit 0, and chapters 6, 9 and 10).</b> A class that generates no rule leaves no trace anywhere a developer normally looks: the build is green, the console is silent, and DevTools shows nothing struck through — because a struck-through line means a declaration <em>lost</em>, and here no declaration exists. The only way to know how many you have is to go looking. Write <code>soat(css, the)</code>.</p>' +
            '<p>It receives the built stylesheet as text and a list of class attributes taken from components, and returns an array of lines:</p>' +
            '<ul>' +
            '<li>One line per class name that appears in the markup and has <b>no rule</b> in the CSS, formatted ' + c('<CAUSE> <class> (<file>)') + ', sorted as strings.</li>' +
            '<li>Then ' + c('TONG <n> lop chet') + ', then a per-cause count line.</li>' +
            '</ul>' +
            '<p>Three causes, because each needs a different fix. <b>ALPHA</b> — the base class before the <code>/</code> <em>is</em> generated but the modified one is not: the signature of a colour declared as a bare ' + c('var(--x)') + ', fixed in the config. <b>CU-PHAP-V4</b> — the name ends in <code>!</code>, which is Tailwind 4\'s important syntax and generates nothing on 3.4; the v3 form is the prefix ' + c('!mt-4') + '. <b>KHONG-CO</b> — everything else: a renamed token, one that never existed, or a typo.</p>' +
            '<p>Note that the built CSS escapes special characters in class names — <code>mt-0.5</code> is written ' + c('.mt-0\\.5') + ' and <code>bg-red-500/50</code> is written ' + c('.bg-red-500\\/50') + ' — so a name has to be unescaped before it can be compared with what the markup says. Rules inside an at-rule count as generated.</p>',

            '<p><b>Câu 4 — Bộ soát lớp chết (mục 0, và các chương 6, 9, 10).</b> Một lớp không sinh ra quy tắc nào thì không để lại dấu vết ở bất cứ chỗ nào một lập trình viên thường nhìn: bản dựng xanh, console im lặng, và DevTools không hiện dòng nào bị gạch — vì một dòng bị gạch nghĩa là một khai báo đã THUA, mà ở đây làm gì có khai báo nào. Cách duy nhất để biết bạn có bao nhiêu cái là chủ động đi tìm. Hãy viết <code>soat(css, the)</code>.</p>' +
            '<p>Nó nhận bảng kiểu đã dựng dưới dạng văn bản và một danh sách thuộc tính class rút từ component, rồi trả về một mảng các dòng:</p>' +
            '<ul>' +
            '<li>Mỗi tên lớp có mặt trong mã đánh dấu mà KHÔNG có quy tắc nào trong CSS thì một dòng, theo khuôn ' + c('<NGUYEN-NHAN> <lop> (<file>)') + ', sắp theo chuỗi.</li>' +
            '<li>Rồi tới ' + c('TONG <n> lop chet') + ', rồi một dòng đếm theo từng nguyên nhân.</li>' +
            '</ul>' +
            '<p>Ba nguyên nhân, vì mỗi cái cần một cú vá khác nhau. <b>ALPHA</b> — lớp nền đứng trước dấu <code>/</code> CÓ được phát sinh còn lớp có bổ từ thì không: chữ ký của một màu khai bằng ' + c('var(--x)') + ' trần, vá trong config. <b>CU-PHAP-V4</b> — tên kết thúc bằng <code>!</code>, đó là cú pháp quan trọng của Tailwind 4 và nó sinh ra SỐ KHÔNG trên bản 3.4; dạng của v3 là tiền tố ' + c('!mt-4') + '. <b>KHONG-CO</b> — mọi thứ còn lại: một token bị đổi tên, một token chưa từng tồn tại, hoặc một lỗi gõ nhầm.</p>' +
            '<p>Chú ý rằng CSS đã dựng THOÁT các ký tự đặc biệt trong tên lớp — <code>mt-0.5</code> được ghi là ' + c('.mt-0\\.5') + ' và <code>bg-red-500/50</code> được ghi là ' + c('.bg-red-500\\/50') + ' — nên một cái tên phải được gỡ thoát trước khi đem so với thứ mã đánh dấu nói. Quy tắc nằm trong một at-rule vẫn tính là đã được phát sinh.</p>',
          ),
          starterCode: Q4_STARTER,
          expectedOutput: Q4_OUTPUT,
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['output',
              'The printed lines match the expected output exactly, including the sort order and both summary lines.',
              'Các dòng in ra khớp CHÍNH XÁC khối kết quả mong đợi, kể cả thứ tự sắp xếp và cả hai dòng tổng kết.',
              0.8],
            ['parse',
              'Selectors are collected from the whole stylesheet, at-rule bodies included, and class names are unescaped before comparison.',
              'Selector được thu thập từ toàn bộ bảng kiểu, kể cả phần thân của at-rule, và tên lớp được gỡ dấu thoát trước khi đem so.',
              0.6],
            ['causes',
              'The three causes are distinguished by evidence — an ALPHA finding requires the base class to be present — not by guessing from the name alone.',
              'Ba nguyên nhân được phân biệt bằng BẰNG CHỨNG — một phát hiện ALPHA đòi hỏi lớp nền phải CÓ MẶT — chứ không phải đoán mò từ mỗi cái tên.',
              0.6],
          ]),
        }),

        /* ── Q5 · chương 2, 3, 7, 10 ──────────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q5 — The "who wins" reader (chapters 2, 3, 7 and 10).</b> When two utilities set the same property, the winner is decided by position in the output file — a line number that no DevTools panel displays. Write <code>aiThang(css, the)</code>, which reads a built stylesheet and answers the question mechanically for each element.</p>' +
            '<p>For every element, print a header ' + c('# <name>') + ' and then:</p>' +
            '<ul>' +
            '<li>One line per CSS property that is actually set, ' + c('  <prop> <- <class> = <value>') + ', sorted by property name, with a trailing <code> !</code> when the winning declaration is important.</li>' +
            '<li>Then up to three buckets, each omitted when empty: ' + c('THUA') + ' for classes that had a rule and lost, ' + c('CO DIEU KIEN') + ' for classes whose only rules are conditional, and ' + c('KHONG SINH') + ' for classes with no rule at all. Names inside a bucket are sorted and space-separated.</li>' +
            '</ul>' +
            '<p>Only rules whose selector is exactly one class and which sit at the top level of the file compete on source order — they all have specificity 0-1-0 and they all apply unconditionally, which is what makes comparing them by position valid. A rule inside an at-rule (<code>md:px-2</code>) applies only under its condition, and a descendant selector (<code>.group:hover .group-hover\\:mt-96</code>) is 0-2-0 and wins on weight instead; both belong in <code>CO DIEU KIEN</code> rather than in the comparison. Importance beats position; between two important declarations, position decides again.</p>' +
            '<p>The written order of the class attribute must not appear anywhere in your logic. The browser never sees it.</p>',

            '<p><b>Câu 5 — Bộ đọc "ai thắng" (chương 2, 3, 7 và 10).</b> Khi hai tiện ích cùng đặt một thuộc tính thì kẻ thắng được quyết bởi VỊ TRÍ trong file đầu ra — một số dòng mà không bảng điều khiển DevTools nào hiển thị. Hãy viết <code>aiThang(css, the)</code>, thứ đọc một bảng kiểu đã dựng và trả lời câu hỏi ấy một cách máy móc cho từng phần tử.</p>' +
            '<p>Với mỗi phần tử, in một dòng tiêu đề ' + c('# <ten>') + ' rồi tới:</p>' +
            '<ul>' +
            '<li>Mỗi thuộc tính CSS thật sự được đặt thì một dòng, ' + c('  <prop> <- <lop> = <gia tri>') + ', sắp theo tên thuộc tính, kèm một dấu <code> !</code> ở cuối khi khai báo thắng là khai báo quan trọng.</li>' +
            '<li>Rồi tới tối đa ba cái rổ, cái nào rỗng thì bỏ: ' + c('THUA') + ' cho những lớp CÓ quy tắc mà thua, ' + c('CO DIEU KIEN') + ' cho những lớp mà mọi quy tắc của nó đều có điều kiện, và ' + c('KHONG SINH') + ' cho những lớp không có quy tắc nào. Tên trong một rổ được sắp và ngăn nhau bằng dấu cách.</li>' +
            '</ul>' +
            '<p>Chỉ những quy tắc có selector là ĐÚNG MỘT lớp và nằm ở cấp trên cùng của file mới cạnh tranh nhau bằng thứ tự nguồn — chúng đều có độ đặc hiệu 0-1-0 và đều áp VÔ ĐIỀU KIỆN, và chính điều đó làm phép so theo vị trí trở nên hợp lệ. Một quy tắc nằm trong at-rule (<code>md:px-2</code>) chỉ áp dưới điều kiện của nó, còn một selector con cháu (<code>.group:hover .group-hover\\:mt-96</code>) là 0-2-0 và thắng bằng TRỌNG LƯỢNG; cả hai thuộc về <code>CO DIEU KIEN</code> chứ không thuộc về cuộc so sánh. Tính quan trọng thắng vị trí; giữa hai khai báo cùng quan trọng thì vị trí lại quyết định.</p>' +
            '<p>Thứ tự VIẾT của thuộc tính class không được xuất hiện ở bất cứ đâu trong logic của bạn. Trình duyệt không bao giờ nhìn thấy nó.</p>',
          ),
          starterCode: Q5_STARTER,
          expectedOutput: Q5_OUTPUT,
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['output',
              'The printed lines match the expected output exactly, including the sorted property lines, the important marker and the three buckets.',
              'Các dòng in ra khớp CHÍNH XÁC khối kết quả mong đợi, kể cả các dòng thuộc tính đã sắp, dấu đánh dấu quan trọng và cả ba cái rổ.',
              0.8],
            ['cascade',
              'The cascade is applied in the right order — importance first, then source position — and the written order of the class attribute is used nowhere.',
              'Cascade được áp đúng thứ tự — tính quan trọng trước, rồi tới vị trí nguồn — và thứ tự viết của thuộc tính class không được dùng ở đâu cả.',
              0.6],
            ['scope',
              'Conditional rules and higher-specificity selectors are excluded from the position comparison and reported separately, instead of being silently treated as plain utilities.',
              'Quy tắc có điều kiện và selector độ đặc hiệu cao hơn bị loại khỏi phép so vị trí và được báo cáo riêng, thay vì âm thầm bị coi như tiện ích thường.',
              0.6],
          ]),
        }),
      ],
    },
  ],
};
