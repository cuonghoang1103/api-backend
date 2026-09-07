/**
 * TypeScript — Final Exam (FE): 50 câu trắc nghiệm phủ cả 17 chương (s00–s16).
 *
 * Đề tự soạn, bám sát `content/courses/typescript/s00…s16`. Có cả câu lý thuyết
 * lẫn câu đọc mã; MỌI đoạn mã hỏi "in ra gì" đều đã CHẠY THẬT bằng `tsx` v4 /
 * `node` v22.21.0, và MỌI câu hỏi "có lỗi biên dịch không" đều đã chạy thật
 * `tsc --noEmit --strict` (TypeScript 5.9.3) — mã lỗi và thông báo trong đáp án
 * là nguyên văn máy in ra, không phải trí nhớ.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/TYPESCRIPT-FE.mjs --apply
 */
import { B, EX, code, mcq } from './_lib/typescript-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all 17 chapters, from "why does a typo reach production" to "validate at the edges, trust the inside". Many questions show code and ask what it prints, or whether <code>tsc --strict</code> accepts it; every one of those answers came from actually running the compiler and the code, so read the snippet rather than the intuition.</p>' +
  '<p>Two habits pay off here. First, keep the compile-time / runtime split in mind: a line can be perfectly legal TypeScript and still crash at runtime. Second, read the exact error code — <code>TS2322</code>, <code>TS2339</code>, <code>TS18047</code> — because several questions turn on <em>which</em> error appears, not just that one does.</p>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả 17 chương, từ chuyện "vì sao một lỗi gõ sai lọt lên production" tới "validate tại biên, tin phần bên trong". Nhiều câu cho sẵn mã và hỏi nó in ra gì, hoặc hỏi <code>tsc --strict</code> có nhận không; mọi đáp án loại đó đều lấy từ việc chạy thật trình biên dịch và chạy thật đoạn mã, nên hãy đọc mã thay vì đoán theo cảm tính.</p>' +
  '<p>Hai thói quen giúp ích ở đây. Một là luôn giữ trong đầu ranh giới lúc-biên-dịch / lúc-chạy: một dòng có thể hợp lệ hoàn toàn mà vẫn sập lúc chạy. Hai là đọc kỹ mã lỗi — <code>TS2322</code>, <code>TS2339</code>, <code>TS18047</code> — vì nhiều câu ăn thua ở chỗ lỗi NÀO hiện ra, chứ không phải chỉ là có lỗi hay không.</p>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'typescript' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Final Exam — the whole TypeScript course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá TypeScript (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all seventeen chapters: compile time vs runtime, the basic type system, functions, objects and interfaces, unions and narrowing, generics, mapped and conditional types, utility types, tsconfig, modules and declarations, Express and React, Zod and Prisma, classes, build performance and type-driven architecture.',
        'Năm mươi câu trắc nghiệm phủ cả mười bảy chương: lúc biên dịch so với lúc chạy, hệ kiểu cơ bản, hàm, object và interface, union và thu hẹp kiểu, generics, mapped và conditional type, utility type, tsconfig, module và khai báo kiểu, Express và React, Zod và Prisma, class, hiệu năng build và kiến trúc type-driven.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        // ── Mục 0 — Giới thiệu & mô hình tư duy ─────────────────────────
        mcq({
          prompt: B(
            'What does this print when run with <code>npx tsx</code>?' + code(
              'function twice(n: number): number { return n + n; }\n' +
              "const raw: any = '5';\n" +
              'console.log(twice(raw));\n' +
              'console.log(typeof twice(raw));',
            ),
            'Đoạn mã sau in ra gì khi chạy bằng <code>npx tsx</code>?' + code(
              'function twice(n: number): number { return n + n; }\n' +
              "const raw: any = '5';\n" +
              'console.log(twice(raw));\n' +
              'console.log(typeof twice(raw));',
            ),
          ),
          options: [
            B('<code>55</code> then <code>string</code>', '<code>55</code> rồi <code>string</code>'),
            B('<code>NaN</code> then <code>number</code>', '<code>NaN</code> rồi <code>number</code>'),
            B('Nothing — it refuses to run because the argument is not a number', 'Không gì cả — nó từ chối chạy vì đối số không phải số'),
            B('<code>10</code> then <code>number</code>', '<code>10</code> rồi <code>number</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. The annotations <code>n: number</code> and <code>: number</code> are <b>erased</b> before the code executes, so at runtime <code>twice</code> receives the string <code>&#x27;5&#x27;</code> and <code>&#x27;5&#x27; + &#x27;5&#x27;</code> is string concatenation — <code>&#x27;55&#x27;</code>, whose <code>typeof</code> is <code>string</code>. The <code>any</code> is what let the call past the compiler in the first place. Option 4 assumes the type was enforced at runtime (it never is); option 2 assumes <code>+</code> coerces to a number (it concatenates when either side is a string); option 3 assumes the runtime knows about types at all.',
            'Đã chạy thật. Các chú thích <code>n: number</code> và <code>: number</code> bị <b>xoá</b> trước khi mã chạy, nên lúc chạy <code>twice</code> nhận chuỗi <code>&#x27;5&#x27;</code>, và <code>&#x27;5&#x27; + &#x27;5&#x27;</code> là phép nối chuỗi — ra <code>&#x27;55&#x27;</code>, <code>typeof</code> là <code>string</code>. Chính chữ <code>any</code> đã cho lời gọi lọt qua trình biên dịch. Phương án 4 tưởng kiểu được ép lúc chạy (không bao giờ); phương án 2 tưởng <code>+</code> ép về số (nó nối chuỗi khi một vế là chuỗi); phương án 3 tưởng lúc chạy còn biết gì về kiểu.',
          ),
        }),

        mcq({
          prompt: B(
            'Under <code>tsc --noEmit --strict</code>, what happens on the marked line?' + code(
              'type User = { name: string };\n' +
              'function handle(x: unknown) {\n' +
              '  if (x instanceof User) { return 1; }   // <-- this line\n' +
              '  return 0;\n' +
              '}',
            ),
            'Dưới <code>tsc --noEmit --strict</code>, điều gì xảy ra ở dòng được đánh dấu?' + code(
              'type User = { name: string };\n' +
              'function handle(x: unknown) {\n' +
              '  if (x instanceof User) { return 1; }   // <-- dòng này\n' +
              '  return 0;\n' +
              '}',
            ),
          ),
          options: [
            B('It compiles; at runtime the check is simply always false', 'Nó biên dịch được; lúc chạy phép kiểm chỉ luôn cho false'),
            B("<code>TS2693: &#x27;User&#x27; only refers to a type, but is being used as a value here.</code>", "<code>TS2693: &#x27;User&#x27; only refers to a type, but is being used as a value here.</code>"),
            B('It compiles and narrows <code>x</code> to <code>User</code> inside the block', 'Nó biên dịch được và thu hẹp <code>x</code> thành <code>User</code> trong khối'),
            B('<code>TS18046</code>, because <code>x</code> is <code>unknown</code>', '<code>TS18046</code>, vì <code>x</code> là <code>unknown</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running the compiler. <code>instanceof</code> is a <b>runtime</b> operator whose right side must be a value (a constructor function). <code>User</code> here is only a <em>type</em>, and types are erased — there is nothing left at runtime to compare against — so the compiler rejects it before it can ever be false. This is the compile-time / runtime split from lesson 0.4: to check a real value&#x27;s shape at runtime you need actual JavaScript, or a schema library (chapter 13). Option 4 is the error you would get if you tried to <em>use</em> <code>x</code> without narrowing, which is a different mistake.',
            'Đã chạy thật trình biên dịch. <code>instanceof</code> là toán tử <b>lúc chạy</b>, vế phải phải là một giá trị (một hàm khởi tạo). <code>User</code> ở đây chỉ là một <em>kiểu</em>, mà kiểu thì bị xoá — lúc chạy không còn gì để so — nên trình biên dịch từ chối trước khi nó kịp cho ra false. Đây đúng là ranh giới lúc-biên-dịch / lúc-chạy ở bài 0.4: muốn kiểm dáng của một giá trị thật lúc chạy thì phải viết JavaScript thật, hoặc dùng thư viện schema (chương 13). Phương án 4 là lỗi bạn gặp nếu <em>dùng</em> <code>x</code> mà chưa thu hẹp — một lỗi khác.',
          ),
        }),

        // ── Chương 1 — Vì sao TypeScript tồn tại ────────────────────────
        mcq({
          prompt: B(
            'This file was both type-checked and run. Which pair of results is correct?' + code(
              'interface User { email: string }\n' +
              'const raw: unknown = null;\n' +
              'const u = raw as User;\n' +
              'console.log(u.email.toUpperCase());',
            ),
            'File này đã được vừa kiểm kiểu vừa chạy. Cặp kết quả nào đúng?' + code(
              'interface User { email: string }\n' +
              'const raw: unknown = null;\n' +
              'const u = raw as User;\n' +
              'console.log(u.email.toUpperCase());',
            ),
          ),
          options: [
            B('<code>tsc</code> reports TS18047 "possibly null"; running it prints nothing', '<code>tsc</code> báo TS18047 "possibly null"; chạy nó không in gì'),
            B('<code>tsc</code> reports TS2322; the file never runs', '<code>tsc</code> báo TS2322; file không bao giờ chạy'),
            B('<code>tsc</code> exits 0 with no output; running it throws <code>TypeError: Cannot read properties of null</code>', '<code>tsc</code> thoát 0, không in gì; chạy nó thì ném <code>TypeError: Cannot read properties of null</code>'),
            B('<code>tsc</code> exits 0; running it prints an empty line', '<code>tsc</code> thoát 0; chạy nó in ra một dòng trống'),
          ],
          correct: 2,
          explanation: EX(
            'Verified both ways. <code>as</code> is <b>not</b> a conversion and <b>not</b> a check — it is you overriding the compiler and taking responsibility, so <code>tsc</code> accepts the file silently (exit code 0, no diagnostics). At runtime the value really is <code>null</code>, so the property access throws. Option 1 is the tempting one: <code>strictNullChecks</code> <em>would</em> have produced TS18047 if the type had been <code>User | null</code> — but the assertion already told the compiler the null was gone. This is the whole reason chapter 13 exists: guard the boundary with a runtime check, because every <code>as</code> is a place TypeScript stopped protecting you.',
            'Đã kiểm cả hai đường. <code>as</code> <b>không</b> phải phép chuyển đổi và <b>không</b> phải phép kiểm — đó là bạn ghi đè trình biên dịch và tự chịu trách nhiệm, nên <code>tsc</code> nhận file trong im lặng (thoát 0, không lỗi nào). Lúc chạy giá trị thật sự là <code>null</code> nên truy cập thuộc tính ném lỗi. Phương án 1 là cái bẫy hấp dẫn: <code>strictNullChecks</code> <em>đã</em> cho TS18047 nếu kiểu là <code>User | null</code> — nhưng phép ép đã nói với trình biên dịch rằng null biến mất rồi. Đây chính là lý do có chương 13: chặn ở biên bằng một phép kiểm lúc chạy, vì mỗi chữ <code>as</code> là một chỗ TypeScript ngừng bảo vệ bạn.',
          ),
        }),

        mcq({
          prompt: B(
            'These three lines were compiled with <code>--declaration --emitDeclarationOnly</code>. Which set of inferred types did the compiler emit?' + code(
              "let a = 'CuongThai';\n" +
              "const b = 'CuongThai';\n" +
              "const cfg = { status: 'draft' };",
            ),
            'Ba dòng này được biên dịch với <code>--declaration --emitDeclarationOnly</code>. Trình biên dịch xuất ra bộ kiểu suy luận nào?' + code(
              "let a = 'CuongThai';\n" +
              "const b = 'CuongThai';\n" +
              "const cfg = { status: 'draft' };",
            ),
          ),
          options: [
            B('<code>a: string</code> · <code>b: string</code> · <code>cfg: { status: string }</code>', '<code>a: string</code> · <code>b: string</code> · <code>cfg: { status: string }</code>'),
            B('<code>a: string</code> · <code>b = "CuongThai"</code> · <code>cfg: { status: string }</code>', '<code>a: string</code> · <code>b = "CuongThai"</code> · <code>cfg: { status: string }</code>'),
            B('<code>a = "CuongThai"</code> · <code>b = "CuongThai"</code> · <code>cfg: { readonly status: "draft" }</code>', '<code>a = "CuongThai"</code> · <code>b = "CuongThai"</code> · <code>cfg: { readonly status: "draft" }</code>'),
            B('<code>a: string</code> · <code>b = "CuongThai"</code> · <code>cfg: { readonly status: "draft" }</code>', '<code>a: string</code> · <code>b = "CuongThai"</code> · <code>cfg: { readonly status: "draft" }</code>'),
          ],
          correct: 1,
          explanation: EX(
            'This is the real declaration dump. <code>let</code> can be reassigned, so its type is <b>widened</b> to <code>string</code>. A <code>const</code> can never change, so it keeps the <b>literal</b> type <code>"CuongThai"</code>. The one that surprises people is the third: an object <em>property</em> is mutable even when the variable is <code>const</code>, so <code>cfg.status</code> widens to <code>string</code> — which is why passing it where a <code>&#x27;draft&#x27; | &#x27;live&#x27;</code> is expected fails. Only <code>as const</code> (option 3&#x27;s shape) makes the property <code>readonly</code> and keeps the literal.',
            'Đây là bản xuất khai báo thật. <code>let</code> gán lại được nên kiểu bị <b>nới rộng</b> thành <code>string</code>. Một <code>const</code> không bao giờ đổi nên giữ kiểu <b>literal</b> <code>"CuongThai"</code>. Cái làm người ta bất ngờ là dòng thứ ba: một <em>thuộc tính</em> của object vẫn ghi được kể cả khi biến là <code>const</code>, nên <code>cfg.status</code> nới thành <code>string</code> — đó là lý do truyền nó vào chỗ đòi <code>&#x27;draft&#x27; | &#x27;live&#x27;</code> sẽ hỏng. Chỉ <code>as const</code> (dáng ở phương án 3) mới làm thuộc tính thành <code>readonly</code> và giữ literal.',
          ),
        }),

        // ── Chương 2 — Hệ thống kiểu cơ bản ─────────────────────────────
        mcq({
          prompt: B(
            'Under <code>--strict</code>, which of these four assignments is the ONLY one the compiler accepts?' + code(
              'function log(m: string): void { console.log(m); }\n' +
              'declare const u: unknown;\n' +
              'declare const a: any;\n' +
              '\n' +
              "const w: number = log('hi');   // 1\n" +
              'const x: never  = 5;           // 2\n' +
              'const y: number = u;           // 3\n' +
              'const z: number = a;           // 4',
            ),
            'Dưới <code>--strict</code>, trong bốn phép gán này, phép nào là DUY NHẤT trình biên dịch chấp nhận?' + code(
              'function log(m: string): void { console.log(m); }\n' +
              'declare const u: unknown;\n' +
              'declare const a: any;\n' +
              '\n' +
              "const w: number = log('hi');   // 1\n" +
              'const x: never  = 5;           // 2\n' +
              'const y: number = u;           // 3\n' +
              'const z: number = a;           // 4',
            ),
          ),
          options: [
            B('Line 4 — <code>any</code> is assignable in both directions, so all checking is off', 'Dòng 4 — <code>any</code> gán được theo cả hai chiều, nên mọi phép kiểm bị tắt'),
            B('Line 1 — <code>void</code> is just <code>undefined</code>, which is a number at runtime', 'Dòng 1 — <code>void</code> chỉ là <code>undefined</code>, mà lúc chạy nó là số'),
            B('Line 2 — <code>never</code> accepts any value because it is the bottom type', 'Dòng 2 — <code>never</code> nhận mọi giá trị vì nó là kiểu đáy'),
            B('Line 3 — <code>unknown</code> is assignable to anything once it holds a value', 'Dòng 3 — <code>unknown</code> gán được cho mọi thứ khi nó đã chứa giá trị'),
          ],
          correct: 0,
          explanation: EX(
            'Verified: the compiler reports TS2322 on lines 1, 2 and 3, and says nothing about line 4. That silence is exactly the danger. <code>void</code> means "returns nothing you should use", so it is not a number. <code>never</code> is the <em>empty</em> type — nothing is assignable <em>to</em> it, which is precisely what makes the exhaustiveness trick of 5.4 work. <code>unknown</code> accepts anything <em>in</em> but goes nowhere <em>out</em> until you narrow. <code>any</code> is the one that flows both ways, which is why a single <code>any</code> silently disables checking for everything downstream of it.',
            'Đã kiểm thật: trình biên dịch báo TS2322 ở dòng 1, 2 và 3, và không nói gì về dòng 4. Chính sự im lặng đó mới là nguy hiểm. <code>void</code> nghĩa là "không trả về gì bạn nên dùng", nên nó không phải số. <code>never</code> là kiểu <em>rỗng</em> — không gì gán <em>cho</em> nó được, và đó chính là thứ làm mẹo kiểm-đầy-đủ ở 5.4 chạy được. <code>unknown</code> nhận mọi thứ <em>vào</em> nhưng không đi <em>ra</em> đâu cả cho tới khi bạn thu hẹp. <code>any</code> là kiểu chảy được cả hai chiều — đó là lý do một chữ <code>any</code> âm thầm tắt kiểm tra cho mọi thứ nằm sau nó.',
          ),
        }),

        mcq({
          prompt: B(
            'What does the compiler say about the second line?' + code(
              'const ids: readonly number[] = [1, 2, 3];\n' +
              'ids.push(4);',
            ),
            'Trình biên dịch nói gì về dòng thứ hai?' + code(
              'const ids: readonly number[] = [1, 2, 3];\n' +
              'ids.push(4);',
            ),
          ),
          options: [
            B('Nothing — <code>readonly</code> on an array is documentation only', 'Không gì — <code>readonly</code> trên mảng chỉ là tài liệu'),
            B("<code>TS2339: Property &#x27;push&#x27; does not exist on type &#x27;readonly number[]&#x27;.</code>", "<code>TS2339: Property &#x27;push&#x27; does not exist on type &#x27;readonly number[]&#x27;.</code>"),
            B('<code>TS2540: Cannot assign to a read-only property.</code>', '<code>TS2540: Cannot assign to a read-only property.</code>'),
            B('Nothing — but it throws at runtime, because <code>readonly</code> freezes the array', 'Không gì — nhưng nó ném lỗi lúc chạy, vì <code>readonly</code> đóng băng mảng'),
          ],
          correct: 1,
          explanation: EX(
            'Verified. A <code>readonly T[]</code> is not "an array that refuses writes" — it is a <em>different type</em> from which every mutating method has been removed, so <code>push</code> genuinely does not exist on it and you get TS2339, not an assignment error. Options 4 and 1 are the two halves of the same misunderstanding: this is a <b>compile-time</b> guarantee, erased before the code runs (nothing calls <code>Object.freeze</code>), yet it is enforced everywhere the type is used — which is exactly what makes it a good annotation for a parameter you promise not to mutate.',
            'Đã kiểm thật. <code>readonly T[]</code> không phải "một mảng từ chối ghi" — nó là một <em>kiểu khác</em>, đã bị gỡ mọi phương thức làm thay đổi mảng, nên <code>push</code> thật sự không tồn tại trên nó và bạn nhận TS2339 chứ không phải lỗi gán. Phương án 4 và 1 là hai nửa của cùng một hiểu nhầm: đây là bảo đảm <b>lúc biên dịch</b>, bị xoá trước khi mã chạy (không có ai gọi <code>Object.freeze</code>), nhưng lại được ép ở mọi chỗ dùng kiểu đó — và đó chính là lý do nó hợp làm chú thích cho một tham số mà bạn hứa sẽ không sửa.',
          ),
        }),

        mcq({
          prompt: B(
            'Only one of the two calls compiles. Which, and why?' + code(
              "declare function setStatus(s: 'draft' | 'live'): void;\n" +
              '\n' +
              "const cfg = { status: 'draft' };\n" +
              'setStatus(cfg.status);          // A\n' +
              '\n' +
              "const frozen = { status: 'draft' } as const;\n" +
              'setStatus(frozen.status);       // B',
            ),
            'Chỉ một trong hai lời gọi biên dịch được. Cái nào, và vì sao?' + code(
              "declare function setStatus(s: 'draft' | 'live'): void;\n" +
              '\n' +
              "const cfg = { status: 'draft' };\n" +
              'setStatus(cfg.status);          // A\n' +
              '\n' +
              "const frozen = { status: 'draft' } as const;\n" +
              'setStatus(frozen.status);       // B',
            ),
          ),
          options: [
            B('A compiles, B fails — <code>as const</code> makes the property <code>readonly</code>, which the parameter is not', 'A chạy được, B hỏng — <code>as const</code> làm thuộc tính thành <code>readonly</code>, mà tham số thì không'),
            B("B compiles, A fails — <code>cfg.status</code> widened to <code>string</code>, and <code>string</code> is not <code>&#x27;draft&#x27; | &#x27;live&#x27;</code>", "B chạy được, A hỏng — <code>cfg.status</code> đã nới rộng thành <code>string</code>, mà <code>string</code> không phải <code>&#x27;draft&#x27; | &#x27;live&#x27;</code>"),
            B('Both compile — the value is visibly the right string in each case', 'Cả hai chạy được — giá trị rõ ràng là đúng chuỗi ở cả hai trường hợp'),
            B('Neither compiles — a literal union parameter only accepts a literal written at the call site', 'Cả hai đều hỏng — tham số union literal chỉ nhận một literal viết ngay tại chỗ gọi'),
          ],
          correct: 1,
          explanation: EX(
            "Verified: the only diagnostic is TS2345 on line A — <em>Argument of type &#x27;string&#x27; is not assignable to parameter of type &#x27;&quot;draft&quot; | &quot;live&quot;&#x27;</em>. Object properties are mutable, so TypeScript widens <code>cfg.status</code> to <code>string</code> even though the variable is <code>const</code>; a <code>string</code> could later be anything, so it does not fit the union. <code>as const</code> freezes every property into its literal type, so <code>frozen.status</code> is exactly <code>&#x27;draft&#x27;</code> and B passes. The fix belongs at the source (<code>as const</code>, or annotating the variable&#x27;s type) — never a cast at the call site, which would just re-hide the problem.",
            'Đã kiểm thật: lỗi duy nhất là TS2345 ở dòng A — <em>Argument of type &#x27;string&#x27; is not assignable to parameter of type &#x27;"draft" | "live"&#x27;</em>. Thuộc tính object ghi được nên TypeScript nới <code>cfg.status</code> thành <code>string</code> dù biến là <code>const</code>; một <code>string</code> về sau có thể là bất cứ gì nên không vừa union. <code>as const</code> khoá mọi thuộc tính về đúng kiểu literal của nó, nên <code>frozen.status</code> đúng là <code>&#x27;draft&#x27;</code> và B qua được. Chỗ sửa nằm ở nguồn (<code>as const</code>, hoặc chú thích kiểu cho biến) — đừng bao giờ ép kiểu ở chỗ gọi, làm thế chỉ giấu lại vấn đề.',
          ),
        }),
        // ── Chương 3 — Hàm ──────────────────────────────────────────────
        mcq({
          prompt: B(
            'What does this print? (It compiles cleanly under <code>--strict</code>.)' + code(
              "console.log(['10', '10', '10'].map(parseInt));",
            ),
            'Đoạn này in ra gì? (Nó biên dịch sạch dưới <code>--strict</code>.)' + code(
              "console.log(['10', '10', '10'].map(parseInt));",
            ),
          ),
          options: [
            B('<code>[ 10, 10, 10 ]</code>', '<code>[ 10, 10, 10 ]</code>'),
            B('<code>[ 10, NaN, 2 ]</code>', '<code>[ 10, NaN, 2 ]</code>'),
            B('<code>[ 10, NaN, NaN ]</code>', '<code>[ 10, NaN, NaN ]</code>'),
            B('It does not compile: <code>parseInt</code> takes two arguments, <code>map</code> passes three', 'Nó không biên dịch được: <code>parseInt</code> nhận hai đối số, <code>map</code> truyền ba'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. <code>map</code> calls the callback as <code>(value, index, array)</code>, and <code>parseInt(string, radix)</code> happily takes the index as its <b>radix</b>. So the calls are <code>parseInt(&#x27;10&#x27;, 0)</code> → 10 (radix 0 means "guess", i.e. decimal), <code>parseInt(&#x27;10&#x27;, 1)</code> → <code>NaN</code> (radix 1 is invalid), <code>parseInt(&#x27;10&#x27;, 2)</code> → 2 (binary). Option 3 is what the same trick gives for <code>[&#x27;1&#x27;,&#x27;2&#x27;,&#x27;3&#x27;]</code> and is the version usually quoted. Option 4 is wrong for a reason worth remembering: a callback may take <em>fewer</em> parameters than the caller supplies, which is exactly the rule that lets this bug through the type checker. Write <code>.map(s =&gt; parseInt(s, 10))</code>.',
            'Đã chạy thật. <code>map</code> gọi callback theo dạng <code>(value, index, array)</code>, còn <code>parseInt(string, radix)</code> vui vẻ nhận chỉ số làm <b>cơ số</b>. Vậy các lời gọi là <code>parseInt(&#x27;10&#x27;, 0)</code> → 10 (cơ số 0 nghĩa là "tự đoán", tức hệ 10), <code>parseInt(&#x27;10&#x27;, 1)</code> → <code>NaN</code> (cơ số 1 không hợp lệ), <code>parseInt(&#x27;10&#x27;, 2)</code> → 2 (nhị phân). Phương án 3 là kết quả của đúng mẹo đó với <code>[&#x27;1&#x27;,&#x27;2&#x27;,&#x27;3&#x27;]</code>, bản hay được trích. Phương án 4 sai vì một lý do đáng nhớ: một callback được phép nhận <em>ít</em> tham số hơn bên gọi truyền vào — chính quy tắc đó cho con bug này lọt qua trình kiểm kiểu. Hãy viết <code>.map(s =&gt; parseInt(s, 10))</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Compiled with <code>--declaration --emitDeclarationOnly</code>, what signature does TypeScript emit for <code>size</code>?' + code(
              'export function paginate(page: number, size = 20) {\n' +
              '  return { page, size };\n' +
              '}',
            ),
            'Biên dịch với <code>--declaration --emitDeclarationOnly</code>, TypeScript xuất ra chữ ký nào cho <code>size</code>?' + code(
              'export function paginate(page: number, size = 20) {\n' +
              '  return { page, size };\n' +
              '}',
            ),
          ),
          options: [
            B('<code>size: number</code> — required, because it has a value', '<code>size: number</code> — bắt buộc, vì nó có giá trị'),
            B('<code>size?: number</code> — optional in the signature, but a plain <code>number</code> inside the body', '<code>size?: number</code> — tuỳ chọn trong chữ ký, nhưng là <code>number</code> thuần bên trong thân hàm'),
            B('<code>size?: number | undefined</code> — and you must guard it inside the body', '<code>size?: number | undefined</code> — và bạn phải kiểm nó bên trong thân hàm'),
            B('<code>size: 20</code> — the literal type of the default', '<code>size: 20</code> — kiểu literal của giá trị mặc định'),
          ],
          correct: 1,
          explanation: EX(
            'The real emitted declaration is <code>declare function paginate(page: number, size?: number): { page: number; size: number; }</code>. Two things happened at once: the type <code>number</code> was <b>inferred from the default value</b> (so you never annotated it), and the parameter was marked optional so callers may omit it. Inside the body it is a plain <code>number</code> — the default already filled it, so there is no <code>undefined</code> branch to guard, which is the practical advantage over <code>size?: number</code>. Option 4 confuses parameter defaults with <code>const</code> widening: a parameter is reassignable, so it widens to <code>number</code>.',
            'Bản khai báo xuất ra thật là <code>declare function paginate(page: number, size?: number): { page: number; size: number; }</code>. Hai chuyện xảy ra cùng lúc: kiểu <code>number</code> được <b>suy ra từ giá trị mặc định</b> (nên bạn chẳng phải chú thích), và tham số được đánh dấu tuỳ chọn để bên gọi có thể bỏ qua. Bên trong thân hàm nó là <code>number</code> thuần — giá trị mặc định đã điền sẵn nên không có nhánh <code>undefined</code> nào phải canh, và đó là ưu điểm thực dụng so với <code>size?: number</code>. Phương án 4 nhầm giá trị mặc định của tham số với chuyện nới rộng của <code>const</code>: tham số gán lại được nên nó nới thành <code>number</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Under <code>--strict</code>, exactly one of these lines is an error. Which one?' + code(
              'type Cb = () => void;\n' +
              '\n' +
              'const f: Cb = () => 42;              // A\n' +
              'const nums = [1, 2, 3];\n' +
              'const dst: number[] = [];\n' +
              'nums.forEach((n) => dst.push(n));    // B\n' +
              'const r: number = f();               // C',
            ),
            'Dưới <code>--strict</code>, đúng một trong các dòng này là lỗi. Dòng nào?' + code(
              'type Cb = () => void;\n' +
              '\n' +
              'const f: Cb = () => 42;              // A\n' +
              'const nums = [1, 2, 3];\n' +
              'const dst: number[] = [];\n' +
              'nums.forEach((n) => dst.push(n));    // B\n' +
              'const r: number = f();               // C',
            ),
          ),
          options: [
            B('None of them — all three compile', 'Không dòng nào — cả ba đều biên dịch được'),
            B('A — a <code>void</code> callback may not return a value', 'A — một callback <code>void</code> không được trả về giá trị'),
            B('B — <code>push</code> returns a number, but <code>forEach</code> wants <code>void</code>', 'B — <code>push</code> trả về một số, còn <code>forEach</code> muốn <code>void</code>'),
            B("C — <code>TS2322: Type &#x27;void&#x27; is not assignable to type &#x27;number&#x27;.</code>", "C — <code>TS2322: Type &#x27;void&#x27; is not assignable to type &#x27;number&#x27;.</code>"),
          ],
          correct: 3,
          explanation: EX(
            'Verified: the only diagnostic is TS2322 on line C. The rule that makes A and B legal is deliberate — a <code>void</code> return type means "<b>I will not use</b> your return value", not "you must return nothing". Without it, <code>arr.forEach(n =&gt; dst.push(n))</code> would not type-check, because <code>push</code> returns the new length. The flip side is line C: since the type says the value is ignored, nothing guarantees anyone produced one, so you may not capture it. The same rule explains why <code>array.forEach(async x =&gt; …)</code> silently awaits nothing — the returned promise is <code>void</code> to <code>forEach</code> and gets dropped.',
            'Đã kiểm thật: lỗi duy nhất là TS2322 ở dòng C. Quy tắc làm A và B hợp lệ là cố ý — kiểu trả về <code>void</code> nghĩa là "<b>tôi sẽ không dùng</b> giá trị trả về của bạn", chứ không phải "bạn phải không trả về gì". Không có nó thì <code>arr.forEach(n =&gt; dst.push(n))</code> đã không qua nổi kiểm kiểu, vì <code>push</code> trả về độ dài mới. Mặt kia là dòng C: vì kiểu nói giá trị bị phớt lờ nên không gì bảo đảm có ai đó tạo ra nó, thành thử bạn không được hứng lấy. Cũng chính quy tắc này giải thích vì sao <code>array.forEach(async x =&gt; …)</code> âm thầm không await gì — promise trả về là <code>void</code> với <code>forEach</code> nên bị vứt đi.',
          ),
        }),

        mcq({
          prompt: B(
            'Both classes count the same way. What does this print?' + code(
              'class A { count = 0; inc() { this.count++; } }\n' +
              'class B { count = 0; inc = () => { this.count++; }; }\n' +
              '\n' +
              'const a = new A(); const b = new B();\n' +
              'const ga = a.inc; const gb = b.inc;\n' +
              "try { ga(); console.log('A ok', a.count); }\n" +
              "catch (e) { console.log('A threw:', (e as Error).constructor.name); }\n" +
              "gb(); console.log('B count', b.count);",
            ),
            'Hai class đếm giống hệt nhau. Đoạn này in ra gì?' + code(
              'class A { count = 0; inc() { this.count++; } }\n' +
              'class B { count = 0; inc = () => { this.count++; }; }\n' +
              '\n' +
              'const a = new A(); const b = new B();\n' +
              'const ga = a.inc; const gb = b.inc;\n' +
              "try { ga(); console.log('A ok', a.count); }\n" +
              "catch (e) { console.log('A threw:', (e as Error).constructor.name); }\n" +
              "gb(); console.log('B count', b.count);",
            ),
          ),
          options: [
            B('<code>A threw: TypeError</code> then <code>B threw: TypeError</code>', '<code>A threw: TypeError</code> rồi <code>B threw: TypeError</code>'),
            B('<code>A ok 1</code> then <code>B count 1</code>', '<code>A ok 1</code> rồi <code>B count 1</code>'),
            B('<code>A threw: TypeError</code> then <code>B count 1</code>', '<code>A threw: TypeError</code> rồi <code>B count 1</code>'),
            B('<code>A ok 0</code> then <code>B count 0</code>', '<code>A ok 0</code> rồi <code>B count 0</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Verified by running it. <code>A.inc</code> is a normal method: its <code>this</code> is decided by <em>how it is called</em>, and <code>ga()</code> calls it with no receiver, so <code>this</code> is <code>undefined</code> under class-body strict mode and <code>this.count++</code> throws a <code>TypeError</code>. <code>B.inc</code> is an arrow-function <b>property</b>: an arrow captures <code>this</code> from where it was <em>written</em> — the constructor&#x27;s instance — so it keeps working after being detached. This is the everyday version of the trap: <code>setTimeout(user.greet, 100)</code> compiles cleanly and throws at runtime, and the compiler can only catch it if the method declares a <code>this</code> parameter, which almost none do.',
            'Đã chạy thật. <code>A.inc</code> là method thường: <code>this</code> của nó do <em>cách gọi</em> quyết định, mà <code>ga()</code> gọi không có đối tượng nhận nên <code>this</code> là <code>undefined</code> (thân class luôn ở chế độ strict) và <code>this.count++</code> ném <code>TypeError</code>. <code>B.inc</code> là <b>thuộc tính</b> kiểu arrow: arrow bắt <code>this</code> từ nơi nó được <em>viết ra</em> — thực thể trong constructor — nên vẫn chạy đúng sau khi bị tách rời. Đây là bản đời thường của cái bẫy: <code>setTimeout(user.greet, 100)</code> biên dịch sạch rồi ném lỗi lúc chạy, và trình biên dịch chỉ bắt được nếu method có khai tham số <code>this</code> — mà gần như chẳng ai khai.',
          ),
        }),
        // ── Chương 4 — Object, interface & type alias ───────────────────
        mcq({
          prompt: B(
            'Both objects have the same three keys. How many errors does <code>tsc --strict</code> report, and where?' + code(
              'interface Note { title: string; body: string }\n' +
              '\n' +
              "const direct: Note = { title: 'Hi', body: 'x', pinned: true };   // A\n" +
              '\n' +
              "const raw = { title: 'Hi', body: 'x', pinned: true };\n" +
              'const viaVar: Note = raw;                                        // B',
            ),
            'Hai object có cùng ba khoá. <code>tsc --strict</code> báo bao nhiêu lỗi, và ở đâu?' + code(
              'interface Note { title: string; body: string }\n' +
              '\n' +
              "const direct: Note = { title: 'Hi', body: 'x', pinned: true };   // A\n" +
              '\n' +
              "const raw = { title: 'Hi', body: 'x', pinned: true };\n" +
              'const viaVar: Note = raw;                                        // B',
            ),
          ),
          options: [
            B("One, on A: <code>TS2353: Object literal may only specify known properties, and &#x27;pinned&#x27; does not exist in type &#x27;Note&#x27;.</code>", "Một, ở A: <code>TS2353: Object literal may only specify known properties, and &#x27;pinned&#x27; does not exist in type &#x27;Note&#x27;.</code>"),
            B('One, on B — assigning a wider object to a narrower type is the real violation', 'Một, ở B — gán một object rộng hơn vào kiểu hẹp hơn mới là vi phạm thật'),
            B('Zero — structural typing only asks whether the object has <em>at least</em> what <code>Note</code> needs', 'Không — kiểu cấu trúc chỉ hỏi object có <em>ít nhất</em> những gì <code>Note</code> cần hay không'),
            B('Two — both A and B carry an unknown property', 'Hai — cả A và B đều mang một thuộc tính lạ'),
          ],
          correct: 0,
          explanation: EX(
            'Verified: exactly one diagnostic, TS2353, on line A. The excess-property check fires only on a <b>fresh object literal</b> assigned straight to a typed target — it is a typo-catcher, not a structural rule. Route the same literal through a variable and the check is gone, because <code>raw</code> is no longer fresh and structural typing genuinely does only ask "does it have at least what <code>Note</code> needs?" (which is why option 3 describes the rule correctly but the wrong line). The trap bites hardest with a real typo: <code>{ tittle: &#x27;Hi&#x27;, body: &#x27;x&#x27; }</code> assigned directly is TS2353, but through a variable it becomes a <em>missing required property</em> error pointing at a different line. Type the variable at its declaration so the check fires where the data is written.',
            'Đã kiểm thật: đúng một lỗi, TS2353, ở dòng A. Phép kiểm thuộc tính thừa chỉ nổ trên một <b>object literal tươi</b> gán thẳng vào một đích có kiểu — nó là bộ bắt lỗi gõ nhầm, không phải quy tắc cấu trúc. Cho cùng literal ấy đi qua một biến là phép kiểm biến mất, vì <code>raw</code> không còn "tươi" và kiểu cấu trúc thật sự chỉ hỏi "nó có ít nhất những gì <code>Note</code> cần không?" (nên phương án 3 mô tả đúng quy tắc nhưng sai dòng). Cái bẫy đau nhất khi có lỗi gõ thật: <code>{ tittle: &#x27;Hi&#x27;, body: &#x27;x&#x27; }</code> gán trực tiếp là TS2353, nhưng qua một biến thì thành lỗi <em>thiếu thuộc tính bắt buộc</em> chỉ vào một dòng khác. Hãy gõ kiểu cho biến ngay chỗ khai báo để phép kiểm nổ đúng nơi dữ liệu được viết ra.',
          ),
        }),

        mcq({
          prompt: B(
            'One of these two files compiles and the other does not. Which statement is right?' + code(
              '// file 1\n' +
              'interface Box { width: number }\n' +
              'interface Box { height: number }\n' +
              'const b: Box = { width: 10, height: 20 };\n' +
              '\n' +
              '// file 2\n' +
              'type Box = { width: number };\n' +
              'type Box = { height: number };',
            ),
            'Một trong hai file biên dịch được, file kia thì không. Phát biểu nào đúng?' + code(
              '// file 1\n' +
              'interface Box { width: number }\n' +
              'interface Box { height: number }\n' +
              'const b: Box = { width: 10, height: 20 };\n' +
              '\n' +
              '// file 2\n' +
              'type Box = { width: number };\n' +
              'type Box = { height: number };',
            ),
          ),
          options: [
            B('File 1 compiles — the two interfaces <b>merge</b>, so <code>Box</code> has both properties; file 2 is <code>TS2300: Duplicate identifier</code>', 'File 1 chạy được — hai interface <b>gộp</b> lại nên <code>Box</code> có cả hai thuộc tính; file 2 là <code>TS2300: Duplicate identifier</code>'),
            B('File 1 compiles because the second declaration replaces the first; file 2 fails for the same reason', 'File 1 chạy được vì khai báo thứ hai thay khai báo thứ nhất; file 2 hỏng cũng vì lý do đó'),
            B('File 2 compiles — a type alias may be re-declared; file 1 is a duplicate-identifier error', 'File 2 chạy được — type alias được khai lại; file 1 là lỗi trùng định danh'),
            B('Both fail — you may never declare the same name twice in one scope', 'Cả hai đều hỏng — không bao giờ được khai cùng một tên hai lần trong một phạm vi'),
          ],
          correct: 0,
          explanation: EX(
            'Verified both ways: file 1 is silent, file 2 reports TS2300 twice (once per declaration). <b>Declaration merging</b> is the one real, load-bearing difference between <code>interface</code> and <code>type</code> — it is what makes chapter 10&#x27;s <code>declare module &#x27;express&#x27;</code> augmentation of <code>Request</code> possible at all. Option 2 is the common mental model and it is wrong: nothing is replaced, the members combine. The flip side is that merging can be an accident — copy a file, forget to rename, and a second <code>interface User</code> silently adds a required field to the first, with the errors landing at the call sites rather than at the duplicate. A type alias fails loudly instead, which is often the better default when you are not deliberately augmenting anything.',
            'Đã kiểm cả hai: file 1 im lặng, file 2 báo TS2300 hai lần (mỗi khai báo một lần). <b>Gộp khai báo</b> là khác biệt thật sự và chịu lực duy nhất giữa <code>interface</code> và <code>type</code> — chính nó cho phép việc bổ sung <code>Request</code> bằng <code>declare module &#x27;express&#x27;</code> ở chương 10. Phương án 2 là mô hình tư duy hay gặp và nó sai: không có gì bị thay, các thành viên kết hợp lại. Mặt trái là việc gộp có thể xảy ra do vô tình — chép một file, quên đổi tên, thế là một <code>interface User</code> thứ hai âm thầm thêm một field bắt buộc vào cái thứ nhất, lỗi lại rơi ở các chỗ gọi chứ không ở chỗ khai trùng. Type alias thì hỏng lớn tiếng, và đó thường là mặc định tốt hơn khi bạn không cố ý bổ sung gì cả.',
          ),
        }),

        mcq({
          prompt: B(
            'Where does the first error appear, and what does it say?' + code(
              'type A = { id: string };\n' +
              'type B = { id: number };\n' +
              'type C = A & B;\n' +
              "const c: C = { id: 'x' };",
            ),
            'Lỗi đầu tiên xuất hiện ở đâu, và nó nói gì?' + code(
              'type A = { id: string };\n' +
              'type B = { id: number };\n' +
              'type C = A & B;\n' +
              "const c: C = { id: 'x' };",
            ),
          ),
          options: [
            B('Nowhere — <code>A &amp; B</code> means "A or B", so a string id is fine', 'Không đâu cả — <code>A &amp; B</code> nghĩa là "A hoặc B", nên id kiểu chuỗi là ổn'),
            B('On line 3 — an intersection with conflicting property types is rejected at the declaration', 'Ở dòng 3 — một intersection có thuộc tính xung đột bị từ chối ngay tại khai báo'),
            B("On line 4 — <code>TS2322: Type &#x27;string&#x27; is not assignable to type &#x27;never&#x27;.</code>", "Ở dòng 4 — <code>TS2322: Type &#x27;string&#x27; is not assignable to type &#x27;never&#x27;.</code>"),
            B('On line 4 — <code>TS2322</code> saying <code>string</code> is not assignable to <code>number</code>', 'Ở dòng 4 — <code>TS2322</code> nói <code>string</code> không gán được cho <code>number</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Verified: the only diagnostic is TS2322 on line 4, and it names <code>never</code>, not <code>number</code>. An intersection is computed lazily and silently: <code>C[&#x27;id&#x27;]</code> becomes <code>string &amp; number</code>, which is <code>never</code> — so <code>C</code> is a type no object can ever satisfy, and line 3 draws no complaint at all. You find out later, at a construction site, with a message about a type you never wrote, pointing at perfectly reasonable code. That is the practical argument for <code>interface … extends</code> when you are composing object shapes and want a conflict to be an error: it reports TS2430 on the declaration itself. And note option 1 — <code>&amp;</code> is "and", it makes the type <em>bigger</em>; <code>|</code> is "or".',
            'Đã kiểm thật: lỗi duy nhất là TS2322 ở dòng 4, và nó gọi tên <code>never</code> chứ không phải <code>number</code>. Intersection được tính một cách lười và im lặng: <code>C[&#x27;id&#x27;]</code> thành <code>string &amp; number</code>, tức là <code>never</code> — nên <code>C</code> là một kiểu không object nào thoả nổi, còn dòng 3 thì chẳng kêu ca gì. Bạn chỉ biết về sau, ở một chỗ dựng object, với thông báo nhắc tới một kiểu bạn chưa từng viết, chỉ vào đoạn mã hoàn toàn hợp lý. Đó là lý do thực dụng để dùng <code>interface … extends</code> khi ghép các dáng object mà muốn xung đột thành lỗi: nó báo TS2430 ngay tại khai báo. Và để ý phương án 1 — <code>&amp;</code> là "và", nó làm kiểu <em>to ra</em>; <code>|</code> mới là "hoặc".',
          ),
        }),

        mcq({
          prompt: B(
            'This compiles cleanly under <code>--strict</code>. What does it print?' + code(
              'const counts: Record<string, number> = {};\n' +
              "counts['a'] = 1;\n" +
              'console.log(counts.missing + 1);\n' +
              'console.log(typeof counts.missing);',
            ),
            'Đoạn này biên dịch sạch dưới <code>--strict</code>. Nó in ra gì?' + code(
              'const counts: Record<string, number> = {};\n' +
              "counts['a'] = 1;\n" +
              'console.log(counts.missing + 1);\n' +
              'console.log(typeof counts.missing);',
            ),
          ),
          options: [
            B('<code>NaN</code> then <code>number</code>', '<code>NaN</code> rồi <code>number</code>'),
            B('It throws — reading a key that was never written is a runtime error', 'Nó ném lỗi — đọc một khoá chưa từng ghi là lỗi lúc chạy'),
            B('<code>1</code> then <code>number</code>', '<code>1</code> rồi <code>number</code>'),
            B('<code>NaN</code> then <code>undefined</code>', '<code>NaN</code> rồi <code>undefined</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Verified by running it. An index signature describes what a key would hold <b>if</b> it were there, not whether it is — so <code>counts.missing</code> is typed <code>number</code> and the compiler is silent, while at runtime the value is <code>undefined</code>, <code>undefined + 1</code> is <code>NaN</code>, and <code>typeof undefined</code> is the string <code>&#x27;undefined&#x27;</code>. Option 1 is the trap: the static type says <code>number</code>, but <code>typeof</code> reports the <em>runtime</em> value, and those are two different worlds. The <code>NaN</code> then propagates silently through every arithmetic step downstream. Two fixes: turn on <code>noUncheckedIndexedAccess</code> so the read becomes <code>number | undefined</code>, or close the key set with <code>Record&lt;&#x27;a&#x27; | &#x27;b&#x27;, number&gt;</code>.',
            'Đã chạy thật. Index signature mô tả một khoá sẽ chứa gì <b>nếu</b> nó có mặt, chứ không nói nó có mặt hay không — nên <code>counts.missing</code> mang kiểu <code>number</code> và trình biên dịch im lặng, còn lúc chạy giá trị là <code>undefined</code>, <code>undefined + 1</code> ra <code>NaN</code>, và <code>typeof undefined</code> là chuỗi <code>&#x27;undefined&#x27;</code>. Phương án 1 là cái bẫy: kiểu tĩnh nói <code>number</code>, nhưng <code>typeof</code> báo giá trị <em>lúc chạy</em>, hai thế giới khác nhau. Cái <code>NaN</code> đó rồi lan âm thầm qua mọi phép tính phía sau. Hai cách sửa: bật <code>noUncheckedIndexedAccess</code> để phép đọc thành <code>number | undefined</code>, hoặc đóng tập khoá lại bằng <code>Record&lt;&#x27;a&#x27; | &#x27;b&#x27;, number&gt;</code>.',
          ),
        }),
        // ── Chương 5 — Union, literal & thu hẹp kiểu ────────────────────
        mcq({
          prompt: B(
            'The author expected the <code>if</code> to isolate the array case. What does <code>tsc --strict</code> report?' + code(
              'function count(value: string | string[] | null): number {\n' +
              "  if (typeof value === 'object') {\n" +
              '    return value.length;\n' +
              '  }\n' +
              '  return value.length;\n' +
              '}',
            ),
            'Tác giả tưởng cái <code>if</code> tách riêng được trường hợp mảng. <code>tsc --strict</code> báo gì?' + code(
              'function count(value: string | string[] | null): number {\n' +
              "  if (typeof value === 'object') {\n" +
              '    return value.length;\n' +
              '  }\n' +
              '  return value.length;\n' +
              '}',
            ),
          ),
          options: [
            B("<code>TS2339: Property &#x27;length&#x27; does not exist on type &#x27;string | string[] | null&#x27;</code> on the last line", "<code>TS2339: Property &#x27;length&#x27; does not exist on type &#x27;string | string[] | null&#x27;</code> ở dòng cuối"),
            B('An error on the last line only, because <code>null</code> escapes the <code>if</code>', 'Chỉ lỗi ở dòng cuối, vì <code>null</code> lọt ra khỏi <code>if</code>'),
            B('Nothing — inside the <code>if</code> the type is <code>string[]</code>, outside it is <code>string</code>', 'Không gì — trong <code>if</code> kiểu là <code>string[]</code>, ngoài nó là <code>string</code>'),
            B("<code>TS18047: &#x27;value&#x27; is possibly &#x27;null&#x27;</code> inside the <code>if</code>", "<code>TS18047: &#x27;value&#x27; is possibly &#x27;null&#x27;</code> bên trong khối <code>if</code>"),
          ],
          correct: 3,
          explanation: EX(
            'Verified: the single diagnostic is TS18047 <em>inside</em> the <code>if</code>. <code>typeof null</code> really is <code>&#x27;object&#x27;</code> — a JavaScript wart TypeScript models faithfully — so the check narrows to <code>string[] | null</code>, not <code>string[]</code>, and <code>null.length</code> would throw. The last line is fine: after the <code>if</code>, the only remaining possibility is <code>string</code>, which does have <code>length</code>. Narrow the null out explicitly first (<code>if (value === null) return 0</code>, or <code>if (value != null)</code>) and only then ask what kind of object you are holding. Note that the compiler <em>did</em> flag it — the failure mode in real code is reaching for <code>!</code> instead of reading the message.',
            'Đã kiểm thật: lỗi duy nhất là TS18047 <em>bên trong</em> khối <code>if</code>. <code>typeof null</code> đúng là <code>&#x27;object&#x27;</code> — một cái tật của JavaScript mà TypeScript mô hình hoá trung thực — nên phép kiểm thu hẹp về <code>string[] | null</code> chứ không phải <code>string[]</code>, và <code>null.length</code> sẽ ném lỗi. Dòng cuối thì ổn: sau <code>if</code>, khả năng còn lại chỉ là <code>string</code>, mà chuỗi thì có <code>length</code>. Hãy loại null ra trước cho rõ (<code>if (value === null) return 0</code>, hoặc <code>if (value != null)</code>) rồi mới hỏi mình đang cầm loại object nào. Lưu ý trình biên dịch <em>đã</em> báo — kiểu hỏng ngoài đời là người ta với tay lấy dấu <code>!</code> thay vì đọc thông báo.',
          ),
        }),

        mcq({
          prompt: B(
            'Someone copy-pasted a case and forgot to change one field. What does the compiler say?' + code(
              'type Shape =\n' +
              "  | { kind: 'circle'; r: number }\n" +
              "  | { kind: 'square'; side: number };\n" +
              '\n' +
              'function area(shape: Shape): number {\n' +
              '  switch (shape.kind) {\n' +
              "    case 'circle': return Math.PI * shape.r ** 2;\n" +
              "    case 'square': return shape.r ** 2;\n" +
              '  }\n' +
              '}',
            ),
            'Có người chép lại một case rồi quên đổi một field. Trình biên dịch nói gì?' + code(
              'type Shape =\n' +
              "  | { kind: 'circle'; r: number }\n" +
              "  | { kind: 'square'; side: number };\n" +
              '\n' +
              'function area(shape: Shape): number {\n' +
              '  switch (shape.kind) {\n' +
              "    case 'circle': return Math.PI * shape.r ** 2;\n" +
              "    case 'square': return shape.r ** 2;\n" +
              '  }\n' +
              '}',
            ),
          ),
          options: [
            B('Nothing — <code>r</code> exists somewhere in the union, so the access is allowed', 'Không gì — <code>r</code> có tồn tại đâu đó trong union nên phép truy cập được cho qua'),
            B("<code>TS2339: Property &#x27;r&#x27; does not exist on type &#x27;{ kind: &quot;square&quot;; side: number; }&#x27;.</code>", "<code>TS2339: Property &#x27;r&#x27; does not exist on type &#x27;{ kind: &quot;square&quot;; side: number; }&#x27;.</code>"),
            B('<code>TS2339</code> naming the whole <code>Shape</code> union, because a switch cannot narrow', '<code>TS2339</code> gọi tên cả union <code>Shape</code>, vì switch không thu hẹp được'),
            B('Nothing at compile time; <code>shape.r</code> is <code>undefined</code> and the result is <code>NaN</code>', 'Không lỗi lúc biên dịch; <code>shape.r</code> là <code>undefined</code> và kết quả là <code>NaN</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified. Because <code>kind</code> is a <b>literal</b> type on each member, <code>switch (shape.kind)</code> narrows <code>shape</code> to exactly one variant per case — so inside <code>case &#x27;square&#x27;</code> the type is the square variant alone, and the error names that variant rather than the whole union. That precision is the point of a discriminated union: the right fields become available and the wrong ones stay hidden, with no casts and no <code>in</code> checks. Option 4 describes what plain JavaScript would do, and it is the bug this pattern exists to prevent.',
            'Đã kiểm thật. Vì <code>kind</code> mang kiểu <b>literal</b> ở từng thành viên, <code>switch (shape.kind)</code> thu hẹp <code>shape</code> về đúng một biến thể trong mỗi case — nên trong <code>case &#x27;square&#x27;</code> kiểu chỉ còn biến thể hình vuông, và lỗi gọi tên đúng biến thể đó chứ không phải cả union. Sự chính xác ấy chính là điểm mạnh của discriminated union: field đúng thì hiện ra, field sai thì ẩn đi, không cần ép kiểu, không cần kiểm bằng <code>in</code>. Phương án 4 mô tả điều JavaScript thuần sẽ làm, và đó đúng là con bug mà mẫu này sinh ra để chặn.',
          ),
        }),

        mcq({
          prompt: B(
            'A third variant was added to <code>Shape</code> and nobody touched <code>area</code>. Why does the build now fail on the <code>default</code> branch?' + code(
              'type Shape =\n' +
              "  | { kind: 'circle'; r: number }\n" +
              "  | { kind: 'square'; side: number }\n" +
              "  | { kind: 'triangle'; base: number; height: number };   // new\n" +
              '\n' +
              'function area(shape: Shape): number {\n' +
              '  switch (shape.kind) {\n' +
              "    case 'circle': return Math.PI * shape.r ** 2;\n" +
              "    case 'square': return shape.side ** 2;\n" +
              '    default: {\n' +
              '      const _exhaustive: never = shape;\n' +
              '      return _exhaustive;\n' +
              '    }\n' +
              '  }\n' +
              '}',
            ),
            'Một biến thể thứ ba được thêm vào <code>Shape</code> và không ai đụng tới <code>area</code>. Vì sao bản build giờ hỏng ở nhánh <code>default</code>?' + code(
              'type Shape =\n' +
              "  | { kind: 'circle'; r: number }\n" +
              "  | { kind: 'square'; side: number }\n" +
              "  | { kind: 'triangle'; base: number; height: number };   // mới\n" +
              '\n' +
              'function area(shape: Shape): number {\n' +
              '  switch (shape.kind) {\n' +
              "    case 'circle': return Math.PI * shape.r ** 2;\n" +
              "    case 'square': return shape.side ** 2;\n" +
              '    default: {\n' +
              '      const _exhaustive: never = shape;\n' +
              '      return _exhaustive;\n' +
              '    }\n' +
              '  }\n' +
              '}',
            ),
          ),
          options: [
            B('Because <code>never</code> may only be used as a return type, never as a variable annotation', 'Vì <code>never</code> chỉ được dùng làm kiểu trả về, không được làm chú thích cho biến'),
            B('Because a <code>switch</code> over a union must list every case, with or without the <code>never</code> line', 'Vì một <code>switch</code> trên union bắt buộc phải liệt kê mọi case, có hay không có dòng <code>never</code>'),
            B('Because the triangle can now reach <code>default</code>, so <code>shape</code> there is no longer <code>never</code> — <code>TS2322</code> names the exact variant you forgot', 'Vì hình tam giác giờ có thể tới được <code>default</code>, nên <code>shape</code> ở đó không còn là <code>never</code> — <code>TS2322</code> gọi đúng tên biến thể bạn quên'),
            B('Because <code>return _exhaustive</code> returns <code>never</code>, which is not a <code>number</code>', 'Vì <code>return _exhaustive</code> trả về <code>never</code>, mà <code>never</code> không phải <code>number</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Verified: the exact message is <em>Type &#x27;{ kind: "triangle"; base: number; height: number; }&#x27; is not assignable to type &#x27;never&#x27;</em>, reported on the <code>const _exhaustive</code> line. Nothing is assignable to <code>never</code>, so that assignment only type-checks while the compiler can prove the branch is unreachable — which it can exactly as long as every variant has its own <code>case</code>. Add a variant and the proof collapses, and the error lands in the function you forgot to update rather than three modules away as a runtime bug. Option 2 is the tempting one: a <code>switch</code> is <em>not</em> required to be exhaustive on its own; the <code>never</code> assignment is what buys the guarantee. And note the corollary — writing <code>default: return 0</code> instead would cancel the whole check silently.',
            'Đã kiểm thật: thông báo nguyên văn là <em>Type &#x27;{ kind: "triangle"; base: number; height: number; }&#x27; is not assignable to type &#x27;never&#x27;</em>, báo ngay ở dòng <code>const _exhaustive</code>. Không gì gán được cho <code>never</code>, nên phép gán đó chỉ qua kiểm khi trình biên dịch chứng minh được nhánh này không thể tới — và nó chứng minh được đúng chừng nào mọi biến thể đều có <code>case</code> riêng. Thêm một biến thể là chứng minh sụp, và lỗi rơi vào đúng hàm bạn quên cập nhật chứ không phải thành bug lúc chạy ở một module cách đó ba tầng. Phương án 2 là cái bẫy: một <code>switch</code> <em>không</em> bắt buộc phải đầy đủ; chính phép gán <code>never</code> mới mua được bảo đảm đó. Và hệ quả đáng nhớ: viết <code>default: return 0</code> sẽ âm thầm huỷ toàn bộ phép kiểm này.',
          ),
        }),

        mcq({
          prompt: B(
            'Someone "cleaned up" two variants into interfaces. The switch now fails. Why?' + code(
              'interface Circle { kind: string; radius: number }\n' +
              'interface Square { kind: string; side: number }\n' +
              'type Shape = Circle | Square;\n' +
              '\n' +
              'function f(s: Shape): number {\n' +
              '  switch (s.kind) {\n' +
              "    case 'circle': return s.radius;\n" +
              '    default: return 0;\n' +
              '  }\n' +
              '}',
            ),
            'Có người "dọn dẹp" hai biến thể thành interface. Cái switch giờ hỏng. Vì sao?' + code(
              'interface Circle { kind: string; radius: number }\n' +
              'interface Square { kind: string; side: number }\n' +
              'type Shape = Circle | Square;\n' +
              '\n' +
              'function f(s: Shape): number {\n' +
              '  switch (s.kind) {\n' +
              "    case 'circle': return s.radius;\n" +
              '    default: return 0;\n' +
              '  }\n' +
              '}',
            ),
          ),
          options: [
            B('Nothing is wrong — it compiles, and <code>s.radius</code> is <code>number | undefined</code>', 'Không có gì sai — nó biên dịch được, và <code>s.radius</code> là <code>number | undefined</code>'),
            B('The discriminant is typed <code>string</code>, not a literal, so the case cannot exclude <code>Square</code> — <code>TS2339: Property &#x27;radius&#x27; does not exist on type &#x27;Shape&#x27;</code>', 'Trường nhãn mang kiểu <code>string</code> chứ không phải literal, nên case không loại được <code>Square</code> — <code>TS2339: Property &#x27;radius&#x27; does not exist on type &#x27;Shape&#x27;</code>'),
            B('A discriminated union must be written with <code>type</code>; <code>interface</code> members are never narrowed', 'Discriminated union bắt buộc viết bằng <code>type</code>; thành viên là <code>interface</code> không bao giờ được thu hẹp'),
            B('The <code>default</code> branch makes the switch non-exhaustive, which disables narrowing in every case', 'Nhánh <code>default</code> làm switch không đầy đủ, và điều đó tắt thu hẹp ở mọi case'),
          ],
          correct: 1,
          explanation: EX(
            'Verified: TS2339, with the second line of the message spelling out <em>Property &#x27;radius&#x27; does not exist on type &#x27;Square&#x27;</em>. A union is only <b>discriminated</b> when the shared field&#x27;s type is a <em>literal</em> (<code>kind: &#x27;circle&#x27;</code>), because that is what lets a <code>case</code> rule the other variants out. Declare it <code>kind: string</code> and every variant still matches every case, so narrowing silently does nothing and the error points at your property access rather than at the declaration that caused it. Option 3 is wrong — <code>interface</code> members discriminate perfectly well once the field is a literal. Whenever a discriminated union "stops narrowing", hover the discriminant first: if it says <code>string</code>, you have found the bug.',
            'Đã kiểm thật: TS2339, và dòng thứ hai của thông báo nói rõ <em>Property &#x27;radius&#x27; does not exist on type &#x27;Square&#x27;</em>. Một union chỉ <b>có nhãn</b> khi kiểu của field chung là một <em>literal</em> (<code>kind: &#x27;circle&#x27;</code>), vì chính điều đó cho phép một <code>case</code> loại các biến thể khác ra. Khai là <code>kind: string</code> thì mọi biến thể vẫn khớp mọi case, nên thu hẹp âm thầm chẳng làm gì, và lỗi lại chỉ vào chỗ bạn truy cập thuộc tính chứ không vào khai báo đã gây ra nó. Phương án 3 sai — thành viên là <code>interface</code> vẫn phân biệt tốt khi field là literal. Hễ một discriminated union "ngừng thu hẹp", hãy rê chuột lên trường nhãn trước: nếu nó ghi <code>string</code> thì bạn đã tìm ra bug.',
          ),
        }),
        // ── Chương 6 — Generics ─────────────────────────────────────────
        mcq({
          prompt: B(
            'The two functions differ by one keyword. Which line does <code>tsc --strict</code> reject?' + code(
              'function idAny(x: any) { return x; }\n' +
              'function idGen<T>(x: T): T { return x; }\n' +
              '\n' +
              'let count = 42;\n' +
              'const a = idAny(count);\n' +
              'const b = idGen(count);\n' +
              '\n' +
              'a.toUpperCase();   // A\n' +
              'b.toUpperCase();   // B',
            ),
            'Hai hàm chỉ khác nhau một từ khoá. <code>tsc --strict</code> từ chối dòng nào?' + code(
              'function idAny(x: any) { return x; }\n' +
              'function idGen<T>(x: T): T { return x; }\n' +
              '\n' +
              'let count = 42;\n' +
              'const a = idAny(count);\n' +
              'const b = idGen(count);\n' +
              '\n' +
              'a.toUpperCase();   // A\n' +
              'b.toUpperCase();   // B',
            ),
          ),
          options: [
            B('A only — <code>any</code> is checked more strictly than a bare type parameter', 'Chỉ A — <code>any</code> bị kiểm chặt hơn một tham số kiểu trần'),
            B("B only — <code>TS2339: Property &#x27;toUpperCase&#x27; does not exist on type &#x27;number&#x27;.</code>", "Chỉ B — <code>TS2339: Property &#x27;toUpperCase&#x27; does not exist on type &#x27;number&#x27;.</code>"),
            B('Both — neither <code>any</code> nor <code>T</code> guarantees a string method', 'Cả hai — cả <code>any</code> lẫn <code>T</code> đều không bảo đảm có phương thức của chuỗi'),
            B('Neither — the round trip loses the type in both cases', 'Không dòng nào — vòng đi-về làm mất kiểu trong cả hai trường hợp'),
          ],
          correct: 1,
          explanation: EX(
            'Verified: the only diagnostic is TS2339 on line B. <code>idAny</code> takes <code>any</code> and returns <code>any</code>, so <code>a</code> is <code>any</code> — every check is off, line A compiles, and it explodes at runtime. <code>idGen</code> declares <code>(x: T): T</code>, so <code>T</code> is <b>inferred</b> from the argument (no <code>idGen&lt;number&gt;(…)</code> needed) and the return type is the same <code>T</code>: the type survived the round trip, and calling a string method on a number is caught. That is the whole difference — <code>any</code> means "stop checking", a type parameter means "check, but for whatever type the caller brings".',
            'Đã kiểm thật: lỗi duy nhất là TS2339 ở dòng B. <code>idAny</code> nhận <code>any</code> và trả về <code>any</code> nên <code>a</code> là <code>any</code> — mọi phép kiểm tắt, dòng A biên dịch được, rồi nổ lúc chạy. <code>idGen</code> khai <code>(x: T): T</code> nên <code>T</code> được <b>suy ra</b> từ đối số (chẳng cần viết <code>idGen&lt;number&gt;(…)</code>) và kiểu trả về vẫn là <code>T</code> đó: kiểu sống sót qua vòng đi-về, và gọi phương thức của chuỗi trên một số thì bị bắt. Khác biệt nằm trọn ở đó — <code>any</code> nghĩa là "ngừng kiểm", còn tham số kiểu nghĩa là "vẫn kiểm, nhưng theo kiểu mà bên gọi mang tới".',
          ),
        }),

        mcq({
          prompt: B(
            'What exactly does the compiler say about the last line?' + code(
              'function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {\n' +
              '  return obj[key];\n' +
              '}\n' +
              "const user = { id: 1, name: 'Ada' };\n" +
              "getProp(user, 'email');",
            ),
            'Trình biên dịch nói chính xác điều gì về dòng cuối?' + code(
              'function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {\n' +
              '  return obj[key];\n' +
              '}\n' +
              "const user = { id: 1, name: 'Ada' };\n" +
              "getProp(user, 'email');",
            ),
          ),
          options: [
            B("<code>TS2345: Argument of type &#x27;&quot;email&quot;&#x27; is not assignable to parameter of type &#x27;&quot;id&quot; | &quot;name&quot;&#x27;.</code>", "<code>TS2345: Argument of type &#x27;&quot;email&quot;&#x27; is not assignable to parameter of type &#x27;&quot;id&quot; | &quot;name&quot;&#x27;.</code>"),
            B("<code>TS2339: Property &#x27;email&#x27; does not exist on type &#x27;{ id: number; name: string }&#x27;.</code>", "<code>TS2339: Property &#x27;email&#x27; does not exist on type &#x27;{ id: number; name: string }&#x27;.</code>"),
            B('It compiles, and <code>T[K]</code> resolves to <code>undefined</code>', 'Nó biên dịch được, và <code>T[K]</code> giải ra thành <code>undefined</code>'),
            B('Nothing — <code>K</code> is only constrained to <code>string</code>, so any key name is accepted', 'Không gì — <code>K</code> chỉ bị ràng buộc về <code>string</code>, nên tên khoá nào cũng được nhận'),
          ],
          correct: 0,
          explanation: EX(
            'Verified, and the exact wording matters here. <code>keyof T</code> is the <b>union of key names</b> — for this object literally <code>&quot;id&quot; | &quot;name&quot;</code> — so <code>K extends keyof T</code> makes the <em>key parameter</em> the thing that fails to type-check, giving TS2345 at the argument rather than TS2339 at a property access. The payoff of the same signature is on the good calls: <code>getProp(user, &#x27;id&#x27;)</code> is typed <code>number</code> and <code>getProp(user, &#x27;name&#x27;)</code> is typed <code>string</code>, because <code>T[K]</code> is an indexed access resolved per call. One caveat worth carrying: if <code>T</code> has an index signature, <code>keyof T</code> collapses to <code>string | number</code> and this protection quietly disappears.',
            'Đã kiểm thật, và ở đây từng chữ trong thông báo mới là điểm mấu chốt. <code>keyof T</code> là <b>union tên các khoá</b> — với object này thì đúng là <code>&quot;id&quot; | &quot;name&quot;</code> — nên <code>K extends keyof T</code> khiến chính <em>tham số khoá</em> mới là thứ trượt kiểm, cho ra TS2345 ngay tại đối số chứ không phải TS2339 tại một phép truy cập thuộc tính. Cái lợi của đúng chữ ký đó nằm ở các lời gọi hợp lệ: <code>getProp(user, &#x27;id&#x27;)</code> mang kiểu <code>number</code> còn <code>getProp(user, &#x27;name&#x27;)</code> mang kiểu <code>string</code>, vì <code>T[K]</code> là truy cập theo chỉ mục, giải ra riêng cho từng lời gọi. Một lưu ý đáng mang theo: nếu <code>T</code> có index signature thì <code>keyof T</code> sụp thành <code>string | number</code> và lớp bảo vệ này lặng lẽ biến mất.',
          ),
        }),

        mcq({
          prompt: B(
            'This file compiles with zero errors under <code>--strict</code>, then crashes when run. What is wrong with the signature?' + code(
              'function firstBad<T>(a: any[]): T { return a[0]; }\n' +
              'interface User { id: number; name: string }\n' +
              '\n' +
              "const u = firstBad<User>(['a', 'b']);\n" +
              'console.log(u.name.toUpperCase());   // TypeError at runtime',
            ),
            'File này biên dịch không lỗi nào dưới <code>--strict</code>, rồi sập khi chạy. Chữ ký sai ở chỗ nào?' + code(
              'function firstBad<T>(a: any[]): T { return a[0]; }\n' +
              'interface User { id: number; name: string }\n' +
              '\n' +
              "const u = firstBad<User>(['a', 'b']);\n" +
              'console.log(u.name.toUpperCase());   // TypeError lúc chạy',
            ),
          ),
          options: [
            B('It is missing a constraint; <code>&lt;T extends object&gt;</code> would have caught the string array', 'Nó thiếu ràng buộc; <code>&lt;T extends object&gt;</code> đã bắt được mảng chuỗi'),
            B('Nothing is wrong with the signature — the caller should not have written the type argument', 'Chữ ký không sai gì cả — lẽ ra bên gọi đừng viết đối số kiểu'),
            B('<code>T</code> appears only in the return position, so nothing constrains it — the "generic" is an unchecked cast in disguise', '<code>T</code> chỉ xuất hiện ở vị trí trả về nên chẳng có gì ràng buộc nó — cái "generic" này thực chất là một phép ép kiểu không kiểm, khoác áo generic'),
            B('The parameter should have been <code>a: T[]</code> and the return <code>any</code>', 'Tham số lẽ ra phải là <code>a: T[]</code> và kiểu trả về là <code>any</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Verified: <code>tsc</code> is completely silent, and running it throws <em>TypeError: Cannot read properties of undefined (reading &#x27;toUpperCase&#x27;)</em>. A type parameter is a <b>relationship</b>; it only earns its place when the same <code>T</code> appears in two or more spots, tying an input to an output. Here it appears once, in the return position, so there is nothing to infer it from — the caller simply declares the answer and the compiler agrees, exactly like <code>as User</code> but harder to spot in review. Option 1 does not help: <code>&lt;T extends object&gt;</code> constrains what the <em>caller may claim</em>, not what the array actually holds. The honest signature is <code>function first&lt;T&gt;(a: T[]): T | undefined</code>, where <code>T</code> is inferred from the argument. This is the same flaw as a <code>getJson&lt;T&gt;(url): Promise&lt;T&gt;</code> wrapper, which is why chapter 13 parses at the boundary instead.',
            'Đã kiểm thật: <code>tsc</code> hoàn toàn im lặng, còn chạy thì ném <em>TypeError: Cannot read properties of undefined (reading &#x27;toUpperCase&#x27;)</em>. Một tham số kiểu là một <b>quan hệ</b>; nó chỉ xứng đáng có mặt khi cùng một <code>T</code> xuất hiện ở hai chỗ trở lên, nối một đầu vào với một đầu ra. Ở đây nó xuất hiện đúng một lần, ở vị trí trả về, nên chẳng có gì để suy ra — bên gọi chỉ việc tự khai đáp án và trình biên dịch gật đầu, y hệt <code>as User</code> nhưng khó phát hiện hơn khi review. Phương án 1 không cứu được: <code>&lt;T extends object&gt;</code> ràng buộc thứ <em>bên gọi được phép khai</em>, không phải thứ mảng thật sự chứa. Chữ ký trung thực là <code>function first&lt;T&gt;(a: T[]): T | undefined</code>, ở đó <code>T</code> được suy từ đối số. Đây cũng đúng là khiếm khuyết của một wrapper <code>getJson&lt;T&gt;(url): Promise&lt;T&gt;</code>, và vì thế chương 13 chọn parse ngay tại biên.',
          ),
        }),

        mcq({
          prompt: B(
            'What are the inferred types of <code>arr</code> and <code>str</code>, and what happens on the last line?' + code(
              'function longest<T extends { length: number }>(a: T, b: T): T {\n' +
              '  return a.length > b.length ? a : b;\n' +
              '}\n' +
              'const arr = longest([1, 2], [1, 2, 3]);\n' +
              "const str = longest('hi', 'world');\n" +
              'longest(10, 20);',
            ),
            'Kiểu suy ra của <code>arr</code> và <code>str</code> là gì, và dòng cuối xảy ra chuyện gì?' + code(
              'function longest<T extends { length: number }>(a: T, b: T): T {\n' +
              '  return a.length > b.length ? a : b;\n' +
              '}\n' +
              'const arr = longest([1, 2], [1, 2, 3]);\n' +
              "const str = longest('hi', 'world');\n" +
              'longest(10, 20);',
            ),
          ),
          options: [
            B("<code>arr: number[]</code> and <code>str: string</code>; the last line is <code>TS2345: Argument of type &#x27;number&#x27; is not assignable to parameter of type &#x27;{ length: number; }&#x27;.</code>", "<code>arr: number[]</code> và <code>str: string</code>; dòng cuối là <code>TS2345: Argument of type &#x27;number&#x27; is not assignable to parameter of type &#x27;{ length: number; }&#x27;.</code>"),
            B('<code>arr: number[]</code> and <code>str: string</code>; the last line compiles and returns <code>20</code>', '<code>arr: number[]</code> và <code>str: string</code>; dòng cuối biên dịch được và trả về <code>20</code>'),
            B('Both are <code>any</code>, because a constrained <code>T</code> cannot be inferred', 'Cả hai là <code>any</code>, vì một <code>T</code> có ràng buộc thì không suy được'),
            B('Both are <code>{ length: number }</code>; the last line compiles because numbers have a length at runtime', 'Cả hai là <code>{ length: number }</code>; dòng cuối biên dịch được vì lúc chạy số vẫn có length'),
          ],
          correct: 0,
          explanation: EX(
            'Verified two ways: the emitted declaration file says <code>arr: number[]</code> and <code>str: string</code>, and the last line reports TS2345. The point to take away is that a constraint sets a <b>floor</b>, not a ceiling: <code>T</code> is still the caller&#x27;s real type, so you get <code>number[]</code> back rather than the widened <code>{ length: number }</code> of option 4 — which is exactly why a constrained generic beats simply annotating the parameter as <code>{ length: number }</code>. The constraint&#x27;s other job is to unlock the body: without it, reading <code>a.length</code> off a bare <code>T</code> is TS2339, because nothing promised <code>T</code> has a length.',
            'Đã kiểm hai đường: file khai báo xuất ra ghi <code>arr: number[]</code> và <code>str: string</code>, còn dòng cuối báo TS2345. Điều cần nhớ là ràng buộc đặt một <b>sàn</b>, không phải trần: <code>T</code> vẫn là kiểu thật của bên gọi, nên bạn nhận lại <code>number[]</code> chứ không phải cái <code>{ length: number }</code> đã bị nới rộng như phương án 4 — và đó chính là lý do một generic có ràng buộc hơn hẳn việc chỉ chú thích tham số là <code>{ length: number }</code>. Việc còn lại của ràng buộc là mở khoá phần thân hàm: không có nó, đọc <code>a.length</code> trên một <code>T</code> trần là TS2339, vì chẳng ai hứa <code>T</code> có length.',
          ),
        }),
        // ── Chương 7 — Kiểu nâng cao ────────────────────────────────────
        mcq({
          prompt: B(
            'Exactly one of the two assignments is an error. Which, and what does <code>Mutable</code> actually do?' + code(
              'interface Config { readonly host: string; readonly port: number }\n' +
              'type Mutable<T> = { -readonly [K in keyof T]: T[K] };\n' +
              '\n' +
              "const c: Mutable<Config> = { host: 'localhost', port: 5432 };\n" +
              'c.port = 5433;                                    // A\n' +
              '\n' +
              "const orig: Config = { host: 'x', port: 1 };\n" +
              'orig.port = 2;                                    // B',
            ),
            'Đúng một trong hai phép gán là lỗi. Cái nào, và <code>Mutable</code> thật sự làm gì?' + code(
              'interface Config { readonly host: string; readonly port: number }\n' +
              'type Mutable<T> = { -readonly [K in keyof T]: T[K] };\n' +
              '\n' +
              "const c: Mutable<Config> = { host: 'localhost', port: 5432 };\n" +
              'c.port = 5433;                                    // A\n' +
              '\n' +
              "const orig: Config = { host: 'x', port: 1 };\n" +
              'orig.port = 2;                                    // B',
            ),
          ),
          options: [
            B("B fails with <code>TS2540: Cannot assign to &#x27;port&#x27; because it is a read-only property</code> — <code>-readonly</code> stripped the modifier only on the mapped copy", "B hỏng với <code>TS2540: Cannot assign to &#x27;port&#x27; because it is a read-only property</code> — <code>-readonly</code> chỉ gỡ modifier trên bản ánh xạ"),
            B('Both fail — a mapped type cannot remove a modifier the source interface declared', 'Cả hai hỏng — mapped type không gỡ được modifier mà interface gốc đã khai'),
            B('Neither fails — <code>readonly</code> is erased at compile time, so both assignments are allowed', 'Không cái nào hỏng — <code>readonly</code> bị xoá lúc biên dịch nên cả hai phép gán đều được'),
            B('A fails — the minus sign <em>removes</em> the property, so <code>port</code> is not on <code>Mutable&lt;Config&gt;</code>', 'A hỏng — dấu trừ <em>xoá</em> thuộc tính, nên <code>port</code> không có trên <code>Mutable&lt;Config&gt;</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified: the only diagnostic is TS2540 on line B. A mapped type builds a <b>fresh</b> type, so <code>Mutable&lt;Config&gt;</code> is a writable twin while the original <code>Config</code> keeps its <code>readonly</code> — that contrast is the whole demonstration. Plain <code>readonly</code> and <code>?</code> in a mapped type always <em>add</em>; only the minus prefix subtracts, which is how you write <code>Mutable&lt;T&gt;</code> (there is no built-in) and how the built-in <code>Required&lt;T&gt;</code> is written with <code>-?</code>. Option 3 is half true and wrong where it counts: <code>readonly</code> really is erased before the code runs, but it is enforced everywhere the type is used, which is the point.',
            'Đã kiểm thật: lỗi duy nhất là TS2540 ở dòng B. Mapped type dựng ra một kiểu <b>mới hoàn toàn</b>, nên <code>Mutable&lt;Config&gt;</code> là bản sinh đôi ghi được, còn <code>Config</code> gốc vẫn giữ <code>readonly</code> — chính sự tương phản đó là toàn bộ phần minh hoạ. Trong mapped type, <code>readonly</code> và <code>?</code> viết trơn thì luôn <em>thêm</em>; chỉ tiền tố dấu trừ mới trừ đi, và đó là cách viết <code>Mutable&lt;T&gt;</code> (không có sẵn trong thư viện) cũng như cách <code>Required&lt;T&gt;</code> có sẵn được viết bằng <code>-?</code>. Phương án 3 đúng một nửa và sai đúng chỗ quan trọng: <code>readonly</code> thật sự bị xoá trước khi mã chạy, nhưng nó được ép ở mọi nơi dùng kiểu đó — và đó mới là điều đáng nói.',
          ),
        }),

        mcq({
          prompt: B(
            'Reading the compiler output, what are <code>A</code> and <code>C</code>?' + code(
              'type IsString<T>  = T extends string ? true : false;\n' +
              'type Bracketed<T> = [T] extends [string] ? true : false;\n' +
              '\n' +
              'type A = IsString<string | number>;\n' +
              'type C = Bracketed<string | number>;\n' +
              '\n' +
              'const a1: A = true;    // accepted\n' +
              'const a2: A = false;   // accepted\n' +
              "const c1: C = true;    // TS2322: Type 'true' is not assignable to type 'false'.",
            ),
            'Đọc kết quả trình biên dịch, <code>A</code> và <code>C</code> là gì?' + code(
              'type IsString<T>  = T extends string ? true : false;\n' +
              'type Bracketed<T> = [T] extends [string] ? true : false;\n' +
              '\n' +
              'type A = IsString<string | number>;\n' +
              'type C = Bracketed<string | number>;\n' +
              '\n' +
              'const a1: A = true;    // được nhận\n' +
              'const a2: A = false;   // được nhận\n' +
              "const c1: C = true;    // TS2322: Type 'true' is not assignable to type 'false'.",
            ),
          ),
          options: [
            B('<code>A</code> is <code>true</code>, because <code>string</code> is one of the members', '<code>A</code> là <code>true</code>, vì <code>string</code> là một trong các thành viên'),
            B('Both are <code>boolean</code>; the square brackets only change the syntax, not the result', 'Cả hai là <code>boolean</code>; cặp ngoặc vuông chỉ đổi cú pháp chứ không đổi kết quả'),
            B('<code>A</code> is <code>false</code> and <code>C</code> is <code>false</code> — a union is never assignable to <code>string</code>', '<code>A</code> là <code>false</code> và <code>C</code> là <code>false</code> — một union không bao giờ gán được cho <code>string</code>'),
            B('<code>A</code> is <code>boolean</code> (the conditional <b>distributed</b> over the union and both results merged) and <code>C</code> is <code>false</code>', '<code>A</code> là <code>boolean</code> (conditional <b>phân phối</b> trên union rồi hai kết quả gộp lại) và <code>C</code> là <code>false</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Verified: both <code>true</code> and <code>false</code> are accepted for <code>A</code> (so <code>A</code> is <code>boolean</code>), while <code>const c1: C = true</code> is TS2322 naming <code>false</code>. When a <b>naked</b> type parameter is tested in a conditional, the conditional <em>distributes</em>: it runs once per union member and the results are unioned back together, so <code>true | false</code> collapses to <code>boolean</code>. That behaviour is what makes <code>Exclude</code> and <code>NonNullable</code> work, and it is also what silently gives the wrong answer when you meant to ask about the union as a whole. Wrapping both sides in a tuple — <code>[T] extends [string]</code> — switches distribution off, so the union is tested as one thing and the answer is <code>false</code>. Nothing errors when this goes wrong; the type is just quietly incorrect.',
            'Đã kiểm thật: cả <code>true</code> lẫn <code>false</code> đều được nhận cho <code>A</code> (nên <code>A</code> là <code>boolean</code>), còn <code>const c1: C = true</code> báo TS2322 gọi tên <code>false</code>. Khi một tham số kiểu <b>trần</b> được đem thử trong conditional, conditional sẽ <em>phân phối</em>: nó chạy một lần cho mỗi thành viên của union rồi hợp các kết quả lại, nên <code>true | false</code> sụp thành <code>boolean</code>. Chính hành vi đó làm <code>Exclude</code> và <code>NonNullable</code> chạy được, và cũng chính nó âm thầm trả lời sai khi ý bạn là hỏi về cả union. Bọc hai vế trong tuple — <code>[T] extends [string]</code> — sẽ tắt phân phối, union được thử như một khối và câu trả lời là <code>false</code>. Không có lỗi nào báo khi chuyện này đi sai; kiểu chỉ đơn giản là sai một cách lặng lẽ.',
          ),
        }),

        mcq({
          prompt: B(
            'Two errors, one per marked line. Which pair is right?' + code(
              "type Lang = 'en' | 'vi';\n" +
              'type Route = `/${Lang}/home`;\n' +
              "const bad: Route = '/fr/home';                                // A\n" +
              '\n' +
              'type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };\n' +
              'interface Person { name: string; age: number }\n' +
              "const p: Getters<Person> = { getName: () => 'Ada', getAge: () => 3 };\n" +
              'p.getAge().toUpperCase();                                     // B',
            ),
            'Hai lỗi, mỗi dòng đánh dấu một lỗi. Cặp nào đúng?' + code(
              "type Lang = 'en' | 'vi';\n" +
              'type Route = `/${Lang}/home`;\n' +
              "const bad: Route = '/fr/home';                                // A\n" +
              '\n' +
              'type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };\n' +
              'interface Person { name: string; age: number }\n' +
              "const p: Getters<Person> = { getName: () => 'Ada', getAge: () => 3 };\n" +
              'p.getAge().toUpperCase();                                     // B',
            ),
          ),
          options: [
            B("A: <code>TS2322</code> — <code>Route</code> expanded to <code>&#x27;/en/home&#x27; | &#x27;/vi/home&#x27;</code> — B: <code>TS2339</code>, because <code>getAge()</code> returns <code>number</code>", "A: <code>TS2322</code> — <code>Route</code> nở ra thành <code>&#x27;/en/home&#x27; | &#x27;/vi/home&#x27;</code> — B: <code>TS2339</code>, vì <code>getAge()</code> trả về <code>number</code>"),
            B('A: <code>TS2322</code> — B: no error, since every generated getter returns <code>string</code>', 'A: <code>TS2322</code> — B: không lỗi, vì mọi getter sinh ra đều trả về <code>string</code>'),
            B('Both lines fail for the same reason: template literal types are checked only at runtime', 'Cả hai dòng hỏng vì cùng một lý do: template literal type chỉ được kiểm lúc chạy'),
            B("A: <code>Route</code> is just <code>string</code>, so no error — B: <code>getAge</code> does not exist, because keys cannot be renamed", "A: <code>Route</code> chỉ là <code>string</code> nên không lỗi — B: <code>getAge</code> không tồn tại, vì key không đổi tên được"),
          ],
          correct: 0,
          explanation: EX(
            'Verified — the compiler reports exactly two diagnostics: <em>Type &#x27;"/fr/home"&#x27; is not assignable to type &#x27;"/en/home" | "/vi/home"&#x27;</em> on A, and <em>Property &#x27;toUpperCase&#x27; does not exist on type &#x27;number&#x27;</em> on B. Interpolating a union into a template literal type produces every combination, so a naming convention becomes a rule the compiler enforces. The <code>as</code> clause in a mapped type <b>renames</b> each generated key, so <code>name</code> became <code>getName</code> — and each getter kept the original field&#x27;s type via <code>T[K]</code>, which is why <code>getAge()</code> is a <code>number</code>. The <code>string &amp; K</code> is a small tax: <code>keyof T</code> can include symbols and <code>Capitalize</code> needs a string, so the intersection keeps only the string keys.',
            'Đã kiểm thật — trình biên dịch báo đúng hai lỗi: <em>Type &#x27;"/fr/home"&#x27; is not assignable to type &#x27;"/en/home" | "/vi/home"&#x27;</em> ở A, và <em>Property &#x27;toUpperCase&#x27; does not exist on type &#x27;number&#x27;</em> ở B. Nội suy một union vào template literal type sinh ra mọi tổ hợp, nên một quy ước đặt tên trở thành quy tắc do trình biên dịch ép. Mệnh đề <code>as</code> trong mapped type <b>đổi tên</b> từng key sinh ra, nên <code>name</code> thành <code>getName</code> — và mỗi getter giữ nguyên kiểu của field gốc nhờ <code>T[K]</code>, đó là lý do <code>getAge()</code> là <code>number</code>. Phần <code>string &amp; K</code> là một khoản thuế nhỏ: <code>keyof T</code> có thể gồm cả symbol mà <code>Capitalize</code> lại cần chuỗi, nên phép giao giữ lại đúng các key kiểu chuỗi.',
          ),
        }),
        // ── Chương 8 — Utility types ────────────────────────────────────
        mcq({
          prompt: B(
            'The same key name is misspelled in both lines. Which one does the compiler catch?' + code(
              'interface User { id: number; name: string; passwordHash: string }\n' +
              '\n' +
              "type A = Omit<User, 'passwordHassh'>;   // A\n" +
              "type B = Pick<User, 'passwordHassh'>;   // B",
            ),
            'Cùng một tên khoá bị gõ sai ở cả hai dòng. Trình biên dịch bắt được dòng nào?' + code(
              'interface User { id: number; name: string; passwordHash: string }\n' +
              '\n' +
              "type A = Omit<User, 'passwordHassh'>;   // A\n" +
              "type B = Pick<User, 'passwordHassh'>;   // B",
            ),
          ),
          options: [
            B('Neither — key names inside a utility type are plain strings and are never validated', 'Không cái nào — tên khoá trong utility type chỉ là chuỗi thường và không bao giờ được kiểm'),
            B('Both — every utility type checks its key argument against <code>keyof User</code>', 'Cả hai — mọi utility type đều kiểm đối số khoá của nó với <code>keyof User</code>'),
            B("Only B: <code>TS2344: Type &#x27;&quot;passwordHassh&quot;&#x27; does not satisfy the constraint &#x27;keyof User&#x27;.</code> — <code>Omit</code> accepts any key name at all", "Chỉ B: <code>TS2344: Type &#x27;&quot;passwordHassh&quot;&#x27; does not satisfy the constraint &#x27;keyof User&#x27;.</code> — <code>Omit</code> nhận bất kỳ tên khoá nào"),
            B('Only A — <code>Omit</code> must name a real key, while <code>Pick</code> silently drops unknown ones', 'Chỉ A — <code>Omit</code> phải gọi đúng một khoá thật, còn <code>Pick</code> âm thầm bỏ qua khoá lạ'),
          ],
          correct: 2,
          explanation: EX(
            'Verified: the only diagnostic is TS2344 on line B. <code>Pick&lt;T, K extends keyof T&gt;</code> constrains its key argument, so a typo is an error immediately at the declaration. <code>Omit&lt;T, K extends keyof any&gt;</code> deliberately does not — its constraint is "any string at all", so you can omit from union types — which means a typo removes nothing and compiles happily. That is not academic: rename <code>passwordHash</code> to <code>password_hash</code> in the model and a <code>PublicUser = Omit&lt;User, &#x27;passwordHash&#x27;&gt;</code> keeps compiling while quietly containing the hash again, one JSON response away from a leak. Build outward-facing shapes with <code>Pick</code> (every key is checked, and new model fields are excluded by default), or wrap <code>Omit</code> in a checked helper.',
            'Đã kiểm thật: lỗi duy nhất là TS2344 ở dòng B. <code>Pick&lt;T, K extends keyof T&gt;</code> ràng buộc đối số khoá của nó, nên gõ sai là lỗi ngay tại khai báo. <code>Omit&lt;T, K extends keyof any&gt;</code> thì cố ý không — ràng buộc của nó là "chuỗi nào cũng được", để bạn omit được cả trên union — nghĩa là một lỗi gõ sẽ không gỡ gì cả mà vẫn biên dịch ngon lành. Chuyện này không hàn lâm chút nào: đổi tên <code>passwordHash</code> thành <code>password_hash</code> trong model thì một <code>PublicUser = Omit&lt;User, &#x27;passwordHash&#x27;&gt;</code> vẫn biên dịch được trong khi lặng lẽ chứa lại cái hash, chỉ cách một response JSON là rò rỉ. Hãy dựng các dáng hướng ra ngoài bằng <code>Pick</code> (mọi khoá đều được kiểm, và field mới của model mặc định bị loại), hoặc bọc <code>Omit</code> trong một helper có kiểm.',
          ),
        }),

        mcq({
          prompt: B(
            'After <code>Required</code>, what is the type of <code>r.port</code>, and does the last line compile?' + code(
              'interface Cfg { port?: number | null }\n' +
              'type R = Required<Cfg>;\n' +
              'declare const r: R;\n' +
              'r.port.toFixed(2);',
            ),
            'Sau <code>Required</code>, kiểu của <code>r.port</code> là gì, và dòng cuối có biên dịch được không?' + code(
              'interface Cfg { port?: number | null }\n' +
              'type R = Required<Cfg>;\n' +
              'declare const r: R;\n' +
              'r.port.toFixed(2);',
            ),
          ),
          options: [
            B('<code>number</code> — <code>Required</code> strips both the <code>?</code> and the <code>null</code>, so the call compiles', '<code>number</code> — <code>Required</code> gỡ cả dấu <code>?</code> lẫn <code>null</code>, nên lời gọi biên dịch được'),
            B("<code>number | null</code> — <code>Required</code> only removes the optionality, so the call is <code>TS18047: &#x27;r.port&#x27; is possibly &#x27;null&#x27;</code>", "<code>number | null</code> — <code>Required</code> chỉ gỡ tính tuỳ chọn, nên lời gọi báo <code>TS18047: &#x27;r.port&#x27; is possibly &#x27;null&#x27;</code>"),
            B('<code>number | null | undefined</code> — <code>Required</code> has no effect on a union-typed field', '<code>number | null | undefined</code> — <code>Required</code> không tác dụng gì với field mang kiểu union'),
            B('<code>NonNullable&lt;number&gt;</code>, and the call compiles', '<code>NonNullable&lt;number&gt;</code>, và lời gọi biên dịch được'),
          ],
          correct: 1,
          explanation: EX(
            'Verified: TS18047 on the last line. <code>Required&lt;T&gt;</code> is the mapped type <code>{ [K in keyof T]-?: T[K] }</code> — the <code>-?</code> removes the optionality and the implicit <code>undefined</code> that comes with it, but an <b>explicitly declared</b> <code>null</code> is part of the member&#x27;s value type and survives. So the name promises more than the type delivers, and code that trusted "Required" without reading the resulting type gets a null-dereference the compiler was right about. Compose when you mean both — <code>{ port: NonNullable&lt;Cfg[&#x27;port&#x27;]&gt; }</code> — and better still, do not model "absent" two different ways (<code>?</code> and <code>| null</code>) in the same interface.',
            'Đã kiểm thật: TS18047 ở dòng cuối. <code>Required&lt;T&gt;</code> chính là mapped type <code>{ [K in keyof T]-?: T[K] }</code> — dấu <code>-?</code> gỡ tính tuỳ chọn và cái <code>undefined</code> ngầm đi kèm, nhưng một <code>null</code> <b>được khai tường minh</b> là một phần kiểu giá trị của thành viên nên nó sống sót. Vậy là cái tên hứa nhiều hơn cái kiểu đưa ra, và đoạn mã tin vào chữ "Required" mà không đọc kiểu kết quả sẽ ăn một lỗi truy cập null mà trình biên dịch đã cảnh báo đúng. Hãy ghép lại khi bạn muốn cả hai — <code>{ port: NonNullable&lt;Cfg[&#x27;port&#x27;]&gt; }</code> — và tốt hơn nữa là đừng mô hình hoá "vắng mặt" theo hai cách (<code>?</code> và <code>| null</code>) trong cùng một interface.',
          ),
        }),

        mcq({
          prompt: B(
            'One of these two declarations fails. Which, and what does that tell you about the other?' + code(
              "type Role = 'admin' | 'editor' | 'viewer';\n" +
              '\n' +
              'const strict: Record<Role, string[]> = {          // A\n' +
              "  admin: ['read', 'write', 'delete'],\n" +
              "  editor: ['read', 'write'],\n" +
              '};\n' +
              '\n' +
              'const loose: Partial<Record<Role, string[]>> = {  // B\n' +
              "  admin: ['read'],\n" +
              '};',
            ),
            'Một trong hai khai báo này hỏng. Cái nào, và điều đó nói gì về cái còn lại?' + code(
              "type Role = 'admin' | 'editor' | 'viewer';\n" +
              '\n' +
              'const strict: Record<Role, string[]> = {          // A\n' +
              "  admin: ['read', 'write', 'delete'],\n" +
              "  editor: ['read', 'write'],\n" +
              '};\n' +
              '\n' +
              'const loose: Partial<Record<Role, string[]>> = {  // B\n' +
              "  admin: ['read'],\n" +
              '};',
            ),
          ),
          options: [
            B("A fails with <code>TS2741: Property &#x27;viewer&#x27; is missing</code>; B compiles, because <code>Partial</code> made every key optional and threw the exhaustiveness guarantee away", "A hỏng với <code>TS2741: Property &#x27;viewer&#x27; is missing</code>; B biên dịch được, vì <code>Partial</code> làm mọi khoá thành tuỳ chọn và ném luôn bảo đảm phủ-đủ đi"),
            B('B fails — <code>Partial</code> cannot wrap a <code>Record</code> whose keys are a literal union', 'B hỏng — <code>Partial</code> không bọc được một <code>Record</code> có khoá là union literal'),
            B('Both fail — a <code>Record</code> keyed by a union always requires every key, <code>Partial</code> or not', 'Cả hai hỏng — một <code>Record</code> khoá bằng union luôn đòi đủ mọi khoá, dù có <code>Partial</code> hay không'),
            B('Neither fails — object literals may always omit keys they do not need', 'Không cái nào hỏng — object literal luôn được phép bỏ những khoá nó không cần'),
          ],
          correct: 0,
          explanation: EX(
            'Verified: the only diagnostic is TS2741 on A, and B is silent. A <code>Record</code> keyed by a literal union is the exhaustiveness check of chapter 5 applied to an object — add a fourth role and every such map in the codebase lights up red until you handle it, which is exactly the guarantee you want from a permission table or an i18n dictionary. Wrapping it in <code>Partial</code>, which people do to silence one inconvenient case, deletes that guarantee entirely: the new key compiles fine and every read becomes <code>string[] | undefined</code>, which somebody will paper over with <code>!</code>. If one case genuinely has no value, give it an explicit one rather than making all of them optional.',
            'Đã kiểm thật: lỗi duy nhất là TS2741 ở A, còn B im lặng. Một <code>Record</code> khoá bằng union literal chính là phép kiểm phủ-đủ của chương 5 áp lên một object — thêm vai trò thứ tư là mọi bảng kiểu ấy trong dự án đỏ lên cho tới khi bạn xử lý, đúng thứ bảo đảm bạn muốn ở một bảng quyền hay một từ điển đa ngữ. Bọc nó trong <code>Partial</code>, việc người ta hay làm để dập một trường hợp phiền phức, sẽ xoá sạch bảo đảm đó: khoá mới biên dịch ngon lành và mọi phép đọc thành <code>string[] | undefined</code>, rồi sẽ có người trám bằng dấu <code>!</code>. Nếu một trường hợp thật sự không có giá trị, hãy cho nó một giá trị tường minh thay vì làm tất cả thành tuỳ chọn.',
          ),
        }),

        mcq({
          prompt: B(
            'Given the compiler error, what is <code>Loaded</code>?' + code(
              'async function load() { return 42; }\n' +
              'type Loaded = Awaited<ReturnType<typeof load>>;\n' +
              "const x: Loaded = 'no';\n" +
              "// TS2322: Type 'string' is not assignable to type 'number'.",
            ),
            'Từ lỗi trình biên dịch báo, <code>Loaded</code> là gì?' + code(
              'async function load() { return 42; }\n' +
              'type Loaded = Awaited<ReturnType<typeof load>>;\n' +
              "const x: Loaded = 'no';\n" +
              "// TS2322: Type 'string' is not assignable to type 'number'.",
            ),
          ),
          options: [
            B('<code>42</code> — the literal type of the returned value', '<code>42</code> — kiểu literal của giá trị trả về'),
            B('<code>void</code> — an <code>async</code> function has no synchronous return type', '<code>void</code> — hàm <code>async</code> không có kiểu trả về đồng bộ'),
            B('<code>Promise&lt;number&gt;</code> — <code>Awaited</code> only documents intent, it does not unwrap', '<code>Promise&lt;number&gt;</code> — <code>Awaited</code> chỉ ghi chú ý định chứ không bóc vỏ'),
            B('<code>number</code> — <code>ReturnType</code> gives <code>Promise&lt;number&gt;</code> and <code>Awaited</code> peels the promise', '<code>number</code> — <code>ReturnType</code> cho <code>Promise&lt;number&gt;</code> rồi <code>Awaited</code> bóc lớp promise'),
          ],
          correct: 3,
          explanation: EX(
            'Verified: the message names <code>number</code>, which is the answer. <code>typeof load</code> turns the value into its type, <code>ReturnType</code> is a conditional type with <code>infer</code> that pulls out <code>Promise&lt;number&gt;</code>, and <code>Awaited</code> models what <code>await</code> actually does — unwrapping recursively — to give <code>number</code>. Option 1 is a reasonable guess but wrong: a function&#x27;s <em>return type</em> is widened to <code>number</code>, not the literal, exactly as with <code>let</code>. The value of the pattern is that the type is derived from the function, so changing the function updates it — though that also makes the implementation your public API, which is why it belongs in local glue rather than across a module boundary.',
            'Đã kiểm thật: thông báo gọi tên <code>number</code>, và đó là đáp án. <code>typeof load</code> biến giá trị thành kiểu của nó, <code>ReturnType</code> là một conditional type dùng <code>infer</code> để rút ra <code>Promise&lt;number&gt;</code>, còn <code>Awaited</code> mô hình hoá đúng việc <code>await</code> làm — bóc vỏ đệ quy — cho ra <code>number</code>. Phương án 1 là phỏng đoán hợp lý nhưng sai: <em>kiểu trả về</em> của một hàm bị nới thành <code>number</code> chứ không phải literal, y như với <code>let</code>. Giá trị của mẫu này là kiểu được suy ra từ hàm nên đổi hàm là kiểu tự cập nhật — dù điều đó cũng biến phần cài đặt thành API công khai của bạn, vì thế nó hợp cho keo dán cục bộ hơn là để đi xuyên biên giới module.',
          ),
        }),
        // ── Chương 9 — tsconfig & trình biên dịch ───────────────────────
        mcq({
          prompt: B(
            'This file has a type error. It was compiled with <code>tsc --strict --target ES5 --outDir out app.ts</code>. What is on disk afterwards, and what was the exit code?' + code(
              "const msg: string = 'hello';\n" +
              'const n: number = msg;    // TS2322\n' +
              'console.log(n);',
            ),
            'File này có lỗi kiểu. Nó được biên dịch bằng <code>tsc --strict --target ES5 --outDir out app.ts</code>. Sau đó trên đĩa có gì, và mã thoát là bao nhiêu?' + code(
              "const msg: string = 'hello';\n" +
              'const n: number = msg;    // TS2322\n' +
              'console.log(n);',
            ),
          ),
          options: [
            B('Exit code 2, and <code>out/app.js</code> was written with the <code>: string</code> annotations kept as comments', 'Mã thoát 2, và <code>out/app.js</code> được ghi với các chú thích <code>: string</code> giữ lại dưới dạng comment'),
            B('Exit code 0, and <code>out/app.js</code> was written — a type error is only a warning', 'Mã thoát 0, và <code>out/app.js</code> đã được ghi — lỗi kiểu chỉ là cảnh báo'),
            B('Exit code 2, and <b>no</b> file was written — the compiler refuses to emit broken code', 'Mã thoát 2, và <b>không</b> file nào được ghi — trình biên dịch từ chối xuất mã hỏng'),
            B('Exit code 2, and <code>out/app.js</code> <b>was</b> written anyway, containing <code>var msg = &#x27;hello&#x27;;</code>', 'Mã thoát 2, và <code>out/app.js</code> <b>vẫn</b> được ghi, bên trong có <code>var msg = &#x27;hello&#x27;;</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Verified by actually running it: exit code 2, and <code>out/app.js</code> exists with the contents <code>"use strict"; var msg = &#x27;hello&#x27;; var n = msg; console.log(n);</code>. Two lessons in one result. First, <b>checking and emitting are separate jobs</b> — by default a type error is a non-zero exit code <em>and</em> a written output, so a pipeline that swallows the exit code (<code>tsc; node dist/index.js</code>, or two separate Docker <code>RUN</code> lines) ships the broken build with nothing to tell you. Set <code>noEmitOnError: true</code> if you want the compiler to refuse. Second, the emitted file shows the two other jobs <code>tsc</code> does: the annotations are <b>erased</b> (not commented out), and <code>const</code> was <b>downleveled</b> to <code>var</code> for the ES5 target.',
            'Đã chạy thật: mã thoát 2, và <code>out/app.js</code> có tồn tại với nội dung <code>"use strict"; var msg = &#x27;hello&#x27;; var n = msg; console.log(n);</code>. Một kết quả, hai bài học. Một là <b>kiểm và xuất là hai việc tách rời</b> — mặc định một lỗi kiểu cho mã thoát khác 0 <em>và</em> vẫn ghi file, nên một quy trình nuốt mất mã thoát (<code>tsc; node dist/index.js</code>, hay hai dòng <code>RUN</code> Docker riêng) sẽ đẩy bản build hỏng đi mà chẳng có gì báo cho bạn. Đặt <code>noEmitOnError: true</code> nếu muốn trình biên dịch từ chối. Hai là file xuất ra cho thấy hai việc còn lại của <code>tsc</code>: chú thích kiểu bị <b>xoá</b> (không phải chuyển thành comment), và <code>const</code> bị <b>hạ cấp</b> thành <code>var</code> cho target ES5.',
          ),
        }),

        mcq({
          prompt: B(
            'The same file was compiled twice. Which flag explains the difference?' + code(
              'const arr = [1, 2, 3];\n' +
              'const x = arr[10];\n' +
              'x.toFixed(2);\n' +
              '\n' +
              '// run 1: tsc --strict            -> exit 0, no output\n' +
              "// run 2: tsc --strict --??????   -> TS18048: 'x' is possibly 'undefined'.",
            ),
            'Cùng một file được biên dịch hai lần. Cờ nào giải thích sự khác biệt?' + code(
              'const arr = [1, 2, 3];\n' +
              'const x = arr[10];\n' +
              'x.toFixed(2);\n' +
              '\n' +
              '// lượt 1: tsc --strict            -> thoát 0, không lỗi\n' +
              "// lượt 2: tsc --strict --??????   -> TS18048: 'x' is possibly 'undefined'.",
            ),
          ),
          options: [
            B('<code>noImplicitAny</code> — without it, <code>x</code> is silently <code>any</code>', '<code>noImplicitAny</code> — không có nó thì <code>x</code> âm thầm là <code>any</code>'),
            B('<code>noImplicitReturns</code> — the expression statement never returns a value', '<code>noImplicitReturns</code> — câu lệnh biểu thức này không trả về giá trị nào'),
            B('<code>strictNullChecks</code> — it is off by default and must be added separately', '<code>strictNullChecks</code> — nó mặc định tắt và phải thêm riêng'),
            B('<code>noUncheckedIndexedAccess</code> — it is <b>not</b> part of <code>strict</code>, and it types an index read as <code>T | undefined</code>', '<code>noUncheckedIndexedAccess</code> — nó <b>không</b> nằm trong <code>strict</code>, và nó gõ kiểu một phép đọc theo chỉ số thành <code>T | undefined</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Verified both runs. By default TypeScript types <code>arr[i]</code> as the element type even when the index is out of range — a convenient lie, since <code>arr[10]</code> is genuinely <code>undefined</code> at runtime. <code>noUncheckedIndexedAccess</code> makes the type tell the truth (<code>number | undefined</code>), which is why the flag catches the off-by-one at compile time instead of as <em>undefined is not a function</em> in production. The thing to remember is that it is <b>opt-in</b>: <code>strict</code> is an umbrella over <code>noImplicitAny</code>, <code>strictNullChecks</code>, <code>strictFunctionTypes</code>, <code>noImplicitThis</code> and friends, but several of the most useful checks — this one, <code>noImplicitReturns</code>, <code>noUnusedLocals</code>, <code>exactOptionalPropertyTypes</code> — sit outside it and are far cheaper to enable at project start than to retrofit.',
            'Đã kiểm cả hai lượt. Mặc định TypeScript gõ kiểu <code>arr[i]</code> là kiểu phần tử kể cả khi chỉ số vượt biên — một lời nói dối tiện lợi, vì <code>arr[10]</code> lúc chạy thật sự là <code>undefined</code>. <code>noUncheckedIndexedAccess</code> bắt kiểu nói thật (<code>number | undefined</code>), nhờ đó cờ này bắt được lỗi lệch-một lúc biên dịch thay vì nhận <em>undefined is not a function</em> trên production. Điều cần nhớ là nó <b>phải tự bật</b>: <code>strict</code> là chiếc ô trùm <code>noImplicitAny</code>, <code>strictNullChecks</code>, <code>strictFunctionTypes</code>, <code>noImplicitThis</code> và vài cờ nữa, nhưng nhiều phép kiểm hữu ích nhất — cái này, <code>noImplicitReturns</code>, <code>noUnusedLocals</code>, <code>exactOptionalPropertyTypes</code> — lại nằm ngoài, và bật từ đầu dự án rẻ hơn rất nhiều so với lắp ngược về sau.',
          ),
        }),

        mcq({
          prompt: B(
            'A colleague hits this error on a fresh project. What is actually wrong?' + code(
              'const nums = [1, 2, 3];\n' +
              'const found = nums.includes(2);\n' +
              '\n' +
              "// TS2550: Property 'includes' does not exist on type 'number[]'.\n" +
              "//   Do you need to change your target library? Try changing the\n" +
              "//   'lib' compiler option to 'es2016' or later.",
            ),
            'Một đồng nghiệp gặp lỗi này trên một dự án mới. Thật ra sai ở đâu?' + code(
              'const nums = [1, 2, 3];\n' +
              'const found = nums.includes(2);\n' +
              '\n' +
              "// TS2550: Property 'includes' does not exist on type 'number[]'.\n" +
              "//   Do you need to change your target library? Try changing the\n" +
              "//   'lib' compiler option to 'es2016' or later.",
            ),
          ),
          options: [
            B('The array is typed wrongly; it should be <code>Array&lt;number&gt;</code> rather than <code>number[]</code>', 'Mảng bị gõ sai kiểu; phải viết <code>Array&lt;number&gt;</code> thay vì <code>number[]</code>'),
            B('<code>strict</code> is off; the strict family is what unlocks array methods added after ES5, so switching it on resolves the error', '<code>strict</code> đang tắt; chính họ cờ strict mới mở khoá các phương thức mảng thêm sau ES5, nên bật nó lên là hết lỗi'),
            B('<code>includes</code> must be imported from a polyfill package such as <code>core-js</code> before TypeScript will admit that the method exists', 'Phải import <code>includes</code> từ một gói polyfill như <code>core-js</code> thì TypeScript mới công nhận là phương thức đó tồn tại'),
            B('<code>target</code>/<code>lib</code> is set below the ES version that introduced the API — <code>lib</code> declares which runtime APIs the compiler believes exist, and <code>target</code> sets its default', '<code>target</code>/<code>lib</code> đang đặt thấp hơn phiên bản ES đã thêm API đó — <code>lib</code> khai những API lúc chạy mà trình biên dịch tin là có, còn <code>target</code> quyết định giá trị mặc định của nó'),
          ],
          correct: 3,
          explanation: EX(
            'Verified by reproducing it with <code>--target ES5</code> in a project with no ambient <code>@types</code> loaded. <code>target</code> controls which JS <b>syntax</b> is emitted; <code>lib</code> is a separate set of declaration files saying which runtime <b>APIs</b> exist. <code>Array.prototype.includes</code> arrived in ES2016, so an ES5 default lib does not declare it and the compiler refuses — and it names the fix in the message. Two things worth carrying: raising <code>target</code> raises the default <code>lib</code>, which is why an explicit <code>lib</code> is worth writing down; and <code>lib</code> only ships declarations, it never polyfills — set it above what your runtime actually supports and <code>arr.findLast(…)</code> type-checks perfectly and throws <em>is not a function</em> in production.',
            'Đã tái hiện thật bằng <code>--target ES5</code> trong một dự án không nạp <code>@types</code> nền nào. <code>target</code> quyết định <b>cú pháp</b> JS được xuất ra; <code>lib</code> là một bộ file khai báo riêng nói những <b>API</b> lúc chạy nào tồn tại. <code>Array.prototype.includes</code> có từ ES2016, nên bộ lib mặc định của ES5 không khai nó và trình biên dịch từ chối — và nó nói luôn cách sửa trong thông báo. Hai điều đáng mang theo: nâng <code>target</code> sẽ nâng cả <code>lib</code> mặc định, nên viết rõ <code>lib</code> ra là đáng; và <code>lib</code> chỉ chở khai báo chứ không bao giờ polyfill — đặt nó cao hơn thứ runtime thật sự hỗ trợ thì <code>arr.findLast(…)</code> qua kiểm kiểu ngon lành rồi ném <em>is not a function</em> trên production.',
          ),
        }),

        // ── Chương 10 — Module & khai báo kiểu ──────────────────────────
        mcq({
          prompt: B(
            '<code>side.ts</code> logs on load. Both importing files were compiled and run. What was printed?' + code(
              "// side.ts\n" +
              "console.log('side effect ran');\n" +
              'export interface Handler { go(): void }\n' +
              "export const NAME = 'side';\n" +
              '\n' +
              "// useType.ts   ->  import { Handler } from './side.js';\n" +
              "// useValue.ts  ->  import { NAME } from './side.js';",
            ),
            '<code>side.ts</code> in log khi được nạp. Cả hai file import đều đã được biên dịch và chạy. Kết quả in ra là gì?' + code(
              "// side.ts\n" +
              "console.log('side effect ran');\n" +
              'export interface Handler { go(): void }\n' +
              "export const NAME = 'side';\n" +
              '\n' +
              "// useType.ts   ->  import { Handler } from './side.js';\n" +
              "// useValue.ts  ->  import { NAME } from './side.js';",
            ),
          ),
          options: [
            B('Only <code>useType</code> printed it, because interfaces are resolved before values', 'Chỉ <code>useType</code> in ra, vì interface được phân giải trước giá trị'),
            B('Neither printed anything — <code>console.log</code> at module top level is stripped by the compiler', 'Không cái nào in gì — <code>console.log</code> ở đầu module bị trình biên dịch bỏ đi'),
            B('Both printed <code>side effect ran</code> — an <code>import</code> always loads the module', 'Cả hai đều in <code>side effect ran</code> — một <code>import</code> luôn nạp module'),
            B('Only <code>useValue</code> printed it — <code>useType</code> used the import purely as a type, so the whole statement was <b>elided</b> and the module never loaded', 'Chỉ <code>useValue</code> in ra — <code>useType</code> chỉ dùng import đó như một kiểu, nên cả câu lệnh bị <b>xoá</b> và module không bao giờ được nạp'),
          ],
          correct: 3,
          explanation: EX(
            'Verified by compiling and running both: the emitted <code>useType.js</code> contains no <code>require(&#x27;./side.js&#x27;)</code> at all and prints nothing, while <code>useValue.js</code> keeps the require and prints <code>side effect ran</code>. Import elision is a <b>whole-statement</b> decision: if nothing in an import is used as a value, the compiler drops it — and with it the module&#x27;s side effects. That is the failure mode to remember, because it has no error message: a module whose job is to register a hook, patch a global or install a polyfill silently stops running, and the behaviour can flip back and forth on an unrelated edit that adds or removes a value use. Write <code>import type</code> to state the intent, and depend on a module&#x27;s load-time behaviour with the bare form <code>import &#x27;./register-hooks&#x27;</code>, which is never elided.',
            'Đã kiểm bằng cách biên dịch và chạy cả hai: file <code>useType.js</code> xuất ra không có dòng <code>require(&#x27;./side.js&#x27;)</code> nào và không in gì, còn <code>useValue.js</code> giữ lại require và in <code>side effect ran</code>. Việc xoá import là quyết định trên <b>cả câu lệnh</b>: nếu không có gì trong import được dùng như một giá trị, trình biên dịch bỏ nó — và bỏ luôn các side effect của module. Đó là kiểu hỏng cần nhớ vì nó không có thông báo lỗi nào: một module có nhiệm vụ đăng ký hook, vá một biến toàn cục hay cài polyfill sẽ âm thầm ngừng chạy, và hành vi có thể bật tắt qua lại chỉ vì một sửa đổi không liên quan thêm hay bớt một chỗ dùng giá trị. Hãy viết <code>import type</code> để nói rõ ý định, và phụ thuộc vào hành vi lúc-nạp của một module bằng dạng trần <code>import &#x27;./register-hooks&#x27;</code>, dạng không bao giờ bị xoá.',
          ),
        }),

        mcq({
          prompt: B(
            'Adding the second file changes the first error into a different one. What are the two errors?' + code(
              '// use.ts\n' +
              "import { fire } from 'confetti-cannon';   // installed, ships no types\n" +
              "fire('lots');\n" +
              '\n' +
              '// shims.d.ts  (added on the second run)\n' +
              "declare module 'confetti-cannon' {\n" +
              '  export function fire(count: number): void;\n' +
              '}',
            ),
            'Thêm file thứ hai làm lỗi đầu tiên biến thành một lỗi khác. Hai lỗi đó là gì?' + code(
              '// use.ts\n' +
              "import { fire } from 'confetti-cannon';   // đã cài, không kèm kiểu\n" +
              "fire('lots');\n" +
              '\n' +
              '// shims.d.ts  (thêm ở lượt chạy thứ hai)\n' +
              "declare module 'confetti-cannon' {\n" +
              '  export function fire(count: number): void;\n' +
              '}',
            ),
          ),
          options: [
            B('Without the shim: <code>TS2345</code>. With it: <code>TS2307</code>, because the shim shadows the real package', 'Chưa có shim: <code>TS2345</code>. Có rồi: <code>TS2307</code>, vì shim che mất package thật'),
            B('Both runs give <code>TS2307</code> — a <code>declare module</code> block only works for relative paths', 'Cả hai lượt đều cho <code>TS2307</code> — khối <code>declare module</code> chỉ dùng được cho đường dẫn tương đối'),
            B('Without the shim: <code>TS2307 Cannot find module … or its corresponding type declarations</code>. With it: <code>TS2345</code>, because <code>fire</code> is now typed and a string is not a number', 'Chưa có shim: <code>TS2307 Cannot find module … or its corresponding type declarations</code>. Có rồi: <code>TS2345</code>, vì <code>fire</code> giờ đã có kiểu và một chuỗi không phải số'),
            B('Without the shim: no error, the import is silently <code>any</code>. With it: still no error', 'Chưa có shim: không lỗi, import âm thầm thành <code>any</code>. Có rồi: vẫn không lỗi'),
          ],
          correct: 2,
          explanation: EX(
            'Verified by running the compiler both ways. An ambient <code>declare module &#x27;name&#x27;</code> block in a <code>.d.ts</code> describes a package that ships no types, and once it exists the import resolves <em>and is genuinely checked</em> — which is why the error changes from "I cannot find this" to "you passed the wrong argument type". Option 4 is what happens without <code>noImplicitAny</code>, and it is the outcome to avoid: a silently-<code>any</code> import is a hole in the net. Option 2 has it backwards — <code>declare module</code> names a <em>package</em>; for a relative <code>.js</code> file you put a sidecar <code>.d.ts</code> with the same basename next to it and the compiler pairs them automatically. In practice the first thing to try for a <code>TS2307</code> is <code>npm i -D @types/&lt;name&gt;</code>; the hand-written shim is the fallback when DefinitelyTyped has nothing.',
            'Đã chạy thật trình biên dịch cả hai đường. Một khối nền <code>declare module &#x27;tên&#x27;</code> trong file <code>.d.ts</code> mô tả một package không kèm kiểu, và khi nó tồn tại thì import phân giải được <em>và được kiểm thật sự</em> — đó là lý do lỗi đổi từ "không tìm thấy" sang "bạn truyền sai kiểu đối số". Phương án 4 là chuyện xảy ra khi không có <code>noImplicitAny</code>, và đó là kết cục cần tránh: một import âm thầm thành <code>any</code> là một lỗ thủng trong lưới. Phương án 2 nói ngược — <code>declare module</code> gọi tên một <em>package</em>; còn với một file <code>.js</code> tương đối thì bạn đặt một file <code>.d.ts</code> cùng tên gốc nằm cạnh, trình biên dịch tự ghép cặp. Thực tế, thứ nên thử đầu tiên khi gặp <code>TS2307</code> là <code>npm i -D @types/&lt;tên&gt;</code>; shim viết tay là đường lùi khi DefinitelyTyped không có gì.',
          ),
        }),
        // ── Chương 11 — Gõ kiểu backend Node/Express ────────────────────
        mcq({
          prompt: B(
            'Two handlers, two errors. Which pair does <code>tsc --strict</code> report?' + code(
              "import { Request, Response } from 'express';\n" +
              'interface UserParams { id: string }\n' +
              'interface CreateBody { name: string; email: string }\n' +
              '\n' +
              'function getUser(req: Request<UserParams>, res: Response) {\n' +
              '  const bad: number = req.params.id;      // A   (URL is /users/42)\n' +
              '  res.json({ bad });\n' +
              '}\n' +
              'function createUser(req: Request<{}, {}, CreateBody>, res: Response) {\n' +
              '  console.log(req.body.age);              // B\n' +
              '}',
            ),
            'Hai handler, hai lỗi. <code>tsc --strict</code> báo cặp nào?' + code(
              "import { Request, Response } from 'express';\n" +
              'interface UserParams { id: string }\n' +
              'interface CreateBody { name: string; email: string }\n' +
              '\n' +
              'function getUser(req: Request<UserParams>, res: Response) {\n' +
              '  const bad: number = req.params.id;      // A   (URL là /users/42)\n' +
              '  res.json({ bad });\n' +
              '}\n' +
              'function createUser(req: Request<{}, {}, CreateBody>, res: Response) {\n' +
              '  console.log(req.body.age);              // B\n' +
              '}',
            ),
          ),
          options: [
            B("A: <code>TS2322: Type &#x27;string&#x27; is not assignable to type &#x27;number&#x27;</code> — B: <code>TS2339: Property &#x27;age&#x27; does not exist on type &#x27;CreateBody&#x27;</code>", "A: <code>TS2322: Type &#x27;string&#x27; is not assignable to type &#x27;number&#x27;</code> — B: <code>TS2339: Property &#x27;age&#x27; does not exist on type &#x27;CreateBody&#x27;</code>"),
            B('A: <code>TS2322</code> — B: no error, because an unvalidated body is typed <code>any</code>', 'A: <code>TS2322</code> — B: không lỗi, vì body chưa validate mang kiểu <code>any</code>'),
            B('Neither — the generic slots on <code>Request</code> are documentation and are not enforced', 'Không cái nào — các khe generic trên <code>Request</code> chỉ để làm tài liệu, không được ép'),
            B('A: no error, since <code>/users/42</code> really is numeric — B: <code>TS2339</code> on <code>age</code>', 'A: không lỗi, vì <code>/users/42</code> đúng là số — B: <code>TS2339</code> ở <code>age</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified against the real <code>@types/express</code>. <code>Request&lt;Params, ResBody, ReqBody, Query&gt;</code> types <code>req.params</code> in the <b>first</b> slot and <code>req.body</code> in the <b>third</b> (the second is the response body) — which is why <code>Request&lt;{}, {}, CreateBody&gt;</code> skips the middle ones. URL params are always strings, even for <code>/users/42</code>, so the compiler will not let you pretend otherwise; that single rule kills the most common Express bug, doing arithmetic on a param without <code>Number(…)</code>. But carry the caveat with you: typing <code>req.body</code> describes what your code <em>expects</em>, it does not check what arrived over the wire. Send <code>{}</code> to a handler that trusts the annotation and you turn a 400 into an unhandled 500 — which is what chapter 13 fixes by parsing at the boundary.',
            'Đã kiểm thật với <code>@types/express</code> thật. <code>Request&lt;Params, ResBody, ReqBody, Query&gt;</code> gõ kiểu <code>req.params</code> ở khe <b>thứ nhất</b> và <code>req.body</code> ở khe <b>thứ ba</b> (khe thứ hai là body của response) — vì thế <code>Request&lt;{}, {}, CreateBody&gt;</code> phải bỏ qua hai khe giữa. Params trên URL luôn là chuỗi, kể cả với <code>/users/42</code>, nên trình biên dịch không cho bạn giả vờ ngược lại; đúng một quy tắc đó diệt con bug Express hay gặp nhất là làm phép tính trên một param mà quên <code>Number(…)</code>. Nhưng hãy mang theo lời cảnh báo: gõ kiểu cho <code>req.body</code> là mô tả thứ mã của bạn <em>mong đợi</em>, không phải kiểm thứ thật sự tới qua đường truyền. Gửi <code>{}</code> vào một handler tin vào chú thích ấy là bạn biến một lỗi 400 thành một lỗi 500 không ai bắt — và chương 13 sửa điều đó bằng cách parse ngay tại biên.',
          ),
        }),

        mcq({
          prompt: B(
            'What does the compiler say, and why is this check stronger than typing <code>req.body</code>?' + code(
              "import { Request, Response } from 'express';\n" +
              'interface User { id: number; name: string }\n' +
              '\n' +
              'function getUser(req: Request, res: Response<User>) {\n' +
              '  res.json({ id: 1 });\n' +
              '}',
            ),
            'Trình biên dịch nói gì, và vì sao phép kiểm này mạnh hơn việc gõ kiểu cho <code>req.body</code>?' + code(
              "import { Request, Response } from 'express';\n" +
              'interface User { id: number; name: string }\n' +
              '\n' +
              'function getUser(req: Request, res: Response<User>) {\n' +
              '  res.json({ id: 1 });\n' +
              '}',
            ),
          ),
          options: [
            B('No error — <code>res.json</code> accepts any serialisable value; the generic only documents the route', 'Không lỗi — <code>res.json</code> nhận mọi giá trị tuần tự hoá được; generic chỉ để ghi chú cho route'),
            B("<code>TS2345 … Property &#x27;name&#x27; is missing in type &#x27;{ id: number; }&#x27; but required in type &#x27;User&#x27;</code> — and it is a real check because the value originates in your own code", "<code>TS2345 … Property &#x27;name&#x27; is missing in type &#x27;{ id: number; }&#x27; but required in type &#x27;User&#x27;</code> — và đây là phép kiểm thật vì giá trị sinh ra từ chính mã của bạn"),
            B('<code>TS2353</code>, the excess-property error, because <code>{ id: 1 }</code> is a fresh object literal carrying a key that <code>User</code> never declared', '<code>TS2353</code>, lỗi thuộc tính thừa, vì <code>{ id: 1 }</code> là một object literal tươi mang theo một khoá mà <code>User</code> chưa hề khai'),
            B('An error only at runtime: the generic argument is erased along with every other type, so the missing field surfaces when the client reads it', 'Chỉ lỗi lúc chạy: đối số generic bị xoá cùng mọi kiểu khác, nên field thiếu chỉ lộ ra khi client đọc tới nó'),
          ],
          correct: 1,
          explanation: EX(
            'Verified: TS2345, with the second line of the message naming the missing <code>name</code>. <code>Response&lt;T&gt;</code> constrains what <code>res.json</code> may send, so the response type becomes an enforced contract rather than a comment — the route&#x27;s documented output and its actual output cannot drift apart. And unlike the request side, this is a <b>genuine</b> guarantee: the object being checked is built by your own code, so the compiler can see everything about it, whereas <code>req.body</code> is parsed JSON whose type is a claim nobody verified. Related habit worth having: annotate a whole handler as <code>const h: RequestHandler&lt;Params, ResBody&gt; = (req, res) =&gt; …</code> rather than asserting with <code>as</code> — an annotation checks the function against the type, an assertion just silences it.',
            'Đã kiểm thật: TS2345, dòng thứ hai của thông báo gọi tên đúng <code>name</code> còn thiếu. <code>Response&lt;T&gt;</code> ràng buộc thứ <code>res.json</code> được phép gửi, nên kiểu response trở thành một hợp đồng được ép chứ không phải một dòng chú thích — đầu ra ghi trong tài liệu và đầu ra thật của route không thể trôi xa nhau. Và khác với phía request, đây là bảo đảm <b>thật</b>: object bị kiểm do chính mã của bạn dựng nên, trình biên dịch thấy hết mọi thứ về nó, trong khi <code>req.body</code> là JSON đã parse mà kiểu của nó chỉ là một lời khai chưa ai kiểm. Một thói quen liên quan đáng có: hãy chú thích cả handler bằng <code>const h: RequestHandler&lt;Params, ResBody&gt; = (req, res) =&gt; …</code> thay vì ép bằng <code>as</code> — chú thích thì kiểm hàm với kiểu, còn ép kiểu chỉ làm nó im.',
          ),
        }),

        mcq({
          prompt: B(
            'Why does the first line fail while the second is the standard fix?' + code(
              'const port: number = process.env.PORT;              // A\n' +
              'const ok:   number = Number(process.env.PORT ?? 3000);   // B',
            ),
            'Vì sao dòng đầu hỏng còn dòng sau là cách sửa chuẩn?' + code(
              'const port: number = process.env.PORT;              // A\n' +
              'const ok:   number = Number(process.env.PORT ?? 3000);   // B',
            ),
          ),
          options: [
            B('<code>process.env</code> is only typed if <code>@types/node</code> is installed; otherwise line A is fine', '<code>process.env</code> chỉ có kiểu khi đã cài <code>@types/node</code>; nếu không thì dòng A không sao'),
            B('Line A is fine; line B is the error, because <code>??</code> cannot mix a string and a number', 'Dòng A không sao; dòng B mới lỗi, vì <code>??</code> không trộn được chuỗi với số'),
            B('<code>process.env.PORT</code> is typed <code>string</code>, so only the missing <code>Number()</code> conversion is the problem', '<code>process.env.PORT</code> mang kiểu <code>string</code>, nên vấn đề duy nhất là thiếu phép chuyển <code>Number()</code>'),
            B("<code>process.env.PORT</code> is <code>string | undefined</code> — <code>TS2322</code> reports both halves: it is text, and it may be absent", "<code>process.env.PORT</code> là <code>string | undefined</code> — <code>TS2322</code> báo cả hai nửa: nó là chữ, và nó có thể vắng mặt"),
          ],
          correct: 3,
          explanation: EX(
            'Verified: TS2322 on line A, with the follow-on line <em>Type &#x27;undefined&#x27; is not assignable to type &#x27;number&#x27;</em>. Every environment variable is text that might not be set, and the type says exactly that — so the fix has to confront both problems at once, which is what line B does. The instinct to reach for <code>process.env.PORT!</code> instead is worth naming as a trap: the non-null assertion compiles and moves the failure from boot to the first request, where a missing variable surfaces as <code>app.listen(NaN)</code>, a connection string reading <code>postgres://undefined</code>, or a throw deep inside a service — each of which reads as something else entirely. Parse and validate configuration once at startup, throw with the variable&#x27;s name in the message, and let the rest of the app import a fully-typed <code>config</code> object.',
            'Đã kiểm thật: TS2322 ở dòng A, kèm dòng phụ <em>Type &#x27;undefined&#x27; is not assignable to type &#x27;number&#x27;</em>. Mọi biến môi trường đều là chữ và có thể không được đặt, kiểu nói đúng như vậy — nên cách sửa buộc phải đối mặt cả hai vấn đề một lượt, và dòng B làm đúng thế. Cái phản xạ với tay lấy <code>process.env.PORT!</code> đáng được gọi tên là một cái bẫy: phép ép non-null biên dịch được và dời chỗ hỏng từ lúc khởi động sang request đầu tiên, nơi một biến thiếu hiện ra dưới dạng <code>app.listen(NaN)</code>, một chuỗi kết nối đọc là <code>postgres://undefined</code>, hoặc một cú ném lỗi sâu trong một service — mỗi thứ đều trông như một lỗi hoàn toàn khác. Hãy phân tích và validate cấu hình đúng một lần lúc khởi động, ném lỗi có kèm tên biến trong thông báo, rồi để phần còn lại của ứng dụng import một object <code>config</code> đã có kiểu đầy đủ.',
          ),
        }),

        // ── Chương 12 — Gõ kiểu React ───────────────────────────────────
        mcq({
          prompt: B(
            'What does <code>tsc</code> say about the setter call?' + code(
              "import { useState } from 'react';\n" +
              'const [count, setCount] = useState(0);\n' +
              "setCount('five');",
            ),
            '<code>tsc</code> nói gì về lời gọi setter?' + code(
              "import { useState } from 'react';\n" +
              'const [count, setCount] = useState(0);\n' +
              "setCount('five');",
            ),
          ),
          options: [
            B('Nothing, but <code>count</code> silently becomes <code>string | number</code> afterwards', 'Không gì, nhưng sau đó <code>count</code> âm thầm thành <code>string | number</code>'),
            B('Nothing — the setter accepts anything and React coerces at render time', 'Không gì — setter nhận mọi thứ và React tự ép kiểu lúc render'),
            B("<code>TS2345: Argument of type &#x27;string&#x27; is not assignable to parameter of type &#x27;SetStateAction&lt;number&gt;&#x27;.</code>", "<code>TS2345: Argument of type &#x27;string&#x27; is not assignable to parameter of type &#x27;SetStateAction&lt;number&gt;&#x27;.</code>"),
            B('<code>TS2322</code>, saying <code>string</code> is not assignable to <code>number</code>', '<code>TS2322</code>, nói <code>string</code> không gán được cho <code>number</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Verified against <code>@types/react</code> 18. Hooks are ordinary generic functions, so <code>useState(0)</code> infers <code>number</code> from the initial value — and, more usefully, types the <b>setter</b> to match. The parameter type is <code>SetStateAction&lt;number&gt;</code>, which is "a number <em>or</em> a function <code>(prev: number) =&gt; number</code>", never a string; state and its updater cannot drift out of sync. Knowing that the setter accepts a function matters beyond types: <code>setCount(count + 1)</code> called twice in one handler increments once, because both reads come from the same render&#x27;s closure. Use <code>setCount(c =&gt; c + 1)</code> whenever the next value depends on the previous one — the types cannot see that bug, since <code>number</code> is <code>number</code> either way.',
            'Đã kiểm thật với <code>@types/react</code> 18. Hook chỉ là các hàm generic bình thường, nên <code>useState(0)</code> suy ra <code>number</code> từ giá trị khởi đầu — và hữu ích hơn, gõ kiểu cho cả <b>setter</b> cho khớp. Kiểu tham số là <code>SetStateAction&lt;number&gt;</code>, tức "một số <em>hoặc</em> một hàm <code>(prev: number) =&gt; number</code>", không bao giờ là chuỗi; state và bộ cập nhật của nó không thể lệch nhau. Biết setter nhận được một hàm còn có ích ngoài chuyện kiểu: <code>setCount(count + 1)</code> gọi hai lần trong một handler chỉ tăng một lần, vì cả hai lần đọc đều lấy từ closure của cùng một lượt render. Hãy dùng <code>setCount(c =&gt; c + 1)</code> mỗi khi giá trị tiếp theo phụ thuộc giá trị trước — kiểu không thấy được con bug đó, vì đằng nào <code>number</code> cũng là <code>number</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Only one of these two states can ever hold a <code>User</code>. Which, and why?' + code(
              "import { useState } from 'react';\n" +
              'interface User { id: number; name: string }\n' +
              '\n' +
              'const [u1, setU1] = useState(null);\n' +
              'const [u2, setU2] = useState<User | null>(null);\n' +
              '\n' +
              "setU1({ id: 1, name: 'Ada' });   // A\n" +
              "setU2({ id: 1, name: 'Ada' });   // B",
            ),
            'Chỉ một trong hai state này có thể chứa được một <code>User</code>. Cái nào, và vì sao?' + code(
              "import { useState } from 'react';\n" +
              'interface User { id: number; name: string }\n' +
              '\n' +
              'const [u1, setU1] = useState(null);\n' +
              'const [u2, setU2] = useState<User | null>(null);\n' +
              '\n' +
              "setU1({ id: 1, name: 'Ada' });   // A\n" +
              "setU2({ id: 1, name: 'Ada' });   // B",
            ),
          ),
          options: [
            B('B works; A fails, because from <code>null</code> alone TypeScript infers the type <b><code>null</code></b>, so the setter rejects every real value', 'B chạy được; A hỏng, vì chỉ từ <code>null</code> TypeScript suy ra kiểu <b><code>null</code></b>, nên setter từ chối mọi giá trị thật'),
            B('Both work — <code>null</code> widens to <code>any</code> the first time you set a real value', 'Cả hai chạy được — <code>null</code> nới thành <code>any</code> ngay lần đầu bạn đặt một giá trị thật'),
            B('Both fail — <code>useState</code> may not be initialised with <code>null</code>', 'Cả hai hỏng — <code>useState</code> không được khởi tạo bằng <code>null</code>'),
            B('A works and B fails — an explicit generic locks the state to its initial value', 'A chạy được và B hỏng — generic tường minh khoá state theo giá trị khởi đầu'),
          ],
          correct: 0,
          explanation: EX(
            'Verified: the compiler reports an error on A only. Inference works from the value you gave it, and the only value here is <code>null</code> — so <code>u1</code> is stuck as <code>null</code> forever and its setter accepts nothing else (the real message even mentions <code>(prevState: null) =&gt; null</code>). Writing the type argument yourself, <code>useState&lt;User | null&gt;(null)</code>, is what makes the state able to become a <code>User</code> later. The <code>| null</code> is not a nuisance either: it <em>is</em> the "not loaded yet" state, in the type, so the JSX cannot forget to render a placeholder before the data arrives. The same reasoning gives <code>useRef&lt;HTMLInputElement&gt;(null)</code> a <code>.current</code> of <code>HTMLInputElement | null</code> — the DOM node genuinely does not exist until React attaches it, which is why you write <code>ref.current?.focus()</code>.',
            'Đã kiểm thật: trình biên dịch chỉ báo lỗi ở A. Suy kiểu làm việc từ giá trị bạn đưa, mà giá trị duy nhất ở đây là <code>null</code> — nên <code>u1</code> kẹt vĩnh viễn ở kiểu <code>null</code> và setter của nó không nhận gì khác (thông báo thật còn nhắc tới <code>(prevState: null) =&gt; null</code>). Tự viết đối số kiểu, <code>useState&lt;User | null&gt;(null)</code>, mới là thứ cho phép state về sau trở thành một <code>User</code>. Cái <code>| null</code> cũng không phiền chút nào: nó <em>chính là</em> trạng thái "chưa tải xong", nằm ngay trong kiểu, nên JSX không thể quên vẽ phần chờ trước khi dữ liệu về. Cũng lý lẽ đó khiến <code>useRef&lt;HTMLInputElement&gt;(null)</code> có <code>.current</code> kiểu <code>HTMLInputElement | null</code> — nút DOM thật sự chưa tồn tại cho tới khi React gắn nó vào, và vì thế bạn viết <code>ref.current?.focus()</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'The input is <code>&lt;input type="number"&gt;</code>. What does the marked line produce?' + code(
              "import { ChangeEvent } from 'react';\n" +
              'function onChange(e: ChangeEvent<HTMLInputElement>) {\n' +
              '  const v: string   = e.target.value;\n' +
              '  const bad: number = e.target.value;   // <-- this line\n' +
              '  return v + bad;\n' +
              '}',
            ),
            'Ô nhập là <code>&lt;input type="number"&gt;</code>. Dòng được đánh dấu cho ra gì?' + code(
              "import { ChangeEvent } from 'react';\n" +
              'function onChange(e: ChangeEvent<HTMLInputElement>) {\n' +
              '  const v: string   = e.target.value;\n' +
              '  const bad: number = e.target.value;   // <-- dòng này\n' +
              '  return v + bad;\n' +
              '}',
            ),
          ),
          options: [
            B("<code>TS2322: Type &#x27;string&#x27; is not assignable to type &#x27;number&#x27;.</code> — an input&#x27;s value is a string whatever its <code>type</code> attribute says", "<code>TS2322: Type &#x27;string&#x27; is not assignable to type &#x27;number&#x27;.</code> — value của một input là chuỗi bất kể thuộc tính <code>type</code> ghi gì"),
            B('<code>TS2339</code> — <code>value</code> does not exist on <code>e.target</code>, which is a bare <code>EventTarget</code>', '<code>TS2339</code> — <code>value</code> không tồn tại trên <code>e.target</code>, vốn là một <code>EventTarget</code> trần'),
            B('No error, and <code>bad</code> is <code>NaN</code> at runtime', 'Không lỗi, và lúc chạy <code>bad</code> là <code>NaN</code>'),
            B('No error — with <code>type="number"</code> the DOM hands you a number', 'Không lỗi — với <code>type="number"</code> thì DOM trả về một số'),
          ],
          correct: 0,
          explanation: EX(
            'Verified against <code>@types/react</code> 18. React&#x27;s event types are generic over the element that fired them, and that type argument is exactly what makes <code>e.target</code> an input with a typed <code>value</code>, <code>checked</code> and <code>name</code> — without it you would get option 2&#x27;s bare <code>EventTarget</code>. The value is a <code>string</code> regardless of the <code>type</code> attribute, the same lesson as URL params in chapter 11: parse explicitly when you need a number. One genuinely subtle point to keep: <code>currentTarget</code> is the element the handler is <em>bound to</em> and is always your generic argument, while <code>target</code> is whatever was actually clicked — they coincide on an input&#x27;s <code>onChange</code>, which teaches the wrong lesson for a <code>&lt;div onClick&gt;</code> wrapping a button.',
            'Đã kiểm thật với <code>@types/react</code> 18. Kiểu sự kiện của React nhận tham số kiểu là phần tử phát ra nó, và chính đối số kiểu đó làm <code>e.target</code> thành một input với <code>value</code>, <code>checked</code>, <code>name</code> đã có kiểu — không có nó thì bạn nhận cái <code>EventTarget</code> trần như phương án 2. Giá trị là <code>string</code> bất kể thuộc tính <code>type</code>, cùng bài học với params URL ở chương 11: cần số thì phải phân tích tường minh. Một điểm thật sự tinh tế nên nhớ: <code>currentTarget</code> là phần tử mà handler được <em>gắn vào</em> và luôn đúng bằng đối số kiểu của bạn, còn <code>target</code> là thứ thật sự bị bấm — chúng trùng nhau trên <code>onChange</code> của một input, và điều đó dạy sai bài khi bạn có một <code>&lt;div onClick&gt;</code> bọc quanh một cái nút.',
          ),
        }),
        // ── Chương 13 — Validate runtime: Zod & Prisma ──────────────────
        mcq({
          prompt: B(
            'No interface was written by hand. Why is the last line still a compile error?' + code(
              "import { z } from 'zod';\n" +
              'const UserSchema = z.object({ id: z.number(), name: z.string() });\n' +
              'type User = z.infer<typeof UserSchema>;\n' +
              '\n' +
              "const bad: User = { id: '1', name: 'Ada' };\n" +
              "// TS2322: Type 'string' is not assignable to type 'number'.",
            ),
            'Không có interface nào được viết tay. Vì sao dòng cuối vẫn là lỗi biên dịch?' + code(
              "import { z } from 'zod';\n" +
              'const UserSchema = z.object({ id: z.number(), name: z.string() });\n' +
              'type User = z.infer<typeof UserSchema>;\n' +
              '\n' +
              "const bad: User = { id: '1', name: 'Ada' };\n" +
              "// TS2322: Type 'string' is not assignable to type 'number'.",
            ),
          ),
          options: [
            B('Because a Zod schema is a type, not a value, so it participates in type checking directly', 'Vì một schema Zod là một kiểu chứ không phải giá trị, nên nó tham gia thẳng vào việc kiểm kiểu'),
            B('It is not a compile error at all — a schema is an ordinary runtime value, so the mismatch only surfaces when <code>parse</code> is actually called', 'Nó hoàn toàn không phải lỗi biên dịch — schema chỉ là một giá trị lúc chạy bình thường, nên chỗ lệch chỉ lộ ra khi thật sự gọi <code>parse</code>'),
            B('Because Zod hooks into the compiler and runs the schema during type checking, validating the object literal on the spot', 'Vì Zod móc vào trình biên dịch và chạy schema ngay trong lúc kiểm kiểu, validate cái object literal tại chỗ'),
            B('Because <code>z.infer</code> <b>derives</b> a static type from the schema, so <code>User</code> is <code>{ id: number; name: string }</code> exactly as if you had written the interface', 'Vì <code>z.infer</code> <b>suy ra</b> một kiểu tĩnh từ schema, nên <code>User</code> đúng là <code>{ id: number; name: string }</code> y như bạn đã tự viết interface'),
          ],
          correct: 3,
          explanation: EX(
            'Verified. The whole point of a schema is that it is <b>both</b> things at once: an ordinary runtime value that can inspect real bytes, <em>and</em> the single source from which <code>z.infer</code> computes a compile-time type. So the compiler rejects <code>id: &#x27;1&#x27;</code> exactly as it would against a hand-written interface, while the same declaration can also check a request body at runtime — something an <code>interface</code> can never do, because it is erased. Option 1 has it backwards, and that inversion is worth noticing: the schema is a value, and the type is derived <em>from</em> it. The rule that follows is to derive one from the other and never declare both by hand: a hand-written interface sitting next to a schema that forgot a field agrees with it today and produces a request that validates successfully and then throws tomorrow.',
            'Đã kiểm thật. Điểm mấu chốt của một schema là nó <b>vừa</b> là hai thứ cùng lúc: một giá trị lúc chạy bình thường có thể soi được dữ liệu thật, <em>và</em> nguồn duy nhất để <code>z.infer</code> tính ra một kiểu lúc biên dịch. Nên trình biên dịch từ chối <code>id: &#x27;1&#x27;</code> y hệt như với một interface viết tay, trong khi cũng chính khai báo đó kiểm được body của một request lúc chạy — điều một <code>interface</code> không bao giờ làm nổi vì nó bị xoá. Phương án 1 nói ngược, và cái ngược đó đáng để ý: schema là một giá trị, còn kiểu được suy ra <em>từ</em> nó. Quy tắc rút ra là hãy suy cái này từ cái kia và đừng bao giờ khai cả hai bằng tay: một interface viết tay nằm cạnh một schema quên mất một field thì hôm nay còn khớp, ngày mai sẽ cho ra một request validate thành công rồi ném lỗi.',
          ),
        }),

        mcq({
          prompt: B(
            'The first function fails to compile and the second does not. What is the error, and what is it protecting?' + code(
              'const UserSchema = z.object({ id: z.number(), name: z.string() });\n' +
              '\n' +
              'function bad(raw: unknown): string {\n' +
              '  const r = UserSchema.safeParse(raw);\n' +
              '  return r.data.name;                     // A\n' +
              '}\n' +
              'function good(raw: unknown): string {\n' +
              '  const r = UserSchema.safeParse(raw);\n' +
              '  if (!r.success) return r.error.message;\n' +
              '  return r.data.name;                     // B\n' +
              '}',
            ),
            'Hàm đầu không biên dịch được, hàm sau thì được. Lỗi là gì, và nó đang bảo vệ điều gì?' + code(
              'const UserSchema = z.object({ id: z.number(), name: z.string() });\n' +
              '\n' +
              'function bad(raw: unknown): string {\n' +
              '  const r = UserSchema.safeParse(raw);\n' +
              '  return r.data.name;                     // A\n' +
              '}\n' +
              'function good(raw: unknown): string {\n' +
              '  const r = UserSchema.safeParse(raw);\n' +
              '  if (!r.success) return r.error.message;\n' +
              '  return r.data.name;                     // B\n' +
              '}',
            ),
          ),
          options: [
            B('A: no error — the difference between the two functions is purely stylistic, since <code>safeParse</code> never throws and always hands back the parsed value', 'A: không lỗi — khác biệt giữa hai hàm thuần tuý là phong cách, vì <code>safeParse</code> không bao giờ ném lỗi và luôn trả lại giá trị đã phân tích'),
            B('A: <code>TS2339</code>, because the result of <code>safeParse</code> has no <code>data</code> property at all', 'A: <code>TS2339</code>, vì kết quả của <code>safeParse</code> không hề có thuộc tính <code>data</code>'),
            B("A: <code>TS18048: &#x27;r.data&#x27; is possibly &#x27;undefined&#x27;</code> — <code>safeParse</code> returns a discriminated union, and narrowing on <code>r.success</code> is what makes <code>r.data</code> readable", "A: <code>TS18048: &#x27;r.data&#x27; is possibly &#x27;undefined&#x27;</code> — <code>safeParse</code> trả về một discriminated union, và thu hẹp trên <code>r.success</code> mới là thứ cho phép đọc <code>r.data</code>"),
            B('A: <code>TS18046</code>, because the parameter <code>raw</code> is <code>unknown</code> and handing it to <code>safeParse</code> does not count as narrowing it', 'A: <code>TS18046</code>, vì tham số <code>raw</code> là <code>unknown</code> và việc đưa nó cho <code>safeParse</code> không được tính là đã thu hẹp'),
          ],
          correct: 2,
          explanation: EX(
            'Verified with Zod 3.25: the sole diagnostic is TS18048 on line A, and <code>good</code> compiles cleanly. <code>safeParse</code> returns <code>{ success: true; data: T } | { success: false; error: ZodError }</code> — chapter 5&#x27;s discriminated union, now guarding real input — so the type system makes handling the invalid case <b>mandatory</b> rather than polite. That error is the mechanism working, which is why the tempting fixes are the dangerous ones: <code>r.data!</code>, an <code>as</code>, or a destructuring default all compile and all reintroduce exactly the bug validation was added to prevent, since on a malformed request <code>data</code> really is <code>undefined</code> and the handler carries on with it. Use <code>safeParse</code> where invalid input is expected and deserves a 400, and <code>parse</code> (which throws) where invalid input is a bug that should kill the process loudly — parsing your own config at startup, for instance.',
            'Đã kiểm thật với Zod 3.25: lỗi duy nhất là TS18048 ở dòng A, còn <code>good</code> biên dịch sạch. <code>safeParse</code> trả về <code>{ success: true; data: T } | { success: false; error: ZodError }</code> — đúng discriminated union của chương 5, giờ đứng canh dữ liệu thật — nên hệ kiểu biến việc xử lý ca không hợp lệ thành <b>bắt buộc</b> chứ không phải lịch sự. Lỗi đó chính là cơ chế đang chạy đúng, và vì thế những cách sửa hấp dẫn lại là những cách nguy hiểm: <code>r.data!</code>, một chữ <code>as</code>, hay một giá trị mặc định khi destructuring đều biên dịch được và đều đưa trở lại đúng con bug mà việc validate sinh ra để chặn, vì với một request dị dạng thì <code>data</code> thật sự là <code>undefined</code> và handler cứ thế chạy tiếp. Hãy dùng <code>safeParse</code> ở chỗ input sai là chuyện dự đoán được và xứng đáng nhận 400, còn <code>parse</code> (ném lỗi) ở chỗ input sai là một bug nên giết tiến trình thật lớn tiếng — ví dụ khi phân tích chính file cấu hình của bạn lúc khởi động.',
          ),
        }),

        mcq({
          prompt: B(
            'Line A is a compile error and line B was run for real. What is <code>Env</code>, and what did B print?' + code(
              'const EnvSchema = z.object({\n' +
              '  PORT: z.coerce.number(),\n' +
              "  NODE_ENV: z.enum(['dev', 'prod']),\n" +
              '});\n' +
              'type Env = z.infer<typeof EnvSchema>;\n' +
              '\n' +
              "const bad: Env = { PORT: 3000, NODE_ENV: 'staging' };            // A\n" +
              "console.log(EnvSchema.parse({ PORT: '8080', NODE_ENV: 'dev' }));  // B",
            ),
            'Dòng A là lỗi biên dịch còn dòng B đã được chạy thật. <code>Env</code> là gì, và B in ra gì?' + code(
              'const EnvSchema = z.object({\n' +
              '  PORT: z.coerce.number(),\n' +
              "  NODE_ENV: z.enum(['dev', 'prod']),\n" +
              '});\n' +
              'type Env = z.infer<typeof EnvSchema>;\n' +
              '\n' +
              "const bad: Env = { PORT: 3000, NODE_ENV: 'staging' };            // A\n" +
              "console.log(EnvSchema.parse({ PORT: '8080', NODE_ENV: 'dev' }));  // B",
            ),
          ),
          options: [
            B('<code>{ PORT: number; NODE_ENV: &#x27;dev&#x27; | &#x27;prod&#x27; }</code>; B threw, because <code>parse</code> never converts values', '<code>{ PORT: number; NODE_ENV: &#x27;dev&#x27; | &#x27;prod&#x27; }</code>; B ném lỗi, vì <code>parse</code> không bao giờ chuyển đổi giá trị'),
            B("<code>{ PORT: string; NODE_ENV: string }</code>; B printed <code>{ PORT: &#x27;8080&#x27;, NODE_ENV: &#x27;dev&#x27; }</code>", "<code>{ PORT: string; NODE_ENV: string }</code>; B in ra <code>{ PORT: &#x27;8080&#x27;, NODE_ENV: &#x27;dev&#x27; }</code>"),
            B("<code>{ PORT: number; NODE_ENV: &#x27;dev&#x27; | &#x27;prod&#x27; }</code>; B printed <code>{ PORT: 8080, NODE_ENV: &#x27;dev&#x27; }</code> — the string was <b>coerced</b> to a number", "<code>{ PORT: number; NODE_ENV: &#x27;dev&#x27; | &#x27;prod&#x27; }</code>; B in ra <code>{ PORT: 8080, NODE_ENV: &#x27;dev&#x27; }</code> — chuỗi đã bị <b>ép</b> thành số"),
            B('<code>{ PORT: number; NODE_ENV: string }</code>; B threw, because <code>PORT</code> was passed as a string', '<code>{ PORT: number; NODE_ENV: string }</code>; B ném lỗi, vì <code>PORT</code> được truyền dưới dạng chuỗi'),
          ],
          correct: 2,
          explanation: EX(
            'Verified both ways: line A reports <em>Type &#x27;"staging"&#x27; is not assignable to type &#x27;"dev" | "prod"&#x27;</em>, and running line B prints <code>{ PORT: 8080, NODE_ENV: &#x27;dev&#x27; }</code> with <code>PORT</code> a real number. A schema does <b>work</b> during validation, not just checking: <code>z.coerce.number()</code> turns the text an environment variable always is into a number (and rejects garbage that plain <code>Number()</code> would silently make <code>NaN</code>), and <code>z.enum</code> produces a literal union, so a misspelled <code>NODE_ENV</code> is a compile error <em>and</em> a loud boot-time failure. One caveat worth carrying: <code>z.infer</code> gives you the <b>output</b> type. Here the value you may legally pass <em>in</em> for <code>PORT</code> is a string, so using the inferred type to describe a function&#x27;s parameter would reject input the schema happily accepts — that is what <code>z.input</code> is for.',
            'Đã kiểm cả hai đường: dòng A báo <em>Type &#x27;"staging"&#x27; is not assignable to type &#x27;"dev" | "prod"&#x27;</em>, còn chạy dòng B in ra <code>{ PORT: 8080, NODE_ENV: &#x27;dev&#x27; }</code> với <code>PORT</code> là số thật. Một schema có <b>làm việc</b> trong lúc validate chứ không chỉ kiểm: <code>z.coerce.number()</code> biến thứ chữ mà biến môi trường luôn là thành một con số (và từ chối rác mà <code>Number()</code> thuần sẽ âm thầm biến thành <code>NaN</code>), còn <code>z.enum</code> sinh ra một union literal, nên một <code>NODE_ENV</code> gõ sai vừa là lỗi biên dịch <em>vừa</em> là một cú chết lớn tiếng lúc khởi động. Một lưu ý đáng mang theo: <code>z.infer</code> cho bạn kiểu <b>đầu ra</b>. Ở đây giá trị bạn được phép truyền <em>vào</em> cho <code>PORT</code> là một chuỗi, nên dùng kiểu suy ra ấy để mô tả tham số của một hàm sẽ từ chối đúng thứ input mà schema vui vẻ nhận — đó là việc của <code>z.input</code>.',
          ),
        }),

        // ── Chương 14 — Class & decorator ───────────────────────────────
        mcq({
          prompt: B(
            'Both classes hide the hash. This was run for real — what did it print?' + code(
              'class UserA { constructor(public name: string, private passwordHash: string) {} }\n' +
              'class UserB {\n' +
              '  #passwordHash: string;\n' +
              '  constructor(public name: string, h: string) { this.#passwordHash = h; }\n' +
              '}\n' +
              "console.log(JSON.stringify(new UserA('Ada', 'SECRET')));\n" +
              "console.log(JSON.stringify(new UserB('Ada', 'SECRET')));",
            ),
            'Cả hai class đều giấu cái hash. Đoạn này đã chạy thật — nó in ra gì?' + code(
              'class UserA { constructor(public name: string, private passwordHash: string) {} }\n' +
              'class UserB {\n' +
              '  #passwordHash: string;\n' +
              '  constructor(public name: string, h: string) { this.#passwordHash = h; }\n' +
              '}\n' +
              "console.log(JSON.stringify(new UserA('Ada', 'SECRET')));\n" +
              "console.log(JSON.stringify(new UserB('Ada', 'SECRET')));",
            ),
          ),
          options: [
            B('<code>{"name":"Ada","passwordHash":"SECRET"}</code> then <code>{"name":"Ada"}</code>', '<code>{"name":"Ada","passwordHash":"SECRET"}</code> rồi <code>{"name":"Ada"}</code>'),
            B('<code>{"name":"Ada"}</code> then <code>{"name":"Ada","#passwordHash":"SECRET"}</code>', '<code>{"name":"Ada"}</code> rồi <code>{"name":"Ada","#passwordHash":"SECRET"}</code>'),
            B('Both print the hash — <code>JSON.stringify</code> ignores access modifiers entirely', 'Cả hai đều in ra hash — <code>JSON.stringify</code> hoàn toàn phớt lờ modifier truy cập'),
            B('<code>{"name":"Ada"}</code> then <code>{"name":"Ada"}</code> — both privacies hide the field', '<code>{"name":"Ada"}</code> rồi <code>{"name":"Ada"}</code> — cả hai kiểu riêng tư đều giấu được field'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. TypeScript&#x27;s <code>private</code> is a <b>compile-time</b> rule: it stops <em>your code</em> reading the field and is then erased, leaving an ordinary enumerable property that <code>JSON.stringify</code> walks straight into — so <code>res.json(user)</code> serialises the hash, and so does <code>console.log</code>, structured logging, and anything that spreads the object. A <code>#field</code> is real JavaScript privacy enforced by the engine: it never appears in <code>Object.keys</code> or <code>JSON.stringify</code>, and <code>(obj as any).#x</code> cannot reach it either. Notice the other feature in the snippet: <code>constructor(public name: string, …)</code> is a <b>parameter property</b> — the modifier alone declares and assigns the field, which is how <code>AppError</code>&#x27;s <code>statusCode</code> exists without a separate declaration. Best practice for anything leaving the process is neither: build the response with an explicit <code>Pick</code>-based DTO, so a new model field cannot become a new response field.',
            'Đã chạy thật. <code>private</code> của TypeScript là quy tắc <b>lúc biên dịch</b>: nó chặn <em>mã của bạn</em> đọc field rồi bị xoá đi, để lại một thuộc tính liệt kê được bình thường mà <code>JSON.stringify</code> đi thẳng vào — nên <code>res.json(user)</code> tuần tự hoá luôn cái hash, và <code>console.log</code>, log có cấu trúc, hay bất cứ chỗ nào spread object cũng vậy. Một <code>#field</code> là riêng tư JavaScript thật, do engine ép: nó không bao giờ hiện trong <code>Object.keys</code> hay <code>JSON.stringify</code>, và <code>(obj as any).#x</code> cũng không với tới được. Để ý thêm một tính năng nữa trong đoạn mã: <code>constructor(public name: string, …)</code> là một <b>parameter property</b> — chỉ riêng cái modifier đã khai và gán field, và đó là cách <code>statusCode</code> của <code>AppError</code> tồn tại mà không cần khai riêng. Thực hành tốt nhất cho thứ rời khỏi tiến trình thì không phải cả hai: hãy dựng response bằng một DTO tường minh làm từ <code>Pick</code>, để một field mới trong model không thể tự thành một field mới trong response.',
          ),
        }),

        mcq({
          prompt: B(
            'The compiler reports one error on each marked line. Which pair is right?' + code(
              'interface Shape { area(): number }\n' +
              '\n' +
              'abstract class Base implements Shape {\n' +
              '  abstract area(): number;\n' +
              "  describe(): string { return 'area=' + this.area(); }\n" +
              '}\n' +
              'class Square implements Shape {\n' +
              '  constructor(private side: number) {}       // A: no area()\n' +
              '}\n' +
              'const b = new Base();                        // B',
            ),
            'Trình biên dịch báo một lỗi ở mỗi dòng được đánh dấu. Cặp nào đúng?' + code(
              'interface Shape { area(): number }\n' +
              '\n' +
              'abstract class Base implements Shape {\n' +
              '  abstract area(): number;\n' +
              "  describe(): string { return 'area=' + this.area(); }\n" +
              '}\n' +
              'class Square implements Shape {\n' +
              '  constructor(private side: number) {}       // A: không có area()\n' +
              '}\n' +
              'const b = new Base();                        // B',
            ),
          ),
          options: [
            B('A: <code>TS2420</code> — B: no error, since <code>Base</code> supplies <code>describe()</code> and could be constructed', 'A: <code>TS2420</code> — B: không lỗi, vì <code>Base</code> có sẵn <code>describe()</code> nên dựng được'),
            B('A: <code>TS2515</code> for a non-implemented abstract member — B: <code>TS2420</code>', 'A: <code>TS2515</code> vì một thành viên abstract chưa cài đặt — B: <code>TS2420</code>'),
            B("A: <code>TS2420: Class &#x27;Square&#x27; incorrectly implements interface &#x27;Shape&#x27;</code> — B: <code>TS2511: Cannot create an instance of an abstract class</code>", "A: <code>TS2420: Class &#x27;Square&#x27; incorrectly implements interface &#x27;Shape&#x27;</code> — B: <code>TS2511: Cannot create an instance of an abstract class</code>"),
            B('A: no error — <code>implements</code> is a hint the compiler does not verify — B: <code>TS2511</code>', 'A: không lỗi — <code>implements</code> chỉ là gợi ý, trình biên dịch không kiểm — B: <code>TS2511</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Verified: exactly those two diagnostics, on exactly those lines. <code>implements</code> is a <b>compile-time check</b> that the class has every member the interface declares — nothing is inherited, since an interface has no code — so a missing method is caught at the class declaration rather than at some distant call site. An <code>abstract</code> class is the other tool: it supplies shared behaviour (<code>describe</code>) while leaving holes (<code>abstract area()</code>) for subclasses, and because those holes make it meaningless on its own, <code>new Base()</code> is rejected. Use <code>extends</code> when variants really do share code, and <code>implements</code> when several unrelated classes fill one role. One trap worth knowing: <code>implements</code> checks the class but does <em>not</em> feed types into it — write <code>async put(key, body)</code> in an implementing class and you get TS7006 implicit-any on both parameters, because the clause verifies rather than infers.',
            'Đã kiểm thật: đúng hai lỗi đó, ở đúng hai dòng đó. <code>implements</code> là một <b>phép kiểm lúc biên dịch</b> rằng class có đủ mọi thành viên interface khai — không có gì được kế thừa cả, vì interface không mang mã — nên một method thiếu bị bắt ngay tại khai báo class chứ không phải ở một chỗ gọi xa lắc. <code>abstract class</code> là công cụ còn lại: nó cung cấp hành vi dùng chung (<code>describe</code>) trong khi chừa lại các lỗ hổng (<code>abstract area()</code>) cho lớp con, và vì những lỗ đó khiến nó vô nghĩa khi đứng một mình nên <code>new Base()</code> bị từ chối. Dùng <code>extends</code> khi các biến thể thật sự chia sẻ mã, dùng <code>implements</code> khi nhiều class không liên quan cùng đảm một vai. Một cái bẫy đáng biết: <code>implements</code> kiểm class nhưng <em>không</em> bơm kiểu vào trong — viết <code>async put(key, body)</code> trong một class đang implements thì bạn nhận TS7006 implicit-any ở cả hai tham số, vì mệnh đề này xác minh chứ không suy kiểu.',
          ),
        }),

        // ── Chương 15 — Hiệu năng build ─────────────────────────────────
        mcq({
          prompt: B(
            '<code>User</code> is an interface. Which flag produces which error?' + code(
              '// reexport.ts\n' +
              "export { User } from './types.js';\n" +
              '// -> TS1205: Re-exporting a type when \'isolatedModules\' is enabled\n' +
              "//    requires using 'export type'.\n" +
              '\n' +
              '// verbatim.ts\n' +
              "import { User } from './types.js';\n" +
              "// -> TS1484: 'User' is a type and must be imported using a type-only\n" +
              "//    import when 'verbatimModuleSyntax' is enabled.",
            ),
            '<code>User</code> là một interface. Cờ nào sinh ra lỗi nào?' + code(
              '// reexport.ts\n' +
              "export { User } from './types.js';\n" +
              '// -> TS1205: Re-exporting a type when \'isolatedModules\' is enabled\n' +
              "//    requires using 'export type'.\n" +
              '\n' +
              '// verbatim.ts\n' +
              "import { User } from './types.js';\n" +
              "// -> TS1484: 'User' is a type and must be imported using a type-only\n" +
              "//    import when 'verbatimModuleSyntax' is enabled.",
            ),
          ),
          options: [
            B('They are two names for the same option kept for backwards compatibility, so enabling either one produces both errors and you only ever need one', 'Chúng là hai tên của cùng một tuỳ chọn, giữ lại cho tương thích ngược, nên bật cái nào cũng ra cả hai lỗi và bạn chỉ cần một cái'),
            B('Both flags exist purely to shrink the emitted bundle by dropping type-only imports; neither has any bearing on whether the output is correct', 'Cả hai cờ sinh ra chỉ để thu nhỏ bundle xuất ra bằng cách bỏ các import chỉ-kiểu; không cái nào dính dáng tới chuyện đầu ra có đúng hay không'),
            B('Both exist because a <b>per-file</b> transpiler (esbuild, SWC, Next) sees one file at a time and cannot tell whether a name is a type or a value — the flags force you to say so explicitly', 'Cả hai tồn tại vì một bộ transpile <b>từng-file</b> (esbuild, SWC, Next) chỉ nhìn một file mỗi lần và không biết một cái tên là kiểu hay giá trị — các cờ này ép bạn nói rõ ra'),
            B('Both are switched on by the <code>strict</code> umbrella together with <code>noImplicitAny</code>, so turning <code>strict</code> off makes the two errors disappear', 'Cả hai đều được chiếc ô <code>strict</code> bật lên cùng với <code>noImplicitAny</code>, nên tắt <code>strict</code> là hai lỗi đó biến mất'),
          ],
          correct: 2,
          explanation: EX(
            'Verified: both errors were reproduced by adding exactly one flag each. <code>tsc</code> sees the whole program, so it can resolve <code>./types</code> and know that <code>User</code> vanishes at runtime. esbuild and SWC deliberately do not — compiling one file in isolation is what makes them fast — so given <code>export { User } from &#x27;./types&#x27;</code> they cannot tell whether to emit a real re-export or erase it. <code>isolatedModules</code> bans exactly the constructs that need cross-file type information; <code>verbatimModuleSyntax</code> goes further and emits imports exactly as written, so anything not marked <code>type</code> stays in the output. That is the modern two-tool setup: the bundler transpiles (fast, checking nothing) while <code>tsc --noEmit</code> checks. Note that these flags are not part of <code>strict</code>, and that the bundler will happily ship type-broken code, which is why the check has to run as its own step in CI.',
            'Đã kiểm thật: cả hai lỗi được tái hiện bằng cách thêm đúng một cờ mỗi lần. <code>tsc</code> nhìn cả chương trình nên nó phân giải được <code>./types</code> và biết <code>User</code> sẽ biến mất lúc chạy. esbuild và SWC cố ý không làm thế — biên dịch từng file riêng lẻ mới là thứ khiến chúng nhanh — nên với <code>export { User } from &#x27;./types&#x27;</code> chúng không biết nên xuất một re-export thật hay xoá nó đi. <code>isolatedModules</code> cấm đúng những cấu trúc cần thông tin kiểu chéo-file; <code>verbatimModuleSyntax</code> đi xa hơn, xuất import y nguyên như viết, nên thứ gì không đánh dấu <code>type</code> sẽ nằm lại trong đầu ra. Đó chính là thiết lập hai-công-cụ hiện đại: bundler lo transpile (nhanh, không kiểm gì) còn <code>tsc --noEmit</code> lo kiểm. Lưu ý các cờ này không nằm trong <code>strict</code>, và bundler sẵn sàng đẩy đi mã hỏng kiểu — vì thế phép kiểm phải chạy như một bước riêng trong CI.',
          ),
        }),

        mcq({
          prompt: B(
            'A build is slow. <code>tsc --extendedDiagnostics</code> shows a huge "Lines of Library" figure and most of the time in "Check time". Which change targets that, and what does it cost?',
            'Một bản build chậm. <code>tsc --extendedDiagnostics</code> cho thấy con số "Lines of Library" rất lớn và phần lớn thời gian nằm ở "Check time". Thay đổi nào nhắm đúng chỗ đó, và cái giá là gì?',
          ),
          options: [
            B('<code>noEmit: true</code> — writing the JavaScript is the expensive half of a build, so skipping the output is the biggest single win available', '<code>noEmit: true</code> — ghi ra JavaScript mới là nửa đắt của một bản build, nên bỏ khâu xuất file là món lợi lớn nhất có thể có'),
            B('<code>skipLibCheck: true</code> — it stops type-checking <em>inside</em> <code>.d.ts</code> files (your code is still checked against them); the cost is that two dependencies whose declarations genuinely conflict no longer error at build time', '<code>skipLibCheck: true</code> — nó ngừng kiểm kiểu <em>bên trong</em> các file <code>.d.ts</code> (mã của bạn vẫn được kiểm dựa trên chúng); cái giá là hai dependency có khai báo xung đột thật sẽ không còn báo lỗi lúc build'),
            B('<code>incremental: true</code> — the <code>.tsbuildinfo</code> cache stores every dependency declaration it has already seen, so library checking never runs a second time', '<code>incremental: true</code> — cache <code>.tsbuildinfo</code> lưu lại mọi khai báo dependency nó đã xem, nên việc kiểm thư viện không bao giờ chạy lần thứ hai'),
            B('Lowering <code>target</code> — a lower target emits simpler JavaScript, and it is that emit step the diagnostics are reporting as the slow one', 'Hạ <code>target</code> xuống — target thấp hơn thì xuất ra JavaScript đơn giản hơn, và chính khâu xuất file đó mới là thứ bảng chẩn đoán báo là chậm'),
          ],
          correct: 1,
          explanation: EX(
            'Type-checking, not emit, is the expensive part of <code>tsc</code> — comparing structures, resolving generics, walking the <code>.d.ts</code> graph of every dependency — which already rules out option 1: <code>noEmit</code> makes it a pure checker, it does not make it faster in any meaningful way. When the diagnostics show library lines dominating, <code>skipLibCheck</code> is the lever that matches the symptom, and it is a near-universal setting for a second reason too: it sidesteps conflicts deep between two libraries&#x27; declarations that would otherwise fail a build over code you do not control. But it is a trade, not a free win, and the honest version is to keep it on for day-to-day speed while running one CI job without it so real conflicts still surface somewhere. The other two levers are complementary rather than alternatives: <code>incremental: true</code> caches a build in <code>.tsbuildinfo</code> so the next one re-checks only what changed, and project references (<code>composite</code> plus <code>tsc -b</code>) split a large repo into independently-built units.',
            'Kiểm kiểu, chứ không phải xuất file, mới là phần đắt của <code>tsc</code> — so sánh cấu trúc, phân giải generic, đi khắp đồ thị <code>.d.ts</code> của mọi dependency — điều đó đã loại luôn phương án 1: <code>noEmit</code> biến nó thành bộ kiểm thuần chứ không làm nó nhanh lên theo nghĩa nào đáng kể. Khi bảng chẩn đoán cho thấy số dòng thư viện áp đảo thì <code>skipLibCheck</code> là cần gạt khớp đúng triệu chứng, và nó gần như là thiết lập mặc định của mọi dự án còn vì một lý do nữa: nó né được các xung đột nằm sâu giữa khai báo của hai thư viện, thứ vốn có thể làm hỏng bản build vì đoạn mã bạn không kiểm soát. Nhưng đây là một sự đánh đổi chứ không phải món hời miễn phí, và bản trung thực là bật nó cho tốc độ hằng ngày, đồng thời chạy một job CI không bật nó để các xung đột thật vẫn lộ ra ở đâu đó. Hai cần gạt còn lại thì bổ sung chứ không thay thế: <code>incremental: true</code> lưu cache bản build vào <code>.tsbuildinfo</code> để lần sau chỉ kiểm lại phần đã đổi, còn project references (<code>composite</code> cộng <code>tsc -b</code>) chia một kho lớn thành các đơn vị build độc lập.',
          ),
        }),

        // ── Chương 16 — Kiến trúc & tư duy type-driven ──────────────────
        mcq({
          prompt: B(
            'The last line is a compile error. What did the union buy that a flat object could not?' + code(
              'type State =\n' +
              "  | { status: 'loading' }\n" +
              "  | { status: 'success'; data: string }\n" +
              "  | { status: 'error'; error: string };\n" +
              '\n' +
              'function render(s: State): string {\n' +
              "  if (s.status === 'success') return s.data;\n" +
              "  if (s.status === 'error')   return s.error;\n" +
              '  return s.data;   // TS2339 on this line\n' +
              '}',
            ),
            'Dòng cuối là lỗi biên dịch. Cái union mua được điều gì mà một object phẳng không có?' + code(
              'type State =\n' +
              "  | { status: 'loading' }\n" +
              "  | { status: 'success'; data: string }\n" +
              "  | { status: 'error'; error: string };\n" +
              '\n' +
              'function render(s: State): string {\n' +
              "  if (s.status === 'success') return s.data;\n" +
              "  if (s.status === 'error')   return s.error;\n" +
              '  return s.data;   // TS2339 ở dòng này\n' +
              '}',
            ),
          ),
          options: [
            B('It makes <code>render</code> exhaustive automatically, so no <code>never</code> assertion is ever needed', 'Nó tự động làm <code>render</code> phủ đủ, nên chẳng bao giờ cần một phép ép <code>never</code>'),
            B('It validates the incoming state at runtime, replacing the need for a schema', 'Nó validate trạng thái đầu vào lúc chạy, thay thế nhu cầu có một schema'),
            B('Nothing structural — it is the same information as <code>{ loading: boolean; data?: string; error?: string }</code>, just written differently', 'Không gì về mặt cấu trúc — vẫn là thông tin y hệt <code>{ loading: boolean; data?: string; error?: string }</code>, chỉ viết khác đi'),
            B('Each field exists only in the state where it means something, so "loading with data" is <b>not a value you can construct</b> — the compiler caught a leftover read instead of a defensive check being forgotten', 'Mỗi field chỉ tồn tại ở đúng trạng thái mà nó có nghĩa, nên "loading mà có data" là <b>một giá trị không dựng ra được</b> — trình biên dịch bắt được một phép đọc còn sót thay vì để một phép kiểm phòng thủ bị quên'),
          ],
          correct: 3,
          explanation: EX(
            'Verified: <em>Property &#x27;data&#x27; does not exist on type &#x27;{ status: "loading" }&#x27;</em>. The flat alternative has eight combinations and only three of them are real — <code>loading: true</code> together with an <code>error</code> is representable, so sooner or later someone produces it, every consumer writes its own guard, the guards disagree, and you get the spinner and the error on screen at once. Naming the states instead means the invalid combinations do not merely get rejected, they cannot be written down. Two honest limits, which are what options 1 and 2 get wrong. This buys <em>reachability</em>, not exhaustiveness: adding a fourth variant here would not fail this function, which is what the <code>never</code> assertion of 5.4 is for. And it proves nothing about data arriving from outside — the guarantee is only as strong as the narrowest point it passes through, so keep the discriminated shape across the wire (the <code>ok: true / ok: false</code> envelope) instead of flattening it at the boundary.',
            'Đã kiểm thật: <em>Property &#x27;data&#x27; does not exist on type &#x27;{ status: "loading" }&#x27;</em>. Bản phẳng có tám tổ hợp mà chỉ ba tổ hợp là thật — <code>loading: true</code> kèm một <code>error</code> vẫn biểu diễn được, nên sớm muộn cũng có người tạo ra nó, mỗi bên tiêu thụ tự viết một phép canh, các phép canh mâu thuẫn nhau, rồi bạn nhận cả vòng xoay chờ lẫn thông báo lỗi trên màn hình cùng lúc. Đặt tên cho từng trạng thái thì các tổ hợp sai không chỉ bị từ chối mà là không viết ra nổi. Hai giới hạn trung thực, và đó là chỗ phương án 1 với 2 nói sai. Thứ này mua được <em>tính tới được</em> chứ không phải tính phủ đủ: thêm biến thể thứ tư vào đây sẽ không làm hàm này hỏng, và đó mới là việc của phép ép <code>never</code> ở bài 5.4. Còn nó không chứng minh gì về dữ liệu từ bên ngoài tới — bảo đảm chỉ mạnh bằng điểm hẹp nhất mà nó đi qua, nên hãy giữ nguyên dáng có nhãn khi truyền qua đường mạng (envelope <code>ok: true / ok: false</code>) thay vì làm phẳng nó ở biên.',
          ),
        }),

        mcq({
          prompt: B(
            'Neither line errors under <code>--strict</code>. Why is the first one the dangerous one?' + code(
              'declare function listen(port: number): void;\n' +
              '\n' +
              "const cfg: any = JSON.parse('{\"server\":{}}');\n" +
              'const port = cfg.server.port;   // A\n' +
              'listen(port);                   // A: no error\n' +
              '\n' +
              "const cfg2: unknown = JSON.parse('{\"server\":{}}');\n" +
              'const port2 = (cfg2 as { server: { port: number } }).server.port;   // B',
            ),
            'Không dòng nào lỗi dưới <code>--strict</code>. Vì sao dòng đầu mới là dòng nguy hiểm?' + code(
              'declare function listen(port: number): void;\n' +
              '\n' +
              "const cfg: any = JSON.parse('{\"server\":{}}');\n" +
              'const port = cfg.server.port;   // A\n' +
              'listen(port);                   // A: không lỗi\n' +
              '\n' +
              "const cfg2: unknown = JSON.parse('{\"server\":{}}');\n" +
              'const port2 = (cfg2 as { server: { port: number } }).server.port;   // B',
            ),
          ),
          options: [
            B('It is not dangerous — <code>any</code> and an <code>as</code> assertion are equally safe, since neither checks anything', 'Nó không nguy hiểm — <code>any</code> và một phép ép <code>as</code> an toàn như nhau, vì chẳng cái nào kiểm gì cả'),
            B('<code>any</code> <b>propagates</b>: <code>port</code> is <code>any</code> too, so it flows into <code>listen(port: number)</code> unchecked, and the hole spreads to every expression that touched it — while a single <code>as</code> is at least one visible, greppable line', '<code>any</code> <b>lan ra</b>: <code>port</code> cũng là <code>any</code>, nên nó chảy thẳng vào <code>listen(port: number)</code> mà không bị kiểm, và cái lỗ lan tới mọi biểu thức chạm vào nó — trong khi một chữ <code>as</code> ít nhất là một dòng nhìn thấy được và grep ra được'),
            B('Because <code>JSON.parse</code> is declared to return <code>unknown</code>, so line A is really a hidden compile error that only <code>skipLibCheck</code> is suppressing', 'Vì <code>JSON.parse</code> được khai là trả về <code>unknown</code>, nên dòng A thực chất là một lỗi biên dịch bị giấu mà chỉ <code>skipLibCheck</code> đang dập đi'),
            B('Because an <code>as</code> assertion emits a runtime shape check on the value while <code>any</code> emits nothing, so only line B would catch the missing port', 'Vì một phép ép <code>as</code> có sinh ra phép kiểm dáng lúc chạy trên giá trị còn <code>any</code> thì không sinh gì, nên chỉ dòng B bắt được cái port bị thiếu'),
          ],
          correct: 1,
          explanation: EX(
            'Verified: <code>tsc --strict</code> is completely silent on both. The difference is blast radius. Anything derived from an <code>any</code> is also <code>any</code>, and <code>any</code> is assignable to everything, so <code>listen(port)</code> passes with no complaint and the same hole travels outward through return types and across module boundaries — the damage is not the one line you wrote but every expression that touched it, and nothing ever reports it. An assertion is also unchecked, but it is local and greppable. Neither is the right answer at a boundary, though: the right default is <code>unknown</code>, because it propagates the <em>need to check</em> instead of propagating permission, and the errors it produces are the list of places that need a real check. That is the whole course in one line — validate at the edges, trust the inside — with <code>noImplicitAny</code> to catch the accidental <code>any</code>s and a periodic grep for the deliberate ones.',
            'Đã kiểm thật: <code>tsc --strict</code> im hoàn toàn với cả hai. Khác biệt nằm ở bán kính vụ nổ. Bất cứ thứ gì suy ra từ một <code>any</code> cũng là <code>any</code>, mà <code>any</code> thì gán được cho mọi thứ, nên <code>listen(port)</code> lọt qua không một tiếng kêu và cái lỗ đó đi tiếp ra ngoài qua kiểu trả về và xuyên qua biên giới module — thiệt hại không phải dòng bạn vừa viết mà là mọi biểu thức đã chạm vào nó, và chẳng có gì báo cáo cả. Một phép ép cũng không được kiểm, nhưng nó cục bộ và grep ra được. Dù vậy, ở một biên thì cả hai đều không phải đáp án đúng: mặc định đúng là <code>unknown</code>, vì nó lan truyền <em>nhu cầu phải kiểm</em> thay vì lan truyền sự cho phép, và những lỗi nó sinh ra chính là danh sách các chỗ cần một phép kiểm thật. Đó là cả khoá học gói trong một câu — validate tại biên, tin phần bên trong — cộng thêm <code>noImplicitAny</code> để bắt các <code>any</code> vô tình và một lần grep định kỳ cho những cái cố ý.',
          ),
        }),
      ],
    },
  ],
};
