/**
 * TypeScript · Chương 10 · Quiz Chương 10 (10 câu tình huống về module & .d.ts). Slug giữ: typescript-10-5-quiz (→ 10 câu, 04/11/2026).
 * Dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2) trong demo10. Đáp án rải: A ×3 (1,5,9) · B ×3 (2,6,10) · C ×2 (3,7) · D ×2 (4,8).
 */
export default {
  title: 'Chapter 10 check — 10 scenario questions|||Kiểm tra Chương 10 — 10 câu tình huống',
  slug: 'typescript-10-5-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười câu tình huống về Chương 10: ES module & import type, tệp khai báo (.d.ts), bổ sung (declare global / module augmentation), và lấy kiểu từ package. Đo thật tsc 7.0.2 + Node 22.23.3, có giải thích từng câu.',
  content: `
<div class="ml-en"><span class="eyebrow">Chapter 10 · Check</span><h2>Chapter 10 check</h2>
<p class="lead">Ten scenarios on modules and declaration files — import type, .d.ts, augmentation, and getting types from packages. Every message comes from a real run (Node 22.23.3, tsc 7.0.2).</p></div>
<div class="ml-vi"><span class="eyebrow">Chương 10 · Kiểm tra</span><h2>Kiểm tra Chương 10</h2>
<p class="lead">Mười tình huống về module và tệp khai báo — import type, .d.ts, bổ sung, và lấy kiểu từ package. Mọi thông báo từ lần chạy thật (Node 22.23.3, tsc 7.0.2).</p></div>
`,
  quiz: {
    timeLimitSeconds: 900,
    passingScore: 70,
    questions: [
      {
        question: 'Money is a type. Under verbatimModuleSyntax, you write import { Money } from \'./money.ts\'. What does tsc say?|||Money là một kiểu. Dưới verbatimModuleSyntax, bạn viết import { Money } from \'./money.ts\'. tsc nói gì?',
        options: [
          'TS1484: Money is a type and must be imported with a type-only import — use import type.|||TS1484: Money là một kiểu và phải import bằng type-only import — dùng import type.',
          'Nothing — a type can be imported like a value.|||Không gì — một kiểu import như một giá trị được.',
          'TS7016.|||TS7016.',
          'TS2307.|||TS2307.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo10/ts-10-1/importtypebad): TS1484. verbatimModuleSyntax requires a type to be imported with import type, so the whole import is erased and the compiler never emits an import that does not exist at run time.|||VI: Đo thật (demo10/ts-10-1/importtypebad): TS1484. verbatimModuleSyntax đòi một kiểu import bằng import type, nên cả import bị xoá và trình biên dịch không sinh một import không tồn tại lúc chạy.',
      },
      {
        question: 'A .ts file imports a type and a value, then runs under Node. What happens to the type at run time?|||Một tệp .ts import một kiểu và một giá trị, rồi chạy dưới Node. Chuyện gì xảy ra với kiểu lúc chạy?',
        options: [
          'It is checked at run time.|||Nó được kiểm lúc chạy.',
          'It is erased — only values exist at run time; the type crossed the boundary for the compiler only.|||Nó bị xoá — chỉ giá trị tồn tại lúc chạy; kiểu qua biên giới chỉ cho trình biên dịch.',
          'It becomes a runtime object.|||Nó thành một object lúc chạy.',
          'It blocks the import.|||Nó chặn import.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo10/ts-10-1/exports): the program prints its value with the type gone. Values and types share the import syntax, but only values exist at run time — the type is erased, which is why import type can drop the whole import.|||VI: Đo thật (demo10/ts-10-1/exports): chương trình in giá trị còn kiểu đã mất. Giá trị và kiểu dùng chung cú pháp import, nhưng chỉ giá trị tồn tại lúc chạy — kiểu bị xoá, vì thế import type bỏ được cả import.',
      },
      {
        question: 'You import a slug.js helper that has no declaration file, under strict. What does tsc say?|||Bạn import một helper slug.js không có tệp khai báo, dưới strict. tsc nói gì?',
        options: [
          'Nothing — tsc infers the types from the .js.|||Không gì — tsc suy kiểu từ .js.',
          'TS1484.|||TS1484.',
          'TS7016: could not find a declaration file for the module — it would otherwise be any.|||TS7016: không tìm thấy tệp khai báo cho module — nó lẽ ra là any.',
          'TS2345.|||TS2345.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo10/ts-10-2/nodts): TS7016. An untyped import has no declaration, so under strict it is refused rather than silently any — a single untyped import would otherwise turn off every check downstream.|||VI: Đo thật (demo10/ts-10-2/nodts): TS7016. Một import không kiểu không có khai báo, nên dưới strict nó bị từ chối thay vì âm thầm any — một import không kiểu lẽ ra tắt mọi phép kiểm phía sau.',
      },
      {
        question: 'You add a slug.d.ts next to slug.js declaring slugify(text: string): string. What happens?|||Bạn thêm một slug.d.ts cạnh slug.js khai slugify(text: string): string. Chuyện gì xảy ra?',
        options: [
          'tsc ignores the sidecar file.|||tsc bỏ qua tệp sidecar.',
          'You must rewrite slug.js in TypeScript.|||Bạn phải viết lại slug.js bằng TypeScript.',
          'A runtime error.|||Một lỗi lúc chạy.',
          'The import is now fully typed — tsc reads the .d.ts, Node runs the .js unchanged.|||Import giờ có kiểu đầy đủ — tsc đọc .d.ts, Node chạy .js nguyên.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo10/ts-10-2/sidecar): the import is typed and the program runs (printed the slug). The .d.ts describes the shape for the compiler; the .js provides the behaviour for Node — types on one side, running code on the other.|||VI: Đo thật (demo10/ts-10-2/sidecar): import có kiểu và chương trình chạy (in slug). .d.ts tả dáng cho trình biên dịch; .js cung cấp hành vi cho Node — kiểu một bên, code chạy một bên.',
      },
      {
        question: 'You import { parseId } from \'labflow-legacy\', a bare-name package with no types and no declaration. What does tsc say?|||Bạn import { parseId } from \'labflow-legacy\', một package tên trần không có kiểu và không có khai báo. tsc nói gì?',
        options: [
          'TS2307: cannot find module \'labflow-legacy\' — a declare module block gives it types by its import name.|||TS2307: không tìm thấy module \'labflow-legacy\' — một khối declare module cho nó kiểu theo tên import.',
          'Nothing — bare imports are always any.|||Không gì — import trần luôn là any.',
          'TS1484.|||TS1484.',
          'TS2339.|||TS2339.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo10/ts-10-2/declaremodule): with a declare module \'labflow-legacy\' { … } block it resolves and type-checks (0 errors); without it, the bare import is TS2307. The ambient declaration lives in a .d.ts anywhere in the project.|||VI: Đo thật (demo10/ts-10-2/declaremodule): với một khối declare module \'labflow-legacy\' { … } nó phân giải và kiểu-kiểm (0 lỗi); không có nó, import trần là TS2307. Khai báo ambient nằm trong một .d.ts ở bất kỳ đâu trong dự án.',
      },
      {
        question: 'A module declares interface Lab { code: string } and later interface Lab { seats: number }. What is Lab?|||Một module khai interface Lab { code: string } rồi sau interface Lab { seats: number }. Lab là gì?',
        options: [
          'Two separate types with the same name.|||Hai kiểu riêng cùng tên.',
          'A single Lab with both code and seats — same-named interfaces merge into one (declaration merging).|||Một Lab duy nhất có cả code và seats — interface cùng tên gộp thành một (gộp khai báo).',
          'Only the last one wins.|||Chỉ cái cuối thắng.',
          'TS2300 duplicate identifier.|||TS2300 định danh trùng.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo10/ts-10-3/merge): a Lab literal must have both code and seats, and the program printed both. Two same-named interfaces merge into one with all the fields — the mechanism under every augmentation.|||VI: Đo thật (demo10/ts-10-3/merge): một literal Lab phải có cả code và seats, và chương trình in cả hai. Hai interface cùng tên gộp thành một với tất cả các trường — cơ chế dưới mọi bổ sung.',
      },
      {
        question: 'Without any augmentation, you write const port: string = process.env.LABFLOW_PORT. What does tsc say?|||Không bổ sung gì, bạn viết const port: string = process.env.LABFLOW_PORT. tsc nói gì?',
        options: [
          'Nothing — env vars are always strings.|||Không gì — env var luôn là string.',
          'TS7016.|||TS7016.',
          'TS2322: string | undefined is not assignable to string — a declare global augmenting NodeJS.ProcessEnv makes it string.|||TS2322: string | undefined không gán được cho string — một declare global bổ sung NodeJS.ProcessEnv làm nó string.',
          'A runtime error.|||Một lỗi lúc chạy.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo10/ts-10-3): without the augmentation it is TS2322 (process.env.X is string | undefined); declaring LABFLOW_PORT: string on NodeJS.ProcessEnv via declare global makes the read a plain string. Augmentation records a guarantee the types cannot infer.|||VI: Đo thật (demo10/ts-10-3): không bổ sung là TS2322 (process.env.X là string | undefined); khai LABFLOW_PORT: string trên NodeJS.ProcessEnv qua declare global làm lần đọc thành string thuần. Bổ sung ghi một bảo đảm kiểu không suy được.',
      },
      {
        question: 'Which is a rule for a working module augmentation (the Request.user pattern)?|||Đâu là một luật cho một bổ sung module chạy được (mẫu Request.user)?',
        options: [
          'It must change the library’s source.|||Phải sửa mã nguồn thư viện.',
          'It must run code at startup.|||Phải chạy code lúc khởi động.',
          'It can rename the interface.|||Nó đổi tên được interface.',
          'Match the name and kind, be in a module, and keep it type-only — it adds declarations, never runtime code.|||Khớp tên và loại, nằm trong một module, và giữ chỉ-kiểu — nó thêm khai báo, không bao giờ code lúc chạy.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Augmentation works by declaration merging: a second interface of the same name joins the first. It must be in a module (so declare global reaches the global scope) and be type-only. That is why Request.user is one small file, not a fork of the library.|||VI: Bổ sung chạy bằng gộp khai báo: một interface thứ hai cùng tên nối vào cái đầu. Nó phải nằm trong một module (để declare global với tới phạm vi toàn cục) và chỉ-kiểu. Vì thế Request.user là một tệp nhỏ, không phải một fork của thư viện.',
      },
      {
        question: 'node:path’s join is typed via @types/node. You call join(\'a\', 42). What does tsc say?|||join của node:path có kiểu qua @types/node. Bạn gọi join(\'a\', 42). tsc nói gì?',
        options: [
          'TS2345: a number is not assignable to the string parameter — the package’s bundled types are real checks.|||TS2345: một number không gán được cho tham số string — kiểu đóng gói sẵn của package là phép kiểm thật.',
          'Nothing — join accepts anything.|||Không gì — join nhận gì cũng được.',
          'TS7016.|||TS7016.',
          'A runtime error only.|||Chỉ một lỗi lúc chạy.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo10/ts-10-4/bundledbad): TS2345. The types that ship with a package are the same checks as code you wrote yourself — a wrong call into a typed dependency is caught at compile time, not decoration.|||VI: Đo thật (demo10/ts-10-4/bundledbad): TS2345. Kiểu đi cùng một package là cùng phép kiểm như code bạn tự viết — một lời gọi sai vào một dependency có kiểu bị bắt lúc biên dịch, không phải trang trí.',
      },
      {
        question: 'How does TypeScript find the types for a package you import?|||TypeScript tìm kiểu cho một package bạn import ra sao?',
        options: [
          'It infers them from the package’s .js at run time.|||Nó suy từ .js của package lúc chạy.',
          'It reads the "types" field in the package’s package.json → an @types package → otherwise TS7016.|||Nó đọc trường "types" trong package.json của package → một package @types → không có thì TS7016.',
          'It always downloads @types automatically.|||Nó luôn tự tải @types.',
          'Only packages written in TypeScript have types.|||Chỉ package viết bằng TypeScript mới có kiểu.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo10/ts-10-4/localpkg): a local package with a "types" field pointing at index.d.ts is typed from the import. TypeScript reads that field first, looks for an @types package next, and if neither exists it is TS7016 and you write the declaration yourself.|||VI: Đo thật (demo10/ts-10-4/localpkg): một package cục bộ với một trường "types" trỏ vào index.d.ts có kiểu từ import. TypeScript đọc trường đó trước, tìm một package @types tiếp, và nếu cả hai đều không có thì TS7016 và bạn tự viết khai báo.',
      },
    ],
  },
};
