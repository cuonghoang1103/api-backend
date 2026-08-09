/**
 * Next.js & React — Final Exam 1 (FE-1): 50 câu trắc nghiệm phủ cả 20 chương.
 *
 * Đề tự soạn, bám sát `content/courses/nextjs/s01…s20`. Có câu lý thuyết lẫn câu
 * đọc mã; mọi đoạn JSX/JS hỏi "in ra gì" đều đã CHẠY THẬT (react-dom/server cho
 * JSX, node cho JS thuần) — không suy đoán.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NEXTJS-FE.mjs --apply
 */
import { B, EX, code, mcq } from './_lib/nextjs-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all 20 chapters, from JSX and the zero bug to Docker and the CDN that cached a 404. Some questions show code and ask what it renders or prints; those outputs came from running the snippet, so read the code rather than the intuition.</p>' +
  '<p>A few questions say "choose TWO" — they only count when both are selected. You can flag a question and return to it. The timer auto-submits at the end, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả 20 chương, từ JSX và bẫy số 0 tới Docker và lần CDN cache một cái 404. Một số câu cho sẵn mã và hỏi nó render/in ra gì; các kết quả đó đều lấy từ việc chạy thật, nên hãy đọc mã thay vì đoán theo cảm tính.</p>' +
  '<p>Vài câu ghi "chọn HAI" — chỉ đúng khi chọn đủ cả hai. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'nextjs' },
  exams: [
    {
      kind: 'FE',
      code: 'FE-1',
      source: 'SAMPLE',
      sortOrder: 4,
      title: B(
        'Final Exam 1 — the whole Next.js & React course (50 questions)',
        'Thi cuối khoá 1 — toàn bộ khoá Next.js & React (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all twenty chapters: React foundations, the App Router, Server and Client Components, data fetching and caching, routing, Server Actions, styling, state management, auth, forms, rendering strategies, performance, testing, and deployment.',
        'Năm mươi câu trắc nghiệm phủ cả hai mươi chương: nền tảng React, App Router, Server và Client Component, tải dữ liệu và cache, định tuyến, Server Actions, giao diện, quản lý state, xác thực, form, chiến lược render, hiệu năng, kiểm thử, và triển khai.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        // ── Ch1 JSX ─────────────────────────────────────────────────────
        mcq({
          prompt: B(
            'What does this Fragment render?' + code('return <><span>a</span><span>b</span></>;'),
            'Fragment này render ra gì?' + code('return <><span>a</span><span>b</span></>;'),
          ),
          options: [
            B('&lt;span&gt;a&lt;/span&gt;&lt;span&gt;b&lt;/span&gt; with no wrapper element', '&lt;span&gt;a&lt;/span&gt;&lt;span&gt;b&lt;/span&gt; không có phần tử bọc'),
            B('&lt;div&gt;&lt;span&gt;a&lt;/span&gt;&lt;span&gt;b&lt;/span&gt;&lt;/div&gt; wrapped in a div', '&lt;div&gt;&lt;span&gt;a&lt;/span&gt;&lt;span&gt;b&lt;/span&gt;&lt;/div&gt; bọc trong một div'),
            B('&lt;fragment&gt;&lt;span&gt;a&lt;/span&gt;&lt;/fragment&gt; with a fragment tag', '&lt;fragment&gt;&lt;span&gt;a&lt;/span&gt;&lt;/fragment&gt; với thẻ fragment'),
            B('Only the first span, the second is dropped', 'Chỉ span đầu, span thứ hai bị bỏ'),
          ],
          correct: 0,
          explanation: EX(
            'Verified with renderToStaticMarkup. A Fragment (<code>&lt;&gt;…&lt;/&gt;</code>) groups children without adding any DOM node, so the output is just the two spans side by side. Use it when JSX needs a single root but you do not want an extra wrapper.',
            'Đã kiểm bằng renderToStaticMarkup. Một Fragment (<code>&lt;&gt;…&lt;/&gt;</code>) gom các con lại mà không thêm nút DOM nào, nên kết quả chỉ là hai span cạnh nhau. Dùng nó khi JSX cần một gốc duy nhất mà bạn không muốn thêm phần tử bọc.',
          ),
        }),
        mcq({
          prompt: B(
            'What HTML does this produce?' + code('return <div style={{ backgroundColor: "red", fontSize: 12 }}>x</div>;'),
            'Đoạn này tạo ra HTML nào?' + code('return <div style={{ backgroundColor: "red", fontSize: 12 }}>x</div>;'),
          ),
          options: [
            B('style="background-color:red;font-size:12px"', 'style="background-color:red;font-size:12px"'),
            B('style="backgroundColor:red;fontSize:12"', 'style="backgroundColor:red;fontSize:12"'),
            B('style="background-color:red;font-size:12"', 'style="background-color:red;font-size:12"'),
            B('style="backgroundColor:red;fontSize:12px"', 'style="backgroundColor:red;fontSize:12px"'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. The <code>style</code> prop is an object with camelCase keys; React converts them to kebab-case CSS, and a unitless number on a length property gets <code>px</code> appended — so <code>fontSize: 12</code> becomes <code>font-size:12px</code>.',
            'Đã chạy thật. Prop <code>style</code> là một object với khoá camelCase; React đổi chúng sang CSS kebab-case, và một số không đơn vị trên thuộc tính độ dài sẽ được thêm <code>px</code> — nên <code>fontSize: 12</code> thành <code>font-size:12px</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'Why must a component return a single root element (or a Fragment)?',
            'Vì sao một component phải trả về một phần tử gốc duy nhất (hoặc một Fragment)?',
          ),
          options: [
            B('A function returns one value, and each JSX root compiles to one createElement call', 'Một hàm trả về một giá trị, và mỗi gốc JSX biên dịch thành một lời gọi createElement'),
            B('The browser only accepts one element per component file', 'Trình duyệt chỉ chấp nhận một phần tử cho mỗi file component'),
            B('React counts elements and throws past a limit', 'React đếm phần tử và báo lỗi khi vượt giới hạn'),
            B('CSS cannot target more than one root element', 'CSS không thể nhắm tới quá một phần tử gốc'),
          ],
          correct: 0,
          explanation: EX(
            'JSX is just a call that returns one element (a tree). A function can only return one value, so two sibling roots are a syntax error. Wrap them in one parent or a Fragment (which adds no DOM) to return a single tree.',
            'JSX chỉ là một lời gọi trả về một phần tử (một cây). Một hàm chỉ trả về được một giá trị, nên hai gốc anh em là lỗi cú pháp. Hãy bọc chúng trong một cha hoặc một Fragment (không thêm DOM) để trả về một cây duy nhất.',
          ),
        }),

        // ── Ch2 components/props ────────────────────────────────────────
        mcq({
          prompt: B(
            'A child needs to notify its parent when a button is clicked. The idiomatic way is…',
            'Một component con cần báo cho cha khi một nút được bấm. Cách đúng chất React là…',
          ),
          options: [
            B('The parent passes a callback prop and the child calls it on click', 'Cha truyền một prop callback và con gọi nó khi click'),
            B('The child mutates a shared props object the parent reads', 'Con sửa một object props dùng chung để cha đọc'),
            B('The child imports the parent and calls its method', 'Con import cha và gọi phương thức của cha'),
            B('The child writes to a global variable the parent polls', 'Con ghi vào một biến toàn cục để cha thăm dò'),
          ],
          correct: 0,
          explanation: EX(
            'Data flows down via props; events flow up via callbacks. The parent owns the state and passes down a handler (e.g. <code>onSelect</code>); the child calls that handler with the needed value. Props stay read-only in the child.',
            'Dữ liệu chảy xuống qua props; sự kiện chảy lên qua callback. Cha sở hữu state và truyền xuống một handler (ví dụ <code>onSelect</code>); con gọi handler đó với giá trị cần thiết. Props vẫn chỉ đọc trong con.',
          ),
        }),
        mcq({
          prompt: B(
            'What does <code>&lt;Button {...props} /&gt;</code> (spread) do?',
            '<code>&lt;Button {...props} /&gt;</code> (spread) làm gì?',
          ),
          options: [
            B('Passes every key of the props object as an individual prop', 'Truyền từng khoá của object props thành một prop riêng'),
            B('Creates a copy of the Button component', 'Tạo một bản sao của component Button'),
            B('Merges Button into the parent&#x27;s scope', 'Trộn Button vào phạm vi của cha'),
            B('Freezes the props so they cannot change', 'Đóng băng props để chúng không đổi được'),
          ],
          correct: 0,
          explanation: EX(
            'The JSX spread forwards each property of <code>props</code> onto the element, as if you wrote them out one by one. It is handy for wrapper components that pass through arbitrary attributes; later explicit props override earlier spread ones.',
            'Spread trong JSX chuyển tiếp từng thuộc tính của <code>props</code> vào phần tử, như thể bạn viết ra từng cái một. Nó tiện cho component bọc cần chuyển tiếp các thuộc tính bất kỳ; prop khai báo tường minh sau sẽ ghi đè prop spread trước.',
          ),
        }),
        mcq({
          prompt: B(
            'A "pure" component (in the render sense) means…',
            'Một component "thuần" (theo nghĩa render) nghĩa là…',
          ),
          options: [
            B('Given the same props and state, it always renders the same output with no side effects', 'Với cùng props và state, nó luôn render cùng kết quả, không gây hiệu ứng phụ'),
            B('It contains no hooks at all and never holds any state', 'Nó hoàn toàn không chứa hook nào và không giữ state'),
            B('It is written entirely without JSX, using createElement', 'Nó được viết hoàn toàn không dùng JSX, chỉ dùng createElement'),
            B('It never accepts children and takes no props from a parent', 'Nó không bao giờ nhận children và không lấy prop từ cha'),
          ],
          correct: 0,
          explanation: EX(
            'React expects rendering to be pure: for the same inputs (props/state), the output is the same, and rendering must not mutate external things or perform side effects. Side effects belong in event handlers or effects — keeping render pure is what lets React re-render safely.',
            'React kỳ vọng việc render là thuần: với cùng đầu vào (props/state), kết quả như nhau, và render không được sửa thứ bên ngoài hay gây hiệu ứng phụ. Hiệu ứng phụ thuộc về handler hoặc effect — giữ render thuần là điều cho phép React render lại một cách an toàn.',
          ),
        }),

        // ── Ch3 state ───────────────────────────────────────────────────
        mcq({
          prompt: B(
            'What is the final count?' + code(
              'let c = 0;\n' +
              'const queue = [x => x + 1, x => x * 2, x => x + 3];\n' +
              'for (const f of queue) c = f(c);\n' +
              'console.log(c);',
            ),
            'Giá trị cuối của count là?' + code(
              'let c = 0;\n' +
              'const queue = [x => x + 1, x => x * 2, x => x + 3];\n' +
              'for (const f of queue) c = f(c);\n' +
              'console.log(c);',
            ),
          ),
          options: [
            B('5', '5'),
            B('4', '4'),
            B('6', '6'),
            B('0', '0'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. This mimics how React applies queued updater functions in order on the latest value: <code>(0+1)=1</code>, <code>(1*2)=2</code>, <code>(2+3)=5</code>. That is why <code>setCount(c =&gt; c + 1)</code> composes correctly where <code>setCount(count + 1)</code> would not.',
            'Đã chạy thật. Đây mô phỏng cách React áp các hàm cập nhật đã xếp hàng theo thứ tự trên giá trị mới nhất: <code>(0+1)=1</code>, <code>(1*2)=2</code>, <code>(2+3)=5</code>. Đó là lý do <code>setCount(c =&gt; c + 1)</code> cộng dồn đúng còn <code>setCount(count + 1)</code> thì không.',
          ),
        }),
        mcq({
          prompt: B(
            'What does this print?' + code('console.log(JSON.stringify({ ...{ a: 1, b: 2 }, ...{ b: 3, c: 4 } }));'),
            'Đoạn này in ra gì?' + code('console.log(JSON.stringify({ ...{ a: 1, b: 2 }, ...{ b: 3, c: 4 } }));'),
          ),
          options: [
            B('{"a":1,"b":3,"c":4}', '{"a":1,"b":3,"c":4}'),
            B('{"a":1,"b":2,"c":4}', '{"a":1,"b":2,"c":4}'),
            B('{"a":1,"b":2,"b":3,"c":4}', '{"a":1,"b":2,"b":3,"c":4}'),
            B('{"a":1,"c":4}', '{"a":1,"c":4}'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. When spreading objects, a later key wins: <code>b</code> from the second object (3) overrides the first (2). This is exactly the pattern for immutable state updates: <code>{ ...state, changed: value }</code>.',
            'Đã chạy thật. Khi spread object, khoá đến sau thắng: <code>b</code> của object thứ hai (3) ghi đè object đầu (2). Đây đúng là mẫu cập nhật state bất biến: <code>{ ...state, changed: value }</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'You have two sibling components that must reflect the same counter. Where should the counter state live?',
            'Bạn có hai component anh em phải cùng phản ánh một bộ đếm. State bộ đếm nên nằm ở đâu?',
          ),
          options: [
            B('In their nearest common parent, passed down as props', 'Ở component cha chung gần nhất, truyền xuống làm props'),
            B('Duplicated in each sibling and kept in sync', 'Nhân đôi trong mỗi anh em rồi giữ đồng bộ'),
            B('In a module-level variable outside React', 'Trong một biến cấp module bên ngoài React'),
            B('In the child that changes it most often', 'Trong đứa con thay đổi nó thường xuyên nhất'),
          ],
          correct: 0,
          explanation: EX(
            'Lift the state to the closest common parent so it is the single source of truth, then pass the value and a setter down. Duplicating state in both siblings invites drift; a plain outside variable will not trigger re-renders.',
            'Nâng state lên component cha chung gần nhất để nó là nguồn sự thật duy nhất, rồi truyền giá trị và một setter xuống. Nhân đôi state ở cả hai anh em dễ gây lệch; một biến bên ngoài thường sẽ không kích hoạt render lại.',
          ),
        }),

        // ── Ch4 events/forms ────────────────────────────────────────────
        mcq({
          prompt: B(
            'A controlled <code>&lt;input value={text} /&gt;</code> with no <code>onChange</code> behaves how?',
            'Một ô <code>&lt;input value={text} /&gt;</code> có kiểm soát mà thiếu <code>onChange</code> sẽ ra sao?',
          ),
          options: [
            B('It is read-only — typing does nothing, and React warns about it', 'Nó chỉ đọc — gõ không có tác dụng, và React cảnh báo về việc này'),
            B('It works normally and updates on its own', 'Nó chạy bình thường và tự cập nhật'),
            B('It becomes an uncontrolled input', 'Nó trở thành ô không kiểm soát'),
            B('It throws an error on the first keystroke', 'Nó ném lỗi ngay phím đầu tiên'),
          ],
          correct: 0,
          explanation: EX(
            'With <code>value</code> pinned to state and no <code>onChange</code> to update that state, the field is frozen: React keeps re-rendering it with the same value, so keystrokes appear to do nothing. React logs a warning telling you to add <code>onChange</code> or use <code>defaultValue</code>.',
            'Với <code>value</code> ghim vào state mà không có <code>onChange</code> để cập nhật state đó, ô bị đông cứng: React cứ render lại nó với cùng giá trị, nên gõ phím như không có tác dụng. React ghi một cảnh báo bảo bạn thêm <code>onChange</code> hoặc dùng <code>defaultValue</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'Which is the correct way to read the typed value in <code>onChange={(e) =&gt; ...}</code>?',
            'Cách đúng để đọc giá trị vừa gõ trong <code>onChange={(e) =&gt; ...}</code> là gì?',
          ),
          options: [
            B('e.target.value', 'e.target.value'),
            B('e.value', 'e.value'),
            B('e.currentValue', 'e.currentValue'),
            B('e.data.value', 'e.data.value'),
          ],
          correct: 0,
          explanation: EX(
            'The change event carries the DOM node in <code>e.target</code>, and its text is <code>e.target.value</code>. React&#x27;s synthetic event mirrors the native one here. For a checkbox you would read <code>e.target.checked</code> instead.',
            'Sự kiện change mang nút DOM trong <code>e.target</code>, và văn bản của nó là <code>e.target.value</code>. Sự kiện tổng hợp của React ở đây phản chiếu sự kiện gốc. Với một checkbox thì bạn đọc <code>e.target.checked</code>.',
          ),
        }),

        // ── Ch5 effects ─────────────────────────────────────────────────
        mcq({
          prompt: B(
            'Which dependency array makes an effect run after EVERY render?',
            'Mảng dependency nào khiến một effect chạy sau MỌI lần render?',
          ),
          options: [
            B('Omitting the array entirely', 'Bỏ hẳn mảng đi'),
            B('An empty array []', 'Một mảng rỗng []'),
            B('[someValue]', '[someValue]'),
            B('null as the second argument', 'null làm đối số thứ hai'),
          ],
          correct: 0,
          explanation: EX(
            'No dependency array → the effect runs after every render. <code>[]</code> → only after mount. <code>[dep]</code> → after mount and whenever <code>dep</code> changes. Passing <code>null</code> is not the API and behaves like a missing/invalid array.',
            'Không có mảng dependency → effect chạy sau mọi lần render. <code>[]</code> → chỉ sau mount. <code>[dep]</code> → sau mount và mỗi khi <code>dep</code> đổi. Truyền <code>null</code> không phải API và hành xử như một mảng thiếu/không hợp lệ.',
          ),
        }),
        mcq({
          prompt: B(
            'A component subscribes to a WebSocket in an effect. What prevents duplicate connections and leaks?',
            'Một component đăng ký một WebSocket trong effect. Điều gì ngăn kết nối trùng và rò rỉ?',
          ),
          options: [
            B('Returning a cleanup function that closes the socket', 'Trả về một hàm dọn dẹp để đóng socket'),
            B('Wrapping the effect in useMemo', 'Bọc effect trong useMemo'),
            B('Calling the effect twice on purpose', 'Cố ý gọi effect hai lần'),
            B('Using an empty dependency array only', 'Chỉ dùng một mảng dependency rỗng'),
          ],
          correct: 0,
          explanation: EX(
            'The cleanup function closes/unsubscribes before the effect re-runs and at unmount, so a new subscription never stacks on an old one. Even with <code>[]</code>, StrictMode in dev runs setup→cleanup→setup to expose a missing cleanup.',
            'Hàm dọn dẹp đóng/huỷ đăng ký trước khi effect chạy lại và khi gỡ, nên một đăng ký mới không bao giờ chồng lên cái cũ. Ngay cả với <code>[]</code>, StrictMode ở dev chạy setup→cleanup→setup để lộ ra chỗ thiếu dọn dẹp.',
          ),
        }),
        mcq({
          prompt: B(
            'You compute a filtered list from <code>items</code> and <code>query</code>. Should this be an effect that writes to state?',
            'Bạn tính một danh sách đã lọc từ <code>items</code> và <code>query</code>. Việc này có nên là một effect ghi vào state không?',
          ),
          options: [
            B('No — compute it during render (optionally useMemo); it is derived data', 'Không — hãy tính lúc render (có thể useMemo); đó là dữ liệu suy ra'),
            B('Yes — always store computed lists in state', 'Có — luôn lưu danh sách đã tính vào state'),
            B('Yes — an effect is required for any filtering', 'Có — mọi việc lọc đều cần một effect'),
            B('No — filtering must happen on the server only', 'Không — việc lọc chỉ được làm trên server'),
          ],
          correct: 0,
          explanation: EX(
            'A filtered list is derived from existing state — compute it inline while rendering, and wrap in <code>useMemo</code> only if the computation is heavy. An effect-plus-state mirror adds an extra render and a sync bug waiting to happen.',
            'Một danh sách đã lọc là dữ liệu suy ra từ state sẵn có — hãy tính ngay khi render, và chỉ bọc <code>useMemo</code> nếu phép tính nặng. Dùng effect cộng state bản sao chỉ thêm một lần render và một lỗi đồng bộ chực chờ.',
          ),
        }),

        // ── Ch6 hooks ───────────────────────────────────────────────────
        mcq({
          prompt: B(
            'You store a <code>setInterval</code> id so you can clear it later, and you do NOT want a re-render when it changes. Use…',
            'Bạn lưu id của một <code>setInterval</code> để xoá sau này, và KHÔNG muốn render lại khi nó đổi. Dùng…',
          ),
          options: [
            B('useRef', 'useRef'),
            B('useState', 'useState'),
            B('useMemo', 'useMemo'),
            B('useContext', 'useContext'),
          ],
          correct: 0,
          explanation: EX(
            'A ref is a mutable box that persists across renders without triggering one when its <code>.current</code> changes — perfect for a timer id, a previous value, or a DOM node. <code>useState</code> would force a re-render you do not need.',
            'Ref là một chiếc hộp có thể sửa, sống qua các lần render mà không kích hoạt render khi <code>.current</code> đổi — hoàn hảo cho id của timer, giá trị trước đó, hay một nút DOM. <code>useState</code> sẽ ép một lần render bạn không cần.',
          ),
        }),
        mcq({
          prompt: B(
            'A rule that ALL custom hooks must follow is…',
            'Một luật mà MỌI custom hook phải tuân theo là…',
          ),
          options: [
            B('Their name starts with "use" and they call hooks only at the top level', 'Tên bắt đầu bằng "use" và chỉ gọi hook ở cấp cao nhất'),
            B('They must return JSX markup like a normal component', 'Chúng phải trả về JSX như một component bình thường'),
            B('They can only ever use useState and nothing else', 'Chúng chỉ được dùng useState chứ không dùng hook nào khác'),
            B('They must be defined as methods of a class component', 'Chúng phải được định nghĩa là phương thức của một class component'),
          ],
          correct: 0,
          explanation: EX(
            'The "use" prefix is how React (and lint rules) know a function is a hook and enforces the rules of hooks inside it: call hooks only at the top level, only from components or other hooks. A custom hook returns data/handlers, not JSX.',
            'Tiền tố "use" là cách React (và luật lint) biết một hàm là hook và áp luật hook bên trong nó: chỉ gọi hook ở cấp cao nhất, chỉ từ component hoặc hook khác. Một custom hook trả về dữ liệu/handler, không phải JSX.',
          ),
        }),

        // ── Ch7 lists/keys ──────────────────────────────────────────────
        mcq({
          prompt: B(
            'What is the best <code>key</code> for a list of database records?',
            '<code>key</code> tốt nhất cho một danh sách bản ghi cơ sở dữ liệu là gì?',
          ),
          options: [
            B('The record&#x27;s stable unique id from the data', 'Id duy nhất ổn định của bản ghi lấy từ dữ liệu'),
            B('The array index', 'Chỉ số mảng'),
            B('Math.random() at render time', 'Math.random() lúc render'),
            B('The record&#x27;s title text', 'Chuỗi tiêu đề của bản ghi'),
          ],
          correct: 0,
          explanation: EX(
            'A key must be stable and unique per item across renders — a database id is ideal. The index breaks on reorder/insert/delete; <code>Math.random()</code> changes every render (destroying reconciliation); a title may not be unique and can change.',
            'Một key phải ổn định và duy nhất cho mỗi phần tử qua các lần render — một id cơ sở dữ liệu là lý tưởng. Chỉ số hỏng khi sắp lại/chèn/xoá; <code>Math.random()</code> đổi mỗi lần render (phá reconciliation); tiêu đề có thể không duy nhất và có thể đổi.',
          ),
        }),
        mcq({
          prompt: B(
            'A memoized child still re-renders every time. The most likely cause is…',
            'Một component con đã memo vẫn render lại mỗi lần. Nguyên nhân khả dĩ nhất là…',
          ),
          options: [
            B('A new inline object or function prop is created on each parent render', 'Một prop object hoặc hàm inline mới được tạo mỗi lần cha render'),
            B('React.memo only works on the very first render of the child', 'React.memo chỉ hiệu nghiệm ở lần render đầu tiên của con'),
            B('The child simply has too many DOM nodes to skip', 'Con đơn giản là có quá nhiều nút DOM nên không bỏ qua được'),
            B('The list keys are missing on the child element', 'Các key của danh sách bị thiếu trên phần tử con'),
          ],
          correct: 0,
          explanation: EX(
            '<code>React.memo</code> does a shallow prop compare. A fresh <code>{}</code>/<code>() =&gt; {}</code> each render is a new reference, so the compare says "changed" and the child re-renders. Stabilize with <code>useMemo</code>/<code>useCallback</code>.',
            '<code>React.memo</code> so sánh prop nông. Một <code>{}</code>/<code>() =&gt; {}</code> mới mỗi lần render là một tham chiếu mới, nên phép so sánh báo "đổi" và con render lại. Hãy ổn định bằng <code>useMemo</code>/<code>useCallback</code>.',
          ),
        }),

        // ── Ch8 app router ──────────────────────────────────────────────
        mcq({
          prompt: B(
            'In the App Router, where does the URL <code>/shop/shoes</code> map to?',
            'Trong App Router, URL <code>/shop/shoes</code> ánh xạ tới đâu?',
          ),
          options: [
            B('app/shop/shoes/page.tsx', 'app/shop/shoes/page.tsx'),
            B('app/shop/shoes.tsx', 'app/shop/shoes.tsx'),
            B('pages/shop/shoes.tsx', 'pages/shop/shoes.tsx'),
            B('app/shop/shoes/route.tsx', 'app/shop/shoes/route.tsx'),
          ],
          correct: 0,
          explanation: EX(
            'Folders under <code>app/</code> form the URL, and a <code>page.tsx</code> inside a folder makes that path a page. <code>route.ts</code> would be an API endpoint; <code>pages/</code> is the old Pages Router; a bare <code>.tsx</code> file is not a route.',
            'Các thư mục trong <code>app/</code> tạo nên URL, và một <code>page.tsx</code> bên trong một thư mục biến đường dẫn đó thành trang. <code>route.ts</code> sẽ là một endpoint API; <code>pages/</code> là Pages Router cũ; một file <code>.tsx</code> trần không phải route.',
          ),
        }),
        mcq({
          prompt: B(
            'Which file provides shared UI (nav, footer) that wraps every page in a section without remounting on navigation?',
            'File nào cung cấp UI dùng chung (nav, footer) bọc mọi trang trong một mảng mà không remount khi điều hướng?',
          ),
          options: [
            B('layout.tsx', 'layout.tsx'),
            B('template.tsx', 'template.tsx'),
            B('page.tsx', 'page.tsx'),
            B('wrapper.tsx', 'wrapper.tsx'),
          ],
          correct: 0,
          explanation: EX(
            '<code>layout.tsx</code> wraps its segment and children and is preserved across navigations (state intact). <code>template.tsx</code> is similar but re-mounts on each navigation; <code>page.tsx</code> is the page itself; <code>wrapper.tsx</code> is not a convention.',
            '<code>layout.tsx</code> bọc đoạn của nó và các con, và được giữ nguyên qua các lần điều hướng (state còn nguyên). <code>template.tsx</code> tương tự nhưng remount ở mỗi lần điều hướng; <code>page.tsx</code> là trang; <code>wrapper.tsx</code> không phải quy ước.',
          ),
        }),
        mcq({
          prompt: B(
            'What does <code>loading.tsx</code> in a segment do?',
            '<code>loading.tsx</code> trong một đoạn làm gì?',
          ),
          options: [
            B('Streams a Suspense fallback while that segment&#x27;s async data loads', 'Stream một màn dự phòng Suspense trong khi dữ liệu async của đoạn đó tải'),
            B('Preloads all images on the page', 'Tải trước mọi ảnh trên trang'),
            B('Caches API responses on the client', 'Cache phản hồi API phía client'),
            B('Delays navigation by a fixed time', 'Trì hoãn điều hướng một khoảng thời gian cố định'),
          ],
          correct: 0,
          explanation: EX(
            'Next wraps the segment in a Suspense boundary and shows <code>loading.tsx</code> immediately while the async Server Component awaits data, then streams in the real content. The surrounding layout stays interactive throughout.',
            'Next bọc đoạn đó trong một ranh giới Suspense và hiện <code>loading.tsx</code> ngay trong khi Server Component async chờ dữ liệu, rồi stream nội dung thật vào. Layout xung quanh vẫn tương tác được suốt quá trình.',
          ),
        }),

        // ── Ch9 server/client ───────────────────────────────────────────
        mcq({
          prompt: B(
            'Which is TRUE about a default (no directive) App Router component?',
            'Điều nào ĐÚNG về một component App Router mặc định (không có chỉ thị)?',
          ),
          options: [
            B('It is a Server Component and can be async and fetch data directly', 'Nó là Server Component, có thể async và tải dữ liệu trực tiếp'),
            B('It runs in the browser and can use useState', 'Nó chạy trong trình duyệt và dùng được useState'),
            B('It is compiled to a static HTML file', 'Nó được biên dịch thành file HTML tĩnh'),
            B('It cannot render other components', 'Nó không thể render component khác'),
          ],
          correct: 0,
          explanation: EX(
            'Without <code>"use client"</code>, components are Server Components: they run on the server, can be <code>async</code> and <code>await</code> data, keep secrets server-side, and ship no JS. They cannot use browser hooks like <code>useState</code>/<code>useEffect</code>.',
            'Không có <code>"use client"</code>, component là Server Component: chạy trên server, có thể <code>async</code> và <code>await</code> dữ liệu, giữ bí mật ở server, và không gửi JS. Chúng không dùng được hook trình duyệt như <code>useState</code>/<code>useEffect</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'A Server Component wants to pass an onClick handler to a Client Component. What is the catch?',
            'Một Server Component muốn truyền một handler onClick cho một Client Component. Điều vướng là gì?',
          ),
          options: [
            B('Plain functions are not serializable across the boundary — pass a Server Action or move state down', 'Hàm thường không tuần tự hoá được qua ranh giới — hãy truyền một Server Action hoặc chuyển state xuống'),
            B('Nothing at all — any function can be passed freely across it', 'Không gì cả — hàm nào cũng truyền tự do qua ranh giới được'),
            B('Handlers must first be serialized and passed as JSON strings', 'Handler phải được tuần tự hoá trước và truyền dưới dạng chuỗi JSON'),
            B('The Client Component must become a Server Component', 'Client Component phải trở thành Server Component'),
          ],
          correct: 0,
          explanation: EX(
            'Props crossing Server→Client must be serializable. An arbitrary event handler is not — either the interactivity belongs inside the Client Component (define the handler there), or you pass a <b>Server Action</b>, which Next serializes specially.',
            'Prop đi từ Server→Client phải tuần tự hoá được. Một handler sự kiện bất kỳ thì không — hoặc tính tương tác nên nằm bên trong Client Component (định nghĩa handler ở đó), hoặc bạn truyền một <b>Server Action</b>, thứ được Next tuần tự hoá riêng.',
          ),
        }),
        mcq({
          prompt: B(
            'To add a small interactive counter to an otherwise server-rendered page, you should…',
            'Để thêm một bộ đếm tương tác nhỏ vào một trang vốn render trên server, bạn nên…',
          ),
          options: [
            B('Extract the counter into its own "use client" component and render it in the server page', 'Tách bộ đếm thành component "use client" riêng và render nó trong trang server'),
            B('Add "use client" to the whole page so it all runs in the browser', 'Thêm "use client" cho cả trang để mọi thứ chạy trong trình duyệt'),
            B('Fetch the count via useEffect running on the server', 'Tải số đếm qua useEffect chạy ở phía server'),
            B('Convert the entire page back to the old Pages Router', 'Chuyển cả trang về lại Pages Router cũ'),
          ],
          correct: 0,
          explanation: EX(
            'Keep the boundary small: a leaf Client Component for the interactive bit, everything else stays a Server Component. Marking the whole page client drags all its code into the browser bundle and gives up server-side data/secret benefits.',
            'Giữ ranh giới nhỏ: một Client Component lá cho phần tương tác, còn lại là Server Component. Đánh dấu cả trang là client sẽ kéo toàn bộ mã vào bundle trình duyệt và mất lợi ích dữ liệu/bí mật phía server.',
          ),
        }),

        // ── Ch10 fetch/cache ────────────────────────────────────────────
        mcq({
          prompt: B(
            'You need data that must be fresh on every request. Which is correct?',
            'Bạn cần dữ liệu phải tươi ở mọi request. Cái nào đúng?',
          ),
          options: [
            B('fetch(url, { cache: "no-store" })', 'fetch(url, { cache: "no-store" })'),
            B('fetch(url, { next: { revalidate: false } })', 'fetch(url, { next: { revalidate: false } })'),
            B('fetch(url, { cache: "force-cache" })', 'fetch(url, { cache: "force-cache" })'),
            B('fetch(url, { mode: "fresh" })', 'fetch(url, { mode: "fresh" })'),
          ],
          correct: 0,
          explanation: EX(
            '<code>cache: "no-store"</code> disables caching and re-fetches every request (and marks the route dynamic). <code>force-cache</code> caches; <code>revalidate: false</code> means cache indefinitely; <code>mode: "fresh"</code> is not a real option.',
            '<code>cache: "no-store"</code> tắt cache và tải lại ở mọi request (và đánh dấu route là động). <code>force-cache</code> thì cache; <code>revalidate: false</code> nghĩa là cache vô thời hạn; <code>mode: "fresh"</code> không phải tuỳ chọn thật.',
          ),
        }),
        mcq({
          prompt: B(
            'A list API on cuongthai.com looked ~60s behind the database. The healthy explanation is…',
            'Một API danh sách trên cuongthai.com trông trễ ~60 giây so với cơ sở dữ liệu. Cách giải thích lành mạnh là…',
          ),
          options: [
            B('Time-based revalidation caches the render for ~60s; the DB is the source of truth', 'Làm mới theo thời gian cache bản render ~60 giây; DB là nguồn sự thật'),
            B('The database itself was corrupted and lost recent rows', 'Cơ sở dữ liệu bị hỏng và mất các dòng gần đây'),
            B('The API permanently lost the last minute of writes', 'API mất vĩnh viễn số ghi của phút cuối cùng'),
            B('The client&#x27;s system clock was set incorrectly', 'Đồng hồ hệ thống của client bị đặt sai giờ'),
          ],
          correct: 0,
          explanation: EX(
            'With <code>revalidate: 60</code>, the cached render is served for up to a minute and regenerated in the background — so the cache trails the DB briefly. The database still has the latest data; the API is showing a slightly stale snapshot, not losing writes.',
            'Với <code>revalidate: 60</code>, bản render đã cache được phục vụ tối đa một phút và tái tạo ở nền — nên cache trễ hơn DB một chút. Cơ sở dữ liệu vẫn có dữ liệu mới nhất; API chỉ đang hiện một ảnh chụp hơi cũ, không mất số ghi.',
          ),
        }),
        mcq({
          prompt: B(
            'What does <code>generateStaticParams</code> return?',
            '<code>generateStaticParams</code> trả về gì?',
          ),
          options: [
            B('The list of param values to pre-render a dynamic route at build time', 'Danh sách các giá trị tham số để dựng sẵn một route động lúc build'),
            B('The current request&#x27;s query string', 'Chuỗi truy vấn của request hiện tại'),
            B('A set of React keys for a list', 'Một tập key React cho một danh sách'),
            B('The metadata for the page head', 'Metadata cho phần head của trang'),
          ],
          correct: 0,
          explanation: EX(
            'For a dynamic segment (<code>[slug]</code>), <code>generateStaticParams</code> lists the slugs to statically generate at build (e.g. every blog post). It is the App-Router successor to <code>getStaticPaths</code>.',
            'Với một đoạn động (<code>[slug]</code>), <code>generateStaticParams</code> liệt kê các slug cần dựng tĩnh lúc build (ví dụ mọi bài blog). Nó là bản kế nhiệm của <code>getStaticPaths</code> trong App Router.',
          ),
        }),

        // ── Ch11 routing ────────────────────────────────────────────────
        mcq({
          prompt: B(
            'To create a JSON API endpoint at <code>/api/health</code>, you add…',
            'Để tạo một endpoint API JSON tại <code>/api/health</code>, bạn thêm…',
          ),
          options: [
            B('app/api/health/route.ts exporting a GET function', 'app/api/health/route.ts export một hàm GET'),
            B('app/api/health/page.tsx returning JSON', 'app/api/health/page.tsx trả về JSON'),
            B('app/api/health.json', 'app/api/health.json'),
            B('middleware.ts matching /api/health', 'middleware.ts khớp /api/health'),
          ],
          correct: 0,
          explanation: EX(
            'A Route Handler is a <code>route.ts</code> exporting HTTP-method functions (<code>export async function GET() {...}</code>). A <code>page.tsx</code> renders UI, not an API; <code>middleware.ts</code> runs before routes but is not the endpoint itself.',
            'Route Handler là một <code>route.ts</code> export các hàm theo phương thức HTTP (<code>export async function GET() {...}</code>). Một <code>page.tsx</code> render UI chứ không phải API; <code>middleware.ts</code> chạy trước route nhưng không phải bản thân endpoint.',
          ),
        }),
        mcq({
          prompt: B(
            'From a Server Component, how do you return a 404 for a missing record?',
            'Từ một Server Component, làm sao trả về 404 cho một bản ghi không tồn tại?',
          ),
          options: [
            B('Call notFound() from next/navigation', 'Gọi notFound() từ next/navigation'),
            B('Return null', 'Trả về null'),
            B('throw new Error("404")', 'throw new Error("404")'),
            B('Set res.status(404)', 'Đặt res.status(404)'),
          ],
          correct: 0,
          explanation: EX(
            '<code>notFound()</code> from <code>next/navigation</code> stops rendering and shows the nearest <code>not-found.tsx</code> with a 404 status. Returning <code>null</code> just renders nothing (still 200); there is no <code>res</code> object in a Server Component.',
            '<code>notFound()</code> từ <code>next/navigation</code> dừng render và hiện <code>not-found.tsx</code> gần nhất với trạng thái 404. Trả về <code>null</code> chỉ render rỗng (vẫn 200); không có object <code>res</code> trong Server Component.',
          ),
        }),

        // ── Ch12 server actions ─────────────────────────────────────────
        mcq({
          prompt: B(
            'What must be at the top of a file (or function) to define Server Actions?',
            'Cái gì phải nằm ở đầu file (hoặc hàm) để định nghĩa Server Actions?',
          ),
          options: [
            B('"use server"', '"use server"'),
            B('"use client"', '"use client"'),
            B('"use action"', '"use action"'),
            B('"server only"', '"server only"'),
          ],
          correct: 0,
          explanation: EX(
            '<code>"use server"</code> marks a function or a whole file as Server Actions — server-side functions callable from forms or client events via a secure RPC. <code>"use client"</code> is the opposite marker for components; the others are not directives.',
            '<code>"use server"</code> đánh dấu một hàm hoặc cả file là Server Actions — hàm phía server gọi được từ form hoặc sự kiện client qua một RPC an toàn. <code>"use client"</code> là dấu ngược lại cho component; các cái khác không phải chỉ thị.',
          ),
        }),
        mcq({
          prompt: B(
            'After a Server Action inserts a row, the list page still shows old data. The fix is…',
            'Sau khi một Server Action chèn một dòng, trang danh sách vẫn hiện dữ liệu cũ. Cách sửa là…',
          ),
          options: [
            B('Call revalidatePath (or revalidateTag) inside the action', 'Gọi revalidatePath (hoặc revalidateTag) trong action'),
            B('Force a full window reload after the action returns', 'Ép tải lại toàn bộ cửa sổ sau khi action trả về'),
            B('Manually clear the entire browser cache each time', 'Tự tay xoá sạch cache trình duyệt mỗi lần'),
            B('Add a unique key prop to the list container', 'Thêm một prop key duy nhất cho container danh sách'),
          ],
          correct: 0,
          explanation: EX(
            'The list is served from a cache. <code>revalidatePath("/list")</code> (or <code>revalidateTag</code>) inside the action invalidates it, so Next re-renders the affected Server Components with fresh data — no full reload needed.',
            'Danh sách được phục vụ từ cache. <code>revalidatePath("/list")</code> (hoặc <code>revalidateTag</code>) trong action vô hiệu nó, nên Next render lại các Server Component bị ảnh hưởng với dữ liệu mới — không cần tải lại toàn trang.',
          ),
        }),
        mcq({
          prompt: B(
            'In React 19 / Next 15, the hook for a form action&#x27;s state is imported from where?',
            'Ở React 19 / Next 15, hook cho state của một form action được import từ đâu?',
          ),
          options: [
            B('useActionState from "react"', 'useActionState từ "react"'),
            B('useFormState from "react-dom"', 'useFormState từ "react-dom"'),
            B('useActionState from "react-dom"', 'useActionState từ "react-dom"'),
            B('useForm from "next/form"', 'useForm từ "next/form"'),
          ],
          correct: 0,
          explanation: EX(
            'React 19 renamed <code>useFormState</code> → <code>useActionState</code> and moved it to <code>react</code>. <code>useFormStatus</code> (pending state) still comes from <code>react-dom</code>. The old import path is a common upgrade break.',
            'React 19 đổi tên <code>useFormState</code> → <code>useActionState</code> và chuyển nó sang <code>react</code>. <code>useFormStatus</code> (trạng thái đang chờ) vẫn ở <code>react-dom</code>. Đường import cũ là một lỗi nâng cấp thường gặp.',
          ),
        }),

        // ── Ch13 styling ────────────────────────────────────────────────
        mcq({
          prompt: B(
            'The global dark theme class on cuongthai.com is…',
            'Class theme tối toàn cục của cuongthai.com là…',
          ),
          options: [
            B('theme-dark — because dark is reserved for the Notes Tailwind wrapper', 'theme-dark — vì dark dành riêng cho vỏ Tailwind của Notes'),
            B('dark — applied directly to the root html element', 'dark — đặt trực tiếp lên phần tử html gốc'),
            B('mode-dark — a built-in Tailwind theme class', 'mode-dark — một class theme có sẵn của Tailwind'),
            B('night — a custom variant defined in the config', 'night — một biến thể tuỳ chỉnh khai báo trong config'),
          ],
          correct: 0,
          explanation: EX(
            'Putting <code>dark</code> on <code>&lt;html&gt;</code> would force every Tailwind <code>dark:</code> utility on globally and break the Notes module&#x27;s own theme switcher. So the global class is <code>theme-dark</code>, and <code>dark</code>/<code>dark:</code> are reserved for the Notes wrapper.',
            'Đặt <code>dark</code> lên <code>&lt;html&gt;</code> sẽ bật cưỡng bức mọi tiện ích <code>dark:</code> của Tailwind toàn cục và phá switcher theme riêng của module Notes. Nên class toàn cục là <code>theme-dark</code>, còn <code>dark</code>/<code>dark:</code> dành riêng cho vỏ Notes.',
          ),
        }),
        mcq({
          prompt: B(
            'A fixed dark surface shows black text on black even though CSS variables are set. The missing piece is…',
            'Một bề mặt tối cố định hiện chữ đen trên nền đen dù đã đặt biến CSS. Chỗ thiếu là…',
          ),
          options: [
            B('An explicit color on the text, not just the variables', 'Một color rõ ràng cho chữ, không chỉ các biến'),
            B('A bigger font size so the text stands out more', 'Một cỡ chữ lớn hơn để chữ nổi bật hơn'),
            B('A higher z-index so the text paints above the surface', 'Một z-index cao hơn để chữ vẽ đè lên bề mặt'),
            B('A print media query that overrides the dark colors', 'Một media query cho việc in để ghi đè màu tối'),
          ],
          correct: 0,
          explanation: EX(
            'Defining variables does not apply them — a hardcoded dark background needs an explicit <code>color</code> (or the theme variable) on the text. This "black on black" bug touched 142 files; test by flipping light↔dark and reading.',
            'Định nghĩa biến không tự áp dụng chúng — một nền tối gán cứng cần một <code>color</code> rõ ràng (hoặc biến theme) cho chữ. Lỗi "đen trên đen" này đụng 142 file; hãy kiểm bằng cách lật sáng↔tối rồi đọc.',
          ),
        }),

        // ── Ch14 state mgmt ─────────────────────────────────────────────
        mcq({
          prompt: B(
            'Which tool is designed specifically for cached server data (fetch, cache, revalidate, retry)?',
            'Công cụ nào được thiết kế riêng cho dữ liệu server có cache (tải, cache, làm mới, thử lại)?',
          ),
          options: [
            B('TanStack Query (React Query)', 'TanStack Query (React Query)'),
            B('Zustand', 'Zustand'),
            B('Redux without middleware', 'Redux không middleware'),
            B('React Context', 'React Context'),
          ],
          correct: 0,
          explanation: EX(
            'TanStack Query specializes in server state: caching, background refetch, dedup, retries and invalidation. Zustand/Context/plain Redux handle client UI state; using them for server data means hand-rolling all that caching yourself.',
            'TanStack Query chuyên về server state: cache, tải lại nền, gộp trùng, thử lại và vô hiệu. Zustand/Context/Redux thường lo state giao diện phía client; dùng chúng cho dữ liệu server nghĩa là tự tay dựng lại toàn bộ phần cache đó.',
          ),
        }),
        mcq({
          prompt: B(
            'React Context is the WORST fit for which case?',
            'React Context KHÔNG hợp nhất với trường hợp nào?',
          ),
          options: [
            B('A value that updates many times per second', 'Một giá trị cập nhật nhiều lần mỗi giây'),
            B('The current theme (light or dark)', 'Theme hiện tại (sáng hoặc tối)'),
            B('The current locale or language setting', 'Ngôn ngữ hoặc thiết lập vùng hiện tại'),
            B('The currently signed-in user object', 'Object người dùng đang đăng nhập'),
          ],
          correct: 0,
          explanation: EX(
            'Every consumer of a Context re-renders when its value changes, so a high-frequency value (mouse position, scroll) causes render storms. Context suits rarely-changing globals (theme, locale, user); use a store with selectors for hot values.',
            'Mọi consumer của một Context render lại khi giá trị đổi, nên một giá trị tần suất cao (vị trí chuột, cuộn) gây bão render. Context hợp với các giá trị toàn cục hiếm đổi (theme, ngôn ngữ, user); dùng một store kèm selector cho giá trị "nóng".',
          ),
        }),

        // ── Ch15 auth ───────────────────────────────────────────────────
        mcq({
          prompt: B(
            'Which cookie flag stops JavaScript from reading a session token (mitigating XSS theft)?',
            'Cờ cookie nào ngăn JavaScript đọc token phiên (giảm rủi ro bị XSS đánh cắp)?',
          ),
          options: [
            B('HttpOnly', 'HttpOnly'),
            B('SameSite', 'SameSite'),
            B('Path', 'Path'),
            B('Max-Age', 'Max-Age'),
          ],
          correct: 0,
          explanation: EX(
            '<code>HttpOnly</code> hides the cookie from <code>document.cookie</code>, so injected scripts cannot read the token. <code>SameSite</code> limits cross-site sending (CSRF), <code>Path</code>/<code>Max-Age</code> scope and lifetime — none of those block JS reads.',
            '<code>HttpOnly</code> ẩn cookie khỏi <code>document.cookie</code>, nên script bị chèn không đọc được token. <code>SameSite</code> hạn chế gửi liên trang (CSRF), <code>Path</code>/<code>Max-Age</code> giới hạn phạm vi và tuổi thọ — không cái nào chặn JS đọc.',
          ),
        }),
        mcq({
          prompt: B(
            'Sessions on cuongthai.com died after 24h though the cookie lived 7 days. The two-part fix was…',
            'Phiên trên cuongthai.com chết sau 24 giờ dù cookie sống 7 ngày. Cách sửa hai phần là…',
          ),
          options: [
            B('A working /auth/refresh plus an axios 401 interceptor that refreshes once and retries', 'Một /auth/refresh hoạt động cộng một interceptor axios 401 tự refresh một lần rồi thử lại'),
            B('Extending the cookie&#x27;s Max-Age to thirty days', 'Kéo dài Max-Age của cookie lên ba mươi ngày'),
            B('Removing the HttpOnly flag from the session cookie', 'Bỏ cờ HttpOnly khỏi cookie phiên'),
            B('Switching from cookies to localStorage tokens', 'Chuyển từ cookie sang token trong localStorage'),
          ],
          correct: 0,
          explanation: EX(
            'The JWT expired in 24h with no refresh path, so authed calls 401&#x27;d though the cookie was present. The fix: a real <code>/auth/refresh</code> (verify with <code>ignoreExpiration</code> + re-check the account) and a 401 interceptor that refreshes once and retries — sessions self-heal.',
            'JWT hết hạn sau 24 giờ mà không có đường refresh, nên các lời gọi cần auth bị 401 dù cookie vẫn còn. Cách sửa: một <code>/auth/refresh</code> thật (verify với <code>ignoreExpiration</code> + kiểm lại tài khoản) và một interceptor 401 tự refresh một lần rồi thử lại — phiên tự lành.',
          ),
        }),
        mcq({
          prompt: B(
            'To protect every route under <code>/admin</code> in one place, use…',
            'Để bảo vệ mọi route dưới <code>/admin</code> ở một chỗ, dùng…',
          ),
          options: [
            B('middleware.ts with a matcher for /admin/:path*', 'middleware.ts với matcher cho /admin/:path*'),
            B('A useEffect in each admin page', 'Một useEffect trong từng trang admin'),
            B('A try/catch in the layout', 'Một try/catch trong layout'),
            B('A robots.txt rule', 'Một luật trong robots.txt'),
          ],
          correct: 0,
          explanation: EX(
            'Middleware runs before a matched request reaches the route, so one <code>middleware.ts</code> can check the session cookie and redirect to <code>/login</code> for the whole <code>/admin</code> section — before any protected content renders.',
            'Middleware chạy trước khi một request khớp tới được route, nên một <code>middleware.ts</code> có thể kiểm cookie phiên và chuyển tới <code>/login</code> cho cả mảng <code>/admin</code> — trước khi bất kỳ nội dung được bảo vệ nào render.',
          ),
        }),

        // ── Ch16 forms/upload ───────────────────────────────────────────
        mcq({
          prompt: B(
            'File type and size validation on an upload must happen…',
            'Kiểm loại và kích thước file khi upload phải diễn ra…',
          ),
          options: [
            B('On the server (client checks are UX only and can be bypassed)', 'Trên server (kiểm ở client chỉ để trải nghiệm và có thể bị đi vòng)'),
            B('On the client only, for speed', 'Chỉ trên client, cho nhanh'),
            B('Nowhere — storage validates it', 'Không đâu cả — kho lưu trữ tự kiểm'),
            B('Only via the file extension', 'Chỉ qua phần mở rộng của file'),
          ],
          correct: 0,
          explanation: EX(
            'A client can be bypassed with curl or devtools, so the server must re-check the real content type and enforce a size limit before storing — a real cuongthai.com hardening. Never trust the extension alone.',
            'Client có thể bị đi vòng bằng curl hay devtools, nên server phải kiểm lại loại nội dung thật và áp giới hạn kích thước trước khi lưu — một lần gia cố thật của cuongthai.com. Đừng bao giờ tin mỗi phần mở rộng.',
          ),
        }),
        mcq({
          prompt: B(
            '<code>getMediaUrl</code> must NOT prepend the CDN base to which values?',
            '<code>getMediaUrl</code> KHÔNG được ghép base CDN vào loại giá trị nào?',
          ),
          options: [
            B('blob: and data: URLs (already renderable)', 'URL blob: và data: (đã render được sẵn)'),
            B('Bare R2 storage keys', 'Các key kho R2 trần'),
            B('Relative keys with a leading slash', 'Các key tương đối có gạch chéo đầu'),
            B('Folder-prefixed keys like posts/x.webp', 'Các key có tiền tố thư mục như posts/x.webp'),
          ],
          correct: 0,
          explanation: EX(
            'A <code>blob:</code>/<code>data:</code> URL (an upload preview) is already a full renderable URL; prefixing the CDN base makes <code>https://cdn/blob:...</code> and 400s. Only bare storage keys need the CDN base — a real cuongthai.com bug.',
            'Một URL <code>blob:</code>/<code>data:</code> (bản xem trước upload) đã là một URL render được đầy đủ; ghép base CDN vào tạo ra <code>https://cdn/blob:...</code> và lỗi 400. Chỉ key kho trần mới cần base CDN — một lỗi thật của cuongthai.com.',
          ),
        }),

        // ── Ch17 rendering/SEO ──────────────────────────────────────────
        mcq({
          prompt: B(
            'A page pre-rendered at build time and cached is which strategy?',
            'Một trang dựng sẵn lúc build và được cache là chiến lược nào?',
          ),
          options: [
            B('SSG (Static Site Generation)', 'SSG (Sinh trang tĩnh)'),
            B('SSR (Server-Side Rendering)', 'SSR (Render phía server)'),
            B('CSR (Client-Side Rendering)', 'CSR (Render phía client)'),
            B('SPA hydration', 'Hydration của SPA'),
          ],
          correct: 0,
          explanation: EX(
            'SSG builds the HTML once at build time and serves it cached — fast, but potentially stale (add ISR/<code>revalidate</code> for freshness). SSR renders per request; CSR renders in the browser after JS loads.',
            'SSG dựng HTML một lần lúc build và phục vụ bản cache — nhanh, nhưng có thể cũ (thêm ISR/<code>revalidate</code> cho tươi). SSR render theo từng request; CSR render trong trình duyệt sau khi JS tải.',
          ),
        }),
        mcq({
          prompt: B(
            'For SEO in the App Router, the page title/description should come from…',
            'Để SEO trong App Router, tiêu đề/mô tả trang nên đến từ…',
          ),
          options: [
            B('An exported metadata object or generateMetadata', 'Một object metadata được export hoặc generateMetadata'),
            B('document.title set in useEffect', 'document.title đặt trong useEffect'),
            B('A &lt;title&gt; in the component body', 'Một &lt;title&gt; trong thân component'),
            B('next.config.js', 'next.config.js'),
          ],
          correct: 0,
          explanation: EX(
            'The Metadata API — <code>export const metadata</code> or <code>generateMetadata</code> — renders the correct head tags on the server, which crawlers and social previews read. Client-set titles run too late for most crawlers.',
            'Metadata API — <code>export const metadata</code> hoặc <code>generateMetadata</code> — render đúng các thẻ head trên server, thứ mà trình thu thập và bản xem trước mạng xã hội đọc. Tiêu đề đặt ở client chạy quá trễ với phần lớn trình thu thập.',
          ),
        }),

        // ── Ch18 perf ───────────────────────────────────────────────────
        mcq({
          prompt: B(
            'The main reason to use <code>next/image</code> over <code>&lt;img&gt;</code> for Core Web Vitals is…',
            'Lý do chính dùng <code>next/image</code> thay <code>&lt;img&gt;</code> vì Core Web Vitals là…',
          ),
          options: [
            B('It reserves space and lazy-loads/optimizes, reducing layout shift and bytes', 'Nó giữ chỗ và tải lười/tối ưu, giảm xô lệch bố cục và số byte'),
            B('It loads every image eagerly and synchronously', 'Nó tải mọi ảnh sốt sắng và đồng bộ'),
            B('It disables caching to always be fresh', 'Nó tắt cache để luôn tươi'),
            B('It converts images to inline SVG', 'Nó đổi ảnh thành SVG nội tuyến'),
          ],
          correct: 0,
          explanation: EX(
            '<code>next/image</code> requires dimensions (or <code>fill</code>) that reserve space (killing layout shift), lazy-loads offscreen images, serves responsive modern formats, and caches optimized variants — all wins for CLS/LCP.',
            '<code>next/image</code> đòi kích thước (hoặc <code>fill</code>) để giữ chỗ (diệt xô lệch bố cục), tải lười ảnh ngoài màn hình, phục vụ định dạng hiện đại đáp ứng, và cache các biến thể đã tối ưu — đều có lợi cho CLS/LCP.',
          ),
        }),
        mcq({
          prompt: B(
            'The reliable way to measure a route&#x27;s JavaScript weight is…',
            'Cách đáng tin để đo độ nặng JavaScript của một route là…',
          ),
          options: [
            B('The First Load JS number from next build', 'Con số First Load JS từ next build'),
            B('Counting &lt;script&gt; tags in the HTML', 'Đếm số thẻ &lt;script&gt; trong HTML'),
            B('The HTML document size', 'Kích thước tài liệu HTML'),
            B('The number of imports in the file', 'Số lượng import trong file'),
          ],
          correct: 0,
          explanation: EX(
            '<code>next build</code> prints per-route First Load JS — the real shipped bundle including shared chunks. Counting script tags misleads (preloads, chunks, inline runtime). A lesson learned measuring page weight on cuongthai.com.',
            '<code>next build</code> in ra First Load JS theo từng route — bundle thật được gửi đi, gồm cả chunk dùng chung. Đếm thẻ script gây hiểu nhầm (preload, chunk, runtime nội tuyến). Một bài học rút ra khi đo độ nặng trang trên cuongthai.com.',
          ),
        }),

        // ── Ch19 testing ────────────────────────────────────────────────
        mcq({
          prompt: B(
            'React Testing Library prefers queries by…',
            'React Testing Library ưu tiên truy vấn theo…',
          ),
          options: [
            B('Role, label and visible text — what the user perceives', 'Vai trò, nhãn và văn bản hiển thị — thứ người dùng cảm nhận'),
            B('CSS class names on the rendered elements', 'Tên class CSS trên các phần tử đã render'),
            B('The component&#x27;s internal state values', 'Các giá trị state nội bộ của component'),
            B('The ids of the underlying DOM elements', 'Id của các phần tử DOM bên dưới'),
          ],
          correct: 0,
          explanation: EX(
            'RTL encourages testing behaviour the way users experience it — <code>getByRole</code>, <code>getByLabelText</code>, <code>getByText</code> — so tests survive refactors that keep behaviour but change class names or internal state.',
            'RTL khuyến khích kiểm hành vi theo cách người dùng trải nghiệm — <code>getByRole</code>, <code>getByLabelText</code>, <code>getByText</code> — để test sống sót qua refactor giữ nguyên hành vi nhưng đổi tên class hay state nội bộ.',
          ),
        }),
        mcq({
          prompt: B(
            'A renamed schema enum passed <code>tsc</code> but broke the seed on prod. The lesson is…',
            'Một enum schema bị đổi tên qua được <code>tsc</code> nhưng vỡ seed trên prod. Bài học là…',
          ),
          options: [
            B('Run the code (the seed) — type-checking alone misses runtime breakage', 'Hãy chạy mã (seed) — chỉ kiểm kiểu sẽ bỏ sót hỏng lúc chạy'),
            B('Enum values must never be renamed once shipped', 'Giá trị enum không bao giờ được đổi tên khi đã ship'),
            B('Remove TypeScript from the project entirely', 'Gỡ hẳn TypeScript ra khỏi dự án'),
            B('Production databases simply cannot be seeded', 'Cơ sở dữ liệu production đơn giản là không seed được'),
          ],
          correct: 0,
          explanation: EX(
            'The seed carried a hand-copied union and <code>tsconfig</code> excluded <code>prisma/**</code>, so <code>tsc</code> passed while the seed broke at runtime. Add a real run and a dedicated <code>typecheck:seed</code> to your checks — some breakage is only visible by running.',
            'File seed mang một union chép tay và <code>tsconfig</code> loại trừ <code>prisma/**</code>, nên <code>tsc</code> qua nhưng seed vỡ lúc chạy. Hãy thêm một lần chạy thật và một <code>typecheck:seed</code> riêng vào bộ kiểm — có hỏng hóc chỉ lộ khi chạy.',
          ),
        }),

        // ── Ch20 deploy ─────────────────────────────────────────────────
        mcq({
          prompt: B(
            'A <code>NEXT_PUBLIC_*</code> value is wrong in production. What actually fixes it?',
            'Một giá trị <code>NEXT_PUBLIC_*</code> bị sai trên production. Cái gì mới thật sự sửa được?',
          ),
          options: [
            B('Rebuild the app — the value is baked into the bundle at build time', 'Build lại ứng dụng — giá trị được nướng vào bundle lúc build'),
            B('Restart the container with the same image', 'Restart container với đúng image cũ'),
            B('Edit the value directly in the database', 'Sửa giá trị trực tiếp trong cơ sở dữ liệu'),
            B('Clear the CDN cache and wait a while', 'Xoá cache CDN rồi chờ một lúc'),
          ],
          correct: 0,
          explanation: EX(
            '<code>NEXT_PUBLIC_*</code> vars are inlined into the client bundle during <code>next build</code>. A restart reuses the same image with the old baked value; only rebuilding recompiles with the new value.',
            'Biến <code>NEXT_PUBLIC_*</code> được nội tuyến vào bundle client trong <code>next build</code>. Restart dùng lại đúng image với giá trị nướng cũ; chỉ build lại mới biên dịch lại với giá trị mới.',
          ),
        }),
        mcq({
          prompt: B(
            'A browser-facing third-party API key should be handled how?',
            'Một API key bên thứ ba hướng trình duyệt nên được xử lý thế nào?',
          ),
          options: [
            B('Kept server-side and proxied through a backend route', 'Giữ ở server và proxy qua một route backend'),
            B('Exposed as NEXT_PUBLIC_ for the client to use', 'Lộ ra dạng NEXT_PUBLIC_ để client dùng'),
            B('Stored in localStorage', 'Lưu trong localStorage'),
            B('Hardcoded in the component', 'Gán cứng trong component'),
          ],
          correct: 0,
          explanation: EX(
            'Anything <code>NEXT_PUBLIC_*</code> ships in the client bundle for anyone to read. Third-party keys must stay server-side behind a proxy route (cuongthai.com&#x27;s <code>/api/v1/gifs</code>), which also enables caching and key rotation by restart.',
            'Bất cứ thứ gì <code>NEXT_PUBLIC_*</code> đều đi kèm bundle client cho ai cũng đọc được. Key bên thứ ba phải ở server sau một route proxy (như <code>/api/v1/gifs</code> của cuongthai.com), vốn còn cho phép cache và xoay key bằng restart.',
          ),
        }),
        mcq({
          prompt: B(
            'You deployed new code but production content is empty. Why?',
            'Bạn đã deploy mã mới nhưng nội dung production trống rỗng. Vì sao?',
          ),
          options: [
            B('Deploy ships code, not your local data — content must be seeded on prod', 'Deploy đẩy mã, không đẩy dữ liệu local — nội dung phải được seed trên prod'),
            B('The production build must have failed silently', 'Bản build production hẳn đã thất bại âm thầm'),
            B('The deploy process wiped the production database', 'Quá trình deploy đã xoá sạch cơ sở dữ liệu production'),
            B('Production content always lags one deploy behind', 'Nội dung production luôn trễ một lần deploy'),
          ],
          correct: 0,
          explanation: EX(
            'A deploy builds and ships the working tree; it does not copy rows from your local database. If content lives only locally, prod stays empty. Content that must reach prod needs a seeding step inside the deploy pipeline.',
            'Một lần deploy build và đẩy cây làm việc; nó không sao chép các dòng từ cơ sở dữ liệu local của bạn. Nếu nội dung chỉ nằm ở local, prod sẽ trống. Nội dung cần lên prod phải có một bước seed trong quy trình deploy.',
          ),
        }),
      ],
    },
  ],
};
