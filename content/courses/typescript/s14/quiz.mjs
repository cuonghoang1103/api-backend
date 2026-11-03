/**
 * TypeScript · Chương 14 · Quiz Chương 14 (10 câu tình huống về class & decorator). Slug giữ: typescript-14-5-quiz (→ 10 câu, 04/11/2026).
 * Dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2) trong demo14. Class native, decorator chuẩn TC39.
 */
export default {
  title: 'Chapter 14 check — 10 scenario questions|||Kiểm tra Chương 14 — 10 câu tình huống',
  slug: 'typescript-14-5-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười câu tình huống về Chương 14: class & modifier truy cập (private/readonly), abstract & implements, #private/getter/static, và decorator chuẩn TC39. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
<div class="ml-en"><span class="eyebrow">Chapter 14 · Check</span><h2>Chapter 14 check</h2>
<p class="lead">Ten scenarios on the object-oriented half of TypeScript — access modifiers, abstract classes, <code>#private</code>, and decorators. Every message comes from a real run (Node 22.23.3, tsc 7.0.2).</p></div>
<div class="ml-vi"><span class="eyebrow">Chương 14 · Kiểm tra</span><h2>Kiểm tra Chương 14</h2>
<p class="lead">Mười tình huống về nửa hướng-đối-tượng của TypeScript — modifier truy cập, abstract class, <code>#private</code>, và decorator. Mọi thông báo từ lần chạy thật (Node 22.23.3, tsc 7.0.2).</p></div>
`,
  quiz: {
    timeLimitSeconds: 900,
    passingScore: 70,
    questions: [
      {
        question: 'Reading a private field from outside the class gives?|||Đọc một trường private từ ngoài class cho ra?',
        options: [
          'TS2341: the property is private and only accessible within the class.|||TS2341: thuộc tính là private và chỉ truy cập được trong class.',
          'Nothing — private is only a hint.|||Không gì — private chỉ là một gợi ý.',
          'TS2540.|||TS2540.',
          'A runtime error.|||Một lỗi lúc chạy.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo14/ts-14-1/private): TS2341. TypeScript’s private is a compile-time boundary (erased at run time); for run-time hiding use #private (14.3).|||VI: Đo thật (demo14/ts-14-1/private): TS2341. private của TypeScript là một ranh giới lúc biên dịch (bị xoá lúc chạy); giấu lúc chạy thì dùng #private (14.3).',
      },
      {
        question: 'Reassigning a readonly field after the constructor gives?|||Gán lại một trường readonly sau constructor cho ra?',
        options: [
          'Nothing — readonly allows one more write.|||Không gì — readonly cho ghi thêm một lần.',
          'TS2341.|||TS2341.',
          'TS2540: cannot assign to a read-only property.|||TS2540: không gán được cho một thuộc tính chỉ đọc.',
          'A runtime error only.|||Chỉ một lỗi lúc chạy.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo14/ts-14-1/readonly): TS2540. A readonly field is set once in the constructor and never again — the Chapter 8 Readonly, on a class field.|||VI: Đo thật (demo14/ts-14-1/readonly): TS2540. Một trường readonly được đặt một lần trong constructor và không bao giờ nữa — Readonly của Chương 8, trên một trường class.',
      },
      {
        question: 'new BookingRepo() where BookingRepo is abstract gives?|||new BookingRepo() khi BookingRepo là abstract cho ra?',
        options: [
          'A new instance.|||Một instance mới.',
          'TS2511: cannot create an instance of an abstract class.|||TS2511: không tạo được một instance của một abstract class.',
          'TS2420.|||TS2420.',
          'A runtime error.|||Một lỗi lúc chạy.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo14/ts-14-2/instantiate): TS2511. An abstract class has holes (the abstract methods); you instantiate a concrete subclass instead.|||VI: Đo thật (demo14/ts-14-2/instantiate): TS2511. Một abstract class có lỗ (các method abstract); bạn dựng một lớp con cụ thể thay vào đó.',
      },
      {
        question: 'A class says implements Repo but is missing a method. What does tsc say?|||Một class nói implements Repo nhưng thiếu một method. tsc nói gì?',
        options: [
          'Nothing — implements is optional.|||Không gì — implements là tuỳ chọn.',
          'TS2511.|||TS2511.',
          'A runtime error.|||Một lỗi lúc chạy.',
          'TS2420: the class incorrectly implements the interface (a method is missing).|||TS2420: class cài interface sai (thiếu một method).',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo14/ts-14-2/implements): TS2420. implements is a promise the compiler checks — add a method to the interface and every implementer that has not caught up lights up.|||VI: Đo thật (demo14/ts-14-2/implements): TS2420. implements là một lời hứa trình biên dịch kiểm — thêm một method vào interface và mọi bên cài chưa theo kịp sáng lên.',
      },
      {
        question: 'What is the difference between private and #private?|||Khác nhau giữa private và #private là gì?',
        options: [
          'They are identical.|||Chúng giống hệt.',
          'private is a compile-time check (erased at run time); #private is enforced by JavaScript at run time.|||private là một phép kiểm lúc biên dịch (bị xoá lúc chạy); #private được JavaScript ép lúc chạy.',
          '#private is slower.|||#private chậm hơn.',
          'private is newer.|||private mới hơn.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo14/ts-14-3): private is erased in the output, so only the type checker enforces it; #private is a real JavaScript field no outside code can read.|||VI: Đo thật (demo14/ts-14-3): private bị xoá ở output, nên chỉ bộ kiểm kiểu ép nó; #private là một trường JavaScript thật không code ngoài nào đọc được.',
      },
      {
        question: 'Reading svc.#count from outside the class gives?|||Đọc svc.#count từ ngoài class cho ra?',
        options: [
          'TS18013: the #count property is not accessible outside the class.|||TS18013: thuộc tính #count không truy cập được ngoài class.',
          'Nothing — # is just a name.|||Không gì — # chỉ là một cái tên.',
          'TS2341.|||TS2341.',
          'undefined at runtime.|||undefined lúc chạy.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo14/ts-14-3/access): TS18013. A #private field is real encapsulation — even plain JavaScript cannot read it, so there is no cast or run-time escape.|||VI: Đo thật (demo14/ts-14-3/access): TS18013. Một trường #private là đóng gói thật — cả JavaScript thuần cũng không đọc được, nên không phép ép hay lối thoát lúc chạy.',
      },
      {
        question: 'What is a getter (get x()) on a class?|||Một getter (get x()) trên một class là gì?',
        options: [
          'A static method.|||Một method static.',
          'A read-only computed view read like a field (svc.x) but not settable.|||Một view chỉ-đọc được tính, đọc như một field (svc.x) nhưng không đặt được.',
          'A decorator.|||Một decorator.',
          'A constructor.|||Một constructor.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A getter exposes a computed, read-only view of internal state; callers read it like a field but cannot assign. A static member, by contrast, belongs to the class, not an instance.|||VI: Một getter phơi một view chỉ-đọc được tính từ trạng thái trong; bên gọi đọc nó như một field nhưng không gán. Một thành viên static thì thuộc về class, không thuộc một instance.',
      },
      {
        question: 'What kind of decorators does TypeScript use (no experimentalDecorators)?|||TypeScript dùng loại decorator nào (không experimentalDecorators)?',
        options: [
          'Angular-only decorators.|||Decorator chỉ của Angular.',
          'The TC39 standard decorators, with a typed context per kind (ClassMethodDecoratorContext…).|||Decorator chuẩn TC39, với một context có kiểu cho mỗi loại (ClassMethodDecoratorContext…).',
          'None — decorators are not supported.|||Không — decorator không được hỗ trợ.',
          'Only class decorators.|||Chỉ class decorator.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo14/ts-14-4): TypeScript implements the TC39 standard decorators; each kind has a context type, and decorators run through a build step (not Node’s type-stripping).|||VI: Đo thật (demo14/ts-14-4): TypeScript cài decorator chuẩn TC39; mỗi loại có một kiểu context, và decorator chạy qua một bước build (không phải type-stripping của Node).',
      },
      {
        question: 'Putting a method decorator on a field gives?|||Đặt một method decorator lên một field cho ra?',
        options: [
          'Nothing — a decorator fits anywhere.|||Không gì — một decorator vừa ở đâu cũng được.',
          'TS2540.|||TS2540.',
          'TS1240 (plus a signature mismatch): the field decorator context differs from the method one, so the function does not fit.|||TS1240 (cộng một lệch chữ ký): context decorator field khác của method, nên hàm không vừa.',
          'A runtime error only.|||Chỉ một lỗi lúc chạy.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo14/ts-14-4/wrongtarget): TS1240. Each decorator kind has its own context type, so the type system keeps a method decorator off a field where it would be meaningless.|||VI: Đo thật (demo14/ts-14-4/wrongtarget): TS1240. Mỗi loại decorator có kiểu context riêng, nên hệ kiểu giữ một method decorator khỏi một field nơi nó vô nghĩa.',
      },
      {
        question: 'Why do decorators need a build step rather than Node’s type-stripping?|||Vì sao decorator cần một bước build thay vì type-stripping của Node?',
        options: [
          'They do not — type-stripping runs them.|||Không cần — type-stripping chạy chúng.',
          'A decorator is not pure type syntax to erase — it is run-time behaviour, so the code must be compiled to JavaScript first.|||Một decorator không phải cú pháp kiểu thuần để xoá — nó là hành vi lúc chạy, nên code phải được biên dịch sang JavaScript trước.',
          'Decorators are types only.|||Decorator chỉ là kiểu.',
          'Node runs them but slowly.|||Node chạy chúng nhưng chậm.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo14/ts-14-4): Node’s type-stripping only removes type syntax; a standard decorator adds real run-time wrapping, so you compile to JS (tsc emit) and then run — the output shows the wrapper and the original both ran.|||VI: Đo thật (demo14/ts-14-4): type-stripping của Node chỉ bỏ cú pháp kiểu; một decorator chuẩn thêm bọc thật lúc chạy, nên bạn biên dịch sang JS (tsc emit) rồi chạy — output cho thấy cả wrapper và bản gốc đều chạy.',
      },
    ],
  },
};
