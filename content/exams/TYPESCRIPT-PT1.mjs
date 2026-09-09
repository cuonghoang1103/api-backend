/**
 * TypeScript — Progress Test 1 (chương 0–5).
 *
 * Đề tự soạn, bám sát giáo trình `content/courses/typescript/s00…s05`.
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi.
 *
 * ⚠️ ĐO THẬT, KHÔNG ĐOÁN. Mọi thông báo lỗi, mọi kiểu suy luận và mọi dòng
 * "in ra gì" trong file này đều lấy từ việc chạy thật trên máy soạn đề:
 *
 *   • TypeScript  5.9.3   (`node_modules/.bin/tsc -v` — bản `^5.6.3` mà
 *                          `package.json` của repo ghim)
 *   • Node        v22.21.0
 *   • Cờ đo       tsc --noEmit --strict --target ES2022 <file>.ts
 *                 (khớp `tsconfig.json` của repo: strict + target ES2022)
 *   • Dump kiểu   tsc --declaration --emitDeclarationOnly --strict --target ES2022
 *   • Chạy        node <file>.ts  (Node 22 tự xoá chú thích kiểu)
 *
 * ⚠️ BỐN CHỖ MÁY KHÁC GIÁO TRÌNH (đo 10/09/2026 — theo MÁY, không theo sách):
 *
 *  1. **Phiên bản trình biên dịch.** Bài 0.3 in `npx tsc -v` ra
 *     `Version 7.0.2` và mô tả "TypeScript 7.0 là trình biên dịch viết lại
 *     bằng Go". Repo này ghim `typescript@^5.6.3` và bản thật đang cài là
 *     **5.9.3**. Mọi con số trong đề là của 5.9.3.
 *
 *  2. **Lỗi overload (bài 3.3).** Giáo trình in:
 *        TS2769: No overload matches this call.
 *          The last overload gave the following error.
 *     Máy với ĐÚNG HAI overload thì liệt kê CẢ HAI:
 *        Overload 1 of 2, '(x: string): number', gave the following error.
 *        Overload 2 of 2, '(x: unknown[]): number', gave the following error.
 *     Câu 19 hỏi theo bản máy. ("The last overload…" chỉ hiện khi có nhiều
 *     overload hơn.)
 *
 *  3. **Hàm luôn throw KHÔNG tự suy ra `never` (bài 2.3).** Giáo trình viết
 *     "một hàm luôn ném lỗi… nên kiểu trả về của nó là never". Đo bằng dump
 *     khai báo:
 *        function failDecl(m: string) { throw new Error(m); }   → : void
 *        const failExpr = function (m: string) { throw … };     → : never
 *        const failArrow = (m: string) => { throw … };          → : never
 *     Chỉ **hàm biểu thức / mũi tên** mới suy ra `never`; **khai báo hàm** suy
 *     ra `void`. Ví dụ trong bài viết `: never` bằng tay nên không sai — nhưng
 *     câu văn quanh nó dễ làm người học tin là suy luận tự ra `never`.
 *     Câu 12 ra đúng chỗ này.
 *
 *  4. **`"use strict";` trong file biên dịch (bài 0.3).** Giáo trình in
 *     `cat hello.js` bắt đầu bằng `"use strict";`. Chạy thật `tsc hello.ts`
 *     KHÔNG có dòng đó — nó đến từ `alwaysStrict` (nằm trong `strict`), nên chỉ
 *     xuất hiện khi bật `--strict`. Câu 2 vì thế chỉ hỏi phần chắc chắn: các
 *     chú thích kiểu bị xoá.
 *
 * 📊 Phân bố vị trí đáp án (đếm bằng lệnh dưới, chỉ tính 30 câu trắc nghiệm):
 *        { '0': 8, '1': 8, '2': 8, '3': 7 }   ← 31 vì câu 3 chọn HAI đáp án
 *   node -e "import('./content/exams/TYPESCRIPT-PT1.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Kiểm: node scripts/exam-check.mjs content/exams/TYPESCRIPT-PT1.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/TYPESCRIPT-PT1.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/typescript-exam-kit.mjs';

export default {
  course: { slug: 'typescript' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Chapters 0–5 (setup, inference, the basic type system, functions, objects, unions)',
        'Kiểm tra tiến độ 1 — Chương 0–5 (cài đặt, suy luận kiểu, hệ kiểu cơ bản, hàm, object, union)',
      ),
      description: B(
        'The first third of the TypeScript course: compile time versus runtime, what inference gives you for free, primitives and the special types, typing functions, modelling objects, and narrowing unions. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba đầu của khoá TypeScript: lúc biên dịch và lúc chạy, suy luận kiểu cho không những gì, các primitive và bốn kiểu đặc biệt, cách gõ kiểu cho hàm, mô hình hoá object, và thu hẹp union. 30 câu trắc nghiệm cùng 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–5'),
      questions: [
        // ── Chương 0 — Nhập môn, cài đặt, mô hình biên dịch/chạy ─────────
        mcq({
          prompt: B(
            'The same file is put through two commands. What happens in each?' + code(
              '// bug.ts\n' +
              'function double(n: number): number {\n' +
              '  return n * 2;\n' +
              '}\n' +
              "double('5');\n" +
              '\n' +
              '$ npx tsc --noEmit --strict bug.ts\n' +
              '$ npx tsx bug.ts',
            ),
            'Cùng một file được đưa qua hai lệnh. Mỗi lệnh cho kết quả gì?' + code(
              '// bug.ts\n' +
              'function double(n: number): number {\n' +
              '  return n * 2;\n' +
              '}\n' +
              "double('5');\n" +
              '\n' +
              '$ npx tsc --noEmit --strict bug.ts\n' +
              '$ npx tsx bug.ts',
            ),
          ),
          options: [
            B(
              'Both report the same error, because both read the type annotations before executing anything at all',
              'Cả hai đều báo cùng một lỗi, vì cả hai đều đọc chú thích kiểu trước khi chạy bất cứ thứ gì',
            ),
            B(
              'Both stay silent: the annotation is only a hint, and the compiler treats a wrong argument as a warning',
              'Cả hai đều im lặng: chú thích kiểu chỉ là gợi ý, còn trình biên dịch coi tham số sai là cảnh báo',
            ),
            B(
              'tsc reports TS2345 and exits non-zero; tsx erases the types, runs the file and exits 0',
              'tsc báo TS2345 và thoát với mã khác 0; tsx xoá kiểu, chạy file và thoát với mã 0',
            ),
            B(
              'tsx reports the error first, and tsc then refuses to emit anything because the file already failed',
              'tsx báo lỗi trước, rồi tsc từ chối sinh ra file nào vì file đã hỏng sẵn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured on TypeScript 5.9.3: <code>tsc --noEmit --strict bug.ts</code> prints <code>bug.ts(5,8): error TS2345: Argument of type &#39;string&#39; is not assignable to parameter of type &#39;number&#39;.</code> and exits 2, while <code>tsx bug.ts</code> exits 0. Type checking and running are two separate steps, done by two separate tools: <code>tsx</code> (and <code>node file.ts</code>, and esbuild) strip the annotations and never look at them. That is exactly why a <code>tsc --noEmit</code> job in CI is the only real gate — the runtime will never be one.',
            'Đo trên TypeScript 5.9.3: <code>tsc --noEmit --strict bug.ts</code> in ra <code>bug.ts(5,8): error TS2345: Argument of type &#39;string&#39; is not assignable to parameter of type &#39;number&#39;.</code> và thoát mã 2, còn <code>tsx bug.ts</code> thoát mã 0. Kiểm kiểu và chạy là hai bước riêng do hai công cụ riêng làm: <code>tsx</code> (và <code>node file.ts</code>, và esbuild) chỉ xoá chú thích kiểu chứ không hề đọc chúng. Đó chính là lý do một job <code>tsc --noEmit</code> trong CI mới là cửa chặn thật — lúc chạy thì không bao giờ có cửa nào.',
          ),
        }),

        mcq({
          prompt: B(
            'This file is compiled with <code>npx tsc hello.ts</code>. Which statement about the resulting <code>hello.js</code> is right?' + code(
              '// hello.ts\n' +
              "const who: string = 'CuongThai';\n" +
              'interface Greeting { text: string }\n' +
              'type Id = string | number;\n' +
              '\n' +
              'function greet(name: string): string {\n' +
              "  return 'Xin chao, ' + name;\n" +
              '}\n' +
              'console.log(greet(who));',
            ),
            'File này được biên dịch bằng <code>npx tsc hello.ts</code>. Phát biểu nào về <code>hello.js</code> sinh ra là ĐÚNG?' + code(
              '// hello.ts\n' +
              "const who: string = 'CuongThai';\n" +
              'interface Greeting { text: string }\n' +
              'type Id = string | number;\n' +
              '\n' +
              'function greet(name: string): string {\n' +
              "  return 'Xin chao, ' + name;\n" +
              '}\n' +
              'console.log(greet(who));',
            ),
          ),
          options: [
            B(
              'Every annotation, the interface and the type alias are all gone; only the three runnable statements remain',
              'Mọi chú thích kiểu, cả interface lẫn type alias đều biến mất; chỉ còn lại ba câu lệnh chạy được',
            ),
            B(
              'The annotations are gone but the interface stays, because an interface becomes a runtime object used for checks',
              'Chú thích kiểu biến mất nhưng interface ở lại, vì interface trở thành một object lúc chạy để kiểm tra dữ liệu',
            ),
            B(
              'Everything is kept verbatim and Node reads the annotations at load time to validate each argument',
              'Mọi thứ được giữ nguyên văn và Node đọc chú thích kiểu lúc nạp file để kiểm tra từng tham số',
            ),
            B(
              'The type alias survives as a JavaScript constant so that <code>Id</code> can still be referenced at runtime',
              'Type alias sống sót dưới dạng một hằng JavaScript để <code>Id</code> vẫn còn tham chiếu được lúc chạy',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Compiled for real, <code>hello.js</code> is three lines: the <code>const</code>, the <code>function</code> and the <code>console.log</code> — with <code>: string</code>, the <code>interface</code> and the <code>type</code> all erased. This is the mental model of lesson 0.4: types live at compile time, data lives at runtime, and they never meet. It also explains why <code>x instanceof User</code> cannot work when <code>User</code> is a type — by the time the line runs there is nothing named <code>User</code> left to compare against.',
            'Biên dịch thật thì <code>hello.js</code> chỉ còn ba dòng: <code>const</code>, <code>function</code> và <code>console.log</code> — <code>: string</code>, <code>interface</code> và <code>type</code> đều bị xoá sạch. Đây là mô hình của bài 0.4: kiểu sống ở lúc biên dịch, dữ liệu sống ở lúc chạy, và hai bên không bao giờ gặp nhau. Nó cũng giải thích vì sao <code>x instanceof User</code> không thể chạy khi <code>User</code> là một kiểu — tới lúc dòng đó chạy thì chẳng còn thứ nào tên <code>User</code> để đem ra so.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO tools from the course that actually CHECK types (rather than just erasing them).',
            'Chọn HAI công cụ trong bài học THỰC SỰ KIỂM kiểu (chứ không chỉ xoá kiểu đi).',
          ),
          options: [
            B('<code>tsc --noEmit</code>, the command CI runs', '<code>tsc --noEmit</code>, lệnh mà CI chạy'),
            B('<code>tsx</code> / <code>ts-node</code>, which run a <code>.ts</code> file directly', '<code>tsx</code> / <code>ts-node</code>, thứ chạy thẳng một file <code>.ts</code>'),
            B('The editor language service — the same checker, running as you type', 'Language service của trình soạn thảo — cùng bộ kiểm đó, chạy ngay khi bạn gõ'),
            B('<code>esbuild</code> / <code>swc</code>, the bundlers that strip types at high speed', '<code>esbuild</code> / <code>swc</code>, những bộ đóng gói xoá kiểu với tốc độ rất cao'),
          ],
          correct: [0, 2],
          explanation: EX(
            'Lesson 0.3 lists four ways to run TypeScript and only two of them check anything. <code>tsc</code> is the checker; your editor runs the same language service continuously, which is why a red squiggle and a CI failure are the same error. <code>tsx</code>, <code>node file.ts</code>, <code>esbuild</code> and <code>swc</code> all delete the annotations and run whatever is left — fast, and blind. The practical consequence: if the editor is silent and CI is red, the two are reading different configs, not different rules.',
            'Bài 0.3 liệt kê bốn cách chạy TypeScript và chỉ hai trong số đó kiểm được gì. <code>tsc</code> là bộ kiểm; trình soạn thảo chạy đúng language service đó một cách liên tục, nên gạch đỏ trong editor và lỗi đỏ trong CI là cùng một lỗi. <code>tsx</code>, <code>node file.ts</code>, <code>esbuild</code> và <code>swc</code> đều xoá chú thích kiểu rồi chạy phần còn lại — nhanh, và mù. Hệ quả thực tế: editor im mà CI đỏ thì hai bên đang đọc hai config khác nhau, chứ không phải hai bộ luật khác nhau.',
          ),
        }),

        // ── Chương 1 — Vì sao TypeScript tồn tại ────────────────────────
        mcq({
          prompt: B(
            'Three classic bugs, one file. Which trio of error codes does the compiler report, in this order?' + code(
              'interface User { id: string; email: string }\n' +
              'function sendTo(u: User) { return u.emial; }          // A\n' +
              '\n' +
              'function createNote(title: string, body: string) { return { title, body }; }\n' +
              "createNote('Hello');                                  // B\n" +
              '\n' +
              'const prices = [10, 20, 30];\n' +
              "const total = prices.reduce((a, b) => a + b) + '5';\n" +
              'const n: number = total;                              // C',
            ),
            'Ba con bug kinh điển trong một file. Trình biên dịch báo bộ ba mã lỗi nào, theo đúng thứ tự này?' + code(
              'interface User { id: string; email: string }\n' +
              'function sendTo(u: User) { return u.emial; }          // A\n' +
              '\n' +
              'function createNote(title: string, body: string) { return { title, body }; }\n' +
              "createNote('Hello');                                  // B\n" +
              '\n' +
              'const prices = [10, 20, 30];\n' +
              "const total = prices.reduce((a, b) => a + b) + '5';\n" +
              'const n: number = total;                              // C',
            ),
          ),
          options: [
            B(
              'A: TS2339 (property does not exist) · B: TS2345 (argument not assignable) · C: TS2365 (operator cannot be applied)',
              'A: TS2339 (thuộc tính không tồn tại) · B: TS2345 (tham số không gán được) · C: TS2365 (không áp dụng được toán tử)',
            ),
            B(
              'A: TS2551 with a "Did you mean &#39;email&#39;?" suggestion · B: TS2554 Expected 2 arguments, but got 1 · C: TS2322 Type &#39;string&#39; is not assignable to type &#39;number&#39;',
              'A: TS2551 kèm gợi ý "Did you mean &#39;email&#39;?" · B: TS2554 Expected 2 arguments, but got 1 · C: TS2322 Type &#39;string&#39; is not assignable to type &#39;number&#39;',
            ),
            B(
              'A: TS2551 (did you mean) · B: TS7006 (parameter implicitly has an any type) · C: TS18048 (value is possibly undefined)',
              'A: TS2551 (did you mean) · B: TS7006 (tham số ngầm mang kiểu any) · C: TS18048 (giá trị có thể là undefined)',
            ),
            B(
              'Only C is reported: A returns undefined at runtime and B fills the missing parameter with undefined, so neither is a type error',
              'Chỉ C bị báo: A trả về undefined lúc chạy còn B lấp tham số thiếu bằng undefined, nên cả hai đều không phải lỗi kiểu',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The exact output, measured: <code>TS2551: Property &#39;emial&#39; does not exist on type &#39;User&#39;. Did you mean &#39;email&#39;?</code>, then <code>TS2554: Expected 2 arguments, but got 1.</code>, then <code>TS2322: Type &#39;string&#39; is not assignable to type &#39;number&#39;.</code>. Note the third one: <code>reduce</code> gives a number, <code>+ &#39;5&#39;</code> turns it into the string <code>&quot;605&quot;</code>, and the error lands on the line where that string is forced into a <code>number</code> slot — not on the line where the mistake was made. These three codes are the ones you will read every week.',
            'Kết quả đo đúng nguyên văn: <code>TS2551: Property &#39;emial&#39; does not exist on type &#39;User&#39;. Did you mean &#39;email&#39;?</code>, rồi <code>TS2554: Expected 2 arguments, but got 1.</code>, rồi <code>TS2322: Type &#39;string&#39; is not assignable to type &#39;number&#39;.</code>. Để ý câu thứ ba: <code>reduce</code> cho ra một số, <code>+ &#39;5&#39;</code> biến nó thành chuỗi <code>&quot;605&quot;</code>, và lỗi rơi vào dòng ép chuỗi ấy vào ô <code>number</code> — chứ không phải dòng gây ra sai lầm. Ba mã lỗi này là ba mã bạn sẽ đọc hằng tuần.',
          ),
        }),

        mcq({
          prompt: B(
            'Under <code>--strict</code>, what does the compiler say about this function, and what would happen without strict?' + code(
              'function greet(name) {\n' +
              "  return 'Hi ' + name;\n" +
              '}',
            ),
            'Dưới <code>--strict</code>, trình biên dịch nói gì về hàm này, và nếu KHÔNG bật strict thì sao?' + code(
              'function greet(name) {\n' +
              "  return 'Hi ' + name;\n" +
              '}',
            ),
          ),
          options: [
            B(
              'Nothing under strict: TypeScript infers <code>string</code> for <code>name</code> from the concatenation on the next line',
              'Không lỗi gì dưới strict: TypeScript suy ra <code>string</code> cho <code>name</code> từ phép nối chuỗi ở dòng dưới',
            ),
            B(
              'TS2345 under strict, because a parameter with no annotation is treated as <code>never</code> and nothing can be passed to it',
              'TS2345 dưới strict, vì tham số không có chú thích kiểu bị coi là <code>never</code> nên không truyền gì vào được',
            ),
            B(
              'TS7006 under strict, and without strict the compiler still errors — implicit any is a syntax rule, not a flag',
              'TS7006 dưới strict, còn không strict thì vẫn lỗi — implicit any là quy tắc cú pháp chứ không phải một cờ',
            ),
            B(
              'TS7006 "Parameter &#39;name&#39; implicitly has an &#39;any&#39; type" under strict; without strict it silently becomes <code>any</code> and all checking on it is off',
              'TS7006 "Parameter &#39;name&#39; implicitly has an &#39;any&#39; type" dưới strict; không strict thì nó âm thầm thành <code>any</code> và mọi phép kiểm trên nó tắt hết',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured: <code>error TS7006: Parameter &#39;name&#39; implicitly has an &#39;any&#39; type.</code>. Inference works from values, and a parameter has no value at the point it is declared — so there is nothing to infer from, and the concatenation below is a use, not a definition. The flag that produces the error is <code>noImplicitAny</code>, which is part of <code>strict</code>; turn strict off and the parameter becomes <code>any</code> with no message at all. That is the whole reason the course insists on strict: without it TypeScript falls back to <code>any</code> exactly where you most need it not to.',
            'Đo được: <code>error TS7006: Parameter &#39;name&#39; implicitly has an &#39;any&#39; type.</code>. Suy luận kiểu đi từ GIÁ TRỊ, mà tham số thì chưa có giá trị nào ở chỗ nó được khai báo — nên không có gì để suy ra, còn phép nối chuỗi bên dưới chỉ là chỗ DÙNG chứ không phải chỗ định nghĩa. Cờ sinh ra lỗi này là <code>noImplicitAny</code>, nằm trong <code>strict</code>; tắt strict thì tham số thành <code>any</code> mà không một lời cảnh báo. Đó chính là lý do khoá học nhất quyết bắt bật strict: không có nó, TypeScript rơi về <code>any</code> đúng ở chỗ bạn cần nó đừng làm thế nhất.',
          ),
        }),

        mcq({
          prompt: B(
            'What does <code>tsc --noEmit --strict</code> report for this file?' + code(
              "const x: any = 'hello';\n" +
              'x.foo.bar.baz();\n' +
              'const n: number = x;',
            ),
            '<code>tsc --noEmit --strict</code> báo gì cho file này?' + code(
              "const x: any = 'hello';\n" +
              'x.foo.bar.baz();\n' +
              'const n: number = x;',
            ),
          ),
          options: [
            B(
              'TS2339 on line 2, because <code>foo</code> does not exist on a string, and TS2322 on line 3',
              'TS2339 ở dòng 2, vì <code>foo</code> không tồn tại trên một chuỗi, và TS2322 ở dòng 3',
            ),
            B(
              'TS18046 on line 2 — you must narrow the value before calling anything on it',
              'TS18046 ở dòng 2 — phải thu hẹp kiểu trước khi gọi bất cứ thứ gì trên nó',
            ),
            B(
              'Nothing at all: it exits 0, and both bugs are only discovered when the code runs',
              'Không báo gì cả: nó thoát mã 0, và cả hai con bug chỉ lộ ra khi mã chạy',
            ),
            B(
              'A single TS2322 on line 3, since assigning <code>any</code> to <code>number</code> is the only rule <code>any</code> cannot break',
              'Đúng một lỗi TS2322 ở dòng 3, vì gán <code>any</code> cho <code>number</code> là luật duy nhất mà <code>any</code> không phá được',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured: exit code 0, no output. <code>any</code> is assignable both to and from everything, so it does not skip one check — it switches checking off for that value and for everything derived from it. Nothing turns red, which is exactly the danger: you feel protected and are not. When you genuinely do not know a type, write <code>unknown</code> instead — it also means "I do not know", but it forces the check rather than deleting it.',
            'Đo được: mã thoát 0, không in ra gì. <code>any</code> gán được cả hai chiều với mọi kiểu, nên nó không bỏ qua MỘT phép kiểm — nó tắt hẳn việc kiểm cho giá trị đó và cho mọi thứ suy ra từ đó. Không có gì đỏ lên, và đó đúng là chỗ nguy hiểm: bạn thấy mình được bảo vệ trong khi không hề. Khi thật sự chưa biết kiểu, hãy viết <code>unknown</code> — nó cũng nghĩa là "tôi chưa biết", nhưng nó BẮT bạn kiểm chứ không xoá phép kiểm đi.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 1.2 draws a line around what the type checker can prove. Which statement falls on the "it cannot prove this" side?',
            'Bài 1.2 vạch một ranh giới quanh những gì bộ kiểm kiểu chứng minh được. Phát biểu nào nằm ở phía "cái này nó KHÔNG chứng minh được"?',
          ),
          options: [
            B(
              'That every call to <code>createNote</code> passes exactly the two strings the signature declares',
              'Rằng mọi lời gọi <code>createNote</code> đều truyền đúng hai chuỗi mà chữ ký hàm khai báo',
            ),
            B(
              'That the JSON body arriving on a request really has the shape the handler annotated it with',
              'Rằng thân JSON đến trong một request thật sự có đúng hình dạng mà handler đã chú thích cho nó',
            ),
            B(
              'That no file reads <code>u.emial</code> when the declared type of <code>u</code> only has <code>email</code>',
              'Rằng không file nào đọc <code>u.emial</code> khi kiểu khai báo của <code>u</code> chỉ có <code>email</code>',
            ),
            B(
              'That a value annotated <code>string | null</code> is checked for null before any member on it is used',
              'Rằng một giá trị chú thích <code>string | null</code> đều được kiểm null trước khi dùng bất kỳ thành viên nào của nó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The checker proves consistency <b>between your own files</b>, at compile time. Data that arrives from outside — an HTTP body, <code>JSON.parse</code>, <code>process.env</code>, a database row — does not exist when the check runs, so TypeScript simply believes whatever you claimed about it. The course demonstrates this with <code>const u = raw as User</code> on a value that is really <code>null</code>: <code>tsc</code> exits 0 and the program throws <code>TypeError: Cannot read properties of null</code>. Boundaries need a runtime check written in real JavaScript — that is chapter 13 (Zod), a different job from typing.',
            'Bộ kiểm chứng minh sự nhất quán <b>giữa chính các file của bạn</b>, ở lúc biên dịch. Dữ liệu đến từ bên ngoài — thân HTTP, <code>JSON.parse</code>, <code>process.env</code>, một dòng trong cơ sở dữ liệu — chưa tồn tại lúc kiểm, nên TypeScript chỉ đơn giản TIN vào điều bạn khai. Bài học minh hoạ bằng <code>const u = raw as User</code> trên một giá trị thật ra là <code>null</code>: <code>tsc</code> thoát mã 0 còn chương trình ném <code>TypeError: Cannot read properties of null</code>. Ranh giới cần một phép kiểm lúc chạy viết bằng JavaScript thật — đó là chương 13 (Zod), một việc khác với việc gõ kiểu.',
          ),
        }),

        // ── Chương 2 — Hệ thống kiểu cơ bản ─────────────────────────────
        mcq({
          prompt: B(
            'What does <code>tsc --strict</code> report here, and what is the standard fix?' + code(
              'function firstChar(s: string | null): string {\n' +
              '  return s[0];\n' +
              '}',
            ),
            '<code>tsc --strict</code> báo gì ở đây, và cách sửa chuẩn là gì?' + code(
              'function firstChar(s: string | null): string {\n' +
              '  return s[0];\n' +
              '}',
            ),
          ),
          options: [
            B(
              'TS18047 "&#39;s&#39; is possibly &#39;null&#39;" — add a guard such as <code>if (s === null) return &#39;&#39;;</code> before the indexing',
              'TS18047 "&#39;s&#39; is possibly &#39;null&#39;" — thêm một chốt kiểu <code>if (s === null) return &#39;&#39;;</code> trước khi lấy phần tử',
            ),
            B(
              'TS2322, because indexing a string returns <code>string | undefined</code> and the function promised a plain <code>string</code>',
              'TS2322, vì lấy phần tử của chuỗi trả về <code>string | undefined</code> trong khi hàm hứa trả <code>string</code>',
            ),
            B(
              'Nothing: <code>null[0]</code> is valid JavaScript that evaluates to <code>undefined</code>, so the compiler allows it',
              'Không lỗi: <code>null[0]</code> là JavaScript hợp lệ và cho ra <code>undefined</code>, nên trình biên dịch chấp nhận',
            ),
            B(
              'TS2531 "Object is possibly &#39;null&#39;" — the fix is to write <code>s!</code>, which is the intended use of the operator',
              'TS2531 "Object is possibly &#39;null&#39;" — sửa bằng cách viết <code>s!</code>, đó đúng là công dụng của toán tử này',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: <code>error TS18047: &#39;s&#39; is possibly &#39;null&#39;.</code>. Under <code>strictNullChecks</code>, <code>null</code> is its own type and is not silently part of <code>string</code>; once you write the union honestly, the compiler refuses to let you use the value until the null case is handled. The right fix is a guard (chapter 5 calls it narrowing), not <code>s!</code> — the non-null assertion just tells the compiler to stop asking, which puts you back where you started with a crash at runtime.',
            'Đo được: <code>error TS18047: &#39;s&#39; is possibly &#39;null&#39;.</code>. Dưới <code>strictNullChecks</code>, <code>null</code> là một kiểu riêng và không âm thầm nằm trong <code>string</code>; khi bạn đã viết union một cách trung thực thì trình biên dịch không cho dùng giá trị đó tới khi nhánh null được xử lý. Cách sửa đúng là một chốt kiểm (chương 5 gọi là thu hẹp kiểu), không phải <code>s!</code> — dấu chấm than chỉ bảo trình biên dịch thôi hỏi, và đưa bạn về đúng chỗ cũ với một cú sập lúc chạy.',
          ),
        }),

        mcq({
          prompt: B(
            'Two of these three lines are accepted. Which line fails, and what is the message?' + code(
              "let s: String = 'a';       // 1\n" +
              'const t: string = s;       // 2\n' +
              "const u: String = 'b';     // 3",
            ),
            'Hai trong ba dòng này được chấp nhận. Dòng nào hỏng, và thông báo là gì?' + code(
              "let s: String = 'a';       // 1\n" +
              'const t: string = s;       // 2\n' +
              "const u: String = 'b';     // 3",
            ),
          ),
          options: [
            B(
              'Line 1 — capitalised <code>String</code> is not a type name at all, so it is TS2304 "Cannot find name &#39;String&#39;"',
              'Dòng 1 — chữ hoa <code>String</code> không phải tên kiểu, nên báo TS2304 "Cannot find name &#39;String&#39;"',
            ),
            B(
              'Line 3 — a string literal cannot be assigned to the wrapper type, so a wrapper variable can only hold <code>new String(...)</code>',
              'Dòng 3 — chuỗi literal không gán được cho kiểu wrapper, nên biến wrapper chỉ chứa được <code>new String(...)</code>',
            ),
            B(
              'None of them — <code>String</code> and <code>string</code> are interchangeable aliases, which is why the linter rather than the compiler flags this',
              'Không dòng nào — <code>String</code> và <code>string</code> là hai tên gọi thay thế nhau, nên chỉ linter mới bắt chứ trình biên dịch thì không',
            ),
            B(
              'Line 2 — TS2322 "Type &#39;String&#39; is not assignable to type &#39;string&#39;", with the hint that <code>string</code> is the primitive and <code>String</code> the wrapper object',
              'Dòng 2 — TS2322 "Type &#39;String&#39; is not assignable to type &#39;string&#39;", kèm gợi ý rằng <code>string</code> là primitive còn <code>String</code> là object bao ngoài',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured, exactly: <code>error TS2322: Type &#39;String&#39; is not assignable to type &#39;string&#39;. &#39;string&#39; is a primitive, but &#39;String&#39; is a wrapper object. Prefer using &#39;string&#39; when possible.</code> The direction matters — a primitive flows INTO the wrapper type happily (lines 1 and 3 compile), but not the other way. This is why the capitalised spelling is a slow-acting mistake: it accepts your values without complaint and only breaks when the variable meets a function that wants the real primitive.',
            'Đo đúng nguyên văn: <code>error TS2322: Type &#39;String&#39; is not assignable to type &#39;string&#39;. &#39;string&#39; is a primitive, but &#39;String&#39; is a wrapper object. Prefer using &#39;string&#39; when possible.</code> Chiều gán mới là chỗ quan trọng — primitive chảy VÀO kiểu wrapper thì thoải mái (dòng 1 và 3 biên dịch được), còn chiều ngược lại thì không. Vì thế viết hoa là một sai lầm ngấm chậm: nó nhận giá trị của bạn không kêu ca gì, và chỉ vỡ ra khi biến đó gặp một hàm cần đúng primitive.',
          ),
        }),

        mcq({
          prompt: B(
            'A PostgreSQL <code>bigint</code> id arrives as the string below. What does this print?' + code(
              "const big = Number('9007199254740993');\n" +
              'console.log(big);\n' +
              'console.log(big === 9007199254740992);',
            ),
            'Một id kiểu <code>bigint</code> từ PostgreSQL về dưới dạng chuỗi sau. Đoạn mã in ra gì?' + code(
              "const big = Number('9007199254740993');\n" +
              'console.log(big);\n' +
              'console.log(big === 9007199254740992);',
            ),
          ),
          options: [
            B('9007199254740993 then false — <code>number</code> is 64-bit, so it holds this value exactly', '9007199254740993 rồi false — <code>number</code> là 64 bit nên giữ đúng giá trị này'),
            B('9007199254740992 then true — the last digit is lost, silently, with no error anywhere', '9007199254740992 rồi true — chữ số cuối bị mất, âm thầm, không lỗi ở đâu cả'),
            B('NaN then false — a numeric string beyond the safe range cannot be converted at all', 'NaN rồi false — chuỗi số vượt quá ngưỡng an toàn thì không chuyển đổi được'),
            B('9007199254740993 then true — the comparison coerces both sides to the same safe integer first', '9007199254740993 rồi true — phép so sánh ép cả hai vế về cùng một số nguyên an toàn trước'),
          ],
          correct: 1,
          explanation: EX(
            'Run for real on Node 22: <code>9007199254740992</code> then <code>true</code>. TypeScript\'s <code>number</code> is a 64-bit float, so integers above 2^53 lose precision — and the type system says nothing, because nothing is <i>inconsistent</i>, only wrong. The same float explains why <code>0.1 + 0.2</code> prints <code>0.30000000000000004</code> in typed code exactly as in untyped code. Keep large database ids as <code>string</code> or <code>bigint</code> end to end, and keep money as integer minor units: an annotation guarantees nothing about precision.',
            'Chạy thật trên Node 22: <code>9007199254740992</code> rồi <code>true</code>. Kiểu <code>number</code> của TypeScript là số thực 64 bit, nên số nguyên vượt 2^53 mất độ chính xác — và hệ kiểu không nói gì, vì chẳng có gì <i>mâu thuẫn</i> cả, chỉ là sai. Cũng chính số thực đó giải thích vì sao <code>0.1 + 0.2</code> in ra <code>0.30000000000000004</code> trong mã có kiểu y như trong mã không kiểu. Hãy giữ id lớn từ cơ sở dữ liệu ở dạng <code>string</code> hoặc <code>bigint</code> suốt cả đường đi, và giữ tiền ở dạng số nguyên đơn vị nhỏ nhất: chú thích kiểu không hứa gì về độ chính xác.',
          ),
        }),

        mcq({
          prompt: B(
            'How many errors does <code>tsc --strict</code> report, and on which lines?' + code(
              'let point: [number, number] = [10, 20];\n' +
              'point = [1, 2, 3];\n' +
              'const [a, b, c] = point;',
            ),
            '<code>tsc --strict</code> báo bao nhiêu lỗi, và ở những dòng nào?' + code(
              'let point: [number, number] = [10, 20];\n' +
              'point = [1, 2, 3];\n' +
              'const [a, b, c] = point;',
            ),
          ),
          options: [
            B(
              'One, on line 2 only — destructuring is always allowed to ask for more names than the value has',
              'Một lỗi, chỉ ở dòng 2 — phép rã luôn được phép xin nhiều tên hơn số phần tử của giá trị',
            ),
            B(
              'One, on line 3 only — line 2 is fine because a tuple accepts any array whose elements all match',
              'Một lỗi, chỉ ở dòng 3 — dòng 2 không sao vì tuple nhận mọi mảng có phần tử khớp kiểu',
            ),
            B(
              'Two: TS2322 on line 2 ("Source has 3 element(s) but target allows only 2") and TS2493 on line 3 (no element at index 2)',
              'Hai lỗi: TS2322 ở dòng 2 ("Source has 3 element(s) but target allows only 2") và TS2493 ở dòng 3 (không có phần tử ở chỉ số 2)',
            ),
            B(
              'None: a tuple type only constrains the element types, and the length is checked at runtime instead',
              'Không lỗi nào: kiểu tuple chỉ ràng buộc kiểu phần tử, còn độ dài thì được kiểm lúc chạy',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured output, both lines: <code>TS2322: Type &#39;[number, number, number]&#39; is not assignable to type &#39;[number, number]&#39;. Source has 3 element(s) but target allows only 2.</code> and <code>TS2493: Tuple type &#39;[number, number]&#39; of length &#39;2&#39; has no element at index &#39;2&#39;.</code>. A tuple pins the length as well as the type at each position — that is the whole difference from <code>number[]</code>, and it is why <code>useState</code> can return <code>[value, setValue]</code> and have both halves typed differently.',
            'Kết quả đo, cả hai dòng: <code>TS2322: Type &#39;[number, number, number]&#39; is not assignable to type &#39;[number, number]&#39;. Source has 3 element(s) but target allows only 2.</code> và <code>TS2493: Tuple type &#39;[number, number]&#39; of length &#39;2&#39; has no element at index &#39;2&#39;.</code>. Tuple ghim cả ĐỘ DÀI lẫn kiểu ở từng vị trí — đó là toàn bộ khác biệt so với <code>number[]</code>, và cũng là lý do <code>useState</code> trả về <code>[value, setValue]</code> mà hai nửa mang hai kiểu khác nhau.',
          ),
        }),

        mcq({
          prompt: B(
            'None of these three has a return annotation, and all three only ever throw. What return types does <code>tsc --declaration</code> emit?' + code(
              'function failDecl(m: string) { throw new Error(m); }\n' +
              'const failExpr = function (m: string) { throw new Error(m); };\n' +
              'const failArrow = (m: string) => { throw new Error(m); };',
            ),
            'Cả ba đều không chú thích kiểu trả về và đều chỉ ném lỗi. <code>tsc --declaration</code> sinh ra kiểu trả về nào?' + code(
              'function failDecl(m: string) { throw new Error(m); }\n' +
              'const failExpr = function (m: string) { throw new Error(m); };\n' +
              'const failArrow = (m: string) => { throw new Error(m); };',
            ),
          ),
          options: [
            B('All three are <code>never</code> — a body that cannot return a value always infers the bottom type', 'Cả ba đều là <code>never</code> — thân hàm không thể trả về giá trị thì luôn suy ra kiểu đáy'),
            B('All three are <code>void</code> — <code>never</code> is only ever produced by an explicit annotation', 'Cả ba đều là <code>void</code> — <code>never</code> chỉ xuất hiện khi bạn tự chú thích tay'),
            B('All three are <code>undefined</code>, since <code>throw</code> is an expression whose value is discarded', 'Cả ba đều là <code>undefined</code>, vì <code>throw</code> là biểu thức mà giá trị bị bỏ đi'),
            B('<code>failDecl</code> is <code>void</code>; <code>failExpr</code> and <code>failArrow</code> are both <code>never</code>', '<code>failDecl</code> là <code>void</code>; <code>failExpr</code> và <code>failArrow</code> đều là <code>never</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Dumped for real: <code>declare function failDecl(m: string): void;</code>, <code>declare const failExpr: (m: string) =&gt; never;</code>, <code>declare const failArrow: (m: string) =&gt; never;</code>. TypeScript infers <code>never</code> only for function <b>expressions</b> and arrow functions; a function <b>declaration</b> with no annotation gets <code>void</code>. Note this is narrower than the chapter\'s sentence "a function that always throws… so its return type is never" — the lesson\'s own example writes <code>: never</code> by hand, and that annotation is exactly what makes it true. If you want an <code>assertNever</code>-style helper to work as a declaration, annotate it.',
            'Dump thật ra: <code>declare function failDecl(m: string): void;</code>, <code>declare const failExpr: (m: string) =&gt; never;</code>, <code>declare const failArrow: (m: string) =&gt; never;</code>. TypeScript chỉ suy ra <code>never</code> cho hàm dạng <b>biểu thức</b> và hàm mũi tên; <b>khai báo hàm</b> không chú thích thì nhận <code>void</code>. Lưu ý điều này hẹp hơn câu trong bài "một hàm luôn ném lỗi… nên kiểu trả về của nó là never" — ví dụ của chính bài viết <code>: never</code> bằng tay, và chính chú thích đó mới làm câu ấy đúng. Muốn một hàm kiểu <code>assertNever</code> viết dạng khai báo mà chạy đúng thì phải chú thích kiểu trả về.',
          ),
        }),

        mcq({
          prompt: B(
            'What is the error on line 2, and what makes the same call legal further down?' + code(
              "const data: unknown = 'hello';\n" +
              'data.toUpperCase();\n' +
              '\n' +
              "if (typeof data === 'string') {\n" +
              '  data.toUpperCase();\n' +
              '}',
            ),
            'Lỗi ở dòng 2 là gì, và điều gì khiến đúng lời gọi ấy trở nên hợp lệ ở phía dưới?' + code(
              "const data: unknown = 'hello';\n" +
              'data.toUpperCase();\n' +
              '\n' +
              "if (typeof data === 'string') {\n" +
              '  data.toUpperCase();\n' +
              '}',
            ),
          ),
          options: [
            B(
              'TS18046 "&#39;data&#39; is of type &#39;unknown&#39;" — the <code>typeof</code> check narrows it to <code>string</code>, and only inside that branch is the method available',
              'TS18046 "&#39;data&#39; is of type &#39;unknown&#39;" — phép <code>typeof</code> thu hẹp nó về <code>string</code>, và chỉ trong nhánh đó phương thức mới dùng được',
            ),
            B(
              'TS2339 "Property &#39;toUpperCase&#39; does not exist" — the <code>if</code> works because it re-declares <code>data</code> with a new type',
              'TS2339 "Property &#39;toUpperCase&#39; does not exist" — cái <code>if</code> chạy được vì nó khai báo lại <code>data</code> với kiểu mới',
            ),
            B(
              'No error at all: the initialiser is visibly a string, so the compiler ignores the <code>unknown</code> annotation you wrote',
              'Không lỗi gì: giá trị khởi tạo nhìn rõ là chuỗi, nên trình biên dịch bỏ qua chú thích <code>unknown</code> mà bạn viết',
            ),
            B(
              'TS2571 — and the <code>if</code> makes no difference, because <code>unknown</code> can only be unlocked with a cast such as <code>data as string</code>',
              'TS2571 — và cái <code>if</code> chẳng thay đổi gì, vì <code>unknown</code> chỉ mở khoá được bằng một phép ép kiểu như <code>data as string</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: <code>error TS18046: &#39;data&#39; is of type &#39;unknown&#39;.</code>, one error, on line 2 only. This is the difference from <code>any</code> in one screenshot: both mean "I do not know the type", but <code>unknown</code> lets you assign anything INTO it while forbidding every use until you prove what it is. That makes it the correct type for anything crossing your program\'s boundary — <code>JSON.parse</code>, a request body, <code>localStorage</code> — because the errors it produces are precisely the list of places that still need a real check.',
            'Đo được: <code>error TS18046: &#39;data&#39; is of type &#39;unknown&#39;.</code>, đúng một lỗi, chỉ ở dòng 2. Đây là khác biệt với <code>any</code> gói gọn trong một khung hình: cả hai đều nghĩa "tôi chưa biết kiểu", nhưng <code>unknown</code> cho phép gán mọi thứ VÀO nó trong khi cấm mọi cách DÙNG cho tới khi bạn chứng minh nó là gì. Nhờ vậy nó là kiểu đúng cho mọi thứ đi qua ranh giới chương trình — <code>JSON.parse</code>, thân request, <code>localStorage</code> — vì đống lỗi nó sinh ra chính là danh sách những chỗ còn thiếu một phép kiểm thật.',
          ),
        }),

        mcq({
          prompt: B(
            'One of the last two lines compiles and the other does not. Which fails, and what is the reported type?' + code(
              'const nums = [1, 2, 3];\n' +
              'const frozen = [1, 2, 3] as const;\n' +
              'nums.push(4);\n' +
              'frozen.push(4);',
            ),
            'Một trong hai dòng cuối biên dịch được, dòng kia thì không. Dòng nào hỏng, và kiểu được báo là gì?' + code(
              'const nums = [1, 2, 3];\n' +
              'const frozen = [1, 2, 3] as const;\n' +
              'nums.push(4);\n' +
              'frozen.push(4);',
            ),
          ),
          options: [
            B(
              '<code>nums.push(4)</code> fails: <code>const</code> makes the binding immutable, so no method may change the array either',
              '<code>nums.push(4)</code> hỏng: <code>const</code> làm liên kết bất biến nên không phương thức nào được đổi mảng',
            ),
            B(
              '<code>frozen.push(4)</code> fails with TS2339 — <code>push</code> does not exist on type <code>readonly [1, 2, 3]</code>',
              '<code>frozen.push(4)</code> hỏng với TS2339 — <code>push</code> không tồn tại trên kiểu <code>readonly [1, 2, 3]</code>',
            ),
            B(
              '<code>frozen.push(4)</code> fails with TS2345, because <code>4</code> is not assignable to the element type <code>1 | 2 | 3</code>',
              '<code>frozen.push(4)</code> hỏng với TS2345, vì <code>4</code> không gán được cho kiểu phần tử <code>1 | 2 | 3</code>',
            ),
            B(
              'Neither fails at compile time; <code>as const</code> only freezes the value at runtime, via an implicit <code>Object.freeze</code>',
              'Không dòng nào hỏng lúc biên dịch; <code>as const</code> chỉ đóng băng giá trị lúc chạy, bằng một lệnh <code>Object.freeze</code> ngầm',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: <code>error TS2339: Property &#39;push&#39; does not exist on type &#39;readonly [1, 2, 3]&#39;.</code> — one error, on the last line. Read the type carefully: <code>as const</code> did three things at once. It turned the array into a <b>tuple</b> of fixed length, made every element a <b>literal</b> type (<code>1</code>, not <code>number</code>), and made the whole thing <b>readonly</b>, which removes every mutating method from the type. Without it, <code>nums</code> is a plain <code>number[]</code> and <code>push</code> is there as usual. And note the last option: <code>as const</code> is a compile-time instruction — it emits no code and freezes nothing at runtime.',
            'Đo được: <code>error TS2339: Property &#39;push&#39; does not exist on type &#39;readonly [1, 2, 3]&#39;.</code> — đúng một lỗi, ở dòng cuối. Hãy đọc kỹ cái kiểu: <code>as const</code> làm ba việc cùng lúc. Nó biến mảng thành <b>tuple</b> có độ dài cố định, biến mỗi phần tử thành kiểu <b>literal</b> (<code>1</code> chứ không phải <code>number</code>), và làm cả thứ đó thành <b>readonly</b>, tức gỡ sạch mọi phương thức làm thay đổi mảng khỏi kiểu. Không có nó thì <code>nums</code> chỉ là <code>number[]</code> bình thường và <code>push</code> vẫn ở đó. Và để ý lựa chọn cuối: <code>as const</code> là chỉ thị lúc biên dịch — nó không sinh ra dòng mã nào và không đóng băng gì lúc chạy.',
          ),
        }),

        // ── Chương 3 — Hàm ──────────────────────────────────────────────
        mcq({
          prompt: B(
            'What does the compiler report, and what is the type of <code>title</code> inside the body?' + code(
              'function greet(name: string, title?: string) {\n' +
              "  return title.toUpperCase() + ' ' + name;\n" +
              '}',
            ),
            'Trình biên dịch báo gì, và kiểu của <code>title</code> bên trong thân hàm là gì?' + code(
              'function greet(name: string, title?: string) {\n' +
              "  return title.toUpperCase() + ' ' + name;\n" +
              '}',
            ),
          ),
          options: [
            B(
              'No error; <code>title</code> is <code>string</code>, and callers who omit it get the empty string automatically',
              'Không lỗi; <code>title</code> là <code>string</code>, và người gọi bỏ qua nó thì tự nhận chuỗi rỗng',
            ),
            B(
              'TS2554, because a call that omits an optional argument still has to pass <code>undefined</code> explicitly',
              'TS2554, vì lời gọi bỏ qua tham số tuỳ chọn vẫn phải truyền <code>undefined</code> một cách tường minh',
            ),
            B(
              'TS18048 "&#39;title&#39; is possibly &#39;undefined&#39;" — inside the body its type is <code>string | undefined</code>',
              'TS18048 "&#39;title&#39; is possibly &#39;undefined&#39;" — bên trong thân hàm kiểu của nó là <code>string | undefined</code>',
            ),
            B(
              'TS7006, because an optional parameter with no default value is inferred as implicit <code>any</code>',
              'TS7006, vì tham số tuỳ chọn không có giá trị mặc định bị suy ra thành <code>any</code> ngầm',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured: <code>error TS18048: &#39;title&#39; is possibly &#39;undefined&#39;.</code>. The <code>?</code> does two things: it lets callers leave the argument out, and it widens the parameter\'s type inside the function to <code>string | undefined</code> — so the compiler forces the missing case to be handled. Fix it with a guard (<code>if (title) …</code>), with optional chaining (<code>title?.toUpperCase()</code>), or better, with a default value (<code>title = &#39;&#39;</code>), which removes the branch entirely because the default fills in before the body runs.',
            'Đo được: <code>error TS18048: &#39;title&#39; is possibly &#39;undefined&#39;.</code>. Dấu <code>?</code> làm hai việc: cho phép người gọi bỏ qua tham số, và nới kiểu của tham số bên trong hàm thành <code>string | undefined</code> — nên trình biên dịch bắt bạn xử lý nhánh thiếu. Sửa bằng một chốt kiểm (<code>if (title) …</code>), bằng optional chaining (<code>title?.toUpperCase()</code>), hoặc tốt hơn là bằng giá trị mặc định (<code>title = &#39;&#39;</code>), cách này xoá hẳn cái nhánh vì mặc định đã điền vào trước khi thân hàm chạy.',
          ),
        }),

        mcq({
          prompt: B(
            'These two signatures look equivalent. Which of the two calls is an error?' + code(
              'function f(x?: number) { return x; }\n' +
              'f();                                  // A\n' +
              '\n' +
              'function g(x: number | undefined) { return x; }\n' +
              'g();                                  // B',
            ),
            'Hai chữ ký này trông tương đương. Lời gọi nào là lỗi?' + code(
              'function f(x?: number) { return x; }\n' +
              'f();                                  // A\n' +
              '\n' +
              'function g(x: number | undefined) { return x; }\n' +
              'g();                                  // B',
            ),
          ),
          options: [
            B('Neither — <code>x?: number</code> is just shorthand for <code>x: number | undefined</code>', 'Không lời gọi nào — <code>x?: number</code> chỉ là cách viết tắt của <code>x: number | undefined</code>'),
            B('Both — under strict mode every parameter must be passed, optional or not', 'Cả hai — dưới chế độ strict thì tham số nào cũng phải truyền, tuỳ chọn hay không'),
            B('A, because an optional parameter still occupies an argument slot that must be filled', 'A, vì tham số tuỳ chọn vẫn chiếm một ô tham số bắt buộc phải lấp'),
            B('B — TS2554 "Expected 1 arguments, but got 0": the caller must pass something, even <code>undefined</code>', 'B — TS2554 "Expected 1 arguments, but got 0": người gọi phải truyền gì đó, kể cả <code>undefined</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Measured: exactly one error, <code>error TS2554: Expected 1 arguments, but got 0.</code> on the <code>g()</code> line. The <code>?</code> is about the <b>call site</b> — may this argument be left out — while <code>| undefined</code> is about the <b>type</b>: the argument is required, and <code>undefined</code> happens to be a legal value for it. Use <code>?</code> when omitting it is genuinely valid; use the explicit union when the caller must make a decision and say so. The distinction becomes invisible-and-dangerous during a refactor: drop an argument from a call and an optional parameter stays silent while the call now means something different.',
            'Đo được: đúng một lỗi, <code>error TS2554: Expected 1 arguments, but got 0.</code> ở dòng <code>g()</code>. Dấu <code>?</code> nói về <b>chỗ gọi</b> — tham số này có được bỏ qua không — còn <code>| undefined</code> nói về <b>kiểu</b>: tham số vẫn bắt buộc, chỉ là <code>undefined</code> tình cờ là một giá trị hợp lệ của nó. Dùng <code>?</code> khi việc bỏ qua thật sự hợp lệ; dùng union tường minh khi người gọi buộc phải quyết định và nói ra quyết định đó. Khác biệt này trở nên vô hình mà nguy hiểm lúc tái cấu trúc: bỏ một tham số khỏi lời gọi thì tham số tuỳ chọn im re trong khi lời gọi đã mang nghĩa khác.',
          ),
        }),

        mcq({
          prompt: B(
            'Where exactly does the error land, and what does it say?' + code(
              'function sum(...nums: number[]): number {\n' +
              '  return nums.reduce((a, b) => a + b, 0);\n' +
              '}\n' +
              "sum(1, 2, 'x');",
            ),
            'Lỗi rơi vào đúng chỗ nào, và nói gì?' + code(
              'function sum(...nums: number[]): number {\n' +
              '  return nums.reduce((a, b) => a + b, 0);\n' +
              '}\n' +
              "sum(1, 2, 'x');",
            ),
          ),
          options: [
            B(
              'On the third argument: TS2345 "Argument of type &#39;string&#39; is not assignable to parameter of type &#39;number&#39;"',
              'Ngay tham số thứ ba: TS2345 "Argument of type &#39;string&#39; is not assignable to parameter of type &#39;number&#39;"',
            ),
            B(
              'On the whole call: TS2554, because a rest parameter fixes the arity at whatever the first call used',
              'Trên toàn lời gọi: TS2554, vì tham số rest chốt số lượng tham số theo lời gọi đầu tiên',
            ),
            B(
              'Inside <code>reduce</code>: the rest array is <code>(string | number)[]</code>, so <code>a + b</code> is the line that fails',
              'Bên trong <code>reduce</code>: mảng rest là <code>(string | number)[]</code>, nên <code>a + b</code> mới là dòng hỏng',
            ),
            B(
              'Nowhere — a rest parameter accepts any arguments and only the array annotation on <code>nums</code> is checked',
              'Không đâu cả — tham số rest nhận mọi tham số và chỉ chú thích mảng trên <code>nums</code> được kiểm',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: <code>sum.ts(4,11): error TS2345: Argument of type &#39;string&#39; is not assignable to parameter of type &#39;number&#39;.</code> — column 11 is the <code>&#39;x&#39;</code> itself. A rest parameter is not a hole in the type system: every extra argument is checked one by one against the element type, so <code>sum(1, 2)</code> and <code>sum(1, 2, 3, 4)</code> both pass while the string is rejected at its own position. Like optional parameters, a rest parameter must come last.',
            'Đo được: <code>sum.ts(4,11): error TS2345: Argument of type &#39;string&#39; is not assignable to parameter of type &#39;number&#39;.</code> — cột 11 chính là chữ <code>&#39;x&#39;</code>. Tham số rest không phải một lỗ hổng trong hệ kiểu: từng tham số thừa đều bị kiểm lần lượt với kiểu phần tử, nên <code>sum(1, 2)</code> và <code>sum(1, 2, 3, 4)</code> đều qua trong khi chuỗi bị bắt ngay tại vị trí của nó. Giống tham số tuỳ chọn, tham số rest bắt buộc phải đứng cuối.',
          ),
        }),

        mcq({
          prompt: B(
            '<code>Array.prototype.map</code> passes three arguments to its callback. Which of these two lines does <code>tsc --strict</code> reject, and why?' + code(
              'const xs = [1, 2, 3];\n' +
              'xs.map((v) => v * 2);                    // A\n' +
              'xs.map((v, i, all, extra) => v);         // B',
            ),
            '<code>Array.prototype.map</code> truyền ba tham số vào callback. <code>tsc --strict</code> từ chối dòng nào trong hai dòng sau, và vì sao?' + code(
              'const xs = [1, 2, 3];\n' +
              'xs.map((v) => v * 2);                    // A\n' +
              'xs.map((v, i, all, extra) => v);         // B',
            ),
          ),
          options: [
            B(
              'A — a callback must declare every parameter the caller will pass, so ignoring <code>index</code> and <code>array</code> is an error',
              'A — callback phải khai báo đủ mọi tham số mà bên gọi sẽ truyền, nên bỏ qua <code>index</code> và <code>array</code> là lỗi',
            ),
            B(
              'B — TS2345, "Target signature provides too few arguments. Expected 4 or more, but got 3"',
              'B — TS2345, "Target signature provides too few arguments. Expected 4 or more, but got 3"',
            ),
            B(
              'Both, for opposite reasons: A is too narrow for <code>map</code> and B is too wide for it',
              'Cả hai, vì hai lý do trái ngược: A quá hẹp so với <code>map</code> còn B quá rộng',
            ),
            B(
              'Neither — extra callback parameters simply receive <code>undefined</code>, exactly as in plain JavaScript',
              'Không dòng nào — tham số callback thừa chỉ nhận <code>undefined</code>, y hệt JavaScript thuần',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: line B produces <code>TS2345 … Target signature provides too few arguments. Expected 4 or more, but got 3.</code> (plus four <code>TS7006</code> notices, because with no contextual type left the parameters become implicit <code>any</code>). The rule is asymmetric on purpose: taking FEWER parameters than are offered is always safe — ignoring an argument cannot break anything — while taking MORE means the extra one would read <code>undefined</code>, so the compiler refuses. That asymmetry is why <code>arr.map(x =&gt; x * 2)</code> is legal at all, and it is the same rule that lets <code>[&#39;1&#39;,&#39;2&#39;,&#39;3&#39;].map(parseInt)</code> type-check while returning <code>[1, NaN, NaN]</code>.',
            'Đo được: dòng B ra <code>TS2345 … Target signature provides too few arguments. Expected 4 or more, but got 3.</code> (kèm bốn thông báo <code>TS7006</code>, vì không còn kiểu ngữ cảnh nên các tham số thành <code>any</code> ngầm). Quy tắc lệch một chiều là có chủ ý: nhận ÍT tham số hơn số được đưa thì luôn an toàn — bỏ qua một tham số không làm hỏng gì — còn nhận NHIỀU hơn thì tham số thừa sẽ đọc phải <code>undefined</code>, nên trình biên dịch từ chối. Chính sự lệch ấy khiến <code>arr.map(x =&gt; x * 2)</code> hợp lệ, và cũng chính nó khiến <code>[&#39;1&#39;,&#39;2&#39;,&#39;3&#39;].map(parseInt)</code> qua được kiểm kiểu trong khi trả về <code>[1, NaN, NaN]</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'What does <code>tsc 5.9.3</code> print for the last line?' + code(
              'function len(x: string): number;\n' +
              'function len(x: unknown[]): number;\n' +
              'function len(x: string | unknown[]): number {\n' +
              '  return x.length;\n' +
              '}\n' +
              'len(42);',
            ),
            '<code>tsc 5.9.3</code> in ra gì cho dòng cuối?' + code(
              'function len(x: string): number;\n' +
              'function len(x: unknown[]): number;\n' +
              'function len(x: string | unknown[]): number {\n' +
              '  return x.length;\n' +
              '}\n' +
              'len(42);',
            ),
          ),
          options: [
            B(
              'Nothing — the third signature is public too, and <code>number</code> is assignable to <code>string | unknown[]</code> by widening',
              'Không gì cả — chữ ký thứ ba cũng là chữ ký công khai, và <code>number</code> gán được cho <code>string | unknown[]</code> nhờ nới kiểu',
            ),
            B(
              'TS2554 "Expected 1 arguments, but got 1" pointing at the implementation signature',
              'TS2554 "Expected 1 arguments, but got 1" chỉ vào chữ ký cài đặt',
            ),
            B(
              'TS2769 "No overload matches this call", then one indented block per overload: "Overload 1 of 2, &#39;(x: string): number&#39;, gave the following error." and the same for overload 2',
              'TS2769 "No overload matches this call", rồi một khối thụt lề cho mỗi overload: "Overload 1 of 2, &#39;(x: string): number&#39;, gave the following error." và tương tự cho overload 2',
            ),
            B(
              'TS2345 naming only the implementation signature, because that is the one the compiler actually calls',
              'TS2345 chỉ nêu chữ ký cài đặt, vì đó mới là chữ ký trình biên dịch thật sự gọi tới',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured on 5.9.3, verbatim: <code>TS2769: No overload matches this call.</code> then <code>Overload 1 of 2, &#39;(x: string): number&#39;, gave the following error. / Argument of type &#39;number&#39; is not assignable to parameter of type &#39;string&#39;.</code> and the matching block for overload 2. ⚠️ The course prints the shorter form ("The last overload gave the following error.") — that wording appears when there are more overloads than the compiler is willing to list; with exactly two it names both. The other thing to remember: the implementation signature is NOT callable, so <code>len</code> has two public shapes, not three.',
            'Đo trên 5.9.3, nguyên văn: <code>TS2769: No overload matches this call.</code> rồi <code>Overload 1 of 2, &#39;(x: string): number&#39;, gave the following error. / Argument of type &#39;number&#39; is not assignable to parameter of type &#39;string&#39;.</code> và khối tương ứng cho overload 2. ⚠️ Giáo trình in bản ngắn hơn ("The last overload gave the following error.") — cách viết đó xuất hiện khi số overload nhiều hơn mức trình biên dịch chịu liệt kê; với đúng hai cái thì nó nêu cả hai. Điều còn lại phải nhớ: chữ ký CÀI ĐẶT KHÔNG gọi được, nên <code>len</code> có hai hình dạng công khai chứ không phải ba.',
          ),
        }),

        mcq({
          prompt: B(
            'Two <code>this</code> problems in one file. Which pair of errors does <code>tsc --strict</code> report?' + code(
              'function whoAmI() {\n' +
              '  return this.name;                 // A\n' +
              '}\n' +
              '\n' +
              'interface Box { value: number }\n' +
              'function reset(this: Box) { this.value = 0; }\n' +
              'reset();                            // B',
            ),
            'Hai vấn đề về <code>this</code> trong một file. <code>tsc --strict</code> báo cặp lỗi nào?' + code(
              'function whoAmI() {\n' +
              '  return this.name;                 // A\n' +
              '}\n' +
              '\n' +
              'interface Box { value: number }\n' +
              'function reset(this: Box) { this.value = 0; }\n' +
              'reset();                            // B',
            ),
          ),
          options: [
            B(
              'A: TS7006 (implicit any parameter) · B: nothing, because <code>this</code> is erased and never checked at the call site',
              'A: TS7006 (tham số any ngầm) · B: không lỗi, vì <code>this</code> bị xoá và không bao giờ được kiểm ở chỗ gọi',
            ),
            B(
              'A: nothing under strict · B: TS2554, since the <code>this</code> parameter counts as a required first argument',
              'A: không lỗi dưới strict · B: TS2554, vì tham số <code>this</code> được tính là tham số thứ nhất bắt buộc',
            ),
            B(
              'A: TS2683 · B: TS2684, but only if you also enable <code>strictBindCallApply</code> on top of <code>strict</code>',
              'A: TS2683 · B: TS2684, nhưng chỉ khi bật thêm <code>strictBindCallApply</code> ngoài <code>strict</code>',
            ),
            B(
              'A: TS2683 "&#39;this&#39; implicitly has type &#39;any&#39;…" · B: TS2684 "The &#39;this&#39; context of type &#39;void&#39; is not assignable to method&#39;s &#39;this&#39; of type &#39;Box&#39;"',
              'A: TS2683 "&#39;this&#39; implicitly has type &#39;any&#39;…" · B: TS2684 "The &#39;this&#39; context of type &#39;void&#39; is not assignable to method&#39;s &#39;this&#39; of type &#39;Box&#39;"',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Both measured, in one run: <code>TS2683: &#39;this&#39; implicitly has type &#39;any&#39; because it does not have a type annotation.</code> and <code>TS2684: The &#39;this&#39; context of type &#39;void&#39; is not assignable to method&#39;s &#39;this&#39; of type &#39;Box&#39;.</code> — both come from <code>noImplicitThis</code>, which is part of <code>strict</code>, with no extra flag needed. The <code>this</code> parameter is a fake first parameter: it never appears in an argument list, never appears in the emitted JavaScript, and exists only so the compiler can check the calling context. Calling <code>reset()</code> bare gives it a <code>this</code> of <code>void</code>; it would have to be <code>box.reset()</code> or <code>reset.call(box)</code>.',
            'Cả hai đều đo được trong một lượt chạy: <code>TS2683: &#39;this&#39; implicitly has type &#39;any&#39; because it does not have a type annotation.</code> và <code>TS2684: The &#39;this&#39; context of type &#39;void&#39; is not assignable to method&#39;s &#39;this&#39; of type &#39;Box&#39;.</code> — cả hai đến từ <code>noImplicitThis</code>, vốn nằm trong <code>strict</code>, không cần bật thêm cờ nào. Tham số <code>this</code> là một tham số giả: nó không bao giờ xuất hiện trong danh sách đối số, không xuất hiện trong JavaScript sinh ra, và chỉ tồn tại để trình biên dịch kiểm được ngữ cảnh gọi. Gọi trơ <code>reset()</code> thì <code>this</code> của nó là <code>void</code>; phải viết <code>box.reset()</code> hoặc <code>reset.call(box)</code>.',
          ),
        }),

        // ── Chương 4 — Object, interface & type alias ───────────────────
        mcq({
          prompt: B(
            'What is the error, and which type name does it point at?' + code(
              'interface Note { title: string; body: string }\n' +
              "const n: Note = { title: 'Hi' };",
            ),
            'Lỗi là gì, và nó chỉ vào tên kiểu nào?' + code(
              'interface Note { title: string; body: string }\n' +
              "const n: Note = { title: 'Hi' };",
            ),
          ),
          options: [
            B(
              'TS2741 "Property &#39;body&#39; is missing in type &#39;{ title: string; }&#39; but required in type &#39;Note&#39;"',
              'TS2741 "Property &#39;body&#39; is missing in type &#39;{ title: string; }&#39; but required in type &#39;Note&#39;"',
            ),
            B(
              'TS2353 "Object literal may only specify known properties" — the literal is checked against <code>Note</code> both ways at once',
              'TS2353 "Object literal may only specify known properties" — object literal bị kiểm hai chiều với <code>Note</code> cùng lúc',
            ),
            B(
              'TS18048, because <code>n.body</code> is treated as possibly undefined until it is assigned',
              'TS18048, vì <code>n.body</code> bị coi là có thể undefined cho tới khi được gán',
            ),
            B(
              'No error: a missing property is filled with <code>undefined</code>, and the excess-property check only looks for extra keys',
              'Không lỗi: thuộc tính thiếu được điền <code>undefined</code>, còn phép kiểm thuộc tính thừa chỉ soi các khoá dư ra',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: <code>error TS2741: Property &#39;body&#39; is missing in type &#39;{ title: string; }&#39; but required in type &#39;Note&#39;.</code>. Note how the message names both sides — the shape you wrote and the shape that was required — which is what makes these errors readable once you know where to look. TS2353 is the neighbouring rule for EXTRA keys, and it only fires on a fresh object literal; route the same literal through an untyped variable first and the excess-property check disappears entirely.',
            'Đo được: <code>error TS2741: Property &#39;body&#39; is missing in type &#39;{ title: string; }&#39; but required in type &#39;Note&#39;.</code>. Chú ý thông báo nêu cả hai phía — hình dạng bạn viết và hình dạng được đòi hỏi — chính điều đó làm những lỗi kiểu này dễ đọc một khi bạn biết nhìn vào đâu. TS2353 là quy tắc hàng xóm dành cho khoá THỪA, và nó chỉ nổ trên một object literal tươi; cho đúng literal ấy đi qua một biến không chú thích kiểu trước thì phép kiểm thuộc tính thừa biến mất hoàn toàn.',
          ),
        }),

        mcq({
          prompt: B(
            'How many errors, and where?' + code(
              'interface Note { title: string; summary?: string }\n' +
              'function show(n: Note) { return n.summary.length; }        // A\n' +
              '\n' +
              'interface Ro { readonly id: string; title: string }\n' +
              "const r: Ro = { id: 'n1', title: 'Hi' };                   // B\n" +
              "r.id = 'n2';                                               // C",
            ),
            'Bao nhiêu lỗi, và ở đâu?' + code(
              'interface Note { title: string; summary?: string }\n' +
              'function show(n: Note) { return n.summary.length; }        // A\n' +
              '\n' +
              'interface Ro { readonly id: string; title: string }\n' +
              "const r: Ro = { id: 'n1', title: 'Hi' };                   // B\n" +
              "r.id = 'n2';                                               // C",
            ),
          ),
          options: [
            B(
              'Three: A, B and C — a <code>readonly</code> property cannot even be set in the initialiser',
              'Ba lỗi: A, B và C — thuộc tính <code>readonly</code> đến cả lúc khởi tạo cũng không đặt được',
            ),
            B(
              'Two: TS18048 on A ("&#39;n.summary&#39; is possibly &#39;undefined&#39;") and TS2540 on C ("Cannot assign to &#39;id&#39; because it is a read-only property")',
              'Hai lỗi: TS18048 ở A ("&#39;n.summary&#39; is possibly &#39;undefined&#39;") và TS2540 ở C ("Cannot assign to &#39;id&#39; because it is a read-only property")',
            ),
            B(
              'One, on C only — an optional property is simply absent, so reading <code>.length</code> off it is allowed',
              'Một lỗi, chỉ ở C — thuộc tính tuỳ chọn đơn giản là vắng mặt, nên đọc <code>.length</code> của nó vẫn được phép',
            ),
            B(
              'One, on A only — <code>readonly</code> is erased at compile time, so line C is a runtime concern and not a type error',
              'Một lỗi, chỉ ở A — <code>readonly</code> bị xoá lúc biên dịch, nên dòng C là chuyện lúc chạy chứ không phải lỗi kiểu',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured, exactly two: <code>TS18048: &#39;n.summary&#39; is possibly &#39;undefined&#39;.</code> and <code>TS2540: Cannot assign to &#39;id&#39; because it is a read-only property.</code>. <code>readonly</code> allows the value to be set when the object is created (line B is fine) and forbids every later assignment — a compile-time guarantee that is indeed erased from the emitted JavaScript, but that is not the same as "not a type error": the check happens everywhere the type is used, which is where it matters. An optional property behaves exactly like an optional parameter: its type inside the code is <code>string | undefined</code>.',
            'Đo được, đúng hai lỗi: <code>TS18048: &#39;n.summary&#39; is possibly &#39;undefined&#39;.</code> và <code>TS2540: Cannot assign to &#39;id&#39; because it is a read-only property.</code>. <code>readonly</code> cho phép đặt giá trị lúc tạo object (dòng B không sao) và cấm mọi phép gán về sau — một bảo đảm lúc biên dịch, đúng là bị xoá khỏi JavaScript sinh ra, nhưng "bị xoá" không đồng nghĩa "không phải lỗi kiểu": phép kiểm diễn ra ở mọi nơi kiểu ấy được dùng, và đó mới là chỗ nó có ích. Thuộc tính tuỳ chọn hành xử y như tham số tuỳ chọn: kiểu của nó trong mã là <code>string | undefined</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Someone tries to name a union with an interface. What happens?' + code(
              'interface ID = string | number;',
            ),
            'Có người thử đặt tên cho một union bằng interface. Chuyện gì xảy ra?' + code(
              'interface ID = string | number;',
            ),
          ),
          options: [
            B(
              'It compiles, and <code>ID</code> behaves exactly like the equivalent <code>type</code> alias',
              'Nó biên dịch được, và <code>ID</code> hành xử y hệt một <code>type</code> alias tương đương',
            ),
            B(
              'TS2300 "Duplicate identifier" — the interface silently merges with the built-in <code>ID</code> declaration',
              'TS2300 "Duplicate identifier" — interface này âm thầm hợp nhất với khai báo <code>ID</code> có sẵn',
            ),
            B(
              'A syntax error: TS1005 "&#39;{&#39; expected" — an interface body is braces, and only <code>type</code> can name a union',
              'Lỗi cú pháp: TS1005 "&#39;{&#39; expected" — thân interface là cặp ngoặc nhọn, và chỉ <code>type</code> mới đặt tên được cho union',
            ),
            B(
              'It compiles but <code>ID</code> resolves to <code>unknown</code>, because an interface has no way to represent a union',
              'Nó biên dịch được nhưng <code>ID</code> thành ra <code>unknown</code>, vì interface không có cách biểu diễn union',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured: <code>error TS1005: &#39;{&#39; expected.</code> — the parser stops at the equals sign. This is the one practical difference that settles the "interface or type?" argument: an <code>interface</code> can only describe an object or function shape, while a <code>type</code> alias can name anything — a union, a literal, a tuple, a primitive alias. From chapter 5 on you need unions constantly, so the working rule is "interface for object shapes, type for everything else". The other real difference goes the other way: two interfaces with the same name MERGE, while two type aliases collide with TS2300.',
            'Đo được: <code>error TS1005: &#39;{&#39; expected.</code> — bộ phân tích cú pháp dừng ngay ở dấu bằng. Đây là khác biệt thực dụng chấm dứt cuộc tranh cãi "interface hay type?": <code>interface</code> chỉ mô tả được hình dạng object hoặc hàm, còn <code>type</code> alias đặt tên được cho mọi thứ — union, literal, tuple, hay một tên khác của primitive. Từ chương 5 trở đi bạn cần union liên tục, nên quy tắc làm việc là "interface cho hình dạng object, type cho mọi thứ còn lại". Khác biệt thật còn lại thì đi theo chiều ngược: hai interface trùng tên sẽ HỢP NHẤT, còn hai type alias trùng tên đụng nhau với TS2300.',
          ),
        }),

        mcq({
          prompt: B(
            'Where does the compiler put the error, and what does that buy you over writing <code>type B = A &amp; { id: number }</code>?' + code(
              'interface A { id: string }\n' +
              'interface B extends A { id: number }',
            ),
            'Trình biên dịch đặt lỗi ở đâu, và điều đó lợi gì so với viết <code>type B = A &amp; { id: number }</code>?' + code(
              'interface A { id: string }\n' +
              'interface B extends A { id: number }',
            ),
          ),
          options: [
            B(
              'No error at all — <code>extends</code> lets a child narrow a parent property to any other type it likes',
              'Không lỗi gì — <code>extends</code> cho phép con thu hẹp thuộc tính của cha về bất kỳ kiểu nào nó thích',
            ),
            B(
              'TS2320 at the first place a <code>B</code> is constructed, which is the same behaviour the intersection gives',
              'TS2320 tại chỗ đầu tiên có ai đó tạo ra một <code>B</code>, tức hành vi giống hệt phép giao',
            ),
            B(
              'TS2322 at the declaration, saying that <code>id</code> resolves to <code>never</code> and can therefore never be filled',
              'TS2322 ngay tại khai báo, nói rằng <code>id</code> ra <code>never</code> nên không bao giờ điền được',
            ),
            B(
              'TS2430 on the declaration line — "Interface &#39;B&#39; incorrectly extends interface &#39;A&#39;" — so the conflict is reported where it was written, not at some innocent call site later',
              'TS2430 ngay dòng khai báo — "Interface &#39;B&#39; incorrectly extends interface &#39;A&#39;" — nên xung đột được báo ở đúng chỗ viết ra nó, chứ không phải ở một chỗ gọi vô tội nào đó sau này',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured: <code>error TS2430: Interface &#39;B&#39; incorrectly extends interface &#39;A&#39;. Types of property &#39;id&#39; are incompatible. Type &#39;number&#39; is not assignable to type &#39;string&#39;.</code> — on line 2, the declaration itself. The intersection spelling has the same conflict but reports it very differently: <code>type C = { id: string } &amp; { id: number }</code> compiles in silence, because <code>C[&#39;id&#39;]</code> quietly becomes <code>string &amp; number</code>, which is <code>never</code>. Nothing complains until somebody tries to build a <code>C</code>, and the message there talks about <code>never</code> on a line that is perfectly correct. When you are composing object shapes and want conflicts to be loud, use <code>interface … extends</code>.',
            'Đo được: <code>error TS2430: Interface &#39;B&#39; incorrectly extends interface &#39;A&#39;. Types of property &#39;id&#39; are incompatible. Type &#39;number&#39; is not assignable to type &#39;string&#39;.</code> — ở dòng 2, tức chính khai báo. Cách viết bằng phép giao có đúng xung đột ấy nhưng báo theo kiểu rất khác: <code>type C = { id: string } &amp; { id: number }</code> biên dịch im lặng, vì <code>C[&#39;id&#39;]</code> âm thầm thành <code>string &amp; number</code>, tức là <code>never</code>. Không ai kêu ca gì cho tới khi có người thử dựng một <code>C</code>, và thông báo ở đó lại nói về <code>never</code> trên một dòng hoàn toàn đúng. Khi ghép các hình dạng object mà muốn xung đột nổ to, hãy dùng <code>interface … extends</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Exactly one of these three lines is an error. Which one, and what does that reveal about index signatures?' + code(
              'interface Scores { [subject: string]: number }\n' +
              'const s: Scores = { math: 9 };\n' +
              's.chem = 10;                 // A\n' +
              "s.chem = 'A';                // B\n" +
              'const x = s.spelledWrong;    // C',
            ),
            'Đúng một trong ba dòng sau là lỗi. Dòng nào, và điều đó cho thấy gì về index signature?' + code(
              'interface Scores { [subject: string]: number }\n' +
              'const s: Scores = { math: 9 };\n' +
              's.chem = 10;                 // A\n' +
              "s.chem = 'A';                // B\n" +
              'const x = s.spelledWrong;    // C',
            ),
          ),
          options: [
            B(
              'B — TS2322. Line C compiles: an index signature makes every string key readable, so <code>x</code> is typed <code>number</code> while being <code>undefined</code> at runtime',
              'B — TS2322. Dòng C biên dịch được: index signature khiến mọi khoá chuỗi đều đọc được, nên <code>x</code> mang kiểu <code>number</code> trong khi lúc chạy là <code>undefined</code>',
            ),
            B(
              'C — TS2339, because <code>spelledWrong</code> was never one of the declared keys of <code>Scores</code>',
              'C — TS2339, vì <code>spelledWrong</code> chưa từng là một trong các khoá đã khai báo của <code>Scores</code>',
            ),
            B(
              'A — an index signature describes reads only, so writing a brand-new key needs a widening cast first',
              'A — index signature chỉ mô tả việc ĐỌC, nên ghi một khoá hoàn toàn mới thì phải ép nới kiểu trước',
            ),
            B(
              'B — but only because the object literal on line 2 fixed the key set to <code>math</code> alone',
              'B — nhưng chỉ vì object literal ở dòng 2 đã chốt tập khoá chỉ còn <code>math</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: a single <code>error TS2322: Type &#39;string&#39; is not assignable to type &#39;number&#39;.</code> on line B. That is the whole trade of an index signature: total flexibility on the KEY, strictness on the VALUE — and therefore no typo protection at all. Line C is the dangerous half: <code>x</code> has type <code>number</code>, so <code>x + 1</code> compiles and evaluates to <code>NaN</code>, which then propagates silently through every arithmetic step downstream. Two ways out: turn on <code>noUncheckedIndexedAccess</code> so an index read becomes <code>number | undefined</code>, or close the key set with <code>Record&lt;&#39;math&#39; | &#39;chem&#39;, number&gt;</code> so the compiler can prove every key is present.',
            'Đo được: đúng một lỗi <code>error TS2322: Type &#39;string&#39; is not assignable to type &#39;number&#39;.</code> ở dòng B. Đó là toàn bộ sự đánh đổi của index signature: thoải mái hoàn toàn ở KHOÁ, nghiêm khắc ở GIÁ TRỊ — và vì thế không có chút bảo vệ nào trước lỗi gõ nhầm. Dòng C mới là nửa nguy hiểm: <code>x</code> mang kiểu <code>number</code>, nên <code>x + 1</code> biên dịch được và cho ra <code>NaN</code>, rồi <code>NaN</code> ấy lan âm thầm qua mọi phép tính phía sau. Hai lối ra: bật <code>noUncheckedIndexedAccess</code> để phép đọc theo chỉ số thành <code>number | undefined</code>, hoặc đóng tập khoá lại bằng <code>Record&lt;&#39;math&#39; | &#39;chem&#39;, number&gt;</code> để trình biên dịch chứng minh được mọi khoá đều có mặt.',
          ),
        }),

        // ── Chương 5 — Union, literal & narrowing ───────────────────────
        mcq({
          prompt: B(
            'What are the two lines of this error, and why is the second line the useful one?' + code(
              'function format(id: string | number) {\n' +
              '  return id.toUpperCase();\n' +
              '}',
            ),
            'Lỗi này gồm hai dòng nào, và vì sao dòng thứ hai mới là dòng hữu ích?' + code(
              'function format(id: string | number) {\n' +
              '  return id.toUpperCase();\n' +
              '}',
            ),
          ),
          options: [
            B(
              'TS2551 with a "Did you mean &#39;toLocaleUpperCase&#39;?" suggestion, then the location of the declaration',
              'TS2551 kèm gợi ý "Did you mean &#39;toLocaleUpperCase&#39;?", rồi vị trí của khai báo',
            ),
            B(
              'TS2339 "Property &#39;toUpperCase&#39; does not exist on type &#39;string | number&#39;", then "Property &#39;toUpperCase&#39; does not exist on type &#39;number&#39;" — naming the member of the union that fails',
              'TS2339 "Property &#39;toUpperCase&#39; does not exist on type &#39;string | number&#39;", rồi "Property &#39;toUpperCase&#39; does not exist on type &#39;number&#39;" — nêu đích danh thành viên nào của union hỏng',
            ),
            B(
              'TS2345, then a note that the union should have been written as an intersection instead',
              'TS2345, rồi một ghi chú rằng lẽ ra union này phải viết thành phép giao',
            ),
            B(
              'TS18046, then a note that the value must be cast with <code>as string</code> before any method call',
              'TS18046, rồi một ghi chú rằng phải ép <code>as string</code> trước khi gọi bất kỳ phương thức nào',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured, both lines: <code>error TS2339: Property &#39;toUpperCase&#39; does not exist on type &#39;string | number&#39;.</code> then, indented, <code>Property &#39;toUpperCase&#39; does not exist on type &#39;number&#39;.</code>. Before you narrow, a union only offers the members that EVERY branch has — and the indented line is the compiler telling you exactly which branch is missing it, which is where you look first in a five-member union. The fix is a <code>typeof</code> check, not a cast: inside <code>if (typeof id === &#39;string&#39;)</code> the type shrinks to <code>string</code> and the method appears.',
            'Đo được, cả hai dòng: <code>error TS2339: Property &#39;toUpperCase&#39; does not exist on type &#39;string | number&#39;.</code> rồi, thụt vào, <code>Property &#39;toUpperCase&#39; does not exist on type &#39;number&#39;.</code>. Trước khi thu hẹp, một union chỉ cho dùng những thành viên mà MỌI nhánh đều có — và dòng thụt vào chính là trình biên dịch chỉ đích danh nhánh nào thiếu, đó là chỗ bạn nhìn đầu tiên khi union có năm thành viên. Cách sửa là một phép kiểm <code>typeof</code>, không phải ép kiểu: bên trong <code>if (typeof id === &#39;string&#39;)</code> kiểu co lại thành <code>string</code> và phương thức hiện ra.',
          ),
        }),

        mcq({
          prompt: B(
            'What does the compiler say, and what does the message quote?' + code(
              "type Status = 'draft' | 'published' | 'archived';\n" +
              "let s: Status = 'deleted';",
            ),
            'Trình biên dịch nói gì, và thông báo trích dẫn cái gì?' + code(
              "type Status = 'draft' | 'published' | 'archived';\n" +
              "let s: Status = 'deleted';",
            ),
          ),
          options: [
            B(
              'Nothing — <code>let</code> widens the initialiser to <code>string</code>, and <code>string</code> covers all three members',
              'Không lỗi — <code>let</code> nới giá trị khởi tạo thành <code>string</code>, mà <code>string</code> bao trùm cả ba thành viên',
            ),
            B(
              'TS2345 "Argument of type &#39;string&#39; is not assignable…", because a literal union is checked like a function parameter',
              'TS2345 "Argument of type &#39;string&#39; is not assignable…", vì union literal được kiểm như một tham số hàm',
            ),
            B(
              'TS2322 "Type &#39;&quot;deleted&quot;&#39; is not assignable to type &#39;Status&#39;" — the message quotes the literal type, not <code>string</code>',
              'TS2322 "Type &#39;&quot;deleted&quot;&#39; is not assignable to type &#39;Status&#39;" — thông báo trích đúng kiểu literal, không phải <code>string</code>',
            ),
            B(
              'TS2367 "This comparison appears to be unintentional", the same code you get for comparing two disjoint literal types',
              'TS2367 "This comparison appears to be unintentional", đúng mã lỗi khi so sánh hai kiểu literal rời nhau',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured: <code>error TS2322: Type &#39;&quot;deleted&quot;&#39; is not assignable to type &#39;Status&#39;.</code>. The quoted <code>&quot;deleted&quot;</code> is the point — the value keeps its literal type long enough to be checked against the union, which is how a typo like <code>&#39;pubished&#39;</code> becomes a compile error instead of a value that silently breaks a filter three modules away. Note what the annotation is doing: <code>let s: Status</code> pins the type, so no widening happens. Drop the annotation — <code>let s = &#39;draft&#39;</code> — and the type becomes plain <code>string</code>, and it no longer fits <code>Status</code> anywhere.',
            'Đo được: <code>error TS2322: Type &#39;&quot;deleted&quot;&#39; is not assignable to type &#39;Status&#39;.</code>. Chữ <code>&quot;deleted&quot;</code> trong dấu nháy mới là điểm mấu chốt — giá trị giữ được kiểu literal của nó đủ lâu để đem đối chiếu với union, và nhờ vậy một lỗi gõ như <code>&#39;pubished&#39;</code> thành lỗi biên dịch chứ không phải một giá trị âm thầm làm hỏng bộ lọc ở ba module sau. Để ý chú thích kiểu đang làm gì: <code>let s: Status</code> ghim kiểu lại nên không có chuyện nới rộng. Bỏ chú thích đi — <code>let s = &#39;draft&#39;</code> — thì kiểu thành <code>string</code> trơn, và nó không còn vừa với <code>Status</code> ở bất cứ đâu.',
          ),
        }),

        mcq({
          prompt: B(
            'This compiles cleanly. Which narrowing rule is doing the work, and what is its weakness?' + code(
              "type Admin = { role: 'admin'; permissions: string[] };\n" +
              "type Guest = { role: 'guest' };\n" +
              '\n' +
              'function canDelete(u: Admin | Guest): boolean {\n' +
              "  if ('permissions' in u) return u.permissions.includes('delete');\n" +
              '  return false;\n' +
              '}',
            ),
            'Đoạn này biên dịch sạch. Quy tắc thu hẹp kiểu nào đang làm việc, và điểm yếu của nó là gì?' + code(
              "type Admin = { role: 'admin'; permissions: string[] };\n" +
              "type Guest = { role: 'guest' };\n" +
              '\n' +
              'function canDelete(u: Admin | Guest): boolean {\n' +
              "  if ('permissions' in u) return u.permissions.includes('delete');\n" +
              '  return false;\n' +
              '}',
            ),
          ),
          options: [
            B(
              '<code>typeof</code> narrowing — it fails as soon as a variant becomes a class instance rather than a plain object',
              'Thu hẹp bằng <code>typeof</code> — nó hỏng ngay khi một biến thể trở thành instance của class thay vì object thuần',
            ),
            B(
              'Truthiness narrowing on <code>u.permissions</code> — it fails when the array is empty, because an empty array is falsy',
              'Thu hẹp theo tính đúng-sai của <code>u.permissions</code> — nó hỏng khi mảng rỗng, vì mảng rỗng là falsy',
            ),
            B(
              'Equality narrowing on <code>u.role</code> — it fails whenever the discriminant is declared as <code>string</code>',
              'Thu hẹp bằng so sánh <code>u.role</code> — nó hỏng bất cứ khi nào trường phân biệt được khai là <code>string</code>',
            ),
            B(
              'The <code>in</code> operator keeps only the union members that declare that key — it is fragile because adding a second variant with a <code>permissions</code> field makes the branch silently catch two things',
              'Toán tử <code>in</code> chỉ giữ lại những thành viên union có khai khoá đó — nó mong manh vì thêm một biến thể nữa cũng có trường <code>permissions</code> là nhánh ấy âm thầm bắt luôn hai thứ',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Verified: exit code 0. <code>&#39;permissions&#39; in u</code> keeps only the union members that declare that property, so inside the branch <code>u</code> is <code>Admin</code> and the array is available. It works, and it is the weakest of the narrowing forms: it depends on which keys happen to be unique today. <code>typeof</code> only splits primitives (both variants here answer <code>&#39;object&#39;</code>), truthiness would not tell the two shapes apart at all, and equality on <code>u.role</code> would work — which is the point of the next lesson: give every variant the same literal-typed tag and narrow on that instead. A discriminant stays exact as variants are added; <code>in</code> does not.',
            'Đã kiểm: mã thoát 0. <code>&#39;permissions&#39; in u</code> chỉ giữ lại những thành viên union có khai thuộc tính đó, nên trong nhánh ấy <code>u</code> là <code>Admin</code> và mảng dùng được. Nó chạy, và nó là dạng thu hẹp yếu nhất: nó phụ thuộc vào chuyện hôm nay khoá nào tình cờ là duy nhất. <code>typeof</code> chỉ tách được primitive (ở đây cả hai biến thể đều trả lời <code>&#39;object&#39;</code>), thu hẹp theo đúng-sai thì không phân biệt nổi hai hình dạng, còn so sánh trên <code>u.role</code> thì được — và đó chính là ý của bài kế tiếp: cho mọi biến thể cùng một trường nhãn kiểu literal rồi thu hẹp theo trường đó. Trường phân biệt vẫn chính xác khi union mọc thêm biến thể; <code>in</code> thì không.',
          ),
        }),

        mcq({
          prompt: B(
            'What are the two lines of this error?' + code(
              'type Shape =\n' +
              "  | { kind: 'circle'; r: number }\n" +
              "  | { kind: 'square'; side: number };\n" +
              '\n' +
              'function area(shape: Shape) {\n' +
              '  return shape.r ** 2;\n' +
              '}',
            ),
            'Lỗi này gồm hai dòng nào?' + code(
              'type Shape =\n' +
              "  | { kind: 'circle'; r: number }\n" +
              "  | { kind: 'square'; side: number };\n" +
              '\n' +
              'function area(shape: Shape) {\n' +
              '  return shape.r ** 2;\n' +
              '}',
            ),
          ),
          options: [
            B(
              'TS2339 "Property &#39;r&#39; does not exist on type &#39;Shape&#39;", then "Property &#39;r&#39; does not exist on type &#39;{ kind: &quot;square&quot;; side: number; }&#39;"',
              'TS2339 "Property &#39;r&#39; does not exist on type &#39;Shape&#39;", rồi "Property &#39;r&#39; does not exist on type &#39;{ kind: &quot;square&quot;; side: number; }&#39;"',
            ),
            B(
              'TS2551 "Property &#39;r&#39; does not exist… Did you mean &#39;side&#39;?", because the two variants are structurally close enough to suggest',
              'TS2551 "Property &#39;r&#39; does not exist… Did you mean &#39;side&#39;?", vì hai biến thể đủ giống nhau về cấu trúc để gợi ý',
            ),
            B(
              'TS2322 saying that <code>Shape</code> is not assignable to <code>{ r: number }</code>, pointing at the parameter',
              'TS2322 nói <code>Shape</code> không gán được cho <code>{ r: number }</code>, chỉ vào tham số',
            ),
            B(
              'No error: <code>r</code> exists on one member, and reading a member that exists on at least one branch is allowed',
              'Không lỗi: <code>r</code> có trên một thành viên, và đọc thành viên nào tồn tại ở ít nhất một nhánh thì được phép',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured, both lines: <code>error TS2339: Property &#39;r&#39; does not exist on type &#39;Shape&#39;.</code> then <code>Property &#39;r&#39; does not exist on type &#39;{ kind: &quot;square&quot;; side: number; }&#39;.</code>. The indented line names the guilty variant — with five variants that is the difference between fixing it in ten seconds and reading the whole type. The fix is to check the discriminant first: inside <code>case &#39;circle&#39;</code> of a <code>switch (shape.kind)</code>, <code>shape.r</code> is available and <code>shape.side</code> is the error, and you never write a cast.',
            'Đo được, cả hai dòng: <code>error TS2339: Property &#39;r&#39; does not exist on type &#39;Shape&#39;.</code> rồi <code>Property &#39;r&#39; does not exist on type &#39;{ kind: &quot;square&quot;; side: number; }&#39;.</code>. Dòng thụt vào nêu đích danh biến thể có lỗi — với union năm biến thể thì đó là khác biệt giữa sửa trong mười giây và đọc lại cả cái kiểu. Cách sửa là kiểm trường phân biệt trước: bên trong <code>case &#39;circle&#39;</code> của một <code>switch (shape.kind)</code> thì <code>shape.r</code> dùng được còn <code>shape.side</code> mới là lỗi, và bạn không phải viết một phép ép kiểu nào.',
          ),
        }),

        mcq({
          prompt: B(
            'A third variant is added to <code>Shape</code>. Three versions of <code>area</code> handle only <code>circle</code> and <code>square</code> and differ only in their <code>default</code> branch. Which version does the compiler actually catch?' + code(
              "type Shape = { kind: 'circle'; r: number } | { kind: 'square'; side: number }\n" +
              "           | { kind: 'tri'; base: number };\n" +
              '\n' +
              'default: return 0;                                   // A\n' +
              'default: { const _e: never = s; return _e; }         // B\n' +
              "default: throw new Error('unknown kind');            // C",
            ),
            'Một biến thể thứ ba được thêm vào <code>Shape</code>. Ba phiên bản của <code>area</code> chỉ xử lý <code>circle</code> và <code>square</code>, khác nhau đúng ở nhánh <code>default</code>. Trình biên dịch thật sự bắt được phiên bản nào?' + code(
              "type Shape = { kind: 'circle'; r: number } | { kind: 'square'; side: number }\n" +
              "           | { kind: 'tri'; base: number };\n" +
              '\n' +
              'default: return 0;                                   // A\n' +
              'default: { const _e: never = s; return _e; }         // B\n' +
              "default: throw new Error('unknown kind');            // C",
            ),
          ),
          options: [
            B(
              'All three — once a union grows, every <code>switch</code> over it is re-checked for completeness',
              'Cả ba — hễ một union mọc thêm thành viên thì mọi <code>switch</code> trên nó đều bị kiểm lại xem đã đủ chưa',
            ),
            B(
              'Only B, with TS2322 "Type &#39;{ kind: &quot;tri&quot;; base: number; }&#39; is not assignable to type &#39;never&#39;" — A and C compile in silence',
              'Chỉ B, với TS2322 "Type &#39;{ kind: &quot;tri&quot;; base: number; }&#39; is not assignable to type &#39;never&#39;" — A và C biên dịch im lặng',
            ),
            B(
              'B and C — throwing in the default is enough, because an unreachable throw makes the value <code>never</code> as well',
              'B và C — ném lỗi ở default là đủ, vì một lệnh throw không tới được cũng làm giá trị thành <code>never</code>',
            ),
            B(
              'None — exhaustiveness checking needs the <code>noFallthroughCasesInSwitch</code> flag, which is not part of <code>strict</code>',
              'Không phiên bản nào — kiểm tính đầy đủ cần cờ <code>noFallthroughCasesInSwitch</code>, mà cờ này không nằm trong <code>strict</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'All three compiled in one run; exactly one error came out: <code>error TS2322: Type &#39;{ kind: &quot;tri&quot;; base: number; }&#39; is not assignable to type &#39;never&#39;.</code>, pointing at version B. Nothing about a <code>switch</code> is checked for completeness on its own — the check exists only because B <b>consumes the value at type <code>never</code></b>, and once a fourth possibility can reach the default, the value there is no longer <code>never</code>. Version A quietly returns 0 for every future variant, forever. Version C does tell you — at runtime, after it ships, and only if that path is exercised. If you want both, assert the type first and then throw: the compile error is the one that saves you.',
            'Cả ba được biên dịch trong một lượt; ra đúng một lỗi: <code>error TS2322: Type &#39;{ kind: &quot;tri&quot;; base: number; }&#39; is not assignable to type &#39;never&#39;.</code>, chỉ vào phiên bản B. Bản thân một <code>switch</code> không hề được kiểm xem đã đủ nhánh hay chưa — phép kiểm tồn tại chỉ vì B <b>tiêu thụ giá trị ở kiểu <code>never</code></b>, và khi có khả năng thứ tư chạm được tới default thì giá trị ở đó không còn là <code>never</code> nữa. Phiên bản A lặng lẽ trả 0 cho mọi biến thể tương lai, mãi mãi. Phiên bản C thì có báo — lúc chạy, sau khi đã phát hành, và chỉ khi nhánh đó bị đi qua. Muốn có cả hai thì khẳng định kiểu trước rồi mới ném: lỗi biên dịch mới là cái cứu bạn.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Prove it before you trust it (chapters 2 + 5).</b> A status arrives from outside the program, so its static type is <code>unknown</code>. Turn it into a value the rest of the code can rely on, without a single <code>as</code>.</p>' +
            '<p>Implement three things:</p>' +
            '<ul>' +
            '<li><code>isStatus(input: string): input is Status</code> — a type guard that answers whether the string is one of the three members of <code>Status</code>.</li>' +
            '<li><code>label(s: Status): string</code> — a <code>switch</code> over <code>s</code> returning <code>&quot;Not published yet&quot;</code> / <code>&quot;Live&quot;</code> / <code>&quot;Archived&quot;</code>. Its <code>default</code> branch must be a real exhaustiveness check: assign the value to a <code>const _exhaustive: never</code> and return it, so that adding a fourth status later breaks the build here.</li>' +
            '<li><code>classify(input: unknown): Verdict</code> — return <code>{ ok: false, reason: &quot;not-a-string&quot; }</code> when the input is not a string, <code>{ ok: false, reason: &quot;unknown-status&quot; }</code> when it is a string that is not a status, and otherwise <code>{ ok: true, status, label }</code> with the label from <code>label()</code>.</li>' +
            '</ul>' +
            '<p>Property order in the success object matters, because the test prints JSON: <code>ok</code>, then <code>status</code>, then <code>label</code>. Keep the given types and the printing loop exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 31 — Chứng minh rồi hãy tin (chương 2 + 5).</b> Một trạng thái đến từ ngoài chương trình nên kiểu tĩnh của nó là <code>unknown</code>. Hãy biến nó thành giá trị mà phần mã còn lại dựa vào được, không dùng một chữ <code>as</code> nào.</p>' +
            '<p>Cài đặt ba thứ:</p>' +
            '<ul>' +
            '<li><code>isStatus(input: string): input is Status</code> — một type guard trả lời chuỗi ấy có phải một trong ba thành viên của <code>Status</code> hay không.</li>' +
            '<li><code>label(s: Status): string</code> — một <code>switch</code> trên <code>s</code> trả về <code>&quot;Not published yet&quot;</code> / <code>&quot;Live&quot;</code> / <code>&quot;Archived&quot;</code>. Nhánh <code>default</code> phải là một phép kiểm tính đầy đủ THẬT: gán giá trị cho <code>const _exhaustive: never</code> rồi trả về nó, để sau này thêm trạng thái thứ tư là build vỡ ngay tại đây.</li>' +
            '<li><code>classify(input: unknown): Verdict</code> — trả về <code>{ ok: false, reason: &quot;not-a-string&quot; }</code> khi đầu vào không phải chuỗi, <code>{ ok: false, reason: &quot;unknown-status&quot; }</code> khi nó là chuỗi nhưng không phải trạng thái, còn lại thì trả <code>{ ok: true, status, label }</code> với nhãn lấy từ <code>label()</code>.</li>' +
            '</ul>' +
            '<p>Thứ tự thuộc tính trong object thành công có ý nghĩa, vì phép thử in ra JSON: <code>ok</code>, rồi <code>status</code>, rồi <code>label</code>. Giữ nguyên phần kiểu cho sẵn và vòng lặp in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          language: 'typescript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "type Status = 'draft' | 'published' | 'archived';\n" +
            'type Verdict =\n' +
            '  | { ok: true; status: Status; label: string }\n' +
            "  | { ok: false; reason: 'not-a-string' | 'unknown-status' };\n" +
            '\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function isStatus(input: string): input is Status {\n' +
            '  // TODO\n' +
            '}\n' +
            '\n' +
            'function label(s: Status): string {\n' +
            '  // TODO\n' +
            '}\n' +
            '\n' +
            'function classify(input: unknown): Verdict {\n' +
            '  // TODO\n' +
            '}\n' +
            '\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const CASES: unknown[] = ['draft', 'published', 'archived', 'deleted', 'Draft', '', 42, null, undefined, ['draft']];\n" +
            "for (const cs of CASES) console.log(JSON.stringify(cs) + ' => ' + JSON.stringify(classify(cs)));\n",
          expectedOutput:
            '"draft" => {"ok":true,"status":"draft","label":"Not published yet"}\n' +
            '"published" => {"ok":true,"status":"published","label":"Live"}\n' +
            '"archived" => {"ok":true,"status":"archived","label":"Archived"}\n' +
            '"deleted" => {"ok":false,"reason":"unknown-status"}\n' +
            '"Draft" => {"ok":false,"reason":"unknown-status"}\n' +
            '"" => {"ok":false,"reason":"unknown-status"}\n' +
            '42 => {"ok":false,"reason":"not-a-string"}\n' +
            'null => {"ok":false,"reason":"not-a-string"}\n' +
            'undefined => {"ok":false,"reason":"not-a-string"}\n' +
            '["draft"] => {"ok":false,"reason":"not-a-string"}',
          sampleSolution:
            'function isStatus(input: string): input is Status {\n' +
            "  return input === 'draft' || input === 'published' || input === 'archived';\n" +
            '}\n' +
            '\n' +
            'function label(s: Status): string {\n' +
            '  switch (s) {\n' +
            "    case 'draft': return 'Not published yet';\n" +
            "    case 'published': return 'Live';\n" +
            "    case 'archived': return 'Archived';\n" +
            '    default: {\n' +
            '      // Chỉ tới được đây nếu Status mọc thêm thành viên mà switch chưa xử lý.\n' +
            '      const _exhaustive: never = s;\n' +
            '      return _exhaustive;\n' +
            '    }\n' +
            '  }\n' +
            '}\n' +
            '\n' +
            'function classify(input: unknown): Verdict {\n' +
            "  if (typeof input !== 'string') return { ok: false, reason: 'not-a-string' };\n" +
            "  if (!isStatus(input)) return { ok: false, reason: 'unknown-status' };\n" +
            '  return { ok: true, status: input, label: label(input) };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Optional does not mean falsy (chapters 3 + 4).</b> Every field of <code>NoteInput</code> is optional, so every field may be missing <i>or</i> explicitly <code>undefined</code>. Fill in the gaps without destroying the values a caller deliberately sent.</p>' +
            '<p><code>withDefaults(input: NoteInput = {}): Note</code> — return a <code>Note</code> where</p>' +
            '<ul>' +
            '<li><code>title</code> defaults to <code>&quot;Untitled&quot;</code>, <code>body</code> to <code>&quot;&quot;</code>, <code>pinned</code> to <code>false</code>, <code>tags</code> to an empty array;</li>' +
            '<li>a value that IS present is kept even when it is falsy — an empty <code>title</code> stays empty, and <code>pinned: false</code> stays false. Only "missing or <code>undefined</code>" triggers the default, so <code>||</code> is the wrong operator here;</li>' +
            '<li><code>tags</code> is <b>copied</b>, never aliased: mutating the caller\'s array afterwards must not change the note.</li>' +
            '</ul>' +
            '<p><code>summarise(notes: readonly Note[])</code> — return <code>{ total, pinned, tags, titles }</code>: the number of notes, how many are pinned, the total number of tags across all of them, and every title sorted with the default <code>sort()</code>. Property order matters: <code>total</code>, <code>pinned</code>, <code>tags</code>, <code>titles</code>.</p>' +
            '<p>Keep the given types, data and printing block exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 32 — Tuỳ chọn không có nghĩa là falsy (chương 3 + 4).</b> Mọi trường của <code>NoteInput</code> đều tuỳ chọn, nên trường nào cũng có thể vắng mặt <i>hoặc</i> được truyền tường minh là <code>undefined</code>. Hãy lấp chỗ trống mà không phá mất những giá trị người gọi cố ý gửi lên.</p>' +
            '<p><code>withDefaults(input: NoteInput = {}): Note</code> — trả về một <code>Note</code> trong đó</p>' +
            '<ul>' +
            '<li><code>title</code> mặc định <code>&quot;Untitled&quot;</code>, <code>body</code> mặc định <code>&quot;&quot;</code>, <code>pinned</code> mặc định <code>false</code>, <code>tags</code> mặc định là mảng rỗng;</li>' +
            '<li>giá trị CÓ mặt thì phải giữ nguyên kể cả khi nó falsy — <code>title</code> rỗng thì vẫn rỗng, <code>pinned: false</code> thì vẫn false. Chỉ "vắng mặt hoặc <code>undefined</code>" mới kích hoạt giá trị mặc định, nên <code>||</code> là toán tử sai ở đây;</li>' +
            '<li><code>tags</code> phải được <b>chép</b>, không dùng chung: người gọi sửa mảng của họ sau đó thì ghi chú không được đổi theo.</li>' +
            '</ul>' +
            '<p><code>summarise(notes: readonly Note[])</code> — trả về <code>{ total, pinned, tags, titles }</code>: số ghi chú, số ghi chú được ghim, tổng số thẻ của tất cả, và mọi tiêu đề đã sắp bằng <code>sort()</code> mặc định. Thứ tự thuộc tính có ý nghĩa: <code>total</code>, <code>pinned</code>, <code>tags</code>, <code>titles</code>.</p>' +
            '<p>Giữ nguyên phần kiểu, dữ liệu và khối in kết quả cho sẵn, và không cài thêm thư viện nào.</p>',
          ),
          language: 'typescript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'interface NoteInput {\n' +
            '  title?: string;\n' +
            '  body?: string;\n' +
            '  pinned?: boolean;\n' +
            '  tags?: readonly string[];\n' +
            '}\n' +
            'interface Note {\n' +
            '  readonly title: string;\n' +
            '  readonly body: string;\n' +
            '  readonly pinned: boolean;\n' +
            '  readonly tags: readonly string[];\n' +
            '}\n' +
            '\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function withDefaults(input: NoteInput = {}): Note {\n' +
            '  // TODO\n' +
            '}\n' +
            '\n' +
            'function summarise(notes: readonly Note[]): { total: number; pinned: number; tags: number; titles: string[] } {\n' +
            '  // TODO\n' +
            '}\n' +
            '\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const shared: string[] = ['ts'];\n" +
            'const CASES: NoteInput[] = [\n' +
            '  {},\n' +
            "  { title: '' },\n" +
            "  { title: 'Hi', pinned: false },\n" +
            '  { body: undefined, pinned: true },\n' +
            '  { tags: shared },\n' +
            "  { title: 'Zed', body: 'b', pinned: true, tags: [] },\n" +
            '];\n' +
            'const built = CASES.map((cs) => withDefaults(cs));\n' +
            'for (const nt of built) console.log(JSON.stringify(nt));\n' +
            "shared.push('mutated');\n" +
            "console.log('shared-leak=' + JSON.stringify(built[4].tags));\n" +
            'console.log(JSON.stringify(summarise(built)));\n',
          expectedOutput:
            '{"title":"Untitled","body":"","pinned":false,"tags":[]}\n' +
            '{"title":"","body":"","pinned":false,"tags":[]}\n' +
            '{"title":"Hi","body":"","pinned":false,"tags":[]}\n' +
            '{"title":"Untitled","body":"","pinned":true,"tags":[]}\n' +
            '{"title":"Untitled","body":"","pinned":false,"tags":["ts"]}\n' +
            '{"title":"Zed","body":"b","pinned":true,"tags":[]}\n' +
            'shared-leak=["ts"]\n' +
            '{"total":6,"pinned":2,"tags":1,"titles":["","Hi","Untitled","Untitled","Untitled","Zed"]}',
          sampleSolution:
            'function withDefaults(input: NoteInput = {}): Note {\n' +
            '  return {\n' +
            '    // ?? chỉ nhảy vào khi giá trị là null/undefined — khác hẳn ||, thứ sẽ\n' +
            "    // nuốt luôn chuỗi rỗng và false mà người gọi cố ý gửi.\n" +
            "    title: input.title ?? 'Untitled',\n" +
            "    body: input.body ?? '',\n" +
            '    pinned: input.pinned ?? false,\n' +
            '    tags: input.tags === undefined ? [] : [...input.tags],\n' +
            '  };\n' +
            '}\n' +
            '\n' +
            'function summarise(notes: readonly Note[]): { total: number; pinned: number; tags: number; titles: string[] } {\n' +
            '  return {\n' +
            '    total: notes.length,\n' +
            '    pinned: notes.filter((n) => n.pinned).length,\n' +
            '    tags: notes.reduce((sum, n) => sum + n.tags.length, 0),\n' +
            '    titles: notes.map((n) => n.title).sort(),\n' +
            '  };\n' +
            '}\n',
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
