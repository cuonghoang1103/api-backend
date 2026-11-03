/**
 * TypeScript · Chương 6 · Quiz Chương 6 (10 câu tình huống về generics). Slug GIỮ: typescript-6-5-quiz (bản cũ → 10 câu, 03/11/2026).
 * Mọi dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2) trong labflow-ts: demo6/ts-06-1 (any mất kiểu, firstOf<T> giữ kiểu TS2551, firstOf([]) T=never TS2532),
 * demo6/ts-06-2 (item.id trên T không ràng buộc TS2339, getProp 'ghost' TS2345, User['role']=Role, constraint reject TS2345),
 * demo6/ts-06-3 (Result<number> default E=string, parameter property TS1294), demo6/ts-06-4 (parseJson<T> 0 lỗi dữ liệu sai, firstOf(['a','b'])=string, <const T> giữ literal).
 * Đáp án rải: A ×3 (câu 2, 6, 9) · B ×3 (1, 4, 10) · C ×2 (5, 8) · D ×2 (3, 7).
 */
export default {
  title: 'Chapter 6 check — 10 scenario questions|||Kiểm tra Chương 6 — 10 câu tình huống',
  slug: 'typescript-6-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Chương 6: vì sao generic (any mất kiểu, <T> giữ kiểu, suy kiểu), ràng buộc & keyof & indexed access (item.id trên T không ràng buộc, getProp key sai, User[\'role\']=Role), interface/class/default generic (Result<number>, parameter property TS1294), và generics thực chiến (generic chỉ-trả-về 0 lỗi dữ liệu sai, literal nới rộng, const type parameter). Mọi dữ kiện đo thật bằng tsc 7.0.2 + Node 22.23.3, có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Check</span>
<h2>Chapter 6 check</h2>
<p class="lead">Ten scenarios on generics — why they beat <code>any</code>, inference, constraints, <code>keyof</code> and indexed access, generic classes and defaults, and the real-world pitfalls. Every compiler message and runtime result comes from a real run (Node 22.23.3, tsc 7.0.2). Each answer explains why the right option is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say what a type parameter keeps that <code>any</code> throws away.</li>
<li>I know what a constraint lets me do, and what <code>keyof</code> / <code>T[K]</code> mean.</li>
<li>I can write a generic class and a default type parameter.</li>
<li>I can spot a return-only or needless generic, and know why literals widen.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Kiểm tra Chương 6</h2>
<p class="lead">Mười tình huống về generics — vì sao chúng hơn <code>any</code>, suy kiểu, ràng buộc, <code>keyof</code> và truy cập theo chỉ mục, class và mặc định generic, và các bẫy thực chiến. Mọi thông báo trình biên dịch và kết quả lúc chạy đều từ lần chạy thật (Node 22.23.3, tsc 7.0.2). Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được một tham số kiểu giữ gì mà <code>any</code> vứt đi.</li>
<li>Tôi biết một ràng buộc cho làm gì, và <code>keyof</code> / <code>T[K]</code> nghĩa là gì.</li>
<li>Tôi viết được một class generic và một tham số kiểu mặc định.</li>
<li>Tôi nhận ra một generic chỉ-trả-về hay thừa, và biết vì sao literal nới rộng.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    passingScore: 70,
    questions: [
      {
        question: 'function firstOf(arr: any[]): any { return arr[0]; }. A caller writes firstOf(users).name.toFixed(2) where name is a string. What happens?|||function firstOf(arr: any[]): any { return arr[0]; }. Người gọi viết firstOf(users).name.toFixed(2) với name là chuỗi. Chuyện gì xảy ra?',
        options: [
          'tsc reports TS2339: toFixed does not exist on string.|||tsc báo TS2339: toFixed không có trên string.',
          'tsc reports 0 errors; it crashes at runtime with "toFixed is not a function".|||tsc báo 0 lỗi; sập lúc chạy với "toFixed is not a function".',
          'tsc reports TS2345.|||tsc báo TS2345.',
          'It prints NaN.|||Nó in NaN.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo6/ts-06-1/anyv): tsc exit 0, then "TypeError: u.name.toFixed is not a function". Because firstOf returns any, every property and method call is accepted — any turns checking off (1.4). The type is lost on the way out, so a wrong call survives to runtime. A generic would have kept User and refused it.|||VI: Đo thật (demo6/ts-06-1/anyv): tsc exit 0, rồi "TypeError: u.name.toFixed is not a function". Vì firstOf trả any, mọi lời gọi thuộc tính/method đều được nhận — any tắt kiểm (1.4). Kiểu mất trên đường ra, nên một lời gọi sai sống tới lúc chạy. Một generic sẽ giữ User và từ chối.',
      },
      {
        question: 'function firstOf<T>(arr: T[]): T | undefined. const u = firstOf(users); console.log(u?.emial). What does tsc report? (users is User[])|||function firstOf<T>(arr: T[]): T | undefined. const u = firstOf(users); console.log(u?.emial). tsc báo gì? (users là User[])',
        options: [
          'TS2551: Property \'emial\' does not exist on type \'User\'. Did you mean \'email\'?|||TS2551: Property \'emial\' does not exist on type \'User\'. Did you mean \'email\'?',
          'Nothing — u is User | undefined so any property is allowed.|||Không gì — u là User | undefined nên thuộc tính nào cũng được.',
          'TS18048: u is possibly undefined.|||TS18048: u có thể undefined.',
          'TS2339 with no suggestion.|||TS2339 không kèm gợi ý.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo6/ts-06-1/generic): TS2551 with "Did you mean \'email\'?". The type parameter T is inferred as User from the array, so firstOf(users) is User | undefined and the exact shape is kept — a typo is caught, with a suggestion. Option C is what the ?. already handles; the error here is the misspelling.|||VI: Đo thật (demo6/ts-06-1/generic): TS2551 kèm "Did you mean \'email\'?". Tham số kiểu T được suy là User từ mảng, nên firstOf(users) là User | undefined và dáng chính xác được giữ — lỗi gõ bị bắt, kèm gợi ý. Phương án C là thứ ?. đã xử lý; lỗi ở đây là gõ sai.',
      },
      {
        question: 'const b = firstOf(["BE-201", "AL-301"]) (firstOf<T>(arr: readonly T[]): T | undefined). What is the type of b, and how do you keep the exact codes?|||const b = firstOf(["BE-201", "AL-301"]) (firstOf<T>(arr: readonly T[]): T | undefined). Kiểu của b là gì, và làm sao giữ đúng các mã?',
        options: [
          'b is \'BE-201\' | \'AL-301\' | undefined already.|||b đã là \'BE-201\' | \'AL-301\' | undefined.',
          'b is any.|||b là any.',
          'tsc refuses the call without a type argument.|||tsc từ chối lời gọi khi không có đối số kiểu.',
          'b is string | undefined (literals widened); add as const at the call, or make it firstOf<const T>.|||b là string | undefined (literal bị nới); thêm as const ở lời gọi, hoặc để firstOf<const T>.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo6/ts-06-4/widen and constp): b is string | undefined because a plain array literal widens its elements, so T = string. as const at the call keeps the literals; a const type parameter (firstOf<const T>, TS 5.0+) keeps them with no as const. Option A is only true once you do one of those.|||VI: Đo thật (demo6/ts-06-4/widen và constp): b là string | undefined vì một mảng literal thường nới rộng phần tử, nên T = string. as const ở lời gọi giữ literal; một const type parameter (firstOf<const T>, TS 5.0+) giữ chúng mà không cần as const. Phương án A chỉ đúng khi bạn làm một trong hai.',
      },
      {
        question: 'function byId<T>(items: T[], id: number) { return items.find((x) => x.id === id); }. What does tsc report?|||function byId<T>(items: T[], id: number) { return items.find((x) => x.id === id); }. tsc báo gì?',
        options: [
          'Nothing — T could have an id.|||Không gì — T có thể có id.',
          'TS2339: Property \'id\' does not exist on type \'T\' — add a constraint T extends { id: number }.|||TS2339: Property \'id\' does not exist on type \'T\' — thêm ràng buộc T extends { id: number }.',
          'TS2345.|||TS2345.',
          'TS2552: cannot find name \'id\'.|||TS2552: không tìm thấy tên \'id\'.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo6/ts-06-2/why): TS2339, "Property \'id\' does not exist on type \'T\'". An unconstrained T could be any type — most have no id — so tsc refuses the read. A constraint <T extends { id: number }> promises every T has a numeric id, and then item.id compiles (measured in fixed).|||VI: Đo thật (demo6/ts-06-2/why): TS2339, "Property \'id\' does not exist on type \'T\'". Một T không ràng buộc có thể là kiểu bất kỳ — phần lớn không có id — nên tsc từ chối phép đọc. Một ràng buộc <T extends { id: number }> hứa mọi T có id kiểu số, và khi đó item.id biên dịch (đo ở fixed).',
      },
      {
        question: 'function getProp<T, K extends keyof T>(obj: T, key: K): T[K]. getProp(user, \'ghost\') where User has no \'ghost\'. Result?|||function getProp<T, K extends keyof T>(obj: T, key: K): T[K]. getProp(user, \'ghost\') với User không có \'ghost\'. Kết quả?',
        options: [
          'It returns undefined at runtime; tsc is fine.|||Trả undefined lúc chạy; tsc không sao.',
          'TS2339.|||TS2339.',
          'TS2345: Argument of type \'"ghost"\' is not assignable to parameter of type \'keyof User\'.|||TS2345: Argument of type \'"ghost"\' is not assignable to parameter of type \'keyof User\'.',
          'TS7053.|||TS7053.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo6/ts-06-2/getprop-bad): TS2345, "not assignable to parameter of type keyof User". K extends keyof T forces the key argument to be a real property name, so a typo is a compile error — the same safety as a literal union, computed from the shape. The return type T[K] (indexed access) is the type of that property.|||VI: Đo thật (demo6/ts-06-2/getprop-bad): TS2345, "not assignable to parameter of type keyof User". K extends keyof T buộc đối số khoá phải là tên thuộc tính có thật, nên một lỗi gõ là lỗi biên dịch — cùng sự an toàn như union literal, tính từ dáng. Kiểu trả về T[K] (truy cập theo chỉ mục) là kiểu của thuộc tính đó.',
      },
      {
        question: 'type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E }. What does Result<number> mean?|||type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E }. Result<number> nghĩa là gì?',
        options: [
          'Result<number, string> — E uses its default of string.|||Result<number, string> — E dùng mặc định là string.',
          'An error, because E is required.|||Một lỗi, vì E là bắt buộc.',
          'Result<number, number>.|||Result<number, number>.',
          'Result<number, any>.|||Result<number, any>.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo6/ts-06-3/result): parseSeats returns Result<number> and compiles, with error typed string. A default type parameter (E = string) is used when the caller omits that argument, so the common case stays short. Override it — Result<number, Code> — when the error has structure (measured in override: a non-Code error is TS2322).|||VI: Đo thật (demo6/ts-06-3/result): parseSeats trả Result<number> và biên dịch, với error kiểu string. Một tham số kiểu mặc định (E = string) được dùng khi người gọi bỏ đối số đó, nên trường hợp hay gặp giữ ngắn. Đè nó — Result<number, Code> — khi lỗi có cấu trúc (đo ở override: một error không phải Code là TS2322).',
      },
      {
        question: 'Inside a class under the course tsconfig you write constructor(readonly value: T) {}. What does tsc report?|||Trong một class dưới tsconfig của khoá bạn viết constructor(readonly value: T) {}. tsc báo gì?',
        options: [
          'Nothing — parameter properties are standard.|||Không gì — parameter property là chuẩn.',
          'TS2554: wrong number of arguments.|||TS2554: sai số lượng đối số.',
          'TS2339.|||TS2339.',
          'TS1294: This syntax is not allowed when \'erasableSyntaxOnly\' is enabled.|||TS1294: This syntax is not allowed when \'erasableSyntaxOnly\' is enabled.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo6/ts-06-3/paramprop): TS1294. A parameter property (readonly value) EMITS an assignment, so it is not type-only, and the course config has erasableSyntaxOnly on so Node can run .ts by stripping types (0.4). Write the field and assign it in the constructor body instead — like enum and namespace, parameter properties are refused.|||VI: Đo thật (demo6/ts-06-3/paramprop): TS1294. Một parameter property (readonly value) SINH RA một phép gán, nên không phải chỉ-kiểu, và tsconfig của khoá bật erasableSyntaxOnly để Node chạy .ts bằng cách bỏ kiểu (0.4). Hãy viết field và gán trong thân constructor — như enum và namespace, parameter property bị từ chối.',
      },
      {
        question: 'function parseJson<T>(text: string): T { return JSON.parse(text); }. const users = parseJson<User[]>(\'[{"id":"oops"}]\'). What does tsc report?|||function parseJson<T>(text: string): T { return JSON.parse(text); }. const users = parseJson<User[]>(\'[{"id":"oops"}]\'). tsc báo gì?',
        options: [
          '0 errors — but nothing is checked: at runtime users[0].id is the string "oops" where a number was promised.|||0 lỗi — nhưng không gì được kiểm: lúc chạy users[0].id là chuỗi "oops" ở chỗ hứa một number.',
          'TS2322: the JSON does not match User[].|||TS2322: JSON không khớp User[].',
          'TS2345.|||TS2345.',
          'A runtime SyntaxError.|||SyntaxError lúc chạy.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo6/ts-06-4/returnonly): 0 errors, prints "oops". T appears only in the return type, so tsc has nothing to check it against — parseJson<User[]>(…) is a cast in disguise, exactly as unsafe as JSON.parse(…) as User[] (1.4). For outside data, return unknown and narrow with a real guard; a generic must not promise a type nobody verified.|||VI: Đo thật (demo6/ts-06-4/returnonly): 0 lỗi, in "oops". T chỉ ở kiểu trả về, nên tsc chẳng có gì để kiểm — parseJson<User[]>(…) là một phép ép kiểu trá hình, không an toàn y như JSON.parse(…) as User[] (1.4). Với dữ liệu ngoài, trả unknown và narrow bằng một guard thật; một generic không được hứa một kiểu không ai kiểm.',
      },
      {
        question: 'groupBy<T, K>(items: readonly T[], keyFn: (item: T) => K): Map<K, T[]>. You call groupBy(users, (u) => u.role) with no type arguments. What is the result type?|||groupBy<T, K>(items: readonly T[], keyFn: (item: T) => K): Map<K, T[]>. Bạn gọi groupBy(users, (u) => u.role) không đối số kiểu. Kiểu kết quả là gì?',
        options: [
          'Map<Role, User[]> — T is inferred as User and K as Role.|||Map<Role, User[]> — T được suy là User và K là Role.',
          'Map<any, any[]>.|||Map<any, any[]>.',
          'It will not compile without groupBy<User, Role>(…).|||Không biên dịch nếu thiếu groupBy<User, Role>(…).',
          'Map<string, User[]>.|||Map<string, User[]>.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo6/ts-06-4/infer): the keys are STUDENT/LECTURER and byRole.get(\'STUDENT\') is User[] | undefined. Inference fills both parameters — T = User from the array, K = Role from the key function\'s return — so no type arguments are needed. Option D would be the type only if role were plain string; here it is the literal union Role.|||VI: Đo thật (demo6/ts-06-4/infer): khoá là STUDENT/LECTURER và byRole.get(\'STUDENT\') là User[] | undefined. Suy kiểu điền cả hai tham số — T = User từ mảng, K = Role từ kiểu trả về của hàm khoá — nên không cần đối số kiểu. Phương án D chỉ đúng nếu role là string thường; ở đây là union literal Role.',
      },
      {
        question: 'A teammate writes function count<T>(items: T[]): number { return items.length; }. What is the problem?|||Một đồng đội viết function count<T>(items: T[]): number { return items.length; }. Vấn đề là gì?',
        options: [
          'It will not compile.|||Nó không biên dịch.',
          'T is used only once and never reaches the result — a needless type parameter; count(items: readonly unknown[]): number is honest and shorter.|||T chỉ dùng một lần và không tới kết quả — một tham số kiểu thừa; count(items: readonly unknown[]): number trung thực và ngắn hơn.',
          'It needs a constraint T extends { length: number }.|||Cần ràng buộc T extends { length: number }.',
          'It should return T, not number.|||Nên trả T, không phải number.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo6/ts-06-4/needless): countGeneric<T> and count(readonly unknown[]) behave identically. A type parameter earns its keep only when it connects parts of the signature — usually input to output. Here T is used once and the result is always number, so the generic is noise. Rule of thumb: a type parameter used exactly once is not needed.|||VI: Đo thật (demo6/ts-06-4/needless): countGeneric<T> và count(readonly unknown[]) hành xử y hệt. Một tham số kiểu chỉ đáng khi nối các phần của chữ ký — thường là in→out. Ở đây T dùng một lần và kết quả luôn là number, nên generic là nhiễu. Quy tắc: một tham số kiểu dùng đúng một lần thì không cần.',
      },
    ],
  },
};
