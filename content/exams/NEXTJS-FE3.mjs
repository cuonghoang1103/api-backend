/**
 * Next.js & React — Final Exam 3 (FE-3): 50 câu trắc nghiệm phủ cả 20 chương.
 *
 * Đề tự soạn, khác câu với FE-1/FE-2. Mọi đoạn JSX/JS hỏi "in ra gì" đã CHẠY
 * THẬT (react-dom/server / node).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NEXTJS-FE3.mjs --apply
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
      code: 'FE-3',
      source: 'SAMPLE',
      sortOrder: 6,
      title: B(
        'Final Exam 3 — the whole Next.js & React course (50 questions)',
        'Thi cuối khoá 3 — toàn bộ khoá Next.js & React (50 câu)',
      ),
      description: B(
        'A third full-course final covering all twenty chapters with fresh questions: React fundamentals, the App Router and RSC, caching, routing, Server Actions, styling, state, auth, forms, rendering, performance, testing and deploy.',
        'Đề cuối khoá thứ ba phủ cả hai mươi chương với câu hỏi mới: nền tảng React, App Router và RSC, cache, định tuyến, Server Actions, giao diện, state, xác thực, form, render, hiệu năng, kiểm thử và deploy.',
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
            'What renders?' + code('return <div>{0}{" items"}</div>;'),
            'Cái gì được render?' + code('return <div>{0}{" items"}</div>;'),
          ),
          options: [
            B('&lt;div&gt;0 items&lt;/div&gt;', '&lt;div&gt;0 items&lt;/div&gt;'),
            B('&lt;div&gt; items&lt;/div&gt;', '&lt;div&gt; items&lt;/div&gt;'),
            B('&lt;div&gt;items&lt;/div&gt;', '&lt;div&gt;items&lt;/div&gt;'),
            B('&lt;div&gt;&lt;/div&gt; (nothing)', '&lt;div&gt;&lt;/div&gt; (rỗng)'),
          ],
          correct: 0,
          explanation: EX(
            'Verified with renderToStaticMarkup. React renders the number <code>0</code> (numbers are printed, unlike booleans/null), so you get "0 items". This is the flip side of the zero bug: <code>{0}</code> shows, but <code>{0 &amp;&amp; x}</code> also shows a stray 0.',
            'Đã kiểm bằng renderToStaticMarkup. React render con số <code>0</code> (số được in ra, khác boolean/null), nên bạn có "0 items". Đây là mặt kia của bẫy số 0: <code>{0}</code> hiện, và <code>{0 &amp;&amp; x}</code> cũng hiện một số 0 lạc lõng.',
          ),
        }),
        mcq({
          prompt: B(
            'What HTML does this produce?' + code('return <input type="checkbox" checked readOnly />;'),
            'Đoạn này tạo ra HTML nào?' + code('return <input type="checkbox" checked readOnly />;'),
          ),
          options: [
            B('&lt;input type="checkbox" readonly="" checked=""/&gt;', '&lt;input type="checkbox" readonly="" checked=""/&gt;'),
            B('&lt;input type="checkbox" checked="true"/&gt;', '&lt;input type="checkbox" checked="true"/&gt;'),
            B('&lt;input type="checkbox"/&gt;', '&lt;input type="checkbox"/&gt;'),
            B('&lt;input type="checkbox" checked="checked"/&gt;', '&lt;input type="checkbox" checked="checked"/&gt;'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. A boolean attribute set to <code>true</code> renders as the attribute with an empty string value (<code>checked=""</code>), and <code>readOnly</code> becomes <code>readonly</code>. React normalizes camelCase DOM props to their HTML attribute form.',
            'Đã chạy thật. Một thuộc tính boolean đặt <code>true</code> render thành thuộc tính với giá trị chuỗi rỗng (<code>checked=""</code>), và <code>readOnly</code> thành <code>readonly</code>. React chuẩn hoá prop DOM camelCase về dạng thuộc tính HTML.',
          ),
        }),
        mcq({
          prompt: B(
            'To render a list you use <code>.map()</code> inside <code>{ }</code>, not a for loop, because…',
            'Để render một danh sách bạn dùng <code>.map()</code> trong <code>{ }</code>, không phải vòng for, vì…',
          ),
          options: [
            B('Curly braces take an expression, and map returns an array of elements', 'Ngoặc nhọn nhận một biểu thức, và map trả về một mảng phần tử'),
            B('for loops are slower than map in every case', 'Vòng for luôn chậm hơn map trong mọi trường hợp'),
            B('React cannot render arrays of elements', 'React không render được mảng phần tử'),
            B('map is required for keys to work', 'map là bắt buộc để key hoạt động'),
          ],
          correct: 0,
          explanation: EX(
            'JSX braces embed an expression; a <code>for</code> statement has no value, but <code>.map()</code> returns an array of elements, which React renders. You can build the array with a loop beforehand — but you cannot put the loop inside the braces.',
            'Ngoặc JSX nhúng một biểu thức; câu lệnh <code>for</code> không có giá trị, còn <code>.map()</code> trả về một mảng phần tử để React render. Bạn có thể dựng mảng bằng vòng lặp từ trước — nhưng không đặt vòng lặp vào trong ngoặc được.',
          ),
        }),
        // Ch2
        mcq({
          prompt: B(
            'A prop typed as <code>onSave: (id: number) =&gt; void</code> is an example of…',
            'Một prop kiểu <code>onSave: (id: number) =&gt; void</code> là ví dụ của…',
          ),
          options: [
            B('A callback prop for child-to-parent communication', 'Một prop callback để con giao tiếp lên cha'),
            B('Two-way data binding between parent and child', 'Ràng buộc dữ liệu hai chiều giữa cha và con'),
            B('A ref forwarded down to a DOM element', 'Một ref chuyển tiếp xuống một phần tử DOM'),
            B('A piece of server-only data for the child', 'Một mẩu dữ liệu chỉ có ở server cho con'),
          ],
          correct: 0,
          explanation: EX(
            'A function prop lets the child call back into the parent (passing data up), which is how React does upward communication — data down via props, events up via callbacks. React has no two-way binding built in.',
            'Một prop hàm cho phép con gọi ngược lên cha (đẩy dữ liệu lên), đó là cách React giao tiếp lên trên — dữ liệu xuống qua props, sự kiện lên qua callback. React không có ràng buộc hai chiều dựng sẵn.',
          ),
        }),
        mcq({
          prompt: B(
            'A component with only a <code>title</code> prop re-renders when its parent re-renders, even if title is unchanged. To skip that, wrap it in…',
            'Một component chỉ có prop <code>title</code> vẫn render lại khi cha render lại, dù title không đổi. Để bỏ qua điều đó, bọc nó trong…',
          ),
          options: [
            B('React.memo', 'React.memo'),
            B('useMemo', 'useMemo'),
            B('useRef', 'useRef'),
            B('Suspense', 'Suspense'),
          ],
          correct: 0,
          explanation: EX(
            '<code>React.memo</code> wraps a component so it skips re-rendering when its props are shallow-equal. <code>useMemo</code> memoizes a value inside a component, not the component itself; <code>useRef</code>/<code>Suspense</code> serve other purposes.',
            '<code>React.memo</code> bọc một component để nó bỏ qua render lại khi props nông-bằng. <code>useMemo</code> memo hoá một giá trị bên trong component, không phải bản thân component; <code>useRef</code>/<code>Suspense</code> phục vụ mục đích khác.',
          ),
        }),
        mcq({
          prompt: B(
            'What does this print?' + code("console.log('a,b,,c'.split(',').length);"),
            'Đoạn này in ra gì?' + code("console.log('a,b,,c'.split(',').length);"),
          ),
          options: [
            B('4', '4'),
            B('3', '3'),
            B('2', '2'),
            B('5', '5'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. Splitting <code>"a,b,,c"</code> on commas yields <code>["a","b","","c"]</code> — the empty segment between the two commas counts — so the length is 4. Watch for empty strings when parsing CSV-like input.',
            'Đã chạy thật. Tách <code>"a,b,,c"</code> theo dấu phẩy cho <code>["a","b","","c"]</code> — đoạn rỗng giữa hai dấu phẩy được tính — nên độ dài là 4. Hãy để ý chuỗi rỗng khi parse dữ liệu kiểu CSV.',
          ),
        }),
        // Ch3
        mcq({
          prompt: B(
            'What does this print?' + code("console.log(JSON.stringify([1,2,3,4].reduce((o,n)=>{o[n%2?'odd':'even'].push(n);return o;},{odd:[],even:[]})));"),
            'Đoạn này in ra gì?' + code("console.log(JSON.stringify([1,2,3,4].reduce((o,n)=>{o[n%2?'odd':'even'].push(n);return o;},{odd:[],even:[]})));"),
          ),
          options: [
            B('{"odd":[1,3],"even":[2,4]}', '{"odd":[1,3],"even":[2,4]}'),
            B('{"odd":[2,4],"even":[1,3]}', '{"odd":[2,4],"even":[1,3]}'),
            B('{"odd":[1,2,3,4],"even":[]}', '{"odd":[1,2,3,4],"even":[]}'),
            B('{"odd":[],"even":[1,2,3,4]}', '{"odd":[],"even":[1,2,3,4]}'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>n % 2</code> is truthy for odd numbers, so 1 and 3 go to "odd" and 2, 4 to "even". This <code>reduce</code>-into-an-accumulator pattern is common for grouping derived data during render.',
            'Đã chạy thật. <code>n % 2</code> là truthy với số lẻ, nên 1 và 3 vào "odd", còn 2, 4 vào "even". Mẫu <code>reduce</code>-vào-một-bộ-tích-luỹ này hay dùng để nhóm dữ liệu suy ra khi render.',
          ),
        }),
        mcq({
          prompt: B(
            'To update a nested field <code>user.address.city</code> in state immutably, you…',
            'Để cập nhật một trường lồng <code>user.address.city</code> trong state một cách bất biến, bạn…',
          ),
          options: [
            B('Spread each level: { ...user, address: { ...user.address, city } }', 'Spread từng tầng: { ...user, address: { ...user.address, city } }'),
            B('Set user.address.city = city directly', 'Gán user.address.city = city trực tiếp'),
            B('Call setUser({ city })', 'Gọi setUser({ city })'),
            B('Use Object.assign(user, { city })', 'Dùng Object.assign(user, { city })'),
          ],
          correct: 0,
          explanation: EX(
            'Immutability must go all the way down: copy each nested object you change. Direct assignment mutates the same reference; <code>setUser({ city })</code> replaces the whole object and loses fields; <code>Object.assign(user, ...)</code> mutates <code>user</code>.',
            'Tính bất biến phải đi tới tận cùng: sao chép từng object lồng mà bạn sửa. Gán trực tiếp là mutate cùng tham chiếu; <code>setUser({ city })</code> thay cả object và mất các trường; <code>Object.assign(user, ...)</code> mutate <code>user</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'Two rapid <code>setCount(count + 1)</code> calls in one event both use the same count. This is because state is…',
            'Hai lời <code>setCount(count + 1)</code> liên tiếp trong một sự kiện đều dùng cùng count. Đó là vì state là…',
          ),
          options: [
            B('A snapshot captured for the current render', 'Một ảnh chụp được bắt cho lần render hiện tại'),
            B('Stored on the server', 'Được lưu trên server'),
            B('Read from the DOM each time', 'Đọc từ DOM mỗi lần'),
            B('A constant that never updates', 'Một hằng số không bao giờ cập nhật'),
          ],
          correct: 0,
          explanation: EX(
            'During a render, <code>count</code> is a fixed snapshot, so both calls compute from the same value and the last wins (+1). Use the updater form <code>setCount(c =&gt; c + 1)</code> to add based on the latest queued value.',
            'Trong một lần render, <code>count</code> là một ảnh chụp cố định, nên cả hai lời gọi tính từ cùng giá trị và lần cuối thắng (+1). Dùng dạng hàm cập nhật <code>setCount(c =&gt; c + 1)</code> để cộng dựa trên giá trị mới nhất trong hàng đợi.',
          ),
        }),
        // Ch4
        mcq({
          prompt: B(
            'For an Enter-to-submit search box that must respect IME composition, check…',
            'Với một ô tìm kiếm Enter-để-submit cần tôn trọng việc soạn của IME, hãy kiểm…',
          ),
          options: [
            B('e.nativeEvent.isComposing before handling Enter', 'e.nativeEvent.isComposing trước khi xử lý Enter'),
            B('e.repeat to detect a held-down key', 'e.repeat để phát hiện phím bị giữ'),
            B('e.shiftKey to detect the Shift modifier', 'e.shiftKey để phát hiện phím Shift'),
            B('e.target.value.length before handling Enter', 'e.target.value.length trước khi xử lý Enter'),
          ],
          correct: 0,
          explanation: EX(
            'While an IME is composing (Vietnamese tones, Japanese kanji), Enter confirms a candidate, not a submit. Guard with <code>e.nativeEvent.isComposing</code> (or <code>e.isComposing</code>) and return early — a real bug across Messenger, Feed and Code Lab.',
            'Khi IME đang soạn (dấu tiếng Việt, kanji tiếng Nhật), Enter là để xác nhận ứng viên, không phải submit. Hãy chặn bằng <code>e.nativeEvent.isComposing</code> (hoặc <code>e.isComposing</code>) rồi thoát sớm — một lỗi thật ở Messenger, Feed và Code Lab.',
          ),
        }),
        mcq({
          prompt: B(
            'An uncontrolled input reads its value at submit time via…',
            'Một ô nhập không kiểm soát đọc giá trị lúc submit qua…',
          ),
          options: [
            B('A ref pointing to the DOM node', 'Một ref trỏ tới nút DOM'),
            B('useState on every keystroke', 'useState ở mỗi phím'),
            B('The value prop', 'Prop value'),
            B('A Server Action prop', 'Một prop Server Action'),
          ],
          correct: 0,
          explanation: EX(
            'An uncontrolled input keeps its value in the DOM; you read it with a <code>ref</code> (<code>ref.current.value</code>) when needed, often with <code>defaultValue</code> for the initial text. Controlled inputs use <code>value</code> + <code>onChange</code> instead.',
            'Một ô không kiểm soát giữ giá trị trong DOM; bạn đọc nó bằng một <code>ref</code> (<code>ref.current.value</code>) khi cần, thường kèm <code>defaultValue</code> cho chữ ban đầu. Ô có kiểm soát thì dùng <code>value</code> + <code>onChange</code>.',
          ),
        }),
        // Ch5
        mcq({
          prompt: B(
            'An effect logs a stale <code>count</code> forever. Which fix is valid? (choose TWO)',
            'Một effect log một <code>count</code> cũ mãi mãi. Cách sửa nào hợp lệ? (chọn HAI)',
          ),
          options: [
            B('Add count to the dependency array', 'Thêm count vào mảng dependency'),
            B('Use a ref that always holds the latest count', 'Dùng một ref luôn giữ count mới nhất'),
            B('Remove the dependency array entirely to freeze it', 'Bỏ hẳn mảng dependency để đóng băng nó'),
            B('Wrap the effect in useMemo', 'Bọc effect trong useMemo'),
          ],
          correct: [0, 1],
          explanation: EX(
            'The stale value comes from a closure captured once. Re-subscribing by listing <code>count</code> in deps, or reading the latest value through a ref, both fix it. Removing the array makes it run every render (not "freeze"); <code>useMemo</code> does not apply.',
            'Giá trị cũ đến từ một closure bắt một lần. Đăng ký lại bằng cách liệt kê <code>count</code> trong deps, hoặc đọc giá trị mới nhất qua một ref — cả hai đều sửa được. Bỏ mảng làm nó chạy mỗi render (không "đóng băng"); <code>useMemo</code> không áp dụng.',
          ),
        }),
        mcq({
          prompt: B(
            'You must sync a third-party chart library with React state. This belongs in…',
            'Bạn cần đồng bộ một thư viện biểu đồ bên thứ ba với state React. Việc này thuộc về…',
          ),
          options: [
            B('A useEffect that updates the chart when data changes', 'Một useEffect cập nhật biểu đồ khi dữ liệu đổi'),
            B('The render body directly, on every render', 'Ngay trong thân render, ở mỗi lần render'),
            B('A useMemo that recomputes the chart', 'Một useMemo tính lại biểu đồ'),
            B('A Server Component that renders the chart', 'Một Server Component render biểu đồ'),
          ],
          correct: 0,
          explanation: EX(
            'Talking to a non-React system (a chart, a map) is a side effect — do it in <code>useEffect</code> so it runs after render and can clean up. Doing it in the render body breaks purity; <code>useMemo</code> is for computing values, not side effects.',
            'Nói chuyện với một hệ thống ngoài React (biểu đồ, bản đồ) là một hiệu ứng phụ — hãy làm trong <code>useEffect</code> để nó chạy sau render và dọn dẹp được. Làm trong thân render phá tính thuần; <code>useMemo</code> để tính giá trị, không phải hiệu ứng phụ.',
          ),
        }),
        // Ch6
        mcq({
          prompt: B(
            'A custom hook <code>useToggle()</code> called in two components gives them…',
            'Một custom hook <code>useToggle()</code> gọi trong hai component cho chúng…',
          ),
          options: [
            B('Independent state each — it shares logic, not state', 'State riêng cho mỗi cái — nó chia sẻ logic, không phải state'),
            B('One shared boolean across both components', 'Một boolean dùng chung cho cả hai component'),
            B('Shared JSX markup rendered in both', 'JSX dùng chung được render ở cả hai'),
            B('Nothing, because hooks cannot be reused', 'Không gì, vì hook không thể tái dùng'),
          ],
          correct: 0,
          explanation: EX(
            'A custom hook is a function that calls hooks; each call runs independently with its own state. It shares the <b>logic</b> (the how), not a single state instance. To share one state, lift it up or use a store/context.',
            'Một custom hook là một hàm gọi các hook; mỗi lời gọi chạy độc lập với state riêng. Nó chia sẻ <b>logic</b> (cách làm), không phải một thể hiện state duy nhất. Muốn dùng chung một state thì nâng nó lên hoặc dùng store/context.',
          ),
        }),
        mcq({
          prompt: B(
            'Which is a valid reason to use <code>useMemo</code>?',
            'Lý do hợp lệ để dùng <code>useMemo</code> là gì?',
          ),
          options: [
            B('Keeping an object reference stable for a memoized child', 'Giữ tham chiếu object ổn định cho một con đã memo'),
            B('Triggering a re-render when a value changes', 'Kích hoạt render lại khi một giá trị đổi'),
            B('Persisting state to disk', 'Lưu state xuống đĩa'),
            B('Replacing useEffect for subscriptions', 'Thay useEffect cho việc đăng ký'),
          ],
          correct: 0,
          explanation: EX(
            '<code>useMemo</code> caches a computed value (or a stable object/array reference) between renders while deps are unchanged — useful for expensive work or to keep a <code>React.memo</code> child from seeing a "new" prop. It does not trigger renders or do I/O.',
            '<code>useMemo</code> lưu tạm một giá trị đã tính (hoặc một tham chiếu object/mảng ổn định) giữa các lần render khi deps không đổi — hữu ích cho việc tính nặng hoặc để một con <code>React.memo</code> không thấy prop "mới". Nó không kích hoạt render hay làm I/O.',
          ),
        }),
        // Ch7
        mcq({
          prompt: B(
            'Deleting the first item of an index-keyed list causes what visible bug?',
            'Xoá phần tử đầu của một danh sách key bằng chỉ số gây lỗi nhìn thấy được nào?',
          ),
          options: [
            B('Inputs/checkboxes keep the wrong state after the delete', 'Ô nhập/checkbox giữ state sai sau khi xoá'),
            B('The list becomes empty', 'Danh sách trở nên rỗng'),
            B('The app crashes immediately', 'Ứng dụng sập ngay'),
            B('Nothing — index keys are always fine', 'Không sao — key chỉ số luôn ổn'),
          ],
          correct: 0,
          explanation: EX(
            'Removing item 0 shifts every index down by one, so React reuses the DOM/state of the wrong item — a checkbox that was checked stays checked on a different row, an input keeps the wrong text. A stable id fixes it.',
            'Xoá phần tử 0 làm mọi chỉ số lùi một, nên React tái dùng DOM/state của phần tử sai — một checkbox đang tích vẫn tích ở dòng khác, một ô nhập giữ chữ sai. Một id ổn định sẽ sửa được.',
          ),
        }),
        mcq({
          prompt: B(
            'React&#x27;s reconciliation, when the element type at a position is unchanged, will…',
            'Reconciliation của React, khi kiểu phần tử ở một vị trí không đổi, sẽ…',
          ),
          options: [
            B('Update the existing DOM in place and keep its state', 'Cập nhật DOM sẵn có tại chỗ và giữ state của nó'),
            B('Unmount the old instance and remount a new one', 'Gỡ thể hiện cũ và mount lại một cái mới'),
            B('Duplicate it into a second instance', 'Nhân đôi nó thành một thể hiện thứ hai'),
            B('Ignore the update and keep the old DOM', 'Bỏ qua cập nhật và giữ DOM cũ'),
          ],
          correct: 0,
          explanation: EX(
            'Same type at the same position → React reuses the instance, updates props/DOM in place, and keeps state. Only a changed type (or a changed key) triggers unmount-then-mount, which resets state.',
            'Cùng kiểu ở cùng vị trí → React tái dùng thể hiện, cập nhật props/DOM tại chỗ, và giữ state. Chỉ khi đổi kiểu (hoặc đổi key) mới kích hoạt gỡ-rồi-mount, làm đặt lại state.',
          ),
        }),
        // Ch8
        mcq({
          prompt: B(
            'Which special file catches render errors for a segment and offers a retry?',
            'File đặc biệt nào bắt lỗi render cho một đoạn và cho phép thử lại?',
          ),
          options: [
            B('error.tsx (a Client Component with reset)', 'error.tsx (một Client Component có reset)'),
            B('loading.tsx (the Suspense fallback)', 'loading.tsx (màn dự phòng Suspense)'),
            B('not-found.tsx (the 404 handler)', 'not-found.tsx (bộ xử lý 404)'),
            B('page.tsx (the page component itself)', 'page.tsx (bản thân component trang)'),
          ],
          correct: 0,
          explanation: EX(
            '<code>error.tsx</code> is an error boundary (must be a Client Component) that catches errors in its segment and renders a fallback with a <code>reset()</code> to retry. <code>loading.tsx</code> is the Suspense fallback; <code>not-found.tsx</code> handles <code>notFound()</code>.',
            '<code>error.tsx</code> là một error boundary (phải là Client Component) bắt lỗi trong đoạn của nó và render màn dự phòng kèm <code>reset()</code> để thử lại. <code>loading.tsx</code> là màn dự phòng Suspense; <code>not-found.tsx</code> xử lý <code>notFound()</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'A route group <code>(shop)</code> affects the URL how?',
            'Một route group <code>(shop)</code> ảnh hưởng URL thế nào?',
          ),
          options: [
            B('Not at all — it organizes files without adding a segment', 'Không hề — nó sắp xếp file mà không thêm đoạn'),
            B('It adds /shop to the path', 'Nó thêm /shop vào đường dẫn'),
            B('It makes the route dynamic', 'Nó làm route trở nên động'),
            B('It hides the route entirely', 'Nó ẩn hẳn route đi'),
          ],
          correct: 0,
          explanation: EX(
            'Parentheses create a route group used only to organize files or share a layout — the group name does not appear in the URL. Brackets <code>[x]</code> make dynamic segments; a leading underscore makes a private folder.',
            'Ngoặc đơn tạo một route group chỉ để sắp xếp file hoặc chia sẻ layout — tên group không xuất hiện trong URL. Ngoặc vuông <code>[x]</code> tạo đoạn động; gạch dưới ở đầu tạo thư mục riêng.',
          ),
        }),
        mcq({
          prompt: B(
            '<code>&lt;Link&gt;</code> makes navigation feel instant mainly by…',
            '<code>&lt;Link&gt;</code> làm điều hướng cảm giác tức thì chủ yếu nhờ…',
          ),
          options: [
            B('Soft client navigation plus prefetching the target', 'Điều hướng mềm phía client cộng prefetch đích'),
            B('Reloading the whole document each click', 'Tải lại cả tài liệu mỗi lần click'),
            B('Opening the target in an iframe', 'Mở đích trong một iframe'),
            B('Caching the target in localStorage', 'Cache đích trong localStorage'),
          ],
          correct: 0,
          explanation: EX(
            '<code>&lt;Link&gt;</code> does a client-side transition (no full reload) and prefetches the linked route when it scrolls into view, so the target is ready when clicked. A plain <code>&lt;a&gt;</code> would do a full document load.',
            '<code>&lt;Link&gt;</code> chuyển trang phía client (không tải lại toàn bộ) và prefetch route được liên kết khi nó lọt vào khung nhìn, nên đích sẵn sàng khi click. Một thẻ <code>&lt;a&gt;</code> thường sẽ tải lại cả tài liệu.',
          ),
        }),
        // Ch9
        mcq({
          prompt: B(
            'A Client Component can render a Server Component only when…',
            'Một Client Component có thể render một Server Component chỉ khi…',
          ),
          options: [
            B('The Server Component is passed to it as children/props', 'Server Component được truyền vào nó dưới dạng children/props'),
            B('Never — it is impossible in any way', 'Không bao giờ — hoàn toàn không thể'),
            B('It adds "use server" to the import', 'Nó thêm "use server" vào lời import'),
            B('Both are in the same file', 'Cả hai ở cùng một file'),
          ],
          correct: 0,
          explanation: EX(
            'A Client Component cannot import and render a Server Component directly (that would pull server code into the client), but a Server parent can pass a Server Component down as <code>children</code> into a Client Component, which renders it in a slot.',
            'Một Client Component không thể import và render trực tiếp một Server Component (điều đó sẽ kéo mã server vào client), nhưng một cha Server có thể truyền một Server Component xuống làm <code>children</code> cho một Client Component, và nó render vào một chỗ trống.',
          ),
        }),
        mcq({
          prompt: B(
            'Which prop CAN be passed from a Server to a Client Component? (choose TWO)',
            'Prop nào CÓ THỂ truyền từ Server sang Client Component? (chọn HAI)',
          ),
          options: [
            B('A plain object of data', 'Một object dữ liệu thuần'),
            B('A Server Action', 'Một Server Action'),
            B('A class instance with methods', 'Một thể hiện class có phương thức'),
            B('A live database connection', 'Một kết nối cơ sở dữ liệu đang mở'),
          ],
          correct: [0, 1],
          explanation: EX(
            'Serializable data (plain objects, arrays, strings, numbers) crosses the boundary, and Server Actions are specially serialized by Next so they can be passed too. Class instances with methods and live connections are not serializable.',
            'Dữ liệu tuần tự hoá được (object thuần, mảng, chuỗi, số) đi qua ranh giới, và Server Action được Next tuần tự hoá riêng nên cũng truyền được. Thể hiện class có phương thức và kết nối đang mở thì không tuần tự hoá được.',
          ),
        }),
        mcq({
          prompt: B(
            'The main benefit of keeping data fetching in Server Components is…',
            'Lợi ích chính của việc giữ tải dữ liệu trong Server Component là…',
          ),
          options: [
            B('Less client JS and secrets stay on the server', 'Ít JS client hơn và bí mật ở lại server'),
            B('Automatic two-way binding', 'Ràng buộc hai chiều tự động'),
            B('Faster CSS parsing', 'Phân tích CSS nhanh hơn'),
            B('Built-in animations', 'Hiệu ứng dựng sẵn'),
          ],
          correct: 0,
          explanation: EX(
            'Fetching on the server means the query and any keys run server-side (never shipped), and the browser gets rendered output instead of fetch code — smaller bundles, no exposed secrets, and data close to the source.',
            'Tải trên server nghĩa là truy vấn và mọi key chạy phía server (không gửi đi), và trình duyệt nhận kết quả đã render thay vì mã fetch — bundle nhỏ hơn, không lộ bí mật, và dữ liệu gần nguồn.',
          ),
        }),
        // Ch10
        mcq({
          prompt: B(
            'Two independent fetches in a Server Component that can run at the same time should use…',
            'Hai fetch độc lập trong một Server Component có thể chạy đồng thời nên dùng…',
          ),
          options: [
            B('await Promise.all([...]) to run them in parallel', 'await Promise.all([...]) để chạy song song'),
            B('await one, then await the other', 'await cái này, rồi await cái kia'),
            B('useEffect for each', 'useEffect cho mỗi cái'),
            B('cache: "no-store" on both', 'cache: "no-store" cho cả hai'),
          ],
          correct: 0,
          explanation: EX(
            'Awaiting sequentially makes the second wait for the first (waterfall). <code>Promise.all</code> starts both immediately and awaits together, cutting total time. <code>useEffect</code> is client-only and does not belong in a Server Component.',
            'await tuần tự khiến cái thứ hai chờ cái đầu (thác nước). <code>Promise.all</code> khởi động cả hai ngay và chờ cùng lúc, cắt tổng thời gian. <code>useEffect</code> chỉ chạy client và không thuộc về Server Component.',
          ),
        }),
        mcq({
          prompt: B(
            '<code>revalidateTag("posts")</code> in a Server Action does what?',
            '<code>revalidateTag("posts")</code> trong một Server Action làm gì?',
          ),
          options: [
            B('Invalidates every cached fetch tagged "posts"', 'Vô hiệu mọi fetch đã cache gắn tag "posts"'),
            B('Deletes all posts from the database', 'Xoá mọi bài viết khỏi cơ sở dữ liệu'),
            B('Adds a tag to the URL', 'Thêm một tag vào URL'),
            B('Reloads the browser', 'Tải lại trình duyệt'),
          ],
          correct: 0,
          explanation: EX(
            'Fetches tagged with <code>next: { tags: ["posts"] }</code> can be invalidated together by <code>revalidateTag("posts")</code>, so all views depending on that data refresh — a targeted alternative to <code>revalidatePath</code>. It touches the cache, not the database.',
            'Các fetch gắn <code>next: { tags: ["posts"] }</code> có thể bị vô hiệu cùng nhau bằng <code>revalidateTag("posts")</code>, nên mọi màn phụ thuộc dữ liệu đó được làm mới — một lựa chọn nhắm đích thay cho <code>revalidatePath</code>. Nó đụng cache, không đụng cơ sở dữ liệu.',
          ),
        }),
        mcq({
          prompt: B(
            'A page that reads <code>searchParams</code> is…',
            'Một trang đọc <code>searchParams</code> thì…',
          ),
          options: [
            B('Dynamically rendered per request', 'Render động theo từng request'),
            B('Statically generated at build', 'Dựng tĩnh lúc build'),
            B('A Client Component by force', 'Bị buộc thành Client Component'),
            B('Cached forever', 'Cache vĩnh viễn'),
          ],
          correct: 0,
          explanation: EX(
            'Because the output depends on request-specific query values, reading <code>searchParams</code> opts the route into dynamic rendering. If you need it static, avoid request data on that segment or push it into a small dynamic child.',
            'Vì kết quả phụ thuộc giá trị truy vấn riêng-request, đọc <code>searchParams</code> đưa route vào render động. Nếu cần tĩnh thì tránh dữ liệu request ở đoạn đó, hoặc đẩy nó vào một component con động nhỏ.',
          ),
        }),
        // Ch11
        mcq({
          prompt: B(
            'Middleware is best used for…',
            'Middleware hợp nhất để…',
          ),
          options: [
            B('Auth checks, redirects and rewrites before a route runs', 'Kiểm auth, chuyển hướng và viết lại trước khi route chạy'),
            B('Running heavy database queries per request', 'Chạy truy vấn cơ sở dữ liệu nặng theo request'),
            B('Rendering full pages of UI content', 'Render các trang giao diện đầy đủ'),
            B('Styling components with CSS classes', 'Tạo kiểu component bằng class CSS'),
          ],
          correct: 0,
          explanation: EX(
            'Middleware runs on the edge before the matched route, so it suits fast gatekeeping: check a session cookie and redirect, rewrite a path, set a header. Keep it light — heavy work belongs in the route or a Server Action.',
            'Middleware chạy ở biên trước route khớp, nên hợp với gác cổng nhanh: kiểm cookie phiên rồi chuyển hướng, viết lại đường dẫn, đặt header. Hãy giữ nó nhẹ — việc nặng để route hoặc Server Action lo.',
          ),
        }),
        mcq({
          prompt: B(
            'In a Route Handler, request query params are read from…',
            'Trong một Route Handler, tham số truy vấn của request đọc từ…',
          ),
          options: [
            B('new URL(request.url).searchParams', 'new URL(request.url).searchParams'),
            B('request.query, like in Express', 'request.query, giống như trong Express'),
            B('req.params, the Express-style object', 'req.params, object kiểu Express'),
            B('process.env at request time', 'process.env lúc có request'),
          ],
          correct: 0,
          explanation: EX(
            'App Router handlers use Web APIs: parse <code>request.url</code> with <code>new URL(...)</code> and read <code>.searchParams</code>. There is no Express-style <code>request.query</code>/<code>req.params</code> object.',
            'Handler của App Router dùng Web API: parse <code>request.url</code> bằng <code>new URL(...)</code> rồi đọc <code>.searchParams</code>. Không có object kiểu Express <code>request.query</code>/<code>req.params</code>.',
          ),
        }),
        // Ch12
        mcq({
          prompt: B(
            'A Server Action bound to <code>&lt;form action={fn}&gt;</code> works without JavaScript because…',
            'Một Server Action gắn vào <code>&lt;form action={fn}&gt;</code> chạy được khi không có JavaScript vì…',
          ),
          options: [
            B('The native form submit posts to the server (progressive enhancement)', 'Form gốc submit POST lên server (nâng cấp tiệm tiến)'),
            B('React always runs entirely on the server', 'React luôn chạy hoàn toàn trên server'),
            B('The action body is inlined into the HTML', 'Thân action được nội tuyến vào HTML'),
            B('Forms never require any JavaScript at all', 'Form không bao giờ cần chút JavaScript nào'),
          ],
          correct: 0,
          explanation: EX(
            'Because the action is wired to a real <code>&lt;form&gt;</code>, submitting posts to the server even before hydration. When JS is present, Next upgrades it into a smooth client transition — the baseline never fully breaks.',
            'Vì action được nối vào một <code>&lt;form&gt;</code> thật, submit sẽ POST lên server ngay cả trước khi hydrate. Khi có JS, Next nâng nó thành chuyển tiếp mượt phía client — trải nghiệm nền tảng không bao giờ hỏng hoàn toàn.',
          ),
        }),
        mcq({
          prompt: B(
            'Inside a Server Action, the safe way to use <code>formData.get("qty")</code> as a number is…',
            'Trong một Server Action, cách an toàn để dùng <code>formData.get("qty")</code> như một số là…',
          ),
          options: [
            B('Coerce and validate it on the server before use', 'Ép kiểu và kiểm tra nó trên server trước khi dùng'),
            B('Trust it — the form guarantees a number', 'Tin nó — form bảo đảm là một số'),
            B('Read it on the client only', 'Chỉ đọc nó trên client'),
            B('Store it as-is; the DB will validate', 'Lưu nguyên; DB sẽ kiểm'),
          ],
          correct: 0,
          explanation: EX(
            'FormData values are strings and the endpoint is public, so coerce (<code>Number(...)</code>) and validate on the server (range, NaN) before using or storing. Never assume the client sent a well-formed value.',
            'Giá trị FormData là chuỗi và endpoint là công khai, nên hãy ép kiểu (<code>Number(...)</code>) và kiểm trên server (khoảng, NaN) trước khi dùng hoặc lưu. Đừng bao giờ giả định client đã gửi một giá trị đúng dạng.',
          ),
        }),
        mcq({
          prompt: B(
            'For a like button that should feel instant while the Server Action runs, use…',
            'Với một nút thích cần cảm giác tức thì trong khi Server Action chạy, dùng…',
          ),
          options: [
            B('useOptimistic', 'useOptimistic'),
            B('useDeferredValue', 'useDeferredValue'),
            B('useTransition alone', 'useTransition đơn thuần'),
            B('useLayoutEffect', 'useLayoutEffect'),
          ],
          correct: 0,
          explanation: EX(
            '<code>useOptimistic</code> shows the expected result (+1) immediately while the action is pending, then reconciles with the server response and reverts on failure. It is purpose-built for optimistic UI over actions.',
            '<code>useOptimistic</code> hiện kết quả kỳ vọng (+1) ngay trong khi action đang chờ, rồi hoà hợp với phản hồi server và hoàn tác khi thất bại. Nó sinh ra đúng cho UI lạc quan chồng trên action.',
          ),
        }),
        // Ch13
        mcq({
          prompt: B(
            'On cuongthai.com, Tailwind <code>dark:</code> variants are reserved for…',
            'Trên cuongthai.com, các biến thể <code>dark:</code> của Tailwind dành riêng cho…',
          ),
          options: [
            B('The Notes wrapper (.notes-theme-root gets .dark)', 'Vỏ Notes (.notes-theme-root nhận .dark)'),
            B('The whole site via html.dark', 'Cả site qua html.dark'),
            B('The landing page only', 'Chỉ trang landing'),
            B('Print stylesheets', 'Stylesheet lúc in'),
          ],
          correct: 0,
          explanation: EX(
            'Global dark styling uses <code>theme-dark</code> / CSS variables; the Tailwind <code>dark:</code> variant (which keys off a <code>.dark</code> ancestor) is reserved for the Notes module, whose provider puts <code>.dark</code> on <code>.notes-theme-root</code>. Putting <code>dark</code> globally breaks Notes.',
            'Tạo kiểu tối toàn cục dùng <code>theme-dark</code> / biến CSS; biến thể <code>dark:</code> của Tailwind (bật theo tổ tiên có <code>.dark</code>) dành riêng cho module Notes, provider của nó đặt <code>.dark</code> lên <code>.notes-theme-root</code>. Đặt <code>dark</code> toàn cục sẽ phá Notes.',
          ),
        }),
        mcq({
          prompt: B(
            'A dark surface with theme variables set still shows black-on-black. The safe test is…',
            'Một bề mặt tối đã đặt biến theme vẫn hiện đen-trên-đen. Cách kiểm an toàn là…',
          ),
          options: [
            B('Flip light↔dark and actually read the text', 'Lật sáng↔tối và đọc thử chữ'),
            B('Count the number of CSS variables', 'Đếm số biến CSS'),
            B('Check only the light theme', 'Chỉ kiểm theme sáng'),
            B('Trust that variables imply colors', 'Tin rằng biến đã hàm ý màu'),
          ],
          correct: 0,
          explanation: EX(
            'Because the bug is contrast (black on black), the reliable check is to flip themes and read — measure the effect, not the count of variables. Pinning variables is not enough; the text needs an explicit <code>color</code>.',
            'Vì lỗi là độ tương phản (đen trên đen), cách kiểm đáng tin là lật theme và đọc — đo hiệu ứng, không đếm số biến. Ghim biến chưa đủ; chữ cần một <code>color</code> rõ ràng.',
          ),
        }),
        // Ch14
        mcq({
          prompt: B(
            'Which pairing of state tools is idiomatic?',
            'Cặp công cụ state nào là đúng chất?',
          ),
          options: [
            B('useState/Zustand for UI state, TanStack Query for server data', 'useState/Zustand cho state giao diện, TanStack Query cho dữ liệu server'),
            B('TanStack Query for UI state, useState for server data', 'TanStack Query cho state giao diện, useState cho dữ liệu server'),
            B('Redux for everything, no exceptions', 'Redux cho mọi thứ, không ngoại lệ'),
            B('Context for high-frequency values', 'Context cho các giá trị tần suất cao'),
          ],
          correct: 0,
          explanation: EX(
            'Split by concern: client UI state → <code>useState</code>/Zustand; async server data (with caching/refetch) → TanStack Query. Using Query for pure UI state or Context for hot values is a mismatch that causes complexity or render storms.',
            'Chia theo mối bận tâm: state giao diện phía client → <code>useState</code>/Zustand; dữ liệu server bất đồng bộ (kèm cache/tải lại) → TanStack Query. Dùng Query cho state giao diện thuần hay Context cho giá trị "nóng" là lệch, gây phức tạp hoặc bão render.',
          ),
        }),
        mcq({
          prompt: B(
            'A persisted store shows the default value on first paint after reload because…',
            'Một store đã lưu hiện giá trị mặc định ở lần vẽ đầu sau khi tải lại vì…',
          ),
          options: [
            B('It rehydrates from storage after the first render', 'Nó nạp lại từ storage sau lần render đầu'),
            B('The store lost its data', 'Store mất dữ liệu'),
            B('Persistence is disabled by Next', 'Việc lưu bị Next tắt'),
            B('The server cleared it', 'Server đã xoá nó'),
          ],
          correct: 0,
          explanation: EX(
            '<code>localStorage</code> is client-only and read shortly after mount, so the first render uses the default and the saved value pops in after rehydration — a brief flash. Guard dependent UI (a <code>mounted</code> flag) until rehydration completes.',
            '<code>localStorage</code> chỉ có ở client và được đọc ngay sau mount, nên lần render đầu dùng mặc định và giá trị đã lưu hiện ra sau khi nạp lại — một cái nháy ngắn. Hãy chặn phần UI phụ thuộc (một cờ <code>mounted</code>) cho tới khi nạp lại xong.',
          ),
        }),
        // Ch15
        mcq({
          prompt: B(
            'To keep sessions alive without a long-lived access token, you add…',
            'Để giữ phiên sống mà không cần access token sống dài, bạn thêm…',
          ),
          options: [
            B('A refresh endpoint plus a 401 interceptor that retries', 'Một endpoint refresh cộng một interceptor 401 tự thử lại'),
            B('A longer cookie Max-Age and nothing else', 'Chỉ một Max-Age cookie dài hơn, không gì khác'),
            B('A NEXT_PUBLIC_ token exposed to the client', 'Một token NEXT_PUBLIC_ lộ ra cho client'),
            B('More logging of the token for debugging', 'Ghi log token nhiều hơn để gỡ lỗi'),
          ],
          correct: 0,
          explanation: EX(
            'A short access token plus a working <code>/auth/refresh</code> (and a 401 interceptor that refreshes once and retries) keeps sessions alive and self-healing. The cuongthai.com bug was exactly a missing refresh under a 7-day cookie.',
            'Một access token ngắn cộng một <code>/auth/refresh</code> hoạt động (và một interceptor 401 tự refresh một lần rồi thử lại) giữ phiên sống và tự lành. Lỗi cuongthai.com đúng là thiếu refresh dưới một cookie 7 ngày.',
          ),
        }),
        mcq({
          prompt: B(
            'A cookie should have <code>HttpOnly</code>, <code>Secure</code>, and <code>SameSite</code> to defend against…',
            'Một cookie nên có <code>HttpOnly</code>, <code>Secure</code>, và <code>SameSite</code> để phòng…',
          ),
          options: [
            B('Script theft, insecure transport, and cross-site sending', 'Bị script đánh cắp, truyền không an toàn, và gửi liên trang'),
            B('Slow server-side rendering of the page', 'Render trang phía server chậm'),
            B('Large JavaScript bundle sizes', 'Kích thước bundle JavaScript lớn'),
            B('CSS conflicts between components', 'Xung đột CSS giữa các component'),
          ],
          correct: 0,
          explanation: EX(
            '<code>HttpOnly</code> blocks JS reads (XSS theft), <code>Secure</code> forces HTTPS-only transport, and <code>SameSite</code> limits cross-site sending (CSRF). Together they harden a session cookie.',
            '<code>HttpOnly</code> chặn JS đọc (XSS đánh cắp), <code>Secure</code> ép chỉ truyền qua HTTPS, và <code>SameSite</code> hạn chế gửi liên trang (CSRF). Cùng nhau chúng gia cố một cookie phiên.',
          ),
        }),
        mcq({
          prompt: B(
            'An unauth <code>curl</code> returning 200 for a GET route means the route is…',
            'Một <code>curl</code> không auth trả 200 cho một route GET nghĩa là route…',
          ),
          options: [
            B('Mounted and public', 'Đã mount và công khai'),
            B('Not mounted', 'Chưa mount'),
            B('Requiring auth', 'Cần auth'),
            B('Broken', 'Hỏng'),
          ],
          correct: 0,
          explanation: EX(
            'For route-health diagnosis: 200 = mounted and public; 401 = mounted, needs auth; 404 = not mounted (stale/partial build). This is how the deploy smoke-test tells a healthy build from a stale one.',
            'Để chẩn đoán sức khoẻ route: 200 = đã mount và công khai; 401 = đã mount, cần auth; 404 = chưa mount (build cũ/dở). Đây là cách smoke-test khi deploy phân biệt build khoẻ với build cũ.',
          ),
        }),
        // Ch16
        mcq({
          prompt: B(
            'The single source of truth for a form&#x27;s type and validation should be…',
            'Nguồn sự thật duy nhất cho kiểu và validation của một form nên là…',
          ),
          options: [
            B('One Zod schema, with z.infer for the type', 'Một schema Zod, dùng z.infer cho kiểu'),
            B('A hand-written type plus separate manual checks', 'Một kiểu viết tay cộng các phép kiểm thủ công riêng'),
            B('Only PropTypes', 'Chỉ PropTypes'),
            B('The database schema alone', 'Chỉ schema cơ sở dữ liệu'),
          ],
          correct: 0,
          explanation: EX(
            'Define one Zod schema and derive the TS type with <code>z.infer</code>, so compile-time types and runtime validation cannot drift apart. A separate hand-written type and manual checks are two sources that can disagree.',
            'Định nghĩa một schema Zod và suy ra kiểu TS bằng <code>z.infer</code>, để kiểu lúc biên dịch và validation lúc chạy không thể lệch nhau. Một kiểu viết tay riêng cộng phép kiểm thủ công là hai nguồn có thể mâu thuẫn.',
          ),
        }),
        mcq({
          prompt: B(
            'For an upload, the server must enforce…',
            'Với một lần upload, server phải áp…',
          ),
          options: [
            B('Real content-type and a max size, not just the extension', 'Loại nội dung thật và kích thước tối đa, không chỉ phần mở rộng'),
            B('Only the length of the file name', 'Chỉ độ dài của tên file'),
            B('Nothing at all if the client already checked', 'Không gì cả nếu client đã kiểm'),
            B('A CAPTCHA challenge on every file', 'Một thử thách CAPTCHA cho mỗi file'),
          ],
          correct: 0,
          explanation: EX(
            'Client checks can be bypassed, so the server validates the actual MIME/content type and enforces a size cap before storing. The extension alone lies (rename anything to .jpg) — a real cuongthai.com hardening.',
            'Kiểm phía client có thể bị đi vòng, nên server kiểm loại MIME/nội dung thật và áp trần kích thước trước khi lưu. Chỉ phần mở rộng thì gian dối (đổi tên gì cũng thành .jpg) — một lần gia cố thật của cuongthai.com.',
          ),
        }),
        // Ch17
        mcq({
          prompt: B(
            'A personalized dashboard that differs per user is best rendered with…',
            'Một dashboard cá nhân hoá khác nhau theo từng người dùng nên được render bằng…',
          ),
          options: [
            B('SSR (dynamic per request)', 'SSR (động theo từng request)'),
            B('SSG (one static build)', 'SSG (một bản build tĩnh)'),
            B('ISR with a long revalidate', 'ISR với revalidate dài'),
            B('A plain static HTML file', 'Một file HTML tĩnh thuần'),
          ],
          correct: 0,
          explanation: EX(
            'Per-user content depends on the request (cookies/session), so it must render dynamically (SSR). SSG/ISR pre-render shared output at build and cannot vary per user; a static file cannot personalize at all.',
            'Nội dung theo từng người dùng phụ thuộc request (cookie/phiên), nên phải render động (SSR). SSG/ISR dựng sẵn kết quả dùng chung lúc build và không thể khác theo từng người; một file tĩnh không cá nhân hoá được.',
          ),
        }),
        mcq({
          prompt: B(
            'When the title depends on fetched data (e.g. a post), set it with…',
            'Khi tiêu đề phụ thuộc dữ liệu đã tải (ví dụ một bài viết), đặt nó bằng…',
          ),
          options: [
            B('generateMetadata (async) in the page/layout', 'generateMetadata (async) trong page/layout'),
            B('A static metadata object', 'Một object metadata tĩnh'),
            B('document.title in an effect', 'document.title trong một effect'),
            B('A meta tag in JSX', 'Một thẻ meta trong JSX'),
          ],
          correct: 0,
          explanation: EX(
            'When the head depends on data, use the async <code>generateMetadata({ params })</code> so Next fetches and renders the correct title/description on the server. A static <code>metadata</code> object is for fixed values.',
            'Khi phần head phụ thuộc dữ liệu, hãy dùng <code>generateMetadata({ params })</code> bất đồng bộ để Next tải và render đúng tiêu đề/mô tả trên server. Một object <code>metadata</code> tĩnh dành cho giá trị cố định.',
          ),
        }),
        // Ch18
        mcq({
          prompt: B(
            'A required prop of <code>next/image</code> that prevents layout shift is…',
            'Một prop bắt buộc của <code>next/image</code> giúp chặn xô lệch bố cục là…',
          ),
          options: [
            B('width/height (or fill) to reserve space', 'width/height (hoặc fill) để giữ chỗ'),
            B('loading="eager" set on every image', 'loading="eager" đặt trên mọi ảnh'),
            B('a descriptive title attribute', 'một thuộc tính title mô tả'),
            B('the crossOrigin attribute', 'thuộc tính crossOrigin'),
          ],
          correct: 0,
          explanation: EX(
            'Providing <code>width</code>/<code>height</code> (or using <code>fill</code> in a sized box) reserves the layout space before the image loads, killing Cumulative Layout Shift. Eager loading would hurt performance for offscreen images.',
            'Cung cấp <code>width</code>/<code>height</code> (hoặc dùng <code>fill</code> trong một hộp đã định kích thước) giữ chỗ bố cục trước khi ảnh tải, diệt Cumulative Layout Shift. Tải sốt sắng lại hại hiệu năng với ảnh ngoài màn hình.',
          ),
        }),
        mcq({
          prompt: B(
            'Code-splitting a heavy, rarely-used component is done with…',
            'Chia nhỏ mã một component nặng, ít dùng được làm bằng…',
          ),
          options: [
            B('next/dynamic (dynamic import)', 'next/dynamic (dynamic import)'),
            B('React.memo', 'React.memo'),
            B('useCallback', 'useCallback'),
            B('A larger revalidate', 'Một revalidate lớn hơn'),
          ],
          correct: 0,
          explanation: EX(
            '<code>next/dynamic</code> splits the component into its own chunk loaded on demand, shrinking the initial bundle. <code>React.memo</code>/<code>useCallback</code> reduce re-renders, not bundle size; <code>revalidate</code> is about caching.',
            '<code>next/dynamic</code> tách component thành một chunk riêng tải theo nhu cầu, làm nhỏ bundle ban đầu. <code>React.memo</code>/<code>useCallback</code> giảm render lại, không phải kích thước bundle; <code>revalidate</code> là về cache.',
          ),
        }),
        // Ch19
        mcq({
          prompt: B(
            'A good test suite has…',
            'Một bộ test tốt có…',
          ),
          options: [
            B('Many fast unit tests and a few high-value E2E flows', 'Nhiều unit test nhanh và một vài luồng E2E giá trị cao'),
            B('Only end-to-end tests and nothing else', 'Chỉ end-to-end test, không gì khác'),
            B('Only snapshot tests of the markup', 'Chỉ snapshot test của markup'),
            B('No tests at all, just TypeScript types', 'Không test gì, chỉ kiểu TypeScript'),
          ],
          correct: 0,
          explanation: EX(
            'The testing pyramid: lots of fast, focused unit/component tests at the base and a small number of end-to-end tests for critical user journeys. All-E2E is slow and flaky; types alone do not check behaviour.',
            'Kim tự tháp test: nhiều unit/component test nhanh, tập trung ở đáy và một số ít end-to-end test cho các hành trình quan trọng. Toàn E2E thì chậm và hay chập chờn; chỉ kiểu thì không kiểm được hành vi.',
          ),
        }),
        mcq({
          prompt: B(
            'The cuongthai.com enum-rename incident is closed by adding to the checklist…',
            'Sự cố đổi tên enum của cuongthai.com được đóng lại bằng cách thêm vào checklist…',
          ),
          options: [
            B('typecheck:seed and actually running the seed', 'typecheck:seed và chạy seed thật'),
            B('Only running tsc a few more times', 'Chỉ chạy tsc thêm vài lần'),
            B('Deleting the enum from the schema', 'Xoá enum khỏi schema'),
            B('Disabling the seed step entirely', 'Tắt hẳn bước seed'),
          ],
          correct: 0,
          explanation: EX(
            'Because <code>tsc</code> excluded <code>prisma/**</code> and the seed self-referenced its own union, the fix is a dedicated <code>typecheck:seed</code> plus running <code>prisma db seed</code> — some breakage is only visible by running the code.',
            'Vì <code>tsc</code> loại trừ <code>prisma/**</code> và seed tự tham chiếu union của chính nó, cách sửa là một <code>typecheck:seed</code> riêng cộng chạy <code>prisma db seed</code> — có hỏng hóc chỉ lộ khi chạy mã.',
          ),
        }),
        // Ch20
        mcq({
          prompt: B(
            'Why keep deploys off the git push trigger on cuongthai.com?',
            'Vì sao giữ việc deploy tách khỏi trigger git push trên cuongthai.com?',
          ),
          options: [
            B('Two push-triggered deploys once raced into real outages', 'Hai lần deploy do push từng đua nhau gây sự cố thật'),
            B('Pushing is not allowed at all', 'Không được phép push chút nào'),
            B('GitHub cannot run deploys', 'GitHub không chạy deploy được'),
            B('Deploys are free only on weekends', 'Deploy chỉ miễn phí cuối tuần'),
          ],
          correct: 0,
          explanation: EX(
            'On cuongthai.com two push-triggered deploy workflows raced each other into outages, so deploys became manual (<code>deploy.sh</code>) and the deploy workflows are dispatch-only. A push to main now only runs lint/type-check.',
            'Trên cuongthai.com hai workflow deploy do push đua nhau gây sự cố, nên deploy chuyển sang thủ công (<code>deploy.sh</code>) và các workflow deploy chỉ chạy tay. Một push lên main giờ chỉ chạy lint/kiểm kiểu.',
          ),
        }),
        mcq({
          prompt: B(
            'A CDN returned 404 for hours on a URL whose file now exists. Why?',
            'Một CDN trả 404 hàng giờ cho một URL mà file giờ đã tồn tại. Vì sao?',
          ),
          options: [
            B('The CDN cached the earlier 404 for its TTL', 'CDN đã cache cái 404 trước đó suốt TTL của nó'),
            B('404s are never cached', '404 không bao giờ được cache'),
            B('The origin is down', 'Origin đang sập'),
            B('The file is corrupt', 'File bị hỏng'),
          ],
          correct: 0,
          explanation: EX(
            'CDNs cache negative responses too. Probing a URL before the file exists locks in a 404 for the TTL. Verify uploads with a cache-busting query (<code>?cb=...</code>), and if a URL is poisoned, change the URL rather than waiting.',
            'CDN cache cả phản hồi phủ định. Thăm dò một URL trước khi có file khoá cứng một 404 suốt TTL. Hãy kiểm upload bằng một query phá cache (<code>?cb=...</code>), và nếu một URL đã nhiễm độc thì đổi URL chứ đừng chờ.',
          ),
        }),
        mcq({
          prompt: B(
            'After changing files in <code>frontend/public/**</code> in local dev, you must…',
            'Sau khi đổi file trong <code>frontend/public/**</code> ở môi trường dev, bạn phải…',
          ),
          options: [
            B('Restart the Next dev server (it fixes the file list at startup)', 'Khởi động lại server dev của Next (nó chốt danh sách file lúc khởi động)'),
            B('Do nothing — Next hot-reloads public files', 'Không làm gì — Next tự nạp nóng file public'),
            B('Rebuild the production Docker image locally', 'Dựng lại image Docker production ở máy'),
            B('Clear the local development database', 'Xoá cơ sở dữ liệu dev ở máy'),
          ],
          correct: 0,
          explanation: EX(
            'Next fixes the list of <code>public/</code> files when the server starts, so a rebuilt asset with a new hashed name can 404 until you restart — a real "stuck loading, no error" bug (the /playground incident). Production is unaffected (each deploy is a fresh container).',
            'Next chốt danh sách file <code>public/</code> khi server khởi động, nên một tài nguyên dựng lại với tên băm mới có thể 404 cho tới khi bạn khởi động lại — một lỗi thật "kẹt màn tải, không lỗi nào" (sự cố /playground). Production không dính (mỗi deploy là một container mới).',
          ),
        }),
        // Ch11 (bổ sung)
        mcq({
          prompt: B(
            'The "photo opens in a modal over the feed, but a direct visit shows the full page" pattern uses…',
            'Mẫu "ảnh mở trong modal đè lên feed, nhưng vào thẳng URL thì hiện trang đầy đủ" dùng…',
          ),
          options: [
            B('Intercepting routes with a parallel @modal slot', 'Intercepting route với một slot song song @modal'),
            B('A single client-side modal with no routing', 'Một modal client đơn thuần không định tuyến'),
            B('Two separate pages sharing one component', 'Hai trang riêng dùng chung một component'),
            B('A middleware rewrite on every request', 'Một lần viết lại trong middleware ở mỗi request'),
          ],
          correct: 0,
          explanation: EX(
            'An intercepting route catches an in-app navigation to the photo URL and renders it inside a parallel <code>@modal</code> slot over the current page; a hard/direct load of the same URL renders the standalone page. One URL, two presentations.',
            'Một intercepting route bắt điều hướng trong ứng dụng tới URL ảnh và render nó trong một slot song song <code>@modal</code> đè lên trang hiện tại; tải thẳng chính URL đó thì render trang độc lập. Một URL, hai cách trình bày.',
          ),
        }),
      ],
    },
  ],
};
