/**
 * TypeScript · Chương 15 · Quiz Chương 15 (10 câu tình huống về hiệu năng build). Slug giữ: typescript-15-5-quiz (→ 10 câu, 04/11/2026).
 * Dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2) trong demo15, tái lập được.
 */
export default {
  title: 'Chapter 15 check — 10 scenario questions|||Kiểm tra Chương 15 — 10 câu tình huống',
  slug: 'typescript-15-5-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười câu tình huống về Chương 15: hiệu năng build — skipLibCheck, incremental & project references, tách kiểm kiểu khỏi transpile (export type), và cắt gọn đồ thị module (import type). Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
<div class="ml-en"><span class="eyebrow">Chapter 15 · Check</span><h2>Chapter 15 check</h2>
<p class="lead">Ten scenarios on build performance — skipLibCheck, incremental builds, project references, and the import/export-type discipline. Every message comes from a real, reproducible run (Node 22.23.3, tsc 7.0.2).</p></div>
<div class="ml-vi"><span class="eyebrow">Chương 15 · Kiểm tra</span><h2>Kiểm tra Chương 15</h2>
<p class="lead">Mười tình huống về hiệu năng build — skipLibCheck, incremental build, project references, và kỷ luật import/export type. Mọi thông báo từ lần chạy thật, tái lập được (Node 22.23.3, tsc 7.0.2).</p></div>
`,
  quiz: {
    timeLimitSeconds: 900,
    passingScore: 70,
    questions: [
      {
        question: 'What does skipLibCheck do?|||skipLibCheck làm gì?',
        options: [
          'Skips checking your source files.|||Bỏ kiểm các tệp source của bạn.',
          'Skips type-checking the .d.ts declaration files (your dependencies) — the biggest easy build-time win.|||Bỏ kiểm kiểu các tệp khai báo .d.ts (dependency của bạn) — cú thắng dễ lớn nhất về thời gian build.',
          'Disables all type checking.|||Tắt mọi kiểm kiểu.',
          'Makes tsc emit faster JavaScript.|||Làm tsc phát JavaScript nhanh hơn.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo15/ts-15-1): with skipLibCheck off, a broken dependency .d.ts is TS2304; with it on (the course config), tsc trusts the declarations and checks only your code.|||VI: Đo thật (demo15/ts-15-1): với skipLibCheck tắt, một .d.ts dependency hỏng là TS2304; bật (config khoá), tsc tin các khai báo và chỉ kiểm code của bạn.',
      },
      {
        question: 'With skipLibCheck off, a dependency’s .d.ts references a missing type. What happens?|||Với skipLibCheck tắt, một .d.ts của dependency tham chiếu một kiểu thiếu. Chuyện gì xảy ra?',
        options: [
          'Nothing — .d.ts files are never checked.|||Không gì — tệp .d.ts không bao giờ bị kiểm.',
          'TS2304 in the .d.ts — a broken declaration you cannot change fails your build.|||TS2304 trong .d.ts — một khai báo hỏng bạn không đổi được làm hỏng build của bạn.',
          'A warning only.|||Chỉ một cảnh báo.',
          'It is auto-fixed.|||Nó tự sửa.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo15/ts-15-1/nolib): TS2304. Without skipLibCheck, a bad .d.ts anywhere in node_modules fails the build — which is why skipLibCheck is on by default in most configs.|||VI: Đo thật (demo15/ts-15-1/nolib): TS2304. Không có skipLibCheck, một .d.ts xấu bất kỳ trong node_modules làm hỏng build — đó là vì sao skipLibCheck bật mặc định ở đa số config.',
      },
      {
        question: 'What does a second `tsc -b` with no changes report?|||Một lần `tsc -b` thứ hai không đổi báo gì?',
        options: [
          'It rebuilds everything from scratch.|||Nó build lại mọi thứ từ đầu.',
          'Every project is “up to date” — the .tsbuildinfo shows no file is newer than the last build.|||Mọi dự án “up to date” — .tsbuildinfo cho thấy không tệp nào mới hơn build lần trước.',
          'An error.|||Một lỗi.',
          'Nothing at all — no output ever.|||Hoàn toàn không gì — không bao giờ có output.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo15/ts-15-2): the first build builds core then app; the second reports both “up to date”. The .tsbuildinfo cache makes a no-change build near-instant.|||VI: Đo thật (demo15/ts-15-2): build đầu build core rồi app; build thứ hai báo cả hai “up to date”. Cache .tsbuildinfo làm một build không-đổi gần như tức thời.',
      },
      {
        question: 'What does a project reference need to be skipped when unchanged?|||Một project reference cần gì để được bỏ qua khi không đổi?',
        options: [
          '"strict": true.|||"strict": true.',
          '"composite": true, so it emits declaration files a consumer checks against.|||"composite": true, để nó phát các tệp khai báo mà bên tiêu thụ kiểm theo.',
          'Nothing special.|||Không cần gì đặc biệt.',
          '"noEmit": true.|||"noEmit": true.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo15/ts-15-2): references require composite: true; each project emits its declarations, so a consumer type-checks against the built types and tsc can skip an unchanged project entirely.|||VI: Đo thật (demo15/ts-15-2): references cần composite: true; mỗi dự án phát khai báo, nên bên tiêu thụ kiểm với kiểu đã build và tsc bỏ qua hẳn một dự án không đổi.',
      },
      {
        question: 'Why split a build into tsc --noEmit (check) and a separate transpiler (emit)?|||Vì sao tách một build thành tsc --noEmit (kiểm) và một transpiler riêng (phát)?',
        options: [
          'They do the same thing twice.|||Chúng làm cùng việc hai lần.',
          'Checking is slow and needs the whole program; transpiling is fast and per-file — splitting them lets the fast path run without waiting for the checker.|||Kiểm chậm và cần cả chương trình; transpile nhanh và từng-tệp — tách chúng cho đường nhanh chạy mà không chờ bộ kiểm.',
          'tsc cannot emit JavaScript.|||tsc không phát được JavaScript.',
          'To avoid type errors.|||Để tránh lỗi kiểu.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: checking (whole-program) and transpiling (per-file) are different jobs; a fast transpiler (esbuild/swc/Node) emits while tsc --noEmit checks in parallel, so the dev loop does not wait.|||VI: kiểm (toàn chương trình) và transpile (từng-tệp) là hai việc khác; một transpiler nhanh (esbuild/swc/Node) phát trong khi tsc --noEmit kiểm song song, nên vòng dev không chờ.',
      },
      {
        question: 'A module does `export { Booking }` where Booking is a type. What does tsc say (verbatimModuleSyntax)?|||Một module làm `export { Booking }` nơi Booking là một kiểu. tsc nói gì (verbatimModuleSyntax)?',
        options: [
          'Nothing.|||Không gì.',
          'TS1205: re-exporting a type requires `export type` — a per-file transpiler cannot tell whether to emit or erase it.|||TS1205: re-export một kiểu cần `export type` — một transpiler từng-tệp không biết nên phát hay xoá.',
          'TS2304.|||TS2304.',
          'A runtime error.|||Một lỗi lúc chạy.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo15/ts-15-3): TS1205. verbatimModuleSyntax enforces transpile-readiness — write `export type { Booking }` so the intent is on the line and a per-file transpiler can erase it.|||VI: Đo thật (demo15/ts-15-3): TS1205. verbatimModuleSyntax ép sự-sẵn-sàng-transpile — viết `export type { Booking }` để ý định nằm trên dòng và một transpiler từng-tệp xoá được nó.',
      },
      {
        question: 'A file does `import { Booking }` where Booking is only a type. What does tsc say?|||Một tệp làm `import { Booking }` nơi Booking chỉ là một kiểu. tsc nói gì?',
        options: [
          'Nothing — imports are untyped.|||Không gì — import không có kiểu.',
          'TS1205.|||TS1205.',
          'TS1484: a type must be imported with `import type` under verbatimModuleSyntax.|||TS1484: một kiểu phải được import bằng `import type` dưới verbatimModuleSyntax.',
          'A runtime error only.|||Chỉ một lỗi lúc chạy.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo15/ts-15-4): TS1484. A plain import of a type would survive as a runtime edge to a module that may have nothing to export after erasure; `import type` is erased.|||VI: Đo thật (demo15/ts-15-4): TS1484. Một import thường của một kiểu sẽ sống như một cạnh lúc chạy tới một module có thể không còn gì export sau khi xoá; `import type` bị xoá.',
      },
      {
        question: 'What happens to an `import type` in the emitted JavaScript?|||Một `import type` trong JavaScript phát ra thì sao?',
        options: [
          'It stays as a normal import.|||Nó ở lại như một import thường.',
          'It is erased — no module is loaded for a compile-time-only type, so it leaves no edge in the graph.|||Nó bị xoá — không module nào nạp cho một kiểu chỉ-lúc-biên-dịch, nên nó không để lại cạnh trong đồ thị.',
          'It becomes a runtime error.|||Nó thành một lỗi lúc chạy.',
          'It is duplicated.|||Nó bị nhân đôi.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo15/ts-15-4/ok): the import type disappears from the output and the module runs. A trimmed graph bundles faster, ships smaller, and makes circular type deps harmless.|||VI: Đo thật (demo15/ts-15-4/ok): import type biến mất khỏi output và module chạy. Một đồ thị cắt gọn bundle nhanh hơn, ship nhỏ hơn, và làm phụ thuộc kiểu vòng vô hại.',
      },
      {
        question: 'Why can Node’s type-stripping run a file but not a standard decorator?|||Vì sao type-stripping của Node chạy được một tệp nhưng không chạy một decorator chuẩn?',
        options: [
          'Type-stripping only removes type syntax; a decorator is real run-time behaviour that must be compiled, not stripped.|||Type-stripping chỉ bỏ cú pháp kiểu; một decorator là hành vi thật lúc chạy phải được biên dịch, không phải bị bỏ.',
          'Decorators are types.|||Decorator là kiểu.',
          'Node runs decorators fine.|||Node chạy decorator tốt.',
          'There is no difference.|||Không có khác biệt.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Type-stripping (Node, and the per-file transpile of this chapter) erases type syntax only; a decorator (Chapter 14) adds run-time wrapping, so it needs a real compile step — the same reason transpile-readiness is about types, not behaviour.|||VI: Type-stripping (Node, và transpile từng-tệp của chương này) chỉ xoá cú pháp kiểu; một decorator (Chương 14) thêm bọc lúc chạy, nên cần một bước biên dịch thật — cùng lý do sự-sẵn-sàng-transpile là về kiểu, không về hành vi.',
      },
      {
        question: 'Which habit trims the module graph the most?|||Thói quen nào cắt gọn đồ thị module nhiều nhất?',
        options: [
          'Using any for all imports.|||Dùng any cho mọi import.',
          'import type for shapes and plain import for values — type edges are erased, only runtime values stay.|||import type cho dáng và import thường cho giá trị — các cạnh kiểu bị xoá, chỉ giá trị lúc chạy ở lại.',
          'Importing everything in one file.|||Import mọi thứ trong một tệp.',
          'Disabling verbatimModuleSyntax.|||Tắt verbatimModuleSyntax.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: import type keeps a compile-time-only type out of the runtime graph; combined with export type, every file is transpile-ready and the bundle carries only the values it runs.|||VI: import type giữ một kiểu chỉ-lúc-biên-dịch ngoài đồ thị lúc chạy; kết hợp với export type, mỗi tệp sẵn-sàng-transpile và bundle chỉ mang các giá trị nó chạy.',
      },
    ],
  },
};
