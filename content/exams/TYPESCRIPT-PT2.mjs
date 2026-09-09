/**
 * TypeScript — Progress Test 2 (chương 6–11).
 *
 * Đề tự soạn, bám sát giáo trình `content/courses/typescript/s06…s11`.
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi.
 *
 * ⚠️ ĐO THẬT, KHÔNG ĐOÁN. Mọi thông báo lỗi, mọi kiểu suy luận và mọi dòng
 * "in ra gì" trong file này đều lấy từ việc chạy thật trên máy soạn đề:
 *
 *   • TypeScript  5.9.3   (`node_modules/.bin/tsc -v`)
 *   • Node        v22.21.0
 *   • Cờ đo       tsc --noEmit --strict --target ES2022 <file>.ts
 *     – câu nào có import thì thêm  --module NodeNext --moduleResolution NodeNext
 *     – câu nào chạm DOM thì thêm   --lib ES2022,DOM
 *     – câu về cờ ngoài strict thì bật đúng cờ ấy và ghi rõ trong câu
 *   • Express     @types/express 4.17.25 (bản repo đang cài)
 *   • Chạy        node <file>.ts  (Node 22 tự xoá chú thích kiểu)
 *
 * ⚠️ BA CHỖ MÁY KHÁC GIÁO TRÌNH (đo 10/09/2026 — theo MÁY, không theo sách):
 *
 *  1. **`noImplicitReturns` và mã lỗi TS7030 (bài 9.3).** Giáo trình đưa ví dụ
 *
 *         function classify(x: number): string {
 *           if (x > 0) return 'positive';
 *         }
 *
 *     và bảo nó ra `TS7030: Not all code paths return a value.` Đo thật:
 *     đoạn ĐÓ ra **`TS2366: Function lacks ending return statement and return
 *     type does not include 'undefined'.`** và nó nổ **dưới `--strict` không
 *     thôi**, chẳng cần `noImplicitReturns`. Muốn thấy đúng `TS7030` thì phải
 *     **BỎ chú thích kiểu trả về** (`function classify(x: number) {…}`) và
 *     **bật `--noImplicitReturns`** — lúc đó `--strict` trơn im lặng (mã thoát
 *     0). Câu 17 ra đúng phép đo này.
 *
 *  2. **Quy ước gạch dưới của `noUnusedLocals` (bài 9.3, ngược hẳn).** Giáo
 *     trình viết: "một biến cục bộ không dùng tên `_x` cũng được miễn dưới
 *     `noUnusedLocals`, còn một import không dùng tên `_foo` thì KHÔNG và vẫn
 *     báo lỗi". Đo thật trên 5.9.3 thì **ngược cả hai vế**:
 *         const _ignored = 7;                 → TS6133 (KHÔNG được miễn)
 *         import { other as _other } from …   → im lặng (ĐƯỢC miễn)
 *         function h(_req: string, …)         → im lặng (được miễn, đúng sách)
 *     Gạch dưới miễn cho **tham số và tên bind của import**, không miễn cho
 *     **biến cục bộ**. Câu 18 ra theo bản máy.
 *
 *  3. **Phiên bản trình biên dịch.** Bài 0.3 in `Version 7.0.2`; repo ghim
 *     `typescript@^5.6.3` và bản cài thật là **5.9.3**. Mọi con số ở đây là
 *     của 5.9.3.
 *
 * ℹ️ Ghi chú kỹ thuật cho người soạn đề sau: hai câu lập trình cố ý KHÔNG dùng
 *    `enum` và KHÔNG dùng parameter property (`constructor(public x: number)`).
 *    Đó là cú pháp **không xoá được**, nên `node answer.ts` — thứ
 *    `scripts/exam-check.mjs` dùng để chạy đáp án mẫu — từ chối thẳng. (Câu 27
 *    vẫn HỎI về parameter property, vì câu đó do `tsc` chấm chứ không phải chạy.)
 *
 * 📊 Phân bố vị trí đáp án (chỉ tính 30 câu trắc nghiệm):
 *        { '0': 8, '1': 7, '2': 8, '3': 8 }   ← 31 vì câu 20 chọn HAI đáp án
 *   node -e "import('./content/exams/TYPESCRIPT-PT2.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Kiểm: node scripts/exam-check.mjs content/exams/TYPESCRIPT-PT2.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/TYPESCRIPT-PT2.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/typescript-exam-kit.mjs';

export default {
  course: { slug: 'typescript' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 6–11 (generics, advanced & utility types, tsconfig, modules, a typed backend)',
        'Kiểm tra tiến độ 2 — Chương 6–11 (generic, kiểu nâng cao & utility, tsconfig, module, backend có kiểu)',
      ),
      description: B(
        'The middle third of the TypeScript course: type parameters and constraints, mapped and conditional types, the standard utility types, what tsconfig actually controls, declaration files and augmentation, and typing a real Express backend. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba giữa của khoá TypeScript: tham số kiểu và ràng buộc, mapped type và conditional type, bộ utility type chuẩn, tsconfig thật sự điều khiển những gì, file khai báo và augmentation, và gõ kiểu cho một backend Express thật. 30 câu trắc nghiệm cùng 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '6–11'),
      questions: [
        // ── Chương 6 — Generics ─────────────────────────────────────────
        mcq({
          prompt: B(
            'The type argument is written by hand here. What does the compiler say?' + code(
              'function identity<T>(x: T): T { return x; }\n' +
              'const a = identity<string>(42);',
            ),
            'Ở đây tham số kiểu được viết tay. Trình biên dịch nói gì?' + code(
              'function identity<T>(x: T): T { return x; }\n' +
              'const a = identity<string>(42);',
            ),
          ),
          options: [
            B(
              'TS2345 "Argument of type &#39;number&#39; is not assignable to parameter of type &#39;string&#39;" — you pinned <code>T</code> and then contradicted it',
              'TS2345 "Argument of type &#39;number&#39; is not assignable to parameter of type &#39;string&#39;" — bạn ghim <code>T</code> rồi tự mâu thuẫn với nó',
            ),
            B(
              'Nothing — an explicit type argument is only a hint, and inference from the value <code>42</code> wins',
              'Không lỗi — tham số kiểu tường minh chỉ là gợi ý, suy luận từ giá trị <code>42</code> thắng',
            ),
            B(
              'TS2558 "Expected 0 type arguments, but got 1", because <code>T</code> was already solved by inference',
              'TS2558 "Expected 0 type arguments, but got 1", vì <code>T</code> đã được suy luận giải xong',
            ),
            B(
              'Nothing at compile time, but <code>a</code> is typed <code>string</code> while holding the number 42 at runtime',
              'Không lỗi lúc biên dịch, nhưng <code>a</code> mang kiểu <code>string</code> trong khi lúc chạy giữ số 42',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: <code>error TS2345: Argument of type &#39;number&#39; is not assignable to parameter of type &#39;string&#39;.</code> Writing <code>&lt;string&gt;</code> at the call site does not suggest a type — it fixes it, and the argument is then checked against it like any ordinary parameter. Inference is the normal path (you almost never write the angle brackets); reach for an explicit argument only when there is nothing to infer from, such as an empty array or a bare <code>Promise</code>. Note the contrast with the last option, which describes what <code>any</code> would do — a generic never lies about the value like that.',
            'Đo được: <code>error TS2345: Argument of type &#39;number&#39; is not assignable to parameter of type &#39;string&#39;.</code> Viết <code>&lt;string&gt;</code> ở chỗ gọi không phải là gợi ý — nó GHIM kiểu, và tham số truyền vào bị kiểm với kiểu ấy y như một tham số thường. Suy luận mới là đường đi bình thường (gần như không bao giờ bạn phải gõ cặp ngoặc nhọn); chỉ dùng tham số kiểu tường minh khi không có gì để suy ra, ví dụ một mảng rỗng hay một <code>Promise</code> trơ. Chú ý lựa chọn cuối: nó mô tả đúng thứ <code>any</code> sẽ làm — generic không bao giờ nói dối về giá trị kiểu đó.',
          ),
        }),

        mcq({
          prompt: B(
            'How many errors does this produce, and what is the reason?' + code(
              'function longest<T>(a: T, b: T) {\n' +
              '  return a.length > b.length ? a : b;\n' +
              '}',
            ),
            'Đoạn này sinh ra mấy lỗi, và vì lý do gì?' + code(
              'function longest<T>(a: T, b: T) {\n' +
              '  return a.length > b.length ? a : b;\n' +
              '}',
            ),
          ),
          options: [
            B(
              'One error on the whole line, TS2571, because a bare <code>T</code> behaves exactly like <code>unknown</code> inside the body',
              'Một lỗi cho cả dòng, TS2571, vì <code>T</code> trơ hành xử y hệt <code>unknown</code> bên trong thân hàm',
            ),
            B(
              'Two errors, one per <code>.length</code>: TS2339 "Property &#39;length&#39; does not exist on type &#39;T&#39;" — nothing has promised that <code>T</code> has a length',
              'Hai lỗi, mỗi <code>.length</code> một lỗi: TS2339 "Property &#39;length&#39; does not exist on type &#39;T&#39;" — chưa có gì hứa rằng <code>T</code> có length',
            ),
            B(
              'None — the body is only checked once <code>T</code> is known, that is, at each call site',
              'Không lỗi — thân hàm chỉ được kiểm khi đã biết <code>T</code>, tức là tại từng chỗ gọi',
            ),
            B(
              'One error, on the return statement, because the two branches of the ternary have different types',
              'Một lỗi, ở câu lệnh return, vì hai nhánh của toán tử ba ngôi mang kiểu khác nhau',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: two errors, at columns 12 and 23 of line 2, both <code>TS2339: Property &#39;length&#39; does not exist on type &#39;T&#39;.</code>. This is the point of a constraint. The body of a generic function is checked ONCE, against what the signature guarantees — not re-checked per call site — so an unconstrained <code>T</code> is untouchable: it could be a number, and numbers have no length. Add <code>T extends { length: number }</code> and the body is allowed to read it, while <code>longest(10, 20)</code> becomes the error instead. Notice what the constraint does NOT do: <code>longest([1,2], [1,2,3])</code> still returns <code>number[]</code>, not the constraint type — <code>T</code> stays the caller\'s real type, and the constraint only sets a floor.',
            'Đo được: hai lỗi, ở cột 12 và cột 23 của dòng 2, đều là <code>TS2339: Property &#39;length&#39; does not exist on type &#39;T&#39;.</code>. Đây chính là lý do ràng buộc tồn tại. Thân một hàm generic được kiểm MỘT LẦN, dựa trên những gì chữ ký bảo đảm — chứ không kiểm lại ở từng chỗ gọi — nên một <code>T</code> không ràng buộc là thứ không đụng vào được: nó có thể là số, mà số thì không có length. Thêm <code>T extends { length: number }</code> là thân hàm được phép đọc, còn <code>longest(10, 20)</code> trở thành lỗi thay thế. Để ý điều ràng buộc KHÔNG làm: <code>longest([1,2], [1,2,3])</code> vẫn trả về <code>number[]</code> chứ không phải kiểu ràng buộc — <code>T</code> vẫn là kiểu thật của người gọi, ràng buộc chỉ đặt một sàn.',
          ),
        }),

        mcq({
          prompt: B(
            'Line A is an error. What is the type of <code>T</code> on line B, where no type argument is given?' + code(
              'class Stack<T> {\n' +
              '  private items: T[] = [];\n' +
              '  push(item: T): void { this.items.push(item); }\n' +
              '  pop(): T | undefined { return this.items.pop(); }\n' +
              '}\n' +
              'const s = new Stack<number>();\n' +
              "s.push('x');                     // A\n" +
              '\n' +
              'const loose = new Stack();       // B\n' +
              'loose.push(1);\n' +
              'const n: number = loose.pop();',
            ),
            'Dòng A là lỗi. Kiểu của <code>T</code> ở dòng B — nơi không truyền tham số kiểu nào — là gì?' + code(
              'class Stack<T> {\n' +
              '  private items: T[] = [];\n' +
              '  push(item: T): void { this.items.push(item); }\n' +
              '  pop(): T | undefined { return this.items.pop(); }\n' +
              '}\n' +
              'const s = new Stack<number>();\n' +
              "s.push('x');                     // A\n" +
              '\n' +
              'const loose = new Stack();       // B\n' +
              'loose.push(1);\n' +
              'const n: number = loose.pop();',
            ),
          ),
          options: [
            B(
              '<code>number</code>, inferred from the <code>loose.push(1)</code> on the next line, so the last line compiles',
              '<code>number</code>, suy ra từ <code>loose.push(1)</code> ở dòng kế tiếp, nên dòng cuối biên dịch được',
            ),
            B(
              '<code>never</code>, so <code>loose.push(1)</code> is itself an error and the last line never gets checked',
              '<code>never</code>, nên chính <code>loose.push(1)</code> đã là lỗi và dòng cuối không được kiểm tới',
            ),
            B(
              '<code>unknown</code> — <code>loose.push(1)</code> is accepted (everything is assignable to unknown) and the error surfaces later, on the last line',
              '<code>unknown</code> — <code>loose.push(1)</code> được chấp nhận (mọi thứ đều gán được vào unknown) và lỗi chỉ lộ ra sau, ở dòng cuối',
            ),
            B(
              '<code>any</code>, because a class type parameter with no argument falls back to the implicit-any rule',
              '<code>any</code>, vì tham số kiểu của class không có đối số thì rơi về quy tắc implicit any',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured. Line A gives <code>TS2345: Argument of type &#39;string&#39; is not assignable to parameter of type &#39;number&#39;.</code> — you chose <code>Stack&lt;number&gt;</code> at construction and every method shares that <code>T</code> for the object\'s whole lifetime. On line B there is nothing to infer from: no type argument, and no constructor parameter mentioning <code>T</code>. So <code>T</code> becomes <code>unknown</code>, <code>push(1)</code> is happily accepted, and the complaint arrives at the consumer with <code>Type &#39;unknown&#39; is not assignable to type &#39;number&#39;</code> — far from the <code>new</code> that caused it. Write <code>new Stack&lt;number&gt;()</code>, annotate the variable, or give the class a default type parameter.',
            'Đo được. Dòng A ra <code>TS2345: Argument of type &#39;string&#39; is not assignable to parameter of type &#39;number&#39;.</code> — bạn chọn <code>Stack&lt;number&gt;</code> lúc khởi tạo và mọi phương thức dùng chung <code>T</code> đó suốt vòng đời đối tượng. Ở dòng B thì không có gì để suy ra: không tham số kiểu, cũng không tham số hàm khởi tạo nào nhắc tới <code>T</code>. Thế là <code>T</code> thành <code>unknown</code>, <code>push(1)</code> được nhận vui vẻ, và lời phàn nàn nổ ra ở chỗ TIÊU THỤ với <code>Type &#39;unknown&#39; is not assignable to type &#39;number&#39;</code> — cách xa cái <code>new</code> đã gây ra nó. Hãy viết <code>new Stack&lt;number&gt;()</code>, hoặc chú thích kiểu cho biến, hoặc cho class một tham số kiểu mặc định.',
          ),
        }),

        mcq({
          prompt: B(
            'Why is the last line an error, and what makes this default a good choice?' + code(
              'interface ApiResult<T = unknown> { ok: boolean; data: T }\n' +
              '\n' +
              'const a: ApiResult = { ok: true, data: 123 };\n' +
              "const b: ApiResult<string> = { ok: true, data: 'x' };\n" +
              'a.data.toUpperCase();',
            ),
            'Vì sao dòng cuối là lỗi, và điều gì làm giá trị mặc định này là lựa chọn tốt?' + code(
              'interface ApiResult<T = unknown> { ok: boolean; data: T }\n' +
              '\n' +
              'const a: ApiResult = { ok: true, data: 123 };\n' +
              "const b: ApiResult<string> = { ok: true, data: 'x' };\n" +
              'a.data.toUpperCase();',
            ),
          ),
          options: [
            B(
              'TS2322 — <code>data: 123</code> on line 3 is the real error, and the last line only reports the fallout',
              'TS2322 — <code>data: 123</code> ở dòng 3 mới là lỗi thật, dòng cuối chỉ là hệ quả',
            ),
            B(
              'TS2314 "Generic type &#39;ApiResult&#39; requires 1 type argument" — a default cannot be used at an annotation site',
              'TS2314 "Generic type &#39;ApiResult&#39; requires 1 type argument" — giá trị mặc định không dùng được ở chỗ chú thích kiểu',
            ),
            B(
              'TS2339 — writing <code>ApiResult</code> bare makes <code>data</code> an empty object type with no members at all',
              'TS2339 — viết <code>ApiResult</code> trơ khiến <code>data</code> thành kiểu object rỗng, không có thành viên nào',
            ),
            B(
              'TS18046 "&#39;a.data&#39; is of type &#39;unknown&#39;" — the bare <code>ApiResult</code> used the default, and <code>unknown</code> forces a narrowing check before any use',
              'TS18046 "&#39;a.data&#39; is of type &#39;unknown&#39;" — <code>ApiResult</code> trơ đã dùng giá trị mặc định, và <code>unknown</code> bắt phải thu hẹp kiểu trước khi dùng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured: one error, <code>TS18046: &#39;a.data&#39; is of type &#39;unknown&#39;.</code> — lines 3 and 4 are both fine. A default type parameter works exactly like a default value parameter: it fills in when nothing else decides, and it never overrides inference or an explicit argument. Choosing <code>unknown</code> rather than <code>any</code> as that default is the whole point — an un-annotated route keeps the "you must check me before you use me" contract instead of silently becoming an unchecked hole. This is why the course\'s API layer is declared <code>ApiResponse&lt;T = unknown&gt;</code>.',
            'Đo được: đúng một lỗi, <code>TS18046: &#39;a.data&#39; is of type &#39;unknown&#39;.</code> — dòng 3 và 4 đều không sao. Tham số kiểu mặc định hoạt động y hệt tham số hàm có giá trị mặc định: nó chỉ điền vào khi không còn gì khác quyết định, và nó không bao giờ đè lên suy luận hay lên một đối số tường minh. Chọn <code>unknown</code> thay vì <code>any</code> làm giá trị mặc định chính là toàn bộ ý nghĩa — một route chưa được chú thích vẫn giữ hợp đồng "phải kiểm tôi trước khi dùng" thay vì âm thầm thành một lỗ hổng không ai kiểm. Vì thế lớp API của khoá học được khai là <code>ApiResponse&lt;T = unknown&gt;</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'One of these two calls is an error and the other is not. Which, and why?' + code(
              'function get<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }\n' +
              '\n' +
              "const user = { id: 1, name: 'Ada' };\n" +
              "get(user, 'email');              // A\n" +
              '\n' +
              'type Bag = Record&lt;string, number&gt;;\n' +
              'declare const bag: Bag;\n' +
              "const v = get(bag, 'typoed');    // B",
            ),
            'Một trong hai lời gọi là lỗi, cái kia thì không. Cái nào, và vì sao?' + code(
              'function get<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }\n' +
              '\n' +
              "const user = { id: 1, name: 'Ada' };\n" +
              "get(user, 'email');              // A\n" +
              '\n' +
              'type Bag = Record&lt;string, number&gt;;\n' +
              'declare const bag: Bag;\n' +
              "const v = get(bag, 'typoed');    // B",
            ),
          ),
          options: [
            B(
              'A fails with TS2345 (&#39;email&#39; is not assignable to &#39;name&#39; | &#39;id&#39;). B compiles, and <code>v</code> is <code>number</code> — because an index signature makes <code>keyof Bag</code> be <code>string | number</code>',
              'A hỏng với TS2345 (&#39;email&#39; không gán được cho &#39;name&#39; | &#39;id&#39;). B biên dịch được, và <code>v</code> là <code>number</code> — vì index signature làm <code>keyof Bag</code> thành <code>string | number</code>',
            ),
            B(
              'B fails, because <code>Record</code> has no keys at all until something is written into it at runtime',
              'B hỏng, vì <code>Record</code> chưa có khoá nào cho tới khi có gì đó được ghi vào lúc chạy',
            ),
            B(
              'A fails with TS2536 (&#39;email&#39; cannot be used to index the type), and B fails with the same code',
              'A hỏng với TS2536 (&#39;email&#39; không dùng để lập chỉ mục kiểu được), và B hỏng với đúng mã đó',
            ),
            B(
              'Neither fails: the constraint <code>K extends keyof T</code> is only checked when the return value is actually used',
              'Không cái nào hỏng: ràng buộc <code>K extends keyof T</code> chỉ được kiểm khi giá trị trả về thật sự được dùng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: exactly one error, <code>TS2345: Argument of type &#39;&quot;email&quot;&#39; is not assignable to parameter of type &#39;&quot;name&quot; | &quot;id&quot;&#39;.</code> on line A. B is the trap. For <code>Record&lt;string, number&gt;</code> the key set is not a list of names — an index signature says "any key at all", so <code>keyof Bag</code> is <code>string | number</code> and <code>&#39;typoed&#39;</code> satisfies the constraint. <code>v</code> comes back typed <code>number</code> at a key that does not exist, and the <code>NaN</code> arrives later. The type never lied; the index signature genuinely promises every key. If you need the key checked, close the set (<code>Record&lt;&#39;a&#39; | &#39;b&#39;, number&gt;</code>) or declare the properties instead.',
            'Đo được: đúng một lỗi, <code>TS2345: Argument of type &#39;&quot;email&quot;&#39; is not assignable to parameter of type &#39;&quot;name&quot; | &quot;id&quot;&#39;.</code> ở dòng A. B mới là cái bẫy. Với <code>Record&lt;string, number&gt;</code> thì tập khoá không phải một danh sách tên — index signature nói "khoá nào cũng được", nên <code>keyof Bag</code> là <code>string | number</code> và <code>&#39;typoed&#39;</code> thoả ràng buộc. <code>v</code> trở về mang kiểu <code>number</code> ở một khoá không tồn tại, còn <code>NaN</code> thì đến sau. Kiểu không hề nói dối; chính index signature đã hứa là có mọi khoá. Cần kiểm khoá thì hãy đóng tập khoá lại (<code>Record&lt;&#39;a&#39; | &#39;b&#39;, number&gt;</code>) hoặc khai báo thẳng các thuộc tính.',
          ),
        }),

        // ── Chương 7 — Kiểu nâng cao ────────────────────────────────────
        mcq({
          prompt: B(
            'Two assignments, one mapped type. Which line errors?' + code(
              'type Frozen<T> = { readonly [K in keyof T]: T[K] };\n' +
              "type Shape = { id: string; meta: { tag: string } };\n" +
              'declare const f: Frozen<Shape>;\n' +
              '\n' +
              "f.meta = { tag: 'y' };     // A\n" +
              "f.meta.tag = 'x';          // B",
            ),
            'Hai phép gán, một mapped type. Dòng nào lỗi?' + code(
              'type Frozen<T> = { readonly [K in keyof T]: T[K] };\n' +
              "type Shape = { id: string; meta: { tag: string } };\n" +
              'declare const f: Frozen<Shape>;\n' +
              '\n' +
              "f.meta = { tag: 'y' };     // A\n" +
              "f.meta.tag = 'x';          // B",
            ),
          ),
          options: [
            B('Both — the mapped type walks the whole object tree and freezes every level', 'Cả hai — mapped type đi khắp cây object và đóng băng mọi tầng'),
            B('Only A, with TS2540 — the mapping rewrote the top-level members only, so <code>meta</code>\'s own type was copied through untouched', 'Chỉ A, với TS2540 — phép ánh xạ chỉ viết lại các thành viên tầng ngoài cùng, nên kiểu riêng của <code>meta</code> được chép qua nguyên vẹn'),
            B('Only B — a nested property is the deeper claim, so that is the one <code>readonly</code> guards', 'Chỉ B — thuộc tính lồng bên trong là điều khẳng định sâu hơn nên đó mới là chỗ <code>readonly</code> canh giữ'),
            B('Neither — <code>readonly</code> is erased at compile time, so no assignment is ever blocked', 'Không dòng nào — <code>readonly</code> bị xoá lúc biên dịch nên không phép gán nào bị chặn'),
          ],
          correct: 1,
          explanation: EX(
            'Measured: one error, <code>TS2540: Cannot assign to &#39;meta&#39; because it is a read-only property.</code> on line A. A mapped type is a loop over the keys of <code>T</code>: it produces one member per key, applies the modifier to that member, and copies whatever <code>T[K]</code> evaluates to on the right-hand side — untouched. So the mapping is exactly one level deep, and that is equally true of the built-in <code>Readonly</code>, <code>Partial</code> and <code>Required</code>. If you need it deep, write the recursive version (<code>T[K] extends object ? DeepReadonly&lt;T[K]&gt; : T[K]</code>) and know the price: recursion over large types is one of the real causes of slow <code>tsc</code> runs.',
            'Đo được: một lỗi, <code>TS2540: Cannot assign to &#39;meta&#39; because it is a read-only property.</code> ở dòng A. Một mapped type là vòng lặp trên các khoá của <code>T</code>: nó sinh mỗi khoá một thành viên, áp bổ ngữ lên thành viên ấy, và chép nguyên xi thứ mà <code>T[K]</code> cho ra ở vế phải — không đụng vào. Thế nên phép ánh xạ sâu đúng MỘT tầng, và điều đó đúng y như vậy với <code>Readonly</code>, <code>Partial</code> và <code>Required</code> có sẵn. Cần sâu thì viết bản đệ quy (<code>T[K] extends object ? DeepReadonly&lt;T[K]&gt; : T[K]</code>) và biết cái giá phải trả: đệ quy trên kiểu lớn là một trong những nguyên nhân thật khiến <code>tsc</code> chạy chậm.',
          ),
        }),

        mcq({
          prompt: B(
            'This is <code>Partial</code> rebuilt by hand. Which of the two declarations fails?' + code(
              'type MyPartial<T> = { [K in keyof T]?: T[K] };\n' +
              'interface User { id: number; name: string }\n' +
              '\n' +
              "const patch: MyPartial<User> = { name: 'Ada' };   // A\n" +
              'const bad:   MyPartial<User> = { name: 123 };     // B',
            ),
            'Đây là <code>Partial</code> dựng lại bằng tay. Khai báo nào hỏng?' + code(
              'type MyPartial<T> = { [K in keyof T]?: T[K] };\n' +
              'interface User { id: number; name: string }\n' +
              '\n' +
              "const patch: MyPartial<User> = { name: 'Ada' };   // A\n" +
              'const bad:   MyPartial<User> = { name: 123 };     // B',
            ),
          ),
          options: [
            B('A — omitting <code>id</code> is still a missing required property, because <code>?</code> only affects reads', 'A — bỏ <code>id</code> vẫn là thiếu thuộc tính bắt buộc, vì <code>?</code> chỉ ảnh hưởng tới việc ĐỌC'),
            B('Both — once every key is optional the object type accepts nothing but an empty literal', 'Cả hai — hễ mọi khoá thành tuỳ chọn thì kiểu object chỉ còn nhận đúng một literal rỗng'),
            B('B, with TS2322 "Type &#39;number&#39; is not assignable to type &#39;string&#39;" — optional means "may be absent", never "may be wrong"', 'B, với TS2322 "Type &#39;number&#39; is not assignable to type &#39;string&#39;" — tuỳ chọn nghĩa là "có thể vắng mặt", không bao giờ là "có thể sai"'),
            B('Neither — the <code>?</code> modifier widens each member to <code>T[K] | undefined | unknown</code>, which accepts any value', 'Không cái nào — bổ ngữ <code>?</code> nới mỗi thành viên thành <code>T[K] | undefined | unknown</code>, thứ nhận mọi giá trị'),
          ],
          correct: 2,
          explanation: EX(
            'Measured: one error, <code>TS2322: Type &#39;number&#39; is not assignable to type &#39;string&#39;.</code> at the <code>123</code>. Line A is fine: every field is optional now, so leaving out <code>id</code> is legal. That single line — <code>{ [K in keyof T]?: T[K] }</code> — is the entire definition of the built-in <code>Partial&lt;T&gt;</code>, and the second half of the lesson is what it does NOT do: the value type is still <code>T[K]</code>, so <code>name</code> is still <code>string</code>. Optional never means untyped. (It also does not open the object to extra keys — <code>{ role: &#39;admin&#39; }</code> would be TS2353.)',
            'Đo được: một lỗi, <code>TS2322: Type &#39;number&#39; is not assignable to type &#39;string&#39;.</code> ngay tại số <code>123</code>. Dòng A không sao: giờ mọi trường đều tuỳ chọn nên bỏ <code>id</code> là hợp lệ. Đúng một dòng ấy — <code>{ [K in keyof T]?: T[K] }</code> — là toàn bộ định nghĩa của <code>Partial&lt;T&gt;</code> có sẵn, và nửa sau của bài học là những gì nó KHÔNG làm: kiểu giá trị vẫn là <code>T[K]</code>, nên <code>name</code> vẫn là <code>string</code>. Tuỳ chọn không bao giờ có nghĩa là hết kiểu. (Nó cũng không mở object ra cho khoá lạ — <code>{ role: &#39;admin&#39; }</code> sẽ là TS2353.)',
          ),
        }),

        mcq({
          prompt: B(
            'What does the minus sign do here, and what is the resulting error?' + code(
              'interface Draft { title?: string; body?: string }\n' +
              'type Complete<T> = { [K in keyof T]-?: T[K] };\n' +
              "const d: Complete<Draft> = { title: 'Hi' };",
            ),
            'Dấu trừ ở đây làm gì, và lỗi sinh ra là gì?' + code(
              'interface Draft { title?: string; body?: string }\n' +
              'type Complete<T> = { [K in keyof T]-?: T[K] };\n' +
              "const d: Complete<Draft> = { title: 'Hi' };",
            ),
          ),
          options: [
            B('It removes the key entirely when the value is <code>undefined</code>, so <code>Complete&lt;Draft&gt;</code> ends up with no members and TS2353 fires', 'Nó xoá hẳn khoá khi giá trị là <code>undefined</code>, nên <code>Complete&lt;Draft&gt;</code> không còn thành viên nào và TS2353 nổ'),
            B('It subtracts <code>readonly</code>, not <code>?</code> — so the type is unchanged and the only error is TS2540 on a later assignment', 'Nó trừ đi <code>readonly</code> chứ không phải <code>?</code> — nên kiểu không đổi và lỗi duy nhất là TS2540 ở một phép gán sau đó'),
            B('Nothing at all: <code>-?</code> is a no-op that TypeScript accepts for symmetry with <code>-readonly</code>', 'Chẳng làm gì cả: <code>-?</code> là lệnh rỗng mà TypeScript chấp nhận cho đối xứng với <code>-readonly</code>'),
            B('It strips the optionality, making every member required — so TS2741 "Property &#39;body&#39; is missing in type &#39;{ title: string; }&#39; but required in type &#39;Complete&lt;Draft&gt;&#39;"', 'Nó gỡ bỏ tính tuỳ chọn, làm mọi thành viên thành bắt buộc — nên ra TS2741 "Property &#39;body&#39; is missing in type &#39;{ title: string; }&#39; but required in type &#39;Complete&lt;Draft&gt;&#39;"'),
          ],
          correct: 3,
          explanation: EX(
            'Measured, verbatim: <code>error TS2741: Property &#39;body&#39; is missing in type &#39;{ title: string; }&#39; but required in type &#39;Complete&lt;Draft&gt;&#39;.</code> The full grammar is four moves: <code>readonly</code> and <code>?</code> ADD a modifier, <code>-readonly</code> and <code>-?</code> REMOVE one. Only the minus subtracts; a plain <code>readonly</code> or <code>?</code> always adds. <code>-?</code> is exactly how the built-in <code>Required&lt;T&gt;</code> is written, and it does one more thing worth knowing: it also removes <code>undefined</code> from the member\'s type, which is what makes it a real guarantee rather than a cosmetic change.',
            'Đo được, nguyên văn: <code>error TS2741: Property &#39;body&#39; is missing in type &#39;{ title: string; }&#39; but required in type &#39;Complete&lt;Draft&gt;&#39;.</code> Toàn bộ ngữ pháp gồm bốn nước đi: <code>readonly</code> và <code>?</code> THÊM một bổ ngữ, <code>-readonly</code> và <code>-?</code> GỠ một bổ ngữ. Chỉ dấu trừ mới trừ; <code>readonly</code> hay <code>?</code> trơ thì luôn thêm. <code>-?</code> chính là cách <code>Required&lt;T&gt;</code> có sẵn được viết, và nó còn làm thêm một việc đáng nhớ: nó cũng gỡ <code>undefined</code> khỏi kiểu của thành viên, và đó là thứ biến nó thành một bảo đảm thật chứ không phải một thay đổi trang trí.',
          ),
        }),

        mcq({
          prompt: B(
            'Two errors come out of this file. What do they tell you <code>a</code> and <code>b</code> are?' + code(
              'type ElementType<T> = T extends (infer U)[] ? U : T;\n' +
              '\n' +
              'declare const a: ElementType<string[]>;\n' +
              'declare const b: ElementType<number>;\n' +
              '\n' +
              'const x: number = a;\n' +
              'const y: string = b;',
            ),
            'File này ra hai lỗi. Chúng cho biết <code>a</code> và <code>b</code> là gì?' + code(
              'type ElementType<T> = T extends (infer U)[] ? U : T;\n' +
              '\n' +
              'declare const a: ElementType<string[]>;\n' +
              'declare const b: ElementType<number>;\n' +
              '\n' +
              'const x: number = a;\n' +
              'const y: string = b;',
            ),
          ),
          options: [
            B(
              '<code>a</code> is <code>string</code> (the array pattern matched, so <code>U</code> bound to the element type) and <code>b</code> is <code>number</code> (not an array, so it falls through unchanged)',
              '<code>a</code> là <code>string</code> (khuôn mảng khớp nên <code>U</code> bám vào kiểu phần tử) còn <code>b</code> là <code>number</code> (không phải mảng nên rơi xuống nhánh else, giữ nguyên)',
            ),
            B(
              '<code>a</code> is <code>string[]</code> and <code>b</code> is <code>never</code> — <code>infer</code> keeps the matched type whole and the else branch collapses',
              '<code>a</code> là <code>string[]</code> còn <code>b</code> là <code>never</code> — <code>infer</code> giữ nguyên cả kiểu đã khớp và nhánh else sập về rỗng',
            ),
            B(
              '<code>a</code> is <code>unknown</code> and <code>b</code> is <code>unknown</code>, because <code>infer</code> only works inside a function signature pattern',
              '<code>a</code> là <code>unknown</code> và <code>b</code> cũng <code>unknown</code>, vì <code>infer</code> chỉ chạy được bên trong khuôn chữ ký hàm',
            ),
            B(
              'Both are <code>string | number</code>: a conditional type distributes and then unions the two branches back together',
              'Cả hai đều là <code>string | number</code>: conditional type phân phối rồi hợp hai nhánh lại với nhau',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured, both lines: <code>TS2322: Type &#39;string&#39; is not assignable to type &#39;number&#39;.</code> and <code>TS2322: Type &#39;number&#39; is not assignable to type &#39;string&#39;.</code> — which pins <code>a</code> to <code>string</code> and <code>b</code> to <code>number</code>. Read <code>T extends U ? X : Y</code> as "is <code>T</code> assignable to <code>U</code>?" (assignability, not inheritance — <code>&#39;a&#39; extends string</code> is true, <code>string extends &#39;a&#39;</code> is false). <code>infer U</code> is a hole the compiler fills from the match, and it is legal only inside the <code>extends</code> clause. The same two tools, aimed at a function signature instead of an array, are the whole definition of the built-in <code>ReturnType</code>.',
            'Đo được, cả hai dòng: <code>TS2322: Type &#39;string&#39; is not assignable to type &#39;number&#39;.</code> và <code>TS2322: Type &#39;number&#39; is not assignable to type &#39;string&#39;.</code> — tức <code>a</code> là <code>string</code> và <code>b</code> là <code>number</code>. Đọc <code>T extends U ? X : Y</code> là "<code>T</code> có gán được cho <code>U</code> không?" (khả năng gán, không phải kế thừa — <code>&#39;a&#39; extends string</code> đúng, còn <code>string extends &#39;a&#39;</code> sai). <code>infer U</code> là một cái lỗ để trình biên dịch điền vào từ phép khớp, và nó chỉ hợp lệ bên trong mệnh đề <code>extends</code>. Đúng hai công cụ ấy, nhắm vào một chữ ký hàm thay vì một mảng, chính là toàn bộ định nghĩa của <code>ReturnType</code> có sẵn.',
          ),
        }),

        mcq({
          prompt: B(
            'This key-remapping type does not compile. What is the error, and what is the standard fix?' + code(
              'type Getters<T> = { [K in keyof T as `get${Capitalize<K>}`]: () => T[K] };',
            ),
            'Kiểu đổi tên khoá này không biên dịch được. Lỗi là gì, và cách sửa chuẩn là gì?' + code(
              'type Getters<T> = { [K in keyof T as `get${Capitalize<K>}`]: () => T[K] };',
            ),
          ),
          options: [
            B(
              'TS2589 "Type instantiation is excessively deep" — a template literal over an unbounded <code>T</code> recurses forever; the fix is a depth limit',
              'TS2589 "Type instantiation is excessively deep" — template literal trên một <code>T</code> không chặn sẽ đệ quy vô hạn; cách sửa là đặt giới hạn độ sâu',
            ),
            B(
              'TS2344 "Type &#39;K&#39; does not satisfy the constraint &#39;string&#39;" — <code>keyof T</code> is <code>string | number | symbol</code>, so you write <code>Capitalize&lt;K &amp; string&gt;</code>',
              'TS2344 "Type &#39;K&#39; does not satisfy the constraint &#39;string&#39;" — <code>keyof T</code> là <code>string | number | symbol</code>, nên phải viết <code>Capitalize&lt;K &amp; string&gt;</code>',
            ),
            B(
              'TS1005 — the <code>as</code> clause is not valid syntax in a mapped type; renaming keys needs a conditional type instead',
              'TS1005 — mệnh đề <code>as</code> không phải cú pháp hợp lệ trong mapped type; muốn đổi tên khoá thì phải dùng conditional type',
            ),
            B(
              'TS2322 — <code>Capitalize</code> returns a value, not a type, so it may not appear inside a template literal type',
              'TS2322 — <code>Capitalize</code> trả về một giá trị chứ không phải một kiểu, nên không được xuất hiện trong template literal type',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured, all four lines: <code>TS2344: Type &#39;K&#39; does not satisfy the constraint &#39;string&#39;. / Type &#39;keyof T&#39; is not assignable to type &#39;string&#39;. / Type &#39;string | number | symbol&#39; is not assignable to type &#39;string&#39;. / Type &#39;number&#39; is not assignable to type &#39;string&#39;.</code> — the error walks you all the way down to the culprit. An object key may legally be a number or a symbol, and <code>Capitalize</code> demands a string. The intersection <code>K &amp; string</code> keeps only the string keys, and quietly drops the rest: a type with a symbol key simply gets no generated getter, with no error to tell you. If losing those keys would be a bug, constrain the input instead (<code>T extends Record&lt;string, unknown&gt;</code>) so the omission cannot happen unnoticed.',
            'Đo được, đủ bốn dòng: <code>TS2344: Type &#39;K&#39; does not satisfy the constraint &#39;string&#39;. / Type &#39;keyof T&#39; is not assignable to type &#39;string&#39;. / Type &#39;string | number | symbol&#39; is not assignable to type &#39;string&#39;. / Type &#39;number&#39; is not assignable to type &#39;string&#39;.</code> — lỗi dắt bạn đi thẳng xuống tới thủ phạm. Khoá của một object hoàn toàn có thể là số hoặc symbol, còn <code>Capitalize</code> thì đòi chuỗi. Phép giao <code>K &amp; string</code> giữ lại đúng những khoá chuỗi và lặng lẽ vứt phần còn lại: một kiểu có khoá symbol sẽ đơn giản là không được sinh getter, mà chẳng lỗi nào báo cho bạn. Nếu mất những khoá đó là một con bug thì hãy ràng buộc đầu vào (<code>T extends Record&lt;string, unknown&gt;</code>) để chuyện bỏ sót không thể xảy ra trong im lặng.',
          ),
        }),

        // ── Chương 8 — Utility types ────────────────────────────────────
        mcq({
          prompt: B(
            'One of the two calls fails. Which, and what does that prove about <code>Partial</code>?' + code(
              'interface User { id: number; name: string; email: string }\n' +
              'function updateUser(id: number, patch: Partial<User>) { /* … */ }\n' +
              '\n' +
              "updateUser(1, { name: 'Ada' });                  // A\n" +
              "updateUser(1, { name: 'Ada', role: 'admin' });   // B",
            ),
            'Một trong hai lời gọi hỏng. Lời gọi nào, và điều đó chứng minh gì về <code>Partial</code>?' + code(
              'interface User { id: number; name: string; email: string }\n' +
              'function updateUser(id: number, patch: Partial<User>) { /* … */ }\n' +
              '\n' +
              "updateUser(1, { name: 'Ada' });                  // A\n" +
              "updateUser(1, { name: 'Ada', role: 'admin' });   // B",
            ),
          ),
          options: [
            B('A — <code>Partial</code> makes fields optional but <code>id</code> and <code>email</code> are still structurally required', 'A — <code>Partial</code> làm các trường thành tuỳ chọn nhưng <code>id</code> và <code>email</code> vẫn bắt buộc về mặt cấu trúc'),
            B('Both, for the same reason: an object literal never satisfies a mapped type without an explicit annotation', 'Cả hai, cùng một lý do: object literal không bao giờ thoả một mapped type nếu không có chú thích kiểu tường minh'),
            B('B, with TS2353 "Object literal may only specify known properties, and &#39;role&#39; does not exist in type &#39;Partial&lt;User&gt;&#39;" — optional keys, but still exactly <code>User</code>\'s keys', 'B, với TS2353 "Object literal may only specify known properties, and &#39;role&#39; does not exist in type &#39;Partial&lt;User&gt;&#39;" — khoá thành tuỳ chọn, nhưng vẫn đúng bộ khoá của <code>User</code>'),
            B('B, but only with TS2345 pointing at the whole argument rather than the offending key', 'B, nhưng chỉ với TS2345 chỉ vào toàn bộ đối số chứ không phải khoá gây lỗi'),
          ],
          correct: 2,
          explanation: EX(
            'Measured: one error, <code>TS2353: Object literal may only specify known properties, and &#39;role&#39; does not exist in type &#39;Partial&lt;User&gt;&#39;.</code>, at the <code>role</code> itself. <code>Partial&lt;User&gt;</code> has exactly <code>User</code>\'s keys, each made optional — "optional" never means "any extra key allowed". That is what makes it the right type for a PATCH body: the caller sends any subset, and a misspelt field name is still a compile error. Its home is inputs; as a RETURN type it pushes the checking onto every consumer forever, which is where <code>cfg.port!</code> gets written and the guarantee dies.',
            'Đo được: một lỗi, <code>TS2353: Object literal may only specify known properties, and &#39;role&#39; does not exist in type &#39;Partial&lt;User&gt;&#39;.</code>, ngay tại chữ <code>role</code>. <code>Partial&lt;User&gt;</code> có đúng bộ khoá của <code>User</code>, mỗi khoá được làm thành tuỳ chọn — "tuỳ chọn" không bao giờ nghĩa là "khoá lạ nào cũng được". Chính điều đó khiến nó là kiểu đúng cho thân một request PATCH: người gọi gửi tập con bất kỳ, mà tên trường gõ sai vẫn là lỗi biên dịch. Chỗ của nó là ĐẦU VÀO; làm kiểu TRẢ VỀ thì nó đẩy việc kiểm sang mọi người tiêu thụ, mãi mãi — và đó là nơi ai đó viết <code>cfg.port!</code> rồi bảo đảm ấy chết.',
          ),
        }),

        mcq({
          prompt: B(
            'What is <code>Active</code>, and what does the compiler say?' + code(
              "type Status = 'draft' | 'published' | 'archived';\n" +
              "type Active = Exclude<Status, 'archived'>;\n" +
              "const s: Active = 'archived';",
            ),
            '<code>Active</code> là gì, và trình biên dịch nói gì?' + code(
              "type Status = 'draft' | 'published' | 'archived';\n" +
              "type Active = Exclude<Status, 'archived'>;\n" +
              "const s: Active = 'archived';",
            ),
          ),
          options: [
            B('<code>Active</code> is <code>&#39;archived&#39;</code> — <code>Exclude</code> KEEPS what matches; its twin <code>Extract</code> is the one that removes', '<code>Active</code> là <code>&#39;archived&#39;</code> — <code>Exclude</code> GIỮ lại thứ khớp; anh em của nó là <code>Extract</code> mới là cái loại bỏ'),
            B('<code>Active</code> is <code>string</code>, because removing a member from a literal union widens the result', '<code>Active</code> là <code>string</code>, vì bỏ một thành viên khỏi union literal thì kết quả bị nới rộng'),
            B('<code>Active</code> is <code>never</code>: <code>Exclude</code> distributes and each member fails the test, so all three drop out', '<code>Active</code> là <code>never</code>: <code>Exclude</code> phân phối và từng thành viên đều trượt phép thử nên cả ba rụng hết'),
            B('<code>Active</code> is <code>&#39;draft&#39; | &#39;published&#39;</code>, and the last line is TS2322 "Type &#39;&quot;archived&quot;&#39; is not assignable to type &#39;Active&#39;"', '<code>Active</code> là <code>&#39;draft&#39; | &#39;published&#39;</code>, và dòng cuối ra TS2322 "Type &#39;&quot;archived&quot;&#39; is not assignable to type &#39;Active&#39;"'),
          ],
          correct: 3,
          explanation: EX(
            'Measured: <code>error TS2322: Type &#39;&quot;archived&quot;&#39; is not assignable to type &#39;Active&#39;.</code>. <code>Exclude&lt;U, M&gt;</code> removes from union <code>U</code> everything assignable to <code>M</code>; <code>Extract&lt;U, M&gt;</code> is the twin that keeps only those. Under the hood it is a distributive conditional type from chapter 7 — the condition runs once per union member and the results union back together, which is precisely what makes it work on unions at all. <code>NonNullable&lt;T&gt;</code> is the same machine with a friendly name: <code>Exclude&lt;T, null | undefined&gt;</code>.',
            'Đo được: <code>error TS2322: Type &#39;&quot;archived&quot;&#39; is not assignable to type &#39;Active&#39;.</code>. <code>Exclude&lt;U, M&gt;</code> gỡ khỏi union <code>U</code> mọi thứ gán được cho <code>M</code>; <code>Extract&lt;U, M&gt;</code> là anh em chỉ GIỮ lại đúng những thứ đó. Bên dưới nó là một conditional type có phân phối của chương 7 — điều kiện chạy một lượt cho mỗi thành viên union rồi các kết quả hợp lại, và chính điều đó khiến nó làm việc được trên union. <code>NonNullable&lt;T&gt;</code> là cùng cỗ máy ấy với một cái tên dễ nghe: <code>Exclude&lt;T, null | undefined&gt;</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'What is <code>Name</code> here, and why does the third line fail?' + code(
              'type MaybeName = string | null | undefined;\n' +
              'type Name = NonNullable<MaybeName>;\n' +
              'const n: Name = null;',
            ),
            '<code>Name</code> ở đây là gì, và vì sao dòng thứ ba hỏng?' + code(
              'type MaybeName = string | null | undefined;\n' +
              'type Name = NonNullable<MaybeName>;\n' +
              'const n: Name = null;',
            ),
          ),
          options: [
            B(
              '<code>Name</code> is <code>string</code> — TS2322 "Type &#39;null&#39; is not assignable to type &#39;string&#39;"; the message quotes <code>string</code>, not <code>Name</code>, because the alias resolved',
              '<code>Name</code> là <code>string</code> — TS2322 "Type &#39;null&#39; is not assignable to type &#39;string&#39;"; thông báo trích <code>string</code> chứ không phải <code>Name</code>, vì alias đã được giải',
            ),
            B(
              '<code>Name</code> is <code>string | undefined</code> — <code>NonNullable</code> only removes <code>null</code>, and the error is TS18048',
              '<code>Name</code> là <code>string | undefined</code> — <code>NonNullable</code> chỉ gỡ <code>null</code>, và lỗi là TS18048',
            ),
            B(
              '<code>Name</code> is <code>NonNullable&lt;MaybeName&gt;</code>, an opaque type; the error is TS2739 about missing members',
              '<code>Name</code> là <code>NonNullable&lt;MaybeName&gt;</code>, một kiểu mờ; lỗi là TS2739 về các thành viên bị thiếu',
            ),
            B(
              '<code>Name</code> is <code>never</code>, because a union that contains <code>null</code> cannot survive the transformation',
              '<code>Name</code> là <code>never</code>, vì một union có chứa <code>null</code> không thể sống sót qua phép biến đổi',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: <code>error TS2322: Type &#39;null&#39; is not assignable to type &#39;string&#39;.</code> — the message quotes the RESOLVED type, which is a small but useful habit to read for: it tells you what the alias actually became. <code>NonNullable&lt;T&gt;</code> removes BOTH <code>null</code> and <code>undefined</code>, so all that is left is <code>string</code>. It is the type-level twin of a guard you already write at runtime, and it pairs with <code>Required</code> for the common case of a field that is both optional and nullable — <code>Required</code> alone strips the <code>?</code> and the implicit <code>undefined</code>, but an explicitly declared <code>| null</code> survives it.',
            'Đo được: <code>error TS2322: Type &#39;null&#39; is not assignable to type &#39;string&#39;.</code> — thông báo trích kiểu ĐÃ GIẢI, và đây là một thói quen đọc nhỏ mà hữu ích: nó cho biết alias thật ra đã thành cái gì. <code>NonNullable&lt;T&gt;</code> gỡ CẢ <code>null</code> lẫn <code>undefined</code>, nên chỉ còn lại <code>string</code>. Nó là bản song sinh ở tầng kiểu của phép kiểm mà bạn vẫn viết lúc chạy, và nó đi cặp với <code>Required</code> cho trường hợp phổ biến một trường vừa tuỳ chọn vừa nullable — riêng <code>Required</code> chỉ gỡ dấu <code>?</code> và cái <code>undefined</code> ngầm, còn một <code>| null</code> khai tường minh thì sống sót.',
          ),
        }),

        mcq({
          prompt: B(
            'Two errors come out of this file. Which pair?' + code(
              "type Status = 'draft' | 'live' | 'archived';\n" +
              '\n' +
              "const strict: Record<Status, string> = { draft: 'Draft', live: 'Live' };            // A\n" +
              "const loose: Partial<Record<Status, string>> = { draft: 'Draft', live: 'Live' };    // B\n" +
              '\n' +
              'declare const s: Status;\n' +
              'const label: string = loose[s];                                                     // C',
            ),
            'File này ra hai lỗi. Cặp nào?' + code(
              "type Status = 'draft' | 'live' | 'archived';\n" +
              '\n' +
              "const strict: Record<Status, string> = { draft: 'Draft', live: 'Live' };            // A\n" +
              "const loose: Partial<Record<Status, string>> = { draft: 'Draft', live: 'Live' };    // B\n" +
              '\n' +
              'declare const s: Status;\n' +
              'const label: string = loose[s];                                                     // C',
            ),
          ),
          options: [
            B('A and B — both objects are missing <code>archived</code>, and <code>Partial</code> does not change that', 'A và B — cả hai object đều thiếu <code>archived</code>, và <code>Partial</code> không thay đổi điều đó'),
            B('A: TS2741 "Property &#39;archived&#39; is missing…" · C: TS2322 "Type &#39;string | undefined&#39; is not assignable to type &#39;string&#39;". B compiles — <code>Partial</code> threw the exhaustiveness away', 'A: TS2741 "Property &#39;archived&#39; is missing…" · C: TS2322 "Type &#39;string | undefined&#39; is not assignable to type &#39;string&#39;". B biên dịch được — <code>Partial</code> đã vứt bỏ tính đầy đủ'),
            B('B and C — the strict <code>Record</code> is fine because a literal union key set is only checked on read', 'B và C — bản <code>Record</code> nghiêm ngặt không sao vì tập khoá union literal chỉ được kiểm lúc ĐỌC'),
            B('A and C, but C is TS7053 about an implicit any index expression rather than a possibly-undefined value', 'A và C, nhưng C là TS7053 về biểu thức chỉ mục any ngầm chứ không phải giá trị có thể undefined'),
          ],
          correct: 1,
          explanation: EX(
            'Measured, exactly two: <code>TS2741: Property &#39;archived&#39; is missing in type &#39;{ draft: string; live: string; }&#39; but required in type &#39;Record&lt;Status, string&gt;&#39;.</code> on A, and <code>TS2322: Type &#39;string | undefined&#39; is not assignable to type &#39;string&#39;.</code> on C. A closed <code>Record</code> keyed by a literal union is chapter 5\'s exhaustiveness applied to an object: add a fourth status and every such table stops compiling until you handle it. Wrapping it in <code>Partial</code> — usually done to silence one inconvenient case — throws that guarantee away completely: every key becomes optional, the new status compiles fine, and the read is now <code>string | undefined</code>, which somebody will paper over with <code>!</code>. If one case genuinely has no label, give it an explicit value rather than making all of them optional.',
            'Đo được, đúng hai lỗi: <code>TS2741: Property &#39;archived&#39; is missing in type &#39;{ draft: string; live: string; }&#39; but required in type &#39;Record&lt;Status, string&gt;&#39;.</code> ở A, và <code>TS2322: Type &#39;string | undefined&#39; is not assignable to type &#39;string&#39;.</code> ở C. Một <code>Record</code> đóng, khoá bằng union literal, chính là tính đầy đủ của chương 5 đem áp lên một object: thêm trạng thái thứ tư là mọi bảng như thế ngừng biên dịch cho tới khi bạn xử lý. Bọc nó trong <code>Partial</code> — thường là để dập một ca bất tiện — thì vứt sạch bảo đảm ấy: mọi khoá thành tuỳ chọn, trạng thái mới biên dịch ngon lành, và phép đọc giờ là <code>string | undefined</code>, thứ mà rồi ai đó sẽ trát <code>!</code> lên. Nếu thật sự có một ca không có nhãn thì hãy cho nó một giá trị tường minh, đừng làm tất cả thành tuỳ chọn.',
          ),
        }),

        mcq({
          prompt: B(
            'What is <code>P</code>, and which of the three declarations fails?' + code(
              'function paginate(page: number, size: string, deep?: boolean) {\n' +
              '  return { page, size, deep };\n' +
              '}\n' +
              'type P = Parameters<typeof paginate>;\n' +
              '\n' +
              "const good:  P = [1, '20', true];   // A\n" +
              'const bad:   P = [1, 20, true];     // B\n' +
              "const short: P = [1, '20'];         // C",
            ),
            '<code>P</code> là gì, và khai báo nào trong ba khai báo hỏng?' + code(
              'function paginate(page: number, size: string, deep?: boolean) {\n' +
              '  return { page, size, deep };\n' +
              '}\n' +
              'type P = Parameters<typeof paginate>;\n' +
              '\n' +
              "const good:  P = [1, '20', true];   // A\n" +
              'const bad:   P = [1, 20, true];     // B\n' +
              "const short: P = [1, '20'];         // C",
            ),
          ),
          options: [
            B('<code>P</code> is an object <code>{ page: number; size: string; deep?: boolean }</code>, so all three array literals fail', '<code>P</code> là một object <code>{ page: number; size: string; deep?: boolean }</code>, nên cả ba literal mảng đều hỏng'),
            B('<code>P</code> is <code>(number | string | boolean)[]</code>, so nothing fails — the element types are unioned', '<code>P</code> là <code>(number | string | boolean)[]</code> nên không cái nào hỏng — kiểu các phần tử được hợp lại'),
            B('<code>P</code> is the tuple <code>[page: number, size: string, deep?: boolean]</code>. Only B fails, with TS2322 at the <code>20</code>; C compiles because the third element is optional', '<code>P</code> là tuple <code>[page: number, size: string, deep?: boolean]</code>. Chỉ B hỏng, với TS2322 ngay tại số <code>20</code>; C biên dịch được vì phần tử thứ ba là tuỳ chọn'),
            B('<code>P</code> is that tuple, and B and C both fail — a tuple always pins its length exactly', '<code>P</code> là tuple đó, và cả B lẫn C đều hỏng — tuple luôn ghim đúng độ dài'),
          ],
          correct: 2,
          explanation: EX(
            'Measured: one error, <code>TS2322: Type &#39;number&#39; is not assignable to type &#39;string&#39;.</code> at the <code>20</code> in B. C is the detail worth remembering: <code>deep?</code> is optional in the signature, so the tuple carries that optionality too and a two-element literal fits. <code>Parameters</code>, like <code>ReturnType</code> and <code>Awaited</code>, is a conditional-plus-<code>infer</code> type that reads a type straight out of an existing declaration — derive rather than re-declare, and the two can never drift apart. The counterweight is worth knowing: deriving a type from an implementation quietly makes that implementation your public API, so keep it for local glue and declare the types that cross a module boundary.',
            'Đo được: một lỗi, <code>TS2322: Type &#39;number&#39; is not assignable to type &#39;string&#39;.</code> tại số <code>20</code> ở B. C mới là chi tiết đáng nhớ: <code>deep?</code> là tuỳ chọn trong chữ ký, nên tuple mang theo luôn tính tuỳ chọn ấy và một literal hai phần tử vẫn vừa. <code>Parameters</code>, giống <code>ReturnType</code> và <code>Awaited</code>, là một conditional type kèm <code>infer</code> đọc kiểu thẳng ra từ một khai báo có sẵn — hãy SUY RA thay vì khai lại, và hai bên không bao giờ lệch nhau. Cái giá đối trọng cũng nên biết: suy kiểu ra từ phần cài đặt tức là âm thầm biến phần cài đặt ấy thành API công khai của bạn, nên hãy giữ cách này cho phần keo dán cục bộ và khai tường minh những kiểu đi qua ranh giới module.',
          ),
        }),

        // ── Chương 9 — tsconfig & trình biên dịch ───────────────────────
        mcq({
          prompt: B(
            'A project has a <code>tsconfig.json</code> with <code>strict: true</code>. A developer runs the two commands below and gets different results from the SAME file. Why?' + code(
              '$ npx tsc --noEmit            # uses the project config\n' +
              '$ npx tsc --noEmit src/x.ts   # names a file explicitly',
            ),
            'Một dự án có <code>tsconfig.json</code> đặt <code>strict: true</code>. Lập trình viên chạy hai lệnh dưới đây và nhận kết quả KHÁC NHAU trên cùng một file. Vì sao?' + code(
              '$ npx tsc --noEmit            # dùng cấu hình của dự án\n' +
              '$ npx tsc --noEmit src/x.ts   # nêu tên file tường minh',
            ),
          ),
          options: [
            B(
              'The second form runs an incremental build and reuses a stale <code>.tsbuildinfo</code>; delete it and the two agree',
              'Dạng thứ hai chạy build tăng dần và tái dùng một <code>.tsbuildinfo</code> cũ; xoá nó đi là hai bên khớp',
            ),
            B(
              'The second form only checks that one file, but with the same options — the difference must come from an <code>// @ts-nocheck</code> comment',
              'Dạng thứ hai chỉ kiểm đúng file đó nhưng vẫn cùng bộ tuỳ chọn — khác biệt hẳn phải đến từ một chú thích <code>// @ts-nocheck</code>',
            ),
            B(
              'The second form runs the compiler twice, once per module system, and reports only the errors common to both',
              'Dạng thứ hai chạy trình biên dịch hai lượt, mỗi lượt một hệ module, rồi chỉ báo những lỗi chung của cả hai',
            ),
            B(
              'Passing a filename makes <code>tsc</code> ignore <code>tsconfig.json</code> entirely and fall back to compiler defaults — so <code>strict</code> is off in the second run',
              'Truyền tên file khiến <code>tsc</code> bỏ qua <code>tsconfig.json</code> hoàn toàn và rơi về giá trị mặc định — nên lượt thứ hai <code>strict</code> đang TẮT',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the classic "it works in the editor, not on the command line" (and its mirror image). Running bare <code>tsc</code> walks up from the current directory looking for <code>tsconfig.json</code> and builds a program from <code>include</code>/<code>exclude</code> plus everything those files import. Passing a filename skips that search completely: no <code>strict</code>, no <code>paths</code>, no <code>lib</code> — just defaults. Two related facts from the same lesson: a file that nothing imports and <code>include</code> does not cover is simply never checked, and <code>tsc</code> writes JavaScript even when the check failed, which is why a pipeline must never swallow its exit code.',
            'Đây chính là chuyện kinh điển "trong editor thì chạy, ngoài dòng lệnh thì không" (và cả chiều ngược lại). Chạy <code>tsc</code> trơ thì nó đi ngược lên từ thư mục hiện tại để tìm <code>tsconfig.json</code> rồi dựng chương trình từ <code>include</code>/<code>exclude</code> cộng với mọi thứ các file ấy import. Truyền tên file là bỏ qua hẳn bước tìm đó: không <code>strict</code>, không <code>paths</code>, không <code>lib</code> — chỉ có mặc định. Hai sự thật liên quan từ cùng bài học: một file không ai import và <code>include</code> không phủ tới thì đơn giản là KHÔNG BAO GIỜ được kiểm, và <code>tsc</code> vẫn ghi ra JavaScript ngay cả khi phép kiểm thất bại — nên một pipeline tuyệt đối không được nuốt mã thoát của nó.',
          ),
        }),

        mcq({
          prompt: B(
            'Two nearly identical functions. Under <code>--strict</code> alone, and then with <code>--noImplicitReturns</code> added, what does tsc 5.9.3 actually report?' + code(
              '// A — return type annotated\n' +
              'function classifyA(x: number): string {\n' +
              "  if (x > 0) return 'positive';\n" +
              '}\n' +
              '\n' +
              '// B — no return annotation\n' +
              'function classifyB(x: number) {\n' +
              "  if (x > 0) return 'positive';\n" +
              '}',
            ),
            'Hai hàm gần như y hệt nhau. Dưới <code>--strict</code> không thôi, rồi thêm <code>--noImplicitReturns</code>, tsc 5.9.3 thật sự báo gì?' + code(
              '// A — có chú thích kiểu trả về\n' +
              'function classifyA(x: number): string {\n' +
              "  if (x > 0) return 'positive';\n" +
              '}\n' +
              '\n' +
              '// B — không chú thích kiểu trả về\n' +
              'function classifyB(x: number) {\n' +
              "  if (x > 0) return 'positive';\n" +
              '}',
            ),
          ),
          options: [
            B(
              'A is TS2366 under <code>--strict</code> ALONE ("Function lacks ending return statement…"); B is silent under strict and becomes TS7030 "Not all code paths return a value" only once <code>--noImplicitReturns</code> is on',
              'A ra TS2366 dưới <code>--strict</code> KHÔNG THÔI ("Function lacks ending return statement…"); B im lặng dưới strict và chỉ thành TS7030 "Not all code paths return a value" khi bật <code>--noImplicitReturns</code>',
            ),
            B(
              'Both are TS7030, and both need <code>--noImplicitReturns</code> — the annotation makes no difference',
              'Cả hai đều là TS7030, và cả hai đều cần <code>--noImplicitReturns</code> — chú thích kiểu trả về không tạo khác biệt nào',
            ),
            B(
              'A is TS7030 and B is silent in both runs, because a function with no annotation infers <code>string | undefined</code> and is therefore consistent',
              'A ra TS7030 còn B im lặng ở cả hai lượt, vì hàm không chú thích suy ra <code>string | undefined</code> nên tự nó nhất quán',
            ),
            B(
              'Neither reports anything: falling off the end of a function is legal JavaScript, and TypeScript only warns about it in a linter rule',
              'Không hàm nào bị báo: rơi hết thân hàm mà không return là JavaScript hợp lệ, và TypeScript chỉ cảnh báo bằng một luật của linter',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured on 5.9.3, four runs. A under <code>--strict</code> alone: <code>error TS2366: Function lacks ending return statement and return type does not include &#39;undefined&#39;.</code> — adding <code>--noImplicitReturns</code> changes nothing, it was already an error. B under <code>--strict</code> alone: exit code 0, silent; with <code>--noImplicitReturns</code>: <code>error TS7030: Not all code paths return a value.</code>. ⚠️ The course pairs its ANNOTATED example with the TS7030 message, which is the wrong code for that snippet and overstates what the flag adds. The rule to carry away: annotate the return type and <code>strict</code> already catches the missing branch; <code>noImplicitReturns</code> is what covers the un-annotated functions strict lets through.',
            'Đo trên 5.9.3, bốn lượt chạy. A dưới <code>--strict</code> không thôi: <code>error TS2366: Function lacks ending return statement and return type does not include &#39;undefined&#39;.</code> — thêm <code>--noImplicitReturns</code> chẳng đổi gì, nó vốn đã là lỗi. B dưới <code>--strict</code> không thôi: mã thoát 0, im lặng; thêm <code>--noImplicitReturns</code>: <code>error TS7030: Not all code paths return a value.</code>. ⚠️ Giáo trình ghép ví dụ CÓ chú thích kiểu trả về với thông báo TS7030 — sai mã lỗi cho đoạn đó, và nói quá công của cái cờ. Điều đáng mang theo: chú thích kiểu trả về thì <code>strict</code> đã bắt được nhánh thiếu; <code>noImplicitReturns</code> mới là thứ phủ nốt những hàm không chú thích mà strict cho lọt.',
          ),
        }),

        mcq({
          prompt: B(
            'Compiled with <code>--strict --noUnusedLocals --noUnusedParameters</code> on tsc 5.9.3. Which of these four is NOT reported?' + code(
              "import { other as _other } from './lib.js';   // A — unused import, underscored\n" +
              'const scratch = 42;                           // B — unused local\n' +
              'const _ignored = 7;                           // C — unused local, underscored\n' +
              'function h(_req: string, res: string) {       // D — unused parameter, underscored\n' +
              '  return res;\n' +
              '}',
            ),
            'Biên dịch với <code>--strict --noUnusedLocals --noUnusedParameters</code> trên tsc 5.9.3. Cái nào trong bốn cái sau KHÔNG bị báo?' + code(
              "import { other as _other } from './lib.js';   // A — import không dùng, có gạch dưới\n" +
              'const scratch = 42;                           // B — biến cục bộ không dùng\n' +
              'const _ignored = 7;                           // C — biến cục bộ không dùng, có gạch dưới\n' +
              'function h(_req: string, res: string) {       // D — tham số không dùng, có gạch dưới\n' +
              '  return res;\n' +
              '}',
            ),
          ),
          options: [
            B('Only B — the underscore exempts A, C and D alike', 'Chỉ B — dấu gạch dưới miễn cho cả A, C và D'),
            B('A and D. B and C are both TS6133 — the underscore convention does NOT exempt an unused local variable', 'A và D. B và C đều là TS6133 — quy ước gạch dưới KHÔNG miễn cho một biến cục bộ không dùng'),
            B('C and D. The unused import A is TS6133 too, because imports are governed by a separate rule', 'C và D. Import không dùng ở A cũng là TS6133, vì import chịu một luật riêng'),
            B('Only D — the underscore convention applies to function parameters and to nothing else at all', 'Chỉ D — quy ước gạch dưới chỉ áp dụng cho tham số hàm chứ không cho bất cứ thứ gì khác'),
          ],
          correct: 1,
          explanation: EX(
            'Measured on 5.9.3: two errors, <code>TS6133: &#39;scratch&#39; is declared but its value is never read.</code> and <code>TS6133: &#39;_ignored&#39; is declared but its value is never read.</code>. The underscored import (A) and the underscored parameter (D) are both silent. ⚠️ The course states the opposite on both counts — that an unused local named <code>_x</code> IS exempt and an unused import named <code>_foo</code> is NOT. On this compiler the exemption covers parameters and import binding names, and does not cover local variables. The practical version: <code>_</code> is for names you are contractually required to declare but do not use — an Express <code>(_req, res)</code>. A local you do not use is just dead code; delete it.',
            'Đo trên 5.9.3: hai lỗi, <code>TS6133: &#39;scratch&#39; is declared but its value is never read.</code> và <code>TS6133: &#39;_ignored&#39; is declared but its value is never read.</code>. Import có gạch dưới (A) và tham số có gạch dưới (D) đều im lặng. ⚠️ Giáo trình nói NGƯỢC ở cả hai vế — rằng biến cục bộ tên <code>_x</code> ĐƯỢC miễn còn import tên <code>_foo</code> thì KHÔNG. Trên trình biên dịch này, phép miễn phủ tham số và tên bind của import, và không phủ biến cục bộ. Bản thực dụng: <code>_</code> dành cho những cái tên bạn buộc phải khai theo hợp đồng mà không dùng tới — kiểu <code>(_req, res)</code> của Express. Còn một biến cục bộ không dùng thì chỉ là mã chết; xoá đi.',
          ),
        }),

        mcq({
          prompt: B(
            'The same file is compiled with <code>--target ES5</code>. Which description of the emitted JavaScript is right?' + code(
              "const msg: string = 'hello';\n" +
              'const shout = (s: string): string => s.toUpperCase();\n' +
              'class Greeter { constructor(public who: string) {} }\n' +
              "console.log(shout(msg), new Greeter('x').who);",
            ),
            'Cùng file đó biên dịch với <code>--target ES5</code>. Mô tả nào về JavaScript sinh ra là ĐÚNG?' + code(
              "const msg: string = 'hello';\n" +
              'const shout = (s: string): string => s.toUpperCase();\n' +
              'class Greeter { constructor(public who: string) {} }\n' +
              "console.log(shout(msg), new Greeter('x').who);",
            ),
          ),
          options: [
            B('The types are erased but the syntax is untouched — <code>target</code> only decides which runtime APIs the checker believes in', 'Kiểu bị xoá nhưng cú pháp giữ nguyên — <code>target</code> chỉ quyết định bộ trình biên dịch tin là có API nào lúc chạy'),
            B('Nothing is emitted, because <code>public who: string</code> is not valid under an ES5 target', 'Không sinh ra gì cả, vì <code>public who: string</code> không hợp lệ dưới target ES5'),
            B('Types erased, <code>const</code> becomes <code>var</code>, the arrow becomes a <code>function</code> expression, and the <code>class</code> becomes an IIFE returning a constructor function', 'Kiểu bị xoá, <code>const</code> thành <code>var</code>, hàm mũi tên thành biểu thức <code>function</code>, còn <code>class</code> thành một IIFE trả về hàm khởi tạo'),
            B('Types erased and <code>const</code> becomes <code>var</code>, but the arrow and the class are kept — ES5 supports both', 'Kiểu bị xoá và <code>const</code> thành <code>var</code>, nhưng hàm mũi tên và class được giữ lại — ES5 hỗ trợ cả hai'),
          ],
          correct: 2,
          explanation: EX(
            'Compiled for real. The output is <code>var msg = &#39;hello&#39;;</code>, <code>var shout = function (s) { return s.toUpperCase(); };</code>, and <code>var Greeter = /** @class */ (function () { function Greeter(who) { this.who = who; } return Greeter; }());</code>. Those are <code>tsc</code>\'s three jobs on display: type-check, erase types, downlevel syntax. Keep <code>target</code> and <code>lib</code> apart in your head — <code>target</code> decides which SYNTAX is emitted, <code>lib</code> decides which runtime APIs the checker believes exist, and raising <code>target</code> quietly raises the default <code>lib</code> too. <code>lib</code> never polyfills: <code>&quot;lib&quot;: [&quot;ES2023&quot;]</code> makes <code>arr.findLast()</code> type-check and still throws on a runtime that lacks it.',
            'Đã biên dịch thật. Kết quả là <code>var msg = &#39;hello&#39;;</code>, <code>var shout = function (s) { return s.toUpperCase(); };</code>, và <code>var Greeter = /** @class */ (function () { function Greeter(who) { this.who = who; } return Greeter; }());</code>. Đó chính là ba việc của <code>tsc</code> bày ra trước mắt: kiểm kiểu, xoá kiểu, hạ cấp cú pháp. Hãy tách <code>target</code> và <code>lib</code> trong đầu — <code>target</code> quyết định CÚ PHÁP nào được sinh ra, <code>lib</code> quyết định bộ kiểm tin là lúc chạy có API nào, và nâng <code>target</code> thì âm thầm nâng luôn <code>lib</code> mặc định. <code>lib</code> không bao giờ vá thiếu: <code>&quot;lib&quot;: [&quot;ES2023&quot;]</code> làm <code>arr.findLast()</code> qua kiểm kiểu và vẫn ném lỗi trên một runtime không có nó.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO flags that <code>&quot;strict&quot;: true</code> turns on for you.',
            'Chọn HAI cờ mà <code>&quot;strict&quot;: true</code> tự bật giúp bạn.',
          ),
          options: [
            B('<code>noImplicitAny</code>', '<code>noImplicitAny</code>'),
            B('<code>noUncheckedIndexedAccess</code>', '<code>noUncheckedIndexedAccess</code>'),
            B('<code>strictNullChecks</code>', '<code>strictNullChecks</code>'),
            B('<code>exactOptionalPropertyTypes</code>', '<code>exactOptionalPropertyTypes</code>'),
          ],
          correct: [0, 2],
          explanation: EX(
            'The <code>strict</code> umbrella covers <code>noImplicitAny</code>, <code>strictNullChecks</code>, <code>strictFunctionTypes</code>, <code>strictBindCallApply</code>, <code>strictPropertyInitialization</code>, <code>noImplicitThis</code>, <code>alwaysStrict</code> and <code>useUnknownInCatchVariables</code> — and, importantly, whatever the next version of TypeScript adds to it, which is the whole reason to use the umbrella instead of listing the flags. <code>noUncheckedIndexedAccess</code> and <code>exactOptionalPropertyTypes</code> are NOT in it; neither are <code>noImplicitReturns</code>, <code>noUnusedLocals</code> or <code>noUnusedParameters</code>. Turn those on at project start — they are painful to retrofit onto a large codebase later.',
            'Cái ô <code>strict</code> phủ <code>noImplicitAny</code>, <code>strictNullChecks</code>, <code>strictFunctionTypes</code>, <code>strictBindCallApply</code>, <code>strictPropertyInitialization</code>, <code>noImplicitThis</code>, <code>alwaysStrict</code> và <code>useUnknownInCatchVariables</code> — và, quan trọng không kém, phủ luôn bất cứ cờ nào phiên bản TypeScript kế tiếp thêm vào, đó chính là lý do dùng cái ô thay vì liệt kê từng cờ. <code>noUncheckedIndexedAccess</code> và <code>exactOptionalPropertyTypes</code> KHÔNG nằm trong đó; <code>noImplicitReturns</code>, <code>noUnusedLocals</code> và <code>noUnusedParameters</code> cũng vậy. Hãy bật chúng ngay từ đầu dự án — về sau nhét vào một kho mã lớn là rất cực.',
          ),
        }),

        // ── Chương 10 — Module & khai báo ───────────────────────────────
        mcq({
          prompt: B(
            'The mistake is in <code>app.ts</code> but the signature lives in <code>math.ts</code>. What happens?' + code(
              '// math.ts\n' +
              'export function add(a: number, b: number): number { return a + b; }\n' +
              'export type Vec2 = { x: number; y: number };\n' +
              '\n' +
              '// app.ts\n' +
              "import { add, type Vec2 } from './math.js';\n" +
              'const v: Vec2 = { x: 1, y: 2 };\n' +
              'const sum: number = add(v.x, v.y);\n' +
              "add(1, 'two');",
            ),
            'Sai sót nằm trong <code>app.ts</code> còn chữ ký hàm thì ở <code>math.ts</code>. Chuyện gì xảy ra?' + code(
              '// math.ts\n' +
              'export function add(a: number, b: number): number { return a + b; }\n' +
              'export type Vec2 = { x: number; y: number };\n' +
              '\n' +
              '// app.ts\n' +
              "import { add, type Vec2 } from './math.js';\n" +
              'const v: Vec2 = { x: 1, y: 2 };\n' +
              'const sum: number = add(v.x, v.y);\n' +
              "add(1, 'two');",
            ),
          ),
          options: [
            B('Nothing — each file is compiled independently, so a call site is only checked against its own file', 'Không lỗi gì — mỗi file được biên dịch độc lập nên chỗ gọi chỉ được kiểm trong phạm vi file của nó'),
            B('TS2307, because the import path ends in <code>.js</code> while the source file is <code>math.ts</code>', 'TS2307, vì đường dẫn import kết thúc bằng <code>.js</code> trong khi file nguồn là <code>math.ts</code>'),
            B('TS1361, because <code>Vec2</code> was imported with the inline <code>type</code> keyword and then used in an annotation', 'TS1361, vì <code>Vec2</code> được import bằng từ khoá <code>type</code> nội dòng rồi lại dùng trong một chú thích kiểu'),
            B('TS2345 on the last line — types cross the module boundary, so the call is checked against <code>add</code>\'s declaration in the other file', 'TS2345 ở dòng cuối — kiểu đi xuyên qua ranh giới module, nên lời gọi được kiểm với khai báo của <code>add</code> ở file bên kia'),
          ],
          correct: 3,
          explanation: EX(
            'Measured: one error, <code>app.ts(5,8): error TS2345: Argument of type &#39;string&#39; is not assignable to parameter of type &#39;number&#39;.</code>. This is the whole point of modules for a type checker: the exported names are the public API, and every call site anywhere in the program is checked against the declaration. Two details in the snippet that trip people up and are both correct here. The path ends in <code>.js</code> because under NodeNext resolution you reference the compiled output, not the source. And <code>type Vec2</code> inline marks that binding as type-only, so it is guaranteed to vanish from the emitted JavaScript.',
            'Đo được: một lỗi, <code>app.ts(5,8): error TS2345: Argument of type &#39;string&#39; is not assignable to parameter of type &#39;number&#39;.</code>. Đây chính là ý nghĩa của module đối với một bộ kiểm kiểu: các tên được export là API công khai, và mọi chỗ gọi ở bất cứ đâu trong chương trình đều bị đối chiếu với khai báo ấy. Hai chi tiết trong đoạn mã hay làm người ta vấp và ở đây đều đúng cả. Đường dẫn kết thúc bằng <code>.js</code> vì dưới cơ chế phân giải NodeNext bạn tham chiếu tới BẢN BIÊN DỊCH chứ không phải mã nguồn. Và <code>type Vec2</code> nội dòng đánh dấu tên đó là chỉ-kiểu, nên nó chắc chắn biến mất khỏi JavaScript sinh ra.',
          ),
        }),

        mcq({
          prompt: B(
            'What does the compiler say about the last line?' + code(
              "import type { add } from './math.js';\n" +
              '\n' +
              'type F = typeof add;\n' +
              'const g: F = (a, b) => a + b;\n' +
              '\n' +
              'console.log(add(1, 2));',
            ),
            'Trình biên dịch nói gì về dòng cuối?' + code(
              "import type { add } from './math.js';\n" +
              '\n' +
              'type F = typeof add;\n' +
              'const g: F = (a, b) => a + b;\n' +
              '\n' +
              'console.log(add(1, 2));',
            ),
          ),
          options: [
            B(
              'TS1361 "&#39;add&#39; cannot be used as a value because it was imported using &#39;import type&#39;"',
              'TS1361 "&#39;add&#39; cannot be used as a value because it was imported using &#39;import type&#39;"',
            ),
            B(
              'Nothing — <code>import type</code> is only advice to the bundler, and the binding is still callable',
              'Không lỗi — <code>import type</code> chỉ là lời khuyên cho bộ đóng gói, tên đó vẫn gọi được',
            ),
            B(
              'TS2693, because <code>typeof add</code> on line 3 already consumed the binding as a type and released the name',
              'TS2693, vì <code>typeof add</code> ở dòng 3 đã tiêu thụ tên đó dưới dạng kiểu và trả tên lại',
            ),
            B(
              'TS2304 "Cannot find name &#39;add&#39;" — a type-only import creates no binding at all',
              'TS2304 "Cannot find name &#39;add&#39;" — import chỉ-kiểu không tạo ra tên nào cả',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured, verbatim: <code>error TS1361: &#39;add&#39; cannot be used as a value because it was imported using &#39;import type&#39;.</code> The binding exists — line 3 uses it happily in <code>typeof add</code> — it just may never be used as a value. That guarantee is the point: <code>import type</code> is erased with certainty, so it can never drag a module into the runtime bundle. A plain <code>import</code> is only erased when the compiler can see every use was type-only, and that is a whole-file decision — which is how import elision silently removes a module\'s side effects. Import a side-effect module with the bare form, <code>import &#39;./register-hooks&#39;</code>, on its own line.',
            'Đo được, nguyên văn: <code>error TS1361: &#39;add&#39; cannot be used as a value because it was imported using &#39;import type&#39;.</code> Tên đó CÓ tồn tại — dòng 3 dùng nó thoải mái trong <code>typeof add</code> — chỉ là không bao giờ được dùng như một GIÁ TRỊ. Chính bảo đảm đó mới là điểm mấu chốt: <code>import type</code> chắc chắn bị xoá, nên nó không bao giờ kéo được một module vào gói chạy. Một <code>import</code> thường chỉ bị xoá khi trình biên dịch thấy mọi cách dùng đều là chỉ-kiểu, mà đó là quyết định theo TOÀN FILE — và đó là cách phép xoá import âm thầm gỡ mất tác dụng phụ của một module. Import một module vì tác dụng phụ thì dùng dạng trơ, <code>import &#39;./register-hooks&#39;</code>, trên một dòng riêng.',
          ),
        }),

        mcq({
          prompt: B(
            'There is no <code>declare module</code> anywhere, yet the call below is type-checked. Why?' + code(
              '// legacy.js — plain JavaScript, no types\n' +
              'exports.shout = function (s) { return s.toUpperCase(); };\n' +
              '\n' +
              '// legacy.d.ts — sits next to it, same basename\n' +
              'export function shout(s: string): string;\n' +
              '\n' +
              '// use.ts\n' +
              "import { shout } from './legacy.js';\n" +
              'console.log(shout(42));',
            ),
            'Không có <code>declare module</code> ở đâu cả, vậy mà lời gọi dưới đây vẫn được kiểm kiểu. Vì sao?' + code(
              '// legacy.js — JavaScript thuần, không kiểu\n' +
              'exports.shout = function (s) { return s.toUpperCase(); };\n' +
              '\n' +
              '// legacy.d.ts — nằm cạnh nó, cùng tên gốc\n' +
              'export function shout(s: string): string;\n' +
              '\n' +
              '// use.ts\n' +
              "import { shout } from './legacy.js';\n" +
              'console.log(shout(42));',
            ),
          ),
          options: [
            B(
              'It is not checked — the call compiles, because a <code>.js</code> import is always <code>any</code> unless <code>allowJs</code> is on',
              'Nó KHÔNG được kiểm — lời gọi biên dịch được, vì import một file <code>.js</code> luôn là <code>any</code> trừ khi bật <code>allowJs</code>',
            ),
            B(
              'TypeScript pairs <code>legacy.d.ts</code> with <code>legacy.js</code> by filename, so <code>shout(42)</code> is TS2345 "Argument of type &#39;number&#39; is not assignable to parameter of type &#39;string&#39;"',
              'TypeScript tự ghép <code>legacy.d.ts</code> với <code>legacy.js</code> theo tên file, nên <code>shout(42)</code> ra TS2345 "Argument of type &#39;number&#39; is not assignable to parameter of type &#39;string&#39;"',
            ),
            B(
              'The <code>.d.ts</code> shadows the <code>.js</code> entirely, so the import resolves to a module with no implementation and throws at runtime',
              'File <code>.d.ts</code> che hẳn file <code>.js</code>, nên import trỏ vào một module không có phần cài đặt và ném lỗi lúc chạy',
            ),
            B(
              'It works only because the path ends in <code>.js</code>; a sidecar declaration would be ignored for a <code>.ts</code> path',
              'Nó chạy được chỉ nhờ đường dẫn kết thúc bằng <code>.js</code>; khai báo kèm bên sẽ bị bỏ qua với một đường dẫn <code>.ts</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: <code>use.ts(2,19): error TS2345: Argument of type &#39;number&#39; is not assignable to parameter of type &#39;string&#39;.</code> — no config, no <code>declare module</code>, just the filename convention. This is the tool for gradually typing your OWN JavaScript files: <code>declare module &#39;name&#39;</code> can only name a package, never a relative path, so a sidecar is the way to attach types to <code>./legacy.js</code>. A <code>.d.ts</code> holds declarations and no implementations — it is a header file, and the real code still comes from the <code>.js</code> at runtime.',
            'Đo được: <code>use.ts(2,19): error TS2345: Argument of type &#39;number&#39; is not assignable to parameter of type &#39;string&#39;.</code> — không cấu hình gì, không <code>declare module</code> nào, chỉ nhờ quy ước trùng tên file. Đây là công cụ để dần dần gõ kiểu cho chính các file JavaScript CỦA BẠN: <code>declare module &#39;name&#39;</code> chỉ đặt tên được cho một gói chứ không bao giờ cho một đường dẫn tương đối, nên khai báo kèm bên là cách gắn kiểu cho <code>./legacy.js</code>. Một file <code>.d.ts</code> chỉ chứa khai báo chứ không có phần cài đặt — nó là một file header, còn mã thật vẫn đến từ file <code>.js</code> lúc chạy.',
          ),
        }),

        mcq({
          prompt: B(
            'What does the compiler report on the last line, and what does the type name in the message tell you?' + code(
              'export {};\n' +
              'declare global {\n' +
              '  interface Window { appVersion: string }\n' +
              '}\n' +
              "window.appVersion = '1.0';\n" +
              'console.log(window.appVresion);',
            ),
            'Trình biên dịch báo gì ở dòng cuối, và tên kiểu trong thông báo cho bạn biết điều gì?' + code(
              'export {};\n' +
              'declare global {\n' +
              '  interface Window { appVersion: string }\n' +
              '}\n' +
              "window.appVersion = '1.0';\n" +
              'console.log(window.appVresion);',
            ),
          ),
          options: [
            B(
              'TS2339 with no suggestion — the augmented member is not part of the type the compiler compares against',
              'TS2339 không kèm gợi ý — thành viên vừa augment không thuộc kiểu mà trình biên dịch đem ra so',
            ),
            B(
              'TS2669 "Augmentations for the global scope can only be directly nested in external modules" — the <code>export {}</code> does not count',
              'TS2669 "Augmentations for the global scope can only be directly nested in external modules" — dòng <code>export {}</code> không được tính',
            ),
            B(
              'TS2551 "Property &#39;appVresion&#39; does not exist on type &#39;Window &amp; typeof globalThis&#39;. Did you mean &#39;appVersion&#39;?" — the augmentation merged into the real global interface',
              'TS2551 "Property &#39;appVresion&#39; does not exist on type &#39;Window &amp; typeof globalThis&#39;. Did you mean &#39;appVersion&#39;?" — phần augment đã hợp nhất vào chính interface toàn cục',
            ),
            B(
              'Nothing — <code>declare global</code> replaces the built-in <code>Window</code>, so any property read on it is allowed',
              'Không lỗi — <code>declare global</code> thay thế hẳn <code>Window</code> có sẵn, nên đọc thuộc tính nào trên nó cũng được',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured (with <code>--lib ES2022,DOM</code>): <code>error TS2551: Property &#39;appVresion&#39; does not exist on type &#39;Window &amp; typeof globalThis&#39;. Did you mean &#39;appVersion&#39;?</code>. The <code>&amp; typeof globalThis</code> in the message is the tell: your declaration did not replace anything, it MERGED into the existing interface, using the same declaration-merging mechanism from chapter 4 — deliberately this time. The <code>export {}</code> is required because <code>declare global</code> is only legal inside a module. Three conditions have to hold for any augmentation to work: the target must be an <code>interface</code> (a <code>type</code> alias cannot be merged into), the file must be inside the program\'s <code>include</code>, and the member you add must be honest — declare <code>user?: User</code> on Express\'s <code>Request</code>, never <code>user: User</code>.',
            'Đo được (với <code>--lib ES2022,DOM</code>): <code>error TS2551: Property &#39;appVresion&#39; does not exist on type &#39;Window &amp; typeof globalThis&#39;. Did you mean &#39;appVersion&#39;?</code>. Cụm <code>&amp; typeof globalThis</code> trong thông báo là dấu hiệu: khai báo của bạn không thay thế cái gì cả, nó HỢP NHẤT vào interface đang có, dùng đúng cơ chế declaration merging của chương 4 — lần này là cố ý. Dòng <code>export {}</code> là bắt buộc vì <code>declare global</code> chỉ hợp lệ bên trong một module. Ba điều kiện phải đúng thì augmentation mới ăn: đích phải là một <code>interface</code> (không hợp nhất được vào một <code>type</code> alias), file phải nằm trong <code>include</code> của chương trình, và thành viên bạn thêm vào phải TRUNG THỰC — hãy khai <code>user?: User</code> trên <code>Request</code> của Express, đừng bao giờ khai <code>user: User</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'The package IS installed in <code>node_modules</code>. What is the error, and what is the usual one-line fix?' + code(
              "import leftpad from 'left-pad';\n" +
              "console.log(leftpad('7', 3));",
            ),
            'Gói ĐÃ được cài trong <code>node_modules</code>. Lỗi là gì, và cách sửa một dòng thông thường là gì?' + code(
              "import leftpad from 'left-pad';\n" +
              "console.log(leftpad('7', 3));",
            ),
          ),
          options: [
            B(
              'TS2792 "Cannot find module" — the fix is to set <code>moduleResolution</code> to <code>nodenext</code>',
              'TS2792 "Cannot find module" — sửa bằng cách đặt <code>moduleResolution</code> thành <code>nodenext</code>',
            ),
            B(
              'TS2613 about a missing default export — the fix is <code>esModuleInterop: true</code>',
              'TS2613 về việc thiếu default export — sửa bằng <code>esModuleInterop: true</code>',
            ),
            B(
              'TS7016 "implicitly has an &#39;any&#39; type" — the fix is to add <code>// @ts-ignore</code> above the import',
              'TS7016 "implicitly has an &#39;any&#39; type" — sửa bằng cách thêm <code>// @ts-ignore</code> phía trên dòng import',
            ),
            B(
              'TS2307 "Cannot find module &#39;left-pad&#39; or its corresponding type declarations" — the fix is <code>npm i -D @types/left-pad</code>',
              'TS2307 "Cannot find module &#39;left-pad&#39; or its corresponding type declarations" — sửa bằng <code>npm i -D @types/left-pad</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured: <code>error TS2307: Cannot find module &#39;left-pad&#39; or its corresponding type declarations.</code> — read the second half of that sentence, because the module is right there on disk. TypeScript resolves types in a fixed order: the package\'s own bundled declarations (its <code>types</code> field or the <code>exports</code> map), then <code>index.d.ts</code> beside the main file, then <code>node_modules/@types/&lt;name&gt;</code>. Nothing else. Installing the DefinitelyTyped package puts them in the third place and needs no config at all. If no types exist anywhere, fall back to a hand-written <code>declare module</code> shim — and remember that <code>@types</code> is versioned separately from the library, so it can describe an API you are no longer running.',
            'Đo được: <code>error TS2307: Cannot find module &#39;left-pad&#39; or its corresponding type declarations.</code> — hãy đọc nửa sau của câu ấy, vì cái module thì đang nằm sờ sờ trên đĩa. TypeScript tìm kiểu theo một thứ tự cố định: khai báo gói tự mang theo (trường <code>types</code> hoặc bản đồ <code>exports</code>), rồi <code>index.d.ts</code> nằm cạnh file chính, rồi <code>node_modules/@types/&lt;tên&gt;</code>. Không còn chỗ nào khác. Cài gói của DefinitelyTyped là đặt chúng vào chỗ thứ ba, và không cần cấu hình gì thêm. Nếu chẳng đâu có kiểu thì lùi về một shim <code>declare module</code> viết tay — và nhớ rằng <code>@types</code> được đánh phiên bản riêng với thư viện, nên nó hoàn toàn có thể đang mô tả một API bạn không còn chạy nữa.',
          ),
        }),

        // ── Chương 11 — Backend Node/Express có kiểu ────────────────────
        mcq({
          prompt: B(
            'One of the two <code>res.data.id</code> reads is an error. Which, and what makes the union work?' + code(
              'type ApiResponse<T> =\n' +
              '  | { ok: true; data: T }\n' +
              '  | { ok: false; error: string };\n' +
              '\n' +
              'interface User { id: number }\n' +
              '\n' +
              'function render(res: ApiResponse<User>): string {\n' +
              '  if (res.ok) return String(res.data.id);   // A\n' +
              '  return String(res.data.id);               // B\n' +
              '}',
            ),
            'Một trong hai phép đọc <code>res.data.id</code> là lỗi. Cái nào, và điều gì khiến union này hoạt động?' + code(
              'type ApiResponse<T> =\n' +
              '  | { ok: true; data: T }\n' +
              '  | { ok: false; error: string };\n' +
              '\n' +
              'interface User { id: number }\n' +
              '\n' +
              'function render(res: ApiResponse<User>): string {\n' +
              '  if (res.ok) return String(res.data.id);   // A\n' +
              '  return String(res.data.id);               // B\n' +
              '}',
            ),
          ),
          options: [
            B(
              'B — TS2339 "Property &#39;data&#39; does not exist on type &#39;{ ok: false; error: string; }&#39;", because <code>ok</code> is a literal <code>true</code>/<code>false</code>, not a <code>boolean</code>',
              'B — TS2339 "Property &#39;data&#39; does not exist on type &#39;{ ok: false; error: string; }&#39;", vì <code>ok</code> mang kiểu literal <code>true</code>/<code>false</code> chứ không phải <code>boolean</code>',
            ),
            B(
              'A — narrowing on a boolean discriminant is not supported; you need an explicit <code>res.ok === true</code>',
              'A — không thu hẹp kiểu được trên một trường phân biệt kiểu boolean; phải viết tường minh <code>res.ok === true</code>',
            ),
            B(
              'Neither — <code>data</code> is declared on one member of the union, and that is enough for the property to be readable',
              'Không cái nào — <code>data</code> có khai trên một thành viên của union, và thế là đủ để đọc được thuộc tính',
            ),
            B(
              'B, but with TS18048 "&#39;res.data&#39; is possibly &#39;undefined&#39;" rather than a missing-property error',
              'B, nhưng với TS18048 "&#39;res.data&#39; is possibly &#39;undefined&#39;" chứ không phải lỗi thiếu thuộc tính',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: one error, <code>TS2339: Property &#39;data&#39; does not exist on type &#39;{ ok: false; error: string; }&#39;.</code> on line B. This is chapter 5\'s discriminated union doing load-bearing work across the wire. The detail that makes it function is easy to lose: <code>ok</code> is typed as the LITERAL <code>true</code> on one variant and the literal <code>false</code> on the other. Declare it <code>ok: boolean</code> on both and everything still compiles, the <code>if</code> narrows nothing, and <code>res.data</code> becomes an error inside the success branch — pointing at your access rather than at the declaration that caused it. The envelope also makes "an error that carries data" unrepresentable, which is the real win: the client cannot forget to handle failure.',
            'Đo được: một lỗi, <code>TS2339: Property &#39;data&#39; does not exist on type &#39;{ ok: false; error: string; }&#39;.</code> ở dòng B. Đây là union có trường phân biệt của chương 5 đang gánh việc thật, xuyên qua đường truyền. Chi tiết khiến nó chạy được thì rất dễ tuột: <code>ok</code> mang kiểu LITERAL <code>true</code> ở một biến thể và literal <code>false</code> ở biến thể kia. Khai nó là <code>ok: boolean</code> ở cả hai thì mọi thứ vẫn biên dịch, cái <code>if</code> chẳng thu hẹp gì, và <code>res.data</code> trở thành lỗi ngay trong nhánh THÀNH CÔNG — chỉ vào chỗ bạn truy cập chứ không phải chỗ khai báo đã gây ra nó. Cái phong bì này còn khiến "lỗi mà vẫn có data" trở thành không biểu diễn được, và đó mới là cái lợi thật: phía client không thể quên xử lý nhánh thất bại.',
          ),
        }),

        mcq({
          prompt: B(
            'What does <code>public statusCode: number</code> in the constructor do, and what is the error?' + code(
              'class AppError extends Error {\n' +
              '  constructor(public statusCode: number, message: string) {\n' +
              '    super(message);\n' +
              '  }\n' +
              '}\n' +
              "const e = new AppError(500, 'Boom');\n" +
              'const s: string = e.statusCode;',
            ),
            '<code>public statusCode: number</code> trong hàm khởi tạo làm gì, và lỗi là gì?' + code(
              'class AppError extends Error {\n' +
              '  constructor(public statusCode: number, message: string) {\n' +
              '    super(message);\n' +
              '  }\n' +
              '}\n' +
              "const e = new AppError(500, 'Boom');\n" +
              'const s: string = e.statusCode;',
            ),
          ),
          options: [
            B(
              'It only marks visibility; the field must still be declared and assigned separately, so <code>e.statusCode</code> is TS2339',
              'Nó chỉ đánh dấu phạm vi truy cập; trường vẫn phải khai và gán riêng, nên <code>e.statusCode</code> ra TS2339',
            ),
            B(
              'It is a parameter property — it declares the field AND assigns it in one line, so <code>e.statusCode</code> is a typed <code>number</code> and the last line is TS2322',
              'Đó là parameter property — nó vừa khai trường vừa gán trong một dòng, nên <code>e.statusCode</code> là <code>number</code> có kiểu và dòng cuối ra TS2322',
            ),
            B(
              'It makes the parameter optional as well as public, so <code>e.statusCode</code> is <code>number | undefined</code> and the error is TS18048',
              'Nó làm tham số vừa public vừa tuỳ chọn, nên <code>e.statusCode</code> là <code>number | undefined</code> và lỗi là TS18048',
            ),
            B(
              'Nothing — <code>public</code> is the default for a constructor parameter, and the last line compiles because <code>number</code> widens to <code>string</code> for template use',
              'Chẳng làm gì — <code>public</code> là mặc định của tham số hàm khởi tạo, và dòng cuối biên dịch được vì <code>number</code> nới thành <code>string</code> để dùng trong chuỗi',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: <code>error TS2322: Type &#39;number&#39; is not assignable to type &#39;string&#39;.</code> on the last line — which proves <code>e.statusCode</code> really is a typed <code>number</code> on the instance. A parameter property is TypeScript\'s shorthand for "declare this field and assign the argument to it", and it is what lets a central error middleware read <code>err.statusCode</code> with confidence instead of <code>(err as any).statusCode</code>. One practical caveat: a parameter property is NOT erasable syntax — <code>node file.ts</code> and other type-strippers reject it outright, so a codebase that runs <code>.ts</code> directly has to declare the field the long way.',
            'Đo được: <code>error TS2322: Type &#39;number&#39; is not assignable to type &#39;string&#39;.</code> ở dòng cuối — điều đó chứng minh <code>e.statusCode</code> đúng là một <code>number</code> có kiểu trên đối tượng. Parameter property là cách viết tắt của TypeScript cho "khai trường này rồi gán đối số vào nó", và chính nó cho phép một middleware xử lý lỗi trung tâm đọc <code>err.statusCode</code> một cách chắc chắn thay vì <code>(err as any).statusCode</code>. Một lưu ý thực tế: parameter property KHÔNG phải cú pháp xoá được — <code>node file.ts</code> và các bộ xoá kiểu khác từ chối thẳng, nên kho mã nào chạy thẳng <code>.ts</code> thì phải khai trường theo cách dài.',
          ),
        }),

        mcq({
          prompt: B(
            'What does the compiler say, and why is this signature better than one that throws on a miss?' + code(
              'interface User { id: number; name: string }\n' +
              '\n' +
              'async function findUser(id: number): Promise<User | null> {\n' +
              "  return id === 1 ? { id, name: 'Ada' } : null;\n" +
              '}\n' +
              '\n' +
              'async function run() {\n' +
              '  const u = await findUser(1);\n' +
              '  console.log(u.name);\n' +
              '}',
            ),
            'Trình biên dịch nói gì, và vì sao chữ ký này tốt hơn một chữ ký ném lỗi khi không tìm thấy?' + code(
              'interface User { id: number; name: string }\n' +
              '\n' +
              'async function findUser(id: number): Promise<User | null> {\n' +
              "  return id === 1 ? { id, name: 'Ada' } : null;\n" +
              '}\n' +
              '\n' +
              'async function run() {\n' +
              '  const u = await findUser(1);\n' +
              '  console.log(u.name);\n' +
              '}',
            ),
          ),
          options: [
            B(
              'TS2339 — <code>await</code> unwraps only the <code>User</code> arm of the union, so <code>name</code> is missing on the <code>null</code> arm',
              'TS2339 — <code>await</code> chỉ bóc nhánh <code>User</code> của union nên <code>name</code> thiếu ở nhánh <code>null</code>',
            ),
            B(
              'Nothing here — the call passes <code>1</code>, so the compiler can prove the result is a <code>User</code> at this call site',
              'Không lỗi ở đây — lời gọi truyền <code>1</code> nên trình biên dịch chứng minh được kết quả là một <code>User</code> tại chỗ gọi này',
            ),
            B(
              'TS18047 "&#39;u&#39; is possibly &#39;null&#39;" — the honest <code>| null</code> carries the miss to the caller, so "handle the 404" cannot be forgotten',
              'TS18047 "&#39;u&#39; is possibly &#39;null&#39;" — cái <code>| null</code> trung thực mang trường hợp không tìm thấy tới tận người gọi, nên "xử lý 404" không thể quên được',
            ),
            B(
              'TS2571 — you must narrow the awaited value with a type guard before any property access, because <code>Promise</code> resolves to <code>unknown</code>',
              'TS2571 — phải thu hẹp giá trị đã await bằng một type guard trước khi truy cập thuộc tính, vì <code>Promise</code> giải ra <code>unknown</code>',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured: <code>error TS18047: &#39;u&#39; is possibly &#39;null&#39;.</code>. After <code>await</code>, <code>u</code> is <code>User | null</code>, and <code>strictNullChecks</code> refuses the property read until the miss is narrowed away — <code>if (!u) return res.status(404).json(…)</code>. Notice what the alternative costs: a service declared <code>Promise&lt;User&gt;</code> that throws when the row is absent loses this entirely. The type now claims a user always comes back, every caller believes it, and the "not found" case travels as an exception that nothing in the signature mentions. The <code>| null</code> is not noise; it is the missing case made impossible to forget.',
            'Đo được: <code>error TS18047: &#39;u&#39; is possibly &#39;null&#39;.</code>. Sau <code>await</code>, <code>u</code> là <code>User | null</code>, và <code>strictNullChecks</code> từ chối phép đọc thuộc tính cho tới khi nhánh không-tìm-thấy được thu hẹp đi — <code>if (!u) return res.status(404).json(…)</code>. Hãy để ý cái giá của lựa chọn kia: một service khai <code>Promise&lt;User&gt;</code> rồi ném lỗi khi không có bản ghi sẽ mất sạch điều này. Kiểu giờ khẳng định lúc nào cũng có user trả về, mọi người gọi đều tin, còn trường hợp "không tìm thấy" thì đi lại dưới dạng một ngoại lệ mà chữ ký hàm không hề nhắc tới. Cái <code>| null</code> không phải nhiễu; nó là trường hợp thiếu được làm cho không thể quên.',
          ),
        }),

        mcq({
          prompt: B(
            'Under <code>--strict</code>, what does the compiler report here?' + code(
              'function handle(): string {\n' +
              "  try { throw new AppError(400, 'bad'); }\n" +
              '  catch (e) { return e.message; }\n' +
              '}',
            ),
            'Dưới <code>--strict</code>, trình biên dịch báo gì ở đây?' + code(
              'function handle(): string {\n' +
              "  try { throw new AppError(400, 'bad'); }\n" +
              '  catch (e) { return e.message; }\n' +
              '}',
            ),
          ),
          options: [
            B(
              'Nothing — the compiler follows the <code>throw</code> in the <code>try</code> and infers <code>e</code> as <code>AppError</code>',
              'Không lỗi — trình biên dịch lần theo lệnh <code>throw</code> trong <code>try</code> và suy ra <code>e</code> là <code>AppError</code>',
            ),
            B(
              'TS2571 "Object is of type &#39;unknown&#39;", which you silence with <code>catch (e: any)</code> — the intended fix',
              'TS2571 "Object is of type &#39;unknown&#39;", dập bằng <code>catch (e: any)</code> — cách sửa được thiết kế sẵn',
            ),
            B(
              'TS7006 — a catch parameter is a parameter, so it needs an explicit annotation like any other',
              'TS7006 — tham số của catch cũng là một tham số nên nó cần chú thích kiểu tường minh như mọi tham số khác',
            ),
            B(
              'TS18046 "&#39;e&#39; is of type &#39;unknown&#39;" — JavaScript lets you throw anything, so you must narrow before reading <code>.message</code>',
              'TS18046 "&#39;e&#39; is of type &#39;unknown&#39;" — JavaScript cho phép ném bất cứ thứ gì, nên phải thu hẹp kiểu trước khi đọc <code>.message</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured: <code>error TS18046: &#39;e&#39; is of type &#39;unknown&#39;.</code>. The flag is <code>useUnknownInCatchVariables</code>, part of <code>strict</code>, and it is telling the truth: JavaScript lets you <code>throw</code> a string, a number, <code>undefined</code>, or a library\'s non-<code>Error</code> rejection value, so the compiler cannot promise you an <code>Error</code>. Writing <code>catch (e: any)</code> makes the red line vanish and, on the day something throws a string, sends <code>{&quot;error&quot;: undefined}</code> with a 500 and no clue what happened. Narrow in order: your own <code>e instanceof AppError</code> first, then <code>e instanceof Error</code>, then a final fallback that stringifies the unknown value so the log still carries something.',
            'Đo được: <code>error TS18046: &#39;e&#39; is of type &#39;unknown&#39;.</code>. Cờ gây ra nó là <code>useUnknownInCatchVariables</code>, nằm trong <code>strict</code>, và nó đang nói thật: JavaScript cho phép <code>throw</code> một chuỗi, một số, <code>undefined</code>, hay một giá trị reject không phải <code>Error</code> của thư viện nào đó — nên trình biên dịch không thể hứa với bạn rằng đó là một <code>Error</code>. Viết <code>catch (e: any)</code> thì gạch đỏ biến mất, và tới hôm có thứ gì đó ném ra một chuỗi, hệ thống gửi về <code>{&quot;error&quot;: undefined}</code> kèm mã 500 mà chẳng có manh mối nào. Hãy thu hẹp theo thứ tự: <code>e instanceof AppError</code> của chính bạn trước, rồi <code>e instanceof Error</code>, rồi một nhánh dự phòng cuối cùng chuyển giá trị lạ thành chuỗi để log vẫn còn giữ được cái gì đó.',
          ),
        }),

        mcq({
          prompt: B(
            'Compiled against <code>@types/express</code>, this file produces errors on A and B but NOT on C. Why is C the dangerous one?' + code(
              "import { RequestHandler } from 'express';\n" +
              'interface Params { id: string }\n' +
              'interface User { id: number; name: string }\n' +
              '\n' +
              'const getUser: RequestHandler<Params, User> = (req, res) => {\n' +
              '  const wrong: number = req.params.id;   // A\n' +
              '  res.json({ id: 1 });                   // B\n' +
              '};\n' +
              '\n' +
              'const boom: RequestHandler = async (req, res) => {   // C\n' +
              '  await Promise.resolve();\n' +
              "  throw new Error('after an await');\n" +
              '};',
            ),
            'Biên dịch với <code>@types/express</code>, file này báo lỗi ở A và B nhưng KHÔNG báo ở C. Vì sao C mới là chỗ nguy hiểm?' + code(
              "import { RequestHandler } from 'express';\n" +
              'interface Params { id: string }\n' +
              'interface User { id: number; name: string }\n' +
              '\n' +
              'const getUser: RequestHandler<Params, User> = (req, res) => {\n' +
              '  const wrong: number = req.params.id;   // A\n' +
              '  res.json({ id: 1 });                   // B\n' +
              '};\n' +
              '\n' +
              'const boom: RequestHandler = async (req, res) => {   // C\n' +
              '  await Promise.resolve();\n' +
              "  throw new Error('after an await');\n" +
              '};',
            ),
          ),
          options: [
            B(
              'C is checked lazily: an <code>async</code> arrow body is only type-checked when the handler is actually mounted on a route',
              'C được kiểm muộn: thân một hàm mũi tên <code>async</code> chỉ được kiểm kiểu khi handler thật sự được gắn vào một route',
            ),
            B(
              'C is safe: Express awaits every handler it calls, so the rejection is forwarded to the error middleware automatically in all versions',
              'C an toàn: Express await mọi handler nó gọi, nên lỗi reject được chuyển tiếp tới middleware xử lý lỗi một cách tự động ở mọi phiên bản',
            ),
            B(
              'C would be an error too, but only under <code>strictFunctionTypes</code>, which is not part of <code>strict</code>',
              'C cũng sẽ là lỗi, nhưng chỉ dưới <code>strictFunctionTypes</code>, mà cờ này không nằm trong <code>strict</code>',
            ),
            B(
              '<code>RequestHandler</code> declares the return type as <code>void</code>, and a callback typed <code>void</code> deliberately accepts a function returning anything — so the returned <code>Promise</code> is silently discarded and the rejection reaches nobody',
              '<code>RequestHandler</code> khai kiểu trả về là <code>void</code>, mà một callback kiểu <code>void</code> thì CỐ Ý nhận cả hàm trả về giá trị — nên cái <code>Promise</code> trả ra bị lặng lẽ vứt đi và lỗi reject không đến tay ai',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured against @types/express 4.17.25: exactly two errors — <code>TS2322: Type &#39;string&#39; is not assignable to type &#39;number&#39;</code> on A (URL params are always strings, even <code>/users/42</code>), and <code>TS2345 … Property &#39;name&#39; is missing in type &#39;{ id: number; }&#39; but required in type &#39;User&#39;</code> on B (<code>Response&lt;User&gt;</code> is a real contract, because the value originates in your own code). C is silent, and that silence is chapter 3\'s <code>void</code>-return rule meeting Express: <code>void</code> means "I will not use your return value", so an <code>async</code> handler type-checks perfectly while Express 4 drops the promise on the floor — no 500, no error middleware, the request hangs until it times out. Wrap async handlers (<code>Promise.resolve(h(req, res, next)).catch(next)</code>) or move to Express 5.',
            'Đo với @types/express 4.17.25: đúng hai lỗi — <code>TS2322: Type &#39;string&#39; is not assignable to type &#39;number&#39;</code> ở A (tham số URL luôn là chuỗi, kể cả <code>/users/42</code>), và <code>TS2345 … Property &#39;name&#39; is missing in type &#39;{ id: number; }&#39; but required in type &#39;User&#39;</code> ở B (<code>Response&lt;User&gt;</code> là một hợp đồng thật, vì giá trị bắt nguồn từ chính mã của bạn). C thì im lặng, và sự im lặng ấy chính là quy tắc <code>void</code> của chương 3 gặp Express: <code>void</code> nghĩa là "tôi sẽ không dùng giá trị anh trả về", nên một handler <code>async</code> qua kiểm kiểu ngon lành trong khi Express 4 vứt cái promise xuống đất — không 500, không middleware lỗi, request treo tới lúc hết giờ. Hãy bọc handler async (<code>Promise.resolve(h(req, res, next)).catch(next)</code>) hoặc chuyển lên Express 5.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Three generic helpers that keep the key (chapters 6 + 8).</b> Write three functions whose type parameters actually relate an input to an output. None of them may use <code>any</code>, and none may take the key as a plain <code>string</code>.</p>' +
            '<ul>' +
            '<li><code>pluck&lt;T, K extends keyof T&gt;(rows, key): T[K][]</code> — the value at <code>key</code> for every row, in order.</li>' +
            '<li><code>pickFields&lt;T, K extends keyof T&gt;(row, keys): Pick&lt;T, K&gt;</code> — a new object carrying only the named keys, in the order they were given.</li>' +
            '<li><code>indexBy&lt;T, K extends keyof T&gt;(rows, key): Record&lt;string, T[]&gt;</code> — group the rows by <code>String(row[key])</code>, each bucket keeping the original order.</li>' +
            '</ul>' +
            '<p>The constraint <code>K extends keyof T</code> is the point of the question: with it, <code>pluck(NOTES, &quot;titel&quot;)</code> is a compile error and <code>pluck(NOTES, &quot;words&quot;)</code> returns <code>number[]</code> rather than a union of every field type. Keep the given data and printing block exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 31 — Ba hàm generic biết giữ lại khoá (chương 6 + 8).</b> Viết ba hàm mà tham số kiểu THẬT SỰ nối một đầu vào với một đầu ra. Không hàm nào được dùng <code>any</code>, và không hàm nào được nhận khoá dưới dạng <code>string</code> trơn.</p>' +
            '<ul>' +
            '<li><code>pluck&lt;T, K extends keyof T&gt;(rows, key): T[K][]</code> — giá trị tại <code>key</code> của từng hàng, đúng thứ tự.</li>' +
            '<li><code>pickFields&lt;T, K extends keyof T&gt;(row, keys): Pick&lt;T, K&gt;</code> — một object mới chỉ mang những khoá được nêu, theo thứ tự đã nêu.</li>' +
            '<li><code>indexBy&lt;T, K extends keyof T&gt;(rows, key): Record&lt;string, T[]&gt;</code> — gom nhóm các hàng theo <code>String(row[key])</code>, mỗi nhóm giữ nguyên thứ tự ban đầu.</li>' +
            '</ul>' +
            '<p>Ràng buộc <code>K extends keyof T</code> chính là điểm của câu hỏi: có nó thì <code>pluck(NOTES, &quot;titel&quot;)</code> là lỗi biên dịch, còn <code>pluck(NOTES, &quot;words&quot;)</code> trả về <code>number[]</code> chứ không phải union của mọi kiểu trường. Giữ nguyên phần dữ liệu và khối in kết quả cho sẵn, và không cài thêm thư viện nào.</p>',
          ),
          language: 'typescript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'interface Note {\n' +
            '  id: number;\n' +
            '  title: string;\n' +
            "  status: 'draft' | 'published';\n" +
            '  words: number;\n' +
            '}\n' +
            'const NOTES: readonly Note[] = [\n' +
            "  { id: 3, title: 'Generics',     status: 'published', words: 900 },\n" +
            "  { id: 1, title: 'Narrowing',    status: 'draft',     words: 120 },\n" +
            "  { id: 2, title: 'Mapped types', status: 'published', words: 450 },\n" +
            "  { id: 4, title: 'tsconfig',     status: 'draft',     words: 120 },\n" +
            '];\n' +
            '\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function pluck<T, K extends keyof T>(rows: readonly T[], key: K): T[K][] {\n' +
            '  // TODO\n' +
            '}\n' +
            '\n' +
            'function pickFields<T, K extends keyof T>(row: T, keys: readonly K[]): Pick<T, K> {\n' +
            '  // TODO\n' +
            '}\n' +
            '\n' +
            'function indexBy<T, K extends keyof T>(rows: readonly T[], key: K): Record<string, T[]> {\n' +
            '  // TODO\n' +
            '}\n' +
            '\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "console.log(JSON.stringify(pluck(NOTES, 'id')));\n" +
            "console.log(JSON.stringify(pluck(NOTES, 'title')));\n" +
            "console.log(JSON.stringify(pickFields(NOTES[0], ['id', 'title'])));\n" +
            "console.log(JSON.stringify(pickFields(NOTES[1], ['status'])));\n" +
            "const byStatus = indexBy(NOTES, 'status');\n" +
            'console.log(JSON.stringify(Object.keys(byStatus).sort()));\n' +
            "console.log(JSON.stringify(pluck(byStatus.draft, 'id')));\n" +
            "console.log(JSON.stringify(Object.keys(indexBy(NOTES, 'words')).sort()));\n",
          expectedOutput:
            '[3,1,2,4]\n' +
            '["Generics","Narrowing","Mapped types","tsconfig"]\n' +
            '{"id":3,"title":"Generics"}\n' +
            '{"status":"draft"}\n' +
            '["draft","published"]\n' +
            '[1,4]\n' +
            '["120","450","900"]',
          sampleSolution:
            'function pluck<T, K extends keyof T>(rows: readonly T[], key: K): T[K][] {\n' +
            '  return rows.map((row) => row[key]);\n' +
            '}\n' +
            '\n' +
            'function pickFields<T, K extends keyof T>(row: T, keys: readonly K[]): Pick<T, K> {\n' +
            '  // `as` một lần ở đây là cái giá của việc dựng dần một object rỗng;\n' +
            '  // mọi phép ghi bên dưới vẫn được kiểm nhờ K extends keyof T.\n' +
            '  const out = {} as Pick<T, K>;\n' +
            '  for (const k of keys) out[k] = row[k];\n' +
            '  return out;\n' +
            '}\n' +
            '\n' +
            'function indexBy<T, K extends keyof T>(rows: readonly T[], key: K): Record<string, T[]> {\n' +
            '  const out: Record<string, T[]> = {};\n' +
            '  for (const row of rows) {\n' +
            '    const bucket = String(row[key]);\n' +
            '    if (out[bucket] === undefined) out[bucket] = [];\n' +
            '    out[bucket].push(row);\n' +
            '  }\n' +
            '  return out;\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Parse the environment once, at the boundary (chapters 5 + 8 + 11).</b> <code>process.env</code> is <code>Record&lt;string, string | undefined&gt;</code>: every value is text and every read may be missing. Implement <code>loadConfig(env)</code>, which turns that into a fully-typed <code>AppConfig</code> — or into a list of everything wrong with it.</p>' +
            '<ul>' +
            '<li><code>PORT</code> — required. <code>Number(...)</code> must be an integer in 1…65535. Missing → <code>&quot;PORT: missing&quot;</code>; present but bad → <code>&quot;PORT: not a port number (&lt;raw&gt;)&quot;</code>.</li>' +
            '<li><code>NODE_ENV</code> — required, and one of <code>dev</code> / <code>prod</code>. Missing → <code>&quot;NODE_ENV: missing&quot;</code>; wrong value → <code>&quot;NODE_ENV: not one of dev/prod (&lt;raw&gt;)&quot;</code>.</li>' +
            '<li><code>LOG_LEVEL</code> — optional, defaults to <code>&quot;info&quot;</code>. If present it must be <code>info</code> or <code>debug</code>; otherwise <code>&quot;LOG_LEVEL: not one of info/debug (&lt;raw&gt;)&quot;</code>.</li>' +
            '<li><code>FLAGS</code> — optional, defaults to <code>[]</code>. Split on commas, trim each piece, drop the empty ones. Never an error.</li>' +
            '</ul>' +
            '<p>Collect <b>every</b> problem, in the order the fields are listed above — do not stop at the first. Return <code>{ ok: false, errors }</code> if the list is non-empty, otherwise <code>{ ok: true, config }</code> with the properties in the order <code>port</code>, <code>nodeEnv</code>, <code>logLevel</code>, <code>flags</code>. Keep the given types, data and printing loop exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 32 — Đọc biến môi trường một lần, ngay tại ranh giới (chương 5 + 8 + 11).</b> <code>process.env</code> là <code>Record&lt;string, string | undefined&gt;</code>: mọi giá trị đều là chữ và mọi phép đọc đều có thể thiếu. Hãy cài đặt <code>loadConfig(env)</code> để biến nó thành một <code>AppConfig</code> có kiểu đầy đủ — hoặc thành danh sách mọi thứ đang sai.</p>' +
            '<ul>' +
            '<li><code>PORT</code> — bắt buộc. <code>Number(...)</code> phải là số nguyên trong 1…65535. Thiếu → <code>&quot;PORT: missing&quot;</code>; có mà sai → <code>&quot;PORT: not a port number (&lt;giá trị thô&gt;)&quot;</code>.</li>' +
            '<li><code>NODE_ENV</code> — bắt buộc, và phải là <code>dev</code> hoặc <code>prod</code>. Thiếu → <code>&quot;NODE_ENV: missing&quot;</code>; sai giá trị → <code>&quot;NODE_ENV: not one of dev/prod (&lt;giá trị thô&gt;)&quot;</code>.</li>' +
            '<li><code>LOG_LEVEL</code> — tuỳ chọn, mặc định <code>&quot;info&quot;</code>. Nếu có thì phải là <code>info</code> hoặc <code>debug</code>; không thì <code>&quot;LOG_LEVEL: not one of info/debug (&lt;giá trị thô&gt;)&quot;</code>.</li>' +
            '<li><code>FLAGS</code> — tuỳ chọn, mặc định <code>[]</code>. Tách theo dấu phẩy, cắt khoảng trắng từng mẩu, bỏ các mẩu rỗng. Không bao giờ là lỗi.</li>' +
            '</ul>' +
            '<p>Gom <b>mọi</b> lỗi, theo đúng thứ tự các trường liệt kê ở trên — đừng dừng ở lỗi đầu tiên. Trả về <code>{ ok: false, errors }</code> nếu danh sách khác rỗng, ngược lại trả <code>{ ok: true, config }</code> với các thuộc tính theo thứ tự <code>port</code>, <code>nodeEnv</code>, <code>logLevel</code>, <code>flags</code>. Giữ nguyên phần kiểu, dữ liệu và vòng lặp in kết quả cho sẵn, và không cài thêm thư viện nào.</p>',
          ),
          language: 'typescript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'interface AppConfig {\n' +
            '  port: number;\n' +
            "  nodeEnv: 'dev' | 'prod';\n" +
            "  logLevel: 'info' | 'debug';\n" +
            '  flags: readonly string[];\n' +
            '}\n' +
            'type ConfigResult =\n' +
            '  | { ok: true; config: AppConfig }\n' +
            '  | { ok: false; errors: readonly string[] };\n' +
            '\n' +
            'type Env = Readonly<Record<string, string | undefined>>;\n' +
            '\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function loadConfig(env: Env): ConfigResult {\n' +
            '  // TODO\n' +
            '}\n' +
            '\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const CASES: Env[] = [\n' +
            "  { PORT: '3000', NODE_ENV: 'prod' },\n" +
            "  { PORT: '3000', NODE_ENV: 'dev', LOG_LEVEL: 'debug', FLAGS: ' a , b ,, c ' },\n" +
            "  { PORT: '0', NODE_ENV: 'prod' },\n" +
            "  { PORT: '80.5', NODE_ENV: 'staging' },\n" +
            '  {},\n' +
            "  { PORT: '8080', NODE_ENV: 'dev', LOG_LEVEL: 'trace', FLAGS: '' },\n" +
            '];\n' +
            'for (const env of CASES) console.log(JSON.stringify(loadConfig(env)));\n',
          expectedOutput:
            '{"ok":true,"config":{"port":3000,"nodeEnv":"prod","logLevel":"info","flags":[]}}\n' +
            '{"ok":true,"config":{"port":3000,"nodeEnv":"dev","logLevel":"debug","flags":["a","b","c"]}}\n' +
            '{"ok":false,"errors":["PORT: not a port number (0)"]}\n' +
            '{"ok":false,"errors":["PORT: not a port number (80.5)","NODE_ENV: not one of dev/prod (staging)"]}\n' +
            '{"ok":false,"errors":["PORT: missing","NODE_ENV: missing"]}\n' +
            '{"ok":false,"errors":["LOG_LEVEL: not one of info/debug (trace)"]}',
          sampleSolution:
            'function loadConfig(env: Env): ConfigResult {\n' +
            '  const errors: string[] = [];\n' +
            '\n' +
            '  const rawPort = env.PORT;\n' +
            '  let port = 0;\n' +
            '  if (rawPort === undefined) {\n' +
            "    errors.push('PORT: missing');\n" +
            '  } else {\n' +
            '    const n = Number(rawPort);\n' +
            "    if (!Number.isInteger(n) || n < 1 || n > 65535) errors.push('PORT: not a port number (' + rawPort + ')');\n" +
            '    else port = n;\n' +
            '  }\n' +
            '\n' +
            '  const rawEnvName = env.NODE_ENV;\n' +
            "  let nodeEnv: 'dev' | 'prod' = 'dev';\n" +
            "  if (rawEnvName === undefined) errors.push('NODE_ENV: missing');\n" +
            "  else if (rawEnvName !== 'dev' && rawEnvName !== 'prod') errors.push('NODE_ENV: not one of dev/prod (' + rawEnvName + ')');\n" +
            '  else nodeEnv = rawEnvName;   // đã thu hẹp về đúng literal union\n' +
            '\n' +
            '  const rawLevel = env.LOG_LEVEL;\n' +
            "  let logLevel: 'info' | 'debug' = 'info';\n" +
            '  if (rawLevel !== undefined) {\n' +
            "    if (rawLevel !== 'info' && rawLevel !== 'debug') errors.push('LOG_LEVEL: not one of info/debug (' + rawLevel + ')');\n" +
            '    else logLevel = rawLevel;\n' +
            '  }\n' +
            '\n' +
            '  const rawFlags = env.FLAGS;\n' +
            '  const flags = rawFlags === undefined\n' +
            '    ? []\n' +
            "    : rawFlags.split(',').map((f) => f.trim()).filter((f) => f !== '');\n" +
            '\n' +
            '  if (errors.length > 0) return { ok: false, errors };\n' +
            '  return { ok: true, config: { port, nodeEnv, logLevel, flags } };\n' +
            '}\n',
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
