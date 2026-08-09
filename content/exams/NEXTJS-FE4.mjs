/**
 * Next.js & React — Final Exam 4 (FE-4): 50 câu trắc nghiệm phủ cả 20 chương.
 *
 * Đề tự soạn, khác câu với FE-1/2/3. Mọi đoạn JSX/JS hỏi "in ra gì" đã CHẠY THẬT
 * (react-dom/server / node). Bốn lựa chọn mỗi câu viết cân độ dài.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NEXTJS-FE4.mjs --apply
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
      code: 'FE-4',
      source: 'SAMPLE',
      sortOrder: 7,
      title: B(
        'Final Exam 4 — the whole Next.js & React course (50 questions)',
        'Thi cuối khoá 4 — toàn bộ khoá Next.js & React (50 câu)',
      ),
      description: B(
        'A fourth full-course final with fresh questions across all twenty chapters, from JSX and hooks to the App Router, caching, Server Actions, auth, performance and deploy.',
        'Đề cuối khoá thứ tư với câu hỏi mới phủ cả hai mươi chương, từ JSX và hooks tới App Router, cache, Server Actions, xác thực, hiệu năng và deploy.',
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
            'What does this print?' + code('console.log(JSON.stringify([1,2,3].flatMap(n => [n, n * 10])));'),
            'Đoạn này in ra gì?' + code('console.log(JSON.stringify([1,2,3].flatMap(n => [n, n * 10])));'),
          ),
          options: [
            B('[1,10,2,20,3,30] — each item expands to two', '[1,10,2,20,3,30] — mỗi phần tử nở ra hai'),
            B('[[1,10],[2,20],[3,30]] — a nested array', '[[1,10],[2,20],[3,30]] — một mảng lồng'),
            B('[1,2,3,10,20,30] — originals then tens', '[1,2,3,10,20,30] — số gốc rồi số nhân mười'),
            B('[10,20,30] — only the mapped values', '[10,20,30] — chỉ các giá trị đã ánh xạ'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>flatMap</code> maps then flattens one level, so each <code>n</code> produces <code>[n, n*10]</code> and the pairs are flattened in place. It is handy for rendering a list where each item expands into several elements.',
            'Đã chạy thật. <code>flatMap</code> ánh xạ rồi làm phẳng một tầng, nên mỗi <code>n</code> cho <code>[n, n*10]</code> và các cặp được làm phẳng tại chỗ. Nó tiện khi render một danh sách mà mỗi phần tử nở ra vài phần tử.',
          ),
        }),
        mcq({
          prompt: B(
            'What renders for a component <code>Greet({ name = "guest" })</code> called as <code>&lt;Greet /&gt;</code>?',
            'Component <code>Greet({ name = "guest" })</code> gọi là <code>&lt;Greet /&gt;</code> render ra gì?',
          ),
          options: [
            B('&lt;p&gt;Hi, guest&lt;/p&gt; because the default applies', '&lt;p&gt;Hi, guest&lt;/p&gt; vì giá trị mặc định được áp'),
            B('&lt;p&gt;Hi, &lt;/p&gt; because name is undefined', '&lt;p&gt;Hi, &lt;/p&gt; vì name là undefined'),
            B('&lt;p&gt;Hi, name&lt;/p&gt; using the literal word', '&lt;p&gt;Hi, name&lt;/p&gt; dùng đúng chữ đó'),
            B('It throws because name is required', 'Nó báo lỗi vì name là bắt buộc'),
          ],
          correct: 0,
          explanation: EX(
            'Verified with renderToStaticMarkup. When <code>name</code> is not passed it is <code>undefined</code>, so the destructuring default <code>"guest"</code> applies, giving "Hi, guest". Defaults keep components usable without every prop supplied.',
            'Đã kiểm bằng renderToStaticMarkup. Khi không truyền <code>name</code> thì nó là <code>undefined</code>, nên giá trị mặc định khi phân rã <code>"guest"</code> được áp, cho "Hi, guest". Mặc định giúp component dùng được mà không cần truyền đủ prop.',
          ),
        }),
        mcq({
          prompt: B(
            'What renders?' + code('return <div>{[].length > 0 && <ul>x</ul>}</div>;'),
            'Cái gì được render?' + code('return <div>{[].length > 0 && <ul>x</ul>}</div>;'),
          ),
          options: [
            B('&lt;div&gt;&lt;/div&gt; because the boolean is false', '&lt;div&gt;&lt;/div&gt; vì boolean là false'),
            B('&lt;div&gt;0&lt;/div&gt; because 0 is rendered', '&lt;div&gt;0&lt;/div&gt; vì số 0 được render'),
            B('&lt;div&gt;&lt;ul&gt;x&lt;/ul&gt;&lt;/div&gt; regardless', '&lt;div&gt;&lt;ul&gt;x&lt;/ul&gt;&lt;/div&gt; bất kể'),
            B('&lt;div&gt;false&lt;/div&gt; printing the boolean', '&lt;div&gt;false&lt;/div&gt; in ra boolean'),
          ],
          correct: 0,
          explanation: EX(
            'Verified with renderToStaticMarkup. <code>[].length &gt; 0</code> is a real boolean <code>false</code>, and React renders nothing for booleans — so the div is empty. This is the correct pattern; using <code>[].length &amp;&amp; ...</code> would render a stray 0.',
            'Đã kiểm bằng renderToStaticMarkup. <code>[].length &gt; 0</code> là boolean <code>false</code> thật, và React không render gì cho boolean — nên div rỗng. Đây là mẫu đúng; dùng <code>[].length &amp;&amp; ...</code> sẽ render một số 0 lạc lõng.',
          ),
        }),
        // Ch2
        mcq({
          prompt: B(
            'What does this print?' + code('const p = { a: 1 }; const q = { ...p }; q.a = 2; console.log(p.a, q.a);'),
            'Đoạn này in ra gì?' + code('const p = { a: 1 }; const q = { ...p }; q.a = 2; console.log(p.a, q.a);'),
          ),
          options: [
            B('1 2 because spread makes an independent copy', '1 2 vì spread tạo một bản sao độc lập'),
            B('2 2 because both point to the same object', '2 2 vì cả hai trỏ tới cùng một object'),
            B('1 1 because q.a assignment is ignored', '1 1 vì phép gán q.a bị bỏ qua'),
            B('undefined 2 because p loses its key', 'undefined 2 vì p mất khoá của nó'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. The spread <code>{ ...p }</code> makes a shallow copy, so <code>q</code> is a separate object; changing <code>q.a</code> does not touch <code>p.a</code>. This is why immutable state updates spread the old object into a new one.',
            'Đã chạy thật. Spread <code>{ ...p }</code> tạo một bản sao nông, nên <code>q</code> là object riêng; đổi <code>q.a</code> không đụng <code>p.a</code>. Vì thế cập nhật state bất biến spread object cũ vào một object mới.',
          ),
        }),
        mcq({
          prompt: B(
            'A reusable Card that wraps arbitrary content in a bordered box should receive that content via…',
            'Một Card tái dùng bọc nội dung bất kỳ trong một hộp viền nên nhận nội dung đó qua…',
          ),
          options: [
            B('The children prop, nested between its tags', 'Prop children, lồng giữa hai thẻ của nó'),
            B('A content prop passed as an HTML string', 'Một prop content truyền dưới dạng chuỗi HTML'),
            B('Class inheritance from a base component', 'Kế thừa class từ một component gốc'),
            B('A global variable the Card reads at render', 'Một biến toàn cục Card đọc lúc render'),
          ],
          correct: 0,
          explanation: EX(
            'Composition via <code>children</code> is the React way: <code>&lt;Card&gt;...&lt;/Card&gt;</code> passes the nested JSX as <code>props.children</code>, which the Card renders in its shell. HTML strings are unsafe, inheritance is discouraged, and globals bypass React.',
            'Ghép nối qua <code>children</code> là cách của React: <code>&lt;Card&gt;...&lt;/Card&gt;</code> truyền JSX lồng vào làm <code>props.children</code> để Card render trong lớp vỏ. Chuỗi HTML thì không an toàn, kế thừa không được khuyến khích, và biến toàn cục đi vòng qua React.',
          ),
        }),
        // Ch3
        mcq({
          prompt: B(
            'What does this print?' + code('console.log(JSON.stringify(Array.from(new Set([1,1,2,3,3]))));'),
            'Đoạn này in ra gì?' + code('console.log(JSON.stringify(Array.from(new Set([1,1,2,3,3]))));'),
          ),
          options: [
            B('[1,2,3] because a Set drops duplicates', '[1,2,3] vì một Set bỏ trùng'),
            B('[1,1,2,3,3] because Set keeps everything', '[1,1,2,3,3] vì Set giữ tất cả'),
            B('[3,2,1] because a Set reverses order', '[3,2,1] vì một Set đảo thứ tự'),
            B('[1,2,3,3] because only the first dup drops', '[1,2,3,3] vì chỉ bỏ trùng đầu tiên'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. A <code>Set</code> stores unique values in insertion order, so duplicates are removed and <code>Array.from</code> gives <code>[1,2,3]</code>. This is a common dedupe idiom, e.g. for stable list keys.',
            'Đã chạy thật. Một <code>Set</code> lưu các giá trị duy nhất theo thứ tự chèn, nên trùng bị bỏ và <code>Array.from</code> cho <code>[1,2,3]</code>. Đây là mẫu khử trùng quen thuộc, ví dụ cho key danh sách ổn định.',
          ),
        }),
        mcq({
          prompt: B(
            'Calling <code>setState</code> with a value equal to the current one (primitive) will…',
            'Gọi <code>setState</code> với một giá trị bằng giá trị hiện tại (kiểu nguyên thuỷ) sẽ…',
          ),
          options: [
            B('Let React bail out of re-rendering that component', 'Cho React bỏ qua việc render lại component đó'),
            B('Always force a full re-render anyway', 'Luôn ép render lại toàn bộ dù sao'),
            B('Throw an error about a duplicate value', 'Ném lỗi về giá trị trùng'),
            B('Silently discard the component state', 'Âm thầm bỏ state của component'),
          ],
          correct: 0,
          explanation: EX(
            'When you set state to a value that is <code>Object.is</code>-equal to the current one, React can bail out and skip re-rendering that component (it may still run render once to check). It is why replacing an object reference matters even when contents look the same.',
            'Khi bạn đặt state bằng một giá trị <code>Object.is</code>-bằng giá trị hiện tại, React có thể bỏ qua và không render lại component đó (đôi khi vẫn render một lần để kiểm). Vì thế việc thay tham chiếu object mới quan trọng ngay cả khi nội dung trông giống nhau.',
          ),
        }),
        // Ch4
        mcq({
          prompt: B(
            'To submit a controlled form, the handler should read values from…',
            'Để submit một form có kiểm soát, handler nên đọc giá trị từ…',
          ),
          options: [
            B('React state, which already holds each field value', 'State React, vốn đã giữ giá trị từng trường'),
            B('The DOM directly via document.querySelector', 'DOM trực tiếp qua document.querySelector'),
            B('A ref on every single input element', 'Một ref trên từng phần tử input một'),
            B('The URL query string of the current page', 'Chuỗi truy vấn URL của trang hiện tại'),
          ],
          correct: 0,
          explanation: EX(
            'In a controlled form, state is the single source of truth, so the submit handler just reads the state object — no DOM querying needed. Refs are for uncontrolled inputs; the URL is unrelated to form values.',
            'Trong một form có kiểm soát, state là nguồn sự thật duy nhất, nên handler submit chỉ cần đọc object state — không cần truy vấn DOM. Ref dành cho ô không kiểm soát; URL không liên quan tới giá trị form.',
          ),
        }),
        mcq({
          prompt: B(
            'A select dropdown in a controlled form is bound with…',
            'Một dropdown select trong form có kiểm soát được ràng buộc bằng…',
          ),
          options: [
            B('value on the select plus onChange to update state', 'value trên select cộng onChange cập nhật state'),
            B('selected on each option and no onChange handler', 'selected trên từng option và không có onChange'),
            B('A ref read only when the form submits', 'Một ref chỉ đọc khi form submit'),
            B('defaultValue on every option element', 'defaultValue trên mọi phần tử option'),
          ],
          correct: 0,
          explanation: EX(
            'A controlled <code>&lt;select value={x} onChange={...}&gt;</code> keeps the chosen option in state — you do not put <code>selected</code> on options in React. Refs/<code>defaultValue</code> are the uncontrolled approach.',
            'Một <code>&lt;select value={x} onChange={...}&gt;</code> có kiểm soát giữ option được chọn trong state — trong React bạn không đặt <code>selected</code> trên các option. Ref/<code>defaultValue</code> là cách không kiểm soát.',
          ),
        }),
        // Ch5
        mcq({
          prompt: B(
            'An effect with dependencies <code>[a, b]</code> re-runs when…',
            'Một effect với dependency <code>[a, b]</code> chạy lại khi…',
          ),
          options: [
            B('Either a or b changes between renders', 'Một trong a hoặc b đổi giữa các lần render'),
            B('Both a and b change at the same time', 'Cả a và b đổi cùng một lúc'),
            B('Only on the very first render', 'Chỉ ở lần render đầu tiên'),
            B('Any state anywhere in the app changes', 'Bất kỳ state nào trong ứng dụng đổi'),
          ],
          correct: 0,
          explanation: EX(
            'React compares each dependency to its previous value; if ANY differs, the effect re-runs (after cleanup). It does not require all to change, and it is scoped to the listed deps, not global state.',
            'React so sánh từng dependency với giá trị trước; nếu BẤT KỲ cái nào khác, effect chạy lại (sau khi dọn dẹp). Nó không đòi tất cả phải đổi, và chỉ giới hạn ở các dep được liệt kê, không phải state toàn cục.',
          ),
        }),
        mcq({
          prompt: B(
            'A search effect refetches on each keystroke and results arrive out of order. The robust fix is…',
            'Một effect tìm kiếm tải lại ở mỗi phím và kết quả về không đúng thứ tự. Cách sửa bền vững là…',
          ),
          options: [
            B('A cleanup that ignores or aborts the stale request', 'Một dọn dẹp bỏ qua hoặc huỷ request cũ'),
            B('Removing the dependency array from the effect', 'Bỏ mảng dependency khỏi effect'),
            B('Wrapping the fetch call in a try/catch block', 'Bọc lời fetch trong một khối try/catch'),
            B('Increasing the debounce delay to ten seconds', 'Tăng độ trễ debounce lên mười giây'),
          ],
          correct: 0,
          explanation: EX(
            'Each run should discard its result if a newer run started: the cleanup sets an <code>ignore</code> flag or calls <code>abort()</code>, and the resolved fetch checks it before <code>setState</code>. try/catch handles errors, not ordering; debounce only reduces frequency.',
            'Mỗi lần chạy nên bỏ kết quả của mình nếu đã có lần mới hơn: dọn dẹp đặt cờ <code>ignore</code> hoặc gọi <code>abort()</code>, và fetch xong sẽ kiểm trước khi <code>setState</code>. try/catch xử lý lỗi, không phải thứ tự; debounce chỉ giảm tần suất.',
          ),
        }),
        // Ch6
        mcq({
          prompt: B(
            'Which value belongs in a ref rather than state? (choose TWO)',
            'Giá trị nào nên nằm trong ref thay vì state? (chọn HAI)',
          ),
          options: [
            B('A setInterval id you clear later', 'Một id của setInterval để xoá sau'),
            B('The DOM node of an input to focus', 'Nút DOM của một input để focus'),
            B('The text shown in a controlled input', 'Chữ hiển thị trong một ô có kiểm soát'),
            B('A counter shown in the UI', 'Một bộ đếm hiển thị trên UI'),
          ],
          correct: [0, 1],
          explanation: EX(
            'A timer id and a DOM node are values you keep across renders without needing a re-render — ideal for a ref. Anything the UI must reflect (input text, a visible counter) belongs in state so changes re-render.',
            'Một id timer và một nút DOM là các giá trị bạn giữ qua render mà không cần render lại — lý tưởng cho ref. Bất cứ thứ gì UI phải phản ánh (chữ trong ô nhập, bộ đếm hiển thị) thuộc về state để thay đổi kích hoạt render.',
          ),
        }),
        mcq({
          prompt: B(
            'The main reason to use <code>useReducer</code> over several <code>useState</code> is…',
            'Lý do chính dùng <code>useReducer</code> thay nhiều <code>useState</code> là…',
          ),
          options: [
            B('Related transitions live in one pure, testable function', 'Các chuyển trạng thái liên quan gom vào một hàm thuần, dễ test'),
            B('It automatically persists the state to disk', 'Nó tự động lưu state xuống đĩa'),
            B('It removes the need for any event handlers', 'Nó loại bỏ nhu cầu về handler sự kiện'),
            B('It makes the component render on the server', 'Nó làm component render trên server'),
          ],
          correct: 0,
          explanation: EX(
            '<code>useReducer</code> centralizes interrelated updates in one <code>(state, action) =&gt; newState</code> function — easier to test and reason about than juggling many setters. It does not persist state or change where rendering happens.',
            '<code>useReducer</code> gom các cập nhật liên quan vào một hàm <code>(state, action) =&gt; newState</code> — dễ test và suy luận hơn tung hứng nhiều setter. Nó không lưu state hay đổi nơi render diễn ra.',
          ),
        }),
        // Ch7
        mcq({
          prompt: B(
            'Which statement about React <code>key</code> is TRUE?',
            'Phát biểu nào về <code>key</code> của React là ĐÚNG?',
          ),
          options: [
            B('It identifies items for reconciliation and is not in the DOM', 'Nó định danh phần tử cho reconciliation và không có trong DOM'),
            B('It is rendered as a key attribute on the element', 'Nó được render thành thuộc tính key trên phần tử'),
            B('It must be a globally unique value across the app', 'Nó phải duy nhất toàn cục trên cả ứng dụng'),
            B('It is only needed when the list never changes', 'Nó chỉ cần khi danh sách không bao giờ đổi'),
          ],
          correct: 0,
          explanation: EX(
            'A key helps React match items across renders during reconciliation; it never appears in the DOM. It must be unique among siblings (not app-wide), and it matters most exactly when lists reorder/insert/delete.',
            'Một key giúp React khớp phần tử qua các lần render khi reconciliation; nó không bao giờ xuất hiện trong DOM. Nó phải duy nhất trong các anh em (không phải toàn ứng dụng), và quan trọng nhất đúng khi danh sách sắp lại/chèn/xoá.',
          ),
        }),
        mcq({
          prompt: B(
            'Wrapping a child in <code>React.memo</code> helps only if…',
            'Bọc một con trong <code>React.memo</code> chỉ hữu ích nếu…',
          ),
          options: [
            B('Its props are referentially stable between renders', 'Prop của nó ổn định theo tham chiếu giữa các lần render'),
            B('It has no props passed from the parent at all', 'Nó hoàn toàn không có prop nào từ cha'),
            B('The parent never re-renders under any condition', 'Cha không bao giờ render lại trong bất kỳ điều kiện nào'),
            B('It contains at least one useEffect hook inside', 'Nó chứa ít nhất một hook useEffect bên trong'),
          ],
          correct: 0,
          explanation: EX(
            '<code>React.memo</code> skips re-render when props are shallow-equal. If the parent passes fresh inline objects/functions each render, the props are never equal and memo does nothing — stabilize them with <code>useMemo</code>/<code>useCallback</code>.',
            '<code>React.memo</code> bỏ qua render lại khi props nông-bằng. Nếu cha truyền object/hàm inline mới mỗi render, props không bao giờ bằng và memo vô ích — hãy ổn định chúng bằng <code>useMemo</code>/<code>useCallback</code>.',
          ),
        }),
        // Ch8
        mcq({
          prompt: B(
            'Which best describes a nested layout in the App Router?',
            'Điều nào mô tả đúng nhất một layout lồng trong App Router?',
          ),
          options: [
            B('It wraps its child pages and persists across their navigations', 'Nó bọc các trang con và tồn tại qua các lần điều hướng của chúng'),
            B('It re-mounts on every navigation between child pages', 'Nó remount ở mỗi lần điều hướng giữa các trang con'),
            B('It runs only in the browser after hydration', 'Nó chỉ chạy trong trình duyệt sau hydration'),
            B('It replaces the parent layout entirely on load', 'Nó thay hoàn toàn layout cha khi tải'),
          ],
          correct: 0,
          explanation: EX(
            'Layouts nest and are preserved: navigating between pages that share a layout keeps it mounted with its state intact — only the changing page segment re-renders. (A <code>template.tsx</code> is the variant that re-mounts each time.)',
            'Layout lồng nhau và được giữ nguyên: điều hướng giữa các trang cùng layout giữ nó mounted với state còn nguyên — chỉ đoạn trang đang đổi render lại. (<code>template.tsx</code> là biến thể remount mỗi lần.)',
          ),
        }),
        mcq({
          prompt: B(
            'A URL <code>/docs/getting-started/install</code> is served by a catch-all route defined as…',
            'URL <code>/docs/getting-started/install</code> được phục vụ bởi một catch-all route định nghĩa là…',
          ),
          options: [
            B('app/docs/[...slug]/page.tsx capturing the rest', 'app/docs/[...slug]/page.tsx bắt phần còn lại'),
            B('app/docs/[slug]/page.tsx capturing one segment', 'app/docs/[slug]/page.tsx bắt một đoạn'),
            B('app/docs/page.tsx with query parameters', 'app/docs/page.tsx với tham số truy vấn'),
            B('app/docs/(slug)/page.tsx as a route group', 'app/docs/(slug)/page.tsx như một route group'),
          ],
          correct: 0,
          explanation: EX(
            'A catch-all segment <code>[...slug]</code> captures one or more path parts as an array (<code>["getting-started","install"]</code>). A single <code>[slug]</code> matches only one segment; a route group adds no segment at all.',
            'Một đoạn catch-all <code>[...slug]</code> bắt một hoặc nhiều phần đường dẫn thành mảng (<code>["getting-started","install"]</code>). Một <code>[slug]</code> đơn chỉ khớp một đoạn; route group không thêm đoạn nào.',
          ),
        }),
        mcq({
          prompt: B(
            'Where do you put a spinner that shows while a segment&#x27;s data loads?',
            'Bạn đặt một spinner hiện trong khi dữ liệu của một đoạn đang tải ở đâu?',
          ),
          options: [
            B('In loading.tsx, which Next streams as a Suspense fallback', 'Trong loading.tsx, thứ Next stream làm màn dự phòng Suspense'),
            B('In error.tsx, which handles the loading phase', 'Trong error.tsx, thứ xử lý giai đoạn tải'),
            B('In a useEffect that toggles a global spinner', 'Trong một useEffect bật/tắt spinner toàn cục'),
            B('In next.config.js under the loading key', 'Trong next.config.js dưới khoá loading'),
          ],
          correct: 0,
          explanation: EX(
            '<code>loading.tsx</code> is the built-in Suspense fallback for a segment — Next streams it immediately while the async Server Component awaits data. <code>error.tsx</code> is for errors; a global effect spinner is unnecessary and less precise.',
            '<code>loading.tsx</code> là màn dự phòng Suspense dựng sẵn cho một đoạn — Next stream nó ngay trong khi Server Component async chờ dữ liệu. <code>error.tsx</code> dành cho lỗi; một spinner toàn cục bằng effect vừa thừa vừa kém chính xác.',
          ),
        }),
        // Ch9
        mcq({
          prompt: B(
            'Which pair of tasks requires a Client Component? (choose TWO)',
            'Cặp việc nào cần một Client Component? (chọn HAI)',
          ),
          options: [
            B('Handling an onClick to open a menu', 'Xử lý một onClick để mở menu'),
            B('Using useState for a toggle', 'Dùng useState cho một công tắc'),
            B('Awaiting a database query in the body', 'await một truy vấn cơ sở dữ liệu trong thân'),
            B('Reading params to fetch a record', 'Đọc params để tải một bản ghi'),
          ],
          correct: [0, 1],
          explanation: EX(
            'Event handlers and <code>useState</code> are browser-side interactivity → Client Component. Awaiting a query and reading route params to fetch are the natural home of Server Components — no <code>"use client"</code> needed there.',
            'Handler sự kiện và <code>useState</code> là tính tương tác phía trình duyệt → Client Component. await một truy vấn và đọc params route để tải là nhà của Server Component — chỗ đó không cần <code>"use client"</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'The smallest-boundary rule for Client Components means you should…',
            'Luật ranh giới nhỏ nhất cho Client Component nghĩa là bạn nên…',
          ),
          options: [
            B('Mark only the interactive leaves as client, not the page', 'Chỉ đánh dấu các lá tương tác là client, không phải cả trang'),
            B('Mark the root layout as client for consistency', 'Đánh dấu root layout là client cho đồng nhất'),
            B('Mark every component as client to avoid confusion', 'Đánh dấu mọi component là client để tránh nhầm'),
            B('Never use Client Components anywhere in the app', 'Không bao giờ dùng Client Component ở đâu cả'),
          ],
          correct: 0,
          explanation: EX(
            'Push <code>"use client"</code> to the smallest interactive leaves so most of the tree stays a Server Component — less JS shipped, secrets on the server, data fetched close by. Marking the root client drags everything into the bundle.',
            'Hãy đẩy <code>"use client"</code> xuống các lá tương tác nhỏ nhất để phần lớn cây vẫn là Server Component — gửi ít JS, bí mật ở server, dữ liệu tải gần. Đánh dấu root là client kéo mọi thứ vào bundle.',
          ),
        }),
        mcq({
          prompt: B(
            'Why can a Server Component safely import a database client?',
            'Vì sao một Server Component có thể an toàn import một client cơ sở dữ liệu?',
          ),
          options: [
            B('Its code runs on the server and never ships to the browser', 'Mã của nó chạy trên server và không bao giờ gửi xuống trình duyệt'),
            B('React encrypts the database client in the bundle', 'React mã hoá client cơ sở dữ liệu trong bundle'),
            B('The database client works only in the browser', 'Client cơ sở dữ liệu chỉ chạy trong trình duyệt'),
            B('Server Components cannot import anything at all', 'Server Component không import được gì cả'),
          ],
          correct: 0,
          explanation: EX(
            'Server Component code executes on the server and the browser only receives its rendered output — so credentials and DB clients stay server-side. Putting the same import in a Client Component would ship it to the browser.',
            'Mã Server Component chạy trên server và trình duyệt chỉ nhận kết quả đã render — nên thông tin đăng nhập và client DB ở lại server. Đặt cùng lời import đó trong một Client Component sẽ gửi nó xuống trình duyệt.',
          ),
        }),
        // Ch10
        mcq({
          prompt: B(
            'A blog post page that rarely changes and needs fast loads is best served with…',
            'Một trang bài blog hiếm khi đổi và cần tải nhanh nên được phục vụ bằng…',
          ),
          options: [
            B('SSG plus revalidate (ISR) for occasional freshness', 'SSG cộng revalidate (ISR) cho tươi thi thoảng'),
            B('SSR with cache: no-store on every request', 'SSR với cache: no-store ở mọi request'),
            B('Client-side rendering after the page loads', 'Render phía client sau khi trang tải'),
            B('A dynamic route reading cookies each time', 'Một route động đọc cookie mỗi lần'),
          ],
          correct: 0,
          explanation: EX(
            'Rarely-changing content wants static generation for speed, with <code>revalidate</code> (ISR) to refresh occasionally. Per-request SSR/<code>no-store</code> or reading cookies makes it dynamic and slower; CSR delays content until JS loads.',
            'Nội dung hiếm đổi cần dựng tĩnh để nhanh, kèm <code>revalidate</code> (ISR) để tươi thi thoảng. SSR/<code>no-store</code> theo request hay đọc cookie làm nó động và chậm hơn; CSR trì hoãn nội dung tới khi JS tải.',
          ),
        }),
        mcq({
          prompt: B(
            'What does this comparison give?' + code("console.log('2026-01-05' < '2026-01-11');"),
            'Phép so sánh này cho gì?' + code("console.log('2026-01-05' < '2026-01-11');"),
          ),
          options: [
            B('true, because ISO date strings compare correctly', 'true, vì chuỗi ngày ISO so sánh đúng'),
            B('false, because string compare is random', 'false, vì so sánh chuỗi là ngẫu nhiên'),
            B('It throws because they are not Date objects', 'Nó báo lỗi vì chúng không phải object Date'),
            B('NaN, because subtraction is undefined here', 'NaN, vì phép trừ ở đây không xác định'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. ISO 8601 date strings (<code>YYYY-MM-DD</code>) sort lexicographically the same as chronologically, so <code>&lt;</code> gives <code>true</code>. This is why the course sorts by ISO strings rather than platform-dependent locale compares.',
            'Đã chạy thật. Chuỗi ngày ISO 8601 (<code>YYYY-MM-DD</code>) sắp theo từ điển trùng với thứ tự thời gian, nên <code>&lt;</code> cho <code>true</code>. Vì thế khoá học sắp theo chuỗi ISO thay vì so sánh locale phụ thuộc nền tảng.',
          ),
        }),
        mcq({
          prompt: B(
            'Reading data with <code>cookies()</code> in a page has which effect on rendering?',
            'Đọc dữ liệu bằng <code>cookies()</code> trong một trang có tác động gì tới việc render?',
          ),
          options: [
            B('It opts the route into dynamic rendering per request', 'Nó đưa route vào render động theo từng request'),
            B('It keeps the route statically generated at build', 'Nó giữ route dựng tĩnh lúc build'),
            B('It converts the page into a Client Component', 'Nó biến trang thành một Client Component'),
            B('It has no effect on static versus dynamic', 'Nó không ảnh hưởng tĩnh so với động'),
          ],
          correct: 0,
          explanation: EX(
            'Reading request-specific data such as cookies makes the output request-dependent, so Next renders the route dynamically instead of statically at build. It does not change the Server/Client nature of the component.',
            'Đọc dữ liệu riêng-request như cookie làm kết quả phụ thuộc request, nên Next render route một cách động thay vì tĩnh lúc build. Nó không đổi bản chất Server/Client của component.',
          ),
        }),
        // Ch11
        mcq({
          prompt: B(
            'In a Route Handler, you read the request body JSON with…',
            'Trong một Route Handler, bạn đọc JSON của thân request bằng…',
          ),
          options: [
            B('await request.json() on the Web Request', 'await request.json() trên Web Request'),
            B('request.body parsed automatically', 'request.body được parse tự động'),
            B('bodyParser middleware like in Express', 'middleware bodyParser như trong Express'),
            B('JSON.parse(process.stdin) synchronously', 'JSON.parse(process.stdin) một cách đồng bộ'),
          ],
          correct: 0,
          explanation: EX(
            'App Router handlers receive a Web <code>Request</code>; read the body with <code>await request.json()</code> (or <code>text()</code>/<code>formData()</code>). There is no auto-parsed <code>request.body</code> or Express-style body parser.',
            'Handler của App Router nhận một Web <code>Request</code>; đọc thân bằng <code>await request.json()</code> (hoặc <code>text()</code>/<code>formData()</code>). Không có <code>request.body</code> tự parse hay body parser kiểu Express.',
          ),
        }),
        mcq({
          prompt: B(
            'To send an unauthenticated visitor from a Server Component to /login, call…',
            'Để đưa một khách chưa xác thực từ một Server Component tới /login, gọi…',
          ),
          options: [
            B('redirect("/login") from next/navigation', 'redirect("/login") từ next/navigation'),
            B('router.push("/login") from next/router', 'router.push("/login") từ next/router'),
            B('window.location.assign("/login") on the server', 'window.location.assign("/login") trên server'),
            B('res.redirect("/login") like in Express', 'res.redirect("/login") như trong Express'),
          ],
          correct: 0,
          explanation: EX(
            '<code>redirect()</code> from <code>next/navigation</code> works in Server Components, Route Handlers and Server Actions. <code>next/router</code> is the old Pages Router; <code>window</code> does not exist on the server; there is no <code>res</code> object.',
            '<code>redirect()</code> từ <code>next/navigation</code> chạy được trong Server Component, Route Handler và Server Action. <code>next/router</code> là Pages Router cũ; <code>window</code> không tồn tại trên server; không có object <code>res</code>.',
          ),
        }),
        // Ch12
        mcq({
          prompt: B(
            'A Server Action returning validation errors to the form typically pairs with…',
            'Một Server Action trả về lỗi validation cho form thường đi cặp với…',
          ),
          options: [
            B('useActionState to hold the returned state', 'useActionState để giữ state trả về'),
            B('useEffect polling the server for errors', 'useEffect thăm dò server tìm lỗi'),
            B('a global window error variable', 'một biến lỗi toàn cục trên window'),
            B('localStorage to persist the errors', 'localStorage để lưu các lỗi'),
          ],
          correct: 0,
          explanation: EX(
            '<code>useActionState</code> (React 19) wires an action to state: the action returns an object (e.g. <code>{ errors }</code>) and the hook exposes it for rendering, plus a pending flag. Polling/globals/localStorage are unnecessary and fragile.',
            '<code>useActionState</code> (React 19) nối một action với state: action trả về một object (ví dụ <code>{ errors }</code>) và hook để lộ nó cho việc render, cộng một cờ pending. Thăm dò/biến toàn cục/localStorage vừa thừa vừa dễ vỡ.',
          ),
        }),
        mcq({
          prompt: B(
            'Which is TRUE about a Server Action&#x27;s security?',
            'Điều nào ĐÚNG về bảo mật của một Server Action?',
          ),
          options: [
            B('It is a public endpoint, so validate inputs server-side', 'Nó là endpoint công khai, nên kiểm dữ liệu vào ở server'),
            B('Only your own form can ever invoke it', 'Chỉ form của bạn mới gọi được nó'),
            B('Its body can safely run on the client too', 'Thân của nó chạy an toàn cả trên client'),
            B('It cannot read cookies or the session', 'Nó không đọc được cookie hay phiên'),
          ],
          correct: 0,
          explanation: EX(
            'Next exposes actions as callable server endpoints, so anyone can post to them — always validate/authorize server-side. The body runs only on the server (that is the point), and it can read cookies via <code>cookies()</code>.',
            'Next để lộ action như các endpoint server gọi được, nên ai cũng POST tới được — hãy luôn kiểm/uỷ quyền ở server. Thân chỉ chạy trên server (đó là điểm chính), và nó đọc được cookie qua <code>cookies()</code>.',
          ),
        }),
        // Ch13
        mcq({
          prompt: B(
            'Why does Tailwind ship a small CSS file despite a huge utility system?',
            'Vì sao Tailwind gửi một file CSS nhỏ dù hệ tiện ích khổng lồ?',
          ),
          options: [
            B('The build emits only the classes actually found in your code', 'Bước build chỉ phát ra các class thật sự tìm thấy trong mã'),
            B('It compresses the full stylesheet with gzip only', 'Nó chỉ nén toàn bộ stylesheet bằng gzip'),
            B('It moves all styling into inline attributes', 'Nó chuyển mọi kiểu vào thuộc tính inline'),
            B('It loads styles lazily from a remote CDN', 'Nó tải kiểu lười từ một CDN từ xa'),
          ],
          correct: 0,
          explanation: EX(
            'Tailwind scans your source and generates only the utilities you used (JIT/purge), so unused classes never ship. Compression, inline styles or a CDN are not how it keeps the file small.',
            'Tailwind quét mã nguồn và chỉ sinh các tiện ích bạn đã dùng (JIT/purge), nên class không dùng không bao giờ được gửi. Nén, style inline hay CDN không phải cách nó giữ file nhỏ.',
          ),
        }),
        mcq({
          prompt: B(
            'A theme-aware text color that adapts to light and dark is best done with…',
            'Một màu chữ theo theme thích ứng sáng và tối nên được làm tốt nhất bằng…',
          ),
          options: [
            B('A CSS variable each theme redefines, applied as color', 'Một biến CSS mỗi theme định nghĩa lại, áp làm color'),
            B('A single hardcoded hex used in both themes', 'Một hex gán cứng dùng ở cả hai theme'),
            B('A global Tailwind dark: utility on the html tag', 'Một tiện ích dark: của Tailwind toàn cục trên thẻ html'),
            B('An inline color computed from the current time', 'Một color inline tính từ thời gian hiện tại'),
          ],
          correct: 0,
          explanation: EX(
            'Redefine a CSS variable per theme and apply it as the text <code>color</code> so one rule adapts. A hardcoded hex ignores the theme; a global <code>dark:</code> utility is reserved for the Notes wrapper on cuongthai.com; a time-based color is nonsense.',
            'Định nghĩa lại một biến CSS theo từng theme rồi áp làm <code>color</code> chữ để một luật thích ứng. Một hex gán cứng bỏ qua theme; một tiện ích <code>dark:</code> toàn cục dành cho vỏ Notes trên cuongthai.com; màu theo thời gian là vô nghĩa.',
          ),
        }),
        // Ch14
        mcq({
          prompt: B(
            'You have a cart shared across a header badge and a cart page far apart in the tree. Use…',
            'Bạn có một giỏ hàng dùng chung giữa badge trên header và trang giỏ ở xa nhau trong cây. Dùng…',
          ),
          options: [
            B('A client store (e.g. Zustand) both components read', 'Một client store (ví dụ Zustand) cả hai cùng đọc'),
            B('Prop-drilling the cart through every layer', 'Khoan giỏ hàng qua từng tầng bằng prop'),
            B('A separate useState copy in each component', 'Một bản useState riêng trong mỗi component'),
            B('A URL query string holding the whole cart', 'Một chuỗi truy vấn URL chứa cả giỏ hàng'),
          ],
          correct: 0,
          explanation: EX(
            'Distant components sharing mutable state is the classic case for a store like Zustand: both subscribe and stay in sync without prop-drilling. Separate <code>useState</code> copies drift; the URL is a poor place for a full cart object.',
            'Các component ở xa chia sẻ state có thể đổi là trường hợp kinh điển cho một store như Zustand: cả hai đăng ký và luôn đồng bộ mà không cần khoan prop. Các bản <code>useState</code> riêng sẽ lệch; URL là chỗ tồi cho cả một object giỏ hàng.',
          ),
        }),
        mcq({
          prompt: B(
            'Server data with caching, background refetch and retries is best handled by…',
            'Dữ liệu server có cache, tải lại nền và thử lại được xử lý tốt nhất bằng…',
          ),
          options: [
            B('TanStack Query, built for async server state', 'TanStack Query, sinh ra cho server state bất đồng bộ'),
            B('A single global useState you update by hand', 'Một useState toàn cục bạn tự cập nhật tay'),
            B('React Context re-rendering all consumers', 'React Context render lại mọi consumer'),
            B('A ref that stores the last response', 'Một ref lưu phản hồi cuối'),
          ],
          correct: 0,
          explanation: EX(
            'TanStack Query specializes in server state: caching, background refetch, dedup, retries, invalidation. A hand-managed global, Context, or a ref would force you to re-implement all of that yourself.',
            'TanStack Query chuyên về server state: cache, tải lại nền, gộp trùng, thử lại, vô hiệu. Một biến toàn cục tự quản, Context, hay một ref sẽ buộc bạn tự cài lại tất cả những thứ đó.',
          ),
        }),
        // Ch15
        mcq({
          prompt: B(
            'A session cookie holding a JWT should be configured as…',
            'Một cookie phiên chứa một JWT nên được cấu hình là…',
          ),
          options: [
            B('HttpOnly, Secure, SameSite, with a short-lived token', 'HttpOnly, Secure, SameSite, kèm token sống ngắn'),
            B('Readable by JavaScript for easy access', 'Đọc được bằng JavaScript cho dễ dùng'),
            B('Sent over HTTP so local dev is simpler', 'Gửi qua HTTP để dev cục bộ đơn giản hơn'),
            B('Long-lived with no refresh to reduce work', 'Sống dài không refresh để bớt việc'),
          ],
          correct: 0,
          explanation: EX(
            '<code>HttpOnly</code> blocks JS theft, <code>Secure</code> forces HTTPS, <code>SameSite</code> limits CSRF, and a short-lived token (with refresh) limits damage. Readable cookies, plain HTTP, or a long-lived no-refresh token all weaken security — the last was the cuongthai.com bug.',
            '<code>HttpOnly</code> chặn JS đánh cắp, <code>Secure</code> ép HTTPS, <code>SameSite</code> hạn chế CSRF, và một token sống ngắn (kèm refresh) giới hạn thiệt hại. Cookie đọc được, HTTP thường, hay token sống dài không refresh đều làm yếu bảo mật — cái cuối là lỗi cuongthai.com.',
          ),
        }),
        mcq({
          prompt: B(
            'To gatekeep a whole <code>/admin</code> section, the check belongs in…',
            'Để gác cả mảng <code>/admin</code>, phép kiểm thuộc về…',
          ),
          options: [
            B('middleware.ts running before the matched routes', 'middleware.ts chạy trước các route khớp'),
            B('a useEffect placed in every admin page', 'một useEffect đặt trong từng trang admin'),
            B('the browser via a client-side redirect', 'trình duyệt qua một chuyển hướng phía client'),
            B('a robots.txt disallow rule for /admin', 'một luật disallow trong robots.txt cho /admin'),
          ],
          correct: 0,
          explanation: EX(
            'Middleware runs on the edge before a matched route renders, so one file can check the session and redirect for the whole section — before any protected content renders. Per-page effects and client redirects flash protected UI; robots.txt only guides crawlers.',
            'Middleware chạy ở biên trước khi một route khớp render, nên một file có thể kiểm phiên và chuyển hướng cho cả mảng — trước khi bất kỳ nội dung được bảo vệ nào render. Effect từng trang và chuyển hướng phía client làm nháy UI được bảo vệ; robots.txt chỉ hướng dẫn trình thu thập.',
          ),
        }),
        // Ch16
        mcq({
          prompt: B(
            'Why re-validate on the server even when the client already validated?',
            'Vì sao kiểm lại trên server ngay cả khi client đã kiểm?',
          ),
          options: [
            B('The client can be bypassed; the server is the real gate', 'Client có thể bị đi vòng; server mới là cổng thật'),
            B('Server validation is faster than client validation', 'Kiểm ở server nhanh hơn kiểm ở client'),
            B('TypeScript enforces the rules at runtime anyway', 'TypeScript áp luật lúc chạy dù sao'),
            B('The database rejects any invalid input for you', 'Cơ sở dữ liệu tự từ chối mọi dữ liệu sai'),
          ],
          correct: 0,
          explanation: EX(
            'Client checks are for UX and are trivially bypassed (curl, devtools, direct action calls). The server is the trust boundary and must validate/authorize. TypeScript types vanish at runtime; the DB will not enforce app-level rules.',
            'Kiểm ở client để trải nghiệm và bị đi vòng dễ dàng (curl, devtools, gọi action trực tiếp). Server là ranh giới tin cậy và phải kiểm/uỷ quyền. Kiểu TypeScript biến mất lúc chạy; DB không áp luật cấp ứng dụng giúp bạn.',
          ),
        }),
        mcq({
          prompt: B(
            'An upload preview shows before the file finishes uploading. That preview is usually…',
            'Một bản xem trước upload hiện ra trước khi file tải xong. Bản xem trước đó thường là…',
          ),
          options: [
            B('A blob: object URL returned as-is by getMediaUrl', 'Một URL object blob: được getMediaUrl trả về nguyên vẹn'),
            B('The final CDN URL with the base prepended', 'URL CDN cuối cùng đã ghép base vào đầu'),
            B('A base64 string stored in the database', 'Một chuỗi base64 lưu trong cơ sở dữ liệu'),
            B('A server-rendered image from the API', 'Một ảnh render trên server từ API'),
          ],
          correct: 0,
          explanation: EX(
            'The instant preview is a local <code>blob:</code> object URL of the selected file, already renderable. <code>getMediaUrl</code> must return it unchanged — prepending the CDN base makes <code>https://cdn/blob:...</code> which 400s, a real cuongthai.com bug.',
            'Bản xem trước tức thì là một URL object <code>blob:</code> cục bộ của file được chọn, đã render được. <code>getMediaUrl</code> phải trả về nó nguyên vẹn — ghép base CDN vào tạo ra <code>https://cdn/blob:...</code> gây lỗi 400, một lỗi thật của cuongthai.com.',
          ),
        }),
        // Ch17
        mcq({
          prompt: B(
            'Which rendering strategy sends fresh, personalized HTML on every request?',
            'Chiến lược render nào gửi HTML tươi, cá nhân hoá ở mọi request?',
          ),
          options: [
            B('SSR, rendering on the server per request', 'SSR, render trên server theo từng request'),
            B('SSG, rendering once at build time', 'SSG, render một lần lúc build'),
            B('ISR, serving cached HTML between revalidations', 'ISR, phục vụ HTML cache giữa các lần làm mới'),
            B('CSR, rendering only in the browser', 'CSR, chỉ render trong trình duyệt'),
          ],
          correct: 0,
          explanation: EX(
            'SSR renders on the server for each request, so it can personalize (per user/session) and is always fresh — at the cost of more server work. SSG/ISR serve pre-rendered/cached shared HTML; CSR renders in the browser after JS.',
            'SSR render trên server cho từng request, nên có thể cá nhân hoá (theo người dùng/phiên) và luôn tươi — đổi lại là nhiều việc cho server hơn. SSG/ISR phục vụ HTML dùng chung dựng sẵn/cache; CSR render trong trình duyệt sau JS.',
          ),
        }),
        mcq({
          prompt: B(
            'A social crawler shows the wrong share preview. The most likely cause is…',
            'Một trình thu thập mạng xã hội hiện bản xem trước chia sẻ sai. Nguyên nhân khả dĩ nhất là…',
          ),
          options: [
            B('OG tags were set on the client, not server-rendered', 'Thẻ OG được đặt ở client, không render trên server'),
            B('The image was too small for the preview', 'Ảnh quá nhỏ cho bản xem trước'),
            B('The page used Tailwind for styling', 'Trang dùng Tailwind để tạo kiểu'),
            B('The route was statically generated at build', 'Route được dựng tĩnh lúc build'),
          ],
          correct: 0,
          explanation: EX(
            'Crawlers read the server-rendered <code>&lt;head&gt;</code> and usually do not run JS, so client-set OG tags arrive too late. Generate metadata server-side via <code>metadata</code>/<code>generateMetadata</code>. Styling and static generation are unrelated.',
            'Trình thu thập đọc <code>&lt;head&gt;</code> render trên server và thường không chạy JS, nên thẻ OG đặt ở client tới quá trễ. Hãy sinh metadata phía server qua <code>metadata</code>/<code>generateMetadata</code>. Tạo kiểu và dựng tĩnh không liên quan.',
          ),
        }),
        // Ch18
        mcq({
          prompt: B(
            'Which two help reduce a route&#x27;s client JavaScript? (choose TWO)',
            'Hai thứ nào giúp giảm JavaScript client của một route? (chọn HAI)',
          ),
          options: [
            B('Keeping logic in Server Components', 'Giữ logic trong Server Component'),
            B('Dynamic-importing heavy client widgets', 'Dynamic-import các widget client nặng'),
            B('Adding more useState to the page', 'Thêm nhiều useState vào trang'),
            B('Marking the root layout "use client"', 'Đánh dấu root layout "use client"'),
          ],
          correct: [0, 1],
          explanation: EX(
            'Server Components ship no JS, and <code>next/dynamic</code> splits heavy client code to load on demand — both shrink the bundle. Adding client state or marking the root client does the opposite, dragging more code into the browser.',
            'Server Component không gửi JS, và <code>next/dynamic</code> tách mã client nặng để tải theo nhu cầu — cả hai làm nhỏ bundle. Thêm state client hay đánh dấu root là client thì ngược lại, kéo thêm mã vào trình duyệt.',
          ),
        }),
        mcq({
          prompt: B(
            'The <code>next/image</code> component helps LCP and CLS mainly by…',
            'Component <code>next/image</code> giúp LCP và CLS chủ yếu bằng…',
          ),
          options: [
            B('Reserving space and serving optimized, lazy images', 'Giữ chỗ và phục vụ ảnh tối ưu, tải lười'),
            B('Loading every image eagerly at once', 'Tải mọi ảnh sốt sắng cùng lúc'),
            B('Rendering images as background CSS only', 'Chỉ render ảnh làm background CSS'),
            B('Disabling the browser image cache', 'Tắt cache ảnh của trình duyệt'),
          ],
          correct: 0,
          explanation: EX(
            'Required dimensions reserve space (no layout shift → better CLS), lazy loading and modern responsive formats reduce bytes and speed the largest paint (LCP). Eager-loading everything or disabling cache would hurt these metrics.',
            'Kích thước bắt buộc giữ chỗ (không xô lệch → CLS tốt hơn), tải lười và định dạng hiện đại đáp ứng giảm số byte và tăng tốc lần vẽ lớn nhất (LCP). Tải sốt sắng tất cả hay tắt cache sẽ hại các chỉ số này.',
          ),
        }),
        // Ch19
        mcq({
          prompt: B(
            'The most durable tests query the UI by…',
            'Các test bền nhất truy vấn UI theo…',
          ),
          options: [
            B('Accessible roles and visible text, like a user', 'Vai trò accessible và văn bản hiển thị, như người dùng'),
            B('The exact CSS class names in the markup', 'Đúng tên class CSS trong markup'),
            B('The component&#x27;s private internal state', 'State nội bộ riêng tư của component'),
            B('The DOM ids assigned by the framework', 'Các id DOM do framework gán'),
          ],
          correct: 0,
          explanation: EX(
            'Querying by role/label/text (React Testing Library) tests behaviour the way users experience it, so tests survive refactors that keep behaviour but change classes, ids, or internal state.',
            'Truy vấn theo vai trò/nhãn/văn bản (React Testing Library) kiểm hành vi theo cách người dùng trải nghiệm, nên test sống sót qua refactor giữ hành vi nhưng đổi class, id, hay state nội bộ.',
          ),
        }),
        mcq({
          prompt: B(
            'Why can a check pass <code>tsc</code> yet still break at runtime?',
            'Vì sao một phép kiểm có thể qua <code>tsc</code> mà vẫn vỡ lúc chạy?',
          ),
          options: [
            B('tsc checks types, not behaviour or excluded files', 'tsc kiểm kiểu, không kiểm hành vi hay file bị loại trừ'),
            B('tsc always runs the code as part of checking', 'tsc luôn chạy mã như một phần của việc kiểm'),
            B('tsc validates runtime values in the database', 'tsc kiểm các giá trị lúc chạy trong cơ sở dữ liệu'),
            B('tsc guarantees every branch is exercised', 'tsc bảo đảm mọi nhánh đều được chạy qua'),
          ],
          correct: 0,
          explanation: EX(
            '<code>tsc</code> only checks static types, does not run the code, and skips files excluded from the config (like <code>prisma/**</code> on cuongthai.com). So logic/runtime breakage — and excluded seeds — slip through; run the code and add <code>typecheck:seed</code>.',
            '<code>tsc</code> chỉ kiểm kiểu tĩnh, không chạy mã, và bỏ qua file bị loại khỏi config (như <code>prisma/**</code> trên cuongthai.com). Nên lỗi logic/lúc chạy — và các seed bị loại trừ — lọt qua; hãy chạy mã và thêm <code>typecheck:seed</code>.',
          ),
        }),
        // Ch20
        mcq({
          prompt: B(
            'Changing a <code>NEXT_PUBLIC_</code> value takes effect only after…',
            'Đổi một giá trị <code>NEXT_PUBLIC_</code> chỉ có hiệu lực sau khi…',
          ),
          options: [
            B('A rebuild, since it is inlined at build time', 'Một lần build lại, vì nó được nội tuyến lúc build'),
            B('A container restart with the same image', 'Một lần restart container với cùng image'),
            B('Editing the value inside the database', 'Sửa giá trị bên trong cơ sở dữ liệu'),
            B('Clearing the CDN cache for the site', 'Xoá cache CDN của site'),
          ],
          correct: 0,
          explanation: EX(
            '<code>NEXT_PUBLIC_*</code> values are baked into the client bundle during <code>next build</code>, so only a rebuild picks up a change. A restart reuses the same image; the value is not in the DB or CDN.',
            'Giá trị <code>NEXT_PUBLIC_*</code> được nướng vào bundle client trong <code>next build</code>, nên chỉ build lại mới nhận thay đổi. Restart dùng lại đúng image; giá trị không nằm ở DB hay CDN.',
          ),
        }),
        mcq({
          prompt: B(
            'A deploy succeeds but production shows no course content. The cause is likely…',
            'Một lần deploy thành công nhưng production không hiện nội dung khoá học. Nguyên nhân có khả năng là…',
          ),
          options: [
            B('Deploy ships code, not local data; content was not seeded on prod', 'Deploy đẩy mã, không đẩy dữ liệu local; nội dung chưa seed trên prod'),
            B('The production build silently failed halfway', 'Bản build production âm thầm thất bại giữa chừng'),
            B('The deploy dropped the production database', 'Lần deploy đã xoá cơ sở dữ liệu production'),
            B('Production simply lags one deploy behind always', 'Production đơn giản luôn trễ một lần deploy'),
          ],
          correct: 0,
          explanation: EX(
            'A deploy builds and ships the working tree, not rows from your local DB. If content lives only locally, prod stays empty — content must be seeded inside the deploy pipeline. A failed build would not "succeed", and deploys do not drop the DB.',
            'Một lần deploy build và đẩy cây làm việc, không phải các dòng từ DB local. Nếu nội dung chỉ ở local, prod sẽ trống — nội dung phải được seed trong quy trình deploy. Một build hỏng sẽ không "thành công", và deploy không xoá DB.',
          ),
        }),
        mcq({
          prompt: B(
            'A third-party GIF key was leaked in the client bundle. The correct architecture is…',
            'Một key GIF bên thứ ba bị lộ trong bundle client. Kiến trúc đúng là…',
          ),
          options: [
            B('A backend proxy route holding the key server-side', 'Một route proxy backend giữ key ở phía server'),
            B('A NEXT_PUBLIC_ key the client sends directly', 'Một key NEXT_PUBLIC_ client gửi trực tiếp'),
            B('Storing the key in the browser localStorage', 'Lưu key trong localStorage của trình duyệt'),
            B('Rotating the leaked public key more often', 'Xoay key công khai bị lộ thường xuyên hơn'),
          ],
          correct: 0,
          explanation: EX(
            'A browser-facing key must never be <code>NEXT_PUBLIC_</code>. Proxy it through a backend route (cuongthai.com&#x27;s <code>/api/v1/gifs</code>) that reads the key from runtime env, caches responses, and rotates on restart. localStorage and frequent rotation do not fix exposure.',
            'Một key hướng trình duyệt không bao giờ được là <code>NEXT_PUBLIC_</code>. Hãy proxy nó qua một route backend (như <code>/api/v1/gifs</code> của cuongthai.com) đọc key từ env lúc chạy, cache phản hồi, và xoay khi restart. localStorage và xoay thường xuyên không sửa được việc bị lộ.',
          ),
        }),
        // Bổ sung cho đủ 50
        mcq({
          prompt: B(
            'What does this print?' + code("console.log([...'abc'].reverse().join(''));"),
            'Đoạn này in ra gì?' + code("console.log([...'abc'].reverse().join(''));"),
          ),
          options: [
            B('cba, because the string is spread then reversed', 'cba, vì chuỗi được spread rồi đảo'),
            B('abc, because strings cannot be reversed', 'abc, vì chuỗi không thể đảo được'),
            B('["c","b","a"], because join is ignored', '["c","b","a"], vì join bị bỏ qua'),
            B('It throws because a string has no reverse', 'Nó báo lỗi vì chuỗi không có reverse'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. Spreading a string into an array (<code>[...\"abc\"]</code>) gives <code>["a","b","c"]</code>, <code>reverse()</code> flips it in place, and <code>join("")</code> rebuilds "cba". Strings have no <code>reverse</code>, so you convert to an array first.',
            'Đã chạy thật. Spread một chuỗi thành mảng (<code>[...\"abc\"]</code>) cho <code>["a","b","c"]</code>, <code>reverse()</code> đảo tại chỗ, và <code>join("")</code> dựng lại "cba". Chuỗi không có <code>reverse</code>, nên phải đổi sang mảng trước.',
          ),
        }),
        mcq({
          prompt: B(
            'A component reads <code>props.items</code> and sorts it with <code>items.sort()</code> before rendering. What is the risk?',
            'Một component đọc <code>props.items</code> và sắp nó bằng <code>items.sort()</code> trước khi render. Rủi ro là gì?',
          ),
          options: [
            B('sort mutates the prop array in place, violating purity', 'sort mutate mảng prop tại chỗ, vi phạm tính thuần'),
            B('sort is too slow to run during a render', 'sort quá chậm để chạy khi render'),
            B('sort always returns undefined instead of an array', 'sort luôn trả về undefined thay vì một mảng'),
            B('sort cannot be called inside a component at all', 'sort hoàn toàn không gọi được trong một component'),
          ],
          correct: 0,
          explanation: EX(
            '<code>Array.prototype.sort</code> mutates in place, so <code>props.items.sort()</code> mutates the parent&#x27;s array — a side effect during render that breaks purity. Copy first: <code>[...items].sort(...)</code>.',
            '<code>Array.prototype.sort</code> mutate tại chỗ, nên <code>props.items.sort()</code> sửa mảng của cha — một hiệu ứng phụ lúc render phá tính thuần. Hãy sao chép trước: <code>[...items].sort(...)</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'A useEffect with <code>[]</code> that subscribes but returns no cleanup will…',
            'Một useEffect với <code>[]</code> đăng ký nhưng không trả về dọn dẹp sẽ…',
          ),
          options: [
            B('Leak the subscription, exposed as a double in StrictMode', 'Rò rỉ subscription, lộ ra thành đôi trong StrictMode'),
            B('Automatically clean up when the state changes', 'Tự dọn dẹp khi state đổi'),
            B('Never run because the array is empty', 'Không bao giờ chạy vì mảng rỗng'),
            B('Run after every render regardless of the array', 'Chạy sau mọi render bất kể mảng'),
          ],
          correct: 0,
          explanation: EX(
            'Without cleanup the subscription is never removed, so it can leak (and stack up if the effect re-runs). In dev, StrictMode runs setup→cleanup→setup, so a missing cleanup shows up as a doubled/leaked subscription — a hint to add one.',
            'Không có dọn dẹp thì subscription không bao giờ được gỡ, nên có thể rò rỉ (và chồng lên nếu effect chạy lại). Ở dev, StrictMode chạy setup→cleanup→setup, nên thiếu dọn dẹp lộ ra thành subscription đôi/rò rỉ — một gợi ý để thêm nó.',
          ),
        }),
        mcq({
          prompt: B(
            'To invalidate exactly the pages under <code>/blog</code> after a mutation, use…',
            'Để vô hiệu đúng các trang dưới <code>/blog</code> sau một thay đổi, dùng…',
          ),
          options: [
            B('revalidatePath("/blog") inside the Server Action', 'revalidatePath("/blog") trong Server Action'),
            B('window.location.reload() from the client', 'window.location.reload() từ phía client'),
            B('Deleting the Next.js .next cache folder', 'Xoá thư mục cache .next của Next.js'),
            B('Setting a shorter Max-Age on the auth cookie', 'Đặt Max-Age ngắn hơn cho cookie auth'),
          ],
          correct: 0,
          explanation: EX(
            '<code>revalidatePath</code>/<code>revalidateTag</code> in the action invalidate the cache so Next re-renders the affected Server Components with fresh data — no reload. Reloading is heavy-handed, deleting <code>.next</code> is a build artifact, and cookie Max-Age is unrelated.',
            '<code>revalidatePath</code>/<code>revalidateTag</code> trong action vô hiệu cache để Next render lại các Server Component bị ảnh hưởng với dữ liệu mới — không tải lại. Tải lại là quá tay, xoá <code>.next</code> là tạo phẩm build, và Max-Age cookie không liên quan.',
          ),
        }),
        mcq({
          prompt: B(
            'The reliable measure of a route&#x27;s shipped JavaScript is…',
            'Cách đo đáng tin JavaScript được gửi của một route là…',
          ),
          options: [
            B('First Load JS from the next build output', 'First Load JS trong kết quả next build'),
            B('The count of script tags in the HTML', 'Số thẻ script trong HTML'),
            B('The number of files in the app folder', 'Số file trong thư mục app'),
            B('The size of the rendered HTML document', 'Kích thước tài liệu HTML đã render'),
          ],
          correct: 0,
          explanation: EX(
            '<code>next build</code> reports per-route First Load JS — the real bundle including shared chunks. Counting script tags or files, or the HTML size, all mislead about actual JavaScript weight, a lesson from measuring page weight on cuongthai.com.',
            '<code>next build</code> báo First Load JS theo từng route — bundle thật gồm cả chunk dùng chung. Đếm thẻ script hay số file, hoặc kích thước HTML, đều gây hiểu nhầm về độ nặng JavaScript thật, một bài học từ việc đo độ nặng trang trên cuongthai.com.',
          ),
        }),
      ],
    },
  ],
};
