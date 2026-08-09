/**
 * Next.js & React — Final Exam 5 (FE-5): 50 câu trắc nghiệm phủ cả 20 chương.
 *
 * Đề tự soạn, khác câu với FE-1/2/3/4. Mọi đoạn JSX/JS hỏi "in ra gì" đã CHẠY
 * THẬT (react-dom/server / node). Bốn lựa chọn mỗi câu viết cân độ dài.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NEXTJS-FE5.mjs --apply
 */
import { B, EX, code, mcq } from './_lib/nextjs-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en"><p><b>Final Exam</b> — 50 multiple-choice questions across all 20 chapters. Code questions were run to get their output. Some say "choose TWO". The timer auto-submits; explanations are bilingual.</p></div>' +
  '<div class="ml-vi"><p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả 20 chương. Câu hỏi mã đã được chạy để lấy kết quả. Vài câu ghi "chọn HAI". Hết giờ tự nộp; lời giải song ngữ.</p></div>';

export default {
  course: { slug: 'nextjs' },
  exams: [
    {
      kind: 'FE',
      code: 'FE-5',
      source: 'SAMPLE',
      sortOrder: 8,
      title: B(
        'Final Exam 5 — the whole Next.js & React course (50 questions)',
        'Thi cuối khoá 5 — toàn bộ khoá Next.js & React (50 câu)',
      ),
      description: B(
        'A fifth full-course final with fresh questions across all twenty chapters, from JSX and state to the App Router, caching, Server Actions, auth, testing and deployment.',
        'Đề cuối khoá thứ năm với câu hỏi mới phủ cả hai mươi chương, từ JSX và state tới App Router, cache, Server Actions, xác thực, kiểm thử và triển khai.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        // Ch1
        mcq({
          prompt: B(
            'What does this render?' + code('return <>{"a"}{"b"}{"c"}</>;'),
            'Đoạn này render ra gì?' + code('return <>{"a"}{"b"}{"c"}</>;'),
          ),
          options: [
            B('abc, three text nodes with no wrapper element', 'abc, ba nút văn bản không có phần tử bọc'),
            B('&lt;div&gt;abc&lt;/div&gt;, wrapped in a div by React', '&lt;div&gt;abc&lt;/div&gt;, được React bọc trong một div'),
            B('a b c, with spaces inserted between them', 'a b c, có dấu cách chèn giữa chúng'),
            B('Only "a", the other two are dropped by JSX', 'Chỉ "a", hai cái kia bị JSX bỏ'),
          ],
          correct: 0,
          explanation: EX(
            'Verified with renderToStaticMarkup. A Fragment renders its children with no wrapper, and adjacent string expressions are concatenated with no added spaces → "abc". React does not insert whitespace between JSX expressions.',
            'Đã kiểm bằng renderToStaticMarkup. Một Fragment render các con mà không thêm phần tử bọc, và các biểu thức chuỗi liền kề được nối không thêm dấu cách → "abc". React không chèn khoảng trắng giữa các biểu thức JSX.',
          ),
        }),
        mcq({
          prompt: B(
            'Which is a valid reason JSX requires <code>key</code> on mapped elements?',
            'Lý do hợp lệ nào khiến JSX đòi <code>key</code> trên các phần tử ánh xạ?',
          ),
          options: [
            B('So React can match items to instances across renders', 'Để React khớp phần tử với thể hiện qua các lần render'),
            B('So the key is rendered as an id in the DOM output', 'Để key được render thành id trong DOM'),
            B('So the list can be sorted automatically by React', 'Để danh sách được React tự sắp xếp'),
            B('So each item gets a unique CSS class applied', 'Để mỗi phần tử được gán một class CSS riêng'),
          ],
          correct: 0,
          explanation: EX(
            'Keys let React match list items to their instances/DOM/state during reconciliation. They are not rendered to the DOM, do not sort the list, and have nothing to do with CSS classes.',
            'Key giúp React khớp phần tử danh sách với thể hiện/DOM/state của chúng khi reconciliation. Chúng không được render ra DOM, không sắp xếp danh sách, và không liên quan tới class CSS.',
          ),
        }),
        mcq({
          prompt: B(
            'What renders?' + code('return <p>{["a","b"].join("-")}</p>;'),
            'Cái gì được render?' + code('return <p>{["a","b"].join("-")}</p>;'),
          ),
          options: [
            B('&lt;p&gt;a-b&lt;/p&gt; because join makes one string', '&lt;p&gt;a-b&lt;/p&gt; vì join tạo một chuỗi'),
            B('&lt;p&gt;ab&lt;/p&gt; because the array is flattened', '&lt;p&gt;ab&lt;/p&gt; vì mảng bị làm phẳng'),
            B('&lt;p&gt;a,b&lt;/p&gt; using the default separator', '&lt;p&gt;a,b&lt;/p&gt; dùng dấu ngăn mặc định'),
            B('&lt;p&gt;["a","b"]&lt;/p&gt; printing the array', '&lt;p&gt;["a","b"]&lt;/p&gt; in ra mảng'),
          ],
          correct: 0,
          explanation: EX(
            '<code>["a","b"].join("-")</code> produces the string "a-b" before it is placed in the JSX, so the paragraph shows "a-b". The default separator (a comma) only applies if you call <code>join()</code> without an argument.',
            '<code>["a","b"].join("-")</code> tạo ra chuỗi "a-b" trước khi được đặt vào JSX, nên đoạn văn hiện "a-b". Dấu ngăn mặc định (dấu phẩy) chỉ áp dụng nếu bạn gọi <code>join()</code> không tham số.',
          ),
        }),
        // Ch2
        mcq({
          prompt: B(
            'What does this print?' + code('console.log(JSON.stringify(Object.fromEntries([["a",1],["b",2]])));'),
            'Đoạn này in ra gì?' + code('console.log(JSON.stringify(Object.fromEntries([["a",1],["b",2]])));'),
          ),
          options: [
            B('{"a":1,"b":2} — entries become object keys', '{"a":1,"b":2} — các cặp thành khoá object'),
            B('[["a",1],["b",2]] — it returns the same array', '[["a",1],["b",2]] — nó trả về đúng mảng đó'),
            B('{"0":["a",1],"1":["b",2]} — indexed by position', '{"0":["a",1],"1":["b",2]} — đánh chỉ số theo vị trí'),
            B('{"a":"1","b":"2"} — values become strings', '{"a":"1","b":"2"} — giá trị thành chuỗi'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>Object.fromEntries</code> turns an array of <code>[key, value]</code> pairs into an object, preserving value types. It is the inverse of <code>Object.entries</code> — handy for transforming query params or form data.',
            'Đã chạy thật. <code>Object.fromEntries</code> biến một mảng các cặp <code>[key, value]</code> thành một object, giữ nguyên kiểu giá trị. Nó là nghịch đảo của <code>Object.entries</code> — tiện để biến đổi tham số truy vấn hoặc dữ liệu form.',
          ),
        }),
        mcq({
          prompt: B(
            'A prop passed but never declared in a component&#x27;s destructuring is…',
            'Một prop được truyền nhưng không khai báo trong phân rã của component thì…',
          ),
          options: [
            B('Simply ignored unless collected via a rest (...rest)', 'Đơn giản là bị bỏ qua trừ khi gom bằng rest (...rest)'),
            B('Automatically forwarded to the root DOM element', 'Tự động chuyển tiếp tới phần tử DOM gốc'),
            B('A runtime error about an unknown prop', 'Một lỗi lúc chạy về prop không xác định'),
            B('Merged into the component&#x27;s internal state', 'Trộn vào state nội bộ của component'),
          ],
          correct: 0,
          explanation: EX(
            'Undeclared props are just unused unless you capture them with a rest pattern (<code>{ a, ...rest }</code>) and spread them somewhere. React does not auto-forward props, does not error, and does not touch state.',
            'Prop không khai báo chỉ là không dùng tới trừ khi bạn bắt bằng mẫu rest (<code>{ a, ...rest }</code>) rồi spread ở đâu đó. React không tự chuyển tiếp prop, không báo lỗi, và không đụng state.',
          ),
        }),
        // Ch3
        mcq({
          prompt: B(
            'What does this print?' + code('console.log(JSON.stringify({ a: 1, b: undefined, c: null }));'),
            'Đoạn này in ra gì?' + code('console.log(JSON.stringify({ a: 1, b: undefined, c: null }));'),
          ),
          options: [
            B('{"a":1,"c":null} — undefined keys are dropped', '{"a":1,"c":null} — khoá undefined bị bỏ'),
            B('{"a":1,"b":undefined,"c":null} — all kept', '{"a":1,"b":undefined,"c":null} — giữ tất cả'),
            B('{"a":1} — both b and c are dropped', '{"a":1} — cả b và c bị bỏ'),
            B('{"a":1,"b":null,"c":null} — undefined becomes null', '{"a":1,"b":null,"c":null} — undefined thành null'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>JSON.stringify</code> omits keys whose value is <code>undefined</code> but keeps <code>null</code>. Watch this when serializing state or API payloads — an undefined field silently disappears.',
            'Đã chạy thật. <code>JSON.stringify</code> bỏ các khoá có giá trị <code>undefined</code> nhưng giữ <code>null</code>. Hãy để ý điều này khi tuần tự hoá state hay payload API — một trường undefined âm thầm biến mất.',
          ),
        }),
        mcq({
          prompt: B(
            'The correct way to double every number in a state array immutably is…',
            'Cách đúng để nhân đôi mọi số trong một mảng state một cách bất biến là…',
          ),
          options: [
            B('setNums(nums.map(n => n * 2)) returning a new array', 'setNums(nums.map(n => n * 2)) trả về một mảng mới'),
            B('nums.forEach((n, i) => nums[i] = n * 2) in place', 'nums.forEach((n, i) => nums[i] = n * 2) tại chỗ'),
            B('for (let i...) nums[i] *= 2 then setNums(nums)', 'for (let i...) nums[i] *= 2 rồi setNums(nums)'),
            B('nums.map(n => n *= 2) mutating each element', 'nums.map(n => n *= 2) mutate từng phần tử'),
          ],
          correct: 0,
          explanation: EX(
            '<code>map</code> returns a brand-new array, which React can detect as changed and re-render. The other options mutate the existing array in place (same reference), so React may skip the update.',
            '<code>map</code> trả về một mảng mới toanh, React phát hiện được là đã đổi và render lại. Các lựa chọn khác mutate ngay mảng cũ (cùng tham chiếu), nên React có thể bỏ qua cập nhật.',
          ),
        }),
        mcq({
          prompt: B(
            'You keep <code>isEven</code> in state and sync it from <code>count</code> in an effect. A better design is…',
            'Bạn giữ <code>isEven</code> trong state và đồng bộ nó từ <code>count</code> trong một effect. Thiết kế tốt hơn là…',
          ),
          options: [
            B('Compute isEven from count during render (derived state)', 'Tính isEven từ count khi render (dữ liệu suy ra)'),
            B('Store isEven in a ref updated on each change', 'Lưu isEven trong một ref cập nhật mỗi lần đổi'),
            B('Move isEven into a global store for sharing', 'Chuyển isEven vào một store toàn cục để chia sẻ'),
            B('Recompute isEven inside a setTimeout callback', 'Tính lại isEven trong một callback setTimeout'),
          ],
          correct: 0,
          explanation: EX(
            '<code>isEven</code> is derivable from <code>count</code> — compute it inline (<code>const isEven = count % 2 === 0</code>) instead of mirroring it in state and syncing via an effect, which adds a render and a chance to drift.',
            '<code>isEven</code> suy ra được từ <code>count</code> — hãy tính ngay (<code>const isEven = count % 2 === 0</code>) thay vì sao chép vào state rồi đồng bộ qua effect, vốn thêm một lần render và một cơ hội lệch nhau.',
          ),
        }),
        // Ch4
        mcq({
          prompt: B(
            'Why does a controlled input feel "laggy" if you transform on change with an expensive function?',
            'Vì sao một ô có kiểm soát cảm giác "khựng" nếu bạn biến đổi khi onChange bằng một hàm nặng?',
          ),
          options: [
            B('Each keystroke re-renders; heavy work per keystroke blocks it', 'Mỗi phím render lại; việc nặng mỗi phím làm nghẽn'),
            B('Controlled inputs disable the browser&#x27;s input buffer', 'Ô có kiểm soát tắt bộ đệm nhập của trình duyệt'),
            B('onChange only fires once per second by design', 'onChange chỉ chạy một lần mỗi giây theo thiết kế'),
            B('React batches keystrokes and drops the extras', 'React gộp các phím và bỏ bớt phím thừa'),
          ],
          correct: 0,
          explanation: EX(
            'A controlled input re-renders on every keystroke as state updates; doing expensive work in <code>onChange</code> runs it each time and can block the UI. Defer heavy work (debounce, <code>useDeferredValue</code>) or move it out of the keystroke path.',
            'Một ô có kiểm soát render lại ở mỗi phím khi state cập nhật; làm việc nặng trong <code>onChange</code> chạy nó mỗi lần và có thể làm nghẽn UI. Hãy hoãn việc nặng (debounce, <code>useDeferredValue</code>) hoặc đưa nó ra khỏi đường xử lý phím.',
          ),
        }),
        mcq({
          prompt: B(
            'For a form with many fields, a compact controlled pattern is one <code>onChange</code> that…',
            'Với một form nhiều trường, một mẫu có kiểm soát gọn là một <code>onChange</code>…',
          ),
          options: [
            B('Uses e.target.name to update the matching state field', 'Dùng e.target.name để cập nhật trường state khớp'),
            B('Reads all fields from the DOM at submit time only', 'Chỉ đọc mọi trường từ DOM lúc submit'),
            B('Stores every field in a separate useRef', 'Lưu mỗi trường trong một useRef riêng'),
            B('Creates a new handler per field on each render', 'Tạo một handler mới cho mỗi trường ở mỗi render'),
          ],
          correct: 0,
          explanation: EX(
            'Give each input a <code>name</code> and a shared handler: <code>setForm(f =&gt; ({ ...f, [e.target.name]: e.target.value }))</code>. That keeps one controlled handler for all fields. Reading the DOM at submit is the uncontrolled approach.',
            'Cho mỗi input một <code>name</code> và một handler dùng chung: <code>setForm(f =&gt; ({ ...f, [e.target.name]: e.target.value }))</code>. Cách đó giữ một handler có kiểm soát cho mọi trường. Đọc DOM lúc submit là cách không kiểm soát.',
          ),
        }),
        // Ch5
        mcq({
          prompt: B(
            'Which cleanup pattern correctly cancels a timer in an effect?',
            'Mẫu dọn dẹp nào huỷ đúng một timer trong một effect?',
          ),
          options: [
            B('const id = setTimeout(...); return () => clearTimeout(id);', 'const id = setTimeout(...); return () => clearTimeout(id);'),
            B('setTimeout(...); return () => clearTimeout();', 'setTimeout(...); return () => clearTimeout();'),
            B('const id = setTimeout(...); clearTimeout(id);', 'const id = setTimeout(...); clearTimeout(id);'),
            B('setTimeout(...); // no cleanup is needed', 'setTimeout(...); // không cần dọn dẹp'),
          ],
          correct: 0,
          explanation: EX(
            'You must keep the timer id and clear it in the returned cleanup: <code>return () =&gt; clearTimeout(id)</code>. Clearing without the id does nothing; clearing immediately cancels it before it fires; skipping cleanup can fire after unmount.',
            'Bạn phải giữ id của timer và xoá nó trong hàm dọn dẹp trả về: <code>return () =&gt; clearTimeout(id)</code>. Xoá mà không có id thì vô tác dụng; xoá ngay lập tức huỷ nó trước khi chạy; bỏ dọn dẹp có thể khiến nó chạy sau khi gỡ.',
          ),
        }),
        mcq({
          prompt: B(
            'A prop <code>onData</code> is used inside an effect. To satisfy the deps rule without re-subscribing constantly, the parent should…',
            'Một prop <code>onData</code> được dùng trong một effect. Để thoả luật deps mà không đăng ký lại liên tục, cha nên…',
          ),
          options: [
            B('Wrap onData in useCallback so its reference is stable', 'Bọc onData trong useCallback để tham chiếu ổn định'),
            B('Pass a new inline function on every render', 'Truyền một hàm inline mới ở mỗi render'),
            B('Omit onData from the dependency array', 'Bỏ onData khỏi mảng dependency'),
            B('Store onData in a global variable instead', 'Lưu onData vào một biến toàn cục thay thế'),
          ],
          correct: 0,
          explanation: EX(
            'If <code>onData</code> is a new function each render, listing it in deps re-runs the effect constantly. Stabilize it with <code>useCallback</code> in the parent so the reference stays the same. Omitting it from deps risks stale closures.',
            'Nếu <code>onData</code> là một hàm mới mỗi render, liệt kê nó trong deps sẽ khiến effect chạy lại liên tục. Hãy ổn định nó bằng <code>useCallback</code> ở cha để tham chiếu giữ nguyên. Bỏ nó khỏi deps thì rủi ro closure cũ.',
          ),
        }),
        // Ch6
        mcq({
          prompt: B(
            'What does <code>useRef(0)</code> return, and what happens on <code>ref.current++</code>?',
            '<code>useRef(0)</code> trả về gì, và điều gì xảy ra khi <code>ref.current++</code>?',
          ),
          options: [
            B('An object { current: 0 }; incrementing does not re-render', 'Một object { current: 0 }; tăng nó không render lại'),
            B('The number 0; incrementing schedules a re-render', 'Con số 0; tăng nó lên lịch render lại'),
            B('A getter/setter pair; incrementing throws', 'Một cặp getter/setter; tăng nó ném lỗi'),
            B('undefined until the first render completes', 'undefined cho tới khi lần render đầu xong'),
          ],
          correct: 0,
          explanation: EX(
            '<code>useRef</code> returns a stable object <code>{ current: initial }</code>. Mutating <code>.current</code> persists across renders but never triggers a re-render — the opposite of state. Great for ids, previous values, and DOM nodes.',
            '<code>useRef</code> trả về một object ổn định <code>{ current: giá trị đầu }</code>. Sửa <code>.current</code> sống qua các lần render nhưng không bao giờ kích hoạt render lại — ngược với state. Rất hợp cho id, giá trị trước, và nút DOM.',
          ),
        }),
        mcq({
          prompt: B(
            'A custom hook <code>useDebouncedValue(value, ms)</code> most likely uses which hooks inside?',
            'Một custom hook <code>useDebouncedValue(value, ms)</code> nhiều khả năng dùng hook nào bên trong?',
          ),
          options: [
            B('useState and useEffect (with a timer and cleanup)', 'useState và useEffect (với một timer và dọn dẹp)'),
            B('Only useMemo to cache the value', 'Chỉ useMemo để lưu tạm giá trị'),
            B('Only useRef to hold the value', 'Chỉ useRef để giữ giá trị'),
            B('useContext to read a debounce provider', 'useContext để đọc một provider debounce'),
          ],
          correct: 0,
          explanation: EX(
            'Debouncing stores the debounced value in <code>useState</code> and uses <code>useEffect</code> to set a timer when <code>value</code> changes, cleaning up the previous timer each time. <code>useMemo</code>/<code>useRef</code> alone cannot delay a state update.',
            'Debounce lưu giá trị đã debounce trong <code>useState</code> và dùng <code>useEffect</code> để đặt một timer khi <code>value</code> đổi, dọn timer trước đó mỗi lần. Chỉ <code>useMemo</code>/<code>useRef</code> không thể trì hoãn một lần cập nhật state.',
          ),
        }),
        // Ch7
        mcq({
          prompt: B(
            'What renders?' + code("return <ol>{['x','y'].map((t,i) => <li key={t}>{i+1}:{t}</li>)}</ol>;"),
            'Cái gì được render?' + code("return <ol>{['x','y'].map((t,i) => <li key={t}>{i+1}:{t}</li>)}</ol>;"),
          ),
          options: [
            B('&lt;ol&gt;&lt;li&gt;1:x&lt;/li&gt;&lt;li&gt;2:y&lt;/li&gt;&lt;/ol&gt;', '&lt;ol&gt;&lt;li&gt;1:x&lt;/li&gt;&lt;li&gt;2:y&lt;/li&gt;&lt;/ol&gt;'),
            B('&lt;ol&gt;&lt;li&gt;0:x&lt;/li&gt;&lt;li&gt;1:y&lt;/li&gt;&lt;/ol&gt;', '&lt;ol&gt;&lt;li&gt;0:x&lt;/li&gt;&lt;li&gt;1:y&lt;/li&gt;&lt;/ol&gt;'),
            B('&lt;ol&gt;&lt;li key="x"&gt;1:x&lt;/li&gt;…&lt;/ol&gt;', '&lt;ol&gt;&lt;li key="x"&gt;1:x&lt;/li&gt;…&lt;/ol&gt;'),
            B('&lt;ol&gt;1:x2:y&lt;/ol&gt; without li tags', '&lt;ol&gt;1:x2:y&lt;/ol&gt; không có thẻ li'),
          ],
          correct: 0,
          explanation: EX(
            'Verified with renderToStaticMarkup. The index is 0-based so <code>i+1</code> gives 1 and 2, and <code>key</code> does not appear in the DOM. Output is <code>&lt;li&gt;1:x&lt;/li&gt;&lt;li&gt;2:y&lt;/li&gt;</code>.',
            'Đã kiểm bằng renderToStaticMarkup. Chỉ số tính từ 0 nên <code>i+1</code> cho 1 và 2, và <code>key</code> không xuất hiện trong DOM. Kết quả là <code>&lt;li&gt;1:x&lt;/li&gt;&lt;li&gt;2:y&lt;/li&gt;</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'To reset a child component&#x27;s state when a selected id changes, the cleanest trick is…',
            'Để đặt lại state của một component con khi id được chọn đổi, mẹo gọn nhất là…',
          ),
          options: [
            B('Give the child key={id} so it remounts on change', 'Cho con key={id} để nó remount khi đổi'),
            B('Call the child&#x27;s reset method via a ref', 'Gọi phương thức reset của con qua một ref'),
            B('Add an effect that clears state on id change', 'Thêm một effect xoá state khi id đổi'),
            B('Wrap the child in React.memo to reset it', 'Bọc con trong React.memo để đặt lại nó'),
          ],
          correct: 0,
          explanation: EX(
            'Changing <code>key</code> makes React treat it as a new element, unmounting the old and mounting fresh — all state resets automatically. An effect-based reset is more code and error-prone; <code>React.memo</code> does not reset state.',
            'Đổi <code>key</code> khiến React coi nó là phần tử mới, gỡ cái cũ và mount mới — mọi state tự đặt lại. Đặt lại bằng effect thì dài dòng và dễ lỗi; <code>React.memo</code> không đặt lại state.',
          ),
        }),
        // Ch8
        mcq({
          prompt: B(
            'Which files under a segment are conventions Next.js recognizes? (choose TWO)',
            'File nào dưới một đoạn là quy ước Next.js nhận diện? (chọn HAI)',
          ),
          options: [
            B('page.tsx and layout.tsx', 'page.tsx và layout.tsx'),
            B('loading.tsx and error.tsx', 'loading.tsx và error.tsx'),
            B('view.tsx and controller.tsx', 'view.tsx và controller.tsx'),
            B('index.tsx and _app.tsx', 'index.tsx và _app.tsx'),
          ],
          correct: [0, 1],
          explanation: EX(
            'The App Router recognizes <code>page</code>, <code>layout</code>, <code>loading</code>, <code>error</code>, <code>not-found</code>, <code>route</code>, <code>template</code>. <code>view</code>/<code>controller</code> are not conventions; <code>index.tsx</code>/<code>_app.tsx</code> belong to the old Pages Router.',
            'App Router nhận diện <code>page</code>, <code>layout</code>, <code>loading</code>, <code>error</code>, <code>not-found</code>, <code>route</code>, <code>template</code>. <code>view</code>/<code>controller</code> không phải quy ước; <code>index.tsx</code>/<code>_app.tsx</code> thuộc Pages Router cũ.',
          ),
        }),
        mcq({
          prompt: B(
            'A route group <code>(auth)</code> that wraps <code>/login</code> and <code>/register</code> in a shared layout affects the URLs how?',
            'Một route group <code>(auth)</code> bọc <code>/login</code> và <code>/register</code> trong một layout dùng chung ảnh hưởng URL thế nào?',
          ),
          options: [
            B('Not at all — URLs stay /login and /register', 'Không hề — URL vẫn là /login và /register'),
            B('They become /auth/login and /auth/register', 'Chúng thành /auth/login và /auth/register'),
            B('They are hidden from the router entirely', 'Chúng bị ẩn khỏi router hoàn toàn'),
            B('They require a dynamic [auth] segment', 'Chúng đòi một đoạn động [auth]'),
          ],
          correct: 0,
          explanation: EX(
            'Parentheses create a route group used only to share a layout or organize files — the group name is not part of the URL. So <code>(auth)/login</code> still serves at <code>/login</code>.',
            'Ngoặc đơn tạo một route group chỉ để chia sẻ layout hoặc sắp xếp file — tên group không nằm trong URL. Nên <code>(auth)/login</code> vẫn phục vụ tại <code>/login</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'Why is a shared <code>layout.tsx</code> good for a persistent sidebar?',
            'Vì sao một <code>layout.tsx</code> dùng chung tốt cho một thanh bên tồn tại lâu?',
          ),
          options: [
            B('It stays mounted across navigations, keeping its state', 'Nó vẫn mounted qua các lần điều hướng, giữ state'),
            B('It re-mounts each navigation to reset the sidebar', 'Nó remount mỗi lần điều hướng để đặt lại thanh bên'),
            B('It renders only once and then is removed', 'Nó chỉ render một lần rồi bị gỡ'),
            B('It runs the sidebar logic entirely on the client', 'Nó chạy logic thanh bên hoàn toàn trên client'),
          ],
          correct: 0,
          explanation: EX(
            'Layouts persist across navigations within their subtree, so a sidebar keeps its scroll/expanded state as you move between pages — only the changing page segment re-renders. (A <code>template.tsx</code> would re-mount and reset it.)',
            'Layout tồn tại qua các lần điều hướng trong cây con của nó, nên một thanh bên giữ trạng thái cuộn/mở rộng khi bạn di chuyển giữa các trang — chỉ đoạn trang đang đổi render lại. (<code>template.tsx</code> sẽ remount và đặt lại nó.)',
          ),
        }),
        // Ch9
        mcq({
          prompt: B(
            'A Client Component needs data fetched on the server. The cleanest pattern is…',
            'Một Client Component cần dữ liệu tải trên server. Mẫu gọn nhất là…',
          ),
          options: [
            B('Fetch in a Server parent and pass the data down as props', 'Tải ở cha Server và truyền dữ liệu xuống làm props'),
            B('Fetch inside the Client Component with useEffect', 'Tải bên trong Client Component bằng useEffect'),
            B('Read the database directly from the client', 'Đọc cơ sở dữ liệu trực tiếp từ client'),
            B('Put the API key in a NEXT_PUBLIC_ variable', 'Đặt API key vào một biến NEXT_PUBLIC_'),
          ],
          correct: 0,
          explanation: EX(
            'Fetch on the server (in a Server Component) and pass serializable data down to the Client Component as props — no client fetch, no exposed keys, smaller bundle. A client <code>useEffect</code> fetch is a fallback, not the first choice here.',
            'Hãy tải trên server (trong một Server Component) và truyền dữ liệu tuần tự hoá được xuống Client Component làm props — không fetch ở client, không lộ key, bundle nhỏ hơn. Fetch bằng <code>useEffect</code> ở client là phương án dự phòng, không phải lựa chọn đầu.',
          ),
        }),
        mcq({
          prompt: B(
            'Which prop CANNOT cross the Server→Client boundary?',
            'Prop nào KHÔNG thể vượt ranh giới Server→Client?',
          ),
          options: [
            B('A Map or Set instance with methods', 'Một thể hiện Map hoặc Set có phương thức'),
            B('A plain array of numbers', 'Một mảng số thuần'),
            B('A string label for a button', 'Một chuỗi nhãn cho một nút'),
            B('A Server Action function', 'Một hàm Server Action'),
          ],
          correct: 0,
          explanation: EX(
            'Props must be serializable; a <code>Map</code>/<code>Set</code> (with methods) is not plain data and cannot cross. Plain arrays/strings serialize fine, and Server Actions are specially handled by Next so they can be passed too.',
            'Prop phải tuần tự hoá được; một <code>Map</code>/<code>Set</code> (có phương thức) không phải dữ liệu thuần nên không vượt được. Mảng/chuỗi thuần tuần tự hoá tốt, và Server Action được Next xử lý riêng nên cũng truyền được.',
          ),
        }),
        mcq({
          prompt: B(
            'Marking a small leaf component "use client" while its parent stays server means…',
            'Đánh dấu một component lá nhỏ "use client" trong khi cha vẫn là server nghĩa là…',
          ),
          options: [
            B('Only the leaf ships JS; the rest stays server-rendered', 'Chỉ lá gửi JS; phần còn lại vẫn render trên server'),
            B('The parent is forced to become a Client Component too', 'Cha cũng bị buộc thành Client Component'),
            B('The whole page loses its Server Component benefits', 'Cả trang mất lợi ích của Server Component'),
            B('The leaf can no longer receive props from the parent', 'Lá không còn nhận được prop từ cha'),
          ],
          correct: 0,
          explanation: EX(
            'The <code>"use client"</code> boundary only pulls that component (and its imports) into the client bundle; a Server parent can still render it and pass serializable props. Keeping the boundary at the leaf preserves the server benefits for the rest.',
            'Ranh giới <code>"use client"</code> chỉ kéo component đó (và các import của nó) vào bundle client; một cha Server vẫn render nó và truyền prop tuần tự hoá được. Giữ ranh giới ở lá giữ được lợi ích server cho phần còn lại.',
          ),
        }),
        // Ch10
        mcq({
          prompt: B(
            'Which fetch caches indefinitely until you explicitly revalidate?',
            'Fetch nào cache vô thời hạn cho tới khi bạn chủ động làm mới?',
          ),
          options: [
            B('fetch(url, { cache: "force-cache" })', 'fetch(url, { cache: "force-cache" })'),
            B('fetch(url, { cache: "no-store" })', 'fetch(url, { cache: "no-store" })'),
            B('fetch(url, { next: { revalidate: 0 } })', 'fetch(url, { next: { revalidate: 0 } })'),
            B('fetch(url, { keepalive: true })', 'fetch(url, { keepalive: true })'),
          ],
          correct: 0,
          explanation: EX(
            '<code>force-cache</code> caches the result until it is revalidated. <code>no-store</code> and <code>revalidate: 0</code> disable caching (always fresh); <code>keepalive</code> is unrelated to Next caching.',
            '<code>force-cache</code> cache kết quả cho tới khi được làm mới. <code>no-store</code> và <code>revalidate: 0</code> tắt cache (luôn tươi); <code>keepalive</code> không liên quan tới cache của Next.',
          ),
        }),
        mcq({
          prompt: B(
            'To fetch two independent resources without a waterfall in a Server Component, use…',
            'Để tải hai tài nguyên độc lập mà không tạo thác nước trong một Server Component, dùng…',
          ),
          options: [
            B('const [a, b] = await Promise.all([fa(), fb()])', 'const [a, b] = await Promise.all([fa(), fb()])'),
            B('const a = await fa(); const b = await fb();', 'const a = await fa(); const b = await fb();'),
            B('useEffect(() => { fa(); fb(); }, [])', 'useEffect(() => { fa(); fb(); }, [])'),
            B('Promise.race([fa(), fb()]) to pick the first', 'Promise.race([fa(), fb()]) để lấy cái đầu'),
          ],
          correct: 0,
          explanation: EX(
            '<code>Promise.all</code> starts both fetches at once and awaits them together, avoiding the sequential waterfall. Two sequential <code>await</code>s serialize them; <code>useEffect</code> is client-only; <code>Promise.race</code> returns only the first to settle.',
            '<code>Promise.all</code> khởi động cả hai fetch cùng lúc và chờ chung, tránh thác nước tuần tự. Hai <code>await</code> nối tiếp làm chúng tuần tự hoá; <code>useEffect</code> chỉ ở client; <code>Promise.race</code> chỉ trả về cái xong đầu.',
          ),
        }),
        mcq({
          prompt: B(
            'A page that must be static and fast should avoid…',
            'Một trang cần tĩnh và nhanh nên tránh…',
          ),
          options: [
            B('cookies(), headers(), and reading searchParams', 'cookies(), headers(), và đọc searchParams'),
            B('Importing Server Components', 'Import các Server Component'),
            B('Using generateStaticParams', 'Dùng generateStaticParams'),
            B('Setting metadata for SEO', 'Đặt metadata cho SEO'),
          ],
          correct: 0,
          explanation: EX(
            'Request-specific APIs (<code>cookies</code>, <code>headers</code>, <code>searchParams</code>) opt a route into dynamic rendering. Importing components, <code>generateStaticParams</code>, and metadata are all compatible with static generation.',
            'Các API riêng-request (<code>cookies</code>, <code>headers</code>, <code>searchParams</code>) đưa route vào render động. Import component, <code>generateStaticParams</code>, và metadata đều tương thích với dựng tĩnh.',
          ),
        }),
        // Ch11
        mcq({
          prompt: B(
            'A GET Route Handler at <code>/api/ping</code> that returns text uses…',
            'Một Route Handler GET tại <code>/api/ping</code> trả về text dùng…',
          ),
          options: [
            B('export function GET() { return new Response("pong") }', 'export function GET() { return new Response("pong") }'),
            B('export default function() { return "pong" }', 'export default function() { return "pong" }'),
            B('module.exports = (req, res) => res.send("pong")', 'module.exports = (req, res) => res.send("pong")'),
            B('export const GET = "pong"', 'export const GET = "pong"'),
          ],
          correct: 0,
          explanation: EX(
            'Route Handlers export HTTP-method functions that return a Web <code>Response</code>. A default export, a CommonJS <code>(req, res)</code> signature, or a string constant are not the handler API.',
            'Route Handler export các hàm theo phương thức HTTP trả về một Web <code>Response</code>. Một export default, một chữ ký CommonJS <code>(req, res)</code>, hay một hằng chuỗi đều không phải API của handler.',
          ),
        }),
        mcq({
          prompt: B(
            'Where should a lightweight auth-gate redirect for a whole section run?',
            'Một chốt chặn auth nhẹ để chuyển hướng cho cả một mảng nên chạy ở đâu?',
          ),
          options: [
            B('In middleware.ts before the route renders', 'Trong middleware.ts trước khi route render'),
            B('In a client useEffect on each protected page', 'Trong một useEffect client ở từng trang được bảo vệ'),
            B('In the root error.tsx boundary', 'Trong error.tsx ở gốc'),
            B('In getServerSideProps of each page', 'Trong getServerSideProps của từng trang'),
          ],
          correct: 0,
          explanation: EX(
            'Middleware runs on the edge before the route, so it can check a session and redirect for the whole section before any protected content renders. Client effects flash the UI; <code>error.tsx</code> is for errors; <code>getServerSideProps</code> is Pages Router.',
            'Middleware chạy ở biên trước route, nên có thể kiểm phiên và chuyển hướng cho cả mảng trước khi nội dung được bảo vệ render. Effect client làm nháy UI; <code>error.tsx</code> dành cho lỗi; <code>getServerSideProps</code> là Pages Router.',
          ),
        }),
        // Ch12
        mcq({
          prompt: B(
            'A Server Action bound to a form receives the submitted data as…',
            'Một Server Action gắn vào form nhận dữ liệu đã submit dưới dạng…',
          ),
          options: [
            B('A FormData argument you read with .get()', 'Một đối số FormData bạn đọc bằng .get()'),
            B('A parsed JSON object as the first argument', 'Một object JSON đã parse làm đối số đầu'),
            B('The React event object as usual', 'Object sự kiện React như thường lệ'),
            B('Nothing; it reads from global request state', 'Không gì; nó đọc từ state request toàn cục'),
          ],
          correct: 0,
          explanation: EX(
            'A form-bound action receives a <code>FormData</code> object; read fields with <code>formData.get("name")</code> (they are strings — validate/coerce on the server). It is not a JSON object or a React event.',
            'Một action gắn vào form nhận một object <code>FormData</code>; đọc trường bằng <code>formData.get("name")</code> (chúng là chuỗi — hãy kiểm/ép kiểu trên server). Nó không phải object JSON hay sự kiện React.',
          ),
        }),
        mcq({
          prompt: B(
            'Why re-render affected Server Components with <code>revalidatePath</code> instead of client refetching after a mutation?',
            'Vì sao render lại các Server Component bị ảnh hưởng bằng <code>revalidatePath</code> thay vì tải lại phía client sau một thay đổi?',
          ),
          options: [
            B('It refreshes server data without extra client fetch code', 'Nó làm tươi dữ liệu server mà không cần thêm mã fetch client'),
            B('Client refetching is impossible after a Server Action', 'Tải lại phía client là không thể sau một Server Action'),
            B('It clears the browser cache and localStorage', 'Nó xoá cache trình duyệt và localStorage'),
            B('It converts the page into a Client Component', 'Nó biến trang thành một Client Component'),
          ],
          correct: 0,
          explanation: EX(
            '<code>revalidatePath</code>/<code>revalidateTag</code> invalidate the server cache so Next re-renders the affected Server Components with fresh data — server-first, no hand-written client refetch. Client refetching is still possible; it is just more code.',
            '<code>revalidatePath</code>/<code>revalidateTag</code> vô hiệu cache server để Next render lại các Server Component bị ảnh hưởng với dữ liệu mới — server-first, không cần tự viết fetch client. Tải lại phía client vẫn làm được; chỉ là nhiều mã hơn.',
          ),
        }),
        mcq({
          prompt: B(
            'The correct React 19 imports for form action hooks are…',
            'Import đúng của React 19 cho các hook form action là…',
          ),
          options: [
            B('useActionState from react, useFormStatus from react-dom', 'useActionState từ react, useFormStatus từ react-dom'),
            B('useFormState from react, useFormStatus from react', 'useFormState từ react, useFormStatus từ react'),
            B('useActionState from react-dom, useForm from react', 'useActionState từ react-dom, useForm từ react'),
            B('useFormState and useFormStatus both from next', 'useFormState và useFormStatus đều từ next'),
          ],
          correct: 0,
          explanation: EX(
            'React 19 renamed <code>useFormState</code> → <code>useActionState</code> (imported from <code>react</code>); <code>useFormStatus</code> keeps its name and still comes from <code>react-dom</code>. The other combinations use outdated or wrong sources.',
            'React 19 đổi tên <code>useFormState</code> → <code>useActionState</code> (import từ <code>react</code>); <code>useFormStatus</code> giữ nguyên tên và vẫn từ <code>react-dom</code>. Các tổ hợp khác dùng nguồn cũ hoặc sai.',
          ),
        }),
        // Ch13
        mcq({
          prompt: B(
            'Applying conditional Tailwind classes is cleanest with…',
            'Áp class Tailwind theo điều kiện gọn nhất bằng…',
          ),
          options: [
            B('A helper like clsx/cn building the class string', 'Một helper như clsx/cn dựng chuỗi class'),
            B('An if statement inside the className attribute', 'Một câu lệnh if bên trong thuộc tính className'),
            B('Mutating element.className after render', 'Sửa element.className sau khi render'),
            B('A separate stylesheet per boolean state', 'Một stylesheet riêng cho mỗi trạng thái boolean'),
          ],
          correct: 0,
          explanation: EX(
            'Compose the class string with <code>clsx</code>/<code>cn</code> (or a template literal): <code>cn("btn", active &amp;&amp; "btn-on")</code>. You cannot put statements in JSX, and reaching into the DOM to mutate <code>className</code> fights React.',
            'Hãy ghép chuỗi class bằng <code>clsx</code>/<code>cn</code> (hoặc template literal): <code>cn("btn", active &amp;&amp; "btn-on")</code>. Bạn không đặt câu lệnh trong JSX được, và thò vào DOM để sửa <code>className</code> là chống lại React.',
          ),
        }),
        mcq({
          prompt: B(
            'On cuongthai.com, applying <code>dark</code> to <code>&lt;html&gt;</code> broke the Notes theme switcher because…',
            'Trên cuongthai.com, áp <code>dark</code> lên <code>&lt;html&gt;</code> phá switcher theme của Notes vì…',
          ),
          options: [
            B('It force-enabled every Tailwind dark: utility globally', 'Nó bật cưỡng bức mọi tiện ích dark: của Tailwind toàn cục'),
            B('The class dark is invalid HTML and was ignored', 'Class dark là HTML không hợp lệ và bị bỏ qua'),
            B('It disabled all CSS variables on the page', 'Nó tắt mọi biến CSS trên trang'),
            B('It applied only inside the print stylesheet', 'Nó chỉ áp trong stylesheet lúc in'),
          ],
          correct: 0,
          explanation: EX(
            'Tailwind&#x27;s <code>dark:</code> variant keys off a <code>.dark</code> ancestor, so <code>dark</code> on <code>&lt;html&gt;</code> turned on every <code>dark:</code> utility site-wide, clobbering the Notes 3-theme switcher. The global class must be <code>theme-dark</code>; <code>dark</code> is reserved for the Notes wrapper.',
            'Biến thể <code>dark:</code> của Tailwind bật theo tổ tiên có <code>.dark</code>, nên <code>dark</code> trên <code>&lt;html&gt;</code> bật mọi tiện ích <code>dark:</code> toàn site, đè switcher 3-theme của Notes. Class toàn cục phải là <code>theme-dark</code>; <code>dark</code> dành riêng cho vỏ Notes.',
          ),
        }),
        // Ch14
        mcq({
          prompt: B(
            'React Context is a poor fit for a value that…',
            'React Context không hợp với một giá trị mà…',
          ),
          options: [
            B('Changes many times per second (all consumers re-render)', 'Đổi nhiều lần mỗi giây (mọi consumer render lại)'),
            B('Rarely changes, like the current theme', 'Hiếm đổi, như theme hiện tại'),
            B('Is read by components deep in the tree', 'Được đọc bởi component sâu trong cây'),
            B('Represents the signed-in user', 'Đại diện người dùng đã đăng nhập'),
          ],
          correct: 0,
          explanation: EX(
            'Every consumer re-renders when a Context value changes, so a high-frequency value causes render storms. Context suits rarely-changing globals (theme, user) read across the tree; hot values want a store with selectors.',
            'Mọi consumer render lại khi giá trị Context đổi, nên một giá trị tần suất cao gây bão render. Context hợp với các giá trị toàn cục hiếm đổi (theme, user) đọc khắp cây; giá trị "nóng" cần một store kèm selector.',
          ),
        }),
        mcq({
          prompt: B(
            'A persisted store shows the default before the saved value on reload because…',
            'Một store đã lưu hiện mặc định trước giá trị đã lưu khi tải lại vì…',
          ),
          options: [
            B('localStorage rehydrates on the client after the first render', 'localStorage nạp lại ở client sau lần render đầu'),
            B('The server pre-reads localStorage incorrectly', 'Server đọc trước localStorage sai cách'),
            B('The store deletes its data on unload', 'Store xoá dữ liệu khi rời trang'),
            B('Zustand cannot persist to localStorage at all', 'Zustand hoàn toàn không lưu được vào localStorage'),
          ],
          correct: 0,
          explanation: EX(
            '<code>localStorage</code> is client-only and read shortly after mount, so the first render (matching the server) uses the default and the saved value pops in after rehydration — a brief flash. Guard dependent UI until rehydration completes.',
            '<code>localStorage</code> chỉ có ở client và được đọc ngay sau mount, nên lần render đầu (khớp server) dùng mặc định và giá trị đã lưu hiện sau khi nạp lại — một cái nháy ngắn. Hãy chặn UI phụ thuộc cho tới khi nạp lại xong.',
          ),
        }),
        // Ch15
        mcq({
          prompt: B(
            'On the server, the correct way to read a session cookie is…',
            'Trên server, cách đúng để đọc một cookie phiên là…',
          ),
          options: [
            B('cookies().get("session") from next/headers', 'cookies().get("session") từ next/headers'),
            B('document.cookie split on semicolons', 'document.cookie tách theo dấu chấm phẩy'),
            B('localStorage.getItem("session")', 'localStorage.getItem("session")'),
            B('A useCookie() hook in the Server Component', 'Một hook useCookie() trong Server Component'),
          ],
          correct: 0,
          explanation: EX(
            'On the server there is no <code>document</code> or <code>localStorage</code>; use <code>cookies()</code> from <code>next/headers</code>. Reading a cookie makes the route dynamic. Hooks like <code>useCookie</code> are client-only.',
            'Trên server không có <code>document</code> hay <code>localStorage</code>; hãy dùng <code>cookies()</code> từ <code>next/headers</code>. Đọc một cookie làm route trở nên động. Các hook như <code>useCookie</code> chỉ ở client.',
          ),
        }),
        mcq({
          prompt: B(
            'The cuongthai.com "sessions die after 24h" bug was caused by…',
            'Lỗi "phiên chết sau 24 giờ" của cuongthai.com do…',
          ),
          options: [
            B('A 24h JWT under a 7-day cookie with no working refresh', 'Một JWT 24 giờ dưới cookie 7 ngày không có refresh hoạt động'),
            B('The cookie being deleted by the browser early', 'Cookie bị trình duyệt xoá sớm'),
            B('A server clock drift of exactly 24 hours', 'Đồng hồ server lệch đúng 24 giờ'),
            B('The token stored in localStorage being cleared', 'Token lưu trong localStorage bị xoá'),
          ],
          correct: 0,
          explanation: EX(
            'The access token expired in 24h but there was no working <code>/auth/refresh</code>, so once the JWT went stale every authed call 401&#x27;d though the 7-day cookie was still present. The fix was a refresh endpoint plus a 401 interceptor.',
            'Access token hết hạn sau 24 giờ nhưng không có <code>/auth/refresh</code> hoạt động, nên khi JWT cũ đi thì mọi lời gọi cần auth bị 401 dù cookie 7 ngày vẫn còn. Cách sửa là một endpoint refresh cộng một interceptor 401.',
          ),
        }),
        mcq({
          prompt: B(
            'An unauth GET curl to a route returns 404. The correct reading is…',
            'Một curl GET không auth tới một route trả 404. Cách hiểu đúng là…',
          ),
          options: [
            B('The route is not mounted — likely a stale/partial build', 'Route chưa được mount — nhiều khả năng build cũ/dở'),
            B('The route is mounted but needs authentication', 'Route đã mount nhưng cần xác thực'),
            B('The route is public and perfectly healthy', 'Route công khai và hoàn toàn khoẻ mạnh'),
            B('The database behind the route is unreachable', 'Cơ sở dữ liệu sau route không truy cập được'),
          ],
          correct: 0,
          explanation: EX(
            'For route-health checks: 404 = not mounted (stale/partial build), 401 = mounted needs auth, 200 = mounted public. cuongthai.com&#x27;s deploy smoke-test fails on 404 to catch stale builds before users do.',
            'Để kiểm sức khoẻ route: 404 = chưa mount (build cũ/dở), 401 = đã mount cần auth, 200 = đã mount công khai. Smoke-test khi deploy của cuongthai.com thất bại khi gặp 404 để bắt build cũ trước người dùng.',
          ),
        }),
        // Ch16
        mcq({
          prompt: B(
            'The single source of truth for form validation should be…',
            'Nguồn sự thật duy nhất cho validation form nên là…',
          ),
          options: [
            B('One Zod schema, with z.infer deriving the type', 'Một schema Zod, dùng z.infer suy ra kiểu'),
            B('A hand-written type plus separate manual checks', 'Một kiểu viết tay cộng phép kiểm thủ công riêng'),
            B('Client-side checks with no server validation', 'Kiểm phía client không kiểm ở server'),
            B('Only the database column constraints', 'Chỉ các ràng buộc cột cơ sở dữ liệu'),
          ],
          correct: 0,
          explanation: EX(
            'Define one Zod schema and derive the TS type via <code>z.infer</code> so types and runtime validation cannot drift. Still re-validate on the server for Server Actions; client-only checks and DB-only constraints are insufficient.',
            'Định nghĩa một schema Zod và suy ra kiểu TS bằng <code>z.infer</code> để kiểu và validation lúc chạy không lệch. Vẫn phải kiểm lại trên server cho Server Action; chỉ kiểm client hay chỉ ràng buộc DB là chưa đủ.',
          ),
        }),
        mcq({
          prompt: B(
            'For an upload, which two checks must run on the server? (choose TWO)',
            'Với một lần upload, hai phép kiểm nào phải chạy trên server? (chọn HAI)',
          ),
          options: [
            B('The real content/MIME type', 'Loại nội dung/MIME thật'),
            B('The maximum file size', 'Kích thước file tối đa'),
            B('The screen resolution of the client', 'Độ phân giải màn hình của client'),
            B('The user&#x27;s browser version', 'Phiên bản trình duyệt của người dùng'),
          ],
          correct: [0, 1],
          explanation: EX(
            'The server must verify the actual content type and enforce a max size before storing — client checks can be bypassed. Screen resolution and browser version are irrelevant to upload safety.',
            'Server phải xác minh loại nội dung thật và áp kích thước tối đa trước khi lưu — kiểm client có thể bị đi vòng. Độ phân giải màn hình và phiên bản trình duyệt không liên quan tới an toàn upload.',
          ),
        }),
        // Ch17
        mcq({
          prompt: B(
            'For a marketing page with the same content for everyone, prefer…',
            'Với một trang tiếp thị cùng nội dung cho mọi người, nên ưu tiên…',
          ),
          options: [
            B('SSG (optionally ISR), for cached fast loads', 'SSG (tuỳ chọn ISR), cho tải nhanh bằng cache'),
            B('SSR on every request for freshness', 'SSR ở mọi request cho tươi'),
            B('CSR so the client renders everything', 'CSR để client render mọi thứ'),
            B('A dynamic route reading cookies each visit', 'Một route động đọc cookie mỗi lần vào'),
          ],
          correct: 0,
          explanation: EX(
            'Shared, rarely-changing content is ideal for static generation (SSG), fast and cacheable, with ISR if it needs occasional updates. Per-request SSR/cookies make it dynamic and slower; CSR delays content until JS loads.',
            'Nội dung dùng chung, hiếm đổi lý tưởng cho dựng tĩnh (SSG), nhanh và cache được, kèm ISR nếu cần cập nhật thi thoảng. SSR/cookie theo request làm nó động và chậm hơn; CSR trì hoãn nội dung tới khi JS tải.',
          ),
        }),
        mcq({
          prompt: B(
            'The App Router way to set a data-dependent page title is…',
            'Cách của App Router để đặt tiêu đề trang phụ thuộc dữ liệu là…',
          ),
          options: [
            B('An async generateMetadata that fetches and returns it', 'Một generateMetadata async tải và trả về nó'),
            B('document.title assigned inside a useEffect', 'document.title gán trong một useEffect'),
            B('A &lt;title&gt; element in the component JSX', 'Một phần tử &lt;title&gt; trong JSX component'),
            B('A title field in next.config.js', 'Một trường title trong next.config.js'),
          ],
          correct: 0,
          explanation: EX(
            'When the title depends on data, use <code>generateMetadata({ params })</code> (async) so Next renders the right head tags on the server for crawlers. A static <code>metadata</code> object is for fixed values; client-set titles are too late for crawlers.',
            'Khi tiêu đề phụ thuộc dữ liệu, dùng <code>generateMetadata({ params })</code> (async) để Next render đúng thẻ head trên server cho trình thu thập. Một object <code>metadata</code> tĩnh dành cho giá trị cố định; tiêu đề đặt ở client quá trễ với trình thu thập.',
          ),
        }),
        // Ch18
        mcq({
          prompt: B(
            'Which pair improves Largest Contentful Paint for an image-heavy page? (choose TWO)',
            'Cặp nào cải thiện Largest Contentful Paint cho một trang nhiều ảnh? (chọn HAI)',
          ),
          options: [
            B('next/image with correct dimensions', 'next/image với kích thước đúng'),
            B('Serving modern formats like WebP/AVIF', 'Phục vụ định dạng hiện đại như WebP/AVIF'),
            B('Loading all images eagerly at once', 'Tải mọi ảnh sốt sắng cùng lúc'),
            B('Adding a title attribute to each image', 'Thêm thuộc tính title cho mỗi ảnh'),
          ],
          correct: [0, 1],
          explanation: EX(
            '<code>next/image</code> with dimensions reserves space and lazy-loads, and modern formats cut bytes — both speed the largest paint and reduce layout shift. Eager-loading everything hurts; a title attribute is unrelated to LCP.',
            '<code>next/image</code> có kích thước giữ chỗ và tải lười, còn định dạng hiện đại giảm số byte — cả hai tăng tốc lần vẽ lớn nhất và giảm xô lệch bố cục. Tải sốt sắng tất cả thì hại; thuộc tính title không liên quan tới LCP.',
          ),
        }),
        mcq({
          prompt: B(
            'A chart library that needs the DOM and breaks during SSR should be loaded with…',
            'Một thư viện biểu đồ cần DOM và vỡ lúc SSR nên được tải bằng…',
          ),
          options: [
            B('next/dynamic with { ssr: false }', 'next/dynamic với { ssr: false }'),
            B('A normal static import at the top of the file', 'Một import tĩnh thường ở đầu file'),
            B('A Server Component wrapper', 'Một component bọc Server'),
            B('An inline script tag in the layout', 'Một thẻ script inline trong layout'),
          ],
          correct: 0,
          explanation: EX(
            '<code>next/dynamic(() =&gt; import(...), { ssr: false })</code> loads the widget only on the client and skips SSR, so DOM-dependent libraries do not crash during server rendering. A static import would run it during SSR.',
            '<code>next/dynamic(() =&gt; import(...), { ssr: false })</code> chỉ tải widget trên client và bỏ qua SSR, nên các thư viện phụ thuộc DOM không sập khi render trên server. Một import tĩnh sẽ chạy nó khi SSR.',
          ),
        }),
        // Ch19
        mcq({
          prompt: B(
            'A resilient test asserts on…',
            'Một test bền vững kiểm dựa trên…',
          ),
          options: [
            B('Visible output and accessible roles, like a user', 'Kết quả hiển thị và vai trò accessible, như người dùng'),
            B('Exact class names and DOM structure', 'Đúng tên class và cấu trúc DOM'),
            B('Internal state and private variables', 'State nội bộ và biến riêng tư'),
            B('The order hooks are declared in the file', 'Thứ tự các hook được khai báo trong file'),
          ],
          correct: 0,
          explanation: EX(
            'Testing what the user sees (roles, labels, text) makes tests survive refactors that keep behaviour but change internals. Asserting on class names, DOM structure, or internal state makes tests brittle.',
            'Kiểm thứ người dùng thấy (vai trò, nhãn, văn bản) giúp test sống sót qua refactor giữ hành vi nhưng đổi bên trong. Kiểm dựa trên tên class, cấu trúc DOM, hay state nội bộ làm test dễ vỡ.',
          ),
        }),
        mcq({
          prompt: B(
            'Why add <code>typecheck:seed</code> and a real seed run to the pre-push checks?',
            'Vì sao thêm <code>typecheck:seed</code> và một lần chạy seed thật vào bộ kiểm trước khi push?',
          ),
          options: [
            B('tsc excludes prisma/**, so seed breakage is invisible to it', 'tsc loại trừ prisma/**, nên hỏng seed vô hình với nó'),
            B('The seed must run before every single git push', 'Seed phải chạy trước từng lần git push'),
            B('TypeScript cannot check any Prisma code ever', 'TypeScript không bao giờ kiểm được mã Prisma'),
            B('Seeds always contain runtime-only syntax errors', 'Seed luôn chứa lỗi cú pháp chỉ lộ lúc chạy'),
          ],
          correct: 0,
          explanation: EX(
            'The main <code>tsconfig</code> excludes <code>prisma/**</code>, and the seed carried a self-referential union, so <code>tsc</code> passed while the seed broke at runtime. A dedicated <code>typecheck:seed</code> plus actually running the seed closes that hole.',
            '<code>tsconfig</code> chính loại trừ <code>prisma/**</code>, và seed mang một union tự tham chiếu, nên <code>tsc</code> qua nhưng seed vỡ lúc chạy. Một <code>typecheck:seed</code> riêng cộng chạy seed thật bịt lỗ đó.',
          ),
        }),
        // Ch20
        mcq({
          prompt: B(
            'Changing a runtime env var (non-public) on the VPS takes effect…',
            'Đổi một biến env lúc chạy (không public) trên VPS có hiệu lực…',
          ),
          options: [
            B('After the container reloads it (no client rebuild needed)', 'Sau khi container nạp lại nó (không cần build lại client)'),
            B('Only after a full client bundle rebuild', 'Chỉ sau khi build lại toàn bộ bundle client'),
            B('Never, until the database is migrated', 'Không bao giờ, cho tới khi migrate cơ sở dữ liệu'),
            B('Immediately in the browser without any restart', 'Ngay lập tức trong trình duyệt không cần restart'),
          ],
          correct: 0,
          explanation: EX(
            'Non-public (server) env vars are read at runtime, so recreating/reloading the container with the new value applies it — no rebuild. Only <code>NEXT_PUBLIC_*</code> vars are baked at build time and need a rebuild.',
            'Biến env không public (server) được đọc lúc chạy, nên tạo lại/nạp lại container với giá trị mới là áp được — không cần build lại. Chỉ biến <code>NEXT_PUBLIC_*</code> mới được nướng lúc build và cần build lại.',
          ),
        }),
        mcq({
          prompt: B(
            'After changing a file in <code>frontend/public/**</code> in local dev, an asset 404s with no error. The fix is…',
            'Sau khi đổi một file trong <code>frontend/public/**</code> ở dev, một tài nguyên 404 mà không có lỗi. Cách sửa là…',
          ),
          options: [
            B('Restart the Next dev server (it fixes the file list at startup)', 'Khởi động lại server dev Next (nó chốt danh sách file lúc khởi động)'),
            B('Clear the browser cache and hard reload', 'Xoá cache trình duyệt và tải lại cứng'),
            B('Rebuild the production Docker image', 'Dựng lại image Docker production'),
            B('Wait for the CDN cache TTL to expire', 'Chờ TTL cache CDN hết hạn'),
          ],
          correct: 0,
          explanation: EX(
            'Next fixes the list of <code>public/</code> files at startup, so a rebuilt asset with a new hashed name can 404 until you restart — the "stuck loading, no error" /playground bug. Kill by port and restart; production is unaffected (each deploy is a fresh container).',
            'Next chốt danh sách file <code>public/</code> lúc khởi động, nên một tài nguyên dựng lại với tên băm mới có thể 404 cho tới khi restart — lỗi "kẹt màn tải, không lỗi" của /playground. Diệt theo cổng rồi khởi động lại; production không dính (mỗi deploy là container mới).',
          ),
        }),
        mcq({
          prompt: B(
            'Why is <code>bash deploy.sh --no-build</code> dangerous after a code change?',
            'Vì sao <code>bash deploy.sh --no-build</code> nguy hiểm sau khi đổi mã?',
          ),
          options: [
            B('It only rsyncs and skips rebuild, so the old image keeps running', 'Nó chỉ rsync và bỏ build, nên image cũ vẫn chạy'),
            B('It deletes the production database on the VPS', 'Nó xoá cơ sở dữ liệu production trên VPS'),
            B('It always force-pushes to the main branch', 'Nó luôn force-push lên nhánh main'),
            B('It disables the CDN for the whole site', 'Nó tắt CDN cho cả site'),
          ],
          correct: 0,
          explanation: EX(
            '<code>--no-build</code> rsyncs files but does not rebuild the image, so the container keeps running the OLD build (this caused the 2026-07-02 GIF 404) and it skips the post-deploy smoke-test. Always run a full <code>deploy.sh</code> after code changes.',
            '<code>--no-build</code> rsync file nhưng không dựng lại image, nên container vẫn chạy build CŨ (gây lỗi GIF 404 ngày 02/07/2026) và nó bỏ qua smoke-test sau deploy. Hãy luôn chạy <code>deploy.sh</code> đầy đủ sau khi đổi mã.',
          ),
        }),
        // Bổ sung cho đủ 50
        mcq({
          prompt: B(
            'What does this print?' + code("console.log('5'.padStart(3, '0'), '12'.padStart(3, '0'));"),
            'Đoạn này in ra gì?' + code("console.log('5'.padStart(3, '0'), '12'.padStart(3, '0'));"),
          ),
          options: [
            B('005 012 — padded to length 3 with zeros', '005 012 — đệm về độ dài 3 bằng số 0'),
            B('500 120 — zeros are appended at the end', '500 120 — số 0 được thêm ở cuối'),
            B('5 12 — padStart does nothing to short strings', '5 12 — padStart không làm gì với chuỗi ngắn'),
            B('000 000 — the content is replaced by zeros', '000 000 — nội dung bị thay bằng số 0'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>padStart(3, "0")</code> prepends "0" until the string reaches length 3, so "5" → "005" and "12" → "012". A common trick for formatting numbers in the UI without a date/number library.',
            'Đã chạy thật. <code>padStart(3, "0")</code> thêm "0" ở đầu cho tới khi chuỗi đạt độ dài 3, nên "5" → "005" và "12" → "012". Một mẹo quen thuộc để định dạng số trên UI mà không cần thư viện ngày/số.',
          ),
        }),
        mcq({
          prompt: B(
            'When adding a new feature router, you should add one of its param-less unauth GET routes to <code>deploy.sh</code>&#x27;s smoke-test because…',
            'Khi thêm một router tính năng mới, bạn nên thêm một route GET không tham số, không auth của nó vào smoke-test của <code>deploy.sh</code> vì…',
          ),
          options: [
            B('The smoke-test fails the deploy on 404, catching a stale build', 'Smoke-test làm deploy thất bại khi gặp 404, bắt được build cũ'),
            B('The smoke-test seeds the database for that router', 'Smoke-test seed cơ sở dữ liệu cho router đó'),
            B('Every route must be listed or the app will not start', 'Mọi route phải được liệt kê nếu không ứng dụng không chạy'),
            B('It automatically generates tests for the router', 'Nó tự sinh test cho router đó'),
          ],
          correct: 0,
          explanation: EX(
            'The post-deploy smoke-test hits core GET routes and fails on a 404 (route not mounted = stale/partial build). Add only param-less, unauth GET routes that return non-404 — not POST-only or param-required ones, or the deploy false-fails.',
            'Smoke-test sau deploy gọi các route GET cốt lõi và thất bại khi gặp 404 (route chưa mount = build cũ/dở). Chỉ thêm các route GET không tham số, không auth trả về khác-404 — đừng thêm route chỉ POST hay cần tham số, kẻo deploy báo hỏng nhầm.',
          ),
        }),
      ],
    },
  ],
};
