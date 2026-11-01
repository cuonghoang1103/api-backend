/**
 * TypeScript · Chương 3 · Quiz Chương 3 (10 câu tình huống trên bộ luật đặt phòng LabFlow). Slug GIỮ từ bản cũ: typescript-3-5-quiz (bản cũ 8 câu → 10 câu, 01/11/2026).
 * Mọi dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2) trong labflow-ts: demo3/ts-03-5/q.ts (TS2554 với tham số "| undefined", mặc định không thay null,
 * ['08','09','10'].map(parseInt) = [8, NaN, 2] mà tsc im lặng), demo3/ts-03-5/async.ts (hàm async ở chỗ callback void: tsc 0 lỗi, Node in "request handled"
 * rồi chết exit 1 vì promise bị từ chối không ai bắt), máy chấm Lab 3 (S1 TS2322, S3 TS2322, S4 TS2769, S8 TS2684; bản khởi đầu E 2/8).
 * Đáp án rải: A ×3 (câu 2, 6, 10) · B ×2 (4, 8) · C ×3 (1, 5, 9) · D ×2 (3, 7).
 */
export default {
  title: 'Chapter 3 check — 10 scenario questions|||Kiểm tra Chương 3 — 10 câu tình huống',
  slug: 'typescript-3-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống trên bộ luật đặt phòng LabFlow về Chương 3: tham số "| undefined" vẫn bắt buộc, giá trị mặc định không thay null, tham số rest, map(parseInt) ra [8, NaN, 2], luật nhận ít tham số hơn vẫn hợp lệ, kiểu Function, overload thay cho union trả về, TS2769, hàm async ở chỗ callback void làm sập Node, và this bị mất khi tách phương thức — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Check</span>
<h2>Chapter 3 check</h2>
<p class="lead">Ten scenarios on LabFlow’s booking rules — functions, callbacks, overloads and <code>this</code>. Every compiler message and runtime result in them comes from a real run (Node 22.23.3, tsc 7.0.2). Each answer explains why the right option is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can choose between an optional parameter, a default value and a rest parameter, and I know what a default does with <code>null</code>.</li>
<li>I can write a function type such as <code>type Rule = (input: BookingInput) =&gt; Problem | null</code> and say which functions fit it.</li>
<li>I know when overloads beat a union return type, and how to read TS2769.</li>
<li>I can explain why <code>const run = v.run; run(input)</code> crashes and how a <code>this</code> parameter stops it.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Kiểm tra Chương 3</h2>
<p class="lead">Mười tình huống trên bộ luật đặt phòng của LabFlow — hàm, callback, overload và <code>this</code>. Mọi thông báo của trình biên dịch và kết quả lúc chạy trong câu hỏi đều lấy từ lần chạy thật (Node 22.23.3, tsc 7.0.2). Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chọn được giữa tham số tuỳ chọn, giá trị mặc định và tham số rest, và biết giá trị mặc định làm gì với <code>null</code>.</li>
<li>Tôi viết được kiểu hàm như <code>type Rule = (input: BookingInput) =&gt; Problem | null</code> và nói được hàm nào khớp với nó.</li>
<li>Tôi biết khi nào overload tốt hơn kiểu trả về union, và đọc được TS2769.</li>
<li>Tôi giải thích được vì sao <code>const run = v.run; run(input)</code> sập và tham số <code>this</code> chặn nó thế nào.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    passingScore: 70,
    questions: [
      {
        question: 'function describeSeats(seats: number, note: string | undefined) { … } and a teammate calls describeSeats(30). What does tsc say?|||function describeSeats(seats: number, note: string | undefined) { … } và bạn cùng nhóm gọi describeSeats(30). tsc nói gì?',
        options: [
          'Nothing — note may be undefined, and a missing argument is undefined.|||Không gì — note có thể là undefined, mà đối số thiếu thì là undefined.',
          'TS2345: Argument of type \'undefined\' is not assignable to parameter of type \'string\'.|||TS2345: Argument of type \'undefined\' is not assignable to parameter of type \'string\'.',
          'TS2554: Expected 2 arguments, but got 1 — "| undefined" describes the value, not whether the argument may be left out; write note?: string for that.|||TS2554: Expected 2 arguments, but got 1 — "| undefined" mô tả giá trị, không nói đối số được phép bỏ; muốn vậy phải viết note?: string.',
          'TS1016: A required parameter cannot follow an optional parameter.|||TS1016: A required parameter cannot follow an optional parameter.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo3/ts-03-5/q.ts line 5): TS2554. A parameter of type string | undefined is still required — the caller must write describeSeats(30, undefined). Option A is how JavaScript behaves, which is exactly why the two spellings mean different things in TypeScript: ?: is "may be omitted", | undefined is "may hold undefined".|||VI: Đo thật (demo3/ts-03-5/q.ts dòng 5): TS2554. Tham số kiểu string | undefined vẫn bắt buộc — người gọi phải viết describeSeats(30, undefined). Phương án A là cách JavaScript hành xử, và chính vì vậy hai cách viết mang nghĩa khác nhau trong TypeScript: ?: là "được bỏ qua", | undefined là "được chứa undefined".',
      },
      {
        question: 'function label(lab: string, note: string | null = \'(no note)\'). The database returns note: null for a booking, and the code calls label(\'BE-201\', row.note). What is printed?|||function label(lab: string, note: string | null = \'(no note)\'). CSDL trả note: null cho một lượt đặt, và code gọi label(\'BE-201\', row.note). Kết quả in ra là gì?',
        options: [
          '"BE-201: null" — a default value replaces only undefined (or a missing argument), never null. Use note ?? \'(no note)\' inside the function for NULL from a database.|||"BE-201: null" — giá trị mặc định chỉ thay undefined (hoặc đối số bị thiếu), không bao giờ thay null. Với NULL từ CSDL, dùng note ?? \'(no note)\' bên trong hàm.',
          '"BE-201: (no note)" — the default covers both null and undefined.|||"BE-201: (no note)" — giá trị mặc định áp cho cả null lẫn undefined.',
          'tsc refuses the call because null is not a string.|||tsc từ chối lời gọi vì null không phải string.',
          'A TypeError, because null cannot be concatenated.|||Một TypeError, vì không nối chuỗi được với null.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured: label(\'BE-201\') and label(\'BE-201\', undefined) print "(no note)", label(\'BE-201\', null) prints "BE-201: null". Option B is the common belief; it is wrong in JavaScript itself, and TypeScript does not change runtime behaviour. Option C would be true only without "| null" in the parameter type.|||VI: Đo thật: label(\'BE-201\') và label(\'BE-201\', undefined) in "(no note)", label(\'BE-201\', null) in "BE-201: null". Phương án B là điều nhiều người tin; nó sai ngay trong JavaScript, và TypeScript không đổi hành vi lúc chạy. Phương án C chỉ đúng nếu kiểu tham số không có "| null".',
      },
      {
        question: 'totalMinutes(...ranges: TimeRange[]): number. Which call does tsc accept?|||totalMinutes(...ranges: TimeRange[]): number. tsc chấp nhận lời gọi nào?',
        options: [
          'totalMinutes([480, 600], 720)|||totalMinutes([480, 600], 720)',
          'totalMinutes(480, 600)|||totalMinutes(480, 600)',
          'totalMinutes([480, 600, 660])|||totalMinutes([480, 600, 660])',
          'totalMinutes() — a rest parameter may receive zero arguments; the function sees an empty array and returns 0.|||totalMinutes() — tham số rest có thể nhận không đối số nào; hàm thấy một mảng rỗng và trả 0.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Every argument must be a TimeRange — exactly two numbers. A: 720 is not a range (Lab 3, S6: TS2345; the untyped starter crashed with ".for is not iterable"). B: two plain numbers. C: three numbers in one range (Chapter 2, TS2322 "Source has 3 element(s)"). Zero ranges is a valid call, and Lab 3\'s correct uses rely on it.|||VI: Mỗi đối số phải là một TimeRange — đúng hai số. A: 720 không phải khoảng giờ (Lab 3, S6: TS2345; bản khởi đầu không kiểu sập với ".for is not iterable"). B: hai số trơn. C: ba số trong một khoảng (Chương 2, TS2322 "Source has 3 element(s)"). Không khoảng nào là lời gọi hợp lệ, và các cách dùng đúng của Lab 3 dựa vào điều đó.',
      },
      {
        question: 'A teammate converts hour strings with [\'08\', \'09\', \'10\'].map(parseInt). tsc reports nothing. What does Node print?|||Bạn cùng nhóm đổi chuỗi giờ bằng [\'08\', \'09\', \'10\'].map(parseInt). tsc không báo gì. Node in ra gì?',
        options: [
          '[ 8, 9, 10 ]|||[ 8, 9, 10 ]',
          '[ 8, NaN, 2 ] — map passes (value, index, array) and parseInt\'s second parameter is the radix, so \'09\' is read in base 1 and \'10\' in base 2. It type-checks because parseInt(string, radix?: number) fits (value: string, index: number). Write map((h) => parseInt(h, 10)).|||[ 8, NaN, 2 ] — map truyền (value, index, array) mà tham số thứ hai của parseInt là cơ số, nên \'09\' bị đọc theo cơ số 1 và \'10\' theo cơ số 2. Nó qua được kiểm kiểu vì parseInt(string, radix?: number) khớp (value: string, index: number). Viết map((h) => parseInt(h, 10)).',
          'tsc should have reported TS2345, so the output is undefined.|||tsc lẽ ra phải báo TS2345, nên output là undefined.',
          '[ NaN, NaN, NaN ]|||[ NaN, NaN, NaN ]',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured: [ 8, NaN, 2 ]. The types are all compatible — a number really is passed as the radix — so the checker has nothing to object to. Types prove that the shapes fit, not that the meaning is right; a passing callback with an extra optional parameter is exactly this kind of hole.|||VI: Đo thật: [ 8, NaN, 2 ]. Mọi kiểu đều tương thích — một con số thật sự được truyền làm cơ số — nên trình kiểm không có gì để phản đối. Kiểu chứng minh hình dạng khớp, không chứng minh ý nghĩa đúng; một callback có thêm tham số tuỳ chọn chính là loại lỗ hổng này.',
      },
      {
        question: 'type Rule = (input: BookingInput) => Problem | null. Which of these can go into a readonly Rule[]?|||type Rule = (input: BookingInput) => Problem | null. Hàm nào dưới đây đặt được vào một readonly Rule[]?',
        options: [
          '(seats: number) => null|||(seats: number) => null',
          '() => \'TOO_LONG\'|||() => \'TOO_LONG\'',
          '() => null — a function may ignore parameters it is given (fewer parameters is fine), and null is an allowed result.|||() => null — một hàm được phép bỏ qua tham số người ta đưa (ít tham số hơn là được), và null là kết quả hợp lệ.',
          '(input: BookingInput, strict: boolean) => null|||(input: BookingInput, strict: boolean) => null',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Fewer parameters is safe: the caller passes the input and the function simply ignores it. A is Lab 3\'s S1 (TS2322 "Types of parameters \'seats\' and \'input\' are incompatible"); B is S2 (a string is not a Problem); D needs a second argument that validate never passes. A is the tempting one because "the rule only needs seats" — but it receives the whole request.|||VI: Ít tham số hơn là an toàn: người gọi truyền input và hàm chỉ việc bỏ qua. A là S1 của Lab 3 (TS2322 "Types of parameters \'seats\' and \'input\' are incompatible"); B là S2 (chuỗi không phải Problem); D cần đối số thứ hai mà validate không bao giờ truyền. A hấp dẫn vì "luật chỉ cần seats" — nhưng nó nhận cả yêu cầu.',
      },
      {
        question: 'Lab 3\'s starter declared type Rule = Function and rules: Rule[]. tsc reported only 2 errors. How many of the 8 wrong uses did it refuse?|||Bản khởi đầu của Lab 3 khai type Rule = Function và rules: Rule[]. tsc chỉ báo 2 lỗi. Nó từ chối được bao nhiêu trong 8 cách dùng sai?',
        options: [
          '2 of 8 — Function accepts any arguments and returns any, so an array of Function takes any function; few errors meant little checking.|||2 trên 8 — Function nhận đối số gì cũng được và trả any, nên mảng Function nhận mọi hàm; ít lỗi nghĩa là ít được kiểm.',
          '8 of 8 — Function is a strict type.|||8 trên 8 — Function là một kiểu chặt.',
          '0 of 8, because Function is the same as unknown.|||0 trên 8, vì Function giống unknown.',
          '6 of 8 — only the overload lines slip through.|||6 trên 8 — chỉ các dòng về overload lọt.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured: E 2/8 (score 1/10). Only S3 (a union return into a number) and S7 (a missing argument) were refused. Function is not unknown (option C): you may call it, and the call returns any — it is the function-shaped cousin of any. 6 of 8 (option D) is what attempt B reached with a real Rule type.|||VI: Đo thật: E 2/8 (điểm 1/10). Chỉ S3 (kiểu trả về union gán vào number) và S7 (thiếu đối số) bị từ chối. Function không phải unknown (phương án C): bạn được gọi nó, và lời gọi trả any — nó là anh em hình-hàm của any. 6 trên 8 (phương án D) là mức lần thử B đạt được với kiểu Rule thật.',
      },
      {
        question: 'toMinutes(value: string | string[]): number | number[]. A caller writes const start: number = toMinutes(\'08:00\'). Why is it refused, and what is the fix?|||toMinutes(value: string | string[]): number | number[]. Người gọi viết const start: number = toMinutes(\'08:00\'). Vì sao bị từ chối, và sửa thế nào?',
        options: [
          'Because \'08:00\' is not a valid time.|||Vì \'08:00\' không phải giờ hợp lệ.',
          'Because a const cannot hold a function result.|||Vì const không chứa được kết quả hàm.',
          'Because number is not assignable to number[] — swap the order of the union.|||Vì number không gán được cho number[] — đổi thứ tự union.',
          'The return type does not depend on the argument, so every caller gets number | number[] (TS2322). Overload signatures — (text: string): number and (texts: readonly string[]): number[] — tell each caller the precise result.|||Kiểu trả về không phụ thuộc đối số, nên mọi người gọi nhận number | number[] (TS2322). Chữ ký overload — (text: string): number và (texts: readonly string[]): number[] — cho mỗi người gọi biết chính xác kết quả.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured in Lab 3 part B: "Type \'number | number[]\' is not assignable to type \'number\'". A union return makes every caller narrow a value that, for this input, can only be a number. When the return type really does depend on the argument type, overloads (or generics, Chapter 6) are the honest description. The order of a union (option C) never matters.|||VI: Đo ở phần B của Lab 3: "Type \'number | number[]\' is not assignable to type \'number\'". Kiểu trả về union bắt mọi người gọi thu hẹp một giá trị mà, với đầu vào này, chỉ có thể là số. Khi kiểu trả về thật sự phụ thuộc kiểu đối số, overload (hoặc generics, Chương 6) là cách mô tả trung thực. Thứ tự trong union (phương án C) không bao giờ quan trọng.',
      },
      {
        question: 'With the two overloads of toMinutes, someone calls toMinutes(480). Which message does tsc 7 print?|||Với hai overload của toMinutes, ai đó gọi toMinutes(480). tsc 7 in thông báo nào?',
        options: [
          'TS2345 against the implementation signature (value: string | readonly string[]).|||TS2345 so với chữ ký cài đặt (value: string | readonly string[]).',
          'TS2769: No overload matches this call — followed by the error from the last overload tried ("Argument of type \'number\' is not assignable to parameter of type \'readonly string[]\'").|||TS2769: No overload matches this call — kèm lỗi của overload cuối cùng được thử ("Argument of type \'number\' is not assignable to parameter of type \'readonly string[]\'").',
          'Nothing; the implementation accepts numbers at runtime.|||Không gì; phần cài đặt nhận số lúc chạy.',
          'TS2554: Expected 2 arguments, but got 1.|||TS2554: Expected 2 arguments, but got 1.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured on Lab 3\'s S4: TS2769, "The last overload gave the following error", then the readonly string[] mismatch. Callers never see the implementation signature, so option A cannot happen — attempt B, which had no overloads, is the one that produced TS2345. Read TS2769 from the bottom: the last line names the overload tsc tried last.|||VI: Đo ở S4 của Lab 3: TS2769, "The last overload gave the following error", rồi lỗi lệch readonly string[]. Người gọi không bao giờ thấy chữ ký cài đặt, nên phương án A không thể xảy ra — lần thử B, thứ không có overload, mới là cái ra TS2345. Đọc TS2769 từ dưới lên: dòng cuối gọi tên overload mà tsc thử sau cùng.',
      },
      {
        question: 'validate(onProblem: (p: Problem) => void) receives saveToAuditLog, an async function that throws because the audit database is down. tsc reports nothing. What happens when the file runs?|||validate(onProblem: (p: Problem) => void) nhận saveToAuditLog, một hàm async ném lỗi vì CSDL nhật ký đang sập. tsc không báo gì. Chạy tệp thì chuyện gì xảy ra?',
        options: [
          'The error is thrown inside validate and caught by its caller as usual.|||Lỗi bị ném bên trong validate và người gọi bắt được như bình thường.',
          'Nothing — a void callback\'s result is ignored, including errors.|||Không gì — kết quả của callback void bị bỏ qua, kể cả lỗi.',
          'validate finishes and "request handled" is printed, then the rejected promise nobody awaited crashes Node 22 with the error and exit code 1.|||validate chạy xong và in "request handled", rồi promise bị từ chối mà không ai await làm Node 22 sập với lỗi đó và exit code 1.',
          'tsc should have reported TS2322, so it cannot run.|||tsc lẽ ra phải báo TS2322, nên không chạy được.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo3/ts-03-5/async.ts): tsc 0 errors; Node prints "validate finished", "request handled", then the stack of "audit database is down" and exits 1. A () => void slot accepts a function returning Promise<void> because void means "the result is ignored" — but an ignored promise that rejects is an unhandled rejection, which Node 15+ treats as a crash. Option B is exactly the misunderstanding: void ignores the value, not the failure.|||VI: Đo thật (demo3/ts-03-5/async.ts): tsc 0 lỗi; Node in "validate finished", "request handled", rồi stack của "audit database is down" và thoát với mã 1. Chỗ () => void nhận hàm trả Promise<void> vì void nghĩa là "kết quả bị bỏ qua" — nhưng một promise bị bỏ qua mà bị từ chối là unhandled rejection, thứ Node 15+ coi là sập. Phương án B chính là hiểu lầm đó: void bỏ qua giá trị, không bỏ qua thất bại.',
      },
      {
        question: 'createValidator(RULES) returns { rules, run(input) { return validate(input, this.rules); } }. Code passes it as a callback: const run = v.run; run(input). What happens, and what makes tsc catch it?|||createValidator(RULES) trả về { rules, run(input) { return validate(input, this.rules); } }. Code truyền nó làm callback: const run = v.run; run(input). Chuyện gì xảy ra, và cái gì khiến tsc bắt được?',
        options: [
          'TypeError: Cannot read properties of undefined (reading \'rules\') — called alone, run has no this (modules run in strict mode). Declaring run(this: Validator, input) makes tsc refuse the call with TS2684.|||TypeError: Cannot read properties of undefined (reading \'rules\') — gọi đứng riêng thì run không có this (module chạy ở strict mode). Khai báo run(this: Validator, input) khiến tsc từ chối lời gọi với TS2684.',
          'It works: this always points to the object the function was defined in.|||Chạy được: this luôn trỏ tới object nơi hàm được định nghĩa.',
          'It works, because this falls back to globalThis, which has rules.|||Chạy được, vì this lùi về globalThis, nơi có rules.',
          'tsc refuses it already, without any change, with TS2683.|||tsc đã từ chối sẵn, không cần sửa gì, với TS2683.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured in Lab 3: the starter throws "Cannot read properties of undefined (reading \'rules\')"; with the this parameter, tsc reports TS2684 "The \'this\' context of type \'void\' is not assignable to method\'s \'this\' of type \'Validator\'". Option B describes arrow functions, not methods — this is decided by how a function is called. Option D is tempting, but attempt B (no this parameter) compiled the line without a word.|||VI: Đo ở Lab 3: bản khởi đầu ném "Cannot read properties of undefined (reading \'rules\')"; có tham số this thì tsc báo TS2684 "The \'this\' context of type \'void\' is not assignable to method\'s \'this\' of type \'Validator\'". Phương án B mô tả arrow function, không phải phương thức — this được quyết định bởi cách hàm được gọi. Phương án D hấp dẫn, nhưng lần thử B (không có tham số this) biên dịch dòng đó không một lời.',
      },
    ],
  },
};
