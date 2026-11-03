/**
 * TypeScript · Chương 12 · Quiz Chương 12 (10 câu tình huống về gõ kiểu React). Slug giữ: typescript-12-5-quiz (→ 10 câu, 04/11/2026).
 * Dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2) trong demo12. Đáp án rải: A ×3 (1,5,9) · B ×2 (2,6) · C ×3 (3,7,10) · D ×2 (4,8).
 */
export default {
  title: 'Chapter 12 check — 10 scenario questions|||Kiểm tra Chương 12 — 10 câu tình huống',
  slug: 'typescript-12-5-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười câu tình huống về Chương 12: gõ kiểu React — props của component, hook (useState, state nullable), sự kiện DOM, context có kiểu và component generic. Đo thật tsc 7.0.2 + Node 22.23.3 (mô hình React tự-chứa).',
  content: `
<div class="ml-en"><span class="eyebrow">Chapter 12 · Check</span><h2>Chapter 12 check</h2>
<p class="lead">Ten scenarios on typing a React frontend — props, hooks, events, context, generic components. Every message comes from a real run (Node 22.23.3, tsc 7.0.2) against a self-contained model of the React surface.</p></div>
<div class="ml-vi"><span class="eyebrow">Chương 12 · Kiểm tra</span><h2>Kiểm tra Chương 12</h2>
<p class="lead">Mười tình huống về gõ kiểu một frontend React — props, hook, sự kiện, context, component generic. Mọi thông báo từ lần chạy thật (Node 22.23.3, tsc 7.0.2) với một mô hình tự-chứa của bề mặt React.</p></div>
`,
  quiz: {
    timeLimitSeconds: 900,
    passingScore: 70,
    questions: [
      {
        question: 'A component is typed FC<{ code: string; seats: number }> and its body reads props.name. What does tsc say?|||Một component kiểu FC<{ code: string; seats: number }> và thân nó đọc props.name. tsc nói gì?',
        options: [
          'TS2339: name does not exist on the props type — a typed component only exposes its declared props.|||TS2339: name không tồn tại trên kiểu props — một component có kiểu chỉ phơi các prop đã khai.',
          'Nothing — props is always any.|||Không gì — props luôn là any.',
          'TS2322.|||TS2322.',
          'A runtime undefined.|||Một undefined lúc chạy.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo12/ts-12-1/wrongprop): TS2339. The props type is a contract — a component can only read the props it declares, so a typo becomes a compile error, not a blank spot at runtime.|||VI: Đo thật (demo12/ts-12-1/wrongprop): TS2339. Kiểu props là một hợp đồng — một component chỉ đọc được prop nó khai, nên một lỗi gõ thành một lỗi biên dịch, không phải một khoảng trống lúc chạy.',
      },
      {
        question: 'What is FC<Props> in this model?|||FC<Props> trong mô hình này là gì?',
        options: [
          'A class that extends React.Component.|||Một class kế thừa React.Component.',
          'A function taking one typed props object and returning an element — a component is just a function.|||Một hàm nhận một object props có kiểu và trả về một element — một component chỉ là một hàm.',
          'A decorator on the props.|||Một decorator trên props.',
          'Nothing at compile time.|||Không gì lúc biên dịch.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo12/ts-12-1): FC<Props> is (props: Props) => El. A component is a plain function of its props; the props type checks every reader and every call site. The real @types/react is the same shape, with JSX.|||VI: Đo thật (demo12/ts-12-1): FC<Props> là (props: Props) => El. Một component là một hàm thường của props của nó; kiểu props kiểm mọi chỗ đọc và mọi chỗ gọi. @types/react thật cùng dáng, có JSX.',
      },
      {
        question: 'A component typed FC<{ code: string; seats: number }> is called with only { code }. What does tsc say?|||Một component kiểu FC<{ code: string; seats: number }> được gọi với chỉ { code }. tsc nói gì?',
        options: [
          'Nothing — extra props are optional.|||Không gì — prop thừa là tuỳ chọn.',
          'TS2339.|||TS2339.',
          'TS2741: seats is missing — the props type enforces every required prop at the call site.|||TS2741: thiếu seats — kiểu props ép mọi prop bắt buộc tại chỗ gọi.',
          'A runtime error only.|||Chỉ một lỗi lúc chạy.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo12/ts-12-1/missingprop): TS2741. Together with the wrong-prop check (TS2339), the props type guarantees a component is given exactly what it declared it needs — before it renders.|||VI: Đo thật (demo12/ts-12-1/missingprop): TS2741. Cùng với phép kiểm prop-sai (TS2339), kiểu props bảo đảm một component được đưa đúng thứ nó khai là cần — trước khi nó vẽ.',
      },
      {
        question: 'const [count, setCount] = useState(0); setCount("three"). What does tsc say?|||const [count, setCount] = useState(0); setCount("three"). tsc nói gì?',
        options: [
          'Nothing — the setter accepts anything.|||Không gì — setter nhận gì cũng được.',
          'It converts "three" to a number.|||Nó ép "three" thành số.',
          'TS2322.|||TS2322.',
          'TS2345: string is not assignable to number — the setter is typed from the initial value.|||TS2345: string không gán được cho number — setter được gõ kiểu từ giá trị đầu.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo12/ts-12-2/wrongset): TS2345. useState(0) infers number and the setter is typed to match, so state and its updater cannot drift apart — the error is at the call, not three renders later.|||VI: Đo thật (demo12/ts-12-2/wrongset): TS2345. useState(0) suy ra number và setter được gõ kiểu khớp theo, nên state và bộ cập nhật của nó không trôi lệch nhau — lỗi ở ngay chỗ gọi, không phải ba lần render sau.',
      },
      {
        question: 'const [user] = useState<User | null>(null); then user.name. What does tsc say?|||const [user] = useState<User | null>(null); rồi user.name. tsc nói gì?',
        options: [
          'TS18047: user is possibly null — the loading state must be handled before you read the user.|||TS18047: user có thể là null — trạng thái loading phải được xử lý trước khi đọc user.',
          'Nothing — user is a User.|||Không gì — user là một User.',
          'TS2339.|||TS2339.',
          'A runtime crash only.|||Chỉ một cú sập lúc chạy.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo12/ts-12-2/nullstate): TS18047. The <User | null> says "not loaded yet" is a real state, so you must narrow before reading .name — the strict-null discipline, now on the UI.|||VI: Đo thật (demo12/ts-12-2/nullstate): TS18047. Cái <User | null> nói "chưa tải xong" là một trạng thái thật, nên bạn phải thu hẹp trước khi đọc .name — kỷ luật strict-null, giờ trên UI.',
      },
      {
        question: 'Why write useState<User | null>(null) instead of useState(null)?|||Vì sao viết useState<User | null>(null) thay vì useState(null)?',
        options: [
          'They are identical.|||Chúng giống hệt.',
          'useState(null) infers the type as just null, so the setter rejects every real user; the explicit generic allows a User later.|||useState(null) suy kiểu chỉ là null, nên setter từ chối mọi user thật; generic tường minh cho phép một User về sau.',
          'null is not allowed as an initial value.|||null không được phép làm giá trị đầu.',
          'To make it run faster.|||Để nó chạy nhanh hơn.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: From null alone TypeScript infers the state type as null, so the setter would reject every real value. Naming the union <User | null> is what lets the state start empty and hold a User once it loads.|||VI: Chỉ từ null, TypeScript suy kiểu state là null, nên setter sẽ từ chối mọi giá trị thật. Gọi tên union <User | null> là thứ cho state khởi đầu rỗng và giữ một User khi tải xong.',
      },
      {
        question: 'For e: ChangeEvent, a handler does const n: number = e.target.value. What does tsc say?|||Với e: ChangeEvent, một handler làm const n: number = e.target.value. tsc nói gì?',
        options: [
          'Nothing — value is a number.|||Không gì — value là một number.',
          'TS2339.|||TS2339.',
          'TS2322: string is not assignable to number — an input value is always a string, so parse it with Number().|||TS2322: string không gán được cho number — value của một input luôn là một string, nên phân tích bằng Number().',
          'A runtime error only.|||Chỉ một lỗi lúc chạy.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo12/ts-12-3/asnumber): TS2322. The same lesson as the Express params in Chapter 11 — e.target.value is a string even for a number input, so you must Number() it before treating it as a number.|||VI: Đo thật (demo12/ts-12-3/asnumber): TS2322. Cùng bài học với params Express ở Chương 11 — e.target.value là một string kể cả với input số, nên bạn phải Number() nó trước khi coi là số.',
      },
      {
        question: 'For e: ChangeEvent, a handler reads e.value (not e.target.value). What does tsc say?|||Với e: ChangeEvent, một handler đọc e.value (không phải e.target.value). tsc nói gì?',
        options: [
          'Nothing — value is on the event.|||Không gì — value nằm trên sự kiện.',
          'TS2322.|||TS2322.',
          'A runtime undefined.|||Một undefined lúc chạy.',
          'TS2339: value does not exist on ChangeEvent — the value is nested under target.|||TS2339: value không tồn tại trên ChangeEvent — value nằm trong target.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo12/ts-12-3/wrongevent): TS2339. The event carries a target, and the value lives on it — e.target.value — so reading e.value directly is a compile error.|||VI: Đo thật (demo12/ts-12-3/wrongevent): TS2339. Sự kiện mang một target, và value nằm trên nó — e.target.value — nên đọc e.value trực tiếp là một lỗi biên dịch.',
      },
      {
        question: 'const ctx = createContext<Theme | null>(null); const t = useContext(ctx); then t.color. What does tsc say?|||const ctx = createContext<Theme | null>(null); const t = useContext(ctx); rồi t.color. tsc nói gì?',
        options: [
          'TS18047: t is possibly null — you must handle the no-provider case before reading the value.|||TS18047: t có thể là null — phải xử lý trường hợp không-provider trước khi đọc giá trị.',
          'Nothing — the default is always present.|||Không gì — mặc định luôn có.',
          'TS2322.|||TS2322.',
          'It returns undefined at runtime.|||Nó trả undefined lúc chạy.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo12/ts-12-4/context): TS18047. createContext<Theme | null>(null) makes useContext return Theme | null, so a component reading a context it is not wrapped in is caught at compile time; a guard hook that throws on null returns a non-null value to callers.|||VI: Đo thật (demo12/ts-12-4/context): TS18047. createContext<Theme | null>(null) làm useContext trả về Theme | null, nên một component đọc một context nó không được bọc trong đó bị bắt lúc biên dịch; một hook gác ném khi null trả về một giá trị không-null cho chỗ gọi.',
      },
      {
        question: 'In <List items={[1, 2, 3]} render={(n) => ...} /> with List<T>, what is n’s type?|||Trong <List items={[1, 2, 3]} render={(n) => ...} /> với List<T>, kiểu của n là gì?',
        options: [
          'any.|||any.',
          'unknown.|||unknown.',
          'number — T is inferred from items, so the render callback is typed to match.|||number — T được suy từ items, nên callback render được gõ kiểu khớp theo.',
          'string.|||string.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo12/ts-12-4/generic): T is inferred as number from items, so n is a number and n.toFixed(0) is valid. Pass a User[] and render receives a User — one generic component, correctly typed for every element type, exactly like Chapter 6’s generic functions.|||VI: Đo thật (demo12/ts-12-4/generic): T được suy là number từ items, nên n là một number và n.toFixed(0) hợp lệ. Truyền một User[] và render nhận một User — một component generic, có kiểu đúng cho mọi kiểu phần tử, y như các hàm generic của Chương 6.',
      },
    ],
  },
};
