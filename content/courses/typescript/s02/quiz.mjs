/**
 * TypeScript · Chương 2 · Quiz Chương 2 (10 câu tình huống trên lịch phòng LabFlow). Slug GIỮ từ bản cũ: typescript-2-5-quiz (bản cũ 8 câu → 10 câu, 01/11/2026).
 * Mọi dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2) trong labflow-ts: demo2/ts-02-5/q.ts (push trên tuple thường ⇒ độ dài 3, TS2345
 * "Target requires 2 element(s)", TS2322 '"LAB_CLOSED"' → never, TS2345 → 'never' với { bookings: [] }, TS2345 LABS.includes(string)),
 * máy chấm Lab 2 (TS2532 cho findEntry(...).bookedBy; lần thử "! và as" 4/10, 0/8).
 * Đáp án rải: A ×3 (câu 3, 6, 9) · B ×3 (1, 5, 10) · C ×2 (4, 8) · D ×2 (2, 7).
 */
export default {
  title: 'Chapter 2 check — 10 scenario questions|||Kiểm tra Chương 2 — 10 câu tình huống',
  slug: 'typescript-2-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống trên lịch phòng LabFlow về Chương 2: || và ??, TS2532 khi một lượt đặt có thể không tồn tại, null hay trường tuỳ chọn cho dữ liệu CSDL, vì sao ! và as cho 0/8 ở Lab 2, mảng readonly và sort, lỗ hổng push trên tuple thường, mảng suy luận không phải tuple, switch vét cạn với never, bẫy never[] và LABS.includes với string — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Check</span>
<h2>Chapter 2 check</h2>
<p class="lead">Ten scenarios on LabFlow’s lab schedule. Every compiler message and runtime result in them comes from a real run (Node 22.23.3, tsc 7.0.2). Each answer explains why the right option is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say when a value should be <code>null</code>, when a field should be optional, and why <code>??</code> is not <code>||</code>.</li>
<li>I can choose between <code>T[]</code>, <code>readonly T[]</code> and a tuple, and I know the holes in a mutable tuple.</li>
<li>I can use <code>never</code> to make a <code>switch</code> fail to compile when someone adds a new case.</li>
<li>I can derive a union type from one <code>as const</code> list instead of copying it.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Kiểm tra Chương 2</h2>
<p class="lead">Mười tình huống trên lịch phòng lab của LabFlow. Mọi thông báo của trình biên dịch và kết quả lúc chạy trong câu hỏi đều lấy từ lần chạy thật (Node 22.23.3, tsc 7.0.2). Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được khi nào giá trị nên là <code>null</code>, khi nào trường nên là tuỳ chọn, và vì sao <code>??</code> không phải <code>||</code>.</li>
<li>Tôi chọn được giữa <code>T[]</code>, <code>readonly T[]</code> và tuple, và biết lỗ hổng của tuple thường.</li>
<li>Tôi dùng được <code>never</code> để một <code>switch</code> biên dịch hỏng khi ai đó thêm trường hợp mới.</li>
<li>Tôi suy ra được một kiểu union từ một danh sách <code>as const</code> thay vì chép lại nó.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    passingScore: 70,
    questions: [
      {
        question: 'A booking has note: \'\' (the student deliberately left the note empty). The schedule page shows "(no note)" because the code is entry.note || \'(no note)\'. tsc reports nothing. What is the fix, and why did tsc stay silent?|||Một lượt đặt có note: \'\' (sinh viên cố ý để trống ghi chú). Trang lịch hiện "(no note)" vì code là entry.note || \'(no note)\'. tsc không báo gì. Sửa thế nào, và vì sao tsc im lặng?',
        options: [
          'Add a type annotation note: string; tsc will then reject the || expression.|||Thêm chú thích kiểu note: string; khi đó tsc sẽ từ chối biểu thức ||.',
          'Use entry.note ?? \'(no note)\': ?? only replaces null and undefined, while || also replaces \'\', 0 and false. Both are valid code, so tsc has nothing to report — a test with an empty note catches it.|||Dùng entry.note ?? \'(no note)\': ?? chỉ thay null và undefined, còn || thay cả \'\', 0 và false. Cả hai đều là code hợp lệ nên tsc không có gì để báo — một test với ghi chú rỗng sẽ bắt được.',
          'Use entry.note! to tell tsc the note is always there.|||Dùng entry.note! để báo tsc ghi chú luôn có.',
          'Turn on noUncheckedIndexedAccess; it treats empty strings as missing.|||Bật noUncheckedIndexedAccess; nó coi chuỗi rỗng là thiếu.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: || falls back on every falsy value, ?? only on null and undefined. That is a behaviour difference, not a type error, so it compiles either way — Lab 2\'s test "an empty note stays empty" is what catches it. Option C is tempting but ! only silences tsc; it changes nothing at runtime.|||VI: || lùi về giá trị mặc định với mọi giá trị falsy, ?? chỉ với null và undefined. Đó là khác biệt hành vi, không phải lỗi kiểu, nên viết kiểu nào cũng biên dịch được — test "ghi chú rỗng vẫn rỗng" của Lab 2 mới bắt được nó. Phương án C hấp dẫn nhưng ! chỉ bịt miệng tsc; lúc chạy không thay đổi gì.',
      },
      {
        question: 'findEntry(schedule, id) returns ScheduleEntry | undefined. A teammate writes findEntry(today, 7).bookedBy. What does tsc 7 say?|||findEntry(schedule, id) trả ScheduleEntry | undefined. Bạn cùng nhóm viết findEntry(today, 7).bookedBy. tsc 7 nói gì?',
        options: [
          'Nothing — undefined is part of every type, as in JavaScript.|||Không gì cả — undefined thuộc mọi kiểu, như trong JavaScript.',
          'TS2339: Property \'bookedBy\' does not exist on type \'undefined\'.|||TS2339: Property \'bookedBy\' does not exist on type \'undefined\'.',
          'A runtime TypeError, because tsc runs the code to check it.|||Một TypeError lúc chạy, vì tsc chạy code để kiểm.',
          'TS2532: Object is possibly \'undefined\' — with strict on, the missing case must be handled before the property is read.|||TS2532: Object is possibly \'undefined\' — khi bật strict, phải xử lý trường hợp thiếu trước khi đọc thuộc tính.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured in Lab 2 (wrong use S1): TS2532, the wording tsc uses when the possibly-missing value is an expression; for a named variable it says TS18048 "\'x\' is possibly \'undefined\'". Option A describes strict: false — exactly the setting under which the starter compiled with 0 errors and then crashed with "Cannot read properties of undefined".|||VI: Đo ở Lab 2 (cách dùng sai S1): TS2532, cách tsc nói khi giá trị có thể thiếu là một biểu thức; với biến có tên nó nói TS18048 "\'x\' is possibly \'undefined\'". Phương án A mô tả strict: false — đúng cấu hình mà bản khởi đầu biên dịch với 0 lỗi rồi sập với "Cannot read properties of undefined".',
      },
      {
        question: 'In the bookings table, note is a nullable column (NULL = no note) and cancelled_at only exists once a booking is cancelled (the API omits the key otherwise). Which TypeScript type describes one row as the API sends it?|||Trong bảng bookings, note là cột cho phép NULL (NULL = không có ghi chú) còn cancelled_at chỉ có khi lượt đặt đã huỷ (API bỏ hẳn khoá đó nếu chưa huỷ). Kiểu TypeScript nào mô tả một dòng như API gửi về?',
        options: [
          '{ note: string | null; cancelledAt?: string } — null for a value that is present but empty, ?: for a key that may be absent.|||{ note: string | null; cancelledAt?: string } — null cho giá trị có mặt nhưng rỗng, ?: cho khoá có thể vắng mặt.',
          '{ note: string; cancelledAt: string } — strict mode adds null and undefined automatically.|||{ note: string; cancelledAt: string } — chế độ strict tự thêm null và undefined.',
          '{ note?: string; cancelledAt: string | null } — the two words mean the same thing.|||{ note?: string; cancelledAt: string | null } — hai cách viết nghĩa như nhau.',
          '{ note: any; cancelledAt: any } — data from a database cannot be typed.|||{ note: any; cancelledAt: any } — dữ liệu từ CSDL không gõ kiểu được.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: JSON keeps a NULL column as "note": null — the key is there, its value is null. An omitted key reads as undefined, which is what ?: says. Option C swaps them: it would accept a row with no note key and reject a NULL note — Lab 2\'s correct use { note: null } would fail. Strict mode never adds null for you (option B); that is its whole point.|||VI: JSON giữ cột NULL thành "note": null — khoá có mặt, giá trị là null. Khoá bị bỏ đi thì đọc ra undefined, đúng như ?: nói. Phương án C đảo ngược: nó nhận dòng không có khoá note và từ chối ghi chú NULL — cách dùng đúng { note: null } của Lab 2 sẽ hỏng. Strict không bao giờ tự thêm null hộ bạn (phương án B); đó chính là ý nghĩa của nó.',
      },
      {
        question: 'Lab 2, attempt A: the teammate fixed the two runtime bugs the tests found, then made every strict error disappear with ! and as (e.g. schedule.find(…) as ScheduleEntry). tsc is clean, 13/13 tests pass. How many of the 8 wrong uses does the grader see refused?|||Lab 2, lần thử A: bạn cùng nhóm sửa hai bug lúc chạy mà test tìm ra, rồi làm mọi lỗi strict biến mất bằng ! và as (vd schedule.find(…) as ScheduleEntry). tsc sạch, 13/13 test qua. Máy chấm thấy bao nhiêu trong 8 cách dùng sai bị từ chối?',
        options: [
          '8 of 8 — a clean compile under strict means the code is safe.|||8 trên 8 — biên dịch sạch dưới strict nghĩa là code an toàn.',
          '4 of 8 — the casts protect against null but not against shape mistakes.|||4 trên 8 — ép kiểu bảo vệ trước null nhưng không trước lỗi hình dạng.',
          '0 of 8 (score 4/10) — as and ! do not make a value exist, they tell tsc to stop asking; the types still say what they said under strict: false.|||0 trên 8 (điểm 4/10) — as và ! không làm giá trị tồn tại, chúng bảo tsc thôi hỏi; kiểu vẫn nói đúng những gì nó nói dưới strict: false.',
          'It does not compile — strict mode forbids as.|||Không biên dịch được — strict cấm as.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured: A 2, B 0, C 0, D 2, E 0/8 — 4/10, no better protected than the starter. A clean tsc only means "no contradictions in what you told me"; with as and ! you told it things that are not true. Option B is the score of attempt B, which wrote null and undefined honestly (7/10).|||VI: Đo thật: A 2, B 0, C 0, D 2, E 0/8 — 4/10, không được bảo vệ hơn bản khởi đầu. tsc sạch chỉ có nghĩa "những gì bạn bảo tôi không mâu thuẫn"; với as và ! bạn đã bảo nó những điều không đúng. Phương án B là điểm của lần thử B, lần thử viết null và undefined trung thực (7/10).',
      },
      {
        question: 'sortByStart(schedule) returns schedule.sort(…). After calling it, the "today" list held by the page cache is in a new order too. You change the parameter to readonly ScheduleEntry[]. What happens?|||sortByStart(schedule) trả về schedule.sort(…). Gọi xong, danh sách "today" mà cache của trang đang giữ cũng bị đổi thứ tự. Bạn đổi tham số thành readonly ScheduleEntry[]. Chuyện gì xảy ra?',
        options: [
          'Nothing changes: readonly is only a comment for humans.|||Không gì thay đổi: readonly chỉ là chú thích cho người đọc.',
          'tsc refuses .sort (it does not exist on a readonly array), so you must write toSorted(…) or sort a copy — the caller\'s list keeps its order.|||tsc từ chối .sort (mảng readonly không có nó), nên bạn phải viết toSorted(…) hoặc sắp xếp bản sao — danh sách của người gọi giữ nguyên thứ tự.',
          'Node throws a TypeError when sort runs, because readonly freezes the array at runtime.|||Node ném TypeError khi sort chạy, vì readonly đóng băng mảng lúc chạy.',
          'tsc copies the array automatically before sorting.|||tsc tự sao chép mảng trước khi sắp xếp.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A readonly array type has no mutating methods (sort, push, splice…), so the in-place sort becomes a compile error and the copying toSorted is the natural fix. Option C confuses the type with Object.freeze: readonly is erased before Node runs anything; only Object.freeze acts at runtime.|||VI: Kiểu mảng readonly không có phương thức làm đổi mảng (sort, push, splice…), nên sort tại chỗ thành lỗi biên dịch và toSorted (tạo bản sao) là cách sửa tự nhiên. Phương án C nhầm kiểu với Object.freeze: readonly bị xoá trước khi Node chạy; chỉ Object.freeze mới tác dụng lúc chạy.',
      },
      {
        question: 'const r: [number, number] = [480, 600]; r.push(660); console.log(r.length). What happens?|||const r: [number, number] = [480, 600]; r.push(660); console.log(r.length). Chuyện gì xảy ra?',
        options: [
          'tsc reports nothing and Node prints 3 — a mutable tuple still has push. Writing readonly [number, number] removes push and closes the hole.|||tsc không báo gì và Node in 3 — tuple thường vẫn có push. Viết readonly [number, number] sẽ bỏ push và bịt lỗ hổng.',
          'tsc reports TS2322: source has 3 elements but target allows only 2.|||tsc báo TS2322: nguồn có 3 phần tử nhưng đích chỉ cho 2.',
          'Node throws, because the tuple has a fixed length at runtime.|||Node ném lỗi, vì tuple có độ dài cố định lúc chạy.',
          'tsc reports TS2493: tuple of length 2 has no element at index 2.|||tsc báo TS2493: tuple độ dài 2 không có phần tử ở chỉ số 2.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured: no error, and "Q6 3 [480,600,660]". The length check (TS2322, option B) applies when you assign a 3-element literal; push is a method of Array and a mutable tuple keeps it. That is why Lab 2 uses readonly [start: number, end: number].|||VI: Đo thật: không lỗi, và in "Q6 3 [480,600,660]". Kiểm độ dài (TS2322, phương án B) áp dụng khi bạn gán một literal ba phần tử; push là phương thức của Array và tuple thường vẫn giữ nó. Vì vậy Lab 2 dùng readonly [start: number, end: number].',
      },
      {
        question: 'const fromForm = [480, 600]; minutesOf(fromForm); where minutesOf(range: TimeRange) and TimeRange = readonly [start: number, end: number]. Why does tsc refuse it?|||const fromForm = [480, 600]; minutesOf(fromForm); với minutesOf(range: TimeRange) và TimeRange = readonly [start: number, end: number]. Vì sao tsc từ chối?',
        options: [
          'Because 480 and 600 are not valid minutes.|||Vì 480 và 600 không phải số phút hợp lệ.',
          'Because readonly tuples cannot be passed to functions.|||Vì không truyền được tuple readonly vào hàm.',
          'Because fromForm is a const, and constants cannot be arguments.|||Vì fromForm là const, mà hằng không được làm đối số.',
          'Because an array literal is inferred as number[], not as a tuple: TS2345 "Target requires 2 element(s) but source may have fewer". Annotate it (const fromForm: TimeRange = …) or build it with a function that returns TimeRange.|||Vì literal mảng được suy luận là number[], không phải tuple: TS2345 "Target requires 2 element(s) but source may have fewer". Chú thích kiểu (const fromForm: TimeRange = …) hoặc dựng nó bằng một hàm trả về TimeRange.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured on demo2/ts-02-5/q.ts line 13: TS2345 with that exact second line. Inference picks the general type number[] for an array (lesson 1.3 widening), and a number[] may have any length. Passing the literal directly — minutesOf([480, 600]) — would work, because the parameter gives it a context.|||VI: Đo ở demo2/ts-02-5/q.ts dòng 13: TS2345 với đúng dòng thứ hai đó. Suy luận chọn kiểu tổng quát number[] cho mảng (nới kiểu, bài 1.3), mà number[] có thể dài bao nhiêu cũng được. Truyền thẳng literal — minutesOf([480, 600]) — thì được, vì tham số cho nó một ngữ cảnh.',
      },
      {
        question: 'message(code) has a switch over the four SlotCode values and, in default, const unreachable: never = code. A teammate adds \'LAB_CLOSED\' to the code type but not to the switch. What happens?|||message(code) có switch qua bốn giá trị SlotCode và trong default có const unreachable: never = code. Bạn cùng nhóm thêm \'LAB_CLOSED\' vào kiểu mã nhưng không thêm vào switch. Chuyện gì xảy ra?',
        options: [
          'Nothing at compile time; at runtime the message is undefined.|||Lúc biên dịch không gì cả; lúc chạy thông báo là undefined.',
          'tsc refuses the switch because default is not allowed with literal types.|||tsc từ chối switch vì không được dùng default với kiểu literal.',
          'tsc reports TS2322: Type \'"LAB_CLOSED"\' is not assignable to type \'never\' — the new case is pointed out before anything runs.|||tsc báo TS2322: Type \'"LAB_CLOSED"\' is not assignable to type \'never\' — trường hợp mới bị chỉ ra trước khi chạy bất cứ thứ gì.',
          'tsc adds the missing case automatically.|||tsc tự thêm trường hợp còn thiếu.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: In default, code has been narrowed to whatever the cases did not handle. With all four handled that is never, so the assignment compiles; with LAB_CLOSED added it is "LAB_CLOSED", which never accepts. Option A is what happens WITHOUT the never line — the silent undefined that lesson 2.3 shows in JavaScript.|||VI: Trong default, code đã bị thu hẹp còn những gì các case chưa xử lý. Xử lý đủ bốn thì đó là never, phép gán biên dịch được; thêm LAB_CLOSED thì nó là "LAB_CLOSED", thứ never không nhận. Phương án A là chuyện xảy ra khi KHÔNG có dòng never — cái undefined im lặng mà bài 2.3 cho thấy trong JavaScript.',
      },
      {
        question: 'const day = { lab: \'BE-201\', bookings: [] }; day.bookings.push({ id: 1 }); tsc refuses the push. What is the type of day.bookings, and the fix?|||const day = { lab: \'BE-201\', bookings: [] }; day.bookings.push({ id: 1 }); tsc từ chối lệnh push. day.bookings có kiểu gì, và sửa ra sao?',
        options: [
          'never[] — an empty array inside an object literal has nothing to infer from, so its element type is never and nothing can be pushed (TS2345 "…not assignable to parameter of type \'never\'"). Annotate it: bookings: [] as ScheduleEntry[] is a cast — better declare the object with a type, e.g. const day: { lab: LabCode; bookings: ScheduleEntry[] } = …|||never[] — mảng rỗng trong object literal không có gì để suy luận, nên kiểu phần tử là never và không push được gì (TS2345 "…not assignable to parameter of type \'never\'"). Chú thích kiểu: bookings: [] as ScheduleEntry[] là ép kiểu — tốt hơn là khai báo object có kiểu, vd const day: { lab: LabCode; bookings: ScheduleEntry[] } = …',
          'any[] — strict mode turns it into any, so the error comes from somewhere else.|||any[] — strict biến nó thành any, nên lỗi đến từ chỗ khác.',
          'unknown[] — you must narrow each element before pushing.|||unknown[] — phải thu hẹp từng phần tử trước khi push.',
          'readonly [] — object literals are frozen.|||readonly [] — object literal bị đóng băng.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured: TS2345 "Argument of type \'{ id: number; }\' is not assignable to parameter of type \'never\'". never is the empty type: no value belongs to it. A lone let list = [] is different — tsc lets that one evolve as you push — but inside an object literal the property is fixed at never[]. Option B describes loose mode, not strict.|||VI: Đo thật: TS2345 "Argument of type \'{ id: number; }\' is not assignable to parameter of type \'never\'". never là kiểu rỗng: không giá trị nào thuộc về nó. Một let list = [] đứng riêng thì khác — tsc cho nó "lớn dần" theo các lệnh push — nhưng trong object literal thuộc tính bị chốt là never[]. Phương án B mô tả chế độ lỏng, không phải strict.',
      },
      {
        question: 'LABS = [\'BE-201\', \'BE-202\', \'AL-301\'] as const and type LabCode = (typeof LABS)[number]. A query string gives text: string. LABS.includes(text) is refused. Why, and what is a clean fix?|||LABS = [\'BE-201\', \'BE-202\', \'AL-301\'] as const và type LabCode = (typeof LABS)[number]. Query string cho text: string. LABS.includes(text) bị từ chối. Vì sao, và sửa sạch thế nào?',
        options: [
          'as const makes LABS a runtime constant, and includes cannot read constants.|||as const làm LABS thành hằng lúc chạy, và includes không đọc được hằng.',
          'includes on a readonly tuple of literals expects a LabCode, and a string might be anything (TS2345). Check with a guard such as LABS.some((lab) => lab === text) in a function isLab(text: string): text is LabCode, then use text as a LabCode.|||includes trên tuple readonly các literal cần một LabCode, mà string có thể là bất cứ gì (TS2345). Kiểm bằng guard như LABS.some((lab) => lab === text) trong hàm isLab(text: string): text is LabCode, rồi dùng text như một LabCode.',
          'Replace as const with an enum; enums accept any string.|||Thay as const bằng enum; enum nhận mọi chuỗi.',
          'Write text as LabCode — the value came from our own form.|||Viết text as LabCode — giá trị đến từ form của chính mình.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured: TS2345 "Argument of type \'string\' is not assignable to parameter of type \'"AL-301" | "BE-201" | "BE-202"\'". The guard does the runtime check the type system asked for, and after it tsc treats text as a LabCode. Option D compiles but is a lie: a URL can say ?lab=BE-999, and Node strips the cast. (Enums, option C, do not even run under Node\'s type stripping — lesson 0.4.)|||VI: Đo thật: TS2345 "Argument of type \'string\' is not assignable to parameter of type \'"AL-301" | "BE-201" | "BE-202"\'". Guard làm đúng phép kiểm lúc chạy mà hệ thống kiểu đòi, và sau nó tsc coi text là LabCode. Phương án D biên dịch được nhưng là nói dối: URL có thể ghi ?lab=BE-999, và Node bóc mất phép ép kiểu. (Enum, phương án C, còn không chạy được với type stripping của Node — bài 0.4.)',
      },
    ],
  },
};
