/**
 * TypeScript · Chương 4 · Quiz Chương 4 (10 câu tình huống trên mô hình dữ liệu LabFlow). Slug GIỮ từ bản cũ: typescript-4-5-quiz (bản cũ → 10 câu, 01/11/2026).
 * Mọi dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2) trong labflow-ts: demo4/ts-04-1 (fresh/strict TS2741 không "Did you mean"; fresh/loose 0 lỗi, "free seats: -12";
 * readonly/shallow push biên dịch được, hai phòng cùng nhận GPU), demo4/ts-04-2 (merge: TS2741 'phone' ở dòng tạo object, Node exit 0; extunion TS2312),
 * demo4/ts-04-3 (conflict: TS2322 "not assignable to type 'never'"; override TS2430; andor TS2322), demo4/ts-04-4 (loose 0 lỗi + TypeError; keys TS7053;
 * byid Object.keys ra ['1', '2']); Lab 4 (khởi đầu 0 lỗi, 4.5/10).
 * Đáp án rải: A ×3 (câu 2, 5, 9) · B ×2 (4, 7) · C ×3 (1, 6, 10) · D ×2 (3, 8).
 */
export default {
  title: 'Chapter 4 check — 10 scenario questions|||Kiểm tra Chương 4 — 10 câu tình huống',
  slug: 'typescript-4-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống trên mô hình dữ liệu LabFlow về Chương 4: lỗi gõ đi qua một biến (TS2741 thay vì "Did you mean"), cho optional để tsc im ("free seats: -12"), readonly nông với mảng dùng chung, hai interface trùng tên gộp lại, interface không extends được union (TS2312), intersection ra never, & và |, index signature khi tắt noUncheckedIndexedAccess, Object.keys trả string[], và khoá số thành chuỗi lúc chạy — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Check</span>
<h2>Chapter 4 check</h2>
<p class="lead">Ten scenarios on LabFlow’s data model — object shapes, interfaces and type aliases, <code>extends</code> and <code>&amp;</code>, dictionaries. Every compiler message and runtime result in them comes from a real run (Node 22.23.3, tsc 7.0.2). Each answer explains why the right option is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I know when the excess property check runs and what still protects me when it does not.</li>
<li>I can say what <code>readonly</code> protects — and what it does not.</li>
<li>I can explain declaration merging and when <code>type</code> is the only option.</li>
<li>I know where <code>extends</code> and <code>&amp;</code> report a conflict, and how to make a dictionary’s keys closed.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Kiểm tra Chương 4</h2>
<p class="lead">Mười tình huống trên mô hình dữ liệu của LabFlow — dáng object, interface và type alias, <code>extends</code> và <code>&amp;</code>, từ điển. Mọi thông báo của trình biên dịch và kết quả lúc chạy trong câu hỏi đều lấy từ lần chạy thật (Node 22.23.3, tsc 7.0.2). Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi biết khi nào phép kiểm khoá thừa chạy và thứ gì còn bảo vệ tôi khi nó không chạy.</li>
<li>Tôi nói được <code>readonly</code> bảo vệ gì — và không bảo vệ gì.</li>
<li>Tôi giải thích được gộp khai báo và khi nào <code>type</code> là lựa chọn duy nhất.</li>
<li>Tôi biết <code>extends</code> và <code>&amp;</code> báo xung đột ở đâu, và cách đóng tập khoá của một từ điển.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    passingScore: 70,
    questions: [
      {
        question: 'type Lab = { code: LabCode; name: string; capacity: number }. A form builds const fromForm = { code, name: \'Backend Lab 1\', capasity: 40 }; and the next line is const lab: Lab = fromForm;. What does tsc report?|||type Lab = { code: LabCode; name: string; capacity: number }. Một form dựng const fromForm = { code, name: \'Backend Lab 1\', capasity: 40 }; và dòng sau là const lab: Lab = fromForm;. tsc báo gì?',
        options: [
          'TS2561 … Did you mean to write \'capacity\'?|||TS2561 … Did you mean to write \'capacity\'?',
          'Nothing — structural typing accepts extra properties from a variable.|||Không gì — structural typing nhận thuộc tính thừa từ một biến.',
          'TS2741: Property \'capacity\' is missing … — the excess check does not run on a variable, but the required capacity still fails.|||TS2741: Property \'capacity\' is missing … — phép kiểm khoá thừa không chạy với một biến, nhưng capacity bắt buộc vẫn trượt.',
          'TS2353: Object literal may only specify known properties.|||TS2353: Object literal may only specify known properties.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo4/ts-04-1/fresh/strict): TS2741 "Property \'capacity\' is missing in type \'{ code: "BE-201"; name: string; capasity: number; }\' but required in type \'Lab\'". The excess property check (TS2353/TS2561) only runs on a fresh literal, so option A is what you get only when you type the object where it is created. Option B is half right: the extra key is accepted — but the missing required one is not.|||VI: Đo thật (demo4/ts-04-1/fresh/strict): TS2741 "Property \'capacity\' is missing in type \'{ code: "BE-201"; name: string; capasity: number; }\' but required in type \'Lab\'". Phép kiểm khoá thừa (TS2353/TS2561) chỉ chạy với literal tươi, nên phương án A chỉ xuất hiện khi bạn gõ kiểu cho object ngay chỗ tạo. Phương án B đúng một nửa: khoá thừa được nhận — nhưng khoá bắt buộc bị thiếu thì không.',
      },
      {
        question: 'To silence that TS2741, a teammate writes capacity?: number, then changes freeSeats to return (lab.capacity ?? 0) - booked. What happens with the misspelled form data and booked = 12?|||Để tắt TS2741 đó, một đồng đội viết capacity?: number, rồi sửa freeSeats thành return (lab.capacity ?? 0) - booked. Chuyện gì xảy ra với dữ liệu form gõ sai và booked = 12?',
        options: [
          'tsc reports 0 errors and Node prints "free seats: -12".|||tsc báo 0 lỗi và Node in "free seats: -12".',
          'tsc now reports TS2561 because capacity is optional.|||tsc giờ báo TS2561 vì capacity là optional.',
          'Node throws a TypeError because capacity is undefined.|||Node ném TypeError vì capacity là undefined.',
          'tsc reports TS18048 on lab.capacity.|||tsc báo TS18048 ở lab.capacity.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo4/ts-04-1/fresh/loose): 0 errors, "free seats: -12". Each change silenced one error — the optional property made the typo legal, ?? 0 removed TS18048 (option D is what you get before adding ?? 0) — and together they rebuilt the JavaScript bug. Option C would need code that reads a property of undefined; here undefined only becomes 0.|||VI: Đo thật (demo4/ts-04-1/fresh/loose): 0 lỗi, "free seats: -12". Mỗi thay đổi tắt một lỗi — thuộc tính optional làm lỗi gõ thành hợp lệ, ?? 0 xoá TS18048 (phương án D là thứ bạn gặp trước khi thêm ?? 0) — và gộp lại chúng dựng lại đúng bug JavaScript. Phương án C cần code đọc thuộc tính của undefined; ở đây undefined chỉ thành 0.',
      },
      {
        question: 'type Lab = { readonly code: LabCode; …; readonly equipment: string[] }. Two labs are built with equipment: STANDARD (the same array). Then be201.equipment.push(\'GPU server\'). Result?|||type Lab = { readonly code: LabCode; …; readonly equipment: string[] }. Hai phòng được dựng với equipment: STANDARD (cùng một mảng). Rồi be201.equipment.push(\'GPU server\'). Kết quả?',
        options: [
          'TS2540: Cannot assign to \'equipment\' because it is a read-only property.|||TS2540: Cannot assign to \'equipment\' because it is a read-only property.',
          'TS2339: Property \'push\' does not exist.|||TS2339: Property \'push\' does not exist.',
          'A runtime TypeError: the array is frozen.|||TypeError lúc chạy: mảng bị đóng băng.',
          'It compiles, and BE-202 now also lists the GPU server — readonly protects the property, not the array inside it.|||Biên dịch được, và BE-202 giờ cũng có GPU server — readonly bảo vệ thuộc tính, không bảo vệ mảng bên trong.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo4/ts-04-1/readonly): tsc reports TS2540 only for be201.equipment = […] (reassigning); push compiles, and Node prints the GPU for both labs. Option B is what you get with readonly equipment: readonly string[] (TS2339, measured in readonly/deep). readonly is compile-time only, so nothing is frozen at runtime (option C).|||VI: Đo thật (demo4/ts-04-1/readonly): tsc chỉ báo TS2540 cho be201.equipment = […] (gán lại); push biên dịch được, và Node in GPU cho cả hai phòng. Phương án B là thứ bạn có với readonly equipment: readonly string[] (TS2339, đo ở readonly/deep). readonly chỉ có lúc biên dịch, nên lúc chạy không có gì bị đóng băng (phương án C).',
      },
      {
        question: 'models.ts declares interface User { readonly id: number; email: string; name: string }. 200 lines later another teammate adds interface User { phone: string }. Where does tsc complain?|||models.ts khai interface User { readonly id: number; email: string; name: string }. 200 dòng sau một đồng đội thêm interface User { phone: string }. tsc phàn nàn ở đâu?',
        options: [
          'TS2300 Duplicate identifier \'User\' on both declarations.|||TS2300 Duplicate identifier \'User\' ở cả hai khai báo.',
          'Nowhere at the declarations: the two merge, and TS2741 "Property \'phone\' is missing" appears where a User is created.|||Không ở khai báo nào: hai cái gộp lại, và TS2741 "Property \'phone\' is missing" hiện ở chỗ tạo User.',
          'Nowhere — the second declaration replaces the first.|||Không đâu cả — khai báo thứ hai thay thế cái thứ nhất.',
          'At the second declaration, TS2430.|||Ở khai báo thứ hai, TS2430.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo4/ts-04-2/merge): one error, TS2741 on line 17 where the user is built — nothing on line 13 — and Node still prints "Hello, Nguyen Van An" (exit 0). Option A is what type aliases do (measured in dup: TS2300 twice). Interfaces merge (declaration merging) — useful for augmenting a library, a trap otherwise.|||VI: Đo thật (demo4/ts-04-2/merge): một lỗi, TS2741 ở dòng 17 nơi tạo người dùng — dòng 13 không có gì — và Node vẫn in "Hello, Nguyen Van An" (exit 0). Phương án A là cách type alias hành xử (đo ở dup: hai lần TS2300). Interface thì gộp (declaration merging) — có ích khi bổ sung thư viện, là bẫy trong trường hợp khác.',
      },
      {
        question: 'type BookingState = Pending | Confirmed (a union). You need "every state plus a lab". Which line compiles?|||type BookingState = Pending | Confirmed (một union). Bạn cần “mọi trạng thái cộng một lab”. Dòng nào biên dịch được?',
        options: [
          'type StateWithLab = BookingState & { lab: string };|||type StateWithLab = BookingState & { lab: string };',
          'interface StateWithLab extends BookingState { lab: string }|||interface StateWithLab extends BookingState { lab: string }',
          'interface StateWithLab = BookingState & { lab: string }|||interface StateWithLab = BookingState & { lab: string }',
          'None — a union cannot be combined with anything.|||Không dòng nào — union không ghép được với gì.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo4/ts-04-2/extunion): the type alias with & compiles; the interface gets TS2312 "An interface can only extend an object type or intersection of object types with statically known members". Option C is not even valid syntax (an interface has no =, TS1005 as in demo union). Only a type alias can name or intersect a union — you will use this in Chapter 5.|||VI: Đo thật (demo4/ts-04-2/extunion): type alias với & biên dịch được; interface nhận TS2312 "An interface can only extend an object type or intersection of object types with statically known members". Phương án C còn sai cú pháp (interface không có =, TS1005 như demo union). Chỉ type alias đặt tên hay giao được với union — bạn sẽ dùng điều này ở Chương 5.',
      },
      {
        question: 'type ImportedUser = User & { id: string }, where User extends Entity { readonly id: number }. What happens?|||type ImportedUser = User & { id: string }, trong đó User extends Entity { readonly id: number }. Chuyện gì xảy ra?',
        options: [
          'TS2430 on the type declaration.|||TS2430 ở khai báo kiểu.',
          'Nothing: the second id overrides the first, so id is a string.|||Không gì: id thứ hai đè id thứ nhất, nên id là chuỗi.',
          'The declaration compiles; id becomes number & string = never, and the error is TS2322 "Type \'string\' is not assignable to type \'never\'" on the object’s id line.|||Khai báo biên dịch được; id thành number & string = never, và lỗi là TS2322 "Type \'string\' is not assignable to type \'never\'" ở dòng id của object.',
          'id becomes number | string.|||id thành number | string.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo4/ts-04-3/conflict): no error at the declaration, TS2322 "not assignable to type \'never\'" at line 7, id: \'U-0007\'. Option A is what interface ImportedUser extends User gives (TS2430, measured in override) — the reason to prefer extends for entities. An intersection does not override (B) or widen (D): it requires both.|||VI: Đo thật (demo4/ts-04-3/conflict): khai báo không lỗi, TS2322 "not assignable to type \'never\'" ở dòng 7, id: \'U-0007\'. Phương án A là thứ interface ImportedUser extends User cho ra (TS2430, đo ở override) — lý do nên chọn extends cho thực thể. Intersection không đè (B) cũng không nới rộng (D): nó đòi cả hai.',
      },
      {
        question: 'type HasLab = { lab: string }; type HasSeats = { seats: number }. Which assignment is refused?|||type HasLab = { lab: string }; type HasSeats = { seats: number }. Phép gán nào bị từ chối?',
        options: [
          'const x: HasLab | HasSeats = { lab: \'BE-201\' };|||const x: HasLab | HasSeats = { lab: \'BE-201\' };',
          'const x: HasLab & HasSeats = { lab: \'BE-201\' }; — & needs both properties.|||const x: HasLab & HasSeats = { lab: \'BE-201\' }; — & cần cả hai thuộc tính.',
          'Both.|||Cả hai.',
          'Neither.|||Không cái nào.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo4/ts-04-3/andor): only the & line fails, TS2322 then "Property \'seats\' is missing … required in type \'HasSeats\'". & is "and": more properties, fewer values fit. | is "or": a value with either fits — option A is the trap of reading & as "or".|||VI: Đo thật (demo4/ts-04-3/andor): chỉ dòng & trượt, TS2322 rồi "Property \'seats\' is missing … required in type \'HasSeats\'". & là “và”: nhiều thuộc tính hơn, ít giá trị khớp hơn. | là “hoặc”: giá trị có một trong hai là khớp — phương án A là bẫy đọc & thành “hoặc”.',
      },
      {
        question: 'const LAB_INFO: { [code: string]: Lab } = { … three labs … }; freeSeats(code: string) returns LAB_INFO[code].capacity - booked. The project’s tsconfig has strict: true but noUncheckedIndexedAccess is off. A request asks for BE-999.|||const LAB_INFO: { [code: string]: Lab } = { … ba phòng … }; freeSeats(code: string) trả LAB_INFO[code].capacity - booked. tsconfig của dự án có strict: true nhưng tắt noUncheckedIndexedAccess. Một request hỏi BE-999.',
        options: [
          'tsc reports TS2532 Object is possibly \'undefined\'.|||tsc báo TS2532 Object is possibly \'undefined\'.',
          'tsc reports TS7053 because BE-999 is not a key.|||tsc báo TS7053 vì BE-999 không phải khoá.',
          'Node returns NaN.|||Node trả NaN.',
          'tsc reports 0 errors; Node throws TypeError: Cannot read properties of undefined (reading \'capacity\').|||tsc báo 0 lỗi; Node ném TypeError: Cannot read properties of undefined (reading \'capacity\').',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo4/ts-04-4/loose): 0 errors, then the TypeError. strict does not include noUncheckedIndexedAccess (also checked with tsc 7.0.2 --ignoreConfig), so a read through an index signature is typed Lab. Option A is what the course tsconfig gives (the flag is on). Option B needs a closed key set: Record<LabCode, Lab>.|||VI: Đo thật (demo4/ts-04-4/loose): 0 lỗi, rồi TypeError. strict không bao gồm noUncheckedIndexedAccess (đã kiểm cả với tsc 7.0.2 --ignoreConfig), nên đọc qua index signature có kiểu Lab. Phương án A là thứ tsconfig của khoá cho ra (cờ bật). Phương án B cần tập khoá đóng: Record<LabCode, Lab>.',
      },
      {
        question: 'const CAPACITY: Record<LabCode, number> = { … }; for (const key of Object.keys(CAPACITY)) console.log(CAPACITY[key]); — tsc says TS7053. Best fix?|||const CAPACITY: Record<LabCode, number> = { … }; for (const key of Object.keys(CAPACITY)) console.log(CAPACITY[key]); — tsc báo TS7053. Cách sửa tốt nhất?',
        options: [
          'Loop over LABS (the single list the LabCode type comes from), or use Object.entries when only the values are needed.|||Lặp qua LABS (danh sách duy nhất sinh ra kiểu LabCode), hoặc dùng Object.entries khi chỉ cần giá trị.',
          'Object.keys(CAPACITY) as LabCode[].|||Object.keys(CAPACITY) as LabCode[].',
          'Change CAPACITY to { [code: string]: number }.|||Đổi CAPACITY thành { [code: string]: number }.',
          'Add // @ts-expect-error above the line.|||Thêm // @ts-expect-error phía trên dòng đó.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo4/ts-04-4/keys): Object.keys returns string[], and only line 7 fails; the LABS loop and the Object.entries loop compile. By structural typing the object may carry extra keys at runtime, so string[] is honest. Option B is the cast that lies (1.2); option C throws away the closed key set and brings back the undefined reads.|||VI: Đo thật (demo4/ts-04-4/keys): Object.keys trả string[], và chỉ dòng 7 trượt; vòng lặp LABS và vòng lặp Object.entries biên dịch được. Theo structural typing, lúc chạy object có thể mang thêm khoá, nên string[] là trung thực. Phương án B là phép ép kiểu nói dối (1.2); phương án C vứt bỏ tập khoá đóng và đem lại các phép đọc undefined.',
      },
      {
        question: 'const byId: Record<number, User> = {}; byId[1] = an; byId[2] = binh; console.log(Object.keys(byId)). What does Node print?|||const byId: Record<number, User> = {}; byId[1] = an; byId[2] = binh; console.log(Object.keys(byId)). Node in gì?',
        options: [
          '[ 1, 2 ]|||[ 1, 2 ]',
          '[ \'an\', \'binh\' ]|||[ \'an\', \'binh\' ]',
          '[ \'1\', \'2\' ] — object keys are always strings at runtime; the number type exists only for tsc.|||[ \'1\', \'2\' ] — khoá object lúc chạy luôn là chuỗi; kiểu number chỉ tồn tại với tsc.',
          'A TypeError: numeric keys are not allowed.|||TypeError: không được dùng khoá số.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo4/ts-04-4/byid): [ \'1\', \'2\' ]. Option A is the intuition the TypeScript type gives; at runtime the keys are strings. A Map keeps its keys as numbers (and has .size — 2 in the same run). Record<number, User> is fine for lookups, but anything that reads the keys back gets strings.|||VI: Đo thật (demo4/ts-04-4/byid): [ \'1\', \'2\' ]. Phương án A là trực giác kiểu TypeScript gợi ra; lúc chạy khoá là chuỗi. Map giữ khoá dạng số (và có .size — bằng 2 trong cùng lần chạy). Record<number, User> ổn cho tra cứu, nhưng thứ gì đọc ngược khoá ra sẽ nhận chuỗi.',
      },
    ],
  },
};
