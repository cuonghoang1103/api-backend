/**
 * TypeScript · Chương 1 · Quiz Chương 1 (10 câu tình huống trên LabFlow). Slug GIỮ từ bản cũ: typescript-1-5-quiz (bản cũ 8 câu → 10 câu, 01/11/2026).
 * Mọi dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2): NaN/true của js/booking.js, TS2345 khi role bị nới thành string, TS18048, TS18046,
 * máy chấm Lab 1 (khởi đầu 3/8, bản "any" 1/8).
 * Đáp án rải: A ×3 (câu 2, 6, 10) · B ×2 (4, 8) · C ×3 (1, 5, 9) · D ×2 (3, 7).
 */
export default {
  title: 'Chapter 1 check — 10 scenario questions|||Kiểm tra Chương 1 — 10 câu tình huống',
  slug: 'typescript-1-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống trên LabFlow về Chương 1: lỗi gõ tên trả về NaN, giá trị sai không làm sập mà sai nghiệp vụ, dữ liệu JSON không được kiểm, lỗi logic vẫn biên dịch, nới kiểu literal, kiểu trả về suy luận thiếu, unknown, any làm yếu trình kiểm tra, chỉ số mảng và cách chuyển dần JS sang TS — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Check</span>
<h2>Chapter 1 check</h2>
<p class="lead">Ten scenarios on LabFlow's booking rules. The JavaScript results, compiler messages and grader numbers in them are real runs. Each answer says why the right option is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can show a bug that JavaScript runs silently and the TS error code that refuses it.</li>
<li>I can explain why a value from JSON.parse is not checked, and write a small guard for it.</li>
<li>I know where inference is enough and where I must annotate (parameters, exported return types).</li>
<li>I can choose unknown instead of any and narrow it before use.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Kiểm tra Chương 1</h2>
<p class="lead">Mười tình huống trên luật đặt phòng của LabFlow. Kết quả JavaScript, thông báo của trình biên dịch và điểm của máy chấm trong câu hỏi đều là lần chạy thật. Câu nào cũng nói vì sao đáp án đúng là đúng, và vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chỉ ra được một bug JavaScript chạy im lặng và mã lỗi TS từ chối nó.</li>
<li>Tôi giải thích được vì sao giá trị từ JSON.parse không được kiểm, và viết được một guard nhỏ cho nó.</li>
<li>Tôi biết chỗ nào suy luận là đủ và chỗ nào phải chú thích (tham số, kiểu trả về của hàm export).</li>
<li>Tôi chọn unknown thay cho any và thu hẹp nó trước khi dùng.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'In the JavaScript version of LabFlow, someone calls usageRate([{ minute: 60 }]) (minute instead of minutes). What does Node print?|||Trong bản JavaScript của LabFlow, ai đó gọi usageRate([{ minute: 60 }]) (minute thay vì minutes). Node in ra gì?',
        options: [
          'TypeError: Cannot read properties of undefined.|||TypeError: Cannot read properties of undefined.',
          'undefined.|||undefined.',
          'NaN — no crash, no warning; the wrong number simply flows on.|||NaN — không sập, không cảnh báo; con số sai cứ thế chảy tiếp.',
          '0, because the missing field counts as zero.|||0, vì trường thiếu được tính là không.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: b.minutes is undefined, undefined / 840 is NaN, and NaN + anything stays NaN — measured output: NaN, exit 0. In TypeScript the typed parameter refuses the object literal with TS2561 ("Did you mean to write \'minutes\'?"). Option A is tempting, but reading a missing property of an existing object is not an error in JavaScript.|||VI: b.minutes là undefined, undefined / 840 ra NaN, và NaN cộng gì cũng vẫn NaN — output đo được: NaN, mã thoát 0. Trong TypeScript, tham số có kiểu từ chối object literal đó với TS2561 ("Did you mean to write \'minutes\'?"). Phương án A hấp dẫn, nhưng đọc một thuộc tính không có của một object có thật không phải lỗi trong JavaScript.',
      },
      {
        question: 'needsApproval({ seats: 31, role: "lecturer" }) in the JavaScript version returns…|||needsApproval({ seats: 31, role: "lecturer" }) ở bản JavaScript trả về…',
        options: [
          'true — the lower-case role does not match "LECTURER", so a lecturer is wrongly told to wait for approval. With type Role = "STUDENT" | "LECTURER" | "ADMIN", tsc refuses it (TS2820, Did you mean "LECTURER"?).|||true — role viết thường không khớp "LECTURER", nên giảng viên bị bắt chờ duyệt oan. Với type Role = "STUDENT" | "LECTURER" | "ADMIN", tsc từ chối (TS2820, Did you mean "LECTURER"?).',
          'false, because JavaScript string comparison ignores case.|||false, vì so sánh chuỗi trong JavaScript không phân biệt hoa thường.',
          'It throws RangeError.|||Nó ném RangeError.',
          'It throws TypeError: unknown role.|||Nó ném TypeError: unknown role.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured: true, exit 0. This is the most expensive kind of bug — no crash, a wrong business decision. Option B is wrong: === is case-sensitive. A literal union turns the set of allowed values into something the checker can enforce.|||VI: Đo được: true, mã thoát 0. Đây là loại bug đắt nhất — không sập, mà ra quyết định nghiệp vụ sai. Phương án B sai: === phân biệt hoa thường. Một union literal biến tập giá trị hợp lệ thành thứ trình kiểm tra ép được.',
      },
      {
        question: 'A handler does const input: BookingInput = JSON.parse(body); createBooking(input). The request body has "seats": "31" (a string). What happens?|||Một handler làm const input: BookingInput = JSON.parse(body); createBooking(input). Body của request có "seats": "31" (chuỗi). Chuyện gì xảy ra?',
        options: [
          'tsc reports TS2322 because "31" is not a number.|||tsc báo TS2322 vì "31" không phải số.',
          'JSON.parse converts "31" to 31 because of the annotation.|||JSON.parse đổi "31" thành 31 nhờ chú thích kiểu.',
          'Node refuses to run the file.|||Node từ chối chạy tệp.',
          'It compiles (JSON.parse returns any); at runtime needsApproval throws RangeError because "31" is not an integer. Types cannot see data that arrives from outside.|||Nó biên dịch được (JSON.parse trả về any); lúc chạy needsApproval ném RangeError vì "31" không phải số nguyên. Kiểu không nhìn thấy dữ liệu từ bên ngoài.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: The checker only knows what you claimed; the body does not exist at compile time. Option A is tempting, but tsc never sees the string — the data arrives when the program runs. The fix is a runtime check at the boundary (a guard now, Zod in Chapter 13).|||VI: Trình kiểm tra chỉ biết điều bạn khai; body không tồn tại lúc biên dịch. Phương án A hấp dẫn, nhưng tsc không bao giờ thấy chuỗi đó — dữ liệu đến khi chương trình chạy. Cách sửa là kiểm lúc chạy ở biên (giờ là một guard, Chương 13 là Zod).',
      },
      {
        question: 'checkSlot is changed from if (e <= s) to if (e < s). Which check notices that 08:00–08:00 is now accepted?|||checkSlot bị đổi từ if (e <= s) thành if (e < s). Phép kiểm nào nhận ra 08:00–08:00 giờ được chấp nhận?',
        options: [
          'tsc, with TS2367.|||tsc, với TS2367.',
          'Only a test that calls checkSlot("08:00", "08:00") and expects END_BEFORE_START — the types are still perfectly consistent.|||Chỉ một test gọi checkSlot("08:00", "08:00") và mong END_BEFORE_START — các kiểu vẫn khớp hoàn toàn.',
          'Node, because it checks business rules at runtime.|||Node, vì nó kiểm luật nghiệp vụ lúc chạy.',
          'noUncheckedIndexedAccess.|||noUncheckedIndexedAccess.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Both versions take two numbers and return a boolean; nothing about types changed, so tsc is green. Types and tests catch different bugs. Option A is tempting because TS2367 is about comparisons — but it fires only when two types cannot overlap, not when you pick the wrong operator.|||VI: Cả hai phiên bản đều nhận hai số và trả về boolean; không gì về kiểu thay đổi, nên tsc xanh. Kiểu và test bắt những loại bug khác nhau. Phương án A hấp dẫn vì TS2367 nói về phép so sánh — nhưng nó chỉ báo khi hai kiểu không thể trùng nhau, không phải khi bạn chọn sai toán tử.',
      },
      {
        question: 'const input = { lab: "BE-201", seats: 31, role: "STUDENT", start: "08:00", end: "10:00" }; createBooking(input); — tsc reports TS2345 "Type \'string\' is not assignable to type \'Role\'". Why, and what fixes it?|||const input = { lab: "BE-201", seats: 31, role: "STUDENT", start: "08:00", end: "10:00" }; createBooking(input); — tsc báo TS2345 "Type \'string\' is not assignable to type \'Role\'". Vì sao, và sửa thế nào?',
        options: [
          'createBooking is broken; change Role to string.|||createBooking hỏng; đổi Role thành string.',
          'const makes every property read-only, which Role does not accept.|||const làm mọi thuộc tính chỉ đọc, mà Role không nhận.',
          'Object properties are widened: role is inferred as string, not "STUDENT". Annotate const input: BookingInput, or use as const or satisfies BookingInput.|||Thuộc tính object bị nới kiểu: role được suy ra là string, không phải "STUDENT". Chú thích const input: BookingInput, hoặc dùng as const hay satisfies BookingInput.',
          'The string "STUDENT" is misspelled.|||Chuỗi "STUDENT" bị viết sai.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: const only fixes the binding, not the properties, so TypeScript widens "STUDENT" to string (you may reassign input.role later). Option A "fixes" the error by deleting the protection that refused "lecturer".|||VI: const chỉ cố định biến, không cố định các thuộc tính, nên TypeScript nới "STUDENT" thành string (sau này bạn có thể gán lại input.role). Phương án A "sửa" lỗi bằng cách xoá đi chính sự bảo vệ đã từ chối "lecturer".',
      },
      {
        question: 'checkSlot has typed parameters but no return type. After if (!slot.ok) throw …, slot.minutes is still number | undefined. Why?|||checkSlot có kiểu cho tham số nhưng không khai kiểu trả về. Sau if (!slot.ok) throw …, slot.minutes vẫn là number | undefined. Vì sao?',
        options: [
          'The inferred return type has ok: boolean in both shapes, so checking ok tells tsc nothing; annotate the return as SlotResult ({ ok: true; minutes: number } | { ok: false; code: SlotCode }).|||Kiểu trả về suy ra có ok: boolean ở cả hai dạng, nên kiểm ok không cho tsc biết gì; khai kiểu trả về là SlotResult ({ ok: true; minutes: number } | { ok: false; code: SlotCode }).',
          'Because throw does not stop the function.|||Vì throw không dừng hàm.',
          'Because minutes is optional in every object.|||Vì minutes là tuỳ chọn trong mọi object.',
          'It is a bug in TypeScript 7.|||Đó là lỗi của TypeScript 7.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Object literals are widened, so { ok: true, … } is inferred as ok: boolean; with literal true/false in a declared type, if (!slot.ok) narrows to the success shape. This is the exact reason the Lab 1 string/number attempt loses point B. Option C is half true — TypeScript adds minutes?: undefined to the other shape — but that is the consequence, not the cause.|||VI: Object literal bị nới kiểu, nên { ok: true, … } được suy ra là ok: boolean; khi kiểu khai báo dùng literal true/false, if (!slot.ok) thu hẹp về dạng thành công. Đây chính là lý do lần thử string/number của Lab 1 mất điểm B. Phương án C đúng một nửa — TypeScript thêm minutes?: undefined vào dạng kia — nhưng đó là hệ quả, không phải nguyên nhân.',
      },
      {
        question: 'const data: unknown = JSON.parse(text); console.log(data.seats); — what does tsc do?|||const data: unknown = JSON.parse(text); console.log(data.seats); — tsc làm gì?',
        options: [
          'Nothing; unknown behaves like any.|||Không gì; unknown giống any.',
          'TS2339: Property \'seats\' does not exist.|||TS2339: Property \'seats\' does not exist.',
          'It converts data to an object automatically.|||Nó tự đổi data thành object.',
          'TS18046: \'data\' is of type \'unknown\' — you must narrow it first (typeof, in, a guard).|||TS18046: \'data\' is of type \'unknown\' — bạn phải thu hẹp nó trước (typeof, in, một guard).',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: unknown accepts any value but lets you do nothing with it until you prove what it is — the opposite of any, which lets you do everything. Option A is the classic confusion; the two are opposites in what they allow.|||VI: unknown nhận mọi giá trị nhưng không cho bạn làm gì với nó cho tới khi bạn chứng minh nó là gì — ngược với any, thứ cho bạn làm mọi thứ. Phương án A là chỗ nhầm kinh điển; hai thứ này trái ngược nhau về những gì được phép.',
      },
      {
        question: 'Lab 1 grader: the untouched starter (JavaScript renamed to .ts) refuses 3 of the 8 wrong calls; an attempt that adds : any everywhere refuses only 1. What explains this?|||Máy chấm Lab 1: bản khởi đầu chưa sửa (JavaScript đổi đuôi .ts) từ chối 3/8 lời gọi sai; một lần thử thêm : any khắp nơi chỉ từ chối 1. Điều gì giải thích chuyện này?',
        options: [
          'The grader is random.|||Máy chấm ngẫu nhiên.',
          'Explicit any switches off checks that inference gave for free (the destructured parameter shape, the inferred return object), so only the argument count is still checked.|||any tường minh tắt cả những phép kiểm mà suy luận cho không (dáng tham số destructure, object trả về được suy ra), nên chỉ còn số lượng đối số được kiểm.',
          'any makes tsc stop at the first error.|||any làm tsc dừng ở lỗi đầu tiên.',
          'The starter is already the correct solution.|||Bản khởi đầu vốn đã là lời giải đúng.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured: starter 3/8 (S3 argument count, S4 the seat typo, S6 the minute typo), all-any 1/8 (only S3). The starter is not a solution — it fails to compile under strict (13 implicit-any errors) and scores 2.5/10 — but any made the checker weaker than doing nothing.|||VI: Đo được: bản khởi đầu 3/8 (S3 số đối số, S4 gõ nhầm seat, S6 gõ nhầm minute), bản toàn any 1/8 (chỉ S3). Bản khởi đầu không phải lời giải — nó không biên dịch được dưới strict (13 lỗi implicit any) và được 2.5/10 — nhưng any làm trình kiểm tra yếu hơn cả khi không làm gì.',
      },
      {
        question: 'With noUncheckedIndexedAccess on (as in the course tsconfig), const first = labs[3]; first.toUpperCase(); gives…|||Khi bật noUncheckedIndexedAccess (như tsconfig của khoá), const first = labs[3]; first.toUpperCase(); cho ra…',
        options: [
          'no error, because labs is string[].|||không lỗi, vì labs là string[].',
          'TS2339: toUpperCase does not exist.|||TS2339: toUpperCase không tồn tại.',
          'TS18048: \'first\' is possibly \'undefined\' — the index may be out of range, so you must check it.|||TS18048: \'first\' is possibly \'undefined\' — chỉ số có thể vượt mảng, nên bạn phải kiểm.',
          'a runtime RangeError.|||một RangeError lúc chạy.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Without the flag, labs[3] is typed string and the crash "Cannot read properties of undefined" waits for runtime. With it, the type is string | undefined. Option A is what you get with the flag off — which is why the course turns it on.|||VI: Không có cờ này, labs[3] có kiểu string và cú sập "Cannot read properties of undefined" chờ tới lúc chạy. Có cờ, kiểu là string | undefined. Phương án A là điều bạn nhận khi tắt cờ — chính vì vậy khoá bật nó.',
      },
      {
        question: 'Your team has 200 JavaScript files and a demo next month. What is the realistic way to adopt TypeScript?|||Nhóm bạn có 200 tệp JavaScript và một buổi demo tháng sau. Cách thực tế để dùng TypeScript là gì?',
        options: [
          'Gradually: allowJs + checkJs (or // @ts-check with JSDoc) to catch errors in JS now, then convert file by file — parameters and exported return types first — with strict on, never adding any to silence errors.|||Từ từ: allowJs + checkJs (hoặc // @ts-check với JSDoc) để bắt lỗi trong JS ngay, rồi chuyển từng tệp — tham số và kiểu trả về của hàm export trước — với strict bật, không bao giờ thêm any để dập lỗi.',
          'Stop everything and rewrite all 200 files before the demo.|||Dừng mọi thứ và viết lại cả 200 tệp trước demo.',
          'Rename all files to .ts and add : any wherever tsc complains, then remove the anys later.|||Đổi đuôi mọi tệp thành .ts và thêm : any ở chỗ tsc kêu, sau này gỡ any sau.',
          'Turn strict off permanently so there are fewer errors.|||Tắt strict vĩnh viễn cho ít lỗi.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: TypeScript was designed to be adopted gradually — every JavaScript file is already valid input. Option C feels fast, but Lab 1 measured what it buys: a checker weaker than doing nothing, and "later" rarely comes.|||VI: TypeScript được thiết kế để áp dụng dần — mọi tệp JavaScript vốn đã là đầu vào hợp lệ. Phương án C có vẻ nhanh, nhưng Lab 1 đã đo cái giá của nó: một trình kiểm tra yếu hơn cả không làm gì, và "sau này" hiếm khi tới.',
      },
    ],
  },
};
