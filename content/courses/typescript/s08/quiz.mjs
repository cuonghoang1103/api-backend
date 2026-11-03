/**
 * TypeScript · Chương 8 · Quiz Chương 8 (10 câu tình huống về utility types). Slug giữ: typescript-8-5-quiz (bản cũ → 10 câu, 04/11/2026).
 * Mọi dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2) trong demo8: 8.1 (Partial {seats} ok, Required TS2739, Readonly TS2540),
 * 8.2 (Omit create id TS2353, leak TS2339, Pick key TS2344), 8.3 (Record miss TS2741, open read TS2322), 8.4 (Exclude TS2322, Awaited=Booking).
 * Đáp án rải: A ×3 (1, 5, 9) · B ×3 (2, 6, 10) · C ×2 (3, 7) · D ×2 (4, 8).
 */
export default {
  title: 'Chapter 8 check — 10 scenario questions|||Kiểm tra Chương 8 — 10 câu tình huống',
  slug: 'typescript-8-5-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười câu tình huống về Chương 8: Partial/Required/Readonly, Pick/Omit cho DTO, Record (đóng và mở), Exclude/NonNullable/ReturnType/Awaited. Mọi dữ kiện đo thật bằng tsc 7.0.2 + Node 22.23.3, có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Check</span>
<h2>Chapter 8 check</h2>
<p class="lead">Ten scenarios on the utility types — Partial, Required, Readonly, Pick, Omit, Record, Exclude, NonNullable, ReturnType, Awaited. Every compiler message comes from a real run (Node 22.23.3, tsc 7.0.2). Each answer explains why the right option is right and why the most tempting wrong one is wrong.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Kiểm tra Chương 8</h2>
<p class="lead">Mười tình huống về utility types — Partial, Required, Readonly, Pick, Omit, Record, Exclude, NonNullable, ReturnType, Awaited. Mọi thông báo trình biên dịch đều từ lần chạy thật (Node 22.23.3, tsc 7.0.2). Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao đáp án sai hấp dẫn nhất lại sai.</p>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    passingScore: 70,
    questions: [
      {
        question: 'applyPatch takes patch: Partial<Booking> where Booking has four fields. Does applyPatch(base, { seats: 30 }) compile, and what is Partial<Booking>?|||applyPatch nhận patch: Partial<Booking> với Booking có bốn trường. applyPatch(base, { seats: 30 }) có biên dịch không, và Partial<Booking> là gì?',
        options: [
          'Yes — Partial<T> makes every field optional ({ [K in keyof T]?: T[K] }), so any subset is valid; this is the shape of a PATCH body.|||Có — Partial<T> làm mọi trường optional ({ [K in keyof T]?: T[K] }), nên tập con nào cũng hợp lệ; đây là dáng của một PATCH body.',
          'No — all four fields are required.|||Không — cả bốn trường bắt buộc.',
          'It compiles only if seats is listed first.|||Chỉ biên dịch nếu seats đứng đầu.',
          'TS2353 excess property.|||TS2353 thuộc tính thừa.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo8/ts-08-1/partial): { seats: 30 } compiles and prints the merged booking. Partial<T> adds the optional modifier to every field — the mapped type { [K in keyof T]?: T[K] } from 7.2, named. Option B describes the plain Booking, not Partial of it.|||VI: Đo thật (demo8/ts-08-1/partial): { seats: 30 } biên dịch và in booking đã gộp. Partial<T> thêm modifier optional cho mọi trường — mapped type { [K in keyof T]?: T[K] } của 7.2, có tên. Phương án B tả Booking trơn, không phải Partial của nó.',
      },
      {
        question: 'type Draft = { title: string; body?: string; tags?: string[] }. const x: Required<Draft> = { title: \'Hi\' }. What does tsc say?|||type Draft = { title: string; body?: string; tags?: string[] }. const x: Required<Draft> = { title: \'Hi\' }. tsc nói gì?',
        options: [
          'Nothing — body and tags are still optional.|||Không gì — body và tags vẫn optional.',
          'TS2739: body and tags are missing — Required<T> removes every ?, so all fields are mandatory.|||TS2739: thiếu body và tags — Required<T> gỡ mọi ?, nên mọi trường bắt buộc.',
          'TS2540.|||TS2540.',
          'TS2353.|||TS2353.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo8/ts-08-1/required): TS2739, body and tags missing. Required<T> is { [K in keyof T]-?: T[K] } — it strips the optional modifier, so the plain Draft that accepted { title } is now refused.|||VI: Đo thật (demo8/ts-08-1/required): TS2739, thiếu body và tags. Required<T> là { [K in keyof T]-?: T[K] } — nó gỡ modifier optional, nên Draft trơn vốn nhận { title } giờ bị từ chối.',
      },
      {
        question: 'const cfg: Readonly<Config> = { host: \'localhost\', port: 5432 }; cfg.port = 5433. What happens, and is the object frozen at run time?|||const cfg: Readonly<Config> = { host: \'localhost\', port: 5432 }; cfg.port = 5433. Chuyện gì xảy ra, và object có bị đóng băng lúc chạy không?',
        options: [
          'It compiles; Readonly is only a hint.|||Biên dịch được; Readonly chỉ là một gợi ý.',
          'A runtime TypeError.|||TypeError lúc chạy.',
          'TS2540: port is read-only — but Readonly is compile-time only (Node strips it; Object.freeze does the runtime freeze), and it is one level deep.|||TS2540: port chỉ đọc — nhưng Readonly chỉ có lúc biên dịch (Node bỏ nó; Object.freeze mới đóng băng lúc chạy), và nó nông một tầng.',
          'TS2739.|||TS2739.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo8/ts-08-1/readonly): TS2540. Readonly<T> makes every field read-only at the type level only — there is no runtime freeze (option B is wrong; Object.freeze does that, 2.2), and a nested object or array stays mutable.|||VI: Đo thật (demo8/ts-08-1/readonly): TS2540. Readonly<T> làm mọi trường chỉ đọc chỉ ở tầng kiểu — không có đóng băng lúc chạy (phương án B sai; Object.freeze mới làm vậy, 2.2), và một object/mảng lồng bên trong vẫn sửa được.',
      },
      {
        question: 'type CreateBooking = Omit<Booking, \'id\' | \'status\'>. const bad: CreateBooking = { lab: \'BE-201\', seats: 40, id: 99 }. What does tsc say?|||type CreateBooking = Omit<Booking, \'id\' | \'status\'>. const bad: CreateBooking = { lab: \'BE-201\', seats: 40, id: 99 }. tsc nói gì?',
        options: [
          'Nothing — Omit only hides id, it does not forbid it.|||Không gì — Omit chỉ giấu id, không cấm nó.',
          'TS2741.|||TS2741.',
          'TS2339.|||TS2339.',
          'TS2353: id does not exist in CreateBooking — Omit removed it, so a client cannot send it.|||TS2353: id không tồn tại trong CreateBooking — Omit đã bỏ nó, nên client không gửi được.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo8/ts-08-2/omitbad): TS2353, id does not exist in CreateBooking. Omit removes the key entirely, so a create DTO is a boundary tsc enforces — the server owns id, and a client literal carrying it is refused.|||VI: Đo thật (demo8/ts-08-2/omitbad): TS2353, id không tồn tại trong CreateBooking. Omit bỏ hẳn khoá, nên một DTO tạo là một ranh giới tsc ép — server sở hữu id, và một literal của client mang nó bị từ chối.',
      },
      {
        question: 'type PublicUser = Omit<User, \'passwordHash\'>. Inside a function taking a PublicUser, you write u.passwordHash. What does tsc say?|||type PublicUser = Omit<User, \'passwordHash\'>. Trong một hàm nhận một PublicUser, bạn viết u.passwordHash. tsc nói gì?',
        options: [
          'TS2339: passwordHash does not exist on PublicUser — Omit dropped it, so the leak is a compile error.|||TS2339: passwordHash không tồn tại trên PublicUser — Omit đã bỏ nó, nên vụ lộ là một lỗi biên dịch.',
          'Nothing — the value still has the field at run time.|||Không gì — giá trị vẫn có trường đó lúc chạy.',
          'TS2353.|||TS2353.',
          'TS2540.|||TS2540.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo8/ts-08-2/leak): TS2339. The field is gone from the type, so reading it cannot compile — a leak of a secret becomes a compile error, the strongest place to catch it. Whatever the value carries at run time, the type refuses the read.|||VI: Đo thật (demo8/ts-08-2/leak): TS2339. Trường biến mất khỏi kiểu, nên đọc nó không biên dịch được — một vụ lộ bí mật thành một lỗi biên dịch, chỗ mạnh nhất để bắt. Dù giá trị mang gì lúc chạy, kiểu từ chối lần đọc.',
      },
      {
        question: 'type Bad = Pick<User, \'id\' | \'emial\'> where User has id, name, email. What does tsc say?|||type Bad = Pick<User, \'id\' | \'emial\'> với User có id, name, email. tsc nói gì?',
        options: [
          'Nothing — Pick accepts any string key.|||Không gì — Pick nhận khoá chuỗi bất kỳ.',
          'TS2344: \'emial\' does not satisfy keyof User — Did you mean \'email\'? Pick checks its keys against keyof the source.|||TS2344: \'emial\' không thoả keyof User — Did you mean \'email\'? Pick kiểm khoá với keyof của nguồn.',
          'TS2353.|||TS2353.',
          'TS2741.|||TS2741.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo8/ts-08-2/pickkey): TS2344 with "Did you mean \'email\'?". Pick and Omit both constrain their key list to keyof the source, so a misspelt key is refused up front — renaming a field turns every stale DTO red at once.|||VI: Đo thật (demo8/ts-08-2/pickkey): TS2344 kèm "Did you mean \'email\'?". Pick và Omit đều ràng buộc danh sách khoá vào keyof của nguồn, nên một khoá gõ sai bị từ chối ngay — đổi tên một trường làm mọi DTO cũ đỏ cùng lúc.',
      },
      {
        question: 'const seats: Record<LabCode, number> = { \'BE-201\': 40, \'BE-202\': 24 } where LabCode is \'BE-201\' | \'BE-202\' | \'AL-301\'. What does tsc say?|||const seats: Record<LabCode, number> = { \'BE-201\': 40, \'BE-202\': 24 } với LabCode là \'BE-201\' | \'BE-202\' | \'AL-301\'. tsc nói gì?',
        options: [
          'Nothing — a Record may have any subset of keys.|||Không gì — một Record có thể có tập con khoá bất kỳ.',
          'TS2322.|||TS2322.',
          'TS2741: \'AL-301\' is missing — a Record over a union must have an entry for every key.|||TS2741: thiếu \'AL-301\' — một Record trên một union phải có một mục cho mỗi khoá.',
          'TS2353.|||TS2353.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo8/ts-08-3/recordmiss): TS2741, AL-301 missing. Over a union of keys the table must be complete — the same safety as the exhaustive switch in 5.4, from the data side, so a status-label or translation table cannot forget a case.|||VI: Đo thật (demo8/ts-08-3/recordmiss): TS2741, thiếu AL-301. Trên một union khoá bảng phải đầy đủ — cùng độ an toàn như switch vét cạn ở 5.4, từ phía dữ liệu, nên một bảng nhãn trạng thái hay bảng dịch không quên được một trường hợp.',
      },
      {
        question: 'const cache: Record<string, number> = { a: 1 }; const n: number = cache[\'z\']. With noUncheckedIndexedAccess on, what does tsc say?|||const cache: Record<string, number> = { a: 1 }; const n: number = cache[\'z\']. Với noUncheckedIndexedAccess bật, tsc nói gì?',
        options: [
          'Nothing — cache[\'z\'] is a number.|||Không gì — cache[\'z\'] là một number.',
          'A runtime error.|||Một lỗi lúc chạy.',
          'TS2339.|||TS2339.',
          'TS2322: number | undefined is not a number — a lookup on a string-keyed Record may be missing, so it must be guarded.|||TS2322: number | undefined không phải một number — một lần tra trên một Record khoá string có thể thiếu, nên phải chặn.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo8/ts-08-3/openbad): TS2322, number | undefined not assignable to number. An open (string-keyed) Record cannot promise a key exists, so under noUncheckedIndexedAccess every read is V | undefined — guard with ?? and it reads cleanly (demo8/ts-08-3/open printed 1 0).|||VI: Đo thật (demo8/ts-08-3/openbad): TS2322, number | undefined không gán được cho number. Một Record mở (khoá string) không hứa được một khoá tồn tại, nên dưới noUncheckedIndexedAccess mỗi lần đọc là V | undefined — chặn bằng ?? thì đọc gọn (demo8/ts-08-3/open in 1 0).',
      },
      {
        question: 'type Active = Exclude<Status, \'CANCELLED\'> where Status is \'PENDING\' | \'CONFIRMED\' | \'CANCELLED\'. const next: Active = \'CANCELLED\'. What does tsc say?|||type Active = Exclude<Status, \'CANCELLED\'> với Status là \'PENDING\' | \'CONFIRMED\' | \'CANCELLED\'. const next: Active = \'CANCELLED\'. tsc nói gì?',
        options: [
          'TS2322: \'CANCELLED\' is not in Active — Exclude removed it, distributing over the union.|||TS2322: \'CANCELLED\' không có trong Active — Exclude đã bỏ nó, distribute qua union.',
          'Nothing — Active still includes CANCELLED.|||Không gì — Active vẫn có CANCELLED.',
          'TS2741.|||TS2741.',
          'TS2344.|||TS2344.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo8/ts-08-4/exclude): TS2322. Exclude<U, M> distributes over the union and drops the members you name, so Active is PENDING | CONFIRMED — a union derived from Status, not a second hand-written list. NonNullable is the special case that drops null and undefined.|||VI: Đo thật (demo8/ts-08-4/exclude): TS2322. Exclude<U, M> distribute qua union và bỏ các thành viên bạn nêu, nên Active là PENDING | CONFIRMED — một union suy từ Status, không phải một danh sách thứ hai viết tay. NonNullable là trường hợp đặc biệt bỏ null và undefined.',
      },
      {
        question: 'async function fetchBooking(id: number): Promise<Booking>. What is Awaited<ReturnType<typeof fetchBooking>>?|||async function fetchBooking(id: number): Promise<Booking>. Awaited<ReturnType<typeof fetchBooking>> là gì?',
        options: [
          'Promise<Booking> — Awaited does not change it.|||Promise<Booking> — Awaited không đổi nó.',
          'Booking — ReturnType reads the Promise<Booking>, and Awaited unwraps it to the value you have after await.|||Booking — ReturnType đọc Promise<Booking>, và Awaited mở nó thành giá trị bạn có sau await.',
          'number — the argument type.|||number — kiểu tham số.',
          'never.|||never.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo8/ts-08-4/awaited): Booking, used as b with b.id and b.lab, printing 1 BE-201. ReturnType reads the function’s result (Promise<Booking>) and Awaited unwraps the Promise — the type you actually have after await, read straight from the async function.|||VI: Đo thật (demo8/ts-08-4/awaited): Booking, dùng như b với b.id và b.lab, in 1 BE-201. ReturnType đọc kết quả của hàm (Promise<Booking>) và Awaited mở Promise — kiểu bạn thật sự có sau await, đọc thẳng từ hàm async.',
      },
    ],
  },
};
