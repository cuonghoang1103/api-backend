/**
 * TypeScript · Chương 13 · Quiz Chương 13 (10 câu tình huống về Zod & Prisma). Slug giữ: typescript-13-5-quiz (→ 10 câu, 04/11/2026).
 * Dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2) trong demo13. Mô hình tự-chứa zod.ts / prisma.ts.
 */
export default {
  title: 'Chapter 13 check — 10 scenario questions|||Kiểm tra Chương 13 — 10 câu tình huống',
  slug: 'typescript-13-5-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười câu tình huống về Chương 13: validate runtime với Zod (schema validate + suy kiểu, parse vs safeParse, schema là nguồn sự thật) và kiểu từ Prisma (CreateInput, findUnique T | null). Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
<div class="ml-en"><span class="eyebrow">Chapter 13 · Check</span><h2>Chapter 13 check</h2>
<p class="lead">Ten scenarios on validating at the boundary — Zod schemas, parse vs safeParse, the single source of truth, and Prisma’s generated types. Every message comes from a real run (Node 22.23.3, tsc 7.0.2) against self-contained models of Zod and Prisma.</p></div>
<div class="ml-vi"><span class="eyebrow">Chương 13 · Kiểm tra</span><h2>Kiểm tra Chương 13</h2>
<p class="lead">Mười tình huống về validate ở biên — schema Zod, parse so với safeParse, nguồn sự thật duy nhất, và kiểu sinh của Prisma. Mọi thông báo từ lần chạy thật (Node 22.23.3, tsc 7.0.2) với mô hình tự-chứa của Zod và Prisma.</p></div>
`,
  quiz: {
    timeLimitSeconds: 900,
    passingScore: 70,
    questions: [
      {
        question: 'Why is `const b = raw as BookingInput` not enough for external data?|||Vì sao `const b = raw as BookingInput` không đủ cho dữ liệu ngoài?',
        options: [
          'An assertion is a compile-time promise — it is erased at run time and checks nothing, so invalid data passes.|||Một assertion là một lời hứa lúc biên dịch — bị xoá lúc chạy và không kiểm gì, nên dữ liệu không hợp lệ lọt.',
          'It validates the data at run time.|||Nó validate dữ liệu lúc chạy.',
          'It is a syntax error.|||Nó là một lỗi cú pháp.',
          'It is the same as calling parse.|||Nó giống gọi parse.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Types are erased at run time, so `as T` leaves no check behind — the data is trusted without proof. A Zod schema validates AND infers, closing that gap.|||VI: Kiểu bị xoá lúc chạy, nên `as T` không để lại phép kiểm nào — dữ liệu được tin không bằng chứng. Một schema Zod validate VÀ suy kiểu, đóng lỗ hổng đó.',
      },
      {
        question: 'What does a Zod schema give you?|||Một schema Zod cho bạn gì?',
        options: [
          'Only a run-time check.|||Chỉ một phép kiểm lúc chạy.',
          'Only a type.|||Chỉ một kiểu.',
          'Both: a value that validates (z.object) and a type (z.Infer<typeof s>) from one definition.|||Cả hai: một giá trị validate (z.object) và một kiểu (z.Infer<typeof s>) từ một định nghĩa.',
          'A database table.|||Một bảng CSDL.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo13/ts-13-1): one schema is both the run-time guard (parse) and the compile-time shape (z.Infer). One source of truth for both.|||VI: Đo thật (demo13/ts-13-1): một schema vừa là chốt chặn lúc chạy (parse) vừa là dáng lúc biên dịch (z.Infer). Một nguồn sự thật cho cả hai.',
      },
      {
        question: 'A schema has lab and seats. The code reads booking.purpose on the inferred type. What does tsc say?|||Schema có lab và seats. Code đọc booking.purpose trên kiểu suy ra. tsc nói gì?',
        options: [
          'Nothing — the inferred type is any.|||Không gì — kiểu suy ra là any.',
          'TS2339: purpose does not exist — the inferred type has exactly the schema’s fields.|||TS2339: purpose không tồn tại — kiểu suy ra có đúng các trường của schema.',
          'TS2322.|||TS2322.',
          'A runtime undefined.|||Một undefined lúc chạy.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo13/ts-13-1/wrongfield): TS2339. z.Infer is not a loose any — it is precisely the schema, so a typo is caught just like a hand-written type.|||VI: Đo thật (demo13/ts-13-1/wrongfield): TS2339. z.Infer không phải một any lỏng — nó chính xác là schema, nên một lỗi gõ bị bắt y như một kiểu viết tay.',
      },
      {
        question: 'What does schema.parse({ seats: "forty" }) do when seats must be a number?|||schema.parse({ seats: "forty" }) làm gì khi seats phải là một number?',
        options: [
          'Returns the object unchanged.|||Trả object nguyên vẹn.',
          'Converts "forty" to a number.|||Ép "forty" thành số.',
          'Throws at run time — the data is invalid, which a static type cannot catch.|||Ném lúc chạy — dữ liệu không hợp lệ, điều kiểu tĩnh không bắt được.',
          'A compile error.|||Một lỗi biên dịch.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo13/ts-13-1/badinput): parse throws ("expected number"). Static types cannot stop bad data that only exists at run time — that is exactly what the schema checks.|||VI: Đo thật (demo13/ts-13-1/badinput): parse ném ("expected number"). Kiểu tĩnh không chặn được dữ liệu xấu chỉ tồn tại lúc chạy — đó đúng là thứ schema kiểm.',
      },
      {
        question: 'What does schema.safeParse(input) return?|||schema.safeParse(input) trả về gì?',
        options: [
          '{ success: true; data } | { success: false; error } — a discriminated union you narrow on success.|||{ success: true; data } | { success: false; error } — một discriminated union bạn thu hẹp theo success.',
          'Always the data, throwing on error.|||Luôn data, ném khi lỗi.',
          'A boolean.|||Một boolean.',
          'any.|||any.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo13/ts-13-2): safeParse returns a discriminated union — the Chapter 5 pattern tagging a validation outcome, so you must handle both branches.|||VI: Đo thật (demo13/ts-13-2): safeParse trả một discriminated union — mẫu Chương 5 gắn nhãn một kết cục validate, nên bạn phải xử lý cả hai nhánh.',
      },
      {
        question: 'A function reads result.data without checking result.success. What does tsc say?|||Một hàm đọc result.data mà không kiểm result.success. tsc nói gì?',
        options: [
          'Nothing — data is always present.|||Không gì — data luôn có.',
          'TS2339: data does not exist on the failure branch — narrow on success first.|||TS2339: data không tồn tại ở nhánh thất bại — thu hẹp theo success trước.',
          'TS2322.|||TS2322.',
          'A runtime crash only.|||Chỉ một cú sập lúc chạy.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo13/ts-13-2/wrongbranch): TS2339. The discriminant forces the narrowing, so a handler cannot reach the parsed value without handling the invalid case.|||VI: Đo thật (demo13/ts-13-2/wrongbranch): TS2339. Nhãn ép phép thu hẹp, nên một handler không với tới giá trị đã parse mà chưa xử lý trường hợp không hợp lệ.',
      },
      {
        question: 'When should you use parse rather than safeParse?|||Khi nào nên dùng parse thay vì safeParse?',
        options: [
          'Always — parse is faster.|||Luôn luôn — parse nhanh hơn.',
          'When a failure is exceptional and should blow up loudly (config at startup, data you control).|||Khi một thất bại là ngoại lệ và nên nổ to tiếng (config lúc khởi động, dữ liệu bạn kiểm soát).',
          'When you want to show the user a message.|||Khi bạn muốn hiện người dùng một thông báo.',
          'Never — parse is deprecated.|||Không bao giờ — parse đã lỗi thời.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: parse throws, so use it for the exceptional; safeParse returns a result, so use it for the expected (user input you will show a message for). Both validate the same way.|||VI: parse ném, nên dùng cho ngoại lệ; safeParse trả một kết quả, nên dùng cho dự kiến (đầu vào người dùng bạn sẽ hiện thông báo). Cả hai validate như nhau.',
      },
      {
        question: 'A hand-written type adds a purpose the schema never had; the parsed value is assigned to it. What does tsc say?|||Một kiểu viết tay thêm một purpose schema không có; giá trị đã parse được gán cho nó. tsc nói gì?',
        options: [
          'Nothing — they are compatible.|||Không gì — chúng tương thích.',
          'TS2741: purpose is missing — the hand-written copy drifted from the schema.|||TS2741: thiếu purpose — bản chép tay trôi khỏi schema.',
          'TS2339.|||TS2339.',
          'A runtime error.|||Một lỗi lúc chạy.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo13/ts-13-3/drift): TS2741. A type that copies a source of truth drifts; z.Infer computes it instead, so it is always in step — the Chapter 9 seed lesson at the boundary.|||VI: Đo thật (demo13/ts-13-3/drift): TS2741. Một kiểu chép một nguồn sự thật trôi; z.Infer tính nó thay vào đó, nên nó luôn khớp nhịp — bài học seed Chương 9 ở biên.',
      },
      {
        question: 'A Prisma BookingCreateInput has no id (the DB assigns it). create({ data: { lab, seats, id: 1 } }) gives?|||Một BookingCreateInput của Prisma không có id (CSDL gán). create({ data: { lab, seats, id: 1 } }) cho ra?',
        options: [
          'Nothing — extra fields are ignored.|||Không gì — trường thừa bị bỏ qua.',
          'TS2353: id does not exist in BookingCreateInput — the client cannot set a server-owned field.|||TS2353: id không tồn tại trong BookingCreateInput — client không đặt được một trường của server.',
          'TS18047.|||TS18047.',
          'A runtime error only.|||Chỉ một lỗi lúc chạy.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo13/ts-13-4/wrongcreate): TS2353. The generated CreateInput encodes a real rule — the client proposes the fields it owns, the server fills the rest.|||VI: Đo thật (demo13/ts-13-4/wrongcreate): TS2353. CreateInput sinh mã hoá một luật thật — client đề xuất các trường nó sở hữu, server điền phần còn lại.',
      },
      {
        question: 'Prisma findUnique returns Booking | null. Reading row.lab directly gives?|||Prisma findUnique trả Booking | null. Đọc row.lab trực tiếp cho ra?',
        options: [
          'Nothing — findUnique always finds a row.|||Không gì — findUnique luôn tìm thấy một hàng.',
          'TS2353.|||TS2353.',
          'TS18047: row is possibly null — a lookup may miss, so you must narrow first.|||TS18047: row có thể là null — một lookup có thể trượt, nên bạn phải thu hẹp trước.',
          'It returns undefined at runtime.|||Nó trả undefined lúc chạy.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo13/ts-13-4/nullrow): TS18047. The generated type is honest about a miss — the same T | null discipline as a Chapter 11 service return, now from the database layer.|||VI: Đo thật (demo13/ts-13-4/nullrow): TS18047. Kiểu sinh trung thực về một cú trượt — cùng kỷ luật T | null như một service trả về ở Chương 11, giờ từ tầng CSDL.',
      },
    ],
  },
};
