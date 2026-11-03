/**
 * TypeScript · Chương 16 · Kiểm tra CUỐI KHOÁ (10 câu tình huống trải cả khoá). Slug giữ: typescript-16-5-quiz (→ 10 câu, 04/11/2026).
 * Dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2) trong demo16 và các chương trước.
 */
export default {
  title: 'Final check — 10 scenario questions|||Kiểm tra cuối khoá — 10 câu tình huống',
  slug: 'typescript-16-5-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười câu tình huống cuối khoá: tư duy type-driven (branded type, discriminated union, illegal states), any/unknown/never, tổ chức kiểu, và cách mọi chương ghép vào một kiến trúc. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
<div class="ml-en"><span class="eyebrow">Chapter 16 · Final check</span><h2>Final check</h2>
<p class="lead">Ten scenarios across the whole course — type-driven design, the three special types, organizing types, and how the habits compose into one architecture. Every message comes from a real run (Node 22.23.3, tsc 7.0.2).</p></div>
<div class="ml-vi"><span class="eyebrow">Chương 16 · Kiểm tra cuối khoá</span><h2>Kiểm tra cuối khoá</h2>
<p class="lead">Mười tình huống trải cả khoá — tư duy type-driven, ba kiểu đặc biệt, tổ chức kiểu, và cách các thói quen ghép thành một kiến trúc. Mọi thông báo từ lần chạy thật (Node 22.23.3, tsc 7.0.2).</p></div>
`,
  quiz: {
    timeLimitSeconds: 900,
    passingScore: 70,
    questions: [
      {
        question: 'A function takes a branded LabCode. Passing a plain string "BE-201" gives?|||Một hàm nhận một LabCode có nhãn. Truyền một string thường "BE-201" cho ra?',
        options: [
          'Nothing — a string is a string.|||Không gì — một string là một string.',
          'TS2345: a plain string is not a LabCode — it never went through the validator.|||TS2345: một string thường không phải một LabCode — nó chưa qua validator.',
          'TS2339.|||TS2339.',
          'A runtime error only.|||Chỉ một lỗi lúc chạy.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo16/ts-16-1/wrongbrand): TS2345. A branded type makes "remember to validate this" a rule the compiler enforces — only the validator produces a LabCode.|||VI: Đo thật (demo16/ts-16-1/wrongbrand): TS2345. Một branded type biến "nhớ validate cái này" thành một luật trình biên dịch ép — chỉ validator sinh ra một LabCode.',
      },
      {
        question: 'A Slot is { kind: "free" } | { kind: "booked"; by: string }. Reading s.by without narrowing gives?|||Một Slot là { kind: "free" } | { kind: "booked"; by: string }. Đọc s.by không thu hẹp cho ra?',
        options: [
          'TS2339: by does not exist on the free case — the illegal state is unrepresentable.|||TS2339: by không tồn tại ở trường hợp free — trạng thái sai không biểu diễn được.',
          'Nothing.|||Không gì.',
          'TS2345.|||TS2345.',
          'undefined at runtime.|||undefined lúc chạy.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo16/ts-16-1/illegalstate): TS2339. A discriminated union encodes "one state at a time" — there is no way to build a free slot that also has a by.|||VI: Đo thật (demo16/ts-16-1/illegalstate): TS2339. Một discriminated union mã hoá "một trạng thái mỗi lần" — không có cách nào dựng một slot free mà cũng có by.',
      },
      {
        question: 'Reading raw.length when raw: unknown gives?|||Đọc raw.length khi raw: unknown cho ra?',
        options: [
          'Nothing — unknown allows anything.|||Không gì — unknown cho phép mọi thứ.',
          'TS2345.|||TS2345.',
          'TS18046: raw is of type unknown — you must narrow before use.|||TS18046: raw là kiểu unknown — phải thu hẹp trước khi dùng.',
          'A runtime error.|||Một lỗi lúc chạy.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo16/ts-16-2/unknown): TS18046. unknown is the safe top type — it accepts anything but makes you prove what it is before you touch it.|||VI: Đo thật (demo16/ts-16-2/unknown): TS18046. unknown là top type an toàn — nhận gì cũng được nhưng bắt bạn chứng minh nó là gì trước khi chạm.',
      },
      {
        question: 'An exhaustive switch over a 3-member union handles only 2, then calls assertNever(x: never). What happens?|||Một switch vét cạn trên union 3 thành viên chỉ xử lý 2, rồi gọi assertNever(x: never). Chuyện gì xảy ra?',
        options: [
          'Nothing — the default catches it.|||Không gì — default bắt nó.',
          'TS2345: the unhandled member is not never, so assertNever refuses it — the exhaustiveness check.|||TS2345: thành viên chưa xử lý không phải never, nên assertNever từ chối nó — phép kiểm vét cạn.',
          'A runtime error only.|||Chỉ một lỗi lúc chạy.',
          'TS2339.|||TS2339.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo16/ts-16-2/never): TS2345. never is the empty type; if a case is unhandled the value is not never, so assertNever fails — add a union member later and it lights up where you must handle it.|||VI: Đo thật (demo16/ts-16-2/never): TS2345. never là kiểu rỗng; nếu một case chưa xử lý thì giá trị không phải never, nên assertNever trượt — thêm một thành viên union về sau và nó sáng lên đúng chỗ bạn phải xử lý.',
      },
      {
        question: 'Why prefer unknown over any for data from outside?|||Vì sao ưu tiên unknown hơn any cho dữ liệu từ ngoài?',
        options: [
          'They are the same.|||Chúng giống nhau.',
          'any turns checking off — a wrong call compiles and crashes at run time; unknown makes you narrow first, catching it at compile time.|||any tắt kiểm — một lời gọi sai biên dịch và sập lúc chạy; unknown bắt bạn thu hẹp trước, bắt nó lúc biên dịch.',
          'unknown is faster.|||unknown nhanh hơn.',
          'any is deprecated.|||any đã lỗi thời.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo16/ts-16-2/anyrun): an any call like data.seats.toFixed() compiles and throws at run time; unknown refuses it until you narrow, so the bug never reaches run time.|||VI: Đo thật (demo16/ts-16-2/anyrun): một lời gọi any như data.seats.toFixed() biên dịch và ném lúc chạy; unknown từ chối nó tới khi bạn thu hẹp, nên bug không bao giờ tới lúc chạy.',
      },
      {
        question: 'Declaring `type User` twice gives, but declaring `interface User` twice does what?|||Khai `type User` hai lần cho ra, nhưng khai `interface User` hai lần làm gì?',
        options: [
          'Both are errors.|||Cả hai là lỗi.',
          'type twice is TS2300 (duplicate); two interfaces of the same name MERGE into one — the mechanism behind augmentation.|||type hai lần là TS2300 (trùng); hai interface cùng tên GỘP thành một — cơ chế đằng sau augmentation.',
          'Both merge.|||Cả hai gộp.',
          'Both are ignored.|||Cả hai bị bỏ qua.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo16/ts-16-3): a type alias is a single definition (TS2300 if redeclared); interfaces merge — use interface for shapes you may augment, type for unions/tuples/mapped/conditional.|||VI: Đo thật (demo16/ts-16-3): một type alias là một định nghĩa duy nhất (TS2300 nếu khai lại); interface gộp — dùng interface cho dáng bạn có thể augment, type cho union/tuple/mapped/conditional.',
      },
      {
        question: 'For a Result<T> = { ok: true; data: T } | { ok: false; error }, reading r.data without narrowing on ok gives?|||Với Result<T> = { ok: true; data: T } | { ok: false; error }, đọc r.data không thu hẹp theo ok cho ra?',
        options: [
          'Nothing.|||Không gì.',
          'TS2339: data is not on the error branch — narrow on ok first.|||TS2339: data không ở nhánh error — thu hẹp theo ok trước.',
          'TS2345.|||TS2345.',
          'A runtime crash only.|||Chỉ một cú sập lúc chạy.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo16/ts-16-4/wrongtogether): TS2339. The same discriminated-union pattern as Chapter 5, the API envelope (11) and safeParse (13) — one tag, narrowed, so a failure cannot be read as a success.|||VI: Đo thật (demo16/ts-16-4/wrongtogether): TS2339. Cùng mẫu discriminated union như Chương 5, envelope API (11) và safeParse (13) — một nhãn, được thu hẹp, nên một thất bại không đọc được như một thành công.',
      },
      {
        question: 'Where do the type invariants need run-time validation?|||Các bất biến kiểu cần validate lúc chạy ở đâu?',
        options: [
          'Nowhere — types are enough.|||Không đâu — kiểu là đủ.',
          'At every boundary — Zod at the request, Prisma at the database, branded constructors at the edges — because types are erased at run time.|||Ở mọi biên — Zod ở request, Prisma ở CSDL, constructor có nhãn ở rìa — vì kiểu bị xoá lúc chạy.',
          'Only in tests.|||Chỉ trong test.',
          'Only in production.|||Chỉ trong production.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Types are erased at run time, so the invariants hold only if every boundary validates. Inside the validated edges you trust the types completely — a trusted core behind validated boundaries.|||VI: Kiểu bị xoá lúc chạy, nên các bất biến chỉ giữ nếu mọi biên validate. Bên trong các rìa đã validate bạn tin kiểu hoàn toàn — một lõi đáng tin sau các biên đã validate.',
      },
      {
        question: 'A Zod schema both validates and infers. Why derive the type with z.infer instead of writing it by hand?|||Một schema Zod vừa validate vừa suy kiểu. Vì sao suy kiểu bằng z.infer thay vì viết tay?',
        options: [
          'Hand-writing is faster.|||Viết tay nhanh hơn.',
          'A hand-written copy is a second source of truth that drifts (TS2741 at the seam); z.infer computes the type from the schema, always in step.|||Một bản chép tay là nguồn sự thật thứ hai sẽ trôi (TS2741 ở mối nối); z.infer tính kiểu từ schema, luôn khớp nhịp.',
          'They are identical.|||Chúng giống hệt.',
          'z.infer is for runtime only.|||z.infer chỉ cho lúc chạy.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Chapter 13: a computed type cannot drift; a copied one will — the same lesson as Chapter 9’s seed incident. Prisma’s generated types and Chapter 7’s mapped types are the computed kind too.|||VI: Chương 13: một kiểu được tính không thể trôi; một kiểu chép thì sẽ — cùng bài học với sự cố seed Chương 9. Kiểu sinh của Prisma và mapped type Chương 7 cũng thuộc loại được-tính.',
      },
      {
        question: 'What is the one idea the whole course is built on?|||Ý tưởng duy nhất cả khoá dựng trên là gì?',
        options: [
          'Write as much type annotation as possible.|||Viết càng nhiều chú thích kiểu càng tốt.',
          'Let the compiler hold the invariants — move a class of bugs from run time to compile time, and make illegal states unrepresentable.|||Để trình biên dịch giữ các bất biến — chuyển một lớp bug từ lúc chạy sang lúc biên dịch, và làm trạng thái sai không biểu diễn được.',
          'Use any to move fast.|||Dùng any để đi nhanh.',
          'Avoid TypeScript for small projects.|||Tránh TypeScript cho dự án nhỏ.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Sixteen chapters, one idea: let the compiler hold the invariants so you do not have to. Branded types, discriminated unions, validation at boundaries, honest returns — all ways to make a wrong value impossible to write.|||VI: Mười sáu chương, một ý tưởng: để trình biên dịch giữ các bất biến để bạn không phải giữ. Branded type, discriminated union, validate ở biên, kiểu trả về trung thực — đều là cách làm một giá trị sai không viết được.',
      },
    ],
  },
};
