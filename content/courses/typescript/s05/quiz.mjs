/**
 * TypeScript · Chương 5 · Quiz Chương 5 (10 câu tình huống về union, literal, thu hẹp, discriminated union, exhaustiveness). Slug GIỮ: typescript-5-5-quiz (bản cũ → 10 câu, 03/11/2026).
 * Mọi dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2) trong labflow-ts: demo5/ts-05-1 (padStart trên string|number TS2339; seatsLabel(0) in "seats unknown"),
 * demo5/ts-05-2 (SlotResult r.minutes mù TS2339; switch SlotCode không default 0 lỗi; role === 'TEACHER' TS2367; e.message trên unknown TS18046),
 * demo5/ts-05-3 (predicate nói dối tsc 0 lỗi + Node TypeError; filter helper boolean TS2322 còn arrow inline suy ra predicate),
 * demo5/ts-05-4 (v2 thêm EXPIRED ⇒ TS2345; catch-all ⇒ "EXPIRED shows as: grey"; Record<Status> thiếu khoá ⇒ TS2741).
 * Đáp án rải: A ×3 (câu 1, 6, 9) · B ×3 (2, 4, 10) · C ×2 (5, 7) · D ×2 (3, 8).
 */
export default {
  title: 'Chapter 5 check — 10 scenario questions|||Kiểm tra Chương 5 — 10 câu tình huống',
  slug: 'typescript-5-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Chương 5: union và thu hẹp (padStart trên string|number, bẫy tính đúng/sai nuốt 0), union literal theo giá trị (SlotResult, switch không default, TS2367, unknown trong catch), discriminated union và type predicate (predicate nói dối, filter), và kiểm tra đầy đủ với never (thêm EXPIRED ⇒ TS2345, default bắt-hết ship "grey", Record thiếu khoá ⇒ TS2741). Mọi dữ kiện đo thật bằng tsc 7.0.2 + Node 22.23.3, có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Check</span>
<h2>Chapter 5 check</h2>
<p class="lead">Ten scenarios on unions and narrowing — type and value guards, discriminated unions, type predicates, and exhaustiveness with <code>never</code>. Every compiler message and runtime result comes from a real run (Node 22.23.3, tsc 7.0.2). Each answer explains why the right option is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I know what a union allows without narrowing, and the <code>0</code>/<code>''</code> truthiness trap.</li>
<li>I can narrow a tagged result (<code>SlotResult</code>) and know why a <code>switch</code> over a literal union needs no default.</li>
<li>I can write a discriminated union and a type predicate — and know a predicate is trusted, not checked.</li>
<li>I can make a <code>switch</code> exhaustive with <code>assertNever</code>, and spot the catch-all that hides a new case.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Kiểm tra Chương 5</h2>
<p class="lead">Mười tình huống về union và thu hẹp kiểu — guard theo kiểu và theo giá trị, discriminated union, type predicate, và kiểm tra đầy đủ với <code>never</code>. Mọi thông báo trình biên dịch và kết quả lúc chạy đều từ lần chạy thật (Node 22.23.3, tsc 7.0.2). Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi biết một union cho dùng gì khi chưa thu hẹp, và bẫy tính đúng/sai với <code>0</code>/<code>''</code>.</li>
<li>Tôi thu hẹp được một kết quả gắn nhãn (<code>SlotResult</code>) và biết vì sao một <code>switch</code> trên union literal không cần default.</li>
<li>Tôi viết được discriminated union và type predicate — và biết predicate được tin, không được kiểm.</li>
<li>Tôi làm được một <code>switch</code> đầy đủ bằng <code>assertNever</code>, và nhận ra default bắt-hết giấu một case mới.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    passingScore: 70,
    questions: [
      {
        question: 'type Id = string | number. A function has const badge = (id: Id) => \'LAB-\' + id.padStart(4, \'0\'). What does tsc report?|||type Id = string | number. Một hàm có const badge = (id: Id) => \'LAB-\' + id.padStart(4, \'0\'). tsc báo gì?',
        options: [
          'TS2339: Property \'padStart\' does not exist on type \'Id\' — and the next line says it does not exist on type \'number\'.|||TS2339: Property \'padStart\' does not exist on type \'Id\' — và dòng sau nói nó không có trên type \'number\'.',
          'Nothing — padStart is called only when id is a string at runtime.|||Không gì — padStart chỉ được gọi khi id là chuỗi lúc chạy.',
          'TS2345: id is not assignable to string.|||TS2345: id không gán được vào string.',
          'A runtime TypeError only; tsc is happy.|||Chỉ TypeError lúc chạy; tsc không báo gì.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo5/ts-05-1/union): TS2339, second line "Property \'padStart\' does not exist on type \'number\'". A union allows only what every member shares; padStart is a string method, so it is refused until you narrow with typeof. Option D is the JavaScript behaviour — tsc stops it before runtime.|||VI: Đo thật (demo5/ts-05-1/union): TS2339, dòng hai "Property \'padStart\' does not exist on type \'number\'". Union chỉ cho dùng thứ mọi thành viên cùng có; padStart là method của chuỗi, nên bị từ chối cho tới khi thu hẹp bằng typeof. Phương án D là hành vi JavaScript — tsc chặn trước lúc chạy.',
      },
      {
        question: 'function seatsLabel(seats: number | undefined) { if (seats) return seats + \' seats\'; return \'seats unknown\'; }. What does seatsLabel(0) return?|||function seatsLabel(seats: number | undefined) { if (seats) return seats + \' seats\'; return \'seats unknown\'; }. seatsLabel(0) trả về gì?',
        options: [
          '\'0 seats\'.|||\'0 seats\'.',
          '\'seats unknown\' — truthiness narrowing removes 0 along with null and undefined.|||\'seats unknown\' — thu hẹp theo tính đúng/sai bỏ cả 0 cùng null và undefined.',
          'tsc refuses it with TS2367.|||tsc từ chối với TS2367.',
          'A TypeError, because 0 is falsy.|||TypeError, vì 0 là falsy.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo5/ts-05-1/truthy): seatsLabel(0) prints "seats unknown". if (seats) is truthiness narrowing: it drops every falsy value — 0, \'\', NaN, false — not just null/undefined. A real zero-seat room falls through. Use if (seats !== undefined) when 0 is valid. tsc cannot catch this; both branches type-check.|||VI: Đo thật (demo5/ts-05-1/truthy): seatsLabel(0) in "seats unknown". if (seats) là thu hẹp theo tính đúng/sai: nó bỏ mọi giá trị falsy — 0, \'\', NaN, false — không chỉ null/undefined. Một phòng 0 chỗ thật bị lọt. Dùng if (seats !== undefined) khi 0 hợp lệ. tsc không bắt được; cả hai nhánh đều qua kiểm kiểu.',
      },
      {
        question: 'checkSlot returns { ok: true; minutes: number } | { ok: false; code: SlotCode }. A function does return r.minutes without any test. Result?|||checkSlot trả { ok: true; minutes: number } | { ok: false; code: SlotCode }. Một hàm làm return r.minutes mà không thử gì. Kết quả?',
        options: [
          'It compiles; minutes is undefined when ok is false.|||Biên dịch được; minutes là undefined khi ok là false.',
          'TS18048: r.minutes is possibly undefined.|||TS18048: r.minutes có thể undefined.',
          'TS2367.|||TS2367.',
          'TS2339: Property \'minutes\' does not exist on type \'SlotResult\' — it is not on the { ok: false } member.|||TS2339: Property \'minutes\' does not exist on type \'SlotResult\' — nó không có trên thành viên { ok: false }.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo5/ts-05-2/slot): TS2339, "does not exist on type { ok: false; code: SlotCode }". minutes lives on only one member, so you must narrow on the tag first — if (r.ok). Option A is the JavaScript intuition; TypeScript refuses the blind read.|||VI: Đo thật (demo5/ts-05-2/slot): TS2339, "does not exist on type { ok: false; code: SlotCode }". minutes chỉ nằm trên một thành viên, nên phải thu hẹp theo nhãn trước — if (r.ok). Phương án A là trực giác JavaScript; TypeScript từ chối phép đọc mù.',
      },
      {
        question: 'A switch over SlotCode (\'OFF_GRID\' | \'END_BEFORE_START\' | \'OUTSIDE_HOURS\' | \'TOO_LONG\') has a case for each and returns a string in each, with NO default. The return type is string. What does tsc say?|||Một switch trên SlotCode (\'OFF_GRID\' | \'END_BEFORE_START\' | \'OUTSIDE_HOURS\' | \'TOO_LONG\') có một case cho mỗi mã và return chuỗi ở mỗi case, KHÔNG default. Kiểu trả về là string. tsc nói gì?',
        options: [
          'TS7030: Not all code paths return a value.|||TS7030: Not all code paths return a value.',
          '0 errors — the four cases cover SlotCode exactly, so tsc knows the function always returns.|||0 lỗi — bốn case phủ đúng SlotCode, nên tsc biết hàm luôn trả về.',
          'TS2366: Function lacks ending return statement.|||TS2366: Function lacks ending return statement.',
          'It needs a default or it will not compile.|||Phải có default, không thì không biên dịch.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo5/ts-05-2/switchcode): 0 errors. Because SlotCode is a literal union and every member is handled, tsc proves the switch is exhaustive and the function always returns a string — no default needed. Add a fifth code to the union and THIS function would then fail (the point of 5.4). Options A/C/D assume tsc cannot see the cases are complete.|||VI: Đo thật (demo5/ts-05-2/switchcode): 0 lỗi. Vì SlotCode là union literal và mọi thành viên được xử lý, tsc chứng minh switch đầy đủ và hàm luôn trả về string — không cần default. Thêm một mã thứ năm vào union thì hàm NÀY sẽ hỏng (chính là ý của 5.4). Phương án A/C/D giả định tsc không thấy các case đã đầy đủ.',
      },
      {
        question: 'Role is \'STUDENT\' | \'LECTURER\' | \'ADMIN\'. A function writes return role === \'TEACHER\'. What happens?|||Role là \'STUDENT\' | \'LECTURER\' | \'ADMIN\'. Một hàm viết return role === \'TEACHER\'. Chuyện gì xảy ra?',
        options: [
          'It compiles and is sometimes true.|||Biên dịch được và đôi khi đúng.',
          'TS2339.|||TS2339.',
          'TS2367: This comparison appears to be unintentional because the types \'Role\' and \'"TEACHER"\' have no overlap.|||TS2367: This comparison appears to be unintentional because the types \'Role\' and \'"TEACHER"\' have no overlap.',
          'Nothing at compile time; it is always false at runtime and that is fine.|||Không gì lúc biên dịch; lúc chạy luôn false và thế là ổn.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo5/ts-05-2/typo): TS2367. \'TEACHER\' is not a member of Role (the role is \'LECTURER\'), so the comparison can never be true, and tsc refuses it instead of letting the branch silently never run. A value typed plain string would not get this check — a reason to use literal unions.|||VI: Đo thật (demo5/ts-05-2/typo): TS2367. \'TEACHER\' không phải thành viên của Role (vai trò là \'LECTURER\'), nên phép so sánh không bao giờ đúng, và tsc từ chối thay vì để nhánh âm thầm không chạy. Một giá trị kiểu string thường sẽ không có phép kiểm này — một lý do dùng union literal.',
      },
      {
        question: 'Inside catch (e) { return e.message; }, with strict on, what does tsc report?|||Trong catch (e) { return e.message; }, khi strict bật, tsc báo gì?',
        options: [
          'TS18046: \'e\' is of type \'unknown\' — narrow with instanceof Error first.|||TS18046: \'e\' is of type \'unknown\' — thu hẹp bằng instanceof Error trước.',
          'Nothing — e is always an Error.|||Không gì — e luôn là một Error.',
          'TS2339: Property \'message\' does not exist.|||TS2339: Property \'message\' does not exist.',
          'TS2571: Object is of type \'any\'.|||TS2571: Object is of type \'any\'.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo5/ts-05-2/catch): TS18046, "e is of type unknown". Under strict, the catch binding is unknown (anything can be thrown), so you must narrow — if (e instanceof RangeError) — before reading .message. Option B is the JavaScript assumption that gets apps to read .message off a thrown string and crash.|||VI: Đo thật (demo5/ts-05-2/catch): TS18046, "e is of type unknown". Dưới strict, biến catch là unknown (mọi thứ đều có thể bị ném), nên phải thu hẹp — if (e instanceof RangeError) — trước khi đọc .message. Phương án B là giả định JavaScript khiến ứng dụng đọc .message khỏi một chuỗi bị ném rồi sập.',
      },
      {
        question: 'A type predicate function isCancelled(s): s is Cancelled { return s.step === \'pending\'; } (the condition is wrong). The caller does if (isCancelled(s)) console.log(s.reason.toUpperCase()) on a pending s. What happens?|||Một type predicate isCancelled(s): s is Cancelled { return s.step === \'pending\'; } (điều kiện sai). Người gọi làm if (isCancelled(s)) console.log(s.reason.toUpperCase()) trên một s pending. Chuyện gì xảy ra?',
        options: [
          'tsc reports TS2345 at the predicate because the body is wrong.|||tsc báo TS2345 ở predicate vì thân hàm sai.',
          'tsc reports TS2322: the return type does not match the body.|||tsc báo TS2322: kiểu trả về không khớp thân hàm.',
          'It fails to compile because reason might be undefined.|||Không biên dịch được vì reason có thể undefined.',
          'tsc reports 0 errors; at runtime it throws a TypeError reading \'toUpperCase\' of undefined.|||tsc báo 0 lỗi; lúc chạy ném TypeError khi đọc \'toUpperCase\' của undefined.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo5/ts-05-3/lie): tsc exit 0, Node throws "Cannot read properties of undefined (reading \'toUpperCase\')". A type predicate is a promise tsc trusts — it never checks the body against the is return. A wrong condition narrows to the wrong member, so s.reason is undefined at runtime. Keep predicates simple and tested (same bargain as a cast).|||VI: Đo thật (demo5/ts-05-3/lie): tsc exit 0, Node ném "Cannot read properties of undefined (reading \'toUpperCase\')". Một type predicate là lời hứa tsc tin — nó không bao giờ kiểm thân so với phần trả về is. Điều kiện sai thu hẹp về thành viên sai, nên s.reason là undefined lúc chạy. Giữ predicate đơn giản và có kiểm (cùng thoả thuận như một phép ép kiểu).',
      },
      {
        question: 'states: BookingState[]. You want ActiveState[]. function liveFlag(s: BookingState): boolean returns s.step === \'confirmed\'. const live: ActiveState[] = states.filter(liveFlag). Result — and what about the inline version filter(s => s.step === \'confirmed\')?|||states: BookingState[]. Bạn muốn ActiveState[]. function liveFlag(s: BookingState): boolean trả s.step === \'confirmed\'. const live: ActiveState[] = states.filter(liveFlag). Kết quả — và bản inline filter(s => s.step === \'confirmed\') thì sao?',
        options: [
          'Both compile — filter always narrows.|||Cả hai biên dịch — filter luôn thu hẹp.',
          'Both fail — filter never narrows.|||Cả hai hỏng — filter không bao giờ thu hẹp.',
          'The named one fails with a parameter error; the inline one needs a cast.|||Bản có tên hỏng vì lỗi tham số; bản inline cần ép kiểu.',
          'The named helper fails (TS2322 — it returns plain boolean), but the inline arrow is inferred as a predicate (TS 5.5+) and narrows.|||Helper có tên hỏng (TS2322 — trả boolean thường), nhưng arrow inline được suy ra là predicate (TS 5.5+) và thu hẹp.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo5/ts-05-3/filter-named and filter): the named boolean helper gives TS2322 (filter(liveFlag) is still BookingState[]); the inline arrow guard compiles, because since TypeScript 5.5 tsc infers a type predicate for a simple arrow. A reusable helper must declare s is ActiveState to narrow.|||VI: Đo thật (demo5/ts-05-3/filter-named và filter): helper boolean có tên cho TS2322 (filter(liveFlag) vẫn là BookingState[]); arrow guard inline biên dịch được, vì từ TypeScript 5.5 tsc suy ra một type predicate cho một arrow đơn giản. Một helper dùng lại phải khai s is ActiveState để thu hẹp.',
      },
      {
        question: 'A describe(s) switch handles PENDING, CONFIRMED, CANCELLED and ends in default: return \'grey\'. A product manager adds \'EXPIRED\' to the Status union. What happens?|||Một switch describe(s) xử lý PENDING, CONFIRMED, CANCELLED và kết thúc default: return \'grey\'. Một product manager thêm \'EXPIRED\' vào union Status. Chuyện gì xảy ra?',
        options: [
          'tsc reports 0 errors; colour(\'EXPIRED\') returns \'grey\' — the new state ships looking cancelled, with no warning.|||tsc báo 0 lỗi; colour(\'EXPIRED\') trả \'grey\' — trạng thái mới lên sản phẩm trông như đã huỷ, không cảnh báo.',
          'tsc reports TS2345 at the default.|||tsc báo TS2345 ở default.',
          'tsc reports TS2367.|||tsc báo TS2367.',
          'A runtime error when EXPIRED is passed.|||Lỗi lúc chạy khi truyền EXPIRED.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo5/ts-05-4/catchall-v2): 0 errors, and colour(\'EXPIRED\') prints "grey". A catch-all default is runtime only — it does nothing at compile time, so the forgotten case is invisible. Option B is what you get when the default is return assertNever(s) instead (measured in v2: TS2345). That one line is the whole difference.|||VI: Đo thật (demo5/ts-05-4/catchall-v2): 0 lỗi, và colour(\'EXPIRED\') in "grey". Một default bắt-hết chỉ lúc chạy — nó chẳng làm gì lúc biên dịch, nên case bị quên là vô hình. Phương án B là thứ bạn có khi default là return assertNever(s) (đo ở v2: TS2345). Đúng một dòng đó là toàn bộ khác biệt.',
      },
      {
        question: 'The same switch instead ends in default: return assertNever(s), with function assertNever(x: never): never. \'EXPIRED\' is added to Status. What does tsc report?|||Chính switch đó thay vào kết thúc bằng default: return assertNever(s), với function assertNever(x: never): never. \'EXPIRED\' được thêm vào Status. tsc báo gì?',
        options: [
          'Nothing — assertNever handles any new case automatically.|||Không gì — assertNever tự xử lý mọi case mới.',
          'TS2345: Argument of type \'"EXPIRED"\' is not assignable to parameter of type \'never\' — at the assertNever call.|||TS2345: Argument of type \'"EXPIRED"\' is not assignable to parameter of type \'never\' — tại lời gọi assertNever.',
          'TS2741.|||TS2741.',
          'TS18046.|||TS18046.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo5/ts-05-4/v2): TS2345 at the assertNever call. After the three cases, s should be never; adding EXPIRED means s is \'EXPIRED\' there, which is not assignable to never — so tsc points at exactly the switch that forgot the new case. (A closed Record<Status, string> gives TS2741 instead — option C — the second guard, measured in record-exhaust.)|||VI: Đo thật (demo5/ts-05-4/v2): TS2345 tại lời gọi assertNever. Sau ba case, s đáng lẽ là never; thêm EXPIRED nghĩa là ở đó s là \'EXPIRED\', không gán được vào never — nên tsc chỉ đúng switch đã quên case mới. (Một Record<Status, string> đóng cho TS2741 — phương án C — chốt thứ hai, đo ở record-exhaust.)',
      },
    ],
  },
};
