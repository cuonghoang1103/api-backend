/**
 * TypeScript · Chương 9 · Quiz Chương 9 (10 câu tình huống về tsconfig & trình biên dịch). Slug giữ: typescript-9-5-quiz (bản cũ → 10 câu, 04/11/2026).
 * Dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2) trong demo9: 9.1 (scope 0 lỗi / seed TS2322), 9.2 (noImplicitAny TS7006, strictNullChecks TS18048),
 * 9.3 (indexed TS18048, returns TS7030), 9.4 (findLast es2022 TS2550, module TS2835). Đáp án rải: A ×3 (1,5,9) · B ×3 (2,6,10) · C ×2 (3,7) · D ×2 (4,8).
 */
export default {
  title: 'Chapter 9 check — 10 scenario questions|||Kiểm tra Chương 9 — 10 câu tình huống',
  slug: 'typescript-9-5-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười câu tình huống về Chương 9: tsconfig & trình biên dịch — lỗ hổng include (sự cố seed 08/08), strict (noImplicitAny, strictNullChecks), các cờ an toàn thêm, và target/lib/module/noEmit. Mọi thông báo đo thật bằng tsc 7.0.2 + Node 22.23.3, có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Check</span>
<h2>Chapter 9 check</h2>
<p class="lead">Ten scenarios on tsconfig and the compiler — the include gap, the strict family, the extra safety flags, and target/lib/module/noEmit. Every message comes from a real run (Node 22.23.3, tsc 7.0.2). Each answer explains why the right option is right and why the most tempting wrong one is wrong.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Kiểm tra Chương 9</h2>
<p class="lead">Mười tình huống về tsconfig và trình biên dịch — lỗ hổng include, họ strict, các cờ an toàn thêm, và target/lib/module/noEmit. Mọi thông báo từ lần chạy thật (Node 22.23.3, tsc 7.0.2). Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao đáp án sai hấp dẫn nhất lại sai.</p>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    passingScore: 70,
    questions: [
      {
        question: 'A project’s tsconfig has include: ["src"]. A file in seed/ uses a value that content.ts renamed away. You run tsc -p. What happens, and what does it prove?|||tsconfig của một dự án có include: ["src"]. Một tệp trong seed/ dùng một giá trị mà content.ts đã đổi tên đi. Bạn chạy tsc -p. Chuyện gì xảy ra, và nó chứng minh gì?',
        options: [
          '0 errors — seed/ is outside include, so tsc never checked it; a clean build only proves the files you pointed at.|||0 lỗi — seed/ nằm ngoài include, nên tsc không hề kiểm nó; một build sạch chỉ chứng minh các tệp bạn trỏ tới.',
          'TS2322 on the seed file.|||TS2322 trên tệp seed.',
          'tsc checks every file in the folder regardless of include.|||tsc kiểm mọi tệp trong thư mục bất kể include.',
          'A runtime error.|||Một lỗi lúc chạy.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo9/ts-09-1/scope): 0 errors. tsc only checks the files in include; seed/ is excluded, so the dead value is invisible. This is the 08/08 incident — a clean build means the files you pointed at are correct, not that the codebase is.|||VI: Đo thật (demo9/ts-09-1/scope): 0 lỗi. tsc chỉ kiểm các tệp trong include; seed/ bị loại, nên giá trị chết là vô hình. Đây là sự cố 08/08 — một build sạch nghĩa là các tệp bạn trỏ tới đúng, không phải cả mã nguồn.',
      },
      {
        question: 'You add a second config that includes the seed file (which imports the real ContentType and still uses the old value \'CODE\'). What does tsc say now?|||Bạn thêm một config thứ hai include tệp seed (nó import ContentType thật và còn dùng giá trị cũ \'CODE\'). tsc nói gì bây giờ?',
        options: [
          'Still 0 errors.|||Vẫn 0 lỗi.',
          'TS2322: \'CODE\' is not assignable to ContentType — including the seed surfaces the drift.|||TS2322: \'CODE\' không gán được cho ContentType — include seed làm chỗ trôi lộ ra.',
          'TS7006.|||TS7006.',
          'TS2835.|||TS2835.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo9/ts-09-1/scope, tsconfig.seed.json): TS2322. Once the seed is in the project AND imports the real ContentType, the renamed value is a compile error. A second typecheck config in CI is how you close the gap.|||VI: Đo thật (demo9/ts-09-1/scope, tsconfig.seed.json): TS2322. Khi seed vào dự án VÀ import ContentType thật, giá trị đổi tên là một lỗi biên dịch. Một config typecheck thứ hai trong CI là cách đóng lỗ hổng.',
      },
      {
        question: 'A .ts file with an interface Rect and a function using it is run by Node directly. What happens to the types?|||Một tệp .ts với một interface Rect và một hàm dùng nó được Node chạy thẳng. Chuyện gì xảy ra với các kiểu?',
        options: [
          'Node reads and enforces them at run time.|||Node đọc và ép chúng lúc chạy.',
          'The file will not run without compiling first.|||Tệp không chạy được nếu chưa biên dịch.',
          'They are erased — Node strips them and runs the JavaScript, so types only ever protect you via the tsc check beforehand.|||Chúng bị xoá — Node bỏ chúng và chạy JavaScript, nên kiểu chỉ bảo vệ bạn qua phép kiểm tsc trước đó.',
          'They become runtime assertions.|||Chúng thành các assertion lúc chạy.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo9/ts-09-1/erase): node runs the .ts and prints 12. Node 22 strips the types and runs the JavaScript; the types never run. Their whole value is the check tsc does first — which is why its configuration matters.|||VI: Đo thật (demo9/ts-09-1/erase): node chạy .ts và in 12. Node 22 bỏ kiểu và chạy JavaScript; kiểu không bao giờ chạy. Toàn bộ giá trị của chúng là phép kiểm tsc làm trước — vì thế cấu hình của nó quan trọng.',
      },
      {
        question: 'Under strict, a function parse(raw) with no type on raw. What does tsc say?|||Dưới strict, một hàm parse(raw) không có kiểu trên raw. tsc nói gì?',
        options: [
          'Nothing — raw is inferred from how it is used.|||Không gì — raw được suy từ cách dùng.',
          'TS18048.|||TS18048.',
          'TS2322.|||TS2322.',
          'TS7006: raw implicitly has an any type — noImplicitAny refuses a parameter with no type.|||TS7006: raw ngầm có kiểu any — noImplicitAny từ chối một tham số không kiểu.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo9/ts-09-2/implicitany): TS7006. noImplicitAny (part of strict) refuses an untyped parameter, because a silent any turns off every check inside the function. You must say what raw is.|||VI: Đo thật (demo9/ts-09-2/implicitany): TS7006. noImplicitAny (một phần của strict) từ chối một tham số không kiểu, vì một any âm thầm tắt mọi phép kiểm trong hàm. Bạn phải nói raw là gì.',
      },
      {
        question: 'const u = users.find(x => x.id === id); return u.name;  — under strictNullChecks, what does tsc say?|||const u = users.find(x => x.id === id); return u.name;  — dưới strictNullChecks, tsc nói gì?',
        options: [
          'TS18048: u is possibly undefined — find may return undefined, so you must handle it before reading .name.|||TS18048: u có thể undefined — find có thể trả undefined, nên bạn phải xử lý trước khi đọc .name.',
          'Nothing — find always returns a User.|||Không gì — find luôn trả một User.',
          'TS7006.|||TS7006.',
          'TS2345.|||TS2345.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo9/ts-09-2/nullchecks): TS18048. find returns User | undefined; strictNullChecks makes undefined a type you must handle — a guard, a default, or ?. — before touching the value. Without the flag this crash ships.|||VI: Đo thật (demo9/ts-09-2/nullchecks): TS18048. find trả User | undefined; strictNullChecks làm undefined một kiểu bạn phải xử lý — một guard, một mặc định, hay ?. — trước khi chạm giá trị. Không có cờ này cú sập lên sản phẩm.',
      },
      {
        question: 'A file greet(user) has an implicit any and an unguarded possibly-undefined value. You compile it with strict:false. What does tsc report?|||Một tệp greet(user) có một implicit any và một giá trị có-thể-undefined không chặn. Bạn biên dịch với strict:false. tsc báo gì?',
        options: [
          'TS7006 and TS18048.|||TS7006 và TS18048.',
          '0 errors — strict:false turns off both checks, so both bugs are hidden; flip strict on and the same file reports both.|||0 lỗi — strict:false tắt cả hai phép kiểm, nên cả hai bug ẩn; bật strict và cùng tệp đó báo cả hai.',
          'A runtime error.|||Một lỗi lúc chạy.',
          'TS2835.|||TS2835.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo9/ts-09-2/umbrella): strict:false → 0 errors; strict on → TS7006 + TS18048. The code did not change, the question tsc was asked did. Turning strict off to pass a build fixes nothing — it stops asking.|||VI: Đo thật (demo9/ts-09-2/umbrella): strict:false → 0 lỗi; strict bật → TS7006 + TS18048. Code không đổi, câu hỏi đặt cho tsc đổi. Tắt strict để build qua không sửa gì — nó chỉ ngừng hỏi.',
      },
      {
        question: 'const first = labs[0]; return first.code;  with noUncheckedIndexedAccess on. What does tsc say?|||const first = labs[0]; return first.code;  với noUncheckedIndexedAccess bật. tsc nói gì?',
        options: [
          'Nothing — labs[0] is always a Lab.|||Không gì — labs[0] luôn là một Lab.',
          'A runtime error only.|||Chỉ một lỗi lúc chạy.',
          'TS18048: first is possibly undefined — the flag makes every index access T | undefined, so you must guard it.|||TS18048: first có thể undefined — cờ làm mọi truy cập chỉ mục T | undefined, nên bạn phải chặn.',
          'TS7030.|||TS7030.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo9/ts-09-3/indexed): TS18048. noUncheckedIndexedAccess adds undefined to every index and key access, because the array could be empty — a little friction for never reading past the end. The course leaves it on.|||VI: Đo thật (demo9/ts-09-3/indexed): TS18048. noUncheckedIndexedAccess thêm undefined vào mọi truy cập chỉ mục và khoá, vì mảng có thể rỗng — một chút ma sát để không bao giờ đọc quá cuối. Khoá để nó bật.',
      },
      {
        question: 'grade(score) returns on two branches but falls off the end on a third, with noImplicitReturns on. What does tsc say?|||grade(score) trả về ở hai nhánh nhưng rơi khỏi cuối ở nhánh thứ ba, với noImplicitReturns bật. tsc nói gì?',
        options: [
          'Nothing — the function returns on some paths.|||Không gì — hàm trả về ở một số nhánh.',
          'TS2322.|||TS2322.',
          'TS6133.|||TS6133.',
          'TS7030: not all code paths return a value — the forgotten case the compiler can reach.|||TS7030: không phải mọi nhánh đều trả về — trường hợp bị quên mà trình biên dịch tới được.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo9/ts-09-3/returns): TS7030. noImplicitReturns (outside the strict umbrella) catches a branch that silently returns undefined — the forgotten else. noUnusedLocals (TS6133) and noUncheckedIndexedAccess are its siblings beyond strict.|||VI: Đo thật (demo9/ts-09-3/returns): TS7030. noImplicitReturns (ngoài chiếc ô strict) bắt một nhánh âm thầm trả undefined — cái else bị quên. noUnusedLocals (TS6133) và noUncheckedIndexedAccess là anh em của nó ngoài strict.',
      },
      {
        question: 'const found = labs.findLast(c => c.startsWith(\'AL\'));  with lib set to es2022. What does tsc say?|||const found = labs.findLast(c => c.startsWith(\'AL\'));  với lib đặt es2022. tsc nói gì?',
        options: [
          'TS2550: findLast does not exist — try changing lib to es2023 or later; lib is the set of built-in APIs the compiler assumes exist.|||TS2550: findLast không tồn tại — thử đổi lib sang es2023 trở lên; lib là tập API dựng sẵn trình biên dịch giả định tồn tại.',
          'Nothing — findLast works with any lib.|||Không gì — findLast chạy với lib nào cũng được.',
          'TS7006 only.|||Chỉ TS7006.',
          'A runtime error.|||Một lỗi lúc chạy.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo9/ts-09-4/libold): TS2550, with a hint to change lib to es2023 or later. findLast is an ES2023 method; too old a lib and a real method looks like a typo. The course lib (es2024) knows it, so the same call runs (printed AL-301).|||VI: Đo thật (demo9/ts-09-4/libold): TS2550, kèm gợi ý đổi lib sang es2023 trở lên. findLast là method ES2023; lib quá cũ thì một method thật trông như lỗi gõ. lib của khoá (es2024) biết nó, nên cùng lời gọi chạy (in AL-301).',
      },
      {
        question: 'Under nodenext, import { helper } from \'./helper\' (no extension). What does tsc say?|||Dưới nodenext, import { helper } from \'./helper\' (không phần mở rộng). tsc nói gì?',
        options: [
          'Nothing — the extension is optional.|||Không gì — phần mở rộng là tuỳ chọn.',
          'TS18048.|||TS18048.',
          'TS2835: relative imports need an explicit file extension under nodenext — Did you mean \'./helper.js\'?|||TS2835: import tương đối cần phần mở rộng tường minh dưới nodenext — Did you mean \'./helper.js\'?',
          'TS7030.|||TS7030.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo9/ts-09-4/module): TS2835, Did you mean \'./helper.js\'? module/moduleResolution decide how an import becomes a file; nodenext needs the extension. The course adds allowImportingTsExtensions so you write \'./helper.ts\'. tsc --noEmit is the CI gate that runs all these checks.|||VI: Đo thật (demo9/ts-09-4/module): TS2835, Did you mean \'./helper.js\'? module/moduleResolution quyết định một import thành một tệp ra sao; nodenext cần phần mở rộng. Khoá thêm allowImportingTsExtensions nên bạn viết \'./helper.ts\'. tsc --noEmit là cổng CI chạy mọi phép kiểm này.',
      },
    ],
  },
};
