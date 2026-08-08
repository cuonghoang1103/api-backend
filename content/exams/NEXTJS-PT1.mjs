/**
 * Next.js & React — Progress Test 1 (chương 1–7: nền tảng React).
 *
 * Đề tự soạn, bám sát giáo trình `content/courses/nextjs/s01…s07`. 30 câu trắc
 * nghiệm + 2 câu lập trình làm ngay trong phòng thi (chấm bằng AI theo rubric).
 *
 * ⚠️ Mọi câu "in ra gì" đều đã kiểm bằng cách CHẠY THẬT: phần JSX/SSR bằng
 * `react` + `react-dom/server` (renderToStaticMarkup), phần logic thuần bằng
 * `node` v22. Hai lời giải mẫu là Node.js thuần và đã chạy khớp expectedOutput.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NEXTJS-PT1.mjs --apply
 */
import { B, EX, code, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/nextjs-exam-kit.mjs';

export default {
  course: { slug: 'nextjs' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Chapters 1–7 (JSX, components, state, events, effects, hooks, lists & keys)',
        'Kiểm tra tiến độ 1 — Chương 1–7 (JSX, component, state, sự kiện, effect, hooks, danh sách & key)',
      ),
      description: B(
        'First third of the course: the React foundations Next.js is built on — JSX and rendering, components and props, state and its snapshot rule, controlled forms, effects and their cleanup, the hooks toolbox, and stable keys. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba đầu của khoá: nền tảng React mà Next.js dựng lên trên đó — JSX và cách render, component và props, state cùng luật ảnh chụp, khuôn nhập có kiểm soát, effect và dọn dẹp, bộ công cụ hooks, và key ổn định. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '1–7'),
      questions: [
        // ── Chương 1 — JSX & mô hình render ─────────────────────────────
        mcq({
          prompt: B(
            'JSX is not understood by the browser directly. What does the compiler turn <code>&lt;p className="x"&gt;Hi&lt;/p&gt;</code> into?',
            'Trình duyệt không hiểu JSX trực tiếp. Trình biên dịch biến <code>&lt;p className="x"&gt;Hi&lt;/p&gt;</code> thành gì?',
          ),
          options: [
            B('A call like React.createElement("p", { className: "x" }, "Hi")', 'Một lời gọi kiểu React.createElement("p", { className: "x" }, "Hi")'),
            B('A raw HTML string that is inserted with innerHTML', 'Một chuỗi HTML thô được chèn bằng innerHTML'),
            B('A DOM node created immediately with document.createElement', 'Một nút DOM tạo ngay bằng document.createElement'),
            B('A template literal that the browser parses at runtime', 'Một template literal trình duyệt tự phân tích lúc chạy'),
          ],
          correct: 0,
          explanation: EX(
            'JSX is syntax sugar. The compiler rewrites each tag to a <code>React.createElement(type, props, ...children)</code> call, which returns a plain JavaScript object (a React element) describing what to render — not a DOM node yet. React later turns that description into real DOM.',
            'JSX chỉ là cú pháp cho gọn. Trình biên dịch viết lại mỗi thẻ thành lời gọi <code>React.createElement(type, props, ...children)</code>, trả về một object JavaScript thuần (một React element) mô tả cần render gì — chưa phải nút DOM. Sau đó React mới biến mô tả ấy thành DOM thật.',
          ),
        }),
        mcq({
          prompt: B(
            'Why does JSX use <code>className</code> and <code>htmlFor</code> instead of <code>class</code> and <code>for</code>?',
            'Vì sao JSX dùng <code>className</code> và <code>htmlFor</code> thay cho <code>class</code> và <code>for</code>?',
          ),
          options: [
            B('Because class and for are reserved words in JavaScript', 'Vì class và for là từ khoá dành riêng trong JavaScript'),
            B('Because HTML forbids those attribute names entirely', 'Vì HTML cấm hẳn hai tên thuộc tính đó'),
            B('Because React renders to canvas, not HTML', 'Vì React render ra canvas chứ không phải HTML'),
            B('Because they are faster for the browser to parse', 'Vì trình duyệt phân tích chúng nhanh hơn'),
          ],
          correct: 0,
          explanation: EX(
            'JSX attributes become object keys in a real JavaScript call. <code>class</code> and <code>for</code> are reserved keywords in JS, so React uses the DOM property names <code>className</code> and <code>htmlFor</code> instead. Most other attributes become camelCase (<code>tabIndex</code>, <code>onClick</code>).',
            'Thuộc tính JSX trở thành khoá của object trong một lời gọi JavaScript thật. <code>class</code> và <code>for</code> là từ khoá dành riêng của JS, nên React dùng tên thuộc tính DOM là <code>className</code> và <code>htmlFor</code>. Phần lớn thuộc tính khác chuyển sang camelCase (<code>tabIndex</code>, <code>onClick</code>).',
          ),
        }),
        mcq({
          prompt: B(
            'What appears on screen for this list?' + code(
              'const items = [0, false, null, undefined, "ok"];\n' +
              'return <div>{items.map((v, i) => <span key={i}>{v && "Y"}</span>)}</div>;',
            ),
            'Màn hình hiện gì với danh sách này?' + code(
              'const items = [0, false, null, undefined, "ok"];\n' +
              'return <div>{items.map((v, i) => <span key={i}>{v && "Y"}</span>)}</div>;',
            ),
          ),
          options: [
            B('One span shows "0", one shows "Y", the rest are empty', 'Một span hiện "0", một span hiện "Y", các span còn lại rỗng'),
            B('Every span shows "Y" because they are truthy', 'Mọi span đều hiện "Y" vì đều truthy'),
            B('All five spans are empty', 'Cả năm span đều rỗng'),
            B('The first span shows "false", the last shows "Y"', 'Span đầu hiện "false", span cuối hiện "Y"'),
          ],
          correct: 0,
          explanation: EX(
            'Verified with renderToStaticMarkup. <code>0 &amp;&amp; "Y"</code> short-circuits to <code>0</code>, and React <b>renders the number 0</b>. <code>false</code>, <code>null</code>, <code>undefined</code> render nothing. Only <code>"ok" &amp;&amp; "Y"</code> gives "Y". This is the classic "zero bug" — never gate JSX with a number.',
            'Đã kiểm bằng renderToStaticMarkup. <code>0 &amp;&amp; "Y"</code> ngắn mạch còn <code>0</code>, và React <b>render ra số 0</b>. Còn <code>false</code>, <code>null</code>, <code>undefined</code> không render gì. Chỉ <code>"ok" &amp;&amp; "Y"</code> cho "Y". Đây là "bẫy số 0" kinh điển — đừng bao giờ chặn JSX bằng một con số.',
          ),
        }),
        mcq({
          prompt: B(
            'A cart component writes <code>{cart.length &amp;&amp; &lt;List/&gt;}</code> to "show the list only when there are items". When the cart is empty, what renders?',
            'Một component giỏ hàng viết <code>{cart.length &amp;&amp; &lt;List/&gt;}</code> để "chỉ hiện danh sách khi có món". Khi giỏ rỗng, màn hình hiện gì?',
          ),
          options: [
            B('A literal "0" appears on the page', 'Một chữ "0" hiện ra trên trang'),
            B('Nothing renders, which is the intended result', 'Không render gì — đúng như ý muốn'),
            B('React throws a runtime error', 'React ném lỗi lúc chạy'),
            B('The List renders with zero items', 'List vẫn render với không món nào'),
          ],
          correct: 0,
          explanation: EX(
            'When <code>cart.length</code> is 0, <code>0 &amp;&amp; &lt;List/&gt;</code> evaluates to <code>0</code>, and React renders that number — so a stray "0" shows up. The fix is a real boolean: <code>{cart.length &gt; 0 &amp;&amp; &lt;List/&gt;}</code>.',
            'Khi <code>cart.length</code> bằng 0, <code>0 &amp;&amp; &lt;List/&gt;</code> cho ra <code>0</code>, và React render con số đó — nên một chữ "0" lạc lõng hiện ra. Cách sửa là dùng boolean thật: <code>{cart.length &gt; 0 &amp;&amp; &lt;List/&gt;}</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'Inside JSX curly braces <code>{ }</code>, which of these is allowed?',
            'Bên trong ngoặc nhọn JSX <code>{ }</code>, thứ nào được phép?',
          ),
          options: [
            B('An expression such as a ternary or a function call', 'Một biểu thức, ví dụ toán tử ba ngôi hoặc lời gọi hàm'),
            B('An if / else statement that chooses what to render', 'Một câu lệnh if / else để chọn thứ cần render'),
            B('A for loop that pushes elements into an array', 'Một vòng lặp for để đẩy phần tử vào một mảng'),
            B('A variable declaration such as const or let', 'Một khai báo biến, chẳng hạn const hoặc let'),
          ],
          correct: 0,
          explanation: EX(
            'Curly braces embed a JavaScript <b>expression</b> — something that evaluates to a value: a variable, a ternary, <code>.map(...)</code>, a call. <b>Statements</b> (<code>if</code>, <code>for</code>, <code>const</code>) produce no value, so they cannot go inside. That is why lists use <code>.map()</code> and conditions use <code>? :</code> or <code>&amp;&amp;</code>.',
            'Ngoặc nhọn nhúng một <b>biểu thức</b> JavaScript — thứ tính ra một giá trị: một biến, toán tử ba ngôi, <code>.map(...)</code>, một lời gọi. <b>Câu lệnh</b> (<code>if</code>, <code>for</code>, <code>const</code>) không sinh ra giá trị nên không đặt vào trong được. Vì thế danh sách dùng <code>.map()</code> và điều kiện dùng <code>? :</code> hoặc <code>&amp;&amp;</code>.',
          ),
        }),

        // ── Chương 2 — Component & props ────────────────────────────────
        mcq({
          prompt: B(
            'A child receives <code>props</code>. What happens if it does <code>props.title = "new"</code>?',
            'Một component con nhận <code>props</code>. Điều gì xảy ra nếu nó làm <code>props.title = "new"</code>?',
          ),
          options: [
            B('It breaks a core rule — props are read-only and must never be mutated', 'Nó phạm luật cốt lõi — props chỉ đọc, không được sửa'),
            B('The parent re-renders with the new title', 'Component cha render lại với title mới'),
            B('React copies props so the change is safe', 'React tự sao chép props nên sửa vô hại'),
            B('It is the normal way for a child to talk to its parent', 'Đó là cách bình thường để con nói chuyện với cha'),
          ],
          correct: 0,
          explanation: EX(
            'Data flows one way: parent to child. A child treats <code>props</code> as read-only. To send data upward, the parent passes a callback prop (e.g. <code>onChange</code>) and the child calls it. Mutating props breaks React&#x27;s model and leads to bugs React cannot track.',
            'Dữ liệu chảy một chiều: từ cha xuống con. Con xem <code>props</code> là chỉ đọc. Muốn gửi dữ liệu ngược lên, cha truyền một prop callback (ví dụ <code>onChange</code>) và con gọi nó. Sửa props phá vỡ mô hình của React và gây lỗi React không lần ra được.',
          ),
        }),
        mcq({
          prompt: B(
            'What is the <code>children</code> prop?',
            'Prop <code>children</code> là gì?',
          ),
          options: [
            B('Whatever JSX you nest between a component&#x27;s opening and closing tags', 'Bất cứ JSX nào bạn lồng giữa thẻ mở và thẻ đóng của component'),
            B('A reserved list of every child component in the app', 'Một danh sách dành riêng chứa mọi component con của ứng dụng'),
            B('The DOM nodes React has already mounted', 'Các nút DOM mà React đã gắn xong'),
            B('An array of the component&#x27;s internal state values', 'Một mảng các giá trị state nội bộ của component'),
          ],
          correct: 0,
          explanation: EX(
            '<code>&lt;Card&gt;anything here&lt;/Card&gt;</code> passes "anything here" to <code>Card</code> as <code>props.children</code>. It lets you build wrapper/layout components by <b>composition</b> — the wrapper renders <code>{children}</code> in a slot — which React favours over inheritance.',
            '<code>&lt;Card&gt;nội dung ở đây&lt;/Card&gt;</code> truyền "nội dung ở đây" vào <code>Card</code> qua <code>props.children</code>. Nhờ nó bạn dựng component bọc/bố cục bằng <b>ghép nối (composition)</b> — component bọc render <code>{children}</code> vào một chỗ trống — cách React ưa dùng hơn kế thừa.',
          ),
        }),
        mcq({
          prompt: B(
            'A component name must start with a capital letter. What happens with <code>&lt;greeting /&gt;</code> (lowercase)?',
            'Tên component phải viết hoa chữ đầu. Điều gì xảy ra với <code>&lt;greeting /&gt;</code> (viết thường)?',
          ),
          options: [
            B('React treats it as a built-in HTML tag named "greeting", not your component', 'React coi nó là thẻ HTML tên "greeting", không phải component của bạn'),
            B('It works the same — casing does not matter in JSX', 'Vẫn chạy như thường — JSX không phân biệt hoa thường'),
            B('The compiler renames it to Greeting automatically', 'Trình biên dịch tự đổi tên thành Greeting'),
            B('React throws "component not found" at build time', 'React báo "không tìm thấy component" lúc build'),
          ],
          correct: 0,
          explanation: EX(
            'JSX decides by casing: a lowercase tag becomes a string type (<code>"greeting"</code>) — an HTML element — while a capitalised tag becomes a reference to your component variable. So <code>&lt;greeting/&gt;</code> renders an unknown custom element, not your <code>Greeting</code> function.',
            'JSX phân biệt bằng cách viết hoa: thẻ viết thường trở thành kiểu chuỗi (<code>"greeting"</code>) — một phần tử HTML — còn thẻ viết hoa trở thành tham chiếu tới biến component của bạn. Nên <code>&lt;greeting/&gt;</code> render ra một phần tử lạ, không phải hàm <code>Greeting</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'What does destructuring with a default do here?' + code(
              'function Badge({ tone = "info" }) { return <span className={tone} />; }',
            ),
            'Việc phân rã kèm giá trị mặc định ở đây làm gì?' + code(
              'function Badge({ tone = "info" }) { return <span className={tone} />; }',
            ),
          ),
          options: [
            B('If the parent omits tone, it becomes "info"; otherwise the parent&#x27;s value is used', 'Nếu cha không truyền tone thì nó thành "info"; ngược lại dùng giá trị của cha'),
            B('It forces tone to always be "info" regardless of the parent', 'Nó ép tone luôn là "info" bất kể cha truyền gì'),
            B('It makes tone a piece of internal state', 'Nó biến tone thành một mẩu state nội bộ'),
            B('It throws if the parent does not pass tone', 'Nó báo lỗi nếu cha không truyền tone'),
          ],
          correct: 0,
          explanation: EX(
            'A default value in destructuring only applies when the prop is <code>undefined</code> (missing). If the parent passes <code>tone="danger"</code>, that wins. Defaults keep components usable without forcing every caller to specify every prop.',
            'Giá trị mặc định khi phân rã chỉ áp dụng khi prop là <code>undefined</code> (thiếu). Nếu cha truyền <code>tone="danger"</code> thì giá trị đó thắng. Mặc định giúp component dùng được mà không bắt mọi nơi gọi phải truyền đủ prop.',
          ),
        }),

        // ── Chương 3 — State ────────────────────────────────────────────
        mcq({
          prompt: B(
            'A click handler runs <code>setCount(count + 1)</code> three times in a row. <code>count</code> is 0. After the click, what is <code>count</code>?',
            'Một handler chạy <code>setCount(count + 1)</code> ba lần liên tiếp. <code>count</code> đang là 0. Sau cú click, <code>count</code> là bao nhiêu?',
          ),
          options: [
            B('1 — all three read the same snapshot of count (0)', '1 — cả ba lần đọc cùng một ảnh chụp của count (0)'),
            B('3 — each call adds one to the latest value', '3 — mỗi lần gọi cộng thêm một vào giá trị mới nhất'),
            B('0 — the updates cancel out', '0 — các lần cập nhật triệt tiêu nhau'),
            B('It depends on how fast the user clicks', 'Tuỳ người dùng click nhanh hay chậm'),
          ],
          correct: 0,
          explanation: EX(
            'State is a <b>snapshot</b> for the duration of a render. All three calls read <code>count</code> as 0, so each computes <code>0 + 1</code> and the last one wins: 1. To add three, use the updater form <code>setCount(c =&gt; c + 1)</code>, which queues on the latest value and gives 3.',
            'State là một <b>ảnh chụp</b> suốt một lần render. Cả ba lời gọi đọc <code>count</code> bằng 0, nên đều tính <code>0 + 1</code> và lần cuối thắng: 1. Muốn cộng ba, dùng dạng hàm cập nhật <code>setCount(c =&gt; c + 1)</code> — nó xếp hàng trên giá trị mới nhất và cho ra 3.',
          ),
        }),
        mcq({
          prompt: B(
            'Which line correctly updates state to append an item, without mutating?',
            'Dòng nào cập nhật state để thêm phần tử một cách đúng đắn, không mutate?',
          ),
          options: [
            B('setItems([...items, next])', 'setItems([...items, next])'),
            B('items.push(next); setItems(items)', 'items.push(next); setItems(items)'),
            B('setItems(items.push(next))', 'setItems(items.push(next))'),
            B('items[items.length] = next', 'items[items.length] = next'),
          ],
          correct: 0,
          explanation: EX(
            'React compares by reference. You must create a <b>new</b> array: <code>[...items, next]</code>. <code>items.push(next)</code> mutates the same array (same reference), so React may skip the re-render; and <code>push</code> returns the new length, not the array, so <code>setItems(items.push(next))</code> stores a number.',
            'React so sánh theo tham chiếu. Bạn phải tạo mảng <b>mới</b>: <code>[...items, next]</code>. <code>items.push(next)</code> sửa ngay mảng cũ (cùng tham chiếu) nên React có thể bỏ qua việc render lại; và <code>push</code> trả về độ dài mới chứ không phải mảng, nên <code>setItems(items.push(next))</code> lưu vào một con số.',
          ),
        }),
        mcq({
          prompt: B(
            'You have <code>firstName</code> and <code>lastName</code> in state. You also keep <code>fullName</code> in state and update it in an effect. What is the problem?',
            'Bạn có <code>firstName</code> và <code>lastName</code> trong state. Bạn còn giữ <code>fullName</code> trong state và cập nhật nó trong một effect. Vấn đề là gì?',
          ),
          options: [
            B('fullName is derived — compute it during render instead of storing it', 'fullName là dữ liệu suy ra — hãy tính lúc render thay vì lưu vào state'),
            B('Nothing — mirroring values into state is the recommended pattern', 'Không sao — sao chép giá trị vào state là mẫu được khuyến nghị'),
            B('You must store it in a ref, not state', 'Bạn phải lưu nó trong ref, không phải state'),
            B('fullName should be a prop passed from the parent', 'fullName phải là prop truyền từ cha xuống'),
          ],
          correct: 0,
          explanation: EX(
            'Anything computable from existing state/props is <b>derived state</b> — compute it inline: <code>const fullName = firstName + " " + lastName</code>. Storing a copy and syncing it in an effect adds an extra render and a chance for the two to drift out of sync.',
            'Bất cứ thứ gì tính được từ state/props sẵn có đều là <b>dữ liệu suy ra</b> — hãy tính ngay: <code>const fullName = firstName + " " + lastName</code>. Lưu một bản sao rồi đồng bộ trong effect vừa thêm một lần render, vừa mở đường cho hai giá trị lệch nhau.',
          ),
        }),
        mcq({
          prompt: B(
            'Both of the "two rules of hooks" — which pair is correct?',
            'Hai "luật của hooks" — cặp nào đúng?',
          ),
          options: [
            B('Only call hooks at the top level, and only from React functions/custom hooks', 'Chỉ gọi hooks ở cấp cao nhất, và chỉ từ hàm React hoặc custom hook'),
            B('Call hooks only inside loops, and only in class components', 'Chỉ gọi hooks trong vòng lặp, và chỉ trong class component'),
            B('Call hooks inside conditions, and only in effects', 'Gọi hooks trong điều kiện, và chỉ trong effect'),
            B('Call hooks anywhere, as long as you memoize them', 'Gọi hooks ở đâu cũng được, miễn là có memo'),
          ],
          correct: 0,
          explanation: EX(
            'React matches each hook to its state by <b>call order</b>, so the order must be identical on every render: never put a hook inside an <code>if</code>, loop, or nested function. And hooks only work inside a component or another hook — not in plain functions or event handlers.',
            'React gắn mỗi hook với state của nó theo <b>thứ tự gọi</b>, nên thứ tự phải giống hệt ở mọi lần render: đừng đặt hook trong <code>if</code>, vòng lặp hay hàm lồng. Và hooks chỉ chạy được trong component hoặc trong một hook khác — không phải trong hàm thường hay handler sự kiện.',
          ),
        }),
        mcq({
          prompt: B(
            'You need to update one field of an object in state: <code>const [user, setUser] = useState({ name: "", age: 0 })</code>. Which sets only <code>age</code>?',
            'Bạn cần sửa một trường của object trong state: <code>const [user, setUser] = useState({ name: "", age: 0 })</code>. Dòng nào chỉ đặt <code>age</code>?',
          ),
          options: [
            B('setUser({ ...user, age: 30 })', 'setUser({ ...user, age: 30 })'),
            B('setUser({ age: 30 })', 'setUser({ age: 30 })'),
            B('user.age = 30', 'user.age = 30'),
            B('setUser(user.age = 30)', 'setUser(user.age = 30)'),
          ],
          correct: 0,
          explanation: EX(
            'State replaces, it does not merge (unlike class <code>setState</code>). <code>{ age: 30 }</code> would drop <code>name</code>. Spread the old object first: <code>{ ...user, age: 30 }</code> keeps every other field and overrides just <code>age</code>. Direct assignment mutates and does not trigger a render.',
            'State thay thế chứ không trộn (khác với <code>setState</code> của class). <code>{ age: 30 }</code> sẽ làm mất <code>name</code>. Hãy spread object cũ trước: <code>{ ...user, age: 30 }</code> giữ lại mọi trường khác và chỉ ghi đè <code>age</code>. Gán trực tiếp là mutate và không kích hoạt render.',
          ),
        }),

        // ── Chương 4 — Sự kiện & khuôn nhập ─────────────────────────────
        mcq({
          prompt: B(
            'A controlled text input needs which two things to work?',
            'Một ô nhập văn bản có kiểm soát cần hai thứ nào để hoạt động?',
          ),
          options: [
            B('value={state} and onChange that updates the state', 'value={state} và onChange cập nhật state'),
            B('defaultValue={state} and a ref', 'defaultValue={state} và một ref'),
            B('onInput and an uncontrolled ref', 'onInput và một ref không kiểm soát'),
            B('value={state} alone, React fills onChange automatically', 'Chỉ value={state}, React tự thêm onChange'),
          ],
          correct: 0,
          explanation: EX(
            'A controlled input takes its displayed value from state (<code>value={text}</code>) and reports edits back with <code>onChange</code> (<code>e =&gt; setText(e.target.value)</code>). With <code>value</code> but no <code>onChange</code>, the field is frozen and read-only — React warns about exactly this.',
            'Ô nhập có kiểm soát lấy giá trị hiển thị từ state (<code>value={text}</code>) và báo mọi thay đổi về bằng <code>onChange</code> (<code>e =&gt; setText(e.target.value)</code>). Có <code>value</code> mà thiếu <code>onChange</code> thì ô bị đông cứng, chỉ đọc — React cảnh báo đúng điều này.',
          ),
        }),
        mcq({
          prompt: B(
            'A form&#x27;s submit handler starts with <code>function onSubmit(e) { ... }</code>. What must the first line be to stop a full-page reload?',
            'Handler submit của form bắt đầu bằng <code>function onSubmit(e) { ... }</code>. Dòng đầu tiên phải là gì để trang không tải lại toàn bộ?',
          ),
          options: [
            B('e.preventDefault()', 'e.preventDefault()'),
            B('return false', 'return false'),
            B('e.stopPropagation()', 'e.stopPropagation()'),
            B('window.reload = false', 'window.reload = false'),
          ],
          correct: 0,
          explanation: EX(
            'The browser&#x27;s default for a form submit is a navigation/reload. <code>e.preventDefault()</code> cancels that so your JS handles the submit. <code>stopPropagation</code> only stops the event bubbling to parents; <code>return false</code> works in old inline HTML handlers, not React synthetic events.',
            'Mặc định của trình duyệt khi submit form là điều hướng/tải lại. <code>e.preventDefault()</code> huỷ điều đó để JS của bạn xử lý việc gửi. <code>stopPropagation</code> chỉ chặn sự kiện nổi bọt lên cha; còn <code>return false</code> chỉ hiệu nghiệm với handler HTML inline kiểu cũ, không phải sự kiện tổng hợp của React.',
          ),
        }),
        mcq({
          prompt: B(
            'A search box submits on Enter. A Vietnamese/Japanese user types with an IME and the box submits <b>mid-word</b>. What guard fixes this?',
            'Một ô tìm kiếm submit khi bấm Enter. Người dùng gõ tiếng Việt/Nhật bằng bộ gõ (IME) và ô lại submit <b>giữa chừng một từ</b>. Chốt chặn nào sửa được?',
          ),
          options: [
            B('Ignore the key when e.nativeEvent.isComposing is true', 'Bỏ qua phím khi e.nativeEvent.isComposing là true'),
            B('Add a setTimeout before submitting', 'Thêm setTimeout trước khi submit'),
            B('Switch the input to uncontrolled', 'Chuyển ô sang không kiểm soát'),
            B('Use onInput instead of onKeyDown', 'Dùng onInput thay cho onKeyDown'),
          ],
          correct: 0,
          explanation: EX(
            'While an IME is composing (picking Vietnamese tones or Japanese kanji), Enter/Space confirm the candidate — they are not a submit. Check <code>e.nativeEvent.isComposing</code> (or <code>e.isComposing</code>) and return early. This is a real bug we hit across Messenger, Feed and Code Lab.',
            'Khi IME đang soạn (chọn dấu tiếng Việt hay kanji tiếng Nhật), Enter/Space là để xác nhận ứng viên — không phải để submit. Hãy kiểm <code>e.nativeEvent.isComposing</code> (hoặc <code>e.isComposing</code>) rồi thoát sớm. Đây là lỗi thật đã gặp ở Messenger, Feed và Code Lab.',
          ),
        }),
        mcq({
          prompt: B(
            'What is the difference between a controlled and an uncontrolled input?',
            'Ô nhập có kiểm soát và không kiểm soát khác nhau ở đâu?',
          ),
          options: [
            B('Controlled keeps the value in state; uncontrolled keeps it in the DOM, read via a ref', 'Có kiểm soát giữ giá trị trong state; không kiểm soát giữ trong DOM, đọc qua ref'),
            B('Controlled uses onChange; uncontrolled cannot have any handler', 'Có kiểm soát dùng onChange; không kiểm soát không được có handler nào'),
            B('They are two names for the same thing', 'Đó là hai tên gọi của cùng một thứ'),
            B('Uncontrolled inputs cannot be used inside a form', 'Ô không kiểm soát không dùng được trong form'),
          ],
          correct: 0,
          explanation: EX(
            'Controlled: React state is the single source of truth (<code>value</code> + <code>onChange</code>). Uncontrolled: the DOM node holds the value and you read it when needed via a <code>ref</code> (often with <code>defaultValue</code> for the initial text). Controlled is the default choice; uncontrolled suits quick, write-only fields.',
            'Có kiểm soát: state React là nguồn sự thật duy nhất (<code>value</code> + <code>onChange</code>). Không kiểm soát: nút DOM giữ giá trị và bạn đọc khi cần qua <code>ref</code> (thường kèm <code>defaultValue</code> cho chữ ban đầu). Có kiểm soát là lựa chọn mặc định; không kiểm soát hợp với các ô nhanh, chỉ ghi.',
          ),
        }),

        // ── Chương 5 — useEffect ────────────────────────────────────────
        mcq({
          prompt: B(
            'When does the function returned from a useEffect (its cleanup) run?',
            'Hàm được trả về từ một useEffect (phần dọn dẹp) chạy khi nào?',
          ),
          options: [
            B('Before the next effect run, and once when the component unmounts', 'Trước lần chạy effect kế tiếp, và một lần khi component bị gỡ'),
            B('Only once, immediately after the first render', 'Chỉ một lần, ngay sau lần render đầu'),
            B('On every render, before the render happens', 'Ở mọi lần render, trước khi render diễn ra'),
            B('Never — cleanup is optional and ignored', 'Không bao giờ — dọn dẹp là tuỳ chọn và bị bỏ qua'),
          ],
          correct: 0,
          explanation: EX(
            'Cleanup runs to undo the previous effect: right before the effect fires again (because a dependency changed) and once at unmount. That is how you remove a listener, clear a timer, or close a socket so effects do not stack up.',
            'Dọn dẹp chạy để hoàn tác effect trước đó: ngay trước khi effect chạy lại (vì một dependency đổi) và một lần lúc gỡ component. Đó là cách bạn gỡ listener, xoá timer, hay đóng socket để các effect không chồng lên nhau.',
          ),
        }),
        mcq({
          prompt: B(
            'In development with StrictMode, an effect with <code>[]</code> deps seems to run its setup twice on mount. Why?',
            'Trong môi trường phát triển có StrictMode, một effect với mảng deps <code>[]</code> có vẻ chạy phần setup hai lần lúc mount. Vì sao?',
          ),
          options: [
            B('StrictMode mounts, cleans up, and remounts once to surface missing cleanup', 'StrictMode mount, dọn dẹp, rồi mount lại một lần để lộ ra chỗ thiếu dọn dẹp'),
            B('It is a bug in React that you should ignore', 'Đó là lỗi của React, cứ bỏ qua'),
            B('The dependency array is wrong', 'Mảng dependency bị sai'),
            B('Production also always runs effects twice', 'Bản production cũng luôn chạy effect hai lần'),
          ],
          correct: 0,
          explanation: EX(
            'In dev only, StrictMode intentionally runs setup → cleanup → setup so effects that lack proper cleanup (a doubled subscription, a leaked timer) show up immediately. Production runs the effect once. Verified pattern: <code>[run, clean, run]</code>.',
            'Chỉ ở môi trường dev, StrictMode cố ý chạy setup → cleanup → setup để những effect thiếu dọn dẹp đúng cách (đăng ký lặp, timer rò rỉ) lộ ra ngay. Bản production chỉ chạy effect một lần. Mẫu đã kiểm: <code>[run, clean, run]</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'An effect logs <code>count</code> every second: <code>useEffect(() =&gt; { const id = setInterval(() =&gt; console.log(count), 1000); return () =&gt; clearInterval(id); }, [])</code>. Why does it always log 0?',
            'Một effect log <code>count</code> mỗi giây: <code>useEffect(() =&gt; { const id = setInterval(() =&gt; console.log(count), 1000); return () =&gt; clearInterval(id); }, [])</code>. Vì sao nó luôn log 0?',
          ),
          options: [
            B('The interval closes over count from the first render — a stale closure', 'Interval bắt giữ count của lần render đầu — một closure cũ (stale)'),
            B('setInterval cannot read state at all', 'setInterval không đọc được state'),
            B('clearInterval resets count to 0', 'clearInterval đặt lại count về 0'),
            B('The empty deps array disables the effect', 'Mảng deps rỗng làm effect ngừng hoạt động'),
          ],
          correct: 0,
          explanation: EX(
            'With <code>[]</code>, the effect runs once and its callback captures <code>count</code> as it was then (0). It never re-subscribes to newer values. Fixes: add <code>count</code> to deps (re-creates the interval), or use the updater form / a ref to read the latest value.',
            'Với <code>[]</code>, effect chạy một lần và callback bắt giữ <code>count</code> đúng lúc đó (0). Nó không bao giờ đăng ký lại với giá trị mới. Cách sửa: thêm <code>count</code> vào deps (tạo lại interval), hoặc dùng dạng hàm cập nhật / một ref để đọc giá trị mới nhất.',
          ),
        }),
        mcq({
          prompt: B(
            'You fetch data in an effect when a search term changes. What prevents an out-of-order response from overwriting a newer one?',
            'Bạn tải dữ liệu trong effect mỗi khi từ khoá tìm kiếm đổi. Điều gì ngăn một phản hồi về trễ ghi đè lên phản hồi mới hơn?',
          ),
          options: [
            B('A cleanup that sets an "ignore" flag or aborts the request', 'Một hàm dọn dẹp đặt cờ "bỏ qua" hoặc huỷ request'),
            B('Wrapping the fetch in a try/catch', 'Bọc lời gọi fetch trong try/catch'),
            B('Removing the dependency array', 'Bỏ mảng dependency đi'),
            B('Using JSON.parse on the response', 'Dùng JSON.parse cho phản hồi'),
          ],
          correct: 0,
          explanation: EX(
            'Each effect run should ignore its result if a newer run has started. The cleanup sets <code>ignore = true</code> (or calls <code>controller.abort()</code>); the resolved fetch checks the flag before calling <code>setState</code>. Without it, a slow response for an old term can clobber the current results — a race condition.',
            'Mỗi lần effect chạy nên bỏ qua kết quả của mình nếu đã có lần chạy mới hơn. Hàm dọn dẹp đặt <code>ignore = true</code> (hoặc gọi <code>controller.abort()</code>); khi fetch xong sẽ kiểm cờ trước khi gọi <code>setState</code>. Thiếu nó, một phản hồi chậm của từ khoá cũ có thể đè kết quả hiện tại — một race condition.',
          ),
        }),
        mcq({
          prompt: B(
            'Which task does NOT belong in a useEffect?',
            'Việc nào KHÔNG nên nằm trong useEffect?',
          ),
          options: [
            B('Transforming props into what you render on screen', 'Biến đổi props thành thứ hiển thị trên màn hình'),
            B('Subscribing to a WebSocket', 'Đăng ký một WebSocket'),
            B('Setting up a timer', 'Thiết lập một bộ đếm giờ'),
            B('Syncing with a non-React widget (a map, a chart)', 'Đồng bộ với một widget ngoài React (bản đồ, biểu đồ)'),
          ],
          correct: 0,
          explanation: EX(
            'Effects are for <b>synchronising with systems outside React</b> — subscriptions, timers, manual DOM, network. Turning props/state into rendered output is plain rendering: compute it during render, not in an effect. An effect for that just adds a needless extra render.',
            'Effect là để <b>đồng bộ với các hệ thống ngoài React</b> — đăng ký, timer, thao tác DOM tay, mạng. Biến props/state thành thứ hiển thị chỉ là việc render bình thường: hãy tính lúc render, đừng đưa vào effect. Dùng effect cho việc đó chỉ thêm một lần render thừa.',
          ),
        }),

        // ── Chương 6 — Hộp công cụ hooks ────────────────────────────────
        mcq({
          prompt: B(
            'What is the key behavioural difference between <code>useRef</code> and <code>useState</code>?',
            'Khác biệt hành vi cốt lõi giữa <code>useRef</code> và <code>useState</code> là gì?',
          ),
          options: [
            B('Changing a ref&#x27;s .current does NOT trigger a re-render; changing state does', 'Đổi .current của ref KHÔNG kích hoạt render lại; đổi state thì có'),
            B('A ref triggers a re-render but state does not', 'Ref kích hoạt render lại còn state thì không'),
            B('Both trigger re-renders identically', 'Cả hai đều kích hoạt render lại như nhau'),
            B('Refs can only hold DOM nodes, never plain values', 'Ref chỉ giữ được nút DOM, không giữ giá trị thường'),
          ],
          correct: 0,
          explanation: EX(
            'A ref is a mutable box that survives renders but is invisible to React&#x27;s render cycle — mutate <code>ref.current</code> and nothing re-renders. State is the opposite: setting it schedules a render. Use a ref for values the UI does not need to reflect (a timer id, the previous value, a DOM node).',
            'Ref là một chiếc hộp có thể sửa, sống sót qua các lần render nhưng vô hình với vòng render của React — sửa <code>ref.current</code> thì không có gì render lại. State thì ngược lại: đặt nó là lên lịch render. Dùng ref cho những giá trị UI không cần phản ánh (id của timer, giá trị trước đó, một nút DOM).',
          ),
        }),
        mcq({
          prompt: B(
            'When is <code>useMemo</code> actually worth adding?',
            'Khi nào <code>useMemo</code> thật sự đáng thêm vào?',
          ),
          options: [
            B('When a computation is genuinely expensive, or its result must be a stable reference', 'Khi một phép tính thật sự nặng, hoặc kết quả cần là một tham chiếu ổn định'),
            B('On every single derived value, always, just to be on the safe side', 'Cho từng giá trị suy ra một, luôn luôn, chỉ để cho chắc ăn'),
            B('Only inside class components, never in function components', 'Chỉ trong class component, không bao giờ trong function component'),
            B('To store values that should trigger a re-render when they change', 'Để lưu những giá trị cần kích hoạt render lại khi chúng đổi'),
          ],
          correct: 0,
          explanation: EX(
            '<code>useMemo</code> caches a computed value between renders while its deps are unchanged. It pays off for heavy work or to keep an object/array reference stable (so a <code>React.memo</code> child or an effect dep does not see a "new" value each render). Wrapping cheap values everywhere just adds overhead.',
            '<code>useMemo</code> lưu tạm một giá trị đã tính giữa các lần render khi deps chưa đổi. Nó đáng giá cho việc tính nặng, hoặc để giữ tham chiếu object/mảng ổn định (để component con <code>React.memo</code> hay một dep của effect không thấy giá trị "mới" mỗi lần render). Bọc bừa các giá trị rẻ chỉ thêm gánh nặng.',
          ),
        }),
        mcq({
          prompt: B(
            'What does a custom hook such as <code>useLocalStorage()</code> let you share between components?',
            'Một custom hook như <code>useLocalStorage()</code> cho phép chia sẻ gì giữa các component?',
          ),
          options: [
            B('Stateful logic — each component that calls it gets its own separate state', 'Logic có state — mỗi component gọi nó có state riêng của mình'),
            B('A single shared state instance across every component that calls it', 'Một thể hiện state dùng chung cho mọi component gọi tới nó'),
            B('Ready-made JSX markup that has already been rendered to the DOM', 'JSX đã dựng sẵn và đã được render ra DOM'),
            B('Nothing at all, because custom hooks cannot call other hooks', 'Không gì cả, vì custom hook không được gọi hook khác'),
          ],
          correct: 0,
          explanation: EX(
            'A custom hook is just a function starting with "use" that calls other hooks. It shares <b>logic</b>, not state: two components calling <code>useLocalStorage("k")</code> each run the hook independently and hold independent state. To share one state, lift it up or use a store/context.',
            'Custom hook chỉ là một hàm bắt đầu bằng "use" và gọi các hook khác. Nó chia sẻ <b>logic</b>, không phải state: hai component cùng gọi <code>useLocalStorage("k")</code> đều chạy hook độc lập và giữ state riêng. Muốn dùng chung một state thì nâng nó lên trên hoặc dùng store/context.',
          ),
        }),
        mcq({
          prompt: B(
            'When is <code>useReducer</code> a better fit than several <code>useState</code> calls?',
            'Khi nào <code>useReducer</code> hợp hơn nhiều lời gọi <code>useState</code>?',
          ),
          options: [
            B('When the next state depends on the previous state and updates come in several related types', 'Khi state kế tiếp phụ thuộc state trước, và các cập nhật đến theo nhiều kiểu liên quan nhau'),
            B('Whenever a component has more than one piece of state', 'Bất cứ khi nào component có nhiều hơn một mẩu state'),
            B('Only for state that must persist to a database', 'Chỉ cho state cần lưu xuống cơ sở dữ liệu'),
            B('Never — useReducer is deprecated', 'Không bao giờ — useReducer đã bị loại bỏ'),
          ],
          correct: 0,
          explanation: EX(
            '<code>useReducer</code> centralises transitions in one pure <code>(state, action) =&gt; newState</code> function. It shines when updates are interrelated (a form, a wizard, a cart) and each depends on the current state — easier to test and reason about than juggling many setters.',
            '<code>useReducer</code> gom mọi phép chuyển trạng thái vào một hàm thuần <code>(state, action) =&gt; newState</code>. Nó toả sáng khi các cập nhật liên quan nhau (một form, một wizard, một giỏ hàng) và mỗi cập nhật phụ thuộc state hiện tại — dễ kiểm thử và suy luận hơn là tung hứng nhiều setter.',
          ),
        }),

        // ── Chương 7 — Danh sách, key & hiệu năng ───────────────────────
        mcq({
          prompt: B(
            'Why is the array index a poor <code>key</code> for a list that can reorder, insert, or delete?',
            'Vì sao chỉ số mảng là <code>key</code> tồi cho danh sách có thể sắp xếp lại, chèn hoặc xoá?',
          ),
          options: [
            B('An item&#x27;s index shifts when the list changes, so React binds it to the wrong state/DOM', 'Chỉ số của phần tử xê dịch khi danh sách đổi, nên React gắn nó với state/DOM sai'),
            B('Array indexes are strings, whereas React keys are required to be numbers', 'Chỉ số mảng là chuỗi, trong khi key của React bắt buộc phải là số'),
            B('React forbids numeric keys and only accepts string identifiers', 'React cấm key kiểu số và chỉ chấp nhận định danh dạng chuỗi'),
            B('Using indexes makes every list render measurably slower in all cases', 'Dùng chỉ số làm mọi danh sách render chậm thấy rõ trong mọi trường hợp'),
          ],
          correct: 0,
          explanation: EX(
            'A key identifies an item across renders. With an index, deleting the first item shifts every other item&#x27;s key by one, so React thinks items changed identity — it reuses the wrong DOM/state (a wrong checkbox stays checked, an input keeps the wrong text). Use a stable id from the data.',
            'Key định danh một phần tử qua các lần render. Dùng chỉ số, xoá phần tử đầu làm key của mọi phần tử còn lại lệch đi một, nên React tưởng các phần tử đổi danh tính — nó tái dùng nhầm DOM/state (một ô tích sai vẫn được tích, một ô nhập giữ chữ sai). Hãy dùng một id ổn định từ dữ liệu.',
          ),
        }),
        mcq({
          prompt: B(
            'What does wrapping a component in <code>React.memo</code> do?',
            '<code>React.memo</code> bọc quanh một component làm gì?',
          ),
          options: [
            B('Skips re-rendering it when its props are shallow-equal to the previous props', 'Bỏ qua render lại khi props của nó nông-bằng với props lần trước'),
            B('Caches the component&#x27;s state to localStorage', 'Lưu state của component vào localStorage'),
            B('Prevents the component from ever re-rendering', 'Ngăn component render lại vĩnh viễn'),
            B('Memoizes an expensive value inside the component', 'Lưu tạm một giá trị nặng bên trong component'),
          ],
          correct: 0,
          explanation: EX(
            '<code>React.memo</code> does a shallow comparison of props; if none changed, it reuses the last render and skips this one. It still re-renders when props actually change or its own state updates. Beware: a new inline object/function prop each render defeats it — pair it with <code>useMemo</code>/<code>useCallback</code>.',
            '<code>React.memo</code> so sánh nông props; nếu không có gì đổi, nó tái dùng lần render trước và bỏ qua lần này. Nó vẫn render lại khi props thật sự đổi hoặc state của chính nó cập nhật. Cẩn thận: một prop object/hàm inline mới mỗi lần render sẽ vô hiệu hoá nó — hãy ghép với <code>useMemo</code>/<code>useCallback</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'Two different components are rendered at the same position across renders: first <code>&lt;Login/&gt;</code>, then <code>&lt;Dashboard/&gt;</code>. What does React do?',
            'Hai component khác nhau được render ở cùng một vị trí qua các lần render: đầu là <code>&lt;Login/&gt;</code>, sau là <code>&lt;Dashboard/&gt;</code>. React làm gì?',
          ),
          options: [
            B('It unmounts Login (losing its state) and mounts Dashboard fresh', 'Nó gỡ Login (mất state của nó) và mount Dashboard mới tinh'),
            B('It keeps Login&#x27;s state and reuses it for Dashboard', 'Nó giữ state của Login và tái dùng cho Dashboard'),
            B('It renders both at once', 'Nó render cả hai cùng lúc'),
            B('It throws because the type changed', 'Nó báo lỗi vì kiểu component đổi'),
          ],
          correct: 0,
          explanation: EX(
            'During reconciliation, if the element <b>type</b> at a position changes, React tears down the old subtree (state and DOM) and builds the new one from scratch — verified pattern <code>[mount, unmount, mount]</code>. Same type + same position → React updates in place and keeps state.',
            'Trong quá trình reconciliation, nếu <b>kiểu</b> phần tử ở một vị trí đổi, React phá bỏ cây con cũ (state và DOM) và dựng cây mới từ đầu — mẫu đã kiểm <code>[mount, unmount, mount]</code>. Cùng kiểu + cùng vị trí → React cập nhật tại chỗ và giữ state.',
          ),
        }),
        mcq({
          prompt: B(
            'You want a form component to fully reset its internal state when the selected user changes. A clean trick is to…',
            'Bạn muốn một component form đặt lại hoàn toàn state nội bộ khi người dùng được chọn đổi. Mẹo gọn là…',
          ),
          options: [
            B('Give it key={userId} so React remounts it on a new id', 'Đặt cho nó key={userId} để React mount lại khi id đổi'),
            B('Call setState in the render body', 'Gọi setState ngay trong thân render'),
            B('Wrap it in React.memo', 'Bọc nó trong React.memo'),
            B('Add a useEffect with no dependencies', 'Thêm một useEffect không có dependency'),
          ],
          correct: 0,
          explanation: EX(
            'Changing a component&#x27;s <code>key</code> makes React treat it as a different element at that position, so it unmounts the old one and mounts a fresh instance — all internal state is reset. <code>key={userId}</code> is the idiomatic "reset on identity change" pattern.',
            'Đổi <code>key</code> của một component khiến React coi nó là phần tử khác ở vị trí đó, nên nó gỡ cái cũ và mount một thể hiện mới — toàn bộ state nội bộ được đặt lại. <code>key={userId}</code> là mẫu "đặt lại khi danh tính đổi" đúng chất React.',
          ),
        }),
        mcq({
          prompt: B(
            'A parent passes <code>onClick={() =&gt; doThing(id)}</code> to a <code>React.memo</code> child, and the child still re-renders every time. Why?',
            'Một component cha truyền <code>onClick={() =&gt; doThing(id)}</code> cho một con <code>React.memo</code>, mà con vẫn render lại mỗi lần. Vì sao?',
          ),
          options: [
            B('A new arrow function is created each render, so the prop is never shallow-equal', 'Một hàm mũi tên mới được tạo mỗi lần render, nên prop không bao giờ nông-bằng'),
            B('React.memo does not compare function props', 'React.memo không so sánh prop kiểu hàm'),
            B('The child has its own state that changes', 'Con có state riêng đang thay đổi'),
            B('memo only works on the very first render', 'memo chỉ hiệu nghiệm ở lần render đầu tiên'),
          ],
          correct: 0,
          explanation: EX(
            'Every render makes a brand-new function object, which is not <code>===</code> to last render&#x27;s — so the memoized child sees a changed prop and re-renders. Wrap the handler in <code>useCallback([id])</code> so its reference stays stable while <code>id</code> is unchanged.',
            'Mỗi lần render tạo một object hàm mới toanh, không <code>===</code> với lần render trước — nên con đã memo thấy prop đổi và render lại. Hãy bọc handler bằng <code>useCallback([id])</code> để tham chiếu của nó giữ ổn định khi <code>id</code> chưa đổi.',
          ),
        }),
        mcq({
          prompt: B(
            'Lifting state up means…',
            'Nâng state lên trên (lifting state up) nghĩa là…',
          ),
          options: [
            B('Moving shared state to the closest common parent, which passes it down as props', 'Chuyển state dùng chung lên component cha chung gần nhất, rồi truyền xuống làm props'),
            B('Storing state in the browser&#x27;s global scope', 'Lưu state vào phạm vi toàn cục của trình duyệt'),
            B('Copying state into every child that needs it', 'Sao chép state vào mọi con cần dùng'),
            B('Moving state into a useEffect', 'Chuyển state vào một useEffect'),
          ],
          correct: 0,
          explanation: EX(
            'When two siblings need the same state, you cannot share it sideways. Move it up to their nearest common parent (the single source of truth) and pass the value down plus a setter callback. This keeps both children in sync through one owner.',
            'Khi hai component anh em cần cùng một state, không thể chia ngang. Hãy chuyển nó lên component cha chung gần nhất (nguồn sự thật duy nhất) rồi truyền giá trị xuống kèm một callback setter. Nhờ vậy hai con luôn đồng bộ qua một chủ sở hữu duy nhất.',
          ),
        }),

        // ── Câu lập trình 1 ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — A todos reducer + a derived selector (chapters 3 + 7).</b> Implement two pure functions that model the heart of a to-do list.</p>' +
            '<ul>' +
            '<li><code>todosReducer(state, action)</code> — returns a <b>new</b> state (never mutate) for these actions:' +
            '<ul>' +
            '<li><code>{ type: "add", text }</code> — append <code>{ id: state.nextId, text, done: false }</code> and increment <code>nextId</code>.</li>' +
            '<li><code>{ type: "toggle", id }</code> — flip <code>done</code> on the matching todo.</li>' +
            '<li><code>{ type: "clearCompleted" }</code> — drop every done todo.</li>' +
            '<li><code>{ type: "setFilter", filter }</code> — set <code>filter</code>.</li>' +
            '<li>anything else — return the state unchanged.</li>' +
            '</ul></li>' +
            '<li><code>selectVisible(state)</code> — return the todos matching <code>state.filter</code>: <code>"active"</code> → not done, <code>"done"</code> → done, anything else → all.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing block exactly as they are; do not install anything.</p>',

            '<p><b>Câu 31 — Reducer cho danh sách việc + một selector suy ra (chương 3 + 7).</b> Cài đặt hai hàm thuần mô hình hoá phần lõi của một danh sách việc.</p>' +
            '<ul>' +
            '<li><code>todosReducer(state, action)</code> — trả về state <b>mới</b> (không bao giờ mutate) cho các action:' +
            '<ul>' +
            '<li><code>{ type: "add", text }</code> — thêm <code>{ id: state.nextId, text, done: false }</code> và tăng <code>nextId</code>.</li>' +
            '<li><code>{ type: "toggle", id }</code> — đảo <code>done</code> của todo khớp id.</li>' +
            '<li><code>{ type: "clearCompleted" }</code> — bỏ mọi todo đã done.</li>' +
            '<li><code>{ type: "setFilter", filter }</code> — đặt <code>filter</code>.</li>' +
            '<li>action khác — trả về state y nguyên.</li>' +
            '</ul></li>' +
            '<li><code>selectVisible(state)</code> — trả về các todo khớp <code>state.filter</code>: <code>"active"</code> → chưa done, <code>"done"</code> → đã done, khác → tất cả.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả; không cài thêm gì.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const START = { todos: [], filter: 'all', nextId: 1 };\n\n" +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function todosReducer(state, action) {\n' +
            '  // TODO\n' +
            '}\n' +
            'function selectVisible(state) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const ACTIONS = [\n' +
            "  { type: 'add', text: 'a' }, { type: 'add', text: 'b' }, { type: 'add', text: 'c' },\n" +
            "  { type: 'toggle', id: 2 }, { type: 'setFilter', filter: 'active' },\n" +
            '];\n' +
            'let s = START;\n' +
            'for (const a of ACTIONS) s = todosReducer(s, a);\n' +
            "console.log('visible', JSON.stringify(selectVisible(s).map((t) => t.text)));\n" +
            "console.log('nextId', s.nextId, 'total', s.todos.length);\n" +
            "s = todosReducer(todosReducer(s, { type: 'toggle', id: 1 }), { type: 'clearCompleted' });\n" +
            "console.log('afterClear', JSON.stringify(s.todos.map((t) => t.id)));\n" +
            "console.log('immutable', START.todos.length === 0, START.nextId === 1);\n",
          expectedOutput:
            'visible ["a","c"]\n' +
            'nextId 4 total 3\n' +
            'afterClear [3]\n' +
            'immutable true true',
          sampleSolution:
            'function todosReducer(state, action) {\n' +
            '  switch (action.type) {\n' +
            "    case 'add':\n" +
            '      return { ...state, todos: [...state.todos, { id: state.nextId, text: action.text, done: false }], nextId: state.nextId + 1 };\n' +
            "    case 'toggle':\n" +
            '      return { ...state, todos: state.todos.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t)) };\n' +
            "    case 'clearCompleted':\n" +
            '      return { ...state, todos: state.todos.filter((t) => !t.done) };\n' +
            "    case 'setFilter':\n" +
            '      return { ...state, filter: action.filter };\n' +
            '    default:\n' +
            '      return state;\n' +
            '  }\n' +
            '}\n' +
            'function selectVisible(state) {\n' +
            '  const { todos, filter } = state;\n' +
            "  if (filter === 'active') return todos.filter((t) => !t.done);\n" +
            "  if (filter === 'done') return todos.filter((t) => t.done);\n" +
            '  return todos;\n' +
            '}\n',
          rubric: RUBRIC_CODE,
        }),

        // ── Câu lập trình 2 ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Controlled-form logic (chapters 2 + 4).</b> A form keeps its values in one state object. Implement the two pure helpers a controlled form relies on.</p>' +
            '<ul>' +
            '<li><code>updateField(values, name, value)</code> — return a <b>new</b> object equal to <code>values</code> but with <code>name</code> set to <code>value</code>. Do not mutate <code>values</code>.</li>' +
            '<li><code>validate(values)</code> — return an <code>errors</code> object with a key only for each invalid field:' +
            '<ul>' +
            '<li><code>name</code>: <code>"required"</code> if empty after trimming.</li>' +
            '<li><code>email</code>: <code>"invalid"</code> unless it looks like <code>x@y.z</code> (something, an @, something, a dot, something — no spaces).</li>' +
            '<li><code>agree</code>: <code>"must agree"</code> if not <code>true</code>.</li>' +
            '</ul>A fully valid form returns <code>{}</code>.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing block exactly as they are; do not install anything.</p>',

            '<p><b>Câu 32 — Logic của form có kiểm soát (chương 2 + 4).</b> Một form giữ giá trị trong một object state. Cài đặt hai hàm phụ trợ thuần mà form có kiểm soát dựa vào.</p>' +
            '<ul>' +
            '<li><code>updateField(values, name, value)</code> — trả về object <b>mới</b> bằng <code>values</code> nhưng đặt <code>name</code> thành <code>value</code>. Không mutate <code>values</code>.</li>' +
            '<li><code>validate(values)</code> — trả về object <code>errors</code>, chỉ có khoá cho mỗi trường không hợp lệ:' +
            '<ul>' +
            '<li><code>name</code>: <code>"required"</code> nếu rỗng sau khi trim.</li>' +
            '<li><code>email</code>: <code>"invalid"</code> trừ khi trông giống <code>x@y.z</code> (một đoạn, một @, một đoạn, một dấu chấm, một đoạn — không khoảng trắng).</li>' +
            '<li><code>agree</code>: <code>"must agree"</code> nếu không phải <code>true</code>.</li>' +
            '</ul>Form hợp lệ hoàn toàn trả về <code>{}</code>.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả; không cài thêm gì.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const INITIAL = { name: '', email: '', agree: false };\n\n" +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function updateField(values, name, value) {\n' +
            '  // TODO\n' +
            '}\n' +
            'function validate(values) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'let v = INITIAL;\n' +
            "v = updateField(v, 'name', 'Bình');\n" +
            "v = updateField(v, 'email', 'binh@');\n" +
            "v = updateField(v, 'agree', true);\n" +
            "console.log('errors1', JSON.stringify(validate(v)));\n" +
            "v = updateField(v, 'email', 'binh@ct.vn');\n" +
            "console.log('errors2', JSON.stringify(validate(v)));\n" +
            "console.log('untouched', INITIAL.name === '' && INITIAL.agree === false);\n" +
            "console.log('values', JSON.stringify(v));\n",
          expectedOutput:
            'errors1 {"email":"invalid"}\n' +
            'errors2 {}\n' +
            'untouched true\n' +
            'values {"name":"Bình","email":"binh@ct.vn","agree":true}',
          sampleSolution:
            'function updateField(values, name, value) {\n' +
            '  return { ...values, [name]: value };\n' +
            '}\n' +
            'function validate(values) {\n' +
            '  const errors = {};\n' +
            "  if (!values.name.trim()) errors.name = 'required';\n" +
            "  if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(values.email)) errors.email = 'invalid';\n" +
            "  if (!values.agree) errors.agree = 'must agree';\n" +
            '  return errors;\n' +
            '}\n',
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
