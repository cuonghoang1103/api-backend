/**
 * TypeScript · Chương 7 · Quiz Chương 7 (10 câu tình huống về kiểu nâng cao). Slug GIỮ: typescript-7-5-quiz (bản cũ → 10 câu, 03/11/2026).
 * Mọi dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2) trong labflow-ts: demo7/ts-07-1 (hand-form drift 0 lỗi, Readonly TS2540, Record mapped),
 * demo7/ts-07-2 (Required -? TS2739, Mutable -readonly), demo7/ts-07-3 (infer element TS2322, NonNullable distributes TS2322, ReturnType),
 * demo7/ts-07-4 (template literal union, key remap getCode, typo event TS2820). Đáp án rải: A ×3 (2, 5, 8) · B ×3 (1, 6, 10) · C ×2 (4, 9) · D ×2 (3, 7).
 */
export default {
  title: 'Chapter 7 check — 10 scenario questions|||Kiểm tra Chương 7 — 10 câu tình huống',
  slug: 'typescript-7-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Chương 7: mapped types (hand-form trôi, Readonly, Record), modifier ánh xạ (Partial, Required với -?, Mutable với -readonly), conditional types & infer (element type, ReturnType, NonNullable distributes), và template literal types (tên sự kiện, key remapping, gõ sai ⇒ TS2820). Mọi dữ kiện đo thật bằng tsc 7.0.2 + Node 22.23.3, có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Check</span>
<h2>Chapter 7 check</h2>
<p class="lead">Ten scenarios on advanced types — mapped types, mapping modifiers, conditional types with <code>infer</code>, and template literal types. Every compiler message and runtime result comes from a real run (Node 22.23.3, tsc 7.0.2). Each answer explains why the right option is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write a mapped type and say how <code>Readonly</code> and <code>Record</code> are built from one.</li>
<li>I know what <code>+?</code>, <code>-?</code> and <code>-readonly</code> do.</li>
<li>I can read a conditional type and what <code>infer</code> captures.</li>
<li>I can build a string type from a union and know why a typo in it is a compile error.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Kiểm tra Chương 7</h2>
<p class="lead">Mười tình huống về kiểu nâng cao — mapped types, modifier ánh xạ, conditional types với <code>infer</code>, và template literal types. Mọi thông báo trình biên dịch và kết quả lúc chạy đều từ lần chạy thật (Node 22.23.3, tsc 7.0.2). Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được một mapped type và nói được <code>Readonly</code> với <code>Record</code> dựng từ nó thế nào.</li>
<li>Tôi biết <code>+?</code>, <code>-?</code> và <code>-readonly</code> làm gì.</li>
<li>Tôi đọc được một conditional type và <code>infer</code> bắt gì.</li>
<li>Tôi dựng được một kiểu chuỗi từ một union và biết vì sao gõ sai trong đó là lỗi biên dịch.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    passingScore: 70,
    questions: [
      {
        question: 'type Lab = { code: string; capacity: number; floor: number }. A teammate hand-writes type LabForm = { code: string; capacity: string } (a "string form"). What does tsc say, and what is the risk?|||type Lab = { code: string; capacity: number; floor: number }. Một đồng đội viết tay type LabForm = { code: string; capacity: string } (một "form chuỗi"). tsc nói gì, và rủi ro là gì?',
        options: [
          '0 errors — but LabForm has drifted (it is missing floor), and tsc cannot link two separate types; a mapped type { [K in keyof Lab]: string } stays in sync.|||0 lỗi — nhưng LabForm đã trôi (thiếu floor), và tsc không nối được hai kiểu riêng; một mapped type { [K in keyof Lab]: string } giữ đồng bộ.',
          'TS2741: LabForm is missing floor.|||TS2741: LabForm thiếu floor.',
          'TS2322: capacity types differ.|||TS2322: kiểu capacity khác nhau.',
          'It will not compile until LabForm extends Lab.|||Không biên dịch cho tới khi LabForm extends Lab.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo7/ts-07-1/drift): 0 errors. LabForm is a separate type with no link to Lab, so nothing reminds you it is out of date — the same drift that broke the seed in 5.4. A mapped type derives the form from Lab and gains new fields automatically. Options B/C assume tsc compares the two, but it does not.|||VI: Đo thật (demo7/ts-07-1/drift): 0 lỗi. LabForm là một kiểu riêng không liên kết với Lab, nên không gì nhắc nó đã cũ — cùng kiểu trôi làm vỡ seed ở 5.4. Một mapped type suy form từ Lab và tự có trường mới. Phương án B/C giả định tsc so hai cái, nhưng không.',
      },
      {
        question: 'type Frozen<T> = { readonly [K in keyof T]: T[K] }. const lab: Frozen<{ code: string; capacity: number }> = { code: \'BE-201\', capacity: 40 }; lab.capacity = 50. What happens?|||type Frozen<T> = { readonly [K in keyof T]: T[K] }. const lab: Frozen<{ code: string; capacity: number }> = { code: \'BE-201\', capacity: 40 }; lab.capacity = 50. Chuyện gì xảy ra?',
        options: [
          'It compiles; Frozen is just an alias.|||Biên dịch được; Frozen chỉ là một bí danh.',
          'TS2540: Cannot assign to \'capacity\' because it is a read-only property — Frozen is Readonly<T>.|||TS2540: Cannot assign to \'capacity\' because it is a read-only property — Frozen là Readonly<T>.',
          'A runtime TypeError.|||TypeError lúc chạy.',
          'TS2741.|||TS2741.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo7/ts-07-1/frozen): TS2540. Putting readonly in front of the mapped key makes every field read-only — this is exactly the built-in Readonly<T>. readonly is compile-time only, so there is no runtime freeze (option C); Object.freeze does that (2.2).|||VI: Đo thật (demo7/ts-07-1/frozen): TS2540. Đặt readonly trước khoá ánh xạ làm mọi trường chỉ đọc — đây đúng là Readonly<T> dựng sẵn. readonly chỉ có lúc biên dịch, nên không có đóng băng lúc chạy (phương án C); Object.freeze mới làm vậy (2.2).',
      },
      {
        question: 'type Patch<T> = { [K in keyof T]?: T[K] }. applyPatch(booking, { seats: 30 }) where Booking has four fields. Does it compile, and what built-in type is Patch?|||type Patch<T> = { [K in keyof T]?: T[K] }. applyPatch(booking, { seats: 30 }) với Booking có bốn trường. Có biên dịch không, và Patch là utility type dựng sẵn nào?',
        options: [
          'No — all four fields are required.|||Không — cả bốn trường bắt buộc.',
          'It compiles only if seats is the first field.|||Chỉ biên dịch nếu seats là trường đầu.',
          'TS2353 excess property.|||TS2353 thuộc tính thừa.',
          'Yes — the ? on every field makes it Partial<T>, so any subset is valid, exactly what a PATCH body needs.|||Có — dấu ? trên mọi trường làm nó Partial<T>, nên tập con nào cũng hợp lệ, đúng thứ một PATCH body cần.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo7/ts-07-2/partial): { seats: 30 } compiles. { [K in keyof T]?: T[K] } adds the optional modifier to every field — this is Partial<T>, the shape of an HTTP PATCH body. Option C would apply to a fresh literal against a non-optional type; here every field is optional.|||VI: Đo thật (demo7/ts-07-2/partial): { seats: 30 } biên dịch. { [K in keyof T]?: T[K] } thêm modifier optional cho mọi trường — đây là Partial<T>, dáng của một PATCH body HTTP. Phương án C áp cho một literal tươi với một kiểu non-optional; ở đây mọi trường optional.',
      },
      {
        question: 'type Draft = { title: string; body?: string }. type Complete<T> = { [K in keyof T]-?: T[K] }. const d: Complete<Draft> = { title: \'Hi\' }. What does tsc say?|||type Draft = { title: string; body?: string }. type Complete<T> = { [K in keyof T]-?: T[K] }. const d: Complete<Draft> = { title: \'Hi\' }. tsc nói gì?',
        options: [
          'Nothing — body is still optional.|||Không gì — body vẫn optional.',
          'TS2322.|||TS2322.',
          'TS2741: Property \'body\' is missing — the -? removed the optional modifier, so every field is now required (Required<T>).|||TS2741: Property \'body\' is missing — -? gỡ modifier optional, nên mọi trường giờ bắt buộc (Required<T>).',
          'TS2540.|||TS2540.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo7/ts-07-2/required): TS2741 (in the two-field version TS2739; the point is the same). -? removes the optional modifier, turning Draft into a type where body is required — the built-in Required<T>. The plain Draft accepted { title }, the mapped version does not.|||VI: Đo thật (demo7/ts-07-2/required): TS2741 (bản hai trường ra TS2739; ý nghĩa như nhau). -? gỡ modifier optional, biến Draft thành một kiểu mà body bắt buộc — Required<T> dựng sẵn. Draft trơn nhận { title }, bản ánh xạ thì không.',
      },
      {
        question: 'type ElementType<T> = T extends readonly (infer E)[] ? E : T. What is ElementType<number[]>, and what is ElementType<boolean>?|||type ElementType<T> = T extends readonly (infer E)[] ? E : T. ElementType<number[]> là gì, và ElementType<boolean> là gì?',
        options: [
          'number and boolean — infer E captures the element type of an array; a non-array falls to the : T branch.|||number và boolean — infer E bắt kiểu phần tử của một mảng; không phải mảng thì rơi vào nhánh : T.',
          'number[] and never.|||number[] và never.',
          'any and any.|||any và any.',
          'E and E.|||E và E.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo7/ts-07-3/element): assigning a string to ElementType<number[]> is TS2322 because it is number; ElementType<boolean> is boolean (not an array → the T branch). infer E declares a type variable in the extends pattern that captures the array\'s element type.|||VI: Đo thật (demo7/ts-07-3/element): gán một string cho ElementType<number[]> là TS2322 vì nó là number; ElementType<boolean> là boolean (không phải mảng → nhánh T). infer E khai một biến kiểu trong mẫu extends bắt kiểu phần tử của mảng.',
      },
      {
        question: 'type NoNull<T> = T extends null | undefined ? never : T. What is NoNull<string | null | undefined>?|||type NoNull<T> = T extends null | undefined ? never : T. NoNull<string | null | undefined> là gì?',
        options: [
          'never — the whole union matches.|||never — cả union khớp.',
          'string — the conditional distributes over the union, dropping null and undefined (this is NonNullable<T>).|||string — conditional distribute qua union, bỏ null và undefined (đây là NonNullable<T>).',
          'string | null | undefined — conditionals do not change unions.|||string | null | undefined — conditional không đổi union.',
          'null | undefined.|||null | undefined.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo7/ts-07-3/distrib): assigning null to NoNull<string | null | undefined> is TS2322 because the type is string. A conditional over a union is applied to each member separately — never | never | string — then joined. This distribution is NonNullable<T> and why conditionals over unions are powerful.|||VI: Đo thật (demo7/ts-07-3/distrib): gán null cho NoNull<string | null | undefined> là TS2322 vì kiểu là string. Một conditional qua union áp cho từng thành viên — never | never | string — rồi nối. Phép distribute này là NonNullable<T> và là vì sao conditional qua union mạnh.',
      },
      {
        question: 'type Return<F> = F extends (...args: never[]) => infer R ? R : never. checkSlot returns SlotResult. What is Return<typeof checkSlot>?|||type Return<F> = F extends (...args: never[]) => infer R ? R : never. checkSlot trả SlotResult. Return<typeof checkSlot> là gì?',
        options: [
          'The parameter types of checkSlot.|||Các kiểu tham số của checkSlot.',
          'never.|||never.',
          'SlotResult — infer R captures the type after the arrow; this is the built-in ReturnType<F>, and it tracks the function if it changes.|||SlotResult — infer R bắt kiểu sau mũi tên; đây là ReturnType<F> dựng sẵn, và nó bám theo hàm nếu hàm đổi.',
          'A compile error, because checkSlot is a value not a type.|||Một lỗi biên dịch, vì checkSlot là một giá trị không phải một kiểu.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo7/ts-07-3/ret): Return<typeof checkSlot> is SlotResult, used as { ok: true; minutes: 120 } and printed 120. typeof turns the value checkSlot into its type (1.3); infer R captures the return type. This is ReturnType<F>, which stays correct when checkSlot changes.|||VI: Đo thật (demo7/ts-07-3/ret): Return<typeof checkSlot> là SlotResult, dùng như { ok: true; minutes: 120 } và in 120. typeof biến giá trị checkSlot thành kiểu của nó (1.3); infer R bắt kiểu trả về. Đây là ReturnType<F>, vẫn đúng khi checkSlot đổi.',
      },
      {
        question: 'type BookingAction = \'created\' | \'confirmed\' | \'cancelled\'. type BookingEvent = (template) booking:ACTION for each action. const bad: BookingEvent = \'booking:creatd\'. What does tsc say?|||type BookingAction = \'created\' | \'confirmed\' | \'cancelled\'. type BookingEvent = (template) booking:ACTION cho mỗi action. const bad: BookingEvent = \'booking:creatd\'. tsc nói gì?',
        options: [
          'TS2820: Type \'"booking:creatd"\' is not assignable … Did you mean \'"booking:created"\'? — the event names are a closed union.|||TS2820: Type \'"booking:creatd"\' is not assignable … Did you mean \'"booking:created"\'? — tên sự kiện là một union đóng.',
          'Nothing — any string that starts with booking: is allowed.|||Không gì — chuỗi nào bắt đầu booking: đều được.',
          'TS2322 with no suggestion.|||TS2322 không kèm gợi ý.',
          'A runtime error when the event fires.|||Lỗi lúc chạy khi sự kiện phát.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo7/ts-07-4/typo): TS2820 with "Did you mean \'booking:created\'?". A template literal type over a union produces a finite set of literals, so a misspelling is refused with a suggestion. A plain string (option B) would accept it and the handler would silently never fire — the whole value of Lab 7\'s typed events.|||VI: Đo thật (demo7/ts-07-4/typo): TS2820 kèm "Did you mean \'booking:created\'?". Một template literal type qua một union sinh một tập literal hữu hạn, nên một lỗi gõ bị từ chối kèm gợi ý. Một string trơn (phương án B) sẽ nhận nó và handler âm thầm không chạy — chính giá trị của sự kiện có kiểu ở Lab 7.',
      },
      {
        question: 'const seats: Record<LabCode, number> where LabCode = \'BE-201\' | \'BE-202\' | \'AL-301\'. How is Record related to mapped types?|||const seats: Record<LabCode, number> với LabCode = \'BE-201\' | \'BE-202\' | \'AL-301\'. Record liên quan mapped types thế nào?',
        options: [
          'Record is unrelated; it is a special built-in.|||Record không liên quan; nó là một thứ dựng sẵn đặc biệt.',
          'Record is a runtime object, not a type.|||Record là một object lúc chạy, không phải một kiểu.',
          'Record<Keys, V> IS a mapped type — { [K in Keys]: V } — one entry per key in the union, so a missing lab is a compile error.|||Record<Keys, V> CHÍNH là một mapped type — { [K in Keys]: V } — một mục mỗi khoá trong union, nên thiếu một lab là lỗi biên dịch.',
          'Record only works with string keys at runtime.|||Record chỉ chạy với khoá chuỗi lúc chạy.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo7/ts-07-1/record): { [K in LabCode]: number } behaves as Record<LabCode, number> and reads seats[\'AL-301\'] as a number. Record is a mapped type over a union of keys — the closed table from 4.4 and 5.4, so leaving a lab out is a compile error.|||VI: Đo thật (demo7/ts-07-1/record): { [K in LabCode]: number } hành xử như Record<LabCode, number> và đọc seats[\'AL-301\'] là một number. Record là một mapped type qua một union khoá — bảng đóng của 4.4 và 5.4, nên bỏ sót một lab là lỗi biên dịch.',
      },
      {
        question: 'type Getters<T> = { [K in keyof T as (template) get+Capitalize<K>]: () => T[K] }. For Lab = { code: string; capacity: number }, what keys does Getters<Lab> have?|||type Getters<T> = { [K in keyof T as (template) get+Capitalize<K>]: () => T[K] }. Với Lab = { code: string; capacity: number }, Getters<Lab> có những khoá nào?',
        options: [
          'code and capacity, unchanged.|||code và capacity, không đổi.',
          'getCode and getCapacity, each a function returning the field — key remapping with as renames every property.|||getCode và getCapacity, mỗi cái một hàm trả về trường — key remapping với as đổi tên mọi thuộc tính.',
          'get, because the template collapses.|||get, vì mẫu bị gộp.',
          'It does not compile.|||Nó không biên dịch.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo7/ts-07-4/keyremap): Getters<Lab> has getCode() and getCapacity(), which returned \'BE-201\' and 40. [K in keyof T as NewKey] renames each key; combined with a template literal and Capitalize it builds getCode, getCapacity — how a library turns a shape into getX methods or onX handlers.|||VI: Đo thật (demo7/ts-07-4/keyremap): Getters<Lab> có getCode() và getCapacity(), trả \'BE-201\' và 40. [K in keyof T as NewKey] đổi tên mỗi khoá; kết hợp template literal và Capitalize nó dựng getCode, getCapacity — cách một thư viện biến một dáng thành method getX hay handler onX.',
      },
    ],
  },
};
